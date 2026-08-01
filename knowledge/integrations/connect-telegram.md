---
title: "新手教學:讓 Hermes 在 Telegram 上跟你對話"
description: "在手機上打一句話,你的 agent 就在遠端幫你做事再回你。只要五步,大約十分鐘。最容易卡住的「授權自己」那一步,這篇會手把手帶你走。"
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

先講這篇能幫你做到什麼。

把 Hermes 接上 Telegram 之後,你就能在手機上直接打字給它。它會在遠端(也就是你電腦或伺服器那一端)把事情做完,再把結果回傳到你的 Telegram。就像多了一個隨傳隨到的小助手。這也是最多人用的接法。

這裡先解釋一個一直會用到的詞:**agent**,你可以想成「一個會幫你辦事的程式助手」。下面講的 bot(機器人),就是這個 agent 在 Telegram 上的化身。

整個過程只有五步,大約十分鐘就能弄好。

先給你打個預防針:**最容易卡住的不是技術,是「授權」這一步**。Hermes 一開始會拒絕所有人跟它講話,這是故意的(為了安全)。所以你得先親手把自己加進一份「允許名單」,不然連你自己傳訊息,它都會裝作沒看到。這篇會特別把那一步講清楚,你照著做就不會踩坑。

## 第一步:跟 BotFather 要一把「鑰匙」(token)

在 Telegram 裡,所有機器人都要先跟一個官方帳號 @BotFather 申請才能生出來[^1]。它就像是發機器人身分證的櫃檯。

跟著做:

1. 在 Telegram 上方搜尋 **@BotFather**(或直接開這個網址 `t.me/BotFather`)
2. 傳一則訊息給它:`/newbot`
3. 幫你的機器人取一個顯示名稱(就是別人看到的名字,例如「Hermes Agent」)
4. 再取一個 username(帳號名),規定要用 `bot` 結尾(例如 `my_hermes_bot`)
5. 弄完之後,BotFather 會回你一串亂碼,長得像這樣:`123456789:ABCdefGHIjklMNOpqrSTUvwxYZ`[^1]

這串亂碼叫做 **token**。你可以把它想成「你這個 bot 的鑰匙」或「密碼」。

⚠️ **這把鑰匙非常重要,一定要收好**:任何人只要拿到它,就能冒充你、控制你的 bot。所以千萬不要把它貼到公開的地方(例如聊天群組、論壇、GitHub)[^1]。

## 第二步:告訴 Hermes 這把鑰匙

現在要把剛剛那把鑰匙交給 Hermes,它才知道要控制哪一個 bot。

最簡單的做法是用「互動式設定」。你只要下一行指令,它就會一步步問你、帶你填好 token 和允許的使用者[^1]。

先解釋一下:下面框框裡的東西是**指令**,要打在「終端機」裡。終端機就是那個黑黑的、可以打字下命令給電腦的視窗(在 Mac 叫「終端機 Terminal」,在 Windows 常用的是 PowerShell)。

```bash
hermes gateway setup
```

按 Enter 之後,畫面會跳出一個選單。選 Telegram,把剛剛的 token 貼上去,再填入「允許使用的人的 ID」(下一步會教你去哪裡找這個 ID,先別急)。

**如果你比較想自己手動設定**,也可以。做法是打開一個叫 `~/.hermes/.env` 的檔案來編輯。

這裡解釋兩個名詞。`~` 是一個代號,代表「你的家目錄」(也就是你自己的使用者資料夾)。副檔名是 `.env` 的檔案,是專門用來存「設定值」的地方,裡面一行寫一個設定。在裡面填上這兩行:

```text
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrSTUvwxYZ
TELEGRAM_ALLOWED_USERS=123456789
```

第一行 `TELEGRAM_BOT_TOKEN` 放的就是你的鑰匙。第二行 `TELEGRAM_ALLOWED_USERS` 放的是「允許跟 bot 講話的人的 ID」。如果要允許好幾個人,ID 之間用逗號隔開就行[^1]。

## 第三步:把自己加進允許名單(最容易卡的一步!)

這步最重要,請看仔細。

Hermes 有一層叫 **gateway(閘道,就是負責讓 bot 收訊息、發訊息的那一層)**。它**一開始會拒絕所有人**,這是故意設計成這樣的,為了安全[^1]。意思是:就算是你本人,只要沒被加進允許名單,它就不會回你。

所以你得先知道「自己的 Telegram ID 是幾號」。每個 Telegram 使用者都有一組專屬的數字編號,就像身分證字號。

找出自己 ID 的方法很簡單:在 Telegram 搜尋 **@userinfobot**,傳任何一句話給它,它馬上會回你一串數字,那就是你的 ID(長得像 `123456789`)[^3]。

