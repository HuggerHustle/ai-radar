# AI CLI Tools Community Digest 2026-11-15

> Generated: 2026-11-15 00:58 UTC | Tools covered: 7

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
**Date: 2026-11-15 | Tools: Claude Code, OpenAI Codex, Gemini CLI, GitHub Copilot CLI, OpenCode, Pi, Qwen Code**

---

## 1. Ecosystem Overview

The AI CLI ecosystem on 2026-11-15 is in a **consolidation-and-hardening phase** rather than a feature-expansion one. No major releases shipped across the seven tools in the past 24 hours, yet issue trackers are collectively processing hundreds of items — a signal that shipped agent capabilities are now colliding with real-world workloads. Three themes dominate: **context/resource bloat** (image payloads, MCP subprocesses, token overhead regressions), **subagent reliability** (hangs, silent mis-termination, broken delegation), and **trust gaps** (instruction-following erosion, silent permission downgrades, destructive-command behavior). Nearly every tool is also wrestling with **MCP lifecycle correctness** — OAuth flows, reconnect robustness, and hot-reload semantics — suggesting MCP has graduated from novelty to critical infrastructure that isn't yet production-grade.

---

## 2. Activity Comparison

| Tool | Issues Updated | PRs Updated | Discussions | Release Status |
|---|---|---|---|---|
| **Claude Code** | ~50 | 4 | N/A (not provided) | None (community builds 2.1.322–325) |
| **OpenAI Codex** | 10 noteworthy | 10 | 7 (active) | `rust-v0.171.0-alpha.5` (routine alpha) |
| **Gemini CLI** | 10 noteworthy | 10 | N/A (not provided) | None (v0.45.2 changelog PR pending) |
| **GitHub Copilot CLI** | 22 (incl. 8 closures) | 0 | N/A (not provided) | None |
| **OpenCode** | 10 noteworthy | 10 | N/A (not provided) | None (2.3.0 fallout active) |
| **Pi** | 10 noteworthy | 5 | 2 (active) | None |
| **Qwen Code** | 10 noteworthy | 10 | N/A (not provided) | `v0.27.2-nightly` published |

**Notes:**
- Claude Code reports aggregate counts (~50 issues); other repos report "noteworthy" filtered sets, so raw counts are not directly comparable.
- GitHub Copilot CLI had **zero PR activity** in the window — a notable outlier suggesting a small maintainer review queue or PR gating.
- Qwen Code's 373-comment CI issue (#14724) alone accounts for more raw comment volume than most tools' entire daily issue activity.

---

## 3. Shared Feature Directions

Four cross-cutting requirements appear in **three or more** tool communities:

