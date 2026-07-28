---
title: "config.yaml 是什麼：兩個檔案、一條規則、一組指令"
description: "所有教學都在叫你「改 config.yaml」，但沒人告訴你它的全貌。搞懂 config.yaml 與 .env 的分工、優先順序，以及為什麼手改不如用 hermes config。"
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

幾乎每篇教學都會叫你「改 `config.yaml`」——設模型、開記憶審核、加 MCP server。但很少有人先告訴你這個檔案的**全貌**：它在哪、跟 `.env` 怎麼分工、改錯了怎麼救。這篇補上那張地圖。

## 一條你必須先記住的規則

Hermes 的設定拆成**兩個檔案**，分界只有一條[^1]:

| 檔案 | 放什麼 | 例子 |
|---|---|---|
| `~/.hermes/config.yaml` | **所有非機密設定** | 模型、執行後端、記憶上限、壓縮策略 |
| `~/.hermes/.env` | **所有機密** | API key、bot token、密碼 |

⚠️ **密鑰永遠放 `.env`，絕不寫進 `config.yaml`**[^1]。這不只是慣例——`.env` 有不同的處理方式，而且 log 會自動遮蔽其中的秘密。把 API key 貼進 `config.yaml` 等於讓它更容易外洩。

要在 config.yaml 裡引用密鑰，用 `${變數名}` 語法讓它去 `.env` 取，而不是直接寫死：

```yaml
auxiliary:
  vision:
    api_key: ${GOOGLE_API_KEY}   # 值在 .env，這裡只引用
```

## 誰蓋過誰：優先順序

同一個設定在多處出現時，Hermes 從高到低這樣決定[^2]:

1. **CLI 參數**——單次覆蓋，例如 `hermes chat --model anthropic/claude-sonnet-4`
2. **`config.yaml`**——你的主設定檔
3. **`.env`**——環境變數退路(密鑰一定在這)
4. **內建預設值**——你什麼都沒設時的安全預設

意思是：命令列臨時試一個模型，不會動到你 config.yaml 的長期設定；關掉命令列，又回到檔案裡的值。

## 別手改，用 `hermes config`

YAML 對縮排很敏感，手改一個空格就可能整個檔案壞掉。Hermes 內建一組指令，會**自動判斷該寫進哪個檔案**(機密進 `.env`、其他進 `config.yaml`)，還會驗證合法性[^3]:

```bash
hermes config              # 看目前所有設定
hermes config get model    # 查某個 key 解析後的值
hermes config set model anthropic/claude-opus-4
hermes config set terminal.backend docker
hermes config set OPENROUTER_API_KEY sk-or-...   # 自動存到 .env
hermes config unset KEY    # 移除你設過的值(回到預設)
hermes config edit         # 真的要手改時，用它開編輯器
```

**成功判準**:`hermes config get <你剛設的 key>` 印出的值，跟你 set 的一致。設密鑰那行不會回顯完整值，這是正常的(它進了 `.env`)。

升級後想補齊新版新增的選項，用 `hermes config check` 看缺什麼、`hermes config migrate` 互動式補上[^3]。

## 哪個需求，改哪一段

config.yaml 分成很多區塊。你不需要全懂——下面這張表對照「你想做什麼」和「改哪一段」，深入的都有專篇：

| 你想… | 區塊 | 看哪篇 |
|---|---|---|
| 換模型 / 設供應商 | `model` | [模型供應商與 API key](/config/model-provider/) |
| 控制它記得什麼、開寫入審核 | `memory` | [記憶系統](/concepts/記憶系統/) |
| 管技能、開技能寫入審核 | `skills` | [技能系統](/concepts/技能系統/) |
| 接外部工具 | `mcp_servers` | [接上第一個 MCP](/integrations/connect-first-mcp/) |
| 換執行環境(Docker/SSH) | `terminal.backend` | [進階安裝](/install/advanced/) |
| 對話太長被壓縮 / 爆掉 | `compression` | [context length exceeded](/troubleshoot/context-length-exceeded/) |

### 幾個常被問到的 key

- **`terminal.backend`**(預設 `local`)——執行後端，可選 `local` / `docker` / `ssh` / `modal` / `daytona` / `singularity`[^4]。想沙盒隔離就設 `docker`。
- **`memory.write_approval`**(預設 `false`)——設 `true`,agent 每次要寫記憶都先問過你[^4]。
- **`agent.max_turns`**(預設 `500`)——單場對話的最大迭代數[^4]。
- **`compression.threshold`**(預設 `0.50`)——上下文用到這個比例就開始壓縮[^4]。

## `~/.hermes/` 裡還有什麼

config.yaml 只是這個目錄的一員。全貌[^5]:

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

## 常見問題

### 我把 API key 寫進 config.yaml 了，要緊嗎？

把它移到 `.env`(或用 `hermes config set` 重設，它會自動放對地方)，然後把 config.yaml 裡那行刪掉。如果那把 key 曾經進過版本控制或分享出去，當它已外洩、去供應商後台重新產一把。

### config.yaml 和 .env 同一個設定衝突怎麼辦？

非機密設定 `config.yaml` 贏[^1]。但機密本來就只該在 `.env`，不該有衝突。

### 改了設定沒生效？

多數設定下次啟動生效。MCP 設定可在對話中用 `/reload-mcp` 即時重載，見 [接上第一個 MCP](/integrations/connect-first-mcp/)。

### 團隊想統一設定？

管理員可用系統層級的 managed 目錄釘住某些值[^1]，這屬於組織部署範圍，個人使用用不到。

## 下一步

- 先設好能跑起來的最小設定 → [模型供應商與 API key](/config/model-provider/)
- 搞懂記憶那一段在調什麼 → [記憶系統](/concepts/記憶系統/)
- 換到沙盒 / 遠端執行 → [進階安裝](/install/advanced/)

[^1]: Nous Research, Configuration — https://hermes-agent.nousresearch.com/docs/user-guide/configuration(2026-07-27 存取)。兩檔分工：config.yaml 放非機密設定、.env 放 API key 與密鑰；config.yaml 內以 `${VAR}` 引用 .env 變數
[^2]: 同上，優先順序由高到低：CLI 參數 > `~/.hermes/config.yaml` > `~/.hermes/.env` > 內建預設值
[^3]: 同上，`hermes config` 指令家族(get / set / unset / edit / check / migrate)自動判斷寫入 config.yaml 或 .env 並驗證合法性
[^4]: 同上，常見 key 預設值：`terminal.backend`=local(可選 docker/ssh/modal/daytona/singularity)、`memory.write_approval`=false、`agent.max_turns`=500、`compression.threshold`=0.50
[^5]: 同上，`~/.hermes/` 目錄結構(config.yaml / .env / auth.json / SOUL.md / memories / skills / cron / sessions / logs,logs 中密鑰自動遮蔽)；組織部署可由管理員以 managed 目錄釘住設定值
