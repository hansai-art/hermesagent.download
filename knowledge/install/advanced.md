---
title: "進階部署:Docker、無伺服器、遠端"
description: "讓 agent 不綁在你的筆電上。官方支援六種執行環境——這篇說明各自的取捨,以及目前中文文件的缺口在哪。"
date: 2026-07-23
subcategory: "advanced"
hermes_version: ">=2026.5"
last_verified: 2026-07-04
human_reviewed: false
upstream_refs:
  - "https://hermes-agent.nousresearch.com/docs"
  - "https://hermes-agent.nousresearch.com/docs/getting-started/installation"
tags:
  - "advanced"
  - "deploy"
status: "published"
---

一旦你開始把 Hermes 接上 Telegram 或排程任務,就會撞到一個現實:**你的筆電會關機**。

agent 只在你開著電腦時能用,那它就只是一個比較聰明的終端機工具,不是一個能替你待命的東西。官方支援六種執行環境,就是為了解決這件事[^1]。

## 六種執行環境

| 環境 | 什麼時候用 | 主要取捨 |
|---|---|---|
| **本機終端機** | 開發、試用 | 關機就停 |
| **Docker** | 要環境隔離、要可重現 | 存取本機檔案較麻煩 |
| **SSH 遠端** | 已經有一台常開的機器 | 要自己管機器 |
| **Daytona** | 開發環境即服務 | 依賴外部平台 |
| **Singularity** | HPC / 研究叢集環境 | 場景較特殊 |
| **Modal(無伺服器)** | 24 小時待命但不想養機器 | 閒置會休眠,冷啟動有延遲 |

Modal 這個選項的特別之處在於**閒置時自動休眠**[^1]——你不用為了等待狀態付整天的錢。

## 選擇的三個判準

**一、它需要存取你本機的檔案嗎?**

需要的話,遠端與無伺服器方案都會很麻煩——檔案不在那台機器上。這種情況比較適合本機或 Docker。

**二、你能接受冷啟動延遲嗎?**

無伺服器方案休眠後被喚醒需要時間。如果你希望在 Telegram 丟一句話就立刻有反應,這個延遲會很有感。

**三、你想管機器嗎?**

VPS 便宜且完全可控,但你要負責更新、安全、監控。無伺服器貴一點但不用管。

## VPS 長駐(目前唯一有完整中文步驟的路線)

如果你選 VPS,[Linux 安裝教學](/install/linux/)裡有官方建議的做法:用專屬的 service user 執行,而不是 root 或你自己的帳號;伺服器上不需要瀏覽器功能的話可以跳過相關相依套件。

接 Telegram 這類訊息平台時,gateway 需要持續執行。**WSL 環境要特別注意 systemd 不可靠**,詳見 [WSL2 教學](/install/wsl2/)。

## 這一塊是目前最大的缺口

坦白說:**Docker、Modal、Daytona 的實際部署步驟,這個站目前是空白的。**

官方文件列出了這些選項,但中文圈沒有人寫過完整流程——踩什麼坑、設定檔怎麼寫、資料怎麼持久化、成本大概多少。這些是只有真的部署過的人才知道的東西。

如果你跑過其中任何一種:

- [開一個 issue 講給我們聽](https://github.com/hansai-art/hermesagent.download/issues/new?template=02-article-proposal.yml)——不用寫成文章,講重點就好,我們幫你整理並掛你的名字
- 或者[直接寫一篇](https://github.com/hansai-art/hermesagent.download/blob/main/CONTRIBUTING.md)

這是目前這個站最需要人手的地方之一。

## 下一步

- 先選安裝方式 → [該選哪一種安裝方式](/install/download/)
- VPS 部署 → [Linux 安裝教學](/install/linux/)
- WSL2 常駐 → [WSL2 完整教學](/install/wsl2/)

[^1]: Nous Research, Docs — https://hermes-agent.nousresearch.com/docs(2026-07-23 存取)
