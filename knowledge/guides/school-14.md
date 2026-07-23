---
title: "Case 13：太晚說明 `/reset` 才會生效"
description: "症狀：使用者以為工具啟用後當下即可用 真正過錯：沒先講 session lifecycle 根因分類：工具層 修補方式：把 /reset / restart 條件放到操作流程前段 驗證方式：新 session 內工具實際可見且可用 應提煉成的規則：涉及 Hermes config / toolset / plugin"
date: 2026-07-15
subcategory: "school"
hermes_version: "*"
last_verified: 2026-07-15
upstream_refs:
  - "https://github.com/hansai-art/hermes-agent-school/blob/main/cases/30-error-cards.md"
tags:
  - "school"
  - "error-cards"
status: "published"
---

## 症狀

- 症狀：使用者以為工具啟用後當下即可用
- 真正過錯：沒先講 session lifecycle
- 根因分類：工具層
- 修補方式：把 `/reset` / restart 條件放到操作流程前段
- 驗證方式：新 session 內工具實際可見且可用
- 應提煉成的規則：涉及 Hermes config / toolset / plugin 變更時，要先說明生效時機

- 分層:母題 2 · 工具
- 資訊來源信任度:可信
- 原始教材:[hermes-agent-school](https://github.com/hansai-art/hermes-agent-school/blob/main/cases/30-error-cards.md)
