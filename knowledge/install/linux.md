---
title: "在 Linux 上安裝 Hermes Agent"
description: "一行指令就能裝完,但前置套件缺了會失敗得莫名其妙。含桌機與 VPS 長駐兩種情境,以及 service user 部署。"
date: 2026-07-23
subcategory: "linux"
hermes_version: ">=2026.5"
last_verified: 2026-07-04
human_reviewed: false
upstream_refs:
  - "https://hermes-agent.nousresearch.com/docs/getting-started/installation"
  - "https://hermes-agent.nousresearch.com/docs/reference/faq"
tags:
  - "linux"
  - "install"
status: "published"
---

Linux 上裝 Hermes Agent 只需要一行指令。但如果你少了前置套件,它會失敗得很莫名其妙——中途噴一段解壓縮錯誤然後停住,訊息不會告訴你缺的是 `xz-utils`。

所以先花三十秒把前置裝好。

## 前置套件(Debian / Ubuntu)

```bash
sudo apt update && sudo apt install -y curl xz-utils
```

`curl` 用來下載安裝腳本,`xz-utils` 用來解壓縮它下載的東西[^1]。

如果你要用桌面版,再加一個:

```bash
sudo apt install -y build-essential
```

### 確認 Git 存在

安裝腳本會自己裝其他相依套件,但 Git 需要你先有[^1]:

```bash
git --version
```

**預期輸出**:類似 `git version 2.43.0` 的版本字串。顯示 `command not found` 就 `sudo apt install -y git`。

## 執行官方安裝指令

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

安裝腳本會自動處理 uv、Python 3.11、Node.js v22、ripgrep、ffmpeg[^1]。

> **不放心直接執行 `curl | bash`?** 這是官方提供的方式、官方網域,但你也可以先看過:
>
> ```bash
> curl -fsSL https://hermes-agent.nousresearch.com/install.sh -o install.sh
> less install.sh
> bash install.sh
> ```

## 重新載入 shell

安裝腳本把 `~/.local/bin` 加進 PATH,但當前這個 shell 還不知道:

```bash
source ~/.bashrc
```

用 zsh 就換成 `~/.zshrc`。或者直接開新的終端機工作階段。

**成功判準**:

```bash
hermes doctor
```

官方的環境診斷指令,會逐項檢查[^1]。有紅色項目就照它的提示修。

> 📝 **這一段缺實際輸出**:`hermes doctor` 在 Linux 上跑起來長什麼樣,我們手上沒有實機畫面。
> [幫我們補上](https://github.com/hansai-art/hermesagent.download/edit/main/knowledge/install/linux.md)。

## VPS 長駐:用 service user 部署

如果你要讓 agent 在伺服器上長期跑,不建議用 root 或你自己的帳號。官方文件的做法是:先以管理者身分安裝 Playwright 的系統相依套件,再切換到專用的 service user 執行安裝腳本[^1]。

伺服器上通常不需要瀏覽器功能,可以加參數跳過:

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash -s -- --skip-browser
```

> 📝 **待驗證**:`--skip-browser` 的確切參數傳遞方式(是否需要 `-s --`)我們尚未實測。
> 跑過的人請[修正這一段](https://github.com/hansai-art/hermesagent.download/edit/main/knowledge/install/linux.md)。

## 設定模型供應商

```bash
hermes model
```

互動式選單,選供應商並填 API key[^1]。詳見 [模型供應商與 API key 設定](/config/model-provider/)。

## 開始使用

```bash
hermes
```

## 常見問題

### 安裝跑到一半停住,說解壓縮失敗?

多半是缺 `xz-utils`。`sudo apt install -y xz-utils` 之後重跑安裝指令。

### 打 hermes 說 command not found?

shell 沒重新載入。見 [command not found 怎麼解](/troubleshoot/command-not-found/)。

### 其他發行版(Fedora / Arch)呢?

官方文件的前置套件說明是以 Debian / Ubuntu 為例。其他發行版換成對應的套件管理器指令即可(如 `dnf install curl xz` / `pacman -S curl xz`)。

> 📝 **待驗證**:非 Debian 系發行版的實際安裝經驗歡迎補充。

### 裝在哪?

預設 `~/.hermes/hermes-agent/`,設定檔在 `~/.hermes/`。

## 下一步

- 設定模型 → [模型供應商與 API key 設定](/config/model-provider/)
- 遇到 Python 版本問題 → [Python 版本太舊怎麼解](/troubleshoot/python-version-too-old/)

[^1]: Nous Research, Installation — https://hermes-agent.nousresearch.com/docs/getting-started/installation(2026-07-23 存取)
