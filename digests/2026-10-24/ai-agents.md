# OpenClaw Ecosystem Digest 2026-10-24

> Issues: 500 | PRs: 500 | Projects covered: 5 | Generated: 2026-10-23 23:50 UTC

- [OpenClaw](https://github.com/openclaw/openclaw)
- [Hermes Agent](https://github.com/nousresearch/hermes-agent)
- [IronClaw](https://github.com/nearai/ironclaw)
- [QwenPaw](https://github.com/agentscope-ai/QwenPaw)
- [ZeroClaw](https://github.com/zeroclaw-labs/zeroclaw)

---

## OpenClaw Deep Dive

# OpenClaw Project Digest — 2026-10-24

## 1. Today's Overview

OpenClaw remains a high-velocity project with **500 issues** and **500 PRs** updated in the last 24 hours, though the workload is heavily skewed toward maintenance and stabilization rather than feature delivery. No new releases shipped today, and the issue tracker shows **388 open/active issues** versus 112 closed — a ratio that signals sustained pressure on maintainers to triage and resolve. The most active threads are dominated by **P0/P1 crash-loop and startup regressions**, particularly around plugin capture, SQLite WAL behavior, and Windows startup latency, suggesting recent version upgrades (2026.9.x → 2026.10.x) introduced meaningful stability debt. PR activity is healthy with **292 merged/closed PRs**, many being small performance/refactor changes from `steipete` and `roboclaw-bot`, indicating the core team is actively hardening the runtime. Overall project health is **moderate**: strong contributor engagement and fast PR turnover, but a growing backlog of unresolved P0 regressions risks user trust if not addressed before the next release.

---

## 2. Releases

**No new releases in the last 24 hours.** The last shipped versions referenced in issues are 2026.10.1 and 2026.10.2, both of which are cited as sources of regressions (see Bugs & Stability). Users on 2026.9.5/2026.9.6 are also reporting unresolved lifecycle bugs.

---

## 3. Project Progress

While no releases landed, **292 PRs were merged/closed**, with several notable fixes and refactors advancing:

- **[#182008](https://github.com/openclaw/openclaw/pull/182008) (CLOSED)** — `fix(database): rebuild memory indexes before agent ports return` — Fixes #181859; preserves cached embeddings when porting agent stores, preventing repeated embedding calls and empty memory indexes.
- **[#181676](https://github.com/openclaw/openclaw/pull/181676) (CLOSED)** — `fix(agents): creating an agent fails with UNAVAILABLE on PostgreSQL state` — Resolves agent creation failure on PostgreSQL-backed state families.
- **[#181941](https://github.com/openclaw/openclaw/pull/181941) (CLOSED)** — `fix(doctor): bound the state content-version wait and restart the Gateway Doctor stopped` — Directly addresses the ~110-minute Doctor hang reported in #180690.
- **[#181895](https://github.com/openclaw/openclaw/pull/181895) (CLOSED)** — `fix(codex): queue inference roots at capacity instead of failing turns` — Fixes Codex app-server turn failures under concurrent load.
- **[#181903](https://github.com/openclaw/openclaw/pull/181903) (CLOSED)** — `fix: open generated images directly from Outputs` — Restores native image viewer for generated artifacts.
- **[#181985](https://github.com/openclaw/openclaw/pull/181985) (CLOSED)** — `refactor: localize private plugin parameter annotations` — Code quality cleanup.

**In-flight / awaiting review (high-impact):**
- **[#182022](https://github.com/openclaw/openclaw/pull/182022)** — `feat(channels): follow filtered channel logs` (`--follow` for `channels logs`).
- **[#180247](https://github.com/openclaw/openclaw/pull/180247)** — `fix(agents): preserve tool timeout recovery checkpoints` (durable interrupted recovery).
- **[#156736](https://github.com/openclaw/openclaw/pull/156736)** — `feat(session-share): filter by person and open original sessions` (XL, security-boundary review pending).

The dominant theme is **runtime reliability and memory footprint reduction** — dozens of `perf(*)` PRs from `steipete` target worker isolate memory, sidebar packing, cron roster allocation, and transcript retention.

---

## 4. Community Hot Topics

Top threads by comment count reveal a community deeply engaged with stability and multi-agent scaling concerns:

| Rank | Issue | Comments | Signal |
|------|-------|----------|--------|
| 1 | **[#160959](https://github.com/openclaw/openclaw/issues/160959)** — Gateway blocks for minutes on large external plugins (2026.9.6 regression) | 44 | P0 crash-loop, diamond lobster. Event-loop blocking on plugin capture. |
| 2 | **[#164294](https://github.com/openclaw/openclaw/issues/164294)** — Gateway state DB WAL auto-checkpoint never completes | 28 | P2 but persistent; SQLite WAL pinned by in-process reader for 17k+ frames. |
| 3 | **[#42475](https://github.com/openclaw/openclaw/issues/42475)** — Per-agent cost budget enforcement at gateway level | 28 (👍1) | Long-standing (since March) feature request, needs product decision. |
| 4 | **[#180690](https://github.com/openclaw/openclaw/issues/180690) (CLOSED)** — `doctor --fix` heap OOM on ~800-agent state | 20 | Fixed via PR #181941. |
| 5 | **[#156112](https://github.com/openclaw/openclaw/issues/156112)** — `openclaw update` fails at "global install swap" | 18 | P0 UX release-blocker; direct npm install works. |
| 6 | **[#168955](https://github.com/openclaw/openclaw/issues/168955)** — Windows startup 1030s vs 410s baseline | 18 | P1 regression in 2026.10.1. |

**Underlying needs:** The community is grappling with **operational scale** (hundreds/thousands of agents), **cross-platform reliability** (Windows + macOS sleep/wake), and **predictable update/upgrade paths**. The per-agent cost budget request (#42475) touches a recurring enterprise concern: operators want gateway-level guardrails rather than external monitoring.

---

## 5. Bugs & Stability

Ranked by severity (P0 → P1 → P2):

### 🔴 P0 — Critical / Crash-Loop / Release-Blocker

- **[#160959](https://github.com/openclaw/openclaw/issues/160959)** — Gateway event loop blocks for minutes on large plugins. *Open, 44 comments, no fix PR linked.* Introduced by plugin generation capture (#144252) in 2026.9.6.
- **[#156112](https://github.com/openclaw/openclaw/issues/156112)** — `openclaw update` deterministically fails at global install swap. *Open, manual-only.* Direct npm install succeeds — suggests a bug in the updater's swap logic.
- **[#170956](https://github.com/openclaw/openclaw/issues/170956)** — Windows slow startup + unclean plugin shutdown + schtasks permission error. *Open, P0, fix-shape-clear.*
- **[#158592](https://github.com/openclaw/openclaw/issues/158592)** — After host sleep/wake, prepared model runtime never recovers → all inbound messages fail until restart. *Open, diamond lobster, source-repro.*
- **[#155563](https://github.com/openclaw/openclaw/issues/155563)** — service-child relay/anchor + MCP groups retained after successful turn (2026.9.5 regression). *Open.*
- **[#166634](https://github.com/openclaw/openclaw/issues/166634)** — Late reclamation commit checkpoint failure leaves agent permanently unavailable after crash recovery. *Open, not-repro-on-main.*

### 🟠 P1 — High Impact

- **[#168955](https://github.com/openclaw/openclaw/issues/168955)** — Windows startup regression: 1030s vs 410s, `sidecars.control-ui-assets` blocks 477s. *Open.*
- **[#158390](https://github.com/openclaw/openclaw/issues/158390)** — `plugin-captures` tmp dirs never GC'd → disk fills indefinitely. *Open, queueable-fix, diamond lobster.*
- **[#158417](https://github.com/openclaw/openclaw/issues/158417)** — Plugin re-materialisation fills `/tmp`, duplicates module graphs. *Open.*
- **[#170928](https://github.com/openclaw/openclaw/issues/170928)** — Windows 2026.10.2 gateway takes 7–9 min to ready. *Open, regression.*
- **[#144336](https://github.com/openclaw/openclaw/issues/144336)** — Deferred config-reload restart (SIGUSR1) fails shutdown step. *Open, stable maturity.*
- **[#143274](https://github.com/openclaw/openclaw/issues/143274)** — `maybeRetryTransient` disables auth-profile rotation failover (2026.9.3 regression). *Open, diamond lobster.*
- **[#167791](https://github.com/openclaw/openclaw/issues/167791)** — Android/Termux EACCES on SQLite read-only snapshot via hard links. *Open, source-repro, diamond lobster.*
- **[#156895](https://github.com/openclaw/openclaw/issues/156895)** — Agent-created automation jobs fail closed with "Scheduled account unavailable". *Open, needs-security-review, platinum hermit.*

### 🟡 P2 — Notable (selected)

- **[#164294](https://github.com/openclaw/openclaw/issues/164294)** — WAL auto-checkpoint never completes (28 comments).
- **[#158127](https://github.com/openclaw/openclaw/issues/158127)** — Multi-agent runtime publication failures + Codex startup timeouts.
- **[#83959](https://github.com/openclaw/openclaw/issues/83959)** — Codex app-server startup retries exhaust before replacement server ready.
- **[#53408](https://github.com/openclaw/openclaw/issues/53408)** — Write/exec tool parameters silently dropped after long conversations.
- **[#105528](https://github.com/openclaw/openclaw/issues/105528)** — exec/read tools silently return empty output on Windows (2026.6.x regression).
- **[#84110](https://github.com/openclaw/openclaw/issues/84110)** — Codex rewrites full prompt on continuation turns, busting prompt cache (93% → 47%).
- **[#98702](https://github.com/openclaw/openclaw/issues/98702)** — Inherited OpenAI OAuth rejected on `openai-chatgpt-responses` transport.
- **[#102534](https://github.com/openclaw/openclaw/issues/102534)** — Cron scheduler timer permanently stops firing after heavy timeouts.

**Fix-PR status:** Only #180690 has a merged fix (#181941). Most P0/P1 issues remain without linked fix PRs, indicating maintainer bottleneck on the hardest reliability bugs.

**Key patterns:**
1. **Windows is the weakest platform** — 4+ distinct P1 regressions across startup, scheduling, and tool output.
2. **Plugin capture subsystem** is the single largest source of new regressions (disk, event loop, module duplication).
3. **Runtime publication / model fallback** failures cause message loss and require restarts.

---

## 6. Feature Requests & Roadmap Signals

Active feature requests (many stale but with ongoing discussion):

- **[#42475](https://github.com/openclaw/openclaw/issues/42475)** — Per-agent cost budgets at gateway (👍1, since March). High commercial relevance.
- **[#67413](https://github.com/openclaw/openclaw/issues/67413)** — Per-agent dreaming configuration (👍5 — highest reaction in list). Addresses OOM during parallel dreaming.
- **[#96975](https://github.com/openclaw/openclaw/issues/96975)** — Isolate subagent completion from parent context; return status + link only.
- **[#44309](https://github.com/openclaw/openclaw/issues/44309)** — One-way dispatch mode for A2A handoffs (no reply-back ping-pong).
- **[#79902](https://github.com/openclaw/openclaw/issues/79902)** — Companion-friendly SQLite transcript/session seams (👍2).
- **[#81960](https://github.com/openclaw/openclaw/issues/81960)** — Onboarding for multiple providers/models.
- **[#79223](https://github.com/openclaw/openclaw/issues/79223)** — Configurable Dream Diary language/prompt.
- **[#56781](https://github.com/openclaw/openclaw/issues/56781)** — Fallback model chain for compaction & LCM summaryModel.
- **[#76247](https://github.com/openclaw/openclaw/issues/76247)** — Dispatch landing ACK / receiver-entry telemetry across surfaces.
- **[#105494](https://github.com/openclaw/openclaw/issues/105494)** — Interactive "memory therapy" session for contradictions.
- **[#71452](https://github.com/openclaw/openclaw/issues/71452)** — Message list pagination (currently hardcoded 25).
- **[#52184](https://github.com/openclaw/openclaw/issues/52184)** — Prefer Volta shim path over pinned node path in macOS LaunchAgent.

**Prediction for next version:**
- **Per-agent dreaming config (#67413)** and **per-agent cost budgets (#42475)** are the most likely to land given high engagement and enterprise demand — though both are tagged `needs-product-decision`.
- **Telemetry (#76247)** and **dispatch mode (#44309)** align with multi-agent scaling themes already being addressed in perf PRs.
- **Fallback chains for compaction (#56781)** could become urgent given schema migrations and OOM reports.

---

## 7. User Feedback Summary

**Pain points (ranked by frequency and severity):**

1. **Upgrades break working deployments.** Repeated reports across #156112, #168955, #170928, #164799 — users are afraid to update. `openclaw update` itself fails (#156112).
2. **Disk fills silently.** #158390, #158417 — plugin captures and re-materialisation fill `/tmp` and `~/.openclaw/tmp` with multi-GB leftovers and no GC.
3. **Windows is unreliable.** Slow startup, schtasks permission errors, empty tool output, unclean shutdown — a cluster of four-plus P1 issues.
4. **Agents get permanently stuck.** #158592 (post-sleep runtime), #166634 (reclamation checkpoint), #164799 (agents admit past ready) — only a gateway restart recovers them.
5. **WAL/SQLite checkpoint starvation.** #164294 — a low-level DB issue that erodes confidence in the storage layer.
6. **Long-conversation tool degradation.** #53408, #105528 — silent parameter drops and empty output after 15+ turns.

**Use cases visible in reports:**
- Large fleets (**~810 agents / 939 databases** in #180690) — OpenClaw is being run at serious production scale.
- Multi-provider setups (Codex, Anthropic, OpenAI, Xiaomi MiMo, volcengine, deepseek).
- Multi-channel deployments (Feishu, Teams, Discord, Telegram, Signal, WeChat/Weixin).
- Individual power users on macOS, Linux, Windows, and even **Android/Termux** (#167791).

**Satisfaction signals:** Contributors are actively filing detailed, well-structured bug reports (many `source-repro`, `diamond lobster` ratings), and PR volume from both maintainers and community is high — this indicates strong engagement despite frustration. The high number of `stale` tags on feature requests (many since March) suggests **feature velocity is being sacrificed for bug fixing**, a tradeoff that may frustrate long-term users.

**Dissatisfaction:** Recurrence of regressions across consecutive releases (2026.9.4 → 2026.9.5 → 2026.9.6 → 2026.10.1 → 2026.10.2) is the loudest signal — users are seeing the same subsystems (plugins, startup, SQLite) repeatedly break.

---

## 8. Backlog Watch

Long-unanswered or stuck items needing maintainer/product attention:

| Issue/PR | Age | Why it matters |
|----------|-----|----------------|
| **[#42475](https://github.com/openclaw/openclaw/issues/42475)** — Per-agent cost budgets | ~7 months | 28 comments, needs-product-decision; enterprise blocker. |
| **[#67413](https://github.com/openclaw/openclaw/issues/67413)** — Per-agent dreaming config | ~6 months | Highest 👍 (5); OOM risk in multi-agent fleets. |
| **[#79902](https://github.com/openclaw/openclaw/issues/79902)** — SQLite transcript/session seams | ~5.5 months | Ecosystem enablement; needs-product-decision. |
| **[#44309](https://github.com/openclaw/openclaw/issues/44309)** — One-way A2A dispatch | ~7 months | Multi-agent routing primitive. |
| **[#96975](https://github.com/openclaw/openclaw/issues/96975)** — Subagent completion isolation | ~4 months | Context-window bloat in heavy subagent workloads. |
| **[#76247](https://github.com/openclaw/openclaw/issues/76247)** — Dispatch landing telemetry | ~5.5 months | Observability gap for multi-agent ops. |
| **[#56781](https://github.com/openclaw/openclaw/issues/56781)** — Fallback chain for compaction | ~7 months | Silent session growth when summary model rate-limited. |
| **[#52184](https://github.com/openclaw/openclaw/issues/52184)** — Volta shim path (macOS LaunchAgent) | ~7 months | Niche but causes persistent service fragility. |
| **[#156736](https://github.com/openclaw/openclaw/pull/156736)** — session-share filter by person (PR) | ~1 month | XL PR, security-boundary review, needs proof. |
| **[#180247](https://github.com/openclaw/openclaw/pull/180247)** — Tool timeout recovery checkpoints (PR) | 2 days | P2, security-boundary, needs proof — critical for long-running agents. |
| **[#180214](https://github.com/openclaw/openclaw/pull/180214)** — Compaction request provenance (

---

## Cross-Ecosystem Comparison

# Cross-Project Comparison Report — Personal AI Assistant / Agent Open-Source Ecosystem
**Date:** 2026-10-24 | **Projects Analyzed:** OpenClaw, Hermes Agent, IronClaw, QwenPaw, ZeroClaw

---

## 1. Ecosystem Overview

The personal AI assistant / agent open-source landscape in late 2026 is bifurcated into **two distinct maturity bands**: high-velocity "production pressure" projects (OpenClaw, Hermes Agent, ZeroClaw) absorbing real operational scale, and lower-intensity projects either consolidating (QwenPaw pre-v2.3 refactor) or in quiet maintenance (IronClaw). Across every high-activity project, the dominant engineering narrative has shifted from **feature delivery to reliability hardening** — regression management, session/state integrity, identity-scoped authorization, and cross-platform stability now dominate issue trackers. A convergence is visible on **plugin/modular architecture** (OpenClaw, QwenPaw, Hermes) and **principal-scoped security models** (ZeroClaw, Hermes), suggesting the ecosystem is standardizing on extensibility + zero-trust agent execution as table stakes. Meanwhile, **Windows and channel-adapter (messaging platform) reliability** has emerged as the ecosystem's weakest cross-cutting surface, affecting four of five projects.

---

## 2. Activity Comparison

| Project | Issues (updated 24h) | Open/Closed Issues | PRs (updated 24h) | PRs Merged/Closed | Releases (24h) | Activity Tier | Health Score |
|---|---|---|---|---|---|---|---|
| **OpenClaw** | 500 | 388 open / 112 closed | 500 | 292 | None | 🔥 Very High | **Moderate** — high velocity, growing P0 backlog |
| **Hermes Agent** | 50 | 47 open / 3 closed | 50 | 11 | v0.22.5 (2026-10-22) | 🔥 High | **Healthy under load** — post-migration triage |
| **QwenPaw** | 25 | 18 open / 7 closed | 50 | 12 | None (v2.3.0b in flight) | ⚡ Active pre-release | **Strong velocity, rising backlog** |
| **ZeroClaw** | 29 | 28 open / 1 closed | 50 | **0** | None (v0.9.0 in flight) | ⚡ High (merge-debt) | **At risk** — review bottleneck |
| **IronClaw** | 0 | — | 5 | 1 | None | 💤 Low (bot-only) | **Quiet / watch** — no human activity |

**Key read:** OpenClaw operates at **10× the issue/PR volume** of any peer but with a concerning P0 regression backlog. ZeroClaw's **zero merges against 50 open PRs** is the single most anomalous signal in the dataset. IronClaw's bot-only activity is a potential disengagement warning.

---

## 3. OpenClaw's Position

### Advantages vs Peers
- **Scale of adoption:** Operated at serious production scale — one issue (#180690) references **~810 agents / 939 databases**. No peer demonstrates comparable real-world deployment density.
- **Contributor throughput:** 292 merged PRs in 24h — an order of magnitude above QwenPaw (12) or Hermes (11). Rapid-fire `perf(*)` PRs from core maintainers (`steipete`, `roboclaw-bot`) show a deeply invested core team.
- **Issue quality:** Detailed `source-repro`, `diamond lobster`-rated reports indicate a technically sophisticated user base providing high-signal feedback.

### Technical Approach Differences
- **Monolithic-ish gateway with heavy plugin capture subsystem** — whereas QwenPaw is extracting channels into **subprocess-isolated plugins** and ZeroClaw is enabling **CLI-only gateway-less builds**. OpenClaw's plugin capture layer is its single largest regression source (#160959, #158390, #158417).
- **SQLite/WAL state layer** (with the WAL checkpoint starvation bug #164294) — a heavier persistence design than peers; Hermes and QwenPaw show fewer DB-layer complaints.
- **Multi-channel breadth** (Feishu, Teams, Discord, Telegram, Signal, WeChat, Android/Termux) exceeds peers, but this surface is also where many regressions cluster.

### Community Size Comparison
| Signal | OpenClaw | Hermes | QwenPaw | ZeroClaw | IronClaw |
|---|---|---|---|---|---|
| Issue/PR volume (24h) | 1000 | 100 | 75 | 79 | 5 |
| Demo'd fleet scale | ~810 agents | team ops | multi-channel | multi-tenant | — |
| Non-maintainer PRs | High | High | Moderate | Moderate | None |

**Position:** OpenClaw is the **reference implementation and de-facto market leader by volume**, but its lead is **operationally fragile** — recurring regressions across 2026.9.4 → 2026.10.2 erode the trust advantage its scale would otherwise confer.

---

## 4. Shared Technical Focus Areas

Cross-cutting requirements emerging in **≥3 projects**:

| Theme | Projects | Specific Needs |
|---|---|---|
| **Session/state isolation** | OpenClaw (#166634), Hermes (#46303, #143767, #143746), ZeroClaw (#11711, #12002) | Prevent cross-session memory bleed, worktree collision, autosave overwrites; append-only/durable history |
| **Plugin/modular architecture** | OpenClaw (plugin capture), QwenPaw (#8187 channel plugins), Hermes (plugin skills) | Subprocess isolation, GC of plugin artifacts, semantic extension APIs |
| **Identity / principal-scoped authorization** | ZeroClaw (#11230, #11234, #9746), Hermes (#16108), OpenClaw (#42475 cost budgets) | Per-agent/per-principal tool allowlists, scoped sessions, gateway-level guardrails |
| **Windows reliability** | OpenClaw (#168955, #170928), Hermes (#68128, #143704), ZeroClaw (#12005), QwenPaw (CI platform-neutrality PRs) | Startup latency, service detachment, permission errors, dialect over-blocking |
| **Gateway idempotency / delivery guarantees** | Hermes (#16108), OpenClaw (#160959), ZeroClaw (#11962) | Cancellation, stale-response suppression, orphaned-session reaping, message-loss prevention |
| **Silent failure elimination** | QwenPaw (#8343, #8394), ZeroClaw (#11799, #11972), OpenClaw (#53408, #105528) | Surface errors instead of dropping/blanking; actionable operator diagnostics |
| **MCP trust/approval UX** | Hermes (#143780, #143795, #143787), QwenPaw (#8405), OpenClaw | Argument-visible approvals, scope-accurate consent, fail-closed security |
| **Cost/rate governance** | OpenClaw (#42475, #67413), Hermes (spend limits), ZeroClaw (OpenRouter balance) | Per-agent budgets, dreaming/OOM controls, fallback chain config |

**Convergent insight:** The ecosystem is independently arriving at the same conclusion — **agent systems need OS-like primitives** (isolation, scheduling, authorization, durable state, observability) rather than feature bolted-ons.

---

## 5. Differentiation Analysis

| Dimension | OpenClaw | Hermes Agent | QwenPaw | ZeroClaw | IronClaw |
|---|---|---|---|---|---|
| **Feature focus** | Multi-agent scale, perf, multi-channel | Gateway unification, MCP trust UX, session hygiene | Plugin ecosystem, memory (ReMe), channels | Security/identity, OIDC, CLI-only builds | WebUI, dependency hygiene |
| **Target users** | Enterprise fleets, power users | Team ops, multi-platform workflow users | Plugin authors, channel integrators | Security-conscious/self-hosters | Web-facing agent deploys |
| **Architecture** | Monolithic gateway + plugin capture, SQLite WAL | Unified gateway (post-migration) | Modular channel plugins (subprocess) | Principal-scoped, CLI-only-capable | Rust core + JS WebUI |
| **Security posture** | Gateway cost guardrails (requested) | MCP trust-gate (argument-visible) | Plugin hook policies | OIDC + principal-scoped (most rigorous) | Sanitizer-dependent (dompurify) |
| **Distinguishing bet** | Operational scale | Gateway stability + UX polish | Extensibility ecosystem | Zero-trust multi-tenant | Web UI surface |
| **Weakest surface** | Plugin capture / Windows | Session state / Windows | Channel adapters / upgrades | Merge throughput | Engagement (bot-only) |

**Strategic differentiation:** ZeroClaw is pursuing the **most defensible architecture** (identity-scoped, minimal-footprint). QwenPaw is betting on **ecosystem (plugins/theme APIs)** as moat. Hermes is competing on **trust UX and gateway reliability**. OpenClaw is defending a **scale leadership** position. IronClaw's strategy is currently opaque due to low activity.

---

## 6. Community Momentum & Maturity

### Activity Tiers

**🔥 Tier 1 — High-Velocity, Production-Scale**
- **OpenClaw** (1000 items/24h): Iterating fast but **stabilizing** — feature velocity sacrificed for bug fixing (evidenced by `stale` feature tags since March). Maturity: **late-stage growth with stability debt**.
- **Hermes Agent** (100 items/24h): **Rapidly iterating post-migration** — unified gateway fallout being actively triaged. Maturity: **mid-to-high, in consolidation**.

**⚡ Tier 2 — Active Pre-Release / Focused Iteration**
- **QwenPaw** (75 items/24h): **Rapidly iterating** toward v2.3.0 modularity. Clear roadmap, transparent community engagement (#8289). Maturity: **mid, scaling ecosystem**.
- **ZeroClaw** (79 items/24h, **0 merges**): Iterating on paper but **bottlenecked at review**. Maturity: **pre-release hardening, at risk of merge-debt stall**.

**💤 Tier 3 — Low/Quiet**
- **IronClaw** (5 items/24h, bot-only): **Stabilizing / dormant**. No human contributions, no discussion. Maturity: **indeterminate — warrants maintainer outreach**.

### Momentum Read
- **Fastest validators of architecture:** QwenPaw and ZeroClaw (both making structural bets).
- **Most stressed:** OpenClaw (P0 backlog) and ZeroClaw (merge bottleneck).
- **Most stable user experience:** Hermes (despite regressions, fast fix turnaround — e.g., #143775 closed same-day).
- **Most uncertain trajectory:** IronClaw.

---

## 7. Trend Signals

Extracted from cross-project community feedback — **actionable for AI agent developers**:

1. **Regressions are the #1 trust killer, not bugs.** OpenClaw's recurring 2026.9.x → 2026.10.x breakage in the *same subsystems* (plugins, startup, SQLite) is the loudest dissatisfaction signal. **Implication:** Invest in regression test harnesses per subsystem; freeze subsystems before release cuts.

2. **Silent failures are worse than crashes.** QwenPaw (DingTalk dropped replies, XiaoYi blank clients) and ZeroClaw (`get-paircode` exits 0 on failure) show users tolerate errors but not *invisible* ones. **Implication:** Fail loudly; instrument delivery ACKs (#76247-style telemetry).

3. **Identity/authorization is the emerging battleground.** ZeroClaw's OIDC + principal-scoped PR stack and Hermes's MCP trust-gate UX show security policy moving from *opt-in* to *architectural*. **Implication:** Design principal-scoped scoping from day one; retrofitting (OpenClaw #42475, #7-month backlog) is expensive.

4. **Plugin ecosystems demand first-class extension APIs.** QwenPaw's theme-token request (#8071, most-commented) and OpenClaw's plugin capture pain show monkey-patching is the anti-pattern users reject. **Implication:** Ship semantic extension points early; isolate plugin execution (subprocesses).

5. **Session/state durability is foundational, not a feature.** Across OpenClaw, Hermes, and ZeroClaw, session bleed and data loss recur. Append-only/durable history (ZeroClaw #11921) is converging as the fix pattern. **Implication:** Treat conversation history as an audit log, not mutable state.

6. **Windows and channel adapters are the ecosystem's reliability floor.** Four of five projects report Windows or messaging-platform failures. **Implication:** Dedicated cross-platform CI coverage (QwenPaw's platform-neutral test PRs are a model) pays compounding dividends.

7. **Cost/rate governance is the next enterprise gate.** OpenClaw's per-agent budget (#42475) and dreaming config (#67413), Hermes spend limits, and ZeroClaw balance reporting converge on **operator-facing financial guardrails**. **Implication:** Gateway-level budget enforcement is becoming a purchase criterion for enterprise adoption.

8. **Merge throughput — not dev velocity — is the new bottleneck.** ZeroClaw's 50 open / 0 merged PRs and OpenClaw's 388 open issues show review bandwidth, not coding capacity, constrains releases. **Implication:** Tooling for review (ZeroClaw's #11876 review-focus RFC) and stacked-PR management is under-invested across the ecosystem.

---

### Bottom Line for Decision-Makers

| If you need… | Choose… | Because… |
|---|---|---|
| **Battle-tested at scale** | OpenClaw | Largest deployment evidence — but pin versions & test upgrades |
| **Reliable multi-platform ops** | Hermes Agent | Fastest fix turnaround; mature trust UX |
| **Plugin extensibility** | QwenPaw | Clearest ecosystem roadmap (v2.3.0) — wait for v2.3.0 GA |
| **Zero-trust / self-hosted** | ZeroClaw | Strongest security architecture — but watch merge-debt risk |
| **Web-facing agent UI** | IronClaw | Only if engagement recovers — currently low-signal |

**Ecosystem verdict:** The market is maturing from *"can agents do X?"* to *"can agents do X reliably, securely, and affordably at scale?"* — and the projects that win the next cycle will be those that close the **stability, identity, and observability** gaps fastest, not those that ship the most features.

---

## Peer Project Reports

<details>
<summary><strong>Hermes Agent</strong> — <a href="https://github.com/nousresearch/hermes-agent">nousresearch/hermes-agent</a></summary>

# Hermes Agent — Project Digest
**Date:** 2026-10-24
**Repository:** github.com/NousResearch/hermes-agent

---

## 1. Today's Overview

Hermes Agent remains in a **high-velocity maintenance and stabilization phase** following the unified gateway migration (#106742, merged 2026-10-14). Activity is elevated: **50 issues** and **50 PRs** updated in the last 24h, with a notable skew toward open items (47 active issues, 39 open PRs). The release of **v0.22.5** is a rollup patch consolidating ~81 merged PRs since v0.22.4, with full curated notes deferred to v0.23.0. The dominant themes today are **gateway reliability**, **session state isolation**, and **MCP trust-gate UX** — with a cluster of `sweeper:risk-session-state` tagged issues suggesting the maintainers are actively tracking cross-session contamination as a strategic risk. Overall project health is **healthy but under load**: many P2 bugs remain open with active discussion, and several long-lived issues (dating to June–August) are still unresolved.

---

## 2. Releases

### v0.22.5 — Patch Release
**Release Date:** 2026-10-22

**What it is:** A rollup tag consolidating **~81 PRs merged since v0.22.4** into a stable release for:
- GitHub release (CLI + installers)
- Microsoft Store app
- Docker
- Hermes Cloud

**Breaking changes / migration notes:** None explicitly documented. This is marketed as a stability rollup.

**Caveat:** Full curated release notes are *withheld* and will ship with **v0.23.0**. Users tracking specific fixes should be aware this tag does not enumerate individual changes. If you depend on changelog visibility for production upgrades, **wait for v0.23.0 notes** or diff the commit range manually.

---

## 3. Project Progress

Of the 50 PRs updated today, **11 were merged/closed**. Notable progress (merged or salvage-in-flight):

| PR | Status | What it does |
|---|---|---|
| [#143780](https://github.com/NousResearch/hermes-agent/pull/143780) | CLOSED | MCP trust prompts: **"Allow for this session" / "Always" now stick per tool**; one-shot prompts offer only Once/Deny. Salvage of #109832. |
| [#143776](https://github.com/NousResearch/hermes-agent/pull/143776) | CLOSED | Desktop plugin cards post into **their own chat** rather than the last-clicked composer. |
| [#143795](https://github.com/NousResearch/hermes-agent/pull/143795) | OPEN (ci-reviewed) | Untrusted MCP write approvals now **show call arguments**, secrets masked, JSON capped at 1,200 chars. |
| [#143787](https://github.com/NousResearch/hermes-agent/pull/143787) | OPEN (ci-reviewed) | YOLO / `approvals.mode: off` **skip untrusted MCP prompts**; spend limits still enforced. |
| [#143784](https://github.com/NousResearch/hermes-agent/pull/143784) | OPEN (ci-reviewed) | Fixes plugin skills called as `plugin:<namespace>:<skill>` (Blender skill was unreachable). |
| [#127226](https://github.com/NousResearch/hermes-agent/pull/127226) | OPEN | Gateway `/kanban create` honors `kanban.auto_subscribe_on_create: false`. |
| [#143163](https://github.com/NousResearch/hermes-agent/pull/143163) | OPEN | Adds **DotHoosh** model provider (Iran-focused gateway: Claude/Gemini/DeepSeek/Kimi). |

**Feature advancement:** The MCP trust-gate cluster (#143780, #143795, #143787, #96710) represents a coordinated UX overhaul — moving from opaque, over-broad consent to **argument-visible, scope-accurate approvals**. This is likely the headline user-facing change in v0.23.0.

---

## 4. Community Hot Topics

### Most-discussed Issues

**1. [#129993](https://github.com/NousResearch/hermes-agent/issues/129993) — Desktop duplicate assistant bubble (17 comments, 👍2)**
P2 bug. Reply renders twice in transcript; persisted store is correct. Duplication is a *render-layer* issue, not data corruption. Long-lived (opened 2026-10-01) with sustained engagement — indicates a hard-to-reproduce or multi-cause defect.

**2. [#68128](https://github.com/NousResearch/hermes-agent/issues/68128) — WhatsApp bridge `WinError 5` on Windows (14 comments)**
Open since July, tagged `sweeper:risk-message-delivery` + `os/windows`. The adapter lacks a documented `windows_detach_flags_without_breakaway()` fallback. **Three months unresolved** — a signal that Windows CI coverage may be insufficient.

**3. [#143379](https://github.com/NousResearch/hermes-agent/issues/143379) — RFC: doc-chain substrate network (10 comments, same-day)**
A deep architectural RFC on durable record survival across compression, re-reading, and governance. High comment velocity on day one suggests strong maintainer/community interest — possible **v0.23.0+ roadmap item**.

**4. [#46303](https://github.com/NousResearch/hermes-agent/issues/46303) — Concurrent sessions cross-contaminate (10 comments)**
Open since **June 2026**. Shared memory injection + shared git worktree with no isolation. Tagged `sweeper:risk-session-state` across desktop/CLI/plugins. This is the canonical example of the session-state risk family.

**5. [#143547](https://github.com/NousResearch/hermes-agent/issues/143547) — Unified gateway post-merge problems (9 comments, 👍1)**
A tracking issue opened *today* aggregating regressions from the unified gateway #106742. The fact that a consolidation issue was needed one day after v0.22.5 signals the migration introduced **broad, multi-surface fallout**.

**Underlying need signal:** Users need **predictable session isolation** and **gateway stability after unification**. The concentration of `area/sessions` tags across the top issues shows the community is hitting the same architectural pressure from many surfaces (Desktop, CLI, Telegram, Discord, WhatsApp, Kanban).

---

## 5. Bugs & Stability

Ranked by severity and impact:

### 🔴 Critical / P2 with broad surface impact

| Issue | Summary | Fix PR? |
|---|---|---|
| [#143547](https://github.com/NousResearch/hermes-agent/issues/143547) | **Unified gateway regressions on main** — every surface now routes through one process; post-merge problems accumulating. | Tracking issue; partial via #143796 |
| [#46303](https://github.com/NousResearch/hermes-agent/issues/46303) | **Concurrent session cross-contamination** (memory + git worktree). No isolation. | ❌ None |
| [#143775](https://github.com/NousResearch/hermes-agent/issues/143775) | **Stale post-boot rendezvous record (dead PID) blocks every gateway start.** | ✅ CLOSED same day |
| [#143767](https://github.com/NousResearch/hermes-agent/issues/143767) | Desktop resumes **pre-compression (ended) session**; model switches refused as `session_superseded`. | ❌ None |
| [#143746](https://github.com/NousResearch/hermes-agent/issues/143746) | Gateway session hygiene **never compacts on reasoning models** (300s floor + misleading "no session_db" warning). Three defects in one. | ❌ None |
| [#143720](https://github.com/NousResearch/hermes-agent/issues/143720) | Discord thread completion wake **refused every 60s forever**; attempt cap never fires; `notify-mode=off` ignored. | ❌ None |
| [#143704](https://github.com/NousResearch/hermes-agent/issues/143704) | Windows: `shutdown()` from watchdog **never wakes blocked read** → stalled streams wait full timeout. | ❌ None |

### 🟠 Notable regressions & UX bugs

- [#131238](https://github.com/NousResearch/hermes-agent/issues/131238) — Desktop streaming bubble never settles → duplicate render (companion to #129993).
- [#143285](https://github.com/NousResearch/hermes-agent/issues/143285) — "Unconfirmed send was restored" flashes on every Group Chat message (👍1).
- [#142648](https://github.com/NousResearch/hermes-agent/issues/142648) — MiniMax new models never surface (stale static catalog + 404 on live fetch).
- [#143305](https://github.com/NousResearch/hermes-agent/issues/143305) — Plugin admission fails for any plugin with Python deps (uv.lock `sys_platform == 'android'` re-resolve failure).
- [#136929](https://github.com/NousResearch/hermes-agent/issues/136929) — Desktop model picker doesn't update `_primary_runtime` → spurious fallback notice every turn.
- [#131776](https://github.com/NousResearch/hermes-agent/issues/131776) — KittenTTS read-aloud crashes Hermes (espeak-ng data path >160 bytes).

### 🟡 Umbrella / consolidated

- [#143750](https://github.com/NousResearch/hermes-agent/issues/143750) **[CLOSED]** — Cross-session re-delivery & memory bleed umbrella (4 root-cause classes). Closed same day — worth monitoring whether sub-issues remain open.

**Assessment:** Bug volume is **elevated and concentrated in gateway/session infrastructure**. A meaningful share are regressions from the recent unified gateway merge rather than new feature bugs — which is expected post-migration but needs sustained triage. Windows-specific bugs (#68128, #143704, #143779) indicate a **platform coverage gap**.

---

## 6. Feature Requests & Roadmap Signals

| Issue/PR | Feature | Likelihood for next release |
|---|---|---|
| [#143379](https://github.com/NousResearch/hermes-agent/issues/143379) | Doc-chain substrate network (read/governance/compaction RFC) | Medium — early RFC, high interest |
| [#136931](https://github.com/NousResearch/hermes-agent/issues/136931) | Distinguish durable skill lessons from temporary fixes (`needs-decision`) | Medium — quality-of-life for skill self-improvement |
| [#96906](https://github.com/NousResearch/hermes-agent/issues/96906) | Delegation closeout: hold one terminal response until background work finishes | Low-Medium — opt-in, awaiting maintainer decision since Aug |
| [#98540](https://github.com/NousResearch/hermes-agent/issues/98540) | API server: expose project/workspace association + projects listing endpoint | Medium — small surface, desktop parity |
| [#16108](https://github.com/NousResearch/hermes-agent/issues/16108) | Gateway event idempotency, cancellation, stale-response suppression | **High** — directly addresses today's hot bug cluster |
| [#40470](https://github.com/NousResearch/hermes-agent/issues/40470) | Prompt/response sanitization for sensitive data | Low-Medium — security hardening |
| [#133010](https://github.com/NousResearch/hermes-agent/issues/133010) | Run `browser_exec` Python harness inside Docker sandbox | Medium — security boundary |
| [#136708](https://github.com/NousResearch/hermes-agent/pull/136708) | `busy_result_mode` carries mid-turn subagent/background results into running turn | Medium — opt-in PR open |
| [#143791](https://github.com/NousResearch/hermes-agent/pull/143791) | `ctx.side_question` — plugin asks session's own agent post-turn | Medium — small, clean |
| [#143163](https://github.com/NousResearch/hermes-agent/pull/143163) | DotHoosh provider (Iran gateway) | High — small, additive |

**Prediction:** v0.23.0 will headline **MCP trust-gate UX** (argument display + scope accuracy) and likely include **gateway idempotency groundwork**. Features around session isolation (#46303 family) are overdue and may force architectural decisions.

---

## 7. User Feedback Summary

**Pain points (dissatisfaction):**

- **Duplicate/misrendered messages** dominate desktop complaints (#129993, #131238) — users see the same reply twice with no clear cause.
- **Session bleed & re-delivery** across messaging platforms (#143750 umbrella) — "the agent re-asks or re-answers a question the user already settled." Highly disruptive for multi-platform users.
- **Gateway start failures** from stale state (#143775) — a single unclean exit bricks every subsequent start until manually cleared.
- **Platform-specific failures** on Windows (#68128, #143704, #143779) and Discord (#143720) erode trust in cross-platform parity.
- **Silent config drops** — `reasoning_effort` ignored on Claude-on-Copilot (#52384); model picker not persisting (#136929).

**Positive signals:**

- The MCP trust-gate mechanism itself is praised: *"The mechanism itself is excellent — the gate fires before any transport work, fails closed on deny"* (#96703 author). The complaints are about **UX polish**, not the security model.
- Strong community contribution: multiple high-quality PRs (#96710, #109832, #135418) from non-maintainers, now being salvaged by `teknium1`.
- Active RFC culture (#143379) indicates an engaged, technically sophisticated user base.

**Use cases observed:** team ops agents on Slack, Jenkins MCP write-gating, WhatsApp bridges, gateway-owned Group Chats, Iran-region provider access.

---

## 8. Backlog Watch

Long-unanswered or aging items needing maintainer attention:

| Item | Age | Why it matters |
|---|---|---|
| [#68128](https://github.com/NousResearch/hermes-agent/issues/68128) | **~3 months** | Windows WhatsApp bridge broken; documented fallback never implemented. 14 comments, no fix. |
| [#46303](https://github.com/NousResearch/hermes-agent/issues/46303) | **~4 months** | Concurrent session cross-contamination — foundational isolation gap. No PR. |
| [#52384](https://github.com/NousResearch/hermes-agent/issues/52384) | ~4 months | `reasoning_effort` silently dropped on Copilot. Low-effort fix, no PR. |
| [#70881](https://github.com/NousResearch/hermes-agent/issues/70881) | ~3 months | MCP discovery warning spam when no `mcp_servers` configured. Cosmetic but noisy in logs. |
| [#98801](https://github.com/NousResearch/hermes-agent/issues/98801) | ~2 months | `lifecycle_guard` blocks reading Hermes's own docs — recursion bug turns documentation into a security blocker. |
| [#96906](https://github.com/NousResearch/hermes-agent/issues/96906) | ~2 months | Delegation closeout proposal **deferred on Oct 4, no maintainer decision**. PR #97039 closed unmerged. |
| [#16108](https://github.com/NousResearch/hermes-agent/issues/16108) | **~6 months** | Gateway idempotency/cancellation never shipped despite directly addressing today's top bug family. |
| [#108913](https://github.com/NousResearch/hermes-agent/issues/108913) | ~6 weeks | Kanban notify subscriptions never cleared for `done` tasks → every stale sub runs a full agent turn. 5 comments, PR #127226 only partially addresses. |
| [#96703](https://github.com/NousResearch/hermes-agent/issues/96703) | ~2 months | MCP approval card UX — **now has salvage PRs (#143795)**, track for merge. |
| [#136931](https://github.com/NousResearch/hermes-agent/issues/136931) | ~2 weeks | `needs-decision` — skill self-improvement regression risk. |

**Recommendation for maintainers:** The **session-state risk family** (`sweeper:risk-session-state` — appears on 8+ top issues) and **gateway idempotency (#16108)** are the two highest-leverage backlog items. Both are repeatedly cited as root causes and neither has an accepted fix. The Windows platform gap (#68128, #143704, #143779) may warrant dedicated CI coverage investment.

---

*Digest generated from GitHub activity on 2026-10-24. Data reflects 50 issues and 50 PRs updated in the prior 24h. Links reference `NousResearch/hermes-agent`.*

</details>

<details>
<summary><strong>IronClaw</strong> — <a href="https://github.com/nearai/ironclaw">nearai/ironclaw</a></summary>

# IronClaw Project Digest — 2026-10-24

## 1. Today's Overview

IronClaw shows a **low-intensity maintenance day**, with all repository activity concentrated in dependency management. No issues were updated in the last 24 hours, and no new releases were published. Of the 5 PRs touched, 4 remain open and 1 was closed — all authored by `dependabot[bot]`, indicating zero human-authored contributions in this window. The project appears to be in a stable, low-velocity phase, with routine dependency hygiene as the primary workstream. Notably, all but one PR target the frontend WebUI dependency tree, suggesting recent downstream churn in the JavaScript ecosystem that the project is now catching up on.

## 2. Releases

No new releases were published in the last 24 hours. No release notes or migration guidance to report.

## 3. Project Progress

Only one PR was closed in the last 24 hours:

- **PR #8149 [CLOSED]** — `chore(deps): bump dompurify from 3.4.12 to 3.4.16` in `/crates/product/ironclaw_webui/frontend`
  Link: https://github.com/nearai/ironclaw/pull/8149

This PR was superseded by **PR #8155**, which bumps dompurify to a higher target version (3.4.17). The closure represents version-churn cleanup rather than a feature or fix advancement. No user-facing functionality or bug fix was delivered today.

## 4. Community Hot Topics

No Issues or PRs in today's dataset have recorded comments or reactions (all show `Comments: undefined` and `👍: 0`). There is **no active community discussion** to report.

The closest item of note is the dompurify dependency thread, which effectively spans two PRs:

- **PR #8155 [OPEN]** — dompurify 3.4.12 → 3.4.17: https://github.com/nearai/ironclaw/pull/8155
- **PR #8149 [CLOSED]** — dompurify 3.4.12 → 3.4.16: https://github.com/nearai/ironclaw/pull/8149

**Underlying need:** DOMPurify is a client-side HTML sanitization library — a security-critical dependency for any web UI rendering untrusted content. The rapid succession of bumps (3.4.12 → 3.4.16 → 3.4.17) suggests upstream security or correctness fixes in the sanitizer. Maintainers should prioritize merging #8155, as leaving a sanitizer outdated in an agent-facing web UI carries XSS exposure risk.

## 5. Bugs & Stability

No bugs, crashes, or regressions were reported via Issues today (0 issues updated).

However, there is an **implicit stability signal** in the dependency bumps:

| Dependency | Change | Risk Area | PR |
|---|---|---|---|
| dompurify | 3.4.12 → 3.4.17 | XSS / HTML sanitization | [#8155](https://github.com/nearai/ironclaw/pull/8155) (open) |
| certifi | 2026.7.22 → 2026.10.19 | TLS certificate trust (e2e tests) | [#8157](https://github.com/nearai/ironclaw/pull/8157) (open) |
| storybook / addon-vitest | 10.5.7 → 10.6.2 | Dev tooling only | [#8156](https://github.com/nearai/ironclaw/pull/8156), [#8158](https://github.com/nearai/ironclaw/pull/8158) |

Severity ranking: **dompurify (highest — security-relevant)**, **certifi (medium — affects e2e test trust roots)**, **storybook (low — dev-only)**. Fix PRs exist for all, none yet merged.

## 6. Feature Requests & Roadmap Signals

No feature requests were filed or discussed today. With zero issue activity, there are **no user-driven roadmap signals** in this window. Any roadmap inference would be speculative; the only directional signal is continued investment in the WebUI frontend (all JS bumps target `crates/product/ironclaw_webui/frontend`), implying the web interface remains an active development surface.

## 7. User Feedback Summary

No user feedback was captured today — no issues opened, commented on, or closed. There is **insufficient data** to assess satisfaction, pain points, or use cases. The absence of inbound issues could indicate either a healthy, quiet period or low community engagement; distinguishing between the two would require longer-horizon trend data than this 24-hour snapshot provides.

## 8. Backlog Watch

No long-unanswered Issues or PRs appear in today's dataset. All 5 PRs were created or updated within the last 4 days (earliest: #8149, created 2026-10-20). The oldest open item is only 1 day old. **No backlog items require escalated maintainer attention** based on this window.

---

### Health Assessment

| Dimension | Signal |
|---|---|
| Activity level | Low (bot-only) |
| Human contribution | None in last 24h |
| Release cadence | None |
| Issue responsiveness | N/A (0 issues) |
| Security hygiene | ⚠️ Sanitizer (dompurify) and certifi bumps pending merge |

**Bottom line:** IronClaw is in a quiet maintenance state. The one actionable recommendation is to **review and merge PR #8155 (dompurify 3.4.17)** promptly, given its security-relevant nature for a web-facing AI agent product. The lack of human activity and community discussion is worth monitoring — if sustained, it may warrant maintainer outreach or roadmap communication to re-engage contributors.

</details>

<details>
<summary><strong>QwenPaw</strong> — <a href="https://github.com/agentscope-ai/QwenPaw">agentscope-ai/QwenPaw</a></summary>

# QwenPaw Project Digest — 2026-10-24

## 1. Today's Overview

QwenPaw is in an active pre-release development phase: 25 issues and 50 PRs were touched in the last 24h, with no new releases. The biggest narrative is the v2.3.0 "lighter and more extensible" plugin refactor ([#8289](https://github.com/agentscope-ai/QwenPaw/issues/8289)), which is driving a large wave of PRs (channel plugin extraction, PawApp SDK redesign, plugin hook policies). Stability work is also heavy: multiple channel adapters (DingTalk, Feishu, Telegram, XiaoYi, QQ) have reported message loss or blocking bugs, several of which have fix PRs in flight. Overall activity is **high**, but the open-to-closed ratio (18 open vs 7 closed issues; 38 open vs 12 merged PRs) suggests the review backlog is growing faster than it's being cleared.

## 2. Releases

No new releases today. Note: a release-duty verification issue for **v2.2.2.post1** ([#8386](https://github.com/agentscope-ai/QwenPaw/issues/8386)) was closed, and v2.3.0b1/b3 beta builds are in circulation per issue reports.

## 3. Project Progress

**Merged/closed PRs today (12 total; notable):**
- [#8399](https://github.com/agentscope-ai/QwenPaw/pull/8399) — fix(hub): preserve model policy drafts on refresh (prevents unsaved gateway timeout values being overwritten).
- [#8383](https://github.com/agentscope-ai/QwenPaw/pull/8383), [#8381](https://github.com/agentscope-ai/QwenPaw/pull/8381), [#8382](https://github.com/agentscope-ai/QwenPaw/pull/8382) — test-side fixes making CI platform-neutral (sips preflight, advisor listing, pawapp sidecar probe) — improves nightly reliability across Windows/macOS.

**Features advancing (open, under review):**
- [#8187](https://github.com/agentscope-ai/QwenPaw/pull/8187) — extract channels into plugins with subprocess isolation (core of the v2.3.0 modularity push).
- [#7874](https://github.com/agentscope-ai/QwenPaw/pull/7874) — PawApp SDK / app control plane redesign.
- [#8347](https://github.com/agentscope-ai/QwenPaw/pull/8347) — ReMe 0.4.2.0 memory integration (decision compaction, image memory, entity tags).
- [#8318](https://github.com/agentscope-ai/QwenPaw/pull/8318) — new `/steer` command for mid-execution guidance.
- [#8357](https://github.com/agentscope-ai/QwenPaw/pull/8357) — QwenPaw Creator 2.0.3 release PR.

## 4. Community Hot Topics

1. **[#8289](https://github.com/agentscope-ai/QwenPaw/issues/8289)** — "Coming in v2.3.0: Making QwenPaw Lighter and More Extensible" (3 comments, 1 👍). The maintainer-led roadmap thread; the community's main channel for shaping the plugin refactor. Underlying need: users want to extend QwenPaw without forking or monkey-patching, and want a lighter host process.
2. **[#8071](https://github.com/agentscope-ai/QwenPaw/issues/8071)** — Plugin-facing theme extension point (8 comments, most-commented issue). Plugin authors are hitting the single-knob `colorPrimary` limit and want a semantic token override layer. Signals a growing third-party plugin ecosystem that needs first-class UI extension APIs.
3. **[#8284](https://github.com/agentscope-ai/QwenPaw/issues/8284)** (closed) — Wheel-scroll "snap-back" in long conversations; transcript height re-estimation jumps 1.1–2.2k px. High-visibility UX bug now resolved.
4. **[#8351](https://github.com/agentscope-ai/QwenPaw/issues/8351)** — Composer draft keyed per-agent instead of per-conversation: unsent text leaks across conversations. Classic state-scoping bug; likely quick win.
5. **[#8347](https://github.com/agentscope-ai/QwenPaw/pull/8347)** — ReMe memory upgrade PR (XXL) drawing review attention; memory quality is a recurring user theme.

## 5. Bugs & Stability

Ranked by severity:

| Severity | Issue | Summary | Fix PR? |
|---|---|---|---|
| **Critical** | [#8350](https://github.com/agentscope-ai/QwenPaw/issues/8350) | Feishu channel runs synchronous network calls on the main event loop — when network is down the **entire service hangs** (`/api/healthz` times out, SIGTERM can't exit). | No PR seen |
| **Critical** | [#8335](https://github.com/agentscope-ai/QwenPaw/issues/8335) | Media in chat history causes 48 MB request bodies and **permanently wedged sessions** (WeChat, body-length limit exceeded). | Related: [#7973](https://github.com/agentscope-ai/QwenPaw/pull/7973) (media URL rejection recovery) |
| **High** | [#8298](https://github.com/agentscope-ai/QwenPaw/issues/8298) (closed) | `send_file_to_user` on video wedges session with 422 `unknown variant video_url`. | Closed |
| **High** | [#8343](https://github.com/agentscope-ai/QwenPaw/issues/8343) | DingTalk final reply **silently dropped** when sessionWebhook expires (errcode 300001); no Open API fallback. | No PR seen |
| **High** | [#8394](https://github.com/agentscope-ai/QwenPaw/issues/8394) | XiaoYi channel emits no status frames during long turns (blank client for minutes) and drops WS silently. | No PR seen |
| **Medium** | [#8359](https://github.com/agentscope-ai/QwenPaw/issues/8359) | Hub-in-Docker: readiness probe hardcoded to 127.0.0.1 → Docker runtime startup fails (Errno 111). | No PR seen |
| **Medium** | [#8378](https://github.com/agentscope-ai/QwenPaw/issues/8378) | Post-upgrade model invocation broken — legacy `active_model` in `agent.json` no longer honored. **Upgrade regression.** | No PR seen |
| **Medium** | [#8388](https://github.com/agentscope-ai/QwenPaw/issues/8388) | QQ channel unusable after upgrade — `No module named '_qwenpaw_remote_backend'` (broken install). | No PR seen |
| **Medium** | [#8406](https://github.com/agentscope-ai/QwenPaw/issues/8406) | QQ enabled flag silently reset to false, no warning. | No PR seen |
| **Low** | [#8351](https://github.com/agentscope-ai/QwenPaw/issues/8351) | Composer draft keyed per-agent, leaks across conversations. | No PR seen |
| **Low** | [#8405](https://github.com/agentscope-ai/QwenPaw/issues/8405) | MCP config modal can't be closed when transport is http/sse (stdio works). | No PR seen |
| **Low** | [#8333](https://github.com/agentscope-ai/QwenPaw/issues/8333) | Sidebar source-group headers overlap first conversation. | No PR seen |

**Pattern:** channel adapters (Feishu, DingTalk, Telegram, XiaoYi, QQ) are the dominant failure surface. Two upgrade regressions (#8378, #8388) suggest migration/back-compat gaps in v2.2.2 → later builds deserve a dedicated check.

## 6. Feature Requests & Roadmap Signals

- **Plugin/theme extensibility** ([#8071](https://github.com/agentscope-ai/QwenPaw/issues/8071)) — semantic token override layer for plugins. Strong signal for **v2.3.x** given the plugin refactor theme.
- **Disable auto-scroll during streaming** ([#7339](https://github.com/agentscope-ai/QwenPaw/issues/7339)) — a scroll-lock toggle for the desktop app; low-cost UX setting likely to land soon.
- **Office file preview in Console** ([#8404](https://github.com/agentscope-ai/QwenPaw/issues/8404)) — docx/xlsx/pptx preview in the file drawer. High-frequency real use case (agents produce these daily).
- **Mid-execution `/steer`** ([#8318](https://github.com/agentscope-ai/QwenPaw/pull/8318)) — PR ready; fills a real control gap (stop loses progress, wait wastes work).
- **Quoted-context in channels** ([#8329](https://github.com/agentscope-ai/QwenPaw/issues/8329), [#8342](https://github.com/agentscope-ai/QwenPaw/issues/8342)) — reply-quote context never reaches the agent, and quoted control commands (`/stop`) get misrouted in seven channels. Likely bundled into the channel plugin refactor.

**Predicted for next versions:** plugin theme API, `/steer`, scroll-lock toggle, Office preview; channel quoting/control-routing fixes likely follow the plugin extraction.

## 7. User Feedback Summary

**Pain points:**
- **Silent failures are the top complaint**: DingTalk dropped replies, XiaoYi blank clients, QQ flag resets — users get no error, just nothing. This erodes trust more than crashes do.
- **Upgrade friction**: multiple users report broken installs and model configs after upgrading (#8378, #8388), plus Hub timeout too short for file tasks ([#8372](https://github.com/agentscope-ai/QwenPaw/issues/8372)).
- **Long-conversation UX**: scroll snap-back (#8284) and media-induced session wedges (#8335) degrade the core chat experience at scale.
- **Cross-conversation leakage** of drafts (#8351) and split UI sessions for `chat_with_agent` (#8078) hurt multi-agent workflows.

**Satisfaction signals:** the maintainer's transparent v2.3.0 roadmap post (#8289) and responsive fix PRs (e.g., #8399, hub draft preservation) show a healthy feedback loop. Community members are investing in plugin development (theme issue, skill validator fix [#8400](https://github.com/agentscope-ai/QwenPaw/pull/8400)), a positive ecosystem indicator.

## 8. Backlog Watch

Long-lived or high-impact items needing maintainer attention:

- **[#7874](https://github.com/agentscope-ai/QwenPaw/pull/7874)** (open since 2026-09-19, XXXL) — PawApp SDK/control plane redesign. Five weeks open; central to the extensibility story.
- **[#7880](https://github.com/agentscope-ai/QwenPaw/pull/7880)** (open since 2026-09-19) — escalation-only tool policy hooks; ready for maintainer review but stalled.
- **[#7973](https://github.com/agentscope-ai/QwenPaw/pull/7973)** (open since 2026-09-24) — media URL rejection recovery; relevant to the newer #8335 wedge reports, should be prioritized.
- **[#8071](https://github.com/agentscope-ai/QwenPaw/issues/8071)** (open since 2026-10-01, 8 comments) — plugin theme extension point; most-discussed community ask, no owner assigned.
- **[#8078](https://github.com/agentscope-ai/QwenPaw/issues/8078)** (open since 2026-10-02) — `chat_with_agent` cross-session messages split into separate chats; structural multi-agent UX issue with reproduction evidence, no fix PR.
- **[#7339](https://github.com/agentscope-ai/QwenPaw/issues/7339)** (open since 2026-08-27) — scroll-lock setting; simplest high-value UX request still unaddressed after two months.

---

**Health assessment:** Development velocity is strong and roadmap direction is clear (modularity + plugin ecosystem), but the channel-adapter bug cluster, upgrade regressions, and a growing open-PR backlog (38 open) are the main risks. Prioritizing merge throughput on the channel refactor and a back-compat pass for v2.2.2 upgrade paths would materially improve stability perception.

</details>

<details>
<summary><strong>ZeroClaw</strong> — <a href="https://github.com/zeroclaw-labs/zeroclaw">zeroclaw-labs/zeroclaw</a></summary>

# ZeroClaw Project Digest — 2026-10-24

## 1. Today's Overview

ZeroClaw is in a high-intensity pre-release hardening phase for v0.9.0. In the last 24 hours the project saw 29 issues updated (28 open, 1 closed) and 50 PRs updated — **all 50 still open with zero merged or closed** — alongside no new releases. Activity is dominated by a coordinated security/identity-access workstream: a stack of OIDC dashboard sign-in, principal-scoped sessions, and CLI-only build feature work, largely authored by JordanTheJet and IftekharUddin. The large number of open PRs (several XL-sized, stacked, and `release:v0.9.0`-tagged) with no merges in the window suggests review bandwidth, not development throughput, is the current bottleneck. Three S1/S2 security-adjacent bugs were reported or re-confirmed today, indicating the release gate is still active.

## 2. Releases

No new releases in the last 24 hours. The project remains between releases, with a substantial volume of PRs tagged `release:v0.9.0` accumulating for the next cut.

## 3. Project Progress

**Merged/closed PRs today: zero.** No code landed in the window. One issue was closed:

- [#11876](https://github.com/zeroclaw-labs/zeroclaw/issues/11876) [CLOSED] RFC: Focus PR review on purpose, safety, and quality — a process RFC reducing review-skill overhead (~2,500 lines of instructions), consistent with the review-bandwidth interpretation above.

**Advanced (open, awaiting merge) work:**
- [#11965](https://github.com/zeroclaw-labs/zeroclaw/pull/11965) opt-in OIDC dashboard sign-in (stacked base for #11986).
- [#11986](https://github.com/zeroclaw-labs/zeroclaw/pull/11986) scoped dashboard chat through the core (stacked on #11965, #11186, #11964).
- [#11921](https://github.com/zeroclaw-labs/zeroclaw/pull/11921) append-only session event history — a significant architectural change to session persistence.
- [#11976](https://github.com/zeroclaw-labs/zeroclaw/pull/11976) CI for the CLI-only feature set with an artifact-size ratchet.
- [#11230](https://github.com/zeroclaw-labs/zeroclaw/pull/11230) / [#11234](https://github.com/zeroclaw-labs/zeroclaw/pull/11234) principal-scoped session/data tools and RPC ownership checks (p1, release-gate).

Net: feature development is progressing on paper, but the project has a **merge-debt** problem this window.

## 4. Community Hot Topics

Ranked by comment activity:

1. [#7432](https://github.com/zeroclaw-labs/zeroclaw/issues/7432) — [Tracker] Runtime, dashboard sign-in and gateway delivery (15 comments, updated 2026-10-23). The umbrella roadmap tracker for RFC #5574; the OIDC/chat PRs above are its deliverables. **Need:** sequencing and acceptance evidence for v0.9.0.
2. [#8279](https://github.com/zeroclaw-labs/zeroclaw/issues/8279) — delegate bypasses parent's tool allowlist (5 comments, S0, p1). A security-policy escape hatch in `tool/delegate`. **Need:** defense-in-depth in sub-agent tool inheritance.
3. [#11711](https://github.com/zeroclaw-labs/zeroclaw/issues/11711) — history trim permanently deletes older session turns (3 comments, S2). **Need:** reversible/append-only session history (directly addressed by PR #11921).
4. [#11951](https://github.com/zeroclaw-labs/zeroclaw/issues/11951) — gateway WebSocket upgrades fail over built-in TLS (2 comments, S2, v0.9.0). A release-blocking dashboard regression.
5. [#9746](https://github.com/zeroclaw-labs/zeroclaw/pull/9746) — per-agent ownership scoping for session tools and `discord_search` (open since 2026-08-04, XL, p1). The longest-running high-priority PR in the set; the "which conversations are mine" scoping model underpins several other fixes.

**Underlying theme:** the community and maintainers are converging on a single narrative — *principal-scoped identity and authorization everywhere* (sessions, tools, delegation, RPC, dashboard). That is the dominant design conversation of this cycle.

## 5. Bugs & Stability

Ranked by severity, reported/updated today:

**S1 — workflow blocked**
- [#11957](https://github.com/zeroclaw-labs/zeroclaw/issues/11957) — OIDC enrollment sends raw client credentials in the Basic header; RFC 6749 §2.3.1 requires form-urlencoding, so reserved characters break `client_credentials` and device-grant enrollment. *No fix PR linked yet — highest-priority gap.*

**S0 — security risk (re-confirmed)**
- [#8279](https://github.com/zeroclaw-labs/zeroclaw/issues/8279) — `delegate` bypasses parent tool allowlist; sub-agent can invoke excluded tools. A partial containment direction exists via [#11230](https://github.com/zeroclaw-labs/zeroclaw/pull/11230) / [#11995](https://github.com/zeroclaw-labs/zeroclaw/issues/11995), but no direct fix PR for the allowlist filter itself.

**S2 — degraded behavior**
- [#11951](https://github.com/zeroclaw-labs/zeroclaw/issues/11951) — WebSocket upgrades fail over built-in TLS listener (gateway/api, v0.9.0). No fix PR.
- [#11711](https://github.com/zeroclaw-labs/zeroclaw/issues/11711) — trimming a long conversation permanently deletes older turns from the session store. Addressed in principle by PR [#11921](https://github.com/zeroclaw-labs/zeroclaw/pull/11921) (append-only history). *Fix PR exists (indirect).*
- [#11962](https://github.com/zeroclaw-labs/zeroclaw/issues/11962) — daemon's 64 live RPC sessions are never released when idle; remote clients can exhaust the cap. #11964 is referenced as related session-retirement work in the #11986 stack.
- [#11991](https://github.com/zeroclaw-labs/zeroclaw/issues/11991) — outbound email HTML passes raw markup and arbitrary image URLs from agent text (Markdown→HTML passthrough via `pulldown-cmark`). Related feature PR: [#11992](https://github.com/zeroclaw-labs/zeroclaw/issues/11992) proposes sanitised HTML body. *Partial fix path exists.*
- [#11989](https://github.com/zeroclaw-labs/zeroclaw/issues/11989) — per-channel `excluded_tools` is never applied. No fix PR.
- [#11970](https://github.com/zeroclaw-labs/zeroclaw/issues/11970) — `agents delete/rename` skip owned-state cascade and live-ACP check in gateway-less builds. Addressed by PR [#11973](https://github.com/zeroclaw-labs/zeroclaw/pull/11976) (merged into #11976).
- [#12008](https://github.com/zeroclaw-labs/zeroclaw/issues/12008) — cron announcements and one-off sends go out through a disabled channel instance (only QQ honours `enabled`). No fix PR.
- [#11823](https://github.com/zeroclaw-labs/zeroclaw/issues/11823) — shell scanner skips command substitution in unquoted-delimiter heredoc bodies (security/sandbox). No fix PR.

**S3 — minor**
- [#11972](https://github.com/zeroclaw-labs/zeroclaw/issues/11972) — `gateway get-paircode` exits 0 on failure.
- [#11987](https://github.com/zeroclaw-labs/zeroclaw/issues/11987) — inline `nosemgrep` comments don't suppress Semgrep code-scanning alerts.
- [#11969](https://github.com/zeroclaw-labs/zeroclaw/issues/11969) — `metrics`/`embedded-web` features compile the whole gateway into headless builds.
- [#12006](https://github.com/zeroclaw-labs/zeroclaw/issues/12006) — `tool_search` serves deferred tool schemas from assembly-time copy; stale after config reload. *Fix PR exists:* [#12007](https://github.com/zeroclaw-labs/zeroclaw/pull/12007).
- [#12002](https://github.com/zeroclaw-labs/zeroclaw/issues/12002) — gateway/ACP autosave writes every user message under the fixed key `"user_msg"`, overwriting prior turns. No fix PR.
- [#12005](https://github.com/zeroclaw-labs/zeroclaw/issues/12005) — PowerShell dialect rejects any argument with a bare `@` (regression in v0.8.6, `c473221`), making an allowlisted mail CLI unusable on Windows.

**Assessment:** 16 bugs touched today, with several clustered on channel delivery and session persistence. The concentration of S2s in `channels` and `runtime/daemon` suggests these subsystems need a dedicated stabilization pass before v0.9.0.

## 6. Feature Requests & Roadmap Signals

Issues/PRs marked `release:v0.9.0` — strong signals for the next version:

- **Identity & access:** OIDC dashboard sign-in ([#11961](https://github.com/zeroclaw-labs/zeroclaw/issues/11961) / PR [#11965](https://github.com/zeroclaw-labs/zeroclaw/pull/11965)), scoped dashboard chat for non-admin accounts ([#11984](https://github.com/zeroclaw-labs/zeroclaw/issues/11984) / PR [#11986](https://github.com/zeroclaw-labs/zeroclaw/pull/11986)), plus JWKS/race test coverage ([#11985](https://github.com/zeroclaw-labs/zeroclaw/issues/11985)).
- **Deployment flexibility:** CLI-only source build without gateway/dashboard ([#11971](https://github.com/zeroclaw-labs/zeroclaw/issues/11971)) with CI ratchet (PR [#11976](https://github.com/zeroclaw-labs/zeroclaw/pull/11976)); feature-edge cleanup ([#11969](https://github.com/zeroclaw-labs/zeroclaw/issues/11969)).
- **Channels:** Email operator templates and sanitised HTML body ([#11992](https://github.com/zeroclaw-labs/zeroclaw/issues/11992)); explicit `send_via` attachments under read policy ([#11996](https://github.com/zeroclaw-labs/zeroclaw/issues/11996)); XMPP/Prosody with optional OMEMO (PR [#11847](https://github.com/zeroclaw-labs/zeroclaw/pull/11847)).
- **Security policy UX:** shell refusals that name the rule and accept an operator hint ([#11799](https://github.com/zeroclaw-labs/zeroclaw/issues/11799)).
- **Providers:** DeepSeek Web Search provider ([#12000](https://github.com/zeroclaw-labs/zeroclaw/issues/12000)); OpenRouter balance-reporting toggle (PR [#11846](https://github.com/zeroclaw-labs/zeroclaw/pull/11846)).

**Prediction for v0.9.0:** OIDC dashboard sign-in + scoped chat, CLI-only builds, the append-only session history kernel (PR #11921), and at least one of the email-channel features. The MITM egress proxy RFC ([#12001](https://github.com/zeroclaw-labs/zeroclaw/issues/12001)) is a larger security-model change and likely lands later. DeepSeek search is low-risk and could slip in if a contributor picks it up.

## 7. User Feedback Summary

**Pain points:**
- **Silent policy failures.** Users cannot tell *why* a shell command was refused ([#11799](https://github.com/zeroclaw-labs/zeroclaw/issues/11799)) and `get-paircode` reports failure yet exits 0 ([#11972](https://github.com/zeroclaw-labs/zeroclaw/issues/11972)) — a recurring theme of ambiguous operator diagnostics.
- **Data loss / session integrity.** Context trimming permanently deletes history ([#11711](https://github.com/zeroclaw-labs/zeroclaw/issues/11711)) and autosave overwrites under a fixed key ([#12002](https://github.com/zeroclaw-labs/zeroclaw/issues/12002)).
- **Security-tooling friction.** `nosemgrep` not suppressing code-scanning alerts ([#11987](https://github.com/zeroclaw-labs/zeroclaw/issues/11987)) and PowerShell `@` over-blocking ([#12005](https://github.com/zeroclaw-labs/zeroclaw/issues/12005)) frustrate contributors and Windows users respectively.
- **Channel correctness.** Disabled channels still delivering ([#12008](https://github.com/zeroclaw-labs/zeroclaw/issues/12008)), `excluded_tools` ignored ([#11989](https://github.com/zeroclaw-labs/zeroclaw/issues/11989)), and raw HTML/remote images in email ([#11991](https://github.com/zeroclaw-labs/zeroclaw/issues/11991)) suggest channel config is under-enforced.

**Use cases surfacing:** minimal/headless server installs (CLI-only build), non-admin multi-tenant dashboards (OIDC + scoped chat), operator-branded outbound email, and Windows/mail-automation workflows (PowerShell + allowlisted mail CLI). Satisfaction signals are absent (no 👍 on any item); frustration is expressed through precise, well-reproduced bug reports — a sign of an engaged but demanding user base.

## 8. Backlog Watch

Items needing maintainer attention:

- **[#9746](https://github.com/zeroclaw-labs/zeroclaw/pull/9746)** — per-agent ownership scoping for session tools and `discord_search`. Open since **2026-08-04** (~81 days), XL, p1, `needs-author-action`. It is foundational to the identity-access workstream and is blocking clean scoping elsewhere.
- **[#11234](https://github.com/zeroclaw-labs/zeroclaw/pull/11234)** — judge queued session ownership by current authority. Open since 2026-09-29, p1, `needs-maintainer-review`, risk:high. Repeatedly rebased; awaiting review.
- **[#11230](https://github.com/zeroclaw-labs/zeroclaw/pull/11230)** — withhold session-data tools from non-admin principals. Open since 2026-09-29, p1, release-gate; stacked and waiting.
- **[#11061](https://github.com/zeroclaw-labs/zeroclaw/pull/11061)** — block high-risk shell commands even when allowlisted. Small (size:S), high-impact security fix open since 2026-09-23 — a cheap win sitting idle.
- **[#11313](https://github.com/zeroclaw-labs/zeroclaw/pull/11313)** — publish authorization edits from `config set`/`config patch` into the running daemon. p1, `needs-maintainer-review`, open since 2026-10-01.
- **[#8279](https://github.com/zeroclaw-labs/zeroclaw/issues/8279)** — S0 delegate allowlist bypass. Open since 2026-06-24; the single highest-severity open security issue and it has no dedicated fix PR.

**Bottom line:** ZeroClaw's development pipeline is broad and security-focused, but the project is carrying significant open-PR and review debt heading into v0.9.0. Clearing the stacked p1/release-gate PRs (#11230, #11234, #11313, #9746) and the S0 delegate bypass should be the maintainers' immediate priority; the S1 OIDC enrollment bug (#11957) needs an owner this week.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*