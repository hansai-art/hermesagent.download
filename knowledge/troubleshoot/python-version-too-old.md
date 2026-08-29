---
title: "看到「Hermes requires Python 3.11 or newer」怎麼辦"
description: "這行錯誤通常代表你沒用官方的安裝方式。這裡有三種修法,還會告訴你為什麼有些人不會遇到。"
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

```text
Hermes requires Python 3.11 or newer
```

這行英文的意思是:「Hermes 需要 Python 3.11 或更新的版本」。

先說明一個名詞。Python 是一種程式語言,Hermes 是用它寫成的,所以你的電腦上必須裝有夠新的 Python,Hermes 才跑得動。Python 每隔一段時間會出新版本,版本號愈大代表愈新,例如 3.10 比 3.11 舊。

看到這行錯誤,先問自己一個問題:**你是不是自己動手裝的?** 比如自己用 pip(Python 內建的套件安裝工具)去裝,或是在一台比較舊的電腦上手動裝的?

會這樣問,是因為官方提供了一個「一行指令就裝好」的安裝腳本(腳本就是一串預先寫好的指令,你貼上去執行,它會自動幫你做完一連串安裝步驟),而這個腳本會自動幫你裝好 Python 3.11[^1]。所以會撞到這個錯,通常代表你當初沒走這條官方的路,或是你的電腦裡同時裝了好幾個 Python 版本,它們在互相打架。

## 第一步:先看看你現在裝的是幾版

打開終端機(終端機就是一個讓你打字下指令的黑底視窗,英文叫 terminal),輸入這行:

```bash
python3 --version
```

**你會看到什麼**:一行像 `Python 3.12.3` 這樣的字。前面的數字就是版本號。

如果它顯示的是 3.10 或更小的數字,那你就找到問題了，版本太舊。接下來從下面三種解法挑一種來修。看不太懂的話,直接用「解法一」最省事。

## 解法一:重跑官方安裝腳本(最省事,推薦新手用這個)

官方的安裝腳本本來就會自動處理 Python 版本[^1]。與其自己跟電腦裡的舊 Python 搏鬥,不如讓它幫你搞定。

在終端機貼上這行,然後按 Enter:

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

如果你用的是 Windows,請改用 PowerShell(PowerShell 是 Windows 內建的一個終端機程式,你可以在開始選單搜尋「PowerShell」把它打開),貼上這行:

```powershell
iex (irm https://hermes-agent.nousresearch.com/install.ps1)
```

跑完之後,它應該就把合適版本的 Python 準備好了。

## 解法二:把電腦裡的 Python 升級到新版

如果你有自己的理由,想要自己管理電腦上的 Python(比如你是開發者,習慣手動控制),可以用下面的方式升級。請照你的作業系統選一組指令。

**Ubuntu / Debian**(這是兩種常見的 Linux 系統)

```bash
sudo apt update && sudo apt install -y python3.12
```

**macOS(Homebrew)**(Homebrew 是 Mac 上常用的軟體安裝工具,英文常簡稱 brew)

```bash
brew install python@3.12
```

裝完後,再確認一次版本:

```bash
python3 --version
```

**你會看到什麼**:一行 `Python 3.12.x`(最後的 x 是小版本號,是什麼數字都可以)。

> ⚠️ **注意**:在某些電腦上,就算你裝了新版 Python,`python3` 這個指令不一定會自動指向新版,系統可能還是繼續用舊的那個。
> 如果你裝完發現版本沒變,就需要調整 PATH(PATH 是一份清單,告訴電腦該去哪裡找程式來執行),或是用 `update-alternatives` 這個工具來切換(這是 Debian 這類系統上的做法)。
>
> 📝 **待補**:各種系統要怎麼把預設的 Python 版本切成新版,詳細做法我們還沒整理完整。
> [歡迎補上](https://github.com/hansai-art/hermesagent.download/edit/main/knowledge/troubleshoot/python-version-too-old.md)。

## 解法三:少了 uv 這個工具

Hermes 是靠一個叫 uv 的工具來管理 Python 環境的(你可以把 uv 想成一個幫你打理 Python 的小管家,負責裝套件、隔離環境)。如果你看到的錯誤訊息裡提到了 uv,那可能就是因為你電腦上還沒裝 uv。

在終端機貼上這行來裝它:

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

這是 uv 官方提供的安裝指令(astral.sh 是 uv 的官方網站網址,看到這個網域就對了,不用擔心)。

## 怎麼確認已經修好了

不管你用哪一種解法,最後都跑這行來檢查:

```bash
hermes doctor
```

這是 Hermes 官方的「健康檢查」指令(doctor 就是醫生的意思,它會幫你把環境從頭到尾檢查一遍),包含 Python 版本在內的各種相依項目它都會檢查[^2]。如果它沒再報 Python 版本的問題,就代表你修好了。

## 常見問題

### 為什麼有些人裝的時候就不會遇到這個錯?

因為他們走的是官方那條「一行指令」的路。那個安裝腳本會自動幫你裝好 Python 3.11,而且會把 Hermes 放進一個獨立的環境裡(隔離環境的意思是:它自己用自己的一份 Python,不去動你電腦原本的那份)[^1]。反過來說,自己用 pip 裝、或是在一台裝了好幾個 Python 版本的電腦上手動裝,就比較容易撞到版本不合的問題。

### 我不想動到電腦原本的 Python,會不會影響我其他的專案?

只要你走官方安裝腳本就不會。它會用 uv 幫 Hermes 建立一個獨立的環境,不會去替換或改動你電腦本來的那份 Python,所以你其他的專案不受影響。

### 升級 Python 會不會把系統搞壞?

在 Ubuntu / Debian 上,單純**安裝**一個新版本(也就是 `apt install python3.12`)是安全的,系統會把舊版本留著,不會刪掉。真正有風險的動作,是把系統預設的 `python3` 改成指向新版,因為某些系統內建的工具是綁定特定 Python 版本在運作的,一改可能會出問題。所以如果你會擔心,優先選解法一,最保險。

## 下一步

- 裝好了,接下來要設定模型 → [模型供應商與 API key 設定](/config/model-provider/)
- 遇到的是別的錯誤 → [疑難排解總覽](/troubleshoot/overview/)

[^1]: Nous Research, FAQ:https://hermes-agent.nousresearch.com/docs/reference/faq (2026-07-23 存取)
[^2]: Nous Research, Installation:https://hermes-agent.nousresearch.com/docs/getting-started/installation
