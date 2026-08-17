<img width="832" height="372" alt="封面" src="https://github.com/user-attachments/assets/cb30cf99-b667-4e3e-81df-214359302fd9" />

# dsh-chords · Chords（和弦）

> DeepSeek Harness 插件：代码与自然语言的**和弦**；CHORDS = Code Harness, Online Reference for DeepSeek.
> 
> A DeepSeek Harness plugin: a chord between code and natural language — CHORDS = Code Harness, Online Reference for DeepSeek.

版本 Version: **0.3.3** | 兼容 Compatible with: **DeepSeek Harness 0.1.0-rc.6**

---

## 功能特性 / Features

- **双栏卡片**：左侧代码（语法高亮 + 行号），右侧分块伪代码（通俗易懂的自然语言）
  **Dual-pane card**: code on the left (syntax highlight + line numbers), chunked pseudocode on the right (real natural language, never if/for/new keywords)
- **三色确定性标签**：🔵 明确（用户要求）/ 🟡 推测（上下文推导）/ ⚪ 默认（惯例填充）
  **Certainty labels**: 🔵 Explicit / 🟡 Inferred / ⚪ Default
- **锚点高亮**：悬停解释块 → 对应代码行整行琥珀色高亮；点击任一侧 → 对侧滚动居中
  **Anchor highlighting**: hover a pseudocode block to light the exact code lines; click either side to center the counterpart
- **原地编辑**：✎ 修改（块级精修）/ ✎ 改算法（整体重设计）；后台 LLM 完成，**对话完全零污染**
  **In-place editing**: block-level edits and whole-card redesigns run in the background — the conversation stays untouched
- **版本历史**：◀ ▶ 浏览任意历史版本；基于任意版本修改都追加为最新版本；每卡上限 20 版
  **Version history**: browse any past version with ◀ ▶; edits based on any version always append as the newest; 20 versions per card
- **重命名**：点击标题即可改名；改名链保证旧标题查询依然命中、刷新后依然生效
  **Rename**: click the title to rename; the rename chain keeps old titles resolvable across refreshes
- **Agent 集成**：后台修改自动进入运行时上下文；chords_current / chords_list / chords_history 供 agent 查询任意版本
  **Agent integration**: background edits surface in the runtime context; three query tools let the agent read any version
- **持久化**：文档、历史、改名链落盘，重启存活；TTL 自动老化；会话销毁即清理
  **Persistence**: docs, history and rename chains survive restarts; TTL aging; cleaned up on session disposal
- **自动国际化**：非中文系统自动切换英文界面
  **Auto i18n**: English UI on non-Chinese systems
- **分层模型路由**：按代码长度自动选择模型档位与思考级别（见下文）
  **Tiered model routing**: model tier and reasoning level follow the code size (see below)


---

## 环境要求 / Requirements

- DeepSeek Harness 已安装（dsh 命令可用，web profile 可启动），版本 0.1.0-rc.6 或 API 兼容
  DeepSeek Harness installed (the dsh command works and the web profile boots), version 0.1.0-rc.6 or API-compatible
- 模型路由可用（默认 deepseek-official；其他厂商需对应适配器已安装）
  A usable model route (deepseek-official by default; other vendors need their adapters installed)

---

## 安装 / Installation

### 1. 复制插件目录 / Copy the plugin directory

```powershell
# 将包内的 dsh-chords 文件夹复制到 DSH 的共享 node_modules：
Copy-Item -Recurse ./dsh-chords "$env:DSH_HOME\profiles\node_modules\"
# 或在目标机器上走 pnpm：
dsh plugin --profile web add <本目录路径>
```

### 2. 注册插件 / Register the plugin

编辑 `$env:DSH_HOME\profiles\web\cordis.patch.yml`，把 `[]` 替换为：

```yaml
- insert:
    - id: chords
      name: dsh-chords
      # 可选配置见下文「模型路由与配置」
```

### 3. 重启 / Restart

```powershell
dsh web --port 8080
```

刷新浏览器页面。让 agent 生成一段代码，应出现双栏卡片。
Refresh the browser. Ask the agent to write some code — the dual-pane card should appear.

---

## 使用教程 / Tutorial

### 1. 生成卡片 / Create a card

<img width="865" height="842" alt="image" src="https://github.com/user-attachments/assets/da215493-2f3d-4fd0-a78f-09e5efa86906" />

在对话里让 agent 写代码。agent 会自动调用 chords，
代码以双栏卡片呈现，且不会在正文重复粘贴。
Ask the agent for code in the conversation (e.g. write a merge sort in Python). The agent calls
chords automatically: the code appears as a dual-pane card and is never duplicated in the message.

### 2. 阅读卡片 / Reading the card

<img width="865" height="597" alt="image" src="https://github.com/user-attachments/assets/bafecb3d-b60c-46d0-880d-c1248a00f9cf" />

