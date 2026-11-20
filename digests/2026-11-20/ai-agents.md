# OpenClaw Ecosystem Digest 2026-11-20

> Issues: 466 | PRs: 500 | Projects covered: 5 | Generated: 2026-11-20 02:14 UTC

- [OpenClaw](https://github.com/openclaw/openclaw)
- [Hermes Agent](https://github.com/nousresearch/hermes-agent)
- [IronClaw](https://github.com/nearai/ironclaw)
- [QwenPaw](https://github.com/agentscope-ai/QwenPaw)
- [ZeroClaw](https://github.com/zeroclaw-labs/zeroclaw)

---

## OpenClaw Deep Dive

# OpenClaw Project Digest — 2026-11-20

## 1. Today's Overview

OpenClaw remains in a **high-velocity but upgrade-fragile** state. Activity is intense: 466 issues and 500 PRs touched in the last 24h, with roughly 72% of issues still open and 61% of PRs awaiting review — a large but manageable intake funnel. Two releases landed (v2026.11.6 stable and v2026.11.10-beta.1), headlined by agent templates from ClawHub and OpenClaw ID node connectivity, alongside upgrade-path hardening. However, the issue tracker is dominated by **update/Doctor failures, state-DB corruption, prompt-cache invalidation, and session persistence bugs**, several tagged P0/P1 as release blockers. Overall health: **strong feature momentum, strained release-engineering reliability** — the update pipeline is the single biggest source of user pain.

## 2. Releases

### v2026.11.10-beta.1 (beta)
- **Agent templates:** add agents directly from ClawHub packages via a single `CLAW.md` manifest with bundled skill folders validated by the native trust flow (#195707, #196322, #196348) — authored by @steipete, thanks @Patrick-Erichsen.
- **OpenClaw ID:** node connection work begins (release notes truncated in source data).
- **Migration notes:** Template-based agent installation is new; no breaking changes stated in the visible notes. As a beta, expect the known update-path issues below to apply.

### v2026.11.6 (stable)
- **Smoother upgrades:** bridges the 2026.11.5 updater to the current release path and correctly validates staged plugin dependencies on Windows (#200662, #200595) — authored by @steipete, thanks @RomneyDa and @desksk.
- **More resilient conversations:** subagent/session handling improvements (notes truncated).
- **Breaking changes:** none stated. This is a targeted reliability release responding to the update failures reported across #200606, #199617, and #200289.

## 3. Project Progress

Merged/closed activity today (193 PRs closed or merged) skews toward **template UX, gateway correctness, and diagnostics**:

- **Template/ClawHub UX maturation:** #202060 (preview a Template without expanding files), #202126 (show planned automations with controls in chat), #202115 (correct agent/activity display when adding a template), #202156 (idle worker heap collection), #202168 (Crabbox wrapper test fix).
- **Gateway fixes:** #199743 (refresh native command channels when the plugin registry is replaced — fixes Telegram slash commands breaking after hot reload), #202166 (preserve transport identity on oversized history placeholders).
- **Upgrade diagnostics:** #202174 (keep Doctor finding targets in upgrade failure reports) and #199651 (distinguish invalid Windows Scheduled Task inspection responses) — both directly aimed at the opaque update failures dominating the tracker.
- **iOS transcript rebuild:** #200592 closed after reworking the iOS chat around the web reading model (pagination, grouped tool calls, turn summaries).

Directionally, the team is **converting update-failure reports into diagnostic improvements** rather than only point fixes — a healthy sign, but the underlying state-migration machinery remains fragile.

## 4. Community Hot Topics

| Rank | Item | Comments | Signal |
|---|---|---|---|
| 1 | [#197083](https://github.com/openclaw/openclaw/issues/197083) — Post-install Doctor WAL verification leaves 11.3 update partially finalized (P0) | 29 | Update integrity; `state-migrated-no-rollback` trap |
| 2 | [#119720](https://github.com/openclaw/openclaw/issues/119720) — Synchronous agent persistence blocks Gateway event loop at scale (P1) | 29, 👍2 | Scalability of the core session store |
| 3 | [#123792](https://github.com/openclaw/openclaw/issues/123792) — Assistant turns render twice with CLI backends (P2) | 20 | Transcript duplication across surfaces |
| 4 | [#125764](https://github.com/openclaw/openclaw/issues/125764) — Telegram outbound sends dead-lettered after one attempt (P1) | 15, 👍1 | Silent message loss in adapters |
| 5 | [#200606](https://github.com/openclaw/openclaw/issues/200606) — Candidate Doctor blocks 11.3→11.5 with migration conflict (P1) | 14, 👍1 | Same update cluster |

**Underlying needs:** the community is converging on two themes — (a) **update/migration transactions must be atomic and recoverable**, and (b) **message delivery must never silently drop**. The persistence/event-loop and Telegram dead-letter threads are months old with diamond/platinum-lobster ratings, indicating deep, well-evidenced problems rather than noise.

## 5. Bugs & Stability

**P0 / release blockers**
- [#197083](https://github.com/openclaw/openclaw/issues/197083) — Doctor WAL publication verification fails mid-update; leaves partially finalized installs. **No fix PR linked.** ⚠️
- [#164800](https://github.com/openclaw/openclaw/issues/164800) — Managed update stalls after Doctor with Gateway stopped (9.7→9.8), still unresolved since October. **No fix PR.**
- [#158277](https://github.com/openclaw/openclaw/issues/158277) — Talk on Apple Watch fails with "Voice changed its remote network address" (P0, release blocker). Fix-shape clear, **no PR yet**.

**P1**
- [#119720](https://github.com/openclaw/openclaw/issues/119720) — Gateway event-loop blocking from synchronous persistence at scale.
- [#125764](https://github.com/openclaw/openclaw/issues/125764) — Telegram single-attempt dead-lettering (message loss).
- [#198218](https://github.com/openclaw/openclaw/issues/198218) — Doctor/update maintenance livelock re-hashing unchanged state DB.
- [#196199](https://github.com/openclaw/openclaw/issues/196199) — Codex helper completions fail to resume parent (regression since 2026.10.10).
- [#194655](https://github.com/openclaw/openclaw/issues/194655) — Deferred plugin DB migration ends in `state-migrated-no-rollback` (workboard schema 38 vs 0).
- [#169797](https://github.com/openclaw/openclaw/issues/169797) — Gateway memory regression (~2.5x) on single-CPU hosts.
- [#191476](https://github.com/openclaw/openclaw/issues/191476) — Matrix room stuck on "consumer is closed" after image_generate race.

**P2 highlights**
- [#191847](https://github.com/openclaw/openclaw/issues/191847) — 512 MB SQLite worker OOM kills large sessions (regression since 2026.10.10).
- [#198373](https://github.com/openclaw/openclaw/issues/198373) & [#202001](https://github.com/openclaw/openclaw/issues/202001) — **Prompt-cache invalidation**: history rewritten / system-prompt section churn collapses cache reads to ~1–3% on OpenAI-compatible routes. This is an emerging cluster worth watching; PR #201710 ("freeze a prompt series' tool set at its first request") is an open candidate fix.
- [#112638](https://github.com/openclaw/openclaw/issues/112638) — Session maintenance limits silently exceeded (thread/channel entries exempt from reclaim).
- [#170496](https://github.com/openclaw/openclaw/issues/170496) — Full state-DB copy per read; cron tick triggers it repeatedly.

**Positive signal:** closed today — [#200289](https://github.com/openclaw/openclaw/issues/200289) (11.3→11.4 SQLite-lock update failure), [#199155](https://github.com/openclaw/openclaw/issues/199155) (CLI `message send` transcript race), [#201796](https://github.com/openclaw/openclaw/issues/201796) (cron replay loop), [#164355](https://github.com/openclaw/openclaw/issues/164355) (plugin hook gap). Several had clear fix shapes and were queueable — maintainer throughput is working.

## 6. Feature Requests & Roadmap Signals

- **Memory search / CJK:** [#170997](https://github.com/openclaw/openclaw/issues/170997) requests a bigram tokenizer (trigram yields 0 matches for 2-char Chinese queries). **[#179954](https://github.com/openclaw/openclaw/issues/179954)** asks for configurable per-entry chunking paths — both are low-risk, high-value and plausible for an upcoming beta.
- **Cron lifecycle:** [#130247](https://github.com/openclaw/openclaw/issues/130247) — no `--until`/`--max-runs`; jobs cannot self-terminate.
- **Channel scheduling:** [#187264](https://github.com/openclaw/openclaw/issues/187264) — caller-scoped, same-conversation scheduling for non-owner Slack users (needs product + security review).
- **Automation UX:** [#150029](https://github.com/openclaw/openclaw/issues/150029) (closed) — configurable Inspect link (`always | errors | never`).
- **In-flight:** PR [#202171](https://github.com/openclaw/openclaw/pull/202171) adds realtime voice token accounting (Discord/Talk/Voice Call) — closes #202165. PR [#159478](https://github.com/openclaw/openclaw/pull/159478) adds selective agent participation in group conversations.

**Prediction:** given the template/ClawHub push in v2026.11.10-beta.1, expect **template automation controls, voice cost accounting, and memory-search tokenizer work** to land next; cron lifecycle and group-conversation features are more likely post-stabilization.

## 7. User Feedback Summary

**Pain points (ranked by recurrence):**
1. **Updates break or stall** — the dominant theme. Users report multi-hour updates, SQLite locks during Gateway handoff requiring SSH recovery (#200289), Doctor blocking valid migrations (#200606), Windows Scheduled Task validation failures (#199617), and `state-migrated-no-rollback` dead ends (#197083, #194655). Trust in the updater is the top satisfaction risk.
2. **Silent message loss** — Telegram dead-lettering (#125764) and Matrix consumer-closed races (#191476) drop high-value messages with no user-visible error.
3. **Performance/cost** — prompt-cache collapse (#198373, #202001) directly increases token spend; memory regression on small hosts (#169797) and worker OOM (#191847) hit low-resource users hardest.
4. **Session state integrity** — duplicate renders (#123792), phantom replies from stale injected context (#177210), and unbounded session stores (#112638).

**Satisfaction signals:** high-quality, well-reproduced reports (diamond/platinum-lobster ratings) suggest an engaged, technically sophisticated community; rapid closure of several P1s today indicates responsiveness once issues are triaged.

## 8. Backlog Watch

Long-lived or high-impact items needing maintainer attention:

| Item | Age | Why it matters |
|---|---|---|
| [#119720](https://github.com/openclaw/openclaw/issues/119720) (P1, since Aug) | ~3.5 mo | Gateway event-loop blocking — architectural; affects all large deployments |
| [#112638](https://github.com/openclaw/openclaw/issues/112638) (P2, since Jul) | ~4 mo | Session store limits silently exceeded; needs product decision |
| [#125764](https://github.com/openclaw/openclaw/issues/125764) (P1, since Aug) | ~3 mo | Telegram message loss; no fix PR, needs live repro |
| [#164800](https://github.com/openclaw/openclaw/issues/164800) (P0, since Oct) | ~1.5 mo | Update stall, unresolved — undermines the entire release channel |
| [#130247](https://github.com/openclaw/openclaw/issues/130247) (P3, since Aug) | ~3 mo | Cron jobs cannot end; stale, needs product decision |
| [#153899](https://github.com/openclaw/openclaw/issues/153899) (P1, since Sep) | ~2 mo | Gateway drain waits full `TimeoutStopSec`; stale + needs info |
| PR [#129388](https://github.com/openclaw/openclaw/pull/129388) (since Aug) | ~3 mo | Context-pressure-aware continuation — XL design PR stuck needing proof/security review |
| PR [#192350](https://github.com/openclaw/openclaw/pull/192350) (since Nov 3) | ~2.5 wk | GitHub integration → plugin migration; security review required |

**Recommendation:** the update/Doctor failure cluster (#197083, #164800, #200606, #198218, #194655) should be treated as a **single coordinated release-engineering epic** — it is the highest-leverage fix for user trust, and v2026.11.6's targeted hardening suggests the team already recognizes this.

---

*Data source: github.com/openclaw/openclaw — issues/PRs updated 2026-11-19 to 2026-11-20. Comment counts and 👍 as reported in the snapshot; "undefined" comment counts on PRs reflect missing data in the source feed.*

---

## Cross-Ecosystem Comparison

# Cross-Project Comparison Report: Personal AI Assistant / Agent Open-Source Ecosystem
**Snapshot Date: 2026-11-20**

---

## 1. Ecosystem Overview

The personal AI assistant open-source landscape on 2026-11-20 is characterized by **intense feature velocity paired with release-engineering fragility**. All four active projects (OpenClaw, Hermes Agent, QwenPaw, ZeroClaw) show elevated issue/PR throughput, but only Hermes Agent shipped a stable release (v0.23.3) in the window; OpenClaw's beta landed atop a persistent update-failure cluster, QwenPaw sits in a regression-heavy `post1` stabilization phase, and ZeroClaw recorded **zero merges in 24h** ahead of its v0.9.1 gate. A common maturation arc is visible: every project is simultaneously **modularizing (plugin/MCP extraction), hardening update/migration paths, and pushing channel-adapter parity**. IronClaw was inactive.

---

## 2. Activity Comparison

| Project | Issues (updated/24h) | PRs (updated/24h) | Merged/Closed PRs | Release Status | Health Score* |
|---|---|---|---|---|---|
| **OpenClaw** | 466 (~72% open) | 500 (~61% awaiting review) | 193 | v2026.11.6 stable + v2026.11.10-beta.1 | 6.5 / 10 (feature-strong, update-fragile) |
| **Hermes Agent** | 50 | 50 | 8 | v0.23.3 stable (~370 PR rollup) + canary | 7.0 / 10 (strong throughput, P2 backlog) |
| **QwenPaw** | 24 | 32 (25 open / 7 closed) | 7 | No release today; `v2.3.0.post1` regression phase | 6.0 / 10 (responsive but regression-heavy) |
| **ZeroClaw** | 12 (10 open / 2 closed) | 50 (all open) | **0** | None; v0.9.1 gate crunch | 5.0 / 10 (merge-queue pileup, S1 hang) |
| **IronClaw** | — | — | — | — | Dormant |

*Health scores are subjective composites of throughput, merge velocity, open high-severity bugs, and release cadence — intended for relative ranking, not absolute comparison.

---

## 3. OpenClaw's Position

**Advantages vs. peers:**
- **Order-of-magnitude larger surface area** — ~10x the issue/PR volume of Hermes or QwenPaw; ~930 items touched in 24h vs. 100 for Hermes.
- **Fastest response on triage** — 193 PRs closed/merged in 24h, the highest absolute throughput in the cohort.
- **Most complete channel matrix** already shipped (Telegram, Matrix, Slack, Discord, Voice Call, Talk, Apple Watch) — Hermes, QwenPaw, and ZeroClaw are still closing channel-parity gaps (Hermes: BlueBubbles, Slack; QwenPaw: QQ, WeChat, DingTalk/Feishu; ZeroClaw: XMPP, Discord/Matrix approval buttons).
- **Template/ClawHub distribution model (v2026.11.10-beta.1)** — a first-class agent packaging/manifest ecosystem (`CLAW.md` + bundled skill folders) that no peer currently matches.

**Technical approach differences:**
- Gateway-centric architecture with a **shared SQLite state DB and WAL-based migration pipeline** — powerful but the direct source of its update fragility.
- Session persistence is synchronous and blocks the event loop at scale (#119720), an architectural debt peers have partially avoided by isolating gateways.
- Prompt-cache series freezing (PR #201710) is a leading indicator OpenClaw is optimizing for **token economics on OpenAI-compatible routes** — Hermes and QwenPaw are earlier in this cycle.

**Community size comparison:** OpenClaw's engagement profile (diamond/platinum-lobster-rated issues, 29-comment threads, multiple P0s under sustained discussion) indicates a **technically sophisticated, high-trust user base an order of magnitude larger** than the others. Hermes reports low 👍 counts (functional engagement); QwenPaw's users invest in detailed repros but are fewer; ZeroClaw's RFC culture is high-quality but small (CastelloBrancoTecnologia, NiuBlibing are repeatedly named contributors).

**Net position:** OpenClaw is the **reference platform** — feature-complete and widely deployed — but its **update/Doctor reliability is the ecosystem's single biggest trust risk**. A coordinated release-engineering epic (#197083, #164800, #200606, #198218, #194655) would convert its size advantage into a decisive lead.

---

## 4. Shared Technical Focus Areas

Requirements surfacing across **two or more** projects:

| Theme | OpenClaw | Hermes | QwenPaw | ZeroClaw | Underlying Need |
|---|---|---|---|---|---|
| **Update/migration atomicity** | #197083, #164800, #200606, #194655 | (implicit via v0.23.3 rollup) | post1 regressions #8811/#8812/#8815 | v0.9.1 gate (#11580, #12476) | Recoverable, transactional upgrades — no `state-migrated-no-rollback` dead ends |
| **Silent failure elimination** | #125764 (Telegram), #191476 (Matrix) | #158043 (notif truncation), #156923 (Slack loop) | #8475 (QQ flag reset), #8313, #8814 (WeChat) | #12569 (plugin false-load) | Failures must surface logs/warnings rather than drop messages or channels |
| **Plugin/MCP modularization** | ClawHub templates, trust flow | ACP session config (#81067), desktop MCP (#158065) | #8469 (MCP plugin), #8499 (local models) | #12216 (multi-registry origins) | Clean plugin boundaries with validated manifests |
| **Provider/credential correctness** | Codex helper regression (#196199) | #158061, #117442 (classifier) | #8579 → #8825 (disabled provider) | #11296 (URI ignored), #12422 (scoped creds RFC) | Predictable routing and never exposing credentials to the model |
| **Cost/budget transparency** | Prompt-cache invalidation (#198373, #202001) | — | Prefix-cache instability (#6952) | #10635 (global vs. profile budget), #12568 | Operators need accurate, non-misleading spend controls |
| **Local/offline model support** | — | #153962 (Ollama tool-call corruption) | #8826 (Rapid-MLX), #8472 (reranker) | #11296 (llama.cpp URI) | Privacy-first deployments must work end-to-end |
| **Channel approval parity** | mature across channels | Mobile capabilities (#142277) | #8827 (Telegram forum isolation) | #12557 (Discord/Matrix emoji) | Consistent UX for human-in-the-loop approval |
| **Session/transcript integrity** | #123792 (dup renders), #112638 | #154326 (stale anchor) | #8811 (UI containment) | #11676 (created_at corruption) | Deterministic, paginated transcripts |

**Convergent insight:** Every project is fighting the same three battles — **updates that cannot corrupt state, channels that cannot silently die, and costs that cannot surprise users.** These are now table-stakes requirements for any serious personal-agent deployment.

---

## 5. Differentiation Analysis

| Axis | OpenClaw | Hermes Agent | QwenPaw | ZeroClaw |
|---|---|---|---|---|
| **Primary focus** | Agent template ecosystem + broadest channel matrix | Desktop/mobile + multi-profile enterprise routing | China-region channels (QQ/WeChat/DingTalk/Feishu) + memory/retrieval | Rust performance + security/credential scoping |
| **Target users** | Power users, self-hosters, template authors | Teams, multi-profile operators, desktop-centric users | Regional (CN) deployments, WeChat/QQ integrators | Security-conscious ops, edge/self-hosted infra teams |
| **Architecture** | Gateway + shared SQLite + WAL migrations | Gateway + desktop client + profile-scoped state | Channel-isolated workers + plugin extraction arc | Rust daemon + canonical provider registry (V5) |
| **Distribution** | ClawHub + `CLAW.md` manifests | GitHub / Microsoft Store / Docker / Hermes Cloud | Website docs + multi-channel installers | Release binaries with 64 MiB size gate |
| **Language / stack** | TypeScript/Node + native SQLite | Mixed (TS + desktop) | Python (AgentScope lineage) | Rust |
| **Security model** | Native trust flow for templates | Provider-safety refusal classification | `tool_guard` (with #8513 AUTO/SMART gap closed) | RFC #12422 scoped operator credentials (V5 stack) |
| **Momentum stage** | Scaling a mature platform | Stabilizing after large rollup | Post-regression stabilization | Pre-release merge crunch |

**Strategic read:**
- **OpenClaw** is the horizontal platform play — widest surface, richest ecosystem, but bounded by release reliability.
- **Hermes** is the **workflow/desktop play** — its multi-profile friction (#112627, #146035, #151990, #154627, #157976) is the roadmap signal; solving config inheritance unlocks its enterprise story.
- **QwenPaw** is the **regional + memory play** — its Channel + memory investment (#8472 reranker, #7019 memory search separation) pairs with CN channel dominance; its blunt UI/UX feedback (#8817 "disaster-level") is a corrective signal.
- **ZeroClaw** is the **security/performance play** — the only Rust-first project, driving a credential-scoping RFC and canonical provider registry that others will likely adopt conceptually.

---

## 6. Community Momentum & Maturity

**Tiers by activity and maturity:**

| Tier | Projects | Characteristics |
|---|---|---|
| **Tier 1 — Scaling platform** | **OpenClaw** | ~930 items/24h, 193 merged, largest community; strained by release engineering, not adoption |
| **Tier 2 — High-velocity stabilizer** | **Hermes Agent** | 50/50 issues/PRs, 8 merges, stable release shipped; P2 backlog aging 3–6 months |
| **Tier 3 — Regression recovery** | **QwenPaw** | 24/32, 7 merged; same-day regression fixes are a strength, but 5 regressions from one release window is a warning |
| **Tier 4 — Release-gate crunch** | **ZeroClaw** | 50 open PRs, **0 merges** — highest pileup risk; strong RFC culture but lowest short-term throughput |
| **Inactive** | **IronClaw** | No activity |

**Rapidly iterating:** OpenClaw (feature releases, template ecosystem), Hermes (370-PR rollup cadence).
**Stabilizing:** QwenPaw (fixing post1 regressions), ZeroClaw (v0.9.1 gate but with merge paralysis).

**Merge-queue health ranking:** OpenClaw > Hermes > QwenPaw > ZeroClaw. ZeroClaw's zero-merge day is the outlier; a sustained 50-PR backlog with dependent stacks (#12450→#12452→#12453) is a **contributor-fatigue risk**.

---

## 7. Trend Signals

Extracted for AI agent developers:

1. **"Atomic updates or nothing" is now a competitive requirement.** Across OpenClaw (#197083), QwenPaw (post1 regressions), and ZeroClaw (v0.9.1 gate), upgrade/state-migration integrity is the #1 trust-killer — not feature gaps. **Invest in transactional state stores with rollback from day one.**

2. **Silent failures are the new P0.** Message loss and channel death (OpenClaw Telegram #125764, QwenPaw #8475/#8814, ZeroClaw #12569, Hermes #158043) recur universally. **Design for observable failure — every dropped message/closed channel must emit a log and a user-visible signal.**

3. **Prompt/cache economics are becoming architectural.** OpenClaw's prompt-cache invalidation cluster (#198373, #202001, PR #201710) and QwenPaw's 3-month-old prefix-cache instability (#6952) show token economics are now a **core runtime concern, not a tuning exercise**. Preserve prompt series and tool-set stability by design.

4. **Local/offline model support is table stakes and currently under-delivered.** Hermes #153962 (Ollama corruption) explicitly "completely blocks agentic use"; ZeroClaw #11296; QwenPaw #8826. **Tool-call formatting over local backends is a persistent weak link — validate against Ollama, llama.cpp, and MLX early.**

5. **Plugin/MCP standardization is the 2027 battleground.** Every project is extracting plugins (OpenClaw ClawHub templates, Hermes ACP + MCP, QwenPaw #8469/#8499, ZeroClaw #12216). **Manifest validation, trust flows, and multi-registry origins will define ecosystem lock-in.**

6. **Credential scoping is a maturing security theme.** ZeroClaw's RFC #12422 ("authorize the action, never expose the credential to the model") is the clearest articulation; OpenClaw's template trust flow and QwenPaw's closed `tool_guard` gap (#8513) point the same direction. **Treat credentials as operator-managed, action-scoped resources.**

7. **Cost transparency is a trust primitive, not a dashboard nicety.** ZeroClaw #10635 (global vs. profile budget mismatch) and #12568 (always-full cost bars) show misleading cost UX erodes operator trust as fast as a crash.

8. **Config inheritance and multi-profile hygiene are unmet in mature projects.** Hermes' systemic profile friction (#112627 and five related open issues) is the strongest roadmap signal in the cohort — the winner will be whoever ships **clean profile-scoped config/state resolution first.**

**Bottom line for developers:** Build for **recoverable state, observable failure, cache-stable prompts, and scoped credentials** — these are the four patterns that separate the projects users trust from those they merely use. Platform breadth (OpenClaw's play) and vertical depth (ZeroClaw's security or QwenPaw's regional channels) are both viable, but neither survives an unreliable upgrade path.

---

## Peer Project Reports

<details>
<summary><strong>Hermes Agent</strong> — <a href="https://github.com/nousresearch/hermes-agent">nousresearch/hermes-agent</a></summary>

# Hermes Agent — Project Digest
**Date: 2026-11-20** | Source: [github.com/nousresearch/hermes-agent](https://github.com/nousresearch/hermes-agent)

---

## 1. Today's Overview

Hermes Agent shows **very high activity** on 2026-11-20: 50 issues and 50 PRs updated in the last 24 hours, with a new patch release (v0.23.3) rolling up ~370 merged PRs since v0.23.2. The project is clearly in a stabilization phase for the v0.23.x line, with v0.24.0 curated notes expected to follow. Activity is dominated by bug fixes across gateway, desktop, agent runtime, and provider integrations — a healthy sign of active maintenance, though the backlog of long-lived P2 bugs (some dating to May 2026) suggests maintainer triage bandwidth is a bottleneck. Overall project health is **strong but strained**: high throughput on PRs, but a growing pile of unresolved core issues.

---

## 2. Releases

### v0.23.3 (Stable) — Released November 19, 2026
- **Type:** Patch release.
- **Content:** Rolls up ~370 PRs merged since v0.23.2 into a stable release for:
  - GitHub release (CLI and installers)
  - Microsoft Store app
  - Docker
  - Hermes Cloud
- **Breaking changes:** None indicated.
- **Migration notes:** None indicated. Full curated notes deferred to **v0.24.0**.
- **Link:** [v0.23.3](https://github.com/NousResearch/hermes-agent/releases)

### v0.23.2+canary.20261119T064637Z (Canary)
- **Type:** Pre-release (canary).
- **Content:** Desktop build artifacts (macOS Apple Silicon DMG and others) for the canary channel.
- **Notes:** Standard rolling canary; not for production use.

**Assessment:** No breaking changes to announce this cycle. The large PR rollup (370 PRs) indicates aggressive merge velocity and a healthy contribution pipeline.

---

## 3. Project Progress

**PRs merged/closed in last 24h: 8.** Notable closed PRs advancing fixes:

- **[#134830](https://github.com/NousResearch/hermes-agent/pull/134830) [CLOSED]** — `fix(kanban): separate worker liveness from progress; bound runtime by estimate`. Decouples heartbeat liveness from forward progress, giving the kanban dispatcher an enforceable runtime budget. Fixes a class of "phantom active workers" bugs.
- **[#146651](https://github.com/NousResearch/hermes-agent/pull/146651) [CLOSED]** — `fix(tui_gateway): cap pdf.attach page render size`. Replaces fixed-DPI full-size PNG rendering with long-edge-capped JPEG; adds raster and embedded-image fallbacks. Closes #146639.
- **[#118681](https://github.com/NousResearch/hermes-agent/pull/118681) [CLOSED]** — `fix(tests): align Windows fleet fallback with identity contract`. Test infrastructure alignment for Windows control-socket fallback.

**Feature advancement (open PRs in flight):**
- **Desktop in-app offers** — [#158060](https://github.com/NousResearch/hermes-agent/pull/158060) adds signed Portal offer dialogs, shown once as a dismissible dialog.
- **Mobile device capability requests** — [#142277](https://github.com/NousResearch/hermes-agent/pull/142277) enables agents to access phone camera/GPS/screen over the gateway.
- **A2A accept-then-poll workflow** — [#141947](https://github.com/NousResearch/hermes-agent/pull/141947) adds bounded client polling and task-ID resume.
- **Structured memory prefetch observations** — [#92118](https://github.com/NousResearch/hermes-agent/pull/92118) adds an optional provider-neutral side channel.

---

## 4. Community Hot Topics

**Most active Issues:**

1. **[#131859](https://github.com/NousResearch/hermes-agent/issues/131859) — "Cannot open a pull request via API: CreatePullRequest permission error" (64 comments, open since 2026-10-03)**
   - Tagged `blocked`, `cause/upstream`. Fork-based PR creation fails for a specific contributor account; issue creation and fork PRs still work.
   - **Underlying need:** Contributor unblocking. Long-running blocker (>6 weeks) with heavy discussion suggests an upstream (likely GitHub-side) permission mismatch, not a Hermes bug.

2. **[#34372](https://github.com/NousResearch/hermes-agent/issues/34372) — "BlueBubbles: webhook auto-registration includes 'updated-message', causing every iMessage to be processed twice" (10 comments, open since 2026-05-29)**
   - Duplicate `handle_message` invocations and divergent chat-ID variants per message.
   - **Underlying need:** Message-delivery correctness for iMessage integration. A fix PR exists: **[#116401](https://github.com/NousResearch/hermes-agent/pull/116401)**, which references this and #30708/#38339, deduplicating by message GUID.

3. **[#155028](https://github.com/NousResearch/hermes-agent/issues/155028) — "heartbeat poller full-scans state_meta every 5s; gated cron fires leave empty sessions + ~35 KB policy receipts" (8 comments)**
   - Performance issue on gateways running frequent script-gated cron jobs. Every cron fire leaves an empty session and a large policy receipt.
   - **Underlying need:** State DB read amplification and storage hygiene for high-frequency cron workloads.

**Most active PRs (no comment counts exposed, updated today):**
- [#158061](https://github.com/NousResearch/hermes-agent/pull/158061) — provider safety refusals misclassified as bad API keys (ports opencode#64844/#64910).
- [#81067](https://github.com/NousResearch/hermes-agent/pull/81067) — long-running ACP 0.11+ session-config surface update (open since 2026-08-07).

---

## 5. Bugs & Stability

**High-severity / high-impact (P2):**

| Issue | Title | Status | Fix PR? |
|---|---|---|---|
| [#158065](https://github.com/NousResearch/hermes-agent/issues/158065) | Desktop chats lose **all MCP tools** when `dashboard.turn_isolation: true` | Open, new today | None yet |
| [#153962](https://github.com/NousResearch/hermes-agent/issues/153962) | Local Ollama models emit malformed tool calls through Hermes — blocks fully local agentic use | Open | None |
| [#152435](https://github.com/NousResearch/hermes-agent/issues/152435) | Windows gateway never joins kill-on-close job — child processes survive `hermes gateway stop` | Open | None |
| [#147606](https://github.com/NousResearch/hermes-agent/issues/147606) | Docker: dependency env never reused — every start reinstalls and disk fills up | Open | None |
| [#158043](https://github.com/NousResearch/hermes-agent/issues/158043) | Gateway bg-process notification truncates to 0 chars (line-boundary snap eats tail) | Open, new today | None |
| [#157976](https://github.com/NousResearch/hermes-agent/issues/157976) | Concurrent first lookups wipe a profile's `$HERMES_HOME` plugin registration | Open | None |
| [#158003](https://github.com/NousResearch/hermes-agent/issues/158003) | `hermes mcp login square`: OAuth consent succeeds, then "Authentication failed: Not Found" | Open | None |
| [#156923](https://github.com/NousResearch/hermes-agent/issues/156923) | Slack bot loop guard drops first message from bot without user ID | Open | None |
| [#147070](https://github.com/NousResearch/hermes-agent/issues/147070) | `_recover_rate_limit` sleeps up to 600s on `Retry-After` before rotating credential pool | Open | None |
| [#140431](https://github.com/NousResearch/hermes-agent/issues/140431) | Voice turn drops route's own `fallback_chain` — refused turn strands session | Open | None |
| [#154326](https://github.com/NousResearch/hermes-agent/issues/154326) | Desktop transcript collapses to stale anchor after WS disconnect storm | Open | None |
| [#154627](https://github.com/NousResearch/hermes-agent/issues/154627) | Multi-profile install: duplicate `clawlink-hermes-plugin` workspace member | Open | None |
| [#93592](https://github.com/NousResearch/hermes-agent/issues/93592) | `background_review` ignores auxiliary `fallback_chain` on primary provider failure | Open (since Aug) | None |

**Closed today (fixes landed):**
- **[#148241](https://github.com/NousResearch/hermes-agent/issues/148241) [CLOSED]** — SSL_CERT_FILE ignored by provider clients since 0.22.6 (TLS failure behind intercepting proxies).
- **[#148472](https://github.com/NousResearch/hermes-agent/issues/148472) [CLOSED]** — memory merge writes against hardcoded 20k budget vs 2.2k live limit.

**Regressions/severity notes:**
- **#153962 (Ollama tool-call corruption)** is the most severe for the privacy-first/local-model use case — the issue explicitly states it "completely blocks agentic use."
- **#158065 (MCP tools vanish with turn_isolation)** is a new P2 today with zero comments — likely under-triaged.

---

## 6. Feature Requests & Roadmap Signals

**Open feature requests likely to shape v0.24.0:**

1. **[#112627](https://github.com/NousResearch/hermes-agent/issues/112627) — Configuration inheritance** for profiles (avoid duplicating 50 full configs). Tagged `needs-decision`. Strong candidate for next minor release given multi-profile friction appears repeatedly across issues.
2. **[#142277](https://github.com/NousResearch/hermes-agent/pull/142277) — Mobile device capability requests** (camera, GPS, screen, notifications) via gateway. Large-scope feature refs #11911.
3. **[#158060](https://github.com/NousResearch/hermes-agent/pull/158060) — Desktop in-app offers from Nous Portal.** Client half already implemented; pairs with Portal-side work.
4. **[#92118](https://github.com/NousResearch/hermes-agent/pull/92118) — Structured memory prefetch observations.** Provider-neutral observation side channel.

**Prediction:** v0.24.0 curated notes (which will cover the ~370 PRs in v0.23.3) are the near-term milestone. Configuration inheritance (#112627) is the highest-signal roadmap item because it directly addresses repeated multi-profile pain documented across multiple bug reports.

---

## 7. User Feedback Summary

**Pain points surfaced:**
- **Multi-profile friction is systemic.** Issues #146035, #151990, #154627, #157976, and #112627 all trace back to profile-scoped state/plugin/config ambiguity. Users with multiple SSH connections and profiles report cross-contamination (bots opening the wrong chat) and broken plugin registration.
- **Local/offline model support is degraded.** #153962 (Ollama malformed tool calls) directly undermines Hermes's stated privacy-first pitch — a headline use case per the reporter.
- **Docker on-disk bloat.** #147606 reports the dependency environment is never reused, filling disks on long-running deployments.
- **Windows process management.** #152435 shows `hermes gateway stop` leaves orphaned processes.

**Satisfaction signals:**
- Low 👍 counts across most issues (0–1) suggest users are reporting bugs rather than rallying behind features — characteristic of a tooling project where engagement is functional.
- Rapid PR merges and releases imply active responsiveness, which generally correlates with user retention even amid unresolved P2s.

**Dissatisfaction signals:**
- Long-lived P2s remaining open for 3–6 months (e.g., #34372 since May, #93592 since August) may frustrate engaged users.

---

## 8. Backlog Watch

**Long-unanswered issues/PRs needing maintainer attention:**

| Item | Age | Concern |
|---|---|---|
| [#81067](https://github.com/NousResearch/hermes-agent/pull/81067) — ACP 0.11+ session-config surface | Open since 2026-08-07 (~3.5 mo) | Blocks ACP 0.11+ compatibility; tagged `cause/upstream`. |
| [#92118](https://github.com/NousResearch/hermes-agent/pull/92118) — Structured memory prefetch | Open since 2026-08-22 (~3 mo) | Memory architecture work stalled. |
| [#93592](https://github.com/NousResearch/hermes-agent/issues/93592) — background_review ignores fallback_chain | Open since 2026-08-24 (~3 mo) | P2, `needs-repro`; fallback reliability gap. |
| [#34372](https://github.com/NousResearch/hermes-agent/issues/34372) — BlueBubbles double-processing | Open since 2026-05-29 (~6 mo) | Fix PR #116401 open since 2026-09-19. |
| [#19337](https://github.com/NousResearch/hermes-agent/issues/19337) — MiniMax OAuth stale verification_uri | Open since 2026-05-03 (~6.5 mo) | P2, `cause/upstream`; blocked on MiniMax. |
| [#117442](https://github.com/NousResearch/hermes-agent/pull/117442) — error_classifier z-ai misclassification | Open since 2026-09-20 | Related provider-safety classification work in #158061. |
| [#41379](https://github.com/NousResearch/hermes-agent/issues/41379) — `reasoning_effort: none` silently dropped on Anthropic-protocol third parties | Open since 2026-06-07 (~5.5 mo) | P3; affects MiniMax M3/M2.7, Alibaba. |

**Recommendation:** The BlueBubbles pairing (#34372 + #116401) is the most actionable stale item — both an issue and a fix PR have been open for months and could be merged after review. The MiniMax OAuth issue (#19337) and ACP PR (#81067) are explicitly upstream-blocked and may warrant documented workarounds.

---

*Digest generated from GitHub activity data for 2026-11-20. All links point to GitHub under the NousResearch/hermes-agent repository.*

</details>

<details>
<summary><strong>IronClaw</strong> — <a href="https://github.com/nearai/ironclaw">nearai/ironclaw</a></summary>

No activity in the last 24 hours.

</details>

<details>
<summary><strong>QwenPaw</strong> — <a href="https://github.com/agentscope-ai/QwenPaw">agentscope-ai/QwenPaw</a></summary>

# QwenPaw Project Digest — 2026-11-20

## 1. Today's Overview

QwenPaw shows **high-velocity maintenance activity** with 24 Issues and 32 PRs updated in the last 24 hours, though the issue mix skews heavily toward bug reports and long-standing feature requests rather than new feature merges. The project is in a **post-`v2.3.0.post1` stabilization phase**: at least five regressions (#8811, #8812, #8815, #8796, #8814) trace directly to the `v2.3.0`/`post1` upgrade window, and several have already attracted candidate fix PRs (#8823, #8824, #8825). No new releases landed today, and PR throughput is asymmetric — 25 open vs. only 7 merged/closed — suggesting review bandwidth, not contributor supply, is the current bottleneck. Overall project health is **active but strained**: responsiveness to individual reports is good (same-day fixes appearing), yet recurring architectural gaps (channel event handling, provider/model config coupling, storage lifecycle) keep generating duplicate classes of bugs.

## 2. Releases

**No new releases today.** The latest line remains `v2.3.0.post1`, which itself is the source of multiple reported regressions. Notably, a docs PR (#8822) updating the website for v2.3.0 is open, indicating the release documentation is still being finalized.

## 3. Project Progress

Merged/closed activity today (7 PRs closed or merged) plus 12 closed Issues indicate meaningful triage throughput, even though the specific merged PR list is not itemized in the dataset. Key **closed Issues** resolving forward-looking work:

- **#4617** — Remote Playwright browser endpoint configuration for `browser_use` (long-requested resource-sharing feature) ✅ closed
- **#6421 / #8307** — QQ channel streaming output support ✅ closed
- **#8394** — XiaoYi channel heartbeat/status frame fix ✅ closed
- **#7002** — Server-side proxy client architecture discussion ✅ closed
- **#7019** — Separation of auto memory search vs. manual `memory_search` ✅ closed
- **#6593** — Unified cleanup page for agent data ✅ closed

**Open PRs advancing the codebase** (most active by review status):
- [#8469](https://github.com/agentscope-ai/QwenPaw/pull/8469) — `refactor(mcp): extract mcp into plugin` (XXXL, open since 10-28) — largest architectural change in flight
- [#8472](https://github.com/agentscope-ai/QwenPaw/pull/8472) — reranker model center with multi-query precision history (XXL, Under Review)
- [#8790](https://github.com/agentscope-ai/QwenPaw/pull/8790) — restore SDK/worker logs lost after channel isolation (#8187) across 18 channels
- [#8719](https://github.com/agentscope-ai/QwenPaw/pull/8719) — runtime base-path deployment support (`QWENPAW_BASE_PATH`, Under Review)
- [#8825](https://github.com/agentscope-ai/QwenPaw/pull/8825) — fall back to global default when a run-config provider is disabled (direct fix for #8579)

## 4. Community Hot Topics

Ranked by comment engagement in last 24h:

1. **[#8811](https://github.com/agentscope-ai/QwenPaw/issues/8811)** (4 comments) — Narrow-screen message clipping and non-scrollable wide tables/code blocks. Regression introduced in `v2.3.0.post1`. *Underlying need:* responsive UI robustness — the same defect spans desktop and 375px mobile, indicating a CSS containment bug, not a niche edge case.
2. **[#8815](https://github.com/agentscope-ai/QwenPaw/issues/8815)** / **[#8700](https://github.com/agentscope-ai/QwenPaw/issues/8700)** / **[#6952](https://github.com/agentscope-ai/QwenPaw/issues/6952)** (3 comments each) — Scheduled-task invisibility, DoomLoopGate failing to trigger, and prefix-cache instability. *Underlying need:* **observability and determinism of long-running agent loops**; users cannot see or trust autonomous execution.
3. **[#8475](https://github.com/agentscope-ai/QwenPaw/issues/8475)**, **[#8313](https://github.com/agentscope-ai/QwenPaw/issues/8313)**, **[#8627](https://github.com/agentscope-ai/QwenPaw/issues/8627)** (3 comments each) — Silent config resets, dropped QQ group messages, Windows long-path failures. *Underlying need:* **silent-failure elimination** — the community repeatedly reports subsystems dying without logs or warnings.
4. **[#8821](https://github.com/agentscope-ai/QwenPaw/issues/8821)** (2 comments) — Windows desktop toast notifications on task completion. Strong upvote-worthy ergonomics request for long-running tasks.

## 5. Bugs & Stability

Ranked by severity (data loss / silent failure / security > UX degradation):

| Severity | Issue | Description | Fix PR? |
|---|---|---|---|
| 🔴 Critical | [#8513](https://github.com/agentscope-ai/QwenPaw/issues/8513) (closed) | Shell-wrapped outbound actions (SMTP/HTTP POST/@file-to-network) execute without approval under AUTO/SMART — **security detector gap** in `tool_guard` | Closed |
| 🔴 Critical | [#8814](https://github.com/agentscope-ai/QwenPaw/issues/8814) (open) | `RESPONSE_SCOPE_LIMIT`: active response routes never evicted → WeChat channel silently dies at 128 entries, only `-32603 internal error` logged | None yet |
| 🟠 High | [#8475](https://github.com/agentscope-ai/QwenPaw/issues/8475) (open) | QQ channel `enabled` flag silently reset to `false` on restart — no warning log, complete channel failure | None yet |
| 🟠 High | [#8313](https://github.com/agentscope-ai/QwenPaw/issues/8313) (closed) | QQ group messages dropped: gateway dispatches `GROUP_MESSAGE_CREATE`, specs only know `GROUP_AT_MESSAGE_CREATE` | Closed |
| 🟠 High | [#8812](https://github.com/agentscope-ai/QwenPaw/issues/8812) (open) | `startup_diagnostic` WARNING flood post-`post1`; DingTalk/Feishu unavailable by default until manual update | None yet |
| 🟠 High | [#8579](https://github.com/agentscope-ai/QwenPaw/issues/8579) (open) | Disabling a provider leaves stale run-config → all channels fail with `ProviderError` | ✅ [#8825](https://github.com/agentscope-ai/QwenPaw/pull/8825) |
| 🟡 Medium | [#8811](https://github.com/agentscope-ai/QwenPaw/issues/8811) (open) | Narrow-screen clipping / no horizontal scroll for tables & code | ✅ [#8823](https://github.com/agentscope-ai/QwenPaw/pull/8823) |
| 🟡 Medium | [#8796](https://github.com/agentscope-ai/QwenPaw/issues/8796) (open) | Mobile full-screen containers render under status bar (safe-area-inset) | ✅ [#8824](https://github.com/agentscope-ai/QwenPaw/pull/8824) |
| 🟡 Medium | [#8815](https://github.com/agentscope-ai/QwenPaw/issues/8815) (closed) | Scheduled-task conversations show no messages until completion | Closed |
| 🟢 Low-Med | [#6952](https://github.com/agentscope-ai/QwenPaw/issues/6952) (open) | Prefix cache instability from unsorted tool schemas — perf regression, 3+ months old | None yet |

**Pattern:** The most damaging class is **silent channel death** (#8814, #8475, #8313, #8394) — three of four already closed, but #8814 and #8475 remain open on long-running deployments. A second cluster is **UI regressions tied to `post1`**, all with fix PRs in flight.

## 6. Feature Requests & Roadmap Signals

Requested this period, with likelihood of near-term inclusion:

**Likely next (have open PRs or recently closed design):**
- **Follow-up suggestions** — [#8819](https://github.com/agentscope-ai/QwenPaw/pull/8819) open, ready for review
- **Reranker model center** — [#8472](https://github.com/agentscope-ai/QwenPaw/pull/8472) in review; matches the memory/retrieval investment pattern
- **Base-path deployment** — [#8719](https://github.com/agentscope-ai/QwenPaw/pull/8719) enables hosted/enterprise reverse-proxy setups
- **Plugin extraction (MCP, local models)** — [#8469](https://github.com/agentscope-ai/QwenPaw/pull/8469), [#8499](https://github.com/agentscope-ai/QwenPaw/pull/8499); a clear modularization arc

**Moderate signal:**
- **Windows native notifications** ([#8821](https://github.com/agentscope-ai/QwenPaw/issues/8821))
- **Telegram forum-topic session isolation** ([#8827](https://github.com/agentscope-ai/QwenPaw/issues/8827))
- **Chat storage lifecycle / recoverable deletion / scoped retention** ([#8816](https://github.com/agentscope-ai/QwenPaw/issues/8816)) — follows the closed #6593, suggesting demand is not yet fully satisfied
- **Rapid-MLX provider preset** ([#8826](https://github.com/agentscope-ai/QwenPaw/issues/8826)) — Apple Silicon local inference

**Longer-term / repeated asks:**
- **Web UI/UX overhaul** ([#8817](https://github.com/agentscope-ai/QwenPaw/issues/8817)) — unusually blunt feedback; likely requires a dedicated sprint rather than a single PR

## 7. User Feedback Summary

**Pain points (verbatim themes):**
- **"Silent failures are the dominant frustration."** Multiple users describe channels and configs dying with zero logs (#8475: "no warning log"; #8313: "silently dropped"; #8814: "no user-visible error"). This erodes trust more than any single crash.
- **UI regressions after `post1`** — #8811 user notes the clipping appeared *after* upgrade, describing it as a clear regression, not a missing feature.
- **Mobile/PWA polish gaps** — safe-area handling (#8796) and composer layout instability (#8685) suggest mobile is a first-class but under-tested surface.
- **Data accumulation anxiety** — #6593/#8816 show users fear uncontrolled growth of memory files, backups, and chat history with no unified cleanup.

**Positive signals:**
- Users invest significant effort in detailed reproduction steps and environment tables (e.g., #8627, #8821), indicating an engaged, technical user base.
- Maintainers are closing issues and attaching fix PRs within 24h for regressions (#8811→#8823, #8796→#8824, #8579→#8825), which is a strong responsiveness indicator.

**Dissatisfaction highlight:** #8817's author calls the UI/UX "灾难级别的" (disaster-level) compared to competing agents — the sharpest negative sentiment in this batch, and a signal that front-end coherence deserves roadmap priority.

## 8. Backlog Watch

Issues/PRs needing maintainer attention due to age or blocker status:

- **[#6952](https://github.com/agentscope-ai/QwenPaw/issues/6952)** — Prefix-cache instability from unsorted tool schemas. Open since **2026-08-12** (~3 months), 3 comments, no linked PR. This is a systemic performance/cost issue affecting every multi-turn session; deserves a milestone assignment.
- **[#8469](https://github.com/agentscope-ai/QwenPaw/pull/8469)** — MCP plugin extraction, `size/XXXL`, open since **2026-10-28** with no recorded comment activity and no review status. A large refactor this old risks bit-rot; either schedule review or explicitly defer.
- **[#8472](https://github.com/agentscope-ai/QwenPaw/pull/8472)** — Reranker model center (`XXL`, Under Review since **2026-10-28**). Ties into the memory strategy and the closed #7019; a decision checkpoint would unblock dependent work.
- **[#8499](https://github.com/agentscope-ai/QwenPaw/pull/8499)** — Local model management plugin extraction (`XXXL`, open since **2026-10-29**). Paired with #8469; both are load-bearing for the plugin architecture.
- **[#8719](https://github.com/agentscope-ai/QwenPaw/pull/8719)** — Runtime base-path support (Under Review, open since **2026-11-13**). Small in scope relative to its deployment impact; good candidate to merge before the next patch release.
- **[#8308](https://github.com/agentscope-ai/QwenPaw/pull/8308)** — Missing-provider 404 test fix, open since **2026-10-18** with no comments. Low-risk test improvement that has sat unreviewed for a month.

---

*Digest generated from GitHub activity for 2026-11-20. Counts reflect Issues/PRs updated in the preceding 24h; PR review status reflects the `Under Review` label where present.*

</details>

<details>
<summary><strong>ZeroClaw</strong> — <a href="https://github.com/zeroclaw-labs/zeroclaw">zeroclaw-labs/zeroclaw</a></summary>

# ZeroClaw Project Digest — 2026-11-20

## 1. Today's Overview

ZeroClaw shows **very high PR throughput but a stalled merge pipeline**: 50 PRs were updated in the last 24h, yet **zero were merged or closed**, leaving all 50 open. Issue activity is more balanced — 12 issues updated, 10 open and 2 closed — but several are high-risk security/runtime items (`risk:high`) that remain unresolved. Notably, the project is in a **release-gate crunch** for `v0.9.1`, with two release-tagged issues (#11580 binary size cap, #12476 gateway log flooding) in play and **no new releases published today**. The most concerning signal is a **new S1 (workflow-blocking) daemon startup hang** (#12570) filed today, plus a cluster of credential/security RFC work (#12422 and dependent PRs) signaling the project is mid-refactor on its identity/access model. Overall health: **active and ambitious, but merge velocity and release readiness are the bottlenecks.**

---

## 2. Releases

**None.** No new releases published on 2026-11-20. The project is tracking toward `v0.9.1`, with at least two release-gated issues (#11580, #12476) and multiple PRs labeled `release:v0.9.1` still open. No changelog, breaking changes, or migration notes to report.

---

## 3. Project Progress

**Merged/closed PRs today: 0.** No PRs landed in the last 24h — the entire 50-PR update set remains open. Progress is therefore *visible only in issue closures*:

- **#12217 [CLOSED]** — Docs fix: Email tools-only setup now clarifies that approval routes also start the IMAP listener. ([link](https://github.com/zeroclaw-labs/zeroclaw/issues/12217))
- **#12476 [CLOSED]** — Bug: Gateway logged every connection at INFO via `spawn!`, flooding the runtime trace. Closed, but no linked merge PR confirmed in this dataset. ([link](https://github.com/zeroclaw-labs/zeroclaw/issues/12476))

Feature work that *advanced* (updated, not merged) clusters around:
- **Canonical provider registry (V5)** — PRs #12450, #12452, #12453 form a dependent stack adopting a canonical model registry across providers, Zerocode, and the web UI.
- **Scoped credentials / identity-access** — PRs #12408, #12490, #12596, #12438 implement operator-managed HTTP/browser/SSH credentials tied to RFC #12422.
- **Channels & plugins** — XMPP channel (#11847), multi-registry plugin origins (#12216), and bounded tool-result preservation (#11911).

---

## 4. Community Hot Topics

Most-discussed items by comment count:

| Item | Comments | Link |
|---|---|---|
| **#11296** — llama.cpp/custom provider uses wrong URL/URI for models | 7 | [issue](https://github.com/zeroclaw-labs/zeroclaw/issues/11296) |
| **#9345** — Recalculate PR risk/size labels on every update | 7 | [issue](https://github.com/zeroclaw-labs/zeroclaw/issues/9345) |
| **#10635** — Runtime profile cost limit ignores effective global daily budget | 5 | [issue](https://github.com/zeroclaw-labs/zeroclaw/issues/10635) |
| **#11580** — x86_64 Linux release binary 0.7 MB under 64 MiB cap | 5 | [issue](https://github.com/zeroclaw-labs/zeroclaw/issues/11580) |
| **#12422** — RFC: Scoped use of operator-managed service credentials | 3 | [issue](https://github.com/zeroclaw-labs/zeroclaw/issues/12422) |

**Underlying needs analysis:**
- **#11296** reflects a real configuration-trust gap: users routing through non-localhost model routers (e.g., llama.cpp behind a proxy) find the configured URI silently ignored. This is core provider plumbing and blocks self-hosted/edge deployments.
- **#9345** is a maintainer-scale pain point — manual PR triage doesn't scale with 50-PR/day volume; automation is needed to keep risk labels honest.
- **#10635** exposes a **cost-safety inconsistency**: profiles advertise effectively unbounded budgets while a hardcoded `$10/day` global ledger rejects turns. This undermines operator trust in budget controls.
- **#12422** (RFC) is the anchor for a broad security refactor — the community is clearly pushing for "authorize the action, never expose the credential to the model."

---

## 5. Bugs & Stability

Ranked by severity (newly reported/updated today):

**🔴 S1 — Workflow blocked**
- **#12570** — *Daemon hangs at startup when the log directory holds millions of leaked `runtime-trace.tmp.*` files from failed rolling trims.* Two compounding defects: temp-file leak on trim error + unbounded accumulation → startup hang. **No fix PR identified.** ([link](https://github.com/zeroclaw-labs/zeroclaw/issues/12570)) — **Highest priority; recommend immediate triage.**

**🟠 S2 — Degraded behavior**
- **#12569** — `plugin install` / `plugin list --verify` falsely report a tool plugin as loading when a built-in tool name (e.g., `weather`) reserves it; runtime silently refuses registration. ([link](https://github.com/zeroclaw-labs/zeroclaw/issues/12569)) — **No fix PR.**
- **#10635** — Cost-limit mismatch (see Hot Topics). `status:in-progress`, `risk:high`. ([link](https://github.com/zeroclaw-labs/zeroclaw/issues/10635))

**🟡 S3 — Minor**
- **#11296** — Provider URI ignored for llama.cpp/custom providers. `status:accepted`, `risk:high`. ([link](https://github.com/zeroclaw-labs/zeroclaw/issues/11296))
- **#12568** — Dashboard Cost Overview bars scale to the largest figure, so the Monthly bar is always full (cosmetic but misleading). ([link](https://github.com/zeroclaw-labs/zeroclaw/issues/12568))

**✅ Closed today:** #12476 (gateway INFO log flooding).

**Fix-PR status:** No open PR in this dataset is explicitly linked as a fix for #12570 or #12569 — these are **unowned stability risks** entering the release window.

---

## 6. Feature Requests & Roadmap Signals

| Request | Signal | Likely next-version? |
|---|---|---|
| **#12557** — Simplify approvals for Discord & Matrix via emoji reactions | Fresh (2026-11-18), matches existing Telegram buttons | **Likely** — low-risk UX parity |
| **#11955** — Report Signal listener health in dashboard readiness | Channel observability gap | Possible |
| **#9345** — Auto-recalc PR risk/size labels | Maintainer tooling | Possible (CI) |
| **#12422** — Scoped operator-managed service credentials (RFC) | Security model change; already has dependent PRs #12408/#12490/#12596 | **Strong signal for v0.10+** |
| **#11580** — Resolve binary size gate policy | Release-blocking decision | **Must be decided for v0.9.1** |

**Prediction:** v0.9.1 will be dominated by *release-gate and stability fixes* (#11580, #12476, cost-limit #10635), not new features. The credential-scoping RFC (#12422) and its PR stack are the flagship **v0.10** theme. Channel approval parity (#12557) and plugin multi-registry (#12216) are plausible fast-follows.

---

## 7. User Feedback Summary

**Pain points (dissatisfaction):**
- **Self-hosted routing is fragile** — users configuring llama.cpp/custom routers find their URI ignored (#11296); configuration trust is broken.
- **Budget controls are inconsistent** — profiles claim unbounded cost, global ledger rejects at $10 (#10635). Operators cannot predict spend behavior.
- **Silent failures erode trust** — plugin install/list says "loaded" while runtime silently refuses it (#12569); daemon hangs from log-file leakage (#12570).
- **Channel UX is uneven** — Telegram has rich tool-approval buttons; Discord/Matrix lag behind (#12557).
- **Dashboard metrics mislead** — cost bars always full, no real budget reference (#12568).

**Satisfaction/positive signals:**
- Active, high-quality RFC culture (#12422) with contributors (CastelloBrancoTecnologia, NiuBlibing) shipping large dependent PR stacks — indicates a committed, capable contributor base.
- Rapid bug acknowledgment: #12476 closed within ~4 days; new bugs (#12569, #12570) filed with precise root-cause analysis (file:line references), suggesting sophisticated users.

**Net:** Users are technically advanced and demanding; the friction is concentrated in **config correctness, cost transparency, and release reliability** rather than core capability.

---

## 8. Backlog Watch

Long-unanswered or high-importance items needing maintainer attention:

- **#9345** — Open since **2026-07-24** (~4 months), 7 comments, `status:in-progress`, `risk:high`. PR-label automation still unresolved. ([link](https://github.com/zeroclaw-labs/zeroclaw/issues/9345))
- **#10391** — Open since **2026-08-26** (~3 months), `size:XL`, `risk:high`, `needs-author-action`; large bounded-delegation fix (#9872) with dependent docs PRs #12403/#12576 waiting on it. ([link](https://github.com/zeroclaw-labs/zeroclaw/pull/10391))
- **#11676** — Open since **2026-10-12**, session transcript `created_at` corruption fix, `size:XL`; no merge after ~5 weeks. ([link](https://github.com/zeroclaw-labs/zeroclaw/pull/11676))
- **#11847** — Native Rust XMPP channel with OMEMO, open since **2026-10-19**, `needs-maintainer-review`, `risk:high`. ([link](https://github.com/zeroclaw-labs/zeroclaw/pull/11847))
- **#10635** — Cost-limit bug open since **2026-09-05**, `priority:p1`, `risk:high`, still `in-progress`. ([link](https://github.com/zeroclaw-labs/zeroclaw/issues/10635))

**⚠️ Systemic concern:** With **50 open PRs and 0 merges in 24h**, the backlog of `size:XL`/`risk:high` PRs (many dependent on each other, e.g., the #12450→#12452→#12453 registry stack) risks a **merge-queue pileup** that delays v0.9.1. Recommend the maintainers prioritize (a) unblocking the S1 daemon hang, (b) resolving the #11580 release-size decision, and (c) triaging the oldest `needs-author-action` XL PRs to prevent contributor fatigue.

---

*All links point to `github.com/zeroclaw-labs/zeroclaw`. Comment counts for PRs were reported as `undefined` in the source data and are omitted from ranking.*

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*