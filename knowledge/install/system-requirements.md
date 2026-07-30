---
title: "Hermes Agent 建議配備：我的電腦跑得動嗎？"
description: "建議配備與最低配備分開列，一分鐘看完。雲端模式建議 16 GB 記憶體、顯示卡非必須；本機模型模式含顯示卡怎麼挑的對照表。另有 Intel Mac 不支援、模型 context 需 64K 兩個會擋人的硬性條件。"
date: 2026-07-28
subcategory: "requirements"
hermes_version: ">=2026.5"
last_verified: 2026-07-28
human_reviewed: true
upstream_refs:
  - "https://hermes-agent.nousresearch.com/docs/getting-started/platform-support"
  - "https://hermes-agent.nousresearch.com/docs/getting-started/installation"
  - "https://hermes-agent.nousresearch.com/docs/guides/local-ollama-setup"
  - "https://hermes-agent.nousresearch.com/docs/user-guide/windows-native"
  - "https://hermes-agent.nousresearch.com/docs/guides/local-llm-on-mac"
  - "https://hermes-agent.nousresearch.com/docs/getting-started/quickstart"
tags:
  - "install"
  - "requirements"
  - "hardware"
  - "ollama"
status: "published"
---

先看你要哪一種用法，建議配備差三倍。

- **雲端 API 模式**：Hermes 去用別人家的 AI，你這台只送問題收答案。多數人用這個，幾乎不吃資源。
- **本機模型模式**：AI 整包裝在你的硬碟裡跑，不用付使用費，但要一台夠力的電腦。

---

## 一、雲端 API 模式（多數人）

| 項目 | 建議配備 | 最低配備 |
|---|---|---|
| 處理器 (CPU) | 4 核心以上 | 2 核心，近十年的電腦都符合 |
| 記憶體 (RAM) | **16 GB** | 8 GB |
| 儲存空間 | 預留 30 GB | 預留 15 GB |
| 顯示卡 (GPU) | 非必須 | 非必須 |

**兩欄都是實際用得順的配備。** 最低欄不是「勉強開得起來」，是「照這樣配，正常用不會卡」。

**顯示卡在這個模式非必須**：模型的運算發生在雲端，所以一般內顯的機器也跑得順。顯示卡真正發揮作用的是下一段的本機模型模式，你如果本來就有一張，那條路會直接為你打開。

**為什麼建議 16 GB**：Hermes 本身很輕（實測閒置時佔 84 MB），但你不會只開它。同時開著瀏覽器、編輯器、幾個專案的話，8 GB 撐得住但切換會頓。這一欄是本站的判斷，官方沒有公布這條路線的硬體需求。

**儲存空間會長大**：程式本體約 2.8 GB，聊天紀錄與快取會持續累積，用一陣子後整包約 7.4 GB。15 GB 是短期夠用，30 GB 是不用一直清。

## 二、本機模型模式（在自己電腦跑 AI）

這張表的兩欄都是**用得下去**的配備，不是「開得起來」的配備。

| 項目 | 建議配備 | 最低配備 |
|---|---|---|
| 處理器 (CPU) | 8 核心以上[^3] | 4 核心（有顯示卡的話夠用）[^3] |
| 記憶體 (RAM) | **32 GB**[^3] | **16 GB** |
| 儲存空間 | 30 GB 以上 | 20 GB |
| 顯示卡 (GPU) | **顯示記憶體 24 GB**（見下方選購表） | **顯示記憶體 12 GB**，或 Apple M 系列統一記憶體 16 GB |

**這張表的顯示卡與記憶體數字是本站訂的，不是官方數字。** 官方寫顯示卡「不需要」、記憶體最低 8 GB[^3]。那是**跑得起來**的門檻，不是**用得下去**的門檻：純處理器跑大模型每次回答要等 30 到 120 秒[^3]，8 GB 記憶體只塞得下 3B 級小模型，而官方自己也說這個級距的模型常常無視工具呼叫指令、不會動手做事[^3]。既然這頁的用途是幫你決定要準備什麼設備，只寫「非必須」對你沒有幫助，所以我們把最低欄拉到實際還能用的那條線。

