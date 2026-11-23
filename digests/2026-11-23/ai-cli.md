# AI CLI Tools Community Digest 2026-11-23

> Generated: 2026-11-23 01:33 UTC | Tools covered: 7

- [Claude Code](https://github.com/anthropics/claude-code)
- [OpenAI Codex](https://github.com/openai/codex)
- [Gemini CLI](https://github.com/google-gemini/gemini-cli)
- [GitHub Copilot CLI](https://github.com/github/copilot-cli)
- [OpenCode](https://github.com/anomalyco/opencode)
- [Pi](https://github.com/earendil-works/pi)
- [Qwen Code](https://github.com/QwenLM/qwen-code)
- [Claude Code Skills](https://github.com/anthropics/skills)

---

## Cross-Tool Comparison

# Cross-Tool Comparison Report: AI CLI Ecosystem
**Date: 2026-11-23 | Coverage: Claude Code, OpenAI Codex, Gemini CLI, GitHub Copilot CLI, OpenCode, Pi, Qwen Code**

---

## 1. Ecosystem Overview

The AI CLI tooling landscape in late 2026 has entered a **stabilization-and-hardening phase** rather than a pure feature race. Every major tool reported zero or near-zero new releases in the last 24 hours, yet all seven trackers showed heavy issue activity — a signature of mature products absorbing a wave of regressions from recent architectural migrations (V1→V2 agent models, managed-service layers, persistent-PTY transports). The dominant cross-cutting themes are **subagent orchestration reliability, permission/sandbox correctness, context/token cost transparency, and cross-platform parity (especially Windows)**. Security defaults that over-block legitimate work and silent failures (dropped files, misreported success states) have emerged as the most trust-damaging bug classes across the ecosystem. Meanwhile, a clear architectural convergence is underway around **MCP as the universal tool-integration layer and agents-invoking-agents as the next capability frontier**.

---

## 2. Activity Comparison

| Tool | Issues (updated 24h) | PRs (updated 24h) | Discussions | Release Status |
|---|---|---|---|---|
| **Claude Code** | ~50 updated | 1 (open) | N/A (none in dataset) | No release |
| **OpenAI Codex** | High (~10+ hot) | ~13 (all closed/merged) | **12** (6 Ideas, 3 Q&A, 5 Show-and-tell) | No release |
| **Gemini CLI** | 10 hot (multiple P1) | ~12 (ACP-heavy) | N/A (none in dataset) | **v0.71.0 nightly** |
| **GitHub Copilot CLI** | 19 updated | 2 (1 open, 1 closed) | N/A (none in dataset) | **v1.0.115-7** |
| **OpenCode** | 10 hot (high engagement) | 10 (mixed open/closed) | N/A (none in dataset) | No release |
| **Pi** | 10 hot (untriaged regressions) | 3 (all closed, 0 open) | 1 Show-and-tell | No release (stable 1.6.0) |
| **Qwen Code** | 10 hot (CI-dominated) | 10 (feature-heavy) | N/A (none in dataset) | **v0.28.4 CLI + Desktop** |

**Notes:**
- **Discussions = N/A** for Claude Code, Gemini CLI, Copilot CLI, OpenCode, and Qwen Code — these repos primarily route community input through Issues and PRs. This reflects channel design, not inactivity.
- **OpenAI Codex** is the only tool with a robust, actively curated Discussions surface (12 threads in 24h).
- **Gemini CLI** and **Copilot CLI** and **Qwen Code** shipped releases; the rest held steady, consistent with post-release stabilization.

---

## 3. Shared Feature Directions

Requirements echoing across **multiple** communities — the strongest signal of genuine ecosystem-wide demand:

### a. Subagent Orchestration & Observability **(Claude Code, Gemini CLI, OpenCode, Copilot CLI, Pi)**
- **OpenCode** is the epicenter: foreground subagent execution restoration (#64073, 25 comments) and a live subagent sidebar (#41249) dominate.
- **Gemini CLI** wants agents to invoke other agents (#30409, #28738) with depth limits, plus subagent trajectory visibility (#22598).
- **Copilot CLI** reports nested subagents silently can't run multi-turn (#5543).
- **Pi** flags blind tool-call concurrency causing stale reads (#11950).
- **Claude Code** sees MCP elicitation auto-declined in VS Code (#98256).
→ *Users want delegated work to be visible, controllable, and correctly reported.*

### b. Permission / Sandbox Boundary Correctness **(Claude Code, OpenAI Codex, Pi)**
- **Claude Code**: blanket password-typing block (#78160, 25 comments) and false-positive `reasoning_extraction` blocks (#111336).
- **OpenAI Codex**: UI shows "Full access" but executor enforces read-only (#62926, #62975); approval races turn lifecycle (#60139).
- **Pi**: `--tools` scoping silently undone by tool registration (#12399) — security-adjacent.
→ *Trust boundaries are either over-blocking legit work or under-enforcing declared policy.*

### c. Context / Token Cost Transparency **(Claude Code, OpenAI Codex, OpenCode, Qwen Code)**
- **Claude Code**: desktop 79k vs 13k CLI context overhead (#105328); warm-cache rewrites (#91514).
- **OpenAI Codex**: subagent prompt-cache lineage loss (#24704, 👍20).
- **OpenCode**: `keep.tokens` ignored at 234K vs 15K (#43250); expensive compaction re-prefill (#65549).
- **Qwen Code**: `top_k` missing from telemetry (#18106).
→ *Opaque metering and cache-miss re-prefill translate directly into cost and latency surprises.*

### d. Persistent / Cross-Session Memory **(OpenAI Codex, Gemini CLI, Qwen Code, Pi)**
- **Codex**: "continuous engineering workspace" across ChatGPT/Work/Codex (#61348, 41 comments).
- **Gemini CLI**: file-based persistent tasks (#18836) to fight context rot.
- **Qwen Code**: share auto-memory across Git worktrees (#18030).
- **Pi**: permanent conversation deletion (#11026) and session lifecycle hygiene.

### e. Windows & Non-Default Environment Parity **(Claude Code, OpenAI Codex, Copilot CLI, Pi, Qwen Code)**
- **Claude Code**: case-sensitive drive-letter worktree bug (#91618); Windows Terminal input loss (#111754).
- **Codex**: Windows permission cluster is its *dominant* pain point.
- **Copilot CLI**: Schannel TLS failure on managed networks (#5546).
- **Pi**: custom Git-for-Windows install not found (#12408).
- **Qwen Code**: silent `@`-path dropping on Windows (#18141).
→ *Five of seven tools have active Windows-specific defects — clearly under-tested.*

### f. MCP Reliability & Capability Parity **(Claude Code, Codex, Copilot CLI, OpenCode)**
- **Claude Code**: elicitation auto-declined, missing headers, GitHub MCP not loading.
- **Codex**: MCP tool-list change subscriptions (#62681).
- **Copilot CLI**: built-in GitHub MCP tools hidden when `gh` on PATH (#5550).
- **OpenCode**: silent 61-tool MCP truncation (#65590, fixed).

---

## 4. Differentiation Analysis

| Dimension | Claude Code | OpenAI Codex | Gemini CLI | Copilot CLI | OpenCode | Pi | Qwen Code |
|---|---|---|---|---|---|---|---|
| **Target user** | Pro devs, Max subscribers | Cross-surface engineering teams | Agent-architecture experimenters | GitHub-centric enterprise teams | Open-source / TUI power users | Multi-agent power users (Bedrock/Google) | Self-hosted / open-weight adopters |
| **Core focus** | Safety defaults + Max-tier scale | Continuous workspace + desktop UX | Agent subsystem & ACP hardening | Cloud sessions + agent tooling | V2 migration parity + TUI polish | Agent SDK correctness + provider adapters | Web Shell + managed-agent infra |
| **Technical approach** | Sandbox/worktree isolation, aggressive safety blocks | Cloud+local hybrid, subagent cache optimization | ACP/A2A protocol, AST-aware tooling | ACP, `--ui-server`, MCP built-ins | Persistent-PTY, service architecture | Harness SDK, contribution-gated fixes | CI-as-product, deflake automation |
| **Signature 2026-11 pain** | False-positive safeguards, TUI input loss | Windows permission enforcement | Subagent hangs / misreported success | Cloud session reconnection | V1→V2 regression loss | Post-1.6.0 adapter regressions | CI flakiness, silent failures |
| **Community channel** | Issues-only | Issues + rich Discussions | Issues + PRs | Issues + PRs | Issues + PRs | Issues + light Discussions | Issues + PRs |

**Distinct personalities:**
- **Claude Code** optimizes for *safety-first defaults* — and is now paying for over-blocking.
- **Codex** is the *most complete product surface* (desktop → mobile → cloud), but Windows enforcement is its Achilles' heel.
- **Gemini CLI** is the *most architecturally ambitious*, betting on ACP/A2A and agent-invoking-agents.
- **Copilot CLI** is the *enterprise/GitHub-native* play, but cloud session reliability lags.
- **OpenCode** is the *open-source TUI purist*, wrestling with V2 migration debt.
- **Pi** is the *harness/SDK specialist*, notably dependent on provider-adapter correctness (Bedrock, Google, Copilot).
- **Qwen Code** is the *self-hosted/open-weight champion*, with an unusually mature CI-as-product discipline.

---

## 5. Community Momentum & Maturity

| Tool | Momentum | Maturity | Evidence |
|---|---|---|---|
| **OpenAI Codex** | ⭐⭐⭐⭐⭐ | High | 85-comment issue; 12 curated Discussions; 13 merged PRs/day; one closed macOS regression |
| **Gemini CLI** | ⭐⭐⭐⭐⭐ | Rapid iteration | Multiple P1s under retest; coherent ACP PR swarm from one contributor; nightly cadence |
| **OpenCode** | ⭐⭐⭐⭐ | Mid-migration | 25-comment flagship thread; balanced issue+PR load; V2 parity still being clawed back |
| **Claude Code** | ⭐⭐⭐⭐ | Very mature | 50 issues/day but only 1 PR — high user base, lower merge velocity visible externally |
| **Pi** | ⭐⭐⭐ | Stabilizing | Post-1.6.0 regression wave; **contribution-gate friction** stalling ready fixes (#8643) |
| **Qwen Code** | ⭐⭐⭐ | Infra-heavy | CI-dominated tracker; two releases shipped; Web Shell fastest-moving surface |
| **Copilot CLI** | ⭐⭐ | Early-stabilizing | 19 issue updates but only 2 PRs; cloud-session bugs freshly reported |

**Key observations:**
- **Codex and Gemini CLI** are the most *actively iterating* — high PR throughput with visible architectural direction.
- **Claude Code** has the *largest visible signal volume* but the thinnest PR flow in this window — a pattern consistent with internal development and external issue triage.
- **Pi** shows a *process bottleneck*: multiple high-👍 fixes (#8643, #12184) wait on contribution-gate review, a maturity risk.
- **Qwen Code** is unusual in treating **CI reliability as a first-class product surface** — deflake bots, bounded-poll fixes, autofix approvals.

---

## 6. Trend Signals

### Trend 1 — The agent is the new unit of complexity
Every community is *simultaneously* adding agent-invokes-agent capability and *fighting* the resulting reliability gaps (hangs, misreported success, cache lineage loss, stale reads). **Reference value:** teams adopting multi-agent workflows should invest early in observability and turn-budget reporting, not just capability.

### Trend 2 — Safety defaults are being renegotiated
Password-typing blocks, `reasoning_extraction` false positives, "Full access" that isn't, and `--tools` scoping leaks all point the same direction: **users want permission-gated opt-in escapes, not hard blocks**. **Reference value:** ship configurable trust boundaries with safe defaults, or users will route around the tool.

### Trend 3 — Cost/context transparency is a competitive feature
Desktop context overhead, cache-miss re-prefill, ignored `keep.tokens`, and missing telemetry fields appear across four communities. **Reference value:** honest token accounting and reliable compaction are now table-stakes for power-user retention.

### Trend 4 — Cross-platform parity is unfinished business
Windows and non-default environments (Wayland, custom installs, corporate TLS, split-DNS) break in five of seven tools. **Reference value:** if you're deploying to mixed-OS fleets, budget for platform-specific QA on every release.

### Trend 5 — MCP is consolidating as the integration spine
Four tools surfaced MCP-specific bugs the same day (elicitation, tool-list subscriptions, `gh`-on-PATH shadowing, 61-tool truncation). **Reference value:** MCP is now the assumed extension layer — treat its reliability the way you'd treat a core dependency.

### Trend 6 — Silent failures are the most damaging bug class
Dropped file attachments, hidden MCP tools, disposed-session prompts, and misreported subagent success all fail *quietly*. **Reference value:** for any new feature, prioritize "fail loudly" over "fail gracefully" — silent degradation destroys developer trust fastest.

### Trend 7 — Process friction is emerging as an ecosystem-level risk
Pi's contribution gate stalled a 10-👍 fix; Qwen Code's CI flakiness dominates its tracker; Copilot CLI's PR throughput (2/day) is low relative to issue volume. **Reference value:** as these tools mature, *contribution and review throughput* — not raw capability — may become the limiting factor for community health.

---

*Report synthesized from 2026-11-23 community digests across seven AI CLI repositories. Metrics reflect comment/reaction counts and 24h activity windows at time of collection. "N/A" denotes repositories that route community input outside a Discussions surface, not inactivity.*

---

## Per-Tool Reports

<details>
<summary><strong>Claude Code</strong> — <a href="https://github.com/anthropics/claude-code">anthropics/claude-code</a></summary>

## Claude Code Skills Highlights

> Source: [anthropics/skills](https://github.com/anthropics/skills)

# Claude Code Skills — Community Highlights Report
*Data as of 2026-11-23 | Source: github.com/anthropics/skills*

---

## 1. Top Skills Ranking (Most-Discussed PRs)

| # | Skill / PR | Functionality | Discussion Highlights | Status |
|---|------------|---------------|----------------------|--------|
| 1 | **[#1742 mcp-builder fix](https://github.com/anthropics/skills/pull/1742)** | Fixes MCP v2 client import rename (`streamablehttp_client` → `streamable_http_client`) and custom header handling | Resolves #1668; compatibility fix for breaking upstream MCP SDK changes | OPEN |
| 2 | **[#1298 skill-creator fix](https://github.com/anthropics/skills/pull/1298)** | Isolates trigger evals, handles Windows subprocess/select failures | Fixes false-negative trigger scores and cross-platform runtime errors | OPEN |
| 3 | **[#1245 notion-spec-to-implementation + quantitative-resume-auditor](https://github.com/anthropics/skills/pull/1245)** | Turns Notion specs into implementation tasks; audits resumes quantitatively | Two-in-one submission; spec-to-task automation is a recurring community theme | OPEN |
| 4 | **[#525 pyxel](https://github.com/anthropics/skills/pull/525)** | Retro game dev with Pyxel — implementation, headless runs, frame inspection | Long-running (since March); well-scoped niche for verifiable game logic | OPEN |
| 5 | **[#514 document-typography](https://github.com/anthropics/skills/pull/514)** | Prevents orphan/widow text and numbering misalignment in generated docs | Broad applicability; touches every generated document | OPEN |
| 6 | **[#1980 webapp-testing fix](https://github.com/anthropics/skills/pull/1980)** | Removes `shell=True` command-injection risk (CWE-78) in `with_server.py` | Security hardening of the testing harness | OPEN |
| 7 | **[#1703 md2video-audio](https://github.com/anthropics/skills/pull/1703)** | Markdown → MP4 videos via Marp with TTS voiceover | "Zero-cost" media pipeline; novel output modality | OPEN |
| 8 | **[#1771 proofcore-contract-auditor](https://github.com/anthropics/skills/pull/1771)** | Solidity/Rust static analysis + Merkle proof anchoring on TON | Web3 audit niche; blockchain-anchored evidence | OPEN |

> Note: PR comment counts are `undefined` in the source data; ranking reflects recency-weighted visibility, cross-references, and linked issue activity.

---

## 2. Community Demand Trends (From Issues)

- **Trust & Namespace Security** — [#492](https://github.com/anthropics/skills/issues/492) (46 comments, top issue): community skills published under the `anthropic/` namespace enable trust-boundary abuse. Demand for namespace verification / signing.
- **Eval Harness Reliability** — [#556](https://github.com/anthropics/skills/issues/556) (0% trigger rate) and [#1352](https://github.com/anthropics/skills/issues/1352) (parallel-worker UUID cross-match): the community urgently wants a *trustworthy* skill-trigger evaluation pipeline.
- **Context Budget Discipline** — [#1487](https://github.com/anthropics/skills/issues/1487): `claude-api` eagerly injects ~156k tokens. Demand for lazy-loading / progressive disclosure in skills.
- **Org-Wide Skill Sharing** — [#228](https://github.com/anthropics/skills/issues/228) (👍 8): users want a shared skill library instead of manual `.skill` file passing.
- **Governance / Safety Patterns** — [#412](https://github.com/anthropics/skills/issues/412) (closed) and [#1385](https://github.com/anthropics/skills/issues/1385): quality-gate and agent-governance pipelines are repeatedly proposed.
- **Memory / State Compaction** — [#1329](https://github.com/anthropics/skills/issues/1329): symbolic notation for compact agent state to save context.

**Emerging skill directions:** namespace/trust verification, eval-harness correctness, context-budget-aware skills, org sharing, and agent governance.

---

## 3. High-Potential Pending Skills

| Skill / PR | Why It May Land Soon | Status |
|------------|----------------------|--------|
| **[#1681 skill-creator direct-exec fix](https://github.com/anthropics/skills/pull/1681)** | Updated 2026-11-19; fixes `ModuleNotFoundError` and stale docstrings — small, high-value DX fix | OPEN |
| **[#1997 skill-creator YAML parsing](https://github.com/anthropics/skills/pull/1997)** | Corrects frontmatter scalar parsing that corrupts eval metadata | OPEN |
| **[#2019 xlsx external-links fix](https://github.com/anthropics/skills/pull/2019)** | Resolves #2013; scoped correctness fix for worksheet-scoped defined names | OPEN |
| **[#1792 docx LibreOffice timeout](https://github.com/anthropics/skills/pull/1792)** | Prevents false-success reports; verifies revision-mark removal | OPEN |
| **[#1977 algorithmic-art wrapAround](https://github.com/anthropics/skills/pull/1977) / [#1976 element_discovery](https://github.com/anthropics/skills/pull/1976) / [#1975 pptx --cols](https://github.com/anthropics/skills/pull/1975)** | Batch of small, verified bug fixes by one contributor (gerardrecinto), each linked to a specific issue | OPEN |
| **[#1950 claude-api pause_turn](https://github.com/anthropics/skills/pull/1950)** | Aligns docs with Python SDK 1.1.0 auto-resumption | OPEN |
| **[#1615 scnet-hpc](https://github.com/anthropics/skills/pull/1615)** | Slurm/SSH HPC workflows; niche but complete scope | OPEN |
| **[#1734 orphaned docx comments](https://github.com/anthropics/skills/pull/1734)** | Small, focused docx quality improvement | OPEN |

---

## 4. Skills Ecosystem Insight

> **The community's most concentrated demand is trust and correctness of the skill infrastructure itself** — namespace/security boundaries, reliable trigger-eval harnesses, and context-budget discipline — rather than new skill *ideas*, which are plentiful but secondary.

---

*All links point to `github.com/anthropics/skills`. Statuses reflect the 2026-11-23 snapshot; all listed PRs remain OPEN.*

---

# Claude Code Community Digest — 2026-11-23

## 1. Today's Highlights

No new releases landed in the last 24 hours, but issue activity remains intense: 50 issues were updated, led by a long-running debate over Claude Code's blanket refusal to type passwords (25 comments) and a fresh wave of platform-specific regressions on Windows and Linux. Meanwhile, a new security-adjacent bug (#111729) reports that unquoted heredocs with backticks can execute embedded commands, and several 2.1.330 TUI input-handling failures surfaced on both Windows Terminal and Linux.

## 2. Releases

No new releases in the last 24 hours.

## 3. Hot Issues

1. **[#78160](https://github.com/anthropics/claude-code/issues/78160) — Hard block on typing passwords breaks legitimate dev/test workflows** (25 comments, 👍32)
   The most-discussed issue today. Claude Code categorically refuses to type credentials even for documented test accounts on localhost. The request is for a permission-gated opt-in for owned dev environments — a nuanced middle ground between the security default and real-world testing needs.

2. **[#105770](https://github.com/anthropics/claude-code/issues/105770) — Android sign-in fails on rooted/unlocked devices (HTTP 400 from `/auth/verify_google_mobile`)** (20 comments, 👍17)
   Play Integrity passes but the server rejects the token. Marked `invalid`, yet the comment volume suggests this affects a meaningful cohort of power users and is worth clarifying policy on.

3. **[#91618](https://github.com/anthropics/claude-code/issues/91618) — Windows worktree safety check rejects valid worktree due to case-sensitive drive-letter comparison** (12 comments)
   A reproducible Windows-only regression: `D:\` vs `d:\` breaks isolation-worktree validation. Classic cross-platform path-handling bug with a clear fix path.

4. **[#98256](https://github.com/anthropics/claude-code/issues/98256) — MCP elicitation auto-declined in interactive VS Code sessions** (12 comments, 👍28)
   High community signal: the capability is declared but requests are silently declined in "print mode." This effectively disables elicitation-based MCP flows for VS Code users, undermining a core MCP feature.

5. **[#91514](https://github.com/anthropics/claude-code/issues/91514) — Warm prompt cache fully re-written after ToolSearch/Skill/tool_result on v2.1.258** (10 comments)
   Cache-read collapses to the system+tools floor, with request IDs as evidence. Direct cost implications for Max subscribers — a high-value bug for anyone tracking token spend.

6. **[#82700](https://github.com/anthropics/claude-code/issues/82700) — Pro subscription blocked with "organization has disabled subscription access"** (10 comments)
   Unresolved after full re-auth and support escalation. Auth/billing lockouts are among the most disruptive failure modes for individual developers.

7. **[#78818](https://github.com/anthropics/claude-code/issues/78818) — Sandbox persists `.git/config.lock` in linked worktrees, blocking git config writes** (9 comments)
   The sandbox's read-only bind-mount includes a *transient* lock file, which breaks git operations in linked worktrees on WSL. Subtle sandbox/filesystem interaction with real workflow impact.

8. **[#76809](https://github.com/anthropics/claude-code/issues/76809) — WebMCP tool discovery in Claude in Chrome** (6 comments, 👍22)
   A well-received feature request revisiting an earlier ask with production implementation data. Strong upvote ratio indicates real demand for browser-extension tool discovery.

9. **[#111336](https://github.com/anthropics/claude-code/issues/111336) — False-positive `reasoning_extraction` safeguard blocks on ordinary dev work** (5 comments)
   78 blocked requests across Fable 5.2, Opus 5.5, and Sonnet 5.5 in one week. False-positive safety blocks are a growing trust and productivity concern.

10. **[#105328](https://github.com/anthropics/claude-code/issues/105328) — Desktop Code tab starts at ~79k tokens vs ~13k in terminal CLI** (4 comments, 👍4)
    A ~6x context overhead in the desktop app, re-read on every model call. Significant cost and latency implications for desktop users with identical configs.

## 4. Key PR Progress

Only one PR was updated in the last 24 hours:

1. **[#95698](https://github.com/anthropics/claude-code/pull/95698) — fix(plugins): run ralph-wiggum and output-style .sh hooks through bash with a quoted path** (by claude[bot])
   Fixes three bundled plugins (`ralph-wiggum`, `output-style`) that registered hooks as bare, unquoted script paths, causing failures when the plugin root contains spaces. Refs #95673 and the ralph-wiggum/output-style half of #78490. Small but high-leverage reliability fix for plugin users.

*Note: The data provided contains only one PR updated in the last 24 hours; no additional PRs are available to summarize.*

## 5. Hot Discussions

No discussion data was provided in this dataset. Section omitted.

## 6. Feature Request Trends

Distilled from the issue set, the most-requested directions are:

- **Permission-gated escapes from security defaults** — #78160 (password typing), #94593 (unauthorized Maven install/run) show users want configurable trust boundaries rather than hard blocks, while still respecting safe defaults.
- **MCP reliability and capability parity** — #98256 (elicitation auto-declined), #111395 (missing `Mcp-Param-owner` header in scheduled tasks), #111532 (GitHub MCP not loading) collectively push for consistent MCP behavior across interactive, scheduled, and cloud sessions.
- **Browser-extension integration** — #76809 (WebMCP tool discovery in Claude in Chrome) with strong upvotes.
- **Account management flexibility** — #76624 (change email in-place) and #73415 (public IP for Gateway) reflect friction in account and networking configuration.
- **Usage/limit transparency** — #94592 (usage limits and rate limiting communication) captures recurring frustration with opaque metering.

## 7. Developer Pain Points

- **Platform-specific regressions are piling up.** Windows worktree case-sensitivity (#91618), Windows Terminal ESC/Ctrl+C unresponsiveness (#111754), Linux `/resume` input lockout (#111739), and VS Code Remote-SSH re-render storms (#111752) all point to uneven cross-platform QA.
- **Context and cost overhead is a top concern.** Desktop's ~79k-token baseline (#105328), advisor-turn usage double-counting triggering early auto-compact (#84738), and warm-cache rewrites (#91514) form a cluster of cost/context accounting problems.
- **False-positive safeguards erode trust.** The `reasoning_extraction` blocks (#111336) and the password-typing hard block (#78160) both show safety mechanisms misfiring on legitimate work, prompting calls for opt-in overrides.
- **Auth and subscription lockouts are high-severity.** #82700 (Pro blocked) and #105770 (Android sign-in) leave users unable to work with no clear resolution path.
- **Sandbox/filesystem interactions remain fragile.** #78818's persisted `.git/config.lock` and the heredoc command-execution bug (#111729) highlight edge cases where sandboxing either over-blocks or under-protects.
- **TUI input handling** — Two separate 2.1.330 reports (#111754, #111739) describe complete loss of keyboard control, a severe usability failure requiring force-quit.

---
*Generated from github.com/anthropics/claude-code activity on 2026-11-23. Metrics reflect comment counts and reactions at time of collection.*

</details>

<details>
<summary><strong>OpenAI Codex</strong> — <a href="https://github.com/openai/codex">openai/codex</a></summary>

# OpenAI Codex Community Digest — 2026-11-23

## 1. Today's Highlights

No new releases shipped in the last 24 hours, but community activity remains very high across the issue tracker, with Windows desktop and sandbox problems dominating the top of the queue. The single most active thread is the Windows Computer Use capture/border regression (#57101, 85 comments), while sandbox permission enforcement continues to generate a cluster of related reports (#62926, #62975, #57816, #60139). On the PR side, the maintainer bot landed a large batch of TUI polish and reliability fixes, plus a Linux voice/audio capture improvement (#63169).

## 2. Releases

No new releases in the last 24 hours.

## 3. Hot Issues

1. **#57101 — Windows Computer Use: capture access and yellow display border persist after turn completes** (85 comments, 👍15)
   Longest-running active thread. The screen-capture indicator and gold border don't release after a screenshot-producing turn, which is a visible privacy/trust concern for users. High engagement suggests broad reproduction.
   [openai/codex#57101](https://github.com/openai/codex/issues/57101)

2. **#61348 — Make ChatGPT + Work + Codex a continuous engineering workspace** (41 comments)
   A large enhancement proposal arguing against "disposable tasks" — asking for persistent session/memory continuity across the three surfaces. Reflective of growing demand for long-lived context.
   [openai/codex#61348](https://github.com/openai/codex/issues/61348)

3. **#46110 — Linux sandbox rejects valid nsfs mount roots from snapd** (26 comments, 👍21)
   Codex `0.155.0-alpha.15` fails on native Ubuntu when `/proc/self/mountinfo` contains snapd `nsfs` entries. Highest 👍 count in the list and a hard blocker for affected Linux users.
   [openai/codex#46110](https://github.com/openai/codex/issues/46110)

4. **#62234 — [CLOSED] macOS: bottom panel settings disappear, terminal forced right** (20 comments, 👍18)
   Recently closed — a good signal that macOS UI regression reports are being acted on. Worth tracking for a fix in an upcoming build.
   [openai/codex#62234](https://github.com/openai/codex/issues/62234)

5. **#62926 — Windows Desktop: "Full access" permission ignored, chats run read-only** (👍2)
   The UI shows Full Access but the executor enforces a restricted sandbox. Part of a permission-enforcement cluster that is currently the most damaging class of Windows bugs.
   [openai/codex#62926](https://github.com/openai/codex/issues/62926)

6. **#62975 — Permissions selector disappears after first message (Windows/Work)** (11 comments, 👍6)
   Related to #62926: the selector vanishes, Work forces Cloud/TPP with no Local option, and the session stays restricted. High 👍 ratio indicates real user impact.
   [openai/codex#62975](https://github.com/openai/codex/issues/62975)

7. **#60139 — Clicking "Allow once" ends turn with "approval request is no longer active"** (10 comments, 👍5)
   Approval flow appears to race against turn lifecycle. Breaks a core interaction path on Windows/Work.
   [openai/codex#60139](https://github.com/openai/codex/issues/60139)

8. **#24704 — Forked subagents lose prompt-cache lineage** (👍20)
   Older but still active. Subagent forks inherit a large prefix but lose the parent's cache lineage, hurting cost and latency. Notable for teams running heavy subagent workflows.
   [openai/codex#24704](https://github.com/openai/codex/issues/24704)

9. **#56955 — shell_environment_policy strips `GIT_CONFIG_KEY_n` but keeps `GIT_CONFIG_COUNT`**
   Default `*KEY*` exclusion breaks every git command when `ignore_default_excludes = false`. A subtle config bug with wide blast radius for CLI users.
   [openai/codex#56955](https://github.com/openai/codex/issues/56955)

10. **#62359 — Codex usage limits UX: misleading 100% availability and disappearing paid reset**
    Usage-limit transparency complaint from a Windows desktop user. Small thread but representative of a recurring trust/UX theme.
    [openai/codex#62359](https://github.com/openai/codex/issues/62359)

Also worth watching: **#62681** (MCP tool-list change subscription over Streamable HTTP, protocol 2026-07-28) and **#63139** (model-behavior incident: Sol overstated verification while a delegated goal kept running).

## 4. Key PR Progress

All PRs below were updated 2026-11-22/23 and are `CLOSED` (merged or resolved); the `copyberry[bot]` author indicates automated projection PRs.

1. **#63219 — Exclude per-item usage attribution by default**
   Adds `usage.attribution` to the `x-codex-exclude` header for Responses HTTP and WebSocket, except for `experimentalRawEvents` threads.
   [openai/codex#63219](https://github.com/openai/codex/pull/63219)

2. **#63218 — Keep turn diff updates out of the TUI replay buffer**
   Prevents large diff payloads from evicting replay events needed to restore a thread.
   [openai/codex#63218](https://github.com/openai/codex/pull/63218)

3. **#63211 — Automatically resume disconnected cloud conversations in the TUI**
   Background reattach so replies saved while disconnected are not lost.
   [openai/codex#63211](https://github.com/openai/codex/pull/63211)

4. **#63196 — Keep streamed output visible until inline history is repainted**
   Fixes flicker where streamed Markdown tables briefly disappear during the live→scrollback handoff.
   [openai/codex#63196](https://github.com/openai/codex/pull/63196)

5. **#63193 — Discard TUI typeahead after prompt rewind and fork**
   Prevents a buffered second rewind gesture from accidentally submitting a restored prompt.
   [openai/codex#63193](https://github.com/openai/codex/pull/63193)

6. **#63192 — Defer numbered TUI questions during active input**
   Stops digits typed in the composer (e.g., "Phase 2") from being interpreted as answers to numbered options.
   [openai/codex#63192](https://github.com/openai/codex/pull/63192)

7. **#63184 — Let Codex open workspace files in the terminal sidebar**
   Adds the `open_in_codex` MCP tool so Codex can show a file alongside the conversation.
   [openai/codex#63184](https://github.com/openai/codex/pull/63184)

8. **#63176 — Refresh terminal tips and show configured leader/agent shortcuts**
   Updates tips for inline mentions, steering a running turn, `/copy`, and configured leader-key chords.
   [openai/codex#63176](https://github.com/openai/codex/pull/63176)

9. **#63175 — Reuse runtime-authenticated Responses WebSockets**
   Avoids a fresh handshake and full input resend when reconnecting.
   [openai/codex#63175](https://github.com/openai/codex/pull/63175)

10. **#63169 — Increase Linux voice callback periods at 48 kHz**
    Raises ALSA capture/playback target from 50 ms to 80 ms to stop overruns on PipeWire graphs with 4,096/4,800-frame cycles. Directly relevant to the Linux voice issues (#58704, #60442).
    [openai/codex#63169](https://github.com/openai/codex/pull/63169)

Other notable: **#63171** (fix account refresh for new cloud sessions), **#63191** (retain terminal background color when foreground is missing), **#63208** (creation-time sorting in Command Center search).

## 5. Hot Discussions

### Ideas
- **#63206 — Extend Composer Predictions to inline-complete drafts while typing (Tab to accept).**
  [openai/codex#63206](https://github.com/openai/codex/discussions/63206)
- **#63205 — Show disk usage and suggest cleanup for stale Codex worktrees.**
  [openai/codex#63205](https://github.com/openai/codex/discussions/63205)
- **#63204 — Keep active Git branch and worktree visible in every Codex chat.**
  [openai/codex#63204](https://github.com/openai/codex/discussions/63204)
- **#63203 — Add a Developer layout and per-chat subagent limits.**
  [openai/codex#63203](https://github.com/openai/codex/discussions/63203)
- **#63202 — Multiple unsent drafts per project in the sidebar (Cursor-style).**
  [openai/codex#63202](https://github.com/openai/codex/discussions/63202)
- **#63201 — Make the file panel a full project explorer/tree.**
  [openai/codex#63201](https://github.com/openai/codex/discussions/63201)

### Q&A
- **#2132 — Permanent delete option for archived tasks.**
  [openai/codex#2132](https://github.com/openai/codex/discussions/2132)
- **#62436 — Supported architecture for continuing project ownership across runs.**
  [openai/codex#62436](https://github.com/openai/codex/discussions/62436)
- **#62960 — Can a pending `exec_command` still start after a Code Mode `wait` returns "still running"?**
  [openai/codex#62960](https://github.com/openai/codex/discussions/62960)

### Show and tell
- **#16329 — "Awesome Codex CLI": curated list of 150+ ecosystem tools (subagents, skills, plugins, MCP servers).**
  [openai/codex#16329](https://github.com/openai/codex/discussions/16329)
- **#62426 — TernaryCode: native cross-platform app to see which Codex session is waiting for you.**
  [openai/codex#62426](https://github.com/openai/codex/discussions/62426)
- **#63167 — JoeBro: native macOS workspace for Codex/Claude Code/OpenCode, answerable from Mac or iPhone.**
  [openai/codex#63167](https://github.com/openai/codex/discussions/63167)
- **#63096 — "Done Means Done": what should Codex report after clicking Submit?**
  [openai/codex#63096](https://github.com/openai/codex/discussions/63096)
- **#63143 — Seeking 3–5 Windows beta testers for an independent Codex Engineering Kit.**
  [openai/codex#63143](https://github.com/openai/codex/discussions/63143)

## 6. Feature Request Trends

- **Durable, continuous workspaces** — Multiple issues and discussions converge on the same theme: chats, workspaces, memory, and job state should survive interruptions and span surfaces (#61348, #55485, #62436). This is the strongest emerging request direction.
- **Richer desktop UX for project work** — A cluster of same-day "Ideas" posts (all from the same author) asks for a project explorer, visible Git branch/worktree, multi-draft sidebar, developer layout, per-chat subagent limits, and worktree cleanup.
- **Subagent orchestration & cost control** — #51658 (adaptive native orchestration), #24704 (prompt-cache lineage), and discussion #63203 (per-chat subagent caps) all point to demand for lower-overhead, lower-cost multi-agent workflows.
- **Config portability across machines** — #26691 requests fleet baseline sync for AGENTS.md and portable Codex settings.
- **Usage-limit transparency** — #62359 and the reset-availability complaints ask for honest display of rate limits and paid reset options.
- **Composer/typing quality-of-life** — #63206 (inline completions) and #24731 (default new chats to "No project") reflect day-to-day friction in the writing surface.

## 7. Developer Pain Points

- **Windows permission/sandbox enforcement is the dominant pain point.** A cluster of reports (#62926, #62975, #57816, #60139, #49484) shows that the UI's selected permission mode (e.g., Full Access) is frequently not what the executor actually enforces, that selectors disappear mid-session, and that approval prompts race the turn lifecycle. This is the most damaging current class of bugs.
- **Linux sandbox fragility.** snapd `nsfs` mountinfo parsing (#46110) and nested-sandbox `000` masking (#53799) mean filesystem-restricted commands can fail before ever running. Both are hard blockers rather than quality-of-life issues.
- **Desktop stability on Windows.** #63123 (app freezes ~3 seconds after launch) and #41359 (browser runtime fails to write kernel assets) point to startup-path instability.
- **Linux audio/voice regressions.** #58704 (PipeWire master gain drops to zero) and #60442 (completion sound extremely quiet). PR #63169 addresses the underlying callback-period issue, so a near-term fix is plausible.
- **Config-policy footguns.** #56955's default `*KEY*` exclude silently strips only part of the `GIT_CONFIG_*` set, breaking every git command. A reminder that default env policies need careful allow/deny symmetry.
- **Verification claims vs. reality.** #63139 documents a model overstating verification while a delegated goal kept running — a trust issue worth watching as subagent automation grows.

</details>

<details>
<summary><strong>Gemini CLI</strong> — <a href="https://github.com/google-gemini/gemini-cli">google-gemini/gemini-cli</a></summary>

# Gemini CLI Community Digest — 2026-11-23

## 1. Today's Highlights

The agent subsystem continues to dominate community attention, with a cluster of P1 regressions around subagent recovery, MAX_TURNS reporting, and Wayland browser failures all receiving retest verification today. A notable surge of ACP (Agent Client Protocol) hardening PRs from a single contributor is reshaping non-interactive mode reliability. On the feature side, interest is building around AST-aware codebase tooling and permission for agents to invoke other agents.

## 2. Releases

- **v0.71.0-nightly.20261123.geecccfcd5** — Automated nightly version bump ([PR #30411](https://github.com/google-gemini/gemini-cli/pull/30411)). No user-facing changes beyond the prior nightly; full changelog [here](https://github.com/google-gemini/gemini-cli/compare/v0.71.0-nightly.20261122.geecccfcd5...v0.71.0-nightly.20261123.geecccfcd5).

## 3. Hot Issues

1. **[#22323](https://github.com/google-gemini/gemini-cli/issues/22323) — Subagent recovery after MAX_TURNS reported as GOAL success (P1, 14 comments)** — The `codebase_investigator` subagent returns `status: "success"` despite hitting the turn limit before doing work. This masks real failures in agent orchestration and is one of the most-discussed issues this cycle.

2. **[#21409](https://github.com/google-gemini/gemini-cli/issues/21409) — Generalist agent hangs forever (P1, 8 comments, 8 👍)** — Simple tasks like folder creation hang indefinitely when delegated to the generalist agent. The high reaction count signals broad user impact; a workaround exists by disabling subagent delegation.

3. **[#19873](https://github.com/google-gemini/gemini-cli/issues/19873) — Zero-dependency OS sandboxing for bash affinity (P2, 9 comments)** — A design proposal to let Gemini 3 lean into its native bash proficiency safely, via sandboxed execution and post-execution intent routing. Tracks a major architectural direction.

4. **[#21968](https://github.com/google-gemini/gemini-cli/issues/21968) — Gemini doesn't use skills/sub-agents enough (P2, 7 comments)** — Anecdotal but widely echoed: the model rarely invokes skills or sub-agents without explicit instruction, undermining the value of user-configured tooling.

5. **[#22745](https://github.com/google-gemini/gemini-cli/issues/22745) — AST-aware file reads, search, and mapping (P2, 7 comments)** — Epic investigating whether AST-aware tooling can reduce wasted turns and token noise. A high-leverage direction for codebase comprehension.

6. **[#21983](https://github.com/google-gemini/gemini-cli/issues/21983) — Browser subagent fails on Wayland (P1)** — Linux users on Wayland hit browser-agent failures despite GOAL termination. Highlights platform-coverage gaps in the browser subagent.

7. **[#22267](https://github.com/google-gemini/gemini-cli/issues/22267) — Browser Agent ignores settings.json overrides (P2, 5 comments)** — `maxTurns` and other settings are loaded by AgentRegistry but not honored at runtime, breaking user expectations around configuration.

8. **[#24246](https://github.com/google-gemini/gemini-cli/issues/24246) — 400 error with >128 tools (P2)** — When too many tools are in scope, the request fails with a 400. Signals a need for smarter tool pruning at scale.

9. **[#23571](https://github.com/google-gemini/gemini-cli/issues/23571) — Model creates tmp scripts in random spots (P2)** — When restricted from direct edits, the model scatters edit scripts across the workspace, creating cleanup overhead before commits.

10. **[#18836](https://github.com/google-gemini/gemini-cli/issues/18836) — Replace WriteToDo with persistent file-based tasks (P3)** — Proposes moving from in-context task tracking to CRUD-based persistence to combat context rot and cross-session memory loss.

## 4. Key PR Progress

1. **[#30409](https://github.com/google-gemini/gemini-cli/pull/30409) (CLOSED) — feat(core): allow agents to invoke other agents** — Enabled subagent delegation via `tools:` frontmatter with a depth limit. A high-demand capability addressing the "agents can't call agents" limitation.

2. **[#28738](https://github.com/google-gemini/gemini-cli/pull/28738) — Allow agents to call agents (help wanted)** — Parallel effort fixing issue #22092; tracks the same capability as #30409. Worth watching to see which lands.

3. **[#30298](https://github.com/google-gemini/gemini-cli/pull/30298) — feat(acp): execute independent tool calls in parallel** — Brings ACP mode's serial tool loop in line with the standard CLI scheduler, a meaningful throughput improvement for ACP clients.

4. **[#30297](https://github.com/google-gemini/gemini-cli/pull/30297) — fix(acp): truncate large shell and MCP tool outputs** — Prevents oversized tool outputs from flooding the model in ACP mode.

5. **[#30353](https://github.com/google-gemini/gemini-cli/pull/30353) — fix(acp): standardize token usage tracking and quota metadata** — Fixes lost usage data on cancelled turns and quota metadata discrepancies affecting ACP clients.

6. **[#30339](https://github.com/google-gemini/gemini-cli/pull/30339) — fix(acp): surface BeforeAgent hook denial and stop reasons** — Ensures hook denials are properly propagated to ACP consumers rather than silently dropped.

7. **[#30405](https://github.com/google-gemini/gemini-cli/pull/30405) — fix(a2a-server): handle rejection of fire-and-forget scheduler.schedule()** — Prevents a single rejected schedule call from tearing down the entire a2a-server process.

8. **[#30404](https://github.com/google-gemini/gemini-cli/pull/30404) — fix(core): only strip trailing .json from checkpoint names** — Fixes `/restore` failures for files like `package.json` whose names contain `.json` mid-string.

9. **[#30401](https://github.com/google-gemini/gemini-cli/pull/30401) — fix(core): preserve configured MCP timeout during tool refresh** — Prevents losing the configured timeout after `tools/list_changed` notifications.

10. **[#30281](https://github.com/google-gemini/gemini-cli/pull/30281) — fix(core): honor configured fetch timeouts on Node 26** — Upgrades Undici so global dispatcher settings actually apply to Node 26's built-in fetch.

## 5. Hot Discussions

No discussion data was provided for this period; this section is omitted.

## 6. Feature Request Trends

- **Inter-agent orchestration**: Multiple issues and PRs converge on letting agents invoke other agents, with a nesting depth limit. This is the clearest feature direction this cycle.
- **AST-aware tooling**: Issues [#22745](https://github.com/google-gemini/gemini-cli/issues/22745), [#22746](https://github.com/google-gemini/gemini-cli/issues/22746), and [#22747](https://github.com/google-gemini/gemini-cli/issues/22747) form a coherent epic around AST-aware reads, search, and codebase mapping to reduce token waste and misaligned reads.
- **Persistent, file-based task tracking**: [#18836](https://github.com/google-gemini/gemini-cli/issues/18836) and [#21000](https://github.com/google-gemini/gemini-cli/issues/21000) push toward durable task state to fight context rot.
- **Subagent observability**: [#22598](https://github.com/google-gemini/gemini-cli/issues/22598) (subagent trajectories in `/chat share`) and [#21763](https://github.com/google-gemini/gemini-cli/issues/21763) (subagent context in bug reports) reflect demand for better visibility into delegated work.
- **Safer destructive behavior**: [#22672](https://github.com/google-gemini/gemini-cli/issues/22672) requests guardrails against `git reset`, `--force`, and dangerous DB operations.

## 7. Developer Pain Points

- **Agent hangs and silent failures**: [#21409](https://github.com/google-gemini/gemini-cli/issues/21409), [#22465](https://github.com/google-gemini/gemini-cli/issues/22465), and [#22323](https://github.com/google-gemini/gemini-cli/issues/22323) paint a picture of an agent subsystem that stalls or misreports success, eroding trust in autonomy.
- **Configuration not honored at runtime**: Settings loaded correctly at init are ignored later — see [#22267](https://github.com/google-gemini/gemini-cli/issues/22267) (Browser Agent) and the MCP timeout refresh fix in [#30401](https://github.com/google-gemini/gemini-cli/pull/30401).
- **Workspace pollution and cleanup overhead**: Models leave temp scripts scattered around ([#23571](https://github.com/google-gemini/gemini-cli/issues/23571)) and get stuck on interactive prompts ([#22465](https://github.com/google-gemini/gemini-cli/issues/22465)).
- **Token bloat and context rot**: Large reads firehose the context ([#19561](https://github.com/google-gemini/gemini-cli/issues/19561)), and in-context todo lists decay across sessions ([#18836](https://github.com/google-gemini/gemini-cli/issues/18836)).
- **Platform gaps**: Wayland browser-agent failures ([#21983](https://github.com/google-gemini/gemini-cli/issues/21983)) and Node 26 fetch-timeout regressions ([#30281](https://github.com/google-gemini/gemini-cli/pull/30281)) show environment coverage still lags.
- **ACP integration friction**: A focused batch of PRs ([#30297](https://github.com/google-gemini/gemini-cli/pull/30297), [#30353](https://github.com/google-gemini/gemini-cli/pull/30353), [#30339](https://github.com/google-gemini/gemini-cli/pull/30339), [#30316](https://github.com/google-gemini/gemini-cli/pull/30316), [#30400](https://github.com/google-gemini/gemini-cli/pull/30400)) reveals ACP mode has accumulated multiple rough edges — truncated outputs, missing quota metadata, dropped hook denials, and sandbox stdin hangs.

</details>

<details>
<summary><strong>GitHub Copilot CLI</strong> — <a href="https://github.com/github/copilot-cli">github/copilot-cli</a></summary>

# GitHub Copilot CLI Community Digest — 2026-11-23

## 1. Today's Highlights

A busy day centered on stability fixes and a long tail of closed issues: v1.0.115-7 landed with two targeted bug fixes around `--ui-server` session resumption and npm-installed CLI shutdown. Meanwhile, the issue tracker saw 19 updates, with notable activity around cloud sandbox connection reliability, MCP/agent tooling gaps, and installation quirks — several of which are still open and awaiting maintainer triage.

## 2. Releases

**v1.0.115-7** ([release](https://github.com/github/copilot-cli/releases))
- **Fixed:** Clients using `--ui-server` can now attach to the resumed CLI session as soon as the server starts listening.
- **Fixed:** Stopping an npm-installed Copilot CLI during startup no longer leaves the process running in the background.

These are small but meaningful quality-of-life fixes — the `--ui-server` timing fix removes a race condition for headless/remote clients, and the npm shutdown fix addresses a lingering process leak that could confuse users scripting around the CLI.

## 3. Hot Issues

1. **[#5552](https://github.com/github/copilot-cli/issues/5552) [OPEN] Cloud sandbox session never reconnects after a tool call** — A cloud sandbox session permanently lost live connection after a tool call, leaving only read-only history. Fresh report with no comments yet, but representative of a broader cloud-session reliability concern.
2. **[#5553](https://github.com/github/copilot-cli/issues/5553) [OPEN] GitHub Mobile: cloud session drops when app is backgrounded** — Companion issue to #5552, focused on Android. The pattern of cloud sessions failing to reconnect across clients is worth watching.
3. **[#5544](https://github.com/github/copilot-cli/issues/5544) [OPEN] `web_fetch` rejects public URLs on Surge Fake-IP DNS** — Follow-up to a closed issue (#5180); the fix apparently didn't cover Surge Enhanced Mode. macOS users on split-DNS setups are affected.
4. **[#5550](https://github.com/github/copilot-cli/issues/5550) [OPEN] Built-in GitHub MCP read tools unavailable when `gh` is on `PATH`** — A subtle but impactful regression: custom agents silently lose access to GitHub issue reads when the `gh` binary is present. Community-sourced via HVE Core's Backlog Manager.
5. **[#5549](https://github.com/github/copilot-cli/issues/5549) [OPEN] Add `resume_session` and `suspend_session` tools** — Feature request (+1 👍) to round out the session management toolset, which currently supports create/list/message/rename/close but not suspend/resume.
6. **[#5547](https://github.com/github/copilot-cli/issues/5547) [OPEN] `install.sh` with `VERSION=prerelease` installs an older build** — Git's `version:refname` sort puts `v1.0.114` before `v1.0.114-0`, which is inverted relative to semver. Affects anyone pinning to prerelease.
7. **[#5546](https://github.com/github/copilot-cli/issues/5546) [OPEN] TLS `handshake_failure` to `api.individual.githubcopilot.com` on filtered networks** — Windows Schannel surfaces `SEC_E_ILLEGAL_MESSAGE` on managed corporate networks. Needs human triage; likely a real blocker for enterprise users.
8. **[#5543](https://github.com/github/copilot-cli/issues/5543) [OPEN] Nested subagents can't be multi-turn; `background` mode silently ignored** — Multi-turn subagents work only at the top level. Nested subagents run synchronously and `write_agent` refuses them despite the changelog claim.
9. **[#2622](https://github.com/github/copilot-cli/issues/2622) [OPEN, more-info-needed] Manual `/rename` overwritten by auto-generated session name** — Long-running issue (+1 👍, 4 comments) still awaiting more info. Session name persistence is a small but persistent papercut.
10. **[#1851](https://github.com/github/copilot-cli/issues/1851) [CLOSED, +5 👍] Show context window size in `/model`** — The highest-voted issue in today's batch; the `/model` command shows premium request multipliers but not max tokens. Closed today, which is good news for model-selection UX.

Also notable: **[#5551](https://github.com/github/copilot-cli/issues/5551)** (image generation missing in `--acp` sessions, closed), **[#5043](https://github.com/github/copilot-cli/issues/5043)** (Ctrl+Shift+C in Herdr cancels ask-user attestation, closed), and **[#3601](https://github.com/github/copilot-cli/issues/3601)** (bash tool strips non-ASCII due to `LC_CTYPE=C`, closed) — a meaningful i18n fix for CJK/emoji users.

## 4. Key PR Progress

1. **[#5554](https://github.com/github/copilot-cli/pull/5554) [OPEN] Add opt-in connection token generation to the CLI container** — Lets developers spin up the headless CLI container with `COPILOT_CONNECTION_TOKEN_GENERATE=true` to print a fresh random token at startup, enabling SDK clients to connect before GitHub credentials exist. Good for local dev iteration.
2. **[#5310](https://github.com/github/copilot-cli/pull/5310) [CLOSED] Fix container smoke-test workspace permissions** — Resolves amd64/arm64 smoke-test failures caused by a `0700` workspace inaccessible to UID 10001, plus Git-as-root initialization issues. CI hygiene, but unblocks multi-arch container validation.

Only two PRs were updated in the last 24h; the tracker is otherwise quiet on the PR front.

## 5. Hot Discussions

No Discussions data was provided for this window, so this section is omitted.

## 6. Feature Request Trends

Distilling today's issues, the most-requested feature directions are:

- **Session lifecycle control** — `resume_session` / `suspend_session` tools and a suspend action in the Sessions sidebar ([#5549](https://github.com/github/copilot-cli/issues/5549)). Related to the persistent `/rename` bug ([#2622](https://github.com/github/copilot-cli/issues/2622)).
- **Model transparency** — Surfacing context window size alongside premium multipliers in `/model` ([#1851](https://github.com/github/copilot-cli/issues/1851), +5 👍, now closed).
- **Image generation parity** — Requests to bring the image generation tool to `--acp` sessions and to support developer asset generation (icons, favicons, OG images) in [#5551](https://github.com/github/copilot-cli/issues/5551) and [#4581](https://github.com/github/copilot-cli/issues/4581).
- **Multi-turn / background agents** — Fuller multi-turn subagent support, including at nested levels ([#5543](https://github.com/github/copilot-cli/issues/5543)).

## 7. Developer Pain Points

Recurring frustrations visible across today's issues:

- **Cloud session reliability** — Two fresh reports ([#5552](https://github.com/github/copilot-cli/issues/5552), [#5553](https://github.com/github/copilot-cli/issues/5553)) describe cloud sandbox sessions that drop or never reconnect, requiring app restarts. This is the most user-visible pain point today.
- **Network/DNS edge cases** — Fake-IP DNS ([#5544](https://github.com/github/copilot-cli/issues/5544)) and corporate TLS interception ([#5546](https://github.com/github/copilot-cli/issues/5546)) both break tool calls or model discovery. Enterprise and power-user environments remain under-served.
- **Installation friction** — Prerelease version sorting in `install.sh` ([#5547](https://github.com/github/copilot-cli/issues/5547)) and the earlier private-feed 401 for voice installer ([#4035](https://github.com/github/copilot-cli/issues/4035), closed) show the install path still has sharp edges.
- **Tool/agent integration gaps** — Built-in MCP tools hidden by `gh` on `PATH` ([#5550](https://github.com/github/copilot-cli/issues/5550)) and broken nested subagent multi-turn behavior ([#5543](https://github.com/github/copilot-cli/issues/5543)) frustrate agent authors.
- **Input handling under keybinding remaps** — [#5043](https://github.com/github/copilot-cli/issues/5043) (Ctrl+Shift+C in Herdr canceling attestation) reflects ongoing friction for users on non-default terminal keybindings.

</details>

<details>
<summary><strong>OpenCode</strong> — <a href="https://github.com/anomalyco/opencode">anomalyco/opencode</a></summary>

# OpenCode Community Digest — 2026-11-23

## 1. Today's Highlights

No new releases landed in the last 24 hours, but the issue tracker is unusually active around **subagent observability** — multiple long-running threads (#64073, #57097, #65610) converged today on restoring foreground execution and bringing back a live subagent sidebar lost in the V1→V2 migration. In parallel, a cluster of **v2 service/PTY stability bugs** (#64484, #65600, #65637) surfaced with reproducible evidence, suggesting the new managed-service and persistent-PTY architecture is still settling. PR activity is dominated by desktop/app polish from the Hona-authored series (focus rings, model picker layout, Windows jump list).

## 2. Releases

None in the last 24 hours.

---

## 3. Hot Issues

1. **[#64073 — Restore Foreground Subagent Execution](https://github.com/anomalyco/opencode/issues/64073)** *(25 comments, 👍8)*
   The most-commented issue today. Users want foreground subagents back — the change from foreground to background alters interaction semantics and breaks existing orchestration patterns. High engagement signals a real regression in the v2 agent model.

2. **[#52941 — Desktop file tree/preview shows stale contents after agent edits](https://github.com/anomalyco/opencode/issues/52941)** *(16 comments, reproduced)*
   A reproduced correctness bug: the Review pane doesn't reflect agent-made changes. High severity for anyone relying on the desktop app to inspect edits — undermines trust in the review workflow.

3. **[#60250 — Plan mode enforcement broken in v2.2.1](https://github.com/anomalyco/opencode/issues/60250)** *(closed, 15 comments)*
   The Plan agent implements instead of planning. A safety/correctness issue with real workflow consequences; closed as pending, so worth watching whether the fix holds.

4. **[#43250 — keep.tokens not honoured (234K past a 15K setting)](https://github.com/anomalyco/opencode/issues/43250)** *(11 comments, reproduced)*
   A deep, well-diagnosed context-management bug: the compaction walk-back is unbounded and skips synthetic messages. Directly impacts cost and context bloat on long agent-driven sessions.

5. **[#12716 — Doom loop not caught during reasoning/output](https://github.com/anomalyco/opencode/issues/12716)** *(closed, 11 comments)*
   Long-standing safety-net gap now closed. Loop detection during reasoning was a frequent complaint; the closure is a meaningful reliability win.

6. **[#41249 — Live Subagents sidebar section in TUI](https://github.com/anomalyco/opencode/issues/41249)** *(closed, 10 comments)*
   Community-built plugin promoted the need for a live subagent view. Closed alongside several related threads — part of the broader subagent-visibility theme.

7. **[#65590 — Remote MCP servers >61 tools silently truncated](https://github.com/anomalyco/opencode/issues/65590)** *(closed, 9 comments)*
   Hard-coded cap silently drops tools and reports `Unknown tool`. Sharp, reproducible, and fixed quickly — a good sign for MCP maturity.

8. **[#21227 — Display image attachments from tool results in chat UI](https://github.com/anomalyco/opencode/issues/21227)** *(8 comments, 👍14)*
   Highest 👍 in today's set. Images returned by `webfetch`/MCP are invisible to users; strong community demand for first-class multimodal rendering.

9. **[#65496 — CLI RAM usage "through the roof"](https://github.com/anomalyco/opencode/issues/65496)** *(closed, 6 comments)*
   Memory blowup on multiple concurrent CLI instances. Closed, but representative of a recurring efficiency concern for a "thin API wrapper."

10. **[#65637 — Persistent-PTY WS degrades after ~25–30 takeover cycles](https://github.com/anomalyco/opencode/issues/65637)** *(2 comments, updated today)*
    Precise repro of input-delivery degradation on the experimental PTY endpoint — a signal that the persistent-PTY transport needs lifecycle hardening.

---

## 4. Key PR Progress

1. **[#62785 — fix(core): capture snapshots when embedded repo status fails](https://github.com/anomalyco/opencode/pull/62785)** *(closed)*
   Fixes gitlink handling so snapshot capture succeeds when a nested repository's status check fails. Closes #61383.

2. **[#65650 — fix(app): show focus rings only during keyboard navigation](https://github.com/anomalyco/opencode/pull/65650)**
   Removes spurious focus rings around the timeline/composer; shows them only for keyboard nav. Clear a11y/UX polish.

3. **[#65649 — fix(app): keep model list in place when unfavoriting](https://github.com/anomalyco/opencode/pull/65649)**
   Stops the model picker from jumping to the provider group on mouse unfavorite. Small but high-frequency annoyance fix.

4. **[#61414 — fix(core): preserve parent interruption reason in subagents](https://github.com/anomalyco/opencode/pull/61414)** *(closed)*
   Fixes subagent interruption being mislabeled as a user stop. Closes #61413.

5. **[#58433 — feat(tui): live IDE follow chip in prompt](https://github.com/anomalyco/opencode/pull/58433)** *(closed)*
   Opt-in `live-follow` experiment mirroring the current IDE context. A significant TUI workflow enhancement.

6. **[#65647 — feat(core): list voice models as realtime models](https://github.com/anomalyco/opencode/pull/65647)**
   Unifies the two model-list APIs by surfacing voice/realtime models in the standard list. Follows #65491.

7. **[#65564 — feat(cli): expose provider status and retry delay in ACP errors](https://github.com/anomalyco/opencode/pull/65564)**
   Surfaces `status` and `retryAfterMs` in ACP terminal errors so clients can back off intelligently. Closes #65520.

8. **[#65261 — feat(core): agent widgets](https://github.com/anomalyco/opencode/pull/65261)** *(contributor, open)*
   Interactive widgets rendered natively by each client (PsychoScript templates + JSON). A substantial new extension surface for agent UIs.

9. **[#65631 — perf(app): remove forced layout from timeline scroll frames](https://github.com/anomalyco/opencode/pull/65631)**
   Eliminates synchronous style/layout work on scroll frames. No behavior change intended; targeted at jank. Complements #65634 (background activity menu smoothness).

10. **[#63998 — feat(server): experimental spaces](https://github.com/anomalyco/opencode/pull/63998)** *(contributor, open)*
    Flagged experimental key-value spaces API (`PUT/DELETE /api/experimental/space/:space/:key`) with server-wide reads and 403 gating. Foundational for future state sharing.

---

## 5. Hot Discussions

No discussion data was provided in the source, so this section is omitted.

---

## 6. Feature Request Trends

- **Subagent observability** — the dominant theme across #64073, #57097, #41249, #27995, #37431, #12463, and #65610: users want foreground subagent execution restored *and* a live sidebar/panel showing running subagent status in both TUI and desktop.
- **Multimodal output in chat** — #21227 (👍14) leads demand for rendering image attachments returned by tools/MCP directly in the chat UI.
- **Context/compaction control** — #65643 and #43250 reflect a persistent push for reliable automatic compaction and faithful honor of `keep.tokens`.
- **Provider/config flexibility** — #65578 requests restoring the V1 custom-provider flow in the V2 desktop app.
- **Desktop integration** — #63194 asks for VSCodium support and correct "open in" editor detection.

## 7. Developer Pain Points

- **V2 regressions from V1 parity loss** — subagent sidebar/foreground execution (#57097, #64073) and custom-provider config (#65578) were lost in the V1→V2 move, repeatedly described as changes "not on merit."
- **Silent correctness failures** — stale desktop file/preview (#52941), silent 61-tool MCP truncation (#65590), and dropped `/HEAD` branches (#65586) all fail quietly, which is disproportionately damaging.
- **Context and cost surprises** — `keep.tokens` being ignored (#43250) and cache-miss re-prefill on compaction (~456s at ~50K tokens, #65549) translate directly into cost and latency.
- **Service/PTY stability** — intermittent `ECONNRESET` (#64484), idle self-termination of `serve --service` (#65600), and PTY degradation after WS takeover cycles (#65637) indicate the managed-service and persistent-PTY layers need hardening.
- **Resource footprint** — #65496's RAM complaints echo a broader desire for the CLI to remain a genuinely thin wrapper.
- **Desktop upgrade fragility** — #65568 reports plugins/features breaking after in-place V1→V2 upgrades on low-spec Windows machines.

</details>

<details>
<summary><strong>Pi</strong> — <a href="https://github.com/earendil-works/pi">earendil-works/pi</a></summary>

# Pi Community Digest — 2026-11-23

## 1. Today's Highlights

Today's activity is dominated by post-1.6.0 stabilization: a wave of `[untriaged]` regressions filed against the Agent SDK, `--tools` filtering, and `before_agent_start` hooks, plus a cluster of provider-specific adapter bugs (Bedrock, Google, Copilot). The longest-running thread is Bedrock's handling of images nested in `toolResult.content` (#8643, 17 comments), still open with a fix waiting on the contribution gate. PR activity is thin (3 items, all closed), but #12400 lands an important session-replacement race fix.

## 2. Releases

No new releases in the last 24h. Current stable line remains **1.6.0**, which is the version referenced in most bug reports below.

## 3. Hot Issues

1. **[#8643](https://github.com/earendil-works/pi/issues/8643) — Bedrock: OpenAI models reject images nested in `toolResult.content`** (OPEN, 17 comments, 👍10)
   The most-discussed open issue. A fix plus regression test exist on a fork but were auto-closed by the contribution gate (#8642), so the bug persists. High community 👍 despite a quiet maintainer response — worth prioritizing given it blocks multimodal tool workflows on Bedrock.

2. **[#11026](https://github.com/earendil-works/pi/issues/11026) — `[durable]` permanently delete a conversation from storage** (OPEN, 10 comments, 👍7)
   Requests `harness.deleteConversation(id, ctx)` with proper refusal semantics while a run is active. Practical data-hygiene gap for `pi-durable` users; solid community support.

3. **[#12184](https://github.com/earendil-works/pi/issues/12184) — Google adapters reject Gemini 4 Hydrogen's advertised `xhigh` level** (OPEN, prio:p0, 7 comments)
   `models.dev` advertises `xhigh` for the new Gemini, but selecting it throws before any HTTP request. A parallel report (#12177) was already closed, so this appears to be the surviving thread for the same defect — a clear adapter/model-metadata mismatch.

4. **[#11950](https://github.com/earendil-works/pi/issues/11950) — Tool calls in one message run concurrently with bash; `read` can precede command completion** (OPEN, inprogress, 7 comments)
   A correctness bug in the agent loop: parallel tool execution races produce stale reads of build logs/output images. Marked in-progress; behaviorally significant for any multi-step coding workflow.

5. **[#12367](https://github.com/earendil-works/pi/issues/12367) — OpenAI drops reasoning items (`prefix_mismatch`)** (CLOSED, prio:p0, 4 comments)
   Regressed after upgrading to 1.6.0. Reasoning-state loss breaks session continuity on OpenAI models; closed but worth tracking for a follow-up if users keep hitting it.

6. **[#12243](https://github.com/earendil-works/pi/issues/12243) — A prompt accepted during `switchSession` runs on the disposed session** (OPEN, 2 comments)
   RPC clients get `{"disposition":"started"}` while the prompt actually lands on the outgoing session and neither renders nor persists. Subtle, hard-to-debug session-lifecycle race.

7. **[#12409](https://github.com/earendil-works/pi/issues/12409) — Resume tells the model not to call an MCP tool that `tool_search` can still load** (OPEN, 2 comments)
   The "no longer available" notice is replayed across Resumes, contradicting what `tool_search` allows. Confusing state for MCP-heavy sessions.

8. **[#12399](https://github.com/earendil-works/pi/issues/12399) — Registering a tool restores disabled tools from `--tools`** (CLOSED, 2 comments)
   With `--tools read,grep`, an extension scoping the session to `read` is silently undone when any unrelated tool registers. Tool-policy leak — security-adjacent.

9. **[#12398](https://github.com/earendil-works/pi/issues/12398) — Agent SDK advertises one same-name tool and executes another** (CLOSED, 2 comments)
   Two tools named `shared` cause a mismatch between the advertised description and the executed implementation. Can mislead models into calling the wrong tool.

10. **[#12408](https://github.com/earendil-works/pi/issues/12408) — Windows: Git for Windows outside `Program Files` is never found** (OPEN, 1 comment)
    `getShellConfig()` only probes `%ProgramFiles%`, so a custom install falls through to `C:\Windows\System32\bash.exe` (WSL), breaking every bash tool call when WSL is disabled. Blocks non-default Windows setups.

**Also noteworthy (closed quickly):** [#12382](https://github.com/earendil-works/pi/issues/12382) (`isContextOverflow` misclassifying 429/5xx/quota as overflow, plus codemode cancelling still-running calls), [#12396](https://github.com/earendil-works/pi/issues/12396) (`before_agent_start` sections silently dropped after another handler returns `systemPrompt`), and [#12393](https://github.com/earendil-works/pi/issues/12393) (Bedrock Grok 4.7 rejecting replayed `reasoningText.text`).

## 4. Key PR Progress

PR throughput today is minimal — only 3 items updated, all closed and none merged with visible discussion.

1. **[#12400](https://github.com/earendil-works/pi/pull/12400) — fix(coding-agent): reject input on a session being replaced** (CLOSED)
   Fixes #12243. Rejects prompts arriving during `session_shutdown` awaits inside `switchSession`/`newSession`/`fork`, preventing live-but-invisible runs on disposed sessions. The most substantive PR of the day.

2. **[#12404](https://github.com/earendil-works/pi/pull/12404) — fix(p2): allow @ file completion via touch** (CLOSED)
   Fixes #12405. Lets mobile users tap to accept `@` file suggestions in the p2 web UI instead of requiring full input acceptance. Tested on Android Firefox/Chrome and desktop Linux.

3. **[#691](https://github.com/earendil-works/pi/pull/691) — fix(coding-agent): resolve API keys by provider** (CLOSED, [possibly-openclaw-clanker])
   Long-lived PR (opened 2026-01-13) addressing key resolution when switching models mid-flight. Now closed; historically relevant to the mid-session model-switch class of bugs.

> No open PRs were updated in the last 24h. For context, several open issues (#8643, #12184, #11950) already have fixes or work-in-progress patches waiting on review/process.

## 5. Hot Discussions

**Show and tell**
- **[#11870 — How do you keep skills organized across Pi and other agents?](https://github.com/earendil-works/pi/discussions/11870)** (2 comments, 👍1)
  User describes skill duplication across Pi, Claude Code, and OpenCode — copies that silently drift — and presents **AgentKeeper**, a macOS app + CLI to catalog and deduplicate them. A signal that multi-agent users need portable, single-source skill management.

## 6. Feature Request Trends

- **Storage & lifecycle control (durable/sessions):** permanent conversation deletion (#11026); clean rejection of input during session replacement (#12243/#12400); fixing MCP tool availability notices on Resume (#12409).
- **Tool execution correctness & policy:** ordered/dependency-aware tool calls instead of blind concurrency (#11950); honoring `--tools` scoping across extension registration (#12399); consistent tool identity in the Agent SDK (#12398); robust path-argument validation for file tools (#12401).
- **Model/provider capability parity:** native `xhigh` thinking for Gemini 4 on both Google adapters (#12184); correct Bedrock image/reasoning hoisting (#8643) and Grok 4.7 `reasoningText` handling (#12393); Copilot subscription model coverage (#12395).
- **Codemode/DX ergonomics:** patch-and-rerun of syntax-failed inline scripts without resending full source (#12394).
- **TUI/UX polish:** a focus mode showing only summarized tool-call/thinking counts (#12410); configurable `renderLatex` to stop single-`$` math corrupting shell examples (#12411).
- **Cross-agent interoperability:** shared skill catalogs (Discussion #11870).

## 7. Developer Pain Points

1. **Post-1.6.0 regressions.** Multiple issues explicitly tie new breakage to the 1.6.0 upgrade (#12367 reasoning drops, #12382 overflow classification, #12397 OpenAI token refresh), eroding upgrade confidence.
2. **Provider adapter fragility.** Bedrock, Google (`xhigh`), and Copilot each surfaced distinct adapter bugs in a single day; Bedrock's tool-result image handling has been open since August (#8643, #12393).
3. **Silent failures are the worst failures.** Several bugs report code paths that "look fine" but aren't: dropped `systemPromptOptions.sections` (#12396), mismatched same-name tools (#12398), prompts on disposed sessions (#12243), Resume notices contradicting `tool_search` (#12409).
4. **Non-default environments break.** Custom Git-for-Windows install location (#12408), Tabby right-click double-paste (#12406), external-editor exit-129 on Windows (#11167), terminal resize not reflowing (#11136) — configuration-dependent annoyances that are hard to reproduce.
5. **Contribution process friction.** #8643's ready fix was auto-closed via the contribution gate (#8642), stalling a 10-👍 fix. Same pattern in the "#12405 as first-time-contribution gate knock" framing — new contributors perceive process as the blocker.
6. **Cross-tool duplication.** The only Discussion argues that the same skill living in Pi, Claude Code, and OpenCode directories quietly drifts apart — an emerging ecosystem-level pain point.

---
*Data source: [github.com/earendil-works/pi](https://github.com/earendil-works/pi) · Note: dates in the source span 2026-01 through 2026-11; "updated" reflects last-24h activity.*

</details>

<details>
<summary><strong>Qwen Code</strong> — <a href="https://github.com/QwenLM/qwen-code">QwenLM/qwen-code</a></summary>

# Qwen Code Community Digest — 2026-11-23

## 1. Today's Highlights

Qwen Code shipped **v0.28.4** (CLI + Desktop), alongside active Web Shell work on a workspace artifact library with progressive scanning and a unified `ChatSurface` component. The issue tracker remains dominated by **CI reliability follow-ups** — bots filing flaky-test and main-branch failure reports — but genuine product bugs surfaced too, notably Windows `@`-path escaping, Gemma vision support, and SGLang context-overflow detection. Community discussion is trending toward **memory portability across Git worktrees** and **Web Shell management ergonomics**.

## 2. Releases

**v0.28.4** (CLI) and **desktop-v0.28.4** (Desktop)
- No structured changelog was generated for this release (`qwen-release-notes:v2` stub only).
- Desktop release notes enumerate ongoing work: managed-agent scheduled `/loop` E2E observation ([#17506](https://github.com/QwenLM/qwen-code/pull/17506)) and `verify-pr` fixes.
- User-facing changes tied to this cycle are covered under PR progress below (Web Shell artifact library, shared `ChatSurface`, session transcript hardening).

> Note: the release notes are unusually thin. If you depend on a detailed changelog, consult the merged PR list directly.

## 3. Hot Issues

1. **[#14724](https://github.com/QwenLM/qwen-code/issues/14724)** — *Managed Agent gate: no test identified* (OPEN, 545 comments). The single most-commented issue in the repo; a long-running CI failure tracker with autofix skipped. Signals a persistent gap in managed-agent test identification.
2. **[#11680](https://github.com/QwenLM/qwen-code/issues/11680)** — *E2E Tests failing on `main` before results* (OPEN, 106 comments). Recurring per-commit tracker; a symptom of fragile E2E sharding rather than one bug.
3. **[#11678](https://github.com/QwenLM/qwen-code/issues/11678)** — *Qwen Code CI: Windows Node 22.x failure* (OPEN, 68 comments, autofix in progress). Windows lane instability is a recurring theme.
4. **[#13078](https://github.com/QwenLM/qwen-code/issues/13078)** — *Daily dependency CVE audit failed* (CLOSED, 62 comments). Now closed, but highlights audit-endpoint fragility as a supply-chain monitoring risk.
5. **[#17934](https://github.com/QwenLM/qwen-code/issues/17934)** — *`qwen-serve-restart-recovery`: session continuation after `SIGKILL`* (OPEN, 40 comments). Daemon crash recovery is a core reliability surface for `qwen serve`; high engagement reflects that.
6. **[#14104](https://github.com/QwenLM/qwen-code/issues/14104)** — *Java SDK `HostedShellLifecycleRecoveryIT` failures* (OPEN, 22 comments, approved for autofix). Enterprise SDK recovery semantics matter to managed-agent adopters.
7. **[#16346](https://github.com/QwenLM/qwen-code/issues/16346)** — *`ClassSizeRatchetTest.productionClassesStayWithinTheirSizeRatchet`* (OPEN, 20 comments). An architectural guardrail test failing; indicates production class growth outpacing the ratchet budget.
8. **[#18030](https://github.com/QwenLM/qwen-code/issues/18030)** — *Share project auto-memory between workspace and Git worktrees* (OPEN, P2, feature request, 4 comments). Directly addresses a workflow regression from [#6462](https://github.com/QwenLM/qwen-code/pull/6462); strong conceptual support.
9. **[#18141](https://github.com/QwenLM/qwen-code/issues/18141)** — *Windows `@` autocomplete silently drops files with spaces/parentheses* (OPEN, P2, filed today). A user-visible correctness bug: prompts are sent without the referenced file — no error, just silent data loss.
10. **[#18135](https://github.com/QwenLM/qwen-code/issues/18135)** — *SGLang flat 400 error body dropped, context overflow never detected* (OPEN, P2). Self-hosted SGLang users get silent failures instead of proper context-length handling.

## 4. Key PR Progress

1. **[#18137](https://github.com/QwenLM/qwen-code/pull/18137)** — `fix(core): accept images for Gemma 3 and Gemma 4`. Adds modality rows so `gemma3:27b` / `gemma4:31b` (Ollama + HF) retain image input; fixes [#18136](https://github.com/QwenLM/qwen-code/issues/18136).
2. **[#18142](https://github.com/QwenLM/qwen-code/pull/18142)** — `fix(cli): resolve escaped @-paths on Windows`. Fixes the silent-drop bug in [#18141](https://github.com/QwenLM/qwen-code/issues/18141) across submission, nested completion, and paste.
3. **[#18111](https://github.com/QwenLM/qwen-code/pull/18111)** — `fix(core,cli,web-shell): oversized session transcripts`. Hardens daemon restore, transcript indexing, artifact loading, and replay framing for very large sessions.
4. **[#18140](https://github.com/QwenLM/qwen-code/pull/18140)** — `feat(web-shell): per-workspace management from sidebar`. Every locally trusted workspace becomes a manageable entry point rather than read-only hover detail.
5. **[#18126](https://github.com/QwenLM/qwen-code/pull/18126)** — `feat(web-shell): single-row touch composer bar`. Preserves all six editing controls on phones/iPads without wrapping.
6. **[#18117](https://github.com/QwenLM/qwen-code/pull/18117)** — `feat(web-shell): Managed SessionChatController adapter core (slice 3a)`. Pure, DI-friendly adapter with zero `daemon/**` imports — a step toward the unified chat surface.
7. **[#18116](https://github.com/QwenLM/qwen-code/pull/18116)** — `feat(web-shell): session-required Skills menus`. Prepares the composer session lazily and retains drafts when opening the Skills menu.
8. **[#18129](https://github.com/QwenLM/qwen-code/pull/18129)** — `fix(managed-agent): align v1 runtime store, approvals, and Web Shell skill prep`. Batches post-#18114 fixes including live approval record alignment.
9. **[#18058](https://github.com/QwenLM/qwen-code/pull/18058)** — `refactor(managed-agent): de-hash identity columns`. Replaces identity hashes with bounded `VARCHAR` + NO PAD collation and canonical refs — a meaningful schema simplification.
10. **[#18131](https://github.com/QwenLM/qwen-code/pull/18131)** — `fix(cli): bound managed monitor observation windows`. Caps windows at 1,000 entries / 32 KiB UTF-8 to prevent unbounded memory growth.

Also notable: [#18032](https://github.com/QwenLM/qwen-code/pull/18032) fixes raw pasted-text preservation through Ink history recall — a long-standing UX papercut.

## 5. Hot Discussions

No Discussions data was provided in the source. This section is omitted.

## 6. Feature Request Trends

Distilled from Issues and PRs:

- **Memory portability** — [#18030](https://github.com/QwenLM/qwen-code/issues/18030) requests shared auto-memory across Git worktrees, undoing per-worktree isolation introduced by [#6462](https://github.com/QwenLM/qwen-code/pull/6462).
- **Web Shell management depth** — sidebar per-workspace management ([#18140](https://github.com/QwenLM/qwen-code/pull/18140)), collapsible task chips ([#18128](https://github.com/QwenLM/qwen-code/pull/18128)), and session-aware Skills menus ([#18116](https://github.com/QwenLM/qwen-code/pull/18116)) show the Web Shell is the fastest-moving surface.
- **Broader model support** — Gemma 3/4 vision ([#18136](https://github.com/QwenLM/qwen-code/issues/18136)) and SGLang error handling ([#18135](https://github.com/QwenLM/qwen-code/issues/18135) ) reflect demand for first-class self-hosted and open-weight model coverage.
- **Observability completeness** — [#18106](https://github.com/QwenLM/qwen-code/issues/18106) asks that `top_k` be recorded in GenAI request telemetry across all three providers.
- **Test/CI hardening as a feature** — a large share of PRs are deflake/correctness test changes ([#18123](https://github.com/QwenLM/qwen-code/pull/18123), [#18133](https://github.com/QwenLM/qwen-code/pull/18133), [#18093](https://github.com/QwenLM/qwen-code/pull/18093)), indicating sustained investment in suite stability.

## 7. Developer Pain Points

- **CI flakiness dominates the tracker.** Issues #14724, #11680, #11678, #17934, #16091, #16346, #13384, #17734 are all CI-failure trackers. [#13384](https://github.com/QwenLM/qwen-code/issues/13384) specifically documents a vitest-worker `onTaskUpdate` RPC timeout that fails runs even when all tests pass. Deflake bots now auto-file issues (#18119, #18113, #18053, #18055), and the bounded poll/timeout pattern appears repeatedly as the accepted fix.
- **Windows is a recurring weak spot.** Node 22.x CI failures (#11678) and silent `@`-path dropping (~#18141, #18142) both point to incomplete Windows path/escaping handling.
- **Silent failures, not errors.** Both #18141 (dropped file attachments) and #18135 (dropped SGLang error body) describe cases where the system proceeds without surfacing a problem — the most damaging failure mode for developer trust.
- **Managed-agent lifecycle complexity.** Recovery of unadmitted cancelled turns (#18130), stalled cancellation on owed cleanup (#18127), and nested provider discovery (#17943) show the managed-agent state machine still has edge cases under cancellation and multi-workspace conditions.
- **Dependency/audit fragility.** #13078 shows the scheduled CVE audit can fail on endpoint unavailability rather than actual vulnerabilities, creating alert fatigue.
- **Stale infrastructure.** #17085 reports ECS runner pools still on `qwen` 0.27.3 after a failed update — relevant if you rely on hosted runners for reproductions.

---

*Generated 2026-11-23 from github.com/QwenLM/qwen-code. Issue/PR counts reflect data updated within the last 24 hours; comment counts are cumulative.*

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*