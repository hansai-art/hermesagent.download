---
title: '在 Windows 上安裝 Hermes Agent(新手手把手版)'
description: 'Windows 上有三種安裝方法。這篇幫你挑一個最適合的,每一步都告訴你「怎麼看出成功了」。挑錯了要重來很麻煩,所以先看這篇。'
date: 2026-07-23
subcategory: 'windows'
hermes_version: '>=2026.5'
last_verified: 2026-07-04
human_reviewed: false
upstream_refs:
  - 'https://hermes-agent.nousresearch.com/docs/getting-started/installation'
  - 'https://hermes-agent.nousresearch.com/docs/reference/faq'
tags:
  - 'windows'
  - 'install'
status: 'published'
---

Hermes Agent 是一個可以幫你做事的 AI 助手程式。在 Windows 上,它有三種安裝方法。

先講最重要的一件事:**這三種方法挑錯了,之後要換很麻煩。** 特別是等你已經設定好模型、聊了一陣子、累積了一些對話紀錄,才發現當初挑錯了，那時候重來會很痛。所以請先花一分鐘,照下面的表挑對。

## 第一步:先挑一種方法

先看看你是哪一種人,再對照右邊該用哪種方法。

| 你的情況                                          | 建議用哪種                                            |
| ------------------------------------------------- | ----------------------------------------------------- |
| 我只想用,平常很少打指令                           | **桌面版**:下載一個安裝檔,點兩下就好,什麼都自動幫你裝 |
| 我想在 PowerShell 裡用,但不想額外裝 Linux         | **原生 PowerShell**                                   |
| 我會寫腳本、要串自動化流程、需要完整的 Linux 工具 | **WSL2**                                              |

補充幾個名詞,第一次看到別緊張:

- **終端機 / 指令**:就是那種黑黑的、要你打字下命令的視窗,不是用滑鼠點的。
- **PowerShell**:Windows 內建的一種終端機視窗,待會會用到。
- **WSL2**(Windows Subsystem for Linux,就是在 Windows 裡面跑一個 Linux 系統的功能):給進階使用者用的,可以在 Windows 裡直接用 Linux 的各種工具。

**還是不確定選哪個?** 那就**先選桌面版**。以後真的需要,再裝 WSL2 版也不遲，兩個可以同時存在,不會打架。

## 方法一:桌面版(最簡單)

