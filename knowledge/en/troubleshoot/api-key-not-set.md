---
title: "Seeing \"API key not set\" or being told your key is invalid? Let's fix it step by step"
description: "The most common cause isn't a typo in your key — it's that the key is paired with the wrong provider. Walk through three calm steps, including the easy-to-miss conflicting settings in ~/.hermes/.env."
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

First, one word to know. This page keeps mentioning your **API key** (I'll just call it your "key"): it's a password-like string of characters that lets Hermes use the account you opened with some AI company. Another word is **provider** (the company that supplies the AI models — for example OpenAI, OpenRouter, or Anthropic). You first sign up for a key at one of these providers, then you hand that key to Hermes.

Okay, back to the problem. You're sure the key is right: you just copy-pasted it from the provider's website, character for character, nothing missing. But Hermes still tells you:

```text
API key not set
```

Or, even more annoying: you clearly filled the key in, and it still comes back saying "authentication failed."

Take a breath. **The most common cause isn't a typo in your key — it's that the key is paired with the wrong provider.** Here's an analogy: each provider's key is like a bank card from a different bank. They look alike, but an OpenAI card won't work in an OpenRouter machine, and vice versa[^1]. Because the keys look so similar, it's easy to paste one into the wrong box.

Let's take the three steps below one at a time.

## Step 1: See what's actually set right now

In your terminal (the window where you type commands), enter:

```bash
hermes config show
```

This command lists out Hermes's current settings for you[^1]. You only need to watch two things:

1. **Is the provider the one you think it is?** If you had OpenRouter in mind but this shows OpenAI, then of course the key won't match — you'd be feeding an OpenRouter key to OpenAI, and it won't recognize it.
2. **Did the key actually get saved?** Sometimes you think you filled it in, but it never really saved.

> 📝 **This section is still missing a real screenshot**: what the fields printed by `hermes config show` look like, and whether the key gets hidden behind asterisks —
> we don't have an actual captured screen on hand.
> [Help us fill this in](https://github.com/hansai-art/hermesagent.download/edit/main/knowledge/troubleshoot/api-key-not-set.md).

## Step 2: Just set it up again

The method least likely to go wrong is the "interactive menu" (the kind of screen that asks you questions and gives you choices step by step — you just follow along and pick):

```bash
hermes model
```

This menu walks you through picking the provider first, then entering the key[^1]. Because it pairs the provider and the key together in one go, they almost never end up mismatched. That's much safer than typing everything in by hand.

If you already know exactly which provider you want, you can also set it in a single command. For example:

```bash
hermes config set OPENROUTER_API_KEY sk-or-v1-xxxx
```

**Here's a handy trick: look at the first few characters of the key (the prefix).** The start of a key usually tells you which provider it belongs to:

| Starts like this | This provider |
|---|---|
| `sk-or-v1-` | OpenRouter |
| `sk-` | OpenAI |
| `sk-ant-` | Anthropic |

If the start of your key doesn't line up with the provider you set (say, you set OpenAI but the key starts with `sk-or-v1-`), then it's mismatched.

## Step 3: Check the .env file for conflicting old settings

This step is the easiest to overlook, but it's often the real culprit.

When Hermes starts up, it reads a file called `~/.hermes/.env` (`.env` is a plain-text file with settings written one per line; `~` means your personal home folder). If an old, mismatched key is hiding in this file, it can quietly override the one you just set[^1].

Open it up and see what's inside:

```bash
cat ~/.hermes/.env
```

**What you'll see**: lines in the format `KEY=value` (these are called "environment variables" — think of them as little sticky notes for the program, each one saying "this setting = this value"). If there's an old key in there that you no longer use (for example, one left over from before you switched providers), delete those whole lines, or put a `#` at the start of the line to comment it out (which tells the program to ignore that line for now).

## How to confirm it's fixed

Open Hermes:

```bash
hermes
```

Once inside, just ask it anything. **As long as it replies normally and no longer throws a key-related error, you're done.**

If it still fails, don't be discouraged. This time the error message is usually more specific (for example "insufficient quota" or "model name not found"), so just follow the new message. At the very least, you've gotten past the "key isn't set" hurdle.

## Common questions

### My settings vanished after I updated Hermes?

First run `hermes config show` to see what's left, then just set it up again with `hermes model`[^1].

### I don't want to sign up with each provider one by one — is there an easier way?

Yes. The official Portal (an entry service) handles it all at once, so you don't have to go申請 a key at each provider yourself:

```bash
hermes setup --portal
```

### I want to switch to a different AI model?

```bash
hermes config set HERMES_MODEL anthropic/claude-opus-4.7
```

Or switch on the spot while you're chatting with Hermes by typing: `/model <model-name>`. If you want a model from a different provider, write it in the form `/model provider:model`[^1].

### I don't want to spend any money at all — is that possible?

Yes, just use a "local model" — meaning you let the AI run directly on your own computer, without going through any paid provider. To do it, run `hermes model`, choose Custom endpoint, and fill in the address for Ollama (Ollama is a free piece of software that runs AI models on your own computer). Local models are completely free[^1]. For the setup details, see [Model providers and API key setup](/en/config/model-provider/).

## Next steps

- Want to know how to choose a provider and save money → [Model providers and API key setup](/en/config/model-provider/)
- Ran into a different error → [Troubleshooting overview](/en/troubleshoot/overview/)

[^1]: Nous Research, FAQ: https://hermes-agent.nousresearch.com/docs/reference/faq (accessed 2026-07-23)