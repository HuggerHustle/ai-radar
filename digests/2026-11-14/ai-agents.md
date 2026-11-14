# OpenClaw Ecosystem Digest 2026-11-14

> Issues: 333 | PRs: 500 | Projects covered: 5 | Generated: 2026-11-14 01:24 UTC

- [OpenClaw](https://github.com/openclaw/openclaw)
- [Hermes Agent](https://github.com/nousresearch/hermes-agent)
- [IronClaw](https://github.com/nearai/ironclaw)
- [QwenPaw](https://github.com/agentscope-ai/QwenPaw)
- [ZeroClaw](https://github.com/zeroclaw-labs/zeroclaw)

---

## OpenClaw Deep Dive

# OpenClaw Project Digest — 2026-11-14

## 1. Today's Overview

OpenClaw remains a high-velocity, high-complexity project with substantial daily churn: 333 issues and 500 PRs updated in the last 24 hours, though activity skews heavily toward maintenance rather than new capability (0 new releases). The project's health signal is mixed — a very active triage and fix pipeline (217 PRs merged/closed) coexists with a persistent queue of P0/P1 stability bugs, many of which are long-lived (some open since August-September 2026). Recurring themes across hot items are **Windows/macOS platform reliability**, **SQLite/Gateway memory and event-loop pressure at scale**, **message/subagent delivery loss**, and **CJK/i18n tokenization gaps** in search. The issue tracker shows a mature "clawsweeper" triage taxonomy (gold shrimp → platinum hermit ratings, fix-shape, needs-info flags), indicating a well-instrumented but heavily loaded maintainer workflow. No releases landed today, so today's digest is dominated by in-flight fixes and unresolved reliability blockers.

## 2. Releases

No new releases in the last 24 hours. No migration or breaking-change notes to report.

## 3. Project Progress

217 PRs were merged or closed today. Notable merged/closed or advanced work:

- **Stale/feature issues closed** (cleanup): #126950 (Telegram opaque callback payloads dropped — linked PR open), #192009 (cross-provider cron fallback authorization — product decision reached), #142037 (Slack thread-mismatch mute bookkeeping), #150029 (configurable automation Inspect link).
- **In-flight gateway/CI work**: #198194 (reduce resident memory on constrained ARM64 hosts, XL), #198265 (start default memory index managers at Gateway boot — closes #194164), #198547 (fix `agents.delete` stalling behind model-catalog build), #198553 (expire bound node with owner device), #193749 (GitHub publication with PostgreSQL session/state stores).
- **OpenClaw ID / access model advancing via stacked PRs**: #197770, #197748, #197782, #197785 (member roles, guest sandbox role, admin role semantics, Doctor role checks).
- **UI/E2E test stabilization**: multiple small PRs (#198533, #198534, #198538, #198544, #198555, #198537) aligning tests with the new composer/picker layout after #197820.
- **Explicitly rejected**: #198364 (CI credential-analysis tree walk — 1.51% gain below the 5% acceptance threshold).

## 4. Community Hot Topics

| Item | Comments | Link |
|---|---|---|
| #170956 Windows slow startup, unclean plugin shutdown, schtasks permission error (**P0**, crash-loop, release blocker) | 32 | openclaw/openclaw Issue #170956 |
| #119720 Synchronous agent persistence blocks Gateway event loop at scale (**P1**, message-loss) | 26 | openclaw/openclaw Issue #119720 |
| #126950 Telegram opaque callback payloads silently dropped (**P1**, CLOSED) | 16 | openclaw/openclaw Issue #126950 |
| #192009 Cross-provider cron fallback authorization (**P2**, CLOSED) | 14 | openclaw/openclaw Issue #192009 |
| #142037 Slack thread-mismatch mute bookkeeping (**P2**, CLOSED) | 14 | openclaw/openclaw Issue #142037 |
| #155119 Subagent final answer lost + duplicate settle events (**P1**) | 13 | openclaw/openclaw Issue #155119 |

**Underlying needs:** The top threads cluster around two fundamental promises users expect from a personal AI assistant: (a) **reliable restart/update on Windows and macOS** (managed-service lifecycle), and (b) **no silent message/subagent answer loss**. The Telegram and Slack threads reveal that cross-channel message-tool bookkeeping is fragile at the seams between plugin and core, while #192009 signals demand for **operator-controlled auth/failover policy** rather than opaque defaults.

## 5. Bugs & Stability

Ranked by severity (P0 → P2), with fix-PR status:

**P0 (release blockers):**
- **#170956** — Windows: slow startup, unclean plugin shutdown, `schtasks` EPERM breaks restarts/updates. 32 comments, still OPEN, `no-new-fix-pr`. [link](https://github.com/openclaw/openclaw/issues/170956)
- **#190563** — Cannot resume paused Codex chat: provider review/native thread mismatch (regression). OPEN, needs security review. [link](https://github.com/openclaw/openclaw/issues/190563)
- **#193094** — Managed update hangs 57 min in `validating`, then SIGKILLed. OPEN. [link](https://github.com/openclaw/openclaw/issues/193094)
- **#141413** — macOS app omits token for local Gateway using SecretRef (P0, auth). OPEN. [link](https://github.com/openclaw/openclaw/issues/141413)

**P1 (high impact):**
- **#119720** — Synchronous persistence/transcript maintenance blocks Gateway event loop (open since Aug). [link](https://github.com/openclaw/openclaw/issues/119720)
- **#191847** — 2026.10.10 large session repeatedly kills 512 MB SQLite worker (`ERR_WORKER_OUT_OF_MEMORY`), "admission is closed" (regression). [link](https://github.com/openclaw/openclaw/issues/191847)
- **#155119** — Subagent final answer lost + duplicate settle events, `deliveryStatus` stuck pending. [link](https://github.com/openclaw/openclaw/issues/155119)
- **#182369** — Gateway RSS grows ~0.1 GiB/h off-heap; internal monitor never fires. [link](https://github.com/openclaw/openclaw/issues/182369)
- **#185085** — Exec completion wakes still lost (`SESSION_DELIVERY_GENERATION_UNAVAILABLE`); fix #177063 not in stable. [link](https://github.com/openclaw/openclaw/issues/185085)
- **#155396** — Codex tool turns fail closed on `provenance_rejected` during final-answer recovery. [link](https://github.com/openclaw/openclaw/issues/155396)
- **#181120** — macOS Gateway stops responding, main thread blocked closing worker MessagePort. [link](https://github.com/openclaw/openclaw/issues/181120)
- **#156442** — claude-cli backend treats transient OAuth refresh-lock error as terminal. [link](https://github.com/openclaw/openclaw/issues/156442)

**P2 (notable):**
- **#197374** — Compaction silently degrades: 120s idle timeout caps configured budget. [link](https://github.com/openclaw/openclaw/issues/197374)
- **#197531** — macOS TTS reports truncated CAF from segmented MP3. [link](https://github.com/openclaw/openclaw/issues/197531)
- **#194164** — Memory indexing doesn't start after Gateway boot (fix PR #198265 open). [link](https://github.com/openclaw/openclaw/issues/194164)

**Observation:** Database/worker memory pressure (#191847, #182369, #119720) and delivery-loss (#155119, #185085, #166964) are the two dominant stability families. Several P1s remain `no-new-fix-pr` and `stale`.

## 6. Feature Requests & Roadmap Signals

- **Access control expansion** — OpenClaw ID member roles, guest sandboxed session tools, admin role semantics (#197748, #197770, #197782, #197785, #197739). Strongest roadmap signal for the next release.
- **Automation capacity governance** — #197394 (size automation run slots from agent limit) + #197395 (backoff when provider/memory pushes back). Related to #196859.
- **CJK/i18n search** — #170997 (bigram tokenizer for 2-char Chinese queries) and #140736 (sessions_search returns 0 for CJK). Rising priority for non-English users.
- **Cross-provider cron fallback authorization** — #192009 (closed, product decision made).
- **Memory plugin sidecar** — #198446 (run a memory plugin beside the slot owner).
- **Configurable Dream Diary language** — #79223 (closed).
- **MCP Events consumption** — #166586 (start an agent run per MCP event).
- **Unbypassable outbound policy enforcement** — #56349 (long-standing security feature).

**Prediction:** Access-control/roles work (stacked PRs already open) and memory index-at-boot are the most likely next-version deliverables; CJK tokenizer support is a strong candidate given two converging issues.

## 7. User Feedback Summary

**Pain points:**
- **Windows lifecycle is the #1 frustration** — restarts/updates "only work after many retries," with client-visible disconnects (#170956).
- **Silent data loss** — subagent final answers truncated/stuck pending (#155119), exec-completion wakes lost and never retried (#185085), and context injections rendered visibly to users (#165041).
- **Memory/infra ceilings** — Gateway OOM on large sessions (#191847), RSS creep (#182369), memory_search exceeding 30s deadline (#176187).
- **Platform-specific UI breakage** — iOS text-size control doesn't apply/persist (#170428); Safari 27.3 composer missing (#195192).
- **Tokenization/UX friction** — non-English (Chinese) users report search unusable (#140736, #170997).

**Satisfaction signals:** Users are deeply engaged and technically sophisticated (detailed environment stacks, structured logs, repro steps). The "clawsweeper" ratings and multi-comment threads suggest a loyal, invested community — but the volume of long-lived P1/P0s points to **maintainer bandwidth as the binding constraint**, and several fixes exist on `main` but not in stable (e.g., #185085), indicating a release-velocity gap.

## 8. Backlog Watch

Items needing maintainer attention (long-lived, high-impact, or blocked):

- **#119720** (open since 2026-08-05) — Event-loop blocking at scale; P1, `no-new-fix-pr`. Foundational architecture issue. [link](https://github.com/openclaw/openclaw/issues/119720)
- **#124306** (open since 2026-08-15) — Exec approval card never flags mount-point targets (data-loss risk, diamond lobster). Stale. [link](https://github.com/openclaw/openclaw/issues/124306)
- **#56349** (open since 2026-03-28) — Unbypassable outbound policy enforcement (platinum hermit, security). Long-standing. [link](https://github.com/openclaw/openclaw/issues/56349)
- **#166964** / **#155396** / **#166586** — Stale P1/P2 issues with `needs-maintainer-review` and no fix PR. [166964](https://github.com/openclaw/openclaw/issues/166964), [155396](https://github.com/openclaw/openclaw/issues/155396), [166586](https://github.com/openclaw/openclaw/issues/166586)
- **#136271** (msteams SharePoint dynamic resolution) — `not-repro-on-main`, stale since Sep. [link](https://github.com/openclaw/openclaw/issues/136271)
- **PR #165040** (iOS native notification settings) — open since 2026-10-04, `needs proof`. [link](https://github.com/openclaw/openclaw/pull/165040)
- **PR #198269** (NFC/NFD sidebar file search) — small, low-risk fix awaiting proof. [link](https://github.com/openclaw/openclaw/pull/198269)

**Health note:** The backlog contains many "stale but important" items where fixes exist on `main` but are absent from stable releases. Prioritizing a stable backport of #177063 (and similar) would likely reduce user-visible P1 volume more than net-new development this cycle.

---
*Data source: github.com/openclaw/openclaw. Digest generated 2026-11-14 from issues/PRs updated in the trailing 24h. Comment counts and rankings reflect GitHub metadata at capture time.*

---

## Cross-Ecosystem Comparison

# Cross-Project Comparison Report: Personal AI Assistant / Agent Open-Source Ecosystem
**Data window: 2026-11-14 (trailing 24h) | Projects: OpenClaw, Hermes Agent, IronClaw, QwenPaw, ZeroClaw**

---

## 1. Ecosystem Overview

The personal AI assistant / agent open-source landscape in late 2026 is bifurcating into two mature camps: **high-churn reference platforms** (OpenClaw, Hermes Agent, ZeroClaw) operating at hundreds of issues/PRs per day, and **release-driven downstream distributions** (QwenPaw) absorbing post-release regression waves. A third, quieter tier (IronClaw) represents specialized/niche implementations that trade velocity for focus. Across all active projects, the binding constraint has shifted from *feature velocity* to **reliability and security semantics** — message/subagent delivery loss, gateway event-loop pressure, sandbox/redaction boundaries, and credential handling dominate the highest-engagement threads. Security hardening is no longer a bolt-on: ZeroClaw and Hermes Agent are both running explicit "security marathon" campaigns, and community proposals increasingly ask not just *what the agent does* but *what it can see and reach* (MITM egress proxies, write-only secrets, caller-scoped delegation). The ecosystem's center of gravity is converging on a single hard problem: **making a persistent, multi-channel, tool-using agent trustworthy under concurrency and adversarial conditions.**

---

## 2. Activity Comparison

| Project | Issues Updated (24h) | PRs Updated (24h) | PRs Merged/Closed | Release Status | Health Score* |
|---|---|---|---|---|---|
| **OpenClaw** | 333 | 500 | 217 | None (0 releases) | **B (high velocity, high stability debt)** |
| **Hermes Agent** | 50 | 50 | 12 | Canary `v0.23.1+canary.20261113` | **A- (healthy flow, security-focused)** |
| **IronClaw** | 1 | 0 | 0 | None | **C (idle trough — inconclusive)** |
| **QwenPaw** | 20 (16 open / 4 closed) | 36 (31 open / 5 closed) | 5 | None (post-2.3.0 stabilization) | **B+ (responsive, absorbing regressions)** |
| **ZeroClaw** | 7 (all open) | 50 (49 open / 1 closed) | 1 | None (v0.9.0 pending, PR #12270 closed) | **B (broad review load, zero issue closure)** |

*Health score is a qualitative synthesis of velocity, flow balance (open vs. closed), release cadence, and unresolved high-severity backlog — not a GitHub-native metric.*

**Reading the table:** OpenClaw operates ~6–10× the raw activity of any peer but carries a disproportionate P0/P1 backlog. Hermes Agent shows the healthiest *ratio* (balanced issue flow, security PRs closing daily). ZeroClaw's 49:1 open-to-closed PR ratio is the clearest bottleneck signal in the dataset — the constraint is author response (`needs-author-action`), not maintainer review. QwenPaw's high issue-to-merge ratio reflects a young regression wave with fast fix turnaround. IronClaw is statistically silent today.

---

## 3. OpenClaw's Position

**Advantages vs. peers:**
- **Scale of triage infrastructure.** OpenClaw is the only project in this set with a formalized triage taxonomy ("clawsweeper" ratings: gold shrimp → platinum hermit, fix-shape, needs-info flags). This is a mature workflow artifact no peer exhibits.
- **Breadth of channel surface.** Telegram, Slack, msteams, Codex, claude-cli — the integration matrix is wider than any peer, at the cost of more seams to break.
- **Ecosystem gravity.** 333 issues / 500 PRs in 24h is roughly an order of magnitude above Hermes Agent (50/50), QwenPaw (20/36), and ZeroClaw (7/50). OpenClaw is functioning as the de facto *reference implementation* of the category.

**Technical approach differences:**
- Unlike QwenPaw (release-driven, channel-plugin model) or ZeroClaw (Rust, sandbox/relay-centric arc), OpenClaw leans on a **JavaScript/TypeScript gateway + plugin architecture** with heavy reliance on a SQLite worker layer and a Gateway event loop. This is precisely where its dominant failure families live — **event-loop blocking at scale (#119720, open since August), SQLite worker OOM (#191847), and off-heap RSS creep (#182369)**. Peers architecturally sidestep or defer some of this pressure (ZeroClaw's Rust runtime, QwenPaw's per-channel isolation).
- OpenClaw's access-control model (OpenClaw ID: member/guest/admin/Doctor roles via stacked PRs) is more ambitious and further along than peers' — but it also means OpenClaw carries more security surface area in-flight.

**Community size comparison:**
- **Largest by raw engagement:** OpenClaw's hottest thread (#170956, Windows lifecycle) drew 32 comments; its top six threads average ~19 comments. Compare to QwenPaw's top thread (#8071, 13 comments) and Hermes Agent's hottest (#77253, 13 comments). OpenClaw's community comments in aggregate on a single issue can exceed a peer's entire daily comment volume.
- The trade-off is visible: OpenClaw's **maintainer bandwidth is the binding constraint** — several fixes exist on `main` but not in stable (e.g., #177063→#185085), producing a **release-velocity gap** that Hermes Agent (canary-per-day cadence) and QwenPaw (fix-PR-within-24h culture) avoid.

**Net position:** OpenClaw is the ecosystem's anchor reference but currently **pays a heavy reliability tax** for its scope. A stable-backport push would likely reduce user-visible P1 volume more than net-new development this cycle — a low-cost, high-leverage move peers have already internalized.

---

## 4. Shared Technical Focus Areas

Three requirements emerge independently across multiple projects — the strongest signal in this dataset:

**(a) Silent data/delivery loss — the #1 cross-project reliability theme**
- **OpenClaw:** Subagent final answer lost + duplicate settle events (#155119); exec-completion wakes lost (#185085); Telegram opaque callbacks dropped (#126950); Slack thread-mismatch.
- **Hermes Agent:** `notify_on_complete` stale synthetic turn (#94455, closed today); background work fails to follow through (#149248 — *"nearly every time I've asked Hermes to handle something long-running… it hasn't come back"*); `session_search` silently returns 0 (#103184).
- **Shared root cause:** asynchronous gateway/session state races at the plugin↔core boundary. Multiple projects independently report the same class of bug — a strong signal this is an *architectural* pattern, not a project-specific defect.

**(b) Security boundaries that are either too blunt or bypassable**
- **Hermes Agent:** E.164 phone-number over-redaction (#68911, needs-decision); ANSI-C quoting approval bypass (#76218, closed); skill egress over-blocking (#143863).
- **ZeroClaw:** Caller tool-level approval in bounded delegation (#11138); MITM egress proxy RFC (#12001); write-only credential management (#12373); `/mnt`/UNC denylist tightening (#12136, breaking).
- **OpenClaw:** Unbypassable outbound policy enforcement (#56349, open since March); exec approval card fails to flag mount-point targets (#124306).
- **Shared need:** a coherent, auditable model for *delegated authority and secret visibility* — users want to constrain a **compromised** agent, not just a misbehaving one.

**(c) Provider/model configuration trust**
- **QwenPaw:** Hub model gateway 502 on Anthropic/MiniMax presets (#8718); context-length exceeded → task aborts (#8312); in-channel `/model` cannot switch pinned model (#8725).
- **ZeroClaw:** OpenCode Go silently using Zen's catalogue (#12412); context-window discovery returns nothing (#12413).
- **OpenClaw:** Codex provider/thread mismatch regression (#190563); claude-cli treats transient OAuth refresh-lock as terminal (#156442).
- **Shared need:** **predictable, inspectable model selection** — users are losing trust when providers silently mismatch catalogues or fail opaque.

**(d) CJK/i18n gaps (currently OpenClaw-specific but a category-level risk)**
- OpenClaw: CJK bigram tokenizer (#170997) and `sessions_search` returning 0 for CJK (#140736). No peer has surfaced this yet — a signal that other projects are **under-serving non-English users**, likely a latent issue as adoption grows.

---

## 5. Differentiation Analysis

| Dimension | OpenClaw | Hermes Agent | ZeroClaw | QwenPaw | IronClaw |
|---|---|---|---|---|---|
| **Primary focus** | Broadest channel + access-control platform | Security hardening + gateway/session reliability | Rust sandbox/relay + credential scoping | Channel-plugin ecosystem (WeChat/Feishu/DingTalk/Matrix) | Niche/org-specific (nearai) |
| **Target users** | Power users, multi-channel operators | Security-conscious ops + desktop users | Security-literate, multi-agent builders | Messaging-first users (CJK-adjacent markets) | Specialized/internal |
| **Architecture signal** | TS/JS gateway + plugin + SQLite worker | Gateway + canary cadence; desktop TUI | Rust runtime, WASM plugins, relay/frontdoor, Seatbelt | Console/API + channel plugin model | (not visible today) |
| **Release cadence** | Slow stable, huge `main` drift | Canary-per-day, stable periodic | v0.9.0 pending | Post-2.3.0 fix wave | Idle |
| **Security posture** | Ambitious in-flight (access model) | Explicit "sec-marathon" campaign | Architectural (MITM proxy, write-only secrets) | Reactive (regression fixes) | CI-hardening proposal only |
| **Distinct pain** | Windows lifecycle, event-loop scale | Desktop rendering, gateway concurrency | Provider catalogue confusion, identity leakage | Upgrade migration gaps, channel startup races | None surfaced |

**Key architectural divergence:** ZeroClaw is the only project **systematically moving security from "policy" to "architecture"** (MITM egress proxy, host-mediated WASM wake dispatch via ADR-016, write-only secret vault pattern). Hermes Agent pursues similar goals through **enforcement fixes** (peeling exec wrappers before MCP scans, gating instruction files). OpenClaw approaches security through **role-based access semantics**. These are three genuinely different philosophies — worth watching which becomes the ecosystem norm.

---

## 6. Community Momentum & Maturity

**Activity tiers:**
- **Tier 1 — Hyperactive reference platform:** OpenClaw (333 issues / 500 PRs). Mature triage workflow, but stability debt and release-velocity gap.
- **Tier 2 — High-velocity, healthy flow:** Hermes Agent (50/50, 12 merged, canary cut) and ZeroClaw (7/50, but 49 open — *volume without closure*). Both security-marathon-driven.
- **Tier 2.5 — Responsive post-release stabilizer:** QwenPaw (20/36, 5 merged, fast issue→fix turnaround within 24h). High contributor responsiveness, absorbing 2.3.0 regressions.
- **Tier 3 — Idle/niche:** IronClaw (1 issue, 0 PRs, 0 releases).

**Rapidly iterating:** OpenClaw (features + fixes in parallel), QwenPaw (most active contributor conversion — first-time contributors turning reports into fixes, e.g., #8728, #8726).

**Stabilizing / absorbing regressions:** QwenPaw is in explicit post-release stabilization; ZeroClaw is in a **review-phase stall** (49 open PRs, several `needs-author-action` — a healthier failure mode than maintainer bottleneck, but still slowing the hardening pipeline).

**Maturity signals ranked:**
1. **OpenClaw** — most mature tooling (clawsweeper taxonomy), largest community, but lowest *flow efficiency* (backlog accumulation).
2. **Hermes Agent** — highest *sustainable* maturity: balanced flow, daily canary cadence, security campaign closing bugs same-day.
3. **ZeroClaw** — high architectural ambition, high contributor sophistication, but review throughput is the visible weakness (#9746 open since August).
4. **QwenPaw** — maturing fast; plugin ecosystem pressure (#8071, 13 comments) is a *good* sign of ecosystem depth beyond core.
5. **IronClaw** — cannot be assessed from a single-day trough; the unanswered #8170 (a high-quality CI-hardening contribution) is a *risk of squandered low-cost engagement*.

---

## 7. Trend Signals

Extracted from cross-project community feedback — actionable for AI agent developers:

**1. Delivery reliability is the new feature bar.**
Across OpenClaw, Hermes Agent, and QwenPaw, *silent loss of background/long-running work* is the highest-emotion complaint ("hasn't come back," "stuck pending," "task aborts"). Developers should treat **durable, observable async delivery with explicit acknowledgment/retry** as a first-class primitive, not an afterthought. The recurring `deliveryStatus`/`notify_on_complete`/`session_search` family suggests the industry lacks a standard contract here.

**2. Gateway event-loop/state concurrency is an architectural ceiling.**
OpenClaw (#119720, #182369) and Hermes Agent (#94455, #149248) independently hit session-state races and memory pressure under scale. For new projects: **isolate persistence from the serving loop early** (ZeroClaw's Rust runtime and QwenPaw's channel isolation offer partial templates). Retrofitting is expensive — OpenClaw has carried #119720 since August.

**3. The security model is shifting from "policy" to "isolation."**
The most forward-looking proposals (ZeroClaw MITM proxy, write-only secrets, bounded-delegation approval; Hermes exec-wrapper peeling; OpenClaw unbypassable outbound policy) all point the same direction: **assume agent compromise, not just agent misbehavior**. Developers building multi-agent/tool-using systems should design **secret-visibility boundaries and delegation-approval inheritance** upfront — this is becoming table stakes, not enterprise upsell.

**4. Over-blocking is as damaging as under-blocking.**
User pain is now bidirectional: redaction that hides legitimate E.164 numbers (#68911), skill egress blocks that kill documented `curl` calls (#143863). Design **per-profile/per-skill exceptions** into security primitives from day one. The "guard too blunt" refrain is a predictable second-order effect of security hardening — plan for the tuning surface.

**5. Provider abstraction is a trust surface.**
Silent catalogue mismatches (ZeroClaw/Zen-vs-Go), context-window discovery failures, and opaque model pinning (QwenPaw #8725) erode user trust. Ship **inspectable provider resolution** (what catalogue, which context window, why this model) and self-recovery paths.

**6. Release cadence is a reliability lever, not just a marketing event.**
OpenClaw's fixes sitting on `main` but absent from stable (#177063→#185085) directly inflate user-visible P1 volume. Hermes Agent's canary-per-day cadence keeps fixes in user hands fast. **Stable backporting is a higher-ROI activity than net-new features** for projects at OpenClaw's scale — a directly transferable lesson.

**7. Non-English support is a latent, underserved risk.**
Only OpenClaw surfaces CJK tokenization problems — which may mean peers simply haven't been stress-tested by CJK-heavy users yet. Given QwenPaw's messaging-channel focus (WeChat/Feishu/DingTalk), expect i18n search/tokenization to become a cross-project requirement in the next two quarters.

**8. First-time contributors are a strategic asset.**
QwenPaw's fast issue→fix conversion (first-time contributors filing PRs for #8718, #8727, #8709 within 24h) illustrates the highest-leverage community pattern. IronClaw's unanswered #8170 (a specific, low-cost, high-quality contribution) is the counter-example: **squandering a willing contributor is a compounding cost.** Projects should instrument "time-to-first-response on external contributions" as a health metric.

---

**Bottom line for decision-makers:** The category is consolidating around reliability + security semantics rather than feature breadth. OpenClaw leads in scale and integration surface but pays for it in stability debt and release lag; Hermes Agent and ZeroClaw demonstrate that **flow efficiency and architectural security** can be competitive advantages even at lower volume; QwenPaw shows that responsive maintainership converts release regressions into community goodwill. The next 1–2 release cycles will likely be decided less by who ships the most features and more by **who reliably delivers background work, keeps secrets out of agent reach, and gets fixes into stable fastest.**

---

## Peer Project Reports

<details>
<summary><strong>Hermes Agent</strong> — <a href="https://github.com/nousresearch/hermes-agent">nousresearch/hermes-agent</a></summary>

# Hermes Agent — Project Digest
**Date: 2026-11-14** | Source: github.com/nousresearch/hermes-agent

---

## 1. Today's Overview

Hermes Agent shows **very high, healthy activity** on 2026-11-14, with 50 issues and 50 PRs touched in the last 24 hours and one new canary release cut. The dominant theme of the day is a coordinated **security-hardening sweep** (`sec-marathon-2026-11-13`), visible across a large batch of PRs from a single prolific contributor (c2h5oh) addressing redaction, sandbox grants, skills trust, and MCP scans. Issue flow is balanced (30 open/active vs. 20 closed), indicating maintainers are actively merging and closing rather than letting work pile up. However, a meaningful portion of the day's hot issues are **cross-cutting platform bugs** — Telegram/Discord gateway behavior, session-state races, and install/update reliability — suggesting the messaging-gateway surface remains the community's most fragile area. Overall project health reads as strong and security-focused, with stability debt concentrated in asynchronous gateway/session flows.

---

## 2. Releases

**New release: `v0.23.1+canary.20261113T064447Z`** (Hermes Agent canary, released 2026-11-13, surfaced today).

- This is a **canary channel** build (dated 20261113T064447Z), not a stable release.
- The release notes are largely a build-metadata shell (`HERMES_BUILDS_TABLE`, Desktop DMG download links for macOS Apple Silicon), with **no explicit changelog, breaking changes, or migration notes published** in the provided data.
- **Action for users:** Treat as bleeding-edge. No migration guidance is included, and canary builds typically track `main` — the security-hardening PRs listed below are **not confirmed to be in this build** and should be assumed pending.

> ⚠️ *No stable release, breaking changes, or migration instructions were announced today.*

---

## 3. Project Progress — Merged/Closed PRs & Fixes

**12 PRs merged/closed** in the last 24h (38 remain open). The day's closed work is heavily security-oriented:

| PR | Title | Status | Area |
|---|---|---|---|
| [#155281](https://github.com/NousResearch/hermes-agent/pull/155281) | fix(file-tools): gate instruction files inside the Hermes home | CLOSED (ci-reviewed) | Security / file tools |
| [#155207](https://github.com/NousResearch/hermes-agent/pull/155207) | fix(skills): make `skills update` enforce the scan verdict it prints | CLOSED (ci-reviewed) | Security / skills |
| [#155259](https://github.com/NousResearch/hermes-agent/pull/155259) | fix(security): peel exec wrappers before MCP hermes-0day scan | CLOSED (ci-reviewed) | Security / MCP |
| [#148266](https://github.com/NousResearch/hermes-agent/pull/148266) | fix(gateway): plugin-injected turns start clean, let background work finish | CLOSED | Gateway / sessions |

**Features/fixes that advanced:**
- **Protected-instruction gating** — [#155281](https://github.com/NousResearch/hermes-agent/pull/155281) closes the gap where `~/.hermes/SOUL.md` / `AGENTS.md` were ungated inside the home dir (directly addresses closed issue [#92146](https://github.com/NousResearch/hermes-agent/issues/92146)).
- **Skills Guard enforcement** — [#155207](https://github.com/NousResearch/hermes-agent/pull/155207) decouples "replace installed copy" from the guard override in `skills update`, fixing a caution-verdict bypass (ties to closed issue [#38041](https://github.com/NousResearch/hermes-agent/issues/38041)).
- **MCP 0-day scanning** — [#155259](https://github.com/NousResearch/hermes-agent/pull/155259) peels `env`/`timeout`/`nice` wrappers before running shell egress/persistence scans (fixes closed issue [#63904](https://github.com/NousResearch/hermes-agent/issues/63904)).
- **Gateway plugin-turn semantics** — [#148266](https://github.com/NousResearch/hermes-agent/pull/148266) makes `ctx.inject_message` turns start with clean context, allow background work to finish, and yield to human input.

Additional closed issues resolved today: [#94455](https://github.com/NousResearch/hermes-agent/issues/94455) (stale `notify_on_complete`), [#76218](https://github.com/NousResearch/hermes-agent/issues/76218) (ANSI-C quoting approval bypass), [#27284](https://github.com/NousResearch/hermes-agent/issues/27284) (prompt-injection scanner variants), [#92146](https://github.com/NousResearch/hermes-agent/issues/92146), [#134218](https://github.com/NousResearch/hermes-agent/issues/134218) (self-update kills gateway venv), and [#71994](https://github.com/NousResearch/hermes-agent/issues/71994) (API keys persisted to `auth.json`).

---

## 4. Community Hot Topics

**Most-active issues by comment count:**

1. **[#77253](https://github.com/NousResearch/hermes-agent/issues/77253)** — *Desktop code blocks (no tag/`text`/`yaml`) misclassified as prose* — **13 comments, 👍3**, OPEN. The single hottest thread. Users are frustrated that fenced code renders incorrectly in Hermes Desktop; a widely-hit UX bug with a clear reproduction.
2. **[#94455](https://github.com/NousResearch/hermes-agent/issues/94455)** — *`notify_on_complete` emits stale synthetic turn* — **11 comments**, CLOSED. A race in background-completion notification; resolved today.
3. **[#56524](https://github.com/NousResearch/hermes-agent/issues/56524)** — *Telegram in-band `hermes update` leaves launchd gateway offline after drain timeout* — **8 comments**, OPEN (os/macos, install-update).
4. **[#68911](https://github.com/NousResearch/hermes-agent/issues/68911)** — *Gateway force-redacts standalone E.164 phone numbers with no trusted-profile opt-in* — **8 comments, 👍1**, OPEN (needs-decision). Directly impacts operator copilots that must display exact customer identities.
5. **[#76218](https://github.com/NousResearch/hermes-agent/issues/76218)** — *bash ANSI-C quoting lets `rm -rf /` skip approval floor* — **6 comments**, CLOSED (security).

**Most-active PR:** **[#155356](https://github.com/NousResearch/hermes-agent/pull/155356)** (fix(gateway): busy voice note interrupts at once) and the c2h5oh security batch — high volume, all `sec-marathon-2026-11-13` tagged.

**Underlying needs:** The heatmap is dominated by (a) **desktop TUI rendering quality**, (b) **gateway/session reliability under concurrency** (background work, stale turns, drains), and (c) **redaction boundaries that are too blunt for legitimate workflows**. Users want security *and* fidelity — the "#68911 phone-number redaction" thread is a classic over-blocking tension.

---

## 5. Bugs & Stability

Ranked by severity observed today:

| Severity | Issue | Summary | Fix PR? |
|---|---|---|---|
| **P1** | [#134218](https://github.com/NousResearch/hermes-agent/issues/134218) (CLOSED) | self-update deletes the running gateway venv → Telegram polling dies for days, cron workers lost | Resolved/closed today |
| **P2 (regression)** | [#142743](https://github.com/NousResearch/hermes-agent/issues/142743) | v0.22.3 Docker: fresh gateway boot **crash-loops** with `unsafe_control_permissions` on its own socket | No linked PR |
| **P2** | [#149248](https://github.com/NousResearch/hermes-agent/issues/149248) | Background work fails to follow through without user prompt; live-subscriber handback loss | No linked PR (needs-decision) |
| **P2** | [#103184](https://github.com/NousResearch/hermes-agent/issues/103184) | `session_search` silently hides FTS matches + wrong session metadata | No linked PR |
| **P2** | [#89477](https://github.com/NousResearch/hermes-agent/issues/89477) | Gateway fails to poll inbound Telegram on named profiles with separate bots | No linked PR |
| **P2** | [#136801](https://github.com/NousResearch/hermes-agent/issues/136801) | Telegram gateway "Insufficient Balance" despite funded providers | No linked PR (needs-repro) |
| **P2** | [#147287](https://github.com/NousResearch/hermes-agent/issues/147287) | Telegram quote-reply loses quoted text (`reply_to_text` empty) | No linked PR |
| **P2** | [#100431](https://github.com/NousResearch/hermes-agent/issues/100431) | `voice.auto_tts` speaks replies to *typed* text in gateway chats | No linked PR |
| **P3** | [#98161](https://github.com/NousResearch/hermes-agent/issues/98161) | Dashboard sensitive-file guard misses `.discord_token`; lags `file_safety.py` | No linked PR |

**Notable stability trend:** two independent **race conditions** around session delivery were filed/updated ([#94455](https://github.com/NousResearch/hermes-agent/issues/94455) *closed with fix*, [#149248](https://github.com/NousResearch/hermes-agent/issues/149248) *open*), and a desktop **session-lease leak** ([#146735](https://github.com/NousResearch/hermes-agent/issues/146735), CLOSED). Security bugs closed today: [#76218](https://github.com/NousResearch/hermes-agent/issues/76218), [#27284](https://github.com/NousResearch/hermes-agent/issues/27284), [#92146](https://github.com/NousResearch/hermes-agent/issues/92146), [#71994](https://github.com/NousResearch/hermes-agent/issues/71994), [#63904](https://github.com/NousResearch/hermes-agent/issues/63904) — a strong maintenance day despite the open backlog.

---

## 6. Feature Requests & Roadmap Signals

- **Smarter redaction opt-in** ([#68911](https://github.com/NousResearch/hermes-agent/issues/68911), needs-decision, 👍1): users want a **trusted-profile mechanism** to preserve E.164 phone numbers. Strong signal that the outbound secret boundary needs per-profile tuning.
- **Allowlisted authenticated API calls in skills** ([#143863](https://github.com/NousResearch/hermes-agent/issues/143863)): `env_exfil_curl` hard-blocks a documented `curl -H "PRIVATE-TOKEN: …"`. Expect pressure for **skill-scoped egress exceptions**.
- **Plugin router hardening** ([#155205](https://github.com/NousResearch/hermes-agent/pull/155205)) and **terminal backend plugin "seams"** ([#154264](https://github.com/NousResearch/hermes-agent/issues/154264), CLOSED) point to an expanding **plugin API surface** — likely a roadmap pillar for v0.24.
- **Local model parity** ([#155357](https://github.com/NousResearch/hermes-agent/pull/155357)): chat-platform `/model` pickers should list the managed local llama.cpp row — parity between desktop/CLI and messaging clients.
- **New optional skills** ([#3471](https://github.com/NousResearch/hermes-agent/pull/3471), email auto-draft via Himalaya) — long-running skill-catalog growth.

**Prediction for next version:** gateway/session-state fixes, the redaction opt-in design, and the skills/exec-wrapper security batch are the strongest candidates to land in the next **canary → stable** cut (v0.23.x or v0.24). Plugin-catalog and local-model UX items are likely to follow.

---

## 7. User Feedback Summary

**Pain points (verbatim sentiment):**
- *"nearly every time I've asked Hermes to handle something long-running and get back to me, it hasn't come back"* — [#149248](https://github.com/NousResearch/hermes-agent/issues/149248). This is the most emotionally-charged report: unreliable background delegation erodes trust in the core agent promise.
- Telegram/Discord users repeatedly report **delivery/visibility failures**: invisible URLs ([#40667](https://github.com/NousResearch/hermes-agent/issues/40667), CLOSED), hidden first chunk in multi-part replies ([#55059](https://github.com/NousResearch/hermes-agent/issues/55059)), albums degrading and captions leaking into streamed text ([#9291](https://github.com/NousResearch/hermes-agent/issues/9291)), and split text+attachment events interrupting turns ([#30989](https://github.com/NousResearch/hermes-agent/issues/30989)).
- **Security friction:** operators experience redaction as over-blocking ([#68911](https://github.com/NousResearch/hermes-agent/issues/68911)) and legitimate skill code as blocked ([#143863](https://github.com/NousResearch/hermes-agent/issues/143863)) — a recurring "guard too blunt" refrain.
- Positive signal: multiple high-quality, agent-assisted bug reports (e.g., [#100431](https://github.com/NousResearch/hermes-agent/issues/100431) explicitly notes it was *"written and submitted by Wen's Hermes agent after reproducing the behavior live"*) — a sign of an engaged, technically sophisticated user base using Hermes on itself.

**Satisfaction/dissatisfaction balance:** dissatisfaction clusters around **gateway reliability and desktop rendering**; satisfaction is implicit in the volume of well-scoped, maintainer-responsive reports. High 👍 on [#72298](https://github.com/NousResearch/hermes-agent/issues/72298) (passwords shown in Telegram, 👍8) shows users care most about **not leaking secrets**.

---

## 8. Backlog Watch — Needs Maintainer Attention

Long-unanswered or high-impact items lacking resolution:

| Age | Item | Why it matters |
|---|---|---|
| ~7 months | [#9291](https://github.com/NousResearch/hermes-agent/issues/9291) (2026-04-14) | Telegram media delivery pipeline; author claims a patch is ready — needs a PR review. |
| ~6 months | [#30989](https://github.com/NousResearch/hermes-agent/issues/30989) (2026-05-23) | BlueBubbles text+attachment split-event interrupt; needs-decision. |
| ~5 months | [#55059](https://github.com/NousResearch/hermes-agent/issues/55059) (2026-06-29) | Telegram multi-chunk first-reply hiding; upstream cause, needs-decision. |
| ~4 months | [#56524](https://github.com/NousResearch/hermes-agent/issues/56524) (2026-07-01) | macOS/launchd gateway offline after `hermes update` — install-update reliability. |
| ~4 months | [#68911](https://github.com/NousResearch/hermes-agent/issues/68911) (2026-07-21) | E.164 redaction over-blocking; needs-decision, has community demand. |
| ~3.5 mo | [#77253](https://github.com/NousResearch/hermes-agent/issues/77253) (2026-08-03) | **Hottest issue today (13 comments)** — desktop code-block rendering; still OPEN. |
| ~3 months | [#89477](https://github.com/NousResearch/hermes-agent/issues/89477) (2026-08-18) | Named-profile multi-bot Telegram polling failure; needs-repro. |
| ~2.5 mo | [#103184](https://github.com/NousResearch/hermes-agent/issues/103184) (2026-09-04) | `session_search` silently returns 0 results — silent data loss for memory discovery. |

**Recommendation:** Prioritize [#77253](https://github.com/NousResearch/hermes-agent/issues/77253) (highest engagement, clear repro) and the cluster of **needs-decision gateway bugs** ([#68911](https://github.com/NousResearch/hermes-agent/issues/68911), [#30989](https://github.com/NousResearch/hermes-agent/issues/30989), [#55059](https://github.com/NousResearch/hermes-agent/issues/55059)) — these are stalled on maintainer design calls, not on engineering capacity, and are accumulating community frustration.

---

### Health Snapshot
- **Activity:** Excellent (100 issue+PR touches/24h; 1 release).
- **Flow:** Balanced, slightly issue-heavy open side (30 active issues vs. 20 closed).
- **Security posture:** Strong — a dedicated marathon produced ~10 security PRs, several merged today.
- **Primary risk:** Asynchronous gateway/session semantics and install/update reliability — the biggest source of user-visible failures.
- **Watch metric:** Ratio of `needs-decision` P2 issues to resolved ones; several high-engagement bugs are paused awaiting maintainer direction rather than effort.

*Generated from GitHub data provided for 2026-11-14. Comment counts shown as "undefined" for PRs indicate the field was absent in source data.*

</details>

<details>
<summary><strong>IronClaw</strong> — <a href="https://github.com/nearai/ironclaw">nearai/ironclaw</a></summary>

# IronClaw Project Digest — 2026-11-14

## 1. Today's Overview

IronClaw (nearai/ironclaw) is effectively idle today: zero pull requests were updated, zero releases shipped, and only a single issue saw activity in the last 24 hours. That lone issue (#8170) is an unsolicited CI-hardening proposal from a community contributor, which itself signals continued external interest in supply-chain security for the project's GitHub Actions workflows. With no merges, no review activity, and no new code landing, today represents a low-activity maintenance trough rather than active development. The absence of any closed PRs or releases means no velocity can be measured from this window alone. Overall project health cannot be judged positively or negatively from a single quiet day, but the lack of maintainer engagement on the one open item is worth watching.

## 2. Releases

No new releases in the last 24 hours. Nothing to report on version changes, breaking changes, or migration notes.

## 3. Project Progress

No pull requests were merged or closed today, and none remain open from this window. There is no shipped functionality, bug fix, or refactor to attribute to the last 24 hours. Progress tracking is therefore neutral — the project neither advanced nor regressed in code terms.

## 4. Community Hot Topics

Only one item saw activity, and it had no comments or reactions:

- **[Issue #8170 — ci: add GitHub's workflow lockfile (actions.lock), two pins to refresh first](https://github.com/nearai/ironclaw/issues/8170)** — Author: coconux3 | Opened & updated: 2026-11-13 | Comments: 0 | 👍: 0

The issue proposes adopting [GitHub's workflow dependency lockfile](https://docs.github.com/actions/concepts/security/workflow-dependency-lockfiles) (`actions.lock`) and documents what currently blocks adoption. The contributor notes the workflows are already pinned by commit SHA "almost everywhere," framing this as the logical next step in supply-chain hardening. The underlying need is **CI/CD supply-chain security maturity** — locking transitive action dependencies, not just direct ones. The "two pins to refresh first" framing suggests concrete, actionable blockers were identified, which is unusually high-quality drive-by feedback. The fact that it received zero maintainer response within a day is not yet concerning, but it is the only thread to track.

## 5. Bugs & Stability

No bugs, crashes, or regressions were reported today. Issue #8170 is a CI-security enhancement, not a defect report. However, it does implicitly flag a stability-adjacent gap: unpinned transitive workflow dependencies could allow upstream action changes to break or compromise CI. Severity is low-to-moderate (process risk, not runtime failure), and no fix PR exists.

## 6. Feature Requests & Roadmap Signals

The single open issue constitutes the only roadmap signal:

- **CI workflow lockfile adoption (`actions.lock`)** — [#8170](https://github.com/nearai/ironclaw/issues/8170)

Predicting inclusion in the "next version" is speculative given the absence of maintainer comment or a linked PR. Realistically this is a repo-infrastructure change rather than a product feature, so it would land via a CI-tooling commit, not a release note. Watch for a maintainer response or a follow-up PR refreshing the "two pins" the author referenced.

## 7. User Feedback Summary

There is minimal user feedback in this window. The one data point — coconux3's issue — reflects a **security-conscious contributor** who has clearly audited the repo's workflows and wants to push best practices further. No pain points around IronClaw's actual agent or personal-assistant functionality were raised. No satisfaction or dissatisfaction signals are available from this data.

## 8. Backlog Watch

No long-unanswered issues or PRs were surfaced in this dataset (only one issue total, one day old). However:

- **[Issue #8170](https://github.com/nearai/ironclaw/issues/8170)** warrants maintainer attention simply because it is the sole open thread and contains actionable, specific requests (refresh two pins, then add `actions.lock`). If it remains unanswered for an extended period, it risks becoming a stale backlog item from a willing contributor — the kind of low-cost, high-signal engagement projects should not squander.

---

**Note on data limitations:** With only one updated issue and no PR or release activity, this digest is constrained by a near-empty 24-hour window. Trends in project health should be assessed over a longer horizon than a single day.

</details>

<details>
<summary><strong>QwenPaw</strong> — <a href="https://github.com/agentscope-ai/QwenPaw">agentscope-ai/QwenPaw</a></summary>

# QwenPaw Project Digest — 2026-11-14

## 1. Today's Overview

QwenPaw shows **very high activity** today: 20 issues updated (16 open/active, 4 closed) and 36 PRs updated (31 open, 5 merged/closed), with no new releases. The project is in an intense post-2.3.0 stabilization phase — the 2.3.0 release (2026-11-11) has generated a wave of regression and compatibility reports across channels (WeChat, Feishu, Matrix), Hub model presets, and upgrade paths. A notable cluster of bugs is being triaged simultaneously, with corresponding fix PRs opening within hours of the issue reports, indicating a responsive maintainer/contributor ecosystem. Community contribution is strong, with several first-time contributors submitting targeted fixes.

## 2. Releases

**No new releases.** (Latest available remains 2.3.0, released 2026-11-11, per issue reports.)

## 3. Project Progress

Only 5 PRs were merged/closed in the last 24h (individual details not itemized in the data window), so feature progress today is modest relative to the open backlog. Several of the day's closed issues were longstanding:

- **#7943 [CLOSED]** — Windows sandbox ACL on a drive-root workspace locking the volume (bug) — [link](https://github.com/agentscope-ai/QwenPaw/issues/7943)
- **#6321 [CLOSED]** — Feature request: pre-condition rules in AGENTS.md for tool calls — [link](https://github.com/agentscope-ai/QwenPaw/issues/6321)
- **#2306 [CLOSED]** — Scheduled task Memory file interruption question (open since March) — [link](https://github.com/agentscope-ai/QwenPaw/issues/2306)
- **#8669 [CLOSED]** — Feishu channel startup race (`CHANNEL_NOT_CONNECTED`) — [link](https://github.com/agentscope-ai/QwenPaw/issues/8669)

Notable PRs advancing features (still open): append-only session storage with Turn forks (#8532), plugin CLI commands and extension points (#8554), local Whisper as SDK plugin (#8431), and Console local engine/GPU controls (#8648).

## 4. Community Hot Topics

The most-commented item today is the highest-engagement thread:

- **#8071 [OPEN] Plugin-facing theme extension point** — 13 comments — [link](https://github.com/agentscope-ai/QwenPaw/issues/8071)
  - *Underlying need:* Plugin authors are constrained to a single theme knob (`colorPrimary`); they want semantic token override layers to build deeper UI integrations. This is a sign the **plugin ecosystem is maturing** and pushing beyond the current extension surface.

- **#2306 [CLOSED] Scheduled task / Memory interruption** — 12 comments — [link](https://github.com/agentscope-ai/QwenPaw/issues/2306)
  - *Underlying need:* Reliability/observability of long-running scheduled (cron) tasks; users cannot explain why model replies get truncated.

Other active threads (#8669, #8312, #8718, #8727) each have 2–5 comments, mostly focused on 2.3.0 regressions.

## 5. Bugs & Stability

Reported/updated today, ranked by severity:

**Critical / High**
- **#8718 [OPEN]** — Hub model gateway instantly fails for Anthropic/MiniMax presets; `provider_headers()` calls a missing `request_headers()` → HTTP 502, request never leaves the process. **Fix PR exists: #8729.** — [issue](https://github.com/agentscope-ai/QwenPaw/issues/8718) | [PR](https://github.com/agentscope-ai/QwenPaw/pull/8729)
- **#8709 [OPEN]** — 2.3.0 WeChat channel cannot start (`ACCOUNT_IN_USE`); successful sends reported as `PLATFORM_RESULT_UNKNOWN`. **Partial fix PRs: #8715 (receipts), #8721 (retry recovery), #8720 (false bot conflicts).** — [issue](https://github.com/agentscope-ai/QwenPaw/issues/8709)
- **#8312 [OPEN]** — Context control failure: `MODEL CONTEXT LENGTH EXCEEDED`, context compaction cannot fit request (252,565 > 251,904 tokens), task aborts. No fix PR yet. — [link](https://github.com/agentscope-ai/QwenPaw/issues/8312)
- **#8684 [OPEN]** — Upgrade to 2.3.0 does **not migrate built-in channel plugins**; installed Matrix stays on old source, so 2.3.0 fixes (E2EE deps, session/device-key rotation) never apply. — [link](https://github.com/agentscope-ai/QwenPaw/issues/8684)

**Moderate**
- **#8727 [OPEN]** — Responses continuation summary fails when default reasoning consumes the 4000-token output budget (`disable_thinking` strips `reasoning` instead of expressing "no reasoning"). **Fix PR: #8728.** — [issue](https://github.com/agentscope-ai/QwenPaw/issues/8727) | [PR](https://github.com/agentscope-ai/QwenPaw/pull/8728)
- **#8725 [OPEN]** — `/model` in-channel cannot switch session-pinned model; users cannot self-recover from a broken pinned model. — [link](https://github.com/agentscope-ai/QwenPaw/issues/8725)
- **#8712 [OPEN]** — `execute_shell_command`: resource-protection termination hides result from the model, causing infinite repeat calls. — [link](https://github.com/agentscope-ai/QwenPaw/issues/8712)

**Low / Cosmetic**
- **#8696** — Attachments fail to resolve when workspace path contains `#` (Windows). — [link](https://github.com/agentscope-ai/QwenPaw/issues/8696)
- **#8706** — Creator input lags on every keystroke (full AgentDock re-render, no memoization). — [link](https://github.com/agentscope-ai/QwenPaw/issues/8706)
- **#8716** — Creator Windows source-intelligence write path derives directory from raw `source_id`. — [link](https://github.com/agentscope-ai/QwenPaw/issues/8716)

**Assessment:** The 2.3.0 rollout introduced a **cluster of channel/upgrade regressions**, but the project's response velocity is high — fixes for #8718, #8727, and multiple aspects of #8709 appeared within a day.

## 6. Feature Requests & Roadmap Signals

- **#8071** — Plugin theme extension points (semantic token overrides) — likely to land given 13-comment engagement. — [link](https://github.com/agentscope-ai/QwenPaw/issues/8071)
- **#7608** — DingTalk interactive card callbacks in stream mode (1 👍) — [link](https://github.com/agentscope-ai/QwenPaw/issues/7608)
- **#8710** — Per-conversation session binding for messaging channels (`/chats`, `/switch`, rotating `/new`) — [link](https://github.com/agentscope-ai/QwenPaw/issues/8710)
- **#8711** — Auto-retry once on empty/thinking-only stream EOF — [link](https://github.com/agentscope-ai/QwenPaw/issues/8711)
- **#8714** — Mount Console/API under configurable base path (reverse-proxy prefix) — **PR already open: #8719** — [issue](https://github.com/agentscope-ai/QwenPaw/issues/8714) | [PR](https://github.com/agentscope-ai/QwenPaw/pull/8719)

**Prediction for next version:** base-path deployment (#8714/#8719), empty-stream retry (#8711), and plugin theming (#8071) are strong candidates, alongside the already-queued cron `thinking_level` override (#8626) and session storage rework (#8532).

## 7. User Feedback Summary

**Pain points expressed:**
- **Reliability of long-running tasks** — cron/scheduled jobs interrupted, context compaction failing, token usage not written to `turns.jsonl` for cron paths (#8705), preventing accurate billing attribution.
- **Channel fragility** — multiple messaging channels (WeChat, Feishu, DingTalk, Matrix) hit startup/connection issues, undermining users who rely on QwenPaw as a messaging-based assistant.
- **Upgrade friction** — 2.3.0 upgrade does not migrate plugins, leaving users stranded on buggy older plugin code (#8684).
- **UI performance** — Creator console input lag frustrates daily authoring workflows (#8706).

**Positive signals:** Users are deeply engaged, filing highly detailed, reproduction-inclusive reports (many with version pins, commit SHAs, and stack traces), and several first-time contributors (#8728, #8726) are converting reports into fixes. This reflects a committed, technically sophisticated user base rather than passive consumption.

## 8. Backlog Watch

Long-running or high-impact items deserving maintainer attention:

- **#8312 [OPEN since 2026-10-18]** — Context compaction failure causing task aborts on large contexts; **no fix PR yet**, affects core agent behavior. — [link](https://github.com/agentscope-ai/QwenPaw/issues/8312)
- **#8684 [OPEN]** — Plugin migration gap on upgrade; systemic, affects every installer with installed channel plugins. — [link](https://github.com/agentscope-ai/QwenPaw/issues/8684)
- **#7608 [OPEN since 2026-09-07]** — DingTalk stream-mode card callbacks; still no linked PR, highest-voted (1 👍) feature in the window. — [link](https://github.com/agentscope-ai/QwenPaw/issues/7608)
- **#8725 [OPEN]** — In-channel model switching broken for pinned sessions; blocks self-recovery in production channels. — [link](https://github.com/agentscope-ai/QwenPaw/issues/8725)
- **PR #8431 [OPEN since 2026-10-26, size/XXXL, Under Review]** — Local Whisper SDK plugin conversion; large PR has been in review for ~3 weeks, may be drifting. — [link](https://github.com/agentscope-ai/QwenPaw/pull/8431)
- **PR #8268 [OPEN since 2026-10-16]** — TaskTracker run-cleanup fix (fixes half of #8173); stalled ~1 month, still open. — [link](https://github.com/agentscope-ai/QwenPaw/pull/8268)

---

**Project Health Summary:** QwenPaw is a **high-velocity, responsive project** with a large active contributor base, but it is currently absorbing significant **2.3.0 release regressions** across channels and upgrades. The strong feedback loop (issue → fix PR within 24h for several bugs) suggests the maintainers are on top of the destabilization, though core-context (#8312) and upgrade-migration (#8684) gaps warrant prioritized attention.

</details>

<details>
<summary><strong>ZeroClaw</strong> — <a href="https://github.com/zeroclaw-labs/zeroclaw">zeroclaw-labs/zeroclaw</a></summary>

# ZeroClaw Project Digest — 2026-11-14

## 1. Today's Overview

ZeroClaw's development activity remains very high, with **50 PRs updated in the last 24 hours** (49 open, 1 closed) and **7 issues updated** (all still open, none closed). The project is in a heavy review/fix phase rather than a release phase — **no new releases**, and the activity is dominated by a long tail of `ump45nose`-authored fix PRs (security, sandboxing, CLI, gateway) sitting in review. The single closed PR today is the significant `feat(relay)` dashboard-hosting work (#12270, targeting v0.9.0), suggesting relay/frontdoor work is converging. Bug reports this window cluster around the **OpenCode Go provider** (context-window discovery and wrong catalogue), while the RFC/feature queue skews heavily toward **security and credential scoping** (MITM egress proxy, write-only secrets, WASM plugin wake dispatch). Overall health signals: broad maintainer attention, but a large open-PR backlog (49) and zero issues closed today are worth watching.

---

## 2. Releases

**None.** No new releases in the last 24h. The latest referenced version in issue reports is **v0.9.0 (commit `6c78ba5`)**. Note PR #12270 carries the `release:v0.9.0` label and was closed today — a candidate for the next release train, but no artifacts have shipped.

---

## 3. Project Progress

**Merged/closed today:**
- **[PR #12270](https://github.com/zeroclaw-labs/zeroclaw/pull/12270)** `[CLOSED]` `feat(relay): serve a daemon's web dashboard through the relay at a per-node host (#10315 phase 2)` — XL, `release:v0.9.0`, `risk:high`. This closes the Phase 2 gap where browsers could not reach a daemon's web dashboard through ZeroRelay. Significant for remote-access/relay capabilities.

**Advanced (still open, active review):**
- **[PR #12408](https://github.com/zeroclaw-labs/zeroclaw/pull/12408)** `feat(web): manage scoped HTTP credentials` — secrets management UI, depends on #12402, related to issue #12373.
- **[PR #12168](https://github.com/zeroclaw-labs/zeroclaw/pull/12168)** `fix(tools): enforce Act policy on send_message_to_peer` — closes a policy-enforcement gap where an agent could start another agent's turn without an autonomy/action-budget check.
- **[PR #12136](https://github.com/zeroclaw-labs/zeroclaw/pull/12136)** `fix(config)!: forbid /mnt,/media,/run/media and Windows drive/UNC defaults` — a **breaking** denylist tightening.
- **[PR #12140](https://github.com/zeroclaw-labs/zeroclaw/pull/12140)** Windows profile secrets in default `forbidden_paths`.
- **[PR #12150](https://github.com/zeroclaw-labs/zeroclaw/pull/12150)** macOS Seatbelt regex fix for home-dotfile grants.
- Multiple runtime/CLI correctness fixes: cron `--agent` persistence (#12240), CLI honoring `[gateway.tls]` (#12117), zerocode config write serialization (#12349) and fail-closed config load (#12336), Mattermost DM first-post delivery (#12382).

---

## 4. Community Hot Topics

The most-discussed items (by comment activity) cluster on **security architecture** and **delegation semantics**:

1. **[Issue #11138](https://github.com/zeroclaw-labs/zeroclaw/issues/11138)** — *"define caller tool-level approval in bounded delegation"* (3 comments, `risk:high`, `status:accepted`, `follow-up`, tags span agent-loop, delegate tool, security policy). The core tension: when a bounded child agent inherits tools from a caller's registry, must it honor the caller's approval requirements? This builds on #10937.
   - **Underlying need:** a coherent, auditable model for delegated authority — critical for multi-agent trust.
2. **[Issue #12001](https://github.com/zeroclaw-labs/zeroclaw/issues/12001)** — *RFC: MITM egress proxy to control what the agent can access and to keep secrets hidden from the agent* (1 comment, `type:rfc`). Explicitly framed as a *material change to the security model*.
   - **Underlying need:** constrain a *compromised* agent, not just a misbehaving one; keep secrets out of agent-visible memory.
3. **[Issue #12373](https://github.com/zeroclaw-labs/zeroclaw/issues/12373)** — *Write-only WebUI credential management and scoped secret references* (0 comments, but paired with active PR #12408).
   - **Underlying need:** operators want secrets manageable but unreadable — a "write-only" vault pattern.

The pattern is clear: **ZeroClaw's community is pushing the security model from "limit what the agent does" toward "limit what the agent can even see and reach."**

---

## 5. Bugs & Stability

Ranked by severity (reported/updated today):

| Severity | Item | Component | Summary |
|---|---|---|---|
| **S2 — degraded** | [Issue #12413](https://github.com/zeroclaw-labs/zeroclaw/issues/12413) | provider | `OpenCode Go` context-window discovery returns no capacity: `zeroclaw doctor update-context-windows --model-provider opencode.go` fails with "provider does not expose context window or fetch failed" on v0.9.0. |
| **S2 — degraded** | [Issue #12412](https://github.com/zeroclaw-labs/zeroclaw/issues/12412) | provider | `OpenCode Go` uses **Zen's** model catalogue. `models refresh --model-provider opencode-go` pulls 139 Zen models instead of Go's, missing Go-only models. |
| Gateway auth | [Issue #12415](https://github.com/zeroclaw-labs/zeroclaw/issues/12415) | gateway/dashboard | Dashboard sign-out only ends the local session; does not perform OIDC **RP-initiated logout** (`end_session_endpoint`), so IdP session persists and silent re-login occurs. |
| (indirect) | [PR #11875](https://github.com/zeroclaw-labs/zeroclaw/pull/11875) | providers/agent | Text-only follow-up re-sends stale `[IMAGE:<path>]` markers as if fresh — multimodal context bug with `max_i…` default. Fix PR open. |
| (indirect) | [PR #12150](https://github.com/zeroclaw-labs/zeroclaw/pull/12150) | runtime/macOS | Seatbelt regex emitted a double backslash, so home-dotfile grants (`~/.cargo`, `~/.nvm`) never matched. Fix PR open (references #12137). |

**Fix PR status:** #12413 and #12412 have **no linked fix PR yet** — these are the freshest, potentially user-visible regressions and merit maintainer triage. The macOS sandbox and multimodal bugs already have open fix PRs in review.

---

## 6. Feature Requests & Roadmap Signals

Active feature/RFC queue, ranked by likely near-term traction:

- **[Issue #12001](https://github.com/zeroclaw-labs/zeroclaw/issues/12001)** — MITM egress proxy *(RFC, security trigger)*. High strategic weight; likely a multi-release effort.
- **[Issue #12373](https://github.com/zeroclaw-labs/zeroclaw/issues/12373)** — Write-only WebUI credential management + scoped secret references. **Already has PRs #12402 and #12408** → strong candidate for next release.
- **[Issue #11138](https://github.com/zeroclaw-labs/zeroclaw/issues/11138)** — Caller tool-level approval in bounded delegation. `status:accepted` → likely to land as design + implementation incrementally.
- **[Issue #12416](https://github.com/zeroclaw-labs/zeroclaw/issues/12416)** — ADR-016 holding-crate exception for host-mediated WASM plugin wake dispatch (`zeroclaw-runtime`, `RuntimeAgentWakeBackend`, `zeroclaw:plugin/dispatch.wake`). Architecture/plugin-system enabling work.
- **[Issue #12415](https://github.com/zeroclaw-labs/zeroclaw/issues/12415)** — OIDC RP-initiated logout for dashboard. Small, well-scoped, identity/access topic — plausible quick win.

**Prediction:** The **secrets/credential management** cluster (#12373 + #12402/#12408) and the **provider catalogue fixes** are the most likely to appear in the next version; the MITM proxy and delegation-approval items are larger, cross-cutting efforts likely tracked across multiple releases.

---

## 7. User Feedback Summary

**Pain points expressed by real users:**
- **Provider configuration confusion** (`noralane`, #12412/#12413): the OpenCode Go provider silently using Zen's catalogue and failing context-window discovery creates an untrustworthy model-selection experience — a *degraded, hard-to-diagnose* class of problem for anyone relying on accurate context windows.
- **Session/identity leakage** (`clumbo`, #12415): operators expect sign-out to sign out — the silent OIDC re-login undercuts security expectations for shared or managed dashboards.
- **Secret handling anxiety** (`CastelloBrancoTecnologia`, #12373; `LaurensBosscher`, #12001): multiple independent users are asking for credentials that operators can *set but not read*, and egress controls that hide secrets from the agent entirely. This is a consistent, security-literate user base.
- **Delegation trust** (`Audacity88`, #11138): users building multi-agent/delegated workflows need explicit, documented approval-inheritance semantics.

**Overall sentiment:** engaged and security-conscious. Feedback is precise and architectural rather than vague complaint — a sign of a sophisticated contributor/user base, but also of rising expectations around the security model keeping pace with the agent's capabilities.

---

## 8. Backlog Watch

Items needing maintainer attention:

- **[PR #9746](https://github.com/zeroclaw-labs/zeroclaw/pull/9746)** — *per-agent ownership scoping for session tools and discord_search*. Open since **2026-08-04** (~3+ months), `priority:p1`, `risk:high`, `distinguished contributor`, `needs-author-action`, XL. Touches identity-access, memory backend, channel core/telegram/discord. Long-lived and high-impact — deserves a clear path to merge or a decision.
- **[PR #12140](https://github.com/zeroclaw-labs/zeroclaw/pull/12140)** and **[PR #12136](https://github.com/zeroclaw-labs/zeroclaw/pull/12136)** — both `risk:high`, `needs-author-action`; #12136 is **breaking**. They've been open since late October; breaking security changes need timely review to avoid stale rebases and surprise breakage.
- **[PR #12240](https://github.com/zeroclaw-labs/zeroclaw/pull/12240)** — cron `--agent` reassignment persistence, `risk:high`, `needs-author-action` (since 2026-11-05). A correctness fix that's quietly waiting.
- **[Issue #11138](https://github.com/zeroclaw-labs/zeroclaw/issues/11138)** — `status:accepted` but still open since 2026-09-26; the delegation-approval design needs a resolution to unblock dependent work.

**Note:** The `needs-author-action` label appears on several high-risk PRs — the bottleneck here is author response, not maintainer review, which is a healthier failure mode but still slows the security-hardening pipeline.

---

*Digest generated 2026-11-14 from GitHub activity data. All links point to `github.com/zeroclaw-labs/zeroclaw`.*

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*