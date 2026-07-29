---
title: "排程沒跑？先查 gateway、jobs.json 和 output，不要只看 Desktop 畫面"
description: "Hermes cron 的執行者是 gateway daemon，不是你眼前那個聊天視窗。這篇用一個 macOS 週二自動任務的實測案例，教你分辨：排程沒觸發、任務有跑但腳本失敗、任務成功但沒有傳訊息。"
date: 2026-07-29
subcategory: "cron"
hermes_version: "0.17.0"
last_verified: 2026-07-29
human_reviewed: false
upstream_refs:
  - "https://hermes-agent.nousresearch.com/docs/user-guide/features/cron"
  - "https://hermes-agent.nousresearch.com/docs/reference/faq"
tags:
  - "cron"
  - "gateway"
  - "troubleshoot"
  - "macos"
status: "published"
---

你排了一個每週固定跑的 Hermes 任務，到了時間卻沒有收到任何訊息。第一個直覺通常是：「cron 壞了」。

先不要急著重建任務。Hermes 的 cron 有三個不同層次，症狀看起來很像，但根因完全不同：

1. **排程器沒跑**：gateway daemon 沒有 tick，任務根本沒被觸發[^1]。
2. **任務有跑，但腳本或 agent 失敗**：`last_status` 會記失敗，output 裡會有錯誤。
3. **任務成功，但你以為它會傳回 CLI**：CLI 建立的 cron 預設是 local delivery，只把結果存到 `~/.hermes/cron/output/`，不會跳回現在這個終端機視窗[^1]。

本站在 macOS、Hermes Agent v0.17.0 上實測過一次週二自動任務[^2]。最後的修正不是「重建排程」，而是把任務改成可稽核：每次輸出 `STATUS`、`STATE`、`ACTIONS`，再用 cron 本體手動觸發確認 `last_status: ok`。

---

## 先確認 gateway 真的在跑

Hermes 官方文件寫得很明確：cron execution 由 **gateway daemon** 處理；scheduler 每 60 秒 tick 一次，載入 `~/.hermes/cron/jobs.json`，檢查 `next_run_at`，再執行到期任務[^1]。所以排程排好了，不代表只要 Desktop 視窗還在就一定會跑；真正要確認的是 gateway scheduler 是否健康[^1]。

先跑：

```bash
hermes cron status
```

**成功判準**：你要看到 gateway 正在執行，並且 cron scheduler 狀態不是停掉。

如果 gateway 沒跑，排程時間到了也不會有任何事發生。這時候不要修 job prompt，先啟動 gateway[^3]：

```bash
hermes gateway install
hermes gateway
```

macOS 桌面版使用者要特別注意：**Desktop app 開著不等於 cron daemon 一定健康**。你看到聊天畫面能用，只代表互動 surface 在，不代表排程器已經順利 tick。

---

## 再看任務本身的 metadata

列出 cron 任務[^1]：

```bash
hermes cron list
```

你要確認四件事：

| 欄位 | 要看什麼 |
|---|---|
| `schedule` | cron 表達式是不是你以為的時間 |
| `next_run_at` | 下一次執行時間是否合理 |
| `last_run_at` | 上一次是否真的有跑 |
| `last_status` / `last_error` | 是成功、失敗，還是根本沒更新 |

本站這台 macOS 的實測任務，在修正後回讀到：

```text
schedule: 1 7 * * 2
last_run_at: 2026-07-28T07:01:54+08:00
next_run_at: 2026-08-04T07:01:00+08:00
last_status: ok
last_error: None
```

這種狀態代表：**排程器有跑、任務也成功結束**。如果你沒有收到聊天通知，問題就不是「任務沒執行」，而是 delivery 目標或你對 CLI 行為的期待不對。

---

## CLI cron 的結果預設存在本機，不會回到這個終端機

這是很容易誤判的一點。

官方 cron 文件寫：delivery option `local` 會把結果保存到 `~/.hermes/cron/output/`，而 CLI 預設就是 local[^1]。本站的 CLI 環境也實測相同：cron job 結束後，結果會變成 Markdown 檔案，而不是在原本那個 terminal 跳出通知。

檢查方式：

```bash
python3 - <<'PY'
from pathlib import Path
root = Path.home() / '.hermes/cron/output'
for p in sorted(root.glob('*/*.md'), key=lambda x: x.stat().st_mtime, reverse=True)[:10]:
    print(p)
PY
```

**成功判準**：看到對應 job id 底下產生新的 `.md` 輸出檔。

如果你要真的收到 Telegram、Discord、Slack 等訊息，建立或編輯任務時就要指定 delivery target，例如 `--deliver telegram`[^1]。不要期待 CLI 的 `origin` 或預設 delivery 會在現在這個 terminal session 即時把訊息丟回來[^4]。

---

## 用 `hermes cron run` 做一次手動驗證

真正可靠的驗證不是等下週，而是直接用 cron 本體觸發[^1]：

