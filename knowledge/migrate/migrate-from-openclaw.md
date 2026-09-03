---
title: "第一次從 OpenClaw 搬家到 Hermes Agent:一步一步帶你做"
description: "Hermes 內建一個官方搬家指令 hermes claw migrate,能把你的記憶、SOUL.md、自己寫的技能一起帶過來。密碼類的東西預設不會搬。真的動手前,它會先幫你存一份備份。動手前你可以先用 dry-run(只預覽、不真的做)看清楚它會動到什麼，不過如果你的 bot 正在線上,dry-run 會先被擋下來。"
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

換工具的時候,最讓人頭痛的通常不是「要學一個新畫面」,而是**舊工具裡累積的東西搬不過來**。

想想看:你可能花了好幾個月慢慢調整 `SOUL.md`(agent 的「人設檔」,決定它講話的個性和風格)、agent 記住的一堆關於你的事、還有你自己動手寫的 skills(技能,就是你教它的一項項本事)。這些搬不過來,等於一切重來。

好消息是:Hermes 已經幫你準備好一個官方的「搬家指令」,上面這些東西大部分可以直接搬過來[^1]。

這篇只教你**怎麼搬**,一步一步做。如果你還在猶豫「到底該不該搬」,先去看[Hermes Agent 跟 OpenClaw 差在哪](/concepts/龍蝦殺手/)。這裡先給你兩個定心丸:第一,兩邊都有的功能,不能算是搬家的理由;第二,搬家是「複製一份過去」,不是「把舊的剪下貼過來」，搬完之後,你原本的 OpenClaw 一樣還在,不會消失。

## 第一步:先讓它「預演」一遍,看看它打算搬什麼(這步千萬別跳過)

先在終端機(就是那個黑底白字、你打指令的視窗)裡輸入這一行:

```bash
hermes claw migrate --dry-run
```

這裡的 `--dry-run` 是「乾跑」的意思,你可以理解成「彩排」:它**只會告訴你它打算做什麼,但完全不會真的動手**[^1]。

跑下去以後,畫面最上面會先印出一段「設定摘要」。我們在一台 Mac(macOS)上實際跑過(版本 v0.17.0),看到的是這樣[^2]:

```text
◆ Migration Settings
  Source:      /Users/你的帳號/.openclaw
  Target:      /Users/你的帳號/.hermes
  Preset:      full
  Overwrite:   no (skip conflicts)
  Secrets:     no
```

這短短五行,其實就是整件事最關鍵的資訊。翻成白話:

- `Source`(來源):它要從哪裡搬,也就是你的舊 OpenClaw 資料夾。
- `Target`(目的地):它要搬到哪裡,也就是你的新 Hermes 資料夾。
- `Preset`(套裝方案):預設是 `full`(完整),等一下會解釋這是什麼。
- `Overwrite`(遇到同名檔案怎麼辦):`no` 代表不覆蓋、直接跳過。
- `Secrets`(密碼類的東西):`no` 代表不搬。

先注意一個看起來矛盾的地方:**方案明明是 `full`(完整),但 `Secrets`(密碼類)還是 `no`(不搬)**。這兩個並不衝突,等一下「密碼要不要一起搬」那一段會解釋清楚。

**為什麼一定要先預演這一遍?** 因為真正的搬家會去改動你的 Hermes 設定。先把它「打算做的清單」看清楚,萬一等一下結果跟你想的不一樣,你才知道問題出在哪一步,而不是一頭霧水。

### 小陷阱:如果你的 bot 正在線上,這個預演會先被擋下來

先解釋一個詞:**gateway**(閘道,就是讓你的 bot 能收訊息、發訊息的那一層,可以想成 bot 的「總機」)。

如果你的 Hermes gateway 正在運作,而且真的有人在跟你的 bot 講話(有「活躍連線」),那麼 `--dry-run` 不會乖乖印出清單,而是會先跳出下面這段話,然後停在那邊等你[^2]:

