# OpenClaw Ecosystem Digest 2026-11-04

> Issues: 402 | PRs: 500 | Projects covered: 5 | Generated: 2026-11-04 01:13 UTC

- [OpenClaw](https://github.com/openclaw/openclaw)
- [Hermes Agent](https://github.com/nousresearch/hermes-agent)
- [IronClaw](https://github.com/nearai/ironclaw)
- [QwenPaw](https://github.com/agentscope-ai/QwenPaw)
- [ZeroClaw](https://github.com/zeroclaw-labs/zeroclaw)

---

## OpenClaw Deep Dive

# OpenClaw Project Digest — 2026-11-04

## 1. Today's Overview

OpenClaw remains in a high-velocity maintenance phase: **402 issues** and **500 PRs** were touched in the last 24 hours, with a near-even split between resolution and new activity (169 issues closed / 233 active; 169 PRs merged or closed / 331 open). A single release, **v2026.10.10**, shipped on top of an accumulated 4,825 commits and 3,028 PRs from 454 contributors, though the supplied release notes are truncated. The issue tracker is dominated by **session-state, crash-loop, and auth-provider** problems, many of which are stale or awaiting product decisions rather than active engineering. Overall health reads as **stable but strained**: high throughput, but a visible backlog of P0/P1 crash-loop and message-loss bugs that have not converged on fixes.

## 2. Releases

**v2026.10.10** — `openclaw 2026.10.10`
- Release notes and changelog are referenced but **truncated in the provided data**; no specific changes, breaking changes, or migration notes can be confirmed from the excerpt.
- Aggregate scale: 4,825 commits · 3,028 PRs · 454 contributors.
- No breaking-change or migration guidance is available in the source data — treat version details as **unverified** until the full release page is reviewed.

## 3. Project Progress

Closed/merged activity today skews toward **channel-scoped reliability fixes and test/CI hygiene**, with several long-lived P1s finally resolved:

- **[CLOSED] #175027** — Android realtime Talk reused archived sessions and rejected GPT-Live consults (P1, session-state). [Link](https://github.com/openclaw/openclaw/issues/175027)
- **[CLOSED] #172628** — Fresh gateway start left main-agent admission superseded until restart (P1). [Link](https://github.com/openclaw/openclaw/issues/172628)
- **[CLOSED] #148308** — Gateway silently lost Tailscale Serve claim after `tailscaled` restart (P1). [Link](https://github.com/openclaw/openclaw/issues/148308)
- **[CLOSED] #169536** — Telegram now releases account throttlers for retired bot tokens (PR merged). [Link](https://github.com/openclaw/openclaw/pull/169536)
- **[CLOSED] #171549** — Database avoids writer stalls during initial host admission. [Link](https://github.com/openclaw/openclaw/pull/171549)
- **[CLOSED] #187156** — Transcript auto-start shutdown now respects its stop budget across wall-clock steps. [Link](https://github.com/openclaw/openclaw/pull/187156)
- **[CLOSED] #188108** — MS Teams message search now handles Unicode normalization differences. [Link](https://github.com/openclaw/openclaw/pull/188108)

Open PRs advancing features include **#191138** (session-share catalog filtering by request relationship) and **#188294** (memory search excludes generated files). [PR #191138](https://github.com/openclaw/openclaw/pull/191138) · [PR #188294](https://github.com/openclaw/openclaw/pull/188294)

## 4. Community Hot Topics

Most-commented threads reveal a community focused on **reliability under real deployment conditions**:

1. **[#159356 (30 comments, CLOSED)](https://github.com/openclaw/openclaw/issues/159356)** — `llama.cpp` manager reported "ready" while the embedding child exited; HTTP 500 on embedding requests. Resolution attributed to host RAM pressure (4 GB → 8 GB). Signals demand for better child-process health signaling.
2. **[#178359 (24 comments, OPEN, P1)](https://github.com/openclaw/openclaw/issues/178359)** — `doctor --fix --non-interactive` idles 15+ minutes with no output on macOS. Users need diagnosable, progressing repair flows.
3. **[#166634 (22 comments, OPEN, P0)](https://github.com/openclaw/openclaw/issues/166634)** — Late reclamation checkpoint failure makes an agent permanently unavailable (`UNAVAILABLE` on `chat.history`, `models.list`, etc.) after crash recovery. This is the highest-severity active thread.
4. **[#67419 (15 comments, 2 👍, CLOSED)](https://github.com/openclaw/openclaw/issues/67419)** — Bootstrap files (`MEMORY.md`, `SOUL.md`, etc.) re-injected every turn, wasting 20–30% of context tokens. A recurring cost/efficiency complaint.
5. **[#151962 (14 comments, OPEN)](https://github.com/openclaw/openclaw/issues/151962)** — "Phantom user messages": internal runtime strings surfacing as user prompts on long-lived sessions. Trust-eroding for chat-bridge users.

**Underlying needs:** deterministic recovery from crashes, transparent progress in CLI tooling, and token/cost efficiency.

## 5. Bugs & Stability

Ranked by severity (P0 → P3), noting fix-PR status:

**P0 / Crash-Loop / Message-Loss**
- **[#166634](https://github.com/openclaw/openclaw/issues/166634)** — Agent permanently unavailable after crash-recovery checkpoint failure. *No fix PR; needs repro.*
- **[#169844](https://github.com/openclaw/openclaw/issues/169844)** — Windows Control UI update hangs at "Activating"; Scheduled Task left disabled and gateway stopped. *No fix PR.*
- **[#146791](https://github.com/openclaw/openclaw/issues/146791)** — App Store iOS client never publishes APNs relay registration; push/wake broken. *No fix PR.*

**P1**
- **[#178359](https://github.com/openclaw/openclaw/issues/178359)** — `doctor --fix` hangs 15+ min. *No fix PR.*
- **[#167557](https://github.com/openclaw/openclaw/issues/167557)** — Deferred plugin migration never converges; "managed handoff lease database identity changed". *No fix PR.*
- **[#144336](https://github.com/openclaw/openclaw/issues/144336)** — Deferred config-reload restart (SIGUSR1) fails shutdown step. *No fix PR.*
- **[#126950](https://github.com/openclaw/openclaw/issues/126950)** — Telegram opaque `tgcb1:` callback payloads silently dropped for non-plugin callers. *Linked PR open.*
- **[#158421](https://github.com/openclaw/openclaw/issues/158421)** — Default model `@profile` resolved as explicit user pin, blocking cross-provider fallback. *No fix PR.*
- **[#133296](https://github.com/openclaw/openclaw/issues/133296)** — Secrets apply routes shared auth-profile refs to the agent store. *Needs security review.*

**P2 / Regressions**
- **[#187917](https://github.com/openclaw/openclaw/issues/187917)** — Update failure: `updater-runtime-retention` on Linux/arm64 (2026.10.8).
- **[#154104](https://github.com/openclaw/openclaw/issues/154104)** — Idle gateway with 4 Matrix E2EE accounts: ~50% CPU, ~52 MB/min writes.
- **[#182891](https://github.com/openclaw/openclaw/issues/182891)** — Prompt cache never reused (`cache read dropped N -> 0`) on every request.
- **[#191944 (new today)](https://github.com/openclaw/openclaw/issues/191944)** — `gateway stop` / `stop --force` both fail on macOS with "Process ancestry could not be fully inspected".
- **[#162585](https://github.com/openclaw/openclaw/issues/162585)** — Windows plugin source-capture staging re-materializes self; npm trees explode (290 MB → 612 MB).

**New fix PRs opened today** (unverified proof status): [#192439](https://github.com/openclaw/openclaw/pull/192439) (Incognito chat admission), [#192422](https://github.com/openclaw/openclaw/pull/192422) (browser relay TTL), [#192093](https://github.com/openclaw/openclaw/pull/192093) (iMessage fail-closed), [#192035](https://github.com/openclaw/openclaw/pull/192035) (Tailscale sudo recovery), [#192053](https://github.com/openclaw/openclaw/pull/192053) (Signal monitor teardown).

**Stability read:** several P0/P1 crash-loop issues remain **without fix PRs**, indicating a meaningful stability gap despite high daily throughput.

## 6. Feature Requests & Roadmap Signals

Active feature threads, with likelihood-of-near-term-landing estimates based on linked PRs and stage:

| Issue | Request | Signal |
|---|---|---|
| [#155633](https://github.com/openclaw/openclaw/issues/155633) (CLOSED) | Official Databricks Unity Gateway provider | Linked PR #155634 — **enterprise auth demand** |
| [#138990](https://github.com/openclaw/openclaw/issues/138990) | Enforceable checkpoints / bounded yields for foreground WebChat runs | Product-decision pending |
| [#52732](https://github.com/openclaw/openclaw/issues/52732) | Per-agent `compaction` / `contextPruning` overrides | Long-standing (since Mar), diamonds |
| [#164355](https://github.com/openclaw/openclaw/issues/164355) | Plugin hook to append content after tool results | Extension-model gap |
| [#188761](https://github.com/openclaw/openclaw/issues/188761) | Preflight automation compatibility on model change | Fresh, UX-focused |
| [#128090](https://github.com/openclaw/openclaw/issues/128090) (4 👍) | Rendered Markdown preview in Review files | Highest-reaction open feature |
| [#136271](https://github.com/openclaw/openclaw/issues/136271) | msteams dynamic SharePoint site resolution | Linked PR open |

**Prediction:** Session/context management controls (per-agent compaction, checkpointing) and provider expansion (Databricks) are the most likely next-release landings given existing PRs/product-decision tags. Plugin content-injection hooks remain a deeper architectural change.

## 7. User Feedback Summary

**Pain points (dissatisfaction):**
- **Cost/efficiency:** Bootstrap re-injection wastes 20–30% of context tokens ([#67419](https://github.com/openclaw/openclaw/issues/67419)); prompt cache rarely reused ([#182891](https://github.com/openclaw/openclaw/issues/182891)); heartbeat cache misses cost $0.40–0.95/run ([#161208](https://github.com/openclaw/openclaw/issues/161208)).
- **Recovery fragility:** "Health stays green" while execution is wedged ([#159789](https://github.com/openclaw/openclaw/issues/159789), [#166634](https://github.com/openclaw/openclaw/issues/166634)).
- **Silent failures:** active-memory stopped recalling after upgrade with no info-level signal ([#138561](https://github.com/openclaw/openclaw/issues/138561)); phantom user prompts ([#151962](https://github.com/openclaw/openclaw/issues/151962)).
- **Resource leaks:** 19 GB orphaned reindex temp DBs ([#136311](https://github.com/openclaw/openclaw/issues/136311)); matrix E2EE idle CPU/write load ([#154104](https://github.com/openclaw/openclaw/issues/154104)).

**Satisfaction signals:** Hundreds of contributors and rapid turnaround on channel-scoped fixes; several long-running P1s closed today (Tailscale, Telegram throttlers, admission supersession). Users are clearly running **production, multi-channel, multi-agent fleets** (WeChat bridges, Matrix E2EE, MS Teams, Telegram, iMessage), which raises the bar for reliability and observability.

## 8. Backlog Watch

Important items lacking maintainer convergence:

- **[#166634 (P0, 22 comments)](https://github.com/openclaw/openclaw/issues/166634)** — P0 agent-unavailable-after-crash; tagged `not-repro-on-main` but no fix. **Highest priority for maintainer attention.**
- **[#136311 (P2, 13 comments, since Sep 2)](https://github.com/openclaw/openclaw/issues/136311)** — Reindex lock reacquisition making index unrepairable + 19 GB temp DB accumulation. Long-standing.
- **[#137613 (P2, 12 comments, since Sep 3)](https://github.com/openclaw/openclaw/issues/137613)** — Pre-compaction memory flush disabled on CLI backends; fix hits `compactionCount` trap. Needs product decision.
- **[#52732 (since Mar 23, 8 comments)](https://github.com/openclaw/openclaw/issues/52732)** — Per-agent compaction overrides. Oldest significant feature gap listed.
- **[#133296 (P1 security, since Aug 30)](https://github.com/openclaw/openclaw/issues/133296)** — Secrets routing to agent store; `needs-security-review` and unfixed.
- **[#134918 (since Sep 1)](https://github.com/openclaw/openclaw/issues/134918)** — Incomplete/empty turns without consuming retry budget; has local patches but unresolved upstream.

**Backlog risk:** A cluster of P1 session-state/auth bugs older than 60 days with `clawsweeper:no-new-fix-pr` suggests maintainer review and product-decision bandwidth — not reporter effort — is the bottleneck.

---

## Cross-Ecosystem Comparison

# Cross-Project Comparison Report — Personal AI Assistant / Agent Open-Source Ecosystem
**Snapshot Date:** 2026-11-04
**Projects Analyzed:** OpenClaw, Hermes Agent, IronClaw, QwenPaw, ZeroClaw

---

## 1. Ecosystem Overview

The personal AI assistant / agent open-source landscape is bifurcating into two distinct maturity tiers: **high-throughput platforms** (OpenClaw, Hermes Agent, ZeroClaw, QwenPaw) operating at hundreds of monthly PRs and multi-channel production deployments, and **idle/maintenance-phase repositories** (IronClaw) with negligible activity. Across the active projects, a convergent architectural pattern is emerging — a gateway/runtime core, plugin ecosystems, multi-channel adapters (Telegram, Matrix, Feishu, WhatsApp, MS Teams), and memory/context-management subsystems — with differentiation concentrated in target-user orientation (developer platforms vs. consumer desktop assistants) and channel breadth. The dominant engineering theme in this snapshot is **reliability hardening around release gates**: silent fallbacks, session-state corruption, credential resolution, and update-pipeline safety are the shared pain points, not model capability. Community feedback increasingly reflects users running **production multi-agent fleets**, which has raised the bar for observability, crash recovery, and cost transparency well beyond early 2026 norms.

---

## 2. Activity Comparison

| Project | Issues (24h) | PRs (24h) | Release Status | Health Score | Notes |
|---|---|---|---|---|---|
| **OpenClaw** | 402 touched (169 closed / 233 active) | 500 touched (169 merged/closed / 331 open) | v2026.10.10 shipped (notes truncated) | **7.5/10** — Stable but strained | Highest throughput; P0/P1 crash-loops without fix PRs |
| **Hermes Agent** | 50 (7 closed / 43 open) | 50 (4 merged / 46 open) | v0.22.7 patch (rolls up ~174 PRs) | **7.0/10** — High-velocity stabilization | In-flight queue heavy; updater data-loss risk |
| **ZeroClaw** | 18 (3 closed / 15 open) | 50 (10 merged / 40 open) | None (v0.9.0 gated, blockers open) | **7.5/10** — Moderate-strong | Active security/identity work; CI broken on source builds |
| **QwenPaw** | 19 (some closed) | 36 (9 closed / 27 open) | None (2.3.0 in beta.3) | **6.5/10** — Healthy but strained | Beta surfacing real regressions; review bottleneck |
| **IronClaw** | 0 | 1 (open, Dependabot) | None | **8.5/10** — Stable but idle | No community friction; bandwidth concern if sustained |

**Health scoring rubric:** weighted composite of release cadence, open-fix-PR coverage for P0/P1 items, contributor responsiveness (issues → PR latency), and ratio of merged-to-open work. IronClaw scores high on stability but low on velocity; OpenClaw scores high on velocity but low on P0 convergence.

---

## 3. OpenClaw's Position

**Advantages vs peers:**
- **Scale dominance:** 402 issues + 500 PRs in 24h is roughly **8–10× the throughput** of Hermes, ZeroClaw, and QwenPaw, and infinitely above IronClaw. 454 contributors and 4,825 commits represent the largest community in this cohort by a wide margin.
- **Channel breadth:** Users are running WeChat bridges, Matrix E2EE, MS Teams, Telegram, iMessage, and Tailscale-bridged gateways simultaneously — the widest adapter surface in the ecosystem.
- **Mature maintenance machinery:** The presence of `clawsweeper:no-new-fix-pr` labels, `doctor --fix` tooling, and structured release notes indicates production-grade ops tooling competitors lack.

**Weaknesses vs peers:**
- **P0/P1 convergence gap:** #166634 (agent permanently unavailable after crash recovery) has 22 comments and **no fix PR**; comparable P0/P1 items in Hermes and ZeroClaw have demonstrated faster turnaround on well-scoped bugs.
- **Review-bandwidth bottleneck:** A cluster of P1 session-state/auth bugs older than 60 days with no fix PR suggests maintainer decision capacity — not reporter effort — is the constraint.

**Technical approach differences:**
- OpenClaw leans toward a **monolithic gateway + plugin migration model** (deferred plugin migration, managed handoff leases) whereas ZeroClaw has adopted an explicit **release-gate discipline** (v0.9.0 blockers tracked as P1 issues) and Hermes is experimenting with **Portal-routed federated messaging**.
- OpenClaw's context-management complaints (bootstrap re-injection wasting 20–30% of tokens, prompt cache never reused) position it as a **cost-optimization laggard** relative to Hermes' headroom-ai compression proposal and ZeroClaw's Qdrant hybrid recall work.

**Community size:** OpenClaw's contributor base (454) dwarfs Hermes and ZeroClaw (order-of-magnitude smaller based on activity ratios), placing it in a tier of its own — but at the cost of slower per-issue convergence and a visible backlog of product-decision-blocked items.

---

## 4. Shared Technical Focus Areas

The following needs emerge **across three or more projects**, indicating ecosystem-wide requirements:

| Shared Focus | Projects | Specific Need |
|---|---|---|
| **Silent failure / observability gaps** | OpenClaw, Hermes, ZeroClaw, QwenPaw | Runtime quietly substitutes defaults (32k context, missing tools, dropped messages) with no warning. ZeroClaw's #12014/#12194/#12203 cluster is the clearest statement; OpenClaw's #151962 "phantom prompts" and #138561 memory stopping silently mirror it. |
| **Update-pipeline safety / data integrity** | Hermes, OpenClaw, QwenPaw | Hermes #147938 (stale `state.db` overwriting healthy data) is the standout; OpenClaw #187917 (updater retention failure on arm64) and QwenPaw's desktop packaging regressions share the root theme: **updates are the weakest link**. |
| **Session-state / crash-recovery correctness** | OpenClaw, Hermes, ZeroClaw | OpenClaw #166634 (agent UNAVAILABLE after crash), Hermes #137555 (gateway lease deadlock without watchdog), ZeroClaw #11126 (queued session ownership bypass — now fixed). |
| **Credential / provider resolution ambiguity** | Hermes, OpenClaw, ZeroClaw | Hermes #144523/#145614 ("custom provider resolved without credentials"), OpenClaw #158421 (default `@profile` blocking fallback), ZeroClaw #12014 (custom provider assuming 32k). |
| **Context/token cost efficiency** | OpenClaw, Hermes, QwenPaw | OpenClaw #67419 (bootstrap re-injection), Hermes #39691 (tool-output compression, 👍17), QwenPaw #8034 (inline media bounding). |
| **Windows / non-English locale robustness** | QwenPaw, Hermes, OpenClaw | QwenPaw's CRLF/GBK/Chinese-path cluster; Hermes Windows `gateway.lock` truncation and state.db restore; OpenClaw Windows plugin staging blowup. |
| **Multi-agent / cross-gateway collaboration** | Hermes, ZeroClaw, OpenClaw | Hermes #97681 (40 comments, needs-decision), ZeroClaw #7759 (WebSocket/turn decoupling), OpenClaw session-share catalog filtering (#191138). |

**Key insight:** The ecosystem has shifted from "can the agent do X?" to **"does the agent fail safely and visibly when X goes wrong?"** — a maturity inflection that favors projects investing in observability and deterministic recovery.

---

## 5. Differentiation Analysis

| Dimension | OpenClaw | Hermes Agent | ZeroClaw | QwenPaw | IronClaw |
|---|---|---|---|---|---|
| **Primary user** | Power-user fleets / multi-channel ops | Desktop + developer hybrid | Self-hosters / security-conscious ops | Windows / Chinese-locale desktop users | Internal docs/architecture tooling |
| **Architecture bias** | Monolithic gateway + deferred plugin migration | Desktop-centric + Portal federation emerging | Rust-based, release-gated, plugin-webhook stack | Tauri desktop + hub runtime | Remotion video pipeline (docs) |
| **Feature focus** | Channel breadth, session sharing, memory search | Desktop UX simplification, audit log, federated messaging | Security/identity-access, plugin registry, approval reactions | SQLite session storage, Matrix E2EE, QQ streaming | Documentation tooling |
| **Notable differentiator** | Largest contributor base | Maintainer-filed audit-log roadmap item (#1155) | Explicit v0.9.0 release-gate discipline | Rapid fix-PR response (24–48h on reported bugs) | Zero community friction (also zero velocity) |
| **Weak spot** | P0 fix-PR latency | Update-pipeline data-loss risk | CI/source-build breakage, silent TOOL_COMPILED_OUT | 2.3.0 beta regressions, review queue | Idle — maintainer bandwidth |

**Feature-focus spectrum:** OpenClaw and ZeroClaw compete on **platform breadth and security**; Hermes and QwenPaw compete on **desktop ergonomics and user-facing UX**; IronClaw sits outside the agent-runtime race entirely, occupying a documentation-tooling niche.

**Architectural divergence worth watching:** ZeroClaw's **release-gate discipline** (tracking P0/P1 blockers before cutting v0.9.0) is the cleanest engineering process in the cohort, but its source-Docker builds are currently broken end-to-end (#12210) — process rigor is not yet matched by pipeline stability.

---

## 6. Community Momentum & Maturity

**Tier 1 — High-velocity, high-complexity (scale leaders):**
- **OpenClaw** — Rapidly iterating at ecosystem-defining scale. Momentum is *strained*: massive throughput but a visible P0 backlog. Maturity high on ops tooling, medium on convergence.

**Tier 2 — Active stabilization (release-cycle projects):**
- **Hermes Agent** — High-velocity, just cut v0.22.7, accumulating fixes for v0.23.0. Rapid iteration with a heavy open-PR queue — classic post-release accumulation.
- **ZeroClaw** — Focused iteration toward v0.9.0 with explicit blockers. Security work is advancing (identity-access fixes landing); CI/source-build reliability is the drag.
- **QwenPaw** — Pre-release hardening for 2.3.0; beta is surfacing real regressions. Contributor response is fast (candidate fix PRs within 24–48h), but **review throughput on large/Windows PRs is the bottleneck**.

**Tier 3 — Idle:**
- **IronClaw** — Zero issues, one Dependabot PR, no merges. Stable but idle; a multi-day zero-merge pattern would signal maintainer bandwidth constraints rather than project decline.

**Rapidly iterating:** OpenClaw, Hermes, ZeroClaw, QwenPaw.
**Stabilizing:** IronClaw.
**Momentum risk:** OpenClaw's P0 convergence gap and QwenPaw's review queue are the two clearest "momentum vs. quality" tension points.

---

## 7. Trend Signals (Value for AI Agent Developers)

1. **Observability is the new feature frontier.** Silent fallbacks (32k defaults, compiled-out tools, dropped messages) recur across four projects. Developers building on these runtimes should assume **defaults are unverified** and instrument explicitly. Runtimes that ship structured warnings (e.g., `TOOL_COMPILED_OUT`) will win trust.
2. **Update pipelines are the most dangerous surface.** Hermes' stale-snapshot restore and OpenClaw's retention failures show that **auto-update is a data-integrity risk, not a convenience**. Expect demand for transactional, verifiable updates with rollback.
3. **Context compression is a first-class cost lever.** Hermes' headroom-ai proposal (👍17, the highest reaction in the dataset) and QwenPaw's media-bounding PR signal that **tool-output compression and per-channel fallback providers** are the next cost-optimization wave, ahead of model routing.
4. **Multi-agent federation is moving from debate to design.** Hermes #97681 (40 comments) and ZeroClaw #7759 (4.5-month parking-lot) both describe federated, owner-sovereign agent collaboration. Expect cross-gateway messaging primitives to become table stakes in 2027.
5. **Windows + non-English locales are underserved.** QwenPaw's CRLF/GBK/Chinese-path cluster and Hermes' Windows-specific update failures reveal that **the majority of these projects are tested on macOS/Linux and break on Windows**. Enterprise adoption will require locale-robust file handling and encoding preservation.
6. **Security boundaries are under active audit.** ZeroClaw's `pairing_dashboard` never-expiring codes (#9394, release-gated), QwenPaw's shell-wrapped outbound action bypass (#8513), and Hermes' `config set` privilege escalation (#59293) all point to **approval-layer and credential-expiry gaps** being the current security frontier.
7. **CI/CD health is a leading indicator of project trajectory.** ZeroClaw's broken source builds (#12210, #12218) and QwenPaw's 5-week-old review-stuck PR (#8034) correlate with maintainer bandwidth, not contributor interest. Developers evaluating ecosystem dependencies should weight **merge throughput on boring-but-important PRs** as heavily as feature velocity.

**Bottom line for decision-makers:** The ecosystem is consolidating around a **gateway + plugin + multi-channel** architecture with reliability, observability, and cost-control as the competitive battlegrounds for 2027. OpenClaw leads on scale, ZeroClaw on process rigor, Hermes on desktop UX and federation direction, and QwenPaw on Windows/locale responsiveness — while IronClaw sits outside the runtime race. The winning posture over the next two quarters will be **deterministic failure modes + transparent recovery + verifiable updates**, not raw capability.

---

## Peer Project Reports

<details>
<summary><strong>Hermes Agent</strong> — <a href="https://github.com/nousresearch/hermes-agent">nousresearch/hermes-agent</a></summary>

# Hermes Agent — Project Digest
**Date:** 2026-11-04
**Repository:** [github.com/NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent)

---

## 1. Today's Overview

Hermes Agent remains in a **high-velocity stabilization phase**: 50 issues and 50 PRs were touched in the last 24 hours, with a fresh patch release (v0.22.7) rolling up ~174 merges since v0.22.6. Activity skews heavily toward **open work** (43 open issues vs. 7 closed; 46 open PRs vs. 4 merged/closed), indicating a large in-flight queue rather than a drain-off — consistent with a project that has just cut a release and is now accumulating fixes for the next cycle. The dominant themes today are **gateway/session reliability**, **Desktop credential resolution**, and **multi-agent collaboration primitives** (cross-gateway bot messaging). A notable cluster of Windows/macOS install-update regressions (state.db restore, gateway.lock truncation, Desktop SIGTRAP on update) suggests the update pipeline is the current weak spot. No breaking changes are signaled in this window.

---

## 2. Releases

### 🏷️ v0.22.7 — Hermes Agent v0.22.7
- **Release Date:** November 3, 2026
- **Type:** Patch release
- **Scope:** Rolls up the **~174 PRs merged since v0.22.6** into a stable release across:
  - GitHub release (CLI and installers)
  - Microsoft Store app
  - Docker
  - Hermes Cloud
- **Breaking changes:** None indicated.
- **Migration notes:** None required — this is a consolidation tag.
- **Forward-looking note:** Full curated release notes for this window are deferred to **v0.23.0**, implying v0.23.0 will carry the documented changelog and likely feature-level communications.

🔗 [Release v0.22.7](https://github.com/NousResearch/hermes-agent/releases)

---

## 3. Project Progress

Only **4 PRs** merged/closed in the last 24h (the digest's top-20 PR sample is entirely open), so the visible "shipped" surface today is limited. From the merged/closed issue side, however, several notable fixes landed:

| Item | Type | Status | Impact |
|---|---|---|---|
| [#140667](https://github.com/NousResearch/hermes-agent/issues/140667) — Desktop `session.control.read` 30s timeout; one slow handler starves all WS RPCs | perf/gateway | **CLOSED** | Fixes session-control unavailability on large sessions (Windows Desktop) |
| [#147036](https://github.com/NousResearch/hermes-agent/issues/147036) — `/api/config/schema` builds schema on event loop, freezing all requests ~3s | perf/cli | **CLOSED** | Removes dashboard/chat WS stall during config schema build |
| [#143414](https://github.com/NousResearch/hermes-agent/issues/143414) — `/new` session rotation drops live reasoning in classic CLI | bug/cli | **CLOSED** | Restores reasoning streaming after session rotation |
| [#136890](https://github.com/NousResearch/hermes-agent/issues/136890) — `mpp-agent` skill verifies payment receipt by issuing another paid request | bug/billing | **CLOSED** | Removes double-charge behavior in a payment skill |
| [#57533](https://github.com/NousResearch/hermes-agent/issues/57533) — `notion\SKILL.md` flagged as trojan (false positive) | bug/skills | **CLOSED** | Windows AV false-positive resolved |

**In-flight feature advancement (open PRs, no merges yet):**
- Simplified Agent sidebar / agent-settings overview in Desktop ([#148153](https://github.com/NousResearch/hermes-agent/pull/148153), [#148247](https://github.com/NousResearch/hermes-agent/pull/148247)) — stacked PRs.
- Team Gateway → Nous Portal messaging redirection in Desktop & Dashboard ([#148685](https://github.com/NousResearch/hermes-agent/pull/148685), [#148684](https://github.com/NousResearch/hermes-agent/pull/148684)).
- Per-channel `fallback_providers` in `channel_overrides` ([#146961](https://github.com/NousResearch/hermes-agent/pull/146961)).
- Bounded/isolated background review ([#124836](https://github.com/NousResearch/hermes-agent/pull/124836)).

---

## 4. Community Hot Topics

Ranked by comment count — these reveal where user anxiety and architectural debate concentrate:

### 🔥 #97681 — Let Bots collaborate across gateways *(40 comments, 👍4)*
[Issue #97681](https://github.com/NousResearch/hermes-agent/issues/97681)
- **Need:** Cross-machine, cross-owner agent collaboration while each owner retains model/tool/memory/credential control. Labeled `needs-decision`, with `sweeper:risk-session-state` and `sweeper:risk-message-delivery`. This is the **most-discussed issue in the window** and signals demand for a federated multi-agent fabric rather than single-owner assistants.

### 🔥 #59293 — `hermes config set` bypasses system-config write protection *(28 comments)*
[Issue #59293](https://github.com/NousResearch/hermes-agent/issues/59293)
- **Need:** Security. An agent with terminal access can disable the approval layer via the CLI "front door" while direct shell writes are correctly flagged. High community concern for a **privilege-escalation path in the approval layer**.

### 🔥 #36755 — systemd timing alignment false positive *(13 comments, 👍3)*
[Issue #36755](https://github.com/NousResearch/hermes-agent/issues/36755)
- **Need:** Correct diagnostics for operators deploying via NixOS/Ansible (system-level units). Permanent startup warnings erode trust in `hermes-gateway` health checks.

### 🔥 #39691 — Integrate headroom-ai for tool output compression *(11 comments, 👍17)*
[Issue #39691](https://github.com/NousResearch/hermes-agent/issues/39691)
- **Need:** Context-window efficiency. Highest 👍 in the window. Current LLM-call-based conversation summarization is seen as expensive/lossy; users want **tool-output-level compression** before it re-enters the conversation.

### #52554 — Desktop: floating "Quote" button on selected text *(11 comments, 👍4)*
[Issue #52554](https://github.com/NousResearch/hermes-agent/issues/52554)
- **Need:** Ergonomic chat referencing — reduce keyboard-only friction for quoting chat output into the composer.

---

## 5. Bugs & Stability

Ranked by severity, with fix-PR presence noted.

### 🔴 P2 — High Severity

| Issue | Description | Fix PR? |
|---|---|---|
| [#95074](https://github.com/NousResearch/hermes-agent/issues/95074) | Bot Mode `message_agent` has two reply paths; recipients bounce through a second DM while sender gets only an acknowledgment | None visible |
| [#121836](https://github.com/NousResearch/hermes-agent/issues/121836) | First message after model switch sent **without memory-context block** (`repair_message_sequence`/`_merge_consecutive_users` bug) | None visible |
| [#122813](https://github.com/NousResearch/hermes-agent/issues/122813) | `gateway_state.json active_agents` not persisted for cron/API-server runs | None visible |
| [#144523](https://github.com/NousResearch/hermes-agent/issues/144523) / [#145614](https://github.com/NousResearch/hermes-agent/issues/145614) | Desktop sessions intermittently fail: **"provider 'custom' resolved without credentials"** (launch key bound without `base_url`); bare `custom` pick fails despite named provider | None visible — recurring family |
| [#137555](https://github.com/NousResearch/hermes-agent/issues/137555) | Worker-thread `ensure_import()` blocks on stdin `input()`, **deadlocking gateway session leases** without tripping watchdog | None visible |
| [#147938](https://github.com/NousResearch/hermes-agent/issues/147938) | **Windows: state.db verify mistakes a live lock for corruption → restores months-stale snapshot over healthy data**, then misreports success | None visible — data-loss risk |
| [#148619](https://github.com/NousResearch/hermes-agent/issues/148619) | Windows: truncated per-profile `gateway.lock` aborts every `hermes update --gateway` | None visible |
| [#148682](https://github.com/NousResearch/hermes-agent/issues/148682) | **Desktop/iOS image attachments dropped**: `image.attach_bytes` staging discards `mime`, submit filter strips image | None visible |
| [#148565](https://github.com/NousResearch/hermes-agent/issues/148565) | MEDIA attachments delivered **twice** when path contains a space (Windows, Feishu + QQ) | None visible |
| [#121024](https://github.com/NousResearch/hermes-agent/issues/121024) | Spilled tool result announced by host path when Docker sandbox doesn't exist yet | None visible |

### 🟠 P3 — Moderate / Regression

| Issue | Description | Fix PR? |
|---|---|---|
| [#129973](https://github.com/NousResearch/hermes-agent/issues/129973) | 0.21.5 POSIX launcher `python3 -I -c` shim breaks Herdr-style terminal agent detection (macOS) | None visible |
| [#126127](https://github.com/NousResearch/hermes-agent/issues/126127) | Kanban worker spawn without `-P` → workspace `hermes_cli/` can shadow the install | None visible |
| [#122827](https://github.com/NousResearch/hermes-agent/issues/122827) | Desktop SSH runtime marker causes `pm doctor` to falsely report managed-Python digest corruption | None visible |
| [#148036](https://github.com/NousResearch/hermes-agent/issues/148036) | Desktop (Linux): `hermes update` while Desktop open → SIGTRAP crash ("GPU process isn't usable") | None visible |
| [#148451](https://github.com/NousResearch/hermes-agent/issues/148451) | Scratch prune never re-runs inside long-lived gateway (once-per-process gate); idle entries pile up | None visible |

**Severity summary:** Two issues stand out for remediation priority — **#147938** (potential destructive auto-restore of user data on Windows) and **#137555** (silent gateway deadlock). The Desktop credential-resolution family (#144523/#145614) is high-frequency and recurring across versions, suggesting a root-cause fix is overdue rather than per-report patches. A PR ([#146697](https://github.com/NousResearch/hermes-agent/pull/146697)) addresses an adjacent `hermes gateway status` mis-advice (`sudo hermes` for user-level installs).

**Fix PRs observed today** (none explicitly linked to the above P2 list, but relevant):
- [#148699](https://github.com/NousResearch/hermes-agent/pull/148699) — tmux desktop notifications
- [#148696](https://github.com/NousResearch/hermes-agent/pull/148696) — config.yaml comment-preservation corruption
- [#148690](https://github.com/NousResearch/hermes-agent/pull/148690) — mobile app chat via remote proxy (403 fix)
- [#144701](https://github.com/NousResearch/hermes-agent/pull/144701) — bounded control reads off serial queue
- [#124836](https://github.com/NousResearch/hermes-agent/pull/124836) — bound background-review replay

---

## 6. Feature Requests & Roadmap Signals

### Likely for v0.23.0 (high momentum, active PRs or maintainer involvement)
- **Simplified Agent mode in Desktop** ([#148153](https://github.com/NousResearch/hermes-agent/pull/148153), [#148247](https://github.com/NousResearch/hermes-agent/pull/148247)) — nested chat sidebar + agent-settings overview.
- **Team Gateway → Nous Portal messaging routing** ([#148685](https://github.com/NousResearch/hermes-agent/pull/148685), [#148684](https://github.com/NousResearch/hermes-agent/pull/148684)) — messaging moves to Portal management.
- **Per-channel fallback providers** ([#146961](https://github.com/NousResearch/hermes-agent/pull/146961)) — cost-aware degradation chains.
- **Agent audit log — full action history** ([#1155](https://github.com/NousResearch/hermes-agent/issues/1155), opened by `teknium1`) — maintainer-authored, spans agent/cli/gateway/tools/cron. Strong roadmap signal.

### In debate (needs-decision, could land in v0.23.x or v0.24)
- **Cross-gateway bot collaboration** ([#97681](https://github.com/NousResearch/hermes-agent/issues/97681)) — federated multi-agent foundation; highest-comment item.
- **Tool-output compression via headroom-ai** ([#39691](https://github.com/NousResearch/hermes-agent/issues/39691)) — highest 👍; significant architectural impact on context handling.
- **Cron delivery retry for transient network failures** ([#13566](https://github.com/NousResearch/hermes-agent/issues/13566)) — reliability primitive for scheduled jobs.

### Smaller feature asks
- Desktop floating **Quote** button ([#52554](https://github.com/NousResearch/hermes-agent/issues/52554)).
- OpenCode ACP command auto-detection for `delegate_task` ([#19493](https://github.com/NousResearch/hermes-agent/issues/19493)).
- Community plugin catalog additions: `brainchain` ([#147755](https://github.com/NousResearch/hermes-agent/pull/147755)), `bot-chat-agent` ([#148688](https://github.com/NousResearch/hermes-agent/pull/148688)), `shortrizz v0.1.0` ([#148687](https://github.com/NousResearch/hermes-agent/pull/148687)), FilmEase OAuth docs ([#148629](https://github.com/NousResearch/hermes-agent/pull/148629)).

**Prediction:** v0.23.0 will likely feature the **Desktop simplified-agent UX**, **Portal-routed messaging**, and possibly **audit logging**, with compression and cross-gateway collaboration deferred to a subsequent minor given their `needs-decision` status.

---

## 7. User Feedback Summary

**Pain points (dissatisfaction signals):**
- **Data-loss fear on update** — [#147938](https://github.com/NousResearch/hermes-agent/issues/147938) describes an updater that overwrites healthy `state.db` with a stale snapshot and then misreports the outcome. This is the single most alarming user-facing report today.
- **Credential resolution confusion** — repeated "provider 'custom' resolved without credentials" reports ([#144523](https://github.com/NousResearch/hermes-agent/issues/144523), [#145614](https://github.com/NousResearch/hermes-agent/issues/145614)) show users of local OpenAI-compatible endpoints (e.g., MLX on `localhost:11234`) blocked from first message with unclear errors.
- **Silent failures** — cron delivery errors are only recorded in `last_delivery_error` and results are silently dropped ([#13566](https://github.com/NousResearch/hermes-agent/issues/13566)); gateway deadlocks go un-watchdogged ([#137555](https://github.com/NousResearch/hermes-agent/issues/137555)).
- **Info leakage into agent behavior** — users worry about un-gated config writes ([#59293](https://github.com/NousResearch/hermes-agent/issues/59293)).
- **Attachment loss** — images never reaching models in Desktop/iOS ([#148682](https://github.com/NousResearch/hermes-agent/issues/148682)) is a core UX regression.
- **Recurring false positives** — AV trojan flags on skills ([#57533](https://github.com/NousResearch/hermes-agent/issues/57533)), `pm doctor` false corruption ([#122827](https://github.com/NousResearch/hermes-agent/issues/122827)), systemd timing warnings ([#36755](https://github.com/NousResearch/hermes-agent/issues/36755)).

**Positive/desired signals:**
- Strong appetite for **platform expansion** (Team Gateway/Portal, mobile, Shein/Feishu/QQ adapters).
- Cost-conscious optimization demands (tool-output compression 👍17, per-channel fallback providers).
- Non-technical-user orientation: `bot-chat-agent` PR explicitly cites the goal of making Hermes accessible beyond developers.

**Satisfaction outlook:** Neutral-to-cautiously-positive. The release cadence and contribution volume are healthy, but users navigating update/cert flows and Desktop providers are encountering friction that erodes confidence — an issue exacerbated by multiple similar reports existing in parallel.

---

## 8. Backlog Watch

Long-unanswered or high-importance items warranting maintainer triage:

| Item | Age | Why it matters |
|---|---|---|
| [#1155](https://github.com/NousResearch/hermes-agent/issues/1155) — Agent audit log | Opened 2026-03-13 | Maintainer-filed; foundational for compliance/trust; spans 5 components |
| [#13566](https://github.com/NousResearch/hermes-agent/issues/13566) — Cron delivery retries | Opened 2026-04-21 | Reliability primitive; silent failure mode |
| [#19493](https://github.com/NousResearch/hermes-agent/issues/19493) — OpenCode ACP autodetect | Opened 2026-05-04 | Blocks a popular OSS agent integration |
| [#36755](https://github.com/NousResearch/hermes-agent/issues/36755) — systemd false positive | Opened 2026-06-01 | Persistent operator warning; 13 comments unresolved |
| [#39691](https://github.com/NousResearch/hermes-agent/issues/39691) — headroom-ai compression | Opened 2026-06-05 | Highest community 👍 (17); architectural decision pending |
| [#52554](https://github.com/NousResearch/hermes-agent/issues/52554) — Desktop Quote button | Opened 2026-06-25 | Simple UX win; 11 comments

</details>

<details>
<summary><strong>IronClaw</strong> — <a href="https://github.com/nearai/ironclaw">nearai/ironclaw</a></summary>

# IronClaw Project Digest — 2026-11-04

## 1. Today's Overview

IronClaw (github.com/nearai/ironclaw) is in a quiet maintenance state as of 2026-11-04, with zero issue activity and a single automated dependency PR over the last 24 hours. No new releases were published, and no PRs were merged or closed during the reporting window. All observed activity traces to a Dependabot-driven version bump targeting the internal architecture video tooling, not core agent functionality. Overall project momentum today is minimal, which is normal for a mature repository between release cycles but warrants monitoring if the lull persists.

## 2. Releases

No new releases were published in the last 24 hours.

## 3. Project Progress

No PRs were merged or closed today, so no features, fixes, or refactors advanced into the mainline. The only open PR (#8167) remains under review.

## 4. Community Hot Topics

Activity today is limited to a single item, and it registers no human engagement:

- **[PR #8167](https://github.com/nearai/ironclaw/pull/8167)** — `chore(deps): bump zod, @remotion/cli and @remotion/tailwind-v4 in /docs/internal/architecture-video` — opened by `dependabot[bot]` on 2026-11-03. Comments: n/a, Reactions: 0.

Underlying signal: the only "topic" in motion is dependency hygiene in the `/docs/internal/architecture-video` workspace, which suggests the internal documentation/video pipeline is actively built with Remotion + Tailwind v4 + Zod. No user-facing discussion is happening on this date.

## 5. Bugs & Stability

No bugs, crashes, or regressions were reported or updated in the last 24 hours.

The only stability-adjacent signal is PR #8167, which is a preventative dependency update rather than a bug fix. Its description notes the bumped packages "need to be updated," which can indicate a compatibility or security nudge from the dependency graph, but no explicit CVE or breakage is stated.

Severity ranking: **None identified.**

## 6. Feature Requests & Roadmap Signals

No feature requests were filed or updated today. With zero open issues in the activity window and no merged PRs, there is no direct evidence to forecast upcoming version contents. The sole data point — continued maintenance of the architecture video toolchain — implies ongoing investment in developer-facing documentation rather than end-user agent capabilities.

## 7. User Feedback Summary

No user feedback was captured in the reporting window: no issues opened, no comments, no reactions. Reported pain points, use cases, and satisfaction signals are therefore **null for 2026-11-04**. This is consistent with a low-traffic day and does not, by itself, indicate dissatisfaction.

## 8. Backlog Watch

There are no long-unanswered issues in the current dataset (0 issues tracked). The one item requiring maintainer attention is:

- **[PR #8167](https://github.com/nearai/ironclaw/pull/8167)** — an open Dependabot bump in `/docs/internal/architecture-video`. It has received no review, comments, or reactions since being created on 2026-11-03. While low-risk, unreviewed dependency PRs can accumulate and drift; a routine merge or explicit deferral is advisable.

---

**Health summary:** 🟢 Stable but idle. No regressions, no open community friction, and one housekeeping PR pending. Key watch item is whether the multi-day zero-merge pattern continues; if so, it may indicate maintainer bandwidth constraints rather than project decline.

</details>

<details>
<summary><strong>QwenPaw</strong> — <a href="https://github.com/agentscope-ai/QwenPaw">agentscope-ai/QwenPaw</a></summary>

# QwenPaw Project Digest — 2026-11-04

## 1. Today's Overview

QwenPaw shows **high-velocity maintenance activity** with 19 issues and 36 PRs updated in the last 24 hours, though no new release was cut. The project is clearly in a **pre-release hardening phase for the 2.3.0 branch** (beta.2/beta.3), with a heavy concentration of Windows desktop, plugin dependency, and channel-specific regressions being triaged. Notably, roughly **half of today's issue traffic stems from the 2.3.0 beta line** (always-on-top window, workspace selection, plugin activation), suggesting the beta is surfacing real-world integration bugs before GA. The comment-to-issue ratio is low (most issues have 1–5 comments), indicating maintainers are acknowledging but not yet deeply engaging — a possible triage bottleneck. On the positive side, several fix PRs (CRLF preservation, GBK decoding, desktop HTML opening, visual_compression bundling) are already in review, showing contributors are responding quickly to filed reports.

**Activity assessment: Elevated / Healthy but strained.** Merge throughput (9 closed/merged PRs) is outpaced by the open queue (27 open PRs), and no release shipped despite active development.

---

## 2. Releases

**None.** No new releases in the last 24 hours. The project remains on the 2.2.2 stable line with 2.3.0 in beta (beta.1 → beta.2 → beta.3 appearing across reports). Given the volume of open beta regressions, a 2.3.0 GA does not appear imminent.

---

## 3. Project Progress

Merged/closed PRs today (9 total) include:

- **[#7816](https://github.com/agentscope-ai/QwenPaw/pull/7816) [CLOSED]** — `fix(pack): force-include console channel in PyInstaller bundle`. Fixes a silent omission of the console channel from the Tauri sidecar, which previously prevented packaged Desktop apps from starting. **High-impact packaging fix.**
- **[#8514](https://github.com/agentscope-ai/QwenPaw/pull/8514) [CLOSED]** — `fix(desktop): bundle visual_compression glyph atlas assets`. Directly closes the FileNotFoundError reported in [#8488](https://github.com/agentscope-ai/QwenPaw/issues/8488) where Visual Compact silently no-opped on desktop builds.
- **[#8528](https://github.com/agentscope-ai/QwenPaw/issues/8528) [CLOSED]** — Markdown preview relative-path rewriting bug resolved.
- Issues closed today also include the long-standing [#4312](https://github.com/agentscope-ai/QwenPaw/issues/4312) (agent.json hot-reload scope for MCP/Skills) and [#8265](https://github.com/agentscope-ai/QwenPaw/issues/8265) (plugin hot-install abort on distro-patched Python).

**Advancing features still in review:** append-only SQLite session storage with native Turn forks ([#8532](https://github.com/agentscope-ai/QwenPaw/pull/8532)), plugin CLI command extension points ([#8554](https://github.com/agentscope-ai/QwenPaw/pull/8554)), QQ C2C streaming messages ([#8409](https://github.com/agentscope-ai/QwenPaw/pull/8409)), and Matrix E2EE-by-default ([#8559](https://github.com/agentscope-ai/QwenPaw/pull/8559)).

---

## 4. Community Hot Topics

Ranked by comment activity (reactions are uniformly 0 👍 across the dataset — a notable signal that the community comments but rarely upvotes):

1. **[#8265](https://github.com/agentscope-ai/QwenPaw/issues/8265) — Plugin hot-install aborts on distro-patched Python 3.11 (5 comments, CLOSED).** A stdlib `importlib.invalidate_caches()` raising on a real distro backport broke the plugin loader at three sites. The emotional framing ("我的插件被这个卡了" / *my plugin is stuck on this*) signals real user frustration with plugin reliability.

2. **[#8488](https://github.com/agentscope-ai/QwenPaw/issues/8488) — Desktop build omits visual_compression assets (3 comments, CLOSED).** A silent no-op is dangerous: users believe compression is active when it is not.

3. **[#8505](https://github.com/agentscope-ai/QwenPaw/issues/8505) — Bare APIError from OpenAI-compatible gateway classified as `unknown` (3 comments, OPEN).** Real-world relays/aggregators return 502s in message text only, defeating retry/fallback logic.

4. **[#8560](https://github.com/agentscope-ai/QwenPaw/issues/8560) — Desktop window forced always-on-top in beta.2 (2 comments, OPEN).** Functional regression that covers fullscreen apps — user-hostile.

**Underlying needs:** The hot topics cluster around two themes — **(a) plugin/dependency reliability** (users run plugins on heterogeneous Python builds and need graceful degradation), and **(b) protocol robustness** against non-conformant third-party gateways (a growing pain as users route through OpenAI-compatible relays).

---

## 5. Bugs & Stability

Ranked by severity:

**Critical / user-blocking**
- **[#8513](https://github.com/agentscope-ai/QwenPaw/issues/8513) — Security: shell-wrapped outbound actions bypass tool_guard and governance lanes at AUTO/SMART (OPEN, 1 comment).** Shell commands performing SMTP send / HTTP POST / `@file`-to-network execute **with no findings or approval**. This is the most serious open item — a potential data-exfiltration gap in the approval system. No fix PR identified.
- **[#8560](https://github.com/agentscope-ai/QwenPaw/issues/8560) — Desktop always-on-top (WS_EX_TOPMOST) regression in 2.3.0-beta.2 (OPEN).** Breaks fullscreen workflows; affects all beta.2 desktop users.
- **[#8549](https://github.com/agentscope-ai/QwenPaw/issues/8549) — Model config write path bypasses validation; provider silently disappears after restart (OPEN).** Invalid `thinking_budget`/`max_input_length` persisted, breaking read paths on reboot. **Fix PR exists: [#8550](https://github.com/agentscope-ai/QwenPaw/pull/8550).**

**High**
- **[#8553](https://github.com/agentscope-ai/QwenPaw/issues/8553) — QQ channel fails to activate with DEPENDENCY_PLAN_UNVERIFIED when hub plugin lacks dependency env (OPEN).** **Fix PR exists: [#8562](https://github.com/agentscope-ai/QwenPaw/pull/8562)** (drop stale host evidence on withdraw).
- **[#8565](https://github.com/agentscope-ai/QwenPaw/issues/8565) — Hub Local runtime cannot start on Windows (AppContainer staging, missing CPU arch, reverse-tunnel timeout) (OPEN, new today).**
- **[#8517](https://github.com/agentscope-ai/QwenPaw/issues/8517) — Hub Docker runtime "Permission denied" on working/config.json when non-root (OPEN).**
- **[#8511](https://github.com/agentscope-ai/QwenPaw/issues/8511) — Feishu channel intermittent `No active model configured` during concurrent messages (OPEN).** Reproduced on both 2.3.0-beta.1 and stable 2.2.2 — **not a beta regression.**

**Medium**
- **[#8414](https://github.com/agentscope-ai/QwenPaw/issues/8414) — edit_file converts all CRLF to LF (OPEN).** **Fix PR exists: [#8235](https://github.com/agentscope-ai/QwenPaw/pull/8235).** Related decoding fix in [#8234](https://github.com/agentscope-ai/QwenPaw/pull/8234) (GBK/CP936).
- **[#8555](https://github.com/agentscope-ai/QwenPaw/issues/8555) — New task workspace selection not reflected in subsequent messages (OPEN, beta.3).**
- **[#8533](https://github.com/agentscope-ai/QwenPaw/issues/8533) — Codex/Qoder backend cron jobs misclassify non-empty requests as empty (OPEN).**
- **[#8502](https://github.com/agentscope-ai/QwenPaw/issues/8502) — Desktop HTML "open in browser" fails on Chinese paths (OPEN).** **Fix PR exists: [#8524](https://github.com/agentscope-ai/QwenPaw/pull/8524).**

**Low / plugin-specific**
- **[#8547](https://github.com/agentscope-ai/QwenPaw/issues/8547) — Creator inspiration example cannot open on Windows (regression of #7291).**
- **[#8534](https://github.com/agentscope-ai/QwenPaw/issues/8534) — Creator TTS cannot use Aliyun Token Plan key; protocol option missing from model-config UI.**

**Pattern:** Windows + Chinese-locale environments generate a disproportionate share of reports (CRLF, GBK, Chinese paths, Aliyun services), and the **2.3.0 beta line introduced at least three new desktop regressions** (always-on-top, workspace selection, plugin activation).

---

## 6. Feature Requests & Roadmap Signals

Active feature work in review suggests the following are likely candidates for the next release:

- **Append-only session storage / native Turn forks** ([#8532](https://github.com/agentscope-ai/QwenPaw/pull/8532), size/XXXL) — durable SQLite history with paginated reconnect. Currently the most ambitious open PR; likely a headline feature if merged.
- **Plugin CLI commands & extension points** ([#8554](https://github.com/agentscope-ai/QwenPaw/pull/8554), size/XXXL) — extensibility for the plugin ecosystem.
- **QQ C2C streaming messages** ([#8409](https://github.com/agentscope-ai/QwenPaw/pull/8409)) — Feishu parity for the QQ channel.
- **Matrix E2EE installed by default** ([#8559](https://github.com/agentscope-ai/QwenPaw/pull/8559)) and **Matrix legacy-state migration simplification** ([#8558](https://github.com/agentscope-ai/QwenPaw/pull/8558)).
- **Per-run cron sessions** ([#8557](https://github.com/agentscope-ai/QwenPaw/pull/8557)) — bounds cron history growth.
- **Jev completion decisions** ([#8544](https://github.com/agentscope-ai/QwenPaw/pull/8544)) — optional quality self-check to catch "promise-more, deliver-less" replies.
- **Per-request inline media bounding** ([#8034](https://github.com/agentscope-ai/QwenPaw/pull/8034)) — closes a request-body size gap where many in-spec images accumulate (token eviction never fires because media ≈ 0 tokens).

**Prediction:** Matrix E2EE defaults, QQ streaming, and cron session bounding look closest to merge. The XXXL session-storage and plugin-CLI PRs may slip to a later release given their size and review burden.

---

## 7. User Feedback Summary

**Pain points (dissatisfaction signals):**
- **Plugin/dependency fragility** is the loudest theme — hot-install crashes, `DEPENDENCY_PLAN_UNVERIFIED` activations, and hub runtimes failing on Windows/Docker. Users run heterogeneous environments (distro-patched Python, non-root Docker, Windows AppContainer) that the dependency audit handles poorly.
- **Windows + Chinese-locale friction** repeatedly surfaces: CRLF normalization, GBK files silently dropping bytes, Chinese-path HTML failures, and Aliyun/China-edition model quirks (`xhigh` reasoning effort, Token Plan keys).
- **Silent failures** are a recurring complaint pattern (visual compression no-op, provider disappearing after restart, non-empty requests judged empty). Users dislike that errors are invisible until something downstream breaks.
- **Third-party backend integration** (Feishu, Codex, Qoder, QQ, OpenAI-compatible relays) is where much real-world usage and friction concentrates — the project is being used as a *hub* connecting many channels/providers, and the seams show.

**Satisfaction signals:** Rapid contributor response — multiple issues filed in the last 24–48h already have candidate fix PRs (validation, CRLF, GBK, stale dependency evidence, shell/slash command handling). This responsiveness is a strong project-health indicator.

**Notable behavioral signal:** Zero 👍 on *every* issue and PR in the dataset. Either reactions are disabled, unused by this community, or sentiment is conveyed through comments alone — worth verifying for release planning.

---

## 8. Backlog Watch

Items needing maintainer attention:

- **[#8034](https://github.com/agentscope-ai/QwenPaw/pull/8034) [OPEN, size/XXL, Under Review] — bound inline media per request.** Open since **2026-09-29** (~5 weeks), unchanged status. A significant request-body robustness fix stuck in review.
- **[#7816](https://github.com/agentscope-ai/QwenPaw/pull/7816) — closed today**, but was open since 2026-09-16 (~7 weeks) for a one-line packaging fix — indicates review latency on "boring but important" packaging work.
- **[#8234](https://github.com/agentscope-ai/QwenPaw/pull/8234)** and **[#8235](https://github.com/agentscope-ai/QwenPaw/pull/8235) [OPEN, Under Review]** — GBK decoding and CRLF preservation, both open since **2026-10-14** (~3 weeks). These are high-value, community-reported Windows fixes that have waited despite simple scope.
- **[#8236](https://github.com/agentscope-ai/QwenPaw/pull/8236) [OPEN, size/XL] — Ollama context window from num_ctx.** Open since 2026-10-14; local-model users currently get a wrong 128k assumption.
- **[#4312](https://github.com/agentscope-ai/QwenPaw/issues/4312) — now closed**, after being open since **2026-05-14** (~6 months). Its closure is a positive sign the maintainers are clearing long-tail backlog, but the half-year latency reflects queued enhancement demand.
- **[#8554](https://github.com/agentscope-ai/QwenPaw/pull/8554) and [#8532](https://github.com/agentscope-ai/QwenPaw/pull/8532)** — both XXXL PRs filed in the last 48h; they will likely need sustained reviewer bandwidth to avoid joining the long-open queue.

**Recommendation:** The project's main health risk is **review throughput on large and Windows-specific PRs**, not contributor interest. Prioritizing the CRLF/GBK set ([#8234](https://github.com/agentscope-ai/QwenPaw/pull/8234), [#8235](https://github.com/agentscope-ai/QwenPaw/pull/8235)) and the security gap ([#8513](https://github.com/agentscope-ai/QwenPaw/issues/8513)) would yield outsized user impact before 2.3.0 GA.

</details>

<details>
<summary><strong>ZeroClaw</strong> — <a href="https://github.com/zeroclaw-labs/zeroclaw">zeroclaw-labs/zeroclaw</a></summary>

# ZeroClaw Project Digest — 2026-11-04

## 1. Today's Overview

ZeroClaw remains in a high-activity development phase with **18 issues** and **50 PRs** touched in the last 24 hours, though no new releases were cut. The project shows intense focus on **v0.9.0 release-gate work**, particularly around security and identity-access (multiple P1/risk:high PRs by the same distinguished contributor). Notably, 3 issues and 10 PRs were closed/merged, indicating maintainers are actively pruning the backlog. A recurring theme across new issues is **silent fallback behavior** — contexts defaulting to 32k, tools compiled out without warnings, and configuration silently ignored — suggesting a systemic observability gap in the runtime. Overall project health looks **moderately strong**: high throughput, but a growing pile of P1 release-gate blockers (#9859, #9394, #11225, #11230, #11220) that need to land before v0.9.0 ships.

---

## 2. Releases

**No new releases in the last 24 hours.** ZeroClaw v0.8.x remains the current line, with v0.9.0 items still being tracked as release-gate blockers across several issues and PRs.

---

## 3. Project Progress

**Merged/Closed PRs (10 total; notable):**

- **[#11318](https://github.com/zeroclaw-labs/zeroclaw/pull/11318) — test(gateway): cover plugin webhook ingress in required CI** *(CLOSED)*
  Adds a required CI leg for the gateway's `/plugin/{path}` handler and plugins-wasm feature. Previously only covered by an advisory Windows job. This is a foundation PR for the plugin-webhook stack (#11319, #11320, #11322) that landed on 2026-11-03.
- **[#11234](https://github.com/zeroclaw-labs/zeroclaw/pull/11234) — fix(rpc): judge queued session ownership by current authority** *(CLOSED, security)*
  Closes the "queued session operations retain revoked administrator ownership" bug (#11126). Directly addresses a P1 identity-access vulnerability.
- **[#11624](https://github.com/zeroclaw-labs/zeroclaw/pull/11624) — fix(zerocode): answer dropped elicitations and record them in the transcript** *(CLOSED)*
  Resolves [#11623](https://github.com/zeroclaw-labs/zeroclaw/issues/11623): pending `ask_user`/`poll` prompts were cleared client-side and timed out after 600 s with no record.
- **[#12084](https://github.com/zeroclaw-labs/zeroclaw/pull/12084) — chore(docs): import AGENTS.md in CLAUDE.md** *(CLOSED)*
- **[#10873](https://github.com/zeroclaw-labs/zeroclaw/pull/10873) — chore(deps): bump similar 2.7.0 → 3.2.1** *(CLOSED)*

**Issues closed:**
- [#11126](https://github.com/zeroclaw-labs/zeroclaw/issues/11126) — queued session ownership bypass (P1 security) → fixed by #11234
- [#11623](https://github.com/zeroclaw-labs/zeroclaw/issues/11623) — ZeroCode elicitation drop → fixed by #11624
- [#11052](https://github.com/zeroclaw-labs/zeroclaw/issues/11052) — WhatsApp thematic breaks / setext headings

**Advanced but not yet landed:** The plugin-webhook stack (#11319 → #11320 → #11322) continues to review; #11318 landed as its CI foundation.

---

## 4. Community Hot Topics

Ranked by comment activity:

1. **[#7759 — Decouple gateway WebSocket lifetime from agent turn lifecycle](https://github.com/zeroclaw-labs/zeroclaw/issues/7759)** *(8 comments, OPEN, parking-lot)*
   Long-running architectural debate (open since June). The core ask: client disconnects should not cancel in-flight turns. This has a companion task in [#12107](https://github.com/zeroclaw-labs/zeroclaw/issues/12107) (reload detached turn on socket reopen), suggesting the design is being broken into implementable pieces. Underlying need: **agent turns are expensive; users lose work on flaky networks.**

2. **[#12014 — Custom OpenAI-compatible provider with no context_window silently assumes 32,000](https://github.com/zeroclaw-labs/zeroclaw/issues/12014)** *(5 comments, OPEN, S1 workflow blocked)*
   Related follow-up filed the same day: [#12194](https://github.com/zeroclaw-labs/zeroclaw/issues/12194). Underlying need: **users are adding custom providers (OpenRouter-style) that advertise huge windows, then getting turns rejected at 32k with no clear cause.**

3. **[#9394 — Gateway pairing_dashboard accepted but unread; pairing codes never expire](https://github.com/zeroclaw-labs/zeroclaw/issues/9394)** *(5 comments, OPEN, release-gate v0.9.0)*
   Filed after a security audit; a config option is accepted but silently ignored, and codes never expire. Underlying need: **security conscious operators want revocable, expiring credentials.**

4. **[#11052 — WhatsApp thematic breaks / setext headings](https://github.com/zeroclaw-labs/zeroclaw/issues/11052)** *(4 comments, now CLOSED)*
   Indicates ongoing channel-quality work for WhatsApp.

5. **[#9562 — WebChat auto-scroll overrides manual scroll during streaming](https://github.com/zeroclaw-labs/zeroclaw/issues/9562)** *(3 comments)* and **[#11126](https://github.com/zeroclaw-labs/zeroclaw/issues/11126)** *(3 comments, closed)*.

**Pattern:** The most-commented items cluster around (a) long-lived gateway session management and (b) safety of custom provider configuration. Both speak to users running ZeroClaw in production-ish setups where silent failures and lost turns have real cost.

---

## 5. Bugs & Stability

Ranked by severity:

| Severity | Issue | Status | Notes |
|---|---|---|---|
| **S1** | [#12014](https://github.com/zeroclaw-labs/zeroclaw/issues/12014) — custom OpenAI provider assumes 32k context, rejects valid turns | OPEN | Workflow blocked. Related to [#12194](https://github.com/zeroclaw-labs/zeroclaw/issues/12194) |
| **S1** | [#9859](https://github.com/zeroclaw-labs/zeroclaw/issues/9859) — distroless release image missing `sh`, breaks webhook | OPEN | runtime.shell "sh" not found; per-turn runtime creation fails |
| **S1** | [#12210](https://github.com/zeroclaw-labs/zeroclaw/issues/12210) — source Docker builds fail (fixture dir not copied before pre-fetch) | OPEN (filed 2026-11-03) | Blocks all three Dockerfiles; S1 workflow blocked |
| **P1** | [#9394](https://github.com/zeroclaw-labs/zeroclaw/issues/9394) — pairing codes never expire, `pairing_dashboard` unread | OPEN | release:v0.9.0, risk:high |
| **S2** | [#12211](https://github.com/zeroclaw-labs/zeroclaw/issues/12211) — delegated agents don't load TOOLS.md | OPEN (filed 2026-11-03) | delegate.rs uses hard-coded file list |
| **S2** | [#12218](https://github.com/zeroclaw-labs/zeroclaw/issues/12218) — Windows Clippy change detector times out (fetch-depth: 0) | OPEN | Fix PR is present: [#12219](https://github.com/zeroclaw-labs/zeroclaw/pull/12219) |
| **S3** | [#12186](https://github.com/zeroclaw-labs/zeroclaw/issues/12186) — `zerocode --agent` parsed but ignored | OPEN | TUI always opens Dashboard |
| **P1** | [#12203](https://github.com/zeroclaw-labs/zeroclaw/issues/12203) — `web_search_tool` silently compiled out | OPEN | No TOOL_COMPILED_OUT warning |

**Fix PRs already open:** [#12219](https://github.com/zeroclaw-labs/zeroclaw/pull/12219) (Clippy timeout, fixes #12218). No fix PR yet for the S1 Docker/webhook/context-window bugs.

---

## 6. Feature Requests & Roadmap Signals

**New feature requests filed 2026-11-02 → 11-03:**

- **[#12191 — Hybrid (dense + BM25) recall for Qdrant backend](https://github.com/zeroclaw-labs/zeroclaw/issues/12191)** — parity gap with SQLite backend. Likely a **v0.9.x candidate** if maintainers prioritize memory-backend parity.
- **[#12214 — Outbound media markers cannot carry a caption (text + image sent as two messages)](https://github.com/zeroclaw-labs/zeroclaw/issues/12214)** — affects WhatsApp/Telegram natively-inline captions. Small, user-visible; **plausible v0.9.0 candidate.**
- **[#12107 — Show detached chat turn's answer when socket reopens](https://github.com/zeroclaw-labs/zeroclaw/issues/12107)** — companion to #7759; likely to land **after** the WebSocket decoupling design is settled.
- **[#12216 — Multiple plugin registry origins](https://github.com/zeroclaw-labs/zeroclaw/pull/12216)** (PR, open) — ships a JSON-array form for `ZEROCLAW_PLUGIN_REGISTRY_URL`. Signals plugin ecosystem is maturing.
- **[#12184 — One-tap Matrix approval reactions](https://github.com/zeroclaw-labs/zeroclaw/pull/12184)** — extends the approval channel pattern to Matrix (✅/🔁/❌).

**Prediction for next version:** caption-with-media, Qdrant hybrid recall, and Matrix approval reactions look closest to shipping. The WebSocket/turn decoupling (#7759) remains the largest architectural item and may slip past v0.9.0.

---

## 7. User Feedback Summary

**Pain points surfaced today:**

- **Silent fallbacks are the dominant frustration.** Three separate issues (#12014, #12194, #12203) describe the same pattern: the runtime quietly substitutes a default (32k context, missing tool) with no log, warning, or validation error. Users only discover the problem when a turn *fails at the point of use*. This is arguably the single most fixable systemic complaint.
- **Real deployments hit infrastructure bugs**, not toy-environment ones: distroless Docker images without `sh` (#9859), private-CA IMAP/SMTP servers (#11752), Office 365 STARTTLS on port 587 (#11748). This suggests a growing set of **self-hosters deploying ZeroClaw behind corporate mail and hardened containers.**
- **CI friction for contributors:** #12218/#12219 and #12210 indicate the build/CI pipeline is being pushed harder, and source-image builds are currently broken end-to-end.
- **Satisfaction signals:** fast turnaround on #11623 (filed 2026-10-08, fixed 2026-11-03 by the same author) and #11126 (closed the same day it was last updated) show maintainers responsive to well-documented bugs from trusted contributors.

---

## 8. Backlog Watch

Items needing maintainer attention:

1. **[#7759 — Gateway WebSocket / turn-lifecycle decoupling](https://github.com/zeroclaw-labs/zeroclaw/issues/7759)** — filed 2026-06-16, still in `parking-lot` after ~4.5 months despite 8 comments and a companion task (#12107). The design decision gates at least one follow-up. **Warrants a decision, not another comment.**
2. **[#9394 — pairing_dashboard unread / codes never expire](https://github.com/zeroclaw-labs/zeroclaw/issues/9394)** — filed 2026-07-26, tagged `release:v0.9.0`, still open. Security-relevant and explicitly gated for release.
3. **[#9859 — distroless image missing sh](https://github.com/zeroclaw-labs/zeroclaw/issues/9859)** — filed 2026-08-09, P1, S1, no fix PR visible. Long-standing release blocker.
4. **[#11076 — agy_cli coding-CLI tool for Antigravity CLI](https://github.com/zeroclaw-labs/zeroclaw/pull/11076)** — open since 2026-09-23, XL diff, no maintainer action logged. Reflects demand for delegating to newer coding CLIs.
5. **[#11225](https://github.com/zeroclaw-labs/zeroclaw/pull/11225), [#11230](https://github.com/zeroclaw-labs/zeroclaw/pull/11230), [#11220](https://github.com/zeroclaw-labs/zeroclaw/pull/11220)** — the P0/P1 identity-access release-gate stack, open since 2026-09-29. #11234 (the dependency) closed today, which may unblock these. **Worth confirming in tomorrow's digest whether they merge.**

---

*All links point to `github.com/zeroclaw-labs/zeroclaw`. Digest generated from a 24-hour snapshot of GitHub activity on 2026-11-04.*

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*