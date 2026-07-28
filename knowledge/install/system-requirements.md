---
title: "Hermes Agent 系統需求：硬體、作業系統與執行環境"
description: "裝之前先看這頁。分成雲端 API 與本機模型兩條路，各自要什麼硬體、哪些作業系統真的支援、Python 與 Node 要不要自己裝，以及實測的磁碟與記憶體佔用。"
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

你想裝 Hermes Agent，但不確定手上這台電腦跑不跑得動。官方文件把答案拆在五個不同頁面，而且**基礎安裝的硬體需求根本沒寫**。這頁把散落的部分整理起來，缺的部分我們自己實測補上。

**先講結論**：如果你打算用雲端 API(OpenRouter、Anthropic、OpenAI 這類),Hermes 本身幾乎不吃資源，**任何一台還在服役的電腦都夠**，真正的門檻是作業系統而不是效能。如果你要在自己電腦上跑模型，那是完全不同的量級，請直接跳到本機模型那一節。

---

## 一、先確認作業系統，這比硬體重要

官方把平台分成三級[^1]。**跑錯級別，再好的硬體也沒用。**

### Tier 1(官方優先修，壞了會被當第一順位)

| 作業系統 | 架構 | 安裝方式 |
|---|---|---|
| macOS | **僅 Apple Silicon**(M1 以後) | 桌面版安裝檔，或 `install.sh` |
| Windows 10 / 11 | x86_64, aarch64 | 桌面版安裝檔，或 `install.ps1` |
| Linux / WSL2 | x86_64, aarch64 | `install.sh` |
| Docker 容器 | x86_64, aarch64 | `docker pull` |

Linux 方面官方只測最新版 Ubuntu 與 WSL2。官方原話是：只要你的發行版有 glibc 與 systemd，而且遵循 FHS 檔案結構，大致上都能跑[^1]。

### Tier 2(盡力維護，可能說壞就壞)

- Android(Termux)，僅 aarch64
- Nix(macOS、Linux、NixOS)

### 明確不支援

- **Intel 處理器的 macOS**[^1]。這是最多人踩的一條：2020 年以前的 MacBook 幾乎都是 Intel，官方明列不支援，不是「可能有問題」而是「不接受修這個的 PR」。
- 透過 `pip install hermes-agent` 或 `uv tool install hermes-agent` 安裝
- 透過 Homebrew(`brew install hermes-agent`)安裝
- 透過 AUR 安裝

怎麼查自己的 Mac 是哪種：

```bash
uname -m
```

**預期輸出**:`arm64` 代表 Apple Silicon，可以裝；`x86_64` 代表 Intel Mac，官方不支援。

---

## 二、雲端 API 模式：實際上不太吃資源

這是絕大多數人該走的路。模型跑在別人的伺服器上，你這台只負責發請求、收結果，以及執行 Hermes 自己的工具(讀寫檔案、跑指令、開瀏覽器)。

官方**沒有**公布這條路線的硬體需求[^2]。以下是我們在 MacBook Air M1(8 GB 記憶體，8 核心)上的實測：

| 階段 | 常駐記憶體 |
|---|---|
| 剛啟動，閒置 | 84 MB |
| 完成連線交握 | 98 MB |
| 建立一個工作階段 | 166 MB(尖峰) |
| 跑完一次雲端 API 回合 | 100 MB |
| 回合結束五秒後 | 40 MB |

換句話說，**Hermes 本體的量級是幾百 MB，不是幾 GB**。一台 8 GB 記憶體的機器綽綽有餘。

需要注意的是這組數字量的是 ACP 介接模式的單一工作階段。以下情況會明顯往上加：

- 開啟瀏覽器工具時會啟動 Chromium，那是幾百 MB 起跳，跟開一個新分頁的瀏覽器差不多
- 同時掛著 Telegram、Discord 這類訊息閘道
- 網頁儀表板長時間開著

一個實務上的估法：**把 Hermes 當成「一個瀏覽器分頁」的資源等級來規劃**，不要當成「一個虛擬機」。

### 那 CPU 與顯示卡呢

雲端 API 模式**不需要顯示卡**。CPU 只影響工具執行速度(例如全文搜尋、跑測試)，不影響模型回應速度，因為那段在雲端。回應慢通常是網路或供應商排隊，不是你的電腦不夠力。

---

## 三、磁碟空間：比多數人預期的大

官方沒有寫。這是我們在 macOS 上的實測：

| 項目 | 實際大小 |
|---|---|
| 程式本體 `~/.hermes/hermes-agent/` | 2.8 GB |
| 其中 Python 虛擬環境 `venv/` | 515 MB |
| 其中 Node 相依套件 `node_modules/` | 1.0 GB |
| 整個 `~/.hermes/`(含對話紀錄與快取) | 7.4 GB |

那 7.4 GB 是用了一段時間之後的數字，對話紀錄與模型快取會持續長大。

**建議至少預留 15 GB**。只跑雲端 API 的話這樣很夠。要在本機跑模型的話，模型權重要另外算，見下一節。

