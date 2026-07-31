---
title: "Migrating from OpenClaw to Hermes Agent"
description: "The official built-in hermes claw migrate brings over your memory, SOUL.md, and skills. Secrets are not migrated by default, and a restore point is snapshotted before anything is applied. Dry-run first to see exactly what will change, but note that dry-run is blocked while the gateway is running."
date: 2026-07-23
subcategory: "openclaw"
hermes_version: ">=2026.5"
last_verified: 2026-07-29
human_reviewed: false
upstream_refs:
  - "https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/migration/openclaw-migration/SKILL.md"
  - "https://hermes-agent.nousresearch.com/docs/reference/faq"
tags:
  - "openclaw"
  - "migrate"
status: "published"
---

The scariest part of switching tools isn't learning a new interface, it's **the accumulated stuff that won't come with you**: the SOUL.md you've tuned for months, the memory the agent has built up about you, the skills you wrote yourself.

The good news: Hermes ships an official OpenClaw migration command, and most of that stuff can be brought over directly[^1].

This page is only about *how* to migrate. If you're still deciding whether to, read [How Hermes Agent differs from OpenClaw](/concepts/龍蝦殺手/) first: features that exist on both sides aren't a reason to move, and migration is a copy, not a move, so your old environment stays put afterward.

## First, see what it plans to migrate (don't skip this step)

```bash
hermes claw migrate --dry-run
```

`--dry-run` **only reports, it doesn't touch anything**[^1]. It opens by printing a settings summary. Tested on this site on macOS (v0.17.0), it looks like this[^2]:

```text
◆ Migration Settings
  Source:      /Users/你的帳號/.openclaw
  Target:      /Users/你的帳號/.hermes
  Preset:      full
  Overwrite:   no (skip conflicts)
  Secrets:     no
```

Those five lines are themselves the most important information: **the default preset is `full`, but Secrets is still `no`**. The secrets section below explains why those two facts don't conflict.

**Why you must run this first**: migration touches your Hermes configuration. See the list clearly up front, so that when the outcome later isn't what you expected, you know where the problem came from.

### Gotcha: dry-run is blocked while the gateway is running

If your Hermes gateway is running and has active connections, `--dry-run` won't print the list directly. It pops up this message and stops[^2]:

```text
✗ Hermes gateway is running with active connections: telegram
  Migrating bot tokens while the gateway is active will cause conflicts
  (Telegram, Discord, and Slack only allow one active session per token).
  Recommendation: stop the gateway first with 'hermes gateway stop'.

Continue anyway? [y/N]:
  Migration cancelled. Stop the gateway and try again.
```

Two things to note. First, this check blocks even `--dry-run`, even though a dry-run wouldn't touch any token at all. Second, **its exit code is 0**, the same flaw as `hermes doctor` and `hermes security audit` (see [what hermes doctor actually looks like when you run it](/troubleshoot/hermes-doctor/)): a script that checks the exit code will think the preview ran to completion, when in fact not a single line of the list was printed. To use this in automation, judge by the output content, not the exit code.

