# OpenClaw Ecosystem Digest 2026-10-25

> Issues: 500 | PRs: 500 | Projects covered: 5 | Generated: 2026-10-24 23:06 UTC

- [OpenClaw](https://github.com/openclaw/openclaw)
- [Hermes Agent](https://github.com/nousresearch/hermes-agent)
- [IronClaw](https://github.com/nearai/ironclaw)
- [QwenPaw](https://github.com/agentscope-ai/QwenPaw)
- [ZeroClaw](https://github.com/zeroclaw-labs/zeroclaw)

---

## OpenClaw Deep Dive

# OpenClaw Project Digest — 2026-10-25

## 1. Today's Overview

OpenClaw remains highly active, with 500 issues and 500 PRs touched in the last 24 hours, though the ratio leans toward maintenance churn rather than net closure (413 open/active issues vs. 87 closed; 227 open PRs vs. 273 merged/closed). Two releases shipped, headlined by a focused `openclaw 2026.10.7` with replay-safe session recovery fixes, plus an `extended-stable`/LTS-style `2026.9.34` gateway-only refresh. The issue tracker is dominated by regression reports tied to the 2026.9.5–2026.9.7 window (plugin source capture, WAL checkpointing, session-state races), several labeled P0/P1 with `crash-loop` and `message-loss` impact. Positively, a large batch of performance-oriented PRs from a core maintainer (`steipete`) is in flight, plus a substantial test-suite cleanup effort. Overall health: **active and responsive, but carrying a visible regression debt** from the recent plugin-capture and session-recovery changes.

---

## 2. Releases

### `v2026.10.7` — latest
- **Replay-safe session recovery:** interrupted sessions now retain recovery provenance and unfinished tool outcomes.
- Stopped conversations retire terminal recovery residue before accepting the next message.
- Rejected Claude CLI drafts are kept out of final replies.
- Large-content handling improvements (summary truncated in provided data).
- No explicit breaking changes or migration steps are called out in the release notes.
- **Related active bug to watch:** Issue #181619 reports a **Codex app-server execution-budget timeout regression after 2026.10.5 → 2026.10.6**, which may or may not be addressed by 2026.10.7 — worth verifying against this release.

### `v2026.9.34` — `extended-stable` (LTS-equivalent)
- Gateway-only release based on end-of-September 2026 code plus **critical security updates, reliability/performance fixes, and new model support**.
- Targeted at operators who want stability without tracking the 2026.10.x line.
- No stated breaking changes; positioned as a security/reliability backport.

---

## 3. Project Progress

Merged/closed activity (273 PRs merged/closed, though only the top-30 by comment count are detailed) shows steady engineering throughput concentrated in **performance and test hygiene**:

- **Performance PRs advancing (open, ready for review):**
  - #182988 — perf(ui): share row observers and avatar subscriptions.
  - #182949 — perf(gateway): reuse audience field indexes in session broadcasts.
  - #182925 — perf(agents): wake media completion waits from owner changes (replaces 500 ms polling).
  - #182754 — perf(gateway): preserve session row identity across unchanged reads.
  - #182970 / #182989 — plugin metadata lease trimming; idle worker GC profiler churn reduction.

- **Fixes closed / advancing:**
  - #182942 — perf(gateway): reduce repeated task PR subscription work (closed).
  - #182933 — skip redundant expiry probes in plugin-state writes (closed).
  - #182985 — remove unused compact session count helper (closed).
  - Open feature/fix PRs: #182987 (honor reasoning capabilities on compatible model routes), #182977 (Codex retain persisted user in `agent_end`), #182956 (voice consultation without tools).

- **Test-suite consolidation:** #182991, #182983, #182992 remove low-value/duplicated tests while preserving behavior contracts — a signal of maturing CI quality.

**Notable closed issues:** #96675 (owner-signed responsibility gates), #135858 (opencode-go catalog projection), #181660 (Session read batch / SQLite writer admission, P0), #178000 (session-state race → cross-provider fallback, P1).

---

## 4. Community Hot Topics

Ranked by comment count; underlying needs analyzed:

| Issue/PR | Comments | Underlying need |
|---|---|---|
| [#160959](https://github.com/openclaw/openclaw/issues/160959) — Gateway blocks for minutes capturing large external plugins (2026.9.6 regression) | 50 | **Performance + startup reliability.** Operators with large plugin trees need non-blocking capture and event-loop isolation. Highest-engagement issue; P0/diamond lobster. |
| [#164294](https://github.com/openclaw/openclaw/issues/164294) — WAL auto-checkpoint never completes (pinned by in-process reader) | 30 | **Data durability & long-run stability.** Checkpoint starvation risks WAL growth and crash-recovery pain. |
| [#159356](https://github.com/openclaw/openclaw/issues/159356) — llama.cpp manager reports ready while embedding child exits; HTTP 500 on embeddings | 29 | **Embedding/semantic-recall reliability**; partial recovery noted after RAM bump, cause still unconfirmed. |
| [#157989](https://github.com/openclaw/openclaw/issues/157989) — Plugin source capture rewrites ~6.5 GB per Gateway start; severe SSD wear | 23 | **Hardware longevity / cost.** Repeated byte-copy + SHA-256 of bundled native binaries is a serious operational concern. |
| [#53408](https://github.com/openclaw/openclaw/issues/53408) — Write/exec tool params silently dropped after long conversations | 15 | **Long-session correctness.** Silent parameter loss is high-risk for agent autonomy. |
| [#144502](https://github.com/openclaw/openclaw/issues/144502) — WhatsApp can't play TTS voice notes (48 kHz + vendor tag) | 14 | **Channel compatibility / codec handling.** |
| [#159789](https://github.com/openclaw/openclaw/issues/159789) — One failed native close locks agent execution until restart, health stays green | 13 | **Observability gap** — a work-stopping fault that health checks miss. |

**Theme:** The dominant community pain is the **plugin source-capture subsystem** (introduced ~2026.9.5–9.6) causing startup blocks, disk thrash, and convergence failures across platforms.

---

## 5. Bugs & Stability

Ranked by severity with fix-PR status:

**P0 / crash-loop / release-blocker:**
- [#160959](https://github.com/openclaw/openclaw/issues/160959) — Gateway blocks for minutes capturing large plugins. *No new fix PR (`clawsweeper:no-new-fix-pr`)* — **unfixed, high priority.**
- [#153426](https://github.com/openclaw/openclaw/issues/153426) — Curated memory roots silently/permanently excluded from bootstrap injection (security + session-state). **Needs security review; unfixed.**
- [#166634](https://github.com/openclaw/openclaw/issues/166634) — Late reclamation commit checkpoint failure leaves agent unavailable after crash recovery. **Not repro on main.**
- [#181660](https://github.com/openclaw/openclaw/issues/181660) — "Session read batch cannot reenter active SQLite writer admission" — **CLOSED today.**

**P1:**
- [#181619](https://github.com/openclaw/openclaw/issues/181619) — Codex app-server execution-budget timeout regression (2026.10.5→10.6); every primary turn falls back silently. *Needs live repro.*
- [#157989](https://github.com/openclaw/openclaw/issues/157989) — SSD-wear plugin capture (fix-shape clear, awaiting maintainer).
- [#150822](https://github.com/openclaw/openclaw/issues/150822) — Native Codex children advertise tools without execution handler (security + message-loss).
- [#182476](https://github.com/openclaw/openclaw/issues/182476) — Windows `update repair` fails with `OPENCLAW_STATE_LEASE_LOST` (filed today, 10 comments).
- [#154299](https://github.com/openclaw/openclaw/issues/154299) — Subagent completion final text silently drops on 2026.9.5.
- [#148292](https://github.com/openclaw/openclaw/issues/148292) — Session auto-compaction: no timeout, 23-min hangs.
- [#178300](https://github.com/openclaw/openclaw/issues/178300) — False-success finalization after 1-token `length` stop.

**P2 (volume drivers):**
- [#164294](https://github.com/openclaw/openclaw/issues/164294) (WAL checkpoint), [#162585](https://github.com/openclaw/openclaw/issues/162585) (Windows capture never converges), [#157812](https://github.com/openclaw/openclaw/issues/157812) (Windows auto-update failures), [#164948](https://github.com/openclaw/openclaw/issues/164948) (`doctor --fix` self-deadlock), [#154104](https://github.com/openclaw/openclaw/issues/154104) (Matrix E2EE idle CPU/disk), [#158154](https://github.com/openclaw/openclaw/issues/158154) (Telegram subagent announcements expire).

**Assessment:** Multiple P0/P1 regressions remain **without linked fix PRs**. Windows and the plugin-capture path are recurring weak spots. The `stale` tag appears on many still-relevant issues, suggesting triage pressure.

---

## 6. Feature Requests & Roadmap Signals

Notable open feature requests and likelihood of near-term inclusion:

- [#182712](https://github.com/openclaw/openclaw/issues/182712) — **Limit-aware model fallback** — skip exhausted provider accounts, prefer different provider. Filed today (7 comments); strong candidate for a near-term fallback-chain improvement.
- [#155633](https://github.com/openclaw/openclaw/issues/155633) — **Databricks Unity Gateway as official model provider** (implementation #155634 open). Fits the "new model support" theme in 2026.9.34; plausible for a coming release.
- [#144306](https://github.com/openclaw/openclaw/issues/144306) — Automations delivering to paired nodes as notifications; PR #182956 (voice consent without tools) is related.
- [#139477](https://github.com/openclaw/openclaw/issues/139477) — Honor `tools.toolSearch` for bundle-MCP CLI backends (fix-shape clear).
- [#150598](https://github.com/openclaw/openclaw/issues/150598) — Completion-wake delivery semantics (multi-session field proposal).
- [#96675](https://github.com/openclaw/openclaw/issues/96675) — Owner-signed responsibility gates for memory/actions — **closed today**, may surface as a privacy/security feature.

**Prediction:** The **model-fallback and provider-catalog work** (#182712, #155633, #182987 reasoning-capability fix) is most likely to land in the next minor release, consistent with the "new model support" thread running through 2026.9.34 and 2026.10.7.

---

## 7. User Feedback Summary

**Pain points (dissatisfaction):**
- **Disk/SSD wear and startup blocking** from plugin source capture (#157989, #160959, #162585) — users calculate real GB-per-start costs and hardware-wear impact, indicating production deployments.
- **Silent failures that health checks miss** (#159789, #178300) — eroded trust when the dashboard reports "healthy" during work-stopping faults.
- **Windows update/repair instability** (#157812, #182476) — repeated user-visible failure notices.
- **Long-session data loss** (#53408 write/exec params dropped; #154299 subagent text dropped).
- **Channel regressions** (#144502 WhatsApp TTS, #145937 QQ plugin, #158154 Telegram subagent announces).

**Positive signals:**
- Semantic recall recovered after operator RAM upgrades (#159356), showing active self-diagnosis.
- Maintainer responsiveness: same-day filing and triage of #182476 and #182712; large in-flight perf batch.

**Use cases observed:** multi-session orchestration shops, scheduled automations, long-running agent sessions with heavy tool use, multi-channel deployments (Telegram, WhatsApp, Matrix, QQ), Raspberry Pi/Windows/Linux hosts.

---

## 8. Backlog Watch

Important items needing maintainer attention (aged, important, low recent movement or blocked):

- [#53408](https://github.com/openclaw/openclaw/issues/53408) — Write/exec param drop after long conversations. **Open since 2026-03-24**, `stale`, `needs-info`. Long-lived correctness bug.
- [#137613](https://github.com/openclaw/openclaw/issues/137613) — Pre-compaction memory flush disabled on CLI backends (compactionCount trap). **Since 2026-09-03**, diamond-lobster, needs product decision.
- [#153426](https://github.com/openclaw/openclaw/issues/153426) — Curated memory roots silently excluded (P0, security). **Since 2026-09-20**, no new fix PR.
- [#146902](https://github.com/openclaw/openclaw/issues/146902) — Tool-set churn defeats prompt-cache reuse (cost impact).
- [#161208](https://github.com/openclaw/openclaw/issues/161208) — Main-session heartbeats never reuse Anthropic prompt cache (~$0.40–0.95/heartbeat).
- [#144306](https://github.com/openclaw/openclaw/issues/144306) — Automations → paired-node notifications (P3, stale).
- **PR [#167386](https://github.com/openclaw/openclaw/pull/167386)** — fix(browser): stop Playwright downloads past 10 MiB. Open since **2026-10-08**, proof sufficient, **waiting on author** — a security-adjacent fix stalled on author response.
- **PR [#182295](https://github.com/openclaw/openclaw/pull/182295)** — monotonic clock for OpenCode pagination deadline (small, needs proof).

**Recommendation:** Prioritize maintainer review on the P0 memory-injection (#153426) and plugin-capture (#160959) issues, and unblock #167386, which has sufficient proof but is awaiting author follow-up.

---

*Data source: github.com/openclaw/openclaw — activity window 2026-10-24 to 2026-10-25. Figures reflect only the top items surfaced by comment count; totals represent the full 24h window.*

---

## Cross-Ecosystem Comparison

# Cross-Project Comparison Report — Personal AI Assistant / Agent Open-Source Ecosystem
**Data window: 2026-10-24 → 2026-10-25**

---

## 1. Ecosystem Overview

The personal AI assistant / agent open-source landscape in late 2026 is bifurcated between **mature, high-traffic incumbents** (OpenClaw, ZeroClaw) and **fast-following, platform-focused challengers** (Hermes Agent, QwenPaw), with IronClaw inactive this window. Across the active projects, the dominant engineering theme has shifted from *capability expansion* (adding models, channels, tools) to **reliability hardening**: session recovery, context/compression correctness, plugin/extension lifecycle, and silent-failure elimination. Every active project is simultaneously fighting regression debt introduced by recent 2026.9–10 feature waves, and all four show "silent failure" as the single most trust-eroding bug class — dropped messages, false-success verification, unlogged state resets, and missed cancellations. Security and CI hygiene (RustSec advisories, API-key redaction, audit-trail integrity, sandbox state) is a cross-cutting concern now treated as release-blocking rather than backlog. The net read: the ecosystem has reached sufficient production adoption that operators are demanding **auditability, durability, and config determinism** — not novelty.

---

## 2. Activity Comparison

| Project | Issues (updated/24h) | Open vs Closed (Issues) | PRs (updated/24h) | Open vs Merged/Closed (PRs) | Release Status | Health Score* |
|---|---|---|---|---|---|---|
| **OpenClaw** | 500 | 413 open / 87 closed | 500 | 227 open / 273 merged/closed | **2 shipped**: `v2026.10.7` (latest) + `v2026.9.34` LTS | **B** — high throughput, visible regression debt |
| **Hermes Agent** | 50 | 42 open / 8 closed | 50 | 33 open / 17 merged/closed | None (latest ref: v0.22.5) | **B−** — active but maintenance-heavy, aging P2s |
| **QwenPaw** | 4 | ~3 open / 1 closed | 11 | ~8 open / 1 closed (rest under review) | None (latest ref: v2.2.1) | **B+** — moderate volume, responsive, good scoping |
| **ZeroClaw** | 17 | ~13 open / 6 closed | 50 | 48 open / **2 merged/closed** | v0.8.7 in prep (PR #12011) | **B−** — strong contributors, severe merge bottleneck + open S0 |
| **IronClaw** | — | — | — | — | None | **N/A** — no activity |

\* Qualitative health score weighing activity, regression ratio, unresolved P0/S0 items, merge throughput, and release cadence. Not a formal metric.

**Reading the table:**
- **OpenClaw** operates at ~10× the issue/PR volume of Hermes and ~30× QwenPaw, confirming it as the ecosystem's default reference implementation.
- **ZeroClaw** shows the most dangerous pipeline signature: **48 open vs. 2 merged PRs**, indicating a review bottleneck, not a contributor shortage.
- **QwenPaw** has the cleanest ratio (small, well-scoped, same-day issue→PR pairing) — a sign of a disciplined, smaller team.
- **IronClaw** is dormant; excluded from comparative analysis below.

---

## 3. OpenClaw's Position

**Advantages vs. peers**
- **Scale & reference status:** 500 PRs + 500 issues/24h vs. Hermes (50/50), ZeroClaw (50/17), QwenPaw (11/4). OpenClaw is the de facto substrate peers are benchmarked against.
- **Only project shipping releases this window:** two builds (`2026.10.7` latest + `2026.9.34` extended-stable/LTS). Hermes, QwenPaw, and ZeroClaw produced zero releases — OpenClaw uniquely offers an **LTS channel**, signaling enterprise/operator maturity no peer currently matches.
- **Breadth of surface area:** multi-channel (Telegram, WhatsApp, Matrix, QQ), semantic recall/embeddings, plugin capture, Codex/Claude CLI backends, gateway broadcast perf — the widest integration matrix in the set.

**Technical approach differences**
- **Plugin-source-capture subsystem** (introduced 2026.9.5–9.6) is OpenClaw-unique and its biggest liability: ~6.5 GB rewrite per gateway start (#157989), multi-minute gateway blocks (#160959). Peers do not carry this class of startup cost.
- **Explicit LTS/stable split** (`extended-stable`) is an operational posture none of the peers have adopted.
- Deeper investment in **gateway broadcast/session-row performance** (a batch of core-maintainer perf PRs) than peers, who are still fixing basic session-lifecycle correctness.

**Community size comparison**
OpenClaw's comment volumes dwarf peers: top issue #160959 has **50 comments** vs. Hermes' hottest at **23** and QwenPaw's at **4**. This is roughly a **2–5× engagement multiple** on hot topics and a much larger absolute contributor base. The tradeoff: OpenClaw's triage pressure is visible (`stale` tags on still-relevant issues), and its regression debt is proportionally larger.

**Positioning verdict:** OpenClaw is the ecosystem's **reference + LTS anchor**; peers are either specializing (Hermes → desktop/sessions), localizing into ecosystems (QwenPaw → AgentScope/QQ/Feishu), or racing toward a release (ZeroClaw → v0.8.7).

---

## 4. Shared Technical Focus Areas

Requirements emerging **independently** across multiple projects — the strongest signal of genuine ecosystem-level need:

| Requirement | OpenClaw | Hermes | QwenPaw | ZeroClaw |
|---|---|---|---|---|
| **Silent-failure elimination** | #159789 (health green during locked execution), #178300 (false-success finalization) | #144150 (false-positive verify), #131786 (dropped output), #136189 (message loss on restart) | #8252 (silent cancel), #8406 (silent flag reset), #8412 (audit stops) | #10797 (silent memory loss), #12014 (silent 32K fallback) |
| **Session lifecycle / restart recovery** | #181660 (closed), session-state races | #136189, #144165, #144140 | #8252 (agent-to-agent cancel) | #11899 (stale config after reload) |
| **Config snapshot consistency** | #182712 (limit-aware fallback) | — | #8407 (server-side display default) | #9592, #12014 (stale snapshots) |
| **Context/compression correctness** | auto-compaction hangs (#148292), param drops (#53408) | #99943 (1M→65K clamp), #144167 (400 after compaction) | ReMe memory integration (#8347) | #12014 (context window metadata) |
| **Audit / governance integrity** | owner-signed responsibility gates (#96675) | approval context (#37935, closed) | **#8412 (audit.db permanently stops)** | tool-call envelope leak (#10446) |
| **Security/CI hygiene** | security review needed on #153426 | API-key redaction (#142627, closed), MCP scope creep (#141468, closed) | memory-recall payload leak (#7835) | **RUSTSEC-2026-0385/0386**, npm audit (#11853) |
| **Channel integration maturity** | WhatsApp TTS, QQ, Telegram | Reticulum RFC (#18964); desktop notifications (#50718) | QQ streaming (#8409), Matrix (#8365), Feishu leak | XMPP/OMEMO (#11847), email (#12003) |

**Single most universal requirement:** **observability of silent failures.** All four projects independently surfaced bugs where the system *appears healthy* while silently losing data, dropping output, or halting work. This is the ecosystem's #1 trust gap in 2026.

---

## 5. Differentiation Analysis

**Feature focus**
- **OpenClaw:** Broadest capability surface — multi-channel gateway, embeddings/semantic recall, plugin ecosystem, LTS stability channel. Says "yes" to everything.
- **Hermes Agent:** **Desktop-first daily driver.** Heaviest investment in desktop UX (session visibility, notifications, code rendering) and gateway session lifecycle. Targets long-running coding/ops sessions on Windows/macOS/Linux desktops.
- **QwenPaw:** **Ecosystem-integrated, governance-heavy.** Deep ties to Aliyun/AgentScope catalog (Qwen, GLM model alignment), QQ/Feishu/Matrix channels, and explicit `governance/audit.db`. Targets self-hosted/team and regulated deployments in the Chinese-model ecosystem.
- **ZeroClaw:** **Rust-native, policy/safety-centric.** Emphasizes shell policy transparency, SOP engines, provider/model routing determinism, XMPP/email channels. Targets operators who want explicit, auditable action gating.

**Target users**
| Project | Primary user |
|---|---|
| OpenClaw | Multi-session orchestration shops, production operators, LTS-seeking enterprises |
| Hermes | Individual power users / developers running desktop as primary driver |
| QwenPaw | Self-hosted teams & enterprises in the AgentScope/Aliyun ecosystem needing audit |
| ZeroClaw | Security-conscious Rust-based production operators, workflow/SOP builders |

**Technical architecture**
- **OpenClaw:** Gateway-centric monolith with plugin-capture sidecar; heaviest perf engineering.
- **Hermes:** Gateway + multiplexed multi-profile + desktop frontend; session-lifecycle correctness focus.
- **QwenPaw:** Console + channel adapters + memory (ReMe) + governance DB; config-driven, ecosystem-aligned.
- **ZeroClaw:** Rust workspace, Tauri desktop, SOP/workflow engine, append-only session history in flight.

**Key structural difference:** Only **ZeroClaw (Rust)** and **OpenClaw (explicit LTS)** differentiate on language/runtime and release-engineering posture; Hermes and QwenPaw compete primarily on **UX/desktop** and **ecosystem/governance** respectively.

---

## 6. Community Momentum & Maturity

**Activity tiers**

- **Tier 1 — Massive scale, regression-heavy:** **OpenClaw.** Highest absolute velocity, shipping releases, but carrying the largest visible regression debt (plugin-capture, WAL checkpoint, session races). Mature but strained.
- **Tier 2 — High velocity, bottlenecked:** **ZeroClaw** (50 PRs, 2 merged) and **Hermes** (50 PRs, 33 open). Both have strong contributor inflow but a **merge/review bottleneck**. ZeroClaw additionally carries an unresolved S0 (memory data loss) — the highest per-item risk in the ecosystem.
- **Tier 3 — Moderate, disciplined:** **QwenPaw.** Smallest volume, cleanest ratios, fastest issue→PR turnaround, but several PRs stale 38–65 days (first-time-contributor and privacy PRs awaiting human review).
- **Inactive:** **IronClaw.**

**Rapidly iterating:** OpenClaw (perf batch + 2 releases), ZeroClaw (v0.8.7 prep, Goal V1 RFC, append-only history).
**Stabilizing:** Hermes (fix-heavy, no releases, consolidating desktop/session), QwenPaw (fix-heavy, patch-level trajectory).

**Maturity assessment**
- **Most mature operational posture:** OpenClaw (LTS channel, release cadence, perf engineering).
- **Most mature governance posture:** QwenPaw (audit DB, server-side config, ecosystem catalog alignment) — despite smallest volume.
- **Least mature / highest risk:** ZeroClaw — engineering ambition exceeds current merge capacity; S0 + CI advisories open simultaneously.
- **Common maturity weakness:** **review bandwidth.** Three of four active projects have open-PR backlogs (Hermes 33, ZeroClaw 48, QwenPaw several stale). Contributor enthusiasm outpaces maintainer throughput ecosystem-wide.

---

## 7. Trend Signals

Extracted from community feedback across all active projects — directly actionable for AI agent developers:

1. **Silent failure is the #1 trust killer.** Across all four projects, the most damaging bugs make the system *look healthy* while failing (OpenClaw #159789, Hermes #144150, QwenPaw #8412, ZeroClaw #10797). **Action:** instrument health checks to assert *outcomes*, not just *liveness*; log every state transition (cancellations, flag resets, audit gaps) with initiator + reason.

2. **Context/compression correctness is not a feature — it's a durability requirement.** Hermes' 1M→65K silent clamp (#99943), OpenClaw param drops (#53408), and Hermes' post-compaction 400s (#144167) show compression silently corrupts working state. **Action:** treat context window as model metadata (ZeroClaw #12017 direction), never silently fall back, and validate transcript shape post-compaction.

3. **Config determinism is mandatory.** Stale snapshots (ZeroClaw #9592/#12014), localStorage-only prefs (QwenPaw #8407), and channels silently disabled (#8406) drive friction. **Action:** server-side/centralized config, snapshot immutability, and explicit warnings on any config-driven state change.

4. **Governance/auditability is now a gate, not a nice-to-have.** QwenPaw's permanent audit stop (#8412) and ZeroClaw's tool-envelope leak (#10446) show compliance deployments can't tolerate silent gaps. **Action:** audit writes must be append-only, resumable, and alerting on stop.

5. **Security/CI hygiene is release-blocking.** RustSec advisories broke every ZeroClaw build (#12009); npm audit failing (#11853); API-key redaction (#142627) and MCP scope creep (#141468) closed as high-risk. **Action:** CI security gates + prefix-aware secret redaction (generic `sk-` patterns miss vendor-embedded keys like `ctx7sk-`).

6. **Provider fallback + catalog alignment is the next feature wave.** OpenClaw limit-aware fallback (#182712) + Databricks provider (#155633) + reasoning-capability routing (#182987); QwenPaw Aliyun catalog guard (#7390). **Action:** build exhaustion-aware, multi-provider fallback chains with reasoning-capability-aware routing.

7. **Desktop/session UX is a differentiator.** Hermes' session visibility (#50718) and OpenClaw's UI perf batch show the frontend layer is the new competitive surface. **Action:** unread markers, needs-input cues, and explicit session lifecycle management.

8. **Review bandwidth is the ecosystem's systemic bottleneck.** Open-PR backlogs (Hermes 33, ZeroClaw 48) and months-stale `ready-for-human-review` PRs (QwenPaw #7211, #7835; ZeroClaw #9420) risk contributor fatigue. **Action:** for maintainers — triage SLAs, especially for privacy/security PRs and first-time contributors.

---

**Bottom line for decision-makers:** OpenClaw remains the safest default for production parity and LTS needs; Hermes suits desktop/daily-driver workflows; QwenPaw fits audited, self-hosted, AgentScope-aligned deployments; ZeroClaw offers the strongest policy/safety architecture but currently carries the highest stability risk and should be adopted cautiously until its S0 memory bug and merge bottleneck clear. The ecosystem as a whole has crossed into a **reliability-and-trust phase**, and any agent platform shipping in 2026–2027 will be judged on *observable correctness*, not capability breadth.

---

## Peer Project Reports

<details>
<summary><strong>Hermes Agent</strong> — <a href="https://github.com/nousresearch/hermes-agent">nousresearch/hermes-agent</a></summary>

# Hermes Agent — Project Digest
**Date: 2026-10-25** | Source: github.com/NousResearch/hermes-agent

---

## 1. Today's Overview

Hermes Agent remains a high-velocity, actively maintained project with **50 issues** and **50 PRs** updated in the last 24 hours, though no new release was cut. Activity is heavily skewed toward bug triage and stability work: **42 open issues** versus **8 closed**, and **33 open PRs** versus **17 merged/closed**, indicating a large in-flight queue rather than a shipping cadence. The issue mix reveals a maturing but strained product — recurring themes include **Windows/macOS platform regressions**, **gateway session lifecycle bugs**, **context-compression correctness**, and **desktop UI performance**. Security hygiene is also visible, with a redaction fix (Context7 API keys) landing and an RFC on the "doc-chain substrate" drawing sustained discussion. Overall health is **good but maintenance-heavy**: strong community engagement and fast PR response, offset by a growing backlog of P2 platform-specific defects and several long-lived issues awaiting maintainer decisions.

---

## 2. Releases

**None.** No new releases were published in the last 24 hours. The most recent shipped version referenced by users in this window is **v0.22.5** (per Issue #144165), with some reports still on v0.22.4 and v0.22.2. Users on Windows source installs report the v0.22.5 update path itself introduced instability (see Bugs & Stability).

---

## 3. Project Progress

**Merged / Closed PRs today (17 total; notable items):**

- **PR #142627 [CLOSED]** — `fix(agent): redact Context7 API keys by their vendor prefix`. Closes Issue #142576. Adds a `ctx7sk-` prefix pattern to the redactor, since the generic `sk-` family's lookbehind cannot catch a prefix embedded inside `ctx7sk-`. Security hardening. → [PR #142627](https://github.com/NousResearch/hermes-agent/pull/142627)
- **PR #141934 [CLOSED]** — `fix(gateway): stamp the planned-restart marker from the CLI restart`. Restores the "Gateway online" home-channel notice on Windows, where there is no `SIGUSR1`. Closes Issue #142515. → [PR #141934](https://github.com/NousResearch/hermes-agent/pull/141934)
- **PR #133621 [CLOSED]** — `docs(i18n): fix stale memory paths and LLM-summaries claim in zh-Hans`. Documentation correctness for Simplified Chinese. → [PR #133621](https://github.com/NousResearch/hermes-agent/pull/133621)

**Closed Issues today (8 total; notable):**
- **#135131 [CLOSED]** — `tools.lazy_deps.install_specs` reporting runtime dependency installation as unavailable (plugin/memory-provider setup). → [Issue #135131](https://github.com/NousResearch/hermes-agent/issues/135131)
- **#141468 [CLOSED]** — cron `enabled_toolsets` with `"mcp-<name>"` widened the job to **every** enabled MCP server (security-relevant scope creep). → [Issue #141468](https://github.com/NousResearch/hermes-agent/issues/141468)
- **#142528 [CLOSED]** — Windows abandoned pm-runtime lease files never pruned (1,546 accumulated). → [Issue #142528](https://github.com/NousResearch/hermes-agent/issues/142528)
- **#37935 [CLOSED]** — `fix(delegate-task): preserve approval context in executor submissions` (CVSS ~6.5/7.0 medium-high). → [Issue #37935](https://github.com/NousResearch/hermes-agent/issues/37935)
- **#144102 [CLOSED]** — macOS 26 (Apple Silicon) bundled Python HTTPS `Errno 9` Bad file descriptor during Nous OAuth. → [Issue #144102](https://github.com/NousResearch/hermes-agent/issues/144102)

**Progress assessment:** The day's merges were predominantly **bug/security fixes and docs**, not new features. Two security-adjacent fixes (redaction, MCP toolset scoping) closed cleanly, which is a positive signal for maintainer responsiveness on high-risk items.

---

## 4. Community Hot Topics

Ranked by comment count (most active discussions):

1. **Issue #131055 [OPEN, P2, 23 comments]** — *Linux Desktop: second-instance launches poison the sandbox fallback marker → sticky `--no-sandbox` → renderer SIGILL loop*. The single most-discussed thread. A persistent `windows-sandbox-fallback.json` in `boot-loop` state causes every subsequent launch to run unsandboxed. **Underlying need:** users need reliable single-instance enforcement and self-healing sandbox state on Linux. → [Issue #131055](https://github.com/NousResearch/hermes-agent/issues/131055)
2. **Issue #143379 [OPEN, P3, 14 comments]** — *RFC: THE DOC-CHAIN SUBSTRATE'S NETWORK — the read, the governance, the compaction*. A design RFC about durable records surviving session compression with provenance intact. **Underlying need:** users want the agent to **re-read durable context rather than make the user repeat themselves** across compactions. → [Issue #143379](https://github.com/NousResearch/hermes-agent/issues/143379)
3. **Issue #50718 [OPEN, P3, 12 comments, 👍3]** — *Session visibility & notifications — unread markers, needs-input cues, OS badges*. High-reaction feature request. → [Issue #50718](https://github.com/NousResearch/hermes-agent/issues/50718)
4. **Issue #99943 [OPEN, P2, 12 comments]** — *Compressor context window clamped to `model.ollama_num_ctx` on cloud providers — 1M window silently drops to 65,536*. A regression from v0.21.0 that silently degrades cloud model context. → [Issue #99943](https://github.com/NousResearch/hermes-agent/issues/99943)

**Analysis:** The hottest topics cluster around **two themes**: (a) *desktop runtime reliability* (sandboxing, session lifecycle, notifications), and (b) *context/memory correctness under compression*. Both reflect power users running long-lived, multi-session agents where silent degradation is costly.

---

## 5. Bugs & Stability

Ranked by severity (P1 first), noting fix PR availability:

| Severity | Issue | Summary | Fix PR? |
|---|---|---|---|
| **P1** | [#136189](https://github.com/NousResearch/hermes-agent/issues/136189) | Gateway shutdown flush files written under adapter session key; restart recovery can never map them when adapter/gateway isolation flags differ → **message loss on restart** | No |
| **P2** | [#99943](https://github.com/NousResearch/hermes-agent/issues/99943) | Compressor window clamped to `ollama_num_ctx` on **cloud providers** — 1M → 65,536 silently | No |
| **P2** | [#144167](https://github.com/NousResearch/hermes-agent/issues/144167) | Repeated compaction can leave a tool/assistant-led transcript → **permanent non-retryable 400** on OpenAI-compatible (lmstudio/ollama/custom); leading-user repair exists on Anthropic/Bedrock only | No |
| **P2** | [#144181](https://github.com/NousResearch/hermes-agent/issues/144181) | Gateway sole non-retryable startup conflict ignores `on_all_adapters_down=stay_alive` → exits 78, **restart-loops whole process** over one logged-out platform | No |
| **P2** | [#144166](https://github.com/NousResearch/hermes-agent/issues/144166) | Windows `cron load_jobs()` raises on transient sharing violation while `jobs.json` saves (no reader-side retry) | No |
| **P2** | [#144165](https://github.com/NousResearch/hermes-agent/issues/144165) | Windows v0.22.5 update leaves gateway restart unaccounted → startup recovery blocks Desktop | No |
| **P2** | [#131786](https://github.com/NousResearch/hermes-agent/issues/131786) | Gateway completion tail drops all useful output for long single-line JSON | No |
| **P2** | [#144150](https://github.com/NousResearch/hermes-agent/issues/144150) | `hermes verify` no-op run reports success and clears pending verification (**false-positive evidence**) | No |
| **P2** | [#144140](https://github.com/NousResearch/hermes-agent/issues/144140) | Dashboard lists serve/Desktop sessions it cannot open (`session.resume` → `not_found`) | No |
| **P2** | [#141521](https://github.com/NousResearch/hermes-agent/issues/141521) | Desktop demotes fenced code to prose by heuristic; PowerShell `$vars` render as math | No |
| **P2** | [#144168](https://github.com/NousResearch/hermes-agent/issues/144168) | Linux/NVIDIA Settings hover causes large GPU utilization spikes | No |
| **P2** | [#144108](https://github.com/NousResearch/hermes-agent/issues/144108) | Failed Desktop model pick revives stale wire-effort stamp | No |

**Open fix PRs in flight:**
- [#115152](https://github.com/NousResearch/hermes-agent/pull/115152) — narrow root deletion detection (approval safety).
- [#78274](https://github.com/NousResearch/hermes-agent/pull/78274) — rotate credential pool immediately on first 429.
- [#49843](https://github.com/NousResearch/hermes-agent/pull/49843) — surface silent message-loss in `append_to_transcript`.
- [#126158](https://github.com/NousResearch/hermes-agent/pull/126158) — allow `terminal.worker_memory_max_mb` to raise worker MemoryMax.

**Stability assessment:** Several of today's bugs are **silent-failure class** (message loss, false-positive verification, dropped output), which are the most dangerous because they erode user trust without obvious errors. **Windows remains the weakest platform**, with multiple independent P2 reports (#144165, #144166, #142528, #133253) in a single window. The **absence of fix PRs for most P2s** is a backlog risk.

---

## 6. Feature Requests & Roadmap Signals

| Issue | Feature | Signal Strength |
|---|---|---|
| [#50718](https://github.com/NousResearch/hermes-agent/issues/50718) | Session visibility: unread markers, needs-input cues, OS badges | **High** (👍3, 12 comments, desktop/sessions) |
| [#18964](https://github.com/NousResearch/hermes-agent/issues/18964) | Add **Reticulum/LXMF** as a message gateway (decentralized, link-agnostic) | Medium (👍3) |
| [#48997](https://github.com/NousResearch/hermes-agent/issues/48997) | Desktop should explicitly close abandoned runtime sessions & owned backends | Medium |
| [#143379](https://github.com/NousResearch/hermes-agent/issues/143379) | Doc-chain substrate RFC (durable memory across compaction) | Medium (design-level) |

**Prediction:** The most likely near-term roadmap items are **desktop session-lifecycle management (#48997)** and **session visibility/notifications (#50718)** — both are recurring desktop pain points with existing community traction and align with the high volume of desktop bugs being filed. The Reticulum gateway (#18964) is a niche but distinctive request that could differentiate Hermes in the decentralized-comms space, though it likely sits further out. The doc-chain RFC (#143379) signals a strategic interest in **persistent, provenance-preserving memory**, which may shape a future major version.

---

## 7. User Feedback Summary

**Pain points (dissatisfaction):**
- **Silent degradation is the top complaint pattern.** Users report the compressor silently dropping 1M → 65,536 context on cloud providers (#99943), gateway tails dropping output (#131786), and `hermes verify` reporting false success (#144150). Users clearly value *trustworthy* behavior over raw capability.
- **Windows install/update fragility.** Multiple users describe source installs becoming "unusable again" after official updates (#144165), with gateway restart and Desktop startup recovery left unaccounted. This is a recurring frustration that suggests the update path needs hardening.
- **Desktop UX friction.** Code blocks losing copy buttons (#141521), GPU spikes on hover (#144168), and unopenable listed sessions (#144140) point to a desktop layer that feels unpolished under real use.
- **Long-session memory loss.** The doc-chain RFC (#143379) and compaction bugs (#144167) reflect users frustrated by having to **repeat themselves** after the agent compresses history.

**Use cases observed:**
- Multi-profile, multi-session gateway deployments (e.g., "one multiplexed gateway serving five profiles, ~50 scheduled jobs" in #144166).
- Desktop as a primary daily driver for long-running coding/ops sessions (PowerShell blocks, terminal-heavy workflows).
- Credential pools and provider rotation for high-throughput or rate-limited workloads (#78274).

**Satisfaction signals:**
- Users explicitly thank the team for specific features (e.g., code-block copy button in #141521), indicating the desktop UX is valued when it works.
- High-reaction feature requests (👍3 on #50718, #18964) show an engaged, forward-looking user base willing to invest in the roadmap.

---

## 8. Backlog Watch

Long-lived or high-importance items needing maintainer attention:

| Item | Age | Why it matters |
|---|---|---|
| [#50718](https://github.com/NousResearch/hermes-agent/issues/50718) Session visibility | Created **2026-06-22** (~4 months) | High-reaction (👍3), 12 comments, no fix PR. Foundational desktop UX. |
| [#18964](https://github.com/NousResearch/hermes-agent/issues/18964) Reticulum gateway | Created **2026-05-02** (~6 months) | Community-requested differentiator; unanswered for ~6 months. |
| [#48997](https://github.com/NousResearch/hermes-agent/issues/48997) Close abandoned runtime sessions | Created **2026-06-19** (~4 months) | Root cause of several downstream session bugs; no fix PR. |
| [#99943](https://github.com/NousResearch/hermes-agent/issues/99943) Compressor window clamp | Created **2026-09-01** (~2 months) | Silent correctness regression from v0.21.0; 12 comments; **no fix PR yet**. |
| [#115152](https://github.com/NousResearch/hermes-agent/pull/115152) narrow root deletion detection | PR created **2026-09-18** (~5 weeks) | Approval-safety change flagged `needs-decision`; awaiting maintainer call. |
| [#78274](https://github.com/NousResearch/hermes-agent/pull/78274) credential-pool 429 rotation | PR created **2026-08-04** (~3 months) | Addresses a live 10.4-minute stall; still open. |

**Watch assessment:** The backlog shows a **pattern of aging P2/P3 issues with no assigned fix PR**, particularly in the desktop/session and memory-compression domains. The `needs-decision` flag on #115152 (approval safety) suggests a maintainer bottleneck on judgment calls. For a project of this activity level, the **backlog-to-merge ratio (33 open PRs vs 17 closed)** warrants attention to prevent contributor fatigue.

---

*Digest generated from GitHub activity data for 2026-10-25. All links point to the public NousResearch/hermes-agent repository.*

</details>

<details>
<summary><strong>IronClaw</strong> — <a href="https://github.com/nearai/ironclaw">nearai/ironclaw</a></summary>

No activity in the last 24 hours.

</details>

<details>
<summary><strong>QwenPaw</strong> — <a href="https://github.com/agentscope-ai/QwenPaw">agentscope-ai/QwenPaw</a></summary>

# QwenPaw Project Digest — 2026-10-25

## 1. Today's Overview

QwenPaw shows **moderate-to-high development activity** over the last 24 hours, with 4 issues and 11 PRs updated. No new releases were published. The project remains in an active stabilization phase: most PR activity centers on bug fixes (Matrix sessions, Console model pool, docs anchors), while feature work continues on QQ channel streaming and memory integration (ReMe 0.4.2.0). A notable pattern is the concentration of small, low-risk documentation fixes from a single contributor (`c020627`), alongside larger architectural PRs that have been under review for weeks. Issue activity reveals recurring concerns around **silent failures** — cancelled agent sessions, reset channel flags, and audit logging gaps — suggesting observability and reliability are the community's dominant pain points.

---

## 2. Releases

**No new releases in the last 24 hours.** Latest known version referenced in issues is **v2.2.1** (QwenPaw Desktop, Windows 10 AMD64), cited in Issue #8252.

---

## 3. Project Progress

### Merged / Closed Today

- **PR #8411 [CLOSED] `fix(matrix): recover cached sessions and missing device keys`** — [link](https://github.com/agentscope-ai/QwenPaw/pull/8411)
  - Fixes #8365. Resolves a Matrix channel bug where password-authenticated channels re-login on every restart, and where homeserver-side removal of device encryption keys caused silent key-sharing failures while health checks still reported the channel as healthy. Marked `size/L`, closed with "close-and-review-later" — likely to be revisited.

- **Issue #8252 [CLOSED] `[Bug] Agent 间调用会话被静默取消（CancelledError）`** — [link](https://github.com/agentscope-ai/QwenPaw/issues/8252)
  - Closed after 4 comments. Reported silent cancellation of inter-agent `ChatWithAgent` calls (paired same-second cancellations, zero artifacts, no initiator/reason recorded). Code locations: `qwenpaw/hooks/error/error_hook.py:90` and `qwenpaw/runtime/run...`.

### PRs Advancing

- **PR #8409 [OPEN] `feat(channels): add QQ C2C streaming message support`** — [link](https://github.com/agentscope-ai/QwenPaw/pull/8409)
  - Implements `on_streaming_start/delta/end` hooks for the QQ channel via the official `POST /v2/users/{user_openid}/stream_messages` API, gated behind `QQ_STREAMING_ENABLED`. Addresses Issue #8307.

- **PR #8347 [OPEN] `feat(memory): integrate ReMe 0.4.2.0 with opt-in decision compaction, images and tags`** — [link](https://github.com/agentscope-ai/QwenPaw/pull/8347)
  - Upgrades `reme-ai` from `0.4.1.11` → `0.4.2.0`; adds default-off decision-model relevance compaction, conversation image memory, and entity tag generation. `size/XXXL` — the largest open PR.

- **PR #8408 [OPEN] `feat(console): server-provided default for assistant message display mode`** — [link](https://github.com/agentscope-ai/QwenPaw/pull/8408)
  - Pairs with Issue #8407; migrates the assistant-message-collapse preference from browser `localStorage` to a server-side `chat_display.assistant_message_display_mode` config key.

- **PR #8410 [OPEN] `fix(console): allow removing models from the pool`** — [link](https://github.com/agentscope-ai/QwenPaw/pull/8410)
  - Fixes #8195 by adding a Remove action (with confirmation) for provider-managed model entries.

---

## 4. Community Hot Topics

Ranked by comment count and discussion depth:

1. **Issue #8252 [CLOSED] — Silent CancelledError in inter-agent calls** — [link](https://github.com/agentscope-ai/QwenPaw/issues/8252) · 4 comments
   - **Underlying need:** Multi-agent fleet operators need **traceable cancellation semantics**. The bug combined three failure modes — same-second paired cancellations, zeroed artifacts, and no initiator/reason logging — making root-cause analysis impossible. The closure suggests a fix landed, but the pattern (silent failure) recurs across other issues today.

2. **Issue #8406 [OPEN] — QQ channel enabled flag silently reset to false** — [link](https://github.com/agentscope-ai/QwenPaw/issues/8406) · 2 comments
   - **Underlying need:** Config durability and **explicit state-change warnings**. Users are frustrated that a channel can be disabled without any notification.

3. **Issue #8412 [OPEN] — `governance/audit.db` stops recording tool calls per-agent despite `audit_level: all`** — [link](https://github.com/agentscope-ai/QwenPaw/issues/8412) · 1 comment
   - **Underlying need:** Compliance-grade auditability. Once an agent's audit rows stop, they **never resume** — a serious integrity issue for governance deployments.

4. **Issue #8407 [OPEN] — Server-side default for assistant message display mode** — [link](https://github.com/agentscope-ai/QwenPaw/issues/8407) · 1 comment
   - **Underlying need:** Team/self-hosted deployments want **centralized configuration** rather than per-browser preferences.

**Observation:** Three of the four most-discussed issues today involve *silent* or *invisible* state changes — cancellation without reason, flag reset without warning, audit rows stopping without alert. This is a coherent, high-value theme for the maintainers.

---

## 5. Bugs & Stability

Ranked by severity:

| Severity | Issue | Status | Fix PR |
|---|---|---|---|
| **High** | [#8412](https://github.com/agentscope-ai/QwenPaw/issues/8412) — `audit.db` permanently stops recording per-agent tool calls despite `audit_level: all`; agents keep writing files unlogged | OPEN | None identified |
| **High** | [#8252](https://github.com/agentscope-ai/QwenPaw/issues/8252) — Inter-agent `ChatWithAgent` sessions silently cancelled; no initiator/reason recorded | CLOSED | Landed (closed 2026-10-24) |
| **Medium-High** | [#8406](https://github.com/agentscope-ai/QwenPaw/issues/8406) — QQ channel `enabled` flag silently reset to `false`, no warning | OPEN | None identified |
| **Medium** | [#8365](https://github.com/agentscope-ai/QwenPaw/issues/8365) — Matrix channels re-login on restart; missing device keys cause silent key-sharing failures while health reports OK | Fix PR [#8411](https://github.com/agentscope-ai/QwenPaw/pull/8411) closed (close-and-review-later) | #8411 |

**Regressions / leaks also in flight:**
- **PR #7835** [Under Review] — `fix(memory): stop leaking auto-memory-recall payload to channels` — the synthetic memory-search trace is hidden in Console but **leaks to Feishu and other outbound channels**. [link](https://github.com/agentscope-ai/QwenPaw/pull/7835)
- **PR #7211** [Under Review] — `fix(runtime): prevent injected context from persisting` — `HookContext.inject_context()` content was being saved as user turns / searchable history. [link](https://github.com/agentscope-ai/QwenPaw/pull/7211)

---

## 6. Feature Requests & Roadmap Signals

| Request | Issue/PR | Likelihood in Next Version |
|---|---|---|
| QQ C2C streaming messages | [#8409](https://github.com/agentscope-ai/QwenPaw/pull/8409) / [#8307](https://github.com/agentscope-ai/QwenPaw/issues/8307) | **High** — PR open, scoped, gated behind existing flag |
| Server-side default for assistant message display mode | [#8407](https://github.com/agentscope-ai/QwenPaw/issues/8407) / [#8408](https://github.com/agentscope-ai/QwenPaw/pull/8408) | **High** — issue + PR filed same day, follows existing `/config/theme` pattern |
| Model removal from Console pool | [#8195](https://github.com/agentscope-ai/QwenPaw/issues/8195) / [#8410](https://github.com/agentscope-ai/QwenPaw/pull/8410) | **High** — small, well-scoped fix |
| ReMe 0.4.2.0 memory features (compaction, images, tags) | [#8347](https://github.com/agentscope-ai/QwenPaw/pull/8347) | **Medium** — `size/XXXL`, default-off, may need extended review |
| Aliyun Coding Plan catalog alignment guard | [#7390](https://github.com/agentscope-ai/QwenPaw/pull/7390) | **Medium** — regression test only, low risk but stale (open since Aug 28) |

**Prediction:** The next release is likely a **2.2.x patch** bundling the Console model-removal fix, QQ streaming support, and the server-side display-mode default, with the ReMe memory integration possibly deferred to a minor release.

---

## 7. User Feedback Summary

**Pain points expressed:**

1. **Silent failures erode trust.** Users repeatedly encounter state changes with no logging or warning — cancelled agent sessions (#8252), reset channel flags (#8406), audit logging gaps (#8412). The phrase "silently reset" and "no warning" appear verbatim.
2. **Multi-device / team deployment friction.** Preferences stored only in browser `localStorage` (#8407) mean settings are lost on cache clear and cannot be centrally managed — a direct blocker for self-hosted and team deployments.
3. **Governance/audit reliability is critical.** The `audit.db` issue (#8412) notes that "once an agent's rows stop, they never resume" while file writes continue — a compliance risk for regulated environments.
4. **Channel integration maturity.** Matrix (#8365), QQ (#8406, #8409), and Feishu (via #7835 leak) all show integration edge cases, indicating channels are a frequent source of friction.

**Satisfaction signals:** The rapid closure of #8252 (10 days from report to close) and same-day issue→PR pairing on #8407/#8408 show **responsive maintainership**. However, several PRs remain open for extended periods (#7390 since Aug 28, #7211 since Aug 21), which may frustrate contributors.

---

## 8. Backlog Watch

Long-unanswered or stale items needing maintainer attention:

| Item | Age | Status | Concern |
|---|---|---|---|
| [PR #7211](https://github.com/agentscope-ai/QwenPaw/pull/7211) — `fix(runtime): prevent injected context from persisting` | **65 days** (since 2026-08-21) | OPEN, `first-time-contributor`, `Under Review`, `ready-for-human-review` | First-time contributor; context-persistence bug affects conversation history integrity |
| [PR #7390](https://github.com/agentscope-ai/QwenPaw/pull/7390) — Aliyun Coding Plan catalog regression guard | **58 days** (since 2026-08-28) | OPEN | Fixes #6551; model list drift offered non-served models (`glm-5.2`, `glm-5.1`) |
| [PR #7835](https://github.com/agentscope-ai/QwenPaw/pull/7835) — stop leaking auto-memory-recall payload to channels | **38 days** (since 2026-09-17) | OPEN, `Under Review` | Data leak to outbound channels (Feishu, etc.) — privacy-adjacent |
| [PR #8347](https://github.com/agentscope-ai/QwenPaw/pull/8347) — ReMe 0.4.2.0 integration | **5 days** | OPEN, `size/XXXL` | Large surface area; may need reviewer bandwidth |

**Recommendation:** PRs #7211 and #7835 both address **data-integrity/privacy** concerns and have been `ready-for-human-review` or `Under Review` for over a month. Prioritizing these would reduce contributor churn and close meaningful correctness gaps.

</details>

<details>
<summary><strong>ZeroClaw</strong> — <a href="https://github.com/zeroclaw-labs/zeroclaw">zeroclaw-labs/zeroclaw</a></summary>

# ZeroClaw Project Digest — 2026-10-25

## 1. Today's Overview

ZeroClaw shows **high-velocity development activity** with 50 PRs and 17 issues updated in the last 24 hours, though only 2 PRs were merged/closed—suggesting a large review bottleneck or a wave of newly opened work. The v0.8.7 release is actively being prepared (PR #12011 bumps the version), and several release-blocking bugs tied to the `release:v0.8.7` label were closed today, indicating focused stabilization. However, the project carries meaningful risk signals: multiple **S0/S1 severity bugs** remain open (concurrent memory writes causing data loss, context-window fallback blocking valid turns), and two fresh RustSec advisories (RUSTSEC-2026-0385, RUSTSEC-2026-0386) are breaking the CI security job. Net assessment: **healthy contributor throughput, but a stressed merge pipeline and elevated stability/security debt ahead of the next release.**

## 2. Releases

**No new releases in the last 24 hours.** v0.8.7 is in active preparation:
- [PR #12011](https://github.com/zeroclaw-labs/zeroclaw/pull/12011) — `chore(release): bump version to v0.8.7` (coordinated workspace bump across `Cargo.toml`, `Cargo.lock`, Tauri config, `setup.bat`, crates.io/Discord metadata).

Several issues labeled `release:v0.8.7` were closed today (see §3), consistent with a release-candidate hardening push.

## 3. Project Progress

Only **2 PRs were merged/closed** in the last 24h; the sample provided focuses on newly opened work rather than merges, so merged content is largely unspecified in the data. On the issue side, **6 issues closed today**, several gating v0.8.7:

- [#10066](https://github.com/zeroclaw-labs/zeroclaw/issues/10066) [CLOSED] — SOP engine executed downstream steps before recording an output-schema rejection (P0, workflow-blocking). Follow-up tasks #11945/#11946 remain open.
- [#11899](https://github.com/zeroclaw-labs/zeroclaw/issues/11899) [CLOSED] — Gateway kept serving already-accepted connections using stale config after daemon reload.
- [#12009](https://github.com/zeroclaw-labs/zeroclaw/issues/12009) [CLOSED] — Security job fixed for two new RustSec advisories.
- [#11932](https://github.com/zeroclaw-labs/zeroclaw/issues/11932) [CLOSED] — Container CA bundle trusting distrusted emSign chains (S0).
- [#9592](https://github.com/zeroclaw-labs/zeroclaw/issues/9592) [CLOSED] — Provider alias probe read stale config snapshot.
- [#12016](https://github.com/zeroclaw-labs/zeroclaw/issues/12016) [CLOSED] — Feature request: hooks for embedded binaries.

**Features advancing in open PRs:** append-only session event history ([#11921](https://github.com/zeroclaw-labs/zeroclaw/pull/11921)), XMPP/OMEMO channel ([#11847](https://github.com/zeroclaw-labs/zeroclaw/pull/11847)), `send_via` file attachments under read policy ([#11997](https://github.com/zeroclaw-labs/zeroclaw/pull/11997)), inbound-only email channels ([#12003](https://github.com/zeroclaw-labs/zeroclaw/pull/12003)), cron jobs bound to originating conversation ([#11441](https://github.com/zeroclaw-labs/zeroclaw/pull/11441)), and a 12-part "Goal V1" proposal series ([#11879](https://github.com/zeroclaw-labs/zeroclaw/pull/11879)).

## 4. Community Hot Topics

Ranked by comment activity:

1. [#10066](https://github.com/zeroclaw-labs/zeroclaw/issues/10066) — **5 comments** (P0 SOP bug). Underlying need: **correct, deterministic workflow semantics** — steps must not run when a prior step's output fails validation.
2. [#10797](https://github.com/zeroclaw-labs/zeroclaw/issues/10797) — **3 comments** (S0 memory data loss). Need: **write serialization/durability guarantees** in the markdown memory backend.
3. [#9592](https://github.com/zeroclaw-labs/zeroclaw/issues/9592) — **3 comments**. Need: **config snapshot consistency** on model-routing updates.
4. [#12014](https://github.com/zeroclaw-labs/zeroclaw/issues/12014), [#12005](https://github.com/zeroclaw-labs/zeroclaw/issues/12005), [#11799](https://github.com/zeroclaw-labs/zeroclaw/issues/11799), [#11992](https://github.com/zeroclaw-labs/zeroclaw/issues/11992), [#11853](https://github.com/zeroclaw-labs/zeroclaw/issues/11853) — **2 comments each**. Recurring themes: **provider/model configuration ergonomics**, **shell policy safety and transparency**, and **email channel capabilities** (templated, sanitized outbound HTML).

Notably, PR comment counts are reported as `undefined`, so PR engagement cannot be compared reliably.

## 5. Bugs & Stability

Ranked by severity:

**S0 — Data loss / security risk**
- [#10797](https://github.com/zeroclaw-labs/zeroclaw/issues/10797) [OPEN, P1] — Markdown memory backend **silently loses entries when `store()` calls overlap** (concurrent rewrites from stale snapshot; no writer serialization). *No linked fix PR observed.*
- [#11932](https://github.com/zeroclaw-labs/zeroclaw/issues/11932) [CLOSED] — Container CA bundle trusted distrusted emSign chains. Fixed.

**S1 — Workflow blocked**
- [#10066](https://github.com/zeroclaw-labs/zeroclaw/issues/10066) [CLOSED] — SOP step promotion ran before output-schema rejection recorded. Closed; follow-up hardening in [#11945](https://github.com/zeroclaw-labs/zeroclaw/issues/11945)/[#11946](https://github.com/zeroclaw-labs/zeroclaw/issues/11946).
- [#12014](https://github.com/zeroclaw-labs/zeroclaw/issues/12014) [OPEN] — Custom OpenAI-compatible provider with no `context_window` **silently assumes 32,000 tokens, then rejects valid turns locally**. Fix PR candidate: [#12017](https://github.com/zeroclaw-labs/zeroclaw/pull/12017) ("context window is model metadata, not configuration").
- [#12009](https://github.com/zeroclaw-labs/zeroclaw/issues/12009) [CLOSED] — Security job failed every build on RUSTSEC-2026-0385 (ctutils 0.4.2) and RUSTSEC-2026-0386 (tokio 1.53.1). Closed.

**S2 — Degraded behavior**
- [#9592](https://github.com/zeroclaw-labs/zeroclaw/issues/9592) [CLOSED] — Provider probe used pre-update config snapshot after model-routing changes.

**S3 — Minor**
- [#12006](https://github.com/zeroclaw-labs/zeroclaw/issues/12006) [OPEN] — `tool_search` serves deferred tool schemas from a stale registry-build copy. Fix PR: [#12007](https://github.com/zeroclaw-labs/zeroclaw/pull/12007).
- [#11792](https://github.com/zeroclaw-labs/zeroclaw/issues/11792) [OPEN] — Interrupted `plugin install` leaves an abandoned `.<name>.installing-v1-<id>` staging directory.

**Regression**
- [#12005](https://github.com/zeroclaw-labs/zeroclaw/issues/12005) [OPEN] — PowerShell dialect rejects any command containing a bare `@`, breaking allowlisted mail CLIs (v0.8.6, tagged as regression).

**Security/CI**
- [#11853](https://github.com/zeroclaw-labs/zeroclaw/issues/11853) [OPEN, risk:high] — `npm audit` failed 2026-10-19 (1 high/critical finding).

## 6. Feature Requests & Roadmap Signals

User-requested features updated today:

- [#11799](https://github.com/zeroclaw-labs/zeroclaw/issues/11799) — Shell policy refusals should **name the refusing rule and accept an operator hint**.
- [#11992](https://github.com/zeroclaw-labs/zeroclaw/issues/11992) — **Email channel operator templates + sanitized HTML body** for `send_via`.
- [#11996](https://github.com/zeroclaw-labs/zeroclaw/issues/11996) — **Explicit `attachments` argument** for `send_via` checked under the read policy.
- [#12016](https://github.com/zeroclaw-labs/zeroclaw/issues/12016) [CLOSED] — **Hooks for embedded binaries** on chat and cron turns.

**Prediction for v0.9.0 / near term:** The `send_via` attachment work ([#11996](https://github.com/zeroclaw-labs/zeroclaw/issues/11996) → [PR #11997](https://github.com/zeroclaw-labs/zeroclaw/pull/11997)) and email channel improvements ([#11992](https://github.com/zeroclaw-labs/zeroclaw/issues/11992), [PR #12003](https://github.com/zeroclaw-labs/zeroclaw/pull/12003)) are likely to land together as a cohesive "outbound channels" milestone. Policy transparency ([#11799](https://github.com/zeroclaw-labs/zeroclaw/issues/11799)) is lower-effort and plausible for v0.8.7/v0.9.0. The multi-part **Goal V1** RFC series and **append-only session history** ([#11921](https://github.com/zeroclaw-labs/zeroclaw/pull/11921)) signal larger architectural work targeted beyond the immediate release.

## 7. User Feedback Summary

- **Configuration friction is the dominant pain point.** Users repeatedly hit issues where config snapshots go stale ([#9592](https://github.com/zeroclaw-labs/zeroclaw/issues/9592)), context windows fall back silently to 32K and then reject valid requests ([#12014](https://github.com/zeroclaw-labs/zeroclaw/issues/12014)), and shell policy blocks legitimate commands with opaque errors ([#11799](https://github.com/zeroclaw-labs/zeroclaw/issues/11799), [#12005](https://github.com/zeroclaw-labs/zeroclaw/issues/12005)).
- **Data integrity trust concerns.** The S0 concurrent-write memory loss ([#10797](https://github.com/zeroclaw-labs/zeroclaw/issues/10797)) is exactly the class of bug that erodes confidence in an agent's long-term memory.
- **Real operational use cases surface clearly:** allowlisted external mail CLIs on Windows ([#12005](https://github.com/zeroclaw-labs/zeroclaw/issues/12005)), IMAP-only mailboxes without SMTP ([#12003](https://github.com/zeroclaw-labs/zeroclaw/pull/12003)), and embedded-binary integrations ([#12016](https://github.com/zeroclaw-labs/zeroclaw/issues/12016))—indicating production adoption beyond hobby use.
- **Satisfaction signal:** fast turnaround on high-severity issues (four of today's closed issues were P0/P1) suggests maintainers are responsive. **Dissatisfaction signal:** high-severity bugs persisting for weeks (e.g., #10797 opened 2026-09-12, still open) and CI security breakage.

## 8. Backlog Watch

Items needing maintainer/community attention:

- [#10797](https://github.com/zeroclaw-labs/zeroclaw/issues/10797) — **S0 data-loss bug open since 2026-09-12** with no linked fix PR. Highest-priority unattended risk.
- [#11853](https://github.com/zeroclaw-labs/zeroclaw/issues/11853) — `npm audit` failure open since 2026-10-19 (risk:high), unresolved.
- [#12014](https://github.com/zeroclaw-labs/zeroclaw/issues/12014) — Fresh (opened 2026-10-24) S1 context-window bug; watch whether [#12017](https://github.com/zeroclaw-labs/zeroclaw/pull/12017) gains traction.
- [#9420](https://github.com/zeroclaw-labs/zeroclaw/pull/9420) — Long-running Anthropic OAuth profile PR (**opened 2026-07-26**, trusted contributor, risk:high) still open after ~3 months; may need review bandwidth or rebase guidance.
- [#11663](https://github.com/zeroclaw-labs/zeroclaw/pull/11663) — Memory supersession evidence fix (opened 2026-10-11, size:L), relevant to memory reliability.
- [#10446](https://github.com/zeroclaw-labs/zeroclaw/pull/10446) — Security-relevant fix for tool-call envelopes leaked into prose (opened 2026-08-29, risk:high), still open ~2 months.
- [#11441](https://github.com/zeroclaw-labs/zeroclaw/pull/11441) / [#11422](https://github.com/zeroclaw-labs/zeroclaw/pull/11422) — **Stacked PRs with merge dependencies** (#11438, #11440, #11411); stacked chains can stall if blockers aren't prioritized.

---

**Health verdict:** Strong contributor engagement and disciplined release coordination, but the **48 open vs. 2 closed PR ratio** and several **long-lived high-severity issues** warrant attention. Clearing the S0 memory data-loss bug and the CI security advisories should precede or accompany the v0.8.7 cut.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*