# OpenClaw Ecosystem Digest 2026-11-28

> Issues: 354 | PRs: 500 | Projects covered: 5 | Generated: 2026-11-28 03:13 UTC

- [OpenClaw](https://github.com/openclaw/openclaw)
- [Hermes Agent](https://github.com/nousresearch/hermes-agent)
- [IronClaw](https://github.com/nearai/ironclaw)
- [QwenPaw](https://github.com/agentscope-ai/QwenPaw)
- [ZeroClaw](https://github.com/zeroclaw-labs/zeroclaw)

---

## OpenClaw Deep Dive

# OpenClaw Project Digest — 2026-11-28

## 1. Today's Overview

OpenClaw remains in a high-velocity release cadence: 354 issues and 500 PRs were touched in the last 24 hours, with a healthy 40% issue closure rate (140/354) and 46% PR merge/close rate (228/500), indicating active triage rather than pure backlog accumulation. A new beta release (v2026.12.1-beta.1) shipped with prepared-release updates and prompt-cache reuse for compaction. However, the project is carrying a heavy P0/P1 stability load — memory growth, SQLite corruption, session-state deadlocks, and update-path failures dominate the top-commented issues. The update system itself is in active redesign (issue #204775), which is expected to be the highest-leverage fix for the current release-friction cluster. Overall project health: **active and productive, but with elevated regression pressure in gateway lifecycle and session management**.

---

## 2. Releases

**v2026.12.1-beta.1** — [Release](https://github.com/openclaw/openclaw/releases)

- **Updates:** Git installations now use prepared releases and a resident launcher; package updates prepare without stopping the serving Gateway (#203194, #203497, thanks @obviyus).
- **Prompt caching:** Compaction reuses the warm prompt cache across routes in read-only mode.

**Migration/compatibility notes:** No explicit breaking changes announced. The update-path redesign is still in flight — users on managed npm installs should watch for the doctor/candidate-validation conflicts reported in #200606 and #157332 before upgrading. Given the open P0s around update locking (#207139 PR in progress), beta users should expect occasional preparation-lock contention.

---

## 3. Project Progress

Today's merged/closed work is dominated by test-suite consolidation and maintenance refactors by @vincentkoc, plus targeted UX fixes:

- **Test/coverage cleanup (merged/closed):** #207152 (loader proof + rollback coverage), #207167 (CI check for Plugin SDK export surface — closed after catching an unbudgeted export), #207159 (reuse active config for local inference), #207151 (dismiss inbox mentions immediately).
- **UX fixes advancing:** #207044 (cron reports no longer suppressed on unchanged days), #207173 (cold chats open with latest 24 messages), #207158 (Discord long Markdown tables render before splitting), #207157 (macOS window drag from headers).
- **Update-path reliability:** #207139 (preserve preparation lock ownership) is open and awaiting author — directly addresses the update-lock races behind several P1s.
- **Closed issues worth noting:** #200606 (doctor blocks update with plugin migration conflict — closed), #202213 (compressed session archive read failure — closed), #114612 (SQLite unbounded memory table growth — closed as stale/dedupe).

The volume of "no product behavior change" refactor PRs suggests maintainers are deliberately buying down test debt before the 2026.12 stable line.

---

## 4. Community Hot Topics

1. **[#204775](https://github.com/openclaw/openclaw/issues/204775)** — *Design: prepared-release updates (state, ownership and plan)* — 57 comments. The single most-discussed item. The community is coalescing around a shared design doc for the update path to stop contributors colliding on the same files. **Underlying need:** contributors want a stable contract for the update state machine; users want updates that don't take the Gateway offline.

2. **[#178359](https://github.com/openclaw/openclaw/issues/178359)** — *doctor --fix --non-interactive idles 15+ min* — 33 comments. A long-running P1 hang in repair preparation. **Need:** reliable non-interactive repair for CI/automation users.

3. **[#192547](https://github.com/openclaw/openclaw/issues/192547)** — *Reduce Gateway startup memory on constrained ARM64* — 30 comments. Ties directly to today's #207169 PR ("use less memory when loading model catalog"). **Need:** runnable on 1 GiB ARM64 hosts (Raspberry Pi-class).

4. **[#153426](https://github.com/openclaw/openclaw/issues/153426)** — *Curated memory roots silently excluded by provenance ratchet* — 28 comments, 3 👍. A P0 security/UX issue where `MEMORY.md`/`USER.md` can be permanently dropped from bootstrap. **Need:** diagnosability and recovery paths for memory provenance.

5. **[#205333](https://github.com/openclaw/openclaw/pull/205333)** — *Let authorized orchestrators resume blocked goals* — active PR closing #203683. Multi-agent orchestration users want explicit resume semantics.

---

## 5. Bugs & Stability

Ranked by severity (P0/P1 first):

| Severity | Issue | Status | Fix PR? |
|---|---|---|---|
| P0 | [#153426](https://github.com/openclaw/openclaw/issues/153426) — memory roots permanently excluded from bootstrap | Closed (needs security review) | No |
| P0 | [#126821](https://github.com/openclaw/openclaw/issues/126821) — SQLite corruption recurs within 15–24h on WSL2; "paralyzed gateway" mode | Open | No |
| P0 | [#152275](https://github.com/openclaw/openclaw/issues/152275) — post-commit plugin activation failure disables model catalog + reply dispatch | Open | No |
| P0 | [#194664](https://github.com/openclaw/openclaw/issues/194664) — Codex protected continuation blocks all follow-ups | Open | No |
| P0 | [#188563](https://github.com/openclaw/openclaw/issues/188563) — macOS recovery fails moving LaunchAgent to Trash (EPERM) | Open | No |
| P0 | [#141443](https://github.com/openclaw/openclaw/issues/141443) — Linux AppImage blank window on CachyOS Wayland | Open | No |
| P1 | [#178359](https://github.com/openclaw/openclaw/issues/178359) — doctor --fix hangs 15+ min | Open | No |
| P1 | [#181432](https://github.com/openclaw/openclaw/issues/181432) — ~1.9 GB baseline RSS + SQLite timeouts | Open | Partially (#207169) |
| P1 | [#195497](https://github.com/openclaw/openclaw/issues/195497) — gateway memory grows to ~3 GB in 17h | Open | No |
| P1 | [#206669](https://github.com/openclaw/openclaw/issues/206669) — Windows SQLite integrity worker keeps process alive 300s/db | Open | No |
| P1 | [#205566](https://github.com/openclaw/openclaw/issues/205566) — 360s watchdog aborts pre-flight compaction on long sessions | Open | No |
| P1 | [#202518](https://github.com/openclaw/openclaw/issues/202518) — claude-cli run never closes after sessions_spawn/yield | Open | No |

**Pattern:** memory growth/leaks (#181432, #195497, #192547) and session-lifecycle deadlocks (#202518, #194403, #194664) are the two dominant regression clusters. The memory cluster now has active mitigation work (#207169), but the session-lifecycle cluster has no linked fix PRs — this is the highest-risk gap.

---

## 6. Feature Requests & Roadmap Signals

- **[#204701](https://github.com/openclaw/openclaw/issues/204701)** — Configurable git timeout + table-level exclusions for `backup git create` (hardcoded 120s causes scheduled backup failures). *Likely next patch: small, well-scoped.*
- **[#130247](https://github.com/openclaw/openclaw/issues/130247)** — Cron jobs cannot end (no `--until`/`--max-runs`, no cumulative run counter). *Moderate likelihood; scheduler ergonomics are getting attention.*
- **[#113159](https://github.com/openclaw/openclaw/issues/113159)** — Usage-limit cooldown ignores real reset time for non-OpenAI providers. *Likely; multi-provider auth is a hot area.*
- **[#167341](https://github.com/openclaw/openclaw/issues/167341)** — Operator-overridable copy for classified model-request failures. *Low-medium.*
- **[#167177](https://github.com/openclaw/openclaw/issues/167177)** — Configurable CLI live-session capacity (closed today; may resurface).

**Prediction:** The 2026.12.x line will likely prioritize update-path reliability (#204775 design), memory reduction (#192547/#207169), and session-resume semantics (#205333) over new surface features. Configurability requests (backup timeouts, cron end conditions) are cheap wins likely to land in patch releases.

---

## 7. User Feedback Summary

**Pain points:**
- **Update friction is the #1 theme.** Users report doctor hangs (#178359), candidate-validation conflicts (#200606), canary deadline failures (#157332), and offline-update failures (#158373). The redesign in #204775 is a direct response.
- **Memory bloat on constrained hardware.** ARM64 users see 300 MB → 1.9 GB jumps (#181432) and 3 GB growth in 17h (#195497); 1 GiB hosts OOM before first model response (#192547).
- **Session state fragility.** Codex/Claude CLI users hit dead sessions that block follow-ups (#194664, #202518, #194403), and long sessions get aborted by the 360s watchdog (#205566).
- **Multi-agent/multi-channel edge cases.** Transcript echo per bot account (#146311), child sessions missing third-party MCP tools (#149406), and profile-pinned auth (#158144).

**Satisfaction signals:** Users are clearly running OpenClaw in production (multi-agent, 13 cron jobs, Feishu/Telegram/Discord channels) and filing detailed, reproducible reports — a sign of engaged, invested users. The 3 👍 on #153426 and 2 👍 on #79223/#151766 suggest small but earnest demand for memory and localization fixes. Dissatisfaction concentrates on **reliability of updates and long-running sessions**, not on core capability.

---

## 8. Backlog Watch

Long-unanswered or high-impact items needing maintainer attention:

- **[#112638](https://github.com/openclaw/openclaw/issues/112638)** (since 2026-07-22) — `session.maintenance enforce` doesn't bound the store; thread/channel entries exempt from reclaim. Open, 14 comments, no fix PR. **Silent disk-growth risk.**
- **[#127195](https://github.com/openclaw/openclaw/issues/127195)** (since 2026-08-21) — 16 call sites emit identical "changed while starting work" error with no reason code. Diagnosability blocker for production triage.
- **[#104068](https://github.com/openclaw/openclaw/issues/104068)** (since 2026-07-11) — Profile-qualified agent-to-agent routing for separate gateway profiles. Closed as stale, but the multi-gateway topology need persists.
- **[#114612](https://github.com/openclaw/openclaw/issues/114612)** (since 2026-07-27) — Closed as stale/dedupe, but SQLite retention policy for `memory_index_chunks`/`memory_embedding_cache` remains unresolved and is a long-term disk-fill risk.
- **[#158144](https://github.com/openclaw/openclaw/issues/158144)** (since 2026-09-25) — claude-cli session pinned to weekly-limited profile; needs security review. No fix PR.
- **[#205333](https://github.com/openclaw/openclaw/pull/205333)** (open PR, XL) — orchestrator goal-resume; large and needs proof. High user value but merge-risk.

**Recommendation:** The maintenance-enforcement gap (#112638) and the error-diagnosability gap (#127195) are the two backlog items most likely to cause silent production failures; both have clear fix shapes and would benefit from maintainer prioritization.

---

*Data source: github.com/openclaw/openclaw — activity window 2026-11-27 to 2026-11-28. All links point to the referenced issue/PR.*

---

## Cross-Ecosystem Comparison

# Cross-Project Comparison Report — AI Agent & Personal Assistant Open-Source Ecosystem
**Snapshot date:** 2026-11-28 | **Projects covered:** OpenClaw, Hermes Agent, IronClaw, QwenPaw, ZeroClaw

---

## 1. Ecosystem Overview

The personal AI assistant / agent open-source landscape is in a **high-velocity but regression-heavy** phase. Every active project in this snapshot is shipping continuously — four of five report 24h activity — yet the dominant themes are stability debt (memory growth, session lifecycle deadlocks, update-path fragility), not new capability. The ecosystem is consolidating around a common architectural shape: a gateway/daemon process, plugin/channel adapters, multi-provider LLM routing, and skill/memory subsystems. Differentiation is increasingly in *operational quality* (update reliability, resource footprint, multi-agent orchestration) rather than in headline features. Enterprise adoption is visibly emerging (QwenPaw's third-party Platform-Worker, ZeroClaw's Kubernetes operators), and upstream platform churn (Google's Gemini OAuth retirement) is forcing provider-continuity work across the board. The overall verdict: **healthy, engaged, production-grade communities — but maintainer review throughput and regression pressure are the binding constraints.**

---

## 2. Activity Comparison

| Project | Issues (24h) | PRs (24h) | Merge/Close Rate | Release Status | Health Score (1–10) | One-line Verdict |
|---|---|---|---|---|---|---|
| **OpenClaw** | 354 touched (140 closed, 40%) | 500 touched (228 closed/merged, 46%) | High | **v2026.12.1-beta.1 shipped** | **8.0** | Active & productive; elevated regression pressure in gateway/session lifecycle |
| **Hermes Agent** | 50 touched (3 closed) | 50 touched (6 merged/closed) | Moderate | None (latest v0.23.4) | **7.0** | Healthy maintenance; accumulating regressions from recent changes |
| **QwenPaw** | 11 touched (3 closed) | 25 touched (7 merged/closed) | Moderate | None | **7.0** | Stabilization sprint; regression from #8785 under active repair |
| **ZeroClaw** | 11 touched (**0 closed**) | 44 touched (**0 merged/closed**) | **Zero** | None (0.9.0 on master) | **5.5** | High activity, **merge-constrained**; review bottleneck |
| **IronClaw** | 0 | 0 | N/A | None | **N/A** | No activity in 24h window |

**Reading the table:** OpenClaw operates at ~7–10× the issue/PR volume of its nearest peer and is the only project converting activity into releases *and* closures at scale. ZeroClaw is the outlier risk case: 44 PRs touched with zero merges is a textbook review-capacity signature. Health scores weight closure throughput, release cadence, and severity of open P0/P1 load — not raw activity.

---

## 3. OpenClaw's Position

**Advantages vs peers:**
- **Scale and throughput.** 354 issues / 500 PRs in 24h with 40–46% closure rates — an order of magnitude above Hermes, QwenPaw, and ZeroClaw. This is the only project in the set demonstrating *sustained triage at volume*, not just intake.
- **Release cadence.** The only project to ship a release in the window (v2026.12.1-beta.1), with prepared-release updates and prompt-cache reuse for compaction — operational maturity peers haven't reached.
- **Explicit design governance.** The #204775 prepared-release update design doc (57 comments) shows a community coalescing around a shared state-machine contract — rare discipline for a project this size.
- **Ecosystem reference status.** The digest itself designates OpenClaw as "core reference," and its issue taxonomy (P0/P1 with fix-PR linkage) is the most rigorous in the set.

**Technical approach differences:**
- **Resident launcher + prepared releases** for git installs; updates prepare without stopping the serving Gateway — a zero-downtime update model none of the peers document.
- **Prompt-cache reuse across compaction routes** in read-only mode — cost-optimization at the inference layer that peers (Hermes' compression bugs, QwenPaw's context injection) are still fighting at the correctness layer.
- **Plugin SDK export-surface CI checks** (#207167) — supply-chain discipline beyond what peers show.
- **Compaction/session-state architecture** is more ambitious but correspondingly more fragile: the session-lifecycle deadlock cluster (#202518, #194664, #194403) has **no linked fix PRs**, which is the single highest-risk gap in its digest.

**Community size comparison:** OpenClaw's 24h touch volume implies a contributor base roughly 7–10× Hermes/ZeroClaw and 20×+ QwenPaw. Hermes shows the most *sophisticated* reporting (precise HEAD hashes, errno codes, reproduction steps); ZeroClaw shows the most *production-realistic* reporting (Kubernetes incident patterns); QwenPaw shows the most *enterprise-intent* signals. OpenClaw's community is largest but its feedback skews toward update friction and long-session reliability — i.e., users running it hard in production.

---

## 4. Shared Technical Focus Areas

Requirements emerging across multiple projects:

| Need | Projects | Specific Evidence |
|---|---|---|
| **Update-path reliability / zero-downtime updates** | OpenClaw, Hermes | OpenClaw #204775 design (57 comments), #207139 lock ownership; Hermes P1 #158449 (paused gateways after `hermes update`), #160877 (force-installed webapp kills dashboard) |
| **Memory growth / resource footprint on constrained hardware** | OpenClaw, Hermes | OpenClaw #181432 (1.9 GB RSS), #195497 (3 GB in 17h), #192547 (1 GiB ARM64 OOM), #207169 mitigation; Hermes #89732 (iGPU 50–69%), #150518 (macOS GIL freeze) |
| **Session lifecycle / deadlock correctness** | OpenClaw, Hermes, QwenPaw | OpenClaw #202518/#194664/#194403 (no fix PRs); Hermes #159238/#158684 (compression role-typed message bugs); QwenPaw #8954/#8903 (Code Mode ContextVar leakage) |
| **Compaction / context-handling correctness** | OpenClaw, Hermes | OpenClaw prompt-cache reuse in compaction; Hermes two distinct P2 compression bugs (#158684, #159238) tied to role-typed messages |
| **MCP resilience & graceful degradation** | ZeroClaw, Hermes | ZeroClaw S1 #12766/#12767 (MCP outage → probe restart loop → tool-less agent with green health); Hermes #160718 (`/reload-mcp` fails if one server down) |
| **Multi-agent orchestration semantics** | OpenClaw, Hermes, QwenPaw | OpenClaw #205333 (orchestrator goal-resume, XL PR); Hermes #136703 (delegation busy-result mode), #80280 (Kanban orphaned worker process groups); QwenPaw #8954 (subagent ContextVar leak) |
| **Provider continuity under upstream churn** | ZeroClaw, OpenClaw, Hermes | ZeroClaw #12669 (Gemini OAuth retirement — forced migration); OpenClaw #113159 (usage-limit cooldown ignores real reset); Hermes #160979 (Anthropic OAuth usage treated as fraction not percentage) |
| **Channel resilience / self-healing** | QwenPaw, ZeroClaw, OpenClaw | QwenPaw #8962 (QQ reconnect supervisor exits permanently); ZeroClaw #12773 (Lark/Feishu silent config corruption); OpenClaw multi-channel edge cases (#146311 transcript echo, #149406 missing MCP tools) |
| **Diagnosability / structured error codes** | OpenClaw, ZeroClaw | OpenClaw #127195 (16 call sites emit identical error, no reason code); ZeroClaw #11005 (stable RPC denial reasons — 2 months in flight) |
| **Autonomy safety gates** | Hermes, QwenPaw | Hermes #136931/#71266 (skill self-improvement regression risk, validation-gated SkillOpt); QwenPaw #8955 (governance rules not configurable) |

**Cross-cutting takeaway:** The two needs that appear in *every* active project and lack complete fixes are **(a) session/compaction correctness** and **(b) resource footprint on constrained hardware**. These are the ecosystem's shared technical debt.

---

## 5. Differentiation Analysis

| Dimension | OpenClaw | Hermes Agent | QwenPaw | ZeroClaw |
|---|---|---|---|---|
| **Primary focus** | Core reference runtime; update/session reliability at scale | Multi-agent orchestration + skill learning + desktop UX | Console UX + channel reliability + enterprise extension | Provider coverage + MCP resilience + desktop computer-use |
| **Target users** | Production power users, multi-agent/multi-channel operators | Multi-agent orchestration users, long-session workloads | Enterprise deployers, Console-centric users | Kubernetes operators, self-hosted production deployments |
| **Architecture signal** | Resident launcher, prepared releases, Plugin SDK export CI, prompt-cache compaction | Plugin-host test refactor, platform decoupling (WeCom/DingTalk/Weixin → Labs/official plugins), skill-sleep/SkillOpt | DoomLoopGate, Code Mode toolkit, governance interception layers, Creator App | MCP bundles, gateway health probes, feature-flagged macOS computer_use, provider slots |
| **Notable strength** | Throughput + design governance + release cadence | Sophisticated community reporting; safety-gate discourse (#136931) | Enterprise adoption signal (#8959 Platform-Worker upstream request) | Production-realistic incident reporting; security-conscious PRs (#12744 argv binding) |
| **Notable weakness** | Session-lifecycle deadlock cluster with no fix PRs | Accumulated regressions from recent changes (compression, desktop UI, update path) | Regressions from #8785; Code Mode abstraction needs rework | **Zero merges in 24h**; growing open-PR queue |
| **Update model** | Zero-downtime prepared releases | Fragile (P1 #158449) | Not highlighted | Not highlighted |

**Key architectural divergence:** OpenClaw bets on **zero-downtime update infrastructure** as a first-class product concern; Hermes bets on **autonomy safety** (gated skill learning); QwenPaw bets on **console UX + governance configurability**; ZeroClaw bets on **protocol-level durability** (MCP, provider churn, desktop control). These are complementary, not competing, bets — which is why the shared-needs table above is long.

---

## 6. Community Momentum & Maturity

**Activity tiers:**

- **Tier 1 — Scale operator:** **OpenClaw** (~850 issue/PR touches/24h, release shipped, 40–46% closure). Rapidly iterating *and* shipping. Maturity signal: design docs, CI export checks, "buy down test debt" refactors before stable line.
- **Tier 2 — Active maintainers:** **Hermes Agent** (100 touches, 6 merges), **QwenPaw** (36 touches, 7 merges). Both are **stabilizing** — Hermes is fighting regressions from recent changes; QwenPaw is in an explicit stabilization sprint (three "stabilize chat" PRs in one day). QwenPaw shows the strongest *enterprise-intent* signal.
- **Tier 3 — Merge-constrained:** **ZeroClaw** (55 touches, **0 merges**). High contribution quality, high activity, but **review throughput is the single biggest project-health risk** in this dataset. It is iterating rapidly on intake while failing to convert to throughput.
- **Tier 4 — Dormant in window:** **IronClaw** (no activity in 24h). Insufficient data to assess; treat as a coverage gap, not a verdict.

**Maturity assessment:** OpenClaw is the most mature operationally (release discipline, design governance). Hermes has the most sophisticated *community* (precise repros, paired fix PRs) but the most accumulated regression debt. QwenPaw is the most *enterprise-ready* in intent but carrying a fresh regression (#8956 from #8785). ZeroClaw is the most *production-realistic* in feedback but the least *maintainer-responsive* in this window.

---

## 7. Trend Signals

Extracted from cross-project community feedback — highest value for AI agent developers:

1. **Updates are the new reliability frontier.** Both OpenClaw and Hermes report update-path failures as top pain points. Users expect zero-downtime, self-healing updates. **Actionable:** design an update state machine with explicit ownership/locking *before* scaling contributor count — OpenClaw's #204775 is the reference pattern.

2. **Constrained-hardware operation is a market segment, not a niche.** 1 GiB ARM64 (Raspberry Pi-class) and Linux/AMD iGPU users are filing detailed, reproducible reports. **Actionable:** treat memory footprint as a first-class SLA; OpenClaw's #207169 and Hermes' #89732/#150518 are the failure modes to design against.

3. **Session lifecycle deadlocks are the highest-risk unfixed gap.** OpenClaw's session-lifecycle cluster has no fix PRs; Hermes' compression bugs and QwenPaw's Code Mode ContextVar leaks are the same class of bug. **Actionable:** invest in session-state invariants and structured error codes (OpenClaw #127195, ZeroClaw #11005) early.

4. **MCP resilience under orchestration is operationally dangerous.** ZeroClaw's Kubernetes incident pattern (MCP outage → probe restart → tool-less agent with green health) is the most alarming single finding in the dataset. **Actionable:** decouple liveness probes from MCP connectivity; implement graceful degradation to "tool-less but healthy" states.

5. **Autonomy safety gates are the maturing-product ask.** Hermes' community is now requesting *validation-gated* skill self-improvement (#136931, #71266) — users want autonomy with regression protection. **Actionable:** build staged/validated learning loops (SkillOpt-style) rather than open-ended self-modification.

6. **Provider continuity is forced, not optional.** Google's Gemini OAuth retirement (#12669) is driving migration work; multi-provider auth bugs (OpenClaw #113159, Hermes #160979) are recurring. **Actionable:** abstract provider auth behind a versioned adapter layer; expect upstream churn as a design input.

7. **Enterprise upstreaming demand is real.** QwenPaw's third-party Platform-Worker (#8959) asking how to upstream signals a gap in **general extension interfaces**. **Actionable:** publish extension/plugin API contracts before enterprise forks diverge.

8. **Review throughput, not contribution volume, is the ecosystem bottleneck.** ZeroClaw's 44 PRs / 0 merges is the clearest signal. **Actionable:** for maintainers, invest in triage automation and reviewer rotation; for contributors, expect longer review latency in merge-constrained projects.

---

*Report compiled from 2026-11-28 community digests. Health scores are analyst judgments weighting closure throughput, release cadence, and open P0/P1 severity — not raw activity volume. IronClaw excluded from comparative scoring due to zero activity in the window.*

---

## Peer Project Reports

<details>
<summary><strong>Hermes Agent</strong> — <a href="https://github.com/nousresearch/hermes-agent">nousresearch/hermes-agent</a></summary>

# Hermes Agent — Project Digest
**Date:** 2026-11-28 | **Repo:** [github.com/NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent)

---

## 1. Today's Overview

Hermes Agent remains in a high-velocity maintenance phase: **50 issues** and **50 PRs** were updated in the last 24h, with **3 issues closed** and **6 PRs merged/closed**. No new releases shipped today, so all attention is on the open backlog (47 active issues, 44 open PRs). Activity is dominated by bug fixes around sessions, compression, gateway fallback logic, and a multi-round refactor moving platform integrations (WeCom, DingTalk, Weixin) out of core into Hermes Labs/official plugins. The signal-to-noise ratio is healthy — most top issues are P2 with concrete reproduction steps and linked fix PRs — but a cluster of long-lived P2 bugs (GPU usage, orphaned worker process groups, gateway fallback stickiness) indicates accumulated technical debt in the desktop and gateway layers.

---

## 2. Releases

**None.** No new releases in the last 24h. The most recent version referenced across issues is **v0.23.4** (`8fc0374447`), with v0.23.2 and v0.22.5 also appearing in recent bug reports.

---

## 3. Project Progress

Merged/closed activity today was light (6 PRs), with the substantive merged work consisting of:

- **[PR #160971] test(plugins): split plugin host tests into focused suites** — [CLOSED](https://github.com/NousResearch/hermes-agent/pull/160971). Refactors a 1,982-line monolithic test file into three focused suites plus a shared support module. Improves testability of the plugin host.

Closed issues today:
- **[#147564] Hermes Cloud: all outbound TCP refused (Errno 111)** — [CLOSED](https://github.com/NousResearch/hermes-agent/issues/147564). Cloud instance auth/Telegram unreachability; resolved.
- **[#94714] `hermes sessions browse` exits on arrow keys** — [CLOSED](https://github.com/NousResearch/hermes-agent/issues/94714). TUI cursor navigation bug fixed.
- **[#91005] Verified local cold archive for soft-archived sessions** — [CLOSED](https://github.com/NousResearch/hermes-agent/issues/91005). Addresses unbounded `state.db` growth (1.42 GB / 682 sessions observed).

**Feature/refactor work advancing (open but actively iterated):**
- **WeCom → Hermes Labs plugin migration** ([PR #159649](https://github.com/NousResearch/hermes-agent/pull/159649), round 18) and **DingTalk** ([PR #159638](https://github.com/NousResearch/hermes-agent/pull/159638), round 18) — both now handle env-only homes without incorrectly fetching Labs code.
- **Weixin → official default-installed plugin** ([PR #159644](https://github.com/NousResearch/hermes-agent/pull/159644)) — moves personal WeChat integration out of core.

---

## 4. Community Hot Topics

| Item | Type | Comments | Link |
|---|---|---|---|
| Desktop ambient animations hold iGPU at 50–69% (Linux + AMD) | Issue #89732 | 9 | [link](https://github.com/NousResearch/hermes-agent/issues/89732) |
| Skill self-improvement can regress good workflows | Issue #136931 | 8 | [link](https://github.com/NousResearch/hermes-agent/issues/136931) |
| `project bind-board` leaves board `project_id` unset | Issue #91169 | 6 | [link](https://github.com/NousResearch/hermes-agent/issues/91169) |
| Kanban timed-out workers leave descendant process groups alive | Issue #80280 | 6 (👍1) | [link](https://github.com/NousResearch/hermes-agent/issues/80280) |
| Hermes Cloud outbound TCP refused (Errno 111) | Issue #147564 | 5 | [link](https://github.com/NousResearch/hermes-agent/issues/147564) |

**Underlying needs analysis:**
- **Resource efficiency on Linux/AMD** (#89732): The ambient animation cost is a *platform-parity* complaint — Linux users on integrated GPUs are effectively excluded from a smooth desktop experience. This is a P2 `cause/fallout` bug, suggesting it emerged as a side effect of a prior UI change.
- **Skill self-improvement quality** (#136931): Users value autonomous skill learning but fear *regression* — a successful one-off workaround becoming a durable (and wrong) rule. This reflects a maturing product where the community is now asking for **safety gates around autonomy**, not just the feature itself.
- **Process isolation in Kanban workers** (#80280): A concurrency-safety issue where stale and replacement workers mutate the same worktree. This is a correctness/reliability concern in the multi-agent orchestration layer.

---

## 5. Bugs & Stability

Ranked by severity (all P2 unless noted):

| Severity | Bug | Fix PR? |
|---|---|---|
| **P1** | [PR #158449] Failed dependency sync leaves paused gateways stopped after `hermes update` | ✅ Fix PR open |
| **P2** | [#158684] Compaction sends role-typed tool messages to summarizer endpoints that reject them → every pass falls back to main model | ✅ [PR #159387](https://github.com/NousResearch/hermes-agent/pull/159387) open |
| **P2** | [#160841] Gateway cold start pays one full idle Telegram long-poll window per profile, serially (45.8s boot, 4 bots) | ❌ None |
| **P2** | [#160945] Cron agent sessions never receive external memory provider tools (honcho_*) | ❌ None |
| **P2** | [#150518] Gateway freezes for minutes on macOS: housekeeping `gc.collect()` holds GIL on large heap | ❌ None |
| **P2** | [#148857] Session stays on failed last fallback instead of retrying recovered earlier fallbacks | ❌ None |
| **P2** | [#160718] `/reload-mcp` fails entirely when one MCP server is down | ❌ None |
| **P2** | [#160938] Plugin-only dependency pins never advance; uv.lock silently reverts upgrades | ❌ None |
| **P2** | [#159238] Worker session compression aborts: tool rows carry a `name` key the handoff rejects | ❌ None |
| **P2** | [#160909] Dashboard cron edit form reverts concurrent changes (no optimistic-concurrency check) | ❌ None |
| **P3** | [#160941] Docker boot reconciliation crashes on valid-but-wrong-shape `gateway_state.json` | ✅ [PR #160942](https://github.com/NousResearch/hermes-agent/pull/160942) open |
| **P3** | [#160877] Latest update force-installs configured "webapp", kills dashboard | ❌ None |
| **P3** | [#160886] Kanban allows `complete` on a card whose latest review is `changes_requested` | ❌ None |

**Regression watch:** #89732 (desktop animation fallout), #158684 (compression change `54a95b679c`), and #160938 (env-generation lock inheritance) are all labeled `cause/fallout` — indicating recent changes introduced these regressions. Compression is a recurring theme: **two distinct P2 compression bugs** (#158684, #159238) surfaced this week, both tied to role-typed message handling.

**Notable fix PRs opened today:**
- [#160984](https://github.com/NousResearch/hermes-agent/pull/160984) — Kanban pid-less claim no longer charges the breaker.
- [#160972](https://github.com/NousResearch/hermes-agent/pull/160972) — Shell hooks capped at 1 MiB (one hook pushed agent to 53.7 GB).
- [#160979](https://github.com/NousResearch/hermes-agent/pull/160979) — Anthropic OAuth usage treated as percentage, not fraction.
- [#160975](https://github.com/NousResearch/hermes-agent/pull/160975) — Termux bionic Python libpython loading fix.

---

## 6. Feature Requests & Roadmap Signals

Most-requested / highest-signal features:

1. **Skill self-improvement safety** — [#136931](https://github.com/NousResearch/hermes-agent/issues/136931) (durable lessons vs. temporary fixes) and **[#71266](https://github.com/NousResearch/hermes-agent/issues/71266) Native skill-sleep** (validation-gated staged self-improvement, SkillOpt methodology). These two together strongly signal a **gated/validated skill-learning roadmap item**.
2. **Hot-reload plugins** — [#54941](https://github.com/NousResearch/hermes-agent/issues/54941) `/reload-plugins` without starting a new session.
3. **Delegation mid-turn handling** — [#136703](https://github.com/NousResearch/hermes-agent/issues/136703) `delegation.busy_result_mode` (queue|steer).
4. **Multi-tenant Memory OS** — [#28226](https://github.com/NousResearch/hermes-agent/issues/28226) acceptance layer with diagnostics and isolation tests.
5. **Desktop UX polish** — [#88512](https://github.com/NousResearch/hermes-agent/issues/88512) skin-driven wordmark, [#160948](https://github.com/NousResearch/hermes-agent/issues/160948) attach session-log excerpts as context chips.

**Prediction:** The next minor version is likely to include the **plugin-catalog expansions** (sourcebook [#160939](https://github.com/NousResearch/hermes-agent/pull/160939), Model Router v0.17.0 [#160943](https://github.com/NousResearch/hermes-agent/pull/160943)) and the **platform decoupling refactor** (WeCom/DingTalk/Weixin) since these are already in multi-round review. Skill-sleep (#71266) is marked `needs-decision` and likely a longer-horizon item.

---

## 7. User Feedback Summary

**Pain points (dissatisfaction):**
- **Platform resource cost** — Linux/AMD desktop users report sustained 50–69% iGPU usage from ambient animations (#89732), a smoothness/accessibility regression.
- **Boot latency** — Multiplexed gateway with 4 Telegram bots takes 45.8s to cold start (#160841); serial long-poll windows are the culprit.
- **Update fragility** — Two separate update-path complaints: dependency sync failure leaves gateways stopped (#158449, P1) and the latest update force-enabled a gated webapp, breaking the dashboard (#160877).
- **Silent data loss** — Desktop discards unsaved Files-pane edits on reload/quit without warning (addressed by [PR #160976](https://github.com/NousResearch/hermes-agent/pull/160976), Cowork-inspired).
- **Memory provider gaps** — Cron agent sessions miss Honcho tools despite the provider registering (#160945).

**Use cases & satisfaction:**
- Users clearly rely on Hermes for **multi-agent orchestration** (Kanban, delegation, subagents), **long-running sessions** (state.db growth to 1.42 GB), and **cloud/self-hosted deployments**. The community is sophisticated — reporting precise HEAD hashes, errno codes, and reproduction steps — and generally constructive, with many issues paired to fix PRs. The strongest dissatisfaction centers on **regressions in recent changes** rather than missing features.

---

## 8. Backlog Watch

Long-lived, high-importance items needing maintainer attention:

| Age | Item | Status | Link |
|---|---|---|---|
| Since 2026-08-06 | [#80280] Kanban orphaned worker process groups (👍1) | Open, no fix PR | [link](https://github.com/NousResearch/hermes-agent/issues/80280) |
| Since 2026-08-19 | [#89732] Desktop iGPU 50–69% sustained | Open, 9 comments, no fix PR | [link](https://github.com/NousResearch/hermes-agent/issues/89732) |
| Since 2026-08-20 | [#91169] `project bind-board` leaves `project_id` unset | Open, no fix PR | [link](https://github.com/NousResearch/hermes-agent/issues/91169) |
| Since 2026-05-18 | [#28226] Multi-tenant Memory OS acceptance layer | Open, stale | [link](https://github.com/NousResearch/hermes-agent/issues/28226) |
| Since 2026-06-29 | [#54941] `/reload-plugins` hot-reload | Open, stale | [link](https://github.com/NousResearch/hermes-agent/issues/54941) |
| Since 2026-07-25 | [#71266] Native skill-sleep (SkillOpt) | Open, `needs-decision` | [link](https://github.com/NousResearch/hermes-agent/issues/71266) |
| Since 2026-11-07 | [#150518] macOS gateway GIL freeze for minutes | Open, no fix PR | [link](https://github.com/NousResearch/hermes-agent/issues/150518) |

**Assessment:** The project is **healthy and actively maintained** — high engagement, rapid triage, and fix PRs accompanying most new P2 bugs. The primary risk is **accumulated regressions from recent changes** (compression, desktop UI, update path) and a handful of **P2 stability issues in the gateway/desktop layers that lack fix PRs** (#150518, #160841, #148857). Maintainers should prioritize: (1) the P1 update regression (#158449), (2) the macOS gateway GIL freeze (#150518), and (3) triaging the stale-but-important Memory OS and skill-sleep roadmap items that have sat for months.

</details>

<details>
<summary><strong>IronClaw</strong> — <a href="https://github.com/nearai/ironclaw">nearai/ironclaw</a></summary>

No activity in the last 24 hours.

</details>

<details>
<summary><strong>QwenPaw</strong> — <a href="https://github.com/agentscope-ai/QwenPaw">agentscope-ai/QwenPaw</a></summary>

# QwenPaw Project Digest — 2026-11-28

## 1. Today's Overview

QwenPaw shows **high-velocity maintenance activity** on 2026-11-28, with 11 issues updated (8 open/active, 3 closed) and 25 PRs touched (18 open, 7 merged/closed) in the last 24 hours. No new releases were cut, but the pipeline is dense with small-to-medium fixes: console UX polish, channel reliability, cron API repair, and several Creator App test/JSON-handling fixes. Activity skews toward **stabilization** rather than feature delivery, with a notable cluster of bug reports around Code Mode sessions, cron endpoints, and QQ channel reconnection. The project appears healthy but is carrying some regressions from the recent `#8785` merge (Creator App Tests red on main), which maintainers are actively addressing.

---

## 2. Releases

No new releases in the last 24 hours. *(Latest releases section is empty.)*

---

## 3. Project Progress

Merged/closed PRs today advanced several fronts:

- **[#8713](https://github.com/agentscope-ai/QwenPaw/pull/8713)** (CLOSED, size/L) — `fix(loop): record every tool call appended during a reply so the doom-loop gate can fire`. This closes a long-standing gap where `DoomLoopGate` never triggered despite being enabled by default. Directly fixes [#8712](https://github.com/agentscope-ai/QwenPaw/issues/8712).
- **[#8951](https://github.com/agentscope-ai/QwenPaw/pull/8951)** (CLOSED, size/L) — Console chat navigation/scroll/steer timestamp stabilization.
- **[#8952](https://github.com/agentscope-ai/QwenPaw/pull/8952)** (CLOSED, size/L) — Relay interrupted recovery and shutdown handling (follow-up to #8950).
- **[#8953](https://github.com/agentscope-ai/QwenPaw/pull/8953)** (CLOSED, size/M) — Console chat history pagination and scrolling stability.
- **Issues closed:** [#8712](https://github.com/agentscope-ai/QwenPaw/issues/8712) (doom-loop), [#8941](https://github.com/agentscope-ai/QwenPaw/issues/8941) (Windows plugin-install test failures), [#8744](https://github.com/agentscope-ai/QwenPaw/issues/8744) (console compressed-history entry point request).

The console frontend received the most merged work, with three "stabilize chat" PRs landing in one day — a sign of concentrated UX hardening.

---

## 4. Community Hot Topics

Ranked by comment count and reactions:

| Rank | Item | Comments | 👍 | Link |
|------|------|----------|----|------|
| 1 | #8845 Console: markdown tables overflow bubble | 5 | 1 | [Issue #8845](https://github.com/agentscope-ai/QwenPaw/issues/8845) |
| 2 | #8956 Creator App Tests red since #8785 | 4 | 0 | [Issue #8956](https://github.com/agentscope-ai/QwenPaw/issues/8956) |
| 3 | #8962 QQ channel reconnect supervisor exits | 3 | 0 | [Issue #8962](https://github.com/agentscope-ai/QwenPaw/issues/8962) |
| 4 | #8959 Enterprise Platform-Worker review request | 2 | 1 | [Issue #8959](https://github.com/agentscope-ai/QwenPaw/issues/8959) |
| 5 | #8903 Code Mode `run_tool_batch` fails | 2 | 0 | [Issue #8903](https://github.com/agentscope-ai/QwenPaw/issues/8903) |

**Underlying needs:**
- **Rendering fidelity** (#8845): Users rely on markdown tables in assistant output; the overflow-without-scroll bug makes tabular data unusable in Console. This is a pure frontend CSS/scroll fix.
- **Test-suite reliability** (#8956): A shared recovery budget change in #8785 introduced an identity-based give-up check that breaks on fresh exception objects — maintainers need determinism in the recovery loop.
- **Channel resilience** (#8962): QQ websocket cleanup errors permanently kill reconnection. Users need self-healing channel supervisors, not just one-shot fixes.
- **Enterprise upstreaming** (#8959): A third party has built a full enterprise Platform-Worker on `v2.2.2.post1` and is asking how to upstream. This signals real production adoption and a potential extension-API gap.
- **Code Mode isolation** (#8903, #8954): Code Mode seams are leaking state between parent/child sessions — a design-level concern about ContextVar propagation.

---

## 5. Bugs & Stability

Ranked by severity:

**🔴 Critical**
- **[#8960](https://github.com/agentscope-ai/QwenPaw/issues/8960)** — Cron REST API returns 500 on all routes (`GET/POST /crons/jobs`, `DELETE /crons/jobs/{id}`). Root cause: `_get_default_cron_mgr` references non-existent `mam._workspaces`. **Fix PR exists:** [#8965](https://github.com/agentscope-ai/QwenPaw/pull/8965).
- **[#8956](https://github.com/agentscope-ai/QwenPaw/issues/8956)** — Creator App Tests red on `main` since #8785; shared recovery budget re-runs forced terminal step, causing extra provider calls. **Fix PR exists:** [#8957](https://github.com/agentscope-ai/QwenPaw/pull/8957).

**🟠 High**
- **[#8954](https://github.com/agentscope-ai/QwenPaw/issues/8954)** — Spawning a subagent from a Code Mode session leaks parent's `_execution_toolkit` ContextVar; every `run_code` in child fails with `ToolNotFoundError`. No fix PR yet.
- **[#8903](https://github.com/agentscope-ai/QwenPaw/issues/8903)** — Code Mode `run_tool_batch` invocation fails because toolkit only exposes `run_code`. No fix PR yet.
- **[#8962](https://github.com/agentscope-ai/QwenPaw/issues/8962)** — QQ channel reconnect supervisor exits permanently after websocket cleanup error. **Fix PR exists:** [#8963](https://github.com/agentscope-ai/QwenPaw/pull/8963).

**🟡 Medium**
- **[#8845](https://github.com/agentscope-ai/QwenPaw/issues/8845)** — Markdown table overflow in Console; text selectable but columns invisible. No fix PR yet.
- **[#8712](https://github.com/agentscope-ai/QwenPaw/issues/8712)** (CLOSED) — Doom-loop gate never fired; one `Bash` call approved 14 times. Resolved by #8713.

**Regression note:** #8956 is explicitly a regression introduced by #8785 (merged 2026-11-26), now under active repair.

---

## 6. Feature Requests & Roadmap Signals

- **[#8955](https://github.com/agentscope-ai/QwenPaw/issues/8955)** — Governance builtin rules cannot be configured or disabled; two independent interception layers (tool_guard vs. governance) confuse users. Likely candidate for **unified security config in 2.4.x**.
- **[#8744](https://github.com/agentscope-ai/QwenPaw/issues/8744)** (CLOSED) — Console lacks an entry to view compressed/archived history rounds; users interpret this as lost history. Closed today, but the underlying need (archive visibility) may resurface as a UX feature.
- **[#8959](https://github.com/agentscope-ai/QwenPaw/issues/8959)** — Enterprise Platform-Worker upstream integration + request for **general extension interfaces**. Signals demand for plugin/extension API expansion.
- **[#8719](https://github.com/agentscope-ai/QwenPaw/pull/8719)** (OPEN, size/XXXL) — `QWENPAW_BASE_PATH` runtime base-path deployment for reverse-proxy prefixes. Large feature still under review.

**Prediction:** The next release will likely emphasize code-mode isolation fixes, cron API repair, and governance config unification — all grounded in fresh, high-severity reports.

---

## 7. User Feedback Summary

**Pain points:**
- *Console rendering*: Tables overflow invisibly; single-tilde incorrectly parsed as strikethrough (fix in [#8961](https://github.com/agentscope-ai/QwenPaw/pull/8961)) — users see corrupted output like `600~1500 t/s` losing the `~`.
- *Code Mode fragility*: Two independent reports (#8903, #8954) show Code Mode's toolkit wiring breaks both direct `run_tool_batch` calls and subagent spawning — a strong signal the abstraction needs rework.
- *Cron unusability*: All cron endpoints 500 — scheduling is effectively offline for affected users.
- *Channel recovery*: QQ users lose the bot permanently after transient websocket errors.
- *Test friction on Windows*: [#8941](https://github.com/agentscope-ai/QwenPaw/issues/8941) (CLOSED) documented 12 plugin-install test failures on Windows (symlink privilege, slow init, venv PIDs) — contributors on Windows had no green baseline.

**Satisfaction signals:** Enterprise deployment (#8959) shows production-grade usage at `v2.2.2.post1`. The doom-loop fix (#8713) closes a complaint open since 2026-11-13, indicating maintainers do resolve long-tail issues.

---

## 8. Backlog Watch

Items needing maintainer attention (older or high-impact, still open):

- **[PR #7211](https://github.com/agentscope-ai/QwenPaw/pull/7211)** — `fix(runtime): prevent injected context from persisting`. Open since **2026-08-21** (~3 months), size/L, marked `ready-for-human-review`. This addresses a correctness issue where `HookContext.inject_context()` leaks system reminders into durable conversation storage. Longest-pending substantive PR in the queue.
- **[PR #8719](https://github.com/agentscope-ai/QwenPaw/pull/8719)** — `feat(console): support runtime base-path deployment`, open since 2026-11-13, size/XXXL, Under Review. Large surface area; needs maintainer bandwidth.
- **[Issue #8954](https://github.com/agentscope-ai/QwenPaw/issues/8954)** and **[Issue #8903](https://github.com/agentscope-ai/QwenPaw/issues/8903)** — Code Mode state-leakage bugs, both without fix PRs; likely need a coordinated design decision on ContextVar scoping.
- **[Issue #8845](https://github.com/agentscope-ai/QwenPaw/issues/8845)** — Console table overflow; 5 comments, 1 👍, no fix PR. A small CSS/scroll fix that would close an active UX complaint.

---

*Digest generated from GitHub activity data for 2026-11-28. All links point to `github.com/agentscope-ai/QwenPaw`.*

</details>

<details>
<summary><strong>ZeroClaw</strong> — <a href="https://github.com/zeroclaw-labs/zeroclaw">zeroclaw-labs/zeroclaw</a></summary>

# ZeroClaw Project Digest — 2026-11-28

## 1. Today's Overview

ZeroClaw shows **high-velocity but zero-throughput activity** on 2026-11-28: 44 PRs and 11 issues were updated in the last 24 hours, yet **0 PRs were merged or closed and 0 issues were closed**. This is a classic "review bottleneck" signature — contributors are actively pushing work (9 of 11 issues and 20+ PRs were freshly created or updated on 2026-11-27/28), but maintainer-side merge/close activity is absent from this snapshot. The issue mix skews toward **stability and integration hardening**: two S1 workflow-blocking bugs (OpenRouter tool-result image loss, Lark/Feishu quickstart config corruption), a cluster of MCP startup/health-probe reliability bugs from a single Kubernetes operator, and a Gemini provider modernization tracker driven by Google's OAuth retirement. Feature work continues on desktop computer-use (#11015, #12776), browser voice for OIDC (#12459), and a new Buzz channel request (#12765), indicating the project is broadening both provider coverage and channel surface area while paying down protocol-level debt.

## 2. Releases

**None.** No new releases in the last 24h; latest activity references `master` at `d4a5d2afd` (0.9.0) and first observations on v0.8.7. No migration notes applicable today.

## 3. Project Progress

**No PRs were merged or closed today**, so no features formally landed. However, several in-flight PRs advanced through review/update cycles, indicating near-term delivery candidates:

- **#12780** — `fix(providers): deliver declared OpenRouter tool-result images across chat paths` (fixes #12774, an S1 blocker). [Link](https://github.com/zeroclaw-labs/zeroclaw/pull/12780)
- **#12781** — `fix(providers): pair damaged tool results with the remaining call` (recovery hardening, depends on #12704/#12188). [Link](https://github.com/zeroclaw-labs/zeroclaw/pull/12781)
- **#12779** — `fix(gateway): validate on-disk config before admin reload` (prevents acknowledging invalid configs). [Link](https://github.com/zeroclaw-labs/zeroclaw/pull/12779)
- **#12776** — `feat(tools): feature-flagged macOS computer_use tool + OpenRouter tool-result image delivery` (XL, advances #11015 tracker). [Link](https://github.com/zeroclaw-labs/zeroclaw/pull/12776)
- **#12775 / #12761 / #12755** — memory/SQLite concurrency guard, recall date-bound fix for suffixed Markdown logs, and RFC 3339 timestamp comparison fix. [Link](https://github.com/zeroclaw-labs/zeroclaw/pull/12775)
- **#12744** — `feat(skills): pass literal arguments to executables without a shell` (security-relevant argv binding). [Link](https://github.com/zeroclaw-labs/zeroclaw/pull/12744)
- **#12264** — LLMTR chat-completions provider slot. [Link](https://github.com/zeroclaw-labs/zeroclaw/pull/12264)

**Assessment:** The pipeline is full and thematically coherent (provider correctness, MCP resilience, security policy parsing), but the absence of merges today suggests a **review-capacity constraint** rather than a contribution shortage.

## 4. Community Hot Topics

Comment counts are low across the board (max 2 comments on issues; PR comment counts not populated), so "hot" here means **strategic weight and cross-issue linkage** rather than raw engagement:

1. **#11005 — Stable RPC denial reasons and localized selector denials** (2 comments, updated 2026-11-28). Split machine-readable denial identifiers from localized messages; spawned PR #12062 and feature PR #11289. Underlying need: **observability and i18n for authorization failures** in agent runtimes. [Link](https://github.com/zeroclaw-labs/zeroclaw/issues/11005)
2. **#11015 — Desktop computer-use protocol and spike tracker** (1 comment, updated 2026-11-28). Coordinates the accepted #6909 implementation: screen observation, accessibility-first control of arbitrary local apps. Underlying need: **agents that operate real desktop software**, not just APIs. [Link](https://github.com/zeroclaw-labs/zeroclaw/issues/11015)
3. **#12669 — Gemini provider modernization tracker** (1 comment). Google retired Gemini CLI / Code Assist consumer OAuth; ZeroClaw must migrate to API keys, Vertex/Agent Platform, Gemini Enterprise, or Antigravity CLI. Underlying need: **provider continuity under upstream platform churn**. [Link](https://github.com/zeroclaw-labs/zeroclaw/issues/12669)
4. **#11658 — Web chat input loses focus after reply** (2 comments, still open since 2026-10-11). Long-running UX papercut with a sibling issue #12746 (reconnect case) split out of PR #11661. Underlying need: **fluid conversational UX in the web dashboard**. [Link](https://github.com/zeroclaw-labs/zeroclaw/issues/11658)

**Analysis:** The community's attention is concentrated on *platform durability* (OAuth retirement, MCP outages) and *interaction quality* (focus management, desktop control) rather than new headline features — a sign of a maturing user base running ZeroClaw in production-like conditions.

## 5. Bugs & Stability

Ranked by severity as reported:

| Severity | Issue | Description | Fix PR? |
|---|---|---|---|
| **S1** | [#12774](https://github.com/zeroclaw-labs/zeroclaw/issues/12774) | OpenRouter drops declared tool-result image attachments (`convert_messages` ignores `"attachments"`) | **Yes — #12780** (updated today) |
| **S1** | [#12773](https://github.com/zeroclaw-labs/zeroclaw/issues/12773) | Quickstart never prompts for Lark/Feishu `app_id`/`app_secret`; writes invalid channel block silently dropped on reload | No PR yet |
| **S1** | [#12766](https://github.com/zeroclaw-labs/zeroclaw/issues/12766) | Gateway doesn't answer `/health` during startup while MCP listings connect → liveness probes restart daemon during MCP outage | No PR yet |
| **S0** | [#12772](https://github.com/zeroclaw-labs/zeroclaw/issues/12772) | Cannot exclude individual MCP tools inside `mcp_bundles` (labeled S0 data-loss/security risk by reporter) | No PR yet |
| **S2** | [#12767](https://github.com/zeroclaw-labs/zeroclaw/issues/12767) | Transient MCP failure at channel startup (429/503/refused) leaves agent without MCP tools until restart; `/health` stays green | No PR yet |
| **S3** | [#11658](https://github.com/zeroclaw-labs/zeroclaw/issues/11658) / [#12746](https://github.com/zeroclaw-labs/zeroclaw/issues/12746) | Web chat focus not restored after reply / after reconnect | Partial (#11661 covers base case) |

**Stability theme:** Three of today's issues (#12766, #12767, #12772) come from Kubernetes operators and describe a **coupled failure mode: MCP connectivity problems interact badly with liveness probes and tool filtering**. This is the most operationally dangerous cluster in the digest — an MCP outage can cause a restart loop rather than graceful degradation. Only the OpenRouter S1 has a fix PR in flight (#12780); the Lark/Feishu and gateway-health S1s currently have **no linked fix**.

## 6. Feature Requests & Roadmap Signals

- **#12765 — Buzz (buzz.xyz) channel** (new today): free open-source Slack alternative from Block (Apache-2.0); agent would join groups/DMs like Slack. [Link](https://github.com/zeroclaw-labs/zeroclaw/issues/12765)
- **#12772 — Per-tool exclusion in MCP bundles**: selectively disable tools from a bundled server. [Link](https://github.com/zeroclaw-labs/zeroclaw/issues/12772)
- **#11015 — Desktop computer-use**: tracker active, implementation PR #12776 (feature-flagged macOS tool) already open. **Strong candidate for next minor release.**
- **#12669 — Gemini modernization**: forced migration (not optional) — **high likelihood of landing next** given upstream OAuth retirement.
- **#12459 — Browser voice for OIDC sessions** (PR, blocked/do-not-merge): voice + mic/speaker under `features.config` + `features.chat`. [Link](https://github.com/zeroclaw-labs/zeroclaw/pull/12459)

**Prediction:** Next release window is most likely to contain provider-continuity work (Gemini paths, OpenRouter image delivery, LLMTR slot #12264) plus the MCP resilience fixes, with desktop computer-use gated behind a feature flag and Buzz/voice later.

## 7. User Feedback Summary

**Pain points:**
- **Configuration integrity**: quickstart writing invalid Lark/Feishu blocks (#12773) is a trust-eroding onboarding bug — users believe a channel is configured when it is silently dropped.
- **Operational fragility**: Kubernetes users (tw-360vier) report a real incident pattern — MCP outage → probe restart → tool-less agent with green health checks (#12766, #12767). This is the strongest negative signal today.
- **Provider breakage**: OpenRouter image attachments silently vanishing (#12774) blocks workflows (S1) and erodes confidence in multi-provider parity.
- **UX friction**: repeated focus-loss reports (#11658, #12746) show sustained annoyance in the web dashboard.

**Satisfaction signals:** Users are investing in advanced integrations (Buzz, desktop control, MCP bundles), which implies the core agent loop and provider abstraction are working well enough to build on. The Gemini tracker (#12669) is well-scoped and community-driven rather than complaint-driven.

## 8. Backlog Watch

Items needing maintainer attention:

1. **#11005** (open since 2026-09-20, updated today, 2 comments) — stable RPC denial reasons; has a docs exception PR (#12062) but the feature PR (#11289) is still pending. **Two months in flight.**
2. **#11658** (open since 2026-10-11) — focus-loss bug with a split-off sibling (#12746) but no merged fix; PR #11661 appears to cover only the base case. **Seven weeks unresolved for an S3 UX bug.**
3. **#11015** (open since 2026-09-20) — desktop computer-use tracker; implementation now exists (#12776) but the tracker has only 1 comment, suggesting coordination risk on a high-risk surface.
4. **#12459** (PR, `do-not-merge` + `status:blocked` since 2026-11-15) — browser voice for OIDC; blocked with no visible resolution path.
5. **#11727** (PR, `needs-author-action` since 2026-10-14) — zerocode session reopen; six weeks awaiting author response.
6. **PR backlog generally**: 44 open PRs with **zero merges today** and several carrying `needs-author-action` (#12062, #11727, #12318) — maintainer review throughput is the single biggest project-health risk visible in this dataset.

---

**Health verdict:** ZeroClaw is a **high-activity, merge-constrained project**. Contribution quality is high (targeted fixes, trackers, security-conscious PRs), and the bug reports reflect real production usage rather than hobbyist experimentation — a good maturity signal. The immediate risks are (a) MCP/gateway resilience under Kubernetes, (b) silent config corruption in onboarding, and (c) a growing open-PR queue with no closures in the last 24h. Clearing the provider/MCP fix PRs (#12780, #12781, #12779, #12776) would convert today's activity into tangible stability gains.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*