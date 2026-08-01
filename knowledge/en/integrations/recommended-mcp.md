---
title: "Which MCPs Should a Beginner Connect First? A Shortlist"
description: "An MCP is a plug that lets your agent hook up to outside tools. But every one you plug in also hands over a slice of permission. This page sorts them by benefit vs. risk, so you know which to connect first and which to be careful with."
date: 2026-07-23
subcategory: "mcp"
hermes_version: ">=2026.5"
last_verified: 2026-07-04
human_reviewed: false
upstream_refs:
  - "https://hermes-agent.nousresearch.com/docs"
  - "https://modelcontextprotocol.io"
tags:
  - "mcp"
  - "integrations"
status: "published"
---

Two words first, because they come up a lot below.

**agent (a helper AI)**: a program that does things for you. You tell it what you want, and it goes and does it.

**MCP (short for Model Context Protocol, a shared way to plug outside tools into an agent)**: think of it as a standard plug. With it, your agent can hook up to all sorts of outside tools. Hermes can connect to any MCP[^1], so its abilities can grow almost without limit.

That sounds great. But there is one thing worth thinking through before you start plugging things in.

**Every MCP you connect hands over a slice of permission.** For example: connect a "file MCP" and your agent can read and change your files; connect a "GitHub MCP" and your agent can act on your projects on GitHub. This is not meant to scare you. It is just a reminder: before you connect, know what you are handing over.

So the list below is not sorted by "what's most popular." It is sorted by "how big is the benefit, and how high is the risk."

## Connect these first

### Filesystem MCP

`@modelcontextprotocol/server-filesystem`

This lets your agent read and write **the folders you point it at**. It is usually the first one worth connecting, because most useful work needs it: reading your project's code, saving files for you, tidying up data.

**The key to keeping the risk down is one sentence**: it can only touch the folders you spell out in the settings. **Do not, for convenience, point it at the very top of your home directory** (your home directory is the main entry point to all the stuff on your computer that belongs to you). Point it at one specific project folder instead. The smaller the range, the safer.

- Who made it: a trusted third party (this is the official sample version put out by MCP itself)
- Risk level: medium. The bigger the folder you open up, the higher the risk

### Git MCP

`mcp-server-git`

This runs git operations on a project you choose (git is a tool that records every change you make to your code, like a "save-history notebook"). It starts up with the `uvx` command, so you do not have to install anything separately first.

Compared with the GitHub MCP below, this one is much safer: it only touches projects **on your own computer**, never your account online. **If you just want your agent to show you "what changed this time" (that's a diff), or to write a change record for you (that's a commit), this one is enough.**

- Who made it: a trusted third party
- Risk level: medium. It does change the git save-history on your computer

### GitHub MCP

`@modelcontextprotocol/server-github`

This can look up issues (tickets that track problems or tasks), search code, and act on your projects on GitHub.

**Be extra careful with this one.** It acts using your GitHub token (a token is a "digital key" that lets whoever holds it act as you). However many doors that key can open, your agent can do that much. So here is the advice: go and create a separate key with **as little permission as possible** for it to use. Do not hand over your everyday "opens everything" master key.

- Who made it: a trusted third party
- Risk level: medium-high, because it touches the permissions on your online account

## Connect these only if you have a specific need

### Chrome DevTools MCP

`chrome-devtools-mcp`

This lets your agent control your browser.

It is **especially useful for WSL2 users** (WSL2 is a setup that lets you run Linux inside Windows). If you try to control Chrome on Windows directly from inside WSL2, it usually does not go smoothly. The official recommendation is to use this MCP as a "bridge" to connect across. See the [WSL2 guide](/install/wsl2/) for how.

### Others

There are also ones like Linear MCP (helps you manage project progress) and n8n MCP (chains a series of actions together automatically). These suit people who are **already using those tools**. If you are not using them, it is fine to skip for now.

## Before connecting any MCP, ask yourself three questions

**Question one: who made this MCP?** If the name starts with `@modelcontextprotocol/*`, it was put out by MCP itself, so it is relatively safe. If it was made by someone you can't identify, you are letting a piece of code you don't know run on your computer, so be more careful.

**Question two: what permission does it want from me?** Which folders will it touch? Does it need an API token (a digital key that acts as you)? Does it need internet access? Find out before you connect.

**Question three: can I give it less permission?** If you can give it a dedicated key, don't give it a master key. If you can open just one folder, don't open your whole home directory. If you can give "read-only" (can look but not change), don't give "read and write."

## Honestly, this section is still thin

> 📝 **Not written yet**: the **actual setup steps** for each MCP above — exactly how to fill in the settings file, how to confirm it really connected once you're done, and what the common errors look like. We don't have any of this yet. That's also why the `integrations/` category still has fewer than three articles.
>
> Have you connected any of the ones above? [Write a piece to share, or just tell us](https://github.com/hansai-art/hermesagent.download/issues/new?template=02-article-proposal.yml):
> one complete setup guide would change this whole category.

## What to look at next

- Want to know what Hermes can do out of the box → [full skills catalog](/skills/catalog/)
- Want to connect a browser from WSL2 → [full WSL2 guide](/install/wsl2/)
- Want to help write an MCP setup guide → [contributor guide](/contribute/)

[^1]: Nous Research, Docs: https://hermes-agent.nousresearch.com/docs (accessed 2026-07-23)
