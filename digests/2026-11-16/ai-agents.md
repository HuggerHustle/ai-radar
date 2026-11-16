# OpenClaw Ecosystem Digest 2026-11-16

> Issues: 499 | PRs: 500 | Projects covered: 5 | Generated: 2026-11-16 00:56 UTC

- [OpenClaw](https://github.com/openclaw/openclaw)
- [Hermes Agent](https://github.com/nousresearch/hermes-agent)
- [IronClaw](https://github.com/nearai/ironclaw)
- [QwenPaw](https://github.com/agentscope-ai/QwenPaw)
- [ZeroClaw](https://github.com/zeroclaw-labs/zeroclaw)

---

## OpenClaw Deep Dive

# OpenClaw Project Digest — 2026-11-16

## 1. Today's Overview

OpenClaw remains in a high-velocity but stability-stressed phase. In the last 24 hours, **499 issues** were updated (424 still active, 75 closed) and **500 PRs** saw activity (330 open, 170 merged/closed), yet **zero new releases** shipped — meaning merged fixes are accumulating on `main` without a user-facing cut. The issue tracker is dominated by **P0/P1 crash-loop, session-state, and message-loss reports**, many of which are regressions from the 2026.9.x–2026.10.x line (plugin capture stalls, Windows/macOS gateway lifecycle failures, Codex/subagent completion handoff bugs). A large fraction of activity is ClawSweeper triage and `roboclaw-bot`/`steipete` maintenance PRs rather than net-new feature work, suggesting the team is in a hardening sprint. Overall activity is **very high**, but the ratio of unresolved P0/P1 defects to releases indicates a project under significant operational pressure.

## 2. Releases

**No new releases in the last 24 hours.** No changelog, breaking-change, or migration notes to report. Notably, several fixes referenced in today's issues (e.g., the SQLite header-probe fix in 2026.11.5-beta.1) are not yet broadly reachable via `openclaw update` — see Issue #193962 below.

## 3. Project Progress

Today's merged/closed PRs (170 total) skew toward UI polish, test/CI repair, and targeted correctness fixes rather than headline features. Representative closed items:

- **#199483** (closed) — `fix(ui): expired approvals claim an execution outcome` — corrects misleading approval-page copy when a timeout fallback can still execute. [PR #199483](https://github.com/openclaw/openclaw/pull/199483)
- **#198813** (closed) — `fix(templates): Template avatar path validates but does not resolve` — fixes backslash/case-mismatched avatar paths. [PR #198813](https://github.com/openclaw/openclaw/pull/198813)
- **#198914** (closed) — `fix(k8s): show deployment help without cluster access` — `--help` no longer requires kubeconfig. [PR #198914](https://github.com/openclaw/openclaw/pull/198914)

In-flight work advancing the platform (open, ready for maintainer look):
- **#199868** `fix: retain subagent results through Gateway restarts` — directly targets the subagent-result-loss class dominating P1 issues. [PR #199868](https://github.com/openclaw/openclaw/pull/199868)
- **#199859** `fix(knowledge): shorten write locks during large vault scans` — reduces SQLite writer contention. [PR #199859](https://github.com/openclaw/openclaw/pull/199859)
- **#198070 / #198603 / #198637** — a cluster of Template "Add" UX fixes (chat opens without waiting for a plan; retryable setup; dependency-settled attach). [PR #198070](https://github.com/openclaw/openclaw/pull/198070)

Issue closures today included **#193962** (P0, diamond-lobster: updater can't reach the SQLite timeout fix), **#140631**, **#150081**, **#150060**, **#148603**, **#143580**, **#156774**, **#175826** — mostly `stale` items or ones superseded by linked PRs.

## 4. Community Hot Topics

Ranked by comment count:

1. **#160959** (82 comments, P0, 🦞 diamond lobster) — Gateway blocks for minutes on large external plugins (2026.9.6 regression). [Issue #160959](https://github.com/openclaw/openclaw/issues/160959)
2. **#170956** (33, P0) — Windows slow startup, unclean plugin shutdown, `schtasks` permission errors break restarts/updates. [Issue #170956](https://github.com/openclaw/openclaw/issues/170956)
3. **#191944** (28, P2) — macOS `gateway stop` fails with "Process ancestry could not be fully inspected." [Issue #191944](https://github.com/openclaw/openclaw/issues/191944)
4. **#193962** (26, P0, now closed) — Update path can't reach the SQLite header-probe fix. [Issue #193962](https://github.com/openclaw/openclaw/issues/193962)
5. **#121661** (18, P1, diamond lobster) — CLI-backed subagent announce-wake turns run tool-free; model fabricates tool calls/output. [Issue #121661](https://github.com/openclaw/openclaw/issues/121661)
6. **#143017** (17, diamond lobster) — Prompt-cache: five ways a persistent session rewrites its prefix (21.3M cache-write tokens measured). [Issue #143017](https://github.com/openclaw/openclaw/issues/143017)

**Underlying needs:** The top threads reveal three systemic pain clusters — (a) **event-loop blocking from plugin preparation/capture** (#160959, #163029, #174681, #160658 lineage), (b) **platform-specific gateway lifecycle fragility** on Windows/macOS (#170956, #191944, #146860, #181120), and (c) **cost/context integrity** (prompt-cache rewrites, usage undercounting, byte-capped transcript sliding). Users are technically sophisticated, producing wire captures and token counts, and are frustrated that multi-release regressions persist without a corrective release.

## 5. Bugs & Stability

Ranked by severity (P0/P1 first). "Fix PR?" indicates a linked open PR exists per labels.

| Severity | Issue | Summary | Fix PR? |
|---|---|---|---|
| P0 | [#160959](https://github.com/openclaw/openclaw/issues/160959) | Gateway blocks minutes capturing large external plugins (2026.9.6 regression) | No new fix PR; needs maintainer review |
| P0 | [#170956](https://github.com/openclaw/openclaw/issues/170956) | Windows slow startup, unclean shutdown, `schtasks` permission errors | Needs info |
| P0 | [#146860](https://github.com/openclaw/openclaw/issues/146860) | Windows managed update handoff stalls with `LogonType: InteractiveToken` | Needs info |
| P0 | [#146791](https://github.com/openclaw/openclaw/issues/146791) | iOS App Store build never publishes `push.apns.register` | No — release blocker |
| P1 | [#196199](https://github.com/openclaw/openclaw/issues/196199) | Regression since 2026.10.10: native Codex helper completions fail to resume parent (~1 in 2) | Needs info |
| P1 | [#194403](https://github.com/openclaw/openclaw/issues/194403) | Helper-completion continuations invalidate their own authority; conversations blocked | No new fix PR |
| P1 | [#194451](https://github.com/openclaw/openclaw/issues/194451) | `/think` and other directives mid-turn kill the turn with `SqliteTranscriptMutationConflictError` | Linked PR open |
| P1 | [#162637](https://github.com/openclaw/openclaw/issues/162637) | Native Codex handoff fails with `SESSION_WORK_START_CHANGED` | No new fix PR |
| P1 | [#163029](https://github.com/openclaw/openclaw/issues/163029) | 2026.9.7 reloads external plugin mid-turn (40–70 s stalls) despite fix | Fix-shape clear |
| P1 | [#181120](https://github.com/openclaw/openclaw/issues/181120) | macOS Gateway hangs closing worker MessagePort (main-thread lock) | No |
| P1 | [#185111](https://github.com/openclaw/openclaw/issues/185111) | Large-session context reads scan full transcript before limits (19–25 s) | Fix-shape clear |
| P1 | [#159799](https://github.com/openclaw/openclaw/issues/159799) | Byte-capped hydration slides transcript window each turn; busts prefix caches, drops context | No |
| P2 | [#191944](https://github.com/openclaw/openclaw/issues/191944) | macOS `gateway stop`/`--force` both fail (process ancestry) | Fix-shape clear |
| P2 | [#199713](https://github.com/openclaw/openclaw/issues/199713) | Plugins → Advanced hangs mobile Chrome (renderer saturation) | No |
| P2 | [#160494](https://github.com/openclaw/openclaw/issues/160494) | Cron bound to persistent session rejected on rotation, retries re-enter rejection | No |

**Notable regressions:** #196199 and #194403 (Codex helper completion/authority) are a coherent 2026.10.10+ regression family. #163029 and #174681 are both mid-turn plugin-reload/blocking regressions despite prior fixes — suggests the fix (#172750) was reverted and the underlying design remains unresolved.

## 6. Feature Requests & Roadmap Signals

Active feature requests, with likelihood of near-term landing:

- **#197297 — Per-user secret vault** (P2, needs security review) — multi-user Gateway secret isolation. Given the `security-sensitive` label and active PR #199863 (agent-limit enforcement), scoped host capability work is plausible soon, but the vault-as-plugin split means **low near-term likelihood**.
- **#166586 — Consume MCP Events and start an agent run per event** (P3) — the `plugin: mcp-events` work (PR #199105 hardening event-date validation) signals this feature area **is actively being built out**.
- **#184803 — Option to disable spoken task receipt on Talk consult** (P3) — small, contained; plausible in a minor release.
- **#157614 — Independent command-text limit for progress streaming** (P2) — linked PR open; **moderate** likelihood.
- **#167341 — Operator-overridable classified failure copy** (P3) — linked PR open.
- **#103067 — Centralize chat-session naming; subagent session lifetime/persistence** (P2, diamond lobster) — architectural, long-running; likely **roadmap-level**.

**Prediction:** The next release will be dominated by *stability restoration* (plugin prep, subagent settlement, update path) rather than new features; MCP Events and Talk/streaming config are the most probable feature increments to slip in alongside.

## 7. User Feedback Summary

**Pain points (dissatisfaction):**
- **Update/restart reliability is the top complaint.** Windows `schtasks` installs and macOS managed stop/update fail frequently, sometimes only succeeding "after many retries" (#170956). The update path itself cannot deliver the SQLite fix that already exists (#193962) — a compounding trust issue.
- **Performance stalls destroy usability.** Minutes-long Gateway event-loop blocks from plugin preparation (#160959, #174681, #163029) and 19–25 s context reads on large sessions (#185111) make the assistant feel frozen.
- **Session/message integrity.** Users report permanently blocked conversations after helper completion (#194403, #196199), silently retained zombie sessions (#160719), and transcript-window sliding that silently drops context (#159799).
- **Cost transparency.** Undercounted usage for `claude-cli` (#148603) and unattributable child-run spend ($0.04 parent vs $14.14 child, #130257) erode operator confidence in billing.

**Positive signals:** Users are highly engaged and technical — many file detailed wire captures, token measurements, and exact repros. Maintainers are responsive (24h closures, linked PRs), and users credit fixes (e.g., #116461). Sentiment is best described as **patient-but-strained**: the community trusts the maintainers but is frustrated that long-standing regressions survive multiple releases without a correcting cut.

## 8. Backlog Watch

Long-unanswered or high-value items needing maintainer attention:

- **#103067** (created 2026-07-09, 10 comments, P2, diamond lobster) — Centralize session naming + subagent session lifetime/persistence. Open ~4 months; foundational for many session-state bugs. [Issue #103067](https://github.com/openclaw/openclaw/issues/103067)
- **#127195** (created 2026-08-21, 12 comments) — Sixteen call sites emit byte-identical "changed while starting work" errors with no reason code — a root-cause blocker for diagnosing the entire session-state bug family (#160494, #162637). [Issue #127195](https://github.com/openclaw/openclaw/issues/127195)
- **#121661** (created 2026-08-10, 18 comments, P1, diamond lobster) — CLI-backed subagent announce-wake turns run tool-free and fabricate output. Long-lived P1 with `needs-product-decision` + `needs-security-review`. [Issue #121661](https://github.com/openclaw/openclaw/issues/121661)
- **#118793** (created 2026-08-03, now `stale`) — Claude CLI session-limit errors bypass the model fallback chain. A staleness label on a failover correctness bug is a risk. [Issue #118793](https://github.com/openclaw/openclaw/issues/118793)
- **#143017** (created 2026-09-09, 17 comments, diamond lobster) — Prompt-cache prefix rewrites (21.3M cache-write tokens measured). High-cost impact, no fix PR. [Issue #143017](https://github.com/openclaw/openclaw/issues/143017)
- **PR #129388** (opened 2026-08-25, XL, `status: 📣 needs proof`, `security-review-required`, `clawsweeper-recovery-stuck`) — context-pressure-aware continuation. A large, high-impact PR stalled on proof/security review. [PR #129388](https://github.com/openclaw/openclaw/pull/129388)

**Health note:** The pattern of `stale` labels landing on P1/P2 correctness and fallback bugs (#118793, #143017, #156953, #157537) while new P0s continue to arrive is the project's biggest structural risk. Prioritizing a stability-focused release that closes the plugin-blocking and session-state families — and making that release reachable via the updater — would materially improve project health heading into the next cycle.

---

## Cross-Ecosystem Comparison

# Cross-Project Comparison Report: Personal AI Assistant & Agent Open-Source Ecosystem
**Snapshot Date: 2026-11-16** | Projects: OpenClaw, Hermes Agent, IronClaw, QwenPaw, ZeroClaw

---

## 1. Ecosystem Overview

The personal AI assistant / agent open-source landscape is bifurcated between **high-velocity core platforms** (OpenClaw, Hermes Agent, ZeroClaw) operating under significant operational pressure, and **focused, maturing projects** (IronClaw, QwenPaw) prioritizing stability over breadth. A common pattern across all five projects is a **stability-stressed post-migration phase**: each has recently absorbed a major architectural change (OpenClaw's 2026.9.x–10.x regressions, Hermes' unified-gateway migration #106742, QwenPaw's 2.3.0 plugin externalization, ZeroClaw's v0.9.0 line) and is now dealing with the fallout. **Maintainer review bandwidth — not contributor supply — is the universal bottleneck**, with open-to-merged PR ratios ranging from ~3:1 (OpenClaw) to ~24:1 (Hermes, ZeroClaw). Cost governance, credential scoping, and provider fidelity have emerged as the dominant cross-cutting concerns shaping the next release cycle.

---

## 2. Activity Comparison

| Project | Issues (24h) | Open / Closed | PRs (24h) | Open / Merged | Releases (24h) | Health Score* | Phase |
|---|---|---|---|---|---|---|---|
| **OpenClaw** | 499 | 424 / 75 | 500 | 330 / 170 | 0 | **6.5 / 10** | High-velocity, hardening sprint, P0-heavy |
| **Hermes Agent** | 50 | 48 / 2 | 50 | 47 / 3 | 1 (canary) | **6.0 / 10** | Migration aftermath, review-constrained |
| **IronClaw** | 3 | 3 / 0 | 1 | 1 / 0 | 0 | **8.0 / 10** | Stable, low-volume, focused roadmap |
| **QwenPaw** | 12 | ~10 / 2 | 12 | 12 / 0 | 0 | **6.0 / 10** | Post-2.3.0 regression cluster, review backlog |
| **ZeroClaw** | 27 | 27 / 0 | 50 | 48 / 2 | 0 | **5.5 / 10** | Active but congested; unpatched S0/S1 bugs |

\* **Health Score** is a composite heuristic weighing: unresolved P0/P1 defect ratio, open-to-merged PR ratio, release cadence, and community responsiveness. It is **not** a measure of project quality, but of operational pressure and forward-motion clarity.

**Key observations:**
- **OpenClaw operates at ~10× the raw activity** of any peer, but its unresolved P0/P1 backlog and zero-release window are the highest-risk signals in the dataset.
- **IronClaw is the only project with a favorable health profile** — low activity but every open item has a clear next action (PR #8171 unblocks epic #2843).
- **ZeroClaw's S0 allowlist-bypass bug (#12118) with no fix PR** is the single most concerning stability item across all five projects.
- **Every project has an open-to-merged PR ratio ≥ 3:1**, confirming a systemic review-capacity constraint.

---

## 3. OpenClaw's Position

**Advantages vs peers:**
- **Ecosystem gravity:** OpenClaw is the reference implementation. Peers (Hermes, ZeroClaw) are explicitly differentiated by *what they do differently* — OpenClaw defines the baseline for plugin APIs, gateway lifecycle, session-state, and subagent semantics.
- **Community scale:** ~500 issue/PR updates/day vs Hermes' ~100 and ZeroClaw's ~77. The community produces wire captures, token measurements, and 21.3M-token prompt-cache audits (#143017) — a level of technical rigor unmatched elsewhere.
- **Plugin ecosystem maturity:** ClawSweeper triage automation, `roboclaw-bot` maintenance PRs, and a labeled severity system (P0/P1 + 🦞 diamond lobster) indicate a scaled operations model peers lack.
- **Feature surface:** Subagent settlement, prompt caching, MCP events, Talk consult, and cron/session integration are all in active development — broader than IronClaw's cost-focused scope or QwenPaw's channel-centric focus.

**Technical approach differences:**
- OpenClaw leans on a **plugin-first, event-loop-centric architecture**, which is simultaneously its greatest strength (extensibility) and its greatest liability (event-loop blocking from plugin prep, #160959, #174681).
- Peers diverge: Hermes is migrating toward a **unified gateway with multiplexed profiles**; ZeroClaw is investing heavily in **scoped credential primitives** (Rust-native SSH broker, write-only TLS creds); QwenPaw uses a **plugin externalization model** that proved regression-prone in 2.3.0.
- OpenClaw is **platform-broad** (Windows/macOS/iOS/K8s), whereas peers are narrower (Hermes Desktop-centric, IronClaw server-oriented, QwenPaw channel-centric with Feishu/WeChat).

**Community size comparison:**
- **OpenClaw ≫ ZeroClaw > Hermes > QwenPaw > IronClaw** in raw engagement.
- However, **OpenClaw's ratio of P0/P1 to releases is the worst in the cohort** — scale is not translating to user-perceived stability.

**Strategic implication:** OpenClaw's moat is ecosystem position and community scale; its vulnerability is **trust erosion from long-surviving regressions without corrective releases** (#193962 update-path failure is the canonical example).

---

## 4. Shared Technical Focus Areas

Four requirements emerge across **three or more projects**, signaling ecosystem-wide gaps:

| Theme | Projects | Specific Needs |
|---|---|---|
| **Cost governance & USD budgeting** | OpenClaw (#130257, #148603), IronClaw (#2843, #8171), ZeroClaw (#9816, #12477, #12353), Hermes (#122094) | USD-denominated budgets cascading user→project→mission→thread; accurate pricing tables; prompt-cache keep-alive; cost visibility per conversation. **The single strongest cross-project signal.** |
| **Credential / secret scoping** | ZeroClaw (#12402, #12408, #12418, #12422), Hermes (#92424, #146318, #147720), OpenClaw (#197297 per-user secret vault), IronClaw (#8173) | Write-only credentials, per-profile/per-agent secret isolation, scoped HTTP/SSH transports, provider-agnostic failover. |
| **Session / profile state integrity** | OpenClaw (#103067, #194403, #196199), Hermes (#143150, #155955, #156258), QwenPaw (#8746, #8757), ZeroClaw (#12289) | Session ownership reconciliation, silent-fork prevention, resumable sessions post-migration, disabled-agent enforcement. |
| **Provider fidelity (timeouts, context, signatures)** | ZeroClaw (#12014, #12401, #10884, #7899), IronClaw (#8172), Hermes (#143065, #68263), OpenClaw (#118793) | Configurable idle timeouts for local LLMs, accurate context-window discovery, thinking-signature preservation, honoring `max_tokens`/`budget_tokens` on compatible endpoints. |
| **Delegation security / least-privilege** | ZeroClaw (#11138), Hermes (#91505, #92424), OpenClaw (#121661), QwenPaw (#8755) | Caller tool-level approval inheritance, scoped approval tokens, per-agent credential scoping, path-scoped file access. |

**Interpretation:** These five themes are not independent — they form a **"trust layer" stack**: users cannot deploy agents in shared/multi-tenant environments without *cost control + credential isolation + state integrity + provider fidelity + delegation policy*. No single project has solved all five; each leads in one.

---

## 5. Differentiation Analysis

| Dimension | OpenClaw | Hermes Agent | IronClaw | QwenPaw | ZeroClaw |
|---|---|---|---|---|---|
| **Feature focus** | Plugin breadth, subagents, cross-platform gateway | Unified gateway, profiles, ACP/MCP/A2A protocols | USD budgeting, LLM provider abstraction | Channel integration (Feishu/WeChat), multi-agent shared installs | Security primitives, scoped credentials, Rust-native tooling |
| **Target users** | Power users, plugin developers, multi-platform operators | Desktop users, profile-multiplexing power users, editor integrations | Server/ops teams, multi-tenant deployments | Family/SMB shared installs, enterprise PoCs (aerospace) | Security-conscious operators, Rust-leaning infra teams |
| **Architecture** | Event-loop-centric plugin runtime; broad OS matrix | Unified gateway + multiplexed profiles; Desktop-first | Server-oriented, LLM-provider abstraction layer | Plugin-externalized channels; single-user auth by design | Rust-first, SSH/transport ownership, scoped credential model |
| **Language/stack signal** | TypeScript/Node (inferred) | Python (venv leak, `PYTHONPATH`) + Desktop | Rust/Node hybrid (PR titles, `NearAi...` construction) | Python (agentscope-ai lineage) | Rust (native SSH broker, XMPP/OMEMO PRs) |
| **Primary weakness** | P0/P1 regressions without releases | Review bandwidth; migration whiplash | Low activity; dependency-chain blocking | 2.3.0 regression cluster; single-user ceiling | S0/S1 bugs unpatched; XL PR congestion |
| **Differentiation moat** | Ecosystem reference position | ACP/MCP/A2A protocol coverage | Cost-control epic (#2843) | Channel breadth (Feishu/WeChat) | Security-first credential architecture |

**Notable divergence:** ZeroClaw is the only project where **security primitives are the primary feature axis** (not an add-on). Hermes is the only project with a **coherent protocol-compatibility strategy** (ACP 1.0, MCP, A2A). IronClaw is the only project where a **single epic (#2843) defines the roadmap**. QwenPaw is the only project explicitly **declining multi-user support** (#8751) despite structural demand — a positioning bet.

---

## 6. Community Momentum & Maturity

**Activity tiers:**

- **Tier 1 — High-velocity, hardening (OpenClaw):** ~500 daily updates; mature tooling (ClawSweeper, roboclaw-bot); massive contributor base. **Momentum: high; Maturity: high; Risk: operational.**
- **Tier 2 — Mid-velocity, migration-recovering (Hermes, ZeroClaw):** ~50 daily updates each; strong contributor interest but review-constrained. Hermes is post-migration; ZeroClaw is mid-security-roadmap. **Momentum: medium-high; Maturity: medium; Risk: review backlog.**
- **Tier 3 — Low-velocity, focused (IronClaw, QwenPaw):** ~3–12 daily updates; clear scoped priorities; small maintainer teams. **Momentum: low-medium; Maturity: medium; Risk: aging backlog.**

**Rapidly iterating:** OpenClaw (feature + fix churn), ZeroClaw (credential PR cluster advancing).
**Stabilizing:** Hermes (post-#106742 cleanup), QwenPaw (post-2.3.0 same-day fix PRs).
**Quietly maturing:** IronClaw (deliberate, dependency-gated roadmap).

**Maturity signals by project:**
- **OpenClaw:** Highest process maturity (severity labels, automated triage, linked-PR discipline) but **release-discipline gap** — merged fixes accumulate on `main` unreachable via `openclaw update`.
- **Hermes:** Strong protocol-layer maturity (ACP/MCP/A2A PRs) but **desktop-state maturity gap** (silent chat forks, frozen windows).
- **IronClaw:** Highest *operational* maturity — every open item has a clear unblock path.
- **QwenPaw:** Strong contributor responsiveness (same-day fix PRs) but **review/merge bottleneck** (12 open PRs, 0 merges).
- **ZeroClaw:** Strong *architectural* ambition (Rust-native SSH, scoped creds) but **security-invariant enforcement gap** (#12118 allowlist bypass, #12289 disabled-agent execution).

---

## 7. Trend Signals

Seven industry trends extracted from cross-project community feedback, ranked by signal strength:

**1. Cost governance is the #1 unmet need.**
Four of five projects have active cost-related threads. Users are moving past "token counting" toward **USD-denominated, hierarchically-cascading budgets** (IronClaw #2843) with **accurate pricing** (IronClaw #8171, up to 8× off) and **prompt-cache economics** (OpenClaw #143017: 21.3M cache-write tokens measured; Hermes #122094 keep-alive). *Value for developers:* ship a pricing table + budget cascade early; stale pricing destroys trust in every cost feature downstream.

**2. Credential scoping is becoming table-stakes for multi-tenant agents.**
ZeroClaw's scoped-credential RFC (#12422) and PR cluster, Hermes' path-scoped profile access (#92424), and OpenClaw's per-user secret vault (#197297) all point the same direction: **agents must operate under least-privilege, per-scope credentials** — not shared process-wide secrets. *Value:* design credential primitives before multi-user features; retrofitting is expensive.

**3. Provider fidelity is a silent trust-killer.**
Users repeatedly report **configuration not honored** — silent 32k context fallbacks (ZeroClaw #12014), ignored `max_tokens` (Hermes #68263), no-op `/reasoning` on compatible endpoints (#143065), and hardcoded watchdogs killing slow local LLMs (IronClaw #8172). *Value:* loud, explicit errors on unsupported configuration beat silent defaults; document provider-capability matrices.

**4. Silent failures are the most damaging failure class.**
Across projects, the highest-severity user complaints are **invisible** — WeChat polling dying with "healthy" status (QwenPaw #8757), tasks swallowed during startup (#8746), Anthropic cost silently $0.00 (ZeroClaw #9816), false-success GPU jobs billing indefinitely (Hermes #156278). *Value:* invest in liveness assertions and "did the agent actually do anything?" telemetry.

**5. Session/profile state is the new frontier of complexity.**
Post-migration state bugs dominate Hermes (#143150, #155955, #156258), OpenClaw (#103067, #194403, #196199), and QwenPaw (#8755). Users expect **resumable, non-forking, profile-scoped sessions** as a baseline. *Value:* treat session ownership as a first-class, centralized concern (cf. OpenClaw #103067 backlog item) rather than per-feature state.

**6. Local/self-hosted LLM support is a distinct user segment with distinct needs.**
Ollama (IronClaw #8172, #8173), MiniMax/Anthropic-compatible endpoints (Hermes #143065), and custom OpenAI-compatible providers (ZeroClaw #12014) all surface **timeout, context-discovery, and fallback** requirements that cloud-first designs miss. *Value:* make idle timeouts, context windows, and failover provider-agnostic from day one.

**7. Review bandwidth — not contributor supply — is the ecosystem-wide constraint.**
Open-to-merged PR ratios: OpenClaw ~2:1 (best), Hermes ~16:1, ZeroClaw ~24:1, QwenPaw ~12:1, IronClaw ~1:0 (n=1). Several XL PRs (#129388 OpenClaw, #11847/#11869 ZeroClaw, #6325 QwenPaw) have sat for weeks-to-months. *Value:* projects that solve review throughput (automated proof checks, scoped reviewers, smaller PR norms) will outpace peers regardless of feature ambition.

---

**Bottom line for technical decision-makers:** The ecosystem has converged on a **shared "trust layer" requirement stack** (cost, credentials, state, provider fidelity, delegation), but no single project has solved it. OpenClaw offers the broadest ecosystem and community; IronClaw the cleanest roadmap discipline; ZeroClaw the most ambitious security architecture; Hermes the strongest protocol coverage; QwenPaw the deepest channel integration. **Choose based on which trust-layer dimension is your hard requirement** — and expect every project to spend the next release cycle on stability restoration rather than net-new features.

---

## Peer Project Reports

<details>
<summary><strong>Hermes Agent</strong> — <a href="https://github.com/nousresearch/hermes-agent">nousresearch/hermes-agent</a></summary>

# Hermes Agent — Project Digest
**Date: 2026-11-16** | Source: github.com/nousresearch/hermes-agent

---

## 1. Today's Overview

Hermes Agent shows **high-velocity but backpressure-heavy activity**: 50 issues and 50 PRs were touched in the last 24h, but the open/active ratio remains lopsided (48/50 issues open, 47/50 PRs open), indicating maintainer review capacity is the bottleneck rather than contributor supply. A single canary release (`v0.23.1+canary.20261115T064406Z`) shipped, signaling the project is still in a rapid iteration cadence ahead of a stable cut. The dominant theme continues to be the **post-#106742 "unified gateway" migration aftermath** — session ownership, multiplexed profiles, and Desktop↔gateway state reconciliation dominate both the issue tracker and the PR queue. Meanwhile, a healthy stream of plugin-catalog pins and ACP/MCP protocol compatibility fixes suggests the ecosystem layer is actively maturing. Overall health: **active and responsive, but with accumulating migration debt that warrants a stabilization window**.

---

## 2. Releases

### v0.23.1+canary.20261115T064406Z (released 2026-11-15)

- **Type:** Canary/pre-release build, not a stable cut.
- **Contents:** Release notes body is a build template (`HERMES_BUILDS_TABLE`) with Desktop download artifacts for macOS Apple Silicon (DMG) and other platforms. No changelog, breaking-change list, or migration notes are embedded in the release itself.
- **Breaking changes / migration notes:** None declared in the release metadata. Users on this canary should be aware it falls within the actively-migrating unified-gateway line (see Issues #143547, #143150), so behavior differences around sessions/profiles are expected.
- **Recommendation:** Treat as a testing artifact. Production users should track the last stable release until the gateway migration issues (#143547, #143150, #155955, #156258) are closed.

---

## 3. Project Progress

Only **3 PRs were merged/closed** in the last 24h against 47 still open — a slow landing day, though the tracked top-20 by comments are all open threads.

Notable movement in the PR queue (features advancing, awaiting merge):

- **#156312 — ACP editors work on agent-client-protocol 1.0** ([link](https://github.com/NousResearch/hermes-agent/pull/156312)): Salvages #81067; restores `hermes acp` startup on ACP 1.0 (shipped 2026-11-09) and exposes model/edit-approval/reasoning pickers via `configOptions`. Fixes a hard breakage for Zed/Buzz/JetBrains users.
- **#122094 — Prompt cache keep-alive** ([link](https://github.com/NousResearch/hermes-agent/pull/122094)): Sends a tiny keep-alive request before prompt cache expiry during long tool runs (builds, tests) across Nous Portal, OpenRouter, and Anthropic — a direct billing/latency optimization.
- **#155971 — MCP servers with GitHub OAuth can sign in/refresh** ([link](https://github.com/NousResearch/hermes-agent/pull/155971)): Fixes "Invalid token response" by requesting JSON token responses (salvage #44605, port omp#18293).
- **#151935 — Durable detached-result write + read-only state facade for plugins** ([link](https://github.com/NousResearch/hermes-agent/pull/151935)): Gives plugins a supported public API for out-of-turn result delivery (cron, kanban, detached delegation).
- **#144019 — A2A caller provenance** ([link](https://github.com/NousResearch/hermes-agent/pull/144019)): Records token-derived caller identity on inbound A2A tasks instead of collapsing everyone to `ip:<addr>`.

**Closed issue of note:**
- **#144547 (CLOSED)** ([link](https://github.com/NousResearch/hermes-agent/issues/144547)): Lifecycle guard previously blocked `hermes gateway restart` but not `hermes update` (which drains, SIGKILLs, and re-codes the running gateway). Closure suggests the asymmetry was addressed.

---

## 4. Community Hot Topics

Ranked by engagement (comments/reactions):

| Rank | Item | Comments / 👍 | Link |
|---|---|---|---|
| 1 | **#143547** — Unified gateway (#106742): open post-merge problems on main | 73 / 1 | [link](https://github.com/NousResearch/hermes-agent/issues/143547) |
| 2 | **#122928** — macOS Desktop leaks superseded venv via PYTHONPATH to terminal children | 10 / 0 | [link](https://github.com/NousResearch/hermes-agent/issues/122928) |
| 3 | **#155595** — Tracking: profile creation & lifecycle campaign | 10 / 0 | [link](https://github.com/NousResearch/hermes-agent/issues/155595) |
| 4 | **#143150** — "storage_unavailable" on session resume after multiplex migration | 9 / 0 | [link](https://github.com/NousResearch/hermes-agent/issues/143150) |
| 5 | **#144547 (CLOSED)** — lifecycle guard vs `hermes update` | 6 / 0 | [link](https://github.com/NousResearch/hermes-agent/issues/144547) |
| 6 | **#143065** — MiniMax Anthropic endpoint ignores thinking `budget_tokens` | 5 / **3** | [link](https://github.com/NousResearch/hermes-agent/issues/143065) |
| 7 | **#146973** — kanban false `timed_out` on already-`done` card | 5 / 0 | [link](https://github.com/NousResearch/hermes-agent/issues/146973) |
| 8 | **#55487** — WeCom adapter busy-loop pins 100% CPU | 5 / 0 | [link](https://github.com/NousResearch/hermes-agent/issues/55487) |

**Underlying needs analysis:**
- **The unified gateway migration is the single dominant pain point.** #143547 (73 comments) is functioning as the de-facto umbrella for post-merge fallout, and #143150 / #155955 / #156258 are all specific manifestations of the same root: **session ownership and profile multiplexing state are not being reconciled correctly between the gateway and Desktop.** Users want to resume sessions, switch profiles, and use bot chats without silent forking or 404s.
- **#122928 and #55487** represent long-tail, process/resource hygiene bugs (venv leakage, CPU spin) that erode trust in reliability rather than blocking work.
- **#143065** with 3 reactions signals provider-compatibility friction — users care that documented knobs (like `/reasoning`) actually do something on third-party Anthropic-compatible endpoints.

---

## 5. Bugs & Stability

Ranked by severity. **Fix PRs noted where they exist.**

### P1 — Critical
- **#143150** — Desktop shows `storage_unavailable` on session resume after multiplex migration due to unmigrated route in `state_meta` (`gateway.local_policy.v1`). *No fix PR in today's top list.* → [link](https://github.com/NousResearch/hermes-agent/issues/143150)

### P2 — High
- **#155955** — Bot Mode: first DM into a pre-gateway Bot Chat silently forks the chat (row renamed, hidden replacement minted, user's window freezes). → [link](https://github.com/NousResearch/hermes-agent/issues/155955)
- **#156258** — App re-selects app-managed local backend on refresh despite a remote Primary; non-default-profile chats 404. → [link](https://github.com/NousResearch/hermes-agent/issues/156258)
- **#55487** — WeCom adapter busy-loop pins ~99% CPU on websocket disconnect, freezing **all** platforms sharing the asyncio event loop. → [link](https://github.com/NousResearch/hermes-agent/issues/55487)
- **#122928** — macOS Desktop leaks superseded runtime venv via `PYTHONPATH` to terminal children after environment switch. → [link](https://github.com/NousResearch/hermes-agent/issues/122928)
- **#146973** — Kanban iteration-budget settlement writes a false `timed_out` event on an already-`done` card. → [link](https://github.com/NousResearch/hermes-agent/issues/146973)
- **#68263** — Smart approval `max_tokens=16` breaks on reasoning models; explicit caps silently dropped on OpenAI-compatible auxiliary routes. → [link](https://github.com/NousResearch/hermes-agent/issues/68263)
- **#146318 / #147720** — Profile-routed subagents keep parent's toolset; target profile's MCP servers, `disabled_toolsets`, and terminal policy ignored (security-adjacent: a terminal-off profile can still run shells). → [#146318](https://github.com/NousResearch/hermes-agent/issues/146318) · [#147720](https://github.com/NousResearch/hermes-agent/issues/147720)
- **#154965** — Curator consolidation archives source skill with no successor record; restore-by-name returns stale copy. → [link](https://github.com/NousResearch/hermes-agent/issues/154965)
- **#130676** — Moving a multiplex-served profile directory recreates an absent home during teardown. → [link](https://github.com/NousResearch/hermes-agent/issues/130676)
- **#154516** — Desktop "Read aloud" beeps with xAI TTS (24 kHz PCM not resampled to device rate). → [link](https://github.com/NousResearch/hermes-agent/issues/154516)
- **#156226** — `hermes skills audit` prints verdicts but never persists them; lockfile stuck at `scan_verdict: backfilled`. → [link](https://github.com/NousResearch/hermes-agent/issues/156226)
- **#156254** — Desktop drops post-turn `review.summary` due to inherited execution stamp. → [link](https://github.com/NousResearch/hermes-agent/issues/156254)
- **#156278** — Face swap on rented RunPod GPU never completes but reports unverified success; GPU keeps billing. → [link](https://github.com/NousResearch/hermes-agent/issues/156278)

### P3 — Medium
- **#156227** — Cron reports a crashed pre-run script as a provider failure and echoes script output into the alert. *Fix PR: #156108* ([link](https://github.com/NousResearch/hermes-agent/pull/156108)).
- **#156255** — `chat -q/-Q/--oneshot`: a notify process finishing mid-turn spawns a second model turn after client exit. → [link](https://github.com/NousResearch/hermes-agent/issues/156255)
- **#143577** — `~/.hermes/cache/uv/` grows to 1.0 GB outside every pruner; `hermes doctor` message is unactionable. → [link](https://github.com/NousResearch/hermes-agent/issues/143577)
- **#156244** — Injected "Current model" block names a model that never served any turn (deepseek-v4-pro on all-qwen session). → [link](https://github.com/NousResearch/hermes-agent/issues/156244)
- **#120858** — Anthropic OAuth: `chat_history_lookup` alias not reverse-mapped → `not_found`. *Fix PR: #120866* ([link](https://github.com/NousResearch/hermes-agent/pull/120866)).

### Closed / Resolved
- **#156236 (CLOSED)** — Mistral Large 4 list-shaped streaming `delta.content` crashed `"".join(content_parts)` and dropped tool calls. → [link](https://github.com/NousResearch/hermes-agent/issues/156236)

**Stability assessment:** No crashes reported today; the bulk are **state-consistency and resource-hygiene regressions tied to the gateway/profile migration**. Several have parallel fix PRs already in review (#156108, #120866, #156208 for shutdown bounding, #156098 for Windows cron interpreter).

---

## 6. Feature Requests & Roadmap Signals

Active feature requests and their likelihood of shipping next:

| Request | Signal Strength | Prediction |
|---|---|---|
| **#92424** — Path-scoped file access for profiles (restrict agent to folders) | 👍 1, 3 comments, tagged `needs-decision` | **Plausible near-term** — dovetails with the active profile-lifecycle campaign (#155595) and recurring profile-isolation bugs (#146318, #147720). Likely lands as part of a broader "profile sandboxing" workstream. |
| **#91505** — Least-privilege subagent escalation (scoped approval tokens) + deterministic agent-loop test harness | 3 comments, `needs-decision` | **Medium-term** — security-hardening themed; pairs with profile toolset-isolation fixes. |
| **#156124** — Safer background-review skill writes + first-class reviewer choice (model/fallback/profile) | 1 comment | **Early** — fits the curator/skills hardening thread (#154965). |
| **MCP/A2A/ACP protocol coverage** (#155971, #144019, #156312) | Multiple PRs in flight | **Imminent** — these are being actively landed; expect in the next minor/canary. |
| **Prompt cache keep-alive** (#122094) | Long-running PR since Sep | **Likely soon** — ready-to-merge quality, billing-sensitive. |

**Roadmap signal:** The strongest emergent theme is **profile isolation and least-privilege tooling** (path scoping, per-profile toolsets, scoped approval tokens). Combined with the profile-lifecycle tracker (#155595), this looks like the project's next consolidated feature arc after the gateway migration stabilizes.

---

## 7. User Feedback Summary

**Real pain points expressed:**
1. **Migration whiplash.** Users upgrading into the unified-gateway/multiplex era lose the ability to reliably resume sessions (#143150, #155955, #156258). One user (Bot Mode, #155955) describes a **frozen window** and silent chat forking — a trust-damaging UX failure.
2. **Provider-compatibility placebo knobs.** #143065: `/reasoning` is effectively a no-op on MiniMax's Anthropic endpoint; #68263: `max_tokens` caps silently dropped on OpenAI-compatible aux routes. Users feel the advertised configurability doesn't hold across providers.
3. **Unhelpful diagnostics.** #143577 — `hermes doctor` warns about a 1 GB cache "outside every pruner" but gives no remedy. Users explicitly call the message "incomprehensible."
4. **Isolation distrust.** Multi-profile users (#92424, #147720) report a terminal-disabled profile can still execute shell commands via delegation — a direct security concern in shared setups.
5. **Billing anxiety.** #156278 — a RunPod GPU billed indefinitely after a job silently failed and falsely reported success.

**Use cases in evidence:** multi-profile personal setups (main agent + a low-trust "assistant" agent), bot-mode DM intake, cron/monitor automation, plugin-mediated document/video tooling, and Desktop spoken-reply/voice conversation.

**Satisfaction tone:** Generally constructive — users are filing detailed, environment-rich reports (versions, HEADs, exact repro), which indicates an engaged, technically sophisticated community. Dissatisfaction concentrates on **trust-sensitive areas**: silent state mutations, false-success reports, and isolation boundaries.

---

## 8. Backlog Watch

Important items with low recent attention or long-open status that need maintainer focus:

- **#55487** — WeCom busy-loop pins 100% CPU (opened **2026-06-30**, ~4.5 months old). Still open, P2, affects all platforms sharing the event loop. → [link](https://github.com/NousResearch/hermes-agent/issues/55487)
- **#68263** — Smart approval `max_tokens=16` breaks reasoning models (opened **2026-07-20**, ~4 months). → [link](https://github.com/NousResearch/hermes-agent/issues/68263)
- **#120858** — Anthropic OAuth `chat_history_lookup` alias mapping (opened **2026-09-24**, ~2 months). *Has a pending fix PR #120866 but not yet merged.* → [link](https://github.com/NousResearch/hermes-agent/issues/120858)
- **#122928** — macOS venv `PYTHONPATH` leak (opened **2026-09-25**, ~2 months, 10 comments, no fix PR). → [link](https://github.com/NousResearch/hermes-agent/issues/122928)
- **#91505 / #92424** — Least-privilege escalation & path-scoped file access (opened **2026-08-21/22**, ~3 months, both `needs-decision`). High community value, awaiting direction. → [#91505](https://github.com/NousResearch/hermes-agent/issues/91505) · [#92424](https://github.com/NousResearch/hermes-agent/issues/92424)
- **#130676** — Multiplex profile-directory teardown recreating absent homes (opened **2026-10-01**). → [link](https://github.com/NousResearch/hermes-agent/issues/130676)
- **PR #81067 → #156312** — ACP protocol compatibility has been through a full salvage cycle; the 1.0 breakage means editor integrations were broken for ~a week. Worth prioritized review. → [#156312](https://github.com/NousResearch/hermes-agent/pull/156312)

**Maintainer action flag:** The **open-to-merged PR ratio (47:3 today)** combined with several multi-month-old regressions suggests review bandwidth — not contributor interest — is the project's primary constraint. A focused triage of the P2 backlog and the pending fix PRs (#120866, #156108, #156098, #156208) would meaningfully improve the stability narrative.

---

*Digest generated from GitHub activity for 2026-11-16. All links point to github.com/NousResearch/hermes-agent.*

</details>

<details>
<summary><strong>IronClaw</strong> — <a href="https://github.com/nearai/ironclaw">nearai/ironclaw</a></summary>

# IronClaw Project Digest — 2026-11-16

## 1. Today's Overview

IronClaw shows **low-to-moderate activity** in the last 24 hours: 3 issues updated (all open), 1 open PR, and no new releases. The dominant theme is **cost management and LLM provider reliability** — the high-priority USD budgeting epic (#2843) resurfaced with renewed attention, a pricing-accuracy fix (#8171) was opened directly in support of it, and two new QA/provider issues (#8172, #8173) highlight friction with local and registry-based LLM providers. No merges or closures occurred today, so the project's forward motion is currently gated on review of pending work. Overall health is stable but the open-PR backlog (especially #8171, which unblocks #2843) merits prompt maintainer attention.

## 2. Releases

No new releases in the last 24 hours. The latest referenced version in issue reports is **1.4.1** (hosted-staging / "crab shack").

## 3. Project Progress

- **No PRs were merged or closed today.**
- One PR remains open and is strategically important:
  - [#8171](https://github.com/nearai/ironclaw/pull/8171) — `fix(common): price models from the llm-prices table` — corrects several stale model prices (e.g., gpt-5.5 from $2/$8 → $5/$30; gpt-5.2-pro from $2/$8 → $21/$168; Opus 4.5/4.6 from $15/$75 → $5/$25; Haiku 4.5 from $0.80/$4 → $1/$5). The author explicitly notes this **unblocks the USD budget work in #2843**, making it a dependency for the cost-control roadmap.

## 4. Community Hot Topics

Activity today is issue-driven rather than discussion-driven (max 1 comment per item), but the most significant threads are:

- [#2843](https://github.com/nearai/ironclaw/issues/2843) — *Cost-based budgeting: replace iteration/time caps with USD budgets cascading user → project → mission → thread* — 1 comment, updated 2026-11-15. **Underlying need:** users want predictable, enforceable spend controls that map to organizational structure, rather than opaque iteration/time limits. This is the project's flagship cost-governance epic and is being actively revived.
- [#8172](https://github.com/nearai/ironclaw/issues/8172) — *[QA] Make `PRIMARY_MODEL_CALL_IDLE_TIMEOUT` configurable for slow local LLMs* — fresh QA bug from staging (v1.4.1). **Underlying need:** local/self-hosted inference users (Ollama) are being cut off by hardcoded watchdogs tuned for fast cloud models.
- [#8173](https://github.com/nearai/ironclaw/issues/8173) — *Support failover between registry providers (e.g. Ollama → Ollama)* — **Underlying need:** high-availability setups want provider-agnostic failover; currently `NEARAI_FALLBACK_MODEL` only works for the NEAR AI backend, and the fallback path hardcodes `NearAi...` construction.

## 5. Bugs & Stability

Ranked by severity:

1. **High — [#8172](https://github.com/nearai/ironclaw/issues/8172) [qa-bug]:** `PRIMARY_MODEL_CALL_IDLE_TIMEOUT` is not configurable, causing slow local LLM (Ollama) calls to be killed by the agent-loop idle watchdog. Reproducible on hosted-staging v1.4.1. **No fix PR yet.**
2. **Medium — [#8173](https://github.com/nearai/ironclaw/issues/8173):** Failover is effectively broken for registry providers — the fallback provider is always constructed as a NEAR AI provider regardless of configuration. **No fix PR yet.**
3. **Low — [#8171](https://github.com/nearai/ironclaw/pull/8171):** Not a runtime bug, but stale pricing data in `model_cost()` constitutes a correctness/data-accuracy issue with downstream impact on budget enforcement. **Fix PR is open.**

No crashes or regressions were reported today.

## 6. Feature Requests & Roadmap Signals

- **Cost-based USD budgeting (#2843)** is the strongest roadmap signal — it's an enhancement scoped across agent, DB, and config, and today's pricing PR (#8171) was explicitly framed as a prerequisite. Expect this to land in an upcoming minor release.
- **Provider-agnostic failover (#8173)** and **configurable idle timeouts (#8172)** are likely near-term candidates for a **1.4.x patch or 1.5** release, given they are small, targeted, and QA-flagged.
- The cascade model in #2843 (user → project → mission → thread → sub-thread) suggests future work on hierarchical budget enforcement and reporting.

## 7. User Feedback Summary

- **Pain point — cost opacity:** Users are hitting iteration/time caps that don't reflect real spend; demand for USD-denominated budgets is clear and organizational (multi-tenant, multi-project).
- **Pain point — local LLM support:** Ollama users face two distinct failures: hardcoded timeouts and broken fallback construction. This is a recurring theme for self-hosted deployments.
- **Pain point — stale pricing:** Reported prices diverging from provider reality (up to ~8× off for some models) undermines trust in any cost-tracking feature.
- **Satisfaction signals:** No negative sentiment on core functionality; feedback is constructive and feature-oriented, indicating an engaged and technically sophisticated user base.

## 8. Backlog Watch

- **[#2843](https://github.com/nearai/ironclaw/issues/2843)** — Open since 2026-04-22, only 1 comment despite being a high-risk, multi-scope enhancement. With a dependency PR now open (#8171), maintainers should prioritize review and add design feedback to keep the epic moving.
- **[#8171](https://github.com/nearai/ironclaw/pull/8171)** — Small but blocking; needs maintainer review/merge to unblock #2843.
- **[#8172](https://github.com/nearai/ironclaw/issues/8172)** and **[#8173](https://github.com/nearai/ironclaw/issues/8173)** — Fresh QA issues with no assignee or linked PR; both are low-effort fixes that should be triaged promptly to avoid aging into the backlog.

---
*Data source: github.com/nearai/ironclaw — snapshot for 2026-11-16. Activity level: low; attention recommended on pending PR #8171 and triage of #8172/#8173.*

</details>

<details>
<summary><strong>QwenPaw</strong> — <a href="https://github.com/agentscope-ai/QwenPaw">agentscope-ai/QwenPaw</a></summary>

# QwenPaw Project Digest — 2026-11-16

## 1. Today's Overview

QwenPaw is in an intense post-2.3.0 stabilization phase: 12 issues and 12 PRs were updated in the last 24h, but **zero PRs were merged or closed**, leaving all 12 open PRs in review limbo. The activity is heavily bug-driven — many reports are regressions introduced by the 2.3.0 release (Feishu channel, Console notifications, channel credential scoping), suggesting quality debt accumulated during the plugin externalization refactor (#8187). Encouragingly, community contributors have already submitted fix PRs for most of the newly reported bugs the same day they were filed, indicating a responsive contributor base. However, the absence of merges and releases today, combined with a growing open-PR backlog (~12), flags a **review/merge bottleneck** as the primary project-health risk.

## 2. Releases

None. No new releases in the last 24h (current stable: v2.3.0; `main` carries version `2.3.1b1`).

## 3. Project Progress

No PRs were merged or closed today. However, two issues were closed:

- **[CLOSED] #8361** — Duplicate `memory_search` calls in a single turn with Automatic Memory Search enabled, where interception blocked normal reply generation. Closed after 4 comments. [Link](https://github.com/agentscope-ai/QwenPaw/issues/8361)
- **[CLOSED] #8751** — Multi-user support request; closed with confirmation that QwenPaw remains single-user by design (auth router enforces one account). [Link](https://github.com/agentscope-ai/QwenPaw/issues/8751)

Net effect: no features advanced to main today; the visible progress is in issue triage and same-day fix PR submissions (see §5).

## 4. Community Hot Topics

| Item | Comments | Signal |
|---|---|---|
| [#8361](https://github.com/agentscope-ai/QwenPaw/issues/8361) — memory_search loop blocked replies (CLOSED) | 4 | Highest-engagement issue; core agent-loop reliability matters most to users |
| [#8747](https://github.com/agentscope-ai/QwenPaw/issues/8747) — Checkpoints nav entry missing in v2.3.0 console | 2 | UI regression tied to removed `core.agent-group` parentId; feature works but is undiscoverable |
| [#8736](https://github.com/agentscope-ai/QwenPaw/issues/8736) — Subagent completions trigger false "Reply completion" notifications | 2 | Notification noise in multi-agent workflows |
| [#8751](https://github.com/agentscope-ai/QwenPaw/issues/8751) — Multi-user support (CLOSED) | 2 | Strong latent demand; declined by design |
| [#8755](https://github.com/agentscope-ai/QwenPaw/issues/8755) + [PR #8756](https://github.com/agentscope-ai/QwenPaw/pull/8756) — Two WeChat accounts in one install | 1 + PR | Shared-install multi-agent use case is real and currently broken |

**Underlying needs:** Users are pushing QwenPaw toward *multi-agent, multi-channel, shared-installation* deployments (two WeChat bots, subagents, checkpoints). The 2.3.0 design (single-user auth, per-process credential scoping) is colliding with these expectations — a sign the product is outgrowing its single-user origin.

## 5. Bugs & Stability

Ranked by severity:

1. **Message-dropping / silent failure (critical)**
   - [#8746](https://github.com/agentscope-ai/QwenPaw/issues/8746) — Tasks submitted during background startup are silently swallowed: agent builds but never calls the LLM, no error logged. Model-agnostic (Console + Feishu, Windows 11). **No fix PR yet.**
   - [#8757](https://github.com/agentscope-ai/QwenPaw/issues/8757) — WeChat inbound polling silently dies: worker alive, health "healthy," zero errors, cursor never resets. **No fix PR yet.** This class of invisible failure is the most dangerous for production trust.

2. **Channel/credential correctness (high)**
   - [#8755](https://github.com/agentscope-ai/QwenPaw/issues/8755) — Upgrade duplicates WeChat credentials; only one of two agents can run. **Fix PR: [#8756](https://github.com/agentscope-ai/QwenPaw/pull/8756)** (scope credentials per agent workspace).
   - [#8748](https://github.com/agentscope-ai/QwenPaw/issues/8748) — Feishu reconnect supervisor exits permanently when disconnect cleanup raises; connection never recovers. **Fix PR: [#8749](https://github.com/agentscope-ai/QwenPaw/pull/8749)**.

3. **UX/data-display regressions (medium)**
   - [#8752](https://github.com/agentscope-ai/QwenPaw/issues/8752) — Feishu uploads percent-encoded non-ASCII filenames since 2.3.0 (`%E9%99%84%E4%BB%B6-…docx`) — a repeat of an older bug from #4600. **Fix PR: [#8753](https://github.com/agentscope-ai/QwenPaw/pull/8753)**.
   - [#8747](https://github.com/agentscope-ai/QwenPaw/issues/8747) — Checkpoints nav entry missing (parentId points to removed `core.agent-group`). Backend/route fine; pure navigation regression. **No fix PR yet.**
   - [#8736](https://github.com/agentscope-ai/QwenPaw/issues/8736) — Subagent completions raise false desktop notifications ("agent has finished a reply") while the user's turn is still running; confirmed still present on `main`. **Fix PR: [#8754](https://github.com/agentscope-ai/QwenPaw/pull/8754)**.
   - [#8630](https://github.com/agentscope-ai/QwenPaw/pull/8630) — Partial channel updates silently reset omitted fields (e.g., `enabled` turned off with no warning) — a stability-adjacent data-loss bug with a pending fix.

**Assessment:** The 2.3.0 Feishu/WeChat plugin externalization (#8187) introduced a cluster of channel-lifecycle regressions. Positively, ~4 of 6 channel bugs have same-day community fix PRs. The two silent-failure bugs (#8746, #8757) remain unfixed and deserve maintainer priority.

## 6. Feature Requests & Roadmap Signals

- **New web_search providers (likely candidate builds):** [#8758](https://github.com/agentscope-ai/QwenPaw/issues/8758) (Keenable) and [#8740](https://github.com/agentscope-ai/QwenPaw/issues/8740) (Olostep) — Olostep already has a PR: [#8741](https://github.com/agentscope-ai/QwenPaw/pull/8741). Low-risk, provider-plugin-pattern additions; plausible for a 2.3.x or 2.4 minor.
- **Italian UI locale:** [#8750](https://github.com/agentscope-ai/QwenPaw/issues/8750) — enterprise PoC (Italian aerospace) requesting i18n beyond zh/en. If i18n framework is extensible, this is a cheap win; likely tied to enterprise adoption.
- **Multi-user support:** [#8751](https://github.com/agentscope-ai/QwenPaw/issues/8751) — closed as by-design single-user, but the demand is structural (family/team shared installs). Watch for architectural pushback.
- **Console tool documentation drawer:** [PR #6325](https://github.com/agentscope-ai/QwenPaw/pull/6325) (since July) — built-in tool docs/parameters. Suggests a growing desire for in-product guidance as tool surface expands.
- **Model fallback transparency:** [PR #8628](https://github.com/agentscope-ai/QwenPaw/pull/8628) — expose `model_used`/fallback metadata in responses.

**Prediction:** Next patch likely bundles the same-day bug fixes (#8753, #8754, #8756, #8749) plus the Olostep provider (#8741); Italian locale and multi-user are longer-horizon.

## 7. User Feedback Summary

- **Pain points:**
  - Silent/undiagnosable failures (#8746, #8757) — users lose messages with no logs; the worst kind of trust erosion.
  - Multi-agent/credential sharing friction (#8755) — a shared desktop frontend with two WeChat bots is a genuine household/SMB pattern; upgrades broke it.
  - Notification noise from subagents (#8736) and undiscoverable features (#8747).
  - Regression fatigue: #8752 is a repeat of a previously fixed bug (#4600), which users explicitly called out.
- **Use cases observed:** family-shared installations with per-person agents and WeChat bots; enterprise PoCs (Italian aerospace, corporate deployment); Feishu/WeChat as primary channels; long-running background startup workflows.
- **Satisfaction signals:** Users are thorough in reports (versions, source paths, `main` verification) and submit fix PRs themselves — strong engagement. Dissatisfaction centers on 2.3.0 regressions and on multi-user being declined, suggesting some expectation gap with the roadmap.

## 8. Backlog Watch

Ageing or high-value items needing maintainer attention:

- **[PR #6325](https://github.com/agentscope-ai/QwenPaw/pull/6325)** (open since 2026-07-22, size/XL) — Console tool docs/parameters. Nearly 4 months unmerged; large PRs appear to be stalling.
- **[PR #7211](https://github.com/agentscope-ai/QwenPaw/pull/7211)** (open since 2026-08-21, size/L) — Prevent injected context from persisting. Refreshed 2026-11-15 against `main`, still awaiting human review.
- **[PR #8295](https://github.com/agentscope-ai/QwenPaw/pull/8295)** (open since 2026-10-17, size/M) — Hide internal scaffolding/system-notification bytes from users. Directly related to #7211; both touch the same display/persistence boundary.
- **[PR #8477](https://github.com/agentscope-ai/QwenPaw/pull/8477)** (open since 2026-10-28, size/L) — Skill install via rename instead of double copy (item 4 of #8013). Performance/cleanup, low risk, but stuck.
- **[Issue #8747](https://github.com/agentscope-ai/QwenPaw/issues/8747)** — Checkpoints nav regression still lacking a fix PR; small/quick but user-visible.

**Backlog health note:** Multiple large PRs (#6325, #7211, #8295, #8477) have been open for weeks-to-months with no merges today, reinforcing the **maintainer review bandwidth bottleneck** signaled in the overview. Clearing the ready-for-human-review queue (especially #7211 and #8295, which pair together) would meaningfully improve both velocity and code quality perception.

---

*Data source: github.com/agentscope-ai/QwenPaw activity snapshot for 2026-11-16. All links verified against provided dataset.*

</details>

<details>
<summary><strong>ZeroClaw</strong> — <a href="https://github.com/zeroclaw-labs/zeroclaw">zeroclaw-labs/zeroclaw</a></summary>

# ZeroClaw Project Digest — 2026-11-16

## 1. Today's Overview

ZeroClaw shows **high issue and PR churn with very low closure throughput** on 2026-11-16: 27 issues were updated (all still open, zero closed) and 50 PRs were touched (48 open, only 2 merged/closed), with no new releases. The issue tracker is dominated by **S1/S2 provider and runtime regressions** — notably cost accounting failures (#9816), context-window fallback logic (#12014), and Anthropic thinking-signature breakage (#12401) — suggesting the recent v0.9.0 line introduced meaningful instability. Activity is heavily concentrated around a single prolific contributor (CastelloBrancoTecnologia) driving large XL security/credential PRs, while several high-severity bugs sit with fix PRs unmerged. Overall health assessment: **active but congested** — strong community engagement and a clear security roadmap, but maintainer review bandwidth appears to be the bottleneck.

## 2. Releases

**No new releases in the last 24 hours.** No migration notes or breaking-change advisories to report.

## 3. Project Progress

Only **2 PRs were merged/closed** in the last 24h (identities not exposed in the dataset), so no headline features landed today. However, the pipeline shows substantial work in flight:

- **Scoped credential & secret management** — a coherent multi-PR effort is advancing: write-only plugin TLS credentials (#12402), scoped HTTP credentials (#12408), and task-owned SSH transports using scoped credentials (#12418), all building on the RFC in #12422.
- **Native Rust SSH task broker** (#12438) — replaces Python/tomli/cryptography dependencies while keeping OpenSSH as transport owner.
- **Browser voice for OIDC sessions** (#12459) extending paired-device voice settings (#12269).
- **Channel reliability fixes** — preserving completed tool results (#11911), progress reporting during long turns (#11874), and requiring message content for background `send_via` (#11859).
- **Runtime hygiene** — binding cached HTTP clients to their Tokio runtime (#12323), addressing #12236.

Net: features are *advancing but not landing*; the merge queue is stalled relative to creation rate.

## 4. Community Hot Topics

Ranked by comment count among recently updated items:

| Item | Comments | Link | Underlying Need |
|---|---|---|---|
| #12014 — Custom OpenAI-compatible provider assumes 32,000 context window | 6 | [Issue #12014](https://github.com/zeroclaw-labs/zeroclaw/issues/12014) | Users need **accurate model-capacity discovery**; silent fallbacks that reject valid turns erode trust in custom providers. |
| #9816 — Anthropic provider reports $0.00 spend, budget caps never fire | 6 | [Issue #9816](https://github.com/zeroclaw-labs/zeroclaw/issues/9816) | **Cost governance is broken** — operators cannot enforce spend limits, a compliance/security concern. |
| #12401 — `keep_tool_context_turns` breaks Claude Opus 5.5 with thinking-signature 400 | 5 | [Issue #12401](https://github.com/zeroclaw-labs/zeroclaw/issues/12401) | Multi-turn tool use with reasoning models is **core workflow**; context-collapse logic conflicts with Anthropic's signature requirements. |
| #8541 — Matrix thread/conversation-scoped history | 4 | [Issue #8541](https://github.com/zeroclaw-labs/zeroclaw/issues/8541) | Channel users want **conversation boundaries** matching native chat semantics. |
| #11138 — Caller tool-level approval in bounded delegation | 4 | [Issue #11138](https://github.com/zeroclaw-labs/zeroclaw/issues/11138) | **Security policy inheritance** across delegated agents — a governance gap. |

**Analysis:** The hot list reveals two dominant community concerns: (a) **provider fidelity** — context windows, cost, and reasoning-signature handling must match upstream semantics exactly; and (b) **security policy composition** — approvals, credentials, and delegation boundaries need a coherent model rather than per-feature patches.

## 5. Bugs & Stability

Ranked by severity (S0 highest):

**S0 — Security / Allowlist Bypass**
- **#12118** — `cmd.exe` dialect resolves bare commands from workspace first, so a workspace-written `git.bat` runs as allowlisted `git`. [Link](https://github.com/zeroclaw-labs/zeroclaw/issues/12118) — *No fix PR identified; critical sandbox escape vector.*

**S1 — Workflow Blocked**
- **#12014** — Context-window fallback to 32,000 rejects valid turns. [Link](https://github.com/zeroclaw-labs/zeroclaw/issues/12014)
- **#9816** — Anthropic cost always $0.00; budget caps inert. [Link](https://github.com/zeroclaw-labs/zeroclaw/issues/9816) *(status:in-progress)*
- **#12401** — Thinking-signature 400 after tool-context collapse. [Link](https://github.com/zeroclaw-labs/zeroclaw/issues/12401)
- **#10901** — Mattermost drops first DM message. [Link](https://github.com/zeroclaw-labs/zeroclaw/issues/10901)
- **#12477** — `cost.enforcement.mode` ignored; budget always stops turn even in "warn". [Link](https://github.com/zeroclaw-labs/zeroclaw/issues/12477) — *New today.*

**S2 — Degraded Behavior**
- **#10884** — Streaming 300s idle timeout not configurable. [Link](https://github.com/zeroclaw-labs/zeroclaw/issues/10884) *(in-progress)*
- **#7899** — OpenAI STT ignores env credentials. [Link](https://github.com/zeroclaw-labs/zeroclaw/issues/7899)
- **#12390** — Shell tool swallows stderr on non-zero exit. [Link](https://github.com/zeroclaw-labs/zeroclaw/issues/12390)
- **#12288** — "Discard all" retains drafts a later save persists. [Link](https://github.com/zeroclaw-labs/zeroclaw/issues/12288)
- **#12330** — zerocode silently falls back to local daemon on config parse error. [Link](https://github.com/zeroclaw-labs/zeroclaw/issues/12330)
- **#12289** — Disabled agents still run turns via operator chat/RPC. [Link](https://github.com/zeroclaw-labs/zeroclaw/issues/12289)
- **#12413 / #12412** — OpenCode Go context discovery fails; wrong model catalogue used. [Links](https://github.com/zeroclaw-labs/zeroclaw/issues/12413)
- **#12476** — Gateway logs every connection at INFO via `spawn!`, flooding traces. [Link](https://github.com/zeroclaw-labs/zeroclaw/issues/12476) — *New today.*

**S3 — Minor**
- **#12236** — Cached HTTP clients shared across test runtimes. [Link](https://github.com/zeroclaw-labs/zeroclaw/issues/12236) — *Fix PR #12323 open.*

**Notable:** No confirmed fix PRs are linked to the S0/S1 bugs, aside from #12236→#12323. This is a **stability red flag**.

## 6. Feature Requests & Roadmap Signals

Active feature requests, clustered by theme:

- **Credential & secret scoping:** #12373 (write-only WebUI credential management), #12422 (RFC: scoped operator-managed service credentials), #12447 (Wazuh tool with scoped credentials). Strongly aligned with the credential PR cluster (#12402, #12408, #12418).
- **Cost visibility:** #12353 (running estimated cost per conversation) — pairs with the broken cost ledger (#9816) and enforcement bug (#12477).
- **Identity propagation:** #12441 (deliver requesting user's identity to tool execution) — enables multi-user assistant deployments.
- **Web search defaults:** #12480 (decide default search provider and disclosure) — privacy/UX concern.
- **Channel semantics:** #8541 (Matrix thread-scoped history).
- **Delegation security:** #11138 (caller tool-level approval inheritance).

**Prediction for next version:** The **credential/secret scoping stack** is the most mature and cohesive; expect write-only credential management and scoped SSH/HTTP credentials to be the headline feature. The **cost ledger** is likely a must-fix given #9816 and #12477 both concern the same subsystem. Identity propagation (#12441) is foundational and may land early if adopted.

## 7. User Feedback Summary

**Pain points (dissatisfaction drivers):**
- **Trust in provider behavior:** Multiple users report silent fallbacks (32k context), silent zero-costs, and hard failures (thinking-signature 400). The common thread is *configuration not being honored* — the system substitutes defaults without loud warnings.
- **Cost governance gap:** Users explicitly cannot enforce budgets (#9816, #12477), undermining the "spending allowance" use case they are designing around.
- **Security posture:** The `git.bat` allowlist bypass (#12118) and disabled-agent execution (#12289) indicate that security invariants aren't enforced uniformly across entry points.
- **Diagnostics quality:** Shell tool swallowing stderr (#12390) and gateway INFO-log flooding (#12476) frustrate debugging.

**Satisfaction signals:** Contributors are actively proposing and building sophisticated security features (scoped credentials, task-owned SSH brokers), suggesting the project's architecture is extensible and the community trusts its direction — even as they hit stability walls.

## 8. Backlog Watch

Long-unanswered or slow-moving items warranting maintainer attention:

- **#8541** (created 2026-06-30) — Matrix thread-scoped history; 4.5 months old, status:parking-lot. [Link](https://github.com/zeroclaw-labs/zeroclaw/issues/8541)
- **#7899** (created 2026-06-17) — OpenAI STT env credentials; 5 months old, only 3 comments. [Link](https://github.com/zeroclaw-labs/zeroclaw/issues/7899)
- **#11138** (created 2026-09-26) — Delegation approval inheritance; security-relevant, accepted but unactioned. [Link](https://github.com/zeroclaw-labs/zeroclaw/issues/11138)
- **#9816** (created 2026-08-07) — Anthropic cost $0.00; 3+ months open despite p1 and in-progress. [Link](https://github.com/zeroclaw-labs/zeroclaw/issues/9816)
- **#11847** (PR, created 2026-10-19) — Native Rust XMPP with OMEMO; size:XL, `needs-maintainer-review`, high-risk. [Link](https://github.com/zeroclaw-labs/zeroclaw/pull/11847)
- **#11869 / #11868** (PRs, created 2026-10-19) — Task-owned SSH transport and repeated-call closeout; both size:XL awaiting review. [Links](https://github.com/zeroclaw-labs/zeroclaw/pull/11869)

**Maintainer bottleneck:** The XL PRs from CastelloBrancoTecnologia (SSH, XMPP, credentials) are consistently flagged `needs-maintainer-review` or `needs-author-action` and have been open for weeks. Combined with the ~48:2 open-to-merged ratio today, **review capacity — not contribution volume — is the limiting factor** on ZeroClaw's velocity.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*