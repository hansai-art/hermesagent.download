---
title: "macOS 語音轉文字沒有產出 transcript：Homebrew whisper 找不到 ffmpeg 的解法"
description: "桌面版或 gateway 啟動時 PATH 太乾淨，Homebrew whisper 可能跑完但沒有 .txt。這篇用 macOS v0.17.0 實機設定，示範改成 stt.providers 的 command provider，明確把 /opt/homebrew/bin 加進 PATH。"
date: 2026-07-29
subcategory: "voice"
hermes_version: "0.17.0"
last_verified: 2026-07-29
human_reviewed: false
upstream_refs:
  - "https://hermes-agent.nousresearch.com/docs/user-guide/features/tts"
  - "https://hermes-agent.nousresearch.com/docs/reference/faq"
  - "https://hermes-agent.nousresearch.com/docs/reference/environment-variables"
tags:
  - "voice"
  - "stt"
  - "macos"
  - "whisper"
  - "ffmpeg"
status: "published"
---

你把語音訊息丟給 Hermes，畫面看起來有處理，最後卻回：沒有轉出文字。典型錯誤長這樣：

```text
Local STT command completed but did not produce a .txt transcript
```

在 macOS 上，這常常不是 Whisper 壞掉，而是啟動 Hermes 的環境太乾淨，導致 Homebrew 裝的 `whisper` 或它背後需要的 `ffmpeg` 不在 PATH 裡。

## 為什麼 macOS 特別容易發生

官方 FAQ 寫明：macOS 的 launchd service 會繼承很小的 PATH，通常只有 `/usr/bin:/bin:/usr/sbin:/sbin`，不包含 Homebrew、nvm、cargo 這些使用者安裝路徑；這會造成 gateway 找不到 Node.js、ffmpeg，或語音轉文字失敗[^2]。

如果你是在 Terminal 裡跑：

```bash
which ffmpeg
which whisper
```

可能都正常。但 Hermes Desktop 或 gateway 不是用你的互動 shell 啟動，它看到的 PATH 可能完全不同。

## 先確認工具真的存在

Apple Silicon Mac 常見位置：

```bash
test -x /opt/homebrew/bin/ffmpeg && echo ffmpeg-ok
test -x /opt/homebrew/bin/whisper && echo whisper-ok
```

本站實機輸出：

```text
/opt/homebrew/bin/ffmpeg exists= True
/opt/homebrew/bin/whisper exists= True
/usr/local/bin/ffmpeg exists= False
```

這代表這台是典型 Apple Silicon Homebrew 位置：`/opt/homebrew/bin`。

Intel Mac 或手動安裝可能是 `/usr/local/bin`，不要照抄路徑，先用 `which` 或 `test -x` 確認。

## 解法一：如果你是 gateway，重裝服務讓它重新抓 PATH

官方建議：如果工具是在 gateway install 之後才裝的，重跑 install，讓 gateway plist 重新記錄目前 PATH[^2]。

```bash
hermes gateway install
hermes gateway start
```

檢查 plist：

```bash
/usr/libexec/PlistBuddy -c "Print :EnvironmentVariables:PATH" \
  ~/Library/LaunchAgents/ai.hermes.gateway.plist
```

**成功判準**：輸出裡看得到 `/opt/homebrew/bin` 或你的 ffmpeg / whisper 所在目錄。

## 解法二：用 stt.providers 明確指定 command provider

如果你想讓 Desktop / CLI / gateway 都走同一條穩定路徑，可以直接在 `~/.hermes/config.yaml` 寫一個命名 provider。

本站實機使用：

```yaml
stt:
  enabled: true
  provider: homebrew_whisper
  local:
    model: base
    language: zh
  providers:
    homebrew_whisper:
      type: command
      command: >-
        PATH=/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin
        /opt/homebrew/bin/whisper {input_path}
        --model {model}
        --output_format txt
        --output_dir {output_dir}
        --language {language}
        >/dev/null
        && cat {output_dir}/*.txt > {output_path}
      format: txt
      language: zh
      model: base
      timeout: 300
```

