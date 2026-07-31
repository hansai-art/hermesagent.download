---
title: "MCP Servers Worth Connecting First"
description: "MCP lets an agent plug into external tools, but every server you connect is one more grant of permissions. This piece ranks them by benefit vs. risk and explains the trust level of each."
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

MCP (Model Context Protocol) is the standard interface for connecting an agent to external tools. Hermes can connect to any MCP server[^1], which means its capabilities can expand without limit.

But there's one thing worth thinking through first: **every MCP you connect hands over a slice of your permissions**. A filesystem MCP can read and write your files; a GitHub MCP can operate on your repos. This isn't meant to scare you, just to make the point: before you connect one, it's worth knowing exactly what you're authorizing.

That's why the list below is ordered by benefit vs. risk, not by popularity.

## Connect These First

### Filesystem MCP

`@modelcontextprotocol/server-filesystem`

Lets the agent read and write **the directories you specify**. This is usually the first one worth connecting, because most useful work needs it: reading a project's source, writing files, organizing data.

**The key to controlling risk**: it can only access the directories you explicitly name in the configuration. **Don't take the shortcut of pointing it at the root of your home directory**, point it at a specific project folder instead.

- Trust level: trusted third party (official MCP reference implementation)
- Risk: moderate, depending on which directories you open up

### Git MCP

`mcp-server-git`

Performs git operations on a specified repo, launched with `uvx`, no separate installation required.

Compared with the GitHub MCP, this one only touches local repos and never touches your remote account, so it's far lower risk. **If all you want is to have the agent help review a diff or write a commit, this is enough.**

- Trust level: trusted third party
- Risk: moderate, since it modifies your local git history

### GitHub MCP

`@modelcontextprotocol/server-github`

Looks up issues, searches code, and operates on repos.

**Be careful with this one**: it uses your GitHub token, and its permission scope is exactly the scope of that token. We recommend creating a separate **least-privilege token** rather than using your everyday do-everything one.

- Trust level: trusted third party
- Risk: moderate to high, since it involves remote account permissions

## Special-Purpose

### Chrome DevTools MCP

`chrome-devtools-mcp`

Lets the agent control a browser. This is **especially important for WSL2 users**: controlling Chrome running on Windows directly from WSL2 does not go smoothly, and the official recommendation is precisely to go through this MCP bridge. See the [WSL2 guide](/install/wsl2/) for details.

### Others

Linear MCP (project management), n8n MCP (automation workflows), and the like are a good fit for people already using those tools.

## Three Questions to Ask Before Connecting an MCP

**One: who wrote this server?** Official MCP reference implementations (`@modelcontextprotocol/*`) are relatively trustworthy; a third-party server of unknown origin means letting unfamiliar code run in your environment.

**Two: what permissions does it need?** File paths, API tokens, network access: figure these out before you connect.

**Three: can you grant it less?** A dedicated token rather than an all-purpose one, a specific directory rather than your home directory, read-only rather than read-write.

## This Section Is Still Very Thin

> 📝 **To be added**: the **actual setup steps** for each MCP above (how to write the config, how to confirm it's connected, common errors).
> We don't have any of that yet. It's also the reason the `integrations/` category has fewer than three articles.
>
> Which one have you connected? [Write a piece or tell us about it](https://github.com/hansai-art/hermesagent.download/issues/new?template=02-article-proposal.yml):
> a complete setup guide would directly change what this category looks like.

## Next Steps

- See the official built-in capabilities → [full skills catalog](/skills/catalog/)
- Connect a browser from WSL2 → [complete WSL2 guide](/install/wsl2/)
- Want to contribute an MCP setup guide → [contribution guide](/contribute/)

[^1]: Nous Research, Docs: https://hermes-agent.nousresearch.com/docs (accessed 2026-07-23)
