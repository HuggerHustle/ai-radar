# OpenClaw Ecosystem Digest 2026-11-27

> Issues: 360 | PRs: 500 | Projects covered: 5 | Generated: 2026-11-27 03:35 UTC

- [OpenClaw](https://github.com/openclaw/openclaw)
- [Hermes Agent](https://github.com/nousresearch/hermes-agent)
- [IronClaw](https://github.com/nearai/ironclaw)
- [QwenPaw](https://github.com/agentscope-ai/QwenPaw)
- [ZeroClaw](https://github.com/zeroclaw-labs/zeroclaw)

---

## OpenClaw Deep Dive

# OpenClaw Project Digest — 2026-11-27

## 1. Today's Overview

OpenClaw remains a high-velocity project with **360 issues** and **500 PRs** updated in the last 24 hours, though the balance is concerning: **261 open/active issues vs. 99 closed**, and **282 open PRs vs. 218 merged/closed**. No new releases shipped today, and the project is carrying a **heavy stability debt** — the top of the issue tracker is dominated by memory leaks, OOM crash loops, and update-rollback failures spanning multiple releases (2026.9.x through 2026.11.x). Activity is dominated by maintainer `vincentkoc` and a handful of contributors pushing refactors and fix-shaping PRs, while P0/P1 crash-loop issues continue to accumulate aging without resolution (some open since June/September). The overall health signal is **mixed-to-strained**: strong contribution volume, but recurring regressions in the update/doctor path and persistent gateway memory issues suggest release quality is not keeping pace with shipping cadence.

## 2. Releases

**No new releases in the last 24 hours.** Note that the tracker is dominated by update-path failures *between* recent releases (2026.11.4 → 2026.11.8, 2026.11.8 → 2026.11.10), which is itself a release-engineering signal (see §5 and §8).

## 3. Project Progress

No releases landed, but notable **closed issues and merged/closed PRs** today:

- **[CLOSED] #182891** — Prompt cache never reused (`cache read dropped N -> 0`), a long-running cache-correctness bug. ([link](https://github.com/openclaw/openclaw/issues/182891))
- **[CLOSED] #200606** — Candidate Doctor blocked 2026.11.3 → 2026.11.5 update with plugin migration conflict. ([link](https://github.com/openclaw/openclaw/issues/200606))
- **[CLOSED] #193673** — Windows update backup capture stopped on `EBUSY` without identifying the file. ([link](https://github.com/openclaw/openclaw/issues/193673))
- **[CLOSED] #170496** — Read-only state-DB snapshot copied per read (cron maintenance trigger). ([link](https://github.com/openclaw/openclaw/issues/170496))
- **[CLOSED] #157712** — CLI state read leaked 162 MB read-only DB snapshots. ([link](https://github.com/openclaw/openclaw/issues/157712))
- **[CLOSED] #144876** — Tool-backed dashboard sessions ending silently after finalization failure. ([link](https://github.com/openclaw/openclaw/issues/144876))

**Active fix work in flight (open PRs):**
- **PR #205011** — `fix(doctor): restore cold session archives before session reimport`, fixing the 2026.11.8 rollback caused by `sqlite_transcript_count_mismatch`. Rated 🐚 platinum hermit, waiting on maintainer. ([link](https://github.com/openclaw/openclaw/pull/205011))
- **PR #206295** — `fix(update): stop using foreign recovery records as admission`, addressing the update recovery/admission class of bugs. ([link](https://github.com/openclaw/openclaw/pull/206295))
- **PR #195378** — `fix(gateway): parent prompt cache misses when a subagent settles`, closes #195328, security-sensitive. ([link](https://github.com/openclaw/openclaw/pull/195378))
- **PR #201280** — `fix: move ended one-time automations to run history` (explicitly marked **"Do not land"**, still under discussion). ([link](https://github.com/openclaw/openclaw/pull/201280))

## 4. Community Hot Topics

Ranked by comment activity:

1. **#91588 — Critical Gateway Memory Leak (42 comments, P0)** — RSS grows 350 MB → 15.5 GB over days, repeated OOM crashes via `launchd-handoff`. Open since 2026-06-09. ([link](https://github.com/openclaw/openclaw/issues/91588))
2. **#204775 — Design: prepared-release updates (38 comments)** — Shared design doc for the new update path; explicitly created to stop contributors colliding on the same files. ([link](https://github.com/openclaw/openclaw/issues/204775))
3. **#159662 — `prepared-model-catalog.worker.js` unbounded leak (29 comments, P1)** — ~4–5 GB/h, provider-agnostic, reproduced on cold reboot. ([link](https://github.com/openclaw/openclaw/issues/159662))
4. **#153426 — Curated memory roots silently excluded from bootstrap (27 comments, P0)** — `MEMORY.md`/`USER.md` permanently dropped once provenance becomes "untrusted", no diagnostics or recovery. ([link](https://github.com/openclaw/openclaw/issues/153426))
5. **#200756 / #200606 — Windows beta update failures (22 / 21 comments)** — Package-swap and Doctor/migration-conflict failures on the Windows update path. ([#200756](https://github.com/openclaw/openclaw/issues/200756), [#200606](https://github.com/openclaw/openclaw/issues/200606))

**Underlying needs:** The community's dominant concern is **operational reliability of the gateway and the update mechanism**. Multiple threads converge on two root themes: (a) memory/resource leaks across the gateway, model-catalog worker, and session machinery, and (b) the `doctor`/`package-swap` update pipeline rolling back or hanging. Issue #204775 shows maintainers are actively trying to coordinate the update redesign, which is a positive signal but also an admission that the current design is collision-prone.

## 5. Bugs & Stability

**P0 / Crash-loop:**
- **#91588** — Gateway memory leak, 350 MB → 15.5 GB, repeated OOM. **No fix PR.** ([link](https://github.com/openclaw/openclaw/issues/91588))
- **#153426** — Memory roots permanently dropped (security/session-state). **Needs security review; no fix PR.** ([link](https://github.com/openclaw/openclaw/issues/153426))
- **#89278** — Codex OAuth refresh timeout (10s) breaks cron/heartbeat. Has linked PR open. ([link](https://github.com/openclaw/openclaw/issues/89278))
- **#141413** — macOS app omits auth token for local Gateway using SecretRef. **Needs security review.** ([link](https://github.com/openclaw/openclaw/issues/141413))
- **#194664** — Codex protected continuation blocks all follow-ups. Has linked PR open. ([link](https://github.com/openclaw/openclaw/issues/194664))
- **#202518** — `claude-cli` run never closes after `sessions_spawn` + `sessions_yield`. ([link](https://github.com/openclaw/openclaw/issues/202518))
- **#203065** — macOS bundled Gateway service stuck on 2026.11.4, credential recovery loop. Marked `clawsweeper:fix-shape-clear`, `queueable-fix`. ([link](https://github.com/openclaw/openclaw/issues/203065))
- **#201472** — Dead Gateway lock without `processNamespace` blocks maintenance/rolls back update. ([link](https://github.com/openclaw/openclaw/issues/201472))

**P1 / High:**
- **#159662** — Model-catalog worker leak (~4–5 GB/h). ([link](https://github.com/openclaw/openclaw/issues/159662))
- **#196199** — Codex helper completions fail to resume parent (regression since 2026.10.10). ([link](https://github.com/openclaw/openclaw/issues/196199))
- **#181432** — Excessive baseline RSS (~1.9 GB) + SQLite transaction timeouts. ([link](https://github.com/openclaw/openclaw/issues/181432))
- **#154812** — Runaway RSS outside V8 heap → OOM + shutdown timeout. ([link](https://github.com/openclaw/openclaw/issues/154812))
- **#182369** — RSS grows ~0.1 GiB/h off-heap; internal `rss_threshold` monitor never fires. ([link](https://github.com/openclaw/openclaw/issues/182369))
- **#204816** — 2026.11.4 → 2026.11.8 stable rolls back with `doctor-failed / Invalid config`. Marked `queueable-fix`. ([link](https://github.com/openclaw/openclaw/issues/204816))
- **#205402** — Docker 2026.11.8 → 2026.11.10 entrypoint doctor hangs at "Database engines", gateway never listens. ([link](https://github.com/openclaw/openclaw/issues/205402))

**Assessment:** Memory/RSS issues form a *cluster* (#91588, #159662, #181432, #154812, #182369, #195497, #184843) reported across 2026.9.x–2026.11.x on Linux, Windows, and macOS — this looks like a systemic leak problem rather than isolated reports. Update-path failures are the second cluster. Most P0 issues lack a linked fix PR.

## 6. Feature Requests & Roadmap Signals

- **#151178 — Active Memory escalation provider** — Let a plugin decide deep-recall escalation. Needs product decision; linked PR open. ([link](https://github.com/openclaw/openclaw/issues/151178))
- **#103067 — Centralize chat-session naming + subagent session lifetime** — Session-state architecture cleanup. ([link](https://github.com/openclaw/openclaw/issues/103067))
- **#130247 — Cron jobs cannot end** (`--until` / `--max-runs` / cumulative counter). ([link](https://github.com/openclaw/openclaw/issues/130247))
- **PR #206325 — Resumable "Learn from Memory" imports** (Closes #205796). ([link](https://github.com/openclaw/openclaw/pull/206325))
- **PR #206088 / #205789 — Dictation review flows in the Control UI composer** (local file references, conservative English cleanup). ([#206088](https://github.com/openclaw/openclaw/pull/206088), [#205789](https://github.com/openclaw/openclaw/pull/205789))
- **PR #204362 — Talk status chimes** for hands-free iPhone/Mac. ([link](https://github.com/openclaw/openclaw/pull/204362))

**Prediction:** Given the volume of in-flight work, the **next version is likely dominated by stability fixes** (update/doctor rollback, cold-archive reimport, prompt-cache retention) rather than headline features. The prepared-release update redesign (#204775, #206295) is the most likely structural change to land in an upcoming release; dictation/memory-import features are plausible but appear experimental/flagged.

## 7. User Feedback Summary

**Pain points (dissatisfaction):**
- **Update pipeline is the #1 frustration.** Users on Windows, macOS, and Docker report rollbacks, hangs, and confusing Doctor errors (e.g., "Plugin deepseek Doctor source must be prepared before loading"). The recurring pattern "candidate validation passes, activation Doctor fails" erodes trust in the update flow.
- **Memory/OOM crashes** disrupt long-running self-hosted deployments; one user reports `22.9 GB cgroup peak` and systemd OOM-kills. Several users note the *internal* `rss_threshold` monitor fails to fire, making the leak silent until the host dies.
- **Silent data/session loss**: memory roots dropped permanently (#153426), sessions ending without replies, and "Protected Codex continuation" locking users out of their assistant.
- **Regressions after upgrades** (e.g., Windows 2026.10.2 startup 320s vs 55s; Control UI 100% CPU loop in `Element.getAnimations()`).

**Positive/constructive signals:**
- Users provide detailed environments, reproduction steps, and bisects (e.g., provider bisect on #159662), indicating a technically engaged community.
- Several users file issues *and* point to root-cause locations, and the "Related fix" references suggest contributors are self-organizing fixes.
- One low-quality/off-topic issue (#205007, a security-sounding but incoherent report) is present — likely needs triage/takedown attention.

## 8. Backlog Watch

Long-unanswered or aging issues needing maintainer attention:

- **#91588** (opened **2026-06-09**, P0, 42 comments) — The flagship memory leak, open ~5.5 months with no fix PR. Highest-priority maintenance gap. ([link](https://github.com/openclaw/openclaw/issues/91588))
- **#153426** (opened **2026-09-20**, P0, security + session-state) — Silent, permanent memory-root exclusion; requires security review. ([link](https://github.com/openclaw/openclaw/issues/153426))
- **#154812** (opened 2026-09-21, P1) and **#182369** (opened 2026-10-24, P1) — RSS leak reports, no fix PR. ([#154812](https://github.com/openclaw/openclaw/issues/154812), [#182369](https://github.com/openclaw/openclaw/issues/182369))
- **#89278** (opened **2026-06-02**, P0, Codex OAuth timeout) — Open ~6 months with a linked PR still unresolved. ([link](https://github.com/openclaw/openclaw/issues/89278))
- **#136714** (opened 2026-09-02, P2) — Codex sub-agents lose native shell/read/patch since 2026.8.2. ([link](https://github.com/openclaw/openclaw/issues/136714))
- **#161781** (opened 2026-09-30, now CLOSED) and other stale-tagged items suggest a growing stale backlog that triage is only partially clearing.
- **PR #201280** — Explicitly marked "Do not land" but still open and updated; needs a decision to close or redirect. ([link](https://github.com/openclaw/openclaw/pull/201280))

**Recommendation for maintainers:** Prioritize (1) the gateway memory-leak cluster, (2) the update/doctor rollback class, and (3) security-review items #153426 and #141413. The volume of P0s open for months against 261 active issues indicates a need for a dedicated stability release before any feature expansion.

---
*Generated from GitHub data as of 2026-11-27. Severity ratings and labels (e.g., `P0`, `clawsweeper:*`, `issue-rating`) are quoted from OpenClaw's own issue metadata.*

---

## Cross-Ecosystem Comparison

# Cross-Project Comparison Report — Personal AI Assistant / Agent Open-Source Ecosystem
**Date:** 2026-11-27 | **Projects:** OpenClaw, Hermes Agent, IronClaw, QwenPaw, ZeroClaw

---

## 1. Ecosystem Overview

The personal AI assistant / agent open-source landscape on 2026-11-27 is characterized by **high contribution velocity paired with a systemic review and stability bottleneck**. Across the four active projects, ~1,100 issues and PRs were touched in a single 24-hour window, yet only ~5 PRs were merged and zero releases shipped — indicating that community supply of code and bug reports far outpaces maintainer bandwidth. A dominant architectural theme is **decomposition and modularization**: Hermes Agent is migrating platforms and memory backends from core into plugins, while ZeroClaw is consolidating credential scoping across HTTP/browser/SSH/vault. Meanwhile, OpenClaw — the reference implementation — is carrying visible stability debt (memory leaks, update/doctor rollbacks) even as it remains the largest and most active project by raw volume. The ecosystem is maturing from "feature breadth" toward **operational reliability, security posture, and deployment ergonomics** (Windows parity, reverse-proxy, local-model cost governance).

---

## 2. Activity Comparison

| Project | Issues Updated (24h) | Open/Active Issues | PRs Updated (24h) | Open PRs | Merged/Closed PRs | Releases (24h) | Health Signal |
|---|---|---|---|---|---|---|---|
| **OpenClaw** | 360 | 261 open / 99 closed | 500 | 282 | 218 | None | ⚠️ Mixed-to-strained (high volume, heavy stability debt, P0s aging months) |
| **Hermes Agent** | 50 | 44 open / 6 closed | 50 | 47 | 3 | None | 🟡 High velocity, review-bound (stacked refactor backlog) |
| **IronClaw** | 0 | — | 0 | — | — | None | ⚪ Dormant (no activity in 24h) |
| **QwenPaw** | 28 | 12 open / 16 closed | 50 | 29 | ~1 closed | None | 🟢 Healthy maintenance (active triage, backlog cleanup) |
| **ZeroClaw** | 13 | — | 50 | ~48 | 2 | None | 🟢 High velocity, review-constrained (credential epic pending) |

> **Note:** OpenClaw's figures are an order of magnitude larger than peers, reflecting both its role as the reference implementation and its accumulated backlog. Zero releases across all projects in this window is a notable ecosystem-wide signal.

---

## 3. OpenClaw's Position

**Advantages vs. peers:**
- **Scale and gravity:** ~7× the issue/PR throughput of any peer; it is the de facto reference implementation and the largest community by contributor count and issue volume.
- **Feature completeness:** Broadest surface area (gateway, doctor/update pipeline, memory roots, prompt cache, multi-platform packaging, Control UI, dictation, automations).
- **Community self-organization:** Users provide bisects, reproduction steps, and root-cause pointers; maintainers coordinate via shared design docs (#204775) to prevent contributor collisions.

**Technical approach differences:**
- Heavy, monolithic core with a **formal update/doctor pipeline** — a differentiator, but also its biggest liability (rollback failures across 2026.9.x–2026.11.x).
- Runs a **gateway-centric architecture** with session machinery, subagents, and a model-catalog worker — richer than peers but the source of the systemic memory-leak cluster (350 MB → 15.5 GB, #91588).

**Community size comparison:**
- OpenClaw's 261 active issues vs. Hermes' 44 and QwenPaw's 12 indicates a **much larger, more diverse user base** — but also a larger support burden. Its P0 issues age for 5–6 months (#91588, #89278), a maturity gap that smaller, faster-triaging projects (QwenPaw, ZeroClaw) do not exhibit.

**Positioning:** OpenClaw is the **incumbent with scale but strained release quality**; peers are smaller, more focused, and currently more responsive per-issue.

---

## 4. Shared Technical Focus Areas

Requirements emerging across multiple projects:

| Theme | Projects | Specific Need |
|---|---|---|
| **Memory / session lifecycle correctness** | OpenClaw, Hermes, QwenPaw, ZeroClaw | Memory leaks (OpenClaw #91588, #159662), compaction never firing (Hermes #79357), memory data loss (ZeroClaw #10797), memory retention expectations (QwenPaw #8882). Converging on **predictable, non-lossy memory with observable state**. |
| **Update / upgrade reliability** | OpenClaw, QwenPaw | Rollback failures and Doctor conflicts (OpenClaw #204816, #205402); post-upgrade regressions (QwenPaw #8949). Users want **updates that don't silently break running deployments**. |
| **Security & credential scoping** | OpenClaw, Hermes, ZeroClaw | Approval-gate bypass (Hermes #160605), auth token omission (OpenClaw #141413), scoped credentials epic (ZeroClaw #12490–#12695). Demand for **least-privilege, auditable credential handling**. |
| **Windows / cross-platform parity** | Hermes, QwenPaw, ZeroClaw | Windows-specific failure clusters (Hermes #157671/#156436, QwenPaw #8941/#8830, ZeroClaw #12743). **Platform parity is a recurring second-class-citizen complaint.** |
| **Config/documentation truthfulness** | Hermes, ZeroClaw, QwenPaw | "Config that lies" (Hermes #127942, #160108; ZeroClaw #10635; QwenPaw #8725). Users need **documented behavior to match runtime behavior**. |
| **Cost governance / token efficiency** | ZeroClaw, Hermes | Contradictory budget limits (ZeroClaw #10635), per-subagent toolset restriction (Hermes #85700). **Predictable cost control for local and multi-agent deployments.** |
| **Channel/platform expansion** | Hermes, QwenPaw, ZeroClaw | Feishu, WeCom, DingTalk, QQ, XMPP, Telegram forum topics. **Ecosystem breadth via plugins, not core.** |

---

## 5. Differentiation Analysis

| Dimension | OpenClaw | Hermes Agent | QwenPaw | ZeroClaw |
|---|---|---|---|---|
| **Feature focus** | Full-stack reference: gateway, update pipeline, memory, UI, automations | Platform decomposition + plugin ecosystem (Feishu, WeCom, XMPP) | Console UX, local models, channel integrations, desktop packaging | Credential scoping, security, native Rust channels, v1.0 stabilization |
| **Target users** | Broad self-hosted operators, power users | Multi-platform / multi-profile teams, plugin integrators | Local-model users, console-centric operators | Security-conscious, local-first operators |
| **Technical architecture** | Monolithic core + gateway + doctor/update pipeline | Core→plugin migration (Labs), stacked refactor branches | Tauri desktop + Console + provider plugins | Rust-native, scoped-credential architecture, runtime profiles |
| **Maturity posture** | Large but stability-debt-laden | Rapidly refactoring, review-bound | Actively triaging, cleaning backlog | Planning v1.0.0, consolidating security |
| **Distinctive bet** | Breadth + update tooling | Modularity via plugin extraction | UX polish + local-model ergonomics | Security/credential correctness |

**Key insight:** No two projects compete head-on. OpenClaw owns breadth; Hermes owns extensibility; QwenPaw owns console/local-model UX; ZeroClaw owns security and Rust-native deployment. This suggests a **complementary, not zero-sum, ecosystem** — though all converge on memory, updates, and cross-platform reliability as table stakes.

---

## 6. Community Momentum & Maturity

**Activity tiers:**

- **Tier 1 — High-volume incumbent:** **OpenClaw** (360 issues, 500 PRs). Rapidly iterating but *not* stabilizing — accumulating P0s and stability debt. Momentum is high; maturity of release quality is lagging.
- **Tier 2 — High-velocity, review-bound:** **Hermes Agent** and **ZeroClaw** (~50 PRs each, 2–3 merges). Both are in **active architectural transformation** (Hermes: core→plugin; ZeroClaw: credential epic + v1.0 roadmap). Their bottleneck is maintainer review, not contributor supply.
- **Tier 3 — Healthy maintenance:** **QwenPaw** (28 issues, 50 PRs, 16 issues closed). **Stabilizing** — actively triaging, closing backlog, shipping targeted fixes. Highest closure ratio.
- **Tier 4 — Dormant:** **IronClaw** (no activity).

**Maturity read:**
- **Rapidly iterating:** OpenClaw, Hermes, ZeroClaw.
- **Stabilizing:** QwenPaw.
- **Stalled/at-risk:** OpenClaw's release quality (despite volume); Hermes/ZeroClaw if review backlog persists.

---

## 7. Trend Signals

**Industry trends extracted from community feedback:**

1. **Reliability is the new feature.** Across every project, the loudest signals are about *not breaking*: update rollbacks, memory leaks, silent data loss, stuck sessions. Users no longer reward new capabilities as much as **trustworthy operation**. *(OpenClaw #91588, #204816; ZeroClaw #10797; QwenPaw #8949)*

2. **Modularity via plugins is the architectural consensus.** Hermes (platforms/memory → Labs), QwenPaw (channel/provider plugins), ZeroClaw (native channels) all push extensibility out of core. **Value for developers:** build once against a plugin contract, reach multiple agent runtimes.

3. **Security is shifting from "auth" to "scoping and approval."** Approval-gate bypass (Hermes #160605), scoped credentials (ZeroClaw), and token omission (OpenClaw #141413) show demand for **least-privilege, auditable, per-resource credentials** — not just login.

4. **Local-first and cost governance are first-class concerns.** Prompt-budget contracts (ZeroClaw #5287), token-efficient subagent toolsets (Hermes #85700), and local-model management (QwenPaw) reflect a **cost- and privacy-conscious user base** moving off cloud-only assumptions.

5. **Cross-platform parity is a maturity gate.** Windows failure clusters (Hermes, QwenPaw, ZeroClaw) and Linux packaging gaps (QwenPaw #8444) show that **platform coverage is now a competitive differentiator**, not an afterthought.

6. **Config/documentation drift erodes trust.** Multiple "config that lies" issues signal that **observable, self-consistent configuration** is a baseline expectation.

**Value for AI agent developers:**
- Prioritize **memory correctness and update safety** over feature breadth.
- Design for **pluggable platforms/memory backends** to ride the ecosystem's modularization wave.
- Treat **credential scoping, cost budgets, and platform parity** as core requirements, not edge cases.
- Invest in **observability** (cost meters, session state, leak monitors) — silent failures are the top user frustration.

---

*Report compiled from 2026-11-27 community digests. Severity labels (P0/P1, S0–S3, `risk:high`) are quoted from each project's own metadata. IronClaw excluded from detailed comparison due to zero activity.*

---

## Peer Project Reports

<details>
<summary><strong>Hermes Agent</strong> — <a href="https://github.com/nousresearch/hermes-agent">nousresearch/hermes-agent</a></summary>

# Hermes Agent — Project Digest
**Date:** 2026-11-27
**Repo:** [github.com/NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent)

---

## 1. Today's Overview

Hermes Agent shows sustained, high-velocity development activity on 2026-11-27, with 50 issues and 50 PRs updated in the last 24 hours. The issue tracker remains heavily weighted toward open work (44 active vs. 6 closed), and PR throughput is skewed toward review backlog (47 open vs. 3 merged/closed), suggesting maintainer review capacity — not contributor supply — is the current bottleneck. A dominant theme today is a **large-scale architectural decomposition**: a series of stacked refactor PRs (authored by teknium1) are migrating messaging platforms (Feishu/Lark, WeCom, DingTalk, QQ Bot, Google Meet, Teams) and memory backends (ByteRover, RetainDB) out of core and into official/Hermes Labs plugins. No new releases shipped today.

---

## 2. Releases

**None.** No new releases were published in the last 24h. Notably, several open PRs (e.g., [#159650](https://github.com/NousResearch/hermes-agent/pull/159650)) reference a stalled version floor (`>=0.23.5`) while stable/canary both report `0.23.4`, indicating the next release will need to coordinate with the ongoing core-to-plugin migration.

---

## 3. Project Progress

Only **3 PRs were merged/closed** in the last 24h — low relative to the 47 open. Progress this cycle is concentrated in *proposed* structural changes rather than landed code:

- **Platform decomposition (in review):** PRs [#159622](https://github.com/NousResearch/hermes-agent/pull/159622) (memory backends → Labs), [#159653](https://github.com/NousResearch/hermes-agent/pull/159653) (Google Meet/Teams), [#159651](https://github.com/NousResearch/hermes-agent/pull/159651) (Feishu), [#159649](https://github.com/NousResearch/hermes-agent/pull/159649) (WeCom), [#159638](https://github.com/NousResearch/hermes-agent/pull/159638) (DingTalk), [#159641](https://github.com/NousResearch/hermes-agent/pull/159641) (QQ Bot) all advanced with auto-migration logic and review fixes.
- **Bug fixes proposed today:** [#160642](https://github.com/NousResearch/hermes-agent/pull/160642) (shell-hook output now actually applies, salvaging #67939/#67890), [#160641](https://github.com/NousResearch/hermes-agent/pull/160641) (idle gateway background compaction, fixes #79357), [#160643](https://github.com/NousResearch/hermes-agent/pull/160643) (tool-call ID uniquification), [#160649](https://github.com/NousResearch/hermes-agent/pull/160649) (Anthropic OAuth tool aliases).
- **Issues closed:** [#99568](https://github.com/NousResearch/hermes-agent/issues/99568) (session_search recovery footer), [#149642](https://github.com/NousResearch/hermes-agent/issues/149642) (plugin OAuth redirect_port), [#152732](https://github.com/NousResearch/hermes-agent/issues/152732) (OAuth scopes/pinned port), [#160108](https://github.com/NousResearch/hermes-agent/issues/160108) (docs contradiction).

---

## 4. Community Hot Topics

| Rank | Item | Comments | 👍 | Link |
|------|------|----------|-----|------|
| 1 | #79357 — idle_compact never fires in gateway mode | 13 | 6 | [link](https://github.com/NousResearch/hermes-agent/issues/79357) |
| 2 | #28279 — Per-Chat Memory Isolation (Scoped Memory) | 10 | 2 | [link](https://github.com/NousResearch/hermes-agent/issues/28279) |
| 3 | #127942 — MCP `lazy: true` never engages | 9 | 0 | [link](https://github.com/NousResearch/hermes-agent/issues/127942) |
| 4 | #155638 — Receipt recovery loops forever (Matrix) | 7 | 0 | [link](https://github.com/NousResearch/hermes-agent/issues/155638) |
| 5 | #78975 — Feishu cron delivery fails [99992402] | 7 | 0 | [link](https://github.com/NousResearch/hermes-agent/issues/78975) |

**Underlying needs analysis:**
- **#79357** (highest engagement, 6 👍) reflects a core gateway-lifecycle correctness gap; a fix PR ([#160641](https://github.com/NousResearch/hermes-agent/pull/160641)) landed today, which should relieve pressure.
- **#28279** exposes a **privacy concern in multi-chat deployments** — global memory injection leaks context across platforms/profiles. This is a growing pain as Hermes is used in shared/team environments, and it carries the `needs-decision` label (design tradeoff, not just a bug).
- **#127942** shows the gap between documented config features and actual SDK behavior (default `ttlMs=0` defeats lazy loading) — a class of "config that lies" issues eroding trust.
- **#155638** and **#78975** both cluster around **cron/delivery reliability on non-core platforms**, a recurring theme in the backlog.

---

## 5. Bugs & Stability

Ranked by severity (P1 highest). Note which have fix PRs in flight.

| Severity | Issue | Area | Fix PR? |
|----------|-------|------|---------|
| **P1** | [#99568](https://github.com/NousResearch/hermes-agent/issues/99568) — session_search can't return compacted rows | memory/compression | **Closed** |
| **P2** | [#79357](https://github.com/NousResearch/hermes-agent/issues/79357) — idle compaction never fires in gateway | agent/gateway | ✅ [#160641](https://github.com/NousResearch/hermes-agent/pull/160641) |
| **P2** | [#127942](https://github.com/NousResearch/hermes-agent/issues/127942) — MCP lazy never engages | tools/MCP | ❌ |
| **P2** | [#155638](https://github.com/NousResearch/hermes-agent/issues/155638) — Matrix receipt recovery infinite loop | cron/auth | ❌ |
| **P2** | [#78975](https://github.com/NousResearch/hermes-agent/issues/78975) — Feishu cron 100% delivery failure | gateway/platform | ❌ |
| **P2** | [#160608](https://github.com/NousResearch/hermes-agent/issues/160608) — Sessions fence indefinitely on 'unknown' admissions | gateway/sessions | ❌ (new today) |
| **P2** | [#160634](https://github.com/NousResearch/hermes-agent/issues/160634) — max-iterations handoff misreported as `run.failed` | gateway/API | ❌ (new today) |
| **P2** | [#160605](https://github.com/NousResearch/hermes-agent/issues/160605) — Approval gate bypass: 3 shell shapes turn `ask`→`allow` | **security**/tools | ❌ (new today) |
| **P2** | [#136657](https://github.com/NousResearch/hermes-agent/issues/136657) — Gateway drops plugin-platform routing rows on restart | gateway/plugins | ❌ |
| **P2** | [#147660](https://github.com/NousResearch/hermes-agent/issues/147660) — session-reset-policy never fires for GUI sessions | gateway/sessions | ❌ |

**Notable regressions / new today:**
- **[#160605](https://github.com/NousResearch/hermes-agent/issues/160605)** is the most concerning *new* report — a **security-class approval-gate bypass** where wrapping a guarded command (`cp`, `sed | sh`, `sh <file>`) in common shell redirections silently downgrades `ask` to `allow`. No fix PR yet; warrants urgent triage.
- **[#160608](https://github.com/NousResearch/hermes-agent/issues/160608)** — no boot-time reconciliation of persisted `unknown` admissions causes permanent session fencing after crashes.
- **Windows cluster:** [#157671](https://github.com/NousResearch/hermes-agent/issues/157671) (GNU whoami shadows System32), [#156436](https://github.com/NousResearch/hermes-agent/issues/156436) (MSYS `-c` 8192-wchar truncation), [#151274](https://github.com/NousResearch/hermes-agent/issues/151274) (MSIX `pm repair` fails) — Windows remains a persistent stability weak spot.

---

## 6. Feature Requests & Roadmap Signals

Active feature requests (`type/feature`), ranked by likely near-term inclusion:

1. **[#28279](https://github.com/NousResearch/hermes-agent/issues/28279) — Per-Chat Memory Isolation** (`needs-decision`, 10 comments). High community interest, addresses privacy. Likely *not* next release given design ambiguity, but a strong roadmap candidate.
2. **[#85700](https://github.com/NousResearch/hermes-agent/issues/85700) — `enabled_toolsets` for `delegate_task`** (per-subagent tool restriction). Token-efficiency win for multi-agent orchestration; moderate effort, plausible near-term.
3. **[#149642](https://github.com/NousResearch/hermes-agent/issues/149642) / [#152732](https://github.com/NousResearch/hermes-agent/issues/152732) — Plugin OAuth improvements** (redirect_port pinning, comma-separated scopes) — **both CLOSED today**, indicating OAuth plugin ergonomics are actively shipping. Expect Linear/QuickBooks plugin enablement to follow.
4. **[#160565](https://github.com/NousResearch/hermes-agent/pull/160565) — XMPP/Jabber platform plugin** and multiple catalog additions ([#160644](https://github.com/NousResearch/hermes-agent/pull/160644) github-locker, [#160639](https://github.com/NousResearch/hermes-agent/pull/160639) postqued) — ecosystem expansion is clearly a priority.

**Prediction:** The next release will be dominated by the **core→plugin migration** (Feishu, WeCom, DingTalk, QQ Bot, Google Meet, Teams, ByteRover, RetainDB) rather than net-new agent features. Platform-agnostic features (scoped memory, delegate toolset restriction) are more likely to land in a subsequent cycle.

---

## 7. User Feedback Summary

**Pain points (dissatisfaction):**
- **Config/documentation drift:** Multiple issues (#127942, #67890, #160108) where documented behavior doesn't match reality — erodes user trust in configuration.
- **Delivery reliability on non-core platforms:** Feishu (#78975) and Matrix (#155638) users report 100% failure / infinite loops — cron delivery is fragile outside the mainstream.
- **Windows as a second-class citizen:** A recurring cluster of Windows-specific failures (#157671, #156436, #151274, #134952) around `whoami`, MSYS limits, MSIX installs, and junction/symlink paths.
- **Session lifecycle gaps:** #147660 and #160608 describe GUI sessions bloating or fencing — users hitting compaction loops and stuck sessions.

**Use cases surfacing:**
- Multi-chat/multi-profile deployments (#28279) — Hermes increasingly used beyond single-user setups.
- Heavy plugin/OAuth integration (Linear, QuickBooks) — users want first-class third-party auth.
- Subagent orchestration (#85700) — power users optimizing token cost.

**Satisfaction signals:** Positive reaction counts on #79357 (6 👍) and #146527 (2 👍) suggest users are engaged and the community is constructively triaging. The volume of *new* plugin catalog PRs from outside contributors indicates a healthy, growing ecosystem.

---

## 8. Backlog Watch

Items needing maintainer attention — long-lived, high-impact, or blocked:

| Item | Age | Concern | Link |
|------|-----|---------|------|
| #28279 | ~6 months (since 2026-05-19) | Scoped Memory — `needs-decision`, privacy-critical, no resolution | [link](https://github.com/NousResearch/hermes-agent/issues/28279) |
| #127942 | ~2 months (2026-09-29) | MCP lazy never engages — `duplicate` label, no fix PR | [link](https://github.com/NousResearch/hermes-agent/issues/127942) |
| #78975 | ~4 months (2026-08-05) | Feishu cron 100% failure — no fix PR despite clear root cause | [link](https://github.com/NousResearch/hermes-agent/issues/78975) |
| #155638 | ~2 weeks (2026-11-14) | Matrix receipt recovery infinite loop — `UnscopedSecretError` | [link](https://github.com/NousResearch/hermes-agent/issues/155638) |
| #85700 | ~3.5 months (2026-08-13) | `enabled_toolsets` for delegate_task — `needs-decision`, no PR | [link](https://github.com/NousResearch/hermes-agent/issues/85700) |
| #67939 | ~4 months (2026-07-20) | Shell-hook transform fix — `needs-decision`, stalled; salvaged today by #160642 | [link](https://github.com/NousResearch/hermes-agent/pull/67939) |
| #122279 | ~2 months (2026-09-25) | Inferred provider route persistence fix — open, awaiting review | [link](https://github.com/NousResearch/hermes-agent/pull/122279) |
| #104611 | ~2.5 months (2026-09-06) | Memory Write Gate review flow re-land — open, no review | [link](https://github.com/NousResearch/hermes-agent/pull/104611) |

**Watch-out:** The **review backlog is the biggest structural risk.** With 47 open PRs to 3 merges and several stacked decomposition branches (all rebased repeatedly across "Round 16"), maintainer bandwidth is the limiting factor. If the core→plugin migration stalls, downstream PRs (catalog additions, platform plugins) may pile up behind it. Prioritizing merge throughput on the stacked refactor series would unblock the widest set of contributors.

---

*Digest generated from GitHub activity data for 2026-11-27. All links point to NousResearch/hermes-agent.*

</details>

<details>
<summary><strong>IronClaw</strong> — <a href="https://github.com/nearai/ironclaw">nearai/ironclaw</a></summary>

No activity in the last 24 hours.

</details>

<details>
<summary><strong>QwenPaw</strong> — <a href="https://github.com/agentscope-ai/QwenPaw">agentscope-ai/QwenPaw</a></summary>

# QwenPaw Project Digest — 2026-11-27

## 1. Today's Overview

QwenPaw shows **high-velocity maintenance activity** with 28 issues and 50 PRs updated in the last 24 hours, though no new releases were cut. The issue tracker is skewed toward closure (16 of 28 updated issues were closed), indicating active triage and backlog cleanup — notably contributor `passionworkeer` re-filed older issues (#8930, #8931) after clearing stale ones to keep the open count manageable. However, 29 PRs remain open, including several large, long-running feature branches (#8532 at XXXL, #8719 at XXXL) that have been under review for weeks, suggesting review bandwidth may be a bottleneck. A cluster of Windows-specific bugs and a newly reported Console rendering regression (#8948) point to platform-parity and UX polish work as recurring themes.

## 2. Releases

No new releases in the last 24 hours.

## 3. Project Progress

While no PRs are explicitly marked *merged* in today's dataset, one notable PR reached closed status: **#8444** — `feat(desktop): add Linux deb and AppImage packaging to the Tauri build` ([link](https://github.com/agentscope-ai/QwenPaw/pull/8444)), which extends desktop artifacts beyond Windows/macOS and addresses a long-standing packaging gap for Linux users. Several other PRs advanced toward merge-readiness with maintainer review activity (#8944, #8942, #8920, #8932), including fixes for the `ToolCallBudgetGate` over-counting bug and Windows plugin-install test failures.

## 4. Community Hot Topics

- **#8882 — Reference-counted archival for long-term memory** ([link](https://github.com/agentscope-ai/QwenPaw/issues/8882), 3 comments, OPEN): Proposes TTL/reference-tracking for distilled memory entries to resolve the "agent keeps forgetting" complaint (#7571). Underlying need: users want predictable memory retention without manual pruning.
- **#8830 — Windows orphaned `llama-server.exe` processes** ([link](https://github.com/agentscope-ai/QwenPaw/issues/8830), 3 comments, CLOSED): Process lifecycle bug that exhausts memory across backend restarts; closed but no linked fix PR is visible, worth confirming resolution.
- **#8949 — Frontend not showing live task status after 2.3.0-post1** ([link](https://github.com/agentscope-ai/QwenPaw/issues/8949), 2 comments, OPEN): Freshly filed regression where the UI spinner stalls while backend work completes. High visibility due to affecting the core chat loop.
- **#8948 — Single `~` parsed as strikethrough in Console** ([link](https://github.com/agentscope-ai/QwenPaw/issues/8948), 1 comment, OPEN): Markdown rendering bug that mangles numeric ranges like `600~1500 t/s`. Low severity but high annoyance for users sharing benchmark output.

## 5. Bugs & Stability

Ranked by severity:

| Severity | Issue | Status | Fix PR? |
|---|---|---|---|
| High | #8949 frontend stops updating task status post-upgrade ([link](https://github.com/agentscope-ai/QwenPaw/issues/8949)) | OPEN | No |
| High | #8830 Windows orphaned `llama-server.exe` exhausts memory ([link](https://github.com/agentscope-ai/QwenPaw/issues/8830)) | CLOSED | Unclear |
| Medium | #8943 `ToolCallBudgetGate` re-counts tool calls, budgets stop early ([link](https://github.com/agentscope-ai/QwenPaw/issues/8943)) | OPEN | Yes — #8944 |
| Medium | #8945 Feishu table cards misparse code-block lines as tables ([link](https://github.com/agentscope-ai/QwenPaw/issues/8945)) | OPEN | Yes — #8946 |
| Medium | #8725 `/model` cannot switch pinned session model in channels ([link](https://github.com/agentscope-ai/QwenPaw/issues/8725)) | OPEN | No |
| Low | #8931 / #8930 video_memory null/segment-length crashes ([link](https://github.com/agentscope-ai/QwenPaw/issues/8931)) | OPEN | Yes — #8933, #8932 |
| Low | #8948 `~` strikethrough rendering ([link](https://github.com/agentscope-ai/QwenPaw/issues/8948)) | OPEN | No |

Windows platform parity is a recurring stability theme — #8941 documents 12 plugin-install tests failing on Windows, with fix PR #8942 already open.

## 6. Feature Requests & Roadmap Signals

- **#8929 — MCP config page header form** ([link](https://github.com/agentscope-ai/QwenPaw/issues/8929)): Users want auth headers editable in the UI rather than raw JSON. Likely a near-term Console improvement given MCP adoption.
- **#8947 — WebRouter as a `web_search` provider** ([link](https://github.com/agentscope-ai/QwenPaw/issues/8947)): Third-party maintainer offering an Apache-2.0 integration; low-effort, high-value provider addition.
- **#8938 — Migrate Composer from `<textarea>` to Lexical** ([link](https://github.com/agentscope-ai/QwenPaw/issues/8938)): Roadmap question about rich-editor support for quote replies — signals demand for richer chat input.
- **#8827 — Telegram forum-topic session isolation** ([link](https://github.com/agentscope-ai/QwenPaw/issues/8827), CLOSED as feature): Channel-scoped session management pattern likely to extend to other channels.
- **#8872 / #8727** (closed) suggest local-model management and Responses-protocol handling are stabilizing.

Predicting next release: Console rendering fixes (`~`, transcript jump #8888), Feishu formatting (#8946), and the `ToolCallBudgetGate` fix (#8944) are strong candidates.

## 7. User Feedback Summary

**Pain points:** (1) *Reliability of background processes on Windows* — orphaned `llama-server.exe` (#8830) and failing tests (#8941) erode trust in local-model mode. (2) *UI truthfulness* — #8949 and #8888 both report the Console showing stale or jumping state, which users interpret as the agent "hanging." (3) *Memory expectations* — #8882 and #8848 reflect confusion when compaction/forgetting occurs; the `/clear` suggestion in #8848 was flagged as misleading.

**Satisfaction signals:** Users are actively investing in the platform (channel integrations, provider PRs, video_memory app). The volume of small, well-scoped community PRs from `passionworkeer` and `shaojunying` indicates a healthy contributor base. Dissatisfaction clusters around transition/regression bugs after the 2.3.x updates rather than core capability gaps.

## 8. Backlog Watch

- **#8532** — `feat(chat): append-only session storage, paginated history, native Turn forks` ([link](https://github.com/agentscope-ai/QwenPaw/pull/8532), OPEN since 2026-11-02, size/XXXL): Foundational storage architecture change; sitting open 25+ days. Needs maintainer review to unblock.
- **#8719** — `feat(console): support runtime base-path deployment` ([link](https://github.com/agentscope-ai/QwenPaw/pull/8719), OPEN since 2026-11-13, size/XXXL): Reverse-proxy deployment support is a frequent enterprise ask; under review but aging.
- **#8649** — `feat(local-models): llama.cpp GPU controls + auto-update` ([link](https://github.com/agentscope-ai/QwenPaw/pull/8649), OPEN since 2026-11-09): First of a stacked 3-PR series; merge order dependency means delay cascades to #8647 and #8648.
- **#8725** — `/model` channel pinning failure ([link](https://github.com/agentscope-ai/QwenPaw/issues/8725), OPEN since 2026-11-13): No fix PR; critical for users whose pinned model fails and who cannot self-recover via chat.

</details>

<details>
<summary><strong>ZeroClaw</strong> — <a href="https://github.com/zeroclaw-labs/zeroclaw">zeroclaw-labs/zeroclaw</a></summary>

# ZeroClaw Project Digest — 2026-11-27

## 1. Today's Overview

ZeroClaw shows **high sustained activity** today, with 50 PRs and 13 issues updated in the last 24 hours — though only 2 PRs were merged/closed, indicating a heavily review-bound phase rather than a shipping one. The open PR queue is dominated by a single prolific contributor (CastelloBrancoTecnologia) pushing a large, interdependent credential-scoping and native-tooling series (SSH, WebDAV, browser, vault provisioning), many of which are XL-sized and risk:high. On the issue side, the newly opened **[Tracker]: Roadmap to v1.0.0 (#12712)** signals the project is formally planning its 1.0 stabilization. Three P1 bugs were closed today (image re-sending, markdown memory data loss, WebChat scroll), which is a positive stability signal, but several security-relevant credential PRs remain unmerged and in `needs-author-action`/`needs-maintainer-review` states.

## 2. Releases

**No new releases today.** The last shipped version referenced in issues is v0.8.3 (#9562), and the v1.0.0 roadmap tracker (#12712) confirms no release milestone has landed in this window.

## 3. Project Progress

Only 2 PRs were merged/closed in the last 24h, but 5 issues were closed, several of them substantive:

- **#11554 [CLOSED]** — Fixed phantom image re-sending: path-marker images were being replayed on every turn, causing the model to describe "new" images that weren't new. ([link](https://github.com/zeroclaw-labs/zeroclaw/issues/11554))
- **#10797 [CLOSED]** — Fixed **S0 data-loss** bug: `MarkdownMemory::store` silently dropped entries under concurrent writes due to unsynchronized whole-file rewrites. ([link](https://github.com/zeroclaw-labs/zeroclaw/issues/10797))
- **#9562 [CLOSED]** — Fixed WebChat auto-scroll overriding manual scroll during streaming. ([link](https://github.com/zeroclaw-labs/zeroclaw/issues/9562))
- **#11892 [CLOSED]** — Added configurable embedding prefix for instruction-tuned embedding models in memory recall. ([link](https://github.com/zeroclaw-labs/zeroclaw/issues/11892))
- **#11930 [CLOSED]** — Enabled longer synchronous agent calls through the gateway webhook without raising global route timeouts. ([link](https://github.com/zeroclaw-labs/zeroclaw/issues/11930))

**In-flight feature work** (unmerged but advancing): scoped Authorization Token credentials (#12490), scoped WebDAV remote files (#12695), scoped SSH password/TOTP auth (#12659), browser username/password + TOTP scoping (#12596), native Rust XMPP channel (#11847), and Codex subscription usage in web chat (#12691).

## 4. Community Hot Topics

- **[#5287](https://github.com/zeroclaw-labs/zeroclaw/issues/5287)** (11 comments, 2 👍) — *Define a compact `local_small` runtime profile and prompt-budget contract.* The most-discussed open issue. Underlying need: **local-first users want a lean, predictable prompt budget** with no permissive fallback parsing and no leakage of internal tool/system instructions into user-visible output. This reflects a tension between capability and cost/verbosity in local model deployments.
- **[#10635](https://github.com/zeroclaw-labs/zeroclaw/issues/10635)** (5 comments) — *Runtime profile cost limit does not reflect effective global daily budget.* A config/onboarding mismatch where a profile reports effectively unbounded cost but turns are rejected once the process-wide ledger exceeds $10/day. Underlying need: **coherent, non-contradictory cost governance** — users are confused by conflicting limits.
- **[#11554](https://github.com/zeroclaw-labs/zeroclaw/issues/11554)** (5 comments, now closed) — High-engagement architecture discussion around channel/provider image history handling.
- **[#12712](https://github.com/zeroclaw-labs/zeroclaw/issues/12712)** (2 comments, 1 👍, opened 2026-11-25) — **Roadmap to v1.0.0 tracker**, replacing the old FND-001 §6 version plan. Signals the community is watching release sequencing and intentional-architecture commitments.

## 5. Bugs & Stability

Ranked by severity (note: several were reported/closed this window):

| Severity | Issue | Status |
|---|---|---|
| **S0 — data loss** | [#10797](https://github.com/zeroclaw-labs/zeroclaw/issues/10797) markdown memory backend loses entries on overlapping `store()` calls | ✅ Closed |
| **S2 — degraded** | [#11554](https://github.com/zeroclaw-labs/zeroclaw/issues/11554) phantom image re-sends across turns | ✅ Closed |
| **S2 — degraded** | [#10635](https://github.com/zeroclaw-labs/zeroclaw/issues/10635) runtime profile cost limit vs. global daily budget mismatch | 🔴 Open (P1, in-progress, risk:high) |
| **S3 — minor** | [#12746](https://github.com/zeroclaw-labs/zeroclaw/issues/12746) chat box loses focus after turn ends post-reconnect | 🔴 Open |
| **S3 — minor** | [#12743](https://github.com/zeroclaw-labs/zeroclaw/issues/12743) context meter cells render at uneven heights on Windows Chrome | 🔴 Open |
| **CI/test** | [#12719](https://github.com/zeroclaw-labs/zeroclaw/issues/12719) macOS tunnel test fails on 200 ms timing window (fails on master) | 🔴 Open |

**Assessment:** The two most serious bugs (S0 data loss, S2 image replay) were closed today — a strong stability win. The remaining open P1 (#10635) is a config-coherence issue, not a crash. #12719 is notable because it fails on master, indicating a flaky/environment-sensitive test rather than a regression from any PR.

## 6. Feature Requests & Roadmap Signals

**Likely candidates for the next release** (active, accepted, or in-progress):

- **#5287** — `local_small` runtime profile + prompt-budget contract (status:accepted, in-progress, P2). Strong candidate for a local-first release theme.
- **Credential-scoping series** — #12408, #12481, #12482, #12490, #12517, #12596, #12659, #12695. A coherent "scoped credentials across HTTP/browser/SSH/vault/WebDAV" epic. If merged as a bundle, it would be a **major security/operability milestone**.
- **#11847** — Native Rust XMPP channel with optional legacy OMEMO (channels expansion).
- **#12691** — Codex subscription usage surfaced in web chat (observability/UX).
- **#12712** — Roadmap tracker itself will shape the next version's scope; worth watching for the release cadence it commits to.

**Prediction:** Given the volume of `risk:high` XL credential PRs sitting in review, the next release is more likely to be a **security/credentials consolidation release** than a feature-breadth release — unless the v1.0.0 tracker explicitly sequences otherwise.

## 7. User Feedback Summary

- **Local-first pain (prompt bloat & leakage):** #5287 captures a real dissatisfaction — local model users find prompts bloated, fallback parsing too permissive, and internal instructions leaking into output.
- **Cost-governance confusion:** #10635 shows users hitting contradictory budget signals (unbounded profile vs. $10/day global cap), causing rejected turns with no clear explanation.
- **Trust in memory persistence:** #10797 (S0 data loss) was a serious confidence hit for anyone relying on the markdown memory backend; its closure restores trust.
- **WebChat UX friction:** #9562 (scroll hijack) and #12746 (focus loss on reconnect) reflect operator frustration with streaming/reconnection ergonomics.
- **Platform polish gaps:** #12743 (Windows Chrome rendering) shows cross-platform UI attention is still needed.

Overall sentiment skews **constructive** — users are filing precise, reproducible reports (many tagged `reported by agent`), which indicates an engaged, technically sophisticated community.

## 8. Backlog Watch

Items needing maintainer attention:

- **[#5287](https://github.com/zeroclaw-labs/zeroclaw/issues/5287)** — Open since **2026-04-04** (7+ months), 11 comments, accepted/in-progress but still unresolved. High community interest; deserves a decision or milestone assignment.
- **[#10635](https://github.com/zeroclaw-labs/zeroclaw/issues/10635)** — Open since 2026-09-05, P1, risk:high, no linked fix PR visible. A cost-governance correctness issue that should not linger.
- **Large credential PR series** — [#12490](https://github.com/zeroclaw-labs/zeroclaw/pull/12490), [#12322](https://github.com/zeroclaw-labs/zeroclaw/pull/12322) (SQLite security upgrade), [#11847](https://github.com/zeroclaw-labs/zeroclaw/pull/11847) (XMPP) — flagged `needs-author-action` / `needs-maintainer-review` / `risk:high`. #12322 in particular is a **dependency security upgrade** (bundled SQLite + Matrix SDK 0.20.0) that shouldn't sit unreviewed.
- **[#12459](https://github.com/zeroclaw-labs/zeroclaw/pull/12459)** — `status:blocked`, `do-not-merge` browser voice for OIDC sessions; blocked dependency should be tracked.
- **[#12719](https://github.com/zeroclaw-labs/zeroclaw/issues/12719)** — Failing on master; needs a fix or quarantine to keep CI green.

**Bottom line:** ZeroClaw is in a healthy, high-velocity but review-constrained phase. The closure of an S0 data-loss bug and two S2 bugs today is a strong stability signal, while the credential-scoping epic and the v1.0.0 roadmap tracker define the project's near-term trajectory. The main risk to momentum is the growing queue of high-risk, unmerged PRs awaiting maintainer review.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*