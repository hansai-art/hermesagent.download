---
title: "Hermes requires Python 3.11 or newer 怎麼解"
description: "會遇到這個錯,通常代表你沒走官方安裝器。三種解法,含「為什麼別人不會遇到」。"
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

```
Hermes requires Python 3.11 or newer
```

看到這行,先問自己一個問題:**你是不是自己用 pip 裝的,或者在一台舊系統上手動裝的?**

因為官方一行安裝腳本會自動裝好 Python 3.11[^1]——會撞到這個錯,通常代表安裝過程沒走那條路,或者你的環境裡有多個 Python 版本在打架。

## 先確認現在是幾版

```bash
python3 --version
```

**預期輸出**:`Python 3.12.3` 這樣的字串。如果顯示 3.10 或更舊,那就是問題所在。

## 解法一:重跑官方安裝腳本(最省事)

官方安裝腳本本來就會處理 Python 版本[^1]。與其自己跟系統 Python 搏鬥,不如讓它處理:

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

Windows 使用者用 PowerShell:

```powershell
iex (irm https://hermes-agent.nousresearch.com/install.ps1)
```

## 解法二:升級系統 Python

如果你有理由要自己管環境:

**Ubuntu / Debian**

```bash
sudo apt update && sudo apt install -y python3.12
```

**macOS(Homebrew)**

```bash
brew install python@3.12
```

**驗證**:

```bash
python3 --version
```

**預期輸出**:`Python 3.12.x`。

> ⚠️ **注意**:在某些系統上,裝了新版 Python 不代表 `python3` 就會指向它——系統可能仍指向舊版。
> 如果裝完版本沒變,你需要調整 PATH 或使用 `update-alternatives`(Debian 系)。
>
> 📝 **待補**:各系統切換預設 Python 版本的具體做法,我們還沒整理完整。
> [歡迎補上](https://github.com/hansai-art/hermesagent.download/edit/main/knowledge/troubleshoot/python-version-too-old.md)。

## 解法三:缺 uv 套件管理器

Hermes 使用 uv 管理 Python 環境。如果錯誤訊息跟 uv 有關:

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

這是 uv 官方的安裝指令(astral.sh 是 uv 的官方網域)。

## 確認解決了

```bash
hermes doctor
```

官方診斷指令,會檢查包含 Python 版本在內的所有環境相依[^2]。

## 常見問題

### 為什麼有人裝就不會遇到?

因為官方一行安裝腳本會自動裝 Python 3.11 並隔離環境[^1]。自己 pip 裝、或在多 Python 版本的環境裡手動安裝,才容易撞到版本問題。

### 我不想動到系統 Python,會影響其他專案嗎?

走官方安裝腳本就不會——它用 uv 建立獨立環境,不會替換你的系統 Python。

### 升級 Python 會不會弄壞系統?

在 Ubuntu / Debian 上,**安裝**新版本(`apt install python3.12`)是安全的,系統會保留舊版。危險的是把系統預設的 `python3` 指向新版——某些系統工具依賴特定版本。所以優先選解法一。

## 下一步

- 裝好了要設模型 → [模型供應商與 API key 設定](/config/model-provider/)
- 遇到別的錯 → [疑難排解總覽](/troubleshoot/overview/)

[^1]: Nous Research, FAQ — https://hermes-agent.nousresearch.com/docs/reference/faq(2026-07-23 存取)
[^2]: Nous Research, Installation — https://hermes-agent.nousresearch.com/docs/getting-started/installation