```bash
hermes cron run <job_id_or_name>
```

然後立刻檢查 output 與 metadata：

```bash
python3 - <<'PY'
import json
from pathlib import Path

job_id = '<your_job_id>'
jobs_path = Path.home() / '.hermes/cron/jobs.json'
out_dir = Path.home() / '.hermes/cron/output' / job_id

latest = sorted(out_dir.glob('*.md'), key=lambda p: p.stat().st_mtime)[-1]
print('OUTPUT_FILE', latest)
print(latest.read_text()[:1200])

with jobs_path.open() as f:
    data = json.load(f)
jobs = data['jobs'] if isinstance(data, dict) else data
job = next(j for j in jobs if j['id'] == job_id)
print('LAST_STATUS', job.get('last_status'))
print('LAST_ERROR', job.get('last_error'))
PY
```

**成功判準**：

```text
LAST_STATUS ok
LAST_ERROR None
```

如果 output 檔裡有你的任務輸出，代表 cron 路徑通了。接下來才看腳本或 prompt 本身是否做對事。

---

## 如果是 GUI 自動化任務，要讓腳本自己回報狀態

本站這台機器的週二任務不是單純發提醒，而是用 no-agent script 做 GUI 自動化[^2]。這類任務最怕「其實已成功，但腳本不知道成功，於是又重跑一次」。

實測踩過的坑是：腳本第一次已經進到會議內，但沒有先檢查既有狀態，下一輪又開新 join flow，造成狀態互撞。修正後，腳本每次開頭先掃既有 Chrome Zoom tab：

- 已在會議或 waiting room：輸出 `STATUS: ALREADY_JOINED`，不再重複登入。
- 還沒進去：才開新 tab 走加入流程。
- 最後一定輸出 `STATE` 與 `ACTIONS`，方便看它到底做了什麼。

建議你的 script output 至少包含：

```text
STATUS: SUCCESS | FAILED | ALREADY_JOINED
STATE: in_meeting | waiting_for_host | unknown
ACTIONS: none | join | continue-no-av
ERROR: <失敗時才印>
```

這樣下次排錯時，你不必猜「到底有沒有跑」，看 output 就知道是哪一層壞。

---

## 判斷表

| 你看到的現象 | 比較可能的原因 | 下一步 |
|---|---|---|
| `next_run_at` 過了但 `last_run_at` 沒更新 | gateway / scheduler 沒 tick | 查 `hermes cron status` 與 gateway log |
| `last_status` 是 failed | 任務本身失敗 | 讀 `~/.hermes/cron/output/<job_id>/` 最新檔 |
| `last_status` 是 ok，但沒有收到訊息 | delivery target 不是你以為的地方 | 確認 CLI local output 或改 `--deliver telegram` |
| output 顯示成功後又失敗 | 腳本缺少成功短路判斷 | 先偵測既有狀態，再決定是否重跑流程[^5] |
| output 完全沒有新檔 | job 沒被執行或 job id 看錯 | `hermes cron list` 重新確認 id / name |

## 下一步

- 先看整體環境 → [hermes doctor 到底檢查什麼](/troubleshoot/hermes-doctor/)
- 搞懂 config 與本機檔案 → [config.yaml 是什麼](/config/config-yaml-reference/)
- 任務跑很久又變慢 → [長 session 變慢與 preflight compression](/troubleshoot/long-session-preflight-compression/)

[^1]: Nous Research, Scheduled Tasks (Cron) — https://hermes-agent.nousresearch.com/docs/user-guide/features/cron（2026-07-29 存取）。官方文件說明 cron 由 gateway daemon 執行、每 60 秒 tick、CLI 的 local delivery 會保存到 `~/.hermes/cron/output/`、可用 `hermes cron run/list/status` 管理。
[^2]: 本站 macOS 實測（Hermes Agent v0.17.0，2026-07-29）：no-agent cron job 手動 `hermes cron run` 後產生 output Markdown，回讀 `jobs.json` 顯示 `last_status: ok`、`last_error: None`。私人會議 URL、參與者名稱與 chat id 已刻意不寫入本文。
[^3]: 本站實測排錯順序（macOS、Hermes Agent v0.17.0，2026-07-29）：先用 `hermes cron status` 確認 gateway，再用 `hermes cron list` 對照 `last_run_at` / `next_run_at`，最後才讀 output。這個順序能避免把 daemon 問題誤修成 prompt 問題。
[^4]: 本站 CLI 環境限制（2026-07-29）：本機終端機沒有持續訊息投遞通道；若 cron job 只設定 local / 預設 delivery，結果只能由檔案回讀。需要通知就要送到 gateway-connected platform，例如 Telegram 或 Discord。
[^5]: 本站 GUI 自動化任務踩坑（macOS、Hermes Agent v0.17.0）：成功狀態沒有短路時，腳本可能在已進入目標狀態後又重跑流程，造成「成功後又失敗」的假象。修正方式是先偵測既有狀態，再決定是否執行下一步。