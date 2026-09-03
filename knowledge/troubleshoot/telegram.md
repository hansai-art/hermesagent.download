---
title: "Telegram 接 Hermes Agent 常遇到的兩個問題"
description: "指令選單裡少了幾個功能、gateway(讓 bot 收發訊息的那一層)跑一跑自己斷線:這兩件事都不是你設錯,有原因也有解法。"
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

先講一下這篇在幹嘛。Hermes Agent 是一個會幫你做事的程式(俗稱 agent,你交代任務、它去執行)。很多人喜歡把它接到 Telegram 這個聊天軟體上。這樣做的好處是:你人在外面,用手機隨手打一句話丟給它,它在遠端的電腦上做完事情,再回訊息告訴你結果。很方便。

但接上去之後,有兩件事很容易讓你以為是自己設定錯了:

1. **指令選單裡莫名少了幾個功能**。
2. **gateway 跑一跑就自己斷線了**。

這裡先解釋一個詞:gateway(閘道,就是讓你的 bot 能在 Telegram 上收發訊息的那一層程式)。你可以把它想成 bot 的「接線生」,訊息進出都要經過它。

好消息是:上面這兩件事**都不是你的錯**,而且都有很明確的解法。下面一個一個帶你處理。

## 問題一:Telegram 最多只給 100 個斜線指令

先解釋一下「斜線指令」。在 Telegram 裡,你打一個斜線 `/` 就會跳出一排功能選單,那些以斜線開頭的就叫斜線指令(例如 `/start`)。

Hermes 裡的每個 skill(技能,就是 agent 會的一項本事)接到 Telegram 後,都會變成一個斜線指令。問題來了:Telegram 這個平台規定,一個 bot **最多只能有 100 個斜線指令**。你的 skill 一多,超過 100 個的那些,Telegram **不會跳出任何錯誤訊息,就是安靜地讓它們不出現**[^1]。

所以你會遇到這種怪事:某個 skill 在電腦的終端機(terminal,就是那個黑黑的、可以打指令的視窗)裡明明好好的,一到 Telegram 就找不到。不是壞了,是被擠掉了。

**怎麼解決**:打開設定檔,把這個平台根本用不到的 skill 關掉,把名額讓出來。

設定檔在這個位置:`~/.hermes/config.yaml`。這是一個 YAML 檔(一種給人看、也給程式讀的設定檔格式,靠縮排來分層次)。打開它,加上這幾行[^1]:

```yaml
skills:
  platform_disabled:
    telegram: [skill-a, skill-b]
```

上面的 `skill-a`、`skill-b` 換成你想關掉的 skill 名字就好。

改完之後,**一定要重新啟動 gateway**,新設定才會生效。(改了設定不重啟,等於白改。)

**怎麼確認成功了**:重啟後,回到 Telegram 打一個 `/`,原本不見的那些指令,應該就乖乖回到選單裡了。

**該關掉哪些才好**:挑那些「在手機上根本不會用」的。像是會吐出一大堆文字、需要編輯檔案、需要你來回操作好幾步的 skill,這些留在電腦終端機用比較順手,就別占用 Telegram 的名額了。

## 問題二:gateway 一直自己斷線(用 WSL 的人請看)

這一段是給用 WSL 的人看的。WSL 是「Windows 裡面跑 Linux」的一套東西(讓你在 Windows 電腦上,像用 Linux 一樣操作)。

如果你在 WSL 裡跑 gateway,而它每次跑一陣子就沒反應、沒動靜了,原因很可能出在 **systemd 在 WSL 環境裡不太可靠**[^1]。(systemd 是 Linux 上一個負責「在背景幫你把程式一直開著」的管家程式。)

這個坑最討厭的地方是:它會騙你。你照著一般 Linux 教學,把 systemd 設好,叫它幫你顧著 gateway,你打 `systemctl status` 去看狀態,畫面上顯示一切正常。但實際上,只要 WSL 重開一次,這個管家就默默消失了,gateway 也跟著沒了。

