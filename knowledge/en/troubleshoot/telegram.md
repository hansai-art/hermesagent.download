---
title: "Two Common Snags When Connecting Telegram to Hermes Agent"
description: "A few features go missing from your command menu, and the gateway (the layer that lets your bot send and receive messages) drops offline on its own. Neither is your fault, and both have a fix."
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

First, what this page is about. Hermes Agent is a program that does tasks for you (people call it an agent: you give it a job, it goes and does it). A lot of people like to connect it to Telegram, the chat app. The nice part: you can be out and about, tap out a quick message on your phone, and the agent does the work on a remote computer and messages you back with the result. Very handy.

But once you connect it, two things can easily make you think you set something up wrong:

1. **A few features quietly go missing from the command menu.**
2. **The gateway keeps dropping offline on its own after running for a while.**

Let me explain one word first: the gateway (the layer of software that lets your bot send and receive messages on Telegram). Think of it as your bot's switchboard operator: every message in and out has to pass through it.

Good news: neither of these is your fault, and both have a clear fix. Let me walk you through them one at a time.

## Snag 1: Telegram only allows 100 slash commands

Quick explanation of a "slash command." In Telegram, when you type a slash `/`, a little menu of features pops up. The ones that start with a slash are called slash commands (for example, `/start`).

Every skill in Hermes (a skill is one thing the agent knows how to do) turns into a slash command once it is connected to Telegram. Here is the catch: Telegram, the platform, has a rule that a single bot can have **at most 100 slash commands**. Once you have a lot of skills, the ones past 100 get no error message at all. Telegram **just quietly leaves them out**[^1].

So you run into this odd situation: a skill works fine in your computer's terminal (the plain window where you type commands), but it is nowhere to be found in Telegram. It is not broken. It just got squeezed out.

**How to fix it**: open your config file and turn off the skills you never use on this platform, to free up spots.

The config file lives here: `~/.hermes/config.yaml`. This is a YAML file (a settings-file format meant to be read by both people and programs, which uses indentation to show what belongs under what). Open it and add these lines[^1]:

```yaml
skills:
  platform_disabled:
    telegram: [skill-a, skill-b]
```

Just replace `skill-a` and `skill-b` above with the names of the skills you want to turn off.

After you change it, **you must restart the gateway** for the new setting to take effect. (Changing the setting without restarting does nothing.)

**How to confirm it worked**: after restarting, go back to Telegram and type a `/`. The commands that had disappeared should be right back in the menu.

**Which ones to turn off**: pick the ones you would "never use on a phone" anyway. Skills that dump out a huge wall of text, that need you to edit files, or that need several back-and-forth steps are nicer to use in the computer terminal. Do not let them take up your Telegram slots.

## Snag 2: The gateway keeps dropping offline (read this if you use WSL)

This section is for people using WSL. WSL is a tool that lets you "run Linux inside Windows" (so you can work on a Windows computer as if it were Linux).

If you run the gateway inside WSL and it goes quiet and unresponsive after running for a while, the cause is very likely that **systemd is not reliable in a WSL environment**[^1]. (systemd is a caretaker program on Linux whose job is to keep programs running in the background for you.)

The nastiest part of this trap is that it fools you. You follow a normal Linux guide, set up systemd to watch over the gateway, and run `systemctl status` to check on it, and the screen says everything is fine. But in reality, the moment WSL restarts, that caretaker silently vanishes, and the gateway goes with it.

**How to fix it**: stop relying on systemd. Use one of the two approaches below to keep the gateway running on its own.

One is "foreground mode," where you just open a window and let it run there. The other, which I recommend, uses tmux. tmux is a small tool that gives you a persistent workspace that "does not close just because you closed the window." The command looks like this:

```bash
tmux new -s hermes 'hermes gateway run'
```

**How to confirm it worked**: close this whole terminal window, open a fresh one, and type `tmux ls`. If you can still see the session (workspace) named `hermes`, it really is alive in the background, and it worked.

To go back into that workspace and see what it is doing, type this:

```bash
tmux attach -t hermes
```

When you are done and want to leave but **not** shut it down: press `Ctrl+B`, let go, then press `D`. That drops you back out while the gateway keeps running in the background.

⚠️ One heads-up: if you shut down WSL entirely, or restart the computer, the tmux workspace will still disappear (that is normal; it cannot survive a shutdown). If you want the gateway to "start automatically as soon as the computer boots," you have to set that up separately in the Windows Task Scheduler. For the details, see the [WSL2 install guide](/install/wsl2/).

## If more than one person uses it, you must set up authorization

If you are the only one using your bot, you can skip this section for now. But the moment a second person will use it, or the bot could be found by someone else, you **must** set up authorization.

The reason is simple: without it, anyone who finds your bot can give your agent commands and make it do things. It is like leaving your front door unlocked.

The official message gateway supports two ways to screen people: an allowlist (a list that says "only these people may use it") and DM pairing (using a direct message to confirm who someone is). You set the authorization mode for both in the gateway section of `config.yaml`.

> 📝 **This section is still missing a concrete example**: exactly how to write the allowlist, and what the YAML looks like, is something we have not put together yet.
> If you have set it up before, [please help fill it in](https://github.com/hansai-art/hermesagent.download/edit/main/knowledge/troubleshoot/telegram.md):
> this touches on security, so it is worth spelling out clearly.

## Common questions

### I moved over from OpenClaw. Do I need to redo the allowlist?

No need to set it up from scratch. The official migration command (the tool that moves your settings from the old system to the new one) automatically brings over compatible settings like `TELEGRAM_ALLOWED_USERS`. If you add `--migrate-secrets` to the command, it also brings over `TELEGRAM_BOT_TOKEN` (your bot's access password). That said, once it is done, it is still a good idea to check it yourself for peace of mind. For how to do it, see the [OpenClaw migration guide](/en/migrate/migrate-from-openclaw/).

### I changed the command menu, but nothing looks different?

There are two common reasons. One is that the gateway was not restarted (a settings change only counts after a restart). The other is that the Telegram app itself remembered the old menu (this is called caching, where the app takes a shortcut and reuses the old data). Do it in this order: restart the gateway first, then close that chat in Telegram and open it again.

### I am not using WSL and it still drops. Why?

Then it is not the cause described above. In that case, first go look at the gateway's run log (a log is the record a program leaves behind as it runs; when something goes wrong, you can usually find a clue in it). It could be an unstable network, or a problem with the token (the access password).

> 📝 **To be added here**: exactly where to find the gateway's run log is something we have not put together yet. Contributions welcome.

## Next steps

- Want to set up WSL2 fully → [WSL2 install guide](/install/wsl2/)
- Moving over from OpenClaw → [migration guide](/en/migrate/migrate-from-openclaw/)
- Stuck on something else → [troubleshooting overview](/en/troubleshoot/overview/)

[^1]: Nous Research, FAQ: https://hermes-agent.nousresearch.com/docs/reference/faq (accessed 2026-07-23)