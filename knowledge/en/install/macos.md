---
title: "Installing Hermes Agent on macOS"
description: "Two paths: double-click the desktop installer, or install the command-line version with a single command. Every step has a success criterion, so you know what to check when you get stuck."
date: 2026-07-23
subcategory: "macos"
hermes_version: ">=2026.5"
last_verified: 2026-07-04
human_reviewed: false
upstream_refs:
  - "https://hermes-agent.nousresearch.com/docs/getting-started/installation"
  - "https://hermes-agent.nousresearch.com/docs/reference/faq"
tags:
  - "macos"
  - "install"
status: "published"
---

You spot Hermes Agent on the official site and want to try it out, only to find there's a desktop version, a command-line version, and a string of dependencies you don't recognize. This article tells you which path to pick, and how to confirm you got each step right.

**The short answer first**: if you just want to use it, download the desktop version. If you want to plug it into a terminal workflow and run automations later, use the command-line version. The two can coexist.

## Path 1: Desktop version

Go to the [official download page](https://hermes-agent.nousresearch.com/), download the macOS installer, and double-click to install[^1].

The installer handles all the dependencies on its own (uv, Python 3.11, Node.js v22, ripgrep, ffmpeg), so you don't need to install anything beforehand[^1].

**How to confirm success**: the app opens and brings you to a screen where you can start a conversation.

Then jump down to "Configuring a model provider" below: without a configured model, it isn't usable yet.

## Path 2: Command-line version (one-line install)

### First, confirm Git is present

The install script installs everything else on its own, but Git needs to already be there[^1]:

```bash
git --version
```

**Expected output**: a version string along the lines of `git version 2.39.5 (Apple Git-154)`.

If it says `command not found`, macOS will pop up a window asking you to install the Xcode Command Line Tools; just follow the prompts, or run `xcode-select --install` yourself.

### Run the official install command

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

This line downloads and runs the official install script[^1]. It sets up uv, Python 3.11, Node.js v22, ripgrep, and ffmpeg, and places the `hermes` command in `~/.local/bin`. The default install location is `~/.hermes/hermes-agent/`.

> **Uneasy about running `curl | bash` directly?** This is the official installation method on the official domain, but you can also read it over before running it:
>
> ```bash
> curl -fsSL https://hermes-agent.nousresearch.com/install.sh -o install.sh
> less install.sh
> bash install.sh
> ```

### Reload your shell (this is where most people get stuck)

The install script added `~/.local/bin` to your PATH, but **this terminal window doesn't know that yet**. So typing `hermes` right after installing will say the command can't be found: this is not an installation failure.

```bash
source ~/.zshrc
```

macOS has defaulted to zsh since Catalina; if you use bash, change this to `source ~/.bashrc`. Or, simplest of all: **open a new terminal window**, which will automatically load the updated PATH[^2].

### Confirm it's installed

```bash
hermes doctor
```

This is the official environment diagnostic command[^1], which checks the dependencies item by item. When something reports an error, follow the hints it gives.

The first time you run it, you'll see a whole row of yellow ⚠ marks. Don't panic: most of them mean "you haven't configured this" rather than "this is broken." For the actual output, what each of the 16 check blocks means, and how to tell real problems from noise, see [What hermes doctor actually checks](/troubleshoot/hermes-doctor/) (tested on macOS).

## Configuring a model provider

It's not usable right after installing; you first have to tell it which model to use:

```bash
hermes model
```

This opens an interactive menu where you pick a provider and enter your API key[^1]. Or do it all at once through the official Portal:

```bash
hermes setup --portal
```

For a provider comparison, cost-saving settings, and how to connect a local model, see [Configuring model providers and API keys](/en/config/model-provider/).

## Getting started

```bash
hermes
```

Once you reach the conversation interface, you're set.

## Frequently asked questions

### Typing `hermes` says command not found?

Nine times out of ten the shell just hasn't been reloaded; it's not an installation failure. Run `source ~/.zshrc` or open a new window. For a full explanation, see [How to fix command not found](/en/troubleshoot/command-not-found/).

### Do I need to install Python myself first?

No. The official installer handles Python 3.11, Node.js v22, ripgrep, and ffmpeg[^1].

### Can I install both the desktop and command-line versions at the same time?

Yes, the two are independent installations.

### Which directory does it install to?

By default, `~/.hermes/hermes-agent/`, with configuration files in `~/.hermes/`.

## Next steps

- Configure a model and API key → [Model provider setup](/en/config/model-provider/)
- Migrating over from OpenClaw → [Migration guide](/en/migrate/migrate-from-openclaw/)
- Want to understand what it is first → [What is Hermes Agent](/concepts/什麼是-hermes-agent/)

[^1]: Nous Research, Installation: https://hermes-agent.nousresearch.com/docs/getting-started/installation (accessed 2026-07-23)
[^2]: Ibid., FAQ: the installer adds `~/.local/bin` to your PATH, and a newly opened shell will load it automatically: https://hermes-agent.nousresearch.com/docs/reference/faq
