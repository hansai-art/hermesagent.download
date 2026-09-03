---
title: "The memory system: what Hermes actually remembers, and where"
description: "MEMORY.md holds only 2200 characters and USER.md only 1375: that isn't a flaw, it's the design. Once you understand its two layers of memory, you'll know who to tell the important things to."
date: 2026-07-24
subcategory: "memory"
translationKey: memory-system
hermes_version: ">=2026.5"
last_verified: 2026-07-24
human_reviewed: false
upstream_refs:
  - "https://hermes-agent.nousresearch.com/docs/user-guide/features/memory"
tags:
  - "memory"
  - "concepts"
status: "published"
---

Let's start with the takeaway. A lot of people assume that "Hermes has memory" means it keeps every single thing you've ever said, word for word. It doesn't. And understanding what it *doesn't* remember is often more useful than understanding what it does.

Here's a one-sentence definition. "Memory" here means the small handful of key points Hermes deliberately keeps for you, so that next time you talk it still knows who you are and still remembers your project. It is not a full recording of your conversations.

(One quick term while we're here: an **agent** is the AI assistant that actually does things for you. You can just think of it as Hermes itself.)

Hermes splits its memory into two layers. One is **tiny and always carried with it**. The other is **nearly unlimited, and only opened up when needed**. Once you get how the two divide the work, you'll know which layer each thing belongs in.

## Layer one: the small, focused core memory

Hermes keeps two files in a folder on your computer called `~/.hermes/memories/`[^1].

(A note on that path first: `~` stands for your own personal user folder. The dot at the start of `.hermes` means it's a hidden folder, one you won't necessarily see in your file browser by default.)

Two units show up in the table below. A "character" is just one letter or symbol. A **token** — think of it as a "chunk of text" — is the unit an AI uses to measure how long a piece of text is. Roughly a few letters, or one word, makes one token.

| File | Limit | What it stores |
|---|---|---|
| `MEMORY.md` | 2200 characters (about 800 tokens) | environment facts, project conventions, tool quirks and workarounds, finished tasks, techniques that work[^2] |
| `USER.md` | 1375 characters (about 500 tokens) | your name, role, time zone, communication preferences, work habits, technical level[^3] |

**Why deliberately make it this small?** Because these two files have a special use: at the start of every conversation, they get stuffed in as a whole into the "system prompt," and then **they never change for the rest of that conversation**.

(Two terms to unpack here. The **system prompt** is a block of background information fed to the AI at the very start of each conversation, like its opening briefing. The Nous team calls this "put it in at the start, keep it fixed the whole way through" approach the **frozen snapshot pattern**.)

The design exists to protect a piece of performance called the **prefix cache**[^4]. The prefix cache works like this: that fixed, unchanging chunk at the start of each conversation can be computed once and remembered, so next time the AI reuses it instead of recomputing it — saving both time and money. Flip that around: if you cram too much into memory, every conversation drags a big heavy bundle along with it, which is slow and expensive.

So the logic of this layer is simple: **keep only the essentials that every conversation should know**. Big blocks of code, logs (the records a program leaves as it runs), and whole data tables get skipped outright, for exactly the reason "it's too big to put in memory"[^5].

## How the agent updates this layer

Hermes manages memory with three actions: **add**, **replace**, and **remove**[^6].

The `replace` action swaps text using "substring matching." In plain terms: it takes a short piece of text you give it, finds the exact same piece inside the file, and swaps that piece out.

Notice there is **no `read` action here**. That's because memory already gets injected into the system prompt automatically, so the agent can always "see" it — no need to go read it again[^7].

If you'd rather it not write freely, you can turn on an approval switch. To do that, edit a config file at `~/.hermes/config.yaml`.

(`.yaml` is a config file format written as "name: value", one per line, using the leading whitespace — the indentation — to show how things nest, so don't add or remove indentation carelessly.)

```yaml
memory:
  memory_enabled: true
  write_approval: false # 預設 false,自由寫入
  memory_char_limit: 2200
  user_char_limit: 1375
```

Change `write_approval` from `false` to `true`, and from then on every time the agent wants to write to memory it gets held aside first. Only after you've reviewed it with the `/memory pending` command does it actually get written to the file[^8].

(`/memory pending` is a command you type straight into the chat box. Commands like this usually start with a slash `/`.)

## Layer two: the nearly unlimited conversation archive

So where did everything that didn't fit into core memory go? **It's all still there.** It's sitting in the complete record of every conversation you've ever had.

Hermes uses a tool called `session_search` to dig through those past conversations. It queries a small database called SQLite (the file lives right at `~/.hermes/state.db`), using an FTS5 full-text index. Its capacity is "unlimited," and a single query comes back in about 20 milliseconds[^9].

(Quick note: SQLite is a lightweight database that is just a single file. An FTS5 full-text index is a technique that makes "finding a keyword inside a huge pile of text" extremely fast, like the index at the back of a book.)

There's a key feature of this layer that's easy to misread: **what it hands back is the raw messages from the database — no AI summarizing, no truncation**[^10].

(By "AI summarizing" we mean having the AI brain behind it — the **LLM**, or large language model — condense the content back down to a few sentences.)

In other words, something you said three months ago comes back **word for word**, not a version the model paraphrased from memory. That's a lot more reliable than a "summarized" version.

## What this means for you in practice

Once you understand these two layers, you'll know how to "feed" it:

- **Things you want it to remember every time** (your preferences, project conventions) → tell it explicitly, and let it write them into core memory. Since the space is small, keep it to the point.
- **Details you only need occasionally** (how you fixed some particular bug that one time) → don't bother having it memorize these. They stay in the conversation record, and you can pull them back with `session_search` when you need them.
- **A big pile of data** (an entire log, a whole file) → don't expect it to "remember" this; it won't go into memory. If you really need it, just have it read the thing on the spot.

## Memory vs. context files

Hermes has another thing that also often gets called "memory," known as context files, such as `SOUL.md` and `AGENTS.md`. The difference is[^11]:

- **Memory (MEMORY.md / USER.md)**: curated by the agent itself, capped in size, and evolves over time.
- **Context files**: maintained by hand, with fixed content — they're the settings *you* give the agent, not the things it observed on its own.

In one line: memory is "what it learned," and context files are "what you told it."

## Common questions

### If I switch computers, does my memory come with me?

Memory lives locally on this computer, at `~/.hermes/memories/`. When you switch machines, first pack it up with `hermes backup`, then import it on the new machine, and your memory moves over with it. For the full steps, see [Switching computers: moving to a new machine](/en/migrate/move-to-new-machine/).

### What happens when memory fills up?

Because there's a character limit, the agent makes its own trade-offs: using `replace` to update the old, and `remove` to clear out what's stale. That's exactly why it keeps only the essentials.

### Can I edit MEMORY.md by hand directly?

Yes — it's just a plain text file. But a heads-up: the agent may change it again next time, so your hand edits aren't guaranteed to stick around forever. For preferences that truly matter, rather than editing the file yourself, it's better to just tell the agent and let it write them in.

## Next steps

- Understand the skills system (another kind of memory) → [Skills system](/en/concepts/skills-system/)
- Your conversation got too long and blew up → [How to fix context length exceeded](/en/troubleshoot/context-length-exceeded/)
- Want the big picture first → [What is Hermes Agent](/en/concepts/what-is-hermes-agent/)

[^1]: Nous Research, Memory: memory is stored in MEMORY.md and USER.md under ~/.hermes/memories/: https://hermes-agent.nousresearch.com/docs/user-guide/features/memory (accessed 2026-07-24)
[^2]: Ibid., MEMORY.md has a 2200-character limit; records environment facts, project conventions, tool quirks, a task diary, and techniques that work
[^3]: Ibid., USER.md has a 1375-character limit; records name, role, time zone, communication preferences, work habits, technical level
[^4]: Ibid., the frozen snapshot pattern: memory is injected into the system prompt once at the start of the conversation and stays unchanged throughout, to preserve the prefix cache
[^5]: Ibid., large blocks of code, logs, and tables are "too big to put in memory" and get skipped
[^6]: Ibid., the memory tool's three actions: add, replace (substring match), remove
[^7]: Ibid., no read action: memory is injected into the system prompt automatically, so the agent can always see it
[^8]: Ibid., the memory block in config.yaml; when write_approval:true, writes are held and only saved after review with /memory pending
[^9]: Ibid., session_search queries the FTS5 full-text index in the SQLite state.db; capacity is unlimited, about 20ms
[^10]: Ibid., session_search returns the raw messages from the database, with no LLM summarization and no truncation
[^11]: Ibid., memory (curated by the agent, capped, evolving) vs. context files SOUL.md / AGENTS.md (maintained by hand, fixed content)
