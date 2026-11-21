# OpenClaw Ecosystem Digest 2026-11-21

> Issues: 333 | PRs: 500 | Projects covered: 5 | Generated: 2026-11-21 02:06 UTC

- [OpenClaw](https://github.com/openclaw/openclaw)
- [Hermes Agent](https://github.com/nousresearch/hermes-agent)
- [IronClaw](https://github.com/nearai/ironclaw)
- [QwenPaw](https://github.com/agentscope-ai/QwenPaw)
- [ZeroClaw](https://github.com/zeroclaw-labs/zeroclaw)

---

## OpenClaw Deep Dive

# OpenClaw Project Digest — 2026-11-21

## 1. Today's Overview

OpenClaw shows **very high maintenance activity** but a **troubled stability posture** on 2026-11-21: 333 issues were updated in the last 24 hours (245 still active) and 500 PRs were touched (305 still open). No new releases shipped, and the absence of a release while P0/P1 crash-loop and release-blocker issues remain open suggests the project is in a **stabilization phase rather than a shipping phase**. Activity is overwhelmingly concentrated in bug triage and reliability work — particularly around the managed-update pipeline, Gateway startup performance, plugin preparation stalls, and prompt-cache regressions. The signal-to-noise ratio is concerning: a large share of the top-commented issues are **regressions introduced between 2026.9.x and 2026.11.x**, indicating that recent feature velocity is outpacing regression coverage. Encouragingly, several fix PRs are in flight (`#202815`, `#202834`, `#202836`, `#202837`, `#202846`) and a handful of stale/closed issues (`#120385`, `#162914`, `#185064`, `#186326`, `#202246`) resolved today, showing the triage pipeline is not stalled.

---

## 2. Releases

**No new releases in the last 24 hours.** The most recent referenced versions in active reports are `2026.11.5` (stable candidate), `2026.11.5-beta.4`, and `2026.11.6` (referenced in a closed Discord duplicate-message issue). No changelog, breaking-change, or migration notes are available today. Maintainers should be aware that there is a substantial backlog of **update-pipeline blockers** (see §5) gating the next stable cut.

---

## 3. Project Progress

While no releases landed, **195 PRs were merged or closed** in the last 24 hours (out of 500 total updated). Notable closed issues include:

- **[CLOSED] #120385** — Code Mode tool catalog incomplete for scheduled/cron turns (stale, superseded by author correction). [Link](https://github.com/openclaw/openclaw/issues/120385)
- **[CLOSED] #162914** — Intermittent `Aborted | sandbox_provisioning` failures with rootless Podman sandbox. [Link](https://github.com/openclaw/openclaw/issues/162914)
- **[CLOSED] #185064** — GPT-6.1 Terra route/auth preparation failures (linked PR open). [Link](https://github.com/openclaw/openclaw/issues/185064)
- **[CLOSED] #186326** — Windows managed update SQLite file-lock timeout after npm layout repair. [Link](https://github.com/openclaw/openclaw/issues/186326)
- **[CLOSED] #202246** — 2026.11.6 goal-continuation prompts producing duplicate Discord reminders (P1, message-loss). [Link](https://github.com/openclaw/openclaw/issues/202246)
- **[CLOSED] #195279** — Background exec completion wake failing with "operator execution authority no longer active" (P1, security). [Link](https://github.com/openclaw/openclaw/issues/195279)

**Fix PRs advancing today** (open, awaiting review):
- `#202815` — stop recursive Git shims from exhausting agent sandboxes (sandbox stability). [Link](https://github.com/openclaw/openclaw/pull/202815)
- `#202834` — shorten WAL pins during cold transcript archival (DB performance). [Link](https://github.com/openclaw/openclaw/pull/202834)
- `#202836` — keep valid SQLite opens available after failed requests. [Link](https://github.com/openclaw/openclaw/pull/202836)
- `#202837` — release completed lease callers and keep input tests portable. [Link](https://github.com/openclaw/openclaw/pull/202837)
- `#202846` — preserve RFB cancellation and portable test ownership. [Link](https://github.com/openclaw/openclaw/pull/202846)
- `#201503` — tell hooks which turn started the command a completion run reports. [Link](https://github.com/openclaw/openclaw/pull/201503)
- `#202689` — keep dismissed automation failures out of the Inbox. [Link](https://github.com/openclaw/openclaw/pull/202689)
- `#196092` — store every reply in chat history for `claude-cli` backend. [Link](https://github.com/openclaw/openclaw/pull/196092)

---

## 4. Community Hot Topics

Ranked by comment count, the following issues dominate maintainer and community attention:

| # | Issue | Comments | Signal |
|---|-------|----------|--------|
| 1 | **[#160959](https://github.com/openclaw/openclaw/issues/160959)** — Gateway blocks for minutes on large external plugins (2026.9.6 regression) | 84 | 🔴 P0, crash-loop, diamond lobster |
| 2 | **[#191944](https://github.com/openclaw/openclaw/issues/191944)** — macOS `gateway stop`/`stop --force` both fail | 38 | P2, UX friction, stable |
| 3 | **[#197083](https://github.com/openclaw/openclaw/issues/197083)** — Post-install Doctor WAL publication leaves 11.3 partially finalized | 31 | 🔴 P0, release-blocker |
| 4 | **[#178359](https://github.com/openclaw/openclaw/issues/178359)** — `doctor --fix --non-interactive` hangs 15+ min | 31 | 🟠 P1, crash-loop |
| 5 | **[#168955](https://github.com/openclaw/openclaw/issues/168955)** — Startup regression 1030s vs 410s (Windows) | 23 | 🟠 P1, crash-loop |
| 6 | **[#182891](https://github.com/openclaw/openclaw/issues/182891)** — Prompt cache never reused (`cache read dropped N -> 0`) | 20 | P2, behavior |
| 7 | **[#200606](https://github.com/openclaw/openclaw/issues/200606)** — 2026.11.5 candidate Doctor blocks update with `changed=[]` | 19 | 🟠 P1 |
| 8 | **[#153899](https://github.com/openclaw/openclaw/issues/153899)** — Gateway drain waits full TimeoutStopSec | 11 | 🟠 P1, crash-loop |
| 9 | **[#198218](https://github.com/openclaw/openclaw/issues/198218)** — Doctor/update maintenance livelocks (platinum hermit) | 11 | 🟠 P1, crash-loop |
| 10 | **[#155868](https://github.com/openclaw/openclaw/issues/155868)** — Agent-sourced runs get reduced tool roster → prompt-cache miss | 11 | P2, security review |

**Underlying needs analysis:**
- **Update reliability is the #1 theme.** Six of the top-10 issues involve `openclaw update`, `doctor --fix`, WAL publication, or candidate validation (#197083, #178359, #200606, #198218, plus closed #186326). Users are clearly hitting **managed-update failures across platforms** (macOS, Windows, WSL2, Linux) and are losing trust in the upgrade path.
- **Startup/plugin performance is the #2 theme.** #160959, #168955, #174681, #187350 all describe Gateway startup or main-thread stalls of minutes to over 1000 seconds. The plugin-generation capture feature (#144252) is a recurring root cause.
- **Prompt-cache economics** (#182891, #198373, #155868) matters to power users paying per-token; cache-read collapsing to ~0–3% has real cost impact.

---

## 5. Bugs & Stability

Ranked by severity (P0 → P2), with fix status noted:

### 🔴 P0 / Release-Blockers
- **[#160959](https://github.com/openclaw/openclaw/issues/160959)** — Gateway event loop blocked for minutes capturing large external plugins (2026.9.6 regression, first shipped #144252). 84 comments, no new fix PR, needs maintainer review. **Highest-impact open bug.**
- **[#197083](https://github.com/openclaw/openclaw/issues/197083)** — Post-install Doctor WAL publication verification fails, leaving 11.3 partially finalized with external plugin breakage. UX release-blocker. [Fix shape clear but no new PR.]
- **[#158277](https://github.com/openclaw/openclaw/issues/158277)** — Talk on Watch (Apple Watch) fails with "Voice changed its remote network address." P0 / UX release-blocker, 7 comments.

### 🟠 P1 / Crash-Loop
- **[#178359](https://github.com/openclaw/openclaw/issues/178359)** — `doctor --fix --non-interactive` idles 15+ min, never reaches DB repair.
- **[#168955](https://github.com/openclaw/openclaw/issues/168955)** — Windows startup regression: ready ~1030s vs ~410s; `sidecars.control-ui-assets` blocks 477s.
- **[#168955](https://github.com/openclaw/openclaw/issues/168955)**, **[#153899](https://github.com/openclaw/openclaw/issues/153899)** (Gateway drain waits full `TimeoutStopSec`), **[#198218](https://github.com/openclaw/openclaw/issues/198218)** (Doctor/update livelock), **[#197515](https://github.com/openclaw/openclaw/issues/197515)** (Codex "data/settings upgrade unfinished" — merged fix #186506 not in release), **[#192524](https://github.com/openclaw/openclaw/issues/192524)** (scheduled agentTurn refused through `aws-sdk` provider).
- **[#174681](https://github.com/openclaw/openclaw/issues/174681)** — Regression: #172750 plugin preparation blocks Gateway main thread (fix already reverted on release branch). **Mitigation exists.**

### 🟡 P2 / Regressions & Behavior
- **[#182891](https://github.com/openclaw/openclaw/issues/182891)** & **[#198373](https://github.com/openclaw/openclaw/issues/198373)** — Prompt-cache never reused / history rewritten between turns (OpenAI-compatible routes). Cost impact.
- **[#200606](https://github.com/openclaw/openclaw/issues/200606)** — Candidate Doctor blocks 2026.11.3 → 2026.11.5 with `changed=[]`.
- **[#200756](https://github.com/openclaw/openclaw/issues/200756)** / **[#200610](https://github.com/openclaw/openclaw/issues/200610)** — Windows beta.2 → beta.4 update fails at package-swap; retained updater runtime paths exceed MAX_PATH and can't be deleted.
- **[#200224](https://github.com/openclaw/openclaw/issues/200224)** — 2026.11.5 beta refuses retired `agents.defaults.heartbeat`, but removing it re-enables heartbeats (catch-22).
- **[#177989](https://github.com/openclaw/openclaw/issues/177989)** — Kimi Code repeats tool calls / over-polls background processes.
- **[#162448](https://github.com/openclaw/openclaw/issues/162448)** — Linux desktop app minimize/maximize/close buttons overlap side panel (has `clawsweeper:queueable-fix`).
- **[#192496](https://github.com/openclaw/openclaw/issues/192496)** — Idle skills refresh still re-enters at 19–20 agents (symptom persists after PR #170341).

**Fix-PR availability:** Only a minor fraction of the top bugs have active fix PRs. The update-pipeline cluster (#197083, #200606, #200756, #200610) appears to need **maintainer-level product decisions**, not just code fixes — a risk for the next release.

---

## 6. Feature Requests & Roadmap Signals

Active feature requests updated today, with roadmap prediction:

| Issue | Feature | Likelihood in next version |
|-------|---------|----------------------------|
| **[#197297](https://github.com/openclaw/openclaw/issues/197297)** | Per-user secret vault for multi-user Gateways | Medium — needs security review, narrow core + plugin design proposed |
| **[#187264](https://github.com/openclaw/openclaw/issues/187264)** | Caller-scoped, same-conversation scheduling for non-owner channel requests | Medium — Slack use case, security review flagged |
| **[#178373](https://github.com/openclaw/openclaw/issues/178373)** | Run-level turn/token budget + default-on tool-loop detection | Medium-High — addresses runaway cost; config default change is low-risk |
| **[#131457](https://github.com/openclaw/openclaw/issues/131457)** (CLOSED) | Feishu (Lark) progress streaming mode | Low near-term — closed as stale, but parity request is durable |
| **[#130247](https://github.com/openclaw/openclaw/issues/130247)** | Cron `--until` / `--max-runs` + cumulative run counter | Medium — small, bounded scope |
| **[#170261](https://github.com/openclaw/openclaw/issues/170261)** | Matrix: deliver final reply as new message when streaming | Medium — search discoverability fix |
| **[#179685](https://github.com/openclaw/openclaw/issues/179685)** | IMAP durable processing handoff + inspectable outcomes | Low-Medium — opt-in reliability extension |
| **[#181791](https://github.com/openclaw/openclaw/issues/181791)** | Durable owner-native execution provenance for safe interruption recovery | Low near-term — architectural, Control Centre integration |
| **[#181579](https://github.com/openclaw/openclaw/issues/181579)** | Better progress narration grounding | Low — UX polish |

**Prediction:** The most likely near-term shipped features are **tool-loop budget defaults (#178373)** and **cron end conditions (#130247)**, since both are bounded and address cost/ops pain. The per-user vault (#197297) and caller-scoped scheduling (#187264) are strategically important but gated on security review.

---

## 7. User Feedback Summary

**Pain points (dissatisfaction):**
1. **Update pipeline is the dominant source of frustration.** Users on macOS, Windows 11, WSL2, and Linux all report managed updates failing, hanging, or leaving partially-finalized state (#197083, #178359, #200606, #200756, #200610, #198218). One user reported a single update window taking **5409 seconds** (#201251).
2. **Startup has regressed materially** — #168955 reports Windows ready time ~1030s vs ~410s prior; #187350 reports 58s per startup in plugin metadata rescan on Docker/NAS.
3. **Gateway unresponsiveness during plugin work** (#160959, #174681) — a minutes-long event-loop block is unacceptable for a personal assistant product.
4. **Cost leakage via prompt-cache failure** (#182891, #198373) — power users on OpenAI-compatible providers see cache-read collapse to 1–3%.
5. **Cross-platform polish gaps** — Linux desktop overlapping window controls (#162448), macOS gateway stop failing (#191944), iOS text-size control not working (#170428, closed), Android setup stuck on approval (#201489).

**Satisfaction signals:**
- Users are engaged and providing detailed, high-quality reproducers (e.g., #198218 reproduced on two versions, #201251 with exact timings). This is a **technically sophisticated, deeply invested user base**.
- The "diamond lobster" / "platinum hermit" issue-rating taxonomy shows a mature triage culture.
- Some fixes are landing and appreciated (closed #162914, #185064, #195279).

**Net sentiment:** Frustration is concentrated on the **update and startup experience**, not the core agent capability. Users clearly love the product enough to file 333 issues in 24 hours — but trust in shipping quality is eroding.

---

## 8. Backlog Watch

Long-unanswered or high-value issues/PRs needing maintainer attention:

| Item | Age | Why it matters |
|------|-----|----------------|
| **[#160959](https://github.com/openclaw/openclaw/issues/160959)** | Created 2026-09-29 (~7.5 weeks), 84 comments | Highest-comment P0; no new fix PR; still open. **Top backlog priority.** |
| **[#153899](https://github.com/openclaw/openclaw/issues/153899)** | Created 2026-09-20 (~9 weeks), 11 comments | Stale-flagged P1 crash-loop; Gateway drain waits full stop window. Needs maintainer review. |
| **[#155868](https://github.com/openclaw/openclaw/issues/155868)** | Created 2026-09-22 (~9 weeks), 11 comments | Tool-roster mismatch → prompt-cache miss; flagged `needs-security-review`. |
| **[#178373](https://github.com/openclaw/openclaw/issues/178373)** | Created 2026-10-20 (~4.5 weeks), 11 comments | Runaway-cost guardrails; needs product decision. |
| **[#138528](https://github.com/openclaw/openclaw/issues/138528)** | Created 2026-09-04 (~11 weeks), 9 comments | Stuck-session recovery discards `blocked_tool_call` cause; stale but fix-shape-clear. |
| **[#130247](https://github.com/openclaw/openclaw/issues/130247)** | Created 2026-08-26 (~13 weeks), 10 comments | Cron has no end conditions; long-standing, small scope. |
| **[#167622](https://github.com/openclaw/openclaw/issues/167622)** | Created 2026-10-09 (~6 weeks), 10 comments |

---

## Cross-Ecosystem Comparison

# Cross-Project Comparison Report — Personal AI Assistant / Agent Open-Source Ecosystem
**Date: 2026-11-21** | Projects analyzed: OpenClaw, Hermes Agent, IronClaw, QwenPaw, ZeroClaw

---

## 1. Ecosystem Overview

The personal AI assistant / agent open-source landscape on 2026-11-21 is characterized by **intense maintenance activity across a maturing, multi-front ecosystem**. Five projects were tracked; four showed high or very high activity, while one (IronClaw) was dormant. The dominant narrative is a **shift from feature velocity to stabilization and reliability hardening** — every active project is fighting regressions introduced by recent feature pushes (update pipelines, session-state durability, channel reliability, prompt-cache economics). A second clear theme is **infrastructure deepening**: local model management, credential/OAuth scoping, plugin APIs, and storage abstractions are being built out in parallel across projects. Community contribution pipelines are generally healthy, but **review throughput and a few structural blockers** (notably Hermes' upstream PR-permission bug and ZeroClaw's stalled merge queue) are emerging as the ecosystem's primary bottlenecks.

---

## 2. Activity Comparison

| Project | Issues Updated (24h) | Open Issues | PRs Updated (24h) | PRs Open | Merged/Closed | Release Status | Health Score |
|---|---|---|---|---|---|---|---|
| **OpenClaw** | 333 (245 active) | 245 | 500 | 305 | 195 | None (stabilization) | 🟡 6.5/10 |
| **Hermes Agent** | 50 | 39 | 50 | 44 | 6 | Canary v0.23.3 | 🟢 7.5/10 |
| **IronClaw** | 0 | — | 0 | — | 0 | None | ⚪ N/A (dormant) |
| **QwenPaw** | 16 | ~16 | 47 | 29 | 18 | None (post-v2.3.0.post1) | 🟢 7.5/10 |
| **ZeroClaw** | 12 | 12 | 49 | 48 | 1 | None | 🟡 6/10 |

**Notes on scoring methodology:** Health scores weigh (a) merge throughput relative to intake, (b) severity of open P0/P1 bugs, (c) release cadence, and (d) community responsiveness. OpenClaw scores lower despite the highest raw activity because of its release-blocker backlog and low fix-PR coverage on top bugs. ZeroClaw is penalized for a near-stalled merge queue. Hermes and QwenPaw are balanced despite different sizes.

---

## 3. OpenClaw's Position

**Advantages vs. peers:**
- **Scale of community:** OpenClaw is an order of magnitude larger than any peer — 333 issues and 500 PRs updated in a single day vs. ~50 for Hermes and ZeroClaw. This is a genuinely large, technically sophisticated contributor base producing high-quality reproducers (e.g., #198218 reproduced on two versions).
- **Mature triage culture:** The "diamond lobster" / "platinum hermit" issue-rating taxonomy indicates an established severity discipline that smaller projects lack.
- **Broadest platform surface:** Cross-platform coverage (macOS, Windows, WSL2, Linux, iOS, Android, Apple Watch) exceeds all peers, with correspondingly more integration surface.

**Disadvantages vs. peers:**
- **Lowest fix-PR coverage on top bugs.** Only a minority of OpenClaw's top-10 issues have active fix PRs; Hermes and QwenPaw routinely ship **same-day fix PRs** for P2 bugs. OpenClaw's top P0 (#160959) has been open ~7.5 weeks with no new fix PR.
- **No release in the window while release-blockers remain open** — a shipping-confidence gap that peers avoid through frequent canary cuts (Hermes) or rapid patch PRs (QwenPaw).
- **Feature velocity outpacing regression coverage**, evidenced by a large share of top issues being 2026.9.x → 2026.11.x regressions.

**Technical approach differences:**
OpenClaw runs the **heaviest, most architecturally complex stack** of the group — managed-update pipeline with WAL publication, plugin-generation capture, sandbox provisioning (rootless Podman), and a Gateway event loop that several bugs show is vulnerable to multi-minute stalls. Peers favor lighter, more modular architectures: QwenPaw is extracting local model management into a **Plugin Provider** (PR #8499) and Hermes is building a **storage abstraction layer** (PR #149566). OpenClaw's breadth buys capability but creates the very coupling (plugin prep → main-thread block) driving its top bugs.

**Community size comparison:** OpenClaw ≈ 6–7× Hermes Agent and ≈ 7× ZeroClaw in daily issue/PR volume; ≈ 20× QwenPaw in issue intake. It is the de facto reference implementation but also carries the largest maintenance debt.

---

## 4. Shared Technical Focus Areas

The following requirements are emerging **independently across multiple projects**, indicating ecosystem-level pain points rather than project-specific defects:

| Shared Requirement | OpenClaw | Hermes | QwenPaw | ZeroClaw | Specific Need |
|---|---|---|---|---|---|
| **Session/state durability** | #197083 (partial finalization) | #107149, #156335, #134290 (lock files, orphaned writers, vanishing turns) | #8580 (memory index never rebuilds) | #8794 (mid-work stop erases context), #12607 (memory contradiction) | Durable, self-healing session/transcript storage with no silent loss |
| **Silent-failure observability** | #160959 (event-loop block, no signal) | — | #8757, #8580, #8123 (health OK while broken) | #12597 (Telegram offset stall) | Subsystems must surface failure + auto-recover, not report "healthy" |
| **Update/install reliability** | #197083, #178359, #200606, #200756 (macOS/Windows/WSL2/Linux) | #158266 (Docker module missing), #155862 (first-run stall) | Windows file-lock races (#8835) | — | Cross-platform managed-update must be atomic and reversible |
| **Credential/OAuth scoping** | #197297 (per-user vault) | #149642, #152732, PR #156606 | — | #12422 (RFC), #12596 (browser grants) | Security-grade, scoped credential handling for multi-user/service auth |
| **Local inference management** | — | #158383 (llama.cpp provider bug) | #8649/#8647/#8648 (GPU, MLX, auto-update) | — | First-class local model lifecycle (download, GPU, update) |
| **Prompt-cache economics** | #182891, #198373, #155868 (cache-read → 1–3%) | — | — | — | Cache reuse correctness directly tied to per-token cost |
| **Channel reliability (messaging)** | Discord dup (#202246) | Feishu drops (#31336), LINE files (#155992) | WeChat polling death (#8757) | Telegram (#12597), WhatsApp (#12598) | Per-channel edge-case correctness and retry |

**The two strongest cross-cutting signals are (1) session/state durability and (2) silent-failure observability** — appearing in four and three projects respectively. These are the ecosystem's most urgent shared technical debts.

---

## 5. Differentiation Analysis

| Dimension | OpenClaw | Hermes Agent | QwenPaw | ZeroClaw |
|---|---|---|---|---|
| **Feature focus** | Full-stack assistant platform; managed updates, plugins, multi-channel | Plugin/credential infra, governance, storage abstraction | Local inference, Console UX, Office skills | Channel reliability, memory quality, security/identity |
| **Target users** | Power users, cross-platform personal assistant operators | Contributors, plugin developers, production/VPS operators | Desktop + mobile local-model users | Group-chat operators, service-auth users |
| **Architecture** | Heavy, tightly-coupled Gateway + plugin-generation capture + WAL update pipeline | Modular, storage-abstraction-in-progress, canary rolling releases | Plugin-Provider extraction, Console-centric | RFC/ADR-driven identity-access, WASM sandbox |
| **Release rhythm** | Slow, stabilization-gated | Frequent canary | Post-rollout patching | Stalled merge queue |
| **Distinctive bet** | Breadth + ecosystem scale | Plugin/credential security depth | Local inference as first-class | Security-grade identity (OIDC/ADR) |
| **Notable weakness** | Regression coverage | Upstream PR-permission blocker (#131859) | Responsive-UI regressions | Merge throughput (48 open PRs) |

**Key differentiators:** OpenClaw competes on **breadth and ecosystem gravity**; Hermes on **security/plugin infrastructure depth**; QwenPaw on **local-inference ownership**; ZeroClaw on **identity/security architecture**. Notably, **none of the four is converging on the same feature set** — they occupy complementary niches, which reduces direct head-to-head competition but also means users may combine projects (e.g., ZeroClaw's credential model with QwenPaw's local runtime).

---

## 6. Community Momentum & Maturity

**Activity tiers:**
- **Tier 1 (very high, at scale):** OpenClaw — 333 issues + 500 PRs/24h. Massive but strained.
- **Tier 2 (high, balanced):** Hermes Agent and QwenPaw — ~50–63 combined items/24h, with strong same-day fix-PR velocity.
- **Tier 3 (moderate, bottlenecked):** ZeroClaw — 61 items/24h but 1 merge; contributor supply outpaces review.
- **Dormant:** IronClaw — no activity.

**Rapidly iterating vs. stabilizing:**
- **Rapidly iterating:** ZeroClaw (new bug intake 7/12 filed yesterday; RFC/ADR design work) and QwenPaw (stacked local-model PR set, 18 PRs merged today).
- **Stabilizing:** OpenClaw (explicit stabilization phase, no release, regression triage) and Hermes (canary cadence, foundational storage refactor, P2 fix cadence).
- **Blocked:** ZeroClaw's *merge* throughput and Hermes' *external contribution* pipeline (#131859, 7 weeks) are the two clearest momentum inhibitors.

**Maturity signals:** All four active projects exhibit professional-grade hygiene — severity taxonomies, RFC/ADR processes, `ci-reviewed` tags, credential redaction (QwenPaw #8790), and detailed repro culture. Hermes and QwenPaw show the **healthiest responsiveness-to-activity ratio**; OpenClaw shows the **largest absolute engagement but weakest shipping confidence**; ZeroClaw shows **strong design ambition but review bandwidth constraints**.

---

## 7. Trend Signals

**Signals extracted from community feedback across all projects, with implications for AI agent developers:**

1. **Reliability is the new differentiator — not capability.** Every active project's top pain points are regressions, not missing features. *Implication:* ship regression coverage (golden-path tests for update, startup, session persistence) alongside features; treat reliability as a first-class product surface.

2. **"Silent failure" is the most trust-destroying bug class.** Memory indexes, channel pollers, and update pipelines all report healthy while broken (QwenPaw #8757/#8580, ZeroClaw #12597, OpenClaw #160959). *Implication:* build health signals that are *causal* (did the subsystem actually do its job?) rather than *liveness-only* (is the process up?).

3. **Session-state durability is table stakes for an "assistant."** Vanishing turns, orphaned writers, and permanent lock files (Hermes, ZeroClaw, OpenClaw) directly undermine the memory/transcript value proposition. *Implication:* invest early in a durable, crash-safe storage layer (Hermes' SQLite abstraction is the model to watch).

4. **Update/install is the #1 source of churn.** OpenClaw and Hermes both show cross-platform managed-update failures dominating frustration. *Implication:* make updates atomic, resumable, and observable; a broken updater erodes trust faster than any missing feature.

5. **Credential and OAuth scoping is the next infrastructure frontier.** Independently emerging in OpenClaw, Hermes, and ZeroClaw. *Implication:* design for multi-user, per-scope credentials and exact-match OAuth redirects now — plugin ecosystems will demand it.

6. **Local inference is becoming a first-class concern.** QwenPaw's GPU/MLX/auto-update stack and Hermes' llama.cpp issues signal that local model lifecycle management is moving from "nice to have" to expected. *Implication:* abstract the runtime so local and cloud backends share a provider interface.

7. **Prompt-cache economics matter to power users.** OpenClaw's cache-read collapse (1–3%) has direct cost impact. *Implication:* treat cache reuse correctness as a correctness bug, not an optimization.

8. **Review throughput, not contributor supply, is the ecosystem's constraint.** ZeroClaw (48 open PRs, 1 merge) and Hermes (44/50 open) show intake outpacing merge capacity. *Implication:* projects that invest in triage/merge automation and clear contributor blockers (Hermes #131859) will convert community energy into shipped value faster than those that don't.

---

*Report compiled from 2026-11-21 GitHub activity digests across OpenClaw, Hermes Agent, IronClaw, QwenPaw, and ZeroClaw. Health scores are comparative analyst assessments, not project-published metrics.*

---

## Peer Project Reports

<details>
<summary><strong>Hermes Agent</strong> — <a href="https://github.com/nousresearch/hermes-agent">nousresearch/hermes-agent</a></summary>

# Hermes Agent — Project Digest
**Date: 2026-11-21** | Source: github.com/nousresearch/hermes-agent

---

## 1. Today's Overview

Hermes Agent shows **very high sustained activity**, with 50 issues and 50 PRs updated in the last 24 hours — a strong signal of an actively maintained, widely deployed project. The ratio skews toward open work: 39 of 50 updated issues remain open, and 44 of 50 PRs are still open, indicating a healthy inflow of contributions but a possible review bottleneck. A new canary release (v0.23.3+canary.20261120T064609Z) shipped, continuing the frequent canary cadence. The dominant themes today are **stability/regression fixes** (gateway lifecycle, storage, file tools, skills symlinks) and **plugin/credential infrastructure** (OAuth scopes, credential scoping, quota attribution). A notable community dynamic is the PR handoff due to the long-standing `CreatePullRequest` permission bug (#131859), which is now the top-commented issue with 68 comments and is actively disrupting contributor workflows.

---

## 2. Releases

**v0.23.3+canary.20261120T064609Z** (released 2026-11-20)

- **Channel:** Canary (pre-stable). Includes the standard Hermes Desktop build matrix (notably macOS Apple Silicon DMG).
- **Changes / Breaking changes / Migration notes:** The provided release metadata does not enumerate a changelog, breaking changes, or migration steps. No schema or config migration guidance is included in this release note.
- **Assessment:** Routine canary cut consistent with the project's rolling release rhythm. Users on stable should not treat this as a promotion; there is no evidence in this data of a stable-tag bump. Notably, issue #158266 (closed today) reported a `ModuleNotFoundError: No module named 'hermes_state_runtime'` after updating a Docker deployment to latest/stable — worth confirming this class of packaging regression isn't present in the canary.

---

## 3. Project Progress

Six PRs were merged/closed in the last 24h. Highlights:

- **[PR #149566] [CLOSED] refactor(storage): SQLite backend for the storage interface** — Step 2 of #149558. Implements the storage interface with `main`'s schema/statements; not yet wired into runtime. Foundational for a future storage abstraction. https://github.com/NousResearch/hermes-agent/pull/149566
- **[PR #36235] [CLOSED] fix(docker): align compose examples with single-container dashboard pattern** — Removes user-facing Docker Compose drift. https://github.com/NousResearch/hermes-agent/pull/36235
- **[PR #54556] [CLOSED] fix: change DeepSeek default aux model from deepseek-chat to deepseek-v4-flash** — Modernizes the DeepSeek auxiliary default model. https://github.com/NousResearch/hermes-agent/pull/54556
- **[PR #155992] [CLOSED] feat(line): deliver files (xlsx/pdf) to LINE users via flex download buttons** — Workaround for LINE's lack of a `document` push type. https://github.com/NousResearch/hermes-agent/pull/155992
- **[Issue #84195] [CLOSED] Relax/remove the 57-char skill description truncation** — A long-debated skill-index quality issue was closed (with related #46005 and #150523 also closed today), suggesting a decision landed on skill description handling. https://github.com/NousResearch/hermes-agent/issues/84195

**Net read:** Progress today was concentrated in **storage architecture groundwork** and **platform/plugin polish**, rather than headline user-facing features.

---

## 4. Community Hot Topics

| Rank | Item | Comments | Link |
|---|---|---|---|
| 1 | **#131859 [OPEN] Cannot open a PR via API — CreatePullRequest permission error** (blocked, cause/upstream) | **68** | https://github.com/NousResearch/hermes-agent/issues/131859 |
| 2 | **#77253 [OPEN] Desktop code fences with no/text/yaml language not rendered** | **15** | https://github.com/NousResearch/hermes-agent/issues/77253 |
| 3 | **#156335 [OPEN] Kanban board removal orphans in-flight SQLite writers** | 7 | https://github.com/NousResearch/hermes-agent/issues/156335 |
| 4 | **#93592 [OPEN] background_review ignores auxiliary fallback_chain** | 7 | https://github.com/NousResearch/hermes-agent/issues/93592 |
| 5 | **#107149 [OPEN] Killed git child leaves `<index>.lock`, checkpoints fail forever** | 7 | https://github.com/NousResearch/hermes-agent/issues/107149 |

**Underlying needs analysis:**

- **#131859 is a meta-blocker.** This permissions error prevents an entire account from opening PRs, and we can see its downstream effect directly in the data: **PR #150945** explicitly states its author cannot open PRs (#131859) and handed code to another contributor. This is now distorting the project's contribution pipeline and deserves top-level maintainer attention.
- **#77253** reflects ongoing friction in **Desktop markdown rendering fidelity** — users expect code blocks to render consistently regardless of language tag. High 👍 (3) for a rendering bug signals visible user pain.
- **#156335 / #107149** both cluster around **SQLite durability and locking** — orphaned writers and stale lock files that cause *permanent* failures until manual cleanup. These are the kind of "silent data-integrity" issues that erode trust in an agent that manages session state.

---

## 5. Bugs & Stability

Ranked by severity:

**P2 — High impact / data or session integrity**
- **#107149** Killed git child leaves `<index>.lock`; checkpoints fail forever until manual cleanup. *(tagged sweeper:risk-session-state)* https://github.com/NousResearch/hermes-agent/issues/107149
- **#156335** Kanban board removal orphans in-flight SQLite writers; COMMIT can silently land on relocating board. *(P2)* https://github.com/NousResearch/hermes-agent/issues/156335
- **#155862** Desktop falls into first-run setup when `hermes --version` exceeds 15s probe (blobless clone / missing release commit). https://github.com/NousResearch/hermes-agent/issues/155862
- **#134290** Desktop: completed turns vanish from transcript after switching sessions (DB rows intact). *(sweeper:risk-session-state)* https://github.com/NousResearch/hermes-agent/issues/134290
- **#152435** Windows gateway never joins its kill-on-close job; started processes survive `gateway stop`. *(os/windows)* https://github.com/NousResearch/hermes-agent/issues/152435
- **#156258** App re-selects app-managed local backend despite remote Primary → profile-owned chats 404. *(area/profiles)* https://github.com/NousResearch/hermes-agent/issues/156258
- **#158256** Auto-started `--idle-exit` gateway for HERMES_HOME outside `~/.hermes` never idle-exits (resource leak). https://github.com/NousResearch/hermes-agent/issues/158256
- **#158383** Cron jobs on managed llama.cpp runtime store provider `'custom'` → 401 on every run. https://github.com/NousResearch/hermes-agent/issues/158383
- **#158390** [iOS beta] Live Activity stuck on "Thinking · 0 tools"; relay reports never reach lock screen. https://github.com/NousResearch/hermes-agent/issues/158390

**P2 — Correctness regressions with fix PRs already open**
- **#158266 [CLOSED]** Docker `ModuleNotFoundError: hermes_state_runtime` on every chat request after update. *(Resolved today.)* https://github.com/NousResearch/hermes-agent/issues/158266
- **#148023 [CLOSED]** Gateway self-restart loop — startup native-session recovery blocks event loop; watchdog exits 75. *(Resolved today.)* https://github.com/NousResearch/hermes-agent/issues/148023
- **#157146** `core_lock_upgrades()` forces `-P` pin over plugin upper bounds — regression from `950c35d0ef4`. https://github.com/NousResearch/hermes-agent/issues/157146
- **#150298** ACP tool mapping still references removed `browser_*` tools; `browser_exec` unmapped. https://github.com/NousResearch/hermes-agent/issues/150298

**Fix PRs opened today (positive signal — fast response):**
- **PR #158428** `search_files` offset paging no longer repeats/skips results. *(ci-reviewed)* https://github.com/NousResearch/hermes-agent/pull/158428
- **PR #158429** MCP octet-stream PDFs/images now saved with detected extension and readable. *(ci-reviewed)* https://github.com/NousResearch/hermes-agent/pull/158429
- **PR #158432** `FooteredReply.__deepcopy__` crash + unpruned dead platform writers. https://github.com/NousResearch/hermes-agent/pull/158432
- **PR #158399** A failed gateway stop no longer leaves gateway running until SIGKILL. https://github.com/NousResearch/hermes-agent/pull/158399
- **PR #150540** Keep `hermes --version` probes local-only (directly addresses #155862 class). https://github.com/NousResearch/hermes-agent/pull/150540
- **PR #158437** Count full reads on confined local backends so `write_file` can overwrite. https://github.com/NousResearch/hermes-agent/pull/158437
- **PR #158436** `skill_manage` resolves per-skill symlinked installs. https://github.com/NousResearch/hermes-agent/pull/158436

**Stability verdict:** The bug volume is elevated but the **response velocity is strong** — multiple P2 issues already have same-day fix PRs (`ci-reviewed`). The persistent concern is the **SQLite/session-state cluster** (lock files, orphaned writers, vanishing turns), which keeps recurring across P2 sweeper-tagged issues and suggests a systemic durability gap rather than isolated defects.

---

## 6. Feature Requests & Roadmap Signals

Active feature requests, ranked by likely roadmap relevance:

1. **Plugin OAuth hardening** — #149642 (expose `redirect_port` for exact-match IdPs), #152732 (comma-separated scopes + pinned redirect port for Linear). Both P2, both updated today, both blocking real plugin catalog entries. **High likelihood of near-term inclusion** given concrete downstream blockers. https://github.com/NousResearch/hermes-agent/issues/149642 · https://github.com/NousResearch/hermes-agent/issues/152732
2. **Per-provider model allow/blocklist** — #126996 (👍: 4, needs-decision). Users see 16 stale Anthropic models in `/model` with no way to filter. Strong community support. https://github.com/NousResearch/hermes-agent/issues/126996
3. **Plugin API for staged memory/skill writes** — #148313 (`write_approval` public API). Enables messaging-platform admins to approve pending writes. https://github.com/NousResearch/hermes-agent/issues/148313
4. **Runtime governance gate + tamper-evident audit trail** — #157274 (P3 security). Proposes a single policy machine + immutable audit. Early-stage but signals enterprise/compliance ambitions. https://github.com/NousResearch/hermes-agent/issues/157274
5. **Credential scope + quota attribution host producers** — PR #156606 (open, P2). Host half of an "AutoRouter free-access contract." If merged, this is a meaningful infrastructure addition. https://github.com/NousResearch/hermes-agent/pull/156606
6. **Spoiler images in gateway replies** — #158416 (Discord/Telegram). Low-complexity UX request. https://github.com/NousResearch/hermes-agent/issues/158416
7. **Plugin-catalog additions** — PR #158425 adds a `skill-review` Desktop plugin (visual diff accept/reject for staged writes), complementing #148313. https://github.com/NousResearch/hermes-agent/pull/158425

**Prediction:** The plugin-OAuth pair (#149642/#152732) and the staged-write API (#148313) are the most likely candidates for the next canary cycle, as they have clear blocking dependencies and active PR/catalog pressure behind them.

---

## 7. User Feedback Summary

**Pain points:**
- **Contribution friction is the loudest signal.** #131859 (68 comments) shows a real account blocked from opening PRs for ~7 weeks, with a documented handoff in #150945. Contributors are routing around the platform.
- **Session/state durability distrust.** Multiple P2 reports of vanishing turns (#134290), orphaned writers (#156335), and permanent lock-file failures (#107149) create a "can I trust the transcript/storage?" concern central to an agent product.
- **Platform-specific breakage:** Windows gateway process lifecycle (#152435), iOS Live Activity (#158390), Feishu thread-message drops (#31336 — open since May, still active today), profile routing 404s (#156258).
- **Install/update fragility:** blobless-clone first-run stalls (#155862), Docker module-missing after update (#158266), and the `means

**Satisfaction indicators:**
- High sustained daily activity (50/50 issues/PRs), rapid same-day fix PRs, 👍 on #126996 and #146767, and users self-reporting production VPS usage (PR #158432 author: "found while running Hermes in production"). Users are invested enough to file detailed, well-tagged reports.

**Dissatisfaction indicators:**
- The `blocked / cause/upstream` tag on #131859 concedes the core blocker is outside the team's direct control — frustrating for the affected contributor.
- Recurring sweeper-tagged session-state issues suggest users keep hitting the same class of failure.

---

## 8. Backlog Watch

Important items needing maintainer attention, ordered by aging + impact:

- **#131859 (Open since 2026-10-03, 68 comments)** — The single most active issue; `blocked/cause/upstream`. It is suppressing contributions. A workaround, manual PR-opening path, or contributor triage is overdue. https://github.com/NousResearch/hermes-agent/issues/131859
- **#31336 (Open since 2026-05-24)** — Feishu gateway silently drops @mention messages in threads. Nearly **6 months old** with only 3 comments; a platform-integration gap left unreproduced/unaddressed. https://github.com/NousResearch/hermes-agent/issues/31336
- **#77253 (Open since 2026-08-03, 15 comments, 👍: 3)** — Desktop code-fence misclassification. High engagement but still open ~3.5 months — likely a small, contained fix awaiting a champion. https://github.com/NousResearch/hermes-agent/issues/77253
- **#93592 (Open since 2026-08-24)** — `background_review` ignores `fallback_chain`; tagged `needs-repro`, so it may be stalled awaiting reproduction info. https://github.com/NousResearch/hermes-agent/issues/93592
- **#107149 (Open since 2026-09-10)** — Permanent checkpoint lock-file failure; P2 session-state risk with a clear failure mode but no cited fix PR. https://github.com/NousResearch/hermes-agent/issues/107149
- **PR #150945 (Open since 2026-11-08)** — Clean-EOF stream close fix, a handoff PR; worth prioritizing given it's blocked on the contributor-permission situation. https://github.com/NousResearch/hermes-agent/pull/150945
- **PR #150540 (Open since 2026-11-07)** — Local-only version probes; directly mitigates the #155862 first-run bug class and appears ready for review. https://github.com/NousResearch/hermes-agent/pull/150540
- **PR #156606 (Open since 2026-11-16, P2)** — Credential-scope/quota host producers; significant infrastructure, awaiting review. https://github.com/NousResearch/hermes-agent/pull/156606

---

### Health Snapshot

| Dimension | Signal | Assessment |
|---|---|---|
| Activity | 50 issues + 50 PRs/24h, 1 canary | 🟢 Very high |
| Responsiveness | Same-day fix PRs for multiple P2 bugs | 🟢 Strong |
| Review throughput | 44/50 PRs open; only 6 merged/closed | 🟡 Review bottleneck risk |
| Stability | Recurring session-state/SQLite P2 cluster | 🟡 Systemic durability concern |
| Contribution pipeline | #131859 blocking contributors 7 weeks | 🔴 Needs urgent attention |
| Feature velocity | OAuth, governance, storage groundwork advancing | 🟢 Directional progress |

**Bottom line:** Hermes Agent is a fast-moving, well-instrumented project with excellent bug-response velocity, but two structural risks deserve near-term focus: (1) an upstream permissions blocker that is actively impeding external contributions, and (2) a recurring class of SQLite/session-state durability failures that, left unaddressed, undermines core user trust in the agent's memory and transcripts.

</details>

<details>
<summary><strong>IronClaw</strong> — <a href="https://github.com/nearai/ironclaw">nearai/ironclaw</a></summary>

No activity in the last 24 hours.

</details>

<details>
<summary><strong>QwenPaw</strong> — <a href="https://github.com/agentscope-ai/QwenPaw">agentscope-ai/QwenPaw</a></summary>

# QwenPaw Project Digest — 2026-11-21

## 1. Today's Overview

QwenPaw shows **high-velocity maintenance activity** with 47 PRs and 16 issues updated in the last 24 hours, though no new releases were cut. The project is in a stabilization phase following the `v2.3.0.post1` rollout, with a clear focus on Windows platform bugs, Console UI/UX polish, and CLI correctness. A notable cluster of frontend issues (#8811, #8845, #8844, #8839, #8796) points to mobile/responsive regressions introduced around `v2.3.0.post1`. On the PR side, a large stacked feature set (#8649/#8647/#8648) for local model GPU controls and runtime auto-update is under review, signaling continued investment in local inference. Overall project health is **strong but busy**: 18 PRs merged/closed today, but 29 remain open and several long-lived PRs (e.g., #8308, #8268, #8487) are still awaiting merge.

## 2. Releases

**None.** No new releases in the last 24 hours. The latest published version referenced across issues remains `v2.3.0.post1`, which appears to have introduced several regressions (see Bugs & Stability).

## 3. Project Progress

**18 PRs were merged or closed today.** Key items:

- **[#8499](https://github.com/agentscope-ai/QwenPaw/pull/8499) [CLOSED, size/XXXL]** — Extracted local model management into a Plugin Provider, moving downloads, llama.cpp installation, and service lifecycle out of the host while preserving existing user configs. This is a significant architectural refactor.
- **[#8784](https://github.com/agentscope-ai/QwenPaw/pull/8784) [CLOSED]** — Fixed multi-workspace skill rollback so backups are retained until every workspace is restored (five separate failure modes addressed).
- **[#8790](https://github.com/agentscope-ai/QwenPaw/pull/8790) [CLOSED, size/XXXL]** — Restored SDK and worker logs lost after channel isolation (#8187) across all 18 migrated channels, with credential redaction.
- **[#8835](https://github.com/agentscope-ai/QwenPaw/pull/8835) [CLOSED]** — Windows fixes: retry agent config saves on transient file locks, and wait for installer child processes to exit.
- **[#8512](https://github.com/agentscope-ai/QwenPaw/pull/8512) [CLOSED]** — Fixed status-code extraction from OpenAI-compatible gateway error text (resolves #8505).
- **[#8236](https://github.com/agentscope-ai/QwenPaw/pull/8236) [CLOSED]** — Ollama context window now derived from `num_ctx` rather than the 128k cloud default.

**In-flight feature work:** The stacked local-model PR set [#8649](https://github.com/agentscope-ai/QwenPaw/pull/8649) (llama.cpp GPU controls) → [#8647](https://github.com/agentscope-ai/QwenPaw/pull/8647) (managed MLX engine) → [#8648](https://github.com/agentscope-ai/QwenPaw/pull/8648) (Console controls) remains open and is the largest pending feature landing.

## 4. Community Hot Topics

| Item | Comments | Link |
|---|---|---|
| #8580 Memory tag index never rebuilds (503) | 6 | [Issue #8580](https://github.com/agentscope-ai/QwenPaw/issues/8580) |
| #8811 Narrow-screen message clipping | 4 | [Issue #8811](https://github.com/agentscope-ai/QwenPaw/issues/8811) |
| #8505 OpenAI gateway bare APIError misclassified | 3 | [Issue #8505](https://github.com/agentscope-ai/QwenPaw/issues/8505) |
| #8123 Daily Paper fails on truncated digest | 3 | [Issue #8123](https://github.com/agentscope-ai/QwenPaw/issues/8123) |
| #8821 Windows toast notifications after task | 3 | [Issue #8821](https://github.com/agentscope-ai/QwenPaw/issues/8821) |

**Underlying needs:**
- **#8580** reflects a recurring pattern: feature toggles (`auto_memory_generate_tags`) are enabled but their backing index silently fails, with no self-healing. Users want **observable, recoverable memory subsystems**.
- **#8811 / #8845 / #8844** collectively show that **Console responsiveness and accessibility regressed** post-upgrade — users on mobile, narrow viewports, and keyboard-only setups are all affected.
- **#8821** is a usability signal: long-running agent tasks push users to background the tab, so **native OS notifications** are a natural next-step expectation for a desktop assistant.

## 5. Bugs & Stability

Ranked by severity:

**Critical**
- **[#8830](https://github.com/agentscope-ai/QwenPaw/issues/8830)** — Windows: orphaned `llama-server.exe` processes accumulate across backend restarts, exhausting memory and blocking local model startup. **Fix PR exists:** [#8841](https://github.com/agentscope-ai/QwenPaw/pull/8841) (process group/job object isolation).
- **[#8757](https://github.com/agentscope-ai/QwenPaw/issues/8757)** — WeChat channel inbound polling silently dies: worker stays alive, health reports OK, no logs, cursor never resets. **No fix PR yet** — a silent-failure class bug that is hard to detect in production.

**High**
- **[#8580](https://github.com/agentscope-ai/QwenPaw/issues/8580)** — Memory tag index never rebuilds; `/memory/tags` returns 503 despite tags being generated. No fix PR linked.
- **[#8836](https://github.com/agentscope-ai/QwenPaw/issues/8836)** — Tool config pages with a `password` component enter an infinite refresh loop. **Fix PR exists:** [#8842](https://github.com/agentscope-ai/QwenPaw/pull/8842) (stops auto-save on untouched values).
- **[#8833](https://github.com/agentscope-ai/QwenPaw/issues/8833)** — `qwenpaw mission` CLI duplicates the `/api` prefix → requests `/api/api/chat/send`. **Fix PR exists:** [#8837](https://github.com/agentscope-ai/QwenPaw/pull/8837) (removes deprecated mission command entirely).
- **[#8832](https://github.com/agentscope-ai/QwenPaw/issues/8832)** — Auto CLI health check uses unsupported `HEAD /api/version` (405), so `_ensure_daemon_alive()` misreports daemon state.

**Medium / Regressions from v2.3.0.post1**
- **[#8811](https://github.com/agentscope-ai/QwenPaw/issues/8811)** — Narrow-screen text clipping (Chinese report).
- **[#8845](https://github.com/agentscope-ai/QwenPaw/issues/8845)** — Markdown tables overflow bubble with no horizontal scroll.
- **[#8844](https://github.com/agentscope-ai/QwenPaw/issues/8844)** — Message list not keyboard-focusable; arrow/PageUp/PageDown dead.
- **[#8839](https://github.com/agentscope-ai/QwenPaw/issues/8839) [CLOSED]** — Android Pad button group flows off-screen.
- **[#8796](https://github.com/agentscope-ai/QwenPaw/issues/8796) [CLOSED]** — Mobile full-screen containers render under the status bar (missing top safe-area-inset).

**Low**
- **[#8840](https://github.com/agentscope-ai/QwenPaw/issues/8840)** — Typo in LICENSE ("extra 'the' in Contribution definition").
- **[#8843](https://github.com/agentscope-ai/QwenPaw/issues/8843)** — Config docs list only `GET/PUT/DELETE /envs`; QA/guidance agent then suggests a PUT that deletes other env vars.
- **[#8123](https://github.com/agentscope-ai/QwenPaw/issues/8123)** — Daily Paper job fails wholesale on a single truncated digest (no per-paper retry).

## 6. Feature Requests & Roadmap Signals

- **[#8821](https://github.com/agentscope-ai/QwenPaw/issues/8821) [CLOSED]** — Windows native toast notification when an agent task completes. Closed quickly, suggesting maintainer interest; likely to land in a future Console/Desktop release.
- **Local model runtime controls** ([#8649](https://github.com/agentscope-ai/QwenPaw/pull/8649), [#8647](https://github.com/agentscope-ai/QwenPaw/pull/8647), [#8648](https://github.com/agentscope-ai/QwenPaw/pull/8648)) — GPU controls, managed MLX, and runtime auto-update. This is the strongest roadmap signal: QwenPaw is investing heavily in **first-class local inference management**.
- **Runtime base-path deployment** ([#8719](https://github.com/agentscope-ai/QwenPaw/pull/8719)) — `QWENPAW_BASE_PATH` for reverse-proxy prefix deployment, addressing enterprise/self-hosted needs.
- **[#8479](https://github.com/agentscope-ai/QwenPaw/pull/8479)** — Sync bundled Office skills (DOCX/PPTX/XLSX) with Anthropic's July 2026 update.

**Prediction:** The next minor release will likely bundle the local-model management feature set plus Console responsive fixes; the Windows notification request is a low-cost, high-visibility addition likely to be picked up.

## 7. User Feedback Summary

**Pain points (dissatisfaction):**
- **Silent failures are the dominant theme.** #8580 (memory tags), #8757 (WeChat polling), and #8123 (Daily Paper) all share a pattern: the system reports healthy while a subsystem is silently broken, with no retry, no log, no recovery. Users are explicitly frustrated by the lack of observability.
- **Mobile/responsive UX regressed in `v2.3.0.post1`** — multiple independent reporters (#8811, #8845, #8844, #8839, #8796) hit clipping, overflow, and focus issues across Android Pad, phones, and narrow Chrome viewports.
- **Windows platform friction** remains a recurring source of bugs: orphaned processes (#8830), file-lock races on config save (#8835), and process lifecycle issues.

**Positive signals:**
- Feature requests are being filed with well-structured templates (component checkboxes, repro steps), and several (#8821, #8839, #8796) were **closed within 1–2 days** — indicating responsive maintainership.
- Contributors are actively submitting fix PRs alongside bug reports (e.g., #8841 for #8830, #8842 for #8836), suggesting a healthy contributor pipeline.

## 8. Backlog Watch

Long-lived items needing maintainer attention:

- **[#8308](https://github.com/agentscope-ai/QwenPaw/pull/8308)** — Open since 2026-10-18 (~34 days): test fix for missing-provider 404. Small (`size/XS`) and low-risk; should be merged or closed.
- **[#8268](https://github.com/agentscope-ai/QwenPaw/pull/8268)** — Open since 2026-10-16 (~36 days): bounds the run completion callback and cleans up `TaskTracker._runs` (fixes half of #8173). A hung callback leaking run entries is a real stability concern.
- **[#8487](https://github.com/agentscope-ai/QwenPaw/pull/8487)** — Open since 2026-10-29 (~23 days): recognizes URL-referenced media in tool-result folding during context compression.
- **[#8467](https://github.com/agentscope-ai/QwenPaw/pull/8467)** — Open since 2026-10-28 (~24 days): bumps `agentscope` to 2.0.11. Dependency bumps that sit for weeks can block downstream fixes.
- **[#8479](https://github.com/agentscope-ai/QwenPaw/pull/8479)** — Open since 2026-10-28, `size/XXXL`, first-time contributor: Office skills sync. Large PRs from new contributors often stall; a review commitment would help retention.
- **[#8123](https://github.com/agentscope-ai/QwenPaw/issues/8123)** — Open since 2026-10-08 (~44 days): Daily Paper truncation failure. No fix PR linked despite being a reproducible job-level failure.
- **[#8580](https://github.com/agentscope-ai/QwenPaw/issues/8580)** — Open since 2026-11-04: memory tag index 503. Active discussion (6 comments) but no linked fix.

**Recommendation:** Prioritize a triage pass on PRs older than 30 days (#8308, #8268) and assign an owner to the silent-failure issue cluster (#8580, #8757, #8123), as these erode trust in the assistant's reliability more than any single crash.

</details>

<details>
<summary><strong>ZeroClaw</strong> — <a href="https://github.com/zeroclaw-labs/zeroclaw">zeroclaw-labs/zeroclaw</a></summary>

# ZeroClaw Project Digest — 2026-11-21

## 1. Today's Overview

ZeroClaw shows a **high-velocity, maintenance-heavy development cycle** with 12 issues and 49 PRs updated in the last 24 hours. Activity is overwhelmingly concentrated on the open side: **0 issues closed and only 1 PR merged/closed**, against 48 open PRs and 12 active issues. The issue mix is dominated by newly filed bug reports (7 of 12 created on 2026-11-20), spanning channel reliability, memory recall correctness, MCP tool plumbing, config surfaces, and CI tooling. Several large, long-running PRs (XL/risk:high) continue to cycle through review, with notable work on OIDC/ADR governance, browser credential scoping, and retiring the LLM response cache. No releases landed today, and the merge queue is effectively stalled relative to intake — a signal worth watching for maintainer bandwidth.

## 2. Releases

**None.** No new releases were published in the last 24 hours. No migration or breaking-change notes to report.

## 3. Project Progress

Only **1 PR was merged/closed** in the last 24 hours (details not enumerated in the dataset), so hard progress is limited. However, several in-flight PRs indicate where work is converging:

- **[PR #12612](https://github.com/zeroclaw-labs/zeroclaw/pull/12612)** — `feat(memory)!: retire the local LLM response cache` (XL, risk:high). Removes the rarely-hit response cache and its four config keys. Note the `!` breaking-change marker; paired with issue [#12611](https://github.com/zeroclaw-labs/zeroclaw/issues/12611). A related test-only PR **[#12460](https://github.com/zeroclaw-labs/zeroclaw/pull/12460)** covers cache reopen/Unicode overwrite.
- **[PR #12596](https://github.com/zeroclaw-labs/zeroclaw/pull/12596)** — independent username/password and TOTP browser grants (XL), depending on #12517 and RFC #12422.
- **[PR #12479](https://github.com/zeroclaw-labs/zeroclaw/pull/12479)** — Anthropic `drop_block` fix so edited history no longer fails thinking requests.
- **[PR #12605](https://github.com/zeroclaw-labs/zeroclaw/pull/12605)** — MCP fix so FastMCP string results reach the model only once (mirrors issue [#12604](https://github.com/zeroclaw-labs/zeroclaw/issues/12604)).
- **[PR #12610](https://github.com/zeroclaw-labs/zeroclaw/pull/12610)** — dependency bump for `wasmtime-wasi` 48.0.10 to address RUSTSEC-2026-0587 (WASI sandbox escape on Windows, CVSS 7.5).

A cluster of stacked OIDC/ADR PRs (**[#12608](https://github.com/zeroclaw-labs/zeroclaw/pull/12608)**, **[#12609](https://github.com/zeroclaw-labs/zeroclaw/pull/12609)**, **[#12496](https://github.com/zeroclaw-labs/zeroclaw/pull/12496)**, **[#12497](https://github.com/zeroclaw-labs/zeroclaw/pull/12497)**, **[#12498](https://github.com/zeroclaw-labs/zeroclaw/pull/12498)**) reflects active identity-access architecture work.

## 4. Community Hot Topics

Ranked by comment count among updated items:

1. **[Issue #8794](https://github.com/zeroclaw-labs/zeroclaw/issues/8794)** — 6 comments. "Stopping the agent mid-work erases tool calls and thinking from context." Open since **2026-07-07** (S1, risk:high, status:accepted). A long-lived, high-severity context-loss bug — the most-discussed item today.
2. **[Issue #12422](https://github.com/zeroclaw-labs/zeroclaw/issues/12422)** — 5 comments. RFC on scoped, operator-managed service credentials (identity-access). Directly motivating PR #12596 and the OIDC cluster; strong architectural interest.
3. **[Issue #12022](https://github.com/zeroclaw-labs/zeroclaw/issues/12022)** — 2 comments. Opt-in external rerank stage for memory recall (`rerank_strategy = "external"`), status:in-progress.
4. **[Issue #12597](https://github.com/zeroclaw-labs/zeroclaw/issues/12597)** — 1 comment. Telegram channel offset stalls when voice transcription fails.

**Underlying need:** the community is pushing on three fronts — (a) **agent state integrity** (don't silently discard in-progress reasoning/tool calls), (b) **security-grade credential handling** for service auth, and (c) **memory quality** (reranking, dedup, recall accuracy). The RFC/ADR-heavy discussion suggests contributors are doing serious design work, not just drive-by filing.

## 5. Bugs & Stability

Ranked by severity (S1 = workflow blocked):

| Severity | Issue | Summary | Fix PR? |
|---|---|---|---|
| **S1** | **[#8794](https://github.com/zeroclaw-labs/zeroclaw/issues/8794)** | Stopping agent mid-work discards tool calls + thinking from context (web dashboard) | No (accepted, open since Jul) |
| **S1** | **[#12597](https://github.com/zeroclaw-labs/zeroclaw/issues/12597)** | Telegram voice transcription failure never advances offset → all later messages blocked | No |
| **S2** | **[#12607](https://github.com/zeroclaw-labs/zeroclaw/issues/12607)** | Memory recall misses saved fact, saves wrong answer, keeps both versions after correction | No |
| **S2** | **[#12606](https://github.com/zeroclaw-labs/zeroclaw/issues/12606)** | `a2a.client.peers` unsettable via config — wrong prefix `a2a_client` | No |
| **S2** | **[#12604](https://github.com/zeroclaw-labs/zeroclaw/issues/12604)** | FastMCP string results reach model twice | **Yes — [#12605](https://github.com/zeroclaw-labs/zeroclaw/pull/12605)** |
| **S3** | **[#12601](https://github.com/zeroclaw-labs/zeroclaw/issues/12601)** | CI `strict_test_only_proof` reads `base.sha` not merge-base | No |

**Notable:** two S1 "workflow blocked" bugs are open, and the oldest (#8794) has been unresolved since July — a stability concern. Only the S2 MCP duplication bug has a corresponding fix PR today. A security-relevant dependency issue (RUSTSEC-2026-0587) has a fix PR **[#12610](https://github.com/zeroclaw-labs/zeroclaw/pull/12610)** pending.

## 6. Feature Requests & Roadmap Signals

- **[#12614](https://github.com/zeroclaw-labs/zeroclaw/issues/12614)** — Browser tool lacks a file-upload action, blocking any form requiring attachment. The wrapped `agent-browser` CLI already supports upload, so this is a low-friction gap likely to land soon.
- **[#12598](https://github.com/zeroclaw-labs/zeroclaw/issues/12598)** — WhatsApp Web: send replies as quoted replies so group members know who was answered (mentions currently broken per #10976).
- **[#12022](https://github.com/zeroclaw-labs/zeroclaw/issues/12022)** — External rerank stage for memory (in-progress).
- **[#12611](https://github.com/zeroclaw-labs/zeroclaw/issues/12611)** / **[PR #12612](https://github.com/zeroclaw-labs/zeroclaw/pull/12612)** — Retire local LLM response cache.
- **[#12613](https://github.com/zeroclaw-labs/zeroclaw/issues/12613)** — "Deslop" cleanup tracker: dead code, inert features, comment/docs cruft.

**Prediction for next version:** the response-cache retirement (breaking), the MCP double-delivery fix, and the wasmtime security bump are the closest to merge-ready. Browser file-upload and Telegram offset fix are likely near-term candidates given clear scope. Credential-scoping/OIDC work is larger and likely lands across multiple releases.

## 7. User Feedback Summary

- **Pain points:** (1) *Loss of work* — stopping an agent wipes reasoning/tool context (#8794), a serious trust issue for interactive use. (2) *Channel reliability* — a single failed voice transcription bricks a Telegram channel (#12597), and WhatsApp group replies are ambiguous (#12598). (3) *Memory correctness* — users report the system both **missing** saved facts and **persisting contradictory versions** after correction (#12607), undermining the core memory value proposition.
- **Use cases:** Telegram/WhatsApp group assistants, browser automation with authenticated forms, service-to-service auth via operator-managed credentials.
- **Satisfaction signal:** users are engaged and constructive (detailed repro timelines, diagnostic details, e.g., #12607), and contributors are investing in RFCs/ADRs — a healthy sign. Dissatisfaction is concentrated on **state durability and channel edge cases**, not on fundamentals.

## 8. Backlog Watch

Long-lived items needing maintainer attention:

- **[Issue #8794](https://github.com/zeroclaw-labs/zeroclaw/issues/8794)** — Open since **2026-07-07** (~4.5 months), S1, risk:high, status:accepted but no fix PR. Highest-priority backlog item.
- **[Issue #12022](https://github.com/zeroclaw-labs/zeroclaw/issues/12022)** — Open since 2026-10-25, in-progress memory rerank; watch for PR.
- **[PR #11885](https://github.com/zeroclaw-labs/zeroclaw/pull/11885)** — "fence live policy cutovers," open since **2026-10-19**, self-described as *"formal final review: FAIL … not a request to merge."* XL and stalled.
- **[PR #11868](https://github.com/zeroclaw-labs/zeroclaw/pull/11868)** — Open since 2026-10-19, risk:high, depends on #12265; needs-maintainer-review.
- **[PR #11076](https://github.com/zeroclaw-labs/zeroclaw/pull/11076)** — Open since **2026-09-23** (~2 months), XL Antigravity CLI tool; long-running.
- **[PR #12271](https://github.com/zeroclaw-labs/zeroclaw/pull/12271)** / **[PR #12376](https://github.com/zeroclaw-labs/zeroclaw/pull/12376)** — Stacked web/Discord work; watch dependency chains.

**Health note:** with 48 open PRs and near-zero merge throughput today, the review bottleneck — not contributor supply — is the project's primary constraint. Clearing the long-open S1 (#8794) and the stalled XL review queue would materially improve project health.

---
*Digest generated from GitHub activity for 2026-11-21. Metrics: 12 issues updated (0 closed), 49 PRs updated (1 merged/closed), 0 releases.*

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*