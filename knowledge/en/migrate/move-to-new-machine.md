---
title: "Switching Computers: Move Your Entire Hermes Setup to a New Machine"
description: "hermes backup packages up your whole ~/.hermes, and importing it on the new machine restores everything: memory, skills, config, conversations. But that zip contains your API key, so treat how you move it as confidential."
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

When you switch to a new computer, the last thing you want to redo is everything you've built up over time: what the agent remembers about you, the skills it has grown on its own, the settings you've dialed in, and every past conversation. The good news is that Hermes has one-command packaging and restore built in, and **all of it moves together**.

But there's one thing to be clear about up front: **the packaged file contains your API key**. So "how you move this file" matters more than "how you generate it."

## The fastest approach: backup → import

Package everything up on the **old machine**:

```bash
hermes backup
```

This produces a `~/hermes-backup-<timestamp>.zip` containing your complete `~/.hermes/` directory: **config, API keys, memories, skills, conversation sessions, and profiles all included**[^1].

Transfer this file to the new machine (the next section covers how to do it safely), then on the **new machine**:

```bash
hermes import ~/hermes-backup-<timestamp>.zip
hermes setup
```

`hermes setup` wraps things up and confirms the environment is connected[^1].

**Success criteria**: Start a conversation on the new machine and ask it "What do you remember about me?" It should be able to tell you your name, your preferences, and your project conventions. The skills are there too: `hermes skills browse` should show the ones from your old machine. If those all check out, the move succeeded.

## ⚠️ That zip is confidential; don't move it carelessly

A full `hermes backup` **includes `.env` and `auth.json`**: that is, all of your API keys and OAuth credentials[^2]. So:

- ✅ Transfer machine-to-machine directly with `scp`: `scp ~/hermes-backup-*.zip newmachine:~/`[^1]
- ✅ USB drive, or an encrypted cloud drive
- ❌ **Don't** email it to yourself
- ❌ **Don't** drop it into an unencrypted public cloud folder
- ❌ **Don't** paste it into a chat room, an issue, or anywhere public

Once this zip leaks, it's as if you handed over all your API keys to someone else. After the move is done, remember to delete the backup on the old machine too.

## Just want to move a single profile (safe to share)

If you only want to move **one of your profiles**, or you want to share your settings with a colleague or post them online, use profile export. Its biggest difference from a full backup: **it strips credentials**, making it suitable for safe sharing[^3]:

```bash
# Export on the old machine
hermes profile export work ./work-backup.tar.gz

# Import on the new machine
hermes profile import ./work-backup.tar.gz work
```

| | `hermes backup` | `hermes profile export` |
|---|---|---|
| Scope | The entire `~/.hermes` | A single profile |
| Format | `.zip` | `.tar.gz` |
| Includes credentials | **Yes** (.env, auth.json) | **Stripped**, safe to share |

So the decision is simple: **use `backup` when moving your own setup, and `profile export` when handing it to someone else**.

## The manual approach: rsync

If you'd rather not use the built-in commands, you can sync the directory directly. Just remember to **exclude the code repo** (you get that back by reinstalling, so there's no need to move it)[^4]:

```bash
rsync -av --exclude='hermes-agent' ~/.hermes/ newmachine:~/.hermes/
```

This one will also carry over the secrets in `.env`, so only use it between machines and networks you trust.

## FAQ

### Does memory really come along?

Yes. `MEMORY.md` and `USER.md` both live in `~/.hermes/memories/`, and both a full backup and rsync will bring them along. If you're not sure where memory is stored or what it holds, see [Memory System](/concepts/記憶系統/).

### Does the version have to match when moving from the old machine?

The safest bet is to install the matching version of Hermes on the new machine first, then import. For installation instructions, see [Installation & Deployment](/install/).

### I'm migrating from OpenClaw, not switching Hermes machines?

That's a different path; use `hermes claw migrate`. See [Migrating from OpenClaw to Hermes](/en/migrate/migrate-from-openclaw/).

### Just want a backup, without switching machines?

That same `hermes backup` command is your backup. Combined with `updates.pre_update_backup` in your config, it will also automatically back up before an upgrade. See the [config.yaml reference](/en/config/config-yaml-reference/).

## Next steps

- Set it up on the new machine first → [Installation & Deployment](/install/)
- Verify the settings you moved over → [config.yaml reference](/en/config/config-yaml-reference/)
- Coming from OpenClaw rather than switching machines → [Migration guide](/en/migrate/migrate-from-openclaw/)

[^1]: Nous Research, FAQ: https://hermes-agent.nousresearch.com/docs/reference/faq (accessed 2026-07-27). `hermes backup` produces `~/hermes-backup-<timestamp>.zip` (the full `~/.hermes/`: config, API keys, memories, skills, sessions, profiles); on the new machine, restore with `hermes import <file>` followed by `hermes setup`; `scp` can be used to transfer between machines
[^2]: Same source; a full backup includes `.env` and `auth.json` (API keys and OAuth credentials), so the backup file should be stored and transferred confidentially
[^3]: Same source; `hermes profile export <name> <file.tar.gz>` / `hermes profile import`: scoped to a single profile, in `.tar.gz` format, with credentials stripped for safe sharing
[^4]: Same source; the manual alternative `rsync -av --exclude='hermes-agent' ~/.hermes/ newmachine:~/.hermes/`, excluding the code repo
