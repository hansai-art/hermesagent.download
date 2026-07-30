---
title: "Hermes 越用越慢：看到 Preflight compression 時該怎麼辦"
description: "長 session 會讓每輪輸入膨脹，Hermes 進入 preflight compression 後，體感可能從幾秒變成幾十秒。這篇用 macOS v0.17.0 實測 log 說明怎麼判斷、急救與預防。"
date: 2026-07-29
subcategory: "performance"
hermes_version: "0.17.0"
last_verified: 2026-07-29
human_reviewed: false
upstream_refs:
  - "https://hermes-agent.nousresearch.com/docs/reference/faq"
  - "https://hermes-agent.nousresearch.com/docs/user-guide/configuration"
tags:
  - "performance"
  - "compression"
  - "context"
  - "troubleshoot"
status: "published"
---

你一開始用 Hermes 很快，後來同一個 session 做越久越慢。到最後，每次只是請它做一件小事，也像卡住一樣等很久。

這不一定是模型變笨，也不一定是網路壞掉。最常見的原因是：**這條對話已經太肥，Hermes 每輪回答前都要先處理大量歷史上下文**[^4]。

本站在 macOS、Hermes Agent v0.17.0 實測時，`desktop.log` 出現過這類訊號[^3]：

```text
Preflight compression: ~203,947 tokens >= 176,800 threshold
Compression summary failed: Connection error.. Inserted a fallback context marker.
```

同一台機器的 `agent.log` 也看到單輪請求進到 20 萬 token 以上[^3]：

```text
context=~209,578 tokens
in=245810 out=193 total=246003 latency=6.5s cache=245248/245810 (100%)
```

這種情況下，慢不是錯覺。你每問一句，它都背著一整個巨大 session 在跑。

---

## 先看是不是這個問題

打開 Hermes log，不要靠體感猜：

```bash
python3 - <<'PY'
from pathlib import Path
patterns = [
    'Preflight compression',
    'Compression summary failed',
    'Session compressed',
    'context=~',
    'latency=',
]
for name in ['agent.log', 'desktop.log']:
    p = Path.home() / '.hermes/logs' / name
    if not p.exists():
        continue
    print(f'=== {p} ===')
    lines = p.read_text(errors='ignore').splitlines()
    for line in lines[-2000:]:
        if any(s in line for s in patterns):
            print(line[:500])
PY
```

**命中判準**：看到 `Preflight compression`、`Compression summary failed`，或 `context=~` 後面已經是幾萬、十幾萬、二十幾萬 tokens。

如果你只看到偶發的 `HTTP 503`、connection reset，那比較像 provider / upstream 暫時不穩；如果你每一輪都看到巨大 context，才是 session 肥大的問題。

---

## 立刻急救：開新 session，不要硬撐同一條對話

官方 FAQ 對 long conversation 的建議很直接：長對話會累積 messages 與 tool outputs，接近 context limit；可以用 `/compress`，也可以開新 session[^1]。這也是本文把「開新 session」放在急救第一順位的原因[^1]。

實務上，最穩的急救順序是：

1. 如果當前工作還沒結束，先叫 Hermes 寫一份短交接。
2. 開新 session。
3. 把交接摘要貼到新 session，而不是把整條歷史都帶過去。

你可以直接要求：

```text
請用 20 行以內整理目前任務狀態：目標、已改檔案、驗證結果、下一步。不要貼大段 log。
```

然後開新對話繼續。

**成功判準**：新 session 的第一輪不再觸發 preflight compression，或至少 `context=~` 數字大幅下降。

---

## `/compress` 是急救，不是讓你無限續命

在同一場對話中可以輸入：

```text
/compress
```

官方 FAQ 建議用它降低 token usage，保留關鍵 context[^1]。

但你要知道它的限制：compression 本身也需要模型呼叫。當 session 已經很大、provider 又剛好不穩時，compression 也可能失敗。本站實測 log 就出現過：

```text
Compression summary failed: Connection error.. Inserted a fallback context marker.
```

這代表 Hermes 插入 fallback marker，讓 session 能繼續，但摘要品質不一定理想。這時候再硬撐舊 session，通常只會把不穩定延長。

**判斷規則**：

| 狀況 | 建議 |
|---|---|
| 剛開始變慢，任務還在同一主題 | 先 `/compress` |
| 已經 compressed 多次 | 寫交接，開新 session |
| compression 失敗或 fallback | 不要再賭，開新 session |
| 已換主題 | 直接開新 session |

---

## 減少固定負擔：只開這次需要的工具

官方 FAQ 也把 slow responses 的原因列為：large model、distant API server、heavy system prompt with many tools；解法之一是 reduce active toolsets[^1]。

如果你只是做檔案閱讀、repo 修改、查資料，通常不需要把所有工具都開著。新 session 可以用較小工具集啟動：

