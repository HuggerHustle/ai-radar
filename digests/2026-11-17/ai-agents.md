# OpenClaw Ecosystem Digest 2026-11-17

> Issues: 322 | PRs: 500 | Projects covered: 5 | Generated: 2026-11-17 03:41 UTC

- [OpenClaw](https://github.com/openclaw/openclaw)
- [Hermes Agent](https://github.com/nousresearch/hermes-agent)
- [IronClaw](https://github.com/nearai/ironclaw)
- [QwenPaw](https://github.com/agentscope-ai/QwenPaw)
- [ZeroClaw](https://github.com/zeroclaw-labs/zeroclaw)

---

## OpenClaw Deep Dive

# OpenClaw Project Digest — 2026-11-17

## 1. Today's Overview

OpenClaw shows **extremely high development velocity** with 322 issues updated and 500 PRs touched in the last 24 hours, alongside a fresh release (v2026.11.4). Activity is heavily concentrated on **stability and performance regressions**: several P0/P1 issues around Gateway event-loop blocking, SQLite WAL checkpointing, and update/rollback reliability remain open and active. The maintenance team (steipete, obviyus, vincentkoc, roboclaw-bot) is shipping a steady stream of targeted fixes, but the sheer volume of open P1/P2 crash-loop and session-state bugs suggests the project is under growing load from production-scale deployments. Overall project health is **good on throughput, strained on stability** — regressions introduced around the 2026.9.6–2026.11.x window are still being worked through.

---

## 2. Releases

### v2026.11.4 — `openclaw 2026.11.4`
- **Scale:** 220 commits · 125 PRs · 90 contributors
- **Release notes / changelog:** https://docs.openclaw.ai/releases/202... (publication marker: `openclaw-release-publication:docs-v1`)
- No explicitly documented breaking changes in the digest data; however, several issues reference upgrade-path problems leading into/out of 11.x (see §5).
- **Migration caution:** Issue #197083 documents a "partially finalized" 11.1 → 11.3 upgrade where post-install Doctor failed WAL publication verification and left external plugins incomplete. Users on managed npm installs should verify post-upgrade state.

> ⚠️ Beta line also active: `2026.11.5-beta.3` is being tested, with update validation failures reported on Windows (#199617).

---

## 3. Project Progress

**PR throughput today:** 268 PRs merged/closed vs. 232 open — a healthy merge rate.

Notable merged/closed PRs and their direction:

| PR | Status | Impact |
|---|---|---|
| [#200339](https://github.com/openclaw/openclaw/pull/200339) | CLOSED | Fixes Knowledge plugin first-save/lookup failures (prompt missing call shapes) |
| [#200350](https://github.com/openclaw/openclaw/pull/200350) | CLOSED | Stops infinite retries of unpreservable worktree cleanup — reclaims disk |
| [#198251](https://github.com/openclaw/openclaw/pull/198251) | CLOSED | iOS: keeps conversation history visible during agent discovery |
| [#200338](https://github.com/openclaw/openclaw/pull/200338) | CLOSED | Lets interrupted Control UI builds recover on restart |
| [#200366](https://github.com/openclaw/openclaw/pull/200366) | CLOSED | Keeps `openclaw` runnable if a pnpm/Bun update is SIGKILLed mid-replace |

**In-flight high-value PRs (open, ready for maintainer look):**
- [#200374](https://github.com/openclaw/openclaw/pull/200374) — prevent Gateway stalls while copying reload recovery (directly targets the P0 #160959 class)
- [#200355](https://github.com/openclaw/openclaw/pull/200355) — agent session searches no longer stall on large histories
- [#200370](https://github.com/openclaw/openclaw/pull/200370) — readiness probes stop freezing the main thread (incident follow-up)
- [#200389](https://github.com/openclaw/openclaw/pull/200389) — leave a replaced installation to the owning update run

**Feature advancement:** guest/role-based session access ([#184515](https://github.com/openclaw/openclaw/pull/184515)), WhatsApp phone-code login ([#101294](https://github.com/openclaw/openclaw/pull/101294)), Git-checkout release-based updates ([#199706](https://github.com/openclaw/openclaw/pull/199706)).

---

## 4. Community Hot Topics

| Item | Type | Comments | Why it matters |
|---|---|---|---|
| [#160959](https://github.com/openclaw/openclaw/issues/160959) | Issue (P0, crash-loop) | **83** | Gateway blocks for minutes capturing large external plugins — the top pain point; 2026.9.6 regression. Fix PRs #200374/#200370 are converging. |
| [#164294](https://github.com/openclaw/openclaw/issues/164294) | Issue (P2) | **41** | WAL auto-checkpoint never completes (pinned by in-process reader) — DB growth risk. |
| [#191944](https://github.com/openclaw/openclaw/issues/191944) | Issue (P2, UX) | **34** | `gateway stop`/`stop --force` fail on macOS with process-ancestry error. |
| [#150635](https://github.com/openclaw/openclaw/issues/150635) | Issue (P2, data-loss) | **28** | Short-term recall eviction prevents dreaming deep-phase promotion — memory subsystem correctness. |
| [#200374](https://github.com/openclaw/openclaw/pull/200374) | PR (XL) | New | Fix for the #160959 stall class. |

**Underlying needs:** Users are running OpenClaw at production scale (multi-agent, GB-scale SQLite state, large plugin trees) where **event-loop blocking and state-store contention** dominate. The community is demanding predictable Gateway behavior under load and safe, resumable updates.

---

## 5. Bugs & Stability

Ranked by severity (P0/P1 first):

**P0 / Crash-loop**
- [#160959](https://github.com/openclaw/openclaw/issues/160959) — Gateway blocks minutes on large plugin capture (regression). Fix PRs open: [#200374](https://github.com/openclaw/openclaw/pull/200374), [#200370](https://github.com/openclaw/openclaw/pull/200370).
- [#169844](https://github.com/openclaw/openclaw/issues/169844) — Windows Control UI update hangs at "Activating", leaves Scheduled Task disabled/gateway stopped.

**P1 — High impact**
- [#185578](https://github.com/openclaw/openclaw/issues/185578) — Gateway heap floor ratchets up ~25 MiB/h (per-run prompt/skills strings stay reachable) until V8 cap aborts.
- [#194403](https://github.com/openclaw/openclaw/issues/194403) — Helper-completion continuations invalidate their own authority, blocking conversations.
- [#162497](https://github.com/openclaw/openclaw/issues/162497) — SQLite worker store capped at 64; ~64-agent gateways fail every turn with "temporary internal error".
- [#185111](https://github.com/openclaw/openclaw/issues/185111) — Large-session context reads scan the full transcript (19–25s) before applying limits.
- [#196505](https://github.com/openclaw/openclaw/issues/196505) — `memory index --force` aborts with "worker task capacity reached" on ~864 MiB corpora, no retry.
- [#160762](https://github.com/openclaw/openclaw/issues/160762) — claude-cli + Telegram drops mid-turn messages; drained prompt carries previous message body.
- [#65624](https://github.com/openclaw/openclaw/issues/65624) — **(Security)** Mattermost slash-command cleartext callback URLs expose reusable tokens (CVSS 8.6). Needs security review.

**P2 — Notable**
- [#164294](https://github.com/openclaw/openclaw/issues/164294) (WAL), [#191944](https://github.com/openclaw/openclaw/issues/191944) (macOS stop), [#197083](https://github.com/openclaw/openclaw/issues/197083) (partial update finalization), [#143017](https://github.com/openclaw/openclaw/issues/143017) (prompt-cache prefix rewrites, 21.3M cache-write tokens measured), [#143973](https://github.com/openclaw/openclaw/issues/143973) (`view_image` base64 = 80% of transcript bytes), [#182616](https://github.com/openclaw/openclaw/issues/182616) (63m50s update copying 3.4 GiB SQLite state).

**Regression watch:** Multiple issues explicitly tie themselves to the 2026.9.6 → 2026.11.x window (#160959, #158127, #160762). This suggests a stability-focused patch cycle is warranted.

---

## 6. Feature Requests & Roadmap Signals

| Feature request | Link | Likelihood |
|---|---|---|
| One-way A2A dispatch (no reply-back ping-pong) | [#44309](https://github.com/openclaw/openclaw/issues/44309) (closed stale) | Medium — relevant for orchestration |
| Plugin-driven Dreams page (`dreaming` provider) | [#138366](https://github.com/openclaw/openclaw/issues/138366) | Medium |
| Rendered Markdown preview in Review files | [#128090](https://github.com/openclaw/openclaw/issues/128090) (👍4) | High — small, high-value UI win |
| Expose auth profile in `/usage` footer | [#169428](https://github.com/openclaw/openclaw/issues/169428) | High — parity with `/status` |
| IMAP durable processing handoff | [#179685](https://github.com/openclaw/openclaw/issues/179685) | Medium |
| Installation-aware post-upgrade survey | [#159743](https://github.com/openclaw/openclaw/issues/159743) | High — directly ties to update-pain cluster |
| Manual team-sidebar agent ordering | [#155039](https://github.com/openclaw/openclaw/issues/155039) | Medium |

**Prediction for next release:** Expect (a) hardening of the update path (survey/recovery windows, safe mid-update kill handling), (b) Gateway event-loop/perf fixes, and (c) small UX additions to Review/Usage surfaces.

---

## 7. User Feedback Summary

**Pain points (verbatim theme clusters):**
- *"Gateway blocks for minutes"*, *"Settings sluggish"*, *"update hangs at Activating"* — **performance and lifecycle reliability on desktop (macOS/Windows)**.
- *"message sent mid-turn is dropped"*, *"dead-lettered outbound entries are permanent"* — **message-loss and queue permanence**.
- *"memory index aborts"*, *"recall evicts entries nightly"* — **memory subsystem correctness at scale**.
- *"45-minute updates / 28m downtime"* (#182616) — **update downtime is a top operational complaint**.

**Satisfaction signals:** 90 contributors on a single release and heavy PR engagement indicate an engaged community; several long-running bugs are moving toward closure (#200339, #200350, #198251).

**Dissatisfaction:** Recurring tones of "partially finalized update", "left disabled", "no CLI/RPC/TTL can clear them" — users want **self-healing and observability** on destructive operations.

---

## 8. Backlog Watch

Long-lived or high-severity items needing maintainer attention:

| Item | Age | Concern |
|---|---|---|
| [#65624](https://github.com/openclaw/openclaw/issues/65624) (P1 security) | ~7 months | Token exposure; flagged `needs-security-review`, no resolution. |
| [#112313](https://github.com/openclaw/openclaw/issues/112313) (dead-lettered queue entries) | ~4 months | Closed but historically permanent data trap — verify fix coverage. |
| [#92473](https://github.com/openclaw/openclaw/issues/92473) | ~5 months | Internal fallback notice leaking to user channels (info disclosure). |
| [#101294](https://github.com/openclaw/openclaw/pull/101294) | ~4.5 months | WhatsApp phone-code login — XL PR "waiting on author", long-stalled. |
| [#106998](https://github.com/openclaw/openclaw/pull/106998) | ~4 months | WhatsApp JID normalization — XL, still open. |
| [#114414](https://github.com/openclaw/openclaw/issues/114414) | recurring | Dated-TODO sweep with overdue CI/workflow items. |
| [#140455](https://github.com/openclaw/openclaw/issues/140455) | ~2.5 months | Google Meet agent voice broken (circular-JSON crash). |

**Maintainer recommendation:** Prioritize (1) closing the security issue #65624, (2) either merging or explicitly deferring the two long-stalled WhatsApp XL PRs, and (3) consolidating the 2026.9.6 regression cluster into a coordinated patch release.

---
*Digest generated from GitHub activity data for 2026-11-17. Data reflects issues/PRs updated within the last 24h; comment counts are as reported at snapshot time.*

---

## Cross-Ecosystem Comparison

# Cross-Project Comparison Report — Personal AI Assistant / Agent Open-Source Ecosystem
**Snapshot Date: 2026-11-17** | Projects: OpenClaw, Hermes Agent, IronClaw, QwenPaw, ZeroClaw

---

## 1. Ecosystem Overview

The personal AI assistant / agent open-source landscape on 2026-11-17 is **high-velocity but stability-strained**. Four of five tracked projects show sustained daily throughput in the dozens-to-hundreds of issues and PRs, yet nearly all exhibit review-queue bottlenecks and regression clusters tied to recent releases. A common maturation arc is visible: projects that began as single-user assistants (OpenClaw, QwenPaw) are now being deployed at production scale (multi-agent, multi-tenant, GB-scale state), exposing event-loop, cost-accounting, and lifecycle-reliability defects that were never stress-tested in early development. Security and safety defaults are simultaneously becoming a first-class concern (credential scoping, prompt-injection persistence, autonomous computer-use policy). The ecosystem is entering a **hardening phase** where correctness, observability, and predictable cost behavior outweigh new feature velocity.

---

## 2. Activity Comparison

| Project | Issues (24h) | PRs (24h) | Release Status | Health Score (qualitative) |
|---|---|---|---|---|
| **OpenClaw** | 322 updated | 500 touched (268 merged/closed, 232 open) | ✅ v2026.11.4 shipped (220 commits, 90 contributors); beta 11.5-beta.3 | **Good throughput, strained stability** — P0/P1 regression cluster open |
| **Hermes Agent** | 50 updated (49 open / 1 closed) | 50 updated (45 open / 5 merged) | ✅ v0.23.2 patch (~1,989 PRs rolled up); canary active | **Strong throughput, accumulating stability debt** — multi-surface P2 fragmentation |
| **QwenPaw** | 43 updated (29 open / 14 closed) | 50 updated (37 open / 13 merged) | ❌ None (v2.3.0 in wild, v2.3.1b1 on main) | **High velocity, bug-heavy** — v2.3.0 regression fallout unresolved |
| **ZeroClaw** | 12 active (0 closed) | 50 updated (47 open / 3 merged) | ❌ None (0.9.0 baseline) | **Architecture-strong, review-bound** — P1 cost-control cluster unfixed |
| **IronClaw** | 0 | 0 | ❌ None | **Dormant (24h window)** |

**Reading the table:** OpenClaw operates at roughly an order of magnitude more daily activity than peers (322 vs. ~12–50 issues). Hermes and QwenPaw are in the same mid-tier by raw PR volume, but Hermes shows a healthier merge ratio on a larger codebase. ZeroClaw has strong input volume but a ~6% merge rate — a clear review bottleneck. IronClaw reported no activity in the window and should be treated as separately-tracked.

---

## 3. OpenClaw's Position

**Advantages vs. peers**
- **Scale of contribution:** 90 contributors landed on a single release (v2026.11.4), dwarfing peer contribution bases; the 268-PR daily merge rate exceeds the *entire* 24h PR volume of any other project.
- **Production-grade pressure signals:** OpenClaw's issues read like a mature operations ticket queue (WAL checkpointing, multi-GB SQLite state, GB-scale plugin trees), whereas peers are still resolving foundational UX/regression bugs. The community is testing OpenClaw where no peer has yet been tested.

**Technical approach differences**
- OpenClaw leans into a **heavy local state model** (SQLite-backed session/gateway store, in-process readers) — the source of both its scalability strength and its current WAL/event-loop pain.
- Peers trend toward **plugin-extraction architecture** (Hermes moving Teams/Graph into `teams_pipeline`; QwenPaw building a Plugin SDK 1.1; ZeroClaw migrating to a canonical V5 provider registry). OpenClaw's plugin surface is real but its bottleneck is the **runtime host**, not plugin authoring.

**Community size comparison**
- OpenClaw: largest by far — comment threads of 83, 41, 34 on single issues; 90 contributors per release.
- Hermes Agent: sizable and engaged — 61-comment single-issue thread; first-time contributor flow visible.
- QwenPaw: technically sophisticated niche — multiple first-time contributors filing detailed, file-path-annotated reports.
- ZeroClaw: operator-focused — smaller but high-signal (security RFCs, cost-accounting reports).
- IronClaw: quiet in this window.

**Positioning conclusion:** OpenClaw is the **de facto reference implementation** by activity and contributor mass, but its current burden is stability of the core runtime, not ecosystem breadth. Its lead is real but is being maintained under the heaviest load, meaning peer stability advantages are partly an artifact of lower deployment pressure.

---

## 4. Shared Technical Focus Areas

Four convergent requirement clusters appear across **three or more** projects:

**A. Update/upgrade reliability & safe lifecycle**
- **OpenClaw:** partial 11.1→11.3 finalization (#197083), 45-min/28m-downtime updates (#182616), SIGKILL-mid-replace handling (#200366), "Activating" hangs (#169844).
- **Hermes Agent:** bundled plugin deps lost on `hermes update` (#134115), stale pin downgrades working installs (#156767).
- **QwenPaw:** upgrade duplicates credentials breaking multi-account channels (#8755).
- *Need:* self-healing, resumable, observable updates that leave systems cleanly recoverable.

**B. Cost telemetry & enforcement correctness**
- **ZeroClaw:** cost controls systematically broken — enforcement mode ignored (#12477), OpenRouter spend shows $0.00 (#11204), limits clearable only by daemon restart (#11585).
- **Hermes Agent:** subscription model billed to metered OpenRouter for 4 days (#156665).
- **QwenPaw:** cron/heartbeat token usage invisible in billing panel (#8705).
- *Need:* trustworthy, per-turn cost accounting that enforcement and dashboards can both rely on.

**C. Memory / context correctness at scale**
- **OpenClaw:** recall eviction blocks dreaming promotion (#150635), context reads scan full transcripts (#185111).
- **Hermes Agent:** lean compaction drops most user content (#136535), reasoning replay double-stuffs causing 400s (#147026).
- **QwenPaw:** continuation summary fails under reasoning budget (#8727).
- *Need:* bounded, correct context assembly and memory promotion under real token/latency budgets.

**D. Security defaults & secret hygiene**
- **OpenClaw:** Mattermost cleartext callback token exposure, CVSS 8.6, open ~7 months (#65624).
- **Hermes Agent:** unattended-context guard bypasses deny policies (#156677); `computer_use` disrupts displays even in yolo (#156670).
- **QwenPaw:** persistent prompt injection instructing skill deletion across 20+ turns (#7859).
- **ZeroClaw:** write-only credential management (#12373), scoped service-credential RFC (#12422).
- *Need:* least-privilege credential use, injection persistence mitigation, and explicit autonomous-action policy.

**E. Channel/multi-tenant isolation**
- **QwenPaw:** DingTalk 1:1 `session_id` collisions (#8771); two-account WeChat upgrade break (#8755).
- **OpenClaw:** guest/role-based session access in flight (#184515).
- **Hermes Agent:** cross-surface conversation addressing inconsistencies (#145459, #144709).
- *Need:* correct identity/session scoping for shared team and family installs.

---

## 5. Differentiation Analysis

| Dimension | OpenClaw | Hermes Agent | QwenPaw | ZeroClaw |
|---|---|---|---|---|
| **Feature focus** | Core runtime, gateway robustness, multi-channel at scale | Multi-surface (desktop, dashboard, mobile) agent orchestration; kanban workers | Plugin ecosystem, Console UX, channels (WeChat/DingTalk) | Provider abstraction, cost governance, security model |
| **Target users** | Production deployers, multi-agent operators | Individual power users + small teams on many surfaces | Plugin authors, Chinese-market channel users | Security-conscious operators with cost exposure |
| **Architecture** | Heavy local SQLite state; in-process gateway | Plugin-extraction (first-party → plugin); kanban worker model | Plugin SDK 1.1; MCP-as-plugin refactor | Rust-native; canonical V5 provider registry; native SSH broker |
| **Maturity axis** | Scaling pain from success | Surface-area fragmentation | Regression recovery (v2.3.0) | Architecture ahead of shipping |
| **Distinguishing bet** | Depth & scale of core | Breadth of interaction surfaces | Extensibility & theming | Discipline & security |

**Interpretation:** The projects are not direct substitutes. OpenClaw competes on **depth and operational scale**; Hermes on **surface breadth**; QwenPaw on **ecosystem extensibility**; ZeroClaw on **engineering rigor and cost/security governance**. A developer choosing between them is really choosing which failure mode they can tolerate — overload on OpenClaw, inconsistency on Hermes, churn on QwenPaw, or slow shipping on ZeroClaw.

---

## 6. Community Momentum & Maturity

**Activity tiers**
- **Tier 1 — Hyperactive:** OpenClaw (~10× peer volume; 90 contributors/release).
- **Tier 2 — High and sustained:** Hermes Agent, QwenPaw, ZeroClaw (all ~50 PRs/24h).
- **Tier 3 — Dormant:** IronClaw (no activity in window).

**Momentum character**
- **Rapidly iterating:** QwenPaw (plugin SDK, MCP extraction, many first-time contributors) and ZeroClaw (V5 registry migration series) are mid-refactor and shipping architecture.
- **Stabilizing under load:** OpenClaw is effectively in a **stability-focused patch cycle** — its release cadence is high but its dominant work is closing regressions in the 2026.9.6→11.x window.
- **Fragmenting:** Hermes Agent shows the classic maturity symptom of breadth — many small P2 bugs across many surfaces with no single subsystem dominating.

**Maturity read**
- **OpenClaw** is the most *operationally mature* (real production tickets) but currently the most *stability-constrained*.
- **Hermes Agent** is *feature-mature* but *consistency-immature*.
- **QwenPaw** is *ecosystem-immature* with a regression hangover.
- **ZeroClaw** is *architecturally mature* but *throughput-immature* (review bottleneck).

---

## 7. Trend Signals (Industry Implications)

Extracted from cross-project community feedback, ranked by signal strength:

1. **Production pressure has arrived.** OpenClaw's GB-scale SQLite and multi-agent gateways, Hermes' kanban concurrency crashes, and QwenPaw's multi-tenant channel collisions all indicate users are running these tools as **infrastructure**, not toys. Developers should design for **event-loop non-blocking, bounded state-store contention, and resumable lifecycle operations** from day one.

2. **Cost control is a trust surface, not a feature.** Three independent projects have cost-accounting/enforcement defects. ZeroClaw's cluster is severe enough that operators cannot trust spend. **Per-call usage ingestion, override semantics, and dashboard parity** are becoming table-stakes for any agent that touches metered APIs.

3. **Update safety is the new availability.** "45-minute updates," "left disabled," "partially finalized" recur across projects. The winning pattern is **atomic, resumable, self-healing updates with pre/post verification** — expect this to become a competitive differentiator.

4. **Plugin/registry architecture is consolidating.** Peers are all extracting first-party integrations into plugin/registry layers (Hermes Teams plugin, QwenPaw MCP/SDK refactor, ZeroClaw V5 registry). This signals an industry move toward **stable extension contracts and semantic versioning of capabilities** — relevant for anyone building an agent plugin ecosystem.

5. **Security defaults are being tightened deliberately.** Scoped credentials (ZeroClaw #12422), write-only secret management (#12373), and approval gates for autonomous computer use (Hermes #156670) show the community converging on **least-privilege + explicit-consent** as the default posture for agent autonomy.

6. **Memory correctness at scale remains unsolved.** No project has a clean answer for eviction-vs-promotion, compaction fidelity, or budget-bounded context assembly. This is the **largest open technical frontier** in the ecosystem.

7. **Review bandwidth, not contribution interest, is the binding constraint.** ZeroClaw (~6% merge rate), QwenPaw (37 open vs. 13 merged), and Hermes (45 open vs. 5 merged) all show healthy contributor input capped by maintainer throughput. Projects that invest in **review automation, triage bots, and clear decision SLAs** will convert community energy into shipped value faster than peers.

---

**Bottom line for decision-makers:** OpenClaw is the ecosystem's reference implementation and the best-tested at scale, but it is currently paying the price of that scale in stability. Hermes, QwenPaw, and ZeroClaw each offer differentiated value — surface breadth, extensibility, and security rigor respectively — while exhibiting their own characteristic immaturities. Across all five, the industry's next competitive frontier is **operational trust**: updates that never strand users, costs that are always accurate, memory that stays correct, and autonomy that stays within bounds.

---

## Peer Project Reports

<details>
<summary><strong>Hermes Agent</strong> — <a href="https://github.com/nousresearch/hermes-agent">nousresearch/hermes-agent</a></summary>

# Hermes Agent — Project Digest
**Date: 2026-11-17** | Repository: [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent)

---

## 1. Today's Overview

Hermes Agent remains in a high-velocity maintenance phase, with 50 issues and 50 PRs updated in the last 24 hours — a volume consistent with a large, actively-used codebase. The v0.23.2 patch release rolled up ~1,989 PRs merged since v0.23.1, indicating substantial cumulative work now shipping in stable channels (CLI, Microsoft Store, Docker, Hermes Cloud). However, the open/closed ratio is heavily skewed toward open items (49 open issues vs. 1 closed; 45 open PRs vs. 5 merged/closed), and the issue tracker is dominated by P2/P3 bugs spanning gateway, desktop, plugins, and session state. Overall project health is strong on throughput but shows accumulating stability debt in multi-surface areas (gateway settlement, session addressing, cross-platform plugin installs).

---

## 2. Releases

### v0.23.2 — [Release link](https://github.com/NousResearch/hermes-agent/releases)
- **Type:** Patch release (released November 16, 2026).
- **Contents:** Rolls up ~1,989 PRs merged since v0.23.1 into a stable release across GitHub (CLI/installers), Microsoft Store, Docker, and Hermes Cloud.
- **Breaking changes:** None declared in the release notes.
- **Migration notes:** None required. Full curated notes for this window are deferred to **v0.24**, so users seeking a detailed changelog should wait for that release.

### v0.23.1+canary.20261116T070005Z — [Release link](https://github.com/NousResearch/hermes-agent/releases)
- **Type:** Canary build (November 16, 2026).
- **Contents:** Standard canary snapshot with desktop downloads (macOS Apple Silicon DMG referenced in build table). No user-facing changelog.
- **Guidance:** Canary — intended for early testing, not production.

> ⚠️ **Note:** The v0.23.2 release notes are unusually sparse for a rollup of ~1,989 PRs. Users tracking regressions (see §5) may have difficulty bisecting issues against this release.

---

## 3. Project Progress

Only **5 PRs were merged/closed** in the last 24h, versus 45 still open — a low closure rate that suggests review bandwidth, not contributor interest, is the bottleneck.

**Closed/Merged today:**

| PR | Title | Type | Notes |
|---|---|---|---|
| [#156619](https://github.com/NousResearch/hermes-agent/pull/156619) | refactor(teams): Microsoft Graph auth and client move to teams_pipeline plugin | Refactor | Moves Graph token provider + REST client out of `tools/` into plugin; behavior preserved with one measured exception. |
| [#156608](https://github.com/NousResearch/hermes-agent/pull/156608) | fix(plugin api): publish `agent.retry_utils:parse_retry_after_seconds` | Feature/fix | Unblocks Teams plugin migration; used by Discord, Signal, Slack. |
| [#145459](https://github.com/NousResearch/hermes-agent/pull/145459) | fix(desktop): preserve local conversation address | Bug fix | **Closed in favor of [#150165](https://github.com/NousResearch/hermes-agent/pull/150165)**; patch credited into later commit. |

**Also referenced as closed via supersession:** [#150165](https://github.com/NousResearch/hermes-agent/pull/150165) absorbed the desktop conversation-address fix and test adjustments.

**Directional signal:** The Teams/Microsoft Graph refactor into a plugin, combined with the new `retry_utils` plugin API publication, indicates ongoing **plugin-architecture consolidation** — moving first-party integrations out of core `tools/` and into the plugin system.

---

## 4. Community Hot Topics

Ranked by comment count — these are the issues generating the most sustained discussion:

### 🔥 #131859 — [Cannot open a pull request via API: CreatePullRequest permission error](https://github.com/NousResearch/hermes-agent/issues/131859)
- **61 comments** | OPEN | P3, blocked, cause/upstream | Created 2026-10-03
- A fork account cannot open PRs via `gh pr create` despite issue creation and fork PRs working. Marked **blocked/upstream**, suggesting it's an external (GitHub-side) permission issue affecting a contributor's workflow. High comment count reflects contributor frustration with an unresolved external blocker.

### 🔥 #119070 — [kanban: rate-limited-then-succeeded card parked as `blocker_auth` forever](https://github.com/NousResearch/hermes-agent/issues/119070)
- **27 comments** | OPEN | P2, needs-decision | Created 2026-09-22
- `check_respawn_guard` perpetually returns `blocker_auth`, so reviewers never spawn. A **two-month-old, needs-decision** issue — the comment volume signals maintainer indecision on the correct state-machine fix.

### 🔥 #145022 — [Kanban workers crash: "Kanban execution unknown; retained by owner"](https://github.com/NousResearch/hermes-agent/issues/145022)
- **25 comments** | OPEN | P1, area/sessions | Created 2026-10-26
- One gateway stall killed 4 workers simultaneously; work-in-progress lost on retry. **Highest severity in the hot list (P1)** and directly tied to the kanban subsystem's reliability under concurrency.

### 🔥 #99943 — [Compressor context window clamped to `model.ollama_num_ctx` on cloud providers](https://github.com/NousResearch/hermes-agent/issues/99943)
- **13 comments** | OPEN | P2, risk-session-state, risk-compatibility | Created 2026-09-01
- A 1M-token window silently drops to 65,536 when `ollama_num_ctx` is set, regardless of active endpoint. **Oldest hot issue (2.5 months)** and a clear correctness bug affecting cost/quality on cloud providers.

**Underlying needs analysis:** The hot list clusters around **two themes**: (1) *Kanban/worker orchestration reliability* (#119070, #145022) — users running parallel agent workers are hitting state-machine and concurrency bugs; and (2) *configuration correctness across providers* (#99943) — a config key intended for local Ollama is leaking into cloud routing decisions.

---

## 5. Bugs & Stability

Ranked by severity. Regressions/bugs updated today:

### P1 — Critical
- **[#145022](https://github.com/NousResearch/hermes-agent/issues/145022)** — Kanban workers crash with "execution unknown; retained by owner" during gateway stalls. WIP lost. *(No linked fix PR identified.)*

### P2 — High
- **[#99943](https://github.com/NousResearch/hermes-agent/issues/99943)** — Context window silently clamped to 65,536 on cloud providers (regression since v0.21.0). *Fix PR: none identified.*
- **[#145296](https://github.com/NousResearch/hermes-agent/issues/145296)** — Dashboard chat: Android soft-keyboard input dropped (xterm `screenReaderMode`). Mobile usability broken.
- **[#136535](https://github.com/NousResearch/hermes-agent/issues/136535)** — Lean compaction verbatim user-message block misses most user content (budget filled newest-first, head-only cut).
- **[#148682](https://github.com/NousResearch/hermes-agent/issues/148682)** — Desktop drops image attachments from `prompt.submit`; `mime` discarded in staging branch. *(1 👍)*
- **[#147026](https://github.com/NousResearch/hermes-agent/issues/147026)** — Reasoning replay double-stuffs `reasoning` + `reasoning_content` → multi-turn HTTP 400 on strict hosts.
- **[#139253](https://github.com/NousResearch/hermes-agent/issues/139253)** — `browser_exec` hardcodes `image/png` for JPEG screenshots → Anthropic 400 kills the turn.
- **[#146852](https://github.com/NousResearch/hermes-agent/issues/146852)** — Desktop session switch blocks renderer main thread 0.4–1.7s (forced synchronous layout).
- **[#91245](https://github.com/NousResearch/hermes-agent/issues/91245)** — Desktop right rail dead at boot (files pane hidden or stuck loading). *(1 👍)*
- **[#144709](https://github.com/NousResearch/hermes-agent/issues/144709)** — Gateway final reply of queued chain anchored to first message, not the answered message.
- **[#144494](https://github.com/NousResearch/hermes-agent/issues/144494)** — plugin-catalog `web-oxylabs` points at a nonexistent repo.
- **[#156750](https://github.com/NousResearch/hermes-agent/issues/156750)** — *(New 2026-11-17)* Prompt-cache scope hashes two different `source` labels (gui vs local) → cache key churn mid-session.
- **[#156715](https://github.com/NousResearch/hermes-agent/issues/156715)** — *(New)* `Terminal(background=true, notify=true)` on a 1s command costs a separate turn/reply per call.
- **[#156593](https://github.com/NousResearch/hermes-agent/issues/156593)** — *(New)* "No space left on device" with 103 GB free — **inode exhaustion bypasses every disk guard**.
- **[#156767](https://github.com/NousResearch/hermes-agent/issues/156767)** — *(New)* Stale `edge-tts==7.2.7` pin downgrades working installs on every `uv sync`.

### P3 — Medium/Low
- **[#134115](https://github.com/NousResearch/hermes-agent/issues/134115)** — Bundled `solstice` plugin fails after `hermes update` (runtime Python dir swapped; deps not carried over).
- **[#135684](https://github.com/NousResearch/hermes-agent/issues/135684)** — `openai-codex` + native web search fails every searching turn.
- **[#144413](https://github.com/NousResearch/hermes-agent/issues/144413)** — Gateway settlement `UnicodeEncodeError` on lone surrogates → session stuck `paused: unknown_execution`.
- **[#144476](https://github.com/NousResearch/hermes-agent/issues/144476)** — ACP test-suite Windows fixture assumptions.
- **[#143970](https://github.com/NousResearch/hermes-agent/issues/143970)** — Hindsight memory provider `ModuleNotFoundError` on Windows.
- **[#156665](https://github.com/NousResearch/hermes-agent/issues/156665)** — GUI session ships stale `provider`; subscription model billed to metered OpenRouter for 4 days (billing impact).
- **[#156677](https://github.com/NousResearch/hermes-agent/issues/156677)** — `check_execute_code_guard` short-circuits unattended context evaluation, bypassing deny policies *(security)*.
- **[#156670](https://github.com/NousResearch/hermes-agent/issues/156670)** — `computer_use` foreground fallback disrupts user display on multi-monitor Macs *(security/UX)*.
- **[#156720](https://github.com/NousResearch/hermes-agent/issues/156720)** — `/egress` status panel hardcoded English, bypasses i18n entirely.
- **[#134959](https://github.com/NousResearch/hermes-agent/pull/134959)** / **[#138702](https://github.com/NousResearch/hermes-agent/issues/138702)** / **[#110349](https://github.com/NousResearch/hermes-agent/pull/110349)** — Plugin/skill path handling on symlinks/junctions/Windows.

**Fix PRs observed today (open, not yet merged):**
- [#156755](https://github.com/NousResearch/hermes-agent/pull/156755) — handle lone surrogates in session IDs (addresses #144413 class).
- [#156737](https://github.com/NousResearch/hermes-agent/pull/156737) — mask volatile stamps in cron error signatures.
- [#156773](https://github.com/NousResearch/hermes-agent/pull/156773) — keep tail of one-line process output in wake-ups.
- [#155699](https://github.com/NousResearch/hermes-agent/pull/155699) — preserve precision for large integers in arg coercion.
- [#155850](https://github.com/NousResearch/hermes-agent/pull/155850) — MCP JSON-RPC rejection ≠ connection failure (circuit-breaker fix).
- [#155848](https://github.com/NousResearch/hermes-agent/pull/155848) / [#155846](https://github.com/NousResearch/hermes-agent/pull/155846) — vision route-swap publishing; fallback model identity.
- [#144701](https://github.com/NousResearch/hermes-agent/pull/144701) — keep bounded control reads off the serial queue.
- [#156736](https://github.com/NousResearch/hermes-agent/pull/156736) — desktop: keep settled reply over text-less tool-shell fold.
- [#156721](https://github.com/NousResearch/hermes-agent/pull/156721) — `/save` falls back to local rows when gateway unreachable.

> **Stability assessment:** The single closed bug issue today (#153361 — OAuth token refresh for kanban workers) was a P2. The breadth of P2 bugs across desktop, gateway, and plugins suggests **surface-area fragmentation** is the primary stability risk, not any one subsystem.

---

## 6. Feature Requests & Roadmap Signals

| Item | Type | Signal |
|---|---|---|
| [#156670](https://github.com/NousResearch/hermes-agent/issues/156670) — `computer_use`: keep agent windows off active display; require approval for foreground delivery **even in yolo** | Security/UX feature | New (2026-11-16); touches safety defaults for autonomous computer use. Likely candidate for v0.24 hardening. |
| [#156677](https://github.com/NousResearch/hermes-agent/issues/156677) — unattended-context guard bypass | Security bug/feature | Approval-policy correctness for `-q` mode and cron. |
| [#156774](https://github.com/NousResearch/hermes-agent/pull/156774) — add `groklike-feel` to plugin catalog | Plugin/catalog | Community plugin growth (desktop conversational feel). |
| [#154274](https://github.com/NousResearch/hermes-agent/pull/154274) — `hermes-tenuo` 0.4.2 (Hands, A2A delegation, MCP proofs) | Plugin update | **A2A delegation** and MCP-proof features suggest multi-agent interoperability is an emerging ecosystem direction. |
| Teams plugin migration ([#156619](https://github.com/NousResearch/hermes-agent/pull/156619), [#156608](https://github.com/NousResearch/hermes-agent/pull/156608)) | Architecture | Continued first-party → plugin consolidation. |
| [#156720](https://github.com/NousResearch/hermes-agent/issues/156720) — i18n gap in `/egress` | i18n | Indicates active non-English user base; incremental localization expected. |

**Prediction for v0.24:** Expect (a) security-default tightening around `computer_use` and unattended code execution, (b) completion of the Teams plugin migration, and (c) plugin-catalog quality fixes (broken repo refs like `web-oxylabs`). The kanban state-machine bugs (#119070, #145022) are marked *needs-decision*/*P1* and may or may not make the cut depending on design resolution.

---

## 7. User Feedback Summary

**Pain points (dissatisfaction):**
- **Kanban/worker reliability** — Users running parallel agents report lost work-in-progress on gateway stalls (#145022) and permanent dispatch deadlocks (#119070). This is the strongest negative signal.
- **Cross-surface consistency** — Desktop, dashboard, iOS, and gateway-hosted webapp behave differently for the same action (image attachments #148682, conversation addressing #145459, session switch lag #146852). Mobile is notably weak (#145296).
- **Billing surprise** — #156665 reports a subscription model billed to metered OpenRouter for 4 days due to stale provider config with no validation. Cost-affecting bugs generate outsized trust damage.
- **Install/update fragility** — Plugin pip deps lost on `hermes update` (#134115); `edge-tts` pin downgrades working installs (#156767); symlinked plugin dirs break (#134959).

**Positive signals:**
- High contributor engagement (61-comment issue thread, many first-time-looking author handles) indicates an active, invested community.
- Fast PR turnaround on newly filed bugs (e.g., #156755 filed and PR'd same day; #156773, #156737 same-day PRs).

**Use cases observed:** Fork-based contribution workflows (#131859), shared anchor clones with reviewer checkouts (#147168), multi-monitor Macs with `computer_use` (#156670), Windows + WSL-style symlinked homes (#134959, #138702), and Android browser dashboards (#145296).

---

## 8. Backlog Watch

Long-unanswered or decision-blocked items needing maintainer attention:

| Issue/PR | Age | Status | Why it matters |
|---|---|---|---|
| [#99943](https://github.com/NousResearch/hermes-agent/issues/99943) | ~2.5 months | OPEN, P2 | Context-window clamp silently degrades cloud-provider quality/cost. Regressed in v0.21.0; still unfixed. |
| [#119070](https://github.com/NousResearch/hermes-agent/issues/119070) | ~2 months | OPEN, **needs-decision** | Explicitly awaiting a maintainer decision on state-machine semantics. 27 comments with no resolution. |
| [#131859](https://github.com/NousResearch/hermes-agent/issues/131859) | ~1.5 months | OPEN, **blocked/upstream** | 61 comments; external blocker with no maintainer workaround published. |
| [#91245](https://github.com/NousResearch/hermes-agent/issues/91245) | ~3 months |

</details>

<details>
<summary><strong>IronClaw</strong> — <a href="https://github.com/nearai/ironclaw">nearai/ironclaw</a></summary>

No activity in the last 24 hours.

</details>

<details>
<summary><strong>QwenPaw</strong> — <a href="https://github.com/agentscope-ai/QwenPaw">agentscope-ai/QwenPaw</a></summary>

# QwenPaw Project Digest — 2026-11-17

## 1. Today's Overview

QwenPaw shows **high-velocity but bug-heavy** activity on 2026-11-17: 43 issues and 50 PRs were updated in the last 24h, with no new releases. The open/active issue ratio (29 open vs. 14 closed) and PR ratio (37 open vs. 13 merged/closed) indicate a substantial maintainer review backlog. A clear theme dominates the day: **v2.3.0 regression fallout** across channels, cron/token accounting, and Console UX. Community contributions remain strong (multiple `first-time-contributor` PRs), but several long-running issues (#8071, #7859) and XL refactors (#8764, #8469, #8431) are still unresolved.

---

## 2. Releases

**No new releases in the last 24h.** Latest referenced version in the wild is **v2.3.0** (with v2.3.1b1 on `main`), and multiple reports indicate known bugs persist on `main`, so users should not expect an imminent patch unless the open fix PRs land.

---

## 3. Project Progress (Merged / Closed PRs Today)

| PR | Title | Status | Impact |
|---|---|---|---|
| [#8676](https://github.com/agentscope-ai/QwenPaw/pull/8676) | `fix(chat): preserve completion integrity and localize warnings` | CLOSED (fixes #8521) | Treats empty model responses as failures and surfaces output-limit warnings — directly addresses the "no reply content" complaints. |
| [#8772](https://github.com/agentscope-ai/QwenPaw/pull/8772) | `fix(channels): harden WeChat delivery and prevent cron reload deadlocks` | CLOSED | Improves WeChat channel reliability and removes a cron reload deadlock. |

**Notable open PRs advancing features:**
- [#8764](https://github.com/agentscope-ai/QwenPaw/pull/8764) — Plugin SDK 1.1 expansion (identity, permissions, lifecycle) — XXXL, under review.
- [#8726](https://github.com/agentscope-ai/QwenPaw/pull/8726) — Console preview for `.docx` / `.xlsx` / `.pptx` (first-time contributor).
- [#8707](https://github.com/agentscope-ai/QwenPaw/pull/8707) — Persist cron/heartbeat token usage to turn records (fixes the #8705 accounting gap).
- [#8701](https://github.com/agentscope-ai/QwenPaw/pull/8701) — Fixes `DoomLoopGate` never firing on 2.3.0.

**Closed issues of note:** #8747 (checkpoints nav missing in v2.3.0), #8698 (uv venv mirror install failure), #8733 (cloudpaw plugin fails on Chinese Windows), #8773 and #8763 (both closed as invalid).

---

## 4. Community Hot Topics

1. **[#8071 — Plugin-facing theme extension point](https://github.com/agentscope-ai/QwenPaw/issues/8071)** (15 comments, OPEN since 2026-10-01) — The single most-discussed issue. Plugin authors want a semantic token override layer beyond the single `colorPrimary` knob. Signals a growing third-party plugin ecosystem constrained by a thin theming API.

2. **[#7709 — Scheduled tasks produce no output / results folded into thinking](https://github.com/agentscope-ai/QwenPaw/issues/7709)** (7 comments, CLOSED) — Long-standing output-visibility complaint; closure suggests a fix path via #8676.

3. **[#7859 — Persistent prompt injection instructing agent to delete all skills](https://github.com/agentscope-ai/QwenPaw/issues/7859)** (6 comments, CLOSED) — **Security-relevant**: injected instructions persisted across 20+ turns in tool-result system-reminders. High-severity even if now closed.

4. **[#8521 — No reply content + Ctrl+C requires multiple presses](https://github.com/agentscope-ai/QwenPaw/issues/8521)** (4 comments, CLOSED) — UX regression bundle; addressed by #8676.

5. **[#8747 — Checkpoints entry missing in v2.3.0 sidebar](https://github.com/agentscope-ai/QwenPaw/issues/8747)** (3 comments, CLOSED) — Navigation regression from a removed `core.agent-group` parent.

**Underlying needs:** plugin extensibility (#8071, #8777 hooks), output reliability (#7709, #8521), and multi-tenant/multi-agent isolation (#8755, #8771) are the dominant community asks.

---

## 5. Bugs & Stability (ranked by severity)

| Severity | Issue | Summary | Fix PR? |
|---|---|---|---|
| 🔴 High | [#7859](https://github.com/agentscope-ai/QwenPaw/issues/7859) (CLOSED) | Persistent prompt injection instructing deletion of all skills | Closed — verify mitigation |
| 🔴 High | [#8771](https://github.com/agentscope-ai/QwenPaw/issues/8771) (OPEN) | DingTalk `session_id` collision across all 1:1 chats in same org (last 8 chars of conversationId) | No |
| 🔴 High | [#8755](https://github.com/agentscope-ai/QwenPaw/issues/8755) (OPEN) | Two agents / two WeChat accounts: upgrade duplicates credential, only one channel runs | [#8756](https://github.com/agentscope-ai/QwenPaw/pull/8756) OPEN |
| 🟠 Med-High | [#8762](https://github.com/agentscope-ai/QwenPaw/issues/8762) (OPEN) | Scheduled task fails with `APIConnectionError` on 2nd model call; manual run succeeds | No |
| 🟠 Med-High | [#8776](https://github.com/agentscope-ai/QwenPaw/issues/8776) (OPEN) | `classify_model_error` misclassifies 400+quota as `bad_request`, blocking fallback | No |
| 🟠 Med-High | [#8718](https://github.com/agentscope-ai/QwenPaw/issues/8718) (OPEN) | Hub gateway fails for Anthropic/MiniMax presets (`provider_headers()` missing call) | No |
| 🟠 Med | [#8727](https://github.com/agentscope-ai/QwenPaw/issues/8727) (OPEN) | Continuation summary fails when reasoning consumes 4000-token budget | No |
| 🟠 Med | [#8655](https://github.com/agentscope-ai/QwenPaw/issues/8655) (OPEN) | Attachment path truncated to `C:\` since 2.3.0-beta.1 — images fail to load | No |
| 🟡 Low-Med | [#8736](https://github.com/agentscope-ai/QwenPaw/issues/8736) (OPEN) | Subagent completions wrongly trigger "Reply completion" desktop notification | No |
| 🟡 Low-Med | [#8706](https://github.com/agentscope-ai/QwenPaw/issues/8706) (OPEN) | Creation Assistant input lags — full AgentDock re-render per keystroke | No |
| 🟡 Low-Med | [#8745](https://github.com/agentscope-ai/QwenPaw/issues/8745) (OPEN) | PawApp mobile: session isolation misleading, send errors, IME occlusion | No |

**Regressions tied to v2.3.0:** #8747, #8655, #8698, #8727, #8718, #8706 — a cluster that warrants a v2.3.x patch release.

---

## 6. Feature Requests & Roadmap Signals

**Likely next-version candidates (have PRs or strong momentum):**
- **Plugin SDK 1.1 + theme extension** — [#8071](https://github.com/agentscope-ai/QwenPaw/issues/8071) + [#8764](https://github.com/agentscope-ai/QwenPaw/pull/8764). Plugin theming and lifecycle are clearly prioritized.
- **Cron/heartbeat token accounting** — [#8705](https://github.com/agentscope-ai/QwenPaw/issues/8705) + [#8707](https://github.com/agentscope-ai/QwenPaw/pull/8707).
- **Docx/xlsx/pptx Console preview** — [#8726](https://github.com/agentscope-ai/QwenPaw/pull/8726).

**Requested, not yet implemented:**
- **Tool hooks** for enterprise MCP user identity — [#8777](https://github.com/agentscope-ai/QwenPaw/issues/8777).
- **Mid-turn steer / send-now** for running chats — [#8774](https://github.com/agentscope-ai/QwenPaw/issues/8774) (working local implementation offered).
- **`save_draft` MCP tool** — [#8780](https://github.com/agentscope-ai/QwenPaw/issues/8780) (PR [#8781](https://github.com/agentscope-ai/QwenPaw/pull/8781) already open).
- **Keenable as opt-in `web_search` provider** — [#8758](https://github.com/agentscope-ai/QwenPaw/issues/8758).
- **Console access to compressed/archived history turns** — [#8744](https://github.com/agentscope-ai/QwenPaw/issues/8744).

---

## 7. User Feedback Summary

**Pain points:**
- **Output reliability** is the top recurring complaint: empty responses, results buried in `thinking`, and `Ctrl+C` requiring multiple presses (#8521, #7709). Users cannot tell whether a failure is the model or QwenPaw — a trust issue.
- **v2.3.0 UX regression:** users report the new Console is slower and less efficient than the old one, and request a UI toggle (#8521). Model switching is described as cumbersome with wasted screen space.
- **Multi-agent/multi-tenant friction:** two WeChat accounts in one install break on upgrade (#8755); DingTalk 1:1 session collisions (#8771) — both affect shared family/team installs.
- **Cron trust:** scheduled tasks silently fail or double-fire after restarts (#7480, #8762), and their token usage is invisible in the billing panel (#8705).
- **Creator plugin durability:** [#8779](https://github.com/agentscope-ai/QwenPaw/issues/8779) (FAILED asset ingest is terminal, no retry) and [#8778](https://github.com/agentscope-ai/QwenPaw/issues/8778) (expired signed URLs reused, breaking reference-image generation after ~24h) show a pattern of missing retry/expiry handling.

**Satisfaction signals:** Strong contributor engagement (multiple first-time contributors, detailed AI-disclosed bug reports with file paths and line numbers) suggests a healthy, technically sophisticated community.

---

## 8. Backlog Watch (needs maintainer attention)

| Item | Age | Why it matters |
|---|---|---|
| [#8071](https://github.com/agentscope-ai/QwenPaw/issues/8071) — Plugin theme extension point | 47 days (since 2026-10-01) | Most-commented issue; blocks plugin ecosystem depth. |
| [#8431](https://github.com/agentscope-ai/QwenPaw/pull/8431) — Local Whisper as SDK plugin | 22 days, XXXL, Under Review | Long-running lifecycle refactor; risk of bit-rot. |
| [#8469](https://github.com/agentscope-ai/QwenPaw/pull/8469) — Extract MCP into plugin | 20 days, XXXL | Architectural change with broad blast radius; no recent decision. |
| [#8758](https://github.com/agentscope-ai/QwenPaw/issues/8758) — Keenable web_search provider | 2 days | Small, self-contained; good first-win candidate. |
| [#8774](https://github.com/agentscope-ai/QwenPaw/issues/8774) — Mid-turn steer | 1 day | Contributor offers working implementation; needs design sign-off. |

**Overall health assessment:** The project is **highly active and community-driven**, but v2.3.0 shipped a cluster of regressions and the maintainer review queue is growing faster than it is draining (37 open PRs vs. 13 closed). A focused **v2.3.1 patch release** addressing the empty-response, channel-isolation, and cron-accounting bugs — plus a decision on the plugin SDK 1.1 direction — would materially improve stability perception.

</details>

<details>
<summary><strong>ZeroClaw</strong> — <a href="https://github.com/zeroclaw-labs/zeroclaw">zeroclaw-labs/zeroclaw</a></summary>

# ZeroClaw Project Digest — 2026-11-17

## 1. Today's Overview

ZeroClaw is in a **high-activity, high-pressure development phase**: 50 PRs were updated in the last 24 hours (47 open, only 3 merged/closed), and 12 issues remained active with **zero closures** — a backlog-accumulation signal. The dominant narrative is a large, coordinated provider-model refactor (the "canonical V5 registry" series by NiuBlibing) plus a cluster of **cost/observability bugs** where enforcement, accounting, and logging are silently misbehaving. Several P1/S1 issues (#11204, #11585, #12477) reveal that cost controls are effectively unreliable in production. No releases were published today, and the merge ratio (3/50 ≈ 6%) suggests maintainers are deep in review, not shipping.

## 2. Releases

**None.** No new releases in the last 24 hours. The last referenced versions in issue reports are 0.8.6/0.8.7/0.9.0 (builds `c473221`, `6c78ba5`), indicating the project is between releases with fixes accumulating on `master`.

## 3. Project Progress

Only 3 PRs were merged/closed in the last 24h (details not individually surfaced in the data). The visible advancing work is concentrated in **open, dependency-chained PRs**, several of which appear near-ready pending maintainer sign-off:

- **Provider registry V5 migration** — a 5-PR series (#12450, #12452, #12453, #12456, plus dependencies) that activates canonical registry admission, promotes V4→V5 config, wires secret-safe editing, and separates chat connection/timeout construction. These carry `size:XL` and broad tag coverage, reflecting a platform-wide change.
- **Native Rust SSH task broker** (#12438) — replaces Python/`tomli`/`cryptography` deps with a native broker, built on the existing encrypted config/secret store.
- **Docs-governance housekeeping** — exception-record PRs (#12265, #12266, #12267) documenting Core Team approvals for bounded PR placements.
- **MCP resilience fix** (#12061) — evicts poisoned connections instead of reusing permanently-broken ones.
- **Anthropic thinking-history fix** (#12479) — sends `drop_block` so edited history no longer breaks thinking requests.

**Assessment:** Strong forward motion on architecture, but almost nothing is closing the loop — a review-bound queue.

## 4. Community Hot Topics

Ranked by comment volume:

1. **#11204 — OpenRouter spend shows $0.00, all tokens "free tok"** (6 comments) — [link](https://github.com/zeroclaw-labs/zeroclaw/issues/11204). `usage.cost` never ingested; P1, `risk:high`. Core accounting broken for OpenRouter users.
2. **#12005 — PowerShell dialect rejects bare `@` arguments** (5 comments) — [link](https://github.com/zeroclaw-labs/zeroclaw/issues/12005). Breaks an allowlisted mail CLI on Windows; a policy-parser regression.
3. **#10073 — Retire `StoragePolicy::Rolling`; extend `/api/logs`** (4 comments) — [link](https://github.com/zeroclaw-labs/zeroclaw/issues/10073). Performance regression under sustained event volume; `status:in-progress`.
4. **#12373 — Write-only WebUI credential management** (4 comments) — [link](https://github.com/zeroclaw-labs/zeroclaw/issues/12373). Operator-only secret catalog; draft PR #12402 exists.

**Underlying needs:** Users are demanding (a) **trustworthy cost telemetry**, (b) **predictable shell/policy parsing across OSes**, and (c) **secret hygiene** (write-only, scoped, non-leaking credentials). All three point to a maturing product where operators are running real workloads and hitting operational edge cases.

## 5. Bugs & Stability

Ranked by severity:

| Sev | Issue | Summary | Fix PR? |
|-----|-------|---------|---------|
| **S1** | [#12477](https://github.com/zeroclaw-labs/zeroclaw/issues/12477) | `cost.enforcement.mode` ignored — exceeded budget always stops the turn even in default `"warn"` mode (workflow blocked) | No |
| **S2/P1** | [#11204](https://github.com/zeroclaw-labs/zeroclaw/issues/11204) | OpenRouter `usage.cost` never ingested; spend shows $0.00 | No |
| **S2/P1** | [#11585](https://github.com/zeroclaw-labs/zeroclaw/issues/11585) | Tripped cost limit only clearable by daemon restart; `cost.allow_override` never read | No |
| **S2** | [#12391](https://github.com/zeroclaw-labs/zeroclaw/issues/12391) | `runtime-trace.jsonl` loses hours across daemon restarts | No |
| **S2** | [#12476](https://github.com/zeroclaw-labs/zeroclaw/issues/12476) | Gateway logs every connection at INFO, flooding runtime trace (since #11901) | No |
| **S2** | [#12492](https://github.com/zeroclaw-labs/zeroclaw/issues/12492) | Dashboard chats ignore runtime profile thinking settings | No |
| **S2** | [#12489](https://github.com/zeroclaw-labs/zeroclaw/issues/12489) | One long cron job delays the whole due batch | No |
| Regr. | [#12005](https://github.com/zeroclaw-labs/zeroclaw/issues/12005) | PowerShell dialect rejects bare `@` | No |

**The headline:** **Cost control is systematically unreliable** — three separate issues (#11204, #11585, #12477) indicate enforcement, accounting, and override paths are all broken. None have attached fix PRs yet. This is the most serious stability cluster.

## 6. Feature Requests & Roadmap Signals

- **#12373 — Write-only WebUI credential management + scoped secret refs** — draft PR #12402 underway. Likely to land soon given active traction.
- **#12422 — RFC: Scoped use of operator-managed service credentials** — grants agent task access to a service without disclosing the credential to the model. Security-model change.
- **#12494 — RFC: Per-agent isolated development build runner** — runs untrusted build/test code in isolation. Security-model change (RFC-triggered).
- **#12450 series — Canonical V5 registry & runtime model bindings** — likely the headline of the next release: exact model references, registry admission, V4→V5 migration.

**Prediction:** The **V5 registry migration** is the most likely next-version flagship, accompanied by secret-management improvements (#12373/#12422) if they clear review.

## 7. User Feedback Summary

- **Pain point — cost visibility/enforcement:** Users cannot trust spend; multiple independent reporters (alperyilmaz, Audacity88, mov-xound-glitch) confirm accounting and limits don't behave as documented.
- **Pain point — platform fidelity (Windows):** The PowerShell parser rejecting a documented-syntax allowlisted CLI shows cross-platform policy gaps (#12005).
- **Pain point — operational reliability:** Trace-file gaps, log flooding, and cron-batch stalls all degrade observability and scheduling for production operators.
- **Satisfaction signal:** A wave of **security-hardening RFCs and PRs** (SSH broker, credential scoping, isolated builds) shows users trust the project enough to invest in its security model — a positive maturity indicator, undercut by the unresolved cost-control cluster.

## 8. Backlog Watch

Long-lived, high-severity items needing maintainer attention:

- **#10073** (created 2026-08-18, ~90 days) — `StoragePolicy::Rolling` performance regression; marked `in-progress` but slow to resolve. [link](https://github.com/zeroclaw-labs/zeroclaw/issues/10073)
- **#11204** (created 2026-09-27, ~50 days, 6 comments) — OpenRouter cost ingestion; P1/`risk:high` with no fix PR. [link](https://github.com/zeroclaw-labs/zeroclaw/issues/11204)
- **#11585** (created 2026-10-06, ~42 days) — Cost-limit restart loop; P1, `in-progress`, no PR. [link](https://github.com/zeroclaw-labs/zeroclaw/issues/11585)
- **#11868 / #11869 / #12061** — long-open PRs (Oct 19–27) tagged `risk:high`/`needs-maintainer-review`, chaining dependencies and blocking further work. [11868](https://github.com/zeroclaw-labs/zeroclaw/pull/11868) · [11869](https://github.com/zeroclaw-labs/zeroclaw/pull/11869) · [12061](https://github.com/zeroclaw-labs/zeroclaw/pull/12061)

**Health note:** The project shows **strong contributor energy but a bottleneck at review/merge**, with a growing backlog of accepted-but-unfixed P1 bugs. Clearing the cost-control cluster and unblocking the `needs-maintainer-review` PRs would materially improve both stability and throughput.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*