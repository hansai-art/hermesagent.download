# 貢獻指南

感謝你想讓 Hermes Agent 的中文資源更好!四條路,任選:

## 1. 請你的 AI 幫你寫(最快)

把 [CONTRIBUTE_PROMPT.md](CONTRIBUTE_PROMPT.md) 整份貼給 ChatGPT / Claude / Gemini,
加上你想寫的主題,AI 會產出符合本站規範的文章。再開 PR 或開 issue 附上內容。

## 2. 直接在 GitHub 上編輯

1. 進 `knowledge/` 找到要改的文章,點鉛筆圖示編輯
2. 送出後 GitHub 會引導你 fork + 發 PR
3. CI 會自動跑品質掃描,審稿者依 `docs/editorial/QUALITY-CHECKLIST.md` 審

## 3. 開 issue

不想動手寫?開 issue 回報錯誤、提議新文章、認領翻譯都歡迎。

## 4. 完整開發流程(寫新文章)

1. 讀 `docs/editorial/REWRITE-PIPELINE.md`(Research → Write → Verify)
2. 用 `docs/editorial/RESEARCH-TEMPLATE.md` 做研究筆記
3. 在 `knowledge/{分類}/` 新增 `.md`,frontmatter 規格見 README
4. 本地驗證:

```bash
npm install
npm run article-health   # 無 ERROR 才發 PR
npm run dev              # 預覽
```

5. 發 PR,PR description 附上研究筆記

## 行為準則

- 尊重每一位貢獻者,對事不對人
- 技術宣稱要有來源;不確定就標明不確定
- 本站與 Nous Research 無關,不代表官方立場;下載連結一律指向官方
