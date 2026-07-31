---
title: "Model Providers and API Key Setup"
description: "Which provider to pick, how to enter your key, how to save money, and how to connect a local model. Includes the setting that runs subagents on a cheap model: the single highest-impact tweak."
date: 2026-07-23
subcategory: "provider"
hermes_version: ">=2026.5"
last_verified: 2026-07-04
human_reviewed: false
upstream_refs:
  - "https://hermes-agent.nousresearch.com/docs/reference/faq"
  - "https://hermes-agent.nousresearch.com/docs/getting-started/installation"
tags:
  - "provider"
  - "config"
status: "published"
---

Installing Hermes Agent isn't enough to start using it: it doesn't ship with a model of its own, so you first have to tell it where to get its inference capability.

This step determines two things: **how good the experience is**, and **how much you pay each month**. And the gap between those outcomes can be huge: for the same amount of work, a good configuration versus a poor one can differ in cost by an order of magnitude.

## The fastest path: the official Portal

If you'd rather not apply for an API key from each provider one by one:

```bash
hermes setup --portal
```

The Nous Portal gives you access to 300+ models, all configured in one go[^1].

## The standard path: the interactive menu

```bash
hermes model
```

This opens an interactive menu where you pick a provider and enter your API key[^1]. Officially supported providers include OpenRouter, OpenAI, Anthropic Claude, Google Gemini, as well as local models such as Ollama and vLLM.

**Success criterion**: the menu flow completes without errors, and `hermes config show` then displays the provider you selected.

## How to choose among providers

| Provider | Best for |
|---|---|
| **Nous Portal** | People who don't want to manage keys and want access to many models at once |
| **OpenRouter** | Switching and price-comparing across multiple models with a single key |
| **OpenAI / Anthropic / Google** | People who already have an account, or who specifically depend on one provider's models |
| **Ollama / vLLM (local)** | People who don't want to pay at all, or whose data can't leave their own machine |

## Writing the configuration directly (advanced)

If you're sure which provider you want, you can skip the menu:

```bash
hermes config set OPENROUTER_API_KEY sk-or-v1-xxxx
```

Specify a particular model:

```bash
hermes config set HERMES_MODEL anthropic/claude-opus-4.7
```

You can also switch on the fly within a conversation, no restart required[^1]:

```
/model <model-name>
/model provider:model
```

## Connecting a local model (completely free)

Run `hermes model`, choose **Custom endpoint**, and enter the address of your local service. For Ollama, for example:

```
http://localhost:11434/v1
```

**Important**: when connecting a local model, you must explicitly set the context length in the config file. Otherwise Hermes may infer the wrong limit, causing a `context length exceeded` error even before the conversation gets very long.

Edit `~/.hermes/config.yaml`:

```yaml
model:
  default: your-model-name
  context_length: 131072
```

`context_length` should be set to **the number your server actually supports**[^1], not the model's theoretical maximum. For Ollama, that's the `num_ctx` value in the Modelfile.

## Saving money: run subagents on a cheap model

This is the highest-impact trick, yet many people don't know about it.

Hermes dispatches subagents to handle work in parallel. Most of these subtasks don't need the most powerful model: but by default they use the main model you configured, meaning you're paying flagship prices to do chores.

In the `delegation` section of `~/.hermes/config.yaml`, specify a dedicated cheap model for subagents[^1]:

```yaml
delegation:
  model: google/gemini-3-flash-preview
  provider: openrouter
```

The main conversation stays high-quality, while subtasks run on the cheap model.

> 📝 **Real-world data still needed**: how much you actually save depends on your usage patterns.
> If you've compared your bills before and after, [help us fill in the real numbers](https://github.com/hansai-art/hermesagent.download/edit/main/knowledge/config/model-provider.md):
> this kind of information, which you only learn from actual use, is exactly what this site is missing most.

## Confirming the configuration took effect

```bash
hermes config show
```

**What to look for**: that the provider and model are the ones you configured.

Then actually run it once:

```bash
hermes
```

Ask any question; a normal reply means the whole path is working.

## Frequently asked questions

### How much does this actually cost?

Hermes Agent itself is open-source software under the MIT license, and it's **free**. You only pay the API costs of the provider you choose[^1]. With a local model, it costs nothing at all.

### I entered the API key but still get an error?

The most common cause is a mismatch between the key and the provider: an OpenAI key can't be used with OpenRouter[^1]. For detailed troubleshooting, see [how to fix API key not set](/en/troubleshoot/api-key-not-set/).

### Want to switch models mid-conversation?

Use `/model <name>`, or `/model provider:model` to go across providers[^1], with no restart needed.

### Getting context length exceeded?

First run `/compress` to compress the current conversation and `/usage` to check usage; the long-term fix is to explicitly set `context_length` in `config.yaml`[^1]. See [how to fix context length exceeded](/en/troubleshoot/context-length-exceeded/) for details.

## Next steps

- Want to know where your tokens actually go → [hermes insights: figure out where your tokens go](/config/insights-token-usage/)
- Haven't installed yet → [Installation and deployment](/install/)
- Migrating from OpenClaw → [Migration guide](/en/migrate/migrate-from-openclaw/)
- Curious what it can do → [Skills catalog](/skills/catalog/)

[^1]: Nous Research, FAQ: https://hermes-agent.nousresearch.com/docs/reference/faq (accessed 2026-07-23)
