# dsh-chords 迁移安装指南

版本：0.3.1（与 DeepSeek Harness 0.1.0-rc.6 的 API 对齐）

## 前置条件

- 目标机器已安装 DeepSeek Harness（`dsh` 命令可用，web profile 可启动）
- DSH 版本与 0.1.0-rc.6 相同或 API 兼容（本插件使用了 tools/systemPrompt/llm/storage-domain/typert SRC remote/api-gateway client 等内部接口）
- 目标部署具备模型路由 `deepseek-official`（默认档 `deepseek-v4-flash`、强档 `deepseek-v4-pro`），或安装后自行配置覆盖（见下）；使用其他厂商需其 DSH 适配器已安装

## 安装步骤

1. 复制插件目录到目标机器的 profile 共享 node_modules：

   ```powershell
   # 把本目录里的 dsh-chords 文件夹复制到：
   #   $env:DSH_HOME\profiles\node_modules\dsh-chords
   # 例如（Windows，DSH_HOME 默认 ~/.dsh）：
   Copy-Item -Recurse ./dsh-chords "$env:DSH_HOME\profiles\node_modules\"
   ```

   （也可以在目标机器上执行 `dsh plugin --profile web add <本目录路径>`，走 pnpm 安装。）

2. 在目标机器的 `$env:DSH_HOME\profiles\web\cordis.patch.yml` 中追加插件条目（若文件内容为空数组 `[]`，替换为下面的内容；否则把 insert 段合并进去）：

   ```yaml
   - insert:
       - id: chords
         name: dsh-chords
         # 可选：覆盖后台重生成所用的模型路由（全部键与默认值见 README「模型路由与配置」）
         # config:
         #   followSessionModel: true
         #   provider: ""            # 显式覆盖（空 = 跟随会话模型）
         #   model: ""
         #   strongModel: ""         # 中大档的强档模型（空 = 查厂商表）
         #   smallLines: 200
         #   largeLines: 500
         #   effortSmall: "off"
         #   effortLarge: "high"
         #   maxTokens: 8192
         #   maxTokensLarge: 16384
         #   maxTokensHuge: 131072
         #   timeoutMs: 180000
         #   timeoutMsLarge: 360000
         #   timeoutMsHuge: 900000
         #   ttlDays: 14
         #   providers: {}            # 各厂商 default/strong 模型表
   ```

3. 重启目标机器的 web 服务器：

   ```powershell
   dsh web --port 8080
   ```

4. 刷新浏览器页面，验证：让 agent 生成一段代码，应出现双栏代码卡片。

## 注意事项

- 插件代码内无任何机器相关绝对路径（依赖全部按包名从 DSH 安装解析），迁移后无需改动代码。
- 存储域（文档/历史/改名链）落盘在目标机器的 `$env:DSH_HOME\storages`，随数据自然隔离。
- 客户端依赖均为标准 web 组合自带（api-remotes / client-runtime / client-locale / ui-conversation / ui-tool / ui-primitives / react），无需额外安装。
- 若目标 DSH 版本不同，出现加载失败时优先查看服务器日志中的 loader 报错（通常是接口名变化），按报错微调对应包导入即可。