把這串數字,填到第二步那個 `TELEGRAM_ALLOWED_USERS` 欄位裡。

如果這一步漏掉,你會遇到的狀況是:「bot 明明上線了,可是不管我傳什麼它都不回」。這時候**它沒有壞,只是不認得你**。把 ID 加進去就好了。

## 第四步:把 bot 開起來(開 gateway)

設定都填好了,現在下這行指令,把剛剛講的那層 gateway 開起來:

```bash
hermes gateway
```

順利的話,你的 bot 幾秒鐘之內就會上線[^1]。

> **想讓它一直開著、不要一關電腦就斷?** 這裡先講清楚:`hermes gateway` 是「前景執行」的意思,也就是它會一直佔用你這個終端機視窗;你一旦把這個視窗關掉,bot 就跟著停了。
>
> 如果你希望它長時間掛在背景一直跑,要用一個叫 **tmux** 的小工具(它能讓程式在你關掉視窗後,還在背景繼續活著)。特別提醒:如果你用的是 WSL(在 Windows 裡跑 Linux 的那套東西),有個叫 systemd 的機制在這裡不太可靠,別依賴它。詳細做法看 [WSL2 教學](/install/wsl2/) 和 [Telegram 常見坑](/troubleshoot/telegram/)。

## 第五步:測測看成功了沒

打開 Telegram,傳一句話給你剛做好的 bot,例如「你好」。

**怎麼算成功**:它有回你話,就成功了。

**如果它沒反應**,先別緊張。去看一個紀錄檔:`~/.hermes/logs/gateway.log`。這個檔案是 gateway 的「日記本」,它啟動的時候會把連線狀況寫在這裡,可以幫你查問題[^1]。

沒回應,九成是這兩個原因其中一個:

- **忘了把自己加進允許名單** → 回到第三步再做一次
- **gateway 根本沒在跑** → 回到第四步把它開起來

## 想在「群組」裡用它?

如果你想把 bot 拉進一個 Telegram 群組、讓群裡的人都能用它,要多做兩個動作[^2]:

1. 回到 BotFather 的 bot 設定裡,**把「隱私模式」(privacy mode)關掉**。隱私模式開著的時候,bot 在群組裡只看得到「直接叫到它」的訊息,看不到一般聊天內容;關掉之後它才收得到群組裡的訊息。
2. 改完隱私設定後,把 bot 先從群組**移除,再重新加回去**一次(這樣新設定才會生效)。

這兩步只要漏做,bot 在群組裡就會收不到訊息、像個木頭人。

## 常見問題

### 為什麼指令選單裡的功能(skill)少了幾個?

Telegram 對「斜線指令」(就是打 `/` 開頭那種指令)有數量上限,最多 100 個,超過的部分會安靜地消失、不會報錯。這裡的 skill 就是 bot 能做的一項項功能。解法看 [Telegram 常見坑](/troubleshoot/telegram/)。

### 我從 OpenClaw 搬過來,授權名單要重設嗎?

官方的搬家工具會幫你把 `TELEGRAM_ALLOWED_USERS`(允許名單)一起搬過來;如果你搬家時多加一個 `--migrate-secrets` 選項,連 token(鑰匙)也會一起搬。不過搬完還是建議你自己再確認一次比較保險,詳見 [遷移指南](/migrate/migrate-from-openclaw/)。

### 可以同時接好幾個聊天平台嗎?

可以。Hermes 的 gateway 支援 20 多個訊息平台,Telegram 只是其中一個。你可以同時接好幾個。

### bot 上線了,但完全不回我?

九成的原因是「允許名單」。請確認你的數字 ID 有正確填進 `TELEGRAM_ALLOWED_USERS`,而且 gateway 確實有在跑。

## 接下來可以看什麼

- 想讓 gateway 一直掛著、或遇到斷線問題 → [Telegram 常見坑與解法](/troubleshoot/telegram/)
- WSL 使用者要怎麼讓它常駐 → [WSL2 完整教學](/install/wsl2/)
- 想讓 agent 用上外部工具 → [接上你的第一個 MCP](/integrations/connect-first-mcp/)

[^1]: Nous Research, Telegram：https://hermes-agent.nousresearch.com/docs/user-guide/messaging/telegram (2026-07-25 存取)。含 BotFather 建立流程、`hermes gateway setup`、`TELEGRAM_BOT_TOKEN` / `TELEGRAM_ALLOWED_USERS` 設定、預設拒絕所有人
[^2]: 同上,群組使用需在 BotFather 關閉 privacy mode,並於變更後將 bot 移除再重新加入群組
[^3]: 同上,以 @userinfobot 查詢數字使用者 ID;`hermes gateway` 啟動後連線紀錄寫入 `~/.hermes/logs/gateway.log`
