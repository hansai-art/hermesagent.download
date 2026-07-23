---
title: "進階安裝教學"
description: "Hermes Agent 安裝教學，包含自動化腳本、桌面版 App、Docker 與 Serverless 部署"
date: 2026-07-23
subcategory: "advanced"
hermes_version: "*"
last_verified: 2026-07-23
upstream_refs:
  - "https://hermes-agent.nousresearch.com/"
tags:
  - "advanced"
status: "published"
---

Hermes Agent · 中文入口

# 非官方中文下載、安裝與新手學習入口

整理官方下載、安裝教學、Skill / MCP 推薦、高手使用摘要與 GitHub Issue 精選問答,幫中文使用者從安裝到進階工作流一次上手。

Unofficial community guide Not affiliated with Nous Research

[前往官方下載](/install/download/) [從新手路線開始](/install/advanced/) [找 Skill / MCP](/skills/recommended-skills/)

## 進階安裝教學（本站整理）

[

### Hermes Agent WSL2 完整安裝教學（Windows 使用者進階路線）

在 Windows 的 WSL2 安裝 Hermes Agent：WSL2 準備、官方安裝指令、gateway 常駐、連 Windows Chrome 的官方建議。

→](/install/wsl2/)[

### Hermes Agent macOS 下載與安裝教學

在 macOS 下載安裝 Hermes Agent 的兩種官方方式：桌面版安裝器與一行終端機指令，含驗證步驟與常見錯誤。

→](/install/macos/)[

### Hermes Agent Windows 下載與安裝教學（Desktop / PowerShell / WSL2）

Windows 安裝 Hermes Agent 的三條路：官方桌面版安裝器、原生 PowerShell 指令、WSL2。含各自適用情境與常見錯誤。

→](/install/windows/)[

### Hermes Agent Linux 下載與安裝教學

在 Linux 用官方一行指令安裝 Hermes Agent：前置套件、安裝位置、service user 部署與驗證步驟。

→](/install/linux/)

## 全平台進階安裝指南

1

#### 1\. 自動化終端機腳本安裝 (推薦)

官方提供了全自動的安裝腳本，支援 macOS, Linux, 以及 WSL2 甚至 Windows 原生環境。只需在終端機貼上一行腳本即可完成環境建置與相依套件安裝，是最推薦的無腦安裝法。請參考 [官方下載頁](https://hermes-agent.nousresearch.com/)。

2

#### 2\. 官方 Desktop App 桌面版

如果不習慣使用終端機指令，Nous Research 也有提供「專屬桌面應用程式 (Desktop App)」的包裝，讓你可以透過點擊與圖形介面輕鬆啟動、管理 Hermes Agent 的背景服務。

3

#### 3\. Docker 與雲端伺服器 (VPS / GPU Cluster)

Hermes Agent 設計極為輕量，可架設於便宜的 $5 VPS 或是企業級的 GPU 叢集。官方提供完整的 Docker 支援 (`docker-compose.yml`)，適合想把 Agent 24 小時掛在雲端的重度玩家。

4

#### 4\. 無伺服器環境部署 (Modal / Daytona)

為了節省運算成本，社群與官方也支援將 Hermes 部署至 Serverless 基礎設施 (例如 Modal 或 Daytona)。Agent 可以在閒置時自動休眠，有任務時瞬間喚醒，實現運算資源的最佳化。
