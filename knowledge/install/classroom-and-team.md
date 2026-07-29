---
title: "開課與團隊導入：學員電腦要準備什麼"
description: "給講師與團隊負責人的準備清單。統一走雲端模型、不要求顯示卡、開課前七項檢查，以及四個會在教室現場炸掉的坑：Intel Mac、Claude Pro 不能用、公司網路擋 OAuth、Python 3.14。"
date: 2026-07-28
subcategory: "classroom"
hermes_version: ">=2026.5"
last_verified: 2026-07-28
human_reviewed: false
upstream_refs:
  - "https://hermes-agent.nousresearch.com/docs/getting-started/platform-support"
  - "https://hermes-agent.nousresearch.com/docs/getting-started/installation"
  - "https://hermes-agent.nousresearch.com/docs/integrations/providers"
  - "https://hermes-agent.nousresearch.com/docs/integrations/nous-portal"
  - "https://hermes-agent.nousresearch.com/docs/user-guide/features/tool-gateway"
tags:
  - "install"
  - "classroom"
  - "onboarding"
  - "requirements"
status: "published"
---

這頁是給**辦課程、帶團隊導入**的人看的。如果你是要確認自己那台電腦，請看[最低配置一覽](/install/system-requirements/)。

**一句話結論**：統一規定「雲端模型 + 不要求顯示卡」，把所有硬體問題壓成一條線：**建議 16 GB 記憶體、30 GB 硬碟，而且不能是 Intel Mac**。真正會讓現場卡住的不是硬體，是帳號和網路。

---

## 一、公告給學員的建議配備

直接抄這段貼進報名頁或行前信：

- **作業系統**：Windows 10／11、macOS（**M1 以後的機型**）、Ubuntu 或 WSL2 都可以
- **記憶體 (RAM)**：**建議 16 GB**；最低 8 GB 也能跑完整堂課，只是同時開瀏覽器與編輯器時會頓
- **儲存空間**：**建議預留 30 GB**；最低 20 GB
- **顯示卡 (GPU)**：**不需要**
- **網路**：全程需要連線
- **不能參加的機型**：Intel 處理器的 Mac，官方明確不支援[^1]。**不能用購買年份判斷**，Intel 機型一路賣到 2023 年，要看「關於這台 Mac」的晶片欄

作業系統那一條是硬性條件不是建議，低於就是裝不起來。記憶體與硬碟則是體驗差異，8 GB 的學員不用勸退。

**不要**在第一堂課要求學員在自己電腦跑 AI 模型。那條路要 16 GB 起跳、設定複雜、速度慢，會把課程時間全部吃在排除故障上。想教的話另外開一堂。

## 二、模型要怎麼準備（這才是真正的門檻）

Hermes 一定要接一個模型供應商才能動[^3]。**開課前必須先決定用哪一種，並確認每位學員都已經有帳號。**

| 方式 | 適合 | 要注意 |
|---|---|---|
| **Nous Portal** | 官方推薦，一次 OAuth 就搞定模型與工具 | **要付費訂閱，沒有免費方案**[^4] |
| **OpenRouter** | 自由度高，可自選模型 | 學員各自要有 API 金鑰與餘額 |
| **學員自己的訂閱** | 省錢 | 限制多，見下方常見問題 |

**最省事的做法**：統一走 Nous Portal，一行 `hermes setup --portal` 就同時完成模型與工具設定[^4]。缺點是每個人都要有訂閱。

**最省錢的做法**：讓學員用自己既有的 AI 訂閱。但這條路有明確的地雷，開課前一定要讀下方的常見問題。

## 三、開課前七項檢查

行前信裡請學員逐項回覆，**不要等到現場才發現**：

1. 作業系統版本，Mac 要附上「晶片」欄寫什麼
2. 記憶體大小
3. 可用硬碟空間
4. `git --version` 有沒有回應（macOS 與 Linux）
5. Linux 使用者是否已裝 `curl` 與 `xz-utils`
6. 模型供應商帳號是否已開通、是否已有餘額或訂閱
7. 上課場地的網路能不能開 OAuth 登入視窗

第 6 和第 7 項是最常炸的兩項，而且都不是硬體問題。

## 四、四個會在教室現場炸掉的坑

1. **Intel Mac** — 學員規格再好都裝不起來，而且不是「舊電腦才會中」，2021 到 2023 年買的 Mac 也可能是 Intel。行前信一定要問「晶片」那一欄寫什麼。
2. **Claude Pro 訂閱不能用** — 官方只支援 Claude Max 而且要另外購買 extra usage 額度，Pro 方案走不通[^3]。這一條最容易讓人白跑。
3. **公司或學校網路擋掉 OAuth** — 多數供應商用瀏覽器彈窗登入，內網環境常常開不起來。前一天請學員在家先登入一次。
4. **學員自己裝過 Python 3.14** — 會裝到一半失敗。請他們不要自己先裝 Python，交給官方安裝程式處理[^5]。

---

## 常見問題

<details>
<summary><strong>可以讓學員用自己既有的 AI 訂閱嗎？哪些可以、哪些不行？</strong></summary>

省錢但限制多，開課前務必逐一確認[^3]。

