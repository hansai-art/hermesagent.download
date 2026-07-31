---
title: "The Right Order to Troubleshoot"
description: "Firing blindly wastes the most time. A four-layer diagnostic method: verify the executable first, then the configuration, then the model, and only then the feature. Check in order and you won't waste effort."
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

When something breaks, the biggest time-waster is to take the error message, search that exact phrase, and start blindly trying whatever fixes you find online.

That's because an agent is a chain: **executable → config file → model connection → feature**. When any link breaks, the symptom can show up further down the chain. You think it's a model problem, but really the config was never loaded; you think the config is wrong, but really the whole thing is installed in a different environment.

So check in order. Four layers, each with one clear command to verify it.

## Layer 1: Does the executable exist?

```bash
hermes doctor
```

This is the official diagnostic command[^1]. **If you can't even find this command**, the problem is at the outermost layer: it's not the config, not the model, it's that your shell can't find the executable.

→ [How to fix command not found](/en/troubleshoot/command-not-found/) (nine times out of ten the shell just hasn't reloaded PATH, not that the install failed)

**Mixed-up environments are also common**: something installed under WSL2 won't be found by PowerShell; something installed into the system Python won't be found inside a uv environment. First make sure the shell you're in right now is the same one you installed with.

## Layer 2: Is the config being read?

```bash
hermes config show
```

**Done criterion**: the output shows a provider and a model, and **it's the one you expect**; the key field has a value.

If either is wrong, the problem is at this layer.

The most common trap at this layer is stale, conflicting settings in `~/.hermes/.env` overriding what you just set[^1].

→ [How to fix API key not set / invalid](/en/troubleshoot/api-key-not-set/)

## Layer 3: Can it reach the model?

```bash
hermes
```

Ask it anything. This step separates "configured correctly" from "actually working": you filled in the config correctly, but an expired key, an exhausted quota, or a nonexistent model name will only blow up here.

**Read the specifics of the error message**: if it mentions the key, go back to Layer 2; if it mentions context or token, that's Layer 4; if it says the model name doesn't exist, go back and check the spelling of `HERMES_MODEL`.

→ [Model provider and API key setup](/en/config/model-provider/)

## Layer 4: The feature layer

If the first three layers all pass, the problem is in a specific feature. By this point the symptom is usually quite clear:

| Symptom | Read this |
|---|---|
| `context length exceeded` | [How to fix](/en/troubleshoot/context-length-exceeded/) |
| `Preflight compression`, getting slower over time | [How to fix a slowing long session](/troubleshoot/long-session-preflight-compression/) |
| cron doesn't notify / doesn't run at the scheduled time | [Check the gateway, jobs.json, and output first](/troubleshoot/cron-job-did-not-run/) |
| `Python 3.11 or newer` | [How to fix](/en/troubleshoot/python-version-too-old/) |
| Telegram command menu is missing items, gateway disconnected | [How to fix](/en/troubleshoot/telegram/) |
| Behaving strangely after migrating from OpenClaw | [Migration guide](/en/migrate/migrate-from-openclaw/) |

## None of these? Then check the issues

If you've ruled out all four layers above, chances are you've hit a known problem. We've compiled Chinese-language summaries of 300-plus official GitHub issues, categorized by component:

- [Agent core](/issues/) · [Gateway message broker](/issues/) · [CLI](/issues/) · [Config file](/issues/) · [Desktop app](/issues/) · [Authentication and API keys](/issues/)

Each summary links to the original issue, so you can go straight to the discussion thread or track the fix's progress.

## Reporting a problem

If you've confirmed it isn't a known problem, and you feel these docs should have covered it but didn't:
[Open an issue and tell us](https://github.com/hansai-art/hermesagent.download/issues/new?template=01-content-error.yml).
Whatever you spent time figuring out, the next person won't have to spend it again.

## Next steps

- Let the machine run a first pass for you → [What hermes doctor actually checks](/troubleshoot/hermes-doctor/)
- Start from the beginning → [The beginner's path](/guides/start/)
- Want real-world cases → [Curated official issues in Chinese](/issues/)

[^1]: Nous Research, FAQ: https://hermes-agent.nousresearch.com/docs/reference/faq (accessed 2026-07-23)