- 左侧代码：语法高亮、行号、整行可点
  Left pane: highlighted code with line numbers; each full line is clickable
- 右侧每个解释块：块 id、行号徽章（如 L3-7）、确定性圆点、伪代码、复杂度徽章、理由
  Right pane blocks: id, line-range chip (e.g. L3-7), certainty dot, pseudocode, complexity chips, rationale
- 悬停解释块 → 对应代码行整行高亮；点击任一侧 → 对侧滚动居中
  Hover a block to light the matching code lines; click either side to center the counterpart

### 3. 修改卡片/ Edit a card

<img width="865" height="507" alt="image" src="https://github.com/user-attachments/assets/03b92c71-ae1a-407a-b83d-5a3e6b1a603d" />

- 块级精修：悬停解释块 → 点「✎ 修改」→ 改写该块伪代码 → 「提交修改」。只改这一块，其余保持不变
  Block edit: hover a block → ✎ Edit → rewrite its pseudocode → Submit. Only that block changes
- 整体重设计：点「✎ 改算法」→ 用自然语言描述新算法 → 「提交重设计」。允许自由重新分块
  Whole redesign: ✎ Redesign → describe the new algorithm in natural language → Submit redesign. Re-chunking is allowed
- 修改在后台由 LLM 完成，卡片原地更新（版本 +1、摘要提示），对话里不会出现任何消息
  The edit runs in the background; the card updates in place (version +1, summary toast). No conversation messages appear
- 进行中可「终止修改」；同一时间一张卡只允许一个在途修改
  You can Stop an in-flight edit; one edit at a time per card

### 4. 版本历史 / Version history

<img width="865" height="614" alt="image" src="https://github.com/user-attachments/assets/8db1610f-65a2-4531-b3d4-e52fdb1ae2d3" />

- 卡片头部 ◀ v2/5 ▶ 浏览历史版本；「回到最新」返回
  Use ◀ v2/5 ▶ in the header to browse past versions; Back to latest returns
- 从任意历史版本发起修改，结果都追加为最新版本（不分支、不覆盖历史）
  Edits started from any past version always append as the newest version (no branching, history is never rewritten)
- 刷新/重启后历史依然完整（宿主持久化）
  History survives refreshes and restarts (host-persisted)

### 5. 重命名 / Rename

<img width="865" height="604" alt="image" src="https://github.com/user-attachments/assets/887c32b3-4df6-466d-99c7-46415f3c95c7" />

点击卡片标题 → 输入新名 → 回车。改名后：旧标题查询依然命中、刷新后依然生效、后续修改继续合并到同一张卡。
Click the card title, type the new name, press Enter. After renaming: old-title queries still resolve,
the rename survives refreshes, and later edits keep merging into the same card.

### 6. 对话内修改与查询 / In-conversation edits and queries

<img width="865" height="455" alt="image" src="https://github.com/user-attachments/assets/4cc00724-942b-42f2-bf58-a169eb25a693" />

- 直接在对话里说「把这段改成 XX」：agent 会先查最新版（chords_current）再修改，同标题合并成细条
  Say change this to XX in the conversation: the agent reads the latest version first and merges the update into the same card
- 「这个卡片 v2 时长什么样？」：agent 用 chords_history 拉取任意历史版本
  What did this card look like at v2: the agent uses chords_history to fetch any past version

---

## 模型路由与配置 / Model routing and configuration

后台修改按代码行数分三档（单次 LLM 调用完成代码 + 解释块）：
Background edits use one LLM call per tier, chosen by code size:

| 档位 Tier | 行数 Lines | 模型 Model | 思考 Reasoning | maxTokens | 超时 Timeout |
|---|---|---|---|---|---|
| 小 Small | ≤200 | 跟随对话模型 follow the session model | off | 8192 | 180s |
| 中 Medium | 201-500 | 强档模型 strong model | off | 16384 | 360s |
| 大 Large | >500 | 强档模型 strong model | high | 131072 | 900s |

全部参数可在 cordis.patch.yml 覆盖：
Every parameter can be overridden in cordis.patch.yml:

```yaml
- insert:
    - id: chords
      name: dsh-chords
      config:
        followSessionModel: true     # 跟随会话默认模型（false 则用下方 provider/model）
        provider: ""                 # 显式覆盖（空 = 跟随）
        model: ""                    # 显式覆盖
        strongModel: ""              # 中大档的强档模型（空 = 查厂商表）
        smallLines: 200
        largeLines: 500
        effortSmall: "off"
        effortLarge: "high"
        maxTokens: 8192
        maxTokensLarge: 16384
        maxTokensHuge: 131072
        timeoutMs: 180000
        timeoutMsLarge: 360000
        timeoutMsHuge: 900000
        ttlDays: 14                  # 文档无更新超过该天数视为过期
        providers:                   # 主流厂商的默认档/强档（模型名按部署实际调整）
          deepseek-official: { default: deepseek-v4-flash, strong: deepseek-v4-pro }
          openai: { default: gpt-4o-mini, strong: gpt-4o }
          anthropic: { default: claude-sonnet-4, strong: claude-opus-4 }
          moonshot: { default: moonshot-v1-8k, strong: moonshot-v1-128k }
          "z-ai": { default: glm-4-flash, strong: glm-4-plus }
          volcengine: { default: doubao-1-5-pro-32k, strong: doubao-1-5-pro-256k }
          xai: { default: grok-3-mini, strong: grok-3 }
          google: { default: gemini-2.0-flash, strong: gemini-2.5-pro }
          minimax: { default: MiniMax-Text-01, strong: MiniMax-M1 }
```

