---
title: "How to Fix \"Hermes requires Python 3.11 or newer\""
description: "Hitting this error usually means you skipped the official installer. Three fixes, including why most people never see it."
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

```
Hermes requires Python 3.11 or newer
```

When you see this line, ask yourself one question first: **did you install it yourself with pip, or manually on an older system?**

That's because the official one-line install script automatically sets up Python 3.11[^1]. Running into this error usually means the installation didn't go through that path, or that multiple Python versions in your environment are conflicting with each other.

## First, check which version you're on

```bash
python3 --version
```

**Expected output**: a string like `Python 3.12.3`. If it shows 3.10 or older, that's the problem.

## Fix 1: Re-run the official install script (the easiest option)

The official install script already handles the Python version for you[^1]. Rather than wrestling with your system Python yourself, let it do the work:

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

Windows users, use PowerShell:

```powershell
iex (irm https://hermes-agent.nousresearch.com/install.ps1)
```

## Fix 2: Upgrade your system Python

If you have a reason to manage the environment yourself:

**Ubuntu / Debian**

```bash
sudo apt update && sudo apt install -y python3.12
```

**macOS (Homebrew)**

```bash
brew install python@3.12
```

**Verify**:

```bash
python3 --version
```

**Expected output**: `Python 3.12.x`.

> ⚠️ **Note**: On some systems, installing a newer Python doesn't mean `python3` will point to it; the system may still resolve to the old version.
> If the version doesn't change after installing, you'll need to adjust your PATH or use `update-alternatives` (on Debian-based systems).
>
> 📝 **To be added**: We haven't yet documented the exact steps for switching the default Python version on each system.
> [Contributions welcome](https://github.com/hansai-art/hermesagent.download/edit/main/knowledge/troubleshoot/python-version-too-old.md).

## Fix 3: The uv package manager is missing

Hermes uses uv to manage its Python environment. If the error message is related to uv:

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

This is uv's official install command (astral.sh is uv's official domain).

## Confirm it's fixed

```bash
hermes doctor
```

The official diagnostic command checks all environment dependencies, including the Python version[^2].

## FAQ

### Why do some people never run into this?

Because the official one-line install script automatically installs Python 3.11 and isolates the environment[^1]. Installing yourself with pip, or manually installing in an environment with multiple Python versions, is what tends to cause version problems.

### I don't want to touch my system Python. Will this affect my other projects?

Not if you use the official install script: it uses uv to create an isolated environment and won't replace your system Python.

### Could upgrading Python break my system?

On Ubuntu / Debian, **installing** a new version (`apt install python3.12`) is safe, and the system keeps the old version. What's risky is pointing the system's default `python3` at the new version: some system tools depend on a specific version. So prefer Fix 1.

## Next steps

- Installed and need to configure a model → [Model providers and API key setup](/en/config/model-provider/)
- Hit a different error → [Troubleshooting overview](/en/troubleshoot/overview/)

[^1]: Nous Research, FAQ: https://hermes-agent.nousresearch.com/docs/reference/faq (accessed 2026-07-23)
[^2]: Nous Research, Installation: https://hermes-agent.nousresearch.com/docs/getting-started/installation
