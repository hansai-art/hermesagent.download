# REVIEWERS.md — 審稿指南

> 審稿者的工作:讓每篇進站的文章「可跟做、有來源、像同一個編輯室出品」。

## 現任審稿者

- [@hansai-art](https://github.com/hansai-art)(維護者兼任)

(想加入?見 [GOVERNANCE.md](GOVERNANCE.md) 的審稿者條件)

## 審稿流程

1. **CI 先過**:quality-check 紅的 PR 不用人工看,請作者先修。
2. **對照檢查清單**:[docs/editorial/QUALITY-CHECKLIST.md](docs/editorial/QUALITY-CHECKLIST.md) 逐項看。
3. **抽測**:教學類文章抽 1-2 個關鍵指令實際跑跑看;跑不動就 request changes。
4. **來源抽查**:點開 2-3 個 upstream_refs / 腳註,確認真的支持文章的宣稱。

## Request changes 的常見理由(直接複製用)

- 「這段宣稱沒有來源,請補 `[^n]` 腳註或 upstream_refs」
- 「這個指令我在乾淨環境跑失敗了,輸出如下:…請確認步驟」
- 「開場是定義式,請改成場景式/結果式/問題式(EDITORIAL.md)」
- 「這裡是 list-dump,請改寫成敘事(列表只用於步驟/比較/檢查清單)」
- 「譯名請對照 TERMINOLOGY.md:×服务器 → ○伺服器」

## 審稿的態度

- 你在守護的是**讀者半夜三點的安裝體驗**,不是文法。
- 對新貢獻者從寬:格式問題直接幫忙改好再 merge,附一句說明;
  內容問題才 request changes。
- 48 小時內給第一個回應;做不到就在 PR 留言說什麼時候會看。
- 拒絕永遠附理由與改法。沒有「就是不行」。
