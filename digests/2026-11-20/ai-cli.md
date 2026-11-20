# AI CLI Tools Community Digest 2026-11-20

> Generated: 2026-11-20 02:14 UTC | Tools covered: 7

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

# Cross-Tool Comparison Report — AI CLI Ecosystem
**Date: 2026-11-20 | Scope: Claude Code, OpenAI Codex, Gemini CLI, GitHub Copilot CLI, OpenCode, Pi, Qwen Code**

---

## 1. Ecosystem Overview

The AI CLI tooling landscape on 2026-11-20 shows a maturing market where **agent orchestration, MCP interoperability, and cross-surface continuity** have replaced raw model access as the primary competitive battleground. Release cadence remains high (Codex, Gemini CLI, and Copilot CLI all shipped within 24h), but the dominant activity is **reliability engineering**: subagent lifecycle management, prompt-cache correctness, context-window economics, and terminal state hygiene. A notable structural pattern is the convergence of desktop, TUI, IDE, and web surfaces around a shared agent runtime — and the attendant bugs when that shared state leaks across surfaces. Safety and trust infrastructure (Claude Code's fork-PR hardening, Qwen Code's AUTO-mode trust bypass, Codex's approval-authority validation) is emerging as a first-class engineering concern rather than a compliance afterthought.

---

## 2. Activity Comparison

| Tool | Issues (24h window) | PRs (24h window) | Discussions | Release Status |
|---|---|---|---|---|
| **Claude Code** | ~30+ active (≈25 are one reporter's cyber-filter cluster) | 1 updated (1 open) | N/A (not provided) | **v2.1.329** shipped |
| **OpenAI Codex** | 10+ hot issues tracked | 10 updated (9 internal refactors + 1 security) | ✅ Multiple (Ideas, Q&A, Show & Tell) | **rust-v0.171.0** stable; **v0.172.0-alpha.2**; **v0.171.0-alpha.13.1** |
| **Gemini CLI** | 10 hot issues tracked | 10 updated (6 closed, 4 open) | N/A (not provided) | **v0.70.0** stable; **v0.71.0-preview.0**; nightly |
| **GitHub Copilot CLI** | 10 hot issues tracked | 1 updated (closed) | N/A (not provided) | **v1.0.115-1** + **v1.0.115-0** |
| **OpenCode** | 10 hot issues tracked | 10 updated (multiple) | N/A (not provided) | No release |
| **Pi** | 10 hot issues tracked | 10 updated (8 closed, 2 open) | ✅ Multiple (Show & Tell, Ideas) | No release |
| **Qwen Code** | 10 hot issues tracked | 10 updated | N/A (not provided) | No release |

**Notes:**
- Counts reflect only items **updated in the last 24h** as reported in source digests; absolute repository totals are not comparable.
- **N/A for Discussions** indicates the digest source did not provide Discussion data — *not* that the channel is inactive. Codex and Pi are the only tools with confirmed Discussion activity in this window.
- Claude Code's issue count is inflated by a single reporter (`sworrl`) filing ~25 cyber-safeguard false positives; the *distinct* signal count is closer to 5–6 issues.

---

## 3. Shared Feature Directions

Several requirements recur independently across tool communities, indicating ecosystem-level rather than tool-specific demand:

### 3.1 Subagent maturity & lifecycle control
- **Gemini CLI** — the *overwhelming* theme: async/background execution (#17754), resumability (#17758), per-agent configurability (#17760), shared memory/parallel collaboration (#18287).
- **OpenCode** — subagent hallucination when idle (#63785), background-service reliability (#64869).
- **Codex** — subagent transcripts in TUI (#61352), orchestration with model routing (#62394).
- **Claude Code** — scheduled tasks/`/loop` visibility in v2.1.329.

> **Common need:** agents that run durably, in parallel, and observably — with the ability to resume, isolate, and inspect them.

### 3.2 MCP reliability & trust boundaries
- **Copilot CLI** — the #1 pain point: OAuth silent failures, missing token exchange, forced re-auth despite valid refresh tokens (#4017, #4203, #5350, #5510).
- **Qwen Code** — AUTO-mode MCP trust bypass (#17854, security), "still connecting" indistinguishable from "failed" (#17832), elicitation capability (#17358).
- **Codex** — full Apps/MCP catalog sent per request causing context overflow (#61679); `mcpServerStatus/list` failures (#62631).
- **OpenCode** — mid-conversation tool changes requiring re-declaration (#64381).

> **Common need:** MCP as a *first-class, trustable, context-efficient* integration surface — not a bolted-on tool loader.

### 3.3 Context-window economics & compaction correctness
- **Copilot CLI** — PDF token overcounting (~20×, #5517), silent 128K fallback (#4310).
- **Codex** — Apps catalog inflation → auto-compaction loops (#61679).
- **Qwen Code** — double-counted pending tool result aborting turns (#15486), compaction truncating user prompts (#17894).
- **Pi** — GPT-6.2 cache-reuse regression (#12273), thinking-level changes breaking cache (#12269).
- **Gemini CLI** — "Tactful Extraction" grep-first read hierarchy (#19561); baseline ~36.6k tokens/turn.

> **Common need:** deterministic, transparent token accounting and cache-preserving session mutations.

### 3.4 Terminal/TUI lifecycle hygiene
- **Pi** — the *single most concentrated* bug cluster: SIGTSTP handling, mouse-tracking leaks, Kitty keyboard protocol not restored on exit (#12133, #12272, #12283, #12336, #12339).
- **Copilot CLI** — timeline jumps, non-collapsing reasoning blocks, diff panels pushing context off-screen (#5533, #5531).
- **Claude Code** — Windows `claude.exe` session-process accumulation (#96299).

> **Common need:** clean suspend/resume/exit semantics and review-friendly TUI state.

### 3.5 Workspace/project scoping
- **Codex** — per-workspace chat history (#25319, 👍139 — highest-engagement issue in this report), project-first sidebar.
- **OpenCode** — per-project credential activation (#51152) to stop cross-project re-billing.
- **Gemini CLI** — per-workspace policy scoping (#18397).

> **Common need:** isolation boundaries so one project's context, credentials, and billing don't bleed into another.

### 3.6 Cross-surface continuity
- **Codex** — ChatGPT mobile ↔ Codex desktop bidirectional handoff (#32519).
- **Claude Code** — Desktop + non-interactive host parity for hook warnings.
- **Gemini CLI** — ACP session lifecycle (#30368) for editor integration.

---

## 4. Differentiation Analysis

| Dimension | Claude Code | OpenAI Codex | Gemini CLI | Copilot CLI | OpenCode | Pi | Qwen Code |
|---|---|---|---|---|---|---|---|
| **Primary focus** | Enterprise hooks/automation + safety | Model catalog + TUI workspace | Subagent framework + native bash | MCP auth + IDE/ACP integration | Provider flexibility + plugin parity | Embedded agent runtime + durable storage | Managed channels + CI reliability |
| **Target user** | Enterprise/CI, security-conscious teams | Broad IDE + desktop developer | Power users of agentic workflows | GitHub-centric devs, Zed/ACP users | Multi-provider tinkerers, plugin authors | Embedders, "always-on agent" builders | Managed-agent / enterprise channel operators |
| **Technical approach** | Hook provenance, trust dialogs, fork-PR gating | Rust core, catalog-driven routing, Guardian classifier | Native bash affinity, zero-dep sandboxing proposal | ACP-first, MCP OAuth state machine | Background shared server, `session_part` row storage | pi-durable, package namespacing, WebDriver quota ideas | Daemon recovery inbox, channel adapters |
| **Distinctive asset** | Managed-settings hook trust model | GPT-6.2 Sol/Astra as default + TUI doc previews | Gemini 3 POSIX-tool affinity | Extension bootstrap + MCP scopes | Claude account rotation | Terminal lifecycle rigor | MCP elicitation + skill-declared MCP deps |
| **Biggest self-inflicted risk** | Over-broad cyber filter halting sessions | Windows desktop instability | Generalist agent hangs (P1) | MCP OAuth opacity | Provider/model identity churn | Windows second-class treatment | Chronically red `main` CI |

**Key differentiators:**
- **Claude Code** is the only tool where *safety infrastructure itself* is the dominant community signal — and where that infrastructure is visibly over-triggering.
- **Codex** is the only tool with a **model catalog as a shipped feature** (Sol default, Astra added) — competing on model access, not just harness.
- **Gemini CLI** has the most **coherent subagent roadmap** (epics #17754/#17758/#17760/#18287 cross-referenced).
- **Copilot CLI** is the most **MCP-auth-fragile** and the most **ACP-invested** (Zed integration).
- **Pi** differentiates on **durable, embeddable runtime** (pi-durable, pi.namespace, Telegram-backed always-on agent in #12331).
- **Qwen Code** is uniquely **channel-oriented** (DingTalk/WeCom/GitHub managed adapters) — an enterprise-messaging-first posture.

---

## 5. Community Momentum & Maturity

### 5.1 Momentum ranking (activity intensity, 24h window)

| Tier | Tools | Evidence |
|---|---|---|
| **Highest** | **OpenAI Codex**, **Gemini CLI**, **Pi**, **OpenCode** | 10+ PRs updated, multiple hot issues with high 👍/comment counts, active Discussions (Codex, Pi) |
| **High** | **Claude Code**, **Qwen Code** | Very high issue volume (Claude: ~30; Qwen: 484-comment CI issue) but lower PR throughput in window |
| **Moderate** | **GitHub Copilot CLI** | Only 1 PR updated in 24h; issue engagement is real but PR velocity is thin |

### 5.2 Maturity signals

- **Most mature harness engineering:** **OpenAI Codex** — 10 PRs in 24h, mostly internal refactors (memory release, executor cache reuse, backpressure, ID centralization), plus a security fix (#30963). This is the profile of a system being *hardened*, not *rescued*.
- **Most mature community engagement:** **Codex** (Discussions with 150+ tool indexes, plugin manifests) and **Pi** (Show & Tell with 5,216-line real deployments).
- **Fastest iteration:** **Gemini CLI** — stable + preview + nightly in one window, with `/stats heatmap` shipped.
- **Most fragile CI:** **Qwen Code** — `Managed Agent` gate chronically red since ≥2026-11-11 (#17851), making required-check gating effectively meaningless; 484-comment bot-filed issue (#14724) signals **noise fatigue**.
- **Most fragile user trust:** **Claude Code** — a single reporter's ~25 false positives indicate a *systemic* filter calibration problem, not isolated reports.
- **Most concentrated UX debt:** **Pi** — a dozen PRs in 24h all addressing terminal lifecycle; high fix velocity but reveals accumulated debt.

### 5.3 Community health caveats

- **Copilot CLI's** low PR count (1) with high issue engagement may indicate a bottleneck in maintainer review or a shift of development to a private/upstream repo.
- **Claude Code's** issue tracker is currently **distorted** by the cyber-filter cluster; true community signal is thinner than raw counts suggest.
- **OpenCode's** 161-comment clipboard issue (#4283, closed) and 135 👍 show a passionate user base willing to doggedly reproduce bugs — a healthy sign.

---

## 6. Trend Signals

### 6.1 Industry-level trends visible in community feedback

1. **Safety filters are becoming a developer-experience liability.**
   Claude Code's cyber-filter false-positive cluster (firmware flashing, Go builds, TLS setup, defensive hardening) is the clearest signal yet that **lexical/topic-based safety classifiers over-trigger on legitimate engineering work**. Expect demand for **intent-aware, domain-scoped safeguards** and per-project allowlists.

2. **MCP is the new "integration tax."**
   Across Copilot CLI, Qwen Code, Codex, and OpenCode, MCP lifecycle — OAuth, trust, catalog inflation, elicitation — is the **single most cross-cutting pain point**. Tools that solve MCP *reliability* (not just MCP *support*) will win enterprise adoption.

3. **Prompt-cache correctness is now a cost feature.**
   Pi's GPT-6.2 cache-reuse regression (#12273), OpenCode's plan-limit drain (#61072), and Codex's context overflow all point to the same truth: **token accounting bugs are now billing bugs**. Cache-preserving session mutations (#12269) are a genuine differentiator.

4. **Subagents are the next platform primitive.**
   Gemini CLI's epic cluster, Codex's subagent transcripts, and OpenCode's subagent hallucination issue all indicate the industry is moving from *single-agent chat* to **orchestrated multi-agent runtimes** — and the tooling to observe, resume, and isolate them is immature.

5. **Terminal/TUI state hygiene is a trust proxy.**
   Pi's concentrated terminal-lifecycle fixes and Copilot CLI's TUI friction show that **users judge tool quality by whether their shell is intact after exit**. This is unglamorous but high-leverage.

6. **Cross-surface continuity is the emerging expectation.**
   Codex's mobile↔desktop handoff request (#32519) and Gemini CLI's ACP work signal that developers expect **the same agent context across surfaces** — a hard architectural problem that will separate leaders from laggards.

7. **Windows remains a second-class citizen across the board.**
   Codex (project disappearance, WSL disk exhaustion), Claude Code (process leaks, silent notifications), Pi (99-comment Windows thread, re-render saturation), Gemini CLI (PowerShell freezes, `~\` paths), Copilot CLI (vim backspace, long-path clones) — **every tool has Windows-specific debt**. Enterprise Windows adoption will be gated by this.

8. **CI reliability is a community-trust issue, not just an ops issue.**
   Qwen Code's chronically red `main` and 484-comment bot issue show that **unstable required checks erode contributor confidence** and generate noise that masks real bugs.

### 6.2 Reference value for developers & decision-makers

- **If you need model-access breadth:** Codex (Sol/Astra catalog) leads; watch for catalog-driven routing (#61844).
- **If you need enterprise MCP reliability:** *None* are fully there yet; Copilot CLI is most exposed, Qwen Code is most actively hardening trust boundaries.
- **If you need durable/embeddable agents:** Pi (pi-durable, pi.namespace) and OpenCode (background server) are the most architecturally ambitious.
- **If you need safety/audit trails:** Claude Code's hook-trust model is the most developed — but budget for filter calibration.
- **If you need channel/enterprise-messaging integration:** Qwen Code (DingTalk/WeCom/GitHub) is the outlier leader.
- **If you value CI hygiene:** Qwen Code is the cautionary tale; Codex's refactor-heavy PR flow is the model to emulate.

---

*Report compiled from seven 2026-11-20 community digests. Counts reflect only items updated in the 24h window and are not directly comparable across repositories. Where source data was absent (Discussions for five tools), sections are marked N/A rather than inferred.*

---

## Per-Tool Reports

<details>
<summary><strong>Claude Code</strong> — <a href="https://github.com/anthropics/claude-code">anthropics/claude-code</a></summary>

## Claude Code Skills Highlights

> Source: [anthropics/skills](https://github.com/anthropics/skills)

# Claude Code Skills — Community Highlights Report
*Data snapshot: 2026-11-20 · Source: github.com/anthropics/skills*

---

## 1. Top Skills Ranking (by discussion & attention)

> Note: The PR feed reports `Comments: undefined` for all entries, so ranking below is inferred from cross-referencing with linked Issues, author activity, and PR prominence.

| # | Skill / PR | Functionality | Discussion Highlights | Status |
|---|-----------|---------------|----------------------|--------|
| 1 | **mcp-builder** fix — [#1742](https://github.com/anthropics/skills/pull/1742) | Patches MCP connection scripts for `mcp>=2.0.0` API rename (`streamablehttp_client` → `streamable_http_client`) and header config | Breaks real-world MCP integrations; fix linked to issue #1668. Active since Sept. | OPEN |
| 2 | **skill-creator** trigger-eval fix — [#1298](https://github.com/anthropics/skills/pull/1298) | Isolates trigger evaluations, fixes Windows subprocess `select()` failures and runtime-failure misclassification | Addresses the same false-negative trigger problem reported in Issues #556 and #1352 | OPEN |
| 3 | **notion-spec-to-implementation** + **quantitative-resume-auditor** — [#1245](https://github.com/anthropics/skills/pull/1245) | Converts Notion specs into Claude-executable tasks; audits resumes quantitatively | Dual-skill submission; long-running (Jun–Oct) without merge | OPEN |
| 4 | **webapp-testing** `shell=True` fix — [#1980](https://github.com/anthropics/skills/pull/1980) | Removes command-injection risk (CWE-78) in `with_server.py` | Security hardening of an official skill script | OPEN |
| 5 | **docx** LibreOffice timeout fix — [#1792](https://github.com/anthropics/skills/pull/1792) | Reports `soffice` timeout as error; verifies revision marks actually removed | Reliability fix for the widely used docx skill | OPEN |
| 6 | **pyxel** retro-game skill — [#525](https://github.com/anthropics/skills/pull/525) | Guides creation/debugging of Pyxel retro games, headless input runs, frame inspection | Longest-lived open PR in top 20 (Mar–Nov); niche but persistent | OPEN |
| 7 | **proofcore-contract-auditor** — [#1771](https://github.com/anthropics/skills/pull/1771) | Static analysis of Solidity/Rust contracts + TON blockchain notarization | Web3/security vertical; vendor-driven contribution | OPEN |
| 8 | **document-typography** — [#514](https://github.com/anthropics/skills/pull/514) | Fixes orphan wraps, widows, and numbering misalignment in generated docs | Broad-applicability quality-control skill | OPEN |

---

## 2. Community Demand Trends (from Issues)

Distilled from the highest-engagement Issues:

- **Trust & namespace security** — [Issue #492](https://github.com/anthropics/skills/issues/492) (46 comments): community skills distributed under the `anthropic/` namespace enable impersonation and trust-boundary abuse. **This is by far the loudest concern.**
- **Enterprise / org-wide skill distribution** — [Issue #228](https://github.com/anthropics/skills/issues/228) (17 👍): users want shared skill libraries and direct share links instead of manual `.skill` file uploads.
- **Skill evaluation correctness** — [Issue #556](https://github.com/anthropics/skills/issues/556) and [#1352](https://github.com/anthropics/skills/issues/1352): `run_eval.py` produces 0% trigger rates, and parallel workers cross-match UUIDs — undermining skill QA.
- **Context economy** — [Issue #1487](https://github.com/anthropics/skills/issues/1487): the `claude-api` skill injects ~156k tokens in one call, exhausting the context window. Demand for leaner, lazy-loading skills.
- **Skill description quality** — [Issue #2064](https://github.com/anthropics/skills/issues/2064): frontmatter should say *when* to use a skill, not just what it does (triggerability).
- **Memory / reasoning scaffolding** — [Issue #1329](https://github.com/anthropics/skills/issues/1329) (compact-memory) and [#1385](https://github.com/anthropics/skills/issues/1385) (Reasoning Quality Gate Pipeline): symbolic agent state compression and pre-task/adversarial/delivery quality gates.
- **Plugin duplication & packaging** — [Issue #189](https://github.com/anthropics/skills/issues/189): `document-skills` and `example-skills` ship identical content, causing context bloat.

**Emerging directions:** workflow automation (spec→tasks), agent self-governance/quality gates, memory compression, Web3 auditing, and document/typography quality control.

---

## 3. High-Potential Pending Skills (active, unmerged)

| PR | Skill | Why it may land soon |
|----|-------|---------------------|
| [#1681](https://github.com/anthropics/skills/pull/1681) | skill-creator direct-execution fix | Updated **2026-11-19** (latest activity in set); fixes `ModuleNotFoundError` blocking standalone use |
| [#1950](https://github.com/anthropics/skills/pull/1950) | claude-api pause_turn guidance | Updated 2026-11-10; aligns docs with Python SDK 1.1.0 auto-resumption |
| [#2019](https://github.com/anthropics/skills/pull/2019) | xlsx external-link resolution | Updated 2026-11-03; closes issue #2013, well-scoped bug fix |
| [#2108](https://github.com/anthropics/skills/pull/2108) | README snapshot-status docs | Updated 2026-11-03; low-risk documentation clarity |
| [#1980](https://github.com/anthropics/skills/pull/1980) | webapp-testing security fix | Updated 2026-11-01; security-motivated, likely prioritized |
| [#1975](https://github.com/anthropics/skills/pull/1975) / [#1976](https://github.com/anthropics/skills/pull/1976) / [#1977](https://github.com/anthropics/skills/pull/1977) | pptx / webapp-testing / algorithmic-art micro-fixes | Same author (gerardrecinto), small validated patches closing issues #1809, #1891, #1897 |
| [#1615](https://github.com/anthropics/skills/pull/1615) | scnet-hpc | HPC/Slurm domain skill; self-contained |

**Observation:** The majority of pending PRs are **bug fixes to existing official skills**, not new skill submissions — a sign the ecosystem is maturing toward maintenance and hardening.

---

## 4. Skills Ecosystem Insight

> **The community's most concentrated demand is for *trust, correctness, and context-efficiency* in the Skills pipeline itself — secure namespacing, reliable trigger/eval behavior, and lean token footprints — rather than for entirely new skill categories.**

---

# Claude Code Community Digest — 2026-11-20

## 1. Today's Highlights

A new patch release (v2.1.329) landed with hook-trust and scheduled-task visibility improvements, but the day's activity was dominated by a large batch of closed cybersecurity safeguard false-positive reports from a single reporter (`sworrl`) and several long-running Windows/desktop bugs. Notably, a fresh PR (#111198) proposes blocking `@claude` mentions on fork-originated pull requests — a meaningful security hardening step for the agent-triggered workflow.

## 2. Releases

**v2.1.329** — small but useful trust/observability update:
- Added a trust dialog warning that indicates *where* a folder's hooks are declared.
- Added an in-conversation warning (Claude Desktop and other non-interactive hosts) when hooks in managed settings fail to load.
- Added visibility into the current session's scheduled tasks, `/loop` wakeups, and the active goal.

These changes target transparency around hook execution and automated/scheduled agent behavior — a recurring theme in enterprise/CI usage.

## 3. Hot Issues

1. **#93482 — Cowork silent stale writes (Windows, data-loss)** — `device_commit_files` reports success on overwrites, but on-disk content lags exactly one commit behind (fresh mtime, stale body). 28 comments, 2 👍. A genuine data-integrity bug in the cowork/device sync path; the most-discussed issue of the day. [Link](https://github.com/anthropics/claude-code/issues/93482)

2. **#96299 — Windows `claude.exe` session processes never terminated** — Background processes accumulate over a workday, driving high RAM/disk usage. 13 comments, 4 👍. Persistent resource leak affecting the desktop app on Windows. [Link](https://github.com/anthropics/claude-code/issues/96299)

3. **#95593 — Desktop completion notifications silent (Windows + macOS)** — Chat response notifications don't fire, while Code/Cowork notifications work correctly. 10 comments, 4 👍. Cross-platform desktop UX regression. [Link](https://github.com/anthropics/claude-code/issues/95593)

4. **#105868 — `mcp__claude-in-chrome__file_upload` missing from new chats** — Tool intermittently absent; latest update: works only in automatic approval mode, with a ~3.8 MB payload concern noted. 7 comments, 4 👍. MCP tool-availability inconsistency in Claude-in-Chrome. [Link](https://github.com/anthropics/claude-code/issues/105868)

5. **#94159 — Safeguard false positive halting microcontroller firmware flashing** — Opus 4.8 cyber filter blocked authorized hardware work; reproducible via Request ID. [Link](https://github.com/anthropics/claude-code/issues/94159)

6. **#94157 — Safeguard block on defensive code fix commits** — Session-halted during routine defensive patching. [Link](https://github.com/anthropics/claude-code/issues/94157)

7. **#94142 — Safeguard flagged embedded Linux image compilation / power wake verification** — 1 👍; representative of the embedded/firmware cluster of false positives. [Link](https://github.com/anthropics/claude-code/issues/94142)

8. **#94137 — Safeguards block Go build script review / cross-platform compilation** — `infra-devops` domain, 1 👍; shows the filter triggering on ordinary build tooling. [Link](https://github.com/anthropics/claude-code/issues/94137)

9. **#94141 — Safeguard blocks key search in local backups during server hardening** — `defensive-hardening` domain; a defensive-security task blocked by the safety filter. [Link](https://github.com/anthropics/claude-code/issues/94141)

10. **#94136 — Safeguard blocks updating test files/mock data to compliant terminology** — `offensive-pentest` domain; even terminology cleanup was flagged. [Link](https://github.com/anthropics/claude-code/issues/94136)

> **Note on the cyber cluster:** Roughly 25 of the top 30 issues by comment count today are `[Bug][cyber]` safeguard false-positive reports authored by `sworrl` — almost all **CLOSED** (many marked duplicate), tagged `area:security`/`area:model`/`api:anthropic`, with flagging model **Opus 4.8** and severity **session-halted**. The cluster is significant as a signal: the cyber safety filter appears to be broadly over-triggering on legitimate embedded, defensive, and build/review work.

## 4. Key PR Progress

Only **one** PR was updated in the last 24h:

1. **#111198 — "Don't run @claude mentions on pull requests from forks"** (OPEN, by `mhegazy`) — Proposes that an `@claude` mention on a fork-originated PR should not trigger the agent. This is a supply-chain/abuse-prevention measure: fork PRs are attacker-controllable, so auto-running an agent on them risks prompt-injection and secret-exposure vectors. Community reaction data (comments/reactions) is not yet available. [Link](https://github.com/anthropics/claude-code/pull/111198)

> With only a single PR in the window, no further PRs can be meaningfully summarized without speculation.

## 5. Hot Discussions

No Discussions data was provided in the source payload. **This section is omitted.**

## 6. Feature Request Trends

Inferred from the issue set (feature *requests* are limited; the dominant signal is bug-driven):

- **Hook/automation transparency** — v2.1.329's trust-dialog and managed-settings hook warnings reflect ongoing demand for clearer provenance and failure reporting around hooks and scheduled tasks.
- **MCP tool reliability** — #105868 highlights demand for consistent availability of MCP tools (e.g., Chrome file upload) across chat modes and hosts.
- **Desktop lifecycle management** — #96299 and #95593 point to requests for proper process cleanup and consistent cross-platform notification behavior.
- **Safety-filter precision** — the cyber cluster is effectively a large-scale request for a more precise, domain-aware safeguard that distinguishes authorized embedded/defensive work from genuinely malicious activity.

## 7. Developer Pain Points

- **Over-broad cybersecurity safeguards (highest-volume pain point).** Dozens of session-halting false positives on firmware flashing, Go builds, TLS setup, AD CS lookups, local DNS, backup key search, and documentation updates. The pattern suggests the filter keys on lexical/topic cues rather than intent, blocking legitimate `defensive-hardening`, `infra-devops`, and embedded work.
- **Windows desktop resource leaks.** Session processes accumulating with no termination (#96299) and silent completion notifications (#95593) degrade the day-to-day desktop experience.
- **Silent data staleness.** The one-commit-behind write behavior in Cowork (#93482) is especially dangerous because it reports success — eroding trust in the tool's commit semantics.
- **MCP tool inconsistency.** Tools appearing/disappearing and behaving differently by approval mode (#105868) makes Chrome automation unreliable.

---

*Prepared from github.com/anthropics/claude-code data for 2026-11-20. Issue/PR counts reflect only items updated in the last 24h; comment and reaction totals are as reported in the source.*

</details>

<details>
<summary><strong>OpenAI Codex</strong> — <a href="https://github.com/openai/codex">openai/codex</a></summary>

# OpenAI Codex Community Digest — 2026-11-20

## 1. Today's Highlights

The **`rust-v0.171.0` stable release** landed with two major changes: GPT-6.2 Sol and Astra added to model catalogs (Sol now the default), and the **TUI workspace enabled by default** with searchable document/image previews and subagent transcripts. Meanwhile, the issue tracker is dominated by **Windows desktop regressions** (disappearing projects, WSL disk exhaustion, Chrome control failures) and a notable **context-window exhaustion bug** where the Apps tool catalog is sent in full on every request, triggering auto-compaction loops.

---

## 2. Releases

### `rust-v0.171.0` (stable)
- **Model catalogs updated**: Added **GPT-6.2 Sol** and **Astra**, with Sol as the default catalog selection ([#62106](https://github.com/openai/codex/pull/62106)).
- **TUI workspace on by default**: Searchable document previews, image previews, and subagent transcripts now render alongside the main conversation ([#61352](https://github.com/openai/codex/pull/61352), [#61888](https://github.com/openai/codex/pull/61888), [#61889](https://github.com/openai/codex/pull/61889), [#61919](https://github.com/openai/codex/pull/61919)).

### `rust-v0.172.0-alpha.2`
- Pre-release build; no detailed changelog provided.

### `rust-v0.171.0-alpha.13.1`
- Patch-level alpha; no detailed changelog provided.

---

## 3. Hot Issues

1. **[#25319 — Scope Codex VS Code chats to the current workspace/project](https://github.com/openai/codex/issues/25319)** *(61 comments, 👍139)*
   The highest-engagement open issue. IDE Extension users want chat/thread history scoped per workspace instead of globally, avoiding cross-project context bleed. Massive 👍 count signals broad demand.

2. **[#62212 — Desktop: unsupported audio tool output causes later text-only turns to return HTTP 400](https://github.com/openai/codex/issues/62212)** *(28 comments)*
   A fresh, high-traffic bug: an audio tool response poisons subsequent text-only turns with HTTP 400 on GPT-6.2 Sol. Serious because it breaks sessions mid-workflow and appears reproducible.

3. **[#25737 — CLI login forces SMS OTP on security-key-only (AAS) accounts](https://github.com/openai/codex/issues/25737)** *(24 comments, 👍12)*
   A long-running auth inconsistency: browser login honors Advanced Account Security (FIDO2/CTAP2), but `codex login` forces an SMS phone OTP step-up. Blocks hardware-key-only users from the CLI.

4. **[#47041 — GPT-5.6 Sol / GPT-6 Astra reject harmless prompts with `invalid_prompt`](https://github.com/openai/codex/issues/47041)** *(16 comments)*
   Model-behavior regression on Windows desktop where benign prompts are rejected. Persistent for two months; undermines trust in the new default models.

5. **[#32519 — ChatGPT–Codex shared project context and bidirectional task handoff](https://github.com/openai/codex/issues/32519)** *(12 comments)*
   Feature request for seamless context flow between ChatGPT mobile (ideation) and Codex desktop (implementation). Reflects the growing "multi-surface workflow" expectation.

6. **[#61294 — Windows: local Codex projects disappear after update while chats remain accessible](https://github.com/openai/codex/issues/61294)** *(11 comments)*
   Update-induced data-loss-style regression on Windows: projects vanish from the sidebar while threads survive. High user anxiety, zero 👍 but high severity.

7. **[#38768 — Windows Remote Control: WebSocket times out (os error 10060) behind proxy/TUN](https://github.com/openai/codex/issues/38768)** *(10 comments)*
   Corporate-proxy and TUN users cannot establish Remote Control connections despite `curl` reaching the endpoint. Blocks enterprise adoption.

8. **[#30417 — ChatGPT mobile incorrectly blocks Codex Cloud when Remote Control is disabled](https://github.com/openai/codex/issues/30417)** *(10 comments, 👍6)*
   Entitlement gating bug: mobile Codex surface is locked behind Remote Control even when Codex Cloud is enabled and works on web/Slack. Confusing UX.

9. **[#61679 — Apps tool catalog sent in full every request → fresh session exceeds context window, auto-compaction loops](https://github.com/openai/codex/issues/61679)** *(5 comments)*
   Architecturally significant: full MCP/Apps catalog inflation on every request causes immediate context overflow. A real blocker for MCP-heavy users.

10. **[#56601 — Allow CLI/TUI users to connect a computer to a dot without the desktop app](https://github.com/openai/codex/issues/56601)** *(👍13)*
    High-signal enhancement: CLI-first users want dot/computer pairing without the desktop app. Strong 👍 despite only 4 comments.

---

## 4. Key PR Progress

Most PRs this cycle are `copyberry[bot]`-authored internal refactors. The notable ones:

1. **[#62644 — Pass inherited history visibility to the thread store](https://github.com/openai/codex/pull/62644)**
   Adds `InheritedHistoryVisibility` to `CreateThreadParams`; `ModelContextOnly` lets forks omit history from `list_turns`/`list_items`. Foundation for cleaner forked context.

2. **[#62641 — Release persisted MCP tool results from active-turn memory](https://github.com/openai/codex/pull/62641)**
   Frees memory for completed MCP tool results when history can supply the payload — with truncation-preview safety checks. Directly relevant to the context/memory pressure in #61679.

3. **[#62640 — Reuse executor Discovery V2 inventories across turns](https://github.com/openai/codex/pull/62640)**
   Stops discarding the discovery cache at turn start, avoiding redundant MCP inventory rebuilds.

4. **[#62639 — Defer queue-only mail after a retained final answer](https://github.com/openai/codex/pull/62639)**
   Prevents spurious turn resampling when a final answer is already retained after a mailbox interrupt.

5. **[#62636 — Reduce rollout scanning overhead when listing threads](https://github.com/openai/codex/pull/62636)**
   Uses buffered rollout reading and skips unrelated record parsing — a thread-list performance win.

6. **[#62635 — Centralize request and prefix ID handling in `ThreadContextIds`](https://github.com/openai/codex/pull/62635)**
   Stable, thread-scoped, content-derived UUIDs for base instructions and Responses Lite tool definitions.

7. **[#62627 — Retry Guardian model discovery in the background](https://github.com/openai/codex/pull/62627)**
   Prevents a failed catalog fetch from leaving a configured Guardian provider without a classifier, avoiding tool-dispatch delays.

8. **[#62615 — Split in-memory execution policy rules into a separate crate](https://github.com/openai/codex/pull/62615)**
   Decouples config/protocol/prompt code from the Starlark parser — meaningful build and layering cleanup.

9. **[#62609 — Apply backpressure to app-server request replay on thread resume](https://github.com/openai/codex/pull/62609)**
   Bounds outbound queue pressure when resuming threads with many pending requests.

10. **[#30963 — Validate approval responses against pending authority](https://github.com/openai/codex/pull/30963)** *(OPEN since July)*
    Security-relevant: fixes approval responses being matched only by string ID, so an exec response could consume a patch waiter with the same ID. Hardens the approval boundary.

---

## 5. Hot Discussions

### Ideas
- **[#61844 — Intelligent Model Routing and Automatic Task Complexity Assessment](https://github.com/openai/codex/discussions/61844)** — Proposes lightweight complexity assessment to auto-select model/reasoning level instead of manual switching.
- **[#62213 — Built-in One-Click Prompt Enhancement for ChatGPT and Codex](https://github.com/openai/codex/discussions/62213)** — Requests native "Optimize Prompt" in the input box, citing WorkBuddy/Kilo Code parity.

### Q&A
- **[#61849 — Diagnosing screenshot/tool response-start latency in Codex 0.169.0](https://github.com/openai/codex/discussions/61849)** — Asks for a supported metadata-only timing method to separate first-output latency from later command delivery.
- **[#62436 — Supported architecture for continuing project ownership across runs](https://github.com/openai/codex/discussions/62436)** — Building a NATS/JetStream-coordinated multi-worker system with durable project records; seeks official guidance.

### Show and tell
- **[#16329 — Awesome Codex CLI: 150+ ecosystem tools](https://github.com/openai/codex/discussions/16329)** — Curated index of subagents, skills, plugins, MCP servers.
- **[#16073 — Awesome Codex Plugins community list](https://github.com/openai/codex/discussions/16073)** — 12 official + 15 community plugins, manifest-verified.
- **[#62551 — Orchevia: Codex and Claude Code as independent reviewers in one workflow](https://github.com/openai/codex/discussions/62551)** — Apache-2.0 desktop app chaining both agents as review steps in a workflow graph.
- **[#62426 — TernaryCode: see which Codex session is waiting for you](https://github.com/openai/codex/discussions/62426)** — Rust-native multi-agent session dashboard across macOS/Windows/Linux.
- **[#62463 — Element Picker Chrome extension](https://github.com/openai/codex/discussions/62463)** — Lets users point at the exact UI element for Codex to modify.
- **[#61870 / #61893 / #61923 / #62244 — Remote MCP servers](https://github.com/openai/codex/discussions/61870)** — A cluster of agent-facing MCP tools (phone calls, task lists, error tracking, social posting) showing rapid ecosystem growth.
- **[#61788 — Codex Windows sandbox protection gaps](https://github.com/openai/codex/discussions/61788)** — 38-scenario security test across privacy, interaction, and system categories; calls for hardening.

---

## 6. Feature Request Trends

- **Project/workspace scoping**: Per-workspace chat history ([#25319](https://github.com/openai/codex/issues/25319)), project-first sidebar grouping ([#31561](https://github.com/openai/codex/issues/31561)), and true ChatGPT Project integration ([#59070](https://github.com/openai/codex/issues/59070), [#45735](https://github.com/openai/codex/issues/45735)).
- **Adaptive model routing / orchestration**: Auto task-complexity assessment ([#61844](https://github.com/openai/codex/discussions/61844)) and task-aware multi-agent orchestration with model routing ([#62394](https://github.com/openai/codex/issues/62394)).
- **Cross-surface continuity**: Shared project context and bidirectional handoff between ChatGPT mobile and Codex desktop ([#32519](https://github.com/openai/codex/issues/32519)).
- **CLI/TUI parity with desktop**: Connecting computers to dots without the desktop app ([#56601](https://github.com/openai/codex/issues/56601)).
- **Native prompt enhancement**: One-click prompt optimization in the composer ([#62213](https://github.com/openai/codex/discussions/62213)).
- **Ecosystem discovery**: Community-maintained indexes for CLI tools and plugins ([#16329](https://github.com/openai/codex/discussions/16329), [#16073](https://github.com/openai/codex/discussions/16073)).

---

## 7. Developer Pain Points

1. **Windows desktop instability is the dominant theme**: disappearing local projects after update ([#61294](https://github.com/openai/codex/issues/61294)), Chrome URL-verification failures ending turns ([#61130](https://github.com/openai/codex/issues/61130)), Chrome control tools unavailable despite `cua_repl` ready ([#55030](https://github.com/openai/codex/issues/55030)), and **WSL workspace probe / WSLg trace-log accumulation causing disk exhaustion** ([#54509](https://github.com/openai/codex/issues/54509)) — the latter rated maximum impact by its reporter.

2. **Permission/sandbox state is unreliable**: Full Access threads silently reverting to `workspace-write` ([#54691](https://github.com/openai/codex/issues/54691)), the permissions selector vanishing from existing threads ([#60109](https://github.com/openai/codex/issues/60109)), and `config.toml` `default_permissions`/`sandbox_mode` being ignored on new threads ([#58507](https://github.com/openai/codex/issues/58507)).

3. **Context-window management under MCP/Apps load**: full Apps tool catalog sent per request triggering auto-compaction loops ([#61679](https://github.com/openai/codex/issues/61679)), plus repeated MCP catalog failures from `unsupported app-server method: mcpServerStatus/list` ([#62631](https://github.com/openai/codex/issues/62631)).

4. **Auth friction**: CLI SMS step-up on hardware-key-only accounts ([#25737](https://github.com/openai/codex/issues/25737)) and Windows MCP OAuth 401 metadata-challenge parsing regressions ([#47756](https://github.com/openai/codex/issues/47756)).

5. **Networking/proxy barriers**: Remote Control WebSocket timeouts behind system proxies/TUN ([#38768](https://github.com/openai/codex/issues/38768)), cloud workspaces stuck offline/pending startup ([#60856](https://github.com/openai/codex/issues/60856)), and Windows Dots stalling with missing thread-placement readiness errors ([#61836](https://github.com/openai/codex/issues/61836)).

6. **Model-behavior regressions on the new defaults**: GPT-5.6 Sol / GPT-6 Astra rejecting harmless prompts ([#47041](https://github.com/openai/codex/issues/47041)) and incomplete routine releases with runner-specific preflight failures ([#62561](https://github.com/openai/codex/issues/62561)).

*Digest compiled from github.com/openai/codex activity for 2026-11-20.*

</details>

<details>
<summary><strong>Gemini CLI</strong> — <a href="https://github.com/google-gemini/gemini-cli">google-gemini/gemini-cli</a></summary>

# Gemini CLI Community Digest — 2026-11-20

## 1. Today's Highlights

Release activity is heavy this cycle, with **v0.70.0** shipping as a stable release, **v0.71.0-preview.0** entering preview, and a fresh nightly (`v0.71.0-nightly.20261120`) landing. The issue tracker continues to be dominated by the **subagent/agent workstream**, where several long-running epics (async execution, resumability, configurability) are being actively retriaged, while a handful of P1 bugs — notably the **generalist agent hang** (#21409) and **Wayland browser subagent failure** (#21983) — remain open. On the PR side, this cycle brought a wave of reliability fixes spanning telemetry, Windows path handling, PowerShell parsing, and ACP session lifecycle.

---

## 2. Releases

**v0.71.0-nightly.20261120.gd4cb1713f**
- `fix(core,cli)`: Preserve literal `$` characters during template placeholder replacement ([#30136](https://github.com/google-gemini/gemini-cli/pull/30136))
- `feat(cli)`: Add `/stats heatmap` subcommand for daily token usage ([PR link truncated in source])

**v0.71.0-preview.0**
- Changelog for v0.70.0-preview.0 ([#30361](https://github.com/google-gemini/gemini-cli/pull/30361))
- Version bump to `0.71.0-nightly.20261118.g615d6bc8c` ([#30366](https://github.com/google-gemini/gemini-cli/pull/30366))

**v0.70.0** (stable)
- Changelog rollups for v0.69.0-preview.0 ([#30222](https://github.com/google-gemini/gemini-cli/pull/30222)) and v0.68.0 ([#30224](https://github.com/google-gemini/gemini-cli/pull/30224))
- Nightly version bump to `0.70.0-nightly.20261110.g1603e9b`

The headline feature in this batch is the new **`/stats heatmap`** subcommand, giving developers a visual daily token-usage view directly in the CLI — a meaningful step toward cost observability.

---

## 3. Hot Issues

1. **[#21409 — Generalist agent hangs](https://github.com/google-gemini/gemini-cli/issues/21409)** `P1` · 8 comments · 👍 8
   The most upvoted open bug this cycle. The generalist agent hangs indefinitely on trivial operations (e.g., folder creation), with users reporting waits of up to an hour. Workaround: explicitly instruct the model not to defer to subagents. High community engagement signals broad impact.

2. **[#21968 — Gemini does not use skills and sub-agents enough](https://github.com/google-gemini/gemini-cli/issues/21968)** `P2` · 7 comments
   Anecdotal but widely relatable: the model rarely invokes custom skills/subagents autonomously, even when highly relevant. Matters because it undermines the entire skills investment.

3. **[#19873 — Zero-dependency OS sandboxing & post-execution intent routing](https://github.com/google-gemini/gemini-cli/issues/19873)** `P2` · 9 comments
   Maintainer-driven proposal to lean into Gemini 3's native bash affinity while keeping execution safe. The highest-comment issue in the batch and a strategic direction-setter.

4. **[#21983 — Browser subagent fails on Wayland](https://github.com/google-gemini/gemini-cli/issues/21983)** `P1` · 4 comments
   Browser agent terminates with `GOAL` termination reason on Wayland sessions. Linux desktop users remain blocked; needs retesting.

5. **[#22186 — get-shit-done output hook causes crash](https://github.com/google-gemini/gemini-cli/issues/22186)** `P1` · 3 comments
   Crash occurs during the final user-summary print of a hook. Reproducible-sounding and quota-wasting.

6. **[#20079 — Symlinked agent files not recognized](https://github.com/google-gemini/gemini-cli/issues/20079)** `P2` · 4 comments
   `~/.gemini/agents/*.md` symlinks fail agent discovery. A small but sharp DX papercut for dotfile-managed setups.

7. **[#21763 — Bug reports omit subagent context](https://github.com/google-gemini/gemini-cli/issues/21763)** `P1` · 2 comments
   `/bug` output only captures the main session, making subagent failures effectively undiagnosable. Compounds the pain of every other agent bug.

8. **[#17758 — Subagent resumability & persistence](https://github.com/google-gemini/gemini-cli/issues/17758)** `P2` · 3 comments · 👍 1
   Epic tracking cross-session subagent resumption. Foundational for long-running agent workflows.

9. **[#17754 — Async & background subagent execution](https://github.com/google-gemini/gemini-cli/issues/17754)** `P2` · 2 comments
   Enables non-blocking subagent runs — a prerequisite for parallel agent collaboration (#18287).

10. **[#18062 — Cloud Shell API error "Requested entity was not found"](https://github.com/google-gemini/gemini-cli/issues/18062)** `P2` · 2 comments
    Lab Account users hit API failures inside an environment where the CLI is actively promoted. Adoption-blocking for education/enterprise onboarding.

---

## 4. Key PR Progress

1. **[#30157 — Only replace true cycles with `[Circular]` in safeJsonStringify](https://github.com/google-gemini/gemini-cli/pull/30157)** `CLOSED` · `P2`
   Fixes false-positive cycle detection that corrupted telemetry, since OTel shares arrays (`endTime`, `boundaries`) across data points.

2. **[#30156 — Buffer chat compression events until OTel SDK ready](https://github.com/google-gemini/gemini-cli/pull/30156)** `CLOSED` · `P2`
   `logChatCompression` was the lone logger bypassing `bufferTelemetryEvent`, causing dropped events on early init.

3. **[#30334 — Parse PowerShell commands asynchronously to prevent UI freeze](https://github.com/google-gemini/gemini-cli/pull/30334)** `CLOSED` · `P2` · `size/xl`
   Eliminates multi-second spinner freezes on Windows during PowerShell AST validation. Large but high-impact UX fix.

4. **[#30376 — Expand Windows home-relative paths using tilde and backslash](https://github.com/google-gemini/gemini-cli/pull/30376)** `OPEN`
   Fixes `~\...` resolution on Windows, which previously broke policy paths, extension registries, and include dirs.

5. **[#30370 — Handle nested .gitignore negations under `dir/**` patterns](https://github.com/google-gemini/gemini-cli/pull/30370)** `CLOSED`
   Corrects `GitIgnoreParser` so re-included files (e.g., `logs/**` + `!keep.txt`) are respected.

6. **[#30368 — ACP: support closing sessions](https://github.com/google-gemini/gemini-cli/pull/30368)** `OPEN`
   Implements `session/close`, advertises the capability, and disposes session resources before process exit.

7. **[#30239 — Keep tier alias config when tier resolves to first model](https://github.com/google-gemini/gemini-cli/pull/30239)** `OPEN`
   Prevents `applyModelSelection` from dropping `generateContentConfig` for custom aliases on `flash-lite`/`flash`/`pro` tiers.

8. **[#30154 — Flush buffered stdio before entering ACP mode](https://github.com/google-gemini/gemini-cli/pull/30154)** `CLOSED`
   Hook warnings and stderr output were lost on SIGKILL/crash; now flushed before ACP entry.

9. **[#30375 — Fix broken internal docs links](https://github.com/google-gemini/gemini-cli/pull/30375)** `OPEN` · `P1`
   Repairs missing `.md` suffixes, absolute `/docs/` paths, and renamed anchors. Small change, but `P1`-tagged given doc-surface importance.

10. **[#30372 — Fix dead anchor in auto-memory docs](https://github.com/google-gemini/gemini-cli/pull/30372)** `OPEN`
    Points "skill discovery precedence" at the correct `#discovery-tiers` anchor in `skills.md`.

---

## 5. Hot Discussions

*No Discussion data was provided in the source dataset; this section is omitted.*

---

## 6. Feature Request Trends

Distilled from the issue set, the dominant directions are:

- **Subagent maturity (the overwhelming theme):** async/background execution ([#17754](https://github.com/google-gemini/gemini-cli/issues/17754)), resumability & persistence ([#17758](https://github.com/google-gemini/gemini-cli/issues/17758)), per-agent configurability of tools/policy/hooks/skills ([#17760](https://github.com/google-gemini/gemini-cli/issues/17760)), non-blocking tool confirmations ([#17756](https://github.com/google-gemini/gemini-cli/issues/17756)), UI/UX polish ([#17761](https://github.com/google-gemini/gemini-cli/issues/17761)), and shared memory / parallel collaboration ([#18287](https://github.com/google-gemini/gemini-cli/issues/18287)).
- **Native-bash-native agent design:** sandboxing plus post-execution intent routing to exploit Gemini 3's POSIX-tool affinity ([#19873](https://github.com/google-gemini/gemini-cli/issues/19873)).
- **Token-frugal context management:** "Tactful Extraction" surgical read hierarchy (grep-first) to combat context bloat ([#19561](https://github.com/google-gemini/gemini-cli/issues/19561)).
- **Persistent, file-based task tracking:** replacing in-context `WriteToDo` with CRUD-backed tracking to survive context rot and session boundaries ([#18836](https://github.com/google-gemini/gemini-cli/issues/18836), [#21000](https://github.com/google-gemini/gemini-cli/issues/21000)).
- **Agent self-awareness:** accurate knowledge of its own flags, hotkeys, and self-execution ([#21432](https://github.com/google-gemini/gemini-cli/issues/21432)).
- **Remote agent auth:** OAuth 2.0 Dynamic Client Registration for A2A agents ([#17604](https://github.com/google-gemini/gemini-cli/issues/17604)).
- **Per-workspace policy scoping** instead of global-only policy ([#18397](https://github.com/google-gemini/gemini-cli/issues/18397)).
- **Better agent examples in-repo** to seed the subagent ecosystem ([#18283](https://github.com/google-gemini/gemini-cli/issues/18283)).

---

## 7. Developer Pain Points

- **Subagent reliability and observability.** The cluster of P1 bugs — generalist agent hangs (#21409), browser agent Wayland failures (#21983), crash-on-hook-output (#22186), `codebase_investigator` schema-validation loops consuming quota (#17648), and bug reports that omit subagent context (#21763) — means users frequently cannot tell *why* an agent failed or even reproduce the failure. Quota waste during silent failure loops is a recurring complaint.
- **Under-triggering of skills/subagents.** Even when correctly configured, the model frequently ignores skills and subagents unless explicitly instructed (#21968), making the configurability investment feel unrewarded.
- **Windows and Linux desktop papercuts.** PowerShell parsing freezes (#30334), `~\` path resolution (#30376), and Wayland browser failures (#21983) form a persistent cross-platform tax.
- **Discovery/configuration friction.** Symlinked agent files aren't recognized (#20079), and there's no `settings.json`-based subagent discovery yet (#18285).
- **Environment-specific onboarding blockers.** Cloud Shell Lab Account API errors (#18062) hit users in an environment Google actively promotes, undercutting first-run success.
- **Context economics.** Baseline context cost (~36.6k tokens/turn) and large file-read bloat drive repeated calls for surgical read strategies (#19561) and persistent out-of-context task state (#18836).

---

*Generated from github.com/google-gemini/gemini-cli activity for 2026-11-20.*

</details>

<details>
<summary><strong>GitHub Copilot CLI</strong> — <a href="https://github.com/github/copilot-cli">github/copilot-cli</a></summary>

# GitHub Copilot CLI Community Digest — 2026-11-20

## 1. Today's Highlights

Two patch releases (`v1.0.115-0` / `v1.0.115-1`) landed, with the headline fix addressing MCP OAuth sign-in continuing when a server grants required scopes but omits an auto-requested refresh-token scope. The MCP authentication pipeline remains the dominant theme across issues, with multiple reports of silent failures, missing token exchange, and forced interactive re-auth despite cached refresh tokens. Community attention is also converging on context/memory management bugs (PDF token overcounting, 128K budget fallback) and terminal UX friction during long agent sessions.

## 2. Releases

**v1.0.115-1** (latest)
- **Fixed:** MCP sign-in can now continue when a server grants the required scopes but omits an automatically requested refresh-token scope.
- **Fixed:** Direct workflow execution now waits for project extension workflows to register.

**v1.0.115-0**
- General fixes and changes (release notes truncated).

---

## 3. Hot Issues

1. **[#4017](https://github.com/github/copilot-cli/issues/4017) [CLOSED]** — MCP OAuth in Copilot Desktop: non-first-party HTTP servers (Atlassian, incident.io) cancel host-token then never launch the deferred runtime browser flow. Result: no auth, no error, no popup. High engagement (8 comments, 👍3) reflects broad frustration with opaque MCP auth failures.

2. **[#4203](https://github.com/github/copilot-cli/issues/4203) [OPEN]** — Expired MCP access token forces interactive re-auth instead of using the cached refresh token per RFC 6749 §6. Highly upvoted (👍5) — directly impacts unattended/automation workflows.

3. **[#1168](https://github.com/github/copilot-cli/issues/1168) [OPEN]** — "Authorization fatigue": a single high-level request generated more than a dozen permission prompts. A long-running complaint (open since January) that keeps resurfacing.

4. **[#5283](https://github.com/github/copilot-cli/issues/5283) [OPEN, triage:needs-human]** — Remote environment hosting blocked by remote-control policy on personal Copilot Free accounts. Highest upvote count in this batch (👍6), signaling a policy/entitlement gap.

5. **[#5516](https://github.com/github/copilot-cli/issues/5516) [OPEN]** — `store_memory` offers `scope: "user"` even when user-level memory is unavailable; every user-scoped store fails with 404, and `/memory off` disables both scopes. New (filed 2026-11-19) but immediately relevant to memory-scope UX.

6. **[#5517](https://github.com/github/copilot-cli/issues/5517) [OPEN]** — Pasted PDF counted at encoded file size (~620k estimated vs ~31k real tokens), triggering unnecessary compaction. A 20x overestimate that wastes context budget — companion to the known image-counting issue #2936.

7. **[#4310](https://github.com/github/copilot-cli/issues/4310) [OPEN]** — Engine silently falls back to a hardcoded 128K token budget when a routed model reports no/zero capability limits, driving compaction incorrectly for 1M-token models.

8. **[#5350](https://github.com/github/copilot-cli/issues/5350) [CLOSED]** — MCP OAuth interactive flow: authorization code received and success page served, but code→token exchange never runs — server stuck "Connecting". Closed, but symptomatic of the auth-state-machine fragility seen across #4017, #4769, #4371.

9. **[#5510](https://github.com/github/copilot-cli/issues/5510) [OPEN]** — Linux/WSL: Entra MCP browser sign-in stalls silently when `xdg-open` is missing; `/mcp` Authenticate shows a URL that then fails with "State mismatch." Split out of #4017 by a maintainer.

10. **[#5501](https://github.com/github/copilot-cli/issues/5501) [OPEN]** — ACP integration: zero-turn sessions (empty or slash-command-only) never persist `events.jsonl`, causing `session/load` to fail with -32002 after client restart. Matters for Zed/ACP users relying on session persistence.

---

## 4. Key PR Progress

Only one PR was updated in the last 24h:

1. **[#2957](https://github.com/github/copilot-cli/pull/2957) [CLOSED]** — `fix: extension bootstrap path mismatch in launchExtension() (#2890)`. Extensions failed to load on macOS and Windows because the forked child's security check expects the bootstrap path under `dirname(process.execPath)` (SEA binary dir), while `app.js` passed a path from the pkg cache (`universal/<ver>/preloads/`). Closes a cross-platform extension-loading blocker.

*No other PRs were updated in the last 24 hours; the remaining recommended PR slots are empty for this window.*

---

## 5. Hot Discussions

No Discussions data was provided for this window — section omitted.

---

## 6. Feature Request Trends

Distilled from open issues:

- **Selective tool/sandbox control** — [#4298](https://github.com/github/copilot-cli/issues/4298): sandbox config in `settings.json` to selectively enable tools and whitelist bundled tools.
- **Session forking & parallel workflows** — [#4580](https://github.com/github/copilot-cli/issues/4580): `/fork` should open a new terminal, plus a `copilot --fork` startup flag.
- **Multiline diff comments** — [#5534](https://github.com/github/copilot-cli/issues/5534): `C`/`V` to select multiple lines for `/diff` comments instead of single-line `c`.
- **Reasoning display controls** — [#5531](https://github.com/github/copilot-cli/issues/5531): auto-collapse "Thought for…" blocks when thinking finishes; [#5532](https://github.com/github/copilot-cli/issues/5532): make `showReasoning` actually work for Gemini models.
- **Model transparency for agents** — [#2646](https://github.com/github/copilot-cli/issues/2646): show which LLM each custom agent uses in the UI.
- **Async boot / non-blocking startup** — [#5090](https://github.com/github/copilot-cli/issues/5090): MCP/plugin loading should not block the input line, especially in large repos.
- **Documentation clarity** — [#3983](https://github.com/github/copilot-cli/issues/3983): document default behavior of global `instructions.md` / `AGENTS.md` / `CLAUDE.md`.
- **Sandbox network allowances** — [#5507](https://github.com/github/copilot-cli/issues/5507): allow localhost TCP connections so backend integration tests can run inside the macOS sandbox.

---

## 7. Developer Pain Points

- **MCP OAuth is the #1 reliability gap.** A cluster of issues (#4017, #4203, #5350, #4769, #4371, #5510) describes silent failures, missing token exchange, redirect-metadata mismatch, unsupported URL elicitation for 3LO, and forced re-auth despite valid refresh tokens. Errors are frequently invisible — "no auth, no error, no popup" is a recurring phrase.
- **Permission/authorization fatigue** (#1168, #5283): excessive prompts per request and policy blocks on personal/free accounts impede flow.
- **Context budget mismanagement** (#5517, #4310, #4424): encoded-size counting for PDFs, silent 128K fallback, and `/compact` failing at the 5 MB CAPI limit can kill sessions outright.
- **Terminal UX during long sessions** (#5533, #3150, #5531): timeline jumps forward while scrolled up, diff panels push context off-screen, and reasoning blocks never collapse — all degrade review-before-approval workflows.
- **Platform-specific rough edges** (#4972, #3374, #4690, #5507): Windows MCP workers surviving exit, `$EDITOR=vim` backspace inserting `⌂`, long-path clone failures on Windows, and macOS sandbox blocking localhost test servers.
- **Silent degradation on config edge cases** (#2823, #5519, #5516): `effortLevel` reset on `/model` switch, BYOK breakage above v1.0.107, and user-scoped memory 404s all fail without actionable guidance.

</details>

<details>
<summary><strong>OpenCode</strong> — <a href="https://github.com/anomalyco/opencode">anomalyco/opencode</a></summary>

# OpenCode Community Digest — 2026-11-20

## 1. Today's Highlights

No new releases shipped in the last 24 hours, but issue and PR traffic remains heavy: a long-running clipboard bug (#4283) finally closed after 161 comments, and provider/model-identity issues dominate the bug queue. The most significant engineering work is landing in `core` around Claude Agent account rotation, session part storage, and tool-change handling mid-conversation.

## 2. Releases

No new releases in the last 24 hours.

## 3. Hot Issues

1. **[#4283] Copy To Clipboard is not working** — [CLOSED]
   https://github.com/anomalyco/opencode/issues/4283
   The most-commented issue in the set (161 comments, 135 👍) finally closed after a week of active reproduction. High community engagement signals this was a daily-workflow blocker for TUI users on v1.0.62.

2. **[#51209] Expose the V2 TUI composer to plugins** — [OPEN]
   https://github.com/anomalyco/opencode/issues/51209
   A regression from V1: plugins could append to the composer via `client.tui.appendPrompt(...)`, but V2 has no equivalent. This is a concrete plugin-ecosystem compatibility gap with steady +1s.

3. **[#42083] GitHub Copilot provider shows zero models** — [CLOSED]
   https://github.com/anomalyco/opencode/issues/42083
   `github-copilot` auth succeeds but no models surface because every entry returns `model_picker_enabled: false`. Closed, but representative of a broader class of provider-registration failures.

4. **[#64869] `edit` tool hangs indefinitely on one path in background service** — [OPEN]
   https://github.com/anomalyco/opencode/issues/64869
   Filed today with `status/repro-simulated`: `edit` stalls 30s–5min before writing on one file, while `write` and a `--standalone` server on the same path succeed instantly. A serious core reliability concern for long-running services.

5. **[#61072] Claude Agent plan limit drains ~1.8x faster due to `sdk-ts` label** — [CLOSED]
   https://github.com/anomalyco/opencode/issues/61072
   The Agent SDK sets `CLAUDE_CODE_ENTRYPOINT=sdk-ts`, causing requests to be billed against the 5-hour plan at a higher rate. Users noticed before the maintainers did — a real cost-impact bug.

6. **[#63785] Subagent "work in background" pattern causes hallucinated answers** — [OPEN]
   https://github.com/anomalyco/opencode/issues/63785
   When no independent work exists, the parent agent fabricates results while waiting for a subagent. This is an architectural prompt-design issue with model-behavior implications.

7. **[#51152] Per-project credential activation** — [OPEN]
   https://github.com/anomalyco/opencode/issues/51152
   Credential switching is global to the shared background server, so switching accounts in one project re-bills agents in unrelated projects. A privacy and cost concern with clear +1 support.

8. **[#38526] Improve shell command permission request UX** — [OPEN]
   https://github.com/anomalyco/opencode/issues/38526
   Long shell commands are displayed in full in the permission prompt, making them hard to review. A usability feature with 6 👍 — safety-adjacent and cheap to fix.

9. **[#64746] Claude Agent model list flips between `fable` and `claude-fable-5-2`** — [CLOSED]
   https://github.com/anomalyco/opencode/issues/64746
   Each rename drops the other ID, breaking in-flight sessions with "model not found." Closed today — and a companion fix PR (#65032) is already up.

10. **[#64967] OpenRouter Gemini 4 Argon emits runaway `}}}}...` closing braces** — [OPEN]
    https://github.com/anomalyco/opencode/issues/64967
    Hundreds of trailing braces pollute responses and break tool calls. An inference-layer bug specific to a new Gemini variant on OpenRouter.

## 4. Key PR Progress

1. **[#65035] Rotate between Claude accounts when one hits its usage limit** — https://github.com/anomalyco/opencode/pull/65035
   Extends `configDir` to accept a list of Claude config folders; a chat migrates to the next account on usage exhaustion. Builds on #62514. Directly addresses the Claude Agent cost pressure seen in #61072.

2. **[#62514] Add Claude Agent config control** — https://github.com/anomalyco/opencode/pull/62514
   Adds a `configDir` setting so the Claude Agent provider can point at a non-default config folder. Foundation for account rotation.

3. **[#65032] Keep every listed Claude model ID working when Claude Code renames a model** — https://github.com/anomalyco/opencode/pull/65032
   Closes #64746. Preserves all previously-listed IDs so sessions don't break on rename.

4. **[#65039] Write assistant parts as `session_part` rows by default** — https://github.com/anomalyco/opencode/pull/65039
   Flips `experimental.part_rows` on, persisting each streamed assistant part as its own row. A storage-model change worth watching for downstream tooling.

5. **[#63002] Signed-in browser pane with extensions, previews, and agent safeguards** — https://github.com/anomalyco/opencode/pull/63002
   Desktop feature: click a link in chat and open it in a signed-in pane; import cookies/sign-ins from Chrome, Edge, Firefox, Safari, and 11 others. Largest UX PR in the queue.

6. **[#64381] Send mid-conversation tool changes in place** — https://github.com/anomalyco/opencode/pull/64381
   When tools change mid-session (MCP connect/drop, plugin tool appears), the change is now transmitted in place rather than requiring a full re-declaration. Pairs with #65028.

7. **[#64867] Close overlapping reasoning blocks** — https://github.com/anomalyco/opencode/pull/64867
   Fixes "reasoning start before end" errors from Anthropic-compatible gateways (see #64792). The parser now folds overlapping thinking blocks.

8. **[#65003] Use models.dev's recommended API behind a flag** — https://github.com/anomalyco/opencode/pull/65003
   Adds a `recommended_api` flag so OpenCode selects the API a model recommends in models.dev, decoupling provider selection from hardcoded defaults.

9. **[#65031] Machine keys and one-use join strings** — https://github.com/anomalyco/opencode/pull/65031
   Core-only groundwork (behind the `machines` flag) for inviting another computer with a one-use join string. No callers yet — infrastructure for future multi-machine support.

10. **[#65034] Use `<system-update>` for instruction updates in every prompt** — https://github.com/anomalyco/opencode/pull/65034
    Unifies two different tags used for instruction updates. Small but reduces model-confusion surface.

## 5. Hot Discussions

No discussion data was provided for this digest.

## 6. Feature Request Trends

- **Plugin/TUI extensibility parity**: V2 needs to restore or replace V1 plugin capabilities (#51209), plus better install UX for skills (#64883).
- **Per-project and per-account isolation**: credential activation per folder (#51152), session ID lookup in the picker (#65023), and Claude account rotation (#65035) all point to a desire for finer-grained control over what runs where and under whose key.
- **Safer, clearer permission UX**: color-coded commands in the permission box (#55486) and better formatting of long shell commands (#38526).
- **Interactive/PTY tooling**: a native `pty` tool for REPLs, debuggers, and `psql`/`redis-cli` sessions (#65017).
- **Provider catalog completeness**: exposing GPT-6.2 Ultrafast for eligible ChatGPT Pro accounts (#64968) and reliable model listing for third-party providers (#42083).

## 7. Developer Pain Points

- **Provider/model identity instability**: model ID renames (#64746), model picker mismatches (#42083), and gateway-specific schema rejections (#63762, #64792) cause repeated session failures.
- **Silent cost drain**: plan limits consumed faster than expected (#61072), background sessions auto-resuming and spending tokens without input (#56032), and global credential switching re-billing unrelated projects (#51152).
- **Background service reliability**: `edit` hanging on a single path (#64869), subagent hallucinations when idle (#63785), and no way to disable session auto-resume (#56032) form a cluster of long-running-service complaints.
- **Model behavior noise**: runaway closing braces (#64967), "No response requested." shown as a reply (#64982), and skipped permission prompts on Windows PowerShell (#65008).
- **Free-tier quota confusion**: multiple reports (#65040, #65029, #64891) of daily free messages being exhausted without use — a recurring trust issue with the free tier.

</details>

<details>
<summary><strong>Pi</strong> — <a href="https://github.com/earendil-works/pi">earendil-works/pi</a></summary>

# Pi Community Digest — 2026-11-20

## 1. Today's Highlights

No new releases landed in the last 24 hours, but the issue tracker was extremely active: a 99-comment mega-thread on Windows usage patterns resurfaced, and the long-running XDG Base Directory compliance bug (#2870) finally closed with 75 upvotes. Terminal lifecycle bugs (SIGTSTP, mouse tracking leaks, stdout flushing on exit) dominated PR activity, with a cluster of fixes landing around suspend/resume and clean shutdown. Prompt-cache handling for OpenAI/Codex and GitHub Copilot models also drove several fixes and open proposals.

## 2. Releases

No new releases in the last 24 hours.

## 3. Hot Issues

1. **[#7547](https://github.com/earendil-works/pi/issues/7547) — [OPEN] How do you use Pi on Windows? (99 comments)** — A long-running community survey on Windows usage patterns (WSL, native, Windows Terminal, etc.). With 99 comments it's the most-discussed thread in the tracker, reflecting genuine uncertainty about which Windows paths are officially supported vs. delegated to extensions.
2. **[#2870](https://github.com/earendil-works/pi/issues/2870) — [CLOSED] Follow XDG Base Directory (75 👍)** — Finally resolved. Pi was cluttering `$HOME` on Linux instead of using `$XDG_CONFIG_HOME` / `$XDG_STATE_HOME`. The high upvote count signals broad Linux-user demand for standards compliance.
3. **[#9549](https://github.com/earendil-works/pi/issues/9549) — [OPEN][inprogress] Large transcripts re-render every frame (19 comments)** — On low-core Windows machines, large transcripts saturate a CPU core and re-emit the full transcript on every resize. Marked in-progress; a major performance concern for long sessions.
4. **[#11026](https://github.com/earendil-works/pi/issues/11026) — [OPEN][durable] Permanently delete a conversation (8 👍)** — Requests `harness.deleteConversation(id, ctx)` for pi-durable, including refusal while a run is active. Highlights a growing demand for durable-storage lifecycle management.
5. **[#12273](https://github.com/earendil-works/pi/issues/12273) — [CLOSED] GPT-6.2 Sol reports lower prompt-cache reuse than 6.1** — Reports ~8.8k extra uncached tokens per warm turn on `openai-codex`. Closed, but indicative of caching regressions as new models ship.
6. **[#12318](https://github.com/earendil-works/pi/issues/12318) — [CLOSED] Anthropic `/login` fails on Claude Team/Enterprise ("Unknown scope")** — OAuth scope rejection before the consent screen blocks Team/Enterprise seats entirely. High-impact auth regression for corporate users.
7. **[#12133](https://github.com/earendil-works/pi/issues/12133) / [#12272](https://github.com/earendil-works/pi/issues/12272) — [CLOSED] Terminal left with mouse/Kitty input reporting enabled after exit** — After stopping or `SIGTSTP`, the shell floods with SGR mouse reports. Two related reports closed in the same window, showing a coordinated cleanup effort.
8. **[#11006](https://github.com/earendil-works/pi/issues/11006) — [OPEN] Copilot enterprise models hidden after restart** — `availableModelIds` is cached and not refreshed until token expiry, so newly enabled models stay invisible. A clear UX trap for enterprise admin workflows.
9. **[#12282](https://github.com/earendil-works/pi/issues/12282) — [CLOSED] llama.cpp decision classifiers ignore advertised image input** — `toPiClassifierModel()` hardcoded `input: ["text"]`, rejecting images even when llama.cpp reports `image` in `architecture.input_modalities`. Closed with a fix PR.
10. **[#12286](https://github.com/earendil-works/pi/issues/12286) — [CLOSED] `openai-responses`: omitting `strict` makes Copilot models fill optional args** — Non-strict schemas on Copilot cause every optional property to come back populated (`""`, `0`, etc.). A subtle but high-impact correctness bug for tool callers.

## 4. Key PR Progress

1. **[#12339](https://github.com/earendil-works/pi/pull/12339) — [CLOSED] Keep SIGTSTP listener tied to terminal ownership** — Follow-up to #12283; fixes three edge cases in when `TuiBase` subscribes to SIGTSTP.
2. **[#12283](https://github.com/earendil-works/pi/pull/12283) — [CLOSED] Handle external SIGTSTP like Ctrl+Z** — `kill -TSTP <pid>` now restores the terminal via the same path as Ctrl+Z. Fixes #12272.
3. **[#12336](https://github.com/earendil-works/pi/pull/12336) — [CLOSED] Flush stdout before exiting after TUI stop** — Prevents losing mouse-tracking/focus/Kitty-keyboard disable sequences on `process.exit()`.
4. **[#12335](https://github.com/earendil-works/pi/pull/12335) — [CLOSED] Send images to llama.cpp decision classifiers** — Fixes #12282 by honoring `architecture.input_modalities` when registering classifier models.
5. **[#12329](https://github.com/earendil-works/pi/pull/12329) — [CLOSED] Send `strict` on GitHub Copilot Responses tools** — Fixes #12286 by filling the missing `supportsStrictMode` flag for 18 Copilot Responses models.
6. **[#12332](https://github.com/earendil-works/pi/pull/12332) — [CLOSED] Send strict tools to Claude on GitHub Copilot** — Companion to #12329; extends strict-mode support to Copilot-hosted Claude models.
7. **[#12246](https://github.com/earendil-works/pi/pull/12246) — [CLOSED] `/login` and `/logout` search selects the best match** — Fixes #12245 where scrolling before typing left the highlight on the wrong row.
8. **[#12278](https://github.com/earendil-works/pi/pull/12278) — [OPEN] Refresh scoped models on interactive reload** — Makes `/reload` pick up `enabledModels` changes without restarting. Fixes #12277.
9. **[#12319](https://github.com/earendil-works/pi/pull/12319) — [OPEN] Make Codex system prompts cacheable** — Moves the system prompt out of top-level `instructions` so it falls inside GPT-6.2's cacheable input prefix. Directly addresses the cache-reuse regression in #12273.
10. **[#12325](https://github.com/earendil-works/pi/pull/12325) — [OPEN] Keep GitHub Copilot's available models up to date** — Refreshes `availableModelIds` on model refresh, not just token refresh. Fixes #11006.

## 5. Hot Discussions

**Show and tell**
- **[#12331](https://github.com/earendil-works/pi/discussions/12331) — Pi-Personal: an always-on personal agent on pi** — One pi session per agent kept alive in Herdr Core, reachable via Telegram, with plain-file message passing and ~5,216 lines of glue. A concrete example of using pi as an embedded agent runtime.

**Ideas**
- **[#12320](https://github.com/earendil-works/pi/discussions/12320) — Reusing free chat quotas through a WebDriver** — Speculative proposal to drive free chat web UIs via WebDriver as AI backends for editors. Explicitly noted as unrelated to Pi core, but generating interest.
- **[#12314](https://github.com/earendil-works/pi/discussions/12314) — Rename `codemode`** — Report that models (e.g., DeepSeek V4.1-Flash) frequently hallucinate `codemod`/`codemodule` instead of `codemode`, suggesting a more distinctive tool name.

## 6. Feature Request Trends

- **Storage lifecycle management** — [#11026](https://github.com/earendil-works/pi/issues/11026) (hard-delete conversations) and [#12306](https://github.com/earendil-works/pi/issues/12306) (hold restored work while admitting new requests) show users pushing pi-durable beyond simple persistence toward operational control.
- **Package/namespace composition** — [#8834](https://github.com/earendil-works/pi/issues/8834) proposed an opt-in `pi.namespace` for skills and prompt templates, hinting at a desire for stronger namespacing as the extension ecosystem grows.
- **Editor/IDE integration via ACP** — [#10389](https://github.com/earendil-works/pi/issues/10389) asked for an ACP adapter for Pi Durable, targeting JetBrains IDEs.
- **Cache-preserving session mutations** — [#12269](https://github.com/earendil-works/pi/issues/12269) requests that changing thinking level mid-conversation not break the prompt cache on `openai-codex`.
- **Extension UI affordances** — [#12326](https://github.com/earendil-works/pi/issues/12326) asks for a display-only gutter on sent user messages, indicating demand for finer-grained TUI customization.

## 7. Developer Pain Points

- **Windows is a second-class citizen** — The 99-comment [#7547](https://github.com/earendil-works/pi/issues/7547) thread plus #9549 (re-render saturation on 2-core Windows) and #12133 (mouse reports leaking after exit on Windows Terminal) show persistent friction across setup, performance, and terminal state on Windows.
- **Terminal state not restored on exit/suspend** — A cluster of issues (#12133, #12272, #12338) and PRs (#12283, #12336, #12339) all trace to Pi leaving mouse tracking, Kitty keyboard protocol, or bracketed paste enabled. This is the single most concentrated bug theme today.
- **Prompt-cache regressions on new models** — #12273 (GPT-6.2 vs 6.1 on Codex) and #12269 (thinking-level changes break caching) show caching is fragile across model/provider updates and directly affects token cost.
- **Enterprise/Copilot auth and model visibility** — #12318 (Anthropic Team seat login fails) and #11006 (Copilot enterprise models hidden after restart) both hit corporate users specifically, pointing to stale credential/metadata handling.
- **Catalog drift** — #12259 (missing `qwen4-max`/`qwen4-max-preview` in the Individual plan allowlist) and #12264 (OpenAI Decisions classifying cache usage as zero) suggest provider metadata is manually curated and easily falls behind upstream changes.
- **TUI input/selection correctness** — #12245 (search picks wrong provider) and #12312 (Enter on an absolute-path Tab menu submits the prompt) reflect a class of small but annoying TUI interaction bugs that erode trust during daily use.

</details>

<details>
<summary><strong>Qwen Code</strong> — <a href="https://github.com/QwenLM/qwen-code">QwenLM/qwen-code</a></summary>

# Qwen Code Community Digest — 2026-11-20

## 1. Today's Highlights

CI reliability dominates the activity this cycle: the `Managed Agent` full tier has been chronically red on `main` since at least 2026-11-11 ([#17851](https://github.com/QwenLM/qwen-code/issues/17851)), while a security-sensitive trust bypass in AUTO mode ([#17854](https://github.com/QwenLM/qwen-code/issues/17854)) and a token-accounting bug that can kill a turn after auto-compaction ([#15486](https://github.com/QwenLM/qwen-code/issues/15486)) are the most consequential open bugs. On the feature side, work continues on managed-channel identity binding, MCP elicitation, and skill-level MCP dependency surfacing.

## 2. Releases

No new releases in the last 24 hours.

## 3. Hot Issues

1. **[#14724](https://github.com/QwenLM/qwen-code/issues/14724) — Main CI failed: Managed Agent gate, no test identified (484 comments).** A bot-filed CI failure that has become the single most-commented issue in the repo. Its volume reflects repeated re-triggers rather than distinct problems, but it's a strong signal that the Managed Agent gate is unstable and noisy.

2. **[#15486](https://github.com/QwenLM/qwen-code/issues/15486) — Compaction double-counts pending tool result, pads 20K, sends `max_tokens: 1` (P1).** A correctness bug in the token-management path with a clear repro: after auto-compaction mid-tool-loop, the next request's size estimate counts a pending tool result twice, aborting the turn. High impact for long agent sessions.

3. **[#17854](https://github.com/QwenLM/qwen-code/issues/17854) — AUTO mode: server-level MCP trust bypasses the LLM classifier (P1, security).** A structural design gap: tools added *after* a trusted MCP server was approved execute with zero review. This is the most important security thread right now since it undermines the AUTO-mode threat model.

4. **[#17037](https://github.com/QwenLM/qwen-code/issues/17037) — hz3 `/tmp` out of inodes; leftover verify work trees hold 92% of tmpfs (P1).** Runner infrastructure is failing jobs *before* they start. This is an ops-level blocker for contributors landing on the hz3 host.

5. **[#17851](https://github.com/QwenLM/qwen-code/issues/17851) — Managed Agent full tier chronically red; Hosted failover E2E `runtime_preparation_timeout` (P1).** Confirmed red on `main` independent of any PR since ≥2026-11-11, which means required-check gating is effectively meaningless for that scope.

6. **[#17039](https://github.com/QwenLM/qwen-code/issues/17039) — Make the Managed Agent gate name stable so it can become a required check (P1).** Directly tied to #17851's root cause: an unstable gate name let a PR merge with a red Java suite.

7. **[#17832](https://github.com/QwenLM/qwen-code/issues/17832) — MCP server still connecting is reported as failed; late-arriving tools never reach the model.** A user-visible correctness issue in the daemon/VS Code companion: a server that connects 20s later is labeled failed, and its tools never surface.

8. **[#17188](https://github.com/QwenLM/qwen-code/issues/17188) — DeepSeek V3.1/V3.2 fall back to the generic output limit.** Model-id normalization misses the bundled catalog's 65,536-token entries, silently capping output at 32K.

9. **[#17628](https://github.com/QwenLM/qwen-code/issues/17628) — CLI command migration can overwrite a newly created Markdown file.** A check-then-write race with data-loss potential, plus a dangling-symlink hole.

10. **[#17859](https://github.com/QwenLM/qwen-code/issues/17859) — Web Shell: iOS Safari keyboard covers Send on welcome screen.** A concrete mobile UX regression with a clean repro; representative of the growing set of Web Shell client polish issues.

## 4. Key PR Progress

1. **[#17775](https://github.com/QwenLM/qwen-code/pull/17775) — Bind the GitHub ledger to its registration identity.** Mirrors the WeCom/DingTalk adapter pattern, closing a cross-ownership pending-replay class of bugs in managed channels.

2. **[#17894](https://github.com/QwenLM/qwen-code/pull/17894) — Keep what the person typed in a reduced compaction request.** Fixes a real UX defect where user prompts were truncated to 4,000 chars during compaction-window reduction.

3. **[#17875](https://github.com/QwenLM/qwen-code/pull/17875) — Protect persisted tool-output recovery.** Extends microcompaction protection to producer-attached recovery metadata, complementing #17337's stub-detection work.

4. **[#17323](https://github.com/QwenLM/qwen-code/pull/17323) — Surface unconfigured MCP dependencies at skill activation.** Lets `SKILL.md` declare `mcp:` dependencies and reports missing ones with remediation at activation time — a nice usability win for skill authors.

5. **[#17358](https://github.com/QwenLM/qwen-code/pull/17358) — Declare MCP elicitation capability + protocol-level decline handler.** Protocol-completeness work that unblocks servers relying on `elicitation/create`.

6. **[#17458](https://github.com/QwenLM/qwen-code/pull/17458) — Reject `record_artifact` on files inside skipped artifact directories.** Closes a visibility gap where ignored files could reappear in the Artifacts panel.

7. **[#17677](https://github.com/QwenLM/qwen-code/pull/17677) — Daemon restart recovery inbox.** Adds `POST /sessions/recovery` endpoints so unsettled prompts can be listed and resumed after a daemon restart — meaningful durability for long-running sessions.

8. **[#17864](https://github.com/QwenLM/qwen-code/pull/17864) / [#17871](https://github.com/QwenLM/qwen-code/pull/17871) — Converge pre-production managed-agent version machinery.** Removes rolling-upgrade compatibility scaffolding and advances the files-on-v2 lifecycle; large but well-scoped cleanup.

9. **[#17890](https://github.com/QwenLM/qwen-code/pull/17890) — Deliver pending async hook output on the ACP legacy round.** Closes the last model-round surface that silently dropped background hook output.

10. **[#17533](https://github.com/QwenLM/qwen-code/pull/17533) — Web Shell worktree carry metadata + snapshot-then-delete cleanup.** Advances Codex-parity for managed session worktrees, recording dirty overlays carried in from the source tree.

## 5. Hot Discussions

No Discussions data was provided for this cycle; this section is omitted.

## 6. Feature Request Trends

- **Session management & recovery:** Daemon restart recovery ([#17677](https://github.com/QwenLM/qwen-code/pull/17677)), agent-loop follow-ups ([#17284](https://github.com/QwenLM/qwen-code/issues/17284)), and session-management roadmap work dominate feature-shaped activity.
- **Managed channel integrations:** Repeated deferred follow-ups across DingTalk, GitHub, and WeCom adapters ([#17769](https://github.com/QwenLM/qwen-code/issues/17769), [#17813](https://github.com/QwenLM/qwen-code/issues/17813), [#17775](https://github.com/QwenLM/qwen-code/pull/17775)) indicate managed-agent card/channel breadth is the active expansion front.
- **MCP capability depth:** Elicitation, skill-declared MCP dependencies, and trust-model refinements ([#17358](https://github.com/QwenLM/qwen-code/pull/17358), [#17323](https://github.com/QwenLM/qwen-code/pull/17323), [#17854](https://github.com/QwenLM/qwen-code/issues/17854)) are converging into a coherent MCP roadmap.
- **Permission/interaction protocol:** [#17715](https://github.com/QwenLM/qwen-code/issues/17715) asks for uninspectable permission subjects to be a first-class protocol state rather than a layout accident — a sign that interactive permission UX is maturing.
- **Configuration surfaces:** [#14507](https://github.com/QwenLM/qwen-code/issues/14507) (closed) asked for a supported way to enable LSP in the Desktop client without CLI flags — the recurring "expose experimental features via settings" theme.

## 7. Developer Pain Points

- **Chronically red CI on `main`:** Issues [#17851](https://github.com/QwenLM/qwen-code/issues/17851), [#17039](https://github.com/QwenLM/qwen-code/issues/17039), [#14724](https://github.com/QwenLM/qwen-code/issues/14724), and [#11680](https://github.com/QwenLM/qwen-code/issues/11680) all point to the same root frustration: failures merge past unstable gates, then every subsequent PR inherits them. The 484-comment CI issue is the clearest evidence of bot-noise fatigue.
- **Flaky tests generating issue churn:** [#17834](https://github.com/QwenLM/qwen-code/issues/17834), [#17884](https://github.com/QwenLM/qwen-code/issues/17884), [#17791](https://github.com/QwenLM/qwen-code/issues/17791), and [#16531](https://github.com/QwenLM/qwen-code/issues/16531) show a steady stream of deflake work, often with the reviewer bot explicitly warning "if it fails again it's a real bug, do NOT stabilize."
- **Token/compaction correctness:** [#15486](https://github.com/QwenLM/qwen-code/issues/15486) and [#17337](https://github.com/QwenLM/qwen-code/issues/17337) reflect a pattern of subtle accounting errors in the compaction path that are hard to reproduce but silently degrade long sessions.
- **Model-catalog normalization gaps:** [#17188](https://github.com/QwenLM/qwen-code/issues/17188) and [#17189](https://github.com/QwenLM/qwen-code/issues/17189) reveal that model-id parsing drops vendor prefixes and vision flags, quietly misconfiguring limits and inputs for third-party models.
- **MCP lifecycle ambiguity:** [#17832](https://github.com/QwenLM/qwen-code/issues/17832) captures a recurring class of confusion where "still connecting" is indistinguishable from "failed" to the user.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*