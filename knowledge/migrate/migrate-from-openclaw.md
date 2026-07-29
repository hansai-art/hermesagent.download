---
title: "從 OpenClaw 搬到 Hermes Agent"
description: "官方內建 hermes claw migrate，記憶、SOUL.md、skills 都能搬。機密預設不搬，套用前預設會先打一份還原點。先 dry-run 看清楚會動到什麼，但 gateway 開著時 dry-run 會被擋下來。"
date: 2026-07-23
subcategory: "openclaw"
hermes_version: ">=2026.5"
last_verified: 2026-07-29
human_reviewed: false
upstream_refs:
  - "https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/migration/openclaw-migration/SKILL.md"
  - "https://hermes-agent.nousresearch.com/docs/reference/faq"
tags:
  - "openclaw"
  - "migrate"
status: "published"
---

換工具最怕的不是學新介面，是**累積的東西搬不過來**——你調教了幾個月的 SOUL.md、agent 對你的記憶、自己寫的 skills。

好消息：Hermes 內建了官方的 OpenClaw 遷移指令，這些東西大部分能直接搬[^1]。

這篇只講「怎麼搬」。還在決定要不要搬的話，先看[Hermes Agent 跟 OpenClaw 差在哪](/concepts/龍蝦殺手/)：兩邊都有的功能不構成搬家理由，而且遷移是複製不是移動，搬完舊環境還在。

## 先看它打算搬什麼(不要跳過這步)

```bash
hermes claw migrate --dry-run
```

`--dry-run` **只報告、不動手**[^1]。開頭會先印一段設定摘要，本站在 macOS 上實測（v0.17.0）長這樣[^2]：

```text
◆ Migration Settings
  Source:      /Users/你的帳號/.openclaw
  Target:      /Users/你的帳號/.hermes
  Preset:      full
  Overwrite:   no (skip conflicts)
  Secrets:     no
```

這五行本身就是最重要的資訊：**預設 preset 是 `full`，但 Secrets 仍然是 `no`**。等一下的機密段會解釋為什麼這兩件事不衝突。

**為什麼一定要先跑**：遷移會動到你的 Hermes 設定。先看清楚清單，等一下結果不如預期時你才知道問題出在哪。

### 陷阱：gateway 開著時 dry-run 會被擋下來

如果你的 Hermes gateway 正在跑，而且有活躍連線，`--dry-run` 不會直接印出清單，會先跳出這段然後停住[^2]：

```text
✗ Hermes gateway is running with active connections: telegram
  Migrating bot tokens while the gateway is active will cause conflicts
  (Telegram, Discord, and Slack only allow one active session per token).
  Recommendation: stop the gateway first with 'hermes gateway stop'.

Continue anyway? [y/N]:
  Migration cancelled. Stop the gateway and try again.
```

兩件事要注意。第一，這個檢查連 `--dry-run` 都擋，即使 dry-run 根本不會動到任何 token。第二，**它的離開代碼是 0**，跟 `hermes doctor`、`hermes security audit` 同一個毛病（見 [hermes doctor 實際跑起來長什麼樣](/troubleshoot/hermes-doctor/)）：腳本裡看 exit code 會以為預覽成功跑完，實際上一行清單都沒印。要在自動化裡用，判斷輸出內容，不要判斷離開代碼。

照建議先 `hermes gateway stop`，或在提示處回 `y` 繼續預覽（dry-run 不會寫入）。

