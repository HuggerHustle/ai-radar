# OpenClaw Ecosystem Digest 2026-10-26

> Issues: 356 | PRs: 500 | Projects covered: 5 | Generated: 2026-10-25 23:09 UTC

- [OpenClaw](https://github.com/openclaw/openclaw)
- [Hermes Agent](https://github.com/nousresearch/hermes-agent)
- [IronClaw](https://github.com/nearai/ironclaw)
- [QwenPaw](https://github.com/agentscope-ai/QwenPaw)
- [ZeroClaw](https://github.com/zeroclaw-labs/zeroclaw)

---

## OpenClaw Deep Dive

# OpenClaw Project Digest — 2026-10-26

## 1. Today's Overview

OpenClaw shows extremely high activity, with 356 issues updated (283 open/active, 73 closed) and 500 PRs updated (234 open, 266 merged/closed) in the last 24 hours — a sign of a large, actively maintained project with significant contributor throughput. However, the project is under notable stability pressure: a cluster of P0/P1 bugs around SQLite WAL checkpointing, plugin source-capture staging, memory pressure, and startup regressions on Windows remain open, several with high comment counts (54–136). The current work skews heavily toward performance micro-optimizations (many small "perf(...)" PRs from a core maintainer) and test-suite cleanup, while critical architectural bugs around session-state integrity, crash recovery, and WAL growth await fixes. No new releases shipped today.

## 2. Releases

No new releases were published today.

## 3. Project Progress

266 PRs were merged/closed in the last 24h, but the visible top-comment PRs today are dominated by small performance and refactor work rather than major features:

- **Performance micro-optimizations** (many from `steipete`): worker transcript batch reuse (#183940), participant admission work reduction (#183918), skipping redundant route/choice validation (#183938), usage aggregate array copying (#183939), cron history maintenance reuse (#183937), gateway handler array copies (#183934), GitHub connection reply reuse (#183936), trusted-policy matcher reuse (#183923), Codex event projection (#183917).
- **Test-suite cleanup** ("remove low-value tests" batches d569/d570): PRs #183896, #183903, #183905 — explicitly test-only with no production behavior change.
- **Notable fixes in flight:** MCP Apps timeout fix for Safari/macOS WebKit (#182485), voice-call FIFO brief-file rejection (#183417), Google Meet speaker routing when `setSinkId` rejects (#183924), TUI monotonic clock for startup/history retries (#183635), WhatsApp QR login monotonic deadline (#183394), model setup authority loss after start reply (#183777).

In-progress features: **Skill Workshop propose mode** for reviewing background learning as drafts (#181747) is a substantial XL feature advancing through review.

## 4. Community Hot Topics

The most-discussed items reveal concentrated pain around database/WAL integrity, plugin loading, and upgrade reliability:

- **[#143524](https://github.com/openclaw/openclaw/issues/143524) — 136 comments (P0):** SQLite WAL grows to 1.4–2.8 GB despite `wal_autocheckpoint=1000`, blocks gateway startup on Windows. Long-running open bug with no new fix PR.
- **[#160959](https://github.com/openclaw/openclaw/issues/160959) — 54 comments (P0):** Gateway blocks for minutes capturing large external plugins (2026.9.6 regression).
- **[#164294](https://github.com/openclaw/openclaw/issues/164294) — 33 comments (P2):** State DB WAL auto-checkpoint never completes, pinned by in-process reader.
- **[#168955](https://github.com/openclaw/openclaw/issues/168955) — 19 comments (P1):** Startup regression, ready ~1030s vs ~410s on Windows; `sidecars.control-ui-assets` blocks 477s.
- **[#159596](https://github.com/openclaw/openclaw/issues/159596) — 16 comments, 3 👍 (P0):** Gateway memory sawtooth, prepared-model-catalog worker grows to full heap ceiling (~200 critical memory-pressure events/day).

**Underlying needs:** Multiple independent reports point to the same root causes — WAL checkpoint logic failing under concurrent readers, plugin capture staging exploding on large npm trees, and memory not being released from idle worker isolates. Users are asking for containment/diagnostics rather than just fixes (e.g., [#127195](https://github.com/openclaw/openclaw/issues/127195) requests reason codes so causes are knowable from production logs).

## 5. Bugs & Stability

Ranked by severity (fix PR status noted):

| Severity | Issue | Summary | Fix PR? |
|---|---|---|---|
| **P0** | [#143524](https://github.com/openclaw/openclaw/issues/143524) | Agent SQLite WAL grows unbounded (2.8 GB), blocks gateway startup | No new fix PR |
| **P0** | [#160959](https://github.com/openclaw/openclaw/issues/160959) | Gateway event-loop blocks minutes capturing large plugins | No |
| **P0** | [#159596](https://github.com/openclaw/openclaw/issues/159596) | Memory sawtooth, ~200 critical pressure events/day | No |
| **P0** | [#153426](https://github.com/openclaw/openclaw/issues/153426) | Curated memory (`MEMORY.md`/`USER.md`) silently, permanently excluded from bootstrap without diagnostics or recovery | No |
| **P0** | [#166634](https://github.com/openclaw/openclaw/issues/166634) | Checkpoint failure leaves agent permanently unavailable after crash recovery | No |
| **P1** | [#168955](https://github.com/openclaw/openclaw/issues/168955) | Startup regression on Windows (~1030s to ready) | No |
| **P1** | [#182476](https://github.com/openclaw/openclaw/issues/182476) | Windows `update repair` fails with `OPENCLAW_STATE_LEASE_LOST` | No |
| **P1** | [#126950](https://github.com/openclaw/openclaw/issues/126950) | Telegram opaque callback payloads silently dropped | Linked PR open |
| **P1** | [#183786](https://github.com/openclaw/openclaw/issues/183786) | Windows beta upgrade repeatedly queries stopped Gateway PID | No |
| **P1** | [#181078](https://github.com/openclaw/openclaw/issues/181078) | 2026.10.5: agent turns fail after model reply ("canonical session reader continuation no longer current") | No |
| **P1** | [#167876](https://github.com/openclaw/openclaw/issues/167876) | Talk consultations lose caller authority after setup | No |
| **P1** | [#167270](https://github.com/openclaw/openclaw/issues/167270) | Feishu cross-session send attaches internal reply anchor, first send fails 400 | Linked PR open |

**Key stability themes:** WAL/SQLite lifecycle management, Windows-specific startup/upgrade fragility, session-state authority loss on recovery, and memory lifecycle leaks. Several regression bugs are tied to specific releases (2026.9.6, 2026.10.1, 2026.10.5).

## 6. Feature Requests & Roadmap Signals

Active feature requests (some long-running) suggest near-term roadmap candidates:

- **Opt-in idle worker memory release** ([#159858](https://github.com/openclaw/openclaw/issues/159858)) — directly responds to the P0 memory pressure trend; likely to gain traction.
- **Per-agent dreaming configuration** ([#67413](https://github.com/openclaw/openclaw/issues/67413)) — replies to memory spikes from simultaneous workspace dreaming.
- **Configurable memory recall eligibility / index exclusion** ([#101422](https://github.com/openclaw/openclaw/issues/101422)).
- **`session.abortTriggers`** configurable plain-text abort phrases ([#164870](https://github.com/openclaw/openclaw/issues/164870)).
- **`--prompt-file` for `openclaw infer model run`** ([#140244](https://github.com/openclaw/openclaw/issues/140244)).
- **Cron job end conditions** (`--until` / `--max-runs`) ([#130247](https://github.com/openclaw/openclaw/issues/130247)).
- **Provider-aware concurrency/backpressure for subagents** ([#126727](https://github.com/openclaw/openclaw/issues/126727)).
- **Personal identity in iOS/macOS while preserving Shared owner** ([#162164](https://github.com/openclaw/openclaw/issues/162164)).

**Prediction:** Config options that let operators *contain* resource problems (idle worker release, memory-recall scoping, backpressure) are the strongest near-term candidates, as they align with the observed P0 resource-exhaustion class of bugs. Skill Workshop propose mode (#181747) is furthest along in implementation.

## 7. User Feedback Summary

**Satisfaction:** High engagement — hundreds of issues/PRs updated daily with detailed, well-structured bug reports (repro steps, environments, logs). Users clearly value OpenClaw enough to file thorough diagnostics and follow up over weeks.

**Dissatisfaction & pain points:**
- **Resource exhaustion is the dominant frustration:** WAL files ballooning to GBs, memory sawtooth with daily OOM pressure, unbounded worker heap. Users on small/self-hosted hosts feel the product doesn't reclaim resources without restarts.
- **Windows reliability:** Upgrades, repairs, and startup are repeatedly reported as slow or failing, frustrating a meaningful user segment.
- **Silent failures:** Multiple reports of functionality stopping with no log signal at normal levels (e.g., [#138561](https://github.com/openclaw/openclaw/issues/138561) active-memory stops with no info-level signal; [#53408](https://github.com/openclaw/openclaw/issues/53408) tools silently drop parameters).
- **Diagnosability:** Requests for machine-readable reason codes ([#127195](https://github.com/openclaw/openclaw/issues/127195), [#165685](https://github.com/openclaw/openclaw/issues/165685)) reflect a desire not just for fixes but for observability so users can self-diagnose.
- **UI inconsistencies:** Session count mismatches ([#165391](https://github.com/openclaw/openclaw/issues/165391)), duplicate rendering ([#149912](https://github.com/openclaw/openclaw/issues/149912)), and overlapping window controls on Linux ([#162448](https://github.com/openclaw/openclaw/issues/162448)).

## 8. Backlog Watch

Long-open items with high importance needing maintainer attention:

- **[#143524](https://github.com/openclaw/openclaw/issues/143524)** (created 2026-09-09, P0) — WAL unbounded growth; 136 comments, no new fix PR. Highest-impact open bug.
- **[#53408](https://github.com/openclaw/openclaw/issues/53408)** (created 2026-03-24) — Write/exec tool parameters silently dropped after long conversations; recurring since March, still open.
- **[#51245](https://github.com/openclaw/openclaw/issues/51245)** (created 2026-03-20, tags incl. security) — Telegram slash sessions resolve to `channel=(unknown)`, breaking elevated `allowFrom`; security-relevant, open for 7 months.
- **[#55372](https://github.com/openclaw/openclaw/issues/55372)** (created 2026-03-26) — Config option to disable restart sentinel notification; simple asks lingering since March.
- **[#67413](https://github.com/openclaw/openclaw/issues/67413)** (created 2026-04-15, 5 👍) — Per-agent dreaming config; needs product decision.
- **[#89257](https://github.com/openclaw/openclaw/issues/89257)** (P1, created 2026-06-01) — `backup create --verify` exits 13, leaves corrupt archive; impact:data-loss, still unresolved.
- **[#153426](https://github.com/openclaw/openclaw/issues/153426)** (P0, created 2026-09-20) — Memory roots permanently dropped from bootstrap with no recovery; security-review flagged, 10 comments.

**Project health assessment:** OpenClaw exhibits the classic profile of a fast-growing, heavily-used project: enormous activity and a devoted contributor base, but a growing backlog of resource-management and state-integrity bugs that outpace fixes. The high volume of small performance PRs suggests core maintainers are trying to address the resource-exhaustion class at the micro level, while the P0 WAL/memory/crash-recovery issues still lack fix PRs and deserve prioritized attention to protect reliability, especially on Windows and small hosts.

---

## Cross-Ecosystem Comparison

# Cross-Project Comparison Report: AI Agent / Personal AI Assistant Open-Source Ecosystem
**Date: 2026-10-26** | Projects: OpenClaw, Hermes Agent, IronClaw, QwenPaw, ZeroClaw

---

## 1. Ecosystem Overview

The personal AI assistant / agent open-source landscape in late 2026 is bifurcated between **high-throughput reference platforms** and **focused, stabilization-stage runtimes**. OpenClaw and Hermes Agent dominate activity volume (hundreds of daily issue/PR updates each), functioning as de-facto community anchors, while QwenPaw and ZeroClaw iterate in narrower but well-defined lanes (tool correctness, channels, memory maturity), and IronClaw sits in a near-dormant automated-maintenance phase. A clear industry pattern has emerged: every active project is now paying down **resource-exhaustion debt** (SQLite WAL growth, worker memory sawtooth, subprocess lifecycle) accumulated during rapid feature expansion. Simultaneously, **security and identity boundaries** (`.env` scope, RPC access scoping, audit logging) and **platform-native fragility** (Windows job objects, Linux Wayland/opacity, macOS WebKit) are recurring cross-project themes. The ecosystem is maturing from "feature race" to "reliability and observability race," with merge throughput — not contribution interest — becoming the binding constraint.

---

## 2. Activity Comparison

| Project | Issues (24h) | PRs (24h) | Merge/Close Rate | Release Status | Health Score* | Activity Tier |
|---|---|---|---|---|---|---|
| **OpenClaw** | 356 updated (283 open / 73 closed) | 500 updated (234 open / 266 merged) | ~53% (PR) | No release today | ⚠️ 6.5/10 | Tier 1 (Hyperactive) |
| **Hermes Agent** | 50 updated (49 open / 1 closed) | 50 updated (47 open / 3 merged) | ~6% (PR), ~2% (issue) | No release today (v0.22.x in flight) | ⚠️ 6.0/10 | Tier 1 (High intake, low closure) |
| **ZeroClaw** | 6 updated (5 open / 1 closed) | 50 updated (49 open / 1 merged) | ~2% (PR) | No release (v0.9.0 staging) | ⚠️ 6.0/10 | Tier 2 (PR-congested) |
| **QwenPaw** | 6 updated (5 open / 1 closed) | 6 updated (all open) | 0% merge (1 issue closed) | No release today | ✅ 7.5/10 | Tier 3 (Focused, responsive) |
| **IronClaw** | 0 updated | 7 updated (5 open / 2 closed) | ~29% (PR) | No release today | 🟡 5.5/10 | Tier 4 (Automated maintenance) |

*Health Score is a composite of: activity volume, fix-PR coverage for P0/P1 bugs, merge throughput, and community engagement depth. Scores are relative within this cohort.

**Key observations:**
- **OpenClaw** has the highest absolute throughput but also the highest concentration of unresolved P0 bugs (WAL, memory, crash recovery) with **no linked fix PRs**.
- **Hermes Agent** and **ZeroClaw** exhibit the classic "contribution glut / review famine" signature: large open PR queues, single-digit merge rates, and many fixes blocked on `needs-maintainer-review` or `needs-author-action`.
- **QwenPaw** has the **best fix-to-bug parity ratio** — nearly every reported bug has a same-day fix PR or closure, indicating efficient triage despite low absolute volume.
- **IronClaw** shows zero human-authored activity; the project is on autopilot for dependency maintenance, with a **9-week-stalled WASM upgrade** (#7834) as its only risk signal.

---

## 3. OpenClaw's Position

**Advantages vs. peers:**
- **Ecosystem anchor status.** With 356 issues and 500 PRs touched in a single day, OpenClaw processes more community surface area in 24h than QwenPaw or IronClaw see in a month. This creates network effects: more integrations, more provider support, more third-party tooling.
- **Breadth of maintained surfaces.** OpenClaw is the only project in this cohort with parallel, mature workstreams across MCP Apps, voice calls (FIFO, speaker routing), TUI, WhatsApp/Telegram/Feishu channels, model setup, cron, and a substantial Skill Workshop feature (#181747) — effectively a superset of peers' scope.
- **Dedicated maintainer throughput.** A core maintainer (`steipete`) is landing dozens of micro-optimizations per day, an intensity no peer matches.

**Technical approach differences:**
- OpenClaw leans on a **SQLite + WAL state model** with in-process readers; this is the root of its P0 stability issues (#143524, #164294) but also gives it a strongly consistent local persistence model that peers like Hermes (state.db, 5.4 GB observed at scale) and ZeroClaw (markdown-backed memory) do not uniformly match.
- OpenClaw's **plugin source-capture staging** (#160959) is a first-class architectural concern — no peer exposes comparable pluggable runtime extension depth at this scale.
- OpenClaw is optimizing **micro-level** (array copies, matcher reuse, cron history maintenance) — a sign it is fighting resource exhaustion at the leaf rather than rearchitecting.

**Community size comparison:**
- OpenClaw ≈ **10×** the daily issue/PR throughput of Hermes Agent and ZeroClaw.
- Community depth is visible in report quality: multi-paragraph repro steps, environment matrices, week-long follow-ups. Peers show similar quality but at 1/5 to 1/10 the volume.
- OpenClaw's **136-comment P0 issue (#143524)** dwarfs any single thread in peer repos (Hermes' top thread is 19 comments; ZeroClaw's is 14).

**Positioning verdict:** OpenClaw is the **Linux-kernel-equivalent** of this cohort — highest adoption, highest contribution, highest maintenance debt. Its risk is that micro-optimizations mask architectural P0s; its strength is that no peer can currently substitute for its surface area.

---

## 4. Shared Technical Focus Areas

The following requirements are emerging **independently** across multiple projects — strong signal that these are ecosystem-level, not project-specific:

| Cross-Project Need | OpenClaw | Hermes | ZeroClaw | QwenPaw | IronClaw |
|---|---|---|---|---|---|
| **Resource exhaustion / memory lifecycle** | P0 WAL growth (#143524), sawtooth (#159596), idle worker release request (#159858) | Scale pressure (#143833: 5.4 GB state.db) | Memory backend correctness (#11209) | — | — |
| **Security / identity boundaries** | Security-tagged Telegram session resolution (#51245, 7mo old) | `.env` scope repointing (#135200, #144685) | RPC log access scoping (#11326, `release-gate`) | Governance audit gaps (#8412) | — |
| **Silent failure / observability** | Reason-code requests (#127195, #165685); memory stops w/o signal (#138561) | Silent no-op steering (#141973); silent prompt deletion (#144702) | Config validated-but-never-consumed (#12035); unknown backends fall back silently (#11209) | Audit logging stops silently (#8412) | — |
| **Platform-native stability (Windows/Linux)** | Windows startup ~1030s, `update repair` failures (#168955, #182476, #183786) | Windows gateway wedge (#130889), WinError 5 (#68128), Linux SIGTRAP (#121954), 6% opacity (#143426) | — | — | — |
| **Memory quality (curation, ranking, control)** | Curated memory exclusions (#153426, P0); recall eligibility (#101422) | — | Persistent memory parity (#8891), external rerank (#12022) | — | — |
| **Session state integrity on recovery** | P0 checkpoint failure → permanent unavailability (#166634); canonical session reader (#181078) | Handoff reopen (#143286); gateway switch deletes queued prompts (#144702) | — | Desktop approval retry loop (#8416, closed) | — |
| **Deterministic tool/scoping behavior** | Tools silently drop parameters (#53408, 7mo old) | — | SOP tool-name scoping mismatch (#11283) | Self-kill guard false positives (#8413); edit_file corruption (#8414/#8415) | — |

**The strongest cross-project consensus is on three items:**
1. **Silent failures are the dominant trust-eroder.** Four of five projects have active reports of functionality stopping without a log-level signal.
2. **Security/identity scope escapes need policy-level fixes**, not per-case patches (`.env` in Hermes, RPC scoping in ZeroClaw, Telegram `allowFrom` in OpenClaw).
3. **Platform-native paths (Windows especially) are systematically under-tested** — the same class of bug (job objects, breakaway flags, stale PIDs, non-ASCII paths) appears in both OpenClaw and Hermes independently.

---

## 5. Differentiation Analysis

| Dimension | OpenClaw | Hermes Agent | ZeroClaw | QwenPaw | IronClaw |
|---|---|---|---|---|---|
| **Primary focus** | Full-stack personal assistant (channels, voice, TUI, plugins, skills) | Desktop + Webapp + Conversational UX | Memory maturity, channel parity, runtime capability refactor | Tool-layer correctness, governance/audit | Rust-based sandboxed tool runtime |
| **Target user** | Power users, self-hosters, plugin authors | Desktop users, multi-platform operators, heavy-scale users | Enterprise/multi-channel operators preparing v0.9.0 | Automation engineers, governed/audited deployments | Developer tooling / sandboxed execution |
| **Architecture signature** | SQLite+WAL state, deep plugin staging, in-process workers | Client/server split (Webapp), ConfigBackend refactor pending (#134362) | Capability-taking constructors, plugin extraction, release-gate discipline | Channel-as-plugin (PR #8187), subprocess isolation | Rust + WASM (wasmtime), narrow surface |
| **Feature emphasis** | Breadth: voice, MCP, skills, cron, multi-channel | Webapp hardening, TTS (ElevenLabs), Desktop UX | Memory rerank, channel streaming/reactions/attachments | `/steer` command, DeepSeek Search, audit | Dependency hygiene only (no features shipping) |
| **Security posture** | Mature, but lingering 7-month security-tagged issue | Active boundary violations reported (#135200) | Strongest release-gate discipline (`priority:p1` + `release-gate` labels) | Governance-aware (audit.db), but silent gaps | Opaque (no reports) |
| **Technical risk profile** | High — P0 stability debt under micro-opt pressure | Medium — merge throughput starvation | Medium — security PRs age toward release | Low — fast triage, small surface | Low activity, but stalled WASM upgrade |

**Standout differentiators:**
- **OpenClaw** is the only project pursuing **depth across surfaces simultaneously**; its risk is spreading maintainer attention too thin.
- **Hermes Agent** is the only project with a **shipped client/server split** (Webapp, #141864) — its #38519 request (31 👍) for a frontend-only install reflects real architectural ambition.
- **ZeroClaw** is the only project with **explicit release-gate labels** on security PRs — the most disciplined release-engineering posture in the cohort, though currently the most congested.
- **QwenPaw** is the only project where **every P0-class bug has a same-day fix PR or closure** — the highest reliability-per-contribution ratio.
- **IronClaw** is architecturally distinct (Rust + WASM sandbox) but **currently inactive**; its stalled #7834 WASM upgrade is the only technical signal in the window.

---

## 6. Community Momentum & Maturity

**Activity tiers:**

| Tier | Projects | Characteristics |
|---|---|---|
| **Tier 1 — Hyperactive / Rapidly Iterating** | OpenClaw, Hermes Agent | 50–500 daily updates; feature shipping alongside P0 debt; contributor base > maintainer capacity |
| **Tier 2 — PR-Congested / Pre-Release Staging** | ZeroClaw | High contribution, low merge velocity; `release:v0.9.0` tag creates deferred-merge pressure |
| **Tier 3 — Focused & Responsive** | QwenPaw | Low volume, high closure quality; same-day fixes for medium-severity bugs |
| **Tier 4 — Automated Maintenance / Quiet** | IronClaw | Zero human activity; dependabot-only; potential under-engagement risk |

**Maturity assessment:**

- **Most mature operationally:** ZeroClaw (release-gate discipline, triage labels, security-first PR queue).
- **Most mature by surface area:** OpenClaw (breadth of integrations, contributor diversity).
- **Most mature by fix-parity:** QwenPaw (bug → fix PR latency).
- **Least mature operationally:** Hermes Agent (2% issue closure, 6% PR merge — intake vastly outpaces throughput).
- **Least engaged:** IronClaw (zero comments/reactions across all PRs; ambiguous signal — may be stable, may be neglected).

**Key momentum signal:** Both Tier 1 projects show the **"fast-growth exhaustion"** pattern — high contributor energy, but merge/close rate is the bottleneck. This is a structural warning: without triage bandwidth investment, community goodwill converts to frustration as contributors see their PRs age.

---

## 7. Trend Signals

**For AI agent developers and technical decision-makers, the following industry trends are extractable from this cohort:**

1. **Resource lifecycle management is now a first-class feature, not an afterthought.**
   - Evidence: OpenClaw's WAL/memory P0 cluster, Hermes' 5.4 GB state.db at scale, ZeroClaw's memory backend correctness PRs.
   - Implication: Build idle-worker release, WAL checkpointing, and state compaction in from v1; retrofitting is expensive.

2. **Silent failure is the #1 trust-eroder across the ecosystem.**
   - Evidence: OpenClaw (#138561, #127195), Hermes (#141973, #144702), ZeroClaw (#12035, #11209), QwenPaw (#8412).
   - Implication: **Machine-readable reason codes and info-level signals should be treated as product requirements**, not nice-to-haves. Users want to self-diagnose.

3. **Security/identity scope escapes are a systemic boundary problem.**
   - Evidence: Hermes' `.env` repointing (#135200, #144685), ZeroClaw's RPC log scoping (#11326), OpenClaw's Telegram `allowFrom` (#51245).
   - Implication: Agent identity and policy should be **immutable from within the workspace**; environment-variable-driven scope changes are a known footgun class.

4. **Windows-native paths remain systematically under-tested.**
   - Evidence: Independent Windows bugs in OpenClaw (startup, update repair, PID queries) and Hermes (job objects, WinError 5, gateway wedges).
   - Implication: Cross-platform agent SDKs need **CI coverage on Windows job objects and long-path handling** as a distinct test tier.

5. **Memory quality — curation, ranking, and operator control — is the emerging battleground.**
   - Evidence: ZeroClaw's parity tracker (#8891, 3.5 months old) and external rerank request (#12022); OpenClaw's curated memory exclusions (#153426, #101422).
   - Implication: Storing memory is solved; **making it relevant, reversible, and operator-tunable** is the next frontier. Expect `/v1/rerank`-style pluggability to become standard.

6. **Client/server decomposition is the next architectural milestone.**
   - Evidence: Hermes' Webapp (#141864) and frontend-only install demand (#38519, 31 👍); ZeroClaw's dashboard scoping (#11986).
   - Implication: Users increasingly want to run **the UI without the agent** (or vice versa). Monolithic installers will lose ground.

7. **Merge throughput — not contribution volume — is the ecosystem bottleneck.**
   - Evidence: Hermes 6% PR merge rate, ZeroClaw 2%, both with substantial `needs-maintainer-review` queues.
   - Implication: Projects that invest in **triage automation, triage rotation, or explicit WIP limits** will out-compete peers on contributor retention.

8. **Release-gate labeling and security-first PR discipline correlate with community confidence.**
   - Evidence: ZeroClaw is the only project with explicit `release-gate` + `priority:p1` labels, and its community remains engaged despite congestion.
   - Implication: Visible release criteria build trust even when merges are slow.

**Strategic takeaway for developers:** The agent open-source ecosystem has entered its **reliability phase**. Differentiation will shift from "which features exist" to "which platforms degrade gracefully, explain failures, and let operators contain resource use." Projects that solve observability and containment first will retain users as they move from experimentation to production deployment.

---

## Peer Project Reports

<details>
<summary><strong>Hermes Agent</strong> — <a href="https://github.com/nousresearch/hermes-agent">nousresearch/hermes-agent</a></summary>

# Hermes Agent — Project Digest
**Date: 2026-10-26** | Repo: [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent)

---

## 1. Today's Overview

Activity remains very high: **50 issues** and **50 PRs** were touched in the last 24h, with only **1 issue closed** and **3 PRs merged/closed** — a heavily lopsided intake-vs-throughput ratio (~3% closure on issues, ~6% on PRs). No new releases landed. The day's dominant theme is **Webapp follow-up hardening** (the browser-hosted Desktop merged via #141864 on 2026-10-25), producing a cluster of security/auth/session-isolation bug reports and their fix PRs. A second cluster concerns **Windows platform stability** (gateway wedges, schtasks parsing, WhatsApp bridge spawn) and **startup latency/perf work** from maintainer `teknium1`. Overall health: the project is shipping fast and self-auditing rigorously, but the open backlog is growing faster than it is being cleared — a triage-capacity signal worth watching.

---

## 2. Releases

**None.** No new releases in the last 24h; latest observed in-flight version is `v0.22.5+9-g67491b50` (issue reports) and `v0.22.4` (perf report). The absence of a release means many merged fixes (Webapp, TTS, perf) are accumulating on `main` without a tagged cut — users on stable will not see them yet.

---

## 3. Project Progress

Only **3 PRs were merged/closed** today:

| PR | Status | Impact |
|---|---|---|
| [#144633](https://github.com/NousResearch/hermes-agent/pull/144633) | CLOSED (merged) | `feat(tts)`: agent can pick/search ElevenLabs voices (`voice_id` + `find_voices`) — but immediately produced a regression follow-up (#144710) |
| [#137573](https://github.com/NousResearch/hermes-agent/pull/137573) | CLOSED | Windows-portability fix for idle worktree aging test fixture |
| (#141864, prior day) | merged 2026-10-25 | Webapp (browser-hosted Desktop) — spawning today's follow-up issue cluster |

Notably, **#144710** ([fix(tts): find_voices={} browses voices instead of falling to speech](https://github.com/NousResearch/hermes-agent/pull/144710)) is already open as a direct follow-up to the merged TTS feature — a fast-fix loop by `teknium1`. A large **salvaged refactor** ([#134362](https://github.com/NousResearch/hermes-agent/pull/134362), route all `config.yaml` I/O through a `ConfigBackend` seam) remains open.

---

## 4. Community Hot Topics

Ranked by comment count:

1. **[#38519](https://github.com/NousResearch/hermes-agent/issues/38519)** — *Feature: Hermes Desktop frontend install only* — **19 comments, 31 👍** (highest-reacted item of the day). Users want to install the Desktop UI without the agent, pointing at a remote agent. Underlying need: **decoupled client/server distribution** — a split-architecture demand, not just an installer nicety.
2. **[#143426](https://github.com/NousResearch/hermes-agent/issues/143426)** — *Linux desktop launches with 6% opacity; Settings hides the control* — **17 comments, 11 👍**. A visually catastrophic, immediately-visible default bug on Wayland/XWayland.
3. **[#68128](https://github.com/NousResearch/hermes-agent/issues/68128)** — *WhatsApp bridge spawn fails with WinError 5 in no-breakaway job objects* — **15 comments**. Long-running (since July) Windows integration blocker.
4. **[#121954](https://github.com/NousResearch/hermes-agent/issues/121954)** — *Linux desktop crashes with SIGTRAP/SIGSEGV on launch* — **8 comments**, 4 crashes in 2 days.
5. **[#141973](https://github.com/NousResearch/hermes-agent/issues/141973)** — *Mid-turn sends unreliable to steer* — **8 comments**. Core conversational UX correctness.
6. **[#130889](https://github.com/NousResearch/hermes-agent/issues/130889)** — *Windows gateway backend wedges (lock held across blocking `stream.close()`)* — **8 comments**.

**Analysis:** The community's loudest signals are (a) **Desktop platform-specific breakage** (Linux opacity/crashes, Windows job-object/lock issues) and (b) **client/server decomposition** (#38519). The Webapp launch also generated a dense burst of isolation/auth reports (#144648, #144668, #144672, #144679, #144681) — all filed within hours of each other, suggesting a coordinated post-merge audit.

---

## 5. Bugs & Stability

Ranked by severity:

**Critical / P0–P1 class**
- **[#130889](https://github.com/NousResearch/hermes-agent/issues/130889)** — *Windows gateway wedges; `ProcessRegistry._lock` held across blocking `stream.close()`* — backend-wide RPC starvation until restart. **No fix PR linked.**
- **[#121954](https://github.com/NousResearch/hermes-agent/issues/121954)** — *Linux desktop SIGTRAP/SIGSEGV on launch* — app unusable. **No fix PR; needs repro.**
- **[#144598](https://github.com/NousResearch/hermes-agent/pull/144598)** — *fix(gateway): Windows cold start with stray schtasks lines / non-ASCII paths* — **fix PR open**, addresses P0 row W11 from tracker #143547.
- **[#144593](https://github.com/NousResearch/hermes-agent/pull/144593)** — *fix(gateway): managed workers on WSL2 / resolved provider route* — **fix PR open**; managed workers (Kanban, cron, subagents) currently all fail.

**High / P2 class**
- **[#143426](https://github.com/NousResearch/hermes-agent/issues/143426)** — Linux 6% window opacity default (11 👍). **No fix PR yet.**
- **[#141973](https://github.com/NousResearch/hermes-agent/issues/141973)** — Mid-turn steer unreliability (queued/silent no-op). **No fix PR.**
- **[#144117](https://github.com/NousResearch/hermes-agent/issues/144117)** — Docker backend background process falsely reported exited (-1). **No fix PR.**
- **[#144437](https://github.com/NousResearch/hermes-agent/issues/144437)** — Bare `custom` provider falls through to OpenRouter → 400s on per-turn path. **No fix PR.**
- **Webapp cluster** — [#144668](https://github.com/NousResearch/hermes-agent/issues/144668) (sign-out leaves native apps signed in; **fix PR [#144660](https://github.com/NousResearch/hermes-agent/pull/144660) open**), [#144702](https://github.com/NousResearch/hermes-agent/issues/144702) (switching gateway connection deletes queued prompts), [#144672](https://github.com/NousResearch/hermes-agent/issues/144672), [#144679](https://github.com/NousResearch/hermes-agent/issues/144679), [#144681](https://github.com/NousResearch/hermes-agent/issues/144681).
- **[#143286](https://github.com/NousResearch/hermes-agent/issues/143286)** — `/handoff telegram` session can never reopen; **fix PR [#144708](https://github.com/NousResearch/hermes-agent/pull/144708) open.**

**Security (P2–P3)**
- **[#135200](https://github.com/NousResearch/hermes-agent/issues/135200)** & **[#144685](https://github.com/NousResearch/hermes-agent/issues/144685)** — a user `.env` can repoint `HERMES_MANAGED_DIR` / `HERMES_HOME`, relocating identity and policy. Sibling reports; **no fix PR.**

**Stability verdict:** The number of bugs with **no fix PR** (especially #130889, #121954, #143426) outpaces those with fixes. Several fixes exist but are unmerged (#144593, #144598, #144660, #144708), so user-visible relief is pending.

---

## 6. Feature Requests & Roadmap Signals

| Request | Link | Likelihood for next version |
|---|---|---|
| **Desktop frontend-only install** (31 👍, 19 comments) | [#38519](https://github.com/NousResearch/hermes-agent/issues/38519) | **High signal** — strong community demand; aligns with the already-shipped Webapp (client/server split). Likely to gain an RFC. |
| **Webapp hardening follow-ups** | [#144648](https://github.com/NousResearch/hermes-agent/issues/144648) (tracker by `teknium1`) | **Near-term** — explicitly a post-merge tracker; fix PRs already flowing. |
| **DuckDB workflow-lab analyzer** (private traces) | [#31782](https://github.com/NousResearch/hermes-agent/issues/31782) | Low near-term — niche, P3, open since May. |
| **Companion-app prerequisite guidance for plugin installs** | [PR #144574](https://github.com/NousResearch/hermes-agent/pull/144574) | Open PR — user-experience polish likely to land soon. |
| **hermesvault secret-source plugin** | [PR #143536](https://github.com/NousResearch/hermes-agent/pull/143536) | Open PR — addresses the recurring `.env`-plaintext/security theme. |
| **Skill auto-loading via `metadata.hermes.triggers`** | [PR #106249](https://github.com/NousResearch/hermes-agent/pull/106249) | Open since Sept; deterministic skill loading for CLI. |

**Prediction:** The next release is most likely a **stability/Webapp-hardening cut** (auth isolation, session prune correctness, handoff reopen) plus the perf wins below — not a headline feature release.

---

## 7. User Feedback Summary

**Pain points (dissatisfaction):**
- **Desktop is fragile on Linux and Windows.** Opacity at 6%, repeated SIGTRAP/SIGSEGV crashes, gateway wedges, job-object spawn failures — platform-native desktop is the weakest surface.
- **Conversational control is unreliable** (#141973): steering a live turn can queue, falsely report "sent," or silently no-op. This undermines trust in the core chat loop.
- **Silent data loss** (#144702): switching gateway connections can delete queued prompts/drafts/pins — a high-trust violation.
- **Security/identity footguns** (#135200, #144685): a single `.env` write can relocate agent identity/policy — users and maintainers both flagging this as a boundary violation.

**Positive signals / active use cases:**
- Heavy real-world scale: one reporter runs **4,583 sessions / 5.4 GB state.db** (#143833), another drives WhatsApp bridges on Windows, another builds **multi-voice game scripts** with the new ElevenLabs TTS (#144633).
- Users file **well-scoped, pre-flight-checked reports** (e.g., #144117 searched prior issues first) — a mature, engaged community.
- Maintainer responsiveness is high: `teknium1` and `unsupportedpastels` filed multiple fix PRs the same day issues surfaced.

**Net sentiment:** Enthusiastic adoption with a clear "**works great until a platform or edge path bites**" pattern; the Webapp merge shows the team is iterating quickly on its own surface.

---

## 8. Backlog Watch

Items needing maintainer attention (aged, high-impact, or stalled):

| Item | Age / Status | Why it matters |
|---|---|---|
| **[#68128](https://github.com/NousResearch/hermes-agent/issues/68128)** WhatsApp WinError 5 | Open since **2026-07-20** (~3 months), 15 comments | Long-standing Windows blocker; documented fallback (`windows_detach_flags_without_breakaway()`) reportedly missing. |
| **[#31782](https://github.com/NousResearch/hermes-agent/issues/31782)** DuckDB analyzer | Open since **2026-05-25** (~5 months) | Oldest open item in today's set; P3, no maintainer decision. |
| **[#121954](https://github.com/NousResearch/hermes-agent/issues/121954)** Linux SIGTRAP/SIGSEGV | Open since **2026-09-24**, `needs-repro` | Crash-class bug stuck without repro — needs maintainer triage help. |
| **[#130889](https://github.com/NousResearch/hermes-agent/issues/130889)** Windows gateway wedge | Open since **2026-10-01**, no fix PR | Backend-wide outage on Windows; high severity, no owner. |
| **[#134362](https://github.com/NousResearch/hermes-agent/pull/134362)** ConfigBackend refactor (salvage) | Open since **2026-10-07**, `ci-reviewed` | Large architectural PR; unmerged for ~3 weeks, may be bit-rotting. |
| **[#106249](https://github.com/NousResearch/hermes-agent/pull/106249)** Skill auto-load | Open since **2026-09-09** | Community PR nearing 7 weeks; needs review/decision. |
| **[#135200](https://github.com/NousResearch/hermes-agent/issues/135200)** / **[#144685](https://github.com/NousResearch/hermes-agent/issues/144685)** `.env` scope repointing | P3 security, no fix | Pair of security-boundary reports; worth a consolidated decision. |

**Recommendation:** Prioritize (1) a decision on the two `.env` security reports as one policy fix, (2) assign an owner to the Windows gateway wedge #130889, and (3) either land or close the stale `ConfigBackend` and skill-auto-load PRs to reduce WIP. The intake rate is healthy; the **merge/close rate is the constraint** — triage bandwidth, not community interest, is the limiting factor on project throughput.

</details>

<details>
<summary><strong>IronClaw</strong> — <a href="https://github.com/nearai/ironclaw">nearai/ironclaw</a></summary>

# IronClaw Project Digest — 2026-10-26

## 1. Today's Overview

IronClaw shows **low-to-moderate activity** on 2026-10-26, with all visible activity concentrated in automated dependency maintenance rather than feature development or community discussion. There were **0 issues updated** and **0 new releases** in the last 24 hours, while **7 pull requests** saw updates — 5 remain open and 2 were closed. Every PR in the current window is authored by `dependabot[bot]`, covering Rust crates, GitHub Actions, and WASM toolchain bumps. The complete absence of human-authored issues or PRs suggests a quiet maintenance phase, and community engagement metrics (comments, reactions) are effectively zero across the board. No bug reports, regressions, or feature requests surfaced today.

## 2. Releases

**None.** No new releases were published in the last 24 hours. There are no changelog, breaking-change, or migration notes to report for this period.

## 3. Project Progress

Two dependency PRs were **merged/closed** today, both unblocking routine upkeep:

- **[PR #8142](https://github.com/nearai/ironclaw/pull/8142)** — `chore(deps): bump the everything-else group across 1 directory with 41 updates` (closed 2026-10-25). Superseded or completed; the newer [#8160](https://github.com/nearai/ironclaw/pull/8160) carries 43 updates in the same group, indicating the batch was refreshed.
- **[PR #8133](https://github.com/nearai/ironclaw/pull/8133)** — `chore(deps): bump the actions group across 1 directory with 10 updates` (closed 2026-10-25). Likewise superseded by the newer [#8159](https://github.com/nearai/ironclaw/pull/8159) with 11 action updates.

**Assessment:** No user-facing features or bug fixes advanced today. Progress is limited to keeping the dependency graph current — a sign of healthy but purely mechanical maintenance.

## 4. Community Hot Topics

There are **no hot topics** in the traditional sense. All 7 updated PRs have `Comments: undefined` and **0 👍 reactions**, meaning no discussion or community voting occurred. For completeness, the most *recently touched* items are:

- **[PR #8160](https://github.com/nearai/ironclaw/pull/8160)** — 43 Rust crate updates (thiserror, uuid, base64, …), created & updated 2026-10-25.
- **[PR #8159](https://github.com/nearai/ironclaw/pull/8159)** — 11 GitHub Actions updates, notably `anthropics/claude-code-action` `1.0.183 → 1.0.259`.

**Underlying need:** The only discernible "need" is automated hygiene — staying current with the Rust and CI ecosystems. No human discussion is happening, which may indicate either a stable project or under-engaged community; maintainers may want to seed discussion with roadmap posts or good-first-issue labeling.

## 5. Bugs & Stability

**No bugs, crashes, or regressions were reported today** (0 issues updated). There are no fix PRs to track.

One item warrants a **stability watch (informational, not a confirmed bug):**
- **[PR #7834](https://github.com/nearai/ironclaw/pull/7834)** — `[size: L, risk: medium, ...] chore(deps): bump the wasm group ... with 4 updates` (wasmtime, wasmtime-wasi, wit-component, wit-parser). Created **2026-08-23** and still open after ~2 months, tagged `risk: medium` and `size: L`. WASM runtime upgrades can carry sandbox/runtime regressions, and its prolonged open state suggests either CI friction or maintainer caution. Severity if it regresses: **medium** (core execution surface). No associated bug issue exists yet.

## 6. Feature Requests & Roadmap Signals

**No feature requests** were filed or discussed in the last 24 hours, so there are no direct roadmap signals from user input today.

**Inferred signals from PR activity:**
- Consistent, high-volume dependency churn (43-package Rust bumps, tokio ecosystem bumps in [#8141](https://github.com/nearai/ironclaw/pull/8141), serde_json in [#8140](https://github.com/nearai/ironclaw/pull/8140)) suggests the next version is likely a **maintenance/stability release** rather than a feature release, unless feature branches land off-GitHub.
- The long-running WASM upgrade ([#7834](https://github.com/nearai/ironclaw/pull/7834)) hints that **sandboxed tool/plugin execution** remains an active area of investment, which could resurface as upcoming capabilities once merged.

## 7. User Feedback Summary

**No user feedback is available in this window.** With zero issue comments and zero reactions on all PRs, there are no recorded pain points, use cases, or satisfaction/dissatisfaction signals for 2026-10-26. Any sentiment analysis would be speculative and is therefore omitted.

**Health caveat:** Zero community interaction is itself a data point — it may reflect a stable, low-friction tool, or a project whose users report elsewhere (Discord/Matrix/forums). Maintainers should consider whether GitHub is capturing the real feedback channel.

## 8. Backlog Watch

The following long-open or frequently-refreshed PRs merit maintainer attention:

| PR | Age / Status | Why it matters |
|---|---|---|
| **[#7834](https://github.com/nearai/ironclaw/pull/7834)** — wasm group (4 updates) | Open since **2026-08-23** (~9 weeks), still updated 2026-10-25 | `risk: medium`, `size: L`; WASM runtime/sandbox upgrade stalled longest — highest-priority backlog item. |
| **[#8141](https://github.com/nearai/ironclaw/pull/8141)** — tokio ecosystem (5 updates) | Open since **2026-10-18** (~1 week) | Core async runtime; low risk but foundational — should merge promptly. |
| **[#8140](https://github.com/nearai/ironclaw/pull/8140)** — serde_json `1.0.151 → 1.0.154` | Open since **2026-10-18** | Serialization path; trivial but staleness compounds. |
| **[#8160](https://github.com/nearai/ironclaw/pull/8160)** / **[#8159](https://github.com/nearai/ironclaw/pull/8159)** | Created **2026-10-25** | Fresh batches superseding today's closed PRs; expect quick review cycles. |

**Recommendation:** Prioritize resolving **#7834**, as its multi-week open state with a medium-risk tag is the single clearest maintenance bottleneck. The remaining dependabot PRs are routine and represent normal queue volume.

---
*Data source: github.com/nearai/ironclaw. All metrics reflect the 24-hour window ending 2026-10-26. Zero comment/reaction counts are treated as reported (`undefined`/0) rather than assumed missing.*

</details>

<details>
<summary><strong>QwenPaw</strong> — <a href="https://github.com/agentscope-ai/QwenPaw">agentscope-ai/QwenPaw</a></summary>

# QwenPaw Project Digest — 2026-10-26

## 1. Today's Overview

QwenPaw shows **moderate but healthy activity** over the last 24 hours: 6 issues updated (5 open, 1 closed) and 6 PRs updated (all still open, none merged). No new releases were published, so the project remains on the last stable line (issues reference `2.2.2.post1`). The issue mix is dominated by **tool-layer correctness bugs** — self-kill guard false positives, `edit_file` line-ending/encoding corruption, and governance audit logging gaps — several of which already have matching fix PRs in flight. Community contribution momentum is positive, with two first-time contributors and a large architectural PR (channel plugin extraction) receiving attention. Overall project health: **stable, bug-fixing phase**, with no critical release-blocking regressions reported today.

## 2. Releases

No new releases in the last 24 hours. Nothing to report.

## 3. Project Progress

No PRs were merged or closed today, so no features landed. However, several PRs advanced their review cycle:

- **PR #8419** — `fix(tools): stop the shell self-kill guard from blocking kill $PID` ([link](https://github.com/agentscope-ai/QwenPaw/pull/8419)) — direct fix for Issue #8413; small (size/XS), likely fast to land.
- **PR #8318** — `feat(agent): add /steer command for mid-execution guidance` ([link](https://github.com/agentscope-ai/QwenPaw/pull/8318)) — fixes #1775, addresses a long-standing UX gap.
- **PR #8314** — `feat(web_search): add DeepSeek Search provider` ([link](https://github.com/agentscope-ai/QwenPaw/pull/8314)) — expands search provider options.
- **PR #8268** — `fix(task_tracker): bound the run completion callback and always clean up` ([link](https://github.com/agentscope-ai/QwenPaw/pull/8268)) — fixes the run-cleanup half of #8173.
- **PR #8187** — `feat(channels): extract channels into plugins with subprocess isolation` ([link](https://github.com/agentscope-ai/QwenPaw/pull/8187)) — large architectural refactor (size/XXXL), reduces host-process SDK imports and isolates channel failures.

## 4. Community Hot Topics

Activity is evenly distributed, with no single item exceeding 2 comments. The most notable threads:

- **Issue #8413** — *Self-kill guard blocks `kill $PID` for unrelated processes* ([link](https://github.com/agentscope-ai/QwenPaw/issues/8413)) — 2 comments, and already has a fix PR (#8419). Indicates a real workflow blocker for users managing daemons via shell.
- **Issue #8416** (CLOSED) — *Desktop approval dialog keeps retrying a cancelled request* ([link](https://github.com/agentscope-ai/QwenPaw/issues/8416)) — 2 comments; closed same day, suggesting responsive triage.
- **Issue #8412** — *`governance/audit.db` stops recording tool calls per-agent despite `audit_level: all`* ([link](https://github.com/agentscope-ai/QwenPaw/issues/8412)) — 2 comments; a silent compliance/observability failure, high user concern.
- **PR #8187** — channel plugin extraction ([link](https://github.com/agentscope-ai/QwenPaw/pull/8187)) — long-running (opened 2026-10-12), still open, represents the largest pending architectural change.

**Underlying needs:** users are running QwenPaw in real automation pipelines (daemon management, audited agent tooling, Windows desktop with channel integrations) and are hitting friction at the tool-execution and governance layers rather than in the core agent loop.

## 5. Bugs & Stability

Ranked by severity:

1. **Issue #8412** — *Audit logging silently stops per-agent* ([link](https://github.com/agentscope-ai/QwenPaw/issues/8412)) — **High severity.** Compliance/audit data loss; rows never resume once stopped. No fix PR identified yet. Requires maintainer attention.
2. **Issue #8415 / #8414** — *`edit_file` corrupts files: CRLF→LF conversion and lossy ISO-8859-1 decoding* ([#8415](https://github.com/agentscope-ai/QwenPaw/issues/8415), [#8414](https://github.com/agentscope-ai/QwenPaw/issues/8414)) — **High severity.** Silent data corruption on targeted edits; duplicate reports from the same author suggest reproducible. No fix PR yet.
3. **Issue #8413** — *Self-kill guard false positive blocks `kill $PID`* ([link](https://github.com/agentscope-ai/QwenPaw/issues/8413)) — **Medium severity.** Blocks legitimate workflows; **fix PR #8419 exists**.
4. **Issue #8417** — *Context compaction always fails with 400 on Volcano Engine AgentPlan `glm-5.3-flash`* ([link](https://github.com/agentscope-ai/QwenPaw/issues/8417)) — **Medium severity.** Compat layer sends both `thinking.type=disabled` variants; compaction permanently broken on that endpoint, though context is preserved via fallback plugin. No fix PR yet.
5. **Issue #8416** (CLOSED) — *Desktop approval dialog retry loop* ([link](https://github.com/agentscope-ai/QwenPaw/issues/8416)) — **Medium severity**, resolved same day.

## 6. Feature Requests & Roadmap Signals

- **`/steer` mid-execution guidance** (PR #8318, fixes #1775) — lets users correct a running turn without losing progress. Strong candidate for the next minor release given its small size and clear UX value.
- **DeepSeek Search provider** (PR #8314) — adds publication-date and authority-tier metadata to `web_search`. Likely to land once review completes; expands provider parity.
- **Channel plugin extraction with subprocess isolation** (PR #8187) — a roadmap-scale change that would reshape how channels are packaged. Watch for breaking changes to channel configuration if merged.
- **`TaskTracker` cleanup fix** (PR #8268) — completes the fix for #8173; likely in next patch.

## 7. User Feedback Summary

- **Pain points:** tool-layer correctness is the dominant theme — false-positive safety guards (#8413), destructive file edits (#8414/#8415), broken compaction on specific providers (#8417), and silent audit gaps (#8412).
- **Use cases observed:** POSIX daemon management via shell, Windows desktop with Feishu-channel integrations, governed/audited agent deployments, and multi-provider LLM setups (Volcano Engine, DeepSeek).
- **Satisfaction signals:** quick closure of #8416 and same-day fix PR for #8413 show responsive triage. Users report fallback mechanisms (e.g., `keep-context-after-compact-failure`) working as intended, limiting blast radius.
- **Dissatisfaction signals:** silent failures (audit logging, lossy encoding) are the most damaging — users only notice after data is already lost. Deployment eligibility friction on AgentScope Platform (PR #8418) also drew a first-time contributor's complaint about README wording.

## 8. Backlog Watch

- **Issue #8412** — audit logging regression ([link](https://github.com/agentscope-ai/QwenPaw/issues/8412)) — open since 2026-10-24, **no fix PR**, high compliance impact. Needs maintainer assignment.
- **Issues #8414 / #8415** — `edit_file` data corruption ([#8414](https://github.com/agentscope-ai/QwenPaw/issues/8414), [#8415](https://github.com/agentscope-ai/QwenPaw/issues/8415)) — reported 2026-10-25, **no fix PR**, duplicate reports signal reproducibility. Warrants priority triage.
- **Issue #8417** — compaction 400 error on Volcano Engine ([link](https://github.com/agentscope-ai/QwenPaw/issues/8417)) — provider-specific compat bug, **no fix PR**; affects a named cloud partner integration.
- **PR #8187** — channel plugin extraction ([link](https://github.com/agentscope-ai/QwenPaw/pull/8187)) — open since 2026-10-12 (14 days), size/XXXL, no comments recorded; large PRs risk stalling without reviewer bandwidth.

---
*Data source: github.com/agentscope-ai/QwenPaw, activity window 2026-10-25 to 2026-10-26.*

</details>

<details>
<summary><strong>ZeroClaw</strong> — <a href="https://github.com/zeroclaw-labs/zeroclaw">zeroclaw-labs/zeroclaw</a></summary>

# ZeroClaw Project Digest — 2026-10-26

## 1. Today's Overview

ZeroClaw shows a heavily PR-driven development cadence on 2026-10-26, with 50 PRs updated in the last 24 hours (49 open, only 1 merged/closed) against just 6 issues updated (5 open, 1 closed). This asymmetry — a large open PR queue with very low merge throughput — suggests a review bottleneck rather than a contribution drought, and several PRs carry `needs-author-action` or `needs-maintainer-review` labels confirming that. Activity is broad across subsystems: memory, channels (Telegram, Slack, Lark, Email), gateway/dashboard, cron, providers, plugins, i18n, and CI hardening. No new releases were published, and the project continues to accumulate changes tagged for `release:v0.9.0`, implying an upcoming release is being staged but not yet cut. Overall health is active but congested: strong contributor energy, weak short-term merge velocity.

## 2. Releases

No new releases in the last 24 hours. There is no release to detail; note that a meaningful cluster of open PRs and issues is explicitly tagged `release:v0.9.0` (e.g., #11986, #11174, #11855, #11976, #11980), indicating the next version is in preparation.

## 3. Project Progress

Only one PR was merged/closed in the window, and the data does not identify which one, so no specific feature can be credited as landed today. Progress is instead visible in *advanced-but-unmerged* work:

- **Gateway/dashboard security**: PR #11986 "scoped dashboard chat through the core" (stacked on dashboard sign-in and in-process RPC client work) is progressing — a substantial `risk:high, size:XL` effort toward scoping the web dashboard.
- **Runtime capabilities refactor**: PR #11174 adds capability-taking constructors for turn entry points, with companion docs PR #11980 proposing the runtime composition extension row.
- **Channel feature set**: PRs #11754 (configurable ack reactions) and #11744 (streaming model reasoning into Telegram/Slack drafts) push channel parity forward.
- **CI/security tooling**: PR #11988 (Semgrep SARIF suppression handling) and #11976 (CLI-only build/test ratchet) harden the pipeline.
- **Closed issue**: #12034 (RFC: Personal Agent MVP — visitor-facing knowledge-and-request subsystem) was closed same-day, with its materials summarized in PR #12033.

Net: no shipped increment today, but a large volume of review-stage work is queued for v0.9.0.

## 4. Community Hot Topics

- **Issue #8891 — Persistent memory parity tracker** ([link](https://github.com/zeroclaw-labs/zeroclaw/issues/8891)): The most-discussed item (14 comments), open since 2026-07-09 and still updated. It coordinates a multi-PR rollout to bring cross-session memory to parity with mature peer runtimes; 7 named open items (4 issues, 3 PRs) remain. Underlying need: users want memory that is curated, relevance-ranked, and operable — not just stored.
- **Issue #12022 — Opt-in external rerank stage for memory recall** ([link](https://github.com/zeroclaw-labs/zeroclaw/issues/12022)): Requests `rerank_strategy = "external"` to send the eligible candidate pool to an operator-configured `/v1/rerank` endpoint, default off with safe fallback. Directly complements #8891's relevance plane.
- **Issue #11853 — npm audit failure** ([link](https://github.com/zeroclaw-labs/zeroclaw/issues/11853)): Recurring bot-filed security gate (3 comments, `risk:high`), showing sustained attention to dependency hygiene.
- **PR #11986 / #11174 / #11744 / #11754** ([#11986](https://github.com/zeroclaw-labs/zeroclaw/pull/11986), [#11174](https://github.com/zeroclaw-labs/zeroclaw/pull/11174), [#11744](https://github.com/zeroclaw-labs/zeroclaw/pull/11744), [#11754](https://github.com/zeroclaw-labs/zeroclaw/pull/11754)): High-risk, large PRs across gateway, runtime, and channels dominate the review queue.

The dominant theme is **memory maturity** (issues) paired with **channel and gateway hardening** (PRs).

## 5. Bugs & Stability

Ranked by severity:

1. **Issue #11853 — `npm audit` high/critical finding** ([link](https://github.com/zeroclaw-labs/zeroclaw/issues/11853)): `risk:high`, security gate failing since 2026-10-19 (moderate `@tailwindcss/typography` noted in the excerpt, with 1 high/critical finding reported). No linked fix PR visible in this window.
2. **PR #11644 — cron shell diagnostics leaking to channels** ([link](https://github.com/zeroclaw-labs/zeroclaw/pull/11644)): `risk:high`, `needs-maintainer-review`. A failing scheduled shell command could forward raw stdout/stderr (potential command-text leak) to delivery channels. Fix PR exists and is awaiting review.
3. **PR #11283 — SOP step scope groups mismatched to registered tool names** ([link](https://github.com/zeroclaw-labs/zeroclaw/pull/11283)): `risk:high` bug; scope groups (`fs`/`web`) expand to names that don't match the registry (`file_read` vs `read_file`), so intended tool scoping silently misapplies. Fix PR open.
4. **PR #11672 — JPEG admission projection** ([link](https://github.com/zeroclaw-labs/zeroclaw/pull/11672)): `risk:high` provider fix to avoid copying input during JPEG decode-peak projection; awaiting maintainer review.
5. **PR #11326 — RPC persisted log reads refused to scoped principals** ([link](https://github.com/zeroclaw-labs/zeroclaw/pull/11326)): `priority:p1`, `risk:high`, `release-gate` — `logs/query` and `logs/get` were only coarsely gated; fix adds `require_global_stream_access`. Fix PR open.
6. **PR #11209 — unknown memory backends silently select markdown** ([link](https://github.com/zeroclaw-labs/zeroclaw/pull/11209)): `risk:medium`, `needs-author-action`; unrecognized `memory.backend` values wrote durable memory into workspace Markdown. Fix PR open.
7. **Issue #12035 — `knowledge_bundles` validated but never consumed** ([link](https://github.com/zeroclaw-labs/zeroclaw/issues/12035)): Severity Low — configuration silently ignored at runtime, no warning. No fix PR yet.
8. **Issue #12021 — Web UI config save button stays highlighted** ([link](https://github.com/zeroclaw-labs/zeroclaw/issues/12021)): S3 minor UX bug; banner "save all" doesn't clear the group save state ("1 unsaved change") until daemon reload. No fix PR yet.
9. **PR #11267 — Lark/Feishu post messages with images silently dropped** ([link](https://github.com/zeroclaw-labs/zeroclaw/pull/11267)): `risk:medium`, `needs-author-action`; fix PR open.

**Fix coverage**: several high-risk items (cron leak, SOP scoping, RPC logs, JPEG, memory backend, Lark images) already have open fix PRs, but most are stuck in `needs-author-action`/`needs-maintainer-review` — the review queue, not author supply, is the stability bottleneck.

## 6. Feature Requests & Roadmap Signals

- **External rerank for memory recall** (Issue #12022) — opt-in, default-off, failure-safe design; a strong candidate to land alongside the #8891 memory parity work.
- **Persistent memory parity** (Issue #8891) — tracker with 7 open items; expect incremental PRs, not a single drop.
- **Personal Agent MVP — visitor-facing knowledge-and-request subsystem** (Issue #12034, closed) — RFC material in PR #12033; signals interest in a lightweight visitor-facing agent mode.
- **Channel configurability & parity** — configurable ack reactions (#11754), reasoning streaming in Telegram/Slack (#11744), Telegram ack-reaction withdrawal (#11739), email inbound document persistence (#11746), WhatsApp voice-note documentation (#11056), and a dist-broad image with the full channel set (#11741).
- **Runtime composition** — capability-taking constructors (#11174) plus docs (#11980) suggest a structural refactor toward explicit capability passing.

**Prediction**: The v0.9.0 slice will likely emphasize memory relevance/rerank plumbing, channel parity (streaming, reactions, attachments), and runtime capability refactors, with security fixes (#11326, #11644) as release-gate inclusions.

## 7. User Feedback Summary

- **Pain point — silent configuration**: #12035 ("validated but never consumed, with no warning") and #11209 (unknown backend silently falling back to markdown) both describe configs that appear accepted but do nothing. Users want loud, early validation.
- **Pain point — memory quality**: #8891 and #12022 reflect demand for retrieval that is curated and relevance-ranked, with operator control (external rerank endpoint) and graceful degradation.
- **Pain point — channel reliability**: Dropped Lark image posts (#11267), email attachments never persisted despite docs claiming so (#11746), and Telegram ack reactions never withdrawn (#11739) show a gap between documented and actual channel behavior.
- **UX dissatisfaction (minor)**: The web UI config save-state bug (#12021) is a small but visible trust erosion — users can't tell whether their change saved.
- **Satisfaction signal**: High contributor throughput and prompt self-filed fixes indicate an engaged, technically capable user base; the friction is in review latency, not interest.

## 8. Backlog Watch

Long-running or high-value items needing maintainer attention:

- **Issue #8891 — Persistent memory parity tracker** ([link](https://github.com/zeroclaw-labs/zeroclaw/issues/8891)): Open since 2026-07-09 (~3.5 months), still 7 open sub-items; the single most important roadmap tracker and a coordination risk if it stalls.
- **PR #11209 — reject unknown memory backends** ([link](https://github.com/zeroclaw-labs/zeroclaw/pull/11209)): Open since 2026-09-28, `needs-author-action`, `risk:medium`; a correctness/data-placement fix that has waited ~4 weeks.
- **PR #11267 — Lark image parsing** ([link](https://github.com/zeroclaw-labs/zeroclaw/pull/11267)): Open since 2026-09-30, `needs-author-action`; user-visible message loss.
- **PR #11283 — SOP tool-name scoping** ([link](https://github.com/zeroclaw-labs/zeroclaw/pull/11283)): Open since 2026-09-30, `risk:high`, `distinguished contributor`; security-relevant, awaiting review.
- **PR #11326 — RPC log read scoping** ([link](https://github.com/zeroclaw-labs/zeroclaw/pull/11326)): Open since 2026-10-01, `priority:p1`, `release-gate`; an access-control fix that should not age further before v0.9.0.
- **PR #11174 — runtime capability constructors** ([link](https://github.com/zeroclaw-labs/zeroclaw/pull/11174)): Open since 2026-09-26, `risk:high, size:XL`, `release:v0.9.0`; a large refactor that other PRs (#11976, #11980) are stacked on — blocking downstream work until merged.

**Bottom line**: The project is healthy in contribution volume but constrained by review throughput. Clearing the `priority:p1` and `release-gate` security PRs (#11326, #11644) and the long-waiting correctness PRs (#11209, #11267, #11283) would unblock the v0.9.0 staging effort and reduce the backlog of stacked PRs.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*