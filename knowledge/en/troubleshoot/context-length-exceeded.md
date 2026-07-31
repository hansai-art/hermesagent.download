---
title: "How to Fix context length exceeded"
description: "Rescue the current conversation with /compress first, then fix it for good in your config. Local-model users hit this especially often, and the cause is not what you'd expect."
date: 2026-07-23
subcategory: "runtime"
hermes_version: ">=2026.5"
last_verified: 2026-07-04
human_reviewed: false
upstream_refs:
  - "https://hermes-agent.nousresearch.com/docs/reference/faq"
tags:
  - "runtime"
  - "troubleshoot"
status: "published"
---

You're halfway through something: the agent has read a few files, run a few tools, gone back and forth for twenty rounds, and then it suddenly says:

```
context length exceeded
```

The conversation is stuck, and you don't want to start over from scratch.

## First, put out the fire: compress the current conversation

Type this directly into the conversation:

```
/compress
```

This summarizes the earlier conversation history into a shorter version, freeing up room to continue[^1].

**Success criterion**: you can keep the conversation going and no longer get the context error. The summary preserves the overall context, but details may be compressed away. If you later notice it has "forgotten" some detail, just tell it again.

## Check how much you're actually using

```
/usage
```

This shows your current token usage[^1]. It tells you whether you're nearly full or still far from the limit (and if you're far from the limit yet still getting an error, it's most likely the config problem below).

## Fix it for good: set the context length explicitly in your config

This step is **especially important for users on local models or self-hosted endpoints**.

Hermes tries to detect a model's context limit, but it often gets it wrong against self-hosted services: it may think your model only has 8K when it actually has 128K, so it errors out prematurely.

Edit `~/.hermes/config.yaml`:

```yaml
model:
  default: your-model-name
  context_length: 131072
```

`context_length` should be set to **the number your server can actually support**, not the model's theoretical maximum[^1]. Set it too high and it will fail outright when you genuinely exceed it; set it too low and you waste capacity.

**How to know what to put**: check the context length configured when your inference service (Ollama, vLLM, etc.) started up. For Ollama, that's `num_ctx` in the model's Modelfile.

> 📝 **To be added**: we haven't yet compiled the specific commands for checking the context limit on each local inference service.
> If you've run Ollama / vLLM / LM Studio,
> [help us fill in this section](https://github.com/hansai-art/hermesagent.download/edit/main/knowledge/troubleshoot/context-length-exceeded.md).

## A long-term habit: don't let conversations grow without limit

`/compress` is first aid, not a permanent fix. A few ways to reduce how often you hit the wall:

**Start a new conversation once you finish a task**. Hermes's memory system carries important information across sessions, so a new conversation isn't starting from zero: it remembers who you are and what your project looks like. Continuously piling onto the same session instead means you keep dragging along a mountain of already-processed details.

**Don't dump entire large files in**. Letting the agent use tools to read specific sections is more efficient than pasting in a whole file.

**Watch tool output**. A single `ls -R` or a full log can eat up a huge number of tokens, and most of that content has no value once it's been used.

## Frequently asked questions

### Why do I sometimes get the error right at the start of a conversation?

Most likely your configured `context_length` is larger than the server's actual capacity, so the very first request exceeds it. Try lowering the config value.

### Will switching to a model with a larger context solve this?

It buys time, but it doesn't fix the root cause: a long enough conversation will eventually hit the wall. Combining `/compress` with starting new conversations at the right moments is the stable approach.

### What if the agent forgets things after compression?

That's normal; a summary inevitably loses detail. Just restate the key information; anything that truly matters should be written into the memory system rather than left sitting in the conversation.

## Next steps

- Configure the model and a local endpoint → [Model providers and API key setup](/en/config/model-provider/)
- Hitting a different error → [Troubleshooting overview](/en/troubleshoot/overview/)

[^1]: Nous Research, FAQ: https://hermes-agent.nousresearch.com/docs/reference/faq (accessed 2026-07-23)
