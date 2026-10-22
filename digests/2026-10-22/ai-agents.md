# OpenClaw Ecosystem Digest 2026-10-22

> Issues: 500 | PRs: 500 | Projects covered: 5 | Generated: 2026-10-21 23:58 UTC

- [OpenClaw](https://github.com/openclaw/openclaw)
- [Hermes Agent](https://github.com/nousresearch/hermes-agent)
- [IronClaw](https://github.com/nearai/ironclaw)
- [QwenPaw](https://github.com/agentscope-ai/QwenPaw)
- [ZeroClaw](https://github.com/zeroclaw-labs/zeroclaw)

---

## OpenClaw Deep Dive

# OpenClaw Project Digest — 2026-10-22

## 1. Today's Overview

OpenClaw remains a very high-throughput project: 500 issues and 500 PRs were touched in the last 24 hours, with roughly half closed/merged (234 issues closed, 230 PRs merged/closed) — a healthy close-to-open ratio indicating active triage rather than backlog accumulation. However, stability signals are mixed. The issue queue is dominated by **P0/P1 regressions with crash-loop, message-loss, and release-blocker tags** — particularly around Windows gateway startup, SQLite WAL growth, and the `prepared-model-catalog` worker memory leak — several of which have persisted for 3+ weeks. Release velocity is steady (v2026.10.10-beta.3) and the beta line is explicitly focused on Windows reliability, suggesting maintainers are treating Windows as the top platform risk. Overall activity assessment: **high volume, strong maintainer engagement, but a concentration of severe stability bugs with lengthy fix cycles** — project is in a "stabilization-over-features" phase.

## 2. Releases

**v2026.10.10-beta.3** (1 new release)

Highlights (per release notes):
- **Windows reliability**: restored fresh state initialization and Gateway startup.
- Hid SQLite helper windows during app updates.
- Forced Gateway reinstalls now tolerate launcher timestamp settling.
- Referenced PRs: #176194, #174969, #176174, #176945 (with related #176111, #174906).

Notes:
- No explicit breaking changes or migration steps were documented in the release summary.
- The release is a **beta**, and the emphasis on Windows indicates ongoing remediation of the startup/update failures reported in Issues #152992, #170928, and #179183.
- **Caveat**: Several open P0 Windows issues (e.g., #164854 "prepared model runtime publication timed out") may not yet be fully addressed by this release — verify against your specific failure mode before upgrading.

## 3. Project Progress

~230 PRs were merged/closed in the last 24h. Notable merged/closed work:

- **#179843 (CLOSED)** – `fix(ui): isolate MCP context removal feedback` — UI feedback isolation for MCP context removal ([PR #179843](https://github.com/openclaw/openclaw/pull/179843)).
- **#180046 (CLOSED)** – `improve(ui): reorder sidebar groups by dragging their header` — UX improvement for sidebar group ordering ([PR #180046](https://github.com/openclaw/openclaw/pull/180046)).
- **#177675 (CLOSED)** – `fix(cli): reject conflicting positional and --channel in channels add` — prevents credential misrouting when both a positional channel and `--channel` are supplied ([PR #177675](https://github.com/openclaw/openclaw/pull/177675)).
- **#180043 (CLOSED)** – test-race fix for video gallery deferred players ([PR #180043](https://github.com/openclaw/openclaw/pull/180043)).
- Issue #179183 (update failure: gateway-recovery-verification, 2026.10.5) and #178000 (session-state races causing cross-provider fallback) were **closed** — positive signs on update reliability and fallback classification ([Issue #179183](https://github.com/openclaw/openclaw/issues/179183), [Issue #178000](https://github.com/openclaw/openclaw/issues/178000)).

**In-flight feature direction**: a large `steipete`-authored PR wave (Solid 2 UI migration — #179854, #179512, #179544, #179900, #179848, #179714, #179548, #180040, #180049, #180050, #180059) plus test-cleanup batches (#180028, #180044, #180052) indicates sustained investment in **UI reactivity correctness and test hygiene**. Security-relevant: **#177855** (`restrict Gateway-local terminals and automation host execution`) and **#179701** (cached chat mount perf, security-boundary flagged) are open and worth watching ([PR #177855](https://github.com/openclaw/openclaw/pull/177855)).

## 4. Community Hot Topics

| Rank | Item | Comments | Signal |
|---|---|---|---|
| 1 | [#143524](https://github.com/openclaw/openclaw/issues/143524) — SQLite WAL grows to 1.4–2.8 GB, blocks gateway startup (Windows) | 133 | **P0, release-blocker, gold shrimp** — most-discussed issue by far; multi-week unresolved |
| 2 | [#159662](https://github.com/openclaw/openclaw/issues/159662) — `prepared-model-catalog.worker.js` memory leak ~4–5 GB/h | 24 | P0 crash-loop, provider-agnostic |
| 3 | [#157989](https://github.com/openclaw/openclaw/issues/157989) — Plugin source capture rewrites 1.1–6.5 GB per command/startup (SSD wear) | 22 | P1 platinum hermit |
| 4 | [#159596](https://github.com/openclaw/openclaw/issues/159596) — Gateway memory sawtooth, ~200 critical memory-pressure events/day | 15 | P0, 2 👍 |
| 5 | [#144291](https://github.com/openclaw/openclaw/issues/144291) — Config hot-reload aborts in-flight agent turns | 14 | P1 diamond lobster, needs product decision |
| 6 | [#172091](https://github.com/openclaw/openclaw/issues/172091) — Worker SQLite transaction stays open forever behind crossed admission wait | 14 | P2, linked to WAL checkpoint blocking |

**Underlying needs analysis**: The top cluster is almost entirely **persistence/runtime resource management** — SQLite WAL hygiene, worker thread memory, plugin capture I/O. Users are running multi-agent, long-lived single-gateway deployments and hitting **unbounded resource growth** that manifests as crash-loops and startup failures. The volume of comments on #143524 (133) strongly suggests a broad cohort of Windows/multi-agent operators affected, and the lack of a merged fix is a reputational risk. Several top threads carry `clawsweeper:needs-maintainer-review` and `no-new-fix-pr`, indicating the community is engaged but maintainer bandwidth is the bottleneck.

## 5. Bugs & Stability

**P0 / release-blockers (open):**
- [#143524](https://github.com/openclaw/openclaw/issues/143524) — SQLite WAL unbounded growth blocks gateway startup (Windows). **No fix PR linked.** ⚠️
- [#159662](https://github.com/openclaw/openclaw/issues/159662) — `prepared-model-catalog.worker.js` 4–5 GB/h leak. **No fix PR linked.**
- [#159596](https://github.com/openclaw/openclaw/issues/159596) — Gateway memory sawtooth, ~200 critical events/day. **No fix PR linked.**
- [#162211](https://github.com/openclaw/openclaw/issues/162211) — Startup blocks event loop 40–200s; health monitor misreads stall as disconnect → restart loop. **No fix PR linked.**
- [#164854](https://github.com/openclaw/openclaw/issues/164854) — Windows 2026.9.8: prepared model runtime publication timed out, all models unavailable, slow startup. **No fix PR linked.**
- [#158912](https://github.com/openclaw/openclaw/issues/158912) — MEMORY.md no longer injected at bootstrap (2026.9.6); docs still claim it is. **No fix PR linked.**
- [#152804](https://github.com/openclaw/openclaw/issues/152804) — minimax-portal loses model catalog after 2026.9.5 upgrade. `needs-info` + `manual-only`.

**P1 (open):**
- [#157989](https://github.com/openclaw/openclaw/issues/157989) — Plugin source capture SSD wear (no reuse, bundled native binaries). **No fix PR linked.**
- [#144291](https://github.com/openclaw/openclaw/issues/144291) — Config hot-reload aborts every in-flight agent turn. Needs product + security review.
- [#125764](https://github.com/openclaw/openclaw/issues/125764) — Telegram: network-failed outbound sends dead-lettered after one attempt; replies silently lost. **Fix-shape clear**, no PR yet.
- [#172837](https://github.com/openclaw/openclaw/issues/172837) — Codex nativeSubagentAssignments never removed after completion give-up; re-pinned/re-sent on every parent thread.
- [#156895](https://github.com/openclaw/openclaw/issues/156895) — Agent-created automation jobs fail closed in ~20ms ("Scheduled account... unavailable").
- [#170928](https://github.com/openclaw/openclaw/issues/170928) — Windows 2026.10.2: gateway 7–9 min to ready, intermittently unresponsive.
- [#156925](https://github.com/openclaw/openclaw/issues/156925) — Webchat renders assistant replies twice on tool-call turns.
- [#156883](https://github.com/openclaw/openclaw/issues/156883) — Stale plugin tool handles in live sessions after lifecycle pass.
- [#126906](https://github.com/openclaw/openclaw/issues/126906) — Denying `write` tool silently disables memory persistence; agent reports success anyway (data-loss).
- [#152659](https://github.com/openclaw/openclaw/issues/152659) — Session creation fails with misleading "writer claim changed" masking auth-resolution failure.

**Fix PRs in flight:**
- [PR #180042](https://github.com/openclaw/openclaw/pull/180042) — stop model fallback after **local runtime faults** (addresses #179979 — cross-provider fallback masking local errors, related to the #178000 class).
- [PR #180047](https://github.com/openclaw/openclaw/pull/180047) — retain SQLite wait allowance through update finalization (directly targets update failures when a competing SQLite writer outlasts the 5s wait — relevant to #143524 family).
- [PR #180037](https://github.com/openclaw/openclaw/pull/180037) — preserve terminal result when relay output stalls (process reliability).
- [PR #180050](https://github.com/openclaw/openclaw/pull/180050) — `agents_wait` returns a tool input error instead of crashing on missing/string `ids` (turns HTTP 500 into a usable error).

**Closed today**: #169586 (Windows LINE Doctor EEXIST), #160770 (media-persistence-detection startup migration 100% CPU), #160470 (boot-md hook silent failure), #153179 (update failure runtime-verification), #179183, #178000.

**Severity summary**: The WAL/memory/startup cluster (4 separate P0s) shares a common theme — **long-lived single-gateway resource lifecycle under multi-agent load** — and currently lacks merged fixes. This is the single most significant stability gap.

## 6. Feature Requests & Roadmap Signals

- **Token overhead reduction** — [#14785](https://github.com/openclaw/openclaw/issues/14785): reduce tool schema token overhead (~3,500 tok/session). High leverage, long-standing (Feb 2026), still open; likely candidate for a 2026.11/12 optimization pass given cost sensitivity.
- **Personal identity for mobile** — [#162164](https://github.com/openclaw/openclaw/issues/162164): opt-in personal identity on iOS/macOS while preserving Shared owner. **Needs product decision + security review** — likely slated for post-2026.10.
- **Stable plugin SDK for skill workflows** — [#81913](https://github.com/openclaw/openclaw/issues/81913): expose `openclaw/plugin-sdk/*` contracts for installed-skill workflows. **Linked PR open** + security review — plausible near-term landing.
- **Bounded launch contract for Swarm `agents.run`** — [#156632](https://github.com/openclaw/openclaw/issues/156632): `boundedLaunch` with isolation/summary boundary. **Implementation PR #155442 open** — good odds for next minor.
- **Gateway-local terminal / host-execution restrictions** — [PR #177855](https://github.com/openclaw/openclaw/pull/177855): security boundary hardening for operator privilege. Strong roadmap signal for secure-by-default configuration in an upcoming release.
- **Plugin argument dictionary validation** — [PR #180041](https://github.com/openclaw/openclaw/pull/180041): warn when providers close tool dictionaries. Compatibility-flagged; likely next beta.
- **Workboard / Control UI polish** (multiple open PRs from `steipete` and `roboclaw-bot`): expect continued UI reactivity and interaction fixes in the 2026.10.x/beta line.

**Prediction**: The next versions will prioritize (a) Windows startup/update reliability, (b) SQLite/resource lifecycle hardening, and (c) security boundary work (#177855, SDK contracts). Feature additions like token-overhead reduction and mobile identity are lower-probability for the immediate next release.

## 7. User Feedback Summary

**Pain points (dissatisfaction drivers):**
1. **Windows is the weakest platform** — startup hangs (7–9 min), update failures (mkdir ENOENT with `?` in path, candidate snapshot, global-install-failed), and gateway-recovery-verification loops appear repeatedly. Users are explicitly documenting reproducible failures.
2. **Unbounded resource growth in long-running deployments** — SQLite WAL to 2.8 GB, 4–5 GB/h worker leaks, SSD wear from plugin capture. Users are doing manual `wal_checkpoint(TRUNCATE)` and offline recovery — a sign of operational burden.
3. **Silent data/message loss** — Telegram dead-lettering after one attempt, MEMORY.md not injected, memory persistence silently disabled by `tools.deny`, pasted text lost on later turns (#179676). "It reports success anyway" is a recurring theme and erodes trust.
4. **Misleading error messages** — session-creation failures masked as writer-claim conflicts; local faults misclassified as provider errors triggering model fallback (#178000/#180042).
5. **Ecosystem uncertainty** — QQ channel handoff stalled ([#150743](https://github.com/openclaw/openclaw/issues/150743)); users requesting long-term support clarity for a first-party plugin that ended at 2026.7.1.

**Positive signals**: Rapid single-day turnarounds on many CLI/UI fixes (#177675, #179843, #180046), responsive maintainer engagement on high-comment threads, and an active `clawsweeper` triage system (rating tags, `needs-info`, `source-repro`) that is keeping the queue organized. Users are providing detailed repros and bisects (e.g., #159662 cold-reboot + provider bisect) — a sign of a technically engaged, cooperative community.

## 8. Backlog Watch

Items needing maintainer attention (long-open, important, low movement):

| Item | Age | Why it matters |
|---|---|---|
| [#143524](https://github.com/openclaw/openclaw/issues/143524) SQLite WAL unbounded growth | ~6 weeks (created 2026-09-09) | P0 release-blocker, 133 comments, **no fix PR** — highest-risk backlog item |
| [#14785](https://github.com/openclaw/openclaw/issues/14785) Tool schema token overhead | ~8 months (2026-02-12) | Cost-relevant, `needs-product-decision`, recurring request |
| [#81913](https://github.com/openclaw/openclaw/issues/81913) Stable plugin SDK surface | ~5 months (2026-05-14) | Ecosystem-blocking for plugin authors; linked PR open but needs maintainer review |
| [#125764](https://github.com/openclaw/openclaw/issues/125764) Telegram single-attempt dead-lettering | ~2 months | `fix-shape-clear` — a fix PR is look-ready |
| [#159662](https://github.com/openclaw/openclaw/issues/159662) worker memory leak | ~4 weeks | P0, provider-agnostic, `silver shellfish` |
| [#150743](https://github.com/openclaw/openclaw/issues/150743) QQ channel sustainability | ~5 weeks | Ecosystem support-model question, unanswered long-term plan |
| [#152804](https://github.com/openclaw/openclaw/issues/152804) minimax-portal catalog loss | ~5 weeks | P0 regression, stuck on `needs-info`/`manual-only` — may need maintainer chase |
| [#144291](https://github.com/openclaw/openclaw/issues/144291) Hot-reload aborts in-flight turns | ~6 weeks | `needs-product-decision` + `needs-security-review` — decision blocker, not technical |

**Backlog risk assessment**: The oldest severe item (#143524) and the plugin SDK request (#81913) are the two with the highest strategic cost — one blocks Windows/multi-agent reliability, the other blocks third-party ecosystem growth. Several P0s are marked `stale` or `needs-info`, which may indicate maintainers are waiting on reporters, but the volume (4 P0s in the WAL/memory cluster) suggests a **systemic fix** rather than per-issue patches would be the highest-leverage investment.

---
*Digest generated from GitHub API snapshot (500 issues, 500 PRs, 1 release) for 2026-10-22. Comment counts and labels reflect the top-50-by-engagement slice; full queue may contain additional items.*

---

## Cross-Ecosystem Comparison

# Cross-Project Comparison Report — Personal AI Assistant / Agent Open-Source Ecosystem
**Snapshot Date:** 2026-10-22 | **Projects:** OpenClaw, Hermes Agent, IronClaw, QwenPaw, ZeroClaw

---

## 1. Ecosystem Overview

The personal AI assistant / agent open-source ecosystem has entered a **stabilization-over-features phase**, with the most active projects shifting from capability expansion to reliability, isolation, and operator-grade hardening. Traffic across all five projects is dominated by **resource lifecycle bugs, session/state integrity, and security-boundary work** rather than new feature velocity — a sign that the field's lead implementations are hitting production-scale demands (multi-agent, long-lived gateways, multiplexed profiles). A second signal is the **convergence on gateway-centric architectures**: OpenClaw, Hermes, and ZeroClaw all now route local sessions through a single gateway with explicit session-handoff, pairing, and principal-scoping primitives. Meanwhile, IronClaw sits visibly apart — low activity and long-stalled PRs suggest the sovereign/on-chain-agent niche is under-maintained relative to its peers. Community feedback across the ecosystem is unusually mature: detailed repros, severity labels, and bisects indicate professional operator cohorts rather than casual users.

---

## 2. Activity Comparison

| Project | Issues (touched 24h) | PRs (touched 24h) | Merged/Closed | Releases (24h) | Activity Tier | Health Score* |
|---|---|---|---|---|---|---|
| **OpenClaw** | 500 (234 closed) | 500 (230 merged/closed) | ~230 PRs / 234 issues | 1 (v2026.10.10-beta.3) | **Extreme throughput** | **6.5 / 10** — high volume, 4 unresolved P0s |
| **Hermes Agent** | 50 (48 open) | 50 (39 open, 11 closed) | 11 PRs / 1 tracker issue | 2 (v0.22.3, v0.22.4) | **High velocity** | **7 / 10** — fast iteration, post-refactor regression surface |
| **QwenPaw** | 13 (6 closed, 7 open) | 30 (some closed) | 11 PRs / 6 issues | 0 | **Active maintenance** | **7 / 10** — responsive triage, architectural async debt |
| **ZeroClaw** | 32 (30 open, 2 closed) | 50 (49 open, 1 merged) | 1 PR / 2 issues | 0 | **High intensity, review-bound** | **6 / 10** — strong labeling, 0-merge bottleneck, S0 memory bugs |
| **IronClaw** | 1 (1 open) | 2 (2 open) | 0 | 0 | **Stalled** | **3 / 10** — zero merge velocity, 199-day-old core issue |

\* *Health score is a qualitative composite of throughput, unresolved severity, and merge responsiveness (10 = excellent).*

**Key structural observation:** Only OpenClaw and Hermes converted meaningful traffic into merged code today. ZeroClaw and IronClaw are **review-bound** — inbound quality is high, but the integration pipeline is the constraint, not contributor supply.

---

## 3. OpenClaw's Position

**Advantages vs peers:**
- **Order-of-magnitude higher activity.** OpenClaw processes ~10× the issue/PR volume of Hermes and QwenPaw, and ~15× ZeroClaw — it is the ecosystem's de facto reference implementation and the gravitational center for community contribution.
- **Mature triage infrastructure.** The `clawsweeper` system (rating tags, `needs-info`, `source-repro`, `gold shrimp`/`platinum hermit` labels) is unmatched by peers and keeps a 1,000-item daily queue organized — a genuine operational moat.
- **Breadth of platform surface.** Windows, macOS, Docker, Microsoft Store, webchat, multiple channels (Telegram, LINE, QQ), and a plugin SDK — broader than any peer except arguably Hermes.

**Technical approach differences:**
- OpenClaw runs a **monolithic gateway** with a rich plugin/worker model (`prepared-model-catalog.worker.js`, plugin source capture, MCP context handling) and a **Solid 2 UI migration** in flight. This is heavier and more coupled than Hermes' newer unified-gateway runtime or QwenPaw's emerging PawApp control-plane, and that coupling is precisely where its P0 cluster (SQLite WAL growth, worker memory leaks, plugin I/O) originates.
- **Windows is treated as a first-class risk** — the beta line is explicitly Windows-focused, unlike peers who treat Windows as a secondary target.

**Community size comparison:**
OpenClaw's community is **substantially larger** — evidenced by 133 comments on a single P0 issue (#143524), hundreds of PRs/day, and a well-known `steipete`-authored UI PR wave. Hermes' 212-comment tracker (#134889) is impressive but singular; QwenPaw, ZeroClaw, and IronClaw show tens of comments at most. OpenClaw is the only project where a single issue can attract a **cohort of affected operators**.

**Counterweight:** OpenClaw's scale is also its risk — 4 concurrent P0s (WAL, worker memory, sawtooth memory, event-loop stall) with **no merged fixes** after 3–6 weeks is a reputational exposure no peer currently carries.

---

## 4. Shared Technical Focus Areas

Five cross-cutting requirements emerge across ≥3 projects:

| Theme | Projects | Specific Need |
|---|---|---|
| **Resource lifecycle / unbounded growth** | **OpenClaw** (SQLite WAL 2.8 GB, 4–5 GB/h worker leak, SSD wear), **QwenPaw** (#8279 AnyIO thread limiter exhaustion), **ZeroClaw** (#11896 embedder hang/stall) | Bounded persistence & runtime memory under long-lived multi-agent load; systemic fix, not per-issue patches |
| **Session/state integrity & recovery** | **OpenClaw** (#178000 cross-provider fallback, session-state races), **Hermes** (#142731 permanent 409 on `admission_conflict`, #142647 session-id classification), **ZeroClaw** (#11898 durable RPC session store, #11899 stale gateway post-reload) | Deterministic session handoff, recovery from admission conflicts, durable stores across reloads |
| **Isolation & principal scoping** | **ZeroClaw** (S0: #9647 knowledge graph, #11198 delegated memory scope, #11912 recall bypass), **Hermes** (#142798 profile inherits host env), **OpenClaw** (#177855 gateway-local terminal restriction, plugin SDK contracts) | Per-agent/per-tenant attribution, credential and environment boundaries, secure-by-default config |
| **Silent failures → observability** | **Hermes** (#84207 zero feedback on interrupt, #142789 phantom "compacting…"), **OpenClaw** (#126906 silent memory disable, #125764 Telegram dead-letter, #158912 MEMORY.md not injected), **QwenPaw** (#8252 silent `CancelledError`, #8350 healthz hang) | "Know what happened" — explicit terminal states, cancellation cause/initiator tracing, fail-loud semantics |
| **Provider compatibility & cost predictability** | **Hermes** (#137334 Anthropic key misclassification, #50132 dropped `max_tokens`), **OpenClaw** (#152804 minimax catalog loss, #14785 token overhead ~3,500 tok/session), **ZeroClaw** (#10779 429 backoff, #11894 quota retry), **QwenPaw** (#8298 video content parts, #6973 Bailian) | Predictable spend, correct auth classification, fail-fast on quota exhaustion |
| **Windows / cross-platform gaps** | **OpenClaw** (7–9 min startup, ENOENT updates), **Hermes** (#134855 `/C:/...` paths, #134850 ACL probes), **QwenPaw** (#6807 plugin generation) | Parity with macOS/Linux — currently the weakest platform across all projects |

---

## 5. Differentiation Analysis

| Dimension | **OpenClaw** | **Hermes Agent** | **QwenPaw** | **ZeroClaw** | **IronClaw** |
|---|---|---|---|---|---|
| **Feature focus** | Broad platform surface, plugin SDK, UI reactivity | Unified-gateway runtime, seal/unseal handoff, billing metrics | PawApp control-plane, voice, ReMe compaction | Gateway identity/security, A2A protocol crate, isolation | On-chain sovereign agents, NEAR contract interop |
| **Target users** | Multi-agent operators, plugin authors, Windows enterprise | Production multi-agent "Bot Groups", dual-platform teams | Console/self-hosters, provider-flexible users | Security-conscious multi-agent/team deployments | On-chain / sovereign-agent builders |
| **Architecture** | Monolithic gateway + worker model + Solid 2 UI | Unified gateway (one gateway owns every local session) | Hub/Container + plugin-subprocess extraction | Gateway + pairing/roster + A2A crate boundary | HTTP-API-only surface, contract-source-gated |
| **Security posture** | Boundary hardening in flight (#177855); still permissive | Write-time guardrails needed (#141346 `osascript` data loss) | Channel subprocess isolation (#8187) targets blocking | **Most security-forward** — S0 isolation work, enrollment, TLS | Decentralization-centric, but HTTP-dependent today |
| **Release cadence** | Beta line, steady | Two patches in one day (rollup of ~620 PRs) | None today; 2.2.2 line | Staging v0.8.7 / v0.9.0 | None |

**Distinct positioning:**
- **OpenClaw** is the *breadth play* — maximum surface, maximum community, maximum bug concentration.
- **Hermes** is the *architectural reset* — post-refactor, it is consolidating around a clean single-gateway contract with first-class handoff (`/seal`, `/unseal`).
- **QwenPaw** is the *extensibility play* — PawApp SDK redesign (#7874) signals a strategic pivot toward a durable app/task contract.
- **ZeroClaw** is the *hardening play* — the only project where the S0 bugs are explicitly about **isolation guarantees**, not capability.
- **IronClaw** is the *outlier* — it markets sovereignty but ships an HTTP-only surface, and its core request (#2077) has been open ~199 days.

---

## 6. Community Momentum & Maturity

**Activity tiers:**

1. **Extreme throughput** — **OpenClaw**: ~1,000 items/day, ~50% close-to-open ratio, mature triage. Rapidly iterating but **stabilizing** (stabilization-over-features explicitly stated).
2. **High velocity** — **Hermes Agent**: fast patch cadence, post-refactor regression cleanup. **Rapidly iterating and consolidating.**
3. **High intensity, review-bound** — **ZeroClaw**: 49 open PRs, 30 open issues, 0 merges. **Iterating in breadth, stalling in depth** — the integration queue is the bottleneck.
4. **Active maintenance** — **QwenPaw**: steady triage, mix of closures and new bugs, architectural async debt surfacing. **Stabilizing.**
5. **Stalled** — **IronClaw**: near-zero throughput, XS PRs open for months, core strategic request unanswered. **At risk of contributor attrition.**

**Maturity signals:**
- **Most mature communities** (by discourse quality): ZeroClaw and OpenClaw — severity labels, RFCs, detailed repros, bisects.
- **Most mature release hygiene**: Hermes (curated notes framework, though deferred) and OpenClaw (documented beta line).
- **Least mature**: IronClaw — inbound quality is fine, but the *responsiveness* lag undermines the "sovereign" positioning.

---

## 7. Trend Signals

**Industry trends extractable from community feedback — for AI agent developers:**

1. **Single-gateway ownership is becoming the reference architecture.** OpenClaw, Hermes, and ZeroClaw all converge on one gateway owning local sessions, with explicit session-handoff primitives (`/seal`/`/unseal` in Hermes, pairing/roster in ZeroClaw). *Value:* design session lifecycle around a single durable owner from day one; retrofitting it causes the regression cluster Hermes is now cleaning up.

2. **Unbounded resource growth is the #1 stability threat at scale.** SQLite WAL growth (OpenClaw), worker-heap leaks, AnyIO thread exhaustion (QwenPaw), embedder stalls (ZeroClaw). *Value:* instrument WAL checkpointing, worker memory, and thread-pool ceilings before production; assume long-lived multi-agent load, not request/response.

3. **Isolation is the next frontier of trust.** Per-agent memory attribution (ZeroClaw S0), profile-environment inheritance (Hermes), gateway-local terminal restriction (OpenClaw), channel subprocess isolation (QwenPaw). *Value:* treat principal scoping as a core primitive, not an afterthought — cross-agent leakage is a trust-eroding class of bug.

4. **"Silent failure" is the most-cited frustration across the ecosystem.** Users value *knowing what happened* as much as success (Hermes #84207, OpenClaw #126906, QwenPaw #8252). *Value:* adopt fail-loud semantics, explicit terminal states, and cancellation-cause tracing as first-class requirements.

5. **Cost predictability is a growing adoption blocker.** Token overhead (~3,500 tok/session, OpenClaw #14785), dropped `max_tokens` causing runaway summaries (Hermes #50132), quota-retry waste (ZeroClaw #10779/#11894). *Value:* surface per-turn token/billing metrics (Hermes runtime footer PR #140658) and enforce provider-side budget contracts.

6. **Windows remains the weakest platform ecosystem-wide.** Every project carries Windows-tagged startup, path, or ACL bugs. *Value:* for cross-platform agent tools, Windows reliability is still a differentiator and a reputational risk.

7. **Security is shifting from *feature* to *boundary* to *write-time guardrail*.** From OpenClaw's operator-privilege restrictions, to ZeroClaw's pairing/TLS work, to Hermes' field report of `osascript`-driven **unrecoverable data loss** (#141346) and ZeroClaw's memory-isolation S0s — the community is converging on **write-time, fail-closed guardrails** rather than post-hoc analysis.

8. **Async/interoperability primitives (A2A, task IDs) are the next scaling blocker.** Hermes' A2A task-id request (#91687) and ZeroClaw's `zeroclaw-a2a` RFC (#11254) both target escaping synchronous 120–300s timeouts for cross-machine agent orchestration. *Value:* design long-running agent jobs around async task handles, not blocking calls.

9. **Maintainer bandwidth, not contributor supply, is the ecosystem's binding constraint.** ZeroClaw (49 open PRs, 0 merges), IronClaw (XS PR stale 143 days). *Value:* for projects seeking adopters, review throughput and triage automation (OpenClaw's `clawsweeper` model) are competitive advantages as much as code.

**Bottom line for decision-makers:** The ecosystem is maturing past capability races. The projects that will win the next 12 months are those that solve **bounded resource lifecycles, explicit isolation, and silent-failure elimination** — not those that add the most features. OpenClaw leads on scale but carries the largest unresolved P0 debt; Hermes and ZeroClaw are the most architecturally disciplined; QwenPaw is the best-positioned extensibility play; IronClaw needs a maintainer-responsiveness intervention to remain viable.

---

## Peer Project Reports

<details>
<summary><strong>Hermes Agent</strong> — <a href="https://github.com/nousresearch/hermes-agent">nousresearch/hermes-agent</a></summary>

# Hermes Agent — Project Digest
**Date:** 2026-10-22
**Repository:** [github.com/NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent)

---

## 1. Today's Overview

Hermes Agent is in a high-velocity stabilization phase following the landmark merge of `#106742` (`feat/unified-gateway-runtime`) on October 14, which made a single gateway own every local session. Activity is intense: **50 issues** and **50 PRs** updated in the last 24 hours, with **48 active issues** and **39 open PRs** — a sign of an engaged community filing detailed, well-tagged reports. Two patch releases (**v0.22.3, v0.22.4**) shipped on October 21, largely rolling up a massive ~620 PR backlog, but the release notes indicate full curated notes are deferred to v0.23.0. Overall health is **mixed-to-positive**: rapid iteration and strong reporter engagement, but a clustering of P0–P2 bugs around gateway session state, message delivery, and cross-platform compatibility suggests the unified-gateway refactor introduced meaningful regression surface.

---

## 2. Releases

### v0.22.4 — *Patch* (2026-10-21)
> Desktop stops showing suggestion pills above the composer, plus small plugin and dashboard fixes for the CLI/installer, the Microsoft Store app, Docker, and Hermes Cloud.

**Changes:** Minor UX cleanup (desktop composer suggestions removed); plugin and dashboard fixes.
**Breaking changes:** None noted.
**Migration notes:** None required — routine patch.

### v0.22.3 — *Rollup Patch* (2026-10-21)
> Rolls up **~620 PRs** merged since v0.22.2 into a stable release across CLI/installer, Microsoft Store app, Docker, and Hermes Cloud.

**Changes:** Large cumulative batch; full curated notes deferred to v0.23.0.
**Breaking changes:** Not enumerated here; users on `v0.22.2` should review the v0.23.0 notes when published given the scope of the rollup.
**Migration notes:** Given the ~620-PR scope and the concurrent unified-gateway changes, this is effectively a **minor-version-sized patch** — caution is warranted for production deployments, especially on Windows and multiplexed-profile setups.

**Takeaway:** The two-release cadence signals maintainers are pushing stabilization fast, but the deferral of curated notes to v0.23.0 means users have limited visibility into behavioral changes between tags.

---

## 3. Project Progress

**Merged/Closed PRs (11 of 50):** Today's closed PRs skew heavily toward **dependency hardening** — a security cleanup day rather than feature work:

- [#142783](https://github.com/NousResearch/hermes-agent/pull/142783) — **Security:** bump `simple-git` 3.36.0 → 4.0.2, fixing **critical** GHSA-x6jw-m9v5-85vh, GHSA-g4wm-2vf7-vfgr (command execution via config includes), GHSA-858h-whjf-mvg5, plus argv-parser 2.0.1.
- [#142781](https://github.com/NousResearch/hermes-agent/pull/142781) — **Security:** bump `katex` 0.16.47 → 0.18.4 (prototype-pollution `trust` bypass, GHSA-238p-pmpm-9mq7).
- [#142199](https://github.com/NousResearch/hermes-agent/pull/142199) — bump `sanitize-html` 2.17.7 → 2.18.1.
- [#140069](https://github.com/NousResearch/hermes-agent/pull/140069), [#140067](https://github.com/NousResearch/hermes-agent/pull/140067), [#140068](https://github.com/NousResearch/hermes-agent/pull/140068) — KaTeX and simple-git desktop dependency bumps.
- [#142609](https://github.com/NousResearch/hermes-agent/pull/142609) — **Fix:** `hermes update` on a damaged `.git` no longer leaves paused gateways stopped on Windows, and names the repair.
- [#134889](https://github.com/NousResearch/hermes-agent/issues/134889) **CLOSED** — the 212-comment tracking issue for one-gateway-owns-every-session post-merge fixes.

**Feature advancement:** The unified gateway runtime (#106742) is now past its tracking-issue close. Next-wave gateway features are queued as open PRs: `#142790` (`/seal` / `/unseal` session-handoff slash commands), `#140658` (runtime footer with usage/billing metrics), and `#142667` (windowed repeat-call guardrail in the tool-call controller).

---

## 4. Community Hot Topics

| Rank | Item | Type | Comments | Signal |
|------|------|------|----------|--------|
| 1 | [#134889](https://github.com/NousResearch/hermes-agent/issues/134889) | Issue (CLOSED) | **212** | ⭐ Massive engagement — the unified-gateway tracking thread is the single most-watched item in the project. Closed today. |
| 2 | [#141346](https://github.com/NousResearch/hermes-agent/issues/141346) | Issue (OPEN, security) | 25 | ⭐⭐ High emotion — agent-driven `osascript` caused **unrecoverable data loss** (deleted a user's unsaved PowerPoint). |
| 3 | [#135039](https://github.com/NousResearch/hermes-agent/issues/135039) | Issue (OPEN, feature) | 13 | Memory budget/acceptance pipeline for `MEMORY.md`/`USER.md`. |
| 4 | [#84207](https://github.com/NousResearch/hermes-agent/issues/84207) | Issue (OPEN, P2) | 9 | Interrupted turns deliver zero user feedback — silent death. |
| 5 | [#91687](https://github.com/NousResearch/hermes-agent/issues/91687) | Issue (OPEN, feature) | 8 | A2A long jobs should return a task id. |

**Underlying needs analysis:** The community is consolidating around **trust in autonomous actions**. #141346 (data loss via auto-approved `osascript`) and #135039 (unbounded memory writes) both reflect a desire for *write-time guardrails* rather than post-hoc fixes. Meanwhile #134889's 212 comments show the unified-gateway migration is the project's gravitational center — every downstream surface (Desktop, TUI, gateway, profiles) is being re-examined against it. The A2A task-id issue (#91687) signals growing multi-machine, multi-agent deployments where synchronous 300s timeouts are the primary scaling blocker.

---

## 5. Bugs & Stability

Ranked by severity. **Many fix PRs exist** — several P2s already have open PRs today.

### 🔴 P0
- [#134889](https://github.com/NousResearch/hermes-agent/issues/134889) **CLOSED** — *Tracking: one gateway owns every local session.* 212 comments; spans CLI, gateway, Desktop, sessions, profiles, Windows, TUI, message delivery. **Closed today** after post-merge fixes; residual work may still surface via linked issues.

### 🟠 P1
- [#137334](https://github.com/NousResearch/hermes-agent/issues/137334) — **Anthropic `sk-ant-usr-*` Console keys misclassified as OAuth tokens** → 400 "credit balance is too low", billed as Claude Code. Ties to security-boundary & billing. **Duplicates:** [#135088](https://github.com/NousResearch/hermes-agent/issues/135088), [#134897](https://github.com/NousResearch/hermes-agent/issues/134897). *No fix PR visible — high-impact auth/billing bug.*

### 🟡 P2 (open, with several fix PRs in flight)
- [#142731](https://github.com/NousResearch/hermes-agent/issues/142731) — Session paused on `admission_conflict` **never recovers**, every later turn returns 409. Session-state risk.
- [#141973](https://github.com/NousResearch/hermes-agent/issues/141973) — Mid-turn sends unreliable: queued instead of steered, "sent" without reaching harness, Steer button no-ops silently. *(Related PR: #142793.)*
- [#139825](https://github.com/NousResearch/hermes-agent/issues/139825) — Routed satellite cron delivery fails when satellite has a Desktop `local` adapter ("platform 'discord' not configured").
- [#137334](https://github.com/NousResearch/hermes-agent/issues/137334) — see P1.
- [#50132](https://github.com/NousResearch/hermes-agent/issues/50132) — `_build_call_kwargs` silently drops `max_tokens` for OpenAI-compatible endpoints → runaway compression summaries on local backends. *(Long-standing since June, 2 👍.)*
- [#142741](https://github.com/NousResearch/hermes-agent/issues/142741) — macOS `launchd` bootstrap retry never kickstarts a registered-but-not-running gateway job → restart fails. **Today's issue.**
- [#142738](https://github.com/NousResearch/hermes-agent/issues/142738) — Desktop heartbeat falsely expires a healthy connection due to renderer timer delay. **Today's issue.**
- [#142647](https://github.com/NousResearch/hermes-agent/issues/142647) — Unregistered `hermes-review-*` session-id shape breaks salvage classification. **Today's issue.**
- [#135088](https://github.com/NousResearch/hermes-agent/issues/135088) / [#134897](https://github.com/NousResearch/hermes-agent/issues/134897) — Anthropic key misclassification dups.
- [#119741](https://github.com/NousResearch/hermes-agent/issues/119741) — Auto re-run after unreachable model never fires for cron-expression jobs.
- [#134856](https://github.com/NousResearch/hermes-agent/issues/134856) — Desktop Bot profile model picker fails when provider loads before its catalog. *(Fix PR: [#142793](https://github.com/NousResearch/hermes-agent/pull/142793).)*
- [#134855](https://github.com/NousResearch/hermes-agent/issues/134855) — Windows MEDIA download fails for `/C:/...` paths.
- [#134659](https://github.com/NousResearch/hermes-agent/issues/134659) — MiniMax-M3.1 live on API but missing from `/v1/models` and curated lists. *(Fix PR: [#142791](https://github.com/NousResearch/hermes-agent/pull/142791) prices M3.1-Flash.)*

### 🟢 P3 (notable)
- [#141346](https://github.com/NousResearch/hermes-agent/issues/141346) — **Security / data loss:** smart-approval auto-approved `osascript` that closed a user's unsaved PowerPoint and deleted its export. *Unrecoverable data loss — high emotional weight, arguably P1 by impact.*
- [#142330](https://github.com/NousResearch/hermes-agent/issues/142330) — `RuntimeStoreError stale_epoch`: `begin_runtime_epoch()` bumps epoch without asserting profile ownership lock. **Today's issue.**
- [#142798](https://github.com/NousResearch/hermes-agent/issues/142798) — Multiplexed gateway: served profile's terminal commands inherit host gateway's environment. Security/area-profiles.
- [#142740](https://github.com/NousResearch/hermes-agent/issues/142740) — Addressed-member nudge fires after the address was already answered. *(Same production Bot Groups deployment as #142732.)*
- [#124700](https://github.com/NousResearch/hermes-agent/issues/124700) — Lifecycle guard over-matches, blocks unrelated LaunchAgent maintenance.
- [#135036](https://github.com/NousResearch/hermes-agent/issues/135036) — Launcher unprotected existence probe raises `PermissionError` on ACL-denied interpreter (Windows).
- [#134850](https://github.com/NousResearch/hermes-agent/issues/134850) — Malformed plugin approval decisions must fail closed.
- [#137289](https://github.com/NousResearch/hermes-agent/issues/137289) — Google hosted Gmail/Calendar MCP servers cannot be authorised (issuer trailing slash).
- [#142789](https://github.com/NousResearch/hermes-agent/issues/142789) — TUI shows "compacting…" when no compaction runs. **Today's issue.**
- [#96619](https://github.com/NousResearch/hermes-agent/issues/96619) — Plugin registration can't opt out of Tool Search deferral (`never_defer`).
- [#142214](https://github.com/NousResearch/hermes-agent/issues/142214) — Epic: non-user interrupt → bounded model recovery (never silent; `user_stop` terminal).

**Stability read:** The P0 tracking issue closing is a *relief*, but the P1 Anthropic auth misclassification (#137334 + 2 dups) is the **highest-value unfixed bug** — it breaks billing and access for a specific, growing class of API keys. The #141346 data-loss report, despite P3 tagging, deserves a severity review given the irreversibility.

---

## 6. Feature Requests & Roadmap Signals

**Active features requested (ranked by likely-next-version probability):**

1. **Memory write-time budget & acceptance pipeline** — [#135039](https://github.com/NousResearch/hermes-agent/issues/135039) (13 comments, `needs-decision`). MEMORY.md/USER.md are injected every turn; govern what goes in. **Likely near-term** — cost/latency framing appeals to maintainers.
2. **`/seal` and `/unseal` session-handoff slash commands** — [PR #142790](https://github.com/NousResearch/hermes-agent/pull/142790) open. Makes "sealing a fat chat" a first-class operation instead of an improvised 3-step ritual. **Candidate for v0.23.0.**
3. **A2A long jobs return a task id** — [#91687](https://github.com/NousResearch/hermes-agent/issues/91687). Async task handles to escape the 120s/300s timeouts. **Post-v0.23.0** given it touches the gateway.
4. **Runtime footer with usage/billing metrics** — [PR #140658](https://github.com/NousResearch/hermes-agent/pull/140658). Token counts, cache reads, thinking tokens, USD estimates. **Likely near-term.**
5. **Fenced migration of Desktop Group Chats into gateway-hosted rooms** — [#139961](https://github.com/NousResearch/hermes-agent/issues/139961). Direct follow-up to #106742; existing Desktop Group Chats aren't yet migrated. **Near-term, gateway-dependent.**
6. **Plugin `never_defer` for Tool Search** — [#96619](https://github.com/NousResearch/hermes-agent/issues/96619). Control-plane tools get disabled by the very fault they answer. **Needs-decision.**
7. **Windowed repeat-call guardrail** — [PR #142667](https://github.com/NousResearch/hermes-agent/pull/142667). Detects a call repeating one result between other calls. **Likely near-term (small, isolated).**
8. **Bounded model recovery on non-user interrupt** — [#142214](https://github.com/NousResearch/hermes-agent/issues/142214) (epic). **Longer horizon.**

**Predicted v0.23.0 focus:** the curated notes release, seal/unseal, runtime footer metrics, the repeat-call guardrail, and remaining unified-gateway migration items (Group Chat migration, satellite cron delivery).

---

## 7. User Feedback Summary

**Pain points (verbatim themes):**
- **Silent failures are the #1 frustration.** "Interrupted turn (exit 130) delivers zero user feedback — silent death until user re-pings" ([#84207](https://github.com/NousResearch/hermes-agent/issues/84207)); "the Steer button can no-op with no feedback" ([#141973](https://github.com/NousResearch/hermes-agent/issues/141973)); "TUI shows 'compacting…' on turns where no compaction runs" ([#142789](https://github.com/NousResearch/hermes-agent/issues/142789)). Users consistently value *knowing what happened* as much as the operation succeeding.
- **Trust in autonomy is eroding at the edges.** [#141346](https://github.com/NousResearch/hermes-agent/issues/141346) is a field report of irrecoverable data loss from smart-approval auto-approving `osascript` that manipulated the user's live PowerPoint. The user explicitly frames it as unapproved destructive action on personal files.
- **Cost/latency surprise.** [#50132](https://github.com/NousResearch/hermes-agent/issues/50132) — runaway compression summaries on local backends because `max_tokens` is silently dropped. Combined with [#135039](https://github.com/NousResearch/hermes-agent/issues/135039)'s "every future turn" cost framing, users want **predictable spend**.
- **Config drift under multiplexed profiles.** [#142798](https://github.com/NousResearch/hermes-agent/issues/142798) — a served profile's terminal commands inherit whatever environment started the host gateway. Security-adjacent surprise.

**Use cases in evidence:**
- **Production multi-agent Bot Groups** — same deployment behind [#142732](https://github.com/NousResearch/hermes-agent/issues/142732) and [#142740](https://github.com/NousResearch/hermes-agent/issues/142740); users running `@tars` + `@dev` daily.
- **Cross-machine A2A orchestration** ([#91687](https://github.com/NousResearch/hermes-agent/issues/91687)).
- **Windows + macOS dual-platform teams** — many Windows-tagged bugs ([#134855](https://github.com/NousResearch/hermes-agent/issues/134855), [#134850](https://github.com/NousResearch/hermes-agent/issues/134850), [#135036](https://github.com/NousResearch/hermes-agent/issues/135036)).
- **Local-model users** ([#50132](https://github.com/NousResearch/hermes-agent/issues/50132), [#135039](https://github.com/NousResearch

</details>

<details>
<summary><strong>IronClaw</strong> — <a href="https://github.com/nearai/ironclaw">nearai/ironclaw</a></summary>

# IronClaw Project Digest — 2026-10-22

## 1. Today's Overview

IronClaw is in a low-activity maintenance phase: no releases, no merged or closed PRs in the last 24 hours, and only three items updated across the entire repository (1 issue, 2 PRs). All activity is inbound—one open issue and two open PRs received updates—indicating the community is still filing requests and contributing patches, but maintainer-side throughput is effectively zero for the day. The absence of merges means no code has landed despite two PRs sitting open. The issue queue shows a long-tail pattern: the single updated issue (#2077) has been open since April 2026, over six months, which is a warning sign for responsiveness on infrastructure-level requests. Overall project health is stable but stalled; the primary risk is contributor attrition if open PRs and aging issues continue to see no movement.

## 2. Releases

No new releases in the last 24 hours. Nothing to report on changes, breaking changes, or migration notes.

## 3. Project Progress

No PRs were merged or closed today. The two active PRs remain open:

- **PR #8147** — "Allow explicit trusted enrollment of an exact loopback MCP endpoint" (opened 2026-10-20, updated 2026-10-21) — [link](https://github.com/nearai/ironclaw/pull/8147). This targets a real architectural gap: hosted MCP bearer auth works via native credential accounts, but local MCP servers can't use that path because registration, manifest credentials, discovery, and network policy reject HTTP/IP-literal endpoints. The PR adds an explicit trusted enrollment path. Scope appears non-trivial despite no size label.
- **PR #4298** — "feat: use MiniMax-M3.1-Flash as default text model" (opened 2026-06-01, updated 2026-10-21) — [link](https://github.com/nearai/ironclaw/pull/4298). Labeled `size: XS, risk: low, scope: docs, contributor: regular`. It updates the built-in MiniMax default and provider description while preserving existing saved/explicit model selections.

Neither advanced to merge today. Notably, PR #4298 has been open for nearly five months despite being an XS, low-risk docs change—this suggests a review bottleneck rather than technical complexity.

## 4. Community Hot Topics

The most active item updated today is also the only issue updated:

- **Issue #2077** — "contract source for market near ai" (Author: HavenCTO, created 2026-04-06, updated 2026-10-21, 2 comments) — [link](https://github.com/nearai/ironclaw/issues/2077). The requester is building sovereign agents that hold their own keys and operate directly on-chain, and wants the contract source for `market.near.ai` published. Their underlying need is architectural: today the only interaction path is HTTP APIs, which forces agent dependency on IronClaw's infrastructure. This is a decentralization/self-sovereignty request, not a feature nicety—it's core to the project's stated "sovereign agents" value proposition.

Engagement is minimal (2 comments, 0 reactions), so while this is the "hot topic" by default, it signals low community volume rather than high interest. The lack of maintainer reaction to a request that directly aligns with the project's own positioning is worth flagging.

## 5. Bugs & Stability

No bugs, crashes, or regressions were reported or updated in the last 24 hours. No fix PRs exist because no defect reports are active. Stability signal is neutral-to-positive on this specific metric, but the absence of bug traffic combined with the absence of merges may simply reflect low overall activity rather than a clean codebase.

## 6. Feature Requests & Roadmap Signals

Two forward-looking signals today:

- **On-chain contract source publication** (Issue #2077) — a request to publish `market.near.ai` contract source so agents can interact directly on-chain with self-held keys. Given it aligns with IronClaw's sovereign-agent thesis and has sat open for ~6.5 months, it is a plausible candidate for a future "transparency/interop" milestone—but there is no maintainer commitment visible.
- **Local MCP endpoint enrollment** (PR #8147) — while framed as a PR, it effectively requests a feature: first-class support for local MCP servers via an explicit trusted loopback enrollment path. If merged, it expands deployment flexibility for developers running MCP servers locally.

Prediction: neither is likely to ship in the immediate next version given zero merge velocity; PR #8147 is the more likely of the two to land first because it is an already-authored patch.

## 7. User Feedback Summary

Real user pain points visible today:

- **Infrastructure dependency / lack of self-sovereignty** (HavenCTO, Issue #2077): "the agent is dependent on your infrastructure" — users building on-chain sovereign agents cannot fully own their stack because the market contract source is not published and HTTP APIs are the only interface. This is dissatisfaction rooted in a mismatch between IronClaw's sovereignty marketing and its current closed-surface reality.
- **Local development friction** (PR #8147): developers running local MCP servers hit policy rejections on HTTP/IP-literal endpoints, with no credential path available—a concrete developer-experience gap.
- **Model configuration drift** (PR #4298): a contributor felt the need to update MiniMax defaults, implying provider configuration was stale.

No positive satisfaction signals (kudos, thanks, reactions) appear in today's data. The tone of inbound feedback is constructive but requests remain unaddressed.

## 8. Backlog Watch

Two items need maintainer attention:

- **Issue #2077** (open ~199 days as of 2026-10-22) — [link](https://github.com/nearai/ironclaw/issues/2077). High strategic relevance, only 2 comments, no visible resolution. This is the single most important aging item because it concerns the project's core sovereign-agent promise. Recommend a maintainer response or a roadmap statement.
- **PR #4298** (open ~143 days, XS/low-risk/docs) — [link](https://github.com/nearai/ironclaw/pull/4298). A trivial, low-risk contribution stalled for nearly five months. This is a contributor-retention risk: if XS docs PRs cannot get merged, regular contributors will stop submitting.
- **PR #8147** (open 2 days) — [link](https://github.com/nearai/ironclaw/pull/8147). Too new to be backlog, but worth watching given the current zero-merge pattern; if it stalls past a week, it joins the backlog concern.

**Bottom line:** IronClaw shows healthy inbound community interest but a stalled merge/review pipeline. The project's most urgent health issue is not code quality—it is maintainer responsiveness on aging issues and low-risk PRs.

</details>

<details>
<summary><strong>QwenPaw</strong> — <a href="https://github.com/agentscope-ai/QwenPaw">agentscope-ai/QwenPaw</a></summary>

# QwenPaw Project Digest — 2026-10-22

## 1. Today's Overview

QwenPaw shows **high-velocity maintenance activity** with 13 issues and 30 PRs updated in the last 24 hours, though no new releases were cut. The issue mix is balanced between closures (6) and active bugs (7), indicating responsive triage but a steady inflow of regressions — several centered on the **2.2.2 release line** (Console drafts, cron jobs, Feishu channel blocking, Hub/Docker readiness). A notable cluster of PRs from contributor `cyruszhang` (#7874, #8363, #8364) advances the **PawApp SDK/control-plane redesign**, while `jinglinpeng` pushes security/classifier refactors (#8356, #8360) and realtime voice (#7785). Overall project health is **active and maintainer-engaged**, but recurring async/event-loop and configuration-persistence bugs suggest architectural debt in the runtime and Console layers.

## 2. Releases

No new releases in the last 24 hours. (Latest referenced in the field is the **v2.2.2** line, with v2.2.2 beta5 and 2.2.2b4 appearing in issue reports.)

## 3. Project Progress

**Merged/closed PRs today (11 total; notable):**
- **#8352 [CLOSED]** `feat(acp): add --agent-mode to ACP` — enables `qwenpaw acp --mode goal`, prefixing the first message of each new session with a mode slash command. ([link](https://github.com/agentscope-ai/QwenPaw/pull/8352))
- **#8327 [CLOSED]** `fix(acp): preserve task results after long tool calls` — prevents ACP server from exiting non-zero after a task is already solved; normalizes only confirmed failure classes. ([link](https://github.com/agentscope-ai/QwenPaw/pull/8327))
- **#8317 [CLOSED]** `fix(observability): trace cancel reason and initiator in stop cascade` — closes #8252 by logging cancellation cause/initiator across agent-to-agent cascades. ([link](https://github.com/agentscope-ai/QwenPaw/pull/8317))

**Issues closed today (6 total):**
- **#6973** — QwenPaw Creator + Aliyun Bailian token plan question (answered/closed). ([link](https://github.com/agentscope-ai/QwenPaw/issues/6973))
- **#6807** — Windows plugin: video/image generation and asset publishing broken. ([link](https://github.com/agentscope-ai/QwenPaw/issues/6807))
- **#8252** — Silent `CancelledError` in inter-agent sessions (now fixed via #8317). ([link](https://github.com/agentscope-ai/QwenPaw/issues/8252))
- **#8249** — Cron job modification bug (default time reset, `[object Object]` content). ([link](https://github.com/agentscope-ai/QwenPaw/issues/8249))
- **#8340** — Scheduled-task edit dialog cannot be closed after editing. ([link](https://github.com/agentscope-ai/QwenPaw/issues/8340))
- **#8225** — Zero-downtime hot reload cancels running cron jobs silently. ([link](https://github.com/agentscope-ai/QwenPaw/issues/8225))

**In-flight feature work (open PRs):**
- **#7874 [XXXL]** PawApp SDK & app control-plane redesign — shared scoped Host contract for durable work. ([link](https://github.com/agentscope-ai/QwenPaw/pull/7874))
- **#8363 / #8364 [XXXL/XL]** Data-app and File-browser PawApp reference integrations. ([#8363](https://github.com/agentscope-ai/QwenPaw/pull/8363), [#8364](https://github.com/agentscope-ai/QwenPaw/pull/8364))
- **#8347 [XXL]** ReMe 0.4.2 integration with opt-in JEV compaction for context pressure. ([link](https://github.com/agentscope-ai/QwenPaw/pull/8347))
- **#7785 [XXXL]** Realtime voice chat (speech input, playback, interruption). ([link](https://github.com/agentscope-ai/QwenPaw/pull/7785))
- **#8187 [XXXL]** Extract channels into plugins with subprocess isolation. ([link](https://github.com/agentscope-ai/QwenPaw/pull/8187))
- **#7565 [XXXL]** Clean plugin unload + rollback-safe hot reload. ([link](https://github.com/agentscope-ai/QwenPaw/pull/7565))

## 4. Community Hot Topics

| Rank | Item | Comments | Theme |
|------|------|----------|-------|
| 1 | [#6973](https://github.com/agentscope-ai/QwenPaw/issues/6973) — Bailian token plan support | 6 | Integration / provider config |
| 2 | [#8351](https://github.com/agentscope-ai/QwenPaw/issues/8351) — Composer draft per-agent vs per-conversation | 3 | Console UX correctness |
| 3 | [#6807](https://github.com/agentscope-ai/QwenPaw/issues/6807) — Windows plugin generation broken | 3 | Cross-platform plugin stability |
| 4 | [#8252](https://github.com/agentscope-ai/QwenPaw/issues/8252) — Silent inter-agent cancellation | 3 | Observability / multi-agent |
| 5 | [#8249](https://github.com/agentscope-ai/QwenPaw/issues/8249) — Cron modification bug | 3 | Scheduled tasks |

**Underlying needs:** Users are pushing on **provider flexibility** (Aliyun Bailian), **multi-agent reliability** (cancellation tracing), and **Console state correctness** (drafts, dialogs, cron editors). The concentration of comments on Console bugs signals that UI-state management is a recurring friction point. On the PR side, `cyruszhang`'s PawApp stack (#7874/#8363/#8364) is the most architecturally significant thread, though comment counts are not surfaced.

## 5. Bugs & Stability

Ranked by severity:

1. **[CRITICAL] #8350** — Feishu channel runs synchronous network calls on the main event loop; when network is down, the whole service hangs (`/api/healthz` times out, SIGTERM cannot exit). **No fix PR referenced yet.** ([link](https://github.com/agentscope-ai/QwenPaw/issues/8350))
2. **[HIGH] #8279** — Long-lived ReMe watchers exhaust AnyIO's default thread limiter, stalling synchronous HTTP endpoints. Reproduced on 2.2.2b4 and 2.2.2 (Docker). **No fix PR referenced.** ([link](https://github.com/agentscope-ai/QwenPaw/issues/8279))
3. **[HIGH] #8298** — `send_file_to_user` on an `.mp4` permanently wedges a session with `422 unknown variant video_url`. **Fix PR #8299 exists** (`retry without video when providers reject video input`). ([issue](https://github.com/agentscope-ai/QwenPaw/issues/8298) / [PR](https://github.com/agentscope-ai/QwenPaw/pull/8299))
4. **[HIGH] #8359** — Hub-in-container Docker runtime fails readiness probe hardcoded to `127.0.0.1` (Errno 111). **No fix PR referenced.** ([link](https://github.com/agentscope-ai/QwenPaw/issues/8359))
5. **[MEDIUM] #8361** — Automatic Memory Search repeats `memory_search` in one turn; after interception, normal replies fail to generate (finalize/recovery produce nothing). **No fix PR referenced.** ([link](https://github.com/agentscope-ai/QwenPaw/issues/8361))
6. **[MEDIUM] #8351** — Console composer draft keyed per-agent, not per-conversation; unsent text bleeds across conversations. **Fix PR #8362 exists** (`scope chat input drafts to the conversation`). ([issue](https://github.com/agentscope-ai/QwenPaw/issues/8351) / [PR](https://github.com/agentscope-ai/QwenPaw/pull/8362))
7. **[RESOLVED] #8225 / #8252 / #8249 / #8340** — Hot-reload cron cancellation, silent inter-agent cancel, cron editor bugs, and uncloseable edit dialog all closed today.

**Pattern:** Three of the top open bugs (#8350, #8279, #8359) are **event-loop / concurrency / container-networking** issues — an architectural theme worth maintainer attention beyond point fixes.

## 6. Feature Requests & Roadmap Signals

- **#8354 [enhancement]** — Support setting `QWENPAW_*` environment variables for Hub-managed runtimes (logging, uploads, telemetry, LLM retries) via Docker env config. Likely low-effort, high-value for self-hosters. ([link](https://github.com/agentscope-ai/QwenPaw/issues/8354))
- **Realtime voice chat (#7785)** — Large, long-running PR; if merged, could land in a **2.3.x** feature release. ([link](https://github.com/agentscope-ai/QwenPaw/pull/7785))
- **Channel plugin isolation (#8187)** — Subprocess isolation for channels addresses the Feishu blocking class of bugs structurally. ([link](https://github.com/agentscope-ai/QwenPaw/pull/8187))
- **PawApp SDK redesign (#7874 + #8363/#8364)** — Signals a strategic shift toward an **extensible app/task contract**, potentially the headline of the next major version. ([link](https://github.com/agentscope-ai/QwenPaw/pull/7874))
- **ReMe 0.4.2 / JEV compaction (#8347)** — Context-memory optimization likely to ship incrementally. ([link](https://github.com/agentscope-ai/QwenPaw/pull/8347))

**Prediction:** Next release likely bundles **ACB/ACP fixes (#8352, #8327), cancellation observability (#8317), video-retry (#8299), and Console draft fix (#8362)**, with voice and PawApp redesign held for a larger milestone.

## 7. User Feedback Summary

**Pain points:**
- **Configuration persistence is fragile** — cron edits reset times and show `[object Object]` (#8249); dialogs cannot close after edit (#8340); drafts leak across conversations (#8351). Users describe workarounds like F5 refreshes.
- **Async/blocking bugs cause full outages** — Feishu channel hangs the service (#8350); ReMe watchers stall HTTP endpoints (#8279); Hub-in-Docker fails readiness (#8359).
- **Provider compatibility friction** — video content parts break sessions (#8298); Bailian token plan support requested (#6973); thinking defaults mismatch wire controls (#8358).
- **Cross-platform gaps** — Windows plugin video/image generation unusable (#6807).

**Satisfaction signals:** Fast triage and closure (6 issues closed, 11 PRs merged/closed in 24h), and dedicated observability fixes (#8317) responding directly to user-reported cancellation ambiguity (#8252). Dissatisfaction is concentrated in **Console UX correctness** and **runtime concurrency robustness**.

## 8. Backlog Watch

Long-unanswered or high-impact items needing maintainer attention:

- **#7874** (created 2026-09-19, open ~33 days) — PawApp SDK redesign, XXXL. Foundational; blocks #8363/#8364. ([link](https://github.com/agentscope-ai/QwenPaw/pull/7874))
- **#7785** (created 2026-09-15, open ~37 days) — Realtime voice chat, XXXL. Long-running feature PR. ([link](https://github.com/agentscope-ai/QwenPaw/pull/7785))
- **#7565** (created 2026-09-04, open ~48 days) — Plugin clean unload / rollback-safe hot reload, XXXL. Directly relevant to the cron-cancellation and plugin-rebuild complaints. ([link](https://github.com/agentscope-ai/QwenPaw/pull/7565))
- **#8187** (created 2026-10-12, open 10 days) — Channel plugin extraction with subprocess isolation; would mitigate #8350-class blocking. ([link](https://github.com/agentscope-ai/QwenPaw/pull/8187))
- **#8279 / #8350 / #8359** — Open critical/high bugs without linked fix PRs; these are the highest-priority unaddressed stability risks. ([#8279](https://github.com/agentscope-ai/QwenPaw/issues/8279), [#8350](https://github.com/agentscope-ai/QwenPaw/issues/8350), [#8359](https://github.com/agentscope-ai/QwenPaw/issues/8359))

---
*Data source: github.com/agentscope-ai/QwenPaw — snapshot for 2026-10-22. Comment/reaction counts reflect the latest available figures.*

</details>

<details>
<summary><strong>ZeroClaw</strong> — <a href="https://github.com/zeroclaw-labs/zeroclaw">zeroclaw-labs/zeroclaw</a></summary>

# ZeroClaw Project Digest — 2026-10-22

## 1. Today's Overview

ZeroClaw remains in a high-intensity, pre-release hardening phase. Activity over the last 24 hours is very strong: **32 issues** were touched (30 still open/active, only 2 closed) and **50 PRs** were updated (49 open, just 1 merged/closed), with **no new releases**. The open-to-closed ratio is heavily skewed toward open work, indicating a large in-flight backlog rather than resolution throughput — consistent with an active `v0.9.0` milestone plus a `v0.8.7` patch cycle. The dominant themes this period are **security/isolation hardening** (per-agent memory scoping, pairing/enrollment authority, TLS/CA trust), **provider reliability** (429 handling, Retry-After, quota-exhaustion fail-fast), and **runtime/gateway robustness** (daemon reload races, session store, RPC durability). Notably, no PR merged today, so most visible progress is review-stage rather than landed.

## 2. Releases

**None.** No new releases in the last 24 hours, and the "Latest Releases" set is empty. No breaking changes or migration notes to report. Release-tagged items (`release:v0.8.7`, `release:v0.9.0`) are accumulating in the tracker/backlog, suggesting the next cut is still being staged.

## 3. Project Progress

Merged/closed activity was minimal today:

- **1 PR merged/closed** (unspecified in the top-20 sample; no high-comment merged PR surfaced).
- **2 issues closed**, including:
  - [#11783](https://github.com/zeroclaw-labs/zeroclaw/issues/11783) — *Can't create Alpine container image* (tooling/CI, S3 minor). Closed same-day it was last updated.
  - [#11923](https://github.com/zeroclaw-labs/zeroclaw/issues/11923) — *Update affected TLS certificate verifier and root packages* (dependency repair; RustSec advisory-db#3419 merged 06:20 UTC).

**Advanced but not yet merged** (high-signal open PRs):
- [#11174](https://github.com/zeroclaw-labs/zeroclaw/pull/11174) — capability-taking constructors for turn entry points (architecture, `v0.8.7`).
- [#11286](https://github.com/zeroclaw-labs/zeroclaw/pull/11286) — bind gateway pairing tokens to roster users (security/identity-access).
- [#11301](https://github.com/zeroclaw-labs/zeroclaw/pull/11301) — share durable committed-rename recovery across CLI/gateway/RPC (P1).
- [#11862](https://github.com/zeroclaw-labs/zeroclaw/pull/11862) — optional Telegram rich messages.
- [#11939](https://github.com/zeroclaw-labs/zeroclaw/pull/11939) — email channel quoting (`quote_original`, off by default).

Net: the project is **review-bound**, not merge-bound, this cycle.

## 4. Community Hot Topics

Most active threads by comment count:

1. [#7432](https://github.com/zeroclaw-labs/zeroclaw/issues/7432) — **[Tracker] Runtime, dashboard sign-in and gateway delivery** (12 comments, `p2`, `risk:high`, `release:v0.9.0`). The master roadmap tracker for runtime/gateway delivery under RFC #5574. Underlying need: **coherent sequencing and acceptance evidence** for the v0.9.0 gateway sign-in surface.
2. [#11254](https://github.com/zeroclaw-labs/zeroclaw/issues/11254) — **RFC: A2A protocol crate (`zeroclaw-a2a`)** (11 comments, `risk:high`). Cross-cutting refactor to unify A2A wire model, outbound client (#9106), and inbound discovery (#7763/#8274). Underlying need: **agent-to-agent interoperability as a first-class crate boundary**.
3. [#10999](https://github.com/zeroclaw-labs/zeroclaw/issues/10999) — **Publish/prove Discord plugin installation from a release binary** (6 comments, `status:blocked`). Real Discord inbound/outbound verified on published v0.8.6 archive (macOS arm64). Underlying need: **verifiable plugin install from shipped artifacts**, not source builds.
4. [#9647](https://github.com/zeroclaw-labs/zeroclaw/issues/9647) — **Knowledge graph has no per-agent attribution** (5 comments, `p1`, `S0`). Shared global graph allows cross-agent read/mutate. Underlying need: **tenant/principal isolation in memory**.
5. [#11198](https://github.com/zeroclaw-labs/zeroclaw/issues/11198) — **Delegated memory tools lose principal scope** (5 comments, `p0`, `S0`). Underlying need: **scope propagation through delegation chains**.

**Signal:** the most-discussed work clusters around **security boundaries and protocol architecture**, not cosmetic features — a mature-project discussion pattern.

## 5. Bugs & Stability

Ranked by severity (S0 highest):

| Severity | Issue | Summary |
|---|---|---|
| **S0 / P1** | [#9647](https://github.com/zeroclaw-labs/zeroclaw/issues/9647) | Knowledge graph lacks per-agent attribution — any agent can read/mutate another's knowledge. |
| **S0 / P0** | [#11198](https://github.com/zeroclaw-labs/zeroclaw/issues/11198) | Delegated memory tools lose principal scope, letting a child agent reach the owner's private plane. |
| **S0** | [#11932](https://github.com/zeroclaw-labs/zeroclaw/issues/11932) | Container CA bundles still trust distrusted emSign chains (updating the Rust verifier alone is insufficient). |
| **S1** | [#11866](https://github.com/zeroclaw-labs/zeroclaw/issues/11866) | Loop detector executes blocked repeats and loses partial task closeout. |
| **S2** | [#11894](https://github.com/zeroclaw-labs/zeroclaw/issues/11894) | Exhausted Codex seat retried on every call until stated reset. |
| **S2** | [#11896](https://github.com/zeroclaw-labs/zeroclaw/issues/11896) | Memory recall returns nothing on embedder failure and hangs on stall (hybrid search). |
| **S3** | [#11917](https://github.com/zeroclaw-labs/zeroclaw/issues/11917) | Web chat receives no cron results/pushed messages until first reply. |
| **S3** | [#11904](https://github.com/zeroclaw-labs/zeroclaw/issues/11904) | Two connections opening a new cron DB together refuse one immediately. |
| **S3** | [#11916](https://github.com/zeroclaw-labs/zeroclaw/issues/11916) | Quiet `NO_REPLY` cron results still appear in open web chats. |
| **S2/S3** | [#11898](https://github.com/zeroclaw-labs/zeroclaw/issues/11898), [#11899](https://github.com/zeroclaw-labs/zeroclaw/issues/11899), [#11902](https://github.com/zeroclaw-labs/zeroclaw/issues/11902) | Daemon first-start missing RPC session store; stopped gateway keeps serving accepted connections after reload; valid OIDC token refused during concurrent JWKS fetch. |

Also flagged today: [#11771](https://github.com/zeroclaw-labs/zeroclaw/issues/11771) (bootstrap cap mismatch 20k vs 6k), [#11908](https://github.com/zeroclaw-labs/zeroclaw/issues/11908) (system prompt budget unenforced), [#11909](https://github.com/zeroclaw-labs/zeroclaw/issues/11909) (channel interruptions lose completed tool results), [#11912](https://github.com/zeroclaw-labs/zeroclaw/issues/11912) (recall bypasses per-agent scoping), [#10779](https://github.com/zeroclaw-labs/zeroclaw/issues/10779) (429 sub-second backoff).

**Fix PRs exist** for adjacent areas — e.g. [#11940](https://github.com/zeroclaw-labs/zeroclaw/pull/11940) (enrollment on canonical pairing guard), [#11301](https://github.com/zeroclaw-labs/zeroclaw/pull/11301) (rename recovery), [#11931](https://github.com/zeroclaw-labs/zeroclaw/pull/11931) (webhook long-running timeout) — but **no direct fix PRs are linked for the S0 memory-isolation cluster (#9647, #11198, #11912)**, which is the most concerning stability gap.

## 6. Feature Requests & Roadmap Signals

High-probability near-term (already have PRs or RFC acceptance):

- **A2A protocol crate** ([#11254](https://github.com/zeroclaw-labs/zeroclaw/issues/11254), RFC accepted, `risk:high`) — likely lands in a `v0.9.x` architecture push.
- **Gateway pairing bound to roster users** ([#11286](https://github.com/zeroclaw-labs/zeroclaw/pull/11286)) and **longer synchronous webhook turns** ([#11930](https://github.com/zeroclaw-labs/zeroclaw/issues/11930) / PR [#11931](https://github.com/zeroclaw-labs/zeroclaw/pull/11931)) — both directly serve the `v0.9.0` gateway roadmap.
- **Discord plugin from release binary** ([#10999](https://github.com/zeroclaw-labs/zeroclaw/issues/10999)) — blocked but trending toward done.

Emerging requests (early signals):

- [#11890](https://github.com/zeroclaw-labs/zeroclaw/issues/11890) — durability-labeled consolidation with a user quote (keep transient updates out of Core).
- [#11892](https://github.com/zeroclaw-labs/zeroclaw/issues/11892) — configurable embed prefix for instruction-tuned embedding models.
- [#11919](https://github.com/zeroclaw-labs/zeroclaw/issues/11919) — web chat toggle to keep the Thinking box collapsed.
- [#8803](https://github.com/zeroclaw-labs/zeroclaw/issues/8803) — collapse completed turn steps in dashboard chat (still `status:icebox`).
- [#11938](https://github.com/zeroclaw-labs/zeroclaw/issues/11938) / PR [#11939](https://github.com/zeroclaw-labs/zeroclaw/pull/11939) — email quoting.

**Prediction:** Next release emphasizes **gateway identity/security + provider reliability + web/chat UX polish**; memory-durability and embedding-prefix work likely lands in `v0.9.0` follow-ups.

## 7. User Feedback Summary

- **Pain point — memory isolation is the loudest theme.** Multiple independent reporters (metalmon, Audacity88, RO-mix) describe cross-agent knowledge leakage and lost principal scope ([#9647](https://github.com/zeroclaw-labs/zeroclaw/issues/9647), [#11198](https://github.com/zeroclaw-labs/zeroclaw/issues/11198), [#11912](https://github.com/zeroclaw-labs/zeroclaw/issues/11912)). This is a trust-eroding class of bug for multi-agent/team deployments.
- **Pain point — provider rate-limit UX.** Developers complain that quota-exhausted 429s are retried with sub-second backoff instead of failing fast ([#10779](https://github.com/zeroclaw-labs/zeroclaw/issues/10779), [#11768](https://github.com/zeroclaw-labs/zeroclaw/issues/11768), [#11894](https://github.com/zeroclaw-labs/zeroclaw/issues/11894)) — wasted spend and confusing errors.
- **Pain point — daemon/reload flakiness.** A cluster of JordanTheJet reports (first-start session store, stale gateway after reload, OIDC JWKS race, cron DB open race) indicates **operator-facing reliability friction** ([#11898](https://github.com/zeroclaw-labs/zeroclaw/issues/11898), [#11899](https://github.com/zeroclaw-labs/zeroclaw/issues/11899), [#11902](https://github.com/zeroclaw-labs/zeroclaw/issues/11902), [#11904](https://github.com/zeroclaw-labs/zeroclaw/issues/11904)).
- **Positive signal:** Discord delivery on a published v0.8.6 archive was verified end-to-end ([#10999](https://github.com/zeroclaw-labs/zeroclaw/issues/10999)) — release artifact trust is improving.
- **Satisfaction/dissatisfaction:** professional, security-focused discourse (detailed repros, severity labels). Dissatisfaction concentrates on **isolation guarantees**, not core agent capability.

## 8. Backlog Watch

Long-unanswered or high-importance items needing maintainer attention:

- [#7432](https://github.com/zeroclaw-labs/zeroclaw/issues/7432) — v0.9.0 runtime/gateway tracker, open since 2026-06-09; needs sequencing/acceptance ownership (`status:accepted`).
- [#9647](https://github.com/zeroclaw-labs/zeroclaw/issues/9647) — S0 memory attribution bug open since 2026-08-01; **no linked fix PR** after ~11 weeks.
- [#11254](https://github.com/zeroclaw-labs/zeroclaw/issues/11254) — A2A RFC since 2026-09-29; decision needed on crate boundary.
- [#10999](https://github.com/zeroclaw-labs/zeroclaw/issues/10999) — Discord plugin proof, open since 2026-09-20, still `status:blocked`.
- PRs awaiting author/maintainer action: [#11174](https://github.com/zeroclaw-labs/zeroclaw/pull/11174), [#11286](https://github.com/zeroclaw-labs/zeroclaw/pull/11286), [#11301](https://github.com/zeroclaw-labs/zeroclaw/pull/11301), [#11307](https://github.com/zeroclaw-labs/zeroclaw/pull/11307) — all `needs-author-action` or `needs-maintainer-review`, several open since late September/early October.
- [#8803](https://github.com/zeroclaw-labs/zeroclaw/issues/8803) — chat step-collapse feature in `status:icebox` since 2026-07-07.

---

**Health assessment:** Strong contributor engagement and disciplined labeling, but today's **0 merges / 49 open PRs / 30 open issues** reveals an integration bottleneck and a growing review queue. The S0 memory-isolation cluster (#9647/#11198/#11912) is the highest-risk unresolved theme and warrants explicit maintainer prioritization before the `v0.9.0` cut.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*