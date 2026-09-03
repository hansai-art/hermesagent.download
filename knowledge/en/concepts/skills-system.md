---
title: "The Skills System: How an Agent Grows Its Own Abilities From Experience"
description: "Skills aren't features a developer hard-coded in. They're playbooks the agent grows for itself, out of its own wins and mistakes. Understand this, and you'll understand what Hermes really means by 'gets smarter the more you use it.'"
date: 2026-07-24
subcategory: "skills"
hermes_version: ">=2026.5"
last_verified: 2026-07-24
human_reviewed: false
translationKey: skills-system
upstream_refs:
  - "https://hermes-agent.nousresearch.com/docs/user-guide/features/skills"
tags:
  - "skills"
  - "concepts"
status: "published"
---

One thing first, to make this easier to read: when this article says "agent," it just means Hermes, the AI assistant that does things for you.

"Gets smarter the more you use it" sounds like a marketing line. But with Hermes, it points at something very concrete: **the agent saves the approaches it figures out as skills, and the next time a similar task comes up, it just reuses them**.

Put another way, a skill is a "playbook." The first time it does something, it writes down the steps as it goes. The next time the same thing comes up, it follows the playbook instead of feeling its way through all over again.

Skills are Hermes's "procedural memory." That term sounds technical, but it's simple: what it remembers isn't a list of separate facts, it's **a whole procedure for "how to do this thing."** And that procedure only gets read in when it's relevant; the rest of the time it takes up no space[^1].

