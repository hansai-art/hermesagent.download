---
title: "在 macOS 上安裝 Hermes Agent"
description: "兩條路:桌面版安裝檔點兩下,或一行指令裝命令列版。每一步都有成功判準,卡住時知道該檢查什麼。"
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

你在官網看到 Hermes Agent,想裝來試試,結果發現有桌面版、有指令版,還有一串看不懂的相依套件。這篇告訴你該選哪一條,以及每一步怎麼確認自己做對了。

**先講結論**:只是想用,下載桌面版。想接進終端機工作流、之後要跑自動化,用指令版。兩者可以並存。

## 路線一:桌面版

到 [官方下載頁](https://hermes-agent.nousresearch.com/) 下載 macOS 安裝檔,點兩下安裝[^1]。

安裝程式會自己處理所有相依套件(uv、Python 3.11、Node.js v22、ripgrep、ffmpeg),你不需要先裝任何東西[^1]。

**怎麼確認成功**:應用程式能開啟,並進入可以開始對話的畫面。

接著跳到下面的「設定模型供應商」——沒設定模型的話還不能用。

## 路線二:指令版(一行安裝)

### 先確認 Git 存在

安裝腳本會自己裝其他東西,但 Git 需要你先有[^1]:

```bash
git --version
```

**預期輸出**:類似 `git version 2.39.5 (Apple Git-154)` 的版本字串。

如果顯示 `command not found`,macOS 會跳視窗要你安裝 Xcode Command Line Tools,照著裝即可,或自己跑 `xcode-select --install`。

### 執行官方安裝指令

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

這行會下載並執行官方安裝腳本[^1]。它會裝好 uv、Python 3.11、Node.js v22、ripgrep、ffmpeg,並把 `hermes` 指令放進 `~/.local/bin`。預設安裝位置是 `~/.hermes/hermes-agent/`。

> **不放心直接執行 `curl | bash`?** 這是官方提供的安裝方式、官方網域,但你也可以先看過再跑:
>
> ```bash
> curl -fsSL https://hermes-agent.nousresearch.com/install.sh -o install.sh
> less install.sh
> bash install.sh
> ```

### 重新載入 shell(最多人卡在這)

安裝腳本把 `~/.local/bin` 加進了 PATH,但**你現在這個終端機視窗還不知道這件事**。所以裝完直接打 `hermes` 會說找不到指令——這不是安裝失敗。

```bash
source ~/.zshrc
```

macOS 從 Catalina 起預設是 zsh;如果你用 bash 就改成 `source ~/.bashrc`。或者最簡單:**開一個新的終端機視窗**,新視窗會自動載入更新後的 PATH[^2]。

### 確認裝好了

```bash
hermes doctor
```

這是官方的環境診斷指令[^1],會逐項檢查相依套件。有項目報錯時,照它給的提示處理。

> 📝 **這一段還缺實際輸出**:`hermes doctor` 跑起來長什麼樣、每一項檢查叫什麼名字,
> 我們手上沒有實機畫面可以貼。如果你剛跑過,
> [幫我們補上](https://github.com/hansai-art/hermesagent.download/edit/main/knowledge/install/macos.md)——
> 這種「我剛好跑過」的補充,正是這個站最需要的貢獻。

## 設定模型供應商

裝好還不能用,要先告訴它用哪個模型:

```bash
hermes model
```

會進入互動式選單,選供應商並填 API key[^1]。或者用官方 Portal 一步到位:

```bash
hermes setup --portal
```

供應商比較、省錢設定、本地模型接法,見[模型供應商與 API key 設定](/config/model-provider/)。

## 開始使用

```bash
hermes
```

進入對話介面就成功了。

## 常見問題

### 打 `hermes` 說 command not found?

九成是 shell 沒重新載入,不是安裝失敗。跑 `source ~/.zshrc` 或開新視窗。詳解見 [command not found 怎麼解](/troubleshoot/command-not-found/)。

### 需要自己先裝 Python 嗎?

不用。官方安裝程式會處理 Python 3.11、Node.js v22、ripgrep、ffmpeg[^1]。

### 桌面版和指令版可以同時裝嗎?

可以,兩者是獨立安裝。

### 裝在哪個目錄?

預設在 `~/.hermes/hermes-agent/`,設定檔在 `~/.hermes/`。

## 下一步

- 設定模型與 API key → [模型供應商設定](/config/model-provider/)
- 從 OpenClaw 搬過來 → [遷移指南](/migrate/migrate-from-openclaw/)
- 想先搞懂它是什麼 → [什麼是 Hermes Agent](/concepts/什麼是-hermes-agent/)

[^1]: Nous Research, Installation — https://hermes-agent.nousresearch.com/docs/getting-started/installation(2026-07-23 存取)
[^2]: 同上,FAQ:安裝程式會把 `~/.local/bin` 加進 PATH,新開的 shell 會自動載入 — https://hermes-agent.nousresearch.com/docs/reference/faq
