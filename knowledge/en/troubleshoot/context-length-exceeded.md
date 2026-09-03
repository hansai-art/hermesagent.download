---
title: 'What to do when you see context length exceeded'
description: "Your chat suddenly froze with a context length exceeded message? Rescue the current conversation with one command, then fix your config file so it stops happening. People running local models hit this a lot, and the reason isn't what you'd guess."
date: 2026-07-23
subcategory: 'runtime'
hermes_version: '>=2026.5'
last_verified: 2026-07-04
human_reviewed: false
upstream_refs:
  - 'https://hermes-agent.nousresearch.com/docs/reference/faq'
tags:
  - 'runtime'
  - 'troubleshoot'
status: 'published'
---

Picture yourself halfway through a task. Your agent (the AI assistant that does things for you) has read a few files, run some small tools for you, and you've gone back and forth for twenty-odd rounds. Then it suddenly says:

```text
context length exceeded
```

What this line means is: "This conversation has too much stuffed into it. It's more than I can hold in mind at once."

So the chat freezes. And you don't want to start over from scratch. Don't worry, let's walk through it step by step. Hermes includes both `/compress` and `/usage` as built-in conversation commands for handling and inspecting this situation[^2].

First, one piece of vocabulary. A **token** (think of it as a "chunk of text") is the unit an AI uses to measure how long a piece of text is. Roughly a few letters, or one word, makes one token. An AI can only take in so many tokens in a single conversation. That ceiling is called the **context length** (the conversation's capacity). The longer you chat, and the more you paste in, the closer you get to that ceiling. Once it's full, you see the error above.

## Step 1: Put out the fire — compress the current conversation

In the chat box, just type this command and send it:

```text
/compress
```

A "command" is a special instruction you type to the agent. It usually starts with a slash (`/`).

What does this do? It takes everything you've talked about so far and boils it down into a shorter summary, freeing up room so the conversation can keep going[^1]. Think of it like a messy pile of paper on your desk: you jot the key points onto one sticky note and put the rest away.

**How you know it worked**: you can keep typing and chatting, and the context error stops popping up. That's success.

One thing to keep in mind: the summary keeps the big picture, but some small details may get squeezed out. If the agent later seems to have "forgotten" something, just tell it again. It isn't broken.

## Step 2: See how much you've actually used

Type this command and send it:

```text
/usage
```

It tells you how many tokens the current conversation has used up[^1].

Once you see the number, you can judge: are you truly close to full, or actually still far from the ceiling?

If you're still far from the ceiling but getting the error anyway, then it's probably not a "chatted too much" problem. It's the **setting isn't filled in right** problem we'll cover next.

## Step 3: Edit the config file to fix it at the root

This step matters especially for people **running a local model, or hosting their own server**.

Let me explain. A "local model" means the AI isn't running on someone else's cloud, but on your own computer or a server you set up yourself. A "self-hosted endpoint" — the endpoint (the connection point, the network address your program goes to for answers) — means something similar: you've set up your own place for Hermes to send its questions.

So where's the problem? Hermes tries to guess "how many tokens your model can take at once." But when it connects to a self-hosted service, it often guesses wrong. It might think your model only has 8K (eight thousand tokens) of capacity, when it actually has 128K (a hundred twenty-eight thousand). So it gets nervous too early and throws the error too soon.

The fix: tell it the correct number directly, instead of letting it guess.

Open this file in a text editor. Hermes's official Configuration reference identifies `~/.hermes/config.yaml` as the place for non-secret settings[^3]:

```text
~/.hermes/config.yaml
```

Quick note: `~` stands for your personal user folder. The dot at the start of `.hermes` means it's a hidden folder. `.yaml` is a config file format written as "name: value", one per line, using indentation (the spaces at the front of each line) to show structure — so don't mess up the indentation.

Put these lines in it:

```yaml
model:
  default: your-model-name
  context_length: 131072
```

Here, `context_length` should be **the number your server can actually handle**, not the model's "theoretical maximum"[^1].

- Too big: it will just fail when you really do go over.
- Too small: you're wasting capacity for nothing.

**So how do I know what to put?** Look at the capacity your inference service (the program that actually runs the AI model, like Ollama, vLLM, and so on) was set to when it started up. With Ollama, for example, that number lives in the model's Modelfile (Ollama's config file that describes a model), and it's called `num_ctx`.

> 📝 **To be added**: the exact commands for checking the context limit on each local inference service — we haven't written this up yet.
> If you've run Ollama / vLLM / LM Studio,
> [help us fill in this part](https://github.com/hansai-art/hermesagent.download/edit/main/knowledge/troubleshoot/context-length-exceeded.md).

## A long-term habit: don't let conversations run on forever

`/compress` is emergency first aid, not something to lean on every day. To hit the wall less often, build a few habits:

**Finish one task, then start a new conversation.** You might worry: if I start fresh, doesn't everything from before get forgotten? It doesn't. Hermes has a memory system that saves important information across conversations. So starting a new conversation isn't starting from zero — it still remembers who you are and what your project looks like. On the flip side, staying in the same conversation forever means dragging a huge pile of already-finished, no-longer-needed details along with you, getting heavier and heavier.

**Don't paste in whole large files.** Letting the agent use its tools to read just the small part it needs is far more efficient than you pasting in the entire file.

**Watch what the tools spit out.** Some commands dump a wall of content the moment they run, like `ls -R` (which lists everything under a folder, all its subfolders layer by layer) or a full log (a record of what happened while a program ran). These eat up a load of tokens in one go, and most of that content is useless once you've read it.

## Common questions

### Why does it sometimes error right at the start of a conversation?

Usually because the `context_length` you set is bigger than what your server can actually handle, so the very first request goes over. Try setting the value lower.

### Will switching to a model with bigger capacity solve it?

It buys you time, but it doesn't fix the root cause. Chat long enough and you'll still hit the wall eventually. Pairing `/compress` with starting a new conversation when it makes sense is the stable approach.

### After compressing, the agent seems to have forgotten things. What do I do?

That's normal — a summary always sacrifices some detail. Just say the key information again. Anything truly important that you want it to remember for good should be written into the memory system, not left sitting in this one conversation.

## Next steps

- Set up your model and local endpoint → [Model provider and API key setup](/en/config/model-provider/)
- Hit a different error → [Troubleshooting overview](/en/troubleshoot/overview/)

[^1]: Nous Research, FAQ: https://hermes-agent.nousresearch.com/docs/reference/faq (accessed 2026-07-23)

[^2]: Ibid., `/compress` compresses a conversation and `/usage` reports its token usage.

[^3]: Nous Research, Configuration: https://hermes-agent.nousresearch.com/docs/user-guide/configuration (accessed 2026-08-30).
