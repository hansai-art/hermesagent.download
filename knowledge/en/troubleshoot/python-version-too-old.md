---
title: "What to do when you see \"Hermes requires Python 3.11 or newer\""
description: "This error usually means you didn't use the official installer. Here are three fixes, plus why some people never hit it."
date: 2026-07-23
subcategory: "install"
hermes_version: ">=2026.5"
last_verified: 2026-07-04
human_reviewed: false
upstream_refs:
  - "https://hermes-agent.nousresearch.com/docs/reference/faq"
  - "https://hermes-agent.nousresearch.com/docs/getting-started/installation"
tags:
  - "install"
  - "troubleshoot"
status: "published"
---

```text
Hermes requires Python 3.11 or newer
```

Let's start with a couple of words.

Python is a programming language. Hermes is written in it, so your computer needs a new enough version of Python installed for Hermes to run at all. Python gets a new version every so often, and a bigger number means a newer one. For example, 3.10 is older than 3.11.

When you see this error, ask yourself one question first: **did you install it by hand yourself?** For example, did you use pip (Python's built-in tool for installing packages) to install it, or did you set it up manually on an older computer?

Here's why that matters. The official team gives you an installer script that sets everything up with a single line (a script is just a list of pre-written commands; you paste it in, run it, and it does a whole series of install steps for you). That script automatically installs Python 3.11 for you[^1]. So if you hit this error, it usually means you didn't take that official route, or your computer has several versions of Python installed at once and they're fighting each other.

## Step one: check which version you have right now

Open your terminal (the terminal is a plain window where you type commands; in English it's called a terminal), and type this line:

```bash
python3 --version
```

**What you'll see**: one line that looks like `Python 3.12.3`. The number is the version.

If it shows 3.10 or a smaller number, you've found the problem: the version is too old. Next, pick one of the three fixes below. If you're not sure which, just use Fix 1 — it's the easiest.

## Fix 1: re-run the official installer script (easiest, recommended for beginners)

The official installer script already handles the Python version for you[^1]. Rather than wrestling with the old Python on your computer, let the script sort it out.

Paste this line into your terminal and press Enter:

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

If you're on Windows, use PowerShell instead (PowerShell is a terminal program built into Windows; search for "PowerShell" in the Start menu to open it), and paste this line:

```powershell
iex (irm https://hermes-agent.nousresearch.com/install.ps1)
```

Once it finishes, it should have the right version of Python ready for you.

## Fix 2: upgrade the Python on your computer to a newer version

If you have your own reason to manage Python yourself (say you're a developer and you like to control it by hand), you can upgrade it this way. Pick the set of commands that matches your operating system.

**Ubuntu / Debian** (these are two common Linux systems)

```bash
sudo apt update && sudo apt install -y python3.12
```

**macOS (Homebrew)** (Homebrew is a popular tool for installing software on a Mac; it's often shortened to brew)

```bash
brew install python@3.12
```

After it installs, check the version once more:

```bash
python3 --version
```

**What you'll see**: one line that says `Python 3.12.x` (the x at the end is the minor version number; any number there is fine).

> ⚠️ **Note**: On some computers, even after you install a newer Python, the `python3` command doesn't automatically point to the new one — the system may keep using the old one.
> If the version doesn't change after you install, you'll need to adjust your PATH (PATH is a list that tells your computer where to look for programs to run), or use a tool called `update-alternatives` to switch (that's the way to do it on Debian-style systems).
>
> 📝 **To be added**: We haven't finished writing up the exact steps for switching the default Python version on each system.
> [Contributions welcome](https://github.com/hansai-art/hermesagent.download/edit/main/knowledge/troubleshoot/python-version-too-old.md).

## Fix 3: the uv tool is missing

Hermes relies on a tool called uv to manage its Python environment (think of uv as a little helper that takes care of Python for you — installing packages and keeping environments separate). If the error message you see mentions uv, it may be because uv isn't installed on your computer yet.

Paste this line into your terminal to install it:

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

This is the official install command from uv (astral.sh is uv's official website address, so seeing that domain is a good sign — nothing to worry about).

## How to confirm it's fixed

Whichever fix you used, run this line at the end to check:

```bash
hermes doctor
```

This is Hermes' official "health check" command (doctor as in a medical doctor — it checks your whole setup from top to bottom). It checks all the things Hermes depends on, including the Python version[^2]. If it no longer complains about the Python version, you're fixed.

## Common questions

### Why do some people never hit this error when they install?

Because they took the official one-line route. That installer script installs Python 3.11 for you automatically, and it puts Hermes in a separate environment (a separate environment means it uses its own copy of Python and doesn't touch the one already on your computer)[^1]. On the other hand, installing with pip yourself, or installing by hand on a computer that has several Python versions, makes version clashes much more likely.

### I don't want to touch the Python already on my computer — will this affect my other projects?

Not if you use the official installer script. It uses uv to build a separate environment just for Hermes, and it won't replace or change the Python your computer already has, so your other projects are unaffected.

### Will upgrading Python break my system?

On Ubuntu / Debian, simply **installing** a new version (that is, `apt install python3.12`) is safe — the system keeps the old version and doesn't delete it. The risky move is changing the system default `python3` to point to the new version, because some built-in system tools are tied to a specific Python version and may break if you change it. So if you're worried, go with Fix 1 — it's the safest.

## Next steps

- Installed and ready to set up a model → [Model providers and API key setup](/en/config/model-provider/)
- Hit a different error → [Troubleshooting overview](/en/troubleshoot/overview/)

[^1]: Nous Research, FAQ: https://hermes-agent.nousresearch.com/docs/reference/faq (accessed 2026-07-23)
[^2]: Nous Research, Installation: https://hermes-agent.nousresearch.com/docs/getting-started/installation
