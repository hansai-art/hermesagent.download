---
title: "把 Hermes 接上 Telegram:從零到能對話"
description: "手機上隨時丟一句話給你的 agent。五步:BotFather 拿 token、設定、授權自己、開 gateway、驗證。含最容易被卡的授權那一步。"
date: 2026-07-25
subcategory: "telegram"
hermes_version: ">=2026.5"
last_verified: 2026-07-25
human_reviewed: false
upstream_refs:
  - "https://hermes-agent.nousresearch.com/docs/user-guide/messaging/telegram"
tags:
  - "telegram"
  - "integrations"
status: "published"
---

把 Hermes 接上 Telegram，你就能在手機上隨時丟一句話給它——它在遠端做完事再回你。這是最多人用的接法。

整個流程五步，大約十分鐘。**最容易卡的不是技術，是授權**——Hermes 預設拒絕所有人，你得先把自己加進白名單，否則連你自己傳訊息它都不理。這篇會特別講清楚那一步。

## 第一步:跟 BotFather 要一個 token

Telegram 的機器人都是透過官方的 @BotFather 建立的[^1]:

1. 在 Telegram 搜尋 **@BotFather**(或開 `t.me/BotFather`)
2. 傳 `/newbot`
3. 取一個顯示名稱(例如「Hermes Agent」)
4. 取一個以 `bot` 結尾的 username(例如 `my_hermes_bot`)
5. BotFather 會回你一段 token，長這樣:`123456789:ABCdefGHIjklMNOpqrSTUvwxYZ`[^1]

⚠️ **這段 token 等於你 bot 的鑰匙**——拿到它的人就能控制你的 bot。別貼到公開的地方[^1]。

## 第二步:設定 Hermes

最簡單的方式是互動式設定，它會引導你填 token 和授權使用者[^1]:

```bash
hermes gateway setup
```

跳出選單時選 Telegram，貼上 token，填入允許的使用者 ID(下一步教你怎麼找 ID)。

**或者手動設定**——編輯 `~/.hermes/.env`:

```text
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrSTUvwxYZ
TELEGRAM_ALLOWED_USERS=123456789
```

多個使用者用逗號分隔[^1]。

## 第三步:授權自己(最容易卡的一步)

Hermes 的 gateway **預設拒絕所有人，這是刻意的安全設計**[^1]。所以就算是你自己，沒加進白名單它也不會回應。

先找出你的 Telegram 使用者 ID:傳訊息給 **@userinfobot**，它會回你一串數字 ID(像 `123456789`)[^3]。

把這個數字填進 `TELEGRAM_ALLOWED_USERS`(第二步那個欄位)。這一步漏了，症狀會是「bot 上線了但完全不理我」——不是壞掉，是它不認得你。

## 第四步:開 gateway

```bash
hermes gateway
```

bot 應該幾秒內上線[^1]。

> **要讓它長期掛著?** `hermes gateway` 是前景執行，關掉終端機就停。長駐要用 tmux(WSL 使用者特別注意 systemd 不可靠)，做法見 [WSL2 教學](/install/wsl2/) 與 [Telegram 常見坑](/troubleshoot/telegram/)。

## 第五步:驗證

在 Telegram 上傳一句話給你的 bot。

**成功判準**:它有回應。如果沒反應，查 `~/.hermes/logs/gateway.log`——gateway 啟動時會在這裡留連線紀錄[^1]。

沒回應最常見的兩個原因:**沒把自己加進白名單**(回第三步)，或 **gateway 沒在跑**(回第四步)。

## 想在群組裡用?

群組使用要多兩個動作[^2]:

1. 在 BotFather 的 bot 設定裡**關閉隱私模式**(privacy mode)
2. 改完隱私設定後，把 bot 從群組移除再重新加入

不做這兩步，bot 在群組裡收不到訊息。

## 常見問題

### 指令選單裡的 skill 少了幾個?

Telegram 對斜線指令有 100 個上限，超過的會安靜消失。解法見 [Telegram 常見坑](/troubleshoot/telegram/)。

### 從 OpenClaw 搬過來，授權要重設嗎?

官方遷移會搬 `TELEGRAM_ALLOWED_USERS`，加 `--migrate-secrets` 也會搬 token。搬完仍建議自己確認一次，見 [遷移指南](/migrate/migrate-from-openclaw/)。

### 可以同時接多個平台嗎?

可以。Hermes 的 gateway 支援 20 多個訊息平台，Telegram 只是其中一個。

### bot 上線但完全不回?

九成是白名單。確認你的數字 ID 有填進 `TELEGRAM_ALLOWED_USERS`，而且 gateway 有在跑。

## 下一步

- gateway 長駐與斷線問題 → [Telegram 常見坑與解法](/troubleshoot/telegram/)
- WSL 使用者的常駐設定 → [WSL2 完整教學](/install/wsl2/)
- 接外部工具 → [接上你的第一個 MCP](/integrations/connect-first-mcp/)

[^1]: Nous Research, Telegram — https://hermes-agent.nousresearch.com/docs/user-guide/messaging/telegram(2026-07-25 存取)。含 BotFather 建立流程、`hermes gateway setup`、`TELEGRAM_BOT_TOKEN` / `TELEGRAM_ALLOWED_USERS` 設定、預設拒絕所有人
[^2]: 同上，群組使用需在 BotFather 關閉 privacy mode，並於變更後將 bot 移除再重新加入群組
[^3]: 同上，以 @userinfobot 查詢數字使用者 ID;`hermes gateway` 啟動後連線紀錄寫入 `~/.hermes/logs/gateway.log`
