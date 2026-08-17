import { defineTool } from "@deepseek-ai/dsh-tools";
import { Service } from "@deepseek-ai/cordis";
import { bindTypertRemote, Remote } from "@deepseek-ai/dsh-typert-protocol";
import { BlockAssembler, createUserMessage } from "@deepseek-ai/dsh-llm";
import { defineDomain, domainTable } from "@deepseek-ai/dsh-storage-domain";
import z from "zod";
import { unlink } from "node:fs/promises";
import { join } from "node:path";
import { homedir } from "node:os";

/**
 * Chords — host half (see package.json for the version).
 * - Registers the model-facing chords tool (global layer) + guidance section.
 * - Registers a Typert Remote service `chords` (SRC path): the browser card
 *   calls chords/regenerate in the background so edits never touch the
 *   conversation. The regeneration runs as an auxiliary LLM call on the host.
 * @module dsh-chords
 */
const name = "chords";
const inject = ["tools", "systemPrompt", "llm"];

/** Model route for background regeneration; set in apply from entry config. */
let chordsRoute = {
  provider: "deepseek-official",
  model: "deepseek-v4-flash",
  strongModel: "",
  smallLines: 200,
  largeLines: 500,
  effortSmall: "off",
  effortLarge: "high",
  maxTokens: 8192,
  maxTokensLarge: 16384,
  maxTokensHuge: 131072,
  timeoutMs: 180000,
  timeoutMsLarge: 360000,
  timeoutMsHuge: 900000
};

/** Mainstream-provider model tiers. Model names are examples to be adjusted per deployment; the wire parameters are handled by each provider's DSH adapter, not here. */
const chordsProviders = {
  "deepseek-official": { default: "deepseek-v4-flash", strong: "deepseek-v4-pro" },
  openai: { default: "gpt-4o-mini", strong: "gpt-4o" },
  anthropic: { default: "claude-sonnet-4", strong: "claude-opus-4" },
  moonshot: { default: "moonshot-v1-8k", strong: "moonshot-v1-128k" },
  "z-ai": { default: "glm-4-flash", strong: "glm-4-plus" },
  volcengine: { default: "doubao-1-5-pro-32k", strong: "doubao-1-5-pro-256k" },
  xai: { default: "grok-3-mini", strong: "grok-3" },
  google: { default: "gemini-2.0-flash", strong: "gemini-2.5-pro" },
  minimax: { default: "MiniMax-Text-01", strong: "MiniMax-M1" }
};

/** Documents untouched for this many days are treated as stale and dropped from reads. */
let chordsTtlDays = 14;

/** Locale per session (from the latest background request), for the runtime context text. */
const sessionLocales = new Map();

const PROMPT_LABELS = {
  zh: {
    title: "标题：", lang: "语言：", block: "修改块：", old: "原伪代码：", newP: "新伪代码：",
    inst: "重设计指令：", suggest: "建议分块数：", ref: "原始块 JSON：", code: "当前代码：",
    regen: "现在重新生成，只返回那个 JSON 对象。", redesign: "现在按指令重新设计并返回那个 JSON 对象。",
    retryJson: "你的上一次回复不是合法的 JSON 对象（或缺少 code/blocks 字段）。请重新输出，只包含一个合法的 JSON 对象；code 字段里的换行必须转义为 \\n；不要使用代码围栏，不要输出任何其他文字。"
  },
  en: {
    title: "Title: ", lang: "Language: ", block: "Block to edit: ", old: "Old pseudocode: ", newP: "New pseudocode: ",
    inst: "Redesign instruction: ", suggest: "Suggested block count: ", ref: "Original blocks JSON: ", code: "Current code:",
    regen: "Regenerate now and return only that JSON object.", redesign: "Redesign per the instruction and return only that JSON object.",
    retryJson: "Your previous reply was not a valid JSON object (or lacked code/blocks). Output only one valid JSON object; newlines inside the code field must be escaped as \\n; no fences, no other text."
  }
};

function L(locale, key) {
  const table = locale === "en" ? PROMPT_LABELS.en : PROMPT_LABELS.zh;
  return table[key] !== undefined ? table[key] : PROMPT_LABELS.zh[key];
}

/** Opened storage-domain handle; null while unavailable or closed. */
let domain = null;

/** Pending durability promises per doc key (for the persisted flag on regenerate). */
const docPuts = new Map();

const docSchema = z.object({
  key: z.string(),
  title: z.string(),
  code: z.string(),
  language: z.string(),
  blocks: z.any(),
  version: z.number().int(),
  summary: z.string(),
  updatedAt: z.number()
});
const logSchema = z.object({
  entries: z.array(z.object({ title: z.string(), version: z.number().int(), summary: z.string() }))
});
const historySchema = z.object({
  entries: z.array(z.object({
    version: z.number().int(),
    code: z.string(),
    blocks: z.any(),
    summary: z.string(),
    updatedAt: z.number()
  }))
});
const renameSchema = z.object({
  newTitle: z.string(),
  updatedAt: z.number()
});
const lensDomainSpec = defineDomain({
  name: "code_lens",
  // v2: discard legacy pre-marker documents; v3 adds version history; v4 adds renames.
  version: 4,
  tables: {
    docs: domainTable(docSchema),
    logs: domainTable(logSchema),
    history: domainTable(historySchema),
    renames: domainTable(renameSchema)
  }
});

/** Latest lens documents keyed by session + title, plus per-session edit logs. */
const lensDocs = new Map();
const editLogs = new Map();

function docKey(sessionId, title) {
  return (sessionId || "") + "\u0000" + title;
}

/** Append one history entry and cap the list at maxEntries (oldest dropped; ascending version order). */
function appendHistoryEntry(cur, entry, maxEntries = 20) {
  const entries = (cur && Array.isArray(cur.entries) ? cur.entries : []).slice(-(maxEntries - 1));
  entries.push(entry);
  return { entries };
}

