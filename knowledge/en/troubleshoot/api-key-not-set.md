---
title: "API key not set / How to fix an invalid API key"
description: "The most common cause isn't a mistyped key — it's a key mismatched with its provider. A three-step diagnosis, including conflicting settings in ~/.hermes/.env."
date: 2026-07-23
subcategory: "auth"
hermes_version: ">=2026.5"
last_verified: 2026-07-04
human_reviewed: false
upstream_refs:
  - "https://hermes-agent.nousresearch.com/docs/reference/faq"
tags:
  - "auth"
  - "troubleshoot"
status: "published"
---

You're sure the key is right: you just copied and pasted it straight from the provider's dashboard, character for character. But Hermes keeps telling you:

```
API key not set
```

Or, even more maddening: the key is clearly filled in, yet it still comes back saying authentication failed.

**The most common cause isn't a mistyped key — it's a key mismatched with its provider.** An OpenAI key won't work on OpenRouter, and vice versa[^1]: keys from the two look very similar, so it's easy to paste one into the wrong field.

## Step 1: See what's actually configured

```bash
hermes config show
```

This lists your current settings[^1]. Check two things:

1. **Whether the provider is the one you think it is**: if you believe you're using OpenRouter but this shows OpenAI, then of course the key won't match.
2. **Whether the key actually got saved**

> 📝 **This section is missing real output**: what the actual fields of `hermes config show` look like, and whether the key is masked — we don't have a live screen capture on hand.
> [Help us fill it in](https://github.com/hansai-art/hermesagent.download/edit/main/knowledge/troubleshoot/api-key-not-set.md).

## Step 2: Set it up again from scratch

The safest approach is to go through the interactive menu, which ensures the provider and the key are configured as a matched pair:

```bash
hermes model
```

The menu walks you through choosing a provider and entering the key[^1]. This is less error-prone than configuring things by hand.

If you're certain which provider you're using, you can also set it directly:

```bash
hermes config set OPENROUTER_API_KEY sk-or-v1-xxxx
```

**Watch the key's prefix**: it usually tells you which provider the key belongs to:

| Prefix | Provider |
|---|---|
| `sk-or-v1-` | OpenRouter |
| `sk-` | OpenAI |
| `sk-ant-` | Anthropic |

If the prefix doesn't match the provider you've configured, that's your mismatch.

## Step 3: Check .env for conflicting settings

This is the step that's easiest to overlook. Hermes reads `~/.hermes/.env`, and if there's an old, conflicting key in there, it can override the one you just set[^1]:

```bash
cat ~/.hermes/.env
```

**What you'll see**: environment variables in `KEY=value` format, one per line. If it contains an old key you no longer use (for example, one left over from before you switched providers), delete or comment out those lines.

## Verify that it's fixed

```bash
hermes
```

Go in and ask it anything. **Success criterion**: it replies normally, with no more key-related errors.

If it still fails, the error message this time is usually more specific (for example, insufficient credit, or a nonexistent model name) — just follow what the message says. At the very least, it's no longer a case of the key not being set.

## FAQ

### My settings disappeared after an update?

First run `hermes config show` to confirm the current state, then use `hermes model` to set things up again[^1].

### I don't want to manage keys myself — is there an easier way?

Yes. The official Portal handles it in one step, so you don't have to sign up for a key with each provider individually:

```bash
hermes setup --portal
```

### Want to switch to a different model?

```bash
hermes config set HERMES_MODEL anthropic/claude-opus-4.7
```

Or switch directly within a conversation: `/model <name>`, and for a different provider use `/model provider:model`[^1].

### Don't want to pay anything at all?

Use a local model. Run `hermes model`, choose Custom endpoint, and enter your Ollama address. Local models are completely free[^1]. For configuration details, see [Model providers and API key setup](/en/config/model-provider/).

## Next steps

- How to choose a provider and how to save money → [Model providers and API key setup](/en/config/model-provider/)
- Hitting a different error → [Troubleshooting overview](/en/troubleshoot/overview/)

[^1]: Nous Research, FAQ: https://hermes-agent.nousresearch.com/docs/reference/faq (accessed 2026-07-23)
