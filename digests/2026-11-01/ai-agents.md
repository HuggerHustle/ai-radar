# OpenClaw Ecosystem Digest 2026-11-01

> Issues: 496 | PRs: 500 | Projects covered: 5 | Generated: 2026-11-01 00:02 UTC

- [OpenClaw](https://github.com/openclaw/openclaw)
- [Hermes Agent](https://github.com/nousresearch/hermes-agent)
- [IronClaw](https://github.com/nearai/ironclaw)
- [QwenPaw](https://github.com/agentscope-ai/QwenPaw)
- [ZeroClaw](https://github.com/zeroclaw-labs/zeroclaw)

---

## OpenClaw Deep Dive

# OpenClaw Project Digest — 2026-11-01

## 1. Today's Overview

OpenClaw shows **very high activity** on 2026-11-01, with 496 issues and 500 PRs updated in the last 24h. The distribution skews toward open work: 396 of 496 issues remain active/open, and 252 of 500 PRs are still open, indicating a large inbound workload relative to merge throughput (248 PRs merged/closed). No new releases shipped today, so the project is in an inter-release stabilization cycle with multiple P0/P1 crash-loop, session-state, and message-loss regressions under active investigation. A notable cluster of fixes landed or advanced around Unicode handling, Control UI behavior, sandbox/doctor diagnostics, and channel-specific (Telegram/Slack) issues, but several high-severity bugs (e.g., Gateway event-loop blocking from large plugins, shared-state integrity admission failures) still lack merged fixes. Overall project health is **active but strained**: strong contributor engagement alongside a sizable P0/P1 backlog and multiple "needs-maintainer-review" blockers.

## 2. Releases

**None.** No new releases were published in this window. Users on recent versions (2026.9.x through 2026.10.10-beta.3) continue to report version-specific regressions (see Bugs & Stability below), suggesting the next release will largely be a bugfix/stabilization cut.

## 3. Project Progress (Merged/Closed PRs & Resolved Issues)

248 PRs were merged or closed in the last 24h, alongside 100 closed issues. Notable items:

- **Unicode correctness fixes (multiple)**: `fix(ui): normalize canonical Unicode in local search comparisons` ([#189874](https://github.com/openclaw/openclaw/pull/189874)), `fix(oc-path): use last duplicate JSON key to match runtime parsing` ([#189855](https://github.com/openclaw/openclaw/pull/189855)), and `fix(oc-path): avoid reading and editing a different Unicode key` ([#189868](https://github.com/openclaw/openclaw/pull/189868)) — a coordinated push to fix NFC/NFD and duplicate-key mismatches between CLI/UI and runtime parsing.
- **CI/tooling refactors**: `refactor(ci): share ClawHub bootstrap steps` ([#189787](https://github.com/openclaw/openclaw/pull/189787), closed), `perf(test): keep release dispatch origins relative` ([#189872](https://github.com/openclaw/openclaw/pull/189872)).
- **Plugin loading perf**: `refactor(levanto): load decision execution on demand` ([#189803](https://github.com/openclaw/openclaw/pull/189803), closed).
- **Closed issues of note**: `[Bug]: Windows npm update reports missing-module cleanup failures after successful package swap` ([#184658](https://github.com/openclaw/openclaw/issues/184658), CLOSED); `requester settle-wake attempt exhaustion` ([#154252](https://github.com/openclaw/openclaw/issues/154252), CLOSED); legacy memory-core shadow reindex leak ([#136284](https://github.com/openclaw/openclaw/issues/136284), CLOSED).

The merged/closed set is dominated by small-to-medium correctness, docs, and test-hardening changes rather than net-new features, consistent with a stabilization phase.

## 4. Community Hot Topics

| Item | Type | Comments | Link |
|---|---|---|---|
| Gateway blocks for minutes capturing large external plugins (2026.9.6 regression) | Issue (P0) | 66 | [#160959](https://github.com/openclaw/openclaw/issues/160959) |
| Native host exec returns shared-state integrity-admission error (2026.10.5) | Issue (P1) | 22 | [#177656](https://github.com/openclaw/openclaw/issues/177656) |
| Late reclamation commit checkpoint failure leaves agent unavailable after crash | Issue (P0) | 21 | [#166634](https://github.com/openclaw/openclaw/issues/166634) |
| WhatsApp DM replies fail at durable registry handoff after restart | Issue (P1) | 19 | [#161976](https://github.com/openclaw/openclaw/issues/161976) |
| Curated memory roots silently excluded from bootstrap injection | Issue (P0) | 15 (👍2) | [#153426](https://github.com/openclaw/openclaw/issues/153426) |
| SecretRef objects rejected in `mcp.servers[].env` schema | Issue (P2) | 13 (👍5) | [#76493](https://github.com/openclaw/openclaw/issues/76493) |

**Underlying needs analysis:** The top threads reveal three dominant operator concerns: (1) **reliability of long-running gateways** — event-loop blocking, crash-recovery session loss, and state integrity errors on stable releases; (2) **cross-channel message delivery durability** — WhatsApp, Telegram, Slack, and iMessage all appear with post-restart handoff or echo-cache failures; (3) **security/secret management ergonomics** — the SecretRef schema gap (#76493) and the `tools.fs.workspaceOnly` bypass ([#173058](https://github.com/openclaw/openclaw/issues/173058)) signal that operators want security best practices to work without schema-level friction. The memory-provenance ratchet issue (#153426) is notable for its silent, unrecoverable nature — a class of bug that erodes trust more than a loud crash.

## 5. Bugs & Stability

**P0 (crash-loop / UX release blocker):**
- Gateway event-loop blocked for minutes by large plugin capture at startup/republish — **no merged fix**, 66 comments. [#160959](https://github.com/openclaw/openclaw/issues/160959)
- Crash-recovery checkpoint failure permanently disables agent (`chat.history`/`models.list` return UNAVAILABLE) — **no fix PR**. [#166634](https://github.com/openclaw/openclaw/issues/166634)
- Curated memory roots (`MEMORY.md`/`USER.md`) permanently dropped from bootstrap injection by provenance ratchet; no diagnostics/recovery — **needs product + security decision**. [#153426](https://github.com/openclaw/openclaw/issues/153426)
- Built-in `@wecom/wecom-openclaw-plugin` can no longer be installed — **no fix PR**. [#137177](https://github.com/openclaw/openclaw/issues/137177)

**P1 (high-impact regressions):**
- Native host exec returns shared-state integrity-admission error on 2026.10.5, ≥28 failures, no child result — **no fix PR**. [#177656](https://github.com/openclaw/openclaw/issues/177656)
- WhatsApp DM replies fail at durable registry handoff after restart — **needs live repro + security review**. [#161976](https://github.com/openclaw/openclaw/issues/161976)
- `doctor` hangs indefinitely at startup on Linux (all modes) — **no fix PR**. [#187900](https://github.com/openclaw/openclaw/issues/187900)
- `doctor --fix --non-interactive` idles 15+ min in plugin-capture stage (macOS) — related to #160959. [#178359](https://github.com/openclaw/openclaw/issues/178359)
- Gateway RSS grows ~0.1 GiB/h off-heap; internal monitor never fires (2026.9.8 & 2026.10.6) — **no fix PR**. [#182369](https://github.com/openclaw/openclaw/issues/182369)
- Turn claim not released after lane timeout → session wedged 90+ min. [#157255](https://github.com/openclaw/openclaw/issues/157255)
- Transcript idempotency conflict misclassified as model failure, walks full fallback chain. [#177909](https://github.com/openclaw/openclaw/issues/177909)
- Native Codex children advertise tools with no executor; detached failure delivery also fails. [#150822](https://github.com/openclaw/openclaw/issues/150822)
- Android Talk drops live session during tool work. [#131768](https://github.com/openclaw/openclaw/issues/131768)

**Security:**
- `tools.fs.workspaceOnly: true` does not restrict file tools (state root still allowed) — **needs security review**. [#173058](https://github.com/openclaw/openclaw/issues/173058)
- Redaction masks browser `key` parameter, blocking agent self-correction. [#130209](https://github.com/openclaw/openclaw/issues/130209)
- Model fallback notice can leak to external user-facing channels. [#92473](https://github.com/openclaw/openclaw/issues/92473)

**Pattern:** A recurring root cause is the **plugin-capture / prepared-model-runtime republish path** (#160959, #178359, and speed issues like #166526 at ~473s on large state). Fix PRs exist for several UI/friction bugs but **not** for the highest-severity crash-loop and state-integrity issues.

## 6. Feature Requests & Roadmap Signals

- **Cron/automation management**: `feat(cron): filter and sort cron list by schedule kind, status, and trigger` ([#189871](https://github.com/openclaw/openclaw/pull/189871)); `feat(cron): let human owners manage and transfer automations` ([#189749](https://github.com/openclaw/openclaw/pull/189749), marked security-boundary). Automation lifecycle/ownership is clearly an emerging roadmap area.
- **Gateway operator tooling**: `feature(gateway): add suspend status CLI for existing Gateway RPC` ([#181366](https://github.com/openclaw/openclaw/pull/181366)) — completing the cooperative suspension surface.
- **Memory/provider extensibility**: `dreaming` provider in `MemoryPluginCapability` ([#138366](https://github.com/openclaw/openclaw/issues/138366)); memory search timeout/FTS fallback ([#114913](https://github.com/openclaw/openclaw/issues/114913)); Codex GPT-Live WebRTC error surfacing ([#180858](https://github.com/openclaw/openclaw/issues/180858)).
- **UX polish**: progress-draft label from latest commentary ([#132781](https://github.com/openclaw/openclaw/issues/132781)); unified Control UI shimmer ([#189848](https://github.com/openclaw/openclaw/pull/189848)); choice-menu selection consistency ([#189826](https://github.com/openclaw/openclaw/pull/189826)).
- **Security ergonomics**: SecretRef in `mcp.servers[].env` ([#76493](https://github.com/openclaw/openclaw/issues/76493)) — widely upvoted (👍5) and a likely candidate for the next minor.

**Prediction:** The next release will be bugfix-led, with likely inclusions: cron list filtering (#189871), suspend status CLI (#181366), and Control UI consistency fixes (#189848, #189826). SecretRef schema (#76493) and cron ownership transfer (#189749) are larger and likely targeted at a following minor.

## 7. User Feedback Summary

**Pain points:**
- **Restart fragility**: Multiple channels (WhatsApp, Slack, Telegram, iMessage) fail message delivery after gateway restarts — a top recurring complaint. Slack DMs silently dropped for all accounts post-restart ([#131150](https://github.com/openclaw/openclaw/issues/131150)).
- **Doctor/update friction**: `doctor` hangs or runs hundreds of seconds ([#187900](https://github.com/openclaw/openclaw/issues/187900), [#166526](https://github.com/openclaw/openclaw/issues/166526)); update repair blocked by retained package recovery ([#183479](https://github.com/openclaw/openclaw/issues/183479)); `gateway restart` reports false failure while exiting 0 ([#161158](https://github.com/openclaw/openclaw/issues/161158)).
- **Agent behavior loops**: Agents repeatedly call `sessions_yield` with `nothing_pending` ([#180941](https://github.com/openclaw/openclaw/issues/180941)); Telegram agents repeat completed task close-outs ([#166482](https://github.com/openclaw/openclaw/issues/166482), closed).
- **Observability gaps**: Auth profile selection undiagnosable ([#131877](https://github.com/openclaw/openclaw/issues/131877)); missing workboard status-change events ([#116360](https://github.com/openclaw/openclaw/issues/116360), closed).

**Satisfaction signals:** Constructive engagement is high — numerous well-documented repro reports with environment details, and users actively upvoting security/schema gaps. Dissatisfaction concentrates on **silent failures** (memory ratchet #153426, RSS growth #182369, delivery queue dead-letters #112313) where no diagnostics or recovery exist.

## 8. Backlog Watch

Long-lived or repeatedly-updated items needing maintainer attention:

| Item | Age / Status | Why it matters |
|---|---|---|
| [#76493](https://github.com/openclaw/openclaw/issues/76493) SecretRef in `mcp.servers[].env` | Since 2026-05-03, 👍5, needs product+security decision | Blocks security best practice; high community support |
| [#112313](https://github.com/openclaw/openclaw/issues/112313) Dead-lettered outbound queue entries permanent | Since 2026-07-21 | No CLI/RPC/TTL to clear; `health` counts forever |
| [#92473](https://github.com/openclaw/openclaw/issues/92473) Fallback notice leaks to user channels | Since 2026-06-12 | Internal routing disclosure risk |
| [#114913](https://github.com/openclaw/openclaw/issues/114913) Bound memory embeddings before deadline + FTS fallback | Since 2026-07-28, fix-shape-clear | Clear fix shape but unmerged; affects cold-query UX |
| [#131877](https://github.com/openclaw/openclaw/issues/131877) Auth profile first-in-order skipped silently | Since 2026-08-28 | Diagnosability for a security-relevant path |
| [#160959](https://github.com/openclaw/openclaw/issues/160959) Gateway plugin-capture blocking | Since 2026-09-29, P0, 66 comments | Highest-comment issue; root cause of multiple downstream reports |

**Recommendation:** Prioritize #160959 (and its sibling #178359/#166526), #153426, and #76493 — these combine high impact, high visibility, and cross-cutting effects on stability, trust, and security posture.

---

## Cross-Ecosystem Comparison

# Cross-Project Comparison Report — Personal AI Assistant / Agent Open-Source Ecosystem
**Data window:** 2026-11-01 (24h activity snapshot) | **Projects:** OpenClaw, Hermes Agent, IronClaw, QwenPaw, ZeroClaw

---

## 1. Ecosystem Overview

The personal AI assistant / agent open-source landscape on 2026-11-01 is **high-velocity but unevenly matured**, split between a small number of high-traffic "platform-class" projects and a long tail of focused implementations. The dominant theme across all active projects is **stabilization under real-world deployment stress**: every project with activity is fighting security hardening, gateway/session reliability, and channel-integration edge cases — not racing for net-new capabilities. A second structural signal is **security audit pressure** — ZeroClaw is undergoing a coordinated vulnerability sweep, OpenClaw has unresolved P0/P1 security and state-integrity bugs, and QwenPaw has an aging security PR queue. Meanwhile, **mobile/desktop beta surfaces (Hermes) and multi-environment deployment (QwenPaw, ZeroClaw install paths)** are emerging as the new front lines, indicating that agent platforms are moving from "can it think?" to "can it survive production?".

---

## 2. Activity Comparison

| Project | Issues (updated/24h) | PRs (updated/24h) | PR Merge/Close Rate | Releases (24h) | Phase | Health Score |
|---|---|---|---|---|---|---|
| **OpenClaw** | 496 (396 open) | 500 (252 open) | 248 merged/closed (~50%) | None | Inter-release stabilization | **Strained-active** (large P0/P1 backlog, strong contributors) |
| **Hermes Agent** | 50 (48 open) | 50 (5 open) | 45 merged/closed (~90%) | None | Aggressive backlog paydown + mobile beta | **Active-healthy** (clearing backlog, mobile debt rising) |
| **IronClaw** | 0 | 0 | — | None | Dormant | **Inactive** |
| **QwenPaw** | 9 (9 open) | 14 (13 open) | 1 merged/closed (~7%) | None | Triage-heavy, no release cadence | **Responsive-but-accumulating** (fix-to-merge bottleneck) |
| **ZeroClaw** | 22 | 50 (48 open) | 2 merged/closed (~4%) | None | Security audit / v0.9.0 gate | **High-intensity, review-constrained** (p1 PRs aging ~33 days) |

**Key read:** OpenClaw operates an order of magnitude larger than peers (≈10× Hermes volume, ≈20× QwenPaw/ZeroClaw). Hermes leads on *throughput efficiency* (90% PR closure). QwenPaw and ZeroClaw show the classic **review-capacity bottleneck** pattern — high inbound, low merge rate — while ZeroClaw is unique in that its queue is dominated by release-gating security work.

---

## 3. OpenClaw's Position

**Advantages vs. peers:**
- **Scale dominance.** 496 issues / 500 PRs in 24h is ~10× Hermes and ~20–35× QwenPaw/ZeroClaw — OpenClaw is the de-facto reference implementation, which the prompt itself labels "core reference."
- **Cross-channel breadth.** OpenClaw's bug surface spans WhatsApp, Telegram, Slack, iMessage, and WeCom — no peer matches this channel coverage (Hermes is Slack+desktop+mobile; QwenPaw is Telegram/Feishu/QQ; ZeroClaw is MCP-centric).
- **Ecosystem infrastructure.** CI/ClawHub bootstrap tooling, `@wecom/*` plugins, and a dedicated gateway suspension RPC surface indicate a maturing plugin/distribution ecosystem peers lack.

**Technical approach differences:**
- OpenClaw's recurring root cause is the **plugin-capture / prepared-model-runtime republish path** (#160959, #178359, #166526) — its architecture is plugin-heavy and pays a reliability tax for that extensibility.
- Peers are architecturally narrower: ZeroClaw is sandbox/security-first (Seatbelt, MCP trust boundaries), Hermes is gateway-lifecycle-heavy, QwenPaw is channel-integration-heavy.

**Community size comparison (proxy: comment volume):**
- OpenClaw's top issue has **66 comments** and multiple threads at 15–22 comments; Hermes' top thread has 5; QwenPaw's 4; ZeroClaw's 8 (an RFC). OpenClaw's discussion intensity is 5–15× peers, confirming a substantially larger, more vocal operator base — but also a larger blast radius when P0 bugs (memory ratchet #153426, event-loop blocking #160959) go unfixed.

**Positioning verdict:** OpenClaw is the **feature-rich but reliability-strained incumbent** — the project everyone integrates with, and the project whose unresolved P0s define ecosystem-wide risk.

---

## 4. Shared Technical Focus Areas

The following requirements emerge across **multiple** projects, indicating industry-level (not project-specific) gaps:

| Cross-cutting Need | Projects Evidencing It | Specific Manifestations |
|---|---|---|
| **Gateway/session reliability** | OpenClaw, Hermes, ZeroClaw | OpenClaw event-loop blocking (#160959), crash-recovery session loss (#166634); Hermes `state.db get_meta()` watchdog kills (#145999), connection leaks (#147087); ZeroClaw daemon config disclosure (#12142) |
| **Security/secret-management ergonomics** | OpenClaw, ZeroClaw, QwenPaw | OpenClaw SecretRef schema gap (#76493, 👍5) + `workspaceOnly` bypass (#173058); ZeroClaw env inheritance (#12143), loopback admin trust (#12141), Seatbelt escaping (#12137); QwenPaw COM automation bypass (#8028) |
| **Cross-channel message durability post-restart** | OpenClaw, Hermes, QwenPaw | OpenClaw WhatsApp/Slack/Telegram/iMessage handoff failures; Hermes Slack duplicate-event double admission (#147342); QwenPaw Feishu 426 under proxy (#8315), Telegram quoted-context loss (fixed #8338) |
| **Deployment/environment fragility** | QwenPaw, ZeroClaw, OpenClaw | QwenPaw fnOS sandbox crash (#8515), nginx SSE buffering (#8516), Docker EACCES (#8517); ZeroClaw install/update arch-detection (#12153–12156); OpenClaw `doctor` hangs (#187900, #178359) |
| **Silent-failure observability** | OpenClaw, QwenPaw, Hermes | OpenClaw memory-ratchet (#153426), dead-lettered queue (#112313), RSS growth (#182369); QwenPaw false cron success (#8184), intermittent model errors (#8511); Hermes false-negative auth (#130480, 👍2) |
| **MCP as a trust boundary** | ZeroClaw, OpenClaw, QwenPaw | ZeroClaw stdio env inheritance (#12143) + SSE bearer-token redirect (#12146); OpenClaw MCP SecretRef schema (#76493); QwenPaw legacy MCP handshake hard-fail (#8424) |
| **Cron/automation lifecycle management** | OpenClaw, Hermes | OpenClaw cron filter/sort (#189871) + ownership transfer (#189749); Hermes cron metadata (#68482, open 3.5 months) |

**Synthesis:** The ecosystem has converged on a common truth — **the hard problems are no longer model capability, but state integrity, credential scoping, environment portability, and diagnosability of silent failures.** These are the four categories with zero fully-resolved implementations across any project.

---

## 5. Differentiation Analysis

| Dimension | OpenClaw | Hermes Agent | QwenPaw | ZeroClaw |
|---|---|---|---|---|
| **Feature focus** | Broadest: multi-channel, plugins, memory, cron, gateway ops | Gateway lifecycle + mobile/desktop UX + multi-agent kanban | Channel integrations + enterprise deployment (Feishu/proxy) | Sandbox/security hardening + MCP transport + OIDC |
| **Target users** | Power operators, plugin developers, multi-channel fleet managers | Mobile-first individual users, local-model runners (llama.cpp/MLX) | Enterprise/institutional (Feishu, on-prem NAS, nginx) | Security-conscious self-hosters, audited deployments |
| **Technical architecture** | Plugin-heavy runtime, prepared-model republish path, Control UI | Gateway + supervised installs, state.db + FTS5, Android/desktop clients | Channel adapter layer, Hub Docker runtime, provider/cache params | Seatbelt sandbox, POSIX command-splitting, daemon authority model |
| **Security posture** | Reactive (multiple open security bugs, needs-review tagged) | Moderate (git-flag bypass fixed #136527, lifecycle guard gap #144547) | Reactive (COM bypass PR #8028 aging) | Proactive audit (10+ coordinated vuln reports, reference implementations offered) |
| **Release discipline** | Bugfix-led stabilization cuts | Git-only fixes (no stable upgrade path from v0.22.5) | No release vehicle for in-flight fixes | v0.9.0 release-gated, blocked on security PRs |
| **Unique differentiator** | Ecosystem scale + ClawHub plugin distribution | Agent-assisted bug filing (agents file their own issues) | Enterprise deployment tuning | Mature audit cycle with downstream-fork vulnerability discovery |

**Insight:** ZeroClaw is the only project treating security as a *release gate* rather than a backlog item — its p1 PRs (#11234, #11230, #11220, #11313) gate v0.9.0's authorization model. This is the healthiest security posture in the set, even though its merge rate (4%) looks worst on paper. OpenClaw and QwenPaw, by contrast, carry security work that *should* gate a release but doesn't.

---

## 6. Community Momentum & Maturity

**Activity tiers:**

- **Tier 1 — Platform scale (OpenClaw):** 5–20× peer volume. Momentum is *sustained but strained*: 50% PR closure rate is respectable at this scale, but 396 open issues and multiple unmerged P0s signal bloat risk. Maturity: high feature maturity, **uneven operational maturity**.
- **Tier 2 — Rapid iteration (Hermes, ZeroClaw):** Both at ~50 PRs/24h, but for opposite reasons. **Hermes is *draining* a backlog** (90% closure — mature triage, aggressive maintenance). **ZeroClaw is *accumulating* one** (4% closure — review capacity is the constraint, not contributor effort). Hermes is post-stabilization-spurt; ZeroClaw is mid-audit.
- **Tier 3 — Responsive micro-project (QwenPaw):** 14 PRs, 1 closed. High responsiveness to individual reports (same-day fix PRs like #8519→#8517, #8522→#8516) but **systematic merge latency** — a cluster of security/quality PRs from one contributor (#8028, #8029, #8031, #8034, #8060, #8061) has aged >1 month.
- **Tier 4 — Dormant (IronClaw):** Zero activity. No signal to assess.

**Maturity ranking (operational):**
1. **ZeroClaw** — cleanest audit discipline, but review-constrained.
2. **Hermes** — healthiest throughput, but mobile beta is pre-GA unstable and stable users are stranded on v0.22.5.
3. **OpenClaw** — feature-mature, operationally strained; largest risk surface.
4. **QwenPaw** — responsive but structurally blocked on merge velocity.
5. **IronClaw** — inactive.

**Rapidly iterating:** Hermes (backlog), ZeroClaw (security). **Stabilizing:** OpenClaw, QwenPaw.

---

## 7. Trend Signals

Extracted from cross-project community feedback — highest value for AI agent developers:

1. **Operators now judge agents on silent-failure diagnostics, not raw capability.** ZeroClaw, OpenClaw, QwenPaw, and Hermes all have trust-eroding "silent success/failure" bugs (false cron success #8184, memory ratchet #153426, dead-letter queues #112313, false-negative auth #130480). **Signal:** ship structured health/diagnostic surfaces and recovery CLIs *before* features. Projects that make failures loud will win operator trust.

2. **MCP is becoming a security perimeter that no project handles rigorously yet.** Three projects report MCP credential-exposure paths (ZeroClaw env inheritance + token redirect; OpenClaw SecretRef schema gap; QwenPaw legacy hard-fail). **Signal:** MCP transport hardening (env scrubbing, origin validation, graceful protocol downgrade) is an unclaimed leadership opportunity.

3. **Environment portability is the #1 unsolved deployment problem.** Proxy/NO_PROXY, nginx SSE buffering, NAS/sandboxed home-dir resolution, musl/glibc install detection, Docker non-root ownership — a cross-project pattern of "works on localhost, breaks in production." **Signal:** invest in environment-detection and self-diagnostics (`doctor`-style) as first-class features; QwenPaw and ZeroClaw are testing this the hard way.

4. **Restart durability is the durability requirement of 2026.** Every active project has post-restart message-delivery or session-state failures. **Signal:** durable registry/handoff design (not just in-memory state) is table stakes; teams should treat "survives restart with zero message loss" as a release criterion.

5. **Install/update paths are under-tested and disproportionately generate churn.** ZeroClaw filed four installer bugs in one day; OpenClaw has update-repair friction (#183479) and false-failure restarts (#161158). **Signal:** the onboarding/upgrade funnel deserves the same test investment as core agent logic.

6. **Automation lifecycle (cron ownership, metadata, transfer) is emerging as a roadmap area.** Both OpenClaw (cron filter/sort #189871, ownership transfer #189749) and Hermes (cron metadata #68482, open 3.5 months) show users scaling from one-off tasks to *fleets* of scheduled automations. **Signal:** multi-tenant automation management will become a differentiator.

7. **Agent-assisted development workflows are real.** Hermes agents file their own bug reports with human review (#147321, #147323, #146558, #145162), and ZeroClaw's reporter supplied reference-implementation fixes (#12158). **Signal:** the highest-leverage contributors are self-hosting agents; design contribution paths (issue templates, PR automation) that accommodate agent-authored input.

8. **Review capacity, not contributor supply, is the binding constraint.** QwenPaw and ZeroClaw both show aging, ready-for-review PRs (10 workflows stalled 1+ month; ZeroClaw p1 release-gate PRs 33 days old) while fresh PRs arrive daily. **Signal:** maintainer tooling / automated review / trusted-reviewer delegation is the ecosystem's most under-invested infrastructure — and the biggest contributor-retention risk.

---

*Report compiled from 2026-11-01 project digests. All metrics reflect the 24-hour activity window; "health score" is a qualitative composite of activity, closure rate, unresolved high-severity items, and release cadence.*

---

## Peer Project Reports

<details>
<summary><strong>Hermes Agent</strong> — <a href="https://github.com/nousresearch/hermes-agent">nousresearch/hermes-agent</a></summary>

# Hermes Agent — Project Digest
**Date: 2026-11-01** | Source: github.com/nousresearch/hermes-agent

---

## 1. Today's Overview

Hermes Agent shows **very high activity** with 50 issues and 50 PRs updated in the last 24 hours, though only 2 issues were closed and no new releases shipped. The PR throughput is the standout signal: 45 of 50 PRs were merged or closed today, a strong indication that the maintainer team (and possibly an automated merge pipeline) is aggressively clearing a backlog — many of the merged PRs were opened on 2026-10-09 through 2026-10-13. Meanwhile, the issue tracker is accumulating debt: 48 of 50 updated issues remain open, with a heavy concentration of bugs in the **Android beta**, **gateway lifecycle**, and **desktop** surfaces filed today. The project appears to be in an active stabilization phase for mobile while simultaneously paying down a long tail of CLI/gateway correctness fixes. No new releases means users on stable (v0.22.5) are receiving fixes only via git, which may be a growing friction point.

---

## 2. Releases

**None.** No new releases were published in the last 24 hours. Users on stable v0.22.5 (2026.9.24) have no upgrade path to today's merged fixes short of tracking git.

---

## 3. Project Progress

45 PRs were merged/closed today — an unusually large batch, dominated by a single prolific contributor (`yoyodine-industries`) landing a series of correctness and safety fixes across CLI, gateway, cron, and kanban subsystems.

**Notable merged/closed work:**

- **Gateway anti-skew gate** — [PR #136343](https://github.com/NousResearch/hermes-agent/pull/136343): prevents a long-lived gateway service from serving a frozen mixed revision after a checkout rewrite (P1).
- **Terminal process-handle contract** — [PR #136308](https://github.com/NousResearch/hermes-agent/pull/136308): makes `posix_spawn` local handles safe for the process registry and puts the contract under the type checker (P2).
- **Security: git global-flag approval bypass** — [PR #136527](https://github.com/NousResearch/hermes-agent/pull/136527): closes a whole-family bypass where `git -C <dir> push --force` defeated destructive-verb rules (P3/security).
- **Session model restore fix** — [PR #135953](https://github.com/NousResearch/hermes-agent/pull/135953): resumed sessions now follow profile config instead of a stale cached model pin (P2).
- **state.db auto-maintenance** — [PR #137517](https://github.com/NousResearch/hermes-agent/pull/137517): reaps orphan message rows and merges both FTS5 indexes (P2/session-state).
- **Kanban concurrency + safety** — [PR #137662](https://github.com/NousResearch/hermes-agent/pull/137662) (per-board spawn cap), [PR #136280](https://github.com/NousResearch/hermes-agent/pull/136280) (mass-crash reclaim sweep must abort and fail loud), [PR #136253](https://github.com/NousResearch/hermes-agent/pull/136253) (board-scoped dispatch fence).
- **`.hermes.md` write guard** — [PR #137554](https://github.com/NousResearch/hermes-agent/pull/137554): adds protected-instruction allowlist dirs for the priority-1 project-context file.

**Still open, awaiting merge:**
- [PR #146720](https://github.com/NousResearch/hermes-agent/pull/146720) — preserve Hermes skill slug during Claude OAuth identity rewriting (P2).
- [PR #147370](https://github.com/NousResearch/hermes-agent/pull/147370) — configurable `display.json_output` default.
- [PR #147369](https://github.com/NousResearch/hermes-agent/pull/147369) — backup: skip files removed after scan instead of failing.
- [PR #147034](https://github.com/NousResearch/hermes-agent/pull/147034) — kanban worker import isolation (`PYTHONSAFEPATH=1`).

**Assessment:** Progress is real but skewed. The merged backlog is largely long-standing maintenance work rather than today's newly-reported mobile/desktop bugs, which haven't yet attracted fix PRs.

---

## 4. Community Hot Topics

| Item | Comments | Signal |
|---|---|---|
| [#147269](https://github.com/NousResearch/hermes-agent/issues/147269) Android beta at Firebase tester limit | 5 | **Demand exceeds supply** — the public beta is full. |
| [#147321](https://github.com/NousResearch/hermes-agent/issues/147321) Android scrolling stutter / long replies unscrollable | 4 | Core mobile UX broken. |
| [#144547](https://github.com/NousResearch/hermes-agent/issues/144547) Lifecycle guard blocks `gateway restart` but not `hermes update` | 4 | Safety/security hole in supervised installs. |
| [#145162](https://github.com/NousResearch/hermes-agent/issues/145162) *(closed)* desktop preview viewer requests never answered | 4 | Resolved today. |
| [#68482](https://github.com/NousResearch/hermes-agent/issues/68482) Cron metadata fields (tags/category/description) | 3 | Long-running feature ask (since July). |
| [#41659](https://github.com/NousResearch/hermes-agent/issues/41659) mlx-whisper as first-class STT provider | 3 | Apple Silicon GPU underutilized. |
| [#130480](https://github.com/NousResearch/hermes-agent/issues/130480) Anthropic "Not connected" false negative | 2 (+2 👍) | Highest reaction count; auth/UX mismatch. |

**Underlying needs:**
1. **Mobile is now the front line.** Three of the top issues are Android beta problems, and the tester-limit issue implies product-market fit exceeding the distribution channel's capacity — a good problem to have, but one that will frustrate early adopters.
2. **Install/update safety** is a recurring theme: users running supervised gateways want lifecycle commands to be consistently guarded.
3. **Metadata & discoverability** (cron grouping, model quantization legibility on mobile) reflects users scaling from one-off use to fleets of jobs/agents.

---

## 5. Bugs & Stability

Ranked by severity/impact:

**P1 / Critical**
- **[#136343](https://github.com/NousResearch/hermes-agent/pull/136343)** *(merged today)* — gateway dispatcher could serve a mixed frozen revision during checkout rewrites. Fixed.

**P2 / High**
- **[#145999](https://github.com/NousResearch/hermes-agent/issues/145999)** — Gateway event loop blocks on `state.db get_meta()` in post-turn hooks; 30s liveness watchdog kills the process and fences in-flight turns as `unknown`. **No fix PR yet.** Affects session integrity.
- **[#147087](https://github.com/NousResearch/hermes-agent/issues/147087)** — Soft cache eviction leaks one SQLite connection per evicted agent in long-lived `gateway run`. **No fix PR.**
- **[#146645](https://github.com/NousResearch/hermes-agent/issues/146645)** — `delegate_task` model_map refuses task on primary credential failure without trying fallbacks. **No fix PR.**
- **[#146558](https://github.com/NousResearch/hermes-agent/issues/146558)** — Keyless Exa `web_extract` silently truncates every page at 3,000 chars. **No fix PR.**

**P3 / Mobile & Desktop (new today)**
- **[#147321](https://github.com/NousResearch/hermes-agent/issues/147321)** — Android scrolling stutter; long streamed replies unscrollable.
- **[#147323](https://github.com/NousResearch/hermes-agent/issues/147323)** — Android app `OutOfMemoryError` crash after ~1 hour of mixed voice/text use. **Memory leak suspected — serious.**
- **[#147345](https://github.com/NousResearch/hermes-agent/issues/147345)** — No completion notification after final reply (thinking notification works).
- **[#147361](https://github.com/NousResearch/hermes-agent/issues/147361)** — Mobile chat WebSocket always 403 on remote gateway (Origin-less subprotocol ticket rejected).
- **[#147354](https://github.com/NousResearch/hermes-agent/issues/147354)** — Desktop read-aloud ~5.5s dead air per sentence with file-based TTS providers.
- **[#147350](https://github.com/NousResearch/hermes-agent/issues/147350)** — Empty/non-mapping `config.yaml` read as `{}`; raw write-back overwrites user config with a stub. **Data-loss risk.**

**Regression-class**
- **[#147364](https://github.com/NousResearch/hermes-agent/issues/147364)** — Subdirectory `AGENTS.md` hint re-sent every turn after agent rebuild (context bloat).
- **[#147342](https://github.com/NousResearch/hermes-agent/issues/147342)** — Duplicate Slack event → double admission + duplicate turn execution.
- **[#147366](https://github.com/NousResearch/hermes-agent/issues/147366)** — Kanban gateway shutdown wrongly consumes a task's failure budget.

**Fix PRs open:** [#147369](https://github.com/NousResearch/hermes-agent/pull/147369) (backup), [#147042](https://github.com/NousResearch/hermes-agent/pull/147042) (final newline on copy), [#147034](https://github.com/NousResearch/hermes-agent/pull/147034) (kanban import isolation).

**Assessment:** The mobile beta is exhibiting classic pre-GA instability (OOM, WS 403, notification gaps). The config-overwrite bug (#147350) and the gateway liveness watchdog (#145999) are the most concerning non-mobile items.

---

## 6. Feature Requests & Roadmap Signals

| Request | Issue | Likelihood in next version |
|---|---|---|
| Cron job metadata (tags/category/description) | [#68482](https://github.com/NousResearch/hermes-agent/issues/68482) | Medium — open since July, steady interest, low risk. |
| mlx-whisper first-class STT provider for Apple Silicon | [#41659](https://github.com/NousResearch/hermes-agent/issues/41659) | Medium-High — Apple Silicon is the dominant platform; strong perf win. |
| One-click AI prompt enhancement in desktop input | [#135931](https://github.com/NousResearch/hermes-agent/issues/135931) | Low-Medium — UX polish, depends on desktop roadmap. |
| File-browser rail follows session working directory | [#147351](https://github.com/NousResearch/hermes-agent/issues/147351) | Low-Medium — cross-surface consistency request. |
| Better contrast for context-usage toast | [#147344](https://github.com/NousResearch/hermes-agent/issues/147344) | High — trivial a11y fix, good first-issue candidate. |
| Configurable JSON output default | [PR #147370](https://github.com/NousResearch/hermes-agent/pull/147370) | Medium — already has a PR; useful for automation/cron users. |

**Prediction:** The next release will most likely bundle the just-merged gateway/CLI/kanban hardening plus the Android beta fixes (OOM, scroll, notifications), since mobile demand clearly outpaces supply. STT/Apple Silicon work is the most plausible *new feature* to land.

---

## 7. User Feedback Summary

**Pain points (dissatisfaction):**
- **Beta access is saturated** — [#147269](https://github.com/NousResearch/hermes-agent/issues/147269) users explicitly blocked at the Firebase tester limit. Frustration at the gate, not the product.
- **Mobile reliability** — stutter, OOM crashes, missing completion notifications, and WS 403 render the beta hard to use for real work ([#147321](https://github.com/NousResearch/hermes-agent/issues/147321), [#147323](https://github.com/NousResearch/hermes-agent/issues/147323), [#147345](https://github.com/NousResearch/hermes-agent/issues/147345), [#147361](https://github.com/NousResearch/hermes-agent/issues/147361)).
- **Config safety fear** — [#147350](https://github.com/NousResearch/hermes-agent/issues/147350) describes silent overwrite of a user's entire config, the kind of bug that erodes trust.
- **False-negative auth status** — [#130480](https://github.com/NousResearch/hermes-agent/issues/130480) (2 👍, highest reaction) users see "Not connected" while the account is actively working.

**Positive signals / use cases:**
- Notably, several reports were **filed by Hermes agents themselves** ([#147321](https://github.com/NousResearch/hermes-agent/issues/147321), [#147323](https://github.com/NousResearch/hermes-agent/issues/147323), [#146558](https://github.com/NousResearch/hermes-agent/issues/146558), [#145162](https://github.com/NousResearch/hermes-agent/issues/145162)) with human review — a strong sign of real dogfooding and an emerging agent-assisted bug-reporting workflow.
- Users run **local models** (Qwen3.6 via llama.cpp) and mix voice/text on mobile — the product is being pushed well beyond chat.
- Desktop preview, Slack integration, and kanban multi-agent workflows are all in active production use, judging by the specificity of the reports.

**Overall sentiment:** Engaged and technically sophisticated user base, excited by capability but exposed to rough edges on mobile and in supervised/gateway deployments.

---

## 8. Backlog Watch

Items needing maintainer attention — long-open or high-impact with no visible resolution:

- **[#68482](https://github.com/NousResearch/hermes-agent/issues/68482)** — Cron metadata fields. Open since **2026-07-21** (~3.5 months), silently aging with no maintainer label movement.
- **[#41659](https://github.com/NousResearch/hermes-agent/issues/41659)** — mlx-whisper STT provider. Open since **2026-06-08** (~5 months). High-value perf request on the dominant platform; deserves a decision (accept/defer/close).
- **[#35115](https://github.com/NousResearch/hermes-agent/issues/35115)** — Mobile model picker truncates quantization names. Open since **2026-05-30**, and today's mobile-beta surge makes it *more* relevant, not less.
- **[#130480](https://github.com/NousResearch/hermes-agent/issues/130480)** — Anthropic auth-status false negative. Open since **2026-10-01**, 2 👍; cross-component (desktop/dashboard/credential pool) so it likely needs an owner.
- **[#144547](https://github.com/NousResearch/hermes-agent/issues/144547)** — Lifecycle guard gap for `hermes update` on supervised gateways (security-tagged, opened 2026-10-25, 4 comments). No PR linked; a clear safety hole in the install/update path.
- **[#145999](https://github.com/NousResearch/hermes-agent/issues/145999)** — Gateway watchdog kills process / fences turns as `unknown` (P2, opened 2026-10-28). Session-integrity impact, no fix PR yet.

**Recommendation:** Prioritize assigning owners to the four P2 gateway/session bugs (#145999, #147087, #146645, #146558) and to the mobile OOM (#147323), as these carry the highest user-impact-to-effort ratio and currently lack fix PRs.

---

*Digest generated from GitHub activity snapshot for 2026-11-01. Comment counts and reactions as reported in source data; "undefined" comment counts on PRs reflect missing fields in the source export.*

</details>

<details>
<summary><strong>IronClaw</strong> — <a href="https://github.com/nearai/ironclaw">nearai/ironclaw</a></summary>

No activity in the last 24 hours.

</details>

<details>
<summary><strong>QwenPaw</strong> — <a href="https://github.com/agentscope-ai/QwenPaw">agentscope-ai/QwenPaw</a></summary>

# QwenPaw Project Digest — 2026-11-01

## 1. Today's Overview

QwenPaw shows **elevated triage activity but no release cadence**: 9 issues and 14 PRs were touched in the last 24 hours, yet zero new releases shipped and only 1 PR closed. The issue queue is entirely open (9/9 active, 0 closed), signaling that incoming reports are outpacing resolution. A clear cluster of **channel-integration and deployment-environment bugs** (Feishu proxy/model-config, Hub Docker permissions, fnOS sandbox startup crash, nginx SSE buffering) dominates today's surface, suggesting the project is under stress from real-world deployment diversity rather than core agent logic. On the positive side, community contribution velocity is healthy — multiple `first-time-contributor` PRs arrived today (#8522, #8520), and several targeted fix PRs already map to today's bugs. Overall health: **active and responsive, but accumulating unresolved stability debt with no release to drain it.**

---

## 2. Releases

**None.** No new versions were published in the last 24 hours. This is notable given the volume of bug reports referencing recent versions (v2.2.2.post1, v2.3.0-beta.1/b2), meaning fixes in flight (e.g., #8522, #8519) have no release vehicle yet.

---

## 3. Project Progress

Only **one PR closed/merged** today:

- **#8338 [CLOSED] fix(channels): carry Telegram quoted reply context into the agent** — [PR #8338](https://github.com/agentscope-ai/QwenPaw/pull/8338). This resolves a parity gap where the Telegram adapter dropped `message.reply_to_message`, leaving the agent blind to quoted context (a behavior Feishu already handled via `parent_id`). A user-facing correctness fix for the Telegram channel.

**Advancing but still open:**
- #8522 (SSE nginx buffering fix) directly addresses issue #8516 filed today.
- #8519 (Hub Docker runtime ownership fix) maps to issue #8517 filed today.
- #8409 (QQ C2C streaming messages) and #8060/#8061 (Anthropic cache token accounting, OpenAI prompt-cache params) continue provider/channel maturity.

Net: progress is real but **fix-to-merge latency remains the bottleneck**.

---

## 4. Community Hot Topics

Ranked by comment activity (reactions are uniformly 0, indicating low emoji engagement but substantive discussion):

| Item | Comments | Link |
|------|----------|------|
| #8424 MCP legacy handshake hard-fail | 4 | [Issue #8424](https://github.com/agentscope-ai/QwenPaw/issues/8424) |
| #8315 Feishu 426 under proxy | 4 | [Issue #8315](https://github.com/agentscope-ai/QwenPaw/issues/8315) |
| #8184 Doom-loop gate false positive | 3 | [Issue #8184](https://github.com/agentscope-ai/QwenPaw/issues/8184) |
| #8511 Feishu "No active model configured" | 2 | [Issue #8511](https://github.com/agentscope-ai/QwenPaw/issues/8511) |
| #8517 Hub Docker permission denied | 2 | [Issue #8517](https://github.com/agentscope-ai/QwenPaw/issues/8517) |

**Underlying needs analysis:**
- **Protocol robustness (#8424):** Users run *legacy-only MCP servers*. The client's `_negotiate()` treats `404 + -32601` as a definitive "modern server, unknown method" signal rather than a fallback cue — a design rigidity that breaks backward compatibility. Demand: graceful protocol downgrade.
- **Network-environment resilience (#8315, #8516):** Two separate issues stem from corporate/proxy/nginx deployments. Feishu fails without `NO_PROXY`; SSE streams buffer behind nginx. This is a **deployment-ergonomics theme**: QwenPaw assumes a clean network path that many enterprise users don't have.
- **Agent-loop trust (#8184):** The doom-loop gate is killing *legitimate* long-polling patterns and then recording false cron success. This touches core agent reliability — arguably the most consequential topic, since it affects task correctness, not just connectivity.

---

## 5. Bugs & Stability

Ranked by severity (impact × blast radius):

**🔴 Critical**

1. **#8515 v2.3.0b2 startup crash in restricted sandbox (fnOS)** — [Issue #8515](https://github.com/agentscope-ai/QwenPaw/issues/8515). `dependency_maintenance.state_root()` prioritizes `pwd.getpwuid(...).pw_dir` over `$HOME`, and the env override `QWENPAW_DEPENDENCY_STATE_DIR` is undocumented. **Crash at import time**, process cannot start. Affects all sandboxed/containerized deployments where home differs from passwd. *No fix PR yet.* This is the most severe today.

2. **#8184 Doom-loop gate kills legitimate polling + false cron success** — [Issue #8184](https://github.com/agentscope-ai/QwenPaw/issues/8184). Silent **task-correctness failure**: authorized background polling is terminated and recorded as success. Long-standing (opened 2026-10-12), still open. *No fix PR.*

**🟠 High**

3. **#8424 MCP legacy servers unusable** — [Issue #8424](https://github.com/agentscope-ai/QwenPaw/issues/8424). Hard-fail instead of legacy handshake fallback; breaks entire class of MCP integrations.

4. **#8517 Hub Docker runtime `EACCES` on `working/config.json` as non-root** — [Issue #8517](https://github.com/agentscope-ai/QwenPaw/issues/8517). Container writes config as root; atomic inode replacement defeats ownership. **Fix PR exists: [#8519](https://github.com/agentscope-ai/QwenPaw/pull/8519).**

5. **#8315 Feishu channel 426 Upgrade Required under injected proxy** — [Issue #8315](https://github.com/agentscope-ai/QwenPaw/issues/8315). Complete Feishu channel failure (WebSocket + token requests) when `NO_PROXY` omits `feishu.cn`.

**🟡 Medium**

6. **#8511 Intermittent `ProviderError: No active model configured`** on concurrent Feishu messages — [Issue #8511](https://github.com/agentscope-ai/QwenPaw/issues/8511). Race condition under message concurrency; reproduced on both beta and stable.

7. **#8516 SSE missing `X-Accel-Buffering: no` behind nginx** — [Issue #8516](https://github.com/agentscope-ai/QwenPaw/issues/8516). First event buffered; every other SSE endpoint sets the header except `/console/chat`. **Fix PR exists: [#8522](https://github.com/agentscope-ai/QwenPaw/pull/8522).**

**🟡 UX**

8. **#8521 Missing reply content + Ctrl+C needs multiple presses + slower new UI** — [Issue #8521](https://github.com/agentscope-ai/QwenPaw/issues/8521). Frequent "thinking-only, no answer" responses; copy-to-clipboard requires repeated Ctrl+C in Chrome & Edge; regression vs. old UI. *No fix PR.*

*Also relevant (open fix PRs): #8028 flags inline Office COM automation bypass in security — [PR #8028](https://github.com/agentscope-ai/QwenPaw/pull/8028).*

---

## 6. Feature Requests & Roadmap Signals

- **#8518 Per-reply latency display in Console chat UI** — [Issue #8518](https://github.com/agentscope-ai/QwenPaw/issues/8518). Users currently see token totals (`/history`, Settings → Token Consumption) but no timing. Low-cost, high-visibility observability feature — **likely candidate for next minor release**.
- **#8521 Request for old-UI toggle / UI switch button** — [Issue #8521](https://github.com/agentscope-ai/QwenPaw/issues/8521). User explicitly prefers the legacy UI, citing sluggishness and awkward model-switching with large empty areas. This is a **regression-as-feature-request**; a UI toggle is a plausible roadmap item but reflects dissatisfaction with the v2.3 redesign.
- **Ongoing feature PRs signaling roadmap:** #8409 QQ C2C streaming (channel expansion), #8061 custom-gateway OpenAI prompt-cache params, #8029 configurable Playwright launch args (extension support). These indicate the roadmap is pushing **provider/channel breadth** and **deployment configurability**.

**Prediction:** Latency display (#8518) and the SSE/proxy fixes are the most likely near-term ship-able items; a UI-toggle is heavier and more likely to land behind design review.

---

## 7. User Feedback Summary

**Pain points (ranked by frequency/thematic weight):**

1. **Deployment fragility is the dominant theme** — proxy/NO_PROXY handling, nginx buffering, Docker non-root permissions, and sandboxed NAS environments. Users deploying QwenPaw beyond a laptop are repeatedly hitting configuration-sensitive failures. This suggests insufficient "environments other than localhost" testing.
2. **Silent/ambiguous failures erode trust** — #8184 (false cron success), #8424 (no fallback), #8511 (intermittent model errors), #8521 (thinking without answering). Users can't tell whether the agent failed, is waiting, or succeeded.
3. **UI regression dissatisfaction** — #8521 shows a user actively preferring the older interface; sluggishness and cramped model-switching are cited. Clipboard reliability (Ctrl+C) is a basic ergonomic failure.
4. **Positive signal:** Users are investing effort in detailed, well-structured bug reports (repro steps, version tags, root-cause analysis in #8515 and #8517), indicating an engaged, technically sophisticated community rather than churn.

**Satisfaction:** Mixed. Core capability is valued enough to warrant deep integration, but the volume of environment-specific breakage and UX regressions is a churn risk.

---

## 8. Backlog Watch

Long-lived or high-importance items needing maintainer attention:

| Item | Age | Status | Why it matters |
|------|-----|--------|----------------|
| [#7211 fix(runtime): prevent injected context from persisting](https://github.com/agentscope-ai/QwenPaw/pull/7211) | Opened 2026-08-21 (~10 weeks) | `Under Review`, `ready-for-human-review`, first-time contributor | Correctness fix for context leakage (#6360/#6358); tagged ready but stalled. Stale-review risk. |
| [#8034 fix(providers): bound inline media per request](https://github.com/agentscope-ai/QwenPaw/pull/8034) | Opened 2026-09-29 (~5 weeks) | Open, `size/XL`, Under Review | Prevents multi-MB request bodies / gateway byte-limit failures — a real production scaling bug. |
| [#8184 Doom-loop false positive](https://github.com/agentscope-ai/QwenPaw/issues/8184) | Opened 2026-10-12 | Open, 3 comments, no PR | Correctness-critical; unresolved for ~3 weeks. |
| [#8315 Feishu proxy 426](https://github.com/agentscope-ai/QwenPaw/issues/8315) | Opened 2026-10-19 | Open, 4 comments, no PR | Blocks all enterprise-proxied Feishu use; no fix assigned. |
| [#8031 test: stop leaking unawaited coroutines](https://github.com/agentscope-ai/QwenPaw/pull/8031) / [#8029](https://github.com/agentscope-ai/QwenPaw/pull/8029) / [#8028](https://github.com/agentscope-ai/QwenPaw/pull/8028) | ~5 weeks old | Open, RerankerGuo batch | A cluster of quality/security PRs from the same author aging without merge. |

**Key concern:** A notable set of quality-focused PRs from repeat contributor **RerankerGuo** (#8028, #8029, #8031, #8034, #8060, #8061) has been open for **over a month** with no merge activity, while fresh first-time PRs arrive today. This backlog of reviewed-but-unmerged work is the project's most visible health risk — it risks contributor fatigue and leaves known security/correctness fixes (#8028 COM automation, #8034 media bounding) unshipped.

---

*Generated for 2026-11-01. Data reflects a 24-hour GitHub activity window. Reactions are uniformly zero across tracked items; engagement is via comments only.*

</details>

<details>
<summary><strong>ZeroClaw</strong> — <a href="https://github.com/zeroclaw-labs/zeroclaw">zeroclaw-labs/zeroclaw</a></summary>

# ZeroClaw Project Digest — 2026-11-01

## 1. Today's Overview

ZeroClaw is in a high-intensity stabilization phase: 22 issues and 50 PRs were updated in the last 24 hours, with a marked concentration of security-related bug reports filed by a single contributor (IftekharUddin) on 2026-10-31. The project shipped no new releases, and the PR queue is heavily weighted toward open work (48 open vs. 2 merged/closed), suggesting maintainer review bandwidth is the current bottleneck. A significant share of activity concerns sandbox/security hardening (Seatbelt, MCP transport, audit logging, config path policy), indicating the team is in the middle of a security audit cycle tied to the v0.9.0 release gate. On the positive side, several fix PRs (e.g., Wasmtime bump, install script corrections, SOP scope inheritance) were opened the same day as their corresponding bug reports, showing responsive triage.

---

## 2. Releases

**No new releases in the last 24 hours.** The most recent referenced version in activity is v0.8.7, with v0.9.0 tagged across multiple release-gate items (e.g., PR #11234, #11220, #11965, #12129). Several merged/closed items are explicitly scoped to v0.9.0, implying the next release is in preparation but not yet cut.

---

## 3. Project Progress

Only two PRs were merged/closed in the last 24h, both narrow:

- **PR #12129 [CLOSED]** — `fix(deps): bump Wasmtime to 48.0.8 for RUSTSEC-2026-0420 to 0424` (release:v0.9.0). Directly resolves the CI-blocking security advisories reported in Issue #12128.
  https://github.com/zeroclaw-labs/zeroclaw/pull/12129
- **PR #12102 [CLOSED]** — `chore(deps): bump the rust-all group with 34 updates` (superseded by #12171 with 35 updates).

Feature work advanced but not yet merged includes: CLI-only install support (#12111), opt-in OIDC dashboard sign-in (#11965), `/load-session` for ZeroCode (#12071), POSIX command-splitting hardening (#11822), and multiple runtime authorization fixes (#11230, #11220, #11313). None of these reached merge today, so the pipeline is accumulating rather than draining.

---

## 4. Community Hot Topics

| Item | Type | Comments | Link |
|---|---|---|---|
| #11235 — RFC: Knowledge corpus (RAG) for the agent | Issue (enhancement/RFC) | 8 | https://github.com/zeroclaw-labs/zeroclaw/issues/11235 |
| #12050 — OIDC callback token page login CSRF | Issue (bug/security) | 1 | https://github.com/zeroclaw-labs/zeroclaw/issues/12050 |
| #12081 — Memory_store tool call failure (S1) | Issue (closed) | 1 | https://github.com/zeroclaw-labs/zeroclaw/issues/12081 |

**Analysis:** The RAG RFC (#11235) is the standout community discussion — it proposes a document-retrieval subsystem so the agent can answer from operator-held documentation, security standards, and OS/container references. This is a capability-boundary RFC (new subsystem), so expect architectural debate rather than a quick implementation. The OIDC CSRF issue (#12050) is notable because it pairs with the in-flight OIDC PR (#11965), meaning the security model of the new sign-in flow is being stress-tested before merge. Most other "hot" items are single-comment security reports from one reporter, which inflates the issue count but reflects a coordinated audit rather than broad community debate.

---

## 5. Bugs & Stability

Today's reports skew heavily toward security/sandbox defects. Ranked by severity:

**S1 — Workflow blocked / credential disclosure:**
- **#12143** — MCP stdio servers inherit the daemon's entire environment (provider keys, channel tokens, audit signing key) while other spawners clear env. https://github.com/zeroclaw-labs/zeroclaw/issues/12143
- **#12142** — Daemon config/data dirs not forbidden to agent; `file_read` can return `.secret_key`, `config.toml`, `gateway-admin.token`, OTP/WebAuthn secrets. https://github.com/zeroclaw-labs/zeroclaw/issues/12142
- **#12141** — `/admin/shutdown`, `/admin/reload`, `/admin/sop/*` trust any loopback peer; allowlisted interpreters can clear `OutOfBandRequired` gates. https://github.com/zeroclaw-labs/zeroclaw/issues/12141
- **#12138** — Native runtime runs login shell (`zsh -c`), so writable `~/.zshenv` is an allowlist-bypass execution hook. https://github.com/zeroclaw-labs/zeroclaw/issues/12138
- **#12137** — Seatbelt "home dotfiles" read rule mis-escaped (`\\.`), breaking `~/.cargo`, `~/.nvm`, `~/.pyenv`. **Fix PR exists: #12150.** https://github.com/zeroclaw-labs/zeroclaw/issues/12137
- **#12128 [CLOSED]** — `cargo audit` fails on every build (5 RustSec advisories, Wasmtime 48.0.7). **Fixed by PR #12129.** https://github.com/zeroclaw-labs/zeroclaw/issues/12128
- **#12081 [CLOSED]** — `memory_store` tool call failure on ik_llama.cpp/Qwen3.6. https://github.com/zeroclaw-labs/zeroclaw/issues/12081

**S2 — Degraded behavior:**
- **#12146** — MCP SSE client accepts absolute URL from server `endpoint` event, redirecting bearer tokens to any origin. https://github.com/zeroclaw-labs/zeroclaw/issues/12146
- **#12145** — Plugin store limiter caps per-memory size but keeps wasmtime defaults of 10,000 memories/tables, allowing thousands of times the budget. https://github.com/zeroclaw-labs/zeroclaw/issues/12145
- **#12144** — `file_upload`/`file_upload_bundle`/`file_edit` authorize through write tier, leaking sibling workspace files. https://github.com/zeroclaw-labs/zeroclaw/issues/12144
- **#12139** — Default `forbidden_paths` miss macOS `~/Library/Keychains`, `~/.netrc`, `~/.git-credentials`, `~/.npmrc`, `~/.docker/config.json`, `~/.kube/config`. https://github.com/zeroclaw-labs/zeroclaw/issues/12139
- **#12169 / #12167** — `send_message_to_peer` ignores headless SOP step scope and sender autonomy/action budget. **Fix PRs exist: #12170, #12168.** https://github.com/zeroclaw-labs/zeroclaw/issues/12169

**S3 — Minor:**
- **#12156** — `zeroclaw update` always downloads glibc build, can't update musl installs. https://github.com/zeroclaw-labs/zeroclaw/issues/12156
- **#12155** — Cancelled quickstart writes config despite "No config written" message. https://github.com/zeroclaw-labs/zeroclaw/issues/12155
- **#12154** — `install.sh` prints build commit instead of version (`v(99bd353)`). **Fix PR exists: #12159.** https://github.com/zeroclaw-labs/zeroclaw/issues/12154
- **#12153** — `install.sh` picks musl build on glibc hosts with musl package installed. https://github.com/zeroclaw-labs/zeroclaw/issues/12153
- **#12147** — Audit log created with default permissions (0644) and `agent_alias` outside hash chain. https://github.com/zeroclaw-labs/zeroclaw/issues/12147

**Assessment:** The volume of security bugs is high but the reporters are providing reference implementations (see #12158, which claims 10 unpatched vulnerabilities with fixes available in a fork). This is a mature-audit signal rather than a sign of active exploitation, but the S1 cluster (config disclosure, env inheritance, loopback admin trust) should be treated as release-blocking for v0.9.0.

---

## 6. Feature Requests & Roadmap Signals

- **RAG / Knowledge Corpus (#11235)** — Largest-scope proposal in the backlog; would add a document-retrieval subsystem. Likely a post-v0.9.0 architectural item given the RFC status and high risk.
- **Operator override of exceeded cost limit (#11589)** — `cost.allow_override` is documented but unimplemented; PR is open and XL. Strong candidate for v0.9.0 given it unblocks a documented config path.
- **Opt-in OIDC dashboard sign-in (#11965)** — Replaces shared pairing-code model with per-operator identity. Release-gate tagged; likely lands in v0.9.0 once the CSRF issue (#12050) is resolved.
- **CLI-only install (#12111)** — Lets users install without the dashboard. Release:v0.9.0 tagged.
- **`/load-session` in ZeroCode (#12071)** — Small DX win, likely fast-tracked.
- **Configurable daemon RPC session quotas (#12130, via #12132)** — Proposal for bounded placement exception; early stage.

**Prediction for next release (v0.9.0):** OIDC sign-in, cost override, CLI-only install, Wasmtime bump, and the SOP/peer-send authorization fixes. RAG and RPC quota work likely slip to v0.10+.

---

## 7. User Feedback Summary

**Pain points observed:**
- **Install/update friction is a recurring theme.** Four separate reports (#12153, #12154, #12155, #12156) from the same user (JordanTheJet) describe installer misbehavior: wrong arch detection, wrong version display, and `update` replacing a musl install with glibc. This suggests the onboarding path is under-tested across distros.
- **Agent permission model is leaky.** Multiple reports describe `readonly` or `Write`-only agents reaching data they shouldn't (#12142, #12144, #12167), indicating the multi-agent workspace allowlist model has gaps users are actively probing.
- **MCP transport is a trust boundary concern.** Both stdio (#12143) and SSE (#12146) transports have credential-exposure paths, which matters to users integrating third-party MCP servers.
- **One user (kckylechen1, #12158) reports running a professional security scan** and offering reference implementations for 10 unpatched vulnerabilities — a strong signal that downstream forks are finding issues faster than upstream can patch.

**Satisfaction signals:** Users are filing detailed, well-scoped reports with file/line references and, in several cases, opening fix PRs the same day — indicating an engaged, technically sophisticated user base. Dissatisfaction is concentrated in security posture and install ergonomics rather than core agent behavior.

---

## 8. Backlog Watch

Long-running items needing maintainer attention:

- **PR #11234** (opened 2026-09-29, updated 2026-10-31) — `fix(rpc): judge queued session ownership by current authority`. Release-gate, priority:p1, risk:high, XL, distinguished contributor. Open for over a month. https://github.com/zeroclaw-labs/zeroclaw/pull/11234
- **PR #11230** (opened 2026-09-29) — `fix(runtime): withhold session-data tools from non-admin principals`. Depends on #11225/#11234; cumulative recut. Release-gate, p1. https://github.com/zeroclaw-labs/zeroclaw/pull/11230
- **PR #11220** (opened 2026-09-29) — `fix(security): require administrator authority for SOP execution`. Release-gate, p1. https://github.com/zeroclaw-labs/zeroclaw/pull/11220
- **PR #11313** (opened 2026-10-01) — `fix(cli): publish authorization edits from config set and config patch into the running daemon`. Release-gate, p1, needs-maintainer-review. https://github.com/zeroclaw-labs/zeroclaw/pull/11313
- **PR #11822** (opened 2026-10-17) — `fix(security): split POSIX commands at substitution and subshell boundaries`. risk:high, needs-maintainer-review. https://github.com/zeroclaw-labs/zeroclaw/pull/11822
- **Issue #11235** (opened 2026-09-29) — RAG RFC, needs-author-action, type:rfc, risk:high. https://github.com/zeroclaw-labs/zeroclaw/issues/11235

**Assessment:** A cluster of p1, release-gate PRs authored by the same distinguished contributor (IftekharUddin) has been open for ~33 days without merge. These are the gating items for v0.9.0's authorization/identity-access model, and their age is the clearest health risk in the data — not a lack of contributor effort, but a likely review-capacity constraint on the maintainer side.

---

*Digest generated from GitHub activity snapshot dated 2026-11-01. All links point to `github.com/zeroclaw-labs/zeroclaw`.*

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*