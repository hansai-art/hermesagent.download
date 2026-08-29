---
title: "Typed hermes and got \"command not found\"? Don't panic—30-second fix"
description: "Installed Hermes, typed hermes, and got \"command not found\"? Nine times out of ten it isn't broken—your window just hasn't re-read its settings yet. Follow along; it takes about 30 seconds."
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

The installer finished, everything looked fine. Feeling good, you typed `hermes` into your terminal (that black window where you type commands), and out popped this line:

```text
zsh: command not found: hermes
```

That means: "I don't recognize a command called hermes."

**Don't rush to reinstall.** Nine times out of ten, it actually installed fine. The only problem is that the window you have open right now doesn't yet know your computer has this new `hermes` thing.

## Why this happens

First, one term. PATH (say it like "path") is a list. It tells your computer which folders to look in when you type a command. When you type `hermes`, the computer walks down this list, folder by folder, and only runs the command once it finds it.

The installer did two things:

1. It put the `hermes` program file into a folder called `~/.local/bin` (the `~` means your home folder—your own personal folder).
2. It added "that folder" to the PATH list above, by writing it into your shell config file[^1]. (Your shell is the program that takes what you type and runs your commands. Its config file is a little cheat sheet the shell reads once, up front, every time it starts.)

Here's the catch: **the window you have open right now was opened *before* you installed.** The cheat sheet it read at startup is the old one—it doesn't have the newly added folder on it yet. It's like updating your contacts but not restarting your phone, so you still see the old info.

So the fix is simple: make this window "re-read the cheat sheet," or just "open a fresh window."

## Fix 1: Tell the window to re-read its settings (fastest)

Type this line:

```bash
source ~/.zshrc
```

`source` just means "re-read this cheat sheet right now, this instant."

A quick note: starting with the macOS version called Catalina, the default shell is called zsh (say "Z shell"), and its cheat sheet file is named `.zshrc`. If you're using another common shell called bash, the cheat sheet has a different name, so type this instead:

```bash
source ~/.bashrc
```

**How do you know it worked?** When you run this line, nothing shows up on screen—no news is good news. Now type `hermes doctor`. As long as something runs (and it's no longer "command not found"), you're good.

## Fix 2: Just open a brand-new terminal window

If you'd rather not remember commands, this is the no-brainer: close your current window and open a new one.

A fresh window reads that cheat sheet the moment it starts up, and the cheat sheet was updated long ago—so it recognizes `hermes` automatically[^1].

One heads-up: if you're using the terminal that's "built into" VS Code or another code editor, closing just the terminal tab may not be enough. You may need to **fully quit the whole editor and reopen it** for it to take effect.

## Tried both and still stuck? Let's check whether that folder is on the list

Type this line to see whether the PATH list actually contains that folder:

```bash
echo $PATH | tr ':' '\n' | grep local
```

(What this line does: it spreads the PATH list out one entry per line, then shows you only the lines that contain the word local.)

**If all is well**: you'll see a line with `/.local/bin` in it, for example `/Users/yourname/.local/bin`. Seeing that means the list is fine.

**If nothing prints out**: it means the installer didn't manage to write that folder into your cheat sheet. No problem—just add it by hand:

```bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

The first line adds that folder to the cheat sheet; the second line re-reads the cheat sheet right away.

(If you use bash, change both `.zshrc` above to `.bashrc`.)

## List is fine, but still not found? Let's confirm the program file is really there

Sometimes the list is right but the program file simply isn't there. Go check whether the file exists:

```bash
ls -l ~/.local/bin/hermes
```

`ls` means "list files."

**If all is well**: it prints one line of file info (the name, the size, and so on).

**If it prints `No such file or directory`**: *this* time the install really did fail. Run the install command again—and this time watch the process closely for any red error messages, because that's the real reason it got stuck.

## Let it check everything for you at once

```bash
hermes doctor
```

This is the built-in "health check" command (doctor, as in a physician). It checks things one by one for you: whether what should be installed is installed, whether what should be set is set, and then it tells you what's wrong[^2]. When you don't know where to start looking, running this first is always a safe bet.

## Common questions

### I use fish or some other shell—what do I do?

By default, Hermes only reads the `~/.bashrc` cheat sheet. If you use a different shell (fish, for example), it has its own cheat sheet file, and Hermes won't know about it automatically. In `config.yaml` (Hermes's config file), under the `terminal.shell_init_files` setting, add the name of your own cheat sheet file[^1].

### Does the desktop app (the one with a window) hit this too?

No. The desktop app is a graphical program—one with a window you click with your mouse. When it starts up, it doesn't even look at that PATH list, so this problem doesn't come up. But if you want to launch it "by typing in the terminal," you still need to get PATH sorted out using the steps above.

### Do I have to `source` every time I open a new window?

No. `source` is only there to rescue "this particular" old window that's already open and hasn't updated. The cheat sheet itself was fixed long ago, so every new window you open from now on reads the new version automatically at startup—no manual source needed.

## Next steps

- Once installed, pick a model and set up your API key (an access key—basically a password that gives Hermes permission to use the AI service) → [Model providers and API key setup](/en/config/model-provider/)
- Hit a different error → [Troubleshooting overview](/en/troubleshoot/overview/)

[^1]: Nous Research, FAQ: https://hermes-agent.nousresearch.com/docs/reference/faq (accessed 2026-07-23)
[^2]: Nous Research, Installation: https://hermes-agent.nousresearch.com/docs/getting-started/installation