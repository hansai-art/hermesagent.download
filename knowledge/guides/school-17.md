---
title: "Case 16：沒先說清楚 image backend 限制"
description: "症狀：原始需求其實包含 image to image，但後端只支援 text to image 真正過錯：限制揭露太晚 根因分類：工具層 修補方式：先列支援矩陣與不支援項目 驗證方式：輸出內容有清楚列出可做與不可做 應提煉成的規則：遇到能力邊界時，限制必須前置揭露"
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

- 症狀：原始需求其實包含 image-to-image，但後端只支援 text-to-image
- 真正過錯：限制揭露太晚
- 根因分類：工具層
- 修補方式：先列支援矩陣與不支援項目
- 驗證方式：輸出內容有清楚列出可做與不可做
- 應提煉成的規則：遇到能力邊界時，限制必須前置揭露

- 分層:母題 2 · 工具
- 資訊來源信任度:可信
- 原始教材:[hermes-agent-school](https://github.com/hansai-art/hermes-agent-school/blob/main/cases/30-error-cards.md)
