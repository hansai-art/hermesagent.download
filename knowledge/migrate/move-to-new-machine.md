---
title: "換新電腦?把整個 Hermes 一起搬過去"
description: "一個指令 hermes backup,就能把整個 ~/.hermes 打包成一個檔案;到新電腦用 hermes import 就全部還原:記憶、技能、設定、對話都在。要注意的是:這個打包檔裡藏著你的 API key(給程式用的通行密碼),所以搬它的時候要當成機密,別亂傳。"
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

換了新電腦,最麻煩的就是那些一點一滴累積出來的東西:agent 記住的關於你的事、它自己學會的技能、你慢慢調好的設定、還有過去所有的對話。這些要是全部從頭來,很痛。

好消息是:Hermes 內建了「一鍵打包、一鍵還原」的功能。上面說的那些東西,**可以全部一起搬**。

不過有一件事一定要先講清楚:**打包出來的那個檔案裡,藏著你的 API key**。

API key 是什麼?你可以把它想成「給程式用的通行密碼」。程式拿著它去連各種服務(例如 AI 模型),對方看到密碼對了才會放行。所以這個密碼外流,等於別人可以冒用你。也因此,「怎麼把這個檔案搬到新電腦」這件事,比「怎麼產生它」還要更小心。

## 最快的做法:先打包,再匯入

第一步,在**舊電腦**上打包。打開終端機(就是那個可以打指令的黑色視窗),輸入:

```bash
hermes backup
```

按下去之後,它會在你的家目錄產生一個檔案,名字長這樣:`~/hermes-backup-<時間戳>.zip`(這裡的 `~` 代表你的家目錄;`<時間戳>` 會被換成打包當下的日期時間,所以每次名字都不一樣;`.zip` 是一種把很多檔案壓成一包的格式)。

這一包裡面,是你完整的 `~/.hermes/` 資料夾。也就是說,**設定、API key、記憶、技能、對話紀錄(sessions)、各種設定組合(profiles),全部都在裡面**[^1]。

第二步,把這個檔案傳到新電腦(怎麼安全地傳,下一節會講),然後在**新電腦**上輸入這兩行:

```bash
hermes import ~/hermes-backup-<時間戳>.zip
hermes setup
```

第一行 `hermes import` 是把那一包解開、還原回去。第二行 `hermes setup` 是收尾檢查,確認新電腦上的環境都接得起來[^1]。

**怎麼確認搬成功了?** 在新電腦上開一場新對話,問它一句:「你記得關於我的什麼?」如果它答得出你的名字、你的偏好、你做專案的習慣,那記憶就搬過來了。再輸入 `hermes skills browse` 看看技能清單,如果你舊電腦上那些技能都在,那就是整包都搬對了。

## ⚠️ 這個 zip 是機密,別隨便傳

再強調一次,因為這很重要:`hermes backup` 產生的完整備份裡,**包含了 `.env` 和 `auth.json` 這兩個檔案**。`.env` 裡放的是你所有的 API key;`auth.json` 裡放的是 OAuth 憑證(OAuth 是一種「不用給出密碼、就能授權程式代你登入」的機制,那份憑證等於一張通行證)[^2]。

換句話說,這個 zip 一旦落到別人手裡,你所有的通行密碼就等於送給對方了。所以:

- ✅ 可以用 `scp` 直接電腦對電腦傳。`scp` 是一個「把檔案從一台電腦安全複製到另一台」的指令,像這樣:`scp ~/hermes-backup-*.zip newmachine:~/`(把 `newmachine` 換成你新電腦的名稱或位址)[^1]
- ✅ 可以用隨身碟,或有加密的雲端硬碟
- ❌ **不要**用 email 寄給自己
- ❌ **不要**丟進沒加密的、公開的雲端資料夾
- ❌ **不要**貼到聊天室、issue(問題回報單)、或任何別人看得到的公開地方

還有一件常忘記的事:搬完之後,舊電腦上那份備份檔記得刪掉,別讓它一直躺在那。

## 只想搬其中一個設定組合(這種可以安全分享)

有時候你不想搬全部,只想搬**其中一個 profile**(設定組合,就是一套獨立的設定,例如你可能有「工作用」和「私人用」兩套)。或者你想把某套設定分享給同事、甚至公開放上網。