### 3.1 Persistent / Shared Context & Memory
- **Claude Code:** #38536 "Shared Team Memory" (top-engaged issue, 34 comments).
- **OpenAI Codex:** #61348 "Continuous engineering workspace" (28 comments); multiple MCP discussions on cross-session retrieval (#52372, #38868).
- **Gemini CLI:** #18836 "Replace WriteToDo with persistent file-based task tracking"; #21000 native file tools for task state.
- **Qwen Code:** Web Shell managed worktrees (#17228) enabling parallel, isolated persistent sessions.
- **Common ask:** Continuity across sessions, handoffs, and agents — context should not die with a session.

### 3.2 Context / Payload Bloat Control
- **OpenAI Codex:** Image-base64 history bloat is the **single most reproduced complaint** (#28316, #41338, #18629, #20805).
- **OpenCode:** #59794 — all history images re-sent every request; #37844 — MCP subprocess multiplication.
- **Gemini CLI:** #24246 — 400 error past 128 tools; #19561 — "firehosing" large reads.
- **Pi:** New `toolOutput.maxBytes` / `maxLines` settings (#12163) directly target this.
- **GitHub Copilot CLI:** #5450 — ~20K token overhead regression post-1.0.106.
- **Common ask:** On-demand retrieval, payload pruning, and hard caps — not bigger context windows.

### 3.3 Subagent Reliability & Observability
- **Gemini CLI:** Entire subagent subsystem flagged: hangs (#21409), silent mis-termination (#22323), under-triggering (#21968), broken config (#22267).
- **OpenCode:** #59293 — subagent continuation always fails (`"ses"` literal).
- **Qwen Code:** #17261, #17247 — child-agent delegation fails on external-workspace profiles.
- **Claude Code:** Agents view regression (#109843); subagent model/context loss.
- **GitHub Copilot CLI:** #5437 — delegated subagents can't auth OAuth MCP servers.
- **Common ask:** Predictable delegation, discoverable subagent state, and reliable lifecycle hooks.

### 3.4 MCP Lifecycle Correctness
- **Claude Code:** #97369 (stale tool schemas), #109611 (missing connectors), #109594 (WSL reconnect).
- **GitHub Copilot CLI:** OAuth broker blocking paste (#5452), keychain re-prompts (#5434), delegated auth (#5437).
- **OpenCode:** #37844 MCP subprocess multiplication; lazy-spawn request (#53028).
- **OpenAI Codex:** MCP post-hook budget accounting (#61580); first-class MCP surfaces in Show-and-Tell.
- **Common ask:** Reconnect robustness, OAuth fallback paths, hot-reload, and bounded process footprints.

---

## 4. Differentiation Analysis

| Dimension | Claude Code | OpenAI Codex | Gemini CLI | Copilot CLI | OpenCode | Pi | Qwen Code |
|---|---|---|---|---|---|---|---|
| **Primary focus** | Team workflows, plugin ecosystem | Budget/rollout governance, image handling | Agent-loop unification, AST tooling | Enterprise auth, MCP integration | Provider management UX, V2 architecture | Tool output control, provider interop | Managed-agent, CI reliability |
| **Target user** | Pro teams, power users | Cross-surface (CLI + Desktop + Web) | Developer-tool engineers | Enterprise/GitHub-native | Self-hosted / local-model devs | Config-heavy tinkerers | Daemon/workspace operators |
| **Technical approach** | Plugin + hook architecture | Rust core, budget-gating primitives | Shared event-driven kernel (1.0 Preview) | Deep OneAuth / Entra integration | V2 client/server split, native CLI port | Config-driven tool contracts | Managed worktrees + hosted sessions |
| **Distinctive signal** | Highest issue volume; triage fatigue | Most PR velocity (10 budget PRs) | P0 build crisis (10-day nightly failure) | Zero PR throughput in window | AI triage bot governance issue | Highest signal-to-noise on tooling | CI flake dominating tracker |

**Key differentiators:**
- **Claude Code** is the most **community-scale** tool but shows triage strain (stale-closure re-filings like #96860).
- **OpenAI Codex** is the most **architecturally disciplined** — a coordinated PR cluster (#61579–61587) refactoring rollout budgets suggests a platform-level spend/rate governance push.
- **Gemini CLI** is mid-**architectural migration** (1.0 Preview loop kernel, ACP parity), creating a P0 build regression window.
- **GitHub Copilot CLI** is the most **enterprise-oriented** (OAuth brokers, Entra, keychain), but its zero-PR window is a concern.
- **OpenCode** is the most **local-model-friendly** (LM Studio/Jan, vLLM) and is dealing with self-inflicted governance issues (bot triage).
- **Pi** operates at the **tooling-contract layer** — less user-facing drama, more precision fixes.
- **Qwen Code** is the most **infrastructure-heavy** — daemon, CI, and managed-agent dominate over end-user features.

---

## 5. Community Momentum & Maturity

**Momentum ranking (engagement volume × velocity):**
1. **Claude Code** — Highest absolute engagement (~50 issues/day, top issue 34 comments), vibrant feature-request pipeline.
2. **Qwen Code** — Extremely high raw activity, but **inflated by CI automation** (373-comment bot issue); genuine dev momentum is moderate.
3. **OpenAI Codex** — Strong, focused PR throughput (10 budget PRs) and active Show-and-Tell culture (7 discussions).
4. **Gemini CLI** — High engagement on a narrow theme (subagent reliability); coordinated PR work on ACP parity.
5. **OpenCode** — Active but turbulent; 2.3.0 regression + bot triage issue dampen momentum.
6. **GitHub Copilot CLI** — Moderate issue flow, **zero PR throughput** in window — maturity without visible velocity.
7. **Pi** — Smaller but high-quality signal; PRs are precise and well-scoped.

**Maturity indicators:**
- **Most mature processes:** OpenAI Codex (structured PR refactors), Qwen Code (extensive CI/defake). 
- **Least mature processes:** OpenCode (AI triage closing live bugs), Claude Code (stale-closure churn).
- **Fastest iterating:** OpenAI Codex, Gemini CLI (both landing coordinated architectural changes).
- **Slowest in window:** GitHub Copilot CLI (no PRs).

---

## 6. Trend Signals

Six trends with **direct reference value for developers building or integrating AI CLI tools**:

1. **Context is the new bottleneck, not capability.** Every tool has image/tool-output/token-bloat complaints. **Action:** default to on-demand retrieval, cap tool outputs at the contract layer (as Pi's #12163 does), and never persist base64 payloads in replayable history.

2. **Subagents are shipping faster than they're trustworthy.** Hangs, silent success-on-failure, and broken delegation are endemic. **Action:** treat subagent status as untrusted until verified; build observability (trajectory sharing, as Gemini's #22598 requests) before scaling agent fleets.

3. **MCP has graduated to critical infrastructure — and is failing like it.** OAuth, reconnect, and hot-reload are broken across the board. **Action:** budget for MCP lifecycle hardening as a first-class workstream, not a plugin concern.

4. **Rapid auto-update cadence is producing regression churn.** Claude Code (2.1.32x MCP regressions), OpenCode (2.3.0 zombie processes), and Copilot CLI (1.0.106 token overhead) all show this pattern. **Action:** pin versions in production; treat alpha/nightly channels as test environments.

5. **Trust and safety is becoming a distinct product surface.** Instruction-following erosion (Claude Code #13689), destructive-command preference (Gemini #22672), and silent permission downgrades (Codex #60058) point to users demanding **auditable, fail-loud behavior**. **Action:** make silent fallbacks loud; expose policy resolution in logs.

6. **CI and triage hygiene are now community-facing reliability surfaces.** Qwen Code's CI flake dominates its tracker; OpenCode's bot closed a live bug. **Action:** invest in deterministic test identification and human-in-the-loop triage — automated triage that can't verify duplicate targets is worse than no triage.

**Bottom line for decision-makers:** The ecosystem has moved past "does the agent work?" to "does it work *reliably, transparently, and at scale*?" The tools investing in budget governance (Codex), lifecycle correctness (Pi, Gemini ACP), and process hygiene (Qwen CI) are positioning for enterprise adoption. The tools with the loudest communities (Claude Code, OpenCode) are also showing the most triage strain — a signal that growth without process maturity creates long-term trust debt.

---

## Per-Tool Reports

<details>
<summary><strong>Claude Code</strong> — <a href="https://github.com/anthropics/claude-code">anthropics/claude-code</a></summary>

## Claude Code Skills Highlights

> Source: [anthropics/skills](https://github.com/anthropics/skills)

# Claude Code Skills — Community Highlights Report
*Data snapshot: 2026-11-15 | Source: github.com/anthropics/skills*

---

## 1. Top Skills Ranking (by discussion & attention)

| # | Skill / PR | Functionality | Discussion Highlights | Status |
|---|-----------|--------------|----------------------|--------|
| 1 | **[fix(mcp-builder): support mcp>=2 streamable_http_client](https://github.com/anthropics/skills/pull/1742)** | Fixes MCP builder script for `mcp>=2.0.0` (renamed client, custom headers via `create_mcp_http_client`) | Most-commented PR; API-breaking change in MCP SDK affects connection scripts | OPEN |
| 2 | **[fix(skill-creator): isolate trigger evals & Windows fixes](https://github.com/anthropics/skills/pull/1298)** | Prevents false-miss trigger evaluations; fixes Windows subprocess/pipe issues | Directly addresses #1352/#556 trigger-rate bugs; cross-platform reliability | OPEN |
| 3 | **[Add notion-spec-to-implementation & quantitative-resume-auditor](https://github.com/anthropics/skills/pull/1245)** | Converts Notion specs → executable task plans; audits resumes quantitatively | Broad workflow-automation appeal; multi-skill submission | OPEN |
| 4 | **[webapp-testing: avoid shell=True in with_server.py](https://github.com/anthropics/skills/pull/1980)** | Removes command-injection risk (CWE-78) in test server launcher | Security-focused hardening of a testing skill | OPEN |
| 5 | **[fix(docx): report LibreOffice timeout as error](https://github.com/anthropics/skills/pull/1792)** | Correctly surfaces `soffice` timeouts and verifies output DOCX has no revision marks | Reliability/verification pattern for document skills | OPEN |
| 6 | **[Add pyxel skill for retro game dev](https://github.com/anthropics/skills/pull/525)** | Guides creation, debugging, headless input-driven runs of Pyxel games | Long-running (since Mar 2026), niche creative coding | OPEN |
| 7 | **[Add proofcore-contract-auditor (Web3)](https://github.com/anthropics/skills/pull/1771)** | Static analysis of Solidity/Rust contracts + Merkle proof anchoring on TON | First Web3/smart-contract skill proposal | OPEN |
| 8 | **[Add md2video-audio skill](https://github.com/anthropics/skills/pull/1703)** | Compiles Markdown → MP4 videos with AI voiceover (Marp + TTS) | "Zero-cost" content-generation pipeline | OPEN |

> *Note: PR comment counts show as `undefined` in the source data; ranking reflects recency, cross-referenced issue activity, and submission complexity.*

---

## 2. Community Demand Trends (from Issues)

- **Trust & security of the skill supply chain** — [#492](https://github.com/anthropics/skills/issues/492) (46 comments): community skills shipping under the `anthropic/` namespace creates an impersonation/trust-boundary risk.
- **Org-wide skill sharing** — [#228](https://github.com/anthropics/skills/issues/228) (17 👍): users want a shared library / direct share link instead of manual `.skill` file transfer.
- **Trigger-evaluation reliability** — [#556](https://github.com/anthropics/skills/issues/556) and [#1352](https://github.com/anthropics/skills/issues/1352): `run_eval.py` reports 0% trigger rates (parallel-worker UUID cross-matching), undermining skill quality measurement.
- **Context/token efficiency** — [#1487](https://github.com/anthropics/skills/issues/1487): `claude-api` skill eagerly injects ~156k tokens, exhausting context in a single call.
- **Skill authoring best practices** — [#202](https://github.com/anthropics/skills/issues/202): `skill-creator` reads like docs, not an operational skill; token-inefficient.
- **Duplicate skill packaging** — [#189](https://github.com/anthropics/skills/issues/189): `document-skills` and `example-skills` plugins install identical content.
- **New direction proposals**: governance/safety patterns for agent systems ([#412](https://github.com/anthropics/skills/issues/412)), symbolic compact-memory for agent state ([#1329](https://github.com/anthropics/skills/issues/1329)), and a three-gate reasoning quality pipeline ([#1385](https://github.com/anthropics/skills/issues/1385)).

**Emerging demand clusters:** supply-chain trust & signing, org-level sharing/governance, eval/trigger correctness, and context-budget discipline.

---

## 3. High-Potential Pending Skills (active, not yet merged)

| Skill | Why it may land soon | Link |
|-------|---------------------|------|
| **document-typography** | Solves universal orphan/widow/numbering issues affecting every generated doc | [PR #514](https://github.com/anthropics/skills/pull/514) |
| **md2video-audio** | End-to-end Markdown→MP4 with voiceover; zero-cost positioning | [PR #1703](https://github.com/anthropics/skills/pull/1703) |
| **scnet-hpc** | Profile-based SSH + Slurm workflows for HPC clusters — fills an infra gap | [PR #1615](https://github.com/anthropics/skills/pull/1615) |
| **proofcore-contract-auditor** | First Web3 contract-audit skill; notarization angle | [PR #1771](https://github.com/anthropics/skills/pull/1771) |
| **docx orphaned-comment detection** | Fills a documented gap in the docx skill suite | [PR #1734](https://github.com/anthropics/skills/pull/1734) |

Also advancing: a batch of targeted bug-fix PRs from recurring contributors — [#1975](https://github.com/anthropics/skills/pull/1975) (pptx `--cols`), [#1976](https://github.com/anthropics/skills/pull/1976) (textarea/select reporting), [#1977](https://github.com/anthropics/skills/pull/1977) (`wrapAround()` fix), [#1997](https://github.com/anthropics/skills/pull/1997) (YAML frontmatter parsing).

---

## 4. Skills Ecosystem Insight

> **The community's most concentrated demand is not for more skills, but for trustworthy, reliably-triggered, context-efficient skills — supply-chain integrity, correct eval/trigger behavior, and token discipline now dominate attention over net-new capabilities.**

---

# Claude Code Community Digest — 2026-11-15

## 1. Today's Highlights
No new releases landed in the last 24 hours, but issue activity remains heavy: **50 issues were updated**, dominated by long-running memory/resource-governance debates on macOS and a fresh cluster of MCP regressions in the 2.1.32x line. The most notable new signal is the escalating **"Shared Team Memory"** request (#38536, 34 comments) and a growing wave of **[MODEL] "ignored instructions"** reports from a single author (o1409) that suggest an emerging trust problem in instruction-following.

## 2. Releases
None in the last 24h. (Note: community-reported builds in the wild are 2.1.322–2.1.325; see regressions below.)

---

## 3. Hot Issues (10 noteworthy)

1. **#38536 — [enhancement] Shared Team Memory for Claude Code** (34 comments, 👍11)
   The single most-discussed open issue. Proposes team-level memory so handoffs/reviews/consultations transfer context instead of dying in individual sessions. High engagement reflects real demand for collaborative workflows.
   https://github.com/anthropics/claude-code/issues/38536

2. **#98769 — macOS fseventsd runaway on agent-heavy Macs** (19 comments)
   Detailed perf/memory bug: `fseventsd` blows 800× its budget, pins a core for days, with no self-recovery, and can block Claude Code at startup. Directly affects anyone running agent-heavy workloads on 24 GB Macs.
   https://github.com/anthropics/claude-code/issues/98769

3. **#91081 — Resource governance for agent-spawned process trees** (19 comments)
   Companion to the above: no memory ceiling, no pressure feedback, no teardown ordering for Bash/background/subagent trees. A structural critique of Claude Code's resource model.
   https://github.com/anthropics/claude-code/issues/91081

4. **#13689 — Improve the model's ability to follow instructions** (12 comments, 👍13)
   Long-lived feature/bug (since Dec 2025) with the highest upvote count in today's set. Foundational — underpins many downstream complaints.
   https://github.com/anthropics/claude-code/issues/13689

5. **#97369 — MCP tool description changes never reach a loaded session** (9 comments)
   Even after `/mcp reconnect` or `/resume`, changed descriptions/schemas are replayed from `deferred_tools_record`. A correctness issue for anyone iterating on MCP servers mid-session.
   https://github.com/anthropics/claude-code/issues/97369

6. **#109611 — claude.ai connectors missing from `/mcp` in 2.1.322+** (2 comments, regression)
   The entire claude.ai connector section (Slack, Sentry, Figma, Google Calendar, etc.) disappears; present on 2.1.321. Fast-moving regression worth tracking.
   https://github.com/anthropics/claude-code/issues/109611

7. **#109594 — MCP servers not connecting after restart (WSL)** (2 comments)
   Fresh report on 2.1.323; corroborates MCP instability. Note the terse, non-English report body — a sign of broad international usage.
   https://github.com/anthropics/claude-code/issues/109594

8. **#109843 — Agents view loses per-subagent model/context (2.1.323 → 2.1.325)** (CLOSED, regression)
   Closed same-day as a regression. Observable UX degradation for fleet/agents view; good example of tight update cadence causing regressions.
   https://github.com/anthropics/claude-code/issues/109843

9. **#99032 — VS Code extension ignores external `@imports` in `CLAUDE.md`** (6 comments, has repro)
   Terminal loads them; VS Code panel doesn't. Classic CLI-vs-extension parity gap on Windows.
   https://github.com/anthropics/claude-code/issues/99032

10. **#96860 — security-guidance never runs model reviews for subscription sign-ins** (5 comments)
    Third re-report (#77450, #87145 both closed as inactive). Community frustration with silent closure is itself a signal.
    https://github.com/anthropics/claude-code/issues/96860

*Honorable mentions:* #102665 (refusal fallback sends bare `claude-opus-4-8` to an `ANTHROPIC_BASE_URL` gateway → 404), #101782 (plugin hooks skipped for post-hook `$.agent.spawn`), #109718 (Windows auto-update drops Remote Control session).

---

## 4. Key PR Progress (4 open PRs)

Only 4 PRs were updated in the window; all are open and none have review comments yet.

1. **#78445 — docs: correct plugin descriptions and version that contradict the plugins**
   Fixes three places where marketplace metadata contradicts actual plugin behavior (`security-guidance` hook event + pattern count cited). Improves discoverability accuracy.
   https://github.com/anthropics/claude-code/pull/78445

2. **#106972 — Run dedupe agents in the foreground**
   Sets `CLAUDE_CODE_DISABLE_BACKGROUND_TASKS=1` on the dedupe step so background agents aren't cut off when the turn ends. A targeted fix for silent agent truncation.
   https://github.com/anthropics/claude-code/pull/106972

3. **#95698 — fix(plugins): run ralph-wiggum and output-style `.sh` hooks through bash with quoted paths**
   Fixes bare/unquoted `${CLAUDE_PLUGIN_ROOT}/hooks/*.sh` registrations (refs #95673, #78490). Practical reliability fix for bundled plugins.
   https://github.com/anthropics/claude-code/pull/95698

4. **#81672 — fix(hookify): make package import independent of install directory name**
   Removes reliance on the plugin directory being literally named `hookify`, which a marketplace install breaks (fixes #69665, #81448). Important for packaged distribution.
   https://github.com/anthropics/claude-code/pull/81672

> No new PRs were merged in the window — flagged for the team as a review backlog signal.

---

## 5. Hot Discussions
No discussion data was provided for this window; section omitted.

---

## 6. Feature Request Trends
Distilled from the open issues:

- **Team/collaborative memory** — moving beyond individual-only memory (#38536).
- **Resource governance for agents** — memory caps, system-pressure feedback, deterministic teardown for spawned process trees (#91081, #98769).
- **Better instruction-following / trust** — a cluster of `[MODEL]` reports (#13689, #108582, #110106, #110103, #110102, #110099) asking for reliable adherence to explicit `CLAUDE.md` rules.
- **Cross-surface parity** — same behavior across CLI, VS Code, Desktop, and remote/SSH sessions (#99032, #85873, #93158).
- **MCP lifecycle correctness** — hot-reloading tool schemas/descriptions and reconnect robustness (#97369, #109594, #109611).
- **Plugin authoring ergonomics** — predictable hook scoping and install-name independence (#101782, #81672, #95698).
- **UI/i18n polish** — clearer usage/credits screens, non-technical user flows (#93164).

---

## 7. Developer Pain Points
Recurring frustrations across issues and PRs:

- **Memory & performance blowups on agent-heavy machines** — macOS `fseventsd` (#98769) plus lack of any ceiling on agent process trees (#91081).
- **MCP instability in the 2.1.32x line** — disappearing claude.ai connectors (#109611) and servers failing to reconnect (#109594), plus stale tool metadata (#97369).
- **Regression churn from rapid auto-updates** — agents view losing details (#109843), Windows auto-update dropping Remote Control sessions (#109718).
- **Instruction-following erosion** — repeated `[MODEL]` reports that explicit "verify before asserting" rules are ignored (#108582, #110106 et al.), echoed by the longstanding #13689.
- **Triage fatigue** — genuine bugs closed as "stale" without response, only to be re-filed (e.g., #96860 → #77450/#87145; several #931xx closures).
- **Surface inconsistency** — CLI behaves differently from VS Code/Desktop (external `@imports`, SSH-scheduled tasks).
- **Report quality noise** — one issue (#110121) is actually a prompt-injection-esque paste, and another (#110122) is mislabeled `[invalid]`; minor, but indicative of triage gaps.

---
*Generated from `github.com/anthropics/claude-code` data for 2026-11-15. All links point to the canonical issue/PR URLs.*

</details>

<details>
<summary><strong>OpenAI Codex</strong> — <a href="https://github.com/openai/codex">openai/codex</a></summary>

# OpenAI Codex Community Digest — 2026-11-15

## 1. Today's Highlights
This cycle is dominated by a cluster of **rollout budget enforcement PRs** (copyberry[bot]) reshaping how Codex gates model requests, tool calls, and compaction under token/budget limits. Meanwhile, **image/Base64 context bloat** remains the top cross-platform pain point, with multiple long-running issues (Windows, Linux, macOS, CLI) converging on the same root cause: inline image payloads persisted into replayable history. Windows **Computer Use** issues also continue to generate heavy discussion, led by #51524 (90 comments).

## 2. Releases
- **rust-v0.171.0-alpha.5** — Alpha bump only; no substantive changelog provided. Track as a routine weekly alpha.
  https://github.com/openai/codex/releases

## 3. Hot Issues

1. **#51524 — [Windows] Computer Use stops at `get_window_state`** (90 comments, 👍9)
   Windows Computer Use regression: enum succeeds but turn aborts before click/type. Highest-engagement issue this cycle; signals a serious regression in CUA on Windows.
   https://github.com/openai/codex/issues/51524

2. **#57101 — Windows Computer Use: capture border persists after turn** (32 comments, 👍3)
   Gold/yellow capture border and capture access remain open after screenshotting completes — a UX and possible privacy concern.
   https://github.com/openai/codex/issues/57101

3. **#28316 — Codex resends large base64 image tool outputs in later context** (29 comments, 👍10)
   Cross-cutting bug: image payloads inflate `/v1/responses` requests. Foundational to several other image-bloat issues.
   https://github.com/openai/codex/issues/28316

4. **#61348 — Continuous engineering workspace, not disposable tasks** (28 comments)
   Broad enhancement request reimagining ChatGPT + Work + Codex as a persistent workspace with memory and subagents.
   https://github.com/openai/codex/issues/61348

5. **#60058 — Windows/Work: Full access silently downgraded to workspace-write with restricted network** (19 comments)
   Permissions UI shows Full access but execution context is restricted, blocking SSH — trust and reproducibility concern.
   https://github.com/openai/codex/issues/60058

6. **#41338 — Inline image = ~230 tokens but 4.2 MB on wire** (15 comments)
   Measurement-driven analysis showing token accounting misses real payload size, wedging threads.
   https://github.com/openai/codex/issues/41338

7. **#18629 — Desktop threads poisoned by inline base64 tool images → `Bad Request` on resume** (15 comments, 👍4)
   Original report under the image-poisoning family; still open after months.
   https://github.com/openai/codex/issues/18629

8. **#51478 — HTTP 429 with Retry-After prevents loading existing conversations** (13 comments)
   Rate-limit handling blocks history load on Web and Windows Desktop.
   https://github.com/openai/codex/issues/51478

9. **#20805 — Image-heavy chats reconnect and slow down** (11 comments, 👍9)
   App-level symptom of the same underlying image-history bloat.
   https://github.com/openai/codex/issues/20805

10. **#38762 — `migrate-rollouts` leaves subagent threads with empty projected history** (10 comments)
    Offline local-store migration data-loss risk for subagent sessions.
    https://github.com/openai/codex/issues/38762

## 4. Key PR Progress

1. **#61587 — Add request IDs and attempt numbers to model request hooks**
   Correlates attempts across retries and model fallback.
   https://github.com/openai/codex/pull/61587

2. **#61583 — Refactor rollout budget checks and turn completion state**
   Centralizes admission checks before contributors run (HTTP + non-warmup WS).
   https://github.com/openai/codex/pull/61583

3. **#61582 — Gate new rollout work on shared budget exhaustion**
   Prevents starting new requests/tools/turns when any thread has exhausted budget.
   https://github.com/openai/codex/pull/61582

4. **#61581 — Record neutral interruption markers for rollout budget stops**
   Emits `<turn_aborted>` marker without attributing interruption to the user.
   https://github.com/openai/codex/pull/61581

5. **#61580 — Account for synchronous MCP post-hook costs in rollout budgets**
   Allows `PostModelRequest` hooks to charge `extra_codex_rollout_budget_units`.
   https://github.com/openai/codex/pull/61580

6. **#61579 — Support fractional rollout budgets and configurable context reminders**
   Introduces `features.rollout_budget.limit_budget` as a compatibility successor to `limit_tokens`.
   https://github.com/openai/codex/pull/61579

7. **#61562 — Unify model request hook lifecycles across sampling and compaction**
   Pairs Pre/Post hooks per attempt with distinct lifecycle IDs.
   https://github.com/openai/codex/pull/61562

8. **#61535 — Add trusted request-country metadata to Responses requests**
   Normalizes host-supplied country codes; explicit `XX` maps to `null`.
   https://github.com/openai/codex/pull/61535

9. **#61488 — Harden Git remote collection and limit remote URL metadata**
   Fixes partial-clone parsing; caps remote URLs under the 8,096-char Responses limit.
   https://github.com/openai/codex/pull/61488

10. **#61486 — Keep archived threads read-only and support unarchiving in the TUI**
    Freezes input on archived threads; `U` unarchives/resumes.
    https://github.com/openai/codex/pull/61486

## 5. Hot Discussions

**Show and tell**
- **#52372 — Selvedge: cross-session retrieval of rejected approaches via MCP** — Local stdio MCP server persisting rationale (including rejected ideas) in SQLite, keyed to entities like functions/databases.
  https://github.com/openai/codex/discussions/52372
- **#38868 — Codexless: reuse local Codex capabilities from ChatGPT** — Lets ChatGPT call narrow Codex-backed tools and only spin up a real agent when needed.
  https://github.com/openai/codex/discussions/38868
- **#49001 — Context Attachment Manager: on-demand image history** — Directly targets the recurring image-resend problem that has hit 44 MB threads.
  https://github.com/openai/codex/discussions/49001
- **#61585 — Chatstone Codex archive adapter** — Draws a boundary between hook wakeups and transcript completion for archival.
  https://github.com/openai/codex/discussions/61585
- **#61525 — AppScreen: App Store / Play Store screenshot editor over MCP** — One-command remote MCP integration.
  https://github.com/openai/codex/discussions/61525
- **#61472 — Codex Pulse: quota pacing and usage analysis on Windows (MIT)** — Surfaces remaining quota, reset time, pacing.
  https://github.com/openai/codex/discussions/61472
- **#61475 — Ragmir: cited project context from code, PDFs, Office files** — AGPL-3.0 retrieval layer indexing project artifacts for Codex.
  https://github.com/openai/codex/discussions/61475

## 6. Feature Request Trends
- **Persistent engineering context / memory** — Requests for cross-session continuity, subagent memory, and non-disposable workspaces (#61348, #52372, #38868).
- **Image / attachment context management** — On-demand image history and prevention of inline Base64 persistence (#49001, #28316, #18629, #41338).
- **Budget & quota transparency** — Fractional budgets, pacing UIs, and neutral interruption semantics (#61579, #61472).
- **MCP ecosystem expansion** — More first-class MCP surfaces (screenshots, project retrieval, archives) exposed to Codex (#61525, #61475, #52372).
- **Environment-scoped permissions** — Per-environment context and permission descriptions behind flags (#61494).

## 7. Developer Pain Points
- **Image history bloat** is the single most reproduced complaint across platforms (#28316, #41338, #18629, #20805, #46761, #34542). Users report multi-MB per request, 429s, reconnects, and thread corruption.
- **Windows Computer Use instability** — Enumeration failures, lingering capture borders, app-server launch failures, and access-denied cursor calls (#51524, #57101, #60221, #61459, #60317).
- **Permissions vs. execution mismatch** — UI shows Full access but sandbox enforces restricted network (#60058); "Ask for approval" disabled while "Approve for me" is available (#55256).
- **Rate limiting poisoning history load** — 429 + Retry-After blocks existing conversations (#51478).
- **Desktop ↔ mobile/web sync drift** — Missing or reordered conversation history across clients (#56916, #61565).
- **Log noise & storage sprawl** — `logs_2.sqlite` accumulating tens of MB/day from MCP TRACE rows (#34291).
- **Migration data loss** — `migrate-rollouts` producing empty projected history for subagent threads (#38762).
- **CLI/TUI polish gaps** — Resume panics on history pagination (#61491), input-area jumps when hints vanish (#61554), and ignored top-level `error` events triggering redundant retries (#61547).

</details>

<details>
<summary><strong>Gemini CLI</strong> — <a href="https://github.com/google-gemini/gemini-cli">google-gemini/gemini-cli</a></summary>

# Gemini CLI Community Digest — 2026-11-15

## 1. Today's Highlights

No new releases landed in the last 24 hours, but issue activity remains intense around the **subagent/agent system**, with a cluster of P1 bugs reported as "need retesting" — notably subagent recovery masking `MAX_TURNS` interruptions as `GOAL` success (#22323) and the generalist agent hanging indefinitely (#21409, 8 👍). On the PR side, the biggest momentum is in **ACP (Agent Client Protocol) parity work** — output truncation and parallel tool execution — plus a P0 build fix addressing nightly release failures since 2026-11-05.

## 2. Releases

None in the last 24 hours. (An auto-generated changelog PR for v0.45.2, #27703, is still open and awaiting review.)

## 3. Hot Issues

1. **[#22323](https://github.com/google-gemini/gemini-cli/issues/22323) — Subagent recovery after MAX_TURNS reported as GOAL success (P1, 13 comments)** — `codebase_investigator` returns `status: "success"` / `Termination Reason: "GOAL"` despite hitting its turn limit before doing any work. This is dangerous for any workflow that trusts agent status for gating; highest comment count of the day.

2. **[#19873](https://github.com/google-gemini/gemini-cli/issues/19873) — Zero-dependency OS sandboxing + post-execution intent routing (P2, 9 comments)** — Proposal to lean into Gemini 3's native bash affinity by sandboxing POSIX tool chains safely. Signals a philosophical fork: sandbox the model vs. restrict its tools.

3. **[#21409](https://github.com/google-gemini/gemini-cli/issues/21409) — Generalist agent hangs forever (P1, 8 👍)** — Simple operations like folder creation hang indefinitely when the CLI defers to the generalist agent. Highest 👍 count today; a direct blocker to subagent adoption.

4. **[#22745](https://github.com/google-gemini/gemini-cli/issues/22745) — AST-aware file reads, search, and codebase mapping (P2, 7 comments)** — EPIC investigating whether AST-aware tooling reduces misaligned reads and token noise. Parent of several follow-ups (#22746, #22747); a likely direction for the next generation of retrieval tools.

5. **[#21968](https://github.com/google-gemini/gemini-cli/issues/21968) — Gemini doesn't use skills and sub-agents enough (P2, 7 comments)** — Anecdotal but widely relatable: the model only invokes custom skills when explicitly told, undermining the entire subagent investment.

6. **[#22267](https://github.com/google-gemini/gemini-cli/issues/22267) — Browser Agent ignores `settings.json` overrides (P2)** — `maxTurns` and similar configs are read by `AgentRegistry` at init but never applied at runtime — a configuration correctness bug with real blast radius.

7. **[#21983](https://github.com/google-gemini/gemini-cli/issues/21983) — Browser subagent fails on Wayland (P1)** — Linux desktop users hit immediate `GOAL` termination; a platform coverage gap that will grow if browser_agent adoption increases.

8. **[#24246](https://github.com/google-gemini/gemini-cli/issues/24246) — 400 error with >128 tools (P2)** — Tool-count explosion is now a hard failure mode; directly relevant as MCP servers multiply per project.

9. **[#22672](https://github.com/google-gemini/gemini-cli/issues/22672) — Agent should stop/discourage destructive behavior (P2)** — Model reaches for `git reset` / `--force` when safer paths exist. A trust-and-safety concern more than a functional bug.

10. **[#18836](https://github.com/google-gemini/gemini-cli/issues/18836) — Replace WriteToDo with persistent file-based task tracking (P3)** — Proposes deprecating in-context todo tracking to fight "context rot" and session memory loss. A long-running design thread with architectural implications.

## 4. Key PR Progress

1. **[#30207](https://github.com/google-gemini/gemini-cli/pull/30207) — fix(build): clear `bundle/` before esbuild (P0)** — Nightly publishes have failed since 2026-11-05 with 413 errors; stale chunks inflated the tarball to 25.2 MB. Highest-urgency fix in flight.

2. **[#30298](https://github.com/google-gemini/gemini-cli/pull/30298) — feat(acp): execute independent tool calls in parallel** — Brings ACP mode to parity with the standard CLI scheduler, which already batches contiguous read-only calls. Meaningful latency win for ACP clients.

3. **[#30297](https://github.com/google-gemini/gemini-cli/pull/30297) — fix(acp): truncate large shell and MCP tool outputs** — Closes a path where unbounded tool output (logs, directory trees, verbose MCP responses) flowed straight into the model context in ACP mode. Context-bloat mitigation.

4. **[#30295](https://github.com/google-gemini/gemini-cli/pull/30295) — fix(core): preserve ASK_USER decision on shell parse failure in YOLO mode** — Previously fell back to `ALLOW` when parsing failed. A security-relevant correctness fix.

5. **[#30296](https://github.com/google-gemini/gemini-cli/pull/30296) — fix(core): evict rejected OAuth init promises from cache** — Stops a single failed OAuth init from poisoning the cache for the process lifetime. Classic reliability fix with outsized impact on long sessions.

6. **[#30174](https://github.com/google-gemini/gemini-cli/pull/30174) — fix(core): stop body timeouts from killing and replaying long model turns** — Undici's 5-minute body timeout was aborting and replaying heavy `write_file` turns. Directly addresses wasted tokens and duplicate work.

7. **[#30178](https://github.com/google-gemini/gemini-cli/pull/30178) — fix(cli): submit full text on IME commit + Enter in same tick** — Fixes dropped Hangul syllables on Korean input; a small but high-quality i18n polish.

8. **[#30157](https://github.com/google-gemini/gemini-cli/pull/30157) — fix(core): only replace true cycles with `[Circular]` in safeJsonStringify** — Shared `endTime`/`boundaries` arrays in OTel exports were being falsely marked circular, corrupting telemetry exports.

9. **[#30179](https://github.com/google-gemini/gemini-cli/pull/30179) — (P1, size/xl)** — Large PR against main with no meaningful description; flagged here mainly as an anomaly worth maintainer attention.

10. **[#30301](https://github.com/google-gemini/gemini-cli/pull/30301) — docs(cli): sync ACP flag rows with actual flags** — Removes stale `--experimental-zed-integration` references left over from the ACP rename. Small but reduces user confusion.

## 5. Hot Discussions

No Discussions data was provided for this digest period; this section is omitted.

## 6. Feature Request Trends

- **AST-aware tooling as a first-class retrieval layer** — #22745, #22746, #22747 form a coordinated investigation into AST reads, search, and codebase mapping. Expect this to shape the next iteration of `codebase_investigator`.
- **Persistent, file-based task state** — #18836 (replace WriteToDo) and #21000 (native file tools for the task tracker) converge on the same thesis: in-context todo lists don't survive long sessions.
- **Subagent observability and sharing** — #22598 (subagent trajectory via `/chat share`) and #21763 (bug reports should include subagent context) both target the same gap: subagent behavior is nearly opaque today.
- **Agent self-awareness** — #21432 asks that the CLI accurately describe its own flags, hotkeys, and execution semantics; a recurring theme in feedback.
- **Sandboxing over restriction** — #19873 argues for OS-level sandboxing so the model can use its native bash strengths safely, rather than degrading its toolset.

## 7. Developer Pain Points

- **Subagent reliability is the dominant theme.** Hang bugs (#21409), silent mis-termination (#22323), under-triggering (#21968), broken config overrides (#22267), and Wayland failures (#21983) collectively suggest the agent subsystem is not yet trustworthy for unattended use.
- **Context bloat and token economics.** Large reads "firehose" the context (#19561), tool counts cross the 128-tool threshold and break requests (#24246), and ACP mode lacked output truncation entirely (#30297). Multiple independent reports point to the same pressure.
- **Destructive-command safety.** #22672 documents the model preferring `git reset`/`--force` when safer alternatives exist — a high-anxiety class of bug for anyone running with reduced approval friction.
- **Workspace hygiene.** #23571: the model scatters temporary edit scripts across directories, making clean commits painful.
- **Release engineering friction.** The P0 bundle-staleness issue (#30207) has broken nightly publishes for ten consecutive days — a reminder that CI hygiene is a community-facing reliability surface.

---
*Generated from github.com/google-gemini/gemini-cli activity on 2026-11-15. Issue and PR numbers are linked inline.*

</details>

<details>
<summary><strong>GitHub Copilot CLI</strong> — <a href="https://github.com/github/copilot-cli">github/copilot-cli</a></summary>

# GitHub Copilot CLI Community Digest — 2026-11-15

## 1. Today's Highlights

No new releases shipped in the last 24 hours, but the issue tracker remains highly active with 22 items updated, including **8 closures** covering long-standing clipboard, session-resume, and configuration bugs. The most serious open items are a **repeated OOM crash during long interactive sessions (#5435)** and a **~20K-token context overhead regression introduced around 1.0.106 (#5450)** — both directly impacting productivity on large sessions. A cluster of fresh triage issues also points to friction in MCP OAuth flows, subagent model defaults, and agent polling behavior.

---

## 2. Releases

*No new releases in the last 24 hours.*

---

## 3. Hot Issues

1. **[#5435](https://github.com/github/copilot-cli/issues/5435) — Repeated OOM crash during long interactive session (1.0.109)** [OPEN]
   Recurrent out-of-memory crashes kill long sessions, and after resume the prior background agent is lost. High severity for anyone running extended agent workflows; only 1 comment so far, suggesting maintainers may still be triaging.

2. **[#5450](https://github.com/github/copilot-cli/issues/5450) — ~20K extra context tokens after 1.0.106** [OPEN]
   Fixed per-session overhead jumped from ~112K usable to ~93K, causing noticeably faster auto-compaction. A regression with broad impact on desktop app 1.4.0 users; noteworthy for its clear before/after quantification.

3. **[#5456](https://github.com/github/copilot-cli/issues/5456) — Default subagent models unavailable on free plan** [OPEN, triage]
   Shipped defaults (`gpt-6-luna`, `claude-sonnet-5.5`) error out for free-tier users. A straightforward configuration/entitlement mismatch with outsized impact on new users.

4. **[#5459](https://github.com/github/copilot-cli/issues/5459) — Agent wastes model turns polling `sleep N; check`** [OPEN, triage]
   Each poll is a full model turn re-reading the conversation context — a real cost and latency sink during background jobs. Speaks to a missing "wait for job completion" primitive.

5. **[#5457](https://github.com/github/copilot-cli/issues/5457) — Fusion tier "high" silently resolves to "standard"** [OPEN, triage]
   No error or warning; `session.fusion_resolved` records `policy: "standard"`. Silent fallback of a tiered capability erodes trust in model routing.

6. **[#5437](https://github.com/github/copilot-cli/issues/5437) — Delegated `task` children cannot auth HTTP-OAuth MCP servers** [OPEN]
   Wildcard `<server>/*` refs 401 in child agents; explicit refs work only on specific models and servers. Broader MCP + subagent authentication gap spanning ~30 observed runs.

7. **[#5452](https://github.com/github/copilot-cli/issues/5452) — MCP OAuth forces native broker window, blocks paste** [OPEN]
   `/mcp auth azure-devops` opens the OneAuth broker with paste fully blocked and no browser fallback. A hard blocker for Entra-authenticated MCP setups since 1.0.109.

8. **[#5434](https://github.com/github/copilot-cli/issues/5434) — macOS keychain prompt returns after "Always Allow"** [OPEN]
   Duplicate `copilot-mcp-oauth` keychain entries keep re-prompting. Persistent auth annoyance affecting every macOS MCP OAuth user.

9. **[#5145](https://github.com/github/copilot-cli/issues/5145) — 400 `reasoning_text` in thinking mode** [OPEN]
   Custom OpenAI-compatible providers with `wireApi: "responses"` (DeepSeek) fail after runtime-synthesized assistant turns. First issue in the list to be updated after a long tail — indicates an ongoing protocol-compatibility problem.

10. **[#5436](https://github.com/github/copilot-cli/issues/5436) — CLI masks structured 403 as auth failure** [OPEN]
    Custom provider returns structured `error.message`/`error.code`, but CLI collapses it into a generic auth failure. Misleading diagnostics for valid non-auth 403s.

---

## 4. Key PR Progress

*No pull requests were updated in the last 24 hours.*

---

## 5. Hot Discussions

*No discussion data was provided for this period.*

---

## 6. Feature Request Trends

- **MCP lifecycle observability**: Explicit request for a hook/notification when MCP startup settles — all servers `connected` or `failed` ([#5458](https://github.com/github/copilot-cli/issues/5458)). Related to broader complaints about slow, opaque MCP startup.
- **Background-job awareness**: The agent-level request for a proper wait/notify primitive instead of `sleep N; check` polling ([#5459](https://github.com/github/copilot-cli/issues/5459)) is effectively a feature ask for job-completion events.
- **Browser-based OAuth fallback**: Edge-case auth flows (Entra broker, keychain) imply demand for a headless/browser fallback path in MCP OAuth ([#5452](https://github.com/github/copilot-cli/issues/5452), [#5434](https://github.com/github/copilot-cli/issues/5434)).
- **Predictable subagent defaults**: Requests to avoid shipping defaults that error on the free plan ([#5456](https://github.com/github/copilot-cli/issues/5456)).
- **Transparent tier resolution**: Users want Fusion tiers to fail loudly rather than silently downgrade ([#5457](https://github.com/github/copilot-cli/issues/5457)).

---

## 7. Developer Pain Points

- **Memory stability at long horizons**: Recurrent OOM crashes ([#5435](https://github.com/github/copilot-cli/issues/5435)) plus a growing persisted MCP tool cache ([#5446](https://github.com/github/copilot-cli/issues/5446)) point to memory growth as an ongoing theme in long-running sessions.
- **Context budget erosion**: The ~20K overhead regression ([#5450](https://github.com/github/copilot-cli/issues/5450)) reduces usable context and accelerates compaction — a direct cost to complex tasks.
- **MCP authentication friction**: Across [#5452](https://github.com/github/copilot-cli/issues/5452), [#5434](https://github.com/github/copilot-cli/issues/5434), and [#5437](https://github.com/github/copilot-cli/issues/5437), MCP OAuth remains the highest-frequency frustration cluster, spanning broker UI, keychain, and delegated subagents.
- **Opaque error surfaces**: [#5436](https://github.com/github/copilot-cli/issues/5436) and [#5457](https://github.com/github/copilot-cli/issues/5457) both describe the CLI masking or silently reinterpreting upstream signals — a diagnosability problem.
- **Session/agent state fidelity**: Resume-time agent selection ([#4489](https://github.com/github/copilot-cli/issues/4489), closed) and lost background agents post-crash ([#5435](https://github.com/github/copilot-cli/issues/5435)) show agents are still not durably associated with sessions.
- **Platform rendering and clipboard quirks**: Multiple closed issues today ([#4615](https://github.com/github/copilot-cli/issues/4615), [#4391](https://github.com/github/copilot-cli/issues/4391), [#3985](https://github.com/github/copilot-cli/issues/3985)) confirm platform-terminal edge cases (Wayland, Windows codepages) remain a recurring churn area.

*Note: Sections 4 and 5 are omitted per the data provided (no PRs or Discussions in the window).*

</details>

<details>
<summary><strong>OpenCode</strong> — <a href="https://github.com/anomalyco/opencode">anomalyco/opencode</a></summary>

# OpenCode Community Digest — 2026-11-15

## 1. Today's Highlights

The 2.3.0 release continues to generate fallout, with two independent reports of `opencode-pty daemon` leaking zombie child processes on Linux—now the most active regression thread in the tracker. Meanwhile, the AI triage bot `opencodejr` is itself becoming a governance issue after closing a live bug as a duplicate of an already-`NOT_PLANNED` ticket, leaving the zombie problem untracked. On the contribution side, a native CLI port preview and an experimental client key-value store signal continued V2 architectural churn.

## 2. Releases

No new releases in the last 24 hours.

## 3. Hot Issues

1. **#26602 [CLOSED] Desktop 5-minute Headers Timeout with slow local providers** (26 comments, 👍2) — Desktop aborts OpenAI-compatible local providers after exactly 5 minutes regardless of `"timeout": false`. Highest-engagement thread of the day; closure status suggests a fix or workaround landed. [Link](https://github.com/anomalyco/opencode/issues/26602)

2. **#33704 [OPEN] GUI options to edit custom providers and manage model lists** (12 comments, 👍4) — Managing LM Studio/Jan AI-style providers still requires manual config editing. Strong upvote-to-comment ratio signals genuine demand. [Link](https://github.com/anomalyco/opencode/issues/33704)

3. **#63817 [OPEN→closed-as-duplicate] pty: shell commands leave zombies under opencode-pty daemon (2.3.0)** (8 comments) — A clear 2.2.7→2.3.0 regression: completed shell commands are never reaped. Originally closed `NOT_PLANNED`. [Link](https://github.com/anomalyco/opencode/issues/63817)

4. **#63976 [OPEN] opencode-pty daemon leaks zombie child processes (unbounded growth)** (2 comments) — The re-filed tracker for the same regression, now marked `reproduced`. Zombies grow monotonically for the daemon's lifetime; likely the most consequential open bug right now. [Link](https://github.com/anomalyco/opencode/issues/63976)

5. **#63975 [OPEN] opencodejr AI moderator closed issue without checking if duplicate was open** (2 comments) — Meta-issue: the triage bot closed #63948 as a duplicate of the already-closed #63817, leaving no open tracker. Raises real questions about automated triage correctness. [Link](https://github.com/anomalyco/opencode/issues/63975)

6. **#37844 [OPEN] core: cached locations multiply MCP subprocesses** (6 comments, 👍1) — One V2 managed service retained ~10 repeated MCP process groups (~5 children each). Direct resource-bloat concern for anyone running multiple MCP servers. [Link](https://github.com/anomalyco/opencode/issues/37844)

7. **#59794 [OPEN] All history images re-sent on every request** (5 comments) — No pruning means sessions become permanently unusable on image-capped backends (e.g. vLLM `--limit-mm-per-prompt`). A hard blocker for multimodal workflows. [Link](https://github.com/anomalyco/opencode/issues/59794)

8. **#59293 [OPEN] subagent sessionID continuation always fails with 'Subagent session not found: ses'** (5 comments) — The `sessionID` parameter is dropped and replaced with literal `"ses"`, making subagent continuation impossible. Breaks multi-turn agent orchestration. [Link](https://github.com/anomalyco/opencode/issues/59293)

9. **#63935 [CLOSED] Prompt cache lost ~1 in 3 requests when only reasoning_effort changes** (5 comments) — Impacts `opencode-go` / deepseek-v4.1-flash. Matters for agent clients that adapt reasoning effort per-turn and pay cache-miss costs. [Link](https://github.com/anomalyco/opencode/issues/63935)

10. **#63076 [OPEN, reproduced] GET /api/project returns 500 when commands = NULL** (3 comments) — A single malformed project row makes project listing/switching fail entirely. Total-failure blast radius from narrow data corruption. [Link](https://github.com/anomalyco/opencode/issues/63076)

## 4. Key PR Progress

1. **#64000 [CLOSED] fix(core): keep grep results when a match is not valid UTF-8** — Handles `rg --json` emitting base64 `bytes` instead of `text` for non-UTF-8 matches, closing a silent data-loss path. [Link](https://github.com/anomalyco/opencode/pulls/64000)

2. **#63998 [OPEN, contributor] feat(server): experimental client key-value store** — Clients share JSON values per space/key over existing auth and the event stream. Foundation for cross-client state sync. [Link](https://github.com/anomalyco/opencode/pulls/63998)

3. **#63477 [OPEN] cli: port to native** — Preview of a native CLI implementation (`opencode-native-preview`). Potentially significant for startup time and distribution. [Link](https://github.com/anomalyco/opencode/pulls/63477)

4. **#63989 [OPEN] Opentui 0.9.0** — Bumps OpenTUI, breaking plugin markdown renderers (`MarkdownCodeBlock` replaces marked's `Tokens.Code`). Plugin authors should track this. [Link](https://github.com/anomalyco/opencode/pulls/63989)

5. **#63988 [OPEN, contributor] fix(desktop): connect to SSH/WSL servers regardless of OpenCode version** — Loosens server version checks for SSH/WSL connections, ported from rune-desktop. Reduces connection friction across mixed-version fleets. [Link](https://github.com/anomalyco/opencode/pulls/63988)

6. **#63986 [OPEN] feat(tui): show tool elapsed time in V2 clients** — Surfaces per-tool timing in the TUI; V2 replacement for the closed V1 PR #50892. [Link](https://github.com/anomalyco/opencode/pulls/63986)

7. **#63542 [OPEN] fix(ssh): recover when the remote service port is taken** — Reconnect failures previously masked the real cause (port conflict). Improves SSH resilience. [Link](https://github.com/anomalyco/opencode/pulls/63542)

8. **#63601 [CLOSED, contributor] fix(app): show pending requests on idle sessions in inbox** — Desktop inbox parity with the TUI fix (#63594). [Link](https://github.com/anomalyco/opencode/pulls/63601)

9. **#63648 [OPEN] docs(ecosystem): add Sikemux** — Native Mac/Linux multiplexer added to the ecosystem projects table. [Link](https://github.com/anomalyco/opencode/pulls/63648)

10. **#55877 [OPEN] docs: add Crusoe to the providers list** — Provider docs addition; registration already merged upstream in models.dev. [Link](https://github.com/anomalyco/opencode/pulls/55877)

*Note: a large batch of `automated-pr-cleanup`-tagged PRs (e.g. #55528 binary WebSocket proxy streaming, ~18× faster image transfer over 140ms RTT; #55496 subagents side-panel) were mass-closed on 2026-11-14.*

## 5. Hot Discussions

No discussion data was provided for this period.

## 6. Feature Request Trends

- **Provider & model management UX** — GUI-based provider editing and model list management (#33704) remains the top-voted request; the current config-file workflow is the friction point.
- **TUI parity and polish** — i18n for the TUI (#37216, app/desktop already ship 17+ locales), a narrow 1-cell-padding layout (#63965), Ctrl+Arrow keybindings (#63947), and agent/model row truncation (#59778) all point to TUI maturation demand.
- **Resource lifecycle control** — Lazy MCP spawning on first tool use (#53028) and fixing MCP subprocess multiplication (#37844) reflect demand for leaner process footprints.
- **Privacy & ephemerality** — An ephemeral no-persist session mode (#53921, 👍4) is tracking well.
- **Multi-client control surfaces** — Prompting/steering selected subagents from the TUI (#42670, 👍7), a V2 sidebar for project history (#60241), and iOS push notifications for desktop/CLI-initiated sessions (#63992).
- **Web UI ergonomics** — Un-hiding undo/copy/fork buttons from spoilers (#63968).

## 7. Developer Pain Points

1. **2.3.0 pty daemon zombie regression** — Two independent reports (#63817, #63976) confirm a regression from 2.2.7; the original was closed `NOT_PLANNED` and the re-file was almost lost to a faulty bot duplicate-check. Trust in triage is eroding alongside the bug.

2. **AI triage bot reliability** — `opencodejr` closing issues without verifying the duplicate target is itself open (#63975) directly caused the zombie bug to fall through the cracks.

3. **Zombie/orphan process hygiene generally** — Beyond pty, MCP subprocess multiplication (#37844) shows the same class of lifecycle leak in a different subsystem.

4. **Session state robustness** — Repeated image re-sends permanently bricking sessions (#59794), broken subagent continuation (#59293), and total project listing failure from a NULL column (#63076) all point to brittle session/project persistence.

5. **Provider-layer edge cases** — Timeout settings ignored (#26602), prompt cache misses on `reasoning_effort` changes (#63935), and Gemini failing on directory wake with "does not support Responses API" (#63956) suggest provider adapters need hardening.

6. **Config-file-only surfaces** — The persistent popularity of #33704 shows manual provider/model config editing is the single most-cited daily friction.

</details>

<details>
<summary><strong>Pi</strong> — <a href="https://github.com/earendil-works/pi">earendil-works/pi</a></summary>

# 🧠 Pi Community Digest | 2026-11-15

## 🚀 Today's Highlights
The focus remains heavily on refining core agent behaviors and tooling stability. Significant work is underway to improve developer workflows by allowing better handling of tool output limits, enhancing configuration for external LLMs like GitHub Copilot, and addressing complex edge cases in system tooling and environment variable resolution.

## 📦 Releases
**No new releases** were published in the last 24 hours.

## 🔥 Hot Issues (Top 10 Noteworthy Issues)
1. **Transport Resolution Bug in MCP:** A critical bug exists where service transport URLs defined with environment variables (e.g., `${MY_VAR}`) in `mcp.json` are not resolving correctly, requiring workarounds like hardcoding schemas. [Issue #10654](https://github.com/earendil-works/pi/issues/10654)
2. **Codemode Crash on File Read:** On Windows (Pi 1.5.2), an uncaught `AbortError` occurs when a codemode attempts to read a sibling file after an `ENOENT` error. [Issue #12167](https://github.com/earendil-works/pi/issues/12167)
3. **Copilot Model Persistence:** Newly enabled GitHub Copilot Enterprise models fail to appear in Pi's model picker after a restart because the cached `availableModelIds` is not refreshed. [Issue #11006](https://github.com/earendil-works/pi/issues/11006)
4. **Large Session Context Limit:** Extremely long sessions (120k+ entries) are crashing context rebuild processes with a `RangeError: Maximum call stack size exceeded`. [Issue #12154](https://github.com/earendil-works/pi/issues/12154)
5. **Incomplete Tool Output Visibility:** Codemode batching prevents direct visibility into tool usage; agent skill reads are hidden within the codemode call log in the tool UI. [Issue #12176](https://github.com/earendil-works/pi/issues/12176)
6. **Concurrent Tool/Bash Execution Race:** A critical race condition exists where a tool read command executes *before* a concurrent `bash` command finishes writing its output, leading to stale or incomplete context. [Issue #11950](https://github.com/earendil-works/pi/issues/11950)
7. **API Key Persistence After Login Failure:** When using secrets managers like `!command`, if the command fails, `/login` might still show a "configured" key, leading to subsequent authentication failures despite visual indicators. [Issue #12164](https://github.com/earendil-works/pi/issues/12164)
8. **SDK Documentation Errors:** Several links within the `docs.pi.dev` site point to non-existent 404 routes instead of the correct, more specific URLs. [Issue #12173](https://github.com/earendil-works/pi/issues/12173)
9. **Gemini Model Feature Gaps:** The advertised "xhigh" thinking level for Gemini 4 Hydrogen is not correctly mapped or supported by the existing Google adapters. [Issue #12177](https://github.com/earendil-works/pi/issues/12177)
10. **Instruction Format Support:** The `developer` role in instruction messages is currently unclassified by both OpenAI adapters when `model.reasoning` is active. [Issue #12101](https://github.com/earendil-works/pi/issues/12101)

## 🛠️ Key PR Progress (Top 10 Noteworthy PRs)
1. **Enhancing Tool Output Controls:** Added settings for `toolOutput.maxBytes` and `toolOutput.maxLines` to agent configurations to manage model context usage during tool execution. [PR #12163](https://github.com/earendil-works/pi/pull/12163)
2. **Improving Selector Context:** Implemented the feature allowing the `description` option to be passed to `ctx.ui.select`, providing necessary context for multi-choice UI elements. [PR #12178](https://github.com/earendil-works/pi/pull/12178)
3. **Refining Agent Tool Discovery:** Add `toolOutput.maxBytes` and `toolOutput.maxLines` to agent settings to cap context usage from tool executions. [PR #12163](https://github.com/earendil-works/pi/pull/12163)
4. **Docker Workspace Templates:** Introduced a new Docker template specifically for the Coder workspace, providing a git-clone of the repository for easy setup. [PR #12162](https://github.com/earendil-works/pi/pull/12162)
5. **Copilot Reasoning Visibility:** Updates were made to correctly transmit `reasoning_effort` and token usage metrics for GitHub Copilot models across various LLMs. [PR #12110](https://github.com/earendil-works/pi/pull/12110)

## 💬 Hot Discussions
**Ideas:**
* **Mistral Support Request:** A request was made to integrate direct Mistral Provider support, bypassing the need for API key management. [Discussion #12168](https://github.com/earendil-works/pi/discussions/12168)

**Show and Tell:**
* **Claude Security Extension:** Introduction of `claude-bulkhead`, an extension that uses PreToolUse hooks to proactively block dangerous commands (like `rm -rf`) when used with Claude Code. [Discussion #12161](https://github.com/earendil-works/pi/discussions/12161)

## 📈 Feature Request Trends
The community is heavily focused on **improving LLM interoperability** (e.g., better integration/support for Mistral and advanced Gemini features) and **enhancing agent reliability** through smarter context management (e.g., controlling tool output size, resolving environment variable interpolation in tool definitions).

## 🛑 Developer Pain Points
1. **Environment/Config Inconsistencies:** Developers are struggling with environment variable interpolation failing in complex configurations (`mcp.json`) and authentication state not correctly reflecting service failures.
2. **LLM/Copilot Integration Nuances:** Ensuring the right telemetry (reasoning effort, token usage) and feature flags (like model level) are correctly mapped across different providers remains a source of friction.
3. **System Tooling Robustness:** Issues persist around WSL/Windows cross-compatibility during installation and the inherent race conditions when agents execute simultaneous shell commands and file reads.

</details>

<details>
<summary><strong>Qwen Code</strong> — <a href="https://github.com/QwenLM/qwen-code">QwenLM/qwen-code</a></summary>

# Qwen Code Community Digest — 2026-11-15

## 1. Today's Highlights

The Qwen Code project continues its push toward the 1.0 Preview agent-loop kernel, with the tracking issue #17045 driving coordinated landing of an event-driven loop across all surfaces before a 2026-11-21 freeze. Meanwhile, the managed-agent subsystem is drawing heavy attention — a cluster of new bugs around external-workspace child-agent delegation (#17261, #17247) suggests the newest topology profiles are straining under real workloads. CI stability remains a persistent theme, with automated flake reports and main-branch failures dominating the issue tracker.

## 2. Releases

**v0.27.2-nightly.20261113.6f754be654** was published in the last 24h. Notable change:
- `feat(managed-agent)`: register client filesystems into managed sessions ([#16844](https://github.com/QwenLM/qwen-code/pull/16844)) — extends the managed-agent session model so client-side filesystems are visible to hosted sessions.

## 3. Hot Issues

1. **[#14724](https://github.com/QwenLM/qwen-code/issues/14724)** — *Main CI failed: Managed Agent gate — no test identified* (OPEN, 373 comments). This long-running automated CI failure report has become the single most-commented issue in the tracker, reflecting how noisy the managed-agent gate has become. Its persistence since mid-October signals a structural problem with test identification rather than a single bug.

2. **[#17045](https://github.com/QwenLM/qwen-code/issues/17045)** — *tracking(core): land the 1.0 Preview loop kernel on main, one surface at a time* (OPEN, P1). The central architectural coordination issue for migrating every surface onto the shared event-driven agent loop. This is the highest-leverage issue in the project right now and will shape the 1.0 release.

3. **[#13009](https://github.com/QwenLM/qwen-code/issues/13009)** — *Main CI failed: E2E Tests — cron-tools.test.ts* (OPEN, 26 comments, autofix/approved). A persistent E2E failure around default cron-tool registration that has remained open for over a month despite autofix approval.

4. **[#17261](https://github.com/QwenLM/qwen-code/issues/17261)** — *[managed-agent] Content-only child agent launches but produces no output until turn deadline* (OPEN, P2). Reports a `hosted_turn_deadline_exceeded` failure in the `external-files` topology. This is a serious correctness bug for anyone using packaged child agents.

5. **[#17247](https://github.com/QwenLM/qwen-code/issues/17247)** — *managed-agent: public child-agent delegation is refused on external-workspace profiles* (OPEN, P3). A companion bug to #17261 — child-agent delegation fails to open the hosted session in external-workspace profiles like `hosted-workspace-external-files/1`. Together these two issues suggest the external-workspace tool profile needs focused hardening.

6. **[#16219](https://github.com/QwenLM/qwen-code/issues/16219)** — *Main CI failed: E2E Tests — extensions-install.test.ts* (OPEN, 19 comments). Another E2E regression, flagged provisional. The extension install/update flow is a core user journey, so this failure keeps attention high.

7. **[#17266](https://github.com/QwenLM/qwen-code/issues/17266)** — *Web Shell on Windows: "Toggle environment information" causes a storm of cmd.exe windows and overlapping git polls* (OPEN, P2). A fresh, reproducible Windows daemon bug with high user-visible impact — dozens of flashing console windows and CPU-spiking git processes.

8. **[#17289](https://github.com/QwenLM/qwen-code/issues/17289)** — *Custom commands alter `$$`, `$&`, `` $` `` and `$'` in typed arguments* (OPEN, P2). A subtle but serious bug where `String.prototype.replaceAll` is used on user-typed arguments, causing JavaScript replacement-pattern corruption. Affects TOML and markdown commands using `{{args}}`/`$ARGUMENTS`.

9. **[#6137](https://github.com/QwenLM/qwen-code/issues/6137)** — *Flickering in Qwen Code* (OPEN, P2, welcome-pr). A long-lived terminal rendering bug affecting xterm/alacritty with tmux. Despite being open since July, it keeps gathering updates and remains a candidate for a welcome PR.

10. **[#17078](https://github.com/QwenLM/qwen-code/issues/17078)** — *docs(design): translate acp-child-process-tree-reaping to Chinese* (OPEN, P3). Highlights a systematic gap: the bilingual documentation rule in `AGENTS.md` is not being enforced for design docs, leaving Chinese users without parity content.

## 4. Key PR Progress

1. **[#17228](https://github.com/QwenLM/qwen-code/pull/17228)** — *feat(web-shell): Codex-style managed worktree sessions*. Web Shell sessions in trusted Git workspaces now default to isolated, detached-HEAD worktrees, created lazily and supporting branch/handoff. A significant UX shift for parallel chat workflows.

2. **[#17239](https://github.com/QwenLM/qwen-code/pull/17239)** — *perf(core): speed up usage-dashboard replay with a per-transcript cache*. Replaces full re-parsing of recent transcripts on each daemon usage-dashboard refresh with incremental per-transcript caching.

3. **[#17295](https://github.com/QwenLM/qwen-code/pull/17295)** — *fix(integration): run memory-manager fixture scripts as CommonJS*. Addresses an integration-suite failure by marking generated executable fixtures as CommonJS when `QWEN_TUI_ACCEPTANCE_OUT` is set.

4. **[#17268](https://github.com/QwenLM/qwen-code/pull/17268)** — *test(cli): raise managed terminal wait budgets on slow hosts*. Deflakes the managed-runtime terminal suite by raising watchdogs from 15s to the repo's slow-host budget; a direct response to issue #17262.

5. **[#17299](https://github.com/QwenLM/qwen-code/pull/17299)** — *feat(web-shell): show pending loop wakeups in scheduled tasks, sidebar, and session header*. Makes `/loop` self-paced wakeups visible in the Web Shell and daemon API via a new `wakeups` array.

6. **[#16338](https://github.com/QwenLM/qwen-code/pull/16338)** — *feat(desktop): post macOS turn notifications from the desktop host*. Adds native macOS system notifications from the Tauri desktop host when Web Notifications aren't granted.

7. **[#16891](https://github.com/QwenLM/qwen-code/pull/16891)** — *fix(managed-agent): align serverRevision ceiling across contract, management and persistence*. Fixes an off-by-one where three layers disagreed on the maximum `serverRevision`, allowing a value (2^53-1) that some layers rejected.

8. **[#16862](https://github.com/QwenLM/qwen-code/pull/16862)** — *ci(release): retry the Docker integration test suites once*. Adds a single retry and container cleanup to release Docker integration suites to reduce flaky release failures. Flagged `autofix/needs-human`.

9. **[#14113](https://github.com/QwenLM/qwen-code/pull/14113)** — *fix(core): fall back on a 429 that carries an unrecognized provider code*. Makes `modelFallbacks`/`--fallback-model` trigger when a provider returns HTTP 429 with an unknown rate-limit code (e.g. Z.AI's `1310`).

10. **[#14982](https://github.com/QwenLM/qwen-code/pull/14982)** — *fix(core): make the always-on context warning accurate for CJK and actionable*. Uses CJK-aware estimation and names each non-empty contributor so the oversized-context warning is both accurate and actionable.

## 5. Hot Discussions

No standalone Discussion data was provided in the source; this section is omitted.

## 6. Feature Request Trends

- **Managed worktree / parallel session isolation** — PR #17228 (Codex-style detached worktrees) and issue #17275 (Web Shell Goals for multi-workspace daemons) both push toward running many concurrent, isolated sessions per daemon.
- **Agent loop unification (1.0 Preview)** — Issues #17045 and #17284 define the roadmap for landing a single event-driven kernel and enumerate what remains afterward.
- **Deeper managed-agent delegation** — PR #14290 (bounded workspace search tools) and the child-agent bug cluster show sustained investment in making packaged child agents first-class.
- **Bilingual documentation parity** — #17078 requests Chinese translations for design docs, pointing at a broader expectation of zh-CN parity.
- **CI speed and reliability** — #17287 (an external GitHub Next researcher offering CI optimization ideas) plus numerous deflake issues show CI is a top-of-mind area.
- **Configurable resource limits** — Deferred findings from #12313 (`fix(mcp): make App resource limits configurable per server`) continue to surface per-server configuration as a desired direction.

## 7. Developer Pain Points

- **CI noise and flakiness dominate the tracker.** Automated issues like #14724 (373 comments), #13009, #16219, #16091, and multiple `deflake:` reports (#17262, #17243, #17217) show developers spend significant attention triaging nondeterministic test failures. The `qwen-code-dev-bot` and `qwen-code-review-bot` accounts generate most of this volume.
- **Managed-agent external-workspace reliability.** #17261 and #17247 both describe child-agent delegation failing in external-workspace profiles, a recurring class of bug that blocks production use of hosted/managed deployments.
- **Long-lived rendering/UI bugs go unaddressed.** #6137 (terminal flickering, open since July) and #13603 (agent context usage against wrong model window) reflect slow resolution for user-visible polish issues.
- **Mutation of user input in the command layer.** #17289 (JS replacement-pattern corruption of `{{args}}`) is the latest example of subtle string-handling bugs that surprise users.
- **README/SECURITY process friction.** #17288 reports the security-vulnerability reporting channel is effectively unusable outside specific regions, and GitHub private reporting isn't enabled — a process gap for a widely-deployed tool.
- **Provisional, "dismissible" CI reports create churn.** Many main-CI failure issues note that the failure may already be covered by a newer push, implying contributors must manually reconcile whether a report is stale.

---
*Generated from github.com/QwenLM/qwen-code activity on 2026-11-15.*

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*