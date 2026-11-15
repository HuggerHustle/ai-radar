# OpenClaw Ecosystem Digest 2026-11-15

> Issues: 395 | PRs: 500 | Projects covered: 5 | Generated: 2026-11-15 00:58 UTC

- [OpenClaw](https://github.com/openclaw/openclaw)
- [Hermes Agent](https://github.com/nousresearch/hermes-agent)
- [IronClaw](https://github.com/nearai/ironclaw)
- [QwenPaw](https://github.com/agentscope-ai/QwenPaw)
- [ZeroClaw](https://github.com/zeroclaw-labs/zeroclaw)

---

## OpenClaw Deep Dive

# OpenClaw Project Digest — 2026-11-15

## 1. Today's Overview

OpenClaw shows very high throughput today with **395 issues** and **500 PRs** updated in the last 24 hours, alongside the release of **v2026.11.5-beta.3**. Activity is skewed toward maintenance rather than net closure: only 65 of 395 issues were closed and 160 of 500 PRs were merged/closed, leaving 330 active issues and 340 open PRs. The single beta release focuses narrowly on **large-session reliability** (memory pressure in transcript indexing, trimming, and compaction), which aligns with a cluster of high-severity session-state, memory, and prompt-cache issues dominating the day's discussion. Overall, the project is in a **high-activity, high-backlog-pressure** state: strong contributor engagement, but a growing queue of P0/P1 session-state and update-reliability bugs that are not yet converging.

## 2. Releases

**v2026.11.5-beta.3** — `openclaw 2026.11.5-beta.3`

- **Highlights:** Large-session reliability — reduced memory pressure during transcript indexing, trimming, and compaction; streaming only selected hydration payloads; honoring configurable summary limits. (#194099, #194066, #194536, #196207) — thanks @vincentkoc, @aniruddhaadak80.
- **Breaking changes / migration notes:** None stated in the release notes. This is a beta patch release; no schema or config migration is documented.
- **Context:** The release-waiver PR [#198442](https://github.com/openclaw/openclaw/pull/198442) indicates Kova CPU, latency, and RSS performance failures for beta.3 were deliberately waived by the release owner — worth noting for anyone evaluating beta stability.

## 3. Project Progress

Merged/closed PRs today (160 total; notable items):

- [#199313](https://github.com/openclaw/openclaw/pull/199313) — `fix(ui)`: triple-click selection now includes titled session links (UX polish).
- [#198659](https://github.com/openclaw/openclaw/pull/198659) — `fix(backup)`: prevents concurrent cleanup from interrupting backup verification.
- [#199283](https://github.com/openclaw/openclaw/pull/199283) — `fix(agents)`: `sessions_yield` now awaits wake-armed background commands in one-shot runs.
- [#195669](https://github.com/openclaw/openclaw/pull/195669) — `fix(android)`: releases stale camera Activity after destruction.
- [#199331](https://github.com/openclaw/openclaw/pull/199331) — `fix(ci)`: bounds hosted main command test groups (CI health).
- [#199332](https://github.com/openclaw/openclaw/pull/199332) — `fix(ui)`: removes duplicate plugin apps from the Apps directory.

**Direction:** Today's merges are predominantly *correctness and lifecycle hygiene* fixes — UI selection, backup/restore concurrency, background-command wake semantics, and CI test bounding — rather than major feature landings. Several large PRs remain open and "needs proof," including sessions/transcript work ([#198929](https://github.com/openclaw/openclaw/pull/198929)) and Claude turn retention ([#160325](https://github.com/openclaw/openclaw/pull/160325)).

## 4. Community Hot Topics

Most-discussed issues (by comment count):

1. [#172837](https://github.com/openclaw/openclaw/issues/172837) [CLOSED] — Codex `nativeSubagentAssignments` never removed after completion delivery gives up; every new parent thread re-pins and re-sends them (20 comments). *Underlying need: subagent lifecycle bookkeeping must be idempotent and self-cleaning to prevent duplicate work.*
2. [#44309](https://github.com/openclaw/openclaw/issues/44309) [CLOSED] — Feature: one-way A2A dispatch mode without reply-back ping-pong (18 comments). *Need: simpler agent-to-agent handoff semantics for fire-and-forget tasking.*
3. [#143017](https://github.com/openclaw/openclaw/issues/143017) [OPEN] — Prompt-cache: five ways a persistent session rewrites its prefix; 21.3M cache-write tokens measured (16 comments). *Need: cost control — persistent sessions must not invalidate reusable prefixes.*
4. [#162585](https://github.com/openclaw/openclaw/issues/162585) [OPEN] — Windows plugin source-capture staging re-materializes the plugin's own package and never converges (npm trees 290 MB → 612 MB+/24 min) (16 comments). *Need: deterministic, bounded plugin staging on Windows.*
5. [#163739](https://github.com/openclaw/openclaw/issues/163739) [OPEN] — Feature: make Control UI `Ctrl+Shift+A` archive shortcut configurable (15 comments). *Need: keyboard-shortcut conflict avoidance in the web UI.*
6. [#192632](https://github.com/openclaw/openclaw/issues/192632) [OPEN] — Feature: Claude web search provider via server-side `web_search` (15 comments). *Need: parity with Gemini/Perplexity providers for Anthropic-only installs.*

**Pattern:** The hottest threads cluster around three themes — **cost/prompt-cache efficiency**, **Windows plugin/update reliability**, and **provider/UI parity features**. Prompt-cache prefix invalidation recurs across multiple issues (#143017, #182891, #177506), suggesting a systemic rather than isolated problem.

## 5. Bugs & Stability

Highest-severity open bugs updated today:

| Severity | Issue | Summary | Fix PR? |
|---|---|---|---|
| **P0** | [#193094](https://github.com/openclaw/openclaw/issues/193094) | Managed update hangs in `validating` for 57 min (3414 s vs 1800 s budget), then SIGKILLed | No |
| **P0** | [#194664](https://github.com/openclaw/openclaw/issues/194664) | Codex protected continuation blocks all follow-ups while session Stop reports no active run (2026.11.1) | No |
| **P0** | [#161800](https://github.com/openclaw/openclaw/issues/161800) | iOS embedded Dashboard creates new browser device identity on every page load → pairing-request loop | No |
| **P1** | [#196199](https://github.com/openclaw/openclaw/issues/196199) | Regression since 2026.10.10: native Codex helper completions fail to resume parent, pausing goals | No |
| **P1** | [#196656](https://github.com/openclaw/openclaw/issues/196656) | Subagent runs/completions unreliable on 2026.11.1 (Windows): announce to archived requester fails, no retry | No |
| **P1** | [#194403](https://github.com/openclaw/openclaw/issues/194403) | Helper-completion continuations invalidate their own authority, blocking conversations | No |
| **P1** | [#128140](https://github.com/openclaw/openclaw/issues/128140) | `memory_search` always times out (15 s) while CLI `memory search` works | No |
| **P1** | [#196820](https://github.com/openclaw/openclaw/issues/196820) | Control UI locks at ~100% CPU in `Element.getAnimations()` loop (macOS WebContent and Edge) | No |
| **P1** | [#84662](https://github.com/openclaw/openclaw/issues/84662) | Codex app-server stores per-turn runtime context in native history → runaway `response.create` input growth | No |

**Stability assessment:** The dominant risk category today is **native Codex / subagent completion and continuation reliability** (#196199, #196656, #194403, #194664, #172837), compounded by **update/rollback fragility** (#193094, #197083, #183479). Prompt-cache and memory-search inefficiencies (#182891, #143017, #136405, #180978) are chronic rather than new. Critically, **none of the P0/P1 items listed have a merged fix PR**; several carry `clawsweeper:no-new-fix-pr` and `needs-maintainer-review` labels.

## 6. Feature Requests & Roadmap Signals

Active feature requests (most recent/active):

- [#192632](https://github.com/openclaw/openclaw/issues/192632) — **Claude web search provider** (Anthropic server-side `web_search`). Strong candidate for an upcoming beta given its diamond-lobster rating and provider-parity framing.
- [#163739](https://github.com/openclaw/openclaw/issues/163739) — **Configurable Control UI archive shortcut** (`Ctrl+Shift+A` collision). Small, well-scoped UX fix; plausible for a near-term patch.
- [#140213](https://github.com/openclaw/openclaw/issues/140213) — **Multiple policy aliases resolving to one configured model**. Auth-provider impact; has maintainer decision packet attached.
- [#178373](https://github.com/openclaw/openclaw/issues/178373) — **Run-level turn/token budget + default-on tool-loop detection**. Cost-safety feature; aligns with the 11.5.x reliability theme.
- [#179954](https://github.com/openclaw/openclaw/issues/179954) — **Configurable per-entry chunking paths for memory files**. Directly related to memory-core work in beta.3.
- [#166678](https://github.com/openclaw/openclaw/issues/166678) — **Hide agents from picker while keeping them spawnable** (multi-agent orgs).
- [#56349](https://github.com/openclaw/openclaw/issues/56349) — **Unbypassable outbound policy enforcement** (security; flagged needs-security-review).

**Prediction:** Given the v2026.11.5-beta.3 focus, the next beta is likely to extend session/memory work — possibly per-entry chunking (#179954) and run-level budgets/loop detection (#178373) — while #192632 (Claude web search) is a strong candidate once provider review clears.

## 7. User Feedback Summary

**Pain points:**

- **Cost visibility and cache waste:** Multiple production-traffic reports quantify token loss from prefix rewrites (#143017: 21.3M cache-write tokens; #182891: `cache read dropped N -> 0`; #177506: ~16.7M tokens dropped in one evening). Users are measuring real spend impact.
- **Update / rollback anxiety:** Users report managed updates hanging (#193094) or leaving partially finalized states after Doctor WAL verification failures (#197083, #183479), eroding trust in the updater.
- **Subagent/Codex reliability:** Repeated "helper launched but parent never resumed" reports (#196199, #194403, #196656) — described as "once for every helper launched" — block ongoing work.
- **Memory search timeouts:** Consistent 15 s failures in the tool path while the CLI works (#128140, #136405), with circuit breakers that never open at chat pace (#180978).
- **Platform gaps:** Windows plugin staging ballooning (#162585), Windows CLI multiline-argument truncation (#158817), macOS dark-theme Settings and sluggishness (#192667).

**Use cases:** Multi-agent organizations (15-agent orgs, A2A handoffs), WhatsApp/Telegram/Mattermost-facing agents, self-hosted Podman/Quadlet deployments on ARM64, and Teams/iMessage integrations.

**Satisfaction signals:** Users are deeply invested — providing wire-captured reproductions, SQLite schema dumps, and measured token counts. However, the volume of "stale," "needs-maintainer-review," and "needs-product-decision" labels signals **maintainer attention is the bottleneck**, not user reporting quality.

## 8. Backlog Watch

Long-running, high-impact items needing maintainer attention:

- [#84662](https://github.com/openclaw/openclaw/issues/84662) — Codex per-turn runtime context bloats native history (open since 2026-05-20; P1; diamond lobster). Aging ~6 months.
- [#44309](https://github.com/openclaw/openclaw/issues/44309) — A2A one-way dispatch mode (open since 2026-03-12; now closed after 18 comments; product-decision dependent).
- [#56349](https://github.com/openclaw/openclaw/issues/56349) — Unbypassable outbound policy enforcement (open since 2026-03-28; security-sensitive; awaiting security review and live repro).
- [#143017](https://github.com/openclaw/openclaw/issues/143017) — Prompt-cache prefix rewrite audit (open since 2026-09-09; awaiting live repro despite extensive production data).
- [#127195](https://github.com/openclaw/openclaw/issues/127195) — 16 call sites emit identical "changed while starting work" error with no reason code (open since 2026-08-21; blocks triage of multiple other issues).
- [#160719](https://github.com/openclaw/openclaw/issues/160719) — Orphaned `session_windows` rows unrecoverable by CLI, doctor, or reaper (open since 2026-09-28).
- PR [#160325](https://github.com/openclaw/openclaw/pull/160325) — `fix(agents)`: keep finished Claude turn that outgrew stream budget (open since 2026-09-28; P1; `needs proof`; merge-risk on message-delivery).
- PR [#141004](https://github.com/openclaw/openclaw/pull/141004) — `feat(audit)`: record observed runtime skill usage (open since 2026-09-07; XL; `needs proof`).

**Watch recommendation:** The lack of reason codes in session-start errors (#127195) is a *meta-blocker* — it prevents root-causing several P1 session-state and cron issues (#160494, #160719). Prioritizing that single diagnostic improvement could unblock a disproportionate share of the backlog.

---

*Data source: github.com/openclaw/openclaw — reporting window 2026-11-14 to 2026-11-15. Counts reflect items updated within the last 24 hours.*

---

## Cross-Ecosystem Comparison

# Cross-Project Comparison Report — Personal AI Assistant / Agent Open-Source Ecosystem
**Reporting window: 2026-11-15** | Projects: OpenClaw, Hermes Agent, IronClaw, QwenPaw, ZeroClaw

---

## 1. Ecosystem Overview

The personal AI assistant / agent open-source landscape is in a **hardening phase**, not a feature-expansion phase. Across all active projects, the dominant engineering energy has shifted from net-new capabilities toward **session-state reliability, prompt-cache cost control, provider-compatibility robustness, credential/secrets isolation, and multi-worker orchestration integrity**. Four of five projects are simultaneously fighting the same classes of silent-failure bugs (stuck sessions, dropped subagent completions, provider 400s, cache-prefix invalidation), suggesting convergent architectural pressure from production multi-channel, multi-agent deployments. Meanwhile, contribution volume is outpacing maintainer review capacity in every project observed — a systemic bottleneck, not a per-project anomaly.

---

## 2. Activity Comparison

| Project | Issues (24h) | PRs (24h) | Merge/Close Rate | Release Status | Health Score* | Primary Bottleneck |
|---|---|---|---|---|---|---|
| **OpenClaw** | 395 (65 closed) | 500 (160 merged/closed) | 32% | `v2026.11.5-beta.3` (beta, perf-waiver) | **7.0 / 10** | P0/P1 session-state bugs with no fix PR; maintainer review |
| **Hermes Agent** | 50 (15 closed) | 50 (20 merged/closed) | 40% | `v0.23.1+canary` (pre-release) | **7.5 / 10** | P1 orchestration reliability; review lag on in-flight features |
| **IronClaw** | 0 | 0 | — | None | **N/A** | Dormant (no activity observed) |
| **QwenPaw** | 15 (5 closed) | 15 (1 merged/closed) | **7% (merge)** | None (`2.3.0` stable; `2.3.1b1` on main) | **7.5 / 10** | PR merge queue; silent-failure bug class |
| **ZeroClaw** | 11 (1 closed) | 50 (1 merged/closed) | **2% (merge)** | None (v0.8.5 reference) | **5.5 / 10** | Severe review bottleneck; XL security PRs stalled |

\*Health score is a qualitative composite of throughput, merge cadence, severity of unresolved bugs, and backlog drain rate. It reflects *stability trajectory*, not popularity.

**Reading the table:** OpenClaw and Hermes are *throughput-rich with functional merge pipelines*; ZeroClaw and QwenPaw are *contribution-rich but merge-constrained*. ZeroClaw is the outlier — 50 PRs updated, 1 merged — a clear review-capacity crisis.

---

## 3. OpenClaw's Position

**Advantages vs. peers:**
- **Scale of engagement:** 395 issues / 500 PRs in 24h is an order of magnitude above every peer (next highest is Hermes/ZeroClaw at ~50). This delivers a denser bug-discovery surface and faster reproduction of edge cases.
- **Release discipline:** The only project shipping a tagged beta (`2026.11.5-beta.3`) with an explicit reliability theme (large-session memory pressure). Peers are on canary or stable-with-no-release.
- **Breadth of integrations:** WhatsApp/Telegram/Mattermost/Teams/iMessage plus mobile (iOS embedded Dashboard, Android camera lifecycle) — the widest channel footprint in the cohort.

**Technical approach differences:**
- OpenClaw runs a **heavyweight session/transcript/compaction pipeline** — the source of both its cost-control leadership and its chronic prompt-cache bugs (#143017: 21.3M cache-write tokens measured). Peers (QwenPaw, ZeroClaw) have *shallower* session models, hence fewer cache bugs but less cost-optimization ambition.
- It maintains a **native Codex app-server integration layer** with its own continuation/authority semantics (#196199, #194403, #194664) — a bespoke complexity Hermes handles more simply via HTTP-compat.

**Community size comparison (inferred from 24h signals):** OpenClaw ≈ **8–10× Hermes/ZeroClaw**, ≈ **25× QwenPaw**. However, OpenClaw's `needs-maintainer-review` / `needs-product-decision` label density indicates its **maintainer-to-contributor ratio is the weakest in the cohort** — scale has not translated into proportional triage capacity.

**Net position:** OpenClaw is the **ecosystem's reference implementation** and the most feature-complete, but its lead is narrowest precisely where peers are strongest: update/rollback trust and session-state correctness.

---

## 4. Shared Technical Focus Areas

Four requirement clusters are emerging **independently across multiple projects** — a strong signal these are ecosystem-level, not project-specific, gaps.

| Shared Need | Projects Affected | Specific Evidence |
|---|---|---|
| **Session/orchestration state loss under concurrency** | OpenClaw, Hermes, QwenPaw, ZeroClaw | OpenClaw #196656 (subagent announce fails); Hermes #145022 (gateway stall kills 4 workers), #147839, #148002; QwenPaw #7534, #6608; ZeroClaw #12425 ("loses control") |
| **Silent provider failure / non-retryable errors** | QwenPaw, Hermes, OpenClaw, ZeroClaw | QwenPaw #8711 (empty-stream EOF with HTTP 200), #8735 fix; Hermes #148898 (Codex zstd 400); OpenClaw native Codex failures; ZeroClaw #12425 (QQ timeout) |
| **Prompt-cache / token-cost efficiency** | OpenClaw (strongest), ZeroClaw | OpenClaw #143017, #182891, #177506 (16.7M tokens dropped in one evening); ZeroClaw #12421 (cron loses prompt-cache affinity) |
| **Credential / secrets isolation outside model context** | ZeroClaw (strongest), Hermes | ZeroClaw #12373, #12422, #12402, #12408 (scoped operator-managed credentials); Hermes sec-marathon: #155249 (trust-source spoofing), #155396 (auth.json 0644 window) |
| **Config honesty / inert config keys** | ZeroClaw, Hermes, QwenPaw | ZeroClaw #10781, #12396 (dead `context_compression.*` keys); Hermes #135032 (`plugins.scan_on_install` doesn't exist); QwenPaw #7408 (Feishu config silently wiped) |
| **Update/rollback trust** | OpenClaw, Hermes, ZeroClaw | OpenClaw #193094 (update hangs 57 min), #197083, #183479; Hermes #135306 (duplicate uv workspace members); ZeroClaw #127044 (PortableGit 404) |
| **Channel parity (feature gaps across entry points)** | OpenClaw, ZeroClaw, QwenPaw | OpenClaw #192632 (Claude web search parity); ZeroClaw #11332 (skill learning only on CLI), #11713 (Telegram edited_message); QwenPaw #7608 (DingTalk cards) |

**Key insight for decision-makers:** *No single project has solved any of these clusters completely.* A team choosing a base today should evaluate which unsolved cluster is most tolerable for their deployment — not which project is "most complete."

---

## 5. Differentiation Analysis

| Dimension | OpenClaw | Hermes Agent | QwenPaw | ZeroClaw |
|---|---|---|---|---|
| **Feature focus** | Broad multi-channel + native Codex + session/transcript pipeline | Gateway/Kanban multi-worker orchestration + security hardening | Feishu/cron reliability + Console polish + provider presets | Security-first runtime: SSH broker, WASM plugins, sandbox, secrets |
| **Target users** | Power users, multi-agent orgs, multi-channel operators | Multi-worker/multi-profile production deployers | Chinese-market channel users (Feishu, DingTalk, QQ), desktop/mobile | Security-conscious operators, multi-tenant RPC deployments |
| **Technical architecture** | Heavyweight; native Codex app-server; deep compaction | Orchestration-centric; gateway-owned goals; multi-profile | Channel-adapter model; Console + PawApp mobile | Rust-native; sandboxed (Seatbelt), WASM plugin wake dispatch, SSH broker |
| **Language/stack signal** | JS/TS-heavy (UI, Android, CI) | Mixed (Python/Docker, Desktop DMG) | Python + Console frontend + mobile | **Rust-native end-to-end** |
| **Security posture** | Feature velocity prioritized | Active `sec-marathon` hardening | Correctness-focused | **Security is the roadmap** (RFCs, scoped credentials, OMEMO/XMPP) |
| **Distinctive capability** | Session compaction at scale; A2A dispatch | Kanban worker orchestration; gateway goal resumption | CJK/Chinese-market channel depth | Multi-model-per-provider; native Rust XMPP + OMEMO |

**Architectural takeaway:** ZeroClaw is the *only* project where security architecture is the primary product differentiator rather than a hardening track — making it the natural choice for regulated or multi-tenant environments. OpenClaw optimizes for **breadth and session sophistication**; Hermes for **orchestration concurrency**; QwenPaw for **regional channel depth**.

---

## 6. Community Momentum & Maturity

**Activity tiers:**

- **Tier 1 — High-velocity, merge-functional:** *OpenClaw* (reference scale), *Hermes Agent* (balanced 40% close rate, security marathons closing debt).
- **Tier 2 — Contribution-rich, merge-constrained:** *ZeroClaw* (2% merge rate — **critical**), *QwenPaw* (7% merge rate — concerning).
- **Tier 3 — Dormant:** *IronClaw* (no observed activity).

**Rapid iteration:** OpenClaw and Hermes are iterating fastest on capability and correctness simultaneously. Hermes shows the healthiest *pattern* — high closures (security debt clearing) alongside in-flight features.

**Stabilization signals:** QwenPaw's closure of long-standing session bugs (#7534, #6608, #7408) plus merge of the watchdog PR #4411 (#4411) indicates it is *catching up on reliability debt* — a stabilizing project. ZeroClaw is the opposite: accumulating high-risk XL PRs faster than it merges, which is a **destabilizing trajectory** despite strong contribution intent.

**Maturity assessment:**
| Project | Triage Maturity | Contributor Maturity | Release Maturity |
|---|---|---|---|
| OpenClaw | Low (label backlog) | High | High (beta cadence) |
| Hermes | **High** (sec-marathon tagging, ci-reviewed) | High | Medium (canary) |
| QwenPaw | Medium | High (fast fix PRs) | Medium |
| ZeroClaw | **Low** (review bottleneck) | High (detailed RFCs) | Low (no recent release) |

**Notable pattern:** *Hermes is the most mature operationally* despite being smaller than OpenClaw — its contributor-to-maintainer loop is closing, not widening. OpenClaw's scale is a double-edged sword: more input, equally strained output.

---

## 7. Trend Signals

Extracted from cross-project community feedback — actionable for AI agent developers:

1. **Silent failure is the #1 trust killer.** Every project reports bugs where the agent fails *without erroring* (empty streams, stuck consumers, wiped configs, dropped subagents). **Action:** build observability into the agent loop itself — reason codes (OpenClaw #127195 is a meta-blocker), watchdog timeouts (QwenPaw #4411), and explicit failure surfacing. This is the highest-leverage reliability investment across the ecosystem.

2. **Prompt-cache economics are now a first-class feature, not an optimization.** OpenClaw users measure token loss in the millions. **Action:** treat prefix stability as an architectural constraint; cron/async paths must preserve session-key affinity (ZeroClaw #12421).

3. **Provider schema brittleness is universal.** Strict OpenAI-compatible endpoints break agents across every project (QwenPaw, Hermes, OpenClaw). **Action:** design request-shaping as a *negotiation layer* with field-rejection learning, not a fixed contract.

4. **Credentials must not enter model context.** ZeroClaw's RFC suite (#12373, #12422) and Hermes' sec-marathon both converge on **scoped, operator-mediated, write-only credential access**. **Action:** plan for secrets-as-tools, not secrets-in-prompts — this is becoming table stakes for production adoption.

5. **Channel parity is an expectation, not a nice-to-have.** Users running multi-channel deployments expect identical behavior (skill learning, edited-message handling, card interactivity) across CLI, Telegram, Feishu, DingTalk. **Action:** unify the agent loop across entry points; channel-specific behavior should be adapter-only.

6. **Review capacity is the ecosystem's scarcest resource.** ZeroClaw (2% merge), QwenPaw (7%), and OpenClaw's label backlog all point to maintainer triage as the binding constraint. **Action:** for contributors — submit smaller, self-contained PRs with proof; for adopters — favor projects with proven merge cadence (Hermes pattern) when stability matters more than feature breadth.

7. **Update/rollback trust is under-built.** Managed update hangs (OpenClaw #193094) and partial-finalization states erode confidence more than feature gaps. **Action:** treat the updater as a transactional system with verification gates — this is an underserved differentiator.

---

**Bottom line for decision-makers:** OpenClaw is the ecosystem's feature leader but carries the widest unpatched P0/P1 surface. Hermes is the operational maturity benchmark. QwenPaw is stabilizing with strong regional fit. ZeroClaw is the security-architecture specialist but is throttled by a review bottleneck that endangers its roadmap. IronClaw is dormant. **Choose on the basis of which shared unsolved cluster (session state, provider compat, secrets, or cache cost) your deployment can least tolerate — not on raw activity volume.**

---

## Peer Project Reports

<details>
<summary><strong>Hermes Agent</strong> — <a href="https://github.com/nousresearch/hermes-agent">nousresearch/hermes-agent</a></summary>

# Hermes Agent — Project Digest
**Date: 2026-11-15** | Source: [github.com/nousresearch/hermes-agent](https://github.com/nousresearch/hermes-agent)

---

## 1. Today's Overview

Hermes Agent shows **high-velocity activity** today: 50 issues and 50 PRs updated in the last 24h, with a healthy merge cadence (20 PRs merged/closed vs. 30 open) and a new canary build shipped. The issue mix skews toward **open/active** (35 of 50), and a large share of the day's traffic is concentrated in the **session state, gateway/kanban orchestration, and provider-compatibility** surfaces — indicating the project is deep in hardening the multi-worker and multi-profile execution paths introduced around v0.23.x. Notably, several long-lived security/hardening issues (#127044, #139327, #7485, #117815, #143691, #128930, #144380) closed today, suggesting an active security cleanup "marathon" (tagged `sec-marathon-2026-11-13`). At the same time, a cluster of **P1/P2 session-state and kanban reliability bugs** remain open with high comment counts, which is the clearest risk to perceived stability. Overall: **healthy throughput, but reliability debt concentrated in the orchestration/session layer.**

---

## 2. Releases

**New release: `v0.23.1+canary.20261114T064334Z`** — [release page](https://github.com/NousResearch/hermes-agent/releases)
- Type: **canary / pre-release** build (not a stable channel release).
- Release date: 2026-11-14; surfaced in digest 2026-11-15.
- Contents: Standard canary artifact with **Hermes Desktop** downloads (macOS Apple Silicon DMG listed; other platform rows truncated in the source data). No changelog body beyond the build table was provided.
- **Breaking changes / migration notes:** None stated in the release metadata. As a canary, it is expected to track `main`-adjacent work and should **not** be treated as a migration target for production installs.

> Note: The digest data does not include a stable-channel changelog today, so no user-facing migration guidance can be derived. Treat this as a build artifact, not a feature release.

---

## 3. Project Progress

Today's **merged/closed PRs (20)** and **closed issues (15)** reflect a consolidation push across security hardening, provider reliability, and install/update correctness. Highlights visible in the data:

**Security & hardening (closed today):**
- [#155249](https://github.com/NousResearch/hermes-agent/pull/155249) — *fix(skills): derive install trust from the serving adapter, not identifiers* (closed; `ci-reviewed`, `sec-marathon-2026-11-13`). Closes a trust-source spoofing vector in skills install.
- [#155396](https://github.com/NousResearch/hermes-agent/pull/155396) — *fix(docker): seed auth.json owner-only from the first instant* (closed). Removes a 0644 window on `auth.json` during container bootstrap.
- [#155827](https://github.com/NousResearch/hermes-agent/pull/155827) — *fix(skills): name the upstream repo for live-upstream optional skills* (closed). Closes a misleading-trust-labeling gap in the install UI.

**Closed issues resolving prior security/robustness debt:**
- [#127044](https://github.com/NousResearch/hermes-agent/issues/127044) — PortableGit `.windows.1` filename 404 (Windows install/update).
- [#139327](https://github.com/NousResearch/hermes-agent/issues/139327) — world-writable uv cache lock files baked into the image.
- [#7485](https://github.com/NousResearch/hermes-agent/issues/7485) — ReDoS risk in dangerous-command regex.
- [#117815](https://github.com/NousResearch/hermes-agent/issues/117815) — approval/redaction granularity hardening.
- [#143691](https://github.com/NousResearch/hermes-agent/issues/143691) — runtime self-delete floor resolving relative paths against agent cwd.
- [#144380](https://github.com/NousResearch/hermes-agent/issues/144380) — MCP trust gate reading a cached `readOnlyHint`.
- [#128930](https://github.com/NousResearch/hermes-agent/issues/128930) — `history-check` merge-base never rejecting.
- [#136486](https://github.com/NousResearch/hermes-agent/issues/136486) — replayed `reasoning` alias causing HTTP 400 (20 comments, closed).

**Feature/plugin catalog intake advancing (open PRs under review):**
- [#155604](https://github.com/NousResearch/hermes-agent/pull/155604), [#154027](https://github.com/NousResearch/hermes-agent/pull/154027), [#155916](https://github.com/NousResearch/hermes-agent/pull/155916), plus a batch of MCP "configuration-only" catalog entries ([#155911–#155915](https://github.com/NousResearch/hermes-agent/pull/155911)) — the plugin ecosystem is growing steadily.

**Net assessment:** the day's merges were dominated by **security hardening and catalog growth**, not headline features. Feature work (gateway goal resumption [#154902](https://github.com/NousResearch/hermes-agent/pull/154902), tool-result sanitization [#155391](https://github.com/NousResearch/hermes-agent/pull/155391), retry semantics [#155395](https://github.com/NousResearch/hermes-agent/pull/155395)) is **in flight but not yet merged**.

---

## 4. Community Hot Topics

Ranked by comment activity:

| Rank | Item | Comments | Signal |
|---|---|---|---|
| 1 | [#145022](https://github.com/NousResearch/hermes-agent/issues/145022) — Kanban workers crash `"Kanban execution unknown; retained by owner"` on gateway stall (**P1**) | 23 | Highest-engagement issue; a single gateway stall killed 4 workers in one incident. |
| 2 | [#136486](https://github.com/NousResearch/hermes-agent/issues/136486) — `reasoning` alias duplicate-field HTTP 400; field-rejection learning never fires (**CLOSED**, P1) | 20 | Now resolved; was a systemic fallback-loop bug. |
| 3 | [#148898](https://github.com/NousResearch/hermes-agent/issues/148898) — Codex backend HTTP 400 for zstd-compressed `/responses` bodies (P2) | 12 | Provider-compat regression tied to #136916's zstd compression. |
| 4 | [#52952](https://github.com/NousResearch/hermes-agent/issues/52952) — Desktop Enter sends message, no newline support | 11 | Long-standing UX irritant (open since June). |
| 5 | [#133739](https://github.com/NousResearch/hermes-agent/issues/133739) — stray 0-byte `kanban.db` fails workspace cleanup closed | 10 | Fail-closed design colliding with real-world stray files. |
| 6 | [#155595](https://github.com/NousResearch/hermes-agent/issues/155595) — Tracking: profile creation & lifecycle | 8 | Umbrella tracker (see Roadmap). |
| 7 | [#147839](https://github.com/NousResearch/hermes-agent/issues/147839) — 20s `worker_receipt_timeout` poisons store, destroys turn | 8 | Every timeout → user-visible "No reply". |

**Underlying needs:** The top threads all point to **insufficient isolation and error recovery in the worker/session/gateway layer**. Users are running *concurrent* Kanban workers and *multi-profile* gateways; the failure modes are not "single request failed" but "**one stall cascades into lost work across multiple workers**" (#145022, #147839, #148002). The second cluster (#136486, #148898) is **provider-schema brittleness** — the agent's request-shaping is not robust to strict OpenAI-compatible endpoints. The third cluster (#52952, #133739) is **long-lived UX/design friction** that keeps accumulating comments because it never gets prioritized.

---

## 5. Bugs & Stability

Ranked by severity (P-level and blast radius):

**P1 — Critical**
- [#145022](https://github.com/NousResearch/hermes-agent/issues/145022) — **Kanban workers crash on gateway stall** (`items/comp/gateway, area/sessions`). *Multiple workers lost per incident.* No fix PR in today's data. **Highest priority.**
- [#136486](https://github.com/NousResearch/hermes-agent/issues/136486) — **[CLOSED]** `reasoning` alias duplicate-field HTTP 400; every turn fell back. Fixed today.

**P2 — High**
- [#148898](https://github.com/NousResearch/hermes-agent/issues/148898) — Codex backend 400 on zstd `/responses` bodies (non-retryable → hard fail). Regression from #136916.
- [#147839](https://github.com/NousResearch/hermes-agent/issues/147839) — 20s receipt timeout destroys whole turn; user sees "No reply".
- [#154749](https://github.com/NousResearch/hermes-agent/issues/154749) — Truncated tool output written to **wrong host** under SSH backend (file written on Hermes host, unreadable by SSH tools).
- [#146254](https://github.com/NousResearch/hermes-agent/issues/146254) — `bot_relay.deliver` rejects Desktop `id` param on legacy routes → **cross-machine Bot DMs silently never arrive**.
- [#134415](https://github.com/NousResearch/hermes-agent/issues/134415) — Assistant turns render **twice** in Desktop.
- [#135032](https://github.com/NousResearch/hermes-agent/issues/135032) — `plugins.scan_on_install` referenced but **doesn't exist** in config schema.
- [#148002](https://github.com/NousResearch/hermes-agent/issues/148002) — Kanban worktree prune protection is dir-name-based → running card loses workspace, reported as crash.
- [#94534](https://github.com/NousResearch/hermes-agent/issues/94534) — `sudo -n` probes rewritten to `sudo -S` → password injection fails.
- [#155892](https://github.com/NousResearch/hermes-agent/issues/155892) — Background-review API failures **silent** in gateway mode.
- [#155829](https://github.com/NousResearch/hermes-agent/issues/155829) — `hermes-mobile-push` sends **duplicate** notifications for cron `deliver: bot-chat`.
- [#135306](https://github.com/NousResearch/hermes-agent/issues/135306) — `hermes update` fails on duplicate uv workspace members across profile homes.
- [#155920](https://github.com/NousResearch/hermes-agent/issues/155920) — "gateway restart owed" warning never discharges when owner PID is dead.
- [#155919](https://github.com/NousResearch/hermes-agent/issues/155919) — Sessions page sorts by `created_at`, so long-lived chats vanish under cron runs.

**P3 — Moderate**
- [#52952](https://github.com/NousResearch/hermes-agent/issues/52952) — Desktop: no newline in chat input (Enter always sends).
- [#135262](https://github.com/NousResearch/hermes-agent/issues/135262) — macOS Desktop: Cmd+V types "v" in Bot Screen.
- [#4581](https://github.com/NousResearch/hermes-agent/issues/4581) — `read_file` always prepends line numbers (no raw option).
- [#135032](https://github.com/NousResearch/hermes-agent/issues/135032) — dangling config key referencing.

**Fix PRs present today:** [#155395](https://github.com/NousResearch/hermes-agent/pull/155395) (retry semantics for `x-should-retry: false` / bad TLS) and [#155391](https://github.com/NousResearch/hermes-agent/pull/155391) (strip hidden-tag/bidi chars from tool results) are **open**, addressing stability and injection-class issues. **No fix PR yet visible for the P1 #145022.**

> **Stability verdict:** The most dangerous class is **session/orchestration state loss** (#145022, #147839, #148002) — these can silently discard user work. Provider-compat regressions (#148898) are intermittent but non-retryable. There is no fix PR in flight for the top P1.

---

## 6. Feature Requests & Roadmap Signals

**Actively requested features (open):**
- [#148113](https://github.com/NousResearch/hermes-agent/issues/148113) — `browser_vault`: support **Bitwarden Card items** as a payment source (currently only Logins shown).
- [#52952](https://github.com/NousResearch/hermes-agent/issues/52952) — Desktop chat **multiline / newline** support.
- [#4581](https://github.com/NousResearch/hermes-agent/issues/4581) — `read_file` **raw content** option (no line numbers).
- [#155917](https://github.com/NousResearch/hermes-agent/pull/155917) — `pre_keyless_rescue` plugin hook (plugins can veto cloud keyless rescue), companion to #155901's fail-closed default.
- [#155913–#155915, #155911](https://github.com/NousResearch/hermes-agent/pull/155911) — A batch of **MCP configuration-only catalog plugins** (LocatePic, PaintColorMatcher, CheckChinaTransit, BaziTools, PaperLesson).

**Roadmap trackers (strong signal for next cycle):**
- [#155595](https://github.com/NousResearch/hermes-agent/issues/155595) — **Profile creation & lifecycle campaign** ("one owner for active profile, config values, secrets"), with [#152308](https://github.com/NousResearch/hermes-agent/issues/152308) tracking "Lane C" PRs for #151791. This is the single largest named initiative visible.
- Implied v0.24+ focus: **profile/config/secrets ownership consolidation**, **gateway-owned goal persistence** ([#154902](https://github.com/NousResearch/hermes-agent/pull/154902)), and **tool-result sanitization/hardening**.

**Prediction for next release:** The profile-lifecycle work (#151791 → #152308 → #155595) and the gateway goal-resumption PR (#154902) are the most likely headline items, alongside a continued stream of plugin-catalog additions. Security hardening PRs (#155391, #155396) targeting the `sec-marathon` theme are also strong candidates to land quickly.

---

## 7. User Feedback Summary

**Pain points (real, repeated, unresolved):**
1. **Work loss under concurrency** — Multiple users report that a single gateway/worker stall discards in-progress work across several Kanban workers (#145022, #147839, #148002). This is the most emotionally salient signal: users describe *silent* failure ("No reply", "crash") with no linkage between the card record and the lost workspace.
2. **Provider-config brittleness** — Strict OpenAI-compatible endpoints break on request shape (#136486 closed; #148898 open). Users are running heterogeneous backends (Codex, Nous, Anthropic, local) and expect the agent to adapt.
3. **Desktop UX friction** — Multiline input (#52952) and macOS paste (#135262) are small bugs with a long tail of frustration; both open since June/October.
4. **Cross-host correctness** — SSH/docker users find truncated output written to the wrong host (#154749) and Bot DMs silently dropped over legacy routes (#146254) — a *trust* problem, not just a bug.
5. **Notification noise** — Duplicate pushes (#155829) degrade the mobile experience.

**Satisfaction signals:** The rapid closure of security issues (#139327, #7485, #144380, #128930) and provider bugs (#136486) shows maintainers **do** respond to well-scoped reports; the `sec-marathon` tagging and `ci-reviewed` labels indicate a mature triage process. The steady stream of owner-submitted plugin-catalog PRs (rule 5) shows an engaged external ecosystem.

**Dissatisfaction signal:** The gap between *bug report* and *fix PR* on the P1 orchestration issues is the main source of perceived instability today.

---

## 8. Backlog Watch

Items needing maintainer attention (aging or high-value, no fix in sight):

| Item | Created | Age | Why it matters |
|---|---|---|---|
| [#4581](https://github.com/NousResearch/hermes-agent/issues/4581) — `read_file` raw option | 2026-04-02 | **~7.5 mo** | Trivial API request, still open; affects tool output fidelity. |
| [#7485](https://github.com/NousResearch/hermes-agent/issues/7485) — ReDoS in approval regex | 2026-04-11 | ~7 mo | **Closed today** — good example of backlog clearing. |
| [#52952](https://github.com/NousResearch/hermes-agent/issues/52952) — Desktop Enter/newline | 2026-06-26 | ~4.5 mo | Recurring UX; 3 👍; no PR. |
| [#94534](https://github.com/NousResearch/hermes-agent/issues/94534) — `sudo -n`→`sudo -S` rewrite | 2026-08-25 | ~2.5 mo | Blocks non-interactive sudo workflows; still P2 open. |
| [#117815](https://github.com/NousResearch/hermes-agent/issues/117815) — approval/redaction granularity | 2026-09-21 | ~2 mo | **Closed today** (hardening). |
| [#128688](https://github.com/NousResearch/hermes-agent/pull/128688) — preserve sequential hook order | 2026-09-30 | ~6.5 wks | Long-open P3 fix PR; fixes #128683; needs review/merge. |
| [#133739](https://github.com/NousResearch/hermes-agent/issues/133739) — 0-byte `kanban.db` fails cleanup | 2026-10-06 | ~5

</details>

<details>
<summary><strong>IronClaw</strong> — <a href="https://github.com/nearai/ironclaw">nearai/ironclaw</a></summary>

No activity in the last 24 hours.

</details>

<details>
<summary><strong>QwenPaw</strong> — <a href="https://github.com/agentscope-ai/QwenPaw">agentscope-ai/QwenPaw</a></summary>

# QwenPaw Project Digest — 2026-11-15

## 1. Today's Overview

QwenPaw remains in a highly active maintenance-and-hardening phase, with **15 issues and 15 PRs updated in the last 24 hours** — a balanced flow that indicates both healthy community reporting and active development. No new releases were cut today, and the project is operating on the `2.3.0` release line (with `2.3.1b1` visible on `main`). The dominant theme across today's activity is **session/channel reliability** — particularly Feishu session hangs, stuck queue consumers, and configuration loss — alongside a cluster of **Console/frontend polish fixes** and **provider integration corrections**. Notably, a long-standing stuck-session fix PR (#4411) was closed today, suggesting meaningful progress on one of the project's most persistent reliability pain points. The ratio of open-to-closed issues (10:5) and open-to-merged PRs (14:1) suggests the maintainer queue is building, warranting attention.

---

## 2. Releases

**No new releases in the last 24 hours.** The latest observable version is `2.3.0` (stable) with `2.3.1b1` on `main`. No breaking changes, migration notes, or upgrade guidance to report today.

---

## 3. Project Progress

### Merged / Closed PRs Today
- **[PR #4411 [CLOSED]](https://github.com/agentscope-ai/QwenPaw/pull/4411)** — `fix: add LLM call timeout and task watchdog to prevent stuck sessions` (first-time contributor). This is the most significant closure today. It addresses sessions permanently stuck in `running` state due to LLM providers (especially proxied/multi-key setups) never responding. The fix adds a **per-call LLM timeout** and a **task watchdog** — directly targeting the root cause class behind multiple long-lived bug reports (see §5).

### Issues Closed Today (5)
- **[#7534](https://github.com/agentscope-ai/QwenPaw/issues/7534)** — Feishu session queue consumer stuck → silent unresponsive session.
- **[#6608](https://github.com/agentscope-ai/QwenPaw/issues/6608)** — Long-running shell commands bypass `shell_command_timeout`, blocking Feishu sessions for 1.5h with orphan subprocesses.
- **[#7408](https://github.com/agentscope-ai/QwenPaw/issues/7408)** — Feishu channel config silently wiped (`enabled=false`, empty `app_id`), breaking cron delivery.
- **[#4963](https://github.com/agentscope-ai/QwenPaw/issues/4963)** — Feature request: cron support for direct script/shell execution.
- **[#6125](https://github.com/agentscope-ai/QwenPaw/issues/6125)** — Marked out of date.

**Assessment:** The clustering of closures around Feishu session reliability (#7534, #6608, #7408) plus the merged watchdog fix (#4411) represents a **coherent reliability push** — likely the most impactful work of the week.

### PRs Advancing
- **[PR #8737](https://github.com/agentscope-ai/QwenPaw/pull/8737)** — Console sidebar drag/dock hit-target alignment (touch devices).
- **[PR #8738](https://github.com/agentscope-ai/QwenPaw/pull/8738)** — Stabilize conversation groups during drag.
- **[PR #8739](https://github.com/agentscope-ai/QwenPaw/pull/8739)** — Prevent hidden terminal dock from resizing chat.
- **[PR #8734](https://github.com/agentscope-ai/QwenPaw/pull/8734)** — Fix CJK Windows plugin load (explicit UTF-8 read).
- **[PR #8729](https://github.com/agentscope-ai/QwenPaw/pull/8729)** — Expose `request_headers` on Anthropic/MiniMax presets.
- **[PR #8735](https://github.com/agentscope-ai/QwenPaw/pull/8735)** — Retry completed empty streams.

---

## 4. Community Hot Topics

Ranked by comment count and engagement:

| Rank | Item | Comments | 👍 | Link |
|------|------|----------|-----|------|
| 1 | #7534 Feishu session queue consumer stuck | 4 | 0 | [link](https://github.com/agentscope-ai/QwenPaw/issues/7534) |
| 2 | #6608 Shell commands bypass timeout, block session | 4 | 0 | [link](https://github.com/agentscope-ai/QwenPaw/issues/6608) |
| 3 | #4963 Cron direct script execution | 4 | 0 | [link](https://github.com/agentscope-ai/QwenPaw/issues/4963) |
| 4 | #7408 Feishu config wiped, cron KeyError | 4 | 0 | [link](https://github.com/agentscope-ai/QwenPaw/issues/7408) |
| 5 | #7608 DingTalk stream-mode card callbacks | 3 | **1** | [link](https://github.com/agentscope-ai/QwenPaw/issues/7608) |
| 6 | #8711 Auto-retry empty-stream EOF | 3 | 0 | [link](https://github.com/agentscope-ai/QwenPaw/issues/8711) |

**Underlying needs analysis:**
- The top four topics are **all authored or co-authored by `feng183043996`** and all relate to **channel session robustness** — this is a power user stress-testing the Feishu/cron integration path in production and surfacing systemic issues.
- **#7608 (DingTalk interactive cards)** is the only topic with a positive reaction, signaling genuine community demand for richer channel interactivity beyond plain text.
- **#8711 (empty-stream retry)** reflects growing concern about **LLM provider flakiness** in streamed responses — users want the agent to be resilient to silent provider failures.

---

## 5. Bugs & Stability

Ranked by severity (impact × likelihood × fix status):

### 🔴 Critical
1. **[#8718](https://github.com/agentscope-ai/QwenPaw/issues/8718)** — *Hub model gateway instantly fails for Anthropic/MiniMax presets.* `provider_headers()` calls a missing `request_headers()`. Any org-model connection using built-in presets fails with HTTP 502. **Fix PR exists: [#8729](https://github.com/agentscope-ai/QwenPaw/pull/8729).**
2. **[#8736](https://github.com/agentscope-ai/QwenPaw/issues/8736)** — *Subagent completions incorrectly trigger "Reply completion" desktop notification.* Affects `2.3.0` and confirmed present on `main` (`2.3.1b1`). Notification noise degrades trust in the completion signal. **No fix PR yet.**

### 🟠 High
3. **[#8733](https://github.com/agentscope-ai/QwenPaw/issues/8733)** — *CloudPaw plugin fails to load on Chinese Windows (cp936/GBK).* `legacy_cloudpaw.py` reads JSON without explicit UTF-8 encoding. Blocks plugin entirely for a large user segment. **Fix PR exists: [#8734](https://github.com/agentscope-ai/QwenPaw/pull/8734).**
4. **[#8745](https://github.com/agentscope-ai/QwenPaw/issues/8745)** — *PawApp mobile: session isolation misleading, send errors, IME occlusion.* Three UX/functional bugs bundled; mobile parity is a recurring weak point.

### 🟡 Medium
5. **[#8742](https://github.com/agentscope-ai/QwenPaw/issues/8742)** — *Provider integration test sends GET to PUT-only route.* Test never validates intended behavior (405 masked as pass/fail). **Fix PR exists: [#8743](https://github.com/agentscope-ai/QwenPaw/pull/8743).**
6. **[#8711](https://github.com/agentscope-ai/QwenPaw/issues/8711)** — *Empty / thinking-only stream EOF with HTTP 200.* Agent produces no answer silently. **Fix PR exists: [#8735](https://github.com/agentscope-ai/QwenPaw/pull/8735).**

**Stability trend:** A clear pattern of **silent-failure bugs** (empty streams, stuck consumers, wiped configs) — the agent fails without erroring. This class of bug is the highest risk to user trust, and today's activity shows both community detection and contributor fixes arriving in parallel. The merge of #4411 (watchdog) is a structural mitigation for this whole class.

---

## 6. Feature Requests & Roadmap Signals

| Issue | Feature | Likelihood in Next Version | Rationale |
|-------|---------|---------------------------|-----------|
| [#7608](https://github.com/agentscope-ai/QwenPaw/issues/7608) | DingTalk interactive card callbacks (stream mode) | **High** | Channel parity gap; has 👍 support; well-scoped. |
| [#8740](https://github.com/agentscope-ai/QwenPaw/issues/8740) | Olostep as `web_search` provider | **High** | PR already submitted ([#8741](https://github.com/agentscope-ai/QwenPaw/pull/8741)); follows existing Firecrawl pattern. |
| [#8744](https://github.com/agentscope-ai/QwenPaw/issues/8744) | Console entry to view compressed/archived history turns | **Medium-High** | Directly addresses user perception of "lost history"; low complexity. |
| [#8732](https://github.com/agentscope-ai/QwenPaw/issues/8732) | Appearance page (welcome screen, background) | **Medium** | Underlying pieces exist; UX polish request. |
| [#8711](https://github.com/agentscope-ai/QwenPaw/issues/8711) | Auto-retry empty-stream EOF | **Medium** | Fix PR (#8735) open; behavior change may need review. |
| [#4963](https://github.com/agentscope-ai/QwenPaw/issues/4963) | Cron direct script execution | **Medium** | Closed today as enhancement; may have been implemented or deferred. |

**Prediction:** The next minor release is likely to include **provider reliability fixes (Anthropic/MiniMax headers, empty-stream retry)**, **Olostep web_search integration**, and **DingTalk card callbacks** — a mix of bug hardening and channel/feature expansion.

---

## 7. User Feedback Summary

**Pain Points (dissatisfaction):**
- **Silent session failures** dominate. Users (led by `feng183043996`) report sessions that "silently freeze" with no traceback, forcing manual intervention — the worst UX failure mode.
- **Configuration fragility** — the Feishu config wipe (#7408) destroyed a production integration and broke downstream cron jobs.
- **Mobile experience gaps** (#8745): session isolation between mobile and web is confusingly presented; IME occlusion makes typing painful; send errors erode confidence.
- **Perceived history loss** (#8744): after context compression, users believe conversations are gone because archived turns are unreachable in the UI.
- **Notification correctness** (#8736): false "reply complete" pings from subagents.

**Positive signals:**
- Contributors are **rapidly filing matching fix PRs** (e.g., #8729 for #8718, #8734 for #8733, #8743 for #8742, #8735 for #8711) — often within 24 hours. This reflects a responsive contributor base.
- Third-party integrations (Olostep) are proactively targeting QwenPaw, indicating growing ecosystem relevance.

**Overall satisfaction:** Mixed. Core functionality is valued (evidenced by production use in Feishu/cron pipelines), but **reliability under load and cross-platform parity** are the primary sources of frustration.

---

## 8. Backlog Watch

Items needing maintainer attention:

1. **[PR #7066](https://github.com/agentscope-ai/QwenPaw/pull/7066)** — *Persist rotated refresh_token for OAuth2 auth-code providers.* Open since **2026-08-16 (~3 months)**, tagged `Under Review`, `first-time-contributor`. Fixes #7053; risk of contributor abandonment and a real OAuth bug (XMind-class integrations lose refresh tokens).
2. **[PR #6660](https://github.com/agentscope-ai/QwenPaw/pull/6660)** — *Update .dockerignore to include README.me.* Open since **2026-08-03 (~3.5 months)**. Trivial change, apparently stalled — suggests a maintainer review bottleneck on small PRs.
3. **[PR #8133](https://github.com/agentscope-ai/QwenPaw/pull/8133)** — *Repair CJK emphasis boundaries in chat Markdown.* Open since **2026-10-08**, `Under Review`, `size/L`. Affects all CJK users' rendered output — a large user segment.
4. **[PR #8648](https://github.com/agentscope-ai/QwenPaw/pull/8648)** — *Local engine, GPU, and auto-update controls (XL).* Part of a 3-PR stacked feature (#8649 → #8647 → #8648). Large surface area, needs careful review; risk of long review cycles.
5. **[PR #8477](https://github.com/agentscope-ai/QwenPaw/pull/8477)** — *Staged pool skill install via rename.* Open since **2026-10-28**, `Under Review`, `size/L`.

**Maintainer attention signal:** Four of these five backlog items are **`first-time-contributor` or `Under Review`** and have been open for weeks to months. The oldest (#6660, #7066) risk losing contributor momentum. Recommend prioritizing a review sweep on small/medium PRs to sustain community goodwill.

---

*Generated from GitHub activity data for 2026-11-15. All links point to `github.com/agentscope-ai/QwenPaw`.*

</details>

<details>
<summary><strong>ZeroClaw</strong> — <a href="https://github.com/zeroclaw-labs/zeroclaw">zeroclaw-labs/zeroclaw</a></summary>

# ZeroClaw Project Digest — 2026-11-15

## 1. Today's Overview

ZeroClaw shows **very high development velocity** with 50 PRs and 11 issues updated in the last 24 hours, though only 1 PR was merged/closed and 1 issue closed — indicating a **review bottleneck** rather than a throughput problem. The open PR queue is heavily weighted toward a single prolific contributor (CastelloBrancoTecnologia), who authors the majority of the top-20 PRs, many of which are large (`size:XL`), security-sensitive (`risk:high`), and blocked on `needs-author-action` or `needs-maintainer-review`. Activity is dominated by security hardening (secrets management, SSH broker, sandbox fixes) and agent-loop reliability work, with several long-running PRs (dating to October) still cycling through conflict resolution. No new release was cut today, and the issue mix skews toward accepted bugs (P2) and inert-config cleanup. Overall project health is **strong on contribution, strained on review capacity**.

## 2. Releases

**None.** No new releases were published in the last 24 hours. The last referenced version in issues is v0.8.5 (see #10781), and multiple open PRs target `master` without a release tag. No migration notes apply today.

## 3. Project Progress

Only **1 PR was merged/closed** and **1 issue closed** in the last 24h, so forward progress today is minimal at the merge level:

- **Issue #12416 [CLOSED]** — [ADR-016 holding-crate exception for host-mediated WASM plugin wake dispatch](https://github.com/zeroclaw-labs/zeroclaw/issues/12416) (author: tidux). This unblocks WASM plugin wake dispatch implementation in `zeroclaw-runtime`, a governance/architecture decision rather than a code fix.

Advanced (still open, updated today) but not yet merged:
- **[PR #12442](https://github.com/zeroclaw-labs/zeroclaw/pull/12442)** — opt-in owner notice for turned-away Matrix senders (new, small).
- **[PR #12438](https://github.com/zeroclaw-labs/zeroclaw/pull/12438)** — native Rust task broker for SSH (new, XL).
- **[PR #9809](https://github.com/zeroclaw-labs/zeroclaw/pull/9809)** — multi-model-per-provider support, still open since August 7.

The practical takeaway: **the pipeline is filling faster than it is draining**.

## 4. Community Hot Topics

Ranked by comment activity:

| Item | Type | Comments | Link |
|---|---|---|---|
| #11332 | Issue (bug) | 5 | [Skill review/creation never runs for channel/webhook/gateway turns](https://github.com/zeroclaw-labs/zeroclaw/issues/11332) |
| #10781 | Issue (enhancement) | 5 | [Remove or implement inert context/history config keys](https://github.com/zeroclaw-labs/zeroclaw/issues/10781) |
| #12137 | Issue (bug/S1) | 2 | [Seatbelt profile mis-escaped dotfiles rule](https://github.com/zeroclaw-labs/zeroclaw/issues/12137) |
| #11713 | Issue (bug) | 2 | [Telegram ignores `edited_message` updates](https://github.com/zeroclaw-labs/zeroclaw/issues/11713) |

**Underlying needs analysis:**
- **#11332** reflects a core architectural gap: the *learning loop* (skill improvement/creation) is wired only into CLI/cron paths, not the channel/gateway runtime. Multi-channel users expect feature parity across entry points.
- **#10781** and **#12396** together signal **config trust erosion** — users set documented knobs that silently do nothing. This is a documentation-honesty and API-contract problem.
- **#12137** is a classic sandbox hardening regression: a mis-escaped `\\.` breaks legitimate toolchain paths (`~/.cargo`, `~/.nvm`) while the fix must avoid exposing `~/.ssh`. High user impact on macOS.
- **#11713** is a channel-parity bug: edited messages are invisible to the agent, breaking conversational workflows on Telegram.

## 5. Bugs & Stability

Ranked by severity:

**S1 — Workflow blocked**
- **[#12137](https://github.com/zeroclaw-labs/zeroclaw/issues/12137)** — macOS Seatbelt sandbox mis-escape blocks toolchains under `~/.cargo`, `~/.nvm`, `~/.pyenv`, `~/.local` with "Operation not permitted". *No linked fix PR found in today's list.*
- **[#12425](https://github.com/zeroclaw-labs/zeroclaw/issues/12425)** (Chinese-language) — agent loses control over long-running tasks; QQ channel returns "等待模型响应超时" (model response timeout) for a Bing search query. *No fix PR yet.*

**S2 — Degraded behavior**
- **[#11332](https://github.com/zeroclaw-labs/zeroclaw/issues/11332)** — skill review/creation skipped for channel/webhook/gateway turns.
- **[#11713](https://github.com/zeroclaw-labs/zeroclaw/issues/11713)** — Telegram `edited_message` ignored.

**S3 — Minor**
- **[#10781](https://github.com/zeroclaw-labs/zeroclaw/issues/10781)** / **[#12396](https://github.com/zeroclaw-labs/zeroclaw/issues/12396)** — dead/inert config keys (`context_compression.*`, `history_pruning.keep_recent`, `collapse_tool_results`, `keep_tool_context_turns`).
- **[#12421](https://github.com/zeroclaw-labs/zeroclaw/issues/12421)** — cron jobs run outside session-key scope, losing provider prompt-cache affinity.

**Fix PRs in flight (not yet merged):**
- [#12323](https://github.com/zeroclaw-labs/zeroclaw/pull/12323) — bind cached HTTP clients to their Tokio runtime (correctness/async-safety).
- [#11868](https://github.com/zeroclaw-labs/zeroclaw/pull/11868) — stop repeated identical tool calls before dispatch (related to closeout retention).
- [#11874](https://github.com/zeroclaw-labs/zeroclaw/pull/11874) — report progress during long channel turns (mitigates the class of problem in #12425).
- [#11911](https://github.com/zeroclaw-labs/zeroclaw/pull/11911) — preserve completed tool results and bounded recovery.

## 6. Feature Requests & Roadmap Signals

Today's and recent enhancement requests cluster into three themes:

1. **Credential & secret management (strongest signal).** [#12373](https://github.com/zeroclaw-labs/zeroclaw/issues/12373) (write-only WebUI credential management), [#12422](https://github.com/zeroclaw-labs/zeroclaw/issues/12422) (RFC: scoped operator-managed service credentials), plus PRs [#12402](https://github.com/zeroclaw-labs/zeroclaw/pull/12402) and [#12408](https://github.com/zeroclaw-labs/zeroclaw/pull/12408). This is clearly coalescing into the **next major security feature** — keeping secrets out of model context while granting scoped tool access.

2. **Multi-user identity delivery.** [#12441](https://github.com/zeroclaw-labs/zeroclaw/issues/12441) — deliver the requesting user's identity to tool execution outside the model context. Signals a push toward production multi-tenant deployments.

3. **Provider/model configuration.** [PR #9809](https://github.com/zeroclaw-labs/zeroclaw/pull/9809) (multiple models per provider profile) and [PR #11845](https://github.com/zeroclaw-labs/zeroclaw/pull/11845)/[#11846](https://github.com/zeroclaw-labs/zeroclaw/pull/11846) (OpenRouter credit balance in dashboard).

**Prediction:** The scoped-credentials work (#12373/#12422 + PRs #12402/#12408/#12418) is the most likely candidate for the next minor release, given the density of dependent PRs. Multi-model-per-provider (#9809) is a long-pending XL PR that could land once review capacity frees up.

## 7. User Feedback Summary

**Pain points:**
- **Silent failures over channels.** Users report the agent "loses control" (#12425) or silently drops updates (#11713), eroding trust in non-CLI channels.
- **Config that lies.** Documented settings (#10781, #12396) do nothing — users waste time tuning phantom knobs.
- **macOS sandbox friction.** #12137 blocks day-one developer workflows for Rust/Node/Python users.
- **Feature inconsistency.** #11332 shows CLI users get capabilities (skill learning) that channel users don't.

**Use cases emerging:**
- Multi-user assistants over RPC (#12441).
- Operator-mediated service authorization without credential disclosure (#12422).
- Multi-channel presence (Matrix, Telegram, QQ, XMPP via [PR #11847](https://github.com/zeroclaw-labs/zeroclaw/pull/11847)).

**Satisfaction signal:** Users are clearly *invested* — filing detailed RFCs, structured bug reports with severity/labels, and contributing fixes. Dissatisfaction is concentrated in **reliability and honesty of the config surface**, not core capability.

## 8. Backlog Watch

Items needing maintainer attention:

- **[PR #9809](https://github.com/zeroclaw-labs/zeroclaw/pull/9809)** — open since **2026-08-07** (>3 months), `size:XL`, `risk:high`, `needs-author-action`. Multi-model provider support is a highly requested capability; it risks bit-rot if left much longer.
- **[PR #11868](https://github.com/zeroclaw-labs/zeroclaw/pull/11868)** — open since **2026-10-19**, `needs-maintainer-review`, `risk:high`. Core agent-loop correctness (repeated-call suppression) with a dedicated docs exception PR (#12265) already queued — blocked on review.
- **[PR #11869](https://github.com/zeroclaw-labs/zeroclaw/pull/11869)** — same vintage, `needs-author-action`, `risk:high`. Task-owned SSH transport reuse; spawns dependent PRs (#12418, #12438) creating a review chain.
- **[PR #11847](https://github.com/zeroclaw-labs/zeroclaw/pull/11847)** — native Rust XMPP with OMEMO, open since **2026-10-19**, `needs-maintainer-review`, `size:XL`. Security-sensitive (replay cache, encryption) and awaiting review.
- **[Issue #12137](https://github.com/zeroclaw-labs/zeroclaw/issues/12137)** — S1 sandbox bug with **no linked fix PR**; highest-severity unaddressed item today.
- **[Issue #11332](https://github.com/zeroclaw-labs/zeroclaw/issues/11332)** — accepted S2 with 5 comments but no fix PR, open since **2026-10-01**.

**Bottom line:** The project is **contribution-rich but review-constrained**. A large cohort of security-critical, XL-sized PRs from a single dominant contributor is queued behind `needs-maintainer-review`. Clearing this bottleneck — particularly #9809, #11868/#11869, and #11847 — is the highest-leverage action for maintainers, and unblocking the S1 sandbox fix (#12137) is the most urgent stability item.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*