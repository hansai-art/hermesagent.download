---
title: "Connecting Your First MCP: From Configuration to Verification"
description: "Walk through the full flow with a filesystem MCP: edit config.yaml, reload, and confirm the tools actually show up. Covers the all-important permission scoping and the common 'tools didn't appear' troubleshooting."
date: 2026-07-25
subcategory: "mcp"
hermes_version: ">=2026.5"
last_verified: 2026-07-25
human_reviewed: false
upstream_refs:
  - "https://hermes-agent.nousresearch.com/docs/user-guide/features/mcp"
  - "https://hermes-agent.nousresearch.com/docs/guides/use-mcp-with-hermes"
tags:
  - "mcp"
  - "integrations"
status: "published"
---

MCP lets an agent connect to external tools, but the first time you set one up it's easy to get stuck in one place: **you finish editing the config and the tools don't show up**, and you have no idea whether the config is wrong or it simply didn't take effect.

This article walks through the full flow with a "filesystem MCP," because it's the simplest one, and once you've gotten it working once, every other MCP follows the same pattern.

## First, confirm MCP support is installed

A standard install already bundles MCP[^1]. If you want to confirm this or install it manually:

```bash
cd ~/.hermes/hermes-agent
uv pip install -e ".[mcp]"
```

## Two ways to connect: local vs. remote

MCP servers are all configured under `mcp_servers` in `~/.hermes/config.yaml`[^2], and come in two kinds:

- **Local (stdio)**: runs a subprocess on your own machine, launched with `command` + `args`
- **Remote (HTTP)**: connects to an already-hosted service, using `url`

Start with a local one for your first — it's the easiest to understand.

## Configuring the filesystem MCP

Edit `~/.hermes/config.yaml` and add:

```yaml
mcp_servers:
  project_fs:
    command: "npx"
    args: ["-y", "@modelcontextprotocol/server-filesystem", "/home/user/my-project"]
```

`project_fs` is a name you choose yourself. That last path is **exactly the directory you're allowing the agent to read from and write to**[^3]:

⚠️ **This is the single most important line in the whole article**: don't take the easy route and point it at your home directory root (`/home/user` or `~`). Point it at the **specific project folder** you're actually working in. This path determines which of your files the agent can touch — opening it too wide is equivalent to handing over every file on your machine.

## Reload without restarting

After editing the config, just run this directly in the conversation:

```text
/reload-mcp
```

This reloads the MCP configuration without having to restart the entire Hermes process[^2].

## Confirm it actually connected

Don't skip this step: most "my MCP isn't responding" confusion is really a case of it never having connected at all, without you realizing it.

**Method 1: Ask it**

```text
Tell me which MCP-backed tools are available right now
```

**Success criterion**: it lists the tools from the server you just configured. The filesystem MCP's tools look like `mcp_project_fs_read_file`: the naming rule is `mcp_<server name>_<tool name>`[^2]. If you can see tools with that prefix, it's connected.

**Method 2: Test the connection**

```bash
hermes mcp test project_fs
```

`hermes mcp test <server name>` directly tests whether that server can be reached[^1].

## Tools didn't appear? Check in this order

This is the most common situation the first time you set up an MCP. Here's the official list of causes, mapped out[^1]:

| Symptom | Usually because |
|---|---|
| No tools at all | `enabled: false` wasn't removed, the runtime environment is missing, or the auth header is wrong |
| A few tools missing | Filtered out by `include`, blocked by `exclude`, or the tool category is turned off |
| Fewer tools than expected | Each server has its own policy filtering — this is normal behavior |

First confirm `/reload-mcp` has actually run, then use `hermes mcp test` to check the connection, and only then start suspecting the config contents.

## Scoping permissions: only enable the tools you need

Once the filesystem MCP is working, **permission scoping becomes important** when you connect MCPs like GitHub or databases. You can allow only specific tools:

```yaml
mcp_servers:
  github:
    command: "npx"
    args: ["-y", "@modelcontextprotocol/server-github"]
    env:
      GITHUB_PERSONAL_ACCESS_TOKEN: "***"
    tools:
      include: [list_issues, create_issue, search_code]
```

`tools.include` is an allowlist: only these are enabled, everything else is denied[^2]. This is safer than enabling everything and then blocking tools one by one.

An easily overlooked security design: **a stdio server only gets the environment variables you explicitly list under `env`; it does not inherit your entire shell environment**[^2]. So API keys must be given explicitly in `env` — it won't go read them from your shell on its own.

## Remote MCP (advanced)

To connect to an already-hosted service, use `url`:

```yaml
mcp_servers:
  internal_api:
    url: "https://mcp.internal.example.com/mcp"
    headers:
      Authorization: "Bearer ***"
```

For services that require OAuth (such as Linear), use `auth: oauth`[^2].

## Installing from the official catalog

Besides configuring manually, you can also use the official catalog:

```bash
hermes mcp catalog          # see what's available
hermes mcp install <name>   # install one
```

⚠️ But be aware: when installing, Hermes runs the manifest's bootstrap commands **as well as the MCP server's own code**. Although the project reviews every entry in the catalog via PR, it's still recommended that you **read the manifest before installing**[^2].

## Frequently asked questions

### Need to control a Windows browser from inside WSL2?

Use chrome-devtools-mcp as a bridge — see the [WSL2 guide](/install/wsl2/).

### Do I really have to run /reload-mcp after changing the config?

Yes. Without a reload, the current conversation is still reading the old config.

### How do I know whether an npm package is a trustworthy MCP?

`@modelcontextprotocol/*` are the official reference implementations and are relatively trustworthy. A third-party server of unknown origin is equivalent to letting unfamiliar code run in your environment: see the trust tiers in [Recommended MCPs](/en/integrations/recommended-mcp/).

## Next steps

- Which MCPs are worth connecting → [MCP servers worth connecting first](/en/integrations/recommended-mcp/)
- See the official built-in capabilities → [Full skills catalog](/skills/catalog/)
- Understand the difference between skills and MCP → [The skills system](/concepts/技能系統/)

[^1]: Nous Research, Use MCP with Hermes: https://hermes-agent.nousresearch.com/docs/guides/use-mcp-with-hermes (accessed 2026-07-25)
[^2]: Nous Research, MCP: https://hermes-agent.nousresearch.com/docs/user-guide/features/mcp (accessed 2026-07-25)
[^3]: Ibid.; the last argument in the filesystem MCP's args is the directory path allowed for access
