---
title: 'Installing Hermes Agent on Windows (Step-by-Step for Beginners)'
description: 'There are three ways to install it on Windows. This guide helps you pick the right one, and tells you how to know each step worked. Picking wrong means starting over, so read this first.'
date: 2026-07-23
subcategory: 'windows'
hermes_version: '>=2026.5'
last_verified: 2026-07-04
human_reviewed: false
upstream_refs:
  - 'https://hermes-agent.nousresearch.com/docs/getting-started/installation'
  - 'https://hermes-agent.nousresearch.com/docs/reference/faq'
tags:
  - 'windows'
  - 'install'
status: 'published'
---

Hermes Agent is an AI assistant program that can do tasks for you. On Windows, there are three ways to install it.

First, the most important thing: **if you pick the wrong one of these three, switching later is a pain.** Especially once you have already set up your model, chatted for a while, and built up some conversation history, only to realize you picked the wrong path. Starting over at that point really hurts. So please take one minute first and pick the right one using the table below.

## Step 1: Pick a method first

Find which kind of person you are on the left, then look at which method to use on the right.

| Your situation                                                                     | Which one to use                                                                                           |
| ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| I just want to use it, I rarely type commands                                      | **Desktop version**: download one installer, double-click, and it sets up everything for you automatically |
| I want to use it inside PowerShell, but I don't want to install Linux on top       | **Native PowerShell**                                                                                      |
| I write scripts, need to hook into automation, or need the full set of Linux tools | **WSL2**                                                                                                   |

A few terms to explain, so don't panic when you see them for the first time:

- **Terminal / command**: that black window where you type in commands, instead of clicking with the mouse.
- **PowerShell**: a kind of terminal window that comes built into Windows. We'll use it in a bit.
- **WSL2** (Windows Subsystem for Linux, a feature that runs a Linux system inside Windows): this is for more advanced users. It lets you use all the Linux tools directly inside Windows.

**Still not sure which to pick?** Then **pick the desktop version for now**. If you really need it later, you can install the WSL2 version then too, no rush. The two can exist at the same time without fighting each other.

## Method 1: Desktop version (the easiest)

Go to the [official download page](https://hermes-agent.nousresearch.com/), download the Windows installer, then double-click it and follow the on-screen steps[^1].

You don't need to prepare anything yourself first. The installer automatically sets up all the supporting software you need for you (uv, Python 3.11, Node.js v22, ripgrep, and ffmpeg; don't worry if those names mean nothing to you, it handles them itself)[^1].

**How to know it worked**: the program opens, and you reach a screen where you can chat with it. Once you get here, you're done. Skip straight down to the "Tell it which AI model to use" section below.

## Method 2: Native PowerShell

First, open **PowerShell** (note: PowerShell, not CMD. They look similar but they are not the same).

Once it's open, paste in the line below, press Enter to run it. This is the official install command:

```powershell
iex (irm https://hermes-agent.nousresearch.com/install.ps1)
```

What does this line do? Broken down: `irm` downloads the official install script from the internet, and `iex` runs it[^1].

> **Not comfortable directly running something pulled off the internet?** You can download it first, read it yourself, and then run it:
>
> ```powershell
> irm https://hermes-agent.nousresearch.com/install.ps1 -OutFile install.ps1
> notepad install.ps1
> .\install.ps1
> ```
>
> The first line saves the script as a file, the second opens it in Notepad so you can read it, and only the third line actually runs it.

**If PowerShell blocks the script** (a message about "execution policy" pops up), don't worry, nothing is broken. That's a Windows security setting doing its job. You can allow it just for "this window right now":

```powershell
Set-ExecutionPolicy -Scope Process -Bypass
```

This line only affects the window you have open right now. Close the window and it goes back to normal. It does not permanently lower the security of your whole computer. After allowing it, just run the install command above again.

### After installing, you must close and reopen PowerShell

The installer changed a setting called PATH (PATH is a list that tells your computer "here's where the programs live that you can run just by typing their name"). The problem is, **the window you currently have open doesn't know the list was changed yet.**

So please close PowerShell completely, open a fresh new window, and then type:

```powershell
hermes doctor
```

`hermes doctor` is the built-in official "health check" command. It checks whether everything installed correctly for you[^1]. If it reports a problem with some item, just follow the hints it gives you to fix it.

> 📝 **This section is still missing the real screen output**: we don't yet have an actual screenshot of what `hermes doctor` shows on Windows.
> If you happen to have run it, you're welcome to [help us fill it in](https://github.com/hansai-art/hermesagent.download/edit/main/knowledge/install/windows.md).

## Method 3: WSL2

If you pick WSL2, the install works exactly like it does on Linux. The command below downloads and runs the installer from Hermes' official domain. In your WSL2 Linux window, paste in this line and run it:

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

**Important**: this line must be typed **inside the WSL2 window**, not inside PowerShell. PowerShell and WSL2 are two different environments, and mixing them up is the most common mistake with this method.

For the full WSL2 guide (including how to install WSL2 itself, which folder to put your files in, and how to solve common permission problems), see the [full WSL2 install guide](/install/wsl2/).

## Tell it which AI model to use

No matter which of the methods above you used to install, the next step is the same: you have to tell Hermes which AI model to use before it can start doing things for you.

```bash
hermes model
```

After you type this line, a menu pops up that you navigate with the up and down keys. In it, you pick a model provider, then paste in its API key[^1]. (An API key is a kind of password that the service gives you, used to prove "this is you using it, and to bill it to your account.")

Or, you can use the official Portal (a web page) to set it all up in one go:

```bash
hermes setup --portal
```

For more detail, see [Model providers and API key setup](/en/config/model-provider/).

## Start using it

Once your model is set up, type this one line to get going:

```bash
hermes
```

## Common questions

### I typed hermes in PowerShell and it says the command isn't found?

Most likely because you haven't closed and reopened the window yet. The installer changed a setting, but the old window doesn't know. Close PowerShell, open a fresh new one, and try again. For a more detailed fix, see [How to fix command not found](/en/troubleshoot/command-not-found/).

### I installed it with WSL2, so why can't PowerShell find it?

This is normal, nothing is broken. WSL2 and Windows are two separate, independent environments. Whatever you install inside WSL2 only exists inside WSL2. If you want to use it in PowerShell too, you'll have to install it again separately using the "native PowerShell" method.

### Can I install all three methods at the same time?

Yes, they are independent and don't fight each other. But note: **settings and conversation history are not shared between them.** For example, what you chat about in the desktop version won't show up in the WSL2 version.

### Should I use CMD or PowerShell?

Use PowerShell. The official install command above, `iex (irm ...)`, is written in PowerShell's style, and typing it in CMD won't work[^1]. (CMD and PowerShell are both Windows terminal windows, but they use different syntax.)

## Next steps

- Want to go the WSL2 route → [full WSL2 install guide](/install/wsl2/)
- Set up the model to use → [Model providers and API key setup](/en/config/model-provider/)
- Want to move over from OpenClaw → [Migration guide](/en/migrate/migrate-from-openclaw/)

[^1]: Nous Research, Installation: https://hermes-agent.nousresearch.com/docs/getting-started/installation (accessed 2026-07-23)
