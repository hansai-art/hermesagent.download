---
title: "我的電腦跑得動 Hermes Agent 嗎？最低配置一覽"
description: "最低配置清單，一分鐘看完。雲端 API 模式 8 GB 記憶體就夠，本機模型模式要 24 GB。含 Intel Mac 不支援的提醒，以及三個指令的自我檢查法。細節收在折疊區，不看也不影響安裝。"
date: 2026-07-28
subcategory: "requirements"
hermes_version: ">=2026.5"
last_verified: 2026-07-28
human_reviewed: false
upstream_refs:
  - "https://hermes-agent.nousresearch.com/docs/getting-started/platform-support"
  - "https://hermes-agent.nousresearch.com/docs/getting-started/installation"
  - "https://hermes-agent.nousresearch.com/docs/guides/local-ollama-setup"
  - "https://hermes-agent.nousresearch.com/docs/user-guide/windows-native"
tags:
  - "install"
  - "requirements"
  - "hardware"
  - "ollama"
status: "published"
---

先看你要哪一種用法，配置差三倍。

- **雲端 API 模式**：Hermes 去用別人家的 AI，你這台只送問題收答案。多數人用這個，幾乎不吃資源。
- **本機模型模式**：AI 整包裝在你的硬碟裡跑，不用付使用費，但要一台夠力的電腦。

---

## 一、雲端 API 模式的最低配置

- **處理器 (CPU)**：沒有特別要求，還在服役的電腦都夠。
- **記憶體 (RAM)**：8 GB 以上。
- **儲存空間**：預留 15 GB。程式本體約 2.8 GB，其餘留給會持續長大的聊天紀錄。
- **顯示卡 (GPU)**：**不需要**。

## 二、本機模型模式的最低配置

- **處理器 (CPU)**：4 核心以上，建議 8 核心[^3]。
- **記憶體 (RAM)**：最低 8 GB，但**實際門檻是 24 GB**，原因見下方折疊區[^3]。
- **儲存空間**：預留 30 GB 以上，用來放 AI 模型檔[^3]。
- **顯示卡 (GPU)**：非必要。有 NVIDIA 顯卡、顯示記憶體 8 GB 以上會快很多；沒有也能跑，但每次回答要等 30 到 120 秒[^3]。

## 三、作業系統

- **macOS**：**只支援 Apple M 系列**（M1、M2、M3 等）。**2020 年以前的 Intel 機型不支援**[^1]。
- **Windows**：10 或 11，可以直接裝，不需要系統管理員權限。也可以改用 WSL2[^1]。
- **Linux**：主流發行版（Ubuntu、Debian 等）。官方主要測 Ubuntu 最新版[^1]。
- **不支援**：Intel Mac，以及用 `pip`／`brew`／AUR 安裝[^1]。

## 四、必要執行環境

- **Python**：**不用自己裝**，官方安裝程式會處理。它要的是 3.11 到 3.13，**不能是 3.14**[^5]。
- **Node.js**：**不用自己裝**，安裝程式會裝 v22[^2]。
- **要自己先準備的**：
  - macOS：`git`（多數 Mac 已內建）
  - Linux：`git`、`curl`、`xz-utils`；要裝桌面版再加 `build-essential`
  - Windows：什麼都不用，貼一行指令就好

---

## 一分鐘自我檢查

**Mac 使用者**先確認機型。開「終端機」App（在「應用程式」→「工具程式」裡），貼上：

```bash
uname -m
```

**預期輸出**：`arm64` 就可以裝；`x86_64` 是 Intel 機型，不支援。

看記憶體與核心數：

```bash
sysctl -n hw.memsize | awk '{printf "%d GB\n", $1/1024/1024/1024}'
sysctl -n hw.ncpu
```

**預期輸出**：兩行數字，例如 `8 GB` 和 `8`。

**Linux 使用者**：

```bash
free -g | awk '/Mem:/ {print $2 " GB"}'
nproc
```

**預期輸出**：兩行數字，例如 `15 GB` 和 `8`。沒有 `free` 指令就改用 `cat /proc/meminfo | head -1`。

**所有人**確認硬碟空間：

```bash
df -h ~
```

**預期輸出**：一張表格，看 `Avail` 那一欄，至少 15 GB。

**Windows 使用者**不用跑指令。記憶體按 Ctrl + Shift + Esc 開工作管理員看「效能」；硬碟開「本機」看 C 槽。

---

## 三個會讓你白忙的誤判

1. **「我的 Mac 規格很好，應該可以裝」** — 只要是 Intel 機型就不行，跟規格無關。
2. **「8 GB 就能在自己電腦跑 AI」** — 能跑，但那個等級的模型不會動手做事，只能聊天。實際門檻 24 GB。
3. **「要先裝好 Python」** — 不用，自己裝反而容易踩到 3.14 裝不起來的坑。

**配置符合就可以往下走**：[macOS](/install/macos/)、[Windows](/install/windows/)、[Linux](/install/linux/)、[WSL2](/install/wsl2/)。

