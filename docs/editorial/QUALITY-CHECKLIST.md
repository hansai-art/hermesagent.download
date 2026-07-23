# QUALITY-CHECKLIST.md — 發文前檢查清單

PR 前逐項打勾。審稿者用同一份清單審。

## 1. Frontmatter

- [ ] `title` / `description` / `date` 齊全
- [ ] `hermes_version` 已填,且與實測環境一致
- [ ] `upstream_refs` 至少一筆官方來源
- [ ] `last_verified` = 最後實測日期(教學類必填)
- [ ] 分類與 `subcategory` 放對位置

## 2. 結構

- [ ] 開場是場景式 / 結果式 / 問題式之一(concepts/ 可用定義式)
- [ ] 每個關鍵步驟有預期輸出或成功判準
- [ ] 沒有 list-dump(列表只用於步驟、比較、檢查清單)
- [ ] 結尾是「下一步」或「常見問題」,沒有總結段

## 3. 引用密度

- [ ] 重要技術宣稱都有 `[^n]` 腳註或 `upstream_refs` 對應
- [ ] 外部連結都是官方或可信來源,沒有內容農場

## 4. 塑膠掃描

- [ ] `npm run article-health` 無 ERROR
- [ ] 掃描器的 WARN 都看過並處理(或在 PR 說明為何保留)

## 5. 實測

- [ ] 乾淨環境從頭照做過一次
- [ ] 所有 code fence 都標了語言
- [ ] 指令輸出與文章描述一致

## 6. Commit

- [ ] 一篇文章一個 commit(或邏輯上獨立的變更一個 commit)
- [ ] commit message 說明「為什麼」而不只是「改了什麼」