這段做了三件事：

1. 在 command 前面明確補上 Homebrew PATH
2. 強制 whisper 輸出 `txt`
3. 把 `{output_dir}` 裡的 `.txt` 合併到 Hermes 預期的 `{output_path}`

官方文件寫明，STT command provider 支援 `{input_path}`、`{output_path}`、`{output_dir}`、`{language}`、`{model}` 等 placeholder；成功後 Hermes 會優先讀 `{output_path}`，若不存在才讀 stdout[^1]。

## 成功判準

改完後重啟 Hermes session 或 gateway，丟一段短語音測試。

成功時應該看到：

- 語音被轉成文字
- agent 看到的是 transcript，而不是「沒有輸出檔」
- 不再出現 `did not produce a .txt transcript`

如果你要先單獨測 command，可以把一段音檔路徑代進去手跑，但要記得 `{output_dir}`、`{output_path}` 是 Hermes 執行時才會替換的 placeholder，手跑時要換成真實暫存路徑。

## 常見問題

### 可以只用 HERMES_LOCAL_STT_COMMAND 嗎？

可以。官方仍保留 `HERMES_LOCAL_STT_COMMAND`，支援 `{input_path}`、`{output_dir}`、`{language}`、`{model}`[^3]。

但如果你想維護多個 STT 引擎，或想在 config 裡清楚命名，`stt.providers.<name>` 比單一環境變數好管理。

### 為什麼 command 裡要 `cat {output_dir}/*.txt > {output_path}`？

因為 Whisper CLI 常會依輸入檔名在 output dir 產生自己的 `.txt`。Hermes command provider 最穩的讀回路徑是 `{output_path}`[^1]。這行就是把 Whisper 產物轉成 Hermes 預期檔名。

### 這樣安全嗎？

這是本機 shell command，會用你的使用者權限執行。官方文件也提醒 command provider 的 trust model 等同於你自己放在 PATH 上的 shell script[^1]。只放你信任的命令，不要複製陌生來源的一行指令。

## 下一步

- 想設定 TTS / STT 全貌 → 讀官方 [Voice & TTS](https://hermes-agent.nousresearch.com/docs/user-guide/features/tts)
- gateway 找不到 ffmpeg / node → 先看這篇的「解法一」
- 想理解 config 分工 → [config.yaml 是什麼](/config/config-yaml-reference/)

[^1]: Nous Research, Voice & TTS：STT 支援 local、local_command、Groq、OpenAI、Mistral、xAI，以及 `stt.providers.<name>: type: command`；command provider placeholder 包含 `{input_path}`、`{output_path}`、`{output_dir}`、`{format}`、`{language}`、`{model}`，成功後優先讀 `{output_path}` — https://hermes-agent.nousresearch.com/docs/user-guide/features/tts
[^2]: Nous Research, FAQ：macOS launchd services inherit a minimal PATH，可能造成 gateway 找不到 Node.js / ffmpeg；官方建議重新執行 `hermes gateway install` 讓服務重新擷取 PATH，並用 PlistBuddy 檢查 plist — https://hermes-agent.nousresearch.com/docs/reference/faq
[^3]: Nous Research, Environment Variables：`HERMES_LOCAL_STT_COMMAND` 是可選的本機 STT command template，支援 `{input_path}`、`{output_dir}`、`{language}`、`{model}`；`HERMES_LOCAL_STT_LANGUAGE` 可指定預設語言 — https://hermes-agent.nousresearch.com/docs/reference/environment-variables
[^4]: 本站實機驗證（macOS、Hermes Agent v0.17.0、2026-07-29）：`/opt/homebrew/bin/ffmpeg` 與 `/opt/homebrew/bin/whisper` 存在，`/usr/local/bin/ffmpeg` 不存在；`~/.hermes/config.yaml` 使用 `stt.provider: homebrew_whisper` 與 `stt.providers.homebrew_whisper.type: command`，command 以 `PATH=/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin` 開頭。
