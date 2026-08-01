---
title: "Something broke? Check things in this order and you won't waste time"
description: "The biggest time-waster is copying an error message into Google and blindly trying random fixes. This teaches you one fixed order: first check the program is even there, then the settings, then whether the model connects, and only last the features. One layer at a time, with a single command to confirm each layer."
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

When something breaks, the most common thing people do is also the biggest waste of time: you see an error message, you immediately paste it into Google, and then you try one random fix after another from whatever pages come up.

Why is that a bad idea?

Because an agent (here it means Hermes, the little AI helper that does things for you) is a chain, like a relay race. For it to work, four parts have to pass the baton one after another:

**the program itself → the config file → connecting to the model → the features**.

If any earlier link in the chain breaks, the symptom often "shows up" in a later link. So the place where you *see* the error is not always the place that is actually broken.

Two quick examples:
- You think the model is the problem, but really the settings were never read at all.
- You think you typed the settings wrong, but really you installed everything in a *different* environment, and the one you're in right now simply doesn't have it.

So don't guess. **Go in order, one layer at a time.** There are four layers, and each one has a single command that confirms right away whether that layer passed.

## Layer 1: Is the program even installed?

First, in your terminal (the black window with text where you can type commands), type:

```bash
hermes doctor
```

This is the official built-in "check-up" command[^1] — it runs a round of checks for you automatically.

Here's the key point: **if you can't even run this command** — the screen shows something like "hermes: command not found" — then the problem is in the outermost layer. It has nothing to do with your settings and nothing to do with the model. It simply means your shell (the program that takes the commands you type and runs them) can't find the hermes executable (the executable is the file that *is* the program itself).

→ [How to fix command not found](/en/troubleshoot/command-not-found/) (nine times out of ten, the shell just hasn't reloaded its PATH yet — it is not a failed install. PATH is the list of folders where your shell looks for programs.)

**One more super-common trap: mixed-up environments.** You might have several separate "environments," each with its own stuff installed, and they can't see each other:
- Things installed inside WSL2 (a small Linux system that runs inside Windows) can't be found from PowerShell (Windows' own command window).
- Things installed in your system Python can't be seen inside an environment opened by uv (a tool that manages Python environments for you).

So confirm one thing first: **is the window you're typing commands in right now the same one you used when you installed it?**

## Layer 2: Are the settings actually being read?

Once Layer 1 passes, look at the settings. Type:

```bash
hermes config show
```

**How you know it passed (the success check):** in the output, you should be able to see the provider (the company that supplies the AI model, e.g. some API service) and the model name — and it should be **the one you expect**. On top of that, the key field (the key is your API key, like a key that gives you permission to use the model) should have a value in it, not be blank.

If either of those two things is wrong, the problem is stuck at this layer.

The most common trap here: the file `~/.hermes/.env` is hiding an old set of settings that conflict with what you want to use now, and those old settings overwrote the new ones you just entered[^1]. (`.env` is a file made for holding environment variables; an environment variable is just a "name=value" setting that the program reads when it starts up.)

→ [How to fix API key not set / invalid key](/en/troubleshoot/api-key-not-set/)

## Layer 3: Can it actually reach the model?

The settings look right — now actually try connecting. Just type:

```bash
hermes
```

Then type any sentence and ask it something.

The point of this step is to separate two different things: "the settings are filled in correctly" and "it actually works." Correct settings don't guarantee it works — an expired key, a used-up quota, or a model name that doesn't actually exist will only show up once you really send a message and try to connect. (A token is the unit the model uses to count text; your quota is usually measured in tokens.)

**Now read carefully what the error message it spits out is actually saying:**
- The message mentions the key → go back and re-check Layer 2.
- The message mentions context or token → that's a Layer 4 problem (see below).
- The message says the model name doesn't exist → go back and double-check the spelling of the `HERMES_MODEL` setting.

→ [Model provider and API key setup](/en/config/model-provider/)

## Layer 4: The features

If all three earlier layers passed, the problem is in a specific feature. By this point the symptom is usually very clear — just match it against the table below and go to the matching fix:

| The symptom you see | Read this |
|---|---|
| `context length exceeded` | [How to fix it](/en/troubleshoot/context-length-exceeded/) |
| `Preflight compression`, conversation getting slower and slower | [How to fix a slow long session](/troubleshoot/long-session-preflight-compression/) (a session is one continuous conversation from start to finish) |
| A cron job's time came but nothing was sent / nothing ran | [First check the gateway, jobs.json, and output](/troubleshoot/cron-job-did-not-run/) (cron is the scheduling feature that runs tasks automatically at set times; the gateway is the layer that lets your bot send and receive messages) |
| `Python 3.11 or newer` | [How to fix it](/en/troubleshoot/python-version-too-old/) |
| Telegram command menu is missing items, gateway keeps disconnecting | [How to fix it](/en/troubleshoot/telegram/) |
| Behaving strangely after moving over from OpenClaw | [Migration guide](/en/migrate/migrate-from-openclaw/) |

## None of these? Then go check the issues

If you've been through all four layers and ruled them out, what you're hitting is very likely a "known problem" — something other people already ran into and wrote down.

We've turned 300-plus issues from the official GitHub (an issue is a post where users report problems or discuss them) into English summaries, sorted by component:

- [Agent core](/issues/) · [Gateway (the message layer)](/issues/) · [CLI](/issues/) (the CLI means operating the program by typing commands) · [Config file](/issues/) · [Desktop app](/issues/) · [Auth and API key](/issues/)

Every summary links to the original issue, so you can jump straight to the full discussion thread or track whether it's been fixed yet.

## Reporting a problem

If you've confirmed this isn't a known problem, and you feel this is something the docs here *should* have covered but didn't:
[Open an issue and tell us](https://github.com/hansai-art/hermesagent.download/issues/new?template=01-content-error.yml).

Whatever you worked hard to figure out — write it down, and the next person who hits the same thing won't have to start over.

## Next steps

- Want to let the machine run a round of checks for you first → [What hermes doctor actually checks](/troubleshoot/hermes-doctor/)
- Want to start from the beginning → [Beginner path](/guides/start/)
- Want to see real cases → [Curated official issues in English](/issues/)

[^1]: Nous Research, FAQ: https://hermes-agent.nousresearch.com/docs/reference/faq (accessed 2026-07-23)
