# CONTRIBUTE_PROMPT — 給 AI 的貢獻指引

> 這份文件是寫給 AI 讀的。使用者只需要把這句話貼給 ChatGPT / Claude / Gemini:
>
> ```
> 讀取 https://raw.githubusercontent.com/hansai-art/hermesagent.download/main/CONTRIBUTE_PROMPT.md
> 的完整內容,然後按照裡面的指示引導我為 hermesagent.download 寫一篇 Hermes Agent 中文文件。
> ```

---

## AI,以下是你的任務

你正在協助一位使用者為 **hermesagent.download**(Hermes Agent 的非官方中文社群知識庫)貢獻一篇文件。
這個站的內容全部是 GitHub 上的 Markdown,任何人都能提 PR。

### 第一步:先問清楚,不要急著寫

先問使用者這三件事(一次問完,不要一題一題來):

1. **你想寫什麼?** 如果他沒有想法,從下面「目前的缺口」挑一個給他選。
2. **你的實際環境是什麼?**(作業系統、Hermes Agent 版本、模型供應商)——這決定文章的適用範圍,不能用猜的。
3. **你是親自做過,還是看來的?** 親自做過的最有價值;看來的要能指出來源。

### 第二步:查目前的缺口

抓這個網址,裡面是系統自動計算的待辦清單(缺口分類、待重新驗證的文章):

```
https://hermesagent.download/api/taskboard.json
```

如果抓不到,就從這些分類挑:`install` 安裝部署、`config` 模型與 API 設定、`skills` 技能目錄、
`integrations` 生態整合、`guides` 使用教學、`troubleshoot` 疑難排解、`migrate` 遷移指南、
`concepts` 核心概念、`community` 社群。

### 第三步:寫文章

輸出一個完整的 Markdown 檔,開頭是 YAML frontmatter:

```yaml
---
title: (具體的標題,不要用「淺談」「初探」這種模糊詞)
description: (一句話說明讀者讀完能做到什麼)
date: (今天日期 YYYY-MM-DD)
subcategory: (小寫英文,例如 windows / provider / telegram)
hermes_version: (適用版本範圍,例如 '>=0.14';真的不確定才寫 '*')
upstream_refs:
  - (官方文件或 GitHub issue 的 URL,至少一筆)
tags: [(2-4 個小寫標籤)]
status: draft
---
```

**寫作規則(這個站的編輯規範,不可違反):**

1. **開場三選一**:場景式(從讀者正在遇到的狀況切入)、結果式(先展示做完會得到什麼)、
   問題式(從一個具體的錯誤訊息出發)。
   ❌ 禁止定義式開場(「Hermes Agent 是一個……」)——那是 `concepts/` 分類專屬寫法。
2. **指令一律放進標好語言的 code fence**(```bash、```powershell、```yaml),
   而且每個關鍵步驟後面要寫「預期輸出」或「怎麼確認成功了」。
3. **重要技術宣稱用 `[^1]` 腳註標來源**,文章底部列出 `[^1]: 來源, 標題 — URL`。
   版本相關的宣稱(「自 vX.Y 起支援」)一定要有來源。
4. **禁止空洞句**:「在當今快速發展的時代」「眾所周知」「扮演著重要的角色」
   「值得一提的是」「總而言之」「希望這篇文章對你有幫助」。
5. **不要整篇條列**。列表只用於三種場景:操作步驟、選項比較、檢查清單。其餘用敘事。
6. **台灣慣用譯名**:伺服器(非服务器)、預設(非缺省)、新手(非小白)、技能(skill)、
   記憶系統(memory)、無伺服器(serverless)。issue / PR / token / MCP / fork 不翻譯。
7. **結尾只能是「下一步」或「常見問題」**,不寫總結段。

### ⚠️ 最重要的一條:不要編造

這是技術文件,寫錯會讓人白白浪費一小時。

- **不確定的指令、參數、版本號、檔案路徑,一律標註「待驗證」**,不要憑印象寫出看起來很合理的東西。
- 你沒有實際執行過這些指令。如果使用者也沒跑過,就在文章裡誠實標明。
- 官方文件在 https://hermes-agent.nousresearch.com/docs ,
  原始碼在 https://github.com/NousResearch/hermes-agent ——查得到就附上連結,查不到就說查不到。

寧可交出一篇標明「這幾步待驗證」的文章,也不要交出一篇看起來完整但有錯的文章。

### 第四步:告訴使用者怎麼送出

輸出文章後,告訴他:

1. 這篇應該放在 `knowledge/<分類>/<檔名>.md`(給他具體路徑)
2. 送出方式二選一:
   - **簡單**:到 https://github.com/hansai-art/hermesagent.download/issues/new?template=02-article-proposal.yml
     開 issue,把文章貼上去,維護者會幫忙上架並掛他的名字
   - **標準**:fork repo → 新增檔案 → 開 PR
3. 提醒他:PR 會自動跑品質掃描(檢查 frontmatter、連結、格式、譯名),
   紅燈不用緊張,照著提示修就好。

---

## 目前的缺口(這份清單每日自動更新)

即時版本:https://hermesagent.download/contribute/#taskboard

## 相關文件

- 完整編輯規範:[docs/editorial/EDITORIAL.md](docs/editorial/EDITORIAL.md)
- 品質檢查清單:[docs/editorial/QUALITY-CHECKLIST.md](docs/editorial/QUALITY-CHECKLIST.md)
- 譯名對照表:[docs/editorial/TERMINOLOGY.md](docs/editorial/TERMINOLOGY.md)
- 引用規範:[docs/editorial/CITATION-SYSTEM.md](docs/editorial/CITATION-SYSTEM.md)
