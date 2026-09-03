---
title: "Your First Move from OpenClaw to Hermes Agent: A Step-by-Step Walkthrough"
description: "Hermes comes with an official move-in command called hermes claw migrate. It can bring over your memory, your SOUL.md, and the skills you wrote yourself. Password-type stuff is left behind by default. Before it actually does anything, it saves you a backup first. You can do a dry-run first (a preview that changes nothing) to see exactly what it will touch — but if your bot is live, the dry-run gets blocked first."
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

When you switch tools, the thing that usually hurts isn't "having to learn a new screen." It's that **the stuff you built up in the old tool won't come with you.**

Think about it. You might have spent months slowly tuning your `SOUL.md` (the agent's "personality file," which decides how it talks and behaves), plus everything the agent remembers about you, plus the skills you wrote yourself (a skill is just one thing you taught it to do). If those can't come across, you're basically starting over.

Good news: Hermes already gives you an official "move-in command," and most of that stuff can come straight over[^1].

This page only teaches you **how to move**, one step at a time. If you're still deciding "should I even move at all?", go read [how Hermes Agent differs from OpenClaw](/concepts/龍蝦殺手/) first. But here are two things to put your mind at ease: first, a feature that both sides already have is not a reason to move; second, moving is "copy a version over," not "cut and paste" — after you're done, your original OpenClaw is still right there, untouched.

## Step 1: Let it "rehearse" first, to see what it plans to bring (do NOT skip this)

In your terminal (that black-and-white window where you type commands), type this line:

```bash
hermes claw migrate --dry-run
```

The `--dry-run` part means "dry run" — think of it as a rehearsal: it **only tells you what it plans to do, and won't actually touch anything**[^1].

After it runs, the very top of the screen prints a "settings summary." We actually ran this on a Mac (macOS, version v0.17.0), and this is what we saw[^2]:

```text
◆ Migration Settings
  Source:      /Users/你的帳號/.openclaw
  Target:      /Users/你的帳号/.hermes
  Preset:      full
  Overwrite:   no (skip conflicts)
  Secrets:     no
```

Those five short lines are actually the most important information in this whole thing. In plain terms:

- `Source`: where it's copying from — your old OpenClaw folder.
- `Target`: where it's copying to — your new Hermes folder.
- `Preset` (which bundle it uses): defaults to `full`, explained in a moment.
- `Overwrite` (what to do about same-named files): `no` means don't overwrite, just skip.
- `Secrets` (password-type stuff): `no` means don't bring it.

Notice one thing that looks contradictory right away: **the preset is `full`, yet `Secrets` is still `no` (not brought over).** These two don't actually conflict — the "should secrets come along?" section below will make it clear.

**Why must you rehearse first?** Because the real move actually changes your Hermes settings. See the "list of what it plans to do" clearly first, so if the result later isn't what you expected, you'll know which step went wrong instead of being totally lost.

### A small trap: if your bot is live, this rehearsal gets blocked first

First, a word: **gateway** (the layer that lets your bot receive and send messages — think of it as your bot's "switchboard").

If your Hermes gateway is running, and someone is actually talking to your bot (an "active connection"), then `--dry-run` won't obediently print the list. Instead it pops up the text below and stops there waiting for you[^2]:

```text
✗ Hermes gateway is running with active connections: telegram
  Migrating bot tokens while the gateway is active will cause conflicts
  (Telegram, Discord, and Slack only allow one active session per token).
  Recommendation: stop the gateway first with 'hermes gateway stop'.

Continue anyway? [y/N]:
  Migration cancelled. Stop the gateway and try again.
```

(What that English says: it detected the gateway is still on and Telegram has an active connection; moving your bot's token in that state will cause problems, because services like Telegram, Discord, and Slack only allow one connection per token at a time; so it recommends you stop the gateway first with `hermes gateway stop`.)

While we're here, one more word: **token** (a "pass-key" for your bot — the system uses it to recognize that this is your bot).

There are two things worth watching out for here.

First, this check blocks even a "just a rehearsal" `--dry-run` — even though a rehearsal wouldn't touch any token, it still stops you.

Second, an easy trap to fall into: **when it blocks you, the "exit code" it reports is actually 0.** One more word here: the **exit code** is a number a command hands back when it finishes; by convention `0` means "finished fine," and anything other than 0 means "something went wrong." That's the problem: it clearly blocked you and printed not a single line of the list, yet it reports `0` (as if it succeeded). This is the same bug as `hermes doctor` and `hermes security audit` (see [what hermes doctor actually looks like when it runs](/troubleshoot/hermes-doctor/)). So if you're running this inside an automation script, **judge by the text it prints, not by that exit code** — otherwise your script will wrongly assume the preview finished successfully.

If you hit this block, just do what it suggests: run `hermes gateway stop` to shut the gateway down; or you can just answer `y` at that prompt to keep previewing (a dry-run is only a rehearsal — it won't actually write anything).

> 📝 **The second half of this section is still missing**: once the gateway is stopped and the rehearsal runs cleanly, we don't yet have a real screenshot of what the full move list looks like (what can move, what can't, and what gets archived).
> [Help us fill it in](https://github.com/hansai-art/hermesagent.download/edit/main/knowledge/migrate/migrate-from-openclaw.md).

## Step 2: Actually do the move

Once the rehearsal is clear and looks fine, drop the `--dry-run` and run it for real:

```bash
hermes claw migrate
```

This is an "interactive" flow — meaning it asks you questions as it goes, and you just answer along. Officially, it brings over these things[^1]:

| This thing | Where it goes |
|---|---|
| `SOUL.md`, `MEMORY.md`, `USER.md` | Converted into Hermes's own memory system |
| command allowlist (the list of commands it's allowed to run) | The matching Hermes setting |
| Compatible messaging settings like `TELEGRAM_ALLOWED_USERS` | The matching Hermes setting |
| Your original OpenClaw skills | The `~/.hermes/skills/openclaw-imports/` folder |

**How do you confirm the move worked?** After it's done, start `hermes`, then ask it something that "only the old environment would know." For example, a work habit you told it before, or some preference you set. If it can answer, your memory came across successfully. That's your success check.

## Should the password-type stuff come along too?

Here's the bottom line first: **neither of those two bundles will bring your password-type stuff.** So you don't need to pick a specific bundle just to "avoid" the passwords.

The "password-type stuff" here is called secrets in the original (sensitive data you can't leak, like tokens and API keys). The CLI (the command-line tool — those `hermes ...` commands you type in the terminal) says it word-for-word: "Neither preset imports secrets," and `--migrate-secrets` is "Required even under `--preset full`" (even if you use the full bundle, you still have to add this flag yourself for secrets to move)[^2]. So that contradictory-looking thing from before — `Preset: full` paired with `Secrets: no` — means exactly this: the bundle is full, but passwords still don't move.

So what's the difference between the two bundles? The difference is **not the passwords** — it's "whether to also bring the password-related *settings items* along":

- `user-data` brings: soul, workspace-agents, memory, user-profile, messaging-settings, command-allowlist, skills, tts-assets, and archived data.
- `full` is `user-data` plus, on top, secret-settings (the password-related settings items)[^1].
- The default is `full`[^2].

If you don't even want the "password-related settings items," you can specify the `user-data` bundle like this:

```bash
hermes claw migrate --preset user-data   # 連 secret 相關設定項都不要
```

Conversely, if you **really do want the passwords themselves to come too**, you have to add this flag explicitly (a flag is that `--xxx` you tack onto a command to switch some feature on or off):

```bash
hermes claw migrate --migrate-secrets
```

**Two sources say different things here, so go by whatever your own computer's dry-run shows.** The official SKILL.md says it only moves "a small allowlisted set of Hermes-compatible secrets, currently: `TELEGRAM_BOT_TOKEN`"[^1]; but the v0.17.0 version installed on our machine says, in its `--help`, "Include allowlisted secrets (TELEGRAM_BOT_TOKEN, API keys, etc.)"[^2]. The difference between them: is it "only the Telegram token," or "do API keys count too"?

Until you've confirmed it for yourself, **assume the bigger scope**: that is, if you add `--migrate-secrets`, treat it as if even API keys might get copied over. Better to overestimate what gets copied than underestimate — underestimating is the more dangerous mistake. To know what your machine will actually move, run `--dry-run` and look at the `Secrets:` line and the list it prints.

This "you have to say it out loud before secrets move" design is deliberate on the maker's part: copying secrets from one tool to another is inherently risky, so it makes you nod yes yourself.

## If the move breaks something, you can roll back

Relax — before it actually applies anything, Hermes **by default packs your entire `~/.hermes/` folder into a backup first** (think of it as a "restore point," like a save file in a game), and puts it in the `~/.hermes/backups/` folder. Later, if you need to, you can restore it with `hermes import`[^2]. This is built-in default behavior; you don't add any parameter — it saves this for you automatically.

If you want to skip this backup (not recommended):

```bash
hermes claw migrate --no-backup
```

Knowing "there's a restore point sitting right there" is far more useful than any verbal promise that "moving over is totally safe" — because even if the move really does break, you've still got a way back.

## Other parameters you might use

**What to do when skills have the same name** (i.e., there's an old and a new skill with the same name). The default is to just skip and not touch it[^2]:

```bash
hermes claw migrate --skill-conflict rename   # skip(預設) / overwrite / rename
```

(Those three options: `skip` skips it, `overwrite` overwrites it directly, `rename` gives it a new name and keeps both copies.)

**Force-overwrite files that already exist**:

```bash
hermes claw migrate --overwrite
```

The description of this flag is written slightly differently in two places: `--help` says that without it, when there's a conflict it will "refuse to apply when the plan has conflicts" (if the plan has any conflict, reject the whole batch and don't apply); but the dry-run summary prints it as `Overwrite: no (skip conflicts)` (skip the conflicting items). So whether it's "stop the whole batch on any conflict" or "skip conflicting items one by one," the most reliable way to know is to run `--dry-run` once yourself and see what the list on your machine actually says[^2].

**Your OpenClaw isn't in the default spot** (by default it looks for the `~/.openclaw` folder). If yours is installed somewhere else, use this to tell it the path:

```bash
hermes claw migrate --source /custom/path/.openclaw
```

**Copy the workspace instruction file to a path you specify** (workspace just means your "work area" folder):

```bash
hermes claw migrate --workspace-target /absolute/path
```

## Three things to do after the move

1. **Set up your API keys again**: apart from the Telegram token, none of the password-type stuff comes with you, so you have to set it up again yourself. How: see [model provider and API key setup](/en/config/model-provider/).
2. **Check that your skills actually work**: your OpenClaw skills get put in `~/.hermes/skills/openclaw-imports/`. Note that "compatible format" does not mean "identical behavior," so it's best to try each one.
3. **If you use Telegram**, check that the allow-list (who's allowed to use your bot) came across too. How: see [common Telegram pitfalls](/en/troubleshoot/telegram/).

## FAQ

### I'm installing Hermes for the first time — do I need to run the move command myself?

Not necessarily. If, during install, it detects OpenClaw on your computer, the install flow usually just pops up and asks whether you want to move — you may not need to run the command by hand at all.

### Can I still use my original OpenClaw after the move?

Yes. To say it once more: moving is "copy," not "move" — your `~/.openclaw` folder does not get deleted. It's best to keep it around and wait until you've confirmed everything on the Hermes side is fine before dealing with the old one.

Once you've confirmed there are no problems, there's also an official command dedicated to "wrapping up." Its job is to archive the scattered OpenClaw folders so your state isn't stuck half in the new place and half in the old[^2]:

```bash
hermes claw cleanup --dry-run   # 先看它打算封存哪些目錄
hermes claw cleanup             # 確認後才真的封存
```

Note: it **archives** (tucks away, files off), it **does not delete**. It also supports `--source` for specifying a path.

### When memory comes across, will its formatting get messed up?

The official move command does format conversion for you[^1]. But because the two systems work with memory in fundamentally different ways, the way it looks after conversion may be a bit different from what you're used to.

> 📝 **Real experience is missing here too**: whether memory is complete after conversion, whether anything obvious got dropped — only someone who's actually done the move can say for sure.
> [Contributions welcome](https://github.com/hansai-art/hermesagent.download/edit/main/knowledge/migrate/migrate-from-openclaw.md).

## Next steps

- Still deciding whether to move → [how Hermes Agent differs from OpenClaw](/concepts/龍蝦殺手/)
- Set up your model again → [model provider and API key setup](/en/config/model-provider/)
- Reconnect Telegram → [common Telegram pitfalls and fixes](/en/troubleshoot/telegram/)
- See which official skills exist → [the full skills catalog](/skills/catalog/)

[^1]: NousResearch/hermes-agent, OpenClaw Migration SKILL.md (preset contents, secrets allowlist original text "currently: TELEGRAM_BOT_TOKEN"), accessed 2026-07-29: https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/migration/openclaw-migration/SKILL.md

[^2]: Local hands-on testing of `hermes claw --help`, `hermes claw migrate --help`, `hermes claw cleanup --help`, and `hermes claw migrate --dry-run` (macOS, v0.17.0, 2026-07-29). The summary block, the abort message for active gateway connections, and the exit code 0 are all actual output; home-directory paths have been substituted. Official docs: https://hermes-agent.nousresearch.com/docs