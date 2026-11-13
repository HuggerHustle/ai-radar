# OpenClaw Ecosystem Digest 2026-11-13

> Issues: 432 | PRs: 500 | Projects covered: 5 | Generated: 2026-11-13 01:46 UTC

- [OpenClaw](https://github.com/openclaw/openclaw)
- [Hermes Agent](https://github.com/nousresearch/hermes-agent)
- [IronClaw](https://github.com/nearai/ironclaw)
- [QwenPaw](https://github.com/agentscope-ai/QwenPaw)
- [ZeroClaw](https://github.com/zeroclaw-labs/zeroclaw)

---

## OpenClaw Deep Dive

# OpenClaw Project Digest — 2026-11-13

## 1. Today's Overview

OpenClaw remains a high-velocity, high-complexity project with **432 issues** and **500 PRs** updated in the last 24 hours (263 active issues, 284 open PRs), indicating sustained contributor engagement but also a growing maintenance load. No new releases shipped today, and the project is currently operating without a stable release containing several in-flight fixes; multiple issues reference fixes that exist only in prereleases (`v2026.11.5-beta.1/.2`) and not in stable. The issue tracker is dominated by **state-management, session-recovery, and SQLite/WAL problems**, suggesting the persistence layer is the primary source of instability. Activity is healthy but the ratio of open-to-closed issues and the volume of `clawsweeper:needs-maintainer-review` tags point to a **maintainer review bottleneck** as the key risk to project health.

---

## 2. Releases

**No new releases in the last 24 hours.** There are no release notes, breaking changes, or migration guidance to report today.

Notable context from issues: several fixes are staged in prereleases but **not yet in stable**:
- Issue #141474 notes the historical-state recovery fix ships only in `v2026.11.5-beta.1` and `v2026.11.5-beta.2`, **not** in stable `v2026.11.3`, `v2026.11.2`, or `v2026.9.37`.

---

## 3. Project Progress

**Merged/closed PRs today: 216** (merged or closed). Highlights from the PR list:

- **#197887 [CLOSED]** — `perf(agents): reuse sealed nested tool-result payloads` — reduces normalization work when persisting already-sealed Tool Search results. ([link](https://github.com/openclaw/openclaw/pull/197887))
- **#196812 [CLOSED]** — `fix(sessions): confirmed deliveries record a false delivery-failed when media cannot be embedded` — corrects misleading delivery status in transcripts. ([link](https://github.com/openclaw/openclaw/pull/196812))
- **#197983 [CLOSED]** — `fix(ui): desktop group search misses accented group names typed in another Unicode form` — Unicode normalization (NFC/NFD) fix for group search. ([link](https://github.com/openclaw/openclaw/pull/197983))

**Open PRs advancing features (awaiting review):**
- **#196200 [OPEN]** — Agent GitHub account management in Profile UI (Closes #196136). ([link](https://github.com/openclaw/openclaw/pull/196200))
- **#197904 [OPEN]** — Open Chrome settings pages from Control UI Browser panel. ([link](https://github.com/openclaw/openclaw/pull/197904))
- **#197814 [OPEN]** — New CLI commands `openclaw agents files list/get`. ([link](https://github.com/openclaw/openclaw/pull/197814))
- **#197990 [OPEN]** — `fix(agents): plugin agent_end hooks fail after a turn that called dispatch_action` (P1, has regression test). ([link](https://github.com/openclaw/openclaw/pull/197990))

---

## 4. Community Hot Topics

Most active issues by comment count:

| Issue | Comments | Theme | Link |
|---|---|---|---|
| #164294 | 40 | Gateway WAL auto-checkpoint never completes (blocked by in-process reader) | [link](https://github.com/openclaw/openclaw/issues/164294) |
| #191944 | 27 | macOS `gateway stop`/`stop --force` fail with "Process ancestry could not be fully inspected" | [link](https://github.com/openclaw/openclaw/issues/191944) |
| #120385 | 26 | Code Mode tool catalog incomplete for cron/memory-flush turns | [link](https://github.com/openclaw/openclaw/issues/120385) |
| #67413 | 17 | Per-agent dreaming configuration (memory spikes/OOM) — **CLOSED** | [link](https://github.com/openclaw/openclaw/issues/67413) |
| #44309 | 17 | One-way A2A dispatch mode (no reply-back ping-pong) — **CLOSED** | [link](https://github.com/openclaw/openclaw/issues/44309) |

**Underlying needs analysis:**
- The top issues cluster around **operational reliability under scale**: WAL checkpointing, process lifecycle on macOS, and SQLite contention. Users running long-lived gateways with large databases are hitting structural limits, not one-off bugs.
- The A2A/dispatch and per-agent dreaming requests (both closed) reflect demand for **finer-grained multi-agent orchestration control** — operators want to prevent runaway resource use and unwanted message loops.

**Hot PRs:** Several P2 performance PRs from `steipete` (#198008, #198028, #198027) target **moving work off the Gateway main thread** — a recurring, high-impact theme.

---

## 5. Bugs & Stability

Ranked by severity:

**P0 / Release-Blocker**
- **#190563 [OPEN, P0]** — Regression: Cannot resume paused Codex chat; provider review/native thread mismatch. Tagged `impact:ux-release-blocker`. **No fix PR linked.** ([link](https://github.com/openclaw/openclaw/issues/190563))

**P1 (High Severity)**
- **#144291 [OPEN, P1]** — Config hot-reload aborts every in-flight agent turn ("prepared model runtime plugin generation was superseded"). Message loss. Needs security review. ([link](https://github.com/openclaw/openclaw/issues/144291))
- **#144809 [OPEN, P1]** — `claude-cli`: turns longer than `RUN_STALE_TAKEOVER_MS` lose their entire generated reply. ([link](https://github.com/openclaw/openclaw/issues/144809))
- **#191841 [OPEN, P1]** — 2026.10.10 regression: 'native child reaping is unavailable' breaks all exec on Linux with glibc < 2.31 (RHEL 8/al8). ([link](https://github.com/openclaw/openclaw/issues/191841))
- **#196199 [OPEN, P1]** — Regression since 2026.10.10: native Codex helper completions fail to resume parent, locking users out. ([link](https://github.com/openclaw/openclaw/issues/196199))
- **#181459 [OPEN, P1]** — 3.5 GB agent DB makes startup a gamble; agent UNAVAILABLE with 'commit checkpoint expired'. ([link](https://github.com/openclaw/openclaw/issues/181459))
- **#168101 [CLOSED, P1]** — Rate-limit Retry-After ignores `maxRetryDelayMs` after a tool call. ([link](https://github.com/openclaw/openclaw/issues/168101))

**P2 (Notable)**
- **#162585 [OPEN]** — Windows plugin source-capture staging never converges; 290 MB → 612 MB+ growth. ([link](https://github.com/openclaw/openclaw/issues/162585))
- **#101929 [OPEN]** — Context-overflow estimator over-counts 2.3–2.6x vs billed usage. ([link](https://github.com/openclaw/openclaw/issues/101929))
- **#197374 [OPEN]** — Compaction silently degrades on long sessions (120s idle timeout caps budget). ([link](https://github.com/openclaw/openclaw/issues/197374))

**Fix PRs exist for:** #197990 (agent_end hooks, P1), #196812 (delivery-failed, merged/closed), #197510 (session path checks off Gateway thread).

**Stability pattern:** Recurring regressions tied to the **2026.10.10 release** (#191841, #196199) and **SQLite/WAL/checkpoint** subsystem (#164294, #181459, #197083) are the dominant risks.

---

## 6. Feature Requests & Roadmap Signals

| Request | Signal | Link |
|---|---|---|
| Explicitly authorize cross-provider cron fallback accounts | **CLOSED** today; likely candidate for near-term scheduling work | [link](https://github.com/openclaw/openclaw/issues/192009) |
| Limit-aware model fallback (skip exhausted provider accounts) | **CLOSED**; aligns with rate-limit fixes | [link](https://github.com/openclaw/openclaw/issues/182712) |
| Doctor recovery for stranded requester settle wake | Open, operator-recovery focus | [link](https://github.com/openclaw/openclaw/issues/170562) |
| Feishu (Lark) progress streaming mode | Open; parity with Slack/Discord/Telegram | [link](https://github.com/openclaw/openclaw/issues/131457) |
| Per-agent compaction/contextPruning overrides in `agents.list` | **CLOSED**; strong multi-agent customization signal | [link](https://github.com/openclaw/openclaw/issues/52732) |
| Accessibility: chat messages as headings for screen readers | Open | [link](https://github.com/openclaw/openclaw/issues/154524) |
| Plugin hook to append content after tool results in-flight | Open; plugin extensibility gap | [link](https://github.com/openclaw/openclaw/issues/164355) |

**Prediction:** The next minor release is likely to emphasize (a) **provider fallback/rate-limit intelligence** (multiple closed requests converge here), (b) **multi-agent configuration granularity** (per-agent compaction, dreaming), and (c) **Gateway-thread performance work** (many open `steipete` PRs).

---

## 7. User Feedback Summary

**Pain points:**
- **Startup unreliability at scale** — large agent DBs (3.5 GB) make startup a "gamble" (#181459); agents go UNAVAILABLE with checkpoint-expired errors.
- **Silent failures and message loss** — replies discarded after long turns (#144809), hot-reload aborting turns (#144291), and false `delivery-failed` records (#196812).
- **Platform-specific breakage** — macOS process ancestry inspection (#191944), Windows plugin staging (#162585), RHEL 8/glibc exec regression (#191841).
- **Version confusion** — fixes exist in prereleases but not stable; users on stable are stranded (#141474, #48920 "Live Docs ahead of release").

**Satisfaction signals:** Users are investing significant effort filing detailed, well-instrumented reports (many with source-pinned repros and live-Gateway tests), indicating **high engagement and goodwill**. However, the volume of `needs-maintainer-review` and `needs-product-decision` tags suggests growing **frustration with review latency**.

---

## 8. Backlog Watch

Important items needing maintainer attention (stale and/or high-impact):

| Issue/PR | Status | Why it matters | Link |
|---|---|---|---|
| #164294 | Open since 2026-10-03, 40 comments, `needs-maintainer-review` | Gateway WAL checkpoint never completes — core reliability | [link](https://github.com/openclaw/openclaw/issues/164294) |
| #120385 | Open since 2026-08-08, `needs-info` | Code Mode tool catalog incomplete for cron turns | [link](https://github.com/openclaw/openclaw/issues/120385) |
| #114067 | Open since 2026-07-26, `queueable-fix`, `fix-shape-clear` | `--help` 35x slower with `plugins` key — clear, fixable perf win | [link](https://github.com/openclaw/openclaw/issues/114067) |
| #180978 | Open since 2026-10-22, `needs-product-decision` | Active Memory circuit breaker never opens at chat pace | [link](https://github.com/openclaw/openclaw/issues/180978) |
| #170562 | Open, `needs-product-decision` | Doctor recovery for stranded requester settle wake | [link](https://github.com/openclaw/openclaw/issues/170562) |
| #154524 | Open, `needs-product-decision` | Screen-reader accessibility for chat navigation | [link](https://github.com/openclaw/openclaw/issues/154524) |

**Backlog risk assessment:** #164294 (40 comments, no fix PR) and #114067 (clear, low-risk perf fix) are the highest-value items currently stalled. The concentration of `clawsweeper:needs-maintainer-review` across the top-commented issues indicates the project would benefit from **expanding maintainer review capacity** or delegating triage for P2 issues.

---

*Digest generated from GitHub data dated 2026-11-13. All links point to github.com/openclaw/openclaw.*

---

## Cross-Ecosystem Comparison

# Cross-Project Comparison Report: Personal AI Assistant / Agent Open-Source Ecosystem
**Date: 2026-11-13** | Sources: OpenClaw, Hermes Agent, IronClaw, QwenPaw, ZeroClaw community digests

---

## 1. Ecosystem Overview

The personal AI assistant / agent open-source landscape on 2026-11-13 is characterized by **high-velocity development concentrated in a handful of large projects**, with four of five surveyed projects showing 50–500+ daily issue/PR updates and only one (IronClaw) dormant. The dominant theme across the ecosystem is the **painful transition from single-user tooling to multi-tenant, production-grade infrastructure**: projects are simultaneously wrestling with persistence-layer reliability (SQLite/WAL, checkpoint recovery), identity and access control (OIDC, RBAC, sandboxing), and loop-correctness guardrails that fire on legitimate long-horizon agent behavior. A second converging theme is **silent failure** — Slack status indicators, delivery pipelines, session search, and token accounting — which erodes user trust more than crashes. Despite shared technical concerns, the projects are **diverging in maturity and scope**: OpenClaw operates at reference-implementation scale (~930 daily items), while Hermes, QwenPaw, and ZeroClaw hover at comparable but smaller velocities (~50 items each), each carving out distinct niches (Nous research agents, AgentScope ecosystem, security-first multi-tenancy).

---

## 2. Activity Comparison

| Project | Issues Updated (24h) | PRs Updated (24h) | Merged/Closed PRs | Release Status | Health Score* |
|---|---|---|---|---|---|
| **OpenClaw** | 432 (263 active) | 500 (284 open) | 216 | No new release; fixes stuck in prerelease only | **B** (high activity, review bottleneck, P0 open) |
| **Hermes Agent** | 50 (40 open) | 50 (47 open) | 3 | No release today (latest v0.23.0) | **B−** (good intake, 1:16 merge ratio, ~2mo top bug) |
| **IronClaw** | 0 | 0 | 0 | No activity | **N/A** (dormant) |
| **QwenPaw** | 23 | 50 (38 open) | 12 | v2.3.0 shipped 2026-11-11; regression cluster | **B−** (post-release stabilization, security bypass open) |
| **ZeroClaw** | 50 | 50 (46 open) | 4 | **v0.9.0** shipped today ("first multi-user release") | **C+** (red CI blocks merge queue, S0 delegation bypass) |

\* *Health score is a qualitative composite of activity, merge throughput, open-bug severity, and review latency; not an official project metric.*

**Key observations:**
- **Merge-to-intake ratios** vary wildly: OpenClaw ~0.5, QwenPaw ~0.24, ZeroClaw ~0.08, Hermes ~0.06. This gap is the single clearest indicator of **review-capacity strain** across the ecosystem.
- Only **ZeroClaw shipped a release today**, and it did so with a failing security CI job — a cautionary signal about release discipline under velocity.
- **IronClaw's dormancy** makes it an outlier; it should be excluded from trend analysis pending renewed activity.

---

## 3. OpenClaw's Position

**Advantages vs. peers:**
- **Scale of operations:** OpenClaw processes ~9× Hermes's or ZeroClaw's daily item volume (930 vs. ~100). It is the de facto reference implementation, and its issue tracker functions as an industry-wide bug corpus other projects implicitly learn from.
- **Breadth of integrations and platform coverage:** Issues span macOS process ancestry, Windows plugin staging, RHEL/glibc exec, Unicode search normalization — indicating a genuinely cross-platform user base that smaller projects (ZeroClaw's Windows gap, QwenPaw's Windows path bugs) have not yet matched.
- **Established tactical playbook:** The `clawsweeper:*` tag taxonomy, P0–P2 severity discipline, and prerelease-beta staging (v2026.11.5-beta.1/.2) reflect a mature release-engineering process — albeit one currently bottlenecked.

**Technical approach differences:**
- OpenClaw is the most **Gateway-centric** architecture, and its hottest pain points (WAL auto-checkpoint, main-thread contention, SQLite checkpoint expiry on 3.5 GB DBs) are *consequences of that architectural choice at scale*. Peers have not yet been stress-tested to the same degree — their equivalent bugs are latent, not surfaced.
- The heavy concentration of `steipete`-authored "move work off the Gateway main thread" PRs signals the project is in an active **performance-refactor phase**, whereas ZeroClaw is in an identity/security phase and QwenPaw is in a plugin-migration phase.

**Community size comparison:**
- OpenClaw's top issue (#164294, WAL checkpoint) has **40 comments** — comparable to Hermes's #131859 (59) and ZeroClaw's #6996 (29), meaning top-thread engagement is surprisingly similar despite the 9× overall volume gap. This suggests OpenClaw's community is **broader but not proportionally deeper per-thread** — consistent with a large user base whose reports are triaged faster and thus generate fewer comments per item.

---

## 4. Shared Technical Focus Areas

The following requirements emerge across **multiple projects**, indicating ecosystem-level concerns rather than project-local bugs:

| Focus Area | Projects | Specific Needs |
|---|---|---|
| **Silent failure / observability gaps** | OpenClaw (#144809 lost replies, #196812 false delivery-failed), Hermes (#110374 Slack, #154612 Bot Mode relay, #103184 session_search), QwenPaw (#8705 cron usage not written, #8580 memory tag 503) | Users cannot detect when the agent *thinks* it succeeded but silently dropped work. Cross-project demand for **delivery/success telemetry**. |
| **Loop-control / guardrail correctness** | QwenPaw (#8184 doom-loop gate kills polling, #8700 gate never fires), OpenClaw (#180978 active-memory circuit breaker never opens) | Guardrails fire on legitimate long-horizon behavior. Need **distinguishing "stuck" from "waiting on background task."** |
| **Multi-tenancy & identity** | ZeroClaw (OIDC #8289, RBAC #5982), OpenClaw (per-agent config #52732, #67413), Hermes (#97390 per-channel compaction) | Move from single-operator to **per-sender/per-workspace isolation**; this is the dominant 2026-Q4 strategic theme. |
| **Sandbox / capability scoping** | ZeroClaw (#6996 filesystem policy, #8279 delegation bypass, #5775 per-skill perms), QwenPaw (#8018/#8048 Windows sandbox ACL), OpenClaw (plugin capture growth #162585) | Least-privilege enforcement, especially **sub-agent / delegation cannot widen parent permissions**. |
| **Token/usage accounting accuracy** | Hermes (#146475, #148539, #152039, #105273), QwenPaw (#8705), OpenClaw (#101929 context-overflow over-counting 2.3–2.6×) | Billing-grade metering matters wherever users run agents at cost. |
| **Config ergonomics / unification** | Hermes (model presets #20249, #12658, reasoning-effort #21256), QwenPaw (#8686 plugin data dir) | Reduce config repetition; today's "not-planned" closures in Hermes suggest a **larger refactor is pending**, not abandonment. |
| **Context/memory compaction** | OpenClaw (#197374 compaction degradation, #180978 memory breaker), Hermes (#97390 idle compaction), QwenPaw (#8580 memory index) | Long-lived sessions require **proactive, budgeted** context management, not reactive truncation. |
| **Contributor-experience / CI health** | Hermes (#131859, #137800 fork PR blocks), ZeroClaw (#12320 blocks merge queue, #7462 Windows test gap) | Broken external-contributor paths and red CI are **ecosystem-level reputational risks**. |

---

## 5. Differentiation Analysis

| Dimension | OpenClaw | Hermes Agent | QwenPaw | ZeroClaw |
|---|---|---|---|---|
| **Feature focus** | General-purpose Gateway; cross-platform agent runtime | Multi-channel research agents; Slack/Telegram gateways, MCP orchestration | AgentScope-native console; multi-workspace channels, local Whisper, Office automation | Security-first multi-tenant agents; sandboxing, RBAC, OIDC |
| **Target users** | Broad operator base; scaled self-hosters | Researchers / power users; long-lived messaging sessions | AgentScope developers; multi-workspace deployments | Enterprise / security-conscious multi-tenant operators |
| **Architecture** | Central Gateway (perf-refactoring off main thread) | Messaging-gateway + desktop hybrid; auxiliary "Responses" path | Plugin-centric console with channel-plugin marketplace (post-2.3.0 migration) | Rust-first; providers as first-class wire protocols; OS-sandbox backends (Bubblewrap/Landlock/Seatbelt) |
| **Release posture** | Beta-staged fixes; stable lagging | Long release cycles; config redesign pending | Fast patch cadence likely (2.3.1 imminent) | Aggressive multi-user release with red CI |
| **Language / runtime** | (unspecified in digest; JS/TS ecosystem signals) | (mixed; SDK-heavy) | Python (uv venv, PyPI) | Rust (cargo-audit, RUSTSEC) |
| **Distinctive strength** | Ecological centrality, scale-tested | Security marathon + maintainer-authored edge-case fixes | Fast first-time-contributor funnel (same-day fix PRs) | Structured RFC process; explicit severity taxonomy |

**Notable keine Überschneidung:** No two projects are chasing the *same* niche. OpenClaw is the generalist, ZeroClaw is the security specialist, Hermes is the messaging/research specialist, QwenPaw is the ecosystem-integrated (AgentScope) specialist. This lack of direct competition is unusual for a maturing OSS category and suggests the field is **still segmenting**, not consolidating.

---

## 6. Community Momentum & Maturity

**Activity tiers:**

- **Tier 1 — Hyper-scale, review-bound:** **OpenClaw** (930 daily items). Rapidly iterating but maintainer-review bottleneck is the binding constraint (`needs-maintainer-review` concentration, P0 #190563 with no fix PR, 40-comment WAL issue stalled). Momentum is *sustained but throttled*.
- **Tier 2 — Actively iterating, throughput-limited:** **Hermes, ZeroClaw, QwenPaw** (~50 items each). All three show **healthy intake with unhealthy closing rates** (merge ratios 0.06–0.24). Each is in a distinct phase:
  - **Hermes:** stabilizing around v0.23.0; heavy security investment but a 2-month-old top bug (#110374) signals prioritization mismatch.
  - **ZeroClaw:** mid-release-launch; v0.9.0 shipped today with **S0 delegation bypass (#8279) unfixed and blocking CI (#12320) red** — highest *risk* of the tier, though also the most strategically ambitious.
  - **QwenPaw:** post-2.3.0 regression stabilization; distinctive strength is a **responsive first-time-contributor funnel** (issues reported and fix PRs opened same-day, e.g., #8700 → #8701), suggesting good mentorship/scoping.
- **Tier 3 — Dormant:** **IronClaw** (zero activity). Should be monitored for revival or deprecation.

**Maturity assessment:** No project in this set is yet "stable" in the production sense. OpenClaw is the most *process-mature*; ZeroClaw is the most *architecturally deliberate* (RFC-driven, error-code taxonomy); QwenPaw is the most *contributor-friendly*; Hermes is the most *security-invested*. The ecosystem as a whole is in a **"scaling adolescence"** — tools that work impressively in demos break at 3.5 GB DBs, multi-workspace setups, and external-contributor onboarding.

---

## 7. Trend Signals

The following signals, extracted from cross-project community feedback, carry direct value for AI-agent developers and decision-makers:

1. **"Silent success" is the new "crash."** Every project has at least one high-engagement bug where the system *appears* to succeed but silently drops content, status, or billing data (OpenClaw #144809, Hermes #110374/#154612, QwenPaw #8580, ZeroClaw #12405). **Design implication:** build first-class delivery/acknowledgement telemetry into agent loops; never infer success from absence of errors.

2. **Guardrails must distinguish "stuck" from "waiting."** The QwenPaw doom-loop gate and OpenClaw memory circuit-breaker both misfire on legitimate background/polling work. **Design implication:** loop-control primitives need an explicit "external-wait" state, not just iteration/error counters.

3. **Multi-tenancy is the 2026-Q4 forcing function.** OIDC, per-sender RBAC, per-workspace channel isolation, and delegation permission ceilings appear independently in ZeroClaw, QwenPaw, and OpenClaw. **Design implication:** choose your identity/isolation model *before* you need it; retrofitting tenancy onto single-operator assumptions is expensive.

4. **Delegation is a privilege-escalation surface.** ZeroClaw's S0 (#8279, sub-agent inherits unfiltered parent tools) is an early warning the entire ecosystem will eventually face. **Design implication:** permission intersection (never union) across agent delegation is a baseline safety property.

5. **Billing-grade metering is a first-class feature, not a nice-to-have.** Hermes's four competing usage-accounting PRs and QwenPaw's cron-usage omission show that cost visibility is now a primary user expectation. **Design implication:** persist model identity, cache/reasoning usage, and provider attribution on every turn.

6. **Contributor onboarding is a stability signal.** Hermes's broken fork-PR path and ZeroClaw's red CI gate both block external contribution. **Design implication:** the health of your contribution pipeline predicts your ability to absorb the next growth phase.

7. **Review capacity — not contributor interest — is the ecosystem bottleneck.** Merge-to-intake ratios below 0.3 across the board indicate the field's constraint has shifted from *who writes code* to *who reviews it*. Projects that invest in delegated triage, automated review, and maintainer expansion will outpace peers in the next 6 months.

8. **Stable releases are diverging from fixed code.** OpenClaw's fixes locked in beta, ZeroClaw's release alongside red CI, and QwenPaw's regression-heavy 2.3.0 all point to a **release-engineering gap** across the ecosystem. Users increasingly ask "which version actually has the fix?" — a trust tax the category is paying collectively.

---

*Report compiled from 2026-11-13 community digests. All project links reference their respective GitHub repositories at github.com/{openclaw, NousResearch/hermes-agent, nearai/ironclaw, agentscope-ai/QwenPaw, zeroclaw-labs/zeroclaw}.*

---

## Peer Project Reports

<details>
<summary><strong>Hermes Agent</strong> — <a href="https://github.com/nousresearch/hermes-agent">nousresearch/hermes-agent</a></summary>

# Hermes Agent — Project Digest
**Date: 2026-11-13** | Source: [github.com/NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent)

---

## 1. Today's Overview

Hermes Agent remains a high-velocity project: **50 issues** and **50 PRs** were updated in the last 24 hours, though only 3 PRs were merged/closed — a telling asymmetry between intake and throughput. Open/active issues (40 of 50) and open PRs (47 of 50) continue to accumulate, and **no new release** was cut today. Activity is concentrated in stability work — a large "sec-marathon" batch of security PRs (see §3/§5), Slack status-indicator regressions, and auxiliary/Responses usage accounting. Community engagement is moderate but focused, with the top issue (#131859, fork PR permission errors) drawing 59 comments and remaining blocked on an upstream cause.

**Health assessment:** Actively maintained and rapidly evolving, but showing classic scaling strain — a growing open-issue/PR backlog, several long-lived P2 bugs (e.g., Slack broken since slack-sdk 3.44), and recurring fork-PR permission failures that frustrate external contributors.

---

## 2. Releases

**No new releases today.** Latest visible install reference in ticket data is **v0.23.0** (commit `6b21d0564d`), with `v0.22.5` still reported by some users (e.g., #146035 at `0.22.5+1116`). No changelog, breaking changes, or migration notes to report.

---

## 3. Project Progress

Only **3 PRs merged/closed** in the last 24h (1:16 merge-to-intake ratio vs. 50 PRs touched), so today was predominantly **review/iteration**, not landing. Observable advances:

- **Security hardening wave (open, under review):** A coordinated "sec-marathon" set of fixes targeting SSRF/redirect handling and identity/logging leakage:
  - [#154481](https://github.com/NousResearch/hermes-agent/pull/154481) — Desktop: refuse private destinations and re-check redirects in link-title/favicon prefetch.
  - [#154512](https://github.com/NousResearch/hermes-agent/pull/154512) — Gateway: re-check every redirect hop for Mattermost/Weixin media downloads.
  - [#154502](https://github.com/NousResearch/hermes-agent/pull/154502) — Gateway: intersect DM/group grants for ambiguous `chat_type`.
  - [#154560](https://github.com/NousResearch/hermes-agent/pull/154560) — Slack Connect: resolve event identity against authenticated installs, refuse external-org DMs.
  - [#154614](https://github.com/NousResearch/hermes-agent/pull/154614) — Gateway: keep user content/identities out of INFO+ logs (HX017).
  - [#154649](https://github.com/NousResearch/hermes-agent/pull/154649) — Terminal: safer sudo password handling via askpass helper.
- **UX/stability fixes opened today by teknium1:**
  - [#154766](https://github.com/NousResearch/hermes-agent/pull/154766) — MCP `cwd: ~/dir` now expands instead of failing with "missing executable."
  - [#154767](https://github.com/NousResearch/hermes-agent/pull/154767) — Background reviews no longer lost when the next message arrives.
  - [#154765](https://github.com/NousResearch/hermes-agent/pull/154765) — Opt-in `terminal.background_on_timeout` so long builds survive timeouts.
  - [#154761](https://github.com/NousResearch/hermes-agent/pull/154761) — MCP sign-ins survive transient login-server outages.
- **Closed issues today (design decisions made):** model presets/expert-on-demand ([#20249](https://github.com/NousResearch/hermes-agent/issues/20249), closed `sweeper:not-planned`), named LLM model entities ([#12658](https://github.com/NousResearch/hermes-agent/issues/12658), not-planned), reusable model definitions ([#15593](https://github.com/NousResearch/hermes-agent/issues/15593)), per-model `reasoning_effort` defaults ([#21256](https://github.com/NousResearch/hermes-agent/issues/21256)) — indicating config unification is being deferred/reworked rather than shipped.

---

## 4. Community Hot Topics

| Rank | Item | Activity | Underlying need |
|---|---|---|---|
| 1 | [#131859](https://github.com/NousResearch/hermes-agent/issues/131859) — Cannot open PR via API: `CreatePullRequest` permission error (fork PRs) | 59 comments, blocked, `cause/upstream` | **External contribution is broken for some accounts.** Contributors want a reliable fork-PR path. |
| 2 | [#110374](https://github.com/NousResearch/hermes-agent/issues/110374) — Slack status indicator silently broken with slack-sdk ≥3.44 | 15 comments, 👍17 | Most-liked item today. Users want Slack parity; silent failures erode trust. |
| 3 | [#97390](https://github.com/NousResearch/hermes-agent/issues/97390) — Per-channel background idle context compaction for gateway sessions | 7 comments | Long-lived messaging sessions need proactive context management. |
| 4 | [#112866](https://github.com/NousResearch/hermes-agent/issues/112866) / [#132594](https://github.com/NousResearch/hermes-agent/issues/132594) — Duplicates of Slack `setStatus` free-text failure | 6 / 4 comments | Confirms #110374 is a widespread, unpatched regression. |
| 5 | [#20249](https://github.com/NousResearch/hermes-agent/issues/20249) / [#12658](https://github.com/NousResearch/hermes-agent/issues/12658) — Model presets & named model entities | 13 / 4 comments, closed | Strong demand for **per-task/per-model config reuse**; closed as not-planned → likely community friction. |

**Signal:** The loudest threads cluster around (a) external-contributor friction, (b) Slack adapter regressions, and (c) model/reasoning configuration ergonomics.

---

## 5. Bugs & Stability (ranked by severity)

**P2 — High impact:**
- **Slack `setStatus` regression** ([#110374](https://github.com/NousResearch/hermes-agent/issues/110374), [#112866](https://github.com/NousResearch/hermes-agent/issues/112866), [#132594](https://github.com/NousResearch/hermes-agent/issues/132594)) — Status/typing indicators silently fail with slack-sdk ≥3.44. *No fix PR visible.* **Longest-running top bug (since Sept 13).**
- **Gateway session_reset continuation binds to parent chat** ([#150614](https://github.com/NousResearch/hermes-agent/issues/150614)) — New messages appear to vanish. *No fix PR.*
- **ACP `PromptResponse.usage` double-counts resumed sessions** ([#146475](https://github.com/NousResearch/hermes-agent/issues/146475)) — Billing/metering accuracy. *No fix PR.*
- **Config round-trip loses quoting** ([#147594](https://github.com/NousResearch/hermes-agent/issues/147594)) — CLI config corruption risk. *No fix PR.*
- **Desktop backend pool scope key misresolved** ([#107828](https://github.com/NousResearch/hermes-agent/issues/107828)) — Remote-only profiles force-started locally in a 30s loop.
- **Kanban workers on `openai-codex` never start** ([#150307](https://github.com/NousResearch/hermes-agent/issues/150307)) — Regression post-v0.23.0 (`EOFError`, managed worker lost).
- **Bot-relay mailbox root-ambiguous** ([#146035](https://github.com/NousResearch/hermes-agent/issues/146035)) — Cross-machine agent DMs stall.
- **Bot Mode relay drops cloud deliveries silently** ([#154612](https://github.com/NousResearch/hermes-agent/issues/154612)) — No error either side (worst kind of failure).
- **Multi-profile plugin dependency resolution** ([#154627](https://github.com/NousResearch/hermes-agent/issues/154627)) — Hindsight missing `hindsight-client`; partially clarified via correction.
- **MCP `~` cwd failure** ([#154766](https://github.com/NousResearch/hermes-agent/pull/154766)) — **Fix PR open (today).**
- **Terminal timeout kills long jobs** ([#154765](https://github.com/NousResearch/hermes-agent/pull/154765)) — **Fix PR open (opt-in).**
- **Cron unreachable-retry state not reset after edits** ([#154402](https://github.com/NousResearch/hermes-agent/pull/154402)) — **Fix PR open.**
- **Memory writer lock per-path vs. per-target** ([#154764](https://github.com/NousResearch/hermes-agent/pull/154764)) — Data loss across symlinked profiles. **Fix PR open.**
- **Auxiliary Responses usage/model identity lost** ([#148539](https://github.com/NousResearch/hermes-agent/pull/148539), [#152039](https://github.com/NousResearch/hermes-agent/pull/152039), [#105273](https://github.com/NousResearch/hermes-agent/pull/105273)) — Multiple competing fix PRs; billing accuracy.

**P3 — Lower impact:**
- Fork-PR `FORBIDDEN` ruleset blocks ([#137800](https://github.com/NousResearch/hermes-agent/issues/137800)) — tied to protect-main ruleset change (Oct 6).
- Desktop reasoning-effort shadowing config ([#107949](https://github.com/NousResearch/hermes-agent/issues/107949)); Bots-tab cross-connection misrouting ([#151990](https://github.com/NousResearch/hermes-agent/issues/151990)); `session_search` hiding FTS matches ([#103184](https://github.com/NousResearch/hermes-agent/issues/103184)); CLI/TUI cwd drift ([#86479](https://github.com/NousResearch/hermes-agent/pull/86479)).

**Takeaway:** A meaningful share of P2 bugs are **silent-failure classes** (Slack status, Bot Mode relay, session_search) — the hardest to detect and most damaging to trust. Several now have pending fix PRs, but the Slack regression has lingered ~2 months.

---

## 6. Feature Requests & Roadmap Signals

**Config/model unification (high demand, mixed signals):**
- Model presets / named model entities ([#20249](https://github.com/NousResearch/hermes-agent/issues/20249), [#12658](https://github.com/NousResearch/hermes-agent/issues/12658), [#15593](https://github.com/NousResearch/hermes-agent/issues/15593)) — all **closed as not-planned** today, suggesting the maintainers are consolidating config design rather than approving piecemeal requests.
- Per-model `reasoning_effort` defaults via custom providers ([#21256](https://github.com/NousResearch/hermes-agent/issues/21256), closed) and effort caps for custom OpenAI-compatible providers ([#154352](https://github.com/NousResearch/hermes-agent/issues/154352), open).
- Static presets for config reuse ([#107745](https://github.com/NousResearch/hermes-agent/issues/107745)); favorite-model hotkeys ([#106105](https://github.com/NousResearch/hermes-agent/issues/106105)); `/model` picker prompting reasoning level ([#25364](https://github.com/NousResearch/hermes-agent/issues/25364)).

**Agent/compression & tooling:**
- Idle context compaction for gateway sessions ([#97390](https://github.com/NousResearch/hermes-agent/issues/97390)); reuse main Responses prefix for summaries ([#152322](https://github.com/NousResearch/hermes-agent/pull/152322)).
- Version-agnostic MCP server paths ([#153351](https://github.com/NousResearch/hermes-agent/issues/153351)).
- Approval cards showing agent intent/purpose ([#113330](https://github.com/NousResearch/hermes-agent/issues/113330)).

**Next-version prediction:** Likely candidates for the next release are the **already-PR'd fixes** (Slack-adjacent security, MCP `~`/redirect handling, terminal background-on-timeout, memory locking, auxiliary usage accounting). Config unification is probably a **larger design effort** not landing immediately, given today's not-planned closures.

---

## 7. User Feedback Summary

- **Satisfaction:** Security rigor is visibly prioritized (sec-marathon), and maintainer-authored fixes (teknium1) address real edge cases (MCP `~`, background reviews, MCP sign-in resilience).
- **Dissatisfaction / pain points:**
  - **External contributors blocked:** #131859 (59 comments) and #137800 — fork PR creation fails with `CreatePullRequest FORBIDDEN`, blamed on the `protect-main` ruleset. This is a reputational and onboarding issue.
  - **Silent failures:** Slack status (#110374, most-liked), Bot Mode relay dropping messages with no error (#154612), session_search returning 0 hidden by filters (#103184).
  - **Perceived dismissal of config requests:** multiple model-preset issues closed not-planned with no shipped alternative — users explicitly asked to reduce config repetition.
  - **Billing accuracy concerns:** repeated ACP/auxiliary token double-counting and missing cache/reasoning usage (#146475, #148539, #152039, #105273) — matters for anyone metering cost.
- **Use cases surfacing:** long-lived Slack/Telegram gateway sessions, cross-machine Bot Mode DMs, Kanban multi-profile workers, MCP server orchestration, SSH multi-connection Desktop usage.

---

## 8. Backlog Watch (needs maintainer attention)

| Item | Age | Why it matters |
|---|---|---|
| [#110374](https://github.com/NousResearch/hermes-agent/issues/110374) Slack `setStatus` broken (slack-sdk ≥3.44) | Since **2026-09-13** (~2 months), 3 duplicate reports, 👍17 | Most-engaged bug, no fix PR — user-visible regression. |
| [#131859](https://github.com/NousResearch/hermes-agent/issues/131859) Fork PR `CreatePullRequest` permission error | Since **2026-10-03**, blocked/upstream, 59 comments | Directly blocks external contributions; upstream dependency needs a decision. |
| [#137800](https://github.com/NousResearch/hermes-agent/issues/137800) protect-main ruleset blocks fork PRs | Since **2026-10-13** | Same root cause as above; ruleset change (Oct 6) is identifiable. |
| [#107828](https://github.com/NousResearch/hermes-agent/issues/107828) Desktop backend pool scope key misuse | Since **2026-09-11** | 30s loop, remote-only profiles force-local — resource churn. |
| [#97390](https://github.com/NousResearch/hermes-agent/issues/97390) Idle context compaction | Since **2026-08-28**, `needs-decision` | High-value gateway feature; awaiting maintainer decision. |
| [#86479](https://github.com/NousResearch/hermes-agent/pull/86479) Keep CLI/TUI in launch dir | PR since **2026-08-14** | Long-open P2 compat fix; `sweeper:risk-compatibility`. |
| [#105273](https://github.com/NousResearch/hermes-agent/pull/105273) Auxiliary Responses usage retention | PR since **2026-09-07** | Overlaps #148539/#152039 — consolidating these would reduce churn. |

---

### Bottom Line
Hermes Agent is **healthy in activity but strained in throughput**: heavy intake and security investment, yet a widening open-PR backlog and a ~2-month-old top bug. The highest-leverage moves would be (1) unblocking fork PRs (#131859/#137800), (2) landing a Slack `setStatus` fix, and (3) consolidating the overlapping auxiliary-usage PRs — all of which would materially improve contributor and user trust.

</details>

<details>
<summary><strong>IronClaw</strong> — <a href="https://github.com/nearai/ironclaw">nearai/ironclaw</a></summary>

No activity in the last 24 hours.

</details>

<details>
<summary><strong>QwenPaw</strong> — <a href="https://github.com/agentscope-ai/QwenPaw">agentscope-ai/QwenPaw</a></summary>

# QwenPaw Project Digest — 2026-11-13

## 1. Today's Overview

QwenPaw is in an active **post-2.3.0 stabilization phase**. The v2.3.0 release (PyPI, 2026-11-11) and the 2.3.0 beta series have introduced a cluster of regressions, with the vast majority of today's 23 updated issues being bug reports tied to that release (channel plugin activation failures, workspace path handling, auth bypass, cron accounting). Activity is high — 50 PRs touched in 24h, 38 still open — but the merged/closed queue (12 items) is dominated by cleanup rather than net-new feature landings. A notable pattern is **first-time contributors arriving with surgical fix PRs** for issues reported within the same 24–48h window (e.g., #8704, #8702, #8701, #8703), which suggests a healthy, responsive contributor funnel. No new release shipped today.

---

## 2. Releases

**None.** No new releases in the last 24 hours (latest: 2.3.0 PyPI on 2026-11-11; 2.3.0b2/b3 betas in flight). Given the volume of 2.3.0 regression reports below, a 2.3.1 patch release appears increasingly likely in the near term, though nothing has been tagged.

---

## 3. Project Progress

Twelve PRs were merged/closed in the last 24h, though the top-20-by-comment sample is dominated by still-open work. Closed issues today lean toward console/UX polish and older enhancement requests:

- **#5110 [CLOSED]** — Quote/reference text for follow-up context (Perplexity-style), a long-standing feature request from June.
- **#8035 [CLOSED]** — Transcription settings page `transcription_model` configuration bug (reported Sept).
- **#8605 [CLOSED]** — Browser tab title now tracks session name for multi-tab disambiguation.
- **#8650 / #8612 [CLOSED]** — Visual consistency between thinking blocks and tool cards; clearer "execution-type" tool-call labels.
- **#8663 [CLOSED]** — Safari message-queue action buttons not rendering.

Several **substantial open PRs advanced** today (updated 2026-11-12/13), signaling mid-term trajectory:
- **#8699 [size/XXL]** — Channel plugin updates, version guards, and official marketplace releases. This is the distribution backbone for the plugin migration that is causing today's channel bugs.
- **#8554 [size/XXXL]** — Plugin CLI commands and extension points.
- **#8431 [size/XXXL]** — Local Whisper converted to an SDK plugin with framework-managed lifecycle.
- **#8671 [size/L]** — Console reconnection to externally started chat runs.

---

## 4. Community Hot Topics

**Most-discussed issues (by comments):**

1. **[#8538 [CLOSED]](https://github.com/agentscope-ai/QwenPaw/issues/8538)** — Matrix channel plugin fails to activate when multiple workspaces enable it (6 comments). The shared 10s startup window only covers the first workspace. High engagement because it blocks multi-tenant/multi-workspace users entirely.
2. **[#8580 [OPEN]](https://github.com/agentscope-ai/QwenPaw/issues/8580)** — Memory tag index never rebuilds; `/memory/tags` returns 503 (5 comments). Tags are generated but unreadable — a functional dead-end in the memory subsystem.
3. **[#8184 [OPEN]](https://github.com/agentscope-ai/QwenPaw/issues/8184)** — Doom-loop gate kills legitimate task-authorized polling (4 comments). The gate can't distinguish "stuck" from "waiting on a long background task." Directly related to #8700 and PR #8701/#8702 below.
4. **[#8361 [OPEN]](https://github.com/agentscope-ai/QwenPaw/issues/8361)** — Automatic Memory Search re-calls `memory_search` in the same turn, then fails to finalize after interception (4 comments).

**Underlying needs:** Three of the four top threads are **agent-loop correctness** problems — the framework's guardrails (doom-loop gate, memory-search dedup) are firing on *legitimate* agent behavior and then failing to recover gracefully. Users are running real long-horizon workflows (background tasks, multi-workspace channels) that the loop control logic does not yet model correctly. This is the single most important thematic risk in the current codebase.

**Most-active PRs (by size/scope):** #8588 (OpenViking memory cleanup, XXL), #8236 (Ollama `num_ctx` context sizing, XL), #8018 (sandbox ACL on Windows volume root, XL).

---

## 5. Bugs & Stability

Ranked by severity, with fix-PR status noted:

**Critical / Security**
- **[#8695 [OPEN]](https://github.com/agentscope-ai/QwenPaw/issues/8695)** — *Auth bypass*: same-host reverse proxy skips bearer-token validation due to loopback whitelist + empty `trusted_proxies`. **No fix PR yet.** This is the highest-priority item today — it silently disables API authentication behind a common deployment pattern.

**High — Release-blocking regressions in 2.3.0**
- **[#8655 [OPEN]](https://github.com/agentscope-ai/QwenPaw/issues/8655)** — Attachment path truncated to drive root (`C:\`) since 2.3.0-beta.1; images fail to load. Reproduces on beta.3. **No fix PR.**
- **[#8682 [OPEN]](https://github.com/agentscope-ai/QwenPaw/issues/8682)** — Official channel plugin workers crash on Linux (missing `HOME`/`QWENPAW_WORKING_DIR`). **No fix PR.**
- **[#8693 [OPEN]](https://github.com/agentscope-ai/QwenPaw/issues/8693)** — WeChat channel fails activation with `ACCOUNT_IN_USE` (startup path and workspace projection reserve the same runtime key). **No fix PR.**
- **[#8684 [OPEN]](https://github.com/agentscope-ai/QwenPaw/issues/8684)** — Upgrade does not migrate built-in channel plugins; installed Matrix stays on stale source, so 2.3.0 fixes never apply. **Related PR #8699** (plugin updates/version guards) likely addresses this.
- **[#8698 [OPEN]](https://github.com/agentscope-ai/QwenPaw/issues/8698)** — 2.3.0 upgrade fails because `uv venv --seed` ignores the PyPI mirror. **Fix PR: [#8704](https://github.com/agentscope-ai/QwenPaw/pull/8704)** (first-time contributor, immediate turnaround).

**Medium — Loop/accounting correctness**
- **[#8700 [OPEN]](https://github.com/agentscope-ai/QwenPaw/issues/8700)** — DoomLoopGate never triggers when agentscope accumulates a reply into one assistant message. **Fix PR: [#8701](https://github.com/agentscope-ai/QwenPaw/pull/8701)**.
- **[#8184 [OPEN]](https://github.com/agentscope-ai/QwenPaw/issues/8184)** — Gate kills legitimate polling; cron records false success. **Fix PR: [#8702](https://github.com/agentscope-ai/QwenPaw/pull/8702)**.
- **[#8705 [OPEN]](https://github.com/agentscope-ai/QwenPaw/issues/8705)** — Cron token usage not written to `turns.jsonl`; usage panel under-reports. **No fix PR.**
- **[#8580 [OPEN]](https://github.com/agentscope-ai/QwenPaw/issues/8580)** — Memory tag index permanently 503. **No fix PR.**

**Low / Edge cases**
- **[#8696 [OPEN]](https://github.com/agentscope-ai/QwenPaw/issues/8696)** — Attachments unresolvable when workspace path contains `#` (Windows).
- **[#8688 [OPEN]](https://github.com/agentscope-ai/QwenPaw/issues/8688)** — `~,` tokenization aborts deep path inspection in Python heredocs.
- **[#8674 [OPEN]](https://github.com/agentscope-ai/QwenPaw/issues/8674)** — Query-error dumps accumulate unbounded in temp dir.

**Assessment:** The density of *unfixed* 2.3.0 channel-plugin regressions (#8655, #8682, #8693) against the fact that 2.3.0 shipped two days ago is the dominant stability concern. The loop-gate cluster, by contrast, is moving fast — three fix PRs (#8701, #8702, plus related) landed the same day the issues were filed.

---

## 6. Feature Requests & Roadmap Signals

- **[#8686 [OPEN]](https://github.com/agentscope-ai/QwenPaw/issues/8686)** — Give plugins a documented data directory and audit destructive file operations. Prompted by a third-party plugin deleting `.py` files on startup. **Strong roadmap signal**: the plugin architecture (PR #8554, #8699) is expanding faster than its safety/data-isolation model.
- **[#8683 [OPEN]](https://github.com/agentscope-ai/QwenPaw/issues/8683)** — Better markdown preview (responsive sizing, full-screen, persistent controls) for tablet/vertical browsers.
- **[#8605 [CLOSED]** and **#8650 / #8612 [CLOSED]** — Console UX: tab titles, thinking/tool visual consistency, execution-tool labeling. These closed today and are likely queued for the next patch.

**Prediction for the next version (2.3.1 or 2.4):** channel-plugin migration/version-guard tooling (#8699), a documented plugin data directory (#8686), and the doom-loop gate accounting fixes (#8701/#8702) are the most probable near-term inclusions. A 2.3.1 patch bundling the crash/regression fixes (#8655, #8682, #8693, #8698) is plausible within days given release cadence.

---

## 7. User Feedback Summary

**Pain points (dissatisfaction):**
- **Upgrade fragility.** Multiple independent reports (#8698, #8684, #8655) show the 2.3.0 upgrade path breaking existing installs — mirror seeding, plugin source migration, and path handling. Users are effectively beta-testing a "stable" release.
- **Multi-workspace / multi-channel setups are second-class.** #8538 (Matrix), #8693 (WeChat) both stem from workspace/channel startup coordination. Users running more than one channel per host hit activation collisions.
- **Guardrails punish legitimate work.** #8184 and #8361 share a narrative: the framework's safety mechanisms (doom-loop gate, memory-search dedup) interrupt correct agent behavior and then fail to produce a valid reply. This erodes trust in long-running autonomous tasks.
- **Visual polish gaps** (#8650, #8612, #8683) — repeatedly flagged as minor but persistent, especially for tablet/vertical layouts.

**Satisfaction signals:**
- Very fast maintainer/contributor turnaround on well-scoped loop bugs (#8700 → #8701 same day).
- Console/UX enhancements from users are being implemented and closed (#8605, #8663, #8650, #8612).

**Use cases observed:** multi-workspace Matrix deployments, WeChat channel operation, cron-driven scheduled agents, local Whisper transcription, document (Office COM) automation, and long-horizon background-task polling.

---

## 8. Backlog Watch

Items needing maintainer attention — long-open, high-impact, or without fix PRs:

- **[#8695 [OPEN] — Same-host reverse proxy auth bypass (2.3.0)](https://github.com/agentscope-ai/QwenPaw/issues/8695)** — **Security.** No fix PR. Highest priority for triage.
- **[#8184 [OPEN] — Doom-loop gate terminates legitimate polling (since 2026-10-12)](https://github.com/agentscope-ai/QwenPaw/issues/8184)** — Open a month. Fix PR #8702 addresses the cron-status half, but the root gate-vs-polling distinction may need design discussion.
- **[#8580 [OPEN] — Memory tag index never rebuilds (since 2026-11-04)](https://github.com/agentscope-ai/QwenPaw/issues/8580)** — No fix PR; functional regression in memory subsystem.
- **[#8018 [OPEN] [Under Review, size/XL] — Never write a sandbox ACE on a volume root](https://github.com/agentscope-ai/QwenPaw/pull/8018)** — Open since 2026-09-29, still Under Review. Windows security-relevant.
- **[#8048 [OPEN] [Under Review, size/M] — Guard inline Office COM automation before unsandboxed fallback](https://github.com/agentscope-ai/QwenPaw/pull/8048)** — Same window as #8018; security-relevant, awaiting review.
- **[#8236 [OPEN] [Under Review, size/XL] — Size Ollama context from `num_ctx`](https://github.com/agentscope-ai/QwenPaw/pull/8236)** — Open since 2026-10-14; affects local-model users materially.

The recurring theme across the backlog is **security-review latency**: the auth bypass (#8695) is new and urgent, while two Windows sandbox-hardening PRs (#8018, #8048) have awaited review for six weeks.

---

*Data source: github.com/agentscope-ai/QwenPaw | Window: 2026-11-12 → 2026-11-13*

</details>

<details>
<summary><strong>ZeroClaw</strong> — <a href="https://github.com/zeroclaw-labs/zeroclaw">zeroclaw-labs/zeroclaw</a></summary>

# ZeroClaw Project Digest — 2026-11-13

## 1. Today's Overview

ZeroClaw shows continued high velocity heading into the v0.9.0 release window, with **50 issues and 50 PRs updated in the last 24 hours** and one major release published (v0.9.0). Activity is heavily weighted toward the security and multi-tenancy roadmap: filesystem sandbox policy (#6996), per-sender RBAC (#5982), and OIDC inbound authentication (#8289) dominate discussion. However, project health is currently degraded by two blocking CI/security problems — issue **#12320** (RUSTSEC-2026-0459 libsqlite3-sys) is failing the `Security` job on every build, which blocks the merge queue entirely, and **#7462** reports 74 test failures on Windows that CI does not catch. The merged-PR count (4) is low relative to 46 open PRs, and many long-running PRs (#10391, #9809, #11847) are marked `needs-author-action` or `needs-maintainer-review`, indicating a review bottleneck.

---

## 2. Releases

### v0.9.0 — "First multi-user release"

**Headline:** The first release in which people other than the operator can sign in, spanning **117 commits from 22 contributors**.

Key changes:
- **OpenID Connect sign-in** for the dashboard via your own OIDC provider.
- **Scoped chats for non-admin accounts** — users who aren't administrators get their own isolated chat scope.
- This is a **first multi-tenant / identity milestone**, building on the tracker [#8289 (OIDC milestone: canonical principals and inbound authentication)](https://github.com/zeroclaw-labs/zeroclaw/issues/8289) and [#7432 (Runtime, dashboard sign-in and gateway delivery)](https://github.com/zeroclaw-labs/zeroclaw/issues/7432).

**Migration / breaking-change notes:** The release notes were truncated in the source data ("...an"), so full migration guidance could not be verified here. **Operators upgrading from v0.8.x should review the full v0.9.0 changelog and the v0.9.1 milestone** ([#8358](https://github.com/zeroclaw-labs/zeroclaw/issues/8358), [#7432](https://github.com/zeroclaw-labs/zeroclaw/issues/7432)) before upgrading, particularly around auth/config schema changes.

**Immediate post-release risk:** v0.9.0 shipped while the `Security` CI job is red ([#12320](https://github.com/zeroclaw-labs/zeroclaw/issues/12320)), meaning a **v0.9.1 patch release is already effectively required** — several issues are explicitly labeled `release:v0.9.1` ([#7432](https://github.com/zeroclaw-labs/zeroclaw/issues/7432), [#8289](https://github.com/zeroclaw-labs/zeroclaw/issues/8289), [#11580](https://github.com/zeroclaw-labs/zeroclaw/issues/11580)).

---

## 3. Project Progress

**4 PRs were merged/closed in the last 24h** (out of 50 updated). The data shows a merge-to-open ratio of roughly **1:11**, reflecting a substantial review backlog rather than a lack of contributor interest.

**Features advancing (still open, in review):**
- **Inter-agent session tooling** — [#12258 `sessions_prompt` (sync inter-agent session prompting)](https://github.com/zeroclaw-labs/zeroclaw/pull/12258) and [#12259 async `sessions_message` scaffold](https://github.com/zeroclaw-labs/zeroclaw/pull/12259) both authored by Audacity88, moving the agent-to-agent messaging roadmap forward.
- **Sandbox policy unification** — [#7821 canonical `sandbox_policy` schema with application-layer enforcement](https://github.com/zeroclaw-labs/zeroclaw/pull/7821) addresses the long-running drift described in [#6996](https://github.com/zeroclaw-labs/zeroclaw/issues/6996).
- **Goal Mode foundation** — [#11878 durable task lifecycle foundation [1/12]](https://github.com/zeroclaw-labs/zeroclaw/pull/11878) is the first slice of a 12-part Goal Mode proposal.
- **Multi-model provider profiles** — [#9809 support multiple models per provider profile](https://github.com/zeroclaw-labs/zeroclaw/pull/9809) (schema-v4 connections, fallback graphs).
- **New channels/providers** — [#11847 native Rust XMPP with optional legacy OMEMO](https://github.com/zeroclaw-labs/zeroclaw/pull/11847) and [#12406 Parallel web search provider](https://github.com/zeroclaw-labs/zeroclaw/pull/12406).

**Closures:** [#11853 `ci: npm audit failed — 2026-10-19`](https://github.com/zeroclaw-labs/zeroclaw/issues/11853) (Tailwind typography moderate advisory) was **closed today**, indicating the JS dependency audit path was remediated.

---

## 4. Community Hot Topics

Ranked by comment count (most active first):

| Rank | Item | Comments | Theme |
|---|---|---|---|
| 1 | [#6996 RFC: Granular sandbox policy - filesystem restrictions](https://github.com/zeroclaw-labs/zeroclaw/issues/6996) | 29 | Security architecture |
| 2 | [#7462 74 test failures on Windows](https://github.com/zeroclaw-labs/zeroclaw/issues/7462) | 19 | Cross-platform CI |
| 3 | [#8396 RFC: Make wire protocol first-class in provider construction](https://github.com/zeroclaw-labs/zeroclaw/issues/8396) | 19 | Provider architecture |
| 4 | [#7432 [Tracker]: Runtime, dashboard sign-in and gateway delivery](https://github.com/zeroclaw-labs/zeroclaw/issues/7432) | 17 | v0.9.x release coordination |
| 5 | [#5937 refactor: Unify providers architecture and reqwest client management](https://github.com/zeroclaw-labs/zeroclaw/issues/5937) | 12 | Tech debt |
| 6 | [#5982 Per-sender RBAC for multi-tenant agent deployments](https://github.com/zeroclaw-labs/zeroclaw/issues/5982) | 12 | Multi-tenancy |

**Underlying needs analysis:**
- **Sandboxing and filesystem policy (#6996)** is the single hottest topic, driven by a real architectural problem: *two filesystem-policy layers that have historically drifted* (application-layer path admission vs. OS sandbox backends like Bubblewrap/Landlock/Seatbelt). Users are asking for **one authoritative policy model**.
- **Provider architecture (#8396, #5937)** reveals recurring dissatisfaction with **inconsistent `reqwest` usage and fragmented provider config** — contributors want a first-class wire-protocol abstraction.
- **Multi-tenancy (#5982, #7432, #8289)** is the strategic theme of this release cycle: the community is converging on building sender roles on the *existing agent/risk-profile model* rather than a separate `[rbac.*]` subsystem.
- **Windows support (#7462)** is a persistent, unresolved gap (no 👍 but high comment count = active debugging, not broad upvoting).

---

## 5. Bugs & Stability

Ranked by severity (S0 highest):

| Severity | Issue | Status | Fix PR? |
|---|---|---|---|
| **S0** | [#8279 delegate bypasses parent's tool allowlist — sub-agent can invoke tools the parent policy excludes](https://github.com/zeroclaw-labs/zeroclaw/issues/8279) | accepted, `p1` | Related work in [#10391](https://github.com/zeroclaw-labs/zeroclaw/pull/10391) |
| **S1** | [#12320 Security job fails on every build: RUSTSEC-2026-0459 (libsqlite3-sys 0.38.2)](https://github.com/zeroclaw-labs/zeroclaw/issues/12320) | open, `release:v0.9.1` | **No fix PR yet** — blocks merge queue |
| **S1** | [#8794 [web dashboard] stopping agent mid-work erases tool calls and thinking from context](https://github.com/zeroclaw-labs/zeroclaw/issues/8794) | accepted, `p1` | No |
| **S1** | [#7462 74 Windows test failures (Unix-only commands, path semantics, cp936 console encoding)](https://github.com/zeroclaw-labs/zeroclaw/issues/7462) | in-progress | Related: [#7461 CI matrix](https://github.com/zeroclaw-labs/zeroclaw/issues/7461) |
| **S2** | [#6105 Agent lacks context of the cron job it ran](https://github.com/zeroclaw-labs/zeroclaw/issues/6105) | in-progress | No |
| **S2** | [#8642 MCP/tool-schema cloning drives unbounded RSS growth](https://github.com/zeroclaw-labs/zeroclaw/issues/8642) | accepted, `help wanted` | No |

**Critical stability risks:**
1. **#12320 is the most urgent item in the project** — it fails `CI Required Gate` on *every* run, so "no pull request can merge and the merge queue can't land anything." This is a **release-blocking dependency vulnerability** in bundled SQLite.
2. **#8279 is a genuine S0 security regression**: the `delegate` tool populates sub-agents with the **unfiltered** parent tool set, so a sub-agent can call tools the parent's policy explicitly excludes. This directly undermines the sandbox/RBAC model the project is otherwise investing heavily in.
3. **#8642 (memory growth / OOM)** remains open and `help wanted`, split from the multi-root-cause tracker #5542 — no owner.

---

## 6. Feature Requests & Roadmap Signals

Most-likely-to-land-in-v0.9.1 / next cycle (based on `release:v0.9.1` labels and active PRs):

1. **OIDC close-out** ([#8289](https://github.com/zeroclaw-labs/zeroclaw/issues/8289)) — core stack merged; remaining gap is canonical principals and enrollment migration. **High confidence for v0.9.1.**
2. **Runtime / dashboard sign-in / gateway delivery** ([#7432](https://github.com/zeroclaw-labs/zeroclaw/issues/7432)) — explicit v0.9.1 tracker.
3. **Release binary size gate resolution** ([#11580](https://github.com/zeroclaw-labs/zeroclaw/issues/11580)) — x86_64 Linux binary is ~0.7 MB (1%) under the 64 MiB hard cap; needs a headroom policy decision before next release.
4. **Subscription-native provider auth** ([#5601](https://github.com/zeroclaw-labs/zeroclaw/issues/5601)) — Ollama Cloud, Z.AI, Kimi Code, MiniMax; extends the existing OAuth/login pattern.
5. **Per-sender RBAC** ([#5982](https://github.com/zeroclaw-labs/zeroclaw/issues/5982)) — narrowed scope, builds on agent/risk-profile; draft PR #11068 exists.
6. **Unified capability catalog / "everything is a plugin"** ([#6489](https://github.com/zeroclaw-labs/zeroclaw/issues/6489)) — north-star product direction, longer horizon.
7. **Air-gapped execution mode** ([#6293](https://github.com/zeroclaw-labs/zeroclaw/issues/6293)) — blocked RFC; niche but security-critical.

Smaller feature requests with recent activity: per-skill security permissions ([#5775](https://github.com/zeroclaw-labs/zeroclaw/issues/5775)), deterministic cron precondition gates ([#5607](https://github.com/zeroclaw-labs/zeroclaw/issues/5607)), typed per-agent git identity ([#8226](https://github.com/zeroclaw-labs/zeroclaw/issues/8226)), and TOTP for cross-channel critical-tool approval ([#3767](https://github.com/zeroclaw-labs/zeroclaw/issues/3767)).

---

## 7. User Feedback Summary

**Pain points expressed by real users:**

- **"My agent can't see what it just sent."** ([#6105](https://github.com/zeroclaw-labs/zeroclaw/issues/6105)) — when an agent sends a cron-triggered reminder, it has no reference to the message it produced, breaking conversational continuity.
- **"Stopping the agent erases its work."** ([#8794](https://github.com/zeroclaw-labs/zeroclaw/issues/8794)) — cancelling mid-turn drops all tool calls and reasoning from context as if the step never happened. Reported as `S1 - workflow blocked`.
- **"Delegation silently widens permissions."** ([#8279](https://github.com/zeroclaw-labs/zeroclaw/issues/8279)) — a security-conscious user found that a sub-agent can invoke tools the parent policy excludes, undermining their sandbox.
- **"My container OOMs when the LLM falls back to shell."** ([#6916](https://github.com/zeroclaw-labs/zeroclaw/issues/6916)) — observed in production where `wkhtmltopdf` consumed all memory; users want process-level memory caps on shell/skill subprocesses.
- **"Enabling one skill's permissions opens them for all."** ([#5775](https://github.com/zeroclaw-labs/zeroclaw/issues/5775)) — global `allow_scripts`/`allowed_commands` flags break least-privilege; users want per-skill scoping.
- **"Telegram replies to media lose the content."** ([#12405](https://github.com/zeroclaw-labs/zeroclaw/pull/12405), [#12197](https://github.com/zeroclaw-labs/zeroclaw/pull/12197)) — a user replying "summarize this" to a PDF gets nothing, because replies reduce quoted media to a bare `[Document]` marker.

**Sentiment:** Generally constructive and security-forward, but there is a clear pattern of **frustration with multi-tenancy/sandboxing edge cases** (delegation bypass, per-skill scoping, memory limits) and **regression-like UX issues** (context loss on stop, media reply handling). The community is clearly pushing ZeroClaw toward **production multi-tenant deployment**, which is exactly where several current gaps (RBAC, sandbox granularity, OIDC close-out) live.

---

## 8. Backlog Watch

Items needing maintainer attention (long-open, high-impact, or blocked):

**Blocked / stalled but important:**
- [#6293 RFC: Air-gapped execution mode with companion daemon over unix socket](https://github.com/zeroclaw-labs/zeroclaw/issues/6293) — `status:blocked`, `type:rfc`. Enclave support is a strategic security capability with no clear unblock path.
- [#5869 security: rumqttc v0.25.1 pins vulnerable rustls-webpki — RUSTSEC cluster (0049/0098/0099/0104/0134)](https://github.com/zeroclaw-labs/zeroclaw/issues/5869) — `status:blocked`. Single transitive dep holding back TLS fixes; 5 comments and no resolution path.
- [#8519 Reconcile cargo-audit ignores and remediate wasmtime-wasi CVEs](https://github.com/zeroclaw-labs/zeroclaw/issues/8519) — `p1`, `type:dependencies`, `.audit.toml`/`deny.toml` drift.

**Long-running high-value items:**
- [#3767 require TOTP for cross-channel approval of critical tools](https://github.com/zeroclaw-labs/zeroclaw/issues/3767) — open since **2026-03-17**, `p1`, security:policy. 8 months old with only 4 comments; needs a decision.
- [#5937 Unify providers architecture and reqwest client management](https://github.com/zeroclaw-labs/zeroclaw/issues/5937) — open since **2026-04-20**, 12 comments, still `status:accepted` with no PR.
- [#6917 Honor action-scope filter in Composio tool dispatch](https://github.com/zeroclaw-labs/zeroclaw/issues/6917) — plus [#6916 process-memory limits on shell subprocesses](https://github.com/zeroclaw-labs/zeroclaw/issues/6916) — both `p1/p2` security, no fix PRs.
- [#7130 forbid(unsafe_code) workspace-wide with narrow reviewed unsafe boundaries](https://github.com/zeroclaw-labs/zeroclaw/issues/7130) — safety hardening, no PR.

**PRs awaiting author/maintainer action:**
- [#9809 multi-model provider profiles](https://github.com/zeroclaw-labs/zeroclaw/pull/9809) — open since **2026-08-07**, `needs-author-action`, size:XL. High-value but stalled ~3 months.
- [#10391 keep bounded delegate's workspace/tool ceiling/command policy bound](https://github.com/zeroclaw-labs/zeroclaw/pull/10391) — the **fix for S0 #8279 and #9872**, open since 2026-08-26, `needs-author-action`. This is arguably the most important unmerged security fix in the repo.
- [#11847 native Rust XMPP with OMEMO](https://github.com/zeroclaw-labs/zeroclaw/pull/11847) and [#7821 canonical sandbox_policy schema](https://github.com/zeroclaw-labs/zeroclaw/pull/

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*