function recordDoc(title, code, language, blocks, summary, sessionId) {
  const key = docKey(sessionId, title);
  const prev = lensDocs.get(key);
  const version = (prev ? prev.version : 0) + 1;
  const doc = { key, title, code, language: typeof language === "string" ? language : "", blocks, version, summary: typeof summary === "string" ? summary : "", updatedAt: Date.now() };
  lensDocs.set(key, doc);
  if (domain) {
    const put = domain.table("docs").put(key, { key, title, code, language: doc.language, blocks, version, summary: doc.summary, updatedAt: doc.updatedAt });
    docPuts.set(key, put);
    put.then(() => docPuts.delete(key), () => docPuts.delete(key)).catch(() => {});
    put.catch((error) => {
      console.warn("chords: doc persist failed:", error && error.message);
    });
    if (prev) {
      const entry = { version: prev.version, code: prev.code, blocks: prev.blocks, summary: typeof prev.summary === "string" ? prev.summary : "", updatedAt: prev.updatedAt };
      const appendHistory = (cur) => appendHistoryEntry(cur, entry);
      // Atomic read-modify-write on the domain write chain; the missing-key case (first write) falls back to put.
      domain.table("history").update(key, appendHistory).catch(() => {
        domain.table("history").put(key, { entries: [entry] }).catch((error) => {
          console.warn("chords: history persist failed:", error && error.message);
        });
      }).catch((error) => {
        console.warn("chords: history persist failed:", error && error.message);
      });
    }
  }
  if (typeof summary === "string" && summary !== "") {
    const sid = sessionId || "";
    let log = editLogs.get(sid);
    if (!log) { log = []; editLogs.set(sid, log); }
    log.unshift({ title, version, summary });
    if (log.length > 10) log.length = 10;
    if (domain) {
      domain.table("logs").put(sid, { entries: log.slice() }).catch((error) => {
        console.warn("chords: log persist failed:", error && error.message);
      });
    }
  }
  return doc;
}

function isFresh(doc) {
  return typeof doc.updatedAt === "number" && doc.updatedAt >= Date.now() - chordsTtlDays * 86400000;
}

function purgeStale() {
  const cutoff = Date.now() - chordsTtlDays * 86400000;
  for (const [key, doc] of lensDocs.entries()) {
    if (typeof doc.updatedAt !== "number" || doc.updatedAt < cutoff) {
      lensDocs.delete(key);
      if (domain) domain.table("docs").delete(key).catch(() => {});
    }
  }
}

/** The json backend unit file path (mirrors the composition root dshHomePath(storages)). */
function chordsUnitPath() {
  const home = process.env.DSH_HOME || join(homedir(), ".dsh");
  return join(home, "storages", "code_lens.json");
}

/** Cycle-safe bounded walk over a rename map; rows come from a getter (pure, no domain). */
function walkRenameChain(getRow, start, maxSteps = 100) {
  let current = start;
  const seen = new Set();
  for (let i = 0; i < maxSteps; i++) {
    if (seen.has(current)) return current;
    seen.add(current);
    const row = getRow(current);
    if (!row || typeof row.newTitle !== "string" || row.newTitle === "") return current;
    current = row.newTitle;
  }
  return current;
}

/** True when renaming to newTitle would make its chain land back on effectiveTitle (a cycle). */
function wouldCreateRenameCycle(getRow, effectiveTitle, newTitle) {
  return walkRenameChain(getRow, newTitle) === effectiveTitle;
}

/** Follow the rename chain to the current title (cycle-safe bounded walk). */
function resolveRename(sessionId, title) {
  if (!domain) return title;
  return walkRenameChain((current) => domain.table("renames").get(docKey(sessionId, current)), title);
}

function dropSessionDocs(sessionId) {
  const prefix = sessionId + "\u0000";
  for (const [key, doc] of lensDocs.entries()) {
    if (key.startsWith(prefix)) {
      lensDocs.delete(key);
      if (domain) domain.table("docs").delete(key).catch(() => {});
    }
  }
  if (domain) {
    const hKeys = [...domain.table("history").keys()].filter((k) => k.startsWith(prefix));
    for (const k of hKeys) domain.table("history").delete(k).catch(() => {});
    const rKeys = [...domain.table("renames").keys()].filter((k) => k.startsWith(prefix));
    for (const k of rKeys) domain.table("renames").delete(k).catch(() => {});
  }
  editLogs.delete(sessionId);
  if (domain) domain.table("logs").delete(sessionId).catch(() => {});
}

function hydrateFromDomain() {
  if (!domain) return;
  try {
    for (const [key, row] of domain.table("docs").entries()) {
      lensDocs.set(key, {
        key,
        title: row.title,
        code: row.code,
        language: typeof row.language === "string" ? row.language : "",
        blocks: row.blocks,
        version: row.version,
        summary: typeof row.summary === "string" ? row.summary : "",
        updatedAt: row.updatedAt
      });
    }
    for (const [sid, row] of domain.table("logs").entries()) {
      if (Array.isArray(row.entries)) editLogs.set(sid, row.entries);
    }
    // Self-heal rename shadows: a document sitting under an old (renamed-away) title is a
    // stale write from before title resolution. Promote it onto the current title when it
    // is newer than the target; otherwise drop it.
    for (const [rk, row] of domain.table("renames").entries()) {
      const sep = rk.lastIndexOf("\u0000");
      if (sep <= 0 || !row || typeof row.newTitle !== "string" || row.newTitle === "") continue;
      const sid = rk.slice(0, sep);
      const oldTitle = rk.slice(sep + 1);
      if (row.newTitle === oldTitle) continue;
      const oldKey = docKey(sid, oldTitle);
      const newKey = docKey(sid, row.newTitle);
      const shadow = lensDocs.get(oldKey);
      if (!shadow) continue;
      const target = lensDocs.get(newKey);
      if (target) {
        if (typeof shadow.updatedAt === "number" && typeof target.updatedAt === "number" && shadow.updatedAt > target.updatedAt) {
          const prevEntry = { version: target.version, code: target.code, blocks: target.blocks, summary: typeof target.summary === "string" ? target.summary : "", updatedAt: target.updatedAt };
          target.code = shadow.code;
          target.blocks = shadow.blocks;
          target.language = typeof shadow.language === "string" ? shadow.language : "";
          target.summary = typeof shadow.summary === "string" ? shadow.summary : "";
          target.updatedAt = shadow.updatedAt;
          target.version = target.version + 1;
          domain.table("docs").put(newKey, { key: newKey, title: target.title, code: target.code, language: target.language, blocks: target.blocks, version: target.version, summary: target.summary, updatedAt: target.updatedAt }).catch(() => {});
          // Keep the displaced version browsable in the history chain.
          domain.table("history").update(newKey, (cur) => {
            const entries = (cur && Array.isArray(cur.entries) ? cur.entries : []).slice(-19);
            entries.push(prevEntry);
            return { entries };
          }).catch(() => {
            domain.table("history").put(newKey, { entries: [prevEntry] }).catch(() => {});
          });
        }
        lensDocs.delete(oldKey);
        domain.table("docs").delete(oldKey).catch(() => {});
        domain.table("history").delete(oldKey).catch(() => {});
      } else {
        shadow.key = newKey;
        shadow.title = row.newTitle;
        lensDocs.delete(oldKey);
        lensDocs.set(newKey, shadow);
        domain.table("docs").delete(oldKey).catch(() => {});
        domain.table("docs").put(newKey, { key: newKey, title: row.newTitle, code: shadow.code, language: shadow.language, blocks: shadow.blocks, version: shadow.version, summary: shadow.summary, updatedAt: shadow.updatedAt }).catch(() => {});
        const h = domain.table("history").get(oldKey);
        if (h) {
          domain.table("history").delete(oldKey).catch(() => {});
          domain.table("history").put(newKey, h).catch(() => {});
        }
      }
    }
    purgeStale();
  } catch (error) {
    console.warn("chords: domain hydration failed:", error && error.message);
  }
}

