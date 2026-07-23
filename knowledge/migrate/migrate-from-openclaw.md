---
title: "從 OpenClaw 搬到 Hermes Agent"
description: "官方內建 hermes claw migrate,記憶、SOUL.md、skills 都能搬。先 dry-run 看清楚會動到什麼,再決定要不要帶機密。"
date: 2026-07-23
subcategory: "openclaw"
hermes_version: ">=2026.5"
last_verified: 2026-07-04
human_reviewed: false
upstream_refs:
  - "https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/migration/openclaw-migration/SKILL.md"
  - "https://hermes-agent.nousresearch.com/docs/reference/faq"
tags:
  - "openclaw"
  - "migrate"
status: "published"
---

換工具最怕的不是學新介面,是**累積的東西搬不過來**——你調教了幾個月的 SOUL.md、agent 對你的記憶、自己寫的 skills。

好消息:Hermes 內建了官方的 OpenClaw 遷移指令,這些東西大部分能直接搬[^1]。

## 先看它打算搬什麼(不要跳過這步)

```bash
hermes claw migrate --dry-run
```

`--dry-run` **只報告、不動手**[^1]。它會列出三類項目:可以搬的、搬不動的、以及會被封存的。

**為什麼一定要先跑**:遷移會動到你的 Hermes 設定。先看清楚清單,等一下結果不如預期時你才知道問題出在哪。

> 📝 **這一段缺實際輸出**:`--dry-run` 的報告長什麼樣、分類怎麼呈現,我們手上沒有實機畫面。
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

**成功判準**:跑完後啟動 `hermes`,問它一件只有舊環境才知道的事(例如你的專案慣例、你之前告訴過它的偏好)。答得出來,記憶就是搬成功了。

## 機密資訊要不要一起搬

預設**不會**搬機密。想明確跳過所有 secrets:

```bash
hermes claw migrate --preset user-data
```

要搬的話得明確指定:

```bash
hermes claw migrate --migrate-secrets
```

即使加了這個參數,也只會搬**允許清單內**的機密——目前是 `TELEGRAM_BOT_TOKEN`[^1]。其他 API key 需要你自己重新設定。

這個設計是刻意的:機密跨工具複製是風險行為,官方選擇讓你明確表態。

## 其他常用參數

已經有同名檔案時覆蓋:

```bash
hermes claw migrate --overwrite
```

OpenClaw 不在預設位置(預設會找 `~/.openclaw`):

```bash
hermes claw migrate --source /custom/path/.openclaw
```

## 搬完之後要做的三件事

1. **重新設定 API key**——除了 Telegram token,其他機密不會跟著搬。見 [模型供應商與 API key 設定](/config/model-provider/)
2. **檢查 skills 有沒有正常運作**——OpenClaw skills 被放進 `~/.hermes/skills/openclaw-imports/`,格式相容不代表行為完全一致
3. **有接 Telegram 的話**,確認允許名單有搬過來,見 [Telegram 常見坑](/troubleshoot/telegram/)

## 常見問題

### 第一次裝 Hermes 需要手動跑嗎?

安裝時若偵測到 OpenClaw 環境,安裝流程通常會提示遷移,不一定要手動執行。

### 搬完 OpenClaw 還能用嗎?

可以。遷移是複製不是移動,`~/.openclaw` 不會被刪掉。建議先留著,確認 Hermes 一切正常再處理。

### 記憶搬過來會不會格式跑掉?

官方遷移指令會做格式轉換[^1]。但兩個系統的記憶模型不同,轉換後的呈現方式可能有差異。

> 📝 **待補實際經驗**:轉換後記憶的完整度如何、有沒有明顯遺漏,只有真的搬過的人才知道。
> [歡迎補上](https://github.com/hansai-art/hermesagent.download/edit/main/knowledge/migrate/migrate-from-openclaw.md)。

## 下一步

- 重新設定模型 → [模型供應商與 API key 設定](/config/model-provider/)
- 接回 Telegram → [Telegram 常見坑與解法](/troubleshoot/telegram/)
- 看看有哪些官方 skills → [技能全目錄](/skills/catalog/)

[^1]: NousResearch/hermes-agent, OpenClaw Migration SKILL.md — https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/migration/openclaw-migration/SKILL.md(2026-07-23 存取)