| 學員手上的訂閱 | 能不能用 | 說明 |
|---|---|---|
| ChatGPT | 可以 | 走 OpenAI Codex 的 OAuth 登入 |
| **Claude Pro** | **不行** | 官方明確寫 Pro 訂閱者無法使用這條路徑 |
| Claude Max | 可以，但有條件 | 必須另外購買 extra usage 額度。Max 方案本身包含的用量不會被 Hermes 消耗 |
| Qwen | 可以 | Qwen OAuth，瀏覽器登入 |
| MiniMax | 可以 | MiniMax OAuth，瀏覽器登入 |
| 各家 API 金鑰 | 可以 | OpenAI、Anthropic、Gemini、DeepSeek 等，填進設定檔即可 |

Claude 那一條是最大的陷阱：報名時問「你有 Claude 訂閱嗎」會得到很多「有」，但 Pro 跟 Max 差很多。**要問的是「你的是 Pro 還是 Max，Max 的話有沒有加購 extra usage」。**

</details>

<details>
<summary><strong>開課要不要統一買 Nous Portal？</strong></summary>

官方推薦這條路，理由是一次 OAuth 就把模型與工具全部接好[^4]。

不用 Portal 的話，要讓 Hermes 具備完整能力，得自己去申請這些帳號[^6]：

| 功能 | 沒有 Portal 就要自己接 |
|---|---|
| 網路搜尋與整頁擷取 | Firecrawl |
| 圖像生成 | FAL |
| 文字轉語音 | OpenAI TTS |
| 雲端瀏覽器自動化 | Browser Use |

五個註冊流程、五個後台、五筆儲值。Portal 把這些全部收在同一份訂閱裡[^6]。

**對開課的意義**：如果課程會示範網路搜尋或讓 agent 自己開瀏覽器，走 Portal 是唯一不會在準備階段爆炸的路。要學員各自去申請 Firecrawl 與 Browser Use，第一堂課就會過不完。

</details>

<details>
<summary><strong>教室網路撐得住三十個人同時安裝嗎？</strong></summary>

**安裝會下載什麼**：官方安裝程式會自動抓 Python 3.11、Node.js v22、ripgrep、ffmpeg，還有專案本體[^5]。程式裝完約 2.8 GB。

**如果場地網路很慢**，可以請學員跳過瀏覽器自動化的元件，安裝會快很多[^5]。下面這一行是從 Hermes 官方網域（`hermes-agent.nousresearch.com`）下載官方安裝腳本並執行，`--skip-browser` 是官方提供的旗標，作用是略過 Playwright 瀏覽器元件的下載：

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash -s -- --skip-browser
```

**預期輸出**：安裝流程照跑，但會略過 Playwright 瀏覽器的下載步驟。之後要用瀏覽器功能再補裝即可。

**更保險的做法**：行前信就請學員在家裝好，上課只驗收。開課當天再讓三十個人同時下載幾 GB，多數場地的網路撐不住。

驗收指令：

```bash
hermes doctor
```

**預期輸出**：一份逐項檢查清單，正常時每項都顯示通過，最後印出偵測到的安裝方式。請學員把這個結果截圖回傳。

</details>

<details>
<summary><strong>工程師學員想在自己電腦跑模型，要準備什麼？</strong></summary>

這是進階需求，不要放進基礎課程。真的要教的話，門檻是：

- **記憶體**：16 GB 起跳，32 GB 以上才跑得動大模型
- **儲存空間**：30 GB 以上
- **顯示卡**：NVIDIA **顯示記憶體 12 GB 以上**，或 Apple M 系列統一記憶體 16 GB 以上。官方寫顯示卡「不需要」，但純處理器每次回答要等 30 到 120 秒，課堂上等於停擺
- **模型的 context 必須 64K 以上**，這是 Hermes 的硬性要求，不夠會在啟動時被擋下來

完整說明與兩條路線的差異見[最低配置一覽](/install/system-requirements/)。

**教學上的建議**：本機模型的回答速度可能是每次 30 到 120 秒。這在課堂上等於整段課停擺，示範用雲端、把本機模型留成回家作業。

</details>

## 下一步

- 學員自己確認電腦：[最低配置一覽](/install/system-requirements/)
- 各系統安裝步驟：[macOS](/install/macos/)、[Windows](/install/windows/)、[Linux](/install/linux/)、[WSL2](/install/wsl2/)
- 五種安裝方式比較：[下載與安裝方式比較](/install/download/)

[^1]: Nous Research, Platform Support：https://hermes-agent.nousresearch.com/docs/getting-started/platform-support（2026-07-28 存取）
[^3]: Nous Research, AI Providers，含 Claude Max「extra usage」限制的 caution 段：https://hermes-agent.nousresearch.com/docs/integrations/providers（2026-07-28 存取）
[^4]: Nous Research, Nous Portal：https://hermes-agent.nousresearch.com/docs/integrations/nous-portal（2026-07-28 存取）
[^5]: Nous Research, Installation，含 `--skip-browser` 旗標：https://hermes-agent.nousresearch.com/docs/getting-started/installation（2026-07-28 存取）
[^6]: Nous Research, Tool Gateway：https://hermes-agent.nousresearch.com/docs/user-guide/features/tool-gateway（2026-07-28 存取）