**怎麼解決**:別再靠 systemd 了。改用下面兩種方式之一,讓 gateway 自己一直開著。

一種是「前景模式」,就是直接開一個視窗讓它跑著。另一種更推薦,用 tmux。tmux 是一個小工具,它能幫你開一個「不會因為你關掉視窗就跟著關掉」的常駐工作區。指令長這樣:

```bash
tmux new -s hermes 'hermes gateway run'
```

**怎麼確認成功了**:把現在這個終端機視窗整個關掉,再重新開一個,打 `tmux ls`。如果還看得到那個叫 `hermes` 的 session(工作區),就代表它真的在背景活著,成功了。

想回到那個工作區看看它在做什麼,打這個:

```bash
tmux attach -t hermes
```

看完想離開、但**不要**把它關掉:先按 `Ctrl+B`,放開,再按 `D`。這樣就會退出來,而 gateway 繼續在背景跑。

⚠️ 提醒一件事:如果你把 WSL 整個關掉,或是電腦重開機,那 tmux 的工作區還是會消失(這是正常的,它撐不過關機)。如果你想要「電腦一開機、gateway 就自動啟動」,那要另外去 Windows 的「工作排程器」設定。詳細做法看這篇 [WSL2 安裝教學](/install/wsl2/)。

## 如果不只你一個人用,一定要設授權

如果你的 bot 只有你自己用,這段可以先跳過。但只要有第二個人會用,或是 bot 有可能被別人找到,那你**一定要**設授權。

原因很直接:不設的話,任何人只要找到你的 bot,就能對你的 agent 下指令、叫它做事。等於你家門沒鎖。

官方的訊息閘道支援兩種把關方式:allowlist(白名單,就是一份「只有這些人能用」的名單),還有 DM 配對(用私訊來確認身分)。這些都在 `config.yaml` 裡 gateway 那一段設定授權模式。

> 📝 **這一段還缺一個具體範例**:allowlist 到底要怎麼寫、YAML 長什麼樣,我們還沒整理好。
> 如果你設定過,[歡迎幫忙補上](https://github.com/hansai-art/hermesagent.download/edit/main/knowledge/troubleshoot/telegram.md):
> 這牽涉到安全,值得寫清楚一點。

## 常見問題

### 我從 OpenClaw 搬過來,允許名單要重設嗎?

不用從頭設。官方的遷移指令(幫你把舊系統的設定搬到新系統的工具)會自動把 `TELEGRAM_ALLOWED_USERS` 這類相容的設定一起搬過來。如果你在指令後面加上 `--migrate-secrets`,連 `TELEGRAM_BOT_TOKEN`(你的 bot 的通行密碼)也會一起搬。話雖如此,搬完還是建議你自己再確認一次,比較安心。做法看 [OpenClaw 遷移指南](/migrate/migrate-from-openclaw/)。

### 我改了指令選單,但看起來沒變?

有兩個常見原因。一是 gateway 沒重啟(改設定一定要重啟才算數)。二是 Telegram 這個 App 自己把舊選單記住了(俗稱快取,就是它偷懶沿用舊資料)。處理順序:先重啟 gateway,再把 Telegram 裡那個對話關掉、重新打開一次。

### 我沒有用 WSL,也會斷線,為什麼?

那就不是上面講的那個原因了。這時候先去看 gateway 的執行紀錄(log,就是程式一邊跑一邊留下的紀錄,出事通常能從裡面找到線索)。可能是網路不穩,或是 token(通行密碼)有問題。

> 📝 **這裡待補**:gateway 的執行紀錄到底要去哪裡看,我們還沒整理好,歡迎補充。

## 下一步

- 想把 WSL2 完整設定好 → [WSL2 安裝教學](/install/wsl2/)
- 從 OpenClaw 搬過來 → [遷移指南](/migrate/migrate-from-openclaw/)
- 其他卡關 → [疑難排解總覽](/troubleshoot/overview/)

[^1]: Nous Research, FAQ:https://hermes-agent.nousresearch.com/docs/reference/faq (2026-07-23 存取)