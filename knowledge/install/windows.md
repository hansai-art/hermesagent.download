---
title: "在 Windows 上安裝 Hermes Agent"
description: "三條路:桌面版、原生 PowerShell、WSL2。這篇幫你選,並附每一步的成功判準——選錯路重來很痛。"
date: 2026-07-23
subcategory: "windows"
hermes_version: ">=2026.5"
last_verified: 2026-07-04
human_reviewed: false
upstream_refs:
  - "https://hermes-agent.nousresearch.com/docs/getting-started/installation"
  - "https://hermes-agent.nousresearch.com/docs/reference/faq"
tags:
  - "windows"
  - "install"
status: "published"
---

Windows 上裝 Hermes Agent 有三條路,而**選錯了之後要重來很麻煩**——尤其是你已經設定好模型、累積了一些記憶之後才發現路線不對。所以先花一分鐘選對。

## 先選路線

| 你的情況 | 建議路線 |
|---|---|
| 只想用,不太碰終端機 | **桌面版**——點兩下安裝,相依套件全自動 |
| 想在 PowerShell 裡用,不想裝 Linux | **原生 PowerShell** |
| 會寫腳本、要接自動化、需要完整 Linux 工具鏈 | **WSL2** |

不確定的話:**現在選桌面版**,之後真的需要再裝 WSL2 版,兩者可以並存。

## 路線一:桌面版

到 [官方下載頁](https://hermes-agent.nousresearch.com/) 下載 Windows 安裝檔,點兩下安裝[^1]。

安裝程式會自動處理所有相依套件(uv、Python 3.11、Node.js v22、ripgrep、ffmpeg)[^1],你不需要先裝任何東西。

**怎麼確認成功**:應用程式能開啟並進入對話畫面。接著跳到下面的「設定模型供應商」。

## 路線二:原生 PowerShell

開啟 **PowerShell**(不是 CMD),執行官方安裝指令:

```powershell
iex (irm https://hermes-agent.nousresearch.com/install.ps1)
```

這行的意思是:`irm` 下載官方安裝腳本,`iex` 執行它[^1]。

> **不放心直接執行?** 可以先下載下來看過:
>
> ```powershell
> irm https://hermes-agent.nousresearch.com/install.ps1 -OutFile install.ps1
> notepad install.ps1
> .\install.ps1
> ```

**如果 PowerShell 擋下腳本執行**(顯示執行原則錯誤),那是 Windows 的安全設定。你可以只對這個工作階段放行:

```powershell
Set-ExecutionPolicy -Scope Process -Bypass
```

這只影響當前視窗,關掉就恢復,不會永久降低系統安全性。

### 裝完要重開 PowerShell

安裝程式改了 PATH,但**當前視窗還不知道**。關掉 PowerShell 再開一個新的,然後:

```powershell
hermes doctor
```

`hermes doctor` 是官方診斷指令[^1]。有項目報錯就照提示處理。

> 📝 **這一段缺實際輸出**:Windows 上 `hermes doctor` 的實際畫面我們手上沒有。
> 如果你剛跑過,[幫我們補上](https://github.com/hansai-art/hermesagent.download/edit/main/knowledge/install/windows.md)。

## 路線三:WSL2

在 WSL2 的 Linux shell 裡,用跟 Linux 完全一樣的指令:

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

**注意**:這行要在 **WSL2 的 shell 裡**跑,不是 PowerShell。兩者是不同的環境,搞混是這條路線最常見的錯誤。

WSL2 的完整流程(含 WSL2 本身怎麼裝、檔案系統該放哪、常見權限問題)見 [WSL2 完整安裝教學](/install/wsl2/)。

## 設定模型供應商

三條路線裝完都一樣:要先告訴它用哪個模型才能開始。

```bash
hermes model
```

互動式選單,選供應商並填 API key[^1]。或用官方 Portal 一步到位:

```bash
hermes setup --portal
```

詳見 [模型供應商與 API key 設定](/config/model-provider/)。

## 開始使用

```bash
hermes
```

## 常見問題

### PowerShell 打 hermes 說找不到指令?

沒重開視窗。關掉 PowerShell 重開一個。詳解見 [command not found 怎麼解](/troubleshoot/command-not-found/)。

### 我在 WSL2 裝的,PowerShell 找不到?

正常。WSL2 和 Windows 是兩個獨立環境,在 WSL2 裝的指令只存在於 WSL2 裡。要在 PowerShell 用就得另外裝原生版。

### 三條路線可以同時裝嗎?

可以,彼此獨立。但設定與記憶不共用——桌面版的對話紀錄不會出現在 WSL2 版裡。

### 該用 CMD 還是 PowerShell?

PowerShell。官方安裝指令 `iex (irm ...)` 是 PowerShell 語法,在 CMD 裡不能執行[^1]。

## 下一步

- 走 WSL2 路線 → [WSL2 完整安裝教學](/install/wsl2/)
- 設定模型 → [模型供應商與 API key 設定](/config/model-provider/)
- 從 OpenClaw 搬過來 → [遷移指南](/migrate/migrate-from-openclaw/)

[^1]: Nous Research, Installation — https://hermes-agent.nousresearch.com/docs/getting-started/installation(2026-07-23 存取)
