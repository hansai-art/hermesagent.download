---
title: "Installing Hermes Agent on Windows"
description: "Three paths: the desktop app, native PowerShell, or WSL2. This guide helps you pick, with a success check for every step: taking the wrong path and starting over hurts."
date: 2026-07-23
subcategory: "windows"
hermes_version: ">=2026.5"
last_verified: 2026-07-04
human_reviewed: false
upstream_refs:
  - "https://hermes-agent.nousresearch.com/docs/getting-started/installation"
  - "https://hermes-agent.nousresearch.com/docs/reference/faq"
tags:
  - "windows"
  - "install"
status: "published"
---

There are three ways to install Hermes Agent on Windows, and **starting over after picking the wrong one is a pain** — especially once you've already configured a model and built up some memory before realizing the path was wrong. So spend a minute up front and pick the right one.

## Pick your path first

| Your situation | Recommended path |
|---|---|
| You just want to use it and rarely touch a terminal | **Desktop app**: double-click to install, all dependencies handled automatically |
| You want to use it inside PowerShell without installing Linux | **Native PowerShell** |
| You write scripts, need automation hooks, or want a full Linux toolchain | **WSL2** |

Not sure? **Go with the desktop app now** — you can always install the WSL2 version later if you really need it, and the two can coexist.

## Path 1: Desktop app

Go to the [official download page](https://hermes-agent.nousresearch.com/), download the Windows installer, and double-click to install[^1].

The installer automatically handles all dependencies (uv, Python 3.11, Node.js v22, ripgrep, ffmpeg)[^1], so you don't need to install anything beforehand.

**How to confirm it worked**: the app opens and reaches the chat screen. Then skip down to "Configuring a model provider" below.

## Path 2: Native PowerShell

Open **PowerShell** (not CMD) and run the official install command:

```powershell
iex (irm https://hermes-agent.nousresearch.com/install.ps1)
```

Here's what this line does: `irm` downloads the official install script, and `iex` runs it[^1].

> **Uneasy about running it directly?** You can download it first and read it:
>
> ```powershell
> irm https://hermes-agent.nousresearch.com/install.ps1 -OutFile install.ps1
> notepad install.ps1
> .\install.ps1
> ```

**If PowerShell blocks the script from running** (it shows an execution policy error), that's a Windows security setting. You can allow it for just this session:

```powershell
Set-ExecutionPolicy -Scope Process -Bypass
```

This affects only the current window and reverts when you close it, so it won't permanently weaken your system's security.

### Restart PowerShell after installing

The installer changed your PATH, but **the current window doesn't know that yet**. Close PowerShell, open a fresh one, and then run:

```powershell
hermes doctor
```

`hermes doctor` is the official diagnostic command[^1]. If any item reports an error, follow its instructions.

> 📝 **This section is missing real output**: we don't have the actual screen for `hermes doctor` on Windows.
> If you just ran it, [help us fill it in](https://github.com/hansai-art/hermesagent.download/edit/main/knowledge/install/windows.md).

## Path 3: WSL2

Inside the WSL2 Linux shell, use exactly the same command as on Linux:

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

**Note**: this line has to run **inside the WSL2 shell**, not PowerShell. They are two different environments, and mixing them up is the most common mistake on this path.

For the full WSL2 walkthrough (including how to install WSL2 itself, where to place files on the filesystem, and common permission issues), see the [complete WSL2 install guide](/install/wsl2/).

## Configuring a model provider

Once you've installed via any of the three paths, the rest is the same: you have to tell it which model to use before you can start.

```bash
hermes model
```

This is an interactive menu where you pick a provider and enter an API key[^1]. Or do it all in one step with the official portal:

```bash
hermes setup --portal
```

For details, see [Model provider and API key setup](/en/config/model-provider/).

## Getting started

```bash
hermes
```

## Frequently asked questions

### PowerShell says `hermes` is not a recognized command?

You didn't restart the window. Close PowerShell and open a fresh one. For a full explanation, see [How to fix command not found](/en/troubleshoot/command-not-found/).

### I installed it under WSL2, but PowerShell can't find it?

That's normal. WSL2 and Windows are two separate environments, so a command installed under WSL2 only exists inside WSL2. To use it in PowerShell, you have to install the native version separately.

### Can I install all three paths at once?

Yes, they're independent of each other. But settings and memory aren't shared: the desktop app's chat history won't show up in the WSL2 version.

### Should I use CMD or PowerShell?

PowerShell. The official install command `iex (irm ...)` is PowerShell syntax and won't run in CMD[^1].

## Next steps

- Going the WSL2 route → [Complete WSL2 install guide](/install/wsl2/)
- Configuring a model → [Model provider and API key setup](/en/config/model-provider/)
- Migrating from OpenClaw → [Migration guide](/en/migrate/migrate-from-openclaw/)

[^1]: Nous Research, Installation: https://hermes-agent.nousresearch.com/docs/getting-started/installation (accessed 2026-07-23)
