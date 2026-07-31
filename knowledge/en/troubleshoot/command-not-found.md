---
title: "How to Fix hermes: command not found"
description: "You installed it, typed hermes, and got told the command doesn't exist. Nine times out of ten this isn't a failed install; your shell just hasn't reloaded its PATH yet. Fixable in thirty seconds."
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

The install script finishes, everything looks fine on screen, you eagerly type `hermes`, and then:

```
zsh: command not found: hermes
```

**Don't reinstall yet.** Nine times out of ten the install succeeded; the problem is that your current terminal window doesn't know it exists.

## Why this happens

The install script places the `hermes` executable in `~/.local/bin` and writes that path into your shell configuration file[^1].

But **a terminal window that's already open was started before the install**, so it's reading the old PATH: it's like editing a config file without restarting the program.

## Fix 1: Reload the shell (fastest)

```bash
source ~/.zshrc
```

macOS has defaulted to zsh since Catalina. If you use bash:

```bash
source ~/.bashrc
```

**How to know it worked**: this command produces no output at all (no news is good news). Then type `hermes doctor`, and if you get a response, you're set.

## Fix 2: Open a new terminal window

Nothing to memorize. A new window re-reads the shell configuration file and automatically picks up the new PATH[^1].

If you're using the built-in terminal in VS Code or another IDE, you may need to **fully restart the editor** for it to take effect; closing the tab alone isn't enough.

## Still not working? Check whether PATH contains that entry

```bash
echo $PATH | tr ':' '\n' | grep local
```

**Expected output**: you should see a line containing `/.local/bin`, for example `/Users/yourname/.local/bin`.

**If nothing prints at all**, that means the install script wasn't able to modify your shell configuration file. Add it manually:

```bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

(bash users: replace both instances of `.zshrc` with `.bashrc`)

## Confirm the executable actually exists

If PATH is fine but it's still not found, check directly whether the file is there:

```bash
ls -l ~/.local/bin/hermes
```

**Expected output**: a single line of file information. If you get `No such file or directory`, then it really was a failed install: rerun the install command and watch for any red error messages during the process.

## Full diagnostics

```bash
hermes doctor
```

The official environment-diagnostics command, which checks dependencies and configuration item by item[^2].

## Frequently asked questions

### I use fish or another shell?

Hermes loads `~/.bashrc` by default. With a different shell, add your own initialization file to `terminal.shell_init_files` in `config.yaml`[^1].

### Does the desktop version have this problem too?

No. The desktop version is a graphical application and isn't launched via PATH. But if you want to invoke it from the terminal, you still need to follow the steps above.

### Do I have to source it every time I open a new window?

No. `source` just makes the **current** window take effect immediately; the configuration file is already updated, so windows you open later will load it automatically.

## Next steps

- Installed and need to set up a model → [Model providers and API key setup](/en/config/model-provider/)
- Hit a different error → [Troubleshooting overview](/en/troubleshoot/overview/)

[^1]: Nous Research, FAQ: https://hermes-agent.nousresearch.com/docs/reference/faq (accessed 2026-07-23)
[^2]: Nous Research, Installation: https://hermes-agent.nousresearch.com/docs/getting-started/installation