function splitLines(text) {
  return String(text).replace(/\r\n/g, "\n").split("\n");
}

/** Model tier for a code line count under the given route thresholds (small / medium / large). */
function tierForLineCount(lineCount, route) {
  return lineCount > route.largeLines ? "large" : (lineCount > route.smallLines ? "medium" : "small");
}

/** 0-based line index of the anchor start in code, or null when not found.
 * KEEP IN SYNC with the same-named implementation in lib/client.js (client bundle). */
function anchorLineIndex(codeText, anchor) {
  const code = String(codeText).replace(/\r\n/g, "\n");
  const text = String(anchor).replace(/\r\n/g, "\n");
  if (text.trim() === "") return null;
  const exact = code.indexOf(text);
  if (exact !== -1) {
    let n = 0;
    for (let i = 0; i < exact; i++) if (code.charCodeAt(i) === 10) n += 1;
    return n;
  }
  const aLines = splitLines(text);
  const cLines = splitLines(code);
  for (let i = 0; i + aLines.length <= cLines.length; i++) {
    let ok = true;
    for (let j = 0; j < aLines.length; j++) {
      if (cLines[i + j].trim() !== aLines[j].trim()) { ok = false; break; }
    }
    if (ok) return i;
  }
  return null;
}

/** Lenient JSON extraction from a model answer (fences tolerated). */
function extractJson(text) {
  let cleaned = String(text).trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();
  try { return JSON.parse(cleaned); } catch { /* fall through to bracket extraction */ }
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end <= start) return null;
  try { return JSON.parse(cleaned.slice(start, end + 1)); } catch { return null; }
}

const REGEN_SYSTEM = [
  "You are the Chords regeneration engine inside DeepSeek Harness.",
  "Regenerate code from one edited pseudocode block. Rules:",
  "- Honor ONLY the stated block change; keep every other behavior equivalent.",
  "- Keep the same chunk structure (ids) unless the change forces a split or merge.",
  "- The edited block gets certainty \"explicit\"; unchanged blocks keep their original values.",
  "- Keep it compact: pseudocode at most 35 CJK characters or 25 words per block; include complexity and rationale only when they add real value.",
  "- Every block MUST include an anchor: a verbatim copy of its first 1-3 code lines, exactly as they appear in the code you return (never paraphrase).",
  "- Answer with ONE JSON object only, shape:",
  "  {\"code\": string, \"summary\": string, \"blocks\": [{\"id\": string, \"anchor\": string, \"lines\"?: string, \"pseudocode\": string, \"certainty\": \"explicit\"|\"inferred\"|\"default\", \"complexity\"?: {\"time\"?: string, \"space\"?: string}, \"rationale\"?: string}]}",
  "- summary: one short sentence in the user language describing the change.",
  "- No markdown, no code fences, no extra text."
].join("\n");

const REDESIGN_SYSTEM = [
  "You are the Chords redesign engine inside DeepSeek Harness.",
  "Redesign the given code according to the user natural-language instruction. Rules:",
  "- Follow the instruction; keep anything the instruction does not mention as close to the original as reasonable.",
  "- Re-chunk freely: blocks may be added, removed, split, or merged; ids like b1, b2, b3 in order.",
  "- certainty: explicit for parts the user directly asked for; inferred for parts you derived from the instruction and context; default for conventional choices the user did not specify.",
  "- Prefer 2-5 blocks; split only when the code is genuinely complex.",
  "- Keep it compact: pseudocode at most 35 CJK characters or 25 words per block; include complexity and rationale only when they add real value.",
  "- Every block MUST include an anchor: a verbatim copy of its first 1-3 code lines, exactly as they appear in the code you return (never paraphrase).",
  "- Answer with ONE JSON object only, shape:",
  "  {\"code\": string, \"summary\": string, \"blocks\": [{\"id\": string, \"anchor\": string, \"lines\"?: string, \"pseudocode\": string, \"certainty\": \"explicit\"|\"inferred\"|\"default\", \"complexity\"?: {\"time\"?: string, \"space\"?: string}, \"rationale\"?: string}]}",
  "- summary: one short sentence in the user language describing the change.",
  "- No markdown, no code fences, no extra text."
].join("\n");

const CODE_ONLY_SYSTEM = [
  "You are a code generator inside DeepSeek Harness.",
  "Output ONLY the requested code — no markdown fences, no explanations, no task commentary."
].join("\n");

