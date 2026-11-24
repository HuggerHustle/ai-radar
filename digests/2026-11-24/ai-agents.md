# OpenClaw Ecosystem Digest 2026-11-24

> Issues: 500 | PRs: 500 | Projects covered: 5 | Generated: 2026-11-24 05:16 UTC

- [OpenClaw](https://github.com/openclaw/openclaw)
- [Hermes Agent](https://github.com/nousresearch/hermes-agent)
- [IronClaw](https://github.com/nearai/ironclaw)
- [QwenPaw](https://github.com/agentscope-ai/QwenPaw)
- [ZeroClaw](https://github.com/zeroclaw-labs/zeroclaw)

---

## OpenClaw Deep Dive

# OpenClaw Project Digest — 2026-11-24

## 1. Today's Overview

OpenClaw shows **very high development velocity** with 500 issues and 500 PRs updated in the last 24 hours, plus two new beta releases in the `2026.11.10` line. The project is in an active stabilization phase around update reliability, session-state integrity, and delegated-work correctness — themes that dominate both the release notes and the top issues. However, the backlog carries a meaningful volume of **P0/P1 regressions** (e.g., gRPC tool-execution failure, `claude-cli` session leaks, Discord provider init hangs) that are gating release confidence. Issue hygiene is also a concern: many of the highest-comment issues are tagged `stale` and `clawsweeper:needs-maintainer-review`, indicating a growing triage debt even as fixes land. Overall: **healthy throughput, strained review/merge capacity**.

## 2. Releases

Two beta releases shipped, both centered on **update recovery** and **reliable delegated work**.

### v2026.11.10-beta.3
- **Update recovery:** Interrupted package and source updates are now recoverable, including updates that cross a schema change or a machine restart. (#200273, #200366, #200460, #200866, #200994, #201600) — Thanks @fuller-stack-dev
- **Reliable delegated work:** continued hardening of background/helper task completion.

### v2026.11.10-beta.2
- **Update recovery:** OpenClaw remains runnable when package replacement is interrupted; the next update can finish safely after crash/reboot. (#200273, #200366, #200460, #200550, #200994)
- **Reliable background work:** preserves finished background work across interruptions.

**Migration notes:** No explicit breaking changes declared, but beta.2/beta.3 both target schema-crossing updates — operators on older checkouts (e.g., builds from 2026-11-17 to 2026-11-19) may need the automated checkout update path (see PR #204322). A related open bug (**#203442**) reports a Doctor failure on the `2026.11.4 → 2026.11.10-beta.1` activation path (`Plugin deepseek Doctor source must be prepared before loading`), so early adopters should expect friction.

## 3. Project Progress

**205 PRs merged/closed** in the last 24h. Notable closed/advanced work from the visible window:

- **#204313 (CLOSED)** — `fix(agents): keep the replayed user turn in history after compaction`. Fixes hidden user-turn accumulation across mid-turn compaction retries. This directly addresses a class of transcript-bloat and cache-invalidation complaints.
- **#203967 / #203969 / #203865 (CLOSED)** — a cluster of Web-UI polish fixes (command-palette attachment spacing, sidebar loading-row alignment, composer file-icon background).
- **#202379 (CLOSED)** — *Lean: measure and ship further lean-only memory reductions* — advances the memory-footprint reduction track (prototype idles ~528 MiB vs. 419 MiB on v2026.7.1).
- **In-flight but advanced:** PR **#204322** finishes early Git-checkout updates automatically instead of requiring a rebuild; PR **#203469** and **#203477** fix primary-model retry logic after local dispatch failures; PR **#199842** fixes SQLite TEMP-view invalidation of sibling readers.
- A large batch of Web-UI "readable tool activity" PRs (#204399–#204409) is improving chat legibility for platform/media/memory/browser actions.

## 4. Community Hot Topics

| Item | Comments | Theme |
|---|---|---|
| [#182891](https://github.com/openclaw/openclaw/issues/182891) — Prompt cache never reused (`cache read dropped N -> 0`) | 27 | Cost/latency |
| [#157989](https://github.com/openclaw/openclaw/issues/157989) — Plugin source capture rewrites 1.1–6.5 GB per start (SSD wear) | 24 | Resource/disk |
| [#143017](https://github.com/openclaw/openclaw/issues/143017) — Five ways a persistent session rewrites its prefix (21.3M cache-write tokens) | 19 | Cost |
| [#196199](https://github.com/openclaw/openclaw/issues/196199) — Codex helper completions fail to resume parent | 17 | Delegation |
| [#186683](https://github.com/openclaw/openclaw/issues/186683) — claude-cli prompt cache rewritten when turn surface changes | 7 | Cost |

**Underlying needs:** The single most persistent community theme is **prompt-cache economics**. Multiple independent reports (#182891, #143017, #186683) converge on the same root cause family — envelope rewrites, `runtimeContextCarrier` changes, and per-turn prefix instability — inflating token cost dramatically. This is arguably the highest-value stability track for real-world users and is cross-referenced heavily. Second is **plugin-runtime I/O efficiency** (#157989, #181784), where every gateway start recaptures plugin bytes.

## 5. Bugs & Stability

**P0 / release-blocker:**
- **[#203869](https://github.com/openclaw/openclaw/issues/203869)** — `Tool execution fails: gRPC code-mode session closed / BrokenPipe` (regression, macOS mini). **No fix PR linked.** Highest-severity open regression today.
- **[#202518](https://github.com/openclaw/openclaw/issues/202518)** — `claude-cli` run never closes after `sessions_spawn` + `sessions_yield`; later turns reuse the dead live session.
- **[#201468](https://github.com/openclaw/openclaw/issues/201468)** — macOS launch alert shows generic credential recovery when bundled CLI refuses schema migration.

**P1:**
- **[#196199](https://github.com/openclaw/openclaw/issues/196199)** — Codex helper completions fail to resume parent (regression since 2026.10.10).
- **[#191476](https://github.com/openclaw/openclaw/issues/191476)** — Matrix room stuck on "Plugin matrix consumer is closed" after image_generate race.
- **[#204283](https://github.com/openclaw/openclaw/issues/204283)** — Discord provider never reaches client init on 2026.11.7 with `commands.nativeSkills` enabled (silent restart loop). **Regression, no fix PR yet.**
- **[#195497](https://github.com/openclaw/openclaw/issues/195497)** — Gateway memory growth to ~3 GB in 17h (v2026.11.1).
- **[#201974](https://github.com/openclaw/openclaw/issues/201974)** — Direct npm install leaves broken plugin-skills junctions; gateway refuses to start.
- **[#195279](https://github.com/openclaw/openclaw/issues/195279)** (CLOSED) — Background exec wake fails with "operator execution authority is no longer active."

**P2 (selection):** #161158 (`gateway restart` false-failure), #189206 (stale CLI device token loop), #183048 (outbound queue `unknown_after_send` unmanageable), #143973 (base64 image blobs = 80% of transcript store).

**Assessment:** Several P1 items have **linked fix PRs open** (e.g., #177633, #165615), but the P0 gRPC failure and the Discord init regression currently lack fixes — these are the items to watch for the next release gate.

## 6. Feature Requests & Roadmap Signals

- **[#116052](https://github.com/openclaw/openclaw/issues/116052)** — MCP OAuth pre-registered clients (no DCR). Security-reviewed; likely to land in an MCP-auth release.
- **[#181784](https://github.com/openclaw/openclaw/issues/181784)** — Content-addressed plugin source store reused across restarts. Strong candidate to pair with #157989 fix.
- **[#6757](https://github.com/openclaw/openclaw/issues/6757)** — Agent-triggered self-compaction tool (2 👍). Ties into cache/context economics.
- **[#166586](https://github.com/openclaw/openclaw/issues/166586)** — Consume MCP Events and start an agent run per event.
- **[#136271](https://github.com/openclaw/openclaw/issues/136271)** — Dynamic SharePoint site resolution for Teams file uploads.
- **[#167341](https://github.com/openclaw/openclaw/issues/167341)** — Operator-overridable user-facing failure copy.

**Prediction:** Given the release-notes emphasis on update recovery and the volume of cache/plugin-capture work in flight, expect **plugin capture reuse (#181784)**, **update-path hardening**, and possibly **self-compaction (#6757)** to surface in the next minor line. MCP OAuth pre-registered clients (#116052) is gated on security review but has clear momentum.

## 7. User Feedback Summary

**Pain points dominating user reports:**
1. **Token cost unpredictability** — users can measure cache-write waste precisely (21.3M tokens; 352 events = 80% of a 564 MB store). This is the loudest, best-evidenced complaint.
2. **Resource strain on hosts** — multi-GB plugin recaptures, SSD wear, 3 GB gateway memory growth, 128s DB integrity checks (#161403).
3. **Delegated-work fragility** — Codex/ACP helper runs losing results, session-writer claim races, orphaned "running" sessions persisting for weeks (#188377).
4. **Update/install reliability** — a recurring cluster (#187917, #186326, #203442, #201974, #200747) across Linux ARM64, Windows, and npm-global installs, though the new betas directly target this.

**Satisfaction signals:** Users are clearly invested — many file detailed production repros and even contribute fix PRs. Dissatisfaction is concentrated in **cost attribution** (delegated child runs recorded as $0 while spending $14.14, #130257) and **unrecoverable states** (stale tokens, orphaned sessions, undeliverable failure alerts).

## 8. Backlog Watch

Items needing maintainer attention (high-value, long-open, or stalled):

- **[#55792](https://github.com/openclaw/openclaw/issues/55792)** (P1, opened 2026-03-27) — Catch up on missed inbound messages after gateway restart. Message-loss risk; stale.
- **[#143375](https://github.com/openclaw/openclaw/issues/143375)** (diamond lobster, stale) — Scanned PDFs unreachable without a vision model.
- **[#130257](https://github.com/openclaw/openclaw/issues/130257)** (P2, stale) — Tasks ledger records no tokens/cost for delegated ACP runs (child spend unattributable).
- **[#161158](https://github.com/openclaw/openclaw/issues/161158)** — `gateway restart` false failure with hardcoded 60s budget; `needs-product-decision`.
- **[#138366](https://github.com/openclaw/openclaw/issues/138366)** (CLOSED today) — Dreams-page memory-slot ownership; watch for follow-up.
- **[#181784](https://github.com/openclaw/openclaw/issues/181784)** — Plugin capture reuse; `needs-product-decision`, high impact.
- **PR [#197030](https://github.com/openclaw/openclaw/pull/197030)** — Codex plugin-tool denies disabling unrelated native apps; `merge-risk: security-boundary`, awaiting proof.

**Health note:** A large share of top-comment issues carry `clawsweeper:no-new-fix-pr` and `stale` labels. While automation is triaging effectively, the **maintainer-review queue appears to be the primary bottleneck** — many well-reproduced, high-impact reports (cache economics, plugin I/O, delegated-run accounting) are waiting on product/security decisions rather than engineering effort. Prioritizing decisions on the cache-economics cluster and the plugin-capture store would likely yield the largest stability-and-cost return for the next release cycle.

---

## Cross-Ecosystem Comparison

# Cross-Project Comparison Report: AI Agent & Personal Assistant Open-Source Ecosystem
**Date:** 2026-11-24 | **Sources:** OpenClaw, Hermes Agent, IronClaw, QwenPaw, ZeroClaw community digests

---

## 1. Ecosystem Overview

The personal AI assistant / agent open-source landscape is consolidating around a shared set of hard problems — **prompt-cache economics, session-state integrity, delegated-work reliability, and credential/memory trust boundaries** — rather than differentiating on raw capability. Mature projects (OpenClaw, ZeroClaw) are shifting from feature velocity to **stabilization and security architecture** (scoped credentials, cache reuse, update recovery), while younger projects (QwenPaw, Hermes Agent) remain in rapid feature-and-fix cycles. A clear **maintainer-review bottleneck** has emerged across nearly every project: high PR-to-merge ratios (OpenClaw and Hermes both show ~46 open PRs vs. ~4–5 merged) suggest the ecosystem is now constrained by review bandwidth, not engineering supply. Cross-tool signals — notably skills-repo contamination between Hermes and OpenClaw — indicate the ecosystem is beginning to require **interoperability and isolation primitives** it did not need a year ago.

---

## 2. Activity Comparison

| Project | Issues (updated/24h) | PRs (updated/24h) | PRs Merged/Closed | Release Status | Health Score* |
|---|---|---|---|---|---|
| **OpenClaw** | 500 | 500 | 205 | 2 betas (`2026.11.10-beta.2/.3`) | **7.5/10** — high velocity, triage debt |
| **Hermes Agent** | 50 | 50 | 4 (46 open) | 1 canary (`v0.23.3`) | **7.0/10** — review bottleneck |
| **IronClaw** | 0 | 0 | 0 | None | **N/A** — dormant |
| **QwenPaw** | 22 (16 open / 6 closed) | 36 (30 open / 6 merged) | 6 | None (post-beta window) | **7.8/10** — responsive, silent-failure risk |
| **ZeroClaw** | 50 (22 open / 28 closed) | 50 (45 open) | 5 | None (no cut since v0.8.7) | **6.5/10** — merge-constrained, S1 cluster open |

\*Health score is a qualitative composite of velocity, merge throughput, open-regression severity, and review backlog. Higher = healthier balance of throughput and responsiveness.

**Key observations:**
- **OpenClaw** operates at an order of magnitude greater scale than peers (500 vs. 50 updated items), confirming its role as the de facto core reference.
- **ZeroClaw and Hermes** carry the sharpest merge bottlenecks (5 and 4 merges against ~45+ open PRs respectively).
- **QwenPaw** shows the best merge responsiveness relative to its size (6 merged, multiple first-time-contributor PRs landing).
- **IronClaw** is effectively inactive and excluded from further analysis.

---

## 3. OpenClaw's Position

**Advantages vs. peers:**
- **Ecosystem gravity:** 10× the issue/PR throughput of any peer, making it the upstream that others integrate with (Hermes explicitly tracks OpenClaw skill-repo conflicts).
- **Release discipline:** Only project shipping tagged releases (two betas in 24h), with explicit migration notes and update-recovery hardening — peers have shipping backlogs (ZeroClaw has 12+ fixes merged to `master` unreleased).
- **Breadth of hardening:** Solves across cache, memory, update-path, and delegation simultaneously, whereas peers focus on narrower slices.

**Technical approach differences:**
- OpenClaw emphasizes **plugin capture/content-addressing and update-path resilience** (#181784, #204322) — infrastructure-layer concerns.
- Peers like Hermes converge on **compaction correctness and manifest-driven model catalogs** — higher-level agent-behavior concerns.
- ZeroClaw pursues **credential brokering** (RFC #12422) — a security-architecture direction OpenClaw has not yet prioritized publicly.

**Community size comparison:**
- OpenClaw's top issues reach **27 comments** (cache economics #182891) vs. Hermes' top RFC at 45 comments — Hermes has *deeper* engagement per-thread but on a much smaller base. ZeroClaw's hottest item reaches 16 comments; QwenPaw's ~5. This suggests **OpenClaw has breadth of users, Hermes has concentrated architectural advocates, and ZeroClaw has a small but prolific contributor core.**

---

## 4. Shared Technical Focus Areas

Requirements emerging across **multiple** projects, ranked by cross-project prevalence:

| Need | Projects | Specific Manifestations |
|---|---|---|
| **Prompt-cache / token-cost economics** | OpenClaw (#182891, #143017, #186683), QwenPaw (#8060 Anthropic cache tokens) | Prefix instability, envelope rewrites, cache-read drops to zero; 21.3M wasted tokens reported |
| **Session-state integrity & leakage** | OpenClaw (#202518, #188377), Hermes (#159395, #159438, #158221), ZeroClaw (#11896) | Orphaned sessions, duplicate side effects after gateway death, cron-session leaks |
| **Memory trust & provenance** | Hermes (#31584, #143379), QwenPaw (#8867) | Recalled memory indistinguishable from user input; silent backend fallback |
| **Streaming/delegation resilience** | QwenPaw (#8864, #8877), OpenClaw (#196199), Hermes (#159438) | Retries bypassed after partial emission; delegated runs lose results |
| **Silent failures** | ZeroClaw (#12390, #12203, #12666), QwenPaw (#8814, #8875) | Stderr swallowed, tools compiled out, channel death with no user-visible error |
| **Plugin/skill isolation** | Hermes (#17345), QwenPaw (#8554, #8764), OpenClaw (#157989, #181784) | Cross-tool contamination, GB-scale recaptures, SDK permission scoping |
| **Credential/secret safety** | ZeroClaw (#12422), OpenClaw (#116052 MCP OAuth) | Agents must *use* secrets without *seeing* them |
| **Console/UI rendering correctness** | QwenPaw (#8811, #8845, #8852) | Wide-table clipping, iOS WebKit freeze, keyboard accessibility |

**Convergent signal:** Across four independent projects, users are demanding **observability of failure** — silent degradation (channel death, tool compilation-out, retry bypass) is the most consistently cited frustration. This is a maturity inflection: the ecosystem is moving from "does it work?" to "can I trust it in production?"

---

## 5. Differentiation Analysis

| Dimension | OpenClaw | Hermes Agent | QwenPaw | ZeroClaw |
|---|---|---|---|---|
| **Primary focus** | Core agent runtime + plugin infra | Agent architecture/RFCs (memory substrate) | Console UX + plugin SDK | Security architecture (credential brokering) |
| **Target users** | Broad developers, integrators | Architecturally sophisticated self-hosters | Desktop/mobile end-users + contributors | Production multi-tenant operators |
| **Architecture emphasis** | Update-path resilience, content-addressed plugins | Compaction correctness, manifest-driven catalogs | Channel isolation, Tauri desktop reach | Scoped credentials, native channel breadth |
| **Release cadence** | Fast beta line | Canary → stable | Post-patch/beta | Stalled since v0.8.7 |
| **Distinctive bet** | Ecosystem core reference | Long-term memory substrate (#143379) | Plugin platform (SDK 1.2) | Secret-use-without-see model |
| **Geographic signal** | English-dominant | Notable Chinese-language threads | CJK localization focus (#8133) | Global, Android/Termux interest |

**Interpretation:** OpenClaw competes on **breadth and reliability**; Hermes on **architectural depth (memory)**; QwenPaw on **polish and platform reach**; ZeroClaw on **security and channel comprehensiveness**. There is surprisingly little direct feature overlap — the projects are differentiated by *layer* (runtime vs. memory vs. UI vs. security) more than by *capability*.

---

## 6. Community Momentum & Maturity

**Activity tiers:**

- **Tier 1 — Ecosystem core:** **OpenClaw** (500+ daily items). Rapidly iterating in scale, but stabilizing around update/session/cache reliability.
- **Tier 2 — Active specialists:** **Hermes Agent** and **ZeroClaw** (~50 daily items each). Both **rapidly iterating on features but merge-constrained** — the defining health risk is review bandwidth, not engineering.
- **Tier 3 — Focused maintainers:** **QwenPaw** (~22 issues, 36 PRs). **Responsive and stabilizing**, with maintainers closing reports within 24h and first-time contributors actively landing.
- **Tier 4 — Dormant:** **IronClaw** (no activity).

**Maturity signals:**
- **Stabilizing projects** (OpenClaw, QwenPaw) show fix-PRs accompanying regressions and explicit migration notes — hallmarks of release discipline.
- **Iterating projects** (Hermes, ZeroClaw) show accumulating XL PR backlogs (ZeroClaw has PRs open since Oct 19–27; Hermes has 46 open vs. 4 merged) — a **contributor-burnout risk** flagged explicitly in ZeroClaw's digest.
- **Momentum concentration:** ZeroClaw's security push is driven largely by *one prolific contributor* (CastelloBrancoTecnologia) — a single-point-of-failure risk.

**Maturity verdict:** OpenClaw is the most *operationally* mature; QwenPaw is the most *responsively* mature; Hermes is the most *architecturally* ambitious; ZeroClaw is the most *security-forward* but the most merge-constrained.

---

## 7. Trend Signals

**Industry trends extracted from cross-project community feedback:**

1. **Cost observability is the new table stakes.** Users across OpenClaw and QwenPaw measure cache-write waste precisely (21.3M tokens; 80% of a 564 MB store). **Developers should ship per-turn cost attribution and cache-hit telemetry** — opaque spend is the loudest complaint.

2. **The "silent failure" problem is the #1 trust blocker.** ZeroClaw, QwenPaw, and OpenClaw all report tools/channels failing without surfaced errors. **Invest in loud, actionable failure copy and self-healing state machines** — this is higher-leverage than new features.

3. **Memory trust models are an unsolved security frontier.** Hermes (#31584) and QwenPaw (#8867) both surface memory-as-authoritative-input and silent-backend-fallback risks. **Agent developers should treat recalled memory as untrusted, provenance-tagged context**, not user-equivalent input.

4. **Credential brokering is the next security architecture.** ZeroClaw's RFC #12422 and OpenClaw's MCP OAuth (#116052) point the same direction: **agents must use secrets without exposing them**. This will likely become a compliance requirement for production deployments.

5. **Interoperability/isolation between tools is emerging as a real pain.** Cross-tool skill contamination (Hermes #17345) signals that **multi-agent users need skill/plugin isolation primitives** — a gap no single project has cleanly solved.

6. **Plugin platforms are the leading roadmap bet.** QwenPaw (SDK 1.2, CLI commands), OpenClaw (content-addressed store), and ZeroClaw (extension points) all invest here — **extensibility via scoped, permissioned plugins** is the consensus growth vector.

7. **Review bandwidth, not engineering, is the ecosystem bottleneck.** Across OpenClaw, Hermes, and ZeroClaw, merge throughput lags PR creation. **Projects that solve triage/review scaling (automation, CODEOWNERS, dedicated reviewers — see Hermes #23632) will out-compete peers on time-to-stable.**

**Value for AI agent developers:** Prioritize (a) cost/cache telemetry, (b) surfaced-failure UX, (c) memory trust tagging, and (d) scoped plugin/credential permissions. These four investments map directly to the highest-volume, best-evidenced community pain points and are portable across all major projects.

---

*Report compiled from 24h community digests ending 2026-11-24. IronClaw excluded from comparative scoring due to inactivity.*

---

## Peer Project Reports

<details>
<summary><strong>Hermes Agent</strong> — <a href="https://github.com/nousresearch/hermes-agent">nousresearch/hermes-agent</a></summary>

# Hermes Agent — Project Digest
**Date:** 2026-11-24
**Repository:** [github.com/nousresearch/hermes-agent](https://github.com/nousresearch/hermes-agent)

---

## 1. Today's Overview

Hermes Agent remains highly active, with **50 issues** and **50 PRs** updated in the last 24 hours. The project is in a healthy but backlog-heavy state: of the 50 updated issues, only 17 were closed, and of the 50 updated PRs, just 4 were merged or closed — indicating a large open-review queue (46 open PRs). A new canary release (**v0.23.3+canary.20261123T065600Z**) shipped, continuing the rapid canary cadence. Activity is skewed toward bug fixes and stability hardening (memory leaks, session state, macOS packaging, compression correctness), with a notable cluster of macOS desktop/install-update fixes landing around release promotion. Overall project velocity is strong, though the open-to-merged ratio suggests maintainer review bandwidth may be the current bottleneck.

---

## 2. Releases

### 🆕 canary.20261123T065600Z-v0.23.3
- **Version:** Hermes Agent v0.23.3 (canary)
- **Release Date:** November 23, 2026
- **Type:** Canary pre-release
- **Contents:** Build artifact release with Hermes Desktop downloads (macOS Apple Silicon DMG, etc.) via the `HERMES_BUILDS_TABLE` manifest.
- **Breaking changes / migration notes:** None documented in the release metadata. This is a canary channel build; users on stable should not auto-migrate.

> The release is primarily a distribution/build refresh rather than a feature release. No deprecations or migration steps are indicated.

---

## 3. Project Progress

Only **4 PRs** were merged/closed in the last 24h — a light merge day relative to the 46 open PRs. Highlights:

| PR | Title | Status | Notes |
|---|---|---|---|
| [#124586](https://github.com/NousResearch/hermes-agent/pull/124586) | feat(webhook): accept `Authorization: Bearer` as plain-compare auth header | **CLOSED** | Consolidates webhook auth models; long-running security PR resolved. |
| [#158049](https://github.com/NousResearch/hermes-agent/pull/158049) | Mac update from disk image/Downloads no longer quits without installing | OPEN (updated) | Core macOS update-path fix by `teknium1`. |
| [#159469](https://github.com/NousResearch/hermes-agent/pull/159469) | feat(release): publish stable macOS DMG alias + downloads page on promotion | OPEN | Release-infra improvement. |
| [#159483](https://github.com/NousResearch/hermes-agent/pull/159483) | fix(desktop): offer to move packaged macOS bundles to Applications | OPEN | Fixes read-only launch/update failures. |

**Feature advancement themes:**
- **Model catalog extensibility** — PRs [#157316](https://github.com/NousResearch/hermes-agent/pull/157316) and [#157320](https://github.com/NousResearch/hermes-agent/pull/157320) let already-installed releases pick up new models *and* per-token pricing from the remote manifest (not just OpenRouter/Nous).
- **Compaction correctness** — [#159471](https://github.com/NousResearch/hermes-agent/pull/159471) preserves "Open Commitments" across compaction; [#159387](https://github.com/NousResearch/hermes-agent/pull/159387) retries summaries flat when endpoints reject role-typed turns.
- **Platform integrations** — Mattermost native exec-approval buttons ([#124063](https://github.com/NousResearch/hermes-agent/pull/124063)), ChatGPT four-layer connection ([#159485](https://github.com/NousResearch/hermes-agent/pull/159485)).

---

## 4. Community Hot Topics

Ranked by comment count:

### 🥇 [#143379](https://github.com/NousResearch/hermes-agent/issues/143379) — RFC: THE DOC-CHAIN SUBSTRATE'S NETWORK (45 comments)
- **Labels:** `type/security, comp/agent, comp/tools, tool/file, tool/memory, P4, area/compression`
- **Author:** c0wb0yp0tat0 | Open since 2026-10-23
- **Underlying need:** Users want a **durable, compressed, provenance-preserving record** that survives session compression and can be re-read instead of forcing the user to repeat context. This is the single most-discussed item — a sign the community is pushing for a first-class "long-term memory substrate" architecture.

### 🥈 [#31584](https://github.com/NousResearch/hermes-agent/issues/31584) — Treat memory-context as background, not authoritative user content (14 comments)
- **Labels:** `type/bug, comp/agent, tool/memory, P3`
- **Underlying need:** Prompt-injection / trust-boundary concern — recalled memory should not be indistinguishable from genuine user messages. Strong signal for a **memory trust model**.

### 🥉 [#17199](https://github.com/NousResearch/hermes-agent/issues/17199) — deepseek provider normalization breaks custom endpoints (10 comments) — **CLOSED**
- **Underlying need:** Flexible OpenAI-compatible custom endpoints (e.g., Volcengine ARK). Closing this resolves a major self-hosting blocker.

### Other notable threads
- [#17345](https://github.com/NousResearch/hermes-agent/issues/17345) — Skills repo "pollution" between Hermes and OpenClaw (8 comments, Chinese). Cross-tool skill isolation is a real operational pain.
- [#38048](https://github.com/NousResearch/hermes-agent/issues/38048) — `url_safety` false-positives on DNS64/NAT64 (`64:ff9b::/96`) addresses (7 comments). Networking correctness for IPv6-transition environments.
- [#38275](https://github.com/NousResearch/hermes-agent/issues/38275) — HAMP proposal: agent addressing + async messaging + crypto identity (6 comments). Ambitious roadmap signal for **A2A-style agent networking**.

---

## 5. Bugs & Stability

Ranked by severity (P2 highest seen today):

| Severity | Issue | Summary | Fix PR? |
|---|---|---|---|
| **P2** | [#159438](https://github.com/NousResearch/hermes-agent/issues/159438) | After gateway death mid-command, resumed session loses the call and models **re-run** it (duplicate side effects). | No |
| **P2** | [#159395](https://github.com/NousResearch/hermes-agent/issues/159395) | Agent-mode cron jobs **leak an empty open session** per gated fire → saturates gateway event loop. | No |
| **P2** | [#158293](https://github.com/NousResearch/hermes-agent/issues/158293) | Desktop remote clients render older replies **duplicated out of order** after newer turns. | No |
| **P2** | [#158221](https://github.com/NousResearch/hermes-agent/issues/158221) | Fleet-restart obligation **can never clear** on single-gateway Linux host (self-inflicted `stopped_unmapped` row). | No |
| **P2** | [#158318](https://github.com/NousResearch/hermes-agent/issues/158318) | Kanban dispatcher: stale rate-limit text traps card in `blocker_auth` **forever, 0 workers spawned**. | No |
| **P2** | [#150969](https://github.com/NousResearch/hermes-agent/issues/150969) | Plugin hub reparses catalog for unrelated installs (**93s list / 30s RPC timeout**). | No |
| **P2** | [#24782](https://github.com/NousResearch/hermes-agent/issues/24782) | Subagent fallback uses **parent's base_url** instead of fallback's. | CLOSED |
| **P2** | [#24092](https://github.com/NousResearch/hermes-agent/issues/24092) | `fallback_providers` + custom base_url falls back to OpenRouter unexpectedly. | CLOSED |
| **P2** | [#14614](https://github.com/NousResearch/hermes-agent/issues/14614) | `resolve_alias()` returns wrong provider when multiple providers share a model ID. | CLOSED |

**Stability themes:**
- **Session/state leakage** (cron sessions, gateway death, restart obligations) is the dominant class — three P2 bugs point at lifecycle management.
- **Resource leaks**: memory-provider leak ([#155749](https://github.com/NousResearch/hermes-agent/pull/155749), unbounded fd/SQLite connections) has an open fix PR.
- Several provider/base_url bugs closed today (good sign of convergence).

---

## 6. Feature Requests & Roadmap Signals

### High-signal feature requests
- **[#38275](https://github.com/NousResearch/hermes-agent/issues/38275) — HAMP: Agent Address System + Async Messaging + Cryptographic Identity.** Most architecturally ambitious request this period; addresses A2A gaps (no addressing, no offline inbox, no crypto identity).
- **[#103368](https://github.com/NousResearch/hermes-agent/issues/103368) — Antigravity/Gemini ACP support.** Provider expansion; Antigravity is in official docs & ACP registry but not fully wired.
- **[#34625](https://github.com/NousResearch/hermes-agent/issues/34625) — Plain-English semantic reasons in permission prompts.** 👍 3 — transparency/UX for approvals.
- **[#41371](https://github.com/NousResearch/hermes-agent/issues/41371) — WhatsApp group sender-level allowlist.** 👍 2 — access-control parity with DMs.
- **[#10561](https://github.com/NousResearch/hermes-agent/issues/10561) — Custom runtime support for Docker sandboxing** (gVisor/MAGI multi-agent isolation).
- **[#38687](https://github.com/NousResearch/hermes-agent/issues/38687) — Preserve skill install review in TUI-gateway** (CVSS 5.5 / 6.8 medium).

### Prediction — likely in next version(s)
1. **Manifest-driven model catalog & pricing** ([#157316](https://github.com/NousResearch/hermes-agent/pull/157316), [#157320](https://github.com/NousResearch/hermes-agent/pull/157320)) — PRs are open and well-scoped; strong candidate for next canary→stable.
2. **Compaction hardening** ([#159471](https://github.com/NousResearch/hermes-agent/pull/159471), [#159387](https://github.com/NousResearch/hermes-agent/pull/159387)) — directly tied to the top RFC discussion.
3. **macOS release/update polish** — a coordinated cluster of PRs from `BearHuddleston`/`teknium1` suggests an upcoming stable desktop release.
4. **Mattermost native approvals** ([#124063](https://github.com/NousResearch/hermes-agent/pull/124063)) — parity catch-up for a lagging platform.

---

## 7. User Feedback Summary

**Pain points (dissatisfaction):**
- **Memory trust & safety** — users report agents treating recalled memory as authoritative user input (#31584), a prompt-injection surface.
- **Cross-tool contamination** — skills from OpenClaw appearing inside Hermes (#17345), confusing users about what's actually installed.
- **Session/state fragility** — gateway death or restart cycles cause duplicated commands, leaked sessions, and permanently stuck cards (#159438, #159395, #158221, #158318).
- **Performance at scale** — plugin hub `list` taking 93s and hitting RPC timeouts (#150969); profile config re-parsing (#159486).
- **Provider configuration friction** — custom endpoints (Volcengine ARK, fallback base_urls) misbehaving, though several are now fixed.

**Positive/use cases:**
- Multi-agent sandboxing in production (gVisor MAGI setup, #10561) shows Hermes being used in serious self-hosted deployments.
- Users actively building recurring automation (MiniMax token-plan cron checkers, #24284) — the agent is trusted for scheduled work.
- Community is proposing **protocol-level extensions** (HAMP), a strong maturity signal.

**Satisfaction:** Generally constructive; users invest effort in detailed RFCs and CVSS-style write-ups (e.g., #38687, #23632), indicating an engaged, technically sophisticated community rather than churn.

---

## 8. Backlog Watch

Long-open or high-value items needing maintainer attention:

| Item | Age | Why it matters |
|---|---|---|
| [#143379](https://github.com/NousResearch/hermes-agent/issues/143379) RFC doc-chain substrate | **~1 month**, 45 comments | Top-discussed; architectural direction-setting needs an owner decision. |
| [#31584](https://github.com/NousResearch/hermes-agent/issues/31584) Memory as background context | **~6 months** | Security/trust boundary; high comment count, no resolution. |
| [#38275](https://github.com/NousResearch/hermes-agent/issues/38275) HAMP agent addressing | Since 2026-06-03 | Ambitious roadmap; needs "accepted/deferred" triage. |
| [#10561](https://github.com/NousResearch/hermes-agent/issues/10561) Custom Docker sandbox runtime | ~7 months | Blocks hardened multi-agent isolation use cases. |
| [#155749](https://github.com/NousResearch/hermes-agent/pull/155749) Memory-provider fd leak fix | Open | P2 resource leak with a ready fix — should be reviewed/merged. |
| [#124063](https://github.com/NousResearch/hermes-agent/pull/124063) Mattermost native approvals | Since 2026-09-26 | Flagged `needs-decision`; platform parity stalled. |
| [#23632](https://github.com/NousResearch/hermes-agent/issues/23632) Missing CODEOWNERS / workflow protection | ~6 months | Verified medium security finding; quick win, still open. |

---

### Health Snapshot
- **Velocity:** High activity, but **46 open PRs vs. 4 merged** → review bottleneck.
- **Quality:** Strong security/perf rigor in reports (CVSS, repro steps).
- **Risk:** Clustering of P2 session/lifecycle bugs warrants a stabilization sprint before the next stable cut.
- **Momentum:** Manifest-driven catalog + compaction + macOS releases form a coherent near-term roadmap.

*Data source: GitHub activity for NousResearch/hermes-agent, 24h window ending 2026-11-24.*

</details>

<details>
<summary><strong>IronClaw</strong> — <a href="https://github.com/nearai/ironclaw">nearai/ironclaw</a></summary>

No activity in the last 24 hours.

</details>

<details>
<summary><strong>QwenPaw</strong> — <a href="https://github.com/agentscope-ai/QwenPaw">agentscope-ai/QwenPaw</a></summary>

# QwenPaw Project Digest — 2026-11-24

## 1. Today's Overview

QwenPaw remains in a high-velocity maintenance phase following the `v2.3.0.post1` patch and the `v2.3.1-beta.1` pre-release cut. Activity in the last 24 hours is strong: 22 issues updated (16 open/active, 6 closed) and 36 PRs touched (30 open, 6 merged/closed), with no new releases. The issue stream is dominated by **Console rendering/clipping regressions** around wide tables and code blocks (#8811, #8845, #8856 — now with a fix PR #8823), plus a cluster of correctness bugs in streaming retries, memory backend startup races, and channel subsystems (Discord, WeChat, Telegram, MCP). Maintainer responsiveness looks healthy — most reports receive comments within 24h and several already have targeted fix PRs open or merged (e.g., #8491, #8060). The main health concern is a pattern of **silent failures** (channel death at 128 routes, provider fallback, unretried stream aborts) that degrade reliability without surfacing user-visible errors.

## 2. Releases

No new releases in the last 24 hours. Notable context from open release-duty issues:
- `v2.3.0` (Stable) verification issue #8681 closed on 2026-11-23.
- `v2.3.0.post1` (Post) verification #8807 closed 2026-11-23.
- `v2.3.1-beta.1` (Beta) verification #8861 is **still open**, deadline passed 2026-11-23 09:03 UTC — worth watching.

## 3. Project Progress

Merged/closed PRs and issues in the last 24h:

- **[CLOSED] #8060** — `fix(token-usage): count Anthropic cache tokens in the live context meter` (closes #8057). Fixes under-reporting of context usage for Anthropic prompt caching. [PR #8060](https://github.com/agentscope-ai/QwenPaw/pull/8060)
- **[CLOSED] #8491** — `fix(agents): avoid importing whisper in local whisper status probe` (closes #8490). Eliminates ~690 MB RSS leak from merely checking local whisper availability. [PR #8491](https://github.com/agentscope-ai/QwenPaw/pull/8491)
- **[CLOSED] #8031** — test hygiene: stop leaking unawaited coroutines in scheduling mocks. [PR #8031](https://github.com/agentscope-ai/QwenPaw/pull/8031)
- **[CLOSED] #8836** — Console infinite refresh when a tool config contains a password component.
- **[CLOSED] #8868** — Duplicate of #8867 (memory backend ReMeLight fallback race); still open under #8867.

Feature work advancing (open, under review):
- Plugin platform expansion: **#8554** (`feat(plugins): support CLI commands and extension points`, XXXL) and **#8764** (`feat(sdk): expand plugin SDK 1.2`, XXXL) — the largest structural changes in flight.
- Console reliability: **#8823** addresses the wide-table/code-block clipping cluster; **#8876** restores native wheel scrolling.
- Channel isolation: **#8857** isolates Telegram forum-topic sessions.
- Desktop reach: **#8444** adds Linux `.deb`/AppImage packaging to Tauri.

## 4. Community Hot Topics

Most-commented items:

1. **#8811 [OPEN] 窄屏下消息文字/表格被剪裁** — 5 comments. Root example of the Console width regression; multiple duplicates filed (#8845, #8856), indicating it affects a broad user base. [Issue #8811](https://github.com/agentscope-ai/QwenPaw/issues/8811)
2. **#8864 [OPEN] Streaming aborts mid-output with RemoteProtocolError, not retried** — 3 comments. High-impact streaming reliability bug (partial content already emitted blocks retry). [Issue #8864](https://github.com/agentscope-ai/QwenPaw/issues/8864)
3. **#8852 [OPEN] iOS WebKit Console freeze in long conversations** — 3 comments. Performance regression tied to `UserMessageAnchors` layout thrashing + `content-visibility:auto` in a `column-reverse` list. [Issue #8852](https://github.com/agentscope-ai/QwenPaw/issues/8852)
4. **#8844 [OPEN] Console message list not keyboard-focusable** — 3 comments. Accessibility gap; blocks non-mouse users. [Issue #8844](https://github.com/agentscope-ai/QwenPaw/issues/8844)
5. **#8845 [OPEN] Markdown tables overflow with no horizontal scroll** — 3 comments. [Issue #8845](https://github.com/agentscope-ai/QwenPaw/issues/8845)

Underlying needs: (a) **rendering correctness for wide/streamed content** across desktop and mobile viewports; (b) **native, predictable scroll/keyboard behavior** rather than custom wheel interception; (c) **streaming resilience** — retries must survive partial emissions and status-less SSE errors (see also #8877).

## 5. Bugs & Stability

Ranked by severity (higher = more user/data impact):

| Severity | Issue | Impact | Fix PR? |
|---|---|---|---|
| High | [#8814](https://github.com/agentscope-ai/QwenPaw/issues/8814) WeChat channel silently dies at 128 response routes (`RESPONSE_SCOPE_LIMIT`, no eviction) | Channel stops working bi-directionally with only `-32603` in logs | No |
| High | [#8867](https://github.com/agentscope-ai/QwenPaw/issues/8867) Memory backend silently falls back to ReMeLight on startup race, never self-heals | Wrong memory backend for process lifetime | No |
| High | [#8864](https://github.com/agentscope-ai/QwenPaw/issues/8864) Streaming aborts mid-output, no retry after partial content | Lost responses on transient provider errors | No |
| High | [#8863](https://github.com/agentscope-ai/QwenPaw/issues/8863) Windows ReMe tag-index permanently fails (invalid workspace-relative path), reme-ai 0.4.2.0 | Memory indexing broken on Windows in both 2.3.0 variants | No |
| Medium | [#8877](https://github.com/agentscope-ai/QwenPaw/issues/8877) Status-less model overload in OpenAI-compatible stream bypasses retries | Silent failures; reproduced on `main` | No |
| Medium | [#8811](https://github.com/agentscope-ai/QwenPaw/issues/8811) / [#8845](https://github.com/agentscope-ai/QwenPaw/issues/8845) / [#8856](https://github.com/agentscope-ai/QwenPaw/issues/8856) Console clips wide tables/code/narrow-screen text | Content unreadable | **#8823** |
| Medium | [#8852](https://github.com/agentscope-ai/QwenPaw/issues/8852) iOS WebKit freeze in long chats | UI unusable on iOS | No |
| Medium | [#8844](https://github.com/agentscope-ai/QwenPaw/issues/8844) Keyboard scrolling non-functional | Accessibility blocker | **#8876** (scroll) |
| Low | [#8870](https://github.com/agentscope-ai/QwenPaw/issues/8870) Discord `chunk_text` duplicates code fence on chunk boundary | Formatting corruption | No |
| Low | [#8865](https://github.com/agentscope-ai/QwenPaw/issues/8865) Heartbeat cron with named weekday list falls back to 30-min interval | Scheduling miscfg | **#8866** |
| Low | [#8872](https://github.com/agentscope-ai/QwenPaw/issues/8872) `models list` suggests removed `download` command | Misleading CLI UX | No |
| Low | [#8875](https://github.com/agentscope-ai/QwenPaw/issues/8875) MCP `streamable_http` masks server 4xx as "not connected" | Misleading errors, session churn | No |
| Low | [#8874](https://github.com/agentscope-ai/QwenPaw/issues/8874) Local pre-commit env diverges from CI | Contributor friction | No |

## 6. Feature Requests & Roadmap Signals

- **Plugin platform as the dominant theme**: **#8554** (plugin CLI commands/extension points) and **#8764** (SDK 1.2 with identity, permissions, scoped conversation history) suggest plugins will be a headline of `v2.3.1`/`v2.4.0`.
- **Plugin theme semantic colours**: **#8787** extends themed colour roles — likely to land alongside or shortly after the SDK bump.
- **Channel session isolation**: **#8857** (Telegram forum topics) indicates demand for finer-grained multi-session routing across channels.
- **Linux desktop support**: **#8444** (deb/AppImage) signals expansion beyond Windows/macOS for desktop distribution.
- **Provider cache controls**: **#8061** lets custom gateways declare OpenAI prompt-cache params, closing #8058.
- **CJK Markdown correctness**: **#8133** repairs emphasis boundaries for CJK punctuation — a localization-quality request likely to be included in the next patch.

Prediction for the next version: plugin SDK/CLI (#8554, #8764, #8787), Linux desktop (#8444), Telegram topic isolation (#8857), and the Console scroll/clip fixes (#8823, #8876) are the most likely inclusions.

## 7. User Feedback Summary

Real pain points surfacing:

- **Rendering regressions are the loudest voice**: multiple users independently filed the same "wide tables/code clipped" bug across `v2.3.0` and `v2.3.0.post1`, on both desktop Chrome (~1903 px) and mobile (375 px). Frustration is amplified because content is selectable but invisible — a confusing half-broken state.
- **Mobile/iOS experience**: #8852 reports the Console freezing on long sessions in iOS WebKit, making chat effectively unusable on iPhone.
- **Reliability concerns in production**: #8814 (WeChat channel silently dying) and #8867 (memory backend silent fallback) reflect users running long-lived deployments where failures are invisible until something breaks downstream.
- **Streaming resilience**: #8864 and #8877 both describe retries being bypassed, losing up to tens of thousands of tokens of output.
- **Contributor experience**: #8874 flags that the documented local pre-commit setup diverges from CI — friction for new contributors at a moment when first-time-contributor PRs (#8857, #8866, #8876, #8491) are actively landing, which is a positive signal for community onboarding.

## 8. Backlog Watch

Items needing maintainer attention:

- **#8814** (created 2026-11-19) — WeChat channel silent death at 128 routes; no linked fix PR yet, high operational severity. [Issue #8814](https://github.com/agentscope-ai/QwenPaw/issues/8814)
- **#8867** (created 2026-11-23) — Memory backend race with no self-healing; duplicate #8868 closed but the canonical issue remains unresolved. [Issue #8867](https://github.com/agentscope-ai/QwenPaw/issues/8867)
- **#8863** (created 2026-11-23) — Windows ReMe tag-index failure reproduced across two machines and two 2.3.0 variants; no fix PR. [Issue #8863](https://github.com/agentscope-ai/QwenPaw/issues/8863)
- **PR #8554** and **PR #8764** — both XXXL plugin-platform PRs open for 3+ weeks; these are foundational and likely gating the next minor release. [PR #8554](https://github.com/agentscope-ai/QwenPaw/pull/8554) · [PR #8764](https://github.com/agentscope-ai/QwenPaw/pull/8764)
- **PR #8133** (created 2026-10-08) — CJK Markdown emphasis fix, open ~7 weeks; worthwhile localization cleanup. [PR #8133](https://github.com/agentscope-ai/QwenPaw/pull/8133)
- **Issue #8861** — Beta installation verification for `v2.3.1-beta.1` is open past its 4-hour verification deadline; release health should be confirmed before promotion. [Issue #8861](https://github.com/agentscope-ai/QwenPaw/issues/8861)

</details>

<details>
<summary><strong>ZeroClaw</strong> — <a href="https://github.com/zeroclaw-labs/zeroclaw">zeroclaw-labs/zeroclaw</a></summary>

# ZeroClaw Project Digest — 2026-11-24

## 1. Today's Overview

ZeroClaw shows **high-velocity maintenance activity** with 50 issues and 50 PRs updated in the last 24 hours, but the balance skews heavily toward open work (22 active issues, 45 open PRs) versus closures (28 issues closed, only 5 PRs merged/closed). No new releases shipped, continuing a stretch without a version bump despite an accumulating backlog of merged-adjacent work. The dominant theme across both issues and PRs is a **large, coordinated security architecture initiative** driven by contributor CastelloBrancoTecnologia around scoped credential grants (RFC #12422), spawning a family of dependent PRs (#12408, #12481, #12482, #12490, #12517, #12596, #12659, #12695). Channel reliability (Telegram, WhatsApp, Matrix, Mattermost) and tool-schema correctness remain the most persistent bug categories. Overall project health is **active but merge-constrained** — a large volume of XL-sized, high-risk PRs is queued awaiting maintainer review.

## 2. Releases

**None.** No new releases were published in the last 24 hours. Note that several fixes referenced in closed issues (e.g., shell tool stderr swallowing #12390, web_search_tool silent compilation-out #12203, Android shell canonicalization #12075) have landed in `master` but are not yet packaged into a release — users on the current stable (v0.8.7-era) are still exposed to these bugs.

## 3. Project Progress

Only **5 PRs were merged/closed** in the last 24h, while 45 remain open. Progress today is therefore mostly visible through **closed issues** rather than merged PRs:

- **Closed bugs (fixes landed or resolved):**
  - [#11418](https://github.com/zeroclaw-labs/zeroclaw/issues/11418) — TUI "Copy" one-click broken (S1, zerocode).
  - [#11525](https://github.com/zeroclaw-labs/zeroclaw/issues/11525) — `quickstart` failure on Android/Termux (S1, onboarding).
  - [#10901](https://github.com/zeroclaw-labs/zeroclaw/issues/10901) — Mattermost dropping first DM message.
  - [#11858](https://github.com/zeroclaw-labs/zeroclaw/issues/11858) — `send_via` reply routing in headless turns.
  - [#12390](https://github.com/zeroclaw-labs/zeroclaw/issues/12390) — shell tool swallowing stderr on non-zero exit.
  - [#12203](https://github.com/zeroclaw-labs/zeroclaw/issues/12203) — `web_search_tool` silently compiled out.
  - [#12075](https://github.com/zeroclaw-labs/zeroclaw/issues/12075) — Android shell canonicalization (EPERM).
  - [#11896](https://github.com/zeroclaw-labs/zeroclaw/issues/11896) — memory recall hang/empty on embedder failure.
  - [#11916](https://github.com/zeroclaw-labs/zeroclaw/issues/11916) — Quiet `NO_REPLY` cron leaking into web chats.
  - [#11894](https://github.com/zeroclaw-labs/zeroclaw/issues/11894) — Exhausted Codex seat retried until reset.
  - [#11758](https://github.com/zeroclaw-labs/zeroclaw/issues/11758) — WhatsApp Web QR spam after listener stop.
  - [#11050](https://github.com/zeroclaw-labs/zeroclaw/issues/11050) — Native poll pacing.
  - [#12152](https://github.com/zeroclaw-labs/zeroclaw/issues/12152) — PowerShell test cache isolation.

**Features advancing (open PRs updated, not yet merged):** the entire scoped-credential family, native XMPP channel (#11847), SimpleX channel (#12316), scoped WebDAV remote files (#12695), and native Rust SSH task broker (#12438).

## 4. Community Hot Topics

Ranked by comment count:

| Item | Type | Comments | Link |
|---|---|---|---|
| RFC: Scoped use of operator-managed service credentials | Issue (RFC) | 16 | [#12422](https://github.com/zeroclaw-labs/zeroclaw/issues/12422) |
| "Copy" one-click not working | Issue (closed) | 8 | [#11418](https://github.com/zeroclaw-labs/zeroclaw/issues/11418) |
| Per-chat model switching for multi-model providers | Issue | 6 | [#8600](https://github.com/zeroclaw-labs/zeroclaw/issues/8600) |
| Browser tool exposes 16 of 100+ commands | Issue | 6 | [#9945](https://github.com/zeroclaw-labs/zeroclaw/issues/9945) |
| Skill review/creation never runs for channel/webhook/gateway turns | Issue | 6 | [#11332](https://github.com/zeroclaw-labs/zeroclaw/issues/11332) |
| `delegate` accepts unknown arg, drops silently | Issue | 6 | [#12666](https://github.com/zeroclaw-labs/zeroclaw/issues/12666) |

**Underlying needs analysis:** The runaway hot topic is **#12422**, which has become the anchor for a whole credential-brokering subsystem — the community clearly wants agents to *use* secrets without *seeing* them. This is a security-maturity signal: operators are moving ZeroClaw toward production multi-tenant deployments. The second cluster (#9945, #12614) shows the browser tool is underpowered relative to its backend, blocking real automation (file uploads, iframes, dialogs). The third cluster (#8600, #8321, #10073) reflects growing pains around **multi-model routing, caching policy, and log storage** as instances scale.

## 5. Bugs & Stability

Ranked by severity:

**S1 — Workflow blocked (open, no merged fix yet):**
- [#10863](https://github.com/zeroclaw-labs/zeroclaw/issues/10863) — Telegram retries rejected voice updates indefinitely, blocking all later messages. `status:in-progress`, `priority:p1`.
- [#12597](https://github.com/zeroclaw-labs/zeroclaw/issues/12597) — Telegram offset never advances when transcription fails; bot appears dead. (Same root cause family as #10863.)
- [#12570](https://github.com/zeroclaw-labs/zeroclaw/issues/12570) — Daemon hangs at startup from millions of leaked `runtime-trace.tmp.*` files after failed rolling trims. Compound defect (leak + no startup guard).

**S2 — Degraded behavior (open):**
- [#11332](https://github.com/zeroclaw-labs/zeroclaw/issues/11332) — Skill learning loop silently disabled for channel/webhook/gateway turns.
- [#11336](https://github.com/zeroclaw-labs/zeroclaw/issues/11336) — `plugin info`/`plugin list --verify` falsely report `[loads]`.
- [#12558](https://github.com/zeroclaw-labs/zeroclaw/issues/12558) — Matrix approval prompts posted to room root instead of thread; a fix PR exists: [#12224](https://github.com/zeroclaw-labs/zeroclaw/pull/12224).

**S3 — Minor (open):**
- [#12666](https://github.com/zeroclaw-labs/zeroclaw/issues/12666) — `delegate` silently drops unknown args.
- [#10976](https://github.com/zeroclaw-labs/zeroclaw/issues/10976) — WhatsApp Web mentions broken both directions.
- [#12660](https://github.com/zeroclaw-labs/zeroclaw/issues/12660) — Agent card spend labeled "this month" but shows all-time.

**Note:** Multiple S1 bugs were closed today (#11525, #11896, #12075, #11418), indicating active triage — but the Telegram voice-message family remains the single most dangerous open stability cluster.

## 6. Feature Requests & Roadmap Signals

High-signal requests, likely to influence the next release:

1. **Per-chat model switching** ([#8600](https://github.com/zeroclaw-labs/zeroclaw/issues/8600), 👍1, parking-lot) — a recurring ask from users migrating from moltis.
2. **Browser tool completeness** ([#9945](https://github.com/zeroclaw-labs/zeroclaw/issues/9945), [#12614](https://github.com/zeroclaw-labs/zeroclaw/issues/12614)) — file upload, iframes, dialogs, tabs. Strong candidate for a dedicated browser-tool milestone.
3. **Scoped credential grants / Remote Files** ([#12422](https://github.com/zeroclaw-labs/zeroclaw/issues/12422), [#12690](https://github.com/zeroclaw-labs/zeroclaw/issues/12690)) — almost certainly the **next major feature theme**, with a coordinated PR stack already in flight.
4. **Configurable ack reactions** ([#11753](https://github.com/zeroclaw-labs/zeroclaw/issues/11753)) — small, self-contained, `status:in-progress`.
5. **Response-cache policy** ([#8321](https://github.com/zeroclaw-labs/zeroclaw/issues/8321)) — architectural, iceboxed.

**Prediction:** The next release is likely to bundle the credential-brokering stack (pending review of the ~10 open XL PRs), the Telegram voice-retry fix, and browser file-upload support, rather than any single headline feature.

## 7. User Feedback Summary

**Pain points (dissatisfaction):**
- **Silent failures** are a recurring frustration theme: the shell tool swallowing stderr (#12390), `web_search_tool` compiling out without warning (#12203), `delegate` dropping args (#12666), and `send_via` advertising phantom routing (#11858). Users repeatedly note the *agent can't tell why something failed*.
- **Channel fragility**: Telegram, WhatsApp, and Mattermost all show message-loss or retry-loop bugs, directly blocking production deployments.
- **Platform gaps**: Android/Termux onboarding and shell execution were broken (#11525, #12075), showing incomplete cross-platform coverage.
- **UI trust issues**: spend metrics mislabeled (#12660), non-functional Copy button (#11418).

**Use cases surfacing:** production multi-tenant agent hosting (credential RFC), remote file operations across hosts (#12690), and phone-based agent conversation via SimpleX (#12316) — signaling ZeroClaw is being pushed beyond hobbyist use.

**Satisfaction signals:** Users migrating from competing tools (moltis, #8600) and detailed, well-structured bug reports suggest an engaged, technically sophisticated user base that wants ZeroClaw to reach production parity.

## 8. Backlog Watch

Long-lived, high-importance items needing maintainer attention:

- [#8600](https://github.com/zeroclaw-labs/zeroclaw/issues/8600) — Per-chat model switching (open since **2026-07-01**, parking-lot, only 1 👍 despite 6 comments).
- [#8321](https://github.com/zeroclaw-labs/zeroclaw/issues/8321) — Response-cache policy (open since **2026-06-25**, iceboxed).
- [#9945](https://github.com/zeroclaw-labs/zeroclaw/issues/9945) — Browser tool command gap (open since **2026-08-12**, `status:blocked`).
- [#10073](https://github.com/zeroclaw-labs/zeroclaw/issues/10073) — Log storage policy rework (open since **2026-08-18**, high-risk architecture).
- **PR review bottleneck:** [#11847](https://github.com/zeroclaw-labs/zeroclaw/pull/11847), [#11869](https://github.com/zeroclaw-labs/zeroclaw/pull/11869), [#11911](https://github.com/zeroclaw-labs/zeroclaw/pull/11911), and [#12059](https://github.com/zeroclaw-labs/zeroclaw/pull/12059) are all XL, `needs-maintainer-review`, and have been open since **October 19–27** — over a month without merge. This is the clearest health risk: a growing queue of large, high-value PRs (many from a single prolific contributor) risks contributor burnout and merge conflicts.

**Recommendation for maintainers:** prioritize triaging the October XL PR backlog and the Telegram voice-retry S1 cluster, and consider cutting a release to surface the 12+ bug fixes already merged into `master`.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*