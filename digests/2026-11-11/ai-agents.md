# OpenClaw Ecosystem Digest 2026-11-11

> Issues: 281 | PRs: 500 | Projects covered: 5 | Generated: 2026-11-11 01:11 UTC

- [OpenClaw](https://github.com/openclaw/openclaw)
- [Hermes Agent](https://github.com/nousresearch/hermes-agent)
- [IronClaw](https://github.com/nearai/ironclaw)
- [QwenPaw](https://github.com/agentscope-ai/QwenPaw)
- [ZeroClaw](https://github.com/zeroclaw-labs/zeroclaw)

---

## OpenClaw Deep Dive

# OpenClaw Project Digest — 2026-11-11

## 1. Today's Overview

OpenClaw shows **very high development velocity** today, with 281 issues updated (191 open/active, 90 closed) and 500 PRs touched (342 open, 158 merged/closed) in the last 24 hours. Two releases shipped: a current-line `v2026.11.3` and a backported `extended-stable` `v2026.9.37` from a retired maintenance line — a sign the project is maintaining multiple release tracks simultaneously. Activity is dominated by **session-state integrity, memory/dreaming subsystem correctness, and update/migration friction**, with several P0 release blockers still open. The maintainer queue is deep: a large share of high-severity issues carry `clawsweeper:needs-maintainer-review` or `needs-product-decision`, indicating triage is the current bottleneck rather than engineering throughput. Overall health is strong on throughput but strained on closure of long-lived P1/P2 items.

## 2. Releases

**v2026.11.3** (current line)
- **Private task results:** Private subagent completions are no longer leaked into streamed chat replies ([#188490](https://github.com/openclaw/openclaw/pull/188490), thanks @fuller-stack-dev).
- **Reliable child-task handoffs:** Parent agents can now hand off to replacement work after cancelling a child without leaving the cancelled child stranded.
- No explicit breaking changes or migration notes were included in the release body — but see Issue [#193157](https://github.com/openclaw/openclaw/issues/193157) below, where upgrades from 2026.10.10 are being refused because of the retired `agents.defaults.heartbeat` key, which functions as an *implicit* migration blocker.

**v2026.9.37** (`extended-stable`, gateway-only)
- Explicitly published from a **retired maintenance line** by maintainer decision: September 2026 code plus critical security updates, reliability/performance fixes, and new model support.
- **Migration note:** This is a security-backport branch, not a feature path. Operators on the 2026.9.x line should treat it as a stopgap and plan to move to the 2026.11.x line.

## 3. Project Progress

158 PRs were merged or closed in the last 24h. Notable movements visible in the sampled set:

- **Bug fixes landing:** Android background location disclosure fix ([#195729](https://github.com/openclaw/openclaw/pull/195729)), web-UI refresh stability across Files/Activity/Subagents/Processes panels ([#196949](https://github.com/openclaw/openclaw/pull/196949), [#196939](https://github.com/openclaw/openclaw/pull/196939), [#196944](https://github.com/openclaw/openclaw/pull/196944)), plain-text preview handling of embedded backticks ([#196690](https://github.com/openclaw/openclaw/pull/196690)), and a setup strict-mode schema fix ([#196843](https://github.com/openclaw/openclaw/pull/196843)).
- **Performance work:** Sandbox workspace import no longer triggers full content hashing ([#196937](https://github.com/openclaw/openclaw/pull/196937)); `tool_describe` no longer floods context with output schemas in Tool Search mode ([#196868](https://github.com/openclaw/openclaw/pull/196868)) — a 620-call trial returned 18.4M tokens of schema data.
- **Update/release infrastructure:** Quota-aware npm fanout rejection ([#196945](https://github.com/openclaw/openclaw/pull/196945)) and clearer repair warnings for unrestored Gateways ([#196946](https://github.com/openclaw/openclaw/pull/196946)).
- **Identity/security track:** `openclaw id rebind` with recovery kit ([#196388](https://github.com/openclaw/openclaw/pull/196388)) is a large, security-sensitive change progressing through review.
- **Closed issues today** include [#193962](https://github.com/openclaw/openclaw/issues/193962) (SQLite header-probe update unreachable), [#154572](https://github.com/openclaw/openclaw/issues/154572) (claude-cli subagent spawn failure), [#149631](https://github.com/openclaw/openclaw/issues/149631) (CI 121-job matrix overflow), and [#175645](https://github.com/openclaw/openclaw/issues/175645) (NO_REPLY misclassified as empty_response).

## 4. Community Hot Topics

| Item | Comments | Theme |
|---|---|---|
| [#150635](https://github.com/openclaw/openclaw/issues/150635) — Dreaming deep phase never promotes | 27 | Memory/recall retention eviction at 512-entry cap |
| [#193962](https://github.com/openclaw/openclaw/issues/193962) — Update can't reach header-probe fix | 26 | Update path self-blocking (now closed) |
| [#123792](https://github.com/openclaw/openclaw/issues/123792) — Assistant turns render twice with CLI backends | 18 | Duplicate persistence via two independent paths |
| [#154572](https://github.com/openclaw/openclaw/issues/154572) — `sessions_spawn` claude-cli always fails | 16 | `SessionTranscriptWriterClaimReboundError` (closed) |
| [#151962](https://github.com/openclaw/openclaw/issues/151962) — Phantom user messages | 15 | Runtime strings injected as user prompts |
| [#138561](https://github.com/openclaw/openclaw/issues/138561) — active-memory stops recalling silently | 13 | No info-level signal on recall failure |

**Underlying needs:** The community is converging on **observability of the agent's own memory and session state**. Phantom prompts, silent recall failures, and duplicate turns are all symptoms of the same gap — users cannot see *why* the agent believes or remembers something. The dreaming/recall cluster (#150635, #138561, #151173, #138366) is arguably the project's most active thematic thread and is blocked largely on product decisions rather than code.

## 5. Bugs & Stability

**P0 / release blockers (highest severity):**
- [#190563](https://github.com/openclaw/openclaw/issues/190563) — Cannot resume paused Codex chat: provider review / native thread mismatch. Regression, `impact:ux-release-blocker`, needs security review. No fix PR.
- [#194664](https://github.com/openclaw/openclaw/issues/194664) — Codex protected continuation blocks all follow-ups while Stop reports no active run (2026.11.1). No fix PR.
- [#147728](https://github.com/openclaw/openclaw/issues/147728) — xAI OAuth inference fails with HTTP 426; Grok client-version header carries OpenClaw's version. No fix PR.

**P1 / high impact:**
- [#170928](https://github.com/openclaw/openclaw/issues/170928) — Windows gateway takes 7–9 minutes to become ready, intermittently unresponsive. `impact:crash-loop`.
- [#194403](https://github.com/openclaw/openclaw/issues/194403) — Helper-completion continuations invalidate their own authority; conversations blocked (2026.11.1).
- [#181459](https://github.com/openclaw/openclaw/issues/181459) — 3.5 GB agent DB makes startup a gamble; embeddings stored 3×; `commit checkpoint expired`.
- [#168101](https://github.com/openclaw/openclaw/issues/168101) — Retry-After ignores `maxRetryDelayMs` after a tool call; session lane held for the full sleep.
- [#159230](https://github.com/openclaw/openclaw/issues/159230) — `message_tool_only` stranded-reply recovery re-prompts the model with private text and force-sends an English error notice. Security-sensitive.

**Notable P2 regressions/friction:**
- [#172986](https://github.com/openclaw/openclaw/issues/172986) — WebChat middle-truncates long paths in `file:` links; intermittent payload mutation.
- [#144739](https://github.com/openclaw/openclaw/issues/144739) — 2026.9.3 → 2026.9.4 npm update runs old code against schema-17 candidate state.
- [#153430](https://github.com/openclaw/openclaw/issues/153430) — Deep `$include` config passes resolution but crashes later stages with RangeError.

**Fix PRs present:** Several issues carry `clawsweeper:linked-pr-open` (e.g., #150635, #151173, #155271), meaning partial remediation is in flight. Most P0s do **not** yet have an open fix PR — this is the clearest stability risk today.

## 6. Feature Requests & Roadmap Signals

- **Memory/Dreams ownership:** [#138366](https://github.com/openclaw/openclaw/issues/138366) — let the memory slot owner drive the Dreams page via a `dreaming` provider in `MemoryPluginCapability`. This is the architectural key to the entire dreaming cluster and is plausibly slated for the 2026.11.x/2026.12 line.
- **Cron fallback authorization:** [#192009](https://github.com/openclaw/openclaw/issues/192009) — explicitly authorize cross-provider cron fallback accounts. High-value for production automation; likely a near-term config addition.
- **Bounded foreground runs:** [#138990](https://github.com/openclaw/openclaw/issues/138990) — enforceable checkpoints and bounded yields for long WebChat runs. Fits the theme of the v2026.11.3 handoff work; plausible next minor.
- **Model pin fallback inheritance:** [#151980](https://github.com/openclaw/openclaw/issues/151980) — session model pins should inherit the agent's fallback chain. Addresses a common 429-outage failure mode; likely to land soon.
- **Policy alias convergence:** [#140213](https://github.com/openclaw/openclaw/issues/140213) — multiple policy aliases resolving to one configured model.
- **UI polish:** [#155039](https://github.com/openclaw/openclaw/issues/155039) — manual team-sidebar agent ordering; [#150250](https://github.com/openclaw/openclaw/issues/150250) — Skill Workshop learning-coverage verification.
- **Protocol track:** [#119294](https://github.com/openclaw/openclaw/issues/119294) — migration to MCP 2.0 stateless spec (closed today; likely superseded or deferred).

**Prediction:** The next minor will likely bundle memory/dreaming promotion fixes, model-fallback inheritance, and cron fallback authorization. MCP 2.0 migration remains a longer-horizon item.

## 7. User Feedback Summary

**Pain points:**
- **Silent failures are the dominant complaint.** Users repeatedly report that memory recall, config updates, and session state stop working *without any log signal* (#138561, #150635, #144594). This erodes trust more than loud crashes would.
- **Update/migration friction is a recurring theme** — multiple issues describe updates that refuse to apply, apply the wrong version, or leave the Gateway stopped (#193962, #193157, #144739, #196946). For a self-hosted agent, update reliability is existential.
- **Multi-provider auth fragility** — xAI 426s, MiniMax 429 retry storms (#177077), and fallback notices leaking to end-user channels (#92473) indicate the provider abstraction is not yet robust across the long tail of providers.
- **Windows performance** (#170928, #192496) remains a persistent second-class-citizen area.

**Satisfaction signals:** The v2026.11.3 private-task-results fix and the child-task handoff fix respond directly to community-reported leakage and orphaned-subagent problems, suggesting maintainers are listening to the loudest threads. The large volume of well-scoped `roboclaw-bot` and community PRs (e.g., the web-UI stability batch) shows a healthy contributor pipeline.

**Dissatisfaction signal:** The prevalence of `clawsweeper:needs-product-decision` on P2 issues that have sat since July/August (e.g., #112313, #112638, #92473) suggests some users feel their reports are acknowledged but not resolved.

## 8. Backlog Watch

Long-lived, high-value items needing maintainer attention:

- [#112313](https://github.com/openclaw/openclaw/issues/112313) (since 2026-07-21) — Dead-lettered outbound queue entries are permanent; no CLI/RPC/TTL can clear them. `diamond lobster`, needs product decision. **Three-plus months open.**
- [#112638](https://github.com/openclaw/openclaw/issues/112638) (since 2026-07-22) — `session.maintenance enforce` mode does not bound the store; thread/channel entries exempt from all reclaim. Silent unbounded growth.
- [#92473](https://github.com/openclaw/openclaw/issues/92473) (since 2026-06-12) — Model fallback notice leaks to external user-facing channels. `diamond lobster`, needs product decision. **Five months open.**
- [#132767](https://github.com/openclaw/openclaw/issues/132767) (since 2026-08-29) — Generic CLI host omits assemble-before-prompt; context engine's `systemPromptAddition` arrives one turn late. Prior fix PR was closed unmerged.
- [#143973](https://github.com/openclaw/openclaw/issues/143973) (since 2026-09-10) — `view_image` persists full base64 inline; 1.3% of events hold 80% of store bytes. Direct contributor to the large-DB startup problems in #181459.
- [#196388](https://github.com/openclaw/openclaw/pull/196388) — `openclaw id rebind` (XL, security-sensitive). Needs sustained reviewer bandwidth given the key-migration security surface.

**Recommendation:** The `needs-product-decision` queue is the project's principal throughput limiter. Clearing the 2026-07/08 backlog of `diamond lobster` items — particularly the dead-letter queue and session-store bounding — would resolve multiple downstream issues (large DBs, startup instability) at once.

---
*Digest generated from GitHub activity data for 2026-11-11. Metrics reflect a 24-hour window ending 2026-11-11.*

---

## Cross-Ecosystem Comparison

# Cross-Project Comparison Report
**AI Agent & Personal AI Assistant Open-Source Ecosystem**
*Data window: 2026-11-11 (24-hour snapshot)*

---

## 1. Ecosystem Overview

The personal AI assistant / agent open-source landscape on 2026-11-11 is characterized by **high throughput but concentrated fragility**: the four active projects in this sample (OpenClaw, Hermes Agent, QwenPaw, ZeroClaw) collectively touched **362 issues and 638 PRs** in a single 24-hour window, yet nearly every project reports P0/P1 stability gaps and a maintainer-review bottleneck. Development is dominated by **session-state integrity, memory/dreaming correctness, update/migration safety, and provider-compatibility friction** — not new feature surface. A second structural pattern is the emergence of **plugin/skill ecosystems** (Hermes' Plugin Hackathon, QwenPaw's plugin extraction, OpenClaw's MemoryPluginCapability) as the primary growth vector, while **IronClaw is dormant** (zero activity), underscoring that this ecosystem has a long tail of stalled projects alongside high-velocity leaders. Community sentiment across the board is *engaged but anxious*: users are investing heavily in debugging core reliability rather than requesting features. The market is bifurcating between **large generalist platforms** (OpenClaw, Hermes) and **regional/channel-specialized assistants** (QwenPaw, ZeroClaw).

---

## 2. Activity Comparison

| Project | Issues (24h) | PRs (24h) | Release Status | Health Score | Notes |
|---|---|---|---|---|---|
| **OpenClaw** | 281 (191 open / 90 closed) | 500 (342 open / 158 merged-closed) | ✅ 2 releases: `v2026.11.3` (current) + `v2026.9.37` (backport, retired line) | **7.5 / 10** | Highest raw velocity; multi-track releases; triage bottleneck (`needs-product-decision`) |
| **Hermes Agent** | 50 (45 open / 5 closed) | 50 (45 open / 5 closed) | ✅ `v0.23.1` (618-PR rollup, no itemized changelog) | **6.0 / 10** | Hackathon-driven PR flood; core stability strained by v0.23.0 gateway migration |
| **QwenPaw** | 14 (9 open / 5 closed) | 38 (20 open / 18 merged-closed) | ✅ `v2.3.0-beta.4` (beta patch) | **7.0 / 10** | Pre-GA stabilization; fast closure turnaround; 2.3.0 regressions open |
| **ZeroClaw** | 17 (5 open / 12 closed) | 50 (41 open / 9 merged-closed) | ⏳ No release; `v0.9.0` version-bump PR open | **7.0 / 10** | Strong same-day fix rate; XL PR review backlog; bus-factor risk |
| **IronClaw** | 0 | 0 | — | **Dormant** | No activity in 24h |

**Scoring rubric (composite):** merge/close velocity, P0/P1 open count, release cadence, backlog age, reviewer bandwidth. IronClaw excluded from aggregate analysis.

**Aggregate:** ~362 issues, ~638 PRs, 4 releases/version-prep events, **2 projects with P0 data-loss or release-blocker class bugs open with no fix PR** (OpenClaw, Hermes).

---

## 3. OpenClaw's Position

### Advantages vs Peers
- **Scale dominance.** OpenClaw's 500 PRs/day is **10× Hermes** and **~13× QwenPaw**; its 158 merges/day exceed the *total* PR volume of any peer project. It is the ecosystem's de facto reference implementation.
- **Multi-track release engineering.** Only OpenClaw maintains a concurrent `extended-stable` backport line (v2026.9.37) alongside a current line — a maturity signal no peer demonstrates.
- **Breadth of subsystem ownership.** OpenClaw is the only project simultaneously addressing memory/dreaming, sandbox performance, identity/security (`openclaw id rebind`), update infrastructure, and mobile (Android location). Peers are narrower.

### Technical Approach Differences
- **Heavyweight, stateful core.** OpenClaw's architecture is a full agent runtime with a persistent SQLite-backed store, dreaming/recall subsystem, and gateway — the source of both its power and its biggest pain (3.5 GB DBs, `commit checkpoint expired`, startup gambles). Peers lean lighter or channel-scoped.
- **Plugin capability surface via typed interfaces** (`MemoryPluginCapability`, `dreaming` provider) — a more formalized extension model than Hermes' catalog-only approach.
- **Explicit update/migration machinery** — which is also its loudest failure mode (retired `agents.defaults.heartbeat` key blocking upgrades).

### Community Size Comparison
- **Contributor pipeline:** OpenClaw's PR flood includes large volumes of `roboclaw-bot` and community PRs, indicating the deepest contributor base by an order of magnitude.
- **Comment engagement:** Top threads at 27, 26, 18 comments vs Hermes' 60 (single-thread outlier) and ZeroClaw's 16. OpenClaw's engagement is **broad and distributed**; Hermes' is **concentrated in crisis threads**.
- **Backlog age:** OpenClaw carries the oldest unresolved high-value items (dead-letter queue since 2026-07-21; fallback-notice leak since 2026-06-12) — a **scale tax** on its size advantage.

**Verdict:** OpenClaw is the ecosystem's **center of gravity** but exhibits the classic large-project pathology — triage and product-decision throughput lag engineering velocity.

---

## 4. Shared Technical Focus Areas

The following requirements emerge across **multiple** projects, indicating ecosystem-level (not project-specific) gaps:

| Cross-Cutting Need | Projects | Specific Manifestations |
|---|---|---|
| **Observability of agent internal state** | OpenClaw, Hermes, QwenPaw | OpenClaw: silent recall failure (#138561), phantom prompts (#151962). Hermes: log loss under multiplexing (#141958). QwenPaw: silent QQ drops (#8651), silent flag resets (#8406). |
| **Update / migration safety** | OpenClaw, Hermes | OpenClaw: upgrades refused on retired keys (#193157), wrong-version npm updates (#144739). Hermes: **P0 data-loss on Windows** (#147938), update-abort cluster (#132820), restart loops (#142281). |
| **Session-state integrity** | OpenClaw, Hermes, ZeroClaw | Duplicate turns (#123792), stuck "busy" states (#131740), session-store unbounded growth (#112638, #12362). |
| **Provider/model compatibility friction** | All four active projects | OpenClaw: xAI 426, MiniMax 429 storms. Hermes: Codex zstd 400, Anthropic PNG 400. ZeroClaw: **hardcoded `temperature` 400s** (3 instances). QwenPaw: Aliyun thinking params, Mistral gaps. |
| **Least-privilege / multi-tenant access** | ZeroClaw, Hermes, OpenClaw | ZeroClaw: non-admin OIDC chat (#11984), scoped secrets (#12373). Hermes: path-scoped file access (#92424). OpenClaw: identity rebind (security surface). |
| **Trust model for "smart" automation** | Hermes, OpenClaw | Hermes: auto-approved `osascript` → PowerPoint data loss (#141346). OpenClaw: `message_tool_only` re-prompts with private text (#159230). |
| **Plugin/skill ecosystem formalization** | All four active projects | Hermes: Hackathon catalog flood. QwenPaw: agent-extraction to plugins (#8426), nested skills (#8178). OpenClaw: `MemoryPluginCapability`. ZeroClaw: Skill review fork. |

**Key insight:** Four of the seven cross-cutting needs are **correctness/safety**, not capability. The ecosystem's shared frontier is **making agents trustworthy and diagnosable**, not making them do more.

---

## 5. Differentiation Analysis

### Feature Focus
| Project | Primary Focus | Secondary Focus |
|---|---|---|
| **OpenClaw** | Full-stack agent runtime (memory/dreaming, sandbox, identity) | Update infra, mobile, security |
| **Hermes Agent** | Multi-platform gateway + plugin catalog | Voice, federation, desktop UX |
| **QwenPaw** | Regional channel integrations (QQ/Feishu/DingTalk) + **local model engines** | Skills, console polish, desktop packaging |
| **ZeroClaw** | Multi-tenant gateway + sign-in/credentials + Rust channel breadth | Messaging protocols (XMPP, SimpleX), docs infra |

### Target Users
- **OpenClaw:** Power users / self-hosters running general-purpose agents; the "reference platform" audience.
- **Hermes Agent:** Ecosystem builders and multi-device users; plugin developers via Hackathon.
- **QwenPaw:** Chinese-market and enterprise users; local-inference enthusiasts; Docker/remote deployers.
- **ZeroClaw:** Operators seeking least-privilege, multi-tenant deployments; Rust-native, messaging-protocol breadth.

### Technical Architecture
- **OpenClaw — heavy stateful monolith + typed plugin interfaces.** Persistent DB, dreaming subsystem, formal capability traits.
- **Hermes — unified single-process gateway** (the v0.23.0 migration collapsed all surfaces into one process) → **concentrated failure domains**, the root of today's crisis threads.
- **QwenPaw — channel-plugin runtime with packaged desktop builds**; moving toward plugin-extracted agent core + first-class local inference (llama.cpp, MLX).
- **ZeroClaw — Rust-native, workspace-modular** (33 packages), heavy investment in gateway/relay (zerorelay), OIDC, and protocol channels.

**Differentiation takeaway:** Architecture choices *predict* failure modes. Hermes' single-process consolidation produced lifecycle/data-loss bugs; OpenClaw's heavyweight store produced scale/startup bugs; ZeroClaw's Rust modularity produced a large-PR review bottleneck rather than runtime failures.

---

## 6. Community Momentum & Maturity

### Activity Tiers

**Tier 1 — Ecosystem Leader (rapid iteration, scale strain):**
- **OpenClaw** — 781 combined items/day. Iterating fastest on breadth; *stabilizing* on memory/dreaming (fix PRs in flight) but *straining* on backlog closure and product decisions.

**Tier 2 — High-Velocity, Stabilization Phase:**
- **Hermes Agent** — Ecosystem growth via Hackathon is *accelerating*; core is in **regression-recovery mode** post-v0.23.0. v0.24.0 predicted as a stabilization release.
- **ZeroClaw** — **Pre-release sprint** toward v0.9.0. Best same-day fix rate in the sample (12 issues closed); primary risk is XL-PR review bandwidth, not code quality.
- **QwenPaw** — **Beta stabilization** for 2.3.0 GA. Fast closure turnaround; regressions clustered in the beta channel/desktop subsystem.

**Tier 3 — Dormant:**
- **IronClaw** — zero activity; treat as inactive in ecosystem planning.

### Maturity Signals
| Signal | Most Mature | Least Mature |
|---|---|---|
| Multi-track releases | OpenClaw | ZeroClaw (pre-1.0) |
| Same-day fix closure | ZeroClaw, QwenPaw | OpenClaw (backlog-bound) |
| Changelog discipline | — | Hermes (618-PR rollup, no itemized notes) |
| Contributor breadth | OpenClaw | ZeroClaw (bus-factor risk) |
| Reviewer bandwidth | QwenPaw | ZeroClaw, Hermes |

**Momentum verdict:** The ecosystem is **expanding (Hermes plugins), stabilizing (ZeroClaw v0.9.0, QwenPaw GA), and consolidating (OpenClaw)** simultaneously — a healthy but uneven maturation profile.

---

## 7. Trend Signals

### Extracted Industry Trends

1. **Reliability is the new feature war.** Across all four projects, the top community threads are **safety, trust, and lifecycle** issues — not feature gaps. Hermes' #1 thread (60 comments) and #2 thread (39 comments, data loss) are both reliability. **Implication:** competitive differentiation is shifting from capability to *trustworthiness*.

2. **Update/migration is the ecosystem's weakest link.** Two projects report data-loss-class update bugs (Hermes P0, OpenClaw migration blocks). Self-hosted agents make update reliability **existential** for adoption. **Implication:** invest in transactional, rollback-safe update paths; treat migration as a first-class subsystem.

3. **Provider-portability is unsolved.** Hardcoded inference params (`temperature`), header leakage (OpenClaw's xAI 426), and missing reasoning fields (ZeroClaw/Reflection AI) recur across every project. **Implication:** a standardized provider-capability negotiation layer is a ripe ecosystem-level opportunity.

4. **Plugin/skill ecosystems are the growth engine.** Hermes' Hackathon flood, QwenPaw's plugin extraction, and OpenClaw's typed capabilities all point the same direction. **Implication:** extension architecture is now a primary adoption lever; catalog governance (version pinning, `requires_hermes`) is the emerging operational need.

5. **Silent failure is more corrosive than loud failure.** "Stopped working without a log signal" appears in every project's feedback. **Implication:** info-level telemetry for memory recall, config changes, and channel state is a baseline expectation, not a nice-to-have.

6. **Least-privilege / multi-tenant is the maturity inflection.** ZeroClaw (non-admin OIDC), Hermes (path-scoped access), and OpenClaw (identity rebind) all converge on scoped permissions. **Implication:** single-operator assumptions are aging out; scoped credentials and role separation are table stakes for production deployments.

7. **Local inference is rising as a first-class concern.** QwenPaw's llama.cpp/MLX push is the clearest signal, with ZeroClaw's Rust-native ethos and OpenClaw's sandbox work adjacent. **Implication:** managed local model runtimes are becoming a differentiator, not an afterthought.

8. **Maintainer bandwidth, not engineering capacity, is the binding constraint.** OpenClaw's `needs-product-decision` queue, ZeroClaw's XL-PR backlog, and Hermes' unclosed P0s all point to **triage/review throughput** as the ecosystem's scarcest resource. **Implication:** tools that accelerate review (automated triage, decision templates, contributor-run CI) have ecosystem-level value.

### Value for AI Agent Developers
- **Build for diagnosability first:** structured, info-level logs for every state transition (memory, config, session) before adding capability.
- **Treat updates as distributed-systems problems:** transactional migrations, versioned schemas, and rollback paths.
- **Abstract provider quirks:** negotiate capabilities rather than hardcoding params — the `temperature`-400 class of bug is entirely preventable.
- **Design for scoped trust from day one:** multi-profile, least-privilege, and write-only secret patterns are converging requirements.
- **Invest in extension surfaces early:** plugin/skill catalogs are now the primary community-growth mechanism and require version-compatibility governance.
- **Watch the review bottleneck:** if contributing, prefer smaller, well-scoped PRs — the ecosystem's XL-PR backlog is where contributions stall.

---

*Report synthesized from 2026-11-11 GitHub activity digests across OpenClaw, Hermes Agent, IronClaw, QwenPaw, and ZeroClaw. Metrics reflect a 24-hour window; health scores are analyst composites, not project-published values.*

---

## Peer Project Reports

<details>
<summary><strong>Hermes Agent</strong> — <a href="https://github.com/nousresearch/hermes-agent">nousresearch/hermes-agent</a></summary>

# Hermes Agent — Project Digest
**Date:** 2026-11-11 · **Repository:** [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent)

---

## 1. Today's Overview

Hermes Agent shows a **very high-velocity, community-driven development cycle**: 50 issues and 50 PRs were touched in the last 24h, with a clear bias toward open work (45 open vs. 5 closed on each side). The dominant activity driver is the **Hermes Agent Plugin Hackathon**, which is flooding the PR queue with `plugin-catalog` entries (at least 10 of the top 20 PRs), while core engineering bandwidth is being consumed by **regressions from the v0.23.0 "unified gateway" migration** (#106742). Stability signals are mixed-to-concerning: multiple P0/P1 bugs remain open around session state, updater data loss, and gateway lifecycle, and several of today's closed items are *stale* fixes rather than fresh wins. Overall project health is **strong in ecosystem growth, strained in core stability**.

---

## 2. Releases

### v0.23.1 — Patch Release ([release](https://github.com/NousResearch/hermes-agent/releases))
- **Released:** November 9, 2026 (rolling into today's window)
- **Scope:** Rollup of **~618 PRs** merged since v0.23.0, packaged as a stable tag for:
  - GitHub release (CLI + installers)
  - Microsoft Store app
  - Docker
  - Hermes Cloud
- **Breaking changes:** None explicitly declared in the release note.
- **Migration notes:** The release explicitly defers curated notes to **v0.24.0** ("Full curated notes for this window ship with v0.24.0"). Users on v0.23.0 should treat this as a consolidation tag; the absence of a detailed changelog is itself a signal that the v0.23.x line carried substantial unannounced churn.
- **Caveat:** Because v0.23.1 packages 618 PRs with no itemized changelog, regressions surfacing in today's issues (see §5) cannot be reliably bisected to a specific change.

---

## 3. Project Progress

Today's **closed/merged items (5 PRs, 5 issues)** are a mix of catalog maintenance and long-tail bug resolution:

| Item | Type | What it delivered |
|---|---|---|
| [#152205](https://github.com/NousResearch/hermes-agent/pull/152205) | PR (CLOSED) | Added **Tallyhand** — Twitch chat platform plugin with code-enforced role gating and untrusted-input handling |
| [#151709](https://github.com/NousResearch/hermes-agent/pull/151709) | PR (CLOSED) | Added **pit-crew 0.2.0** catalog entry (`requires_hermes: >=0.23.0`) |
| [#151315](https://github.com/NousResearch/hermes-agent/pull/151315) | PR (CLOSED) | Bumped **calling-mom** catalog entry 1.3.2 → 1.7.1 |
| [#150358](https://github.com/NousResearch/hermes-agent/pull/150358) | PR (CLOSED) | Added **Hermagotchi v0.1.3** (8 composable tools) |
| [#125695](https://github.com/NousResearch/hermes-agent/issues/125695) | Issue (CLOSED) | **Fixed:** Codex `model_entitlement` cooldown no longer disables smart approvals / vision / titles for a year |
| [#146067](https://github.com/NousResearch/hermes-agent/issues/146067) | Issue (CLOSED) | **Fixed:** Telegram multi-paragraph `rich_message` blocks no longer silently dropped |
| [#49536](https://github.com/NousResearch/hermes-agent/issues/49536) | Issue (CLOSED) | **Fixed:** Telegram finalize text overlap from `parse_mode` mutation |

**Net read:** The *merged* work is overwhelmingly **ecosystem/catalog** and **platform-adapter bug fixes**. No major core feature (federation, voice, path-scoped access) landed today. The closed issues are welcome but skew toward older reports (#49536 dates to June), indicating a **long issue tail** rather than fast triage.

---

## 4. Community Hot Topics

Ranked by comment volume — these are where the community's energy is concentrated:

1. **[#143547](https://github.com/NousResearch/hermes-agent/issues/143547) — 60 comments** · *Unified gateway post-merge problems*
   The single hottest thread. #106742 collapsed every local conversation (CLI, TUI, Desktop, API, editors, bots, cron, Kanban, Group Chats) into **one gateway process**. The fallout is broad and still uncontained.
   **Underlying need:** Users need the gateway to be **observable and recoverable** — right now a single-process architecture concentrates failure domains.

2. **[#141346](https://github.com/NousResearch/hermes-agent/issues/141346) — 39 comments** · *Smart approval auto-approved `osascript` → unrecoverable PowerPoint data loss*
   **Underlying need:** A trust/safety model for `approvals.mode: smart` that distinguishes "read-only automation" from "commands that mutate or delete user documents." This is the highest-emotional-intensity thread in the dataset.

3. **[#147938](https://github.com/NousResearch/hermes-agent/issues/147938) — 13 comments** · *Windows `state.db` verify mistakes live lock for corruption*
   **Underlying need:** Safe updater semantics — never destroy healthy data to "fix" a false positive.

4. **[#137838](https://github.com/NousResearch/hermes-agent/issues/137838) — 11 comments** · *macOS gateway exit-75 loop, root cause unconfirmed*
   Note the author **withdrew** their original root-cause claim after review — a sign the community is self-correcting but also that diagnosis is genuinely hard here.

5. **[#20765](https://github.com/NousResearch/hermes-agent/issues/20765) — 10 comments, 👍6** · *Voice mode in browser dashboard (WebRTC)*
   The **most-reacted open feature request** (👍6). Remote/SSH users want mic access via the dashboard rather than the TUI.

**Analysis:** The top three threads are all **safety/trust/lifecycle** issues, not feature gaps. Community sentiment is best described as *engaged but anxious* — users are investing heavily in debugging core reliability.

---

## 5. Bugs & Stability

Ranked by severity:

### 🔴 P0 / Critical
- **[#147938](https://github.com/NousResearch/hermes-agent/issues/147938)** — *Windows updater auto-restores months-stale `state.db` snapshot over healthy data, then misreports success.* **Data-loss class.** No linked fix PR visible. **Needs immediate maintainer attention.**

### 🟠 P1 / High
- **[#132820](https://github.com/NousResearch/hermes-agent/issues/132820)** — *Matrix E2EE (`python-olm`/`libolm`) native build aborts all `hermes update` on Linux; no opt-out; macOS silently drops mautrix.* Pain cluster, 7 reports this week.
- **[#142281](https://github.com/NousResearch/hermes-agent/issues/142281)** — *Gateway dashboard auth refusal exits 1 instead of 78 → systemd restart loop.*
- **[#131740](https://github.com/NousResearch/hermes-agent/issues/131740)** — *Desktop turn-finalization bookend lost; sessions stuck "busy," Stop/queue ineffective.* Session-state integrity.

### 🟡 P2 / Moderate (selected)
- **[#137838](https://github.com/NousResearch/hermes-agent/issues/137838)** — macOS gateway exit-75 loop.
- **[#141958](https://github.com/NousResearch/hermes-agent/issues/141958)** — Gateway stops writing all logs once multiplexing is enabled. **Observability loss.**
- **[#151727](https://github.com/NousResearch/hermes-agent/issues/151727)** — `profiles.list` re-sorts entire sessions table on every 5s poll → Bots roster timeout.
- **[#148898](https://github.com/NousResearch/hermes-agent/issues/148898)** — Codex backend HTTP 400 on zstd-compressed `/responses` bodies (regression from #136916).
- **[#152557](https://github.com/NousResearch/hermes-agent/issues/152557)** — `write_file` blocked 458s and idle-reaped mid-call (GW-60 residual).
- **[#139253](https://github.com/NousResearch/hermes-agent/issues/139253)** — `browser_exec` hardcodes `image/png` → Anthropic 400 kills turn.

### 🔒 Security
- **[#132192](https://github.com/NousResearch/hermes-agent/issues/132192)** — `skills_guard` threat scanner bypassed by a single invalid UTF-8 byte; docstring miscount hides payload. **High severity.**
- **[#141346](https://github.com/NousResearch/hermes-agent/issues/141346)** — Smart-approval `osascript` incident (also a safety bug).

**Fix-PR status:** Notably, **none of the P0/P1 issues above have a linked fix PR in today's dataset.** The only directly-matched fix PR is [#153028](https://github.com/NousResearch/hermes-agent/pull/153028) (Linux tray recovery after GNOME lock, addressing [#145282](https://github.com/NousResearch/hermes-agent/issues/145282)).

---

## 6. Feature Requests & Roadmap Signals

| Feature | Issue | Signal Strength | Likely in v0.24.0? |
|---|---|---|---|
| **Path-scoped file access per profile** | [#92424](https://github.com/NousResearch/hermes-agent/issues/92424) | P3, `needs-decision`, multi-profile use case | ⚠️ Uncertain — blocked on design decision |
| **Browser-dashboard voice mode (WebRTC)** | [#20765](https://github.com/NousResearch/hermes-agent/issues/20765) | 👍6, 10 comments | 🟡 Possible if remote-user demand holds |
| **Per-key config origins (`hermes config get --origin`)** | [#95638](https://github.com/NousResearch/hermes-agent/pull/95638) | Open PR since Aug 26 | 🟡 Long-running, `risk-compatibility` |
| **P2P federation heartbeat (`hermes peer`)** | [#76661](https://github.com/NousResearch/hermes-agent/pull/76661) | Open PR since Aug 2 | 🔴 Stalled; multi-device relay |
| **Global TTS playback arbitration** | [#85793](https://github.com/NousResearch/hermes-agent/pull/85793) | Fixes audio-stacking (叠音) | 🟡 |

**Prediction:** v0.24.0 is most likely to be a **stabilization release** — the 618-PR rollup in v0.23.1 plus the open P0/P1 backlog suggests the team will prioritize gateway/updater/session-state reliability over new surface area. The Plugin Hackathon catalog entries will land in the ecosystem, but core roadmap items (#92424, #20765) look unlikely to ship without a design decision first.

---

## 7. User Feedback Summary

**Pain points (real user reports):**
- **Trust erosion around "smart" automation.** The PowerPoint data-loss incident ([#141346](https://github.com/NousResearch/hermes-agent/issues/141346)) is the most visceral: a user lost unsaved work to an auto-approved `osascript`. This directly undermines the value proposition of smart approvals.
- **Updater fear.** Users are actively wary of `hermes update` — three separate issues ([#147938](https://github.com/NousResearch/hermes-agent/issues/147938), [#132820](https://github.com/NousResearch/hermes-agent/issues/132820), [#142281](https://github.com/NousResearch/hermes-agent/issues/142281)) describe updates that either destroy data, abort entirely, or trigger restart loops. **The update path is the project's weakest link.**
- **Observability regressions.** [#141958](https://github.com/NousResearch/hermes-agent/issues/141958) (silent log loss under multiplexing) and [#137838](https://github.com/NousResearch/hermes-agent/issues/137838) (unconfirmed root cause) show users struggling to *see* what the agent is doing.
- **Session/UI desync.** Desktop users report stuck "busy" states, inaccessible Stop controls ([#149660](https://github.com/NousResearch/hermes-agent/issues/149660)), missing queued-prompt controls ([#148846](https://github.com/NousResearch/hermes-agent/issues/148846)), and tab-replacement bugs ([#148318](https://github.com/NousResearch/hermes-agent/issues/148318)).

**Positive signals:**
- **Ecosystem enthusiasm is high.** The Plugin Hackathon is generating a steady stream of owner-submitted catalog PRs (Stoa, Launch Desk, Shorguard, Ultimate Dashboard, ceo-pack, imagination-studio, whiteboard, xscapes, parallax, home-3d-workshop, ninsei, parallax). This is a **healthy, growing plugin community**.
- Users are filing **detailed, well-reproduced reports** (e.g., #132192's two independent scanner bypasses) — a sign of sophisticated, committed users rather than drive-by complaints.

**Satisfaction/dissatisfaction:** Dissatisfaction is concentrated on **core reliability and data safety**; satisfaction is concentrated on **extensibility and the plugin story**.

---

## 8. Backlog Watch

Items needing maintainer attention — long-open and high-impact:

1. **[#76661](https://github.com/NousResearch/hermes-agent/pull/76661)** — *P2P federation heartbeat.* Open since **August 2** (100+ days). Multi-device relay is "best-effort, drop-prone" without it. Flagged `risk-message-delivery`, `risk-compatibility`, `blast-moderate`. **Aging PR, high blast radius.**

2. **[#95638](https://github.com/NousResearch/hermes-agent/pull/95638)** — *Per-key config origins.* Open since **August 26**. Adds critical debuggability to config layering (`DEFAULT → user → managed → env`). Flagged `risk-compatibility`.

3. **[#92424](https://github.com/NousResearch/hermes-agent/issues/92424)** — *Path-scoped file access for profiles.* Open since **August 22**, tagged `needs-decision`. A multi-profile safety feature with a clear low-trust-agent use case. **Blocked on a product decision, not engineering.**

4. **[#85793](https://github.com/NousResearch/hermes-agent/pull/85793)** — *Global TTS playback arbitration.* Open since **August 14**. Fixes a concrete user-visible bug (concurrent `afplay` stacking).

5. **[#132820](https://github.com/NousResearch/hermes-agent/issues/132820)** — *Matrix E2EE update-abort cluster.* P1, 7 reports this week, **no opt-out path**. Should be treated as a release blocker for Linux Matrix users.

6. **[#147938](https://github.com/NousResearch/hermes-agent/issues/147938)** — *Windows `state.db` data-loss bug.* **P0, no fix PR.** The single most urgent item in the backlog.

**Recommendation:** Prioritize (a) the P0 Windows updater data-loss bug, (b) the Matrix update-abort cluster, and (c) unblocking the three long-stalled PRs (#76661, #95638, #85793) — either by merging, requesting changes, or explicitly closing with rationale. Their age is beginning to signal maintainer bandwidth limits.

---

*Digest generated from GitHub activity on 2026-11-11. Comment counts, reactions, and PR statuses reflect the snapshot provided.*

</details>

<details>
<summary><strong>IronClaw</strong> — <a href="https://github.com/nearai/ironclaw">nearai/ironclaw</a></summary>

No activity in the last 24 hours.

</details>

<details>
<summary><strong>QwenPaw</strong> — <a href="https://github.com/agentscope-ai/QwenPaw">agentscope-ai/QwenPaw</a></summary>

# QwenPaw Project Digest — 2026-11-11

## 1. Today's Overview

QwenPaw shows **very high activity** in the last 24 hours: 14 issues updated (9 open, 5 closed), 38 PRs updated (20 open, 18 merged/closed), and one new beta release (v2.3.0-beta.4). The project is in an active pre-release stabilization phase for the 2.3.0 line, with a heavy focus on channel/plugin runtime reliability, desktop packaging issues, and console polish. Community engagement is strong — bug reports are detailed and well-instrumented, and fixes are landing quickly (several issues closed within 24 hours of the beta release). The main risk area is the 2.3.0 beta channel/plugin subsystem, where multiple regression reports (attachment paths, channel startup races, desktop identity validation) are clustered.

---

## 2. Releases

### v2.3.0-beta.4 (Beta)
🔗 https://github.com/agentscope-ai/QwenPaw/releases/tag/v2.3.0-beta.4

**What's Changed:**
- `fix(channels)`: preserve plugin dependencies across updates and fix channel startup — [PR #8653](https://github.com/agentscope-ai/QwenPaw/pull/8653)
- `fix(plugins)`: recover interrupted additive dependency installations — [PR #8659](https://github.com/agentscope-ai/QwenPaw/pull/8659)

**Context / Migration Notes:**
- This is a **beta patch** on the 2.3.0 line, primarily addressing desktop plugin runtime identity validation (`WORKER_START_FAILED`) and interrupted dependency install recovery.
- No explicit breaking changes documented. However, users on 2.3.0-beta.1 through beta.3 should note that **known regressions persist** (see Bugs & Stability below), including the attachment path truncation bug (#8655) which is **not yet fixed in beta.4**.
- A release-duty verification issue is open: [#8667](https://github.com/agentscope-ai/QwenPaw/issues/8667) (deadline 2026-11-10 18:47 UTC).
- Version bump PRs observed: [#8666](https://github.com/agentscope-ai/QwenPaw/pull/8666) (2.3.0) and [#8665](https://github.com/agentscope-ai/QwenPaw/pull/8665) (2.3.0b4, closed).

---

## 3. Project Progress

**Merged/Closed PRs today (18 total; highlights):**

| PR | Title | Impact |
|---|---|---|
| [#8653](https://github.com/agentscope-ai/QwenPaw/pull/8653) | fix(channels): preserve plugin dependencies across updates and fix channel startup | Fixes desktop channel worker `WORKER_START_FAILED` (addresses #8644) |
| [#8659](https://github.com/agentscope-ai/QwenPaw/pull/8659) | fix(plugins): recover interrupted additive dependency installations | Prevents startup blockage after failed plugin verification |
| [#8664](https://github.com/agentscope-ai/QwenPaw/pull/8664) | feat(community): support remote password login with saved credentials | Enables remote Docker deployments without local callback auth |
| [#8319](https://github.com/agentscope-ai/QwenPaw/pull/8319) | fix(qq): handle GROUP_MESSAGE_CREATE gateway events | Fixes dropped QQ group messages (#8313) |
| [#8665](https://github.com/agentscope-ai/QwenPaw/pull/8665) | chore: bump version to 2.3.0b4 | Release prep |

**Features advanced:**
- **Local model engine controls** — stacked PRs [#8649](https://github.com/agentscope-ai/QwenPaw/pull/8649) (llama.cpp GPU + auto-update), [#8647](https://github.com/agentscope-ai/QwenPaw/pull/8647) (managed MLX), and [#8648](https://github.com/agentscope-ai/QwenPaw/pull/8648) (console UI) are progressing, signaling a major push toward first-class local inference support.
- **Skills system expansion** — nested/categorized skill directories ([#8178](https://github.com/agentscope-ai/QwenPaw/pull/8178)), staged pool skill rename optimization ([#8477](https://github.com/agentscope-ai/QwenPaw/pull/8477)), and Office skills sync ([#8479](https://github.com/agentscope-ai/QwenPaw/pull/8479)).
- **Console UX** — idle compositor/streaming render performance ([#8668](https://github.com/agentscope-ai/QwenPaw/pull/8668)), intent titles on shell command cards ([#8638](https://github.com/agentscope-ai/QwenPaw/pull/8638)), and workspace file download fix ([#8662](https://github.com/agentscope-ai/QwenPaw/pull/8662)).

---

## 4. Community Hot Topics

**Most active issues (by comments):**

1. **[#8651](https://github.com/agentscope-ai/QwenPaw/issues/8651)** — *QQ channel silently drops image-only C2C messages* (4 comments, CLOSED)
   - **Underlying need:** Users rely on QQ as a primary channel; silent message drops erode trust. The rapid closure suggests maintainers are responsive to channel-level data loss.

2. **[#7990](https://github.com/agentscope-ai/QwenPaw/issues/7990)** — *Model catalog missing `thinking_param_style` for Aliyun Token Plan models* (4 comments, OPEN since 2026-09-25)
   - **Underlying need:** Users want full reasoning/thinking controls for enterprise Aliyun endpoints. This has been open ~7 weeks — a signal that catalog governance for regional/enterprise providers lags.

3. **[#8406](https://github.com/agentscope-ai/QwenPaw/issues/8406)** — *QQ channel enabled flag silently reset to false* (3 comments, CLOSED)
   - **Underlying need:** Configuration state integrity. Silent resets without warnings are a recurring theme in channel management.

4. **[#8669](https://github.com/agentscope-ai/QwenPaw/issues/8669)** — *Channel plugin startup race: `_wait_connected` treats initial `disconnected` as fatal* (2 comments, OPEN)
   - **Underlying need:** Deterministic startup for packaged desktop builds; the Feishu channel fails on every start in 2.3.0b4 Windows builds.

**Most notable PRs (high impact):**
- [#8426](https://github.com/agentscope-ai/QwenPaw/pull/8426) — *feat(agent): extract third-party agent into plugins* (size/XXXL) — architectural refactor toward plugin modularity.
- [#8178](https://github.com/agentscope-ai/QwenPaw/pull/8178) — *feat(skills): support nested skill directories* (size/XXL, first-time contributor).

---

## 5. Bugs & Stability

**Ranked by severity:**

| Severity | Issue | Status | Fix PR? |
|---|---|---|---|
| 🔴 **High** | [#8655](https://github.com/agentscope-ai/QwenPaw/issues/8655) — Attachment path truncated to drive root (`C:\`) since 2.3.0-beta.1; images fail to load | OPEN, reproduces on beta.3 | ❌ No fix PR yet |
| 🔴 **High** | [#8669](https://github.com/agentscope-ai/QwenPaw/issues/8669) — Feishu channel fails on every start in packaged Windows desktop build (2.3.0b4) | OPEN | Partial (related to #8653/#8644) |
| 🟠 **Medium** | [#8644](https://github.com/agentscope-ai/QwenPaw/issues/8644) — Channel plugins never activate on packaged Desktop builds (`AttributeError` → `WORKER_START_FAILED`) | CLOSED | ✅ [#8653](https://github.com/agentscope-ai/QwenPaw/pull/8653) |
| 🟠 **Medium** | [#8652](https://github.com/agentscope-ai/QwenPaw/issues/8652) — Mission task dispatcher uses old model after model switch | OPEN | ❌ |
| 🟡 **Low-Med** | [#8661](https://github.com/agentscope-ai/QwenPaw/issues/8661) — `/workspace/` download links open SPA HTML instead of downloading | OPEN | ✅ [#8662](https://github.com/agentscope-ai/QwenPaw/pull/8662) |
| 🟡 **Low-Med** | [#8663](https://github.com/agentscope-ai/QwenPaw/issues/8663) — Safari: message-queue action buttons not rendered | OPEN | ❌ |
| 🟡 **Low** | [#8406](https://github.com/agentscope-ai/QwenPaw/issues/8406) — QQ channel enabled flag silently reset | CLOSED | — |
| 🟡 **Low** | [#8651](https://github.com/agentscope-ai/QwenPaw/issues/8651) — QQ drops image-only C2C messages | CLOSED | — |

**Key concern:** The 2.3.0 beta line has introduced **at least two regressions** (attachment path truncation, channel startup race) that are not fully resolved in beta.4. Users on packaged desktop builds are disproportionately affected.

---

## 6. Feature Requests & Roadmap Signals

**Active feature requests:**

1. **[#7990](https://github.com/agentscope-ai/QwenPaw/issues/7990)** — Declare `thinking_param_style` for Aliyun Token Plan models in the model catalog. *Likely a quick catalog-data fix; strong candidate for 2.3.0 GA or a follow-up patch.*

2. **[#8656](https://github.com/agentscope-ai/QwenPaw/issues/8656)** — Request to include a **Mistral provider plugin** (OpenAI-compatible endpoint with reasoning + prompt caching). *Signals demand for broader provider coverage; could land as a community plugin listing rather than core.*

3. **[#8650](https://github.com/agentscope-ai/QwenPaw/issues/8650)** — Visual consistency between thinking blocks and tool cards (left-edge jumping in step lists). *Console polish; likely addressed in an upcoming UI iteration.*

**Roadmap signals from in-flight PRs:**
- **Local model management** (llama.cpp GPU, MLX, auto-update) — a coherent feature trio ([#8649](https://github.com/agentscope-ai/QwenPaw/pull/8649), [#8647](https://github.com/agentscope-ai/QwenPaw/pull/8647), [#8648](https://github.com/agentscope-ai/QwenPaw/pull/8648)) likely targeting the next minor release.
- **Plugin architecture extraction** ([#8426](https://github.com/agentscope-ai/QwenPaw/pull/8426)) — positions QwenPaw for a more modular, third-party-extensible agent core.
- **Nested skills directories** ([#8178](https://github.com/agentscope-ai/QwenPaw/pull/8178)) — aligns with cross-agent skill organization conventions.

**Prediction:** The next version after 2.3.0 GA will likely emphasize **local model engines** and **plugin ecosystem expansion**, with console UX refinements as a steady undercurrent.

---

## 7. User Feedback Summary

**Pain points (dissatisfaction):**
- **Silent failures** are a recurring frustration: QQ messages dropped without error (#8651), QQ channel flag reset without warning (#8406), attachment paths truncated without logging (#8655). Users consistently discover these only when downstream behavior breaks.
- **Packaged desktop builds** are fragile: channel plugins fail to activate (#8644), Feishu fails on every start (#8669). This undermines confidence in the desktop distribution channel.
- **Enterprise/regional provider support** lags: Aliyun Token Plan thinking controls hidden (#7990), TTS key incompatibility (#8534, closed), Mistral gaps (#8656).
- **Cross-browser UI inconsistency**: Safari-specific rendering failures (#8663).

**Positive signals (satisfaction):**
- Users are providing **high-quality, well-instrumented bug reports** (environment details, version pinning, reproduction steps) — indicating a technically engaged and invested community.
- **Fast closure turnaround** on several bugs (#8651, #8406, #8534) suggests responsive maintainership.
- Active **first-time contributors** ([#8178](https://github.com/agentscope-ai/QwenPaw/pull/8178), [#8601](https://github.com/agentscope-ai/QwenPaw/pull/8601), [#8479](https://github.com/agentscope-ai/QwenPaw/pull/8479), [#8662](https://github.com/agentscope-ai/QwenPaw/pull/8662)) — a healthy sign for project growth.

**Use cases observed:** QQ/Feishu/DingTalk channel integrations, remote Docker deployments, local model inference (Ollama, llama.cpp, MLX), Office document skills, and enterprise Aliyun endpoints.

---

## 8. Backlog Watch

**Long-unanswered or high-importance items needing maintainer attention:**

1. **[#7990](https://github.com/agentscope-ai/QwenPaw/issues/7990)** — *Aliyun Token Plan `thinking_param_style` missing* — **OPEN since 2026-09-25 (~47 days)**, 4 comments. Catalog data fix; low effort, high user impact for enterprise Aliyun users. Deserves a maintainer decision.

2. **[#8178](https://github.com/agentscope-ai/QwenPaw/pull/8178)** — *feat(skills): nested skill directories* — **OPEN since 2026-10-11 (~31 days)**, size/XXL, first-time contributor. Long review cycles on large first-time PRs risk contributor attrition.

3. **[#8234](https://github.com/agentscope-ai/QwenPaw/pull/8234)** — *fix(tools): decode GBK/CP936 in read/edit/grep* — **OPEN since 2026-10-14 (~28 days)**, size/XXL, Under Review. Important for Chinese Windows users; silent byte-dropping is a data-integrity issue.

4. **[#8236](https://github.com/agentscope-ai/QwenPaw/pull/8236)** — *fix(ollama): size context window from `num_ctx`* — **OPEN since 2026-10-14 (~28 days)**, size/XXL, Under Review. Affects local model users' context handling.

5. **[#8426](https://github.com/agentscope-ai/QwenPaw/pull/8426)** — *feat(agent): extract third-party agent into plugins* — **OPEN since 2026-10-26 (~16 days)**, size/XXXL. Architectural; needs careful review but is strategically important.

6. **[#8479](https://github.com/agentscope-ai/QwenPaw/pull/8479)** — *feat(skills): sync Office skills with Anthropic July 2026 update* — **OPEN since 2026-10-28 (~14 days)**, size/XXXL, first-time contributor.

**Recommendation:** Prioritize review bandwidth for the long-open XXL/XXXL PRs and the Aliyun catalog issue — these represent either data-integrity fixes or significant community contributions that benefit from timely maintainer feedback.

---

*Digest generated from GitHub activity data for 2026-11-11. All links point to github.com/agentscope-ai/QwenPaw.*

</details>

<details>
<summary><strong>ZeroClaw</strong> — <a href="https://github.com/zeroclaw-labs/zeroclaw">zeroclaw-labs/zeroclaw</a></summary>

# ZeroClaw Project Digest — 2026-11-11

## 1. Today's Overview

ZeroClaw shows **very high velocity** today: 17 issues and 50 PRs were touched in the last 24 hours, with 12 issues closed and 9 PRs merged/closed. The project is on the cusp of the **v0.9.0 release** — a version bump PR (#12377) was opened, and several bug fixes are explicitly tagged `release:v0.9.0`. Activity is heavily driven by a small number of prolific contributors (notably JordanTheJet), which is a health signal but also a potential bus-factor concern. Stability work dominates the day's merges, with a cluster of `temperature`-related and dashboard/zerocode fixes landing. No releases were cut today.

---

## 2. Releases

**No new releases today.**

However, prepare for **v0.9.0**: PR [#12377](https://github.com/zeroclaw-labs/zeroclaw/pull/12377) opens the coordinated workspace bump from 0.8.7 → 0.9.0 (Cargo.toml, 26 path deps, 33 workspace packages, Cargo.lock). Multiple issues/PRs carry the `release:v0.9.0` label, indicating a feature-and-fix bundle is being staged. Watch for migration notes once the release PR completes review.

---

## 3. Project Progress

**Merged/closed PRs today (9)** — notable:

- [#12317](https://github.com/zeroclaw-labs/zeroclaw/pull/12317) — **Pairing-free OIDC login and saved remote credentials** for `zerocode`. Significant UX win: clients can now `zerocode login <oidc-alias> <target>` without manual bearer-token juggling.
- [#12328](https://github.com/zeroclaw-labs/zeroclaw/pull/12328) — Docs stable URL now survives releases (version-less canonical URLs).
- [#12329](https://github.com/zeroclaw-labs/zeroclaw/pull/12329) — Root `404.html` routes pruned doc versions to the stable page.
- [#12327](https://github.com/zeroclaw-labs/zeroclaw/pull/12327) — Rustdoc API tree and per-locale 404 pages set `noindex` (SEO hygiene).
- [#12364](https://github.com/zeroclaw-labs/zeroclaw/pull/12364) / [#12370](https://github.com/zeroclaw-labs/zeroclaw/pull/12370) — Documentation for PKCE-on-every-device-grant and device-cert EOL / JWKS `azp` matching.
- [#12368](https://github.com/zeroclaw-labs/zeroclaw/pull/12368) — Stops hard-coding `temperature` in heartbeat decision and model-routing probe.

Corresponding closed issues [#12325](https://github.com/zeroclaw-labs/zeroclaw/issues/12325), [#12326](https://github.com/zeroclaw-labs/zeroclaw/issues/12326), [#12324](https://github.com/zeroclaw-labs/zeroclaw/issues/12324), [#12332](https://github.com/zeroclaw-labs/zeroclaw/issues/12332), [#12340](https://github.com/zeroclaw-labs/zeroclaw/issues/12340), [#12347](https://github.com/zeroclaw-labs/zeroclaw/issues/12347), [#12354](https://github.com/zeroclaw-labs/zeroclaw/issues/12354), [#12357](https://github.com/zeroclaw-labs/zeroclaw/issues/12357), [#12362](https://github.com/zeroclaw-labs/zeroclaw/issues/12362), [#11984](https://github.com/zeroclaw-labs/zeroclaw/issues/11984), [#12153](https://github.com/zeroclaw-labs/zeroclaw/issues/12153), [#12366](https://github.com/zeroclaw-labs/zeroclaw/issues/12366) all closed — a **broad sweep of docs, config, runtime, and zerocode bugs.**

---

## 4. Community Hot Topics

The comment counts were mostly unavailable in the dataset, but discussion is concentrated around two trackers:

- **[#7432](https://github.com/zeroclaw-labs/zeroclaw/issues/7432) — [Tracker]: Runtime, dashboard sign-in and gateway delivery** · 16 comments, open since **2026-06-09**. This is the **longest-running active tracker**, owning the remaining v0.9.0 runtime/gateway roadmap from RFC #5574. Its age (5 months) and 16-comment depth signal a complex, multi-stakeholder architecture effort.
- **[#11984](https://github.com/zeroclaw-labs/zeroclaw/issues/11984)** — Dashboard chat for non-admin OIDC users (closed today) — the user-facing counterpart to #7432's gateway work; its closure suggests meaningful progress on the sign-in→chat path.

**Underlying need:** The community is pushing ZeroClaw from a single-operator tool toward **multi-tenant, least-privilege deployments** — non-admin chat, scoped credentials, gateway delivery. This is a maturity inflection point for the project.

---

## 5. Bugs & Stability

Ranked by severity (today's reports/closures):

| Severity | Issue | Status | Notes |
|---|---|---|---|
| **S1 — workflow blocked** | [#12354](https://github.com/zeroclaw-labs/zeroclaw/issues/12354) — zerorelay doesn't flush TLS writes; dashboard assets hang until 300s idle timeout | **CLOSED** | Fix landed. High-impact relay regression. |
| **S2 — degraded** | [#12366](https://github.com/zeroclaw-labs/zeroclaw/issues/12366) — heartbeat phase-1 & routing probe hard-code `temperature 0.0`, rejected by some models | **CLOSED** (fix: [#12368](https://github.com/zeroclaw-labs/zeroclaw/pull/12368)) | Breaks API compatibility with Anthropic-style models. |
| **S2 — degraded** | [#12362](https://github.com/zeroclaw-labs/zeroclaw/issues/12362) — Skill review fork hard-codes `temperature: Some(0.3)` → HTTP 400 | **CLOSED** | Same class as #12366; reported against v0.8.7. |
| **S2 — degraded** | [#12357](https://github.com/zeroclaw-labs/zeroclaw/issues/12357) — `zerocode` exits 1 for limited accounts (config/logs panes treat refusal as fatal) | **CLOSED** | Directly blocks the non-admin use case from #11984. |
| **S2 — degraded** | [#12325](https://github.com/zeroclaw-labs/zeroclaw/issues/12325) — docs canonical URLs name release dir; every stable release moves all of them | **CLOSED** | SEO regression; fix #12328. |
| **S3 — minor** | [#12351](https://github.com/zeroclaw-labs/zeroclaw/issues/12351) — fallback test fails intermittently in CI | **OPEN** | Flaky test; not yet fixed — watch for CI noise. |
| **S3 — minor** | [#12353](https://github.com/zeroclaw-labs/zeroclaw/issues/12353)`*` / [#12153](https://github.com/zeroclaw-labs/zeroclaw/issues/12153) — install.sh picks musl build on glibc+musl-package hosts | **CLOSED** | Onboarding footgun, now resolved. |

`*` #12353 not in dataset; superseded by #12153 in the list.

**Theme:** A **systemic temperature-hardcoding bug class** (3 separate instances) was found and closed today — a good catch suggesting a codebase audit opportunity for other hard-coded inference params.

---

## 6. Feature Requests & Roadmap Signals

New features requested today (both open, no PRs yet):

- **[#12373](https://github.com/zeroclaw-labs/zeroclaw/issues/12373) — Write-only WebUI credential management & scoped secret references.** Operator-only secrets catalog (metadata-only listing, write-only create/replace, disable/delete, controlled references). Author explicitly asks for **scope/ownership discussion before implementation** — this is a security-sensitive design conversation.
- **[#12372](https://github.com/zeroclaw-labs/zeroclaw/issues/12372) — `draft_mode` for Git channel** (progress / placeholder / off). Reduces comment spam in PRs/MRs.

Larger features in flight (open PRs, likely **not** v0.9.0 given size/risk tags):

- [#11847](https://github.com/zeroclaw-labs/zeroclaw/pull/11847) — Native Rust XMPP with optional legacy OMEMO (XL, high-risk).
- [#12316](https://github.com/zeroclaw-labs/zeroclaw/pull/12316) — SimpleX messaging, voice notes, encrypted calls (XL).
- [#10407](https://github.com/zeroclaw-labs/zeroclaw/pull/10407) — Persistent session prompt attachments (XL, open since **Aug 27**).
- [#11869](https://github.com/zeroclaw-labs/zeroclaw/pull/11869) — Opt-in task-owned SSH transport reuse.

**Prediction:** v0.9.0 will ship the **runtime/gateway + sign-in/credentials + docs-URL stack** (already merged/queued) plus the temperature fixes. The channel-expansion PRs and session-attachment PR are candidates for **v0.10.0**.

---

## 7. User Feedback Summary

**Pain points surfaced today:**

- **Model compatibility friction:** Multiple users/providers hit HTTP 400 because ZeroClaw sends a fixed `temperature` that some models reject. This is a real-world **provider-portability** complaint; the fix landed quickly, which should improve sentiment.
- **Onboarding correctness:** `install.sh` selecting the wrong (musl) build on glibc hosts using Ubuntu's `musl` package — a confusing install failure for new users.
- **Least-privilege UX:** Non-admin dashboard users could sign in but not chat; `zerocode` crashed on startup for limited accounts. Users clearly want **read/limited access without admin rights**.
- **Multi-turn provider behavior:** [#12361](https://github.com/zeroclaw-labs/zeroclaw/issues/12361) — providers like **Reflection AI (Beam)** require `reasoning_content` in assistant history; ZeroClaw's `ChatMessage` lacks the field, so multi-turn fails. **This one is OPEN and unresolved** — a concrete compatibility gap.
- **Dashboard reliability:** TLS flush bug caused 300s hangs — a painful, visible failure now fixed.

**Overall satisfaction signal:** High responsiveness — most S1/S2 bugs filed were closed same-day. The main dissatisfaction is **edge-case provider/model compatibility** and **role/permission gaps**.

---

## 8. Backlog Watch

Long-running or attention-needing items:

- **[#7432](https://github.com/zeroclaw-labs/zeroclaw/issues/7432)** (open since **2026-06-09**, 16 comments) — The runtime/gateway/sign-in tracker. As the owner of v0.9.0 scope, it **needs maintainer visibility** through release.
- **[#10407](https://github.com/zeroclaw-labs/zeroclaw/pull/10407)** (open since **2026-08-27**) — Persistent session prompt attachments. XL, high-risk, touching 25+ areas. **Needs maintainer review** to avoid stalling.
- **[#11847](https://github.com/zeroclaw-labs/zeroclaw/pull/11847)** (open since **2026-10-19**) — XMPP/OMEMO. XL, needs-maintainer-review.
- **[#11869](https://github.com/zeroclaw-labs/zeroclaw/pull/11869)**, **[#11868](https://github.com/zeroclaw-labs/zeroclaw/pull/11868)**, **[#11874](https://github.com/zeroclaw-labs/zeroclaw/pull/11874)** (all opened 2026-10-19, by CastelloBrancoTecnologia, `needs-maintainer-review`/`risk:high`) — a **cluster of large PRs awaiting review**; risk of contributor frustration if they stall.
- **[#11316](https://github.com/zeroclaw-labs/zeroclaw/pull/11316)** (open since **2026-10-01**) — Small test fix (process cwd in SEO test), `risk:low`, but lingering 6 weeks — easy merge candidate.
- **[#12351](https://github.com/zeroclaw-labs/zeroclaw/issues/12351)** — open flaky-CI bug; no fix PR yet.

**Backlog health note:** The ratio of `needs-maintainer-review` XL PRs (5+) to active maintainer review capacity is the project's **primary risk** — feature breadth is outpacing review bandwidth.

---

*Generated from GitHub activity data for 2026-11-11. All links reference github.com/zeroclaw-labs/zeroclaw.*

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*