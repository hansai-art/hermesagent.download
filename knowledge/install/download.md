---
title: "該選哪一種安裝方式"
description: "桌面版、命令列、WSL2、Docker、無伺服器——五種裝法各有適用場景。花兩分鐘選對,省下之後重裝的時間。"
date: 2026-07-23
subcategory: "download"
hermes_version: ">=2026.5"
last_verified: 2026-07-04
human_reviewed: false
upstream_refs:
  - "https://hermes-agent.nousresearch.com/docs/getting-started/installation"
  - "https://hermes-agent.nousresearch.com/docs"
tags:
  - "download"
  - "install"
status: "published"
---

Hermes Agent 有五種裝法。選錯了不會裝不起來,但會在之後某個時刻讓你覺得綁手綁腳——例如你想接自動化腳本時才發現桌面版做不到,或者你在筆電上裝好了才想到它應該要 24 小時待命。

花兩分鐘選對,比之後重裝一次划算。

## 三個問題決定你的選擇

**問題一:你會在終端機裡用它嗎?**

不會 → 桌面版。會 → 往下看。

**問題二:它需要在你關機後繼續工作嗎?**

需要 → 跳到「伺服器與無伺服器」。不需要 → 往下看。

**問題三:你是 Windows 使用者嗎?**

是,而且會寫腳本 → WSL2。是,但只想簡單用 → 原生 PowerShell。不是 → 直接用命令列版。

## 五種裝法比較

| 裝法 | 適合 | 不適合 |
|---|---|---|
| **桌面版** | 第一次接觸、不常用終端機 | 要接腳本、要自動化 |
| **命令列(macOS/Linux)** | 日常在終端機工作的人 | — |
| **WSL2** | Windows 上要完整 Linux 工具鏈 | 只是想簡單用(overkill) |
| **Docker** | 要環境隔離、要可重現的部署 | 想快速試用 |
| **無伺服器(Modal 等)** | 要 24 小時待命但不想養機器 | 需要存取本機檔案 |

官方支援六種執行環境:本機終端機、Docker、SSH 遠端、Daytona、Singularity,以及 Modal 的無伺服器部署(閒置時自動休眠)[^1]。

## 直接看你的平台

- [macOS 安裝](/install/macos/) — 桌面版或一行指令
- [Windows 安裝](/install/windows/) — 桌面版 / PowerShell / WSL2
- [Linux 安裝](/install/linux/) — 含 VPS 長駐的 service user 部署
- [WSL2 完整教學](/install/wsl2/) — 含 gateway 常駐與瀏覽器控制的坑

## 伺服器與無伺服器

**想讓 agent 24 小時待命**(例如接了 Telegram,希望隨時能丟訊息給它),你需要一台不會關機的機器,或者無伺服器方案。

VPS 部署的注意事項(service user、跳過瀏覽器相依)寫在 [Linux 安裝教學](/install/linux/)。

> 📝 **這一塊我們還沒有文章**:Docker、Modal、Daytona 的實際部署步驟目前是空白的——
> 官方文件有提到這些選項,但中文圈沒有人寫過完整流程。
>
> 如果你部署過其中任何一種,
> [這裡最需要你](https://github.com/hansai-art/hermesagent.download/issues/new?template=02-article-proposal.yml)。
> 這是目前這個站最大的缺口之一。

## 都可以同時裝嗎

可以。桌面版、命令列版、WSL2 版彼此獨立,不會衝突。

但要注意:**設定與記憶不共用**。你在桌面版累積的對話記憶,不會出現在 WSL2 版裡。如果你打算兩邊都用,最好一開始就決定主力是哪一個。

## 下一步

- 選好了就去裝 → [macOS](/install/macos/) · [Windows](/install/windows/) · [Linux](/install/linux/)
- 裝完要設模型 → [模型供應商與 API key 設定](/config/model-provider/)
- 完全不知道從哪開始 → [新手路線](/guides/start/)

[^1]: Nous Research, Docs — https://hermes-agent.nousresearch.com/docs(2026-07-23 存取)