到 [官方下載頁](https://hermes-agent.nousresearch.com/) 下載 Windows 的安裝檔,然後點兩下,照畫面指示裝完就好[^1]。

你不用先自己準備任何東西。安裝程式會自動幫你把需要的配套軟體全部裝好(uv、Python 3.11、Node.js v22、ripgrep、ffmpeg 這幾個,名字看不懂沒關係,它自己處理)[^1]。

**怎麼看出成功了**:程式能打開,而且進到可以跟它對話的畫面。到這裡就成功了,直接跳到下面的「告訴它要用哪個 AI 模型」那一段。

## 方法二:原生 PowerShell

先打開 **PowerShell**(注意:是 PowerShell,不是 CMD,兩個長得像但不一樣)。

打開後,把下面這行貼進去、按 Enter 執行,這是官方提供的安裝指令:

```powershell
iex (irm https://hermes-agent.nousresearch.com/install.ps1)
```

這行在做什麼?拆開來看:`irm` 負責從網路上把官方的安裝腳本下載下來,`iex` 負責把它跑起來[^1]。

> **不放心直接執行一段從網路抓來的東西?** 可以先下載下來、自己看過內容再跑:
>
> ```powershell
> irm https://hermes-agent.nousresearch.com/install.ps1 -OutFile install.ps1
> notepad install.ps1
> .\install.ps1
> ```
>
> 第一行把腳本存成檔案,第二行用記事本打開讓你看,第三行才真的執行它。

**如果 PowerShell 把腳本擋下來了**(畫面跳出跟「執行原則(execution policy)」有關的錯誤),別擔心,那不是壞掉,是 Windows 的一個安全設定在把關。你可以只針對「現在這個視窗」放行:

```powershell
Set-ExecutionPolicy -Scope Process -Bypass
```

這行只影響你現在開著的這個視窗,關掉視窗就恢復原狀了,不會永久把整台電腦的安全性調低。放行後再跑一次上面的安裝指令即可。

### 裝完後,一定要把 PowerShell 關掉重開

安裝程式改了一個叫 PATH 的設定(PATH 就是一份清單,告訴電腦「可以直接打名字執行的程式放在哪裡」)。問題是,**你現在開著的這個視窗還不知道清單被改過了。**

所以請把 PowerShell 整個關掉,再重新開一個新的視窗,然後打:

```powershell
hermes doctor
```

`hermes doctor` 是官方內建的「健康檢查」指令,會幫你檢查有沒有裝好[^1]。如果它報告某個項目有問題,就照它給的提示去處理。

> 📝 **這一段還缺實際畫面**:Windows 上跑 `hermes doctor` 到底會顯示什麼,我們手上還沒有實際截圖。
> 如果你剛好跑過,歡迎[幫我們補上](https://github.com/hansai-art/hermesagent.download/edit/main/knowledge/install/windows.md)。

## 方法三:WSL2

如果你選 WSL2,安裝方式跟在 Linux 上完全一樣。下面是 Hermes 官方網域的安裝腳本：它會下載並執行安裝流程。在 WSL2 的 Linux 視窗裡,貼上這行執行:

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

**特別注意**:這行一定要在 **WSL2 的視窗裡**打,不是在 PowerShell 裡打。PowerShell 和 WSL2 是兩個不一樣的環境,把它們搞混是這個方法最常見的錯誤。

WSL2 的完整教學(包括 WSL2 本身怎麼裝、檔案要放哪個資料夾、常遇到的權限問題怎麼解)請看 [WSL2 完整安裝教學](/install/wsl2/)。

## 告訴它要用哪個 AI 模型

不管你用上面哪一種方法裝完,接下來這步都一樣:得先告訴 Hermes 要用哪個 AI 模型,它才能開始幫你做事。

```bash
hermes model
```

打完這行會跳出一個選單,讓你用鍵盤上下選。你在裡面挑一家模型供應商,然後把它的 API key 貼進去[^1]。(API key 就是那家服務發給你的一組密碼,用來證明「這是你在用、算你的帳」。)

或者,你也可以用官方的 Portal(入口網頁),一次幫你設好:

```bash
hermes setup --portal
```

更詳細的說明看 [模型供應商與 API key 設定](/config/model-provider/)。

## 開始用

設定好模型之後,打這一行就開始了:

```bash
hermes
```

## 完成判準

不管選哪一種方法，完成設定後在你安裝的同一個環境執行 `hermes`。**成功的話**會進入可輸入訊息的 Hermes 對話介面，而不是出現「找不到指令」或要求重新安裝的錯誤。若仍無法進入，先跑 `hermes doctor`，再依它列出的具體項目處理。

## 常見問題

### 我在 PowerShell 打 hermes,它說找不到這個指令?

多半是因為你還沒把視窗關掉重開。安裝程式改了設定,但舊視窗不知道。把 PowerShell 關掉、重開一個新的再試。更詳細的解法看 [command not found 怎麼解](/troubleshoot/command-not-found/)。

### 我是用 WSL2 裝的,為什麼 PowerShell 裡找不到?

這是正常的,不是壞掉。WSL2 和 Windows 是兩個各自獨立的環境,你在 WSL2 裡裝的東西,只存在於 WSL2 裡面。如果你想在 PowerShell 裡也能用,那就得另外再用「原生 PowerShell」的方法裝一次。

### 三種方法可以同時裝嗎?

可以,它們彼此獨立,不會打架。但要注意:**設定和對話紀錄不會互通。** 比如你在桌面版聊的內容,不會出現在 WSL2 版裡。

### 我該用 CMD 還是 PowerShell?

用 PowerShell。上面那行官方安裝指令 `iex (irm ...)` 是 PowerShell 的寫法,在 CMD 裡打不會動[^1]。(CMD 和 PowerShell 都是 Windows 的終端機視窗,但用的語法不一樣。)

## 下一步

- 想走 WSL2 這條路 → [WSL2 完整安裝教學](/install/wsl2/)
- 設定要用的模型 → [模型供應商與 API key 設定](/config/model-provider/)
- 想從 OpenClaw 搬過來 → [遷移指南](/migrate/migrate-from-openclaw/)

[^1]: Nous Research, Installation:https://hermes-agent.nousresearch.com/docs/getting-started/installation (2026-07-23 存取)
