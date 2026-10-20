# OpenClaw Ecosystem Digest 2026-10-20

> Issues: 132 | PRs: 500 | Projects covered: 5 | Generated: 2026-10-20 09:19 UTC

- [OpenClaw](https://github.com/openclaw/openclaw)
- [Hermes Agent](https://github.com/nousresearch/hermes-agent)
- [IronClaw](https://github.com/nearai/ironclaw)
- [QwenPaw](https://github.com/agentscope-ai/QwenPaw)
- [ZeroClaw](https://github.com/zeroclaw-labs/zeroclaw)

---

## OpenClaw Deep Dive

# OpenClaw Project Digest — 2026-10-20

## 1. Today's Overview

OpenClaw is in a **high-velocity but stability-strained** state. Activity is intense: 500 PRs and 132 issues updated in the last 24 hours, with a healthy 238 PRs merged/closed against 262 still open (~48% closure rate on the PR front). However, the issue tracker reveals a persistent tail of **long-lived P0/P1 defects** — many filed in mid-September and still open on 2026-10-20 with the `stale` label — primarily around update failures, message loss, session-state inconsistencies, and gateway lifecycle/regressions. A single beta release (`v2026.10.10-beta.2`) shipped with a workspace-safety fix, while a wave of "low-value test removal" batches (d309–d312) suggests active test-suite consolidation. Overall health: **maintainer throughput is strong, but release quality and regression management appear under pressure.**

---

## 2. Releases

**v2026.10.10-beta.2** — pre-release (beta channel)
- **Fixes:** Workspace safety — a multi-file `apply_patch` is now rejected *before* any file is changed if a later update target is missing or has mismatched context, preserving the original workspace for the next attempt. Commit-time I/O failures can still leave partial changes.
- Release notes for this version are otherwise thin — **Highlights** and **Changes** sections are empty, indicating an incremental beta rather than a feature drop.
- **No breaking changes or migration notes** documented for this release.

⚠️ Related signal: Issue [#177742](https://github.com/openclaw/openclaw/issues/177742) reports that this same beta warns against its own managed Codex runtime pin (0.160.0 vs. detected 0.163.0), suggesting the release has a version-pin mismatch to watch.

---

## 3. Project Progress

**Closed/merged items of note (238 total closed/merged PRs):**

- [#176889](https://github.com/openclaw/openclaw/issues/176889) — **CLOSED**: Workboard dispatch to archived worker sessions consumed the retry budget on every rejection. Fixed (queueable-fix).
- [#135658](https://github.com/openclaw/openclaw/issues/135658) — **CLOSED**: Regression where cron jobs ending in `NO_REPLY` after tool calls incorrectly delivered a synthesized "no final summary was produced" fallback (2026.8.2). Fixed.
- [#177707](https://github.com/openclaw/openclaw/issues/177707) — **CLOSED**: `TMPDIR` update path still filled the home disk and halted with `update-recovery-pending`.
- [#146946](https://github.com/openclaw/openclaw/issues/146946) — **CLOSED**: Recovered tool-finalizer answer was dropped after a progress reply (message-loss).
- [#145842](https://github.com/openclaw/openclaw/issues/145842) — **CLOSED**: Missing Linux `.deb`/`.AppImage` artifacts across four releases (upstream pipeline issue).
- [#145723](https://github.com/openclaw/openclaw/issues/145723) — **CLOSED**: Stale Skill Workshop proposals with no cleanup UI action.

**Merged PR themes:**
- Test-suite consolidation batches d309–d312 ([#178243](https://github.com/openclaw/openclaw/pull/178243), [#178290](https://github.com/openclaw/openclaw/pull/178290), [#178299](https://github.com/openclaw/openclaw/pull/178299), [#178294](https://github.com/openclaw/openclaw/pull/178294)) — no production behavior change.
- Runtime cleanup: [#178242](https://github.com/openclaw/openclaw/pull/178242) removed unread private runtime reports.
- CI: [#178305](https://github.com/openclaw/openclaw/pull/178305) gave weekly PostgreSQL shards more timeout headroom.

---

## 4. Community Hot Topics

| Rank | Item | Comments | Signal |
|------|------|----------|--------|
| 1 | [#125764](https://github.com/openclaw/openclaw/issues/125764) Telegram outbound sends dead-lettered after one attempt — **🦞 diamond lobster** | 12 | Silent high-value message loss; no retry/reconcile |
| 2 | [#113701](https://github.com/openclaw/openclaw/issues/113701) Context overflow → compaction can't recover → failure loop | 9 | Sub-agent workloads break sessions |
| 3 | [#158070](https://github.com/openclaw/openclaw/issues/158070) Preflight compaction fails with "authority no longer active" | 7 | Message-loss in lane-queued runs; security-review flagged |
| 4 | [#145937](https://github.com/openclaw/openclaw/issues/145937) QQ channel has no fully-working plugin on 2026.9.x | 6 | Two-part integration regression |
| 5 | [#80843](https://github.com/openclaw/openclaw/issues/80843) web_search provider fallback chain (👍 4) | 6 | Most-upvoted open request; quota/network resilience |

**Underlying needs:** The community's dominant anxiety is **reliability of message delivery and session state under real-world network conditions and multi-agent load**. Five of the top items are message-loss or session-state defects. Secondary demand is **provider resilience** (fallback chains, longer discovery timeouts) and **channel parity** (Telegram, QQ).

---

## 5. Bugs & Stability

**P0 / release-blocker severity:**
- Update failures on 2026.9.3/9.4 (`global-install-failed`, `runtime-verification-failed`, `database-schema-preflight`, `unexpected-error`) — a **large cluster of ~15+ P0 issues** ([#146783](https://github.com/openclaw/openclaw/issues/146783), [#145781](https://github.com/openclaw/openclaw/issues/145781), [#147083](https://github.com/openclaw/openclaw/issues/147083), [#146911](https://github.com/openclaw/openclaw/issues/146911), [#146268](https://github.com/openclaw/openclaw/issues/146268), and more). Most are `stale`/`needs-info` with **no fix PR**.
- [#145202](https://github.com/openclaw/openclaw/issues/145202) — session-sqlite-import-archive parsed on main thread → ~6-min event-loop freezes, healthcheck fails. No fix PR.

**P1 severity:**
- [#174895](https://github.com/openclaw/openclaw/issues/174895) — Live Gateway judged "definitely stale"; lock reclaimed by a second process → spurious restart/crash-loop (Windows). Has `fix-shape-clear`, `queueable-fix`.
- [#169797](https://github.com/openclaw/openclaw/issues/169797) — Gateway 2026.9.9/10.1 uses ~2.5× memory and 3–5× slower start vs. 2026.9.4 on single-CPU hosts (crash-loop).
- [#164690](https://github.com/openclaw/openclaw/issues/164690) — `claude-cli` spawns every stdio MCP server twice (~144 MB per child, non-configurable).
- [#164533](https://github.com/openclaw/openclaw/issues/164533) — `sessions_send` intermittently fails with `SessionTranscriptWriterClaimReboundError`.
- [#158070](https://github.com/openclaw/openclaw/issues/158070) — Preflight compaction voids in-flight delivery.

**Regressions (new today):**
- [#177989](https://github.com/openclaw/openclaw/issues/177989) — Kimi Code repeats tool calls / over-polls background processes in 2026.10.4/10.5 (⚠️ regression, no fix PR).

**Fix-PR presence:** [#174895](https://github.com/openclaw/openclaw/issues/174895), [#176889](https://github.com/openclaw/openclaw/issues/176889) (closed), and [#135658](https://github.com/openclaw/openclaw/issues/135658) (closed) have fixes in flight or landed. The **majority of the P0 update-failure cluster has no fix PR** — the most significant stability gap.

---

## 6. Feature Requests & Roadmap Signals

- [#80843](https://github.com/openclaw/openclaw/issues/80843) — **web_search provider fallback chain** (👍 4). Highest community traction; likely to be prioritized given the provider-resilience theme.
- [#160990](https://github.com/openclaw/openclaw/issues/160990) — Keep live progress cards visible while delegated subagents run instead of a generic waiting message. Directly addresses multi-agent UX.
- [#145021](https://github.com/openclaw/openclaw/issues/145021) — Plugin-owned cancellation of host-bound current-turn delivery.
- [#146282](https://github.com/openclaw/openclaw/issues/146282) — Activate plugin-provided sandbox backend from `agents.*.sandbox.backend` at Gateway startup.
- [#145318](https://github.com/openclaw/openclaw/issues/145318) — Per-sender queue mode (steer for same sender, followup for others) for group chats.

**Prediction:** Provider/network resilience work (fallback chains, configurable timeouts — cf. [#168356](https://github.com/openclaw/openclaw/issues/168356)) and multi-agent UX (progress cards, per-sender queueing) are the strongest candidates for the next feature release windows. Several PRs already advance adjacent infrastructure: [#175509](https://github.com/openclaw/openclaw/pull/175509) (Bifrost provider) and [#177941](https://github.com/openclaw/openclaw/pull/177941) (cron persistent host streams).

---

## 7. User Feedback Summary

**Pain points (dissatisfaction):**
- **Silent message loss** is the #1 recurring complaint — Telegram ([#125764](https://github.com/openclaw/openclaw/issues/125764)), QQ ([#145937](https://github.com/openclaw/openclaw/issues/145937)), lane-queued compaction ([#158070](https://github.com/openclaw/openclaw/issues/158070)), and recovered-answer drops ([#146946](https://github.com/openclaw/openclaw/issues/146946)). Users consistently emphasize *no user-visible error and no retry*.
- **Update process is fragile** — a large wave of P0 update-failure reports across platforms (darwin/arm64, linux/x64, win32/x64) erodes trust in the release pipeline.
- **Performance regressions** — Gateway memory (2.5×) and slow start ([#169797](https://github.com/openclaw/openclaw/issues/169797)); `claude-cli` duplicate MCP spawns ([#164690](https://github.com/openclaw/openclaw/issues/164690)).
- **Stale UI state** — duplicate assistant bubbles, deleted sessions persisting until hard refresh ([#146472](https://github.com/openclaw/openclaw/issues/146472)).

**Positive signals:** Users are filing richly-detailed, reproducible bug reports with environment metadata and use-case context, and volunteering fix PRs — a sign of an engaged, technically sophisticated community. Constructive feature requests (e.g., web_search fallback) are gaining upvotes (👍 4).

---

## 8. Backlog Watch

Long-unanswered or stale issues needing maintainer attention:

| Issue | Age (days) | Priority | Need |
|-------|-----------|----------|------|
| [#145202](https://github.com/openclaw/openclaw/issues/145202) event-loop freeze | ~39 | **P0** | No fix PR; crash-loop, message-loss |
| [#146783](https://github.com/openclaw/openclaw/issues/146783), [#145781](https://github.com/openclaw/openclaw/issues/145781), [#147083](https://github.com/openclaw/openclaw/issues/147083), [#146911](https://github.com/openclaw/openclaw/issues/146911), + ~12 more | ~38 | **P0** | Entire update-failure cluster stale/needs-info |
| [#176889](https://github.com/openclaw/openclaw/issues/176889) | — | P2 | ✅ Closed today |
| [#80843](https://github.com/openclaw/openclaw/issues/80843) web_search fallback | ~161 | P2 | Oldest high-upvote open request; needs product decision |
| [#145021](https://github.com/openclaw/openclaw/issues/145021) plugin delivery cancellation | ~39 | P2 | Needs product decision |
| [#146282](https://github.com/openclaw/openclaw/issues/146282) sandbox backend activation | ~38 | P2 | Fix-shape clear; needs maintainer review |
| [#145318](https://github.com/openclaw/openclaw/issues/145318) per-sender queue mode | ~39 | P2 | Needs product decision |

**Maintainer action flags:** The `clawsweeper:needs-product-decision` and `needs-maintainer-review` labels dominate the backlog — the bottleneck is **decision throughput, not engineering capacity**. The P0 update-failure cluster (15+ issues, all stale) is the single most urgent item: users on stable are unable to upgrade safely, and no fix PRs exist. Prioritizing this cluster, plus [#145202](https://github.com/openclaw/openclaw/issues/145202) and [#174895](https://github.com/openclaw/openclaw/issues/174895), would materially improve the project's stability posture before the next stable cut.

---

*Generated from OpenClaw GitHub activity data, 2026-10-20.*

---

## Cross-Ecosystem Comparison

# Cross-Project Comparison Report
## Personal AI Assistant / Agent Open-Source Ecosystem
**Data window:** 2026-10-20 · **Projects:** OpenClaw, Hermes Agent, IronClaw, QwenPaw, ZeroClaw

---

## 1. Ecosystem Overview

The personal AI assistant / agent open-source landscape on 2026-10-20 is **mature in surface area but strained in reliability**. All five projects are actively maintained, but none shipped a stable release in the window — every project is in a pre-release hardening, bug-fix, or refactor phase rather than a feature-launch phase. The shared theme across all trackers is **agent-loop correctness, channel/provider integration robustness, and plugin extensibility**, with a secondary and increasingly vocal emphasis on **observability of agent behavior** (progress indicators, honest error reporting, verifiable plugin behavior). Two distinct archetypes are visible: high-throughput, regression-heavy projects (OpenClaw, ZeroClaw) and lower-volume, review-bottlenecked projects (Hermes, IronClaw). The ecosystem is collectively transitioning from "does the agent work?" to "can we trust it in production/multi-profile/multi-channel deployments?"

---

## 2. Activity Comparison

| Project | Issues (updated / open signal) | PRs (updated / open / merged) | Release status | Health score (qualitative) |
|---|---|---|---|---|
| **OpenClaw** | 132 updated; large stale P0/P1 tail | **500** updated; 262 open, **238 merged/closed (~48%)** | `v2026.10.10-beta.2` (incremental beta) | ⚠️ **Stressed** — high throughput, weak regression management |
| **Hermes Agent** | 8 updated; **8/8 open, 0 closed** | 50 touched; **42 open, 8 merged** (~16%) | None | ⚠️ **Merge-bottlenecked** — strong contributor volume, low close rate |
| **IronClaw** | 2 updated (1 auto-taxonomy) | 3 open, **0 merged** | None | 🟡 **Quiet/stable** — low velocity, single-author-driven |
| **QwenPaw** | 15 updated; 12/15 open | 37 updated; **13/37 merged (~35%)** | v2.2.2 GA (regressions surfaced); v2.2.2-beta.4 closed | 🟡 **Under load** — post-GA stabilization, large XL PR queue |
| **ZeroClaw** | 42 updated; **0 issues closed** | 50 touched; 7 merged/closed | None; **v0.8.7 pre-release hardening** | ⚠️ **Strained** — triage accumulating faster than resolution |

**Key data points:**
- Only **OpenClaw** approaches a ~50% PR close rate; Hermes sits at ~16%, ZeroClaw's issue close rate is 0.
- **IronClaw** is an outlier in scale — activity an order of magnitude below peers.
- **No project shipped a stable release today** — universal pre-release posture.

---

## 3. OpenClaw's Position

**Advantages vs peers:**
- **Scale of contribution**: 500 updated PRs/day vs. Hermes (50), ZeroClaw (50), QwenPaw (37). OpenClaw is operating at ~10× the throughput of any peer.
- **Release cadence**: The only project shipping beta artifacts in the window; competitors produced none.
- **Diamond-tier community signals**: Highest-comment issues (12) and the only project with upvote-weighted feature traction (#80843, 👍 4).

**Technical approach differences:**
- OpenClaw is **gateway/daemon-centric** with a lane-queued session model (e.g., `sessions_send`, preflight compaction, workboard dispatch). This architecture surfaces *unique* failure modes — session-state inconsistencies, lane-queued delivery loss — that other projects don't exhibit at the same frequency.
- Maintains a **managed runtime-pin model** (Codex pin mismatch in beta.2), indicating it wraps external agent runtimes rather than being purely self-contained.

**Community size:**
- Largest by **raw participation** and **issue granularity** — it is the only project where the community files richly reproducible reports across four severity tiers with environment metadata, and volunteers fix PRs. However, its **decision throughput is the bottleneck**: `clawsweeper:needs-product-decision` and `needs-maintainer-review` dominate a 38-day-old backlog.

**Position summary:** OpenClaw is the **reference-grade, highest-scale project** — but its stability posture is the weakest of the tier despite its velocity. It is "winning on volume, losing on trust."

---

## 4. Shared Technical Focus Areas

| Theme | Projects | Specific needs |
|---|---|---|
| **Message/channel delivery reliability** | OpenClaw (Telegram, QQ, lane-queued), Hermes (satellite profiles, Telegram edits), ZeroClaw (Slack "is thinking…", Telegram progress), QwenPaw (Telegram `reply_to_message`) | No silent message loss; delivery reconciliation; mid-turn media correctness |
| **Provider/transport fidelity** | ZeroClaw (llama.cpp wrong URI, phantom image re-sends), Hermes (Claude/Codex base-URL bleed, MiniMax missing), OpenClaw (web_search fallback, provider timeouts), QwenPaw (LM Studio audio rejection) | Correct URI resolution, graceful provider rejection fallback, live model catalogs |
| **Plugin/WASM subsystem hardening** | ZeroClaw (egress, tool-name preemption, dir deletion), QwenPaw (v2.3.0 plugin refactor, hot reload, theme extension points), Hermes (kanban-stream, Requesty plugins) | Predictable plugin behavior, isolated execution, standard contracts |
| **Gateway/lifecycle coherence** | OpenClaw (gateway stale-lock, respawn), Hermes (`/quit` respawns gateway, satellite delivery), ZeroClaw (gateway auth RFC #11870) | Stopped gateways must stay stopped; multi-profile routing correctness |
| **Multi-agent / multi-profile UX** | OpenClaw (progress cards, per-sender queue), Hermes (multiplexed 1-gateway-7-profile), ZeroClaw (channel tool wiring across entry points) | Live progress visibility; per-sender queue semantics; entry-point consistency |
| **Memory/context reliability** | ZeroClaw (schema-validated consolidation, embedding prefixes), OpenClaw (compaction failure loops) | Cross-provider memory write reliability; schema validation vs. prompt-JSON |

**Universal requirement emerging:** *Honest failure.* Across every project, users report the system **claiming success while silently failing** — QwenPaw `/compress` "✅ 8 → 8", Hermes `/fast ultrafast` refusing valid sessions, ZeroClaw plugin checks passing but behaving differently at runtime. This is the single most cross-cutting trust deficit.

---

## 5. Differentiation Analysis

| Dimension | OpenClaw | Hermes Agent | IronClaw | QwenPaw | ZeroClaw |
|---|---|---|---|---|---|
| **Feature focus** | General-purpose agent gateway, channels, sessions | Provider routing, CLI correctness, kanban/cron | Hosted MCP connectivity, security posture | Console UX, plugin/modular refactor (v2.3.0) | Plugin/WASM, SOP engine, release engineering |
| **Target users** | Broad multi-channel operators | Multiplexed multi-profile, heterogeneous providers | Local dev + hosted MCP developers | CN/enterprise, HarmonyOS/desktop | Self-hosted, SOP-driven, WASM plugin operators |
| **Architecture** | Gateway/daemon, lane-queued, managed runtime pins | Profile-multiplexed gateway, provider adapters | Hosted MCP + credential-account bridge | Console-centric, channel→plugin extraction | Rust-based, WASM plugins, egress ceremony |
| **Notable differentiator** | Highest scale + reference status | Longest-lived multi-stage PR series (5 wks) | Smallest footprint, security-conscious contributor | Strongest ecosystem pull (45k LOC HarmonyOS host) | Only project with explicit p0 SOP bug, binary-size gates |

**Narrative:**
- **OpenClaw** is the *breadth* play — many channels, many sessions, many bugs.
- **Hermes** is the *depth* play — routing correctness and profile multiplexing for power users.
- **IronClaw** is the *surgical* play — narrowly scoped local-hosted-MCP trust mechanism.
- **QwenPaw** is the *ecosystem* play — plugin/theme contracts and third-party host parity.
- **ZeroClaw** is the *infrastructure* play — Rust/WASM plugin security, SOP workflows, release gates.

---

## 6. Community Momentum & Maturity

**Activity tiers:**

| Tier | Projects | Characteristics |
|---|---|---|
| **Tier 1 — High velocity** | OpenClaw, ZeroClaw | 500 / 50 PRs touched; intense triage; *regression-heavy*; stability under pressure |
| **Tier 2 — Moderate velocity** | Hermes, QwenPaw | 50 / 37 PRs; merge-bottlenecked (Hermes) or post-GA stabilizing (QwenPaw) |
| **Tier 3 — Low velocity** | IronClaw | Single-author, single-topic activity; stable but dormant |

**Rapidly iterating:**
- **QwenPaw** — largest in-flight architectural workstream (channels→plugins extraction, hot reload, voice chat); clearest roadmap (#8289 v2.3.0).
- **ZeroClaw** — intense v0.8.7 release-gate work; stacked PR chains advancing.
- **OpenClaw** — highest merge volume, but iterating **reactively** (test consolidation, regression fixes) more than proactively.

**Stabilizing:**
- **IronClaw** — quiet; no merges, no releases; effectively a maintenance/waiting state.
- **Hermes** — contributor momentum is being **absorbed by review latency**; ~5-week-old PRs suggest the codebase is accumulating unresolved correctness debt.

**Maturity indicator — career-contributor behavior:**
- OpenClaw and Hermes show sustained, named contributor investment (Hermes' `yoyodine-industries` batch; OpenClaw's fix-PR volunteers).
- QwenPaw shows **ecosystem maturation** — external maintainers (HarmonyOS host) requesting upstream contract standardization.
- ZeroClaw shows **release-discipline maturity** — explicit p0/p1 severity labeling, `risk:high` tags, binary-size gates.

---

## 7. Trend Signals

**Industry trends extracted from community feedback (value for AI agent developers):**

1. **Trust is the new feature.** The dominant cross-project complaint is *silent wrongness* — success messages on failed operations, phantom content, ghost gateways. Developers should prioritize **fail-loud, verifiable error contracts** over success-path optimism.

2. **Plugin/WASM is the extensibility battleground — and the security frontier.** Every project is investing in plugins (ZeroClaw WASM egress, QwenPaw v2.3.0 extraction, Hermes community plugins). But the *risk* is uniformly security-adjacent: egress ceremony bypass, tool-name preemption, wrong-directory deletion. **Plugin sandboxing and verifiable behavior are the unmet need.**

3. **Provider-agnostic resilience is table stakes.** Fallback chains (OpenClaw #80843, highest upvote), URI fidelity (ZeroClaw), base-URL isolation (Hermes) — the era of single-provider agents is over. Developers should design for **heterogeneous, self-hosted, and proxied inference endpoints** from day one.

4. **Progress observability drives perceived reliability.** Slack "is thinking…", Telegram progress cards, TUI command display — all demand the same thing: **long-running agent work must be visible**. Silence reads as failure.

5. **Multi-profile / multiplexed gateways are the emerging enterprise topology** — and the sharpest edge. Hermes' 1-gateway-7-profile deployments and ZeroClaw's IdP-outage RFC (#11870) signal that **single-tenant agent servers no longer fit** advanced use cases.

6. **Regression discipline is a competitive moat.** OpenClaw's stale P0 update-failure cluster (15+ issues, no fix PRs) and QwenPaw's v2.2.2-vs-2.2.1 console regression directly erode upgrade confidence. **Release engineering, not feature velocity, is the current quality differentiator.**

**Bottom line for decision-makers:** The ecosystem is in a **consolidation-and-hardening phase**. The projects pulling ahead will be those that resolve their **merge-backlog bottlenecks** (Hermes), **regression backlogs** (OpenClaw, QwenPaw), and **plugin-trust gaps** (ZeroClaw) — not those that ship the most surface area. Teams adopting today should weight **release discipline and fix-to-report ratio** as heavily as feature checklists.

---

*Report compiled from 2026-10-20 community digests for OpenClaw, Hermes Agent, IronClaw, QwenPaw, and ZeroClaw.*

---

## Peer Project Reports

<details>
<summary><strong>Hermes Agent</strong> — <a href="https://github.com/nousresearch/hermes-agent">nousresearch/hermes-agent</a></summary>

# Hermes Agent — Project Digest
**Date:** 2026-10-20
**Repository:** [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent)

---

## 1. Today's Overview

Hermes Agent shows **high-velocity development activity** on 2026-10-20, with 8 issues updated and a striking **50 pull requests touched in the last 24 hours** — of which 42 remain open and only 8 were merged/closed. No new releases shipped today. The issue tracker skews toward **open bugs (8/8 open, 0 closed)**, with a notable concentration in the Docker/gateway backend and CLI session handling. Meanwhile, the PR queue is dominated by a large, long-running batch of fixes from contributor `yoyodine-industries` (kanban/cron/gateway), suggesting sustained investment in reliability rather than new feature landings. Overall the project looks **active but merge-bottlenecked**: contribution volume is strong, yet the low closed-PR count and a deep backlog of multi-week-old PRs point to maintainer review capacity as the current constraint.

---

## 2. Releases

**No new releases in the last 24 hours.** No changelog, breaking changes, or migration notes to report.

---

## 3. Project Progress

Today's merged/closed PR count (8) is low relative to the 42 open PRs, and none of the top-20 most-commented PRs shown are in a merged state — they remain open and under discussion. As a result, **no specific features can be confirmed as landed today** from the provided data. Notable *in-flight* work advancing through review includes:

- **CLI correctness series (kshitijk4poor):** [#141091](https://github.com/NousResearch/hermes-agent/pull/141091) (`/compress` false-success), [#141093](https://github.com/NousResearch/hermes-agent/pull/141093) (`/clear` & `/toolsets` gateway registry), [#140675](https://github.com/NousResearch/hermes-agent/pull/140675) (`/resume`/`/sessions` subscription), [#140676](https://github.com/NousResearch/hermes-agent/pull/140676) (`/snapshot restore`) — a coordinated "CLI lane" cleanup.
- **Ingress regression fixes (teknium1):** [#141916](https://github.com/NousResearch/hermes-agent/pull/141916) restores single delivery of Telegram edits, path messages, mid-turn media, CJK prompts, and Buzz bursts.
- **Kanban/cron hardening (yoyodine-industries):** a cluster of ~10 PRs (#113342, #113343, #110753, #110654, #110305, #109867, #109436, etc.) addressing dispatcher fairness, interrupted-run status, and delegation fences.

**Assessment:** Progress is real but *pending*; the project is accumulating reviewed-but-unmerged work.

---

## 4. Community Hot Topics

Ranked by comment activity:

1. **[Issue #141910](https://github.com/NousResearch/hermes-agent/issues/141910)** — *5 comments.* Shared-bot "satellite" profile loses cron/background delivery once a LOCAL session adapter appears. Multi-profile/multiplex gateway architecture issue.
2. **[Issue #141953](https://github.com/NousResearch/hermes-agent/issues/141953)** — *4 comments.* `/fast ultrafast` inherits the default Claude base URL in a Codex slash worker, refusing eligible OpenAI Codex sessions.
3. **[Issue #134659](https://github.com/NousResearch/hermes-agent/issues/134659)** — *4 comments, 1 👍.* MiniMax-M3.1 live on API but missing from `/v1/models`, docs, and Hermes's curated lists. **The only issue with a reaction today.**
4. **[Issue #141954](https://github.com/NousResearch/hermes-agent/issues/141954)** — *2 comments.* `/quit` after `gateway stop` takes ~10s and respawns a gateway.

**Underlying needs:** The hot topics cluster around **provider/model routing correctness** (Claude vs. Codex base-URL bleed, missing MiniMax model) and **gateway/profile lifecycle coherence** (satellite delivery, gateway respawn). Users running **multi-profile multiplexed gateways** with **heterogeneous providers** are hitting the sharpest edges — this is where architectural complexity is translating into user-visible breakage.

---

## 5. Bugs & Stability

Ranked by severity (all open, all created/updated 2026-10-20 unless noted):

**P2 — High:**
- **[#141953](https://github.com/NousResearch/hermes-agent/issues/141953)** — `/fast ultrafast` base-URL inheritance blocks Codex sessions. *No fix PR linked.*
- **[#134659](https://github.com/NousResearch/hermes-agent/issues/134659)** — MiniMax-M3.1 missing from curated lists (created 2026-10-07, still open 13 days). *No fix PR linked.*
- **[#141954](https://github.com/NousResearch/hermes-agent/issues/141954)** — `/quit` hangs ~10s and **restarts a gateway the user just stopped**. Lifecycle/state bug, Windows-tagged.
- **[#141608](https://github.com/NousResearch/hermes-agent/issues/141608)** — Desktop preview restart runs in base container, not session workspace container (Docker backend).
- **[#141955](https://github.com/NousResearch/hermes-agent/issues/141955)** — **Performance regression:** `created_source` ancestor stamp scans the whole `sessions` table under the writer lock on *every usage write* (introduced by #140678). Cost grows with store size — a scalability concern.
- **[#141607](https://github.com/NousResearch/hermes-agent/issues/141607)** — With `docker_persist_across_processes: false`, idle containers are stopped but **never removed** — unbounded `docker ps -a` growth.

**P3 — Moderate:**
- **[#141910](https://github.com/NousResearch/hermes-agent/issues/141910)** — Satellite profile loses cron/background delivery.
- **[#141945](https://github.com/NousResearch/hermes-agent/issues/141945)** — Feature (TUI command display), not a bug.

**Stability read:** The **Docker backend (#141607, #141608) and gateway session store (#141955)** are the two hottest instability zones. #141955 is especially important — it's a **self-inflicted regression from a recent merge** and a silent performance cliff. None of today's P2 bugs have a confirmed fix PR yet, so this backlog is at risk of aging.

---

## 6. Feature Requests & Roadmap Signals

- **[#141945](https://github.com/NousResearch/hermes-agent/issues/141945)** — *TUI option to show full terminal commands without verbose mode.* Low-cost UX win; likely to land as a display toggle.
- **[#141956](https://github.com/NousResearch/hermes-agent/pull/141956)** — *Community plugin: kanban-stream* (live kanban → Telegram, with mid-task `/steer`).
- **[#141950](https://github.com/NousResearch/hermes-agent/pull/141950)** — *Requesty model-provider plugin* (community-tier, OpenAI-compatible gateway).
- **[#138127](https://github.com/NousResearch/hermes-agent/pull/138127)** — *Opt-in public speech Responses streaming* (`public_commentary` projection) — signals growing interest in **voice/TTS consumers** of the API.
- **[#113343](https://github.com/NousResearch/hermes-agent/pull/113343)** — *Per-job cron `script_timeout_seconds`* override.

**Prediction:** The **plugin-catalog ecosystem** (kanban-stream, Requesty) and the **TUI command-display toggle** are the most likely near-term landings — they're self-contained and low-risk. The cron timeout override and speech streaming are larger and likely to slip. The recurring theme across requests is **extensibility** (plugins) and **observability/control** (seeing full commands, steering live tasks).

---

## 7. User Feedback Summary

**Pain points (dissatisfaction):**
- **Silent wrongness over loud failure.** Several bugs describe the system *claiming success* while doing the wrong thing — `/compress` reporting "✅ Compressed: 8 → 8" on a failed summary ([#141091](https://github.com/NousResearch/hermes-agent/pull/141091)), or `/fast ultrafast` refusing a valid session ([#141953](https://github.com/NousResearch/hermes-agent/issues/141953)). Users value honest error reporting.
- **State resurrection / lifecycle confusion.** The gateway that was just stopped coming back ([#141954](https://github.com/NousResearch/hermes-agent/issues/141954)) and orphaned stopped containers ([#141607](https://github.com/NousResearch/hermes-agent/issues/141607)) erode trust in lifecycle commands.
- **Multi-profile complexity.** The satellite-profile delivery loss ([#141910](https://github.com/NousResearch/hermes-agent/issues/141910)) reflects real advanced deployments (1 gateway, 7 profiles) that the architecture strains to serve.
- **Stale model catalogs.** MiniMax-M3.1 missing ([#134659](https://github.com/NousResearch/hermes-agent/issues/134659)) is a recurring class of friction — users want new models usable *without* waiting on curation.

**Use cases observed:** Multiplexed multi-profile Telegram bots, Docker-isolated per-workspace sessions, Codex/Claude/MiniMax heterogeneous provider setups, and kanban-driven agent task dispatch.

**Satisfaction signals:** The volume of thoughtful, well-reproduced bug reports (many with version hashes, step-by-step repros) and the active contributor response indicate an **engaged, technically sophisticated community** — frustration is specific and actionable rather than diffuse.

---

## 8. Backlog Watch

Long-unanswered / aging items needing maintainer attention:

- **[PR #115003](https://github.com/NousResearch/hermes-agent/pull/115003)** (opened 2026-09-18, ~32 days) — Bot-live-delivery store, layer 1/4 of a multi-part effort. Long-running, multi-stage; needs review to avoid stalling the whole series.
- **[PR #113345](https://github.com/NousResearch/hermes-agent/pull/113345)** (2026-09-16, ~34 days) — Gateway test suite fail-closed on live-Hermes-home resolution.
- **[PR #113343](https://github.com/NousResearch/hermes-agent/pull/113343)** & **[#113342](https://github.com/NousResearch/hermes-agent/pull/113342)** (2026-09-16) — Cron per-job timeout and interrupted-run status.
- **[PR #110753](https://github.com/NousResearch/hermes-agent/pull/110753)**, **[#110654](https://github.com/NousResearch/hermes-agent/pull/110654)**, **[#110305](https://github.com/NousResearch/hermes-agent/pull/110305)** (2026-09-13/14, ~36 days) — Kanban dispatcher correctness cluster, all still open.
- **[Issue #134659](https://github.com/NousResearch/hermes-agent/issues/134659)** (2026-10-07) — MiniMax-M3.1 catalog gap; simple fix, 13 days open, the day's only reacted issue.
- **[PR #122998](https://github.com/NousResearch/hermes-agent/pull/122998)** (2026-09-25, ~25 days) — Plugin disk-cleanup 500 MB rule consistency.

**Watch assessment:** A significant number of PRs from the `yoyodine-industries` batch have been open **~5 weeks**. If these represent genuinely good fixes, the merge backlog itself is now a project-health risk — the codebase may be accumulating unresolved correctness debt faster than it's being cleared, and contributors may lose momentum if review latency persists.

---

*Digest generated from GitHub activity data for 2026-10-20. Comment counts shown as reported; some PRs list `undefined` comment counts in the source data and are excluded from ranking.*

</details>

<details>
<summary><strong>IronClaw</strong> — <a href="https://github.com/nearai/ironclaw">nearai/ironclaw</a></summary>

# IronClaw Project Digest — 2026-10-20

## 1. Today's Overview

IronClaw shows light, steady activity over the past 24 hours: 2 open issues and 3 open PRs were updated, with no closures, merges, or releases. The headline theme is **hosted MCP connectivity for local endpoints** — issue #8146 and its companion PR #8147 (both by tom9000, same day) target the inability to register loopback/HTTP-literal MCP endpoints, indicating a developer actively unblocking a known gap rather than a maintainer-driven initiative. The remaining PR activity is routine dependency maintenance from Dependabot (aiohttp, postcss-selector-parser), plus the recurring automated failure-taxonomy issue #8143. Overall project health appears stable but slow — zero merged PRs and zero releases in the window means no user-facing progress landed today, and the two substantive items are single-author proposals still awaiting review.

## 2. Releases

No new releases in the last 24 hours. No release notes, breaking changes, or migration guidance to report.

## 3. Project Progress

No PRs were merged or closed in the last 24 hours, so no features or fixes officially landed. In-flight work:

- **PR #8147** — *Allow explicit trusted enrollment of an exact loopback MCP endpoint* ([link](https://github.com/nearai/ironclaw/pull/8147)): Adds an explicit opt-in path for a single loopback MCP endpoint, since hosted MCP bearer auth currently works via native credential accounts but registration/manifest/discovery/network policy reject all HTTP/IP-literal endpoints. Directly paired with issue #8146.
- **PR #8145** — Dependabot bump of `aiohttp` 3.14.3 → 3.14.4 in `/tests/e2e` ([link](https://github.com/nearai/ironclaw/pull/8145)): test-infrastructure maintenance only.
- **PR #8144** — Dependabot bump of `postcss-selector-parser` 7.1.4 → 7.1.6 in `/docs/internal/architecture-video` ([link](https://github.com/nearai/ironclaw/pull/8144)): docs tooling maintenance only.

## 4. Community Hot Topics

Engagement is uniformly low — every item has 0 comments and 0 reactions, so "hot" here means *most consequential*, not most discussed:

- **Issue #8146** — *Hosted MCP: explicit 127.0.0.1 endpoint enrollment and private credential-account setup bridge* ([link](https://github.com/nearai/ironclaw/issues/8146)): The core need is enabling local MCP servers (e.g., a local Connector) to use hosted-MCP registration with credential-account bearer auth. The issue notes it follows prior work (#5998) and that registration currently rejects all HTTP/IP literals on `main` (b0b999d).
- **PR #8147** ([link](https://github.com/nearai/ironclaw/pull/8147)): The implementation counterpart to #8146 — the same author filed issue and PR the same day, signaling a contributor-driven fix awaiting maintainer review.

**Analysis:** The underlying need is a friction point in IronClaw's security posture: the network policy's blanket rejection of IP-literal endpoints is correct by default but blocks legitimate localhost development workflows. The proposer is asking for a narrow, explicit trust mechanism rather than loosening validation globally — a reasonable security-conscious direction that maintainers should weigh in on promptly given the issue-PR pair is otherwise stalled.

## 5. Bugs & Stability

No crash, regression, or defect reports were filed today. One stability-adjacent signal:

- **Issue #8143** — *Daily ironclaw failure taxonomy — 2026-10-19* ([link](https://github.com/nearai/ironclaw/issues/8143)): Automated benchmark analysis reports 57 non-pass tasks on the officeqa suite, attributed "almost entirely [to] genuine model-quality errors by DeepSeek-V4-Fla[sic]" rather than IronClaw framework bugs. **Severity: informational** — this points at underlying model performance, not agent infrastructure, and no fix PR is expected or needed on the IronClaw side.

The local-endpoint enrollment gap (#8146) is a functional limitation rather than a bug, but PR #8147 exists as its fix.

## 6. Feature Requests & Roadmap Signals

- **Explicit trusted enrollment of exact loopback MCP endpoints** (#8146 / #8147): The clearest roadmap signal today. If merged, expect a narrowly scoped "trusted local endpoint" enrollment mechanism in the next release — likely gated behind explicit configuration and exact-endpoint matching (not a general IP-literal allowance).
- **Credential-account bearer bridging for local MCP servers** (#8146): The issue also requests a setup bridge so locally hosted servers can consume private credential accounts, which may become a follow-up if #8147 lands first.

No other feature requests appeared in the window.

## 7. User Feedback Summary

The only substantive user signal today comes from tom9000 (#8146/#8147): a developer trying to run a **local Connector as an MCP server** against hosted-MCP infrastructure and hitting hard validation walls in registration, manifest credentials, discovery, and network policy. The pain point is concrete — native hosted-MCP credential flows are unusable for localhost endpoints — and the proposed remedy is surgical rather than a policy reversal, suggesting a user who understands and respects the security model. No satisfaction/dissatisfaction commentary, reactions, or broader user feedback was recorded (all items at 0 👍 / 0 comments).

## 8. Backlog Watch

No long-unanswered items are visible in this 24-hour window — both issues and all three PRs are 0–1 days old. Items warranting maintainer attention **soon** (not stale, but review-blocked):

- **PR #8147** ([link](https://github.com/nearai/ironclaw/pull/8147)) — paired with issue #8146; unresolved review could stall a contributor-driven fix. Priority: high.
- **Issue #8146** ([link](https://github.com/nearai/ironclaw/issues/8146)) — needs a maintainer decision on the security trade-off of explicit loopback trust. Priority: high.
- **PRs #8145 / #8144** ([links](https://github.com/nearai/ironclaw/pull/8145), [#8144](https://github.com/nearai/ironclaw/pull/8144)) — routine Dependabot bumps; low urgency, but zero merges today means dependency hygiene is accumulating.

*Note: comment counts for PRs show as `undefined` in the source data; treated as effectively zero given the overall engagement pattern.*

</details>

<details>
<summary><strong>QwenPaw</strong> — <a href="https://github.com/agentscope-ai/QwenPaw">agentscope-ai/QwenPaw</a></summary>

# QwenPaw Project Digest — 2026-10-20

## 1. Today's Overview

QwenPaw shows **high development velocity** with 37 PRs and 15 issues updated in the last 24 hours, though the project is currently in a **bug-fix and stabilization phase** following the v2.2.2 release. No new releases were published today. Activity is heavily skewed toward the Console/frontend UX and channel integrations, with several high-severity regressions in v2.2.2 (conversation switching freezes, media request-body limits, Telegram reply context loss) drawing maintainer attention. The community remains engaged on the **v2.3.0 modular/plugin refactor roadmap** (#8289), signaling the next major architectural direction. Overall project health is **stable but under load** — many open PRs are XL/XXXL in scope, suggesting a large batch of work is in the pipeline awaiting review.

---

## 2. Releases

**No new releases today.** The latest verified beta is v2.2.2-beta.4 ([#8053](https://github.com/agentscope-ai/QwenPaw/issues/8053), closed today), and the GA v2.2.2 is in circulation with several reported regressions (see §5).

---

## 3. Project Progress

Thirteen PRs were merged/closed today, advancing multiple areas:

| PR | Area | Summary |
|---|---|---|
| [#8339](https://github.com/agentscope-ai/QwenPaw/pull/8339) | Console | Fixes long-conversation wheel-scroll jump (#8284) by overriding placeholder heights; targets the `content-visibility` height-fluctuation root cause. |
| [#8240](https://github.com/agentscope-ai/QwenPaw/pull/8240) | Console | Refines model-management UX — scopes global models vs. agent runtime config vs. chat model selection, adds thinking-level linkage and autosave. |
| [#8266](https://github.com/agentscope-ai/QwenPaw/pull/8266) | Data App | QwenPaw Data 1.0.3 update — shared model config, datasource-aware dataset selection, user-scoped sessions. |
| [#7854](https://github.com/agentscope-ai/QwenPaw/pull/7854) | Drivers | Preserves concurrent policy updates during driver reload (read-modify-write race fix). |
| [#7864](https://github.com/agentscope-ai/QwenPaw/pull/7864) | Security | Path-based integrity protection for skill/knowledge dirs against prompt-injected deletion (ACI-aligned). |
| [#8200](https://github.com/agentscope-ai/QwenPaw/pull/8200) | Tools | Firecrawl added as a `web_search` provider (first-time contributor). |

**In-flight but notable open PRs:** channels-to-plugins extraction with subprocess isolation ([#8187](https://github.com/agentscope-ai/QwenPaw/pull/8187)), decision-model-backed tool approval ([#8283](https://github.com/agentscope-ai/QwenPaw/pull/8283)), realtime voice chat ([#7785](https://github.com/agentscope-ai/QwenPaw/pull/7785)), and rollback-safe plugin hot reload ([#7565](https://github.com/agentscope-ai/QwenPaw/pull/7565)) — together these map cleanly onto the v2.3.0 "lighter and more extensible" theme.

---

## 4. Community Hot Topics

**Most-discussed issues (by comments):**

1. **[#8071](https://github.com/agentscope-ai/QwenPaw/issues/8071) — Plugin-facing theme extension point** (5 comments, OPEN)
   *Need:* Plugin authors want semantic token overrides, not the single `colorPrimary` knob. This is a **platform maturity signal** — third-party developers are hitting the limits of the current theming API and want first-class extension surfaces.

2. **[#8171](https://github.com/agentscope-ai/QwenPaw/issues/8171) — LM Studio 400 "At most 0 audio" wedges session** (5 comments, OPEN)
   *Need:* A third variant of the media-rejection family (#7015, #7654). Users want **graceful degradation** when a provider rejects media the session already contains. Fix PR [#8215](https://github.com/agentscope-ai/QwenPaw/pull/8215) is open.

3. **[#8320](https://github.com/agentscope-ai/QwenPaw/issues/8320) / [#8315](https://github.com/agentscope-ai/QwenPaw/issues/8315) / [#8288](https://github.com/agentscope-ai/QwenPaw/issues/8288)** — Desktop skill validator, Feishu proxy 426, and v2.2.2 conversation-switch freeze (3 comments each)
   *Need:* Enterprise/self-hosted environments (Windows, corporate proxies, Feishu) are exposing **environment-specific fragility**, which matters for adoption in regulated orgs.

4. **[#8311](https://github.com/agentscope-ai/QwenPaw/issues/8311) — HarmonyOS mobile plugin host contract** (2 comments, OPEN)
   *Need:* A community maintainer (45k LOC ArkTS app) is asking upstream to **standardize the `window.QwenPaw` contract, data-plane bridge, and signing/gating** so local plugin hosts can align with upstream. This is a strong ecosystem-health signal.

**Underlying theme:** the community is pulling QwenPaw toward **extensibility (plugins/themes/contracts)** while simultaneously **hardening it for real deployments (proxies, mobile, desktop packaging)**.

---

## 5. Bugs & Stability

Ranked by severity:

| Severity | Issue | Description | Fix PR? |
|---|---|---|---|
| 🔴 High | [#8335](https://github.com/agentscope-ai/QwenPaw/issues/8335) | WeChat session permanently wedged by 48MB request body (`length limit exceeded`); media accumulates with no per-request bound. | Related: [#8034](https://github.com/agentscope-ai/QwenPaw/pull/8034) (open, per-request media bound) |
| 🔴 High | [#8288](https://github.com/agentscope-ai/QwenPaw/issues/8288) | **v2.2.2 regression** — conversation switching does full re-render behind a blocking ready-gate → tens-of-seconds freeze with tables/code. 2.2.1 unaffected. Roll-scroll sibling #8284 fixed by #8339. | Partial |
| 🔴 High | [#8171](https://github.com/agentscope-ai/QwenPaw/issues/8171) | LM Studio "At most 0 audio" rejection permanently wedges session. | ✅ [#8215](https://github.com/agentscope-ai/QwenPaw/pull/8215) (open) |
| 🟠 Med | [#8312](https://github.com/agentscope-ai/QwenPaw/issues/8312) | Context compaction fails (`252565 > 251904`) → task interruption on codemode-flash. | No |
| 🟠 Med | [#8315](https://github.com/agentscope-ai/QwenPaw/issues/8315) | Feishu channel fails with 426 when `HTTP(S)_PROXY` set without `NO_PROXY=feishu.cn`. | No |
| 🟠 Med | [#8320](https://github.com/agentscope-ai/QwenPaw/issues/8320) | Desktop 2.2.2 `make-skill` validator fails: `qwenpaw` module not importable (Windows installer). | No |
| 🟡 Low | [#8329](https://github.com/agentscope-ai/QwenPaw/issues/8329) | Telegram ignores `reply_to_message` — quoted context silently dropped (other channels implement it). | No |
| 🟡 Low | [#8340](https://github.com/agentscope-ai/QwenPaw/issues/8340) | Scheduled-task edit dialog cannot be closed after editing (F5 required). | No |
| 🟡 Low | [#8333](https://github.com/agentscope-ai/QwenPaw/issues/8333) | Sidebar group header overlaps first conversation on hover/select. | No |
| ✅ Fixed | [#8284](https://github.com/agentscope-ai/QwenPaw/issues/8284) | Wheel-scroll snap-back in long conversations. | ✅ [#8339](https://github.com/agentscope-ai/QwenPaw/pull/8339) (merged) |

**Pattern:** the **media-in-history** family (#8171, #8335, #8034) and the **v2.2.x Console regressions** (#8288, #8284) are the two dominant stability clusters. The v2.2.2 render regression is the most concerning since 2.2.1 was clean.

---

## 6. Feature Requests & Roadmap Signals

**Explicit v2.3.0 signals** — the maintainer-authored [#8289](https://github.com/agentscope-ai/QwenPaw/issues/8289) "Making QwenPaw Lighter and More Extensible" confirms a **plugin refactor** is the headline of the next release. Corroborating in-flight PRs:
- [#8187](https://github.com/agentscope-ai/QwenPaw/pull/8187) — channels extracted into isolated plugins (XXXL)
- [#7565](https://github.com/agentscope-ai/QwenPaw/pull/7565) — clean unload + rollback-safe plugin hot reload (XXXL)

**Likely v2.3.0 candidates:**
- **Theme/content extension points** ([#8071](https://github.com/agentscope-ai/QwenPaw/issues/8071)) — aligns directly with the plugin refactor.
- **Standardized mobile/plugin contract** ([#8311](https://github.com/agentscope-ai/QwenPaw/issues/8311)) — HarmonyOS host wants parity with upstream.
- **Realtime voice chat** ([#7785](https://github.com/agentscope-ai/QwenPaw/pull/7785)).
- **Decision-model tool approval** ([#8283](https://github.com/agentscope-ai/QwenPaw/pull/8283)) for security-conscious users.
- **Configurable console basename** ([#8177](https://github.com/agentscope-ai/QwenPaw/issues/8177), closed) — subpath reverse-proxy deployments.

**Lower-priority but persistent:** Firecrawl web search (merged), Matrix credential normalization ([#8304](https://github.com/agentscope-ai/QwenPaw/pull/8304)), structured custom channel config ([#8305](https://github.com/agentscope-ai/QwenPaw/pull/8305)).

---

## 7. User Feedback Summary

**Pain points (dissatisfaction):**
- **Regressions in v2.2.2 vs 2.2.1** — users explicitly note "2.2.1 unaffected" (#8288), eroding upgrade confidence.
- **Permanently wedged sessions** — a recurring theme across audio (#8171), media-in-history (#8335). Users experience unrecoverable states, not just errors.
- **Environment friction** — corporate Windows installs (#8320), proxied Feishu (#8315), reverse-proxy subpaths (#8177). Self-hosters are a key cohort and are hitting real deployment walls.
- **Chinese-language bug reports** (#8312, #8340) indicate a strong CN user base; localized docs/UX may lag.

**Use cases visible in reports:** WeChat/Feishu/Telegram channel integrations, HarmonyOS mobile app (community-built, 45k LOC), desktop skill authoring (`make-skill`), scheduled tasks, subagent conversations.

**Satisfaction signals:** Deep engagement from power users building on top of QwenPaw (HarmonyOS app, Firecrawl contribution, theme-plugin requests) shows the platform is **growing an ecosystem**, which is a positive health indicator.

---

## 8. Backlog Watch

Items needing maintainer attention — long-open, high-impact, or under-reviewed:

1. **[#7565](https://github.com/agentscope-ai/QwenPaw/pull/7565) — Plugin hot reload (XXXL)** — open since **2026-09-04** (~46 days). Foundational to the v2.3.0 refactor; long review cycles risk blocking the roadmap.
2. **[#7785](https://github.com/agentscope-ai/QwenPaw/pull/7785) — Realtime voice chat (XXXL)** — open since **2026-09-15** (~35 days), no comments listed. Large surface area may be stalling.
3. **[#8034](https://github.com/agentscope-ai/QwenPaw/pull/8034) — Bound inline media per request** — open since **2026-09-29**, directly mitigates the wedge-session family (#8335, #8171). Marked "Under Review" but not merged; high leverage.
4. **[#8124](https://github.com/agentscope-ai/QwenPaw/pull/8124) — Route content-inspection errors to fallback** — open since **2026-10-08**, blocks multi-model fallback for Ali-compatible gateways. Small (XS) but unresolved.
5. **[#8071](https://github.com/agentscope-ai/QwenPaw/issues/8071) — Theme extension point** — 5 comments but no linked PR; ecosystem request that may need a design decision before the v2.3.0 plugin API freezes.
6. **[#8311](https://github.com/agentscope-ai/QwenPaw/issues/8311) — HarmonyOS plugin host contract** — external maintainer with a substantial codebase requesting upstream standardization; silence risks fragmentation.

**Recommendation:** prioritize merging #8034 (media bound) and #8215 (audio fallback) to close the wedge-session class, and assign reviewers to #7565/#7785 to unblock the v2.3.0 plugin refactor timeline.

---

*Digest generated from GitHub activity on 2026-10-20. Open/active issue ratio: 12/15; PR merge rate today: 13/37 (~35%).*

</details>

<details>
<summary><strong>ZeroClaw</strong> — <a href="https://github.com/zeroclaw-labs/zeroclaw">zeroclaw-labs/zeroclaw</a></summary>

# ZeroClaw Project Digest — 2026-10-20

## 1. Today's Overview

ZeroClaw is in an intense pre-release hardening cycle for **v0.8.7**, with 42 active issues and 50 PRs touched in the last 24 hours and **zero issues closed** — a signal that triage is currently accumulating work faster than it is resolving it. Activity is heavily weighted toward the **plugin/WASM subsystem, gateway ingress, and release engineering (CI, binary size, macOS runner brownout)**, all tagged `release:v0.8.7`. No new releases shipped today. The absence of merged issue closures alongside 7 merged/closed PRs suggests fixes are landing but not yet being linked back to their tracking issues, or that several are restacks of a stacked PR chain (e.g., #11318 → #11319 → #11320 → #11322). Overall health is **stable but strained**: high-severity (p0/p1) bugs remain open, and the plugin architecture refactor is mid-flight with multiple `do-not-merge`/`needs-author-action` markers.

---

## 2. Releases

**None.** No new releases in the last 24 hours, and no prior release artifacts are listed in the provided data. Release engineering activity is nonetheless significant (see Backlog Watch), with multiple `release:v0.8.7` blockers in progress.

---

## 3. Project Progress

7 PRs were merged/closed in the last 24h (individual titles not included in the dataset), but the visible open PR set shows clear forward motion on several fronts:

- **Plugin webhook ingress chain** — A stacked series is advancing: [#11318](https://github.com/zeroclaw-labs/zeroclaw/pull/11318) (CI coverage for plugin webhook ingress), [#11319](https://github.com/zeroclaw-labs/zeroclaw/pull/11319) (move admission/dedup into a core ingress), [#11320](https://github.com/zeroclaw-labs/zeroclaw/pull/11320) (dispatch over core RPC), and [#11322](https://github.com/zeroclaw-labs/zeroclaw/pull/11322) (forward webhooks to core over RPC). This is the largest architectural workstream currently open.
- **Memory correctness** — [#11893](https://github.com/zeroclaw-labs/zeroclaw/pull/11893) adds configurable embedding prefixes for recall queries (fixes poor ranking with Qwen3/E5/BGE instruction-tuned embedders). [#10007](https://github.com/zeroclaw-labs/zeroclaw/pull/10007) continues the preference-provenance fix but is marked `do-not-merge` / `status:blocked`.
- **Agent loop stability** — [#11778](https://github.com/zeroclaw-labs/zeroclaw/pull/11778) raises the ping-pong loop-detector threshold from 4 to 8 cycles (fixing premature aborts of multi-tool workflows), and [#11868](https://github.com/zeroclaw-labs/zeroclaw/pull/11868) refuses exact-repeat calls before dispatch.
- **Provider/multimodal fixes** — [#11875](https://github.com/zeroclaw-labs/zeroclaw/pull/11875) addresses phantom image re-sends, and [#11383](https://github.com/zeroclaw-labs/zeroclaw/pull/11383) wires MiniMax M3 image/video inputs.
- **CI/release** — [#11833](https://github.com/zeroclaw-labs/zeroclaw/pull/11833) bounds arm64 Docker build memory, and [#11634](https://github.com/zeroclaw-labs/zeroclaw/pull/11634) bumps routine Rust toolchains to 1.99.x.
- **MCP resilience** — [#11872](https://github.com/zeroclaw-labs/zeroclaw/pull/11872) replays tool calls rejected for stale HTTP sessions.
- **New surface area** — [#11076](https://github.com/zeroclaw-labs/zeroclaw/pull/11076) adds an `agy_cli` tool for Antigravity CLI, and [#11879](https://github.com/zeroclaw-labs/zeroclaw/pull/11879) introduces dormant Goal Mode config/command grammar (proposal 2/12).

---

## 4. Community Hot Topics

Ranked by comment count:

1. **[#11055 — Standalone channel start SOP turns lack live channel tool handles](https://github.com/zeroclaw-labs/zeroclaw/issues/11055)** (8 comments, p1, `risk:high`) — The most-discussed issue today. Channel-addressed tools are unusable outside two daemon entry points because the runtime's injected channel factory isn't wired into standalone SOP starts. **Underlying need:** architectural consistency in how channel tools are registered across all agent-loop entry points.
2. **[#11296 — llama.cpp and custom provider use wrong url/uri for models](https://github.com/zeroclaw-labs/zeroclaw/issues/11296)** (6 comments, p2, `risk:high`) — Non-localhost URIs are ignored when fetching models from a router. **Underlying need:** correct multi-endpoint/provider routing, especially for self-hosted inference behind proxies.
3. **[#6998 — Schema-validated memory consolidation with bounded fallback](https://github.com/zeroclaw-labs/zeroclaw/issues/6998)** (6 comments, p2, `status:parking-lot`) — Long-running enhancement (opened May 2026) to replace fragile prompt-JSON parsing with schema validation. **Underlying need:** cross-provider reliability of memory writes.
4. **[#10999 — Publish and prove Discord plugin installation from a release binary](https://github.com/zeroclaw-labs/zeroclaw/issues/10999)** (5 comments, `status:blocked`) — Remaining product gate for the WASM Discord plugin. **Underlying need:** end-to-end proof that the plugin registry story actually works for operators.
5. **[#10066 — SOP engine promotes later steps before recording output-schema rejection](https://github.com/zeroclaw-labs/zeroclaw/issues/10066)** (5 comments, **p0**, `risk:high`) — A p0 workflow-blocking bug where invalid step output is recorded *after* downstream steps already executed. **Underlying need:** correct, fail-fast SOP orchestration semantics.
6. **[#11416 — Slack "is thinking…" status no longer shown since v0.8.5](https://github.com/zeroclaw-labs/zeroclaw/issues/11416)** (5 comments, `status:in-progress`) — A UX regression in Slack channel threads. **Underlying need:** perceived responsiveness/liveness in chat channels.
7. **[#11554 — Earlier path-marker images re-sent on every later turn](https://github.com/zeroclaw-labs/zeroclaw/issues/11554)** (5 comments, p1) — Phantom "new" images confuse the model. Fix PR exists: [#11875](https://github.com/zeroclaw-labs/zeroclaw/pull/11875).

**Analysis:** The community's dominant concerns are (a) **plugin/channel tool wiring correctness**, (b) **provider transport fidelity** (llama.cpp/custom URIs, image markers), and (c) **memory consolidation robustness**. All three clusters have active fixes in flight.

---

## 5. Bugs & Stability

Ranked by severity (p0 → p3), noting fix-PR availability:

| Severity | Issue | Area | Fix PR? |
|---|---|---|---|
| **p0** | [#10066 — SOP engine promotes later steps before recording output-schema rejection](https://github.com/zeroclaw-labs/zeroclaw/issues/10066) | runtime/daemon SOP | ❌ None visible |
| **p1** | [#11055 — Standalone channel start SOP turns lack live channel tool handles](https://github.com/zeroclaw-labs/zeroclaw/issues/11055) | channel/runtime wiring | ❌ None visible |
| **p1** | [#11554 — Path-marker images re-sent every turn (phantom images)](https://github.com/zeroclaw-labs/zeroclaw/issues/11554) | provider/multimodal | ✅ [#11875](https://github.com/zeroclaw-labs/zeroclaw/pull/11875) |
| **p1** | [#11552 — Tool egress ceremony ignores websocket_client/socket_client](https://github.com/zeroclaw-labs/zeroclaw/issues/11552) | plugins/security | ❌ None visible |
| **p1** | [#11327 — Plugin tool name gate can pre-empt tool_search/MCP/peripheral/skill tools](https://github.com/zeroclaw-labs/zeroclaw/issues/11327) | plugins (treat as S0 if untrusted plugins) | ❌ None visible |
| **p1** | [#10807 — MCP connection permanently poisoned by one failed recovery](https://github.com/zeroclaw-labs/zeroclaw/issues/10807) | tools/MCP | ✅ [#11872](https://github.com/zeroclaw-labs/zeroclaw/pull/11872) (partial) |
| **p1** | [#11580 — x86_64 Linux binary only 0.7 MB under 64 MiB cap](https://github.com/zeroclaw-labs/zeroclaw/issues/11580) | release gate | ⚠️ policy decision needed |
| **p1** | [#11813 — Plugin egress stalls on blackholed first address](https://github.com/zeroclaw-labs/zeroclaw/issues/11813) | plugins/WASM egress | ❌ None visible |
| **p2** | [#11296 — llama.cpp/custom provider wrong URI](https://github.com/zeroclaw-labs/zeroclaw/issues/11296) | provider | ❌ None visible |
| **p2** | [#11332 — Skill review/creation never runs for channel/webhook/gateway turns](https://github.com/zeroclaw-labs/zeroclaw/issues/11332) | runtime/agent loop | ❌ None visible |
| **p2** | [#11336 — `plugin info`/`plugin list --verify` report `[loads]` for unregisterable plugin](https://github.com/zeroclaw-labs/zeroclaw/issues/11336) | plugins/CLI | ❌ None visible |
| **p2** | [#11357 — `plugin remove` deletes wrong directory](https://github.com/zeroclaw-labs/zeroclaw/issues/11357) | plugins (can delete unrelated dirs) | ❌ None visible |
| **p2** | [#11416 — Slack "is thinking…" status gone since v0.8.5](https://github.com/zeroclaw-labs/zeroclaw/issues/11416) | Slack channel | ⏳ `in-progress` |
| **p3** | [#11360 — Package lock file world-readable → install/remove DoS](https://github.com/zeroclaw-labs/zeroclaw/issues/11360) | plugins | ❌ None visible |
| **p3** | [#11818 — `config set agents.*` bare SUN_LEN error for long config dir](https://github.com/zeroclaw-labs/zeroclaw/issues/11818) | CLI/onboarding | ❌ None visible |
| **p3** | [#11819 — Quickstart lists models before URI; picker rejects typed model](https://github.com/zeroclaw-labs/zeroclaw/issues/11819) | onboarding | ❌ None visible |
| **p3** | [#11821 — `plugin_channel_sender_denied` doesn't name sender](https://github.com/zeroclaw-labs/zeroclaw/issues/11821) | plugins/observability | ❌ None visible |

**Stability assessment:** The plugin subsystem dominates the bug list and carries several `risk:high` security-adjacent findings (egress ceremony gaps, tool name pre-emption, directory deletion). The p0 SOP issue (#10066) is the single most urgent correctness defect. Only three of the seventeen listed bugs have visible fix PRs, which is a concerning fix-to-report ratio heading into v0.8.7.

---

## 6. Feature Requests & Roadmap Signals

Active enhancements and their likely v0.8.7+ trajectory:

- **[#6998 — Schema-validated memory consolidation](https://github.com/zeroclaw-labs/zeroclaw/issues/6998)** (`parking-lot`, p2) — High-value reliability work; unlikely to land in v0.8.7 given parking-lot status.
- **[#11657 — Configurable target category for turn consolidation](https://github.com/zeroclaw-labs/zeroclaw/issues/11657)** — Complements memory work; no release tag.
- **[#10426 — Show user-facing agent progress in Telegram](https://github.com/zeroclaw-labs/zeroclaw/issues/10426)** (`parking-lot`) — Directly mirrors the Slack "is thinking…" regression (#11416), suggesting a **cross-channel progress-indicator theme** worth a unified design.
- **[#8415 — Telegram Bot API 10.1 Rich Messages](https://github.com/zeroclaw-labs/zeroclaw/issues/8415)** (`icebox`, 1 👍) — Long-term UX; low near-term probability.
- **[#10168 — Enable stall watchdog by default](https://github.com/zeroclaw-labs/zeroclaw/issues/10168)** — Small, conservative default change; plausible v0.8.7 candidate given release-gate focus on loop stability (see PRs #11778, #11868).
- **[#10997 — Install/activate selected plugins during onboarding](https://github.com/zeroclaw-labs/zeroclaw/issues/10997)** and **[#10998 — Minimal core tool set + binary-size evidence](https://github.com/zeroclaw-labs/zeroclaw/issues/10998)** — Both `release:v0.8.7` / `status:blocked`; part of the plugin-phase roadmap (#7432 R4/R5).
- **[#11870 — Per-user pairing sessions for browser login & outage-safe KB delegation](https://github.com/zeroclaw-labs/zeroclaw/issues/11870)** — Fresh RFC (opened 2026-10-19) on gateway auth/KB access; early discussion.

**Prediction for v0.8.7:** plugin registry install/onboarding (#10997), minimal core tool set (#10998), Discord plugin documentation/acceptance (#10999), and stall-watchdog default (#10168) are the most likely to make the cut given their release tags and active PRs. Goal Mode (#11879) and memory-consolidation schema work are more likely v0.9.x.

---

## 7. User Feedback Summary

**Pain points (dissatisfaction):**
- **Silent channels / lost liveness indicators** — Both Slack (#11416) and Telegram (#10426) users report not seeing agent progress, making long-running work feel stalled. This is a recurring UX theme.
- **Phantom multimodal content** — Users on Signal/Telegram/Discord see the model hallucinate "new" images because history markers are re-sent (#11554), eroding trust in vision handling.
- **Provider configuration friction** — Self-hosted llama.cpp/custom provider users cannot get correct model listings (#11296), and Quickstart's ordering/picker problems (#11819) make onboarding confusing.
- **Plugin trust and safety** — Multiple reports describe plugins that pass CLI checks but behave differently at runtime (#11336), can delete unrelated directories (#11357), or pre-empt other tools (#11327). Operators clearly want **predictable, verifiable plugin behavior**.
- **Egress/network fragility** — Plugins stall on blackholed addresses (#11813) and MCP connections are poisoned by single failed recoveries (#10807).

**Use cases observed:** self-hosted/self-proxied inference, multi-channel deployments (Slack/Telegram/Discord/Signal/Matrix), SOP-driven workflows, WASM plugin distribution, and enterprise-adjacent gateway auth (#11870 mentions IdP outages and CRM background tokens).

**Satisfaction signals:** Users are filing precise, reproduction-heavy reports with version tags (e.g., "since v0.8.5"), indicating an engaged, technically sophisticated user base. The single 👍 on #8415 suggests reactions are used sparingly, so comment volume is the better engagement proxy.

---

## 8. Backlog Watch

Items needing maintainer attention:

1. **[#10066 — p0 SOP output-schema rejection ordering](https://github.com/zeroclaw-labs/zeroclaw/issues/10066)** — Open since **2026-08-17** (2 months), p0, workflow-blocking, **no fix PR**. Highest-priority unaddressed defect.
2. **[#6998 — Schema-validated memory consolidation](https://github.com/zeroclaw-labs/zeroclaw/issues/6998)** — Open since **2026-05-29** (~5 months), `parking-lot`. Foundational memory reliability work drifting.
3. **[#10007 — Honor preference subtype only for user-authored turns](https://github.com/zeroclaw-labs/zeroclaw/pull/10007)** — Open PR since **2026-08-15**, tagged `do-not-merge` + `status:blocked` + `needs-author-action`. A security-relevant memory-provenance fix stalled.
4. **[#8415 — Telegram Rich Messages](https://github.com/zeroclaw-labs/zeroclaw/issues/8415)** — Open since **2026-06-28**, `icebox`. Long-tail UX.
5. **[#10997](https://github.com/zeroclaw-labs/zeroclaw/issues/10997) / [#10998](https://github.com/zeroclaw-labs/zeroclaw/issues/10998) / [#10999](https://github.com/zeroclaw-labs/zeroclaw/issues/10999)** — All `status:blocked`, all `release:v0.8.7`. These are **release gates**; their blocked state is the primary risk to the v0.8.7 schedule.
6. **[#11319](https://github.com/zeroclaw-labs/zeroc

</details>