# dsh-chords 宿主集成契约（REMOTE-API）

版本：0.3.1（API 契约自 0.2.59 起未变；服务键随产品改名 codeLens → chords）| 面向：任何想要对接本插件的客户端（Web / TUI / 桌面端）

本插件分两半：宿主半（工具 + 持久化 + 远程 API）与客户端半（Web 卡片 UI）。
宿主半是跨客户端的集成契约——任何客户端只要实现本文档列出的调用与本地算法，
即可获得与 Web 版一致的功能。

---

## 一、远程 API

Typert 命名空间：chords（服务键同为 chords）。客户端通过 DSH 的 Typert
远程机制挂载贡献（descriptor 见第五节），随后获得四个方法。

### 通用返回信封

所有远程方法经 DSH 网关返回：

```json
{ "ok": true, "value": { ...业务结果... } }
```

或失败：

```json
{ "ok": false, "error": { "code": "internal", "message": "chords: ...", "details": {} } }
```

### 1. chords/regenerate(request, signal?) —— 后台修改（核心）

请求（positional 第一参数）：

```json
{
  "title": "接雨水",
  "language": "python",
  "code": "def ...\n",
  "blocks": [ {块对象}, ... ],
  "sessionId": "session-xxxx",

  "blockId": "b2",
  "oldPseudocode": "...",
  "newPseudocode": "...",

  "instruction": "改成动态规划"
}
```

块级模式：blockId + oldPseudocode + newPseudocode 三项齐全；整体模式：instruction。

成功返回：

```json
{
  "code": "新代码",
  "blocks": [ {块对象}, ... ],
  "summary": "一句改动摘要",
  "version": 3,
  "persisted": true,
  "anchors": 3,
  "anchorsMatched": 3
}
```

语义：输入当前完整代码 + 原块 + 修改意图，宿主内部用一次 LLM 调用生成
新代码 + 新块（单次合并，无二次输入）。结果已持久化并追加为最新版本。

取消：第二参数传 AbortSignal；中止后调用以错误结束（客户端应识别为
用户主动取消，不触发降级）。

### 2. chords/rename(request) —— 重命名卡片标题

```json
{ "sessionId": "session-xxxx", "title": "接雨水", "newTitle": "接雨水 v2" }
```

成功返回 { "ok": true, "title": "接雨水 v2", "version": 3 }。

错误：
- chords: a document titled X already exists（新名已被占用）
- chords: renaming to this title would create a cycle（会成环）
- chords: no document titled X

### 3. chords/resolveTitle(request) —— 标题沿改名链归一

```json
{ "sessionId": "session-xxxx", "title": "接雨水" }
```

返回 { "title": "接雨水 v2" }（未改名则原样返回）。客户端在注册卡片前用它
把冻结参数里的旧标题解析成现名，保证同文档的所有卡片落在同一个键上。

### 4. chords/history(request) —— 拉取完整版本链

```json
{ "sessionId": "session-xxxx", "title": "接雨水" }
```

返回：

```json
{
  "found": true,
  "title": "接雨水 v2",
  "currentVersion": 4,
  "entries": [
    { "version": 1, "code": "...", "blocks": [...], "summary": "",  "updatedAt": 1755000000000 },
    { "version": 2, "code": "...", "blocks": [...], "summary": "...", "updatedAt": 1755001000000 },
    { "version": 3, "code": "...", "blocks": [...], "summary": "...", "updatedAt": 1755002000000 },
    { "version": 4, "code": "...", "blocks": [...], "summary": "...", "updatedAt": 1755003000000 }
  ]
}
```

entries 含当前版，按版本号升序。客户端挂载后应拉取一次用于水合本地历史浏览。

---

## 二、模型可见工具（agent 自动获得，无需客户端实现）

宿主注册的四个工具对任何 agent 预设可见：

| 工具 | 参数 | 返回 |
|---|---|---|
| chords | code*, language?, title?, blocks* | {ok, blocks, anchors, anchorsMatched, byCertainty, sessionId} |
| chords_current | title* | {found, version, language, code, blocks} |
| chords_list | 无 | {docs: [{title, version}]} |
| chords_history | title*, version? | 无 version：{found, currentVersion, entries}；有 version：该版完整内容 |

### 块对象（block）结构

```json
{
  "id": "b1",
  "anchor": "def trap(heights):",
  "lines": "1-4",
  "pseudocode": "定义接雨水函数……",
  "certainty": "explicit",
  "complexity": { "time": "O(n)", "space": "O(n)" },
  "rationale": "……"
}
```

- certainty：explicit（用户明确要求）/ inferred（从上下文推导）/ default（惯例默认）
- anchor：该块首 1-3 行的逐字摘录，客户端用它计算精确高亮范围
- lines：兜底行范围（锚点定位失败时用）

### 会话身份标记（客户端必读）

chords 工具的渲染文本以机器标记开头：

