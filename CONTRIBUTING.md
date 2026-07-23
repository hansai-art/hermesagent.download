# 貢獻指南

> 你花三小時才解開的錯誤,下一個人只要三分鐘。
> 這個站的內容大多由 AI 起草、由人補完——你不需要從零寫一篇文章。

**先看這裡**:[hermesagent.download/contribute](https://hermesagent.download/contribute/) 有互動版本,
包含系統每日自動計算的待辦清單(哪些分類缺文章、哪些教學該重新驗證)。

---

## 最省力的四條路

### 🟢 回報一個錯誤(2 分鐘)

看到指令跑不動、內容過期、連結壞掉——[開一個 issue](https://github.com/hansai-art/hermesagent.download/issues/new?template=01-content-error.yml) 就好,不用自己修。
不需要會 Markdown、不需要 fork,中文填表單即可。

### 🟡 直接改一頁(10 分鐘)

每篇文章底部都有「✏️ 編輯這一頁」。點下去就是 GitHub 編輯器,改完自動幫你開 PR。
改錯了也沒關係,PR 會有人審,自動化也會幫你檢查格式。

### 🤖 捐出你的 AI 額度(15 分鐘)

每個月的 AI 訂閱額度用不完?貼這句話給 ChatGPT / Claude / Gemini:

```
讀取 https://raw.githubusercontent.com/hansai-art/hermesagent.download/main/CONTRIBUTE_PROMPT.md
的完整內容,然後按照裡面的指示引導我為 hermesagent.download 寫一篇 Hermes Agent 中文文件。
```

AI 會自己讀完編輯規範、抓取目前的缺口清單、產出符合格式的文章。
**你不需要自己寫任何一個字**,只要把結果過目一遍再送出。

### 🔴 Fork & PR(看你寫多少)

```bash
git clone https://github.com/hansai-art/hermesagent.download
cd hermesagent.download
npm install          # 會自動同步 knowledge/ → src/content/
npm run dev          # http://localhost:4321
npm run article-health   # 品質掃描,無 ERROR 才發 PR
```

內容全部在 `knowledge/` 下,純 Markdown。改內容不需要碰任何程式碼。

---

## 寫新文章的流程

1. 讀 [docs/editorial/REWRITE-PIPELINE.md](docs/editorial/REWRITE-PIPELINE.md):Research → Write → Verify 三階段
2. 用 [docs/editorial/RESEARCH-TEMPLATE.md](docs/editorial/RESEARCH-TEMPLATE.md) 做研究筆記(claim 對 source)
3. 在 `knowledge/<分類>/` 新增 `.md`,frontmatter 規格見 [README](README.md)
4. **在乾淨環境實測一次**,通過後把 `last_verified` 設為今天
5. 跑 `npm run article-health`,對照 [QUALITY-CHECKLIST.md](docs/editorial/QUALITY-CHECKLIST.md)
6. 發 PR,description 附上研究筆記

### 不要編造

這是技術文件,寫錯會讓人白白浪費一小時。不確定的指令、參數、版本號,
一律標註「待驗證」——寧可交出標明不確定的文章,也不要交出看起來完整但有錯的。

---

## 你會得到什麼

- **署名**:所有貢獻者出現在[貢獻者牆](https://hermesagent.download/dashboard/)與 GitHub 貢獻者名單。
  回報錯誤、提供資訊也算——不只寫程式的人才算數。
- **被搜尋、被 AI 引用**:內容是公開靜態網頁,對搜尋引擎與 AI 爬蟲友善(站上有 `llms.txt`)。
- **可展示的開源履歷**:commit 與 PR 是公開紀錄,持續貢獻可取得 repo 權限。
- **你的判斷會變成規範**:審稿意見會回寫進 `docs/editorial/`,你踩過的坑會變成後來所有人遵循的標準。

## 貢獻者的四個階段

不是階級,是隨著熟悉度自然擴大的權限範圍。

| 階段 | 進入條件 | 你可以做什麼 |
|---|---|---|
| 🌱 貢獻者 | 第一個 PR 被合併 | 寫文章、改文章、開 issue |
| 🌿 資深貢獻者 | 3+ 個 PR 合併、品質穩定 | GitHub Triage 權限(整理 issue、標籤)、審 PR、列入 REVIEWERS.md |
| 🌳 維護者 | 10+ PR、跨 2 個分類、3+ 次審稿、活躍一個月以上 | 合併 PR、repo 寫入權限、參與方向決策 |
| 🏔️ 核心 | 邀請制 | 管理權限、方針最終裁決 |

**關於不活躍**:60 天沒動作不會有任何事;90 天以上我們會友善問候一下,權限暫時收回但
隨時一句話就能復原。想休息隨時可以說,不是什麼丟臉的事。

## 專業角色(不分階段,隨時可認領)

- 🔍 **實測員** — 專門把教學在乾淨環境跑一遍,更新 `last_verified`
- 🌐 **翻譯官** — 之後開英文版時的主力
- 📸 **圖表貢獻者** — 補截圖、流程圖
- 🤖 **自動化維護** — 顧 pipeline 與品質掃描器
- ✍️ **編輯** — 統一語氣、修正譯名

想認領?開一個 issue 說一聲就好。

---

## 行為準則

- 對事不對人;技術爭議以可查證來源為準
- 尊重不同經驗程度——每個人都當過新手,不嘲笑任何問題
- 本站與 Nous Research 無關,不代表官方立場;下載連結一律指向官方

完整版:[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).治理方式:[GOVERNANCE.md](GOVERNANCE.md)
