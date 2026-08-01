---
title: "config.yaml 是什麼:一次看懂兩個設定檔和一組好用指令"
description: "每篇教學都叫你「去改 config.yaml」,卻沒人告訴你這個檔案長怎樣、在哪裡、改壞了怎麼救。這篇從零開始講清楚:config.yaml 和 .env 各放什麼、誰說了算,以及為什麼用指令改比手動改安全。"
date: 2026-07-27
subcategory: "reference"
hermes_version: ">=2026.5"
last_verified: 2026-07-27
human_reviewed: false
upstream_refs:
  - "https://hermes-agent.nousresearch.com/docs/user-guide/configuration"
tags:
  - "config"
  - "reference"
status: "published"
---

先說一件事:`config.yaml` 就是 Hermes 的「設定檔」。它是一個純文字檔,裡面記著你的各種偏好,例如要用哪個 AI 模型、要不要開某個功能。幾乎每篇教學都會叫你「去改 `config.yaml`」:設模型、開記憶審核、加工具。

但很少有人先帶你看這個檔案的**全貌**:它到底在哪、跟另一個叫 `.env` 的檔案怎麼分工、改錯了怎麼救回來。這篇就是那張地圖。別緊張,我會一步一步帶你走。

## 先記住一條規則:設定分成兩個檔案

Hermes 把設定拆成**兩個檔案**,分界只有一條[^1]:

| 檔案 | 放什麼 | 例子 |
|---|---|---|
| `~/.hermes/config.yaml` | **所有「不是機密」的設定** | 模型、在哪裡執行、記憶上限、壓縮策略 |
| `~/.hermes/.env` | **所有「機密」** | API key、bot token、密碼 |

補充幾個名詞,第一次看到很正常:

- `~/.hermes/` 就是你電腦裡一個放 Hermes 設定的資料夾。`~` 是「你的家目錄」的簡寫(Mac/Linux 大概是 `/Users/你的名字`,或你登入後的個人資料夾)。
- **API key**:一串很長的密碼,用來證明「這個 AI 服務是我付費在用的」。誰拿到它就能用你的帳號花錢,所以要保密。
- **bot token**:類似 API key,是聊天平台(例如 Telegram)發給你的機器人的通行證。
- **機密(secret)**:泛指上面這些「不能給別人看」的東西。

⚠️ **密碼類的東西永遠放 `.env`,絕對不要寫進 `config.yaml`**[^1]。這不只是習慣問題:`.env` 有特別的保護方式,而且系統的紀錄檔(log,就是程式自動寫下的執行日誌)會自動把裡面的秘密塗黑。把 API key 貼進 `config.yaml`,等於讓它更容易不小心外流。

那如果 `config.yaml` 裡真的需要用到某個密碼怎麼辦?不要直接把密碼打進去,而是用 `${變數名}` 這種寫法,叫它去 `.env` 裡拿:

```yaml
auxiliary:
  vision:
    api_key: ${GOOGLE_API_KEY}   # 值在 .env,這裡只引用
```

你可以把 `${GOOGLE_API_KEY}` 想成一張便利貼,上面寫著「真正的密碼在 .env 那個叫 GOOGLE_API_KEY 的格子裡」。這樣 `config.yaml` 就算被別人看到,也看不到真正的密碼。

## 同一個設定寫在好幾個地方,聽誰的?

有時候同一個設定會出現在好幾個地方。這時 Hermes 有一個固定的先後順序,從「最優先」到「最不優先」是這樣[^2]:

1. **CLI 參數**:你在命令列臨時打的那次設定,只對這一次有效。例如 `hermes chat --model anthropic/claude-sonnet-4`。(CLI 就是「命令列」,也就是你打指令的那個黑底文字視窗;命令列參數就是你打指令時,後面加上去的那些選項。)
2. **`config.yaml`**:你的主要設定檔,長期有效。
3. **`.env`**:環境變數,當退路用(密碼一定放這)。(環境變數就是「存在系統裡、給程式讀的一組名稱=值」,像一本共用的小抄。)
4. **內建預設值**:你什麼都沒設時,Hermes 自己準備好的安全值。

白話版:你在命令列臨時試一個模型,不會動到 `config.yaml` 裡的長期設定;關掉命令列那次的設定,又會回到檔案裡原本的值。就像「臨時借一頂帽子戴一下」不會改變你衣櫃裡的衣服。

## 別自己手動改,用 `hermes config` 指令

`config.yaml` 用的格式叫 YAML。YAML 對「縮排」(每行前面空幾格)非常敏感,你手動改的時候多打或少打一個空格,可能整個檔案就壞掉、Hermes 讀不懂了。

好消息是,Hermes 內建一組指令,幫你做這件事。它會**自動判斷該寫進哪個檔案**(是密碼就存進 `.env`、其他就存進 `config.yaml`),還會順手檢查你填的東西合不合法[^3]:

```bash
hermes config              # 看目前所有設定
hermes config get model    # 查某個 key 解析後的值
hermes config set model anthropic/claude-opus-4
hermes config set terminal.backend docker
hermes config set OPENROUTER_API_KEY sk-or-...   # 自動存到 .env
hermes config unset KEY    # 移除你設過的值(回到預設)
hermes config edit         # 真的要手改時,用它開編輯器
```

這裡的 **key**(鍵)就是「設定項目的名字」,例如 `model`(模型)。`get` 是查、`set` 是設、`unset` 是取消。

**怎麼確認成功了**:設定完之後,打 `hermes config get <你剛設的 key>`,如果印出來的值跟你剛剛設的一樣,就成功了。唯一的例外:設密碼那一行,它不會把完整的值印出來給你看,只會顯示一部分或遮起來，這是**正常的**,因為它被安全地放進 `.env` 了。

