# OpenClaw Ecosystem Digest 2026-10-27

> Issues: 500 | PRs: 500 | Projects covered: 5 | Generated: 2026-10-27 00:21 UTC

- [OpenClaw](https://github.com/openclaw/openclaw)
- [Hermes Agent](https://github.com/nousresearch/hermes-agent)
- [IronClaw](https://github.com/nearai/ironclaw)
- [QwenPaw](https://github.com/agentscope-ai/QwenPaw)
- [ZeroClaw](https://github.com/zeroclaw-labs/zeroclaw)

---

## OpenClaw Deep Dive

# OpenClaw Project Digest — 2026-10-27

## 1. Today's Overview

OpenClaw is in a **high-activity, stability-critical phase**. In the last 24 hours, 500 issues were updated (399 open/active, 101 closed) and 500 PRs moved (180 open, 320 merged/closed) — a healthy merge throughput that suggests maintainers are actively clearing backlog. However, the issue mix is dominated by **P0/P1 crash-loop and data-integrity reports** (SQLite WAL bloat, memory leaks, Windows update failures), indicating that recent releases (2026.9.x → 2026.10.x) introduced regressions that are still being worked through. No new releases shipped today, consistent with a stabilization window. Overall project health is **mixed**: strong contributor velocity (notably the prolific `steipete` on test/perf campaigns) offset by a cluster of release-blocker bugs, many of which lack fix PRs.

## 2. Releases

**None.** No new releases in the last 24h. The absence of a release during an active bug cluster is worth noting — maintainers appear to be holding the line rather than shipping on top of unresolved P0s.

## 3. Project Progress

320 PRs were merged/closed in the last 24h. Notable merged or advanced work:

- **[#185171](https://github.com/openclaw/openclaw/pull/185171) [CLOSED] fix: preserve candidate Doctor authority checks** — corrected a fixture that inspected the installed-plugin index from a parent process while Doctor held exclusive offline maintenance.
- **[#185222](https://github.com/openclaw/openclaw/pull/185222) [CLOSED] perf(agents): reduce plain-text stream normalization overhead** — trims avoidable promise continuations/grammar allocations in ordinary streamed replies.
- Test-audit campaign (batch d642/d643): **[#185214](https://github.com/openclaw/openclaw/pull/185214)**, **[#185216](https://github.com/openclaw/openclaw/pull/185216)** remove low-value/redundant tests across ai, gateway, infra, ui, and agents.
- PostgreSQL migration maturation: **[#185236](https://github.com/openclaw/openclaw/pull/185236)** (backup while Gateway runs), **[#185237](https://github.com/openclaw/openclaw/pull/185237)** (concurrent memory index rebuild), **[#185238](https://github.com/openclaw/openclaw/pull/185238)** (store auth token fix on PG).
- Update/rollback hardening: **[#185021](https://github.com/openclaw/openclaw/pull/185021)** (torn `.pre-update` config snapshot), **[#185219](https://github.com/openclaw/openclaw/pull/185219)** (cleanup destination verification via `-shm` mtimes), **[#185223](https://github.com/openclaw/openclaw/pull/185223)** (failed-update capture cleanup).

A notable recurring theme: **update/repair reliability** is being actively patched across multiple PRs.

## 4. Community Hot Topics

Top issues by comment count (all links to `github.com/openclaw/openclaw`):

| Issue | Title | Comments | State |
|---|---|---|---|
| [#143524](https://github.com/openclaw/openclaw/issues/143524) | SQLite WAL grows to 1.4–2.8 GB, blocks gateway startup (Windows) | 139 | CLOSED |
| [#160959](https://github.com/openclaw/openclaw/issues/160959) | Gateway blocks for minutes capturing large external plugins (2026.9.6 regression) | 57 | OPEN |
| [#159662](https://github.com/openclaw/openclaw/issues/159662) | `prepared-model-catalog.worker.js` unbounded memory leak ~4–5 GB/h | 26 | OPEN |
| [#170956](https://github.com/openclaw/openclaw/issues/170956) | Windows slow startup, unclean plugin shutdown, schtasks permission error | 20 | OPEN |
| [#172091](https://github.com/openclaw/openclaw/issues/172091) | Worker SQLite transaction stuck open, blocks WAL checkpoints | 16 | CLOSED |

**Underlying needs analysis:** The top three threads all point to the same architectural pressure — **long-lived SQLite-backed state under Windows + worker-thread concurrency**. Users operating single-gateway multi-agent installs are hitting resource exhaustion (WAL, RSS, CPU) that turns into crash-loops. The community is doing rigorous forensic work (offline checkpointing, provider bisects, cold-reboot reproduction), which signals sophisticated operators rather than casual users — and a corresponding expectation of production-grade durability that the project is still maturing toward.

## 5. Bugs & Stability

Ranked by severity (P0 first). Note fix-PR availability:

**P0 — Release blockers / crash-loops**
- **[#159662](https://github.com/openclaw/openclaw/issues/159662)** — Unbounded memory leak in `prepared-model-catalog.worker.js` (4–5 GB/h, provider-agnostic). **No fix PR.**
- **[#143524](https://github.com/openclaw/openclaw/issues/143524)** — SQLite WAL unbounded growth blocks startup (CLOSED, but root cause class recurs in #172091).
- **[#160959](https://github.com/openclaw/openclaw/issues/160959)** — Gateway event-loop block for minutes on large plugin capture. **No fix PR.**
- **[#170956](https://github.com/openclaw/openclaw/issues/170956)** — Windows restart/update unreliability. **No fix PR.**
- **[#139082](https://github.com/openclaw/openclaw/issues/139082)** — Update post-restart health check false-negatives, leaves gateway stopped.
- **[#166634](https://github.com/openclaw/openclaw/issues/166634)** — Late reclamation checkpoint failure leaves agent permanently `UNAVAILABLE` after crash.

**P1 — High impact, no fix landed**
- **[#181432](https://github.com/openclaw/openclaw/issues/181432)** — Baseline RSS jumped ~300 MB → 1.89 GB on 2026.10.5 (Linux ARM64); SQLite transaction timeouts.
- **[#182476](https://github.com/openclaw/openclaw/issues/182476)** — Windows `update repair` fails with `OPENCLAW_STATE_LEASE_LOST`.
- **[#169953](https://github.com/openclaw/openclaw/issues/169953)** — npm update 2026.9.4 → 2026.10.2 always fails (candidate gateway hangs at config.auth).
- **[#145203](https://github.com/openclaw/openclaw/issues/145203)** — Hung `openai-completions` SSE stream (48.5 min) never recovered; stall watchdog starved.
- **[#177656](https://github.com/openclaw/openclaw/issues/177656)** — Native host exec returns shared-state integrity-admission error (28+ failures on stable).

**Assessment:** Many high-severity bugs are **open with no fix PR** (`clawsweeper:no-new-fix-pr`). The update/repair pipeline in particular (Windows + npm + lease handling) is the single largest cluster of user-visible breakage. One P2 closed today — **[#184315](https://github.com/openclaw/openclaw/issues/184315)** (operator scope inconsistency) — a small win.

## 6. Feature Requests & Roadmap Signals

Active feature/enhancement issues and what they signal:

- **[#162164](https://github.com/openclaw/openclaw/issues/162164)** — Opt-in personal identity on iOS/macOS while preserving Shared owner. Already has a merged slice (#164593); likely **landing incrementally in 2026.10.x**.
- **[#161050](https://github.com/openclaw/openclaw/issues/161050)** — Memory-pressure-aware admission for `sessions_spawn`/cron. Strongly aligned with the memory-leak P0s; candidate for a **near-term reliability release**.
- **[#149024](https://github.com/openclaw/openclaw/issues/149024)** — Host-wide pre-execution authorization guard + fail-closed empty allowlists. Security-boundary work; likely **gated behind security review**.
- **[#112372](https://github.com/openclaw/openclaw/issues/112372)** — Opt-in `wakeOnReply` deferred completion for `sessions_send`; has an open linked PR.
- **[#136271](https://github.com/openclaw/openclaw/issues/136271)** — MS Teams dynamic SharePoint site resolution; linked PR open.
- **[#175826](https://github.com/openclaw/openclaw/issues/175826)** — Android native approval/question parity with browser.

**Prediction for next version:** Prioritize (1) memory/admission controls (#161050), (2) update-pipeline reliability fixes, and (3) PostgreSQL multi-store maturation (several PRs already in flight). Identity work (#162164) will continue phasing in.

## 7. User Feedback Summary

**Pain points (dissatisfaction):**
- **Update/upgrade is the #1 friction source.** Multiple users report updates failing, hanging at validation, or leaving the gateway stopped (#169953, #182476, #183786, #170956, #139082, #170654). This is a trust-eroding pattern for a self-hosted product.
- **Windows is disproportionately affected** — schtasks permissions, lease-loss, PID queries, WAL checkpoint blocks.
- **Resource growth is alarming** — baseline RSS 1.9 GB (#181432), WAL to 2.8 GB (#143524), 4–5 GB/h leak (#159662). Users on constrained VMs (10 GB) fear OOM.
- **Token/cache waste** — bootstrap re-injection (#67419) wastes 20–30% of context; prompt-cache churn (#143017, #146902) measured at 21.3M cache-write tokens.

**Positive signals:**
- Very high investigative quality in reports (wire captures, provider bisects, cold-reboot repros) → an engaged, technically strong user base.
- Some users ship local patches and offer to share them (#134918), indicating deep investment.
- Closed items (#143524, #172091, #154517, #89430, #184315) show maintainers do close loops, even on hard state-consistency bugs.

## 8. Backlog Watch

Long-open, high-impact issues needing maintainer attention:

- **[#67419](https://github.com/openclaw/openclaw/issues/67419)** (open since 2026-04-15, 14 comments) — Bootstrap-file re-injection wastes 20–30% tokens per turn. Needs a **product decision**; has 2 👍 and clear cost impact.
- **[#118793](https://github.com/openclaw/openclaw/issues/118793)** (since 2026-08-03) — Claude CLI session-limit error bypasses model fallback chain. Linked PR open but not merged.
- **[#89430](https://github.com/openclaw/openclaw/issues/89430)** — **CLOSED** today; Google Chat media delivery under app auth (was open since 2026-06-02). Good backlog burn-down.
- **[#114414](https://github.com/openclaw/openclaw/issues/114414)** — Dated TODO sweep with multiple **overdue** items (CI auth path, zizmor re-enable). Maintainer hygiene item.
- **[#149631](https://github.com/openclaw/openclaw/issues/149631)** (since 2026-09-16) — PR preflight throws at 121 jobs vs 120 Node matrix cap, red-lining CI before tests run. Blocks contributor velocity.
- **[#144797](https://github.com/openclaw/openclaw/issues/144797)** (since 2026-09-11) — Reused claude-cli session keeps deleted `--mcp-config`; all MCP tools 401 mid-session. Stale, needs maintainer review.

**Recommendation:** The CI matrix cap (#149631) and the update-pipeline P1s are the highest-leverage items — they affect every contributor and every operator respectively.

---

*Digest generated from GitHub activity snapshot for 2026-10-27. Comment counts reflect top-50 issue / top-30 PR slices. Links point to `github.com/openclaw/openclaw`.*

---

## Cross-Ecosystem Comparison

# Cross-Project Comparison Report — Personal AI Assistant / Agent OSS Ecosystem
**Date: 2026-10-27** · Sources: OpenClaw, Hermes Agent, IronClaw, QwenPaw, ZeroClaw community digests

---

## 1. Ecosystem Overview

The personal AI assistant / agent open-source landscape on 2026-10-27 is **mature enough to be dominated by stability and trust concerns rather than feature novelty**. Across the five tracked projects, the top pain clusters are strikingly consistent: session/automation reliability, context and memory governance, provider-compatibility edge cases, and update/upgrade integrity. Activity is high but unevenly distributed — OpenClaw and Hermes Agent carry the largest contributor and user bases, QwenPaw is in a post-release stabilization sprint, ZeroClaw is mid-security-audit ahead of v0.9.0, and IronClaw is dormant. The market is segmenting: OpenClaw as the general-purpose self-hosted core, Hermes Agent as a multi-channel automation platform, ZeroClaw as a security/identity-first gateway, and QwenPaw as a desktop-plus-memory product. Across all projects, **operators are running production-grade workloads and demanding production-grade durability** — the community's forensic-quality bug reports are themselves a maturity signal.

---

## 2. Activity Comparison

| Project | Issues (updated 24h) | PRs (updated 24h) | Merged/Closed PRs | New Releases | Health Score* | Phase |
|---|---|---|---|---|---|---|
| **OpenClaw** | 500 (399 open / 101 closed) | 500 (180 open / 320 closed) | **320** | None | **6.5 / 10** | High-activity, stability-critical |
| **Hermes Agent** | 50 (41 open / 9 closed) | 50 (38 open / 12 closed) | **12** | None | **7.5 / 10** | High-activity, responsive |
| **IronClaw** | 0 | 0 | 0 | None | **N/A** | Dormant |
| **QwenPaw** | 25 (17 open / 8 closed) | 48 (32 open / 16 closed) | **16** | None | **7.0 / 10** | Post-release stabilization |
| **ZeroClaw** | 23 (23 open / **0 closed**) | 29 (28 open / 1 closed) | **1** | None | **5.5 / 10** | Security-audit / review-bound |

\* Health score is a qualitative composite of: merge throughput vs. backlog growth, presence of release-blocking bugs without fix PRs, contributor responsiveness, and open/closed issue ratio. Not a formal metric.

**Key read:**
- **Zero release shipped across any project** — the entire ecosystem is in a stabilization window, which is unusual and suggests widespread post-2026.9/10 regression pressure.
- **Merge throughput varies by 320×** (OpenClaw 320 vs. ZeroClaw 1), reflecting vastly different maintainer bandwidth and contributor scale.
- **ZeroClaw is the only project with zero issues closed** in the window while a fresh 8-issue security cluster landed — the clearest bottleneck signal in the set.

---

## 3. OpenClaw's Position

**Advantages vs. peers:**
- **Scale.** 500 issues + 500 PRs touched in 24h is an order of magnitude above every other project (Hermes: 100 combined; QwenPaw: 73; ZeroClaw: 52). OpenClaw is the de facto reference implementation of the category.
- **Merge velocity.** 320 PRs merged/closed in 24h demonstrates industrial-grade CI and maintainer capacity. No peer comes close.
- **Architectural breadth.** PostgreSQL migration maturation (multiple in-flight PRs), multi-agent single-gateway installs, plugin capture, and update/rollback hardening show a platform investing in **durability primitives** rather than single features.

**Technical approach differences:**
- OpenClaw leans on **long-lived SQLite-backed state + worker-thread concurrency**, which is precisely the source of its top P0s (WAL bloat, `prepared-model-catalog.worker.js` leak). Peers have largely avoided this class by being narrower (Hermes: gateway/session-focused; ZeroClaw: Rust + RPC).
- Its **update/repair pipeline** (npm + Windows + lease handling) is uniquely complex — and uniquely fragile — versus peers who ship simpler distribution.

**Community size comparison:**
- OpenClaw's top thread has **139 comments**; Hermes' top thread has 10; QwenPaw's has 12. By engagement depth, OpenClaw's community is roughly **an order of magnitude larger and more investigative** than any peer.
- However, this scale cuts both ways: OpenClaw also carries the **largest unresolved P0/P1 cluster with no fix PR** (`clawsweeper:no-new-fix-pr`), meaning its lead is in surface area, not necessarily in resolved reliability.

**Positioning verdict:** OpenClaw is the ecosystem's **anchor project and its biggest liability**. If its update pipeline and memory-leak P0s land in a near-term reliability release, it consolidates the category. If they linger, it cedes trust-sensitive operators to ZeroClaw (security) and Hermes (channel automation).

---

## 4. Shared Technical Focus Areas

Four cross-cutting requirements emerge from independent community feedback:

### 4.1 Session / Automation Reliability (highest consensus)
- **Hermes Agent:** `admission_conflict` cluster (#142461, #143720, #145261) — wake refusals never terminating, attempt caps not firing, 2,641 refusals/day.
- **OpenClaw:** gateway event-loop blocks (#160959), late reclamation leaving agents `UNAVAILABLE` (#166634), stalled SSE streams (#145203).
- **ZeroClaw:** failed ACP turns not persisted on RPC path (#10673, S1).
- **Shared need:** deterministic wake/retry semantics with **enforced backoff caps** and diagnosable refusal reasons.

### 4.2 Context & Memory Governance
- **ZeroClaw:** trimming *permanently deletes* history (#11711); inert config keys (#10781); no proactive compaction (#10780).
- **OpenClaw:** bootstrap re-injection wastes 20–30% tokens (#67419); prompt-cache churn (21.3M cache-write tokens).
- **QwenPaw:** embedding batch drop on one over-limit chunk (#8040); `history.db` growth addressed by #7923.
- **Hermes Agent:** warm-handoff compression PR (#133625); context-limit 400 auto-compaction (#145300).
- **Shared need:** **non-destructive, budget-aware, observable** context management — a contract-honest memory subsystem.

### 4.3 Provider / Wire-Protocol Compatibility
- **QwenPaw:** Responses API empty-stream (#8162), thinking-disable wire mismatch (#8417), legacy MCP fallback (#8424), Anthropic `key_cmd` header (#145275 in Hermes).
- **Hermes Agent:** Anthropic thinking-block duplication (#123923), custom-endpoint reasoning 400 (#145246), `key_cmd` Bearer-vs-`x-api-key` (#145275).
- **OpenClaw:** `openai-completions` SSE stalls (#145203).
- **Shared need:** a **compatibility layer that honors declared provider wire formats** rather than guessing — repeated across OpenAI-compatible, Anthropic, and MCP endpoints.

### 4.4 Update / Upgrade Integrity
- **OpenClaw:** the single largest user-visible breakage cluster (Windows `update repair`, npm failures, lease-loss, torn config snapshots) — multiple P1s, several without fix PRs.
- **QwenPaw:** upgrade regressions (#8425 mail config `name@domain@domain`), Windows ZIP garbling (#8270).
- **Shared need:** **config and identity continuity across upgrades**, plus atomic, verifiable rollback.

### 4.5 Security Boundary Hardening (emerging)
- **ZeroClaw:** coordinated 8-issue audit (#12043–#12053) — OIDC CSRF, X-Forwarded-For loopback spoofing, unbounded buffering, wildcard tool leaks.
- **Hermes Agent:** approval-button scope mismatch (#145096), secrets not stripped from child envs (#122750).
- **OpenClaw:** host-wide pre-exec authorization guard proposal (#149024).
- **Shared need:** **fail-closed authorization with explicit scope semantics** and secret hygiene in child processes.

---

## 5. Differentiation Analysis

| Dimension | OpenClaw | Hermes Agent | QwenPaw | ZeroClaw | IronClaw |
|---|---|---|---|---|---|
| **Feature focus** | General-purpose self-hosted core; multi-agent gateway | Multi-channel automation (Discord/Telegram/cron) + relay support | Desktop + memory + channels + cron | Security/identity-first gateway; RPC auth | — |
| **Target user** | Sophisticated self-hosters, multi-agent operators | Automation power users, group-chat pipelines | Desktop users, memory-heavy workflows | Security-conscious production deployers | — |
| **Architecture** | SQLite + worker threads, PostgreSQL migration in flight | Gateway/session state machine, adapter-based channels | Desktop app + plugin/theme system, `pawapp` SDK | Rust runtime, RPC + OIDC, plugin isolation | — |
| **Distribution** | npm + Windows-native update pipeline | PyPI-style app + relays | macOS-centric, Linux Docker (deb/AppImage pending) | Rust binary + gateway | — |
| **Signature strength** | Scale, ecosystem breadth | Channel coverage, quick fixes | Desktop UX, plugin extensibility | Security posture, type safety | — |
| **Signature weakness** | Update/repair fragility, memory leaks | Admission-conflict loop | Unreviewed XXXL PRs, cross-platform gaps | Merge bottleneck, zero closures | Inactivity |
| **Community voice** | Deep forensic reporting | Focused, responsive | Plugin authors + desktop users | External audits, security researchers | — |

**Notable architectural divergence:** ZeroClaw's **Rust + plugin-isolation** path (extracting channels into subprocess-isolated plugins, #8187) is the clearest alternative to OpenClaw's monolithic worker-thread model — and is where security-sensitive operators are likely to gravitate. QwenPaw's **plugin-facing theme API** (#8071) and **SDK redesign** (#7874) target a different axis: third-party extensibility rather than operator hardening.

---

## 6. Community Momentum & Maturity

**Activity tiers (24h):**

| Tier | Projects | Characteristics |
|---|---|---|
| **Tier 1 — Industrial scale** | **OpenClaw** | 500/500 issues/PRs, 320 merges; anchor of the ecosystem; largest unresolved P0 cluster |
| **Tier 2 — High-velocity, responsive** | **Hermes Agent, QwenPaw** | 50–73 combined events; 12–16 merges; new bugs get fix PRs within a day |
| **Tier 3 — Review-bound** | **ZeroClaw** | 28 open PRs, 1 merge, 0 issue closures; contributor enthusiasm outpaces maintainer bandwidth |
| **Tier 4 — Dormant** | **IronClaw** | No activity |

**Rapidly iterating:** OpenClaw (platform maturation), QwenPaw (post-2.2.2 regression sprint), Hermes Agent (small-fix cadence).

**Stabilizing / at risk of stall:** ZeroClaw (security cluster + merge bottleneck could delay v0.9.0), OpenClaw's update pipeline (regression accumulation without release cut).

**Maturity signals:**
- **Positive:** Hermes and QwenPaw demonstrate **same-day fix turnaround** on new reports (e.g., Hermes #145285 → #145288). QwenPaw closed 10 long-lived regressions in one day. OpenClaw closes hard state-consistency bugs (#143524, #172091).
- **Negative:** OpenClaw and ZeroClaw both show **high-severity open bugs without fix PRs**; ZeroClaw additionally has **zero closures** in-window. The ecosystem's weakest link is **review/merge bandwidth relative to contributor volume**, not idea generation.

**Maturity ranking (operational readiness):** Hermes Agent ≈ QwenPaw > OpenClaw > ZeroClaw. OpenClaw ranks lower than its scale suggests *because* its scale amplifies unresolved reliability debt.

---

## 7. Trend Signals

Extracted from community feedback across all five projects, with implications for AI agent developers:

1. **Reliability is the new feature.** Every project's top complaint is non-deterministic behavior (wake refusals, silent hangs, lossy trims), not missing capabilities. **Developers should treat idempotent retries, enforced backoff caps, and diagnosable failure reasons as table stakes** — the `admission_conflict` pattern in Hermes is a cautionary template for anyone building session wake logic.

2. **Context/memory is a contract, not a config.** Users are explicitly calling out *inert config keys* (ZeroClaw #10781) and *destructive trimming* (#11711). The winning pattern is **observable, non-destructive, budget-aware memory** with honest semantics. Token-cost governance (thinking-level per cron job in QwenPaw #8439/#8429; bootstrap re-injection waste in OpenClaw #67419) is now a first-class requirement.

3. **Provider heterogeneity is the silent tax.** Anthropic thinking blocks, OpenAI Responses streaming, legacy MCP discovery, custom relays — every project bleeds on wire-format edge cases. **A declared-wire-format compatibility layer that fails loudly, not silently**, is the emerging best practice (cf. QwenPaw #8417, Hermes #145287).

4. **Upgrade integrity is trust infrastructure.** Across OpenClaw and QwenPaw, upgrade regressions (config invalidation, ZIP garbling, lease loss) erode operator trust more than any single bug. **Atomic, verifiable, rollback-capable updates** with config-continuity guarantees are becoming a differentiator, not a chore.

5. **Security is moving from afterthought to audit-driven.** ZeroClaw's coordinated 8-issue identity/access audit and its external 79/100 review (#12042) signal that **third-party security scrutiny is arriving** for the category. Fail-closed authorization, child-env secret stripping, and CSRF/header-spoofing defenses will be expected defaults within a release cycle.

6. **Third-party plugin ecosystems are maturing — and straining.** Plugin theme APIs (QwenPaw #8071), plugin admission guidance (Hermes #143053), and plugin isolation refactors (ZeroClaw #8187) all point to the same inflection: **the ecosystem is shifting from first-party features to platform governance**. Projects that document admission, compatibility, and isolation contracts will attract plugin authors; those that don't will accumulate unreviewed XXXL PRs.

7. **The merge bottleneck is the ecosystem's scarcest resource.** ZeroClaw's 28-open/1-merged ratio and OpenClaw's `no-new-fix-pr` P0s both indicate that **maintainer review bandwidth — not contributor interest — caps ecosystem velocity**. For developers choosing where to contribute, the highest-leverage work is often triage and review, not net-new features.

**Bottom line for decision-makers:** The category has crossed from "does it work?" to "can I trust it in production?" Projects that ship a **reliability release** (OpenClaw's update pipeline + memory leaks; Hermes' admission-conflict fix; ZeroClaw's security cluster + merge push) in the next cycle will define the standard. Those that don't will be judged by their open P0s, not their feature lists.

---

## Peer Project Reports

<details>
<summary><strong>Hermes Agent</strong> — <a href="https://github.com/nousresearch/hermes-agent">nousresearch/hermes-agent</a></summary>

# Hermes Agent — Project Digest
**Date: 2026-10-27** · Repo: [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent)

---

## 1. Today's Overview

Activity remains very high: **50 issues updated in the last 24h** (41 open, 9 closed) and **50 PRs updated** (38 open, 12 merged/closed), with **no new releases**. The dominant theme today is a persistent cluster of **Discord/Gateway `admission_conflict` failures** affecting session wake/automation flows — multiple independent reports (#142461, #143720, #145261) now form a cross-platform reliability pattern. The issue queue is otherwise a healthy mix: gateway/desktop correctness bugs (largely reported by a single prolific reporter, Adolanium), agent/provider edge cases, and security hardening. Overall project health looks strong on throughput (many closures), but the recurring gateway session-admission family and the trickle of session-state/provider-compatibility bugs suggest stability debt concentrated in the automation/session wake path.

---

## 2. Releases

**None.** No new release in the last 24h, and no release notes to summarize. The most recent stable referenced in the data is **v0.22.5** (`git 99fcd694…`, commit `bf0203a7…` cited in issue reproductions).

---

## 3. Project Progress

**12 PRs merged/closed in the last 24h.** Notable closed work:

- **#144724 / #144732 — `plugin-catalog: add tide` (context engine)** — two duplicate submissions of the same catalog entry were closed; a single owner submission should land ([#144724](https://github.com/NousResearch/hermes-agent/pull/144724), [#144732](https://github.com/NousResearch/hermes-agent/pull/144732)).
- **#145246 (CLOSED) — Custom-endpoint "reasoning is not supported" 400** — closed after the reasoning-field rejection recovery gap was addressed for custom OpenAI-compatible endpoints ([#145246](https://github.com/NousResearch/hermes-agent/issues/145246)).
- **#109423 (CLOSED) — Telegram `allowed_chats` JSON-string mis-parse** — long-running (since Sep 12) bug where group messages were silently dropped is now closed ([#109423](https://github.com/NousResearch/hermes-agent/issues/109423)).
- **Webapp/Desktop correctness batch closed** (all reported by Adolanium): profile-serving (#144681), cross-profile default folder (#144679), prepared-submission journal races (#144772, #144672), profile-starting AttributeError (#144670), spent download ticket retry (#144667).

**Feature work advancing in open PRs:** warm-handoff compression (`compression.warm_handoff`, [#133625](https://github.com/NousResearch/hermes-agent/pull/133625)), context-limit 400 auto-compaction ([#145300](https://github.com/NousResearch/hermes-agent/pull/145300)), and signed Anthropic thinking replay via relays ([#145287](https://github.com/NousResearch/hermes-agent/pull/145287)).

---

## 4. Community Hot Topics

| Item | Type | Comments | 👍 | Link |
|---|---|---|---|---|
| #142461 Discord auto-thread wake refused `admission_conflict` forever | Bug | 10 | 6 | [#142461](https://github.com/NousResearch/hermes-agent/issues/142461) |
| #143720 Discord thread process-completion wake refused every 60s; attempt cap never fires | Bug | 6 | 0 | [#143720](https://github.com/NousResearch/hermes-agent/issues/143720) |
| #143053 Plugin catalog admission guidance for complete workflow bundles | Docs | 5 | 0 | [#143053](https://github.com/NousResearch/hermes-agent/issues/143053) |
| #145261 Watch-pattern completions refused (multiplex profiles, group session) | Bug | 4 | 0 | [#145261](https://github.com/NousResearch/hermes-agent/issues/145261) |
| #124395 `scheduled` status has no timer/due-date/release sweep | Feature | 4 | 0 | [#124395](https://github.com/NousResearch/hermes-agent/issues/124395) |

**Underlying needs:** The top three hot items are all the **same core failure** — gateway session-admission refusing automation/process-completion wakes on Discord threads, with retries that never terminate. Users need (a) the conflict resolved at admission, (b) the attempt cap/backoff actually enforced, and (c) clear diagnostics distinguishing "stale parent" from "config". The scheduled-task item (#124395) points at a semantics gap: the `scheduled` state advertises time-based waiting but only a human unblock can exit it. The plugin-catalog question (#143053) reflects growing third-party ecosystem interest and a need for documented admission/compatibility routes.

---

## 5. Bugs & Stability

**Critical / P2 gateway & session reliability:**
- **#142461** — Discord auto-thread automation wakes refused indefinitely; parents never resume after children finish (10 comments, 6 reactions) — *active, no fix PR referenced.*
- **#143720** — Process-completion wake refused every 60s forever; `_MAX_COMPLETION` cap never fires, `notify-mode=off` no effect; 494 log occurrences, still firing after 6h — *active.*
- **#145261** — Watch-pattern injections always refused (v0.22.5, multiplex profiles); **2,641** `admission_conflict` refusals in one day — *active, highest-volume report.*
- **#145298** — Desktop file drop on messaging-platform sessions always fails `permission_denied` (`file.attach` requires LOCAL policy) — *new today.*
- **#144560** — Gateway crash-loops when `aiohttp` absent: `-> web.Response` annotations evaluated at import (66 sites) — *active.*

**Session-state / provider compatibility:**
- **#123923** — Anthropic 400 `thinking blocks cannot be modified`: heartbeat continuation duplicates thinking blocks — *active; related in-flight PR #145287.*
- **#143653** — `chat -q` from kanban/cron worker env fails `session.create` (canonical contract rejects inherited `HERMES_SESSION_SOURCE` labels) — *active.*
- **#145286** — CLI reads `data.field` but gateway sends `data.fields`; policy refusal renders as "couldn't start the model connection" — *new today.*
- **#145275** — `key_cmd` for `anthropic_messages` always sent as `Bearer`, never `x-api-key` — *active; blocks Anthropic Console keys.*

**Security / correctness:**
- **#145096** — Approval buttons can approve a *different* pending request than the card shown for (Telegram) — *stale-card approval scope.*
- **#122750** — Gateway adapter secrets / OAuth-profile keys not stripped from terminal/background/cron child envs — *long-standing security boundary issue.*
- **#145122** — API server SSE uses unbounded per-request `asyncio.Queue` → slow client can retain unlimited events.
- **#145255** — `hard_interrupt` from `pre_tool_call` can still let an already-authorized sibling tool dispatch.

**TUI / Desktop:**
- **#145285** — Ink TUI stdin recovery misses stopped TTY reads when `readableLength` is zero (permanent input freeze) — *fix PR exists: [#145288](https://github.com/NousResearch/hermes-agent/pull/145288).*
- **#145155** — Cron `context_from` injects days-old run; archive frame off-by-one → `_archive_answer()` returns None.

**Fix PRs present:** #145288 (TUI stdin), #145287 (Anthropic thinking replay), #145290 (sudo prompt on backends without sudo), #145291 (sudo flag scoping), #145295 (Discord typing loop race), #145300 (context-limit 400 compaction).

---

## 6. Feature Requests & Roadmap Signals

- **Scheduled-task semantics (#124395)** — add real timer/due-date/release sweep for `scheduled`; likely to gain traction as a low-risk state-machine fix.
- **Cron auto-sync on inference-config change (#61404)** — high-value for drift-avoidance; long-open (since July), P2.
- **Warm-handoff compression (#133625)** — opt-in `compression.warm_handoff: off|on|auto` to reuse prompt cache; sizable feature, still open.
- **Context-limit 400 → compact & retry (#145300)** — port of kilocode fix; small, targeted, likely to land soon.
- **Declared-relay Anthropic thinking replay (#145287)** — unblocks self-hosted relays (CLIProxyAPI) with signed thinking; likely near-term.
- **i18n expansion (#105503, Czech locale)** — steady community-driven localization effort.
- **Plugin catalog ecosystem** — tide context engine, hermes-finance, astro-agents bumps; catalog admission is becoming a recurring PR pattern.

**Prediction:** Small, well-scoped fixes (context-limit compaction #145300, TUI stdin #145288, sudo scoping #145291, Discord typing #145295) are the most likely to merge first; warm-handoff and relay-thinking are larger and may wait for a minor version.

---

## 7. User Feedback Summary

**Pain points:**
- **Automation/session wakes are unreliable on Discord threads** — the single loudest theme, with one user logging thousands of refusals and another noting the attempt cap "never fires." Users are frustrated that `notify-mode=off` and backoff protections don't stop the loop.
- **Providers behind relays/gateways hit contract edge cases** — `key_cmd`+`anthropic_messages` can't deliver `x-api-key`; thinking-block signatures are rejected when replayed through relays.
- **Mutating automation env breaks CLI sessions** — kanban/cron workers inheriting `HERMES_SESSION_SOURCE` fail `session.create` with an opaque "couldn't start the model connection."
- **Security hygiene** — approval-button scope mismatch and un-stripped secrets in child envs are real trust concerns.

**Use cases:** Discord/Telegram group automation with auto-threading, multiplexed multi-profile gateways, cron-driven pipelines with `context_from` chaining, self-hosted Anthropic relays, and third-party plugin catalog submissions.

**Satisfaction signal:** A high closure rate (9 issues + 12 PRs today) and quick fixes on new reports (e.g., #145285 → #145288 within a day) suggest responsive maintenance. Dissatisfaction is concentrated, not diffuse — the gateway admission family is the clear sore spot.

---

## 8. Backlog Watch

Long-unanswered or strategically important items needing maintainer attention:

- **[#61404](https://github.com/NousResearch/hermes-agent/issues/61404)** — Cron auto-sync on global inference-config change (open since **2026-07-09**, P2, 1 comment). Persistent drift-guard friction for cron users.
- **[#122750](https://github.com/NousResearch/hermes-agent/issues/122750)** — Secrets/OAuth keys not stripped from terminal/background/cron child envs (open since **2026-09-25**, P3, security boundary). Related blocklist PRs cover *other* names but not these.
- **[#123923](https://github.com/NousResearch/hermes-agent/issues/123923)** — Anthropic thinking-block duplication on heartbeat continuation (open since **2026-09-26**, P2). Partially addressed by in-flight #145287; worth tracking to closure.
- **[#124395](https://github.com/NousResearch/hermes-agent/issues/124395)** — `scheduled` status lacks timer/due-date/sweep (open since **2026-09-26**, P3). API-contract honesty issue.
- **[#133625](https://github.com/NousResearch/hermes-agent/pull/133625)** — Warm-handoff compression (PR open since **2026-10-06**, P3). Large feature; needs review window or explicit deferral.
- **[#105503](https://github.com/NousResearch/hermes-agent/pull/105503)** — Czech i18n (PR open since **2026-09-08**). Rebased and ready; low-risk merge candidate.
- **The `admission_conflict` cluster (#142461/#143720/#145261)** — despite high comments and reactions, no linked fix PR appears yet. This is the highest-leverage maintenance target: a single root-cause fix in gateway admission/requeue logic would resolve three open P2/P3 reports and reduce daily log spam from thousands of events to near zero.

---

*Digest generated from GitHub activity data for 2026-10-27. All links point to NousResearch/hermes-agent.*

</details>

<details>
<summary><strong>IronClaw</strong> — <a href="https://github.com/nearai/ironclaw">nearai/ironclaw</a></summary>

No activity in the last 24 hours.

</details>

<details>
<summary><strong>QwenPaw</strong> — <a href="https://github.com/agentscope-ai/QwenPaw">agentscope-ai/QwenPaw</a></summary>

# QwenPaw Project Digest — 2026-10-27

## 1. Today's Overview

QwenPaw shows **high-velocity, bug-dominated activity** on 2026-10-26/27: 25 issues updated (17 still open), 48 PRs touched (32 open, 16 merged/closed), and **zero new releases**. The project is in a post-2.2.2 stabilization phase — most traffic is regression fixes, provider-compatibility patches, and infrastructure hardening rather than new features. Maintainer responsiveness is strong (most issues have responses within 24–48h and many already have candidate fix PRs), but the open/active issue ratio (17/25) and a large open-PR queue (32) suggest bandwidth is spread thin across desktop, memory, channels, and provider subsystems. No release today means fixes are accumulating on `main` without a cut, raising risk of a larger, harder-to-bisect release.

## 2. Releases

**None.** No new releases in the last 24h. Fixes referenced below (e.g. #8165, #8062, #8231, #8438) remain unreleased and are only available on `main`/open PR branches.

## 3. Project Progress

Closed/merged items today (16 PRs; notable ones surfaced in the data):

| Item | Type | What it does | Link |
|---|---|---|---|
| #8165 | PR (closed) | Recovers Responses API output sent only on the terminal `response.completed` event — fixes the streaming empty-response bug #8162 | [PR #8165](https://github.com/agentscope-ai/QwenPaw/pull/8165) |
| #8062 | PR (closed) | Keeps healthy embedding vectors when one chunk is over the limit — partial fix for #8040 | [PR #8062](https://github.com/agentscope-ai/QwenPaw/pull/8062) |
| #7923 | PR (closed) | Ages out `tool_result` blocks after `blocks_retention_days` to bound `history.db` growth (~75% of bytes) | [PR #7923](https://github.com/agentscope-ai/QwenPaw/pull/7923) |
| #8162 | Issue (closed) | OpenAI Responses streaming empty-response — resolved by #8165 | [Issue #8162](https://github.com/agentscope-ai/QwenPaw/issues/8162) |
| #7476 | Issue (closed) | Cron duplicate scheduling within `misfire_grace` window | [Issue #7476](https://github.com/agentscope-ai/QwenPaw/issues/7476) |
| #8270 | Issue (closed) | Windows ZIP extraction garbled filenames (missing `encoding` in `ZipFile`) | [Issue #8270](https://github.com/agentscope-ai/QwenPaw/issues/8270) |
| #8351 | Issue (closed) | Composer draft keyed per-agent instead of per-conversation | [Issue #8351](https://github.com/agentscope-ai/QwenPaw/issues/8351) |
| #8286 | Issue (closed) | Thinking strength slider misleading fill / flicker on save | [Issue #8286](https://github.com/agentscope-ai/QwenPaw/issues/8286) |
| #8333 | Issue (closed) | Sidebar group-header overlap with first conversation | [Issue #8333](https://github.com/agentscope-ai/QwenPaw/issues/8333) |
| #4946 | Issue (closed) | Plugin import failure blocks startup 6+ minutes | [Issue #4946](https://github.com/agentscope-ai/QwenPaw/issues/4946) |

**Net progress:** Two memory/storage durability fixes (#8062, #7923), one provider-compat fix (#8165), and a batch of long-lived UI/UX and cron correctness regressions resolved. The #7923 closure is notable — it directly addresses production-scale SQLite bloat.

## 4. Community Hot Topics

Ranked by comment volume:

1. **#8071 — Plugin-facing theme extension point (12 comments, OPEN)** — [link](https://github.com/agentscope-ai/QwenPaw/issues/8071). Plugin authors want semantic token overrides beyond the single `colorPrimary` knob. Signals the plugin ecosystem is maturing past the one-knob limit; likely a Console theming API v2.
2. **#8162 — OpenAI Responses streaming empty response (8 comments, now CLOSED)** — [link](https://github.com/agentscope-ai/QwenPaw/issues/8162). High engagement because it silently killed sessions after 1–3 steps; fixed by #8165.
3. **#8040 — Embedding reindex drops whole batch on one over-limit CJK chunk (6 comments, OPEN)** — [link](https://github.com/agentscope-ai/QwenPaw/issues/8040). Recurrence of #5950; the per-item token vs. character budget mismatch is a design-level issue, not a one-off bug.
4. **#7476 — Cron double-trigger in `misfire_grace` (5 comments, CLOSED)** — [link](https://github.com/agentscope-ai/QwenPaw/issues/7476). Affected backup/data jobs — a correctness bug in a trust-sensitive subsystem.
5. **#8270 — Windows ZIP filename garbling (4 comments, CLOSED)** — [link](https://github.com/agentscope-ai/QwenPaw/issues/8270). Simple root cause (`ZipFile` without `encoding`), broad user impact on Windows.

**Underlying needs:** (a) richer plugin/extension APIs; (b) reliable streaming across heterogeneous OpenAI-compatible providers; (c) memory indexing that degrades gracefully rather than failing whole batches; (d) cron semantics that don't duplicate work.

## 5. Bugs & Stability

Ranked by severity (crashes/data loss > hangs > silent wrong behavior > cosmetic):

| Severity | Issue | Status | Fix PR? |
|---|---|---|---|
| Critical — stalls server | **#8279** Long-lived ReMe watchers exhaust AnyIO thread limiter, stalling synchronous HTTP endpoints | OPEN | No |
| Critical — indefinite hang | **#8435** LLM stream hangs with zero logs when rate-limiter semaphore never releases (watchdog never fires) | OPEN | No |
| Critical — context failure | **#8417** `/compact` always 400s: volcano AgentPlan `glm-5.3-flash` rejects `thinking.type=disabled`; compat layer sends both disable shapes | OPEN | **#8436** (honor declared thinking disable wire) |
| High — task death | **#8312** Context compaction cannot fit request (252,565 > 251,904 tokens), task aborts | OPEN | No |
| High — data integrity | **#8415** `edit_file` converts all CRLF→LF and write-back is lossy UTF-8 from `errors='ignore'` read | OPEN | No |
| High — auth failure | **#8425** Mail monitor builds `name@domain@domain` when `name` is a full address → AUTHENTICATIONFAILED after upgrade | OPEN | **#8438** |
| High — legacy MCP | **#8424** `server/discover` 404 + `-32601` hard-fails negotiation; legacy MCP servers can't fall back to `initialize` | OPEN | No |
| Medium — config | **#8276** ReMe reranker enabled with empty `api_key`; surfaces only as "unexpected error" | OPEN | No |
| Medium — job reliability | **#8123** Daily Paper fails on truncated digest (`ToolJSONDecodeError`); no per-paper retry, whole job errors | OPEN | No |
| Medium — cancellation | **#8440** `cancellable_wait` leaves owned tool task running after outer cancellation | OPEN | **#8441** |
| Low — cosmetic | **#8286** Thinking strength slider fill/flicker | CLOSED | — |

**Takeaways:** Provider-compat bugs (#8417, #8424, #8162-family) are the single largest stability theme. Concurrency/lifecycle bugs (#8279, #8435, #8440) are the most dangerous because they manifest as silent hangs. Only 4 open bugs have named fix PRs — the rest need triage.

## 6. Feature Requests & Roadmap Signals

| Request | Theme | Likelihood in next minor |
|---|---|---|
| **#8071** Plugin-facing semantic theme tokens | Plugin extensibility | High — direct follow-on to #7741 |
| **#8442** Linux desktop parity: `deb` + AppImage, Computer Use (Wayland portal), Chrome Native Messaging | Cross-platform desktop | Medium-High — **PR #8444 already open** |
| **#8439 / #8429** `thinking_level` in `JobRuntimeSpec` (cron) | Cost control / cron autonomy | High — duplicated request, closed-and-refiled deliberately |
| **#8420** Files panel: "Open with default app" / "Reveal in Explorer/Finder" | Desktop UX polish | Medium |
| **#7912** Docs: authenticated MCP web-research example (Baizhi Agent Toolkit) | Documentation / MCP adoption | Medium |

**Prediction:** the next minor will lean on (1) `thinking_level` for cron, (2) Linux desktop artifacts, (3) a plugin theme API beyond `colorPrimary`. Cost/token governance is emerging as a repeated user motivation.

## 7. User Feedback Summary

- **Satisfaction:** Users validate that fallbacks work — #8417 explicitly notes compaction failure preserved old summaries and the `keep-context-after-compact-failure` plugin held the context; #8040 notes the batch log lies ("processed=126/126") while 20 chunks fail. Users are technical enough to root-cause precisely.
- **Dissatisfaction patterns:**
  - *Silent failures* — #8162 ("no prompt, session just breaks"), #8435 ("zero logs"), #8276 ("unexpected error") — the top complaint is diagnosability, not just breakage.
  - *Upgrade regressions* — #8425 ("works before upgrade, config now invalid"), #8176 market provenance loss — configuration and identity continuity across upgrades is weak.
  - *Cross-platform gaps* — #8270 (Windows ZIP), #8442 (Linux has no desktop artifact beyond Docker) — Windows/Linux users feel like second-class citizens vs. macOS.
  - *Lossy file tooling* — #8415 (CRLF and ISO-8859-1 round-tripping) — breaks real-world source files.
- **Use cases named by users:** cron-driven backup pipelines, Daily Paper memory cron, multi-turn tool-calling agents, IMAP/SMTP mail monitoring, MCP remote-server research workflows, plugin theme development, and long-running Docker deployments.

## 8. Backlog Watch

Items needing maintainer attention:

| Item | Age / Status | Why it matters |
|---|---|---|
| **#8040** Embedding batch drop on over-limit CJK chunk | Open since 2026-09-30, recurrence of #5950 | **Recurrence** means the original fix was incomplete; #8062 only addressed part (suggested fix 2). Needs the per-item fallback path fully closed. |
| **#7874** Redesign `pawapp` SDK and app control plane | Open since 2026-09-19, size/XXXL | Large architectural PR with no visible review progress — risks drifting from `main`. |
| **#8376** PowerContext v1.4.0 prepared-context and Artifact APIs | Open since 2026-10-22, first-time contributor, size/XXXL | Community-contributed major backend upgrade; needs reviewer bandwidth. |
| **#8187** Extract channels into plugins with subprocess isolation | Open since 2026-10-12, size/XXXL | Complements the plugin-isolation direction of #4946 (closed) — a strategic refactor. |
| **#7719** Separate model for ReMeLight memory writing | Open since 2026-09-12 | Directly relevant to the token-cost pain users cite; low-cost, high-value. |
| **#8034** Bound inline media per request, not per file | Open since 2026-09-29 | Prevents multi-MB request bodies that token-based eviction cannot catch. |

**Health verdict:** The project is *reactive and responsive* — bugs get answered and several get fixes within days — but the growing backlog of **unreviewed size/L–XXXL PRs** and **recurring memory/cron bugs** indicates a maintenance-bandwidth gap relative to contributor volume. A release cut containing the merged fixes (#8165, #8062, #7923, plus the pending #8436/#8438/#8441) would meaningfully reduce open-bug pressure.

</details>

<details>
<summary><strong>ZeroClaw</strong> — <a href="https://github.com/zeroclaw-labs/zeroclaw">zeroclaw-labs/zeroclaw</a></summary>

# ZeroClaw Project Digest — 2026-10-27

## 1. Today's Overview

ZeroClaw is in a **high-activity, security-focused development phase**. Over the last 24 hours, 23 issues were updated (all still open, zero closed) and 29 PRs saw activity (28 open, only 1 merged/closed), indicating a heavy review queue with limited throughput to merge. A striking cluster of eight security issues (#12043–#12053) was filed on 2026-10-26 by contributor IftekharUddin, all tagged `topic:identity-access`, revealing a concentrated audit of the gateway's authentication, authorization, and CSP surfaces. Simultaneously, the v0.9.0 release train is visibly forming around opt-in OIDC dashboard sign-in (#11965, #11986) and RPC authorization hardening (#11230, #11234, #11289), while v0.8.7 docs updates continue in parallel (#12019). Notably, no new releases shipped today, and the issue backlog continues to grow faster than it is being closed — a signal that triage and merge capacity may be the project's current bottleneck.

## 2. Releases

**No new releases in the last 24 hours.** The latest referenced release in issue/PR metadata is v0.8.7 (release candidate pinned at `5d4b18d335`), with active work also targeting v0.9.0. No breaking changes or migration notes to report today.

## 3. Project Progress

Only **1 PR was merged/closed** in the last 24 hours (of 29 updated), so concrete landed progress is minimal for this window. However, several high-impact PRs advanced through review:

- **PR #12039** — `fix(web): refresh config form after Save all` directly addresses the UI bug reported in #12021 (config group save button remaining highlighted). [[link](https://github.com/zeroclaw-labs/zeroclaw/pull/12039)]
- **PR #12040** — `fix(plugins): admit a component only beside the manifest that described it` supplies a fix for the plugin manifest/generation race in #11562. [[link](https://github.com/zeroclaw-labs/zeroclaw/pull/12040)]
- **PR #11968** — `fix(oidc): form-encode enrollment Basic credentials` fixes an RFC 6749 §2.3.1 compliance gap in OIDC enrollment. [[link](https://github.com/zeroclaw-labs/zeroclaw/pull/11968)]
- **PR #12044** — `feat(runtime): deferred bootstrap sections` introduces opt-in addressable knowledge sections to reduce per-turn context cost. [[link](https://github.com/zeroclaw-labs/zeroclaw/pull/12044)]
- **PR #11986 / #11965** — stacked gateway work bringing scoped dashboard chat and opt-in OIDC sign-in toward v0.9.0. [[#11986](https://github.com/zeroclaw-labs/zeroclaw/pull/11986)] [[#11965](https://github.com/zeroclaw-labs/zeroclaw/pull/11965)]

## 4. Community Hot Topics

The most-discussed items (all at 4 comments) cluster around **runtime correctness**:

- **Issue #10673** — Failed ACP turns not persisted on the daemon RPC path (remaining slice of #9333), S1 workflow-blocking. [[link](https://github.com/zeroclaw-labs/zeroclaw/issues/10673)]
- **Issue #10921** — Qdrant time-bounded vector recall can silently omit eligible results. [[link](https://github.com/zeroclaw-labs/zeroclaw/issues/10921)]
- **Issue #10780** — Proactive token-budget context compaction was removed; `keep_recent`/`collapse_tool_results` are inert. [[link](https://github.com/zeroclaw-labs/zeroclaw/issues/10780)]
- **Issue #10781** — Inert context/history config keys mislead users into expecting token savings. [[link](https://github.com/zeroclaw-labs/zeroclaw/issues/10781)]
- **Issue #11711** — Trimming a long conversation *permanently deletes* older turns from the session store — a data-loss regression. [[link](https://github.com/zeroclaw-labs/zeroclaw/issues/11711)]

**Underlying need:** Users are hitting a wall where context management is both *lossy* (data deletion, dropped recall results) and *opaque* (inert config keys, no proactive compaction). The community wants a memory/context subsystem that is predictable, budget-aware, and non-destructive — this is arguably the project's most acute functional pain point.

The newly filed security cluster (#12043–#12053) has zero comments so far but represents a coordinated audit finding that will likely dominate maintainer attention this week.

## 5. Bugs & Stability

Ranked by severity (S1 highest):

| Severity | Issue | Description | Fix PR? |
|---|---|---|---|
| **S1** | [#10673](https://github.com/zeroclaw-labs/zeroclaw/issues/10673) | Failed ACP turns not persisted on daemon RPC path — workflow blocked | Partial (#9378 covered sibling path) |
| **S2** | [#11711](https://github.com/zeroclaw-labs/zeroclaw/issues/11711) | History trim **permanently deletes** older session turns (data loss) | No |
| **S2** | [#10921](https://github.com/zeroclaw-labs/zeroclaw/issues/10921) | Qdrant recall ignores `since`/`until`, omits eligible results | No |
| **S2** | [#11562](https://github.com/zeroclaw-labs/zeroclaw/issues/11562) | Plugin discovery can pair mismatched manifest/component generation | **Yes — PR #12040** |
| **S2** | [#12045](https://github.com/zeroclaw-labs/zeroclaw/issues/12045) | Responses from user/LLM-controlled URLs fully buffered before size cap (memory exhaustion) | No |
| **S2** | [#12043](https://github.com/zeroclaw-labs/zeroclaw/issues/12043) | `glob_search` silently drops authorized matches; rejects absolute patterns | No |
| **S3** | [#12021](https://github.com/zeroclaw-labs/zeroclaw/issues/12021) | Config save button stays highlighted after Save all | **Yes — PR #12039** |
| **S3** | [#11825](https://github.com/zeroclaw-labs/zeroclaw/issues/11825) | codex_cli test empties process PATH, breaks parallel cargo test | No |

**Security bugs (S2, all filed 2026-10-26):** Login CSRF in OIDC callback (#12050), loopback exemption spoofing via X-Forwarded-For (#12052), SOP privilege escalation via workshop apply (#12051), sign-in flow store exhaustion (#12049), unbounded OIDC bearer verification (#12047), wildcard tool selector leaks operator tools (#12046), unpinned third-party script on `/api/docs` (#12053), and `redirect_uri` built from untrusted Host header (#12048). **None currently have linked fix PRs.**

## 6. Feature Requests & Roadmap Signals

Active feature requests and their likely release targeting:

- **PR #11013 [Tracker]** — Unified file intake/resolver/delivery (accepted RFC #9488 follow-through). Large scope; likely v0.9.x+. [[link](https://github.com/zeroclaw-labs/zeroclaw/issues/11013)]
- **Issue #12022** — Opt-in external rerank stage for memory recall (`/v1/rerank`). [[link](https://github.com/zeroclaw-labs/zeroclaw/issues/12022)]
- **Issue #12054** — Honor runtime-profile thinking levels for OpenAI native reasoning. [[link](https://github.com/zeroclaw-labs/zeroclaw/issues/12054)]
- **Issue #12041** — Bring Gitea/Forgejo support to parity with GitHub forge. [[link](https://github.com/zeroclaw-labs/zeroclaw/issues/12041)]
- **PR #11847** — Native Rust XMPP channel with optional legacy OMEMO (size XL, high risk). [[link](https://github.com/zeroclaw-labs/zeroclaw/pull/11847)]
- **PR #11880 / #11882** — "Goal V1" transport-neutral policy contracts and execution-epoch supervision (explicitly marked *not ready to merge*). [[#11880](https://github.com/zeroclaw-labs/zeroclaw/pull/11880)] [[#11882](https://github.com/zeroclaw-labs/zeroclaw/pull/11882)]

**Prediction:** v0.9.0 will center on **gateway identity/access** (OIDC sign-in, scoped dashboard chat) and **RPC authorization hardening**, given the volume of `release:v0.9.0`-tagged PRs. Memory reranking (#12022) and OpenAI thinking-level support (#12054) are smaller and could land opportunistically. The Goal V1 proposals remain discussion-stage and are unlikely to ship in the immediate next release.

## 7. User Feedback Summary

- **Dissatisfaction — context/memory subsystem:** Users (danieliyahu1, mov-xound-glitch, Audacity88) repeatedly report that advertised config keys do nothing, proactive token-budget compaction is missing, trimming destroys data, and recall returns incomplete results. The tone suggests config-behavior *contract* erosion rather than isolated bugs.
- **Frustration with silent misbehavior:** #12043 (`glob_search` silently dropping results) and #10921 (silent recall omissions) reflect a pattern users dislike: tools that fail quietly rather than loudly.
- **Security-conscious operators:** The identity-access cluster implies real deployment scenarios behind reverse proxies, with OIDC providers and multi-principal agents — feedback that ZeroClaw is being run in non-trivial production-like settings.
- **Third-party scrutiny:** Issue #12042 announces an independent review by Hlido scoring ZeroClaw **79/100**, with a right of reply open — an external quality signal and an opportunity for the maintainers to respond publicly. [[link](https://github.com/zeroclaw-labs/zeroclaw/issues/12042)]
- **Positive signal:** Continued contributions from repeat contributors (IftekharUddin, JordanTheJet, RO-mix, Audacity88) indicate a healthy, engaged contributor base despite merge latency.

## 8. Backlog Watch

Long-unanswered or high-importance items needing maintainer attention:

- **Issue #10673** (created 2026-09-07, S1, 4 comments) — Workflow-blocking ACP persistence gap; open ~7 weeks without a dedicated fix PR. [[link](https://github.com/zeroclaw-labs/zeroclaw/issues/10673)]
- **Issue #10780 / #10781** (created 2026-09-11) — Inert context config keys and missing compaction; #10780 is `status:in-progress` but has no linked PR. [[#10780](https://github.com/zeroclaw-labs/zeroclaw/issues/10780)] [[#10781](https://github.com/zeroclaw-labs/zeroclaw/issues/10781)]
- **PR #11289** (created 2026-09-30) — Stable RPC denial reason identifiers; marked `do-not-merge`, high risk, size XL. [[link](https://github.com/zeroclaw-labs/zeroclaw/pull/11289)]
- **PR #11230 / #11234** (created 2026-09-29) — Session-data tool withholding and queued-session ownership by current authority; both P1, `release-gate`, size XL, awaiting review/stack resolution. [[#11230](https://github.com/zeroclaw-labs/zeroclaw/pull/11230)] [[#11234](https://github.com/zeroclaw-labs/zeroclaw/pull/11234)]
- **PR #11651 / #11601** (created 2026-10-07/10) — Telegram 429 flood-gate and transcription failure classification; both `needs-author-action`, blocking channel reliability. [[#11651](https://github.com/zeroclaw-labs/zeroclaw/pull/11651)] [[#11601](https://github.com/zeroclaw-labs/zeroclaw/pull/11601)]
- **Issue #11013** (created 2026-09-20) — Unified file model tracker; broad scope, only 2 comments. [[link](https://github.com/zeroclaw-labs/zeroclaw/issues/11013)]

**Health note:** The combination of 28 open PRs updated versus 1 merged, 23 open issues with 0 closed, and a brand-new 8-issue security cluster suggests the project would benefit from a maintainer triage/merge push. Contributor enthusiasm is clearly high; the constraint appears to be review bandwidth, not community interest.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*