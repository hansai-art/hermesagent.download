---
title: "Seeing an HTTP 429 error? That's your provider slowing you down — Hermes isn't broken"
description: "A 429 means the company that gives you the AI model thinks you're sending requests too fast, so it's blocking you for a moment. This is not a Hermes bug. Hermes retries on its own and switches to a backup automatically, but if the provider keeps blocking you, you need a different move: put in several keys and rotate them, upgrade your plan, or switch providers. Includes real Gemini and z.ai examples."
date: 2026-07-27
subcategory: "api"
hermes_version: ">=2026.5"
last_verified: 2026-07-27
human_reviewed: false
upstream_refs:
  - "https://hermes-agent.nousresearch.com/docs/reference/faq"
  - "https://hermes-agent.nousresearch.com/docs/user-guide/configuration"
tags:
  - "429"
  - "rate-limit"
  - "api"
  - "troubleshoot"
status: "published"
---

You might see these error words on your screen:

```text
HTTP 429 Too Many Requests
429 rate limit exceeded
Rate limited by provider
```

Let's unpack that. The "429" here is a number. When one computer talks to another, they often report the current situation using numbers, and the number "429" means: "You're sending too fast — slow down."

**So the first thing to get straight: 429 is not Hermes breaking. It's the company that provides the AI model slowing you down**[^1].