const BLOCKS_SYSTEM = [
  "You are the Chords analysis engine inside DeepSeek Harness.",
  "Analyze the given code into natural-language pseudocode blocks. Rules:",
  "- Cover the whole code; choose a granularity where each block is one coherent unit — the suggested block count arrives in the request and scales with code size.",
  "- certainty: explicit for parts the user directly asked for, inferred for parts derived from context, default for conventional choices the user did not specify.",
  "- pseudocode: real natural-language prose (Chinese or English human words) — never if/for/new/return keywords; 1-3 sentences per block, at most 80 CJK characters or 50 words.",
  "- Include complexity (time/space) when the algorithm or performance matters; include rationale when a choice is non-obvious.",
  "- Every block MUST include an anchor: a verbatim copy of its first 1-3 code lines, exactly as they appear in the given code (never paraphrase).",
  "- Answer with ONE JSON object only, shape:",
  "  {\"summary\": string, \"blocks\": [{\"id\": string, \"anchor\": string, \"lines\"?: string, \"pseudocode\": string, \"certainty\": \"explicit\"|\"inferred\"|\"default\", \"complexity\"?: {\"time\"?: string, \"space\"?: string}, \"rationale\"?: string}]}",
  "- summary: one short sentence in the user language describing the change.",
  "- No markdown, no code fences, no extra text."
].join("\n");

