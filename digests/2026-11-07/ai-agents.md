# OpenClaw Ecosystem Digest 2026-11-07

> Issues: 367 | PRs: 500 | Projects covered: 5 | Generated: 2026-11-07 00:50 UTC

- [OpenClaw](https://github.com/openclaw/openclaw)
- [Hermes Agent](https://github.com/nousresearch/hermes-agent)
- [IronClaw](https://github.com/nearai/ironclaw)
- [QwenPaw](https://github.com/agentscope-ai/QwenPaw)
- [ZeroClaw](https://github.com/zeroclaw-labs/zeroclaw)

---

## OpenClaw Deep Dive

# OpenClaw Project Digest — 2026-11-07

## 1. Today's Overview

OpenClaw remains in a high-tempo maintenance phase: **367 issues** and **500 PRs** were updated in the last 24 hours, with no new releases cut. The issue mix is heavily weighted toward regressions and state/session-integrity bugs (SQLite worker OOM, MCP lifecycle leaks, Gateway event-loop stalls), suggesting the team is still stabilizing the 2026.10.x–2026.11.x line rather than shipping new surface area. PR throughput is healthy (**133 merged/closed** vs **367 open**), but the open backlog is large and many top-commented issues carry `clawsweeper:no-new-fix-pr` and `needs-maintainer-review` — meaning fixes exist conceptually but are stuck at review. Community energy is concentrated on a small set of long-lived "diamond lobster" bugs, several of which are P0/P1 crash-loops or memory regressions. Overall project health: **active but under stability pressure**; the ratio of open-to-merged PRs and the volume of unaddressed P1s are the main watch items.

## 2. Releases

None. No new releases in the last 24h. (Notable context: issue threads reference in-flight prereleases `v2026.11.5-beta.1` and an extended-stable prep PR for 2026.9.37.)

## 3. Project Progress

133 PRs were merged/closed in the last 24h. Notable closures and active merges include:

- **#194380 [CLOSED]** `improve(ci): scope provisioning tests to copied inputs` — reduces wasteful CI work for source-only PRs. [link](https://github.com/openclaw/openclaw/pull/194380)
- **#194379 [CLOSED]** `fix(release): authorize scoped 2026.11.2 Kova waiver` — unblocks a release perf gate. [link](https://github.com/openclaw/openclaw/pull/194379)
- **#194369 [CLOSED]** `chore(release): prepare 2026.9.37 extended-stable` — backport batch restoring privacy boundaries, session-account continuity, and safer update/state handling on the extended-stable line. [link](https://github.com/openclaw/openclaw/pull/194369)
- **#168794 / #166017 / #164923 [CLOSED issues]** — several long-running bug threads closed, including Codex 32 MiB image-request 502s, MCP session idle-TTL non-eviction, and short-term promotion structural rejection. [166017](https://github.com/openclaw/openclaw/issues/166017) · [164923](https://github.com/openclaw/openclaw/issues/164923)
- **#178291 [CLOSED]** — post-activation Doctor authority failure on 2026.10.4→10.5 update resolved. [link](https://github.com/openclaw/openclaw/issues/178291)

Net: strong bug-closing cadence on legacy regressions, but new P1/P2s are arriving faster than maintainers can triage (see Backlog Watch).

## 4. Community Hot Topics

| Item | Comments | Type | Link |
|---|---|---|---|
| #160959 Gateway blocks for minutes capturing large external plugins (2026.9.6 regression) | 80 | P0 crash-loop | [link](https://github.com/openclaw/openclaw/issues/160959) |
| #164294 Gateway state DB WAL auto-checkpoint never completes | 39 | P2 | [link](https://github.com/openclaw/openclaw/issues/164294) |
| #177656 native host exec returns shared-state integrity-admission error | 29 | P1 | [link](https://github.com/openclaw/openclaw/issues/177656) |
| #150635 short-term recall eviction blocks dreaming deep-phase promotion | 25 | P2 | [link](https://github.com/openclaw/openclaw/issues/150635) |
| #191944 `gateway stop` fails on macOS "ancestry could not be fully inspected" | 23 | P2 UX | [link](https://github.com/openclaw/openclaw/issues/191944) |

**Underlying needs:** The hottest threads cluster around three themes — (a) **event-loop/liveness integrity** under large plugin/tool loading (#160959, #166641); (b) **shared-state and session admission consistency** (#177656, #182647, #192959); and (c) **memory/recall subsystem correctness** (#150635, #164923). These are not cosmetic: they cause crash loops, message loss, or "every turn fails" states. Users are effectively acting as SREs for their own Gateways, which is a satisfaction risk.

## 5. Bugs & Stability (ranked by severity)

**P0 / crash-loop**
- **#160959** — Gateway event loop blocked for minutes on large external plugin capture at startup and on runtime republish. *No fix PR; waiting on maintainer review.* [link](https://github.com/openclaw/openclaw/issues/160959)
- **#178291 (CLOSED)** — Post-activation Doctor authority-check failure during 2026.10.4→10.5 chat update. [link](https://github.com/openclaw/openclaw/issues/178291)

**P1 — data integrity / message loss / crash**
- **#177656** — Native host exec `shared-state integrity-admission` failures; ≥28 occurrences on stable 2026.10.5. [link](https://github.com/openclaw/openclaw/issues/177656)
- **#155563** — Regression 2026.9.5: service-child relay/anchor + MCP groups retained after successful turns. [link](https://github.com/openclaw/openclaw/issues/155563)
- **#191847** — New regression 2026.10.10: large session repeatedly kills 512 MB SQLite worker (`ERR_WORKER_OUT_OF_MEMORY`); every turn in that session fails "admission is closed". [link](https://github.com/openclaw/openclaw/issues/191847)
- **#166641** — `web_fetch` cold fallback synchronously captures unrelated plugins on Gateway main thread → liveness stalls. [link](https://github.com/openclaw/openclaw/issues/166641)
- **#185656** — Large zstd transcript archive still exceeds Node string limit in media-persistence migration (regression of #170847); blocks update. [link](https://github.com/openclaw/openclaw/issues/185656)
- **#182647** — Cloud-worker turns fail pre-inference: "Session capability metadata requires worker preparation". [link](https://github.com/openclaw/openclaw/issues/182647)
- **#192959** — Kubernetes: Gateway refuses to start after pod restart (fsGroup remount rejects client credential dir). [link](https://github.com/openclaw/openclaw/issues/192959)

**P2 highlights**
- #164294 WAL auto-checkpoint pinned by in-process reader; #191944 macOS stop failure; #166017 (CLOSED) MCP idle-TTL never evicts → broker hits 256-child cap; #182891 prompt cache never reused (`cache read dropped N -> 0`); #160494 cron bound to persistent session rejected at rotation. [164294](https://github.com/openclaw/openclaw/issues/164294) · [191944](https://github.com/openclaw/openclaw/issues/191944) · [182891](https://github.com/openclaw/openclaw/issues/182891)

**Fix-PR status:** Several bugs already have candidate PRs in flight (#188881 for dispatched-agent MCP authorization; #194359 for v16 Doctor memory-FTS upgrade; #194129 for shared-session access loss after list updates), but most P0/P1s remain `no-new-fix-pr`.

## 6. Feature Requests & Roadmap Signals

Notable open feature requests:

- **Per-model usage logging for cost tracking** (#13219, 10 comments) — long-standing ask for aggregated token/cost views beyond per-session JSONL. [link](https://github.com/openclaw/openclaw/issues/13219)
- **Configurable Dream Diary language/prompt** (#79223) — non-English workspaces get mixed-language output because the memory-core prompt is hardcoded. [link](https://github.com/openclaw/openclaw/issues/79223)
- **Hide agents from picker while keeping them spawnable** (#166678) — multi-agent org visibility control for WebUI/macOS/iOS. [link](https://github.com/openclaw/openclaw/issues/166678)
- **Setting to disable hosted plugin catalog feed** (#164620) — network/privacy control over `clawhub.ai` fetch. [link](https://github.com/openclaw/openclaw/issues/164620)
- **Configurable Control UI Ctrl+Shift+A archive shortcut** (#163739) — collides with browser shortcuts. [link](https://github.com/openclaw/openclaw/issues/163739)
- **msteams dynamic SharePoint site resolution for uploads** (#136271) — removes hardcoded `sharePointSiteId`. [link](https://github.com/openclaw/openclaw/issues/136271)

**Prediction:** Watch #13219 and #164620 — both align with cost-governance and privacy themes that the extended-stable backport ledger already touches, making them plausible candidates for a 2026.12 feature window. #166678 is likely gated behind the multi-agent runtime work.

## 7. User Feedback Summary

Real user pain points in this window:

- **"Every turn in that session fails"** — #191847 and #182647 describe total session lockout (SQLite worker OOM; cloud-worker metadata gap), the harshest UX failure short of data loss. [191847](https://github.com/openclaw/openclaw/issues/191847) · [182647](https://github.com/openclaw/openclaw/issues/182647)
- **Update-path fragility** — #193962 reports the #187197 SQLite header-probe fix is unreachable from 2026.10.10 because the *installed* updater runs the old 10 s probe; users are stuck mid-upgrade. [link](https://github.com/openclaw/openclaw/issues/193962)
- **Cost anxiety** — #178373 (no run-level token budget; retained history re-billed every turn) and #182891 (prompt cache never reused) both describe unexpected spend, not just latency. [178373](https://github.com/openclaw/openclaw/issues/178373) · [182891](https://github.com/openclaw/openclaw/issues/182891)
- **Mobile/Control UI friction** — #191944, #163739, and the closed #139909 (composer renders ~5–6 chars/line on phones) point to persistent small-screen polish debt.
- **Satisfaction signal:** Zero 👍 on almost all high-comment issues — comment volume exceeds endorsement volume, a pattern typical of *workaround-driven* engagement rather than enthusiasm.

## 8. Backlog Watch

Long-unanswered or stalled items needing maintainer attention:

- **#167609** (created 2026-10-09) — Code Mode leaks guest-script TypeErrors as `internal_error`; needs product decision + fix-shape sign-off. [link](https://github.com/openclaw/openclaw/issues/167609)
- **#127195** (created 2026-08-21) — 16 call sites emit byte-identical "changed while starting work" error with no reason code; `needs-product-decision`. [link](https://github.com/openclaw/openclaw/issues/127195)
- **#112638** (created 2026-07-22, stale) — `session.maintenance enforce` does not bound the store; thread/channel entries exempt from all reclaim. [link](https://github.com/openclaw/openclaw/issues/112638)
- **#103067** (created 2026-07-09, stale) — Centralize chat-session naming; define subagent session lifetime/persistence. [link](https://github.com/openclaw/openclaw/issues/103067)
- **#123792** (created 2026-08-14, stale) — Assistant turns render twice with `claude-cli` backend. [link](https://github.com/openclaw/openclaw/issues/123792)
- **PR #75225** (open since 2026-04-30, stale) — Expose configured descriptions in `agents_list`; labeled `proof: sufficient`, `waiting on maintainer`. [link](https://github.com/openclaw/openclaw/pull/75225)
- **PR #127770** (open since 2026-08-22) — OpenAI native PDF document opt-in; `proof: sufficient`, `merge-risk: compatibility`, waiting on maintainer. [link](https://github.com/openclaw/openclaw/pull/127770)

**Assessment:** The backlog is dominated by *decisions*, not code — `needs-product-decision` and `needs-maintainer-review` appear on the majority of top issues. Clearing a decision-only queue for #127195, #167609, and PR #75225 would be a high-leverage move for perceived responsiveness.

---

## Cross-Ecosystem Comparison

# Cross-Project Comparison Report — AI Agent & Personal AI Assistant Open-Source Ecosystem
**Snapshot Date: 2026-11-07**

---

## 1. Ecosystem Overview

The personal AI assistant / agent open-source landscape on 2026-11-07 is characterized by **intense maintenance-phase activity across three of five tracked projects**, with zero new releases ecosystem-wide — a signal that the cohort is consolidating stability ahead of a coordinated Q4/Q1 release window rather than expanding surface area. A common pattern emerges across OpenClaw, Hermes Agent, QwenPaw, and ZeroClaw: **core session/state integrity, memory subsystem correctness, and identity/authorization boundaries** are the dominant bug classes, indicating the ecosystem has moved past "does it work?" into "does it stay trustworthy under load, across deployments, and across channels?" Plugin/catalog ecosystems (Hermes, QwenPaw, ZeroClaw) are simultaneously flourishing as growth vectors and exposing registration-contract fragility. Community engagement is **workaround-driven rather than enthusiasm-driven** (high comment volume, low reaction counts), and backlog analyses across all projects converge on the same bottleneck: **maintainer decision throughput, not contributor supply**. Two projects (IronClaw) show zero activity, suggesting a bimodal distribution between active and dormant entries in this niche.

---

## 2. Activity Comparison

| Project | Issues Updated (24h) | PRs Updated (24h) | Merged/Closed (24h) | Release Status | Health Score |
|---|---|---|---|---|---|
| **OpenClaw** | 367 | 500 | 133 PRs | None (2026.11.x in-flight) | **Stable-under-pressure** (high activity, large backlog, P0/P1 unaddressed) |
| **Hermes Agent** | 50 (43 open / 7 closed) | 50 (39 open / 11 merged) | 11 PRs | None (0.22.x stable) | **Active & productive** (mild maintenance debt) |
| **IronClaw** | 0 | 0 | 0 | None | **Dormant** |
| **QwenPaw** | 22 (12 open / 10 closed) | 38 (18 open / 20 merged) | 20 PRs | None (2.2.2.post1 stable / 2.3.0b2 beta) | **High-velocity maintenance** (fast triage, architectural debt accumulating) |
| **ZeroClaw** | 20 (6 open / 14 closed) | 50 (35 open / 15 merged) | 15 PRs | None (v0.9.0 gating) | **Security-hardening phase** (review-throughput bottleneck) |

**Ranking by 24h activity volume:** OpenClaw ≫ Hermes ≈ ZeroClaw > QwenPaw > IronClaw (dormant).
**Ranking by backlog clearance efficiency:** QwenPaw > ZeroClaw > Hermes > OpenClaw.

---

## 3. OpenClaw's Position

**Advantages vs. peers:**
- **Scale dominance:** OpenClaw's 367 issues / 500 PRs updated in 24h is **~7–10× the volume** of Hermes or ZeroClaw and **~13–23× QwenPaw's** — it operates at reference-implementation scale, acting as the de facto framework other projects benchmark against.
- **CI/release discipline:** Only project with active extended-stable backport ledgers and scoped release waivers (e.g., Kova waiver #194379), suggesting mature release engineering peers lack.
- **Richer subsystem surface:** Dream Diary, Doctor authority model, Gateway event-loop integrity, and MCP lifecycle handling represent deeper subsystem investment than peer projects.

**Technical approach differences:**
- **Gateway-centric architecture** with explicit session-admission semantics and a SQLite worker pool — a heavier footprint than Hermes' gateway/session-authority consolidation or QwenPaw's plugin-per-channel model.
- **Prerelease/beta channeling** (v2026.11.5-beta.1, 2026.9.37 extended-stable) — peers ship on simpler stable/beta splits.
- **Dependency on native host exec and cloud-worker turns** introduces integrity-admission failure classes (#177656, #182647) unique to its breadth.

**Community size comparison:**
- OpenClaw's top issue threads carry **80, 39, 29, 25, 23 comments** vs. Hermes' peak of 40, QwenPaw's 4, and ZeroClaw's 9. This is a **10–20× larger engaged user base** at the top of the funnel.
- **Caveat:** Zero 👍 on most high-comment OpenClaw issues vs. modest 👍 counts on Hermes (#97681: 4) and QwenPaw — OpenClaw's engagement is **issue-driven and problem-centric**, not enthusiasm-driven, suggesting a user base dependent on it operationally rather than passionately.

---

## 4. Shared Technical Focus Areas

Three cross-project requirements emerge as ecosystem-wide:

### (a) Session/State Integrity Under Load — *OpenClaw, Hermes, ZeroClaw*
- **OpenClaw:** SQLite worker OOM (#191847), Gateway event-loop stalls (#160959), admission-closed failures (#182647).
- **Hermes:** Prompt lost on attached clients (#147626), Stop reporting false cancellation (#143303), composer restore-after-send (#148277).
- **ZeroClaw:** Long-session 422 rejections (#12263), channel startup message overwrite (#12279).
- **Need:** Atomic, re-checkable authority over session state that survives retries, reconnects, and multi-device attachment.

### (b) Memory Subsystem Correctness — *OpenClaw, Hermes, QwenPaw*
- **OpenClaw:** Recall eviction blocking dreaming promotion (#150635), eviction-before-promotion defects.
- **Hermes:** Memory/kanban read-only API demand (#149815); recall semantics in multisession flows.
- **QwenPaw:** Memory tag index 503 (#8580), reranker empty-api_key errors (#8276), refactor of recall as transient context (#8457).
- **Need:** Deterministic index rebuild, safe eviction policy, and clear separation between persisted memory and injected recall.

### (c) Authorization/Identity Boundaries — *OpenClaw, Hermes, ZeroClaw*
- **OpenClaw:** Shared-state integrity admission (#177656/#182647), MCP lifecycle leaks.
- **Hermes:** Approval-gate bypass via shell functions (#150329), toolset pick ignored on gateway path (#147832).
- **ZeroClaw:** A concentrated 10+ issue security sweep — session ownership (#11127), SOP wildcards (#11123), cron approval (#12260), XFF spoofing (#12052), vodozemac CVEs (#12272).
- **Need:** Authority re-validated at each effect using **trusted runtime facts**, not caller-supplied data.

### (d) Plugin/MCP Contract Hardening — *Hermes, QwenPaw, ZeroClaw, OpenClaw*
- **Hermes:** Plugin Hackathon cluster + catalog PRs (~5), but registration/nav regressions.
- **QwenPaw:** Plugin metadata failures (#8595), navigation regression (#8590), dependency check refactor (#8598).
- **ZeroClaw:** Multi-registry origins (#12216), deferred MCP HashMap ordering (#12176).
- **Need:** Durable plugin manifest/route contracts as the ecosystem scales to hundreds of community extensions.

---

## 5. Differentiation Analysis

| Dimension | OpenClaw | Hermes Agent | QwenPaw | ZeroClaw |
|---|---|---|---|---|
| **Primary focus** | Core runtime stability, Gateway/MCP/dreaming | Cross-gateway collaboration, Desktop UX, plugin catalog | Multichannel self-hosting, memory, Creator pipeline | Security/identity-access hardening, relay dashboard |
| **Target users** | Power users/SREs running self-hosted Gateways | Multi-device personal users + plugin developers | Self-hosters (esp. Windows/Docker/IM channels) | Security-conscious operators, proxy deployments |
| **Architecture** | Gateway + SQLite worker + shared-state admission | Gateway session-authority + Desktop/web clients | Plugin-per-channel, IM bridge, console | Daemon + RPC + OIDC/XFF-aware Gateway |
| **Release posture** | Extended-stable backports + betas | 0.22.x stable, incremental | Stable + 2.3.0b2 beta | v0.9.0 release-gated on security |
| **Distinctive work** | Dream Diary, Doctor, event-loop integrity | Cross-gateway federation (#97681) | IM channel parity, quote/context UX | Principal-boundary refactor (#9746, #12239) |
| **Primary risk** | Backlog triage starvation | Review latency on feature PRs (#51672: 4.5mo) | Environment-sensitive failures (Windows/Docker) | XL PR review throughput gating release |

**Interpretation:** OpenClaw is the **breadth leader** (more subsystems, larger user base); Hermes is the **collaboration/federation pioneer**; QwenPaw is the **self-hosting/IM-channel pragmatic builder**; ZeroClaw is the **security-first specialist**. There is meaningful **non-overlap** in target use cases — the projects are complementary rather than direct substitutes.

---

## 6. Community Momentum & Maturity

### Activity Tiers (24h)
1. **Tier 1 — High-throughput stabilizer:** OpenClaw (467 combined issue+PR updates/day).
2. **Tier 2 — Actively iterating:** Hermes Agent, ZeroClaw (~50–70 combined).
3. **Tier 3 — Focused maintenance:** QwenPaw (~60 combined, higher merge ratio).
4. **Tier 4 — Dormant:** IronClaw (0).

### Maturity Signals
| Project | Maturity Indicator | Verdict |
|---|---|---|
| OpenClaw | Release engineering (waivers, backports), large user funnel | **Mature core, strained ops** |
| Hermes | Plugin hackathon, community-authored fixes | **Mature extensibility, growing pains in review** |
| QwenPaw | Same-day feature→PR turnaround (#8609, #8610) | **Responsive but pre-architecture-refactor** |
| ZeroClaw | Systematic security sweep from source review | **Mature security posture, release-gated** |

### Iterating vs. Stabilizing
- **Rapidly iterating (features):** Hermes (plugin catalog, dashboard), QwenPaw (console UX trio, memory).
- **Stabilizing (bug-fix focused):** OpenClaw (regressions), ZeroClaw (authorization refactor).
- **The shared bottleneck:** all three active Tier 1–3 projects flag **maintainer review throughput** as the gating constraint — not contributor supply. This is a maturity bottleneck, not an engagement one.

---

## 7. Trend Signals

Five industry-level signals valuable to AI agent developers:

### 1. **Identity/Authorization is the new correctness frontier**
ZeroClaw's dedicated 10+ issue security sweep, Hermes' approval-gate bypass (#150329), and OpenClaw's shared-state admission failures all point to the same conclusion: **the next generation of agent bugs will be authority-boundary bugs**, not inference-quality bugs. *Actionable for developers:* design authority checks as **atomic, per-effect, trusted-fact-based** operations from day one.

### 2. **Session integrity across multi-device/multi-channel is table stakes**
Every active project reports session-state inconsistencies under attach/retry/reconnect. Users are becoming SREs for their own agents. *Actionable:* invest early in idempotent turn semantics and cross-client session reconciliation.

### 3. **Memory subsystems need explicit "trusted vs. synthetic" separation**
QwenPaw #8457 (recall injected as untrusted context), OpenClaw's dream/recall eviction defects, and Hermes' memory API requests all converge on: **memory is not a single abstraction — index, eviction, and recall-injection are separate, independently testable concerns**.

### 4. **Plugin/MCP registration contracts are scaling bottlenecks**
Three of four active projects report plugin metadata/route/manifest failures. *Actionable:* publish and version a plugin contract spec now, before the ecosystem reaches hundreds of extensions.

### 5. **Release gating has shifted from feature-completeness to security- and integrity-completeness**
ZeroClaw's v0.9.0 is explicitly security-gated; OpenClaw is holding back 2026.12 feature candidates behind stability backports. *Actionable for developers:* plan security/integrity review as a **release gate**, not a post-release patch cycle — this is becoming the ecosystem norm.

---

*Report synthesized from 2026-11-07 community digest summaries. Activity counts reflect 24h snapshots; health scores are qualitative assessments based on engagement volume, backlog clearance, and unresolved severity-weighted bugs.*

---

## Peer Project Reports

<details>
<summary><strong>Hermes Agent</strong> — <a href="https://github.com/nousresearch/hermes-agent">nousresearch/hermes-agent</a></summary>

# Hermes Agent — Project Digest
**Date: 2026-11-07** | Repository: [github.com/NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent)

---

## 1. Today's Overview

Activity remains high across the board: 50 issues and 50 PRs updated in the last 24h, with 0 new releases. The issue tracker shows a heavy skew toward open items (43 open vs. 7 closed), suggesting the maintainers are currently absorbing more community input than they are resolving. PR throughput is healthier: 11 merged/closed against 39 open, including several fix PRs from prior days finally landing today (e.g., delegate-card joining, Daybreak delegation routing, gateway transcript reads). A noticeable cluster of activity centers on the **plugin catalog and Plugin Hackathon submissions** (~5 PRs), plus a steady stream of **gateway/session-authority** work and **package-manager (pnpm/npm) hardening** follow-ups to #149746. The most engaged discussion by far remains the long-running [Let Bots collaborate across gateways (#97681)](https://github.com/NousResearch/hermes-agent/issues/97681) with 40 comments — a sign that multi-agent/cross-gateway collaboration is the community's dominant strategic interest. Overall health: **active and productive**, with a mild maintenance-debt signal in the open/closed issue ratio.

---

## 2. Releases

**No new releases in the last 24h; latest release data shows none.** No changelog, breaking changes, or migration notes to report. Version references in today's issues (e.g., v0.22.5 in [#147626](https://github.com/NousResearch/hermes-agent/issues/147626)) indicate the project is on the 0.22.x line, but no tagged release was cut today.

---

## 3. Project Progress

**Merged / Closed PRs (11 total, highlights):**

| PR | Summary | Impact |
|---|---|---|
| [#136573](https://github.com/NousResearch/hermes-agent/pull/136573) | fix(desktop): join delegate cards by delegation id, not repeated goal | Fixes cross-adoption of subagent workers in Desktop transcript |
| [#149846](https://github.com/NousResearch/hermes-agent/pull/149846) | fix(gateway): Daybreak delegation routes recognize owner's gateway-hosted chats | Fixes "this session is 'local'" false rejection for own Desktop/Webapp chats |
| [#149836](https://github.com/NousResearch/hermes-agent/pull/149836) | fix(desktop): each delegate card shows only its own subagents | Removes duplicate helper display after rejected-then-retried delegation |
| [#149538](https://github.com/NousResearch/hermes-agent/pull/149538) | fix(desktop): a rejected delegate batch lists no children | Prevents phantom children in transcript |
| [#51672](https://github.com/NousResearch/hermes-agent/pull/51672) | Add `hermes heal` CLI, startup healer warnings, hook denylist | New operational self-healing surface (Windows-relevant) |
| [#150234](https://github.com/NousResearch/hermes-agent/pull/150234) | plugin-catalog: add va-claims (VA Benefits tracker) | Catalog expansion |
| [#150190](https://github.com/NousResearch/hermes-agent/pull/150190) | fmt(js): auto-fix lint | Routine hygiene |
| [#149625](https://github.com/NousResearch/hermes-agent/pull/149625) | Add proofops — verification for completion claims | Plugin catalog addition (open/advancing) |

**Closed Issues (7 total):** Notably [#143656](https://github.com/NousResearch/hermes-agent/issues/143656) (Linux updater restarts paused gateways before publishing install stamp → stale `/health` version) and [#106960](https://github.com/NousResearch/hermes-agent/issues/106960) (systemd dashboard inventoried as manual-serve) were closed, plus four pnpm/npmc hardening follow-ups ([#150032](https://github.com/NousResearch/hermes-agent/issues/150032), [#150033](https://github.com/NousResearch/hermes-agent/issues/150033), [#150034](https://github.com/NousResearch/hermes-agent/issues/150034), [#150035](https://github.com/NousResearch/hermes-agent/issues/150035)).

**Net direction:** Desktop delegation display correctness and gateway routing were the clear focus of shipped fixes today; plugin catalog growth continues at pace.

---

## 4. Community Hot Topics

1. **[#97681 — Let Bots collaborate across gateways](https://github.com/NousResearch/hermes-agent/issues/97681)** — 40 comments, 4 👍 (most active item)
   *Underlying need:* Users want federated personal agents — bots running on different machines/owners that can work together **without surrendering control** of models, tools, memory, or credentials. This is the community's flagship architectural ask and effectively frames the project's multi-agent roadmap.

2. **[#106960 — systemd dashboard inventoried as manual-serve](https://github.com/NousResearch/hermes-agent/issues/106960)** — 14 comments (CLOSED)
   *Underlying need:* Predictable service lifecycle/update inventory for hand-rolled installations; service discovery currently ignores dashboard units.

3. **[#145171 — Entry-point cutover: serve, remote Desktop and web onto the gateway session authority](https://github.com/NousResearch/hermes-agent/issues/145171)** — 6 comments
   *Underlying need:* Consolidating fragmented entry points (`hermes serve` vs. gateway) into one session-authority model — the architectural counterweight to #97681.

4. **Plugin Hackathon cluster (PRs):** [#150379 Gateway Guardian](https://github.com/NousResearch/hermes-agent/pull/150379), [#150360 Diké](https://github.com/NousResearch/hermes-agent/pull/150360), [#149625 proofops](https://github.com/NousResearch/hermes-agent/pull/149625), [#150374 cash-desk](https://github.com/NousResearch/hermes-agent/pull/150374), [#149174 gogogoogle (draft)](https://github.com/NousResearch/hermes-agent/pull/149174)
   *Underlying need:* A thriving third-party ecosystem — reliability guards, legal verification, financial tooling, and wiki/memory integrations — signaling the plugin surface is a healthy community growth vector.

---

## 5. Bugs & Stability

Ranked by severity (as tagged):

**P2 — High:**
- [#148329](https://github.com/NousResearch/hermes-agent/issues/148329) — *Skill lock blocks ALL git writes in the containing repo.* A protection feature blocking unrelated work with **no agent-side remedy**. Reporter flags severity as high.
- [#133006](https://github.com/NousResearch/hermes-agent/issues/133006) — *macOS Desktop form-filling failure: stale/empty browser targets + unverified recovery loops.* Needs repro; affects computer-use reliability.
- [#147920](https://github.com/NousResearch/hermes-agent/issues/147920) — *computer-use `bring_to_front` fails permanently after implicit cua-driver session idles* — every call rejected until gateway restart (macOS, cua-driver 0.21.0).
- [#147923](https://github.com/NousResearch/hermes-agent/issues/147923) — *Desktop: assistant message after bot-chat cron delivery not rendered until next turn.* Persisted correctly; UI staleness only.
- [#142982](https://github.com/NousResearch/hermes-agent/issues/142982) — *Desktop cannot unpin a pinned legacy cron-run chat* — pin returns silently, backend refuses.
- [#149154](https://github.com/NousResearch/hermes-agent/issues/149154) — *kanban: update drain kills running workers* (persist path has no wait) + wastes card attempts on sessions that never started.
- [#137723](https://github.com/NousResearch/hermes-agent/issues/137723) — *Automatic Codex quota recovery stays exhausted on disk after successful probe* (security-boundary flagged).
- [#147626](https://github.com/NousResearch/hermes-agent/issues/147626) — *Attached clients see turn stream but never the user's prompt* (v0.22.5, macOS host).
- [#143303](https://github.com/NousResearch/hermes-agent/issues/143303) — *Stop in gateway group chat reports turn stopped while still running* — group chat can start a second turn beside the live one.
- [#146280](https://github.com/NousResearch/hermes-agent/issues/146280) — *Anthropic usage: utilization ≤1% reported as 100%* (fraction scaling bug in `_usage_windows`).

**P3 — Medium / Other:**
- [#150369](https://github.com/NousResearch/hermes-agent/issues/150369) — *iPhone Safari webapp mic requires double-tap* (AudioContext resume gated on user gesture; Safari-only).
- [#150123](https://github.com/NousResearch/hermes-agent/issues/150123) — *Browser dashboard chat crash-loops ("gateway exited (1)") on single-profile installs with active session.* New today; no fix PR yet.
- [#150329](https://github.com/NousResearch/hermes-agent/issues/150329) — *Approval gate bypass:* shell function/alias forwarding hides command word (`f(){ rm "$@"; }; f -rf /`) → escapes hardline floor; also unflagged pipe-to-shell sinks. **Security-relevant.**
- [#148831](https://github.com/NousResearch/hermes-agent/issues/148831) — *delegate_task silently drops top-level routing field.* AI-assisted report; fix PR linked.
- [#148277](https://github.com/NousResearch/hermes-agent/issues/148277) — *Desktop send landed but also restored into composer* (duplicate submission risk under new ID).
- [#147832](https://github.com/NousResearch/hermes-agent/issues/147832) — *Explicit `-t` toolset pick still gets every plugin toolset and MCP server* (gateway path) — config/security boundary.
- [#141755](https://github.com/NousResearch/hermes-agent/issues/141755) — *Skills security scanner false-positives block legitimate community skill* `book-to-skill` (132 findings).

**Fix PRs existing:** Delegate display bugs (#136573, #149538, #149836, #149846 — all merged today) and [#149862](https://github.com/NousResearch/hermes-agent/pull/149862) (split-unit failed task keeps its own goal). No fix PR yet for the newest reports (#150369, #150123, #150329).

---

## 6. Feature Requests & Roadmap Signals

**Likely near-term (already have tracking issues or staged plans):**
- **Cross-gateway bot collaboration** ([#97681](https://github.com/NousResearch/hermes-agent/issues/97681)) — explicit foundation-laying language ("across machines now, across owners next"); the highest-signal roadmap item.
- **Gateway session-authority cutover** ([#145171](https://github.com/NousResearch/hermes-agent/issues/145171)) — staged fast-follow to #134889; consolidating serve/Desktop/web onto one authority.
- **Gateway transcript read API** ([#150102](https://github.com/NousResearch/hermes-agent/pull/150102)) — `session.transcript` for reading stored sessions without attaching; enables third-party frontends.
- **Read-only kanban/run/memory API endpoints** ([#149815](https://github.com/NousResearch/hermes-agent/issues/149815)) — requested by a Home Assistant "Hermes Voice" integration builder; voice-satellite use case.

**Lower-likelihood / exploratory:**
- **Email MCP integration package** ([#99030](https://github.com/NousResearch/hermes-agent/issues/99030)) — AgentMail/IMAP/SMTP adapter; aligns with industry MCP momentum.
- **Cron-style Bot Chat delivery for webhook results** ([#150380](https://github.com/NousResearch/hermes-agent/issues/150380)) — new today, 0 comments.
- **Suppress mobile notifications while Desktop is active** ([#148307](https://github.com/NousResearch/hermes-agent/issues/148307)) — small UX win, 1 👍.

**Prediction:** The next version is most likely to ship **gateway session-authority consolidation** and **delegation display fixes** (already merged), with **cross-gateway collaboration** as the marquee multi-release initiative.

---

## 7. User Feedback Summary

**Pain points:**
- **Fragmented entry points** — users repeatedly hit friction where `hermes serve`, Desktop URL/Cloud/SSH modes, and the gateway disagree on session authority (#145171, #147626, #150123).
- **Session/state inconsistencies** — messages restored into composer after send (#148277), prompts missing on attached clients (#147626), Stop reporting premature cancellation (#143303), unpin refusal (#142982). These erode trust in the core chat loop.
- **Overzealous protection mechanisms** — the skill lock blocking unrelated git writes (#148329) and the skills scanner false-positive (#141755) both frustrate legitimate workflows.
- **Install/update lifecycle surprises** — stale `/health` version after updates (#143656, now closed) and pnpm/npm mirror edge cases (#150032).

**Use cases emerging:**
- **Voice satellites / home automation** — user building "Hermes Voice" on Echo devices requests read-only APIs (#149815).
- **Webhook/event-driven automation** — workflow engines routing errors into per-profile Bot Chat (#150380).
- **Multi-device workflows** — same chat on Mac, Windows, and iOS simultaneously (#147626).
- **Domain-specific plugins** — legal citation verification (Diké), VA benefits tracking (va-claims), gateway reliability monitoring (Gateway Guardian).

**Sentiment:** Constructive and technically engaged. Reports are detailed with environment specifics and repro steps; several are AI-assisted and adversarially reviewed (e.g., #148831). The community is investing heavily in the plugin ecosystem, indicating satisfaction with the extension surface even as core session consistency remains the top friction area.

---

## 8. Backlog Watch

Long-unanswered items needing maintainer attention:

- **[#51672](https://github.com/NousResearch/hermes-agent/pull/51672)** — *Add `hermes heal` CLI, startup healer warnings, hook denylist.* Open since **2026-06-24** (~4.5 months), only closed today after long delay. Its lengthy dwell time is a caution flag for PR review latency on feature-scale contributions.
- **[#99030](https://github.com/NousResearch/hermes-agent/issues/99030)** — *Ship an Email MCP integration package.* Open since **2026-08-31** (~2.2 months), only 2 comments; a clear ecosystem-aligned request with no maintainer response.
- **[#97681](https://github.com/NousResearch/hermes-agent/issues/97681)** — *Let Bots collaborate across gateways.* Open since **2026-08-29** (~2.3 months); very active (40 comments) but still under review — needs a maintainer decision to unblock the roadmap's centerpiece.
- **[#124725](https://github.com/NousResearch/hermes-agent/pull/124725)** — *fix(desktop): reopen the focused session tab, not stale main-pane chat.* Open since **2026-09-27** (~6 weeks); a targeted Desktop UX fix awaiting review.
- **[#149174](https://github.com/NousResearch/hermes-agent/pull/149174)** — *[DRAFT] gogogoogle plugin.* Explicitly marked not-yet-final; needs author action and reviewer bandwidth for hackathon judging.

**Recommendation:** Prioritize a maintainer decision on #97681 and a response on #99030, and clear the ~6-week-old Desktop fix #124725 to keep the community's PR enthusiasm from stalling.

---

*Digest generated from GitHub activity data for 2026-11-07. Comment counts reflect the snapshot provided; PR comment counts were not available in source data.*

</details>

<details>
<summary><strong>IronClaw</strong> — <a href="https://github.com/nearai/ironclaw">nearai/ironclaw</a></summary>

No activity in the last 24 hours.

</details>

<details>
<summary><strong>QwenPaw</strong> — <a href="https://github.com/agentscope-ai/QwenPaw">agentscope-ai/QwenPaw</a></summary>

# QwenPaw Project Digest — 2026-11-07

## 1. Today's Overview

QwenPaw shows **high-velocity maintenance activity** with 22 issues and 38 PRs updated in the last 24 hours, though no new releases were cut. The project is in an active stabilization phase for the 2.3.0 beta line: 10 issues and 20 PRs were closed/merged today, indicating maintainers are clearing a backlog that spans from March 2026 (Issue #373, #1453) to same-day reports. The open/active ratio (12 open issues, 18 open PRs) suggests a healthy pipeline rather than a clogged one, but recurring themes around **memory tag indexing, Matrix channel plugins, Windows path handling, and Creator plugin instability** point to integration-layer fragility across 2.3.0b2. Notably, several long-dormant issues (#1453, #373) were resolved today, suggesting a deliberate cleanup of stale reports.

---

## 2. Releases

**None.** No new releases in the last 24 hours. The project remains on the 2.2.2.post1 stable line and 2.3.0b2 beta, with multiple bugs reported specifically against 2.3.0b2 console assets (built 2026-10-30).

---

## 3. Project Progress

Twenty PRs were merged or closed today, spanning bug fixes, features, docs, and test infrastructure:

**Bug fixes landed:**
- **[PR #8550](https://github.com/agentscope-ai/QwenPaw/pull/8550)** — Closes [#8549](https://github.com/agentscope-ai/QwenPaw/issues/8549): model config write path now rejects out-of-range `thinking_budget`/`max_input_length` values instead of silently persisting broken configs.
- **[PR #8411](https://github.com/agentscope-ai/QwenPaw/pull/8411)** — Closes [#8365](https://github.com/agentscope-ai/QwenPaw/issues/8365): Matrix channel now recovers cached sessions and missing device keys instead of re-logging in with password on every start.
- **[PR #8535](https://github.com/agentscope-ai/QwenPaw/pull/8535)** — Closes [#8533](https://github.com/agentscope-ai/QwenPaw/issues/8533): fixes third-party (Codex/Qoder) scheduled tasks misclassifying non-empty requests as empty.
- **[PR #8600](https://github.com/agentscope-ai/QwenPaw/pull/8600)** — Closes [#8596](https://github.com/agentscope-ai/QwenPaw/issues/8596): `/clear` chat reopen no longer restores cached command bubbles, preserving empty-state greeting.
- **[PR #8604](https://github.com/agentscope-ai/QwenPaw/pull/8604)** — Prevents Windows shell cancellation tests from hanging.

**Features advanced:**
- **[PR #373](https://github.com/agentscope-ai/QwenPaw/pull/373)** (open since March 2026, finally closed) — per-session persistence of dynamically loaded MCP connections via `dynamic-mcp` skill.
- **[PR #8457](https://github.com/agentscope-ai/QwenPaw/pull/8457)** — automatic memory recall now injected as transient/untrusted reference context rather than assistant-authored trajectory (prevents model imitating synthetic recall).

**Docs/housekeeping:**
- **[PR #8606](https://github.com/agentscope-ai/QwenPaw/pull/8606)** — fixed 5 dead external doc links.
- **[PR #8598](https://github.com/agentscope-ai/QwenPaw/pull/8598)** — plugin dependency check refactor.

---

## 4. Community Hot Topics

The most-discussed items today (by comment count):

| Item | Comments | Theme |
|---|---|---|
| [Issue #8580](https://github.com/agentscope-ai/QwenPaw/issues/8580) | 4 | Memory tag index 503 — tags generated but unreadable |
| [Issue #8596](https://github.com/agentscope-ai/QwenPaw/issues/8596) | 4 | `/clear` cache regression (now closed) |
| [Issue #1453](https://github.com/agentscope-ai/QwenPaw/issues/1453) | 4 | CoPaw offline install can't reach offline Qwen 3/3.5 (closed after ~8 months) |
| [Issue #8276](https://github.com/agentscope-ai/QwenPaw/issues/8276) | 4 | ReMe reranker accepts empty `api_key`, opaque error |
| [Issue #7436](https://github.com/agentscope-ai/QwenPaw/issues/7436) | 3 | Tool call format config for IM channels |
| [Issue #5110](https://github.com/agentscope-ai/QwenPaw/issues/5110) | 3 | Quote/reference text for follow-ups |
| [Issue #8576](https://github.com/agentscope-ai/QwenPaw/issues/8576) | 3 | Default agent edit button disabled in console |

**Underlying needs analysis:** The community is pushing hard on **memory subsystem reliability** (tags, rerankers — #8580, #8276) and **UX parity with modern AI chat tools** (quoting, compact tool displays, multi-tab identification). Notably, #5110 and #7436 both have corresponding PRs open today ([#8609](https://github.com/agentscope-ai/QwenPaw/pull/8609), [#8610](https://github.com/agentscope-ai/QwenPaw/pull/8610)), signaling rapid maintainer response to high-visibility requests.

---

## 5. Bugs & Stability

Ranked by severity:

**🔴 Critical — Data/feature completely broken:**
- **[Issue #8592](https://github.com/agentscope-ai/QwenPaw/issues/8592)** — Creator review round becomes permanently undecidable; REJECT always returns 422 "visual artifact reference references missing id" (plus 502 on expired provider source_url, frame_stats ignoring `CREATOR_FFMPEG_PATH`). **No fix PR yet.** Bundles three defects.
- **[Issue #8580](https://github.com/agentscope-ai/QwenPaw/issues/8580)** — Memory tag index never rebuilds; `/memory/tags` returns **503**. Config verified correct; tags generated but unreadable. **No fix PR yet** — 4 comments, still open.

**🟠 High — Platform-specific breakage:**
- **[Issue #8585](https://github.com/agentscope-ai/QwenPaw/issues/8585)** — `recall_history` broken on Windows: workspace path canonicalized to `\\?\` extended-length path breaks SQLite read-only URI. Cross-version (2.2.x and 2.3.0b1). **No fix PR yet.**
- **[Issue #8595](https://github.com/agentscope-ai/QwenPaw/issues/8595)** — Plugin install fails with "No package metadata was found" for `qwenpaw-creator` v2.0.4 via both UI and CLI.
- **[Issue #8517](https://github.com/agentscope-ai/QwenPaw/issues/8517)** — Hub Docker runtime fails with `Permission denied` on `working/config.json` when Hub runs as non-root.
- **[Issue #8538](https://github.com/agentscope-ai/QwenPaw/issues/8538)** — Matrix channel plugin fails to activate when multiple workspaces enable it (10s shared startup window only covers the first).

**🟡 Medium — Functional regressions:**
- **[Issue #8603](https://github.com/agentscope-ai/QwenPaw/issues/8603)** — `run_code` invoked with empty arguments on custom OpenAI-compatible providers (`kimi`, `kimi-codingplan`); `'code' is a required property` error on every call.
- **[Issue #8576](https://github.com/agentscope-ai/QwenPaw/issues/8576)** — Default agent edit button disabled in console although PUT API allows editing. **Fix PR open: [#8608](https://github.com/agentscope-ai/QwenPaw/pull/8608)**.

**🟢 Low / already fixed today:** Issues #8596, #8276, #8549, #8533, #8365, #8516, #8590 all closed with corresponding PRs.

**Stability trend:** Windows-specific path handling and non-root Docker deployments are emerging as a recurring cluster of environment-sensitive failures — a notable risk for the desktop/self-hosted user base.

---

## 6. Feature Requests & Roadmap Signals

Active feature requests and their likely trajectory:

| Request | Issue/PR | Likelihood in next release |
|---|---|---|
| Quote response text in follow-ups | [#5110](https://github.com/agentscope-ai/QwenPaw/issues/5110) → [PR #8609](https://github.com/agentscope-ai/QwenPaw/pull/8609) open | **High** — PR already submitted |
| Compact `tool_call_format` for IM channels | [#7436](https://github.com/agentscope-ai/QwenPaw/issues/7436) → [PR #8610](https://github.com/agentscope-ai/QwenPaw/pull/8610) open | **High** — PR already submitted |
| Browser tab title follows session name | [#8605](https://github.com/agentscope-ai/QwenPaw/issues/8605) | Medium — no PR yet, low-complexity |
| Creator UI usability overhaul | [#8591](https://github.com/agentscope-ai/QwenPaw/issues/8591) | Medium — depends on Creator stability track (#8592) |
| Delete mode for model management | [PR #8611](https://github.com/agentscope-ai/QwenPaw/pull/8611) open | **High** — PR open |
| Reranker model center w/ precision history | [PR #8472](https://github.com/agentscope-ai/QwenPaw/pull/8472) open | Medium — larger XXL PR |

**Prediction:** The next patch/beta is likely to bundle the **console UX trio** (quote-to-follow-up, tool-call compaction, model deletion) plus the **default-agent editing fix** (#8608), since all now have open or submitted PRs. The **memory subsystem** (reranker center #8472, tag index rebuild #8580) appears to be the next larger investment area.

---

## 7. User Feedback Summary

**Pain points expressed:**
- **Console/UI friction dominates:** Users report unidentifiable UI elements (white-on-white buttons in Creator, #8591), all browser tabs showing identical titles (#8605), and disabled edit buttons that contradict backend capabilities (#8576). This suggests a UI polish gap in the 2.3.0b2 beta.
- **Deployment friction:** Offline/air-gapped installs (#1453, closed after 8 months) and non-root Docker (#8517) reveal that self-hosting is a meaningful — and sometimes neglected — use case.
- **Plugin ecosystem immaturity:** Two separate plugin failures reported today (#8595 metadata, #8590 navigation regression) indicate the plugin registration/route contract needs hardening.
- **Cross-platform reliability:** Windows users hit multiple distinct issues (#8585 path canonicalization, #8603 provider tool calls), suggesting Windows is under-tested relative to Linux/macOS.

**Satisfaction signals:** Rapid issue triage (many same-day or next-day closures) and PRs appearing within hours of feature requests (#8609, #8610) indicate a responsive maintainer team, which likely buoys community sentiment despite the bug volume.

---

## 8. Backlog Watch

Long-unanswered or high-impact items needing maintainer attention:

- **[Issue #8580](https://github.com/agentscope-ai/QwenPaw/issues/8580)** — Memory tag index 503. **Opened 2026-11-04, 4 comments, no fix PR, no maintainer label visible.** This is a core memory feature completely broken; it deserves prioritization.
- **[Issue #8592](https://github.com/agentscope-ai/QwenPaw/issues/8592)** — Creator review round permanently undecidable. **No fix PR.** Author explicitly offered to split into three issues — maintainers should respond to triage.
- **[Issue #8585](https://github.com/agentscope-ai/QwenPaw/issues/8585)** — Windows `recall_history` SQLite URI breakage. **No fix PR, 2 comments.** Cross-version regression affecting all Windows desktop users.
- **[Issue #8517](https://github.com/agentscope-ai/QwenPaw/issues/8517)** — Hub Docker non-root permission denied. **Open since 2026-10-31, 3 comments, no PR.** Blocks containerized deployments.
- **[Issue #1453](https://github.com/agentscope-ai/QwenPaw/issues/1453)** — CoPaw offline install; **closed today after ~8 months** — worth reviewing the resolution to ensure the underlying offline-model-connection limitation is documented, not just closed.
- **[PR #8234](https://github.com/agentscope-ai/QwenPaw/pull/8234)** — GBK/CP936 decoding fix for read/edit/grep. **Open since 2026-10-14 (XXL size), under review.** Addresses silent data loss on Chinese Windows — high user impact, needs review bandwidth.

**Health assessment:** The project is actively maintained with fast turnaround on low-complexity issues, but larger architectural items (memory indexing, Creator pipeline, Windows path handling, plugin contracts) are accumulating without dedicated fix PRs. Maintainer attention should prioritize the **memory tag 503** and **Creator undecidable review** as the two highest-severity unresolved blockers.

</details>

<details>
<summary><strong>ZeroClaw</strong> — <a href="https://github.com/zeroclaw-labs/zeroclaw">zeroclaw-labs/zeroclaw</a></summary>

# ZeroClaw Project Digest — 2026-11-07

## 1. Today's Overview

ZeroClaw is in a **high-velocity security-hardening phase** ahead of the v0.9.0 release. Activity remains intense: 20 issues touched in the last 24h (14 closed, 6 open) and 50 PRs updated (15 merged/closed, 35 open), with no new releases. The dominant theme is a systematic sweep of **principal/identity-access boundary bugs** — session ownership, SOP authorization, rate-limit keying, and cron approval — largely driven by contributors `IftekharUddin` and `JordanTheJet`, with review support from `Audacity88`. The project's health signal is mixed-positive: many p1/high-risk security bugs are being closed quickly, but new follow-up issues keep surfacing from those same fixes, suggesting the authorization model is undergoing a deep, layered refactor rather than isolated patching. Release notes (v0.9.0 tags) appear on many security issues, indicating this work is gating the next version.

## 2. Releases

**None.** No new releases in the last 24h. Note, however, that many open PRs and issues are tagged `release:v0.9.0`, implying an upcoming release is accumulating a substantial security and identity-access payload.

## 3. Project Progress

15 PRs were merged/closed today. Highlights:

- **#12273 [CLOSED]** — `fix(deps): update vodozemac to 0.11.2 for RUSTSEC-2026-0445 and -0451`. Unblocks the Quality Gate `Security` job and every PR by patching two fresh RustSec advisories. ([link](https://github.com/zeroclaw-labs/zeroclaw/pull/12273))
- **#12233 [CLOSED]** — `fix(gateway): limit and cap OIDC bearer verification on the config route group`. Adds attempt ledger and in-flight caps to stop identity-provider amplification. ([link](https://github.com/zeroclaw-labs/zeroclaw/pull/12233))
- **#12114 [CLOSED]** — `fix(gateway): key rate limits on the proxy-appended XFF hop`. Fixes loopback-exemption spoofing via `X-Forwarded-For`. ([link](https://github.com/zeroclaw-labs/zeroclaw/pull/12114))
- **Closed issues:** #11127 (session-data ownership bypass), #11123 (SOP wildcard tool selectors), #12051 (SOP workshop shared authorship), #12046 (wildcard principal-unaware tools), #12047 (OIDC limiter), #12052 (XFF keying), #12272 (vodozemac advisories), #11962 (daemon RPC session leak at cap 64), #12178, #12176 (deferred MCP HashMap ordering), #12155 (quickstart false "no config written"), #12217 (email docs), #12248, #12249.

**Features advanced:**
- **#10315 Phase 2** (relay-served web dashboard) — PR #12270 + placement-exception doc PR #12274 open.
- **Multi-model provider profiles** — long-running foundational PR #9809 still open.
- **Telegram voice replies** (PR #12276) and **paired-device voice settings** (PR #12269) moving.
- **Multi-origin plugin registries** (PR #12216) progressing.

## 4. Community Hot Topics

- **#9746 [OPEN] — `fix(tools): per-agent ownership scoping for session tools and discord_search`** ([link](https://github.com/zeroclaw-labs/zeroclaw/pull/9746)) — the highest-scrutiny PR today; a large (`size:XL`) identity-access refactor that spawned multiple follow-up issues (#12282 documents its placement exception). Still open and `needs-author-action`.
- **#10926 [OPEN] — Matrix `send_via` treats peer user identities as room destinations** ([link](https://github.com/zeroclaw-labs/zeroclaw/issues/10926)) — 9 comments, still unresolved after ~7 weeks; the highest-comment issue in the window and a signal of channel-routing model confusion.
- **#11127 / #11123 / #12046 / #12051 [CLOSED]** — the security-boundary cluster; each closed with only 2–3 comments, indicating fix-first, low-discussion resolution.
- **#12239 [OPEN] — `fix(rpc): hold current authority through session effects`** ([link](https://github.com/zeroclaw-labs/zeroclaw/pull/12239)) — p1/high-risk, follow-up to #11234; central to the authorization-model refactor.

**Underlying need:** contributors are converging on a single principle — *authority must be re-checked atomically at each effect, using trusted facts (runtime identity, live config) rather than caller-supplied data*. Reviewer attention is clustering on three PRs (#9746, #12239, #11149) that together would enforce this consistently.

## 5. Bugs & Stability

Ranked by severity (all dated 2026-11-06 unless noted):

- **S1 — workflow blocked: #12263 [OPEN]** — Strict provider permanently rejects a long tool-heavy session (`422 missing field tool_call_id`) once outbound request size diverges from stored session. No fix PR yet; conversation becomes unusable. ([link](https://github.com/zeroclaw-labs/zeroclaw/issues/12263))
- **S1 — workflow blocked: #12272 [CLOSED]** — vodozemac RUSTSEC advisories fail CI on every PR. **Fixed** by PR #12273. ([link](https://github.com/zeroclaw-labs/zeroclaw/issues/12272))
- **S2 — #12260 [OPEN]** — RPC `cron/add` and `cron/patch` treat the caller as an operator approval for shell commands (`approved = true`). Open fix in PR #11149. ([link](https://github.com/zeroclaw-labs/zeroclaw/issues/12260))
- **S2 — #12279 [OPEN]** — Channel startup caps a long transcript from an earlier read, overwriting a message appended in between (possible data loss; triage may escalate to S0). ([link](https://github.com/zeroclaw-labs/zeroclaw/issues/12279))
- **S2 — #10926 [OPEN]** — Matrix `send_via` peer-identity/room-destination confusion. ([link](https://github.com/zeroclaw-labs/zeroclaw/issues/10926))
- **S2 — #11962 [CLOSED]** — Daemon's 64 live RPC sessions never released when idle; remote clients can exhaust them. **Fixed.** ([link](https://github.com/zeroclaw-labs/zeroclaw/issues/11962))
- **S3 — #12155 [CLOSED]** — Quickstart claims "No config written" but `~/.zeroclaw/config.toml` exists. **Fixed.** ([link](https://github.com/zeroclaw-labs/zeroclaw/issues/12155))

**Assessment:** the resolved set outweighs the open set, and every open S1/S2 now has a linked fix PR except #12263 and #12279. That latter pair — plus the security cluster — should be watched before v0.9.0.

## 6. Feature Requests & Roadmap Signals

Strong signals that the following are **likely in v0.9.0 or immediately after**, given `release:v0.9.0` tags and active PRs:

- **Relay-served daemon web dashboard** (PR #12270, doc #12274) — closes a real browser-access gap for relay-connected daemons.
- **Multiple models per provider profile** (PR #9809) — large provider-layer rework with capability tagging, presets, and fallback.
- **Telegram voice replies synthesized during text generation** (PR #12276) and **paired-device voice settings** (PR #12269).
- **Multi-registry plugin origins** (PR #12216) — enables private + public registry coexistence.
- **Local MCP configuration controls** (PR #12275) — explicit, deferred-write config edits by an authorized agent.
- **SOP cancel loopback hardening** (issue #12280 → PR #12281).

**Prediction:** v0.9.0 will ship as a *security + identity-access* release first, with the dashboard/relay and provider-model features riding alongside if their XL PRs clear review.

## 7. User Feedback Summary

- **Pain point — long-session fragility:** #12263 and #12279 both describe *data loss or permanent conversation breakage* in long, tool-heavy or transcript-restore scenarios. This is the most user-visible stability risk.
- **Pain point — proxy/deployment misconfiguration:** #12052 (XFF loopback spoofing) reflects real operator confusion about running ZeroClaw behind reverse proxies. The fix plus docs will matter for self-hosters.
- **Pain point — onboarding polish:** #12155 shows quickstart messaging erodes trust ("No config written" while a config file is written).
- **Satisfaction signal:** security issues #11127, #11123, #12046, #12051 were all reported *from source review* and closed promptly, suggesting a responsive maintainer/security review loop.
- **Dissatisfaction signal:** #9746 has been open since 2026-08-04 and still carries `needs-author-action`, indicating the community-authored ownership-scoping fix is being slowed by review latency.

## 8. Backlog Watch

Items needing maintainer attention due to age, size, or review stalls:

- **#9746 [OPEN since 2026-08-04]** — `per-agent ownership scoping` (XL, p1, high risk, `needs-author-action`, `release-gate`). The single most consequential stalled PR; multiple closed issues depend on its landing. ([link](https://github.com/zeroclaw-labs/zeroclaw/pull/9746))
- **#9809 [OPEN since 2026-08-07]** — `multiple models per provider profile` (XL, `needs-author-action`). Foundational provider work blocked on author action. ([link](https://github.com/zeroclaw-labs/zeroclaw/pull/9809))
- **#11149 [OPEN since 2026-09-26]** — `enforce cron approval and authority at the write` (XL, high risk). Directly relevant to open bug #12260 and to the v0.9.0 security payload. ([link](https://github.com/zeroclaw-labs/zeroclaw/pull/11149))
- **#10926 [OPEN since 2026-09-17]** — Matrix `send_via` destination bug; 9 comments, no fix PR, `follow-up` + `risk:medium`. ([link](https://github.com/zeroclaw-labs/zeroclaw/issues/10926))
- **#12239 [OPEN]** — `hold current authority through session effects` (p1, `needs-maintainer-review`); gateway/security surface that gates v0.9.0. ([link](https://github.com/zeroclaw-labs/zeroclaw/pull/12239))

---

**Overall health:** active and security-focused, with fast closure of high-severity findings but a growing set of stacked follow-ups. The main risk to v0.9.0 is *review throughput* on three XL PRs (#9746, #9809, #11149) rather than a shortage of fixes. Recommend prioritizing maintainer review of #12239 and #11149 to close the remaining S2 authorization gaps (#12260) and unblock the release.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*