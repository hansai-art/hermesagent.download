---
title: "Hermes Agent 官方 Skills 全目錄（173 個）"
description: "官方 repo 的完整 skill 清單：72 個內建（bundled）與 101 個官方 optional skills，每個附原始 SKILL.md 連結。"
date: 2026-07-23
subcategory: "catalog"
hermes_version: "*"
last_verified: 2026-07-23
upstream_refs:
  - "https://github.com/NousResearch/hermes-agent/blob/main/skills/apple/apple-notes/SKILL.md"
  - "https://github.com/NousResearch/hermes-agent/blob/main/skills/apple/apple-reminders/SKILL.md"
  - "https://github.com/NousResearch/hermes-agent/blob/main/skills/apple/findmy/SKILL.md"
  - "https://github.com/NousResearch/hermes-agent/blob/main/skills/apple/imessage/SKILL.md"
  - "https://github.com/NousResearch/hermes-agent/blob/main/skills/autonomous-ai-agents/claude-code/SKILL.md"
  - "https://github.com/NousResearch/hermes-agent/blob/main/skills/autonomous-ai-agents/codex/SKILL.md"
tags:
  - "catalog"
status: "published"
---

直接列舉官方 repo 的 skills 目錄：72 個內建（bundled）加 101 個官方 optional skills。描述取自各 skill 的 SKILL.md 原文，每個都附官方來源連結。不知道先裝哪些？看[新手推薦清單](/skills/recommended-skills/)。最後檢查：2026-07-04。

## 內建 Skills（72）

### apple