如果你之後升級了 Hermes,想補上新版本新增的設定選項,可以用 `hermes config check` 看看少了什麼、再用 `hermes config migrate` 一步一步帶你補上[^3]。

## 我想做某件事,該改哪一段?

`config.yaml` 裡面分成很多區塊(section),每個區塊管一類事情。你**不需要**全部搞懂。下面這張表對照「你想做什麼」和「去改哪一段」,每一項都有專門的一篇可以深入看:

| 你想… | 改哪個區塊 | 看哪篇 |
|---|---|---|
| 換模型 / 設定 AI 供應商 | `model` | [模型供應商與 API key](/config/model-provider/) |
| 控制它記得什麼、開啟「寫入前先問過你」 | `memory` | [記憶系統](/concepts/記憶系統/) |
| 管理技能、開啟技能寫入審核 | `skills` | [技能系統](/concepts/技能系統/) |
| 接上外部工具 | `mcp_servers` | [接上第一個 MCP](/integrations/connect-first-mcp/) |
| 換執行環境(Docker/SSH) | `terminal.backend` | [進階安裝](/install/advanced/) |
| 對話太長被壓縮 / 爆掉 | `compression` | [context length exceeded](/troubleshoot/context-length-exceeded/) |

### 幾個常被問到的設定項

- **`terminal.backend`**(預設是 `local`):決定 Hermes 在「哪裡」執行動作。可以選 `local` / `docker` / `ssh` / `modal` / `daytona` / `singularity`[^4]。想把它關在一個獨立小房間裡跑、比較安全,就設 `docker`(一種把程式隔離起來執行的技術)。
- **`memory.write_approval`**(預設 `false`,也就是關閉):設成 `true` 之後,agent 每次要把東西寫進記憶,都會先問過你才寫[^4]。
- **`agent.max_turns`**(預設 `500`):一場對話裡,agent 最多可以來回動作幾次的上限[^4]。
- **`compression.threshold`**(預設 `0.50`):對話內容用到這個比例(這裡是一半)時,就開始壓縮、幫你節省空間[^4]。

## `~/.hermes/` 資料夾裡還有什麼

`config.yaml` 只是這個資料夾裡的其中一個檔案而已。這是它的全貌[^5]:

```text
~/.hermes/
├── config.yaml     # 非機密設定(這篇的主角)
├── .env            # API key 與密鑰
├── auth.json       # OAuth 憑證
├── SOUL.md         # agent 的身分設定
├── memories/       # MEMORY.md、USER.md
├── skills/         # agent 長出來的技能
├── cron/           # 排程任務
├── sessions/       # gateway 對話
└── logs/           # errors.log、gateway.log(密鑰自動遮蔽)
```

(小名詞:**OAuth 憑證**是一種登入通行證,讓 Hermes 不用每次都重打帳號密碼就能連到某些服務;**gateway** 是「閘道」,就是讓你的 bot 收發訊息的那一層。)

## 常見問題

### 我不小心把 API key 寫進 config.yaml 了,要緊嗎?

先把它搬到 `.env`(或直接用 `hermes config set` 重新設一次,它會自動放到對的地方),然後把 `config.yaml` 裡那一行刪掉。

還有一個重點:如果那把 key 曾經被存進版本控制(例如 git)或分享給別人看過,就當它已經外流了，去那個 AI 服務的後台,把舊的作廢、重新產生一把新的。這樣比較安心。

### config.yaml 和 .env 同一個設定衝突,聽誰的?

如果是「非機密」的設定,`config.yaml` 說了算[^1]。但機密本來就只該放在 `.env`,照理說不會發生衝突。

### 我改了設定,可是好像沒生效?

大部分設定要**下次啟動**才會生效,所以重開一次通常就好了。如果你改的是 MCP(外部工具)相關設定,可以在對話中直接打 `/reload-mcp` 立刻重新載入,細節見 [接上第一個 MCP](/integrations/connect-first-mcp/)。

### 團隊想讓大家用同一套設定?

管理員可以用系統層級的 managed(受管理)資料夾,把某些值固定住、不讓個人改[^1]。這是給組織部署用的,你個人自己用的話用不到,不用擔心。

## 下一步

- 先把「能跑起來的最小設定」設好 → [模型供應商與 API key](/config/model-provider/)
- 搞懂記憶那一段在調什麼 → [記憶系統](/concepts/記憶系統/)
- 換到獨立小房間 / 遠端執行 → [進階安裝](/install/advanced/)

[^1]: Nous Research, Configuration:https://hermes-agent.nousresearch.com/docs/user-guide/configuration (2026-07-27 存取)。兩檔分工:config.yaml 放非機密設定、.env 放 API key 與密鑰;config.yaml 內以 `${VAR}` 引用 .env 變數
[^2]: 同上,優先順序由高到低:CLI 參數 > `~/.hermes/config.yaml` > `~/.hermes/.env` > 內建預設值
[^3]: 同上,`hermes config` 指令家族(get / set / unset / edit / check / migrate)自動判斷寫入 config.yaml 或 .env 並驗證合法性
[^4]: 同上,常見 key 預設值:`terminal.backend`=local(可選 docker/ssh/modal/daytona/singularity)、`memory.write_approval`=false、`agent.max_turns`=500、`compression.threshold`=0.50
[^5]: 同上,`~/.hermes/` 目錄結構(config.yaml / .env / auth.json / SOUL.md / memories / skills / cron / sessions / logs,logs 中密鑰自動遮蔽);組織部署可由管理員以 managed 目錄釘住設定值