---

## 細節（不看也不影響安裝）

<details>
<summary><strong>為什麼 Intel Mac 不能裝</strong></summary>

蘋果在 2020 年底換掉了 Mac 裡面的處理器。換之前用 Intel 的，換之後用蘋果自己設計的晶片，型號從 M1 開始往上排。Hermes Agent 只支援換過之後的機型[^1]。

這跟記憶體多大、硬碟多空完全無關。很多人是裝到一半才發現的。

**怎麼確認**：點左上角蘋果圖示 →「關於這台 Mac」→ 看「晶片」那一欄。寫 **Apple M** 開頭就可以裝，寫 **Intel** 就不行。

</details>

<details>
<summary><strong>本機模型要選哪一個，為什麼門檻是 24 GB</strong></summary>

Hermes 透過 [Ollama](https://ollama.com) 這個免費工具在你的電腦裡跑 AI。官方列出的模型對照表[^3]：

| 模型名稱 | 要多少硬碟 | 要多少記憶體 | 會不會動手做事 | 適合 |
|---|---|---|---|---|
| `gemma4:31b` | 約 20 GB | 24 GB 以上 | **會** | 品質最好 |
| `gemma2:27b` | 約 16 GB | 20 GB 以上 | 不會 | 只能聊天 |
| `gemma2:9b` | 約 5 GB | 8 GB 以上 | 不會 | 快速問答 |
| `llama3.2:3b` | 約 2 GB | 4 GB 以上 | 不會 | 輕量問答 |

最後那一欄是關鍵。Hermes 的價值在於它會實際動手：改檔案、跑指令、開網頁查資料。這需要模型具備「工具呼叫（tool calling）」的能力。**不具備這個能力的模型，裝起來會動，但只能跟你聊天，不能幫你做任何事**[^3]。

所以「8 GB 就能跑本機 AI」成立但誤導：能跑，跑起來的是一個不會做事的版本。要它真的幫你做事，就得用 `gemma4:31b` 那一級，也就是 24 GB。完整模型清單見 [Ollama 模型庫](https://ollama.com/library)。

**沒有顯示卡的速度**（官方數據，「token」約等於一個中文字）[^3]：

| 情況 | 速度 |
|---|---|
| 中型模型 + 8 核心處理器 | 每秒約 10 個字 |
| 大型模型 + 沒有顯示卡 | 每秒約 2 到 5 個字，每次回答等 30 到 120 秒 |

純處理器跑的話要把等待上限調長，否則系統會以為當掉而中斷。這是設定檔內容，不是指令：

```bash
# ~/.hermes/.env
HERMES_API_TIMEOUT=1800   # 30 分鐘
```

**預期結果**：存檔後下次啟動生效，大模型不會再答到一半被判逾時。

</details>

<details>
<summary><strong>官方的支援分級是什麼意思</strong></summary>

官方在[平台支援頁](https://hermes-agent.nousresearch.com/docs/getting-started/platform-support)把系統分成三級，決定的是「出問題時官方修不修」[^1]。

- **全力支援**：出問題當第一順位處理。macOS（M 系列）、Windows 10／11、Linux、[WSL2](https://learn.microsoft.com/windows/wsl/install)、[Docker](https://www.docker.com)。
- **盡量支援**：會維護但優先度低，可能說壞就壞。Android 手機（透過 [Termux](https://termux.dev)）、Nix。
- **明說不支援**：不接受相關修復請求。Intel Mac，以及 `pip install`、`uv tool install`、`brew install`、AUR 這幾種安裝管道。

Android 手機另有明確限制[^6]：不能用 Docker、語音轉文字跑不起來、安裝程式會跳過瀏覽器自動化的設定。手機適合當遠端遙控與聊天機器人的那一端，不適合當主力工作機。

</details>

<details>
<summary><strong>Windows 直接裝與用 WSL2 的功能差異</strong></summary>

官方在 [Windows 原生指南](https://hermes-agent.nousresearch.com/docs/user-guide/windows-native)的說法是：除了儀表板裡那個內嵌的終端機分頁之外，其他全部都能在 Windows 上直接跑[^4]。

| 功能 | Windows 直接跑 | 裝了 WSL2 |
|---|---|---|
| 命令列與對話介面 | 可以 | 可以 |
| 接 Telegram、Discord、Slack 等聊天軟體 | 可以 | 可以 |
| 排程，讓它定時自動做事 | 可以 | 可以 |
| 讓它自己開瀏覽器 | 可以 | 可以 |
| 在自己電腦跑 AI 模型 | 可以 | 可以 |
| 網頁儀表板 | 可以 | 可以 |
| 儀表板裡的內嵌終端機 | **不行** | 可以 |
| 開機自動啟動 | 可以 | 可以 |

只有那一個分頁不能用，而且它只是方便功能。想要百分之百完整就多裝一層 WSL2。

</details>

<details>
<summary><strong>安裝程式會自動裝什麼，以及 Python 3.14 為什麼會失敗</strong></summary>

官方安裝程式會自動裝好這些[^2]：

| 它會裝的 | 那是什麼 |
|---|---|
| [Python](https://www.python.org) 3.11 | Hermes 主程式用的程式語言 |
| uv | 管理 Python 套件的工具 |
| Node.js v22 | 讓它自己開瀏覽器、接 WhatsApp 時需要 |
| ripgrep | 在檔案裡快速搜尋文字的工具 |
| ffmpeg | 處理語音與影片的工具 |

Linux 使用者的前置套件可以一次補齊：

```bash
sudo apt install git curl xz-utils build-essential
```

**預期輸出**：一串安裝進度，最後回到可以打字的狀態，沒有 `E:` 開頭的紅字。顯示 `already the newest version` 代表早就裝好了，也是正常的。

**Python 3.14 為什麼不行**：Hermes 用到的一些底層零件還沒推出對應 3.14 的現成版本，安裝程式會試著當場編譯然後失敗[^5]。如果你的系統預設 Python 已經是 3.14，不要自己想辦法降版，那會弄壞其他依賴 Python 的東西。讓官方安裝程式管理它自己的版本就好，它裝在獨立的地方，不影響你原本的 Python。這也是官方不建議用 `pip` 安裝的原因。

裝完之後可以跑官方的[自我檢查指令](https://hermes-agent.nousresearch.com/docs/getting-started/installation)：

```bash
hermes doctor
```

**預期輸出**：一份逐項檢查清單，正常時每項都顯示通過，最後印出偵測到的安裝方式。有紅字就照它的提示處理。

</details>

<details>
<summary><strong>這頁的數字哪些是官方的、哪些是我們自己測的</strong></summary>

**官方文件並沒有完整寫過「要什麼硬體」這件事。**

| 這頁的內容 | 來源 |
|---|---|
| 作業系統支援、執行環境、本機模型規格、功能差異 | 官方文件 |
| **雲端模式的記憶體佔用、硬碟佔用** | **本站實測，僅供參考** |

實測數字（MacBook Air M1，8 GB 記憶體，8 核心，macOS 15，Hermes v0.17.0，單一對話、沒開額外功能）：

| 狀態 | 佔用記憶體 |
|---|---|
| 開著但沒在做事 | 84 MB |
| 剛建立一個對話 | 166 MB（尖峰） |
| 問完一個問題、拿到答案 | 100 MB |
| 結束後過五秒 | 40 MB |

| 硬碟項目 | 實際大小 |
|---|---|
| 程式本體 | 2.8 GB |
| 用一陣子之後的完整資料夾（含聊天紀錄與快取） | 7.4 GB |

**為什麼只能當參考**：你的數字幾乎一定跟我們不同，因為這些都會改變結果 — 有沒有開瀏覽器功能（開了會多吃幾百 MB）、接了幾個聊天軟體、同時開幾個對話、對話累積多久、裝了哪些額外功能。

請用「量級」判斷，不要拿單一數字當規格：**Hermes 本身是幾百 MB 的量級，不是幾個 GB。把它當成多開一個瀏覽器分頁，不是多開一台虛擬電腦。** 硬碟那個 7.4 GB 尤其不能照抄，聊天紀錄會一直累積，用三個月和用三年差距很大。

如果你量出來的數字跟我們差很多，歡迎[開一個 issue 告訴我們](https://github.com/hansai-art/hermesagent.download/issues/new)，我們會把更多機型的實測補進來。

</details>

## 下一步

- 對應的安裝教學：[macOS](/install/macos/)、[Windows](/install/windows/)、[Linux](/install/linux/)、[WSL2](/install/wsl2/)
- 想比較五種安裝方式：[下載與安裝方式比較](/install/download/)
- 伺服器長駐與容器化：[進階部署](/install/advanced/)

[^1]: Nous Research, Platform Support：https://hermes-agent.nousresearch.com/docs/getting-started/platform-support（2026-07-28 存取）
[^2]: Nous Research, Installation，Prerequisites 段：https://hermes-agent.nousresearch.com/docs/getting-started/installation（2026-07-28 存取）。記憶體與硬碟佔用為本站實測，官方文件無此資料。
[^3]: Nous Research, Run Hermes Locally with Ollama：https://hermes-agent.nousresearch.com/docs/guides/local-ollama-setup（2026-07-28 存取）
[^4]: Nous Research, Windows (Native) Guide，Feature matrix 段：https://hermes-agent.nousresearch.com/docs/user-guide/windows-native（2026-07-28 存取）
[^5]: hermes-agent `pyproject.toml`，`requires-python = ">=3.11,<3.14"` 與其上方註解：https://github.com/NousResearch/hermes-agent/blob/main/pyproject.toml（2026-07-28 存取）
[^6]: Nous Research, Termux，Known limitations on phones 段：https://hermes-agent.nousresearch.com/docs/getting-started/termux（2026-07-28 存取）
