# RESEARCH-TEMPLATE.md — 寫作前研究模板

複製以下模板到草稿(不入庫,或放 PR description),填完再動筆。

```markdown
## 研究筆記:{文章標題}

### 目標讀者與場景

- 誰會讀這篇:
- 讀完要能做到:

### 適用版本

- hermes_version 範圍:
- 依據(release notes / changelog URL):

### 事實清單(claim → source)

| # | 宣稱 | 來源 URL | 型態 |
|---|------|----------|------|
| 1 |      |          | 官方文件 / issue / 實測 |
| 2 |      |          |      |

### 相關上游 issues

- #xxxx — 摘要
- #xxxx — 摘要

### 既有文章盤點(避免重複)

- knowledge/ 內相關文章:
- 這篇與它們的分工:

### 待實測項目

- [ ] 指令 A 在 {環境} 的輸出
- [ ] 設定 B 是否仍有效
```

**規則**:事實清單裡「型態 = 實測」的項目,Verify 階段必須真的測過。
