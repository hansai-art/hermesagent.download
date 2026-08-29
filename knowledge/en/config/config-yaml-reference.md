---
title: 'What config.yaml Is: Two Settings Files and One Handy Set of Commands, Explained'
description: "Every tutorial tells you to 'go edit config.yaml,' but nobody shows you what that file looks like, where it lives, or how to fix it when it breaks. This starts from zero: what goes in config.yaml versus .env, which one wins, and why editing with commands is safer than editing by hand."
date: 2026-07-27
subcategory: 'reference'
hermes_version: '>=2026.5'
last_verified: 2026-07-27
human_reviewed: false
upstream_refs:
  - 'https://hermes-agent.nousresearch.com/docs/user-guide/configuration'
tags:
  - 'config'
  - 'reference'
status: 'published'
---

First, one plain fact: `config.yaml` is Hermes's "settings file." It's a plain text file that stores your preferences, like which AI model to use or whether to turn a feature on. Almost every tutorial tells you to "go edit `config.yaml`": set the model, turn on memory approval, add tools.

But hardly anyone first shows you the **whole picture**: where this file actually lives, how it splits work with another file called `.env`, and how to recover if you break it. This page is that map. Don't worry, I'll walk you through it step by step.

## First, one rule: your settings live in two files

Hermes splits your settings across **two files**, and there's just one dividing line[^1]:

| File                    | What goes in it                     | Examples                                                     |
| ----------------------- | ----------------------------------- | ------------------------------------------------------------ |
| `~/.hermes/config.yaml` | **Everything that is NOT a secret** | Model, where things run, memory limits, compression strategy |
| `~/.hermes/.env`        | **All the secrets**                 | API key, bot token, passwords                                |

A few terms here, and it's totally normal to see them for the first time:

- `~/.hermes/` is just a folder on your computer that holds Hermes's settings. The `~` is shorthand for "your home folder" (on Mac/Linux, something like `/Users/yourname`, or your personal folder after you log in).
- **API key**: a long string that acts as a password, proving "this AI service is being paid for by me." Anyone who gets it can spend money on your account, so keep it secret.
- **bot token**: similar to an API key. It's the pass that a chat platform (like Telegram) issues to your bot.
- **secret**: a general word for the "don't show anyone" things above.

⚠️ **Password-type things always go in `.env`, never in `config.yaml`**[^1]. This isn't just a habit: `.env` gets special protection, and the system's log files (a log is the running record a program automatically writes down) automatically black out the secrets inside them. Pasting an API key into `config.yaml` just makes it easier to leak by accident.

So what if `config.yaml` genuinely needs to use a password? Don't type the password in directly. Instead, use the `${VARIABLE_NAME}` style to tell it to go fetch the value from `.env`:

```yaml
auxiliary:
  vision:
    api_key: ${GOOGLE_API_KEY} # The value is in .env; this only references it
```

Think of `${GOOGLE_API_KEY}` as a sticky note that says "the real password is in the slot named GOOGLE_API_KEY over in .env." That way, even if someone sees your `config.yaml`, they don't see the real password.

## When the same setting appears in several places, who wins?

Sometimes the same setting shows up in more than one place. When that happens, Hermes follows a fixed order, from "highest priority" to "lowest"[^2]:

1. **CLI argument**: a setting you type on the command line for just this one time. For example, `hermes chat --model anthropic/claude-sonnet-4`. (CLI means "command line," the black text window where you type commands; a command-line argument is one of the options you tack on after a command.)
2. **`config.yaml`**: your main settings file, which lasts long-term.
3. **`.env`**: environment variables, used as a fallback (passwords always live here). (An environment variable is just a name=value pair stored in the system for programs to read, like a shared cheat sheet.)
4. **Built-in defaults**: the safe values Hermes prepares for you when you haven't set anything.

In plain terms: trying out a model on the command line for one session won't touch the long-term setting in your `config.yaml`; close that command-line session and you're back to the value in the file. It's like "borrowing a hat for a moment" doesn't change the clothes in your closet.

## Don't edit it by hand, use the `hermes config` commands

The format `config.yaml` uses is called YAML. YAML is very picky about "indentation" (how many spaces sit at the front of each line). When you edit by hand, one extra or missing space can break the whole file so that Hermes can't read it anymore. The official [Configuration reference](https://hermes-agent.nousresearch.com/docs/user-guide/configuration) is the source of truth for the current settings and their defaults.

The good news: Hermes has a built-in set of commands that does this for you. It **automatically figures out which file to write to** (a password goes into `.env`, everything else into `config.yaml`), and it checks whether what you entered is valid while it's at it[^3]:

```bash
hermes config              # 看目前所有設定
hermes config get model    # Show the resolved value of one key
hermes config set model anthropic/claude-opus-4
hermes config set terminal.backend docker
hermes config set OPENROUTER_API_KEY sk-or-...   # Automatically saves to .env
hermes config unset KEY    # Remove an override (return to the default)
hermes config edit         # Open an editor when you really need to edit by hand
```

Here, a **key** is "the name of a setting," for example `model`. `get` reads it, `set` sets it, `unset` clears it.

**How to confirm it worked**: after setting something, run `hermes config get <the key you just set>`. If the value it prints matches what you just set, it worked. The one exception: for the line where you set a password, it won't print the full value back to you; it'll only show part of it or hide it. That's **normal**, because it was safely put into `.env`.

