# AI CLI Tools Community Digest 2026-11-12

> Generated: 2026-11-12 02:12 UTC | Tools covered: 7

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
**Date: 2026-11-12 | Sources: 7 community digests (Claude Code, OpenAI Codex, Gemini CLI, GitHub Copilot CLI, OpenCode, Pi, Qwen Code)**

---

## 1. Ecosystem Overview

The AI CLI tooling landscape has entered a **hardening-and-parity phase**: releases are increasingly incremental (point/alpha bumps, PTY daemon patches) while community energy concentrates on reliability, permissions, and multi-agent coordination rather than headline features. Across all seven trackers, **trust-eroding bugs dominate**: silent subagent failures, config that doesn't take effect at runtime, and permission classifiers that over-block legitimate work recur in every community. A clear **Windows and ARM64/Linux-6.12 pain cluster** appears in Codex, Copilot CLI, OpenCode, and Pi, suggesting platform QA debt industry-wide. Simultaneously, an emerging **cross-harness ecosystem layer** is visible — MCP event buses, hook-based policy gates, shared coordination servers (Concord), and patch-preservation tools — signaling that developers now run multiple agents concurrently and need infrastructure between them. Meanwhile, Qwen Code's 1.0 Preview and OpenCode's v2 rollout show the OSS challengers consolidating toward production-grade agent architectures.

---

## 2. Activity Comparison

| Tool | Issues (updated 24h) | PRs (updated 24h) | Discussions | Releases (24h) | Release Status |
|---|---|---|---|---|---|
| **Claude Code** | ~50 reported; 10 shown | 1 (closed, unmerged) | N/A (none provided) | 0 | No release; entitlement bug churn |
| **OpenAI Codex** | 10+ shown (heavy activity) | 10+ (all `copyberry[bot]`, batch-hardening) | Yes — Ideas, Q&A, Show-and-tell active | **7** (1 substantive + 6 alpha) | Fast-moving alpha pipeline |
| **Gemini CLI** | 10+ shown (~30 updated) | 10+ shown (~20 updated) | N/A (none provided) | 0 | No release; PR-heavy week |
| **GitHub Copilot CLI** | 41 updated (30 shown) | 0 | N/A | **2** (prerelease) | Incremental quality fixes |
| **OpenCode** | ~50 updated | 10+ (feature-heavy) | N/A (none provided) | **1** (`process-daemon-v0.5.2`) | v2 rollout in progress |
| **Pi** | 50 updated | 23 updated | Yes — Show-and-tell (Concord integration) | 0 | No release; subsystem maturation |
| **Qwen Code** | 10+ shown (CI-dominated) | 10+ (architectural) | N/A (none provided) | **1** (`v1.0.0-preview`) | Major preview launch |

**Notes:**
- Claude Code, Gemini CLI, GitHub Copilot CLI, and Qwen Code had **no Discussions data provided** in the source digests. These are marked "N/A" rather than "inactive" — absence of reported data is not evidence of an empty channel.
- **OpenAI Codex** and **Pi** are the only tools with confirmed active Discussions in this snapshot; Codex's Show-and-tell is the single richest source of ecosystem-level innovation (see §3).
- Codex's PR count is inflated by `copyberry[bot]` automated fixes — a **coordination signal** (hardening push) more than a contributor-count signal.
- Qwen Code's issue activity is dominated by CI bot churn (#14724 at 325 comments), so raw counts overstate human engagement.

---

## 3. Shared Feature Directions

The following requirements appear across **three or more** communities, indicating genuine ecosystem-level demand:

