# OpenClaw Ecosystem Digest 2026-10-29

> Issues: 500 | PRs: 500 | Projects covered: 5 | Generated: 2026-10-29 00:47 UTC

- [OpenClaw](https://github.com/openclaw/openclaw)
- [Hermes Agent](https://github.com/nousresearch/hermes-agent)
- [IronClaw](https://github.com/nearai/ironclaw)
- [QwenPaw](https://github.com/agentscope-ai/QwenPaw)
- [ZeroClaw](https://github.com/zeroclaw-labs/zeroclaw)

---

## OpenClaw Deep Dive

# OpenClaw Project Digest — 2026-10-29

## 1. Today's Overview

OpenClaw shows **very high sustained activity** with 500 issues and 500 PRs updated in the last 24 hours, but a concerning open-to-close ratio: 400 issues remain active versus 100 closed, and 283 PRs are open versus 217 merged/closed. **No new releases** shipped today, continuing a stretch without a tagged release despite a large volume of merged work on `main`. The project is clearly in a **stabilization crunch** — a cluster of P0 crash-loop and startup-blocking regressions (largely around Gateway event-loop stalls, SQLite state handling, and Windows reliability) dominate the most-commented issues. Maintainer throughput is real but is being outpaced by incoming high-severity reports, many of which now carry `clawsweeper:no-new-fix-pr` labels indicating acknowledged bugs still awaiting a fix.

## 2. Releases

**No new releases today.** The latest shipped versions referenced in active issues are 2026.10.10-beta.x (Windows), with several reports noting fixes merged to `main` that are **not yet in any tagged release** (e.g., Issue #141474 references recovery commit `e02ae3ecb66`, "not in a tagged release yet"). This gap between merged fixes and releases is a recurring theme in user frustration.

## 3. Project Progress

217 PRs were merged/closed in the last 24h. Notable activity:

- **Shutdown/restart redesign follow-ups**: PR [#187134](https://github.com/openclaw/openclaw/pull/187134) repairs CI regressions left by #187090; PR [#187120](https://github.com/openclaw/openclaw/pull/187120) fixes red cron routing tests.
- **Control UI performance**: PR [#186512](https://github.com/openclaw/openclaw/pull/186512) restores complete cached transcript rows (fixes layout jank measured at 58px thread-height shifts).
- **Channel fixes**: Telegram duplicate-transcript suppression ([#183190](https://github.com/openclaw/openclaw/pull/183190)), Slack transport-authority handoff ([#186346](https://github.com/openclaw/openclaw/pull/186346)).
- **Agent/provider work**: multiple Claude-CLI fixes ([#187116](https://github.com/openclaw/openclaw/pull/187116), [#187117](https://github.com/openclaw/openclaw/pull/187117), [#187118](https://github.com/openclaw/openclaw/pull/187118)); new Particle provider ([#187135](https://github.com/openclaw/openclaw/pull/187135)).
- **Merged/closed fixes**: Issue [#127229](https://github.com/openclaw/openclaw/issues/127229) (Telegram false tombstoning) closed; Issue [#178000](https://github.com/openclaw/openclaw/issues/178000) (session-state race → fallback) closed; Issue [#163042](https://github.com/openclaw/openclaw/issues/163042) (WebChat dropping pre-tool text) closed.

## 4. Community Hot Topics

| Item | Comments | Signal |
|---|---|---|
| [#160959](https://github.com/openclaw/openclaw/issues/160959) Gateway blocks minutes on large plugin capture (2026.9.6 regression) | 63 | P0 crash-loop, diamonds; maintainer review needed |
| [#183786](https://github.com/openclaw/openclaw/issues/183786) Windows beta upgrade stalls querying stopped Gateway PID | 47 | Closed; Windows upgrade pain |
| [#164294](https://github.com/openclaw/openclaw/issues/164294) WAL auto-checkpoint never completes | 36 | Persistent SQLite contention |
| [#159662](https://github.com/openclaw/openclaw/issues/159662) `prepared-model-catalog.worker.js` 4–5 GB/h leak | 27 | P0 memory leak, provider-agnostic |
| [#170956](https://github.com/openclaw/openclaw/issues/170956) Windows slow startup + schtasks permission errors | 25 | Windows reliability cluster |

**Underlying needs**: The community is most engaged around **reliability regressions introduced by recent releases** — specifically Gateway event-loop blocking, unbounded memory growth, and SQLite state coordination failures. There is strong demand for **release discipline** (fixes merged but untagged), **better Windows support**, and **diagnostics** (multiple issues note "no diagnostics, no CLI, no recovery").

## 5. Bugs & Stability

Ranked by severity:

**P0 / Crash-loop:**
- [#160959](https://github.com/openclaw/openclaw/issues/160959) — Gateway blocks minutes on external plugin capture (2026.9.6 regression). No fix PR.
- [#159662](https://github.com/openclaw/openclaw/issues/159662) — 4–5 GB/h memory leak in model-catalog worker. No fix PR.
- [#162211](https://github.com/openclaw/openclaw/issues/162211) — Startup blocks event loop 40–200s → health monitor triggers restart loop. No fix PR.
- [#153426](https://github.com/openclaw/openclaw/issues/153426) — `MEMORY.md`/`USER.md` silently & permanently excluded from bootstrap injection. Needs security review.
- [#126821](https://github.com/openclaw/openclaw/issues/126821) — SQLite corruption recurs on pristine DBs within 15–24h (WSL2).

**P1 / Data loss / Session state:**
- [#126360](https://github.com/openclaw/openclaw/issues/126360) — `AgentSelectionRequiredError` log flood under explicit multi-agent ownership.
- [#166634](https://github.com/openclaw/openclaw/issues/166634) — Latency reclamance checkpoint failure leaves agent UNAVAILABLE.
- [#159094](https://github.com/openclaw/openclaw/issues/159094) — State-lifecycle lease ownership mismatch.
- [#126246](https://github.com/openclaw/openclaw/issues/126246) — Telegram outbound stuck in `send_attempt_started`, lost on restart.
- [#181459](https://github.com/openclaw/openclaw/issues/181459) — 3.5 GB agent DB → 4–6 min startup, agent UNAVAILABLE.

**Windows-specific cluster** (recurring theme): [#183786](https://github.com/openclaw/openclaw/issues/183786), [#185819](https://github.com/openclaw/openclaw/issues/185819), [#170956](https://github.com/openclaw/openclaw/issues/170956).

**Note**: A large share of top bugs carry `clawsweeper:no-new-fix-pr` — acknowledged but unfixed. Several closed issues today (#183786, #178000, #163042, #170335) suggest incremental progress.

## 6. Feature Requests & Roadmap Signals

- [#138366](https://github.com/openclaw/openclaw/issues/138366) — Let memory slot owner drive the Dreams page (dreaming provider capability).
- [#131457](https://github.com/openclaw/openclaw/issues/131457) — Progress streaming mode for Feishu/Lark.
- [#163739](https://github.com/openclaw/openclaw/issues/163739) — Configurable Ctrl+Shift+A archive shortcut.
- [#141295](https://github.com/openclaw/openclaw/issues/141295) — TTL/manual clear for interrupted pending inputs.
- [#129388](https://github.com/openclaw/openclaw/pull/129388) (PR, XL) — Context-pressure-aware continuation (`continue_work`/`continue_delegate`/`request_compaction`) — a substantial agent-capability feature.

**Prediction**: Given the maintenance load, near-term releases are likely to focus on **stability fixes over new features**. The continuation-tools PR (#129388) and multilingual channel streaming (#131457) are candidates for a future minor release, but the immediate roadmap signal is consolidation.

## 7. User Feedback Summary

**Pain points:**
- **Upgrade/restart fragility**, especially Windows — users describe "only after many retries" success and repeated PID queries.
- **Silent data exclusion** (memory roots, message loss) with no diagnostics or recovery path — high emotional weight (👍 on #153426).
- **Memory/resource exhaustion** on modest single-user installs (2.5 GB → 10 GB RSS).
- **Release lag**: users repeatedly note fixes on `main` are unavailable in tagged releases.
- **Duplicated/lost messages** across Telegram, Slack, WebChat.

**Satisfaction**: The 217 merged/closed PRs and closed issues today show maintainers are responsive, but the open/closed ratio (4:1 issues) and P0 backlog suggest users feel fixes arrive slower than regressions accumulate.

## 8. Backlog Watch

Long-open items needing maintainer attention:

- [#58289](https://github.com/openclaw/openclaw/issues/58289) — Non-main agent misses `models.json` → "Unknown model" (open since **2026-03-31**, 7 months).
- [#120385](https://github.com/openclaw/openclaw/issues/120385) — Code Mode tool catalog incomplete for cron/memory-flush (since Aug, still active).
- [#121232](https://github.com/openclaw/openclaw/issues/121232) — `memory-core` dreaming ranker/applier disagreement ("Ranked N, Promoted 0" forever).
- [#125313](https://github.com/openclaw/openclaw/issues/125313) — Control UI per-session fan-out needs batched RPC (closed today, but pattern recurs).
- [#150743](https://github.com/openclaw/openclaw/issues/150743) — QQ channel sustainability / support-plan clarification (since Sep).
- [#126874](https://github.com/openclaw/openclaw/issues/126874) — Windows CI covers only 0.60% of suite; skipped `checks-windows` counts as passing — a **process risk** underlying the Windows bug cluster.
- [#129388](https://github.com/openclaw/openclaw/pull/129388) — Major continuation feature PR open since Aug 25, large & security-sensitive; stalled.

**Overall health assessment**: High-velocity, high-engagement, but **stability debt is accumulating faster than it is being retired**. Resolving the untagged-fix gap and the Windows/CI coverage weakness would materially improve project health.

---

## Cross-Ecosystem Comparison

# Cross-Project Comparison Report — AI Agent / Personal AI Assistant Open-Source Ecosystem
**Date: 2026-10-29** | Projects analyzed: OpenClaw, Hermes Agent, IronClaw, QwenPaw, ZeroClaw

---

## 1. Ecosystem Overview

The personal AI assistant / agent open-source landscape in late 2026 is defined by a **post-consolidation stabilization crunch**. Projects that recently landed large architectural changes—unified gateways (Hermes Agent), multi-surface channel architectures (ZeroClaw), and plugin isolation models (QwenPaw)—are now absorbing regression debt faster than they retire it. **Reliability, not capability, is the current bottleneck**: silent data loss, "stuck forever" states, and untagged-but-merged fixes dominate user complaints across four of five projects. Meanwhile, a long tail of platform-specific pain (Windows in particular) and cross-project PR ports (cline, gemini-cli) signal growing ecosystem interoperability. The trend is clear: **agent frameworks are maturing from "can it do X?" to "can we trust it in production?"** — and the projects best positioned are those with disciplined release engineering, not the fastest feature velocity.

---

## 2. Activity Comparison

| Project | Issues (24h) | PRs (24h) | Open:Closed Issue Ratio | Releases (24h) | Health Score* | Phase |
|---|---|---|---|---|---|---|
| **OpenClaw** | 500 updated (400 open / 100 closed) | 500 updated (283 open / 217 merged) | **4:1** | None — long tag gap | 🟡 **Strained** | Stabilization crunch |
| **Hermes Agent** | 50 (48 open / 2 closed) | 50 (22 open / 28 merged) | **24:1** | None (v0.22.5 live) | 🟡 **Strained** | Post-merge debt |
| **IronClaw** | 1 (1 open) | 0 | 1:0 | None | 🟢 **Stable/quiet** | Low activity |
| **QwenPaw** | 23 (open majority) | 49 (29 open / 20 merged) | High (~3:1) | None (v2.3.0-beta.1 stalled) | 🟠 **Active but fragile** | Pre-release hardening |
| **ZeroClaw** | 50 (mostly open) | 30 (20 open / 10 merged) | High | None (v0.9.0 gated) | 🟡 **Release-gated** | Pre-release hardening |

\* Health score is a qualitative composite of open/closed ratio, P0/P1 backlog, release discipline, and responsiveness. 🟢 = healthy, 🟡 = active but carrying risk, 🟠 = actively unstable but iterating.

**Observations:**
- **OpenClaw is in a league of its own on volume** — 10× the issue/PR throughput of any peer, but its 4:1 open/closed ratio is the *best* of the strained projects, indicating it's at least keeping pace relatively.
- **Hermes Agent's 24:1 ratio is the most alarming** — 48 open issues against 2 closed, plus a just-closed 223-comment tracking thread explicitly handed off unresolved.
- **ZeroClaw and QwenPaw are release-gated**: both have v0.9.0 / v2.3.0-beta.1 blocked by unfixed P1/S1 items.
- **IronClaw is an outlier** — near-zero activity, no bugs, but also no momentum.

---

## 3. OpenClaw's Position

### Advantages vs. Peers
- **Scale of engagement**: 500 issues + 500 PRs updated in 24h is an order of magnitude beyond every peer. Its community is large enough to surface bugs, file detailed diagnostics, and validate fixes at a rate others simply cannot match.
- **Reference implementation status**: Described as the "core reference" — it effectively sets the patterns (Gateway/session/agent model) that Hermes, ZeroClaw, and QwenPaw are independently rediscovering via their own pain.
- **Broadest channel surface**: Telegram, Slack, WebChat, Feishu/Lark, QQ — with active correctness work on each.

### Technical Approach Differences
- **Gateway-centric event-loop model** — the source of both its power and its P0 regressions (#160959 event-loop blocking, #162211 40–200s startup stalls). Peers like ZeroClaw are still *building* this; OpenClaw is *debugging* it at scale.
- **Plugin capture architecture** (#160959) is a distinctive capability without a direct peer equivalent, but it's also the top crash-loop source.
- **Heavy SQLite state dependency** (WAL checkpointing, corruption across WSL2) — a shared weakness with ZeroClaw's session/state work, but more mature and more scarred.

### Community Size Comparison
| Project | Approx. engagement scale (24h) |
|---|---|
| **OpenClaw** | **~1,000 events** — 10× peers |
| Hermes Agent | ~100 events |
| ZeroClaw | ~80 events |
| QwenPaw | ~72 events |
| IronClaw | ~1 event |

**Assessment**: OpenClaw's advantage is *breadth and signal density*; its vulnerability is that **maintainer throughput is being outrun by incoming P0 reports**, and its **release lag** (fixes on `main` not in any tag) is the single most-cited user frustration. If it closes the untagged-fix gap, it consolidates a durable lead. If not, users may fork workflows onto peers.

---

## 4. Shared Technical Focus Areas

Five requirements recur across **three or more** projects — these are ecosystem-level signals, not project quirks:

| Cross-Project Need | OpenClaw | Hermes | ZeroClaw | QwenPaw | IronClaw |
|---|:---:|:---:|:---:|:---:|:---:|
| **Silent failure / no diagnostics** | ✅ #153426, #126821 | ✅ #145556, #143869 | ✅ #12055, #11233 | ✅ #8040, #7715 | — |
| **Context/history data loss & compaction bugs** | ✅ #159094 | ✅ #145556, #144546 | ✅ #11921 (fixing) | ✅ #8474, #8312 | — |
| **Windows / non-POSIX reliability** | ✅ cluster | ✅ #68128 | ✅ (Firejail/POSIX) | ✅ #8194, #8163, #8206 | — |
| **Cost / resource observability** | ✅ memory leaks #159662 | — | ✅ #11204, #11585 | — | — |
| **Durable autonomous/cron/Kanban state** | ✅ #126360 | ✅ #119070, #132732 | ✅ #11237 | — | — |
| **Provider registry / model discoverability** | ✅ #129388 (continuation) | ✅ #146277, #142648 | ✅ Obscurify #12085 | ✅ #8439 | ✅ #8161 |
| **Plugin lifecycle integrity** | ✅ #141474 | — | ✅ #10999, #11336+ | ✅ #8473, #8265 | — |

**Critical convergent pattern — "fixes are point-wise, not systematic":**
- QwenPaw's `importlib.invalidate_caches()` bug (#8265) reappeared at a new call site (#8473), blocking the beta.
- OpenClaw's Windows bug cluster persists while Windows CI covers only **0.60%** of the test suite (#126874) — skipped tests count as passing.
- ZeroClaw's Firejail failures (#11538/#11539) are duplicate-pattern P1s with zero fix PRs.

**The ecosystem's shared meta-need**: **systematic root-cause fixes + honest CI coverage**, not per-symptom patches.

---

## 5. Differentiation Analysis

| Dimension | OpenClaw | Hermes Agent | ZeroClaw | QwenPaw | IronClaw |
|---|---|---|---|---|---|
| **Primary focus** | Broad multi-channel reference platform | Unified cross-surface gateway (CLI/TUI/Desktop/webapp) | Sandboxed, security-forward runtime + channels | Memory/ReMe, context compression, Office skills | Minimal provider registry |
| **Target user** | Power users, self-hosters, contributors at scale | Multi-surface prosumers & co-debuggers | Security-conscious, sandboxed deployments | Long-session, CJK/multilingual, desktop | Provider-integration contributors |
| **Architecture signature** | Gateway event-loop + plugin capture + SQLite | Single shared gateway owning all local sessions | Firejail sandbox + MCP registry + channels-as-plugins | Plugin subprocess isolation + ReMe memory | Lightweight registry |
| **Distinctive feature** | Plugin capture; Dreams/memory slots | Continuation tools; free-model float; sibling-project ports | Goal Mode; append-only session history; shell-policy transparency | Auto-Dream/ReMe; reranker center; CJK coverage | Named-provider policy |
| **Maturity of gateway** | Scarred/production-tested | Newly consolidated, unstable | Partially built (#10346 triple-spawn RFC) | Gateway-adjacent | N/A |
| **Biggest weakness** | Release lag; P0 backlog | 24:1 issue ratio; post-merge regressions | v0.9.0 gate blocked by S1s | Recurring regressions; stalled beta | No momentum |

**Key architectural divergence**: 
- **Hermes and ZeroClaw** are converging on **centralized gateway ownership** (Hermes explicitly; ZeroClaw debating whether channels should share the heartbeat worker's MCP-caching pattern — #10346). OpenClaw already *has* this and is paying the stability tax.
- **QwenPaw** differentiates vertically on **memory/intelligence (ReMe, Auto-Dream, reranking)** rather than gateway breadth.
- **IronClaw** is functionally a **provider-inclusion governance** discussion (Obscurify.ai #8161) rather than an agent platform in active development.

---

## 6. Community Momentum & Maturity

### Activity Tiers

**Tier 1 — High-velocity, high-strain (massive community):**
- **OpenClaw** — 1,000 events/24h. Rapidly iterating on fixes but accumulating P0 debt. **Maturity: high codebase, strained operations.**

**Tier 2 — Active post-merge stabilization (mid-size community):**
- **Hermes Agent** — 100 events/24h, 28 PRs merged. **Rapidly iterating**, closing the unified-gateway epic but explicitly carrying unresolved regressions forward (#134889 → #143547). Responsive maintainers, disciplined hand-offs.
- **ZeroClaw** — ~80 events/24h, 10 PRs merged. **Release-gated**; clearing prompt-assembly and channel debt with velocity, but v0.9.0 S1 cluster unresolved.
- **QwenPaw** — ~72 events/24h, 20 PRs merged/closed. **Rapidly iterating** with same-day fix PRs, but regressions recur in the same subsystems.

**Tier 3 — Quiet / low momentum:**
- **IronClaw** — 1 event/24h. **Stabilizing (dormant)**; key signal is maintainer responsiveness on a single blocking contributor question.

### Maturity Curve Position
```
Earlier ←──────────────────────────────────────────→ Later
ZeroClaw   QwenPaw   Hermes Agent   OpenClaw        IronClaw
(building (pre-rel)  (post-merge)   (scale,         (quiet)
 gateway)            stabilization)  operational)
```

**Which are rapidly iterating vs. stabilizing:**
- **Rapidly iterating (feature + fix):** Hermes Agent, QwenPaw, ZeroClaw
- **Iterating on fixes over features:** OpenClaw (explicit roadmap signal: consolidation)
- **Stabilizing (no new work):** IronClaw

---

## 7. Trend Signals

Extracted from cross-project community feedback — **actionable for AI agent developers**:

1. **Reliability is the new feature.** Across all active projects, the top-commented items are *regressions*, not capabilities. Users pay for trust, not novelty. **Implication**: ship fewer features, harder — budget release engineering explicitly.

2. **Silent failure is the #1 trust-killer.** Recurring across OpenClaw (#153426 memory roots silently excluded), Hermes (#145556 110 messages lost silently), QwenPaw (#8040, #7715 misleading success logs), ZeroClaw (#12055 tool calls lost as "outcome-unknown"). **Implication**: observability and honest error surfaces matter more than graceful degradation. "Fail loud" is a competitive advantage.

3. **Context/memory management is the deepest unsolved subsystem.** Compaction dropping just-delivered replies (Hermes #144546), media-block resurrection (QwenPaw #8474), memory-root exclusion (OpenClaw #153426), session-history replay (ZeroClaw #11921). **Implication**: long-session state is where frameworks break; invest early in append-only/event-sourced session models.

4. **Durable autonomous state ("stuck forever" is unacceptable).** Cron/Kanban/subagent jobs park indefinitely without user-facing error (Hermes #119070, #143869; ZeroClaw #11237; OpenClaw #126360). **Implication**: autonomous agents need deterministic state machines with surfaced terminal failures.

5. **Windows is an underserved but material user base.** Every active project has a Windows cluster (OpenClaw's 0.60% CI coverage is the cautionary tale). **Implication**: CI coverage must reflect user distribution, or platform debt compounds.

6. **Release discipline is a differentiator.** Users on OpenClaw and QwenPaw explicitly note fixes merged to `main` but unreleased. **Implication**: tag cadence is a trust mechanism, not overhead.

7. **Ecosystem interoperability is emerging.** Cross-project ports (cline → Hermes #146273; gemini-cli → Hermes #146271) and shared provider-registry governance questions (IronClaw #8161, ZeroClaw #12085). **Implication**: convergence on CLI/model-catalog/provider conventions is underway; align early.

8. **Cost/resource governance is a credibility issue.** OpenClaw's 4–5 GB/h memory leak (#159662), ZeroClaw's broken OpenRouter cost accounting (#11204) and cost-limit-requires-restart (#11585). **Implication**: teams running agents with budgets need *accurate, actioned* governance — inaccurate cost telemetry is worse than none.

9. **Security-forward sandboxing has a hard edge.** ZeroClaw's Firejail P1 failures (#11538/#11539) fully block shell execution for sandbox users. **Implication**: security features that fail closed without recovery paths become availability incidents.

---

### Summary for Decision-Makers

- **If production reliability is the priority**: OpenClaw offers the largest community and most-tested patterns, but vet the untagged-fix gap and P0 backlog before committing.
- **If you need multi-surface gateway consolidation**: Hermes Agent is actively solving this in public — valuable co-development opportunity, but expect post-merge turbulence.
- **If sandboxing/security is paramount**: ZeroClaw's architecture fits, but wait for the v0.9.0 S1 cluster (Firejail, MCP poisoning, context-window fallback) to clear.
- **If memory/CJK/long-session intelligence matters**: QwenPaw differentiates, but verify the beta blocker (#8473) is resolved.
- **IronClaw**: not currently an active platform play; watch only for provider-governance precedent.

---

## Peer Project Reports

<details>
<summary><strong>Hermes Agent</strong> — <a href="https://github.com/nousresearch/hermes-agent">nousresearch/hermes-agent</a></summary>

# Hermes Agent — Project Digest
**Date: 2026-10-29** | Repository: [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent)

---

## 1. Today's Overview

Hermes Agent remains in a **high-velocity stabilization phase** following the October 14 merge of the unified gateway (#106742), the largest architectural change in recent memory. Activity is intense: **50 issues** and **50 PRs** updated in the last 24 hours, with only 2 issues closed against 48 still active — a signal that the project is accumulating post-merge debt faster than it is retiring it. The merged/closed PR count of 28 is healthy, but the open PR queue (22) reflects ongoing review pressure. No new release shipped today, consistent with a codebase absorbing regression fixes rather than cutting versions. The dominant theme across issues is **integration fragility between surfaces** (CLI, TUI, Desktop, webapp, gateways) now that they share a single gateway process — a predictable but costly consequence of the consolidation.

**Health assessment:** Actively maintained & responsive, but carrying significant post-merge instability. Maintainer attention is visibly concentrated on tracking issues for the two recent mega-merges (unified gateway, webapp).

---

## 2. Releases

**None.** No new releases were published in the last 24 hours. The latest referenced live version in the issue corpus is `v0.22.5` (with one report at `v0.22.5+154`). There is no migration guidance to surface today.

---

## 3. Project Progress

While no release landed, **28 PRs were merged or closed** in the window, and two long-running tracking threads reached closure:

- **#134889 [CLOSED]** — The post-merge tracking issue for the unified gateway (#106742) was closed after 223 comments (the highest-traffic item in the dataset). Its scope was formally handed off to the continuation thread #143547, indicating the original fix set is considered complete.
- **#99533 [CLOSED]** — Firecrawl `web_extract` swallowing target-site refusals (403/401/404/5xx) as empty successes was closed — a tooling correctness fix.

**PRs advancing (open, active):** A cluster of gateway-stability PRs from author `rungmc357` continues to mature (see §8), plus a noticeable spike in **ports from sibling projects**: `cline/cline#15314` (SSH jump-host timeouts, PR #146273) and `gemini-cli#29880` (`hermes model --list`, PR #146271), both by maintainer `teknium1`. Several Kanban/cron correctness fixes (#146075, #146070) are also in flight.

**Theme:** The project is closing out the unified-gateway epic while simultaneously hardening delivery semantics (message routing, typing leases, interrupt prioritization) and expanding CLI/tooling ergonomics.

---

## 4. Community Hot Topics

| Rank | Item | Comments | Link |
|---|---|---|---|
| 1 | #134889 (CLOSED) — Unified gateway post-merge tracking | **223** | [Issue](https://github.com/NousResearch/hermes-agent/issues/134889) |
| 2 | #143547 (OPEN) — Unified gateway open problems (continuation) | **27** | [Issue](https://github.com/NousResearch/hermes-agent/issues/143547) |
| 3 | #119070 (OPEN) — Kanban card parked as `blocker_auth` forever | **20** | [Issue](https://github.com/NousResearch/hermes-agent/issues/119070) |
| 4 | #105758 (OPEN) — Lifecycle guard false-positive blocks Node.js CLIs | **19** | [Issue](https://github.com/NousResearch/hermes-agent/issues/105758) |
| 5 | #68128 (OPEN) — WhatsApp bridge `WinError 5` on Windows | **17** | [Issue](https://github.com/NousResearch/hermes-agent/issues/68128) |

**Underlying needs:**
- **The gateway consolidation (#134889 → #143547) is the community's gravitational center.** With 250 combined comments, users and maintainers are essentially co-developing the reliability model for multi-surface sessions. The hand-off structure shows the maintainers are managing this deliberately rather than letting it burn down chaotically.
- **Cron/Kanban dispatch reliability (#119070, #132732, #138836)** is a recurring pain theme: users running autonomous/scheduled agents need *durable, deterministic* state transitions, and the current guard logic produces "stuck forever" states with no user-facing error.
- **Windows and non-POSIX platform support (#68128)** surfaces repeatedly, suggesting the Windows user base is material and under-tested relative to Linux/macOS.

---

## 5. Bugs & Stability

Ranked by severity and blast radius:

**🔴 P0 / Critical**
- **#134889 (CLOSED) — "One gateway owns every local session" post-merge fixes.** P0 tracking, 223 comments, spanning CLI/TUI/Desktop/gateway/sessions/profiles with `sweeper:risk-*` tags across session-state, message-delivery, compatibility, and Windows. Closed today, but explicitly continuing in #143547 — **treat as not fully resolved.**

**🟠 P2 / High Impact**
- **#145556** — TUI session **silently loses a 110-message block** (~2.5 hrs of work) with `active=0, compacted=0`, no summary, no log. Data-loss-grade. No fix PR visible.
- **#143547** — Continuation of unified-gateway regressions (auth, config, compression, sessions). **[Issue](https://github.com/NousResearch/hermes-agent/issues/143547)** — no single fix PR.
- **#141973** — Mid-turn "steer" sends unreliable: queued instead of delivered, false "sent" state, silent no-op Steer button. Core UX correctness. **[Issue](https://github.com/NousResearch/hermes-agent/issues/141973)**
- **#144546** — Compaction drops the *just-delivered* assistant reply from context. **[Issue](https://github.com/NousResearch/hermes-agent/issues/144546)**
- **#143869** — Async subagent results **stuck forever** (`owner_execution_id` NULL, never claimable). **[Issue](https://github.com/NousResearch/hermes-agent/issues/143869)**
- **#119070** — Kanban card parked as `blocker_auth` indefinitely after rate-limit-then-success. **[Issue](https://github.com/NousResearch/hermes-agent/issues/119070)** — fix PR *not* yet present, though related Kanban fixes exist (#146075, #146070).
- **#144648** — Webapp post-merge follow-ups (security-tagged, spans auth/desktop/sessions). **[Issue](https://github.com/NousResearch/hermes-agent/issues/144648)**

**🟡 P2 / Recent (filed 10-28 to 10-29)**
- **#146242** — Marking a listed session read returns **404 `not_found`** despite session existing.
- **#146253** — Desktop model switch **blocked** when current route is a stopped local model (`ValueError` escapes `_current_route`'s `AuthError`-only catch).
- **#146237** — Desktop Kanban reassign to another profile → `403 profile_scope_mismatch`.
- **#146278** — Cron agent jobs refused with `Gateway draining: update_paused` during PM sync/update fence.

**🟢 P3 / Long-tail**
- #105758 (lifecycle guard), #68128 (WhatsApp Windows), #132732 (cron worker double-import), #131786 (completion tail drops long JSON), #133745 (configurable scan budgets).

**Fix PRs present:** #79872 (stale waiters after `/stop`), #61858 (prioritize user interrupts), #66526 (revoke typing lease), #39627 (cron path normalization), #146273 (SSH jump hosts) — several still open/unmerged.

---

## 6. Feature Requests & Roadmap Signals

- **#146277 — Float free (`$0` / `:free`) models to the front of model pickers.** Fresh, single-source-of-truth implementation across CLI/Telegram/Slack/Discord. Likely to land quickly — high UX value, low risk. **[PR](https://github.com/NousResearch/hermes-agent/pull/146277)**
- **#146271 — `hermes model --list`** for non-interactive/scripted model catalog access (port of gemini-cli). **[PR](https://github.com/NousResearch/hermes-agent/pull/146271)**
- **#144034 — Observe-only Jev routing audit for Kanban** (fail-open, no routing mutation). **[PR](https://github.com/NousResearch/hermes-agent/pull/144034)**
- **#118118 — Apply `max_in_progress` / per-profile caps once at boot** (avoid mid-flight races). Needs-decision. **[Issue](https://github.com/NousResearch/hermes-agent/issues/118118)**
- **#133745 — Configurable lifecycle scan budgets** (make hardcoded 64 KiB limit operator-tunable). Needs-decision. **[Issue](https://github.com/NousResearch/hermes-agent/issues/133745)**

**Prediction for next version:** The free-model float (#146277), `model --list` (#146271), and one or more gateway delivery-semantics fixes (interrupt prioritization, typing-lease revocation) are the most likely inclusions — all are small, testable, and address visible friction. The configurable-caps and scan-budget items are likely to remain in discussion due to `needs-decision` status.

---

## 7. User Feedback Summary

**Pain points (verbatim themes):**
- *Silent data loss erodes trust.* "[The TUI] silently lost a contiguous block of 110 messages (~2.5 hours of work)... no compaction summary anywhere." (#145556)
- *Autonomous workflows get "stuck forever" without error surfacing.* Kanban cards (#119070), async subagent delegations (#143869), and cron workers (#132732) all exhibit states where the user gets no signal that something failed.
- *The unified gateway is a double-edged sword.* Users appreciate a single control plane but report cross-profile leakage (#143364: yori's progress streaming into default's Telegram bot) and routing surprises.
- *Model/provider discoverability is awkward.* Stale static catalogs (#142648, MiniMax), huge unscrollable TUI model lists (#146275), and the desire for free-model prominence (#146277).
- *Cross-platform (especially Windows) rough edges.* WinError 5, permission scopes, and detach flags (#68128).

**Satisfaction signals:** The rapid turnaround on ports from sibling projects (cline, gemini-cli) and the disciplined hand-off from #134889 to #143547 suggest an engaged, responsive maintainer team. The high comment counts indicate a community willing to deeply co-debug rather than churn.

**Dissatisfaction signals:** Repeated `sweeper:risk-*` tagging across many issues indicates the maintainers themselves flag systemic risk areas — message-delivery, session-state, and compatibility are the three chronic risk clusters.

---

## 8. Backlog Watch

Long-unanswered / high-value items needing maintainer attention:

| Item | Age | Why it matters |
|---|---|---|
| **#68128** WhatsApp `WinError 5` (no-breakaway job objects) | ~3 months (07-20) | Windows messaging broken; documented fallback missing. **[Issue](https://github.com/NousResearch/hermes-agent/issues/68128)** |
| **#105758** Lifecycle guard blocks Node.js CLIs | ~7 weeks (09-08) | False-positive blocks legitimate tooling; `needs-decision`. **[Issue](https://github.com/NousResearch/hermes-agent/issues/105758)** |
| **#39627** cron script path normalization | **~5 months (06-05)** | Oldest open PR in top-20; Windows separators + `scripts/` prefix. **[PR](https://github.com/NousResearch/hermes-agent/pull/39627)** |
| **#39784** relax repeated skill loading guidance | **~5 months (06-05)** | Broad-blast agent behavior change, still unreviewed. **[PR](https://github.com/NousResearch/hermes-agent/pull/39784)** |
| **#61858 / #66526 / #79872** rungmc357 gateway delivery-semantics PRs | 3–4 months (07–08) | A coherent cluster of interrupt/typing/stale-waiter fixes that has sat unmerged; may need a champion reviewer. **[#79872](https://github.com/NousResearch/hermes-agent/pull/79872)**, **[#61858](https://github.com/NousResearch/hermes-agent/pull/61858)**, **[#66526](https://github.com/NousResearch/hermes-agent/pull/66526)** |
| **#133745** configurable scan budgets | ~3 weeks, `needs-decision` | Operator-configurability request with a real use case (maintenance scripts). **[Issue](https://github.com/NousResearch/hermes-agent/issues/133745)** |

**Watch recommendation:** The `rungmc357` gateway PR cluster and the two 5-month-old June PRs (#39627, #39784) represent the most concrete "rotting" risk. If the merged #134889/#106742 gateway code already supersedes some of these, they should be explicitly closed; if not, they deserve review bandwidth — especially given how many *new* gateway delivery bugs are being filed.

---

*Digest generated from GitHub activity on 2026-10-29. All links point to `github.com/NousResearch/hermes-agent`.*

</details>

<details>
<summary><strong>IronClaw</strong> — <a href="https://github.com/nearai/ironclaw">nearai/ironclaw</a></summary>

# IronClaw Project Digest — 2026-10-29

## 1. Today's Overview

IronClaw shows minimal activity in the last 24 hours: **1 open issue**, **0 PRs updated**, and **0 new releases**. No code was merged, closed, or shipped during this window. The single active item is a community-initiated question about adding a new named provider to the registry — a governance/policy discussion rather than a technical change. Overall project health appears **stable but quiet**, with no bug reports, regressions, or urgent maintenance signals today.

## 2. Releases

No new releases in the last 24 hours.

## 3. Project Progress

No merged or closed PRs today. No features advanced, and no fixes landed in this window.

## 4. Community Hot Topics

Only one item saw activity today:

- **[Issue #8161 — "Would you accept Obscurify.ai as a named provider?"](https://github.com/nearai/ironclaw/issues/8161)** (OPEN, 0 comments, 0 👍, created & updated 2026-10-28)
  - Author: tonydavis629, who discloses they operate the service.
  - **Underlying need:** The contributor is asking for a *pre-PR policy signal* — whether the maintainers want third-party providers added to `providers.json` at all. They explicitly cite the prior closure of the **Novita PR #1115**, where the rationale was that the provider list "shouldn't grow to include every provider." This suggests the community lacks a clear, documented contribution policy for provider inclusion, which may be deterring legitimate contributions or generating repeated one-off questions.

## 5. Bugs & Stability

No bugs, crashes, or regressions were reported in the last 24 hours. Stability risk today: **none observed**.

## 6. Feature Requests & Roadmap Signals

- **Provider registry expansion (Issue #8161):** A request to include Obscurify.ai, argued on the basis that privacy-focused providers already exist in the registry. This is less a feature request than a **policy clarification request**.
- **Prediction:** It is unlikely this specific provider will be added in the next version unless maintainers articulate and apply a consistent inclusion criterion (e.g., privacy category, usage threshold, or maintained integrations). A more probable near-term outcome is a **CONTRIBUTING/registry policy note** or a maintainer response clarifying the bar for named providers — which would preempt similar issues in the future.

## 7. User Feedback Summary

- **Pain point:** Ambiguity around provider acceptance criteria. The author invested effort in researching past decisions (referencing PR #1115) before opening an issue — indicating the process is not self-evident from documentation.
- **Use case:** Privacy-oriented inference providers seeking visibility in IronClaw's registry.
- **Satisfaction/dissatisfaction:** Neutral. The contributor is cooperative and asks before submitting a PR, which reflects a generally constructive community tone, but also signals friction in the contribution path.

## 8. Backlog Watch

- **[Issue #8161](https://github.com/nearai/ironclaw/issues/8161)** — Created 2026-10-28, updated 2026-10-28, **0 comments, 0 reactions**. It is only ~1 day old, so it is not yet "long-unanswered," but it **requires maintainer attention** because it is a blocking question: the contributor is explicitly waiting for a yes/no before opening a PR. A slow response risks discouraging a willing contributor and may invite duplicate issues from other provider operators.
- **Related historical context:** PR **#1115 (Novita)** was closed previously — worth revisiting whether the closure reasoning is documented publicly, as it is now being cited as precedent.

---

**Health snapshot:** 🟢 Stable / low activity — no defects or regressions, but maintainer responsiveness on Issue #8161 will be the key signal to watch in the coming days.

</details>

<details>
<summary><strong>QwenPaw</strong> — <a href="https://github.com/agentscope-ai/QwenPaw">agentscope-ai/QwenPaw</a></summary>

# QwenPaw Project Digest — 2026-10-29

## 1. Today's Overview

QwenPaw shows **high-velocity but unstable development activity**: 49 PRs and 23 issues updated in the last 24h, with a notable 20 PRs merged/closed against 29 still open. No new release was cut today, but the team is actively stabilizing the **v2.3.0-beta.1** pre-release (see Release Duty issue #8456). A concerning cluster of **regressions in plugin loading and context compression** dominates the bug tracker — three separate issues (#8265, #8473, #8320) trace back to unguarded `importlib.invalidate_caches()` calls, and two fresh bugs (#8474, #8417) show context compression is still the project's most fragile subsystem. Overall health is **active but strained**: maintainers are shipping fixes quickly, yet the same subsystems (memory/ReMe, context compression, Windows/plugin isolation) continue to generate recurring regressions.

## 2. Releases

**None.** There were no new releases in the last 24h. The most recent relevant activity is the **v2.3.0-beta.1 pre-release installation verification** (Issue #8456, deadline 2026-10-27 16:42 UTC), which appears to still be in progress — and is already implicated in the plugin-loading regression reported in #8473.

## 3. Project Progress

20 PRs were merged or closed today. Notable closures:

- **[CLOSED] #7606** — `fix(memory): prepare Auto-Dream for ReMe 0.4.1.12` — removes deprecated Auto-Dream topic extraction to align with upstream ReMe changes. [Link](https://github.com/agentscope-ai/QwenPaw/pull/7606)
- **[CLOSED] #8455** — `fix(desktop): handle Windows installer preparation failures` — hardens Windows installer PowerShell invocation. [Link](https://github.com/agentscope-ai/QwenPaw/pull/8455)
- **[CLOSED] #8468** — `fix(providers): prevent silent LLM startup hangs (#8435)` — extends first-content timeout to cover stream startup. [Link](https://github.com/agentscope-ai/QwenPaw/pull/8468)
- **[CLOSED] #8397** — `fix(plugins): return 400 for plugin download network errors` — converts connection/TLS/timeout failures into clear HTTP 400s. [Link](https://github.com/agentscope-ai/QwenPaw/pull/8397)

Also closed on the issue side: **#2839, #8320, #8194, #8163, #8206, #8417, #8335, #8179** — a broad cleanup of older Windows/plugin/context bugs, several of which were long-standing (April–October).

Advancing features in open PRs include channel plugin isolation (#8187), QQ C2C streaming (#8409), reranker model center (#8472), memory tag browsing (#8470), and per-job `thinking_level` (#8476).

## 4. Community Hot Topics

| Item | Comments | Link |
|---|---|---|
| #8040 — embedding reindex drops CJK chunk batches | 7 | [Link](https://github.com/agentscope-ai/QwenPaw/issues/8040) |
| #7715 — Daily Paper fails silently on arxiv unreachable | 5 | [Link](https://github.com/agentscope-ai/QwenPaw/issues/7715) |
| #8265 — plugin hot-install aborts on distro Python 3.11 | 4 | [Link](https://github.com/agentscope-ai/QwenPaw/issues/8265) |
| #8312 — context control failure causes task interruption | 4 | [Link](https://github.com/agentscope-ai/QwenPaw/issues/8312) |
| #2839, #8464, #8361, #8320, #8194, #8163 | 3 each | — |

**Underlying needs:** The community is most vocal about **silent failures** (#8040, #7715) where logs claim success but work is dropped — this erodes trust more than hard crashes. Second, **context/memory management** (#8040, #8312, #8361, #8464) is the single most recurring theme: users run long sessions and hit compression/recall edge cases repeatedly. Third, **Windows + plugin robustness** (#8265, #8194, #8206) reflects a significant Windows desktop user base hitting platform-specific stdlib quirks.

## 5. Bugs & Stability

Ranked by severity:

1. **🔴 Critical — #8473** `2.3.0-beta.1: all backend plugins fail to load (12/12) due to unguarded importlib.invalidate_caches() in module_isolation.py:220` — same root cause as #8265, new call site. **Blocks the beta entirely.** [Link](https://github.com/agentscope-ai/QwenPaw/issues/8473)
2. **🔴 Critical — #8474** `Context compression revives media blocks from history → persistent 400 permanently kills session`. Related design issue #8335 was just closed. [Link](https://github.com/agentscope-ai/QwenPaw/issues/8474)
3. **🟠 High — #8475** `QQ channel 'enabled' flag silently reset to false after config reload` — no warning log. [Link](https://github.com/agentscope-ai/QwenPaw/issues/8475)
4. **🟠 High — #8464** `/compact` ignores session-level model switch, uses agent default → 400 failures. **Fix PR #8465 exists (open).** [Link](https://github.com/agentscope-ai/QwenPaw/issues/8464)
5. **🟠 High — #8265** plugin hot-install aborts on distro-patched Python 3.11. [Link](https://github.com/agentscope-ai/QwenPaw/issues/8265)
6. **🟡 Medium — #8312** context compaction cannot fit request (252565 > 251904 tokens). [Link](https://github.com/agentscope-ai/QwenPaw/issues/8312)
7. **🟡 Medium — #8361** Automatic Memory Search repeated `memory_search` calls; recovery fails after interception. **Mitigation PR #8457 + #7835 open.** [Link](https://github.com/agentscope-ai/QwenPaw/issues/8361)
8. **🟡 Medium — #8040** embedding reindex silently drops CJK chunk batch (recurrence of #5950). [Link](https://github.com/agentscope-ai/QwenPaw/issues/8040)

**Note:** Several bugs are **recurrences or new call sites of already-fixed issues** (#8040 ← #5950; #8473 ← #8265), suggesting fixes are being applied point-wise rather than systematically.

## 6. Feature Requests & Roadmap Signals

- **#8439** `support thinking_level in JobRuntimeSpec` — 2 comments, **PR #8476 already open**. Strong candidate for v2.3.x. [Link](https://github.com/agentscope-ai/QwenPaw/issues/8439)
- **#8481** `QWENPAW_LANGUAGE` env var for Docker initial setup — deployment ergonomics. [Link](https://github.com/agentscope-ai/QwenPaw/issues/8481)
- **#8478** Sync bundled Office skills with Anthropic July 2026 update — **PR #8479 open**. [Link](https://github.com/agentscope-ai/QwenPaw/issues/8478)
- **#8460** Browser/OS-level notification push for pending approvals. [Link](https://github.com/agentscope-ai/QwenPaw/issues/8460)
- **#8459** Easier access to unread push messages in web UI. [Link](https://github.com/agentscope-ai/QwenPaw/issues/8459)

**Prediction:** `thinking_level` (#8439/#8476), Office skills sync (#8478/#8479), and Baizhi Cloud Browser MCP docs (#8423) are the most likely to land in the next release given paired PRs already exist. The notification feature pair (#8460/#8459) signals growing attention to the human-in-the-loop approval UX.

## 7. User Feedback Summary

**Pain points:**
- *Silent failures are the #1 complaint* — users specifically call out misleading success logs (#8040, #7715) and unlogged config resets (#8475). Trust in observability is low.
- *Long-session instability* — multiple users running large contexts (340K tokens in #8464, 40-turn histories in #8474) hit compression bugs that permanently wedge sessions.
- *Windows desktop friction* — stale PIDs (#8194), long-path limits (#8163), locked log files (#8206), and installer issues (#8455) dominate platform-specific reports.
- *Local model users* (#2839, llama.cpp Qwen3.5) and *CJK users* (#8040) report edge cases suggesting test coverage gaps.

**Satisfaction signals:** Fast PR turnaround (multiple fix PRs opened same-day as reports), and users are constructive — #8265 author even submitted their own plugin workaround context. **Dissatisfaction** centers on recurrence of "fixed" bugs and misleading logs.

## 8. Backlog Watch

Long-unanswered or important items needing maintainer attention:

- **#7715** (created 2026-09-12, 5 comments, still open) — Daily Paper silent failure; **47 days old**, no fix PR. [Link](https://github.com/agentscope-ai/QwenPaw/issues/7715)
- **#8040** (created 2026-09-30, 7 comments, still open) — CJK embedding batch drop, recurrence of #5950; **no fix PR**. [Link](https://github.com/agentscope-ai/QwenPaw/issues/8040)
- **#8187** — `feat(channels): extract channels into plugins with subprocess isolation` (size/XXXL, open since 2026-10-12) — large architectural PR needing review bandwidth. [Link](https://github.com/agentscope-ai/QwenPaw/pull/8187)
- **#7835** — `fix(memory): stop leaking auto-memory-recall payload to channels` (open since 2026-09-17, Under Review) — **42 days in review**. [Link](https://github.com/agentscope-ai/QwenPaw/pull/7835)
- **#8231** — `fix(console): persist market install provenance` (open since 2026-10-13, Under Review). [Link](https://github.com/agentscope-ai/QwenPaw/pull/8231)
- **#8456** — Release Duty verification for v2.3.0-beta.1, deadline passed 2026-10-27; **status unclear** and the beta is blocked by #8473. [Link](https://github.com/agentscope-ai/QwenPaw/issues/8456)

**Recommendation:** Prioritize #8473 (beta blocker), #8474 (session-killing), and #8040/#7715 (aging silent-failure bugs). Consider a systematic audit of `importlib.invalidate_caches()` call sites and compression media-block handling to prevent further recurrences.

</details>

<details>
<summary><strong>ZeroClaw</strong> — <a href="https://github.com/zeroclaw-labs/zeroclaw">zeroclaw-labs/zeroclaw</a></summary>

# ZeroClaw Project Digest — 2026-10-29

---

## 1. Today's Overview

ZeroClaw is in an active pre-release hardening phase for **v0.9.0**, with 50 issues and 30 PRs updated in the last 24 hours. Activity is heavily weighted toward **defect resolution and release-gate work**: 10 PRs were merged/closed, including several runtime, channel, and security-policy fixes, while 20 PRs remain open — some long-running (PRs #9900, #11634 dating to August/October). No new releases were cut. The issue tracker shows a pattern of **concentrated follow-up work on the v0.9.0 milestone**, particularly around plugin installation lifecycle, system-prompt budgeting, channel reliability (Slack, WhatsApp, Telegram), and MCP connection resilience. One P1 issue closed (#11612), but a cluster of high-risk P1 bugs remain open, suggesting the release gate is not yet clean.

---

## 2. Releases

**No new releases in the last 24 hours.** Latest published artifact referenced in the tracker is **v0.8.6** (`c473221`). Multiple issues are explicitly tagged `release:v0.9.0`, indicating an in-progress release train. Given the open P1/risk:high items below, v0.9.0 is unlikely to ship imminently.

---

## 3. Project Progress

**Merged/closed PRs in last 24h (10 total):** The following notable closures advanced runtime correctness, channel reliability, and security UX:

- **[#11910] fix(runtime): enforce the system prompt size budget (fail closed)** — Closes long-standing #11908. Converts the advisory `max_system_prompt_chars` limit into a hard gate and removes the unsafe unlimited default. Significant for context-overflow stability. [Link](https://github.com/zeroclaw-labs/zeroclaw/pull/11910)
- **[#11921] feat(session): append-only session event history** — Marked OPEN in the listing but appears in the active set; large (size:XL) foundational effort enabling state replay without repeating external side effects. Worth tracking closely. [Link](https://github.com/zeroclaw-labs/zeroclaw/pull/11921)
- **[#11934] fix(runtime): restore agent_alias attribution on cron/gateway agent runs** — Fixes lost observability attribution. [Link](https://github.com/zeroclaw-labs/zeroclaw/pull/11934)
- **[#11935] feat(cli): `zeroclaw cron runs`** — Exposes retained cron run output to terminal operators. [Link](https://github.com/zeroclaw-labs/zeroclaw/pull/11935)
- **[#11983] feat(security): explain shell policy refusals** — Adds reason + remediation hints to blocked shell commands, reducing agent retry loops. [Link](https://github.com/zeroclaw-labs/zeroclaw/pull/11983)
- **[#11601] fix(channels): classify telegram transcription failures and bound retries** — Prevents head-of-line blocking from terminally rejected voice updates. [Link](https://github.com/zeroclaw-labs/zeroclaw/pull/11601)
- **[#11651] fix(channels): honor Telegram 429 retry_after via shared flood gate** — Rate-limit handling for Bot API. [Link](https://github.com/zeroclaw-labs/zeroclaw/pull/11651)
- **[#12056], [#12044], [#12070] fix(runtime): system-prompt ordering / deferred bootstrap sections / re-apply cap after skill refresh** — A coordinated three-PR batch around prompt assembly determinism. [Links: [#12056](https://github.com/zeroclaw-labs/zeroclaw/pull/12056), [#12044](https://github.com/zeroclaw-labs/zeroclaw/pull/12044), [#12070](https://github.com/zeroclaw-labs/zeroclaw/pull/12070)]
- **[#11443] fix(transport): honor SSL_CERT_FILE for WebSocket connections** — Enables private-CA/TLS-inspecting deployments. [Link](https://github.com/zeroclaw-labs/zeroclaw/pull/11443)
- **[#11612] (Issue) supervised-mode repeated shell command abort** — **CLOSED.** [Link](https://github.com/zeroclaw-labs/zeroclaw/issues/11612)

**Net read:** The project is clearing prompt-assembly and channel-reliability debt with velocity, while large architectural PRs (#11921 session history, #11881 Goal Mode) remain open.

---

## 4. Community Hot Topics

Ranked by comment activity:

1. **[#10999] Publish and prove Discord plugin installation from a release binary** (9 comments, open, `release:v0.9.0`, `risk:medium`) — Ongoing verification of real Discord inbound/outbound delivery against published archives; last update documents successful verification on macOS arm64 v0.8.6. *Core need: users want plugins to be installable and provable from official release artifacts, not source builds.* [Link](https://github.com/zeroclaw-labs/zeroclaw/issues/10999)

2. **[#11055] Standalone channel start SOP turns lack live channel tool handles** (8 comments, P1, `risk:high`) — Channel-addressed tools unusable outside two daemon entry points. *Core need: consistent tool availability across all agent invocation paths.* [Link](https://github.com/zeroclaw-labs/zeroclaw/issues/11055)

3. **[#11416] Slack "is thinking…" status no longer shown in channel threads since v0.8.5** (5 comments, in-progress) — A UX regression with an open question on intent. [Link](https://github.com/zeroclaw-labs/zeroclaw/issues/11416)

4. **[#11204] OpenRouter spend shows $0.00; tokens classified "free"** (5 comments, P1) — Cost observability broken for OpenRouter. *Core need: cost governance and billing accuracy for multi-provider users.* [Link](https://github.com/zeroclaw-labs/zeroclaw/issues/11204)

5. **[#10346] RFC: Gateway/channels don't share heartbeat worker's MCP-registry-caching pattern** (4 comments, 1 👍) — Documents triple-connect/triple-spawn of stdio MCP servers on every boot. *Core need: architecture coherence and reduced resource waste.* [Link](https://github.com/zeroclaw-labs/zeroclaw/issues/10346)

**PR-side hot topics:** [#11921] append-only session history (XL, touches nearly every subsystem) and [#11881] Goal Mode V1 proposal 4/12 are the highest-blast-radius open PRs.

---

## 5. Bugs & Stability

Ranked by severity; note fix-PR status:

| Severity | Issue | Status | Fix PR |
|---|---|---|---|
| **S1 blocked** | [#12014] Custom OpenAI-compatible provider assumes 32,000 context_window then rejects valid turns | OPEN | None |
| **S1 blocked** | [#10807] MCP connection permanently poisoned by one failed recovery | OPEN, P1 | None |
| **S1 blocked** | [#11538] Firejail: "invalid private directory" | OPEN, P1, security | None |
| **S1 blocked** | [#11539] Firejail: "invalid --nowheel command line option" | OPEN, P1, security | None |
| **S1 blocked** | [#11237] Config editor cannot write declarative cron schedule | OPEN, in-progress | None |
| **S2 degraded** | [#11204] OpenRouter cost/token misclassification | OPEN, P1 | None |
| **S2 degraded** | [#11585] Tripped cost limit requires daemon restart; `cost.allow_override` ignored | OPEN, P1, in-progress | None |
| **S2 degraded** | [#12055] MCP HTTP client no keep-alive control → stale socket loses tool call | OPEN | None |
| **S2 degraded** | [#12072] OpenAI Codex stream fallback retries without streaming (always rejected) | OPEN | **PR #9900 open** [Link](https://github.com/zeroclaw-labs/zeroclaw/pull/9900) |
| **S2 degraded** | [#11332] Skill review/creation never run for channel/webhook/gateway turns | OPEN, P2 | None |
| **S2 degraded** | [#11333] Skill review tools can't see skills via `skill_bundles` | OPEN, P2 | None |
| **S2 degraded** | [#11257] WhatsApp Web drops media captions | OPEN, P1 | None |
| **S3 minor** | [#11972] `gateway get-paircode` exits 0 on failure | OPEN | None |
| **S3 minor** | [#11360]/[#11358]/[#11336] Plugin lock/PKI/migration integrity | OPEN, P3 | **PR #12040 open** (manifest pairing) [Link](https://github.com/zeroclaw-labs/zeroclaw/pull/12040) |

**Notable fixed today:** #11612 (supervised-mode repeated shell command abort). **Notable systemic risk:** two independent Firejail failures (#11538/#11539) both P1 and security-tagged — sandbox users are fully blocked on shell execution.

---

## 6. Feature Requests & Roadmap Signals

- **[#12069] `/load-session <name|uuid>` for ZeroCode ACP pane** — resume persisted sessions without the Ctrl+S picker. Likely lands post-0.9.x. [Link](https://github.com/zeroclaw-labs/zeroclaw/issues/12069)
- **[#10993] Complete the public runtime composition boundary** — embeddable runtime with injected capabilities (finishes #7432 R1/Phase 2 D1); tagged `release:v0.9.0`, `type:refactor`. **Strong candidate for v0.9.0.** [Link](https://github.com/zeroclaw-labs/zeroclaw/issues/10993)
- **[#10346] Shared MCP-registry-caching RFC** — likely to surface as performance/architecture work in 0.9.x or 0.10.
- **Plugin lifecycle maturity** (#10999, #11336, #11358, #11360, #11562) — the volume of v0.9.0-tagged plugin issues signals **plugin installation integrity** as the flagship 0.9.0 theme.
- **Open PRs signaling roadmap:** [#11997] `send_via` attachments across all major channels; [#12085] Obscurify.ai provider slot; [#11881] Goal Mode lifecycle.

---

## 7. User Feedback Summary

- **Reliability pain points dominate:** Users are blocked by Firejail sandbox failures, MCP poisoning, and context-window guessing — these read as production-blocking, not nitpicks. *Dissatisfaction* is concentrated on **silent failures** (e.g., #12055 tool calls lost as "outcome-unknown", #11233 fabricated validation results).
- **Cost/observability dissatisfaction:** OpenRouter users (#11204) and cost-limit users (#11585) find governance features unusable in practice — a credibility issue for teams running agents with budgets.
- **Channel parity friction:** Slack UX regression (#11416), WhatsApp caption/voice handling (#11257, #11059) suggest channel integrations are shipping features faster than they achieve parity.
- **Positive signals:** Closure of #11612, prompt-budget enforcement (#11910), and cron CLI improvements (#11935) directly address articulated friction — maintainers are responsive.
- **Ecosystem pull:** Requests for named provider slots (Obscurify) and plugin install-from-release indicate users want **first-class, low-friction setup** rather than `custom` workarounds.

---

## 8. Backlog Watch

Items needing maintainer attention due to age, risk, or silence:

- **[#10346] MCP registry caching RFC** (opened 2026-08-25, 1 👍, `needs-author-action`, 4 comments) — Architectural; triple-spawn on boot affects every daemon user. [Link](https://github.com/zeroclaw-labs/zeroclaw/issues/10346)
- **[PR #9900] OpenAI Codex no-stream retry fix** (opened 2026-08-10, `needs-author-action`) — Open ~11 weeks; blocks a confirmed S2 bug (#12072). [Link](https://github.com/zeroclaw-labs/zeroclaw/pull/9900)
- **[PR #11634] Toolchain bump to Rust 1.99.1** (open since 2026-10-09, large CI footprint) — Release infrastructure dependency. [Link](https://github.com/zeroclaw-labs/zeroclaw/pull/11634)
- **[#11580] Release binary size gate headroom policy** (P1, `needs-maintainer-review`) — Directly gates v0.9.0; only 0.7 MB headroom under the 64 MiB cap. [Link](https://github.com/zeroclaw-labs/zeroclaw/issues/11580)
- **[PR #11921] Append-only session event history** (XL, opened 2026-10-21, no comment activity in listing) — Foundational; needs sustained review bandwidth. [Link](https://github.com/zeroclaw-labs/zeroclaw/pull/11921)
- **[#11538]/[#11539] Firejail failures** — Duplicate-pattern P1 security bugs with zero fix PRs; likely one shared root cause worth a single triage owner. [Link](https://github.com/zeroclaw-labs/zeroclaw/issues/11538)

---

*Health assessment: high throughput and responsive maintainers, but the v0.9.0 gate carries several unfixed S1/P1 items (Firejail ×2, context-window fallback, MCP poisoning, cost governance). Release readiness depends on clearing that S1 cluster and the binary-size decision (#11580).*

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*