```bash
hermes chat -t terminal,file,web,skills,todo,memory,session_search
```

如果你只要很快問一個問題，可以更小：

```bash
hermes chat -t terminal,file
```

**成功判準**：用同一個簡單 prompt 測，啟用較少工具時延遲下降：

```bash
/usr/bin/time -p hermes chat -q '只回 OK' -Q -t terminal,file
```

這不是說 browser、vision、image generation、computer use 不好；而是它們不該在每一輪都成為固定成本。

---

## 不要把大型 tool output 留在對話裡

長 session 變慢常常不是因為你講太多，而是工具輸出太大。

幾個高風險行為：

- 一次丟完整 log。
- 讓 agent 讀整份大型檔案。
- 把搜尋結果開太大。
- 貼一整份 Markdown / JSON / HTML。
- 重複讀同一批檔案，讓同樣內容一直進 context。

比較好的做法是：

```text
只讀這份 log 最後 200 行，找 error / timeout / compression 關鍵字。
```

或：

```text
先 search_files 找 symbol，再 read_file 只讀定義附近 120 行。
```

**成功判準**：工具輸出是你下一步會用到的最小片段，而不是「全部先塞進來再說」。

---

## compression.threshold 要小心調

`compression.threshold` 是上下文用到一定比例就開始壓縮。本站 config 參考頁記錄常見預設值為 `0.50`[^2]。

有些重度使用者會把它調高，例如：

```bash
hermes config set compression.threshold 0.65
```

或更高。

但這不是萬靈丹。調高代表「比較晚開始壓縮」，可以減少過早 compression 的頻率；代價是你離真正 context limit 更近，爆掉時會更硬。

建議：

- 新手：先不要亂調，優先開新 session。
- 長任務使用者：可以小幅調高，但每次調完都要做最小測試。
- 已經常常 `context length exceeded`：不要再調高，先拆 session。

檢查目前值：

```bash
hermes config get compression.threshold
```

---

## 什麼時候該懷疑 Desktop renderer，而不是模型？

如果 CLI 還算快，但 Desktop 感覺卡，去看 `desktop.log`。

本站這台機器曾看到：

```text
Uncaught Error: Minified React error #520
```

這類訊號代表 Desktop 前端渲染層也可能出問題。這時候不要只調模型；可以先用 CLI 重跑同一個最小測試：

```bash
/usr/bin/time -p hermes chat -q '只回 OK' -Q
```

判斷方式：

| 結果 | 判斷 |
|---|---|
| CLI 快、Desktop 卡 | 優先查 Desktop / renderer / UI log |
| CLI 也慢 | 優先查 provider、context、toolsets |
| 只有特定模型慢 | 換模型或查 provider latency |
| 只有長 session 慢 | 開新 session / 壓縮 / 減工具輸出 |

---

## 最小 SOP

照這個順序做，不要亂改一堆設定：

1. 查 log：確認是不是 `Preflight compression` 或巨大 `context=~`。
2. 寫 20 行交接摘要。
3. 開新 session。
4. 用較小工具集啟動。
5. 若仍慢，再測 provider / 模型。
6. 真的需要長 session，再小幅調 `compression.threshold`。

## 下一步

- 已經爆 context → [context length exceeded 怎麼解](/troubleshoot/context-length-exceeded/)
- 想看 token 花在哪 → [hermes insights：搞清楚 token 花在哪](/config/insights-token-usage/)
- 想先排除環境問題 → [排錯的正確順序](/troubleshoot/overview/)

[^1]: Nous Research, FAQ：https://hermes-agent.nousresearch.com/docs/reference/faq （2026-07-29 存取）。FAQ 的 Performance Issues 寫到 slow responses 可能來自 heavy system prompt with many tools，建議 reduce active toolsets；high token usage / session getting too long 可用 `/compress`、`/usage` 或開新 session。
[^2]: Nous Research, Configuration：https://hermes-agent.nousresearch.com/docs/user-guide/configuration （2026-07-29 存取）。本站另以 v0.17.0 config 參考整理 `compression.threshold` 常見預設值與 `hermes config` 使用方式。
[^3]: 本站 macOS 實測（Hermes Agent v0.17.0，2026-07-29）：`desktop.log` 命中 `Preflight compression` 與 `Compression summary failed`；`agent.log` 命中多筆 `context=~` 超過 190K tokens 與 API latency 記錄。本文只保留非機密、可泛化的 log 片段。
[^4]: 本站 2026-06 至 2026-07 多次長 session 排查的共同結論：刪少量 skill 只讓 prompt size 小幅下降；真正影響體感的是 session 歷史、tool output、active toolsets 與 compression 狀態。這是本篇把「拆 session」排在「刪 skill」前面的原因。