### 3.1 Multi-Agent Coordination & Guardrails
- **Codex** (Show-and-tell: `claude-bulkhead`, `Concord`, `Pushary`, `TreeHarbor`), **Pi** (Concord integration discussion #12063), **OpenCode** (subagent concurrency cap #63227), **Gemini CLI** (parallel/shared-memory subagents #18287), **Qwen Code** (workflow agent permission reliability #16425).
- **Need:** shared work-state across harnesses, file-claim coordination, hook-based policy gates, and bounded subagent concurrency to prevent runaway cost and agents killing each other's processes.

### 3.2 Config Honored at Runtime
- **Claude Code** (autocompact override persists, #108987; `settings.json` restarts), **OpenCode** (`default_agent` silently reverts, #62002; 5s vs 30s MCP timeout doc drift, #63092), **Gemini CLI** (browser agent ignores `settings.json`, #22267), **Qwen Code** (docs say restart needed, hot-reload works, #16925).
- **Need:** live config application and consistency between discovery/registration layers and execution layers.

### 3.3 Permission / Safety Classifier False Positives
- **Claude Code** (Cowork email blocks #98287; desktop MCP refusals #108921; repeated "false positive" reports), **Codex** (auto-review scope over-retention #58422), **Copilot CLI** (HTTP 422 cybersecurity flags on flaky-test debugging #5335), **Qwen Code** (Read deny rules leak through grep/glob #16653).
- **Need:** precise, auditable permission scopes with review paths — not blanket over-blocking of owner-authorized actions.

### 3.4 Remote / SSH / Headless Automation
- **Codex** (scheduled tasks over SSH #34946, auto-connect #59931), **Claude Code** (cloud scheduled tasks #98287), **Gemini CLI** (headless-mode suspension anxiety #20813; `/skill-name` in non-interactive mode #29546), **Qwen Code** (Managed Agent parity: web terminal, client filesystems, durable `/loop`).
- **Need:** first-class non-interactive execution for CI/scripted/remote use, with clear ToS and permission semantics.

### 3.5 Subagent Observability & Correctness
- **Gemini CLI** (#22323 MAX_TURNS misreported as GOAL success; #21983 Wayland false success), **Claude Code** (silent failures theme), **OpenCode** (session history search #63411), **Pi** (`queue_update` for discarded injected input #10317), **Qwen Code** (verify-then-repair loop #16941).
- **Need:** agents that accurately report their own failure/interruption state — currently the most trust-damaging bug class for power users.

### 3.6 Cost / Usage-Window Controls
- **Codex** (5-hour vs weekly window choice, #60953/#60954), **Claude Code** (disable cash Usage Credits #92087; 1M context credit errors), **OpenCode** (subagent concurrency cap; OpenCode Go account auto-balancing #63354).
- **Need:** user-selectable usage windows and predictable consumption.

### 3.7 Cross-Platform Polish (Windows / ARM64 / Wayland)
- **Codex** (6 of top 10 issues Windows-tagged), **Copilot CLI** (WSL2 ARM64 clipboard #3534; aarch64 ENOEXEC #5424), **Gemini CLI** (Wayland #21983; PowerShell freeze #30247), **Pi** (Windows `pi -p` hang #12068), **OpenCode** (Windows install/upgrade friction).
- **Need:** parity in sandboxing, install, and terminal handling outside macOS/Linux-x64.

---

## 4. Differentiation Analysis

| Dimension | Claude Code | OpenAI Codex | Gemini CLI | Copilot CLI | OpenCode | Pi | Qwen Code |
|---|---|---|---|---|---|---|---|
| **Primary user** | Individual Pro + org devs; VS Code-centric | ChatGPT Pro + enterprise; Windows-heavy | Enterprise/security-conscious; Google Cloud-adjacent | GitHub/Entra enterprise; accessibility-aware | OSS power users; self-hosters | Long-running autonomous agents; NixOS/CI | OSS deployers; Qwen/Qoder accounts |
| **Feature focus** | IDE integration, session/workspace UX, voice | Windows sandbox hardening, GCP tool delivery, image models | Agent/subagent subsystem, AST navigation, enterprise telemetry | Permission control, MCP auth, session UX, a11y | v2 desktop/TUI, plugin API parity, scheduling | `pi-durable` persistence, extension lifecycle | 1.0 agent loop, Managed Agent parity, Web Shell |
| **Technical approach** | Tight VS Code coupling; hardcoded defaults (e.g. `includeWorktrees: false`) | Bot-driven hardening; incremental GCP tool declarations | Bash-native model affinity; ACP mode parity | Prerelease cadence; ACP session-store | Event-bus, MCP bus publishing, concurrency bounds | Durable storage/replication, atomic enqueue APIs | Event-bus agent loop, opt-in preview tracks |
| **Community channel** | Issues (no Discussions reported) | Issues + **active Discussions** | Issues (no Discussions reported) | Issues (no Discussions reported) | Issues (no Discussions reported) | Issues + Show-and-tell | Issues (no Discussions reported) |
| **Signature strength** | Ecosystem mindshare; org controls | Release velocity (7/24h) | AST/enterprise research direction | Accessibility + Entra integration | Plugin extensibility | Durable state for indefinite runs | Preview consolidation (Qoder + Qwen) |

**Key distinctions:**
- **Claude Code** optimizes for IDE-native workflows but suffers from hardcoded integration assumptions (worktrees, telemetry→plugin coupling).
- **Codex** is the only tool shipping at a **near-daily cadence**, but its Windows surface is the industry's largest liability.
- **Gemini CLI** is the only community pursuing **AST-aware code navigation** as a coherent multi-issue research direction — a longer-horizon bet on semantic tooling.
- **Copilot CLI** differentiates on **enterprise identity (Entra) and accessibility**, but has zero PR activity this window.
- **OpenCode** and **Pi** are the **plugin/extension platforms** — and their pain points (V2 composer parity, extension lifecycle receipts) reflect that they're being used as infrastructure, not just tools.
- **Qwen Code** is the only tool launching a **major version this window**, betting on merging two agent lineages.

---

## 5. Community Momentum & Maturity

**Highest raw activity:**
- **OpenAI Codex** — 7 releases/24h, bot-driven PR batch, active Discussions. Fastest iteration, but issue tracker is a Windows-reliability queue.
- **OpenCode** — ~50 issues + feature-dense PRs (concurrency caps, MCP bus, session search). Strong momentum on v2.
- **Qwen Code** — 1.0 Preview launch, event-bus refactor, Managed parity features. High architectural ambition, but CI signal-to-noise is poor.

**Highest engagement quality:**
- **Pi** — 50 issues + 23 PRs, with a genuine Show-and-tell ecosystem (Concord integration). The only community where **external developers are building cross-harness infrastructure** on top of the tool.
- **Codex** — Discussions produce novel ecosystem primitives (`claude-bulkhead`, `Pushary`, `TreeHarbor`) that address multi-agent problems no single vendor is solving.

**Maturity indicators:**
- **Claude Code** — High issue volume but **only 1 PR in 24h, closed unmerged**. Suggests a gated contribution model; community energy is frustrated energy (entitlement lockouts, silent failures).
- **Gemini CLI** — Steady, well-curated PR flow (ACP parity, env-var semantics, worktree persistence). Mature engineering process; less community-generated innovation.
- **Copilot CLI** — 41 issues updated but **zero PRs**. Prerelease-only cadence with no visible external contribution path.
- **OpenCode** — Long-standing bugs finally closing (#4283 clipboard after a year, 135 👍) — a sign of backlog reduction, but also of how long trust issues linger.

**Momentum ranking (subjective, by iteration + ecosystem energy):**
1. OpenAI Codex (velocity)
2. OpenCode (v2 feature depth)
3. Pi (ecosystem/Show-and-tell)
4. Qwen Code (architectural leap)
5. Gemini CLI (steady)
6. Claude Code (gated, frustration-heavy)
7. Copilot CLI (prerelease-only, no PR path)

---

## 6. Trend Signals

### For technical decision-makers:

1. **Multi-agent orchestration is becoming a first-class requirement, not a power-user hack.** The emergence of `Concord`, `claude-bulkhead`, and `TreeHarbor` — all community-built, cross-harness — means your team will likely run Claude Code, Codex, and others **simultaneously on one machine**. Budget for resource isolation (process guards, port conflicts, file claims) and prefer tools with hook/MCP policy gates.

2. **"Silent failure" is the dominant trust risk.** Every community reports agents that claim success while failing (Gemini CLI #22323, Codex #56951, Claude Code silent-failure theme, Pi's silent capability loss). If you're building automated pipelines, **do not trust agent-reported status** — add independent verification (Qwen Code's verify-then-repair #16941 is the right pattern).

3. **Windows is a second-class citizen across the board.** Six of Codex's top 10 issues are Windows; Copilot CLI, OpenCode, Pi, and Gemini CLI all have Windows/ARM64 blockers. If your org is Windows-heavy, **pilot on Linux/macOS first** and track sandbox ACL regressions specifically.

4. **Permission classifiers are over-blocking legitimate work.** Codex (422 cybersecurity flags), Claude Code (Cowork email blocks), and Copilot CLI all show safety systems firing on ordinary debugging. Plan for **allowlist/escalation paths** before deploying unattended automation.

5. **Config predictability is an underrated selection criterion.** Tools with documented config-drift bugs (OpenCode, Gemini CLI, Claude Code) will cost you debugging time. Favor tools where settings changes take effect live and are verifiable — Qwen Code's hot-reload (despite doc drift) and OpenCode's auto-balancing flags are directional.

6. **Enterprise telemetry and abuse-system tension is unresolved.** Gemini CLI's headless-mode suspension (#20813) and PR #30010's `skill_name` telemetry work show that **headless/CI usage can trip abuse systems**. Enterprises should validate ToS posture before scaling headless deployments.

7. **OSS challengers are consolidating.** Qwen Code 1.0 and OpenCode v2 are converging on event-bus agent loops, durable sessions, and plugin APIs — the same architecture the incumbents already have. Expect **feature parity within 2–3 quarters**, with differentiation shifting to model quality, cost, and ecosystem.

### For developers building on these tools:
- **Prioritize extension APIs with lifecycle receipts** (Pi #10317, OpenCode #51209) — you'll need them for reliable automation.
- **Watch the MCP event bus** (OpenCode #63261) and **hook-based policy gates** (Codex Show-and-tell) as the emerging integration standard.
- **Assume your users run multiple harnesses** — build for portability via MCP and AGENTS.md conventions, not vendor-specific hooks.

---

*Report compiled from 7 community digests dated 2026-11-12. All counts reflect snapshot values; Discussions marked "N/A" indicate no data provided, not inactive channels.*

---

## Per-Tool Reports

<details>
<summary><strong>Claude Code</strong> — <a href="https://github.com/anthropics/claude-code">anthropics/claude-code</a></summary>

## Claude Code Skills Highlights

> Source: [anthropics/skills](https://github.com/anthropics/skills)

# Claude Code Skills Community Highlights Report — 2026-11-12

## 1. Top Skills Ranking (by discussion activity)

The most-watched PRs in this dataset are all **OPEN**, and notably most have a `Comments: undefined` field — meaning the shown signal is *attention/retention* (creation → last update windows of up to 8 months) rather than raw comment counts. Ranked by visibility and update recency:

| # | Skill / Fix | What it does | Discussion Highlights | Status | Link |
|---|---|---|---|---|---|
| 1 | **skill-creator: isolate trigger evals** | Fixes false triggget misses: per-worker command probes compete, `select()` on subprocess pipes fails on Windows, unrelated tools stop the scan | Directly tied to Issue #1352 (parallel workers cross-matching UUIDs → near-zero trigger rates) and #556 (0% trigger rate) — the eval harness is the community's biggest pain point | OPEN (since 2026-06-10, active to 2026-09-16) | [PR #1298](https://github.com/anthropics/skills/pull/1298) |
| 2 | **mcp-builder: mcp>=2 streamable_http_client** | Migrates to `streamable_http_client` + `create_mcp_http_client` for custom headers after the `mcp>=2.0.0` rename | Breaking-change fix tracked as #1668; blocks anyone building MCP servers on current SDKs | OPEN (since 2026-09-08) | [PR #1742](https://github.com/anthropics/skills/pull/1742) |
| 3 | **webapp-testing: remove shell=True** | Replaces `subprocess.Popen(..., shell=True)` in `with_server.py` with safe command spawning | Security hardening (CWE-78 command injection) — part of a cluster of webapp-testing fixes | OPEN (since 2026-10-06) | [PR #1980](https://github.com/anthropics/skills/pull/1980) |
| 4 | **docx: LibreOffice timeout = error** | `accept_changes.py` returns Error on soffice timeout and verifies `w:ins`/`w:del` removal before claiming success | Fixes silent-success failure mode in a core document skill | OPEN (since 2026-09-19) | [PR #1792](https://github.com/anthropics/skills/pull/1792) |
| 5 | **notion-spec-to-implementation + quantitative-resume-auditor** | Turns Notion spec pages into implementable tasks with acceptance criteria; audits resumes quantitatively | Two-in-one community skill bundle; long-lived (Jun–Oct) | OPEN | [PR #1245](https://github.com/anthropics/skills/pull/1245) |
| 6 | **document-typography** | Quality control for AI-generated docs: orphan wraps, widow paragraphs, numbering misalignment | Widely-scoped claim ("affects every document Claude generates"); early-staged | OPEN (Mar 2026) | [PR #514](https://github.com/anthropics/skills/pull/514) |
| 7 | **pyxel** | Retro game dev in Python: implementation, headless input-driven runs, frame inspection | Longest-running active PR in the set (Mar → Nov 2026) | OPEN | [PR #525](https://github.com/anthropics/skills/pull/525) |
| 8 | **proofcore-contract-auditor** | Static analysis of Solidity/Rust contracts + Merkle audit proofs anchored to TON | Web3 vertical; vendor-authored, fast follow-up | OPEN | [PR #1771](https://github.com/anthropics/skills/pull/1771) |

## 2. Community Demand Trends (from Issues)

- **Trust & namespace security (top issue, 46 comments):** [#492](https://github.com/anthropics/skills/issues/492) — community skills distributed under the `anthropic/` namespace enable impersonation and trust-boundary abuse. This is the single loudest thread in the repo.
- **Enterprise/org workflow automation:** [#228](https://github.com/anthropics/skills/issues/228) (17 👍8) — org-wide skill sharing without manual `.skill` file shuffling; [#1143](https://github.com/anthropics/skills/issues/1143) (15 👍) — account email change to prevent workspace data loss.
- **Evaluation infrastructure reliability:** [#556](https://github.com/anthropics/skills/issues/556) (13 comments) and [#1352](https://github.com/anthropics/skills/issues/1352) — `run_eval.py` produces 0% / false-negative trigger rates, especially with parallel workers.
- **Context-budget discipline:** [#1487](https://github.com/anthropics/skills/issues/1487) — `claude-api` skill eagerly injects ~156k tokens, exhausting context in one tool call.
- **Memory/state compression:** [#1329](https://github.com/anthropics/skills/issues/1329) — symbolic-notation `compact-memory` for long-running agents.
- **Quality-gate pipelines:** [#1385](https://github.com/anthropics/skills/issues/1385) — three-gate calibration → adversarial review → delivery verification.
- **Plugin surface hygiene:** [#189](https://github.com/anthropics/skills/issues/189) (👍9) — `document-skills` and `example-skills` ship identical content, causing duplicates.
- **Skill-authoring best practices:** [#202](https://github.com/anthropics/skills/issues/202) — `skill-creator` reads like dev docs, not an operational skill; [#2064](https://github.com/anthropics/skills/issues/2064) — descriptions state *what* but not *when to use*.

## 3. High-Potential Pending Skills

Active-comment/recently-updated PRs that could land soon:

- [PR #1245](https://github.com/anthropics/skills/pull/1245) — notion-spec-to-implementation + quantitative-resume-auditor (updated 2026-10-15)
- [PR #1980](https://github.com/anthropics/skills/pull/1980) — webapp-testing shell=True removal (updated 2026-11-01)
- [PR #1792](https://github.com/anthropics/skills/pull/1792) — docx timeout-as-error (updated 2026-11-01)
- [PR #2019](https://github.com/anthropics/skills/pull/2019) — xlsx worksheet-scoped defined names in `external_links_at_risk` (updated 2026-11-03, fixes #2013)
- [PR #1950](https://github.com/anthropics/skills/pull/1950) — claude-api Python `pause_turn` runner guidance (updated 2026-11-10)
- [PR #2108](https://github.com/anthropics/skills/pull/2108) — docs clarifying document-skills snapshot/sync relationship (updated 2026-11-03)
- [PR #1975](https://github.com/anthropics/skills/pull/1975) / [#1976](https://github.com/anthropics/skills/pull/1976) / [#1977](https://github.com/anthropics/skills/pull/1977) — small, self-contained fixes from one contributor (pptx, webapp-testing, algorithmic-art), all referencing specific issues — likely fast-track candidates.

## 4. Skills Ecosystem Insight

**The community's most concentrated demand is not new Skill ideas but reliability and trust in the existing Skill layer** — fixing evaluation trigger rates, namespace impersonation, silent-success bugs, and context bloat in the core skills (`skill-creator`, `docx`, `xlsx`, `claude-api`, `webapp-testing`) that everyone depends on.

---

*Data source: github.com/anthropics/skills, PRs and Issues as of 2026-11-12. Note: `Comments: undefined` for PRs indicates the field was not populated in the source dataset; ranking above weights update activity and issue cross-references.*

---

# Claude Code Community Digest — 2026-11-12

## 1. Today's Highlights

No new releases landed in the last 24 hours, but issue activity remains intense: a recurring **entitlement sync bug** is still locking individual Pro subscribers out of Claude Code, now spawning duplicate reports (#72027, #109155). On the feature side, the most-upvoted item today is the **VS Code worktree session gap** (#81024, 16 👍), while fresh reports highlight **autocompact loop persistence on Windows** (#108987) and **cloud scheduled task prompt re-delivery** (#109016). The single PR in the queue (#26230, path validation hooks) was closed without merge.

## 2. Releases

No new releases in the last 24 hours.

## 3. Hot Issues

1. **[#72027](https://github.com/anthropics/claude-code/issues/72027) — Pro subscriber blocked by entitlement sync bug (CLOSED, 10 comments)** — Individual Pro users hit "organization disabled" → "Max or Pro required." A long-running auth/entitlement desync that was finally closed today; worth watching for regression given #109155.
2. **[#81024](https://github.com/anthropics/claude-code/issues/81024) — VS Code extension ignores git-worktree sessions (OPEN, 16 👍)** — The extension hardcodes `includeWorktrees: false`, so worktree-based workflows lose session history. Highest community signal today.
3. **[#98287](https://github.com/anthropics/claude-code/issues/98287) — Cowork scheduled tasks: permission classifier blocks owner-authorized sends (OPEN, 8 comments)** — Cloud scheduled tasks refuse email sends that succeed interactively. Directly limits unattended automation.
4. **[#98032](https://github.com/anthropics/claude-code/issues/98032) — macOS: turns hang ~6 min then ECONNRESET (OPEN)** — Sudden-onset networking regression on one machine across all sessions; consistent failure shape makes it diagnosable.
5. **[#84424](https://github.com/anthropics/claude-code/issues/84424) — Bash tool stdin-redirect regex is quote-unaware (OPEN, reproduced)** — Quoted arguments containing `<` cause stdin to stay open and commands to hang via shell dotfiles. A subtle but high-impact tooling bug.
6. **[#94446](https://github.com/anthropics/claude-code/issues/94446) — Desktop file viewer can't open links under additionalDirectories (OPEN, 6 👍)** — Breaks multi-root workflows; links render but the viewer silently fails.
7. **[#108955](https://github.com/anthropics/claude-code/issues/108955) — /model picker omits Fable 5.2 (OPEN, 5 👍)** — Manual invocation works, picker doesn't. Small UI gap with outsized annoyance on Max plans.
8. **[#108921](https://github.com/anthropics/claude-code/issues/108921) — Desktop auto mode refuses MCP calls after input rewrite (OPEN)** — Auto-mode check runs before the app rewrites tool input, producing false "hook changed this call" refusals for `archive_session`/`run_in_terminal`.
9. **[#108987](https://github.com/anthropics/claude-code/issues/108987) — Removing `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` doesn't stop autocompact loop (OPEN)** — Env var persists in the process; requires restart. Painful for anyone testing compaction thresholds.
10. **[#108745](https://github.com/anthropics/claude-code/issues/108745) — VS Code 2.1.322: telemetry off silently disables plugin sync (OPEN, regression)** — Org-managed MCP servers/agents/skills vanish with no UI warning. A trust-eroding silent failure.

## 4. Key PR Progress

Only one PR was updated in the last 24 hours:

1. **[#26230](https://github.com/anthropics/claude-code/pull/26230) — Feature/path validation hooks (CLOSED)** — Proposed blocking relative paths from agent tool calls to strengthen sandboxing. Closed without merge; the underlying need for tighter sandbox path validation remains unaddressed.

No other PRs met the selection threshold, so no additional items are listed.

## 5. Hot Discussions

No Discussions data was provided for this period.

## 6. Feature Request Trends

Distilled from today's issue set:

- **Session & workspace experience**: git-worktree support in VS Code (#81024), native `claude://` session links (#90290), statusLine row-sharing (#109141).
- **Cost & usage controls**: advisor tool `caching` parameter exposure (#91110), toggle to disable cash Usage Credits on subscription plans (#92087), 1M context credit errors (#109160).
- **Voice & input UX**: full voice mode with TTS, continuous listening, auto-submit (#102545); native spellcheck in VS Code chat input (#81814, 11 👍).
- **Web/Cloud parity**: dismissing local command output in claude-code-web (#109151), read-only access to unattached public repos for `composer install` (#109162).

## 7. Developer Pain Points

- **Entitlement/auth fragility**: The Pro-subscriber lockout (#72027) closing the same day a duplicate appears (#109155) suggests the entitlement sync fix is not fully settled — a recurring trust issue for individual subscribers.
- **Silent failures in IDE integrations**: Plugin sync dying when telemetry is off (#108745), gray session tabs after extension updates (#108714), and file viewer gaps (#94446) all share a theme: things break without telling the user.
- **Auto-mode/permission classifier false positives**: Cowork email sends (#98287), desktop MCP refusals (#108921), and repeated "false positive" bug reports (#109163, #109164) point to permission systems that over-block legitimate, owner-authorized actions.
- **Bash tool edge cases**: Quote-unaware stdin detection (#84424) continues to hang commands — a longstanding class of shell-integration bugs.
- **Config changes not taking effect live**: Autocompact override persistence (#108987) adds to the pattern of `settings.json` changes requiring full restarts.

---
*Note: The "Hot Issues" section includes the normally-capped 10 items from the 50 reported; issue #109155 was folded into the #72027 entry to avoid double-counting the same defect.*

</details>

<details>
<summary><strong>OpenAI Codex</strong> — <a href="https://github.com/openai/codex">openai/codex</a></summary>

# OpenAI Codex Community Digest — 2026-11-12

## 1. Today's Highlights

The release pipeline remains fast-moving with seven version bumps in 24 hours (mostly alpha/point releases), headlined by `rust-v0.167.2` shipping incremental tool updates by default on Google Cloud Vertex AI. Meanwhile, Windows desktop/sandbox reliability issues dominate the issue tracker — the top three issues by comment count are all Windows platform bugs, with #59895 (projects disappearing after app update) drawing 69 comments and 19 upvotes. The PR queue is almost entirely `copyberry[bot]`-generated fixes targeting sandbox permissions, MCP OAuth persistence, and model-state continuity, suggesting a coordinated hardening push.

## 2. Releases

Seven releases landed in the last 24h:

- **`rust-v0.167.2`** — the only one with substantive notes: Codex now sends tool updates **incrementally by default on Google Cloud Vertex AI**. Users can opt out via `incremental_tools_legacy_gcp = false` under `[features]` in `config.toml` ([#60617](https://github.com/openai/codex/pull/60617), [#60848](https://github.com/openai/codex/pull/60848)).
- **Alpha/point releases** with no release notes: `rust-v0.170.0-alpha.2`, `rust-v0.170.0-alpha.1`, `rust-v0.169.0-alpha.11.1`, `rust-v0.169.0-alpha.11`, `rust-v0.169.0-alpha.10`, `rust-v0.167.0-alpha.4.3`.

No changelog details were provided for the alpha channel, so breaking changes there are unverified.

## 3. Hot Issues (top 10 by engagement)

1. **[#59895](https://github.com/openai/codex/issues/59895)** — *Windows: local projects disappear after app update + account switch* (69 comments, 19 👍). The highest-engagement issue in the tracker. Users lose local project state after updating and switching back to a personal account. High emotional weight given data-loss implications.

2. **[#45403](https://github.com/openai/codex/issues/45403)** — *Windows Full access: forced test-file cleanup denied with opaque "blocked by policy"* (34 comments, 7 👍). A long-running (since September) discrepancy between the "Full access" UI promise and actual sandbox enforcement, with no review path for the user.

3. **[#50520](https://github.com/openai/codex/issues/50520)** — *Windows sandbox: recurring `helper_sandbox_lock_failed`* (21 comments). Permissions on `.sandbox-bin` regress to Modify, requiring manual ACL fixes. Classic recurrence bug.

4. **[#59931](https://github.com/openai/codex/issues/59931)** — *Windows Desktop does not auto-connect enabled SSH host after restart* (13 comments, 8 👍). Reproduced on two devices; erodes the "remote dev" workflow.

5. **[#34946](https://github.com/openai/codex/issues/34946)** — *Allow Scheduled tasks to target SSH-connected hosts* (10 comments, 11 👍). An enhancement with unusually strong support; users want automations over remote hosts.

6. **[#59890](https://github.com/openai/codex/issues/59890)** — *Images 2.6 on Codex OAuth: no model selection, complexity/SVG ignored, GIF rejected* (7 comments, 3 👍). New image models launched but are unusable for third-party OAuth clients — a feature-parity gap.

7. **[#60594](https://github.com/openai/codex/issues/60594)** — *HTTP 400 for repeated image inputs with zstd compression on Windows* (7 comments). Failing endpoint `POST /backend-api/codex/responses`, breaks chat continuation.

8. **[#19669](https://github.com/openai/codex/issues/19669)** — *Slack connector keeps stale OAuth link after revoke/reconnect* (7 comments). Auth-state hygiene issue affecting multi-Slack users; long-lived since April.

9. **[#56951](https://github.com/openai/codex/issues/56951)** — *Codex ends turns after review/checkpoint milestones while acknowledging unfinished work* (6 comments). Model-behavior bug: agent terminates turns mid-task — directly hurts autonomous execution trust.

10. **[#58422](https://github.com/openai/codex/issues/58422)** — *Auto-review retains earlier authorization scope; exact-action approval unavailable* (4 comments). Approval-scope over-retention is a security-adjacent concern.

## 4. Key PR Progress (top 10)

Note: all listed PRs are marked `[CLOSED]` and authored by `copyberry[bot]`, indicating a batch of merged/superseded automated fixes.

1. **[#60969](https://github.com/openai/codex/pull/60969)** — Reconnect idle Cloud conversations after transient stream loss; holds queued input until the reply stream is usable.
2. **[#60943](https://github.com/openai/codex/pull/60943)** — Preserve file permissions during repeated Windows sandbox setup (directly addresses the class of bug in #50520).
3. **[#60944](https://github.com/openai/codex/pull/60944)** — Reconcile Windows runtime registration after service privilege errors.
4. **[#60942](https://github.com/openai/codex/pull/60942)** — Preserve thread-local model ID state across replay and compaction; recovers item ordinals from checkpoint replacement history.
5. **[#60936](https://github.com/openai/codex/pull/60936)** — Preserve legacy sandbox templates in TUI permission conversions (lossless `PermissionProfile` conversions).
6. **[#60929](https://github.com/openai/codex/pull/60929)** — Preserve Command Center task ownership across backend switches.
7. **[#60905](https://github.com/openai/codex/pull/60905)** — Keep same-named MCP servers separate across environments (disabled-by-default flag), fixing name-collision resolution.
8. **[#60904](https://github.com/openai/codex/pull/60904)** — Version answer display instructions into a `v1` contract (`show`/`hide`/`block`) and restrict unsupported payloads.
9. **[#60849](https://github.com/openai/codex/pull/60849)** — Protect MCP OAuth persistence from stale credential writes (lock + revalidate) — relevant to auth staleness issues like #19669.
10. **[#60848](https://github.com/openai/codex/pull/60848)** — Enable incremental tool declarations by default for GCP (the change released in `0.167.2`).

Honorable mentions: [#60872](https://github.com/openai/codex/pull/60872) (Windows atomic writes via `std::fs::rename`), [#60846](https://github.com/openai/codex/pull/60846) (thread search snippets for whitespace queries), [#60871](https://github.com/openai/codex/pull/60871) (in-process init handshake race).

## 5. Hot Discussions

### Ideas
- **[#60954](https://github.com/openai/codex/discussions/60954)** — *Let ChatGPT Pro users choose their usage window (5-hour vs. weekly)*. Mirrors a duplicate issue [#60953](https://github.com/openai/codex/issues/60953); signals growing frustration with rate-limit ergonomics.

### Q&A
- **[#24717](https://github.com/openai/codex/discussions/24717)** — *Recommended way to handle outdated/incorrect memories?* No clear tooling to inspect, reset, or selectively delete stored memories.
- **[#34373](https://github.com/openai/codex/discussions/34373)** — *How to uninstall Codex CLI?* (Answered.) Install script lacks an obvious counterpart for Arch Linux users.

### Show and tell
- **[#60116](https://github.com/openai/codex/discussions/60116)** — **Pushary**: answer Codex approvals from your phone / route a `git push` to a team lead. Uses native hooks + MCP; a hook-based policy gate before shell/`apply_patch`/MCP calls.
- **[#60861](https://github.com/openai/codex/discussions/60861)** — **claude-bulkhead**: guard hooks for running Codex alongside other agents on one machine — born from agents killing each other's servers (e.g. `pkill node`).
- **[#60834](https://github.com/openai/codex/discussions/60834)** — **Concord**: open-source MCP server for coordinating multiple Codex sessions on the same project (claim files, share context/handoffs).
- **[#60852](https://github.com/openai/codex/discussions/60852)** — **Desktop remoto RDP**: control a Windows RDP session from Codex via screenshots + input injection.
- **[#60818](https://github.com/openai/codex/discussions/60818)** — Running Codex + Claude Code from one Windows terminal (5–10 agents), with lessons learned.
- **[#60762](https://github.com/openai/codex/discussions/60762)** — **AGENTS.md Check**: offline linter for `AGENTS.md` (merge markers, bidi controls, invalid UTF-8, repeated lines).
- **[#60722](https://github.com/openai/codex/discussions/60722)** — **TreeHarbor**: preserve agent patches after workspace cleanup and open per-patch draft PRs.

**Theme:** The ecosystem is building *multi-agent coordination and guardrail layers* — shared MCP coordination, hook-based policy gates, cross-agent resource guards, and patch preservation.

## 6. Feature Request Trends

- **Remote / SSH-based automation** — Extending Scheduled tasks and auto-connect to SSH hosts (Issues [#34946](https://github.com/openai/codex/issues/34946), [#59931](https://github.com/openai/codex/issues/59931)).
- **Adaptive subagent orchestration** — Native orchestration tying subagents, model selection, reasoning effort and skills together with lower overhead ([#51658](https://github.com/openai/codex/issues/51658)).
- **Iterative debugging reliability** — Strong demand for better root-cause analysis, autonomous task completion, and self-verification ([#60754](https://github.com/openai/codex/issues/60754)).
- **Usage-limit configurability** — Ability to choose 5-hour vs. weekly windows ([#60953](https://github.com/openai/codex/issues/60953) / Discussion [#60954](https://github.com/openai/codex/discussions/60954)).
- **Memory management controls** — Inspect/reset/delete stored memories (Discussion [#24717](https://github.com/openai/codex/discussions/24717)).
- **New image-model parity** — Expose Images 2.6 model selection and controls via OAuth clients ([#59890](https://github.com/openai/codex/issues/59890)).

## 7. Developer Pain Points

- **Windows remains the dominant pain surface.** Of the top 10 issues, 6 are Windows-tagged. Recurring themes: sandbox ACL regressions ([#50520](https://github.com/openai/codex/issues/50520)), `blocked by policy` with no review path ([#45403](https://github.com/openai/codex/issues/45403)), forced runtime re-downloads (~500 MB) each start ([#59992](https://github.com/openai/codex/issues/59992)), and app-update state loss ([#59895](https://github.com/openai/codex/issues/59895)).
- **Auth/OAuth staleness.** Stale Slack OAuth ([#19669](https://github.com/openai/codex/issues/19669)), unpersisted MCP DCR `client_secret` across restarts ([#43216](https://github.com/openai/codex/issues/43216)), and Pro sign-in rejecting GPT-6.1 Sol across CLI 0.163–0.167.2 ([#60970](https://github.com/openai/codex/issues/60970)).
- **Silent CLI failures.** A cluster of low-level CLI bugs from one reporter ([dovvnloading](https://github.com/openai/codex/issues?q=author%3Adovvnloading)): `#` in marketplace paths parsed as Git refs ([#60896](https://github.com/openai/codex/issues/60896)), `--json` output omitted on partial batch failure ([#60903](https://github.com/openai/codex/issues/60903)), MCP re-add silently resetting settings ([#60927](https://github.com/openai/codex/issues/60927)), invalid remove commands for hyphen-leading names ([#60885](https://github.com/openai/codex/issues/60885)).
- **Approval/authorization scope over-retention.** Auto-review keeps earlier authorization scope and lacks exact-action approval ([#58422](https://github.com/openai/codex/issues/58422)).
- **Cost/limit unpredictability.** Abnormally high weekly limit consumption ([#60963](https://github.com/openai/codex/issues/60963)) plus the recurring request for user-selectable usage windows.
- **Model instruction-following regressions** on long autonomous runs ([#47953](https://github.com/openai/codex/issues/47953), [#56951](https://github.com/openai/codex/issues/56951)).

---

*Digest generated from github.com/openai/codex data for 2026-11-12. Counts reflect comments/👍 at snapshot time.*

</details>

<details>
<summary><strong>Gemini CLI</strong> — <a href="https://github.com/google-gemini/gemini-cli">google-gemini/gemini-cli</a></summary>

# Gemini CLI Community Digest — 2026-11-12

## 1. Today's Highlights

No new releases landed in the past 24 hours, but community activity remains intense around the **agent/subagent subsystem**: recovery logic, browser agent reliability, and tool-scoping issues dominate the top issues. On the PR side, a wave of smaller but high-value fixes targets ACP mode (hooks, stderr flushing, hook-blocked prompts), Windows PowerShell event-loop blocking, and Unicode/ANSI handling in session previews. A recurring theme across both issues and PRs is **enterprise telemetry hygiene and enterprise-safe metadata filtering**.

---

## 2. Releases

None in the last 24 hours.

---

## 3. Hot Issues

1. **#20813 [CLOSED] – Account suspension in headless mode with custom system prompt** ([link](https://github.com/google-gemini/gemini-cli/issues/20813))
   A p1 enterprise/security issue where a user was suspended for ToS violation while using headless mode. Closed, but with 14 comments and 3 👍 — signaling real concern about how the CLI's headless behavior interacts with Google's abuse systems.

2. **#22323 [OPEN] – Subagent MAX_TURNS misreported as GOAL success** ([link](https://github.com/google-gemini/gemini-cli/issues/22323))
   `codebase_investigator` returns `status: success / Termination Reason: GOAL` even when it hit its turn cap. This is a correctness bug that silently hides agent interruption — dangerous for anyone relying on subagent outputs for automated workflows.

3. **#21409 [OPEN] – Generalist agent hangs indefinitely** ([link](https://github.com/google-gemini/gemini-cli/issues/21409))
   Users report hangs up to an hour when the CLI defers to the generalist agent. Highest 👍 count (8) among the top issues, making it one of the most-felt pain points in the tracker.

4. **#19873 [OPEN] – Zero-dependency OS sandboxing + post-execution intent routing** ([link](https://github.com/google-gemini/gemini-cli/issues/19873))
   A design proposal for letting Gemini 3 lean into its native bash affinity safely. Since Gemini 3 is trained as a bash-native model, this could become an architectural cornerstone for how the CLI executes tooling.

5. **#22745 [OPEN] – AST-aware file reads, search, and mapping** ([link](https://github.com/google-gemini/gemini-cli/issues/22745))
   EPIC exploring AST-aware tooling to reduce tokens and misaligned reads. Closely tied to #22747's AST grep investigation — a clear signal that the team is moving toward semantic code navigation.

6. **#21968 [OPEN] – Gemini underuses skills and subagents** ([link](https://github.com/google-gemini/gemini-cli/issues/21968))
   Anecdotal but credible: the model only uses custom skills/subagents when explicitly told. This undermines the entire extensibility story if users have to hand-hold the agent.

7. **#22267 [OPEN] – Browser Agent ignores `settings.json` overrides** ([link](https://github.com/google-gemini/gemini-cli/issues/22267))
   `maxTurns` and other config are read by `AgentRegistry` but ignored at execution time. Config drift between registry and runner is a classic source of "why isn't my setting working?" bug reports.

8. **#21983 [OPEN] – Browser subagent fails on Wayland** ([link](https://github.com/google-gemini/gemini-cli/issues/21983))
   Linux/Wayland users see the browser subagent terminate with a false "GOAL" success. Compounds SDK-level correctness concerns (see #22323) and limits the tool's viability on modern Linux desktops.

9. **#24246 [OPEN] – 400 error with >128 tools** ([link](https://github.com/google-gemini/gemini-cli/issues/24246))
   The agent hits API limits when too many tools are in scope; the reporter's request that the agent "be a bit smarter about limiting tools" is a fair ask as MCP/extension ecosystems grow.

10. **#22672 [OPEN] – Agent should discourage destructive behavior** ([link](https://github.com/google-gemini/gemini-cli/issues/22672))
    The model occasionally reaches for `git reset` or `--force` when safer options exist. Safety-adjacent, p2, and a likely candidate for policy/prompt-level guardrails.

*Also worth watching:* #20079 (symlinked agent files not recognized), #22186 (crash during `get-shit-done` output hook), #21763 (bug reports omit subagent context).

---

## 4. Key PR Progress

1. **#30010 [CLOSED] – Expose `skill_name` in safe tool metadata whitelist** ([link](https://github.com/google-gemini/gemini-cli/pull/30010))
   Fixes a gap in enterprise telemetry: with `logPrompts` disabled, `skill_name` was previously filtered out, making skill usage invisible to org-level observability.

2. **#30009 [CLOSED] – OSS Exit Gate npm publishing workflow** ([link](https://github.com/google-gemini/gemini-cli/pull/30009))
   Adds keyless WIF-based release pipeline for `@google/gemini-cli`, `-a2a-server`, and `-core`. Long-term reliability win for release engineering.

3. **#30003 / #30250 [CLOSED] – `${VAR:-default}` semantics fixed** ([link](https://github.com/google-gemini/gemini-cli/pull/30003))
   Aligns env var expansion with Bash when a variable is set but empty. Small but frequently-hit footgun for settings.json users.

4. **#30148 [OPEN] – Fire SessionStart and Notification hooks in ACP mode** ([link](https://github.com/google-gemini/gemini-cli/pull/30148))
   Brings ACP sessions up to parity with interactive mode for hook lifecycle events.

5. **#30134 [OPEN] – Report hook-blocked prompts over ACP** ([link](https://github.com/google-gemini/gemini-cli/pull/30134))
   ACP clients previously saw an empty `end_turn` when a hook denied a prompt. Now surfaces the block reason as an `agent_message_chunk`.

6. **#30144 [OPEN] – Initialize output listeners and flush stderr in ACP mode** ([link](https://github.com/google-gemini/gemini-cli/pull/30144))
   Fixes silent stderr in ACP sessions — hook logs and warnings now appear in real time instead of at process exit.

7. **#30247 [OPEN] – Avoid blocking PowerShell parsing during shell checks** ([link](https://github.com/google-gemini/gemini-cli/pull/30247))
   Windows UX fix: synchronous PS startup/AST parsing froze the Thinking spinner. Async parsing restores responsiveness.

8. **#30228 [CLOSED] – Preserve interrupted placeholder after empty model responses** ([link](https://github.com/google-gemini/gemini-cli/pull/30228))
   Fixes `400 Bad Request ("Requests ending with a model turn are not supported")` and prompt fusion bugs after empty/thought-only model turns.

9. **#30176 [CLOSED] – Preserve selected worktree across auth restarts** ([link](https://github.com/google-gemini/gemini-cli/pull/30176))
   `--worktree` selections now survive `RELAUNCH_EXIT_CODE = 199`. Regression-class fix that resolves a documented issue (#30078).

10. **#29546 [OPEN] – Support `/skill-name` activation in non-interactive mode** ([link](https://github.com/google-gemini/gemini-cli/pull/29546))
    Registers `SkillCommandLoader` in the non-interactive path, extending skill usage to scripts and CI — tagged `help wanted`.

*Also notable:* #30220 (Unicode/ANSI preservation in session previews), #30246 (quote IDE CLI path for cmd.exe on Windows).

---

## 5. Hot Discussions

No discussion data was provided in the source pull. This section is omitted.

---

## 6. Feature Request Trends

Distilling across the top 30 issues:

- **AST-aware code navigation** — #22745, #22746, #22747. Multiple issues investigate AST greps and semantic search to cut tokens and misaligned reads. This is the most coherent multi-issue research direction in the tracker.
- **Smarter tool scoping** — #24246 (>128 tools → 400 error) and #19873 (post-execution intent routing) both point to a need for dynamic tool selection.
- **Persistent, file-based task tracking** — #18836 (deprecate `WriteToDo` for CRUD-based persistent tasks) and #21000 (native file tools for the task tracker).
- **Subagent observability & debuggability** — #22598 (`/chat share` subagent trajectory), #21763 (subagent context in bug reports), #20266-adjacent workstreams.
- **Parallel/shared-memory subagents** — #18287 (currently blocked pending parallel subagent logic).
- **Per-workspace policy overrides** — #18397 asks for workspace-scoped policies beyond global scope.
- **Agent self-awareness** — #21432 asks the CLI to accurately know its own flags, hotkeys, and self-invocation patterns.
- **Browser agent resilience** — #22232 (session takeover/lock recovery), #22267 (settings overrides honored), #21983 (Wayland).

---

## 7. Developer Pain Points

Recurring frustrations across the issue corpus:

1. **Silent subagent failures** — Issues #22323 and #21983 both show agents reporting "GOAL/success" when they actually failed or hit a turn cap. This undermines trust in multi-agent pipelines and is the most damaging category of bug for power users.
2. **Hangs and deadlocks** — #21409 (generalist agent hangs up to an hour) and #22465 (vite interactive prompt hang) point to gaps in interactive-prompt handling and turn management.
3. **Config not honored at runtime** — #22267 (browser agent ignores `settings.json`) and #20079 (symlinks not recognized) suggest an inconsistency between discovery/registration and execution layers.
4. **Enterprise/ToS anxiety** — #20813 (headless mode suspension) and the PR #30010 telemetry work reveal tension between enterprise telemetry needs and abuse-system false positives.
5. **Platform-specific breakage** — Wayland (#21983), Windows PowerShell freezes (#30247), cmd.exe path quoting (#30246), non-UTF-8 web fetch (#27980). Cross-platform polish remains a backlog.
6. **Token/context bloat** — #19561 ("tactful extraction" for surgical reads), #22745, and the AST EPICs all stem from frustration with ~36.6k context baselines and +15k/turn file-read spikes.
7. **Agent misunderstanding its own capabilities** — #21968 (doesn't invoke skills/spawn subagents) and #21432 (should be its own expert guide) reflect a gap between the platform's extensibility surface and model behavior.

---

*Digest compiled from 30 issues and 20 PRs updated 2026-11-12 on github.com/google-gemini/gemini-cli.*

</details>

<details>
<summary><strong>GitHub Copilot CLI</strong> — <a href="https://github.com/github/copilot-cli">github/copilot-cli</a></summary>

# GitHub Copilot CLI Community Digest — 2026-11-12

## 1. Today's Highlights

Two prerelease builds shipped in the last 24 hours (v1.0.110-3 and v1.0.110-2), focused on accessibility (screen reader announcements for sessions), interrupted-response handling, and crash-recovery for deleted working directories. Issue activity remains heavy (41 updated, 30 shown), with the most engaged threads centered on WSL2 clipboard failures, ACP session-store regressions, and OAuth/MCP authentication edge cases. No pull requests were updated in the reporting window.

---

## 2. Releases

**v1.0.110-3** (prerelease)
- Fixed unnecessary error popups during Microsoft Entra sign-in when an organization account is available ([#5088](https://github.com/github/copilot-cli/issues/5088) context).
- Screen readers now identify the current session and announce when sessions need attention or are idle in the Sessions list.
- `/usage` model rows now wrap at terminal width instead of breaking.

**v1.0.110-2** (prerelease)
- Partial responses and reasoning from interrupted or failed attempts are now labeled as incomplete while preserving their text.
- Starting `copilot` from a since-deleted directory now emits a clear "directory no longer exists" message with recovery steps, replacing a Node stack trace crash.

These are incremental quality fixes; no breaking changes noted.

---

## 3. Hot Issues

1. **[#3534 [CLOSED] WSL2 (ARM64): `/copy` fails with `clip.exe exited with code 1`](https://github.com/github/copilot-cli/issues/3534)** — 9 comments, 👍7. Longest-running active thread; a `cmd.exe` quoting bug in the Windows clipboard wrapper breaks `/copy` on ARM64 WSL2. High community engagement (highest 👍 count in the set) and now closed — worth confirming the fix in a stable release.

2. **[#5053 [OPEN] Regression in 1.0.89: ACP sessions stop indexing conversation history and usage in session-store.db](https://github.com/github/copilot-cli/issues/5053)** — 4 comments. A functional regression affecting ACP integrations; sessions complete but local indexing silently fails. Important for anyone relying on session analytics or history replay.

3. **[#4606 [OPEN] Google Workspace MCP OAuth fails on trailing-slash issuer mismatch](https://github.com/github/copilot-cli/issues/4606)** — 4 comments, 👍2. Blocks MCP auth against Google's official endpoints before the browser flow even starts; a standards-compliance issue (RFC 8414 issuer matching).

4. **[#2955 [OPEN] `/allow-all` does not suppress bash tool execution prompts](https://github.com/github/copilot-cli/issues/2955)** — 4 comments, 👍2. Persistent since April; a permissions command that doesn't do what its name implies. High developer annoyance factor.

5. **[#5312 [CLOSED] Context window rollover still fails after #5205 closed as completed](https://github.com/github/copilot-cli/issues/5312)** — 4 comments. Community frustration over a prior issue being closed without a linked fix; `checkpoint.md` absence recurs on 1.0.105. Now closed, but the reporting history is a transparency cautionary tale.

6. **[#5335 [OPEN] Repeated HTTP 422 cybersecurity-risk flags block legitimate local flaky-test debugging](https://github.com/github/copilot-cli/issues/5335)** — 3 comments. Safety classifiers misfiring on ordinary debugging workflows; a false-positive risk worth tracking closely.

7. **[#5145 [OPEN] 400 `reasoning_text` in thinking mode must be passed back](https://github.com/github/copilot-cli/issues/5145)** — 3 comments, 👍1. Affects custom OpenAI-compatible providers (`wireApi: "responses"`); the runtime-synthesized assistant turn after a background shell exits violates the API contract.

8. **[#5256 [CLOSED] High CPU and repeated `gh auth token` failures when not signed in](https://github.com/github/copilot-cli/issues/5256)** — 2 comments. Tight-loop auth probing with no backoff; a resource-drain bug affecting BYOK users without GitHub credentials. Now closed.

9. **[#5429 [OPEN] API paths at the beginning of a prompt are interpreted as slash commands](https://github.com/github/copilot-cli/issues/5429)** — New today. Pasting `/chat-sessions` as the start of a natural-language prompt triggers slash-command parsing. Small but disruptive for everyday API work.

10. **[#5424 [OPEN] linux-arm64 binary: ENOEXEC on Linux 6.12 aarch64](https://github.com/github/copilot-cli/issues/5424)** — New today. The Bun single-file executable fails `execve(2)` on modern 4K-page ARM kernels but runs via `ld.so`. Platform packaging regression worth immediate triage.

---

## 4. Key PR Progress

No pull requests were updated in the last 24 hours (Total: 0 items). This section is omitted for this digest.

---

## 5. Hot Discussions

No discussion data was provided. This section is omitted.

---

## 6. Feature Request Trends

Distilling from the current issue set, the most-requested directions are:

- **Permission and command control** — `/allow-all` not honoring its contract ([#2955](https://github.com/github/copilot-cli/issues/2955)), auto-cancelled permission prompts ([#5018](https://github.com/github/copilot-cli/issues/5018)), spurious `permission_prompt` notifications after auto-approval ([#5417](https://github.com/github/copilot-cli/issues/5417)), and the ability to disable built-in slash commands ([#5375](https://github.com/github/copilot-cli/issues/5375)).
- **Configuration unification** — a single interactive `/config` editor to replace scattered slash commands, explicitly framed as "Claude Code parity" ([#3352](https://github.com/github/copilot-cli/issues/3352)).
- **Session UX improvements** — inline session summaries in the picker ([#2330](https://github.com/github/copilot-cli/issues/2330)) and better transcript controls in concise mode ([#5427](https://github.com/github/copilot-cli/issues/5426)).
- **Localization/voice** — configurable transcription language for `/voice` instead of hard-coded auto-detection ([#5226](https://github.com/github/copilot-cli/issues/5226)).
- **Symlink and path handling** — repo instruction files symlinked outside the repo are not loaded ([#5425](https://github.com/github/copilot-cli/issues/5425)).

---

## 7. Developer Pain Points

Recurring frustrations across the updated issue set:

- **Platform-specific breakage on ARM64 and Linux 6.12+** — WSL2 ARM64 clipboard ([#3534](https://github.com/github/copilot-cli/issues/3534)) and aarch64 ENOEXEC failures ([#5424](https://github.com/github/copilot-cli/issues/5424)) suggest packaging/architecture testing gaps.
- **Auth fragility** — Entra broker crashes ([#5088](https://github.com/github/copilot-cli/issues/5088)), MCP OAuth DCR reuse after expiry ([#5284](https://github.com/github/copilot-cli/issues/5284)), Google issuer mismatch ([#4606](https://github.com/github/copilot-cli/issues/4606)), and tight-loop `gh auth token` retries ([#5256](https://github.com/github/copilot-cli/issues/5256)).
- **MCP session/tool drift** — resumed sessions failing with "Tool reference not found" when an MCP server's tools change between launches ([#5359](https://github.com/github/copilot-cli/issues/5359)) and stdio MCP servers dropped during session-ID swap ([#4920](https://github.com/github/copilot-cli/issues/4920)).
- **Safety classifiers blocking legitimate work** — HTTP 422 cybersecurity-risk flags interrupting local debugging ([#5335](https://github.com/github/copilot-cli/issues/5335)).
- **Sandbox limitations on Windows/.NET** — MSBuild worker processes unable to connect in sandbox mode ([#5421](https://github.com/github/copilot-cli/issues/5421)).
- **Perceived lack of closure transparency** — community members re-filing issues after prior ones were closed without linked fixes or release notes ([#5312](https://github.com/github/copilot-cli/issues/5312)).

---

*Sources: github.com/github/copilot-cli issues and releases, data captured 2026-11-12.*

</details>

<details>
<summary><strong>OpenCode</strong> — <a href="https://github.com/anomalyco/opencode">anomalyco/opencode</a></summary>

# OpenCode Community Digest — 2026-11-12

## 1. Today's Highlights

Activity remains intense around the **v2 desktop/TUI rollout**, with a fresh patch release (`process-daemon-v0.5.2`) and roughly 50 issues updated in the last 24h. The **free-tier problems megathread (#59387)** continues to dominate the issue tracker at 355 comments, while the top-voted historical bug (**clipboard copy, #4283**) was finally closed after a year with 135 👍. On the PR side, work is converging on **subagent concurrency caps, MCP event bus publishing, session history search, and self-hosted account auto-balancing**.

---

## 2. Releases

**process-daemon-v0.5.2** — `opencode-pty` bumped to `0.5.2` (protocol 8), sourced from `packages/process-daemon` and published to npm as `@opencode/pty@0.5.2`. This is a minor PTY/daemon protocol iteration; no release notes indicate breaking changes.

---

## 3. Hot Issues

1. **[#59387 — [zen] Free tier issues megathread](https://github.com/anomalyco/opencode/issues/59387)** *(OPEN, 355 comments, 27 👍)* — Canonical tracking issue for free-tier errors (`Free usage exceeded`, stuck resets, desktop tier mismatch). Still extremely active; effectively the community's support hub.
2. **[#4283 — Copy To Clipboard not working](https://github.com/anomalyco/opencode/issues/4283)** *(CLOSED, 160 comments, 135 👍)* — Long-standing, highest-engagement bug in the tracker, finally closed. High community relief expected.
3. **[#62797 — Plan mode reminder persists after agent switch](https://github.com/anomalyco/opencode/issues/62797)** *(CLOSED, 13 comments)* — TUI regression blocking implementation workflows; closed quickly.
4. **[#51209 — Expose V2 TUI composer to plugins](https://github.com/anomalyco/opencode/issues/51209)** *(OPEN, 12 comments, 7 👍)* — Feature parity gap: V1's `client.tui.appendPrompt` has no V2 equivalent. Actively requested by plugin authors.
5. **[#54513 — Continuous `/dev/snd/timer` polling after finished session](https://github.com/anomalyco/opencode/issues/54513)** *(CLOSED, 9 comments)* — CPU pegging from sound notification logic; a well-debugged resource-leak class bug.
6. **[#63417 — Client reconnect splash every ≤10s (HA add-on)](https://github.com/anomalyco/opencode/issues/63417)** *(OPEN, 7 comments)* — Network instability on Home Assistant add-on across iOS and desktop; disrupts active typing.
7. **[#63345 — Background shell notices accumulate below active turn](https://github.com/anomalyco/opencode/issues/63345)** *(CLOSED, 7 comments)* — TUI rendering corruption during concurrent shell completions.
8. **[#62002 — `default_agent` silently reverts to `build` on hot config reload](https://github.com/anomalyco/opencode/issues/62002)** *(OPEN, 6 comments)* — Silent loss of model/permission config mid-session; enterprise-relevant reliability issue.
9. **[#63393 — Changing the model vanished queued requests](https://github.com/anomalyco/opencode/issues/63393)** *(OPEN, 6 comments)* — Data-loss UX: model switch during free-tier exhaustion drops the prompt queue.
10. **[#57345 — Delayed OSC 10/11 replies leak `:ffff/ffff/ffff` into prompt](https://github.com/anomalyco/opencode/issues/57345)** and **[#57517 — OSC 4 palette replies leak into prompt](https://github.com/anomalyco/opencode/issues/57517)** *(both OPEN, reproduced)* — Paired TUI terminal-probe bugs; consistent reporter findings across SSH and system theme setups.

---

## 4. Key PR Progress

1. **[#63432 — fix(app): use consistent dialog sizes](https://github.com/anomalyco/opencode/pull/63432)** — Refactors dialog sizing; removes per-dialog CSS overrides in favor of shared sizing.
2. **[#63227 — feat(core): bound subagent concurrency](https://github.com/anomalyco/opencode/pull/63227)** — Hard cap on concurrent subagents per session; closes #63303 and #27110. Directly addresses runaway cost.
3. **[#63261 — feat(core): publish MCP events on the bus](https://github.com/anomalyco/opencode/pull/63261)** — Experimental bus publishing so clients and plugins can subscribe to MCP server events, with reconnect-safe subscriptions.
4. **[#63424 — fix(core): retry ripgrep binary resolution after failure](https://github.com/anomalyco/opencode/pull/63424)** — Fixes `Effect.cached` caching failures; resolves the Windows-proxy infinite failure in #51022.
5. **[#63354 — feat(core): auto-balance OpenCode Go accounts by usage](https://github.com/anomalyco/opencode/pull/63354)** — Adds `experimental.auto_balance_accounts`; selects least-usage account with 5-minute usage caching.
6. **[#63411 — feat(core): session history search and inspect tools](https://github.com/anomalyco/opencode/pull/63411)** — Agents can search/inspect their own session history, gated by `experimental.session_search`.
7. **[#63421 — fix(core): preserve Anthropic cache hints through AI SDK bridge](https://github.com/anomalyco/opencode/pull/63421)** — Corrects `anthropic` vs `anthropic@ai-v6` provider options key mismatch.
8. **[#63416 — fix(core): recover parent wakes after subagent report acknowledgement](https://github.com/anomalyco/opencode/pull/63416)** — Prevents parents from idling with an unclaimed pending notice after a crash.
9. **[#63136 — fix(cli): scope background service registration to network namespace](https://github.com/anomalyco/opencode/pull/63136)** — Fixes replacement loops when running two clients as the same user across netns.
10. **[#63427 — feat(app): hide and mute sessions in Recent sidebar](https://github.com/anomalyco/opencode/pull/63427)** — Desktop sidebar parity with iOS drawer; supports hidden/muted sessions with searchability.

Also worth noting: **[#60767 (stream errors without messages)](https://github.com/anomalyco/opencode/pull/60767)**, **[#60683 (preserve CLI service channels)](https://github.com/anomalyco/opencode/pull/60683)**, and the cleanup PR **[#63428 (skip upstream-only maintenance on forks)](https://github.com/anomalyco/opencode/pull/63428)**.

---

## 5. Hot Discussions

No GitHub Discussions data was provided in this dataset; this section is omitted.

---

## 6. Feature Request Trends

- **Plugin API parity (V2 composer access, MCP events on bus):** Requests #51209 and PR #63261 show a clear demand for first-class plugin extensibility in V2.
- **Wide-screen / resizable session layout:** #53382 and #54800 (4 👍) both point at the 744px session column cap; users want wide-mode back for diagrams and tables.
- **Native scheduling / recurring automations:** #63232 asks for built-in scheduled agents, currently only achievable via OS cron/Task Scheduler.
- **Session organization in desktop:** #63231 (project grouping), plus PR #63427 (hide/mute) and titlebar session search, indicate sidebar management is a priority.
- **Cost/concurrency controls:** #63227 and #63354 collectively respond to subagent runaway cost and OpenCode Go quota management.
- **Agent auth/route flexibility:** #63331 (github-copilot/auto missing in standalone mode) highlights need for consistent model routing across deployment modes.

---

## 7. Developer Pain Points

- **Free-tier friction remains the #1 theme.** #59387's 355 comments underscore how much support load the free tier generates; related queue-loss bug #63393 compounds it.
- **TUI terminal-probe leakage.** Recurring OSC 4/10/11 reply injection (#57517, #57345) into the prompt is a persistent, reproducible nuisance over SSH and theme-dependent setups.
- **Rendering/scroll regressions in long sessions.** Jumping scroll past thinking blocks (#58666), accumulating background shell notices (#63345), and leaking tooltip computations (#61652) collectively erode TUI trust.
- **Windows install/upgrade friction.** #51755 (no in-place upgrade), #63352 (bash installer requires WSL), and #51022 (proxy-blind ripgrep download) show Windows users consistently hitting install-time blockers.
- **Configuration and documentation drift.** #63092 documents a 5s MCP timeout that is actually 30s in code; #62002 shows silent `default_agent` reverts on reload — both undermine config predictability.
- **Mobile/local-network and desktop polish gaps.** Android #62934 (missing `ACCESS_LOCAL_NETWORK`), the recurring Windows desktop "open browser tab" regression (#63229), and the 160px fixed variant flyout (#62981) suggest mobile and UI-detail QA debt.

</details>

<details>
<summary><strong>Pi</strong> — <a href="https://github.com/earendil-works/pi">earendil-works/pi</a></summary>

# Pi Community Digest — 2026-11-12

## Today's Highlights

No new releases in the last 24 hours, but the project saw substantial activity with 50 issues and 23 PRs updated. The `pi-durable` subsystem is maturing rapidly with new backup, replication, and storage-boundary proposals, while several long-standing bugs (crash on cancelled reads, Windows `pi -p` hang) were closed. Model provider compatibility remains a hot area, with fixes for GitHub Copilot Gemini reasoning and requests to migrate the broken `ant-ling` catalog.

## Releases

No new releases in the last 24 hours.

## Hot Issues

1. **[#10162](https://github.com/earendil-works/pi/issues/10162) — Too many input images stop the agent task** *(OPEN, 9 comments)*
   Long-running "babysitting" agent sessions (PR QA, etc.) silently die when too many images accumulate in the context. Undermines Pi's core strength of indefinite autonomous operation.

2. **[#11026](https://github.com/earendil-works/pi/issues/11026) — pi-durable: permanently delete a conversation from storage** *(OPEN, 7 comments, 6 👍)*
   A highly-upvoted request for `harness.deleteConversation()` with proper lifecycle safety (refusing while runs are active). Reflects growing production use of `pi-durable` where data hygiene matters.

3. **[#10386](https://github.com/earendil-works/pi/issues/10386) — Durable: host coding-agent extensions** *(OPEN, 7 comments)*
   Proposes AgentSession-backed durable runtime or hook parity so extensions work identically across harnesses. Filed by an AI agent on behalf of a user — itself a signal of how Pi is being used.

4. **[#3005](https://github.com/earendil-works/pi/issues/3005) — Make "UPDATE AVAILABLE" message toggleable** *(CLOSED, 9 comments)*
   NixOS users can't easily `npm i -g` to update, so the persistent yellow banner is pure noise. Closed after long discussion — a good example of packaging-environment friction.

5. **[#12068](https://github.com/earendil-works/pi/issues/12068) — `pi -p` never exits on Windows (1.5.1/1.5.2)** *(CLOSED, 5 comments)*
   A regression where tool calls + extension `pi.exec` in event handlers cause the process to hang. Critical for CI/scripted usage; regression between 1.5.0 and 1.5.1.

6. **[#11956](https://github.com/earendil-works/pi/issues/11956) — Crash on cancelling a read during file open** *(CLOSED, prio:p0, 6 comments)*
   Uncaught `AbortError` kills Pi when codemode's `Promise.all` cancels a read mid-stat. A p0 crash triggered by a common concurrency pattern.

7. **[#12019](https://github.com/earendil-works/pi/issues/12019) — github-copilot: Gemini models never get `reasoning_effort`** *(OPEN, prio:p0, 3 comments)*
   `--thinking` silently does nothing for Copilot's Gemini models due to hardcoded `supportsReasoningEffort: false`. Quiet capability loss is worse than a hard error.

8. **[#10317](https://github.com/earendil-works/pi/issues/10317) — Emit `queue_update` to extensions so injected input discard is observable** *(OPEN, 4 comments)*
   `sendUserMessage` returns `void`, so extensions can't tell if their injected steer was discarded on abort. An API observability gap for extension authors.

9. **[#11999](https://github.com/earendil-works/pi/issues/11999) — ant-ling provider: migrate to Ling 3.x Flash** *(OPEN, prio:p0)*
   The `ant-ling` catalog ships Ling 2.6/Ring 2.6 IDs that no longer resolve upstream — provider is broken end-to-end. Author requests LGTM to submit a PR.

10. **[#12035](https://github.com/earendil-works/pi/issues/12035) — Threshold compaction fires far below the window for virtual models** *(OPEN, 2 comments)*
    With a virtual model selected, `_modelForMessage()` returns `undefined`, so `contextWindow` is unknown and compaction triggers prematurely. Affects anyone using model aliasing/routing.

## Key PR Progress

1. **[#12071](https://github.com/earendil-works/pi/pull/12071) — fix(ai): preserve hosted Responses tool-search history** *(CLOSED)*
   Pi was dropping `tool_search_call`/`tool_search_output` items, breaking cached prefixes on stateless follow-up requests. Important for Vercel AI Gateway users.

2. **[#12069](https://github.com/earendil-works/pi/pull/12069) — fix(ai): route Vercel OpenAI models through Responses** *(CLOSED)*
   Routes `openai/*` catalog models via `openai-responses` so Responses-specific features work through the Vercel gateway.

3. **[#12072](https://github.com/earendil-works/pi/pull/12072) — feat(ai): group deferred Responses tools into namespaces** *(CLOSED)*
   Cuts input-token cost for large tool catalogs by letting hosted search defer namespace descriptions too. A meaningful efficiency win.

4. **[#12059](https://github.com/earendil-works/pi/pull/12059) — feat(p2): back up to Radius (`P2_BACKUP=radius`)** *(OPEN)*
   Extends the new backup coordinator beyond local folders to remote storage. Part of a coordinated `pi-durable` persistence push with #12042 and #11990.

5. **[#12042](https://github.com/earendil-works/pi/pull/12042) — feat(p2): backup coordinator** *(CLOSED)*
   Ties together prior replication, catalog, and subagent/share storage work into a replicable, restorable state model.

6. **[#12055](https://github.com/earendil-works/pi/pull/12055) — fix(durable,env): skip entries removed during listDir enumeration** *(CLOSED)*
   Fixes the read-only JSONL `ENOENT ... .reclaim` race from [#11994](https://github.com/earendil-works/pi/issues/11994). A solid concurrency-safety fix.

7. **[#12054](https://github.com/earendil-works/pi/pull/12054) — keep restored MCP tools when an extension hides only its own tool** *(CLOSED)*
   Fixes [#11996](https://github.com/earendil-works/pi/issues/11996): resumed sessions lost `tool_search`-loaded MCP tools because `setActiveToolsByName()` was too aggressive.

8. **[#12058](https://github.com/earendil-works/pi/pull/12058) — keep bash output when retained tail is one clipped line** *(CLOSED)*
   Fixes [#12062](https://github.com/earendil-works/pi/issues/12062): snapshot returned empty while still claiming truncation. Edge-case but affects real debugging workflows.

9. **[#12046](https://github.com/earendil-works/pi/pull/12046) — Fix standalone binary not resolving extension deps via package.json main/exports** *(CLOSED)*
   `bun build --compile` had `--compile-autoload-package-json` off, silently breaking extensions that rely on `exports`. Fixes [#12012](https://github.com/earendil-works/pi/issues/12012) (Shiki).

10. **[#12051](https://github.com/earendil-works/pi/pull/12051) — verify managed updates with the Node.js running pi** *(CLOSED)*
    Windows launchers ran validation via the npm shim rather than the bundled standalone Node, causing false update failures.

## Hot Discussions

**Show and tell / Integration**
- **[#12063](https://github.com/earendil-works/pi/discussions/12063) — Anyone interested in a Pi integration for Concord?** *(1 👍)*
  Concord is an open-source MCP server providing shared work-state (presence, file claims, task context, handoffs) across coding harnesses. The author wants Pi sessions to participate alongside Claude Code and Cursor — a notable signal that Pi is being treated as a first-class peer in cross-harness workflows.

## Feature Request Trends

- **Durable/persistent state maturity**: The strongest cluster of the week. Deletion APIs ([#11026](https://github.com/earendil-works/pi/issues/11026)), remote backup ([#12059](https://github.com/earendil-works/pi/pull/12059), [#12042](https://github.com/earendil-works/pi/pull/12042)), and storage-boundary abstraction ([#11990](https://github.com/earendil-works/pi/pull/11990)) all point to `pi-durable` graduating from experiment to production infrastructure.
- **Extension API observability & lifecycle**: Multiple requests for richer extension contracts — `queue_update` events ([#10317](https://github.com/earendil-works/pi/issues/10317)), atomic enqueue-and-wake ([#12073](https://github.com/earendil-works/pi/issues/12073)), request admission gates ([#12057](https://github.com/earendil-works/pi/issues/12057)), and durable hook parity ([#10386](https://github.com/earendil-works/pi/issues/10386)).
- **Model provider compatibility**: Requests to fix/migrate provider catalogs ([#11999](https://github.com/earendil-works/pi/issues/11999), [#12019](https://github.com/earendil-works/pi/issues/12019)) and to correctly route OpenAI via Vercel Responses ([#12069](https://github.com/earendil-works/pi/pull/12069)).
- **TUI/terminal polish**: Toggleable update banner ([#3005](https://github.com/earendil-works/pi/issues/3005)), Cmd+V image paste ([#4332](https://github.com/earendil-works/pi/issues/4332)), Kitty clipboard protocol ([#10089](https://github.com/earendil-works/pi/issues/10089)), and alacritty key handling ([#12050](https://github.com/earendil-works/pi/issues/12050)).

## Developer Pain Points

- **Regressions are user-visible and costly**: The Windows `pi -p` hang ([#12068](https://github.com/earendil-works/pi/issues/12068)) between 1.5.0 and 1.5.1, and the p0 read-cancellation crash ([#11956](https://github.com/earendil-works/pi/issues/11956)), show that recent changes are introducing hard failures in common paths.
- **Silent capability loss is worse than hard errors**: `--thinking` doing nothing for Copilot Gemini ([#12019](https://github.com/earendil-works/pi/issues/12019)) and virtual models triggering premature compaction ([#12035](https://github.com/earendil-works/pi/issues/12035)) confuse users because nothing signals the misbehavior.
- **Packaging/distribution friction**: NixOS users can't update via `npm i -g` ([#3005](https://github.com/earendil-works/pi/issues/3005)), standalone binaries fail to resolve extension deps ([#12012](https://github.com/earendil-works/pi/issues/12012)), and Windows launchers validate with the wrong Node ([#12051](https://github.com/earendil-works/pi/pull/12051)).
- **Extension authors lack lifecycle guarantees**: No receipt for injected-message discard ([#10317](https://github.com/earendil-works/pi/issues/10317)), no atomic enqueue API ([#12073](https://github.com/earendil-works/pi/issues/12073)), and no admission gate ([#12057](https://github.com/earendil-works/pi/issues/12057)) force workarounds.
- **Data hygiene and privacy**: Secrets drawn on screen by `/login` ([#11977](https://github.com/earendil-works/pi/issues/11977)) and HTML export emitting raw OSC 8 sequences ([#12003](https://github.com/earendil-works/pi/issues/12003)) — small but trust-eroding.
- **Concurrency and encoding edge cases**: Lone UTF-16 surrogates poisoning every subsequent request ([#12014](https://github.com/earendil-works/pi/issues/12014)) and JSONL `.reclaim` rename races ([#11994](https://github.com/earendil-works/pi/issues/11994)) highlight the value of the ongoing `pi-durable` hardening work.

</details>

<details>
<summary><strong>Qwen Code</strong> — <a href="https://github.com/QwenLM/qwen-code">QwenLM/qwen-code</a></summary>

# Qwen Code Community Digest — 2026-11-12

## 1. Today's Highlights

Qwen Code 1.0 Preview (`v1.0.0-preview`) has landed, merging Qoder and Qwen Code agent capabilities for end-to-end code understanding, implementation, debugging, and testing. Meanwhile, the community is actively stress-testing the event-bus agent loop refactor and Managed Agent parity features (web terminal, client filesystems, durable `/loop` wakeups). CI stability remains the dominant operational concern, with several flaky-test and lint-gate issues surfacing in the last 24 hours.

## 2. Releases

**v1.0.0-preview** — [Release page](https://github.com/QwenLM/qwen-code/releases)
- Merges agent capabilities from Qoder and Qwen Code for code understanding, implementation, debugging, and testing.
- Supports Qwen and Qoder accounts.
- ⚠️ Interfaces, configuration options, and behaviors may change during the Preview period.

## 3. Hot Issues

1. **[#14724](https://github.com/QwenLM/qwen-code/issues/14724)** — *Main CI failed: Managed Agent gate — no test identified* (325 comments). The highest-traffic issue in the tracker; a long-running CI gate failure with no attributable test. Its comment volume signals sustained bot/CI churn rather than human discussion.

2. **[#11680](https://github.com/QwenLM/qwen-code/issues/11680)** — *E2E Tests — no test identified* (48 comments). Persistent main-branch E2E failures tracked per commit; symptomatic of broader CI signal-to-noise problems.

3. **[#11678](https://github.com/QwenLM/qwen-code/issues/11678)** — *Qwen Code CI — Windows Node 22.x failure* (26 comments, `autofix/in-progress`). Windows-specific test failures remain a recurring platform gap.

4. **[#13009](https://github.com/QwenLM/qwen-code/issues/13009)** — *cron-tools registration failure* (21 comments, `status/ready-for-agent`, `autofix/approved`). A concrete, scoped bug now queued for automated fix — representative of the project's autofix pipeline maturing.

5. **[#16425](https://github.com/QwenLM/qwen-code/issues/16425)** *(CLOSED)* — *Workflow agent permission approval never renders; run hangs indefinitely* (10 comments, P1). A serious UX/correctness bug in multi-agent workflows where permission prompts fire but never render, leaving status bars stuck. Now closed — worth noting as the resolution lands.

6. **[#16915](https://github.com/QwenLM/qwen-code/issues/16915)** — *Task reports two errors and cannot continue* (7 comments). User-facing connection interruption to the model service; a recurring 1.x stability complaint.

7. **[#124](https://github.com/QwenLM/qwen-code/issues/124)** — *Self-hosted Qwen3-Coder tool calls fail almost always* (7 comments, 7 👍). The most-upvoted issue shown; self-hosting tool-call reliability remains an open sore for the OSS deployment community.

8. **[#15861](https://github.com/QwenLM/qwen-code/issues/15861)** — *Web-shell host-directory-picker smoke times out, PR-independent* (7 comments, P1). A deterministic E2E failure causing every PR to pay a re-attribution cost — directly impacting contributor throughput.

9. **[#16982](https://github.com/QwenLM/qwen-code/issues/16982)** — *`/rewind` after `/cd` restores checkpoint into wrong working directory* (P1, `ready-for-human`). A data-loss-class bug: silently overwrites unrelated files. High severity for session management.

10. **[#16767](https://github.com/QwenLM/qwen-code/issues/16767)** — *Spurious "previous request was interrupted" banner on tool-call turn settle* (P2). Web Shell falsely signals interruption when a turn ends cleanly on a tool call — a noisy UX regression in daemon sessions.

## 4. Key PR Progress

1. **[#16938](https://github.com/QwenLM/qwen-code/pull/16938)** — *Re-express the agent loop on the event bus (opt-in)*. Refactors the shared agent loop into Conversation/Llm/Tool handlers plus a host adapter on event-bus primitives — architectural groundwork for the 1.0 agent model.

2. **[#16866](https://github.com/QwenLM/qwen-code/pull/16866)** — *Managed Web Terminal*. Adds an interactive web terminal relayed byte-for-byte via WebSocket to the Runtime worker PTY, closing the `web_terminal` Managed parity gap.

3. **[#16844](https://github.com/QwenLM/qwen-code/pull/16844)** — *Register client filesystems into managed sessions*. Lets Managed Agent sessions access the browser user's local filesystem via a Java-mediated MCP bridge (workaround for no WebSocket tunnels in the hosted harness).

4. **[#16835](https://github.com/QwenLM/qwen-code/pull/16835)** — *Durable self-paced `/loop` wakeups for Managed Sessions*. Moves wakeups from in-memory timers to durable Session-journal inputs with earliest-start admission.

5. **[#16653](https://github.com/QwenLM/qwen-code/pull/16653)** — *Enforce Read deny rules on grep and glob results*. Closes a permission leak where ripgrep/grep/glob could return denied content before truncation/formatting.

6. **[#16895](https://github.com/QwenLM/qwen-code/pull/16895)** — *Bound post-compaction restoration by the context window*. Fixes the file-content restoration budget to account for route-scoped server ceilings and CJK token density.

7. **[#16926](https://github.com/QwenLM/qwen-code/pull/16926)** — *Publish file-history backups atomically*. Ports crash-safe backup capture from the preview branch — pilot of the "split preview features into main PRs" track.

8. **[#16877](https://github.com/QwenLM/qwen-code/pull/16877)** — *Manual session PR binding (`/pr` command + Web Shell dialog)*. Adds explicit user-driven PR binding for TUI, headless CLI, and daemon sessions.

9. **[#16865](https://github.com/QwenLM/qwen-code/pull/16865)** — *Gate reconcile record read and batch segment plan* (perf). Skips redundant delivery-record reads when the ledger already has receipts — a managed-agent reconcile optimization.

10. **[#16804](https://github.com/QwenLM/qwen-code/pull/16804)** — *Configure DingTalk webhooks and scheduled delivery targets*. Extends Web Shell Channels with DingTalk app-bot and webhook methods plus delivery targets.

## 5. Hot Discussions

No Discussion data was provided in the source dataset, so this section is omitted.

## 6. Feature Request Trends

Distilled from Issues and PRs, the most-requested directions are:

- **Verification as a core mechanism** — [#16941](https://github.com/QwenLM/qwen-code/issues/16941) proposes a verify-then-repair loop with a clean-context verifier subagent.
- **Programmatic tool calling** — [#16944](https://github.com/QwenLM/qwen-code/issues/16944) asks the agent to orchestrate tools as code inside the sandbox and return only results.
- **Web Shell polish & extensibility** — host content slots in the model picker ([#16893](https://github.com/QwenLM/qwen-code/issues/16893)), contact-based channel allowlists ([#16931](https://github.com/QwenLM/qwen-code/issues/16931)), focus management ([#16980](https://github.com/QwenLM/qwen-code/issues/16980)), and session search improvements ([#16779](https://github.com/QwenLM/qwen-code/pull/16779)).
- **Managed Agent parity** — web terminal, client filesystems, durable loop wakeups, and shared external workspaces ([#16023](https://github.com/QwenLM/qwen-code/pull/16023)).
- **Multi-agent workflows** — the roadmap label on [#16425](https://github.com/QwenLM/qwen-code/issues/16425) signals demand for reliable workflow-agent permission handling.

## 7. Developer Pain Points

- **CI signal-to-noise**: The top issues by comment count are all CI failure reports ([#14724](https://github.com/QwenLM/qwen-code/issues/14724), [#11680](https://github.com/QwenLM/qwen-code/issues/11680), [#11678](https://github.com/QwenLM/qwen-code/issues/11678)). Flaky tests and unattributable failures dominate bot activity, and PR-independent failures like [#15861](https://github.com/QwenLM/qwen-code/issues/15861) tax every contributor.
- **Model connection instability**: Repeated reports of interrupted model service connections during execution ([#16915](https://github.com/QwenLM/qwen-code/issues/16915), [#16908](https://github.com/QwenLM/qwen-code/issues/16908)), often without detailed logs.
- **Self-hosting friction**: Tool calls failing with self-hosted Qwen3-Coder ([#124](https://github.com/QwenLM/qwen-code/issues/124)) remains the top-voted issue shown, limiting OSS deployment adoption.
- **Permission & data-safety correctness**: Read deny rules leaking through search results ([#16653](https://github.com/QwenLM/qwen-code/pull/16653)) and `/rewind` restoring into the wrong directory ([#16982](https://github.com/QwenLM/qwen-code/issues/16982)) are trust-eroding bugs.
- **Docs drift**: Stale guidance such as "restart after adding an MCP server" ([#16925](https://github.com/QwenLM/qwen-code/issues/16925)) when hot-reload already works.
- **Platform quirks**: macOS symlink/argv handling causing silent lint no-ops ([#16954](https://github.com/QwenLM/qwen-code/issues/16954)) and glob being unable to match directories ([#16921](https://github.com/QwenLM/qwen-code/issues/16921)).

---

*Digest generated from github.com/QwenLM/qwen-code data for 2026-11-12. Issue/PR selection weighted by comment count, severity labels, and community impact.*

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*