Either follow the recommendation and run `hermes gateway stop` first, or answer `y` at the prompt to continue the preview (the dry-run won't write anything).

> 📝 **This section is still missing its second half**: once the gateway is stopped, we don't yet have a live screenshot of how the full migration plan (what can be migrated / what can't / what gets archived) is presented.
> [Help us fill it in](https://github.com/hansai-art/hermesagent.download/edit/main/knowledge/migrate/migrate-from-openclaw.md).

## Running the migration

```bash
hermes claw migrate
```

An interactive flow. Officially, it migrates the following[^1]:

| Item | Where it goes |
|---|---|
| `SOUL.md`, `MEMORY.md`, `USER.md` | Converted into Hermes's memory system |
| command allowlist | Corresponding Hermes setting |
| Compatible messaging settings such as `TELEGRAM_ALLOWED_USERS` | Corresponding Hermes settings |
| OpenClaw skills | `~/.hermes/skills/openclaw-imports/` |

**How to tell it worked**: after it finishes, start `hermes` and ask it something only the old environment would know (for example, your project conventions, or a preference you'd told it before). If it can answer, the memory migrated successfully.

## Whether to migrate secrets too

**Neither preset migrates secrets**, so there's no need to pick a preset just to avoid them. The CLI help says verbatim "Neither preset imports secrets", and `--migrate-secrets` is "Required even under `--preset full`"[^2]. That's exactly what the `Preset: full` paired with `Secrets: no` in the dry-run summary above means.

So the difference between presets isn't about secrets, it's about **whether to bring the secret-related config items along**: `user-data` covers soul, workspace-agents, memory, user-profile, messaging-settings, command-allowlist, skills, tts-assets, and archives; `full` is user-data plus secret-settings[^1]. The default is `full`[^2].

```bash
hermes claw migrate --preset user-data   # don't even bring the secret-related config items
```

If you really do want to migrate secrets, you have to add the flag explicitly:

```bash
hermes claw migrate --migrate-secrets
```

**There's a source inconsistency here, so go by the dry-run on your own machine.** The official SKILL.md says "a small allowlisted set of Hermes-compatible secrets, currently: `TELEGRAM_BOT_TOKEN`"[^1]; but v0.17.0 installed locally has `--help` saying "Include allowlisted secrets (TELEGRAM_BOT_TOKEN, API keys, etc.)"[^2]. The difference is whether it's "the Telegram token only" or "API keys count too".

Until this is confirmed, **treat it under the broader assumption**: if you add `--migrate-secrets`, assume API keys may get copied over too. Underestimating what gets copied is worse than overestimating. To confirm what your machine will actually migrate, run `--dry-run` and look at the `Secrets:` line and the list contents.

This design is deliberate: copying secrets across tools is risky behavior, and the project chose to make you state your intent explicitly.

## If something goes wrong, you can restore

Before applying, Hermes **by default packages `~/.hermes/` into a restore point** and puts it in `~/.hermes/backups/`, which you can later restore with `hermes import`[^2]. This is the default behavior, no flag needed.

To skip this backup (not recommended):

```bash
hermes claw migrate --no-backup
```

Knowing there's a restore point is more useful than any assurance that "the move is safe": if it breaks, there's a way back.

## Other common flags

How to handle skills with the same name; the default is to skip[^2]:

```bash
hermes claw migrate --skill-conflict rename   # skip (default) / overwrite / rename
```

Overwrite existing files:

```bash
hermes claw migrate --overwrite
```

The description of this flag is worded differently in two places: `--help` says that without it the tool will "refuse to apply when the plan has conflicts", while the dry-run summary prints `Overwrite: no (skip conflicts)`. Whether conflicts stop the whole batch or get skipped item by item, running `--dry-run` once to see your machine's list is the most reliable answer.

OpenClaw isn't in the default location (it looks for `~/.openclaw` by default):

```bash
hermes claw migrate --source /custom/path/.openclaw
```

Copy the workspace instruction files to a specified path:

```bash
hermes claw migrate --workspace-target /absolute/path
```

## Three things to do after migrating

1. **Reconfigure your API keys**: aside from the Telegram token, other secrets don't come along. See [Model providers and API key setup](/en/config/model-provider/)
2. **Check that your skills work properly**: OpenClaw skills are placed in `~/.hermes/skills/openclaw-imports/`, and format compatibility doesn't mean behavior is identical
3. **If you have Telegram connected**, confirm the allowlist came over; see [Common Telegram pitfalls](/en/troubleshoot/telegram/)

## FAQ

### Do I need to run this manually on a fresh Hermes install?

If the installer detects an OpenClaw environment during setup, the install flow usually prompts you to migrate, so you don't necessarily have to run it manually.

### Can I still use OpenClaw after migrating?

Yes. Migration is a copy, not a move, so `~/.openclaw` isn't deleted. It's best to keep it around and only deal with it once you've confirmed Hermes is working fine.

Once you've confirmed everything's fine, there's an official command dedicated to wrapping up, whose purpose is to archive the scattered OpenClaw directories so state isn't split across two places[^2]:

```bash
hermes claw cleanup --dry-run   # first see which directories it plans to archive
hermes claw cleanup             # only archive for real after confirming
```

Note it **archives, it doesn't delete**, and it likewise supports `--source` to specify a path.

### Will the migrated memory come out with broken formatting?

The official migration command does format conversion[^1]. But the two systems have different memory models, so the post-conversion presentation may differ.

> 📝 **Awaiting real-world experience**: how complete the memory is after conversion, and whether there are noticeable gaps, is something only people who've actually migrated will know.
> [Contributions welcome](https://github.com/hansai-art/hermesagent.download/edit/main/knowledge/migrate/migrate-from-openclaw.md).

## Next steps

- Still deciding whether to migrate → [How Hermes Agent differs from OpenClaw](/concepts/龍蝦殺手/)
- Reconfigure your model → [Model providers and API key setup](/en/config/model-provider/)
- Reconnect Telegram → [Common Telegram pitfalls and fixes](/en/troubleshoot/telegram/)
- See what official skills are available → [Full skills catalog](/skills/catalog/)

[^1]: NousResearch/hermes-agent, OpenClaw Migration SKILL.md (preset contents, and the secrets allowlist wording "currently: TELEGRAM_BOT_TOKEN"), accessed 2026-07-29: https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/migration/openclaw-migration/SKILL.md

[^2]: Local hands-on testing of `hermes claw --help`, `hermes claw migrate --help`, `hermes claw cleanup --help`, and `hermes claw migrate --dry-run` (macOS, v0.17.0, 2026-07-29). The summary block, the abort message for active gateway connections, and the exit code 0 are all actual output; home directory paths have been substituted. Official docs: https://hermes-agent.nousresearch.com/docs
