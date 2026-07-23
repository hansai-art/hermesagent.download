---
title: "Skill 同步殘留與格式錯誤（school-05）"
description: "skill 安裝或同步後出現殘留檔案,或輸出格式不符預期。"
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

skill 安裝或同步後出現殘留檔案,或輸出格式不符預期。

## 診斷

問題出在輸出與檔案管理這一層,常見於同步流程沒有清理舊狀態。

## 解法

同步後檢查並清理殘留,驗證 skill 實際載入清單與預期一致。

## 預防

把同步後清理與驗證納入固定流程,不要假設同步一定乾淨。

- 分層:母題 5 · 輸出
- 資訊來源信任度:可信
- 原始教材:[hermes-agent-school](https://github.com/hansai-art/hermes-agent-school/blob/main/cases/30-error-cards.md)
