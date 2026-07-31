---
title: "What config.yaml Is: Two Files, One Rule, One Set of Commands"
description: "Every tutorial tells you to \"edit config.yaml,\" but nobody gives you the full picture. Understand how config.yaml and .env divide the work, their precedence order, and why editing by hand is worse than using hermes config."
date: 2026-07-27
subcategory: "reference"
hermes_version: ">=2026.5"
last_verified: 2026-07-27
human_reviewed: false
upstream_refs:
  - "https://hermes-agent.nousresearch.com/docs/user-guide/configuration"
tags:
  - "config"
  - "reference"
status: "published"
---

Almost every tutorial tells you to "edit `config.yaml`": set the model, enable memory approval, add an MCP server. But few of them start by telling you the **full picture** of that file: where it lives, how it splits responsibilities with `.env`, and how to recover when you get it wrong. This page fills in that map.

## One rule you have to remember first

Hermes splits its configuration across **two files**, with a single dividing line[^1]:

| File | What goes in it | Examples |
|---|---|---|
| `~/.hermes/config.yaml` | **All non-secret settings** | Model, execution backend, memory limits, compression strategy |
| `~/.hermes/.env` | **All secrets** | API keys, bot tokens, passwords |

⚠️ **Keys always go in `.env`, never in `config.yaml`**[^1]. This is more than a convention: `.env` is handled differently, and logs automatically redact the secrets it contains. Pasting an API key into `config.yaml` just makes it easier to leak.

To reference a secret from within config.yaml, use the `${VARIABLE_NAME}` syntax so it pulls the value from `.env` instead of hardcoding it:

```yaml
auxiliary:
  vision:
    api_key: ${GOOGLE_API_KEY}   # value lives in .env; this only references it
```

## Who overrides whom: the precedence order

When the same setting appears in more than one place, Hermes decides from highest to lowest priority like this[^2]:

1. **CLI arguments**: a one-off override, e.g. `hermes chat --model anthropic/claude-sonnet-4`
2. **`config.yaml`**: your main configuration file
3. **`.env`**: the environment-variable fallback (secrets always live here)
4. **Built-in defaults**: the safe defaults when you've set nothing

In other words: trying out a model on the command line won't touch the long-term settings in your config.yaml; close the command line and you're back to the values in the file.

## Don't hand-edit; use `hermes config`

YAML is sensitive to indentation, and a single stray space edited by hand can break the whole file. Hermes ships a set of commands that **automatically decide which file to write to** (secrets to `.env`, everything else to `config.yaml`) and validate correctness[^3]:

```bash
hermes config              # show all current settings
hermes config get model    # look up a key's resolved value
hermes config set model anthropic/claude-opus-4
hermes config set terminal.backend docker
hermes config set OPENROUTER_API_KEY sk-or-...   # saved automatically to .env
hermes config unset KEY    # remove a value you set (revert to default)
hermes config edit         # when you really must hand-edit, open the editor with this
```

**Success criterion**: the value printed by `hermes config get <the key you just set>` matches what you set. The line that sets a secret won't echo the full value back, which is normal (it went into `.env`).

After an upgrade, to fill in options that a new version added, use `hermes config check` to see what's missing and `hermes config migrate` to add them interactively[^3].

## Which need, which section

config.yaml is divided into many sections. You don't need to understand all of them: the table below maps "what you want to do" to "which section to edit," and each has a dedicated in-depth page:

| You want to… | Section | See |
|---|---|---|
| Switch models / set a provider | `model` | [Model providers and API keys](/en/config/model-provider/) |
| Control what it remembers, enable write approval | `memory` | [Memory system](/concepts/記憶系統/) |
| Manage skills, enable skill write approval | `skills` | [Skills system](/concepts/技能系統/) |
| Connect external tools | `mcp_servers` | [Connect your first MCP](/en/integrations/connect-first-mcp/) |
| Change the execution environment (Docker/SSH) | `terminal.backend` | [Advanced installation](/install/advanced/) |
| Conversation gets compressed / blows up when too long | `compression` | [context length exceeded](/en/troubleshoot/context-length-exceeded/) |

### A few frequently asked-about keys

- **`terminal.backend`** (default `local`): the execution backend; options are `local` / `docker` / `ssh` / `modal` / `daytona` / `singularity`[^4]. Set `docker` if you want sandbox isolation.
- **`memory.write_approval`** (default `false`): set `true` and the agent asks you before every memory write[^4].
- **`agent.max_turns`** (default `500`): the maximum number of iterations in a single conversation[^4].
- **`compression.threshold`** (default `0.50`): compression kicks in once the context reaches this fraction of capacity[^4].

## What else lives in `~/.hermes/`

config.yaml is just one member of this directory. The full picture[^5]:

```text
~/.hermes/
├── config.yaml     # non-secret settings (the star of this page)
├── .env            # API keys and secrets
├── auth.json       # OAuth credentials
├── SOUL.md         # the agent's identity configuration
├── memories/       # MEMORY.md, USER.md
├── skills/         # skills the agent has grown
├── cron/           # scheduled tasks
├── sessions/       # gateway conversations
└── logs/           # errors.log, gateway.log (secrets auto-redacted)
```

## FAQ

### I wrote an API key into config.yaml. Does it matter?

Move it to `.env` (or re-set it with `hermes config set`, which puts it in the right place automatically), then delete that line from config.yaml. If the key ever made it into version control or was shared, treat it as leaked and generate a fresh one from the provider's dashboard.

### What if config.yaml and .env have a conflicting setting?

For non-secret settings, `config.yaml` wins[^1]. But secrets should only ever be in `.env`, so there shouldn't be a conflict.

### Changed a setting and nothing happened?

Most settings take effect on the next startup. MCP settings can be reloaded live during a conversation with `/reload-mcp`; see [Connect your first MCP](/en/integrations/connect-first-mcp/).

### A team wants shared settings?

An administrator can pin certain values through a system-level managed directory[^1]. That falls under organizational deployment and isn't something individual users need.

## Next steps

- Set up the minimal configuration to get it running → [Model providers and API keys](/en/config/model-provider/)
- Understand what the memory section tunes → [Memory system](/concepts/記憶系統/)
- Switch to sandboxed / remote execution → [Advanced installation](/install/advanced/)

[^1]: Nous Research, Configuration: https://hermes-agent.nousresearch.com/docs/user-guide/configuration (accessed 2026-07-27). The two-file split: config.yaml holds non-secret settings, .env holds API keys and secrets; config.yaml references .env variables with `${VAR}`.
[^2]: Ibid., precedence from highest to lowest: CLI arguments > `~/.hermes/config.yaml` > `~/.hermes/.env` > built-in defaults.
[^3]: Ibid., the `hermes config` command family (get / set / unset / edit / check / migrate) automatically decides whether to write to config.yaml or .env and validates correctness.
[^4]: Ibid., default values for common keys: `terminal.backend`=local (options docker/ssh/modal/daytona/singularity), `memory.write_approval`=false, `agent.max_turns`=500, `compression.threshold`=0.50.
[^5]: Ibid., the `~/.hermes/` directory structure (config.yaml / .env / auth.json / SOUL.md / memories / skills / cron / sessions / logs, with secrets auto-redacted in logs); for organizational deployments an administrator can pin configuration values via a managed directory.
