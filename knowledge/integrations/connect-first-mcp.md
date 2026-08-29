---
title: '接上你的第一個 MCP:一步一步設定,再親眼確認成功'
description: '手把手用最簡單的『檔案系統 MCP』走一次完整流程:打開設定檔改幾行、重新載入、再確認工具真的出現。也教你最重要的一件事，只開你需要的權限，還有『工具沒出現』時怎麼一步一步查。'
date: 2026-07-25
subcategory: 'mcp'
hermes_version: '>=2026.5'
last_verified: 2026-07-25
human_reviewed: false
upstream_refs:
  - 'https://hermes-agent.nousresearch.com/docs/user-guide/features/mcp'
  - 'https://hermes-agent.nousresearch.com/docs/guides/use-mcp-with-hermes'
tags:
  - 'mcp'
  - 'integrations'
status: 'published'
---

先講一下這篇在做什麼。

MCP 是「Model Context Protocol」的縮寫,你可以把它想成一個**外接工具的插座**:透過它,agent(agent 就是幫你做事的 AI 助理)可以接上外面的工具,例如讀寫你電腦上的檔案、操作 GitHub、查資料庫等等。

第一次設定 MCP,最常卡在同一個地方:**你改完設定,卻發現工具沒出現**,然後你會很困惑，到底是設定打錯了,還是根本沒生效?

這篇就帶你用「檔案系統 MCP」(讓 agent 能讀寫你指定資料夾的工具)完整走一遍。選它是因為它最單純。而且好消息是:只要你把這一個走通,之後接其他 MCP 都是同一套步驟,不用重學。

跟著做就好,不難。

## 第一步:先確認 MCP 功能有裝

如果你是照標準流程安裝的,MCP 功能其實已經內含了[^1],通常不用另外裝。

如果你想確認、或想補裝,打開你的終端機(終端機就是那個可以打指令的黑色視窗),輸入:

```bash
cd ~/.hermes/hermes-agent
uv pip install -e ".[mcp]"
```

第一行 `cd` 是「切換到某個資料夾」的意思,這裡是切到 Hermes 的安裝位置。第二行才是真正在裝 MCP 功能。

**完成判準**:指令跑完後沒有 `error` 或 `failed` 訊息即可。若它提示找不到 `uv`、目錄或套件,先不要繼續下一步，改看 [安裝與更新](/install/) 排除環境問題。

## 兩種接法:先認識一下,等下只用第一種

MCP server(server 就是提供工具的那個小程式)都寫在同一個設定檔裡:`~/.hermes/config.yaml`,放在 `mcp_servers` 這個區塊底下[^2]。

接法分兩種,先有個印象就好:

- **本地(stdio)**:在你自己的電腦上,順手開一個小程式來提供工具。設定時用 `command` 加 `args`(就是「要跑哪個指令」加「給它哪些參數」)。stdio 只是這種本地溝通方式的技術名稱,你不用記。
- **遠端(HTTP)**:連到別人已經架好、放在網路上的服務。設定時用 `url`(就是那個服務的網址)。

你的第一個,我們就用**本地**的,因為它最好懂,而且不用處理網路和帳號。

## 第二步:設定檔案系統 MCP

用你習慣的文字編輯器打開 `~/.hermes/config.yaml` 這個檔案,加上這幾行:

```yaml
mcp_servers:
  project_fs:
    command: 'npx'
    args:
      ['-y', '@modelcontextprotocol/server-filesystem', '/home/user/my-project']
```

小提醒:這是 YAML 格式(一種用「縮排」來表示層次的設定寫法),所以每一層前面的空格數量很重要,照抄就對了,不要用 Tab。

**完成判準**:儲存後重新打開 `~/.hermes/config.yaml`，應能看到完整的 `mcp_servers`、`project_fs`、`command` 與 `args` 四層設定，且沒有被編輯器標成 YAML 語法錯誤。

解釋一下這幾行:

- `project_fs` 是**你自己隨便取的名字**,之後要靠它認出這個工具。
- `command` 跟 `args` 合起來,就是「用 npx 去跑檔案系統 MCP 這個小程式」。
- 最後那個路徑 `/home/user/my-project`,**就是你允許 agent 讀寫的資料夾**[^3]。