```text
✗ Hermes gateway is running with active connections: telegram
  Migrating bot tokens while the gateway is active will cause conflicts
  (Telegram, Discord, and Slack only allow one active session per token).
  Recommendation: stop the gateway first with 'hermes gateway stop'.

Continue anyway? [y/N]:
  Migration cancelled. Stop the gateway and try again.
```

(這段英文的意思是:它偵測到 gateway 還開著、Telegram 有活躍連線;在這種情況下搬 bot 的 token 會出問題,因為 Telegram、Discord、Slack 這類服務,同一個 token 同一時間只允許一個連線;所以它建議你先用 `hermes gateway stop` 把 gateway 關掉。)

這裡順便解釋一個詞:**token**(權杖,你可以想成 bot 專用的「通行密碼」,系統靠它認出這是你的 bot)。

這邊有兩件事要特別留意。

第一,這個檢查連「只是彩排」的 `--dry-run` 都會擋下來，就算彩排根本不會去動任何 token,它還是先攔你。

第二,一個容易踩到的坑:**它被擋下來的時候,回報的「離開代碼」竟然是 0**。這裡再解釋一個詞:**離開代碼(exit code)**是指令結束時丟回去的一個數字,慣例上 `0` 代表「順利完成」,不是 0 代表「出錯了」。問題就在這:明明被擋住、一行清單都沒印,它卻回報 `0`(好像成功了)。這跟 `hermes doctor`、`hermes security audit` 是同一個毛病(詳見 [hermes doctor 實際跑起來長什麼樣](/troubleshoot/hermes-doctor/))。所以,如果你是寫在自動化腳本裡跑,**請看它印出來的文字內容來判斷,不要只看那個離開代碼**,不然腳本會誤以為預覽成功跑完了。

遇到這個攔截,照它建議的做就好:先 `hermes gateway stop` 把 gateway 關掉;或者你也可以在那個提示後面直接回 `y` 繼續預覽(反正 dry-run 只是彩排,不會真的寫入東西)。

