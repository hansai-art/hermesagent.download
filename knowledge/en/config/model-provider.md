---
title: 'Set Up Your Model Provider and API Key: A Step-by-Step Guide for Beginners'
description: "Hermes won't work right after you install it. First you have to tell it where to borrow an AI brain. This guide walks you through picking one, adding your key, and one money-saving setting that really pays off."
date: 2026-07-23
subcategory: 'provider'
hermes_version: '>=2026.5'
last_verified: 2026-07-04
human_reviewed: false
upstream_refs:
  - 'https://hermes-agent.nousresearch.com/docs/reference/faq'
  - 'https://hermes-agent.nousresearch.com/docs/getting-started/installation'
tags:
  - 'provider'
  - 'config'
status: 'published'
---

After you install Hermes Agent, it still can't do anything yet.

Why not? Because Hermes has no AI brain built in (that brain is called a "model" — the AI that actually thinks and answers for you). Hermes is more like the "body" of an assistant: it knows all the moves, but you have to plug a brain into it first. This guide shows you how.

The official name for this step is setting up your "model provider" (a provider is the company or service that supplies the AI model, like OpenAI or Google).

It decides two things:

- How smooth the whole thing feels to use.
- How much you pay each month.

And the gap can be big. For the same amount of work, a good setup versus a bad one can cost you more than ten times as much. So spending a few minutes to get it right is worth it.

Below are a few paths, from the easiest to the most advanced. Just pick one and do it.

## The easiest path: let the official Portal handle it all at once

If you "don't want to sign up with company after company and collect keys one at a time," pick this.

In your terminal (that black window with white text where you type commands), enter this line:

```bash
hermes setup --portal
```

This uses Nous Portal (the official relay service for models) to connect you to 300-plus models in one go. You set it up once and you're done[^1].

> Good to know: an API key is a password-like string of characters that proves "it's you using it this time," so the charges land on your account. The nice thing about the Portal is that you don't have to go collect that key from each company yourself.

## The standard path: pick one step by step in the menu

If you'd rather choose a provider yourself:

```bash
hermes model
```

This opens an interactive menu (it asks you one item at a time — you move with the arrow keys and press Enter to choose). In it, you pick a provider, then paste in the API key that provider gave you[^1].

Officially supported: OpenRouter, OpenAI, Anthropic Claude, Google Gemini, plus "local models" like Ollama and vLLM (models that run on your own computer — more on that later).

**How to confirm it worked**: the menu runs all the way through with no error popping up, and then when you run the line below, you can see the provider you just picked. That means success.

```bash
hermes config show
```

## How to choose among them

Not sure which one to pick? Just find your row in this table:

| Provider                        | Who it's for                                                                      |
| ------------------------------- | --------------------------------------------------------------------------------- |
| **Nous Portal**                 | People who don't want to deal with keys and want lots of models in one shot       |
| **OpenRouter**                  | People who want to switch and compare prices across many models, all with one key |
| **OpenAI / Anthropic / Google** | People who already have an account, or really depend on one company's model       |
| **Ollama / vLLM (local)**       | People who don't want to pay a cent, or whose data can't leave their own computer |

## Advanced: write the setting in directly and skip the menu

If you already know exactly which provider you want, you can skip the menu and get it done with a single command line.

The line below saves your OpenRouter key (replace `sk-or-v1-xxxx` with your own key):

```bash
hermes config set OPENROUTER_API_KEY sk-or-v1-xxxx
```

(An all-caps name like `OPENROUTER_API_KEY` is called an "environment variable" — think of it as "a labeled slot for a setting." Hermes goes to this slot to read your key.)

To pick a specific model to use:

```bash
hermes config set HERMES_MODEL anthropic/claude-opus-4.7
```

You can also switch models on the fly while you're chatting with Hermes, without restarting[^1]:

```text
/model <model-name>
/model provider:model
```

## Connecting a local model (completely free)

A "local model" is an AI that runs on your own computer, without going through anyone else's servers. The upside is that it's free and your data never leaves; the trade-off is that your computer has to be powerful enough.

