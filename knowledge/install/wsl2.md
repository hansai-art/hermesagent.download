---
title: "在 WSL2 上安裝 Hermes Agent"
description: "Windows 使用者的完整 Linux 路線。安裝跟 Linux 一樣簡單,真正的坑在 gateway 常駐與瀏覽器控制——這兩件事在 WSL2 裡跟一般 Linux 不同。"
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
  - "wsl2"
  - "install"
status: "published"
---

在 WSL2 裡裝 Hermes Agent,安裝本身跟 Linux 一模一樣——一行指令就完事。

真正會卡住你的是後面兩件事:**讓 gateway 保持常駐**,以及**從 WSL2 控制 Windows 上的瀏覽器**。這兩件事在 WSL2 裡的做法跟一般 Linux 不同,而且錯了不會有明顯的錯誤訊息,只會「就是不動」。

這篇會把安裝快速帶過,重點放在那兩個坑。

## 為什麼選 WSL2 而不是原生 PowerShell

官方有原生 PowerShell 安裝路徑,日常對話完全夠用。選 WSL2 的理由是**完整的終端機工具鏈與腳本支援**——如果你要讓 agent 跑 shell 腳本、用 Unix 工具、或接自動化流程,Linux 環境的相容性明顯較好。

只想快速試用的話,[Windows 原生路線](/install/windows/)更省事。

## 一、準備 WSL2

以**系統管理員身分**開啟 PowerShell:

```powershell
wsl --install
```

這會安裝 WSL2 並預設安裝 Ubuntu。裝完**需要重開機**,重開後系統會要你設定 Linux 使用者名稱與密碼。

**成功判準**:重開機後,開始選單能找到「Ubuntu」,點進去會進入 Linux shell,提示字元長得像 `yourname@DESKTOP-XXX:~$`。

## 二、在 WSL2 裡裝前置套件

⚠️ **以下所有指令都要在 WSL2 的 shell 裡執行**,不是 PowerShell。這是這條路線最常見的錯誤——兩個環境長得像,但完全獨立。

```bash
sudo apt update && sudo apt install -y curl xz-utils
```

`xz-utils` 缺了的話,安裝腳本會在解壓縮階段失敗,而錯誤訊息不會告訴你缺的是它[^1]。

## 三、執行官方安裝指令

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

跟 Linux 完全相同的指令[^1]。安裝腳本會處理 uv、Python 3.11、Node.js v22、ripgrep、ffmpeg。

## 四、重載 shell 並確認

```bash
source ~/.bashrc
hermes doctor
```

`hermes doctor` 是官方診斷指令[^1]。

> 📝 **這一段缺實際輸出**:WSL2 下 `hermes doctor` 的實際畫面我們手上沒有。
> [幫我們補上](https://github.com/hansai-art/hermesagent.download/edit/main/knowledge/install/wsl2.md)。

接著設定模型才能開始用:

```bash
hermes model
```

詳見 [模型供應商與 API key 設定](/config/model-provider/)。

## 坑一:gateway 常駐

如果你要接 Telegram、Slack 等訊息平台,gateway 必須持續執行。

**在 WSL2 上不要依賴 systemd**——官方 FAQ 明確指出 systemd 在 WSL 環境不可靠[^2]。這是 WSL2 跟一般 Linux 最大的差異之一,照著一般 Linux 教學設 systemd service 會讓你以為設定好了,實際上重開就掉。

正確做法是前景執行,或用 tmux 讓它在背景存活:

```bash
tmux new -s hermes 'hermes gateway run'
```

**成功判準**:關掉 WSL 終端機視窗後再開一個,執行 `tmux ls` 能看到名為 `hermes` 的 session 還在。要回到它:

```bash
tmux attach -t hermes
```

(離開但不關閉:按 `Ctrl+B` 然後按 `D`)

⚠️ **另一個 WSL2 特性**:Windows 完全關閉 WSL 時(或重開機),tmux session 也會消失。開機自動啟動需要額外設定 Windows 工作排程器。

> 📝 **待補**:WSL2 開機自動啟動 gateway 的具體設定,我們還沒整理。
> 有做過的人[歡迎補上](https://github.com/hansai-art/hermesagent.download/edit/main/knowledge/install/wsl2.md)。

## 坑二:從 WSL2 控制 Windows 的瀏覽器

WSL2 跟 Windows 是兩個網路環境,直接叫 WSL2 裡的 Hermes 去控制 Windows 上的 Chrome 不會順利。

官方建議走 **MCP bridge**:把 `chrome-devtools-mcp` 設成 MCP server,讓 Hermes 透過 MCP 使用瀏覽器工具[^2]。這比 `/browser connect` 可靠。

相關設定見 [推薦 MCP](/integrations/recommended-mcp/)。

## 常見問題

### nvm / pyenv 裝的工具 Hermes 找不到?

Hermes 預設只載入 `~/.bashrc`。如果你的工具是靠 `~/.zshrc` 或 `~/.nvm/nvm.sh` 才進 PATH 的,要在 `config.yaml` 的 `terminal.shell_init_files` 把那些初始化檔加進去[^2]。

### 在 WSL2 裝的,PowerShell 找不到指令?

正常。兩個環境獨立,WSL2 裡裝的東西只存在於 WSL2。

### 檔案要放在哪個檔案系統?

放在 WSL2 的 Linux 檔案系統裡(`~/` 之下),不要放在 `/mnt/c/`。跨檔案系統存取在 WSL2 上明顯較慢。

### 可以同時裝原生版和 WSL2 版嗎?

可以,兩者獨立。但記憶與設定不共用。

## 下一步

- 設定模型 → [模型供應商與 API key 設定](/config/model-provider/)
- 接 Telegram → [Telegram 常見坑與解法](/troubleshoot/telegram/)
- 遇到 command not found → [怎麼解](/troubleshoot/command-not-found/)

[^1]: Nous Research, Installation — https://hermes-agent.nousresearch.com/docs/getting-started/installation(2026-07-23 存取)
[^2]: Nous Research, FAQ — https://hermes-agent.nousresearch.com/docs/reference/faq
