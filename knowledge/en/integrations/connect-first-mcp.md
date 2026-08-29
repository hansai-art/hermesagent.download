---
title: 'Connect Your First MCP: Set It Up Step by Step, Then See It Actually Work'
description: "A hands-on walkthrough using the simplest option, the filesystem MCP: open one config file, change a few lines, reload, and confirm the tools really show up. Plus the single most important habit — only turn on the permissions you need — and how to check step by step when a tool doesn't appear."
date: 2026-07-25
subcategory: 'mcp'
hermes_version: '>=2026.5'
last_verified: 2026-07-25
human_reviewed: false
upstream_refs:
  - 'https://hermes-agent.nousresearch.com/docs/user-guide/features/mcp'
  - 'https://hermes-agent.nousresearch.com/docs/guides/use-mcp-with-hermes'
tags:
  - 'mcp'
  - 'integrations'
status: 'published'
---

First, what this page is about.

MCP is short for "Model Context Protocol." Think of it as a power outlet for plugging in extra tools. Through it, your agent (the agent is the AI assistant that does tasks for you) can connect to outside tools — like reading and writing files on your computer, working with GitHub, or querying a database.[^4]

The first time you set up MCP, most people get stuck at the same spot: you finish editing the config, but the tools don't appear. And then you're confused — did I type the config wrong, or did it just not take effect?

This page walks you all the way through, using the filesystem MCP (the tool that lets your agent read and write files in a folder you choose). We picked it because it's the simplest. And here's the good news: once you get this one working, connecting any other MCP later follows the exact same steps. You won't have to relearn it.

Just follow along. It's not hard.

## Step 1: Confirm the MCP feature is installed

If you installed the standard way, the MCP feature is actually already included[^1] — usually you don't need to install anything extra.

If you want to double-check, or install it yourself, open your terminal (the terminal is that window where you type commands) and enter:

```bash
cd ~/.hermes/hermes-agent
uv pip install -e ".[mcp]"
```

The first line, `cd`, means "switch into a folder" — here it switches to where Hermes is installed. The second line is what actually installs the MCP feature.

## Two ways to connect: get familiar, but we'll only use the first

MCP servers (a server here is just the little program that provides the tools) all go in the same config file: `~/.hermes/config.yaml`, under a section called `mcp_servers`[^2].

There are two ways to connect. Just get a rough idea of them for now:

- **Local (stdio)**: spin up a small program right on your own computer to provide the tools. In the config you use `command` plus `args` (which means "which command to run" plus "what settings to hand it"). "stdio" is just the technical name for this local way of talking — you don't need to memorize it.
- **Remote (HTTP)**: connect to a service someone has already set up and put online. In the config you use `url` (the web address of that service).

For your very first one, we'll use the **local** kind, because it's the easiest to understand and you don't have to deal with the network or accounts.

## Step 2: Set up the filesystem MCP

Open the file `~/.hermes/config.yaml` in whatever text editor you like, and add these lines:

```yaml
mcp_servers:
  project_fs:
    command: 'npx'
    args:
      ['-y', '@modelcontextprotocol/server-filesystem', '/home/user/my-project']
```

Quick heads-up: this is YAML format (a way of writing settings that uses indentation to show which thing belongs under which). So the number of spaces at the front of each line matters. Just copy it exactly, and don't use Tab.

Here's what these lines mean:

- `project_fs` is a **name you make up yourself** — later you'll recognize this tool by it.
- `command` and `args` together mean "use npx to run the filesystem MCP program."
- That last path, `/home/user/my-project`, is **the folder you're allowing the agent to read and write**[^3].

⚠️ **This is the single most important line on the whole page, so please read carefully**: don't take the lazy route and point the path at the top level of your home directory (something all-encompassing like `/home/user` or `~`). Point it at the **specific project folder you're actually working in**, and that's it.

Why? Because this path is like a key — it decides which of your files the agent can touch. Open it too wide and it's like handing over every file on your computer. Open it just right, and the agent can only reach this one project. Much safer.

## Step 3: Reload — no restart needed

After you change the config, you do **not** need to shut Hermes down and reopen it. Just type this one line into the conversation:

```text
/reload-mcp
```

It re-reads the MCP config and takes effect right away[^2]. That simple.

## Step 4: Confirm it's really connected (don't skip this)

Lots of people want to skip this step, and then waste time later. Because most of the "why is my MCP not responding" confusion has the same real cause: **it was never connected, you just didn't know**. Spend ten seconds confirming now and save yourself half an hour of frustration later.

There are two ways. Pick one.

**Way 1: just ask it**

Type this into the conversation (copy it as-is; it being in English is fine):

```text
Tell me which MCP-backed tools are available right now
```

**How you know it worked**: it lists out a set of tools, and they come from the server you just set up. The filesystem MCP's tools have names that look like this: `mcp_project_fs_read_file`.

See the pattern? The naming format is `mcp_<server name>_<tool name>`[^2]. So as long as you see tool names starting with a prefix like `mcp_project_fs_` (a prefix is just the opening chunk of the name), it means it's **connected**. Success.

**Way 2: test the connection directly**

Back in the terminal, enter:

```bash
hermes mcp test project_fs
```

`hermes mcp test <server name>` goes and tries whether that server can be reached[^1], and the result is clear at a glance.

