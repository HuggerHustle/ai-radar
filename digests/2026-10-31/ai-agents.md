# OpenClaw Ecosystem Digest 2026-10-31

> Issues: 490 | PRs: 500 | Projects covered: 5 | Generated: 2026-10-31 00:41 UTC

- [OpenClaw](https://github.com/openclaw/openclaw)
- [Hermes Agent](https://github.com/nousresearch/hermes-agent)
- [IronClaw](https://github.com/nearai/ironclaw)
- [QwenPaw](https://github.com/agentscope-ai/QwenPaw)
- [ZeroClaw](https://github.com/zeroclaw-labs/zeroclaw)

---

## OpenClaw Deep Dive

# OpenClaw Project Digest — 2026-10-31

## 1. Today's Overview

OpenClaw remains in a high-velocity development phase, with **490 issues** and **500 PRs** touched in the last 24 hours — an exceptionally active cadence typical of a large, mature open-source agent runtime. The open-to-closed ratio is healthy (337 open vs. 153 closed issues; 236 open vs. 264 merged/closed PRs), indicating that maintainers are clearing at least as much as they take in. However, a significant share of top-commented issues are **P0/P1 stability problems** — Windows restart/update reliability, state-lifecycle lease contention, `doctor` hangs, and dreaming pipeline correctness — suggesting the project's biggest challenge right now is hardening the existing surface rather than shipping new features. The single new release (a beta.5 patch) is narrowly scoped to Node compatibility, reinforcing that the team is in a stabilization window. On balance: **very healthy contributor throughput, but stability debt is accumulating in high-severity areas.**

---

## 2. Releases

**v2026.10.10-beta.5** — [Release page](https://github.com/openclaw/openclaw/releases)

- **Node compatibility fix:** Installs/updates restored on Node `>=24.16.0 <25 || >=26.1.0`.
- **Security posture change:** Node 24.22.1 or 26.12.1 is now a **recommendation, not a hard requirement** — lowering the barrier to entry for users on older patch versions.
- **Bug fix:** Node 26 workers no longer abort when stdin is a file.
- Referenced PRs: [#186589](https://github.com/openclaw/openclaw/pull/186589), [#187516](https://github.com/openclaw/openclaw/pull/187516).

**Assessment:** No breaking changes. This is a compatibility/maintenance release. The fact that this is the *only* release and is scoped to installability signals that the maintainers are deliberately holding back larger changes until stability issues (see §5) are resolved.

---

## 3. Project Progress

**264 PRs merged/closed in the last 24h** — a strong throughput day. Notable closures and landings visible in the window:

- **[#188878](https://github.com/openclaw/openclaw/pull/188878) [CLOSED]** — Backported cron repair (#188848) exposing receipt-backed run IDs in cron history. Release-migration fixture preserved.
- **[#188874](https://github.com/openclaw/openclaw/pull/188874) [CLOSED]** — Test speedup: reduced large-payload assertion time in iMessage/MCP-relay/knowledge plugin tests.
- **[#167270](https://github.com/openclaw/openclaw/issues/167270) [CLOSED]** — Feishu cross-session send bug (wrong reply anchor) fixed after being a P1 message-loss issue.
- **[#169050](https://github.com/openclaw/openclaw/issues/169050), [#170031](https://github.com/openclaw/openclaw/issues/170031) [both CLOSED]** — macOS publication-journal binding refusals blocking updates — two user-facing update-blocker bugs cleared.
- **[#164948](https://github.com/openclaw/openclaw/issues/164948) [CLOSED]** — `doctor --fix` self-deadlock on SQLite state DB.
- **[#176342](https://github.com/openclaw/openclaw/issues/176342) [CLOSED]** — Stale-lease integrity gates serializing agent startup.

**In-flight feature work (open PRs advancing):**
- [#180200](https://github.com/openclaw/openclaw/pull/180200) — GitHub OAuth reconnect from active sessions (capability-negotiated).
- [#188881](https://github.com/openclaw/openclaw/pull/188881) — Fixing "Tool call authorization expired" for dispatched agents' MCP calls (closes #185303).
- [#188882](https://github.com/openclaw/openclaw/pull/188882) — WhatsApp messages missed during Gateway downtime now answered on reconnect (supersedes #132260, related #20952).
- [#188760](https://github.com/openclaw/openclaw/pull/188760) — Doctor provider checks made async (unblocks plugin callback prep).

The pattern: **channel reliability (WhatsApp/Feishu), agent-to-agent MCP auth, and Doctor/state-DB robustness** dominate the merge pipeline.

---

## 4. Community Hot Topics

Ranked by comment count:

| # | Issue/PR | Title | Comments | Why it matters |
|---|----------|-------|----------|----------------|
| 1 | [#170956](https://github.com/openclaw/openclaw/issues/170956) | **Windows: slow startup, unclean plugin shutdown, schtasks permission error** | 27 | P0 release-blocker. Managed-service Windows installs are effectively unreliable for restarts/updates. |
| 2 | [#150635](https://github.com/openclaw/openclaw/issues/150635) | **Dreaming deep phase never promotes** (short-term recall cap) | 23 | Memory-system correctness — recalled entries evicted before promotion. |
| 3 | [#120385](https://github.com/openclaw/openclaw/issues/120385) | **Code Mode tool catalog incomplete for cron/memory-flush** | 23 | "Unknown tool id" for scheduled jobs — impacts automation users. |
| 4 | [#177656](https://github.com/openclaw/openclaw/issues/177656) | **Native host exec returns integrity-admission error** (28 failures) | 21 | P1 on stable 2026.10.5, no fix yet. |
| 5 | [#172837](https://github.com/openclaw/openclaw/issues/172837) | **Codex nativeSubagentAssignments never removed** | 19 | Memory/session leak in multi-agent setups. |

**Underlying needs analysis:** The hottest threads cluster around three themes — **(a) Windows platform parity** (users feel Windows is a second-class citizen), **(b) memory/dreaming correctness** (the flagship "agent memory" feature has subtle lifecycle bugs), and **(c) scheduled/automated agent execution** (cron + tool catalogs). These aren't vanity features — they're the engine of an always-on personal assistant. 🔥

The single most-upvoted item in the list is [#6615](https://github.com/openclaw/openclaw/issues/6615) (denylist for exec-approvals, 8 👍), tracking a long-standing security-UX request, with its companion feature request [#71097](https://github.com/openclaw/openclaw/issues/71097) now closed.

---

## 5. Bugs & Stability

Ranked by severity. Fix status noted.

### P0 — Release blockers
- **[#170956](https://github.com/openclaw/openclaw/issues/170956) (Windows restart/update reliability)** — `schtasks` permission error + unclean plugin shutdown. **No fix PR.** This is the top blocker.
- **[#70903](https://github.com/openclaw/openclaw/issues/70903) (Provider cooldown persists hours after billing recovery)** — `disabledUntil` written to auth-state survives restarts. No fix PR. Directly harms paying users after they top up.
- **[#142821](https://github.com/openclaw/openclaw/issues/142821) (Default-on transcript redaction poisons replayed context)** — masks propagate into commands/files/replies. **Linked PR open.**

### P1 — High impact
- **[#177656](https://github.com/openclaw/openclaw/issues/177656)** — native host exec integrity-admission error, 28+ failures on stable. No fix.
- **[#172837](https://github.com/openclaw/openclaw/issues/172837)** — Codex subagent assignments leak (message-loss/dup sends). No fix.
- **[#182476](https://github.com/openclaw/openclaw/issues/182476)** — Windows `update repair` fails with `OPENCLAW_STATE_LEASE_LOST`. No fix.
- **[#166017](https://github.com/openclaw/openclaw/issues/166017)** — `mcp.sessionIdleTtlMs` default not applied → spawn broker hits 256-child cap → all exec/MCP fails. **Linked PR open.**
- **[#157617](https://github.com/openclaw/openclaw/issues/157617)** — Session writer queue stalls minutes on 2.8 GB agent DB. No fix.
- **[#113701](https://github.com/openclaw/openclaw/issues/113701)** — Context overflow loop with large tool outputs. No fix.
- **[#187900](https://github.com/openclaw/openclaw/issues/187900)** — `doctor` hangs indefinitely on Linux (all modes). **Filed 2 days ago, already 7 comments. No fix.**
- **[#178359](https://github.com/openclaw/openclaw/issues/178359)** — `doctor --fix --non-interactive` idles 15+ min in plugin-capture. No fix.
- **[#159094](https://github.com/openclaw/openclaw/issues/159094)** — State-lifecycle lease ownership split-brain (macOS).
- **[#148789](https://github.com/openclaw/openclaw/issues/148789)** — Model fallback chain exhausts all candidates on harness-level failure.
- **[#153453](https://github.com/openclaw/openclaw/issues/153453)** — WhatsApp replies wait for recovery after adapter switch.
- **[#141413](https://github.com/openclaw/openclaw/issues/141413)** — macOS app omits token for local Gateway using SecretRef (P0).

### P2 — Notable
- [#150635](https://github.com/openclaw/openclaw/issues/150635) (dreaming promotion), [#120385](https://github.com/openclaw/openclaw/issues/120385) (Code Mode catalog), [#121232](https://github.com/openclaw/openclaw/issues/121232) (dreaming ranker/applier mismatch), [#112638](https://github.com/openclaw/openclaw/issues/112638) (session maintenance bounds not enforced), [#136405](https://github.com/openclaw/openclaw/issues/136405) (memory_search 15s hang), [#151345](https://github.com/openclaw/openclaw/issues/151345) (Telegram draft suppressed by outbound hooks).

**Stability verdict:** ⚠️ **Concerning.** A recurring class of bugs — **state-lease/integrity-admission contention** — appears across at least five separate P0/P1 issues (#170956, #177656, #182476, #159094, #176342). This looks like a systemic architectural weak point in the session/agent DB coordination layer, not isolated bugs. Several have **no fix PR**, and two (`doctor` hangs #187900, #178359) are fresh regressions from the last two weeks. **Recommend maintainers prioritize a coordinated fix to the state-lease subsystem.**

---

## 6. Feature Requests & Roadmap Signals

Active, upvoted feature requests:

| Issue | Feature | 👍 | Signal strength |
|-------|---------|----|----------------|
| [#6615](https://github.com/openclaw/openclaw/issues/6615) | Denylist for exec-approvals ("allow all except X") | 8 | **High** — security-UX, partner request #71097 now closed |
| [#10687](https://github.com/openclaw/openclaw/issues/10687) | Fully dynamic model discovery (OpenRouter+) | 4 | Medium — companion #121584 closed |
| [#79223](https://github.com/openclaw/openclaw/issues/79223) | Configurable Dream Diary language/prompt | 2 | Medium — i18n gap |
| [#44309](https://github.com/openclaw/openclaw/issues/44309) | One-way dispatch mode for A2A handoffs | 1 | Medium — multi-agent |
| [#138990](https://github.com/openclaw/openclaw/issues/138990) | Enforceable checkpoints/bounded yields for WebChat | 0 | Watch |

**Prediction for next major version:** Given the closed companion requests and the stability focus, the most likely near-term landings are **(1) exec-approval denylist mode** (long-matured, 8 👍, security-review tagged), and **(2) dynamic model discovery** (two related issues, providers like OpenRouter are fast-moving). The A2A dispatch-only mode is lower probability this cycle.

Also notable: PR [#188794](https://github.com/openclaw/openclaw/pull/188794) adds **European Portuguese** to the Control UI — a sign the project is investing in i18n.

---

## 7. User Feedback Summary

**Pain points (voices from issues):**
- **Windows users feel abandoned.** #170956's author writes updates only succeed "pas na veel proberen" (only after many retries). #182476 reports deterministic `update repair` failure. This is the loudest dissatisfaction signal in the dataset.
- **Paying users blocked post-recovery.** #70903 — users who top up billing remain locked out for hours due to a persistent cooldown file. High emotional stakes.
- **`doctor` is supposed to be the rescue tool — but it hangs.** #187900, #178359, #179481, #164948 all describe `doctor` failing when users need it most. This erodes trust in the recovery path.
- **Memory system inconsistency.** Multiple users report dreaming/memory-core behaving "forever" wrongly (#150635 "never promotes", #121232 "Promoted 0 forever", #65374 cross-agent contamination). For a personal AI assistant, memory reliability is existential.
- **Multi-agent setups have sharp edges.** #172837 (leaked assignments), #65374 (identity contamination), #164972 (claude-cli team matrix broken).

**Positive signals:** High contributor engagement (500 PRs/day), community-generated fixes (several closed issues reference community PRs), and rapid triage via the `clawsweeper` bot labeling system (#170956 already has `impact:ux-release-blocker` + P0 tags 2 days after filing).

**Satisfaction verdict:** Active and engaged community, but **maturity-stage frustration** — users rely on OpenClaw for real workflows (WhatsApp-facing agents, scheduled automation) and are hitting reliability walls, particularly on Windows and around the state-lease/Doctor subsystems.

---

## 8. Backlog Watch

Important items needing maintainer attention:

| Issue/PR | Age | Why it needs attention |
|----------|-----|----------------------|
| [#44309](https://github.com/openclaw/openclaw/issues/44309) | Created 2026-03-12 (**~7.5 months**) | `clawsweeper:needs-product-decision` — no maintainer decision on A2A dispatch mode. |
| [#6615](https://github.com/openclaw/openclaw/issues/6615) | Created 2026-02-01 (**~9 months**) | 8 👍, needs security review + product decision. Companion closed, but the primary request is stalled. |
| [#10687](https://github.com/openclaw/openclaw/issues/10687) | Created 2026-02-06 (**~9 months**) | Dynamic model discovery — tagged `maintainer`. Needs decision. |
| [#65374](https://github.com/openclaw/openclaw/issues/65374) | Created 2026-04-12 (**~6.5 months**) | P1 security: dreaming contaminates multi-agent identity. No fix. |
| [#150635](https://github.com/openclaw/openclaw/issues/150635) | Created 2026-09-17 | 📣 **`clawsweeper:linked-pr-open`** — high-comment memory bug with a linked PR that hasn't merged. Worth unblocking. |
| [#166017](https://github.com/openclaw/openclaw/issues/166017) | Created 2026-10-06 | P1 crash-loop with **linked PR open** — spawn broker hard-cap. Should be prioritized for merge. |
| [#180191](https://github.com/openclaw/openclaw/pull/180191) & [#180180](https://github.com/openclaw/openclaw/pull/180180) & [#180183](https://github.com/openclaw/openclaw/pull/180183) | Created 2026-10-22 (**~9 days open**) | Release/CI tooling PRs from RomneyDa, still open — release plumbing may be a bottleneck. |
| [#168611](https://github.com/openclaw/openclaw/pull/168611) | Created 2026-10-10 (**~3 weeks**) | `stale`, `platinum hermit` rating, `merge-risk: automation` — high-quality test PR stalled. |
| [#170956](https://github.com/openclaw/openclaw/issues/170956) | Created 2026-10-13 | **P0, no fix PR, 27 comments** — the single most urgent backlog item. Needs an owner. |
| [#187900](https://github.com/openclaw/openclaw/issues/187900) | Created 2026-10-29 | **Fresh P1 `doctor` hang on Linux** — if this spreads, it blocks all self-repair. Triage quickly. |

**Backlog verdict:** The biggest risk is not lack of attention but **clustering of no-fix-PR P0/P1 issues** (#170956, #70903, #177656, #182476, #187900) around the state/Doctor subsystem. Two issues with **linked open PRs** (#150635, #166017) are quick wins that should be unblocked. Several long-lived security/product-decision requests (#6615, #10687, #44309) are aging past 7 months without resolution.

---

*Digest generated from GitHub data snapshot 2026-10-31. All links point to github.com/openclaw/openclaw.*

---

## Cross-Ecosystem Comparison

# Cross-Project Comparison Report: Personal AI Assistant / Agent Open-Source Ecosystem
**Snapshot date: 2026-10-31** | Projects analyzed: OpenClaw, Hermes Agent, IronClaw, QwenPaw, ZeroClaw

---

## 1. Ecosystem Overview

The personal AI assistant / agent open-source landscape as of late October 2026 is **bifurcating into a mature core and a long tail of specialized runtimes**. The reference implementation (OpenClaw) is deep in a stabilization window — high contributor throughput but accumulating state-lifecycle and platform-parity debt — while challenger projects (Hermes Agent, QwenPaw, ZeroClaw) are actively iterating on domain-specific concerns: Kanban worker orchestration, desktop packaging, and Windows security hardening respectively. A consistent pattern across all active projects is that the **gateway / session lifecycle layer is the operational center of gravity and the most fragile component** — bugs there propagate into memory loss, work loss, and silent correctness failures. Community feedback uniformly rewards **loud, retryable failures** and punishes silent ones, and Windows remains the weakest platform across nearly every project. The ecosystem is transitioning from "does it work?" to "does it work reliably under production workloads (multi-session, multi-channel, always-on)?"

---

## 2. Activity Comparison

| Project | Issues (24h) | PRs (24h) | PRs Merged/Closed (24h) | Release Status | Health Score | Notes |
|---|---|---|---|---|---|---|
| **OpenClaw** | 490 touched (337 open / 153 closed) | 500 touched (236 open / 264 merged) | 264 | ✅ v2026.10.10-beta.5 (patch) | 🟢 Strong throughput / 🔴 stability debt | Highest raw activity; P0 cluster unassigned |
| **Hermes Agent** | 50 (46 open / 4 closed) | 50 (42 open / 8 merged) | 8 | ⚪ None | 🟡 Active, backlog rising | Gateway/Kanban lifecycle bugs dominant |
| **QwenPaw** | 8 (6 open / 2 closed) | 32 (21 open / 11 merged) | 11 | ⚪ None (beta.1 from 10-27) | 🟢 Healthy, post-beta hardening | Fast fix turnaround (~24h) |
| **ZeroClaw** | 20 (all open) | 50 (all open) | 0 | ⚪ None | 🟡 High intake / zero ship | Windows security sweep; merge-constrained |
| **IronClaw** | 0 | 1 (Dependabot only) | 0 | ⚪ None | ⚪ Quiet / neutral | No development signal in window |

*Health score is a composite judgment from the source digests: throughput, backlog pressure, severity of open bugs, release cadence, and merge velocity.*

---

## 3. OpenClaw's Position

**Advantages vs peers.** OpenClaw operates at a different order of magnitude: **~1,000 touched items/day vs. 30–70 for challengers**, and it is the only project shipping a release in this window (even if narrowly scoped). Its merge throughput (264 PRs merged) exceeds the *total daily intake* of every other project combined, indicating a mature CI/triage culture (bot-assisted labeling, release-migration fixtures, community-generated fixes landing).

**Technical approach differences.** OpenClaw is the **generalist runtime**: multi-channel (WhatsApp, Feishu, Telegram, WebChat, iMessage), MCP-based tool dispatch, an ambitious "dreaming"/memory-promotion subsystem, cron/scheduled agents, and a `doctor` self-repair tool. Its breadth is unmatched, but that breadth is precisely where its stability debt concentrates — the **state-lease / integrity-admission subsystem** recurs across ≥5 P0/P1 issues, and its flagship memory feature (dreaming) has lifecycle correctness bugs. Peers are narrower and therefore generally more stable per-surface.

**Community size comparison.** OpenClaw's 337 open / 153 closed issue ratio and 27-comment P0 threads reflect a large, vocal, production-dependent user base. Communicators report real workflows (WhatsApp-facing agents, scheduled automation), implying a user base closer to *deployment* than *evaluation*. By contrast, Hermes (46 open) and ZeroClaw (20 open) have technically rigorous but smaller audiences; IronClaw shows near-zero engagement in this window. **OpenClaw remains the de facto reference and the gravitational center of the ecosystem**, but its lead is now measured in reliability, not features.

---

## 4. Shared Technical Focus Areas

Requirements emerging independently across multiple projects — these are ecosystem-level signals, not project quirks:

| Requirement | Projects Affected | Specific Need |
|---|---|---|
| **Windows platform parity** | OpenClaw (#170956 restarts, #182476 `update repair`), Hermes (#63796, #102259, #139952, #146994), ZeroClaw (~14-issue sweep, #12118–#12134), QwenPaw (#8488, #8502) | Reliable install/update, correct env forwarding (`APPDATA`/`LOCALAPPDATA`), private DACLs, process-tree kill, CJK path handling |
| **Gateway / session lifecycle durability** | OpenClaw (state-lease split-brain), Hermes (#145022, #145999, #147004), ZeroClaw (#12130 session quotas) | Fencing/recovery after stalls, work-in-progress preservation, cross-reboot session wedge recovery |
| **Silent-failure elimination** | Hermes (#146853 Exa throttle → "success, 0 results"), QwenPaw (#8500 Auto-Dream silent loss, #8488 no-op), OpenClaw (#70903 stale cooldown) | Failures must be loud, classified, and retryable; status must be honest |
| **Outbound-action security / approval** | OpenClaw (#6615 denylist for exec-approvals), QwenPaw (#8513 shell-wrapped exfiltration gap), ZeroClaw (#12118 allowlist bypass, #12126 UNC credential leak) | Bound governance to actual execution path; allow-all-except-X mode; no workspace-shadowed binaries |
| **Third-party / OpenAI-compatible provider robustness** | QwenPaw (#8505 status-in-message-text), Hermes (#145182 aux vision fallback, #145259 multiplexed directory), OpenClaw (#10687 dynamic discovery) | Parse non-canonical error shapes; dynamic model discovery; per-provider config |
| **Memory lifecycle correctness** | OpenClaw (dreaming #150635, #121232, #65374), QwenPaw (#8500) | Promotion must actually run; no silent drop; no cross-agent identity contamination |
| **Prompt-cache / cost efficiency** | ZeroClaw (#11703, #11698), Hermes (#134640 model-gated prompt ablation) | Avoid system-prompt mutation; keep personality files stable; measurable cost win |

**Cross-cutting insight:** The two most urgent ecosystem-level requirements are **(a) a coordinated session/lease recovery architecture** and **(b) a credible Windows hardening milestone**. Both appear in every active project.

---

## 5. Differentiation Analysis

| Dimension | OpenClaw | Hermes Agent | QwenPaw | ZeroClaw | IronClaw |
|---|---|---|---|---|---|
| **Feature focus** | Generalist runtime: memory/dreaming, cron, MCP, multi-channel | Kanban multi-worker orchestration, evals, session mgmt | Desktop-first assistant, local review models, i18n/community | Security-hardened coding infra, RAG RFC, plugin registries | Unclear (dormant) |
| **Target users** | Production always-on assistants; broad prosumer→enterprise | Multi-worker / scheduler power users | Desktop/CJK-market users; privacy-conscious | Durable long-lived coding sessions; security-sensitive | — |
| **Architecture** | Gateway + state-lease DB + plugin/skill system + dreaming pipeline | Gateway + LocalSessionAdapter + worker lifecycle + FIFO wake | PyInstaller desktop packaging + plugin agents + gateway | Daemon + named pipes + shell/runtime sandboxing + ZeroCode TUI | WebUI frontend focused |
| **Signature strength** | Breadth + community scale | Technical rigor + detailed instrumentation | Fix velocity + i18n | Security audit discipline | — |
| **Signature weakness** | State-lease contention; `doctor` unreliability | Gateway liveness / session fencing | Desktop packaging parity; silent failures | Zero merge velocity; Windows bug cluster | No activity |

**Reading:** OpenClaw competes on *coverage*; Hermes on *orchestration depth*; QwenPaw on *desktop polish and Chinese-market fit*; ZeroClaw on *security posture*. There is little direct feature collision — the ecosystem is differentiating along operational axes rather than racing to clone the same assistant.

---

## 6. Community Momentum & Maturity

**Activity tiers:**

- **Tier 1 — High velocity:** **OpenClaw** (reference-scale, stabilization phase) and, at a smaller scale, **Hermes Agent** (rapid iteration, rising backlog).
- **Tier 2 — Focused iteration:** **QwenPaw** (post-beta hardening with fast fix turnaround) and **ZeroClaw** (high intake, blocked shipping).
- **Tier 3 — Dormant:** **IronClaw** (single dependency PR; no development signal).

**Iterating vs. stabilizing:**
- **Stabilizing:** **OpenClaw** (only release is a Node-compat patch; maintainers holding back features until stability issues resolve) and **QwenPaw** (beta.1 → fix-PR wave, pre-stable).
- **Rapidly iterating:** **Hermes** (Kanban lifecycle, security-boundary tightening, sessions prune) and **ZeroClaw** (Windows security sweep, RAG/quotas/plugin-registry RFCs).
- **Constrained:** **ZeroClaw** is the clearest *momentum-maturity mismatch* — strong, rigorous intake in aggregate, but **0 merges / 0 releases today** means backlog depth is growing faster than capability. This is the "mature contribution, immature shipping cadence" trap.
- **Flat:** **IronClaw** shows no evidence of active development; treat as low-signal until it produces issue/PR movement.

---

## 7. Trend Signals

Distilled from cross-project community feedback, these are the trends most valuable to AI-agent developers building or adopting in this space:

1. **Reliability is the new feature race.** Every project's hottest threads concern correctness, not capability. Shipping a "dreaming" or "Kanban" feature that silently no-ops (#8488, #8500) or loses WIP on a stall (#145022) damages trust more than never shipping it. **Design for loud, classified, retryable failure from day one.**

2. **The session/gateway layer is the systemic weak point.** State-lease contention (OpenClaw), liveness-watchdog fencing (Hermes), and session-quota rigidity (ZeroClaw) are the *same architectural problem* wearing three hats: **coordination state and recovery semantics across a long-lived daemon**. Treat session fencing, lease ownership, and crash-recovery as a first-class subsystem with its own invariants and tests — not as plumbing.

3. **Windows is the ecosystem's credibility gap.** Four of five projects show Windows-specific defects spanning install/update, permissions, env forwarding, and path/encoding. For developers targeting prosumer or enterprise deployment, **Windows parity is now a table-stakes requirement**, not a nice-to-have.

4. **Security boundaries are being tested at the execution edge.** Shell-wrapped outbound actions (QwenPaw #8513), workspace-shadowed binaries bypassing allowlists (ZeroClaw #12118), and UNC-triggered credential leaks (ZeroClaw #12126) show that approval systems must bind to the *actual* execution path — argument-level allowlists are insufficient. Expect **allow-all-except-X (denylist) approval modes** and **bound-context plugin auth** to become standard.

5. **Cost transparency and prompt-cache stability are emerging power-user requirements.** ZeroClaw's prompt-cache-bust cluster (#11703, #11698) and rigid cost caps (#11589) mirror Hermes' eval-driven prompt ablation (#134640). As agents run always-on, **prompt-cache preservation and per-model prompt hygiene translate directly to dollars** and are becoming roadmap items.

6. **Provider robustness beats provider count.** The recurring failure mode is not "missing a provider" but "mis-classifying a provider's error" (QwenPaw #8505 status-in-message-text; Hermes #145182 aux-vision fallback). Robust, format-tolerant error parsing and dynamic model discovery (OpenClaw #10687) are higher-leverage than adding another adapter.

7. **Operator-owned knowledge (RAG) is the next major capability request.** ZeroClaw's RAG RFC (#11235) signals demand for document grounding from operator-controlled corpora. This is likely to become a differentiation frontier as generalist runtimes (OpenClaw) and focused runtimes diverge.

8. **Self-repair tooling must itself be reliable.** OpenClaw's `doctor` hangs (#187900, #178359, #164948) are a meta-risk: when the rescue path fails, users have no recovery vector. **Any diagnostic/repair tool deserves the same reliability bar as the primary path.**

---

### Bottom line for decision-makers
- **Adopting a generalist runtime:** OpenClaw is the reference and the most feature-complete, but budget for reliability headwinds — particularly Windows and state-lease/`doctor` issues — and track the pending denylist/dynamic-discovery landings.
- **Building on a focused runtime:** Hermes (orchestration), QwenPaw (desktop/i18n), and ZeroClaw (security) offer clearer per-surface stability today, at the cost of breadth.
- **Investing in the ecosystem:** The highest-leverage, cross-project contributions are session/lease recovery hardening and Windows parity — the same two requirements appear at the top of every project's pain list.

---

## Peer Project Reports

<details>
<summary><strong>Hermes Agent</strong> — <a href="https://github.com/nousresearch/hermes-agent">nousresearch/hermes-agent</a></summary>

# Hermes Agent — Project Digest
**Date: 2026-10-31** | Source: [github.com/NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent)

---

## 1. Today's Overview

Hermes Agent shows **very high sustained activity** with 50 issues and 50 PRs updated in the last 24 hours, though no new releases shipped. The open/active issue ratio (46 of 50) and open PR ratio (42 of 50) indicate the tracker is accumulating faster than it is being drained — a mild backlog-pressure signal. Today's merged/closed activity was light (4 issues, 8 PRs), dominated by maintenance, security bumps, and CI/Windows test fixes rather than headline features. The dominant themes are **Kanban worker/session reliability**, **gateway event-loop liveness and fencing**, **Windows/install-update friction**, and **provider/adapter edge cases** (Codex, Matrix, Exa, BlueBubbles, OpenRouter vision). Overall project health is **active and responsive**, but the concentration of P1/P2 gateway and session-state bugs suggests the gateway/session layer is the current stability bottleneck.

---

## 2. Releases

**None.** No new releases in the last 24 hours. The most recent referenced versions in the tracker are `v0.22.4` / `v0.22.5`, with some issues noting `main` at `bf0203a794a` and `v0.22.5+1855.g642dfd1 (2026.9.24)`.

---

## 3. Project Progress (Merged / Closed Today)

**Closed Issues (4):**
- [#63796](https://github.com/NousResearch/hermes-agent/issues/63796) — Windows 11 Smart App Control blocking embedded Python `_ssl` bootstrap (desktop install-update).
- [#147013](https://github.com/NousResearch/hermes-agent/issues/147013) — `api_server` stamped sessions `source=hermes_browser` but three admission gates refused them (`permission_denied`); fixed same-day.
- [#142962](https://github.com/NousResearch/hermes-agent/issues/142962) — `chore(catalog)`: limbic plugin catalog entry bumped to `0.9.0`.
- [#139952](https://github.com/NousResearch/hermes-agent/issues/139952) — Windows Desktop recurring "Updating Hermes" splash blocking frontend 15+ min per cycle.

**Merged/Closed PRs (8, selected):**
- [#118111](https://github.com/NousResearch/hermes-agent/pull/118111) — `fix(git)`: disable optional locks in bounded probes (addresses `.git/index.lock` contention). *Salvaged forward as [#147031](https://github.com/NousResearch/hermes-agent/pull/147031).*
- [#143888](https://github.com/NousResearch/hermes-agent/pull/143888) — `fix(web)`: own mobile IME edits at `beforeinput` (Android xterm PTY input fix).
- [#143102](https://github.com/NousResearch/hermes-agent/pull/143102) — `fix(web)`: contain overscroll for mobile menu.

**Net assessment:** Progress today was **maintenance-weighted** — security dependency bumps ([#147028](https://github.com/NousResearch/hermes-agent/pull/147028), [#147029](https://github.com/NousResearch/hermes-agent/pull/147029)), Windows CI/test fixes ([#146657](https://github.com/NousResearch/hermes-agent/pull/146657)), and mobile/web polish. No large feature landed.

---

## 4. Community Hot Topics

| Rank | Item | Comments | Link |
|------|------|----------|------|
| 1 | **#127647** — Tracker: Desktop idle resource burn (renderer CPU/GPU, backend serve CPU, memory) | **34** | [#127647](https://github.com/NousResearch/hermes-agent/issues/127647) |
| 2 | **#145022** — Kanban workers crash "execution unknown; retained by owner" when gateway stalls | **12** | [#145022](https://github.com/NousResearch/hermes-agent/issues/145022) |
| 3 | **#143268** — LOCAL Kanban notify+wake never reaches session FIFO (`LocalSessionAdapter` has no `gateway_runner`) | **12** | [#143268](https://github.com/NousResearch/hermes-agent/issues/143268) |
| 4 | **#63796** — Windows 11 Smart App Control blocks embedded Python `_ssl` *(closed)* | 8 | [#63796](https://github.com/NousResearch/hermes-agent/issues/63796) |
| 5 | **#30989** — BlueBubbles attachments arrive as second event, interrupt in-progress turn | 6 | [#30989](https://github.com/NousResearch/hermes-agent/issues/30989) |
| 6 | **#142741** — launchd bootstrap retry never kickstarts registered-but-not-running gateway job | 6 | [#142741](https://github.com/NousResearch/hermes-agent/issues/142741) |

**Underlying needs:**
- **#127647** is a meta-tracker (scope map) — the community is coordinating a *systemic* fix to desktop resource consumption, indicating this is a top user pain point that's hard to pin to one PR. Its high comment count reflects maintainer-organized triage rather than pure user chatter.
- **Kanban reliability (#145022, #143268)** is the *second* hot cluster: users running multi-worker Kanban boards are losing work-in-progress on gateway stalls and silent FIFO wake failures. This points to a **durability/recovery gap** in the worker-session lifecycle.
- The recurring presence of gateway, session-FIFO, and liveness issues across the top slots signals the gateway is the project's **operational center of gravity** — and its most fragile component.

---

## 5. Bugs & Stability

**P1 — Critical**
- **#145022** — Kanban workers crash with exit code 1; **one gateway stall killed 4 workers simultaneously**, WIP lost. [Link](https://github.com/NousResearch/hermes-agent/issues/145022). *No fix PR identified yet.*

**P2 — High (selected, with fix status)**
- **#145999** — Gateway event loop blocks on `state.db get_meta()` in post-turn hooks → 30s liveness watchdog kills process, fences in-flight turns as `unknown`. [Link](https://github.com/NousResearch/hermes-agent/issues/145999). *Related fix PR: [#144865](https://github.com/NousResearch/hermes-agent/pull/144865) (loop-liveness dump).*
- **#147004** — Fenced `unknown` turn after Telegram adapter crash **wedged session across a full reboot**; only operator CLI recovers. [Link](https://github.com/NousResearch/hermes-agent/issues/147004).
- **#146853** — Exa free-tier throttle returns HTTP 200 text → `web_search` reports success with 0 results; `web_extract` returns throttle notice as page content. **Silent data-correctness bug.** [Link](https://github.com/NousResearch/hermes-agent/issues/146853).
- **#146973** — Kanban iteration-budget settlement writes a **false `timed_out` event on an already-`done` card** and arms `retry_status: ready`. [Link](https://github.com/NousResearch/hermes-agent/issues/146973).
- **#146994** — Windows console scripts fail with `ModuleNotFoundError` (stale editable `direct_url` after re-staging). [Link](https://github.com/NousResearch/hermes-agent/issues/146994).
- **#145182** — `auxiliary.vision` fallback sends auxiliary model to auto-detected provider → `400 <local model> is not a valid model ID`. [Link](https://github.com/NousResearch/hermes-agent/issues/145182).
- **#145259** — Multiplexed gateway refreshes only the launch home's channel directory; named profiles' file stays frozen. [Link](https://github.com/NousResearch/hermes-agent/issues/145259).
- **#143465** — Desktop `browser_vault save_login` immediately returns `prompt_unavailable` on canonical gateway. [Link](https://github.com/NousResearch/hermes-agent/issues/143465).
- **#142741** — macOS launchd retry treats "registered" as "running"; restart fails. [Link](https://github.com/NousResearch/hermes-agent/issues/142741).
- **#140202** — Cron throttled live-adapter send (WeChat/iLink breaker) loses push. **Fix PR open.** [Link](https://github.com/NousResearch/hermes-agent/pull/140202).

**P3 — Medium/Low**
- **#143691** (security) — runtime self-delete floor resolves relative paths against agent cwd, ignoring a preceding `cd`. [Link](https://github.com/NousResearch/hermes-agent/issues/143691).
- **#134779** (perf) — short-CJK `session_search` with time filters scans corpus; SQLite work outlives tool timeout (~420s observed). [Link](https://github.com/NousResearch/hermes-agent/issues/134779).
- **#128384** — Windows kanban reclaim kills only the venv launcher; real worker + tool children keep running. [Link](https://github.com/NousResearch/hermes-agent/issues/128384).
- **#26451** — Skill discovery recurses into hidden workspace dirs, surfacing vendored skills. [Link](https://github.com/NousResearch/hermes-agent/issues/26451).
- **#73417** — Kanban `goal_mode` judge loop **never runs** (zero executions over 97 tasks / 7 weeks). [Link](https://github.com/NousResearch/hermes-agent/issues/73417).

**Fix PRs open today targeting stability:** [#147034](https://github.com/NousResearch/hermes-agent/pull/147034) (Kanban worker import isolation), [#147033](https://github.com/NousResearch/hermes-agent/pull/147033) (reject incompatible PR review handoffs), [#147032](https://github.com/NousResearch/hermes-agent/pull/147032) (cron dotted-member lifecycle false positives), [#147030](https://github.com/NousResearch/hermes-agent/pull/147030) (serialize cron ledger writes vs SQLite contention), [#146666](https://github.com/NousResearch/hermes-agent/pull/146666) (Matrix room-alias resolution before send).

**Stability verdict:** Elevated bug inflow concentrated in **gateway liveness, session fencing/recovery, and Kanban worker lifecycle**. Several have active fix PRs; #145022 and #147004 (cross-reboot session wedge) are the most concerning for production users.

---

## 6. Feature Requests & Roadmap Signals

- **#134640** — *evals:* ablate model-gated prompt guidance blocks per model release (GPT-6 still receives the GPT-5.4 execution block). Tagged `needs-decision`, `from-harness-scout`. Signals a **model-steering hygiene / eval-driven harness** direction. [Link](https://github.com/NousResearch/hermes-agent/issues/134640). *Likely candidate for near-term harness work.*
- **#108582** — `feat(sessions)`: exact-selection prune from a frozen, verified plan (long-running since Sept 11, still open). [Link](https://github.com/NousResearch/hermes-agent/pull/108582). Session-management feature likely to land soon given prolonged review.
- **#146368** (security) — `fix(plugins)`: require bound Gateway source context for hosted callbacks; derive identity only from bound ContextVars, no env fallback. [Link](https://github.com/NousResearch/hermes-agent/pull/146368). Roadmap signal: **hardening the plugin/security boundary**.
- **#143937** — Plugin dependency resolution fails for packages without Android wheels on Python ≥3.14 (`cua-spaces`). `cause/upstream`, `blocked`. Signals **Python 3.14 compatibility** as an emerging ecosystem concern. [Link](https://github.com/NousResearch/hermes-agent/issues/143937).
- **#139875** — `fix(telegram)`: persist and surface learned forum-topic names (salvaged/consolidated PR). Community-driven feature consolidation. [Link](https://github.com/NousResearch/hermes-agent/pull/139875).

**Prediction:** The next version is most likely to emphasize **gateway/session reliability hardening** (liveness dump, fencing recovery, Kanban lifecycle) plus **security-boundary tightening for plugins**, rather than net-new user-facing features. Session prune (#108582) and eval-driven prompt ablation (#134640) are the most likely *feature* additions.

---

## 7. User Feedback Summary

**Pain points (dissatisfaction):**
- **Desktop resource burn** (#127647) remains the loudest sustained complaint — CPU/GPU/memory on idle.
- **Windows experience** is repeatedly painful: Smart App Control bootstrap (#63796), PATH shadowing another install (#136346), zombie single-instance lock blocking launches (#102259), 15-minute update splashes (#139952), kanban reclaim leaving orphan children (#128384), and stale editable installs (#146994).
- **Silent correctness failures** erode trust: Exa throttle returned as "success with 0 results" (#146853); Kanban false `timed_out` on done cards (#146973); cron read-only-after-first-reply (#131433).
- **Work loss on crashes** (#145022, #147004) — users explicitly note WIP loss and multi-worker simultaneous death.
- **Documented behavior not matching reality**: `/quit --delete` deletes nothing (#144486).

**Positive signals / use cases:**
- Multi-worker Kanban boards at scale (97 tasks, 50 jobs/minute 0) — users are pushing the scheduler hard.
- Multiplexed gateways with named profiles (#145259) — advanced multi-tenant usage.
- Cross-platform deployments: Nix (#144616), macOS launchd, Windows arm64, Linux systemd — broad real-world footprint.

**Satisfaction:** High engagement and detailed, well-instrumented reports (logs, versions, measurements) suggest a technically sophisticated, invested user base — but one increasingly vocal about **gateway/session reliability and Windows onboarding friction**.

---

## 8. Backlog Watch (Long-Unanswered / Needs Maintainer Attention)

| Item | Age | Why it matters |
|------|-----|----------------|
| [#73417](https://github.com/NousResearch/hermes-agent/issues/73417) — Kanban `goal_mode` judge loop never runs (zero executions / 97 tasks) | Since **2026-07-28** (~3 months) | Structural unreachability; P3 but functionally disables a documented feature. |
| [#30989](https://github.com/NousResearch/hermes-agent/issues/30989) — BlueBubbles attachment interrupt (no debounce/merge) | Since **2026-05-23** (~5 months) | Core messaging UX parity gap vs Telegram; P2. |
| [#30323](https://github.com/NousResearch/hermes-agent/issues/30323) — leftover `/steer` applied after queued follow-up | Since **2026-05-22** (~5 months) | Subtle agent-control ordering bug. |
| [#26451](https://github.com/NousResearch/hermes-agent/issues/26451) — Skip hidden workspace dirs in skill discovery | Since **2026-05-15** (~5.5 months) | Skill correctness; low effort, no movement. |
| [#102259](https://github.com/NousResearch/hermes-agent/issues/102259) — Windows elevated zombie holds single-instance lock, silently blocks all launches | Since **2026-09-03** | High user impact on Windows; no fix PR. |
| [#136346](https://github.com/NousResearch/hermes-agent/issues/136346) — Windows PATH prepend runs another installation | Since **2026-10-10** | Cross-install interference; shared-profile warning loop. |
| [#108582](https://github.com/NousResearch/hermes-agent/pull/108582) — sessions exact-selection prune | Since **2026-09-11** (PR) | Long-running feature PR; needs review/merge decision. |
| [#128311](https://github.com/NousResearch/hermes-agent/pull/128311) — Desktop remote gateway WebSocket (private-CA / LNA) | Since **2026-09-29** | Blocks remote-gateway desktop connectivity; P2. |

**Recommendation:** Prioritize triage of the **long-lived Kanban/messaging bugs (#73417, #30989, #30323)** and the **Windows single-instance lock (#102259)**, which have broad user impact and no active fix PRs.

---

### Health Snapshot
| Signal | Reading |
|--------|---------|
| Activity | 🟢 Very high (50 issues + 50 PRs/24h) |
| Throughput | 🟡 Moderate (4 issues / 8 PRs closed) |
| Backlog pressure | 🟡 Rising (46 open issues, 42 open PRs) |
| Stability | 🔴 Gateway/session & Kanban lifecycle bugs dominant |
| Releases | ⚪ None in 24h |
| Community | 🟢 Highly engaged, technically detailed reports |

*Data as of 2026-10-31; comment/reaction counts are point-in-time snapshots. All links resolve to github.com/NousResearch/hermes-agent.*

</details>

<details>
<summary><strong>IronClaw</strong> — <a href="https://github.com/nearai/ironclaw">nearai/ironclaw</a></summary>

# IronClaw Project Digest — 2026-10-31

## Today's Overview
IronClaw (github.com/nearai/ironclaw) showed minimal activity over the past 24 hours, with no issues updated and no new releases published. The only activity was a single open Dependabot pull request (#8164) bumping the `happy-dom` dev dependency in the WebUI frontend from 20.11.1 to 21.0.4. This points to a quiet maintenance day with no feature development, bug fixes, or community discussion in motion. Overall project health appears stable but passive in this window — routine dependency upkeep is occurring, but there are no signals of active development momentum or user-reported problems.

## Releases
No new releases were published in the last 24 hours. Nothing to report on changes, breaking changes, or migration notes.

## Project Progress
- **Merged/closed PRs today:** 0
- **Features advanced or fixed today:** None

No code was merged or closed, so no functionality was delivered or repaired in this window. The lone open PR (#8164) remains unmerged and is dependency-related rather than feature-oriented.

## Community Hot Topics
There were no active Issues or PRs with meaningful community engagement today.
- The single PR in scope — [#8164](https://github.com/nearai/ironclaw/pull/8164) (dependencies, javascript) — has 0 👍 and no recorded comments, so it does not constitute a hot topic.

**Underlying needs analysis:** With zero issue activity and no discussion on the only open PR, there is insufficient signal to infer current community priorities. This absence itself may suggest either a mature, low-friction period or reduced user engagement worth monitoring.

## Bugs & Stability
No bugs, crashes, or regressions were reported today (0 issues updated). There are no open bug reports to rank by severity, and consequently no fix PRs associated with stability work. Stability status is therefore **neutral/unknown** — not because issues are resolved, but because none surfaced.

## Feature Requests & Roadmap Signals
No feature requests were filed or discussed today. Without new issues or PR discussion, there are no direct roadmap signals to report. The only directional hint is indirect: ongoing Dependabot maintenance in the WebUI frontend (`/crates/product/ironclaw_webui/frontend`) suggests continued investment in the web UI layer, but this is speculative and not tied to a specific upcoming feature.

## User Feedback Summary
No user feedback was captured today through GitHub issues or PR comments. As a result, there are no observable pain points, use cases, or satisfaction/dissatisfaction signals to summarize. This is a data limitation rather than evidence of user contentment.

## Backlog Watch
No long-unanswered issues were present for review today (0 total issues). The single open PR, [#8164](https://github.com/nearai/ironclaw/pull/8164), was created and last updated on 2026-10-30 — only one day old — so it does not yet qualify as backlog requiring maintainer attention. Maintainers should simply verify the `happy-dom` major-version bump (20 → 21) is CI-compatible before merging, as major version jumps in test-environment dependencies can occasionally introduce breaking behavior in the WebUI test suite.

---
**Note on data completeness:** Today's digest is constrained by a near-empty activity window (0 issues, 0 merges, 0 releases). Conclusions about project health are therefore based on limited evidence and should be weighed against trends over a longer period.

</details>

<details>
<summary><strong>QwenPaw</strong> — <a href="https://github.com/agentscope-ai/QwenPaw">agentscope-ai/QwenPaw</a></summary>

# QwenPaw Project Digest — 2026-10-31

## 1. Today's Overview

QwenPaw shows **high-velocity development activity** in the last 24 hours: 32 PRs updated (21 open, 11 merged/closed) and 8 issues touched (6 open/active, 2 closed), with no new releases. The project is in the middle of the **v2.3.0-beta.1 stabilization cycle** — the beta shipped on 2026-10-27 and its release-duty verification issue (#8456) was closed on 2026-10-30, triggering a wave of desktop-build follow-up bugs and fixes. Activity is skewed toward **bug fixing and hardening rather than new feature work**, with multiple independent contributors (passionworkeer, Frank-zhu2000, Luohh5, jinliyl) submitting fix PRs within hours of issue reports. The most notable open risks are a **security detector gap for outbound shell commands** (#8513) and a **silent memory-loss bug in Auto-Dream** (#8500), both of which lack merged fixes as of today. Overall project health is good, but the beta has surfaced a cluster of platform-specific (Windows/desktop) defects that should be resolved before stable release.

## 2. Releases

**No new releases in the last 24 hours.** The latest published artifact remains **v2.3.0-beta.1 (Beta)**, released 2026-10-27; its installation-verification tracking issue (#8456) was closed on 2026-10-30. Since there is no new version, there are no new breaking changes or migration notes to report today. However, the volume of post-beta fix PRs (see §3) suggests a follow-up beta or release candidate is likely in the near term.

## 3. Project Progress

**Merged/closed PRs today (11 total), highlights:**

- **[#8508](https://github.com/agentscope-ai/QwenPaw/pull/8508) [CLOSED, size/XL] `fix(workspace)`: remove legacy workspace ZIP APIs** — Removes legacy workspace ZIP download/upload APIs, unused Console wrappers, and tests. Notably, the ZIP merge could overwrite live SQLite files and failed on Windows after #8482; normal file upload/download, project ZIP import, and Backup & Restore are unchanged. This is a meaningful stability win for Windows users.
- **[#8507](https://github.com/agentscope-ai/QwenPaw/pull/8507) [CLOSED, size/S] `fix(console)`: remove shared memory tag test fixture dependency** — Fixes a Docker frontend build failure (TS2307/TS2345) in the Release #50 pipeline by removing the shared `memory_tags_contract.json` fixture and its cross-layer parameterized tests.
- **[#8483](https://github.com/agentscope-ai/QwenPaw/pull/8483) [CLOSED, size/S] `fix(plugins)`: keep a failing import-cache refresh from taking out the plugin system** — Fixes a `TypeError` from `importlib.invalidate_caches()` on hosts with CPython 3.11.9+ paired with older `importlib.metadata` (e.g., Debian 12's 3.11.2) that caused **every backend plugin to fail loading**.
- **[#7896](https://github.com/agentscope-ai/QwenPaw/pull/7896) [CLOSED, first-time-contributor] `fix(channels)`: recheck idle queues after awaiting consumer shutdown** — Prevents dropped messages when a stale idle-queue candidate list causes active queues to be cancelled.
- **[#6041](https://github.com/agentscope-ai/QwenPaw/pull/6041) [CLOSED, first-time-contributor] `fix(loop)`: exempt read-only tools from doom loop detection (#5906)** — Fixes false-positive doom-loop termination when users legitimately read memory repeatedly (3+ reads warned, 6+ terminated).
- **[#8379](https://github.com/agentscope-ai/QwenPaw/pull/8379) [CLOSED, size/XS] `fix(tests)`: let a full pytest run collect both `test_backup` modules** — Repairs the documented local test gate (`pytest`), which previously aborted during collection with exit code 2 on a clean `main` checkout.

**Notable open PRs advancing work:**
- **[#8514](https://github.com/agentscope-ai/QwenPaw/pull/8514)** (fix for #8488): bundle `visual_compression` glyph atlas assets into the PyInstaller desktop build.
- **[#8512](https://github.com/agentscope-ai/QwenPaw/pull/8512)** (fix for #8505): parse gateway-reported status codes from error text to restore retry/fallback behavior.
- **[#8504](https://github.com/agentscope-ai/QwenPaw/pull/8504) [size/XXXL]**: desktop approval notifications (#8460).
- **[#8426](https://github.com/agentscope-ai/QwenPaw/pull/8426) [size/XXXL]**: extract third-party agents into plugins.

## 4. Community Hot Topics

Activity is issue-driven today; the most-discussed items (by comment count) are:

1. **[Issue #8488](https://github.com/agentscope-ai/QwenPaw/issues/8488) — Desktop build omits `visual_compression` assets** (3 comments, OPEN) — Windows desktop 2.3.0-beta.1 raises `FileNotFoundError: atlas-gray-native.ts`; Visual Compact silently no-ops on every eligible model call. **Underlying need:** users need context-compression features to work identically in packaged desktop builds as in source installs; silent no-ops are especially harmful because users cannot tell the feature is broken. *Fix PR exists: [#8514](https://github.com/agentscope-ai/QwenPaw/pull/8514).*
2. **[Issue #8505](https://github.com/agentscope-ai/QwenPaw/issues/8505) — Bare `openai.APIError` with status only in message text classified as `unknown`** (2 comments, OPEN) — A mid-stream 502 from an OpenAI-compatible gateway yields no retry and no model fallback because `extract_status_code()` only recognizes a narrow set of fields. **Underlying need:** robust interoperability with third-party/self-hosted OpenAI-compatible gateways, which are common in the China/relay ecosystem; silent non-retry turns transient network faults into hard failures. *Fix PR exists: [#8512](https://github.com/agentscope-ai/QwenPaw/pull/8512).*
3. **[Issue #8500](https://github.com/agentscope-ai/QwenPaw/issues/8500) — Auto-Dream silently drops memory** (2 comments, OPEN) — When the extract step cannot parse the agent's reply, files are checkpointed anyway, so the day's memory is never retried while the run reports `success=True`. **Underlying need:** data durability and honest status reporting for memory features — silent data loss is one of the highest-severity UX failures for a personal assistant. **No fix PR yet.**

Frequently recurring themes across today's items: desktop packaging parity with source builds, gateway/provider compatibility, and trustworthy success/failure reporting.

## 5. Bugs & Stability

Ranked by severity (all reported/updated 2026-10-29–30):

| Severity | Issue | Description | Fix PR? |
|---|---|---|---|
| 🔴 Critical (Security) | **[#8513](https://github.com/agentscope-ai/QwenPaw/issues/8513)** | Shell-wrapped outbound actions (SMTP send / HTTP POST / @file-to-network) execute with no findings or approval under `AUTO`/`SMART`; gap in both `tool_guard` and governance lanes. Potential exfiltration vector. | ❌ None yet |
| 🔴 Critical (Data loss) | **[#8500](https://github.com/agentscope-ai/QwenPaw/issues/8500)** | Auto-Dream silently discards a full day of memory on extract-parse failure, checkpoints files anyway, reports `success=True`. Never retried. | ❌ None yet |
| 🟠 High | **[#8505](https://github.com/agentscope-ai/QwenPaw/issues/8505)** | Gateway 502 with status only in message text classified `unknown` → no retry, no fallback. | ✅ [#8512](https://github.com/agentscope-ai/QwenPaw/pull/8512) |
| 🟠 High | **[#8502](https://github.com/agentscope-ai/QwenPaw/issues/8502)** | Desktop HTML preview "Open in browser" fails: Chinese paths → "file not found"; files outside workspace → no response. Windows 11, zh-CN locale. | ❌ None yet |
| 🟡 Medium | **[#8488](https://github.com/agentscope-ai/QwenPaw/issues/8488)** | Desktop build omits visual_compression assets; Visual Compact silently no-ops. | ✅ [#8514](https://github.com/agentscope-ai/QwenPaw/pull/8514) |
| 🟡 Medium | **[#8511](https://github.com/agentscope-ai/QwenPaw/issues/8511)** | Feishu channel: intermittent `ProviderError: No active model configured` when a message arrives while the agent is still processing the previous one. Reproduced on v2.2.2, so not beta-introduced. | ❌ None yet |
| ⚪ Low | **[#8486](https://github.com/agentscope-ai/QwenPaw/issues/8486)** (CLOSED) | Console tool-call `<` icon clipped on left edge; container lacks horizontal padding. Cosmetic. | Closed 2026-10-30 |

**Notable pattern:** three of today's bugs (#8488, #8502, and the Windows path/encoding class generally) are **desktop/Windows-specific**, indicating the PyInstaller packaging path and CJK path handling deserve focused QA before the stable 2.3.0 release.

## 6. Feature Requests & Roadmap Signals

No brand-new feature requests were filed in the last 24h, but several in-flight PRs reveal the near-term roadmap:

- **Desktop approval notifications (#8460)** — [PR #8504](https://github.com/agentscope-ai/QwenPaw/pull/8504) adds system notifications for approval requests when QwenPaw runs in the background, deliberately not exposing tool-call parameters in the notification body and deep-linking on click. Likely to land in the next release.
- **Local Piccolo model with bidirectional candidate scoring** — [PR #8463](https://github.com/agentscope-ai/QwenPaw/pull/8463) would let downloaded Piccolo models supply native Jev decisions for tool review and ReMe context compaction (a causal Chat Completions adapter cannot reproduce its trained inference behavior). Signals continued investment in **local, privacy-preserving review models**.
- **Configurable Whisper API model name** — [PR #8052](https://github.com/agentscope-ai/QwenPaw/pull/8052), open since 2026-09-30, addresses a real gap: `transcription_model` is hard-coded to `"whisper-1"`, breaking non-OpenAI providers (e.g., SiliconFlow's `FunAudioLLM/SenseVoiceSmall`).
- **Third-party agent plugin extraction** — [PR #8426](https://github.com/agentscope-ai/QwenPaw/pull/8426) moves third-party agents into plugins, consistent with the plugin-architecture direction.
- **Embedded Community & Inbox** — [PR #7903](https://github.com/agentscope-ai/QwenPaw/pull/7903) (open since 2026-09-20) adds a community feed, Platform PKCE account linking, and issue reporting from within the app.

**Prediction:** the next release will emphasize desktop reliability (asset bundling, path handling, notifications) and provider compatibility (status-code parsing, configurable transcription model) rather than headline features.

## 7. User Feedback Summary

**Pain points expressed by users today:**

- **Silent failures are the dominant complaint.** Users repeatedly report features that fail without visible error: Visual Compact no-ops (#8488), Auto-Dream reports success while dropping data (#8500), and "Open in browser" does nothing for out-of-workspace files (#8502). The community expectation is clearly that **failures must be loud and retryable**.
- **CJK/Windows environments are underserved.** Issue #8502 (Chinese paths breaking HTML preview) and PR #8067 (CJK emphasis boundaries broken in rendered Markdown — e.g., `**没有改动任何设置。**` failing due to CommonMark flanking rules treating CJK sentence punctuation as Unicode punctuation) show a recurring class of i18n defects. Given the user base, this is a high-leverage area.
- **Platform parity matters.** Desktop packaging lag (#8488) and the Debian 3.11 plugin failure (#8483) frustrated users on non-reference environments.
- **Positive signal:** contributors are responsive — three of today's bugs already have candidate fix PRs within ~24 hours, and first-time contributors are getting fixes merged (#7896, #6041), indicating a healthy onboarding funnel.

**Satisfaction/dissatisfaction:** dissatisfaction is concentrated in reliability and i18n rather than missing features; the pace of fix PRs suggests maintainer responsiveness is mitigating frustration.

## 8. Backlog Watch

Long-unanswered or aging items needing maintainer attention:

- **[PR #7903](https://github.com/agentscope-ai/QwenPaw/pull/7903) — `feat(community)`: integrate QwenPaw community and inbox** — Open since **2026-09-20** (~6 weeks), size/XXXL, awaiting human review. Large feature with account linking and issue reporting; at risk of bit-rot.
- **[PR #8067](https://github.com/agentscope-ai/QwenPaw/pull/8067) — `fix(channels)`: repair CJK emphasis boundaries in rendered Markdown** — Open since **2026-10-01**, tagged "Under Review," no recent resolution despite recurring CJK i18n complaints. High user impact relative to size.
- **[PR #8052](https://github.com/agentscope-ai/QwenPaw/pull/8052) — `feat(transcription)`: make Whisper API model name configurable** — Open since **2026-09-30**; small-scope fix for a clear functional gap, appears stuck in review.
- **[PR #8066](https://github.com/agentscope-ai/QwenPaw/pull/8066) — `fix(agents)`: drop empty media blocks before formatting requests** — Open since **2026-10-01**; empty base64 `DataBlock`s produce `data:image/png;base64,` URIs rejected by all providers. Straightforward robustness fix awaiting review.
- **[PR #6041](https://github.com/agentscope-ai/QwenPaw/pull/6041)** (doom-loop false positives) finally closed 2026-10-30 after being open since **2026-07-13** — a cautionary example of a low-risk fix that lingered ~3.5 months.

**Recommendation:** The maintainer team should triage the "Under Review" queue (especially #8067, #8052, #8066) and assign reviewers to #7903 and #8426, both of which are large feature branches vulnerable to merge conflicts if left idle. Meanwhile, the two critical open issues without fixes (#8513 security gate gap, #8500 silent memory loss) should be prioritized ahead of new feature work given their severity.

---
*Digest generated from GitHub activity data for 2026-10-30/31. All links refer to github.com/agentscope-ai/QwenPaw.*

</details>

<details>
<summary><strong>ZeroClaw</strong> — <a href="https://github.com/zeroclaw-labs/zeroclaw">zeroclaw-labs/zeroclaw</a></summary>

# ZeroClaw Project Digest — 2026-10-31

## 1. Today's Overview

ZeroClaw shows **very high issue and PR throughput but zero merge/close activity** in the last 24 hours: 20 issues were updated (all still open) and 50 PRs were touched (all still open), with no releases cut. The day's activity is dominated by a **large Windows security/hardening bug sweep** from a single reporter (IftekharUddin filed ~14 issues in one batch), which suggests either a focused security audit or a coordinated hardening sprint. Long-running contribution threads from Audacity88 (ZeroCode TUI/UX features) continue to accumulate updates without merging, indicating a maturing review backlog rather than stalled work. Overall project health reads as **active but merge-constrained** — high signal intake, low shipping velocity today.

## 2. Releases

No new releases in the last 24 hours. Latest release channel remains v0.9.0 (referenced in issue tags such as `release:v0.9.0`).

## 3. Project Progress

**No PRs were merged or closed today**, and no new releases were published. That said, several PRs received fresh review updates and are candidates to land soon:

- [#12135](https://github.com/zeroclaw-labs/zeroclaw/pull/12135) — `fix(runtime): forward APPDATA and LOCALAPPDATA into Windows shell children` (size XS, pairs with bug #12133)
- [#12136](https://github.com/zeroclaw-labs/zeroclaw/pull/12136) — `fix(config)!: forbid /mnt,/media,/run/media and Windows drive/UNC defaults` (breaking-flagged, fixes #12134)
- [#11882](https://github.com/zeroclaw-labs/zeroclaw/pull/11882) — Goal V1 proposal slice 5/12 (supervised execution epochs), explicitly not independently merge-ready
- [#11698](https://github.com/zeroclaw-labs/zeroclaw/pull/11698) — personality-file stability to avoid prompt-cache busts
- [#11529](https://github.com/zeroclaw-labs/zeroclaw/pull/11529) — ZeroCode local Linux clipboard writers

Net effect: groundwork is laid, but nothing has shipped into `master` in this window.

## 4. Community Hot Topics

Most-active threads by comment count:

| Item | Comments | Link |
|---|---|---|
| #11235 RFC: Knowledge corpus — document retrieval (RAG) for the agent | 7 | [issue](https://github.com/zeroclaw-labs/zeroclaw/issues/11235) |
| #10926 [Bug]: Matrix `send_via` treats peer user identities as room destinations | 6 | [issue](https://github.com/zeroclaw-labs/zeroclaw/issues/10926) |
| #11703 perf(runtime): deferred tool activation busts prompt cache | 3 | [issue](https://github.com/zeroclaw-labs/zeroclaw/issues/11703) |

**Underlying needs analysis:**
- The RAG RFC (#11235) reflects growing demand for **operator-owned document grounding** — users want the agent to answer from their own language/tool/OS/security references rather than relying solely on model knowledge.
- The Matrix bug (#10926) and prompt-cache perf issue (#11703) both point to **channel/runtime correctness and cost efficiency** as top-of-mind concerns for power users running multi-channel deployments.

## 5. Bugs & Stability

Ranked by severity. Nearly all new bugs reported today are Windows-platform-specific and were filed by IftekharUddin, with matching fix PRs in a few cases.

### S1 / S0 — Workflow-blocking or security-risk
- **[#12126](https://github.com/zeroclaw-labs/zeroclaw/issues/12126)** — Outbound attachment markers canonicalize model-supplied paths before workspace check; on Windows a UNC target triggers daemon SMB/WebDAV authentication to an attacker. *(credential disclosure risk)*
- **[#12134](https://github.com/zeroclaw-labs/zeroclaw/issues/12134)** — Default `forbidden_paths` miss `/mnt` (WSL), `/media`, non-system Windows drives, UNC paths. **Fix PR: [#12136](https://github.com/zeroclaw-labs/zeroclaw/pull/12136)**
- **[#12120](https://github.com/zeroclaw-labs/zeroclaw/issues/12120)** — Windows daemon state (TLS keys, relay signing key, OAuth state, admin token, SQLite) written with inherited DACLs, not private ones.
- **[#12118](https://github.com/zeroclaw-labs/zeroclaw/issues/12118)** — `cmd.exe` dialect resolves bare commands from workspace first, so a workspace-written `git.bat` executes as the allowlisted `git`. *(allowlist bypass)*
- **[#12128](https://github.com/zeroclaw-labs/zeroclaw/issues/12128)** — `cargo audit` fails on every build due to RUSTSEC-2026-0420..0424 (Wasmtime 48.0.7). **Blocks CI security gate.**

### S2 — Degraded behavior
- [#12133](https://github.com/zeroclaw-labs/zeroclaw/issues/12133) — Windows shell/skill/hardware omit `APPDATA`/`LOCALAPPDATA` → CLIs like `gh`, `npm` behave logged out. **Fix PR: [#12135](https://github.com/zeroclaw-labs/zeroclaw/pull/12135)**
- [#12127](https://github.com/zeroclaw-labs/zeroclaw/issues/12127) — `git_operations` follows `gitdir:`/`commondir`/alternates before authorization (UNC auth on Windows).
- [#12124](https://github.com/zeroclaw-labs/zeroclaw/issues/12124) — Windows defaults miss `%APPDATA%\gnupg`, GitHub CLI, DPAPI, browser profiles; hard-coded `C:\` paths.
- [#12123](https://github.com/zeroclaw-labs/zeroclaw/issues/12123) — Local RPC named pipe inherits default DACL (Everyone/Anonymous can open it), contradicting the `0o600`-spirit comment.
- [#12122](https://github.com/zeroclaw-labs/zeroclaw/issues/12122) — Windows prebuilt installers skip SHA256SUMS verification (install.sh and `zeroclaw update` do verify).
- [#12121](https://github.com/zeroclaw-labs/zeroclaw/issues/12121) — `setup.bat` uses `setx %PATH%`, duplicating machine PATH into user PATH and cropping at 1024 chars.
- [#12119](https://github.com/zeroclaw-labs/zeroclaw/issues/12119) — Windows shell timeouts kill only the interpreter; descendants keep running.
- [#10926](https://github.com/zeroclaw-labs/zeroclaw/issues/10926) — Matrix `send_via` misroutes peers as rooms (accepted, follow-up).

### S3 — Minor
- [#11703](https://github.com/zeroclaw-labs/zeroclaw/issues/11703) — `tool_search` activation mutates system prompt → repeated prompt-cache misses (cost impact).

**Assessment:** Today's bug intake is heavily Windows-focused, which suggests either a dedicated Windows hardening milestone or a security review results dump. Only 2 of the ~14 new bugs have published fix PRs at time of writing.

## 6. Feature Requests & Roadmap Signals

Active enhancement/RFC issues:

- [#11235](https://github.com/zeroclaw-labs/zeroclaw/issues/11235) — **RAG / knowledge corpus** (RFC, high risk, p2) — the most significant roadmap signal in the queue.
- [#11119](https://github.com/zeroclaw-labs/zeroclaw/issues/11119) — **Receiver-discretionary session messaging** tracker (implementation home for accepted RFC #11027), aimed at runtime-owned agent-to-agent messaging.
- [#12131](https://github.com/zeroclaw-labs/zeroclaw/issues/12131) — **Shared execution permissions and same-identity credential renewal** (RFC, security).
- [#12130](https://github.com/zeroclaw-labs/zeroclaw/issues/12130) — **Configurable daemon session quotas with local-operator reserve** (replacing the fixed 64-session limit).
- [#12109](https://github.com/zeroclaw-labs/zeroclaw/issues/12109) — **Multiple plugin registry URLs** (comma-separated `ZEROCLAW_PLUGIN_REGISTRY_URL`).
- [#12125](https://github.com/zeroclaw-labs/zeroclaw/issues/12125) — Release signed-in chat socket session watch when a send is stalled.

**Prediction:** The **RAG/knowledge corpus (#11235)** and **session quota configurability (#12130)** are the likeliest near-term roadmap inclusions if maintainer bandwidth is available; both address concrete operational pain for multi-session/enterprise deployments. The plugin-registry request (#12109) is small enough to be a quick win in a maintenance release.

## 7. User Feedback Summary

- **Pain — Windows parity gaps:** A dense cluster of user-reported issues (#12118–#12134) shows the Windows build is materially behind Unix in security defaults, env forwarding and process control. This is the single largest satisfaction risk in today's data.
- **Pain — cost transparency:** #11703 and #11589 (`cost.allow_override` documented but unread) reflect frustration that cost-cap behavior is opaque and rigid; users cannot override an exceeded limit without a daemon restart.
- **Pain — install trust:** #12122 (Windows installers skipping checksum verification) directly undermines trust in the distribution pipeline.
- **Use case signal:** Multi-session workloads (one session per worktree) hitting the fixed 8-session ZeroCode pane cap (#11731) and the daemon's 64-session limit (#12130) show users are running ZeroClaw as durable, long-lived coding infrastructure rather than short-lived sessions.
- **Satisfaction signal:** High-quality, well-annotated reports (severity tiers, code references, RFC triggers) suggest a technically engaged user base willing to co-invest in fixes.

## 8. Backlog Watch

Items needing maintainer attention due to age + importance:

- **[#11235](https://github.com/zeroclaw-labs/zeroclaw/issues/11235)** RAG RFC — open since 2026-09-29, last updated today, `needs-author-action`, high risk. Needs a decision on scope.
- **[#10926](https://github.com/zeroclaw-labs/zeroclaw/issues/10926)** Matrix `send_via` misroute — open since 2026-09-17, `status:accepted`, `follow-up`. Accepted but unfixed for ~6 weeks.
- **[#11119](https://github.com/zeroclaw-labs/zeroclaw/issues/11119)** Session-messaging tracker — open since 2026-09-25, 0 comments. Silent tracker; requires maintainer coordination to activate.
- **[#11703](https://github.com/zeroclaw-labs/zeroclaw/issues/11703)** Prompt-cache bust on `tool_search` — open since 2026-10-13, only 3 comments; cost-relevant and likely easy to prioritize.
- **PR [#11882](https://github.com/zeroclaw-labs/zeroclaw/pull/11882)** Goal V1 slice 5/12 — self-declared not merge-ready; contributes to PR backlog depth.
- **PR [#11871](https://github.com/zeroclaw-labs/zeroclaw/pull/11871)** MiniMax model refresh — tagged `stale-candidate` and `needs-author-action`; small provider maintenance that risks going stale.
- **PR [#11698](https://github.com/zeroclaw-labs/zeroclaw/pull/11698)** personality-file prompt-cache fix — pairs conceptually with #11703, but sits unmerged; addressing both together would deliver a measurable cost win.

---

**Health snapshot:** Intake is strong and technically rigorous; the primary constraint is **shipping velocity** (0 merges/0 releases today) and a growing queue of high-severity Windows security bugs awaiting PR coverage. The prompt-cache and cost-override items (#11703, #11589, #11698) collectively represent a low-risk, high-user-visible cluster that maintainers could bundle into a near-term patch.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*