⚠️ **這是整篇最重要的一行,請認真看**:不要為了圖方便,把路徑指到你的家目錄根層(像 `/home/user` 或 `~` 這種一整包的最上層)。請指到你**現在正在做的那個具體專案資料夾**就好。

為什麼?因為這個路徑等於一把鑰匙,決定了 agent 能碰到你哪些檔案。開太大,就像把整台電腦的檔案都交出去。開剛剛好,agent 就只能動到這個專案,安全很多。

## 第三步:重新載入,不用重開

改完設定後,你**不需要**把整個 Hermes 關掉重開。直接在對話裡輸入這一行:

```text
/reload-mcp
```

它會重新讀一次 MCP 設定,馬上生效[^2]。就這麼簡單。

**完成判準**:執行後不要出現設定解析錯誤，接著直接做下方任一種驗證；能看到 `mcp_project_fs_` 開頭的工具或通過 `hermes mcp test`，才代表 reload 後的設定真的可用。

## 第四步:確認它真的接上了(別跳過)

這一步很多人會想跳過,結果後面白忙一場。因為大多數「MCP 怎麼沒反應」的困惑,真相其實是:**根本沒接上,只是自己不知道**。花十秒確認一下,省下之後半小時的抓狂。

有兩個方法,挑一個做就行。

**方法一:直接問它**

在對話裡輸入(這句照打,是英文沒關係):

```text
Tell me which MCP-backed tools are available right now
```

**怎麼算成功**:它會列出一串工具,而且是來自你剛剛設定的那個 server。檔案系統 MCP 的工具,名字會長這樣:`mcp_project_fs_read_file`。

看出規律了嗎?命名格式是 `mcp_<server 名>_<工具名>`[^2]。也就是說,只要你看到工具名字前面有 `mcp_project_fs_` 這種前綴(前綴就是名字開頭那一段),就代表**接上了**,成功。

**方法二:直接測連線**

回到終端機,輸入:

```bash
hermes mcp test project_fs
```

`hermes mcp test <server 名>` 會直接去試那個 server 連不連得上[^1],結果一目瞭然。

**完成判準**:測試結果應顯示 `project_fs` 可連線，且命令以成功狀態結束。若顯示連線失敗，先核對設定中的 server 名、`npx` 是否可用，以及最後一個資料夾路徑是否存在。

## 工具沒出現?照這個順序一步步查

第一次設 MCP,「工具沒出現」是最常見的狀況,別緊張,很多人都會遇到。下面這張表把官方列的原因整理好了[^1],對照著看:

| 你看到的狀況     | 多半是這個原因                                                                                                             |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------- |
| 完全沒有任何工具 | 設定裡的 `enabled: false` 忘了拿掉、跑工具需要的環境沒裝好、或驗證用的 header(header 就是連線時附帶的一小段身分資訊)填錯了 |
| 少了某幾個工具   | 被 `include` 白名單濾掉、被 `exclude` 黑名單擋掉、或某類工具整批被關了                                                     |
| 工具比你以為的少 | 每個 server 本來就有自己的過濾規則,這是正常的,不是壞了                                                                     |

查的順序建議這樣:先確認你**真的有跑過** `/reload-mcp`(沒 reload 的話,當前對話讀的還是舊設定);再用 `hermes mcp test` 看連線通不通;最後才回頭懷疑是設定內容寫錯。照這個順序,少走冤枉路。

## 收斂權限:只開你真正需要的工具

檔案系統 MCP 走通之後,接下來你可能會想接 GitHub、資料庫這類更有威力的 MCP。到了這時候,**「只開需要的權限」就變得很重要**了。

你可以指定「只允許某幾個工具」,像這樣:

```yaml
mcp_servers:
  github:
    command: 'npx'
    args: ['-y', '@modelcontextprotocol/server-github']
    env:
      GITHUB_PERSONAL_ACCESS_TOKEN: '***'
    tools:
      include: [list_issues, create_issue, search_code]
```

這裡的 `tools.include` 是一份**白名單**:名單上的這幾個工具才給用,其他一律不給[^2]。這種「只開這幾個」的做法,比「先全部打開、再一個一個去擋」安全多了，因為前者不會漏。

**完成判準**:reload 後重新列出 MCP 工具，應只看到 `include` 列出的工具，沒有列出的工具不應可用。先用最精簡的白名單測通，再依實際需要加項目。

