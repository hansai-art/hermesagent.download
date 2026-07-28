---
title: "接上你的第一個 MCP：從設定到驗證"
description: "用檔案系統 MCP 走一遍完整流程：改 config.yaml、reload、確認工具真的出現。含最重要的權限收斂與常見「工具沒出現」的排查。"
date: 2026-07-25
subcategory: "mcp"
hermes_version: ">=2026.5"
last_verified: 2026-07-25
human_reviewed: false
upstream_refs:
  - "https://hermes-agent.nousresearch.com/docs/user-guide/features/mcp"
  - "https://hermes-agent.nousresearch.com/docs/guides/use-mcp-with-hermes"
tags:
  - "mcp"
  - "integrations"
status: "published"
---

MCP 讓 agent 接上外部工具，但第一次設定最容易卡在一個地方：**改完 config 卻發現工具沒出現**，然後不知道是設定錯了、還是根本沒生效。

這篇用「檔案系統 MCP」走一遍完整流程——因為它最單純，而且走通一次，其他 MCP 都是同一套路。

## 先確認 MCP 支援有裝

標準安裝已經內含 MCP[^1]。如果你要確認或補裝：

```bash
cd ~/.hermes/hermes-agent
uv pip install -e ".[mcp]"
```

## 兩種接法：本地 vs 遠端

MCP server 都設定在 `~/.hermes/config.yaml` 的 `mcp_servers` 底下[^2]，分兩種：

- **本地(stdio)**：在你的機器上跑一個子程序，用 `command` + `args` 啟動
- **遠端(HTTP)**：連到一個已經架好的服務，用 `url`

第一個先用本地的，最好懂。

## 設定檔案系統 MCP

編輯 `~/.hermes/config.yaml`，加上：

```yaml
mcp_servers:
  project_fs:
    command: "npx"
    args: ["-y", "@modelcontextprotocol/server-filesystem", "/home/user/my-project"]
```

`project_fs` 是你自己取的名字。最後那個路徑**就是你允許 agent 讀寫的目錄**[^3]——

⚠️ **這是整篇最重要的一行**：不要圖方便指到家目錄根層(`/home/user` 或 `~`)。指到你正在做的**具體專案資料夾**就好。這個路徑決定了 agent 能碰到你哪些檔案，開太大等於把整台電腦的檔案交出去。

## 重新載入，不用重啟

改完設定，在對話中直接：

```text
/reload-mcp
```

這會重新載入 MCP 設定，不必重啟整個 Hermes[^2]。

## 確認它真的接上了

這一步別跳過——多數「MCP 沒反應」的困惑，其實是根本沒接上而不自知。

**方法一：問它**

```text
Tell me which MCP-backed tools are available right now
```

**成功判準**：它會列出來自你剛設定的 server 的工具。檔案系統 MCP 的工具會長成 `mcp_project_fs_read_file` 這種樣子——命名規則是 `mcp_<server 名>_<工具名>`[^2]。看得到這種前綴的工具，就是接上了。

**方法二：測連線**

```bash
hermes mcp test project_fs
```

`hermes mcp test <server 名>` 直接測那個 server 連得上連不上[^1]。

## 工具沒出現？照這個順序查

這是第一次設 MCP 最常見的狀況。官方列的原因對照[^1]:

| 症狀 | 多半是 |
|---|---|
| 完全沒有工具 | `enabled: false` 沒拿掉、執行環境缺、或驗證 header 錯 |
| 少了某幾個工具 | 被 `include` 濾掉、被 `exclude` 擋掉，或工具類別被關 |
| 工具比預期少 | 每個 server 有自己的政策過濾，這是正常行為 |

先確認 `/reload-mcp` 有跑過，再用 `hermes mcp test` 看連線，最後才懷疑設定內容。

## 收斂權限：只開需要的工具

檔案系統 MCP 走通後，接 GitHub、資料庫這類 MCP 時，**權限收斂就變得重要**。你可以只允許特定工具：

```yaml
mcp_servers:
  github:
    command: "npx"
    args: ["-y", "@modelcontextprotocol/server-github"]
    env:
      GITHUB_PERSONAL_ACCESS_TOKEN: "***"
    tools:
      include: [list_issues, create_issue, search_code]
```

`tools.include` 是白名單——只開這幾個，其他一律不給[^2]。這比開放全部再逐一擋安全。

一個容易忽略的安全設計：**stdio server 只拿得到你在 `env` 明確列出的環境變數，不會繼承你整個 shell 環境**[^2]。所以 API key 要在 `env` 裡明確給，它不會自己去讀你 shell 裡的。

## 遠端 MCP(進階)

連已經架好的服務，用 `url`:

```yaml
mcp_servers:
  internal_api:
    url: "https://mcp.internal.example.com/mcp"
    headers:
      Authorization: "Bearer ***"
```

需要 OAuth 的服務(如 Linear)用 `auth: oauth`[^2]。

## 從官方目錄裝

除了手動設定，也可以用官方目錄：

```bash
hermes mcp catalog          # 看有哪些
hermes mcp install <名稱>   # 裝一個
```

⚠️ 但要知道：安裝時 Hermes 會執行 manifest 的 bootstrap 指令**以及 MCP server 本身的程式碼**。官方雖然對目錄裡的每一筆做過 PR 審核，但仍建議你**安裝前先讀過 manifest**[^2]。

## 常見問題

### WSL2 裡要控制 Windows 的瀏覽器？

用 chrome-devtools-mcp 當 bridge，見 [WSL2 教學](/install/wsl2/)。

### 改了 config 一定要 /reload-mcp 嗎？

是。不 reload，當前對話讀的還是舊設定。

### 我怎麼知道某個 npm 套件是不是可信的 MCP?

`@modelcontextprotocol/*` 是官方參考實作，相對可信。來路不明的第三方 server 等於讓陌生程式碼在你環境裡跑——參考 [推薦 MCP](/integrations/recommended-mcp/) 的信任層級。

## 下一步

- 有哪些值得接的 MCP → [值得優先接的 MCP Server](/integrations/recommended-mcp/)
- 看官方內建能力 → [技能全目錄](/skills/catalog/)
- 搞懂技能與 MCP 的差別 → [技能系統](/concepts/技能系統/)

[^1]: Nous Research, Use MCP with Hermes — https://hermes-agent.nousresearch.com/docs/guides/use-mcp-with-hermes(2026-07-25 存取)
[^2]: Nous Research, MCP — https://hermes-agent.nousresearch.com/docs/user-guide/features/mcp(2026-07-25 存取)
[^3]: 同上，filesystem MCP 的 args 最後一個參數即為允許存取的目錄路徑