-   [apple-notes](https://github.com/NousResearch/hermes-agent/blob/main/skills/apple/apple-notes/SKILL.md) Manage Apple Notes via memo CLI: create, search, edit.
-   [apple-reminders](https://github.com/NousResearch/hermes-agent/blob/main/skills/apple/apple-reminders/SKILL.md) Apple Reminders via remindctl: add, list, complete.
-   [findmy](https://github.com/NousResearch/hermes-agent/blob/main/skills/apple/findmy/SKILL.md) Track Apple devices/AirTags via FindMy.app on macOS.
-   [imessage](https://github.com/NousResearch/hermes-agent/blob/main/skills/apple/imessage/SKILL.md) Send and receive iMessages/SMS via the imsg CLI on macOS.

### autonomous-ai-agents

-   [claude-code](https://github.com/NousResearch/hermes-agent/blob/main/skills/autonomous-ai-agents/claude-code/SKILL.md) Delegate coding to Claude Code CLI (features, PRs).
-   [codex](https://github.com/NousResearch/hermes-agent/blob/main/skills/autonomous-ai-agents/codex/SKILL.md) Delegate coding to OpenAI Codex CLI (features, PRs).
-   [hermes-agent](https://github.com/NousResearch/hermes-agent/blob/main/skills/autonomous-ai-agents/hermes-agent/SKILL.md) Configure, extend, or contribute to Hermes Agent.
-   [opencode](https://github.com/NousResearch/hermes-agent/blob/main/skills/autonomous-ai-agents/opencode/SKILL.md) Delegate coding to OpenCode CLI (features, PR review).

### computer-use

-   [computer-use](https://github.com/NousResearch/hermes-agent/blob/main/skills/computer-use/SKILL.md) |

### creative

-   [architecture-diagram](https://github.com/NousResearch/hermes-agent/blob/main/skills/creative/architecture-diagram/SKILL.md) Dark-themed SVG architecture/cloud/infra diagrams as HTML.
-   [ascii-art](https://github.com/NousResearch/hermes-agent/blob/main/skills/creative/ascii-art/SKILL.md) ASCII art: pyfiglet, cowsay, boxes, image-to-ascii.
-   [ascii-video](https://github.com/NousResearch/hermes-agent/blob/main/skills/creative/ascii-video/SKILL.md) ASCII video: convert video/audio to colored ASCII MP4/GIF.
-   [baoyu-infographic](https://github.com/NousResearch/hermes-agent/blob/main/skills/creative/baoyu-infographic/SKILL.md) Infographics: 21 layouts x 21 styles (信息图, 可视化).
-   [claude-design](https://github.com/NousResearch/hermes-agent/blob/main/skills/creative/claude-design/SKILL.md) Design one-off HTML artifacts (landing, deck, prototype).
-   [comfyui](https://github.com/NousResearch/hermes-agent/blob/main/skills/creative/comfyui/SKILL.md) Generate images, video, and audio with ComfyUI — install, launch, manage nodes/models, run workflows with parameter injection. Uses the official comfy-cli for lifecycle and direct REST/WebSocket API for execution.
-   [design-md](https://github.com/NousResearch/hermes-agent/blob/main/skills/creative/design-md/SKILL.md) Author/validate/export Google's DESIGN.md token spec files.
-   [excalidraw](https://github.com/NousResearch/hermes-agent/blob/main/skills/creative/excalidraw/SKILL.md) Hand-drawn Excalidraw JSON diagrams (arch, flow, seq).
-   [humanizer](https://github.com/NousResearch/hermes-agent/blob/main/skills/creative/humanizer/SKILL.md) Humanize text: strip AI-isms and add real voice.
-   [manim-video](https://github.com/NousResearch/hermes-agent/blob/main/skills/creative/manim-video/SKILL.md) Manim CE animations: 3Blue1Brown math/algo videos.
-   [p5js](https://github.com/NousResearch/hermes-agent/blob/main/skills/creative/p5js/SKILL.md) p5.js sketches: gen art, shaders, interactive, 3D.
-   [popular-web-designs](https://github.com/NousResearch/hermes-agent/blob/main/skills/creative/popular-web-designs/SKILL.md) 54 real design systems (Stripe, Linear, Vercel) as HTML/CSS.
-   [pretext](https://github.com/NousResearch/hermes-agent/blob/main/skills/creative/pretext/SKILL.md) Use when building creative browser demos with @chenglou/pretext — DOM-free text layout for ASCII art, typographic flow around obstacles, text-as-geometry games, kinetic typography, and text-powered generative art. Produces single-file HTML demos by default.
-   [sketch](https://github.com/NousResearch/hermes-agent/blob/main/skills/creative/sketch/SKILL.md) Throwaway HTML mockups: 2-3 design variants to compare.
-   [songwriting-and-ai-music](https://github.com/NousResearch/hermes-agent/blob/main/skills/creative/songwriting-and-ai-music/SKILL.md) Songwriting craft and Suno AI music prompts.
-   [touchdesigner-mcp](https://github.com/NousResearch/hermes-agent/blob/main/skills/creative/touchdesigner-mcp/SKILL.md) Control a running TouchDesigner instance via twozero MCP — create operators, set parameters, wire connections, execute Python, build real-time visuals. 36 native tools.

### data-science

-   [jupyter-live-kernel](https://github.com/NousResearch/hermes-agent/blob/main/skills/data-science/jupyter-live-kernel/SKILL.md) Iterative Python via live Jupyter kernel (hamelnb).

### dogfood

-   [dogfood](https://github.com/NousResearch/hermes-agent/blob/main/skills/dogfood/SKILL.md) Exploratory QA of web apps: find bugs, evidence, reports.

### email

-   [himalaya](https://github.com/NousResearch/hermes-agent/blob/main/skills/email/himalaya/SKILL.md) Himalaya CLI: IMAP/SMTP email from terminal.

### github

-   [codebase-inspection](https://github.com/NousResearch/hermes-agent/blob/main/skills/github/codebase-inspection/SKILL.md) Inspect codebases w/ pygount: LOC, languages, ratios.
-   [github-auth](https://github.com/NousResearch/hermes-agent/blob/main/skills/github/github-auth/SKILL.md) GitHub auth setup: HTTPS tokens, SSH keys, gh CLI login.
-   [github-code-review](https://github.com/NousResearch/hermes-agent/blob/main/skills/github/github-code-review/SKILL.md) Review PRs: diffs, inline comments via gh or REST.
-   [github-issues](https://github.com/NousResearch/hermes-agent/blob/main/skills/github/github-issues/SKILL.md) Create, triage, label, assign GitHub issues via gh or REST.
-   [github-pr-workflow](https://github.com/NousResearch/hermes-agent/blob/main/skills/github/github-pr-workflow/SKILL.md) GitHub PR lifecycle: branch, commit, open, CI, merge.
-   [github-repo-management](https://github.com/NousResearch/hermes-agent/blob/main/skills/github/github-repo-management/SKILL.md) Clone/create/fork repos; manage remotes, releases.

### media

-   [gif-search](https://github.com/NousResearch/hermes-agent/blob/main/skills/media/gif-search/SKILL.md) Search/download GIFs from Tenor via curl + jq.
-   [heartmula](https://github.com/NousResearch/hermes-agent/blob/main/skills/media/heartmula/SKILL.md) HeartMuLa: Suno-like song generation from lyrics + tags.
-   [songsee](https://github.com/NousResearch/hermes-agent/blob/main/skills/media/songsee/SKILL.md) Audio spectrograms/features (mel, chroma, MFCC) via CLI.
-   [youtube-content](https://github.com/NousResearch/hermes-agent/blob/main/skills/media/youtube-content/SKILL.md) YouTube transcripts to summaries, threads, blogs.

### mlops

-   [lm-evaluation-harness](https://github.com/NousResearch/hermes-agent/blob/main/skills/mlops/evaluation/lm-evaluation-harness/SKILL.md) lm-eval-harness: benchmark LLMs (MMLU, GSM8K, etc.).
-   [weights-and-biases](https://github.com/NousResearch/hermes-agent/blob/main/skills/mlops/evaluation/weights-and-biases/SKILL.md) W&B: log ML experiments, sweeps, model registry, dashboards.
-   [huggingface-hub](https://github.com/NousResearch/hermes-agent/blob/main/skills/mlops/huggingface-hub/SKILL.md) HuggingFace hf CLI: search/download/upload models, datasets.
-   [llama-cpp](https://github.com/NousResearch/hermes-agent/blob/main/skills/mlops/inference/llama-cpp/SKILL.md) llama.cpp local GGUF inference + HF Hub model discovery.
-   [vllm](https://github.com/NousResearch/hermes-agent/blob/main/skills/mlops/inference/vllm/SKILL.md) vLLM: high-throughput LLM serving, OpenAI API, quantization.
-   [audiocraft](https://github.com/NousResearch/hermes-agent/blob/main/skills/mlops/models/audiocraft/SKILL.md) AudioCraft: MusicGen text-to-music, AudioGen text-to-sound.
-   [segment-anything](https://github.com/NousResearch/hermes-agent/blob/main/skills/mlops/models/segment-anything/SKILL.md) SAM: zero-shot image segmentation via points, boxes, masks.

### note-taking

-   [obsidian](https://github.com/NousResearch/hermes-agent/blob/main/skills/note-taking/obsidian/SKILL.md) Read, search, create, and edit notes in the Obsidian vault.

### productivity

-   [airtable](https://github.com/NousResearch/hermes-agent/blob/main/skills/productivity/airtable/SKILL.md) Airtable REST API via curl. Records CRUD, filters, upserts.
-   [google-workspace](https://github.com/NousResearch/hermes-agent/blob/main/skills/productivity/google-workspace/SKILL.md) Gmail, Calendar, Drive, Docs, Sheets via gws CLI or Python.
-   [maps](https://github.com/NousResearch/hermes-agent/blob/main/skills/productivity/maps/SKILL.md) Geocode, POIs, routes, timezones via OpenStreetMap/OSRM.
-   [nano-pdf](https://github.com/NousResearch/hermes-agent/blob/main/skills/productivity/nano-pdf/SKILL.md) Edit PDF text/typos/titles via nano-pdf CLI (NL prompts).
-   [notion](https://github.com/NousResearch/hermes-agent/blob/main/skills/productivity/notion/SKILL.md) Notion API + ntn CLI: pages, databases, markdown, Workers.
-   [ocr-and-documents](https://github.com/NousResearch/hermes-agent/blob/main/skills/productivity/ocr-and-documents/SKILL.md) Extract text from PDFs/scans (pymupdf, marker-pdf).
-   [petdex](https://github.com/NousResearch/hermes-agent/blob/main/skills/productivity/petdex/SKILL.md) Install and select animated petdex mascots for Hermes.
-   [powerpoint](https://github.com/NousResearch/hermes-agent/blob/main/skills/productivity/powerpoint/SKILL.md) Create, read, edit .pptx decks, slides, notes, templates.
-   [teams-meeting-pipeline](https://github.com/NousResearch/hermes-agent/blob/main/skills/productivity/teams-meeting-pipeline/SKILL.md) Operate the Teams meeting summary pipeline via Hermes CLI — summarize meetings, inspect pipeline status, replay jobs, manage Microsoft Graph subscriptions.

### research

-   [arxiv](https://github.com/NousResearch/hermes-agent/blob/main/skills/research/arxiv/SKILL.md) Search arXiv papers by keyword, author, category, or ID.
-   [blogwatcher](https://github.com/NousResearch/hermes-agent/blob/main/skills/research/blogwatcher/SKILL.md) Monitor blogs and RSS/Atom feeds via blogwatcher-cli tool.
-   [llm-wiki](https://github.com/NousResearch/hermes-agent/blob/main/skills/research/llm-wiki/SKILL.md) Karpathy's LLM Wiki: build/query interlinked markdown KB.
-   [polymarket](https://github.com/NousResearch/hermes-agent/blob/main/skills/research/polymarket/SKILL.md) Query Polymarket: markets, prices, orderbooks, history.
-   [research-paper-writing](https://github.com/NousResearch/hermes-agent/blob/main/skills/research/research-paper-writing/SKILL.md) Write ML papers for NeurIPS/ICML/ICLR: design→submit.

### smart-home

-   [openhue](https://github.com/NousResearch/hermes-agent/blob/main/skills/smart-home/openhue/SKILL.md) Control Philips Hue lights, scenes, rooms via OpenHue CLI.

### social-media

-   [xurl](https://github.com/NousResearch/hermes-agent/blob/main/skills/social-media/xurl/SKILL.md) X/Twitter via xurl CLI: post, search, DM, media, v2 API.

### software-development

-   [hermes-agent-skill-authoring](https://github.com/NousResearch/hermes-agent/blob/main/skills/software-development/hermes-agent-skill-authoring/SKILL.md) Author in-repo SKILL.md: frontmatter, validator, structure, and writing-quality principles.
-   [node-inspect-debugger](https://github.com/NousResearch/hermes-agent/blob/main/skills/software-development/node-inspect-debugger/SKILL.md) Debug Node.js via --inspect + Chrome DevTools Protocol CLI.
-   [plan](https://github.com/NousResearch/hermes-agent/blob/main/skills/software-development/plan/SKILL.md) Plan mode: write an actionable markdown plan to .hermes/plans/, no execution. Bite-sized tasks, exact paths, complete code.
-   [python-debugpy](https://github.com/NousResearch/hermes-agent/blob/main/skills/software-development/python-debugpy/SKILL.md) Debug Python: pdb REPL + debugpy remote (DAP).
-   [requesting-code-review](https://github.com/NousResearch/hermes-agent/blob/main/skills/software-development/requesting-code-review/SKILL.md) Pre-commit review: security scan, quality gates, auto-fix.
-   [simplify-code](https://github.com/NousResearch/hermes-agent/blob/main/skills/software-development/simplify-code/SKILL.md) Parallel 3-agent cleanup of recent code changes.
-   [spike](https://github.com/NousResearch/hermes-agent/blob/main/skills/software-development/spike/SKILL.md) Throwaway experiments to validate an idea before build.
-   [systematic-debugging](https://github.com/NousResearch/hermes-agent/blob/main/skills/software-development/systematic-debugging/SKILL.md) 4-phase root cause debugging: understand bugs before fixing.
-   [test-driven-development](https://github.com/NousResearch/hermes-agent/blob/main/skills/software-development/test-driven-development/SKILL.md) TDD: enforce RED-GREEN-REFACTOR, tests before code.

### yuanbao

-   [yuanbao](https://github.com/NousResearch/hermes-agent/blob/main/skills/yuanbao/SKILL.md) Yuanbao (元宝) groups: @mention users, query info/members.

## 官方 Optional Skills（101）

### autonomous-ai-agents

-   [antigravity-cli](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/autonomous-ai-agents/antigravity-cli/SKILL.md) Operate the Antigravity CLI (agy): plugins, auth, sandbox.
-   [blackbox](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/autonomous-ai-agents/blackbox/SKILL.md) Delegate coding tasks to Blackbox AI CLI agent. Multi-model agent with built-in judge that runs tasks through multiple LLMs and picks the best result. Requires the blackbox CLI and a Blackbox AI API key.
-   [grok](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/autonomous-ai-agents/grok/SKILL.md) Delegate coding to xAI Grok Build CLI (features, PRs).
-   [honcho](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/autonomous-ai-agents/honcho/SKILL.md) Configure and use Honcho memory with Hermes -- cross-session user modeling, multi-profile peer isolation, observation config, dialectic reasoning, session summaries, and context budget enforcement. Use when setting up Honcho, troubleshooting memory, managing profiles with Honcho peers, or tuning obs
-   [openhands](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/autonomous-ai-agents/openhands/SKILL.md) Delegate coding to OpenHands CLI (model-agnostic, LiteLLM).

### blockchain

-   [evm](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/blockchain/evm/SKILL.md) Read-only EVM client: wallets, tokens, gas across 8 chains.
-   [hyperliquid](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/blockchain/hyperliquid/SKILL.md) Hyperliquid market data, account history, trade review.
-   [solana](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/blockchain/solana/SKILL.md) Query Solana blockchain data with USD pricing — wallet balances, token portfolios with values, transaction details, NFTs, whale detection, and live network stats. Uses Solana RPC + CoinGecko. No API key required.

### communication

-   [one-three-one-rule](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/communication/one-three-one-rule/SKILL.md) \>

### creative

-   [baoyu-article-illustrator](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/creative/baoyu-article-illustrator/SKILL.md) Article illustrations: type × style × palette consistency.
-   [baoyu-comic](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/creative/baoyu-comic/SKILL.md) Knowledge comics (知识漫画): educational, biography, tutorial.
-   [blender-mcp](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/creative/blender-mcp/SKILL.md) Control Blender directly from Hermes via socket connection to the blender-mcp addon. Create 3D objects, materials, animations, and run arbitrary Blender Python (bpy) code. Use when user wants to create or modify anything in Blender.
-   [concept-diagrams](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/creative/concept-diagrams/SKILL.md) Generate flat, minimal light/dark-aware SVG diagrams as standalone HTML files, using a unified educational visual language with 9 semantic color ramps, sentence-case typography, and automatic dark mode. Best suited for educational and non-software visuals — physics setups, chemistry mechanisms, math
-   [creative-ideation](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/creative/creative-ideation/SKILL.md) Generate ideas via named methods from creative practice.
-   [hyperframes](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/creative/hyperframes/SKILL.md) Create HTML-based video compositions, animated title cards, social overlays, captioned talking-head videos, audio-reactive visuals, and shader transitions using HyperFrames. HTML is the source of truth for video. Use when the user wants a rendered MP4/WebM from an HTML composition, wants to animate
-   [kanban-video-orchestrator](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/creative/kanban-video-orchestrator/SKILL.md) Plan, set up, and monitor a multi-agent video production pipeline backed by Hermes Kanban. Use when the user wants to make ANY video — narrative film, product/marketing, music video, explainer, ASCII/terminal art, abstract/generative loop, comic, 3D, real-time/installation — and the work warrants de
-   [meme-generation](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/creative/meme-generation/SKILL.md) Generate real meme images by picking a template and overlaying text with Pillow. Produces actual .png meme files.
-   [pixel-art](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/creative/pixel-art/SKILL.md) Pixel art w/ era palettes (NES, Game Boy, PICO-8).

### devops

-   [cli](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/devops/cli/SKILL.md) Run 150+ AI apps via inference.sh CLI (infsh) — image generation, video creation, LLMs, search, 3D, social automation. Uses the terminal tool. Triggers: inference.sh, infsh, ai apps, flux, veo, image generation, video generation, seedream, seedance, tavily
-   [docker-management](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/devops/docker-management/SKILL.md) Manage Docker containers, images, volumes, networks, and Compose stacks — lifecycle ops, debugging, cleanup, and Dockerfile optimization.
-   [hermes-s6-container-supervision](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/devops/hermes-s6-container-supervision/SKILL.md) Modify, debug, or extend the s6-overlay supervision tree inside the Hermes Agent Docker image — adding new services, debugging profile gateways, understanding the Architecture B main-program pattern.
-   [pinggy-tunnel](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/devops/pinggy-tunnel/SKILL.md) Zero-install localhost tunnels over SSH via Pinggy.
-   [watchers](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/devops/watchers/SKILL.md) Poll RSS, JSON APIs, and GitHub with watermark dedup.

### dogfood

-   [adversarial-ux-test](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/dogfood/adversarial-ux-test/SKILL.md) Roleplay the most difficult, tech-resistant user for your product. Browse the app as that persona, find every UX pain point, then filter complaints through a pragmatism layer to separate real problems from noise. Creates actionable tickets from genuine issues only.

### email

-   [agentmail](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/email/agentmail/SKILL.md) Give the agent its own dedicated email inbox via AgentMail. Send, receive, and manage email autonomously using agent-owned email addresses (e.g. [\[email protected\]](/cdn-cgi/l/email-protection)).

### finance

-   [3-statement-model](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/finance/3-statement-model/SKILL.md) Build fully-integrated 3-statement models (IS, BS, CF) in Excel with working capital schedules, D&A roll-forwards, debt schedule, and the plugs that make cash and retained earnings tie. Pairs with excel-author.
-   [comps-analysis](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/finance/comps-analysis/SKILL.md) Build comparable company analysis in Excel — operating metrics, valuation multiples, statistical benchmarking vs peer sets. Pairs with excel-author. Use for public-company valuation, IPO pricing, sector benchmarking, or outlier detection.
-   [dcf-model](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/finance/dcf-model/SKILL.md) Build institutional-quality DCF valuation models in Excel — revenue projections, FCF build, WACC, terminal value, Bear/Base/Bull scenarios, 5x5 sensitivity tables. Pairs with excel-author. Use for intrinsic-value equity analysis.
-   [excel-author](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/finance/excel-author/SKILL.md) Build auditable Excel workbooks headless with openpyxl — blue/black/green cell conventions, formulas over hardcodes, named ranges, balance checks, sensitivity tables. Use for financial models, audit outputs, reconciliations.
-   [lbo-model](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/finance/lbo-model/SKILL.md) Build leveraged buyout models in Excel — sources & uses, debt schedule, cash sweep, exit multiple, IRR/MOIC sensitivity. Pairs with excel-author. Use for PE screening, sponsor-case valuation, or illustrative LBO in a pitch.
-   [merger-model](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/finance/merger-model/SKILL.md) Build accretion/dilution (merger) models in Excel — pro-forma P&L, synergies, financing mix, EPS impact. Pairs with excel-author. Use for M&A pitches, board materials, or deal evaluation.
-   [pptx-author](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/finance/pptx-author/SKILL.md) Build PowerPoint decks headless with python-pptx. Pairs with excel-author for model-backed decks where every number traces to a workbook cell. Use for pitch decks, IC memos, earnings notes.
-   [stocks](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/finance/stocks/SKILL.md) Stock quotes, history, search, compare, crypto via Yahoo.

### gaming

-   [minecraft-modpack-server](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/gaming/minecraft-modpack-server/SKILL.md) Host modded Minecraft servers (CurseForge, Modrinth).
-   [pokemon-player](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/gaming/pokemon-player/SKILL.md) Play Pokemon via headless emulator + RAM reads.

### health

-   [fitness-nutrition](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/health/fitness-nutrition/SKILL.md) \>
-   [neuroskill-bci](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/health/neuroskill-bci/SKILL.md) \>

### mcp

-   [fastmcp](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/mcp/fastmcp/SKILL.md) Build, test, inspect, install, and deploy MCP servers with FastMCP in Python. Use when creating a new MCP server, wrapping an API or database as MCP tools, exposing resources or prompts, or preparing a FastMCP server for Claude Code, Cursor, or HTTP deployment.
-   [mcporter](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/mcp/mcporter/SKILL.md) Use the mcporter CLI to list, configure, auth, and call MCP servers/tools directly (HTTP or stdio), including ad-hoc servers, config edits, and CLI/type generation.

### migration

-   [openclaw-migration](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/migration/openclaw-migration/SKILL.md) Migrate a user's OpenClaw customization footprint into Hermes Agent. Imports Hermes-compatible memories, SOUL.md, command allowlists, user skills, and selected workspace assets from ~/.openclaw, then reports exactly what could not be migrated and why.

### mlops

-   [accelerate](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/mlops/accelerate/SKILL.md) Simplest distributed training API. 4 lines to add distributed support to any PyTorch script. Unified API for DeepSpeed/FSDP/Megatron/DDP. Automatic device placement, mixed precision (FP16/BF16/FP8). Interactive config, single launch command. HuggingFace ecosystem standard.
-   [chroma](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/mlops/chroma/SKILL.md) Open-source embedding database for AI applications. Store embeddings and metadata, perform vector and full-text search, filter by metadata. Simple 4-function API. Scales from notebooks to production clusters. Use for semantic search, RAG applications, or document retrieval. Best for local developmen
-   [clip](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/mlops/clip/SKILL.md) OpenAI's model connecting vision and language. Enables zero-shot image classification, image-text matching, and cross-modal retrieval. Trained on 400M image-text pairs. Use for image search, content moderation, or vision-language tasks without fine-tuning. Best for general-purpose image understandin
-   [faiss](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/mlops/faiss/SKILL.md) Facebook's library for efficient similarity search and clustering of dense vectors. Supports billions of vectors, GPU acceleration, and various index types (Flat, IVF, HNSW). Use for fast k-NN search, large-scale vector retrieval, or when you need pure similarity search without metadata. Best for hi
-   [flash-attention](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/mlops/flash-attention/SKILL.md) Optimizes transformer attention with Flash Attention for 2-4x speedup and 10-20x memory reduction. Use when training/running transformers with long sequences (>512 tokens), encountering GPU memory issues with attention, or need faster inference. Supports PyTorch native SDPA, flash-attn library, H100
-   [guidance](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/mlops/guidance/SKILL.md) Control LLM output with regex and grammars, guarantee valid JSON/XML/code generation, enforce structured formats, and build multi-step workflows with Guidance - Microsoft Research's constrained generation framework
-   [huggingface-tokenizers](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/mlops/huggingface-tokenizers/SKILL.md) Fast tokenizers optimized for research and production. Rust-based implementation tokenizes 1GB in <20 seconds. Supports BPE, WordPiece, and Unigram algorithms. Train custom vocabularies, track alignments, handle padding/truncation. Integrates seamlessly with transformers. Use when you need high-perf
-   [outlines](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/mlops/inference/outlines/SKILL.md) Outlines: structured JSON/regex/Pydantic LLM generation.
-   [instructor](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/mlops/instructor/SKILL.md) Extract structured data from LLM responses with Pydantic validation, retry failed extractions automatically, parse complex JSON with type safety, and stream partial results with Instructor - battle-tested structured output library
-   [lambda-labs](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/mlops/lambda-labs/SKILL.md) Reserved and on-demand GPU cloud instances for ML training and inference. Use when you need dedicated GPU instances with simple SSH access, persistent filesystems, or high-performance multi-node clusters for large-scale training.
-   [llava](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/mlops/llava/SKILL.md) Large Language and Vision Assistant. Enables visual instruction tuning and image-based conversations. Combines CLIP vision encoder with Vicuna/LLaMA language models. Supports multi-turn image chat, visual question answering, and instruction following. Use for vision-language chatbots or image unders
-   [modal](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/mlops/modal/SKILL.md) Serverless GPU cloud platform for running ML workloads. Use when you need on-demand GPU access without infrastructure management, deploying ML models as APIs, or running batch jobs with automatic scaling.
-   [nemo-curator](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/mlops/nemo-curator/SKILL.md) GPU-accelerated data curation for LLM training. Supports text/image/video/audio. Features fuzzy deduplication (16× faster), quality filtering (30+ heuristics), semantic deduplication, PII redaction, NSFW detection. Scales across GPUs with RAPIDS. Use for preparing high-quality training datasets, cle
-   [obliteratus](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/mlops/obliteratus/SKILL.md) OBLITERATUS: abliterate LLM refusals (diff-in-means).
-   [peft](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/mlops/peft/SKILL.md) Parameter-efficient fine-tuning for LLMs using LoRA, QLoRA, and 25+ methods. Use when fine-tuning large models (7B-70B) with limited GPU memory, when you need to train <1% of parameters with minimal accuracy loss, or for multi-adapter serving. HuggingFace's official library integrated with transform
-   [pinecone](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/mlops/pinecone/SKILL.md) Managed vector database for production AI applications. Fully managed, auto-scaling, with hybrid search (dense + sparse), metadata filtering, and namespaces. Low latency (<100ms p95). Use for production RAG, recommendation systems, or semantic search at scale. Best for serverless, managed infrastruc
-   [pytorch-fsdp](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/mlops/pytorch-fsdp/SKILL.md) Expert guidance for Fully Sharded Data Parallel training with PyTorch FSDP - parameter sharding, mixed precision, CPU offloading, FSDP2
-   [pytorch-lightning](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/mlops/pytorch-lightning/SKILL.md) High-level PyTorch framework with Trainer class, automatic distributed training (DDP/FSDP/DeepSpeed), callbacks system, and minimal boilerplate. Scales from laptop to supercomputer with same code. Use when you want clean training loops with built-in best practices.
-   [qdrant](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/mlops/qdrant/SKILL.md) High-performance vector similarity search engine for RAG and semantic search. Use when building production RAG systems requiring fast nearest neighbor search, hybrid search with filtering, or scalable vector storage with Rust-powered performance.
-   [dspy](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/mlops/research/dspy/SKILL.md) DSPy: declarative LM programs, auto-optimize prompts, RAG.
-   [saelens](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/mlops/saelens/SKILL.md) Provides guidance for training and analyzing Sparse Autoencoders (SAEs) using SAELens to decompose neural network activations into interpretable features. Use when discovering interpretable features, analyzing superposition, or studying monosemantic representations in language models.
-   [simpo](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/mlops/simpo/SKILL.md) Simple Preference Optimization for LLM alignment. Reference-free alternative to DPO with better performance (+6.4 points on AlpacaEval 2.0). No reference model needed, more efficient than DPO. Use for preference alignment when want simpler, faster training than DPO/PPO.
-   [slime](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/mlops/slime/SKILL.md) Provides guidance for LLM post-training with RL using slime, a Megatron+SGLang framework. Use when training GLM models, implementing custom data generation workflows, or needing tight Megatron-LM integration for RL scaling.
-   [stable-diffusion](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/mlops/stable-diffusion/SKILL.md) State-of-the-art text-to-image generation with Stable Diffusion models via HuggingFace Diffusers. Use when generating images from text prompts, performing image-to-image translation, inpainting, or building custom diffusion pipelines.
-   [tensorrt-llm](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/mlops/tensorrt-llm/SKILL.md) Optimizes LLM inference with NVIDIA TensorRT for maximum throughput and lowest latency. Use for production deployment on NVIDIA GPUs (A100/H100), when you need 10-100x faster inference than PyTorch, or for serving models with quantization (FP8/INT4), in-flight batching, and multi-GPU scaling.
-   [torchtitan](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/mlops/torchtitan/SKILL.md) Provides PyTorch-native distributed LLM pretraining using torchtitan with 4D parallelism (FSDP2, TP, PP, CP). Use when pretraining Llama 3.1, DeepSeek V3, or custom models at scale from 8 to 512+ GPUs with Float8, torch.compile, and distributed checkpointing.
-   [axolotl](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/mlops/training/axolotl/SKILL.md) Axolotl: YAML LLM fine-tuning (LoRA, DPO, GRPO).
-   [trl-fine-tuning](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/mlops/training/trl-fine-tuning/SKILL.md) TRL: SFT, DPO, PPO, GRPO, reward modeling for LLM RLHF.
-   [unsloth](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/mlops/training/unsloth/SKILL.md) Unsloth: 2-5x faster LoRA/QLoRA fine-tuning, less VRAM.
-   [whisper](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/mlops/whisper/SKILL.md) OpenAI's general-purpose speech recognition model. Supports 99 languages, transcription, translation to English, and language identification. Six model sizes from tiny (39M params) to large (1550M params). Use for speech-to-text, podcast transcription, or multilingual audio processing. Best for robu

### payments

-   [mpp-agent](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/payments/mpp-agent/SKILL.md) Pay HTTP 402 APIs via Machine Payments Protocol (MPP).
-   [stripe-link-cli](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/payments/stripe-link-cli/SKILL.md) Agent payments via Stripe Link — cards, SPT, approvals.
-   [stripe-projects](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/payments/stripe-projects/SKILL.md) Provision SaaS services + sync creds via Stripe Projects.

### productivity

-   [canvas](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/productivity/canvas/SKILL.md) Canvas LMS integration — fetch enrolled courses and assignments using API token authentication.
-   [here-now](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/productivity/here-now/SKILL.md) Publish static sites to {slug}.here.now and store private files in cloud Drives for agent-to-agent handoff.
-   [memento-flashcards](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/productivity/memento-flashcards/SKILL.md) \>-
-   [shop](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/productivity/shop/SKILL.md) Shop catalog search, checkout, order tracking, returns.
-   [shopify](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/productivity/shopify/SKILL.md) Shopify Admin & Storefront GraphQL APIs via curl. Products, orders, customers, inventory, metafields.
-   [siyuan](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/productivity/siyuan/SKILL.md) SiYuan Note API for searching, reading, creating, and managing blocks and documents in a self-hosted knowledge base via curl.
-   [telephony](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/productivity/telephony/SKILL.md) Give Hermes phone capabilities without core tool changes. Provision and persist a Twilio number, send and receive SMS/MMS, make direct calls, and place AI-driven outbound calls through Bland.ai or Vapi.

### research

-   [bioinformatics](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/research/bioinformatics/SKILL.md) Gateway to 400+ bioinformatics skills from bioSkills and ClawBio. Covers genomics, transcriptomics, single-cell, variant calling, pharmacogenomics, metagenomics, structural biology, and more. Fetches domain-specific reference material on demand.
-   [darwinian-evolver](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/research/darwinian-evolver/SKILL.md) Evolve prompts/regex/SQL/code with Imbue's evolution loop.
-   [domain-intel](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/research/domain-intel/SKILL.md) Passive domain reconnaissance using Python stdlib. Subdomain discovery, SSL certificate inspection, WHOIS lookups, DNS records, domain availability checks, and bulk multi-domain analysis. No API keys required.
-   [drug-discovery](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/research/drug-discovery/SKILL.md) \>
-   [duckduckgo-search](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/research/duckduckgo-search/SKILL.md) Free web search via DuckDuckGo — text, news, images, videos. No API key needed. Prefer the \`ddgs\` CLI when installed; use the Python DDGS library only after verifying that \`ddgs\` is available in the current runtime.
-   [gitnexus-explorer](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/research/gitnexus-explorer/SKILL.md) Index a codebase with GitNexus and serve an interactive knowledge graph via web UI + Cloudflare tunnel.
-   [osint-investigation](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/research/osint-investigation/SKILL.md) Public-records OSINT investigation framework — SEC EDGAR filings, USAspending contracts, Senate lobbying, OFAC sanctions, ICIJ offshore leaks, NYC property records (ACRIS), OpenCorporates registries, CourtListener court records, Wayback Machine archives, Wikipedia + Wikidata, GDELT news monitoring.
-   [parallel-cli](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/research/parallel-cli/SKILL.md) Optional vendor skill for Parallel CLI — agent-native web search, extraction, deep research, enrichment, FindAll, and monitoring. Prefer JSON output and non-interactive flows.
-   [qmd](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/research/qmd/SKILL.md) Search personal knowledge bases, notes, docs, and meeting transcripts locally using qmd — a hybrid retrieval engine with BM25, vector search, and LLM reranking. Supports CLI and MCP integration.
-   [scrapling](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/research/scrapling/SKILL.md) Web scraping with Scrapling - HTTP fetching, stealth browser automation, Cloudflare bypass, and spider crawling via CLI and Python.
-   [searxng-search](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/research/searxng-search/SKILL.md) Free meta-search via SearXNG — aggregates results from 70+ search engines. Self-hosted or use a public instance. No API key needed. Falls back automatically when the web search toolset is unavailable.

### security

-   [1password](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/security/1password/SKILL.md) Set up and use 1Password CLI (op). Use when installing the CLI, enabling desktop app integration, signing in, and reading/injecting secrets for commands.
-   [godmode](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/security/godmode/SKILL.md) Jailbreak LLMs: Parseltongue, GODMODE, ULTRAPLINIAN.
-   [oss-forensics](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/security/oss-forensics/SKILL.md) |
-   [sherlock](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/security/sherlock/SKILL.md) OSINT username search across 400+ social networks. Hunt down social media accounts by username.
-   [unbroker](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/security/unbroker/SKILL.md) Autonomously remove your info from data-broker sites.
-   [web-pentest](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/security/web-pentest/SKILL.md) |

### software-development

-   [code-wiki](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/software-development/code-wiki/SKILL.md) Generate wiki docs + Mermaid diagrams for any codebase.
-   [rest-graphql-debug](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/software-development/rest-graphql-debug/SKILL.md) Debug REST/GraphQL APIs: status codes, auth, schemas, repro.
-   [subagent-driven-development](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/software-development/subagent-driven-development/SKILL.md) Execute plans via delegate\_task subagents (2-stage review).

### web-development

-   [cloudflare-temporary-deploy](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/web-development/cloudflare-temporary-deploy/SKILL.md) Deploy a Worker live, no account, via wrangler --temporary.

[新手推薦 Skills](/skills/recommended-skills/)．[推薦 MCP](/integrations/recommended-mcp/)．[Skills 與 MCP 入口](/skills/skills-mcp-overview/)