---

## 四、本機模型模式：這裡才是真的要看硬體

如果你不想付 API 費用，或者資料不能離開自己的機器，就走這條。Hermes 透過 [Ollama](https://ollama.com) 接本機模型。以下是[官方本機模型指南](https://hermes-agent.nousresearch.com/docs/guides/local-ollama-setup)給的規格，不是我們估的[^3]:

| 項目 | 最低 | 建議 |
|---|---|---|
| 記憶體 | 8 GB(跑 3B 模型) | 32 GB 以上(跑 27B 以上模型) |
| 儲存空間 | 5 GB 可用 | 30 GB 以上(放多個模型) |
| CPU | 4 核心 | 8 核心以上 |
| 顯示卡 | 不需要 | NVIDIA 顯示卡，8 GB 以上顯示記憶體，速度差很多 |

### 可以跑哪些模型

官方列出的對照表[^3]:

| 模型 | 磁碟大小 | 需要記憶體 | 支援工具呼叫 | 適合 |
|---|---|---|---|---|
| `gemma4:31b` | 約 20 GB | 24 GB 以上 | **是** | 品質最好，工具使用與推理都強 |
| `gemma2:27b` | 約 16 GB | 20 GB 以上 | 否 | 純對話 |
| `gemma2:9b` | 約 5 GB | 8 GB 以上 | 否 | 快速問答 |
| `llama3.2:3b` | 約 2 GB | 4 GB 以上 | 否 | 輕量問答 |

### 新手最容易踩的一條：工具呼叫

Hermes 是**代理型**助理，它的價值在於會改檔案、跑指令、開網頁，這些全都靠模型的工具呼叫能力。**不支援工具呼叫的模型只能聊天，不能做事。**

意思是：你用 `llama3.2:3b` 裝起來確實會動，但它做不了 Hermes 大部分的事。想要完整體驗，實際門檻是 `gemma4:31b` 那一級，也就是**24 GB 以上記憶體**。

這也是為什麼「8 GB 就能跑本機模型」這句話會誤導人：能跑，但跑的是一個不會做事的版本。

### 沒有顯示卡也能跑，但要有心理準備

官方給的速度參考[^3]:

- 9B 模型，現代 8 核心 CPU：每秒約 10 個 token
- 31B 模型，純 CPU：每秒約 2 到 5 個 token,**每次回應要 30 到 120 秒**

純 CPU 環境要把逾時放寬，否則會一直失敗。這是環境變數，不是 `config.yaml` 的設定項：

```bash
# ~/.hermes/.env
HERMES_API_TIMEOUT=1800   # 30 分鐘
```

這是檔案內容不是指令，存檔後下次啟動生效。沒設的話，本機大模型很容易在回應完成前就被判逾時。

---

## 五、軟體環境：幾乎不用自己裝

這是好消息。**你不需要先裝 Python，也不需要先裝 Node.js。**

安裝程式會自動處理[^2]:

- uv(Python 套件管理工具)
- Python 3.11
- Node.js v22(瀏覽器自動化與 WhatsApp 橋接需要)
- ripgrep(全文搜尋)
- ffmpeg(語音與影音處理)

你真正要先準備的只有[^2]:

| 平台 | 必須先有 |
|---|---|
| macOS | `git` |
| Linux | `git`、`curl`、`xz-utils`(安裝程式要解壓 Node 的 `.tar.xz`) |
| Windows | 無(PowerShell 一行指令，不需要系統管理員權限) |
| 要裝桌面版的 Linux | 再加 `g++`(Debian / Ubuntu 是 `build-essential`)，要編譯原生模組 |

Debian 系可以一次補齊：

```bash
sudo apt install git curl xz-utils build-essential
```

**預期輸出**：一串安裝進度，最後回到提示字元且沒有 `E:` 開頭的錯誤行。已經裝過會看到 `already the newest version`，那也是正常的。

### Python 版本有上限，不只有下限

專案宣告的是 `>=3.11,<3.14`[^5]。**Python 3.14 會裝失敗**，原因寫在專案設定檔的註解裡：pydantic-core 這類用 Rust 寫的相依套件還沒有 cp314 的預編譯輪檔，會退回原始碼編譯然後失敗。

如果你的系統預設 Python 已經是 3.14，不要自己硬裝，讓安裝程式用 uv 管理它自己的 3.11 就好。這也是為什麼官方不建議用 `pip install`。

---

## 六、平台之間的功能差異

同樣是 Tier 1，能用的功能不完全一樣。

### Windows 原生

官方原話是：除了儀表板的內嵌終端機分頁之外，全部都能原生執行[^4]。

| 功能 | Windows 原生 | WSL2 |
|---|---|---|
| 命令列與互動式介面 | 可 | 可 |
| 訊息閘道(Telegram、Discord、Slack 等 15 種以上) | 可 | 可 |
| 排程器 | 可 | 可 |
| 瀏覽器工具 | 可 | 可 |
| 本機 Ollama / LM Studio | 可 | 可(走 WSL 網路) |
| 網頁儀表板 | 可 | 可 |
| 儀表板的 `/chat` 內嵌終端機 | **不可**(需要 POSIX PTY) | 可 |
| 開機自動啟動 | 可(工作排程器) | 可(systemd) |

只有那一個分頁不能用，其餘儀表板功能都正常。想要完整體驗就走 WSL2。

### Android 手機(Termux)

Tier 2，而且有明確限制[^6]:

- 不支援 Docker
- 本機語音轉文字(faster-whisper)在測試路徑上不可用
- 安裝程式會**刻意跳過**瀏覽器自動化的設定

手機比較適合當遠端操控與訊息機器人的一端，不適合當主力工作機。

---

## 七、三十秒自我檢查

裝之前跑這幾行，把答案對照上面：

```bash
uname -m          # Mac 要看到 arm64;x86_64 代表 Intel Mac，不支援
git --version     # 沒有的話先裝 git
df -h ~           # 可用空間至少 15 GB
```

**預期輸出**：三行分別是架構字串、類似 `git version 2.39.5` 的版本、以及一張磁碟表。`git` 顯示 `command not found` 就先裝 git;macOS 會跳視窗要你裝 Xcode Command Line Tools，照著裝即可。

macOS 看記憶體與核心數：

```bash
sysctl -n hw.memsize | awk '{printf "%d GB\n", $1/1024/1024/1024}'
sysctl -n hw.ncpu
```

**預期輸出**：兩行數字，例如 `8 GB` 與 `8`。

Linux 看記憶體與核心數：

```bash
free -g | awk '/Mem:/ {print $2 " GB"}'
nproc
```

**預期輸出**：兩行數字，例如 `15 GB` 與 `8`。`free` 不存在的話用 `cat /proc/meminfo | head -1`。

裝完之後，官方提供的體檢指令會把環境問題列出來：

```bash
hermes doctor
```

**預期輸出**：逐項環境檢查清單，正常時每項都是通過標記，並在最後印出偵測到的安裝方式。有紅字時照它給的提示處理。這要裝完才跑得動。

---

## 八、常見誤解

**「我的電腦比較舊，應該跑不動」**
走雲端 API 的話，幾乎不是效能問題，是作業系統問題。真正會擋住你的是 Intel Mac 這種明確不支援的組合，而不是記憶體不夠。

**「8 GB 記憶體可以跑本機模型」**
可以跑，但只能跑不支援工具呼叫的小模型，那樣的 Hermes 只會聊天不會做事。要它真的動手，實際門檻是 24 GB 以上。

**「要先自己裝好 Python 和 Node」**
不用，而且自己裝反而容易踩到 Python 3.14 那個坑。讓安裝程式用 uv 管理。

**「沒有顯示卡就不能用」**
雲端 API 模式根本不需要顯示卡。本機模型模式沒有顯示卡也能跑，只是慢很多。

---

## 資料來源與驗證方式

作業系統分級、軟體前置需求、Windows 功能矩陣、Termux 限制與本機模型規格表，全部出自官方文件(見本頁上方 `upstream_refs`)。Python 版本上下限出自專案的 `pyproject.toml`。

**記憶體與磁碟佔用是本站實測補上的**，官方沒有公布這部分。測試環境：MacBook Air M1,8 GB 記憶體，8 核心，macOS 15,Hermes Agent v0.17.0，測的是 ACP 介接模式的單一工作階段。你的數字會因為開了哪些功能而不同，請當成量級參考而不是保證值。

## 下一步

- 確認平台之後，直接看對應的安裝教學：[macOS](/install/macos/)、[Windows](/install/windows/)、[Linux](/install/linux/)、[WSL2](/install/wsl2/)
- 想比較五種安裝方式：[下載與安裝方式比較](/install/download/)
- 伺服器長駐與容器化：[進階部署](/install/advanced/)

[^1]: Nous Research, Platform Support:https://hermes-agent.nousresearch.com/docs/getting-started/platform-support(2026-07-28 存取)
[^2]: Nous Research, Installation,Prerequisites 段：https://hermes-agent.nousresearch.com/docs/getting-started/installation(2026-07-28 存取)
[^3]: Nous Research, Run Hermes Locally with Ollama:https://hermes-agent.nousresearch.com/docs/guides/local-ollama-setup(2026-07-28 存取)
[^4]: Nous Research, Windows (Native) Guide,Feature matrix 段：https://hermes-agent.nousresearch.com/docs/user-guide/windows-native(2026-07-28 存取)
[^5]: hermes-agent `pyproject.toml`,`requires-python = ">=3.11,<3.14"` 與其上方註解：https://github.com/NousResearch/hermes-agent/blob/main/pyproject.toml(2026-07-28 存取)
[^6]: Nous Research, Termux,Known limitations on phones 段：https://hermes-agent.nousresearch.com/docs/getting-started/termux(2026-07-28 存取)