> 📝 **這一段還缺後半**:等 gateway 停掉、預演能順利跑完之後,完整的搬家清單(哪些能搬、哪些搬不動、哪些會被封存起來)長什麼樣子,我們手上還沒有實機畫面。
> [幫我們補上](https://github.com/hansai-art/hermesagent.download/edit/main/knowledge/migrate/migrate-from-openclaw.md)。

## 第二步:真的動手搬

彩排看清楚、也沒問題了,就把 `--dry-run` 拿掉,真的執行:

```bash
hermes claw migrate
```

這是一個「互動式」的流程，意思是它會一邊跑一邊問你問題,你照著回答就好。官方會幫你搬這些東西[^1]:

| 這個東西 | 會被搬到哪 |
|---|---|
| `SOUL.md`、`MEMORY.md`、`USER.md` | 轉換成 Hermes 自己的記憶系統 |
| command allowlist(指令白名單,就是「允許執行的指令清單」) | Hermes 對應的設定 |
| `TELEGRAM_ALLOWED_USERS` 這類相容的訊息設定 | Hermes 對應的設定 |
| 你原本的 OpenClaw skills(技能) | `~/.hermes/skills/openclaw-imports/` 這個資料夾 |

**怎麼確認搬成功了?** 搬完之後,啟動 `hermes`,然後問它一件「只有舊環境才會知道」的事。比方說你之前告訴過它的某個工作習慣、或某個你交代過的偏好。如果它答得出來,就代表記憶成功搬過來了。這就是你的成功判準。

## 密碼類的東西,要不要一起搬?

先講結論:**上面那兩種套裝方案,都不會幫你搬密碼類的東西。** 所以你不需要為了「避開密碼」特地去挑哪個方案。

這裡的「密碼類」在原文叫 secrets(機密,泛指 token、API key 這種不能外流的敏感資料)。CLI(命令列工具,就是你在終端機打的那些 `hermes ...` 指令)的說明原文寫的是「Neither preset imports secrets」(兩種方案都不會匯入機密),而且 `--migrate-secrets`「Required even under `--preset full`」(就算你用了 full 方案,還是得額外自己加上這個旗標才會搬)[^2]。所以前面那個看起來矛盾的地方，`Preset: full` 配上 `Secrets: no`，其實就是這個意思:方案完整,但密碼還是照樣不搬。

那兩種方案差在哪?差別**不在密碼**,而在「要不要順便帶走跟密碼相關的『設定項』」:

- `user-data` 帶走的是:soul、workspace-agents、memory、user-profile、messaging-settings、command-allowlist、skills、tts-assets,還有封存資料。
- `full` 是在 `user-data` 之上,再多帶走 secret-settings(密碼相關的設定項)[^1]。
- 預設用的是 `full`[^2]。

如果你連「跟密碼相關的設定項」都不想帶,可以這樣指定用 `user-data` 方案:

```bash
hermes claw migrate --preset user-data   # 連 secret 相關設定項都不要
```

反過來,如果你**真的想連密碼本身也一起搬**,就得明明白白加上這個旗標(旗標就是指令後面加的那個 `--xxx`,用來開關某個功能):

```bash
hermes claw migrate --migrate-secrets
```

**這裡有一個地方兩份資料講得不一樣,請以你自己電腦上跑 dry-run 看到的為準。** 官方的 SKILL.md 說,它只會搬「a small allowlisted set of Hermes-compatible secrets, currently: `TELEGRAM_BOT_TOKEN`」(一小份被允許、且和 Hermes 相容的機密清單,目前就只有 `TELEGRAM_BOT_TOKEN`)[^1];但我們裝在本機的 v0.17.0 版,`--help` 說明卻寫「Include allowlisted secrets (TELEGRAM_BOT_TOKEN, API keys, etc.)」(包含被允許的機密:`TELEGRAM_BOT_TOKEN`、API key 等等)[^2]。兩邊的差別在於:到底「只有 Telegram 的 token」,還是「連 API key 也算」。

在你自己確認清楚之前,**請往「範圍比較大」的那個假設去想**:也就是說,只要你加了 `--migrate-secrets`,就當作連 API key 都有可能被複製過去。寧可高估被複製的範圍,也別低估，低估比較危險。想知道你這台實際上到底會搬什麼,就跑 `--dry-run`,去看 `Secrets:` 那一行,還有它列出來的清單。

這個「密碼要你自己明講才搬」的設計,是官方故意這樣做的:把密碼從一個工具複製到另一個工具,本來就是有風險的事,所以它要你自己親口點頭。

## 萬一搬壞了,可以還原

放心,在真正動手套用之前,Hermes **預設會先幫你把整個 `~/.hermes/` 資料夾打包成一份備份**(可以想成一個「還原點」,就像遊戲存檔),放進 `~/.hermes/backups/` 這個資料夾裡。之後如果需要,可以用 `hermes import` 把它還原回去[^2]。這是內建的預設行為,你什麼參數都不用加,它就會自動幫你存。

如果你想跳過這個備份(不建議這麼做):

```bash
hermes claw migrate --no-backup
```

知道「有一個還原點在那裡」,比任何「搬過去很安全啦」的口頭保證都實用得多，因為就算真的搬壞了,你還有一條退路可以走。

## 其他你可能會用到的參數

**技能撞名時怎麼辦**(就是新舊有兩個同名的 skill)。預設是直接跳過不處理[^2]:

```bash
hermes claw migrate --skill-conflict rename   # skip(預設) / overwrite / rename
```

(這三個選項:`skip` 是跳過、`overwrite` 是直接覆蓋、`rename` 是改個名字保留兩份。)

**強制覆蓋已經存在的檔案**:

```bash
hermes claw migrate --overwrite
```

這個旗標的說明,在兩個地方寫得不太一樣:`--help` 說如果不加它,遇到衝突時會「refuse to apply when the plan has conflicts」(只要計畫裡有衝突,就整批拒絕、不套用);但 dry-run 的摘要裡卻印成 `Overwrite: no (skip conflicts)`(遇到衝突的項目就跳過)。所以到底是「有衝突就整批停下」還是「逐項跳過有衝突的」,最準的辦法就是自己跑一次 `--dry-run`,看你這台實際列出來的清單怎麼說[^2]。

**你的 OpenClaw 不在預設位置**(它預設會去找 `~/.openclaw` 這個資料夾)。如果你的裝在別的地方,用這個告訴它路徑:

```bash
hermes claw migrate --source /custom/path/.openclaw
```

**把 workspace 的指示檔複製到你指定的路徑**(workspace 就是你的「工作區」資料夾):

```bash
hermes claw migrate --workspace-target /absolute/path
```

## 搬完之後,記得做這三件事

1. **重新設定你的 API key**:除了 Telegram 的 token,其他密碼類的東西都不會跟著搬過來,所以你得自己重新設一次。做法見 [模型供應商與 API key 設定](/config/model-provider/)。
2. **檢查 skills 有沒有正常運作**:你的 OpenClaw skills 會被放進 `~/.hermes/skills/openclaw-imports/`。要注意,「格式相容」不等於「行為一模一樣」,所以最好一個個試一下。
3. **如果你有接 Telegram**,去確認允許名單(哪些人可以用你的 bot)有沒有一起搬過來。做法見 [Telegram 常見坑](/troubleshoot/telegram/)。

## 常見問題

### 我第一次裝 Hermes,需要自己手動跑搬家指令嗎?

不一定。如果安裝的時候它偵測到你電腦上有 OpenClaw,安裝流程通常就會直接跳出來問你要不要搬,你不見得需要自己手動下指令。

### 搬完之後,我原本的 OpenClaw 還能用嗎?

能。再強調一次:搬家是「複製」不是「移動」,你的 `~/.openclaw` 資料夾不會被刪掉。建議先留著它,等你確認 Hermes 這邊一切都正常了,再來處理舊的。

等你確認沒問題之後,官方還有一支專門「收尾」用的指令。它的用途是把散落各處的 OpenClaw 資料夾封存起來,免得你的狀態同時卡在新舊兩邊、東一塊西一塊[^2]:

```bash
hermes claw cleanup --dry-run   # 先看它打算封存哪些目錄
hermes claw cleanup             # 確認後才真的封存
```

注意:它是**封存**(收起來、歸檔),**不是刪除**。它一樣支援用 `--source` 指定路徑。

### 記憶搬過來,格式會不會跑掉?

官方的搬家指令會幫你做格式轉換[^1]。不過因為兩個系統記憶的運作方式本來就不一樣,轉換之後呈現出來的樣子,可能會跟你原本習慣的有點差異。

> 📝 **這裡也還缺實際經驗**:轉換之後記憶到底完不完整、有沒有明顯漏掉什麼,這種事只有真的搬過的人才說得準。
> [歡迎補上](https://github.com/hansai-art/hermesagent.download/edit/main/knowledge/migrate/migrate-from-openclaw.md)。

## 下一步

- 還在猶豫該不該搬 → [Hermes Agent 跟 OpenClaw 差在哪](/concepts/龍蝦殺手/)
- 重新設定模型 → [模型供應商與 API key 設定](/config/model-provider/)
- 把 Telegram 接回來 → [Telegram 常見坑與解法](/troubleshoot/telegram/)
- 看看有哪些官方 skills → [技能全目錄](/skills/catalog/)

[^1]: NousResearch/hermes-agent, OpenClaw Migration SKILL.md(preset 內容、機密允許清單原文「currently: TELEGRAM_BOT_TOKEN」),2026-07-29 存取:https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/migration/openclaw-migration/SKILL.md

[^2]: 本機實測 `hermes claw --help`、`hermes claw migrate --help`、`hermes claw cleanup --help` 與 `hermes claw migrate --dry-run`(macOS、v0.17.0、2026-07-29)。摘要區塊、gateway 活躍連線的中止訊息與離開代碼 0 均為實際輸出,家目錄路徑已代換。官方文件見:https://hermes-agent.nousresearch.com/docs