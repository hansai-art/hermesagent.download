---
title: "把自己的技能庫接進 Hermes：skills.external_dirs 實測"
description: "如果你已經用 ~/.agents/skills 或團隊共用 skills repo，不要複製到 ~/.hermes/skills。用 skills.external_dirs 讓 Hermes 直接掃外部目錄。macOS v0.17.0 實機設定範例。"
date: 2026-07-29
subcategory: "custom"
hermes_version: "0.17.0"
last_verified: 2026-07-29
human_reviewed: false
upstream_refs:
  - "https://hermes-agent.nousresearch.com/docs/user-guide/features/skills"
  - "https://hermes-agent.nousresearch.com/docs/user-guide/configuration"
  - "https://github.com/NousResearch/hermes-agent/blob/main/tools/skill_manager_tool.py"
tags:
  - "skills"
  - "config"
  - "external-dirs"
status: "published"
---

你已經有一包自己維護的 skills，例如放在 `~/.agents/skills/`，同時又想讓 Hermes 用。最直覺的做法是整包複製到 `~/.hermes/skills/`，但這會製造第二份真相來源：改 A 忘了改 B，幾週後一定亂。

Hermes 支援比較乾淨的做法：在 `config.yaml` 裡設定 `skills.external_dirs`，讓 Hermes 直接掃外部技能目錄[^1]。

本站在一台 macOS、Hermes Agent v0.17.0 的實機上使用這個設定：

```yaml
skills:
  external_dirs:
    - /Users/jugang11/.agents/skills
```

## 先確認你的外部目錄是真的 skill 目錄

不是任意 Markdown 資料夾都可以。Hermes skill 至少要有這種結構：

```text
~/.agents/skills/
├── some-category/
│   └── your-skill/
│       ├── SKILL.md
│       ├── references/
│       ├── templates/
│       └── scripts/
```

**成功判準**：你要載入的技能資料夾裡有 `SKILL.md`，而且 frontmatter 有 `name` 與 `description`。

## 正確設定方式

編輯 `~/.hermes/config.yaml`：

```yaml
skills:
  external_dirs:
    - ~/.agents/skills
```

或使用絕對路徑：

```yaml
skills:
  external_dirs:
    - /Users/yourname/.agents/skills
```

官方文件寫明，路徑支援 `~` 展開與 `${VAR}` 環境變數替換[^1]。

## 最常見的錯：把它寫成字串

錯誤寫法：

```yaml
skills:
  external_dirs: "~/.agents/skills"
```

正確寫法是 YAML list：

```yaml
skills:
  external_dirs:
    - ~/.agents/skills
```

只接一個目錄也要用 list。這樣以後要加團隊共用目錄時才不會改結構：

```yaml
skills:
  external_dirs:
    - ~/.agents/skills
    - /Volumes/team/shared-skills
```

## 第二個常見錯：指到單一 SKILL.md

錯誤寫法：

```yaml
skills:
  external_dirs:
    - ~/.agents/skills/my-skill/SKILL.md
```

`external_dirs` 要指向「技能根目錄」，不是單一檔案。Hermes 會在這個根目錄底下找 skill package。

## 設定後怎麼驗證

先開新 session 或重啟 Hermes，讓技能索引重建。接著查：

```bash
hermes skills list
```

**成功判準**：外部目錄裡的技能名稱出現在清單裡。

在對話裡也可以用：

```text
/skills
```

或直接載入：

```text
/your-skill-name
```

外部技能會進入系統 prompt index、`skills_list`、`skill_view`，也會變成 slash command，跟本地技能沒有差別[^1]。

## 實務上要知道的三個邊界

### 一、同名技能本地版優先

如果 `~/.hermes/skills/` 和 external dir 裡有同名 skill，Hermes 會優先用本地版[^1]。

所以你明明改了 `~/.agents/skills/foo/SKILL.md`，Hermes 卻沒變，先查是不是 `~/.hermes/skills/` 底下也有一個 `foo`。

### 二、外部目錄不是防寫保護

官方文件寫得很直：外部目錄如果對 Hermes process 可寫，agent 使用 `skill_manage` patch / edit / delete 時仍可能改到外部目錄[^1]。

如果團隊共用 skills 必須唯讀，不要只靠 `external_dirs` 心理安慰。要用檔案權限、唯讀掛載，或分 profile / toolset 隔離。

### 三、不存在的路徑會被略過

設定了不存在的 external dir，Hermes 會略過，不會大聲報錯[^1]。這對跨機器共用 config 很方便，但排錯時也容易被騙。

驗證時請直接看：

```bash
test -d ~/.agents/skills && echo exists
```

預期輸出：

```text
exists
```

## 這台機器的實測設定

本站實機目前採用這種分工：

```yaml
skills:
  external_dirs:
    - /Users/jugang11/.agents/skills
```

檢查結果：

```text
/Users/jugang11/.agents/skills exists= True
/Users/jugang11/.hermes/skills exists= True
```

意思是：

- `~/.hermes/skills` 保留 Hermes 本地、hub installed、agent-created skills
- `~/.agents/skills` 作為跨 AI / 自訂技能庫來源
- Hermes 透過 `skills.external_dirs` 掃到後者，不需要複製

## 下一步

- 想看官方 skills 全目錄 → [官方 Skills 全目錄](/skills/catalog/)
- 想理解 config.yaml 分工 → [config.yaml 是什麼](/config/config-yaml-reference/)
- 想知道怎麼挑 skill → [推薦 Skills](/skills/recommended-skills/)

[^1]: Nous Research, Skills System：External Skill Directories 可在 `skills.external_dirs` 設定，支援 `~` 與 `${VAR}`，外部 skills 會出現在 prompt index、`skills_list`、`skill_view` 與 slash commands；同名時 local version wins；external dirs 不是 write-protection boundary；不存在的路徑會被略過：https://hermes-agent.nousresearch.com/docs/user-guide/features/skills
[^2]: 本站實機驗證（macOS、Hermes Agent v0.17.0、2026-07-29）：`~/.hermes/config.yaml` 中 `skills.external_dirs` 指向 `/Users/jugang11/.agents/skills`，且 `/Users/jugang11/.agents/skills` 與 `/Users/jugang11/.hermes/skills` 皆存在。