```text
[chords:session=session-8c0be167-...] chords: 6 chunk(s); ...
```

客户端从工具结算内容中提取（正则 [chords:session=([A-Za-z0-9-]+)]；为兼容改名前的历史消息，还应接受 [code-lens:session=…] 旧形式），
作为该卡片的会话身份。不要依赖 UI 的当前会话状态（存在切换竞态）。

---

## 三、客户端本地算法（任何客户端需自行实现的等价逻辑）

### 1. 文档键与版本合并

- 文档键 = sessionId + NULL + title（sessionId 来自上面的标记，NULL 为 U+0000 分隔符）
- 首次注册：建文档 v1；同键的后续调用：版本 +1，渲染为更新细条（合并进原卡片，不新建卡片）
- 注册一次性：每个工具调用 id（callId）只注册一次；重挂载（切聊天/刷新）必须返回首次注册的结果，不得新建或自增
- 后台修改（regenerate 成功）后本地文档替换为返回内容，版本取返回值 version

### 2. 锚点定位算法（决定高亮/行号）

```text
anchorLineIndex(code, anchor, fromLine):
  1. 在 code 中先做整段精确子串匹配（从 fromLine 对应偏移之后找）；命中则返回其起始行（0 基）
  2. 未命中：逐行 trim 后比对 anchor 的每一行（从 fromLine 起扫描）；命中返回起始行
  3. 都未命中：回退用块上的 lines 字段
块范围：起始行 = 锚点定位行；结束行 = 下一块锚点起始行 - 1（末块到代码末尾）。
```

### 3. 历史浏览

- 本地浏览数据应水合自 chords/history（宿主是权威），刷新/重开后仍完整
- 展示语义：左右箭头切换版本；从任意历史版本发起的修改都追加为最新版本（追加式，不分支、不回滚破坏历史）

### 4. 后台修改流

```text
用户编辑 → 构造 regenerate 请求（当前代码 + 块 + 意图）→ 调用远程 →
成功：本地文档原地替换 + 状态显示 summary/版本；失败：错误信息展示给用户
可选降级（Web 版实现）：远程不可用时把修改意图以
  【代码卡片修改】/【代码卡片重设计】 消息发进对话（agent 指引会处理）
```

### 5. 并发与取消

- 一次只允许一个在途修改（发起卡片上锁）；AbortSignal 取消在途调用
- 修改在途时禁止重命名（提交修改与重命名互斥）

---

## 四、宿主数据模型（持久化，客户端无需直接访问）

存储域单元 code_lens（json 后端，<DSH_HOME>/storages/code_lens.json）：

| 表 | 键 | 值 | 上限 |
|---|---|---|---|
| docs | sessionId\u0000title | 最新文档（code/blocks/version/summary/updatedAt） | — |
| history | 同上 | {entries: [...]} 历史版本（含代码），升序 | 每文档 20 条 |
| renames | sessionId\u0000oldTitle | {newTitle, updatedAt} 改名链 | — |
| logs | sessionId | {entries: [{title, version, summary}]} 修改摘要 | 每会话 10 条 |

- 文档超过 ttlDays（默认 14 天）无更新视为过期，查询时跳过并惰性删除
- 会话销毁时四张表该会话的所有行被清理
- 单元版本不匹配时宿主自动弃置旧单元重建（客户端无感知）

---

## 五、Web 客户端的 Typert 挂载参考（其他客户端可对照）

```js
// 客户端远程贡献描述符（descriptor 形状），namespace 固定为 chords：
{
  package: "dsh-chords",
  descriptors: [
    { id: "dsh-chords#chords/regenerate", service: "chords", namespace: "chords",
      method: "regenerate", invocation: { kind: "direct" },
      cancellation: { parameter: "signal" },
      parameters: [{ name: "request", wire: "request", source: "json",
        codec: { mode: "strict", typeSymbol: "dsh-chords/types#RegenerateRequest",
                 schema: { parse: (v) => v } } }],
      result: { mode: "strict", typeSymbol: "dsh-chords/types#RegenerateResult",
                schema: { parse: (v) => v } } },
    { ...rename / resolveTitle / history 同构描述符... }
  ]
}
// 挂载后：const svc = ctx.get("remote.chords");
// 调用：svc.regenerate(request, abortSignal) → {ok, value|error}
```

宿主侧通过 SRC 声明路径暴露方法（bindTypertRemote + 方法标记），
客户端无需了解其实现。

---

## 六、变更记录（契约相关）

- v0.3.0：产品更名为 chords（服务键、工具名、会话标记全量替换；旧标记保留兼容解析）
- v0.2.59：regenerate 改为单次合并调用（输入契约不变；性能语义变化）
- v0.2.58：三档模型策略（smallLines 200 / largeLines 500）
- v0.2.51：新增 chords/history 远程方法
- v0.2.45：新增 chords/rename 与 chords/resolveTitle
