---
title: "HTTP 429 Too Many Requests: your provider is rate-limiting you, and retrying won't help"
description: "429 means the model provider is throttling you — not a Hermes bug. Hermes auto-retries then falls back, but when the provider keeps blocking you need a different fix: multi-key rotation, plan upgrade, or switching providers. Includes real Gemini/z.ai cases."
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

The error string you're seeing:

```text
HTTP 429 Too Many Requests
429 rate limit exceeded
Rate limited by provider
```

**First, get one thing straight: 429 is not a Hermes bug — it's the model provider throttling you**[^1]. Your API key, config, and network are all fine. The provider (OpenRouter, Gemini, z.ai, OpenAI…) is rejecting requests that come too fast, based on your plan or its current load. So "reinstall Hermes" or "fix the key format" are dead ends.

## What Hermes already does for you

When an API call fails, Hermes doesn't give up immediately — it **retries automatically, 3 times by default** (`agent.api_max_retries`), and only activates fallback once retries are exhausted[^2].

So an occasional 429 you'll never notice — it's swallowed. **If you're seeing 429, the provider is throttling you persistently** — and retrying won't help, because every retry hits the same wall. You need a different approach.

## Fix it in this order

### 1. Wait a bit and retry (easiest)

429 is often just too many requests in a short window. Wait a few dozen seconds to a few minutes and send again — it usually clears[^1]. The official first recommendation is "wait and retry".

**Success check**: if the same request goes through when resent later, it was a simple short-term overage — no need to go further.

### 2. Temporarily switch provider (no config change)

If you have a key with another provider, switch via the command line without touching your long-term config[^1]:

```bash
hermes chat --provider <other-provider>
```

This is the fastest path to "make it work right now". Close the CLI and you're back to your normal config.

### 3. Rotate multiple keys (the real fix for heavy users)

If you hit 429 **often**, the root cause is that a single key's quota isn't enough for your usage. Hermes supports **multiple keys for the same provider with automatic rotation**, spreading requests across them[^2]:

```yaml
credential_pool_strategies:
  openrouter: round_robin
```

There are four rotation strategies[^2]:

| Strategy | Behavior |
|---|---|
| `round_robin` | Cycle through each key (most common) |
| `fill_first` | Exhaust the first key before moving on |
| `least_used` | Pick the least-used key |
| `random` | Random |

Put the keys in `.env` (secrets always go there — see [config.yaml reference](/en/config/config-yaml-reference/)). This turns "one pipe" into "several in parallel", which is especially effective for long-running agents.

### 4. Upgrade your provider plan

If none of the above holds up, your usage has simply outgrown your plan's ceiling — upgrading a paid tier usually raises the rate limit directly[^1].

### 5. Switch model or provider

Some providers throttle hard at peak hours. Switching to another provider, or a less congested model, is also one of the official fixes[^1].

## A few real cases (find yours)

Reported 429s don't all have the same root cause:

- **Gemini shows quota is fine but still throws 429** — the `google-gemini-cli` provider triggers 429 while `gquota` shows remaining quota. This is a mismatch between the provider's accounting and its actual throttling; waiting or key rotation works better here.
- **z.ai throttles at peak hours** — the `zai/glm` series rate-limits Hermes during peak times; off-peak or multi-key rotation helps.
- **HTTP 529 Overloaded** — looks like 429 but is different: 529 means the provider's **servers are overloaded overall** (not throttling you specifically). Retrying hits the same wall; the fix is the same — wait, or switch provider. MiniMax has shown repeated 529s.

## FAQ

### Can I just set `api_max_retries` very high?

Not recommended. When 429 persists, cranking up retries just hits the same wall harder, and can get you flagged for abuse. The root cause is quota — the fix is key rotation or a plan upgrade, not more retries[^2].

### Is 429 the same as "the call silently hangs"?

No. Hanging until the stale timeout (`HERMES_API_CALL_STALE_TIMEOUT`, default 90 seconds) is usually a connection or streaming issue, not throttling[^2]. A 429 returns an explicit error code.

### How do I tell 429 from a misconfigured key?

A bad key returns 401/403 (unauthorized), not 429. A 429 means the key is correct — you're just going too fast. For key problems, see [API key not set](/en/troubleshoot/api-key-not-set/).

## Next steps

- Where to put multiple keys and how to configure them → [config.yaml reference](/en/config/config-yaml-reference/)
- The key isn't being read at all (401/403) → [API key not set](/en/troubleshoot/api-key-not-set/)
- Blocked because the conversation is too long → [context length exceeded](/en/troubleshoot/context-length-exceeded/)

[^1]: Nous Research, FAQ (Rate limiting / 429) — https://hermes-agent.nousresearch.com/docs/reference/faq (accessed 2026-07-27). 429 = "you've exceeded your provider's rate limits"; recommended actions: wait and retry, upgrade plan, switch model or provider, `hermes chat --provider <alternative>`.
[^2]: Nous Research, Configuration — https://hermes-agent.nousresearch.com/docs/user-guide/configuration (accessed 2026-07-27). `agent.api_max_retries` defaults to 3 (fallback activates only after retries are exhausted); `credential_pool_strategies.<provider>` supports fill_first / round_robin / least_used / random multi-key rotation; `HERMES_API_CALL_STALE_TIMEOUT` defaults to 90s for non-streaming stall detection.
