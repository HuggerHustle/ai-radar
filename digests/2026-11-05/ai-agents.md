# OpenClaw Ecosystem Digest 2026-11-05

> Issues: 400 | PRs: 500 | Projects covered: 5 | Generated: 2026-11-05 01:25 UTC

- [OpenClaw](https://github.com/openclaw/openclaw)
- [Hermes Agent](https://github.com/nousresearch/hermes-agent)
- [IronClaw](https://github.com/nearai/ironclaw)
- [QwenPaw](https://github.com/agentscope-ai/QwenPaw)
- [ZeroClaw](https://github.com/zeroclaw-labs/zeroclaw)

---

## OpenClaw Deep Dive

# OpenClaw Project Digest — 2026-11-05

## 1. Today's Overview

OpenClaw remains a highly active project, with **400 issues** and **500 PRs** updated in the last 24 hours, plus the release of **v2026.11.5-beta.1**. Activity skews toward stability work: P0/P1 crash-loop and release-blocker issues dominate the comment leaderboard (Issues #160959, #170956, #161921, #169844). The beta release lands two major feature tracks — **Knowledge Scribes** and a **PostgreSQL-backed state plane** — signaling the project is pushing beyond SQLite-only deployments while the community surfaces significant Windows/macOS platform reliability problems. Overall health is strong in contribution volume, but the ratio of open critical issues (230 open/active issues; 306 open PRs) suggests maintainer triage is a bottleneck, particularly for P0 regressions from the 2026.9.x series.

## 2. Releases

### v2026.11.5-beta.1 ([release](https://github.com/openclaw/openclaw/releases))
- **Knowledge Scribes:** First-class knowledge capture and reusable scribe workflows across agents, sessions, and the Control UI (#185583, #185637, #185974, #186270, #186455, #187659 — thanks @jalehman).
- **PostgreSQL data plane:** PostgreSQL-backed state support introduced, expanding beyond SQLite for agent/session stores.

**Migration/Breaking notes:** The PostgreSQL data plane change implies state-layer reconfiguration options; no explicit rollback path is documented in the release notes, and prior state-migration issues (#161921, #185656) already show migrations can block updates. Users on SQLite should treat this beta as opt-in. No firm breaking-change callouts are given in the provided data.

## 3. Project Progress

194 PRs were merged/closed in the last 24h. Notable closures today:
- **[#193043](https://github.com/openclaw/openclaw/pull/193043) CLOSED** — fix(sandbox): reuse restored workspace input admission (avoids redundant main-thread Gateway work).
- **[#193040](https://github.com/openclaw/openclaw/pull/193040) CLOSED** — fix(ci): keep legacy migration fixtures independent of Workshop.
- **[#193084](https://github.com/openclaw/openclaw/pull/193084) CLOSED** — fix(test): restore OpenClawKit regression compilation (Swift test target compiles again).
- Issue closures: **#160610** (Discord autoPresence false "runtime degraded"), **#165391** (Control UI session count mismatch), **#148308** (Tailscale Serve claim loss), **#161208** (Anthropic prompt cache on heartbeats), **#185656** (zstd transcript archive exceeding Node string limit), **#161505** (Matrix media+text turn fusion).

**Feature advancement:** Knowledge Scribes shipped in beta (#193048 adds a companion doctor check for low output limits); PostgreSQL state plane is new. Session confidentiality (#187836) and live command-automation output in Control UI (#186888) are in review.

## 4. Community Hot Topics

| Item | Comments | Link | Underlying Need |
|---|---|---|---|
| #160959 — Gateway blocks minutes capturing large external plugins (2026.9.6 regression) | 70 | [link](https://github.com/openclaw/openclaw/issues/160959) | Plugin source-capture must not block the event loop; eager staging needs to be async/bounded. |
| #177656 — Native host exec shared-state integrity-admission error | 28 | [link](https://github.com/openclaw/openclaw/issues/177656) | State admission semantics around child cleanup need a typed, recoverable error path. |
| #170956 — Windows slow startup, unclean plugin shutdown, schtasks permission error | 28 | [link](https://github.com/openclaw/openclaw/issues/170956) | Windows managed-service lifecycle is unreliable; restarts/updates need hardening. |
| #120385 — Code Mode tool catalog incomplete for cron/memory-flush turns | 25 | [link](https://github.com/openclaw/openclaw/issues/120385) | Scheduled turns must receive full MCP tool catalogs; "Unknown tool id" surfaces poorly. |
| #150635 — Short-term recall eviction blocks dreaming deep-phase promotion | 24 | [link](https://github.com/openclaw/openclaw/issues/150635) | Memory promotion pipeline starvation at the 512-entry recall cap. |
| #166634 — Late reclamation commit checkpoint failure leaves agent unavailable | 23 | [link](https://github.com/openclaw/openclaw/issues/166634) | Crash recovery must not permanently brick an agent's chat surface. |

**Analysis:** The hot list reveals a coherent theme — **state durability and lifecycle recovery**. Users with large plugin trees, long-running sessions, and managed service installs are hitting blocking behavior at startup, shutdown, and crash recovery. Memory subsystem limits (recall cap, vec0 allocation, index publish transactions) form a second cluster.

## 5. Bugs & Stability

Ranked by severity:

**P0**
- **[#160959](https://github.com/openclaw/openclaw/issues/160959)** — Gateway event-loop block for minutes on large external plugins (crash-loop, diamond lobster rating). No fix PR yet.
- **[#170956](https://github.com/openclaw/openclaw/issues/170956)** — Windows schtasks-based install: slow startup, unclean shutdown, unreliable restarts/updates (ux-release-blocker).
- **[#161921](https://github.com/openclaw/openclaw/issues/161921)** — `state-migrated-no-rollback` circular dependency between `doctor --fix` and `plugins update`.
- **[#169844](https://github.com/openclaw/openclaw/issues/169844)** — Control UI Gateway update on Windows hangs at "Activating," leaves Scheduled Task disabled.

**P1**
- **[#177656](https://github.com/openclaw/openclaw/issues/177656)** — Native host exec integrity-admission error, 28+ failures on 2026.10.5.
- **[#154812](https://github.com/openclaw/openclaw/issues/154812)** — Runaway RSS outside V8 heap → host OOM and shutdown timeout.
- **[#150822](https://github.com/openclaw/openclaw/issues/150822)** — Native Codex children advertise OpenClaw tools without an execution handler (security-review needed).
- **[#190307](https://github.com/openclaw/openclaw/issues/190307)** — Gateway restart leaves agents permanently "degraded" (admission timeout).
- **[#185578](https://github.com/openclaw/openclaw/issues/185578)** — Heap floor ratchets up ~25 MiB/h from retained prompt/skill strings.
- **[#148789](https://github.com/openclaw/openclaw/issues/148789)** — Fallback chain exhausts all candidates on harness-level session failure, misattributes to last model.
- **[#162087](https://github.com/openclaw/openclaw/issues/162087)** — Cron announce fails for pre-9.7 account-mode jobs (missing ownerOrigin).
- **[#191401](https://github.com/openclaw/openclaw/issues/191401)** — Signal teardown hangs forever on unfinished receive — flagged `queueable-fix`, so a fix is being framed.

**Notable leak in beta channel:** The release ships one feature PR pair per hot track but no dedicated fix PR yet for #160959 or #170956, meaning the two highest-severity regressions roll forward into the beta.

## 6. Feature Requests & Roadmap Signals

- **[#192632](https://github.com/openclaw/openclaw/issues/192632)** — Claude web search provider via Anthropic server-side `web_search`. High fit with existing Gemini/Perplexity providers; likely to land as a plugin-scale addition.
- **[#91676](https://github.com/openclaw/openclaw/issues/91676)** — Opt-in `skills.workshop.allowSandboxedAgents` (2 👍). Needs security review; medium probability.
- **[#158800](https://github.com/openclaw/openclaw/issues/158800)** — Browse/fork prior channel-chat segments after `/new` in Control UI.
- **[#17840](https://github.com/openclaw/openclaw/issues/17840)** — Opt-in reaction-triggered agent turns (1 👍).
- **[#184803](https://github.com/openclaw/openclaw/issues/184803)** — Option to disable/replace spoken task receipt on agent-consult Talk calls.
- **[#165685](https://github.com/openclaw/openclaw/issues/165685)** — Machine-readable `reason` on settled yielded collectors.
- **[#139586](https://github.com/openclaw/openclaw/issues/139586)** — Gateway-wide automation management from native macOS and Talk admin turns (1 👍).
- **[#151178](https://github.com/openclaw/openclaw/issues/151178)** — Active Memory escalation delegation to a plugin provider.

**Prediction:** Given the beta focus, Knowledge Scribes extensions (#193048) and PostgreSQL-plane follow-ups are most likely next. The Claude web_search provider and session confidentiality (#187836) fit the next minor window. Sandboxed skill workshop (#91676) likely waits on security review.

## 7. User Feedback Summary

**Pain points:**
- **Windows lifecycle is the loudest complaint** (#170956, #169844, #162585, #163139): installs via `schtasks` fail to restart cleanly, updates hang, and plugin reload hits EPERM.
- **State migrations block updates** (#161921, #185656): users are effectively stuck on a previous release after a failed `state-migrated-no-rollback`.
- **Memory and cost:** recalled-entry eviction breaks dreaming (#150635); heartbeat runs never reuse prompt cache (#161208, now closed); vec0 sparse allocation exceeds the 30s search deadline (#176187); retained history is re-billed every turn (#178373).
- **Phantom/internal content surfacing:** internal runtime strings appear as user prompts (#151962) and system context injections render as chat messages (#165041) — eroding trust in the transcript.
- **Crash recovery bricks agents** (#166634, #190307): one bad checkpoint or restart and an agent permanently refuses `chat.history`/`models.list`.

**Satisfaction signals:** Quick closures of cosmetic bugs (#165391, #193101) and prompt-cache cost fix (#161208) show responsiveness on lower-severity items. However, the P0 cluster with 70+ comments and no fix PR suggests users on older releases feel stranded.

## 8. Backlog Watch

Long-lived items needing maintainer attention:

- **[#91676](https://github.com/openclaw/openclaw/issues/91676)** (opened 2026-06-09, P2) — Sandboxed skill workshop opt-in; 2 upvotes, needs product + security review, unaddressed for ~5 months.
- **[#17840](https://github.com/openclaw/openclaw/issues/17840)** (opened 2026-02-16) — Reaction-triggered agent turns; nearly 9 months old, still `needs-product-decision`.
- **[#137110](https://github.com/openclaw/openclaw/issues/137110)** (opened 2026-09-03) — Telegram `sendDice` support; small feature, stalled on product decision.
- **[#120385](https://github.com/openclaw/openclaw/issues/120385)** (opened 2026-08-08, P2) — Code Mode tool catalog incompleteness for cron turns; scope corrections have superseded the original report but no fix landed.
- **[#125707](https://github.com/openclaw/openclaw/pull/125707)** (opened 2026-08-18, maintainer-authored) — Retain Codex native thread reasoning effort; open ~11 weeks.
- **[#125969](https://github.com/openclaw/openclaw/pull/125969)** (opened 2026-08-18) — Scope Gateway image-capability discovery; open ~11 weeks.
- **[#130231](https://github.com/openclaw/openclaw/pull/130231)** (opened 2026-08-26) — Non-publishing native locale refresh in CI; blocked on security-boundary proof.
- **[#165583](https://github.com/openclaw/openclaw/pull/165583)** (opened 2026-10-05, P1, security-review-required) — Configured primary account blocks CLI fallback; a month old with 1,000+ PRs merged since, still awaiting review.

**Assessment:** The backlog backlog pattern is consistent: maintainer-authored PRs linger near "ready," while P1 security-review-required items wait on reviewer bandwidth. Backlog triage — not feature ambition — is the project's clearest constraint.

---

## Cross-Ecosystem Comparison

# Cross-Project Comparison Report — Personal AI Assistant / Agent Open-Source Ecosystem
**Snapshot Date:** 2026-11-05
**Projects:** OpenClaw, Hermes Agent, IronClaw, QwenPaw, ZeroClaw

---

## 1. Ecosystem Overview

The personal AI assistant / agent open-source landscape in late 2026 is bifurcated into **high-velocity reference projects** (OpenClaw, ZeroClaw, QwenPaw, Hermes Agent) and **quiet maintenance-stage projects** (IronClaw). Across active projects, the dominant engineering theme has shifted decisively from *capability expansion* to **state durability, multi-tenant safety, and cross-platform lifecycle reliability** — evidenced by P0 clusters around Windows `schtasks`/gateway restarts (OpenClaw, Hermes), memory-plane isolation (ZeroClaw), and silent-degradation failures (QwenPaw, Hermes). Memory architecture is the second convergence zone: recall eviction, prompt-cache reuse, pluggable memory backends, and append-only session histories are being reworked in at least three projects simultaneously. Meanwhile, **maintainer triage bandwidth — not contributor supply — is the ecosystem's clearest constraint**, with open PR queues of 45–306 across projects and multiple XL/stacked PRs stalled for weeks to months.

---

## 2. Activity Comparison

| Project | Issues (active/updated 24h) | PRs (open / merged or closed 24h) | Release Status | Health Score* |
|---|---|---|---|---|
| **OpenClaw** | 400 updated; ~230 open/active | ~500 updated; 306 open / 194 merged-closed | **v2026.11.5-beta.1** (Knowledge Scribes + PostgreSQL state plane) | **7.5/10** — High velocity, P0 bottleneck |
| **Hermes Agent** | 50 updated; 49 open, 1 closed | 50 updated; 47 open / 3 merged-closed | None (latest v0.22.7); **1 critical security pin unresolved** | **5.5/10** — Engagement high, triage strained |
| **IronClaw** | 0 updated | 1 open / 0 merged | None | **4.0/10** — Stable but idle |
| **QwenPaw** | 10 updated; 7 open, 3 closed | 50 updated; 37 open / 13 merged-closed | None (stable 2.2.2.post1, beta 2.3.0b2) | **7.0/10** — Strong velocity, pre-release pressure |
| **ZeroClaw** | 20 updated; most closed today | 50 updated; 45 open / 5 merged-closed | Pre-v0.9.0 assembly | **8.0/10** — Fastest security triage, review backlog risk |

\*Health score is a composite judgment weighting contribution volume, merge throughput, severity of open P0/P1 items, and release cadence. It is directional, not a formal metric.

**Key ratio — merge-to-open PR throughput:** OpenClaw (~0.63) ≫ QwenPaw (0.35) ≫ ZeroClaw (0.11) > Hermes (0.06) > IronClaw (0.00). Only OpenClaw is closing PRs at a rate roughly commensurate with intake.

---

## 3. OpenClaw's Position

**Advantages vs. peers:**
- **Scale of contribution:** 400 issues + 500 PRs touched in 24h is 8–10× the next-most-active projects (Hermes, QwenPaw, ZeroClaw at ~50–70). OpenClaw is the ecosystem's de facto reference implementation.
- **Only project shipping features while others stabilize:** Knowledge Scribes and a PostgreSQL-backed state plane are shipped in beta, whereas peers are primarily fixing regressions (QwenPaw 2.3.0b2, ZeroClaw pre-v0.9.0, Hermes on v0.22.x).
- **Mature surface breadth:** Control UI, OpenClawKit (Swift), Discord/Signal/Matrix/Telegram channels, sandbox/Workshop subsystems, and native host exec — no peer matches this channel and platform footprint.

**Technical approach differences:**
- **SQLite-first, now expanding to a PostgreSQL data plane** — OpenClaw is the only project offering two production state backends. QwenPaw is rearchitecting session storage (append-only SQLite, #8532); ZeroClaw is moving to an append-only event log (#11921). OpenClaw's multi-plane approach is broader but carries migration risk (see #161921, `state-migrated-no-rollback`).
- **Tiered memory with "dreaming" promotion and a 512-entry recall cap** — a distinctive architecture; peers use plugin-based (QwenPaw OpenViking #7613) or principal-scoped memory (ZeroClaw).

**Community size comparison:**
- OpenClaw's comment leaders reach 70 comments (#160959) — vs. Hermes' 5, QwenPaw's 6, ZeroClaw's 15. Roughly **order-of-magnitude larger** community engagement.
- Downside: the same scale means the **P0 regression cluster (#160959, #170956) has no fix PR and is rolling forward into the beta** — a maturity risk peers currently avoid.

---

## 4. Shared Technical Focus Areas

| Theme | Projects | Specific Needs |
|---|---|---|
| **Windows lifecycle reliability** | OpenClaw (#170956, #169844), Hermes (#132645), ZeroClaw (#12119), QwenPaw (#8565) | `schtasks` restart atomicity, named-profile updates, descendant-process cleanup, AppContainer staging, missing CPU-arch fallback |
| **State durability & crash recovery** | OpenClaw (#166634, #190307), ZeroClaw (#11921), QwenPaw (#8532) | Recoverable checkpoints, non-bricking agent restart, append-only session histories, paginated reconnect |
| **Memory architecture rework** | OpenClaw (#150635 recall cap, #178373 re-billing), QwenPaw (#7613 OpenViking, #8580 tag index), ZeroClaw (#11198, #11239 isolation) | Promotion pipeline starvation, per-turn cost, pluggable backends, principal-scoped isolation |
| **Multi-tenant / principal scoping** | ZeroClaw (#11198, #11239, #11230, #11220), Hermes (#148930 multi-profile) | Delegated memory scope, admin authority for SOP, session-data tool withholding |
| **Silent degradation → observability** | QwenPaw (#8278 DingTalk, #8579 provider-disabled), Hermes (#149107 fallback flip, #148857 stuck fallback) | Machine-readable `reason` on failures, "degraded" signals back to the Agent, no unannounced fallback |
| **Proxy / environment assumptions** | Hermes (#148849, #142866), OpenClaw (Tailscale #148308) | `NO_PROXY` honoring, LAN/Tailscale engine bypass for metadata probes |
| **Update-path robustness** | Hermes (#132645, #149121), OpenClaw (#161921), QwenPaw (#8575 stable-manifest) | Atomic updates, drain-and-update UX, rollback paths |
| **Migration-version coherence** | OpenClaw (#161921, #185656), ZeroClaw (#11579) | No schema stamping without migration; rollback from failed state migrations |

**Convergent requirement:** A recoverable, observable state plane that fails *loudly and partially* rather than *silently and totally*. This is now a table-stakes expectation across all active projects.

---

## 5. Differentiation Analysis

| Dimension | OpenClaw | Hermes Agent | IronClaw | QwenPaw | ZeroClaw |
|---|---|---|---|---|---|
| **Primary focus** | Feature breadth + platform coverage | Cross-platform ops reliability + Desktop | Dependency hygiene (dormant) | Pre-release stabilization + localization | Security hardening + v0.9.0 release gate |
| **Target users** | Power users, multi-channel operators | Homelab / multi-profile production operators | (unclear from activity) | Chinese Windows/NAS users, multi-channel (DingTalk/Matrix/Feishu) | Security-conscious multi-tenant operators |
| **State architecture** | SQLite + new PostgreSQL plane | Gateway + worker adoption model | n/a today | Append-only SQLite rearchitecture (#8532) | Append-only event log (#11921) |
| **Memory model** | Tiered recall + dreaming promotion | Plugin/memory-provider lifecycle | n/a | Pluggable (OpenViking #7613) | Principal-scoped shared plane |
| **Channel strategy** | Broad native (Discord, Signal, Matrix, Telegram) | Desktop-first, multi-channel | n/a | Chinese ecosystem focus (DingTalk, Feishu, Matrix, qqbot) | Self-hosted-first (Rocket.Chat merged, Zulip PR) |
| **Security posture** | Security-review-required PRs (e.g., #165583) | One critical unresolved (compromised CA roots #148835) | n/a | Fix-PR-driven | **Most aggressive** — 8+ P0/P1 security issues triaged in 48h |
| **Runtime/local-model** | Native (Codex, Ollama context) | Codex backend | n/a | Piccolo runtime (#8573), Ollama `num_ctx` (#8236) | Multi-registry plugins (#12216) |

**Architectural split worth noting:** ZeroClaw and QwenPaw are converging on **append-only event-log storage** as a correctness primitive, while OpenClaw is adding a **second relational plane** (PostgreSQL). These are philosophically opposite bet-the-architecture decisions.

---

## 6. Community Momentum & Maturity

**Activity tiers:**

- **Tier 1 — Rapid iteration at scale:** *OpenClaw* (400 issues/500 PRs, shipping betas). Iterating features and stability simultaneously; risk is P0 roll-forward.
- **Tier 2 — High-velocity, stabilization-bound:** *ZeroClaw*, *QwenPaw*, *Hermes Agent*. All 40–70 items/24h. ZeroClaw is the most disciplined (security-first, same-day fix PRs); QwenPaw is in a pre-release regression cluster; Hermes has the weakest merge throughput (3/24h) and a stranded 13-commit production patch (#148843).
- **Tier 3 — Maintenance-quiet:** *IronClaw* (1 Dependabot PR, no issues, no merges). Stable but no momentum; only actionable item is reviewing a major `zip` 8→9 bump (#8168).

**Maturity signals by project:**
- **Most mature triage discipline:** ZeroClaw — closes S0/S1 security issues same-day with linked fix PRs; explicit `release:v0.9.0` gating.
- **Most mature release process:** OpenClaw — semver'd betas, companion doctor checks, CI migration fixture isolation.
- **Least mature release process:** Hermes — no release in 24h, critical security pin (compromised CA roots) shipping on `main` and v0.22.7 with no fix PR.
- **Most review-constrained:** ZeroClaw (45 open PRs, multiple XL `needs-maintainer-review`) and QwenPaw (all XXL+ architectural PRs stalled 18–37 days).

---

## 7. Trend Signals for AI Agent Developers

1. **The "silent failure" era is ending.** Across QwenPaw (#8278) and Hermes (#149107), users explicitly demand machine-readable failure reasons and degraded-state signals rather than opaque "Internal error." **Action:** Design tool and provider APIs with typed, surfaced error envelopes from day one — retrofitting observability is a P0 cost later.

2. **State is the hard problem, not inference.** Every active project is reworking state storage: append-only event logs (ZeroClaw, QwenPaw), additional planes (OpenClaw PostgreSQL), or crash-recoverable checkpoints (OpenClaw #166634). **Action:** Treat agent session state as a durable, replayable event stream — not a mutable transcript — to avoid a migration crisis mid-scale.

3. **Cross-platform lifecycle is the top hidden cost.** Windows `schtasks`/AppContainer (OpenClaw, Hermes, QwenPaw) and NAS/sandbox environments (fnOS, AppContainer) generate the highest-volume reliability complaints. **Action:** Invest in managed-service lifecycle and filesystem-encoding (GBK/CP936, #8234) handling before marketing Windows/NAS support.

4. **Multi-tenant principal scoping is a security frontier.** ZeroClaw's S0 cluster (#11198, #11239) shows that delegated memory and subagent spawning leak scope by default. **Action:** Principal-scope all memory, session-data, and SOP execution paths; assume any shared plane will be reached through delegation.

5. **Approval and fallback need cryptographic backing.** ZeroClaw #12227 (approval depending on a model-written "approved" value) and Hermes' fallback flips are trust-critical. **Action:** Never derive authorization state from model output; surface which model answered and why.

6. **Update paths are a first-class product surface.** Hermes (#132645, #149121), OpenClaw (#161921 no-rollback), and QwenPaw (#8575) all show update flows breaking production. **Action:** Ship atomic updates with documented rollback and drain-and-update UX; treat migration as a transaction.

7. **Review bandwidth is the ecosystem's binding constraint.** With 45–306 open PRs and XL security PRs stalled for months (ZeroClaw #9746, #11805; OpenClaw #165583), maintainers — not contributors — gate progress. **Action:** Budget for stacked-PR splitting, security-reviewer capacity, and a stability-only merge window before adding surface area.

8. **Local-model correctness (context windows, runtimes) is a growing segment.** QwenPaw's Ollama `num_ctx` (#8236) and Piccolo runtime (#8573) reflect demand for accurate local-model semantics over default 128k assumptions. **Action:** Source context limits from the runtime, not from a static default.

---

*Prepared for technical decision-makers. Data derived from the 2026-11-05 community digests for each project; all counts reflect the 24-hour snapshot unless otherwise noted.*

---

## Peer Project Reports

<details>
<summary><strong>Hermes Agent</strong> — <a href="https://github.com/nousresearch/hermes-agent">nousresearch/hermes-agent</a></summary>

# Hermes Agent — Project Digest
**Date:** 2026-11-05
**Repo:** [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent)

---

## 1. Today's Overview

Hermes Agent shows **very high sustained activity**: 50 issues and 50 PRs updated in the last 24 hours, with only 1 issue closed and 3 PRs merged/closed — a merge-to-open ratio that suggests the maintainer team is significantly out-paced by incoming reports. No new releases were cut today, and the project is operating with a heavily open backlog (49/50 active issues, 47/50 open PRs). The dominant theme across today's traffic is **cross-platform reliability**: Windows gateway/profile handling, proxy inheritance, Desktop renderer/gateway coordination, and provider-auth edge cases. Overall project health is strong in community engagement but strained in triage throughput — the "sweeper:risk-*" labels and repeated "salvage #NNNNN" PRs indicate a deliberate but backlogged effort to absorb community patches.

---

## 2. Releases

**None.** No new releases published in the last 24h. Users on `v0.22.6`/`v0.22.7` are the latest tracked versions referenced in issues (e.g., #148858 notes v0.22.6; #148835 notes v0.22.7). Notably, the pinned PortableGit dependency in `pm/lock.json` is flagged as containing compromised CA roots (see §5).

---

## 3. Project Progress

Only **3 PRs were merged/closed** today, one of which is visible in the data:

- **[PR #148864](https://github.com/NousResearch/hermes-agent/pull/148864) [CLOSED]** — `fix(process): re-arm a checkpointed heartbeat when recovery adopts the process` (salvage of #118710). Fixes background jobs (`terminal(background=true, heartbeat=N)`) going silent after a gateway restart or worker adoption. *Merged/closed today.*

The remaining 47 open PRs show work advancing but not landing — most are community submissions awaiting review. Of note, a cluster of `teknium1` "salvage" PRs ([#148862](https://github.com/NousResearch/hermes-agent/pull/148862), [#148865](https://github.com/NousResearch/hermes-agent/pull/148865), [#149192](https://github.com/NousResearch/hermes-agent/pull/149192)) are being shepherded toward merge, indicating a maintainer-driven consolidation effort.

---

## 4. Community Hot Topics

Ranked by comment count in the last 24h:

1. **[Issue #132645](https://github.com/NousResearch/hermes-agent/issues/132645) — 5 comments** | *Windows `hermes update` leaves gateway down with named profile.* Reported 2026-10-04, still open after a month. Requires `active_profile` + Windows + update path. **Underlying need:** users run multi-profile production setups on Windows and need update atomicity guarantees.

2. **[Issue #105151](https://github.com/NousResearch/hermes-agent/issues/105151) — 4 comments** | *`vision_analyze` requires/echoes an auxiliary question on the native image path.* Two-month-old low-severity bug with persistent interest. **Underlying need:** cleaner multimodal tool schemas.

3. **[Issue #149107](https://github.com/NousResearch/hermes-agent/issues/149107) — 3 comments** | *`_api_kwargs_have_image_parts` TypeError on JSON schema property named "type", silently activates fallback model.* **Underlying need:** predictable fallback behavior; silent degradation is a trust issue.

4. **[Issue #142866](https://github.com/NousResearch/hermes-agent/issues/142866) — 3 comments** | *qqbot WebSocket ignores NO_PROXY.* **Underlying need:** correct proxy bypass for LAN/sandbox environments.

5. **[PR #85794](https://github.com/NousResearch/hermes-agent/pull/85794) — long-running (since Aug 14)** | *Auto-update & "Update all" across CLI/chat/Desktop/dashboard.* Sustained comment activity signals strong demand for automated lifecycle management.

**Takeaway:** The hottest threads are all *operational reliability* issues — updates, proxies, fallback, and platform-specific failures — not feature excitement.

---

## 5. Bugs & Stability

Ranked by severity:

| Severity | Item | Status |
|---|---|---|
| **Critical (Security)** | **[#148835](https://github.com/NousResearch/hermes-agent/issues/148835)** — Pinned Git for Windows 2.53.0.3 trusts **compromised eMudhra intermediates** (disclosed 2026-10-20). Ships on `main` and v0.22.7 as `mingw64/etc/ssl/certs/ca-bundle.crt`. | **Open, no fix PR** |
| **High** | **[#149107](https://github.com/NousResearch/hermes-agent/issues/149107)** — TypeError in image-part detection silently flips to fallback model. Data-path correctness + uncontrolled failover. | Open, no fix PR |
| **High** | **[#148857](https://github.com/NousResearch/hermes-agent/issues/148857)** — Gateway session stuck on last fallback even after earlier fallbacks recover. | Open, no fix PR |
| **High** | **[#148898](https://github.com/NousResearch/hermes-agent/issues/148898)** — Codex backend HTTP 400 on zstd-compressed `/responses` bodies; classified non-retryable. | Open |
| **High** | **[#148930](https://github.com/NousResearch/hermes-agent/issues/148930)** — Kanban workers crash at first session save ("Kanban owner refused"). Production multi-profile setup. | Open |
| **High** | **[#132645](https://github.com/NousResearch/hermes-agent/issues/132645)** — Windows update leaves gateway down (see §4). | Open **>1 month** |
| **Medium** | **[#148830-ish cluster]** — Desktop: queued prompts lose Edit/Steer ([#148846](https://github.com/NousResearch/hermes-agent/issues/148846)); boot 180 s renderer kill ([#148884](https://github.com/NousResearch/hermes-agent/issues/148884)); right-column width regression ([#148860](https://github.com/NousResearch/hermes-agent/issues/148860)); `\$260.02` escaping ([#148859](https://github.com/NousResearch/hermes-agent/issues/148859)). Fix PRs exist for #148846 ([#148854](https://github.com/NousResearch/hermes-agent/pull/148854)) and Git-decoration propagation ([#148845](https://github.com/NousResearch/hermes-agent/pull/148845)). | Partially fixed |
| **Medium** | **[#148848](https://github.com/NousResearch/hermes-agent/issues/148848)** — `browser_vault` fills hidden password twin, truncates to 1 char. Auth/automation correctness. | Open |
| **Medium** | **[#148852](https://github.com/NousResearch/hermes-agent/issues/148852)** — Azure/APIM auth headers omitted by auxiliary clients/probes/doctor. | Open |
| **Medium** | **[#147387](https://github.com/NousResearch/hermes-agent/issues/147387)** — Gated dashboard rejects Desktop token-mode; WS upgrade always rejected. | Open |
| **Medium** | **[#148849](https://github.com/NousResearch/hermes-agent/issues/148849)** — Model metadata probes inherit HTTP proxy, breaking LAN/Tailscale engines. | Open |

**One bug was closed today:** [#148932](https://github.com/NousResearch/hermes-agent/issues/148932) — Glass translucency at low intensity looked like a broken display.

**Fix PRs present for:** [#148846](https://github.com/NousResearch/hermes-agent/issues/148846) → [PR #148854](https://github.com/NousResearch/hermes-agent/pull/148854); [#148831](https://github.com/NousResearch/hermes-agent/issues/148831) → [PR #148832](https://github.com/NousResearch/hermes-agent/pull/148832); [#148853](https://github.com/NousResearch/hermes-agent/issues/148853) → [PR #148851](https://github.com/NousResearch/hermes-agent/pull/148851); delegate/reflection fixes via [#149192](https://github.com/NousResearch/hermes-agent/pull/149192).

---

## 6. Feature Requests & Roadmap Signals

| Request | Link | Signal |
|---|---|---|
| **One-click Google Workspace auth** (Gmail/Calendar/Drive/Docs/Sheets), parity with Cursor, no per-user GCP project | [#148915](https://github.com/NousResearch/hermes-agent/issues/148915) | High — explicit competitor-comparison pressure; likely roadmap candidate. |
| **Desktop updater: "Stop running work and update"** during gateway drain | [#149121](https://github.com/NousResearch/hermes-agent/issues/149121) | Medium — UX polish on the update path that already has multiple open bugs. |
| **Skill lifecycle events** for memory providers/plugins (archived skills) | [#148863](https://github.com/NousResearch/hermes-agent/issues/148863) | Medium — extensibility signal from plugin ecosystem. |
| **Localizable catalog content layer** (Desktop Capabilities) + Russian/Polish dictionaries | [#148842](https://github.com/NousResearch/hermes-agent/issues/148842), [PR #148840](https://github.com/NousResearch/hermes-agent/pull/148840), [PR #148841](https://github.com/NousResearch/hermes-agent/pull/148841), [PR #148855](https://github.com/NousResearch/hermes-agent/pull/148855) | Medium-High — i18n is actively landing. |
| **Plugin auto-update / "Update all"** | [PR #85794](https://github.com/NousResearch/hermes-agent/pull/85794) | High — long-running, cross-surface. |
| **Kanban deep-linking from any plugin** | [PR #148850](https://github.com/NousResearch/hermes-agent/pull/148850) | Low-Medium — developer ergonomics. |
| **TUI: expandable pasted text (Ctrl+P)**, `/new` mid-turn backgrounding | [PR #148883](https://github.com/NousResearch/hermes-agent/pull/148883), [PR #148880](https://github.com/NousResearch/hermes-agent/pull/148880) | Medium — quality-of-life, already in review. |

**Prediction for next release:** i18n/catalog localization (PRs are interlocked and near-ready), plugin auto-update (#85794), and targeted Desktop fixes (#148854, #148845). Google Workspace auth is the strongest *new* strategic request but likely needs a dedicated sprint.

---

## 7. User Feedback Summary

**Pain points (dissatisfaction signals):**
- **Update path is fragile.** Windows users (#132645) lose their gateway on update; Desktop users hit a fixed 180 s renderer timeout (#148884) and a "Downloading updates" stall (#149121). Updates are the #1 recurring reliability complaint.
- **Silent degradation erodes trust.** The fallback model activating on a TypeError (#149107) and sessions sticking on failed fallbacks (#148857) mean users can't tell which model answered or why.
- **Proxy/environment assumptions.** LAN/Tailscale engines (#148849) and qqbot WebSocket (#142866) break behind corporate/local proxies.
- **Production multi-profile operators carry local patches.** [#148843](https://github.com/NousResearch/hermes-agent/issues/148843) is a *13-commit local patch series* from a homelab operator — a strong signal the upstream release lags real operational needs (Kanban dispatch, MCP lifecycle, turn finalizer).

**Use cases in evidence:** production homelab multi-profile setups (44 profile gateways in #148930), Windows hosts, Docker+TUI with shared auth (#148833), browser automation with credential vaults (#148848), and multi-language Desktop deployments.

**Satisfaction:** Mixed-to-confident — users are deeply invested (long sessions, production deployments, AI-assisted reports) but are being forced to self-patch. No negative sentiment toward the project's direction, only toward release-blocking stability gaps.

---

## 8. Backlog Watch

Items needing maintainer attention (age/severity vs. responsiveness):

1. **[Issue #132645](https://github.com/NousResearch/hermes-agent/issues/132645)** — *Open since 2026-10-04* (>1 month). Windows update breaks gateway with named profiles. **Highest-priority stale bug**; P2 + 4 sweeper risk tags.
2. **[Issue #105151](https://github.com/NousResearch/hermes-agent/issues/105151)** — *Open since 2026-09-07* (~2 months). Vision tool schema wart; P3 but persistent.
3. **[Issue #148835](https://github.com/NousResearch/hermes-agent/issues/148835)** — **Security: compromised CA roots still pinned.** No fix PR. Should be triaged ahead of all P2/P3 work.
4. **[PR #85794](https://github.com/NousResearch/hermes-agent/pull/85794)** — *Open since 2026-08-14* (~3 months). Plugin auto-update, `ci-reviewed`, still unmerged. Large cross-surface feature at risk of rotting.
5. **[Issue #148843](https://github.com/NousResearch/hermes-agent/issues/148843)** — 13-commit local production patch series; unreviewed. If legitimate, it represents upstream-ready work stranded in an issue.
6. **[Issue #142866](https://github.com/NousResearch/hermes-agent/issues/142866)** — *Open since 2026-10-22*. qqbot NO_PROXY bug; platform-specific, so easy to starve.

**Backlog health verdict:** Triage is the bottleneck, not contribution. With 49 open issues and 47 open PRs touched today and only 3 merged, the project would benefit from a focused "stability + Windows + update path" merge window before adding new surface area.

</details>

<details>
<summary><strong>IronClaw</strong> — <a href="https://github.com/nearai/ironclaw">nearai/ironclaw</a></summary>

# IronClaw Project Digest — 2026-11-05

## 1. Today's Overview

IronClaw (github.com/nearai/ironclaw) is in a low-activity state as of 2026-11-05, with no issues updated in the past 24 hours and no new releases published. The only recorded activity is a single open Dependabot pull request (#8168) proposing a major-version dependency bump for the `zip` crate from 8.6.0 to 9.0.5. No PRs were merged or closed today, and there is no community discussion volume to report. Overall, this is a maintenance-quiet day for the project — routine dependency hygiene is proceeding, but there are no product-facing or feature-level developments to highlight.

## 2. Releases

No new releases were published for IronClaw on 2026-11-05. Nothing to report on version changes, breaking changes, or migration notes.

## 3. Project Progress

No PRs were merged or closed in the last 24 hours. The only open PR is a dependency update (see Section 4/8), which has not yet landed. Consequently, there were no feature advancements or bug fixes integrated into the codebase today.

## 4. Community Hot Topics

- **[OPEN] PR #8168 — chore(deps): bump zip from 8.6.0 to 9.0.5** — [nearai/ironclaw#8168](https://github.com/nearai/ironclaw/pull/8168)
  - Author: dependabot[bot] | Created/Updated: 2026-11-04 | Comments: n/a | 👍: 0
  - This is the sole active item in the repository. It is an automated dependency bump moving the `zip` crate across a **major version boundary (8.x → 9.x)**, which by semver convention implies potential breaking API changes in the `zip` crate. Release notes reference bug fixes in v9.0.5 (e.g., mode-related fixes).
  - **Underlying need:** Keeping archive-handling dependencies current for security patches and bug fixes. However, because this is a major-version jump, it warrants maintainer review to confirm API compatibility within IronClaw before merging. There is no community engagement (0 reactions, no comments), indicating this is routine bot activity rather than a user-driven topic.

## 5. Bugs & Stability

No bugs, crashes, or regressions were reported or updated today (0 issues updated in the last 24h). There are no known open stability concerns reflected in current repository activity. Note: the open dependency PR (#8168) touches `zip` 8.x → 9.x; if merged without review, it is the most plausible source of any future build/regression risk, given the major-version change.

## 6. Feature Requests & Roadmap Signals

No feature requests were filed or discussed in the last 24 hours. With zero issues updated and no merged PRs, there are no signals today pointing to upcoming features or roadmap priorities. The only forward-looking signal is the pending `zip` 9.x upgrade, which — if adopted — suggests the project is maintaining current-generation Rust dependencies in its stack.

## 7. User Feedback Summary

There is no user feedback to summarize for 2026-11-05. No issues, comments, or reactions were recorded, so pain points, use cases, and satisfaction levels cannot be assessed from today's data. This absence of feedback likely reflects a quiet day rather than a signal of dissatisfaction.

## 8. Backlog Watch

- **[OPEN] PR #8168 — bump zip from 8.6.0 to 9.0.5** — [nearai/ironclaw#8168](https://github.com/nearai/ironclaw/pull/8168)
  - Opened 2026-11-04 by Dependabot, still open with no comments or reactions as of 2026-11-05. Because it is a **major-version dependency bump**, it deserves maintainer attention: confirm compatibility, check for breaking changes in `zip` 9.x, and either merge with CI validation or hold with a documented reason. Left unattended, major-version Dependabot PRs tend to accumulate and complicate later upgrades.

---

**Health Assessment:** IronClaw shows a stable but idle profile today — zero issues, zero merges, zero releases, and one automated dependency PR. There are no red flags in terms of bugs or community friction, but also no momentum. The primary actionable item for maintainers is reviewing PR #8168 before it becomes stale.

</details>

<details>
<summary><strong>QwenPaw</strong> — <a href="https://github.com/agentscope-ai/QwenPaw">agentscope-ai/QwenPaw</a></summary>

# QwenPaw Project Digest — 2026-11-05

## 1. Today's Overview

QwenPaw shows **high development velocity with elevated stability pressure**. In the last 24 hours, 10 issues were updated (7 open/active, 3 closed) and 50 PRs saw activity (37 open, 13 merged/closed), with no new releases. The project is clearly in an active pre-release stabilization cycle for the 2.3.0 beta line, with several regressions and platform-specific bugs surfacing (Windows Hub runtime, always-on-top desktop window, code-mode tool call failures). Meanwhile, substantial architectural work continues on session storage, memory plugins, and provider hardening. The open-to-merged PR ratio (~3:1) suggests maintainers are reviewing carefully but the backlog of under-review PRs is growing.

## 2. Releases

No new releases in the last 24 hours. The most recent installable versions referenced in issues are `2.2.2.post1` (stable) and `2.3.0b2` (beta).

## 3. Project Progress

**Merged/closed PRs today (13 total, highlights):**

- **#7613** [CLOSED] `feat(memory): add OpenViking memory plugin` — Adds an OpenViking memory backend with automatic recall, turn persistence, and a `memory_search` tool. A significant step toward pluggable memory architectures. ([link](https://github.com/agentscope-ai/QwenPaw/pull/7613))
- **#8575** [CLOSED] `fix(desktop): restrict auto-update manifest to stable releases` — Aligns desktop update policy with the browser console's stable-only policy. ([link](https://github.com/agentscope-ai/QwenPaw/pull/8575))
- **#8559** [CLOSED] `feat(matrix): install E2EE dependencies by default` — Removes the manual `pip install matrix-nio[e2e]` step, upgrading the supported SDK range. ([link](https://github.com/agentscope-ai/QwenPaw/pull/8559))
- **#8422** [CLOSED] `feat(console): add plugin-facing theme token overrides` — Expands plugin theming from a single `colorPrimary` to six semantic tokens with light/dark pairs. ([link](https://github.com/agentscope-ai/QwenPaw/pull/8422))

**Notable open work advancing:**
- **#8532** (XXXL) — Append-only SQLite session storage with paginated history and native Turn forks. This is a foundational change for long-conversation durability and reconnect consistency. ([link](https://github.com/agentscope-ai/QwenPaw/pull/8532))
- **#8573** (XXL) — Piccolo runtime installation for local models, extending QwenPaw Local's capabilities beyond the current `b8744` runtime. ([link](https://github.com/agentscope-ai/QwenPaw/pull/8573))

## 4. Community Hot Topics

| Item | Type | Comments | Link |
|---|---|---|---|
| #8278 DingTalk >3500 char degradation | Issue (closed) | 6 | [#8278](https://github.com/agentscope-ai/QwenPaw/issues/8278) |
| #8565 Windows Hub Local runtime failure | Issue (open) | 4 | [#8565](https://github.com/agentscope-ai/QwenPaw/issues/8565) |
| #8538 Matrix plugin multi-workspace activation | Issue (open) | 3 | [#8538](https://github.com/agentscope-ai/QwenPaw/issues/8538) |
| #8515 fnOS sandboxed startup crash | Issue (closed) | 3 | [#8515](https://github.com/agentscope-ai/QwenPaw/issues/8515) |

**Underlying needs analysis:** The hottest discussions cluster around *deployment-environment diversity*. Users are running QwenPaw in increasingly non-standard contexts — Chinese Windows (GBK files, AppContainer sandboxes), NAS devices in restricted sandboxes (fnOS), multi-workspace Matrix setups, and DingTalk with long-form table content. The recurring theme is that channel degradation and platform detection lack graceful fallbacks, and error surfaces are uninformative. Issue #8278 is particularly telling: the user's complaint is less about the 3500-char limit than about the *silent* degradation with no programmatic signal back to the Agent.

## 5. Bugs & Stability

**Critical / High Severity:**

- **#8565** [OPEN] — **Windows Hub Local runtime completely fails to start** (2.2.2.post1). Three independent failure modes: AppContainer skill staging, missing CPU architecture, and reverse-tunnel readiness timeout. A companion PR **#8577** already addresses the token-parsing portion (`--token` values starting with `-`), and **#8570** addresses the missing CPU architecture fallback. ([link](https://github.com/agentscope-ai/QwenPaw/issues/8565))
- **#8581** [OPEN] — **Code mode tool calls fail for any parameter named `name`** (TypeError: multiple values for argument 'name'). Affects core tools like `harness_task` and `spawn_teammate`. Root cause is a positional/keyword collision; fix is a one-line positional-only marker. **No fix PR identified yet.** ([link](https://github.com/agentscope-ai/QwenPaw/issues/8581))
- **#8560** [OPEN] — **Desktop window forced always-on-top in 2.3.0-beta.2**, covering fullscreen apps (kiosks, games, presentations). A UX regression introduced in the beta. **No fix PR identified.** ([link](https://github.com/agentscope-ai/QwenPaw/issues/8560))
- **#8579** [OPEN] — **Disabling a provider leaves stale model references in agent run-config**, causing all channels to fail with `ProviderError: Provider is disabled`. Users see only "Internal error." **No fix PR identified.** ([link](https://github.com/agentscope-ai/QwenPaw/issues/8579))
- **#8580** [OPEN] — **Memory tag index never rebuilds**; `/memory/tags` returns 503 despite tags being generated. ([link](https://github.com/agentscope-ai/QwenPaw/issues/8580))

**Medium Severity:**

- **#8538** [OPEN] — Matrix channel plugin fails to activate with multiple workspaces due to a 10s shared startup window covering only the first. Partially addressed by **#8558** (legacy state migration simplification). ([link](https://github.com/agentscope-ai/QwenPaw/issues/8538))
- **#8576** [OPEN] — Default agent edit button disabled in Console despite the PUT API allowing edits — a frontend/backend policy mismatch compiled into the React bundle. ([link](https://github.com/agentscope-ai/QwenPaw/issues/8576))
- **#8515** [CLOSED] — fnOS sandboxed startup crash; root cause was `state_root()` preferring pwd home over `$HOME`, with an undocumented override variable. ([link](https://github.com/agentscope-ai/QwenPaw/issues/8515))

**Fix PRs in flight (not yet merged):**
- **#8577** — AppContainer bridge token as single argv item
- **#8570** — Windows CPU architecture fallback
- **#8550** — Reject out-of-range model config values on write path
- **#8562** — Drop stale host evidence on declaration withdrawal
- **#8564** — Ignore serialized response policy cache entries
- **#8574** — Opt-in shell memory protection
- **#8561** — Treat unrecognized slash text as a prompt

**Assessment:** The density of Windows-specific and beta-line regressions is notable. The project is accumulating fix PRs faster than they're being merged, which is healthy for correctness but may delay the 2.3.0 stable cut.

## 6. Feature Requests & Roadmap Signals

- **#8460** [CLOSED, enhancement] — Optional browser/OS-level notification push for pending Approval messages. Now closed, suggesting it was accepted and likely implemented or queued. **Prediction: a console notification plugin or setting in the next minor release.** ([link](https://github.com/agentscope-ai/QwenPaw/issues/8460))
- **#8573** — Piccolo runtime installation signals expanding local-model support beyond current runtimes. **Prediction: lands in 2.4.**
- **#8578** — Surface stale daily notes as deduplicated Inbox reminders (ReMe v4 memory). **Prediction: 2.4 memory UX enhancement.**
- **#8557** — Per-run cron sessions to bound history growth. **Prediction: 2.3.x or 2.4.**
- **#8034** — Bound inline media *per request*, not just per file (anti-megabyte-body hardening). **Prediction: 2.3.x.**
- **#8236** — Ollama context window sized from `num_ctx` instead of 128k default. A common local-model correctness fix. **Prediction: 2.3.x.**

## 7. User Feedback Summary

**Pain points voiced by real users:**

- **"Silent degradation" is the top complaint pattern.** Users can tolerate limits (3500 chars, provider-disabled states) but not the absence of signals. The DingTalk issue explicitly asks for a "已被降级" (degraded) signal to the Agent. Similarly, Feishu users see only "Internal error" when a provider is disabled.
- **Non-mainstream deployment environments are underserved.** fnOS NAS sandboxes, Chinese Windows with GBK-encoded files, AppContainer-isolated runtimes, and multi-workspace Matrix hosts all hit edge cases that crash or silently degrade.
- **Configuration state coherence is a recurring frustration.** Disabling a provider does not cascade to agent run-configs; the default agent cannot be edited in the Console despite the API allowing it. Users perceive the UI as "lying" about what is possible.
- **Satisfaction where present:** The #8460 notification request and the OpenViking memory plugin merge suggest the community values memory and notification UX improvements. The rapid PR responsiveness (fix PRs for #8565 filed the same day) indicates an engaged maintainer team.

## 8. Backlog Watch

**Long-unanswered or slow-moving items needing maintainer attention:**

- **#8236** [OPEN since 2026-10-14, size/XL] — Ollama `num_ctx` context window fix. 22 days without merge; affects all local Ollama users with non-default context sizes. ([link](https://github.com/agentscope-ai/QwenPaw/pull/8236))
- **#8234** [OPEN since 2026-10-14, size/XXL] — GBK/CP936 file decoding in read/edit/grep. Silently drops non-UTF-8 bytes today. High impact for Chinese Windows users; 22 days in review. ([link](https://github.com/agentscope-ai/QwenPaw/pull/8234))
- **#8034** [OPEN since 2026-09-29, size/XXL] — Bound inline media per request. 37 days old; a real bandwidth/gateway risk for media-heavy sessions. ([link](https://github.com/agentscope-ai/QwenPaw/pull/8034))
- **#8308** [OPEN since 2026-10-18, size/XS] — Trivial test fix for missing-provider 404. 18 days for an XS PR suggests review bandwidth constraints on small items. ([link](https://github.com/agentscope-ai/QwenPaw/pull/8308))
- **#8532** [OPEN since 2026-11-02, size/XXXL] — Session storage rearchitecture. Large and foundational; needs sustained review attention to avoid becoming stale. ([link](https://github.com/agentscope-ai/QwenPaw/pull/8532))

**Health note:** The backlog is dominated by *large, high-value PRs stuck in review* (8234, 8236, 8034, 8532 — all XXL+). Small fixes are moving, but architectural items risk bit-rot. Maintainers may need to triage reviewer capacity or split these PRs.

---

*Generated from GitHub activity data for 2026-11-05. All links reference github.com/agentscope-ai/QwenPaw.*

</details>

<details>
<summary><strong>ZeroClaw</strong> — <a href="https://github.com/zeroclaw-labs/zeroclaw">zeroclaw-labs/zeroclaw</a></summary>

# ZeroClaw Project Digest — 2026-11-05

## 1. Today's Overview

ZeroClaw is in a high-intensity stabilization phase ahead of the v0.9.0 release, with 70 issues and PRs updated in the last 24 hours (20 issues, 50 PRs) and no new releases cut. Activity is heavily skewed toward security hardening and correctness fixes: at least eight distinct P0/P1 security issues touched memory plane isolation, principal scoping, SOP execution authority, and gateway pairing limits over the past two days. The maintainer core (notably `JordanTheJet` and `IftekharUddin`) is closing security-tagged items rapidly — nine issues and five PRs were closed/merged today, several carrying the `release:v0.9.0` label. Meanwhile, the open PR queue is large (45 open) with several XL-sized stacked branches, suggesting review bandwidth may become the bottleneck. Overall project health is strong on responsiveness but shows accumulating release-gate pressure.

## 2. Releases

No new releases in the last 24 hours. However, the high volume of issues/PRs labeled `release:v0.9.0` (at least 10 items today alone) indicates v0.9.0 is actively being assembled. Notable gated work includes #12213, #11266, #11230, and #11220 (all closed today) — these are likely candidates for the next release notes.

## 3. Project Progress

**Closed/Merged today (5 PRs, 9 issues):**

- **Memory isolation fixes landed** — [#11266](https://github.com/zeroclaw-labs/zeroclaw/pull/11266) (closed) keeps owned-session subagent and pipeline memory private, resolving the S0 issue [#11239](https://github.com/zeroclaw-labs/zeroclaw/issues/11239) "owned sessions reach the shared memory plane through spawn_subagent and execute_pipeline."
- **Gateway pairing enforcement** — [#12213](https://github.com/zeroclaw-labs/zeroclaw/pull/12213) (closed) enforces `[gateway.pairing_dashboard]` limits that were previously accepted but unread, fixing [#9394](https://github.com/zeroclaw-labs/zeroclaw/issues/9394). Pairing codes now expire.
- **SOP authority hardening** — [#11220](https://github.com/zeroclaw-labs/zeroclaw/pull/11220) (closed) requires administrator authority for SOP execution.
- **Session-data tool scoping** — [#11230](https://github.com/zeroclaw-labs/zeroclaw/pull/11230) (closed) withholds session-data tools from non-admin principals.
- **Config schema migration bug** — [#11579](https://github.com/zeroclaw-labs/zeroclaw/issues/11579) (closed): `save_dirty` no longer stamps `schema_version = 3` on unmigrated V1/V2 configs.
- **Dashboard OIDC sign-in** — [#11961](https://github.com/zeroclaw-labs/zeroclaw/issues/11961) (closed): opt-in OIDC for the web dashboard.
- **Docker image build fix** — [#12210](https://github.com/zeroclaw-labs/zeroclaw/issues/12210) (closed): workspace member copy before pre-fetch.

**In review/advancing:**
- RFC [#10526](https://github.com/zeroclaw-labs/zeroclaw/issues/10526) (append-only session event history) was closed and is being implemented via PR [#11921](https://github.com/zeroclaw-labs/zeroclaw/pull/11921) — a large architectural shift replacing mutable transcript writers with a shared event log for deterministic replay.
- Native Zulip channel PR [#12230](https://github.com/zeroclaw-labs/zeroclaw/pull/12230) opened, sibling to the merged Rocket.Chat channel.

## 4. Community Hot Topics

- **[#10526](https://github.com/zeroclaw-labs/zeroclaw/issues/10526) — RFC: Append-only session event history (15 comments, closed)**. The most-commented item today. The underlying need is observability and determinism: users/operators want replayable agent state and derived streams rather than fragmented facts across `TurnEvent`s, logs, receipts, and cost records. Now implemented in PR #11921 — a major architectural direction for the project.
- **[#9394](https://github.com/zeroclaw-labs/zeroclaw/issues/9394) — pairing codes never expire (5 comments, closed)**. Security audit-driven; highlights a pattern of config options being accepted but silently unread.
- **[#6437](https://github.com/zeroclaw-labs/zeroclaw/issues/6437) — Zulip channel long-poll MVP (5 comments, open, parking-lot)**. Recurring demand for self-hosted chat integrations; now has a PR (#12230).
- **[#11198](https://github.com/zeroclaw-labs/zeroclaw/issues/11198) — Delegated memory tools lose principal scope (5 comments, S0, closed)**. High-severity security concern with broad implications for multi-tenant deployments.

The dominant underlying need across hot topics is **multi-tenant safety**: operators are running ZeroClaw with principals, delegates, and subagents, and the security model is being tightened accordingly.

## 5. Bugs & Stability

Ranked by severity (today's updates):

| Severity | Issue | Status | Fix PR? |
|---|---|---|---|
| **S0** | [#11198](https://github.com/zeroclaw-labs/zeroclaw/issues/11198) Delegated memory tools lose principal scope | Closed | #11266 (closed) |
| **S0** | [#11239](https://github.com/zeroclaw-labs/zeroclaw/issues/11239) Owned sessions reach shared memory via spawn_subagent/execute_pipeline | Closed | #11266 (closed) |
| **S1** | [#12210](https://github.com/zeroclaw-labs/zeroclaw/issues/12210) Source Docker builds fail (workspace member not copied) | Closed | — |
| **S2** | [#9572](https://github.com/zeroclaw-labs/zeroclaw/issues/9572) Gateway WebSocket turns overflow Tokio worker stack | Open | None found |
| **S2** | [#11951](https://github.com/zeroclaw-labs/zeroclaw/issues/11951) WebSocket upgrades fail over built-in TLS listener | Closed | — |
| **S2** | [#12235](https://github.com/zeroclaw-labs/zeroclaw/issues/12235) Delegate returns raw text tool calls (native_tools not honoured) | Open (filed today) | None |
| **S2** | [#12228](https://github.com/zeroclaw-labs/zeroclaw/issues/12228) `cron update --agent` reports success but never reassigns | Open | None |
| **S2** | [#12227](https://github.com/zeroclaw-labs/zeroclaw/issues/12227) Shell approval depends on model-written "approved" value | Open | None |
| **S2** | [#12225](https://github.com/zeroclaw-labs/zeroclaw/issues/12225) `glob_search` never lists files outside workspace | Open | None |
| **S2** | [#12119](https://github.com/zeroclaw-labs/zeroclaw/issues/12119) Windows shell timeouts leave descendant processes running | Open | None |
| **S3** | [#12236](https://github.com/zeroclaw-labs/zeroclaw/issues/12236) Cached HTTP clients shared across test runtimes | Open (filed today) | None |

**Notable:** [#12227](https://github.com/zeroclaw-labs/zeroclaw/issues/12227) is particularly concerning — approval prompts depending on a model-supplied "approved" field suggests a potential approval-bypass vector that deserves prompt maintainer attention. Several open S2s (e.g., #9572, #12235, #12228) lack linked fix PRs.

## 6. Feature Requests & Roadmap Signals

- **Multi-registry plugin support** — [#12109](https://github.com/zeroclaw-labs/zeroclaw/issues/12109) (open, 2 comments) requests comma-separated/JSON-array registry URLs. Already being implemented in PR [#12216](https://github.com/zeroclaw-labs/zeroclaw/pull/12216) with accompanying docs PR [#12234](https://github.com/zeroclaw-labs/zeroclaw/pull/12234).
- **Long-running shell tasks with async/sync modes and interactive terminal** — [#11954](https://github.com/zeroclaw-labs/zeroclaw/issues/11954) (open). Strong signal for operator workflows needing persistent shells.
- **Zulip channel** — [#6437](https://github.com/zeroclaw-labs/zeroclaw/issues/6437) with PR [#12230](https://github.com/zeroclaw-labs/zeroclaw/pull/12230). Likely to land in or shortly after v0.9.0 given the Rocket.Chat precedent.
- **Dashboard OIDC** — [#11961](https://github.com/zeroclaw-labs/zeroclaw/issues/11961) (closed). Identity/access is a clear roadmap theme alongside #11805, #12157.
- **Transcription provider fallback** — PR [#12198](https://github.com/zeroclaw-labs/zeroclaw/pull/12198) addresses per-agent transcription friction.

**Prediction for v0.9.0 / next minor:** OIDC/dashboard identity completion, plugin registry multi-origin, append-only session history, and continued principal-scoping hardening. Zulip and long-running shell may slip to v0.9.x or v0.10.

## 7. User Feedback Summary

**Pain points expressed:**
- **Configuration surfacing failures** — Users note config options accepted but ignored (#9394, #12228, #12221), causing silent no-ops and eroded trust in config validation.
- **Cross-platform gaps** — Windows process-tree cleanup (#12119) and Windows Clippy CI timeouts (#12218) highlight platform parity issues.
- **Approval ergonomics** — #12227 (inconsistent shell approval prompts) and PR #11815 (dismissed `ask_user` reported as error) show friction in interactive workflows.
- **Multi-tenancy safety** — Multiple S0/S1 reports from security-conscious operators (`Audacity88`, `JordanTheJet`) indicate production deployments with untrusted or multi-user input.

**Satisfaction signals:** Rapid closure of high-severity items and maintainer-authored fix PRs (often filed same-day) suggest a responsive maintainer group. Dissatisfaction clusters around config semantics being documented/accepted but non-functional.

## 8. Backlog Watch

Long-unanswered or stalled items needing maintainer attention:

- **[#6437](https://github.com/zeroclaw-labs/zeroclaw/issues/6437) — Zulip channel** (open since 2026-05-06, ~6 months, `status:parking-lot`). Now has PR #12230; needs review to move out of parking lot.
- **[#9572](https://github.com/zeroclaw-labs/zeroclaw/issues/9572) — Tokio worker stack overflow** (open since 2026-07-31, P1, no linked fix). Runtime abort risk on dashboard WebSocket turns.
- **[#9746](https://github.com/zeroclaw-labs/zeroclaw/pull/9746) — Per-agent ownership scoping for session tools/discord_search** (open since 2026-08-04, `needs-author-action`, P1, XL). Long-stalled security PR; blocked on author revision.
- **[#11805](https://github.com/zeroclaw-labs/zeroclaw/pull/11805) — Windows named-pipe server verification** (open since 2026-10-17, `needs-maintainer-review`, `risk:high`, XL). Explicitly stacked and awaiting rebase/review.
- **[#11921](https://github.com/zeroclaw-labs/zeroclaw/pull/11921) — Append-only session event history** (XL, all-topic flagged). Major architectural PR; its size and breadth will require sustained review.
- **[#12157](https://github.com/zeroclaw-labs/zeroclaw/pull/12157) — OIDC enrollment browser binding** (open since 2026-10-31, `risk:high`). Security-relevant OIDC hardening awaiting review.

**Health assessment:** The project exhibits strong security focus and fast triage, but the open PR queue (45) and several XL/stacked PRs with `needs-maintainer-review`/`needs-author-action` suggest review throughput is the key risk to v0.9.0 timing. Priorities for maintainers: (1) close out release-gated security PRs, (2) assign reviewers to #9746, #11805, #11921, and (3) file or link fix PRs for open P1 bug #9572.

---
*Data source: github.com/zeroclaw-labs/zeroclaw, snapshot 2026-11-05.*

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*