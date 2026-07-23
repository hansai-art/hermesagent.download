# GOVERNANCE.md — 治理與決策

> 這個站屬於社群。這份文件說明誰能決定什麼、怎麼決定。

## 角色

### 貢獻者(Contributor)

任何提交過 PR、issue、表單投稿的人。不需要申請,做了就是。
所有貢獻者都會被記錄在 README 的貢獻者名單(all-contributors)。

### 審稿者(Reviewer)

有權 approve PR 的人。審稿標準見 [REVIEWERS.md](REVIEWERS.md)。

成為審稿者:被 merge 3 篇以上文章 + 由現任維護者邀請。
名單公開在 REVIEWERS.md。

### 維護者(Maintainer)

有 repo write 權限,負責 merge、發布、pipeline 維運與最終裁決。
目前:[@hansai-art](https://github.com/hansai-art)

## 決策方式

| 決策 | 誰決定 |
|---|---|
| 文章內容修正 | 一位審稿者 approve 即可 merge |
| 新文章 | 一位審稿者 approve;有疑義升級到維護者 |
| 編輯規範(docs/editorial/)修改 | 開 issue 討論 ≥3 天 → 維護者裁決 |
| 分類架構、網站功能 | 開 issue 討論 → 維護者裁決 |
| 譯名表新增/修改 | PR + 一位審稿者;有爭議走 issue 討論 |

原則:**內容從快,規範從慢**。文章錯了改就對了;規則要改就多聊幾天。

## 自動化系統的權限

pipeline(upstream-watch、freshness、stats、weekly-report)有權:

- 自動開 issue、更新統計
- 自動把過期文章標成 `outdated`(不刪內容、不動正文)

pipeline **無權**修改文章正文或刪文——那永遠是人(經 PR)的事。

## 衝突處理

對事不對人。內容爭議以「可查證的來源」為準;
來源互相矛盾時,並陳多方觀點並各附出處。
行為問題見 [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)。
