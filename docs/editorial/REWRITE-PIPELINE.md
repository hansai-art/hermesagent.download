# REWRITE-PIPELINE.md — 三階段寫作流程

> Research → Write → Verify。每篇新文章與重寫都走這條流水線,品質關卡不可跳過。

## Stage 1 — Research(研究)

用 RESEARCH-TEMPLATE.md 蒐集事實,產出研究筆記:

- 官方文件、README、release notes 的相關段落(附 URL)
- 相關 GitHub issues / discussions(附編號與 URL)
- 每個「將要寫進文章的宣稱」都先配好來源
- 確認適用的 `hermes_version` 範圍

**關卡**:研究筆記裡沒有來源的宣稱,不准進入 Stage 2。

## Stage 2 — Write(寫作)

依 EDITORIAL.md 的方法論寫作:

- 選定開場模式(場景式 / 結果式 / 問題式)
- 指令與設定檔全部放進標好語言的 code fence
- 重要宣稱掛 `[^n]` 腳註(CITATION-SYSTEM.md)
- 填齊 frontmatter:`title` `description` `date` `hermes_version` `upstream_refs`

## Stage 3 — Verify(驗證)

**技術文件的靈魂**。發 PR 前:

1. 在乾淨環境(新 VM / 容器 / 新使用者帳號)把文章從頭到尾照做一次
2. 每個指令的實際輸出與文章寫的「預期輸出」比對
3. 通過後把 `last_verified` 設為今天
4. 跑 `npm run article-health` 確認無 ERROR
5. 過一遍 QUALITY-CHECKLIST.md

**關卡**:沒實測過的教學不設 `last_verified`,審稿者可要求補測。