说明：插件只传 provider/model/reasoningEffort，各厂商的线缆参数由 DSH 适配器翻译；
reasoningEffort 目前支持 off / high / max。非 deepseek 厂商需要其适配器已安装。
Note: the plugin passes only provider/model/reasoningEffort; wire parameters are translated by
each provider DSH adapter (reasoningEffort: off / high / max). Non-DeepSeek vendors need their adapters installed.

---

## 数据与隐私 / Data and privacy

- 插件数据（文档、版本历史、改名链、修改摘要）只落在本机：`<DSH_HOME>/storages/code_lens.json`
  All plugin data (docs, version history, rename chains, edit summaries) stays local: <DSH_HOME>/storages/code_lens.json
- 无更新超过 ttlDays（默认 14 天）自动过期；会话销毁即清理该会话全部数据
  Documents idle for ttlDays (default 14) expire; disposing a session wipes its data
- 代码内容本身不离开你配置的模型路由（与普通对话一致）
  Code content never leaves your configured model route (same as ordinary conversations)

---

## 故障排查 / Troubleshooting

| 现象 Symptom | 处理 Fix |
|---|---|
| 修改失败并提示「后台修改失败：…」 | 按提示原因处理；多为模型输出非 JSON（自动重试一次）或超时 |
| Background edit failed: … | Read the reason; usually a non-JSON model reply (one auto retry) or a timeout |
| 「未找到输入桥…」 | 远程通道降级失败；按提示粘贴到输入框即可（对话流程会接管） |
| No input bridge… | The background channel fallback; paste the request into the composer as prompted |
| 重启后数据丢失 | 检查启动日志是否出现 version-mismatch / memory-only；新版会自动弃置旧单元重建 |
| Data lost after restart | Check the boot log for version-mismatch / memory-only; current versions self-heal |
| 卡片渲染异常 | 单卡有独立错误边界，会把错误文字显示在卡片上；把原文反馈给作者 |
| A card renders wrong | Each card has its own error boundary showing the message; report it |

---

## 开发者 / Developers

- 宿主集成契约（远程 API、数据模型、客户端算法）：见 `REMOTE-API.md`
  Host integration contract (remote API, data model, client-side algorithms): see REMOTE-API.md
- 包结构：`dsh-chords/package.json` + `lib/index.js`（宿主半）+ `lib/client.js`（Web 客户端半）
  Bundle layout: dsh-chords/package.json + lib/index.js (host half) + lib/client.js (web client half)
- 迁移安装指南：见 `INSTALL.md`
  Migration install guide: see INSTALL.md
- 测试：`test/` 内含 7 组 vitest 测试（38 个用例，纯函数级，无需启动 Harness、无需真模型）；在插件目录执行 `npm i -D vitest` 后运行 `npm test`
  Tests: test/ ships 7 vitest suites (38 cases, pure-function level; no Harness boot, no live model). Inside the plugin directory run `npm i -D vitest` then `npm test`

---

## 变更历史 / Changelog

- 0.3.3 bug修复
- 0.2.63 渲染微调
- 0.2.62 纯函数测试（38 用例）+ 测试用导出 + npm test 脚本
- 0.2.61 渲染修复
- 0.2.60 自动国际化（中/英）
- 0.2.59 后台修改改为单次合并 LLM 调用
- 0.2.58 三档模型路由
- 0.2.56 并发与存储原子性修复
- 0.2.54 串行注册队列
- 0.2.53 持久化自愈
- 0.2.51 版本历史宿主水合
- 0.2.45 重命名 + 改名链
- 0.2.44 版本导航 ◀ ▶
- 0.2.29 持久化存储域 + TTL + 会话销毁清理
- 0.2.22 后台修改通道
- 0.2.10 忙碌锁与终止
- 0.2.9 会话隔离
- 0.2.3 上下文回流 + chords_current
- 0.2.0 原地编辑
- 0.1.x 双栏卡片、三色确定性、锚点高亮

---

## 证书 / License

MIT © 2026 GinerYard —— 全文见 `LICENSE` / MIT © 2026 GinerYard — see the `LICENSE` file
