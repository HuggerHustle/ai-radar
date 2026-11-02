# OpenClaw Ecosystem Digest 2026-11-02

> Issues: 500 | PRs: 500 | Projects covered: 5 | Generated: 2026-11-02 00:34 UTC

- [OpenClaw](https://github.com/openclaw/openclaw)
- [Hermes Agent](https://github.com/nousresearch/hermes-agent)
- [IronClaw](https://github.com/nearai/ironclaw)
- [QwenPaw](https://github.com/agentscope-ai/QwenPaw)
- [ZeroClaw](https://github.com/zeroclaw-labs/zeroclaw)

---

## OpenClaw Deep Dive

# OpenClaw Project Digest — 2026-11-02

## 1. Today's Overview

OpenClaw shows sustained high-velocity activity: **500 issues** and **500 PRs** were updated in the last 24h, split nearly evenly between open and closed states (271 open / 229 closed issues; 280 open / 220 merged-or-closed PRs). No new releases shipped today, so the bulk of activity is maintenance, review, and triage work. However, the issue tracker is dominated by **stale-tagged, P1/P2 items** — many carrying P0 "diamond lobster" ratings with `clawsweeper:no-new-fix-pr` — indicating a growing gap between reported defects and fixes landing on `main`. Several long-running regressions (gateway event-loop blocking, memory provenance exclusion, plugin migration convergence) remain unresolved while UI/phone-width and Slack/multiline polish PRs move toward merge. Overall health is **active but backlog-stressed**: strong contributor throughput, weak closure rate on high-severity bugs.

## 2. Releases

No new releases in the last 24 hours. Latest known shipping point referenced in the data is `2026.10.8` (issue #187900), with users still on `2026.9.x` reporting regressions introduced as far back as `2026.9.3`–`2026.9.7`.

## 3. Project Progress

Notable PRs merged/closed (or advanced) today:

- **PR #190730 [CLOSED]** — `fix: preserve multiline Slack, Feishu, and Zalo command arguments` — supersedes #185267 and closes #185266. Multiline `/btw` and `/loop` payloads now reach command dispatch intact. [Link](https://github.com/openclaw/openclaw/pull/190730)
- **PR #185267 [CLOSED]** — Prior attempt at the same multiline-command fix across Slack/Feishu/Zalo. [Link](https://github.com/openclaw/openclaw/pull/185267)
- **PR #190196 [CLOSED]** — `fix(voice-call): preserve spaces after Unicode transcript overlaps` — fixes the `Meet in İstanbultomorrow` concatenation bug in realtime voice. [Link](https://github.com/openclaw/openclaw/pull/190196)
- **PR #188633 [CLOSED]** — `fix(macos): screen.record reports requested instead of recorded duration/fps` — closes #187604; recording metadata now reflects actual output. [Link](https://github.com/openclaw/openclaw/pull/188633)
- **PR #190643 [CLOSED]** — `fix(codex): retain compatible tool catalogs on settled local threads` — resolves conversation loss after compatible tool additions. [Link](https://github.com/openclaw/openclaw/pull/190643)
- **PR #185434 [CLOSED]** — `fix(exec): macOS app node exec with timeoutSeconds 0 ends after 20 seconds` — long-standing `timeoutSeconds: 0` regression on macOS nodes. [Link](https://github.com/openclaw/openclaw/pull/185434)
- **PR #190725 [CLOSED]** — `chore(matrix): trim unused send fixtures and assertions` — test hygiene only. [Link](https://github.com/openclaw/openclaw/pull/190725)

Advancing toward merge (open, ready-for-maintainer-look): #190727 (cron failure observations for plugins), #190318 (outbound delivered-receipt retention after heartbeat renewal failure), #190721 (memory `forget --json` honesty), #180212 (watchdog cause preservation in automation failures).

## 4. Community Hot Topics

Top discussions by comment count:

| Item | Title | Comments | Link |
|---|---|---|---|
| #160959 | P0: Gateway blocks for minutes capturing large external plugins (2026.9.6 regression) | 69 | [Link](https://github.com/openclaw/openclaw/issues/160959) |
| #42475 | Feature: Per-agent cost budget enforcement at gateway (CLOSED) | 29 | [Link](https://github.com/openclaw/openclaw/issues/42475) |
| #53408 | Bug: `write`/`exec` parameters silently dropped after long conversations | 16 | [Link](https://github.com/openclaw/openclaw/issues/53408) |
| #153426 | P0: Curated memory roots silently excluded from bootstrap injection by provenance ratchet | 16 | [Link](https://github.com/openclaw/openclaw/issues/153426) |
| #144502 | WhatsApp mobile can't play TTS voice notes (CLOSED) | 15 | [Link](https://github.com/openclaw/openclaw/issues/144502) |
| #143632 | iMessage inbound messages re-delivered 2–3× (CLOSED) | 15 | [Link](https://github.com/openclaw/openclaw/issues/143632) |

**Underlying needs analysis:** The dominant clustering is around **reliability and observability of the agent runtime**:
1. **Performance/crash-loop regressions** from recent feature work (#160959, #167557) — the plugin-generation capture feature shipped in 2026.9.6 appears to have introduced process-blocking behavior at startup and re-publish.
2. **Memory subsystem trust** — two independent reports (#153426, #137613, #138561) describe silent memory loss: curated `MEMORY.md`/`USER.md` being dropped from bootstrap, and pre-compaction flush gated off on CLI backends. Users have no diagnostics or recovery path.
3. **Cost governance** — #42475 (per-agent budgets), though closed, accumulated significant interest, suggesting operators want gateway-level spend guardrails.
4. **Message integrity** — #53408 and #143632 both involve silent parameter/duplicate-message failures where the UI shows nothing wrong.

## 5. Bugs & Stability

Ranked by severity from today's updates:

### P0 / Crash-Loop / Release-Blocker
- **#160959** — Gateway event-loop blocks for **minutes** when capturing large external plugin dependency trees (regression from #144252, shipped 2026.9.6). 69 comments, `clawsweeper:no-new-fix-pr`, `impact:crash-loop`. No fix PR. [Link](https://github.com/openclaw/openclaw/issues/160959)
- **#153426** — `MEMORY.md`/`USER.md` **permanently and silently** excluded from bootstrap injection once provenance `originClass` flips to `"untrusted"` — triggerable by ordinary web-search turns. No CLI, no diagnostics, no recovery. `impact:ux-release-blocker`. [Link](https://github.com/openclaw/openclaw/issues/153426)

### P1
- **#187900** — `openclaw doctor` hangs indefinitely at startup title frame on Linux (all modes, PTY and non-interactive). `impact:crash-loop`. [Link](https://github.com/openclaw/openclaw/issues/187900)
- **#167557** — Deferred plugin data/settings migration never converges on Linux/npm; "managed handoff lease database identity changed". [Link](https://github.com/openclaw/openclaw/issues/167557)
- **#167876** — Talk consultations lose caller authority after session setup. `impact:security`. [Link](https://github.com/openclaw/openclaw/issues/167876)
- **#156895** — Agent-created automation jobs fail closed in ~20ms with "Scheduled account is unavailable" despite being configured. `impact:security`. [Link](https://github.com/openclaw/openclaw/issues/156895)
- **#138272** — Android Talk (gateway-relay) drops with "no live response owner" on task-requiring turns; confirmed across 3 versions. [Link](https://github.com/openclaw/openclaw/issues/138272)
- **#144336** — Deferred config-reload restart (SIGUSR1) fails its shutdown step. [Link](https://github.com/openclaw/openclaw/issues/144336)
- **#128140** — `memory_search` tool always times out (15s) while CLI `openclaw memory search` works. [Link](https://github.com/openclaw/openclaw/issues/128140)
- **#128067** — Beta.7 field report: 6 reliability defect classes (persistence, delivery, restart-recovery). [Link](https://github.com/openclaw/openclaw/issues/128067)
- **#137710** — Native Codex completion recorded but does not wake `sessions_yield` parent. `clawsweeper:linked-pr-open`. [Link](https://github.com/openclaw/openclaw/issues/137710)
- **#140455** — `@openclaw/google-meet` 2026.9.2 agent voice broken on current Meet (circular-JSON crash). [Link](https://github.com/openclaw/openclaw/issues/140455)

### P2 / Notable
- **#53408** — `write`/`exec` tool parameters silently dropped after 15+ turns (2 👍). [Link](https://github.com/openclaw/openclaw/issues/53408)
- **#164394** — Control UI WebChat transcript micro-jitter. [Link](https://github.com/openclaw/openclaw/issues/164394)
- **#173058** — **Security:** `tools.fs.workspaceOnly` doesn't restrict file tools — agent runtime also gets OpenClaw state root as allowed working dir. [Link](https://github.com/openclaw/openclaw/issues/173058)
- **#154474** — Completion batch republished ~15× to top-level session; operator stop dropped mid-loop. [Link](https://github.com/openclaw/openclaw/issues/154474)
- **#141172** — `agent.run.started` leaked forever when a run dies before first session commit; FK failure + `appendTranscriptEventSync` throws. [Link](https://github.com/openclaw/openclaw/issues/141172)
- **#131150** — Slack DMs silently dropped for all accounts after gateway restart with multi-account socket mode. [Link](https://github.com/openclaw/openclaw/issues/131150)
- **#114913** — Memory search: bound primary embeddings before outer tool deadline and fall back to FTS. [Link](https://github.com/openclaw/openclaw/issues/114913)

**Fix PR status:** Most P0/P1 items carry `clawsweeper:no-new-fix-pr` — i.e., **no fix PR exists**, only #137710 has a linked open PR. This is the single most important health signal in today's data.

## 6. Feature Requests & Roadmap Signals

High-signal feature requests updated today:

- **#67413** — Per-agent dreaming configuration (5 👍) — currently memory-core dreaming runs on all workspaces simultaneously, causing memory spikes and OOM kills. Strong candidate for next minor. [Link](https://github.com/openclaw/openclaw/issues/67413)
- **#138366** — Let memory slot owner drive the Dreams page (`dreaming` provider in `MemoryPluginCapability`). [Link](https://github.com/openclaw/openclaw/issues/138366)
- **#128090** — Rendered Markdown preview in Review files (4 👍). [Link](https://github.com/openclaw/openclaw/issues/128090)
- **#91676** — Opt-in `skills.workshop.allowSandboxedAgents` to expose `skill_workshop` to sandboxed agents (2 👍, `needs-security-review`). [Link](https://github.com/openclaw/openclaw/issues/91676)
- **#42475** — Per-agent cost budget enforcement at gateway (CLOSED but heavily discussed; likely to return). [Link](https://github.com/openclaw/openclaw/issues/42475)
- **#128067** — Field report bundling 6 reliability classes — effectively a roadmap signal for restart-recovery and persistence work. [Link](https://github.com/openclaw/openclaw/issues/128067)
- **#55372** — Config option to disable restart sentinel notification. [Link](https://github.com/openclaw/openclaw/issues/55372)
- **#138561** — `active-memory` plugin stops recalling after 2026.8.2 with no info-level signal (regression). [Link](https://github.com/openclaw/openclaw/issues/138561)

**Prediction:** Given the volume of memory-subsystem issues (#153426, #137613, #138561, #128140, #114913, #138366), the next releases are likely to prioritize **memory provenance diagnostics, dreaming configuration, and memory-search deadline bounding** over pure feature additions.

## 7. User Feedback Summary

Real user pain points visible in today's data:

- **Silent failure is the top complaint pattern.** Memory files vanish (#153426), Slack DMs drop (#131150), tool parameters disappear (#53408), iMessage duplicates arrive (#143632), and WebChat duplicates text (#140723) — all with **no user-visible error**. Users repeatedly request diagnostics and recovery paths.
- **Operators want cost and resource control.** #42475 (budget caps) and #67413 (dreaming OOM) show production deployments struggling with runaway spend and memory.
- **Multi-account / multi-agent deployments are stressed.** #131150 (19 Slack accounts), #128067 (6 agents, heavy cron) — real-world scale exposes restart-recovery and identity-stability defects.
- **Mobile and voice UX remains friction-heavy.** #137508 (Android keyboard occlusion), #124759 (iOS lag with reasoning panel), #164394 (WebChat jitter), #140455 (Meet voice), #138272 (Android Talk drops).
- **Upgrade safety is a recurring theme.** #122019 asks `openclaw update status` to report plugin compatibility and irreversible-migration risk — indicating pain from 2026.9.x upgrades breaking plugin state (#167557, #144447).
- **Satisfaction signals:** sustained high PR throughput from named contributors (vincentkoc, vyctorbrzezowski, roboclaw-bot, etzelm) shows an engaged community; UI phone-width PRs (#190387, #190372, #190409, #190420, #190432) demonstrate responsiveness to mobile feedback.

## 8. Backlog Watch

Long-unanswered or aging high-importance items needing maintainer attention:

- **#42475** — Per-agent cost budget (created 2026-03-10, CLOSED as stale after 29 comments). Users will re-file; needs product decision. [Link](https://github.com/openclaw/openclaw/issues/42475)
- **#53408** — Silent `write`/`exec` parameter drop (created 2026-03-24, still OPEN, 16 comments, `needs-info`). High user impact, low maintainer signal. [Link](https://github.com/openclaw/openclaw/issues/53408)
- **#91676** — `skills.workshop.allowSandboxedAgents` (created 2026-06-09, `needs-security-review` + `needs-product-decision`). Blocked on policy, not engineering. [Link](https://github.com/openclaw/openclaw/issues/91676)
- **#114913** — Memory-search embedding deadline bounding (created 2026-07-28, `fix-shape-clear`). Clear fix shape but no PR. [Link](https://github.com/openclaw/openclaw/issues/114913)
- **#128140** — `memory_search` 15s timeout vs. working CLI (created 2026-08-23, `needs-live-repro`). [Link](https://github.com/openclaw/openclaw/issues/128140)
- **#137613** — Pre-compaction memory flush disabled on CLI backends (created 2026-09-03, `diamond lobster`). [Link](https://github.com/openclaw/openclaw/issues/137613)
- **#141004** — `feat(audit): record observed runtime skill usage` (open PR since 2026-09-07, XL size, no rating yet). Long-lived audit surface change. [Link](https://github.com/openclaw/openclaw/pull/141004)
- **#172274** — `fix(browser): Chrome extension reports "Not installed" when macOS blocks profile reads` (open since 2026-10-14, ready for maintainer look). [Link](https://github.com/openclaw/openclaw/pull/172274)
- **#180854** — `fix(slack): stop replies after their parent is deleted` (open since 2026-10-22). [Link](https://github.com/openclaw/openclaw/pull/180854)
- **#141932** — `fix(agents): keep commentary line breaks in preamble progress text` (open since 2026-09-08, marked stale despite `proof: sufficient`). [Link](https://github.com/openclaw/openclaw/pull/141932)

**Maintainer attention priority:** Items carrying both `clawsweeper:no-new-fix-pr` and P0/P1 `impact:crash-loop` or `impact:security` flags (#160959, #153426, #187900, #167876) should be the first review targets — they are user-blocking, reproduce on current `main`, and have no code in flight.

---

## Cross-Ecosystem Comparison

# Cross-Project Ecosystem Report — Personal AI Assistants & Agent Frameworks
**Snapshot date: 2026-11-02** | Projects analyzed: OpenClaw (reference), Hermes Agent, IronClaw, QwenPaw, ZeroClaw

---

## 1. Ecosystem Overview

The personal AI assistant / agent open-source landscape in late 2026 has consolidated around a **gateway-plus-plugins runtime model**, where a long-lived daemon brokers multi-channel messaging (Slack, Telegram, WhatsApp, iMessage, Matrix, Feishu/Zalo), multi-surface clients (CLI, TUI, Desktop, WebUI, IDE/ACP), and pluggable memory/skill subsystems. All five projects in this snapshot are converging on the same architectural primitives — multiplexed gateway profiles, MCP tool interoperability, sandboxed execution, and persistent memory with provenance — but they diverge sharply in **maturity, governance model, and community scale**. The dominant engineering pressure across the ecosystem is no longer feature velocity; it is **trust and operability**: silent failures, cost runaway, session/identity ownership, and restart-recovery dominate the bug trackers. Two projects (OpenClaw, ZeroClaw) are in aggressive maturation with heavy review backlogs; one (Hermes) is consolidating a multi-profile stress point; one (QwenPaw) is bleeding-edge beta with active fixes in flight; and one (IronClaw) sits effectively **maintenance-stalled** on automated dependency traffic alone.

---

## 2. Activity Comparison

| Project | Issues (24h) | PRs (24h) | Release Status | Health Score* | Trending |
|---|---|---|---|---|---|
| **OpenClaw** | 500 updated (271 open / 229 closed) | 500 updated (280 open / 220 merged-closed) | No release today; latest `2026.10.8` | **62 / 100** | Active, backlog-stressed |
| **Hermes Agent** | 50 updated (48 open / 2 closed) | 50 updated (41 open / 9 merged) | No release | **66 / 100** | Stable, backlog-heavy |
| **IronClaw** | 0 | 5 open (all Dependabot) | No release | **32 / 100** | Stalled / maintenance-only |
| **QwenPaw** | 4 updated (all open) | 18 updated (17 open / 1 closed) | No release; beta `v2.3.0b2` | **58 / 100** | Iterating on beta, merge-bound |
| **ZeroClaw** | 9 updated (2 closed, 7 open) | 48 updated (43 open / 5 merged) | No release; target `v0.9.0` | **70 / 100** | High-velocity, review bottleneck |

\* *Health score is a composite heuristic weighting: throughput vs. open-backlog ratio, presence of unaddressed P0/P1 blockers, merge cadence, and contributor diversity. Not an absolute measure — use for relative comparison only.*

**Observations:**
- **OpenClaw** is an order of magnitude larger than peers by raw throughput (500/500 vs. <60 for all others combined), but carries **the largest absolute risk surface** (multiple P0 crash-loop items with `clawsweeper:no-new-fix-pr`).
- **ZeroClaw** posts the best health composite: high contributor diversity, a clear security/identity roadmap, and same-day bug-fix turnaround (e.g., #12178 → #12179) — but only 5 merges against 43 open PRs.
- **Hermes** has the healthiest *merge review* signals (`[ci-reviewed]` salvage PRs) but a **9:41 merge-to-open ratio**.
- **QwenPaw** is the only project with a public beta (`v2.3.0b2`) absorbing real breakage — a sign of active user adoption at the leading edge.
- **IronClaw** is the outlier: zero human activity, a 71-day-old `wasm` dependency PR (#7834), and no issue engagement — effectively a **project-in-hiatus** signal.

---

## 3. OpenClaw's Position

**Advantages vs. peers:**
- **Scale of community.** 500 + 500 daily item updates versus 9–50 for every peer. Named contributor churn (vincentkoc, vyctorbrzezowski, roboclaw-bot, etzelm) is an order of magnitude denser than peers, who rely on a handful of prolific authors (ZeroClaw: Audacity88, Aarlington, IftekharUddin; Hermes: teknium1 + bot scaffolding).
- **Breadth of integrations.** OpenClaw references Google Meet, iMessage, WhatsApp TTS, Zalo, Feishu, Slack, Matrix, Codex, Android Talk, macOS screen-record, and a plugin migration system — the widest channel/capability matrix in the snapshot.
- **Formal label taxonomy.** P0 "diamond lobster," `clawsweeper:*`, `impact:crash-loop`, `impact:security`, provenance ratchets — a more mature (if backlog-stressed) triage apparatus than any peer.

**Technical approach differences:**
- OpenClaw is architecturally a **general-purpose agent runtime** with gateway-level plugin *generation* and *capture* (the source of the #160959 event-loop regression), plus a curated-memory provenance system that peers lack.
- It exposes **`openclaw doctor`, `openclaw update status`, `openclaw memory search`** — CLI diagnostics that Hermes, QwenPaw, and ZeroClaw only partially match (`hermes setup`/`hermes migrate` are migration-centric; QwenPaw lacks a documented equivalent).
- Cost governance is treated as a **gateway-level concern** (#42475), whereas ZeroClaw treats it at the daemon/channel layer and Hermes at the provider/credential-pool layer.

**Community size comparison (relative):**
| Project | Est. daily contributor surface | Open backlog ratio |
|---|---|---|
| OpenClaw | ~10× peer median | 53% open |
| ZeroClaw | ~3× median (concentrated) | 90% open PRs |
| Hermes | ~2× median (bot-assisted) | 82% open PRs |
| QwenPaw | ~1× median | 94% open PRs |
| IronClaw | bot-only | N/A |

**Risk to OpenClaw's position:** Its **closure rate on high-severity bugs is the weakest relative signal in the snapshot** — P0 items like #160959, #153426, #187900 carry no fix PR. This is precisely the gap peers (ZeroClaw, QwenPaw) are narrowing via same-day companion fixes and `[ci-reviewed]` salvage PRs.

---

## 4. Shared Technical Focus Areas

Cross-project requirements emerging from independent community feedback:

### A. Memory subsystem trust & provenance
- **OpenClaw:** #153426 (curated `MEMORY.md`/`USER.md` silently excluded by provenance ratchet), #137613 (pre-compaction flush disabled on CLI), #138561, #128140, #114913.
- **Hermes:** #132347 (holographic memory returns entire fact store), #127109 (FTS5 swallows all failures as "zero results"), #126181 (retrieval_count never incremented).
- **QwenPaw:** #8500 (Auto-Dream silently drops a day of memory, checkpointed as `success=True`).
- **Need:** *Deterministic, diagnosable memory persistence with a relevance floor, error surfacing, and recovery paths.*

### B. Silent failures / observability gap
- **OpenClaw:** #53408 (tool params dropped), #131150 (Slack DMs dropped), #141172 (leaked `agent.run.started`).
- **Hermes:** #99270 (MCP array args corrupted), #146853 (Exa throttle as HTTP 200 success), #127109 (FTS5 silent zero).
- **QwenPaw:** #8500 (silent memory drop with success report).
- **ZeroClaw:** #12175 (personality editor copy lies about reload), #12176 (MCP HashMap ordering silently busts prompt cache).
- **Need:** *Every failure mode must be user-visible. This is the single most cross-cutting requirement in the snapshot.*

### C. Multi-profile / session identity isolation
- **Hermes:** #145151, #135368, #147694 (`UnscopedSecretError` family under `multiplex_profiles`), #147600 (`session.resume` WebUI failures), #147071 (CLI detaches messaging channel).
- **OpenClaw:** #167876 (Talk consultations lose caller authority), #138272 (Android Talk "no live response owner").
- **ZeroClaw:** #12131 (shared execution permissions & credential renewal), #11286 (pairing-token-to-roster binding).
- **Need:** *Cryptographically enforced profile scoping, cross-surface session portability, orphan-safe credential rotation.*

### D. Cost & resource governance
- **OpenClaw:** #42475 (per-agent gateway budget, closed-stale), #67413 (dreaming OOM).
- **Hermes:** #135816 (~$8.95 unwanted completions post-delivery), credential-pool quarantine.
- **ZeroClaw:** #11589 (cost-limit override requires daemon restart), #11456 (subprocess memory watchdog).
- **Need:** *Runtime-adjustable spend limits, per-agent/per-profile quotas, and non-restart cost overrides.*

### E. MCP / tool interoperability correctness
- **Hermes:** #99270 (array-element wrapping, 10 comments — the most-discussed bug), #78061 (tool-to-tool output passing).
- **QwenPaw:** #8424 (legacy MCP handshake hard-fail with fix PR #8445 in flight).
- **ZeroClaw:** #12176 (MCP tool ordering determinism).
- **Need:** *Graceful legacy/modern MCP negotiation, deterministic tool ordering, binary/array argument fidelity.*

### F. Restart-recovery & upgrade safety
- **OpenClaw:** #167557 (plugin migration non-convergence), #122019 (update-status compatibility report ask), #128067 (6-class field report).
- **Hermes:** #147377 (Bot Chat row un-adoptable), #147718 (stale profile names cause 404s).
- **QwenPaw:** #8515 (import-time crash on fnOS sandbox).

---

## 5. Differentiation Analysis

| Dimension | OpenClaw | Hermes Agent | IronClaw | QwenPaw | ZeroClaw |
|---|---|---|---|---|---|
| **Primary focus** | General-purpose agent runtime + gateway plugin ecosystem | Multi-surface (CLI/WebUI/TUI/ACP) session + migration breadth | WASM-sandboxed Rust agent runtime | Skills-driven assistant w/ channel breadth (Chinese-first) | Security-hardened, always-on multi-user daemon |
| **Target users** | Power operators, multi-agent deployments | Editor-embedded + desktop power users | Rust/WASM systems developers | Self-hosters, Docker/NAS, Chinese-language users | Teams running 24/7 multi-tenant agents |
| **Architecture** | Node/plugin-generation + provenance memory | Multi-profile gateway multiplex | Rust + wasmtime/WASI sandbox | Python + Tauri desktop + PyPI wheels | Rust daemon + ACP + WASM/Dioxus PoC |
| **Signature capability** | Curated memory provenance ratchet, plugin migration, codex native | Grok/OpenBot/Codex runtime migration, ACP editor sync | WASM tool isolation | Nested skill directories, QWENPAW_LANGUAGE defaults | OIDC dashboard, cost override, shared execution permissions |
| **Diagnostics maturity** | Highest (`doctor`, `update status`, `memory search`) | Medium (`setup`, `migrate`) | Minimal (maintenance mode) | Low-medium | Medium (RFC-driven) |
| **Beta posture** | Release-line (`2026.10.8`) | Pre-release | Frozen | Public beta (`2.3.0b2`) | Pre-`v0.9.0` |

**Takeaways:**
- **OpenClaw** is the broadest platform play; **ZeroClaw** is the closest peer in architectural ambition but targets **security/identity** rather than channel breadth.
- **Hermes** competes on *surface count* (CLI ↔ WebUI ↔ TUI ↔ ACP ↔ messaging) — its differentiator is session portability, and its top bug (#99270) is precisely the MCP correctness layer beneath that.
- **QwenPaw** is the only project with a clear **regional/localization** angle (QWENPAW_LANGUAGE, fnOS NAS sandboxes, Chinese-first defaults) — a defensible niche.
- **IronClaw** is architecturally distinct (WASM-first, Rust-native) but currently **non-competitive on activity**: its roadmap is effectively "clear the Dependabot queue."

---

## 6. Community Momentum & Maturity

**Activity tiers (24h):**

| Tier | Projects | Characteristics |
|---|---|---|
| **Tier 1 — High velocity** | OpenClaw, ZeroClaw | 48–500 item updates; multiple XL contributions/day; active security/RFC work |
| **Tier 2 — Consolidating** | Hermes Agent | Steady 50/50 issue+PR flow; bot-assisted salvage pipeline; merge bottleneck |
| **Tier 3 — Leading-edge beta** | QwenPaw | Small but focused; 18 PRs of which 17 open; first-time contributors onboarding |
| **Tier 4 — Dormant** | IronClaw | Automated traffic only; 71-day-old high-risk dependency PR |

**Rapidly iterating:** ZeroClaw (same-day fix→PR cycles, e.g., #12178→#12179) and OpenClaw (high-volume UI/phone-width polish PRs landing while core bugs lag). QwenPaw iterates fastest *per active issue*, but on a much smaller base.

**Stabilizing:** Hermes — the `[ci-reviewed]` + salvage-PR model indicates an organized review pipeline; the risk is queue growth, not disorder.

**Stalled:** IronClaw — the absence of even low-risk merges (#8140 serde_json patch) over 15 days implies **maintainer bandwidth loss**, not engineering difficulty.

**Maturity indicators by project:**
- **OpenClaw:** Most mature tooling surface, weakest closure discipline on P0s.
- **ZeroClaw:** Most mature **governance** posture (RFCs, security:policy labels, OIDC roadmap).
- **Hermes:** Most mature **contribution pipeline** mechanics; immature merge throughput.
- **QwenPaw:** Mature contributor onboarding (first-time XXL PR accepted for review); immature beta stability.
- **IronClaw:** Mature dependency automation; immature human engagement.

---

## 7. Trend Signals

Industry trends extracted from cross-project community feedback, with implications for AI agent developers:

1. **Silent failure is the new top-priority UX defect class.**
   Every project has ≥1 bug of the form "operation failed but UI reported success" (#8500 QwenPaw, #127109/#146853 Hermes, #12176 ZeroClaw, #53408/#153426 OpenClaw). **Build for observability-first:** every irreversible operation (memory write, message send, tool call) must have a surfaced failure channel.

2. **Memory is becoming a trust boundary, not a feature.**
   Provenance ratchets (OpenClaw), relevance floors (Hermes #132347), and checkpoint integrity (QwenPaw #8500) converge on a single requirement: *memory systems must be auditable and recoverable*. Expect provenance metadata, retrieval diagnostics, and rollback APIs to become table stakes.

3. **Multi-tenancy forces identity/secret hygiene into the core.**
   Hermes' `UnscopedSecretError` cluster and ZeroClaw's shared-execution-permissions RFC indicate that **profile-scoped secret resolution** and **credential renewal without orphaned children** will be required primitives, not options. Projects without profile isolation will fail at team scale.

4. **Cost and resource governance moves from policy to runtime.**
   Three independent asks — gateway budget enforcement (OpenClaw #42475), non-restart cost override (ZeroClaw #11589), per-agent spend caps (Hermes #135816 cascade) — point to a **runtime cost-controller** becoming a first-class component, alongside per-agent memory/subprocess watchdogs.

5. **MCP is now infrastructure; interoperability correctness is a competitive differentiator.**
   Hermes' most-commented bug is MCP array corruption; QwenPaw's top issue is MCP legacy handshake failure; ZeroClaw's is MCP ordering determinism. **MCP conformance testing should be part of every agent project's CI.**

6. **Multi-surface session ownership is unsolved across the ecosystem.**
   CLI ↔ TUI ↔ WebUI ↔ Desktop ↔ messaging hand-offs break in OpenClaw (#138272), Hermes (#147071, #147600), and QwenPaw (#8033). The first project to ship a **portable session-identity protocol** (signed session tokens with surface-agnostic ownership) will gain a durable architectural moat.

7. **Merge-cadence — not feature velocity — is the emerging ecosystem bottleneck.**
   ZeroClaw (5/48), QwenPaw (1/18), and Hermes (9/50) all show open-to-merged ratios that risk contributor attrition. **For agent developers evaluating dependencies, merge-to-open ratio is now a more predictive health signal than release cadence.**

8. **Platform-specific testing gaps are a universal liability.**
   Windows argv quoting (Hermes #140831), TrueNAS Docker (Hermes #147612), fnOS sandboxes (QwenPaw #8515), and macOS Seatbelt regexes (ZeroClaw #12150) all surfaced as production blockers. **Cross-platform CI matrices are underinvested across the entire ecosystem.**

---

*Report compiled from 2026-11-02 community digests for [OpenClaw](https://github.com/openclaw/openclaw), [Hermes Agent](https://github.com/NousResearch/hermes-agent), [IronClaw](https://github.com/nearai/ironclaw), [QwenPaw](https://github.com/agentscope-ai/QwenPaw), and [ZeroClaw](https://github.com/zeroclaw-labs/zeroclaw). Health scores are relative heuristics intended for cross-project ranking, not standalone ratings.*

---

## Peer Project Reports

<details>
<summary><strong>Hermes Agent</strong> — <a href="https://github.com/nousresearch/hermes-agent">nousresearch/hermes-agent</a></summary>

# Hermes Agent — Project Digest
**Date: 2026-11-02** | Repository: [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent)

---

## 1. Today's Overview

Hermes Agent remains in a high-velocity maintenance phase with **100 tracked items** (50 issues + 50 PRs) updated in the last 24 hours, but **zero new releases** — a signal the project is consolidating rather than shipping. The activity skew is heavily toward bug triage and fixes: 48 of 50 updated issues remain open, and only 2 were closed, while 41 of 50 PRs are open with just 9 merged/closed. A striking theme today is **multi-profile / multiplex gateway handling** — several P2 bugs (`UnscopedSecretError`, profile/session mismatch, gateway dial budgets) point to the multi-profile hosting feature being the project's current stress point. Overall project health is stable but reactive: maintainers are actively reviewing (many `[ci-reviewed]` PRs, salvage PRs by `teknium1`), yet the open-to-merged ratio suggests a growing queue that could become a throughput concern.

---

## 2. Releases

**None.** No new releases were published in the last 24 hours, and no "Latest Releases" entries exist. No changelog, breaking changes, or migration notes to report for 2026-11-02.

---

## 3. Project Progress

9 PRs were merged/closed today; concrete advances visible in the PR stream include:

- **[PR #147734](https://github.com/NousResearch/hermes-agent/pull/147734)** (open, `teknium1`) — fixes Desktop so a fallback launch doesn't silently switch gateways; explicitly stacks on #147711.
- **[PR #147735](https://github.com/NousResearch/hermes-agent/pull/147735)** (open, `[ci-reviewed]`) — ensures every gateway's sessions stay visible under "Gateway & profile" and "Project" grouping; salvages #141842 and #146576.
- **[PR #147724](https://github.com/NousResearch/hermes-agent/pull/147724)** (open, `[ci-reviewed]`) — adds migration importers for **Grok Bot** and **OpenBot** to `hermes setup` and `hermes migrate`.
- **[PR #147718](https://github.com/NousResearch/hermes-agent/pull/147718)** (open) — boots every Desktop primary on a profile its gateway actually serves, fixing 404s from stale legacy profile names.
- **[PR #147733](https://github.com/NousResearch/hermes-agent/pull/147733)** (open) — adds an FK-violation fallback for model-switch marker persistence.
- **[PR #147728](https://github.com/NousResearch/hermes-agent/pull/147728)** (open) — ACP editors (Zed) now follow agent edits to the exact line rather than a bogus "line 50".
- **[PR #147698](https://github.com/NousResearch/hermes-agent/pull/147698)** (open) — correct pricing for `opencode-go` / `opencode-zen` routes from models.dev rate cards.
- **[PR #147709](https://github.com/NousResearch/hermes-agent/pull/147709)** (open) — SimpleX plugin auto-accepts contact requests without blocking the reader.
- **Issue #68750** (BlueBubbles read receipts) was **closed** as `sweeper:cannot-reproduce`.

The dominant direction: **Desktop/gateway boot-and-profile correctness** and **agent importer breadth**.

---

## 4. Community Hot Topics

Ranked by comment count among updated items:

| Rank | Item | Comments | Signal |
|------|------|----------|--------|
| 1 | **[Issue #99270](https://github.com/NousResearch/hermes-agent/issues/99270)** — MCP client wraps each array element as `{item: …}` in `tools/call` | 10 | Breaks **every array-typed MCP argument** (`handlerIds`, `assigneeIds`, `ids`). Oldest active thread (created 2026-08-31) but still unresolved. |
| 2 | **[Issue #140831](https://github.com/NousResearch/hermes-agent/issues/140831)** — Windows `_read_process_cmdline` loses argv quoting | 6 | Profile paths with spaces break strict gateway identity and abort `hermes update`. Windows-specific. |
| 3 | **[Issue #132347](https://github.com/NousResearch/hermes-agent/issues/132347)** — Holographic memory returns entire fact store on unrelated/empty query | 5 | Security + privacy: no relevance floor in `_rank_by_vector`. |
| 4 | **[Issue #122601](https://github.com/NousResearch/hermes-agent/issues/122601)** — credential-pool recovery quarantines healthy current entry after unmatched 401 | 4 | Anthropic provider auth churn; risk to security boundary. |
| 5 | **[Issue #147377](https://github.com/NousResearch/hermes-agent/issues/147377)** — legacy Bot Chat row can't be adopted | 3 | Permanent `not_found` for 3 of 7 profiles. |
| 5 | **[Issue #78061](https://github.com/NousResearch/hermes-agent/issues/78061)** — let a tool consume previous tool output without model re-emitting | 3 | Oldest feature request in the list (created 2026-08-03). |
| 5 | **[Issue #147600](https://github.com/NousResearch/hermes-agent/issues/147600)** — `session.resume` fails for WebUI sessions | 3 | Cross-surface session portability gap. |
| 5 | **[Issue #127109](https://github.com/NousResearch/hermes-agent/issues/127109)** — FTS5 memory search swallows all failures as "zero results" | 3 | Silent recall disablement; observability gap. |
| 5 | **[Issue #147071](https://github.com/NousResearch/hermes-agent/issues/147071)** — `hermes chat -r` on a messaging session permanently detaches channel | 3 | CLI/gateway session ownership conflict. |

**Underlying needs analysis:** The hottest threads cluster around three unmet needs — (a) **MCP/tool interoperability correctness** (array args, binary pass-through), (b) **session identity & ownership across surfaces** (WebUI ↔ TUI ↔ CLI ↔ messaging platforms), and (c) **multi-profile isolation of secrets and state**. These are not cosmetic; they affect data routing and security boundaries.

---

## 5. Bugs & Stability

Ranked by severity (P-level and blast radius):

**P2 / High impact:**
- **[Issue #99270](https://github.com/NousResearch/hermes-agent/issues/99270)** — MCP array-argument corruption. Highest comment count; affects all array-typed tool calls. **No fix PR linked yet.**
- **[Issue #122601](https://github.com/NousResearch/hermes-agent/issues/122601)** — Credential-pool quarantine of healthy entry after unmatched 401 (Anthropic). Flagged `sweeper:risk-security-boundary`.
- **[Issue #135816](https://github.com/NousResearch/hermes-agent/issues/135816)** — Late internal completions caused **12 empty-response calls, ~$8.95 estimated cost** after final delivery (Telegram, Nous provider). Billing/session-state risk.
- **[Issue #146853](https://github.com/NousResearch/hermes-agent/issues/146853)** — Exa free-tier throttle arrives as HTTP 200 text; `web_search` returns success with 0 results. Marked `cause/upstream`.
- **[Issue #145151](https://github.com/NousResearch/hermes-agent/issues/145151)** — Gemini TTS `UnscopedSecretError` under `gateway.multiplex_profiles: true`.
- **[Issue #144311](https://github.com/NousResearch/hermes-agent/issues/144311)** — Desktop refuses to resume MoA (`moa://local`) sessions.
- **[Issue #135368](https://github.com/NousResearch/hermes-agent/issues/135368)** — Desktop avatar "Generate" fails on multiplexed `hermes serve` (`UnscopedSecretError` on `HERMES_CODEX_BASE_URL`).
- **[Issue #147600](https://github.com/NousResearch/hermes-agent/issues/147600)** — `session.resume` returns `not_found` for all WebUI-sourced sessions.
- **[Issue #147071](https://github.com/NousResearch/hermes-agent/issues/147071)** — CLI exit permanently detaches messaging channel; next inbound lands in an empty session.
- **[Issue #147309](https://github.com/NousResearch/hermes-agent/issues/147309)** — System prompt claims TMPDIR points to scratch even when user TMPDIR wins (Linux).
- **[Issue #147613](https://github.com/NousResearch/hermes-agent/issues/147613)** — **[Windows]** Kanban worker stalls deterministically at admission-sequence 15; task prompt never delivered.
- **[Issue #120250](https://github.com/NousResearch/hermes-agent/issues/120250)** — Expired cross-machine bot DM falsely reported as "may still be delivered… do not resend".
- **[PR #43065](https://github.com/NousResearch/hermes-agent/pull/43065)** (open, **P1**) — Adds `video_generate` to gateway auto-append media allowlist. Highest-priority PR still open since June.

**P3 / Lower impact:**
- **[Issue #140831](https://github.com/NousResearch/hermes-agent/issues/140831)** — Windows argv re-quoting breaks spaced profile paths.
- **[Issue #132347](https://github.com/NousResearch/hermes-agent/issues/132347)** — Holographic memory over-returns facts (security/privacy).
- **[Issue #127109](https://github.com/NousResearch/hermes-agent/issues/127109)** — FTS5 failures silently return zero results.
- **[Issue #123571](https://github.com/NousResearch/hermes-agent/issues/123571)** — `hermes memory setup` overwrites saved `db_path`/`auto_extract`.
- **[Issue #126181](https://github.com/NousResearch/hermes-agent/issues/126181)** — `retrieval_count` never incremented (marked duplicate).
- **[Issue #147607](https://github.com/NousResearch/hermes-agent/issues/147607)** — Desktop `::preview` frame can only grow, never shrink.
- **[Issue #87186](https://github.com/NousResearch/hermes-agent/issues/87186)** — Kanban unusable on mobile viewports.
- **[Issue #147612](https://github.com/NousResearch/hermes-agent/issues/147612)** — `browser_exec` fails to launch Chromium in TrueNAS Docker.
- **[Issue #147694](https://github.com/NousResearch/hermes-agent/issues/147694)** — Dashboard profile actions fail with `UnscopedSecretError` under multiplex.
- **[Issue #147714](https://github.com/NousResearch/hermes-agent/issues/147714)** — Bot Desktop Docker sandbox forgets Xfce settings on every screen start.
- **[Issue #146730](https://github.com/NousResearch/hermes-agent/issues/146730)** — Desktop large-paste attach rejects non-LOCAL sessions with misleading toast.

**Fix PRs that exist today:** #147734, #147735, #147718, #147711, #147708, #147717, #147712 (Desktop/gateway cluster), #147357 (terminal exit attribution), #147313 (Gemini finish reasons), #147698 (pricing), #147696 (mobile notifications via service worker), #133371 (kanban block reasons).

---

## 6. Feature Requests & Roadmap Signals

Prominent requests updated today:

- **[Issue #78061](https://github.com/NousResearch/hermes-agent/issues/78061)** — Tool-to-tool output passing without the model re-emitting payloads. Addresses argument-generation budget limits for binary/large content. **High-value architectural ask.**
- **[Issue #95732](https://github.com/NousResearch/hermes-agent/issues/95732)** — Auto-resend gateway turns rejected by `max_concurrent_sessions`, with a bounded retry queue (has 1 👍).
- **[Issue #147688](https://github.com/NousResearch/hermes-agent/issues/147688)** — `hermes cron notepad set --file PATH` / stdin to avoid shell quoting for multi-KB values.
- **[Issue #27616](https://github.com/NousResearch/hermes-agent/issues/27616)** — Codex-runtime migration should preserve full-access Codex permissions (user-facing config).

**Prediction for next version:** Given the sheer volume of Desktop/gateway profile fixes already open as `[ci-reviewed]` salvage PRs (#147711, #147718, #147734, #147735), the next release is most likely a **stability release focused on multi-profile/multi-gateway correctness**, plus importer expansion (#147724). The cron `--file`/stdin and auto-resend queue are lower-probability unless picked up by a maintainer.

---

## 7. User Feedback Summary

**Pain points expressed:**
- **Session ownership confusion** — users cannot reliably move a session between CLI, WebUI, TUI, and messaging platforms (Issues #147071, #147600, #147377). One user reports a permanently orphaned "Bot Chat" row across 3 of 7 profiles.
- **Multi-profile secret scoping is leaky** — repeated `UnscopedSecretError` reports (#145151, #135368, #147694) show secrets are being resolved without a profile context under `multiplex_profiles`.
- **Silent failures erode trust** — FTS5 returning zero results on error (#127109), Exa throttle masquerading as success (#146853), and MCP array corruption (#99270) all fail *quietly*.
- **Cost surprise** — the Telegram field report (#135816) of ~$8.95 in unwanted completions despite 99.97% cache hits is a real billing-damage anecdote.
- **Platform fragility** — Windows (argv quoting, Kanban stall), TrueNAS Docker (Chromium), and Docker-sandbox Xfce persistence (#147714) suggest platform-specific testing gaps.

**Use cases in evidence:** Telegram/Feishu/Discord messaging agents, Kanban task workers, Desktop multi-gateway setups, editor-embedded ACP usage (Zed), and automated morning-brief cron jobs.

**Satisfaction signal:** Neutral-to-guarded — users are filing precise, well-documented reports (some with environment details and cost estimates), indicating engaged power users, but the density of session/secrets bugs points to friction at deployment scale.

---

## 8. Backlog Watch

Items needing maintainer attention:

| Item | Age | Why it matters |
|------|-----|----------------|
| **[PR #43065](https://github.com/NousResearch/hermes-agent/pull/43065)** (P1, `video_generate` allowlist) | Open since **2026-06-09** | Highest-priority open PR, unfixed for ~5 months despite P1 label. |
| **[Issue #78061](https://github.com/NousResearch/hermes-agent/issues/78061)** (tool-to-tool output) | Open since **2026-08-03** | Architectural feature with strong value; no linked PR. |
| **[Issue #99270](https://github.com/NousResearch/hermes-agent/issues/99270)** (MCP array args) | Open since **2026-08-31**, 10 comments | Most-discussed active bug; still no fix PR. |
| **[Issue #87186](https://github.com/NousResearch/hermes-agent/issues/87186)** (Kanban mobile) | Open since **2026-08-15** | Usability gap on mobile; likely low-priority but aging. |
| **[Issue #27616](https://github.com/NousResearch/hermes-agent/issues/27616)** (Codex permissions) | Open since **2026-05-17** | Oldest item in this digest; security-relevant permission handling. |
| **[Issue #95732](https://github.com/NousResearch/hermes-agent/issues/95732)** (auto-resend rejected turns) | Open since **2026-08-26** | Directly affects reliability of gateway message delivery. |

---

### Health Snapshot

| Metric | Value (Last 24h) |
|---|---|
| Issues updated | 50 (48 open / 2 closed) |
| PRs updated | 50 (41 open / 9 merged-closed) |
| New releases | 0 |
| Dominant risk cluster | Multi-profile/multiplex secrets & sessions |
| Dominant fix cluster | Desktop/gateway boot & profile correctness |
| Top unresolved bug | #99270 (MCP array arg corruption) |

**Assessment:** Stable but backlog-heavy. The maintainer bot activity (`teknium1` salvage PRs, `[ci-reviewed]` tags) shows a functioning review pipeline; the concern is the **merge-to-open ratio (9:41)** and several multi-week P1/P2 items without fix PRs. Recommend prioritizing #43065, #99270, and the `UnscopedSecretError` family before the next release.

</details>

<details>
<summary><strong>IronClaw</strong> — <a href="https://github.com/nearai/ironclaw">nearai/ironclaw</a></summary>

# IronClaw Project Digest — 2026-11-02

## 1. Today's Overview

IronClaw shows **dependency-maintenance-only activity** for the reporting window: zero issues updated, zero PRs merged/closed, and zero releases, with all five updated PRs being open Dependabot bumps. The project's core development pipeline appears quiet — no feature work, bug fixes, or community discussions surfaced in the last 24 hours. The most notable signal is that PR **#7834** (wasm group updates) has now been open since **2026-08-23** — over two months stale — suggesting friction in merging larger dependency batches. Activity level: **low** (maintenance mode / automated traffic only).

## 2. Releases

No new releases in the last 24 hours. *(Section omitted per no-release policy.)*

## 3. Project Progress

**No merged or closed PRs today.** All five active PRs remain open:

| PR | Group | Age | Status |
|---|---|---|---|
| [#8160](https://github.com/nearai/ironclaw/pull/8160) | everything-else (43 updates) | 8 days | Open |
| [#8159](https://github.com/nearai/ironclaw/pull/8159) | actions (11 updates) | 8 days | Open |
| [#8141](https://github.com/nearai/ironclaw/pull/8141) | tokio-ecosystem (5 updates) | 15 days | Open |
| [#8140](https://github.com/nearai/ironclaw/pull/8140) | serialization (1 update) | 15 days | Open |
| [#7834](https://github.com/nearai/ironclaw/pull/7834) | wasm (4 updates) | 71 days | Open |

No features advanced and no fixes landed. The absence of merges — even of low-risk patch bumps like #8140 (serde_json `1.0.151` → `1.0.154`) — indicates either a maintainer bandwidth gap or a CI/review bottleneck.

## 4. Community Hot Topics

No issues or PRs recorded comments or reactions (all `Comments: undefined`, 👍: 0), so there are **no community-discussion hot spots** today. In the absence of human commentary, the implicit "hot topic" is the **dependabot queue itself**:

- [#7834 — wasm group bump](https://github.com/nearai/ironclaw/pull/7834) — flagged `size: L`, `risk: medium`, `scope: dependencies`, `contributor: experienced`. This is the highest-attention item by label metadata and by age, and likely requires manual validation (wasmtime/WASI upgrades could affect IronClaw's sandbox/isolation semantics for agent tool execution).
- [#8160 — 43-package everything-else bump](https://github.com/nearai/ironclaw/pull/8160) — a breadth-heavy batch that increases regression surface if merged without review.

**Underlying need:** automation is working, but there appears to be no maintainer throughput to clear the dependency queue — a scaling pain point rather than a user-facing one.

## 5. Bugs & Stability

**No bugs, crashes, or regressions were reported today** (0 issues updated, open/active: 0). No fix PRs exist because no defects were filed internally.

**Latent stability risk (not a filed bug):** the prolonged openness of dependency PRs means the project is drifting behind on upstream patches. In an agent/runtime project like IronClaw, delayed `wasmtime`/`tokio` updates can quietly carry security and runtime-stability fixes; #7834 and #8141 are the two most stability-relevant items to watch, though neither is currently reported as blocking anything.

## 6. Feature Requests & Roadmap Signals

No user-filed feature requests appeared in this window. **Roadmap inference is limited**, but the dependency groups hint at architectural priorities:
- Presence of a dedicated **wasm group** (#7834) signals continued investment in WASM-based sandboxing/tool isolation.
- The **tokio-ecosystem group** (#8141) indicates an async, Rust-native runtime core.

Prediction: the only "upcoming changes" realistically landing next are the parked dependency batches — **#8140 (serde_json)** is the most likely to merge first given its minimal scope, followed by #8141 once tested against the async runtime.

## 7. User Feedback Summary

There is **no direct user feedback** in this window — no issue comments, no reactions, no new reports. Consequently there are no documented pain points, use cases, or satisfaction signals to report. This is itself a data point: the project's visible surface is currently dominated by bot activity rather than user engagement.

## 8. Backlog Watch

Items needing maintainer attention, ranked by staleness and impact:

1. **[#7834 — wasm group bump (4 updates)](https://github.com/nearai/ironclaw/pull/7834)** — open **71 days**. Labeled `size: L` / `risk: medium`; highest-priority backlog item. Requires human review of wasmtime/WASI behavior changes.
2. **[#8141 — tokio-ecosystem (5 updates)](https://github.com/nearai/ironclaw/pull/8141)** — open **15 days**. Async-runtime dependencies; worth validating against agent concurrency paths.
3. **[#8140 — serde_json (1 update)](https://github.com/nearai/ironclaw/pull/8140)** — open **15 days**. Lowest-risk, quickest win; should not be sitting idle.
4. **[#8160](https://github.com/nearai/ironclaw/pull/8160)** / **[#8159](https://github.com/nearai/ironclaw/pull/8159)** — open **8 days**. Broad-scope batches (43 and 11 packages respectively); mergeable only after CI confidence.

**Health verdict:** The project is not broken but is **stalled on maintenance throughput** — zero human-driven activity, zero issues engagement, and a two-month-old high-risk dependency PR lingering. Recommend a maintainer triage pass to clear #8140 and #8141 this week to keep the dependency surface current.

---
*All data sourced from the provided 2026-11-02 GitHub snapshot for [nearai/ironclaw](https://github.com/nearai/ironclaw). No releases, issues, or merged PRs existed to report; sections 2 and 3 reflect that absence.*

</details>

<details>
<summary><strong>QwenPaw</strong> — <a href="https://github.com/agentscope-ai/QwenPaw">agentscope-ai/QwenPaw</a></summary>

# QwenPaw Project Digest — 2026-11-02

## 1. Today's Overview

QwenPaw shows **moderate-to-high maintenance activity** over the last 24 hours: 4 issues and 18 PRs were updated, but **zero new releases** and only **1 PR merged/closed**. The activity pattern is heavily skewed toward *open* work — 17 of 18 PRs remain open, and all 4 issues are active/unresolved. This suggests a healthy inflow of contributions and bug reports but a potential review/merge bottleneck at the maintainer level. Two clusters dominate today's activity: **legacy MCP protocol negotiation failures** (#8424 / PR #8445) and **restricted-environment startup crashes** (fnOS sandbox, #8515 / PRs #8525, #8527), both of which have fix PRs already in flight. Meanwhile, a first-time contributor's XXL skill-directory PR (#8178) continues under review, signaling community onboarding is working.

## 2. Releases

**No new releases in the last 24 hours.** The latest referenced version in the issue tracker is `v2.3.0b2` (PyPI wheel), which is currently implicated in the fnOS sandbox startup crash (#8515). No changelog, breaking-change, or migration notes are available for this digest.

## 3. Project Progress

Only one PR was closed in the reporting window:

- **[#8033 [CLOSED] fix(tauri): stop reconciling away a live desktop instance's backend](https://github.com/agentscope-ai/QwenPaw/pull/8033)** — Resolves a Windows desktop app bug where relaunching while an instance is running causes the second instance's backend to terminate the first instance's live backend, leaving the first window permanently broken after the second is closed. Closed without merge details; worth confirming whether it was superseded.

Notable **feature PRs advancing** (still open, under review, or sizeable):
- **[#8178 feat(skills): support nested (categorised) skill directories](https://github.com/agentscope-ai/QwenPaw/pull/8178)** — first-time contributor, XXL size; enables `<root>/<category>/<skill>/SKILL.md` layout while preserving flat layout.
- **[#8367 feat(chats): add keyword and agentic conversation search](https://github.com/agentscope-ai/QwenPaw/pull/8367)** — XXL; addresses the failure of title-only filtering in large histories.
- **[#8526 feat(config): honor QWENPAW_LANGUAGE for fresh agent defaults](https://github.com/agentscope-ai/QwenPaw/pull/8526)** — fixes hardcoded `"zh"` defaults for unattended Docker first-boot.

Overall, the project advanced mainly on **stability fixes** rather than net-new shipped features today.

## 4. Community Hot Topics

- **[Issue #8424 — `server/discover` HTTP 404 + JSON-RPC -32601 hard-fails legacy MCP handshake](https://github.com/agentscope-ai/QwenPaw/issues/8424)** — 5 comments, the most-discussed issue. Legacy-only MCP servers that reply to unknown methods with `404 {"code":-32601}` are never given the legacy `initialize` fallback. **Underlying need:** broad MCP ecosystem interoperability — users run mixed modern/legacy MCP servers and expect graceful negotiation. A fix exists: **[PR #8445](https://github.com/agentscope-ai/QwenPaw/pull/8445)**.

- **[Issue #8500 — Auto-Dream silently drops a day of memory and checkpoints unusable files](https://github.com/agentscope-ai/QwenPaw/issues/8500)** — 3 comments. Memory extracts that fail to parse still get checkpointed, so content is never retried while the run reports `success=True`. **Underlying need:** data-loss-grade trust in the memory pipeline; silent success on dropped content is a serious integrity concern.

- **[Issue #8515 — v2.3.0b2 crashes at import in fnOS app sandbox](https://github.com/agentscope-ai/QwenPaw/issues/8515)** — 2 comments. `dependency_maintenance.state_root()` prefers `pwd` home over `$HOME`, bypassing `QWENPAW_DEPENDENCY_STATE_DIR` (undocumented). **Underlying need:** deployment on NAS/container sandboxes and read-only images — a growing self-hosting segment.

- **[Issue #8523 — Task scheduling / auto-dispatch entry point for agents](https://github.com/agentscope-ai/QwenPaw/issues/8523)** — 1 comment, enhancement request for daily scheduling ("do X from 9–12"), exception push to IM, and human-confirmed transitions. **Underlying need:** teams want to assign work to AI agents the same way they assign work to people.

## 5. Bugs & Stability

Ranked by severity:

| Severity | Item | Description | Fix PR? |
|---|---|---|---|
| **Critical** | [#8515](https://github.com/agentscope-ai/QwenPaw/issues/8515) — import-time crash on fnOS sandbox | `PermissionError` at import; process cannot start at all on restricted hosts. | ✅ [#8525](https://github.com/agentscope-ai/QwenPaw/pull/8525) (trust HOME over passwd home), [#8527](https://github.com/agentscope-ai/QwenPaw/pull/8527) (report unusable state root at startup) |
| **High** | [#8500](https://github.com/agentscope-ai/QwenPaw/issues/8500) — Auto-Dream silent memory loss | Full day of memory discarded and checkpointed as success; never retried. Data-integrity + observability failure. | ❌ None yet |
| **High** | [#8424](https://github.com/agentscope-ai/QwenPaw/issues/8424) — MCP legacy handshake hard-fail | Legacy MCP servers unusable; `HttpAutoClient` never falls back. | ✅ [#8445](https://github.com/agentscope-ai/QwenPaw/pull/8445) |

Additional stability fixes in flight (not from today's new reports, but updated in-window):
- **[#8411 fix(matrix): recover cached sessions and missing device keys](https://github.com/agentscope-ai/QwenPaw/pull/8411)** — channel can appear healthy while decryption fails.
- **[#8302 fix(channels): retain consumers until shutdown cleanup finishes](https://github.com/agentscope-ai/QwenPaw/pull/8302)** — fixes `Task was destroyed but it is pending!` GC races.
- **[#8304 fix(matrix): normalize pasted connection credentials](https://github.com/agentscope-ai/QwenPaw/pull/8304)** — whitespace in pasted IDs/tokens causing auth failures.
- **[#8524 fix(desktop): open workspace HTML via decoded local path](https://github.com/agentscope-ai/QwenPaw/pull/8524)** — Windows `os.startfile` breakage from percent-encoded URIs.

## 6. Feature Requests & Roadmap Signals

- **Task scheduling / agent work dispatch ([#8523](https://github.com/agentscope-ai/QwenPaw/issues/8523))** — The clearest roadmap signal: users want scheduled task queues with IM notifications, exception push, and human confirmation gates. If adopted, this would be a headline feature for a future minor release.
- **Nested skill directories ([#8178](https://github.com/agentscope-ai/QwenPaw/pull/8178))** — Aligns QwenPaw's skill layout with other agents; likely in a near-term release given first-time-contributor status and review progress.
- **Conversation content search ([#8367](https://github.com/agentscope-ai/QwenPaw/pull/8367))** — Keyword + agentic search directly addresses large-history usability.
- **Localization defaults ([#8526](https://github.com/agentscope-ai/QwenPaw/pull/8526))** — `QWENPAW_LANGUAGE` honored on fresh installs; important for non-Chinese Docker deployments.
- **Ollama model discovery during setup ([#8309](https://github.com/agentscope-ai/QwenPaw/pull/8309))** — UX polish for local-model users.

**Prediction:** The strongest candidates for the next version are the MCP fallback (#8445) and sandbox startup fixes (#8525/#8527), since they unblock existing users; feature-wise, skill directory nesting and configurable language defaults are closest to merge.

## 7. User Feedback Summary

**Pain points:**
- **Interoperability friction with legacy MCP servers** — users expect the client to be tolerant of servers implementing older handshakes rather than hard-erroring.
- **Silent data loss erodes trust** — the Auto-Dream report frames the issue as "run reports `success=True` while content is dropped," which is the kind of feedback that damages confidence in agent memory systems.
- **Deployment environments are more constrained than assumed** — NAS sandboxes (fnOS) and read-only images break at *import time*, before any diagnostic command can run, and the override variable (`QWENPAW_DEPENDENCY_STATE_DIR`) is undocumented.
- **Desire for human-in-the-loop scheduling** — users want to treat agents as team members with assignable, schedulable work and confirmation checkpoints, not just chat endpoints.

**Satisfaction signals:** The presence of first-time contributors (#8178) and a steady fix pipeline suggests an engaged community. However, the high ratio of open PRs to merges (17:1 today) and multiple stability issues on beta builds indicate users on the bleeding edge (`2.3.0b2`) are absorbing real breakage.

## 8. Backlog Watch

PRs/issues aging without resolution, needing maintainer attention:

- **[#8170 fix(console): tolerate DOM-mutation render errors + chunk-error retry](https://github.com/agentscope-ai/QwenPaw/pull/8170)** — created **2026-10-10**, now 23 days old, a rebase of #7889 superseding a base-fix request; the rebase chain suggests prior review stalls.
- **[#8178 feat(skills): nested skill directories](https://github.com/agentscope-ai/QwenPaw/pull/8178)** — created **2026-10-11**, XXL size, first-time contributor; long review cycles risk losing new contributors.
- **[#8231 fix(console): persist market install provenance for 'Update All'](https://github.com/agentscope-ai/QwenPaw/pull/8231)** — created **2026-10-13**, marked Under Review; fixes #8176 and affects third-party plugin update coverage.
- **[#8027 fix(skills): offload pool skill download to a worker thread](https://github.com/agentscope-ai/QwenPaw/pull/8027)** — created **2026-09-29**, a small blocking-I/O fix in an async handler; low-risk but unmerged for over a month.
- **[#8367 conversation search](https://github.com/agentscope-ai/QwenPaw/pull/8367)** and **[#8411 Matrix session recovery](https://github.com/agentscope-ai/QwenPaw/pull/8411)** — both created in late October, sizeable and still open; early attention would prevent further drift.

**Health note:** The backlog skews toward *fixes and rebases* rather than feature creep, which is a positive sign — but the merge cadence (1 of 18 today) is the primary risk to both contributor retention and stability-issue turnaround. Prioritizing the three bug-fix PRs with linked issues (#8445, #8525, #8527) and unblocking the two oldest contributor PRs (#8178, #8170) would meaningfully improve project throughput.

</details>

<details>
<summary><strong>ZeroClaw</strong> — <a href="https://github.com/zeroclaw-labs/zeroclaw">zeroclaw-labs/zeroclaw</a></summary>

# ZeroClaw Project Digest — 2026-11-02

## 1. Today's Overview

ZeroClaw shows **high-velocity development activity** with 48 PRs and 9 issues updated in the last 24 hours, though only 5 PRs were merged/closed — indicating a substantial backlog of open reviews (43 open PRs). No new releases were cut. The project is in an intense maturation phase, with heavy focus on **runtime durability, security/identity hardening, and channel reliability**. Notably, the PR queue is dominated by large (`size:XL`) contributions from a small set of prolific authors (Audacity88, Aarlington, IftekharUddin), suggesting both strong contributor engagement and a potential **maintainer review bottleneck**. The absence of a merge/release cadence relative to the influx of new work is the primary health signal to watch.

## 2. Releases

**No new releases in the last 24 hours.** The most recent referenced release in the data is `v0.9.0` (referenced in PR #11965 and issue #12154), suggesting v0.9.0 is either the current or imminent release target. No breaking changes or migration notes to report.

## 3. Project Progress

Only 5 PRs were merged/closed today (of 48 touched). Two issues were closed:

- **[#12069](https://github.com/zeroclaw-labs/zeroclaw/issues/12069) [CLOSED]** — Feature request for `/load-session <name|uuid>` in ZeroCode's ACP pane to resume persisted sessions by name/UUID instead of relying on the `Ctrl+S` picker. Closing suggests acceptance/implementation.
- **[#12154](https://github.com/zeroclaw-labs/zeroclaw/issues/12154) [CLOSED]** — Bug: `install.sh` printed the build commit `v(99bd353)` instead of the semantic version in the install summary. A quick, low-severity fix resolving user-facing install confusion.

**Notable in-flight work advancing:**
- **[PR #12013](https://github.com/zeroclaw-labs/zeroclaw/pull/12013)** — regression test for TUI signing key precedence (extracted from #11422).
- **[PR #12150](https://github.com/zeroclaw-labs/zeroclaw/pull/12150)** — fixes macOS Seatbelt sandbox regex that never matched `~/.cargo`, `~/.nvm` etc. (#12137).
- **[PR #12179](https://github.com/zeroclaw-labs/zeroclaw/pull/12179)** — immediate companion fix to bug #12178 (`deliver_file` prose/uri confusion).

## 4. Community Hot Topics

Activity is heavily concentrated in a few high-touch threads:

- **[Issue #9597](https://github.com/zeroclaw-labs/zeroclaw/issues/9597) — "Make peer-agent turns durable and attributable"** (3 comments, open since 2026-07-31, tagged `risk:high`, `topic:agent-loop`, `follow-up`). This is the **longest-running active architectural discussion**. The core need: peer-agent turns currently launch as detached `process_message` calls with **no sender attribution or parent lifecycle**, which undermines auditability and resource governance. This points to a deeper need for **first-class task lineage in multi-agent orchestration**.

- **[Issue #12131](https://github.com/zeroclaw-labs/zeroclaw/issues/12131) — RFC: Shared execution permissions & same-identity credential renewal** (1 comment, `type:rfc`, security-triggered). Addresses a real multi-tenant scenario: a task receives input from several authenticated contributors and spawns children that outlive the initiating connection. The underlying need is **safe credential rotation without orphaning or privilege escalation**.

- **[Issue #12130](https://github.com/zeroclaw-labs/zeroclaw/issues/12130) — Configurable daemon session quotas with local operator reserve** (1 comment). The daemon's **hard-coded 64-session limit** cannot distinguish dashboard/CLI/TUI/ACP connections, so a dashboard cap can starve operators. Clear demand for **transport-aware capacity management**.

- **[PR #11589](https://github.com/zeroclaw-labs/zeroclaw/pull/11589) — Operator override of exceeded cost limits** (large, high-risk, spans every channel and the daemon). Currently, an exceeded shared cost limit can only be resolved by **restarting the daemon** — a significant operational pain point.

- **[PR #11456](https://github.com/zeroclaw-labs/zeroclaw/pull/11456) — Opt-in subprocess memory watchdog** (open since 2026-10-02). Reflects demand for **resource-safety guardrails** on shell/skill subprocesses.

**Pattern:** The community's hottest discussions all revolve around **governance and safety of autonomous execution** — attribution, credentials, quotas, cost, and memory. This is a project whose users are pushing it from "personal assistant" toward **multi-user, always-on infrastructure**.

## 5. Bugs & Stability

Ranked by severity:

| Severity | Issue | Description | Fix PR? |
|---|---|---|---|
| **S2** | [#12176](https://github.com/zeroclaw-labs/zeroclaw/issues/12176) | Deferred MCP tool list emitted in `HashMap` order → system prompt changes every session → **busts prompt caching** (cost/perf regression) | No |
| **S2 (critical runtime)** | [#12173](https://github.com/zeroclaw-labs/zeroclaw/issues/12173) | `split_markdown_chunks` in `lark.rs` slices at raw byte offset → **panics when a byte budget lands inside a multi-byte UTF-8 char**, taking down the channel task/daemon | No |
| **Low** | [#12178](https://github.com/zeroclaw-labs/zeroclaw/issues/12178) | `deliver_file` description instructs model to write machine-only `attachment://` uri into reply prose | ✅ **[PR #12179](https://github.com/zeroclaw-labs/zeroclaw/pull/12179)** |
| **S3** | [#12175](https://github.com/zeroclaw-labs/zeroclaw/issues/12175) | Personality editor copy claims "no daemon reload needed" — false for channels, sends operators chasing phantom bugs | No |

**Note:** The Lark UTF-8 panic (#12173) is the most operationally serious new bug — a daemon-crashing panic from routine markdown chunking. It is **unfixed**. The MCP HashMap ordering bug (#12176) is a silent cost-cache regression with no fix yet.

## 6. Feature Requests & Roadmap Signals

**Likely near-term (low-risk, scoped, or fix-aligned):**
- `/load-session` (from [#12069](https://github.com/zeroclaw-labs/zeroclaw/issues/12069), now closed → shipping).
- `deliver_file` description correction ([PR #12179](https://github.com/zeroclaw-labs/zeroclaw/pull/12179)).

**Strong roadmap candidates for the next minor release:**
- **Configurable daemon session quotas** ([#12130](https://github.com/zeroclaw-labs/zeroclaw/issues/12130)) — already has a placement RFC ([PR #12132](https://github.com/zeroclaw-labs/zeroclaw/pull/12132)).
- **Operator cost-limit override** ([PR #11589](https://github.com/zeroclaw-labs/zeroclaw/pull/11589)) — documented-but-unimplemented config (`cost.allow_override`), likely to land given broad maintainer attention.
- **OIDC dashboard sign-in** ([PR #11965](https://github.com/zeroclaw-labs/zeroclaw/pull/11965)) and **pairing-token-to-roster binding** ([PR #11286](https://github.com/zeroclaw-labs/zeroclaw/pull/11286)) — a security/identity cluster that could anchor a v0.9.x security release.
- **Telegram 429 flood gate** ([PR #11651](https://github.com/zeroclaw-labs/zeroclaw/pull/11651)) and **Telegram rich messages** ([PR #11862](https://github.com/zeroclaw-labs/zeroclaw/pull/11862)) — channel maturity.

**Longer-horizon:** durable peer-agent turns ([#9597](https://github.com/zeroclaw-labs/zeroclaw/issues/9597)) and shared execution permissions ([#12131](https://github.com/zeroclaw-labs/zeroclaw/issues/12131)) are architectural and unlikely to land imminently.

## 7. User Feedback Summary

**Pain points voiced by users:**
- **Operational rigidity:** Exceeded cost limits require a full daemon restart (#11589); hard-coded 64-session cap can't reserve operator capacity (#12130). Users are running ZeroClaw as always-on infrastructure and hitting fixed-limit walls.
- **Cost/caching regressions:** Non-deterministic MCP tool ordering (#12176) and personality-file prompt churn (PR #11698) directly threaten prompt-cache efficiency — users are cost-sensitive.
- **Misleading UI/config:** Personality editor copy (#12175) and `deliver_file` semantics (#12178) show a pattern of **documentation/UI drifting from runtime truth**, causing phantom debugging.
- **Reliability under load:** The Lark panic (#12173) and Telegram 429 mishandling (#11651) indicate channel-edge robustness is a recurring concern.

**Satisfaction signals:** Rapid companion PRs (bug #12178 filed and fixed the same day by the same author) and maintainer acceptance of low-friction features suggest a **responsive, contributor-friendly culture**. No hostile or dissatisfied threads observed; feedback is constructive and engineering-focused.

## 8. Backlog Watch

Items needing maintainer attention due to age, size, or risk:

- **[Issue #9597](https://github.com/zeroclaw-labs/zeroclaw/issues/9597)** — open since **2026-07-31** (~3 months), `risk:high`, `follow-up`. Peer-agent durability is foundational but stalled; needs a decision/owner.
- **[PR #11456](https://github.com/zeroclaw-labs/zeroclaw/pull/11456)** — open since **2026-10-02** (~1 month), `size:XL`, `security:policy`, `ci:windows`. Subprocess memory watchdog, broad blast radius.
- **[PR #11355](https://github.com/zeroclaw-labs/zeroclaw/pull/11355)** — open since **2026-10-01**, `stale-candidate`, WASM/Dioxus Skills dashboard PoC — appears to be waiting on a roadmap decision.
- **[PR #10843](https://github.com/zeroclaw-labs/zeroclaw/pull/10843)** — open since **2026-09-13** (~7 weeks), `stale-candidate`, `needs-author-action`, large Telegram reaction fix.
- **[PR #11286](https://github.com/zeroclaw-labs/zeroclaw/pull/11286)** — open since **2026-09-30**, `risk:high`, security/pairing, `distinguished contributor` — strategic identity work aging in the queue.
- **[PR #11589](https://github.com/zeroclaw-labs/zeroclaw/pull/11589)** — open since **2026-10-07**, `risk:high`, touches every channel; high value but review-intensive.

**Health assessment:** ZeroClaw exhibits strong contributor momentum and a clearly articulated security/operations roadmap, but the **growing gap between open PRs (43) and merge throughput (5/day)** — combined with several high-risk PRs and a 3-month-old architectural issue — flags a **review-capacity bottleneck** that could delay the next release. Recommended focus: unblock the security/identity PR cluster (#11286, #11965) and land the crash fix for #12173.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*