這時候不要用完整備份,改用 profile 匯出。它跟完整備份最大的差別是:**匯出時會把憑證(那些密碼)拿掉**,所以拿去分享很安全[^3]:

```bash
# 在舊電腦上匯出(這裡匯出的是名叫 work 的那套設定)
hermes profile export work ./work-backup.tar.gz

# 在新電腦上匯入
hermes profile import ./work-backup.tar.gz work
```

(`.tar.gz` 跟 `.zip` 一樣,也是一種把多個檔案打包壓縮的格式。)

兩種做法差在哪,一張表看清楚:

| | `hermes backup` | `hermes profile export` |
|---|---|---|
| 搬多少 | 整個 `~/.hermes` | 只搬一個 profile |
| 檔案格式 | `.zip` | `.tar.gz` |
| 有沒有含密碼 | **有**(含 .env、auth.json) | **沒有**,拿掉了,可安全分享 |

所以怎麼選很簡單:**自己搬家、要搬全部,用 `backup`;要把設定給別人,用 `profile export`**。

## 進階做法:用 rsync 直接同步資料夾

如果你不想用內建指令,也可以直接把資料夾內容同步過去。`rsync` 是一個「把一個資料夾的內容複製、同步到另一台電腦」的指令。

有一個地方要記得:**把程式碼 repo 排除掉**(repo 就是程式碼倉庫,也就是 Hermes 程式本身的原始碼;這個東西在新電腦重新安裝就會有,不需要搬)[^4]:

```bash
rsync -av --exclude='hermes-agent' ~/.hermes/ newmachine:~/.hermes/
```

提醒一下:這條指令一樣會把 `.env` 裡的密碼一起搬過去,所以只在你信得過的電腦和網路之間用。

## 常見問題

### 記憶真的會跟著走嗎?

會。agent 記住的東西放在兩個檔案裡:`MEMORY.md` 和 `USER.md`,它們都在 `~/.hermes/memories/` 這個資料夾裡。不管你用完整備份還是 rsync,都會把它們一起帶走。如果你搞不清楚記憶到底存在哪、記了些什麼,可以看 [記憶系統](/concepts/記憶系統/)。

### 從舊電腦搬過來,兩邊的版本要一樣嗎?

最保險的做法是:先在新電腦裝好對應版本的 Hermes,再做 import。怎麼裝,看 [安裝部署](/install/)。

### 我是從 OpenClaw 搬過來,不是換 Hermes 的電腦?

那是另一條路,要用 `hermes claw migrate` 這個指令,做法看 [從 OpenClaw 搬到 Hermes](/migrate/migrate-from-openclaw/)。

### 我不換電腦,只是想做個備份?

同一條 `hermes backup` 指令,本身就是你的備份。另外,如果你在設定裡打開 `updates.pre_update_backup` 這個選項,那每次升級之前它也會自動先幫你備份一次。細節看 [config.yaml 參考](/config/config-yaml-reference/)。

## 下一步

- 到新電腦要先把 Hermes 裝起來 → [安裝部署](/install/)
- 確認搬過來的設定都對 → [config.yaml 參考](/config/config-yaml-reference/)
- 你是從 OpenClaw 搬、不是換機器 → [遷移指南](/migrate/migrate-from-openclaw/)

[^1]: Nous Research, FAQ:https://hermes-agent.nousresearch.com/docs/reference/faq (2026-07-27 存取)。`hermes backup` 產生 `~/hermes-backup-<timestamp>.zip`(完整 `~/.hermes/`:config、API keys、memories、skills、sessions、profiles);新機器以 `hermes import <file>` 還原後 `hermes setup`;可用 `scp` 在機器間傳輸
[^2]: 同上,完整備份包含 `.env` 與 `auth.json`(API key 與 OAuth 憑證),故備份檔應以機密方式保管與傳輸
[^3]: 同上,`hermes profile export <name> <file.tar.gz>` / `hermes profile import`:範圍為單一 profile、格式 `.tar.gz`、剝除憑證以利安全分享
[^4]: 同上,手動替代方案 `rsync -av --exclude='hermes-agent' ~/.hermes/ newmachine:~/.hermes/`,排除程式碼 repo