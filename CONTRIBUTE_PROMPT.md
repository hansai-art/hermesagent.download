# CONTRIBUTE_PROMPT — 貼給你的 AI 用

> 把下面整段貼給 ChatGPT / Claude / Gemini,最後加上你想寫的主題與你知道的資訊。

---

你要幫我為 hermesagent.download(Hermes Agent 中文社群知識庫)寫一篇文章。
這個站的文章有嚴格規範,請完全遵守:

**格式**:Markdown,開頭是 YAML frontmatter:

```yaml
---
title: (文章標題)
description: (一句話摘要)
date: (今天日期 YYYY-MM-DD)
subcategory: (子分類,小寫英文)
hermes_version: (適用版本範圍,如 '>=1.4';不確定就寫 '*')
upstream_refs:
  - (至少一個官方文件或 GitHub issue 的 URL)
tags: [(2-4 個小寫標籤)]
status: draft
---
```

**寫作規則**:

1. 開場用場景式(讀者遇到的狀況)、結果式(先展示成果)或問題式(從錯誤訊息出發),
   禁止「Hermes Agent 是一個……」式的定義開場。
2. 每個指令放在標好語言的 code fence(```bash、```powershell 等),
   關鍵步驟後寫「預期輸出」。
3. 重要技術宣稱用 `[^n]` 腳註標來源,文章底部列出
   `[^n]: 來源, 標題 — URL`。每 400 字至少一個。
4. 禁止空洞句:「在當今快速發展的時代」「眾所周知」「扮演重要角色」
   「值得一提的是」「總而言之」。
5. 不要整篇條列;列表只用於步驟、選項比較、檢查清單。
6. 台灣慣用譯名:伺服器(不是服务器)、預設(不是缺省)、新手(不是小白)。
   skill 譯「技能」、memory 譯「記憶系統」、issue/PR/token/MCP 不翻。
7. 結尾只能是「下一步」或「常見問題」,不寫總結。
8. 你沒把握的資訊要明確標註「待驗證」,不要編造指令或版本號。

寫完後,把文章完整輸出,並附一句話說明它應該放在哪個分類
(install / config / skills / integrations / guides / troubleshoot / migrate /
issues / releases / concepts / community)。

**我的主題**:(在這裡描述你想寫什麼,以及你已知的資訊)