class CodeLensRemoteService extends Service {
  constructor(ctx) {
    super(ctx, "chords");
    this.typertRemote = bindTypertRemote(this, this.name, {});
  }
  async regenerate(request, signal) {
    if (!request || typeof request !== "object"
      || typeof request.code !== "string" || request.code.trim() === ""
      || !Array.isArray(request.blocks)) {
      throw new Error("chords: invalid regenerate request");
    }
    const blockMode = typeof request.blockId === "string"
      && typeof request.oldPseudocode === "string"
      && typeof request.newPseudocode === "string";
    const wholeMode = typeof request.instruction === "string" && request.instruction.trim() !== "";
    if (!blockMode && !wholeMode) {
      throw new Error("chords: regenerate requires either a block edit or a whole-card instruction");
    }
    const title = typeof request.title === "string" && request.title !== "" ? request.title : (request.locale === "en" ? "Untitled" : "未命名");
    const sid = typeof request.sessionId === "string" ? request.sessionId : "";
    // Follow the rename chain so a stale (pre-rename) title lands on the current document.
    const effTitle = resolveRename(sid, title);
    const language = typeof request.language === "string" ? request.language : "";
    const locale = request.locale === "en" ? "en" : "zh";
    if (typeof request.sessionId === "string" && request.sessionId !== "") sessionLocales.set(request.sessionId, locale);
    const originalBlockCount = Array.isArray(request.blocks) ? request.blocks.length : 0;
    const inputLineCount = splitLines(request.code).length;
    const suggestedBlocks = originalBlockCount > 0
      ? Math.max(2, Math.min(24, originalBlockCount))
      : Math.max(2, Math.min(24, Math.ceil(inputLineCount / 20)));
    const suggestSuffix = locale === "en"
      ? " (original had " + originalBlockCount + " blocks; keep similar granularity and cover the whole code)"
      : "（原文档 " + originalBlockCount + " 块；保持相近粒度，覆盖全部代码）";
    const userPrompt = blockMode ? [
      L(locale, "title") + effTitle,
      L(locale, "lang") + (language || (locale === "en" ? "unknown" : "未知")),
      L(locale, "block") + request.blockId,
      L(locale, "old") + request.oldPseudocode,
      L(locale, "newP") + request.newPseudocode,
      L(locale, "ref") + JSON.stringify(request.blocks),
      L(locale, "suggest") + suggestedBlocks + suggestSuffix,
      L(locale, "code"),
      "```",
      request.code,
      "```",
      L(locale, "regen")
    ].join("\n") : [
      L(locale, "title") + effTitle,
      L(locale, "lang") + (language || (locale === "en" ? "unknown" : "未知")),
      L(locale, "inst") + request.instruction,
      L(locale, "ref") + JSON.stringify(request.blocks),
      L(locale, "suggest") + suggestedBlocks + suggestSuffix,
      L(locale, "code"),
      "```",
      request.code,
      "```",
      L(locale, "redesign")
    ].join("\n");
    const userMessage = (text) => createUserMessage({
      content: [{ type: "text", text }],
      source: { kind: "plugin", plugin: "dsh-chords" }
    });
    const tier = tierForLineCount(inputLineCount, chordsRoute);
    console.warn("chords: regenerate start mode=" + (blockMode ? "block" : "whole") + " lines=" + inputLineCount + " tier=" + tier);
    let model = chordsRoute.model;
    let maxTokens = chordsRoute.maxTokens;
    let timeoutMs = chordsRoute.timeoutMs;
    let effort = chordsRoute.effortSmall;
    if (tier !== "small") {
      const strong = chordsRoute.strongModel || ((chordsProviders[chordsRoute.provider] || {}).strong);
      if (typeof strong === "string" && strong !== "") model = strong;
      maxTokens = chordsRoute.maxTokensLarge;
      timeoutMs = chordsRoute.timeoutMsLarge;
    }
    if (tier === "large") {
      effort = chordsRoute.effortLarge;
      maxTokens = chordsRoute.maxTokensHuge;
      timeoutMs = chordsRoute.timeoutMsHuge;
    }
    const runStream = async (messages) => {
      const options = {
        provider: chordsRoute.provider,
        model: model,
        messages,
        system: blockMode ? REGEN_SYSTEM : REDESIGN_SYSTEM,
        maxTokens,
        reasoningEffort: effort,
        ...(typeof request.sessionId === "string" && request.sessionId !== "" ? { sessionId: request.sessionId } : {}),
        signal: (signal && typeof signal.aborted === "boolean") ? AbortSignal.any([AbortSignal.timeout(timeoutMs), signal]) : AbortSignal.timeout(timeoutMs)
      };
      const assembler = new BlockAssembler();
      try {
        for await (const chunk of this.ctx.llm.stream(options)) assembler.push(chunk);
      } catch (error) {
        if (signal && signal.aborted) throw new Error("chords: cancelled");
        console.warn("chords: regenerate LLM stream failed:", error && error.message ? error.message : String(error));
        throw new Error("chords: LLM stream failed: " + (error && error.message ? error.message : String(error)));
      }
      const finish = assembler.finish;
      if (finish && finish.kind !== "stop") {
        throw new Error("chords: model ended abnormally (" + String(finish.kind) + ")");
      }
      return assembler.blocks().filter((b) => b.type === "text").map((b) => b.text).join("");
    };
    // One combined call: code + blocks in a single output, so the new code is never re-input.
    let text = await runStream([userMessage(userPrompt)]);
    let parsed = extractJson(text);
    if (!parsed || typeof parsed.code !== "string" || parsed.code.trim() === "" || !Array.isArray(parsed.blocks) || parsed.blocks.length === 0) {
      text = await runStream([userMessage(userPrompt), userMessage(L(locale, "retryJson"))]);
      parsed = extractJson(text);
    }
    if (!parsed || typeof parsed.code !== "string" || parsed.code.trim() === "" || !Array.isArray(parsed.blocks) || parsed.blocks.length === 0) {
      console.warn("chords: regenerate bad JSON output (raw head):", text.slice(0, 240).replace(/\n/g, " "));
      throw new Error("chords: model did not return the expected JSON (raw head: " + text.slice(0, 240).replace(/\n/g, " ") + ")");
    }
    const newCode = parsed.code;
    let anchors = 0, anchorsMatched = 0;
    for (const b of parsed.blocks) {
      if (typeof b.anchor === "string" && b.anchor.trim() !== "") {
        anchors += 1;
        if (anchorLineIndex(newCode, b.anchor) !== null) anchorsMatched += 1;
      }
    }
    const doc = recordDoc(effTitle, newCode, language, parsed.blocks, parsed.summary, typeof request.sessionId === "string" ? request.sessionId : "");
    console.warn("chords: regenerate ok title=" + doc.title + " version=" + doc.version + " anchors=" + anchorsMatched + "/" + anchors);
    let persisted = true;
    const put = docPuts.get(doc.key);
    if (put) {
      try { await put; } catch { persisted = false; }
    }
    return {
      code: newCode,
      blocks: parsed.blocks,
      summary: typeof parsed.summary === "string" ? parsed.summary : "",
      version: doc.version,
      persisted,
      anchors,
      anchorsMatched
    };
  }
  async rename(request) {
    if (!request || typeof request !== "object"
      || typeof request.title !== "string" || request.title.trim() === ""
      || typeof request.newTitle !== "string" || request.newTitle.trim() === "") {
      throw new Error("chords: invalid rename request");
    }
    const sessionId = typeof request.sessionId === "string" ? request.sessionId : "";
    const oldTitle = request.title.trim();
    const newTitle = request.newTitle.trim();
    if (oldTitle === newTitle) throw new Error("chords: new title is identical");
    const effective = resolveRename(sessionId, oldTitle);
    if (newTitle === effective) return { ok: true, title: effective };
    if (domain && wouldCreateRenameCycle((current) => domain.table("renames").get(docKey(sessionId, current)), effective, newTitle)) throw new Error("chords: renaming to this title would create a cycle");
    const oldKey = docKey(sessionId, effective);
    const newKey = docKey(sessionId, newTitle);
    const doc = lensDocs.get(oldKey);
    if (!doc) throw new Error("chords: no document titled " + effective);
    if (lensDocs.has(newKey)) throw new Error("chords: a document titled " + newTitle + " already exists");
    doc.key = newKey;
    doc.title = newTitle;
    lensDocs.delete(oldKey);
    lensDocs.set(newKey, doc);
    if (domain) {
      domain.table("docs").delete(oldKey).catch(() => {});
      const put = domain.table("docs").put(newKey, { key: newKey, title: newTitle, code: doc.code, language: doc.language, blocks: doc.blocks, version: doc.version, summary: doc.summary, updatedAt: doc.updatedAt });
      docPuts.set(newKey, put);
      put.then(() => docPuts.delete(newKey), () => docPuts.delete(newKey)).catch(() => {});
      put.catch((error) => console.warn("chords: rename persist failed:", error && error.message));
      const h = domain.table("history").get(oldKey);
      if (h) {
        domain.table("history").delete(oldKey).catch(() => {});
        domain.table("history").put(newKey, h).catch(() => {});
      }
      domain.table("renames").put(docKey(sessionId, oldTitle), { newTitle, updatedAt: Date.now() }).catch(() => {});
    }
    const sid = sessionId || "";
    let log = editLogs.get(sid);
    if (!log) { log = []; editLogs.set(sid, log); }
    log.unshift({ title: newTitle, version: doc.version, summary: "重命名自 " + oldTitle });
    if (log.length > 10) log.length = 10;
    if (domain) domain.table("logs").put(sid, { entries: log.slice() }).catch(() => {});
    return { ok: true, title: newTitle, version: doc.version };
  }
  async resolveTitle(request) {
    const sessionId = request && typeof request.sessionId === "string" ? request.sessionId : "";
    const title = request && typeof request.title === "string" ? request.title : "";
    if (title === "") throw new Error("chords: invalid resolveTitle request");
    return { title: resolveRename(sessionId, title) };
  }
  async history(request) {
    const sessionId = request && typeof request.sessionId === "string" ? request.sessionId : "";
    const title = request && typeof request.title === "string" ? request.title : "";
    if (title === "") throw new Error("chords: invalid history request");
    const eff = resolveRename(sessionId, title);
    const key = docKey(sessionId, eff);
    const doc = lensDocs.get(key);
    if (!doc) return { found: false, entries: [] };
    const h = domain ? (domain.table("history").get(key) || { entries: [] }) : { entries: [] };
    const entries = (Array.isArray(h.entries) ? h.entries : []).map((e) => ({
      version: e.version,
      code: e.code,
      blocks: e.blocks,
      summary: typeof e.summary === "string" ? e.summary : "",
      updatedAt: e.updatedAt
    }));
    entries.push({ version: doc.version, code: doc.code, blocks: doc.blocks, summary: typeof doc.summary === "string" ? doc.summary : "", updatedAt: doc.updatedAt });
    entries.sort((a, b) => a.version - b.version);
    return { found: true, title: eff, currentVersion: doc.version, entries };
  }
}

// SRC method marker without native decorators: apply the Remote decorator
// by hand against the class prototype so the gateway can claim chords/regenerate.
Remote(function regenerate(request) { }, {
  name: "regenerate",
  private: false,
  static: false,
  addInitializer(cb) { cb.call(Object.create(CodeLensRemoteService.prototype)); }
});
Remote(function rename(request) { }, {
  name: "rename",
  private: false,
  static: false,
  addInitializer(cb) { cb.call(Object.create(CodeLensRemoteService.prototype)); }
});
Remote(function resolveTitle(request) { }, {
  name: "resolveTitle",
  private: false,
  static: false,
  addInitializer(cb) { cb.call(Object.create(CodeLensRemoteService.prototype)); }
});
Remote(function history(request) { }, {
  name: "history",
  private: false,
  static: false,
  addInitializer(cb) { cb.call(Object.create(CodeLensRemoteService.prototype)); }
});

