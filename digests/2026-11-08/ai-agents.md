# OpenClaw Ecosystem Digest 2026-11-08

> Issues: 500 | PRs: 500 | Projects covered: 5 | Generated: 2026-11-08 00:24 UTC

- [OpenClaw](https://github.com/openclaw/openclaw)
- [Hermes Agent](https://github.com/nousresearch/hermes-agent)
- [IronClaw](https://github.com/nearai/ironclaw)
- [QwenPaw](https://github.com/agentscope-ai/QwenPaw)
- [ZeroClaw](https://github.com/zeroclaw-labs/zeroclaw)

---

## OpenClaw Deep Dive

# OpenClaw Project Digest — 2026-11-08

## 1. Today's Overview

OpenClaw shows **very high activity** with 500 issues and 500 PRs updated in the last 24 hours, but the project is currently operating without a fresh release (0 new releases). The open/active issue ratio is concerning: **422 of 500 updated issues remain open**, with 78 closed, while PRs show a healthier merge velocity with 187 merged/closed versus 313 still open. A significant cluster of P1/P0 bugs centers on **session-state integrity, message loss, and SQLite contention** — these dominate the top-commented issues, suggesting a stability debt that maintainers are actively triaging but not yet resolving at the rate the community expects. Positively, a wave of small, focused fix PRs landed today targeting UI regressions, plugin lifecycle bugs, and channel delivery mirrors, indicating strong contributor engagement on polish-level issues.

---

## 2. Releases

**No new releases in the last 24h.** The most recent referenced baseline in issues is `2026.11.5-beta.1` (per #193962), and several users are still on stable `2026.10.5` / `2026.10.10`, where notable bugs persist.

---

## 3. Project Progress

Today's merged/closed PR activity (187 items) reflects substantial maintenance throughput. Highlighted closed items from the issue feed:

- **[#143278 [CLOSED]](https://github.com/openclaw/openclaw/issues/143278)** — Heartbeat internal output leaking to Telegram user chat; closed as `not-repro-on-main`.
- **[#139477 [CLOSED]](https://github.com/openclaw/openclaw/issues/139477)** — `tools.toolSearch` no-op for bundle-MCP CLI backends; closed as stale/not-repro.

Notable in-flight PRs advancing fixes today:

- **[PR #194430](https://github.com/openclaw/openclaw/pull/194430)** (P0, XL) — Gateway recovery for guest tasks after concurrent managed-workspace edits; closes #187911. Flagged with `merge-risk: session-state` and `security-boundary`.
- **[PR #194885](https://github.com/openclaw/openclaw/pull/194885)** — Keep sandboxes running during file/media reads (fixes whole-sandbox pause on preview).
- **[PR #194832](https://github.com/openclaw/openclaw/pull/194832)** — Telegram durable final deliveries now write the channel-final transcript mirror.
- **[PR #191324](https://github.com/openclaw/openclaw/pull/191324)** — Spawn receipts expose child runtime/credential (awaiting maintainer decision).
- **[PR #190001](https://github.com/openclaw/openclaw/pull/190001)** — Postgres chat-history pages read from a single DB snapshot (latency fix).
- Multiple small UI/plugin fixes: [#194840](https://github.com/openclaw/openclaw/pull/194840), [#194864](https://github.com/openclaw/openclaw/pull/194864), [#194841](https://github.com/openclaw/openclaw/pull/194841), [#194882](https://github.com/openclaw/openclaw/pull/194882).

---

## 4. Community Hot Topics

| Rank | Item | Comments | Signal |
|---|---|---|---|
| 1 | [#177656](https://github.com/openclaw/openclaw/issues/177656) — Native host exec shared-state integrity-admission error | 32 | P1, ≥28 failures on stable 2026.10.5 |
| 2 | [#44925](https://github.com/openclaw/openclaw/issues/44925) — Subagent completion silently lost | 31 | 🦞 diamond lobster; no retry/notify/restart |
| 3 | [#150635](https://github.com/openclaw/openclaw/issues/150635) — Short-term recall eviction blocks dreaming promotion | 26 | 🦞 diamond lobster; memory subsystem |
| 4 | [#119720](https://github.com/openclaw/openclaw/issues/119720) — Sync persistence blocks Gateway event loop | 25 | 🦞 diamond lobster; scale bottleneck |
| 5 | [#166634](https://github.com/openclaw/openclaw/issues/166634) — Late reclamation checkpoint failure | 25 | Agent permanently unavailable post-crash |
| 6 | [#191944](https://github.com/openclaw/openclaw/issues/191944) — macOS `gateway stop` fails entirely | 24 | UX blocker on Intel macOS |

**Underlying needs:** The community is most vocal about **reliability guarantees around state persistence and message delivery** — lost subagent completions, evicted recall, and unrecoverable agents after crash. These are not cosmetic; they erode trust in long-running autonomous workflows. The clustering of 🦞 diamond lobster ratings on session-state issues signals a systemic architectural concern rather than isolated bugs.

---

## 5. Bugs & Stability

**P0 / Release Blockers**
- **[#193962](https://github.com/openclaw/openclaw/issues/193962)** — SQLite header-probe timeout fix unreachable from 2026.10.10; updater's 10s probe stalls. 🦞 diamond lobster.
- **[#126821](https://github.com/openclaw/openclaw/issues/126821)** — SQLite corruption recurs on freshly rebuilt DBs within 15–24h (WSL2), 5 events in 5 days, "paralyzed gateway" mode.
- **[#89278](https://github.com/openclaw/openclaw/issues/89278)** — Codex OAuth refresh timeout; cron/heartbeat fail. Linked PR open.

**P1 (Selection)**
- **[#177656](https://github.com/openclaw/openclaw/issues/177656)** — Integrity-admission error on stable 2026.10.5; 28+ failures.
- **[#44925](https://github.com/openclaw/openclaw/issues/44925)** — Subagent completion lost silently.
- **[#119720](https://github.com/openclaw/openclaw/issues/119720)** — Event loop blocked at scale.
- **[#126360](https://github.com/openclaw/openclaw/issues/126360)** — `AgentSelectionRequiredError` log flood under explicit ownership.
- **[#168955](https://github.com/openclaw/openclaw/issues/168955)** — Windows startup regression (~1030s vs ~410s).
- **[#193262](https://github.com/openclaw/openclaw/issues/193262)** — Docker startup ENOENT with Windows bind-mount.

**P2 (Notable)**
- **[#101929](https://github.com/openclaw/openclaw/issues/101929)** — Context-overflow estimator over-counts 2.3–2.6x.
- **[#163739](https://github.com/openclaw/openclaw/issues/163739)** — Ctrl+Shift+A collides with browser shortcuts.

**Fix PR status:** Linked PRs exist for #89278, #48003, #123792-adjacent, #150635, #163739, #136405, #104719, #114913. Several P1s (#177656, #44925, #119720) explicitly carry `clawsweeper:no-new-fix-pr` — **no fix in flight**.

---

## 6. Feature Requests & Roadmap Signals

| Issue | Theme | Likelihood for next release |
|---|---|---|
| [#50093](https://github.com/openclaw/openclaw/issues/50093) | WhatsApp message backfill after reconnect | Medium — channel parity expectation |
| [#16670](https://github.com/openclaw/openclaw/issues/16670) | Memory/Embedding mandatory onboarding step | High — cheap, high leverage |
| [#10687](https://github.com/openclaw/openclaw/issues/10687) | Fully dynamic model discovery (OpenRouter) | Medium — needs architecture |
| [#6757](https://github.com/openclaw/openclaw/issues/6757) | Agent-triggered self-compact tool | Medium — enables autonomy |
| [#101422](https://github.com/openclaw/openclaw/issues/101422) | Configurable memory recall eligibility paths | Medium |
| [#138366](https://github.com/openclaw/openclaw/issues/138366) | Plugin-driven Dreams page | Low — plugin-API expansion |
| [#14785](https://github.com/openclaw/openclaw/issues/14785) | Reduce tool schema token overhead (~3,500 tok/session) | High — recurring pain |

**Prediction:** Memory/embedding onboarding (#16670) and tool-schema token reduction (#14785) are the most likely roadmap candidates — both are bounded in scope, address cross-cutting costs, and align with recent memory-related maintenance effort.

---

## 7. User Feedback Summary

**Pain points (recurring):**
1. **Silent data loss** — messages, subagent completions, and recall entries vanish without user-visible failure ([#44925](https://github.com/openclaw/openclaw/issues/44925), [#112259](https://github.com/openclaw/openclaw/issues/112259), [#125764](https://github.com/openclaw/openclaw/issues/125764), [#101793](https://github.com/openclaw/openclaw/issues/101793)).
2. **Session-state corruption** — agents become permanently unavailable after crash or checkpoint failure ([#166634](https://github.com/openclaw/openclaw/issues/166634), [#126821](https://github.com/openclaw/openclaw/issues/126821), [#144336](https://github.com/openclaw/openclaw/issues/144336)).
3. **Platform friction** — macOS `gateway stop` broken ([#191944](https://github.com/openclaw/openclaw/issues/191944)); Windows startup regression ([#168955](https://github.com/openclaw/openclaw/issues/168955)); Docker/Windows bind-mount failure ([#193262](https://github.com/openclaw/openclaw/issues/193262)).
4. **Memory subsystem fragility** — `memory_search` 15s timeouts ([#128140](https://github.com/openclaw/openclaw/issues/128140), [#136405](https://github.com/openclaw/openclaw/issues/136405)), dreaming never promotes ([#150635](https://github.com/openclaw/openclaw/issues/150635)), active-memory blocking replies ([#72015](https://github.com/openclaw/openclaw/issues/72015)).

**Use cases surfacing:** Telegram/Signal/WhatsApp bots at scale, multi-agent gateways with explicit ownership, Windows/WSL2 Docker deployments, voice ("Talk") via Android.

**Sentiment:** Users are engaged and technically detailed, but **frustration is evident** around stability regressions that survive upgrades (e.g., #168955, #193262 — "regression, worked before"). The `not-repro-on-main` closures of #143278 and #139477 suggest a **stale-reproduction gap** where maintainers cannot confirm user reports on current main — a mismatch that may fuel mistrust.

---

## 8. Backlog Watch

High-value items with maintainer attention needed and no fix PR:

- **[#177656](https://github.com/openclaw/openclaw/issues/177656)** (P1, 32 comments, since 2026-10-19) — Native host exec integrity-admission error; `no-new-fix-pr`.
- **[#44925](https://github.com/openclaw/openclaw/issues/44925)** (P1, since 2026-03-13) — Subagent completion loss; ~8 months open, awaiting product decision.
- **[#119720](https://github.com/openclaw/openclaw/issues/119720)** (P1, since 2026-08-05) — Event-loop blockage at scale; fix-shape-clear but no PR.
- **[#126360](https://github.com/openclaw/openclaw/issues/126360)** (P1, since 2026-08-19) — AgentSelectionRequiredError flood; long-standing.
- **[#126821](https://github.com/openclaw/openclaw/issues/126821)** (P0, since 2026-08-20) — SQLite corruption recurrence; active but unresolved for ~11 weeks.
- **[#50093](https://github.com/openclaw/openclaw/issues/50093)** (P1, since 2026-03-19) — WhatsApp backfill; needs product decision.
- **[#6757](https://github.com/openclaw/openclaw/issues/6757)** (since 2026-02-02) — Self-compact tool; ~9 months awaiting maintainer review.

**PRs awaiting maintainer look:**
- [#190472](https://github.com/openclaw/openclaw/pull/190472) (P2, platinum hermit, ready for maintainer look).
- [#191324](https://github.com/openclaw/openclaw/pull/191324) (P2, waiting on maintainer, decision needed).
- [#190001](https://github.com/openclaw/openclaw/pull/190001) (P2, ready for maintainer look).

---

**Project health snapshot:** Strong contributor velocity and triage discipline (evidenced by consistent `clawsweeper` labeling), but **stability debt in session-state, SQLite, and message-delivery paths** is accumulating faster than fixes land. The absence of a release today and the presence of unreachable fixes (e.g., #193962) suggest a downstream/upstream update-path concern worth maintainer attention before the next stable cut.

---

## Cross-Ecosystem Comparison

# Cross-Project Comparison Report — AI Agent / Personal Assistant Open-Source Ecosystem
**Reporting date:** 2026-11-08 · **Projects covered:** OpenClaw, Hermes Agent, IronClaw, QwenPaw, ZeroClaw

---

## 1. Ecosystem Overview

The personal AI assistant / agent open-source landscape on 2026-11-08 is defined by a stark divergence between **community scale and maintainer throughput**. The two heavyweight projects — **OpenClaw** and **Hermes Agent** — each processed ~500 and ~50 tracked items respectively in 24 hours, yet neither shipped a release, and both carry unresolved P0/P1 stability debt concentrated in **session-state integrity, message delivery, and persistence layers**. A second tier — **ZeroClaw** and **QwenPaw** — is executing disciplined pre-release hardening: ZeroClaw is burning down a security-backlog for `v0.9.0`, while QwenPaw is landing coherent "context-window correctness" patches. **IronClaw** sits effectively dormant, with a single unanswered provider request. The cross-cutting signal is that the ecosystem has reached a **reliability inflection point**: contributors are voting with detailed regression reports, not feature requests, and trust now hinges on whether maintainers can convert community velocity into merged, shipped stabilization.

---

## 2. Activity Comparison

| Project | Issues (24h) | PRs (24h) | Merged/Closed PRs | Release Status | Dominant Theme | Health Score |
|---|---|---|---|---|---|---|
| **OpenClaw** | 500 (422 open / 78 closed) | 500 (313 open / 187 closed) | 187 | None (last: `2026.11.5-beta.1`) | Session-state, SQLite, message loss | 🟠 High velocity, accumulating stability debt |
| **Hermes Agent** | 50 (updated) | 50 (all open) | **0** | None (last: `v0.22.7`) | Unified Gateway fallout, Kanban persistence | 🔴 Stalled merge pipeline |
| **IronClaw** | 1 (open, 0 comments) | 0 | 0 | None | Single provider request | 🟡 Quiet, low velocity |
| **QwenPaw** | 4 (3 open / 1 closed) | 6 (all open) | 0 | None (last: `v2.2.2.post1`) | Context/token mgmt, desktop stability | 🟢 Backend trending positive, desktop risk |
| **ZeroClaw** | 22 | 35 | 4 | None (`v0.9.0` imminent) | Identity/Access, security hardening | 🟠 Mature but review-bandwidth constrained |

**Key data points:**
- OpenClaw alone accounts for **~85% of all tracked items** across the five projects.
- Three of five projects (**Hermes, IronClaw, QwenPaw**) had **zero merges** today.
- **No project shipped a release** in the window — a synchronized pre-release freeze across the ecosystem.
- ZeroClaw is the only project where **security-critical fixes were closed and verified** in the window (#11126, #12050, #12260).

---

## 3. OpenClaw's Position

**Advantages vs. peers:**
- **Scale of contributor base.** With 500 issues + 500 PRs touched in a single day and 187 items merged/closed, OpenClaw's throughput dwarfs all peers combined. Its `clawsweeper` triage labeling infrastructure demonstrates process maturity no other project matches.
- **Broadest integration surface.** Telegram, Signal, WhatsApp, macOS/Windows/Docker, voice ("Talk"), multi-agent gateways — OpenClaw is the only project in the set with production-scale multi-channel parity ambitions.

**Technical approach differences:**
- OpenClaw's architecture is **gateway-centric with explicit ownership and shared-state admission control**, which is precisely where its hardest bugs live (#177656 integrity-admission, #44925 lost subagent completions). Peers are simpler: Hermes is mid-migration to a unified gateway, ZeroClaw is authority/RBAC-focused, QwenPaw is a single-agent runtime.
- It relies on **SQLite for persistence**, and SQLite contention/corruption (#126821, #193962) is a recurring P0 — a scale bottleneck peers have not yet hit.

**Community size comparison:**
- OpenClaw's top issue (#177656) has **32 comments**; Hermes's top meta-tracker has **54**; but OpenClaw's *count* of active high-severity threads (6+ with 24–32 comments each) indicates an order-of-magnitude larger engaged user base than QwenPaw (max 4 comments) or IronClaw (0).
- **Risk:** OpenClaw's stability debt is *accumulating faster than fixes land* — several P1s (#177656, #44925, #119720) carry `no-new-fix-pr`. Its ecosystem leadership is real, but its reliability reputation is the primary vulnerability.

---

## 4. Shared Technical Focus Areas

Requirements surfacing independently across multiple projects:

| Focus Area | Projects | Specific Need |
|---|---|---|
| **Session/turn data integrity** | OpenClaw, Hermes, ZeroClaw, QwenPaw | Silent message/turn loss (OpenClaw #44925; Hermes #137652, #147839; ZeroClaw #11420 timestamp overwrite). Universal demand for durable, auditable transcripts. |
| **Context/token budget correctness** | OpenClaw, Hermes, QwenPaw, ZeroClaw (Tsubasa ref) | Tool-schema token overhead (OpenClaw #14785); `context_length` floor blocking local models (Hermes #53347); token-estimation drift & compaction errors (QwenPaw #8613/#8614); explicit 32K budget paths (IronClaw #8115). |
| **Provider/registry-driven model config** | IronClaw, QwenPaw, OpenClaw | Curated provider entries over generic OpenAI-compatible shims (IronClaw #8115); provider fallback when a saved provider is disabled (QwenPaw #8617); dynamic model discovery (OpenClaw #10687). |
| **Cross-agent / multi-agent orchestration UX** | QwenPaw, OpenClaw, Hermes | Multi-agent opacity — users can't tell who's talking to whom (QwenPaw #2420); subagent completion loss (OpenClaw #44925); cross-gateway bot collaboration (Hermes #97681). |
| **Secrets redaction & security hygiene** | Hermes, ZeroClaw | Password leaks in logs/tool output (Hermes #150880, #150879); authority/ownership bypasses and model-controlled approval flags (ZeroClaw #9646, #12227). |
| **Memory subsystem reliability** | OpenClaw, Hermes | Recall eviction blocking promotion (OpenClaw #150635); `memory_search` timeouts (#128140); stale fact lookups (Hermes #150933). |
| **Storage bloat on long-lived installs** | Hermes, ZeroClaw | Duplicate reasoning tokens & per-session config copies (Hermes #125273, #150838); append-only session history rewrite (ZeroClaw #11921). |

**Emerging consensus:** The ecosystem is converging on the view that **persistence correctness is the foundational requirement** — every other feature (memory, dreaming, multi-agent, audit) depends on it.

---

## 5. Differentiation Analysis

| Dimension | OpenClaw | Hermes Agent | ZeroClaw | QwenPaw | IronClaw |
|---|---|---|---|---|---|
| **Feature focus** | Multi-channel gateway, memory/dreaming, autonomous workflows | Unified gateway, Kanban workers, plugin marketplace | Identity/access control, relay dashboards, RBAC | Single-agent runtime, context correctness, desktop UX | Provider registry expansion |
| **Target users** | Production-scale bot operators, multi-agent gateways | Power users, self-hosted gateway operators, plugin devs | Multi-tenant/security-conscious operators | Windows desktop users, local-model enthusiasts | Integrators wanting curated providers |
| **Architecture** | Gateway + SQLite + shared-state admission | Unified single-process gateway (recent migration) | Authority/RBAC + relay-served dashboards | Monolithic runtime, provider-pluggable tools | OpenAI-compatible backend + registry |
| **Contribution model** | High-volume external PRs, `clawsweeper` triage | Plugin Hackathon catalog submissions | Reviewed XL PR stacks on security | Small, technically engaged fixer contributors | Near-zero |
| **Distinctive bet** | Breadth of channels + autonomy | Plugin marketplace as ecosystem surface | Security/authority as the moat | Context-window precision + desktop polish | Provider ergonomics |

**Notable divergence:** Hermes is betting on a **plugin marketplace as its primary growth engine** (dozens of Hackathon catalog PRs — restoreproof, Obol, SecretShield, etc.), whereas ZeroClaw is betting on **security hardening as credibility** (`v0.9.0` is essentially a security release). OpenClaw's bet is **channel breadth**; QwenPaw's is **runtime correctness**. These are non-overlapping strategies, which reduces direct head-to-head competition today.

---

## 6. Community Momentum & Maturity

**Activity tiers:**

- **Tier 1 — Hyperscale (OpenClaw):** ~1,000 tracked items/day. Maturing triage infrastructure, but reliability debt outpacing fixes. *Rapidly iterating; not yet stabilizing.*
- **Tier 2 — High-engagement, pipeline-constrained (Hermes):** Very active community, **zero merges today**. Ecosystem surging (plugins), maintainer pipeline is the bottleneck. *Rapidly iterating on inputs; stalled on outputs.*
- **Tier 2b — Disciplined hardening (ZeroClaw):** 57 items, 4 merged including 3 security-critical. High contributor throughput offset by large `risk:high`/`size:XL` review queue. *Stabilizing deliberately toward `v0.9.0`.*
- **Tier 3 — Focused correction (QwenPaw):** 10 items, 6 coherent open PRs from a small contributor set. Backend correctness trending positive; desktop risk unresolved. *Stabilizing on the backend; iterating on UX.*
- **Tier 4 — Dormant (IronClaw):** 1 issue, 0 PRs, 0 merges, ~6 weeks without maintainer response. *Neither iterating nor stabilizing.*

**Maturity read:** OpenClaw and ZeroClaw show **process maturity** (labeling, sweepers, release gates). Hermes shows **community maturity but process bottleneck**. QwenPaw shows **early-stage but high signal quality**. IronClaw shows **stagnation risk**.

---

## 7. Trend Signals

Extracted from community feedback across all five projects — directly relevant to AI agent developers:

1. **Reliability > novelty.** In every active project, the top-voted and most-commented threads concern **data loss, silent failures, and session corruption** — not new features. Trust in long-running autonomous agents is the scarcest commodity. *Implication: prioritize durable persistence, idempotent delivery, and user-visible failure modes over feature breadth.*

2. **The "saved success, did nothing" anti-pattern is widespread.** ZeroClaw (#12228 `cron update --agent`), Hermes (#147839 timeout poisons turn), and OpenClaw (lost subagent completions) all report operations that report success but silently no-op. *Implication: verification/test gaps in merge pipelines are an industry-wide weakness; agents need end-to-end effect confirmation, not just RPC acknowledgment.*

3. **Context-window correctness is a first-class engineering problem.** Tool-schema overhead (~3,500 tok/session), token-estimation drift, and hard context floors are blocking real deployments (16GB Ollama users, 1M-token children). *Implication: adopt provider-reported usage calibration over heuristic estimation (QwenPaw #8614 is a reference pattern).*

4. **Multi-agent orchestration is powerful but opaque.** Identity confusion, unclear triggering, and cross-agent data access (#9646 S0) are recurring. *Implication: ownership scoping and observable agent identity are table stakes before multi-agent adoption scales.*

5. **Security is migrating from perimeter to per-action.** ZeroClaw's per-sender RBAC debate (#5982), Hermes's redaction gaps, and OpenClaw's `security-boundary` tags all point to **fine-grained, per-action authority** rather than network-level trust. *Implication: design for per-sender/per-session authorization and model-controlled-action safeguards from the start.*

6. **The plugin marketplace is becoming the ecosystem battleground.** Hermes's Hackathon surge shows that **extension surfaces attract contributors faster than core features** — but catalog review throughput becomes the new bottleneck. *Implication: invest in plugin review automation and manifest-conflict safety (see Hermes #121078).*

7. **Storage efficiency and cost transparency matter.** Duplicate reasoning tokens, per-session config copies, and prompt-cache invalidation (#11696) are emerging as cost and performance concerns. *Implication: audit storage growth and cache stability on long-lived installs; these are silent cost multipliers.*

8. **Release cadence is synchronized-frozen across the ecosystem.** Every project is pre-release, with fixes accumulating unreachable (OpenClaw #193962). *Implication: an industry-wide gap between merged and shipped — downstream users run stale, buggy versions. Update-path reliability is an underserved requirement.*

---

**Bottom line for decision-makers:** The ecosystem is healthy in contributions but strained in throughput and reliability. **OpenClaw leads on scale, ZeroClaw on security discipline, Hermes on ecosystem energy, QwenPaw on runtime precision, and IronClaw lags.** The winning project in the next two quarters will not be the one with the most features, but the one that **converts community velocity into shipped, verifiable reliability** — especially in session persistence, message delivery, and context correctness.

---

## Peer Project Reports

<details>
<summary><strong>Hermes Agent</strong> — <a href="https://github.com/nousresearch/hermes-agent">nousresearch/hermes-agent</a></summary>

# Hermes Agent — Project Digest
**Date:** 2026-11-08
**Repository:** [github.com/NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent)

---

## 1. Today's Overview

Hermes Agent is showing **very high community activity but a stalled merge pipeline**: 50 issues and 50 PRs were touched in the last 24h, yet **zero PRs were merged or closed today**. The project is dominated by a large wave of **Plugin Hackathon catalog submissions** (the bulk of the open PRs), which is great for ecosystem growth but appears to be creating review backlog pressure on maintainers.

On the stability side, the picture is concerning: a cluster of **P1 bugs** remains open around the Unified Gateway (#106742) post-merge fallout, Kanban worker persistence failures, and session-state corruption. No new release was cut today, and the most-discussed issue (#143547, 54 comments) is still an open meta-tracker for regressions introduced by the unified gateway migration. Overall project health: **high engagement, elevated technical debt, and a backlog that needs triage attention.**

---

## 2. Releases

**None.** No new releases were published in the last 24h. The latest stable line referenced in issues is **v0.22.7** (per [#150939](https://github.com/NousResearch/hermes-agent/issues/150939) and [#149660](https://github.com/NousResearch/hermes-agent/issues/149660)), with some users on v0.22.1 ([#139029](https://github.com/NousResearch/hermes-agent/issues/139029)).

⚠️ **Note:** Given the volume of open P1/P2 regressions (see §5), the next release will likely need to bundle gateway-stability and session-persistence fixes before it can be considered safe for upgrade.

---

## 3. Project Progress

**Merged/Closed PRs today: 0.** No pull requests were merged or closed in the reporting window.

**Closed Issues today (4):**
- [#142906](https://github.com/NousResearch/hermes-agent/issues/142906) — Desktop: legacy HTTP gateway restored as primary after restart on Windows *(closed)*
- [#150038](https://github.com/NousResearch/hermes-agent/issues/150038) — `hermes dashboard` needs pnpm unavailable on `linux-arm64-bionic` (Termux) *(closed)*
- [#28632](https://github.com/NousResearch/hermes-agent/issues/28632) — `hermes gateway restart --all` leaves launchd service unloaded on macOS if interrupted *(closed)*
- One additional issue (not shown in top-30 sample)

**Assessment:** Progress today is essentially **negative-to-flat** — no features shipped, no fixes landed, while ~50 new PRs (mostly plugin-catalog entries) piled up for review. The closed issues are largely maintenance/edge-case items.

---

## 4. Community Hot Topics

| Rank | Item | Comments | Signal |
|------|------|----------|--------|
| 1 | [#143547](https://github.com/NousResearch/hermes-agent/issues/143547) — Unified gateway post-merge problems on `main` | **54** | 🔥 Critical meta-tracker |
| 2 | [#97681](https://github.com/NousResearch/hermes-agent/issues/97681) — Let Bots collaborate across gateways | **40** | 👍 4 — roadmap demand |
| 3 | [#145022](https://github.com/NousResearch/hermes-agent/issues/145022) — Kanban workers crash on gateway stall | **19** | P1 stability |
| 4 | [#121095](https://github.com/NousResearch/hermes-agent/issues/121095) — `browser_exec` leaks stale daemon processes | **19** | Resource leak |
| 5 | [#52554](https://github.com/NousResearch/hermes-agent/issues/52554) — Desktop: floating "Quote" button | **13** | 👍 4 — UX request |
| 6 | [#53347](https://github.com/NousResearch/hermes-agent/issues/53347) — Allow `context_length` below 64K | **10** | 👍 **9** — highest-reacted |

**Underlying needs analysis:**
- **#143547** is the epicenter of user frustration: the October 14 unified-gateway migration (#106742) consolidated every local conversation (CLI, TUI, Desktop, API, editors, bots, cron, Kanban, Group Chats) into a single process, and the post-merge fallout is broad. This is the single most important thread for maintainers to own.
- **#97681** signals a strategic community appetite for **cross-gateway, cross-owner bot federation** — a foundation-laying feature rather than a quick fix.
- **#53347** (👍 9) exposes a real **low-resource deployment segment**: 16GB MacBook + Ollama users blocked by the hard 64K context floor. High reaction-to-comment ratio = broad silent agreement.

---

## 5. Bugs & Stability

Ranked by severity:

### 🔴 P1 (Critical)
- **[#145022](https://github.com/NousResearch/hermes-agent/issues/145022)** — Kanban workers crash with *"Kanban execution unknown; retained by owner"* when the gateway stalls during worker saves. One stall killed **4 workers simultaneously**; work-in-progress is lost. *(Fix PR: none visible)*
- **[#139029](https://github.com/NousResearch/hermes-agent/issues/139029)** — Kanban managed worker dies with `WorkerPersistenceError: synchronous_rpc_on_event_loop`. Reported on **v0.22.1 stable**. *(Fix PR: none visible)*
- **[#137652](https://github.com/NousResearch/hermes-agent/issues/137652)** — **Data loss:** compaction deletes a user message merged after a todo snapshot. *(Fix PR: none visible)*

### 🟠 P2 (High)
- **[#147839](https://github.com/NousResearch/hermes-agent/issues/147839)** — A single 20s `worker_receipt_timeout` poisons the persistence store and destroys the whole turn ("No reply"). 11 occurrences clustered on one install.
- **[#144116](https://github.com/NousResearch/hermes-agent/issues/144116)** — Upstream "Clean EOF" stream drop mislabeled as token truncation; stub message poisons session into a **replay death-loop**.
- **[#125273](https://github.com/NousResearch/hermes-agent/issues/125273)** — Every reasoning token stored **twice** in `state.db` (`reasoning` == `reasoning_content`). Storage bloat.
- **[#108891](https://github.com/NousResearch/hermes-agent/issues/108891)** — Delegate subagents capped at 20,000-char context floor because `delegate_tool` doesn't pass `context_length` (breaks 1M-token children).
- **[#147738](https://github.com/NousResearch/hermes-agent/issues/147738)** — Android beta native sign-in opens `/auth/callback` twice → `invalid_grant` error page (though sign-in succeeds).
- **[#150838](https://github.com/NousResearch/hermes-agent/issues/150838)** — `gateway.local_policy.v1` rows duplicate the entire profile config per session → dominant `state.db` growth on long-lived installs.
- **[#121095](https://github.com/NousResearch/hermes-agent/issues/121095)** — `browser_exec` leaks `browser_harness.daemon` processes forever (no inactivity timeout).
- **[#140786](https://github.com/NousResearch/hermes-agent/issues/140786)** — Merged consecutive user turn keeps the *previous* turn's timestamp after persist override.
- **[#102081](https://github.com/NousResearch/hermes-agent/issues/102081)**, **[#45106](https://github.com/NousResearch/hermes-agent/issues/45106)** (SELinux breaks Docker backend), **[#149996](https://github.com/NousResearch/hermes-agent/issues/149996)** (Apple `fm serve` 400s on tool-schema unions).

### 🟡 P3 / Other
- **[#150939](https://github.com/NousResearch/hermes-agent/issues/150939)** — `/retry` re-sends synthetic mirrored user rows (cron deliveries) merged into last turn.
- **[#150933](https://github.com/NousResearch/hermes-agent/issues/150933)** — Fact lookups return stale history without tools despite explicit re-check request.
- **[#150880](https://github.com/NousResearch/hermes-agent/issues/150880)** / **[#150879](https://github.com/NousResearch/hermes-agent/issues/150879)** — 🔐 **Security:** connection-string password redaction fails on quoted passwords and on query-string DB passwords (secret leaks to logs/tool output).
- **[#121078](https://github.com/NousResearch/hermes-agent/issues/121078)** — Plugin discovery silently loads `plugins/foo.bak-*` over `plugins/foo` on manifest name collision.

**Key takeaway:** The **two dominant failure domains** are (a) **Unified Gateway session-state/message-delivery** and (b) **Kanban worker persistence**. Both carry session-state risk sweepers, indicating maintainers already flagged them. **No visible fix PRs accompany any P1 today** — the merge pipeline stalled exactly when it's most needed.

---

## 6. Feature Requests & Roadmap Signals

**Most-likely candidates for upcoming releases** (ranked by demand × tractability):

1. **[#53347](https://github.com/NousResearch/hermes-agent/issues/53347)** — Allow `context_length` below 64K (warn instead of hard-fail). 👍 9, P2, `needs-decision`. Low-effort, high-impact for local-model users → **strong candidate for next version.**
2. **[#52554](https://github.com/NousResearch/hermes-agent/issues/52554)** — Desktop floating "Quote" button. 👍 4, pure UX → plausible near-term Desktop item.
3. **[#97681](https://github.com/NousResearch/hermes-agent/issues/97681)** — Cross-gateway bot collaboration. 👍 4, labeled `needs-decision` — strategic, multi-release effort.
4. **[#150767](https://github.com/NousResearch/hermes-agent/issues/150767)** — Option to record gateway slash-command replies in session transcript.
5. **[#98934](https://github.com/NousResearch/hermes-agent/issues/98934)** — Delegation: persist/report requested/resolved/actual model evidence (`needs-decision`).
6. **[#142933](https://github.com/NousResearch/hermes-agent/issues/142933)** — Scope background-review skill writes by ownership. 👍 1, `type/security`.

**Ecosystem signal:** The enormous influx of **Plugin Hackathon catalog PRs** (restoreproof, Obol, hermes-detox, raise, write-gate, SecretShield, delegation-receipts, epoch, personal-assistant, Canonry, werracle-evm-guard, underwriting, visual-gate, plan-tracker, vibeleak-atlas, receipts, telegram_dashboard_probe, Strudel Studio, kata, recall-vault, …) is itself a roadmap signal: **the plugin marketplace is becoming the primary community contribution surface**, and catalog review throughput is now a project bottleneck.

---

## 7. User Feedback Summary

**Pain points (verbatim themes):**
- **Session/turn loss is the #1 grievance.** *"No reply: Hermes couldn't save t…"* ([#147839](https://github.com/NousResearch/hermes-agent/issues/147839)); *"the run's work in progress is lost"* ([#145022](https://github.com/NousResearch/hermes-agent/issues/145022)); *"a replay death-loop"* ([#144116](https://github.com/NousResearch/hermes-agent/issues/144116)). Users are losing **work and trust** in long-running gateway deployments.
- **Resource-constrained local users feel locked out** ([#53347](https://github.com/NousResearch/hermes-agent/issues/53347)) — a 16GB MacBook cannot use Ollama despite models working fine at 32K.
- **Storage bloat on long-lived installs** ([#125273](https://github.com/NousResearch/hermes-agent/issues/125273), [#150838](https://github.com/NousResearch/hermes-agent/issues/150838)) — duplicate reasoning tokens and per-session config copies.
- **Redaction gaps are a security concern** ([#150880](https://github.com/NousResearch/hermes-agent/issues/150880), [#150879](https://github.com/NousResearch/hermes-agent/issues/150879)) — passwords leak to logs.

**Positive signals:**
- 🚀 **Plugin Hackathon participation is vibrant** — dozens of independently maintained, commit-pinned plugin submissions, many with careful scope/disclosure notes. This reflects genuine developer enthusiasm and a healthy extension model.
- Users are shipping production workloads (Kanban multi-worker setups, self-hosted HTTPS gateways via Tailscale) — a sign Hermes is being used beyond toy scenarios.

**Dissatisfaction driver:** The gap between **community velocity** (plugins, ideas) and **maintainer throughput** (0 merges, P1s unpatched) risks eroding confidence if it persists.

---

## 8. Backlog Watch

Long-lived or high-impact items awaiting maintainer attention:

| Item | Age | Why it matters |
|------|-----|----------------|
| [#52554](https://github.com/NousResearch/hermes-agent/issues/52554) — Desktop Quote button | Created 2026-06-25 (**~4.5 months**) | 👍 4, still open, no assignee signal |
| [#53347](https://github.com/NousResearch/hermes-agent/issues/53347) — context_length floor | Created 2026-06-27 (**~4.5 months**) | 👍 **9**, `needs-decision`, blocks local model segment |
| [#45106](https://github.com/NousResearch/hermes-agent/issues/45106) — SELinux breaks Docker backend | Created 2026-06-12 (**~5 months**) | Platform compatibility for OpenSUSE/SELinux users |
| [#97681](https://github.com/NousResearch/hermes-agent/issues/97681) — Cross-gateway bot collaboration | Created 2026-08-29 | 👍 4, foundational architecture, `needs-decision` |
| [#121078](https://github.com/NousResearch/hermes-agent/issues/121078) — Silent plugin manifest collision | Created 2026-09-24 | Growing risk as plugin ecosystem scales |
| [#121095](https://github.com/NousResearch/hermes-agent/issues/121095) — `browser_harness.daemon` leak | Created 2026-09-24 | Resource exhaustion on long-running hosts |
| [#98934](https://github.com/NousResearch/hermes-agent/issues/98934) — Delegation model evidence | Created 2026-08-30 | `needs-decision`, blocks #945 follow-through |
| **All 50 open PRs** | — | **0 merged today**; catalog-review backlog needs triage ownership |

---

### 📊 Health Scorecard (2026-11-08)

| Dimension | Status |
|-----------|--------|
| Community engagement | 🟢 Very high |
| Merge/release velocity | 🔴 Stalled (0 merges, 0 releases) |
| P1 stability | 🔴 3 open, no fix PRs |
| Data-integrity risk | 🔴 Session/turn loss recurring |
| Ecosystem growth | 🟢 Hackathon surge |
| Security hygiene | 🟠 Redaction gaps pending |

**Bottom line:** Hermes Agent has a **thriving community and a growing plugin ecosystem**, but the maintainer pipeline is the current constraint. The **Unified Gateway (#143547)** and **Kanban persistence (#145022, #139029)** clusters should be treated as release-blocking, and the plugin-catalog PR queue needs a dedicated reviewer to prevent contributor fatigue.

</details>

<details>
<summary><strong>IronClaw</strong> — <a href="https://github.com/nearai/ironclaw">nearai/ironclaw</a></summary>

# IronClaw Project Digest — 2026-11-08

## 1. Today's Overview

IronClaw (github.com/nearai/ironclaw) showed minimal activity in the last 24 hours: no pull requests were updated, no releases were published, and no issues were opened or closed. The single tracked item is Issue #8115, which received an update on 2026-11-07 but still has zero comments after roughly six weeks since creation (2026-09-28). With only one active item and no code movement, the project appears to be in a quiet maintenance phase rather than active development. The lack of maintainer or community engagement on the sole open issue suggests a potential responsiveness gap worth monitoring.

## 2. Releases

No new releases in the reporting window. Nothing to report on version changes, breaking changes, or migration notes.

## 3. Project Progress

No pull requests were merged or closed today, and no PRs are currently open. There is no measurable feature advancement or bug-fix progress to report for this period. The project's development throughput over the last 24 hours is effectively zero.

## 4. Community Hot Topics

Only one item had any activity, and it has no discussion yet:

- **[Issue #8115](https://github.com/nearai/ironclaw/issues/8115)** — "Add a Tsubasa registry entry with an explicit 32K context-budget path" (OPEN, author: cenab, updated 2026-11-07, 0 comments, 0 👍)

**Underlying need:** The requester wants first-class support for the Tsubasa provider in IronClaw's registry, specifically with an explicit 32K context-budget path. The motivation is ergonomic: while IronClaw already exposes an OpenAI-compatible backend, users configuring Tsubasa must manually supply the endpoint and model. A named registry entry would streamline credential setup, model selection, and—critically—context-window budgeting. This reflects a broader pattern among personal AI assistant users: they want curated, provider-aware defaults rather than generic OpenAI-compatible shims, especially where context limits affect agent memory and long-conversation behavior.

Because the issue has drawn zero comments and zero reactions, it cannot yet be characterized as a "hot" topic—it is a single-voice request awaiting triage.

## 5. Bugs & Stability

No bugs, crashes, or regressions were reported in the last 24 hours. Issue #8115 is a feature/enhancement request, not a defect. Project stability indicators are neutral due to absence of data.

## 6. Feature Requests & Roadmap Signals

One feature request is active:

- **Tsubasa provider registry entry with explicit 32K context-budget path** ([#8115](https://github.com/nearai/ironclaw/issues/8115))

**Prediction:** This is a well-scoped, low-risk enhancement that fits naturally with IronClaw's existing OpenAI-compatible backend. If a maintainer picks it up, it could plausibly land in the next minor release as a config/registry addition. However, the six-week staleness (created 2026-09-28, last touched 2026-11-07 with no comments) and the complete absence of PRs suggest it is not currently on an active roadmap. Without maintainer triage, the probability of near-term implementation is low.

## 7. User Feedback Summary

The single data point of user feedback comes from Issue #8115:

- **Pain point:** Manual configuration friction when using Tsubasa—users must hand-enter endpoint and model details despite IronClaw already supporting OpenAI-compatible backends.
- **Use case:** Running agent workloads against Tsubasa with a defined 32K context budget, where explicit context accounting matters for reliability.
- **Satisfaction/dissatisfaction:** Neutral-to-mildly-dissatisfied; the user frames it as a clarity/convenience gap rather than a blocking defect ("A named provider could make credential setup and model selection clearer").

No other user sentiment was captured in this window, so broader satisfaction trends cannot be assessed.

## 8. Backlog Watch

- **[Issue #8115](https://github.com/nearai/ironclaw/issues/8115)** — OPEN since 2026-09-28, last updated 2026-11-07, **0 comments, 0 reactions, no linked PR**. This is the only tracked item and it has gone ~6 weeks without a maintainer response. While low in severity, the silence is a signal: if IronClaw wants to grow its provider ecosystem and retain integrators like Tsubasa users, timely acknowledgment of registry/provider requests matters. **Recommended action:** a maintainer triage comment (accept / defer / needs-design) would close the feedback loop and clarify roadmap intent.

---

**Health assessment:** Quiet but not distressed. Zero PR activity and a single unanswered issue indicate low current velocity; the project's near-term trajectory depends on whether maintainers engage the open provider request. No stability or release risks identified in this window.

</details>

<details>
<summary><strong>QwenPaw</strong> — <a href="https://github.com/agentscope-ai/QwenPaw">agentscope-ai/QwenPaw</a></summary>

# QwenPaw Project Digest — 2026-11-08

## 1. Today's Overview

QwenPaw shows **moderate-to-high activity** over the last 24 hours, with 4 issues updated (3 open/active, 1 closed) and 6 pull requests updated (all still open, none merged). No new releases were published. The day's PR traffic is heavily concentrated on **context/token management and provider fallback fixes**, suggesting the team is hardening the agent runtime rather than shipping new surface features. Meanwhile, a cluster of Windows desktop startup and UI responsiveness bugs (#8616, #8521) indicates the 2.3.0-beta line and recent 2.2.2 builds still have platform-specific stability gaps. Community engagement remains modest (max 4 comments on any item, no reactions), but issue quality is high — detailed repro steps and benchmarks are being submitted.

---

## 2. Releases

**None.** No new releases in the last 24h. The latest referenced builds in the wild are `v2.2.2.post1` (stable) and `2.3.0-beta.1` (beta, currently failing to launch on at least one Windows configuration — see Bugs & Stability).

---

## 3. Project Progress

No PRs were merged or closed in the last 24h, so there is no completed feature work to report. However, **six open PRs advanced the review pipeline**, all targeting runtime robustness:

| PR | Type | Focus |
|---|---|---|
| [#8617](https://github.com/agentscope-ai/QwenPaw/pull/8617) | fix(agents) | Fallback when a saved model provider is disabled (fixes #8579) |
| [#8615](https://github.com/agentscope-ai/QwenPaw/pull/8615) | fix(providers) | Recognize gateway context-overflow 400s (Strata etc.) |
| [#8614](https://github.com/agentscope-ai/QwenPaw/pull/8614) | fix(token-usage) | Calibrate prompt estimates with provider-reported usage |
| [#8613](https://github.com/agentscope-ai/QwenPaw/pull/8613) | fix(context) | Reserve configured output limit when planning compaction |
| [#8292](https://github.com/agentscope-ai/QwenPaw/pull/8292) | fix(agents) | Sanitize malformed file content parts lacking `file_id`/`file_data` |
| [#8618](https://github.com/agentscope-ai/QwenPaw/pull/8618) | feat(tools) | Add SpecStream as a `web_search` provider (first-time contributor) |

Notably, **three of the six PRs (#8613, #8614, #8615) come from a single contributor (lanjinzhoucode)** and together form a coherent "context window correctness" patch set — likely to land as a group.

---

## 4. Community Hot Topics

**1. [#2420 — Cross-agent collaboration UX feedback (CLOSED, 4 comments)](https://github.com/agentscope-ai/QwenPaw/issues/2420)**
The most-commented item of the day. The reporter (running `0.2.0.post1`) raised four distinct pain points: (1) lack of onboarding for cross-agent collaboration, (2) unclear triggering of cross-agent communication, (3) incoherent multi-agent workflows, and (4) **agent identity confusion**. Despite being closed, the underlying need — *multi-agent orchestration is powerful but opaque* — is the strongest roadmap signal in this batch.

**2. [#8521 — Missing responses + Ctrl+C requires multiple presses (OPEN, 3 comments)](https://github.com/agentscope-ai/QwenPaw/issues/8521)**
A compound UX bug on `v2.2.2.post1`: replies frequently contain only "thinking" output, clipboard copying fails on first attempt in both Chrome and Edge, and the new UI is perceived as slower and less efficient than the old one. The user explicitly requests **a UI toggle to revert to the legacy layout**.

**3. [#8616 — 2.3.0-beta.1 fails to start on Windows 11 IoT LTSC (OPEN, 2 comments)](https://github.com/agentscope-ai/QwenPaw/issues/8616)**
Detailed environment report: `2.2.2+post.1` works in `C:\QwenPaw`, while `2.3.0-beta.1` throws "path not found" then AppHangs on the same machine. Highest-severity new report of the day.

---

## 5. Bugs & Stability

Ranked by severity:

| Severity | Item | Status | Fix PR? |
|---|---|---|---|
| 🔴 **Critical** | [#8616](https://github.com/agentscope-ai/QwenPaw/issues/8616) — **2.3.0-beta.1 will not launch on Windows 11 IoT LTSC**; "path not found" → AppHang. Regression vs. 2.2.2 on identical hardware. | OPEN | ❌ None yet |
| 🟠 **High** | [#8521](https://github.com/agentscope-ai/QwenPaw/issues/8521) — Replies sporadically contain **no answer content** (only reasoning trace); Ctrl+C copy requires repeated presses across Chrome and Edge; generalized UI sluggishness in new layout. | OPEN | ❌ None yet |
| 🟡 **Medium** | [#8579](https://github.com/agentscope-ai/QwenPaw/issues/8579) (referenced) — Every channel run fails with `ProviderError("Provider is disabled")` when the saved `active_model`'s provider is turned off. | Fix PR exists: [#8617](https://github.com/agentscope-ai/QwenPaw/pull/8617) |
| 🟡 **Medium** | [#8280](https://github.com/agentscope-ai/QwenPaw/issues/8280) (referenced) — HTTP 400 from OpenAI-compatible providers when conversation history contains file references with missing backing data. | Fix PR exists: [#8292](https://github.com/agentscope-ai/QwenPaw/pull/8292) |
| 🟢 **Low–Med** | Gateway context-overflow 400s not recognized by `_is_context_overflow_error()` | Fix PR exists: [#8615](https://github.com/agentscope-ai/QwenPaw/pull/8615) |
| 🟢 **Low–Med** | Token estimation drift (`bytes/4`) causing premature/incorrect compaction for digit-heavy prompts | Fix PR exists: [#8614](https://github.com/agentscope-ai/QwenPaw/pull/8614) |

**Takeaway:** The *backend* error-handling bugs all have candidate fixes in flight. The *desktop/UI* bugs (#8616, #8521) — the two highest-severity items — have **no fix PRs**, which is the primary stability risk right now.

---

## 6. Feature Requests & Roadmap Signals

1. **Legacy UI toggle / UI performance restoration** — [#8521](https://github.com/agentscope-ai/QwenPaw/issues/8521) explicitly asks for a switch back to the old display mode, citing poor model-switching ergonomics (large empty areas) and laggy interactions. *Prediction: likely addressed as a settings toggle or a performance pass in a 2.2.x patch.*
2. **Better execution-tool call visibility** — [#8612](https://github.com/agentscope-ai/QwenPaw/issues/8612) notes that most tools now render as friendly one-liners (e.g., "⏱ 获取 当前时间"), but **execution-class tool calls are inscrutable during long tasks**. *Prediction: a candidate for 2.3.x UI polish; low implementation cost, high perceived value.*
3. **Cross-agent collaboration onboarding & identity clarity** — [#2420](https://github.com/agentscope-ai/QwenPaw/issues/2420), though closed, bundles four structural feature asks around multi-agent flows. *Prediction: this theme recurs and likely feeds a dedicated multi-agent UX epic rather than a point release.*
4. **Pluggable web search providers** — [#8618](https://github.com/agentscope-ai/QwenPaw/pull/8618) adds SpecStream as a `web_search` provider, signaling continued investment in a provider-pluggable tool ecosystem. *Prediction: merges once the contributor resolves review comments; evidence the search-provider interface is now stable enough for third parties.*

---

## 7. User Feedback Summary

**Pain points (dissatisfaction):**
- **Multi-agent opacity** — users can't tell what agents are doing, who is talking to whom, or which agent is which (#2420).
- **Silent failures** — replies that contain only "thinking" and no answer (#8521); beta builds that Hang on launch (#8616).
- **UI regression fatigue** — the new interface is described as less efficient, slower, and harder to operate than the old one, particularly for model switching (#8521).
- **Copy/paste friction** — requiring multiple Ctrl+C presses is a small bug with outsized daily annoyance (#8521).

**Positive signals (satisfaction):**
- Users are actively praising incremental polish — #8612 opens by explicitly acknowledging that "most tools now read like plain human sentences, very good," which validates the human-readable tool-call work.

**Use cases observed:** local Windows desktop deployment (LTSC/IoT), OpenAI-compatible gateway usage (Strata), long-running tasks requiring execution-tool transparency, and multi-agent collaboration experiments.

---

## 8. Backlog Watch

| Item | Age | Why it needs attention |
|---|---|---|
| [#8292](https://github.com/agentscope-ai/QwenPaw/pull/8292) — sanitize malformed file content parts | **Open since 2026-10-17 (~22 days)**, updated 2026-11-07 | A straightforward fix for a confirmed HTTP 400 crash path (#8280) has sat unmerged for three weeks. Low risk, clear repro — should be prioritized. |
| [#2420](https://github.com/agentscope-ai/QwenPaw/issues/2420) — cross-agent collaboration feedback | Created 2026-03-27, **closed 2026-11-07 after ~7.5 months** | The long tail to closure suggests multi-agent UX feedback was slow to triage. The four asks inside it (onboarding, triggering, coherence, identity) deserve a tracked follow-up epic so the closure doesn't bury the signal. |
| [#8616](https://github.com/agentscope-ai/QwenPaw/issues/8616) — Windows 11 IoT LTSC launch failure | New (2026-11-07) | No maintainer fix PR yet; a **beta that won't start** on a supported-looking platform is a release blocker for 2.3.0 and warrants immediate triage labeling. |

**Overall health assessment:** Backend correctness is trending positive — the active PR set shows disciplined, well-diagnosed fixes to token accounting, provider fallback, and gateway error classification. The risk is concentrated on the **desktop client**: two high-severity UX/platform bugs with no fixes in flight, plus a long-stale crash fix (#8292) awaiting merge. Community size is small but technically engaged (first-time contributor, benchmark-backed PR, detailed repro reports), which is a healthy early-stage signal.

</details>

<details>
<summary><strong>ZeroClaw</strong> — <a href="https://github.com/zeroclaw-labs/zeroclaw">zeroclaw-labs/zeroclaw</a></summary>

# ZeroClaw Project Digest — 2026-11-08

## 1. Today's Overview

ZeroClaw remains in an intense pre‑release stabilization phase, with **57 tracked items updated in the last 24 hours** (22 Issues, 35 PRs) and zero new releases. Activity is heavily skewed toward the `v0.9.0` release gate: **three of today's closes were security‑critical fixes** (`#11126`, `#12050`, `#12260` and their PRs), suggesting the team is burning down a release‑blocking security backlog. The dominant themes are **identity/access control** (`topic:identity-access`), **relay‑served dashboards** (`#10315` phase 2), and a burst of **agent runtime correctness bugs** (delegation, prompt caching, cron). Overall health reads as **mature but strained**: high contributor throughput is offset by a large number of open `risk:high`/`size:XL` PRs awaiting review, and several "merged-but-incomplete" security fixes that generated immediate follow‑up issues.

## 2. Releases

**None.** No new releases in the last 24h and no release entries in the dataset. However, many closed/updated items carry the `release:v0.9.0` label, indicating `v0.9.0` is the imminent target milestone.

## 3. Project Progress

**Merged/Closed PRs today (4):**
- **`#12157` [CLOSED]** — `fix(oidc): bind enrollment callbacks to the initiating browser` (fixes login CSRF).
  https://github.com/zeroclaw-labs/zeroclaw/pull/12157
- **`#12239` [CLOSED]** — `fix(rpc): hold current authority through session effects` — closes the revoked‑admin ownership bypass (`#11126`).
  https://github.com/zeroclaw-labs/zeroclaw/pull/12239
- **`#12274` [CLOSED]** — `docs(runtime): record the relay-served dashboard placement exception`.
  https://github.com/zeroclaw-labs/zeroclaw/pull/12274
- **`#11149` [CLOSED]** — `fix(security): enforce cron approval and authority at the write across RPC, tools and token revocation` — closes `#12260` (RPC `cron/add` silently pre‑approving shell jobs).
  https://github.com/zeroclaw-labs/zeroclaw/pull/11149

**Issues closed:** `#11126` (stale admin ownership retention), `#12050` (OIDC callback login CSRF), `#12260` (cron RPC auto‑approval).

**Features advanced (open but active):**
- Relay‑served dashboard: `#12270` (phase 2) and `#12244` (scoped dashboard chat) are both XL PRs under active review.
- Append‑only session event history (`#11921`, XL) — a structural rewrite of transcript persistence.
- OpenAI runtime‑profile thinking (`#12059`, `#12057`).
- Plugin webhook RPC placement (`#11317`, `#11320`, `#11322`).

**Net read:** Security surface is being actively hardened; feature velocity is high but gated behind a large review queue.

## 4. Community Hot Topics

Most‑commented items (by comment count):

1. **`#5982` [OPEN] — Per‑sender RBAC for multi‑tenant agent deployments** (12 comments, `priority:p2`, `risk:high`, `security`).
   https://github.com/zeroclaw-labs/zeroclaw/issues/5982
   *Need:* Multi‑tenant operators want per‑sender roles without a separate RBAC subsystem; the thread has converged on building on the existing agent/risk‑profile model. This is the flagship identity‑access design discussion.

2. **`#11420` [OPEN] — SQLite session backend rewrites `created_at` on every turn** (10 comments, `priority:p1`).
   https://github.com/zeroclaw-labs/zeroclaw/issues/11420
   *Need:* Per‑message timestamps are silently destroyed by whole‑transcript replacement — a data‑integrity problem for audit/observability consumers of `GET /api`.

3. **`#10315` [OPEN] — Re‑add browser enrollment frontdoor without hand‑rolled TLS** (6 comments, `security`, `topic:zerorelay`).
   https://github.com/zeroclaw-labs/zeroclaw/issues/10315
   *Need:* Complete the relay‑terminated browser dashboard tier safely; enrollment landed, dashboard/session tier still open. Directly parent to today's `#12270`.

4. **`#9646` [OPEN] — Session/channel read+write tools lack per‑agent ownership scoping** (4 comments, `severity S0`, `risk:high`).
   https://github.com/zeroclaw-labs/zeroclaw/issues/9646
   *Need:* Tools like `sessions_list/history/send` and `discord_search` trust model‑supplied targets, enabling cross‑agent data access. This is the deepest‑severity open security design issue.

**Underlying pattern:** the community's energy is concentrated on **trust boundaries** — who can act on which session, channel, or credential — across multi‑tenant, relay, and delegated‑agent scenarios.

## 5. Bugs & Stability

Ranked by severity (as labeled in datasets):

**S0 — data loss / security risk:**
- **`#9646` [OPEN]** — Built‑in session/channel tools lack per‑agent ownership scoping; any agent can reach another agent's sessions/channels. `risk:high`, no fix PR linked yet.
  https://github.com/zeroclaw-labs/zeroclaw/issues/9646

**S1 — workflow blocked:**
- **`#12187` [OPEN]** — `normalize_cached_channel_turns()` merges a `role=user` turn into a preceding `role=tool` message, **permanently poisoning conversations** on strict providers.
  https://github.com/zeroclaw-labs/zeroclaw/issues/12187

**S2 — degraded behavior:**
- **`#11420`** — SQLite `created_at` overwritten each turn (per‑message times lost). `priority:p1`.
- **`#12228`** — `zeroclaw cron update --agent` reports success but never reassigns the agent's job.
- **`#11696`** — System prompt rebuilt from disk every turn, busting prompt cache for all live sessions (cost impact).
- **`#12211`** — Delegated agents don't load `TOOLS.md` (delegate prompt uses its own file list).
- **`#12235`** — Delegated agent returns raw text tool calls; `native_tools` not honored in the delegate loop.
- **`#12227`** — Shell approval prompt depends on an `approved` value written by the model itself (inconsistent prompts).
- **`#12283`** — `resolve_peer_set` applies peer‑group `ignore` per group, so outbound sends can reach ignored peers.

**S3 — minor:**
- **`#12205`** — Empty canvases never removed; accumulate toward the 100‑canvas limit.

**Fix status:** None of these S1/S2 bugs have a directly linked fix PR today. `#12260` (cron RPC auto‑approval, S2) was fixed via `#11149`. The delegation cluster (`#12211`, `#12235`) suggests the delegate path is a stability hotspot worth a dedicated pass.

## 6. Feature Requests & Roadmap Signals

Active enhancement requests, with likely‑milestone inference:

| Issue | Theme | Likely target |
|---|---|---|
| `#5982` | Per‑sender RBAC for multi‑tenancy | Post‑`v0.9.0` (design convergence ongoing) |
| `#10315` | Browser enrollment frontdoor / dashboard hosting | `v0.9.x` (phase 2 PR `#12270` open) |
| `#12048` | Validate OIDC `redirect_uri` against configured dashboard origin (not Host header) | `v0.9.0` security hardening |
| `#12285` | Refuse credential/sign‑in config writes on relay‑served dashboards | `v0.9.0` (follows `#12270`) |
| `#11207` | Document bounded Tsubasa custom‑provider setup | Docs backlog (`priority:p3`) |
| `#12221` | Show retired env‑var warnings in `config migrate` | CLI polish |
| `#12280` | Don't treat forwarded loopback as local in SOP cancel auth | Security follow‑up |
| `#12199` | `config validate` warn on dead delegate grants | Config UX |

**Prediction:** The next version (`v0.9.0`) will predominantly ship **security/authority hardening** (OIDC browser binding, cron approval, session‑ownership rechecks, relay dashboard write restrictions) rather than net‑new features. Multi‑tenant RBAC (`#5982`) and the append‑only session history (`#11921`) are the most likely candidate features for **`v0.10.0`**.

## 7. User Feedback Summary

**Pain points voiced by users:**
- **Data integrity:** Per‑message timestamps are silently lost (`#11420`) — breaks audit/downstream consumers.
- **Silent no‑ops:** `cron update --agent` prints success but does nothing (`#12228`) — erodes CLI trust.
- **Cost surprises:** Prompt cache invalidated on every personality‑file edit, affecting *all* live sessions (`#11696`).
- **Security worry:** Users are finding real bypasses themselves — revoked‑admin retention (`#11126`), login CSRF (`#12050`), and model‑controlled shell approval (`#12227`). The "the model writes its own `approved` flag" report is a notable trust‑erosion signal.
- **Delegation fragility:** Two independent reports (`#12211`, `#12235`) that delegated agents behave inconsistently vs. the top‑level agent — a recurring usability complaint.

**Satisfaction signal:** High community engagement and prompt reporting of regressions against merged fixes (e.g., `#12284` follows `#12157` within hours) suggests an attentive, technically sophisticated user base that trusts the project enough to invest review effort.

**Dissatisfaction signal:** A cluster of "reports success, does nothing" and "merged fix is incomplete" items points to **verification and test gaps** in the merge pipeline.

## 8. Backlog Watch

Items most needing maintainer attention (long‑open, high‑risk, or stalled):

- **`#9646`** — Opened **2026‑08‑01**, S0 severity, `status:no-stale`, only 4 comments. The highest‑severity open issue and it has been alive ~3 months. **Priority review recommended.**
  https://github.com/zeroclaw-labs/zeroclaw/issues/9646

- **`#10315`** — Opened **2026‑08‑24**, large security topic (`topic:zerorelay`), still open after enrollment landed. Phase 2 depends on `#12270`.
  https://github.com/zeroclaw-labs/zeroclaw/issues/10315

- **`#11317` / `#11320` / `#11322`** — Plugin webhook RPC chain, opened **2026‑10‑01**, `size:XL`, `risk:high`, `needs-author-action`, **all still open**. A three‑PR dependency stack stalled on review is a throughput bottleneck.
  https://github.com/zeroclaw-labs/zeroclaw/pull/11317 · [#11320](https://github.com/zeroclaw-labs/zeroclaw/pull/11320) · [#11322](https://github.com/zeroclaw-labs/zeroclaw/pull/11322)

- **`#11265`** — `zeroclaw user` password lifecycle CLI, opened **2026‑09‑30**, `size:XL`, `do-not-merge`, `needs-author-action`. Depends on `#11264` and `#11313`.
  https://github.com/zeroclaw-labs/zeroclaw/pull/11265

- **`#11408`** — `fix(rpc): guard SOP and session effects with current authority`, opened **2026‑10‑01**, `release:v0.9.0`, depends on `#11220`/`#11234`.
  https://github.com/zeroclaw-labs/zeroclaw/pull/11408

- **`#11289`** — `feat(rpc): stable denial reason identifiers`, opened **2026‑09‑30**, `do-not-merge`, `topic:identity-access`.
  https://github.com/zeroclaw-labs/zeroclaw/pull/11289

**Assessment:** The project's main risk is **review bandwidth**, not contribution volume. Multiple XL, high‑risk PRs (plugin webhooks, session history, user lifecycle) have been open for 4–6 weeks with `needs-author-action` or `do-not-merge` tags. Clearing the `topic:identity-access` stack (`#11408`, `#11289`, `#11265`) is the critical path to a credible `v0.9.0`

---

*Generated from GitHub activity data for 2026-11-08. Data reflects items updated in the preceding 24 hours; comment counts and labels are as reported in the dataset.*

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*