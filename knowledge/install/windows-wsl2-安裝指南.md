---
title: 在 Windows(WSL2)上安裝 Hermes Agent
description: 從零開始:啟用 WSL2、安裝相依環境、跑起第一個 Hermes Agent
date: 2026-07-23
subcategory: windows
hermes_version: '*'
upstream_refs:
  - https://github.com/NousResearch
tags: [windows, wsl2, install]
status: draft
---

> ⚠️ 本篇為骨架階段的種子文章,步驟待 Phase 1 在乾淨的 Windows 環境實測後補齊
> (實測通過才把 status 改為 published 並填 `last_verified`)。

## 待補大綱

1. 前置需求:Windows 版本、硬體、WSL2 啟用(附 PowerShell 指令與預期輸出)
2. 在 WSL2 內安裝相依環境(Python / Node / uv,以官方 README 為準)
3. 安裝 Hermes Agent 本體(指令一律導向官方來源)
4. 第一次啟動與驗證(預期輸出截圖)
5. 常見問題:command not found、權限、網路 proxy(各連到 troubleshoot/ 對應文章)

## 寫作提醒(完成後刪除本節)

- 每個指令標 `powershell` 或 `bash`(WSL2 內外要分清楚,這是 Windows 教學最常見的坑)
- 每步驟寫「怎麼確認成功了」
- 實測環境與日期寫進 frontmatter 的 `last_verified`