If you later upgrade Hermes and want to add the new settings options a new version introduced, you can run `hermes config check` to see what's missing, then `hermes config migrate` to be walked through adding them step by step[^3].

## I want to do a certain thing, which section do I edit?

`config.yaml` is divided into many sections, and each section handles one kind of thing. You do **not** need to understand all of them. The table below matches "what you want to do" with "which section to edit," and each item has its own dedicated page you can dig into:

| You want to…                                               | Which section to edit | Read this                                                            |
| ---------------------------------------------------------- | --------------------- | -------------------------------------------------------------------- |
| Switch models / set an AI provider                         | `model`               | [Model providers and API keys](/en/config/model-provider/)           |
| Control what it remembers, turn on "ask me before writing" | `memory`              | [The memory system](/concepts/記憶系統/)                             |
| Manage skills, turn on skill-write approval                | `skills`              | [The skills system](/concepts/技能系統/)                             |
| Connect external tools                                     | `mcp_servers`         | [Connect your first MCP](/en/integrations/connect-first-mcp/)        |
| Change where it runs (Docker/SSH)                          | `terminal.backend`    | [Advanced install](/install/advanced/)                               |
| Conversation too long, getting compressed / blown up       | `compression`         | [context length exceeded](/en/troubleshoot/context-length-exceeded/) |

### A few settings people often ask about

- **`terminal.backend`** (default is `local`): decides "where" Hermes runs its actions. You can pick `local` / `docker` / `ssh` / `modal` / `daytona` / `singularity`[^4]. If you want to run it in a separate little room for extra safety, set `docker` (a technology that isolates a program while it runs).
- **`memory.write_approval`** (default `false`, meaning off): once you set it to `true`, the agent asks you first every time before it writes anything to memory[^4].
- **`agent.max_turns`** (default `500`): the maximum number of back-and-forth actions the agent can take in a single conversation[^4].
- **`compression.threshold`** (default `0.50`): once the conversation uses up this fraction (here, half), it starts compressing to save you room[^4].

## What else is in the `~/.hermes/` folder

`config.yaml` is just one of the files in this folder. Here's the whole picture[^5]:

```text
~/.hermes/
├── config.yaml     # Non-secret settings (this page's subject)
├── .env            # API keys and secrets
├── auth.json       # OAuth credentials
├── SOUL.md         # Agent identity settings
├── memories/       # MEMORY.md and USER.md
├── skills/         # Skills created by the agent
├── cron/           # Scheduled jobs
├── sessions/       # Gateway conversations
└── logs/           # errors.log and gateway.log (secrets are automatically masked)
```

(Quick terms: an **OAuth credential** is a kind of login pass that lets Hermes connect to certain services without retyping your username and password every time; the **gateway** is the layer that lets your bot send and receive messages.)

## Frequently asked questions

### I accidentally wrote an API key into config.yaml, is that a problem?

First, move it to `.env` (or just set it again with `hermes config set`, which will automatically put it in the right place), then delete that line from `config.yaml`.

One more important point: if that key was ever saved into version control (like git) or shown to someone else, treat it as already leaked. Go to that AI service's dashboard, revoke the old one, and generate a fresh key. That's the safer move.

### config.yaml and .env conflict on the same setting, who wins?

For a "non-secret" setting, `config.yaml` wins[^1]. But secrets should only ever live in `.env`, so in theory there shouldn't be a conflict.

### I changed a setting, but it doesn't seem to have taken effect?

Most settings only take effect on the **next startup**, so restarting once usually does it. If what you changed is an MCP (external tool) setting, you can type `/reload-mcp` right in the conversation to reload it immediately. For details, see [Connect your first MCP](/en/integrations/connect-first-mcp/).

### The team wants everyone on the same settings?

An administrator can use a system-level managed folder to pin certain values so individuals can't change them[^1]. This is for organization deployments; if you're using it on your own, you won't need it, so no need to worry about it.

## Next steps

- First get the "smallest setup that runs" in place → [Model providers and API keys](/en/config/model-provider/)
- Understand what the memory section is tuning → [The memory system](/concepts/記憶系統/)
- Move to a separate little room / remote execution → [Advanced install](/install/advanced/)

[^1]: Nous Research, Configuration: https://hermes-agent.nousresearch.com/docs/user-guide/configuration (accessed 2026-07-27). Split between the two files: config.yaml holds non-secret settings, .env holds API keys and secrets; inside config.yaml, reference .env variables with `${VAR}`

[^2]: Ibid., priority from high to low: CLI argument > `~/.hermes/config.yaml` > `~/.hermes/.env` > built-in defaults

[^3]: Ibid., the `hermes config` command family (get / set / unset / edit / check / migrate) automatically decides whether to write to config.yaml or .env and validates it

[^4]: Ibid., common key defaults: `terminal.backend`=local (options: docker/ssh/modal/daytona/singularity), `memory.write_approval`=false, `agent.max_turns`=500, `compression.threshold`=0.50

[^5]: Ibid., the `~/.hermes/` directory structure (config.yaml / .env / auth.json / SOUL.md / memories / skills / cron / sessions / logs, with secrets automatically masked in logs); for organization deployments an administrator can pin setting values with a managed directory
