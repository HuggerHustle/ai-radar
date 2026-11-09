# OpenClaw Ecosystem Digest 2026-11-09

> Issues: 498 | PRs: 500 | Projects covered: 5 | Generated: 2026-11-09 00:44 UTC

- [OpenClaw](https://github.com/openclaw/openclaw)
- [Hermes Agent](https://github.com/nousresearch/hermes-agent)
- [IronClaw](https://github.com/nearai/ironclaw)
- [QwenPaw](https://github.com/agentscope-ai/QwenPaw)
- [ZeroClaw](https://github.com/zeroclaw-labs/zeroclaw)

---

## OpenClaw Deep Dive

# OpenClaw Project Digest — 2026-11-09

## 1. Today's Overview

OpenClaw is in a **high-activity maintenance window**, with 498 issues and 500 PRs touched in the last 24 hours (374 open/active issues, 343 open PRs) — a very heavy load for a 24-hour window. One release shipped (v2026.11.2), focused on privacy and trust boundaries, while 157 PRs merged/closed. The issue mix shows a **stability-heavy** pattern: several P0/P1 open bugs (SQLite worker OOM, event-loop stalls, crash loops, message loss) with linked fix PRs, plus long-running stale items. The project is clearly moving but is also carrying a significant backlog of crash-loop and memory-growth defects.

## 2. Releases

### v2026.11.2 — Privacy & Trust Boundaries

**Highlights**
- **Privacy and trust boundaries hardening:** configuration secrets, conversation content, tool errors, and channel payloads are kept out of diagnostic logs.
- **Enforced provider and navigation trust boundaries** for the selected provider and navigation.
- **MCP grants released after warm CLI turns** — the MCP permission lifecycle is now cleaned up correctly.

**Notes:** No breaking changes explicitly listed in the release notes. One related PR (#195249) is the main closeout for this release — "The approved 2026.11.2 release source remains frozen at `b556fdf...`; this main closeout does not rebuild, repack, or republish its tag or artifacts." That PR is **open**, so the release branch closeout on main is still pending.

## 3. Project Progress

- **Closed/merged PRs (157):** Notable closed PRs include:
  - #195444 — fix(ui): keep IME composition Enter from connecting from the login form (CLOSED, ready for maintainer look).
  - #195455 — fix(channels): `channels remove` now reports unknown channel before prompting to disable (CLOSED).
- **Closed issues (124):** A batch of stale issues closed, including #131150 (Slack DMs silently dropped after gateway restart), #53408 (write/exec tool parameters dropped after long conversations), #67413 (per-agent dreaming configuration), #168794 (Codex relay >32 MiB image requests → 502), #165421 (Control UI stale maxTokens), #184658 (Windows npm update cleanup failures), #137188 (stale session progress card), #126727 (provider-aware concurrency).
- **Open PRs with progress:** 343 open PRs are active, including large "fix" PRs targeting memory, auth, and crash issues (see §5). PR #194566 "record bounded prompt presence checks for frozen injection expectations" is a substantial feature moving toward the injection-verification layer.

## 4. Community Hot Topics

**Most-commented issues (highest engagement):**

1. **#166634 — Late reclamation commit checkpoint failure leaves agent unavailable after crash** (26 comments) — open. Gateway crash recovery leaves agent permanently refusing `chat.history`, `models.list`, etc. [Link](https://github.com/openclaw/openclaw/issues/166634)
2. **#191944 — macOS `gateway stop` / `stop --force` both fail with "Process ancestry could not be fully inspected"** (25 comments) — open. [Link](https://github.com/openclaw/openclaw/issues/191944)
3. **#38327 — "Cannot convert undefined or null to object" with google-vertex/gemini-3.1-pro** (18 comments, 3 👍) — open, regression since 2026.3.2. [Link](https://github.com/openclaw/openclaw/issues/38327)
4. **#53408 — Write/exec tool parameters silently dropped after long conversations** (17 comments, 2 👍) — closed (stale). [Link](https://github.com/openclaw/openclaw/issues/53408)
5. **#67413 — Per-agent dreaming configuration** (16 comments, 5 👍) — closed (stale). Memory spikes from all agents dreaming at once; request for per-agent control. [Link](https://github.com/openclaw/openclaw/issues/67413)

**Underlying needs:** The hottest threads are dominated by **recovery/crash semantics** (gateway stop, session reclamation, SQLite) and **long-conversation reliability** (tool-call argument loss, memory spikes). The per-agent dreaming request shows demand for **multi-agent resource isolation** — users want to tune memory behavior per agent rather than globally.

## 5. Bugs & Stability

Ranked by severity:

**P0 / Release-blocker**
- **#193962** — P0, ux-release-blocker: "Fix for the SQLite header-probe timeout (#187197) can't be reached from 2026.10.10; package-update runs the installed updater's 10 s probe." [Link](https://github.com/openclaw/openclaw/issues/193962) — **no fix PR referenced yet.**
- **#162211** — P0, crash-loop: "Startup blocks the Gateway event loop for 40–200s; health monitor misreads the stall as a disconnect and escalates into a restart loop." [Link](https://github.com/openclaw/openclaw/issues/162211) — open, no new fix PR.
- **#158592** — P0, message-loss/ux-release-blocker: "After host sleep/wake, prepared model runtime publication for one agent times out and never recovers — every inbound message fails with 'runtime owner was not published' until gateway restart." [Link](https://github.com/openclaw/openclaw/issues/158592) — open, needs live repro.
- **#137177** — P0, ux-release-blocker: built-in `@wecom/wecom-openclaw-plugin@2026.7.2` can no longer be installed. [Link](https://github.com/openclaw/openclaw/issues/137177) — open.

**P1 (crash / message loss / auth)**
- **#126950** — P1, message-loss: Telegram opaque callback payloads (`tgcb1:`) silently dropped for non-plugin callers. [Link](https://github.com/openclaw/openclaw/issues/126950) — linked PR open.
- **#117262** — P1, crash-loop: SQLite contention — 3 concurrent write handles on `state/openclaw.sqlite` cause ~33s event-loop stalls. [Link](https://github.com/openclaw/openclaw/issues/117262)
- **#181432** — P1, message-loss/crash-loop: excessive baseline RSS memory (~1.9 GB) and SQLite transaction timeouts in 2026.10.5. [Link](https://github.com/openclaw/openclaw/issues/181432)
- **#185578** — P1, crash-loop: Gateway heap floor only ratchets up — per-run system prompt/skills strings stay reachable after runs (~25 MiB/h until V8 cap aborts). [Link](https://github.com/openclaw/openclaw/issues/185578)
- **#191847** — P1, message-loss/crash-loop: 2026.10.10 — large session repeatedly kills the 512 MB SQLite worker (`ERR_WORKER_OUT_OF_MEMORY`); every turn fails with "admission is closed." [Link](https://github.com/openclaw/openclaw/issues/191847)
- **#182369** — P1, message-loss/crash-loop: Gateway RSS grows ~0.1 GiB/h off-heap until restart; `rss_threshold` monitor never fires. [Link](https://github.com/openclaw/openclaw/issues/182369)
- **#193262** — P1, crash-loop: Docker startup fails when state dir is bind-mounted from a Windows drive (`ENOENT fstat` after atomic write). [Link](https://github.com/openclaw/openclaw/issues/193262)
- **#157255** — P1, message-loss: Turn claim not released after lane timeout on 2026.9.5 — session permanently wedged 90+ minutes. [Link](https://github.com/openclaw/openclaw/issues/157255)
- **#155396** — P1, message-loss: Ordinary Codex tool turns can fail closed on `provenance_rejected` during final-answer recovery. [Link](https://github.com/openclaw/openclaw/issues/155396)
- **#126906** — P1, data-loss: Denying the write tool silently disables memory persistence, and the agent reports success anyway. [Link](https://github.com/openclaw/openclaw/issues/126906)

**P2 (UX/behavior)**
- **#164394** — WebChat transcript jitter when scrolling mid-history. [Link](https://github.com/openclaw/openclaw/issues/164394)
- **#182891** — Prompt cache never reused — `cache read dropped N -> 0` on every request. [Link](https://github.com/openclaw/openclaw/issues/182891)
- **#166526** — Idempotent `doctor --fix` takes ~473 s on large state (60 s budget). [Link](https://github.com/openclaw/openclaw/issues/166526)
- **#194662** — Notification-driven wake invents a sender and keeps the invented thread alive. [Link](https://github.com/openclaw/openclaw/issues/194662)
- **#177909** — Transcript idempotency conflict treated as a model failure and walks the fallback chain. [Link](https://github.com/openclaw/openclaw/issues/177909)

**Fix PRs present:** #192838 (claude-cli retry starts new session after first-turn output refusal), #195481 (browser release console/predicate handles), #194682 (browser crashed-tab reporting), #177147 (page-cache warming on kernels without `/proc/self/io`), #195376 (retain native child results after interrupted admission), #195479 (gateway retains completed reply runtimes), #195472 (active-memory recall circuit breaker expiry), #195486 (bounded Node 24 stall stacks), #195249 (release closeout).

**Assessment:** The stability picture is dominated by **memory growth and SQLite contention** — several independent P1 reports (heap ratchet, RSS growth, SQLite worker OOM, 3 write handles) point to a systemic memory/database resource-management issue rather than isolated bugs. Gateway crash-recovery and event-loop stalls are also recurring.

## 6. Feature Requests & Roadmap Signals

- **#76493** — Allow SecretRef objects in `mcp.servers[].env` schema (currently string/number/boolean only); 6 👍 — security-relevant. [Link](https://github.com/openclaw/openclaw/issues/76493)
- **#14785** — Reduce tool schema token overhead (~3,500 tok/session). [Link](https://github.com/openclaw/openclaw/issues/14785)
- **#162164** — Opt-in personal identity in iOS/macOS while preserving Shared owner. [Link](https://github.com/openclaw/openclaw/issues/162164)
- **#128090** — Add rendered Markdown preview to Review files (4 👍). [Link](https://github.com/openclaw/openclaw/issues/128090)
- **#16670** — Onboarding Wizard should include Memory/Embedding setup as a mandatory step. [Link](https://github.com/openclaw/openclaw/issues/16670)
- **#107433** — `openclaw backup`: manifest-backed intentional omissions for protected/reconstructable runtime paths. [Link](https://github.com/openclaw/openclaw/issues/107433)
- **#137613** — Pre-compaction memory flush disabled on CLI backends; compactionCount trap. [Link](https://github.com/openclaw/openclaw/issues/137613)
- **#177505** — `skill_workshop` background experience-review retries with no visible cap. [Link](https://github.com/openclaw/openclaw/issues/177505)

**Prediction:** The v2026.11.2 privacy/trust release signals the next version likely focuses on **security-boundary enforcement** (SecretRef/MCP schema, auth-provider fixes). Memory-flush on CLI backends (#137613) and tool-schema overhead (#14785) are recurring, likely candidates for a "context efficiency" release. The **OpenClaw ID / personal identity** work (#162164, #194201, #194194) is a clear roadmap signal — the team is building durable node enrollment and opt-in identity across Apple/Android, likely next major version.

## 7. User Feedback Summary

**Pain points:**
- **Multi-agent memory pressure:** users running many agents/workspaces hit OOM kills and memory spikes; per-agent dreaming (#67413) and per-agent memory budgets are requested.
- **Crash recovery:** gateway crashes and stop commands leave sessions permanently unavailable; macOS `gateway stop` fails on ancestry inspection (#191944).
- **Long-session degradation:** tool calls lose arguments after long conversations; large sessions kill the SQLite worker; turn claims wedge for 90+ minutes.
- **Memory/disk growth:** 1.9 GB baseline RSS, 25 MiB/h heap leak, off-heap RSS growth — operators running long-lived gateways are forced to restart periodically.
- **Security:** users want secret indirection in MCP server env (SecretRef) — currently rejected by schema; workaround is unsafe.

**Satisfaction:** Positive signals around release discipline and privacy hardening; the release includes deliberate privacy/trust-boundary improvements. Dissatisfaction is concentrated on **memory stability and crash recovery**, which is the dominant source of user pain.

## 8. Backlog Watch

**Long-unanswered issues needing maintainer attention:**
- **#14785** (created 2026-02-12) — tool schema token overhead — 12 comments, still open; high token-cost impact on every session.
- **#16670** (created 2026-02-15) — onboarding wizard memory setup — 10 comments, open.
- **#39476** (created 2026-03-08) — A2A `sessions_send` duplicate messages — 13 comments, open.
- **#76493** (created 2026-05-03) — SecretRef in MCP env — 14 comments, 6 👍, open.
- **#107433** (created 2026-07-14) — backup manifest-backed omissions — 8 comments, open.
- **#117262** (created 2026-08-01) — SQLite contention — 13 comments, open.
- **#126950** (created 2026-08-21) — Telegram callback payloads — 15 comments, linked PR open.
- **#126906** (created 2026-08-21) — memory persistence silently disabled — 8 comments, open.
- **#137613** (created 2026-09-03) — memory flush on CLI backends — 13 comments, open.
- **#162211** (created 2026-09-30) — startup event-loop stall — 14 comments, open.
- **#157255** (created 2026-09-24) — turn claim wedge — 10 comments, open.
- **#158592** (created 2026-09-26) — wake-recovery runtime publication — 11 comments, open.
- **#161158** (created 2026-09-29) — `gateway restart` false failure — 8 comments, open.
- **#164394** (created 2026-10-03) — WebChat jitter — 15 comments, open.

**PRs needing maintainer attention:**
- **#192350** (created 2026-11-03) — GitHub repo integration → plugin migration (XL, security-review required) — open.
- **#194201** (created 2026-11-06) — Apple OpenClaw ID node foundation (XL, draft, security-boundary) — open, not ready to merge.
- **#194194** (created 2026-11-06) — Android OpenClaw ID enrollment (XL, security-boundary) — open, needs proof.
- **#194566** (created 2026-11-07) — prompt presence checks (L, docs, security) — open.
- **#195485** (created 2026-11-09) — maintainer hold on redundant fixture scans — open, explicitly unmerged.
- **#141004** (created 2026-09-07) — audit runtime skill usage (XL) — open, 0 comments — stale and possibly needs attention.

**Health summary:** The project is **active and shipping** but is carrying a heavy **stability debt** (memory leaks, SQLite contention, crash-loop restarts). The top priority for maintainers should be the memory/SQLite cluster (#181432, #185578, #182369, #117262, #191847) and crash recovery (#166634, #162211, #191944) — these are the largest sources of user dissatisfaction and the most likely blockers for the next release.

---

## Cross-Ecosystem Comparison

# Cross-Project Comparison Report: AI Agent & Personal Assistant Open-Source Ecosystem
**Date:** 2026-11-09
**Projects analyzed:** OpenClaw, Hermes Agent, IronClaw, QwenPaw, ZeroClaw

---

## 1. Ecosystem Overview

The personal AI assistant / agent open-source landscape in late 2026 is **bifurcating into two clear tiers**: a small number of high-throughput reference implementations (OpenClaw, ZeroClaw) shipping release trains under heavy stability pressure, and a longer tail of projects (IronClaw, QwenPaw, Hermes Agent) that are functionally mature but bottlenecked on review/merge capacity rather than contribution volume. Across all five projects, **controllerplans is converging on the same problem set** — multi-agent memory isolation, sandbox and permission scoping, crash recovery of long-lived gateways, and silent-failure observability — which suggests these are now industry-level fault lines rather than project-specific defects. Security-boundary work (OIDC/JWKS, SecretRef, per-user isolation, shell-grammar policy) is the dominant roadmap theme, with **v0.9.0-class releases acting as coordination hubs** where gateway identity and shell/runtime hardening converge. Meanwhile, contributor energy is flowing faster than maintainer merge bandwidth, producing dependency-tower PR stacks and aging P1 bugs across nearly every project.

---

## 2. Activity Comparison

| Project | Issues (24h updated / open) | PRs (24h updated / open) | Merged/Closed (24h) | Release Status | Health Score |
|---|---|---|---|---|---|
| **OpenClaw** | 498 updated / 374 open | 500 updated / 343 open | 157 PRs / 124 issues | ✅ **v2026.11.2** shipped (privacy/trust); closeout PR open | 🟢 **High activity, high stability debt** |
| **Hermes Agent** | 50 / 45 open | 50 / 44 open | 6 PRs / 5 issues | ❌ None (v0.23.0 current) | 🟡 **Active but backlog-constrained** |
| **IronClaw** | 0 / 0 | 6 / 5 open (all Dependabot) | 1 PR (superseded) | ❌ None | ⚪ **Quiet / maintenance-only** |
| **QwenPaw** | 7 / 7 open | 15 / 15 open | 0 / 0 | ❌ None (2.2.2.post1 stable; 2.3.0-beta.2) | 🟡 **High input, zero merge velocity** |
| **ZeroClaw** | 13 / 12 open | 50 / 43 open | 7 PRs / 1 issue | ⏳ Pre-v0.9.0 (blocked) | 🟠 **Security-heavy, backlog-strained** |

**Notes:**
- OpenClaw operates at **~10× the throughput** of any peer, but its open backlog (374 issues, 343 PRs) and P0/P1 cluster (memory, SQLite, crash loop) are also ~10× larger.
- Hermes, QwenPaw, and ZeroClaw all show the same pathology: **merge velocity well below contribution velocity** (44 open vs. 6 merged; 15 open vs. 0 merged; 43 open vs. 7 merged).
- IronClaw is the only project with **no human issue activity** — a data gap, not a satisfaction signal.

---

## 3. OpenClaw's Position

**Advantages vs. peers:**
- **Only project shipping releases on a disciplined cadence.** v2026.11.2 (privacy/trust boundaries) demonstrates release engineering that no peer matched in the 24h window — Hermes, QwenPaw, and IronClaw cut nothing; ZeroClaw's v0.9.0 is gated behind a 5-month-old tracker (#7432).
- **Largest community surface by an order of magnitude** (~500 issues + ~500 PRs touched vs. ≤65 combined for any peer), giving it the broadest contributor funnel and the fastest bug-report signal.
- **Most advanced trust-boundary implementation** — the v2026.11.2 release excludes secrets, conversation content, tool errors, and channel payloads from diagnostic logs, and enforces provider/navigation trust boundaries. This is ahead of ZeroClaw's in-review OIDC/JWKS work and Hermes's no-linked-fix state.

**Technical approach differences:**
- OpenClaw runs a **monolithic gateway with an embedded SQLite state store** and worker-based admission — the source of its dominant P1 cluster (SQLite worker OOM, 3 write handles, heap ratchet). ZeroClaw instead pursues **gateway/dashboard auth + policy publication**; Hermes is mid-refactor toward **pluggable storage ports**; QwenPaw uses a `MemorySpace.search` abstraction with per-call deadlines.
- OpenClaw's failure modes are **resource-exhaustion** (RSS, heap, SQLite contention); peers' failure modes skew toward **adapter contract violations** (Slack SDK drift, ACP streaming, Windows subprocess semantics in Hermes) or **config-state non-enforcement** (disabled agents still running in ZeroClaw, channel `enabled` reset in QwenPaw).

**Community size comparison:**
> OpenClaw ≈ 500 items/24h ≫ ZeroClaw (63) ≈ Hermes (100) > QwenPaw (22) > IronClaw (6 Dependabot).

OpenClaw's community is **materially larger and more bug-report-heavy**, which explains both its velocity and its stability debt — the project is absorbing demand its peers are not yet receiving.

---

## 4. Shared Technical Focus Areas

Requirements emerging across **two or more** projects:

| Theme | Projects | Specific Need |
|---|---|---|
| **Multi-agent / multi-user isolation** | OpenClaw (#67413 per-agent dreaming), Hermes (#17254, #28226, #146503), ZeroClaw (#9872, #12290) | Per-agent memory budgets, per-`user_id` preference scoping, tenant fencing, correct delegated-workspace resolution |
| **Silent-failure observability** | QwenPaw (#8475, #8103, #8629), Hermes (#110374, #151269, #151274), ZeroClaw (#12288) | Warnings when channels disable, models silently swap, prompts drop, or dependencies fail to install |
| **Crash / state recovery** | OpenClaw (#166634, #158592, #191944), Hermes (#144728, #145154), ZeroClaw (#9597 durable turns) | Gateway crash leaves sessions refused; stale-owner hints spawn wrong runtime; durable, attributable turns |
| **Permission / authorization enforcement** | ZeroClaw (#12289 disabled agents run; #12290 non-admin ownership), OpenClaw (SecretRef #76493; MCP grants), Hermes (#138337 OAuth pool revocation) | Config state must gate execution; secrets need schema-level indirection |
| **Platform parity (Windows/macOS)** | Hermes (#135977, #147613, #151274), QwenPaw (#8627, #8568), ZeroClaw (#7461, #11394, #11406, #12296) | Deterministic Windows failures; macOS broad-filesystem-root refusal; three-OS CI matrix |
| **Context / token efficiency** | OpenClaw (#14785 tool-schema overhead; #137613 memory flush), QwenPaw (#8629 oversized image resend) | Reduce per-session token cost; stop re-sending large historical payloads |

**Common denominator:** nearly every project is discovering that **resource management (memory, tokens, permissions) and failure transparency** are the two axes users punish hardest. No project has fully closed either.

---

## 5. Differentiation Analysis

| Dimension | OpenClaw | Hermes Agent | IronClaw | QwenPaw | ZeroClaw |
|---|---|---|---|---|---|
| **Primary focus** | General-purpose agent gateway; privacy/trust | Session state + plugin ecosystem | Dependency hygiene (dormant) | Memory search + provider fallback | Security: gateway identity, sandbox, shell policy |
| **Target users** | Broad operators, multi-agent power users | Plugin devs, multi-channel (Slack/Telegram/Feishu) | Unclear (no active users visible) | Pipeline/cron power users, Windows desktop | Multi-tenant/self-service dashboard users |
| **Architecture signal** | Monolithic gateway + SQLite worker pool | Storage-port refactor (swappable session/turn stores) | WASM sandbox layer (via #7834) | `MemorySpace.search` abstraction | Gateway + operator WebSocket + RPC |
| **Release state** | Shipping (v2026.11.2) | No release in window | No release | No release | Pre-v0.9.0, blocked |
| **Distinct strength** | Community scale + release discipline | Plugin catalog breadth (wearOS, vibeCAD, kin) | Lightweight (no active incident load) | Contributor precision + same-day fix loop | Coherent security roadmap |
| **Distinct risk** | Stability debt at scale | 44:6 open-to-merge ratio; aging P1s | Abandonment risk; 11-week-old wasm PR | Zero merges in 24h vs. 15 open PRs | 5-month v0.9.0 tracker; XL dependency tower |

**Key architectural divergence:** OpenClaw and ZeroClaw both run **centralized gateways** but optimize for different axes (throughput/trust vs. identity/policy). Hermes is actively **decomposing storage** — its `benbarclay` storage-port stack (#149200 → #151555) is the most consequential architectural bet in the set, and it directly gates the multi-tenancy theme. QwenPaw sits closest to a **search-first** design, treating memory correctness as the primary contract.

---

## 6. Community Momentum & Maturity

**Activity tiers (by 24h human-facing activity):**

1. **Tier 1 — Hyperactive (OpenClaw):** ~1,000 items/24h. Rapid iteration, shipping releases, but **stabilizing under load** — its P0/P1s (memory, SQLite, crash loop) are chronic, not transient.
2. **Tier 2 — Active but review-bound (Hermes, ZeroClaw):** ~50–63 items/24h with **6–7 merges**. Both are **rapidly iterating upstream, slowly landing downstream.** ZeroClaw is the most security-coherent; Hermes is the most plugin-diverse.
3. **Tier 3 — High-input/low-output (QwenPaw):** 22 items touched, **zero merges**. A focused maintenance sprint (`txohyeah`'s MemorySpace cluster) landed fully-formed PRs on day one — contributor quality is high, maintainer bandwidth is the constraint.
4. **Tier 4 — Dormant (IronClaw):** Dependabot-only. **Maturing into neglect** — no issue activity equals no external adoption signal.

**Maturity read:**
- **Most mature operationally:** OpenClaw (release pipeline, security hardening, issue triage at scale).
- **Most mature architecturally:** Hermes (deliberate storage abstraction) and ZeroClaw (coherent v0.9.0 identity/policy arc).
- **Least mature:** IronClaw — maintenance-only with accumulating dependency debt (oldest PR ~11 weeks).
- **Fastest iterating:** OpenClaw and ZeroClaw; **fastest stabilizing:** QwenPaw (same-day issue→PR loops).

---

## 7. Trend Signals

Extracted from aggregated community feedback — actionable for AI agent developers:

1. **Isolation is the new correctness bar.** Per-agent, per-user, and per-tenant scoping are being requested independently in **three of five projects** (OpenClaw, Hermes, ZeroClaw). Delegated agents writing to the wrong workspace (ZeroClaw #9872) is treated as a *security* failure, not a bug. → *Design multi-agent memory and filesystem scoping before scaling agents.*

2. **Silent failures are the top UX debt.** Across QwenPaw, Hermes, and ZeroClaw, users consistently complain about **behavior changing without a signal** — a channel disabling, a model swapping, a prompt dropping. → *Surface every fallback, retry, and state change as a visible warning; silent resilience is experienced as unreliability.*

3. **Long-lived gateways leak.** OpenClaw's heap ratchet (25 MiB/h), off-heap RSS growth (0.1 GiB/h), and 1.9 GB baseline RSS are the clearest evidence that **stateful agent gateways need resource accounting as a first-class subsystem**, not a monitor bolted on after (`rss_threshold` never fires in #182369). → *Instrument RSS/heap off-heap separately; treat memory as a schedulable resource.*

4. **Permission state must gate execution, not decorate it.** ZeroClaw's disabled-agent execution (#12289) and OpenClaw's missing SecretRef schema (#76493) both show **config written but not enforced**. → *Test that every auth/config field actually denies the operation it claims to.*

5. **Platform parity is an adoption tax.** Deterministic Windows failures (Hermes ACP hang; QwenPaw long-path checkpoint) and macOS shell-grammar precision (ZeroClaw #12296) are **not flaky** — they are untested paths. → *Run a three-OS CI matrix or explicitly document unsupported platforms.*

6. **Review bandwidth is the ecosystem's scarcest resource.** IronClaw's 11-week wasm PR, QwenPaw's 85-day OAuth2 fix (#7066), ZeroClaw's XL dependency tower, and Hermes's 44:6 open-to-merge ratio all point to the same constraint. → *Projects that can't merge contributions lose contributors; stacked-PR hygiene and reviewer allocation are strategic, not administrative.*

7. **Context/token efficiency is a power-user frontier.** Tool-schema overhead (OpenClaw #14785), oversized image resend (QwenPaw #8629), and skipped turn expansion (QwenPaw #8621) show users running **scheduled pipelines and large memory stores** actively optimizing per-call cost. → *Expose granular controls (per-job thinking level, row-only recall) rather than one-size-fits-all context assembly.*

**Bottom line for decision-makers:** The ecosystem's center of gravity has shifted from *"can the agent do the task?"* to *"can the operator trust, observe, and afford it at scale?"* OpenClaw is furthest along this curve and also paying the highest tax for it; the fastest way for a newer project to differentiate is **isolation + observability + cross-platform correctness** — the three gaps every peer is currently exposing.

---

## Peer Project Reports

<details>
<summary><strong>Hermes Agent</strong> — <a href="https://github.com/nousresearch/hermes-agent">nousresearch/hermes-agent</a></summary>

# Hermes Agent — Project Digest
**Date:** 2026-11-09
**Repository:** [github.com/NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent)

---

## 1. Today's Overview

Hermes Agent remains in a high-activity maintenance phase with **50 issues** and **50 PRs** updated in the last 24 hours, but no new releases. The open/active ratio is heavily skewed toward unresolved work (45 open issues vs. 5 closed; 44 open PRs vs. 6 merged/closed), suggesting the maintainer team is triaging faster than it is merging. Activity is concentrated in bug-fix and infrastructure work — particularly around session state, gateway delivery reliability, and the emerging "storage ports" refactor stack from contributor `benbarclay`. Community sentiment is mixed: long-standing P1/P2 bugs (Slack status, ACP streaming, Windows ACP hangs) continue to draw comments and reactions, while a steady stream of plugin-catalog PRs indicates a healthy third-party ecosystem. Overall project health looks **stable but backlog-constrained**, with several high-severity items aging past 30 days.

---

## 2. Releases

**None.** No new releases were published in the last 24 hours, and the "Latest Releases" section is empty. Users on `v0.23.0`, `v0.22.5+3138.gd33d4fd`, and older `v0.21.x` builds continue to report issues against their respective versions (see Bugs & Stability).

---

## 3. Project Progress

Six PRs were merged/closed in the last 24h; notable closures in issues include:

- **[#65225](https://github.com/NousResearch/hermes-agent/issues/65225) [CLOSED]** — `KeyError: 'HERMES_KANBAN_BOARD'` race between the kanban dispatcher mutating `os.environ` and dotenv's `env.update(os.environ)`. Long-standing P3.
- **[#138791](https://github.com/NousResearch/hermes-agent/issues/138791) [CLOSED]** — Desktop boot failure (`Gateway starting (deadline)`) when the sticky `active_profile` is a parked profile, a regression after the 2026-10-15 update.
- **[#124406](https://github.com/NousResearch/hermes-agent/issues/124406) [CLOSED]** — Telegram auto-TTS dropping the voice bubble on emoji-heavy replies exceeding 1024 UTF-16 units.
- **[#88579](https://github.com/NousResearch/hermes-agent/issues/88579) [CLOSED]** — Slack `clarify` choice buttons truncating unreadably on mobile.
- **[#89385](https://github.com/NousResearch/hermes-agent/issues/89385) [CLOSED]** — Session-start hook for memory providers (Memory Lane as consumer).

**Advancing feature work (open PRs, not yet merged):**
- A **storage-port refactor stack** by `benbarclay`: [#149200](https://github.com/NousResearch/hermes-agent/pull/149200) → [#151553](https://github.com/NousResearch/hermes-agent/pull/151553) → [#151554](https://github.com/NousResearch/hermes-agent/pull/151554) → [#151555](https://github.com/NousResearch/hermes-agent/pull/151555), introducing session-store/turn-admission ports, fenced turn writes, and a conformance suite.
- **Desktop UX**: [#151569](https://github.com/NousResearch/hermes-agent/pull/151569) (toggle automatic chat titles), [#151563](https://github.com/NousResearch/hermes-agent/pull/151563) (bundled Turkish localization), [#151559](https://github.com/NousResearch/hermes-agent/pull/151559) (persist/restore all windows), [#151564](https://github.com/NousResearch/hermes-agent/pull/151564) (document copy confirmation).
- **Gateway/delivery reliability**: [#151568](https://github.com/NousResearch/hermes-agent/pull/151568) (soft-release displaced agents), [#151567](https://github.com/NousResearch/hermes-agent/pull/151567) (replay `send_path_degraded` replies on in-place adapter recovery).
- **Compression**: [#133625](https://github.com/NousResearch/hermes-agent/pull/133625) — opt-in "warm handoff" (`compression.warm_handoff: off|on|auto`).

---

## 4. Community Hot Topics

| Rank | Item | Comments | 👍 | Link |
|---|---|---|---|---|
| 1 | Slack status indicator broken with `slack-sdk >= 3.44` (P2) | 14 | **16** | [#110374](https://github.com/NousResearch/hermes-agent/issues/110374) |
| 2 | ACP re-emits full transformed final response under streamed message id | 9 | 0 | [#141919](https://github.com/NousResearch/hermes-agent/issues/141919) |
| 3 | `hermes acp` session/new hangs on Windows (grandchild holds stdout pipe) | 7 | 0 | [#135977](https://github.com/NousResearch/hermes-agent/issues/135977) |
| 4 | Kanban timed-out workers leave descendant process groups alive | 7 | 1 | [#80280](https://github.com/NousResearch/hermes-agent/issues/80280) |
| 5 | Multi-User Preference Memory (per-`user_id` isolation) | 7 | 0 | [#17254](https://github.com/NousResearch/hermes-agent/issues/17254) |
| 6 | Quiet cron script leaves permanent empty session per firing | 7 | 0 | [#145314](https://github.com/NousResearch/hermes-agent/issues/145314) |

**Underlying needs analysis:**
- **Cross-platform integrity** dominates: Slack SDK drift, Windows subprocess semantics, and ACP streaming semantics all point to fragile adapter contracts that are not covered by CI on every platform.
- **Multi-tenant / multi-user isolation** is a recurring theme (#17254, #28226, #146503). Users deploying Hermes in shared channels (Feishu, Discord, Telegram) want per-user memory scoping, and hosted operators want tenant fencing. This is a **product-level gap**, not just a bug.
- The **16 👍 on #110374** is the single strongest community signal today — Slack status feedback is a highly visible, user-facing regression.

---

## 5. Bugs & Stability

**P1 — Critical:**
- **[#138337](https://github.com/NousResearch/hermes-agent/issues/138337)** — `delegate_task` children sharing an Anthropic OAuth pool revoke each other's tokens on 401, then die at a never-resetting refresh cap. Security-boundary sweeper flag. *No fix PR observed.*
- **[#138337](https://github.com/NousResearch/hermes-agent/issues/138337)** (auth path) also tagged `sweeper:risk-security-boundary`.

**P2 — High:**
- **[#110374](https://github.com/NousResearch/hermes-agent/issues/110374)** — Slack `agents.sessions.setStatus` rejects free-text/empty; status silently disappears with `slack-sdk >= 3.44`. Highest engagement today.
- **[#141919](https://github.com/NousResearch/hermes-agent/issues/141919)** — ACP duplicates the assistant reply when a `transform_llm_output` plugin hook is registered.
- **[#135977](https://github.com/NousResearch/hermes-agent/issues/135977)** — Windows: `subprocess.run(timeout=5)` in `session/new` never returns when a grandchild holds the stdout pipe (PyInstaller-frozen, Python 3.14.7).
- **[#145314](https://github.com/NousResearch/hermes-agent/issues/145314)** — Quiet cron jobs with `no_agent: false` leave permanent empty sessions every firing.
- **[#147613](https://github.com/NousResearch/hermes-agent/issues/147613)** — Windows Kanban workers stall deterministically at admission-sequence 15; prompts never delivered.
- **[#147619](https://github.com/NousResearch/hermes-agent/issues/147619)** — "(from-pain-miner)" Auxiliary lanes (compression, goal judge, vision, fallback) call the wrong model on custom/local/fallback routes; error points at the wrong config.
- **[#151280](https://github.com/NousResearch/hermes-agent/issues/151280)** — Stale-stream watchdog ignores SSE comments/pings and kills a live `chat_completions` stream at 240 s (Claude Opus behind an OpenAI-compatible proxy). **Reported today.**
- **[#144728](https://github.com/NousResearch/hermes-agent/issues/144728)** — `session.resume` of a live, not-yet-persisted session omits `running`/`status`; Conduit locks composer after reconnect.
- **[#149865](https://github.com/NousResearch/hermes-agent/issues/149865)** — Desktop `execute_code` approval timeout with no clear recovery after renewed consent.
- **[#149026](https://github.com/NousResearch/hermes-agent/issues/149026)** — Cookie-authenticated writes 403 behind TLS-terminating home routers that strip `Origin`.
- **[#145154](https://github.com/NousResearch/hermes-agent/issues/145154)** — Stale session owner hints spawn a full local runtime on a remote-primary desktop.
- **[#143001](https://github.com/NousResearch/hermes-agent/issues/143001)** — Telegram document albums rejected with `media_text_inlined_length`.
- **[#151269](https://github.com/NousResearch/hermes-agent/issues/151269)** — Desktop silently drops submitted prompts on immediate chat switch. **Tested fix attached.** *Reported today.*
- **[#151053](https://github.com/NousResearch/hermes-agent/issues/151053)** — Completion notification can become empty for long single-line output ending in a newline (v0.23.0). *Reported today.*

**P3 — Medium:**
- **[#80280](https://github.com/NousResearch/hermes-agent/issues/80280)** — Stale Kanban process groups mutate the same worktree concurrently.
- **[#151274](https://github.com/NousResearch/hermes-agent/issues/151274)** — Windows/MSIX: `hermes pm repair` fails on bundled config-resolution fixtures; plugin `python_dependencies` silently never installed. *Reported today.*
- **[#121402](https://github.com/NousResearch/hermes-agent/issues/121402)** — Vault-backed signup cannot fill confirm-password fields.
- **[#148414](https://github.com/NousResearch/hermes-agent/issues/148414)** — Webapp menus overflow viewport at non-100% UI scale.
- **[#131208](https://github.com/NousResearch/hermes-agent/issues/131208)** — Unknown model IDs default to text path for images (no live vision probe).

> ⚠️ **No fix PRs are currently linked to the P1 (#138337) or the top P2 Slack issue (#110374).** These require maintainer attention.

---

## 6. Feature Requests & Roadmap Signals

**Strongest roadmap candidates:**

1. **[#17254](https://github.com/NousResearch/hermes-agent/issues/17254) — Multi-User Preference Memory (per-`user_id` isolation).** Directly reinforces the multi-tenant theme seen in [#28226](https://github.com/NousResearch/hermes-agent/issues/28226) and [#146503](https://github.com/NousResearch/hermes-agent/issues/146503). Given the storage-port refactor stack landing now, per-user fencing is architecturally plausible in the next minor release.
2. **[#114195](https://github.com/NousResearch/hermes-agent/issues/114195) — UI localization / `display.language` setting.** Already being partially addressed by PR [#151563](https://github.com/NousResearch/hermes-agent/pull/151563) (Turkish) and [#151570](https://github.com/NousResearch/hermes-agent/pull/151570) (localized title punctuation). Expect a formal i18n config key soon.
3. **[#138280](https://github.com/NousResearch/hermes-agent/issues/138280) — Plugin goal seam (`ctx.goals`).** A plugin API gap; plan-mode consumers are actively building against it.
4. **[#131208](https://github.com/NousResearch/hermes-agent/issues/131208) — Live vision-support probe for unknown model IDs.** Small, well-scoped, and complements the "auxiliary lanes wrong model" pain cluster (#147619).
5. **[#146503](https://github.com/NousResearch/hermes-agent/issues/146503) — "Bens Magical Ticket of Multi-tenancy."** Hosted single-process multi-tenancy. This is likely a **medium-term architectural theme**, aligning with the storage-port PRs.

**Plugin ecosystem:** Multiple plugin-catalog PRs today ([#150964](https://github.com/NousResearch/hermes-agent/pull/150964) vibeCAD, [#150982](https://github.com/NousResearch/hermes-agent/pull/150982) kin, [#150928](https://github.com/NousResearch/hermes-agent/pull/150928) signal-dog, [#151546](https://github.com/NousResearch/hermes-agent/pull/151546) wearOS, [#149221](https://github.com/NousResearch/hermes-agent/pull/149221) BIM Studio, [#149426](https://github.com/NousResearch/hermes-agent/pull/149426) pinpoint) signal a maturing hackathon/community pipeline. Expect catalog growth to continue.

---

## 7. User Feedback Summary

**Pain points observed:**
- **Silent failures are the #1 frustration.** Status indicators disappear (Slack #110374), prompts are dropped (Desktop #151269), plugin dependencies never install (MSIX #151274), and cookies 403 without a clear error (#149026). Users repeatedly note the absence of visible error surfacing.
- **Windows is a second-class platform.** Three distinct Windows-specific issues surfaced this week (#135977, #147613, #151274), all with deterministic, reproducible failures — not flaky.
- **Multi-user deployments break memory isolation.** Channel-based deployments (Feishu/Discord/Telegram) cannot separate user preferences, causing cross-contamination.
- **Auxiliary model routing is opaque.** #147619 captures a "pain cluster" where compression/goal-judge/vision lanes silently pick the wrong model — users blame their own config, not the router.

**Positive signals:**
- Users are contributing **tested fixes** (#151269, #151566, #151567, #151568, #151563) — a sign of an engaged contributor base.
- Plugin authors are shipping polished, full-featured integrations (e.g., wearOS "whole gateway on the wrist," kin avatar). Ecosystem confidence is high.
- 16 👍 on a single bug (#110374) plus several +1s on older issues shows an attentive, voting user base — but also that top issues are not being closed fast enough.

**Dissatisfaction drivers:** Aging P1/P2 bugs (some from August/September) still open in November; no release in the last 24h; high open-PR queue (44) relative to merges (6).

---

## 8. Backlog Watch

Long-unanswered or high-risk items needing maintainer attention:

| Issue | Age | Why it matters |
|---|---|---|
| [#80280](https://github.com/NousResearch/hermes-agent/issues/80280) (P3, Kanban process groups) | ~3 months | Concurrent worktree mutation by stale workers is a correctness hazard. |
| [#135977](https://github.com/NousResearch/hermes-agent/issues/135977) (Windows ACP hang, `needs-repro`) | ~1 month | Blocks ACP on Windows entirely; lacks repro confirmation. |
| [#138337](https://github.com/NousResearch/hermes-agent/issues/138337) (P1, Anthropic OAuth pool) | ~1 month | Security-boundary tag; token revocation cross-kills delegated children. |
| [#110374](https://github.com/NousResearch/hermes-agent/issues/110374) (Slack status) | ~2 months | Highest community engagement; no linked fix PR. |
| [#141919](https://github.com/NousResearch/hermes-agent/issues/141919) (ACP duplicate reply) | ~3 weeks | Streaming contract violation; 9 comments with no resolution. |
| [#17254](https://github.com/NousResearch/hermes-agent/issues/17254) / [#28226](https://github.com/NousResearch/hermes-agent/issues/28226) (Multi-user memory) | ~6 months | `needs-decision`; recurring theme with no roadmap commitment. |
| [#65225](https://github.com/NousResearch/hermes-agent/issues/65225) | ~4 months | ✅ **Just closed** — good news for env-race watchers. |
| PR [#133625](https://github.com/NousResearch/hermes-agent/pull/133625) (compression warm handoff) | ~5 weeks | Large feature PR; needs review bandwidth. |
| PR [#149200](https://github.com/NousResearch/hermes-agent/pull/149200) + stack | ~4 days | Storage-port refactor; unblocks multi-tenancy, but stacked PRs are easy to stall. |

**Recommendation for maintainers:** Prioritize a linked fix for #110374 and a repro request sweep on Windows issues; consider dedicating a reviewer to the `benbarclay` storage-port stack, since it gates the multi-tenancy roadmap and several open feature requests.

---

*Digest compiled from GitHub activity data for 2026-11-09. Metrics reflect items updated in the trailing 24-hour window.*

</details>

<details>
<summary><strong>IronClaw</strong> — <a href="https://github.com/nearai/ironclaw">nearai/ironclaw</a></summary>

# IronClaw Project Digest — 2026-11-09

## 1. Today's Overview

IronClaw is showing a **maintenance-only activity pattern** today, with no new releases, zero issue activity, and all six updated PRs originating from Dependabot automated dependency bumps. The project's human-facing development and community discussion channels appear quiet, while the dependency pipeline continues to process routine maintenance work. One dependency PR (#8160) was closed—likely superseded by the newer #8169—while five others remain open, some lingering for weeks. Overall activity is **low but not stalled**: the automated maintenance loop is functioning, though the absence of any issues or feature work is worth monitoring.

## 2. Releases

No new releases were published today. There are no version notes, breaking changes, or migration guidance to report.

## 3. Project Progress

**Merged/Closed PRs:** 1
- **[#8160](https://github.com/nearai/ironclaw/pull/8160)** [CLOSED] — `chore(deps): bump the everything-else group across 1 directory with 43 updates` was closed after ~2 weeks open. This PR was almost certainly **superseded by #8169**, which carries a nearly identical scope with 44 updates (including `uuid` bumping to `1.29.0` vs. `1.28.0` in the older PR). This reflects normal Dependabot rebase-and-replace churn rather than functional progress.

No feature development, refactoring, or bug-fix PRs were merged or closed today.

## 4. Community Hot Topics

There were **no issues updated in the last 24 hours**, and **all six PRs show undefined comment counts and zero reactions**. No discussion threads, review debates, or community engagement occurred today.

The most notable items by *duration open* rather than engagement:

- **[#7834](https://github.com/nearai/ironclaw/pull/7834)** — wasm group bump (wasmtime, wasmtime-wasi, wit-component, wit-parser). Open since **2026-08-23 (~11 weeks)**, carries labels `size: L`, `risk: medium`, `contributor: experienced` — the only PR with substantive risk labeling, suggesting this bump has real technical complexity (likely WASI/component-model compatibility concerns).
- **[#8141](https://github.com/nearai/ironclaw/pull/8141)** — tokio-ecosystem group, open since 2026-10-18.
- **[#8140](https://github.com/nearai/ironclaw/pull/8140)** — `serde_json` 1.0.151 → 1.0.154, open since 2026-10-18.
- **[#8159](https://github.com/nearai/ironclaw/pull/8159)** — GitHub Actions group (11 updates, including `claude-code-action` from `1.0.183` → `1.0.259`), open since 2026-10-25.

**Underlying need:** The lack of maintainer throughput on dependency PRs (multiple open 2–11 weeks) suggests either merge bottlenecks, CI friction, or deliberate batching. The #8160→#8169 supersession shows rebases are being generated faster than merges occur.

## 5. Bugs & Stability

**No bugs, crashes, or regressions were reported today** (zero updated issues).

**Latent stability considerations from open PRs:**
- **[#7834](https://github.com/nearai/ironclaw/pull/7834)** (wasm group, `risk: medium`) — WASM runtime upgrades can introduce behavioral changes in sandboxing or component interfaces. Its 11-week open duration warrants attention, as wasmtime updates sometimes carry security fixes.
- **[#8141](https://github.com/nearai/ironclaw/pull/8141)** — tokio patch bumps (`1.53.1` → `1.53.3`) are low-risk but affect the async runtime core.

No fix PRs for specific bugs exist, as none were filed.

## 6. Feature Requests & Roadmap Signals

**No feature requests or roadmap discussions appeared in issues today.** No user-requested capabilities were surfaced. With no issues and only Dependabot PRs, there is **no actionable signal** for next-version features.

Given the dependency landscape, an indirect roadmap indicator is the **wasm toolchain group (#7834)** — if merged, it could enable newer WASI preview features, suggesting continued investment in a WASM-based sandboxing/isolation layer for agents. Similarly, the `claude-code-action` bump in #8159 hints at reliance on Anthropic's agent tooling in CI.

## 7. User Feedback Summary

**No user feedback was captured today.** There were no issues, comments, or reactions from the community. This means:
- **No expressed pain points** (positive or negative) are visible in tracked data.
- **No use cases** were discussed.
- Satisfaction/dissatisfaction metrics are **unavailable** from this snapshot.

Analysts should treat the silent issue tracker as a **data gap**, not evidence of a satisfied user base — users may be voicing feedback outside GitHub (Discord, forums) or the project may simply have low external adoption activity at present.

## 8. Backlog Watch

The following PRs need maintainer attention due to **age and/or risk**:

| PR | Age | Concern |
|---|---|---|
| **[#7834](https://github.com/nearai/ironclaw/pull/7834)** | ~11 weeks | Highest priority: `risk: medium`, `size: L` wasm bump; security-relevant runtime dependency |
| **[#8141](https://github.com/nearai/ironclaw/pull/8141)** | ~3 weeks | Core async runtime (tokio) updates |
| **[#8140](https://github.com/nearai/ironclaw/pull/8140)** | ~3 weeks | Serialization layer (serde_json) — broad downstream impact |
| **[#8159](https://github.com/nearai/ironclaw/pull/8159)** | ~2 weeks | 11 GitHub Actions updates; CI supply-chain hygiene |
| **[#8169](https://github.com/nearai/ironclaw/pull/8169)** | 1 day | Fresh replacement for closed #8160; 44 updates |

**Recommendation:** The maintainer team should prioritize clearing the **wasm group (#7834)** — its complexity and security implications make prolonged staleness the highest project-health risk visible in today's data. Consider batching merges for the lower-risk groups (#8140, #8141, #8159) to reduce Dependabot rebase churn, as evidenced by the #8160→#8169 replacement cycle.

---

**Health verdict:** ⚪ *Quiet / Maintenance-only.* No regressions, but no forward motion from human contributors or the community. Dependency debt is accumulating slowly (oldest PR ~11 weeks), and the absence of any issue activity limits visibility into user sentiment.

</details>

<details>
<summary><strong>QwenPaw</strong> — <a href="https://github.com/agentscope-ai/QwenPaw">agentscope-ai/QwenPaw</a></summary>

# QwenPaw Project Digest — 2026-11-09

## 1. Today's Overview

QwenPaw shows **high issue and PR throughput but zero merge velocity** today: 7 issues were updated (all still open) and 15 PRs were touched (all still open), with no closures or merges in the last 24 hours. Activity is concentrated on bug fixes for long-standing channel, memory-search, and provider-fallback defects, many of which now have corresponding fix PRs submitted — indicating a healthy contributor pipeline but a potential review bottleneck. Notably, one cluster of three issues (#8619, #8620, #8621) and three matching PRs (#8623, #8624, #8625) from the same author (`txohyeah`) landed in a single day, suggesting a focused maintenance sprint on `MemorySpace.search`. No releases were cut, so users on 2.2.2.post1 and the 2.3.0-beta.2 desktop build remain exposed to the reported bugs.

## 2. Releases

No new releases in the last 24 hours.

## 3. Project Progress

**No PRs were merged or closed today.** All 15 updated PRs remain open, including several under active review:

- **#8630 [size/L] fix(channels): preserve enabled state on partial channel updates** — directly targets the QQ channel regression in issue #8475. [Link](https://github.com/agentscope-ai/QwenPaw/pull/8630)
- **#8628 feat(providers): add model fallback metadata to chat response** — makes silent model fallback visible, addressing #8103. [Link](https://github.com/agentscope-ai/QwenPaw/pull/8628)
- **#8626 feat(crons): per-job thinking_level override** — reduces reasoning cost for pipeline cron jobs. [Link](https://github.com/agentscope-ai/QwenPaw/pull/8626)
- **#8568 [Under Review] fix(skills): stage skill copies inside the target workspace** — fixes Windows Hub/AppContainer skill install failures. [Link](https://github.com/agentscope-ai/QwenPaw/pull/8568)
- **#8434 [Under Review] feat(console): Quick Add Model button** and **#7307 feat(console): chain provider config into model management** — both reduce multi-step model setup friction. [Link](https://github.com/agentscope-ai/QwenPaw/pull/8434) · [Link](https://github.com/agentscope-ai/QwenPaw/pull/7307)
- **#8318 feat(agent): /steer command for mid-execution guidance** — new agent control primitive. [Link](https://github.com/agentscope-ai/QwenPaw/pull/8318)
- **#7066 fix(drivers): persist rotated refresh_token for OAuth2 auth-code providers** — a long-pending fix (since 2026-08-16) for MCP OAuth2 token rotation. [Link](https://github.com/agentscope-ai/QwenPaw/pull/7066)

## 4. Community Hot Topics

Activity is modest in raw comment counts (1–2 comments each), but several threads reflect recurring pain:

- **#8475 QQ channel `enabled` flag silently reset to `false`** (2 comments) — a config-reload data-loss bug that silently breaks an entire messaging channel. Highest user impact among open issues. [Link](https://github.com/agentscope-ai/QwenPaw/issues/8475)
- **#8103 notify user when daemon silently falls back to a different model** (2 comments) — observability gap where users unknowingly receive outputs from a different model. [Link](https://github.com/agentscope-ai/QwenPaw/issues/8103)
- **#8629 Oversized historical image re-sent on every model call** (1 comment) — repeated wasted payloads plus misleading "Image loaded" text after a stripped retry. [Link](https://github.com/agentscope-ai/QwenPaw/issues/8629)
- **MemorySpace.search cluster** — #8619, #8620, #8621 each drew 1 comment and immediately spawned PRs #8623, #8624, #8625, signaling an engaged maintainer/contributor loop on search correctness and performance. [Link](https://github.com/agentscope-ai/QwenPaw/issues/8619) · [Link](https://github.com/agentscope-ai/QwenPaw/issues/8620) · [Link](https://github.com/agentscope-ai/QwenPaw/issues/8621)

**Underlying needs:** users want *silent failures to become loud* (config resets, model fallback, image retries), and they want *search correctness/performance guarantees* in the memory subsystem.

## 5. Bugs & Stability

Ranked by severity:

| Severity | Issue | Description | Fix PR? |
|---|---|---|---|
| **High** | [#8475](https://github.com/agentscope-ai/QwenPaw/issues/8475) | QQ channel `enabled` silently reset to `false` on config reload — total message outage, no warning log | ✅ #8630 |
| **High** | [#8627](https://github.com/agentscope-ai/QwenPaw/issues/8627) | Windows 2.3.0-beta.2: checkpoint service fails on Git long-path prefix; WeChat channel stuck at `DEPENDENCY_ENVIRONMENT_AMBIGUOUS` | ❌ none |
| **Medium** | [#8629](https://github.com/agentscope-ai/QwenPaw/issues/8629) | Oversized historical image re-sent every model call; misleading "Image loaded" text after stripped retry | ❌ none |
| **Medium** | [#8620](https://github.com/agentscope-ai/QwenPaw/issues/8620) | `MemorySpace.search` masks SQLite `OperationalError` as `TimeoutError` after deadline | ✅ #8622, #8624 |
| **Low** | [#8619](https://github.com/agentscope-ai/QwenPaw/issues/8619) | Redundant turn-boundary queries for the same search hits (perf) | ✅ #8623 |

**Regressions:** #8475 and #8629 both reproduce on the current stable 2.2.2.post1, making them the most urgent for a patch release. #8627 is beta-only but blocks Windows desktop users entirely.

## 6. Feature Requests & Roadmap Signals

- **Model fallback transparency** (#8103 → PR #8628): adding `model_used`/`model_requested` metadata to responses. Strong candidate for next minor release given the fix is already coded.
- **Per-job cron `thinking_level`** (#8626): cost/latency control for scheduled pipeline jobs — likely to land alongside cron improvements.
- **Row-only search on `recall_history`** (#8621 → PR #8625): exposes `include_turn=False` to avoid paying for full turn expansion.
- **`/steer` mid-execution guidance** (#8318): a notable agent-capability feature; could appear in a 2.3.x or 2.4 release.
- **Console UX consolidation** (#8434, #7307): "Quick Add Model" and one-flow provider→model setup suggest the team is prioritizing onboarding friction reduction.

**Prediction:** the next release will most likely bundle channel-config fix (#8630), fallback metadata (#8628), and the MemorySpace search fixes (#8622–#8625) as a stability patch.

## 7. User Feedback Summary

- **Silent failure is the dominant frustration.** Three separate reports (#8475, #8103, #8629) describe the system changing behavior without any user-visible signal — a channel turning off, a model silently swapping, an image silently retried. Users explicitly ask for *warnings and log entries*.
- **Windows desktop is a pain point.** #8627 and PR #8568 both concern Windows-specific path/AppContainer issues, indicating the desktop runtime needs platform hardening.
- **Power users are optimizing cost/latency.** #8626 (thinking-level per cron job) and #8621 (skip turn expansion) come from users running scheduled pipelines and large memory stores who feel the overhead.
- **Contributor responsiveness is a positive signal:** users like `txohyeah` filed precise, line-referenced bug reports and followed up with PRs the same day — the project's issue templates and codebase are navigable enough for this.

## 8. Backlog Watch

- **PR #7066** — OAuth2 rotated `refresh_token` persistence, open since **2026-08-16** (~85 days). Fixes a real MCP auth breakage (#7053) yet remains unmerged. High-value, low-risk; deserves maintainer review. [Link](https://github.com/agentscope-ai/QwenPaw/pull/7066)
- **PR #7307** — Provider→model management chaining (#4036), open since **2026-08-26**. Overlaps with #8434; the two may need consolidation. [Link](https://github.com/agentscope-ai/QwenPaw/pull/7307)
- **PR #8318** — `/steer` command, open since **2026-10-19**; a substantial agent feature awaiting review. [Link](https://github.com/agentscope-ai/QwenPaw/pull/8318)
- **Issue #8103** — model-fallback notification, open since **2026-10-04**; fix PR exists but the issue itself has low visibility (2 comments, 0 👍). [Link](https://github.com/agentscope-ai/QwenPaw/issues/8103)

**Health note:** the absence of any merged PR in 24h against 15 open PRs suggests review capacity, not contribution volume, is the current constraint. Clearing the long-tail PRs above would improve both stability and contributor retention.

</details>

<details>
<summary><strong>ZeroClaw</strong> — <a href="https://github.com/zeroclaw-labs/zeroclaw">zeroclaw-labs/zeroclaw</a></summary>

# ZeroClaw Project Digest — 2026-11-09

## 1. Today's Overview

ZeroClaw shows **high-velocity, security-heavy activity**: 13 issues and 50 PRs were touched in the last 24 hours, though only 1 issue closed and 7 PRs merged/closed, leaving **12 open issues and 43 open PRs** — a backlog-heavy day with activity concentrated in review and comment threads rather than landings. **No new release** was cut, and the release pipeline clearly points at **v0.9.0**, which several accepted trackers (#7432, #11984, #12244) are gated on. Development focus is dominated by **gateway/dashboard auth (OIDC/JWKS), agent identity and permission scoping, sandbox correctness, and shell command-policy accuracy** — a cluster of `domain:security` and `risk:high` work. Overall health is **active but strained**: many long-lived XL PRs (#11322, #11301, #11265) are carrying dependency stacks and `needs-author-action`/`do-not-merge` labels, and issue #7432 (the runtime/gateway tracker, open since June with 16 comments) remains the structural bottleneck.

## 2. Releases

**None.** No releases published in the last 24 hours. The `release:v0.9.0` label on issues #7432 and #11984 and PRs #12298/#12244 indicates v0.9.0 is the next target, but no release artifact exists yet.

## 3. Project Progress

**Closed PRs today (7 total):**
- **[PR #10502](https://github.com/zeroclaw-labs/zeroclaw/pull/10502)** — `fix(mcp)`: relocates MCP tool-result images from `role:"tool"` into a user message, fixing the OpenAI-compatible 400 error. This resolves the matching bug **[#10501](https://github.com/zeroclaw-labs/zeroclaw/issues/10501)**, the only issue closed today — a clean bug-fix pairing.
- **[PR #11406](https://github.com/zeroclaw-labs/zeroclaw/pull/11406)** — `fix(config)!`: refuses macOS broad filesystem roots (stacked on #11394 for Windows); a **breaking** config-validation change.
- **[PR #11268](https://github.com/zeroclaw-labs/zeroclaw/pull/11268)** — docs fix aligning gateway policy publication guidance.

**Advancing but still open:**
- **[PR #12298](https://github.com/zeroclaw-labs/zeroclaw/pull/12298)** — scoped dashboard chat with review fixes, carrying forward #12244, tagged `release:v0.9.0` but `do-not-merge`.
- **[PR #11994](https://github.com/zeroclaw-labs/zeroclaw/pull/11994)** — reads POSIX commands in bash's grammar when bash runs them (follow-up docs in #12295).
- **[PR #12039](https://github.com/zeroclaw-labs/zeroclaw/pull/12039)** and **[PR #12074](https://github.com/zeroclaw-labs/zeroclaw/pull/12074)** — web dashboard form-refresh and context-budget-display fixes.
- **[PR #11868](https://github.com/zeroclaw-labs/zeroclaw/pull/11868)** — stops repeated identical tool calls before dispatch (closes #11866).

The net effect: **one user-facing MCP bug fixed; the larger security/gateway stack remains in review**, not yet landed.

## 4. Community Hot Topics

Ranked by comment activity:

| Item | Comments | Theme |
|---|---|---|
| **[Issue #7432](https://github.com/zeroclaw-labs/zeroclaw/issues/7432)** | 16 | Runtime/dashboard sign-in & gateway delivery tracker (`v0.9.0`) |
| **[Issue #9872](https://github.com/zeroclaw-labs/zeroclaw/issues/9872)** | 5 | Delegated agent writes to wrong workspace (sandbox) |
| **[Issue #9597](https://github.com/zeroclaw-labs/zeroclaw/issues/9597)** | 5 | Durable/attributable peer-agent turns |
| **[Issue #7461](https://github.com/zeroclaw-labs/zeroclaw/issues/7461)** | 5 | Cross-platform CI (Windows/macOS) |
| **[Issue #10501](https://github.com/zeroclaw-labs/zeroclaw/issues/10501)** | 3 | MCP image-in-tool-message (now closed) |

**Underlying needs:** #7432 is the project's coordination hub — it owns release allocation and sequencing for all runtime/gateway work, explaining its comment volume. The #9872/#9597 pair reveals a **deep need for correct multi-agent isolation and lifecycle semantics** in delegation and peer messaging (both `risk:high`, both touching sandbox/runtime). #7461 signals contributors want **platform parity guarantees**, not just Linux-tested code. Notably, all hot items have **0 👍**, suggesting engagement is maintainer/contributor-driven discussion rather than broad community voting.

## 5. Bugs & Stability

Ranked by severity (all reported as active/updated 2026-11-08):

**S2 – Degraded behavior:**
- **[#9872](https://github.com/zeroclaw-labs/zeroclaw/issues/9872)** (p1) — Bounded delegate target resolves filesystem to the **delegator's** workspace, so a delegated researcher writes into the executive assistant's workspace. **Security-relevant isolation failure.** No fix PR linked yet.
- **[#12289](https://github.com/zeroclaw-labs/zeroclaw/issues/12289)** — **Disabled agents still run turns** via operator WebSocket chat and restricted RPC; the handler checks only the alias, not `enabled = false`. Enforcement gap; no fix PR yet.
- **[#12288](https://github.com/zeroclaw-labs/zeroclaw/issues/12288)** — Dashboard "Discard all" retains local form drafts that a later section Save persists — **data-integrity / UX regression** (may persist discarded values).

**Resolved today:**
- **[#10501](https://github.com/zeroclaw-labs/zeroclaw/issues/10501)** (p1) — MCP tool-result images 400 on OpenAI-compatible providers. **Fix PR [#10502](https://github.com/zeroclaw-labs/zeroclaw/pull/10502) merged/closed.**

**Assessment:** Two of the three open bugs (#9872, #12289) are **authorization/sandbox enforcement defects where configuration state is not honored** — a recurring pattern echoing the config-publication and rename-cascade PRs (#11313, #11226, #11301). The project is actively finding and fixing this class, but it appears **systemic**.

## 6. Feature Requests & Roadmap Signals

New/active requests updated today:

- **[#12296](https://github.com/zeroclaw-labs/zeroclaw/issues/12296)** — Check POSIX commands in **zsh's grammar** when spawning zsh (macOS default shell precision). Directly pairs with open PR #11994 (bash) and docs PR #12295 — **likely to land as part of the v0.9.x shell-policy hardening line.**
- **[#12290](https://github.com/zeroclaw-labs/zeroclaw/issues/12290)** — Non-admin accounts can **create agents they own**, with risky fields bounded by an admin (avoids blanket `config_write_paths`). Strong v0.9.0 candidate — it's part of the same non-admin dashboard empowerment arc as #11984.
- **[#12287](https://github.com/zeroclaw-labs/zeroclaw/issues/12287)** — **Bound peer-relay chains** (A→B→A) with a finite runtime-owned hop limit; explicitly a maintainer follow-up to #9597.
- **[#11984](https://github.com/zeroclaw-labs/zeroclaw/issues/11984)** — Dashboard chat for signed-in **non-admin** accounts (tagged `v0.9.0`).
- **[#9597](https://github.com/zeroclaw-labs/zeroclaw/issues/9597)** — Durable, attributable peer-agent turns (in-progress).
- **[#7461](https://github.com/zeroclaw-labs/zeroclaw/issues/7461)** — Three-OS CI test matrix (in-progress).

**Prediction:** The **non-admin/gateway identity cluster (#11984, #12290, #12096)** and **shell-grammar policy (#11994, #12295, #12296)** are the two most likely to appear in **v0.9.0**, since they carry `release:v0.9.0` or directly extend already-open v0.9 work.

## 7. User Feedback Summary

**Pain points (dissatisfaction):**
- **Isolation is not trusted** — a delegated agent writing to the wrong workspace (#9872) is a classic "I can't rely on the sandbox" complaint.
- **Access control is too coarse** — non-admins either get full `agents.*` write grants or nothing (#12290); disabled agents still execute (#12289).
- **Platform inequality** — macOS/Windows users effectively run on untested paths (#7461, #11394, #11406, #12296).
- **Dashboard UX friction** — discarded drafts can resurface (#12288); form state stale after "Save all" (#12039).

**Satisfaction signals:** The MCP image fix (#10501→#10502) shows **provider-compatibility complaints are being heard and resolved quickly**. The steady flow of auth/scoping features (#11984, #12096, #12290) from contributor JordanTheJet indicates **real user demand for "sign in and just use it" self-service**, moving away from admin-gated operation.

**Use cases emerging:** multi-agent delegation with strict boundaries (executive-assistant → researcher), self-service dashboard chat for non-admins, and cross-platform macOS/Windows deployments.

## 8. Backlog Watch

Items needing maintainer attention (long-lived, high-risk, or blocked):

- **[Issue #7432](https://github.com/zeroclaw-labs/zeroclaw/issues/7432)** — open since **2026-06-09** (5 months), 16 comments, the v0.9.0 runtime/gateway tracker. **The single most important coordination item**; its progress gates much of the release.
- **[PR #11322](https://github.com/zeroclaw-labs/zeroclaw/pull/11322)** — open since **2026-10-01**, `size:XL`, `risk:high`, `needs-author-action`, depends on #11320 **and** #11186. A deep dependency chain.
- **[PR #11320](https://github.com/zeroclaw-labs/zeroclaw/pull/11320)** — same author/date, `size:XL`, `needs-author-action`, depends on #11319/#11165. **The plugin-webhook RPC stack is stalled in a dependency tower.**
- **[PR #11301](https://github.com/zeroclaw-labs/zeroclaw/pull/11301)** (p1, since 2026-10-01) and **[PR #11265](https://github.com/zeroclaw-labs/zeroclaw/pull/11265)** / **[PR #11264](https://github.com/zeroclaw-labs/zeroclaw/pull/11264)** (since 2026-09-30) — the durable-rename-recovery and roster-password-lifecycle stacks, all `size:XL`, `risk:high`, `domain:security`, still open with `needs-author-action`.
- **[PR #12244](https://github.com/zeroclaw-labs/zeroclaw/pull/12244)** — `status:blocked`, `do-not-merge`, depends on #11964 and #12232; the v0.9.0 scoped-chat feature is held behind two unmerged prerequisites.

**Takeaway:** A significant share of the backlog is **stacked/blocked XL PRs from a small set of authors**, which concentrates merge risk and creates a **dependency queue** that could delay v0.9.0. Maintainers may need to prioritize reviewing the base-of-stack PRs (#11319, #11165, #11964, #12232) to unblock the rest.

---

*Overall health: **actively developed, security-focused, but backlog-constrained.** Bug turnaround is good (MCP fix landed same cycle), the roadmap is coherent around v0.9.0 gateway identity + shell-policy work, yet a large dependency queue of high-risk XL PRs and a 5-month-old tracker (#7432) represent the main delivery risk.*

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*