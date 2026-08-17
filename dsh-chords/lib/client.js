window.__ModuleLoader__.load({
  id: "dsh-chords",
  factory: function (require) {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
    var React = require("react");
    var CodeBlock = require("@deepseek-ai/dsh-client-ui-primitives").CodeBlock;

    var CSS = ".cl-card{border:1px solid rgba(127,127,127,.25);border-radius:12px;overflow:hidden;font-size:13px;line-height:1.5;margin:0}.cl-head{display:flex;align-items:center;gap:10px;padding:10px 14px;border-bottom:1px solid rgba(127,127,127,.18);background:var(--dsw-alias-surface-subtle,rgba(127,127,127,.05))}.cl-title{font-weight:600;color:var(--dsw-alias-label-primary,inherit)}.cl-lang{font-family:var(--ds-font-family-code,ui-monospace,Consolas,monospace);font-size:11px;padding:1px 7px;border-radius:6px;background:rgba(127,127,127,.12);color:var(--dsw-alias-label-secondary,inherit)}.cl-version{font-size:11px;padding:1px 7px;border-radius:6px;background:rgba(76,141,255,.12);color:var(--dsw-alias-label-secondary,inherit)}.cl-legend{margin-left:auto;display:flex;gap:12px}.cl-legend-item{display:inline-flex;align-items:center;gap:5px;font-size:11px;color:var(--dsw-alias-label-secondary,inherit)}.cl-status{margin:6px 14px 0;font-size:11px;color:var(--dsw-alias-label-secondary,inherit);display:flex;align-items:center;gap:6px}.cl-strip{padding:10px 14px;font-size:12.5px;color:var(--dsw-alias-label-secondary,inherit);display:flex;gap:8px;align-items:center}.cl-body{display:grid;grid-template-columns:minmax(0,1.9fr) minmax(0,1fr)}@media (max-width:720px){.cl-body{grid-template-columns:1fr}}.cl-code{overflow:auto;max-height:460px;border-right:1px solid rgba(127,127,127,.15)}.cl-line{display:flex;padding:0 12px;transition:background .25s ease,box-shadow .25s ease}.cl-line-lit{background:rgba(255,190,90,.16);box-shadow:inset 3px 0 0 rgba(255,170,60,.55)}.cl-ln{width:34px;flex:none;text-align:right;padding-right:12px;color:var(--dsw-alias-label-tertiary,rgba(127,127,127,.7));user-select:none}.cl-lt{white-space:pre-wrap}.cl-notes{display:flex;flex-direction:column;gap:4px;padding:8px;overflow:auto;max-height:460px}.cl-note{padding:8px 10px;border-radius:8px;border:1px solid transparent;transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease,background .2s ease;cursor:default}.cl-note-lit{transform:translateY(-1px);border-color:rgba(255,170,60,.45);background:var(--dsw-alias-surface-subtle,rgba(127,127,127,.05));box-shadow:0 4px 14px rgba(0,0,0,.10)}.cl-note-head{display:flex;align-items:center;gap:6px}.cl-dot{width:8px;height:8px;flex:none;border-radius:50%;display:inline-block}.cl-note-id{font-family:var(--ds-font-family-code,ui-monospace,Consolas,monospace);font-size:11px;color:var(--dsw-alias-label-tertiary,rgba(127,127,127,.75))}.cl-note-lines{font-family:var(--ds-font-family-code,ui-monospace,Consolas,monospace);font-size:11px;padding:0 6px;border-radius:6px;background:rgba(127,127,127,.12);color:var(--dsw-alias-label-secondary,inherit)}.cl-note-cert{font-size:11px;margin-left:auto}.cl-edit-btn{opacity:0;transition:opacity .15s ease;cursor:pointer;font-size:11px;padding:1px 6px;border-radius:5px;border:1px solid transparent;background:transparent;color:var(--dsw-alias-label-secondary,inherit)}.cl-note:hover .cl-edit-btn{opacity:1}.cl-edit-btn:hover{background:rgba(127,127,127,.12)}.cl-note-text{margin-top:5px;color:var(--dsw-alias-label-primary,inherit);line-height:1.55}.cl-note-cx{margin-top:6px;display:flex;gap:6px;flex-wrap:wrap}.cl-note-cx span{font-size:11px;padding:1px 7px;border-radius:6px;background:rgba(127,127,127,.10);color:var(--dsw-alias-label-secondary,inherit)}.cl-note-why{margin-top:6px;font-size:11px;color:var(--dsw-alias-label-secondary,inherit);border-left:2px solid rgba(127,127,127,.35);padding-left:8px}.cl-note-textarea{width:100%;min-height:72px;margin-top:5px;padding:8px 10px;border:1px solid rgba(76,141,255,.45);border-radius:8px;background:transparent;color:var(--dsw-alias-label-primary,inherit);font:inherit;font-size:13px;line-height:1.55;resize:vertical;box-sizing:border-box;outline:none}.cl-note-actions{display:flex;gap:8px;margin-top:6px;align-items:center}.cl-btn{padding:3px 10px;border-radius:7px;font-size:12px;border:1px solid rgba(127,127,127,.35);background:transparent;color:var(--dsw-alias-label-primary,inherit);cursor:pointer;transition:background .15s ease}.cl-btn:hover{background:rgba(127,127,127,.10)}.cl-btn-primary{border-color:rgba(76,141,255,.6);background:rgba(76,141,255,.14)}.cl-btn-primary:hover{background:rgba(76,141,255,.24)}.cl-empty{padding:14px;color:var(--dsw-alias-label-tertiary,rgba(127,127,127,.8))}" +
".cl-nav{display:inline-flex;align-items:center;gap:4px;margin-left:6px}" +
".cl-nav-btn{padding:0 6px;border-radius:5px;border:1px solid rgba(127,127,127,.35);background:transparent;color:var(--dsw-alias-label-secondary,inherit);cursor:pointer;font-size:11px}" +
".cl-nav-btn:disabled{opacity:.35;cursor:not-allowed}" +
".cl-nav-btn:hover:not(:disabled){background:rgba(127,127,127,.10)}" +
".cl-nav-label{font-size:11px;color:var(--dsw-alias-label-secondary,inherit)}" +
".cl-title-editable{cursor:text;transition:background .15s ease;border-radius:6px;padding:1px 6px;margin-left:-6px}" +
".cl-title-editable:hover{background:var(--dsw-alias-surface-subtle,rgba(127,127,127,.08))}" +
".cl-rename-box{display:inline-flex;align-items:center;gap:6px}" +
".cl-rename-input{padding:2px 8px;border:1px solid rgba(76,141,255,.45);border-radius:6px;background:transparent;color:var(--dsw-alias-label-primary,inherit);font:inherit;font-size:13px;outline:none}" +
".cl-head-edit{margin-left:4px;font-size:11px;padding:1px 8px;border-radius:7px;border:1px solid rgba(127,127,127,.35);background:transparent;color:var(--dsw-alias-label-secondary,inherit);cursor:pointer;transition:background .15s ease}" +
".cl-head-edit:hover{background:rgba(127,127,127,.10)}" +
".cl-whole{padding:8px 14px 4px}" +
".cl-whole-textarea{min-height:64px}" +
".cl-edit-btn:disabled,.cl-head-edit:disabled,.cl-btn:disabled{opacity:.45;cursor:not-allowed}" +
".cl-btn-cancel{border-color:rgba(240,90,80,.55);color:#e05a50;background:rgba(240,90,80,.08)}" +
".cl-btn-cancel:hover{background:rgba(240,90,80,.16)}" +
".cl-line,.cl-note{cursor:pointer}" +
".cl-strip-click{cursor:pointer;transition:background .15s ease}" +
".cl-strip-click:hover{background:var(--dsw-alias-surface-subtle,rgba(127,127,127,.06))}" +
".cl-flash{animation:clFlash 1.5s ease}" +
"@keyframes clFlash{0%{box-shadow:0 0 0 2px rgba(76,141,255,.85)}70%{box-shadow:0 0 0 2px rgba(76,141,255,.25)}100%{box-shadow:0 0 0 2px rgba(76,141,255,0)}}" +
".cl-code .md-code-block > div:first-child{display:none}" +
".cl-code .md-code-block{margin:0;padding:0}" +
".cl-code .shiki pre{padding:8px 0}" +
".cl-code .shiki code{counter-reset:cl-line}" +
".cl-code .shiki .line{display:block;padding:0 12px 0 3.7em;text-indent:-3.7em;cursor:pointer;transition:background .25s ease;counter-increment:cl-line}" +
".cl-code .shiki .line::before{content:counter(cl-line);display:inline-block;width:2.6em;margin-right:1.1em;text-align:right;color:var(--dsw-alias-label-tertiary,rgba(127,127,127,.7));user-select:none}" +
".cl-code .shiki .line.cl-line-lit{background:rgba(255,190,90,.16);box-shadow:inset 3px 0 0 rgba(255,170,60,.55)}";
    var tagId = "dsh-chords/style";
    if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
      var tag = document.createElement("style");
      tag.dataset.plugin = "dsh-chords";
      tag.dataset.pluginCss = tagId;
      tag.textContent = CSS;
      document.head.appendChild(tag);
    }

    // ---- background remote (set by apply after $mount) and session id ----
    var remoteCodeLens = null;

    // ---- i18n: auto English on non-Chinese systems ----
    var UI = {
      zh: {
        "title.fallback": "和弦",
        "certainty.explicit": "明确",
        "certainty.inferred": "推测",
        "certainty.default": "默认",
        "card.loading": "代码分析中…",
        "card.noArgs": "（此调用缺少可展示的参数）",
        "card.noDoc": "（无法建立代码卡片）",
        "card.noBlocks": "（没有分析块）",
        "card.renderError": "卡片渲染失败：",
        "card.reportError": "请把这句话反馈给插件作者以便修复",
        "edit.block": "✎ 修改",
        "edit.whole": "✎ 改算法",
        "btn.submit": "提交修改",
        "btn.submitWhole": "提交重设计",
        "btn.cancel": "取消",
        "btn.ok": "确定",
        "btn.stop": "终止修改",
        "btn.latest": "回到最新",
        "nav.prev": "查看上一版本",
        "nav.next": "查看下一版本",
        "title.rename": "点击重命名",
        "placeholder.whole": "描述想要的新算法或改动，例如：改成稳定排序，保持 O(n log n) 时间、O(n) 空间",
        "status.working": "正在后台重新生成…",
        "status.renaming": "正在重命名…",
        "status.updated": "已原地更新 · v",
        "status.cancelled": "已终止修改",
        "status.renamed": "已重命名为「",
        "status.renamedLocal": "」（仅本页生效）",
        "status.renameFailed": "重命名失败：",
        "status.busy": "有修改正在进行，请先完成或终止",
        "status.persistWarn": "（持久化失败，页面刷新后可能丢失）",
        "status.emptyInstruction": "请先描述想要的新算法或改动",
        "status.remoteFail": "后台修改失败：",
        "status.remoteError": "后台修改异常：",
        "status.remoteMissing": "后台通道未就绪",
        "status.noBridge": "未找到输入桥：修改请求已复制到剪贴板，请粘贴到输入框发送",
        "status.clipboard": "修改请求已复制到剪贴板，请粘贴到输入框发送",
        "status.sent": "修改请求已发出，AI 正在重新生成…",
        "strip": "代码卡片已更新至 v",
        "strip.jump": "点击跳转到上方同标题卡片",
        "badge.synced": "· 已同步",
        "msg.edit.header": "【代码卡片修改】",
        "msg.edit.title": "标题：",
        "msg.edit.lang": "语言：",
        "msg.edit.block": "修改块：",
        "msg.edit.old": "原伪代码：",
        "msg.edit.new": "新伪代码：",
        "msg.edit.code": "当前完整代码（必须以它为新基线重新生成，不要改动我未提到的行为）：",
        "msg.redesign.header": "【代码卡片重设计】",
        "msg.redesign.inst": "重设计指令：",
        "msg.redesign.code": "当前完整代码（必须以它为新基线）："
      },
      en: {
        "title.fallback": "Chords",
        "certainty.explicit": "Explicit",
        "certainty.inferred": "Inferred",
        "certainty.default": "Default",
        "card.loading": "Analyzing…",
        "card.noArgs": "(no displayable arguments)",
        "card.noDoc": "(cannot build the lens document)",
        "card.noBlocks": "(no blocks)",
        "card.renderError": "Card render failed: ",
        "card.reportError": "Please report this message to the plugin author",
        "edit.block": "✎ Edit",
        "edit.whole": "✎ Redesign",
        "btn.submit": "Submit",
        "btn.submitWhole": "Submit redesign",
        "btn.cancel": "Cancel",
        "btn.ok": "OK",
        "btn.stop": "Stop",
        "btn.latest": "Back to latest",
        "nav.prev": "Previous version",
        "nav.next": "Next version",
        "title.rename": "Click to rename",
        "placeholder.whole": "Describe the new algorithm or change, e.g. switch to a stable sort keeping O(n log n)",
        "status.working": "Regenerating in background…",
        "status.renaming": "Renaming…",
        "status.updated": "Updated in place · v",
        "status.cancelled": "Edit cancelled",
        "status.renamed": "Renamed to \"",
        "status.renamedLocal": "\" (this page only)",
        "status.renameFailed": "Rename failed: ",
        "status.busy": "An edit is in progress — finish or stop it first",
        "status.persistWarn": " (persistence failed; may be lost after a page refresh)",
        "status.emptyInstruction": "Describe the change first",
        "status.remoteFail": "Background edit failed: ",
        "status.remoteError": "Background edit error: ",
        "status.remoteMissing": "Background channel not ready",
        "status.noBridge": "No input bridge: the edit request was copied to the clipboard — paste it into the composer",
        "status.clipboard": "Edit request copied to the clipboard — paste it into the composer",
        "status.sent": "Edit request sent; the AI is regenerating…",
        "strip": "Chords updated to v",
        "strip.jump": "click to jump to the card above with the same title",
        "badge.synced": "· synced",
        "msg.edit.header": "【Chords Edit】",
        "msg.edit.title": "Title: ",
        "msg.edit.lang": "Language: ",
        "msg.edit.block": "Block: ",
        "msg.edit.old": "Old pseudocode: ",
        "msg.edit.new": "New pseudocode: ",
        "msg.edit.code": "Current full code (regenerate from this baseline, keep every behavior I did not mention):",
        "msg.redesign.header": "【Chords Redesign】",
        "msg.redesign.inst": "Redesign instruction: ",
        "msg.redesign.code": "Current full code (use as the new baseline):"
      }
    };
    var currentLocale = (typeof navigator !== "undefined" && navigator.language && String(navigator.language).toLowerCase().indexOf("zh") === 0) ? "zh" : "en";
    function T(key) {
      var table = UI[currentLocale] || UI.en;
      if (table[key] !== undefined) return table[key];
      return UI.en[key] !== undefined ? UI.en[key] : key;
    }

    var sessionState = {
      id: null,
      listeners: [],
      subscribe: function (fn) {
        this.listeners.push(fn);
        return function () {
          var i = this.listeners.indexOf(fn);
          if (i !== -1) this.listeners.splice(i, 1);
        }.bind(this);
      },
      set: function (id) {
        if (this.id === id) return;
        this.id = id;
        for (var i = 0; i < this.listeners.length; i++) this.listeners[i](id);
      }
    };


    // ---- edit bus: fallback channel when the background remote is unavailable ----
    var editBus = {
      listeners: [],
      subscribe: function (fn) {
        this.listeners.push(fn);
        return function () {
          var i = this.listeners.indexOf(fn);
          if (i !== -1) this.listeners.splice(i, 1);
        }.bind(this);
      },
      push: function (text, done) {
        if (this.listeners.length === 0) return false;
        this.listeners[0](text, done);
        return true;
      }
    };

    // ---- lens store: session+title keyed versioned documents; same-title calls merge in place within one chat ----
    var lensStore = {
      docs: {},
      callStates: {},
      listeners: [],
      subscribe: function (fn) {
        this.listeners.push(fn);
        return function () {
          var i = this.listeners.indexOf(fn);
          if (i !== -1) this.listeners.splice(i, 1);
        }.bind(this);
      },
      notify: function (doc) {
        for (var i = 0; i < this.listeners.length; i++) this.listeners[i](doc);
      },
      ensure: function (key, args, callId, hasMarker) {
        // A tool call registers exactly once: remounts (chat switches) return the
        // recorded result and NEVER create docs or bump versions again.
        if (callId && this.callStates.hasOwnProperty(callId)) {
          var st = this.callStates[callId];
          return { doc: this.docs[st.key] || this.docs[key] || null, bumped: st.bumped, key: st.key };
        }
        var existing = this.docs[key];
        if (!existing && !hasMarker) {
          // Legacy card without a host session marker: join the newest same-title
          // document under any key WITHOUT bumping — it renders as a full card
          // showing the shared latest content.
          for (var k in this.docs) {
            var d = this.docs[k];
            if (d.title === args.title && (!existing || d.version > existing.version)) existing = d;
          }
          if (existing) {
            this.callStates[callId] = { key: existing.key, bumped: false };
            return { doc: existing, bumped: false, key: existing.key };
          }
        }
        var bumped = existing ? true : false;
        var version = existing ? existing.version + 1 : 1;
        var history = existing ? (existing.history || []).concat([{ version: existing.version, code: existing.code, blocks: existing.blocks, summary: existing.summary || "" }]) : [];
        if (history.length > 20) history = history.slice(history.length - 20);
        var doc = {
          key: key,
          title: args.title,
          callId: callId,
          version: version,
          code: args.code,
          language: args.language,
          blocks: args.blocks,
          history: history,
          summary: ""
        };
        this.docs[key] = doc;
        if (callId) this.callStates[callId] = { key: key, bumped: bumped };
        this.notify(doc);
        return { doc: doc, bumped: bumped, key: key };
      },
      update: function (key, code, language, blocks, summary) {
        var existing = this.docs[key];
        if (!existing) return null;
        var history = (existing.history || []).concat([{ version: existing.version, code: existing.code, blocks: existing.blocks, summary: existing.summary || "" }]);
        if (history.length > 20) history = history.slice(history.length - 20);
        var doc = {
          key: key,
          title: existing.title,
          callId: existing.callId,
          version: existing.version + 1,
          code: code,
          language: language,
          blocks: blocks,
          history: history,
          summary: typeof summary === "string" ? summary : ""
        };
        this.docs[key] = doc;
        this.notify(doc);
        return doc;
      },
      rehome: function (oldKey, newKey) {
        if (oldKey === newKey) return null;
        var moved = this.docs[oldKey];
        var target = this.docs[newKey];
        if (moved && target) {
          delete this.docs[oldKey];
          var prevEntries = [{ version: moved.version, code: moved.code, blocks: moved.blocks, summary: moved.summary || "" }].concat(moved.history || []);
          var hist = prevEntries.concat(target.history || []);
          if (hist.length > 20) hist = hist.slice(hist.length - 20);
          target.history = hist;
          target.aliases = (target.aliases || []).concat(oldKey);
        } else if (moved && !target) {
          delete this.docs[oldKey];
          moved.key = newKey;
          moved.title = newKey.split("\u0000").slice(1).join("\u0000");
          this.docs[newKey] = moved;
        }
        for (var cid in this.callStates) {
          if (this.callStates[cid].key === oldKey) this.callStates[cid].key = newKey;
        }
        var finalDoc = this.docs[newKey];
        if (finalDoc) this.notify(finalDoc);
        return finalDoc;
      },
      hydrate: function (key, currentVersion, entries) {
        var doc = this.docs[key];
        if (!doc) return null;
        var current = null;
        var hist = [];
        for (var i = 0; i < entries.length; i++) {
          var e = entries[i];
          if (e.version === currentVersion) current = e;
          else hist.push({ version: e.version, code: e.code, blocks: e.blocks, summary: e.summary || "" });
        }
        // A fresh registration snapshot is the true first version: when the host
        // moved past it without a history entry (e.g. a rename-shadow promote),
        // keep the snapshot as the oldest browsable version instead of dropping it.
        if (doc.version === 1 && (doc.history || []).length === 0 && currentVersion > 1 && !hist.some(function (h) { return h.version === 1; })) {
          hist = [{ version: 1, code: doc.code, blocks: doc.blocks, summary: doc.summary || "" }].concat(hist);
        }
        // Merge versions the local store already knows but the host lacks (the host
        // may have dropped one through a promote bug). Host content wins per version.
        var byVersion = {};
        for (var j = 0; j < (doc.history || []).length; j++) {
          var le = doc.history[j];
          if (typeof le.version !== "number") continue;
          if (!byVersion.hasOwnProperty(le.version)) byVersion[le.version] = le;
        }
        for (var k = 0; k < hist.length; k++) byVersion[hist[k].version] = hist[k];
        var merged = [];
        for (var v in byVersion) merged.push(byVersion[v]);
        merged.sort(function (a, b) { return a.version - b.version; });
        hist = merged.slice(-20);
        if (current) {
          doc.code = current.code;
          doc.blocks = current.blocks;
          doc.version = currentVersion;
          doc.summary = current.summary || "";
        }
        doc.history = hist;
        this.notify(doc);
        return doc;
      },
      rename: function (oldKey, newTitle) {
        var doc = this.docs[oldKey];
        if (!doc) return null;
        var newKey = oldKey.split("\u0000")[0] + "\u0000" + newTitle;
        if (this.docs[newKey]) return null;
        delete this.docs[oldKey];
        doc.key = newKey;
        doc.title = newTitle;
        this.docs[newKey] = doc;
        for (var cid in this.callStates) {
          if (this.callStates[cid].key === oldKey) this.callStates[cid].key = newKey;
        }
        this.notify(doc);
        return doc;
      },
      get: function (key) { return this.docs[key]; }
    };

    // ---- serialized registration queue: conversation order is preserved while each card resolves its title ----
    var regQueue = {
      items: [],
      results: {},
      listeners: [],
      started: false,
      subscribe: function (fn) {
        this.listeners.push(fn);
        return function () {
          var i = this.listeners.indexOf(fn);
          if (i !== -1) this.listeners.splice(i, 1);
        }.bind(this);
      },
      notify: function (callId) {
        for (var i = 0; i < this.listeners.length; i++) this.listeners[i](callId);
      },
      enqueue: function (item) {
        this.items.push(item);
        if (!this.started) {
          this.started = true;
          var self = this;
          setTimeout(function () { self.drain(); }, 0);
        }
      },
      drain: async function () {
        for (var i = 0; i < this.items.length; i++) {
          var item = this.items[i];
          try {
            if (!remoteCodeLens) {
              await new Promise(function (r) { setTimeout(r, 50); });
            }
            var effTitle = item.title;
            if (item.sid && remoteCodeLens && typeof remoteCodeLens.resolveTitle === "function") {
              try {
                var res = await remoteCodeLens.resolveTitle({ sessionId: item.sid, title: item.title });
                if (res && res.ok && res.value && res.value.title) effTitle = res.value.title;
              } catch (err) {
                // Keep the unresolved title; a transient resolve failure must not blank the card.
              }
            }
            var key = (item.sid || "") + "\u0000" + effTitle;
            var args2 = effTitle === item.title ? item.args : Object.assign({}, item.args, { title: effTitle });
            var r = lensStore.ensure(key, args2, item.callId, item.hasMarker);
            this.results[item.callId] = { doc: r.doc, bumped: r.bumped, key: r.key };
          } catch (err) {
            // Never wipe a previously good result on a re-mount race.
            if (!this.results.hasOwnProperty(item.callId)) this.results[item.callId] = null;
          }
          this.notify(item.callId);
        }
        this.items.length = 0;
        this.started = false;
      }
    };

    // ---- hand-written Typert Remote contribution (strict codecs with pass-through parse) ----
    var chordsRemoteContribution = {
      package: "dsh-chords",
      descriptors: [{
        id: "dsh-chords#chords/regenerate",
        service: "chords",
        namespace: "chords",
        method: "regenerate",
        invocation: { kind: "direct" },
        cancellation: { parameter: "signal" },
        parameters: [{
          name: "request",
          wire: "request",
          source: "json",
          codec: { mode: "strict", typeSymbol: "dsh-chords/types#RegenerateRequest", schema: { parse: function (v) { return v; } } }
        }],
        result: {
          mode: "strict",
          typeSymbol: "dsh-chords/types#RegenerateResult",
          schema: { parse: function (v) { return v; } }
        },
        sourceLocation: { file: "dsh-chords/lib/client.js", line: 1, column: 1 }
      }, {
        id: "dsh-chords#chords/rename",
        service: "chords",
        namespace: "chords",
        method: "rename",
        invocation: { kind: "direct" },
        parameters: [{
          name: "request",
          wire: "request",
          source: "json",
          codec: { mode: "strict", typeSymbol: "dsh-chords/types#RenameRequest", schema: { parse: function (v) { return v; } } }
        }],
        result: {
          mode: "strict",
          typeSymbol: "dsh-chords/types#RenameResult",
          schema: { parse: function (v) { return v; } }
        },
        sourceLocation: { file: "dsh-chords/lib/client.js", line: 1, column: 1 }
      }, {
        id: "dsh-chords#chords/history",
        service: "chords",
        namespace: "chords",
        method: "history",
        invocation: { kind: "direct" },
        parameters: [{
          name: "request",
          wire: "request",
          source: "json",
          codec: { mode: "strict", typeSymbol: "dsh-chords/types#HistoryRequest", schema: { parse: function (v) { return v; } } }
        }],
        result: {
          mode: "strict",
          typeSymbol: "dsh-chords/types#HistoryResult",
          schema: { parse: function (v) { return v; } }
        },
        sourceLocation: { file: "dsh-chords/lib/client.js", line: 1, column: 1 }
      }, {
        id: "dsh-chords#chords/resolveTitle",
        service: "chords",
        namespace: "chords",
        method: "resolveTitle",
        invocation: { kind: "direct" },
        parameters: [{
          name: "request",
          wire: "request",
          source: "json",
          codec: { mode: "strict", typeSymbol: "dsh-chords/types#ResolveTitleRequest", schema: { parse: function (v) { return v; } } }
        }],
        result: {
          mode: "strict",
          typeSymbol: "dsh-chords/types#ResolveTitleResult",
          schema: { parse: function (v) { return v; } }
        },
        sourceLocation: { file: "dsh-chords/lib/client.js", line: 1, column: 1 }
      }]
    };

    function buildEditMessage(title, language, code, blockId, oldText, newText) {
      return [
        T("msg.edit.header"),
        T("msg.edit.title") + (title || (currentLocale === "en" ? "Untitled" : "未命名")),
        T("msg.edit.lang") + (language || (currentLocale === "en" ? "unknown" : "未知")),
        T("msg.edit.block") + blockId,
        T("msg.edit.old") + oldText,
        T("msg.edit.new") + newText,
        T("msg.edit.code"),
        "```",
        code,
        "```"
      ].join("\n");
    }

    function buildRedesignMessage(title, language, code, instruction) {
      return [
        T("msg.redesign.header"),
        T("msg.edit.title") + (title || (currentLocale === "en" ? "Untitled" : "未命名")),
        T("msg.edit.lang") + (language || (currentLocale === "en" ? "unknown" : "未知")),
        T("msg.redesign.inst") + instruction,
        T("msg.redesign.code"),
        "```",
        code,
        "```"
      ].join("\n");
    }

    var CERTAINTY = {
      explicit: { label: T("certainty.explicit"), color: "#4c8dff" },
      inferred: { label: T("certainty.inferred"), color: "#f0a020" },
      default: { label: T("certainty.default"), color: "#9aa0a6" }
    };

    function parseArgsRaw(raw) {
      if (!raw) return null;
      try { return JSON.parse(raw); } catch (e) { return null; }
    }

    function splitLines(s) {
      return String(s).replace(/\r\n/g, "\n").split("\n");
    }

    // KEEP IN SYNC with lib/index.js anchorLineIndex (host side); this copy adds a fromLine hint.
    function anchorLineIndex(codeText, anchor, fromLine) {
      var code = String(codeText).replace(/\r\n/g, "\n");
      var text = String(anchor).replace(/\r\n/g, "\n");
      if (text.trim() === "") return null;
      var from = typeof fromLine === "number" && fromLine > 0 ? fromLine : 0;
      var offset = 0;
      if (from > 0) {
        var upTo = splitLines(code).slice(0, from);
        for (var k = 0; k < upTo.length; k++) offset += upTo[k].length + 1;
      }
      var exact = code.indexOf(text, offset);
      if (exact !== -1) {
        var n = 0;
        for (var i = 0; i < exact; i++) if (code.charCodeAt(i) === 10) n += 1;
        return n;
      }
      var aLines = splitLines(text);
      var cLines = splitLines(code);
      for (var i2 = from; i2 + aLines.length <= cLines.length; i2++) {
        var ok = true;
        for (var j = 0; j < aLines.length; j++) {
          if (cLines[i2 + j].trim() !== aLines[j].trim()) { ok = false; break; }
        }
        if (ok) return i2;
      }
      return null;
    }

    function parseRange(text) {
      if (typeof text !== "string" || text === "") return null;
      var m = text.match(/^(\d+)\s*(?:[-\u2013]\s*(\d+))?$/);
      if (!m) return null;
      var a = parseInt(m[1], 10);
      var b = m[2] ? parseInt(m[2], 10) : a;
      return [a, b];
    }

    function computeRanges(codeText, blocks) {
      var starts = {};
      var ordered = [];
      var hint = 0;
      for (var i = 0; i < blocks.length; i++) {
        var b = blocks[i];
        if (typeof b.anchor === "string" && b.anchor.trim() !== "") {
          var li = anchorLineIndex(codeText, b.anchor, hint);
          if (li !== null) { starts[b.id] = li; ordered.push(b); hint = li + 1; }
        }
      }
      ordered.sort(function (x, y) { return starts[x.id] - starts[y.id]; });
      var lastLine = splitLines(codeText).length - 1;
      var ranges = {};
      for (var i3 = 0; i3 < blocks.length; i3++) {
        var b3 = blocks[i3];
        var s = starts[b3.id];
        if (s !== undefined) {
          var end = lastLine;
          for (var k = 0; k < ordered.length; k++) {
            if (ordered[k].id === b3.id) {
              var nxt = ordered[k + 1];
              if (nxt && starts[nxt.id] > s) end = starts[nxt.id] - 1;
              break;
            }
          }
          if (end < s) end = s;
          ranges[b3.id] = [s, end];
        } else {
          var pr = parseRange(b3.lines);
          if (pr) { ranges[b3.id] = [pr[0] - 1, pr[1] - 1]; }
        }
      }
      return ranges;
    }

    function rangeChip(b, ranges) {
      var r = ranges[b.id];
      if (r) {
        return r[0] === r[1] ? "L" + (r[0] + 1) : "L" + (r[0] + 1) + "-" + (r[1] + 1);
      }
      return b.lines ? "L" + b.lines : null;
    }

    function CodeLensCard(props) {
      var block = props.block;
      var callId = props.callId;
      var done = "kind" in block;
      var raw = done ? ((block.call && block.call.argsRaw) || "") : (block.argsRaw || "");
      var args = parseArgsRaw(raw);
      var hoverState = React.useState(null);
      var hover = hoverState[0];
      var setHover = hoverState[1];
      var editingState = React.useState(null);
      var editing = editingState[0];
      var setEditing = editingState[1];
      var draftState = React.useState("");
      var draft = draftState[0];
      var setDraft = draftState[1];
      var statusState = React.useState("");
      var status = statusState[0];
      var setStatus = statusState[1];
      var wholeEditingState = React.useState(false);
      var wholeEditing = wholeEditingState[0];
      var setWholeEditing = wholeEditingState[1];
      var instructionState = React.useState("");
      var instruction = instructionState[0];
      var setInstruction = instructionState[1];
      var title = (args && typeof args.title === "string" && args.title) ? args.title : "";
      var sidState = React.useState(function () {
        // Settled cards carry the host-proven session marker in their result
        // content: read it synchronously so the first registration uses the
        // correct key (bridge state may still be another chat at mount time).
        if (done && block && block.content) {
          try {
            var text = block.content.map(function (c) { return c && c.type === "text" ? c.text : ""; }).join("");
            var m = text.match(/\[(?:chords|code-lens):session=([A-Za-z0-9-]+)\]/);
            if (m) return m[1];
          } catch (err) {}
        }
        return sessionState.id;
      });
      var sid = sidState[0];
      var setSid = sidState[1];
      React.useEffect(function () {
        return sessionState.subscribe(function (id) { setSid(id); });
      }, []);
      React.useEffect(function () {
        try {
          if (!done || !block || !block.content) return;
          var text = block.content.map(function (c) { return c && c.type === "text" ? c.text : ""; }).join("");
          var m = text.match(/\[(?:chords|code-lens):session=([A-Za-z0-9-]+)\]/);
          if (m) { sessionState.set(m[1]); setHasMarker(true); }
        } catch (err) {}
      }, [done, block]);
      var busyStateVal = React.useState(false);
      var busy = busyStateVal[0];
      var setBusy = busyStateVal[1];
      var abortRef = React.useRef(null);
      var codePaneRef = React.useRef(null);
      var notesPaneRef = React.useRef(null);
      var noteRefs = {};
      var hasMarkerState = React.useState(function () {
        try {
          if (done && block && block.content) {
            var mt = block.content.map(function (c) { return c && c.type === "text" ? c.text : ""; }).join("");
            return /\[(?:chords|code-lens):session=([A-Za-z0-9-]+)\]/.test(mt);
          }
        } catch (err) {}
        return false;
      });
      var hasMarker = hasMarkerState[0];
      var setHasMarker = hasMarkerState[1];
      var mountedRunningState = React.useState(function () { return !done; });
      var mountedRunning = mountedRunningState[0];
      var viewIdxState = React.useState(0);
      var viewIdx = viewIdxState[0];
      var setViewIdx = viewIdxState[1];
      var renamingState = React.useState(false);
      var renaming = renamingState[0];
      var setRenaming = renamingState[1];
      var renameDraftState = React.useState("");
      var renameDraft = renameDraftState[0];
      var setRenameDraft = renameDraftState[1];
      var storeKey = (sid || "") + "\u0000" + title;
      var queuedRef = React.useRef(false);
      var ensureState = React.useState(function () {
        if (!args || typeof args.code !== "string") return null;
        if (mountedRunning && !hasMarker) return null;
        if (!sid && !hasMarker) return null;
        queuedRef.current = true;
        regQueue.enqueue({ sid: sid, title: title, args: args, callId: callId, hasMarker: hasMarker });
        return null;
      });
      var ensure = ensureState[0];
      var setEnsure = ensureState[1];
      var doc = ensure ? ensure.doc : null;
      var isUpdater = ensure ? ensure.bumped : false;
      var docKeyVar = ensure ? ensure.key : null;
      React.useEffect(function () {
        if (!doc) return;
        return lensStore.subscribe(function (d) {
          // Match either by key (bumps keep the key) or by callId (renames move the key).
          if (d && ((doc && d.callId === doc.callId) || d.key === docKeyVar || (d.aliases && d.aliases.indexOf(docKeyVar) !== -1))) {
            setEnsure(function (prev) { return prev ? { doc: d, bumped: prev.bumped, key: d.key } : prev; });
            setStatus("");
            setViewIdx(0);
          }
        });
      }, [docKeyVar]);
      React.useEffect(function () {
        if (!args || typeof args.code !== "string") return;
        if (queuedRef.current) return;
        if (mountedRunning && !hasMarker) return;
        if (!sid && !hasMarker) return;
        queuedRef.current = true;
        regQueue.enqueue({ sid: sid, title: title, args: args, callId: callId, hasMarker: hasMarker });
      }, [storeKey, done, hasMarker, mountedRunning]);
      React.useEffect(function () {
        function check() {
          if (regQueue.results.hasOwnProperty(callId)) {
            var r = regQueue.results[callId];
            if (r) setEnsure({ doc: r.doc, bumped: r.bumped, key: r.key });
          }
        }
        check();
        return regQueue.subscribe(function (cid) { if (cid === callId) check(); });
      }, [callId]);
      var hydratedRef = React.useRef(false);
      React.useEffect(function () {
        if (hydratedRef.current) return;
        if (!done || !sid || !ensure || !ensure.key) return;
        if (!remoteCodeLens || typeof remoteCodeLens.history !== "function") return;
        hydratedRef.current = true;
        var myKey = ensure.key;
        remoteCodeLens.history({ sessionId: sid, title: title }).then(function (res) {
          if (!res || !res.ok || !res.value || !res.value.found) return;
          var v = res.value;
          var targetKey = (sid || "") + "\u0000" + v.title;
          if (targetKey !== myKey) lensStore.rehome(myKey, targetKey);
          lensStore.hydrate(targetKey, v.currentVersion, v.entries);
        }).catch(function () {});
      }, [done, sid, ensure, title]);
      var preLive = (docKeyVar ? lensStore.get(docKeyVar) : null) || doc;
      var preHist = preLive && Array.isArray(preLive.history) ? preLive.history : [];
      var preBrowsing = viewIdx > 0 && viewIdx <= preHist.length ? preHist[preHist.length - viewIdx] : null;
      var preCode = preBrowsing ? String(preBrowsing.code || "").replace(/\r\n/g, "\n") : (preLive && typeof preLive.code === "string" ? preLive.code.replace(/\r\n/g, "\n") : "");
      var preBlocks = preBrowsing ? (Array.isArray(preBrowsing.blocks) ? preBrowsing.blocks : []) : (preLive && Array.isArray(preLive.blocks) ? preLive.blocks : []);
      var preRanges = preCode ? computeRanges(preCode, preBlocks) : {};
      var preLit = {};
      if (hover) {
        var hr = preRanges[hover.id];
        if (hr) { for (var i = hr[0]; i <= hr[1]; i++) preLit[i] = true; }
      }
      React.useEffect(function () {
        var pane = codePaneRef.current;
        if (!pane) return;
        var scheduled = false;
        function sync() {
          scheduled = false;
          try {
            var shiki = pane.querySelector(".shiki");
            if (!shiki) return;
            var codeEl = shiki.querySelector("code");
            if (codeEl) {
              for (var ti = codeEl.childNodes.length - 1; ti >= 0; ti--) {
                if (codeEl.childNodes[ti].nodeType === 3) codeEl.removeChild(codeEl.childNodes[ti]);
              }
            }
            var lines = pane.querySelectorAll(".line");
            for (var i2 = 0; i2 < lines.length; i2++) {
              lines[i2].setAttribute("data-line", String(i2));
              if (preLit[i2]) lines[i2].classList.add("cl-line-lit");
              else lines[i2].classList.remove("cl-line-lit");
            }
          } catch (err) {}
        }
        sync();
        var observer = null;
        try {
          observer = new MutationObserver(function () {
            if (scheduled) return;
            scheduled = true;
            setTimeout(function () { sync(); }, 0);
          });
          observer.observe(pane, { childList: true, subtree: true });
        } catch (err) {}
        return function () { if (observer) observer.disconnect(); };
      }, [preLit, preCode]);
      if (!args || typeof args.code !== "string") {
        return React.createElement("div", { className: "cl-card cl-empty" }, done ? T("card.noArgs") : T("card.loading"));
      }
      if (!doc) {
        return React.createElement("div", { className: "cl-card cl-empty" }, T("card.noDoc"));
      }
      var liveDoc = preLive;
      if (isUpdater) {
        return React.createElement("div", {
          className: "cl-card cl-strip cl-strip-click",
          "data-cl-title": liveDoc.title,
          title: T("strip.jump"),
          onClick: function (e) { try { scrollToOriginalCard(liveDoc.title, e.currentTarget); } catch (err) {} }
        },
          React.createElement("span", null, "✨"),
          T("strip") + liveDoc.version + " —— " + T("strip.jump"),
          React.createElement("span", { className: "cl-strip-arrow" }, " ↑")
        );
      }
      var codeText = preCode;
      var blocks = preBlocks;
      var ranges = preRanges;
      var lit = preLit;
      function blockAtLine(n) {
        for (var i = 0; i < blocks.length; i++) {
          var r = ranges[blocks[i].id];
          if (r && n >= r[0] && n <= r[1]) return blocks[i];
        }
        return null;
      }
      function centerInPane(pane, target) {
        if (!pane || !target) return;
        var p = pane.getBoundingClientRect();
        var t = target.getBoundingClientRect();
        var top = pane.scrollTop + (t.top - p.top) - (p.height * 0.15);
        if (typeof pane.scrollTo === "function") pane.scrollTo({ top: top, behavior: "smooth" });
        else pane.scrollTop = top;
      }
      function handleNoteClick(b) {
        var r = ranges[b.id];
        if (r && codePaneRef.current) {
          var el = codePaneRef.current.querySelector('[data-line="' + r[0] + '"]');
          if (el) { centerInPane(codePaneRef.current, el); return; }
        }
        if (noteRefs[b.id]) centerInPane(notesPaneRef.current, noteRefs[b.id]);
      }
      function handleLineClick(idx) {
        var b = blockAtLine(idx);
        if (b) centerInPane(notesPaneRef.current, noteRefs[b.id]);
      }
      function scrollToOriginalCard(title, skipEl) {
        var cards = document.querySelectorAll(".cl-card");
        for (var i = 0; i < cards.length; i++) {
          var el = cards[i];
          if (el === skipEl) continue;
          if (el.getAttribute("data-cl-title") === title) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
            el.classList.remove("cl-flash");
            void el.offsetWidth;
            el.classList.add("cl-flash");
            window.setTimeout(function () { el.classList.remove("cl-flash"); }, 1500);
            return;
          }
        }
      }
      function pushFallback(text, statusText) {
        var ok = editBus.push(text, function (result) {
          setStatus(result === "submitted" ? statusText + "；" + T("status.sent") : statusText + "；" + T("status.clipboard"));
        });
        if (!ok) {
          try { if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text); } catch (e) {}
          setStatus(statusText + "；" + T("status.noBridge"));
        }
      }
      function submitLens(request, fallbackText) {
        if (remoteCodeLens && typeof remoteCodeLens.regenerate === "function") {
          var controller = new AbortController();
          abortRef.current = controller;
          setBusy(true);
          setStatus(T("status.working"));
          remoteCodeLens.regenerate(request, controller.signal).then(function (res) {
            if (controller.signal.aborted) {
              abortRef.current = null;
              setBusy(false);
              setStatus(T("status.cancelled"));
              return;
            }
            abortRef.current = null;
            setBusy(false);
            if (res && res.ok && res.value) {
              var value = res.value;
              lensStore.update(liveDoc.key, value.code, value.language || request.language, value.blocks, value.summary);
              var doc2 = lensStore.get(liveDoc.key);
              var ver = (typeof value.version === "number") ? value.version : (doc2 ? doc2.version : liveDoc.version + 1);
              setStatus((value.summary ? value.summary + " " : "") + T("status.updated") + ver + (value.persisted === false ? T("status.persistWarn") : ""));
            } else {
              var reason = (res && res.error && res.error.message) || "unknown";
              pushFallback(fallbackText, T("status.remoteFail") + reason);
            }
          }).catch(function (e) {
            if (controller.signal.aborted) {
              abortRef.current = null;
              setBusy(false);
              setStatus(T("status.cancelled"));
              return;
            }
            abortRef.current = null;
            setBusy(false);
            pushFallback(fallbackText, T("status.remoteError") + (e && e.message ? e.message : String(e)));
          });
        } else {
          pushFallback(fallbackText, T("status.remoteMissing"));
        }
      }
      function cancelEdit() {
        if (abortRef.current) abortRef.current.abort();
        setBusy(false);
        setStatus(T("status.cancelled"));
      }
      function submitRename() {
        if (busy) { setStatus(T("status.busy")); return; }
        var newTitle = renameDraft.trim();
        if (newTitle === "" || newTitle === liveDoc.title) { setRenaming(false); return; }
        var oldTitle = liveDoc.title;
        var oldKey = liveDoc.key;
        setRenaming(false);
        if (remoteCodeLens && typeof remoteCodeLens.rename === "function") {
          setStatus(T("status.renaming"));
          var req = { sessionId: sid, title: oldTitle, newTitle: newTitle };
          remoteCodeLens.rename(req).then(function (res) {
            if (res && res.ok && res.value && res.value.ok) {
              lensStore.rename(oldKey, res.value.title);
              setStatus(T("status.renamed") + res.value.title + "」");
            } else {
              var reason = (res && res.error && res.error.message) || "unknown";
              setStatus(T("status.renameFailed") + reason);
            }
          }).catch(function (e) {
            setStatus(T("status.renameFailed") + (e && e.message ? e.message : String(e)));
          });
        } else {
          lensStore.rename(oldKey, newTitle);
          setStatus(T("status.renamed") + newTitle + "」（仅本页生效）");
        }
      }
      function submitEdit(b) {
        var request = {
          title: liveDoc.title,
          language: (typeof liveDoc.language === "string" && liveDoc.language) ? liveDoc.language : "",
          code: codeText,
          blocks: blocks,
          blockId: b.id,
          oldPseudocode: b.pseudocode,
          newPseudocode: draft
        };
        if (sid) request.sessionId = sid;
        request.locale = currentLocale;
        setEditing(null);
        setRenaming(false);
        submitLens(request, buildEditMessage(liveDoc.title, liveDoc.language, codeText, b.id, b.pseudocode, draft));
      }
      function submitWhole() {
        var text = instruction.trim();
        if (text === "") {
          setStatus(T("status.emptyInstruction"));
          return;
        }
        var request = {
          title: liveDoc.title,
          language: (typeof liveDoc.language === "string" && liveDoc.language) ? liveDoc.language : "",
          code: codeText,
          blocks: blocks,
          instruction: text
        };
        if (sid) request.sessionId = sid;
        request.locale = currentLocale;
        setWholeEditing(false);
        setRenaming(false);
        submitLens(request, buildRedesignMessage(liveDoc.title, liveDoc.language, codeText, text));
      }
      var legend = Object.keys(CERTAINTY).map(function (k) {
        var c = CERTAINTY[k];
        return React.createElement("span", { key: k, className: "cl-legend-item" },
          React.createElement("span", { className: "cl-dot", style: { background: c.color } }),
          c.label
        );
      });
      var head = React.createElement("div", { className: "cl-head" },
        renaming ? React.createElement("span", { className: "cl-rename-box" },
          React.createElement("input", {
            className: "cl-rename-input",
            value: renameDraft,
            autoFocus: true,
            onChange: function (e) { setRenameDraft(e.target.value); },
            onKeyDown: function (e) { if (e.key === "Enter") submitRename(); if (e.key === "Escape") setRenaming(false); }
          }),
          React.createElement("button", { className: "cl-btn cl-btn-primary", disabled: busy, onClick: submitRename }, T("btn.ok")),
          React.createElement("button", { className: "cl-btn", onClick: function () { setRenaming(false); } }, "取消")
        ) : React.createElement("span", {
          className: "cl-title cl-title-editable",
          title: T("title.rename"),
          onClick: function () { if (!busy) { setRenaming(true); setRenameDraft(liveDoc.title); } }
        }, liveDoc.title || "和弦"),
        (typeof liveDoc.language === "string" && liveDoc.language) ? React.createElement("span", { className: "cl-lang" }, liveDoc.language) : null,
        React.createElement("button", {
          className: "cl-head-edit",
          title: "用自然语言重设计整个代码块",
          disabled: busy,
          onClick: function () { setWholeEditing(true); setInstruction(""); setStatus(""); }
        }, T("edit.whole")),
        (function () {
          var shown = preBrowsing ? preBrowsing.version : liveDoc.version;
          if (preHist.length === 0) return null;
          return React.createElement("span", { className: "cl-nav" },
            React.createElement("button", { className: "cl-nav-btn", disabled: viewIdx >= preHist.length, title: T("nav.prev"), onClick: function () { setViewIdx(viewIdx + 1); } }, "◀"),
            React.createElement("span", { className: "cl-nav-label" }, "v" + shown + "/" + liveDoc.version),
            React.createElement("button", { className: "cl-nav-btn", disabled: viewIdx <= 0, title: T("nav.next"), onClick: function () { setViewIdx(viewIdx - 1); } }, "▶"),
            viewIdx > 0 ? React.createElement("button", { className: "cl-nav-btn", title: T("btn.latest"), onClick: function () { setViewIdx(0); } }, T("btn.latest")) : null
          );
        })(),
        liveDoc.version > 1 ? React.createElement("span", { className: "cl-version" }, "v" + liveDoc.version + " " + T("badge.synced")) : null,
        React.createElement("span", { className: "cl-legend" }, legend)
      );
      function lineIndexOf(el) {
        if (!el || !el.parentElement) return -1;
        return Array.prototype.indexOf.call(el.parentElement.children, el);
      }
      function handleCodeLineEvent(e, isClick) {
        var line = (e.target && e.target.closest) ? e.target.closest(".line") : null;
        if (!line) return;
        var idx = lineIndexOf(line);
        if (idx < 0) return;
        if (isClick) { handleLineClick(idx); return; }
        var b = blockAtLine(idx);
        if (b) setHover(b);
      }
      var codePane = React.createElement("div", {
        className: "cl-code",
        ref: codePaneRef,
        onMouseOver: function (e) { handleCodeLineEvent(e, false); },
        onClick: function (e) { handleCodeLineEvent(e, true); }
      }, React.createElement(CodeBlock, { code: codeText, lang: liveDoc.language || undefined }));
      var notes = React.createElement("div", { className: "cl-notes", ref: notesPaneRef },
        blocks.length === 0 ? React.createElement("div", { className: "cl-empty" }, T("card.noBlocks")) : blocks.map(function (b) {
          var cert = CERTAINTY[b.certainty] || CERTAINTY.default;
          var cx = b.complexity;
          var chip = rangeChip(b, ranges);
          var isEditing = editing === b.id;
          return React.createElement("div", {
            key: b.id,
            ref: function (el) { noteRefs[b.id] = el; },
            className: "cl-note" + (hover && hover.id === b.id ? " cl-note-lit" : ""),
            onMouseEnter: function () { setHover(b); },
            onMouseLeave: function () { setHover(null); },
            onClick: function () { handleNoteClick(b); }
          },
            React.createElement("div", { className: "cl-note-head" },
              React.createElement("span", { className: "cl-dot", style: { background: cert.color } }),
              React.createElement("span", { className: "cl-note-id" }, b.id),
              chip ? React.createElement("span", { className: "cl-note-lines" }, chip) : null,
              React.createElement("span", { className: "cl-note-cert", style: { color: cert.color } }, cert.label),
              React.createElement("button", {
                className: "cl-edit-btn",
                title: "修改这段伪代码",
                disabled: busy,
                onClick: function () { setEditing(b.id); setDraft(b.pseudocode); setStatus(""); }
              }, T("edit.block"))
            ),
            isEditing ? React.createElement("div", null,
              React.createElement("textarea", {
                className: "cl-note-textarea",
                value: draft,
                onChange: function (e) { setDraft(e.target.value); }
              }),
              React.createElement("div", { className: "cl-note-actions" },
                React.createElement("button", { className: "cl-btn cl-btn-primary", disabled: busy, onClick: function () { submitEdit(b); } }, T("btn.submit")),
                React.createElement("button", { className: "cl-btn", onClick: function () { setEditing(null); } }, T("btn.cancel"))
              )
            ) : React.createElement("div", { className: "cl-note-text" }, b.pseudocode),
            (cx && (cx.time || cx.space)) ? React.createElement("div", { className: "cl-note-cx" },
              cx.time ? React.createElement("span", null, "时间 · " + cx.time) : null,
              cx.space ? React.createElement("span", null, "空间 · " + cx.space) : null
            ) : null,
            b.rationale ? React.createElement("div", { className: "cl-note-why" }, b.rationale) : null
          );
        })
      );
      var cancelButton = busy ? React.createElement("button", { className: "cl-btn cl-btn-cancel", onClick: cancelEdit }, T("btn.stop")) : null;
      var wholeEditor = wholeEditing ? React.createElement("div", { className: "cl-whole" },
        React.createElement("textarea", {
          className: "cl-note-textarea cl-whole-textarea",
          placeholder: T("placeholder.whole"),
          value: instruction,
          onChange: function (e) { setInstruction(e.target.value); }
        }),
        React.createElement("div", { className: "cl-note-actions" },
          React.createElement("button", { className: "cl-btn cl-btn-primary", disabled: busy, onClick: submitWhole }, T("btn.submitWhole")),
          React.createElement("button", { className: "cl-btn", onClick: function () { setWholeEditing(false); } }, T("btn.cancel"))
        )
      ) : null;
      return React.createElement("div", { className: "cl-card", "data-cl-title": liveDoc.title },
        head,
        status ? React.createElement("div", { className: "cl-status" }, status, cancelButton) : null,
        wholeEditor,
        React.createElement("div", { className: "cl-body" }, codePane, notes)
      );
    }

    /** Per-card error boundary: one broken card must never unmount every card. */
    function SafeCard(props) {
      try {
        return CodeLensCard(props);
      } catch (error) {
        return React.createElement("div", { className: "cl-card cl-empty" },
          T("card.renderError"),
          (error && error.message ? error.message : String(error)),
          React.createElement("br"),
          T("card.reportError")
        );
      }
    }

    /** Session-scoped input bridge: fallback submit path + session id capture. */
    function EditBridge(props) {
      var actions = props.inputActions;
      if (!sessionState.id && props.sessionId && typeof props.sessionId === "string") sessionState.set(props.sessionId);
      if (!sessionState.id && props.session && props.session.id) sessionState.set(props.session.id);
      try {
        if (!sessionState.id && typeof props.useSession === "function") {
          var snap = props.useSession();
          if (snap && typeof snap === "object") {
            var sid = snap.sessionId || (snap.session && snap.session.id) || snap.id;
            if (typeof sid === "string" && sid !== "") sessionState.set(sid);
          }
        }
      } catch (e) {}
      var reqState = React.useState(null);
      var req = reqState[0];
      var setReq = reqState[1];
      React.useEffect(function () {
        return editBus.subscribe(function (text, done) { setReq({ text: text, done: done }); });
      }, []);
      React.useEffect(function () {
        if (!req) return;
        var r = req;
        setReq(null);
        if (actions && typeof actions.setDraft === "function" && typeof actions.submit === "function") {
          actions.setDraft(r.text);
          setTimeout(function () { actions.submit(); }, 0);
          r.done("submitted");
        } else {
          try { if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(r.text); } catch (e) {}
          r.done("clipboard");
        }
      }, [req, actions]);
      return null;
    }

    var name = "chords-toolview";
    var inject = ["slots", "remote"];
    function apply(ctx) {
      var slots = ctx.get("slots");
      var remote = ctx.get("remote");
      if (remote && typeof remote.$mount === "function") {
        ctx.effect(async function () {
          try {
            var dispose = await remote.$mount(chordsRemoteContribution);
            var svc = ctx.get("remote.chords");
            if (svc) remoteCodeLens = svc;
            return async function () {
              remoteCodeLens = null;
              await dispose();
            };
          } catch (e) {
            console.warn("chords: remote mount failed, conversation fallback only:", e && e.message);
          }
        }, "chords remote mount");
      }
      if (slots === undefined) return;
      slots.inject("tool.call.toolview", function* () {
        yield slots.register({ name: "tool.call.toolview", key: "chords", locale: "conversation" }, SafeCard);
        // Legacy key keeps cards created before the chords rename rendering.
        yield slots.register({ name: "tool.call.toolview", key: "code_lens", locale: "conversation" }, SafeCard);
      });
      slots.inject("conversation.input.dock", function () {
        return slots.register({ name: "conversation.input.dock", id: "chords", locale: "conversation" }, EditBridge);
      });
      slots.inject("conversation.composer.dock", function () {
        return slots.register({ name: "conversation.composer.dock", id: "chords", locale: "conversation" }, EditBridge);
      });
    }
    exports.apply = apply;
    exports.inject = inject;
    exports.name = name;
    return module.exports;
  }
});
