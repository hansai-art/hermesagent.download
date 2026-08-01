---
title: "打 hermes 卻說「找不到指令」?別急,三十秒解決"
description: "裝完 Hermes,一打 hermes 卻跳出「找不到指令」?十次有九次不是裝壞了,只是你這個視窗還沒「重新讀」一次設定。跟著做,三十秒就好。"
date: 2026-07-23
subcategory: "install"
hermes_version: ">=2026.5"
last_verified: 2026-07-04
human_reviewed: false
upstream_refs:
  - "https://hermes-agent.nousresearch.com/docs/reference/faq"
  - "https://hermes-agent.nousresearch.com/docs/getting-started/installation"
tags:
  - "install"
  - "troubleshoot"
status: "published"
---

安裝程式跑完了,畫面看起來一切正常。你很興奮地在終端機(就是那個黑黑的、要打字下指令的視窗)裡打了 `hermes`,結果冒出這一行:

```
zsh: command not found: hermes
```

意思是:「我不認得 hermes 這個指令。」

**先別急著重裝。** 十次有九次其實裝成功了。問題只是:你現在開著的這個視窗,還不知道電腦裡多了 `hermes` 這個東西。

## 為什麼會這樣

先解釋一個詞。PATH(讀作「趴斯」)是一份清單,上面寫著「電腦要去哪些資料夾裡找你叫的指令」。你打 `hermes`,電腦就照這份清單一個資料夾一個資料夾去翻,找到了才能執行。

安裝程式做了兩件事:

1. 把 `hermes` 這個程式檔放進 `~/.local/bin` 這個資料夾(`~` 代表你的家目錄,也就是你自己的個人資料夾)。
2. 把「這個資料夾」加進上面那份 PATH 清單裡,寫在你的 shell 設定檔中[^1]。(shell 就是那個接收你打字、幫你跑指令的程式;它的設定檔,就是它每次開場會先讀一遍的一張小抄。)

問題來了:**你現在開著的這個視窗,是在安裝「之前」就打開的。** 它開場時讀的那張小抄還是舊的,上面還沒有新加的那個資料夾。就像你改了通訊錄,但手機還沒重開、看到的還是舊資料。

所以解法很簡單:讓這個視窗「重讀一次小抄」,或乾脆「開一個新視窗」。

## 解法一:叫視窗重讀設定(最快)

打這行:

```bash
source ~/.zshrc
```

`source` 的意思就是「現在立刻把這張小抄重新讀一遍」。

補充一下:macOS 從 Catalina 這個版本開始,預設用的 shell 叫 zsh(讀作「Z shell」),它的小抄檔名就是 `.zshrc`。如果你用的是另一種常見的 shell 叫 bash,那小抄檔名不一樣,要改打:

```bash
source ~/.bashrc
```

**怎麼知道成功了?** 這行打下去,畫面「什麼都不會顯示」，沒消息就是好消息。接著打 `hermes doctor`,只要有東西跑出來(不再是「找不到指令」),就成功了。

## 解法二:直接開一個新的終端機視窗

懶得記指令的話,這招最無腦:關掉現在的視窗,重新開一個。

新視窗一開場就會去讀那張小抄,而小抄早就更新好了,所以它自動就認得 `hermes`[^1]。

一個小提醒:如果你是用 VS Code 或其他程式編輯器裡「內建」的終端機,光關掉終端機分頁可能不夠,要**把整個編輯器完全關掉再打開**才會生效。

## 兩招都試了還是不行?來看看清單裡有沒有那個資料夾

打這行,看看 PATH 清單裡到底有沒有那段路徑:

```bash
echo $PATH | tr ':' '\n' | grep local
```

(這行在做的事:把 PATH 清單攤開成一行一個,然後只挑出含有 local 字樣的那幾行給你看。)

**正常的話**:你會看到一行裡面有 `/.local/bin`,例如 `/Users/yourname/.local/bin`。看到了就代表清單沒問題。

**如果什麼都沒印出來**:代表安裝程式當初沒能成功把那個資料夾寫進你的小抄。沒關係,手動補上就好:

```bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

第一行是「把那段路徑加進小抄」,第二行是「立刻重讀小抄」。

(如果你用的是 bash,把上面兩個 `.zshrc` 都換成 `.bashrc`。)

## 清單沒問題,還是找不到?那來確認程式檔本身在不在

有時候清單對了,程式檔卻根本不在那裡。直接去看看檔案存不存在:

```bash
ls -l ~/.local/bin/hermes
```

`ls` 是「列出檔案」的意思。

**正常的話**:會印出一行檔案的資訊(檔名、大小之類的)。

**如果印出的是 `No such file or directory`**(意思是「沒有這個檔案或資料夾」):那這次才是真的安裝沒成功。把安裝指令重跑一遍,而且這次要盯著過程看，有沒有紅色的錯誤訊息跑出來,那才是真正卡住的原因。

## 一次全部幫你檢查

```bash
hermes doctor
```

這是官方內建的「健檢」指令(doctor 就是醫生的意思)。它會一項一項幫你檢查:該裝的東西有沒有裝、該設的有沒有設,再告訴你哪裡不對[^2]。不知道從哪查起的時候,先打這個準沒錯。

## 常見問題

### 我用的是 fish 或別種 shell,怎麼辦?

Hermes 預設只會去讀 `~/.bashrc` 這張小抄。如果你用的是別種 shell(例如 fish),它有自己的小抄檔,Hermes 不會自動知道。你要在 `config.yaml`(Hermes 的設定檔)裡的 `terminal.shell_init_files` 這一項,把你自己那張小抄的檔名加進去[^1]。

### 桌面版(有畫面的那種 App)也會遇到這問題嗎?

不會。桌面版是有視窗、可以用滑鼠點的圖形介面程式,它啟動的時候根本不看 PATH 那份清單,所以不會有這問題。但如果你想「從終端機打字」去叫它,那還是得照上面的步驟把 PATH 弄好。

### 是不是每次開新視窗都要 `source` 一次?

不用。`source` 只是為了救「現在這個」已經開著、還沒更新的舊視窗。小抄本身早就改好了,以後你新開的每一個視窗,開場都會自動讀到新的,不必再手動 source。

## 下一步

- 裝好之後要挑模型、設定 API key(存取金鑰,等於讓 Hermes 有權限去用 AI 服務的一組密碼) → [模型供應商與 API key 設定](/config/model-provider/)
- 遇到別的錯誤 → [疑難排解總覽](/troubleshoot/overview/)

[^1]: Nous Research, FAQ:https://hermes-agent.nousresearch.com/docs/reference/faq (2026-07-23 存取)
[^2]: Nous Research, Installation:https://hermes-agent.nousresearch.com/docs/getting-started/installation