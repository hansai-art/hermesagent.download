---
title: "Beginner's Guide: Get Hermes Talking to You on Telegram"
description: "Type one line on your phone, and your agent does the work on the other end and replies. Just five steps, about ten minutes. The step most people get stuck on -- allowing yourself in -- is walked through here step by step."
date: 2026-07-25
subcategory: "telegram"
hermes_version: ">=2026.5"
last_verified: 2026-07-25
human_reviewed: false
upstream_refs:
  - "https://hermes-agent.nousresearch.com/docs/user-guide/messaging/telegram"
tags:
  - "telegram"
  - "integrations"
status: "published"
---

First, here is what this guide gets you.

Once you connect Hermes to Telegram, you can just type to it from your phone. It does the work on the far end (the computer or server where it runs) and sends the result back to your Telegram. It is like having a little helper on call. This is also the most popular way to connect it.

Let me explain one word up front, because it comes up a lot: an **agent** is "a program that acts as a helper and gets things done for you." The bot we keep mentioning below is simply how that agent shows up inside Telegram.

The whole thing is only five steps, and takes about ten minutes.

A heads-up so you do not get surprised: **the hardest part is not the tech, it is the "authorization" step.** By default, Hermes refuses to talk to anyone. That is on purpose, for safety. So you have to manually add yourself to an "allowed list" first, or else even your own messages get ignored. This guide spells out that step carefully, so if you follow along you will not trip over it.

## Step 1: Ask BotFather for a "key" (a token)

In Telegram, every bot has to be requested from an official account called @BotFather before it can exist[^1]. Think of it as the front desk that issues ID cards for bots.

Follow along:

1. Search for **@BotFather** in Telegram's search bar (or just open this link: `t.me/BotFather`)
2. Send it a message: `/newbot`
3. Give your bot a display name (the name other people see, for example "Hermes Agent")
4. Then give it a username (an account handle). The rule is it must end in `bot` (for example `my_hermes_bot`)
5. Once done, BotFather replies with a string of gibberish that looks like this: `123456789:ABCdefGHIjklMNOpqrSTUvwxYZ`[^1]

That string of gibberish is called a **token**. You can think of it as "the key to your bot," or its password.

⚠️ **This key is very important -- keep it safe.** Anyone who gets hold of it can impersonate you and take control of your bot. So never paste it anywhere public (chat groups, forums, GitHub, and so on)[^1].

## Step 2: Tell Hermes about this key

Now you hand that key to Hermes, so it knows which bot to control.

The easiest way is to use the "interactive setup." You run one command, and it walks you through filling in the token and the allowed users, one question at a time[^1].

A quick explanation first: the thing in the box below is a **command**, and you type it into a "terminal." A terminal is that plain window where you type commands to your computer (on Mac it is called "Terminal," and on Windows people often use PowerShell).

```bash
hermes gateway setup
```

After you press Enter, a menu pops up. Pick Telegram, paste in the token from before, then fill in "the ID of the person allowed to use it" (the next step shows you where to find this ID, so do not worry yet).

**If you would rather set it up by hand,** you can. The way to do that is to open and edit a file called `~/.hermes/.env`.

Two terms to explain here. The `~` is a shortcut that means "your home folder" (your own user folder). A file ending in `.env` is a place made for storing "settings," one setting per line. Inside it, put these two lines:

```text
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrSTUvwxYZ
TELEGRAM_ALLOWED_USERS=123456789
```

The first line, `TELEGRAM_BOT_TOKEN`, holds your key. The second line, `TELEGRAM_ALLOWED_USERS`, holds "the IDs of the people allowed to talk to the bot." If you want to allow several people, just separate their IDs with commas[^1].

## Step 3: Add yourself to the allowed list (the step people get stuck on!)

This is the most important step, so read closely.