> 📝 **這一段還缺後半**:gateway 停掉之後，完整的遷移清單（可以搬 / 搬不動 / 會被封存）怎麼呈現，我們還沒有實機畫面。
> [幫我們補上](https://github.com/hansai-art/hermesagent.download/edit/main/knowledge/migrate/migrate-from-openclaw.md)。

## 執行遷移

```bash
hermes claw migrate
```

互動式流程。官方會搬這些[^1]:

| 項目 | 搬到哪 |
|---|---|
| `SOUL.md`、`MEMORY.md`、`USER.md` | 轉換成 Hermes 的記憶系統 |
| command allowlist | Hermes 對應設定 |
| `TELEGRAM_ALLOWED_USERS` 等相容的訊息設定 | Hermes 對應設定 |
| OpenClaw skills | `~/.hermes/skills/openclaw-imports/` |

**成功判準**：跑完後啟動 `hermes`，問它一件只有舊環境才知道的事(例如你的專案慣例、你之前告訴過它的偏好)。答得出來，記憶就是搬成功了。

## 機密資訊要不要一起搬

**兩種 preset 都不會搬機密**，不需要為了避開機密去選 preset。CLI 說明的原文是「Neither preset imports secrets」（兩種 preset 都不匯入機密），而且 `--migrate-secrets`「Required even under `--preset full`」（即使用 full 也還是要另外加）[^2]。上面 dry-run 摘要裡 `Preset: full` 配 `Secrets: no`，就是這個意思。

所以 preset 的差別不在機密，而在**要不要一併帶走 secret 相關的設定項**：`user-data` 涵蓋 soul、workspace-agents、memory、user-profile、messaging-settings、command-allowlist、skills、tts-assets 與封存；`full` 是 user-data 再加上 secret-settings[^1]。預設是 `full`[^2]。

```bash
hermes claw migrate --preset user-data   # 連 secret 相關設定項都不要
```

真的要搬機密，得明確加旗標：

```bash
hermes claw migrate --migrate-secrets
```

**這裡有一個來源不一致，請以你自己機器上的 dry-run 為準。** 官方 SKILL.md 寫的是「a small allowlisted set of Hermes-compatible secrets, currently: `TELEGRAM_BOT_TOKEN`」（一小組相容機密的允許清單，目前是 TELEGRAM_BOT_TOKEN）[^1]；但安裝在本機的 v0.17.0，`--help` 寫的是「Include allowlisted secrets (TELEGRAM_BOT_TOKEN, API keys, etc.)」（包含允許清單內的機密：TELEGRAM_BOT_TOKEN、API key 等）[^2]。兩者差在「只有 Telegram token」還是「API key 也算」。

在確認之前，**按照範圍比較大的那個假設處理**：加了 `--migrate-secrets` 就當作 API key 也可能被複製過去。低估被複製的範圍，比高估危險。要確認你這台實際會搬什麼，跑 `--dry-run` 看 `Secrets:` 那一行與清單內容。

這個設計本身是刻意的：機密跨工具複製是風險行為，官方選擇讓你明確表態。

## 出事了可以還原

套用之前，Hermes **預設會先把 `~/.hermes/` 打包成一份還原點**，放進 `~/.hermes/backups/`，之後可以用 `hermes import` 還原[^2]。這是預設行為，不用自己加參數。

想跳過這個備份（不建議）：

```bash
hermes claw migrate --no-backup
```

知道有還原點這件事，比任何「搬過去很安全」的保證都實用：搬壞了有路可退。

## 其他常用參數

技能同名時怎麼處理，預設是跳過[^2]：

```bash
hermes claw migrate --skill-conflict rename   # skip(預設) / overwrite / rename
```

覆蓋既有檔案：

```bash
hermes claw migrate --overwrite
```

這個旗標的說明兩處寫法不同：`--help` 說不加時「refuse to apply when the plan has conflicts」（計畫有衝突就拒絕套用），dry-run 摘要則印 `Overwrite: no (skip conflicts)`（跳過衝突項）[^2]。有衝突時到底是整批停下還是逐項跳過，跑一次 `--dry-run` 看你這台的清單最準。

OpenClaw 不在預設位置(預設會找 `~/.openclaw`):

```bash
hermes claw migrate --source /custom/path/.openclaw
```

把 workspace 指示檔複製到指定路徑：

```bash
hermes claw migrate --workspace-target /absolute/path
```

## 搬完之後要做的三件事

1. **重新設定 API key**——除了 Telegram token，其他機密不會跟著搬。見 [模型供應商與 API key 設定](/config/model-provider/)
2. **檢查 skills 有沒有正常運作**——OpenClaw skills 被放進 `~/.hermes/skills/openclaw-imports/`，格式相容不代表行為完全一致
3. **有接 Telegram 的話**，確認允許名單有搬過來，見 [Telegram 常見坑](/troubleshoot/telegram/)

## 常見問題

### 第一次裝 Hermes 需要手動跑嗎？

安裝時若偵測到 OpenClaw 環境，安裝流程通常會提示遷移，不一定要手動執行。

### 搬完 OpenClaw 還能用嗎？

可以。遷移是複製不是移動，`~/.openclaw` 不會被刪掉。建議先留著，確認 Hermes 一切正常再處理。

確認沒問題之後，官方有一支專門收尾的指令，用途是把散落的 OpenClaw 目錄封存起來，避免狀態分散在兩處[^2]：

```bash
hermes claw cleanup --dry-run   # 先看它打算封存哪些目錄
hermes claw cleanup             # 確認後才真的封存
```

注意它是**封存不是刪除**，同樣支援 `--source` 指定路徑。

### 記憶搬過來會不會格式跑掉？

官方遷移指令會做格式轉換[^1]。但兩個系統的記憶模型不同，轉換後的呈現方式可能有差異。

> 📝 **待補實際經驗**：轉換後記憶的完整度如何、有沒有明顯遺漏，只有真的搬過的人才知道。
> [歡迎補上](https://github.com/hansai-art/hermesagent.download/edit/main/knowledge/migrate/migrate-from-openclaw.md)。

## 下一步

- 還在猶豫該不該搬 → [Hermes Agent 跟 OpenClaw 差在哪](/concepts/龍蝦殺手/)
- 重新設定模型 → [模型供應商與 API key 設定](/config/model-provider/)
- 接回 Telegram → [Telegram 常見坑與解法](/troubleshoot/telegram/)
- 看看有哪些官方 skills → [技能全目錄](/skills/catalog/)

[^1]: NousResearch/hermes-agent, OpenClaw Migration SKILL.md（preset 內容、機密允許清單原文「currently: TELEGRAM_BOT_TOKEN」），2026-07-29 存取 — https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/migration/openclaw-migration/SKILL.md

[^2]: 本機實測 `hermes claw --help`、`hermes claw migrate --help`、`hermes claw cleanup --help` 與 `hermes claw migrate --dry-run`（macOS、v0.17.0、2026-07-29）。摘要區塊、gateway 活躍連線的中止訊息與離開代碼 0 均為實際輸出，家目錄路徑已代換。官方文件見 — https://hermes-agent.nousresearch.com/docs
