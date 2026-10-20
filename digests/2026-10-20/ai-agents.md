# OpenClaw Ecosystem Digest 2026-10-20

> Issues: 500 | PRs: 500 | Projects covered: 5 | Generated: 2026-10-20 10:11 UTC

- [OpenClaw](https://github.com/openclaw/openclaw)
- [Hermes Agent](https://github.com/nousresearch/hermes-agent)
- [IronClaw](https://github.com/nearai/ironclaw)
- [QwenPaw](https://github.com/agentscope-ai/QwenPaw)
- [ZeroClaw](https://github.com/zeroclaw-labs/zeroclaw)

---

## OpenClaw Deep Dive

# OpenClaw Project Digest — 2026-10-20

## 1. Today's Overview

OpenClaw remains in a high-velocity but stability-challenged phase. In the last 24 hours, **500 issues** and **500 PRs** were updated, with 128 issues closed and 231 PRs merged/closed — roughly a 46% merge rate, indicating maintainers are actively shipping but also triaging heavy churn. A new beta (`v2026.10.10-beta.2`) shipped with a workspace-safety fix for `apply_patch`, narrowly scoped rather than a feature release. The issue tracker is dominated by **P0/P1 regressions tied to the 2026.9.x → 2026.10.x upgrade path** (gateway startup blocking, plugin migration non-convergence, session lane wedging), and several long-lived diamond-lobster-rated bugs remain open. Overall health: **active and productive, but carrying meaningful stability debt around the upgrade and plugin lifecycle paths.**

## 2. Releases

**v2026.10.10-beta.2** (openclaw 2026.10.10-beta.2)
- **Fixes:** Workspace safety — a multi-file `apply_patch` is now rejected *before* changing any files if a later update target is missing or its context doesn't match, preserving the original workspace for retry. Commit-time I/O failures can still leave partial state (noted as residual limitation).
- **Highlights / Changes:** Empty in the published notes.
- No breaking changes or migration notes documented in this release.

> ⚠️ The release notes are thin — users on 2026.9.x should still track the standing migration problems in §5 before upgrading.

## 3. Project Progress

231 PRs merged/closed today. Notable closed items:
- **#164799** [CLOSED] — Post-version-change agent admission delay / unconfigured system-agent DB refusal (readyz 503 until restart). [link](https://github.com/openclaw/openclaw/issues/164799)
- **#170212** [CLOSED] — Failed Telegram `/update` leaving systemd user service SIGKILLed. [link](https://github.com/openclaw/openclaw/issues/170212)
- **#135658** [CLOSED] — Regression where cron jobs ending in `NO_REPLY` got a spurious "no final summary" fallback. [link](https://github.com/openclaw/openclaw/issues/135658)
- **#81156** [CLOSED] — MiniMax usage % semantics inverted. [link](https://github.com/openclaw/openclaw/issues/81156)
- **#87310** [CLOSED] — Stale diagnostic tool_call activity re-blocking sessions. [link](https://github.com/openclaw/openclaw/issues/87310)
- **#47143** [CLOSED] — `memoryFlush` never triggering when both compaction counters are 0. [link](https://github.com/openclaw/openclaw/issues/47143)

Active refactor PRs from maintainer `steipete` (#178328, #178327, #178326, #178314, #178316) indicate a coordinated internal clean-up around runtime owners, migration postimages, and duplicate MCP servers. Fix PRs with proof are pending for Telegram progress retention (#173026) and gateway recovery-lock handling (#178326).

## 4. Community Hot Topics

| Rank | Item | Comments | Signal |
|---|---|---|---|
| 1 | [#160959](https://github.com/openclaw/openclaw/issues/160959) — Gateway blocks for minutes capturing large external plugins (P0, diamond 🦞) | 36 | Upgrade-path regression; largest community frustration |
| 2 | [#164294](https://github.com/openclaw/openclaw/issues/164294) — Gateway state DB WAL auto-checkpoint never completes (P2) | 22 | Data-integrity durability concern |
| 3 | [#150635](https://github.com/openclaw/openclaw/issues/150635) — Short-term recall evicts entries nightly, dreaming never promotes (P2, diamond 🦞) | 20 | Core memory/dreaming subsystem broken |
| 4 | [#164799](https://github.com/openclaw/openclaw/issues/164799) — Version-change agent admission delay (CLOSED) | 15 | Resolved |
| 5 | [#144502](https://github.com/openclaw/openclaw/issues/144502) — WhatsApp TTS voice notes unplayable | 13 | Channel-specific UX |
| 6 | [#170956](https://github.com/openclaw/openclaw/issues/170956) — Windows startup/shutdown/schtasks unreliability (P0) | 13 | Windows platform debt |

**Underlying needs:** Users are most vocal about (a) **gateway event-loop blocking during plugin/startup work**, (b) **memory subsystem correctness** (recall, dreaming, flush), and (c) **cross-platform managed-service reliability** (Windows, systemd, launchd). These cluster into a single theme: *the runtime's durability and lifecycle management under real-world plugin load.*

## 5. Bugs & Stability

Ranked by severity (all links to `openclaw/openclaw`):

**P0 — Crash loops / release blockers:**
- **#160959** — Gateway blocks for minutes on large external plugins (2026.9.6 regression). *No fix PR yet, needs maintainer review.* 🔴
- **#170956** — Windows managed-service: slow startup, unclean plugin shutdown, schtasks permission errors. *Fix shape clear, no PR.* 🔴
- **#167406** — Windows MSIX Codex-enabled Gateway startup starves main thread. 🔴
- **#143334** — Lost subagent completion parks requester, starves queued messages; restart recovery fails. 🔴
- **#157255** — Turn claim not released after lane timeout (90+ min wedge). 🔴

**P1 — Session state / message loss:**
- **#125764** — Telegram outbound sends dead-lettered after single attempt (no retry, silent loss).
- **#113701** — Context overflow: large tool outputs exceed window, compaction can't recover, failure loop.
- **#167557** — Deferred plugin migration never converges; "lease database identity changed."
- **#172837** — Codex `nativeSubagentAssignments` never removed after delivery gives up.
- **#149239** — Session placement settlement abort fed into model-fallback loop.
- **#162637** — Native Codex completion handoff fails with `SESSION_WORK_START_CHANGED`.
- **#138972** — Talk realtime session becomes "Unknown Talk session" before tool-result round-trip.

**P2 — Behavior bugs / UX friction:**
- **#164294** — WAL checkpoint pinned by in-process reader.
- **#150635** — Dreaming deep phase never promotes (memory).
- **#166133** — MCP tool_call wrapper coerces integer args to string.
- **#169586** — Windows LINE Doctor fails with `EEXIST` on undici-types alias.
- **#143640** — memory-core full index publish exhausts 5s SQLite busy timeout.
- **#139215** — Cron scheduler silently swallows ticks since 2026.9.1.

**Regression clusters:** The 2026.9.6 plugin-capture change (#160959) and the 2026.9.1+ cron scheduler (#139215) are the clearest version-pinned regressions. **Multiple P0/P1 items lack a fix PR** (`clawsweeper:no-new-fix-pr`), making them the biggest risk to the next stable cut.

## 6. Feature Requests & Roadmap Signals

- **#38568** [CLOSED] — Inject context window % into system prompt Runtime section (2 👍). Likely small, could land next minor.
- **#138366** — Let memory slot owner drive the Dreams page via `MemoryPluginCapability` dreaming provider. Aligns with the memory-core fixes in flight — plausible for a 2026.10/11 minor.
- **#80843** — Web search provider fallback chain for quota/network failures (4 👍, highest reactions). Strong candidate; touches provider routing already being refactored.
- **#139188** — Expose provider subscription usage windows via Prometheus diagnostics.
- **#40694** — Auto-close temporary browser tabs after task completion.
- **#153227** — Consequence-bound release receipts beyond tool permission (security proposal).
- **#46058** — Chat-first Android surface exploration.
- **#42591** [CLOSED] — Modularize `install.sh` (79KB / 2498 lines).

**Prediction:** Context-window % injection (#38568) and the web-search fallback chain (#80843) have the clearest near-term paths; both are low-risk and high-demand. The Dreams provider (#138366) depends on memory-core stabilization and is more likely a 2026.11 item.

## 7. User Feedback Summary

**Pain points (dissatisfaction):**
- **Startup/upgrade fragility** is the #1 complaint — Windows (#170956, #167406), systemd (#170212, #144976), and generic gateway blocking (#160959) all cause client-visible disconnects and manual intervention.
- **Silent message loss** (#125764 Telegram, #143632 iMessage re-delivery, #144876 dashboard sessions) erodes trust — failures occur with no user-visible error.
- **Memory/dreaming subsystem** (#150635, #47143, #143640) is repeatedly reported as non-converging or self-defeating.
- **Plugin migration** across npm updates (#167557, #144447) leaves operators stuck with non-functional plugins.

**Satisfaction signals:**
- Fast closure of several diamond-lobster items (#164799, #135658, #87310) shows responsive triage.
- Multiple community-authored fix PRs with real Gateway trace evidence (#173026, #178326, #169536) indicate an engaged, technically capable user base.

**Use cases observed:** multi-agent inter-agent routing (`sessions_send`), Telegram/Discord/WhatsApp channels via proxies, Windows MSIX managed installs, Codex/Claude CLI harnesses, Talk realtime voice, and local models (Ollama/GLM).

## 8. Backlog Watch

Long-open, high-severity items needing maintainer attention:

- **[#113701](https://github.com/openclaw/openclaw/issues/113701)** (created 2026-07-25, P1, gold shrimp) — Context overflow failure loop. Open ~3 months, no fix PR.
- **[#128916](https://github.com/openclaw/openclaw/issues/128916)** (2026-08-25, P1, maintainer-labeled, diamond 🦞) — Errored message-tool-only runs end silent; needs product decision.
- **[#130209](https://github.com/openclaw/openclaw/issues/130209)** (2026-08-26, P1, platinum hermit, security-review) — Over-redaction masks browser `key` param, blocking agent self-correction.
- **[#125764](https://github.com/openclaw/openclaw/issues/125764)** (2026-08-18, P1, diamond 🦞) — Telegram dead-lettering after one attempt; needs product decision.
- **[#139215](https://github.com/openclaw/openclaw/issues/139215)** (2026-09-05, P1) — Cron scheduler silently swallows ticks; no fix PR, no repro confirmation.
- **[#149631](https://github.com/openclaw/openclaw/issues/149631)** (2026-09-16, P2, stale, linked-pr-open) — CI preflight throws at 121 jobs vs 120 cap; PR open but stalled.
- **[#46058](https://github.com/openclaw/openclaw/issues/46058)** (2026-03-14, stale) — Android chat-first surface; product decision needed for upstreaming discussion.

**Highest-leverage unblock:** Getting maintainer review onto the P0 cluster (#160959, #170956, #167406, #143334, #157255) — none currently have an accepted fix PR, and together they represent the primary barrier to a trustworthy next stable release.

---
*Digest generated from OpenClaw GitHub data for 2026-10-20. Ratings, labels, and severity follow OpenClaw's own ClawSweeper taxonomy.*

---

## Cross-Ecosystem Comparison

# Cross-Project Comparison Report — Personal AI Assistant / Agent Open-Source Ecosystem
**Snapshot date:** 2026-10-20 · **Projects:** OpenClaw, Hermes Agent, IronClaw, QwenPaw, ZeroClaw

---

## 1. Ecosystem Overview

The personal AI assistant / agent open-source landscape in late 2026 is characterized by **five projects in fundamentally different maturity stages**, all converging on the same architectural pattern: a local gateway/runtime that owns sessions across CLI, desktop, and messaging channels, with a plugin/WASM extension surface and an MCP-based tool layer. The most active projects (OpenClaw, Hermes, ZeroClaw) are all in **post-refactor stabilization**, each paying down debt from a recent major architectural change (plugin capture, unified gateway runtime, and v0.8.7 release gating respectively). Meanwhile, QwenPaw is rapidly iterating toward a plugin-system v2, and IronClaw is in a quiet maintenance phase with a single focused contributor workstream. A macro-trend across all five is the **shift of stability risk from core runtime to plugin lifecycle and gateway session lifecycle** — plugin load, migration, and egress, plus session delivery/retry semantics, are now the dominant source of P0/P1 bugs. The ecosystem is healthy but strained: high issue/PR volumes are being met by responsive maintainers, yet multiple P0 regressions lack fix PRs two-to-six weeks after being filed.

---

## 2. Activity Comparison

| Project | Issues (24h touched) | PRs (24h touched) | Release Status | Health Score* | Dominant Signal |
|---|---|---|---|---|---|
| **OpenClaw** | ~500 updated · 128 closed | ~500 updated · 231 merged/closed | `v2026.10.10-beta.2` (thin notes) | **7.5 / 10** | High velocity, high churn, P0 upgrade-path regressions |
| **Hermes Agent** | 50 (38 open / 12 closed) | 50 (36 open / 14 merged) | None (users on `v0.22.2`) | **7 / 10** | Regression-driven; unified-gateway blast radius still contained |
| **IronClaw** | 2 open | 3 open (0 merged) | None | **8.5 / 10** | Quiet, stable, single focused contributor workstream |
| **QwenPaw** | 17 (4 closed) | 32 (11 merged/closed) | None (v2.2.2 stable regressions unpatched) | **8 / 10** | Active refactor toward v2.3.0; stable-branch bugs accumulating |
| **ZeroClaw** | 48 (46 open) | 50 (42 open, 1 closed) | None (`v0.8.7` gated, not cut) | **6.5 / 10** | Broad issue surface; plugin subsystem is the hotspot |

*\*Health Score (0–10) is an analyst composite of: responsiveness of triage, presence of unaddressed P0s, release-blocking debt, merge throughput, and community sentiment. It is not a project-published metric.*

**Reading the table:** OpenClaw and ZeroClaw carry the most *absolute* activity and the most *absolute* open debt. QwenPaw and Hermes are mid-tier with clearer forward motion. IronClaw is the quietest and cleanest but contributes the least net progress today (zero merges).

---

## 3. OpenClaw's Position

**Advantages vs peers:**
- **Scale of contribution base.** OpenClaw's volume (~500 issues + ~500 PRs touched daily, 231 PRs merged/closed) is an order of magnitude above every peer. Its 46% merge rate reflects a functioning reviewer pipeline that smaller projects cannot match.
- **Breadth of channel and harness support.** OpenClaw's community-populated integrations (Telegram, Discord, WhatsApp, iMessage, Codex/Claude CLI harnesses, Talk realtime voice, Ollama/GLM local models) exceed Hermes and ZeroClaw's channel matrices, and far exceed IronClaw's hosted-MCP focus.
- **Cross-platform managed-service maturity (aspirational).** It's the only project in the set with meaningful Windows MSIX, systemd user-service, and launchd artifacts — albeit with active reliability bugs.

**Technical approach differences:**
- OpenClaw's architecture is *gateway-centric with a plugin-capture layer*, whereas Hermes just unified on a *single gateway owning every local session* — a newer, more aggressive model. OpenClaw has more components but heavier legacy compatibility burden (2026.9.x → 2026.10.x migration path is a primary pain point).
- Its plugin model uses npm-based distribution with migration postimages; ZeroClaw uses WASM with a strict registry gate; QwenPaw is moving to subprocess-isolated plugins. **OpenClaw is the most "npm-native" and the least sandboxed** of the group — a documented security-relevant gap (#11327-equivalent in ZeroClaw is already a filed bug there).

**Community size comparison:**
- Largest community in the set by raw participation. Best evidence: diamond-lobster-rated long-lived issues, sustained multi-hundred-PR throughput, and multiple community-authored fix PRs with real Gateway trace evidence. Peer projects show comparable *quality* of contribution but far smaller *volume* — Hermes' 199-comment P0 tracker is its heaviest thread; OpenClaw's #160959 alone draws 36 comments on a routine upgrade regression.

**Primary weakness:** the **P0 cluster (#160959, #170956, #167406, #143334, #157255)** has no accepted fix PR. For a project its size, this is the single most damaging signal — it caps the trust ceiling of the next stable cut.

---

## 4. Shared Technical Focus Areas

Four requirements recur across multiple projects, indicating they are ecosystem-level, not project-specific:

**(a) Gateway event-loop blocking / runtime durability** — *OpenClaw, Hermes, ZeroClaw, QwenPaw*
- OpenClaw: #160959 (multi-minute plugin capture blocks gateway), #164294 (WAL checkpoint pinned).
- Hermes: #141966 (`get_session()` waits 5s on event loop), #141955 (full-table scan on every write).
- ZeroClaw: #11055 (channel SOP turns lack handles), stall watchdog by default (#10168).
- QwenPaw: #8288 (console freeze on conversation switch).
- **Shared need:** the gateway must not block on I/O, plugin enumeration, or DB writes; async-only reads and bounded work per tick.

**(b) Memory / context management correctness** — *OpenClaw, ZeroClaw, QwenPaw, Hermes*
- OpenClaw: #150635 (dreaming never promotes), #47143 (memoryFlush never fires), #143640 (index publish exhausts SQLite busy timeout).
- ZeroClaw: #6998 (schema-validated consolidation, parked 5 months), #10755 (preference provenance lost on merge), consolidation category control (#11657).
- QwenPaw: #8312 (`CONTEXT UNFIT` compaction failure), #8335 (media-in-history session wedge — media ~0 tokens so eviction never fires).
- Hermes: session identity/history preservation across compression (fixed in #140971).
- **Shared need:** token-based eviction is insufficient once non-text payloads (media, tool output) enter context; explicit consolidation semantics and provider-robust structured output are required.

**(c) Plugin/WASM lifecycle: load, migration, egress, security** — *All five*
- OpenClaw: #167557 (deferred migration never converges), #144447, migration postimage refactor PRs.
- ZeroClaw: heaviest single hotspot — #11327 (tool-name gate bypass), #11336 (false `[loads]`), #11357 (removes wrong dir), #11813 (blackholed egress), #11318–#11322 webhook/RPC stack.
- QwenPaw: plugin hot reload (#7565, 6 weeks open), theme tokens (#8071), channels-as-plugins (#8187), prompt-injection-safe skill dirs (#7864).
- IronClaw: hosted-MCP loopback enrollment blocker (#8146 / #8147).
- Hermes: plugin reload crash on `sys.modules` mutation (#141917).
- **Shared need:** plugins are the largest unguarded attack and reliability surface; migration must be idempotent/convergent, egress must be policy-bound, and tool-name registration must be post-load authoritative.

**(d) Message delivery / retry / approval routing** — *Hermes, OpenClaw, QwenPaw, ZeroClaw*
- Hermes: #141890 (transient refusals stamped terminal), #141893 (2s retry forever), #133514 (background approvals invisible), #129071 (`notify_on_complete` discarded).
- OpenClaw: #125764 (Telegram dead-lettering after one attempt), #143632, #144876 (silent message loss).
- QwenPaw: #8329 (Telegram ignores `reply_to_message`), #8315 (Feishu 426 with proxy env).
- ZeroClaw: #11416 (Slack "is thinking…" regression), #10426 (Telegram progress indicator).
- **Shared need:** delivery must be durably routed to the originating chat/session, transient failures distinguished from terminal, and retries must be bounded with backoff.

---

## 5. Differentiation Analysis

| Dimension | OpenClaw | Hermes Agent | IronClaw | QwenPaw | ZeroClaw |
|---|---|---|---|---|---|
| **Primary user** | Power users / operators (multi-channel, Windows MSIX, self-hosted) | Desktop + CLI + messaging hybrid users; research-adjacent | Hosted-MCP developers; local connector authors | Desktop + mobile (HarmonyOS) users; plugin authors | Self-hosted / local-LLM operators; plugin ecosystem builders |
| **Architecture** | Gateway + npm plugins + migration postimages | Unified gateway owning all local sessions (newest model) | Hosted MCP with bearer injection; loopback enrollment | Core + subprocess-isolated channel plugins (v2.3.0 direction) | Core + WASM plugin host with strict registry gate |
| **Feature focus** | Breadth: channels, harnesses, Talk voice, memory/dreaming | Session continuity, compression/rewind, Kanban delegation | MCP endpoint policy & enrollment ergonomics | Plugin extensibility, realtime voice, model management UX | Plugin security, memory consolidation, SOP/agent-loop correctness |
| **Sandboxing posture** | Weakest (npm-native, least isolation) | Moderate | Host-mediated injection (strong per-endpoint) | Moving to subprocess isolation | Strongest (WASM + egress ceremony + tool-name gate) |
| **Release cadence** | Betas shipping; stable upgrade path broken | No release; users pinned to v0.22.2 | No release; quiet | v2.2.2 stable carrying regressions; v2.3.0 upcoming | v0.8.7 gated on a large batch of fixes |
| **Biggest known risk** | P0 upgrade-path cluster with no fix PR | Unified-gateway regression blast radius | Single-contributor dependency; low throughput | Stable-branch regressions unpatched; media wedges | Plugin subsystem + P0 SOP bug #10066 |

**Reading the differentiation:** OpenClaw optimizes for *breadth and real-world channel coverage*; ZeroClaw optimizes for *security and self-hosted correctness*; QwenPaw optimizes for *extensibility and UI polish*; Hermes optimizes for *session continuity across surfaces*; IronClaw optimizes for *hosted MCP integration hygiene*. There is no direct architectural copycat — each has a defensible niche — but **all are converging on the gateway + plugin + MCP pattern**, which is the strongest ecosystem-level signal in this dataset.

---

## 6. Community Momentum & Maturity

**Tier 1 — High-velocity, high-churn (rapidly iterating, carrying debt):**
- **OpenClaw** — largest base, fastest triage, but the most P0 debt. Iterating fast on refactors (steipete's #1783xx series) while firefighting regressions.
- **ZeroClaw** — deepest merge-ready fix queue staged but almost nothing landing today; effectively in a *staging* posture ahead of v0.8.7.
- **Hermes Agent** — reactive but responsive; the unified-gateway merge on Oct 14 is still being absorbed (#134889 at 199 comments). This is the clearest example of "iterate first, stabilize second."

**Tier 2 — Active, converging on a release:**
- **QwenPaw** — healthiest forward motion of the mid-tier: 11 merges today, 4 issues closed, clear public roadmap (#8289), first-time contributors landing. Risk is the unpatched **v2.2.2 stable branch** — a patch release would materially improve perception.

**Tier 3 — Quiet maintenance:**
- **IronClaw** — zero merges today; the only functional workstream is a single contributor's loopback-enrollment issue→PR pair (#8146/#8147). Stable, low-risk, but **maintainer responsiveness is untested in this window** and the project is effectively rate-limited by review bandwidth.

**Maturity ranking (perceived, not age):** ZeroClaw ≥ OpenClaw > QwenPaw > Hermes > IronClaw in terms of *security/ops rigor*; OpenClaw > QwenPaw > Hermes > ZeroClaw > IronClaw in terms of *community scale and merge throughput*.

---

## 7. Trend Signals

**For AI agent developers building on or integrating with these projects:**

1. **The gateway is the new battleground.** Every project is fighting the same fight — keeping the session-owning runtime responsive while plugins, MCP servers, and DB writes compete for the event loop. *Invest in async-only session reads and bounded per-tick work; treat event-loop blocks as P0 by default.*

2. **Token-based context eviction is broken for modern payloads.** Media, tool output, and rich content consume ~0 tokens but real bytes, producing session wedges (QwenPaw #8335, OpenClaw #113701, ZeroClaw #11554). *Expect byte-aware or message-count-aware context budgeting to become a required feature, not an optimization.*

3. **Plugin lifecycle is the top security and reliability surface.** Tool-name gate bypass (ZeroClaw #11327), migration non-convergence (OpenClaw #167557), plugin reload crashes (Hermes #141917), and non-idempotent removal (ZeroClaw #11357) point to a systemic gap. *Design for idempotent migration, post-load tool registration, and egress policy as first-class primitives — not bolt-ons.*

4. **Message delivery must be chat-anchored, not turn-anchored.** The most repeated delivery bug class across Hermes, OpenClaw, and QwenPaw is *approvals/notifications becoming invisible when the parent turn ends*. *Route delivery to a durable session/chat identity; distinguish transient refusals from terminal failures; bound retries with backoff.*

5. **Self-hosted/local LLM onboarding is rough everywhere.** ZeroClaw's llama.cpp URI bug (#11296) and Quickstart model-order issue (#11819), plus QwenPaw's LM Studio/llama-server/DashScope audio rejections, show provider-agnostic correctness on the *self-hosted* path is behind the cloud path. *A portable provider-capability negotiation layer is a differentiated opportunity.*

6. **MCP is ossifying as the tool transport — but the plumbing is still painful.** IronClaw's entire day's activity is one loopback-enrollment fix; ZeroClaw's #10807 (MCP session poisoning) and #11872 (stale-session replay) show the same friction. *MCP endpoint enrollment, session replay semantics, and credential injection (IronClaw's bearer model) are the integration pain points to solve.*

7. **Stable branches are accruing unpatched regressions.** QwenPaw v2.2.2 console freeze/cron bugs and OpenClaw's 2026.9.x→2026.10.x path are the clearest examples. *Downstream developers should pin to specific commits and follow the P0 trackers, not the "stable" label — until projects adopt patch-release discipline for stable lines.*

**Bottom line for decision-makers:** the ecosystem is converging on a common architecture while diverging sharply on risk profile. OpenClaw offers the widest integration surface at the highest regression cost; ZeroClaw offers the strongest security posture at the cost of release velocity; QwenPaw offers the clearest extensibility roadmap; Hermes offers the most aggressive session-continuity model mid-flight; IronClaw offers the cleanest MCP integration path but the thinnest maintainer capacity. **For production dependencies today, the shared gate is not features — it is the plugin lifecycle and gateway durability guarantees, which no project yet fully provides.**

---

## Peer Project Reports

<details>
<summary><strong>Hermes Agent</strong> — <a href="https://github.com/nousresearch/hermes-agent">nousresearch/hermes-agent</a></summary>

# Hermes Agent — Project Digest
**Date:** 2026-10-20 · **Repo:** [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent)

---

## 1. Today's Overview

Activity is **very high and regression-driven**. In the last 24h, 50 issues (38 open / 12 closed) and 50 PRs (36 open / 14 merged or closed) were touched, with zero new releases. The dominant theme is the aftermath of the `feat/unified-gateway-runtime` merge ([#106742](https://github.com/NousResearch/hermes-agent/pull/106742), merged Oct 14) — the P0 tracking issue [#134889](https://github.com/NousResearch/hermes-agent/issues/134889) alone carries **199 comments** and dozens of linked post-merge fixes. Maintainers (notably `teknium1` and `unsupportedpastels`) are shipping a steady stream of corrective PRs across gateway session lifecycle, delivery/retry semantics, multiplexed profiles, and cross-platform ingress. Overall project health reads as **reactive but responsive**: high-severity regressions are being reported and rapidly paired with fixes, though the blast radius of the unified runtime change is still being contained.

---

## 2. Releases

**None.** No new versions were published in the last 24h. Users are reporting against `v0.22.2` (`d923a5eb487`, built 2026-10-16) and canary builds.

---

## 3. Project Progress

14 PRs were merged/closed today. Notable advances:

| PR | Status | What it advanced |
|---|---|---|
| [#141903](https://github.com/NousResearch/hermes-agent/pull/141903) | CLOSED | Live session listings moved off the gateway event loop; `profile gateway stop` now **parks** the profile instead of killing the shared host; legacy stores open; config cache/MCP reload thrash fixed. |
| [#140971](https://github.com/NousResearch/hermes-agent/pull/140971) | CLOSED | Session identity and full history preserved across compression, rewind, and orphan reap (viewer `ws_orphan_reap` no longer stamps a ledger-held session ended). |
| [#141906](https://github.com/NousResearch/hermes-agent/pull/141906) | CLOSED | Kanban workers: `session_search` works, dead attempts release profile slots, missing `delegate_task` explained. Fixes [#141705](https://github.com/NousResearch/hermes-agent/issues/141705), [#140858](https://github.com/NousResearch/hermes-agent/issues/140858), [#141793](https://github.com/NousResearch/hermes-agent/issues/141793). |
| [#141939](https://github.com/NousResearch/hermes-agent/pull/141939) | CLOSED | Busy "steer" corrections that reach no agent are re-queued instead of dropped; Desktop model/reasoning picks now apply to messaging (Telegram) sessions. |
| [#141578](https://github.com/NousResearch/hermes-agent/pull/141578) | CLOSED | Starting the API listener no longer silences `agent.log` / `errors.log` / `gateway.log` (uvicorn `dictConfig` root-logger clobber) — directly addresses [#141958](https://github.com/NousResearch/hermes-agent/issues/141958). |
| [#141481](https://github.com/NousResearch/hermes-agent/pull/141481) | CLOSED | Classic CLI re-supplies its launch API key on resume after a gateway restart (CLI-34). |
| [#141580](https://github.com/NousResearch/hermes-agent/pull/141580) | CLOSED | Secondary multiplexed profiles' side agents / `/bg` / worker turns keyed to the correct Docker workspace container. |
| [#141581](https://github.com/NousResearch/hermes-agent/pull/141581) | CLOSED | `/model <alias> --once` correctly routes through alias endpoint/key. |
| [#141582](https://github.com/NousResearch/hermes-agent/pull/141582) | CLOSED | `hermes chat --cli --api-key/--base-url` now forwarded to the classic CLI. |

**Still open and actively iterating:** [#141926](https://github.com/NousResearch/hermes-agent/pull/141926) (background deliveries settle instead of looping), [#141916](https://github.com/NousResearch/hermes-agent/pull/141916) (five Telegram/Discord/Buzz ingress regressions), [#141959](https://github.com/NousResearch/hermes-agent/pull/141959) (bounded async-completion delivery with backoff), [#141944](https://github.com/NousResearch/hermes-agent/pull/141944) (Kanban `delegate_task` via owner-reserved children), [#141963](https://github.com/NousResearch/hermes-agent/pull/141963) (perf: unset-ancestor lookup by key).

---

## 4. Community Hot Topics

Ranked by discussion volume / reactions:

1. **[#134889](https://github.com/NousResearch/hermes-agent/issues/134889) — 199 comments** · P0, `sweeper:risk-*`
   The master tracking issue for post-merge fixes to the unified gateway runtime (one gateway owning every local session). Tags span `risk-session-state`, `risk-message-delivery`, `risk-compatibility`, `risk-platform-windows`, plus `comp/desktop`, `comp/tui-gateway`, `area/sessions`, `area/profiles`. **Underlying need:** a single, reliable authority for local sessions across desktop, CLI, TUI, and messaging surfaces — the community is stress-testing every seam.

2. **[#131055](https://github.com/NousResearch/hermes-agent/issues/131055) — 19 comments, 1 👍** · P2
   Linux Desktop second-instance launches poison `windows-sandbox-fallback.json`, sticking `--no-sandbox` and triggering a renderer `SIGILL` loop (`/dev/shm` `ESRCH`). **Need:** safe multi-launch / deeplink handling on Linux without corrupting sandbox state.

3. **[#141133](https://github.com/NousResearch/hermes-agent/issues/141133) — 8 comments** · P2 (now CLOSED)
   `hermes -p <name> gateway stop` on a served multiplex profile **stopped the host gateway**, taking all served profiles offline. Fixed by the parking behavior in [#141903](https://github.com/NousResearch/hermes-agent/pull/141903).

4. **[#133514](https://github.com/NousResearch/hermes-agent/issues/133514) — 8 comments** · P2
   Background `delegate_task` children requesting approval after the parent gateway turn ends become **invisible**; `/approve` reports none pending. **Need:** durable approval routing tied to the originating chat, not the parent turn.

5. **[#129071](https://github.com/NousResearch/hermes-agent/issues/129071) — 7 comments** · P2
   A reaped session's `notify_on_complete` wake is discarded by whichever poller drains the queue first. **Need:** reliable background-job completion delivery across session reaping.

6. **[#141917](https://github.com/NousResearch/hermes-agent/issues/141917) — 7 comments** · P2
   Plugin load fails with `RuntimeError: dictionary changed size during iteration` — `_evict_modules` iterates the live `sys.modules`. Windows 11 / CPython 3.14.7. **Need:** plugin reload robustness.

7. **[#141958](https://github.com/NousResearch/hermes-agent/issues/141958) — 7 comments** · P2
   Gateway stops writing any logs once multiplexing is enabled — a silent observability failure. Addressed by [#141578](https://github.com/NousResearch/hermes-agent/pull/141578).

---

## 5. Bugs & Stability

Ranked by severity. **Bold = likely P0/P1-impact.**

### P0
- **[#134889](https://github.com/NousResearch/hermes-agent/issues/134889)** — Tracking: one gateway owns every local session; post-merge fixes. Spans session state, message delivery, compatibility, and Windows platform. Numerous fixes in flight ([#141926](https://github.com/NousResearch/hermes-agent/pull/141926), [#141916](https://github.com/NousResearch/hermes-agent/pull/141916), [#141939](https://github.com/NousResearch/hermes-agent/pull/141939), [#141903](https://github.com/NousResearch/hermes-agent/pull/141903)).

### P2 — Session / gateway integrity
- [#131055](https://github.com/NousResearch/hermes-agent/issues/131055) — Linux Desktop sticky `--no-sandbox` → **renderer SIGILL loop**. *No fix PR visible.*
- [#141917](https://github.com/NousResearch/hermes-agent/issues/141917) — **Plugin load crashes** (`sys.modules` mutation during `_evict_modules`). *No fix PR visible yet.*
- [#141958](https://github.com/NousResearch/hermes-agent/issues/141958) — Gateway log files silent under multiplexing. **Fix PR: [#141578](https://github.com/NousResearch/hermes-agent/pull/141578).**
- [#134866](https://github.com/NousResearch/hermes-agent/issues/134866) — Recurring offset-5 TLS-shaped **SQLite header corruption** across four stores; writer unattributed. *`needs-repro`; no fix.*
- [#137304](https://github.com/NousResearch/hermes-agent/issues/137304) — Dashboard `/api/sessions?profile=X` 500 "unable to open database file" after profile delete/recreate while a handle is held. *`needs-decision`.*
- [#133514](https://github.com/NousResearch/hermes-agent/issues/133514) — Background delegated approvals invisible after parent turn ends.
- [#129071](https://github.com/NousResearch/hermes-agent/issues/129071) — Reaped session discards `notify_on_complete` wake.

### P2 — Delivery / retry / performance
- [#141890](https://github.com/NousResearch/hermes-agent/issues/141890) — Cron bot-chat: transient CLI-lane refusals (`SESSION_NOT_OWNED`, compression-busy) stamped **terminal** instead of deferred; drain gate can park a queue for a day. **Fix PR: [#141926](https://github.com/NousResearch/hermes-agent/pull/141926).**
- [#141893](https://github.com/NousResearch/hermes-agent/issues/141893) — Async delegation watcher retries stranded pending deliveries **every 2s forever**, no backoff. **Fix PRs: [#141959](https://github.com/NousResearch/hermes-agent/pull/141959), [#141926](https://github.com/NousResearch/hermes-agent/pull/141926).**
- [#141966](https://github.com/NousResearch/hermes-agent/issues/141966) — `get_session()` waits up to 5s on the token writer while 13 handlers call it on the event loop. *(perf)*
- [#141967](https://github.com/NousResearch/hermes-agent/issues/141967) — `recover_local_sessions` restores **every** local receipt at boot; ended/never-used sessions stay live forever. *(perf/state)*
- [#141955](https://github.com/NousResearch/hermes-agent/issues/141955) — `created_source` ancestor stamp scans the whole `sessions` table on **every** usage write. **Fix PR: [#141963](https://github.com/NousResearch/hermes-agent/pull/141963).**
- [#141966](https://github.com/NousResearch/hermes-agent/issues/141966), [#141971](https://github.com/NousResearch/hermes-agent/issues/141971) — Classic CLI reports "outcome unknown" on socket close even when the turn completed.

### P2 — Provider / auth / tooling
- [#141960](https://github.com/NousResearch/hermes-agent/issues/

</details>

<details>
<summary><strong>IronClaw</strong> — <a href="https://github.com/nearai/ironclaw">nearai/ironclaw</a></summary>

# IronClaw Project Digest — 2026-10-20

## 1. Today's Overview

IronClaw shows light but focused activity in the last 24 hours: 2 open issues and 3 open PRs were updated, with no merges, closures, or releases. The day's activity is dominated by a coherent workstream from contributor `tom9000` addressing loopback MCP endpoint enrollment (Issue #8146 + PR #8147), which suggests an active effort to unblock local connectors in hosted MCP setups. The remaining PRs are routine Dependabot dependency bumps (aiohttp, postcss-selector-parser), indicating healthy automated maintenance. Overall project health looks stable—no regressions or crashes were reported—but the absence of merged PRs in this window means limited net forward progress today.

## 2. Releases

No new releases in the last 24 hours. (Previous releases: none recorded in this window.)

## 3. Project Progress

- **Merged/closed PRs today: 0.** No features landed or fixes were merged in the last 24 hours.
- In-flight work: PR #8147 ([link](https://github.com/nearai/ironclaw/pull/8147)) proposes "explicit trusted enrollment of an exact loopback MCP endpoint," which would allow local MCP servers to use hosted MCP bearer authentication—directly addressing the gap filed in Issue #8146.
- Dependency PRs #8145 and #8144 remain open awaiting review/merge.

## 4. Community Hot Topics

- **Issue #8146 — Hosted MCP: explicit 127.0.0.1 endpoint enrollment** ([link](https://github.com/nearai/ironclaw/issues/8146)): 0 comments/0 reactions, but paired with PR #8147 the same day—the tightest issue→PR loop in this window. Underlying need: developers running local connectors cannot use native hosted-MCP registration because HTTP and IP-literal endpoints are rejected by registration, manifest credentials, discovery, and network policy. This is a concrete blocker for local-first agent setups.
- **Issue #8143 — Daily ironclaw failure taxonomy (2026-10-19)** ([link](https://github.com/nearai/ironclaw/issues/8143)): 0 comments. A recurring automated benchmark analysis; this edition flags ~57 non-pass officeqa tasks as "almost entirely genuine model-quality errors by DeepSeek-V4-Fla…" (truncated). Signal: benchmark quality tracking is operating, but model reliability on office-style tasks remains a concern.
- No issue/PR in this window has comments or reactions above zero; community discussion volume is low today.

## 5. Bugs & Stability

No crash or regression reports were filed today. The most notable stability/behavioral concern comes from Issue #8146 (Medium severity): hosted MCP registration **rejects all HTTP and IP literals**, effectively blocking local connector enrollment. This appears to be a policy/validation limitation rather than a crash, and a fix is already proposed in PR #8147 (open, not merged). Benchmark signal from Issue #8143 suggests model-quality (not infrastructure) failures dominate officeqa non-passes—worth monitoring as a quality trend rather than a stability bug.

## 6. Feature Requests & Roadmap Signals

- **Trusted loopback MCP enrollment** (Issue #8146 / PR #8147): explicitly allowlisting an exact 127.0.0.1 endpoint so local MCP servers can use credential-account bearer injection. Given the issue and PR were opened same-day and target a clear blocker, this is a **strong candidate for the next release** if review proceeds quickly.
- Implied follow-on: finer-grained network policy exemptions for HTTP/IP-literal endpoints (beyond loopback) may surface later, but nothing is filed yet.

## 7. User Feedback Summary

- **Primary pain point:** Local developers cannot register local MCP connectors in hosted flows due to strict endpoint validation—a friction point for local-first agent workflows (Issue #8146).
- **Use case:** Local MCP server + hosted credential-account bearer for secure, host-mediated injection.
- **Satisfaction/dissatisfaction:** No explicit sentiment expressed (0 reactions/comments); the fast issue→PR turnaround by the same author suggests contributor confidence in the fix path, but maintainer responsiveness is untested in this window.

## 8. Backlog Watch

- **Issue #8146 / PR #8147** need maintainer review to land—currently the only functional (non-dependency) items in flight; delay here directly affects local connector users.
- **PR #8145** ([link](https://github.com/nearai/ironclaw/pull/8145)) and **PR #8144** ([link](https://github.com/nearai/ironclaw/pull/8144)): routine Dependabot bumps (aiohttp 3.14.3→3.14.4; postcss-selector-parser 7.1.4→7.1.6) with no comments—low risk, should be triaged promptly to keep the dependency queue clean.
- **Issue #8143**: recurring daily taxonomy issue; if these accumulate without a tracking/rollup mechanism, consider consolidating so model-quality trends remain visible rather than buried in daily posts.

</details>

<details>
<summary><strong>QwenPaw</strong> — <a href="https://github.com/agentscope-ai/QwenPaw">agentscope-ai/QwenPaw</a></summary>

# QwenPaw Project Digest — 2026-10-20

## 1. Today's Overview

QwenPaw shows **high community activity** with 17 issues and 32 PRs updated in the last 24 hours, though no new releases were cut. The project is in an active **stabilization and refactoring phase** ahead of v2.3.0, evidenced by the "lighter and more extensible" plugin refactor announcement (#8289) and several XXXL-sized PRs targeting architecture (plugin hot reload, channel extraction, realtime voice). Issue triage is healthy — 4 issues closed today, including a notable session-wedging audio bug (#8171) and a console scrolling regression (#8284) — but a **cluster of media/session-stability bugs** (#8071, #8092, #8335, #8034) remains a recurring theme that maintainers should treat as a priority. Overall project health is **good**: responsive maintainer closures, active first-time contributors, and clear roadmap communication, offset by accumulating context-window and media-handling fragility.

## 2. Releases

**No new releases in the last 24 hours.** The most recent tracked release activity is the closed installation-verification issue for **v2.2.2-beta.4** ([#8053](https://github.com/agentscope-ai/QwenPaw/issues/8053), closed 2026-10-20), indicating the beta verification cycle has concluded. Users on 2.2.2 stable are still reporting multiple regressions (see §5), so a 2.2.3 patch release appears warranted but has not been announced.

## 3. Project Progress

**Closed/merged today (11 PRs merged or closed):**
- [PR #8339](https://github.com/agentscope-ai/QwenPaw/pull/8339) — `fix(console): stabilize long conversation wheel scrolling` closes [#8284](https://github.com/agentscope-ai/QwenPaw/issues/8284). Fixes scroll-snap in long transcripts caused by `content-visibility: auto` placeholder height estimation.
- [PR #8215](https://github.com/agentscope-ai/QwenPaw/pull/8215) — `fix(agents): recognize LM Studio at-most-zero audio rejection` closes [#8171](https://github.com/agentscope-ai/QwenPaw/issues/8171). Adds a third rejection shape to the audio-fallback classifier, ending permanent session wedges.
- [PR #7654](https://github.com/agentscope-ai/QwenPaw/pull/7654) — `fix(agents): recognize llama-server and DashScope URL audio rejections` — long-running follow-up finally closed, broadening audio-fallback coverage.
- [PR #7854](https://github.com/agentscope-ai/QwenPaw/pull/7854) — `fix(drivers): preserve concurrent policy updates during driver reload` fixes a read-modify-write race in `DriverManager.reload_driver()`.
- [PR #7864](https://github.com/agentscope-ai/QwenPaw/pull/7864) — `fix(security): protect skill directories against prompt-injected deletion` — path-based integrity protection for skills/knowledge dirs.
- [PR #8200](https://github.com/agentscope-ai/QwenPaw/pull/8200) — `feat(tools): add Firecrawl as a web_search provider` (first-time contributor) merged.
- [PR #8240](https://github.com/agentscope-ai/QwenPaw/pull/8240) — `feat(console): refine model management experience` — scoping global models / provider config / agent runtime settings.

**In-flight major features:** plugin hot reload ([#7565](https://github.com/agentscope-ai/QwenPaw/pull/7565)), realtime voice chat ([#7785](https://github.com/agentscope-ai/QwenPaw/pull/7785)), channel-to-plugin extraction ([#8187](https://github.com/agentscope-ai/QwenPaw/pull/8187)), and a decision-model-backed tool approval mode ([#8283](https://github.com/agentscope-ai/QwenPaw/pull/8283)).

## 4. Community Hot Topics

| Item | Comments | Link | Underlying Need |
|---|---|---|---|
| [#8171](https://github.com/agentscope-ai/QwenPaw/issues/8171) CLOSED — audio file wedges session (LM Studio) | 6 | Issue | Third variant of the same media-in-history class; users need **defensive media handling** across all OpenAI-compatible backends. |
| [#8071](https://github.com/agentscope-ai/QwenPaw/issues/8071) OPEN — plugin-facing theme extension point | 5 | Issue | Plugin ecosystem is maturing; authors need **semantic token overrides**, not a single `colorPrimary` knob. |
| [#8092](https://github.com/agentscope-ai/QwenPaw/issues/8092) OPEN — Ali-gateway content inspection misclassified | 3 | Issue | Multimodel fallback chains break on gateway-specific errors; users need **error taxonomy → retry/fallback routing**. |
| [#8320](https://github.com/agentscope-ai/QwenPaw/issues/8320) OPEN — `make-skill` validator import failure | 3 | Issue | Desktop packaging/module-resolution bug blocking skill authoring on Windows. |
| [#8289](https://github.com/agentscope-ai/QwenPaw/issues/8289) OPEN — "Making QwenPaw Lighter and More Extensible" | 2 | Issue | **Roadmap signal** for v2.3.0 plugin refactor; community invited to comment. |

The dominant theme is **robustness of the model-gateway abstraction** (audio, content inspection, media bytes) and **extensibility of the plugin surface** (theming, hosting, channel plugins).

## 5. Bugs & Stability

Ranked by severity:

1. **🔴 HIGH — Media-in-history session wedges (design-level).** [#8335](https://github.com/agentscope-ai/QwenPaw/issues/8335) documents WeChat sessions dying with 48 MB request bodies and `length limit exceeded`; [#8171](https://github.com/agentscope-ai/QwenPaw/issues/8171) closed today but [#8034](https://github.com/agentscope-ai/QwenPaw/pull/8034) (bound inline media per request, not per file) is still under review. **Root cause: media counts ~0 tokens so token-based eviction never fires.** Fix PR open but not merged.
2. **🔴 HIGH — Content-inspection false positives kill turns.** [#8092](https://github.com/agentscope-ai/QwenPaw/issues/8092) — `data_inspection_failed` classified as `bad_request`, no retry/fallback. Fix PR [#8124](https://github.com/agentscope-ai/QwenPaw/pull/8124) is open under review.
3. **🟠 MEDIUM-HIGH — v2.2.2 console freeze on conversation switch.** [#8288](https://github.com/agentscope-ai/QwenPaw/issues/8288) — blocking ready-gate re-render causes tens-of-seconds freeze with rich content; **2.2.1 unaffected → regression.** No fix PR yet.
4. **🟠 MEDIUM — Context compaction failure.** [#8312](https://github.com/agentscope-ai/QwenPaw/issues/8312) — `CONTEXT UNFIT: 252565 > 251904 tokens`, task aborts mid-run. No fix PR.
5. **🟠 MEDIUM — Feishu channel 426 with proxy env.** [#8315](https://github.com/agentscope-ai/QwenPaw/issues/8315) — no `NO_PROXY` default for `feishu.cn`. No fix PR.
6. **🟡 LOW — Desktop `make-skill` import failure.** [#8320](https://github.com/agentscope-ai/QwenPaw/issues/8320). No fix PR.
7. **🟡 LOW — Telegram ignores `reply_to_message`.** [#8329](https://github.com/agentscope-ai/QwenPaw/issues/8329) — quoted context dropped; other channels implement it.
8. **🟡 LOW — Sidebar header overlap.** [#8333](https://github.com/agentscope-ai/QwenPaw/issues/8333); **Cron edit dialog won't close after edit** ([#8340](https://github.com/agentscope-ai/QwenPaw/issues/8340)); **Cron default time resets to 00:00 and shows `[object Object]`** ([#8249](https://github.com/agentscope-ai/QwenPaw/issues/8249), fix PR [#8305](https://github.com/agentscope-ai/QwenPaw/pull/8305) open).

## 6. Feature Requests & Roadmap Signals

- **Plugin system v2 (strongest signal):** [#8289](https://github.com/agentscope-ai/QwenPaw/issues/8289) explicitly frames the v2.3.0 plugin refactor; [#8071](https://github.com/agentscope-ai/QwenPaw/issues/8071) (theme tokens), [#8311](https://github.com/agentscope-ai/QwenPaw/issues/8311) (HarmonyOS `window.QwenPaw` contract), and PR [#8187](https://github.com/agentscope-ai/QwenPaw/pull/8187) (channels-as-plugins) all converge. **Predict: v2.3.0 = lighter core + plugin-extracted channels + richer theme/host contracts.**
- **Realtime voice** ([#7785](https://github.com/agentscope-ai/QwenPaw/pull/7785)) — likely v2.3.0 feature.
- **Reverse-proxy subpath support** ([#8177](https://github.com/agentscope-ai/QwenPaw/issues/8177), closed) — self-hosting deployment pattern now unblocked.
- **Tool approval security mode** ([#8283](https://github.com/agentscope-ai/QwenPaw/pull/8283)) and Firecrawl web_search ([#8200](https://github.com/agentscope-ai/QwenPaw/pull/8200)) round out capability expansion.

## 7. User Feedback Summary

**Pain points (dissatisfaction):**
- **Media handling is the #1 recurring complaint.** Multiple independent users (WeChat, Telegram, LM Studio, DashScope, llama-server) hit session-wedging or turn-killing media errors — a systemic gap rather than isolated bugs.
- **v2.2.2 regressions** frustrate stable-channel users ([#8288](https://github.com/agentscope-ai/QwenPaw/issues/8288), [#8340](https://github.com/agentscope-ai/QwenPaw/issues/8340), [#8249](https://github.com/agentscope-ai/QwenPaw/issues/8249)) — console freeze and Cron editor bugs are visible, reproducible, and erode trust in the stable branch.
- **Gateway error classification** breaks expensive multimodel fallback chains ([#8092](https://github.com/agentscope-ai/QwenPaw/issues/8092)) — users configured 12-model chains that never engage.

**Positive signals:**
- Community is **actively contributing** — first-time contributor merged (Firecrawl), HarmonyOS app maintainers engaging upstream, detailed reproduction reports with measurements.
- Users are **invested in extensibility** — theme tokens, plugin hosting, mobile contracts indicate a growing ecosystem.
- Maintainers **communicate roadmap publicly** ([#8289](https://github.com/agentscope-ai/QwenPaw/issues/8289)) and close issues promptly.

## 8. Backlog Watch

Long-running or high-impact items needing maintainer attention:

- **[PR #7565](https://github.com/agentscope-ai/QwenPaw/pull/7565)** — XXXL plugin clean unload / hot reload. Open since **2026-09-04** (~6 weeks). Core to the v2.3.0 plugin story; needs review bandwidth.
- **[PR #7785](https://github.com/agentscope-ai/QwenPaw/pull/7785)** — XXXL realtime voice chat. Open since **2026-09-15** (~5 weeks). Large surface area; risk of bit-rot.
- **[PR #8034](https://github.com/agentscope-ai/QwenPaw/pull/8034)** — bound inline media per request. Open since **2026-09-29**, under review. This is the **root-cause fix** for the media-wedge class (#8335, #8171); its merge would close several open issues at once.
- **[PR #8124](https://github.com/agentscope-ai/QwenPaw/pull/8124)** — route content-inspection errors to fallback. Open since **2026-10-08**. Directly addresses [#8092](https://github.com/agentscope-ai/QwenPaw/issues/8092).
- **[Issue #8288](https://github.com/agentscope-ai/QwenPaw/issues/8288)** — v2.2.2 console freeze regression with no fix PR yet; high user impact for a **stable** release.
- **[PR #8187](https://github.com/agentscope-ai/QwenPaw/pull/8187)** — XXXL channel-to-plugin extraction with subprocess isolation. Architectural keystone for v2.3.0; needs design review.

**Bottom line:** QwenPaw is healthy and actively evolving, but the **v2.2.2 stable branch carries unpatched regressions** and the **media/context-management subsystem has a systemic fragility** that is generating the majority of user pain. Prioritizing PRs #8034 and #8124, plus a 2.2.3 patch for the console draft/regression issues, would materially improve perceived quality ahead of the v2.3.0 plugin refactor.

</details>

<details>
<summary><strong>ZeroClaw</strong> — <a href="https://github.com/zeroclaw-labs/zeroclaw">zeroclaw-labs/zeroclaw</a></summary>

# ZeroClaw Project Digest — 2026-10-20

## 1. Today's Overview

ZeroClaw remains in a high-intensity pre-release stabilization phase, with 48 issues and 50 PRs updated in the last 24 hours. Activity is heavily weighted toward open work: 46 of 48 issues are open, and 42 of 50 PRs are unmerged. No new releases were cut, but a substantial portion of the open items are tagged `release:v0.8.7`, indicating the project is actively gating v0.8.7 on a large batch of bug fixes, plugin/WASM hardening, and CI/release-infrastructure work. The dominant themes today are **plugin security & correctness**, **memory consolidation semantics**, **SOP/agent-loop reliability**, and **release engineering (binary size, arm64 Docker, CI legs)**. Overall project health looks busy but strained: many P1/P0 items are accepted but unfixed, and several long-lived issues (#6998, #8415, #10066) are still open after months.

## 2. Releases

No new releases in the last 24 hours. The `Latest Releases` section is empty, so no changelog, breaking changes, or migration notes are available today. However, multiple open issues and PRs are explicitly tagged `release:v0.8.7`, suggesting v0.8.7 is the next target and is currently blocked by items such as #10066 (P0 SOP output-schema rejection), #11580 (release binary size gate), #11828 (arm64 `dist` image OOM), and the plugin webhook/RPC stack (#11318–#11322).

## 3. Project Progress

No PRs were merged today in the provided dataset (all 20 shown PRs are `OPEN` except one `CLOSED` docs PR). The single closed item is:

- **[CLOSED] #11329** `docs(plugins): document the Discord plugin and its acceptance run` — https://github.com/zeroclaw-labs/zeroclaw/pull/11329

That closure is documentation-only. The real forward motion today is in **open PRs advancing v0.8.7 blockers**, notably:

- **#11833** `ci(docker): bound arm64 build memory and add a dry-run dispatch to docker-publish` — addresses #11828's OOM. https://github.com/zeroclaw-labs/zeroclaw/pull/11833
- **#11872** `fix(mcp): replay a tool call rejected for a stale HTTP session` — directly targets the MCP poisoning class of bugs (#10807). https://github.com/zeroclaw-labs/zeroclaw/pull/11872
- **#11868** `fix(agent): stop repeated calls before dispatch and retain closeout` — agent-loop stability. https://github.com/zeroclaw-labs/zeroclaw/pull/11868
- **#11895** `fix(providers): keep a quota provider out until its stated reset` — provider reliability. https://github.com/zeroclaw-labs/zeroclaw/pull/11895
- **#11319 / #11320 / #11322** — the plugin webhook ingress/RPC stack, a large coordinated feature series still in review. https://github.com/zeroclaw-labs/zeroclaw/pull/11319

Net: **no landings today, but a deep queue of merge-ready-looking fixes is staged.**

## 4. Community Hot Topics

Ranked by comment count among today's updated items:

1. **#11055** — *Standalone channel start SOP turns lack live channel tool handles* — 8 comments, P1, risk:high. https://github.com/zeroclaw-labs/zeroclaw/issues/11055
   Underlying need: channel-addressed tools are unusable outside two daemon entry points; users want SOP/channel wiring to be uniform.

2. **#11296** — *llama.cpp and custom provider use wrong url/uri for models* — 6 comments. https://github.com/zeroclaw-labs/zeroclaw/issues/11296
   Underlying need: correct model discovery for self-hosted/router-based providers; a core local-LLM use case.

3. **#6998** — *Schema-validated memory consolidation with bounded fallback* — 6 comments, open since **May 29**. https://github.com/zeroclaw-labs/zeroclaw/issues/6998
   Underlying need: memory consolidation is fragile across providers (Markdown fences, prose, invalid JSON); users want robust structured output.

4. **#10999** — *Publish and prove Discord plugin installation from a release binary* — 5 comments, `status:blocked`. https://github.com/zeroclaw-labs/zeroclaw/issues/10999
   Underlying need: end-to-end proof that the plugin registry + WASM installation path works from a shipped artifact.

5. **#10066** — *SOP engine promotes and runs later steps before recording output-schema rejection* — 5 comments, **P0**, S1 workflow blocked. https://github.com/zeroclaw-labs/zeroclaw/issues/10066

6. **#11416** — *Slack "is thinking…" status no longer shown since v0.8.5* — 5 comments, possibly a regression. https://github.com/zeroclaw-labs/zeroclaw/issues/11416

The comment distribution (max 8) suggests **no single runaway controversy**; instead the community is spread across many mid-priority correctness and UX threads — a sign of a broad, mature issue surface rather than one fire.

## 5. Bugs & Stability

Ranked by severity, today's notable bugs and regressions:

**P0 / S1 (workflow blocked):**
- **#10066** — SOP engine runs later steps before recording an output-schema rejection; later steps *actually execute*. Needs immediate attention; tagged `release:v0.8.7`. No fix PR identified. https://github.com/zeroclaw-labs/zeroclaw/issues/10066
- **#10807** — MCP connection permanently poisoned by one failed recovery attempt (S1). Related fix PR **#11872** is open. https://github.com/zeroclaw-labs/zeroclaw/issues/10807

**P1 / high risk:**
- **#11055** — standalone channel SOP turns lack live channel tool handles. https://github.com/zeroclaw-labs/zeroclaw/issues/11055
- **#11554** — earlier path-marker images re-sent every turn; model describes phantom "new" images (S2). https://github.com/zeroclaw-labs/zeroclaw/issues/11554
- **#11332** — skill review/creation never runs for channel, webhook, or gateway turns (S2). https://github.com/zeroclaw-labs/zeroclaw/issues/11332
- **#11327** — plugin tool-name gate only sees pre-plugin tools; a plugin can pre-empt `tool_search`, MCP, peripheral, and skill tools. Security-relevant. https://github.com/zeroclaw-labs/zeroclaw/issues/11327
- **#11552** — tool egress ceremony ignores `websocket_client` and `socket_client` declarations. https://github.com/zeroclaw-labs/zeroclaw/issues/11552
- **#11813** — plugin egress stalls when the first resolved address is blackholed. https://github.com/zeroclaw-labs/zeroclaw/issues/11813
- **#11580** — x86_64 Linux release binary only ~0.7 MB under the 64 MiB cap; release-gate risk. https://github.com/zeroclaw-labs/zeroclaw/issues/11580

**P2 / P3:**
- **#11336** — `plugin info`/`plugin list --verify` report `[loads]` for a plugin the runtime refuses to register. https://github.com/zeroclaw-labs/zeroclaw/issues/11336
- **#11357** — `plugin remove` deletes `plugins_dir/<name>` rather than the actual load directory (can delete unrelated data). https://github.com/zeroclaw-labs/zeroclaw/issues/11357
- **#11360** — package lock file readable by other local accounts; can block install/remove. https://github.com/zeroclaw-labs/zeroclaw/issues/11360
- **#11416** — Slack "is thinking…" status regression since v0.8.5 (S3). https://github.com/zeroclaw-labs/zeroclaw/issues/11416
- **#11818** — `config set agents.*` fails with bare `SUN_LEN` error on long config dirs (`good first issue`). https://github.com/zeroclaw-labs/zeroclaw/issues/11818
- **#11819** — Quickstart lists models from default endpoint before asking for URI. https://github.com/zeroclaw-labs/zeroclaw/issues/11819

**Recently closed:** #11087 (Windows window-close lifecycle bug) is CLOSED as of 2026-10-19. https://github.com/zeroclaw-labs/zeroclaw/issues/11087

**Assessment:** The plugin subsystem is the clear stability hotspot — roughly half of today's high-severity bugs touch plugin install/egress/tool-name/removal. The MCP and SOP paths are the next most fragile.

## 6. Feature Requests & Roadmap Signals

Notable open feature requests and roadmap items:

- **#11657** — Configurable target category for turn consolidation (`[memory] consolidation_category`). https://github.com/zeroclaw-labs/zeroclaw/issues/11657
- **#10426** — Show user-facing agent progress in Telegram. https://github.com/zeroclaw-labs/zeroclaw/issues/10426
- **#8415** — Telegram Bot API 10.1 Rich Messages (1 👍, open since June 28, `status:icebox`). https://github.com/zeroclaw-labs/zeroclaw/issues/8415
- **#10168** — Enable the stall watchdog by default (`stall_timeout_secs`). https://github.com/zeroclaw-labs/zeroclaw/issues/10168
- **#10997** — Install and activate selected plugins during onboarding. https://github.com/zeroclaw-labs/zeroclaw/issues/10997
- **#10341** — Goal Mode implementation roadmap tracker (#8303, #9702, #9703). https://github.com/zeroclaw-labs/zeroclaw/issues/10341
- **#10998** — Deliver agreed minimal core tool set + binary-size evidence. https://github.com/zeroclaw-labs/zeroclaw/issues/10998

**Prediction for v0.8.7:** memory consolidation configurability (#11657), plugin onboarding (#10997), and the minimal core tool set (#10998) are the most likely to ride along with the release-tagged fixes. Goal Mode (#10341, plus PR #11879 adding dormant config/grammar) is clearly being staged but explicitly *not* executable yet — expect it in a later minor, not v0.8.7. Telegram Rich Messages (#8415) and the Telegram progress indicator (#10426) remain icebox/parking-lot and are unlikely to ship next.

## 7. User Feedback Summary

Real pain points visible in today's data:

- **Silent agents erode trust.** Telegram users see nothing until the final response (#10426), and Slack users lost the "is thinking…" indicator in v0.8.5 (#11416). Users want visible progress/liveness, especially for long tool-calling turns.
- **Self-hosted/local LLM friction.** The llama.cpp/custom-provider URI bug (#11296) and the Quickstart model-listing order (#11819) show onboarding for non-cloud providers is rough.
- **Memory reliability.** Memory consolidation breaks with imperfect model output (#6998) and loses preference provenance on merge (#10755); users are asking for explicit control (#11657).
- **Plugin trust and safety.** Several reports describe plugins that pass CLI checks but silently fail at runtime, or worse, can pre-empt core tools (#11327, #11336, #11357). Users are effectively asking for stronger guarantees in the WASM plugin host.
- **Satisfaction signals:** the presence of `good first issue`, `quickstart`, and `topic:operator-ux` tags, plus low 👍 counts and civil 1–8 comment threads, suggests an engaged but not-yet-frustrated community. Dissatisfaction is specific and actionable rather than broad.

## 8. Backlog Watch

Long-unanswered or repeatedly-updated items needing maintainer attention:

- **#6998** — Memory consolidation schema validation. Open since **2026-05-29**, 6 comments, `status:parking-lot`. Foundational reliability work; has been parked for ~5 months. https://github.com/zeroclaw-labs/zeroclaw/issues/6998
- **#8415** — Telegram Bot API 10.1 Rich Messages. Open since **2026-06-28**, `status:icebox`. https://github.com/zeroclaw-labs/zeroclaw/issues/8415
- **#10066** — P0 SOP output-schema ordering bug. Open since **2026-08-17**, still S1-blocking and release-tagged; no fix PR visible. https://github.com/zeroclaw-labs/zeroclaw/issues/10066
- **#10007** — PR `feat(memory): honor the preference subtype only for user-authored turns`. Open since **2026-08-15**, marked `do-not-merge`, `status:blocked`, `needs-author-action`. A security-adjacent memory-provenance change stuck for two months. https://github.com/zeroclaw-labs/zeroclaw/pull/10007
- **#10341** — Goal Mode roadmap tracker, open since **2026-08-25**, coordinating multiple RFCs. https://github.com/zeroclaw-labs/zeroclaw/issues/10341
- **#10999 / #10997 / #10998** — The #7432 plugin/onboarding/core-tool-set phase, all opened **2026-09-20** and still blocked or awaiting action; these are release-gating. https://github.com/zeroclaw-labs/zeroclaw/issues/10999
- **#11061** — PR `fix(security): block high-risk shell commands even when allowlisted`. Open since **2026-09-23**, `needs-author-action`, risk:high. A security fix that has stalled. https://github.com/zeroclaw-labs/zeroclaw/pull/11061
- **#11383** — PR wiring MiniMax M3 image/video inputs, marked `stale-candidate`. https://github.com/zeroclaw-labs/zeroclaw/pull/11383

**Maintainer call to action:** the highest-leverage items are #10066 (P0, blocking), #10007 and #11061 (both security/high-risk and stalled on author action), and the #10997–#10999 plugin-onboarding cluster that gates v0.8.7.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*