Hermes has a layer called the **gateway (the layer that handles receiving and sending your bot's messages).** By default it **refuses everyone.** This is designed on purpose, for safety[^1]. Meaning: even you, if you are not on the allowed list, get no reply.

So you first need to know "what your own Telegram ID number is." Every Telegram user has their own unique number, like a personal ID number.

Finding your own ID is easy: in Telegram, search for **@userinfobot**, send it any message, and it immediately replies with a string of numbers -- that is your ID (it looks like `123456789`)[^3].

Put that number into the `TELEGRAM_ALLOWED_USERS` field from Step 2.

If you skip this step, here is what you will run into: "the bot is clearly online, but no matter what I send it, it does not reply." In that case **it is not broken -- it just does not recognize you.** Add your ID and it is fixed.

## Step 4: Start the bot (start the gateway)

With all the settings filled in, run this command to start the gateway layer we just talked about:

```bash
hermes gateway
```

If all goes well, your bot comes online within a few seconds[^1].

> **Want it to stay on all the time, instead of stopping the moment you turn off your computer?** Let me be clear about this first: `hermes gateway` runs "in the foreground," which means it keeps occupying this terminal window; the moment you close that window, the bot stops with it.
>
> If you want it running quietly in the background for a long time, use a small tool called **tmux** (it lets a program keep living in the background after you close the window). One special note: if you use WSL (the setup that runs Linux inside Windows), there is a mechanism called systemd that is not reliable here, so do not depend on it. For the detailed how-to, see the [WSL2 guide](/install/wsl2/) and [common Telegram pitfalls](/en/troubleshoot/telegram/).

## Step 5: Test whether it worked

Open Telegram and send a line to the bot you just made, for example "hi."

**What counts as success:** it replies to you. That is success.

**If it does not respond,** do not panic. Go look at a log file: `~/.hermes/logs/gateway.log`. This file is the gateway's "diary" -- when it starts up it writes the connection status here, which helps you troubleshoot[^1].

If there is no response, nine times out of ten it is one of these two causes:

- **Forgot to add yourself to the allowed list** -> go back to Step 3 and do it again
- **The gateway is not actually running** -> go back to Step 4 and start it

## Want to use it in a "group"?

If you want to bring the bot into a Telegram group so everyone in the group can use it, there are two extra things to do[^2]:

1. Go back into the bot's settings in BotFather and **turn off "privacy mode."** When privacy mode is on, the bot in a group can only see messages that "call it directly," not the general chat; only after you turn it off can it receive the group's messages.
2. After changing the privacy setting, **remove the bot from the group and add it back** once (so the new setting takes effect).

Miss either of these two steps and the bot in the group will not receive messages -- it just sits there like a block of wood.

## Common questions

### Why are a few features (skills) missing from the command menu?

Telegram has a cap on "slash commands" (the commands you type starting with `/`): a maximum of 100, and anything beyond that quietly disappears without an error. A "skill" here is one of the things the bot can do. For the fix, see [common Telegram pitfalls](/en/troubleshoot/telegram/).

### I moved over from OpenClaw -- do I need to reset the allowed list?

The official migration tool moves your `TELEGRAM_ALLOWED_USERS` (the allowed list) over for you; if you add a `--migrate-secrets` option during migration, it also brings the token (the key) along. Still, it is safer to double-check it yourself afterward -- see the [migration guide](/en/migrate/migrate-from-openclaw/).

### Can I connect several chat platforms at once?

Yes. Hermes's gateway supports 20-plus messaging platforms, and Telegram is just one of them. You can connect several at the same time.

### The bot is online, but it does not reply to me at all?

Nine times out of ten the reason is the "allowed list." Make sure your number ID is correctly filled into `TELEGRAM_ALLOWED_USERS`, and that the gateway is actually running.

## What to look at next

- Keeping the gateway running all the time, or dealing with disconnects -> [common Telegram pitfalls and fixes](/en/troubleshoot/telegram/)
- How WSL users keep it running persistently -> [full WSL2 guide](/install/wsl2/)
- Getting your agent to use external tools -> [connect your first MCP](/en/integrations/connect-first-mcp/)

[^1]: Nous Research, Telegram：https://hermes-agent.nousresearch.com/docs/user-guide/messaging/telegram (2026-07-25 存取)。含 BotFather 建立流程、`hermes gateway setup`、`TELEGRAM_BOT_TOKEN` / `TELEGRAM_ALLOWED_USERS` 設定、預設拒絕所有人
[^2]: 同上,群組使用需在 BotFather 關閉 privacy mode,並於變更後將 bot 移除再重新加入群組
[^3]: 同上,以 @userinfobot 查詢數字使用者 ID;`hermes gateway` 啟動後連線紀錄寫入 `~/.hermes/logs/gateway.log`
