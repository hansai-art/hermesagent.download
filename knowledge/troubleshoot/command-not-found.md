---
title: "hermes: command not found 怎麼解"
description: "裝完打 hermes 卻說找不到指令——九成不是安裝失敗,是 shell 還沒重新載入 PATH。三十秒可解。"
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

安裝腳本跑完,畫面看起來一切正常,你興沖沖打了 `hermes`,結果:

```
zsh: command not found: hermes
```

**先別重裝。** 九成的情況安裝是成功的,問題出在你現在這個終端機視窗還不知道它的存在。

## 為什麼會這樣

安裝腳本把 `hermes` 執行檔放在 `~/.local/bin`,並把這個路徑寫進你的 shell 設定檔[^1]。

但**已經開著的終端機視窗是在安裝之前啟動的**,它讀到的是舊的 PATH——就像你改了設定檔卻沒重啟程式。

## 解法一:重新載入 shell(最快)

```bash
source ~/.zshrc
```

macOS 從 Catalina 起預設是 zsh。如果你用 bash:

```bash
source ~/.bashrc
```

**成功判準**:這行指令不會有任何輸出(沒消息就是好消息)。接著打 `hermes doctor`,有反應就是好了。

## 解法二:開一個新的終端機視窗

不用記指令。新視窗會重新讀 shell 設定檔,自動拿到新的 PATH[^1]。

用 VS Code 或 IDE 內建終端機的話,可能要**完全重啟編輯器**才生效,只關掉分頁不夠。

## 還是不行?檢查 PATH 有沒有那一段

```bash
echo $PATH | tr ':' '\n' | grep local
```

**預期輸出**:應該看到一行包含 `/.local/bin` 的路徑,例如 `/Users/yourname/.local/bin`。

**什麼都沒印出來**代表安裝腳本沒能改到你的 shell 設定檔。手動加:

```bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

(bash 使用者把兩處 `.zshrc` 換成 `.bashrc`)

## 確認執行檔真的存在

PATH 沒問題卻還是找不到,直接看檔案在不在:

```bash
ls -l ~/.local/bin/hermes
```

**預期輸出**:一行檔案資訊。如果是 `No such file or directory`,那才是真的安裝失敗——重跑一次安裝指令,並注意過程中有沒有紅色錯誤訊息。

## 全面診斷

```bash
hermes doctor
```

官方的環境診斷指令,逐項檢查相依套件與設定[^2]。

## 常見問題

### 我用 fish 或其他 shell?

Hermes 預設載入 `~/.bashrc`。用其他 shell 要在 `config.yaml` 的 `terminal.shell_init_files` 加入你自己的初始化檔[^1]。

### 桌面版也會遇到嗎?

不會。桌面版是圖形介面應用程式,不透過 PATH 啟動。但你想從終端機呼叫的話,還是要走上面的流程。

### 每次開新視窗都要 source 一次嗎?

不用。`source` 只是讓**當前**視窗立刻生效;設定檔已經改好了,之後新開的視窗會自動載入。

## 下一步

- 裝好了要設模型 → [模型供應商與 API key 設定](/config/model-provider/)
- 遇到別的錯 → [疑難排解總覽](/troubleshoot/overview/)

[^1]: Nous Research, FAQ — https://hermes-agent.nousresearch.com/docs/reference/faq(2026-07-23 存取)
[^2]: Nous Research, Installation — https://hermes-agent.nousresearch.com/docs/getting-started/installation