How to do it: run `hermes model`, choose **Custom endpoint** in the menu (the address you connect to yourself), then enter the address of your local service. For Ollama, it's usually this:

```text
http://localhost:11434/v1
```

**Very important**: when connecting a local model, you must "spell out the context length" in the config file.

(Context is the "context window" — think of it as how much of the conversation the model can remember at once; it has an upper limit.)

If you don't spell it out, Hermes may guess that limit wrong, and then before you've even chatted much, this error string pops up: `context length exceeded` (meaning "you've gone past the context length").

Open the config file `~/.hermes/config.yaml` to edit it.

(This file is called config.yaml, and it's Hermes' settings file. YAML is a settings format that "lays things out by indentation," so the spaces in front of each level can't be off.)

Fill it in like this:

```yaml
model:
  default: your-model-name
  context_length: 131072
```

Here, `context_length` should be **the number your server can actually handle**[^1], not the maximum the model advertises. For Ollama, that number is `num_ctx` in the Modelfile (Ollama's model settings file).

## The money-saving trick: let the "little helpers" run a cheap model

This trick pays off the most, but a lot of people don't know about it.

When Hermes hits a bigger job, it sends out some "little helpers" to split the work and do it in parallel. The official name for these little helpers is subagents.

Here's the key point: these little helpers mostly do grunt work, and they don't need the strongest, most expensive model at all. But by default, they use the same main model you set up — which is like "paying flagship-tier prices to do chores." That's wasteful.

The fix: in the `delegation` section of the config file `~/.hermes/config.yaml`, assign a separate cheap model just for these little helpers[^1]:

```yaml
delegation:
  model: google/gemini-3-flash-preview
  provider: openrouter
```

Now: your own main conversation still runs on the good, high-quality model, while the little helpers doing chores in the background run on the cheap one. Split the two, and the bill comes down.

> 📝 **Real-world numbers still needed**: how much you actually save depends on how you use it.
> If you've compared your bill before and after, [help us fill in the real numbers](https://github.com/hansai-art/hermesagent.download/edit/main/knowledge/config/model-provider.md):
> this kind of "you only know it once you've actually used it" info is exactly what this site is missing most.

## Last step: confirm the setting took effect

First, take a look at the current setup:

```bash
hermes config show
```

**What to look at**: whether the provider and model shown are the ones you just set up. If they are, you're good.

Then actually run Hermes once:

```bash
hermes
```

Type any sentence and ask it something. If it answers you normally, the whole path is working. Congrats.

## Common questions

### How much does this actually cost?

The Hermes Agent program itself is free, open-source software (under the MIT license — a very permissive, free-to-use license). The only thing you pay for is the API cost of the provider you chose[^1]. If you use a local model, you don't pay a cent.

### I entered my key and it still errors out?

The most common reason: the key and the provider don't match. For example, an OpenAI key can't be used on OpenRouter[^1]. For details on how to check, see [How to fix "API key not set"](/en/troubleshoot/api-key-not-set/).

### Want to switch models mid-conversation?

Use `/model <model-name>` to switch; to jump to a different provider, use `/model provider:model`[^1]. Neither one needs a restart.

### Getting context length exceeded?

First use `/compress` to squeeze the current conversation down (it condenses the earlier content to free up space), then use `/usage` to see how much you've used. The long-term real fix is to spell out `context_length` in `config.yaml`[^1]. See [How to fix context length exceeded](/en/troubleshoot/context-length-exceeded/) for details.

## Next steps

- Want to know where your tokens actually go (a token is basically "the unit AI bills you by, roughly a chunk of a word") → [hermes insights: figure out where your tokens go](/config/insights-token-usage/)
- Haven't installed yet → [Install and set up](/install/)
- Moving over from OpenClaw → [Migration guide](/en/migrate/migrate-from-openclaw/)
- Want to see what it can do → [Skills catalog](/skills/catalog/)

[^1]: Nous Research, FAQ: https://hermes-agent.nousresearch.com/docs/reference/faq (accessed 2026-07-23)
