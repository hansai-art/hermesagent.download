---
title: "What Is Hermes Agent"
description: "Get Hermes Agent in five minutes: what it is, how it differs from other AI assistants — an agent that teaches itself new skills, runs on 20+ platforms, and works without you sitting at your laptop."
date: 2026-07-23
subcategory: "basics"
hermes_version: ">=0.14"
last_verified: 2026-07-23
translationKey: what-is-hermes-agent
human_reviewed: false
upstream_refs:
  - "https://hermes-agent.nousresearch.com/docs"
  - "https://github.com/NousResearch/hermes-agent"
tags:
  - "basics"
  - "overview"
  - "concepts"
status: "published"
---

Let's start with a scene you've probably lived through.

You spend an hour with an AI assistant. You explain how your project is laid out, where your passwords live, how you like your code written. Then you close the window — and it forgets all of it. Next time you open it, you have to explain everything again. Every conversation feels like a first meeting.

That is exactly the problem Hermes Agent sets out to fix.

Hermes Agent is an open-source AI agent built by a company called Nous Research. Two quick definitions first. "Open source" means the code is public, so anyone can use it for free. An "agent" is best pictured as an AI assistant that actually does things for you: you give it a task, and instead of just replying with text, it goes off and gets the work done.

The team describes it as "the only agent with a built-in learning loop." That phrase sounds fancy, but it boils down to one idea: it gets smarter the more you use it. It picks up new abilities while doing real work, sharpens those abilities each time it uses them, and — across many separate conversations — slowly builds up a picture of who you are and how you like to work[^1].

## Three things that make it different

### 1. It teaches itself new skills

With most agents, what they can do is hard-coded by their engineers ahead of time. They never grow new abilities on their own.

Hermes is different. It has something called a "skill." Think of a skill as a set of steps it wrote down for itself for getting a particular job done.

Here's an example. While working on one of your projects, it figures out the right order is "run lint first, then run build." (A quick note: lint is a tool that checks your code for mistakes, and build is the step that packages your code into something you can actually run.) Once it sees that this approach works, it saves the whole routine as a skill. The next time a similar task comes up, it pulls that skill back out and uses it — and keeps refining it as it goes[^2].

The team calls this a "closed learning loop." Really it's just a circle that keeps going around: do work and gain experience, save that experience as a skill, reuse the skill next time, improve it while using it, and so do the job even better the time after that.

What this means for you: you don't have to keep teaching it the same thing over and over. Teach it once, and it remembers how.

### 2. It isn't tied to your laptop

Most AI tools can only run on the one computer sitting in front of you.

Hermes can run in six different places (the team calls these "execution environments," which simply means where the agent actually runs): the terminal on your own computer, Docker, a remote machine you reach over SSH, Daytona, Singularity, and Modal's serverless deployment[^3]. A few more plain-language notes: the terminal is that black text window where you type commands; Docker is a technology that packages a program together with everything it needs so it can run anywhere; SSH is a secure way to connect to a remote computer; and the key thing about "serverless deployment" is that it automatically goes to sleep when idle, so it doesn't waste resources.

The fun part is how you actually use it. You can have it run on a remote cloud machine, and then, while you're out and about, message it a single line from Telegram on your phone. It finishes the job up in the cloud and reports back. You never have to sit at your laptop.

Right now it supports 20-plus messaging platforms: Telegram, Discord, Slack, WhatsApp, Signal, Matrix, Email, Microsoft Teams, Google Chat, and more[^4]. In other words, whatever chat app you already use, you can most likely use it to direct Hermes.

### 3. Its memory doesn't vanish when you start a new conversation

First, one word to define: "session." A session is roughly "one stretch of conversation." Many AIs, the moment you start a fresh session, forget everything said before.

Hermes's memory keeps building up. It comes in two parts. One part is an always-on "core memory," which holds the things you reach for most: your preferences, your project's conventions. The other part is a "full-text search" — picture a search feature that can comb through every past conversation the two of you have had. And what it pulls back is **the exact original wording from back then, not an AI-shortened summary**[^6].

This detail matters. It means the preference you mentioned in passing three months ago, where you told it your passwords live, whatever quirky rules your project has — next time, it can dig all of that back up, word for word, without it getting garbled along the way. For a deeper look, see [Memory System](/en/concepts/memory-system/).

## A few terms you'll run into

The table below explains, in one line each, the words that show up often in the docs — handy to check back on later.

| Term | What it is |
|---|---|
| skill | A routine the agent builds for itself and can reuse later |
| memory | A knowledge base that keeps accumulating across many conversations |
| toolset | 60-plus built-in tools you can freely mix and match |
| gateway | A single entry point that plugs all the messaging platforms in |
| subagent | An independent little agent it sends off to work in parallel |
| MCP | A standard connector that lets you plug in any MCP server to add more tools |

## What it costs

The Hermes Agent program itself is a **free, open-source project under the MIT License**[^5]. (You can think of the MIT License as a very relaxed open-source license — basically, use it for free and change it however you like.)

So where does the money go? It goes to the "model provider." Here's the idea: Hermes doesn't think on its own. Behind the scenes it plugs into an AI model to act as its brain, and the company supplying that brain is the model provider, which usually charges by how much you use.

Hermes supports Nous Portal, OpenRouter, OpenAI, or any compatible endpoint (an endpoint is just "the connection address for a model service"). So you can pick expensive or cheap models as you like — you can even run a local model on your own computer with Ollama, which costs nothing at all.

## Next steps

- Want to just install it and go → [Install and deploy](/en/install/)
- Installed it but not sure which model to pick → [Model providers and API key setup](/en/config/model-provider/)
- Dig into how memory works → [Memory System](/en/concepts/memory-system/)
- Dig into how skills grow → [Skills System](/en/concepts/skills-system/)
- How exactly it differs from OpenClaw (the lobster) → [A point-by-point check of both projects' official docs, plus a look at the "lobster killer" nickname](/concepts/龍蝦殺手/)
- Migrating over from OpenClaw → [Migration guide](/en/migrate/migrate-from-openclaw/)

[^1]: Nous Research, Hermes Agent official docs: https://hermes-agent.nousresearch.com/docs (accessed 2026-07-23)
[^2]: Ibid., Skills section: "Procedural memory the agent creates and reuses"
[^3]: Ibid., deployment options section (local / Docker / SSH / Daytona / Singularity / Modal)
[^4]: Ibid., Gateways section: "20+ platforms from one gateway"
[^5]: NousResearch/hermes-agent, MIT License: https://github.com/NousResearch/hermes-agent
[^6]: Nous Research, Memory: session_search returns the raw database text, with no LLM summarization: https://hermes-agent.nousresearch.com/docs/user-guide/features/memory
