# OpenClaw Ecosystem Digest 2026-11-12

> Issues: 476 | PRs: 500 | Projects covered: 5 | Generated: 2026-11-12 02:12 UTC

- [OpenClaw](https://github.com/openclaw/openclaw)
- [Hermes Agent](https://github.com/nousresearch/hermes-agent)
- [IronClaw](https://github.com/nearai/ironclaw)
- [QwenPaw](https://github.com/agentscope-ai/QwenPaw)
- [ZeroClaw](https://github.com/zeroclaw-labs/zeroclaw)

---

## OpenClaw Deep Dive

# OpenClaw Project Digest — 2026-11-12

## 1. Today's Overview

OpenClaw remains in a very high-velocity maintenance phase: **476 issues and 500 PRs updated in the last 24 hours**, with a roughly even open/closed split (265/211 issues; 313/187 PRs). A new beta (`v2026.11.5-beta.2`) shipped, headlined by paged bidirectional conversation history and bounded archive reads. The day's PR traffic is dominated by a maintainer-led stability push (principally `steipete`) to remove **synchronous filesystem/DB work from the Gateway event loop** — a coherent response to the project's most persistent class of complaints (startup stalls, event-loop blocking, memory bloat). However, the issue tracker continues to carry a heavy load of P0/P1 crash-loop, message-loss, and session-state defects, several of them long-lived (60–150+ days), indicating that fix throughput is not yet keeping pace with reported reliability debt. Overall: **healthy contribution volume, elevated unresolved reliability risk**.

---

## 2. Releases

**v2026.11.5-beta.2** (1 new release)

### Highlights
- **Paged conversation history (both directions)** — large conversations remain browsable with visible history boundaries and **bounded archive reads**, preventing unbounded memory/IO when opening long sessions. (#188450, #188483, #188557, #188372, #190690) — authored by `@steipete`, thanks `@xydt-tanshanshan`.
- **macOS app preserves saved secrets** across restarts.

### Breaking Changes / Migration Notes
- No explicit breaking changes or migration steps are documented in the release notes.
- **Caveat (from the issue tracker):** the `2026.9.6` plugin source-capture change is still the root cause of several open P0/P1 regressions (Gateway blocking, Windows staging explosion). Users upgrading from ≤2026.9.5 on Windows or with large external plugins should treat 2026.11.x as **not yet verified clean** for those configurations (see §5).

---

## 3. Project Progress

**187 PRs merged/closed** and **211 issues closed** in the 24h window. Notable closed items today:

- **[CLOSED] #166634** — Late reclamation commit checkpoint failure leaving agents unavailable after crash recovery (`clawsweeper:not-repro-on-main`). [Link](https://github.com/openclaw/openclaw/issues/166634)
- **[CLOSED] #159638** — Excessive SQLite store/read worker churn (~7 workers/min, 512 MB each) pinning V8 CPU. [Link](https://github.com/openclaw/openclaw/issues/159638)
- **[CLOSED] #173095** — Control UI session sidebar empty on cold start (sessions.list never requested). [Link](https://github.com/openclaw/openclaw/issues/173095)
- **[CLOSED] #179481** — `doctor --fix` blocked by active agent-DB lease during transcript-directives migration. [Link](https://github.com/openclaw/openclaw/issues/179481)
- **[CLOSED] #179676** — Control UI pasted text (>1,000 chars) lost on subsequent turns. [Link](https://github.com/openclaw/openclaw/issues/179676)
- **[CLOSED] #181958** — `package-doctor` update failure (2026.10.3). [Link](https://github.com/openclaw/openclaw/issues/181958)

**Active fix PRs advancing (open):**
- **#197445, #197446, #197455, #197461** (steipete) — a coordinated set removing blocking directory-watch, DB-restat, lock-polling, and patch-file-check operations from the Gateway thread. [PR #197445](https://github.com/openclaw/openclaw/pull/197445) · [PR #197446](https://github.com/openclaw/openclaw/pull/197446) · [PR #197455](https://github.com/openclaw/openclaw/pull/197455) · [PR #197461](https://github.com/openclaw/openclaw/pull/197461)
- **#197457** — Shorten Gateway restart when active commands need cleanup. [Link](https://github.com/openclaw/openclaw/pull/197457)
- **#197427** — Preserve final-delivery recovery custody after RPC writer claim. [Link](https://github.com/openclaw/openclaw/pull/197427)
- **#197448** — Batch content searches across shared Git history (fixes lazy-fetch/promisor-pack explosion). [Link](https://github.com/openclaw/openclaw/pull/197448)
- **#195092** — Unicode NFC/NFD canonical matching in knowledge search. [Link](https://github.com/openclaw/openclaw/pull/195092)
- **#194688** — Feishu isolated topics process messages concurrently. [Link](https://github.com/openclaw/openclaw/pull/194688)

**Feature work in flight:** macOS one-ID approval setup (#197421), explicit bounded Deep Research workflow (#197453), continuation/context-pressure tools (#129388), GitHub integration → plugin migration (#192350).

---

## 4. Community Hot Topics

Most-commented issues in the window (links included):

1. **#160959 — [OPEN, P0, crash-loop] Gateway blocks for minutes capturing large external plugins** (81 comments). The single hottest thread. Root cause: plugin source-capture landed in 2026.9.6. Deep plugin/dependency trees stall the event loop at startup and on runtime republish. [Link](https://github.com/openclaw/openclaw/issues/160959)
2. **#164294 — [OPEN, P2] Gateway state DB WAL auto-checkpoint never completes** (40 comments). Checkpoint permanently `blocked by a reader`; frames accumulate (866/17,091 onward). [Link](https://github.com/openclaw/openclaw/issues/164294)
3. **#170956 — [OPEN, P0] Windows slow startup, unclean plugin shutdown, schtasks permission errors** (31 comments). Restarts/updates fail repeatedly; occasional `disconnect (1006)`. [Link](https://github.com/openclaw/openclaw/issues/170956)
4. **#168955 — [OPEN, P1] Startup regression 2026.10.1: ~1030s vs ~410s ready (Windows)** — `sidecars.control-ui-assets` blocks 477s (21 comments). [Link](https://github.com/openclaw/openclaw/issues/168955)
5. **#125764 — [OPEN, P1, message-loss] Telegram adapter dead-letters failed outbound sends after one attempt** (14 comments, 1 👍). Silent loss of announce/completion replies, no retry, no `reconcileUnknownSend`. [Link](https://github.com/openclaw/openclaw/issues/125764)
6. **#145309 — [CLOSED] claude-cli ignores CLAUDE_CONFIG_DIR** (14 comments, 2 👍). Missing-transcript resets and session failover. [Link](https://github.com/openclaw/openclaw/issues/145309)
7. **#144809 — [OPEN, P1] claude-cli turns longer than RUN_STALE_TAKEOVER_MS lose entire reply** (14 comments). [Link](https://github.com/openclaw/openclaw/issues/144809)

**Underlying needs analysis:** Community attention clusters around three themes — (a) **Gateway event-loop responsiveness** (plugin capture, WAL checkpoint, directory watching, DB restat), (b) **Windows as a second-class platform** (schtasks, staging explosion, 2.5× startup regression), and (c) **silent message loss** on channel adapters (Telegram, claude-cli). The high comment counts on months-old P0 threads signal that users are still *waiting*, not just discussing.

---

## 5. Bugs & Stability

Ranked by severity (fix PR noted where one exists):

| Severity | Issue | Summary | Fix PR? |
|---|---|---|---|
| **P0** | [#160959](https://github.com/openclaw/openclaw/issues/160959) | Gateway blocks minutes capturing large external plugins (2026.9.6 regression) — 81 comments | None new |
| **P0** | [#170956](https://github.com/openclaw/openclaw/issues/170956) | Windows schtasks/startup/shutdown unreliability; restarts fail often | None new |
| **P0** | [#178441](https://github.com/openclaw/openclaw/issues/178441) | Owner Telegram held by `providerReview`, no recovery action | None |
| **P0** | [#194664](https://github.com/openclaw/openclaw/issues/194664) | Codex "protected continuation" blocks all follow-ups while Stop reports no active run (2026.11.1) | None |
| **P0** | [#146791](https://github.com/openclaw/openclaw/issues/146791) | iOS App Store build never publishes `push.apns.register` — push broken | None |
| **P1** | [#168955](https://github.com/openclaw/openclaw/issues/168955) | Windows startup regression ~410s → ~1030s | None |
| **P1** | [#125764](https://github.com/openclaw/openclaw/issues/125764) | Telegram outbound send dead-lettered after 1 attempt (silent loss) | None |
| **P1** | [#144809](https://github.com/openclaw/openclaw/issues/144809) | claude-cli long turns lose full reply | None |
| **P1** | [#181432](https://github.com/openclaw/openclaw/issues/181432) | Baseline RSS ~300 MB → 1.89 GB (2026.10.5); SQLite tx timeouts | None |
| **P1** | [#168101](https://github.com/openclaw/openclaw/issues/168101) | Retry-After ignores `maxRetryDelayMs` after tool call; lane held | None |
| **P1** | [#191818](https://github.com/openclaw/openclaw/issues/191818) | claude-cli "no recorded inference account" in scheduled automation; backport #180492 requested | Partially (backport) |
| **P1** | [#181662](https://github.com/openclaw/openclaw/issues/181662) | npm update keeps Gateway stopped ~19 min, growing each release | None |
| **P1** | [#145690](https://github.com/openclaw/openclaw/issues/145690) | Subagent completion releases runtime generation; next lane task fails ~15ms, user message dropped | None |
| **P2** | [#164294](https://github.com/openclaw/openclaw/issues/164294) | State DB WAL checkpoint never completes | None |
| **P2** | [#162585](https://github.com/openclaw/openclaw/issues/162585) | Windows plugin staging re-materializes self, 290 MB → 612 MB+/24 min | None |

**Observations:** A large share of these are **regressions introduced by 2026.9.6/2026.10.x** and are marked `clawsweeper:no-new-fix-pr` — i.e., no fix PR is queued. However, the maintainer's blocking-I/O PR cluster this week (#197445/#197446/#197455/#197457/#197461, plus #159638's close) directly targets the *class* of defect behind #160959 and #164294, so incremental relief is plausibly landing in 2026.11.5.x.

---

## 6. Feature Requests & Roadmap Signals

Active user-requested features, ordered by likelihood of near-term adoption:

- **#192009 — Explicitly authorize cross-provider cron fallback accounts** (P2, 11 comments, diamond-lobster rating). High-signal request; low architectural risk — a plausible candidate for a near-future beta since model fallback plumbing already exists. [Link](https://github.com/openclaw/openclaw/issues/192009)
- **#179954 — Configurable per-entry chunking for `memory/` files** (P3, diamond-lobster). `memory-core` already has per-entry chunking, so this is a narrow extension — cheap to ship. [Link](https://github.com/openclaw/openclaw/issues/179954)
- **#176273 — Native progress-card SDK + trusted-plugin admission** (P2, security-labeled). Blocked on product/security decision. [Link](https://github.com/openclaw/openclaw/issues/176273)
- **#143387 — Android notification QoL** (session-aware, labels, cross-device suppression). [Link](https://github.com/openclaw/openclaw/issues/143387)
- **#170562 — Doctor recovery for stranded requester-settle wake.** Operator recovery affordance; follows from #154252. [Link](https://github.com/openclaw/openclaw/issues/170562)
- **#169428 — Expose auth profile (`model.auth_label`) in usage footer** (P3, fix-shape-clear). Nearly a one-line template change. [Link](https://github.com/openclaw/openclaw/issues/169428)
- **#164355 — Plugin hook to append content *after* tool results in-flight.** Architectural; likely to linger. [Link](https://github.com/openclaw/openclaw/issues/164355)

**Prediction:** The next 1–2 betas are more likely to *consolidate the I/O-blocking fixes* and ship small, clear-shape features (#169428, #179954, possibly #192009) than to land large architectural requests (#176273, #164355).

---

## 7. User Feedback Summary

**Pain points (dominant):**
- **Startup/restart reliability on Windows** — multiple independent reporters (#170956, #168955, #162585) describe minutes-scale startup, failed restarts, and staged plugin trees growing unbounded. Satisfaction here is visibly low ("only after many retries").
- **Silent message loss** — Telegram (#125764), claude-cli (#144809, #191818), and dashboard sessions (#144876) can drop replies with no user-visible error. This is the most trust-eroding class.
- **Resource bloat** — RSS jumping to ~1.9 GB (#181432) and worker/memory churn (#159638, #181432) hit self-hosters on ARM64/small hosts hardest.
- **UI fidelity** — path truncation and visible internal context injections (#172986, #165041) are minor but frequently cited friction.
- **Update downtime** — npm updates keeping the Gateway down ~19 min (#181662) undermines the "always-on assistant" premise.

**Positive signals:**
- Strong engagement: 81/40/31-comment threads show a vocal, invested user base.
- The **paged conversation history** feature in 2026.11.5-beta.2 responds directly to long-session browsability complaints — a well-received direction.
- Users actively file high-quality repros (source-repro tags, logs, version pins), reducing maintainer triage cost.

**Net sentiment:** Frustration concentrated on reliability of the *gateway lifecycle* and *message delivery*, not on the core agent capabilities — users clearly like the product enough to keep debugging it.

---

## 8. Backlog Watch

Long-lived, high-importance items needing maintainer attention (age as of 2026-11-12):

- **#91931** (created 2026-06-10, **~155 days open**, P1, diamond lobster) — Preseeded SOUL/IDENTITY/USER files auto-complete bootstrap and **delete user-provided BOOTSTRAP.md** before first run. Data-loss + onboarding bug with a clear fix-shape flag but no fix PR. [Link](https://github.com/openclaw/openclaw/issues/91931)
- **#101929** (2026-07-08, ~127 days) — context-overflow estimator over-counts **2.3–2.6×** vs billed usage; partial main-branch repair (#168338) but issue still open. [Link](https://github.com/openclaw/openclaw/issues/101929)
- **#125764** (2026-08-18, ~86 days, P1) — Telegram dead-lettering after single attempt. High blast radius, no fix PR. [Link](https://github.com/openclaw/openclaw/issues/125764)
- **#132767** (2026-08-29, ~75 days) — Generic CLI host assembles systemPromptAddition one turn late; prior source fix (#100984) **closed without merge, no issue filed** — process gap worth revisiting. [Link](https://github.com/openclaw/openclaw/issues/132767)
- **#141172** (2026-09-07, ~66 days) — Runs dying pre-first-commit leak `agent.run.started` forever; FK failures, no `agent.run.finished`. [Link](https://github.com/openclaw/openclaw/issues/141172)
- **#129388** (PR, opened 2026-08-25, ~79 days, XL) — Context-pressure-aware continuation tools; large, security-sensitive, stuck in `needs proof`. [Link](https://github.com/openclaw/openclaw/pull/129388)
- **#155860** (PR, opened 2026-09-22, ~51 days) — Let memory slot owner report its own dreaming status; waits on author. [Link](https://github.com/openclaw/openclaw/pull/155860)

**Recommendation:** #91931 and #125764 are the two backlog items with the highest ratio of user impact to remaining work; both have `fix-shape-clear`/`source-repro` signal and neither has an open fix PR.

---

*Data source: github.com/openclaw/openclaw — window 2026-11-11 → 2026-11-12. Comment/reaction counts reflect snapshot at generation time; `undefined` comment counts on PRs indicate the field was not returned in the source data.*

---

## Cross-Ecosystem Comparison

# Cross-Project Comparison Report — Personal AI Assistant / Agent OSS Ecosystem
**Snapshot date: 2026-11-12** | Projects: OpenClaw, Hermes Agent, IronClaw, QwenPaw, ZeroClaw

---

## 1. Ecosystem Overview

The personal AI assistant / agent open-source landscape on 2026-11-12 is **post-hype and consolidation-heavy**: reference implementations have shipped multi-user, multi-channel, plugin-extensible runtimes, and the community's energy has shifted from "what can an agent do" to "can I trust it in production." Five projects span a wide maturity gradient — from OpenClaw's ~476 issue / 500 PR daily cadence to IronClaw's zero activity — but they share a common failure narrative: **gateway lifecycle reliability, message-delivery integrity, and observability of agent failure**. A second thematic wave is visible across QwenPaw, Hermes, and ZeroClaw: **plugin/channel abstraction is the dominant refactor**, and it is temporarily regressing previously-working integrations. Security posture (HMAC, consent gates, tripwire plugins, dependency advisories) is now a first-class community contribution category rather than a niche. Net signal: the ecosystem's bottleneck has moved from *capability* to *operational trust*.

---

## 2. Activity Comparison

| Project | Issues (24h) | PRs (24h) | Release Status | Health Score* |
|---|---|---|---|---|
| **OpenClaw** | 476 updated (265 open / 211 closed) | 500 updated (313 open / 187 closed) | **v2026.11.5-beta.2** — active pre-stable line | **B+** — high velocity, elevated unresolved P0 debt |
| **Hermes Agent** | 50 updated (**0 closed**) | 50 updated (**0 merged / 0 closed**) | No release; testing against **v0.23.0** | **C+** — active PR queue, but zero merge throughput + regression debt |
| **IronClaw** | 0 | 0 | None | **N/A** — dormant |
| **QwenPaw** | 7 updated | 32 updated (5 closed incl. 8-month PR) | **v2.3.0 Stable** shipped; **beta.4 verification closed clean** | **B** — strong release cadence, plugin-migration regressions open |
| **ZeroClaw** | 8 updated (**0 closed**, all open) | 49 updated (**45 open**, 4 merged/closed) | **v0.9.0** — multi-user OIDC release | **B-** — solid direction, review-capacity bottleneck (45:4) |

\* Health score synthesizes velocity, merge/close throughput, release hygiene, unfixed critical bugs, and backlog age from the underlying digests.

**Reading the table:**
- **OpenClaw** is an order of magnitude larger in raw activity than any peer, and is the only project shipping a beta *and* closing ~200 issues/day.
- **Hermes** and **ZeroClaw** both show a **review throughput deficit** (0 and 4 merges respectively) despite large open queues — the ecosystem's most replicable anti-pattern.
- **QwenPaw** is the only project that shipped a **stable** release on the window, but it is also the only one with an explicit *release-blocking regression cluster* (channel plugins).
- **IronClaw** is effectively inactive and should be treated as a watch-list outlier, not a comparator.

---

## 3. OpenClaw's Position

**Advantages vs peers:**
- **Scale of contribution surface.** OpenClaw's 24h window (~976 issue+PR updates) exceeds the combined totals of Hermes, QwenPaw, and ZeroClaw by roughly 8×. This produces faster triage feedback loops, richer reproduction data, and a wider plugin ecosystem — its biggest structural moat.
- **Coherent maintainer-led technical direction.** The `steipete`-authored blocking-I/O PR cluster (#197445/#197446/#197455/#197457/#197461) is a rare example of *class-level* remediation targeting the root cause (synchronous FS/DB on the Gateway event loop) rather than per-symptom patching. No peer shows a comparable coordinated hardening thrust except Hermes' `c2h5oh` sec-marathon, which is narrower in scope.
- **Mature release cadence.** Weekly beta cadence with documented caveats (e.g., the 2026.9.6 plugin source-capture regression) beats "no release + 50 open PRs" by every operational metric.

**Technical approach differences:**
- OpenClaw's architecture is **gateway-centric with bidirectional conversation history and bounded archive reads** — i.e., it optimizes for long-session fidelity, which peers do not yet engineer for explicitly. Hermes' unified gateway (#106742) is thematically similar but landed *before* the reliability hardening, which is precisely why Hermes is currently drowning in cross-surface regressions.
- OpenClaw leans on a **SQLite state DB with WAL** — a source of both its resilience and its worst latency complaints (#164294, #181432). ZeroClaw uses `runtime-trace.jsonl` + daemon with similar observability gaps (#12391). Neither has solved "durable, cheap, queryable runtime state."

**Community size comparison:**
- **Hot-thread intensity:** OpenClaw's top thread has **81 comments**; Hermes' top thread has **60**; ZeroClaw's top thread has **6**. By engaged-user proxy, OpenClaw is the largest and most argumentative community by roughly an order of magnitude.
- **Backlog age distribution:** OpenClaw's oldest P1s run **150+ days** (#91931); Hermes' top PR is **~5 months** (#40850); ZeroClaw's CI issue is **~5 months** (#7461). OpenClaw's *absolute* backlog is larger, but its *relative* closure rate (~44% of updated issues closed in 24h) is the highest in the cohort.

**Verdict:** OpenClaw is the de-facto reference implementation — the project whose failure modes peers will inherit and whose fixes they will copy. Its risk is *breadth-induced triage dilution*, not direction.

---

## 4. Shared Technical Focus Areas

Five requirements recur across ≥2 projects and constitute the ecosystem's emerging common agenda:

**(a) Gateway / daemon event-loop responsiveness under load.**
- OpenClaw: plugin source-capture blocking minutes at startup (#160959), WAL checkpoint never completing (#164294), DB-restat/directory-watch blocking (#197445–#197461).
- Hermes: unified-gateway regression set (#143547), Windows event-loop stalls under concurrent Kanban workers (#152364), multiplexed dashboard losing MCP tools after failed teardown (#152175).
- ZeroClaw: `runtime-trace.jsonl` dropping events across daemon restarts (#12391), cron receipt recovery clearing a newer live firer's claim (#152296).
- **Shared need:** *cooperative async I/O with bounded, observable backpressure* — and a standard way to attribute stalls to a specific subsystem.

**(b) Silent message / delivery loss.**
- OpenClaw: Telegram outbound dead-lettered after one attempt (#125764), claude-cli long turns dropping replies (#144809), iOS APNs never registering (#146791).
- Hermes: Weixin voice message stuck in `session_admissions` (#152365), 0-byte `state.db` breaking bot delivery (#153048), Discord handoff thread `type` defaulting wrong (#95670).
- **Shared need:** *delivery reconciliation with retry budgets and user-visible failure surfaces* — currently absent everywhere.

**(c) Plugin / channel abstraction hardening.**
- QwenPaw: channel plugin extraction producing `CHANNEL_NOT_CONNECTED` (#8669), missing `HOME`/`QWENPAW_WORKING_DIR` on Linux (#8682), Matrix multi-workspace race (#8538).
- Hermes: plugin generation lock-pin migration (#154165), plugin catalog churn (Cutroom, EarnFi, snare).
- OpenClaw: GitHub integration → plugin migration (#192350), trusted-plugin admission (#176273).
- ZeroClaw: SOP/delegate tool-ceiling and shared-tmp hardening (#12394, #154127-equivalent PRs).
- **Shared need:** *a formal plugin host↔worker contract* — env propagation, health-check timing, state initialization, and capability scoping — before migration can be called stable.

**(d) Cost, billing, and usage observability.**
- Hermes: fallback model persisted to session state survives reload (#152333 — silent billing continuation), per-session cost display demanded (#93951).
- OpenClaw: RSS bloat 300 MB → 1.89 GB (#181432), worker churn (#159638), update downtime ~19 min (#181662).
- ZeroClaw: operator override for exceeded cost limit only via restart (#11589).
- **Shared need:** *real-time, per-session cost and resource telemetry with user-controllable bounds.*

**(e) Cron / automation semantics correctness.**
- ZeroClaw: cron reports `Ok` while agent concludes `BLOCKED` (#12397).
- OpenClaw: cross-provider cron fallback authorization requested (#192009), stale-takeover losses (#144809), subagent completion races (#145690).
- Hermes: cron receipt recovery corrupting live firer (#152296), Kanban `blocker_auth` permanent stall (#119070).
- **Shared need:** *distinct execution-status and task-outcome channels* — the current conflation is a root cause across three projects.

---

## 5. Differentiation Analysis

| Dimension | OpenClaw | Hermes Agent | QwenPaw | ZeroClaw |
|---|---|---|---|---|
| **Primary focus** | General-purpose reference runtime; long-session fidelity | Unified multi-surface gateway (CLI/TUI/Desktop/bots/cron) | Consumer + enterprise messaging channels; local decision models | Self-hosted / home-lab daemon; multi-tenant auth |
| **Target user** | Broad OSS dev/self-hoster base | Multi-surface power users + Desktop users | Enterprise messaging (Feishu/WeChat/Matrix/DingTalk/QQ) + desktop | Home-lab operators, multi-user self-hosts |
| **Architecture** | Gateway + SQLite/WAL state DB; plugin source-capture | Single unified gateway process (~all surfaces) | Plugin-extracted subsystems (channels, MCP, models, agents) | Rust daemon + `runtime-trace.jsonl` + cron dispatcher |
| **Release posture** | Weekly betas with explicit caveats | No release this window; ~50 unmerged PRs | Stable v2.3.0 shipped; patch expected | v0.9.0 shipped; 45-PR review queue |
| **Standout differentiator** | Paged bidirectional history + bounded archive reads; maintainer-led blocking-I/O remediation | Desktop redesign; durable subagent continuation; sec-marathon | Piccolo 4B/9B/27B local decision models; OpenSandbox cloud backend | First multi-user OIDC sign-in; scoped per-account chat |
| **Biggest own-goal** | 2026.9.6 plugin regression still latent on Windows | Merged unified gateway without routing isolation | Plugin migration regressed channels that previously worked | Review backlog aging XL PRs past 2 months |

**Key architectural divergence:** OpenClaw and Hermes both bet on *a single gateway process* but arrive there from opposite directions — OpenClaw layered reliability fixes *on top of* a mature gateway; Hermes merged surfaces *into* a gateway and is now paying the integration tax. QwenPaw is decomposing *out of* a monolith into plugins — the opposite trajectory. ZeroClaw alone has kept a **tight core + thin channel surface**, which likely explains its cleaner security posture and its smaller raw bug count, at the cost of ecosystem breadth.

---

## 6. Community Momentum & Maturity

**Tier 1 — Rapid iteration at scale (OpenClaw).** ~200 issue closes/day, weekly betas, coordinated maintainer hardening PRs. Mature triage pipeline; primary risk is *reliability debt not yet converted to fixes* (multiple P0s with `clawsweeper:no-new-fix-pr`).

**Tier 2 — High activity, throughput-limited (Hermes, ZeroClaw).**
- **Hermes** has the broadest surface area and the deepest security workstream (sec-marathon: consent gates, HMAC hardening, per-session bearer auth, tmp hardening) but **zero merges in 24h** against 50 open PRs — a textbook review-capacity bottleneck.
- **ZeroClaw** shipped a substantive v0.9.0 (117 commits, 22 contributors) with same-day security patching (#12392), and its community files precise, evidence-backed production reports — but sits at a **45:4 open:closed PR ratio** and four unfixed S1/S2 bugs. Direction is right; throughput is the constraint.

**Tier 3 — Stabilizing, release-verified (QwenPaw).** Shipped stable v2.3.0, closed an 8-month contributor PR (#1972), and closed a beta.4 verification cleanly. But the same window shows an **open stable release-verification issue (#8681)** and a release-blocking channel regression cluster — so it is *simultaneously* the most release-mature and the most exposed project in the cohort.

**Tier 4 — Dormant (IronClaw).** Zero activity; watch-list only.

**Momentum synthesis:** The ecosystem has **two active engineering cultures** — OpenClaw's "close more than you open" pipeline and a wider "open more than you close" pattern at Hermes/ZeroClaw. QwenPaw is the only mid-tier project executing a *verification-gated* release process, which is the model the other three will likely need to adopt as they approach stable.

---

## 7. Trend Signals

**For AI agent developers and decision-makers, the 2026-11-12 window surfaces six durable signals:**

1. **Reliability is the product, not the feature.** Every project's top pain points are lifecycle/delivery/observability failures — not missing capabilities. Budget for gateway hardening, delivery reconciliation, and structured trace integrity *before* new integrations.

2. **The "agent hides why it failed" anti-pattern is ecosystem-wide.** ZeroClaw's swallowed stderr (#12390), Hermes' stuck `session_admissions` (#152365), OpenClaw's Telegram dead-lettering (#125764), and ZeroClaw's cron `Ok`-despite-`BLOCKED` (#12397) are the *same* failure mode wearing four costumes. A shared open standard for agent failure surfaces (structured outcome + reason + recovery hint) is overdue.

3. **Plugin/channel extraction is high-risk, high-return — treat it as a stability project.** QwenPaw's channel regressions (#8669, #8538, #8682), Hermes' plugin lock-pin migration (#154165), and OpenClaw's GitHub-to-plugin move (#192350) all show the same pattern: the migration itself causes more incidents than the pluginized subsystem did pre-migration. Harden the host↔worker contract (env vars, health checks, startup timing) *before* the refactor.

4. **Security is now a community contribution category, not a vendor feature.** Same-day RUSTSEC patches (ZeroClaw #12392), coordinated sec-marathon PRs (Hermes #153698–#154137), and community prompt-injection tripwires (snare #153380) indicate a maturing supply chain. Expect security-labeled PRs to be a leading indicator of project health.

5. **Cost/billing observability is the next trust frontier.** Hermes users see fallback providers silently billing (#152333); OpenClaw users see RSS quadruple (#181432); ZeroClaw users can only escape cost limits via restart (#11589). Per-session, real-time cost and resource display — with hard bounds — will differentiate projects with paid-API users.

6. **Review throughput, not contributor interest, is the ecosystem bottleneck.** Hermes (0 merges / 50 open PRs), ZeroClaw (4 / 45), and QwenPaw's long-review queue (#8236, #8409, #8601) show healthy contribution *supply* meeting limited *review capacity*. Projects that invest in reviewer tooling, batched-review workflows, or paid maintainer bandwidth will compound; those that don't will accumulate bit-rotting XL PRs and contributor churn.

**Bottom line for builders:** OpenClaw is the ecosystem's reference and its most active hardening ground; Hermes is the most architecturally ambitious and most regression-exposed; QwenPaw is the enterprise-channel and local-model specialist executing the cleanest release discipline; ZeroClaw is the rust-native self-hosting platform with the best security reflexes and the worst review backlog. The shared agenda — event-loop responsiveness, delivery reconciliation, plugin contract hardening, cost observability, and cron semantics — is the de-facto 2027 roadmap for the category, whether or not the projects coordinate on it.

---

## Peer Project Reports

<details>
<summary><strong>Hermes Agent</strong> — <a href="https://github.com/nousresearch/hermes-agent">nousresearch/hermes-agent</a></summary>

# Hermes Agent — Project Digest
**Date: 2026-11-12** | Source: github.com/nousresearch/hermes-agent

---

## 1. Today's Overview

Hermes Agent is in a high-churn, low-merge state on 2026-11-12: **50 issues and 50 PRs were updated in the last 24 hours, but zero issues were closed and zero PRs were merged**, with no new releases. The dominant theme is **post-merge stabilization of the "unified gateway" (#106742)**, which continues to generate a long tail of regressions across gateway, cron, plugins, Discord, WeCom, Desktop, and session/profile subsystems — the tracking issue #143547 alone has 60 comments. A large coordinated **security hardening marathon ("sec-marathon")** is visible in the PR queue, with `c2h5oh` authoring a series of P1/P2 security fixes touching debug uploads, webhooks, WhatsApp/Feishu bridges, dashboard file writes, and SSH temp dirs. Meanwhile, a substantial backlog of P2 regressions on Desktop, Windows gateway, and update/install paths remains unfixed, and several issues are aging (some since August 2026). Overall health: **active and security-conscious, but merge throughput today is zero and regression debt is accumulating**.

---

## 2. Releases

**No new releases in the last 24 hours.** No changelog, breaking-change, or migration notes to report. The last referenced runtime in issue reports is **v0.23.0** (with some MSIX/store builds pinned to v0.22.5-era code), which is the de-facto current baseline users are testing against.

---

## 3. Project Progress

**No PRs were merged or closed in the last 24h**, so no features formally landed today. However, the open PR queue shows active workstreams that are close to landing:

- **Security hardening (sec-marathon series, all still open):**
  - [#153698](https://github.com/NousResearch/hermes-agent/pull/153698) — require explicit consent before `/debug` uploads anything (P1)
  - [#153681](https://github.com/NousResearch/hermes-agent/pull/153681) — gate `OPENAI_API_KEY` on OpenAI hosts for custom endpoints (P1)
  - [#153699](https://github.com/NousResearch/hermes-agent/pull/153699) — Feishu reactions/card clicks must pass the chat's admission gate (P1)
  - [#154153](https://github.com/NousResearch/hermes-agent/pull/154153) — reject body-only V1 HMAC webhooks; opt-in per-route signature pin (P2)
  - [#154135](https://github.com/NousResearch/hermes-agent/pull/154135) — per-session bearer auth on the WhatsApp bridge HTTP API (P2)
  - [#154136](https://github.com/NousResearch/hermes-agent/pull/154136) — refuse dashboard managed-file writes to credential files (P2)
  - [#154127](https://github.com/NousResearch/hermes-agent/pull/154127) — refuse squatted shared-tmp SSH ControlMaster dirs (P2)
  - [#154137](https://github.com/NousResearch/hermes-agent/pull/154137) — reduce `/api/status` diagnostics for unverified callers (P2)
- **Durability / correctness:**
  - [#154163](https://github.com/NousResearch/hermes-agent/pull/154163) — continue a stopped subagent after gateway restart/crash (salvage of #145331)
  - [#154165](https://github.com/NousResearch/hermes-agent/pull/154165) — move plugin generations onto core's newer lock pins
  - [#134274](https://github.com/NousResearch/hermes-agent/pull/134274) — honor classified provider failures on long sessions (P1, message-delivery risk)
  - [#142326](https://github.com/NousResearch/hermes-agent/pull/142326) — restore autostash instead of prompting on gateway-driven updates
- **Plugin catalog additions (P3):** `cutroom` [#153612](https://github.com/NousResearch/hermes-agent/pull/153612), `dosbox-full-auto` [#152807](https://github.com/NousResearch/hermes-agent/pull/152807), `EarnFi` [#152848](https://github.com/NousResearch/hermes-agent/pull/152848), `snare` prompt-injection tripwire [#153380](https://github.com/NousResearch/hermes-agent/pull/153380), KAME updates [#154194](https://github.com/NousResearch/hermes-agent/pull/154194).
- **Desktop redesign:** [#152168](https://github.com/NousResearch/hermes-agent/pull/152168) — redesigned agent workspace with classic-layout recovery.

---

## 4. Community Hot Topics

| Rank | Item | Comments | Link |
|---|---|---|---|
| 1 | **Unified gateway (#106742) post-merge problems** — tracking issue; every local conversation now routed through one gateway process | 60 | [#143547](https://github.com/NousResearch/hermes-agent/issues/143547) |
| 2 | **RFC: Doc-chain substrate network** — read, governance, compaction of durable records | 36 | [#143379](https://github.com/NousResearch/hermes-agent/issues/143379) |
| 3 | **Kanban card stuck as `blocker_auth` forever** after a rate-limited-then-successful run | 24 | [#119070](https://github.com/NousResearch/hermes-agent/issues/119070) |
| 4 | **Remote Desktop update reports failure** despite successful systemd restart | 10 | [#106592](https://github.com/NousResearch/hermes-agent/issues/106592) |
| 5 | **English-only stall-guard intent detector** disables anti-stall for non-English agents | 9 | [#105163](https://github.com/NousResearch/hermes-agent/issues/105163) |

**Underlying needs analysis:**
- The unified-gateway thread (#143547) is the project's central integration risk: merging CLI, TUI, Desktop, API, editors, bots, cron, Kanban, and group chats into one process has created a broad regression surface. Users need **routing isolation and clear failure attribution** per surface.
- #143379 signals a maturing concern: **durable, provenance-preserving memory that survives context compression** — i.e., users are hitting the limits of session-scoped context and want cross-session continuity they can trust.
- #119070 and #143547 both point at **dispatcher/state-machine correctness under concurrency** (Kanban workers, respawn guards, lease ownership) — a recurring reliability theme.
- #105163 highlights an **internationalization gap** in agent runtime heuristics, affecting a non-English user base.

---

## 5. Bugs & Stability

Ranked by severity (P1 first), noting whether a fix PR is open:

**P1**
- **Discord handoff thread creation omits `type`, defaults to `private_thread`** [#95670](https://github.com/NousResearch/hermes-agent/issues/95670) — message-delivery risk; no linked fix PR.
- *(PR-side P1)* #134274 honors classified provider failures on long sessions; #153698, #153681, #153699 are open P1 security fixes.

**P2 — Gateway / sessions / delivery**
- **Weixin voice message leaves `session_admissions` stuck at `started`** — session reports running forever, later messages silently dropped [#152365](https://github.com/NousResearch/hermes-agent/issues/152365). No fix PR.
- **Fallback model persisted to session state survives reload** — session silently keeps billing fallback provider after primary recovers [#152333](https://github.com/NousResearch/hermes-agent/issues/152333). Billing impact; no fix PR.
- **0-byte `state.db` passes `is_file()`, breaks bot live delivery** with `OperationalError: no such table: sessions` [#153048](https://github.com/NousResearch/hermes-agent/issues/153048). No fix PR.
- **Windows gateway event-loop stalls under concurrent Kanban workers**, misleading worker-loss reasons, stale env probe cache [#152364](https://github.com/NousResearch/hermes-agent/issues/152364). No fix PR.
- **Cron receipt recovery clears a newer live firer's `fire_claim`**, discarding its run [#152296](https://github.com/NousResearch/hermes-agent/issues/152296). No fix PR.

**P2 — Desktop / UI**
- **"Show earlier messages" inert in Desktop** — older history never loads, opening prompt never renders [#133569](https://github.com/NousResearch/hermes-agent/issues/133569).
- **Webapp sticky-prompt clip breaks when CSS zoom ≠ 100%** [#147400](https://github.com/NousResearch/hermes-agent/issues/147400).
- **Desktop model picker commits picked model with the session's current provider** — cross-provider route mismatch [#143323](https://github.com/NousResearch/hermes-agent/issues/143323).
- **Clarify card answered in a non-launch profile window returns "expired"** on global remote [#152307](https://github.com/NousResearch/hermes-agent/issues/152307).
- **`/new` in a remote gateway's Bot Chat opens a local session instead of compacting remotely** [#152344](https://github.com/NousResearch/hermes-agent/issues/152344).

**P2 — Update / install / platform**
- **`hermes update` on Linux system units without passwordless sudo leaves a phantom restart owed forever** [#145375](https://github.com/NousResearch/hermes-agent/issues/145375). Related fix PR #142326 open (autostash path).
- **`hermes update` never restarts units outside `hermes-gateway*`/`serve*`/`dashboard*` name families** [#152200](https://github.com/NousResearch/hermes-agent/issues/152200).
- **macOS Desktop declares healthy install missing, quits** — 15s probe runs `hermes --version`, whose passive update check costs 4–76s [#148498](https://github.com/NousResearch/hermes-agent/issues/148498).
- **WebUI stores No Progress Timeout as text instead of number in `config.yaml`** [#152302](https://github.com/NousResearch/hermes-agent/issues/152302).

**P2 — Tools / providers / auth**
- **Multiplexed dashboard backend loses every MCP tool after failed loop teardown** — background discovery reports "zero connected servers" until restart [#152175](https://github.com/NousResearch/hermes-agent/issues/152175).
- **openai-codex image generation reports "no credentials"** due to unscoped pool select with an entitlement bench [#152300](https://github.com/NousResearch/hermes-agent/issues/152300).
- **Non-vision image fallback calls `vision_analyze` with empty source for oversized inline images**, tells model the image is corrupt [#132605](https://github.com/NousResearch/hermes-agent/issues/132605).

**P2/P3 — Other**
- Android soft-keyboard input dropped in dashboard chat (xterm `screenReaderMode`) [#145296](https://github.com/NousResearch/hermes-agent/issues/145296).
- Windows MSIX terminal commands flash console windows [#149907](https://github.com/NousResearch/hermes-agent/issues/149907).
- `hermes skills trust` falsely reports "Not inside a git checkout" [#127025](https://github.com/NousResearch/hermes-agent/issues/127025).
- Desktop "Get key" links dead under hardened window-open policy [#107988](https://github.com/NousResearch/hermes-agent/issues/107988).
- `plugins check-updates` shows phantom PyPI "update available" for catalog-pinned plugins [#132494](https://github.com/NousResearch/hermes-agent/issues/132494).

**Fix-PR coverage:** Only a minority of today's open bugs have a directly linked fix PR. The security bugs have matching open PRs (see §3); most Desktop, Windows, cron, and delivery bugs do **not** yet have a fix in flight.

---

## 6. Feature Requests & Roadmap Signals

- **Per-session real-time cost display in chat UI** [#93951](https://github.com/NousResearch/hermes-agent/issues/93951) — `display.show_cost` is currently a dead config in 0.20.4. High user demand from paid-API users (DeepSeek etc.). Strong candidate for a near-term release given the billing-related bug #152333 adds urgency.
- **Native video fast-path for `video_analyze`** [#88141](https://github.com/NousResearch/hermes-agent/issues/88141) — route video into the main model's multimodal tool-result channel when supported (mirrors existing image fast-path). P3.
- **Redesigned Desktop agent workspace** (PR [#152168](https://github.com/NousResearch/hermes-agent/pull/152168)) — global navigation, gateway-grouped agents, pinnable workspace; likely to define the next Desktop release.
- **Durable subagent continuation** (PR [#154163](https://github.com/NousResearch/hermes-agent/pull/154163)) — resume crashed/restarted subagents on their own conversation. Signals a roadmap push toward **long-running agent durability**.
- **Doc-chain substrate RFC** [#143379](https://github.com/NousResearch/hermes-agent/issues/143379) — durable, provenance-preserving record across compaction; architectural signal, not a near-term feature.
- **Prompt-injection tripwire plugin (`snare`)** [#153380](https://github.com/NousResearch/hermes-agent/pull/153380) — community interest in agent security tooling.

**Prediction:** The next version is most likely to ship the **sec-marathon security fixes** and **Desktop redesign**, with **cost display** and **durable subagent continuation** as the headline user-facing features if they clear review.

---

## 7. User Feedback Summary

- **Gateway unification pain is the top dissatisfaction driver.** Users report cross-surface breakage (Discord, WeCom/Weixin, Desktop, cron, Kanban) after merging everything into one gateway process, with poor failure attribution — e.g., a stuck `session_admissions` row "for ~12 hours" silently dropping messages [#152365](https://github.com/NousResearch/hermes-agent/issues/152365).
- **Billing trust is eroding.** Two independent reports — fallback model persisted to session state [#152333](https://github.com/NousResearch/hermes-agent/issues/152333) and no per-session cost visibility [#93951](https://github.com/NousResearch/hermes-agent/issues/93951) — mean users on paid APIs cannot see or control what they are being charged.
- **Update/install paths are fragile on Linux and macOS.** Phantom restart-owed state [#145375](https://github.com/NousResearch/hermes-agent/issues/145375), un-restarted non-standard units [#152200](https://github.com/NousResearch/hermes-agent/issues/152200), and a healthy macOS install being declared missing and quitting [#148498](https://github.com/NousResearch/hermes-agent/issues/148498) are all high-frustration, trust-damaging failures.
- **Non-English users are underserved** by the English-only stall guard [#105163](https://github.com/NousResearch/hermes-agent/issues/105163).
- **Positive signal:** The volume and specificity of security PRs (#153698, #153681, #154153, #154135, #154136, #154127, #154137) and community plugins (Cutroom, EarnFi, snare, dosbox-full-auto) show an engaged contributor base actively hardening and extending the platform.

---

## 8. Backlog Watch

Long-unanswered or stalled items needing maintainer attention:

- **[#40850](https://github.com/NousResearch/hermes-agent/pull/40850)** — TUI multiline status bar for narrow terminals; open since **2026-06-06** (~5 months), tagged `sweeper:risk-compatibility`, `sweeper:blast-moderate`. No merge progress.
- **[#88141](https://github.com/NousResearch/hermes-agent/issues/88141)** — Native video fast-path for `video_analyze`; open since **2026-08-17** (~3 months), only 1 comment.
- **[#95670](https://github.com/NousResearch/hermes-agent/issues/95670)** — Discord handoff thread `type` bug; open since **2026-08-26**, P1 message-delivery risk, **no fix PR linked**.
- **[#93951](https://github.com/NousResearch/hermes-agent/issues/93951)** — Per-session cost display; open since **2026-08-24**, unaddressed despite clear demand and a dead config flag.
- **[#106592](https://github.com/NousResearch/hermes-agent/issues/106592)** — Remote Desktop update false-failure; open since **2026-09-09**, 10 comments, `sweeper:risk-compatibility`, no fix PR.
- **[#119070](https://github.com/NousResearch/hermes-agent/issues/119070)** — Kanban `blocker_auth` permanent stuck card; open since **2026-09-22**, 24 comments, tagged `needs-decision`, no fix PR.
- **[#132605](https://github.com/NousResearch/hermes-agent/issues/132605)** and **[#132494](https://github.com/NousResearch/hermes-agent/issues/132494)** — vision fallback and plugin update-check bugs; open since early October, low engagement, no fixes.

**Recommendation:** The maintainer team should prioritize (a) closing out the unified-gateway regression set around #143547, (b) merging the sec-marathon PRs to lock in security posture, and (c) triaging `needs-decision` items #119070 and #143379, which are blocking progress on dispatcher reliability and memory architecture respectively.

---
*Generated from GitHub activity data for 2026-11-12. Comment counts and statuses reflect the snapshot provided; PR comment counts were unavailable (`undefined`) in source data.*

</details>

<details>
<summary><strong>IronClaw</strong> — <a href="https://github.com/nearai/ironclaw">nearai/ironclaw</a></summary>

No activity in the last 24 hours.

</details>

<details>
<summary><strong>QwenPaw</strong> — <a href="https://github.com/agentscope-ai/QwenPaw">agentscope-ai/QwenPaw</a></summary>

# QwenPaw Project Digest — 2026-11-12

## 1. Today's Overview

QwenPaw shows **high-velocity development activity** heading into the v2.3.0 stable release, with 32 PRs and 7 issues updated in the last 24 hours. The project is in a critical release-verification window: v2.3.0 (Stable) has been published and its installation-verification issue (#8681) is open, while beta.4 verification (#8667) closed cleanly. A major architectural push is underway to **extract channels, MCP, local model management, and third-party agents into plugins** (PRs #8426, #8469, #8499, and channel plugin work), which is the dominant theme of current development. However, this plugin migration is generating a cluster of **startup/connectivity regressions** — particularly for Feishu, Matrix, and WeChat channel plugins across Windows and Linux — suggesting the release carries meaningful stability risk for channel users.

---

## 2. Releases

### v2.3.0 (Stable) — 🆕 Released

**What's Changed — ✨ Added:**

**Piccolo Local Decision Models**
- Added **Piccolo 4B, 9B, and 27B** as local decision models for **tool review and context compaction**.
- Provides BF16 and Q8_0 quantization recommendations.
- Supports runtime installation and updates.
- Model downloads via **Hugging Face or ModelScope**.

**Migration / Compatibility Notes:**
- No explicit breaking changes are documented in the release notes. However, given the ongoing plugin-extraction refactor (see Sections 3 & 5), users upgrading from pre-2.3 versions — especially those using **Matrix, WeChat, or Feishu channels** — should verify channel connectivity post-upgrade.
- Release-verification tracking issue: [#8681](https://github.com/agentscope-ai/QwenPaw/issues/8681)

---

## 3. Project Progress

### Merged / Closed PRs Today

| PR | Title | Outcome |
|---|---|---|
| [#1972](https://github.com/agentscope-ai/QwenPaw/pull/1972) | `feat(sandbox): integrate OpenSandbox as cloud sandbox backend` | **CLOSED** — Long-running (opened March 2026) first-time-contributor feature enabling remote container execution for all agent tool operations (shell, file I/O, browser automation). |
| [#8542](https://github.com/agentscope-ai/QwenPaw/pull/8542) | `chore: update the release note for v2.3.0` | **CLOSED** — Release documentation finalized. |
| [#8680](https://github.com/agentscope-ai/QwenPaw/pull/8680) | `fix(desktop): fix feishu import timeout in windows desktop` | **CLOSED** — Windows-specific Feishu import fix. |
| [#8675](https://github.com/agentscope-ai/QwenPaw/pull/8675) | `fix(channels): diagnose startup failures and fix Windows Feishu native library loading` | **CLOSED** — Root-caused Feishu `CHANNEL_NOT_CONNECTED` to a PyCryptodome native library path issue (`\\?\` prefix + `..`). |

### Features Advanced
- **Cloud sandbox backend** (OpenSandbox) landed after an 8-month review cycle — a significant capability expansion.
- **Plugin architecture migration** continues strong: third-party agent extraction (#8426), MCP extraction (#8469), local model management (#8499).
- **Local model management UI** in progress via a stacked 3-PR feature set (#8649 → #8647 → #8648) adding llama.cpp GPU, managed MLX engine, and auto-update controls.
- **QQ C2C streaming messages** (#8409) advancing.

---

## 4. Community Hot Topics

| Item | Type | Comments | Topic |
|---|---|---|---|
| [#8669](https://github.com/agentscope-ai/QwenPaw/issues/8669) | Issue | 5 | Feishu channel deterministic startup failure (`CHANNEL_NOT_CONNECTED`) |
| [#8538](https://github.com/agentscope-ai/QwenPaw/issues/8538) | Issue | 4 | Matrix channel fails with multiple workspaces (10s shared startup window) |
| [#8616](https://github.com/agentscope-ai/QwenPaw/issues/8616) | Issue | 3 | 2.3.0-beta.1 fails to start on Windows 11 IoT LTSC (AppHang) |

### Underlying Needs Analysis
The most active discussions all center on **channel plugin reliability during the plugin-extraction migration**. Users are experiencing that the official plugin conversion (Matrix, Feishu, WeChat) introduced **timing, environment, and path-handling regressions** that did not exist in the prior built-in implementations. The common thread:

1. **Startup race conditions** — the plugin bootstrap assumes a connected state too early (#8669), or shares an insufficient startup window across workspaces (#8538).
2. **Environment propagation failures** — plugin workers on Linux don't receive `HOME` / `QWENPAW_WORKING_DIR` (#8682).
3. **Platform-specific native library issues** — Windows path handling breaks PyCryptodome imports (#8675, now fixed).

This signals that the **plugin host↔worker contract needs hardening** (env vars, health-check timing, state initialization) before plugin migration can be considered production-stable.

---

## 5. Bugs & Stability

Ranked by severity (crash/blocker → degraded):

| Severity | Issue | Status | Description | Fix PR? |
|---|---|---|---|---|
| 🔴 **Critical** | [#8669](https://github.com/agentscope-ai/QwenPaw/issues/8669) | OPEN | Feishu channel fails on **every** start in packaged Windows desktop — `_wait_connected` treats initial `platform_state="disconnected"` as fatal | Partial — [#8675](https://github.com/agentscope-ai/QwenPaw/pull/8675) closed (native lib fix), but race logic itself may persist |
| 🔴 **Critical** | [#8682](https://github.com/agentscope-ai/QwenPaw/issues/8682) | OPEN | Official channel plugin workers **crash on Linux** — missing `HOME`/`QWENPAW_WORKING_DIR` → `RuntimeError: Could not determine home directory` | ❌ None yet |
| 🟠 **High** | [#8616](https://github.com/agentscope-ai/QwenPaw/issues/8616) | OPEN | 2.3.0-beta.1 won't start on **Windows 11 IoT LTSC** — "path not found" → AppHang; 2.2.2 works on same machine | ❌ None yet |
| 🟠 **High** | [#8538](https://github.com/agentscope-ai/QwenPaw/issues/8538) | OPEN | Matrix channel fails to activate when **multiple workspaces** enable it — 10s startup window only covers the first | ❌ None yet |
| 🟡 **Medium** | [#8674](https://github.com/agentscope-ai/QwenPaw/issues/8674) | OPEN | Query errors repeatedly write **full session JSON snapshots** to temp dir — no size/count/age/rate limit → hundreds of MB growth | ✅ [#8678](https://github.com/agentscope-ai/QwenPaw/pull/8678) OPEN (bounds dumps + retention) |

**Assessment:** Three of five open bugs are **channel-plugin regressions introduced by the 2.3.0 plugin migration** — a systemic risk area. The Linux environment-propagation bug (#8682) and the Windows LTSC startup hang (#8616) both lack fix PRs and are release-blocking for affected platform users.

---

## 6. Feature Requests & Roadmap Signals

Based on open PRs and their scope, the following are likely candidates for the next release (v2.3.x or v2.4):

| Feature | PR | Likelihood | Rationale |
|---|---|---|---|
| **Local model management as plugin** | [#8499](https://github.com/agentscope-ai/QwenPaw/pull/8499) | High | Aligns with plugin-extraction theme; XXXL and under active review |
| **MCP extraction into plugin** | [#8469](https://github.com/agentscope-ai/QwenPaw/pull/8469) | High | Core architectural refactor, XXXL |
| **Third-party agent extraction** | [#8426](https://github.com/agentscope-ai/QwenPaw/pull/8426) | High | Same migration theme, XXXL |
| **Console local engine + GPU + auto-update** | [#8647](https://github.com/agentscope-ai/QwenPaw/pull/8647), [#8648](https://github.com/agentscope-ai/QwenPaw/pull/8648), [#8649](https://github.com/agentscope-ai/QwenPaw/pull/8649) | Medium-High | Stacked 3-PR feature; managed MLX + llama.cpp GPU |
| **QQ C2C streaming messages** | [#8409](https://github.com/agentscope-ai/QwenPaw/pull/8409) | Medium | Channel-parity feature, under review |
| **Ollama context-window sizing** | [#8236](https://github.com/agentscope-ai/QwenPaw/pull/8236) | Medium | Correctness fix for local inference |
| **Community password login via deployment access controls** | [#8679](https://github.com/agentscope-ai/QwenPaw/pull/8679) | Medium | Auth/UX improvement |

**Prediction:** The dominant roadmap signal is **continued plugin-ization of core subsystems** (MCP, local models, agents). A follow-up **v2.3.1 patch release** is likely to address the channel-plugin regressions before the plugin migration is fully stabilized.

---

## 7. User Feedback Summary

### Pain Points
- **Channel instability post-plugin-migration** is the #1 frustration. Users report channels that "worked before" now fail deterministically on startup (#8669, #8538, #8682).
- **Platform-specific breakage**: Windows 11 IoT LTSC users face a hard startup failure with no workaround (#8616); Linux users hit environment-variable propagation failures (#8682).
- **Disk/resource hygiene**: A power user (#8674) traced unbounded `qwenpaw_query_error_*.json` temp-dump growth — a silent resource leak affecting long-running/deployed instances.
- **Windows Feishu native library loading** (#8675) was a concrete, diagnosable bug now fixed — demonstrating maintainers respond to detailed platform reports.

### Use Cases Observed
- Multi-workspace deployments (Matrix, #8538).
- Packaged Windows desktop builds (#8669, #8616).
- Third-party integration deployments (WorkMate, #8674).
- Enterprise messaging channels: Feishu, WeChat, Matrix, DingTalk, QQ.

### Satisfaction / Dissatisfaction
- **Satisfaction signals**: Fast turnaround on well-diagnosed bugs (#8675 closed same day as report; #8678 fix PR filed same day as #8674). Roadmap investment in local models and plugin extensibility shows ambition.
- **Dissatisfaction signals**: The plugin migration is perceived as **regressing previously-working channels**, and two critical platform bugs (#8616, #8682) remain unaddressed with no fix PR. Users on non-mainstream OS builds (Windows LTSC) feel deprioritized.

---

## 8. Backlog Watch

Important items with **no fix PR and limited maintainer response**:

| Item | Age | Why It Needs Attention |
|---|---|---|
| [#8616](https://github.com/agentscope-ai/QwenPaw/issues/8616) — Win 11 IoT LTSC startup hang | 5 days | **No fix PR**, blocker for all LTSC users, regression vs 2.2.2. Needs triage and root-cause label. |
| [#8682](https://github.com/agentscope-ai/QwenPaw/issues/8682) — Linux plugin worker missing env vars | 1 day | **No fix PR**; affects all Linux channel-plugin users. High-priority infra fix. |
| [#8538](https://github.com/agentscope-ai/QwenPaw/issues/8538) — Matrix multi-workspace activation | 10 days | **No fix PR**; architectural timing issue in shared startup window. Likely tied to #8669 root cause — should be addressed holistically. |

### Long-Review PRs (flagged "Under Review", high scope)
- [#8236](https://github.com/agentscope-ai/QwenPaw/pull/8236) — Ollama `num_ctx` (Under Review since Oct 14).
- [#8409](https://github.com/agentscope-ai/QwenPaw/pull/8409) — QQ streaming (Under Review since Oct 24).
- [#8601](https://github.com/agentscope-ai/QwenPaw/pull/8601) — DingTalk Markdown tables (Under Review since Nov 6).

**Recommendation for maintainers:** Prioritize a **plugin-host hardening effort** (env-var propagation, health-check/state-initialization timing) as a single coordinated fix, and triage #8616 for a possible patch release, since it is an outright startup regression on a supported OS.

---

*Digest generated from GitHub activity data for 2026-11-12. All links reference github.com/agentscope-ai/QwenPaw.*

</details>

<details>
<summary><strong>ZeroClaw</strong> — <a href="https://github.com/zeroclaw-labs/zeroclaw">zeroclaw-labs/zeroclaw</a></summary>

# ZeroClaw Project Digest — 2026-11-12

## 1. Today's Overview

ZeroClaw is in an active release-and-stabilization phase, having shipped **v0.9.0** — its first release with multi-user sign-in via OpenID Connect, scoped non-admin chat, and 117 commits from 22 contributors. Issue activity is moderate (8 updated, all still open, none closed), while PR activity is high (49 updated, 45 open, 4 merged/closed), indicating a large review queue relative to merge throughput. Notably, the issue list is dominated by **stability and correctness reports** against the 0.8.x line (trace gaps, dead config knobs, swallowed stderr, context loss on interrupt), suggesting production users are stress-testing the daemon hard. Overall health is solid — active contributor base, security patches landing promptly — but the open-PR backlog (45 items, many `size:XL` and `risk:high`) is a growing maintenance liability.

---

## 2. Releases

### v0.9.0 — "Sign-in for everyone" release
- **Scope:** 117 commits, 22 contributors — the largest contributor spread to date.
- **Headline features:**
  - Dashboard sign-in through **your own OpenID Connect provider** — first release where non-operators can authenticate.
  - Non-admin accounts receive their **own scoped chat** (tenant isolation at the account level).
- **Release hygiene observed:** translation catalogues pinned to v0.9.0 (PR #12380, closed), and the release candidate branch was `1a79f89d1e`.
- **Breaking changes / migration notes:** Not enumerated in the provided data; the config-schema cleanup trend (see Issue #12396) suggests users on 0.8.x should review `history_pruning` settings, but no explicit breaking-change callout is present in this window.
- **Assessment:** v0.9.0 is a meaningful step toward multi-tenant/self-hosted deployments, directly relevant to the home-lab and low-resource audience visible in feature requests.

---

## 3. Project Progress

**Merged/closed PRs today (4):**
- **#12380** — `chore(docs): pin translations to v0.9.0` — release documentation finalized.
- **#12392** — `fix(deps): bump rustix to 1.1.6 for RUSTSEC-2026-0486` — **security patch** for xattr read vulnerability (GHSA-jh2m-fhpj-3vr7); good sign that advisories are triaged within ~1 day.
- **#12215** — `chore(deps): bump the rust-all group (36 updates)` — superseded by #12393 (35 updates), routine dependency rotation.
- Fourth closed item not detailed in the data window.

**Advanced but still open:**
- **#11994 / #12395** — Shell grammar security work: reading POSIX commands in bash's grammar, with the holding-crate approval row being corrected before recording sign-off. Depends on #12395.
- **#12074** — ZeroCode context-budget bar now refreshes after history trims (UX correctness fix awaiting merge).
- **#12389 / #12388** — Hardening PRs: ANSI/control-character sanitization in memory CLI output, and Discord reaction-URL validation/percent-encoding — both small, security-adjacent, and mergeable.

**Assessment:** Throughput is modest (4 closed) against 45 open PRs; several high-value security/UX fixes are queued but not yet landed.

---

## 4. Community Hot Topics

Ranked by comment activity in the last 24h:

1. **Issue #7461 — CI matrix for Windows/macOS** (6 comments, open since June)
   https://github.com/zeroclaw-labs/zeroclaw/issues/7461
   *Need:* Cross-platform CI parity — Lint/Build already run a 3-OS matrix, but tests don't. The long tail (5 months) signals an under-resourced but persistent platform-reliability concern.

2. **Issue #8794 — Stopping agent mid-work erases tool calls/thinking from context** (5 comments, updated today)
   https://github.com/zeroclaw-labs/zeroclaw/issues/8794
   *Need:* Correctness of agent memory under user interruption — S1 severity, `risk:high`, web dashboard UI. This is a trust-eroding bug for interactive users.

3. **Issue #9814 — Native XMPP/Prosody channel** (4 comments, open since August)
   https://github.com/zeroclaw-labs/zeroclaw/issues/9814
   *Need:* Lightweight self-hosted chat transport for home-lab deployments; tagged `status:parking-lot`, but a **matching implementation PR #11847** (native Rust XMPP with optional OMEMO) exists — the demand and supply are both present.

4. **Issue #12397 — Distinguish agent task outcome from cron execution status** (1 comment, opened today)
   https://github.com/zeroclaw-labs/zeroclaw/issues/12397
   *Need:* Cron jobs report `Ok` even when the agent concludes `BLOCKED` — observability/semantics gap in automation.

5. **PR #11869 — Task-owned SSH transport reuse** (XL, open since Oct 19, active today)
   https://github.com/zeroclaw-labs/zeroclaw/pull/11869
   *Need:* Connection pooling/lifecycle for long agentic tasks using shell over SSH.

**Analysis:** The community is split between *interactive reliability* (interruption context, context budget display), *automation semantics* (cron outcomes, trace integrity), and *deployment breadth* (XMPP, Windows/macOS CI). The XMPP pairing (issue + PR) is the clearest signal of an unmet deployment niche.

---

## 5. Bugs & Stability

Ranked by severity:

| Severity | Item | Status | Fix PR? |
|---|---|---|---|
| **S1** | **#8794** — Stopping agent mid-work erases tool calls and thinking from context (web dashboard UI, runtime/daemon) — workflow blocked | Accepted, 5 comments, updated today | No linked fix PR in window |
| **S2** | **#12391** — `runtime-trace.jsonl` loses hours of events across daemon restarts (handoff buffer / queue drops / silent writer); reproduced on Windows service 0.8.7 | Open, opened 2026-11-11 | No |
| **S2 (correctness)** | **#12390** — `shell` tool returns empty `"error":""` on non-zero exit; stderr swallowed, model can't diagnose failures | Open, opened 2026-11-11 | No |
| **Config debt** | **#12396** — `history_pruning.keep_recent` and `collapse_tool_results` are dead knobs with no readers since #8196 (silent no-ops) | Open | No |

**Notes:**
- All four were filed or updated within the last 48h, mostly against **0.8.7** — i.e., production users on the previous stable line while 0.9.0 lands.
- #12391 and #12396 come from the same reporter (RO-mix), indicating a single production deployment surfacing multiple observability/config-integrity issues — worth a maintainer conversation.
- **No fix PRs exist for any of today's bugs**, which is the most actionable stability gap in this digest.

---

## 6. Feature Requests & Roadmap Signals

**Requested today / recently:**
- **#12397** — Separate agent task outcome from cron execution status (new today; small-to-medium scope, high observability value).
- **#12394** — Bound SOP step agent's tool ceiling to its actual registry + pin deferred-MCP seal input (follow-up hardening, likely near-term).
- **#9814** — Native XMPP/Prosody channel (**PR #11847 already open** — highest-probability landing feature).
- **#7461** — Windows/macOS test CI (accepted, `in-progress`, but stalled since June).

**Roadmap prediction for next release (v0.9.x / v0.10):**
1. **XMPP channel** via PR #11847 — issue + implementation both active.
2. **Cron outcome semantics** (#12397) — cheap, user-visible correctness win.
3. **Shell/SSH hardening** — PR #11869 (transport reuse) + #11994 (bash grammar security) form a coherent cluster.
4. **Multi-model provider profiles** (PR #9809, open since August, XL) — a long-running architectural item that would reshape provider config.
5. **SOP/delegate sealing** (#12394, PR #10391) — security-boundary work with Core Team attention.

---

## 7. User Feedback Summary

**Pain points (dissatisfaction):**
- *"The agent only learns that 'something failed' and cannot tell why."* — #12390 (swallowed stderr). A direct hit on agent debuggability.
- *"The whole step never happened."* — #8794, on interruption erasing context. Trust-eroding for interactive sessions.
- *"Multi-hour coverage gaps… even though agent work provably continued."* — #12391, trace integrity on production daemons.
- *"`Ok` in the dashboard even when the agent explicitly concludes `BLOCKED`."* — #12397, misleading automation status.

**Use cases visible in the data:**
- Home-lab / low-resource self-hosting (XMPP/Prosody request, Windows service deployment).
- Chrome DevTools MCP automation via cron (reproduction in #12397).
- Multi-worktree ZeroCode workflows hitting the 8-session cap (PR #11731).
- Multi-user self-hosted deployments (the entire v0.9.0 rationale).

**Satisfaction signals:**
- Rapid security response (#12392 filed and merged same-day for RUSTSEC-2026-0486).
- Contributor breadth in v0.9.0 (22 contributors) — healthy community.
- Users are running ZeroClaw in *production* and filing precise, evidence-backed reports (grep proofs, revision hashes, reproduction steps) — a sign of an engaged, sophisticated user base rather than churn.

**Net:** High engagement, but a consistent theme of **"the agent hides why things failed"** across shell, cron, and trace subsystems — a coherent reliability narrative the maintainers should treat as a single workstream.

---

## 8. Backlog Watch

Items needing maintainer attention:

1. **Issue #7461 — CI Windows/macOS test matrix** (open since **2026-06-10**, ~5 months, 6 comments, `status:in-progress`)
   https://github.com/zeroclaw-labs/zeroclaw/issues/7461
   Accepted and in-progress but visibly stalled — platform regressions will keep slipping through until this lands.

2. **PR #9809 — Multiple models per provider profile** (open since **2026-08-07**, XL, schema-v4 redesign, 40+ labels)
   https://github.com/zeroclaw-labs/zeroclaw/pull/9809
   A large architectural change with no merge in sight; risk of bit-rot against `master`.

3. **PR #10391 — Bounded delegate workspace/tool-ceiling/command-policy fix (#9872)** (open since **2026-08-26**, XL, `risk:high`)
   https://github.com/zeroclaw-labs/zeroclaw/pull/10391
   Security-boundary correctness for delegates; long review cycle with repeated `master` merges — needs reviewer bandwidth.

4. **Issue #9814 + PR #11847 — Native XMPP** (issue since Aug, PR since Oct 19, `needs-maintainer-review`, `risk:high`)
   https://github.com/zeroclaw-labs/zeroclaw/issues/9814 · https://github.com/zeroclaw-labs/zeroclaw/pull/11847
   Demand and implementation both exist; blocked on review. A decision (merge, split, or park explicitly) would help contributors.

5. **PR #11589 — Operator override for exceeded cost limit** (open since Oct 7, `needs-author-action`)
   https://github.com/zeroclaw-labs/zeroclaw/pull/11589
   Currently the only escape from an exceeded cost limit is a daemon restart — an operational sharp edge.

6. **Bulk of the 45 open PRs carry `needs-author-action` or `needs-maintainer-review`** — a systematic review-capacity bottleneck rather than isolated neglect.

---

### Health Verdict
**Positive:** Active contributor base, fast security patching, a substantive v0.9.0 with multi-user auth, and a sophisticated user community filing high-quality reports.
**Watch:** 45 open PRs vs. 4 closed in 24h; zero fix PRs for today's four bugs (two S1/S2); and several XL/high-risk PRs aging past the two-month mark. The project's main risk is **review throughput**, not direction.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*