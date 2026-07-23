---
title: "Telegram 接 Hermes Agent 的兩個坑"
description: "指令選單莫名少了幾個、gateway 半夜自己斷線——這兩件事都有明確原因與官方解法,不是你設錯。"
date: 2026-07-23
subcategory: "telegram"
hermes_version: ">=2026.5"
last_verified: 2026-07-04
human_reviewed: false
upstream_refs:
  - "https://hermes-agent.nousresearch.com/docs/reference/faq"
tags:
  - "telegram"
  - "troubleshoot"
status: "published"
---

Telegram 是最多人拿來接 Hermes Agent 的平台——手機上隨時能丟一句話給它,它在遠端做完再回報。

但有兩件事會讓你懷疑自己是不是設錯了:**指令選單裡莫名少了幾個 skill**,以及 **gateway 跑一跑就自己斷線**。這兩件事都不是你的錯,而且都有明確解法。

## 坑一:Telegram 只給 100 個斜線指令

Telegram 平台對 bot 的斜線指令數量有 **100 個上限**。Hermes 的 skills 會註冊成斜線指令,skills 一多就會超過——超過的部分不會報錯,**就是安靜地不出現**[^1]。

所以你會看到:某些 skill 在終端機裡好好的,在 Telegram 卻找不到。

**解法**:在 `~/.hermes/config.yaml` 停用這個平台用不到的 skills[^1]:

```yaml
skills:
  platform_disabled:
    telegram: [skill-a, skill-b]
```

改完**要重啟 gateway** 才會生效。

**成功判準**:重啟後在 Telegram 輸入 `/`,原本消失的指令回到選單裡。

**該停用哪些**:挑那些在手機上根本不會用的——需要看大量輸出、需要編輯檔案、需要互動式操作的 skill,留在終端機用就好。

## 坑二:gateway 一直斷線(WSL 使用者)

如果你在 WSL 裡跑 gateway,而它總是跑一陣子就沒反應,原因很可能是 **systemd 在 WSL 環境不可靠**[^1]。

這個坑特別討厭的地方在於:你照著一般 Linux 教學設好 systemd service,`systemctl status` 看起來也正常,但實際上重開 WSL 之後它就沒了。

**解法**:不要依賴 systemd,改用前景模式或 tmux 常駐:

```bash
tmux new -s hermes 'hermes gateway run'
```

**成功判準**:關掉終端機視窗再開一個,`tmux ls` 看得到 `hermes` session 還在。

要回到那個 session:

```bash
tmux attach -t hermes
```

(離開但不關閉:`Ctrl+B` 然後 `D`)

⚠️ Windows 完全關閉 WSL 或重開機時,tmux session 還是會消失。開機自動啟動需要另外設定 Windows 工作排程器。詳見 [WSL2 安裝教學](/install/wsl2/)。

## 多人共用要設授權

如果你的 bot 不只自己用,務必設定授權——否則任何人找到你的 bot 都能操作你的 agent。

官方訊息閘道支援 allowlist 與 DM 配對,在 `config.yaml` 的 gateway 區塊設定授權模式。

> 📝 **這一段缺具體設定範例**:allowlist 的確切 YAML 結構我們還沒整理。
> 有設定過的人[請補上](https://github.com/hansai-art/hermesagent.download/edit/main/knowledge/troubleshoot/telegram.md)——
> 這關係到安全性,值得寫清楚。

## 常見問題

### 從 OpenClaw 搬過來,允許名單要重設嗎?

官方遷移指令會搬 `TELEGRAM_ALLOWED_USERS` 這類相容設定,加 `--migrate-secrets` 時也會搬 `TELEGRAM_BOT_TOKEN`。搬完還是建議自己確認一次。見 [OpenClaw 遷移指南](/migrate/migrate-from-openclaw/)。

### 指令選單改了但沒生效?

兩個可能:gateway 沒重啟,或是 Telegram 客戶端快取了舊選單。先重啟 gateway,再把 Telegram 對話關掉重開。

### 不在 WSL 也會斷線?

那就不是這個原因了。先看 gateway 的執行紀錄,可能是網路或 token 問題。

> 📝 **待補**:gateway 紀錄要去哪裡看,我們還沒整理。歡迎補充。

## 下一步

- WSL2 完整設定 → [WSL2 安裝教學](/install/wsl2/)
- 從 OpenClaw 搬過來 → [遷移指南](/migrate/migrate-from-openclaw/)
- 其他問題 → [疑難排解總覽](/troubleshoot/overview/)

[^1]: Nous Research, FAQ — https://hermes-agent.nousresearch.com/docs/reference/faq(2026-07-23 存取)
