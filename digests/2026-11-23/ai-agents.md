# OpenClaw Ecosystem Digest 2026-11-23

> Issues: 394 | PRs: 500 | Projects covered: 5 | Generated: 2026-11-23 01:33 UTC

- [OpenClaw](https://github.com/openclaw/openclaw)
- [Hermes Agent](https://github.com/nousresearch/hermes-agent)
- [IronClaw](https://github.com/nearai/ironclaw)
- [QwenPaw](https://github.com/agentscope-ai/QwenPaw)
- [ZeroClaw](https://github.com/zeroclaw-labs/zeroclaw)

---

## OpenClaw Deep Dive

# OpenClaw Project Digest — 2026-11-23

## 1. Today's Overview

OpenClaw is sustaining extraordinarily high development velocity, with **394 issues** and **500 PRs** touched in the last 24 hours — a clear signal of a maturing-but-still-churning project under heavy load. The balance is healthy on the merge side (226 PRs merged/closed vs. 274 still open), but a large proportion of active issues carry **P0/P1 severity and release-blocker labels**, especially around session state, message loss, and update/candidate validation. No new release shipped today, and the run-up to 2026.11.5/2026.11.6 appears to be a turbulent stabilization cycle — one recent fix (#141474) is confirmed shipped in v2026.11.5/v2026.11.6, while several *newer* regressions (e.g., #200606, #201468) are still blocking candidate upgrades. Overall: **high activity, real momentum, but elevated stability and release-quality risk** that warrants maintainer triage focus.

## 2. Releases

**No new releases in the last 24 hours.**

Context from issue activity:
- Stable **v2026.11.5** and **v2026.11.6** are referenced as recently shipped (see #141474 closure note).
- **PR #203871** (open) proposes backporting five critical macOS fixes to `release/2026.11.6` to replace "broken download assets" — implying the current 2026.11.6 macOS artifacts have known defects.
- Upgrade friction is conspicuous: **#200606** (candidate Doctor blocks 2026.11.3→2026.11.5), **#200224** (retired `agents.defaults.heartbeat` conflict), and **#201468** (app/Gateway version skew causing schema-migration refusal) all indicate the 2026.11.5/11.6 line is not cleanly upgradable for a subset of users.

## 3. Project Progress

226 PRs were merged or closed in the last 24h. Notable merged/closed items:

- **[CLOSED] #141474** — Collector child `sessions_yield` stranding `agents_wait` forever; fixed via #164445, shipped in v2026.11.5/11.6. A major session-lifecycle correctness fix landed. [link](https://github.com/openclaw/openclaw/issues/141474)
- **[CLOSED] #195279** — Background exec completion wake failing with "operator execution authority is no longer active" after a `sessions_send` turn ends. [link](https://github.com/openclaw/openclaw/issues/195279)
- **[CLOSED] #142310** — WebChat duplicated text before tool calls (regression). [link](https://github.com/openclaw/openclaw/issues/142310)
- **[CLOSED] #175167** — iOS voice notes silently failing transcription (`hydrationSuppressed: true`). [link](https://github.com/openclaw/openclaw/issues/175167)
- **[CLOSED] #164887 / PR #164949** — Optional-silent cron run failing after collector child result; root cause traced to `hasOwedSessionSpawn` counting `collector: true` receipts as owed work. [issue](https://github.com/openclaw/openclaw/issues/164887) · [PR](https://github.com/openclaw/openclaw/pull/164949)
- **[CLOSED] #201865** — Memory scope hashes made locale-stable (fixes post-2026.11.5 non-English memory search). [link](https://github.com/openclaw/openclaw/pull/201865)
- **[CLOSED] #201789** — Gateway follow-up work authority retention after earlier requests end. [link](https://github.com/openclaw/openclaw/pull/201789)
- **[CLOSED] #202675** — Control UI now retains dismissed failures across cron pause/unpause. [link](https://github.com/openclaw/openclaw/pull/202675)

**Features in flight (open PRs):** context-pressure-aware continuation (#129388), agent self-knowledge about OpenClaw docs (#203830), unified gateway ownership/CI fixture repair (#203839), and Mac setup UX (#203786).

## 4. Community Hot Topics

Most-discussed threads (comments) reveal where the community is spending energy:

1. **[#150635](https://github.com/openclaw/openclaw/issues/150635)** (30 comments, 🦞 diamond lobster, P2) — *Short-term recall retention evicts recalled entries nightly; dreaming deep phase never promotes.* A deep architectural issue in the memory subsystem: at the 512-entry cap, zero-recall entries starve the promotion pipeline. High engagement, needs product decision.
2. **[#182891](https://github.com/openclaw/openclaw/issues/182891)** (26 comments, P1, 🦪 silver) — *Prompt cache never reused; `cache read dropped N -> 0` on every request.* Significant cost/latency implications across envelope rewrites and `runtimeContextCarrier` changes.
3. **[#200606](https://github.com/openclaw/openclaw/issues/200606)** (21 comments, P1) — *Doctor blocks 2026.11.3→2026.11.5 update with plugin migration conflict (`changed=[]`).* A concrete upgrade blocker.
4. **[#141474](https://github.com/openclaw/openclaw/issues/141474)** (19 comments, closed) — Session yield/wait settlement bug, now fixed and shipped.
5. **[#155563](https://github.com/openclaw/openclaw/issues/155563)** (18 comments, P1, crash-loop) — *Service-child relay/anchor and MCP groups retained after successful agent turn.* Lifecycle leak regression from 2026.9.5.
6. **[#192632](https://github.com/openclaw/openclaw/issues/192632)** (16 comments, 🦞 diamond lobster) — Feature: Claude web search provider via Anthropic server-side `web_search`.
7. **[#125764](https://github.com/openclaw/openclaw/issues/125764)** (16 comments, P1, message-loss) — Telegram outbound network-failure dead-lettering after one attempt.

**Underlying themes:** The community is most engaged on (a) **memory/recall correctness** (eviction, promotion, index capacity), (b) **cost/latency efficiency** (prompt cache reuse), and (c) **update reliability** (candidate Doctor, schema migration). These are the areas where design decisions have outsized user impact.

## 5. Bugs & Stability

Ranked by severity (P0 → P2), with fix-PR status:

| Severity | Issue | Summary | Fix PR? |
|---|---|---|---|
| **P0** | [#190563](https://github.com/openclaw/openclaw/issues/190563) | Cannot resume paused Codex chat: provider review/native thread mismatch ("needs-security-review") | No new fix PR |
| **P0** | [#146860](https://github.com/openclaw/openclaw/issues/146860) | Windows managed update handoff stalls/abandons under `InteractiveToken` scheduled task | No new fix PR |
| **P0** | [#158912](https://github.com/openclaw/openclaw/issues/158912) | `MEMORY.md` no longer injected at bootstrap on 2026.9.6 (docs still claim it is) | No new fix PR |
| **P0** | [#201468](https://github.com/openclaw/openclaw/issues/201468) | macOS launch alert gives generic credential recovery when bundled CLI refuses older Gateway schema migration | Linked PR open |
| **P1** | [#182891](https://github.com/openclaw/openclaw/issues/182891) | Prompt cache never reused — every request drops cache read to 0 | No new fix PR |
| **P1** | [#196199](https://github.com/openclaw/openclaw/issues/196199) | Regression since 2026.10.10: native Codex helper completions fail to resume parent, locks users out | No new fix PR |
| **P1** | [#128140](https://github.com/openclaw/openclaw/issues/128140) | `memory_search` tool always times out (15s) while CLI works | Needs info |
| **P1** | [#190307](https://github.com/openclaw/openclaw/issues/190307) | Gateway restart leaves many agents permanently "degraded" (admission timeout) | Needs live repro |
| **P1** | [#155563](https://github.com/openclaw/openclaw/issues/155563) | service-child relay/anchor + MCP groups retained after turn | No new fix PR |
| **P1** | [#166641](https://github.com/openclaw/openclaw/issues/166641) | `web_fetch` cold fallback synchronously captures unrelated plugins → liveness stalls | Linked PR open |
| **P1** | [#153899](https://github.com/openclaw/openclaw/issues/153899) | Gateway drain waits out full `TimeoutStopSec`; timers fire against closed resources | No new fix PR |
| **P2** | [#150635](https://github.com/openclaw/openclaw/issues/150635) | Dreaming deep phase never promotes at recall cap | No new fix PR |
| **P2** | [#196505](https://github.com/openclaw/openclaw/issues/196505) | Memory index aborts "worker task capacity reached" instead of retrying | No new fix PR |
| **P2** | [#160719](https://github.com/openclaw/openclaw/issues/160719) | `sessions.delete` returns ok:true/deleted:false, keeps zombie session row | No new fix PR |

**Assessment:** A concerning number of **P0/P1 issues carry no new fix PR** and some are flagged `needs-live-repro`/`needs-info`, meaning maintainer cycle time is the bottleneck. Lifecycle/authority bugs (session state, message loss, auth-provider) dominate. The good news: several long-standing ones (#141474, #195279, #142310) closed today.

## 6. Feature Requests & Roadmap Signals

High-signal requests, with likelihood of near-term landing:

- **[#192632](https://github.com/openclaw/openclaw/issues/192632)** — Claude web search provider (Anthropic server-side `web_search`). 🦞 diamond lobster, well-specced; strong candidate for a provider-expansion release.
- **[#151178](https://github.com/openclaw/openclaw/issues/151178)** — Let Active Memory delegate escalation decisions to a plugin provider. Fits the ongoing memory-architecture work; likely medium-term.
- **[#157614](https://github.com/openclaw/openclaw/issues/157614)** — Independent command text limit for progress streaming. Small-scope UX; plausible for a minor release.
- **[#184803](https://github.com/openclaw/openclaw/issues/184803)** — Option to disable spoken task receipt on Talk agent-consult calls (P3).
- **[#203830](https://github.com/openclaw/openclaw/pull/203830)** — Let agents answer questions about OpenClaw itself (docs/RAG integration). Active PR.
- **[#129388](https://github.com/openclaw/openclaw/pull/129388)** — Context-pressure-aware continuation (`continue_work`/`continue_delegate`/`request_compaction`). Large design PR, cross-cutting.

**Prediction:** Provider expansion (Claude web search) and memory-escalation configurability are the most likely near-term feature landings; continuation/compaction (#129388) is a multi-release effort.

## 7. User Feedback Summary

**Pain points (dissatisfaction):**
- **Upgrade reliability** is the loudest theme: users on stable are blocked by candidate Doctor conflicts (#200606), retired-config conflicts (#200224), and version skew (#201468, #187917). Managed npm updates repeatedly fail during schema-migration rehearsal (#144739).
- **Silent message loss** is a recurring trust-eraser: Telegram dead-lettering (#125764), WebChat duplication (#142310, now fixed), iOS voice-note transcription failures (#175167, fixed), Matrix consumer closed (#191476).
- **Session lockouts** — users report being locked out of their own assistant (Codex helper resume failure #196199; paused-session reset impossibility #197242).
- **Cost/latency inefficiency** — prompt cache never reused (#182891) directly hits users' wallets.

**Use cases surfacing:**
- Heavy multi-agent deployments (35 agents, multi-hundred-MB SQLite stores — #190307).
- Plugin-extended deployments (MCP groups, ACP/Claude Code adapters — #133709).
- Scheduled/cron automation with collector subagents (#164887).

**Satisfaction signals:** Rapid closure of long-standing bugs (#141474, #195279) and responsive bot-generated PRs (roboclaw-bot, tideclaw-bot) show the project does turn issues around — but the queue depth is outpacing triage.

## 8. Backlog Watch

Long-lived or high-importance items needing maintainer attention:

- **[#103067](https://github.com/openclaw/openclaw/issues/103067)** (since 2026-07-09, 11 comments, 🦞) — Centralize chat-session naming; define subagent session lifetime & cross-channel persistence. Foundational design work, stalled.
- **[#112313](https://github.com/openclaw/openclaw/issues/112313)** (since 2026-07-21, closed as stale) — Dead-lettered outbound delivery queue entries are permanent/terminal. Closed but underlying concern echoes in #125764.
- **[#114067](https://github.com/openclaw/openclaw/issues/114067)** (since 2026-07-26, 🦞) — `openclaw --help` ~35x slower with a `plugins` key in config (36ms → 1274ms). Simple, high-visibility perf fix with a linked PR still open.
- **[#130257](https://github.com/openclaw/openclaw/issues/130257)** (since 2026-08-26, 🦞) — Tasks ledger records no tokens/cost for delegated ACP runs (parent $0.04 vs child $14.14). Cost-attribution gap.
- **[#133709](https://github.com/openclaw/openclaw/issues/133709)** (since 2026-08-31, 🦞, security) — Surface permission requests from background ACP sessions as approvals.
- **[#150635](https://github.com/openclaw/openclaw/issues/150635)** (since 2026-09-17, 🦞, 30 comments) — The recall-eviction/promotion bug remains the single most-discussed open issue with a product decision pending.
- **[#158912](https://github.com/openclaw/openclaw/issues/158912)** (since 2026-09-26, **P0**) — `MEMORY.md` bootstrap injection silently regressed; docs contradictory. P0 without a fix PR is a red flag.
- **[#129388](https://github.com/openclaw/openclaw/pull/129388)** (PR since 2026-08-25, XL, merge-risk flags) — Continuation/compaction design PR open nearly three months, `clawsweeper-recovery-stuck`.

**Recommendation:** Prioritize maintainer review of the P0 cluster (#158912, #190563, #146860, #201468) and the gem #150635, which is both the most-discussed and a product-decision blocker. The three-month-old continuation PR (#129388) also risks bit-rot.

---
*Digest generated from GitHub activity on 2026-11-23. All links reference github.com/openclaw/openclaw.*

---

## Cross-Ecosystem Comparison

# Cross-Project Comparison Report — AI Agent & Personal Assistant OSS Ecosystem
**Date:** 2026-11-23 | **Projects:** OpenClaw, Hermes Agent, IronClaw, QwenPaw, ZeroClaw

---

## 1. Ecosystem Overview

The personal AI assistant / agent OSS landscape on 2026-11-23 is **fragmented but converging on shared architectural problems**: durable memory, credential scoping, session/gateway lifecycle correctness, and multi-channel deployment hygiene. OpenClaw dominates in raw throughput and community size, operating as the de facto reference implementation, while four smaller projects (Hermes, IronClaw, QwenPaw, ZeroClaw) each occupy distinct niches — NousResearch-branded research tooling, NEAR-affiliated QA-disciplined infra, an AgentScope-derived console-first assistant, and a security-forward Rust gateway. Across all five, **contributor supply is outpacing maintainer review capacity**, and the loudest community pain points are consistent: silent message loss, upgrade/regression friction, and trust-eroding "success while state diverges" behavior. The ecosystem is in a **stabilization phase** where correctness and operability — not new capabilities — are the binding constraints on adoption.

---

## 2. Activity Comparison

| Project | Issues (24h) | PRs (24h) | Merges (24h) | Release Status | Health Score* | Bottleneck |
|---|---|---|---|---|---|---|
| **OpenClaw** | 394 touched | 500 touched (274 open / 226 merged-closed) | 226 | None today; v2026.11.5/6 turbulent | **7.5/10** | P0/P1 triage depth; release-quality risk |
| **Hermes Agent** | 50 touched (3 closed) | 50 touched (16 merged-closed, 34 open) | 16 | None; **v0.23.x patch overdue** | **6.5/10** | Merge velocity lagging intake; state.db bugs |
| **ZeroClaw** | 13 touched | 50 touched (4 merged, 46 open) | 4 | None (last: 0.9.0) | **6.5/10** | Review throughput on XL/`risk:high` PRs |
| **QwenPaw** | 6 open | 11 open (0 merged) | 0 | None (last: 2.3.0.post1) | **5.5/10** | **Zero merges today**; review queue stalled |
| **IronClaw** | 1 updated | 0 | 0 | None (last: v1.4.1) | **4.0/10** | Idle pipeline; single QA bug untriaged |

\*Health score = composite of activity, merge throughput, release cadence, and unresolved severity weight (analyst judgment, not a project metric).

**Key ratios:**
- **Merge efficiency:** OpenClaw 45% of touched PRs merged/closed; Hermes 32%; ZeroClaw 8%; QwenPaw 0%; IronClaw N/A.
- **Issues↔PR balance:** Only OpenClaw and Hermes show net-positive closure; QwenPaw and ZeroClaw are accumulating open queues.

---

## 3. OpenClaw's Position

**Advantages vs. peers:**
- **Scale:** ~8× the daily issue volume and ~10× the PR volume of Hermes; no peer approaches its contributor base or bot-assisted triage (roboclaw-bot, tideclaw-bot).
- **Closure velocity:** Closed several long-standing gems in one day (#141474 session-yield stranding, #195279 exec-authority wake, #142310 WebChat duplication) — peers have PRs open for weeks on comparable bugs.
- **Feature breadth:** Provider expansion (#192632 Claude web search), context-pressure continuation (#129388), memory-escalation plugin delegation (#151178) — a roadmap peers have not matched.

**Technical approach differences:**
- OpenClaw leans on **candidate/Doctor validation gates** and schema-migration rehearsal — powerful but the source of its loudest upgrade blockers (#200606, #201468).
- Peers are narrower: Hermes emphasizes doc-chain/durable-record architecture (#143379 RFC, 39 comments); ZeroClaw emphasizes **scoped operator credentials** as a zero-trust primitive; QwenPaw emphasizes Console/channel UX.

**Community size comparison:**
- OpenClaw: multi-hundred-comment threads, diamond-lobster tagged issues, heavy multi-agent (35-agent) and MCP/ACP plugin deployments.
- Hermes/ZeroClaw/QwenPaw: engaged but smaller — typically 1–15 comments per top thread, with a handful of prolific reporters carrying disproportionate load (JordanTheJet on ZeroClaw; CastelloBrancoTecnologia on the #12422 RFC).
- IronClaw: near-dormant community signal in the window.

**Caveat:** OpenClaw's advantage is also its risk — **many P0/P1 issues carry no fix PR** (#158912 MEMORY.md bootstrap, #190563 Codex resume, #146860 Windows update), and three-month-old design PRs (#129388) risk bit-rot.

---

## 4. Shared Technical Focus Areas

Cross-project requirements emerging independently, with participating projects:

| Requirement | Projects | Specific Need |
|---|---|---|
| **Durable memory correctness** | OpenClaw, Hermes, QwenPaw, ZeroClaw | OpenClaw: eviction/promotion starvation at recall cap (#150635). Hermes: doc-chain durable records (#143379); holographic-memory data loss on v0.23. QwenPaw: OpenViking cleanup PR (#8588). ZeroClaw: Lucid backend retirement (#12521). |
| **Credential scoping / zero-trust secrets** | ZeroClaw (lead), OpenClaw, Hermes | ZeroClaw: RFC #12422 + ~5 stacked PRs for origin-bound HTTP/SSH/browser creds. OpenClaw: permission surfacing for background ACP (#133709). Hermes: `write_file`/`delete_file` guards on `/dev`/`/proc`/`/sys` (#156063). |
| **Session / gateway lifecycle hygiene** | OpenClaw, Hermes, ZeroClaw | OpenClaw: relay/MCP-group leakage (#155563), zombie sessions (#160719). Hermes: settled-admission never deleted (#158976), credential resurrection (#159043), Discord wake loop (#143720). ZeroClaw: identity/reconnect for ACP gateway (#12653). |
| **Upgrade/regression reliability** | OpenClaw, Hermes, ZeroClaw | OpenClaw: Doctor blocks, schema skew. Hermes: **v0.23.x patch overdue**; v0.23 introduced plugin/ARM64 regressions. ZeroClaw: silent wrong-model after `/model` switch (#12667). |
| **Cost/latency efficiency** | OpenClaw, Hermes, ZeroClaw | OpenClaw: prompt cache never reused (#182891). Hermes: cache-churn from duplicate `source` labels (#156750). ZeroClaw: misleading all-time-as-monthly spend (#12660). |
| **RBAC / multi-user deployment** | Hermes (lead), QwenPaw | Hermes #3897 per-Telegram-ID tool gating (top-voted, 8 months open). QwenPaw: Telegram forum-topic session isolation (#8827/PR #8857). |
| **Silent-failure / "success while state diverges"** | ZeroClaw, OpenClaw, Hermes | ZeroClaw: model switch, skill creation, unknown-arg delegation. OpenClaw: dead-lettered Telegram (#125764). Hermes: duplicate/out-of-order Desktop replies (#158293). |
| **Configurable local/slow-model timing** | IronClaw, OpenClaw, QwenPaw | IronClaw: `PRIMARY_MODEL_CALL_IDLE_TIMEOUT` for Ollama (#8172). QwenPaw: llama.cpp GPU / MLX stack (#8649/8647/8648). |
| **Channel completeness** | QwenPaw (lead), OpenClaw | QwenPaw: WeChat 8-month incomplete (#2674), Telegram topic isolation. OpenClaw: Telegram/Matrix/iOS reliability. |

**Consensus signal:** Four of five projects have open memory-durability or credential-scoping work — these are the two **ecosystem-level primitives** not yet solved.

---

## 5. Differentiation Analysis

| Dimension | OpenClaw | Hermes | IronClaw | QwenPaw | ZeroClaw |
|---|---|---|---|---|---|
| **Feature focus** | Full-stack assistant: memory, providers, gateway, multi-channel, plugins | Research-oriented durable-record memory (doc-chain) + gateway | QA-hardened infra; provider/timeout configurability | Console-first UX + multi-channel (WeChat/Telegram) | Security-forward Rust gateway; zero-trust creds |
| **Target users** | Power multi-agent operators, plugin ecosystem builders | Research/technical users; team deployments (emerging) | Self-hosted, local-inference, staging QA users | Multi-topic community operators; self-hosters | Operators with strict credential/security requirements |
| **Architecture** | Monolithic core + plugin catalog + candidate Doctor gates | Doc-chain substrate + gateway concurrency layer | Lean core; QA-driven bug pipeline | AgentScope-derived; Console + channel adapters | Rust; ACP gateway; origin-bound credential broker |
| **Language/stack signal** | Multi-platform (macOS/iOS/Windows), bot-heavy CI | Python + RE2 migration in flight | Minimal visible surface | JS frontend + plugin SDK | Rust + Matrix/SDK (RUSTSEC-driven bumps) |
| **Distinct bet** | Breadth + validation-driven releases | Durable records surviving compression | Correctness over cadence | UX polish + channel parity | Provable secret non-exposure |

**Notable divergence:** OpenClaw and Hermes bet on **memory substrate** as the differentiator; ZeroClaw bets on **credential isolation**; QwenPaw bets on **Console/channel UX**; IronClaw bets on **configurability for self-hosted QA**.

---

## 6. Community Momentum & Maturity

**Activity tiers:**

- **Tier 1 — Rapidly iterating (high throughput, high churn):**
  - **OpenClaw** — 500 PRs/day touched, but P0/P1 queue depth and release turbulence indicate a project in a **hard stabilization cycle** rather than stable maturity. Maturity: *maturing-under-load*.
  - **ZeroClaw** — 50 PRs/day with only 4 merged; contributor energy is exceptional but review throughput is the constraint. Maturity: *high-energy, review-bound*.

- **Tier 2 — Active maintenance (moderate throughput, backlog growth):**
  - **Hermes Agent** — 50 issues/50 PRs touched, 16 merged; v0.23 regressions accumulating without a patch release. Maturity: *mid-cycle, patch release overdue*.
  - **QwenPaw** — healthy contributor pipeline (first-time contributors filing fixes) but **zero merges today** and 8-month-old channel bug. Maturity: *contributor-rich, maintainer-constrained*.

- **Tier 3 — Stabilizing / low-activity:**
  - **IronClaw** — zero code movement; single QA bug untriaged for 8 days. Maturity: *lull/maintenance*.

**Momentum verdict:** The ecosystem is **contributor-abundant but reviewer-scarce**. Projects with the healthiest near-term outlook (OpenClaw, Hermes) are those whose merge counts, however lagging, are non-zero and whose closure events hit high-severity items. QwenPaw and IronClaw risk **sentiment decay** if review/merge stalls persist.

---

## 7. Trend Signals

Extracted from community feedback across all five projects, ranked by strength of signal and developer value:

1. **Durable memory is the #1 unsolved primitive.** OpenClaw's most-discussed open issue (#150635, 30 comments) and Hermes' most-commented item (#143379 RFC, 39 comments) are both about memory that survives compression/eviction with provenance. *Value for agent developers:* invest in a first-class durable-record/memory substrate abstraction; today's prefetch and plugin approaches are insufficient for long-lived sessions.

2. **Zero-trust credential scoping is becoming a table-stakes requirement.** ZeroClaw's RFC #12422 anchors ~5 dependent PRs; OpenClaw and Hermes have adjacent permission/guard work. *Value:* design agents so secrets are **never exposed to model/chat/skill/code**, and bind credentials to exact origins — this is now a differentiator, soon a baseline expectation.

3. **Silent failure is the dominant trust-eraser.** ZeroClaw's cluster (#12667 wrong model, #12655 no-op skill creation, #12660 misleading spend), OpenClaw's dead-lettering (#125764), and Hermes' duplicate replies (#158293) all share the pattern *"UI reports success, state diverges."* *Value:* instrument agent state transitions with observable, reconcilable outcomes; "success" must be verifiable, not just reported.

4. **Configurability for slow/local models is an under-served segment.** IronClaw's single QA issue (#8172, Ollama timeout) and QwenPaw's unmerged llama.cpp/MLX stack (#8649/8647/8648) signal real demand from self-hosters penalized by cloud-tuned defaults. *Value:* expose watchdog/timeout/GPU knobs; treat local inference as a first-class provider tier.

5. **RBAC / per-user tool gating is the emerging team-adoption blocker.** Hermes' top-voted #3897 (8 months open) and QwenPaw's forum-topic isolation (#8827) show shared-bot team deployments are growing but unserved. *Value:* per-principal capability scoping is the next unlock for multi-user, agency, and internal-team deployments.

6. **Upgrade reliability is a first-class product feature.** OpenClaw's Doctor/schema blockers, Hermes' overdue v0.23.x patch, and ZeroClaw's stale-web-state bugs all show that **release engineering quality now drives user sentiment as much as feature velocity**. *Value:* invest in migration rehearsal, rollback paths, and clear upgrade diagnostics — the cost of a broken upgrade outweighs the cost of a missing feature.

7. **Review throughput, not contributor supply, is the ecosystem bottleneck.** Across ZeroClaw (46 open PRs, some 5 weeks old), QwenPaw (0 merges today, 8-month issue), and OpenClaw (3-month-old XL PR #129388), healthy contributor pipelines are being throttled by maintainer capacity. *Value for the ecosystem:* tooling/process investment in review automation and stale-PR sweeps would yield disproportionate health gains across every project surveyed.

---

**Bottom line for technical decision-makers:** The agent OSS ecosystem in late 2026 is **feature-rich but operability-poor**. The winning projects over the next two quarters will be those that solve **durable memory, credential scoping, and silent-failure observability** — not those that ship the most providers. OpenClaw leads on breadth and velocity but carries the highest stability risk; ZeroClaw leads on security direction; Hermes leads on memory architecture ambition; QwenPaw and IronClaw need review-throughput recovery to retain community momentum.

---

## Peer Project Reports

<details>
<summary><strong>Hermes Agent</strong> — <a href="https://github.com/nousresearch/hermes-agent">nousresearch/hermes-agent</a></summary>

# Hermes Agent — Project Digest
**Date:** 2026-11-23 | **Repo:** [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent)

---

## 1. Today's Overview

Hermes Agent remains in a very high-activity maintenance phase: 50 issues and 50 PRs were touched in the last 24h, but only 3 issues were closed and 16 PRs were merged/closed, leaving a net-growing backlog (47 active issues, 34 open PRs). No new releases shipped today, continuing a gap that appears to be accumulating fix PRs ahead of a future cut. The dominant themes are **state/DB durability** (state.db growth, admission-result leakage, owner-backfill 409s), **gateway concurrency and lifecycle bugs** (Discord wake loops, terminal cwd lock contention, scale-to-zero), and **safety hardening** (`/dev` and `/proc` write guards). Community engagement is healthy but asymmetrical — a single RFC (#143379) dominates discussion with 39 comments, while most bugs sit at 1–5 comments, suggesting maintainer attention is currently funneled toward the doc-chain architecture rather than triaging individual regressions.

**Activity assessment:** High volume, moderate throughput — healthy contributor inflow, but merge velocity is lagging issue intake.

---

## 2. Releases

**None.** No new releases in the last 24h.

⚠️ **Watch item:** Multiple fix PRs are queued for issues introduced *in v0.23* (e.g., PR #157837 fixing holographic-memory plugin breakage on v0.23, PR #151153 for ARM64 gateway self-exit on v0.23.0). This suggests a **patch release (v0.23.x) is likely overdue**, and users on v0.22.6–v0.23.1 are accumulating known regressions without a stable rollup.

---

## 3. Project Progress

### Merged / Closed PRs (16 total; notable examples)

| PR | Title | Impact |
|---|---|---|
| [#157837](https://github.com/NousResearch/hermes-agent/pull/157837) | Holographic memory plugin store reopen on v0.23 (fixes #157818) | **Regression fix**: restores lost user memories after v0.23 upgrade by re-aliasing removed `hermes_state_wal` module |
| [#154096](https://github.com/NousResearch/hermes-agent/pull/154096) | plugin-catalog: land 5 approved entries | Catalog throughput; unblocks 5 author submissions whose forks refused maintainer pushes |
| [#157861](https://github.com/NousResearch/hermes-agent/pull/157861) | plugin-catalog: kame-rotation + kame-provider → 1.9.0.4 | Maintained plugin update |
| [#157602](https://github.com/NousResearch/hermes-agent/pull/157602) | plugin-catalog: 1.9.0.3 | Superseded by the above |
| [#131918](https://github.com/NousResearch/hermes-agent/pull/131918), [#117966](https://github.com/NousResearch/hermes-agent/pull/117966) | Plugin catalog submissions | Backlog clearance |

### In-flight work (open, high-signal)
- **RE2 migration (Stage S2b)** — [#158719](https://github.com/NousResearch/hermes-agent/pull/158719) removes import-time regex matches across 7 product modules.
- **Gateway scale-to-zero correctness** — [#159052](https://github.com/NousResearch/hermes-agent/pull/159052) stops idle background processes from pinning machines on.
- **Security hardening** — [#152665](https://github.com/NousResearch/hermes-agent/pull/152665) adds atomic host-approval + delegated-worker admission.
- **Steering semantics** — [#157529](https://github.com/NousResearch/hermes-agent/pull/157529) fixes steers leaking into the previous turn.

---

## 4. Community Hot Topics

### 🔥 #143379 — RFC: The Doc-Chain Substrate's Network
[Issue #143379](https://github.com/NousResearch/hermes-agent/issues/143379) · **39 comments** · open since 2026-10-23
> Durable records surviving session compression with provenance intact; re-reading store instead of re-asking the user.

**Underlying need:** Users are hitting the limits of context compression for long-lived sessions where facts must persist. This is an **architecture-level design debate**, not a bug — its 39-comment depth signals strong demand for a first-class "durable memory substrate" beyond today's external memory prefetch (#85135) and holographic plugin.

### #143720 — Discord wake loop refused forever
[Issue #143720](https://github.com/NousResearch/hermes-agent/issues/143720) · **15 comments** · P2
> Process-completion watch refused with `admission_conflict` every 60s, 494 occurrences in one log; attempt cap never fires; `notify-mode=off` ineffective.

**Underlying need:** Gateway liveness/termination guarantees — users need bounded retry loops they can actually turn off.

### #3897 — Per-user tool restrictions (RBAC) in gateway
[Issue #3897](https://github.com/NousResearch/hermes-agent/issues/3897) · **9 comments · 4 👍** · open since 2026-03-30
> Shared Telegram bot for a 4–10 person team needs per-Telegram-ID tool gating.

**Underlying need:** **Multi-user / team deployment authz.** Currently only `TELEGRAM_ALLOWED_USERS` (allow/deny), no per-user capability scoping. This is a top-voted issue (4 👍 is high for this repo) and a strong roadmap signal.

### Other active items
- [#156335](https://github.com/NousResearch/hermes-agent/issues/156335) — Kanban board removal orphans in-flight SQLite writers (8 comments)
- [#137843](https://github.com/NousResearch/hermes-agent/issues/137843) — Desktop file panel stuck loading after session switch (8 comments)
- [#148531](https://github.com/NousResearch/hermes-agent/issues/148531) — owner-backfill 409 on every desktop boot in split topology (7 comments)

---

## 5. Bugs & Stability

Ranked by severity/impact:

| Severity | Issue | Summary | Fix PR? |
|---|---|---|---|
| 🔴 P2 | [#156593](https://github.com/NousResearch/hermes-agent/issues/156593) | **Inode exhaustion** kills gateway ("No space left" with 103 GB free) — bypasses every disk guard | No open PR yet |
| 🔴 P2 | [#158976](https://github.com/NousResearch/hermes-agent/issues/158976) | Settled admission results never deleted → **state.db grows ~1 GB unbounded** | No |
| 🔴 P2 | [#159043](https://github.com/NousResearch/hermes-agent/issues/159043) | **Removed credentials resurrect** — stale processes re-upsert in-memory pool on status transitions | No |
| 🔴 P2 | [#143720](https://github.com/NousResearch/hermes-agent/issues/143720) | Discord wake `admission_conflict` loop forever; attempt cap never fires | No |
| 🟠 P2 | [#156063](https://github.com/NousResearch/hermes-agent/issues/156063) | **Security**: `write_file`/`delete_file` permit writes/unlinks to `/dev`, `/proc`, `/sys` | No — read guard exists, write guard missing |
| 🟠 P2 | [#158204](https://github.com/NousResearch/hermes-agent/issues/158204) | Saving terminal cwd blocks gateway event loop on routing lock | No |
| 🟠 P2 | [#154336](https://github.com/NousResearch/hermes-agent/issues/154336) | Windows Kanban managed worker **deadlocks before first API call** (subprocess.run post-kill) | No |
| 🟠 P2 | [#147606](https://github.com/NousResearch/hermes-agent/issues/147606) | Docker: dependency env never reused → disk fills each restart | No |
| 🟠 P2 | [#130294](https://github.com/NousResearch/hermes-agent/issues/130294) | Windows install fails: "failed to remove directory *.data" during uv sync | No (upstream cause) |
| 🟡 P2 | [#156750](https://github.com/NousResearch/hermes-agent/issues/156750) | Prompt-cache scope hashes two `source` labels → cache churn mid-session | PR [#154770](https://github.com/NousResearch/hermes-agent/pull/154770) adjacent (Vercel) |
| 🟡 P3 | [#132862](https://github.com/NousResearch/hermes-agent/issues/132862) | **[CLOSED]** LSP servers (pyright) orphan on `os._exit` paths | ✅ Closed |

**Assessment:** Three of the top-severity bugs (#158976, #159043, #143720) share a root cause family: **lifecycle cleanup of gateway/session state is incomplete**. The credential-resurrection bug (#159043) is especially concerning as it can silently re-enable deleted/rotated API keys.

---

## 6. Feature Requests & Roadmap Signals

| Issue | Request | Likelihood / Signal |
|---|---|---|
| [#3897](https://github.com/NousResearch/hermes-agent/issues/3897) | Per-user RBAC tool restrictions in gateway | **High** — highest 👍 on active list; team deployments are a growing use case |
| [#85700](https://github.com/NousResearch/hermes-agent/issues/85700) | `enabled_toolsets` param for `delegate_task` | Medium-high — directly reduces token cost for subagents; aligns with RBAC theme |
| [#85135](https://github.com/NousResearch/hermes-agent/issues/85135) | Configurable external memory prefetch timeout (hardcoded 8s too short) | Medium — trivial fix, validated param already exists in `MemoryManager.__init__` |
| [#158311](https://github.com/NousResearch/hermes-agent/issues/158311) | GPT-Live standby (`wake_policy` + `idle_timeout_s`) to bill quiet time at standby rate | Medium — cost/billing-driven; depends on OpenAI WebRTC standby adoption |
| [#159046](https://github.com/NousResearch/hermes-agent/issues/159046) | Windows opt-out for Start Menu/Desktop shortcut creation | Low-medium — QoL, but reinstalls recreate deleted shortcuts (annoyance-class) |

**Prediction for next version:** RBAC (#3897) and `delegate_task` toolset gating (#85700) are the strongest candidates — both reduce cost/attack surface and have multiple subscribers. #85135 is a low-risk quick win likely to land opportunistically.

---

## 7. User Feedback Summary

**Pain points (verbatim themes):**
- **"No space left on device" with 103 GB free** (#156593) — disk guards are byte-based only, blind to inode exhaustion. *Deeply confusing for operators.*
- **Lost memories after v0.23 upgrade** — holographic-memory plugin users lost entire stores ([#157818](https://github.com/NousResearch/hermes-agent/pull/157837) fixed today). *High emotional impact: irreversible data loss.*
- **Team/agency deployments blocked**: "We run Hermes as a shared Telegram bot for a 4-10 person investment team" (#3897) — no per-user tool scoping means either everyone gets terminal access or no one does.
- **Desktop UX stickiness**: two separate "file panel stuck loading forever" reports ([#137843](https://github.com/NousResearch/hermes-agent/issues/137843), [#148763](https://github.com/NousResearch/hermes-agent/issues/148763)) — only a pane remount recovers it. Annoying but not data-lossy.
- **Duplicate/out-of-order replies** on remote Desktop clients (#158293) after long sessions — erodes trust in the transcript as a source of truth (ironic given the doc-chain RFC's goal).
- **Windows post-kill deadlocks** (#154336) — provider OAuth workers hang before first API call, no error, no timeout. Hard to diagnose.

**Satisfaction signals:** Contributors are filing *well-structured, reproducible* reports with logs, version pins, and code references (e.g., #143720 cites exact occurrence counts; #156750 traces specific functions). This is a sign of an engaged, technically sophisticated user base — but also that they're doing the diagnosis the maintainers haven't had bandwidth for.

**Dissatisfaction:** The volume of open P2s (16+ listed) with no linked fix PR suggests a **triage/throughput gap**, not a quality gap.

---

## 8. Backlog Watch

Long-lived items needing maintainer attention:

| Item | Age | Why it matters |
|---|---|---|
| [#3897](https://github.com/NousResearch/hermes-agent/issues/3897) Per-user RBAC | **~8 months** (since 2026-03-30) | Top-voted feature; blocks team adoption; still `needs-decision` |
| [#85135](https://github.com/NousResearch/hermes-agent/issues/85135) Memory prefetch timeout | **~3.5 months** | Trivial fix; param already plumbed; stuck in backlog |
| [#85700](https://github.com/NousResearch/hermes-agent/issues/85700) `enabled_toolsets` on delegate | **~3.5 months** | Cost reduction; `needs-decision` |
| [#127995](https://github.com/NousResearch/hermes-agent/issues/127995) venv-heredoc terminal guard | **~2 months** | Legitimate commands rejected pre-execution; false-positive guard |
| [#130294](https://github.com/NousResearch/hermes-agent/issues/130294) Windows uv sync install fail | **~2 months** | Blocks Windows onboarding entirely; marked `cause/upstream` but no workaround documented |
| [#113557](https://github.com/NousResearch/hermes-agent/pull/113557) Memory fuzzy-match for drifted `old_text` | **~2.3 months** (PR open) | Fixes a recurring model-behavior pain; PR open without merge |
| [#139986](https://github.com/NousResearch/hermes-agent/pull/139986) Stranded tool-call markup re-prompt | **~1.3 months** (PR open) | Affects Qwen3-Coder/Ollama users; PR open |
| [#126240](https://github.com/NousResearch/hermes-agent/pull/126240) Cron delivery ledger | **~2 months** (PR open) | Message-delivery reliability; `risk-message-delivery` tag |

**Recommendation to maintainers:** A "backlog sprint" targeting the three oldest `needs-decision` issues (#3897, #85135, #85700) plus merging the two long-open memory/agent PRs (#113557, #139986) would clear significant community debt and likely improve sentiment without large architectural changes. Separately, the cluster of state.db/lifecycle bugs (#158976, #159043, #143720) warrants a dedicated "gateway state hygiene" milestone — they share a root cause and are individually low-complexity fixes.

</details>

<details>
<summary><strong>IronClaw</strong> — <a href="https://github.com/nearai/ironclaw">nearai/ironclaw</a></summary>

# IronClaw Project Digest — 2026-11-23

## 1. Today's Overview
IronClaw is in a very quiet period: over the last 24 hours there were **no PRs updated, no merged/closed changes, and no new releases** — only a **single open issue** received an update. That issue (#8172) is a QA-reported bug about the hardcoded `PRIMARY_MODEL_CALL_IDLE_TIMEOUT` breaking slow local LLM setups, and it is the sole active thread in the window. With zero code movement and no release activity, today registers as a **maintenance/lull day** rather than a development push. The project's near-term health signal rests almost entirely on how quickly the small backlog of QA-found issues is triaged.

## 2. Releases
No new releases in this window. Nothing to report on changes, breaking changes, or migration notes.

## 3. Project Progress
- **Merged/closed PRs today:** 0
- **Closed issues today:** 0

No features advanced and no fixes landed in the last 24 hours. The only visible movement was a comment/update on an existing open issue, not a code change. From a delivery standpoint, the pipeline is idle.

## 4. Community Hot Topics
Only one item saw activity, so it is by default the hot topic:

- **[Issue #8172 — [QA] Make PRIMARY_MODEL_CALL_IDLE_TIMEOUT configurable for slow local LLMs](https://github.com/nearai/ironclaw/issues/8172)** — 1 comment, 0 👍, open since 2026-11-15, updated 2026-11-22.

**Underlying need:** Users running local inference (e.g., Ollama) hit the agent loop's model-call idle watchdog because the timeout is not tunable. The request signals a broader demand for **configurability of host-managed loop timing parameters** so self-hosted/slow-model users aren't penalized by defaults tuned for fast cloud providers. The low reaction count (0 👍) suggests the issue is new and not yet widely amplified, but it is a QA-filed bug, which raises its priority signal.

## 5. Bugs & Stability
One bug is active in this window:

- **[#8172](https://github.com/nearai/ironclaw/issues/8172) — [qa-bug] PRIMARY_MODEL_CALL_IDLE_TIMEOUT not configurable for slow local LLMs** (reported by n4s3r, affect: v1.4.1, hosted-staging).
  - **Severity: Medium.** It is not a crash or data-loss issue, but it causes functional failure/timeout for a legitimate configuration (local Ollama providers), effectively blocking a supported self-hosted use case. Reproducible per the report.
  - **Fix PR:** None observed in this window.

No crashes, regressions, or new stability reports beyond this item.

## 6. Feature Requests & Roadmap Signals
The lone issue doubles as a feature signal: **expose `PRIMARY_MODEL_CALL_IDLE_TIMEOUT` (and likely related watchdog/timeout knobs) as configuration** in `providers.json` or equivalent. Given it's QA-filed with a clear environment and repro, this is a strong candidate for a **near-term patch release (e.g., 1.4.x)** rather than a major roadmap item. Prediction: a small config-surface change landed in the next maintenance release, possibly bundled with other provider/timeout configurability requests if any exist in the wider backlog.

## 7. User Feedback Summary
- **Pain point:** Self-hosting users on slow local LLMs (Ollama) cannot complete agent runs because the model-call idle watchdog times out before the local model responds.
- **Use case:** Running IronClaw against local inference providers — a segment that expects tunable timeouts, not cloud-optimized defaults.
- **Satisfaction/dissatisfaction:** Too little data in this window to gauge sentiment broadly; the single signal is mild friction from a self-hosting user. No positive feedback captured today.

## 8. Backlog Watch
- **[#8172](https://github.com/nearai/ironclaw/issues/8172)** has been open **8 days** (since 2026-11-15) with only **1 comment** and no linked fix PR. Given it is a reproducible QA bug affecting a supported configuration, it warrants maintainer triage attention. No other long-unanswered issues or PRs surfaced in this 24-hour window — the backlog footprint visible here is minimal but entirely unresourced.

---

**Health summary:** Low activity day; zero development throughput. The project's health in this snapshot depends on timely handling of a small, clearly-scoped QA bug rather than any throughput metric. Recommend watching whether #8172 converts to a fix PR in the coming days.

</details>

<details>
<summary><strong>QwenPaw</strong> — <a href="https://github.com/agentscope-ai/QwenPaw">agentscope-ai/QwenPaw</a></summary>

# QwenPaw Project Digest — 2026-11-23

## 1. Today's Overview

QwenPaw shows **moderate-to-high activity** with 6 open issues and 11 open PRs updated in the last 24 hours, but **zero merges or releases** — a notable stagnation signal on the integration side. The issue tracker is dominated by **Console/Web UI quality problems** (iOS WebKit freezes, keyboard accessibility, content clipping, misleading error prompts), suggesting the 2.3.0.post1 console release has accumulated real usability debt. On the positive side, the community is actively contributing fixes: several PRs opened on 2026-11-22/23 directly target the day's top issues (#8844, #8848), indicating a responsive contributor base even if maintainer merge throughput is slow. A large stacked feature set for local model engines (llama.cpp GPU, MLX, Console controls — PRs #8649/#8647/#8648) continues to sit unmerged after two weeks, and one issue (#2674) has been open since March with an 8-month lifecycle. Overall health: **active community, bottlenecked maintainer review pipeline**.

## 2. Releases

No new releases in the last 24 hours. No release notes, breaking changes, or migration guidance to report.

## 3. Project Progress

**No PRs were merged or closed today** — 11 remain open, 0 merged/closed. Feature advancement is therefore measured by PR readiness rather than landed code:

- **Telegram forum-topic session isolation** — PR [#8857](https://github.com/agentscope-ai/QwenPaw/pull/8857) (first-time contributor) implements the feature requested in issue #8827, splitting one shared agent session per forum into topic-scoped sessions/memory/Console conversations.
- **Console history pagination** — PR [#8858](https://github.com/agentscope-ai/QwenPaw/pull/8858) fixes restored-conversation rendering after reconnect/handoff by marking restored messages as history.
- **Keyboard-focusable conversation** — PR [#8854](https://github.com/agentscope-ai/QwenPaw/pull/8854) directly addresses issue #8844.
- **Compaction failure guidance** — PR [#8853](https://github.com/agentscope-ai/QwenPaw/pull/8853) replaces the misleading `/clear` suggestion with a retry recommendation (fixes #8848).
- **Local model stack** — PRs [#8649](https://github.com/agentscope-ai/QwenPaw/pull/8649), [#8647](https://github.com/agentscope-ai/QwenPaw/pull/8647), [#8648](https://github.com/agentscope-ai/QwenPaw/pull/8648) (llama.cpp GPU controls, managed MLX, Console controls) remain stacked and awaiting review.

**Assessment:** fix PRs are being authored faster than they are being merged; the review queue is the constraint, not contributor supply.

## 4. Community Hot Topics

Ranked by comment activity among items updated today (all modest: 1–3 comments, 0 reactions — no viral threads):

1. **[Issue #2674](https://github.com/agentscope-ai/QwenPaw/issues/2674) — WeChat integration incomplete (3 comments)** — The most-discussed item. Long-lived (created 2026-03-31) and still open. Underlying need: users expect first-class WeChat support comparable to other channels, including typing indicators, group-chat bot discovery, UI/session sync, and desktop WeChat presence. The "503 Channel Console not found" error hints at a backend channel-registration gap rather than pure user misconfiguration.
2. **[Issue #8827](https://github.com/agentscope-ai/QwenPaw/issues/8827) — Telegram forum topic isolation (2 comments)** — Paired with PR #8857; reflects multi-topic community workflows where shared memory/session is unacceptable.
3. **[Issue #8852](https://github.com/agentscope-ai/QwenPaw/issues/8852) — iOS WebKit freeze in long conversations (2 comments)** — A performance regression with a detailed root-cause hypothesis (UserMessageAnchors layout thrashing + `content-visibility:auto` in a `column-reverse` list).
4. **[Issue #8844](https://github.com/agentscope-ai/QwenPaw/issues/8844) — Conversation not keyboard-scrollable (2 comments)** — Accessibility gap; fix PR #8854 already open.
5. **[Issue #8848](https://github.com/agentscope-ai/QwenPaw/issues/8848) — Misleading `/clear` compaction advice (2 comments)** — Data-loss risk in UX copy; fix PR #8853 already open.

**Pattern:** the community's attention is concentrated on **channel completeness (WeChat, Telegram) and Console polish/accessibility**, not on core agent capabilities.

## 5. Bugs & Stability

Ranked by severity:

| Severity | Item | Description | Fix PR? |
|---|---|---|---|
| **High** | [Issue #8852](https://github.com/agentscope-ai/QwenPaw/issues/8852) | Console **freezes on iOS Safari/WebKit** during long sessions (v2.3.0.post1); layout thrashing suspected. Blocks mobile use entirely. | No PR yet |
| **High** | [Issue #2674](https://github.com/agentscope-ai/QwenPaw/issues/2674) | WeChat channel broken in multiple ways, incl. **"503 Channel Console not found"** session desync between UI and channel. | No PR yet |
| **Medium** | [Issue #8856](https://github.com/agentscope-ai/QwenPaw/issues/8856) | Web Console **clips wide tables/long lines** with no horizontal scroll; `overflow-x-auto` confirmed absent from built `AssistantMarkdown` bundle. | No PR yet |
| **Medium** | [Issue #8844](https://github.com/agentscope-ai/QwenPaw/issues/8844) | Conversation list **not keyboard-focusable**; arrow/PageUp/PageDown/Home/End do nothing. Usability/accessibility regression. | ✅ [#8854](https://github.com/agentscope-ai/QwenPaw/pull/8854) |
| **Medium (UX/data-loss)** | [Issue #8848](https://github.com/agentscope-ai/QwenPaw/issues/8848) | Compaction failure message recommends `/clear`, which **discards context** — dangerous guidance. | ✅ [#8853](https://github.com/agentscope-ai/QwenPaw/pull/8853) |
| **Low (CI)** | [PR #8855](https://github.com/agentscope-ai/QwenPaw/pull/8855) | Windows timing/encoding flakiness in Plugin SDK tests. | Self (open) |

**Note:** 2 of 5 user-facing bugs have fix PRs in flight; the two highest-severity items (iOS freeze, WeChat) have none.

## 6. Feature Requests & Roadmap Signals

- **Telegram forum-topic session isolation** ([#8827](https://github.com/agentscope-ai/QwenPaw/issues/8827)) — already has an implementation PR ([#8857](https://github.com/agentscope-ai/QwenPaw/pull/8857)). **Most likely candidate to land in the next minor release** if review clears.
- **Local model runtime management** ([#8649](https://github.com/agentscope-ai/QwenPaw/pull/8649)/[#8647](https://github.com/agentscope-ai/QwenPaw/pull/8647)/[#8648](https://github.com/agentscope-ai/QwenPaw/pull/8648)) — GPU controls, MLX engine, runtime auto-update, and Console UI. This is a **large, coherent roadmap block** (size L/XXL/XL) that would meaningfully strengthen self-hosted/local inference. Predict: next major or late minor release, gated on review capacity.
- **Runtime base-path deployment** ([#8719](https://github.com/agentscope-ai/QwenPaw/pull/8719), `QWENPAW_BASE_PATH`) — reverse-proxy prefix support; signals growing enterprise/self-hosted deployment demand.
- **Provider fallback on disabled model** ([#8617](https://github.com/agentscope-ai/QwenPaw/pull/8617), fixes #8579) — robustness feature preventing channel-wide failures.
- **WeChat channel completeness** (implied by #2674) — no formal enhancement issue, but repeated pain points suggest demand for parity with other channels.

**Prediction:** next version likely = Telegram topic isolation + Console bug fixes (keyboard focus, compaction messaging, history pagination) + possibly the local-model stack if the stack is merged in order.

## 7. User Feedback Summary

**Pain points (dissatisfaction):**
- **Channel reliability:** WeChat users cannot add the bot to groups, see no desktop bot, get no "working" feedback, and hit `503 Channel Console not found` when mixing UI and channel input (#2674). This reads as a channel that shipped before it was complete.
- **Mobile Console is unusable for long chats** on iOS WebKit (#8852) — a hard blocker.
- **Content rendering breaks** on wide tables/long lines with no scroll (#8856).
- **Accessibility/keyboard users are locked out** of scrolling the conversation (#8844).
- **Dangerous UX copy:** `/clear` advice after compaction failure risks silent context loss (#8848).
- **Configuration ambiguity:** #2674's author explicitly asks whether problems are their setup or QwenPaw's — documentation/setup-feedback is unclear.

**Satisfaction signals:** contributors are filing precise, well-scoped bug reports with version, commit, environment, and root-cause hypotheses (#8852, #8856), and first-time contributors are submitting fixes (#8857, #8853). This indicates a technically engaged, invested user base.

**Use cases observed:** multi-topic Telegram communities, WeChat group assistants, self-hosted local-model inference (llama.cpp/MLX), reverse-proxy deployments, keyboard-only/accessibility workflows.

## 8. Backlog Watch

Items needing maintainer attention (age + importance):

1. **[Issue #2674](https://github.com/agentscope-ai/QwenPaw/issues/2674) — WeChat incomplete** — Open since **2026-03-31 (~8 months)**, 3 comments, no linked fix PR. Highest-priority backlog item: an entire channel is effectively non-functional and the reporter hasn't received a definitive maintainer answer.
2. **[PR #8649](https://github.com/agentscope-ai/QwenPaw/pull/8649) / [#8647](https://github.com/agentscope-ai/QwenPaw/pull/8647) / [#8648](https://github.com/agentscope-ai/QwenPaw/pull/8648) — local model stack** — Open since **2026-11-09 (~2 weeks)**, size L/XXL/XL, stacked merge order documented, still unreviewed. Large features left idle risk contributor attrition and rebase churn.
3. **[PR #8588](https://github.com/agentscope-ai/QwenPaw/pull/8588) — OpenViking memory cleanup** — Open since **2026-11-05 (~18 days)**, marked *Under Review*, size XXL. Follow-up to #7613; stalled review.
4. **[PR #8719](https://github.com/agentscope-ai/QwenPaw/pull/8719) — runtime base-path deployment** — Open since **2026-11-13 (~10 days)**, *Under Review*, size XXL.
5. **[PR #8617](https://github.com/agentscope-ai/QwenPaw/pull/8617) — provider-disabled fallback** — Open since **2026-11-07 (~16 days)**, size M, fixes #8579. Small and high-value; should be quick to review.
6. **[Issue #8852](https://github.com/agentscope-ai/QwenPaw/issues/8852) — iOS WebKit freeze** — New but high severity with **no fix PR**; needs maintainer triage and likely frontend ownership.

**Bottom line for maintainers:** the project's contributor pipeline is healthy, but **review/merge throughput is the critical bottleneck**. Clearing the small, ready fixes (#8853, #8854, #8617) and triaging the two high-severity unassigned bugs (#8852, #2674) would yield disproportionate health gains this week.

</details>

<details>
<summary><strong>ZeroClaw</strong> — <a href="https://github.com/zeroclaw-labs/zeroclaw">zeroclaw-labs/zeroclaw</a></summary>

# ZeroClaw Project Digest — 2026-11-23

## 1. Today's Overview

ZeroClaw shows **very high development velocity** today, with 50 PRs and 13 issues updated in the last 24 hours — an exceptional ratio of pull requests to issues that signals an active, code-forward contributor base. However, only 4 PRs were merged/closed against 46 still open, suggesting a **review bottleneck** relative to contribution volume, and no new releases were cut. Activity is heavily concentrated around security/credential scoping (the `identity-access` topic), Gemini provider modernization, and a cluster of dashboard/tooling bug reports from a small set of prolific reporters. Notably, several long-running PRs (#11911, #12265, #12418) remain open after 1–3 weeks, indicating a maturing but slower-moving review process for high-risk (XL, `risk:high`) changes.

---

## 2. Releases

**None.** No new releases were published in the last 24 hours. The last shipped reference point mentioned in the data is `zeroclaw 0.9.0 (6c78ba5)` (cited in Issue #12649).

---

## 3. Project Progress

**Merged/Closed PRs today (4 total):**

- **[#12664](https://github.com/zeroclaw-labs/zeroclaw/pull/12664)** — `docs(contributing)`: Explains syncing a fork with upstream before branching. Low-risk contributor-experience docs improvement.
- **[#12656](https://github.com/zeroclaw-labs/zeroclaw/pull/12656)** — `fix(deps)`: Security dependency bump addressing **RUSTSEC-2026-0588, -0589, and -0592** — updates `url` to 2.5.9 and `ruma` to 0.17.2. This is a meaningful **security fix** for the Matrix/SDK surface.
- **[#12635](https://github.com/zeroclaw-labs/zeroclaw/pull/12635)** — `fix(gateway/web)`: Fixes voice settings being overwritten when edited from multiple screens (resolves Issue #12633). Preserves cross-session voice preference changes.
- (One additional closed PR within the full set of 50.)

**In-flight features advancing (open, high activity):**
- **Scoped credential management** ([#12490](https://github.com/zeroclaw-labs/zeroclaw/pull/12490), [#12408](https://github.com/zeroclaw-labs/zeroclaw/pull/12408), [#12402](https://github.com/zeroclaw-labs/zeroclaw/pull/12402), [#12659](https://github.com/zeroclaw-labs/zeroclaw/pull/12659), [#12596](https://github.com/zeroclaw-labs/zeroclaw/pull/12596)) — a coordinated security layer for operator-managed HTTP/SSH/browser credentials bound to exact HTTPS origins, all tied to RFC #12422.
- **ACP gateway identity & reconnect** ([#12653](https://github.com/zeroclaw-labs/zeroclaw/pull/12653)) — adds OIDC auth, principal scoping, and turn replay.
- **Lucid memory backend retirement** ([#12521](https://github.com/zeroclaw-labs/zeroclaw/pull/12521)) — a large (`size:XL`, `risk:high`) breaking change removing the entire Lucid backend.

---

## 4. Community Hot Topics

Activity is measured by comment count; most items today show zero comments, so the hot topics are the older, still-active threads.

- **[Issue #12422 — RFC: Scoped use of operator-managed service credentials](https://github.com/zeroclaw-labs/zeroclaw/issues/12422)** — *9 comments, the most-discussed item.* Author: CastelloBrancoTecnologia (open since 2026-11-14). This RFC is the **anchor for a large cluster of PRs** (#12490, #12408, #12402, #12659, #12596) and represents the community's central design debate right now.
  - **Underlying need:** Operators want agents to act against services *without ever exposing credentials to the model, chat, skill text, or generated code*. This is a genuine zero-trust security requirement, and the volume of dependent PRs shows it's the top architectural priority.
- **[Issue #12669 — Gemini provider modernization tracker](https://github.com/zeroclaw-labs/zeroclaw/issues/12669)** — just created today. Coordinates migration off **retired Google Gemini CLI / Code Assist consumer OAuth** onto supported paths (API keys, Vertex/Agent Platform, Enterprise).
  - **Underlying need:** External platform deprecation is forcing a migration; users will face broken Google integrations if this isn't prioritized.
- **Prolific reporting cluster from JordanTheJet** (Issues #12633, #12668, #12667, #12666, #12662, #12661 and PR #12635) — a single user filing a steady stream of precise, component-tagged bugs and enhancements, primarily in `web dashboard` and `tools`.

---

## 5. Bugs & Stability

Ranked by severity:

| Severity | Issue | Summary | Fix PR? |
|---|---|---|---|
| **S2** | [#12667](https://github.com/zeroclaw-labs/zeroclaw/issues/12667) | `/model <id>` says "Model switched" but requests keep the profile's configured model — **silent wrong-model behavior** | No |
| **S2** | [#12655](https://github.com/zeroclaw-labs/zeroclaw/issues/12655) | Autonomous skill creation never fires (`[skills.skill_creation]` is a no-op, silent) — extractor expects OpenAI function wrapper but history stores flat tool calls | No |
| **S2** | [#12633](https://github.com/zeroclaw-labs/zeroclaw/issues/12633) **[CLOSED]** | Stale voice settings screen can switch device back to browser-service recognition | ✅ [#12635](https://github.com/zeroclaw-labs/zeroclaw/pull/12635) |
| **S3** | [#12666](https://github.com/zeroclaw-labs/zeroclaw/issues/12666) | `delegate` accepts unknown argument and silently drops it despite `additionalProperties: false` | No |
| **S3** | [#12661](https://github.com/zeroclaw-labs/zeroclaw/issues/12661) | Dashboard "Generate" pairing-code button always returns 403 on localhost | No |
| **S3** | [#12660](https://github.com/zeroclaw-labs/zeroclaw/issues/12660) | Agent cards' "this month" spend is actually all-time spend — **misleading cost reporting** | No |
| **S3** | [#12649](https://github.com/zeroclaw-labs/zeroclaw/issues/12649) | Channel-routed tools registered & approval-gated even when channel doesn't exist | No |
| **Follow-up** | [#12665](https://github.com/zeroclaw-labs/zeroclaw/issues/12665) | Recovered tool results from damaged envelopes omit `name`, causing Groq replay failures (depends on #12188) | Blocked on #12188 |

**Notable pattern:** Several S2/S3 bugs share a theme of **silent failures and misleading success states** (#12667, #12655, #12660, #12666). This is a stability *perception* risk — users see success while state diverges. Only one fix PR (#12635) exists among the listed bugs, so most remain unaddressed.

---

## 6. Feature Requests & Roadmap Signals

- **[#12668](https://github.com/zeroclaw-labs/zeroclaw/issues/12668)** — Let operators apply a bounded agentic delegate's own thinking level. Niche but precise; fits the ongoing delegation/tooling refinement theme.
- **[#12662](https://github.com/zeroclaw-labs/zeroclaw/issues/12662)** — Remove unreachable Raspberry Pi LED tools from `zeroclaw-hardware`. A *cleanup* request signaling demand for **leaner, dead-code-free binaries**.

**Predicted next-version content (higher confidence):**
1. **Scoped credential management** — the sheer number of stacked, RFC-linked PRs (#12490, #12408, #12402, #12659, #12596) makes this the leading candidate for the next major release.
2. **Gemini provider modernization** (#12669) — driven by external deprecation, likely urgent.
3. **Lucid memory backend removal** (#12521) — a breaking change ready to land once reviewed.

---

## 7. User Feedback Summary

**Pain points:**
- **Security & credential exposure** — the dominant theme (#12422 and its ~5 dependent PRs). Operators clearly need first-class secret scoping.
- **Silent/incorrect state** — repeated complaints that the UI/CLI reports success while behavior differs (#12667 model switch, #12655 skill creation, #12660 spend figures). This erodes trust in the agent's reliability.
- **Localhost/dashboard friction** — pairing-code 403s (#12661) and stale web screens (#12633) indicate rough edges in the self-hosted operator experience.

**Satisfaction signals:** High contributor engagement and rapid, well-tagged bug reports (especially from JordanTheJet and danieliyahu1) indicate an active, invested community willing to file detailed, reproducible reports.

**Dissatisfaction signal:** The gap between PR creation (46 open) and merging (4 today) risks contributor frustration — many PRs have sat open for 1–3 weeks (see Backlog Watch).

---

## 8. Backlog Watch

Long-unanswered open items needing maintainer attention:

- **[PR #11911](https://github.com/zeroclaw-labs/zeroclaw/pull/11911)** — *Open since 2026-10-20 (~5 weeks), `size:XL`, `risk:medium`.* Preserve completed tool results and reuse bounded recovery. Foundational for #12665. **Highest-priority backlog item.**
- **[PR #12418](https://github.com/zeroclaw-labs/zeroclaw/pull/12418)** — *Open since 2026-11-13.* Keep Python SSH task helper agent-only. Related to the SSH broker work and #12518.
- **[PR #12408](https://github.com/zeroclaw-labs/zeroclaw/pull/12408)** — *Open since 2026-11-13, flagged `needs-author-action`.* Manage scoped HTTP credentials. Author action required.
- **[PR #12402](https://github.com/zeroclaw-labs/zeroclaw/pull/12402)** — *Open since 2026-11-12.* Write-only plugin TLS credential panel.
- **[PR #12265](https://github.com/zeroclaw-labs/zeroclaw/pull/12265) / [#12266](https://github.com/zeroclaw-labs/zeroclaw/pull/12266) / [#12267](https://github.com/zeroclaw-labs/zeroclaw/pull/12267)** — *Open since 2026-11-06 (~17 days).* A trio of tiny (`size:XS`) documentation-exception records blocked on Core Team placement approvals. These are low-effort-to-close but have lingered — worth a maintainer sweep.
- **[Issue #12518](https://github.com/zeroclaw-labs/zeroclaw/issues/12518)** — *Open since 2026-11-17, `status:blocked`.* Tracks retirement of the Python SSH helper after native broker parity.

**Overall health assessment:** Strong contributor energy and a clear security-focused direction, but the project shows signs of **review throughput lag** (46 open PRs, several aging 2–5 weeks, one flagged `needs-author-action`). Clearing the XL/high-risk review queue — particularly #11911 and the RFC #12422 cluster — would convert today's high activity into shipped value.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*