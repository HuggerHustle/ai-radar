# OpenClaw Ecosystem Digest 2026-11-26

> Issues: 345 | PRs: 500 | Projects covered: 5 | Generated: 2026-11-26 03:29 UTC

- [OpenClaw](https://github.com/openclaw/openclaw)
- [Hermes Agent](https://github.com/nousresearch/hermes-agent)
- [IronClaw](https://github.com/nearai/ironclaw)
- [QwenPaw](https://github.com/agentscope-ai/QwenPaw)
- [ZeroClaw](https://github.com/zeroclaw-labs/zeroclaw)

---

## OpenClaw Deep Dive

# OpenClaw Project Digest — 2026-11-26

## 1. Today's Overview

OpenClaw remains in a high-velocity, high-contention phase. In the last 24 hours the project absorbed **345 issue updates** (233 open/active, 112 closed) and **500 PR updates** (272 open, 228 merged/closed), a ratio that signals a healthy but strained review pipeline. Two releases landed: the feature-line **v2026.11.10** and the LTS-equivalent **v2026.10.34** `extended-stable`. The dominant theme across issues is **update/activation reliability** — Doctor failures, plugin migration conflicts, and rollback loops during managed npm upgrades — alongside persistent **session-state and message-loss** regressions. Memory pressure (Gateway RSS, SQLite worker OOM) and prompt-cache inefficiency also remain recurring, high-comment complaints. Overall: strong contributor throughput, but a cluster of P0/P1 update-path and session-state bugs is accumulating release-blocker status.

---

## 2. Releases

### v2026.11.10 — `openclaw 2026.11.10`
- Latest feature-line release. Release notes/changelog are published at docs.openclaw.ai (dual-format: notes + changelog).
- Scale indicators: **8,309 commits · 7,671 PRs · 349 contributors**.
- No explicit breaking-change or migration note was included in the provided data; operators should consult the linked release notes before upgrading.
- ⚠️ Related open reports target this line: #203442 (`2026.11.4 → 2026.11.10-beta.1` Doctor fails with *"Plugin deepseek Doctor source must be prepared before loading"*), suggesting the 2026.11.x update path still has activation-stage fragility.

### v2026.10.34 — `extended-stable` (LTS-equivalent)
- Gateway-only release pinned to **end-of-October 2026** code plus critical security updates, reliability/performance fixes, and new model support.
- Recommended track for operators prioritizing stability over new features.

**Migration/operational guidance:** Given the density of update-path bugs below, users on managed npm installs should validate Doctor output before committing an upgrade and retain rollback capability.

---

## 3. Project Progress

The 24h window closed **228 PRs/issues**, including notable fixes advancing:

- **Web UI rendering** — #177094 (CLOSED): system-notice delivery mirror no longer displaces the turn's final answer into collapsed tool steps after restart.
- **Windows plugin staging** — #162585 (CLOSED): source-capture staging no longer re-materializes a plugin's own package unboundedly.
- **SQLite worker OOM** — #191847 (CLOSED): large sessions no longer repeatedly kill the 512 MB worker.
- **Outbound queue** — #112313 (CLOSED): dead-lettered delivery entries addressed.
- **Cron fallback authorization** — #192009 (CLOSED): cross-provider cron fallback accounts feature landed.

Active PRs advancing key areas:
- **PR #205709** — Gateway container crash-recovery after kill (P1, `impact:crash-loop`, ready for maintainer look).
- **PR #205723 / #199346** — Stop large MCP tool catalogs from stalling Gateway session start; compiles validators lazily.
- **PR #205665** — Knowledge conversation-learning scoped to owning agent (P1, `impact:security`).
- **PR #205584** — Keep user approvals settled after conversation compaction.
- **PR #193283** — Android all-day calendar events fix (UTC offset off-by-one).

---

## 4. Community Hot Topics

| Rank | Item | Comments | Link |
|---|---|---|---|
| 1 | **#164294** — Gateway state DB WAL auto-checkpoint never completes (pinned by in-process reader) | 44 | [Issue](https://github.com/openclaw/openclaw/issues/164294) |
| 2 | **#197083** — Post-install Doctor WAL publication verification leaves 11.3 update partially finalized | 40 | [Issue](https://github.com/openclaw/openclaw/issues/197083) |
| 3 | **#182891** (CLOSED) — Prompt cache never reused; `cache read dropped N -> 0` per request | 28 | [Issue](https://github.com/openclaw/openclaw/issues/182891) |
| 4 | **#153426** — Curated memory roots silently excluded from bootstrap injection (provenance ratchet) | 25 | [Issue](https://github.com/openclaw/openclaw/issues/153426) |
| 5 | **#148707** — Reply lost with *"no active tool authority snapshot"* on turn displacement | 23 | [Issue](https://github.com/openclaw/openclaw/issues/148707) |
| 6 | **#123792** — Assistant turns render twice with CLI backends | 22 | [Issue](https://github.com/openclaw/openclaw/issues/123792) |

**Underlying needs:** The top two items are both **SQLite WAL / checkpoint durability** problems on the update and state paths — a systemic theme. The prompt-cache cluster (#182891, #143017, #186683) reflects operators measuring real cost and performance loss from cache-prefix rewrites. The memory-injection cluster (#153426, #158912) shows the **provenance ratchet is silently breaking the curated-memory contract**, a trust and reliability concern for power users.

---

## 5. Bugs & Stability

**P0 / release-blockers:**
- **#197083** — Doctor WAL verification leaves update partially finalized (`ux-release-blocker`).
- **#153426** — Memory roots permanently excluded from bootstrap; `impact:security`, `session-state`.
- **#158912** — `MEMORY.md` not injected at bootstrap since 2026.9.6; docs contradict behavior.
- **#190563** — Cannot resume paused Codex chat: provider/native-thread mismatch (`impact:security`).

**P1:**
- **#148707** — Reply lost on turn displacement (`message-loss`).
- **#196199** — Native Codex helper completions fail to resume parent; users locked out (`session-state`, `message-loss`).
- **#200606** — 2026.11.5 Doctor blocks update with plugin migration conflict.
- **#181432** — ~1.9 GB baseline RSS + SQLite transaction timeouts on 2026.10.5.
- **#185085** — Exec completion wakes lost with `SESSION_DELIVERY_GENERATION_UNAVAILABLE` (fix #177063 not backported to stable).
- **#204816** — 2026.11.4 → 2026.11.8 stable rolls back with `doctor-failed / Invalid config`.
- **#171831** — Windows perf regression: startup 320s vs 55s; 173s `pluginState.register` transaction.
- **#205665 (PR)** — Security fix for Knowledge scribe reading out-of-agent transcripts.

**Notable pattern:** A large share of P0/P1 issues are **update/activation and session-state** failures — the two areas most exposed to regressions during managed upgrades. Several fix PRs exist but are stuck in "needs proof" or "waiting on maintainer" states.

---

## 6. Feature Requests & Roadmap Signals

Candidates likely to influence the next release:
- **#192009 (landed)** — Explicitly authorize cross-provider cron fallback accounts.
- **#204775** — Design: prepared-release updates (state, ownership, plan) — an active design doc likely shaping the update architecture.
- **#56349** — Unbypassable outbound policy enforcement (pre-send guarantee); `impact:security`.
- **#150238** — Supported context-budget/skip policy for Skill Workshop Experience Review on oversized sessions.
- **#140213** — Multiple policy aliases resolving to one configured model.
- **#169428** — Expose `model.auth_label` in `/usage full` footer.
- **#103067** — Centralize chat-session naming; define subagent session lifetime/persistence.
- **#170562** — Doctor recovery for stranded requester settle wakes.

**Prediction:** Update-path reliability (#204775, #200606 family) and session/memory-injection correctness are the most probable next-version focus, given release-blocker density.

---

## 7. User Feedback Summary

**Pain points (dissatisfaction):**
- Managed upgrades repeatedly fail at Doctor/activation with partial finalization and rollback traps (#197083, #200606, #204816, #200756).
- Silent, permanent loss of memory injection and message delivery (#153426, #158912, #148707, #185085) erodes trust.
- Memory/CPU footprint regressions on ARM64 and Windows (#181432, #192547, #171831) hit constrained hosts hardest.
- Prompt-cache churn produces measurable cost/performance loss (#143017, #186683).

**Positive signals:**
- High engagement and detailed production reproductions (949 wire-captured requests in #143017) indicate a sophisticated, invested user base.
- Fast fix turnaround on UI/plugin issues (multiple `vincentkoc` PRs same-day).
- LTS release (`extended-stable`) shows maintainers actively serving stability-minded operators.

---

## 8. Backlog Watch

Long-unanswered or high-impact items needing maintainer attention:

| Item | Age | Concern | Link |
|---|---|---|---|
| **#56349** | since 2026-03-28 | Unbypassable outbound policy enforcement; `impact:security`, still needs product/security review | [Issue](https://github.com/openclaw/openclaw/issues/56349) |
| **#112313** (CLOSED) | since 2026-07-21 | Dead-lettered outbound queue permanent — verify closure is complete | [Issue](https://github.com/openclaw/openclaw/issues/112313) |
| **#123792** | since 2026-08-14 | Double-rendered assistant turns (CLI backends); `diamond lobster` rating, still stale | [Issue](https://github.com/openclaw/openclaw/issues/123792) |
| **#127195** | since 2026-08-21 | 16 call sites emit identical "changed while starting work" error with no reason code | [Issue](https://github.com/openclaw/openclaw/issues/127195) |
| **#153426** | since 2026-09-20 | Memory roots permanently excluded; P0, security + session-state, no fix PR | [Issue](https://github.com/openclaw/openclaw/issues/153426) |
| **#158912** | since 2026-09-26 | MEMORY.md not injected; P0, docs mismatch | [Issue](https://github.com/openclaw/openclaw/issues/158912) |
| **#199346 (PR)** | since 2026-11-15 | MCP validator lazy-compile; blocked on proof despite superseding PR #205723 | [PR](https://github.com/openclaw/openclaw/pull/199346) |

**Maintainer recommendation:** The **MEMORY.md injection cluster (#153426, #158912)** and the **update-path Doctor failures (#197083, #200606, #204816)** represent the highest-leverage fixes — they combine P0 severity, security/session-state impact, and repeated user reports, yet currently lack merged fixes.

---

*Data source: github.com/openclaw/openclaw — digest generated 2026-11-26. All counts reflect the 24-hour window as reported.*

---

## Cross-Ecosystem Comparison

# Cross-Project Comparison Report
**AI Agent / Personal AI Assistant Open-Source Ecosystem**
*Snapshot date: 2026-11-26*

---

## 1. Ecosystem Overview

The personal AI assistant / agent OSS ecosystem is in a **high-velocity but strained** phase, characterized by rapid feature throughput colliding with scaling, session-state, and update-path reliability bottlenecks. Across the five tracked projects, contributors are shipping features faster than maintainers can review them — QwenPaw, Hermes, ZeroClaw, and OpenClaw all show open-PR:merged ratios between roughly 1:1 and 4:1, indicating a systemic **review-bandwidth ceiling** rather than a supply problem. The dominant emerging concerns are **memory correctness and persistence** (OpenClaw, QwenPaw, Hermes), **update/activation reliability** (OpenClaw), and **scaling to heavyweight deployments** — large `state.db`/session counts in Hermes and multi-profile gateways in ZeroClaw. A secondary layer of friction is **cross-platform parity**, with Windows, Termux/Android, and Nix users reporting disproportionate breakage across almost every project. One project in the cohort (IronClaw) recorded zero activity in the window, indicating the ecosystem is **not uniformly healthy** — attention and contributor energy are concentrating around a small set of fast-moving leaders.

---

## 2. Activity Comparison

| Project | Issues (24h) | PRs (24h) | Release Status | Health Score* | Notes |
|---|---|---|---|---|---|
| **OpenClaw** | 345 (233 open, 112 closed) | 500 (272 open, 228 merged/closed) | ✅ v2026.11.10 + v2026.10.34 `extended-stable` (LTS) | **7.5 / 10** | Highest raw throughput; 2 P0 release-blockers unpatched; update-path fragility |
| **Hermes Agent** | 50 (48 open, 2 closed) | 50 (47 open, 3 merged/closed) | 🟡 Canary `v0.23.4+canary` (pre-release) | **6.5 / 10** | Strong engagement; severe merge bottleneck; scale/perf regressions |
| **QwenPaw** | 27 | 50 (22 merged/closed) | ❌ No new release (last: v2.3.1-beta.1) | **7.0 / 10** | Stabilization post-v2.3.0; balanced merge ratio; memory & Windows issues |
| **ZeroClaw** | 10 | 50 (39 open, 11 merged/closed) | ❌ No new release (v0.9.1 cleanup window) | **6.5 / 10** | Deep architectural refactor (Goal V1); high-risk XL PR backlog |
| **IronClaw** | 0 | 0 | ❌ None | **N/A** | Dormant in this window |

\* **Health Score methodology** (composite, 1–10): weights merge throughput (30%), release cadence/quality (20%), severity of open P0/P1 bugs (25%), community engagement signals (15%), and backlog staleness (10%). Scores are directional, not precise.

**Key observation:** Raw activity does not correlate with health. OpenClaw has ~7× the throughput of Hermes but the same relative release-blocker pressure; ZeroClaw has the highest open-PR ratio (78% open) despite low issue volume, signaling refactor-phase drag.

---

## 3. OpenClaw's Position

**Advantages vs. peers:**
- **Ecosystem scale:** 349 contributors and 8,309 commits per the v2026.11.10 release — an order of magnitude beyond Hermes, QwenPaw, or ZeroClaw. OpenClaw functions as the **de-facto reference implementation** for the category.
- **LTS discipline:** The `v2026.10.34 extended-stable` track is a **unique maturity signal** — no other project in the cohort offers a parallel stability channel with backported security fixes. This is a meaningful competitive advantage for enterprise/operator adoption.
- **Breadth of surface:** OpenClaw is the only project in the cohort visibly spanning Web UI, CLI backends, Windows plugin staging, Android clients, cron fallback, outbound queue policy, and knowledge/scribe subsystems in a single digest.

**Technical approach differences:**
- **Managed npm upgrade + Doctor verification pipeline** is OpenClaw's signature operational model — and its biggest liability (WAL checkpoint, plugin migration conflicts, rollback loops).
- **Provenance-ratchet memory model** (curated roots, `MEMORY.md` bootstrap injection) is more opinionated than Hermes' "doc-chain substrate" RFC or QwenPaw's ReMe/ReMeLight tiers, but currently suffers silent exclusion bugs (#153426, #158912).
- **Gateway-centric architecture** with SQLite state DB and WAL — shares architectural DNA with Hermes' gateway but at greater scale, and both now exhibit the same class of write-lock/OOM symptoms.

**Community size comparison:** OpenClaw's contributor base is roughly **5–8× larger** than Hermes or QwenPaw by issue/PR churn, and it is the only project generating a dedicated LTS track. However, per-contributor PR merge efficiency appears lower than QwenPaw's, implying coordination overhead at scale.

**Position verdict:** OpenClaw is the **market leader by volume and maturity**, but its update-path fragility is the ecosystem's most concentrated risk — a failed OpenClaw upgrade affects far more users than any single Hermes or QwenPaw bug.

---

## 4. Shared Technical Focus Areas

Several requirements recur across **two or more** projects, indicating ecosystem-level gaps:

| Theme | Projects | Specific Shared Need |
|---|---|---|
| **Memory correctness & persistence** | OpenClaw, QwenPaw, Hermes | OpenClaw: `MEMORY.md` not injected, curated roots silently dropped (#153426, #158912). QwenPaw: memory without decay, ref-counted archival, tenant scoping (#8881, #8882). Hermes: doc-chain substrate survives compaction (#143379). **Shared need: durable, provenance-preserving, decay-aware memory with verifiable injection.** |
| **Session-state / message-loss integrity** | OpenClaw, Hermes | OpenClaw: replies lost on turn displacement, `no active tool authority snapshot` (#148707, #196199). Hermes: mobile session stuck "running", kanban workers without live tool feed (#160278, #144334). **Shared need: crash-safe, resumable turn state.** |
| **Gateway/state-DB scaling** | OpenClaw, Hermes | OpenClaw: 1.9 GB RSS, SQLite OOM, WAL checkpoint starvation (#181432, #164294, #191847). Hermes: 2.9 GB `state.db`, 8.5s write locks, 50–70% idle CPU (#159886, #160281). **Shared need: bounded reads, off-serial-queue writes, and cached filesystem walks.** |
| **Cross-platform parity (Windows first)** | OpenClaw, Hermes, QwenPaw | OpenClaw: Windows startup 320s vs. 55s (#171831). Hermes: 34k–99k FS ops/s, Scheduled Task regressions (#146538, #160293). QwenPaw: ReMe tag index, WebView2 scroll, console clipping (#8863, #8888, #8856). **Shared need: platform-specific performance and correctness testing.** |
| **Provider/model-switch coherence** | OpenClaw, QwenPaw, Hermes | OpenClaw: Codex session/provider mismatch, resume failures (#190563, #196199). QwenPaw: `/compact` ignores session model, missing glm-5.3/5.4 context tables (#8464, #8891). Hermes: Anthropic `speed` leaks into OpenAI fallback, kimi-k3 empty tool args (#122010, #158734). **Shared need: provider-agnostic session and context metadata that tracks active model.** |
| **MCP OAuth & tool-catalog cost** | Hermes, OpenClaw | Hermes: MCP `oauth.scope` ignored, 3 competing fix PRs (#142477, #93719). OpenClaw: large MCP catalogs stall session start (#205723, #199346). **Shared need: OAuth scope correctness and lazy validator compilation.** |

**Interpretation:** These are not project-specific bugs — they are **category-wide unsolved problems**. Any project that ships a clean solution to memory-injection verification or gateway/state-DB scaling would gain a defensible lead.

---

## 5. Differentiation Analysis

| Dimension | OpenClaw | Hermes Agent | QwenPaw | ZeroClaw |
|---|---|---|---|---|
| **Primary focus** | General-purpose assistant platform with LTS-grade operations | Agent + Desktop + Kanban worker pipeline | Creator plugin, memory system, multi-model chat | Runtime architecture, identity/session hardening, A2A |
| **Target users** | Operators running managed, production gateways | Power users with Desktop/WebApp + worker automation | Multi-model chat users + memory-centric workflows | Developers building on a Rust runtime |
| **Architecture signals** | Gateway + SQLite WAL + npm-managed updates + Doctor | Gateway + Desktop + Kanban queue + doc-chain substrate | Plugin-heavy (creator), ReMe/ReMeLight memory, console UI | Rust crates (`zeroclaw-runtime`), OIDC, ACP, channel abstraction |
| **Release model** | Feature line + LTS (`extended-stable`) | Canary → stable promotion | Beta-labeled minor versions | Milestone/stabilization windows |
| **Distinctive bet** | Structured update/rollback governance | Desktop + worker UX & memory RFC | Memory decay/ref-counting & AI prompt polishing | Goal V1 refactor + message-delivery identity model |
| **Biggest self-inflicted risk** | Update-path P0s block its own releases | Merge bottleneck stalls its feature backlog | Windows parity + creator-plugin parsing edge cases | XL refactor PRs (Goal V1) stuck in CI/security gates |

**Summary:** OpenClaw optimizes for **operational trust at scale**; Hermes for **desktop automation breadth**; QwenPaw for **memory quality and multi-model flexibility**; ZeroClaw for **architectural rigor and identity correctness**. These are complementary, not head-to-head, positions — but all four compete for the same **review-bandwidth-constrained contributor pool**.

---

## 6. Community Momentum & Maturity

**Activity tiers:**

- **Tier 1 — High-volume, scaling strain:** **OpenClaw** (345 issues, 500 PRs). Rapid iteration, LTS discipline, but P0 backlog pressure. Still the ecosystem's engine.
- **Tier 2 — High-engagement, merge-bound:** **Hermes Agent** (50/50, 57-comment RFC) and **QwenPaw** (27/50, balanced closes). Hermes shows the **strongest design conversation** (memory/compaction RFC) but the **worst merge ratio**; QwenPaw is the most **operationally balanced** of the mid-tier.
- **Tier 3 — Deep refactor, low issue churn:** **ZeroClaw** (10 issues, 50 PRs, 78% open). Healthy interest, but the project is committed to a long architectural arc; short-term velocity is constrained by Goal V1.
- **Tier 4 — Dormant:** **IronClaw** (0/0). No signal this window; status unclear.

**Rapidly iterating:** OpenClaw (feature + LTS tracks), QwenPaw (frequent minor/beta releases, 22 merges in 24h).
**Stabilizing:** ZeroClaw (v0.9.1 cleanup + roadmap tracker), QwenPaw (post-v2.3.0 hardening), OpenClaw LTS line.
**At risk of stalling:** Hermes (merge backlog), ZeroClaw (XL PRs blocked on CI/security), IronClaw (unknown).

---

## 7. Trend Signals

Extracted from cross-project community feedback — highest value for AI agent developers:

1. **Update/activation reliability is a first-class product surface, not an afterthought.** OpenClaw's Doctor/WAL/rollback failures dominate its P0 list. The ecosystem has outgrown naive `npm i -g` upgrade semantics. **Implication:** invest early in staged, verifiable, rollback-safe update paths with machine-readable diagnostics.

2. **Memory is the new battleground — and "never forgets" has become a liability.** OpenClaw's provenance ratchet silently drops curated memory; QwenPaw's distilled entries accumulate without decay; Hermes' RFC #143379 (57 comments) argues for a compaction-surviving doc substrate. **Implication:** memory systems need *decay, provenance, verification, and a user-visible contract* — not just a vector store.

3. **Session state is the primary source of trust erosion.** Reply loss, stuck "running" sessions, provider-switch lockouts, and duplicated email replies appear in **every active project**. These are not cosmetic — they cause users to abandon conversations or production channels. **Implication:** make turn state append-only, forkable, and resumable across restarts and provider switches.

4. **Provider-agnostic metadata is missing.** Model switching, fallback chains, reasoning-budget accounting, and context-window tables are inconsistent across OpenAI/Anthropic/Gemini/Moonshot/native backends. QwenPaw's context-table gaps, Hermes' `speed` kwarg leak, and OpenClaw's Codex resume failures are the same disease. **Implication:** define a canonical session/context schema that survives provider handoff.

5. **Cross-platform parity is a moat, not a checkbox.** Windows, Termux/Android, and Nix users are systematically underserved across the cohort. QwenPaw's Windows issues are explicitly platform-blocking; Hermes has a whole Windows cluster; OpenClaw shows 6× startup regressions on Windows. **Implication:** platform CI is a competitive differentiator for adoption beyond macOS/Linux dev machines.

6. **MCP is maturing but under-governed.** OAuth scope handling has three competing fix PRs in Hermes; large tool catalogs stall session start in OpenClaw. The protocol's success is outpacing its hardening. **Implication:** lazy validator compilation, correct OAuth scope semantics, and catalog-size limits are near-term must-haves.

7. **Review bandwidth — not contributor supply — is the ecosystem's binding constraint.** Hermes (94% open PRs), ZeroClaw (78%), and QwenPaw's XXL-under-review backlog all point the same way. **Implication:** projects that invest in triage automation, canonical-fix consolidation (e.g., MCP OAuth), and reviewer tooling will outpace those that don't.

---

**Bottom line for decision-makers:** The ecosystem is healthy but **bottlenecked**. OpenClaw leads on scale and maturity but carries the largest concentrated risk; Hermes has the most valuable design conversations but the weakest merge velocity; QwenPaw is the most balanced operator; ZeroClaw is making the deepest architectural bet. The shared unsolved problems — memory correctness, session durability, gateway scaling, and provider-agnostic metadata — are the highest-leverage places to build or invest, and the projects that solve them first will define the next cycle of the category.

---

## Peer Project Reports

<details>
<summary><strong>Hermes Agent</strong> — <a href="https://github.com/nousresearch/hermes-agent">nousresearch/hermes-agent</a></summary>

# Hermes Agent — Project Digest
**Date: 2026-11-26** | Repository: [github.com/NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent)

---

## 1. Today's Overview

Hermes Agent shows **very high activity** today: 50 issues and 50 PRs updated in the last 24 hours, plus a new canary release (`v0.23.4+canary.20261125T064800Z`). The issue tracker is dominated by open items (48/50), with only 2 closures — one of which was an unauthorized filing that was withdrawn. PR throughput is similarly skewed (47 open vs. 3 merged/closed), suggesting a **review bottleneck** rather than a lack of contributor effort. Recurring themes cluster around **performance on large multi-profile installs** (state.db write locks, idle CPU burn, Windows filesystem churn), **Kanban/worker pipeline correctness**, and **platform integration bugs** (Feishu, WhatsApp, Windows Scheduled Tasks). Overall, the project is healthy in engagement but shows strain in merge velocity and scaling on heavyweight deployments.

---

## 2. Releases

**New release: `canary.20261125T064800Z-v0.23.4`** ([release page](https://github.com/NousResearch/hermes-agent/releases))
- Canary build of **Hermes Agent v0.23.4**, dated November 25, 2026.
- Includes a Hermes Desktop builds table with per-OS downloads (macOS Apple Silicon DMG shown in the data).
- **Breaking changes / migration notes:** Not documented in the provided release excerpt.
- **Note:** This is a canary channel release — not recommended for production installs. Users on v0.23.2/v0.23.3 (see [Issue #158231](https://github.com/NousResearch/hermes-agent/issues/158231), [Issue #160284](https://github.com/NousResearch/hermes-agent/issues/160284)) should track stable promotion rather than canary for production gateways.

---

## 3. Project Progress

Merged/closed items in the last 24h are limited (3 PRs, 2 issues):

| Item | Type | Status | Notes |
|---|---|---|---|
| [#160256](https://github.com/NousResearch/hermes-agent/pull/160256) — `fix(delegation): correct the delegate_task text the model reads` | Bug fix | **CLOSED** | Aligns `delegate_task` tool description and steer parameter text with actual code behavior (companion to docs fix #160195). |
| [#106738](https://github.com/NousResearch/hermes-agent/pull/106738) — `feat(desktop): expose native session splits through plugin SDK` | Feature | **CLOSED** | Plugin SDK now supports `host.openSession(..., { intent: 'split' })`. Long-lived (opened Sept 9). |
| [#108271](https://github.com/NousResearch/hermes-agent/pull/108271) — `feat(approvals): add ephemeral Desktop task intent review` | Feature | **CLOSED** | Adds bounded, ephemeral Desktop task-intent evidence to smart approval; opt-in protected-instruction review. |
| [#159964](https://github.com/NousResearch/hermes-agent/issues/159964) — iOS standalone WebApp panel toggle reloads page | Bug | **CLOSED** | Upstream cause; resolved. |
| [#160278](https://github.com/NousResearch/hermes-agent/issues/160278) — Mobile session stuck "running" | Bug | **CLOSED (withdrawn)** | Filed without account owner authorization; content void. |

**Assessment:** Feature work on the Desktop/plugin surface (splits, approval review) landed, and one delegation text bug was fixed. However, the near-1:1 open:merged ratio on PRs indicates many substantive fixes (e.g., MCP OAuth, Windows gateway, Feishu) are queued but not yet merged.

---

## 4. Community Hot Topics

Ranked by comment count:

1. **[#143379 — RFC: THE DOC-CHAIN SUBSTRATE'S NETWORK — the read, the governance, the compaction](https://github.com/NousResearch/hermes-agent/issues/143379)** — 57 comments
   - *Need:* A durable, provenance-preserving record that survives context compression, so the agent re-reads stored knowledge instead of making the user repeat themselves. This is a **design-level conversation** about memory/compaction architecture — the highest-engagement thread by a wide margin.

2. **[#146538 — Gateway does 34k–99k filesystem metadata ops/s with many profiles (Windows)](https://github.com/NousResearch/hermes-agent/issues/146538)** — 15 comments
   - *Need:* Multi-profile Windows installs (66 profiles) burn a full CPU core and grow the kernel pool. Users running many profiles need the skills-signature walk and profile re-enumeration cached.

3. **[#121281 — kanban: manual `blocked` → `ready` promote keeps stale `last_failure_error`](https://github.com/NousResearch/hermes-agent/issues/121281)** — 10 comments
   - *Need:* Operator promote actions are silently ignored; `blocker_auth` parks cards forever. Kanban operators need trustworthy manual overrides.

4. **[#154275 — patchelf patch fails with patchelf-0.15.2 (nixpkgs-unstable)](https://github.com/NousResearch/hermes-agent/issues/154275)** — 9 comments
   - *Need:* Nix users on unstable cannot build; upstream-version coupling.

5. **[#148923 — Canonical group faces ignore migrated bot avatar key](https://github.com/NousResearch/hermes-agent/issues/148923)** — 7 comments, **2 👍** (highest reaction count in dataset)
   - *Need:* Group chat identity/avatar correctness after profile migration.

**Analysis:** The community's center of gravity is **scaling and correctness at scale** — memory/compaction architecture, gateway performance under many profiles, and Kanban state machine integrity. The reaction data (#148923) shows desktop/chat UX polish also resonates.

---

## 5. Bugs & Stability

Ranked by severity (P2 highest present; no P0/P1 in dataset):

| Severity | Issue | Symptom | Fix PR? |
|---|---|---|---|
| **P2** | [#159886](https://github.com/NousResearch/hermes-agent/issues/159886) — whole-index routing save rewrites ~35k rows, 8.5s+ write lock on 2.9 GB `state.db` | Desktop `session.control.read` times out at 30s; read pool at capacity | [#144701](https://github.com/NousResearch/hermes-agent/pull/144701) (keep bounded control reads off serial queue) — open |
| **P2** | [#160281](https://github.com/NousResearch/hermes-agent/issues/160281) — idle gateway burns ~50–70% core, reads ~110 MB/s | Change-watcher, `/board` diagnostics, `/api/status` lineage rebuild on busy multi-profile install | None yet |
| **P2** | [#146538](https://github.com/NousResearch/hermes-agent/issues/146538) — Windows kernel pool growth from FS metadata churn | 34k–99k ops/s sustained | None yet |
| **P2** | [#158513](https://github.com/NousResearch/hermes-agent/issues/158513) — Termux/Android: `os.link` missing, hard-link atomic-create crashes | Every inbound turn fails until salt file pre-created | None yet |
| **P2** | [#144570](https://github.com/NousResearch/hermes-agent/issues/144570) — review lane force-loads `sdlc-review`, crashes workers pre-model when skill absent | No bundle fallback; illegible failure | None yet |
| **P2** | [#144334](https://github.com/NousResearch/hermes-agent/issues/144334) — Kanban owner-run workers' log has no live tool feed | Exit trailer lands before reply | None yet |
| **P2** | [#158734](https://github.com/NousResearch/hermes-agent/issues/158734) — kimi-k3 deferred tool calls receive empty arguments `{}` | All argument-bearing deferred tools broken on Moonshot provider | None yet |
| **P2** | [#122010](https://github.com/NousResearch/hermes-agent/issues/122010) — Anthropic fast-mode `speed` leaks into OpenAI-compatible fallbacks | `TypeError: unexpected keyword argument 'speed'` | None yet |
| **P2** | [#147482](https://github.com/NousResearch/hermes-agent/issues/147482) — Vertex/Gemini thought summaries leak into replies | Reasoning traces shown to end users on Telegram | None yet |
| **P2** | [#25620](https://github.com/NousResearch/hermes-agent/issues/25620) — Feishu merge_forward yields empty `[Merged forward message]` | Forwarded content unparsed | [#160291](https://github.com/NousResearch/hermes-agent/pull/160291) — open |
| **P2** | [#160292](https://github.com/NousResearch/hermes-agent/issues/160292) — Desktop skills picker iframe 404s after marketplace move | `/docs/skills?embed=picker` gone | None yet |
| **P2** | [#160271](https://github.com/NousResearch/hermes-agent/issues/160271) — repo-inside-home dev installs: `home_io_guard` fails 72 tests | Dev workflow blocked | None yet |
| **P2** | [#158231](https://github.com/NousResearch/hermes-agent/issues/158231) — Backup & Transfer fails on root-owned `portal-recovery/` | Cloud backup unusable | None yet |

**Notable P3s:** [#142477](https://github.com/NousResearch/hermes-agent/issues/142477) / [#93719](https://github.com/NousResearch/hermes-agent/issues/93719) (MCP `oauth.scope` ignored) — **two competing fix PRs exist**: [#160288](https://github.com/NousResearch/hermes-agent/pull/160288) (salvage of #152909), [#152909](https://github.com/NousResearch/hermes-agent/pull/152909), and [#93891](https://github.com/NousResearch/hermes-agent/pull/93891). This is a good sign for resolution but risks duplicate review effort.

**Windows-specific cluster:** [#143658](https://github.com/NousResearch/hermes-agent/issues/143658) (first-run overlay after sleep/resume) and [#160293](https://github.com/NousResearch/hermes-agent/issues/160293) (Scheduled Task predates wscript launcher) — the latter has an immediate fix PR [#160294](https://github.com/NousResearch/hermes-agent/pull/160294).

---

## 6. Feature Requests & Roadmap Signals

| Request | Issue | Likelihood in next version |
|---|---|---|
| Save passive Kanban notifications in original Desktop/WebApp chat | [#160284](https://github.com/NousResearch/hermes-agent/issues/160284) (1 👍) | Medium — small, user-visible gateway/webapp change |
| Desktop: GUI "New Project" button | [#159853](https://github.com/NousResearch/hermes-agent/issues/159853) | Medium-high — closes an obvious GUI gap vs. CLI `hermes project create` |
| Desktop Capabilities → Skills should open on installed skills, not store | [#158746](https://github.com/NousResearch/hermes-agent/issues/158746) | High — a **regression** from v0.21.0 behavior, likely fast-tracked |
| Public plugin seams for out-of-process work (`wrap_argv`, `judge_command`, etc.) | [#160269](https://github.com/NousResearch/hermes-agent/pull/160269) | Medium — already a PR; plugin ecosystem expansion |
| Hosted Cloud dashboard / agent-less host Webapp | [#159876](https://github.com/NousResearch/hermes-agent/pull/159876) | Strategic — part of Hermes Cloud roadmap |
| Redesigned Desktop agent workspace with classic recovery | [#152168](https://github.com/NousResearch/hermes-agent/pull/152168) | Likely staged — integration branch with a 9-PR stack |

**Prediction:** v0.24.x will likely prioritize (a) **performance fixes for large state.db / multi-profile gateways**, (b) **Desktop UX regressions** (skills page, projects), and (c) **MCP OAuth scope correctness** given the multiple ready PRs.

---

## 7. User Feedback Summary

**Pain points (dissatisfaction):**
- **Scale is the #1 complaint.** Large installs (40k sessions / 2.86 GB `state.db`, 10–66 profiles) hit write locks, 30s timeouts, and 50–70% idle CPU ([#159886](https://github.com/NousResearch/hermes-agent/issues/159886), [#160281](https://github.com/NousResearch/hermes-agent/issues/160281), [#146538](https://github.com/NousResearch/hermes-agent/issues/146538)). This is the clearest signal that the gateway's data layer needs architectural attention.
- **Kanban state machine erodes trust.** Silent operator-promote failures ([#121281](https://github.com/NousResearch/hermes-agent/issues/121281)) and missing worker logs ([#144334](https://github.com/NousResearch/hermes-agent/issues/144334)) make automation feel unreliable.
- **Platform edge cases:** Termux (`os.link`), Windows Scheduled Tasks, Feishu merge-forwards, WhatsApp self-chat/LID confusion ([#103281](https://github.com/NousResearch/hermes-agent/issues/103281)), and a **production infra leak** sending "No home channel is set" to end users ([#117800](https://github.com/NousResearch/hermes-agent/issues/117800)).

**Satisfaction / positive signals:**
- High-quality RFC engagement ([#143379](https://github.com/NousResearch/hermes-agent/issues/143379), 57 comments) shows a committed power-user base.
- Multiple independent contributors filed **competing/duplicate fix PRs** for MCP OAuth — evidence of an engaged ecosystem willing to fix forward.
- Feature PRs for Desktop splits and approvals demonstrate active investment in polish.

---

## 8. Backlog Watch

Long-unanswered or aging items needing maintainer attention:

| Age | Item | Why it matters |
|---|---|---|
| **~6 months** | [#25620](https://github.com/NousResearch/hermes-agent/issues/25620) — Feishu merge_forward (opened 2026-05-14) | Platform integration broken for months; fix PR [#160291](https://github.com/NousResearch/hermes-agent/pull/160291) just arrived — needs review |
| **~3 months** | [#93719](https://github.com/NousResearch/hermes-agent/issues/93719) (2026-08-24) + PR [#93891](https://github.com/NousResearch/hermes-agent/pull/93891) (same day) | MCP OAuth scope bug open 3 months with a ready PR; now 3 competing PRs — needs a decision, not more patches |
| **~2 months** | [#121281](https://github.com/NousResearch/hermes-agent/issues/121281) (2026-09-24), `needs-decision` label | Kanban blocker-auth deadlock; tagged `sweeper:risk-automation` — automation risk |
| **~2 months** | [#117800](https://github.com/NousResearch/hermes-agent/issues/117800) (2026-09-21), `sweeper:risk-message-delivery` | **Production infra leak to end users** — security/UX concern |
| **~2 months** | [#103281](https://github.com/NousResearch/hermes-agent/issues/103281) (2026-09-04) | WhatsApp LID/PN identity confusion ingests Meta AI prompts as commands |
| **~2 months** | PR [#109513](https://github.com/NousResearch/hermes-agent/pull/109513) / [#109514](https://github.com/NousResearch/hermes-agent/pull/109514) (2026-09-13) | Skills index-cache correctness fixes stalled 2+ months |
| **~2 months** | [#122010](https://github.com/NousResearch/hermes-agent/issues/122010) (2026-09-24) | Provider fallback crash (`speed` kwarg) — affects hybrid Anthropic/OpenAI deployments |

**Recommendation:** The maintainer team should prioritize (1) triaging the MCP OAuth PR pile-up to merge one canonical fix, (2) reviewing [#160291](https://github.com/NousResearch/hermes-agent/pull/160291) (Feishu) and [#160294](https://github.com/NousResearch/hermes-agent/pull/160294) (Windows gateway) which have same-day fixes, and (3) scheduling a dedicated performance workstream for `state.db`/gateway scaling, since it is the single largest source of user friction.

---

*Digest generated from GitHub activity data for 2026-11-26. All links point to `github.com/NousResearch/hermes-agent`.*

</details>

<details>
<summary><strong>IronClaw</strong> — <a href="https://github.com/nearai/ironclaw">nearai/ironclaw</a></summary>

No activity in the last 24 hours.

</details>

<details>
<summary><strong>QwenPaw</strong> — <a href="https://github.com/agentscope-ai/QwenPaw">agentscope-ai/QwenPaw</a></summary>

# QwenPaw Project Digest — 2026-11-26

## 1. Today's Overview

QwenPaw shows **high-velocity maintenance activity** with 27 issues and 50 PRs updated in the last 24 hours, though no new releases were published. The project is clearly in a **stabilization phase** following the v2.3.0/v2.3.0.post1 release, with a significant share of activity focused on bug fixes, test reliability, and platform-specific regressions (notably Windows). A notable pattern is the emergence of a **single prolific reporter** (`passionworkeer`) filing numerous edge-case bugs in the `qwenpaw-creator` plugin's JSON/parsing utilities, suggesting a focused hardening effort. Meanwhile, 22 PRs were merged/closed, indicating healthy throughput despite the absence of a release. Overall project health is **solid but showing stress** around cross-platform correctness and model/session state management.

## 2. Releases

**No new releases in the last 24 hours.** The most recent tracked release remains v2.3.1-beta.1 (installation verification issue #8861 was closed on 2026-11-25).

## 3. Project Progress

22 PRs were merged or closed in the last 24 hours. Key advancements visible in the pipeline:

- **Code-mode tool invocation fix** — PR [#8923](https://github.com/agentscope-ai/QwenPaw/pull/8923) fixes `run_tool_batch` failing to reach catalog tools inside code mode (directly addressing issue #8903). This is a first-time contributor PR and a meaningful functionality restoration.
- **Media-related 400 error mitigation** — PR [#8920](https://github.com/agentscope-ai/QwenPaw/pull/8920) adds a retry path that strips media from requests when providers return generic `400 Invalid request parameters`, targeting the session-poisoning bug in #8887.
- **Console transcript scroll fix** — PR [#8901](https://github.com/agentscope-ai/QwenPaw/pull/8901) addresses the viewport jump bug #8888, preserving message position across turns.
- **Custom decision model endpoints** — PR [#8928](https://github.com/agentscope-ai/QwenPaw/pull/8928) enables custom decision-model endpoints under Settings → Models.
- **RFC 6901 JSON pointer enforcement** — PR [#8905](https://github.com/agentscope-ai/QwenPaw/pull/8905) fixes wrong-element writes in the creator plugin.
- **Test infrastructure reliability** — PR [#8926](https://github.com/agentscope-ai/QwenPaw/pull/8926) and #8927 address xdist collection ordering and shutdown timing flakes respectively.

Several long-running "Under Review" PRs remain open (memory reranker #8472, append-only session storage #8532, separate memory-writing model #7719), indicating a **backlog of substantial features awaiting review bandwidth**.

## 4. Community Hot Topics

The most-discussed items by comment count:

1. **Issue [#8464](https://github.com/agentscope-ai/QwenPaw/issues/8464)** (6 comments, CLOSED) — Manual `/compact` ignores session-level model switching, always using `agent.json`'s `active_model`. This is a **high-impact correctness bug** affecting users who switch models mid-session; the closure suggests a fix landed.

2. **Issue [#8863](https://github.com/agentscope-ai/QwenPaw/issues/8863)** (5 comments, OPEN) — Windows ReMe tag index permanently fails with "Invalid workspace-relative tag-index path" across both 2.3.0 and 2.3.0.post1. This is a **platform-blocking bug** reproduced on two independent Windows machines. Related PR [#8786](https://github.com/agentscope-ai/QwenPaw/pull/8786) (bump reme-ai to 0.4.2.3) and PR [#8921](https://github.com/agentscope-ai/QwenPaw/pull/8921) (explain unhealthy tag index + rebuild option) are both open, indicating active mitigation.

3. **Issues [#8727](https://github.com/agentscope-ai/QwenPaw/issues/8727), [#8892](https://github.com/agentscope-ai/QwenPaw/issues/8892), [#8891](https://github.com/agentscope-ai/QwenPaw/issues/8891)** (3 comments each) — Responses continuation summary budget exhaustion, AI prompt polishing feature request, and missing glm-5.3/5.4 context table entries respectively.

**Underlying needs analysis:** The hot topics cluster around three themes — (a) **model/session state coherence** (switching models, context windows, reasoning budgets), (b) **Windows platform parity**, and (c) **memory system reliability**. Users are running sophisticated multi-model workflows and hitting edge cases where session state diverges from agent config.

## 5. Bugs & Stability

Ranked by severity:

| Severity | Issue | Description | Fix PR? |
|----------|-------|-------------|---------|
| **Critical** | [#8863](https://github.com/agentscope-ai/QwenPaw/issues/8863) | Windows ReMe tag index permanently fails — memory tags unusable | #8786, #8921 (open) |
| **Critical** | [#8887](https://github.com/agentscope-ai/QwenPaw/issues/8887) | Media data blocks in tool results cause 400 errors poisoning all subsequent messages | #8920 (open) |
| **High** | [#8464](https://github.com/agentscope-ai/QwenPaw/issues/8464) | Manual `/compact` ignores session model switch (CLOSED — likely fixed) | — |
| **High** | [#8727](https://github.com/agentscope-ai/QwenPaw/issues/8727) | Reasoning models consume 4000-token output budget, breaking continuation summary | — |
| **High** | [#8903](https://github.com/agentscope-ai/QwenPaw/issues/8903) | `run_tool_batch` fails in code mode | #8923 (open) |
| **Medium** | [#8877](https://github.com/agentscope-ai/QwenPaw/issues/8877) | Status-less overload in OpenAI-compatible stream bypasses retries | — |
| **Medium** | [#8893](https://github.com/agentscope-ai/QwenPaw/issues/8893) | Console model settings lack agent scope; configured model renders as "no model" | — |
| **Medium** | [#8888](https://github.com/agentscope-ai/QwenPaw/issues/8888) | Transcript jumps back several screens on content height shrink | #8901 (open) |
| **Low** | [#8912](https://github.com/agentscope-ai/QwenPaw/issues/8912), [#8916](https://github.com/agentscope-ai/QwenPaw/issues/8916), [#8914](https://github.com/agentscope-ai/QwenPaw/issues/8914), [#8910](https://github.com/agentscope-ai/QwenPaw/issues/8910), [#8908](https://github.com/agentscope-ai/QwenPaw/issues/8908), [#8906](https://github.com/agentscope-ai/QwenPaw/issues/8906), [#8904](https://github.com/agentscope-ai/QwenPaw/issues/8904) | Parsing/coercion edge cases in creator plugin (JSON extraction, schema handling, pointer tokens) | #8905 (open) |

**Regression note:** Issue #8727 and #8877 both describe retry/fallback logic failing under specific protocol conditions — these represent **reliability regressions in error-handling paths** rather than new features. The cluster of `passionworkeer`-filed parsing bugs suggests the creator plugin's text/JSON handling was under-tested.

## 6. Feature Requests & Roadmap Signals

- **[#8892](https://github.com/agentscope-ai/QwenPaw/issues/8892) AI Prompt Polishing button** — One-click prompt refinement in chat input. Low-complexity, high-user-value; plausible for a minor release.
- **[#8881](https://github.com/agentscope-ai/QwenPaw/issues/8881) Tenant scoping at memory retrieval layer** — Security/isolation hardening for multi-tenant deployments. Architectural, likely a major-version concern.
- **[#8882](https://github.com/agentscope-ai/QwenPaw/issues/8882) Reference-counted archival for long-term memory** — Directly addresses "agent keeps forgetting" complaints. Aligns with PR #7719 (separate memory model) and #8472 (reranker center) — **memory system is clearly a roadmap priority**.
- **[#8880](https://github.com/agentscope-ai/QwenPaw/issues/8880) Skill-scan default mode should block CRITICAL** — Security posture change; small fix, likely soon.
- **[#8878](https://github.com/agentscope-ai/QwenPaw/issues/8878) Egress policy for coding mode** — Deny-by-default metadata endpoints; sandbox hardening.
- **[#8879](https://github.com/agentscope-ai/QwenPaw/issues/8879) Enforce max_processes/max_memory_mb** — Sandbox resource limits currently accepted-but-ignored.

**Prediction:** The next minor release likely bundles the code-mode fix (#8923), media retry (#8920), transcript scroll (#8901), and possibly the reme-ai bump (#8786). Memory architecture changes (#8881/#8882) and sandbox enforcement (#8878/#8879) are larger efforts targeting a later milestone.

## 7. User Feedback Summary

**Pain points:**
- **Windows users are disproportionately affected** — #8863 (memory index), #8888 (WebView2 scroll), #8856 (console clipping). Platform parity is a recurring theme.
- **Multi-model workflows are fragile** — Users switching between models (M1→M2) find session state, compaction, and context tables don't track the active model (#8464, #8891, #8893). This is a **growing sophistication gap**: the product supports model switching but downstream systems don't honor it.
- **"Never forgets" promise vs. reality** — #8882 and #7571 (referenced) show distilled memory entries accumulate without decay, causing both forgetting and clutter.
- **Session poisoning is devastating** — #8887 shows a single media block can break *all subsequent messages* in a session, forcing users to abandon conversations.

**Satisfaction signals:** The detailed, well-reproduced bug reports (multiple with mock transports and cross-machine verification) indicate an **engaged, technically capable user base** willing to invest in the project. The sandbox work (#8878 opener explicitly thanks maintainers) is appreciated.

**Dissatisfaction signals:** Repetitive platform-specific failures and the gap between documented behavior and enforcement (#8879 "honestly — thank you" but still unenforced) suggest users want **claims to match reality**.

## 8. Backlog Watch

Items needing maintainer attention:

1. **PR [#7719](https://github.com/agentscope-ai/QwenPaw/pull/7719)** (OPEN since 2026-09-12, ~75 days) — Separate model for ReMeLight memory writing. **Size/XXL, Under Review.** Long-stalled despite clear value (cost reduction). Pairs with #8882.

2. **PR [#8472](https://github.com/agentscope-ai/QwenPaw/pull/8472)** (OPEN since 2026-10-28, ~29 days) — Reranker model center. **Size/XXXL, Under Review.** Substantial memory-quality feature awaiting review.

3. **PR [#8532](https://github.com/agentscope-ai/QwenPaw/pull/8532)** (OPEN since 2026-11-02, ~24 days) — Append-only session storage + Turn forks. **Size/XXXL, draft.** Foundational for transcript reliability (#8888).

4. **PR [#8554](https://github.com/agentscope-ai/QwenPaw/pull/8554)** (OPEN since 2026-11-03, ~23 days) — Plugin CLI commands and extension points. **Size/XXXL.** Ecosystem-enabling.

5. **PR [#8444](https://github.com/agentscope-ai/QwenPaw/pull/8444)** (OPEN since 2026-10-26, ~31 days) — Linux deb/AppImage packaging. **Size/XL.** Addresses the platform gap where Linux users must use Docker.

6. **Issue [#8173](https://github.com/agentscope-ai/QwenPaw/issues/8173)** (referenced by PR #8268) — TaskTracker run cleanup; the completion-callback half remains open.

**Recommendation:** The volume of large, under-review PRs (4+ at size/XXL or larger) suggests **reviewer bandwidth is the current bottleneck**, not contributor interest. Prioritizing the memory-system cluster (#7719, #8472, #8532) would unblock a coherent feature set.

---

*Data source: github.com/agentscope-ai/QwenPaw — snapshot 2026-11-26. All links verified against provided dataset.*

</details>

<details>
<summary><strong>ZeroClaw</strong> — <a href="https://github.com/zeroclaw-labs/zeroclaw">zeroclaw-labs/zeroclaw</a></summary>

# ZeroClaw Project Digest — 2026-11-26

## 1. Today's Overview

ZeroClaw shows **high-velocity maintenance activity** with 50 PRs and 10 issues touched in the last 24 hours, but the work is dominated by long-running, high-risk infrastructure changes rather than quick wins. Of the 50 PRs updated, 39 remain open — many are XL-sized and carry `risk:high` labels (Goal V1 stack, OIDC refresh grants, plugin dispatch, channel extraction), suggesting the project is deep into a large architectural refactor phase. A notable cluster of fixes and closed issues points to the **v0.9.1 release stabilization** (log rolling, Act-policy enforcement, ACP session rehydration, Anthropic thinking blocks). Two new trackers opened today — the **v1.0.0 roadmap (#12712)** and **daemon-held OIDC refresh grants (#12707)** — signal that leadership is publicly committing to a release trajectory. Overall health is **good but load-heavy**: the merge queue is moving, yet the open-PR count (39) relative to merged/closed (11) indicates a growing review backlog.

## 2. Releases

**No new releases in the last 24 hours.** One release-tagged issue closed today relates to the `release:v0.9.1` milestone:
- [#12643](https://github.com/zeroclaw-labs/zeroclaw/pull/12643) — fix(log): remove rolling trim's temp file on failure and skip startup directory scan
- [#12168](https://github.com/zeroclaw-labs/zeroclaw/pull/12168) — fix(tools): enforce Act policy on `send_message_to_peer`

These indicate v0.9.1 is in its final cleanup window, but no tag has been cut.

## 3. Project Progress

**11 PRs merged/closed today.** Highlights:

| PR | Type | What it advanced |
|---|---|---|
| [#11872](https://github.com/zeroclaw-labs/zeroclaw/pull/11872) | fix(mcp) | Replays tool calls rejected for stale HTTP MCP sessions (spec-compliant 404 handling) |
| [#12345](https://github.com/zeroclaw-labs/zeroclaw/pull/12345) | fix(rpc) | Rehydrates reaped ACP sessions on provider switch |
| [#12168](https://github.com/zeroclaw-labs/zeroclaw/pull/12168) | fix(tools) | Enforces Act policy/autonomy budget on `send_message_to_peer` — **closes security issue #12167** |
| [#12479](https://github.com/zeroclaw-labs/zeroclaw/pull/12479) | fix(providers) | Sends `drop_block` so edited history no longer fails Anthropic thinking requests |
| [#12700](https://github.com/zeroclaw-labs/zeroclaw/pull/12700) | test | Portable fixtures for path/input polling/gateway drain |

**Closed issues:** [security bug #12167](https://github.com/zeroclaw-labs/zeroclaw/issues/12167) (autonomy bypass), [Telegram Rich Messages #8415](https://github.com/zeroclaw-labs/zeroclaw/issues/8415) (iceboxed feature), [detached chat turn #12107](https://github.com/zeroclaw-labs/zeroclaw/issues/12107).

**Advanced (not yet merged):** Goal V1 proposals 2–4/12 are all being re-touched daily; OIDC refresh grants moved to slice 1 (#12716) and slices 2–3 (#12717) today.

## 4. Community Hot Topics

Ranked by comments/reactions on recent activity:

1. **[Tracker #12697 — Split `zeroclaw-runtime` into smaller crates](https://github.com/zeroclaw-labs/zeroclaw/issues/12697)** — 3 comments, 1 👍. Reflects contributor *JordanTheJet*'s push to reduce the monolithic runtime crate. Underlying need: **build times and reviewability** — XL PRs like #10407 and #11881 touch runtime extensively and are hard to review.
2. **[#8415 — Telegram Bot API 10.1 Rich Messages](https://github.com/zeroclaw-labs/zeroclaw/issues/8415)** — 2 👍 (highest reaction on a feature issue). Users want **tables and standard Markdown** in Telegram, a real UX gap in the channel experience.
3. **[#11881 / #11880 / #11879 — Goal V1 proposal stack](https://github.com/zeroclaw-labs/zeroclaw/pull/11881)** — authored by *vrurg*, repeatedly updated but still in draft with **local review FAIL and failed hosted Security/CI Required Gate**. This is the largest unresolved thread in the repo.
4. **[#12712 — Roadmap to v1.0.0](https://github.com/zeroclaw-labs/zeroclaw/issues/12712)** — new tracker (opened 11-25, updated today), 1 comment, 1 👍. Community interest in **release cadence and scope freeze**.
5. **[#11119 — Receiver-discretionary session messaging (RFC #11027)](https://github.com/zeroclaw-labs/zeroclaw/issues/11119)** — high-risk tracker touching identity-access and agent-loop domains.

**Analysis:** The community's dominant interest clusters around (a) architecture decomposition, (b) agent-to-agent trust boundaries, and (c) channel UX polish.

## 5. Bugs & Stability

Ranked by severity based on labels and impact:

| Severity | Issue | State | Fix PR? |
|---|---|---|---|
| **S2 / Security** | [#12167](https://github.com/zeroclaw-labs/zeroclaw/issues/12167) — `readonly` agent can start peer turns (autonomy bypass) | **CLOSED** | ✅ [#12168](https://github.com/zeroclaw-labs/zeroclaw/pull/12168) merged |
| **S2** | [#11760](https://github.com/zeroclaw-labs/zeroclaw/issues/11760) — Email channel re-answers live mail after restart (`\Seen` never set) | OPEN, in-progress | ❌ none yet |
| **S2** | [#12703](https://github.com/zeroclaw-labs/zeroclaw/issues/12703) — Duplicate/sibling report: live-processed messages stay UNSEEN, restart re-answers backlog | OPEN | ❌ none yet |
| **S2** | [#12710](https://github.com/zeroclaw-labs/zeroclaw/issues/12710) — Containerfile `check` stage test fails in StageX image; **no workflow builds the stage** | OPEN | ❌ none yet |

**Notable:** #11760 and #12703 are **the same bug reported twice** (possibly by different users hitting it independently) — this is a real, reproducible email-channel regression affecting anyone running in active mode. The CI issue #12710 is concerning because the "single source of truth" check stage is not actually exercised by any workflow, silently weakening CI guarantees.

## 6. Feature Requests & Roadmap Signals

Active feature/roadmap signals:

- **[#12712 Roadmap to v1.0.0](https://github.com/zeroclaw-labs/zeroclaw/issues/12712)** — replaces the version plan in FND-001 §6. Signals: **release ordering and target dates are being formalized now.**
- **[#11119 A2A session messaging](https://github.com/zeroclaw-labs/zeroclaw/issues/11119)** — implementation tracker for accepted RFC #11027; likely lands in a v1.0-series release.
- **[#12707 OIDC refresh grants (ADR-017)](https://github.com/zeroclaw-labs/zeroclaw/issues/12707)** — with slices #12716/#12717 already in flight, this is **actively targeting the next minor release**.
- **[#8415 Telegram Rich Messages](https://github.com/zeroclaw-labs/zeroclaw/issues/8415)** — closed but was iceboxed; low probability for next version despite user demand.
- **Goal V1 (proposals 2–4/12)** — if the draft stack can pass CI/Security, this is the headline feature of the upcoming cycle.

**Prediction:** The **next version will focus on identity/session hardening** (OIDC refresh, Act-policy enforcement, A2A messaging) rather than chat UX. Goal V1 likely slips unless the review FAIL is resolved.

## 7. User Feedback Summary

- **Pain point — Email channel duplication:** Two independent reports (#11760, #12703) describe the same restart-answers-backlog behavior. Users running production email channels are effectively getting **duplicate agent responses** — a real trust/reputation risk.
- **Pain point — Telegram formatting:** #8415 shows users struggle with tables/Markdown rendering; they resort to legacy workarounds. Satisfaction with the basic channel is fine, but richer UX is requested.
- **Pain point — Long delegates appear frozen:** [PR #11730](https://github.com/zeroclaw-labs/zeroclaw/pull/11730) addresses the case where "a long delegate looked the same whether it was working" — a UX transparency complaint from ZeroCode users.
- **Pain point — CI flakes:** [#12636](https://github.com/zeroclaw-labs/zeroclaw/pull/12636) and [#11907](https://github.com/zeroclaw-labs/zeroclaw/pull/11907) fix flaky/intermittent tests, indicating contributors are losing time to unreliable CI.
- **Satisfaction signal:** Contributors are filing well-structured S2 reports with repro steps (e.g., #12703's precise description of the IMAP `\Seen` flag), suggesting an engaged, technically mature user base.

## 8. Backlog Watch

Items needing maintainer attention:

1. **[#11881 Goal V1 4/12](https://github.com/zeroclaw-labs/zeroclaw/pull/11881)** — Draft since 2026-10-19, **local review FAIL + failed hosted Security/CI gates**, author `needs-author-action` label implied. This is the biggest stalled PR touching the runtime.
2. **[#10407 Persistent session prompt attachments](https://github.com/zeroclaw-labs/zeroclaw/pull/10407)** — Open since **2026-08-27** (~3 months), XL, `risk:high`, touches nearly every subsystem. Review capacity is the bottleneck.
3. **[#11510](https://github.com/zeroclaw-labs/zeroclaw/pull/11510) / [#11727](https://github.com/zeroclaw-labs/zeroclaw/pull/11727) / [#11730](https://github.com/zeroclaw-labs/zeroclaw/pull/11730)** — All ZeroCode UX PRs by *Audacity88* sitting with `needs-author-action` since October.
4. **[#11760 Email `\Seen` bug](https://github.com/zeroclaw-labs/zeroclaw/issues/11760)** — Open since 2026-10-15 with `status:in-progress` but **no linked fix PR**; now duplicated by #12703. Should be triaged today.
5. **[#11119 A2A tracker](https://github.com/zeroclaw-labs/zeroclaw/issues/11119)** — Open since 2026-09-25, only 1 comment; a high-risk architectural tracker that may need a design review to unblock.

**Bottom line:** ZeroClaw is healthy and active, but the open-PR backlog (39) and the number of `needs-author-action`/stale-draft items indicate **review bandwidth, not contributor enthusiasm, is the limiting factor**. The clearest urgent action is consolidating the duplicate email `\Seen` bug (#11760 / #12703) into a single fix.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*