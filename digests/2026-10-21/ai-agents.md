# OpenClaw Ecosystem Digest 2026-10-21

> Issues: 500 | PRs: 500 | Projects covered: 5 | Generated: 2026-10-20 23:47 UTC

- [OpenClaw](https://github.com/openclaw/openclaw)
- [Hermes Agent](https://github.com/nousresearch/hermes-agent)
- [IronClaw](https://github.com/nearai/ironclaw)
- [QwenPaw](https://github.com/agentscope-ai/QwenPaw)
- [ZeroClaw](https://github.com/zeroclaw-labs/zeroclaw)

---

## OpenClaw Deep Dive

# OpenClaw Project Digest — 2026-10-21

## 1. Today's Overview

OpenClaw shows **very high activity** with 500 issues and 500 PRs updated in the last 24 hours, though the project is operating under significant stability pressure. A large cohort of **P0/P1 crash-loop and availability issues** remains open (memory leaks, SQLite/WAL checkpoint deadlocks, Windows restart unreliability, session-state wedging), and several of these have been long-lived (Issue #91588 open since June). The PR pipeline is heavily dominated by a maintainer-led **test-cleanup campaign** (batches d336–d346) alongside targeted fixes for SQLite migrations, Anthropic/Claude permission handling, and migration-import features. No releases shipped today. Overall health assessment: **high throughput, but a heavily loaded bug backlog concentrated on Gateway stability, persistence (SQLite/WAL), and platform-specific reliability (Windows/systemd)**.

---

## 2. Releases

No new releases in the last 24 hours. (Latest referenced builds in issues/PRs are the `2026.10.x` beta line, up to `2026.10.10-beta.2`; a `release/2026.10.6` stable patch train is active.)

---

## 3. Project Progress

**Merged/closed PRs (sampled):**
- [#178325](https://github.com/openclaw/openclaw/pull/178325) (CLOSED) — Sanitize terminal control chars in `plugins marketplace list` output (defensive security fix).
- [#178856](https://github.com/openclaw/openclaw/pull/178856) (CLOSED) — E2E UI test stabilization for native touch release.

**Closed Issues indicating fixes/verification landed (sampled):**
- [#169586](https://github.com/openclaw/openclaw/issues/169586) — Windows LINE Doctor contract EEXIST on undici-types alias.
- [#173764](https://github.com/openclaw/openclaw/issues/173764) — `openclaw update` hang in post-activation doctor step.
- [#170212](https://github.com/openclaw/openclaw/issues/170212) — Telegram `/update` failure leaving systemd service dead.
- [#167385](https://github.com/openclaw/openclaw/issues/167385) — Hand-deleted session archive blocking repair.
- [#163899](https://github.com/openclaw/openclaw/issues/162899) / [#135658](https://github.com/openclaw/openclaw/issues/135658) / [#125640](https://github.com/openclaw/openclaw/issues/125640) — Update freeze, cron NO_REPLY regression, and memory-index batch-limit regression.

**Features/slices advancing in open PRs:**
- [#178764](https://github.com/openclaw/openclaw/pull/178764) — Automations run scheduled work through session admission (slice 2/4).
- [#178768](https://github.com/openclaw/openclaw/pull/178768) / [#178769](https://github.com/openclaw/openclaw/pull/178769) — Migration SDK: native agent/cron import effects + Grok Bot config import.
- [#178860](https://github.com/openclaw/openclaw/pull/178860) — Native `tts-1` speech provider for ClawRouter.
- [#177855](https://github.com/openclaw/openclaw/pull/177855) — Restrict Gateway-local terminal/automation execution (security boundary).

---

## 4. Community Hot Topics

| Item | Comments | Signal |
|---|---|---|
| [#91588](https://github.com/openclaw/openclaw/issues/91588) — **P0 Gateway memory leak (350MB→15.5GB, OOM crash-loop)** | 41 | Longest-running top-severity reliability issue; repeated `launchd-handoff` restarts. |
| [#160959](https://github.com/openclaw/openclaw/issues/160959) — **P0 Gateway blocks minutes capturing large external plugins (2026.9.6 regression)** | 41 | Event-loop starvation at startup/republish; regression tied to plugin generation capture. |
| [#164294](https://github.com/openclaw/openclaw/issues/164294) — **WAL auto-checkpoint never completes (pinned by in-process reader)** | 25 | Persistence-layer bottleneck, P2 but operationally serious. |
| [#78308](https://github.com/openclaw/openclaw/issues/78308) — **Channel-mediated approval for MCP tool calls (consent envelope)** | 19 | Security-conscious users want MCP tools gated like shell-exec. |
| [#120385](https://github.com/openclaw/openclaw/issues/120385) — **Code Mode incomplete tool catalog for cron/memory-flush turns** | 18 | Session-state/UX friction with MCP "Unknown tool id". |

**Underlying needs:** Users are primarily asking for (a) **predictable Gateway availability and restart behavior**, (b) **safe MCP/secrets handling** (consent + SecretRef), and (c) **consistent multi-channel/multi-agent semantics** across cron, memory-flush, and subagent turns.

---

## 5. Bugs & Stability

**P0 / crash-loop (requires immediate attention):**
- [#91588](https://github.com/openclaw/openclaw/issues/91588) — Gateway memory leak → OOM restart loop. *(No fix PR.)*
- [#160959](https://github.com/openclaw/openclaw/issues/160959) — Gateway event-loop blocked for minutes on large plugin capture (2026.9.6 regression). *(No fix PR.)*
- [#170956](https://github.com/openclaw/openclaw/issues/170956) — Windows: slow startup, unclean plugin shutdown, schtasks permission errors → restarts/updates fail.
- [#152275](https://github.com/openclaw/openclaw/issues/152275) — Post-commit plugin activation failure disables model catalog & reply dispatch until restart.
- [#154950](https://github.com/openclaw/openclaw/issues/154950) — Upgrade 2026.7.1→2026.9.x blocked by unresolvable "legacy-workspace" error.
- [#166634](https://github.com/openclaw/openclaw/issues/166634) — Late reclamation commit checkpoint failure leaves agent unavailable after crash recovery.

**P1 highs:**
- [#125764](https://github.com/openclaw/openclaw/issues/125764) — Telegram outbound sends dead-lettered after one attempt (message loss).
- [#172837](https://github.com/openclaw/openclaw/issues/172837) — Codex `nativeSubagentAssignments` never removed; re-pinned/re-sent per new parent thread.
- [#171831](https://github.com/openclaw/openclaw/issues/171831) — Windows 2026.10.2 perf regression (startup 320s vs 55s; 173s pluginState.register txn).
- [#157712](https://github.com/openclaw/openclaw/issues/157712) — CLI state reads leak 162 MB DB snapshots (~23 GB/25 min observed).
- [#113701](https://github.com/openclaw/openclaw/issues/113701) — Context overflow with large tool outputs; compaction can't recover → failure loop.
- [#158070](https://github.com/openclaw/openclaw/issues/158070) — Preflight compaction voids in-flight delivery ("authority no longer active").
- [#135858](https://github.com/openclaw/openclaw/issues/135858) — opencode-go catalog snapshot misses provider.npm→api override.
- [#148557](https://github.com/openclaw/openclaw/issues/148557) — OAuth auth profile unresolvable when shared auth store ownership is `state-db`.

**Regressions surfaced today:**
- [#177989](https://github.com/openclaw/openclaw/issues/177989) — Kimi Code repeats tool calls / over-polls background processes (2026.10.4/10.5).

**Fix PRs in flight (selected):**
- [#178869](https://github.com/openclaw/openclaw/pull/178869) — Don't block upgrades on legacy `sqlite_stat4` tables (Closes #178584).
- [#177677](https://github.com/openclaw/openclaw/pull/177677) — Preserve Claude Code default permission mode (Fixes #177622).
- [#178858](https://github.com/openclaw/openclaw/pull/178858) — Test fix for stale `/tmp/openclaw-agent.sqlite` (schema mismatch).
- [#178239](https://github.com/openclaw/openclaw/pull/178239) — Release retrospective remediation batch backported to `release/2026.10.6`.

---

## 6. Feature Requests & Roadmap Signals

- [#78308](https://github.com/openclaw/openclaw/issues/78308) — **Consent envelope for MCP tool calls** (security/approval pipeline extension). Likely next minor, contingent on security review.
- [#76493](https://github.com/openclaw/openclaw/issues/76493) — **SecretRef objects in `mcp.servers[].env` schema**. High operator demand; schema change likely.
- [#162164](https://github.com/openclaw/openclaw/issues/162164) — **Opt-in personal identity on iOS/macOS while preserving Shared owner** (umbrella).
- [#80843](https://github.com/openclaw/openclaw/issues/80843) — **web_search provider fallback chain** (quota/network failures).
- [#138326](https://github.com/openclaw/openclaw/issues/138326) — **Configurable SQLite busy_timeout, embedding concurrency, WAL autocheckpoint** — strongly aligned with current SQLite/WAL stability work.
- [#98298](https://github.com/openclaw/openclaw/issues/98298) — **Prune stale thinking blocks** in `contextPruning`.
- [#135679](https://github.com/openclaw/openclaw/issues/135679) — **Batched bounded `sessions_search`** (up to 8/call).
- [#46058](https://github.com/openclaw/openclaw/issues/46058) — **Chat-first Android surface** discussion.

**Prediction:** The next minor will likely ship MCP security/schema improvements (#78308, #76493), a `web_search` fallback chain (#80843), and configurability of SQLite/WAL knobs (#138326) as part of the ongoing persistence hardening thrust. Migration/import features (PRs #178768, #178769) and native TTS (`#178860`) are near-term extension deliverables.

---

## 7. User Feedback Summary

**Pain points observed:**
- **Availability is the dominant theme.** OOM loops, Gateway hangs, WAL checkpoint stalls, and Windows/systemd restart failures dominate high-comment issues.
- **Silent failures hurt trust.** Messages dead-lettered without errors (#125764), cookie-driven replies voided (#158070), and "looks like success" multi-agent failures (#164972) are repeatedly cited.
- **Upgrade/update reliability is a recurring frustration** across Linux systemd (#170212), Windows Control UI (#162899), and macOS legacy-workspace (#154950).
- **Resource footprint concerns** — the CLI read-snapshot leak (#157712) and 144 MB per stdio MCP child (#164690) suggest operators run large multi-agent setups where overhead matters.

**Satisfaction signals:** Active iterations on migration SDK, native TTS, and marketplace UX indicate the product is broadening, and many prior regressions are reaching closure — a healthy recovery pattern despite the heavy bug load.

---

## 8. Backlog Watch

Long-lived or strategically important items needing maintainer attention:

- [#91588](https://github.com/openclaw/openclaw/issues/91588) (open since 2026-06-09, 41 comments, P0, no fix PR) — Gateway memory leak.
- [#78308](https://github.com/openclaw/openclaw/issues/78308) (since 2026-05-06, needs-security-review) — MCP consent envelope.
- [#76493](https://github.com/openclaw/openclaw/issues/76493) (since 2026-05-03, 👍4) — SecretRef in `mcp.servers[].env`.
- [#80843](https://github.com/openclaw/openclaw/issues/80843) (since 2026-05-12, 👍4) — web_search provider fallback chain.
- [#72015](https://github.com/openclaw/openclaw/issues/72015) (since 2026-04-26, 👍2) — active-memory blocking replies / QMD boot overload.
- [#46058](https://github.com/openclaw/openclaw/issues/46058) (since 2026-03-14) — Android chat-first surface discussion, awaiting maintainer direction.
- [#125308](https://github.com/openclaw/openclaw/issues/125308) / [#125314](https://github.com/openclaw/openclaw/issues/125314) (bulk-filed, since 2026-08-17) — Unbounded sessions & Codex direct-message serialization; PR #125897 closed unmerged for inactivity and needs a champion.
- [#149631](https://github.com/openclaw/openclaw/issues/149631) (stale) — PR preflight throws at 121 jobs vs 120 Node matrix cap (CI friction).

**Note to maintainers:** the SQLite/WAL cluster (#164294, #172091, #138326, #157712) likely shares root causes and would benefit from a coordinated fix + configurable knobs to unblock multiple P1/P2 reports at once.

---

## Cross-Ecosystem Comparison

# Cross-Project Comparison Report: Personal AI Assistant / Agent Open-Source Ecosystem
**Date: 2026-10-21 | Scope: OpenClaw, Hermes Agent, IronClaw, QwenPaw, ZeroClaw**

---

## 1. Ecosystem Overview

The personal AI assistant / agent open-source landscape as of late 2026 is characterized by **five architecturally distinct projects converging on a common set of production-grade concerns**: availability, security boundaries, multi-channel consistency, and memory integrity. All five projects show sustained community engagement, yet each is bottlenecked differently — OpenClaw on a P0 bug backlog, Hermes on maintainer review throughput, IronClaw on maintainer attention to strategic issues, QwenPaw on channel-layer regression density, and ZeroClaw on review capacity against a large open PR queue. No project shipped a release on 2026-10-21, suggesting the ecosystem is broadly in a **stabilization and hardening cycle** rather than a feature-expansion phase. The convergence of themes — plugin/WASM isolation, MCP security, provider-error fallback, cross-platform reliability — indicates the ecosystem has moved past the "does the agent work?" stage into "does the agent operate safely and predictably at scale?"

---

## 2. Activity Comparison

| Project | Issues Updated (24h) | PRs Updated (24h) | PRs Merged/Closed | Release Status | Health Score* | Primary Bottleneck |
|---|---|---|---|---|---|---|
| **OpenClaw** | 500 | 500 | ~2 sampled + several closed issues | No release (2026.10.x beta line) | ⚠️ **6.5/10** | P0 bug backlog (Gateway/OOM/SQLite) |
| **Hermes Agent** | 50 | 50 | **0** | No release | ⚠️ **5.5/10** | Review capacity (0 merges, 12+ stacked PRs) |
| **IronClaw** | 3 | 9 | 2 (both Dependabot) | No release | 🟡 **6.0/10** | Maintainer engagement on strategy |
| **QwenPaw** | 15 | 34 | 9 | No release (pre-2.3.0) | 🟢 **7.5/10** | Channel-layer regression density |
| **ZeroClaw** | 50 | 50 | **1** | No release (v0.8.7 in flight) | 🟡 **6.5/10** | Review capacity (49 open PRs) |

*Health Score is a composite heuristic weighting: throughput, merge ratio, severity of open bugs, release cadence, and maintainer responsiveness. Higher is healthier. Values are analyst estimates for comparative framing, not vendor-reported metrics.*

**Note on scale disparity:** OpenClaw operates an order of magnitude larger than peers in raw activity (500/500 vs 50/50), but the absolute numbers mask a **~10× larger unresolved P0/P1 crash-loop backlog**. Hermes and ZeroClaw match each other in volume (50/50) but share the same pathology — heavy triage, near-zero merge throughput.

---

## 3. OpenClaw's Position

### Advantages vs Peers
- **Scale and ecosystem gravity.** At 500 issues + 500 PRs updated daily, OpenClaw is the **de facto reference implementation** — roughly 10× the activity of most peers and the only project with a mature marketplace, migration SDK, and multi-provider router (ClawRouter).
- **Broadest integration surface.** Native TTS, migration SDK for Grok Bot/agent/cron imports, marketplace plugins, multi-channel (Telegram/Discord/Slack/LINE), and MCP integration place it furthest along the "platform" curve.
- **Active maintainer-driven campaigns.** The test-cleanup batches (d336–d346) and a structured `release/2026.10.6` patch train demonstrate institutional release discipline peers lack.

### Technical Approach Differences
- OpenClaw is **Gateway-centric**: a long-lived daemon brokers sessions, plugins, and channels. This delivers coherence but concentrates risk — the P0 memory leak (#91588, 350MB→15.5GB) and WAL checkpoint deadlock (#164294) are Gateway-scoped.
- Contrast with **ZeroClaw's plugin/WASM sandbox** (subprocess isolation), **QwenPaw's channel-as-plugin subprocess model** (PR #8187), and **IronClaw's declarative hosted-MCP extension seams** — all three peers are architecturally moving toward *isolation* as the answer to the exact class of bug OpenClaw is fighting.

### Community Size Comparison
- OpenClaw's issue/PR volume is **~10× Hermes and ZeroClaw**, **~15× QwenPaw**, and **~100× IronClaw**. It also has the longest-lived P0 (#91588 open since June, 41 comments) — a double-edged signal: deep engagement, but also evidence that the largest project cannot resolve its hardest bugs at the same velocity it accumulates them.

**Verdict:** OpenClaw leads on **breadth and ecosystem**, but is **losing the reliability race** to smaller, more isolation-focused peers. Its strategic risk is that the same Gateway-centric architecture that enables its platform breadth is the root cause of its most-cited bugs.

---

## 4. Shared Technical Focus Areas

The following requirements emerge across **multiple projects independently**, indicating ecosystem-level demand rather than project-specific quirks:

| Theme | Projects | Specific Need |
|---|---|---|
| **MCP security / consent gating** | OpenClaw (#78308 consent envelope, #76493 SecretRef), Hermes (#141468 cron widens MCP scope), IronClaw (#8146 loopback MCP rejected), ZeroClaw (#11327 plugin tool hijack) | MCP tools must be **gated, scoped, and credential-isolated**; current registries are too permissive. ZeroClaw explicitly contemplates an untrusted-plugin threat model. |
| **Provider-error classification & fallback** | OpenClaw (#80843 web_search fallback chain), QwenPaw (#8092 content-inspection false positives, #8171 audio rejection family), ZeroClaw (#11296 llama.cpp URI, #11651 Telegram 429) | Turns must **degrade gracefully**, not die silently. QwenPaw's 12-model fallback chain that still kills turns is the clearest indictment. |
| **Sandbox / host-state isolation** | Hermes (#135037 Windows PATH pollution), ZeroClaw (#11357 plugin remove deletes wrong dir), OpenClaw (#177855 restrict Gateway-local execution) | Sandbox/test installs must **never mutate host-global state** (registry, PATH, shared filesystem). |
| **Cross-platform reliability (Windows/macOS/Linux)** | OpenClaw (#170956, #171831 Windows), Hermes (#135037, #142271, #142216), QwenPaw (#8315 corporate proxy), ZeroClaw (#11818 SUN_LEN, CI arm64 OOM) | Parity across OSes is the **top recurring complaint class**; all projects are macOS/CPU-first and degrade elsewhere. |
| **Memory integrity & schema-validated writes** | ZeroClaw (#6998 schema-validated consolidation, #11657 configurable category), Hermes (#76035 hallucinated memory → destructive USER.md), OpenClaw (#72015 active-memory blocking) | Memory systems must **fail closed**, not silently consolidate or hallucinate. |
| **Persistence-layer stability (SQLite/WAL)** | OpenClaw (#164294, #138326, #157712), Hermes (#133631 state.db patience), ZeroClaw (state-db ownership) | Configurable **busy_timeout / WAL autocheckpoint / embedding concurrency** knobs are widely requested. OpenClaw's cluster likely shares root causes with peer fd exhaustion issues. |
| **Update / restart reliability** | OpenClaw (#170212 systemd, #162899 Windows), Hermes (#142216 macOS hand-off), QwenPaw (installer make-skill broken) | Post-update **restart loops and dead services** erode trust more than the updates themselves. |

**Cross-project signal:** The ecosystem is converging on **isolation + explicit consent + graceful degradation** as the three pillars of production readiness — and no project has yet shipped all three.

---

## 5. Differentiation Analysis

| Dimension | OpenClaw | Hermes Agent | IronClaw | QwenPaw | ZeroClaw |
|---|---|---|---|---|---|
| **Feature focus** | Platform: Gateway, marketplace, migration SDK, TTS, multi-channel | Desktop + delegation + fleet ops (`hermes wall`), local models | Decentralization: on-chain contracts, sovereign agents | Channels + plugins + Console UI, mobile (HarmonyOS) | Plugin/WASM sandbox, SOP engine, security hardening |
| **Target users** | Broad operators, marketplace plugin authors, multi-agent fleets | Power users, desktop workflows, self-hosters | Sovereign/on-chain agent builders, NEAR ecosystem | Enterprise/self-hosted, multi-channel ops, mobile | Security-conscious plugin developers, multi-provider ops |
| **Architecture** | Centralized Gateway daemon | Gateway + Desktop + CLI | Rust core (`nearai/ironclaw`), declarative extension surfaces | Python host + channel-as-plugin subprocess model | Rust core, WASM plugin sandbox, goal-mode policy contracts |
| **Security posture** | Layered (marketplace sanitization, secret refs proposed) | Feature-gated approvals (smart mode criticized) | Declarative, host-mediated extensions | Content-inspection + plugin themes | Explicit (RustSec patches, JWKS sharing, principal-based RFC #11914) |
| **Release cadence** | Beta line + stable patch train (2026.10.x) | Ad-hoc, fix-heavy | Dependabot-driven, slow features | Structured (v2.2.2-beta.4 → 2.3.0 roadmap #8289) | Milestoned (v0.8.7 → v0.9.0) |
| **Biggest stated risk** | Gateway availability | Data safety (#141346 PowerPoint loss) | Community ambition vs maintainer throughput | Channel-layer regressions | SOP correctness (#10066 P0/S1) |

**Key differentiators:**
- **OpenClaw** is the only project attempting to be a *full platform* — its risk is sprawl.
- **Hermes** uniquely combines desktop, delegation, and fleet ops — its risk is the desktop/cron integration gap (#83904) and a stalled approval model.
- **IronClaw** is the **only genuinely decentralization-native** project (on-chain market, sovereign keys) — a distinct strategic bet.
- **QwenPaw** is the **most enterprise-oriented** (corporate proxies, content inspection, multi-channel) — and therefore disproportionately hurt by channel bugs.
- **ZeroClaw** is the **most security-engineered** (WASM sandbox, RustSec patching, principal-trust RFC) — a vanguard for where peers will likely go next.

---

## 6. Community Momentum & Maturity

### Activity Tiers

**Tier 1 — High-throughput, high-risk (stabilizing under load):**
- **OpenClaw** — Massive volume, but the *largest unresolved P0/P1 backlog in the sample*. Momentum is real; maturity is questionable until the Gateway/OOM/WAL cluster closes.

**Tier 2 — High-velocity, review-constrained (stalled at merge gate):**
- **Hermes Agent** — 0 merges today, 12+ interdependent PRs from one contributor (`yoyodine-industries`), top-voted feature (#80222) blocked on `needs-decision`. Development capacity exceeds review capacity.
- **ZeroClaw** — 1 merge today, 49 open PRs, four XXXL security PRs stacked/draft. Same pathology as Hermes: **willing contributors, insufficient maintainer bandwidth**.

**Tier 3 — Moderate, plan-driven (iterating toward clear milestones):**
- **QwenPaw** — 9 merges today, closed out the entire audio-fallback family (#7015 → #8215), and has an explicit v2.3.0 roadmap (#8289). **Best merge discipline** in the sample.
- **IronClaw** — Low human activity, healthy Dependabot hygiene, one substantive PR (#8147) in flight. **Most mature dependency posture, thinnest feature velocity**.

### Maturity Assessment
- **Most mature operationally:** QwenPaw (clear roadmap, high merge rate) and IronClaw (clean dependency hygiene, Rust core).
- **Most mature architecturally for security:** ZeroClaw (WASM sandbox, RustSec discipline, RFC-driven).
- **Most mature in ecosystem breadth:** OpenClaw — but the least mature in stability relative to its scale.
- **Least mature in process:** Hermes and ZeroClaw share the same review-bottleneck pattern; both risk contributor attrition if stacked PR series bit-rot (ZeroClaw #9809 and #11186 are 2.5 and 1 month old respectively; Hermes' `yoyodine-industries` series is unlanded).

---

## 7. Trend Signals (For AI Agent Developers)

The following industry-level signals are extractable from cross-project community feedback:

1. **"Smart" approval defaults are on trial.** Hermes #141346 (agent auto-approved `osascript` → destroyed unsaved PowerPoint work) will have a chilling effect on privileged-mode defaults industry-wide. *Implication:* design approvals around **blast radius**, not command names. OS-automation primitives (`osascript`, AppleScript, PowerShell) must be treated as destructive by default, and `--force-with-lease`-style guardrails (Hermes PR #136404) are becoming a pattern.

2. **MCP is the new attack surface.** Four of five projects have open MCP-security issues — consent envelopes (OpenClaw #78308), scope widening (Hermes #141468, ZeroClaw #11327), and loopback rejection (IronClaw #8146). *Implication:* MCP tool registration needs **capability declarations, consent gates, and per-call scoping** as first-class primitives, not bolt-ons.

3. **Isolation is graduating from "nice" to "required."** Subprocess/WASM plugin isolation (QwenPaw #8187, ZeroClaw WASM sandbox), sandboxed installs that don't pollute host PATH (Hermes #135037), and per-endpoint loopback enrollment (IronClaw #8147) all point the same way. *Implication:* monolithic gateway architectures (like OpenClaw's) will face mounting pressure to **partition processes** as plugin ecosystems grow.

4. **Provider-error handling is a competitive differentiator.** QwenPaw's audio-rejection classifier needed four PRs across four weeks (#7015→#8215) to cover three providers. *Implication:* building a **unified provider-error taxonomy** with graceful fallback chains (OpenClaw #80843, OpenClaw #8092 fix) is now table-stakes, not a differentiator.

5. **Memory is a trust boundary, not a feature.** Hermes #76035 (hallucinated "memory full" → destructive USER.md consolidation) and ZeroClaw #6998 (schema-validated consolidation) frame memory as **data-integrity infrastructure**. *Implication:* memory writes need validation schemas, char-count checks, and reversible consolidation — the same rigor applied to databases.

6. **SQLite/WAL knobs are a cross-project request.** OpenClaw (#138326), Hermes (#133631), and state.db issues across the board converge on operator demand for **busy_timeout, WAL autocheckpoint, and embedding concurrency** controls. *Implication:* local-first agents hitting production scale are re-discovering classic DB tuning concerns; ship configurable defaults.

7. **Cross-platform parity is a market-expansion lever.** Every project has Windows/macOS/Linux-specific bugs. *Implication:* the first project to achieve true cross-platform parity unlocks a materially larger user base — and the current cost is being paid in low-severity-but-high-volume issues that erode trust.

8. **The policy layer is the next architectural epoch.** ZeroClaw's principal-based trust RFC (#11914) explicitly unifies content, memory, and capability access as one missing abstraction, framing three P1 issues (#11908, #11912, #11913) as symptoms. *Implication:* expect the ecosystem to converge on a **unified access-control / policy engine** for agents in 2027 — analogous to how Kubernetes RBAC unified fragmented auth checks.

---

### Bottom Line for Decision-Makers

- **If you need ecosystem breadth and integrations today:** OpenClaw, but budget for reliability engineering and monitor the Gateway stability cluster.
- **If you need data safety and desktop workflows:** Hermes, but be prepared for the approval-model rework that #141346 will force.
- **If you need self-hosted / local MCP:** IronClaw or QwenPaw, with IronClaw trending toward decentralization and QwenPaw toward enterprise multi-channel.
- **If you need security-first plugin isolation:** ZeroClaw is the architectural vanguard, though its review backlog is a near-term risk.
- **Ecosystem-wide:** the winners in 2027 will be those who ship **isolation + explicit consent + graceful degradation** together — no project has all three today, and the gap is the opportunity.

---

## Peer Project Reports

<details>
<summary><strong>Hermes Agent</strong> — <a href="https://github.com/nousresearch/hermes-agent">nousresearch/hermes-agent</a></summary>

# Hermes Agent — Project Digest
**Date: 2026-10-21**

---

## 1. Today's Overview

Hermes Agent shows **high sustained activity** with 50 issues and 50 PRs updated in the last 24 hours, but the day's throughput is heavily skewed toward triage rather than resolution: **zero PRs were merged or closed**, and only 5 of 50 active issues were closed. The issue tracker is dominated by **security and data-safety bugs** (e.g., #141346's unrecoverable PowerPoint data loss via auto-approved `osascript`, #135451's credential misbinding), platform-specific stability problems on **Windows and macOS**, and a cluster of long-running session/state/cron correctness bugs — many now 2+ months old. A notable pattern is the large batch of open PRs from a single contributor (`yoyodine-industries`, ~12 of the top 20), suggesting either a bottleneck in maintainer review capacity or a coordination problem in landing an interdependent patch series. Overall project health reads as **active but review-constrained**, with a growing backlog of well-diagnosed, high-severity issues waiting on maintainer attention.

---

## 2. Releases

**No new releases in the last 24 hours.** None to report — no changelog, breaking changes, or migration notes apply today.

---

## 3. Project Progress

**No PRs were merged or closed today (0 merged/closed out of 50 updated).** All 50 updated PRs remain open. Consequently, no features formally "shipped" today. However, several in-flight PRs represent meaningful forward motion that is **staged but unlanded**:

- **PR #136404** — `fix(approvals)`: gives `git push --force-with-lease` its own dangerous-command key, guarded to non-main destinations. Directly relevant to the day's security theme (destructive-action guardrails).
- **PR #140109** — `feat(local-models)`: resume interrupted setup and discard partial downloads. Addresses a concrete UX gap in local model onboarding.
- **PR #142294** — `fix(desktop)`: remembered owner must match the row's profile, not just the connection (session cross-profile leak fix).
- **PR #136343** — `fix(gateway)`: dispatcher tick must not serve a frozen mixed revision (content-based skew gate). A P1 reliability fix.
- **PR #135953** — `fix(cli)`: resumed session's model follows profile config, not a stale cached pin.
- **PR #133639** — `feat(cli)`: `hermes wall` broadcast to every registered agent (fleet-ops feature).

**Assessment:** The pipeline is full but stalled at the merge gate. The volume of interdependent fixes from one author (approvals, bootstrap, gateway skew, terminal handles) suggests a **series that must land together**, which is likely why none have merged independently.

---

## 4. Community Hot Topics

Ranked by comment activity:

1. **[Issue #141346](https://github.com/NousResearch/hermes-agent/issues/141346)** — *18 comments* — Smart approval auto-approved `osascript` commands that closed the user's unsaved PowerPoint deck and deleted its export (**unrecoverable data loss**). The single most-discussed item today.
   - **Underlying need:** Users want the `smart` approval mode to treat OS-automation primitives (`osascript`, AppleScript) as high-risk destructive operations, not "safe" scripting. The blast radius of local desktop automation is under-modeled.

2. **[Issue #135037](https://github.com/NousResearch/hermes-agent/issues/135037)** — *9 comments* — Windows user-PATH registration writes a sandbox/foreign checkout's `bin` dirs into the shared `HKCU\Environment\Path`.
   - **Underlying need:** Isolation guarantees. Sandboxed/test installs must not mutate host-global state — a trust-boundary concern for CI and multi-profile users.

3. **[Issue #83904](https://github.com/NousResearch/hermes-agent/issues/83904)** — *8 comments* — Cron jobs scheduled from Hermes Desktop have no delivery path back to the active chat.
   - **Underlying need:** Desktop and cron subsystems are not integrated; `deliver=origin` is meaningless when origin isn't a gateway-connected session.

4. **[Issue #142136](https://github.com/NousResearch/hermes-agent/issues/142136)** — *8 comments, CLOSED* — Skill directory exists on disk but slash command not registered after reload. *(Closed today — one of the day's few resolutions.)*

5. **[Issue #80222](https://github.com/NousResearch/hermes-agent/issues/80222)** — *8 comments, 4 👍* — Feature request: per-call model and `reasoning_effort` overrides on `delegate_task`. Highest reaction count of the day.
   - **Underlying need:** Power users want fine-grained cost/quality control over sub-agent delegation rather than all-or-nothing config blocks.

6. **[Issue #126305](https://github.com/NousResearch/hermes-agent/issues/126305)** — *7 comments* — DeepSeek compression summary truncation (with a notable self-retraction on the "8192 default" claim).
   - **Underlying need:** Provider-parity transparency; users are debugging provider behavior with limited observability.

---

## 5. Bugs & Stability

Ranked by severity. **None of these have a merged fix PR today.**

| Severity | Issue | Summary | Fix PR? |
|---|---|---|---|
| 🔴 **Critical (data loss)** | [#141346](https://github.com/NousResearch/hermes-agent/issues/141346) | Smart approval auto-approved `osascript` → destroyed unsaved PowerPoint export (unrecoverable) | No |
| 🔴 **Critical (security)** | [#135451](https://github.com/NousResearch/hermes-agent/issues/135451) | `browser_vault_save_login` binds credentials to **wrong origin** when password input isn't `type=password` | No |
| 🟠 **High (P1)** | [#135037](https://github.com/NousResearch/hermes-agent/issues/135037) | Windows sandbox install pollutes shared host `HKCU\Environment\Path` | No |
| 🟠 **High (P1)** | [PR #136343](https://github.com/NousResearch/hermes-agent/pull/136343) | Gateway dispatcher can serve a frozen mixed revision after checkout rewrite | **PR open** |
| 🟠 **High (security)** | [#141468](https://github.com/NousResearch/hermes-agent/issues/141468) | Cron `enabled_toolsets: mcp-<name>` **widens** job to every enabled MCP server | No |
| 🟠 **High (security)** | [#119682](https://github.com/NousResearch/hermes-agent/issues/119682) | `browser_vault_enter_code` can select OTP form on the **wrong tab** | No |
| 🟠 **High (state)** | [#135994](https://github.com/NousResearch/hermes-agent/issues/135994) | Group-room member sessions never pick up SOUL.md/skills/toolset changes | No |
| 🟠 **High (crash)** | [#142271](https://github.com/NousResearch/hermes-agent/issues/142271) | Windows kanban worker **deadlocks** importing numpy in memory-provider plugin | No |
| 🟡 **Medium** | [#76035](https://github.com/NousResearch/hermes-agent/issues/76035) | Agent **hallucinates full memory**, destructively consolidates USER.md without char-count check | No |
| 🟡 **Medium** | [#142281](https://github.com/NousResearch/hermes-agent/issues/142281) | Gateway auth refusal exits 1 instead of 78 → **systemd restart loop** after update | No |
| 🟡 **Medium** | [#142216](https://github.com/NousResearch/hermes-agent/issues/142216) | macOS in-app update always fails — hand-off custodian blocks `hermes update` | No |
| 🟡 **Medium** | [#95545](https://github.com/NousResearch/hermes-agent/issues/95545) | *(CLOSED)* Windows Desktop chat pane renders blank after send | Closed |
| 🟡 **Medium** | [#142264](https://github.com/NousResearch/hermes-agent/issues/142264) | Background `$SHELL -lic` spawns never source `terminal.shell_init_files` | No |
| 🟡 **Medium** | [#142111](https://github.com/NousResearch/hermes-agent/issues/142111) | Native Windows regex with `\"` silently misses (argv backslash) | No |
| 🟡 **Medium** | [#120872](https://github.com/NousResearch/hermes-agent/issues/120872) | Local models unusable on Linux+NVIDIA (nonexistent CUDA asset, hidden UI, 64K floor) | No |

**Stability theme:** Two clusters dominate — (a) **platform-specific breakage** (Windows PATH, Windows deadlock, macOS update, Linux/NVIDIA), and (b) **approval/security-boundary gaps** where "smart" automation behaves too permissively. The recurring `sweeper:risk-*` labels signal the team is tracking systemic risk classes.

---

## 6. Feature Requests & Roadmap Signals

| Feature | Issue | Signal Strength |
|---|---|---|
| **Per-call model + `reasoning_effort` on `delegate_task`** | [#80222](https://github.com/NousResearch/hermes-agent/issues/80222) | ⭐⭐⭐ (4 👍, `needs-decision`) |
| Deterministic skill tier ladder / retire flat index | [PR #133282](https://github.com/NousResearch/hermes-agent/pull/133282) | In review |
| `hermes wall` fleet broadcast | [PR #133639](https://github.com/NousResearch/hermes-agent/pull/133639) | In review |
| Configurable `state.db` write patience | [PR #133631](https://github.com/NousResearch/hermes-agent/pull/133631) | In review |
| Local-model resume + partial-download discard | [PR #140109](https://github.com/NousResearch/hermes-agent/pull/140109) | In review |
| Board-scoped dispatch fence (`board.json "dispatch": false`) | [PR #136253](https://github.com/NousResearch/hermes-agent/pull/136253) | In review |
| Large-paste `/goal` input handling (Desktop) | [#125815](https://github.com/NousResearch/hermes-agent/issues/125815) | Low-mid |

**Prediction for next version:** The highest-likelihood near-term landings are the **fleet-ops and correctness PRs already in review** (`hermes wall`, skill tier ladder, `state.db` patience, gateway skew gate). The `delegate_task` per-call override is the strongest *community-requested* candidate but is blocked on a `needs-decision` design question. **No breaking-change signal** — releases section is empty and the roadmap is fix-heavy rather than feature-heavy this cycle.

---

## 7. User Feedback Summary

**Pain points expressed today:**

- **Data safety is the #1 trust issue.** #141346 is a genuine horror story: an agent "helpfully" automating PowerPoint destroyed unsaved work. Users are implicitly asking: *can I let Hermes touch my machine unattended?* The `smart` approval default is now in question.
- **Isolation is not honored.** #135037 shows sandbox/test checkouts corrupting host-global state — a direct hit to users running CI, multi-profile, or rehearsal environments.
- **Cross-platform polish gap.** Windows (PATH pollution, blank chat pane, numpy deadlock, regex) and macOS (update failure) and Linux/NVIDIA (local models unusable OOTB) all surfaced — the product is clearly most stable on macOS/CPU, and users on other platforms feel it.
- **Memory trust.** #76035 (hallucinated "memory full" → destructive USER.md consolidation) undermines confidence in the self-improvement system.
- **Documentation drift.** #142250 and #142256 show docs contradicting code, adding friction to self-service.

**Satisfaction signals (mild):** The 4 👍 on #80222 and 4 👍 on #86334 show engaged power users invested in the delegation/desktop workflow — not churn, but specific unmet needs.

**Dissatisfaction:** Concentrated on **safety defaults and platform reliability**, not core agent capability.

---

## 8. Backlog Watch

Longest-lived, high-importance items still awaiting maintainer resolution:

| Age | Item | Why it needs attention |
|---|---|---|
| ~2.5 months | [#76795](https://github.com/NousResearch/hermes-agent/issues/76795) — `/skills pending` unbounded queue, newest sorts last | `needs-decision`; operational debt that worsens over time |
| ~2.5 months | [#76035](https://github.com/NousResearch/hermes-agent/issues/76035) — destructive USER.md consolidation | Data-integrity, no fix PR |
| ~2 months | [#80222](https://github.com/NousResearch/hermes-agent/issues/80222) — per-call delegate overrides | Top-voted feature, blocked on decision |
| ~2 months | [#83904](https://github.com/NousResearch/hermes-agent/issues/83904) — cron→desktop delivery gap | Cross-subsystem, long-standing |
| ~1.5 months | [#117894](https://github.com/NousResearch/hermes-agent/issues/117894) — unbounded invisible staged-memory queue | `needs-decision`; second-order regression of #105921 |
| ~1.5 months | [#126305](https://github.com/NousResearch/hermes-agent/issues/126305) — DeepSeek compression truncation | `needs-repro`; original claim retracted, needs re-scoping |
| ~1.5 months | [#109453](https://github.com/NousResearch/hermes-agent/issues/109453) — `kanban.auto_decompose` defaults true | Automation safety default, no opt-out |

**Also worth flagging:** the **large unmerged PR queue from `yoyodine-industries`** (12+ interdependent PRs, several P1/P2, all open since early-to-mid October). This is the single biggest **review bottleneck** in the project right now — a coordinated set of reliability fixes that appear ready but unlanded.

---

### Bottom Line

Hermes Agent is a **high-velocity, triage-heavy project** today: strong community engagement and detailed bug reports, but a **merge gate that has stalled** (0 PRs merged in 24h). The dominant risks are **data-safety defaults** (#141346) and **security-boundary correctness** (#135451, #141468, #119682). Platform reliability (Windows/macOS/Linux) remains the top recurring complaint class. The clearest project-health lever is **maintainer review capacity** — both to land the pending reliability PR series and to unblock the top-voted feature (#80222). No release pressure today, but the backlog of well-diagnosed critical issues is accumulating.

</details>

<details>
<summary><strong>IronClaw</strong> — <a href="https://github.com/nearai/ironclaw">nearai/ironclaw</a></summary>

# IronClaw Project Digest — 2026-10-21

## 1. Today's Overview

IronClaw shows **moderate maintenance activity with no feature velocity**: 3 issues and 9 PRs were updated in the last 24h, but only 2 PRs were closed/merged — both routine Dependabot dependency bumps. The open PR queue is dominated by automated dependency updates (7 of 9), with a single substantive human PR (#8147) addressing loopback MCP endpoint enrollment. No new releases were cut. The most notable signals come from the issue tracker: growing demand for **on-chain contract transparency** (#2077, open 6+ months) and **extensibility for local/hosted MCP servers** (#8136, #8146), suggesting community interest in decentralization and self-hosted agent infrastructure that currently outpaces maintainer response.

**Activity assessment: Low-to-moderate.** Healthy dependency hygiene, but sustained backlog and a thin maintainer response surface on strategic issues.

## 2. Releases

**None.** No new releases in the last 24h. No migration notes or breaking changes to report.

## 3. Project Progress

Two PRs were closed/merged today, both dependency updates:

- **[PR #7386](https://github.com/nearai/ironclaw/pull/7386)** — `dompurify` 3.4.12 → 3.4.13 in `crates/product/ironclaw_webui/frontend`. (Opened 2026-08-08; closed 2026-10-20 — ~73 days to merge, indicating a slow review cycle.)
- **[PR #8048](https://github.com/nearai/ironclaw/pull/8048)** — `fast-uri` 3.1.5 → 3.1.7 in `docs/internal/architecture-video`. (Opened 2026-09-02; closed 2026-10-20 — ~48 days.)

**No feature work, refactors, or bug fixes advanced today.** The only non-dependency PR in flight is **[PR #8147](https://github.com/nearai/ironclaw/pull/8147)** (loopback MCP endpoint enrollment, see §6).

## 4. Community Hot Topics

Engagement is low across the board (max 1 comment, 0 reactions), but three items carry strategic weight:

- **[Issue #2077](https://github.com/nearai/ironclaw/issues/2077)** — *Contract source for market.near.ai* (1 comment, open since 2026-04-06). User `HavenCTO` is building **sovereign agents that hold their own keys and operate directly on-chain**, and is blocked by the HTTP-API-only market interface. Underlying need: **decentralization and self-custody** — agents should not depend on IronClaw-hosted infrastructure for market access.
- **[Issue #8136](https://github.com/nearai/ironclaw/issues/8136)** — *Optional hosted-MCP Plazmi extension* (0 comments). Proposes using IronClaw's existing declarative extension surfaces (hosted-MCP metadata, API-key auth, egress) for a third-party companion instead of embedding vendor logic in the host. Underlying need: **clean extension seams for third-party integrations** without core bloat.
- **[Issue #8146](https://github.com/nearai/ironclaw/issues/8146)** — *Explicit 127.0.0.1 endpoint enrollment + private credential-account bridge* (0 comments, filed today). Documents that hosted MCP registration rejects all HTTP/IP literals on `main` (b0b999d). Underlying need: **local/self-hosted MCP servers must be first-class**, not second-class citizens behind public endpoints.

**Analysis:** The community is pushing IronClaw toward a *sovereign, self-hosted, extensible* posture — on-chain operations, local MCP servers, third-party hosted extensions. Maintainer engagement on these threads is minimal.

## 5. Bugs & Stability

No crashes or regressions reported today. Two stability-adjacent items:

- **[Issue #8146](https://github.com/nearai/ironclaw/issues/8146)** — *Hosted MCP rejects HTTP/IP literals* (medium severity). This is a **functional gap / documented limitation** rather than a crash: local connector registration via native hosted-MCP path is impossible with credential-account bearer tokens. **Fix PR exists: [PR #8147](https://github.com/nearai/ironclaw/pull/8147)**, which adds explicit trusted enrollment of an exact loopback MCP endpoint.
- Security-relevant dependency bumps in flight: **[PR #8148](https://github.com/nearai/ironclaw/pull/8148)** (`fast-uri` security release), **[PR #8149](https://github.com/nearai/ironclaw/pull/8149)** (`dompurify` XSS-related fixes), **[PR #8151](https://github.com/nearai/ironclaw/pull/8151)** / **[PR #8152](https://github.com/nearai/ironclaw/pull/8152)** (`rustls` 0.23.45). None critical, all routine.

## 6. Feature Requests & Roadmap Signals

| Signal | Source | Likelihood in next version |
|---|---|---|
| Publish `market.near.ai` contract source | [Issue #2077](https://github.com/nearai/ironclaw/issues/2077) | Low-medium — requires policy/legal decision, not just engineering |
| Loopback MCP endpoint enrollment | [PR #8147](https://github.com/nearai/ironclaw/pull/8147) | **High** — code already open, scoped and explicit |
| Plazmi hosted-MCP extension seam | [Issue #8136](https://github.com/nearai/ironclaw/issues/8136) | Medium — leverages existing declarative surfaces |
| Private credential-account setup bridge for local MCP | [Issue #8146](https://github.com/nearai/ironclaw/issues/8146) | Medium — adjacent to #8147 |

**Prediction:** The next meaningful non-dependency change is most likely **loopback/private MCP support** (PR #8147 + Issue #8146), given a working PR and a clear, narrow scope. The on-chain contract request (#2077) is the most strategically significant but least likely to ship soon.

## 7. User Feedback Summary

- **Pain point — infrastructure dependency:** `HavenCTO` (#2077) explicitly states interacting only via HTTP APIs means "the agent is dependent on your infrastructure." This is the sharpest dissatisfaction signal in the dataset and speaks to IronClaw's positioning versus sovereign-agent alternatives.
- **Pain point — local development friction:** `tom9000` (#8146) hit a hard wall registering a local MCP server, blocking a legitimate self-hosted use case.
- **Positive signal — extension architecture valued:** `cairn-agent` (#8136) praises the "existing seam" of declarative extension surfaces and wants to *use* it rather than fork the host — a sign the extension design is landing well with third-party builders.
- **Satisfaction:** Neutral. No praise for shipped features this cycle; feedback is request-driven.

## 8. Backlog Watch

- **[Issue #2077](https://github.com/nearai/ironclaw/issues/2077)** — *Contract source for market.near.ai.* Open **~198 days** (since 2026-04-06), only 1 comment, 0 👍. This is a strategic transparency request from an active builder that has gone unanswered for over six months. **Needs maintainer response** — even a "won't publish / will publish" decision would unblock the user's architecture choices.
- **[PR #7386](https://github.com/nearai/ironclaw/pull/7386)** and **[PR #8048](https://github.com/nearai/ironclaw/pull/8048)** were both stale Dependabot PRs (73 and 48 days old) only closed yesterday — indicative of **backlog accumulation in the dependency queue**, which can delay security patches.
- **[Issue #8146](https://github.com/nearai/ironclaw/issues/8146)** — filed today but referenced as following #5998, suggesting **a pre-existing unresolved enrollment issue** that may also warrant review.

**Health note:** The project is well-maintained on the dependency/security front (Dependabot active, bumps landing), but **human-initiated feature work and maintainer engagement on strategic issues are thin**. The gap between community ambition (sovereign agents, local MCP, on-chain contracts) and maintainer throughput is the primary health risk to monitor.

</details>

<details>
<summary><strong>QwenPaw</strong> — <a href="https://github.com/agentscope-ai/QwenPaw">agentscope-ai/QwenPaw</a></summary>

# QwenPaw Project Digest — 2026-10-21

## 1. Today's Overview

QwenPaw remains in a **high-activity, pre-2.3.0 stabilization phase**. Over the last 24 hours the repository saw **34 PR updates (25 open, 9 merged/closed)** and **15 issue updates (10 open, 5 closed)**, with **no new releases**. The bulk of activity is bug-fixing across channels (Telegram, DingTalk, Feishu), the Console frontend, and plugin/skill infrastructure, alongside several large architectural PRs (SDK redesign, channel plugin isolation, plugin hot-reload) that signal the planned "lighter and more modular" v2.3.0 refactor ([#8289](https://github.com/agentscope-ai/QwenPaw/issues/8289)). Overall health is **moderate-to-good**: contributor throughput is strong and fixes are landing quickly, but a cluster of channel-adapter correctness bugs and a couple of regressions suggest the channel layer is the current weak point.

## 2. Releases

No new releases in the last 24 hours. (The most recent release-duty tracking issue, [v2.2.2-beta.4 verification #8053](https://github.com/agentscope-ai/QwenPaw/issues/8053), was closed on 2026-10-20.)

## 3. Project Progress

**Merged/closed PRs today (9):**
- [#8215](https://github.com/agentscope-ai/QwenPaw/pull/8215) — `fix(agents)`: recognizes LM Studio "at most 0 audio" rejection, closing the audio-fallback gap in [#8171](https://github.com/agentscope-ai/QwenPaw/issues/8171). Completes the third rejection shape in the #7015 family.
- [#7654](https://github.com/agentscope-ai/QwenPaw/pull/7654) — `fix(agents)`: adds llama-server and DashScope URL audio rejections to the audio-fallback classifier (long-running follow-up, finally closed).
- [#8339](https://github.com/agentscope-ai/QwenPaw/pull/8339) — `fix(console)`: stabilizes long-conversation wheel scrolling by overriding placeholder heights, fixing the 1.1–2.2k px view snap in [#8284](https://github.com/agentscope-ai/QwenPaw/issues/8284).
- [#8200](https://github.com/agentscope-ai/QwenPaw/pull/8200) — `feat(tools)`: adds Firecrawl as a `web_search` provider (first-time contributor).

**Closed issues:** Audio session wedge ([#8171](https://github.com/agentscope-ai/QwenPaw/issues/8171)), Console scroll regression ([#8284](https://github.com/agentscope-ai/QwenPaw/issues/8284)), DingTalk silent-drop bug marked close-and-review-later ([#8343](https://github.com/agentscope-ai/QwenPaw/issues/8343)), reverse-proxy basename support ([#8177](https://github.com/agentscope-ai/QwenPaw/issues/8177)), and beta.4 release verification ([#8053](https://github.com/agentscope-ai/QwenPaw/issues/8053)).

Net effect: the **audio-fallback classifier family is now fully closed out**, and two user-visible Console/DingTalk issues were resolved.

## 4. Community Hot Topics

| Item | Comments | Signal |
|---|---|---|
| [#8171](https://github.com/agentscope-ai/QwenPaw/issues/8171) audio file wedges session (LM Studio) | 6 | Highest-engagement issue; multi-week saga (#7015 → #7024 → #7654 → #8215) shows classifier fragility across providers |
| [#8071](https://github.com/agentscope-ai/QwenPaw/issues/8071) Plugin theme extension point | 5 | Plugin authors hitting the single-knob (`colorPrimary`) limitation; demand for semantic token override |
| [#8092](https://github.com/agentscope-ai/QwenPaw/issues/8092) Content-inspection false positives treated as bad_request | 3 | Enterprise/gateway users losing whole turns to misclassification; fix PR [#8124](https://github.com/agentscope-ai/QwenPaw/pull/8124) open |
| [#8320](https://github.com/agentscope-ai/QwenPaw/issues/8320) Desktop `make-skill` validator import failure | 3 | Desktop packaging regression; fix PR [#8344](https://github.com/agentscope-ai/QwenPaw/pull/8344) open |
| [#8315](https://github.com/agentscope-ai/QwenPaw/issues/8315) Feishu 426 with injected proxy | 3 | Corporate proxy deployment blocker |

**Underlying needs:** (a) Provider-error classification is too brittle — users want graceful degradation, not turn-killing; (b) plugin authors want first-class extensibility (themes, harmonyOS host contract in [#8311](https://github.com/agentscope-ai/QwenPaw/issues/8311)); (c) self-hosted/enterprise networking (proxy, reverse-proxy subpaths) is a recurring friction point.

## 5. Bugs & Stability

Ranked by severity:

1. **🔴 High — Content-inspection false positives kill turns** ([#8092](https://github.com/agentscope-ai/QwenPaw/issues/8092)): benign DevOps traffic classified as `bad_request`, no retry/fallback across a 12-model chain. Fix PR [#8124](https://github.com/agentscope-ai/QwenPaw/pull/8124) open under review.
2. **🔴 High — Feishu channel completely non-functional under injected proxy** ([#8315](https://github.com/agentscope-ai/QwenPaw/issues/8315)): WebSocket + token requests all fail with 426; no `NO_PROXY` handling. No fix PR yet.
3. **🟠 Medium — Desktop `make-skill` validator broken** ([#8320](https://github.com/agentscope-ai/QwenPaw/issues/8320)): bundled Python cannot import `qwenpaw`. Fix PR [#8344](https://github.com/agentscope-ai/QwenPaw/pull/8344) open (routes via native CLI).
4. **🟠 Medium — Telegram drops quoted reply context** ([#8329](https://github.com/agentscope-ai/QwenPaw/issues/8329)): `reply_to_message` never read; agent loses quoted context. No fix PR.
5. **🟠 Medium — Quoted replies bypass control-command routing in 7 channels** ([#8342](https://github.com/agentscope-ai/QwenPaw/issues/8342)): `/stop` in a reply is treated as normal traffic. No fix PR.
6. **🟡 Medium — Cron job edit dialog cannot close after edit** ([#8340](https://github.com/agentscope-ai/QwenPaw/issues/8340)): requires F5; UI state bug.
7. **🟡 Medium — Cron job modification corrupts time & content** ([#8249](https://github.com/agentscope-ai/QwenPaw/issues/8249)): default resets to 00:00, content shows `[object Object]`. Related structured-config PR [#8305](https://github.com/agentscope-ai/QwenPaw/pull/8305) may address the root cause.
8. **🟢 Low/Closed — DingTalk final reply silently dropped on webhook expiry** ([#8343](https://github.com/agentscope-ai/QwenPaw/issues/8343)): closed-and-review-later; needs Open API fallback. Related chunking fix [#8341](https://github.com/agentscope-ai/QwenPaw/pull/8341) open.

**Pattern:** 4 of 8 are **channel-adapter correctness bugs** (Telegram, Feishu, DingTalk, generic control routing) — the channel layer needs dedicated hardening. Two are **cron/structured-config UI** bugs with a plausible shared root cause.

## 6. Feature Requests & Roadmap Signals

- **Plugin theme extension point** ([#8071](https://github.com/agentscope-ai/QwenPaw/issues/8071)) — semantic token override layer for plugins.
- **HarmonyOS plugin host contract** ([#8311](https://github.com/agentscope-ai/QwenPaw/issues/8311)) — standardized `window.QwenPaw` contract, data-plane bridge, signature verification, PawApp gating. A substantial community-driven mobile effort (~45k LOC).
- **v2.3.0 "Lighter and More Extensible"** ([#8289](https://github.com/agentscope-ai/QwenPaw/issues/8289)) — official roadmap post: plugin refactor, modularity, capability improvements.

**Likely in v2.3.0** (based on open XXXL PRs aligned with #8289): PawApp SDK/control-plane redesign ([#7874](https://github.com/agentscope-ai/QwenPaw/pull/7874)), channels-as-plugins with subprocess isolation ([#8187](https://github.com/agentscope-ai/QwenPaw/pull/8187)), plugin clean unload + hot reload ([#7565](https://github.com/agentscope-ai/QwenPaw/pull/7565)), and the plugin install resilience fix ([#8345](https://github.com/agentscope-ai/QwenPaw/pull/8345)). Realtime voice chat ([#7785](https://github.com/agentscope-ai/QwenPaw/pull/7785)) and decision-model tool approval ([#8283](https://github.com/agentscope-ai/QwenPaw/pull/8283)) are strong candidates but larger. Theme extension (#8071) and HarmonyOS host contract (#8311) are more likely v2.3.x/v2.4.

## 7. User Feedback Summary

**Pain points:**
- **Provider/gateway error handling is the #1 frustration** — turns silently die on misclassified errors (audio limits, content inspection). Users expect fallback chains to actually fall back.
- **Channel reliability** — quoted-reply context loss, control-command misrouting, silent drops on webhook expiry, and total Feishu failure under corporate proxies. Enterprise/self-hosted users are most affected.
- **Cron/scheduled-task UI** — edit dialog won't close; edits corrupt time and content (`[object Object]`). Basic UX breakage on a core feature.
- **Desktop packaging** — `make-skill` validator broken in the official installer build.

**Positive signals:** First-time contributors are landing PRs ([#8200](https://github.com/agentscope-ai/QwenPaw/pull/8200), [#8345](https://github.com/agentscope-ai/QwenPaw/pull/8345)); a 12-model fallback chain and 6-theme Console show mature configurability; the plugin ecosystem is growing enough to demand deeper extension APIs. Satisfaction is **mixed** — architecture direction is well-received (roadmap issue #8289 has a 👍), but regression density in channels/UI tempers it.

## 8. Backlog Watch

Long-unanswered or high-impact items needing maintainer attention:

| Item | Age | Why it matters |
|---|---|---|
| [#8092](https://github.com/agentscope-ai/QwenPaw/issues/8092) content-inspection misclassification | 18 days | Turn-killing for enterprise users; fix PR [#8124](https://github.com/agentscope-ai/QwenPaw/pull/8124) open 13 days under review — needs review bandwidth |
| [#8071](https://github.com/agentscope-ai/QwenPaw/issues/8071) plugin theme extension | 20 days | 5 comments, no PR; blocks plugin ecosystem depth |
| [#7565](https://github.com/agentscope-ai/QwenPaw/pull/7565) plugin hot reload | 47 days | XXXL PR open since 2026-09-04, central to v2.3.0; at risk of bit-rot |
| [#7874](https://github.com/agentscope-ai/QwenPaw/pull/7874) PawApp SDK redesign | 32 days | XXXL, architectural; needs maintainer decision on merge path |
| [#8187](https://github.com/agentscope-ai/QwenPaw/pull/8187) channels-as-plugins isolation | 9 days | XXXL, fixes the channel-layer class of bugs structurally; description incomplete (template unfilled) |
| [#7785](https://github.com/agentscope-ai/QwenPaw/pull/7785) realtime voice chat | 36 days | XXXL feature PR aging without visible review signal |

**Recommendation:** Prioritize reviewing [#8124](https://github.com/agentscope-ai/QwenPaw/pull/8124) (small, high-user-impact) and scheduling architectural review for the four XXXL PRs tied to #8289, which otherwise risk stalling the v2.3.0 milestone.

---
*Generated from GitHub activity data for 2026-10-21. Comment/reaction counts are as reported; several PRs show undefined comment counts in the source data.*

</details>

<details>
<summary><strong>ZeroClaw</strong> — <a href="https://github.com/zeroclaw-labs/zeroclaw">zeroclaw-labs/zeroclaw</a></summary>

# ZeroClaw Project Digest — 2026-10-21

## 1. Today's Overview

ZeroClaw shows **very high sustained activity** with 50 issues and 50 PRs updated in the last 24 hours, but the distribution reveals a **maturation-phase bottleneck**: zero issues closed and only 1 PR merged/closed today, while 49 PRs remain open. The issue tracker is dominated by accepted, labeled, high-risk items (many tagged `release:v0.8.7`, `domain:security`, `risk:high`), indicating the project is in a **stabilization and hardening cycle** ahead of the v0.8.7 release rather than shipping new surface area. A strong plugin/WASM subsystem theme runs through today's data (egress security, plugin lifecycle, registry publication), alongside a newly filed architectural RFC calling for principal-based trust boundaries. The absence of releases today and the heavy backlog of open PRs (several XL-sized, stacked/draft dependencies) suggest **review capacity, not development capacity, is the current constraint**.

## 2. Releases

No new releases were published in the last 24 hours. The latest release line in flight is **v0.8.7**, referenced across numerous issues and PRs as the target milestone (e.g., #10999, #10066, #11332, #11580, #11903). v0.8.6 is referenced in CI tasks (#11828) as potentially shipping without its `dist` image if the arm64 memory issue is unresolved.

## 3. Project Progress

Merged/closed activity today is minimal (1 PR), so progress is best measured by **advancing work-in-flight**:

- **Transport/plugin infrastructure maturation:** #10999 reports the previously tracked host transport chain (#9142 → #8923 → #8863) is now merged via #11081; the remaining gate is a published, compatible Discord registry package with an end-to-end WASM artifact demonstration.
- **Tool transcript recovery for channels:** PR #11911 reuses #11507's result-aware recovery for channel turns, checkpointing the canonical tool transcript on terminal paths.
- **System prompt budget enforcement:** PR #11910 (fixes #11908) converts the `max_system_prompt_chars` limit from advisory to a hard fail-closed gate.
- **Security hardening:** PR #11906 patches Wasmtime 48.0.6 → 48.0.7 for five RustSec advisories (RUSTSEC-2026-0375..0379); PR #11903 shares a single JWKS fetch across concurrent OIDC token checks; PR #11061 blocks high-risk shell commands even when allowlisted.
- **Provider expansion:** PRs #11680 (Firecrawl web search) and #11584 (Opper EU-hosted gateway) are open and advancing.
- **CI/release reliability:** Multiple targeted fixes for arm64 OOM (#11828), macOS runner brownout (#11831), macOS universal build timeout (#11839), and binary size headroom (#11580).

## 4. Community Hot Topics

| Rank | Item | Comments | Underlying Need |
|---|---|---|---|
| 1 | [#11055](https://github.com/zeroclaw-labs/zeroclaw/issues/11055) — Standalone channel start SOP turns lack live channel tool handles | 8 | Users need channel-addressed tools to work uniformly across all entry points (daemon, cron, gateway), not just two. Architectural consistency in the agent loop. |
| 2 | [#11296](https://github.com/zeroclaw-labs/zeroclaw/issues/11296) — llama.cpp/custom provider uses wrong URL for models | 6 | Self-hosted and router-based deployments (llama.cpp, custom OpenAI-compatible endpoints) are a real user base; URI handling is broken. |
| 3 | [#6998](https://github.com/zeroclaw-labs/zeroclaw/issues/6998) — Schema-validated memory consolidation with bounded fallback | 6 | Long-standing (since May) reliability concern: JSON-in-prompt parsing is fragile across providers; users want structured, validated memory writes. |
| 4 | [#10999](https://github.com/zeroclaw-labs/zeroclaw/issues/10999) — Publish/prove Discord plugin installation from release binary | 5 | Plugin distribution story is incomplete — the runtime works but the registry/install UX is not proven end-to-end. |
| 5 | [#10066](https://github.com/zeroclaw-labs/zeroclaw/issues/10066) — SOP engine runs later steps before recording output-schema rejection | 5 | **P0/workflow-blocking** correctness bug in the SOP (Standard Operating Procedure) engine — later steps execute on invalid data. |
| 6 | [#11416](https://github.com/zeroclaw-labs/zeroclaw/issues/11416) — Slack "is thinking…" status no longer shown since v0.8.5 | 5 | **Regression** in user-facing UX; users lose feedback during long turns in Slack threads. |
| 7 | [#11554](https://github.com/zeroclaw-labs/zeroclaw/issues/11554) — Path-marker images re-sent every turn → phantom "new" images | 5 | Cross-channel (Signal/Telegram/Discord) image handling bug degrading model reasoning quality. |

**Analysis:** The hottest topics cluster around three themes — (a) **runtime consistency** across entry points (#11055, #11332, #11554), (b) **provider/transport correctness** (#11296, #11651, #11813), and (c) **memory/agent-loop reliability** (#6998, #10755, #11912). The community is clearly operating ZeroClaw in multi-channel, multi-provider production-like setups and surfacing integration-seam bugs.

## 5. Bugs & Stability

Ranked by severity (all are open; fix PRs noted where applicable):

**P0 / S1 — workflow-blocking:**
- [#10066](https://github.com/zeroclaw-labs/zeroclaw/issues/10066) — SOP engine promotes and runs later steps before recording a step's output-schema rejection; later steps *actually execute* on invalid upstream data. Tagged `release:v0.8.7`. **No linked fix PR visible.**

**P1 / S2 — degraded behavior / security-adjacent:**
- [#11055](https://github.com/zeroclaw-labs/zeroclaw/issues/11055) — Standalone channel start SOP turns lack live channel tool handles (channel tools unusable outside two entry points). No fix PR visible.
- [#11554](https://github.com/zeroclaw-labs/zeroclaw/issues/11554) — Path-marker images re-sent every turn; model describes phantom "new" images. Cross-channel. No fix PR visible.
- [#11327](https://github.com/zeroclaw-labs/zeroclaw/issues/11327) — Plugin tool-name gate only sees pre-plugin registrations → a plugin can pre-empt `tool_search`, MCP, peripheral, and skill tools. Explicitly flagged as **S0 if untrusted plugins are in the threat model** (tool-call hijacking). No fix PR visible.
- [#11552](https://github.com/zeroclaw-labs/zeroclaw/issues/11552) — Tool egress ceremony ignores `websocket_client` and `socket_client` declarations → under-granted egress. No fix PR visible.
- [#11813](https://github.com/zeroclaw-labs/zeroclaw/issues/11813) — Plugin egress stalls when the first resolved address is blackholed and never tries the rest (single shared deadline, IPv6-first). No fix PR visible.

**P2 / S2:**
- [#11296](https://github.com/zeroclaw-labs/zeroclaw/issues/11296) — llama.cpp/custom provider uses wrong URI to fetch models from a router. *(Note: there is a typo in the title — "url/uri" — and the reporter describes a real misbehavior.)*
- [#11332](https://github.com/zeroclaw-labs/zeroclaw/issues/11332) — Skill review/creation never run for channel, webhook, or gateway (web UI) turns; learning loop only runs for CLI/cron.
- [#11336](https://github.com/zeroclaw-labs/zeroclaw/issues/11336) — `plugin info` / `plugin list --verify` report `[loads]` for plugins the runtime refuses to register.
- [#11357](https://github.com/zeroclaw-labs/zeroclaw/issues/11357) — `plugin remove` deletes `plugins_dir/<name>`, not the actually-loaded directory → can delete an unrelated directory. **Data-loss risk.**

**P2 (fix PRs in flight):**
- [#11416](https://github.com/zeroclaw-labs/zeroclaw/issues/11416) — Slack "is thinking…" regression → **PR #11651** partially addresses Telegram 429 flood gating.
- [#11651](https://github.com/zeroclaw-labs/zeroclaw/pull/11651) — Telegram 429 `retry_after` honored via shared per-token flood gate.
- [#11601](https://github.com/zeroclaw-labs/zeroclaw/pull/11601) — Classify Telegram transcription failures and bound transient retries (currently every error is retried transiently → head-of-line blocking).

**P3 / minor (some with fix PRs):**
- [#11818](https://github.com/zeroclaw-labs/zeroclaw/issues/11818) — `config set agents.*` without daemon fails with "path must be shorter than SUN_LEN" for deep config dirs (good first issue).
- [#11819](https://github.com/zeroclaw-labs/zeroclaw/issues/11819) — Quickstart lists models from default endpoint before asking URI; picker takes no typed model.
- [#11821](https://github.com/zeroclaw-labs/zeroclaw/issues/11821) — `plugin_channel_sender_denied` records don't name the sender.
- [#11360](https://github.com/zeroclaw-labs/zeroclaw/issues/11360) — Package lock file readable by other local accounts.

**Security fixes advancing:** PR [#11906](https://github.com/zeroclaw-labs/zeroclaw/pull/11906) (Wasmtime RUSTSEC patch), PR [#11903](https://github.com/zeroclaw-labs/zeroclaw/pull/11903) (JWKS fetch sharing), PR [#11061](https://github.com/zeroclaw-labs/zeroclaw/pull/11061) (high-risk shell block even when allowlisted).

## 6. Feature Requests & Roadmap Signals

Roadmap signals strongly point to **v0.8.7** as a security/plugin-hardening release, with **v0.9.0** absorbing larger architectural work:

- **Memory consolidation configurability:** [#11657](https://github.com/zeroclaw-labs/zeroclaw/issues/11657) (configurable target category) and [#6998](https://github.com/zeroclaw-labs/zeroclaw/issues/6998) (schema-validated consolidation). Likely v0.8.7+ given active author (MN13, GaijinSystems).
- **Stall watchdog on by default:** [#10168](https://github.com/zeroclaw-labs/zeroclaw/issues/10168) — `stall_timeout_secs` currently defaults to 0 (disabled). Conservative default is a low-risk, high-value change.
- **Onboarding plugin install:** [#10997](https://github.com/zeroclaw-labs/zeroclaw/issues/10997) — install/activate selected plugins during Quickstart (currently blocked; part of #7432 Phase 2 D4).
- **Minimal core tool set + binary size evidence:** [#10998](https://github.com/zeroclaw-labs/zeroclaw/issues/10998) — separates optional tool construction from the default runtime (binary-size and attack-surface reduction).
- **Multi-model per provider profile:** PR [#9809](https://github.com/zeroclaw-labs/zeroclaw/pull/9809) — enables models to share a connection profile with distinct model IDs.
- **Goal Mode V1 (12-part proposal):** PR [#11880](https://github.com/zeroclaw-labs/zeroclaw/pull/11880) (slice 3/12) — transport-neutral Goal policy contracts; currently **Draft due to CI/security gate failures on inherited TLS dependencies**.
- **Principal-based trust boundaries RFC:** [#11914](https://github.com/zeroclaw-labs/zeroclaw/issues/11914) — a unified access-control layer for content, memory, and capabilities, explicitly framing #11908, #11912, #11913 as instances of one missing abstraction. This is the clearest signal of the next architectural epoch.
- **Telegram Rich Messages:** [#8415](https://github.com/zeroclaw-labs/zeroclaw/issues/8415) (issue, icebox) and PR [#11862](https://github.com/zeroclaw-labs/zeroclaw/pull/11862) (opt-in `rich_messages` flag) — user requests for table/heading UX in Telegram.

**Prediction:** v0.8.7 will ship security fixes (Wasmtime, JWKS, shell), plugin lifecycle correctness (#11327, #11357, #11552), and CI/release robustness. Larger items — Goal Mode V1, principal trust boundaries, multi-model profiles — will land in v0.9.0.

## 7. User Feedback Summary

**Pain points, in user-reported terms:**

- *"A turn that stops making progress hangs indefinitely"* — the stall watchdog ships off by default (#10168). Users experience hung turns in production.
- *"Since v0.8.5, the Slack 'is thinking…' status is gone"* (#11416) — a **regression** eroding feedback during long turns; users lose confidence that the agent is alive.
- *"Setting the uri (not localhost/127.0.0.1) for a llama.cpp/custom provider is not taken correctly … to grab models from a router"* (#11296) — self-hosters cannot point at remote routers.
- *"The earlier path-marker images are re-sent on every later turn, so the model describes phantom 'new' images"* (#11554) — multi-channel users (Signal/Telegram/Discord) get compounding reasoning degrade in image-heavy threads.
- *"I have skill_improvement and skill_creation enabled, but the learning loop only runs for CLI/cron turns"* (#11332) — channel/webhook/gateway users are effectively excluded from the learning features.
- *"A plugin can receive the calls the model intends for another tool"* (#11327) — an untrusted-plugin threat model is explicitly contemplated; a user-visible tool-call hijack risk.
- *"`plugin remove` … can delete an unrelated directory"* (#11357) — filesystem/data-loss risk from a lifecycle operation.

**Satisfaction signals:** High contribution volume and detailed, well-labeled bug reports (many with severity classifications, repo paths, and exact reproduction sequences) suggest a **technically engaged, committed user base**. The community is contributing code (multiple XL PRs from non-maintainers) and documentation (#11915), not just filing issues — a positive health indicator. Friction is concentrated in review latency (49 open PRs) rather than contributor willingness.

## 8. Backlog Watch

Long-unanswered or reputationally important items needing maintainer attention:

| Issue/PR | Age | Why it needs attention |
|---|---|---|
| [#6998](https://github.com/zeroclaw-labs/zeroclaw/issues/6998) (memory consolidation schema) | ~5 months (2026-05-29) | Accepted, high-risk, `status:parking-lot` — core reliability concern with no resolution path. |
| [#8415](https://github.com/zeroclaw-labs/zeroclaw/issues/8415) (Telegram Rich Messages) | ~4 months (2026-06-28) | `status:icebox` — user explicitly asked about table UX; now has a competing PR #11862 (LaurensBosscher). Provisional fix exists; needs maintainer direction. |
| [#9809](https://github.com/zeroclaw-labs/zeroclaw/pull/9809) (multi-model per provider) | ~2.5 months (2026-08-07) | XL PR, "principal contributor", `needs-author-action` — a large, valuable feature likely stalled on review iteration. |
| [#10066](https://github.com/zeroclaw-labs/zeroclaw/issues/10066) (SOP schema rejection) | ~2 months (2026-08-17) | **P0/S1, workflow-blocking**, `status:no-stale` — urgent correctness bug with no visible fix PR. |
| [#11055](https://github.com/zeroclaw-labs/zeroclaw/issues/11055) (channel tool handles) | ~1 month (2026-09-22) | Highest-comment issue today (8), accepted, high-risk — a frequently-hit architectural gap. |
| [#11186](https://github.com/zeroclaw-labs/zeroclaw/pull/11186) (rpc-client + in-process gateway) | ~1 month (2026-09-26) | XL, `distinguished contributor`, `needs-author-action`, stacked; blocks PR #11274. Review backlog is holding up a transport-layer capability. |
| [#10998](https://github.com/zeroclaw-labs/zeroclaw/issues/10998) (minimal core tool set) | ~1 month (2026-09-20) | `status:blocked`, high-risk, binary-size and attack-surface scope; needs scoping decision. |
| [#11327](https://github.com/zeroclaw-labs/zeroclaw/issues/11327) (plugin tool hijack) | ~3 weeks (2026-10-01) | P1, high-risk, warning of S0 severity in untrusted-plugin threat models — no fix PR visible. |
| [#11880](https://github.com/zeroclaw-labs/zeroclaw/pull/11880) (Goal V1 slice 3/12) | 2 days, but Draft | Security + aggregate CI Required Gate failing on inherited TLS dependencies; a **scope decision is explicitly requested** ("No

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*