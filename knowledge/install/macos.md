---
title: "第一次在 Mac 上安裝 Hermes Agent"
description: "兩種裝法:桌面版點兩下就好,或用一行指令裝命令列版。每一步都告訴你「怎麼知道成功了」,卡住時也知道要查哪裡。"
date: 2026-07-23
subcategory: "macos"
hermes_version: ">=2026.5"
last_verified: 2026-07-04
human_reviewed: false
upstream_refs:
  - "https://hermes-agent.nousresearch.com/docs/getting-started/installation"
  - "https://hermes-agent.nousresearch.com/docs/reference/faq"
tags:
  - "macos"
  - "install"
status: "published"
---

你在官網看到 Hermes Agent,想裝來玩玩看。結果一打開才發現:有桌面版、有指令版,還有一長串看不懂的「相依套件」(就是這個軟體要靠別的軟體才能跑,那些別的軟體就叫相依套件)。別慌。這篇會告訴你該選哪一種,而且每做完一步,都會告訴你「怎麼確認自己做對了」。

**先給你結論**:如果你只是想用它、不想碰終端機,就下載桌面版。如果你想把它接進終端機(那個黑黑的、要打字下指令的視窗)、之後還想跑一些自動化,就用指令版。兩種可以同時裝,不會打架。

## 路線一:桌面版(最簡單)