儲存空間同理：官方寫 5 GB[^3]，但那只算 Hermes 本身。加上一個 9B 級量化模型約 5.3 GB、聊天紀錄與快取，20 GB 才是實際的下限；要放 31B 級模型（約 18 GB）就得 30 GB 起跳。

**還有一條硬性要求**：模型的 context 必須 64K 以上，不夠的會在啟動時被 Hermes 直接擋下來[^8]。本機的執行工具常常預設低於這個值，要自己去設定[^3]。

### 顯示卡怎麼挑

**官方沒有推薦特定型號。** 以下是依「顯示記憶體要裝得下模型」推算的，各卡容量取自 [NVIDIA 官方規格比較頁](https://www.nvidia.com/en-us/geforce/graphics-cards/compare/)。

決定你跑不跑得動的是**顯示記憶體（VRAM）的 GB 數**，不是型號數字大小或跑分。模型塞不進顯示記憶體就會掉到系統記憶體去算，速度直接崩掉。

| 顯示記憶體 | 跑得動什麼 | 新品可買 | 二手 |
|---|---|---|---|
| 8 GB | 只有最小的模型，多半不會動手做事 | RTX 5060／5050 | 不建議 |
| 12 GB | 9B 級模型 + 64K context，堪用起點 | RTX 5070 | - |
| 16 GB | 9B 級開到 128K context | RTX 5070 Ti／5080 | - |
| **24 GB** | **官方推薦的 31B 級模型** | 截至 2026 年 7 月，消費級新品沒有這個容量 | **RTX 3090／4090** |
| 32 GB | 31B 級開長 context | **RTX 5090** | - |

一句話結論：

- **只想試試看** → 12 GB 就夠
- **要完整體驗**（跑得動會動手做事的模型）→ **24 GB 起跳**。截至 2026 年 7 月，新品只有 RTX 5090（32 GB）；預算有限找二手 RTX 3090（24 GB）
- **8 GB 這一級要有心理準備**。跑得起來，但受限於容量只放得下不會動手做事的小模型，想用完整功能建議往 12 GB 以上看

**Mac 不用挑顯卡**：M 系列是統一記憶體，買多少記憶體就等於多少顯示記憶體。16 GB 跑中型模型，32 GB 以上才跑得動大模型[^7]。Mac 也沒有「不用顯示卡」這個選項，M 系列晶片的繪圖單元本來就在幫你算。
- **模型的 context 必須有 64K 以上**：這是 Hermes 的硬性要求，不夠的模型會在啟動時被直接擋下來[^8]。這條會反過來吃記憶體，context 開越長吃越多。

## 三、作業系統

- **macOS**：**只支援 Apple M 系列**（M1、M2、M3 等）。**Intel 處理器機型一律不支援**，不分購買年份[^1]。
- **Windows**：10 或 11，可以直接裝，不需要系統管理員權限。也可以改用 WSL2[^1]。
- **Linux**：主流發行版（Ubuntu、Debian 等）。官方主要測 Ubuntu 最新版[^1]。
- **不支援**：Intel Mac，以及用 `pip`／`brew`／AUR 安裝[^1]。

## 四、必要執行環境

- **Python**：**不用自己裝**，官方安裝程式會處理。它要的是 3.11 到 3.13，**不能是 3.14**[^5]。
- **Node.js**：**不用自己裝**，安裝程式會裝 v22[^2]。
- **要自己先準備的**：
  - macOS：`git`。macOS 出廠其實沒裝，第一次執行 `git` 會跳出視窗要你安裝命令列工具，照著裝即可
  - Linux：`git`、`curl`、`xz-utils`；要裝桌面版再加 `build-essential`
  - Windows：什麼都不用，貼一行指令就好

---

## 整包複製給別人

要轉貼給學員、同事或社群的，下面這段可以整段複製，內容與這頁一致。

```text
【Hermes Agent 建議配備】

先確認你要哪一種用法。多數人是雲端模式，顯示卡非必須。

(1) 雲端 API 模式（多數人）
- 處理器：4 核心以上（最低 2 核心，近十年的電腦都符合）
- 記憶體：16 GB（最低 8 GB）
- 儲存空間：預留 30 GB（最低 15 GB）
- 顯示卡：非必須。運算在雲端，內顯機器也跑得順
  （顯示卡真正發揮作用的是下面的本機模型模式）

(2) 本機模型模式（在自己電腦跑 AI，進階選項）
- 處理器：8 核心以上
- 記憶體：32 GB（最低 16 GB）
- 儲存空間：30 GB（最低 20 GB）
- 顯示卡：顯示記憶體 24 GB（最低 12 GB），
  或 Apple M 系列統一記憶體 16 GB 以上
- 模型的 context 必須 64K 以上。這是硬性要求，不夠會在啟動時被擋下來

(3) 作業系統
- macOS：只支援 Apple M 系列晶片。Intel 機型一律不支援，不分購買年份
  （Intel 機型一路賣到 2023 年，請看「關於這台 Mac」的晶片欄，
  　不要用購買年份判斷）
- Windows：10 或 11，可以直接安裝，不需要 WSL2
- Linux：Ubuntu、Debian 等主流發行版

(4) 必要執行環境
- Python：不用自己裝，安裝程式會處理。它要 3.11 到 3.13，不能是 3.14
- Node.js：不用自己裝，安裝程式會裝 v22
- 要自己先準備的：macOS 與 Linux 需要 git；Linux 另需 curl 與 xz-utils；
  Windows 什麼都不用

【數字怎麼來的】
官方文件沒有完整公布硬體需求。本機模型的「最低」是本站訂的實際可用門檻，
官方原文只寫「顯示卡不需要、記憶體 8 GB」，那是開得起來的門檻，
不是用得下去的門檻。雲端模式的記憶體與硬碟佔用為本站實測，
會因每個人使用習慣而不同，都只是參考數字。

完整說明：https://www.hermesagent.download/install/system-requirements/
```

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

1. **「我的 Mac 規格很好，應該可以裝」**：只要是 Intel 機型就不行，跟規格無關。
2. **「8 GB 就能在自己電腦跑 AI」**：官方數字是這樣沒錯，但那個級距只塞得下 3B 小模型，要手動把 context 壓到 64K 下限，而且官方自己說這種小模型常常不會動手做事，只能聊天。實際要用，16 GB 起。
3. **「要先裝好 Python」**：不用，自己裝反而容易踩到 3.14 裝不起來的坑。

**配備符合就可以往下走**：[macOS](/install/macos/)、[Windows](/install/windows/)、[Linux](/install/linux/)、[WSL2](/install/wsl2/)。

---

## 常見問題

<details>
<summary><strong>為什麼 Intel Mac 不能裝？</strong></summary>

蘋果從 2020 年底開始把 Mac 裡面的處理器從 Intel 換成自己設計的晶片，型號從 M1 開始往上排。Hermes Agent 只支援換過之後的機型[^1]。

**不要用購買年份判斷。** 這場更換不是一天換完的，Intel 機型還繼續賣了好幾年（例如 27 吋 iMac 賣到 2021 年、Mac Pro 賣到 2023 年）。所以 2021 年買的 Mac 也可能是 Intel。唯一可靠的判斷是直接看晶片欄。

這跟記憶體多大、硬碟多空完全無關。很多人是裝到一半才發現的。

**怎麼確認**：點左上角蘋果圖示 →「關於這台 Mac」→ 看「晶片」那一欄。寫 **Apple M** 開頭就可以裝，寫 **Intel** 就不行。

</details>

<details>
<summary><strong>在自己電腦跑 AI，要選哪一個模型？記憶體要多少？</strong></summary>

本機跑 AI 有兩條路，記憶體門檻差一倍以上。**先看你要哪一條，再決定要不要加記憶體。**

**共同的硬性條件**：模型的 context 至少 64K。低於這個數字的模型會在啟動時被 Hermes 直接拒絕[^8]。本機模型的執行工具經常預設低於 64K，要自己去設定[^3]。

### 路線一：用 Ollama（Windows、Linux、Mac 都可以）

裝起來最簡單。官方列出的模型對照表[^3]：

| 模型名稱 | 要多少硬碟 | 要多少記憶體 | 會不會動手做事 | 適合 |
|---|---|---|---|---|
| `gemma4:31b` | 約 20 GB | 24 GB 以上 | **會** | 品質最好 |
| `gemma2:27b` | 約 16 GB | 20 GB 以上 | 不會 | 只能聊天 |
| `gemma2:9b` | 約 5 GB | 8 GB 以上 | 不會 | 快速問答 |
| `llama3.2:3b` | 約 2 GB | 4 GB 以上 | 不會 | 輕量問答 |

「會不會動手做事」這一欄是關鍵。Hermes 的價值在於它會實際改檔案、跑指令、開網頁查資料，這需要模型具備「工具呼叫（tool calling）」的能力。**不具備的模型裝起來會動，但只能跟你聊天**[^3]。

這張表上只有 `gemma4:31b` 會動手做事，所以**走這條路的實際門檻是 24 GB**。完整模型清單見 [Ollama 模型庫](https://ollama.com/library)。

### 路線二：Mac 用 llama.cpp 或 MLX

**這條路的記憶體門檻低很多。** 官方另有一份 Mac 專屬指南，建議的起步模型是 Qwen3.5-9B[^7]：

| 版本 | 硬碟 | 128K context 需要的記憶體 |
|---|---|---|
| Qwen3.5-9B-Q4_K_M（llama.cpp） | 5.3 GB | 約 10 GB（要開量化 KV cache） |
| Qwen3.5-9B-mlx-lm-mxfp4（MLX） | 約 5 GB | 約 12 GB |

官方的記憶體換算法則：**模型本身 + KV cache**。9B 的 Q4 模型約 5 GB，128K context 的 KV cache 用 Q4 量化再加 4 到 5 GB；如果不開量化，同樣的 context 會膨脹到 16 GB[^7]。

- **8 GB Mac**：要開量化 KV cache，**而且要換比 9B 更小的模型**才塞得進 Hermes 的 64K 下限[^7]。算一下就知道 9B 不行：模型 5.3 GB 加 64K 量化 KV cache 約 2 GB 就 7.3 GB，再扣掉 macOS 本身根本不夠
- **16 GB Mac**：可以舒服地跑 9B、128K context
- **32 GB 以上**：才跑得動 27B、35B

而且**這條路的工具呼叫不像 Ollama 那張表被鎖死在 31B**。llama.cpp 加上 `--jinja` 之後，Llama 3.x、Qwen 2.5（含 Coder）、Hermes 2/3、Mistral、DeepSeek、Functionary 這幾個家族原生支援工具呼叫，其他模型走通用處理器也能用，只是效率差一點[^9]。

注意這講的是**模型家族**不是大小。官方另外警告 3B、7B 這類小模型常常無視工具呼叫指令，直接吐純文字而不是結構化的呼叫[^3]。所以「不被鎖死在 31B」不等於「多小都行」。

**所以「本機模型要 24 GB」只對 Ollama + Gemma 那條路成立。** Mac 使用者走 llama.cpp 或 MLX，16 GB 就相當堪用。

### 沒有顯示卡的速度

速度數字是官方數據[^3]；「token 約等於一個中文字」是本站為了好懂做的粗估換算。

| 情況 | 速度 |
|---|---|
| 中型模型 + 8 核心處理器 | 每秒約 10 個字 |
| 大型模型 + 沒有顯示卡 | 每秒約 2 到 5 個字，每次回答等 30 到 120 秒 |

純處理器跑的話可能要把等待上限調長，否則系統會以為當掉而中斷。**多數情況不用手動設**：官方說 Hermes 會自動偵測本機端點（localhost、區網 IP）並放寬串流逾時[^7]。真的還是逾時再設，這是設定檔內容，不是指令：

```bash
# ~/.hermes/.env
HERMES_API_TIMEOUT=1800   # 30 分鐘
```

**預期結果**：存檔後下次啟動生效，大模型不會再答到一半被判逾時。真正管串流的變數是 `HERMES_STREAM_READ_TIMEOUT`[^7]，先試自動偵測，不夠再動它。

</details>

<details>
<summary><strong>官方說的支援分級是什麼意思？</strong></summary>

官方在[平台支援頁](https://hermes-agent.nousresearch.com/docs/getting-started/platform-support)把系統分成三級，決定的是「出問題時官方修不修」[^1]。

- **全力支援**：出問題當第一順位處理。macOS（M 系列）、Windows 10／11、Linux、[WSL2](https://learn.microsoft.com/windows/wsl/install)、[Docker](https://www.docker.com)。
- **盡量支援**：會維護但優先度低，可能說壞就壞。Android 手機（透過 [Termux](https://termux.dev)）、Nix。
- **明說不支援**：不接受相關修復請求。Intel Mac，以及 `pip install`、`uv tool install`、`brew install`、AUR 這幾種安裝管道。

Android 手機另有明確限制[^6]：不能用 Docker、語音轉文字跑不起來、安裝程式會跳過瀏覽器自動化的設定。手機適合當遠端遙控與聊天機器人的那一端，不適合當主力工作機。

</details>

<details>
<summary><strong>Windows 直接裝跟用 WSL2 有什麼差別？</strong></summary>

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
<summary><strong>安裝程式會自動裝什麼？為什麼 Python 3.14 會失敗？</strong></summary>

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
<summary><strong>這頁的數字哪些是官方的、哪些是你們自己測的？</strong></summary>

**官方文件並沒有完整寫過「要什麼硬體」這件事。**

| 這頁的內容 | 來源 |
|---|---|
| 作業系統支援、執行環境、64K context 下限、純處理器速度、功能差異 | 官方文件 |
| **本機模型的「最低配備」欄與顯示卡選購建議** | **本站推算，僅供參考**（官方只寫「顯示卡不需要、記憶體 8 GB」，見上方說明） |
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

**為什麼只能當參考**：你的數字幾乎一定跟我們不同，因為這些都會改變結果，有沒有開瀏覽器功能（開了會多吃幾百 MB）、接了幾個聊天軟體、同時開幾個對話、對話累積多久、裝了哪些額外功能。

請用「量級」判斷，不要拿單一數字當規格：**Hermes 本身是幾百 MB 的量級，不是幾個 GB。把它當成多開一個瀏覽器分頁，不是多開一台虛擬電腦。** 硬碟那個 7.4 GB 尤其不能照抄，聊天紀錄會一直累積，用三個月和用三年差距很大。

如果你量出來的數字跟我們差很多，歡迎[開一個 issue 告訴我們](https://github.com/hansai-art/hermesagent.download/issues/new)，我們會把更多機型的實測補進來。

</details>

## 下一步

- 對應的安裝教學：[macOS](/install/macos/)、[Windows](/install/windows/)、[Linux](/install/linux/)、[WSL2](/install/wsl2/)
- 想比較五種安裝方式：[下載與安裝方式比較](/install/download/)
- 伺服器長駐與容器化：[進階部署](/install/advanced/)

[^1]: Nous Research, Platform Support：https://hermes-agent.nousresearch.com/docs/getting-started/platform-support （2026-07-28 存取）
[^2]: Nous Research, Installation，Prerequisites 段：https://hermes-agent.nousresearch.com/docs/getting-started/installation （2026-07-28 存取）。記憶體與硬碟佔用為本站實測，官方文件無此資料。
[^3]: Nous Research, Run Hermes Locally with Ollama：https://hermes-agent.nousresearch.com/docs/guides/local-ollama-setup （2026-07-28 存取）
[^4]: Nous Research, Windows (Native) Guide，Feature matrix 段：https://hermes-agent.nousresearch.com/docs/user-guide/windows-native （2026-07-28 存取）
[^5]: hermes-agent `pyproject.toml`，`requires-python = ">=3.11,<3.14"` 與其上方註解：https://github.com/NousResearch/hermes-agent/blob/main/pyproject.toml （2026-07-28 存取）
[^6]: Nous Research, Termux，Known limitations on phones 段：https://hermes-agent.nousresearch.com/docs/getting-started/termux （2026-07-28 存取）
[^7]: Nous Research, Local LLM on Mac（llama.cpp / MLX，含 Qwen3.5-9B 記憶體換算）：https://hermes-agent.nousresearch.com/docs/guides/local-llm-on-mac （2026-07-28 存取）
[^8]: Nous Research, Quickstart，「Minimum context: 64K tokens」caution 段：https://hermes-agent.nousresearch.com/docs/getting-started/quickstart （2026-07-28 存取）
[^9]: Nous Research, AI Providers，llama.cpp `--jinja` 與原生工具呼叫模型清單：https://hermes-agent.nousresearch.com/docs/integrations/providers （2026-07-28 存取）
