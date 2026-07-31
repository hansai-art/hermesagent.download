---
title: "Connect Hermes to Telegram: From Zero to a Working Chat"
description: "Fire a message at your agent anytime from your phone. Five steps: get a token from BotFather, configure, authorize yourself, start the gateway, verify. Includes the authorization step that trips most people up."
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

Connect Hermes to Telegram and you can fire a message at it anytime from your phone: it does the work remotely and reports back. This is the most popular way to hook it up.

The whole process is five steps and takes about ten minutes. **The part that trips people up isn't technical, it's authorization**: Hermes denies everyone by default, so you have to add yourself to the allowlist first, or it won't even respond to your own messages. This guide spells out that step in particular.

## Step 1: Get a token from BotFather

Telegram bots are all created through the official @BotFather[^1]:

1. Search for **@BotFather** in Telegram (or open `t.me/BotFather`)
2. Send `/newbot`
3. Pick a display name (for example "Hermes Agent")
4. Pick a username ending in `bot` (for example `my_hermes_bot`)
5. BotFather replies with a token that looks like this: `123456789:ABCdefGHIjklMNOpqrSTUvwxYZ`[^1]

⚠️ **This token is the key to your bot**: anyone who has it can control your bot. Don't paste it anywhere public[^1].

## Step 2: Configure Hermes

The easiest approach is the interactive setup, which walks you through entering the token and the authorized users[^1]:

```bash
hermes gateway setup
```

When the menu appears, choose Telegram, paste in the token, and enter the allowed user IDs (the next step shows you how to find your ID).

**Or configure it manually**: edit `~/.hermes/.env`:

```text
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrSTUvwxYZ
TELEGRAM_ALLOWED_USERS=123456789
```

Separate multiple users with commas[^1].

## Step 3: Authorize yourself (the step that trips most people up)

The Hermes gateway **denies everyone by default, and that's a deliberate security design**[^1]. So even you won't get a response until you're on the allowlist.

First find your Telegram user ID: send a message to **@userinfobot**, and it replies with a string of digits (like `123456789`)[^3].

Put that number into `TELEGRAM_ALLOWED_USERS` (the field from step 2). Miss this step and the symptom is "the bot is online but completely ignores me": it isn't broken, it just doesn't recognize you.

## Step 4: Start the gateway

```bash
hermes gateway
```

The bot should come online within a few seconds[^1].

> **Want it running long-term?** `hermes gateway` runs in the foreground and stops when you close the terminal. To keep it resident, use tmux (WSL users take note: systemd is unreliable). See the [WSL2 guide](/install/wsl2/) and [Telegram common pitfalls](/en/troubleshoot/telegram/) for how.

## Step 5: Verify

Send a message to your bot on Telegram.

**Success criterion**: it replies. If nothing happens, check `~/.hermes/logs/gateway.log`: the gateway writes connection records there when it starts[^1].

The two most common reasons for no reply: **you didn't add yourself to the allowlist** (go back to step 3), or **the gateway isn't running** (go back to step 4).

## Want to use it in a group?

Group usage requires two extra actions[^2]:

1. **Disable privacy mode** in the bot's settings under BotFather
2. After changing the privacy setting, remove the bot from the group and re-add it

Without both steps, the bot won't receive messages in the group.

## FAQ

### A few skills are missing from the command menu?

Telegram caps slash commands at 100, and anything over that silently disappears. For the fix, see [Telegram common pitfalls](/en/troubleshoot/telegram/).

### Migrating from OpenClaw — do I need to reset authorization?

The official migration carries over `TELEGRAM_ALLOWED_USERS`, and adding `--migrate-secrets` also carries over the token. It's still worth verifying it yourself once the migration is done; see the [migration guide](/en/migrate/migrate-from-openclaw/).

### Can I connect multiple platforms at once?

Yes. The Hermes gateway supports 20+ messaging platforms, and Telegram is just one of them.

### The bot is online but never replies?

Nine times out of ten it's the allowlist. Confirm your numeric ID is in `TELEGRAM_ALLOWED_USERS` and that the gateway is running.

## Next steps

- Keeping the gateway resident and dealing with disconnects → [Telegram common pitfalls and fixes](/en/troubleshoot/telegram/)
- Resident setup for WSL users → [Full WSL2 guide](/install/wsl2/)
- Connecting external tools → [Connect your first MCP](/en/integrations/connect-first-mcp/)

[^1]: Nous Research, Telegram: https://hermes-agent.nousresearch.com/docs/user-guide/messaging/telegram (accessed 2026-07-25). Covers the BotFather creation flow, `hermes gateway setup`, the `TELEGRAM_BOT_TOKEN` / `TELEGRAM_ALLOWED_USERS` settings, and denying everyone by default
[^2]: Ibid., group usage requires disabling privacy mode in BotFather and, after the change, removing the bot from the group and re-adding it
[^3]: Ibid., look up your numeric user ID with @userinfobot; once `hermes gateway` starts, connection records are written to `~/.hermes/logs/gateway.log`