## Tool didn't show up? Check it in this order

The first time you set up MCP, "the tool didn't show up" is the most common thing that happens. Don't panic — plenty of people hit it. The table below organizes the reasons the docs list[^1]. Read it side by side:

| What you're seeing            | Usually because                                                                                                                                                                                                                          |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| No tools at all               | You forgot to remove `enabled: false` from the config, the environment the tool needs isn't set up, or the header used for authentication (a header is a small piece of identity info sent along with the connection) is filled in wrong |
| A few tools missing           | Filtered out by the `include` allowlist, blocked by the `exclude` blocklist, or a whole category of tools got turned off                                                                                                                 |
| Fewer tools than you expected | Each server has its own filtering rules by default. This is normal, not broken                                                                                                                                                           |

Suggested order to check: first confirm you **actually ran** `/reload-mcp` (without a reload, the current conversation is still reading the old config); then use `hermes mcp test` to see if the connection goes through; and only then go back and suspect the config content itself is wrong. This order saves you detours.

## Tighten permissions: only turn on the tools you really need

Once the filesystem MCP is working, you'll probably want to connect more powerful MCPs next — things like GitHub or a database. At that point, **"only turn on the permissions you need" becomes really important**.

You can say "only allow these specific tools," like this:

```yaml
mcp_servers:
  github:
    command: 'npx'
    args: ['-y', '@modelcontextprotocol/server-github']
    env:
      GITHUB_PERSONAL_ACCESS_TOKEN: '***'
    tools:
      include: [list_issues, create_issue, search_code]
```

Here `tools.include` is an **allowlist**: only the tools on the list are usable, everything else is off[^2]. This "only turn on these few" approach is much safer than "turn everything on, then block them one by one" — because the first way can't accidentally leave something open.

While we're here, one nice safety mechanism a lot of people don't know about: **a local (stdio) server can only see the specific environment variables you explicitly list under `env`. It cannot peek at your whole shell environment**[^2].

(An environment variable is a setting value handed to a program — often used to store sensitive things like passwords and keys; the shell is the environment where you type commands.)

So the point is: something like an API key (the secret key used to access a service) is only available to it if you explicitly put it in `env`. It won't go rummaging through your shell on its own. That's good for you — you won't accidentally leak a pile of passwords to it.

## Remote MCP (advanced — look at this later, when you need it)

If one day you need to connect to a service someone else has already set up and put online, switch to `url`:

```yaml
mcp_servers:
  internal_api:
    url: 'https://mcp.internal.example.com/mcp'
    headers:
      Authorization: 'Bearer ***'
```

Here `headers` is the identity info sent along with the connection, so the other side knows "it's you" and lets you in.

If that service needs you to log in with OAuth (OAuth is the "authorize with your account, without handing over your password" method — like the "Log in with Google" button on many sites), add `auth: oauth`[^2]. Linear, for example, is this kind.

## Install from the official catalog (the easy way)

Instead of writing the config line by line yourself, you can also use the official ready-made catalog and let it install for you:

```bash
hermes mcp catalog          # see what's available
hermes mcp install <name>   # install one
```

The first line "lists what's available to install in the catalog," and the second "picks one and installs it."

⚠️ But there's one thing you must know: when installing, Hermes runs the bootstrap commands in the manifest, **and it also runs the MCP server's own code**.

(The manifest is the "install checklist" that comes with the MCP, spelling out what needs to run to get it set up.)

Even though the official team reviews every entry in the catalog, it's still recommended you build a habit: **read the manifest before installing**[^2], so you can see clearly what it's about to run on your computer. One extra minute buys a lot of peace of mind.

## FAQ

### I'm inside WSL2 and want to control a browser on Windows. Can I?

Yes. Use chrome-devtools-mcp as the bridge in the middle; for how, see the [WSL2 guide](/install/wsl2/). (WSL2 is a setup that runs Linux inside Windows.)

### Every time I change the config, do I really have to run /reload-mcp?

Yes, always. If you don't reload, the current conversation is still reading the **old** config, so your change effectively did nothing.

### How do I judge whether some npm package is a trustworthy MCP?

One simple rule of thumb: names starting with `@modelcontextprotocol/*` are the official reference implementations and are relatively trustworthy.

The other way around, a third-party server of unknown origin is essentially **letting a piece of code you don't know run in your environment** — be careful. To judge more systematically, see the trust levels laid out in [Recommended MCP](/en/integrations/recommended-mcp/).

## Next steps

- Which MCPs are worth connecting → [MCP servers worth connecting first](/en/integrations/recommended-mcp/)
- See the built-in capabilities → [Full skills catalog](/skills/catalog/)
- Understand the difference between skills and MCP → [The skills system](/concepts/技能系統/)

[^1]: Nous Research, Use MCP with Hermes: https://hermes-agent.nousresearch.com/docs/guides/use-mcp-with-hermes (accessed 2026-07-25)

[^2]: Nous Research, MCP: https://hermes-agent.nousresearch.com/docs/user-guide/features/mcp (accessed 2026-07-25)

[^3]: Same as above; the last argument in the filesystem MCP's args is the directory path it's allowed to access

[^4]: Model Context Protocol, Introduction: https://modelcontextprotocol.io/docs/getting-started/intro (accessed 2026-08-30)
