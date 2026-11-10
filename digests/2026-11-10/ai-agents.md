# OpenClaw Ecosystem Digest 2026-11-10

> Issues: 500 | PRs: 500 | Projects covered: 5 | Generated: 2026-11-10 03:25 UTC

- [OpenClaw](https://github.com/openclaw/openclaw)
- [Hermes Agent](https://github.com/nousresearch/hermes-agent)
- [IronClaw](https://github.com/nearai/ironclaw)
- [QwenPaw](https://github.com/agentscope-ai/QwenPaw)
- [ZeroClaw](https://github.com/zeroclaw-labs/zeroclaw)

---

## OpenClaw Deep Dive

# OpenClaw Project Digest — 2026-11-10

## 1. Today's Overview

OpenClaw shows **very high community activity** with 500 issues and 500 PRs updated in the last 24 hours, though no new releases were cut. The issue tracker is heavily skewed toward **open items (287 active vs. 213 closed)**, and PRs are even more backlog-heavy at **352 open against only 148 merged/closed**, indicating maintainer review capacity is the binding constraint. A striking share of the top-commented issues carry `stale` and `clawsweeper:no-new-fix-pr` tags, suggesting recurring, well-diagnosed bugs (memory recall, gateway restarts, session state) are lingering without fixes. Severity distribution is concerning: multiple **P0/P1 crash-loop and release-blocker** issues remain open on Windows, Linux (RHEL 8/glibc < 2.31), and Kubernetes. Overall the project is healthy in engagement but strained in merge throughput and stability on non-mainstream platforms.

## 2. Releases

**No new releases in the last 24 hours.** (Latest referenced in issues: 2026.10.10 stable, 2026.11.5-beta.1, and a 2026.9.37 extended-stable qualification track.)

## 3. Project Progress

No PRs are explicitly marked merged in this dataset, but several closed PRs indicate completed/fixed work:

- **[PR #195652](https://github.com/openclaw/openclaw/pull/195652)** (CLOSED) / **[PR #195750](https://github.com/openclaw/openclaw/pull/195750)** (CLOSED): Fixed agent image tools rejecting valid parameterized data URLs (`charset=utf-8`). Duplicate fixes converged on issue #195618.
- **[PR #196391](https://github.com/openclaw/openclaw/pull/196391)** (CLOSED): Accept BOM-prefixed model-usage imports.
- **[PR #196333](https://github.com/openclaw/openclaw/pull/196333)** (CLOSED): Faster "Ask OpenClaw" load in Firefox.
- **[Issue #193962](https://github.com/openclaw/openclaw/issues/193962)** (CLOSED, P0): SQLite header-probe timeout blocking package updates from 2026.10.10.
- **[Issue #167506](https://github.com/openclaw/openclaw/issues/167506)** (CLOSED, P0): Deleted temp handoff DB blocking package recovery.
- **[Issue #172628](https://github.com/openclaw/openclaw/issues/172628)** (CLOSED, P1): Fresh gateway start leaving main-agent admission superseded.

**In-flight advances:** A cluster of template/skill/plugin bundling PRs by @Patrick-Erichsen ([#196348](https://github.com/openclaw/openclaw/pull/196348), [#196349](https://github.com/openclaw/openclaw/pull/196349), [#196383](https://github.com/openclaw/openclaw/pull/196383), [#196389](https://github.com/openclaw/openclaw/pull/196389), [#196411](https://github.com/openclaw/openclaw/pull/196411)) and OpenClaw ID re-bind work by @jalehman ([#196138](https://github.com/openclaw/openclaw/pull/196138), [#196388](https://github.com/openclaw/openclaw/pull/196388), [#196402](https://github.com/openclaw/openclaw/pull/196402)) represent the two most active feature fronts.

## 4. Community Hot Topics

| Item | Comments | Signal |
|---|---|---|
| [Issue #170956](https://github.com/openclaw/openclaw/issues/170956) (P0, Windows restart/update reliability) | 30 | Highest-engagement issue; Windows managed-service installs are unreliable |
| [Issue #150635](https://github.com/openclaw/openclaw/issues/150635) (P2, dreaming/recall eviction) | 27 | Core memory-promotion subsystem never promotes |
| [Issue #166634](https://github.com/openclaw/openclaw/issues/166634) (crash recovery checkpoint) | 27 | Agent permanently unavailable post-crash |
| [Issue #193962](https://github.com/openclaw/openclaw/issues/193962) (P0, closed) | 24 | Update path bootstrap deadlock |
| [PR #116175](https://github.com/openclaw/openclaw/pull/116175) | — | Long-lived sandbox bind-roots feature, flagged compatibility + security-boundary |

**Underlying needs:** The top threads cluster around **operational reliability** — restart/update mechanics, crash recovery, and state reclamation. A second cluster concerns **memory/dreaming correctness** (issues #150635, #151173, #157827, #172547 all orbit promotion, rehydration, and citation integrity), indicating the long-term memory system is the biggest source of subtle, high-effort bugs. The community is clearly doing deep self-diagnosis (V8 profiles, SQLite stage profiling) — a mature but frustrated power-user base.

## 5. Bugs & Stability

**P0 / Release Blockers:**
- **[Issue #170956](https://github.com/openclaw/openclaw/issues/170956)** — Windows slow startup, unclean plugin shutdown, `schtasks` permission error; `impact:ux-release-blocker`. **No fix PR.**
- **[Issue #193962](https://github.com/openclaw/openclaw/issues/193962)** — Update blocked from 2026.10.10 on affected installs (`spawnSync ETIMEDOUT`). **CLOSED today.**

**P1 / Regressions & Crashes:**
- **[Issue #191841](https://github.com/openclaw/openclaw/issues/191841)** — 2026.10.10 regression: `native child reaping is unavailable` breaks **all exec/child processes** on glibc < 2.31 (RHEL 8). Fix-shape clear; **no fix PR yet** — high impact for enterprise Linux.
- **[Issue #144336](https://github.com/openclaw/openclaw/issues/144336)** — Deferred SIGUSR1 config-reload restart fails shutdown ("service child cleanup identity lost"), crash-loop.
- **[Issue #190307](https://github.com/openclaw/openclaw/issues/190307)** — Gateway restart leaves many agents permanently "degraded" (admission timeout); 35-agent deployment.
- **[Issue #157255](https://github.com/openclaw/openclaw/issues/157255)** — Turn claim not released after lane timeout → 90+ min wedge.
- **[Issue #167472](https://github.com/openclaw/openclaw/issues/167472)** — Subagent sessions can't register exec approvals (`missing scope: operator.approvals`), fail-closed. Needs security review.
- **[Issue #174895](https://github.com/openclaw/openclaw/issues/174895)** — Live Gateway judged "stale" and its lock reclaimed on Windows.
- **[Issue #166641](https://github.com/openclaw/openclaw/issues/166641)** — `web_fetch` cold fallback blocks the Gateway main thread (liveness stalls).

**Notable closed today:** [#192959](https://github.com/openclaw/openclaw/issues/192959) (K8s fsGroup credential rejection), [#173167](https://github.com/openclaw/openclaw/issues/173167) (exec wall-clock budget), [#193929](https://github.com/openclaw/openclaw/issues/193929) (Control UI GPU spinner regression).

**Assessment:** Stability is the project's weakest dimension right now. Platform-specific regressions (Windows schtasks/lock handling, glibc version assumptions, Kubernetes fsGroup) are outrunning fixes, and many P1s carry `needs-live-repro` / `needs-maintainer-review`, i.e. blocked on triage rather than engineering.

## 6. Feature Requests & Roadmap Signals

**Likely next-version candidates (active PRs or clear fix shapes):**
- **Template/skill/plugin bundling with native trust checks** — the Patrick-Erichsen PR cluster ([#196348](https://github.com/openclaw/openclaw/pull/196348), [#196349](https://github.com/openclaw/openclaw/pull/196349), [#196389](https://github.com/openclaw/openclaw/pull/196389)) points to a coordinated "Templates 2.0" landing, including paused-for-onboarding automations ([#196323](https://github.com/openclaw/openclaw/pull/196323)).
- **OpenClaw ID owner re-bind ceremony** ([#196138](https://github.com/openclaw/openclaw/pull/196138), [#196388](https://github.com/openclaw/openclaw/pull/196388), [#196402](https://github.com/openclaw/openclaw/pull/196402)) — key-loss/leak recovery for linked claws.
- **PostgreSQL state ownership** ([#196237](https://github.com/openclaw/openclaw/pull/196237)) — part of an all-PostgreSQL install push.
- **Configurable compaction summary cap** ([#196207](https://github.com/openclaw/openclaw/pull/196207)).

**Community-requested, not yet staffed:**
- Rendered Markdown preview in Review files ([#128090](https://github.com/openclaw/openclaw/issues/128090), 👍4).
- Manual team-sidebar agent ordering ([#155039](https://github.com/openclaw/openclaw/issues/155039)).
- Multiple policy aliases → one model ([#140213](https://github.com/openclaw/openclaw/issues/140213)); per-automation web-search provider ([#173518](https://github.com/openclaw/openclaw/issues/173518)).
- Android parity with browser in-chat questions/approvals ([#175826](https://github.com/openclaw/openclaw/issues/175826)).
- Memory-search indexing exclusions for fenced dreaming ranges ([#172547](https://github.com/openclaw/openclaw/issues/172547)).

**Prediction:** The Templates/skills bundling stack and OpenClaw ID re-bind are the most likely to ship next given dedicated PR chains; memory-dreaming fixes remain design-gated by product decisions.

## 7. User Feedback Summary

**Pain points:**
- **Update/restart fragility is the #1 theme** — users on Windows ("pas na veel proberen" — only after many retries), Linux, and Kubernetes all report broken or unreliable restarts/updates. #170956 alone captures the frustration.
- **Diagnostic traps mislead operators:** `config get gateway.auth.password` returns a masked placeholder with no indication, causing a 4+ hour outage misdiagnosis ([#173313](https://github.com/openclaw/openclaw/issues/173313)); `gateway restart` reports failure while exiting 0 ([#161158](https://github.com/openclaw/openclaw/issues/161158)).
- **Memory system distrust:** recall entries evicted nightly, dreaming never promotes, citations point to wrong ranges (#150635, #151173, #157827).
- **Unexpected UX collisions:** model-fallback notices leaking to external channels ([#92473](https://github.com/openclaw/openclaw/issues/92473)); "couldn't finish this request" posted into group chats ([#192688](https://github.com/openclaw/openclaw/issues/192688)).
- **Custom onboarding danger:** preseeded workspace files cause user-provided `BOOTSTRAP.md` to be deleted before first run ([#91931](https://github.com/openclaw/openclaw/issues/91931), P1, data-loss).

**Satisfaction signals:** Enthusiastic, technically deep engagement (V8 profiles, SQLite allocations, reproducible repros) and willingness to file detailed reports. Dissatisfaction concentrates on **reliability and diagnostics**, not on missing features — a "mature product with razor-thin operational margins" profile.

## 8. Backlog Watch

Long-lived, high-severity items needing maintainer attention:

- **[Issue #92473](https://github.com/openclaw/openclaw/issues/92473)** (opened 2026-06-12) — Model fallback notice leaks to external channels. Stale, needs product decision, security-adjacent.
- **[Issue #91931](https://github.com/openclaw/openclaw/issues/91931)** (opened 2026-06-10, P1) — Bootstrap file deletion causes data loss. Fix-shape clear but unassigned for ~5 months.
- **[Issue #137613](https://github.com/openclaw/openclaw/issues/137613)** (2026-09-03) — Pre-compaction memory flush disabled on CLI backends; known `compactionCount` trap blocks the obvious fix.
- **[Issue #140609](https://github.com/openclaw/openclaw/pull/140609)** (PR, 2026-09-07) — Security-relevant exec proxy alias fencing; "ready for maintainer look" but aging.
- **[PR #116175](https://github.com/openclaw/openclaw/pull/116175)** (2026-07-30) — Sandbox named host roots; carries both compatibility and security-boundary merge risks and has sat ~3.5 months.
- **[Issue #144336](https://github.com/openclaw/openclaw/issues/144336)** (2026-09-10, P1) — Deferred config-reload restart crash-loop; `needs-live-repro` blocking for 2 months.

**Recommendation:** Prioritize triage bandwidth for the `needs-live-repro`/`needs-maintainer-review` queue, which is where confirmed P0/P1 fixes are stalling. The Windows restart cluster (#170956, #174895, #161158) and the RHEL/glibc regression (#191841) represent the largest single-platform risk concentrations.

---

## Cross-Ecosystem Comparison

# Cross-Project Comparison Report — Personal AI Assistant / Agent OSS Ecosystem
**Snapshot Date:** 2026-11-10
**Projects:** OpenClaw, Hermes Agent, IronClaw, QwenPaw, ZeroClaw

---

## 1. Ecosystem Overview

The personal AI assistant/agent OSS landscape on 2026-11-10 is **high-velocity but stability-constrained**. The two largest projects (OpenClaw, Hermes Agent) are processing ~500 and ~100 issue/PR updates per day respectively, yet both show merge-queue strain: review capacity, not contributor interest, is the binding constraint. A second tier (QwenPaw, ZeroClaw) is running **pre-release stabilization sprints** on beta lines with concentrated Windows/desktop and CI/security regressions respectively, while one project (IronClaw) recorded zero activity. Across the ecosystem, three patterns dominate: **gateway/session reliability regressions**, **memory/dreaming correctness debt**, and **multimodal channel (Telegram/WeChat/Discord) hardening** — suggesting the category has passed the "feature novelty" phase and entered an "operational trust" phase. Meanwhile, security work (OIDC, audit chains, approval flows) is emerging as a first-class concern rather than an afterthought.

---

## 2. Activity Comparison

| Project | Issues (updated 24h) | PRs (updated 24h) | Open/Closed skew | Release status | Health score* |
|---|---|---|---|---|---|
| **OpenClaw** | 500 (287 open / 213 closed) | 500 (352 open / 148 merged) | Severely backlog-heavy | No new release; 2026.10.10 stable, 2026.11.5-beta.1 in flight | **B (engagement A, throughput D)** |
| **Hermes Agent** | 50 (47 open) | 50 (39 open / 11 merged) | Backlog-heavy but responsive | v0.23.1 patch shipped 11-09 (~618 PRs rolled up) | **B+ (engagement A, regressions B-)** |
| **IronClaw** | 0 | 0 | — | — | **N/A (dormant)** |
| **QwenPaw** | 18 (mostly open) | 50 (9 merged/closed) | Fix-paired, responsive | v2.3.0-beta.3 shipped; verification #8643 open | **B (beta risk C+)** |
| **ZeroClaw** | 28 | 50 (12 closed) | CI-frozen | No release; v0.9.0 blocked by #12320 | **C+ (CI blocked, security sprint)** |

\* Composite judgment: contributor engagement, merge throughput, release cadence, and open P0/P1 burden.

**Takeaways:**
- **OpenClaw** is roughly **10× the daily activity** of any peer but has the worst merge ratio (70% open PRs).
- **Hermes** and **QwenPaw** demonstrate the healthiest *fix-pairing* behavior (bug reports matched with fix PRs within hours).
- **ZeroClaw** is functionally **merge-frozen** pending a single CI blocker (#12320).

---

## 3. OpenClaw's Position

**Scale advantage:** OpenClaw operates at an order of magnitude larger community than every peer — 500 issue/PR updates vs. ~50 for Hermes, QwenPaw, and ZeroClaw. This is a **platform-level project** rather than a single-product agent.

**Technical approach differences:**
- **Architecture:** OpenClaw is gateway-centric with heavy emphasis on **multi-platform service management** (Windows schtasks, systemd, Kubernetes, glibc runtime assumptions) — peers are more constrained to Desktop/CLI/gateway triples.
- **Memory system:** OpenClaw exposes a distinctive **"dreaming" subsystem** (memory promotion, rehydration, citation integrity) — a deeper and more opinionated long-term memory design than QwenPaw's Memory Tags or Hermes's compaction, and a correspondingly larger bug surface.
- **Templating/skills ecosystem:** OpenClaw is the only project with an active **"Templates 2.0" skill/plugin bundling push** with native trust checks — peers are still maturing their plugin APIs (Hermes has an open "plugin API gaps" tracker #141982; ZeroClaw's sandbox_policy schema has been open ~5 months).

**Community size comparison (relative):**
| Dimension | OpenClaw | Hermes | QwenPaw | ZeroClaw |
|---|---|---|---|---|
| Daily issue/PR churn | ~1000 | ~100 | ~68 | ~78 |
| Multi-platform surface | Win/Linux/K8s/macOS | Desktop/TUI/CLI/gateway/cloud | Desktop/CLI/Channels | CLI/web/TUI/channels |
| Stale/backlog risk | High (Sweeper-tagged) | Medium | Medium | High (merge-frozen) |

**Vulnerability:** OpenClaw's breadth is its moat *and* its weakness — platform-specific P0/P1s (Windows restart cluster #170956, RHEL/glibc #191841) are outrunning the maintainer team's ability to triage, whereas smaller peers can converge faster on a narrower surface.

---

## 4. Shared Technical Focus Areas

The following requirements surfaced independently across **three or more** projects — strong signals of ecosystem-wide demand:

| Focus area | OpenClaw | Hermes | QwenPaw | ZeroClaw | Underlying need |
|---|---|---|---|---|---|
| **Gateway/session reliability** | #170956, #190307, #157255 | #143547, #84207, #143537 | #8644, #8643 | #12354, #12330 | Turns/sessions must survive restarts, disconnects, and profile multiplexing |
| **Memory correctness** | #150635, #151173, #157827, #172547 | #139599 (compaction inject) | #8619, #8620 + Memory Tags docs | — | Recall, citation integrity, and promotion must be auditable and deterministic |
| **Channel adapter hardening** | Notices leaking to external channels (#92473, #192688) | Telegram sweep #152380 (207 open), WeChat #152365 | QQ #8651, WeChat #8627, desktop channel #8644 | Discord #12064, Telegram test hang #12350 | Multi-channel bots must not silently drop, leak, or hang |
| **Multimodal input pipelines** | Image data URL handling (closed #195652) | Audio→transcript #152400 | Image-only C2C drop #8651 | — | Files must reach the model via a stable, provider-agnostic path |
| **Security/approval flows** | Subagent exec approvals #167472; sandbox PR #116175 | Admin bypass #151019; OAuth pool #138337 | — | OIDC #12317; audit chain #10359; sandbox_policy #7821 | Approval semantics and credential scoping are trust-critical |
| **Local/provider model control** | Configurable compaction #196207; per-automation provider #173518 | Claude Mythos 5.2 fast mode #152393 | MLX/GPU #8646–#8649; Ollama ctx #8236 | OpenRouter balance #11845 | Users want provider portability and cost/context visibility |
| **Windows/desktop stability** | #170956, #174895, #161158 | #143658 (post-sleep overlay) | #8616, #8627, #8639–#8641 | install.sh musl #12153 | Non-Linux platforms are first-class users, not edge cases |
| **Diagnostic clarity** | Masked-secret trap #173313; restart exit-0 #161158 | Silent "death" #84207 | SQLite→TimeoutError masking #8620 | zerocode silent local fallback #12330 | Failure modes must be legible to operators |

**Synthesis:** The convergent signal is that **agent reliability now = gateway lifecycle + memory semantics + channel adapters**. Feature velocity on all four projects is bounded by how well these three substrates hold.

---

## 5. Differentiation Analysis

| Dimension | OpenClaw | Hermes Agent | QwenPaw | ZeroClaw |
|---|---|---|---|---|
| **Primary identity** | Platform-scale agent framework | Multi-surface assistant (Desktop/TUI/CLI/cloud) | Local-first desktop assistant (Chinese-market tilt) | Security-focused CLI/web agent |
| **Target users** | Power users, enterprise K8s/Windows fleets | Cross-surface power users, multi-profile teams | Chinese Windows users, local-model enthusiasts | Least-privilege operators, security-conscious devs |
| **Architecture signature** | Gateway + template/skill registry + dreaming memory | **Unified gateway** (single process for every surface) | Frozen desktop build + channel plugin ABI | Rust CLI + web/TUI + OMEMO channels |
| **Differentiating feature** | Templates 2.0 + OpenClaw ID re-bind | SessionState consolidation; Claude fast-mode support | MLX/GPU local model engine; nested skills | OIDC device-cert bootstrap; audit hash chain |
| **Weakest axis** | Platform-specific P0/P1 backlog | Post-migration regression debt (since v0.22.x) | Windows 2.3.0 beta startup failures | CI merge freeze |
| **Release philosophy** | Continuous betas + extended-stable | Rapid patch rollups (v0.23.1) | Beta-cycle with release-duty verification | Blocked on security gating |

**Key insight:** These projects are **not substitutable**. OpenClaw optimizes for **breadth and extensibility**; Hermes for **surface unification**; QwenPaw for **local/offline multimodal**; ZeroClaw for **hardened security posture**. Overlap is currently in *channel plumbing and gateway semantics* — a sign that adjacent competition will intensify there.

---

## 6. Community Momentum & Maturity

**Activity tiers (by daily churn):**

- **Tier 1 — Hyperactive, throughput-constrained:**
  - **OpenClaw** (~1000 updates/day) — high engagement, severe merge backlog, mature but *operationally strained*.
  - **Hermes Agent** (~100/day) — active bug-sweep phase, regressions from a major migration, high contributor diversity (`teknium1`, `unsupportedpastels`, `IAvecilla`, `Relogys`).

- **Tier 2 — Focused, stabilization-driven:**
  - **QwenPaw** (~68/day) — pre-release burn-down, maintainers pair bug reports with fixes within 24h (#8644 → #8653; #8629 → #8636). **Rapidly iterating but risk-concentrated** in Windows desktop.
  - **ZeroClaw** (~78/day) — **maintainer-driven security sprint** (author cluster #12317–#12340 by `JordanTheJet`/`IftekharUddin`), CI-blocked merge queue. **Productive but bottlenecked.**

- **Tier 3 — Dormant:**
  - **IronClaw** — zero activity; no signal to assess.

**Maturity archetypes:**
- **OpenClaw = "mature product with razor-thin operational margins"** — deep self-diagnosis from users (V8 profiles, SQLite allocation traces) signals a sophisticated base, but P0s with no fix PRs (e.g., #191841) suggest maintainer bandwidth is the ceiling.
- **Hermes = "adolescent post-refactor"** — the unified-gateway migration (#106742) has produced a textbook post-merge regression cluster; velocity is healthy but the codebase is *paying down architectural debt in public*.
- **QwenPaw = "hardening a beta line"** — disciplined fix pairing makes it the most *predictable* of the active tier; risk is concentrated, not diffuse.
- **ZeroClaw = "security-first, driven top-down"** — low organic feature demand today; the community trusts the maintainer roadmap.

---

## 7. Trend Signals (Value for AI Agent Developers)

Extracted from recurring user and maintainer feedback across all active projects:

1. **Gateway lifecycle is the new kernel.** Restart safety, session persistence, and turn-claim release are the most-reported P1 failures in OpenClaw (#157255, #190307), Hermes (#84207, #143537), ZeroClaw (#12354), and QwenPaw (#8644). *Implication:* any agent framework shipping in 2026 must treat gateway state as a first-class, test-covered subsystem — not plumbing.

2. **Memory systems are the highest-cost correctness surface.** "Dreaming never promotes" (#150635), "citation points to wrong ranges" (#157827), "compaction injects unverifiable text" (#139599), and "repeated turn-boundary queries" (#8619) all reside in long-term memory. *Implication:* memory needs **auditable promotion and eviction semantics** with deterministic replay, or it becomes a silent trust-killer.

3. **Silent failure is the dominant UX anti-pattern.** "Silent death" turns (#84207), silent local-daemon fallback (#12330), silent image-drop (#8651), silent byte-loss on GBK files (#8234). *Implication:* ecosystems are standardizing on **explicit, distinguishable failure states** — a design requirement, not a polish item.

4. **Multimodal channel adapters are the fastest-growing bug class.** Telegram sweep tracker #152380 alone records **207 open real bugs**. *Implication:* multi-channel (Telegram, WeChat, Discord, QQ) support is table-stakes but each adapter is an independent instability vector; teams should budget for channel-specific QA, not treat adapters as thin wrappers.

5. **Security is being elevated from "hardening" to "default UX."** OIDC device-cert bootstrap (ZeroClaw #12317), approval-flow bypasses (Hermes #151019), audit hash chains (#10359), and subagent scope failures (OpenClaw #167472) all landed in one day. *Implication:* least-privilege approvals, credential scoping, and audit logs are becoming **baseline expectations** for agent frameworks in enterprise-adjacent deployments.

6. **Local/provider model portability is a growing user demand.** MLX/GPU engine (#8646), Ollama context derivation (#8236), OpenRouter balance (#11845), Claude fast mode (#152393). *Implication:* model-provider abstraction and cost/context visibility will differentiate frameworks targeting power users.

7. **CI reliability is a silent product risk.** ZeroClaw's merge freeze from a single RUSTSEC advisory (#12320) stalled the entire project for a day. *Implication:* for maintainers, **CI/security gating is now on the critical path of shipping velocity** — a brittle pipeline is equivalent to a frozen roadmap.

8. **Windows/desktop is no longer optional.** OpenClaw's top-commented issue is Windows restart (#170956, 30 comments); QwenPaw's critical tier is entirely Windows desktop; Hermes has post-sleep overlay bugs (#143658). *Implication:* cross-platform support demands **platform-specific test matrices** from day one, or regressions dominate the backlog.

---

### Bottom Line for Decision-Makers

- **For ecosystem builders:** OpenClaw remains the reference implementation and the widest platform surface, but its throughput ceiling and P0 backlog mean downstream consumers should track its **stability releases**, not its feature betas.
- **For fast-moving adopters:** Hermes and QwenPaw ship fixes fastest but carry version-pinned regression risk — pin versions and read changelogs carefully.
- **For security-sensitive deployments:** ZeroClaw's maintainer-led OIDC/audit sprint is the strongest signal of intent in the ecosystem, but its CI fragility should be watched.
- **Cross-cutting bet:** whoever solves **gateway lifecycle + memory auditability + channel adapter reliability** first will own the next tier of agent adoption — these three are the ecosystem's shared bottleneck.

---

## Peer Project Reports

<details>
<summary><strong>Hermes Agent</strong> — <a href="https://github.com/nousresearch/hermes-agent">nousresearch/hermes-agent</a></summary>

# Hermes Agent — Project Digest

**Date:** 2026-11-10
**Repository:** [github.com/NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent)

---

## 1. Today's Overview

Hermes Agent shows **very high sustained activity** on 2026-11-10: 50 issues and 50 PRs updated in the last 24h, with 47 issues still open and 39 PRs open — a clear sign the project is in a heavy bug-sweeping and refactoring phase rather than a feature-freeze. A patch release (**v0.23.1**) was published on Nov 9, rolling up ~618 PRs merged since v0.23.0 into stable channels (CLI, Microsoft Store, Docker, Hermes Cloud), though curated notes are deferred to v0.24.0. The dominant theme across the tracker is **post-merge fallout from the unified gateway migration** (#106742): session persistence, profile multiplexing, streaming/typing state, and delivery semantics are where most open P1/P2 bugs cluster. Maintainers (notably `teknium1`) are running a large **Telegram/gateway bug-sweep review batch** (#152380), with a steady stream of fix PRs landing. Overall health: active and responsive, but with a growing stabilization backlog tied to the gateway architecture change.

---

## 2. Releases

### v0.23.1 (Released 2026-11-09)

- **Type:** Patch release (stable rollup).
- **Content:** Aggregates approximately **618 PRs merged since v0.23.0** into a stable GitHub release for CLI and installers, the Microsoft Store app, Docker, and Hermes Cloud.
- **Breaking changes:** None announced in this tag.
- **Migration notes:** None specific; full curated notes for this window ship with **v0.24.0**.
- **Link:** [Release v0.23.1](https://github.com/NousResearch/hermes-agent/releases)

> Note: Users on `v0.23.0` should be aware that several open bugs were filed specifically against 0.22.x–0.23.0 installs (see Section 5), so upgrading does not yet resolve all gateway/session issues reported today.

---

## 3. Project Progress

**PR throughput today:** 11 merged/closed out of 50 updated; 39 remain open.

Notable merged/closed PRs:

- **#149754 [CLOSED]** — `fix(config): a read-only legacy SOUL.md scaffold no longer stops the gateway from starting`. Fixes a v0.22.6+ regression where hosted agents with a read-only `SOUL.md` could never start their gateway. [PR #149754](https://github.com/NousResearch/hermes-agent/pull/149754)
- **#152244 [CLOSED]** — `fix(ci): a cancelled duplicate PR run no longer fails the required gate`. Restores green CI gating after duplicate workflow runs were being marked failed. [PR #152244](https://github.com/NousResearch/hermes-agent/pull/152244)
- **#152163 [CLOSED]** — `docs(plugins): name the function that fires each VALID_HOOKS entry`. Documentation improvement covering all 48 plugin hooks. [PR #152163](https://github.com/NousResearch/hermes-agent/pull/152163)
- **#152160 [CLOSED]** — `test(plugins): conformance suite for the native plugin surface`. Adds lifecycle conformance tests for tools, hooks, commands, and providers. [PR #152160](https://github.com/NousResearch/hermes-agent/pull/152160)

**Notable open PRs advancing features/fixes:**

- **#151019** — Security fix: non-admins can no longer bypass `allow_admin_from` by typing `always` or clicking Allow on approval prompts. [PR #151019](https://github.com/NousResearch/hermes-agent/pull/151019)
- **#151769** — Gateway fix: observed Telegram group photos now point the agent at the cached file, and Docker-sandbox MEDIA files are readable before sending. [PR #151769](https://github.com/NousResearch/hermes-agent/pull/151769)
- **#152400** — Attached audio files (voice memos) now reach the agent as transcripts on Desktop/TUI/CLI/gateway when `stt.transcribe_audio_files: true`. [PR #152400](https://github.com/NousResearch/hermes-agent/pull/152400)
- **#149172** — Gateway fix stopping a non-retryable API-error "echo burn loop" (~1 turn/sec token burn on 401/402/403). [PR #149172](https://github.com/NousResearch/hermes-agent/pull/149172)
- **#143156** — Gateway fix repairing `state_meta` local-policy receipts on legacy-main rekey (related to open bug #143150). [PR #143156](https://github.com/NousResearch/hermes-agent/pull/143156)
- **#152393** — Model support: Claude Mythos 5.2 fast mode, 1M context, and stale-timeout floor. [PR #152393](https://github.com/NousResearch/hermes-agent/pull/152393)
- **#152245** — `hermes gateway migrate --backends` read-only report for serve/dashboard background services. [PR #152245](https://github.com/NousResearch/hermes-agent/pull/152245)
- Internal refactors (#152161, #152162) consolidate gateway per-conversation state into `SessionState`, reducing side-list duplication.

**Overall direction:** Progress is dominated by gateway hardening, Telegram adapter fixes, security tightening around approvals, and CI reliability, with model-provider support advancing in parallel.

---

## 4. Community Hot Topics

**#143547 [OPEN] — Unified gateway (#106742): open post-merge problems on main** — *60 comments*
The single most active issue. Tracks the aftermath of the Oct 14 unified-gateway migration, where CLI, TUI, Desktop, API server, editors, messaging bots, cron, Kanban, and Group Chats all hand turns to one gateway process. Link: [Issue #143547](https://github.com/NousResearch/hermes-agent/issues/143547)
**Underlying need:** A single coordination hub for a sprawling multi-surface product, with users demanding clear ownership of cross-cutting gateway regressions.

**#84207 [OPEN] — Interrupted turn (exit 130) delivers zero user feedback** — *11 comments*
When a tool call is interrupted (client disconnect / cancellation), the turn ends with `reason=interrupted_by_user` and no response is delivered; sessions appear to silently die. Link: [Issue #84207](https://github.com/NousResearch/hermes-agent/issues/84207)
**Underlying need:** Reliable, explicit turn lifecycle semantics — users need to distinguish deliberate stops from disconnects, and expect feedback/state persistence.

**#143150, #106592, #131765, #140667** — *7–9 comments each*
A cluster of gateway/session/desktop connection issues: `storage_unavailable` on resume after multiplex migration (#143150), remote Desktop update false-failure (#106592), pooled SSH backend retiring healthy connections (#131765), and a 30s read-only handler starving queued RPCs (#140667, now CLOSED).

**Takeaway:** The community's attention is concentrated on **gateway/session reliability**, especially in Desktop + remote-backend and multiplex/multi-profile setups.

---

## 5. Bugs & Stability

**P1 / High Severity (Open)**

- **#138337 [P1]** — `delegate_task` children sharing an Anthropic OAuth pool revoke each other's tokens on 401 and die at a non-resetting refresh cap. Security-boundary tagged. [Issue #138337](https://github.com/NousResearch/hermes-agent/issues/138337)
- **#142969 [P1]** — Unpaired WhatsApp adapter (`WHATSAPP_ENABLED=true`, never paired) crashes the gateway on start; all CLI chat fails since v0.22.4. [Issue #142969](https://github.com/NousResearch/hermes-agent/issues/142969)
- **#140823 [P1]** — Gateway messages (WeChat/Telegram) since v0.22.1 processed but **not persisted to `state.db`**; Desktop shows 0 messages. [Issue #140823](https://github.com/NousResearch/hermes-agent/issues/140823)
- **#139599 [P1]** — Steers/queued prompts carry no origin attribution; duplicate row persistence; compaction injects unverifiable text into context. Session-state risk. [Issue #139599](https://github.com/NousResearch/hermes-agent/issues/139599)
- **#143537 [P1]** — Local session answers only its first turn; `live.source` vs receipt source differ by `message_id`, so the session pauses forever. [Issue #143537](https://github.com/NousResearch/hermes-agent/issues/143537)

**P0 (Closed today)**

- **#133716 [CLOSED, P0]** — Desktop regenerate on tail message replayed a 4-hour-old turn and truncated 107 live messages; valid row-id anchor defeated truncation guards. Now closed. [Issue #133716](https://github.com/NousResearch/hermes-agent/issues/133716)

**P2 (Selected Open)**

- **#143150** — `storage_unavailable` on session resume after multiplex migration. **Fix PR exists:** [#143156](https://github.com/NousResearch/hermes-agent/pull/143156).
- **#106592** — Remote Desktop update reports failure after successful systemd restart; stale update state.
- **#131765** — Pooled remote SSH backend retires healthy forwards and loops (~26 min).
- **#107998** — 1Password browser-vault unlock fails with "no session token" when desktop integration enabled.
- **#141984** — `tui_gateway.server` moves importing process stdout to stderr at import time, affecting gateway/agent/CLI.
- **#143658** — Desktop falls into first-run setup overlay after Windows sleep/resume despite intact install.
- **#152365** — WeChat voice message (`text=''`, `audio/silk`) leaves `session_admissions` row stuck at `started`; later messages silently dropped.
- **#152380** — Tracker: open PRs from the Telegram/gateway bug sweep (790 Telegram issues scanned; 339 real bugs found on main; 132 closed; **207 still open**).

**Regression Note:** A meaningful share of P1s are explicitly marked "since v0.22.x" — persistence loss (#140823), WhatsApp crash (#142969), token-pool collision (#138337). This indicates the v0.22–0.23 gateway migration introduced regressions still being worked through. Several have active fix PRs.

---

## 6. Feature Requests & Roadmap Signals

- **#134198 [P3, Feature]** — Deliver background process completions to the model during an active turn at the next safe continuation boundary. Signals demand for long-running task awareness. [Issue #134198](https://github.com/NousResearch/hermes-agent/issues/134198)
- **#141982 [P3, Feature]** — Tracking: plugin API gaps discovered building a frontend plugin (`hermes-tern`). Suggests the plugin surface needs extension for full frontend plugins. [Issue #141982](https://github.com/NousResearch/hermes-agent/issues/141982)
- **#152393 (PR)** — Claude Mythos 5.2 fast mode + 1M context + stale-timeout floor. If merged, fast-mode and extended context support likely headline in **v0.24.0**.
- **#152245 (PR)** — `hermes gateway migrate --backends` — read-only inventory of serve/dashboard background services, a precursor to a broader migration tool.
- **#152400 (PR)** — Audio attachment → transcript pipeline gated by `stt.transcribe_audio_files` — points to expanding multimodal input handling.

**Prediction for v0.24.0:** The curated notes packet for v0.24.0 will likely feature (a) the gateway/session stabilization batch, (b) new model/provider support (Mythos/Fable fast modes, extended context), and (c) plugin API conformance and hook documentation.

---

## 7. User Feedback Summary

**Frustrations (most common):**

1. **Silent failures / missing feedback** — Interrupted turns produce no response (#84207); sessions pause forever after one turn (#143537); gateway messages not persisted so Desktop shows empty history (#140823). Users describe these as "silent death."
2. **Upgrade regressions** — Multiple reporters cite specific versions ("since v0.22.4", "since v0.22.1") for newly broken behavior, eroding trust in upgrades.
3. **Desktop/remote connection flakiness** — SSH forward retirement loops (#131765), false update failures (#106592), and post-sleep setup overlays (#143658) disrupt daily Desktop usage.
4. **Credential/auth collisions** — Anthropic OAuth token revocation across delegated children (#138337) and 1Password unlock failures (#107998).
5. **Platform UX papercuts** — Safari Shift-Enter broken (#152086), Android gesture-nav overlap (#152083), spellcheck suggestions not reaching custom context menu (#150871).

**Satisfaction signals:** A large active set of contributors (`teknium1`, `unsupportedpastels`, `IAvecilla`, `Relogys`) submitting targeted fixes and refactors; security hardening PRs (#151019) and approval-flow fixes show responsiveness. The community is engaged and technical, filing precise reproductions with version pins and environment details — a strong signal of a committed user base.

---

## 8. Backlog Watch

Items that would most benefit from maintainer prioritization or are long-lived and consequential:

| Item | Age | Why it matters |
|---|---|---|
| [#84207](https://github.com/NousResearch/hermes-agent/issues/84207) — Interrupted-turn silent death | Since 2026-08-12 | Long-lived P2; touches core turn lifecycle; affects every messaging surface. |
| [#106592](https://github.com/NousResearch/hermes-agent/issues/106592) — Remote Desktop update false failure + stale state | Since 2026-09-09 | User-visible trust issue; affects remote Linux backends. |
| [#121882](https://github.com/NousResearch/hermes-agent/issues/121882) — SessionDB savepoint error (`fts_align_empty`) | Since 2026-09-24 | DB-layer correctness on pre-v3 homes; tagged compatibility + session-state risk. |
| [#131765](https://github.com/NousResearch/hermes-agent/issues/131765) — Pooled SSH backend retirement loop | Since 2026-10-02 | ~26-minute connection churn; undermines Desktop remote reliability. |
| [#138337](https://github.com/NousResearch/hermes-agent/issues/138337) — Anthropic OAuth pool token revocation | Since 2026-10-14 | P1 security-boundary; breaks delegated multi-agent Anthropic usage. |
| [#143150](https://github.com/NousResearch/hermes-agent/issues/143150) — `storage_unavailable` resume failure | Since 2026-10-22 | **Fix PR #143156 exists** — needs review/merge to close the loop. |
| [#152380](https://github.com/NousResearch/hermes-agent/issues/152380) — Telegram/gateway sweep tracker | 2026-11-10 | Meta-tracker: **207 open sweep bugs** require sustained review capacity. |

---

*Digest compiled from GitHub issue/PR activity for 2026-11-10. Data as provided; comment counts reflect totals at snapshot time. Links point to the NousResearch/hermes-agent repository.*

</details>

<details>
<summary><strong>IronClaw</strong> — <a href="https://github.com/nearai/ironclaw">nearai/ironclaw</a></summary>

No activity in the last 24 hours.

</details>

<details>
<summary><strong>QwenPaw</strong> — <a href="https://github.com/agentscope-ai/QwenPaw">agentscope-ai/QwenPaw</a></summary>

# QwenPaw Project Digest — 2026-11-10

## 1. Today's Overview

QwenPaw is in an active pre-release stabilization cycle for the v2.3.0 beta line, with **50 PRs updated** and **18 issues touched** in the last 24 hours — a high-velocity day dominated by bug fixing rather than new feature work. A new beta (`v2.3.0-beta.3`) shipped, and the accompanying release-duty installation verification issue (#8643) is open. The issue tracker is currently skewed heavily toward **Windows desktop and channel-plugin activation failures**, suggesting the packaged/frozen desktop build is the main source of instability. Maintainer responsiveness looks solid: multiple bug reports filed 2026-11-09/10 already have candidate fix PRs (e.g., #8644 → #8653, #8629 → #8636), though several older `Under Review` PRs remain stalled.

## 2. Releases

### v2.3.0-beta.3 (Beta)
- **Changes:**
  - `docs(memory)`: Separate bilingual blogs for multimodal memory and Memory Tags ([PR #8506](https://github.com/agentscope-ai/QwenPaw/pull/8506))
  - `fix(channels)`: Resolve desktop plugin installation and repair failures ([PR by @Luohh5](https://github.com/agentscope-ai/QwenPaw/pull/8506)) — this targets the plugin-install error class also reported in #8595.
- **Breaking changes:** None declared in the release notes.
- **Migration notes:** None published. Users on 2.2.x should be aware that the 2.3.0 beta line has known Windows startup and channel-activation regressions (see §5) — historically 2.2.2 has been reported as *working* on machines where 2.3.0-beta fails (#8616).
- **Verification status:** Release-duty installation verification ([#8643](https://github.com/agentscope-ai/QwenPaw/issues/8643)) is still open, with a 4-hour post-publish deadline; treat beta.3 as unconfirmed across platforms until it closes.

## 3. Project Progress

- **9 PRs merged/closed** in the last 24h, mostly small-scale CI/test and infrastructure hygiene rather than headline features:
  - [PR #8639](https://github.com/agentscope-ai/QwenPaw/pull/8639) (CLOSED) — fix BOM decoding in dependency installation test.
  - [PR #8640](https://github.com/agentscope-ai/QwenPaw/pull/8640) (CLOSED) — fix Windows permission and UTF-8 BOM assertions (test-only, POSIX `0600` check now gated to non-Windows).
  - [PR #8641](https://github.com/agentscope-ai/QwenPaw/pull/8641) (CLOSED) — extend macOS desktop build timeout to 90 minutes (build reliability).
  - [PR #8645](https://github.com/agentscope-ai/QwenPaw/pull/8645) (CLOSED) — superseded/replaced by the split MLX engine series (#8647/#8648/#8649), see §7.
- **Closed issues:** three bugs resolved — #8585 (Windows `\\?\` extended-length path breaking SQLite read-only URI for `recall_history`), #8553 (QQ channel `DEPENDENCY_PLAN_UNVERIFIED` with unprovisioned `aliyun-hub`), and #8502 (desktop HTML preview "open in browser" failing on Chinese paths / out-of-workspace files).
- **In-flight feature work (open, not yet merged):** nested/categorised skill directories ([#8178](https://github.com/agentscope-ai/QwenPaw/pull/8178), size/XXL), local model engine + GPU/auto-update controls ([#8647](https://github.com/agentscope-ai/QwenPaw/pull/8647)/[#8648](https://github.com/agentscope-ai/QwenPaw/pull/8648)/[#8649](https://github.com/agentscope-ai/QwenPaw/pull/8649)), and local Whisper as an SDK plugin ([#8431](https://github.com/agentscope-ai/QwenPaw/pull/8431), size/XXXL).

## 4. Community Hot Topics

- **#8595 — Plugin install fails with "No package metadata was found" for `qwenpaw-creator`** ([link](https://github.com/agentscope-ai/QwenPaw/issues/8595)) — 4 comments, active since 2026-11-05. Official plugin v2.0.4 fails via both UI and CLI (`hot-install via API` path). Underlying need: users expect **first-party plugins to install reliably out of the box**; the CLI/UI dual failure suggests a packaging/metadata problem in the plugin distribution pipeline, not user error.
- **#8521 — Missing reply content + Ctrl+C requires multiple presses + new UI feels slower** ([link](https://github.com/agentscope-ai/QwenPaw/issues/8521)) — 4 comments, author `perm2580`. Combines correctness (answers sometimes show thinking but no final content), a UI copy bug (needs repeated Ctrl+C in both Chrome and Edge), and an explicit plea for a **UI toggle back to the old layout**. Reflects friction from the recent UI overhaul.
- **#8644 — Channel plugins never activate on packaged Desktop builds** ([link](https://github.com/agentscope-ai/QwenPaw/issues/8644)) — 2 comments, `AttributeError` in `validate_runtime_identity` reading `supported_tags` from `DependencyReadEvidence`, causing `WORKER_START_FAILED`. **Fix PR already open: [#8653](https://github.com/agentscope-ai/QwenPaw/pull/8653)** ("preserve runtime ABI checks for desktop channel startup").
- **#8646 — Add managed MLX engine and GPU controls to QwenPaw Local** ([link](https://github.com/agentscope-ai/QwenPaw/issues/8646)) — 1 comment, but directly matched by a large three-PR contribution series ([#8649](https://github.com/agentscope-ai/QwenPaw/pull/8649) → [#8647](https://github.com/agentscope-ai/QwenPaw/pull/8647) → [#8648](https://github.com/agentscope-ai/QwenPaw/pull/8648)) from the same author, plus a now-closed precursor ([#8645](https://github.com/agentscope-ai/QwenPaw/pull/8645)). This is the day's most coherent feature push.

## 5. Bugs & Stability

Ranked by severity (data loss / startup failure > functional breakage > cosmetic):

1. **CRITICAL — Desktop channel plugins fail to activate on packaged builds** ([#8644](https://github.com/agentscope-ai/QwenPaw/issues/8644)): all channel protocols (`feishu`, `wechat`, `yuanbao`) fail validation on frozen 2.3.0b3 builds; Channels page stuck at `validation pending`. *Fix PR exists:* [#8653](https://github.com/agentscope-ai/QwenPaw/pull/8653).
2. **CRITICAL — 2.3.0-beta.1 won't start on Windows 11 IoT LTSC** ([#8616](https://github.com/agentscope-ai/QwenPaw/issues/8616)): "path not found" then AppHang; 2.2.2 works on the same machine. *No fix PR seen.* Also adjacent: checkpoint service failure on Windows Git long-path prefix + WeChat stuck at `DEPENDENCY_ENVIRONMENT_AMBIGUOUS` ([#8627](https://github.com/agentscope-ai/QwenPaw/issues/8627)).
3. **HIGH — `run_code` invoked with empty arguments on custom OpenAI-compatible providers** ([#8603](https://github.com/agentscope-ai/QwenPaw/issues/8603)): every `run_code` call gets `{}` and is rejected (`'code' is a required property`) with `kimi`/`kimi-codingplan` + `k3.1-pro`. Breaks code execution entirely on those providers. *No fix PR seen.*
4. **HIGH — QQ channel silently drops image-only C2C messages** ([#8651](https://github.com/agentscope-ai/QwenPaw/issues/8651)): happens pre-model-call, provider-independent. Silent drop = invisible failures for users.
5. **MEDIUM — Oversized historical image re-sent on every model call** ([#8629](https://github.com/agentscope-ai/QwenPaw/issues/8629)): rejected media payload replayed each turn, plus misleading "Image loaded" text survives stripped retries. *Fix PR exists:* [#8636](https://github.com/agentscope-ai/QwenPaw/pull/8636).
6. **MEDIUM — Mission model-switch not honored by dispatch scripts** ([#8652](https://github.com/agentscope-ai/QwenPaw/issues/8652)): tasks still run on the old model after a switch, causing failures.
7. **MEDIUM — Memory/search correctness defects** (both by `txohyeah`): repeated turn-boundary queries for the same search hits ([#8619](https://github.com/agentscope-ai/QwenPaw/issues/8619)) and `sqlite3.OperationalError` being converted to `TimeoutError` after deadline ([#8620](https://github.com/agentscope-ai/QwenPaw/issues/8620)) — the latter destroys useful diagnostics.
8. **LOW — UI/copy issues:** inconsistent visual treatment of thinking blocks vs. tool cards with left-edge jitter ([#8650](https://github.com/agentscope-ai/QwenPaw/issues/8650)); "execution"-type tool calls rendering as opaque one-liners ([#8612](https://github.com/agentscope-ai/QwenPaw/issues/8612)).

**Health read:** the Windows desktop 2.3.0 beta regressions are the dominant risk. Encouragingly, the plugin-activation bug (#8644) already has a fix in review, and a batch of Windows-specific test/CI fixes merged today (#8639, #8640, #8641) indicates the team is actively hardening the Windows build path.

## 6. Feature Requests & Roadmap Signals

- **Local model engine controls (MLX + GPU offload + runtime auto-update)** — [#8646](https://github.com/agentscope-ai/QwenPaw/issues/8646) request, matched by the three-PR stack [#8649](https://github.com/agentscope-ai/QwenPaw/pull/8649)/[#8647](https://github.com/agentscope-ai/QwenPaw/pull/8647)/[#8648](https://github.com/agentscope-ai/QwenPaw/pull/8648). *Strong signal this lands in a 2.3.x or 2.4 release:* author is iterating publicly and has already closed/superseded an earlier monolithic attempt.
- **Nested/categorised skill directories** ([#8178](https://github.com/agentscope-ai/QwenPaw/pull/8178)) — backward-compatible `<root>/<category>/<skill>/SKILL.md` layout. Large (XXL) and under review; a likely near-term merge.
- **Local Whisper as an SDK plugin with framework-managed lifecycle** ([#8431](https://github.com/agentscope-ai/QwenPaw/pull/8431)) — a XXXL PR from `lalaliat` (who also submitted the macOS build-timeout fix #8641, so likely an active regular).
- **UI customization:** explicit request for a **toggle between old and new UI** and a less sprawling model-switcher ([#8521](https://github.com/agentscope-ai/QwenPaw/issues/8521)); more legible execution tool cards ([#8612](https://github.com/agentscope-ai/QwenPaw/issues/8612)) and visual consistency for thinking/tool blocks ([#8650](https://github.com/agentscope-ai/QwenPaw/issues/8650)).
- **Prediction:** the MLX/GPU local-model work and the console controls PR are the most likely headline items for the next release after 2.3.0 stabilizes; UI ergonomics requests are accumulating but have no linked PRs yet.

## 7. User Feedback Summary

- **Satisfaction drivers:** users praise human-readable tool-call descriptions ("获取 当前时间", "阅读 MEMORY.md 预览 16行", file/grep match summaries) — see [#8612](https://github.com/agentscope-ai/QwenPaw/issues/8612). Multimodal memory documentation is being actively invested in (#8506).
- **Dissatisfaction, in user-reported terms:**
  - *"只显示思考等内容没有答复内容"* — answers intermittently contain only thinking, no final response ([#8521](https://github.com/agentscope-ai/QwenPaw/issues/8521)); unclear whether model- or app-side.
  - Copy/paste friction: Ctrl+C must be pressed multiple times in Chrome and Edge on the same page type (#8521).
  - **New UI perceived as slower and less efficient than the old one**, with the model picker especially criticized for wasted space; users want the old layout back as an option (#8521).
  - Long-task visual fatigue: left edge "jumping" between thinking cards and tool lines over dozens of steps ([#8650](https://github.com/agentscope-ai/QwenPaw/issues/8650)).
- **Use-case signal:** single-file JS-rendered HTML dashboards previewed in-browser from Chinese-named workspace paths (now fixed, #8502); Chinese-Windows users with GBK/CP936 Notepad/CSV/MD files losing bytes silently on read/grep ([#8234](https://github.com/agentscope-ai/QwenPaw/pull/8234)) — a clear localization/encoding pain point.

## 8. Backlog Watch

Open PRs/issues with meaningful age and review labels that need maintainer attention:

- [PR #8178](https://github.com/agentscope-ai/QwenPaw/pull/8178) — nested skill directories (`first-time-contributor`, `Under Review`, size/XXL, opened 2026-10-11). **30 days without merge**; large surface area, likely needs sustained review bandwidth.
- [PR #8234](https://github.com/agentscope-ai/QwenPaw/pull/8234) — GBK/CP936 decoding for read/edit/grep (`Under Review`, size/XXL, opened 2026-10-14). Same author as #8236; touches core file tools on Chinese Windows.
- [PR #8236](https://github.com/agentscope-ai/QwenPaw/pull/8236) — derive Ollama context window from `num_ctx` instead of a 128k default (`Under Review`, size/XL, opened 2026-10-14). Prevents silent truncation for local `qwen3-coder:30b` users.
- [PR #8431](https://github.com/agentscope-ai/QwenPaw/pull/8431) — Local Whisper → SDK plugin (size/XXXL, opened 2026-10-26); large and unlabeled, risk of bit-rot.
- [PR #8170](https://github.com/agentscope-ai/QwenPaw/pull/8170) — console DOM-mutation render tolerance + chunk-error retry (rebased from #7889; opened 2026-10-10). UI crash resilience work that has already survived one supersession.

**Overall assessment:** Project health is **busy but risk-concentrated** — daily activity is high, maintainers are pairing bug reports with fix PRs quickly, but the 2.3.0 beta line carries serious Windows desktop and channel-activation regressions, and a cluster of large community PRs (especially Chinese-Windows encoding and local-model work) is waiting on review. Closing out #8644/#8653 and the #8643 verification issue would materially improve confidence in beta.3.

*Note: comment/👍 counts for PRs render as `undefined` in the supplied data; PR "activity" here is inferred from update recency and review labels rather than explicit counts.*

</details>

<details>
<summary><strong>ZeroClaw</strong> — <a href="https://github.com/zeroclaw-labs/zeroclaw">zeroclaw-labs/zeroclaw</a></summary>

# ZeroClaw Project Digest — 2026-11-10

## 1. Today's Overview

ZeroClaw is in a **high-activity, CI-stressed state**: 28 issues and 50 PRs were updated in the last 24 hours, but the project has **no new releases** and is currently **CI-blocked** by a security advisory (RUSTSEC-2026-0459, libsqlite3-sys/SQLite) that fails the `Security` job on every build, cascading into the `CI Required Gate` and freezing the merge queue. The bulk of today's activity is a coordinated cluster of OIDC/zerocode security work (Issues #12317–#12340, PR #12317) plus cleanups of older runtime, config, and docs bugs. Eight issues closed today (e.g., #10359 audit-logger hash-chain, #11009 permission-profile cascade, #12064 Discord bot approval leak), signaling steady bug-burndown despite the merge freeze. No new releases shipped; the next version (v0.9.0) remains tagged across open blockers. Overall health: **productive but bottlenecked** — strong reviewer throughput on PRs, yet CI instability and a growing wrapper-flagged "needs-maintainer-review" PR backlog are the main risks.

## 2. Releases

**None.** No new releases in the last 24 hours, and no v0.9.0 release has landed (the label `release:v0.9.0` still tags open blocker #12320). Migrating users should be aware that v0.9.0 is expected to bundle: bundled-SQLite upgrade to 3.54.1 (PR #12322), native Rust XMPP with OMEMO (PR #11847), and OIDC zerocode login (PR #12317) — but all are still open.

## 3. Project Progress

**Closed/merged today (12 PRs and 8 issues):**
- **#10359** (closed) — AuditLogger no longer advances hash-chain state before write; fixes poisoned verification after a failed write. `zeroclaw-labs/zeroclaw#10359`
- **#11009** (closed) — Agent alias rename now cascades permission-profile selectors. `zeroclaw-labs/zeroclaw#11009`
- **#12153** (closed) — `install.sh` no longer misdetects musl on glibc hosts. `zeroclaw-labs/zeroclaw#12153`
- **#12064** (closed) — Discord allowlisted peer bots can no longer resolve plaintext approvals. `zeroclaw-labs/zeroclaw#12064`
- **#12087** (closed) — Web dashboard tool toggle no longer double-saves/dirty-state. `zeroclaw-labs/zeroclaw#12087`
- **#11919** (closed) — Web chat "Thinking" box collapse toggle shipped. `zeroclaw-labs/zeroclaw#11919`
- **#12312** (closed) — OIDC enrollment `authorization_endpoint` now covered by URL policy. `zeroclaw-labs/zeroclaw#12312`
- **PR #12013** (closed) — Regression test for competing TUI signing keys. `zeroclaw-labs/zeroclaw#12013`

**Advancing but still open:** OIDC device-cert bootstrap (PR #12317 + follow-ups #12330–#12340), native XMPP/OMEMO channel (PR #11847), bundled SQLite advisory fix (PR #12322), OpenRouter balance reporting (PRs #11845/#11846), and task-owned SSH transport reuse (PR #11869).

## 4. Community Hot Topics

Ranked by comment count (all remaining items show `Comments: 0`):
1. **#12320** — *Security job fails on every build (RUSTSEC-2026-0459)* — 3 comments. The single most-discussed item; it's a merge-queue blocker. `zeroclaw-labs/zeroclaw#12320`
2. **#10359** — Audit-logger hash-chain poisoning — 2 comments (now closed). `zeroclaw-labs/zeroclaw#10359`
3. **#11009** — Alias rename permission cascade — 2 comments (now closed). `zeroclaw-labs/zeroclaw#11009`
4. **#12153 / #12351 / #11919 / #12087 / #12064 / #11952** — 1 comment each.

**Underlying needs:** the comment distribution shows the community's energy is concentrated on *unblocking CI* and *security correctness*, not feature debate. The high volume of zero-comment security follow-ups (#12324–#12340) authored by `JordanTheJet` and `IftekharUddin` suggests a maintainer-driven hardening sprint rather than organic user demand — a sign the project is prioritizing trust/security debt over new surface area right now.

## 5. Bugs & Stability

Ranked by severity, with fix-PR status:

| Severity | Issue | Summary | Fix PR? |
|---|---|---|---|
| **S1 – workflow blocked** | [#12320](https://github.com/zeroclaw-labs/zeroclaw/issues/12320) | Security job fails every build (RUSTSEC-2026-0459); merge queue frozen | ✅ PR [#12322](https://github.com/zeroclaw-labs/zeroclaw/pull/12322) (upgrades SQLite to 3.54.1, removes exception) |
| **S1 – workflow blocked** | [#12354](https://github.com/zeroclaw-labs/zeroclaw/issues/12354) | zerorelay TLS writes not flushed; dashboard assets hang until 300s idle timeout | ❌ none yet |
| **S2 – degraded** | [#12357](https://github.com/zeroclaw-labs/zeroclaw/issues/12357) | `zerocode` exits 1 for limited accounts (config/logs panes treat refusal as fatal) | ❌ none yet |
| **S2 – degraded** | [#12330](https://github.com/zeroclaw-labs/zeroclaw/issues/12330) | zerocode drops saved remote connection on unparseable config, silently falls back to local daemon | ❌ none yet |
| **S3 – minor** | [#12351](https://github.com/zeroclaw-labs/zeroclaw/issues/12351) | Anthropic fallback test intermittently fails in CI | ❌ none yet |
| **S3 – minor** | [#12350](https://github.com/zeroclaw-labs/zeroclaw/issues/12350) | Telegram channel tests hang until 30-min job timeout | ❌ none yet |
| **S3 – minor** | [#12347](https://github.com/zeroclaw-labs/zeroclaw/issues/12347) | zerocode config writers can drop a concurrent update to `zerocode-config.toml` | ❌ none yet |
| **S3 – minor** | [#12326](https://github.com/zeroclaw-labs/zeroclaw/issues/12326) | Pruned docs versions hit generic GitHub Pages 404 | ❌ none yet |

**Note:** #12320 is the critical path — until PR #12322 merges, *no* PR can land. #12354 (also S1) has no fix PR and could compound the dashboard reliability picture if it ships in v0.9.0.

## 6. Feature Requests & Roadmap Signals

- **#12353** — *Show running estimated USD cost per conversation* (new today, 0 comments). Leverages the existing cost ledger; low-risk UX feature. **Likely candidate for a v0.9.x patch or v0.10.**
- **#12337** — *Operator opt-in (default off) for OIDC self-service device cert bootstrap*. Directly gates PR #12317; likely to land alongside the OIDC feature rather than in a later release. `zeroclaw-labs/zeroclaw#12337`
- **#11919** (closed) — Thinking-box collapse toggle: shipped.
- **#11845/#11846** — OpenRouter credit balance in dashboard/web settings: in-flight, plausible v0.9.0 inclusions.
- **#11847** — Native Rust XMPP with optional legacy OMEMO: the largest feature PR in flight; v0.9.0 headline candidate.
- **PR #7821** — Canonical `sandbox_policy` schema with app-layer enforcement (open since June, flagged `stale-candidate`): a long-running architectural feature that keeps resurfacing.

**Prediction:** v0.9.0 will be a *stability + security + channels* release (SQLite upgrade, OIDC zerocode login, native XMPP, OpenRouter balance), with per-conversation cost display (#12353) more likely in the following minor bump.

## 7. User Feedback Summary

Real user pain points visible today skew toward **operational friction rather than core functionality**:
- **CI/security friction** (#12320): contributors can't merge — the loudest signal.
- **Multi-user / least-privilege gaps** (#12357, #11009): non-admin and limited accounts hit refusal-as-fatal paths; alias renames leak stale permissions.
- **Reliability of remote/web paths** (#12354, #12330): silent fallback to a local daemon when config is malformed is a trust-eroding behavior for remote users.
- **Cost visibility** (#12353): users on spending allowances explicitly want in-conversation cost feedback — a recurring theme in the cost-ledger area.
- **Polish/UX** (#12087, #11919): small dashboard/chat annoyances (auto-save vs. dirty state, Thinking box) are being reported and fixed quickly — a positive satisfaction signal.

Overall sentiment appears **constructive**: users are filing precise, well-scoped bugs with reproduction context, and maintainers are closing a meaningful subset within days. Dissatisfaction is concentrated on CI blockage and silent-failure paths, not on missing capabilities.

## 8. Backlog Watch

Items needing maintainer attention (old + high-impact):
- **PR [#7821](https://github.com/zeroclaw-labs/zeroclaw/pull/7821)** — `feat(security): canonical sandbox_policy schema` — open since **2026-06-17** (~5 months), labels include `needs-author-action`, `stale-candidate`, `risk:high`. Foundational security work at risk of bit-rot.
- **PR [#11845](https://github.com/zeroclaw-labs/zeroclaw/pull/11845)** / **#11846** — OpenRouter balance reporting, open since 2026-10-18, repeatedly rebased ("integrates current upstream and resolves conflicts") — indicates merge contention; may need maintainer decision on scope.
- **PR [#11847](https://github.com/zeroclaw-labs/zeroclaw/pull/11847)** — Native XMPP/OMEMO, open since 2026-10-19, `needs-maintainer-review`, `risk:high`, `size:XL`, depends on #12015. Large security-sensitive channel addition awaiting review.
- **PR [#11859](https://github.com/zeroclaw-labs/zeroclaw/pull/11859)**, **#11868**, **#11874**, **#11911** — a chain of `risk:medium`/`risk:high` runtime fixes open since mid/late October, all part of the same dependency graph (#11868 → #11869 → #11911 → #12323). This cluster risks stalling together if any link is rejected.
- **Issue [#12319](https://github.com/zeroclaw-labs/zeroclaw/issues/12319)** — Track bounded duplicate-crate allowances from XMPP; a cleanup follow-up that will be easy to forget once #11847 merges.

**Recommendation:** prioritize landing PR #12322 (unblocks everything), then schedule maintainer reviews for the #11868/#11869/#11911/#12323 chain and the #11845/#11846 OpenRouter pair before they accumulate further rebase debt.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*