---
title: "下載安裝"
description: "下載安裝"
date: 2026-07-23
subcategory: "download"
hermes_version: "*"
last_verified: 2026-07-23
upstream_refs:
  - "https://hermes-agent.nousresearch.com/install.sh"
  - "https://hermes-agent.nousresearch.com/"
  - "https://hermes-agent.nousresearch.com/install.ps1"
  - "https://hermes-agent.nousresearch.com/docs"
  - "https://hermes-agent.nousresearch.com/docs/reference/faq"
tags:
  - "download"
status: "published"
---

## 平台安裝教學（本站整理）

[

### Hermes Agent macOS 下載與安裝教學

在 macOS 下載安裝 Hermes Agent 的兩種官方方式：桌面版安裝器與一行終端機指令，含驗證步驟與常見錯誤。

→](/install/macos/)[

### Hermes Agent Windows 下載與安裝教學（Desktop / PowerShell / WSL2）

Windows 安裝 Hermes Agent 的三條路：官方桌面版安裝器、原生 PowerShell 指令、WSL2。含各自適用情境與常見錯誤。

→](/install/windows/)[

### Hermes Agent Linux 下載與安裝教學

在 Linux 用官方一行指令安裝 Hermes Agent：前置套件、安裝位置、service user 部署與驗證步驟。

→](/install/linux/)

## 官方下載入口

[

### macOS 官方最新版

官方兩種方式：下載 Desktop 安裝器，或在終端機執行 `curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash`

→](https://hermes-agent.nousresearch.com/)[

### Windows 官方最新版

官方三條路：Desktop 安裝器（最簡單）、PowerShell 執行 `iex (irm https://hermes-agent.nousresearch.com/install.ps1)`、或在 WSL2 用 Linux 指令安裝。

→](https://hermes-agent.nousresearch.com/)[

### Linux 官方最新版

終端機執行官方一行指令：`curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash`

→](https://hermes-agent.nousresearch.com/)

## 下載前先確認

1

#### 1\. 先決定你的執行方式

一般使用者可先從官方 Releases 或 CLI 啟動；想長時間執行 Hermes，再看 Docker 與 Serverless 安裝方式。

2

#### 2\. 前置需求只有 Git

官方安裝器會自動處理 Python 3.11、Node.js v22、ripgrep 與 ffmpeg，你只需要先確認 git --version 能執行（Linux 另需 curl 與 xz-utils）。

3

#### 3\. 不要下載不明二進位

本網站只整理官方入口。若看到第三方鏡像站或來路不明安裝包，請直接回到 GitHub Releases 或官方文件。

## 搭配閱讀

[

### 進階安裝

WSL2、Docker、Serverless 的完整安裝方向。

→](/install/advanced/)[

### 新手上手

下載完成後，下一步怎麼啟動、驗證與排錯。

→](/guides/start/)[

### Official Website

查看官方 Home 資源。

→](https://hermes-agent.nousresearch.com/)[

### Official Documentation

查看官方 Docs 資源。

→](https://hermes-agent.nousresearch.com/docs)[

### FAQ & Troubleshooting

查看官方 Support 資源。

→](https://hermes-agent.nousresearch.com/docs/reference/faq)
