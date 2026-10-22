# OpenClaw Ecosystem Digest 2026-10-23

> Issues: 500 | PRs: 500 | Projects covered: 5 | Generated: 2026-10-22 23:57 UTC

- [OpenClaw](https://github.com/openclaw/openclaw)
- [Hermes Agent](https://github.com/nousresearch/hermes-agent)
- [IronClaw](https://github.com/nearai/ironclaw)
- [QwenPaw](https://github.com/agentscope-ai/QwenPaw)
- [ZeroClaw](https://github.com/zeroclaw-labs/zeroclaw)

---

## OpenClaw Deep Dive

# OpenClaw Project Digest — 2026-10-23

## 1. Today's Overview

OpenClaw shows **very high triage throughput** on 2026-10-22 into 2026-10-23: 500 issues and 500 PRs were touched in the last 24h, with a heavy closure bias on issues (418 closed vs. 82 open/active) and a substantial merge/close rate on PRs (288 merged/closed vs. 212 still open). The dominant driver of churn is the **October 2026 Node.js runtime security patch**, which has spawned parallel backport PRs across stable, beta, and extended-stable branches (v2026.10.6, v2026.10.10, v2026.9.33). Beneath that, the top-commented issue list is unusually concentrated on **agent memory trust, secret leakage, and multi-agent session-state integrity** — suggesting the community's center of gravity has shifted from feature velocity to hardening the agent runtime. Overall project health reads as **active and security-focused**, but the P1 backlog (session-state loss, message-loss, crash-loops, persistent memory timeouts) indicates stability debt is accumulating faster than it is being retired.

## 2. Releases

**v2026.10.6** — `openclaw 2026.10.6`

- **Highlights:** Requires a **patched Node runtime** — Node **24.22.1+** on the 24 line or **26.12.1+** on the 26 line. These versions reject TLS chains signed with keys compromised in the October 2026 Node.js security releases. Docker images ship with the patched Node 24.2x runtime.
- **Breaking change / migration note:** Users on unpatched Node builds (including many stock Docker/CI images and pinned Alpine bases) will fail TLS validation against affected certificate chains. Operators must upgrade Node **before** upgrading OpenClaw, or use the official Docker images.
- **Backport wave:** Three follow-on PRs are in flight to propagate the same runtime floor across release channels:
  - [#181072](https://github.com/openclaw/openclaw/pull/181072) — backport to **2026.10.6** (stable), retaining pnpm 12.15.0 floor.
  - [#181074](https://github.com/openclaw/openclaw/pull/181074) — backport to **2026.10.10** (beta), adds pnpm 12.15.0 requirement and Alpine CA alignment.
  - [#181073](https://github.com/openclaw/openclaw/pull/181073) — backport to **2026.9.33** (extended-stable), includes lockfile regeneration.

## 3. Project Progress

While individual merge dispositions for many of today's 288 merged/closed PRs are not itemized above, the visible trajectory of closed/advanced work includes:

- **UI performance campaign (steipete):** A cluster of deferred-loading PRs opened today targeting chat boot payload: [#181067](https://github.com/openclaw/openclaw/pull/181067) (Claw review content), [#181062](https://github.com/openclaw/openclaw/pull/181062) (image/browser code, −9.3 KB gzip), [#181077](https://github.com/openclaw/openclaw/pull/181077) (dictation capture), [#181059](https://github.com/openclaw/openclaw/pull/181059) (Online sidebar, −1.6 KB), [#181031](https://github.com/openclaw/openclaw/pull/181031) (English copy + grammars), [#181052](https://github.com/openclaw/openclaw/pull/181052) (tool rendering, −12 KB), [#181023](https://github.com/openclaw/openclaw/pull/181023) (dialogs/effort), [#181068](https://github.com/openclaw/openclaw/pull/181068) (emoji catalogs, −16.4 KB). This is a coordinated bundle-reduction effort.
- **Session/memory integrity fixes:** [#181081](https://github.com/openclaw/openclaw/pull/181081) preserves concurrent session-memory captures (closes #159826); [#181098](https://github.com/openclaw/openclaw/pull/181098) bounds stalled session archive/reconciliation work.
- **Gateway resilience:** [#181089](https://github.com/openclaw/openclaw/pull/181089) resumes saved inputs after crash-loop quarantine; [#181082](https://github.com/openclaw/openclaw/pull/181082) fixes forwarded cron frame projection errors; [#181097](https://github.com/openclaw/openclaw/pull/181097) surfaces hostname drift in restart ownership refusal.
- **Plugin/feature landings:** [#180139](https://github.com/openclaw/openclaw/pull/180139) bundles the Knowledge memory plugin (off by default); [#181095](https://github.com/openclaw/openclaw/pull/181095) adds Control UI theme preview.
- **Closed issues advancing roadmap intent:** #7707 (memory trust tagging), #11829 (API key protection roadmap), #22438 (tiered bootstrap loading), #13583 (pre-response hard gates), and #8719 (data-centric security profile v1.1) all closed today — several flagged *needs-product-decision* / *needs-security-review*, so closure likely means "routed to a decision," not necessarily "shipped."

## 4. Community Hot Topics

Ranked by comment count:

| Rank | Item | Comments | Signal |
|---|---|---|---|
| 1 | [#7707 Memory Trust Tagging by Source](https://github.com/openclaw/openclaw/issues/7707) *(closed)* | 38 | Memory-poisoning defense; labeled `impact:security`, `impact:session-state` |
| 2 | [#11829 Security Roadmap: Protecting API Keys from Agent Access](https://github.com/openclaw/openclaw/issues/11829) *(closed)* | 21 | Keys currently serialized into prompts — direct LLM leak vector |
| 3 | [#22438 Tiered bootstrap file loading](https://github.com/openclaw/openclaw/issues/22438) *(closed)* | 20 | Context-window cost control; PR linked |
| 4 | [#68596 Configurable streaming watchdog timeout](https://github.com/openclaw/openclaw/issues/68596) *(closed)* | 18 (👍8) | Reasoning-model users hit spurious 30s watchdog resets |
| 5 | [#13583 Pre-response enforcement hooks (hard gates)](https://github.com/openclaw/openclaw/issues/13583) *(closed)* | 17 (👍2) | Mechanical "must call tool X" enforcement for high-stakes workflows |
| 6 | [#53763 Built-in headless browser](https://github.com/openclaw/openclaw/issues/53763) *(closed)* | 17 | Removes dependency on user Chrome / 3rd-party APIs |
| 7 | [#43367 Multi-agent orchestration instability](https://github.com/openclaw/openclaw/issues/43367) *(closed)* | 16 | Concurrent `agents add` config overwrite, session-lock failures |

**Underlying needs:** The top of the list is dominated by **trust and isolation boundaries** — where memory came from, what the LLM can see of credentials, and how sub-agents are gated. The next tier is **operational reliability** of multi-agent runs and long-reasoning models. Notably, the highest-comment issue of the day was **closed**, which suggests maintainers are actively clearing the security/architecture backlog rather than deferring it.

Most active PR today: [#176964](https://github.com/openclaw/openclaw/pull/176964) (background summarization no longer delays replies — flagged `merge-risk: compatibility`) and the multi-branch security backports, which collectively touch docs, macOS, gateway, CLI, Docker, and QA-lab surfaces.

## 5. Bugs & Stability

Ranked by severity, with fix-PR status:

**P1 — Critical / blocking**
- [**#172837**](https://github.com/openclaw/openclaw/issues/172837) *(OPEN)* — Codex `nativeSubagentAssignments` never removed after completion delivery gives up; every new parent thread re-pins and re-sends them. `impact:session-state`, `impact:message-loss`. **No fix PR identified.**
- [**#158127**](https://github.com/openclaw/openclaw/issues/158127) *(OPEN)* — 2026.9.6 multi-agent runtime publication failures + separate Codex startup timeouts (`prepared model runtime publication was superseded`). `impact:message-loss`, `impact:auth-provider`. Needs info.
- [**#128140**](https://github.com/openclaw/openclaw/issues/128140) *(OPEN)* — `memory_search` tool **always times out at 15s** while CLI `openclaw memory search` works. `impact:session-state`. Long-lived (opened 2026-08-23), needs live repro.
- [**#51396**](https://github.com/openclaw/openclaw/issues/51396) *(closed)* — `clearUnboundScopes()` strips operator scopes unconditionally for non-local token-auth clients, breaking `chat.send`. Regression, `impact:security`, `impact:message-loss`. Linked PR open.
- [**#43996**](https://github.com/openclaw/openclaw/issues/43996) *(closed)* — Sandbox container exits immediately under `no-new-privileges` (`exec /usr/bin/sleep: operation not permitted`). `impact:crash-loop`. Source repro present.
- [**#53008**](https://github.com/openclaw/openclaw/issues/53008) *(closed)* — Memory compaction blocked the main processing lane for 10+ min, queueing all Telegram messages. `impact:session-state`, `impact:ux-friction`.

**P2 — High impact**
- [#53628](https://github.com/openclaw/openclaw/issues/53628) — `${XDG_CONFIG_HOME}` not interpolated during skill install (Docker). *(closed)*
- [#51429](https://github.com/openclaw/openclaw/issues/51429) — Hardcoded `/Users/wangtao` workspace path leaked into a released build. *(closed)*
- [#43367](https://github.com/openclaw/openclaw/issues/43367) — Concurrent multi-agent orchestration failures. *(closed)*
- [#52238](https://github.com/openclaw/openclaw/issues/52238) — Feishu topic groups misclassified as p2p → misrouted sessions. *(closed)*
- [#53783](https://github.com/openclaw/openclaw/issues/53783) — Telegram group cross-agent `sessions_list` visibility mismatch → one-way `sessions_send` failure. *(closed)*
- [#165421](https://github.com/openclaw/openclaw/issues/165421) *(OPEN, stale)* — Control UI context-window widget renders stale `maxTokens` (128k) after model switch. Cosmetic but misleading.
- [#154716](https://github.com/openclaw/openclaw/issues/154716) *(OPEN)* — Native Claude CLI auth yields `auth-unknown`, blocks saved-history reseed.

**Assessment:** Several high-severity items are now **closed with linked PRs**, which is a healthy sign. However, the **P1 open set is concentrated in session-state loss and message-loss**, and #128140 has been open for ~2 months — a candidate for escalation.

## 6. Feature Requests & Roadmap Signals

Most-requested / most-discussed features updated today:

1. **Memory trust tagging by source** ([#7707](https://github.com/openclaw/openclaw/issues/7707)) and **memory audit log** ([#20935](https://github.com/openclaw/openclaw/issues/20935)) — the community is converging on provenance-tracked memory as the anti-poisoning primitive.
2. **API key isolation from the LLM** ([#11829](https://github.com/openclaw/openclaw/issues/11829)) — likely to manifest as a secrets-broker pattern in core.
3. **Pre-response hard gates** ([#13583](https://github.com/openclaw/openclaw/issues/13583)) and **per-spawn tool restrictions for sub-agents** ([#15032](https://github.com/openclaw/openclaw/issues/15032)) — mechanical policy enforcement, not prompt-based.
4. **Tiered bootstrap loading** ([#22438](https://github.com/openclaw/openclaw/issues/22438)) and **multi-slot memory architecture** ([#60572](https://github.com/openclaw/openclaw/issues/60572)) — context-budget and plugin-composition control.
5. **Streaming watchdog configurability** ([#68596](https://github.com/openclaw/openclaw/issues/68596)) — a small, low-risk knob highly likely to land soon.
6. **Built-in headless browser** ([#53763](https://github.com/openclaw/openclaw/issues/53763)) and **per-user skill preference overrides** ([#48918](https://github.com/openclaw/openclaw/issues/48918)).

**Prediction for next version:** The **watchdog timeout config** and **tiered bootstrap loading (linked PR open)** are the most likely near-term landings. The **security-profile / hard-gate cluster** is more likely to appear as opt-in config flags (`operator.write.no-credential…` from [#179959](https://github.com/openclaw/openclaw/pull/179959) hints at this direction) than as default-on behavior.

## 7. User Feedback Summary

**Pain points voiced:**
- **Reasoning-model users are punished by fixed watchdogs** — kimi-k2.5 / DeepSeek-R1 users see spurious `streaming watchdog: no stream updates for 30s; resetting status` resets (#68596).
- **Multi-agent orchestration is unreliable in practice** — concurrent config writes, session-lock failures, detached children (#43367), and Telegram group visibility mismatches (#53783).
- **Memory is a weak point both ways:** memory compaction can freeze the whole bot (#53008), while `memory_search` from the tool path times out even when the CLI works (#128140).
- **Channel routing confusion** — Telegram DMs still land in `agent:main:main` (#41165); Feishu topic groups route to web instead of the group (#52238); cross-account Matrix mention gating dispatches to the wrong bot (#45184).
- **Deployment friction** — absence of an official AWS deployment guide (EC2/ECS/Lambda) (#13597, 👍4) and XDG_CONFIG_HOME mishandling in Docker skill installs (#53628).

**Satisfaction signals:** Issues with high upvote counts tend to be **affirmations of existing behavior** (e.g., 👍8 on the streaming watchdog request) — users are generally engaged and constructive. The heavy contributor activity from steipete and roboclaw-bot on UI perf suggests responsiveness to "app feels heavy" feedback.

**Dissatisfaction:** Releases shipping **hardcoded personal paths** (#51429) and **insecure defaults around API keys** (#11829) are the sharpest dissatisfaction signals, both now closed.

## 8. Backlog Watch

Items needing maintainer attention (long-lived, high-impact, or labeled `needs-maintainer-review` / `needs-product-decision`):

- [**#128140**](https://github.com/openclaw/openclaw/issues/128140) *(OPEN since 2026-08-23, P1)* — `memory_search` tool always times out. Two months old with 9 comments; `clawsweeper:needs-live-repro` has stalled progression. **Highest priority for a triage sprint.**
- [**#158127**](https://github.com/openclaw/openclaw/issues/158127) *(OPEN since 2026-09-25, P1)* — multi-agent runtime publication failures. Needs info; user impact is message loss.
- [**#154716**](https://github.com/openclaw/openclaw/issues/154716) *(OPEN since 2026-09-21, P2)* — native Claude CLI auth boundary blocks history reseed. A UX/security boundary decision is required.
- [**#172837**](https://github.com/openclaw/openclaw/issues/172837) *(OPEN since 2026-10-15, P1)* — stale `nativeSubagentAssignments` re-pinning. Newly P1-tagged, no fix PR.
- [**#165421**](https://github.com/openclaw/openclaw/issues/165421) *(OPEN, stale, P2)* — Control UI stale maxTokens. Cosmetic, but users report it misleads operators.
- [**#50291**](https://github.com/openclaw/openclaw/issues/50291) *(OPEN, stale, P2)* — Plugin Hooks missing trace context (`messageId`, `runId`, `parentSpanId`). Blocks third-party observability tooling; `needs-product-decision`.
- [**#178755**](https://github.com/openclaw/openclaw/pull/178755) *(OPEN, `security-review-required`)* — preserve agent stores during controlled Gateway handoff. Marked `🚨 security-boundary`, `📣 needs proof`.

**Closing note:** The project's triage rate today is impressive (418 issue closures), but the pattern of **closing high-value security/architecture issues while the P1 session-state backlog sits open** suggests the maintainer team is prioritizing policy decisions over runtime fixes. The Node runtime security wave is being handled quickly and competently across all release channels — a strong operational signal.

---

## Cross-Ecosystem Comparison

# Cross-Project Comparison Report: Personal AI Assistant / Agent Open-Source Ecosystem
**Date: 2026-10-23 | Scope: OpenClaw, Hermes Agent, IronClaw, QwenPaw, ZeroClaw**

---

## 1. Ecosystem Overview

The personal AI assistant / agent open-source landscape has entered a **hardening phase** in late 2026. Across all five projects, the dominant activity is no longer feature expansion but **security remediation, session-state integrity, plugin isolation, and release-quality assurance**. A shared Node.js/emSign CA trust event is rippling through multiple projects simultaneously, and several communities are converging on the same architectural asks: provenance-tracked memory, credential isolation from LLMs, approval-mode trust boundaries, and deterministic/replayable session state. Meanwhile, the **agent-harness benchmark culture** (IronClaw) and **multi-surface parity requirements** (Hermes, ZeroClaw) reveal that users are treating agents as production infrastructure rather than toys. The center of gravity has shifted from "what can the agent do?" to "can we trust it with our keys, our files, our sessions, and our money?"

---

## 2. Activity Comparison

| Project | Issues (24h) | PRs (24h) | Release Status | Health Score* | Primary Constraint |
|---|---|---|---|---|---|
| **OpenClaw** | 500 touched (418 closed / 82 open) | 500 touched (288 merged / 212 open) | v2026.10.6 shipped; backports to 2026.10.10 / 2026.9.33 | **8.5 / 10** | P1 session-state backlog aging; triage outpaces fixes |
| **Hermes Agent** | 50 touched (5 closed / 45 open) | 50 touched (15 merged / 35 open) | No release; v0.22.5-rc.1 in E2E | **6.5 / 10** | Unified-gateway regression debt (PR #106742 fallout) |
| **IronClaw** | 2 touched (1 closed / 1 open) | 50 touched (**0 merged** / 50 open) | None | **5.5 / 10** | **Merge bottleneck** — 4-month-old high-severity PRs |
| **QwenPaw** | 13 touched (**0 closed** / 13 open) | 26 touched (6 merged / 20 open) | **v2.2.2.post1 shipped** (security) | **7.0 / 10** | Post-upgrade regressions; zero-issue-closure day |
| **ZeroClaw** | 50 touched (12 closed / 38 open) | 50 touched (8 closed / 42 open) | None; v0.8.7 / v0.9.0 in prep | **8.0 / 10** | Two S0/S1 open bugs without fix PRs |

*Health score is a composite of throughput, responsiveness, backlog age, release cadence, and unresolved severity. Scores are relative, not absolute.*

**Reading the table:**
- **OpenClaw** operates at an order of magnitude more throughput than peers — 418 issue closures in 24h is an outlier even for large projects, driven by an aggressive triage sprint.
- **IronClaw's** 0-merge day with 50 open PRs is the single most alarming throughput signal in the set.
- **QwenPaw** has the most *disciplined* security response (same-day patch) but the weakest issue-resolution velocity.
- **ZeroClaw** and **Hermes** are the most balanced in terms of closed/open ratios.

---

## 3. OpenClaw's Position

**Advantages vs. peers:**
- **Scale of contributor response:** OpenClaw's closure rate (418 issues/day) is ~7–80× peer volumes, indicating either a much larger maintainer team or a mature automation-assisted triage pipeline (`clawsweeper` labels suggest bot-assisted workflows).
- **Release engineering discipline:** Multi-branch security backporting (stable / beta / extended-stable) is a practice no peer matches — Hermes and ZeroClaw have no equivalent parallel-channel strategy.
- **Bundled UI performance campaign:** steipete's coordinated bundle-reduction PRs (−9.3 KB, −12 KB, −16.4 KB gzip deltas) demonstrate a level of frontend engineering rigor absent from peers.
- **Kernel of the ecosystem:** OpenClaw is treated as the "core reference" — its roadmap decisions (secrets-broker pattern, hard gates, tiered bootstrap) are likely to propagate.

**Technical approach differences:**
- OpenClaw leans heavily on a **plugin/multi-slot memory architecture** (#60572) plus **runtime-level policy enforcement** (pre-response hard gates #13583, per-spawn tool restrictions #15032) — a "policy at the runtime edge" strategy.
- Peer ZeroClaw pursues the same policy goal but from a **WASM sandboxing + capability-denial** angle; OpenClaw's approach is lighter-weight but more invasive to the prompt/session layer.
- Hermes and IronClaw emphasize **observability-first agent loops** (Hermes via gateway tracing; IronClaw via benchmark-driven harness fixes) — a different axis from OpenClaw's session-integrity focus.

**Community size comparison:**
- OpenClaw's comment-engagement on top issues (38, 21, 20, 18 comments) is 2–4× Hermes' top threads (213 in a single mega-tracker, but that reflects a *single* controversial merge) and ~3–4× ZeroClaw's (15, 13, 10).
- QwenPaw and IronClaw have the smallest engaged communities — QwenPaw's top issue has 10 comments over 8 months; IronClaw lacks populated comment counts entirely, suggesting a developer-first rather than community-driven audience.

**Verdict:** OpenClaw is the ecosystem's **operational and architectural anchor**. Its main risk is not capability but **stability debt in P1 session/message-loss issues** (#128140 open ~2 months; #172837 is new but has no fix PR), which could erode its lead if competitors stabilize faster.

---

## 4. Shared Technical Focus Areas

Five requirements recur across multiple projects — these are ecosystem-level, not project-specific:

### 4.1 Memory Provenance & Trust Tagging
- **OpenClaw:** #7707 (Memory Trust Tagging by Source, 38 comments), #20935 (memory audit log)
- **Hermes:** #135039 (MEMORY.md/USER.md budget + acceptance pipeline), #116673 (doc-chain anchors)
- **Shared need:** Write-time verification, source attribution, and per-entry budgets for memory injected on every turn.

### 4.2 Credential Isolation from the LLM
- **OpenClaw:** #11829 (API keys currently serialized into prompts), #179959 (`operator.write.no-credential…` flag)
- **Hermes:** implicit in smart-approval trust boundary concerns (#141346)
- **ZeroClaw:** #11679 (zerocode mTLS bearer parity)
- **Shared need:** A secrets-broker pattern that keeps credentials out of the model context window entirely.

### 4.3 Approval-Mode Trust Boundaries for OS Automation
- **Hermes:** #141346 (P0 — `smart` auto-approved destructive `osascript`; unsaved PowerPoint deleted)
- **ZeroClaw:** #9394 (pairing codes never expire; config key silently ignored)
- **OpenClaw:** #13583 (pre-response hard gates), #15032 (per-spawn tool restrictions)
- **Shared need:** Mechanical, per-tool policy enforcement — not prompt-based; users want provable guarantees, not probabilistic ones.

### 4.4 Deterministic / Replayable Session State
- **OpenClaw:** #172837 (stale subagent assignments), #128140 (memory_search timeout), #181081 (concurrent memory captures)
- **Hermes:** unified-gateway P2 cluster — #142731 (admission_conflict never recovers), #142844 (un-drainable sessions), #143197 (session key ignored)
- **ZeroClaw:** #10526 (append-only event history RFC, closed), #11711 (trim destructively deletes history)
- **Shared need:** Event-sourced (or at least auditable) session state that survives crashes, reloads, and gateway handoffs.

### 4.5 Release/Supply-Chain Trust Consolidation
- **OpenClaw:** Node 24.22.1+ / 26.12.1+ runtime floor; three-channel backport
- **QwenPaw:** emSign CA remediation + Node 22.23.4 pin for CVE-2026-111497 / 105481
- **ZeroClaw:** #11932 (container CA bundle still distrusted emSign), #9101 (consolidate 3 attestation mechanisms → ~20 assets)
- **Shared need:** One verifiable signing/trust story per project, plus consistent CA trust across container images, CI, and installers.

**Cross-cutting observation:** The **emSign CA trust issue is the first true ecosystem-wide security event of the cycle** — appearing independently in OpenClaw (Node runtime), QwenPaw (dependency/installer/build), and ZeroClaw (container CA bundle). Projects with faster, cleaner remediation (OpenClaw, QwenPaw) will be structurally advantaged.

---

## 5. Differentiation Analysis

| Dimension | OpenClaw | Hermes Agent | IronClaw | QwenPaw | ZeroClaw |
|---|---|---|---|---|---|
| **Feature focus** | Session/memory integrity + policy hard gates | Unified gateway + multi-surface parity | Agent harness + benchmark scores | Hub multi-user + channel plugins | Sandboxing + gateway lifecycle + email |
| **Target user** | Power users, plugin developers | Desktop / TUI / CLI multi-surface users | Benchmarking / eval-first developers | Team/multi-user deployers | Security-conscious self-hosters |
| **Architecture** | Plugin slots, runtime policy, multi-channel backports | Single unified gateway owning all sessions | `reborn` runtime, benchmark-profile harnesses | Hub control-plane, channels-as-plugins | WASM plugin sandbox, mTLS identity, event-sourced sessions |
| **Signature risk** | P1 session-state / message-loss backlog | Regression debt from one mega-merge | Merge bottleneck (0/50) | Post-upgrade regression cluster | Two S0/S1 bugs without fix PRs |
| **Release cadence** | Fast, multi-channel | Slow (v0.22.4 → rc) | None | Same-day security patches | Pre-release hardening |

**Key differentiators:**
- **OpenClaw** is the broadest in scope and the only project with a formalized multi-channel backport discipline. It competes on **architectural centrality**.
- **Hermes** is the most ambitious on **cross-surface unification** — but paid heavily for it (PR #106742's regression debt). Its strength is Desktop/TUI/CLI parity; its weakness is that a single architectural bet dominates its risk profile.
- **IronClaw** is the only project optimizing explicitly for **benchmark reproducibility** ("eval-driven development"). It targets a narrower audience (harness builders) but produces the most quantitatively-grounded fixes.
- **QwenPaw** is the only project with a clear **multi-user / team deployment** story (Hub, global Skill/MCP inheritance request #8275). Its Chinese-ecosystem channel coverage (QQ, Feishu) is a unique moat.
- **ZeroClaw** is the most **security-first by design** (WASM sandbox, mTLS, capability denials, attestation consolidation), and the most explicit about supply-chain hygiene.

---

## 6. Community Momentum & Maturity

**Activity tiers:**

| Tier | Projects | Characterization |
|---|---|---|
| **Tier 1 — High velocity, stabilizing** | OpenClaw | Massive triage throughput; aggressively closing security/architecture issues; risk is P1 backlog aging |
| **Tier 1 — High velocity, iterating** | Hermes, ZeroClaw | 50 issues + 50 PRs/day; both mid-cycle hardening; Hermes recovering from a bad merge, ZeroClaw prepping v0.8.7/v0.9.0 |
| **Tier 2 — Moderate, strained** | QwenPaw | Solid PR throughput but zero issue closures; strong security discipline offset by post-upgrade friction |
| **Tier 3 — Active but bottlenecked** | IronClaw | High PR volume, zero merge throughput; developer-driven, low community engagement signal |

**Rapidly iterating:**
- **ZeroClaw** — v0.9.0 roadmap (runtime/dashboard sign-in/gateway + event-sourced sessions + zerocode mTLS) is the most clearly articulated strategic pivot in the set.
- **QwenPaw** — plugin isolation (#8187), shared desktop daemon (#8373), PawApp SDK redesign (#7874) point to a modularity-focused next cycle.

**Stabilizing / hardening:**
- **OpenClaw** — post-security-wave, closing long-lived architecture issues, bundling UI perf.
- **Hermes** — post-merge triage; the unified-gateway tracker (#134889) is closed; fixes are landing incrementally.
- **ZeroClaw** — pre-release discipline; many issues closed within 1–3 days of filing.

**Concerning maturity signal:**
- **IronClaw** — 50 open PRs, 0 merges, and #5353 (a High-severity user-facing bug with trace evidence) open ~4 months. This project's community cannot self-serve progress; maintainer bandwidth is the binding constraint.

**Community composition:**
- OpenClaw and Hermes show **community-authored PRs** (dokterdok, marioGusmao, teknium1 for Hermes; steipete, roboclaw-bot for OpenClaw) — healthy contributor pipelines.
- ZeroClaw shows **disciplined issue-to-PR linkage** ("Fixes #NNNN" consistently present).
- QwenPaw has **first-time contributors landing meaningful PRs** (#8376) — a positive onboarding signal.
- IronClaw's contributors appear concentrated (pranavraja99) with Dependabot noise — lower contributor diversity.

---

## 7. Trend Signals

Five industry-level trends for AI agent developers, extracted from cross-project community feedback:

### Trend 1: Trust boundaries are the new feature frontier
Across every project, the highest-engagement issues revolve around **what the agent can see, touch, or destroy**. The Hermes PowerPoint data-loss incident (#141346) and OpenClaw's prompt-serialized API keys (#11829) are the clearest evidence. **Actionable:** Design agents with per-tool approval scopes, credential brokers, and provenance-tagged memory from day one — bolting these on later is expensive (Hermes is proving this in real time).

### Trend 2: Session state must be event-sourced, not row-mutated
Convergent signals: OpenClaw's stale subagent assignments (#172837), Hermes' un-drainable sticky sessions (#142731, #142844), ZeroClaw's append-only session RFC (#10526), and ZeroClaw's destructive trim (#11711) all point the same way. **Actionable:** Treat sessions as append-only logs with derived projections; mutable conversation rows will keep producing P1 bugs at scale.

### Trend 3: Releases are where trust is won or lost
Same-day security patches (QwenPaw's post1), multi-channel backports (OpenClaw), and a formalized advisory (QwenPaw security notice) contrast sharply with **post-upgrade regression clusters** and **disjointed attestation mechanisms** (ZeroClaw #9101: 53 assets, 3 signing systems). **Actionable:** Invest in pre-release regression coverage (QwenPaw's test-coverage PRs #8380–#8383 are a good template) and consolidate to a single signing/CA-trust story.

### Trend 4: Benchmark-driven development is maturing
IronClaw's daily failure taxonomy (#8153), aggregate harness evaluation (#5298), and self-verification passes (#6093) represent the most rigorous "eval-driven" workflow in the set. As agents move into higher-stakes workflows, **quantitative grounding for fixes will become table stakes**. **Actionable:** Instrument agent loops with trace-level evidence; enforce benchmark deltas as merge gates.

### Trend 5: The multi-surface / multi-agent orchestration gap is real and unsolved
Every project has an open or recently-closed issue here:
- OpenClaw: #43367 (multi-agent orchestration instability), #53783 (cross-agent session visibility)
- Hermes: #97681 (cross-gateway Bot collaboration), #142248 (Desktop Group Chats lost features)
- QwenPaw: #8275 (global Skill/MCP management for Hub)
- ZeroClaw: #7432 (runtime/gateway tracker)

**Actionable:** The "single gateway owns every session" (Hermes) vs. "federated cross-gateway collaboration" (Hermes #97681, OpenClaw #43367) debate is unsettled. Expect standardization pressure — likely around session-identity, ownership transfer, and capability advertisement protocols.

---

## Bottom Line for Technical Decision-Makers

- **For stability-first deployments:** OpenClaw (triage discipline) or ZeroClaw (pre-release hardening) are the safest bets today. Avoid Hermes until the unified-gateway regression cluster (#106742 fallout) is retired.
- **For eval/benchmark-driven teams:** IronClaw's methodology is best-in-class, but do not depend on it shipping — the merge bottleneck is a real risk.
- **For team/multi-user deployments:** QwenPaw's Hub is the only mature answer, but plan for post-upgrade regression testing rigor.
- **Ecosystem-wide:** The next 4–8 weeks should see (a) consolidation around event-sourced session state, (b) a real secrets-broker pattern emerging in at least one core project, and (c) at least one project standardizing cross-gateway agent identity. Developers building on these platforms should architect for **replayability, credential isolation, and per-tool policy** as non-negotiable primitives.

---

## Peer Project Reports

<details>
<summary><strong>Hermes Agent</strong> — <a href="https://github.com/nousresearch/hermes-agent">nousresearch/hermes-agent</a></summary>

# Hermes Agent — Project Digest · 2026-10-23

## 1. Today's Overview

Hermes Agent shows **very high activity**: 50 issues and 50 PRs touched in the last 24h, with 5 issues closed and 15 PRs merged/closed. The dominant theme is **post-merge fallout from PR #106742 (`feat/unified-gateway-runtime`)**, merged October 14 — a tracking issue alone has 213 comments and dozens of new bug reports trace back to it (session routing, Group Chats, admission conflicts, multiplexed-profile resource storms). Almost all new bugs are **P2 gateway/session-state regressions**, suggesting the unified gateway is now the single largest stability risk in the codebase. No releases today. Community sentiment is engaged and constructive (detailed reproductions, upstream fixes, security-conscious reports) but there is visible fatigue around recurring session/thread defects.

---

## 2. Releases

**None.** No new releases in the last 24h. Context from issues: current stable is **v0.22.4 (2026.9.24)**, with v0.22.5 rc.1 in E2E testing (see #143291).

---

## 3. Project Progress — Merged/Closed Today

| PR / Issue | Type | What it fixed |
|---|---|---|
| [#141617](https://github.com/NousResearch/hermes-agent/pull/141617) **CLOSED** | fix(compression) | Compaction of a system-only head now opens on a user turn — fixes malformed window cuts |
| [#143281](https://github.com/NousResearch/hermes-agent/pull/143281) **CLOSED** | fix | `uv` resolution works again on newest uv; Android relock |
| [#143291](https://github.com/NousResearch/hermes-agent/pull/143291) **CLOSED** | fix(install) | Windows update from v0.22.4 now publishes new launcher + stamp across Python re-pin |
| [#108834](https://github.com/NousResearch/hermes-agent/pull/108834) **CLOSED** | feat | Databricks Unity AI Gateway CLI setup merged |
| [#137944](https://github.com/NousResearch/hermes-agent/issues/137944) **CLOSED** | bug | `edge-tts` 403 pin — closed (7.3.0 fixes upstream rotation) |
| [#140729](https://github.com/NousResearch/hermes-agent/issues/140729) **CLOSED** | bug | `hermes update` "Refusing to move this install" |
| [#134889](https://github.com/NousResearch/hermes-agent/issues/134889) **CLOSED** | tracking | Unified-gateway post-merge tracking issue closed (individual fixes tracked separately) |
| [#143244](https://github.com/NousResearch/hermes-agent/issues/143244) **CLOSED** | bug | Malformed session-lookup reply no longer strands Group Chat members |

**Progress signal:** The install/update path (uv, Windows launcher, downgrade refusal) is being actively hardened; compression and auth-adjacent fixes are also moving. The unified-gateway work, by contrast, is still generating more bugs than it closes.

---

## 4. Community Hot Topics

1. **[#134889](https://github.com/NousResearch/hermes-agent/issues/134889) — Unified gateway post-merge tracking (213 comments, CLOSED)**
   The epicenter of this week's activity. Now closed as a tracker, but spawned most of today's P2 regressions. *Need:* the community wants the unified gateway to actually deliver on "one gateway owns every local session" without breaking Desktop, CLI, TUI, profiles, Windows, or message delivery.

2. **[#97681](https://github.com/NousResearch/hermes-agent/issues/97681) — Let Bots collaborate across gateways (40 comments, 👍4, OPEN)**
   Cross-machine, cross-owner agent federation without surrendering control of credentials/models/memory. *Need:* multi-agent orchestration that respects ownership and locality — the long-term direction of the product.

3. **[#141346](https://github.com/NousResearch/hermes-agent/issues/141346) — Smart approval auto-approved `osascript` that closed an unsaved PowerPoint deck (33 comments)**
   **Data loss, unrecoverable.** The `smart` approval mode allowed AppleScript automation to terminate the user's running Office app. *Need:* approval-mode trust boundaries around OS-level automation (`osascript`, terminal, GUI control) must be dramatically stricter; users are asking what "smart" actually protects them from.

4. **[#26277](https://github.com/NousResearch/hermes-agent/issues/26277) — Email session isolation by normalized subject (15 comments, 👍3, OPEN)**
   *Need:* email users want per-thread sessions, not one mega-session per sender.

5. **[#135039](https://github.com/NousResearch/hermes-agent/issues/135039) — Budget enforcement + acceptance pipeline for MEMORY.md/USER.md (14 comments, OPEN)**
   *Need:* memory is injected on every turn; users want write-time budgets and quality gates to control cost and latency.

---

## 5. Bugs & Stability — Reported Today (ranked by severity)

**P0 / Data loss & security**
- **[#141346](https://github.com/NousResearch/hermes-agent/issues/141346)** — `smart` approval auto-approved destructive `osascript`; PowerPoint deck closed, export deleted. **No fix PR yet.** Highest-impact open bug.

**P2 — Gateway / session-state regressions (all linked to #106742)**
- **[#143197](https://github.com/NousResearch/hermes-agent/issues/143197)** — `X-Hermes-Session-Key` accepted but ignored; every request mints a new `api-*` session. (Client-visible session discontinuity.)
- **[#142731](https://github.com/NousResearch/hermes-agent/issues/142731)** — A session paused on `admission_conflict` **never recovers**; every later turn 409s forever.
- **[#143290](https://github.com/NousResearch/hermes-agent/issues/143290)** — `POST /v1/runs/{id}/stop` on a just-finished run interrupts the *next* turn; message silently dropped.
- **[#142844](https://github.com/NousResearch/hermes-agent/issues/142844)** — Live local session with missing routing row is permanently un-drainable; only gateway restart recovers.
- **[#142248](https://github.com/NousResearch/hermes-agent/issues/142248)** — Desktop Group Chats lost cross-machine rooms, reply-in-thread, @ picker since #106742 (docs still promise all three).
- **[#143288](https://github.com/NousResearch/hermes-agent/issues/143288)** — Long-lived session pins auxiliary vision to one provider; `auxiliary.vision.provider`/`base_url` ignored.
- **[#142893](https://github.com/NousResearch/hermes-agent/issues/142893)** — `api_server` synthesizes auto-TTS it can never deliver: **70 s of paid synthesis per turn**, next request queued behind it.
- **[#143306](https://github.com/NousResearch/hermes-agent/issues/143306)** — Discord thread speaker change strands completion wakes with `admission_conflict`. **Fix PR open: [#143307](https://github.com/NousResearch/hermes-agent/pull/143307).**
- **[#143302](https://github.com/NousResearch/hermes-agent/issues/143302)** / **[#143303](https://github.com/NousResearch/hermes-agent/issues/143303)** — Group Chat messages sent as prior discussion settles get no turn; Stop falsely reports a turn stopped while still running.
- **[#143268](https://github.com/NousResearch/hermes-agent/issues/143268)** — LOCAL Kanban `notify+wake` never reaches session FIFO (`LocalSessionAdapter` lacks `gateway_runner`).

**P2 — Resource / performance**
- **[#143256](https://github.com/NousResearch/hermes-agent/issues/143256)** — One 5 s supervisor thread per multiplexed profile **even with zero rooms**; exhausts read pool, starves event loop.
- **[#143255](https://github.com/NousResearch/hermes-agent/issues/143255)** — One cron-worktree-prune thread per profile all pruning the same repo → thread/git storm trips liveness watchdog (exit 75).

**P2 — Other**
- **[#143228](https://github.com/NousResearch/hermes-agent/issues/143228)** — TUI reasoning cleaner regex welds words together, deletes content verbs.
- **[#143170](https://github.com/NousResearch/hermes-agent/issues/143170)** — Routed-profile browser tools ignore `AGENT_BROWSER_EXECUTABLE_PATH`.
- **[#143247](https://github.com/NousResearch/hermes-agent/issues/143247)** — vLLM + DeepSeek V4.1 rejects `reasoning_effort` medium/minimal; silent fallback every turn.
- **[#58778](https://github.com/NousResearch/hermes-agent/issues/58778)** — MCP form elicitation returns empty accept → schema-invalid, fails closed (Telegram).

**P3**
- **[#136946](https://github.com/NousResearch/hermes-agent/issues/136946)** — Mattermost replies to bot-authored messages → potential bot-to-bot DM echo loop burning LLM quota.
- **[#143249](https://github.com/NousResearch/hermes-agent/issues/143249)** — Kanban worktree unusable with remote SSH (WSL2) backend.
- **[#143229](https://github.com/NousResearch/hermes-agent/issues/143229)** — `hermes security` flags CRITICAL pinned certifi/aiohttp/pillow; pillow blocked by browser-harness.

**Open fix PRs of note:** [#143307](https://github.com/NousResearch/hermes-agent/pull/143307) (thread wake after speaker change), [#143308](https://github.com/NousResearch/hermes-agent/pull/143308) (kanban fingerprint false-dead → double dispatch), [#143304](https://github.com/NousResearch/hermes-agent/pull/143304) (credential pool rotation refresh), [#143297](https://github.com/NousResearch/hermes-agent/pull/143297) (SSH lifecycle guard false-positive), [#143300](https://github.com/NousResearch/hermes-agent/pull/143300) (email reply subject).

---

## 6. Feature Requests & Roadmap Signals

| Issue | Feature | Likelihood in next release |
|---|---|---|
| [#135039](https://github.com/NousResearch/hermes-agent/issues/135039) | MEMORY.md/USER.md write-time budget + acceptance pipeline; PR [#116673](https://github.com/NousResearch/hermes-agent/pull/116673) anchors doc chains | Medium-high — cost/latency pressure is real |
| [#26277](https://github.com/NousResearch/hermes-agent/issues/26277) | Email session isolation by normalized subject | Medium — opt-in mode, low risk |
| [#126292](https://github.com/NousResearch/hermes-agent/issues/126292) | Native Android/iOS apps (location consent, approvals, real-time voice) | Long-term roadmap signal; aligns with mobile/uv work in #143281 |
| [#97681](https://github.com/NousResearch/hermes-agent/issues/97681) | Cross-gateway Bot collaboration | Strategic; foundational, not imminent |
| [#68680](https://github.com/NousResearch/hermes-agent/issues/68680) | pt-BR Docusaurus locale | Community-sourced, low effort |
| Sign-in stack ([#143236](https://github.com/NousResearch/hermes-agent/pull/143236), [#143235](https://github.com/NousResearch/hermes-agent/pull/143235), [#143234](https://github.com/NousResearch/hermes-agent/pull/143234), [#143248](https://github.com/NousResearch/hermes-agent/pull/143248)) | Unified Nous device login; free-tier guest migration to account; no silent guest on Connectors page | **Near-term** — stacked PRs, actively reviewed |
| [#143301](https://github.com/NousResearch/hermes-agent/pull/143301) | `/correct` across memory and learned skills | Plausible — pure CLI addition |

**Prediction:** The next release will be dominated by **auth/sign-in UX consolidation** and **install/update fixes**, with gateway session-state patches landing incrementally rather than as one release.

---

## 7. User Feedback Summary

**Pain points ranked by visible intensity:**
1. **Unified gateway broke multi-surface parity.** Desktop Group Chats lost promised features (#142248), sessions get permanently stuck (#142731, #142844), and stops land on the wrong turn (#143290). Users are explicitly comparing behavior against documentation.
2. **Smart approval is not trustworthy for OS automation.** The PowerPoint incident (#141346) is a high-trust failure — "smart" allowed an unrecoverable action. Users want per-tool approval boundaries.
3. **Multiplexed gateways leak resources** — per-profile threads cause watchdog kills (#143255, #143256), punishing users who legitimately run many profiles.
4. **Paid work that can never be delivered** (#142893, TTS synthesis on `api_server`) erodes trust in cost accounting.
5. **Memory/cost awareness** — users now understand MEMORY.md taxes every turn and want budgets (#135039).

**Satisfaction signals:** Reports are detailed and reproducible, PRs are community-authored (dokterdok, marioGusmao, arcabotai, teknium1, etc.), and upstream issues (edge-tts, uv) are being closed cleanly. The community is doing maintainer-grade triage.

---

## 8. Backlog Watch — Long-Unanswered Issues/PRs

| Item | Age | Why it matters |
|---|---|---|
| [#97681](https://github.com/NousResearch/hermes-agent/issues/97681) — cross-gateway Bot collaboration | Created 2026-08-29, 40 comments, 👍4 | Foundational strategic feature; needs a decision or explicit deferral |
| [#26277](https://github.com/NousResearch/hermes-agent/issues/26277) — Email session isolation | Created 2026-05-15, 👍3 | Old, simple, high-value; no maintainer signal |
| [#58778](https://github.com/NousResearch/hermes-agent/issues/58778) — MCP form elicitation empty accept | Created 2026-07-05 | Protocol-correctness bug affecting any MCP server with required fields; only 5 comments |
| [#116673](https://github.com/NousResearch/hermes-agent/pull/116673) — MEMORY.md anchors doc chain | Created 2026-09-20 | Substantial feature PR awaiting review; pairs with #135039 |
| [#122743](https://github.com/NousResearch/hermes-agent/pull/122743) — docx_read text extraction | Created 2026-09-25 | User-facing skills correctness fix; stale |
| [#130691](https://github.com/NousResearch/hermes-agent/pull/130691) — dashboard credential scrubbing scope | Created 2026-10-01 | Security-boundary tagged (`sweeper:risk-security-boundary`); deserves maintainer eyes |

---

**Overall health:** Activity is exceptional and the community is highly engaged, but the project is absorbing a large regression debt from the unified-gateway merge. The next 1–2 weeks should prioritize **P2 session-state defects** and the **smart-approval data-loss bug**; everything else (auth UX, install polish, community features) is progressing well.

</details>

<details>
<summary><strong>IronClaw</strong> — <a href="https://github.com/nearai/ironclaw">nearai/ironclaw</a></summary>

# IronClaw Project Digest — 2026-10-23

## 1. Today's Overview

IronClaw shows an **extremely active PR pipeline but zero merge throughput** this cycle: 50 PRs were updated in the last 24 hours, yet **0 were merged or closed**, and only 2 issues saw any activity (1 open, 1 closed). The dominant theme is **agent-harness reliability and evaluation tuning** for the `reborn` runtime, driven largely by a small group of recurring contributors (notably `pranavraja99`), alongside a steady stream of Dependabot dependency bumps. The single closed item (#3168, ARM64 Docker support) and one fresh failure-taxonomy issue (#8153) suggest the project is in a **maintenance-and-hardening phase** rather than shipping new user-facing releases. With no releases and no merges, the project's overall health reads as *busy but bottlenecked at review/merge*.

## 2. Releases

**None.** No new versions were published in this window, and the "Latest Releases" set is empty. No breaking changes, migration notes, or upgrade guidance to report.

## 3. Project Progress

**Merged/closed PRs today: 0.** No feature branches landed.

The only closure of note is an **issue**, not a PR:
- **#3168 [CLOSED]** *Add arm64/aarch64 platform support for Docker builds* — https://github.com/nearai/ironclaw/issues/3168 — This long-running (opened 2026-05-01) request to publish ARM64 Docker images was closed on 2026-10-22. The issue notes Cranelift already supports aarch64 and that only armv7 (32-bit, tracked in #1339) remains a limitation. **Note:** closure without a linked merged PR may indicate it was resolved elsewhere or closed as stale/duplicate — worth verifying whether ARM64 images actually ship now.

Because no PRs merged, no features *advanced to main* today, though many are in-flight (see Backlog Watch).

## 4. Community Hot Topics

All 50 PRs show `Comments: undefined` (comment counts not populated in the dataset), so ranking by comment count isn't possible. Based on **scope, size, and strategic importance**, the most significant active threads are:

- **#5298 [OPEN] hillclimb: combined harness fixes (aggregate eval)** — https://github.com/nearai/ironclaw/pull/5298 — A combined branch bundling multiple distinct harness fixes (#5287 et al.) for an aggregate benchmark evaluation. This is the clearest signal of the project's central preoccupation: *measurably improving agent benchmark scores.*
- **#8010 [OPEN] feat(webui): session-event transport unification + run-completion notifications (XL)** — https://github.com/nearai/ironclaw/pull/8010 — Implements an approved design doc end-to-end: a unified, bearer-authenticated multiplexing SSE stream. High architectural impact for the WebUI.
- **#6232 [OPEN] fix(reborn): auto-activate web-access and Brave-backed web_search** — https://github.com/nearai/ironclaw/pull/6232 — Addresses a discoverability gap where agents don't find real web search because integrations are opt-in.
- **#6093 [OPEN] feat(reborn): self-verification pass + benchmark_default profile** — https://github.com/nearai/ironclaw/pull/6093 — Gated self-verification added to the agent loop, enabled for benchmark runs only.

**Underlying need:** The community is channeling most energy into **making the agent loop robust and its benchmarks reproducible/meaningful**. There is a strong "eval-driven development" pattern — fixes are justified by trace evidence and benchmark deltas rather than user reports.

## 5. Bugs & Stability

No crashes or regressions were filed *today*, but several high-severity correctness/harness bugs remain open in active PRs:

| Severity | Item | Description | Fix PR? |
|---|---|---|---|
| **High** | #5353 | `http.save` rejects large downloads → agent loops → **turn timeout → task scores 0.0**. Documented with trace evidence on PinchBench. | Yes — PR #5353 open |
| **Medium** | #7945 | MCP server tool names are case-folded; CamelCase tools fail after installation-store restart. | Yes — PR #7945 open |
| **Medium** | #7974 | Legacy malformed observations (missing typed `kind` tag) can corrupt model projection. | Yes — PR #7974 open (fail-closed handling) |
| **Info** | #8153 | Daily failure taxonomy flags 64 non-pass `officeqa` tasks, attributed to **genuine model-quality errors** (DeepSeek-V4-Flash) rather than harness bugs. | N/A (monitoring) |

**Assessment:** The most impactful stability item (#5353) has an open fix, indicating the team is actively closing the loop between observed failures and remedies. No unaddressed critical bug was reported in this 24h window.

## 6. Feature Requests & Roadmap Signals

Active PRs point to near-term roadmap themes:

- **Web-search discoverability** (#6232) — moving integrations from opt-in to auto-activated. Likely adjacent to next release.
- **Compaction intelligence** (#7976) — deriving context-compaction thresholds from the *actual provider model's window* (+16k reserve, ~20k recent tokens retained). A strong candidate to land soon given multiple related PRs (#5450 frugal output, #5435 compaction budget).
- **Self-verification / final-answer nudging** (#6093) — gated for benchmarks first, likely to generalize if it improves scores.
- **Operator UX for IronHub agent linking** (#7516) — WebUI surface for register URL + hub-minted shared key.
- **Learning/review router** (#7958) — disabled-by-default, provider-neutral post-run learning path.
- **ARM64 Docker support** (#3168 closed) — if genuinely resolved, a concrete user-facing win.

**Prediction:** The next version is most likely to bundle **compaction/window-aware context management** and **benchmark-profile harness improvements**, given the density of related open PRs.

## 7. User Feedback Summary

Direct end-user feedback is sparse in this dataset (issues skew toward engineering/eval internals). Inferred pain points:

- **ARM64/Apple Silicon users** (#3168): previously unable to run official images — a real deployability blocker, now (apparently) addressed.
- **Agent reliability pain** (#5353, #6232): agents looping on failed downloads and failing to discover web search — these translate directly to **task failures for end users**, evidenced by 0.0 scores.
- **Case-sensitivity friction** (#7945): MCP integrations silently misbehaving — a developer/integrator pain point.

No explicit satisfaction/dissatisfaction sentiment (👍 counts are 0) is available; engagement appears developer-driven rather than community-led.

## 8. Backlog Watch

Long-lived, strategically important PRs that have been open for **months** and warrant maintainer attention (review/merge or close):

- **#5450** (opened 2026-06-30) — frugal default read/grep output — https://github.com/nearai/ironclaw/pull/5450
- **#5353** (2026-06-26) — `http.save` body-limit fix (High severity) — https://github.com/nearai/ironclaw/pull/5353
- **#5298** (2026-06-26) — combined harness fixes / aggregate eval — https://github.com/nearai/ironclaw/pull/5298
- **#6232** (2026-07-18) — auto-activate web-access/web_search — https://github.com/nearai/ironclaw/pull/6232
- **#6093** (2026-07-14) — self-verification pass — https://github.com/nearai/ironclaw/pull/6093

**Concern:** With **50 open PRs and 0 merges in 24h**, the review queue appears to be a **bottleneck**. Several fixes carrying clear evidence of user-facing failures (#5353) have been open for ~4 months. This is the single most important project-health factor to surface to maintainers: *throughput, not activity, is the constraint.*

---
*Data source: github.com/nearai/ironclaw · Digest generated 2026-10-23 · Comment/reaction counts were unavailable (`undefined`) for PRs, so "Hot Topics" is ranked by scope and strategic weight rather than engagement metrics.*

</details>

<details>
<summary><strong>QwenPaw</strong> — <a href="https://github.com/agentscope-ai/QwenPaw">agentscope-ai/QwenPaw</a></summary>

# QwenPaw Project Digest — 2026-10-23

## 1. Today's Overview

QwenPaw is in a **high-activity, security-driven release cycle**. A post-release patch (`v2.2.2.post1`) shipped today to remediate an emSign CA trust issue across dependencies, installers, and builds, accompanied by a formal security notice urging all users to upgrade. Activity is elevated: 13 issues and 26 PRs updated in the last 24h, though the issue tracker shows **zero closures** — all 13 updated issues remain open, suggesting a growing backlog relative to resolution velocity. The PR pipeline is healthier, with 6 merged/closed against 20 open, including several targeted bug-fix PRs filed the same day bugs were reported. Overall project health is **stable but strained**: security response is fast and disciplined, while a cluster of post-upgrade regressions (QQ channel, model calls, session deletion, CORS config) indicates release-quality friction.

## 2. Releases

### v2.2.2.post1 (Post-release patch)
- **Chore:** Version bump to v2.2.2post1 ([PR #8369](https://github.com/agentscope-ai/QwenPaw/pull/8369))
- **Security fix:** Remediation of emSign CA trust across dependencies, installers, and builds ([PR #8370](https://github.com/agentscope-ai/QwenPaw/pull/8370))
- **Accompanying security notice:** [[Security Notice] Please upgrade to QwenPaw 2.2.2.post1 or later](https://github.com/agentscope-ai/QwenPaw/issues/8385) — recommends all users upgrade via official releases (desktop installers, PyPI, etc.)
- **Release verification:** [Release Duty issue #8386](https://github.com/agentscope-ai/QwenPaw/issues/8386) tracks installation verification across platforms with a 4-hour deadline.

**Breaking changes / migration notes:** None documented in the release notes. However, the security advisory implies users on ≤2.2.2 should upgrade promptly. Note that several regressions reported today are attributed to the *previous* upgrade to 2.2.2 (see Bugs & Stability), so users upgrading from older versions should verify channel and model configuration post-upgrade.

## 3. Project Progress

**Merged/closed PRs today (6):**
- [PR #8370](https://github.com/agentscope-ai/QwenPaw/pull/8370) — **Security:** emSign CA trust remediation across dependencies, installers, and builds (merged into post1).
- [PR #8369](https://github.com/agentscope-ai/QwenPaw/pull/8369) — Version bump to v2.2.2post1.
- [PR #8371](https://github.com/agentscope-ai/QwenPaw/pull/8371) — **Security:** Node.js pinned to 22.23.4, fixing CVE-2026-111497 and CVE-2026-105481; GitHub Actions now uses `.nvmrc` as single source of truth; Docker builds fail early on version mismatch.
- [PR #7565](https://github.com/agentscope-ai/QwenPaw/pull/7565) — **Plugins:** Clean unload and rollback-safe hot reload, introducing a two-layer teardown ledger so failed plugin updates don't leave users half-applied (long-running, now closed).

**Notable in-flight work (open):**
- [PR #8389](https://github.com/agentscope-ai/QwenPaw/pull/8389) — Fixes CORS origins being read at import time rather than runtime (addresses #8374).
- [PR #8387](https://github.com/agentscope-ai/QwenPaw/pull/8387) — Makes Hub gateway timeout configurable with 600s default (fixes #8372).
- [PR #8384](https://github.com/agentscope-ai/QwenPaw/pull/8384) — Fixes Docker runtime readiness probe hardcoded to 127.0.0.1 when Hub runs in a container (fixes #8359).
- [PR #8375](https://github.com/agentscope-ai/QwenPaw/pull/8375) — Prevents stale requests after deleting a chat (fixes #8368).
- [PR #8366](https://github.com/agentscope-ai/QwenPaw/pull/8366) — **Licensing hygiene:** replaces GPL-3.0 `html2text` with a stdlib converter to maintain Apache-2.0 compatibility.
- [PR #8373](https://github.com/agentscope-ai/QwenPaw/pull/8373) — Shared daemon for desktop: independent windows and coordinated updates (large architectural change).
- [PR #8376](https://github.com/agentscope-ai/QwenPaw/pull/8376) — PowerContext memory backend updated for v1.4.0, exposing structured context and Artifact APIs (first-time contributor).
- [PR #8380](https://github.com/agentscope-ai/QwenPaw/pull/8380) — Test-only: 106 frontend unit test files, +1,811 statements covered (+4.97pp).

## 4. Community Hot Topics

| Item | Comments | 👍 | Link |
|---|---|---|---|
| #338 — Webhook feature request | 10 | 1 | [Issue #338](https://github.com/agentscope-ai/QwenPaw/issues/338) |
| #8275 — Global Skill & MCP unified management for Hub | 2 | 1 | [Issue #8275](https://github.com/agentscope-ai/QwenPaw/issues/8275) |
| #8374 — CORS origins env var not taking effect | 2 | 0 | [Issue #8374](https://github.com/agentscope-ai/QwenPaw/issues/8374) |
| #8372 — Hub AI gateway timeout too short | 2 | 0 | [Issue #8372](https://github.com/agentscope-ai/QwenPaw/issues/8372) |
| #8359 — Docker runtime fails when Hub in container | 2 | 0 | [Issue #8359](https://github.com/agentscope-ai/QwenPaw/issues/8359) |
| #7339 — Desktop auto-scroll disable setting | 2 | 0 | [Issue #7339](https://github.com/agentscope-ai/QwenPaw/issues/7339) |

**Underlying needs analysis:**
- **#338 (webhook)** is the most-discussed issue and has been open since March 2026 — a long-standing integration request for programmatic, asynchronous messaging with QwenPaw (send message → receive key → poll for reply). This signals demand for **headless/API-first automation** beyond chat UIs.
- **#8275** reflects **multi-user/team deployment maturity**: Hub supports multi-user, but Skill and MCP configs are per-user, creating duplication. Admins want global inheritance with personal overrides — a classic enterprise management-plane gap.
- **#8372** and **#8359** both point to **production deployment hardening**: default timeouts too short for real file-processing workloads, and containerized Hub deployments broken by loopback assumptions. Both already have fix PRs (#8387, #8384), showing responsive maintainership.

## 5. Bugs & Stability

Ranked by severity (all reported/updated 2026-10-22):

1. **🔴 Critical — #8388: QQ channel broken after upgrade** — [Issue #8388](https://github.com/agentscope-ai/QwenPaw/issues/8388)
   All tool calls fail with `No module named '_qwenpaw_remote_backend'`; the runtime environment itself appears corrupted post-upgrade. Affects any tool invocation, not just QQ. **No fix PR identified yet.**

2. **🔴 Critical — #8378: Model invocation abnormal after upgrade** — [Issue #8378](https://github.com/agentscope-ai/QwenPaw/issues/8378)
   Legacy `agent.json` configs with `active_model` (provider_id/model) appear incompatible with the new version. Upgrade regression affecting core agent functionality. **No fix PR identified yet.**

3. **🟠 High — #8359: Docker runtime startup failure when Hub runs in a container** — [Issue #8359](https://github.com/agentscope-ai/QwenPaw/issues/8359)
   Readiness probe hardcodes 127.0.0.1, causing Errno 111 inside containers — breaks the deployment pattern recommended by maintainers in #8256. **Fix PR exists:** [#8384](https://github.com/agentscope-ai/QwenPaw/pull/8384).

4. **🟠 High — #8374: `QWENPAW_CORS_ORIGINS` set via Web UI/CLI has no effect** — [Issue #8374](https://github.com/agentscope-ai/QwenPaw/issues/8374)
   Constant read at module import time, before env injection — cross-origin requests silently rejected. **Fix PR exists:** [#8389](https://github.com/agentscope-ai/QwenPaw/pull/8389).

5. **🟡 Medium — #8368: Deleting the currently selected session returns 404** — [Issue #8368](https://github.com/agentscope-ai/QwenPaw/issues/8368)
   UI state race after deletion. **Fix PR exists:** [#8375](https://github.com/agentscope-ai/QwenPaw/pull/8375).

6. **🟡 Medium — #8365: Matrix channel re-logs in with password every start, never re-uploads E2EE keys** — [Issue #8365](https://github.com/agentscope-ai/QwenPaw/issues/8365)
   Creates a new auth session each process start; breaks E2EE device reconciliation on stricter homeservers. **No fix PR identified yet.**

7. **🟢 Low — #8377: Bare `pytest` aborts during collection on clean checkout** — [Issue #8377](https://github.com/agentscope-ai/QwenPaw/issues/8377)
   `import file mismatch: test_backup` breaks the documented CONTRIBUTING.md gate. Contributor-experience issue. **Fix PR exists:** [#8379](https://github.com/agentscope-ai/QwenPaw/pull/8379).

**Pattern note:** Four of seven bugs are **post-upgrade regressions** (QQ, model config, CORS, session deletion), concentrated around the 2.2.2 release. This is the most actionable stability signal for maintainers.

## 6. Feature Requests & Roadmap Signals

| Request | Link | Likelihood in next version |
|---|---|---|
| Webhook support for programmatic messaging | [#338](https://github.com/agentscope-ai/QwenPaw/issues/338) | Medium — long-standing, high engagement, but no PR yet |
| Global Skill & MCP management in Hub | [#8275](https://github.com/agentscope-ai/QwenPaw/issues/8275) | Medium-High — aligns with Hub multi-user direction |
| Desktop setting to disable auto-scroll during streaming | [#7339](https://github.com/agentscope-ai/QwenPaw/issues/7339) | High — small, self-contained UI toggle |
| Configurable Hub gateway timeout (600s default) | [#8372](https://github.com/agentscope-ai/QwenPaw/issues/8372) | **Very High — PR #8387 already open** |

**Roadmap signals from open PRs:** Python Code Mode ([#8224](https://github.com/agentscope-ai/QwenPaw/pull/8224)), channels-as-plugins with subprocess isolation ([#8187](https://github.com/agentscope-ai/QwenPaw/pull/8187)), PawApp SDK/control-plane redesign ([#7874](https://github.com/agentscope-ai/QwenPaw/pull/7874)), and a shared desktop daemon ([#8373](https://github.com/agentscope-ai/QwenPaw/pull/8373)) indicate the next major cycle is focused on **modularity, plugin isolation, and multi-window desktop architecture**.

## 7. User Feedback Summary

**Pain points:**
- **Upgrade fragility is the dominant theme.** Users upgrading to 2.2.2 report broken QQ channels, corrupted runtime modules, and incompatible legacy `agent.json` model configs (#8388, #8378). One user's diagnostic message even surfaced inside the product's own chat output, indicating the failure is deep in the tool-call layer.
- **Deployment friction in containerized environments** (#8359): the maintainer-recommended Docker deployment pattern doesn't work out of the box due to a hardcoded loopback probe.
- **Default limits too conservative for real work** (#8372): 120s gateway timeout is insufficient for file-processing tasks — a practical blocker for production use.
- **Team-scale management gaps** (#8275): per-user Skill/MCP duplication is tedious and error-prone for teams.
- **UX papercuts**: forced auto-scroll during streaming (#7339) and 404s when deleting the active session (#8368).

**Satisfaction signals:** Fast, transparent security response (post1 shipped same day as advisory); multiple bugs reported today already have open fix PRs (#8384, #8387, #8389, #8375). Contributor experience is being actively improved (#8377/#8379, platform-neutral test fixes #8381–#8383). Dissatisfaction is concentrated on **release regression testing**, not responsiveness.

## 8. Backlog Watch

| Item | Age | Status | Why it needs attention |
|---|---|---|---|
| [#338 — Webhook feature](https://github.com/agentscope-ai/QwenPaw/issues/338) | Open since 2026-03-02 (~8 months) | 10 comments, 1 👍, no linked PR | Most-discussed open issue; a maintainer decision (accept/decline/design) would unblock community contributors. |
| [#7339 — Disable auto-scroll setting](https://github.com/agentscope-ai/QwenPaw/issues/7339) | Open since 2026-08-27 (~2 months) | 2 comments, no PR | Small, well-scoped UX fix that would improve desktop usability. |
| [#8243 — Rotate sidecar desktop logs on Windows](https://github.com/agentscope-ai/QwenPaw/pull/8243) | Open since 2026-10-14, "Under Review" | size/L, no comments | Unbounded `desktop.log` growth on Windows; needs reviewer bandwidth. |
| [#8187 — Channels as plugins with subprocess isolation](https://github.com/agentscope-ai/QwenPaw/pull/8187) | Open since 2026-10-12 | size/XXXL, no comments | Large architectural PR touching channel reliability; risk of stalling without review. |
| [#7874 — PawApp SDK/control-plane redesign](https://github.com/agentscope-ai/QwenPaw/pull/7874) | Open since 2026-09-19 (~5 weeks) | size/XXXL, no comments | Foundational redesign; long review cycles could delay dependent work. |
| [#8365 — Matrix E2EE key re-upload](https://github.com/agentscope-ai/QwenPaw/issues/8365) | Reported today | No fix PR | Security-adjacent (E2EE device trust); should be triaged promptly. |

**Health summary:** QwenPaw demonstrates strong security discipline and rapid bug-fix turnaround, but the zero-issue-closure day and a cluster of upgrade regressions suggest the project would benefit from **stronger pre-release regression coverage** (the large test-coverage PRs #8380/#8381–#8383 are a positive counter-trend) and **maintainer triage bandwidth** on long-running architectural PRs and the 8-month-old webhook request.

</details>

<details>
<summary><strong>ZeroClaw</strong> — <a href="https://github.com/zeroclaw-labs/zeroclaw">zeroclaw-labs/zeroclaw</a></summary>

# ZeroClaw Project Digest — 2026-10-23

## 1. Today's Overview

ZeroClaw shows **high-velocity, release-adjacent activity**: 50 issues and 50 PRs updated in the last 24 hours, with a slightly higher close rate on issues (12 closed / 38 active) than on PRs (8 closed / 42 open). No new releases shipped today, but the issue/PR tags are heavily weighted toward `release:v0.8.7` and `release:v0.9.0`, indicating the team is in a **pre-release hardening and stabilization phase** rather than feature expansion. The dominant themes are **security/sandboxing correctness, plugin lifecycle safety, gateway lifecycle (reload/drain), and CI reliability**. Several high-severity security issues (S0/S1) remain open, but corresponding fix PRs are in flight, suggesting the project is actively managing risk rather than accumulating it. Overall project health looks **active and disciplined**, with strong maintainer responsiveness (many issues closed within 1–3 days of filing).

---

## 2. Releases

**No new releases in the last 24 hours.**

The most recent published artifact referenced in the data is **v0.8.6** (verified live via issue #10999), with `v0.8.7` and `v0.9.0` clearly in preparation based on release tags across issues and PRs. No breaking changes or migration notes to report today.

---

## 3. Project Progress

Merged/closed PRs today (8 total) advanced the following:

- **CI reliability:** [#11941](https://github.com/zeroclaw-labs/zeroclaw/pull/11941) — raised the Cranelift runtime leg timeout to 30 minutes (addresses #10558). [#11833](https://github.com/zeroclaw-labs/zeroclaw/pull/11833) — bounded arm64 build memory and added dry-run dispatch to `docker-publish` (addresses #11828). [#11967](https://github.com/zeroclaw-labs/zeroclaw/pull/11967) — fixed the crates.io preflight to run only for a PR's own version bump (addresses #11966).
- **Security/dependency hygiene:** [#11906](https://github.com/zeroclaw-labs/zeroclaw/pull/11906) — patched Wasmtime 48.0.7 for RUSTSEC-2026-0375..0379.
- **Plugin observability:** [#11848](https://github.com/zeroclaw-labs/zeroclaw/pull/11848) — `plugin_channel_sender_denied` records now name the sender (addresses #11821).
- **Test hygiene:** [#11863](https://github.com/zeroclaw-labs/zeroclaw/pull/11863) — made receipt-bound `late_tool_search_*` tests opt-in (addresses #11806).
- **Docs:** [#11841](https://github.com/zeroclaw-labs/zeroclaw/pull/11841) — changelog wording alignment for v0.8.6 OIDC notes.

Closed issues today also include several **plugin safety bugs** (#11357, #11327) and **runtime persistence bugs** (#11898), indicating the plugin/runtime subsystem is being actively tightened ahead of v0.8.7.

---

## 4. Community Hot Topics

Most active threads (by comment count):

1. **[#7432 — [Tracker]: Runtime, dashboard sign-in and gateway delivery](https://github.com/zeroclaw-labs/zeroclaw/issues/7432)** — 15 comments, open, `release:v0.9.0`, `risk:high`. This is the umbrella tracker for the runtime/gateway roadmap from RFC #5574. **Underlying need:** a single source of truth for sequencing the v0.9.0 runtime and dashboard sign-in work; the high comment count reflects coordination overhead across many dependent trackers.
2. **[#10526 — RFC: Append-only session event history, deterministic state replay, and derived agent streams](https://github.com/zeroclaw-labs/zeroclaw/issues/10526)** — 13 comments, now **closed**. **Underlying need:** users want deterministic, replayable agent state instead of mutable conversation rows scattered across `TurnEvent`s, logs, tool receipts, and process-local state. This is an architectural pivot toward event sourcing.
3. **[#9101 — Consolidate release attestation mechanisms](https://github.com/zeroclaw-labs/zeroclaw/issues/9101)** — 10 comments, open, `priority:p1`. **Underlying need:** reduce CI cost and cognitive load — v0.8.3 shipped three parallel provenance mechanisms (cosign, GitHub attestations, slsa-github-generator) and 53 release assets; the ask is one signing story and ~20 assets.
4. **[#10999 — Publish and prove Discord plugin installation from a release binary](https://github.com/zeroclaw-labs/zeroclaw/issues/10999)** — 9 comments, open, `status:blocked`. **Underlying need:** end-to-end proof that the WASM plugin story works from a real release artifact, not just a dev build.

**Analysis:** The hottest topics cluster around **architectural consolidation** (event sourcing, attestation) and **release-grade plugin verification**. The community is pushing ZeroClaw from "works in dev" to "provably works from a signed release."

---

## 5. Bugs & Stability

Ranked by severity:

**S0 — Security / Data Loss**
- **[#11932 — container CA bundles still trust distrusted emSign chains](https://github.com/zeroclaw-labs/zeroclaw/issues/11932)** (open, `risk:high`). The published container's native CA bundle still authenticates paths through publicly distrusted emSign intermediates. Updating the Rust verifier alone does not fix the container image. **No fix PR yet** — this is the most urgent open item.

**S1 — Workflow Blocked**
- **[#11608 — Telegram listener can wedge forever on a blackholed request](https://github.com/zeroclaw-labs/zeroclaw/issues/11608)** (open, `priority:p1`). Runtime HTTP client has no request timeout; a single blackholed request permanently wedges the channel. `listener_health` detects staleness but nothing recovers it. **No fix PR linked.**
- **[#11959 — Unix null-device regression test fails on case-insensitive filesystems](https://github.com/zeroclaw-labs/zeroclaw/issues/11959)** (open, `priority:p1`). Test-only, but blocks CI on macOS/Windows-style filesystems.

**S2 — Degraded Behavior**
- **[#9284 — config flush can overwrite concurrent writes](https://github.com/zeroclaw-labs/zeroclaw/issues/9284)** (open, `priority:p1`). `RpcDispatcher::flush_config` clones under a read lock then awaits `save_dirty()`, leaving a race window.
- **[#9394 — `gateway.pairing_dashboard` is accepted and entirely unread; pairing codes never expire](https://github.com/zeroclaw-labs/zeroclaw/issues/9394)** (open, `priority:p1`, `security:pairing`). A config key that silently does nothing plus non-expiring pairing codes — a real security posture problem.
- **[#11711 — trimming a long conversation permanently deletes older turns from the session store](https://github.com/zeroclaw-labs/zeroclaw/issues/11711)** (open). Data-loss-adjacent: context trimming rewrites the transcript destructively.
- **[#11709 — upgraded sockets outlive a gateway reload and keep serving a retired instance](https://github.com/zeroclaw-labs/zeroclaw/issues/11709)** (open). **Fix PR exists:** [#11901](https://github.com/zeroclaw-labs/zeroclaw/pull/11901) admits no new requests after gateway stop and drains connections.
- **[#11951 — gateway WebSocket upgrades fail over the built-in TLS listener](https://github.com/zeroclaw-labs/zeroclaw/issues/11951)** (open, `release:v0.9.0`). Server sends `101` then closes; dashboard chat `/ws/chat` is broken over TLS.
- **[#9506 — Email channel cannot preserve CC or send a true Reply All](https://github.com/zeroclaw-labs/zeroclaw/issues/9506)** (open). **Fix PRs exist:** [#11939](https://github.com/zeroclaw-labs/zeroclaw/pull/11939) (quote original) and [#11993](https://github.com/zeroclaw-labs/zeroclaw/pull/11993) (sanitized HTML body).
- **[#11991 — outbound email HTML carries raw markup and arbitrary image URLs from the agent's text](https://github.com/zeroclaw-labs/zeroclaw/issues/11991)** (open). **Fix PR:** [#11993](https://github.com/zeroclaw-labs/zeroclaw/pull/11993).

**Fixed today (closed):** #11357 (plugin remove deleting wrong directory), #11327 (plugin tool name gate pre-emption), #11898 (daemon first start missing RPC session store), #11902 (valid OIDC token refused during concurrent JWKS fetch), #10558 (Cranelift CI timeout), #11821 (sender not named in denial logs).

**Assessment:** The bug queue is **security-heavy but well-triaged**. The two items without fix PRs (#11932 container CA bundle, #11608 Telegram wedge) deserve immediate maintainer attention.

---

## 6. Feature Requests & Roadmap Signals

Active feature requests, mapped to likely release targets:

| Issue | Signal | Likely Target |
|---|---|---|
| [#7432](https://github.com/zeroclaw-labs/zeroclaw/issues/7432) Runtime/dashboard sign-in/gateway delivery tracker | Umbrella roadmap | **v0.9.0** |
| [#11679](https://github.com/zeroclaw-labs/zeroclaw/issues/11679) zerocode obtains its own bearer over mTLS (auth parity with gateway) | Identity/access simplification | v0.9.0 |
| [#11938](https://github.com/zeroclaw-labs/zeroclaw/issues/11938) Email channel: quote original in replies | UX parity with mail clients | **v0.8.7** (PR #11939 open) |
| [#11992](https://github.com/zeroclaw-labs/zeroclaw/issues/11992) Email channel: operator templates + sanitized HTML body | Outbound email design + safety | **v0.8.7** (PR #11993 open) |
| [#8844](https://github.com/zeroclaw-labs/zeroclaw/issues/8844) `process_message` turn lifecycle for memory span nesting | Observability/OTel | Parking lot, p3 |
| [#11926](https://github.com/zeroclaw-labs/zeroclaw/issues/11926) Audit full lockfile in daily advisory scan | Supply-chain security | Closed today — likely landed |

**Prediction:** The **email channel** is the clear feature hotspot for v0.8.7 (quoting, templating, sanitized HTML). The **v0.9.0** bucket is dominated by runtime/gateway/identity architecture (tracker #7432, zerocode mTLS auth #11679, event-sourced sessions #10526). Goal Mode proposals (#11878, #11879) are being staged as a 12-part series — early foundation work, not yet mergeable.

---

## 7. User Feedback Summary

**Pain points observed:**

- **Plugin lifecycle is dangerous.** Two closed bugs today (#11357, #11327) both involved plugins deleting or pre-empting things they shouldn't. Users running untrusted plugins are explicitly told to treat #11327 as S0. The desire is clear: **plugin isolation and lifecycle correctness must be provable, not assumed.**
- **Release trust is fragmented.** #9101's author is frustrated that three signing mechanisms landed 26 hours apart "without seeing each other," producing 53 release assets. Users want **one verifiable signing story**.
- **Channel reliability gaps.** Telegram can wedge permanently (#11608); email can't do Reply All or preserve CC (#9506); email HTML leaks raw markup from agent text (#11991). Users are hitting **real-world messaging semantics** that the channel layer doesn't yet model.
- **Session data loss surprises.** #11711 and #10526 both point at the same dissatisfaction: **mutable conversation storage loses history** and makes state non-reproducible.
- **CI friction.** Multiple closed issues today (#10558, #11828, #11966, #11928) show contributors fighting timeouts, OOM on arm64, and false-positive preflight triggers — **infrastructure toil is a recurring satisfaction drag.**

**Satisfaction signals:** Fast turnaround on filed issues (many closed within days), and PRs are consistently linked to issues with clear "Fixes #NNNN" references — the contribution workflow is healthy.

---

## 8. Backlog Watch

Items needing maintainer attention (open, high-impact, low recent movement relative to importance):

1. **[#11932 — container CA bundles still trust distrusted emSign chains](https://github.com/zeroclaw-labs/zeroclaw/issues/11932)** — S0, open, **no fix PR**. Filed 2026-10-21, only 1 comment. This is the highest-severity open item and should not sit.
2. **[#11608 — Telegram listener wedge on blackholed request](https://github.com/zeroclaw-labs/zeroclaw/issues/11608)** — S1, open since 2026-10-07, **no fix PR**. A missing HTTP timeout is a one-line-class fix with large reliability payoff.
3. **[#9394 — `gateway.pairing_dashboard` unread + pairing codes never expire](https://github.com/zeroclaw-labs/zeroclaw/issues/9394)** — open since 2026-07-26, p1, security. Nearly three months old with 3 comments; a silently-ignored security config key is a trust problem.
4. **[#9284 — config flush overwrites concurrent writes](https://github.com/zeroclaw-labs/zeroclaw/issues/9284)** — open since 2026-07-23, p1. Long-lived race condition with a clear code location (`dispatch.rs:539-547`).
5. **[#9101 — consolidate release attestation](https://github.com/zeroclaw-labs/zeroclaw/issues/9101)** — open since 2026-07-16, p1, 10 comments. High community interest, no merged PR; needs a decision owner.
6. **[#8844 — `process_message` turn lifecycle for memory span nesting](https://github.com/zeroclaw-labs/zeroclaw/issues/8844)** — parked since 2026-07-08, p3. Low urgency but blocks clean OTel traces.
7. **[PR #10034 — probe saved provider alias after model-routing update](https://github.com/zeroclaw-labs/zeroclaw/pull/10034)** — open since 2026-08-16, size:XL, `distinguished contributor`. A long-running PR from a trusted contributor; either needs review bandwidth or a rebase decision.
8. **[PR #11304 — record socket and WebSocket egress denials](https://github.com/zeroclaw-labs/zeroclaw/pull/11304)** — open since 2026-10-01, `status:blocked`, size:XL. Complements the plugin security story; blocked status should be surfaced.

---

*Digest generated from GitHub activity on 2026-10-23. All links point to `github.com/zeroclaw-labs/zeroclaw`.*

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*