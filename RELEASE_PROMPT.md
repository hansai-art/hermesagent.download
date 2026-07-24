# RELEASE_PROMPT — 把上游新版變成一篇中文版本情報

> 這份文件是寫給 AI 讀的。當上游 Hermes Agent 發布新版時,
> UPSTREAM-WATCH pipeline 會自動開一個 issue,裡面附上這份 prompt 的貼法與該版的 release notes。
> 使用者(或使用者捐出的 AI 額度)把整段貼給 ChatGPT / Claude / Gemini,就能產出可直接 PR 的文章。

---

## AI,以下是你的任務

你要把一份 Hermes Agent 的官方 release notes(英文)寫成一篇**中文版本情報**,
放進 hermesagent.download 的 `releases/` 分類。目標讀者是中文使用者,他們想快速知道:
**這一版有什麼值得在意的、對我現在的用法有沒有影響。**

### 輸出格式

一個完整的 Markdown 檔,開頭是 YAML frontmatter:

```yaml
---
title: "(版本號 + 一句話講最重要的改動,例如「v0.19.0:第一個 token 快了八成」)"
description: "(這一版最有感的 2-3 個重點,一句話帶過)"
date: (release 發布日期 YYYY-MM-DD)
subcategory: "release"
hermes_version: "(這一版的 semver,例如 0.19.0)"
last_verified: (今天日期 YYYY-MM-DD)
human_reviewed: false
upstream_refs:
  - "(這個 release 的 GitHub 網址)"
tags: [release, changelog]
status: "published"
---
```

檔名用日曆版號、點改成連字號,例如 `v2026-7-20.md`。

### 寫作規則(這個站的編輯規範)

1. **開場用結果式或場景式**,不要用「v0.19.0 是一個…」這種定義式開場。
   好的開場直接切入讀者的感受,例如「如果你之前覺得它每次回答前都要深呼吸一下——那口氣沒了」。
2. **不要把 release notes 逐條翻譯**。挑對中文使用者最有感的 5-8 項,其餘略過。
   判斷標準:速度、費用、日常會用到的功能 > 內部重構、邊緣功能。
3. **每一項用小標題 + 一段白話說明**,講清楚「這是什麼、對我有什麼差別」。
   數字要保留(例如「4.3 秒降到 0.9 秒」比「大幅提速」有用)。
4. **技術宣稱用 `[^n]` 腳註標來源**,對到 release 網址或 release notes 裡的 PR 連結。
   每 400 字至少一個引用。
5. **一定要有「這一版對你既有設定有影響嗎」一節**——這是版本情報最有價值的部分。
   指出:預設行為變了的地方、可能讓現有教學過期的改動、需要使用者動手的地方。
6. **台灣慣用譯名**:伺服器、預設、供應商、記憶系統;token / gateway / session / PR 不翻。
7. 結尾是「下一步」,連到安裝、設定、issue 等相關頁。

### ⚠️ 最重要:不要編造

- release notes 沒寫清楚的細節(某個新功能怎麼設定、怎麼關掉),**標「待驗證」並附編輯連結**,
  不要自己補一個看起來合理的用法。
- 你沒有實際跑過這一版。功能的「效果」照 release notes 寫,但「怎麼操作」如果 notes 沒講,就說 notes 沒講。
- 版本號、日期、PR 編號要跟 release notes 一致,不要記錯。

### 參考範例

`knowledge/releases/v2026-7-20.md` 是一篇寫好的範例,結構、語氣、腳註密度都可以照它來。

### 產出後怎麼送出

告訴使用者:

1. 存成 `knowledge/releases/(檔名).md`
2. 送出方式:到 hermesagent.download 對應的 repo 開 PR,或開一個 issue 把文章貼上去讓維護者處理
3. PR 會自動跑品質掃描,紅燈照提示修

---

## 完整編輯規範

- 寫作方法論:[docs/editorial/EDITORIAL.md](docs/editorial/EDITORIAL.md)
- 引用規範:[docs/editorial/CITATION-SYSTEM.md](docs/editorial/CITATION-SYSTEM.md)
- 譯名對照:[docs/editorial/TERMINOLOGY.md](docs/editorial/TERMINOLOGY.md)