到 [官方下載頁](https://hermes-agent.nousresearch.com/) 下載 macOS 的安裝檔,然後點兩下打開它,照畫面指示裝好[^1]。

好消息:安裝程式會自己把需要的東西全部裝好(uv、Python 3.11、Node.js v22、ripgrep、ffmpeg 這幾個工具)。這些名字你現在不用懂,重點是**你什麼都不用先準備**[^1]。

**怎麼知道成功了**:應用程式能打開,而且進到一個可以開始跟它對話的畫面。

接著請直接跳到下面的「設定模型供應商」那一段。因為還沒設定模型之前,它其實還不能用。

## 路線二:指令版(一行指令搞定)

這條路你會在終端機裡打字。不會很難,跟著做就好。

### 第一步:先確認電腦裡有 Git

安裝腳本(就是一個會自動幫你做事的小程式)幾乎所有東西都會自己裝好,只有 Git 這個工具需要你先有[^1]。Git 是一個很常見的程式設計工具,很多 Mac 本來就有。先來檢查一下。

在終端機裡打這行,然後按 Enter:

```bash
git --version
```

**你應該會看到**:一串版本文字,長得像 `git version 2.39.5 (Apple Git-154)`。看到就代表有 Git,可以往下走。

如果它顯示 `command not found`(意思是「找不到這個指令」),macOS 通常會自己跳出一個小視窗,問你要不要安裝 Xcode Command Line Tools。按下去照著裝就好。或者你也可以自己打這行來裝:`xcode-select --install`。

### 第二步:執行官方的安裝指令

在終端機打這一整行(可以直接複製貼上),然後按 Enter:

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

這行做的事是:上網把官方的安裝腳本抓下來,然後馬上執行它[^1]。它會幫你裝好 uv、Python 3.11、Node.js v22、ripgrep、ffmpeg,並且把 `hermes` 這個指令放進 `~/.local/bin` 這個資料夾。整個東西預設會裝在 `~/.hermes/hermes-agent/`。(路徑裡的 `~` 代表你自己的家目錄,也就是你的使用者資料夾。)

> **看到 `curl | bash` 覺得直接執行有點怕怕的?** 這很正常。這確實是官方提供的裝法、也是官方的網址,但如果你想先看過內容再跑,可以改用下面三行:第一行把腳本存成檔案,第二行打開來看,第三行才真的執行:
>
> ```bash
> curl -fsSL https://hermes-agent.nousresearch.com/install.sh -o install.sh
> less install.sh
> bash install.sh
> ```

### 第三步:重新載入 shell(最多人卡在這一步)

先解釋一下:shell 就是你現在打字的那個終端機環境。安裝腳本已經把 `~/.local/bin` 這個資料夾加進了 PATH(PATH 是一份清單,告訴電腦「要去哪些資料夾找指令」)。問題是,**你現在開著的這個終端機視窗,還不知道清單被改過了**。

所以你裝完馬上打 `hermes`,它會說找不到指令。**這不是安裝失敗**,只是這個視窗還沒更新而已。

解決辦法很簡單,打這行讓它重新讀一次設定:

```bash
source ~/.zshrc
```

補充:從 macOS Catalina 這個版本開始,Mac 預設用的 shell 叫 zsh,所以上面用的是 `~/.zshrc`。如果你用的是 bash(比較舊的另一種 shell),就改打 `source ~/.bashrc`。

還有一個更懶的辦法:**直接關掉終端機,再開一個新的視窗**。新視窗打開時會自動讀到更新後的清單,一樣有效[^2]。

### 第四步:確認真的裝好了

打這行:

```bash
hermes doctor
```

這是官方內建的「健康檢查」指令[^1](doctor 就是醫生的意思,它會幫你的環境做健康檢查)。它會一項一項檢查那些相依套件有沒有裝好。如果哪一項出問題,它會給你提示,照著提示處理就好。

**先給你打個預防針**:第一次跑,你會看到一整排黃色的 ⚠ 警告符號。別緊張。這些大多是在說「你還沒設定這個」,而不是「這個壞掉了」。想看實際跑出來長什麼樣、那 16 個檢查區塊各自在檢查什麼、以及怎麼分辨「真的有問題」跟「只是還沒設定」,可以看 [hermes doctor 到底在檢查什麼](/troubleshoot/hermes-doctor/)(這篇有 macOS 的實測)。

## 設定模型供應商

裝好之後還不能馬上用。你得先告訴它:要用哪一個 AI 模型來回答你。模型供應商就是提供這些 AI 模型的公司(例如你要用哪家的模型、拿哪把鑰匙去用)。

打這行:

```bash
hermes model
```

它會跳出一個互動式選單(就是用鍵盤上下選、按 Enter 確認的那種)。你在裡面選一個供應商,再填入 API key[^1]。API key 你可以想成一把「鑰匙」,是那家公司發給你、用來證明「這次是你在用」的一串密碼。

或者更快的辦法,用官方的 Portal(入口網頁)一次設定好:

```bash
hermes setup --portal
```

想比較各家供應商的差別、怎麼設定比較省錢、或想接自己電腦上跑的本地模型,可以看[模型供應商與 API key 設定](/config/model-provider/)。

## 開始使用

一切就緒,打這行:

```bash
hermes
```

只要進到對話畫面,就代表你成功了。恭喜!

## 常見問題

### 打 `hermes` 卻說 command not found?

十次有九次,是因為 shell 還沒重新載入,不是安裝失敗。打 `source ~/.zshrc`,或乾脆開一個新的終端機視窗就好。想看更完整的解釋,見 [command not found 怎麼解](/troubleshoot/command-not-found/)。

### 我需要自己先裝 Python 嗎?

不用。官方安裝程式會幫你把 Python 3.11、Node.js v22、ripgrep、ffmpeg 全部處理好[^1]。

### 桌面版和指令版可以同時裝嗎?

可以。這兩個是各自獨立安裝的,不會互相干擾。

### 它到底裝在哪個資料夾?

程式本身預設裝在 `~/.hermes/hermes-agent/`,設定檔則放在 `~/.hermes/`。

## 下一步

- 設定模型跟 API key → [模型供應商設定](/config/model-provider/)
- 想從 OpenClaw 搬過來 → [遷移指南](/migrate/migrate-from-openclaw/)
- 想先搞懂它到底是什麼 → [什麼是 Hermes Agent](/concepts/什麼是-hermes-agent/)

[^1]: Nous Research, Installation:https://hermes-agent.nousresearch.com/docs/getting-started/installation (2026-07-23 存取)
[^2]: 同上,FAQ:安裝程式會把 `~/.local/bin` 加進 PATH,新開的 shell 會自動載入:https://hermes-agent.nousresearch.com/docs/reference/faq