The word "provider" here just means the company that lets you use the AI model, like OpenRouter, Gemini, z.ai, or OpenAI. Your API key (a key that proves you're allowed to use the service), your settings, and your internet are all fine. The provider is simply blocking your too-frequent requests, based on the plan you bought or on how busy it is right now.

Because this really isn't a Hermes problem, moves like "reinstall Hermes" or "change how the key is written" are wasted effort.

## What Hermes already does for you

First, one term. When we say "one call" here, it means Hermes going out to ask the provider for one answer.

When a call fails, Hermes doesn't give up right away. It **retries on its own, 3 times by default**. That number is controlled by a setting called `agent.api_max_retries`. Only after all 3 tries fail does it turn on its backup (a backup means an alternate route — for example, switching to another provider to keep going)[^2].

So if you only bump into a 429 once in a while, you usually never even notice — Hermes quietly handles it.

**The other way around: if you actually see a 429, it means the provider is blocking you continuously.** In that case, retrying doesn't help. Every retry is just you hitting the same wall again. This is when you need to change your approach.

## Fix it in this order, step by step

### 1. Wait a moment, then try again (easiest)

A 429 is often just because you sent too many requests in a very short time. Wait a few dozen seconds, or even a few minutes, then send again — it usually clears[^1]. The first thing the official docs suggest is exactly this: "wait and retry".

**How to confirm it worked**: send the same request again a little later, and if it goes through normally, it just means you sent too much in a short window. No need to keep fiddling.

### 2. Temporarily switch to another provider (without changing your settings)

If you happen to have a key with another provider, you can switch to it temporarily from the "command line", without touching your long-term settings[^1].

(The "command line" here is the window where you type commands — usually a screen that's black background with white text.)

```bash
hermes chat --provider <other-provider>
```

This is the fastest route to "I need it working right now". Once you close that command-line window, everything goes back to your original settings — no changes are left behind.

### 3. Put in several keys and rotate them (the real fix — heavy users must read this)

If you're hitting 429 **often**, the real root cause is: "A single key's quota isn't enough for you." (Quota means the amount that key is allowed to use within a period of time.)

Hermes supports a trick: **for the same provider, you can plug in several keys and let it use them in turn automatically**, spreading your requests out instead of piling them all onto one key[^2].

The setting goes in a kind of file called YAML. (YAML is a format for writing settings; it uses indentation and colons to record things, and looks a lot like a bulleted list.)

```yaml
credential_pool_strategies:
  openrouter: round_robin
```

There are four ways to take turns[^2]:

| Strategy | What it does |
|---|---|
| `round_robin` | One key after another, in turn (the most common choice) |
| `fill_first` | Use the first key until it's full, then move to the next |
| `least_used` | Each time, pick the key that's been used the least |
| `random` | Pick a key at random |

Those keys go into a file called `.env`. (`.env` is a file made specifically for holding secrets like keys and passwords; all secrets go here — see [config.yaml reference](/en/config/config-yaml-reference/).)

The idea is like this: you used to have "one water pipe" supplying water, and now you switch to "several pipes side by side, supplying together." This is especially effective for an agent that has to run for a long time (an agent is an AI helper that carries out many steps in a row on its own).

### 4. Upgrade your provider plan

If none of the above holds up, the answer is simple: your usage has already gone past the ceiling of your current plan. Upgrading to a higher paid tier usually raises the speed limit directly[^1].

### 5. Switch model, or switch provider

Some providers throttle especially hard during peak hours (the popular times when everyone's using them). Switching to another provider, or to a model that's less jammed, is also one of the official fixes[^1].

## A few real cases (see which one is you)

The 429s people have reported don't all come from the same root cause:

- **Gemini clearly shows quota remaining, but still throws a 429** — using the `google-gemini-cli` provider triggers a 429, yet checking `gquota` (a tool for viewing remaining quota) shows the quota isn't used up. In this case the provider's "on-paper accounting" and its "actual throttling" don't match; when this happens, waiting or rotating keys works better ([the original discussion](https://github.com/NousResearch/hermes-agent/issues/10210) is this kind of provider-side problem).
- **z.ai throttles at peak hours** — the `zai/glm` series of models rate-limits Hermes during peak times. Avoiding peak hours, or rotating several keys, helps.
- **HTTP 529 Overloaded** — this looks a lot like 429 but is actually different. A 529 means the provider's **whole server is overloaded** (it's not throttling you specifically — it just can't keep up). You can't fix this by retrying either, and the fix is the same: wait, or switch providers. MiniMax has shown repeated 529s.

## FAQ

### Can't I just set `api_max_retries` really high?

Not recommended. When the provider is blocking you continuously, turning up the retry count just makes you hit the same wall harder and more times — and it can even get you flagged as abuse. The real root cause is not enough quota. What you should do is rotate several keys or upgrade your plan, not retry frantically[^2].

### Is a 429 the same thing as "the call silently freezes"?

No. If it keeps freezing until it hits a timeout called the stale timeout (controlled by the environment variable `HERMES_API_CALL_STALE_TIMEOUT`, default 90 seconds), that's usually a connection problem or a broken data stream — not throttling[^2]. (An environment variable is a named setting inside your computer that a program reads while it runs.) A 429 is different: it clearly returns an error code for you to see.

### How do I tell whether it's a 429 or I set my key up wrong?

If you set the key up wrong, the number you get back is 401 or 403 (meaning "you don't have permission"), not 429. Seeing a 429 actually means your key is correct — you're just sending too frequently. If you suspect the key wasn't set up right, see [API key not set](/en/troubleshoot/api-key-not-set/).

## Next steps

- Where to put multiple keys and how to set them → [config.yaml reference](/en/config/config-yaml-reference/)
- The key isn't being read at all (returns 401/403) → [API key not set](/en/troubleshoot/api-key-not-set/)
- Blocked because the conversation is too long (context length) → [context length exceeded](/en/troubleshoot/context-length-exceeded/)

[^1]: Nous Research, FAQ (Rate limiting / 429) — https://hermes-agent.nousresearch.com/docs/reference/faq (accessed 2026-07-27). 429 = "you've exceeded your provider's rate limits"; recommended actions: wait and retry, upgrade plan, switch model or provider, `hermes chat --provider <alternative>`.
[^2]: Nous Research, Configuration — https://hermes-agent.nousresearch.com/docs/user-guide/configuration (accessed 2026-07-27). `agent.api_max_retries` defaults to 3 (fallback activates only after retries are exhausted); `credential_pool_strategies.<provider>` supports fill_first / round_robin / least_used / random multi-key rotation; `HERMES_API_CALL_STALE_TIMEOUT` defaults to 90s for non-streaming stall detection.
