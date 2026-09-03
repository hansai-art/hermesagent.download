---
title: "Got a new computer? Move your whole Hermes over"
description: "One command, hermes backup, packs your entire ~/.hermes into a single file. On the new computer, hermes import restores everything: memories, skills, settings, conversations. One catch: that packed file hides your API key (the password programs use), so treat it as a secret when you move it."
date: 2026-07-27
subcategory: "backup"
hermes_version: ">=2026.5"
last_verified: 2026-07-27
human_reviewed: false
upstream_refs:
  - "https://hermes-agent.nousresearch.com/docs/reference/faq"
tags:
  - "backup"
  - "migrate"
status: "published"
---

When you switch to a new computer, the annoying part is all the stuff that built up bit by bit: the things the agent remembers about you, the skills it taught itself, the settings you slowly got just right, and every past conversation. Redoing all of that from scratch hurts.

Good news: Hermes has a built-in "pack it all up, unpack it all" feature. Everything above **can move together**.

But there's one thing to be clear about first: **the packed file hides your API key inside it**.

What's an API key? Think of it as "a password that programs use." A program carries this password to connect to other services (like an AI model), and the other side only lets it in when the password checks out. So if this password leaks, someone else can impersonate you. That's why "how you move this file to the new computer" needs even more care than "how you create it."

## The fastest way: pack it up, then import

Step one, on your **old computer**, pack it up. Open the terminal (the black window where you type commands) and enter:

```bash
hermes backup
```

Once you run it, it creates a file in your home folder with a name like this: `~/hermes-backup-<timestamp>.zip` (here `~` means your home folder; `<timestamp>` gets swapped for the date and time of the moment you packed it, so the name is different every time; `.zip` is a format that squeezes many files into one bundle).

Inside that bundle is your complete `~/.hermes/` folder. In other words, **your settings, API key, memories, skills, conversation records (sessions), and setting bundles (profiles) are all in there**[^1].

Step two, move that file to the new computer (the next section covers how to move it safely), then on the **new computer** enter these two lines:

```bash
hermes import ~/hermes-backup-<timestamp>.zip
hermes setup
```

The first line, `hermes import`, unpacks the bundle and restores it. The second line, `hermes setup`, is a wrap-up check that makes sure everything on the new computer connects properly[^1].

**How do you know the move worked?** On the new computer, start a fresh conversation and ask it: "What do you remember about me?" If it can name your name, your preferences, and how you like to run projects, then your memories moved over. Next, enter `hermes skills browse` to look at the skill list. If all the skills from your old computer are there, then the whole bundle moved correctly.

## ⚠️ This zip is a secret, don't move it carelessly

Let me stress this again, because it matters: the full backup that `hermes backup` creates **includes two files, `.env` and `auth.json`**. The `.env` file holds all your API keys; the `auth.json` file holds OAuth credentials (OAuth is a way to let a program log in on your behalf without handing over your password, and that credential is like a pass)[^2].

Put another way, once this zip lands in someone else's hands, you've basically handed them all your passwords. So:

- ✅ You can use `scp` to copy it computer-to-computer directly. `scp` is a command that securely copies a file from one computer to another, like this: `scp ~/hermes-backup-*.zip newmachine:~/` (replace `newmachine` with the name or address of your new computer)[^1]
- ✅ You can use a USB drive, or an encrypted cloud drive
- ❌ **Don't** email it to yourself
- ❌ **Don't** drop it in an unencrypted, public cloud folder
- ❌ **Don't** paste it into a chat room, an issue (a bug-report ticket), or anywhere else other people can see

One more thing people forget: after the move, remember to delete the backup file on the old computer. Don't leave it sitting around.

## Just want to move one setting bundle (this kind is safe to share)

Sometimes you don't want to move everything, just **one profile** (a setting bundle, meaning one self-contained set of settings; for example, you might have a "work" set and a "personal" set). Or maybe you want to share one set of settings with a coworker, or even post it publicly.

For that, don't use the full backup. Use profile export instead. Its biggest difference from the full backup is this: **when it exports, it strips out the credentials (those passwords)**, so it's safe to share[^3]:

```bash
# Export on the old computer (this exports the set named work)
hermes profile export work ./work-backup.tar.gz

# Import on the new computer
hermes profile import ./work-backup.tar.gz work
```

(`.tar.gz`, like `.zip`, is another format that bundles and compresses several files.)

Here's a table so you can see the difference between the two approaches at a glance:

| | `hermes backup` | `hermes profile export` |
|---|---|---|
| How much it moves | Your whole `~/.hermes` | Just one profile |
| File format | `.zip` | `.tar.gz` |
| Does it include passwords | **Yes** (includes .env, auth.json) | **No**, stripped out, safe to share |

So the choice is simple: **moving your own setup and want everything, use `backup`; giving settings to someone else, use `profile export`**.

## Advanced way: sync the folder directly with rsync

If you'd rather not use the built-in commands, you can also sync the folder contents over directly. `rsync` is a command that copies and syncs the contents of one folder to another computer.

One thing to remember: **exclude the code repo** (a repo is a code repository, meaning the source code of the Hermes program itself; you get this again just by reinstalling on the new computer, so there's no need to move it)[^4]:

```bash
rsync -av --exclude='hermes-agent' ~/.hermes/ newmachine:~/.hermes/
```

A heads-up: this command also moves the passwords in `.env` along with everything else, so only use it between computers and networks you trust.

## Common questions

### Do the memories really come along?

Yes. The things the agent remembers live in two files: `MEMORY.md` and `USER.md`, both inside the `~/.hermes/memories/` folder. Whether you use the full backup or rsync, they come along too. If you're not sure where memories are stored or what they contain, see [Memory system](/concepts/記憶系統/).

### When moving from the old computer, do both sides need the same version?

The safest approach is: install the matching version of Hermes on the new computer first, then do the import. For how to install, see [Install and deploy](/install/).

### I'm moving from OpenClaw, not switching Hermes computers?

That's a different path. You use the `hermes claw migrate` command. For how, see [Migrate from OpenClaw to Hermes](/en/migrate/migrate-from-openclaw/).

### I'm not switching computers, I just want a backup?

That same `hermes backup` command is your backup. Also, if you turn on the `updates.pre_update_backup` option in your settings, it will automatically back up for you before every upgrade too. For details, see [config.yaml reference](/en/config/config-yaml-reference/).

## Next steps

- Install Hermes on the new computer first → [Install and deploy](/install/)
- Confirm the settings you moved are all correct → [config.yaml reference](/en/config/config-yaml-reference/)
- You're moving from OpenClaw, not switching machines → [Migration guide](/en/migrate/migrate-from-openclaw/)

[^1]: Nous Research, FAQ: https://hermes-agent.nousresearch.com/docs/reference/faq (accessed 2026-07-27). `hermes backup` produces `~/hermes-backup-<timestamp>.zip` (the full `~/.hermes/`: config, API keys, memories, skills, sessions, profiles); on the new machine, restore with `hermes import <file>` then `hermes setup`; you can use `scp` to transfer between machines
[^2]: Same source, the full backup includes `.env` and `auth.json` (API keys and OAuth credentials), so the backup file should be kept and transferred as a secret
[^3]: Same source, `hermes profile export <name> <file.tar.gz>` / `hermes profile import`: scope is a single profile, format `.tar.gz`, credentials stripped for safe sharing
[^4]: Same source, the manual alternative `rsync -av --exclude='hermes-agent' ~/.hermes/ newmachine:~/.hermes/`, excluding the code repo