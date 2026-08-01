---
title: "Installing Hermes Agent on a Mac for the First Time"
description: "Two ways to install: double-click the desktop app, or run one line to install the command-line version. Every step tells you how to know it worked, and where to look if you get stuck."
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

You saw Hermes Agent on the website and want to give it a try. Then you open it up and find there's a desktop version, a command-line version, and a long list of confusing "dependencies" (a dependency is just another piece of software that this software needs in order to run). Don't panic. This guide tells you which one to pick, and after each step it tells you how to confirm you did it right.

**Here's the short answer first.** If you just want to use it and don't want to touch the terminal, download the desktop version. If you want to plug it into the terminal (that black window where you type commands) and later run some automation, use the command-line version. You can install both at once — they won't fight each other.

## Option 1: The desktop version (easiest)

Go to the [official download page](https://hermes-agent.nousresearch.com/), download the macOS installer, double-click to open it, and follow the on-screen instructions to finish[^1].

Good news: the installer sets up everything it needs on its own (the tools uv, Python 3.11, Node.js v22, ripgrep, and ffmpeg). You don't need to understand those names right now. The point is **you don't have to prepare anything in advance**[^1].

**How to know it worked**: the app opens and takes you to a screen where you can start chatting with it.

After that, skip straight down to the "Set up a model provider" section below. Until you set up a model, it can't actually do anything yet.

## Option 2: The command-line version (one line does it)

On this path you'll type in the terminal. It's not hard — just follow along.

### Step 1: First, check that Git is on your computer

The install script (a small program that does things for you automatically) sets up almost everything on its own. The one tool it needs you to already have is Git[^1]. Git is a very common programming tool, and many Macs come with it already. Let's check.

Type this line in the terminal, then press Enter:

```bash
git --version
```

**You should see**: a line of version text that looks like `git version 2.39.5 (Apple Git-154)`. If you see that, Git is there and you can move on.

If it shows `command not found` (meaning "I can't find this command"), macOS will usually pop up a small window asking whether you want to install the Xcode Command Line Tools. Click through and follow the steps. Or you can install them yourself by typing: `xcode-select --install`.

### Step 2: Run the official install command

Type this whole line in the terminal (you can just copy and paste it), then press Enter:

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

Here's what this line does: it goes online, grabs the official install script, and runs it right away[^1]. It installs uv, Python 3.11, Node.js v22, ripgrep, and ffmpeg for you, and it puts the `hermes` command into the `~/.local/bin` folder. The whole thing installs by default into `~/.hermes/hermes-agent/`. (The `~` in a path means your home directory, which is your own user folder.)

> **Feeling a little nervous about running `curl | bash` directly?** That's normal. This really is the official way to install it, from the official address. But if you'd rather look at it before you run it, use these three lines instead: the first saves the script to a file, the second opens it so you can read it, and the third actually runs it:
>
> ```bash
> curl -fsSL https://hermes-agent.nousresearch.com/install.sh -o install.sh
> less install.sh
> bash install.sh
> ```

### Step 3: Reload your shell (this is where most people get stuck)

Quick explanation first: your shell is the terminal environment you're typing into right now. The install script already added the `~/.local/bin` folder to your PATH (PATH is a list that tells the computer "which folders to look in for commands"). The catch is that **the terminal window you have open right now doesn't yet know the list was changed**.

So if you type `hermes` right after installing, it will say it can't find the command. **This does not mean the install failed** — this window just hasn't caught up yet.

The fix is simple. Type this line to make it re-read its settings:

```bash
source ~/.zshrc
```

A note: starting with the macOS version called Catalina, Macs use a shell called zsh by default, which is why the line above uses `~/.zshrc`. If you use bash (an older, different shell), type `source ~/.bashrc` instead.

There's an even lazier option: **just close the terminal and open a brand-new window**. A new window automatically reads the updated list, so it works too[^2].

### Step 4: Confirm it's really installed

Type this line:

```bash
hermes doctor
```

This is a built-in "health check" command[^1] (doctor as in a doctor's checkup — it gives your setup a health check). It goes through the dependencies one by one to see whether each is installed. If something is wrong, it gives you a hint, and you just follow the hint.

**A heads-up so you're not surprised**: the first time you run it, you'll see a whole row of yellow ⚠ warning symbols. Don't worry. Most of these are saying "you haven't set this up yet," not "this is broken." To see what the real output looks like, what each of the 16 check sections is checking, and how to tell "a real problem" apart from "just not set up yet," see [what hermes doctor actually checks](/troubleshoot/hermes-doctor/) (this one has hands-on macOS testing).

## Set up a model provider

Once it's installed, you still can't use it right away. First you have to tell it which AI model to use to answer you. A model provider is the company that supplies these AI models (which company's model you'll use, and which key you'll use to access it).

Type this line:

```bash
hermes model
```

It brings up an interactive menu (the kind where you move up and down with the keyboard and press Enter to confirm). In it, you pick a provider and then enter an API key[^1]. Think of an API key as a "key" — a string of characters the company gives you to prove "it's really you using it this time."

Or, for a faster route, use the official Portal (a setup web page) to configure it all at once:

```bash
hermes setup --portal
```

To compare the different providers, set things up to save money, or connect a local model running on your own computer, see [model provider and API key setup](/en/config/model-provider/).

## Start using it

Everything's ready. Type this line:

```bash
hermes
```

As soon as you reach the chat screen, you've succeeded. Congratulations!

## Common questions

### I typed `hermes` but it says command not found?

Nine times out of ten, it's because the shell hasn't been reloaded — not because the install failed. Type `source ~/.zshrc`, or just open a new terminal window. For a fuller explanation, see [how to fix command not found](/en/troubleshoot/command-not-found/).

### Do I need to install Python myself first?

No. The official installer takes care of Python 3.11, Node.js v22, ripgrep, and ffmpeg for you[^1].

### Can I install the desktop version and the command-line version at the same time?

Yes. The two install separately and don't interfere with each other.

### Which folder does it actually install into?

The program itself installs by default into `~/.hermes/hermes-agent/`, and its config files go in `~/.hermes/`.

## Next steps

- Set up a model and API key → [model provider setup](/en/config/model-provider/)
- Want to move over from OpenClaw → [migration guide](/en/migrate/migrate-from-openclaw/)
- Want to understand what it even is first → [what is Hermes Agent](/concepts/什麼是-hermes-agent/)

[^1]: Nous Research, Installation: https://hermes-agent.nousresearch.com/docs/getting-started/installation (accessed 2026-07-23)
[^2]: Same source, FAQ: the installer adds `~/.local/bin` to PATH, and a newly opened shell loads it automatically: https://hermes-agent.nousresearch.com/docs/reference/faq