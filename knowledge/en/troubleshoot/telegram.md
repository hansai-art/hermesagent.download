---
title: "Two Gotchas When Connecting Telegram to Hermes Agent"
description: "A few commands mysteriously missing from the menu, and the gateway dropping offline in the middle of the night: both have clear causes and official fixes. It's not a misconfiguration on your end."
date: 2026-07-23
subcategory: "telegram"
hermes_version: ">=2026.5"
last_verified: 2026-07-04
human_reviewed: false
upstream_refs:
  - "https://hermes-agent.nousresearch.com/docs/reference/faq"
tags:
  - "telegram"
  - "troubleshoot"
status: "published"
---

Telegram is the platform most people use to connect to Hermes Agent: from your phone you can fire off a message to it any time, and it does the work remotely and reports back.

But two things will make you wonder whether you set something up wrong: **a few skills mysteriously missing from the command menu**, and **the gateway dropping offline after running for a while**. Neither is your fault, and both have clear fixes.

## Gotcha 1: Telegram only allows 100 slash commands

The Telegram platform imposes a **limit of 100 slash commands** per bot. Hermes registers each skill as a slash command, so once you have enough skills you'll exceed the limit. The overflow doesn't raise an error — it **just silently fails to appear**[^1].

So you'll see this: certain skills work fine in the terminal, but can't be found in Telegram.

**Fix**: In `~/.hermes/config.yaml`, disable the skills this platform doesn't need[^1]:

```yaml
skills:
  platform_disabled:
    telegram: [skill-a, skill-b]
```

After making this change, you **must restart the gateway** for it to take effect.

**Success criterion**: After restarting, type `/` in Telegram, and the commands that had disappeared are back in the menu.

**Which ones to disable**: Pick the ones you'd never use on a phone anyway — skills that require viewing large amounts of output, editing files, or interactive operation. Just keep those in the terminal.

## Gotcha 2: the gateway keeps dropping offline (WSL users)

If you're running the gateway inside WSL and it consistently stops responding after a while, the likely cause is that **systemd is unreliable in the WSL environment**[^1].

What makes this one especially nasty: you set up the systemd service following a generic Linux tutorial, `systemctl status` looks fine too, but in reality once you restart WSL it's gone.

**Fix**: Don't rely on systemd. Use foreground mode or keep it resident in tmux instead:

```bash
tmux new -s hermes 'hermes gateway run'
```

**Success criterion**: Close the terminal window and open a new one; `tmux ls` shows the `hermes` session is still there.

To return to that session:

```bash
tmux attach -t hermes
```

(To detach without closing it: `Ctrl+B` then `D`.)

⚠️ When Windows fully shuts down WSL or reboots, the tmux session will still disappear. Automatic startup at boot requires separately configuring the Windows Task Scheduler. See the [WSL2 installation guide](/install/wsl2/).

## Set up authorization for shared use

If your bot isn't just for yourself, be sure to configure authorization: otherwise anyone who finds your bot can operate your agent.

The official messaging gateway supports an allowlist and DM pairing; you configure the authorization mode in the gateway section of `config.yaml`.

> 📝 **This section lacks a concrete configuration example**: we haven't yet documented the exact YAML structure for the allowlist.
> If you've configured it, [please add it](https://github.com/hansai-art/hermesagent.download/edit/main/knowledge/troubleshoot/telegram.md):
> this concerns security and is worth spelling out clearly.

## Frequently asked questions

### I'm migrating from OpenClaw — do I need to reset the allowlist?

The official migration command carries over compatibility settings like `TELEGRAM_ALLOWED_USERS`, and when you add `--migrate-secrets` it also carries over `TELEGRAM_BOT_TOKEN`. Even so, it's a good idea to verify it yourself once the migration is done. See the [OpenClaw migration guide](/en/migrate/migrate-from-openclaw/).

### I changed the command menu but it didn't take effect?

Two possibilities: the gateway wasn't restarted, or the Telegram client cached the old menu. Restart the gateway first, then close and reopen the Telegram conversation.

### It drops offline even though I'm not on WSL?

Then this isn't the cause. Start by checking the gateway's run logs — it may be a network or token problem.

> 📝 **To be added**: where to find the gateway logs is something we haven't documented yet. Contributions welcome.

## Next steps

- Full WSL2 setup → [WSL2 installation guide](/install/wsl2/)
- Migrating from OpenClaw → [migration guide](/en/migrate/migrate-from-openclaw/)
- Other issues → [troubleshooting overview](/en/troubleshoot/overview/)

[^1]: Nous Research, FAQ: https://hermes-agent.nousresearch.com/docs/reference/faq (accessed 2026-07-23)