async function apply(ctx, config) {
  const cfg = config && typeof config === "object" ? config : {};
  // Follow the session default model unless explicitly overridden.
  if (cfg.followSessionModel !== false) {
    const defaultModel = ctx.get("agentDefaultModel");
    if (defaultModel && typeof defaultModel.provider === "string" && defaultModel.provider !== "") chordsRoute.provider = defaultModel.provider;
    if (defaultModel && typeof defaultModel.model === "string" && defaultModel.model !== "") chordsRoute.model = defaultModel.model;
  }
  if (typeof cfg.provider === "string" && cfg.provider !== "") chordsRoute.provider = cfg.provider;
  if (typeof cfg.model === "string" && cfg.model !== "") chordsRoute.model = cfg.model;
  if (typeof cfg.strongModel === "string" && cfg.strongModel !== "") chordsRoute.strongModel = cfg.strongModel;
  if (typeof cfg.smallLines === "number" && cfg.smallLines > 0) chordsRoute.smallLines = cfg.smallLines;
  if (typeof cfg.largeLines === "number" && cfg.largeLines > cfg.smallLines) chordsRoute.largeLines = cfg.largeLines;
  if (typeof cfg.effortSmall === "string" && cfg.effortSmall !== "") chordsRoute.effortSmall = cfg.effortSmall;
  if (typeof cfg.effortLarge === "string" && cfg.effortLarge !== "") chordsRoute.effortLarge = cfg.effortLarge;
  if (typeof cfg.maxTokens === "number" && cfg.maxTokens > 0) chordsRoute.maxTokens = cfg.maxTokens;
  if (typeof cfg.maxTokensLarge === "number" && cfg.maxTokensLarge > 0) chordsRoute.maxTokensLarge = cfg.maxTokensLarge;
  if (typeof cfg.maxTokensHuge === "number" && cfg.maxTokensHuge > 0) chordsRoute.maxTokensHuge = cfg.maxTokensHuge;
  if (typeof cfg.timeoutMs === "number" && cfg.timeoutMs > 0) chordsRoute.timeoutMs = cfg.timeoutMs;
  if (typeof cfg.timeoutMsLarge === "number" && cfg.timeoutMsLarge > 0) chordsRoute.timeoutMsLarge = cfg.timeoutMsLarge;
  if (typeof cfg.timeoutMsHuge === "number" && cfg.timeoutMsHuge > 0) chordsRoute.timeoutMsHuge = cfg.timeoutMsHuge;
  if (cfg.providers && typeof cfg.providers === "object") {
    for (const k of Object.keys(cfg.providers)) {
      if (cfg.providers[k] && typeof cfg.providers[k] === "object") chordsProviders[k] = cfg.providers[k];
    }
  }
  if (typeof cfg.ttlDays === "number" && cfg.ttlDays > 0) chordsTtlDays = cfg.ttlDays;

  ctx.on("session/disposed", (session) => {
    if (session && typeof session.id === "string") dropSessionDocs(session.id);
  });

  const storageDomain = ctx.get("storageDomain");
  if (storageDomain && typeof storageDomain.open === "function") {
    try {
      domain = await storageDomain.open(lensDomainSpec);
    } catch (error) {
      const msg = error && error.message ? error.message : String(error);
      if (msg.indexOf("version-mismatch") !== -1) {
        // Self-heal: a unit written by an older plugin version is discarded and reopened.
        try {
          await unlink(chordsUnitPath());
          domain = await storageDomain.open(lensDomainSpec);
          console.warn("chords: stale storage unit discarded, reopened at the current version");
        } catch (error2) {
          domain = null;
          console.warn("chords: storage domain unavailable, running memory-only:", error2 && error2.message);
        }
      } else {
        console.warn("chords: storage domain unavailable, running memory-only:", msg);
      }
    }
    if (domain) {
      ctx.effect(() => () => { if (domain) domain.close(); domain = null; }, "chords: domain close");
      hydrateFromDomain();
    }
  }

  ctx.plugin(CodeLensRemoteService);

  ctx.tools.register(defineTool({
    name: "chords",
    description: [
      "Present one code block together with its natural-language pseudocode analysis for the dual-pane chords card.",
      "Call this tool once per non-trivial code block at the point in your reply where you present that code; the card IS the code display, so do not paste the same code again in your message text.",
      "Split the code into logical chunks; for each chunk give plain-language pseudocode (real Chinese or English prose, NEVER if/for/new/return keywords),",
      "a certainty tag, a verbatim anchor excerpt for exact highlighting, and optionally time/space complexity and a rationale."
    ].join(" "),
    parameters: {
      code: {
        type: "string",
        required: true,
        description: "The complete code block being explained."
      },
      language: {
        type: "string",
        description: "Language id such as typescript, python, go."
      },
      title: {
        type: "string",
        description: "Short human-readable name of this lens, e.g. quicksort."
      },
      blocks: {
        type: "array",
        required: true,
        description: "One entry per logical chunk of the code; every chunk must be covered.",
        items: {
          type: "object",
          additionalProperties: true,
          properties: {
            id: {
              type: "string",
              required: true,
              description: "Stable chunk id like b1, b2."
            },
            anchor: {
              type: "string",
              description: "Verbatim copy of this chunk first 1-3 code lines, exactly as they appear in the code argument. The UI locates this excerpt to compute the exact highlight range, so never paraphrase it."
            },
            lines: {
              type: "string",
              description: "Fallback source line range like 3-7 or 12; used only when the anchor cannot be located."
            },
            pseudocode: {
              type: "string",
              required: true,
              description: "Natural-language pseudocode: plain prose in Chinese or English, no code keywords."
            },
            certainty: {
              type: "string",
              required: true,
              enum: ["explicit", "inferred", "default"],
              description: "explicit = the user directly stated this; inferred = you reasoned it from context; default = the user did not specify it and you picked a conventional choice."
            },
            complexity: {
              type: "object",
              additionalProperties: true,
              properties: {
                time: { type: "string", description: "Time cost, e.g. O(n log n) or prose." },
                space: { type: "string", description: "Space cost, e.g. O(n) or prose." }
              }
            },
            rationale: {
              type: "string",
              description: "Why you chose this / what you assumed; shown as hover detail."
            }
          }
        }
      }
    },
    output: {
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          ok: { type: "boolean", required: true },
          blocks: { type: "integer", required: true },
          anchors: { type: "integer", required: true },
          anchorsMatched: { type: "integer", required: true },
          sessionId: { type: "string" },
          byCertainty: {
            type: "object",
            additionalProperties: true,
            properties: {
              explicit: { type: "integer" },
              inferred: { type: "integer" },
              default: { type: "integer" }
            }
          }
        }
      },
      render: (args, value) => [{
        type: "text",
        text: "[chords:session=" + value.sessionId + "] chords: " + value.blocks + " chunk(s); anchors matched " + value.anchorsMatched + "/" + value.anchors + "; certainty explicit " + value.byCertainty.explicit + " / inferred " + value.byCertainty.inferred + " / default " + value.byCertainty.default
      }]
    },
    async execute(args, exec) {
      const byCertainty = { explicit: 0, inferred: 0, default: 0 };
      let anchors = 0, anchorsMatched = 0;
      for (const b of args.blocks) {
        if (b.certainty === "explicit" || b.certainty === "inferred" || b.certainty === "default") {
          byCertainty[b.certainty] += 1;
        }
        if (typeof b.anchor === "string" && b.anchor.trim() !== "") {
          anchors += 1;
          if (anchorLineIndex(args.code, b.anchor) !== null) anchorsMatched += 1;
        }
      }
      const sessionId = exec && exec.agent ? exec.agent.id : "";
      const docTitle = typeof args.title === "string" && args.title !== "" ? args.title : "未命名";
      // Follow the rename chain so same-title merges land on the current document.
      const effTitle = resolveRename(sessionId, docTitle);
      recordDoc(effTitle, args.code, args.language, args.blocks, "", sessionId);
      // Await durability so a card created right before a server restart is never lost.
      const put = docPuts.get(docKey(sessionId, effTitle));
      if (put) {
        try { await put; } catch { /* already warned */ }
      }
      return { ok: true, blocks: args.blocks.length, anchors, anchorsMatched, byCertainty, sessionId };
    }
  }));

  ctx.tools.register(defineTool({
    name: "chords_current",
    description: [
      "Query the latest version of a chords document by exact title; returns the full current code and its pseudocode blocks.",
      "The user may have edited a lens card in the background (outside the conversation), so call this BEFORE modifying or building on code previously presented in a chords card; the conversation history may hold a stale version."
    ].join(" "),
    parameters: {
      title: {
        type: "string",
        required: true,
        description: "Exact card title of the chords document."
      }
    },
    output: {
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          found: { type: "boolean", required: true },
          version: { type: "integer" },
          language: { type: "string" },
          code: { type: "string" },
          blocks: { type: "json" }
        }
      },
      render: (args, value) => {
        if (!value.found) {
          return [{ type: "text", text: "chords_current: no lens document titled " + args.title }];
        }
        const lang = typeof value.language === "string" && value.language !== "" ? value.language : "";
        return [{
          type: "text",
          text: "chords_current " + args.title + " v" + value.version + " (latest):\n```" + lang + "\n" + value.code + "\n```\nblocks JSON:\n" + JSON.stringify(value.blocks)
        }];
      }
    },
    async execute(args, exec) {
      const sessionId = exec && exec.agent ? exec.agent.id : "";
      const qTitle = resolveRename(sessionId, args.title);
      const exactKey = docKey(sessionId, qTitle);
      const exact = lensDocs.get(exactKey);
      let best = exact && isFresh(exact) ? exact : null;
      // Documents may live in several buckets (legacy anonymous bucket, other sessions).
      // Prefer the freshest EDIT (updatedAt is wall-clock comparable across buckets);
      // this session breaks ties. Version numbers are per-bucket and cannot be compared.
      for (const [key, d] of lensDocs.entries()) {
        if (d.title !== qTitle || !isFresh(d)) continue;
        if (!best || d.updatedAt > best.updatedAt || (d.updatedAt === best.updatedAt && key === exactKey)) best = d;
      }
      if (!best) return { found: false };
      return { found: true, version: best.version, language: best.language, code: best.code, blocks: best.blocks };
    }
  }));

  ctx.tools.register(defineTool({
    name: "chords_history",
    description: "Query the version history of a chords document. Without a version argument it lists all saved versions with summaries; with a version argument it returns that version full code and blocks. Use it when the user asks what a card looked like at an earlier version, or wants to base a new change on an older version.",
    parameters: {
      title: {
        type: "string",
        required: true,
        description: "Exact card title of the chords document."
      },
      version: {
        type: "integer",
        description: "Optional version number; when given, returns that version full content."
      }
    },
    output: {
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          found: { type: "boolean", required: true },
          title: { type: "string" },
          currentVersion: { type: "integer" },
          entries: {
            type: "array",
            required: true,
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                version: { type: "integer", required: true },
                summary: { type: "string", required: true },
                updatedAt: { type: "number", required: true }
              }
            }
          },
          version: { type: "integer" },
          language: { type: "string" },
          code: { type: "string" },
          blocks: { type: "json" }
        }
      },
      render: (args, value) => {
        if (!value.found) return [{ type: "text", text: "chords_history: no lens document titled " + args.title }];
        if (typeof args.version === "number") {
          const lang = typeof value.language === "string" && value.language !== "" ? value.language : "";
          return [{
            type: "text",
            text: "chords_history " + args.title + " v" + value.version + ":\n```" + lang + "\n" + value.code + "\n```\nblocks JSON:\n" + JSON.stringify(value.blocks)
          }];
        }
        return [{
          type: "text",
          text: "chords_history " + args.title + " (current v" + value.currentVersion + "):\n" + value.entries.map((e) => "- v" + e.version + ": " + e.summary).join("\n")
        }];
      }
    },
    async execute(args, exec) {
      const sessionId = exec && exec.agent ? exec.agent.id : "";
      const qTitle = resolveRename(sessionId, args.title);
      const exactKey = docKey(sessionId, qTitle);
      const exact = lensDocs.get(exactKey);
      let best = exact && isFresh(exact) ? exact : null;
      for (const [key, d] of lensDocs.entries()) {
        if (d.title !== qTitle || !isFresh(d)) continue;
        if (!best || d.updatedAt > best.updatedAt || (d.updatedAt === best.updatedAt && key === exactKey)) best = d;
      }
      if (!best) return { found: false, entries: [] };
      const h = domain ? (domain.table("history").get(best.key) || { entries: [] }) : { entries: [] };
      const rawEntries = Array.isArray(h.entries) ? h.entries : [];
      if (typeof args.version === "number") {
        if (args.version === best.version) {
          return { found: true, title: best.title, currentVersion: best.version, entries: [], version: best.version, language: best.language, code: best.code, blocks: best.blocks };
        }
        const hit = rawEntries.find((e) => e.version === args.version);
        if (!hit) return { found: false, title: best.title, currentVersion: best.version, entries: [] };
        return { found: true, title: best.title, currentVersion: best.version, entries: [], version: hit.version, language: best.language, code: hit.code, blocks: hit.blocks };
      }
      const entries = rawEntries.map((e) => ({ version: e.version, summary: typeof e.summary === "string" ? e.summary : "", updatedAt: e.updatedAt }));
      entries.push({ version: best.version, summary: typeof best.summary === "string" ? best.summary : "", updatedAt: best.updatedAt });
      entries.sort((a, b) => a.version - b.version);
      return { found: true, title: best.title, currentVersion: best.version, entries };
    }
  }));

  ctx.tools.register(defineTool({
    name: "chords_list",
    description: "List every chords document in this session with its exact title and latest version. Call this before chords_current when the exact card title is unknown.",
    parameters: {},
    output: {
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          docs: {
            type: "array",
            required: true,
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                title: { type: "string", required: true },
                version: { type: "integer", required: true }
              }
            }
          }
        }
      },
      render: (args, value) => [{
        type: "text",
        text: value.docs.length === 0
          ? "chords_list: this session has no lens documents"
          : "chords_list: " + value.docs.length + " document(s):\n" + value.docs.map((d) => "- " + d.title + " v" + d.version).join("\n")
      }]
    },
    async execute(args, exec) {
      purgeStale();
      const byTitle = new Map();
      for (const [key, doc] of lensDocs.entries()) {
        if (!isFresh(doc)) continue;
        const cur = byTitle.get(doc.title);
        if (!cur || doc.version > cur.version) byTitle.set(doc.title, { title: doc.title, version: doc.version });
      }
      const docs = [...byTitle.values()];
      docs.sort((a, b) => a.title.localeCompare(b.title));
      return { docs };
    }
  }));

  ctx.systemPrompt.section({
    name: "chords-guidance",
    order: 120,
    text: [
      "chords tool usage (always follow):",
      "- Present every non-trivial code block THROUGH a chords call: the card is the code display, so never paste the same code again in your message text — write prose around the card instead.",
      "- Call chords exactly once per code block in a reply; do not call it again for the same block even if you cannot see the rendered card.",
      "- Exception: if a chords call FAILS (tool error), paste the code in your message text so the user still sees it.",
      "- This applies even when the user asks to merely restate, copy, or repeat code without explanation: still present the code through a chords call (the card is the code display); keep the pseudocode terse and your message text minimal.",
      "- Issue the call at the point in your reply where you present that code (right after any one-line intro), not after all your prose.",
      "- When a user message begins with 【代码卡片修改】: regenerate the code from the provided current code as the new baseline, honoring only the stated block change; reply with a one-to-two sentence change summary; then call chords again for the regenerated code — the title must be EXACTLY the one given in the message, because the UI merges the update into the original card in place (no new card appears); never paste the code in your message text.",
      "- When the user asks you in conversation to modify code you previously presented in a chords card, call chords again for the modified code with the SAME title as that card (never invent a new or embellished title) — the UI merges the update into the original card in place; never paste the code in your message text.",
      "- When a user message begins with 【代码卡片重设计】: redesign the code according to the described instruction, using the provided current code as the baseline; re-chunk freely (blocks may be added, removed, split, or merged); reply with a one-to-two sentence change summary; then call chords again with the regenerated code — the title must be EXACTLY the one given in the message; never paste the code in your message text.",
      "- The user may edit lens cards in the background; those edits never appear as chat messages (the runtime context snapshot lists them). Before modifying or building on code previously shown in a chords card, call chords_current with the card exact title to obtain the latest version — the conversation history may be stale. When the exact title is unknown, call chords_list first to list this session lens documents and their versions.",
      "- Split the code into logical chunks (blocks). Each chunk pseudocode must be real natural-language prose (Chinese or English human words) — never if/for/new/return keywords.",
      "- Give every chunk an anchor: a verbatim copy of its first 1-3 code lines, exactly as they appear in the code argument. The UI computes exact highlight ranges from anchors; never paraphrase them. lines is only a fallback hint.",
      "- Tag every block with certainty: explicit = the user directly asked for it; inferred = you derived it from context; default = the user did not specify it and you picked a conventional choice.",
      "- Give time/space complexity when the algorithm or performance matters; keep it plain.",
      "- rationale briefly records what you assumed and why (hover detail). After calling chords, continue normally; the user may later edit a pseudocode line and the card will update in place."
    ].join("\n")
  });

  ctx.systemPrompt.context({
    name: "chords-edits",
    order: 10,
    text: (assembly) => {
      const sessionId = assembly && assembly.agent ? assembly.agent.id : "";
      let log = editLogs.get(sessionId);
      if (!log || log.length === 0) log = editLogs.get("");
      if (!log || log.length === 0) return "";
      const locale = sessionLocales.get(sessionId) || "zh";
      const head = locale === "en"
        ? "Chords background edits (newest first, up to 10):"
        : "代码卡片后台修改（最新在前，最多 10 条）：";
      return head + "\n" + log.map((e) => "- " + e.title + " v" + e.version + "：" + e.summary).join("\n");
    }
  });
}

export { apply, inject, name };

// Test-only exports for vitest (see test/); the plugin loader ignores these names.
export {
  anchorLineIndex,
  appendHistoryEntry,
  docKey,
  docSchema,
  extractJson,
  splitLines,
  tierForLineCount,
  walkRenameChain,
  wouldCreateRenameCycle
};
