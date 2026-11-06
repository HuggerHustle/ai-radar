# OpenClaw Ecosystem Digest 2026-11-06

> Issues: 500 | PRs: 500 | Projects covered: 5 | Generated: 2026-11-06 01:28 UTC

- [OpenClaw](https://github.com/openclaw/openclaw)
- [Hermes Agent](https://github.com/nousresearch/hermes-agent)
- [IronClaw](https://github.com/nearai/ironclaw)
- [QwenPaw](https://github.com/agentscope-ai/QwenPaw)
- [ZeroClaw](https://github.com/zeroclaw-labs/zeroclaw)

---

## OpenClaw Deep Dive

# OpenClaw Project Digest — 2026-11-06

## 1. Today's Overview

OpenClaw shows a **high-velocity but stability-strained** development cadence. In the last 24 hours, 500 issues and 500 PRs were updated, with 241 issues still active and 321 PRs open — a backlog-heavy ratio that suggests the project is accumulating unresolved work faster than it can merge. One new release shipped (`v2026.11.1`), focused on Mac config safety and channel reply reliability. The comment leaderboard is dominated by **P0/crash-loop regressions** (Gateway event-loop blocking, Windows restart unreliability, plugin state deadlocks), indicating that several long-running stability issues remain unaddressed across multiple releases. Meanwhile, PR activity is overwhelmingly UI/CI polish (web-ui spacing, CI test ownership, iOS composer fixes) rather than core architecture — a sign maintainers are in a maintenance-and-hardening phase rather than feature expansion.

## 2. Releases

**v2026.11.1** — `openclaw 2026.11.1`

Highlights:
- **Safer Mac settings**: failed config saves no longer overwrite secrets; disabling Tailscale exposure keeps Gateway authentication intact. (#187734, #187664 — fixes #187600, #187597, thanks @anmol0b)
- **More reliable channel replies**: improvements to Telegram, Discord, and webhook conversation delivery (summary truncated in release notes).

No breaking changes or migration notes are declared in the visible release text. However, note that Issue #141474 explicitly states the historical-state recovery fix (#164445) is **only in prerelease `v2026.11.5-beta.1`**, not in stable `v2026.11.1` — so users on stable should not expect that fix yet.

## 3. Project Progress

Today's merged/closed activity (179 PRs merged/closed of 500 updated) is skewed toward **incremental hardening rather than headline features**. Notable closed items:

- **#171122 [CLOSED]** — PID-1 census abort on the update-runtime retention path (stable 2026.10.3) — resolved.
- **#143274 [CLOSED]** — rate-limit `Retry-After` failover regression in 2026.9.3 — resolved as not-repro on main.
- **#135117 [CLOSED]** — Discord wrong-channel heartbeat replay (security + message-loss) — closed.
- **#126874 [CLOSED]** — Windows CI covering only 0.60% of test suite — closed (though the underlying coverage gap remains a concern).
- **#149806 / #148033 / #147732 [CLOSED]** — run_stalled takeover logging, context-engine `senderId` recall bug, and RTL chat direction — all closed.

**PRs advancing today (open, top of queue):** UI polish dominates — native link-menu icon spacing (#193848), compact task progress markers (#193864), accent palette reload perf (#193851), People-filter focus return (#193310), and a substantial Gateway downtime visibility fix (#191935). Core-impact PRs worth watching: **#193844 (P1, queue human input behind quiet automation runs)**, **#192552 (avoid unnecessary cold-start init)**, and **#193842 (Postgres staged commit refusals — security-boundary)**.

## 4. Community Hot Topics

| Rank | Issue/PR | Comments | Signal |
|------|----------|----------|--------|
| 1 | [#160959](https://github.com/openclaw/openclaw/issues/160959) — Gateway blocks for minutes capturing large external plugins (2026.9.6 regression) | 74 | 🦞 diamond lobster, P0 crash-loop |
| 2 | [#170956](https://github.com/openclaw/openclaw/issues/170956) — Windows slow startup, unclean plugin shutdown, schtasks permission error | 29 | P0 ux-release-blocker |
| 3 | [#178359](https://github.com/openclaw/openclaw/issues/178359) — `doctor --fix --non-interactive` idles 15+ min | 25 | P1 crash-loop, macOS |
| 4 | [#166634](https://github.com/openclaw/openclaw/issues/166634) — Late reclamation checkpoint failure leaves agent unavailable after crash | 24 | Silver shellfish |
| 5 | [#191944](https://github.com/openclaw/openclaw/issues/191944) — `gateway stop` fails on macOS with ProcessInspectionError | 19 | P2 ux-friction, very recent |
| 6 | [#161921](https://github.com/openclaw/openclaw/issues/161921) — doctor/plugins update circular dependency after state migration | 18 | P0 release-blocker |
| 7 | [#40001](https://github.com/openclaw/openclaw/issues/40001) — `write` tool lacks append mode; cron sessions destroy shared files | 17 | 🦞 diamond, P0 data-loss (open since March) |

**Underlying need analysis:** The top threads cluster around three themes — (a) **Gateway lifecycle fragility** (startup blocking, shutdown inspection, crash recovery), (b) **state/plugin migration deadlocks** that strand users between releases, and (c) **cross-platform parity gaps**, especially Windows and macOS managed-service paths. Issue #40001 is particularly telling: a **8-month-old P0 data-loss bug** with an append-mode request that remains open, suggesting product-decision latency on core tool semantics.

## 5. Bugs & Stability

Ranked by severity:

**P0 / crash-loop / data-loss:**
- [#160959](https://github.com/openclaw/openclaw/issues/160959) — Gateway event-loop blocked for minutes by large plugins. **No fix PR.** 🦞 diamond.
- [#40001](https://github.com/openclaw/openclaw/issues/40001) — `write` tool overwrites shared files; isolated cron sessions cause silent data loss. **No fix PR.** 🦞 diamond.
- [#70903](https://github.com/openclaw/openclaw/issues/70903) — Persistent file-based provider cooldown blocks users hours after billing recovery. 🦞 diamond.
- [#142821](https://github.com/openclaw/openclaw/issues/142821) — Default-on transcript redaction poisons replayed context (masks propagate into commands/files/replies). 🦞 diamond, security + data-loss.
- [#158912](https://github.com/openclaw/openclaw/issues/158912) — `MEMORY.md` no longer injected at bootstrap on 2026.9.6, docs contradict behavior. P0.
- [#161921](https://github.com/openclaw/openclaw/issues/161921) — doctor/plugins update circular dependency. P0 release-blocker.
- [#166017](https://github.com/openclaw/openclaw/issues/166017) — `mcp.sessionIdleTtlMs` default not applied; spawn broker fills to 256-child cap. P1, linked PR open.

**P1:**
- [#170956](https://github.com/openclaw/openclaw/issues/170956) — Windows restart/update unreliability. P0 tag but silver severity.
- [#178359](https://github.com/openclaw/openclaw/issues/178359) — doctor idle hang.
- [#155563](https://github.com/openclaw/openclaw/issues/155563) — service-child relay/MCP groups retained after turn (2026.9.5 regression).
- [#191847](https://github.com/openclaw/openclaw/issues/191847) — Large session kills 512 MB SQLite worker (`ERR_WORKER_OUT_OF_MEMORY`), every turn fails. **New, 2026.10.10 regression.**
- [#182647](https://github.com/openclaw/openclaw/issues/182647) — Cloud-worker turns fail before inference ("Session capability metadata requires worker preparation"). Has queueable-fix tag.
- [#162637](https://github.com/openclaw/openclaw/issues/162637) — Native Codex completion handoff fails with `SESSION_WORK_START_CHANGED`.

**Regression watch:** #191847, #160959, #155563, #191944 are all explicitly version-scoped regressions — a pattern that warrants a systematic regression-gate review. Most P0s lack fix PRs (`clawsweeper:no-new-fix-pr`), which is the single biggest health concern in this dataset.

## 6. Feature Requests & Roadmap Signals

Active feature requests, ranked by likely near-term delivery:

- [#193815 (PR)](https://github.com/openclaw/openclaw/pull/193815) — CJK bigram companion FTS index for two-character queries. **Already has an open PR** — strong candidate for near-term merge given the memory-core focus.
- [#164620](https://github.com/openclaw/openclaw/issues/164620) — Setting to disable hosted plugin catalog feed (privacy/air-gap need).
- [#131457](https://github.com/openclaw/openclaw/issues/131457) — Feishu (Lark) progress-streaming mode, matching Slack/Discord/Telegram parity. 🦞 diamond.
- [#140244](https://github.com/openclaw/openclaw/issues/140244) — `--prompt-file` for `openclaw infer model run` (automation ergonomics).
- [#158800](https://github.com/openclaw/openclaw/issues/158800) — Browse/fork prior channel-chat segments after `/new` in Control UI.
- [#137110](https://github.com/openclaw/openclaw/issues/137110) — Telegram `sendDice` support (linked PR open).

**Prediction:** Given the current maintenance-heavy PR mix, expect **#193815 (CJK search)** and possibly **#137110 (sendDice)** to land first. Channel-parity items (Feishu streaming) and Control UI history features are more likely to slip to a later release unless a maintainer picks them up.

## 7. User Feedback Summary

**Pain points (dissatisfaction):**
- **Update/restart friction** is the loudest recurring complaint — Windows users report "pas na veel proberen" (only after many retries) for restarts/updates (#170956), and macOS users hit `ProcessInspectionError` on `gateway stop` (#191944). Users feel update flows are unreliable.
- **Silent data loss** (#40001, #142821) erodes trust, especially in cron/automation use cases where users aren't watching.
- **Diagnostic opacity**: `doctor --fix` hangs with no output (#178359), `run_stalled` takeovers aren't logged (#149806), and `registerCliBackend` failures surface as misleading "Invalid URL" errors (#172969). Users want *actionable* failure messages.
- **Docs drift**: MEMORY.md behavior contradicts documentation (#158912).

**Satisfaction signals:**
- Positive reception to the v2026.11.1 Mac secrets/Tailscale fixes (thanked contributor @anmol0b).
- Constructive, detailed bug reports (many with reproductions, version pins, and root-cause hypotheses) indicate an engaged, technically sophisticated user base willing to help.

**Net sentiment:** Frustration is concentrated on **reliability of the operational surface** (install/update/restart/recovery) rather than on the agent's core capabilities — a favorable sign that the product's value proposition is intact but its operational polish lags.

## 8. Backlog Watch

Long-unanswered or high-importance items needing maintainer attention:

- [#40001](https://github.com/openclaw/openclaw/issues/40001) — **Open since 2026-03-08 (8 months)**, P0 data-loss, needs-product-decision. This is the most glaring backlog item.
- [#70903](https://github.com/openclaw/openclaw/issues/70903) — Open since 2026-04-24, P0 auth-provider, stale + needs-product-decision.
- [#121232](https://github.com/openclaw/openclaw/issues/121232) — memory-core dreaming ranker/applier disagreement ("Ranked N, Promoted 0" forever), open since 2026-08-09, needs-product-decision.
- [#125314](https://github.com/openclaw/openclaw/issues/125314) — Codex direct message tool schema serialization; prior PR #125897 closed unmerged for inactivity — a case of **contributor attrition** worth re-engaging.
- [#150743](https://github.com/openclaw/openclaw/issues/150743) — QQ channel sustainability; Tencent handoff stalled, long-term support unclear (closed but unresolved ecosystem concern).
- [#142606](https://github.com/openclaw/openclaw/issues/142606) — Dashboard HTML widget links dead in native apps; needs-live-repro, 🐚 platinum hermit.

**Health verdict:** OpenClaw is a **mature, high-throughput project with a growing operational-reliability debt**. The strongest lever for maintainers right now is not new features but (1) assigning owners to the cluster of P0 `no-new-fix-pr` issues, (2) establishing a regression gate to catch version-scoped breakages like #160959 and #191847, and (3) closing product-decision bottlenecks on the 8-month-old #40001. Contributor energy is clearly present — the project's challenge is triage throughput, not community engagement.

---

## Cross-Ecosystem Comparison

# Cross-Project Comparison Report — Personal AI Assistant / Agent Open-Source Ecosystem
**Date: 2026-11-06** · Sources: OpenClaw, Hermes Agent, IronClaw, QwenPaw, ZeroClaw community digests

---

## 1. Ecosystem Overview

The personal AI assistant / agent open-source ecosystem is bifurcating into two distinct postures: **high-throughput projects entering reliability-consolidation phases** (OpenClaw, Hermes Agent, QwenPaw, ZeroClaw) versus **quiet or dormant projects** (IronClaw, no activity in 24h). Across all active projects, the dominant engineering work has shifted decisively from feature expansion to **operational hardening** — Gateway lifecycle fragility, identity/principal boundaries, memory-index correctness, and silent data-loss classes dominate the issue trackers. A shared architectural convergence is visible: every active project is wrestling with the same primitives — session persistence, plugin isolation, cross-machine collaboration, and durable state replay. Meanwhile, contributor engagement is strong and technically sophisticated (detailed repros, root-cause hypotheses, fix PRs), but maintainer **review bandwidth is the binding constraint** across the board.

---

## 2. Activity Comparison

| Project | Issues Updated (24h) | Open Issues | PRs Updated (24h) | Open PRs | Merged/Closed PRs (24h) | Release Status | Health Score |
|---|---|---|---|---|---|---|---|
| **OpenClaw** | 500 | 241 | 500 | 321 | 179 | v2026.11.1 (stable); v2026.11.5-beta.1 | **6.5/10** — high velocity, growing backlog debt, P0s without fix PRs |
| **Hermes Agent** | 50 | 38 | 50 | 39 | 11 | v0.23.0 "Hearth" (post-release stabilization) | **7.5/10** — strong triage, no open P0, review bandwidth pressure |
| **IronClaw** | 0 | — | 0 | — | 0 | None | **N/A** — inactive |
| **QwenPaw** | 14 | ~10 | 33 | ~20 | 13 | v2.3.0b3 (beta); v2.2.2.post1 (stable) | **7.0/10** — active, but recurring memory bug (#8040) and aging XXXL PRs |
| **ZeroClaw** | 30 | ~25 | 50 | 48 | 2 | v0.9.0 (in development, security-focused) | **6.5/10** — coordinated security sweep, but 2 merges vs 48 open PRs |

> *Health scores are analyst judgments derived from activity balance, P0 resolution rate, backlog age, and review throughput — not official project metrics.*

**Key observations:**
- **OpenClaw** has ~10× the absolute activity of peers but a **1:1.06 issue-to-PR backlog ratio** — accumulating faster than it merges.
- **Hermes Agent** is the only project with **zero open P0s** and same-day closures on new bug reports.
- **ZeroClaw** shows the most skewed merge ratio (2 merged vs 48 open), a classic security-sweep-in-progress signature.
- **QwenPaw** has the best merge-to-backlog balance among mid-sized projects (13 merged of 33 updated).

---

## 3. OpenClaw's Position

### Advantages vs. Peers
- **Scale of community**: 500 issues + 500 PRs updated in 24h is an order of magnitude beyond any peer — OpenClaw has the largest contributor surface in the ecosystem.
- **Formal release cadence**: v2026.11.1 stable + active beta channel, with explicit security fixes (Mac secrets, Tailscale auth). Peers are either pre-release (Hermes v0.23.0 stabilization) or mid-cycle (ZeroClaw v0.9.0 dev, QwenPaw betas).
- **Broadest channel surface**: Telegram, Discord, webhook, Feishu, QQ, iOS — channel-parity is a defining feature.

### Weaknesses vs. Peers
- **Backlog debt is the worst in class**: A 241-open-issue backlog with multiple P0 `no-new-fix-pr` tags, and an **8-month-old P0 data-loss bug (#40001)**. Hermes Agent closes new bugs same-day; OpenClaw lets P0s age for months.
- **Product-decision latency**: Multiple "needs-product-decision" tags indicate triage throughput — not engagement — is the bottleneck.
- **Regression pattern**: Four version-scoped regressions (#191847, #160959, #155563, #191944) with **no systematic regression gate** — an engineering-process gap peers don't exhibit as acutely.

### Technical Approach Differences
- OpenClaw's Gateway is a **heavyweight single-process orchestrator** with a plugin catalog, PID-1 update runtime, and SQLite workers — which is precisely why its P0s cluster around **Gateway lifecycle fragility** (event-loop blocking, restart unreliability, checkpoint failures). Peers like Hermes have moved to a similar architecture (#106742) and are hitting analogous post-merge turbulence, suggesting OpenClaw is ~1 release ahead on the same architectural curve.
- OpenClaw's **tool-semantics decisions are lagging** (#40001 append mode) — a symptom of scale outpacing product governance.

### Community Size Comparison
Rough proxy from digest signals: **OpenClaw ≫ Hermes Agent > ZeroClaw ≈ QwenPaw ≫ IronClaw (inactive)**. OpenClaw's comment leaderboard shows 74-comment threads; Hermes' top thread hit 227 comments but on a single tracking issue (concentrated), and QwenPaw's top thread has 8 comments.

---

## 4. Shared Technical Focus Areas

The following requirements emerge **independently across multiple projects**, signaling ecosystem-level primitives rather than project-specific bugs:

| Shared Focus | Projects | Specific Need |
|---|---|---|
| **Gateway/runtime stabilization** | OpenClaw (#160959), Hermes (#134889, #143547), ZeroClaw (#9572) | Event-loop blocking, process-tree cleanup, worker-stack overflow, restart reliability |
| **Identity / principal boundaries** | ZeroClaw (#11123–#11127, #12046, #12051), Hermes (#147387 token-mode auth), OpenClaw (Tailscale auth) | Wildcard tool selectors, scoped non-admin principals, session-ownership fail-closed |
| **Memory/retrieval reliability** | QwenPaw (#8040 CJK reindex, #8276, #8580), OpenClaw (#158912 MEMORY.md), Hermes (#149763 compaction), ZeroClaw (#12145 plugin store limiter) | Silent-drop prevention, tag-index rebuild, pluggable backends, per-item token validation |
| **Silent data-loss / silent-failure classes** | OpenClaw (#40001, #142821), QwenPaw (#8040), ZeroClaw (#9779, #9770, #12228, #12194) | Operations that "succeed" but do nothing; append-mode semantics; declarative-job persistence |
| **Cross-machine / multi-bot collaboration** | Hermes (#97681, #149655, #149702), OpenClaw (#131457 channel parity), ZeroClaw (#9597 peer-agent turns) | Bots collaborating across gateways without centralizing control |
| **Plugin isolation / extensibility** | OpenClaw (plugin state deadlocks), Hermes (#85370 emit_waterfall), QwenPaw (#8469 MCP-as-plugin, #7842 hook isolation), ZeroClaw (#8560 plugin routes) | Safe hooks, event-loop lag watchdogs, plugin-owned auth routes |
| **Durable/replayable session state** | ZeroClaw (#10526 append-only RFC, accepted), QwenPaw (#8532 append-only SQLite), Hermes (#69194 checkpointing), OpenClaw (checkpoint failures) | Deterministic replay, append-only event history, pre-command checkpoints |
| **Windows / cross-platform parity** | OpenClaw (#170956), QwenPaw (#8585, #8234 GBK), Hermes (#135171 launchd, #135812) | Path canonicalization, process supervision, non-UTF-8 file handling |

**The strongest convergent signal**: **append-only/durable session state** is independently arriving in ZeroClaw (accepted RFC), QwenPaw (XXXL PR), and Hermes (checkpointing fix) — this is becoming the ecosystem's de-facto persistence architecture.

---

## 5. Differentiation Analysis

| Dimension | OpenClaw | Hermes Agent | QwenPaw | ZeroClaw | IronClaw |
|---|---|---|---|---|---|
| **Primary focus** | Broad channel coverage + Gateway orchestration | Unified gateway + multi-surface (CLI/TUI/Desktop/API) | Agent framework + ReMe memory + plugin ecosystem | Security/identity hardening + SOP/cron runtime | (inactive) |
| **Target users** | General assistant users, multi-channel operators | Developers, multi-profile/power users, CI/cron operators | Framework builders, Chinese-language users | Security-conscious enterprise, scoped-principal deployments | — |
| **Architecture** | Heavyweight Gateway, SQLite workers, plugin catalog | Unified single-gateway owning all local sessions | Plugin-extensible core (MCP extractable), ReMe memory | Principal-aware runtime, append-only replay (planned), Rust/WASM UI debate | — |
| **Distinctive feature** | Channel parity (Telegram/Discord/Feishu/QQ/iOS) | Cross-machine bot collaboration + bot packs | ReMe memory + Creator workflow | SOP decision gates + Goal Mode (planned) | — |
| **Release posture** | Stable + beta channel, docs drift | Post-major-release consolidation | Beta-forward (v2.3.0b3) | Security-focused v0.9.0 in dev | Dormant |
| **Language/community** | English-dominant, global | English-dominant, large contributor base (666) | Bilingual (CJK issues prominent) | English, enterprise-leaning | Unknown |

**Key differentiators:**
- **OpenClaw** competes on **breadth** (channels, surfaces) — a horizontal integration play.
- **Hermes Agent** competes on **depth of local ownership** (one gateway owns every session) and is furthest along the cross-machine collaboration roadmap.
- **QwenPaw** is the most **framework/ecosystem-oriented**, with a plugin catalog and a distinct memory subsystem (ReMe) — closest to a "platform" rather than an "assistant."
- **ZeroClaw** is uniquely **security-first**, with a principal/identity model that peers treat as an afterthought — its append-only replay RFC is the most architecturally ambitious direction in the cohort.

---

## 6. Community Momentum & Maturity

### Activity Tiers

| Tier | Projects | Characteristics |
|---|---|---|
| **Tier 1 — High-velocity, backlog-strained** | **OpenClaw** | 500+ daily updates, growing unresolved backlog, P0s aging 8 months, mature but triage-limited |
| **Tier 2 — High-velocity, responsive** | **Hermes Agent**, **QwenPaw**, **ZeroClaw** | 50–100 daily updates, same-day or near-term triage, but review bandwidth is the constraint |
| **Tier 3 — Dormant** | **IronClaw** | No activity — status unclear (paused, sunset, or pre-launch) |

### Momentum Classification

- **Rapidly iterating**: **QwenPaw** (13 merges/day, beta-forward), **ZeroClaw** (coordinated security sweep, multiple XL PRs in flight).
- **Stabilizing post-release**: **Hermes Agent** (v0.23.0 aftermath, gateway cutover settling, no open P0 — the healthiest stability posture).
- **Mature but debt-accumulating**: **OpenClaw** (highest throughput, but the backlog ratio and P0 aging indicate process debt is outrunning governance).
- **Inactive**: **IronClaw**.

### Maturity Assessment
By **process maturity** (not codebase size): **Hermes Agent > QwenPaw ≈ ZeroClaw > OpenClaw > IronClaw**.
By **community size/engagement**: **OpenClaw > Hermes Agent > ZeroClaw ≈ QwenPaw > IronClaw**.

The notable inversion: OpenClaw has the **largest community but the weakest triage throughput**, while Hermes Agent has a **smaller (but still large) community with the strongest triage**. This suggests community size alone is not predictive of project health at this stage of the ecosystem's maturity.

---

## 7. Trend Signals

The following industry trends are extractable from cross-project community feedback, with implications for AI agent developers:

### Trend 1: Operational reliability is the new competitive battleground
Every active project's top issues are **reliability**, not capability: Gateway lifecycle, restart/update friction, silent failures. **Implication**: The ecosystem's value proposition (agent capability) is largely proven; differentiation now happens at the **operational surface** (install/update/restart/recovery). Developers should invest in **regression gates** and **actionable failure diagnostics** (Hermes' same-day closures and named-folder errors are best-practice signals).

### Trend 2: Silent failure is the #1 trust killer
Across OpenClaw (#40001 data loss), QwenPaw (#8040 dropped CJK chunks), and ZeroClaw (#9779, #9770, #12228 — "no error, no warning, no log line"), users repeatedly report operations that **report success while doing nothing**. **Implication**: A **"fail loudly" design principle** — per-item validation, explicit no-op warnings, and success-log integrity — is becoming a differentiating quality bar.

### Trend 3: Append-only / durable state replay is converging as the standard
ZeroClaw accepted an append-only event-history RFC; QwenPaw has an XXXL append-only SQLite PR; Hermes fixed checkpoint-bypass for destructive commands. **Implication**: Mutable conversation persistence is being replaced by **deterministic event logs** — developers building new agents should design for replayability from the start.

### Trend 4: Identity/principal boundaries are moving from afterthought to first-class
ZeroClaw's entire security sweep, Hermes' token-mode auth fixes, and OpenClaw's Tailscale/auth fixes all point to **principal-aware tool execution** becoming table stakes. **Implication**: Wildcard tool selectors and principal-unaware execution are now recognized **vulnerability classes** — design tools with explicit principal scoping.

### Trend 5: Cross-machine, multi-bot collaboration is the next frontier
Hermes (#97681, 4 👍, shipping PRs), ZeroClaw (#9597 peer-agent turns), and OpenClaw (channel parity) all converge on **collaboration without centralization**. **Implication**: The next architectural wave is **federated agent coordination** — developers should watch Hermes' cross-gateway group chat as the leading implementation.

### Trend 6: Review bandwidth is the ecosystem's binding constraint
OpenClaw's 321 open PRs, ZeroClaw's 48 open PRs vs 2 merges, QwenPaw's aging XXXL PRs — every project is **review-limited, not contribution-limited**. **Implication**: For maintainers, the highest-leverage investment is **triage automation** (Hermes' same-day closures and CI cost-reduction PRs are instructive); for contributors, expect longer review latency and design PRs for **smaller, independently-reviewable increments**.

### Trend 7: Plugin ecosystems are forming — but friction is high
Hermes (plugin catalog, bot packs), QwenPaw (install failures, navigation regressions), ZeroClaw (plugin store limiters), OpenClaw (plugin state deadlocks) all show **plugin infrastructure as a growth area with real friction**. **Implication**: The ecosystem is transitioning from "monolithic assistant" to "extensible platform" — the projects that solve plugin isolation, install reliability, and security scanning false-positives will win the ecosystem layer.

---

### Bottom Line for Decision-Makers

- **Choose OpenClaw** for breadth of channels and community scale — but budget for operational fragility and slow P0 resolution.
- **Choose Hermes Agent** for the healthiest stability posture and roadmap momentum on cross-machine collaboration.
- **Choose QwenPaw** for a framework/platform-oriented, bilingual, memory-centric stack — but watch the recurring ReMe memory bugs.
- **Choose ZeroClaw** for security-first, principal-aware deployments — its v0.9.0 security release and append-only replay direction are architecturally ahead.
- **Watch IronClaw** — inactivity suggests the project may need a status clarification from maintainers.

The ecosystem as a whole is **maturing from capability race to reliability race**, with **durable state, identity boundaries, and federation** as the three architectural vectors that will define the next 6–12 months.

---

## Peer Project Reports

<details>
<summary><strong>Hermes Agent</strong> — <a href="https://github.com/nousresearch/hermes-agent">nousresearch/hermes-agent</a></summary>

# Hermes Agent — Project Digest
**Date: 2026-11-06** · Repo: [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent)

---

## 1. Today's Overview

Hermes Agent is in an intense post-release consolidation phase following **v0.23.0 "The Hearth Release"** (Nov 5), a massive cycle spanning ~10,080 commits and ~1,950 merged PRs. Activity remains very high: 50 issues and 50 PRs updated in 24h (38 open issues / 39 open PRs), with 12 issues closed and 11 PRs merged or closed. The dominant theme is **stabilization of the unified gateway (#106742, merged Oct 14)** — its post-merge fallout generates the two most-commented issues today ([#134889](https://github.com/NousResearch/hermes-agent/issues/134889), [#143547](https://github.com/NousResearch/hermes-agent/issues/143547)), with follow-on work spread across sessions, profiles, Desktop, cron, and group chats. Health signal: maintainers are converting regressions into tracked fix work quickly, but the volume of gateway-related P2/P3 bugs suggests the cutover is still settling. Meanwhile, ecosystem growth continues — plugin catalog additions (Keln provider, hermes-phone, "stage") and a cross-machine group chat feature are moving through review.

**Activity assessment: very high, transition/stabilization mode.**

---

## 2. Releases

### v0.23.0 — "The Hearth Release" (released 2026-11-05)

| Metric | Since v0.22.0 |
|---|---|
| Commits | ~10,080 |
| Merged PRs | ~1,950 |
| Files changed | ~8,720 |
| Insertions / Deletions | ~725,200 / ~201,400 |
| Issues closed | ~850 |
| Contributors | 666 |

- **Migration notes:** No explicit breaking-change list was published in the release excerpt. However, the release lands directly on top of the **unified gateway runtime** ([#106742](https://github.com/NousResearch/hermes-agent/pull/106742)), which already moved every local conversation into a single gateway process (CLI, TUI, Desktop, API server, editors, messaging bots, cron, Kanban, group chats). Practically, v0.23.0 users inherit that architectural shift, and the two gateway tracking issues below should be treated as required reading before upgrading multi-profile or multi-surface setups.
- **Recommended caution:** Users with many profiles, Windows, or launchd-supervised gateways should review the open post-merge issues (§5) before rolling out broadly.

---

## 3. Project Progress

**Merged/closed PRs today (11):**

- [#132414](https://github.com/NousResearch/hermes-agent/pull/132414) — **fix(kanban): reap browser daemons on worker reclaim.** Best-effort browser process-tree cleanup after kanban worker termination; reaps agent-browser socket dirs by owner PID. *Stability fix.*
- [#69194](https://github.com/NousResearch/hermes-agent/pull/69194) — **fix(agent): checkpoint every terminal workdir.** Closes a real safety gap: checkpoints no longer depend on `_is_destructive_command()` string matching, so `/bin/rm`, `find -delete`, or Python `Path.unlink()` get pre-command checkpoints. *Important rollback-safety improvement.*
- [#140901](https://github.com/NousResearch/hermes-agent/pull/140901) — **fix(api): make tools/tool_choice part of a keyed retry's identity.** Prevents `POST /v1/chat/completions` idempotent retries from replaying a stale answer when only tools change. *Correctness fix for API users.*

**Notable open PRs advancing today:**

- [#149655](https://github.com/NousResearch/hermes-agent/pull/149655) — seat a bot from another computer's gateway into a gateway-owned group chat (salvage of #148466); paired with [#149702](https://github.com/NousResearch/hermes-agent/pull/149702) to let Desktop create cross-machine group chats that run without Desktop open. *Directly advances the #106742 vision.*
- [#149763](https://github.com/NousResearch/hermes-agent/pull/149763) — subagent memory compaction under `checkpoint_required`.
- [#149785](https://github.com/NousResearch/hermes-agent/pull/149785) — `read_file` error messages now name the missing folder (port of opencode#60688), reducing model path-guessing.
- [#149786](https://github.com/NousResearch/hermes-agent/pull/149786) — CI cost reduction by merging small same-runner jobs (billing-rounding optimization).
- [#149132](https://github.com/NousResearch/hermes-agent/pull/149132) — fence session ownership across profile stores; ambiguous ownership fails closed.

**Closed issues of note:** [#134889](https://github.com/NousResearch/hermes-agent/issues/134889) (unified gateway post-merge tracking, 227 comments) closed; [#135812](https://github.com/NousResearch/hermes-agent/issues/135812) (unbounded sidecar logs on Windows) closed; [#139551](https://github.com/NousResearch/hermes-agent/issues/139551) (doctor false key demands) closed; [#149787](https://github.com/NousResearch/hermes-agent/issues/149787) and [#149195](https://github.com/NousResearch/hermes-agent/issues/149195) closed same-day as filed — **fast turnaround on new bug reports.**

---

## 4. Community Hot Topics

1. **[#134889](https://github.com/NousResearch/hermes-agent/issues/134889)** — *[CLOSED]* Tracking: one gateway owns every local session — post-merge fixes. **227 comments.** The single largest discussion in the project today; spans CLI, gateway, Desktop, sessions, profiles, Windows compatibility. Closed today after ~1 month, but its follow-ups continue.
2. **[#143547](https://github.com/NousResearch/hermes-agent/issues/143547)** — *[OPEN]* Unified gateway: open post-merge problems on main, continuing #134889. **50 comments.** Explicit continuation — signals the community wants a durable place to funnel gateway regressions rather than scattered reports.
3. **[#131859](https://github.com/NousResearch/hermes-agent/issues/131859)** — *[OPEN, blocked/cause-upstream]* Cannot open a PR via API (CreatePullRequest permission error). **56 comments, open since Oct 3.** Not a product bug — a GitHub-side/permissions issue affecting one contributor; still unresolved.
4. **[#97681](https://github.com/NousResearch/hermes-agent/issues/97681)** — *[OPEN]* Let Bots collaborate across gateways. **40 comments, 4 👍 — highest reaction count today.** Foundation work for cross-machine and cross-owner bot collaboration without giving up control; clearly a strategic roadmap item.
5. **[#122609](https://github.com/NousResearch/hermes-agent/issues/122609)** — *[OPEN, bot-filed]* Skills index watchdog: index is stale/degraded (28.1h old vs 26h limit). **19 comments.** Recurring automated freshness probe failure; ongoing infrastructure papercut.
6. **[#149630](https://github.com/NousResearch/hermes-agent/pull/149630)** — `/undo` now points at `/rollback` to restore undone turns' files (teknium1, ci-reviewed). High-visibility UX refinement.

**Underlying needs:** (a) A stable, well-documented unified gateway contract — most heat is here; (b) multi-bot/multi-machine collaboration as the community's next frontier; (c) reliable automation infrastructure (skills index, CI).

---

## 5. Bugs & Stability

**P0 / P1:**
- None open at P0 today. The one P0-tagged item ([#134889](https://github.com/NousResearch/hermes-agent/issues/134889)) is **closed**.

**P2 (high-impact, ranked):**
1. [#143547](https://github.com/NousResearch/hermes-agent/issues/143547) — *OPEN.* Unified gateway post-merge problems across cron/plugins/Telegram/Discord/auth/sessions/compression. **No single fix PR; being worked via multiple PRs.** Highest aggregate risk.
2. [#135171](https://github.com/NousResearch/hermes-agent/issues/135171) — *OPEN.* `hermes update` kills launchd gateway wrapper processes as "unmapped manual gateways," leaving a permanent restart warning. **macOS multi-profile users affected; no fix PR linked.**
3. [#145314](https://github.com/NousResearch/hermes-agent/issues/145314) — *OPEN.* Quiet cron script leaves a permanent empty session every firing (non-`no_agent` path). Reproducer points at `cron/scheduler.py:2336`. **No fix PR yet.**
4. [#141755](https://github.com/NousResearch/hermes-agent/issues/141755) — *OPEN.* Skills security scanner false-positives block legitimate community skill `book-to-skill` (132 findings). **Trust/supply-chain friction; no fix PR linked.**
5. [#147387](https://github.com/NousResearch/hermes-agent/issues/147387) — *OPEN.* Gated dashboard middleware rejects Desktop token-mode credentials (`X-Hermes-Session-Token` / `?token=`); Remote gateway WS upgrade always rejected. **No fix PR linked.**
6. [#148457](https://github.com/NousResearch/hermes-agent/issues/148457) — *OPEN.* Chromium launched with `--no-sandbox` on AppArmor-userns hosts even when `browser.executable_path` points at a sandbox-capable binary. *Security/portability.*
7. [#103211](https://github.com/NousResearch/hermes-agent/issues/103211) — *OPEN.* MCP reconnect mid-dial tears down the session it produced, wasting the session-expired retry ("Connection closed"). *Long-standing since Sep 4; no fix PR.*

**P3 (notable):**
- [#121796](https://github.com/NousResearch/hermes-agent/issues/121796) — xAI `grok-4.7` silently ignores `reasoning.effort` (allowlist stops at grok-4.6). **Simple allowlist fix likely.**
- [#140024](https://github.com/NousResearch/hermes-agent/issues/140024) — SSH `sync_back` restores deleted skills to the host.
- [#149682](https://github.com/NousResearch/hermes-agent/issues/149682) — Group chats imported from standalone backends: first gateway turn fails with `runtime_draining` (room title collision).
- [#143798](https://github.com/NousResearch/hermes-agent/issues/143798) — copilot-acp prints `BrokenPipeError` noise on every startup.
- [#149778](https://github.com/NousResearch/hermes-agent/issues/149778) — `shell.exec` redacts structured plugin stdout (e.g., 32-hex tokens become `abcd12...ef34`).

**Closed today (fixes landed/confirmed):** [#135812](https://github.com/NousResearch/hermes-agent/issues/135812) (unbounded sidecar logs), [#139551](https://github.com/NousResearch/hermes-agent/issues/139551) (doctor false key demands), [#149787](https://github.com/NousResearch/hermes-agent/issues/149787) (Desktop scheduled script-only rows), [#149195](https://github.com/NousResearch/hermes-agent/issues/149195) (hosted rooms reschedule loop).

**Stability verdict:** No P0 open. But several P2s lack linked fix PRs (#135171, #145314, #141755, #147387), making them the ones to watch for maintainer attention.

---

## 6. Feature Requests & Roadmap Signals

- **[#97681](https://github.com/NousResearch/hermes-agent/issues/97681) — Bots collaborate across gateways** (4 👍, 40 comments, tagged `needs-decision`). Strongest roadmap signal; the paired PRs [#149655](https://github.com/NousResearch/hermes-agent/pull/149655) and [#149702](https://github.com/NousResearch/hermes-agent/pull/149702) are already shipping pieces of it (cross-machine gateway group chats). **Very likely in the next minor release.**
- **[#102269](https://github.com/NousResearch/hermes-agent/issues/102269) — Bot Marketplace / "bot packs."** Builds on existing `hermes profile install` + `distribution.yaml`. Plugin catalog PRs today ([#149263](https://github.com/NousResearch/hermes-agent/pull/149263) hermes-phone, [#149328](https://github.com/NousResearch/hermes-agent/pull/149328) stage, [#149781](https://github.com/NousResearch/hermes-agent/pull/149781) Keln) show the ecosystem layer forming.
- **[#108046](https://github.com/NousResearch/hermes-agent/pull/108046) — `-z --done-when` deterministic completion gate** for oneshot/cron/CI runs. Directly addresses the "agent answered ≠ tests pass" pain; fits the agentic-SDLC loop narrative.
- **[#85370](https://github.com/NousResearch/hermes-agent/pull/85370) — `emit_waterfall` around-middleware hook dispatch** (Cordis-style, ported from DeepSeek Harness). Extensibility primitive for gateway hooks.
- **[#96906](https://github.com/NousResearch/hermes-agent/issues/96906) — Delegation closeout:** hold terminal response until task-scoped background work finishes. Default-off, opt-in, awaiting maintainer decision since Aug.
- **[#143507](https://github.com/NousResearch/hermes-agent/issues/143507) — Dashboard plugins authenticate their own routes** (e.g., Telegram Mini App `initData`). Security-adjacent extensibility request.

**Prediction:** Cross-gateway group chat (already in PR) and plugin-catalog expansion are near-certain for the next release. `--done-when` and the bot-pack marketplace are strong candidates if maintainers prioritize CI/cron use cases.

---

## 7. User Feedback Summary

**Pain points:**
- **Gateway cutover turbulence dominates.** Users with many profiles (reports of 29 profiles, 107 TCP connections, 207 threads at boot in [#145762](https://github.com/NousResearch/hermes-agent/issues/145762)) and multi-launchd macOS setups are absorbing real operational pain. Desktop `profile=all` fan-out is a recurring complaint.
- **Cron/session hygiene:** empty orphan sessions from quiet cron jobs ([#145314](https://github.com/NousResearch/hermes-agent/issues/145314)) and hosted-room DB polling ([#149196](https://github.com/NousResearch/hermes-agent/issues/149196)) frustrate operators running scheduled workloads.
- **Security scanner false positives** are actively blocking legitimate community skills ([#141755](https://github.com/NousResearch/hermes-agent/issues/141755)) — a satisfaction risk for the community-skill supply chain.
- **Contributor friction:** the API PR permission error ([#131859](https://github.com/NousResearch/hermes-agent/issues/131859)) remains blocked 4+ weeks on an upstream cause.

**Use cases surfaced:** cross-machine bot collaboration, cron/CI oneshot runs, kanban-driven workflows, Telegram Mini App integration, SSH-remote skill sync.

**Satisfaction signals:** Fast same-day issue closure on new reports (#149787, #149195) implies responsive triage. The 666-contributor, ~850-issues-closed release cycle shows a healthy, large contributor base — but the persistent gateway P2s are the main drag on perceived stability.

---

## 8. Backlog Watch

Items open for extended periods or awaiting maintainer decisions:

| Item | Age / Status | Why it matters |
|---|---|---|
| [#131859](https://github.com/NousResearch/hermes-agent/issues/131859) | Open since Oct 3, `blocked/cause-upstream`, 56 comments | Contributor cannot open PRs via API; needs escalation or workaround guidance. |
| [#97681](https://github.com/NousResearch/hermes-agent/issues/97681) | Open since Aug 29, `needs-decision` | Strategic cross-gateway collaboration; parts already shipping without formal decision closure. |
| [#96906](https://github.com/NousResearch/hermes-agent/issues/96906) | Open since Aug 28, `needs-decision` | Delegation closeout; PR #97039 was closed unmerged Oct 4 "to prioritize gateway reliability." Needs explicit accept/reject. |
| [#103211](https://github.com/NousResearch/hermes-agent/issues/103211) | Open since Sep 4, 1 comment | MCP reconnect/retry bug, no fix PR. Long-lived correctness issue. |
| [#92118](https://github.com/NousResearch/hermes-agent/pull/92118) | PR open since Aug 22 | Structured memory prefetch observations; sizable feature PR stalling. |
| [#85370](https://github.com/NousResearch/hermes-agent/pull/85370) | PR open since Aug 13 | `emit_waterfall` hook dispatch; ~3-month-old extensibility feature. |
| [#108046](https://github.com/NousResearch/hermes-agent/pull/108046) | PR open since Sep 11 | `--done-when` completion gate; popular cron/CI need stalled in review. |
| [#113279](https://github.com/NousResearch/hermes-agent/pull/113279) | PR open since Sep 16 | Sticky-profile fix for one-shot gateway commands; rebuilt twice on main, still unreviewed. |

**Recommendation:** The `needs-decision` backlog (#97681, #96906) is the clearest blocker — resolving these unblocks both roadmap clarity and multiple waiting PRs. The cluster of 2–3-month-old feature PRs (#85370, #92118, #108046, #113279) suggests review bandwidth is consumed by gateway stabilization; a maintainer triage pass could either advance or explicitly park them.

---

*Generated from GitHub activity data for 2026-11-06. All links point to the public repository [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent).*

</details>

<details>
<summary><strong>IronClaw</strong> — <a href="https://github.com/nearai/ironclaw">nearai/ironclaw</a></summary>

No activity in the last 24 hours.

</details>

<details>
<summary><strong>QwenPaw</strong> — <a href="https://github.com/agentscope-ai/QwenPaw">agentscope-ai/QwenPaw</a></summary>

# QwenPaw Project Digest — 2026-11-06

## 1. Today's Overview

QwenPaw remains highly active with 14 issues and 33 PRs updated in the last 24 hours, indicating a healthy, fast-moving development cycle. Activity is skewed toward bug fixes and stability work rather than new features, with several high-severity issues around memory indexing, plugin routing, and cross-platform (Windows/CJK) failures surfacing. No new releases were cut today. The merge queue is moving — 13 PRs were merged/closed — but a substantial backlog of "Under Review" PRs (several XXXL-sized) suggests maintainer review bandwidth may be a bottleneck. Overall project health is solid, though recurring memory-layer bugs (#8040 recurring from #5950) signal architectural debt in the ReMe subsystem.

## 2. Releases

No new releases in the last 24 hours. Latest referenced versions in the wild: **v2.2.2.post1** (stable) and **v2.3.0b3 / v2.3.0-beta.1** (beta channel).

## 3. Project Progress

**Merged/Closed PRs today (13 total):**
- **#7842** `fix(plugins): isolate synchronous hooks and add event loop lag watchdog` — closes #7840; prevents plugin blocking from freezing the asyncio event loop. ([link](https://github.com/agentscope-ai/QwenPaw/pull/7842))
- **#6788** `fix: use shared root profile workspace for ACL store` — fixes Telegram channel ACL breakage across per-task workspaces. ([link](https://github.com/agentscope-ai/QwenPaw/pull/6788))
- **#6659** `feat(providers): model fallback with cooldown mechanism` — closes #2199, #1327, #2089; automatic failover on rate limits/timeouts. ([link](https://github.com/agentscope-ai/QwenPaw/pull/6659))
- **#7738** `fix(providers): filter unrecognized kwargs before OpenAI completions.create()` — fixes proxy-injected kwargs TypeError. ([link](https://github.com/agentscope-ai/QwenPaw/pull/7738))
- **#8558** `fix(matrix): simplify legacy state migration and device locking` — follow-up to #8187. ([link](https://github.com/agentscope-ai/QwenPaw/pull/8558))

**Closed issues today:** #7026 (deepseek-v4-pro chat_template_kwargs TypeError), #7252 (OpenViking memory backend discussion), #8581 (code mode `name` parameter collision — root cause identified), #8555 (workspace selection not persisting).

**Notable in-flight work:** PR #8532 (append-only SQLite session storage + paginated history + Turn forks) and #8469 (extract MCP into a plugin) are both XXXL refactors under review — these represent the biggest architectural shifts in the pipeline.

## 4. Community Hot Topics

| Item | Comments | Link |
|---|---|---|
| Issue #8040 — embedding reindex silently drops CJK chunks | 8 | [link](https://github.com/agentscope-ai/QwenPaw/issues/8040) |
| Issue #7026 — deepseek-v4-pro chat_template_kwargs TypeError (CLOSED) | 4 | [link](https://github.com/agentscope-ai/QwenPaw/issues/7026) |
| Issue #8276 — ReMe reranker accepts empty api_key | 4 | [link](https://github.com/agentscope-ai/QwenPaw/issues/8276) |
| Issue #3570 — pagination for "All Chats" list | 4 | [link](https://github.com/agentscope-ai/QwenPaw/issues/3570) |
| Issue #7252 — OpenViking long-term memory backend (CLOSED) | 3 | [link](https://github.com/agentscope-ai/QwenPaw/issues/7252) |

**Underlying needs:** The most-commented issues cluster around **memory/retrieval reliability** (#8040, #8276) and **provider compatibility** (#7026). The CJK chunking bug in #8040 is especially significant — it indicates the embedding pipeline has no per-item token validation, and the "success" logs are misleading. Users are doing careful empirical replays against real providers, suggesting a sophisticated, technically engaged user base. The OpenViking discussion (#7252, now closed) signals demand for pluggable memory backends beyond the built-in ReMe.

## 5. Bugs & Stability

Ranked by severity:

1. **#8040 [OPEN, HIGH]** — `embedding reindex incomplete`: CJK chunk over provider token limit silently drops its entire batch. **Recurrence of #5950** — indicates a previously-fixed bug regressed or was incompletely fixed. No fix PR linked yet. ([link](https://github.com/agentscope-ai/QwenPaw/issues/8040))
2. **#8592 [OPEN, HIGH]** — Creator review round permanently undecidable (REJECT always 422). Bundles three backend defects; hard blocker for Creator workflow. ([link](https://github.com/agentscope-ai/QwenPaw/issues/8592))
3. **#8580 [OPEN, HIGH]** — Memory tag index never rebuilds; `/memory/tags` returns 503. Tags generated but unreadable. ([link](https://github.com/agentscope-ai/QwenPaw/issues/8580))
4. **#8585 [OPEN, MEDIUM-HIGH]** — `recall_history` broken on Windows due to `\\?\` extended-length path canonicalization breaking SQLite read-only URI. Cross-version (2.2.x and 2.3.0-beta). ([link](https://github.com/agentscope-ai/QwenPaw/issues/8585))
5. **#8596 [OPEN, MEDIUM]** — Reopening a chat after `/clear` shows the `/clear` message and hides empty-state greeting. Reproducible on `main`. ([link](https://github.com/agentscope-ai/QwenPaw/issues/8596))
6. **#8595 [OPEN, MEDIUM]** — Plugin install fails with "No package metadata was found" for `qwenpaw-creator` v2.0.4. Blocks Creator onboarding. ([link](https://github.com/agentscope-ai/QwenPaw/issues/8595))
7. **#8590 [OPEN, MEDIUM]** — Plugin routes under "Settings" fall back to session list navigation. Fix PR **#8593** is open. ([link](https://github.com/agentscope-ai/QwenPaw/issues/8590))
8. **#8581 [CLOSED]** — Code mode `name` parameter collision (TypeError). Root cause identified; positional-only fix suggested. ([link](https://github.com/agentscope-ai/QwenPaw/issues/8581))

**Fix PRs exist for:** #8276 → PR #8291 (non-empty api_key requirement); #8590 → PR #8593. The most severe bugs (#8040, #8592, #8580) currently have **no linked fix PRs**.

## 6. Feature Requests & Roadmap Signals

- **#3570** — Pagination for "All Chats" list (open since April; slow-loading with many chats). The in-flight PR **#8532** (paginated history + append-only session storage) directly addresses this class of problem — likely to land in **v2.3.x**.
- **#7252** — OpenViking-backed long-term memory backend (closed, discussion). Suggests the memory subsystem may become pluggable; watch for follow-up RFC.
- **#8591** — Creator UI issues: invisible white-on-white buttons, model state confusion, forced unified API key across image/video/LLM models. A Creator UX polish pass is likely.
- **#8594** — Draggable conversation width handles (PR open) — small QoL win, likely to merge soon.
- **#8597** — `view_audio` tool catalog translations (PR open) — i18n completeness fix.

**Predicted next-version candidates:** paginated session history (#8532), MCP-as-plugin refactor (#8469), reranker model center (#8472), and session config unification (#8586).

## 7. User Feedback Summary

**Pain points:**
- **Memory reliability is the #1 theme.** Users report silent failures (reindex "success" but chunks dropped, tag index 503, reranker enabling without credentials). This erodes trust in long-term memory — a core value prop.
- **Windows-specific breakage** (#8585, GBK/CP936 decoding in #8234) affects a meaningful user segment, especially Chinese Windows users where non-UTF-8 files are common.
- **Plugin ecosystem friction:** install failures (#8595) and navigation regressions (#8590) make third-party extensions feel second-class.
- **Creator workflow blocked:** #8592 (undecidable review round) and #8591 (UI confusion) suggest the Creator feature is not yet production-ready.
- **Provider compatibility:** #7026 (deepseek-v4-pro) and #7738 (proxy kwargs) show users pushing QwenPaw against diverse OpenAI-compatible endpoints.

**Satisfaction signals:** Users are deeply engaged — filing multi-defect reports, offering root-cause analysis, and proposing fixes (e.g., positional-only suggestion in #8581). This indicates a technically invested community, though frustration with recurring bugs (#8040) is evident.

## 8. Backlog Watch

Items needing maintainer attention:

- **#8040** (opened 2026-09-30, 8 comments, recurrence of #5950) — highest-comment issue, no fix PR. **Needs a maintainer response.**
- **#3570** (opened 2026-04-19, 4 comments) — 7-month-old enhancement; partly addressed by #8532 but no direct resolution.
- **PR #8532** (opened 2026-11-02, size/XXXL, Under Review) — large architectural change; needs reviewer bandwidth.
- **PR #8469** (opened 2026-10-28, size/XXXL) — MCP extraction into plugin; long review cycle risk.
- **PR #8234** (opened 2026-10-14, Under Review) — GBK/CP936 decoding fix; stalled ~3 weeks.
- **PR #8411** (opened 2026-10-24, Under Review) — Matrix session/device key recovery; stalled ~2 weeks.
- **PR #8472** (opened 2026-10-28, Under Review) — reranker model center; large, relates to hot issue #8276.

**Health note:** The project is active and responsive, but several large "Under Review" PRs are aging (2–3+ weeks), and the top-commented bug (#8040) lacks a fix. Prioritizing review throughput and assigning an owner to #8040 would materially improve project health.

---
*Generated from GitHub data for 2026-11-06. All links point to github.com/agentscope-ai/QwenPaw.*

</details>

<details>
<summary><strong>ZeroClaw</strong> — <a href="https://github.com/zeroclaw-labs/zeroclaw">zeroclaw-labs/zeroclaw</a></summary>

# ZeroClaw Project Digest — 2026-11-06

## 1. Today's Overview

ZeroClaw showed very high activity on 2026-11-06, with 30 issues and 50 PRs updated in the last 24 hours. The project remains in a stabilization and security-hardening phase: most of the highest-priority activity centers on identity/access control (wildcard tool selectors, OIDC flows, session ownership) and SOP/runtime correctness. Five issues were closed and only two PRs were merged/closed, indicating a large in-flight review queue rather than a release cycle. No new releases were published. Overall health is strong in engagement but carries accumulated review debt — 48 open PRs, several marked `needs-author-action` or `stale-candidate`.

## 2. Releases

No new releases in the reporting window. The most recent release target referenced across issues is `release:v0.9.0`, and several security items (#11126, #11123, #12051, #12046, #12050) are tagged to it — suggesting v0.9.0 will be a security-focused release.

## 3. Project Progress

Only two PRs were closed/merged today:

- **PR #12232 [CLOSED]** — `fix(security): withhold principal-unaware tools and SOP execution from non-admin principals`. This is the implementation addressing the wildcard-tool-selector class of bugs (#12046, #11123). It landed as a large (XL) security fix and directly closes multiple P1 issues.
  https://github.com/zeroclaw-labs/zeroclaw/pull/12232
- **PR #12253 [CLOSED]** — `fix(ci): accept pin-utils maintenance advisory pending async-imap migration`, unblocking `cargo deny` for RUSTSEC-2026-0441.
  https://github.com/zeroclaw-labs/zeroclaw/pull/12253

Notable issues closed today: #11127 (session-data tool ownership bypass), #11123 (SOP wildcard selector), #12051 (SOP workshop privilege escalation), #12046 (non-admin wildcard tools), and #10526 (RFC on append-only session event history — accepted and closed). This cluster indicates a coordinated security sweep is now partially complete.

## 4. Community Hot Topics

Ranked by comment activity:

1. **#10526 [CLOSED] RFC: Append-only session event history, deterministic state replay, and derived agent streams** — 16 comments. The most-discussed item. This architectural RFC proposes replacing mutable conversation persistence with an append-only event log to enable deterministic replay. Its closure suggests consensus was reached, likely paving the way for a major runtime refactor.
   https://github.com/zeroclaw-labs/zeroclaw/issues/10526

2. **#8132 [OPEN] Evaluate Rust/WASM web UI prototype before React/Vite migration** — 13 comments, 1 👍. Ongoing debate about replacing the React SPA with a Rust→Wasm framework (Dioxus/Leptos/Yew). Tagged `risk:high`, `needs-author-action`. Reflects a desire to eliminate Node.js from the build toolchain.
   https://github.com/zeroclaw-labs/zeroclaw/issues/8132

3. **#10926 [OPEN] [Bug]: Matrix send_via treats peer user identities as room destinations** — 8 comments. S2 channel/tool bug affecting Matrix routing correctness.
   https://github.com/zeroclaw-labs/zeroclaw/issues/10926

4. **#9779 [OPEN] [sop] sops_dir documented default not honoured by daemon** — 7 comments, P1. Silent failure mode where SOPs never load if operators rely on the documented default. High-interest because it is a silent correctness failure.
   https://github.com/zeroclaw-labs/zeroclaw/issues/9779

**Underlying needs:** The community is converging on three themes — (a) durability/replayability of agent state (#10526, #9597), (b) tightening the principal/identity boundary across every tool surface, and (c) reducing build/runtime dependency surface (WASM migration, pin-utils, anymap2). The RFC closure of #10526 is the strongest signal of an architectural direction shift.

## 5. Bugs & Stability

Ranked by severity (P1/S0 first):

| Issue | Severity | Summary | Fix PR |
|---|---|---|---|
| #11124 | S0/P1 | SOP decision gate ignores strict fallback when mode answer valid — can auto-start with elevated authority | None open |
| #11126 | P1 | Queued session ops retain revoked admin ownership bypass (#10412 partial) | Partial (#10412) |
| #9779 | P1 | `sops_dir` default not honored; SOPs silently never load | None |
| #9770 | P1 | `cron update` silently discards changes to declarative jobs (six columns) | None |
| #9572 | P1 | Debug gateway WebSocket turns overflow Tokio worker stack | None |
| #10926 | S2/P2 | Matrix `send_via` treats peer user IDs as room destinations | None |
| #12194 | — | Unknown model silently falls back to 32k context (`UNCONFIGURED_CONTEXT_WINDOW_FALLBACK`) | None |
| #12145 | S2 | Plugin store limiter caps per-memory but keeps wasmtime defaults (10k memories/tables) → 1000× memory budget | None |
| #12228 | S2 | `cron update --agent` reports success but never reassigns | None |
| #12043 / #12225 | S2 | `glob_search` drops authorized matches outside workspace / never lists allowed-root files | None |
| #12236 | S3 | Cached HTTP clients shared across test runtimes → "dispatch task is gone" | None |
| #11703 | S3 | Activating deferred tool via `tool_search` busts prompt cache | None |

**Assessment:** Security and correctness bugs dominate. The cluster #11123/#11124/#11126/#11127/#12046/#12051 around identity and SOP authority is the most urgent. Three were closed today (#11123, #11127, #12051), but #11124 and #11126 remain open with no dedicated fix PR visible — these are the top stability risks.

## 6. Feature Requests & Roadmap Signals

- **#12181 [OPEN]** Web managed document upload (first #9488 Phase 2 Web slice) — attaching documents to dashboard chat via opaque `FileId`, off by default.
  https://github.com/zeroclaw-labs/zeroclaw/issues/12181
- **#11984 [OPEN]** Dashboard chat for signed-in non-admin accounts via OIDC — extending chat to scoped users.
  https://github.com/zeroclaw-labs/zeroclaw/issues/11984
- **#9597 [OPEN]** Durable, attributable peer-agent turns (replacing detached `process_message`).
  https://github.com/zeroclaw-labs/zeroclaw/issues/9597
- **#11878 [OPEN]** Durable task lifecycle foundation for "Goal Mode" (V1 proposal 1/12) — a 12-part series, indicating an upcoming goal-oriented agent feature.
  https://github.com/zeroclaw-labs/zeroclaw/pull/11878
- **#12230 [OPEN]** Native Zulip channel.
  https://github.com/zeroclaw-labs/zeroclaw/pull/12230

**Prediction for v0.9.0:** The roadmap signals point to a release centered on identity/access hardening (scoped dashboard chat, non-admin principal support) plus the first Web slices of #9488 (managed files). Goal Mode and the append-only replay RFC (#10526) are likely post-0.9.0 foundational work.

## 7. User Feedback Summary

Real pain points visible across today's data:

- **Silent failures are the top frustration.** Multiple issues (#9779, #9770, #12228, #12194) describe operations that report success or run without warning while doing nothing or using wrong defaults. Users emphasize "no error, no warning, no log line."
- **Identity/authority confusion** is a recurring theme — scoped users see config pages they cannot read (#12249), get raw daemon refusals (#12247), or hold tools that bypass their principal (#12046).
- **Cost awareness** appears in #11703 (prompt-cache busting under deferred MCP loading) and #12194 (silent 32k context budget on unknown models) — users are tracking token spend carefully.
- **Test/CI friction** from #12236 (shared HTTP clients across runtimes) and #12252 (RUSTSEC advisory) shows developers actively maintaining dependency hygiene.

Overall satisfaction appears constructive — contributors are filing detailed, well-scoped issues with reproduction detail and proposing concrete fixes rather than venting.

## 8. Backlog Watch

Items needing maintainer attention:

- **#8132** — Open since 2026-06-22 (~4.5 months), 13 comments, `needs-author-action`. The WASM UI direction is a major architectural decision blocking web work.
  https://github.com/zeroclaw-labs/zeroclaw/issues/8132
- **#9779** — Open since 2026-08-06 (3 months), P1, `status:accepted`, no fix PR. Silent SOP loading failure.
  https://github.com/zeroclaw-labs/zeroclaw/issues/9779
- **#9770** — Open since 2026-08-05 (3 months), P1, `status:accepted`, no fix PR. Cron declarative job data loss.
  https://github.com/zeroclaw-labs/zeroclaw/issues/9770
- **#11124** — S0 security, SOP fallback bypass, no fix PR. Highest-priority unfixed item.
  https://github.com/zeroclaw-labs/zeroclaw/issues/11124
- **PR #11878** — XL Goal Mode foundation, open since 2026-10-19, noted local Cargo test failures. Needs maintainer decision on scope.
  https://github.com/zeroclaw-labs/zeroclaw/pull/11878
- **PR #9420** — Anthropic stored OAuth profiles, open since 2026-07-26 (~3.5 months), XL, `risk:high`.
  https://github.com/zeroclaw-labs/zeroclaw/pull/9420

The backlog reflects a healthy but overloaded review process: multiple P1 accepted issues have sat for months without fix PRs, and a large volume of XL PRs (identity, channels, Goal Mode) compete for limited maintainer review bandwidth.

---

**Project health verdict:** High contributor engagement and a clear, coordinated security-hardening push (evidenced by the identity/principal fix cluster). The primary risk is review bandwidth — 48 open PRs against 2 merges in 24h, plus months-old P1 issues without fixes. v0.9.0 will likely be a security-focused release; architectural work (event replay, Goal Mode) appears staged for a subsequent version.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*