(By the way: "takes up no space" here means it doesn't eat into how much the agent can hold in its head at once. The industry calls that capacity tokens. Think of it as "how much text it can look at at the same time" — the more it has to look at, the slower and more expensive it gets. So anything it can leave out, it leaves out.)

## When does an agent grow a skill

Hermes uses a tool called `skill_manage` to create skills. (A tool here is a "button" the agent can press on its own; pressing it makes something happen.) It usually creates a skill at moments like these[^2]:

- After finishing a complex task (5 or more tool calls, meaning several steps in a row)
- After hitting an error or a dead end, then working its way out
- After discovering a workflow that isn't obvious at first glance
- After you corrected how it did something

In other words, **it learns from both "wins" and "mistakes."** Correct it once, and that lesson can become a skill, so it won't make the same mistake again. What this means for you in practice: spend the time to teach it once, and you usually don't have to teach it twice.

The actions for managing skills include `create` (make a new one), `patch` (a small fix, which the docs prefer), `edit` (a bigger change), and `delete` (remove one)[^3].

Just like with memory, you can put a gate in place: set `skills.write_approval: true`, and every time it wants to write a skill, it first parks the draft in a folder at `~/.hermes/pending/skills/` and waits for your OK before it takes effect[^4]. (`~` is your own home directory — the personal space on your computer that belongs to you; `~/.hermes/` is where Hermes keeps its own stuff.)

## What a skill looks like

A skill is just a file named `SKILL.md`. At the top it has a fixed-format block of settings called frontmatter — think of it as a "info card" at the very top of the file, labeling what this skill is called and what it's for. It looks like this[^5]:

```yaml
---
name: my-skill
description: 簡短描述(≤60 字元)
version: 1.0.0
platforms: [macos, linux] # 選填：限定作業系統
metadata:
  hermes:
    tags: [category, tags]
    requires_toolsets: [terminal]
---
```

(That format is called YAML — a way of writing settings that's readable by both people and machines, using colons and indentation to show "what maps to what." You don't need to be able to write it right now; just being able to roughly follow what it's saying is enough.)

The main text below the info card is written in a fixed order, in four sections: **When to Use → Procedure → Pitfalls → Verification**[^6].

You'll notice this structure is almost identical to a good instruction manual: first say when to use it, then walk through it step by step, warn about the traps that are easy to fall into, and finally show how to check you did it right. The reason is simple — a skill is, at bottom, a playbook the agent writes for itself.

Skills live in a folder at `~/.hermes/skills/`, split into subfolders by category[^7]. A skill isn't necessarily just one file, either; it can also carry folders like `references/`, `templates/`, `scripts/`, and `examples/`[^8].

## Bundled vs optional

- **Bundled skills**: installed together with Hermes, automatically placed into `~/.hermes/skills/`. When you update later, the ones you haven't touched update automatically; **the ones you've changed are protected and won't be overwritten**[^9]. (This is a thoughtful touch: your customizations don't get wiped out by a single update.)
- **Optional skills**: you install these yourself with a command, for example `hermes skills install official/security/1password`[^10].

If you want to start from a blank slate with zero bundled skills, you can add a parameter at install time. (The line below is the official install script, and the address is the official domain. A "script" is a pre-written string of commands that runs itself the moment you paste it in.)

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash -s -- --no-skills
```

Or opt out afterward with `hermes skills opt-out`[^11].

## Progressive disclosure: why lots of skills still don't eat tokens

When you have a lot of skills, Hermes doesn't cram them all into its head. It uses a trick called progressive disclosure, loading them in three levels[^12]:

| Level | Action | Cost |
|---|---|---|
| Level 0 | List every skill's name and description | ~3k tokens |
| Level 1 | Load one skill's full content | Varies |
| Level 2 | Load a specific reference file inside a skill | Varies |

Here's an analogy: it's like keeping a very thin "table of contents" on your desk, listing only each skill's name and roughly what it does (that's Level 0, costing about 3k tokens). Only when it actually needs a skill does it pull out that whole manual and read it (Level 1); and if the manual points to some appendix, it goes and reads that appendix only when needed (Level 2).

What this means for you in practice: **even if you install a hundred skills, it won't slow down day to day**, because most of the time it's only carrying around that thin table of contents.

## Skills Hub: not just the ones it grows itself

Besides the skills the agent builds itself, you can also install ready-made ones that other people have made, from the community. Hermes's Skills Hub is a place that gathers several sources together[^13]:

```bash
hermes skills browse                    # 瀏覽全部
hermes skills search kubernetes         # 搜尋
hermes skills inspect openai/skills/k8s # 安裝前預覽
hermes skills install official/security/1password
```

(These are commands you type into a terminal. The terminal is that text-only, black window where you type and it does as told; the industry calls this way of "getting things done by typing commands" a CLI.)

The sources include official (`official`, trusted out of the box), a public catalog from the company Vercel (`skills-sh`), code repositories (repos) on GitHub, community marketplaces, and more[^14].

⚠️ **Every skill installed from the Hub goes through a security scan first**[^15]. This matters, and here's why: a skill is a procedure that the agent actually "executes." Installing a skill of unknown origin is like letting a piece of unfamiliar code run on your computer. So build the habit — using `inspect` to look at the contents before installing is a good way to protect yourself.

Skills also follow an open standard called **agentskills.io**[^16]. (An open standard means "a shared format everyone has agreed on.") The upside: the same skill can be carried between, and shared across, different agent systems, as long as they're all compatible with this standard.

## Teach it a new skill

Besides letting it learn on its own, you can also actively tell it to learn:

```text
/learn the REST client in ~/projects/acme-sdk
/learn https://docs.example.com/api/quickstart
/learn how I just deployed the staging server
```

The `/learn` command has it distill a reusable skill out of a piece of code, a document, or something you just did[^17].

## How is this different from memory

These two are easy to mix up, but one sentence sorts them out:

- **Memory** remembers "facts": who you are, what your project looks like (small in content, and always resident in its head)
- **Skills** remember "how to do things": a whole operating procedure (possibly large in content, loaded only when needed)

Put the two together, and you get what the docs call "closed-loop learning": experience turns into skills and memories that get stored, are useful next time, and get corrected along the way as they're used. It's like a person taking notes as they work, getting more fluent the more they do.

## FAQ

### Will the agent build a pile of skills on its own, out of control?

No. It has trigger conditions (usually only after finishing a complex task or resolving an error), so it doesn't build one every time you say a sentence. If you're really uneasy, you can turn on the `write_approval` mentioned earlier, so every write gets reviewed by you first.

### Can skills be shared with a team?

Yes. Publish a skill with `hermes skills publish`, or set `external_dirs` (extra directories) to point at a shared folder everyone uses[^18].

### The bundled skills take up too much and I want to clear them out?

Use `hermes skills opt-out --remove`, and it will delete the bundled skills you haven't changed[^19]. (The ones you've changed yourself won't be touched.)

## Next steps

- The other kind of memory (fact memory) → [Memory System](/en/concepts/memory-system/)
- See the full catalog of all 173 official skills → [Skills Catalog](/skills/catalog/)
- Connect external tools (MCP) → [Recommended MCP](/en/integrations/recommended-mcp/)

[^1]: Nous Research, Skills：https://hermes-agent.nousresearch.com/docs/user-guide/features/skills (2026-07-24 存取)。技能是程序性記憶，依進步揭露只在相關時載入
[^2]: 同上，skill_manage 建立技能的時機：完成複雜任務(5+ 工具呼叫)、解開錯誤、發現非顯而易見工作流、被使用者糾正
[^3]: 同上，管理動作：create、patch(偏好)、edit、delete
[^4]: 同上，skills.write_approval:true 時所有寫入暫存於 ~/.hermes/pending/skills/ 待審
[^5]: 同上，SKILL.md frontmatter:name、description(≤60 字元)、version、platforms、metadata
[^6]: 同上，內容固定順序：When to Use → Procedure → Pitfalls → Verification
[^7]: 同上，技能存於 ~/.hermes/skills/ 依分類分子目錄
[^8]: 同上，一個技能可帶 references / templates / scripts / examples / assets 等資料夾
[^9]: 同上，內建技能隨安裝自動種入；更新時使用者改過的受保護不覆蓋
[^10]: 同上，選配技能以 hermes skills install official/<category>/<skill> 安裝
[^11]: 同上，--no-skills 從零開始；hermes skills opt-out 事後退出
[^12]: 同上，進步揭露三層：Level 0 列清單(約 3k token)→ Level 1 完整內容 → Level 2 特定參考檔
[^13]: 同上，Skills Hub 指令 browse / search / inspect / install
[^14]: 同上，Hub 來源：official、skills-sh(Vercel)、github、社群市集等
[^15]: 同上，所有 Hub 安裝都會過安全掃描
[^16]: 同上，技能遵循 agentskills.io 開放標準，可跨相容 agent 系統攜帶
[^17]: 同上，/learn 從程式碼、文件或剛完成的事提煉出可重用技能
[^18]: 同上，hermes skills publish 發佈技能；external_dirs 指向共用技能目錄
[^19]: 同上，hermes skills opt-out --remove 刪除使用者未改過的內建技能