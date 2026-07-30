---
title: "換電腦：把整個 Hermes 搬到新機器"
description: "hermes backup 打包整個 ~/.hermes，新機器 import 就還原：記憶、技能、設定、對話都在。但那個 zip 內含你的 API key，搬運方式要當機密處理。"
date: 2026-07-27
subcategory: "backup"
hermes_version: ">=2026.5"
last_verified: 2026-07-27
human_reviewed: false
upstream_refs:
  - "https://hermes-agent.nousresearch.com/docs/reference/faq"
tags:
  - "backup"
  - "migrate"
status: "published"
---

換了新電腦，最不想重來的就是那些累積出來的東西：agent 對你的記憶、它自己長出的技能、你調好的設定、過去所有對話。好消息是 Hermes 內建一鍵打包還原，這些**全部能一起搬**。

但有一件事得先講清楚：**打包出來的檔案裡有你的 API key**。所以「怎麼搬這個檔案」比「怎麼產生它」更需要小心。

## 最快的做法：backup → import

在**舊機器**上打包：

```bash
hermes backup
```

它會產生一個 `~/hermes-backup-<時間戳>.zip`，裡面是你完整的 `~/.hermes/` 目錄：**設定、API key、記憶、技能、對話 sessions、profiles 全包**[^1]。

把這個檔案傳到新機器(下一節談安全的傳法)，然後在**新機器**上：

```bash
hermes import ~/hermes-backup-<時間戳>.zip
hermes setup
```

`hermes setup` 收尾，確認環境接上[^1]。

**成功判準**：在新機器開一場對話，問它「你記得關於我的什麼？」：它應該答得出你的名字、偏好、專案慣例。技能也在：`hermes skills browse` 看得到你舊機器上那些。都對上，就搬成功了。

## ⚠️ 那個 zip 是機密，別隨便傳

`hermes backup` 的完整備份**含 `.env` 和 `auth.json`**：也就是你所有的 API key 和 OAuth 憑證[^2]。所以：

- ✅ 用 `scp` 直接機器對機器傳：`scp ~/hermes-backup-*.zip newmachine:~/`[^1]
- ✅ 隨身碟、加密雲端硬碟
- ❌ **別**用 email 寄給自己
- ❌ **別**丟進沒加密的公開雲端資料夾
- ❌ **別**貼到聊天室、issue、任何公開的地方

一旦這個 zip 外流，等於你所有的 API key 都給了別人。搬完之後，舊機器上那份備份也記得刪掉。

## 只想搬一個 profile(可安全分享)

如果你只想搬**其中一個 profile**：或者想把設定分享給同事、放上網：用 profile 匯出。它跟完整備份最大的差別：**會剝除憑證**，適合安全分享[^3]:

```bash
# 舊機器匯出
hermes profile export work ./work-backup.tar.gz

# 新機器匯入
hermes profile import ./work-backup.tar.gz work
```

| | `hermes backup` | `hermes profile export` |
|---|---|---|
| 範圍 | 整個 `~/.hermes` | 單一 profile |
| 格式 | `.zip` | `.tar.gz` |
| 含憑證 | **含**(.env、auth.json) | **剝除**，可安全分享 |

所以判斷很簡單：**自己搬家用 `backup`，要給別人用 `profile export`**。

## 手動做法：rsync

不想用內建指令，也可以直接同步目錄。記得**排除程式碼 repo**(那個重裝就有，不需搬)[^4]:

```bash
rsync -av --exclude='hermes-agent' ~/.hermes/ newmachine:~/.hermes/
```

這條同樣會搬到 `.env` 裡的密鑰，所以只在你信任的機器與網路間用。

## 常見問題

### 記憶真的會跟著走嗎？

會。`MEMORY.md`、`USER.md` 都在 `~/.hermes/memories/`，完整備份與 rsync 都會帶上。搞不清楚記憶存在哪、記什麼，見 [記憶系統](/concepts/記憶系統/)。

### 從舊機器搬，版本要一樣嗎？

先在新機器裝好對應版本的 Hermes 再 import 最保險。裝法見 [安裝部署](/install/)。

### 我是從 OpenClaw 搬，不是換 Hermes 機器？

那是另一條路，用 `hermes claw migrate`，見 [從 OpenClaw 搬到 Hermes](/migrate/migrate-from-openclaw/)。

### 只想備份、不換機器？

同一條 `hermes backup` 就是你的備份。搭配設定裡的 `updates.pre_update_backup`，升級前也會自動備份，見 [config.yaml 參考](/config/config-yaml-reference/)。

## 下一步

- 到新機器要先裝起來 → [安裝部署](/install/)
- 確認搬過來的設定 → [config.yaml 參考](/config/config-yaml-reference/)
- 從 OpenClaw 而非換機器 → [遷移指南](/migrate/migrate-from-openclaw/)

[^1]: Nous Research, FAQ：https://hermes-agent.nousresearch.com/docs/reference/faq (2026-07-27 存取)。`hermes backup` 產生 `~/hermes-backup-<timestamp>.zip`(完整 `~/.hermes/`:config、API keys、memories、skills、sessions、profiles)；新機器以 `hermes import <file>` 還原後 `hermes setup`；可用 `scp` 在機器間傳輸
[^2]: 同上，完整備份包含 `.env` 與 `auth.json`(API key 與 OAuth 憑證)，故備份檔應以機密方式保管與傳輸
[^3]: 同上，`hermes profile export <name> <file.tar.gz>` / `hermes profile import`：範圍為單一 profile、格式 `.tar.gz`、剝除憑證以利安全分享
[^4]: 同上，手動替代方案 `rsync -av --exclude='hermes-agent' ~/.hermes/ newmachine:~/.hermes/`，排除程式碼 repo
