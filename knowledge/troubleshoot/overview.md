---
title: "出錯了?照這個順序查,不會白費力氣"
description: "看到錯誤就上網搜那句話、亂試網路上的解法,最浪費時間。這篇教你一個固定順序:先看程式在不在、再看設定對不對、再看模型連不連得上、最後才查功能。一層一層來,每層都有一句指令幫你確認。"
date: 2026-07-23
subcategory: "overview"
hermes_version: ">=2026.5"
last_verified: 2026-07-04
human_reviewed: false
upstream_refs:
  - "https://hermes-agent.nousresearch.com/docs/reference/faq"
  - "https://hermes-agent.nousresearch.com/docs/getting-started/installation"
tags:
  - "overview"
  - "troubleshoot"
status: "published"
---

出錯的時候,大家最常做、也最浪費時間的一件事,就是:看到一句錯誤訊息,立刻把它貼到 Google 搜,然後照著網路上找到的解法一個一個亂試。

為什麼這樣不好?

因為 agent(這裡指 Hermes 這個會幫你做事的 AI 小助手)是一條「接力鏈」。它要能動,得靠四個環節一棒接一棒:

**程式本身 → 設定檔 → 連上模型 → 功能**。

只要前面任何一環斷了,毛病常常會「表現」在後面那一環。所以你看到的錯,不一定是真正壞掉的地方。

舉兩個例子:
- 你以為是模型有問題,結果其實是設定根本沒被讀到。
- 你以為是設定填錯了,結果其實是你把東西裝在了另一個環境,現在這個環境裡根本沒有它。

所以別亂猜。**照順序,一層一層查。** 總共四層,每一層都有一句指令,幫你當場確認這一層有沒有過關。

## 第一層:程式到底裝好了沒?

先在你的終端機(terminal,就是那個可以打指令的黑底文字視窗)輸入:

```bash
hermes doctor
```

這是官方內建的「體檢指令」[^1],會自己幫你檢查一輪。

重點在這裡:**如果你連這句指令都跑不動**,畫面跳出「找不到 hermes 這個指令」之類的訊息,那問題就在最外面那一層。跟設定無關、跟模型也無關,單純是你的 shell(殼層,就是負責接收並執行你打的指令的那個程式)根本找不到 hermes 這個執行檔(執行檔就是「程式本體」那個檔案)。

→ [command not found 怎麼解](/troubleshoot/command-not-found/)(十次有九次,只是 shell 還沒重新載入 PATH,並不是安裝失敗。PATH 是一份「程式住在哪些資料夾」的清單,shell 靠它找程式)

**還有一個超常見的坑:環境搞混了。** 你可能有好幾個彼此獨立的「環境」,各自裝各自的東西,互相看不到對方:
- 在 WSL2(Windows 裡跑的一個 Linux 小系統)裡裝的東西,你在 PowerShell(Windows 自己的指令視窗)裡是找不到的。
- 裝在系統 Python 裡的東西,在 uv(一個幫你管理 Python 環境的工具)開的環境裡也看不到。

所以先確認一件事:**你現在打指令用的這個視窗,跟你當初安裝時用的,是同一個嗎?**

## 第二層:設定有被讀到嗎?

第一層過了,接著看設定。輸入:

```bash
hermes config show
```

**怎麼算過關(成功判準):** 輸出的內容裡,你要能看到供應商(provider,就是提供 AI 模型的公司,例如某家 API 服務)和模型名稱,而且**是你以為的那一個**;另外 key 那一欄(key 就是你的 API 金鑰,像一把讓你有權使用模型的鑰匙)要有值,不能是空的。

這兩件事只要有一件不對,問題就卡在這一層。

這一層最常見的陷阱是:`~/.hermes/.env` 這個檔案裡,藏著一份舊的、跟你現在想用的設定互相打架的設定,結果把你剛剛才填的新設定給蓋掉了[^1]。(`.env` 是一個專門放環境變數的檔案;環境變數就是一組「名稱=值」的設定,程式啟動時會去讀它。)

→ [API key not set / key 無效怎麼解](/troubleshoot/api-key-not-set/)

## 第三層:模型真的連得上嗎?

設定看起來都對了,接著就要實際連連看。直接輸入:

```bash
hermes
```

然後隨便打一句話問它。

這一步的用意,是把「設定填對了」和「真的能用」這兩件事分開。因為設定填對,不代表真的能用，key 過期了、額度用光了、或是模型名稱其實根本不存在,這些都要等你真的送出一句話、去連連看,才會冒出來。(token 是模型計算文字量的單位,額度通常就是用 token 在算的。)

**這時候要仔細看它吐出來的錯誤訊息在講什麼:**
- 訊息裡提到 key → 回第二層再檢查一次。
- 訊息裡提到 context 或 token → 那是第四層的問題(往下看)。
- 訊息裡說模型名稱不存在 → 回去確認 `HERMES_MODEL` 這個設定的拼字有沒有打錯。

→ [模型供應商與 API key 設定](/config/model-provider/)

## 第四層:功能層

前面三層都通過了,那問題就落在某個「具體功能」上了。到這一步,症狀通常都很明確,對照下面這張表去找對應的解法就好:

| 你看到的症狀 | 看這篇 |
|---|---|
| `context length exceeded` | [怎麼解](/troubleshoot/context-length-exceeded/) |
| `Preflight compression`、對話越用越慢 | [長 session 變慢怎麼解](/troubleshoot/long-session-preflight-compression/)(session 就是一次從頭到尾的連續對話) |
| cron 到時間了卻沒通知 / 沒執行 | [先查 gateway、jobs.json 和 output](/troubleshoot/cron-job-did-not-run/)(cron 是「定時自動執行任務」的排程功能;gateway 是閘道,就是讓你的 bot 收發訊息的那一層) |
| `Python 3.11 or newer` | [怎麼解](/troubleshoot/python-version-too-old/) |
| Telegram 指令選單少東西、gateway 斷線 | [怎麼解](/troubleshoot/telegram/) |
| 從 OpenClaw 搬過來之後行為怪怪的 | [遷移指南](/migrate/migrate-from-openclaw/) |

## 四層都排除了?那去翻 issue

如果上面四層你都查過、也都排除了,那你遇到的很可能是一個「已知問題」，就是別人早就碰過、也記錄下來的狀況。

我們把官方 GitHub 上 300 多篇 issue(issue 就是使用者回報問題或討論的貼文)整理成中文摘要,並依元件分類好了:

- [Agent 核心](/issues/) · [Gateway 訊息閘道](/issues/) · [CLI](/issues/)(CLI 就是用打指令的方式來操作程式) · [設定檔](/issues/) · [桌面版](/issues/) · [驗證與 API key](/issues/)

每一篇都附上原始 issue 的連結,你可以直接點過去看完整討論串,或追蹤它修好了沒。

## 回報問題

如果你確認過這不是已知問題,而且你覺得「這件事這裡的文件本來就該寫、卻沒寫」:
[開一個 issue 告訴我們](https://github.com/hansai-art/hermesagent.download/issues/new?template=01-content-error.yml)。

你花時間辛苦解出來的東西,寫下來,下一個遇到同樣狀況的人就不用再重來一次了。

## 下一步

- 想先讓機器幫你自動查一輪 → [hermes doctor 到底檢查什麼](/troubleshoot/hermes-doctor/)
- 想從頭開始學 → [新手路線](/guides/start/)
- 想看實際案例 → [官方 issue 中文精選](/issues/)

[^1]: Nous Research, FAQ:https://hermes-agent.nousresearch.com/docs/reference/faq (2026-07-23 存取)