順帶講一個很多人不知道、但設計得很貼心的安全機制:**本地(stdio)的 server,只拿得到你在 `env` 裡明確列出來的那幾個環境變數,它不會偷看你整個 shell 環境**[^2]。

(環境變數就是給程式看的一組設定值,常拿來放密碼、金鑰這種敏感資訊;shell 就是你打指令的那個環境。)

所以重點是:像 API key(存取某個服務用的密碼鑰匙)這種東西,你要在 `env` 裡明確給它,它才拿得到;它不會自己跑去你 shell 裡翻。這對你是好事,不會不小心把一堆密碼都漏給它。

## 遠端 MCP(進階,之後有需要再看)

如果哪天你要連的是別人已經架好、放在網路上的服務,就改用 `url`:

```yaml
mcp_servers:
  internal_api:
    url: 'https://mcp.internal.example.com/mcp'
    headers:
      Authorization: 'Bearer ***'
```

這裡的 `headers` 就是連線時附帶的身分資訊,讓對方知道「是你」而放你進去。

如果那個服務需要用 OAuth 登入(OAuth 就是那種「用你的帳號授權登入、不用直接給密碼」的方式,類似很多網站的『用 Google 帳號登入』),就加上 `auth: oauth`[^2]。像 Linear 就是這一類。

**完成判準**:reload 後，遠端 server 應出現在可用 MCP 工具清單中；若它要求 OAuth，請在對話顯示的授權流程中由你本人完成登入，不要把帳密貼進設定檔。

## 從官方目錄裝(懶人做法)

除了自己一行一行寫設定,你也可以直接用官方整理好的目錄,讓它幫你裝:

```bash
hermes mcp catalog          # 看有哪些
hermes mcp install <名稱>   # 裝一個
```

第一行是「列出目錄裡有哪些可裝的」,第二行是「挑一個裝下去」。

**完成判準**:`hermes mcp catalog` 應列出可安裝項目；安裝後 reload，再用 `hermes mcp test <名稱>` 驗證新 server 可連線。目錄出現名稱不等於已可用，測試通過才算完成。

⚠️ 但有件事一定要知道:安裝的時候,Hermes 會執行 manifest 裡的啟動指令,**還會執行那個 MCP server 本身的程式碼**。

(manifest 就是那個 MCP 附的一份「安裝說明清單」,寫著要跑哪些東西才能把它裝起來。)

官方雖然對目錄裡的每一筆都做過審核,但還是建議你養成一個習慣:**安裝前先把 manifest 讀過一遍**[^2],看清楚它到底要在你電腦上跑什麼。多花一分鐘,安心很多。

## 常見問題

### 我在 WSL2 裡,想控制 Windows 上的瀏覽器,可以嗎?

可以。用 chrome-devtools-mcp 當中間的橋樑,做法看 [WSL2 教學](/install/wsl2/)。(WSL2 是 Windows 裡面跑 Linux 的一套環境。)

### 每次改了 config,一定要跑 /reload-mcp 嗎?

是的,一定要。如果你不 reload,當前這個對話讀到的還是**舊的**設定,你的改動等於沒生效。

### 我怎麼判斷某個 npm 套件,是不是可以信任的 MCP?

一個簡單的參考:名字開頭是 `@modelcontextprotocol/*` 的,是官方做的參考實作,相對可信。

反過來,來路不明的第三方 server,本質上就是**讓一段你不認識的程式碼在你的環境裡跑**,要小心。想更有系統地判斷,看 [推薦 MCP](/integrations/recommended-mcp/) 裡整理的信任層級。

## 下一步

- 有哪些值得接的 MCP → [值得優先接的 MCP Server](/integrations/recommended-mcp/)
- 看官方內建能力 → [技能全目錄](/skills/catalog/)
- 搞懂技能與 MCP 的差別 → [技能系統](/concepts/技能系統/)

[^1]: Nous Research, Use MCP with Hermes:https://hermes-agent.nousresearch.com/docs/guides/use-mcp-with-hermes (2026-07-25 存取)

[^2]: Nous Research, MCP:https://hermes-agent.nousresearch.com/docs/user-guide/features/mcp (2026-07-25 存取)

[^3]: 同上,filesystem MCP 的 args 最後一個參數即為允許存取的目錄路徑
