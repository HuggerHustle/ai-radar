# OpenClaw Ecosystem Digest 2026-11-25

> Issues: 500 | PRs: 500 | Projects covered: 5 | Generated: 2026-11-25 04:05 UTC

- [OpenClaw](https://github.com/openclaw/openclaw)
- [Hermes Agent](https://github.com/nousresearch/hermes-agent)
- [IronClaw](https://github.com/nearai/ironclaw)
- [QwenPaw](https://github.com/agentscope-ai/QwenPaw)
- [ZeroClaw](https://github.com/zeroclaw-labs/zeroclaw)

---

## OpenClaw Deep Dive

# OpenClaw Project Digest — 2026-11-25

## 1. Today's Overview

OpenClaw remains in a high-velocity release cadence with **two new releases in 24 hours** (v2026.11.8 and v2026.11.9), and roughly **1,000 issue+PR updates** across the tracker. Activity is heavily skewed toward bug triage and stability work rather than net-new feature landings: **281 PRs were merged/closed**, while **219 remain open**, and issues were predominantly updates to existing reports (431 open/active vs. 69 closed). However, the issue landscape is dominated by **long-lived, high-comment P0/P1 bugs** — notably a 2026.9.6 regression family (plugin capture stalls, prepared-model-catalog memory leaks, WAL checkpoint failures) that has persisted for ~2 months. This suggests the project is shipping rapidly but carrying meaningful **technical debt in the gateway runtime, SQLite state layer, and Windows service path**.

---

## 2. Releases

### v2026.11.9 (latest)
- **Stated contents:** 13 commits · 15 PRs · 14 contributors
- Release notes and changelog are documented at `docs.openclaw.ai/releases/2026.11.9`
- The release publication includes the `openclaw-release-publication:docs-v1` marker, indicating docs-side notes were generated alongside the release.
- No breaking changes are declared in the surfaced metadata.

### v2026.11.8
- **Stated contents:** 314 commits · 210 PRs · 86 contributors
- A substantially larger release than .9, suggesting .8 was the primary feature/batch release and .9 is a fast follow-up (likely a patch/correction release).
- No explicit breaking changes are listed in the surfaced metadata.

**Migration/observability note:** While neither release declares breaking changes, active issues indicate the **update path itself is fragile** on Windows (see #200756, #170956) and that config recovery across versions can clobber restores (#204962, #205073). Users upgrading should verify `gateway.mode` and plugin state post-update.

---

## 3. Project Progress

With **281 PRs merged/closed in 24h**, the following themes are visible in the top PR set:

| Area | PR | Status | What it advances |
|---|---|---|---|
| **Config recovery / rollback** | [#204962](https://github.com/openclaw/openclaw/pull/204962) | OPEN, P1 | Keeps restored config over newer recovery backups |
| **Rollback across DB changes** | [#204956](https://github.com/openclaw/openclaw/pull/204956) | OPEN | Allows rollback across *compatible* schema changes (closes #204880) |
| **Update ownership** | [#204866](https://github.com/openclaw/openclaw/pull/204866) | OPEN | Prevents two update paths from claiming the same install |
| **Compatible DB reader floors** | [#204957](https://github.com/openclaw/openclaw/pull/204957) | OPEN, P1 | Backport to `release/2026.11.15` |
| **Lean startup** | [#205053](https://github.com/openclaw/openclaw/pull/205053) | OPEN | Avoids an extra SQLite worker during lean startup |
| **Codex bundle** | [#205065](https://github.com/openclaw/openclaw/pull/205065) | OPEN | Bundles Codex 0.172.0 without worker startup stalls |
| **Talk settings UI** | [#205068](https://github.com/openclaw/openclaw/pull/205068) | OPEN | Redesigns Talk settings page |
| **Composer UX** | [#204505](https://github.com/openclaw/openclaw/pull/204505) | OPEN | Splits dictation and Talk buttons in chat composer |
| **Participant model** | [#204847](https://github.com/openclaw/openclaw/pull/204847), [#204858](https://github.com/openclaw/openclaw/pull/204858) | OPEN | Parts 2–3 of a 6-part "invite participants to a session" stack |
| **CI/release health** | [#204971](https://github.com/openclaw/openclaw/pull/204971), [#205069](https://github.com/openclaw/openclaw/pull/205069), [#205022](https://github.com/openclaw/openclaw/pull/205022) | OPEN | Docker CI shortening, 1h npm readback budget, bulk-migration CI catch |

**Reading of the signs:** The PR pipeline is signaling that **updates/rollback and the state database are the top engineering priorities right now**. The "Participate" feature stack (#204783 → #204847 → #204858 → …) is the most significant *net-new* capability advancing in parallel, and the Talk/web UI redesign sub-stack (#204661 derivatives) is the main frontend workstream.

---

## 4. Community Hot Topics

Ranked by comment count:

### Issues
1. **[#160959 — P0] Gateway blocks for minutes capturing large external plugins (2026.9.6 regression)** — 87 comments
   https://github.com/openclaw/openclaw/issues/160959
   *Need:* Users with large plugin/dependency trees see multi-minute event-loop stalls at startup and on runtime republication. This is the single loudest thread and anchors the "2026.9.6 regression family."

2. **[#164294 — P2] Gateway state DB WAL auto-checkpoint never completes** — 43 comments
   https://github.com/openclaw/openclaw/issues/164294
   *Need:* Checkpoint blocked by an in-process reader, `logFrames=17091` accumulating. Points at the single-connection/reader-pinning design of the SQLite layer.

3. **[#197083 — P0] Post-install Doctor WAL publication verification leaves update partially finalized** — 39 comments
   https://github.com/openclaw/openclaw/issues/197083
   *Need:* 2026.11.1 → 11.3 upgrade failed at "SQLite WAL commit publication could not be verified," refused rollback (`state-migrated-no-rollback`). Correlation with the #204956/#204957 rollback-compat line of work.

4. **[#170956 — P0] Windows: slow startup, unclean plugin shutdown, schtasks permission error** — 34 comments
   https://github.com/openclaw/openclaw/issues/170956
   *Need:* Windows managed installs are effectively unreliable for update/restart workflows.

5. **[#178359 — P1] `doctor --fix --non-interactive` idles 15+ min with no output** — 32 comments
   https://github.com/openclaw/openclaw/issues/178359
   *Need:* Repair tooling hangs before reaching the DB repair it was invoked for.

6. **[#150635 — P2, diamond] Short-term recall retention evicts recalled entries nightly** — 31 comments
   https://github.com/openclaw/openclaw/issues/150635
   *Need:* "Dreaming deep phase never promotes" once the 512-entry cap fills — a memory/agent-learning correctness issue.

### PRs (by comment/visibility)
- [#204962](https://github.com/openclaw/openclaw/pull/204962) — config recovery precedence (P1, crash-loop)
- [#205066](https://github.com/openclaw/openclaw/pull/205066) — redo with Caps Lock preserves drafts (ready for maintainer look, has screenshot)
- [#204847](https://github.com/openclaw/openclaw/pull/204847) / [#204858](https://github.com/openclaw/openclaw/pull/204858) — participant access levels & exec approvals delivered to session creator (security-sensitive)
- [#200938](https://github.com/openclaw/openclaw/pull/200938) — recall older prompts without loading chat history

**Underlying demand:** The community's most engaged threads cluster around **state persistence integrity (WAL), gateway event-loop stalls, and cross-version update/rollback behavior**. These are not "wouldn't it be nice" threads — they are people losing turns, updates, and Windows installs.

---

## 5. Bugs & Stability

Ranked by severity; *fix PR present?* noted from the surfaced data.

### P0 / crash-loop / release-blocker
| Issue | Severity | Fix PR? |
|---|---|---|
| [#160959](https://github.com/openclaw/openclaw/issues/160959) Gateway blocks minutes capturing large plugins | P0, reg. | `no-new-fix-pr` |
| [#197083](https://github.com/openclaw/openclaw/issues/197083) Doctor WAL verification leaves update partial | P0, ux-release-blocker | `no-new-fix-pr` (related work: #204956/#204957) |
| [#170956](https://github.com/openclaw/openclaw/issues/170956) Windows schtasks/startup/shutdown | P0, crash-loop | `no-new-fix-pr` |
| [#160386](https://github.com/openclaw/openclaw/issues/160386) 2026.9.6 large session stores → SQLite I/O pressure, RPC timeouts | P0, reg. | `no-new-fix-pr` |
| [#137177](https://github.com/openclaw/openclaw/issues/137177) Built-in `@wecom/wecom-openclaw-plugin@2026.7.2` won't install | P0 | `no-new-fix-pr` |
| [#160548](https://github.com/openclaw/openclaw/issues/160548) **CLOSED** prepared-model-catalog worker leaks ~1 GiB/5 min | P0, msg-loss | Closed 2026-11-24 ✅ |

### P1
| Issue | Severity | Fix PR? |
|---|---|---|
| [#196199](https://github.com/openclaw/openclaw/issues/196199) Codex helper completions fail to resume parent (since 2026.10.10) | P1, session-state | `no-new-fix-pr` |
| [#178359](https://github.com/openclaw/openclaw/issues/178359) `doctor --fix` 15+ min idle | P1, crash-loop | `no-new-fix-pr` |
| [#190307](https://github.com/openclaw/openclaw/issues/190307) Gateway restart leaves agents permanently "degraded" | P1 | `needs-live-repro` |
| [#140010](https://github.com/openclaw/openclaw/issues/140010) Windows sleep/resume → 30–60s reconnects | P1 | `no-new-fix-pr` |
| [#134993](https://github.com/openclaw/openclaw/issues/134993) Gateway pegs a CPU core after 2026.8.1 with large fleet | P1 | `no-new-fix-pr` |
| [#166641](https://github.com/openclaw/openclaw/issues/166641) `web_fetch` fallback captures unrelated plugins on main thread | P1 | `linked-pr-open` |
| [#160522](https://github.com/openclaw/openclaw/issues/160522) prepared-model-catalog worker reaches 1.15 GB despite 512 MB cap | P1 | `linked-pr-open` |
| [#138272](https://github.com/openclaw/openclaw/issues/138272) Android Talk drops "no live response owner" on task turns | P1 | `no-new-fix-pr` |
| [#142116](https://github.com/openclaw/openclaw/issues/142116) Telegram lane ingress wedged post-restart | P1 | `no-new-fix-pr` |
| [#55792](https://github.com/openclaw/openclaw/issues/55792) Missed inbound messages dropped on gateway restart | P1 | `fix-shape-clear` |

### P2 (notable)
- [#126360](https://github.com/openclaw/openclaw/issues/126360) `AgentSelectionRequiredError` log flood under explicit multi-agent ownership
- [#143017](https://github.com/openclaw/openclaw/issues/143017) Prompt-cache prefix rewrites (21.3M cache-write tokens measured)
- [#172969](https://github.com/openclaw/openclaw/issues/172969) `registerCliBackend` silently dropped → misleading "Invalid URL"
- [#177094](https://github.com/openclaw/openclaw/issues/177094) Control UI reorders transcript when system-notice mirror lands last — *queueable fix*
- [#173057](https://github.com/openclaw/openclaw/issues/173057) Shared `agents.defaults.workspace` parent treated as live workspace — *queueable fix*
- [#165615](https://github.com/openclaw/openclaw/issues/165615) Discord `editMessage` cannot update Components V2 cards
- [#200224](https://github.com/openclaw/openclaw/issues/200224) Beta refuses retired `heartbeat`, but removing it on stable re-enables heartbeats
- [#200756](https://github.com/openclaw/openclaw/issues/200756) Windows beta.2 → beta.4 package-swap fails ("baseline package scan failed")
- [#197374](https://github.com/openclaw/openclaw/issues/197374) Compaction capped by 120s idle timeout with no quality-guard reason

**Health verdict:** The **2026.9.6 regression family** (plugin capture stalls, prepared-model-catalog memory, WAL checkpoint pins) is the dominant stability story. #160548 was closed today, which is genuine progress, but multiple sibling P0/P1s remain without a fix PR in the surfaced data. Windows + update/rollback is the second cluster. Most P0/P1 issues are tagged `no-new-fix-pr` and `needs-maintainer-review`, i.e., **bottlenecked on maintainer bandwidth, not user reports**.

---

## 6. Feature Requests & Roadmap Signals

Candidates for near-term inclusion, based on linked PRs, tags (`clawsweeper:needs-product-decision` vs `queueable-fix`), and release momentum:

**Strong signals (PRs already open / stacked, likely in a near release):**
- **Participate / session sharing** — 6-part stack (#204783 merged, #204847, #204858 open). Participant limits, access levels, exec-approval routing to session creator. Security-sensitive flag set. Highest-confidence landing.
- **Update path overhaul** — #204956 (rollback across compatible DB changes), #204866 (update owner), #204957 (backport to 2026.11.15), #204971/#205069 (CI). The existence of a `release/2026.11.15` branch referenced in #204957 confirms a **planned stable on 2026.11.15**.
- **Codex 0.172.0 bundle** — #205065.
- **Talk UI redesign + composer split** (dictation vs. Talk) — #205068, #204505, part of a broader #204661 redesign.
- **Settings deep-link + row highlight** — #204987 (UX for "go change setting X"? highlight it).
- **Recall older prompts with ↑** — #200938.

**Moderate signals:**
- **`sessions_spawn` host-managed attachments** — #204379.
- **Steer receipt for busy-time messages** — #160405.
- **Context budget/skip policy for Skill Workshop** — #150238.
- **Enforceable checkpoints for long foreground WebChat runs** — #138990.

**Speculative / product-decision pending:**
- MCP event subscriptions → run per event (#166586, P3)
- Telegram `sendDice` action (#137110, P3)
- Dynamic SharePoint site resolution for Teams uploads (#136271, P2)
- Multiple policy aliases → one model (#140213)

**Prediction:** The next multi-week release train centers on **(a) update/rollback and SQLite state reliability**, **(b) the Participate session-sharing stack**, and **(c) the Talk/web composer UI redesign**. Memory/dreaming correctness (#150635) and prompt-cache stability (#143017) remain at product-decision stage and are less likely to land in the immediate next version.

---

## 7. User Feedback Summary

**Pain points (dissatisfaction, high frequency):**
1. **Updates break installs.** Multiple independent reports on Windows and macOS (#197083, #200756, #183479, #170956, #204962-adjacent). Rollback is refused, partial finalization occurs, and repair paths don't converge. This is the most repeated source of anger and the strongest driver of the current PR wave.
2. **Gateway stalls and instability at scale.** Large plugin trees (#160959), large session stores (#160386), and large skill/agent fleets (#134993) produce stalls, RPC timeouts, and CPU pegging. This correlates directly with "I have a big setup and it doesn't behave."
3. **Memory/latency correctness.** Prompt-cache rewrites costing 21.3M tokens (#143017), `memory_search` 15s hangs (#136405), WAL checkpoint starvation (#164294), compaction timeouts (#197374), short-term recall eviction (#150635) — a coherent "my agent forgets and burns money" theme.
4. **Repair tooling hangs.** `doctor --fix` (#178359) idling 15+ min is especially painful because it is the fallback when updates fail.
5. **Mobile/real-time dropouts.** Android Talk (#138272), sleep/resume reconnects (#140010), and session resume regressions (#196199).

**Use cases surfaced:**
- Multi-agent setups with explicit ownership (#126360, #190307: 35 agents, per-agent SQLite 1–284 MB).
- WhatsApp-, Telegram-, and Teams-facing production agents (#142116, #136271).
- Windows managed-service installs (Enterprise-ish, schtasks).
- Mobile-first users relying on Talk and cross-device notifications (#143387).
- Large-session "dreaming"/skill-workshop users (#150635, #150238).

**Satisfaction signals:** Two releases in 24h, a >80-contributor release (2026.11.8), multiple "ready for maintainer look" PRs with screenshots/video proof, and a working clawsweeper triage taxonomy all indicate

---

## Cross-Ecosystem Comparison

# Cross-Project Comparison Report — Personal AI Assistant / Agent Open-Source Ecosystem
**Date:** 2026-11-25 · **Projects covered:** OpenClaw, Hermes Agent, IronClaw, QwenPaw, ZeroClaw

---

## 1. Ecosystem Overview

The personal AI assistant / agent open-source landscape on 2026-11-25 is characterized by **rapid release cadence colliding with accumulated technical debt**. Projects like OpenClaw and Hermes Agent are shipping multiple releases per week while simultaneously wrestling with long-lived P0/P1 regressions in state persistence, update/rollback paths, and gateway reliability. A clear **divide is emerging between "core runtime" projects** (OpenClaw, ZeroClaw, Hermes) optimizing for scale, multi-agent orchestration, and provider abstraction, and **"agent application" projects** (QwenPaw) focused on HITL UX, sandboxing, and end-user polish. Cross-cutting themes — SQLite/state-layer contention, silent-failure UX, MCP transport robustness, and browser/computer-use tool parity — are becoming the shared battleground for the next maturity tier. IronClaw's total dormancy this cycle is a reminder that the ecosystem remains volatile and contribution-dependent.

---

## 2. Activity Comparison

| Project | Issues (updated 24h) | PRs (updated 24h) | PRs merged/closed | Release Status | Health Score* |
|---|---|---|---|---|---|
| **OpenClaw** | ~500 (431 open, 69 closed) | ~500 (281 merged/closed, 219 open) | 281 | **2 releases/24h** (v2026.11.8, v2026.11.9); `release/2026.11.15` branch planned | **7.5/10** — high velocity, heavy P0 debt |
| **Hermes Agent** | 50 (39 open, 11 closed) | 50 (30 open, 20 merged/closed) | 20 | v0.23.4 patch (~229 PRs) + canary; v0.24.0 stabilizing | **8.0/10** — strong throughput, active fix pipeline |
| **QwenPaw** | 21 | 43 | 2 closed surfaced | No release; v2.3.1-beta.1 install verification open (#8861) | **7.0/10** — pre-release, security scrutiny rising |
| **ZeroClaw** | 9 | 50 (42 open, 8 merged/closed) | 8 | No release; v0.9.1 targeted (OIDC close-out) | **6.5/10** — strong contribution, review bottleneck on XL PRs |
| **IronClaw** | 0 | 0 | 0 | None | **N/A — dormant** |

\* *Health Score is a qualitative composite of velocity, fix-PR coverage of high-severity items, and maintainer responsiveness, not a project-endorsed metric.*

**Reading:** OpenClaw operates at ~10× the raw activity of any peer but carries a correspondingly larger regression surface. Hermes and ZeroClaw are in the healthiest *ratio* of contribution-to-fix throughput. QwenPaw is smallest by issue count but highest-friction per-issue (multiple 🔴 session-bricking bugs with no fix PR). IronClaw contributes no signal this cycle.

---

## 3. OpenClaw's Position

**Advantages vs. peers:**
- **Ecosystem gravity.** OpenClaw is the de facto *reference implementation* — 86 contributors on a single release (2026.11.8) outnumbers the entire active contributor base of ZeroClaw or QwenPaw in a comparable window. This produces a **triage taxonomy (clawsweeper)** and structured release markers (`docs-v1`) peers lack.
- **Feature breadth.** The Participate/session-sharing 6-part stack (#204783→#204847→#204858), Codex bundling (#205065), and Talk/web-UI redesign represent net-new capability that peers are not matching in parallel.
- **Release discipline.** Two releases in 24h, with a named future branch (`release/2026.11.15`) implies a **predictable stable train** — Hermes and ZeroClaw rely on canary/patch cadence without an equivalent announced lane.

**Technical approach differences:**
- OpenClaw carries a **heavier runtime** — a gateway process, SQLite state DB with WAL checkpointing, plugin capture subsystem, and Windows schtasks service path. This architecture enables scale (35-agent fleets, Enterprise Windows installs) at the cost of the exact failure modes dominating its tracker (WAL starvation #164294, plugin captures #160959).
- Hermes is architecturally lighter (single state.db, bot-mode orchestration), ZeroClaw is mid-weight (Rust runtime being split, provider registry V5), QwenPaw is application-layer (Console + Creator plugin + local llama-server). **OpenClaw pays for its surface area in stability debt.**

**Community size comparison (proxy: 24h issue+PR updates):**
| Project | ~Updates | Relative |
|---|---|---|
| OpenClaw | ~1,000 | **100%** (baseline) |
| Hermes Agent | 100 | ~10% |
| ZeroClaw | 59 | ~6% |
| QwenPaw | 64 | ~6% |
| IronClaw | 0 | — |

OpenClaw is the clear community hub; the remaining projects collectively total roughly OpenClaw's single-day activity.

---

## 4. Shared Technical Focus Areas

Requirements emerging independently across multiple projects — the strongest signals of ecosystem-wide need:

1. **State-layer contention & write-lock starvation**
   - **OpenClaw:** WAL checkpoints never complete (#164294, 43 comments); SQLite I/O pressure (#160386).
   - **Hermes:** whole-index routing rewrites ~35k rows → 8.5–13.3s write lock on 2.9 GB state.db (#159886); Desktop 30s timeout.
   - **ZeroClaw:** Turso opt-in memory backend proposed (#12709) as a direct workaround for SQLite WAL.
   - *Need:* Persistent stores are the #1 scaling bottleneck across the two largest projects.

2. **Silent / misleading failure UX**
   - **Hermes:** completion notifications truncated to "last 0 chars" (5+ duplicate reports); hop-cap refusals silently dropped (#159446); cron jobs silently resuming.
   - **ZeroClaw:** `/model <id>` reports success but uses profile-configured model (#12667); email UNSEEN backlog re-answering (#12703).
   - **QwenPaw:** MCP `streamable_http` masks 4xx as "not connected" (#8875).
   - *Need:* A cross-project pattern — the system reports success while doing something else, eroding operator trust and forcing manual reconciliation.

3. **MCP transport robustness**
   - **ZeroClaw:** stale pooled sockets → outcome-unknown tool calls (#12055, no fix PR).
   - **QwenPaw:** HTTP error masking tears down session (#8875, fix PR #8895 open).
   - *Need:* MCP is now a shared dependency; connection lifecycle and error semantics need standardization.

4. **Update / rollback integrity**
   - **OpenClaw:** Doctor WAL verification leaves update partial (#197083, P0); Windows package-swap fails (#200756); rollback across compatible schema changes (#204956).
   - **Hermes:** profile import/export symlink round-trip failure (#150724/#65530) — same *class* of "state survives upgrade" concern.
   - **QwenPaw:** v2.3.1-beta.1 install verification open as release blocker (#8861).
   - *Need:* Upgrades must be transactional and reversible; currently a top pain point for OpenClaw's Enterprise/Windows segment.

5. **Browser / computer-use tool parity**
   - **ZeroClaw:** browser tool exposes only 16 of 100+ commands (#9945, 3.5 months stale, `status:blocked`).
   - **Hermes:** concurrent unnamed `browser_exec` sessions clobber shared CDP Chrome (#141692).
   - *Need:* Browser automation is a gating capability for real workflow automation and is under-built across the ecosystem.

6. **Human-in-the-Loop / approval routing**
   - **QwenPaw:** `ask_user_question` HITL tool (#6274) — 4-month-old, high-interest.
   - **OpenClaw:** exec approvals routed to session creator (#204858); Windows approval prompts breaking Matrix thread isolation (ZeroClaw #12558).
   - *Need:* Structured agent→human pauses are becoming a baseline safety expectation.

---

## 5. Differentiation Analysis

| Dimension | OpenClaw | Hermes Agent | QwenPaw | ZeroClaw |
|---|---|---|---|---|
| **Primary focus** | Gateway runtime, multi-agent scale, update safety | Multi-agent Bot Mode, cross-platform sessions | End-user Console UX, HITL, sandboxing | Provider abstraction, identity (OIDC), channels |
| **Target users** | Enterprise / power users (35-agent fleets, Windows managed installs) | Technical multi-agent orchestrators, Nix users | Desktop and web users, local-model runners | Infrastructure/security-conscious operators |
| **Architecture** | Heavy gateway + SQLite WAL + plugin capture + Windows service | Lighter single-state.db, structured session model | Application-layer (Console + Creator + llama-server) | Rust runtime being split; V5 provider registry; ACP dashboard cutover |
| **Language/runtime** | Node/TS (implied by npm, Codex bundle) | Mixed (Python-adjacent; UV package manager) | Python + WebView2 | **Rust** (explicitly, crate splitting #12697) |
| **Differentiating bet** | Session sharing + Talk UI + release discipline | Canonical cross-platform session (#62780) | HITL + Creator plugin ecosystem | Security/identity (OIDC v0.9.0→v0.9.1) + channel breadth (SimpleX) |
| **Weakness signal** | P0 debt in WAL/plugin/update | state.db write-lock, Windows write_file | 🔴 media-block session bricking, Windows llama-server leak | Review bottleneck on XL PRs, browser tool blocked |

**Key insight:** Four distinct strategic bets are visible. OpenClaw bets on **institutional-grade runtime reliability at scale** (and is currently losing ground to its own debt). Hermes bets on **session continuity across surfaces**. QwenPaw bets on **polish and safety for the individual user**. ZeroClaw bets on **security/identity depth and channel breadth** — and is explicitly Rust-based, making it the architectural outlier and a plausible long-term reliability alternative.

---

## 6. Community Momentum & Maturity

**Tiers by momentum:**

- **Tier 1 — Hyper-velocity, stability-stressed:** **OpenClaw.** ~1,000 updates/24h, 281 PRs merged, two releases. Rapidly iterating *and* accumulating recognized debt. Maturity: high feature surface, medium runtime reliability.
- **Tier 2 — High-velocity, healthy:** **Hermes Agent.** Pre-v0.24.0 hardening with active fix pipeline for the week's dominant bug family; ~229-PR patch release. Maturity: stabilizing toward a milestone.
- **Tier 2 — High-contribution, review-bottlenecked:** **ZeroClaw.** 50 PRs but only 8 merged; six-PR provider-V5 stack gated on review latency. Maturity: architecturally ambitious, throughput-constrained.
- **Tier 3 — Pre-release, security-scrutinizing:** **QwenPaw.** 43 PRs, no release, beta install verification open, new sandbox-hardening design issues from a single contributor. Maturity: approaching a milestone but pre-GA.
- **Dormant:** **IronClaw.** No activity — treat as inactive for planning purposes.

**Which are rapidly iterating vs. stabilizing:**
- *Rapidly iterating (feature net-new):* OpenClaw (Participate stack, Talk redesign), ZeroClaw (provider V5, ACP cutover, SimpleX).
- *Stabilizing (hardening):* Hermes (v0.24.0 freeze prep), QwenPaw (2.3.1 GA gate).

---

## 7. Trend Signals

Extracted from cross-project community feedback — actionable for AI-agent developers:

1. **Persistence is the new frontier bottleneck.** SQLite WAL contention, write-lock starvation, and state.db bloat (OpenClaw #164294, Hermes #159886) affect both the largest projects. **Action:** design for incremental/partial persistence and consider embedded alternatives (ZeroClaw's Turso proposal #12709 is the ecosystem's first concrete escape hatch).

2. **Silent failure is the top trust-killer.** The completion-truncation family, `/model` misreporting, and cron silent-resume are the loudest, most-repeated complaints. **Action:** mandate explicit success/failure signaling on every user-visible operation; treat "reports success while doing something else" as P0-class.

3. **Update/rollback integrity is a product requirement, not a hygiene task.** OpenClaw's P0 update failures on Windows and Hermes' profile import failures show that **state must survive upgrade transactionally**. **Action:** ship rollback-compatible schema migrations by default; verify post-update state in CI.

4. **MCP has graduated from experiment to critical dependency — and its error semantics are immature.** Error masking (QwenPaw) and stale pooled sockets (ZeroClaw) produce *outcome-unknown* states, the worst failure class for an autonomous retry loop. **Action:** treat MCP connection lifecycle as a first-class subsystem; standardize error surfaces.

5. **HITL / approval routing is becoming baseline, not optional.** `ask_user_question` (QwenPaw), participant access levels (OpenClaw), and Matrix thread-isolated approvals (ZeroClaw) are converging demands. **Action:** design approval UX with isolation and routing to the correct authority from day one.

6. **Browser / computer-use parity remains an unclaimed moat.** ZeroClaw's blocked 16/100+ command gap (#9945) and Hermes' CDP clobbering (#141692) reveal under-investment in the capability most likely to define the next product tier. **Action:** full browser-automation parity is an open competitive opportunity.

7. **Multi-agent orchestration is in production but under-provisioned.** OpenClaw 35-agent fleets, Hermes Bot Mode manager→engineer delegation, ZeroClaw ACP dashboard — three independent signals that users run *coordinated* agents, while orchestration primitives (hop caps, cross-profile continuity, session sharing) remain immature. **Action:** treat multi-agent as a first-class product surface, not a power-user hack.

8. **Security/identity hardening is the ZeroClaw differentiator to watch.** OIDC core shipped in v0.9.0; device-bound refresh grants (#12707, ADR-017) targeted for v0.9.1; sandbox/tenant-scoping design issues surfacing in QwenPaw. **Action:** enterprise adoption will be gated on identity and tenant isolation — a gap OpenClaw's Windows Enterprise users are already feeling.

---

**Bottom line for decision-makers:** The ecosystem is healthy in contribution volume but **consolidating around unresolved state-layer and silent-failure problems**. OpenClaw owns the community but pays in stability debt; Hermes and ZeroClaw offer cleaner velocity-to-quality ratios; QwenPaw is the closest to an end-user application and the furthest from GA; IronClaw is inactive. The highest-leverage cross-project investments are transactional state upgrades, explicit failure semantics, MCP robustness, and browser-tool parity.

---

## Peer Project Reports

<details>
<summary><strong>Hermes Agent</strong> — <a href="https://github.com/nousresearch/hermes-agent">nousresearch/hermes-agent</a></summary>

# Hermes Agent — Project Digest
**Date:** 2026-11-25 · **Repo:** [github.com/NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent)

---

## 1. Today's Overview

Hermes Agent shows **high sustained activity** across both issue and PR pipelines: 50 issues and 50 PRs updated in the last 24 hours, with a healthy 11 issues closed and 20 PRs merged/closed against 39 open issues and 30 open PRs. The dominant theme today is a **cluster of duplicated gateway completion-notification bugs** (the "showing last 0 chars" truncation family) that has been converging on fixes through the day — fast iteration from report → duplicate → fix PR. A patch release (v0.23.4) shipped rolling up ~229 PRs, and a fresh canary build (v0.23.3+canary) landed the day after, indicating an active pre-v0.24.0 stabilization window. Issue influx remains heavier than closures, which is typical during a pre-release hardening cycle, but maintainer and community PR throughput is strong.

---

## 2. Releases

**v0.23.4** ([release](https://github.com/NousResearch/hermes-agent/releases/tag/v0.23.4)) — Released **2026-11-23**
- **Type:** Patch release. Rolls up **~229 PRs** merged since v0.23.3 into a stable GitHub release (CLI + installers), Microsoft Store app, Docker, and Hermes Cloud images.
- **Breaking changes:** None stated.
- **Migration notes:** None stated. Full curated notes for this window are deferred to **v0.24.0**.
- **Caveat:** Because the curated changelog is deferred to v0.24.0, v0.23.4 acts as a vehicle to publish binaries/artifacts rather than a feature-complete changelog entry.

**canary.20261124T064706Z-v0.23.3** ([release](https://github.com/NousResearch/hermes-agent/releases/tag/canary.20261124T064706Z-v0.23.3)) — Released **2026-11-24**
- Canary build atop v0.23.3 with platform download assets (macOS Apple Silicon DMG shown in the release body). Signals continued rapid, tag-driven canary builds.

---

## 3. Project Progress (Merged/Closed PRs Today)

**~20 PRs merged/closed today.** Notable fixes advancing:

- **Gateway notification payload preservation** — [#153604](https://github.com/NousResearch/hermes-agent/pull/153604) *"a completion notification keeps its payload — size by completion_output_chars, never cut to nothing"* (CLOSED) and [#150225](https://github.com/NousResearch/hermes-agent/pull/150225) *"preserve bot replies in completion payloads"* (CLOSED). These directly address the highest-volume bug family of the week.
- **Cron pause/disabled guards** — [#158630](https://github.com/NousResearch/hermes-agent/pull/158630) and [#158501](https://github.com/NousResearch/hermes-agent/pull/158501) both closed, fixing [#156575](https://github.com/NousResearch/hermes-agent/issues/156575): `hermes console` `cron run` silently reactivating paused jobs.
- **Profile import/export symlink round-trip** — [#150724](https://github.com/NousResearch/hermes-agent/pull/150724) *"import a profile archive that contains symlinks"* (CLOSED), resolving a long-standing export→import failure.
- **Todo parent-cycle sanitization** — [#157758](https://github.com/NousResearch/hermes-agent/pull/157758) and [#104096](https://github.com/NousResearch/hermes-agent/pull/104096) closed, fixing cycle-breaking at the wrong node ([#156671](https://github.com/NousResearch/hermes-agent/issues/156671)).
- **Package manager env isolation** — [#148267](https://github.com/NousResearch/hermes-agent/pull/148267) and [#148298](https://github.com/NousResearch/hermes-agent/pull/148298) closed, preserving `UV_CONCURRENT_DOWNLOADS` / `UV_HTTP_RETRIES` through PM isolation.
- **CI / release engineering** — [#154545](https://github.com/NousResearch/hermes-agent/pull/154545) (Linux AppImages on tag builds, closed), plus open mac/Windows bundle-tooling PRs from [@BearHuddleston](https://github.com/BearHuddleston) progressing ([#159483](https://github.com/NousResearch/hermes-agent/pull/159483), [#159833](https://github.com/NousResearch/hermes-agent/pull/159833), [#159146](https://github.com/NousResearch/hermes-agent/pull/159146)).

---

## 4. Community Hot Topics

| Item | Comments | Type | Link |
|---|---|---|---|
| #150617 — gateway completion notification truncates tail to 0 chars | 10 | Bug (CLOSED) | [#150617](https://github.com/NousResearch/hermes-agent/issues/150617) |
| #131786 — completion tail drops output for long single-line JSON | 10 | Bug (CLOSED) | [#131786](https://github.com/NousResearch/hermes-agent/issues/131786) |
| #62780 — Canonical cross-platform session | 9 | Feature (OPEN) | [#62780](https://github.com/NousResearch/hermes-agent/issues/62780) |
| #141692 — Shared CDP Chrome sessions clobber each other | 8 | Bug (OPEN) | [#141692](https://github.com/NousResearch/hermes-agent/issues/141692) |
| #139436 — memory tool batch ops silently drop nested fields | 6 | Bug (OPEN) | [#139436](https://github.com/NousResearch/hermes-agent/issues/139436) |
| #150690 — Gateway Group Chat vanishes from sidebar per-profile | 6 | Bug (OPEN) | [#150690](https://github.com/NousResearch/hermes-agent/issues/150690) |
| #107343 — disk-cleanup deletes user `test_*/tmp_*` scripts | 6 | Bug (OPEN) | [#107343](https://github.com/NousResearch/hermes-agent/issues/107343) |

**Underlying needs analysis:**
- **Notification reliability is the #1 community frustration.** The top two threads are both the same root defect — completion payloads truncated to nothing — which has now been re-reported at least 5 times ([#150617](https://github.com/NousResearch/hermes-agent/issues/150617), [#131786](https://github.com/NousResearch/hermes-agent/issues/131786), [#158043](https://github.com/NousResearch/hermes-agent/issues/158043), [#152075](https://github.com/NousResearch/hermes-agent/issues/152075), [#151053](https://github.com/NousResearch/hermes-agent/issues/151053), [#156158](https://github.com/NousResearch/hermes-agent/issues/156158)). This signals **duplicate-report churn**, a symptom of a fix not yet fully shipped to users.
- **Multi-agent / Bot Mode orchestration** is a rising cluster: `message_agent` wakes, hop caps, and cross-profile Group Chats all point to users running **multiple coordinated agents** in production — a maturity signal for the platform.
- **Shared-session / cross-platform continuity** ([#62780](https://github.com/NousResearch/hermes-agent/issues/62780)) is a high-engagement roadmap item, indicating demand for a unified session model across CLI/Desktop/TUI/mobile/chat platforms.

---

## 5. Bugs & Stability

**Ranked by severity / user impact:**

**P1 / High impact:**
- **#159600** (PR, P1) — persistence: handoff onto markerless subagent rows. *Fix PR open:* [#159600](https://github.com/NousResearch/hermes-agent/pull/159600). Regression risk tied to #159513 guard changes.
- **#159886** (OPEN, P2 perf) — whole-index routing save rewrites ~35k rows on every persist → **8.5–13.3s write lock on a 2.9 GB state.db**; Desktop `session.control.read` times out at 30s. Major scaling pain for power users. [Link](https://github.com/NousResearch/hermes-agent/issues/159886)
- **#159446** (OPEN, P2) — Bot Mode hop-cap refusals **silently drop messages**; owner never notified. [Link](https://github.com/NousResearch/hermes-agent/issues/159446)

**P2 / Medium impact (high volume):**
- **Completion-truncation family** — [#156158](https://github.com/NousResearch/hermes-agent/issues/156158), [#156513](https://github.com/NousResearch/hermes-agent/issues/156513), plus closed [#150617](https://github.com/NousResearch/hermes-agent/issues/150617)/[#131786](https://github.com/NousResearch/hermes-agent/issues/131786)/[#158043](https://github.com/NousResearch/hermes-agent/issues/158043)/[#152075](https://github.com/NousResearch/hermes-agent/issues/152075)/[#151053](https://github.com/NousResearch/hermes-agent/issues/151053). *Fix PRs open/merged:* [#153604](https://github.com/NousResearch/hermes-agent/pull/153604).
- **#159709** (OPEN) — **Windows `write_file` permanently blocked** on modified files (`os.fstat` vs `os.stat` `st_ctime_ns` mismatch). Platform-specific data-loss-adjacent. [Link](https://github.com/NousResearch/hermes-agent/issues/159709)
- **#141692** (OPEN) — concurrent unnamed `browser_exec` sessions on shared CDP Chrome clobber each other. [Link](https://github.com/NousResearch/hermes-agent/issues/141692)
- **#139436** (OPEN, needs-repro) — memory tool batch ops silently drop nested fields → consolidation loop. [Link](https://github.com/NousResearch/hermes-agent/issues/139436)
- **#150690** (OPEN) — regression since v0.22.6: gateway Group Chat hidden per-profile. [Link](https://github.com/NousResearch/hermes-agent/issues/150690)
- **#107343** (OPEN) — disk-cleanup plugin deletes user `test_*/tmp_*` files. [Link](https://github.com/NousResearch/hermes-agent/issues/107343)
- **#135119** (OPEN) — remote-backend sync-back cross-contaminates profiles on multiplexed gateway. *Fix PR open:* [#135123](https://github.com/NousResearch/hermes-agent/pull/135123). [Link](https://github.com/NousResearch/hermes-agent/issues/135119)
- **#159882**, **#159872**, **#159573**, **#159559** — newer reports (skill secret stub loop, Matrix thread reply targeting, legacy `session.list` double-wait, Desktop MEDIA+CJK path capture). [159882](https://github.com/NousResearch/hermes-agent/issues/159882) · [159872](https://github.com/NousResearch/hermes-agent/issues/159872) · [159573](https://github.com/NousResearch/hermes-agent/issues/159573) · [159559](https://github.com/NousResearch/hermes-agent/issues/159559)

**Assessment:** Bug velocity is high but **fix PRs exist for the top clusters**, and several long-lived issues closed today. The state.db write-lock and Windows `write_file` bugs are the most concerning *unfixed* items.

---

## 6. Feature Requests & Roadmap Signals

- **#62780 — Canonical cross-platform session** (OPEN, needs-decision, 9 comments). Reach one session from CLI/Desktop/TUI/WebUI/iOS/Android/Telegram/Discord/ACP/API. Strong candidate for a headline **v0.24.0+** roadmap item given breadth and engagement. [Link](https://github.com/NousResearch/hermes-agent/issues/62780)
- **#101910 — Universal continuation-capable `before_final` hook** for retrieval/policy gates. Memory-provider and policy-plugin infrastructure. [Link](https://github.com/NousResearch/hermes-agent/issues/101910)
- **#145597 — Multiple API keys per provider (rotation/failover)** — reliability ask for production users. [Link](https://github.com/NousResearch/hermes-agent/issues/145597)
- **#148321 — kanban notify-subscribe bot-chat delivery target**. [Link](https://github.com/NousResearch/hermes-agent/issues/148321)
- **#137924 — Plugin credentials documented route for Google Workspace tokens** (catalog rule 11). [Link](https://github.com/NousResearch/hermes-agent/issues/137924)
- **#43033 — Multiple profiles/instances from within Nix** (8 👍, highest reaction count seen). Nix/packaging niche but vocal. [Link](https://github.com/NousResearch/hermes-agent/issues/43033)

**Prediction:** The completion-notification fixes (#153604, #150225) and cron guard fixes are almost certainly in **v0.24.0**. Canonical cross-platform session (#62780) and multi-API-key failover (#145597) are plausible v0.24.0/v0.25.0 headline features if maintainer decisions land.

---

## 7. User Feedback Summary

**Pain points (dissatisfaction):**
- **Silent failures dominate sentiment.** Repeated complaints about messages "arriving empty" (`showing last 0 chars`), hop-cap refusals disappearing, and cron jobs silently resuming. Users explicitly note having to "re-read the process ledger to recover" output — workaround fatigue.
- **Scale/performance strain.** One user on a 2.86 GB `state.db` / ~40k sessions reports near-constant Desktop timeouts and 13s write locks — the product is hitting real production scale limits.
- **Data-safety fears.** Disk-cleanup deleting user scripts ([#107343](https://github.com/NousResearch/hermes-agent/issues/107343)) and Windows `write_file` permanent blocks ([#159709](https://github.com/NousResearch/hermes-agent/issues/159709)) erode trust in the tool layer.
- **Profile/multi-tenancy friction** — export/import symlink rejections and cross-profile contamination recur across issues.

**Positive signals / use cases:**
- Heavy **multi-agent Bot Mode orchestration** (manager→engineer delegation, reviewer↔writer loops) — users are pushing the platform into sophisticated workflows.
- **Nix users** (8 👍) and cross-platform (mac/Windows/Linux ARM64) interest shows diverse deployment environments.
- Broad engagement (top issues at 6–10 comments) indicates an **invested, technical community** willing to file detailed repros.

---

## 8. Backlog Watch

Long-unanswered or stale items warranting maintainer attention:

| Issue/PR | Age | Why it matters |
|---|---|---|
| [#62780](https://github.com/NousResearch/hermes-agent/issues/62780) Canonical cross-platform session | Since 2026-07-11 (~4.5 mo) | `needs-decision`, highest-value architectural ask; stalled on decision. |
| [#107343](https://github.com/NousResearch/hermes-agent/issues/107343) disk-cleanup deletes user files | Since 2026-09-10 (~2.5 mo) | Data-loss risk, no fix PR visible. |
| [#43033](https://github.com/NousResearch/hermes-agent/issues/43033) Multiple Nix profiles | Since 2026-06-09 (~5.5 mo) | Highest 👍 (8); long-neglected packaging request. |
| [#65530](https://github.com/NousResearch/hermes-agent/issues/65530) Profile import failure | Since 2026-07-16 (~4 mo) | Related import/symlink class now partially fixed (#150724) but this instance remains open. |
| [#92059](https://github.com/NousResearch/hermes-agent/issues/92059) Profile export symlinks rejected | Since 2026-08-22 (~3 mo) | Marked `duplicate` but still open; #150724 may supersede. |
| [#101910](https://github.com/NousResearch/hermes-agent/issues/101910) `before_final` hook | Since 2026-09-03 (~2.8 mo) | `needs-decision`, blocks memory-provider ecosystem. |
| [#137924](https://github.com/NousResearch/hermes-agent/issues/137924) Plugin credentials route | Since 2026-10-13 (~1.4 mo) | Catalog rule 11 compliance gap. |

**Recommendation:** The completion-notification bug family is being actively drained, but the **state.db write-lock (#159886)**, **Windows `write_file` (#159709)**, and **hop-cap silent drops (#159446)** are fresh, high-severity, and currently lack merged fixes — these deserve triage priority before v0.24.0 freeze. Long-deferred decisions on **#62780** and **#43033** would benefit from explicit maintainer responses to reduce community stagnation.

</details>

<details>
<summary><strong>IronClaw</strong> — <a href="https://github.com/nearai/ironclaw">nearai/ironclaw</a></summary>

No activity in the last 24 hours.

</details>

<details>
<summary><strong>QwenPaw</strong> — <a href="https://github.com/agentscope-ai/QwenPaw">agentscope-ai/QwenPaw</a></summary>

# QwenPaw Project Digest — 2026-11-25

## 1. Today's Overview

QwenPaw shows **high-velocity maintenance activity** with 21 issues and 43 PRs updated in the last 24 hours, though no new releases were cut. The project is in an active pre-release stabilization phase for **v2.3.1-beta.1**, with a release-duty installation verification issue (#8861) still open. A notable wave of security and sandbox-hardening design issues (#8878–#8882) from a single contributor (`tanbopiao`) signals growing scrutiny of the project's isolation guarantees as it matures toward production use. Meanwhile, several **Windows-specific stability problems** (orphaned `llama-server.exe`, desktop transcript jumping) suggest cross-platform robustness remains a gap.

---

## 2. Releases

**No new releases in the last 24h.**

The most recent published version remains **v2.3.1-beta.1**, whose installation verification is still tracked in [Issue #8861](https://github.com/agentscope-ai/QwenPaw/issues/8861). Users are actively testing `v2.3.0.post1` and `v2.3.1-beta.1`, and multiple regressions have been filed against them (see section 5).

---

## 3. Project Progress

**Closed/Merged PRs today:**

- **[PR #8886](https://github.com/agentscope-ai/QwenPaw/pull/8886)** `[CLOSED]` — `feat(creator): release 2.0.7 with review recovery and media fixes`. This bundles fixes for the Creator plugin, including clearing stale artifact references on rejection and media handling corrections. Directly addresses the hard-blocker review loop described in [Issue #8592](https://github.com/agentscope-ai/QwenPaw/issues/8592).
- **[PR #8837](https://github.com/agentscope-ai/QwenPaw/pull/8837)** `[CLOSED]` — `fix(cli): remove deprecated mission command`. Removes orphaned Mission CLI code, resolving the `/api/api/chat/send` duplication bug ([Issue #8833](https://github.com/agentscope-ai/QwenPaw/issues/8833)).

**Notable open PRs advancing features:**

- **[PR #8586](https://github.com/agentscope-ai/QwenPaw/pull/8586)** `[size/XXXL]` — Unifies session configuration for ACP and native execution.
- **[PR #8719](https://github.com/agentscope-ai/QwenPaw/pull/8719)** `[size/XXL]` — Runtime base-path deployment support for reverse-proxy setups.
- **[PR #8444](https://github.com/agentscope-ai/QwenPaw/pull/8444)** `[size/XL]` — Linux `.deb`/AppImage desktop packaging (closes a platform gap).
- **[PR #8859](https://github.com/agentscope-ai/QwenPaw/pull/8859)** `[size/XXXL]` — Clarifies confirmation/approval UX across Console.

**Issues closed today:** #8811 (narrow-screen clipping), #8706 (Creator input lag), #8592 (Creator review blocker), #8833 (CLI API prefix), #8057 (Anthropic context meter under-reporting).

---

## 4. Community Hot Topics

| Item | Comments | Link |
|---|---|---|
| #8811 narrow-screen message clipping | 5 | [link](https://github.com/agentscope-ai/QwenPaw/issues/8811) |
| #6274 `ask_user_question` HITL tool | 4 | [link](https://github.com/agentscope-ai/QwenPaw/issues/6274) |
| #8592 Creator review undecideable | 2 | [link](https://github.com/agentscope-ai/QwenPaw/issues/8592) |
| #8875 MCP streamable_http error masking | 2 | [link](https://github.com/agentscope-ai/QwenPaw/issues/8875) |
| #8893 Console model settings scope | 2 | [link](https://github.com/agentscope-ai/QwenPaw/issues/8893) |

**Analysis:** The hottest engagement is around **Human-in-the-Loop tooling** (#6274, still open since July with a 👍) — users want the agent to pause and ask structured questions rather than guess. This is a recurring theme of "safety over autonomy." The second cluster is **Console correctness** — model scope (#8893), transcript jumping (#8888), and narrow-screen clipping (#8811) all point to friction in the web UI as usage scales.

---

## 5. Bugs & Stability

Ranked by severity:

1. **🔴 [Issue #8887](https://github.com/agentscope-ai/QwenPaw/issues/8887)** — *Media blocks in tool results cause 400 BadRequestError on non-multimodal models, poisoning all subsequent messages.* Effectively bricks a session after any `view_video` / `send_file_to_user` call against a text-only model. No fix PR yet.
2. **🔴 [Issue #8830](https://github.com/agentscope-ai/QwenPaw/issues/8830)** — *Windows: orphaned `llama-server.exe` processes accumulate across backend restarts, exhausting memory.* Resource leak prevents local model startup. No fix PR yet.
3. **🟠 [Issue #8875](https://github.com/agentscope-ai/QwenPaw/issues/8875)** — *MCP `streamable_http` client masks server 4xx as "not connected" and tears down the session.* **Fix PR exists: [PR #8895](https://github.com/agentscope-ai/QwenPaw/pull/8895)**.
4. **🟠 [Issue #8851](https://github.com/agentscope-ai/QwenPaw/issues/8851)** — *Console import map remaps entry chunk to `?v=…`, causing double bundle load and plugin routes never registering.*
5. **🟡 [Issue #8890](https://github.com/agentscope-ai/QwenPaw/issues/8890)** & **#8891** — *OpenAI-compatible discovery ignores `max_input_tokens`; context tables lack glm-5.3/5.4.* Wrong context windows reported.
6. **🟡 [Issue #8888](https://github.com/agentscope-ai/QwenPaw/issues/8888)** — *Transcript jumps back several screens when content height shrinks* (Windows 11 / WebView2).

**Regression watch:** #8811 was a regression introduced in `v2.3.0.post1` (narrow-screen clipping) — now closed, indicating fast turnaround on UI regressions.

---

## 6. Feature Requests & Roadmap Signals

- **[#6274](https://github.com/agentscope-ai/QwenPaw/issues/6274) `ask_user_question` tool** — Human-in-the-Loop. **High likelihood candidate** for a near-term release given sustained interest and clear spec.
- **[#8892](https://github.com/agentscope-ai/QwenPaw/issues/8892) "AI Prompt Polishing" button** — One-click prompt refinement in the chat input. Low-effort, high-visibility UX win; plausible for v2.4.
- **[#8882](https://github.com/agentscope-ai/QwenPaw/issues/8882) Reference-counted archival for long-term memory** — Directly ties to the README's "Never forgets" promise and the recurring "agent keeps forgetting" complaint (#7571).
- **[#8881](https://github.com/agentscope-ai/QwenPaw/issues/8881) Tenant scoping at retrieval layer** and **[#8880](https://github.com/agentscope-ai/QwenPaw/issues/8880) Skill-scan fail-open** — Security/architecture hardening, likely to be gated behind design discussion rather than the next point release.

**Prediction:** The next minor release likely folds in #6274 (HITL), prompt polishing, and the Console confirmation-flow PR (#8859), which is already open and large.

---

## 7. User Feedback Summary

**Pain points expressed by users:**

- **Console UI fragility** — clipping, jumping transcripts, and confusing model configuration (#8893) erode trust in the web interface as the primary surface.
- **Memory/recall dissatisfaction** — the "keeps forgetting" theme (referenced via #7571 in #8882) directly contradicts marketing claims, a reputational risk.
- **Local model lifecycle on Windows** — orphaned processes (#8830) reflect a real operational burden for desktop users.
- **Creator plugin reliability** — #8592's hard-blocker review loop (now fixed via PR #8886) shows the plugin ecosystem is maturing but had sharp edges.

**Satisfaction signals:** Fast closure of regressions (#8811, #8706) and multiple first-time contributors ([PR #8895](https://github.com/agentscope-ai/QwenPaw/pull/8895), [#8894](https://github.com/agentscope-ai/QwenPaw/pull/8894), [#7936](https://github.com/agentscope-ai/QwenPaw/pull/7936)) indicate a healthy, welcoming contributor pipeline.

---

## 8. Backlog Watch

Issues/PRs needing maintainer attention (oldest or highest-impact, still unresolved):

| Item | Age | Why it matters |
|---|---|---|
| [#6274](https://github.com/agentscope-ai/QwenPaw/issues/6274) `ask_user_question` | ~4 months | High community interest, no assignee; HITL is a safety differentiator. |
| [PR #8586](https://github.com/agentscope-ai/QwenPaw/pull/8586) session config unification | ~3 weeks | `size/XXXL`, still open — large refactor blocking other runtime work. |
| [PR #8444](https://github.com/agentscope-ai/QwenPaw/pull/8444) Linux desktop packaging | ~1 month | Closes a major platform gap; needs review bandwidth. |
| [PR #8061](https://github.com/agentscope-ai/QwenPaw/pull/8061) OpenAI prompt cache params | ~2 months | Long-standing, `size/M`, low risk. |
| [PR #8268](https://github.com/agentscope-ai/QwenPaw/pull/8268) task_tracker cleanup | ~40 days | Fixes a run-stuck-forever bug half of #8173. |
| [#8861](https://github.com/agentscope-ai/QwenPaw/issues/8861) v2.3.1-beta.1 install verification | 2 days | **Release blocker** — must pass before GA. |

**Maintainer recommendation:** Prioritize (1) closing out #8861 to unblock v2.3.1 GA, (2) reviewing PR #8895 to close the MCP error-masking bug, and (3) triaging #8887 and #8830, which currently have no fix path.

---

*Digest generated from GitHub activity data for 2026-11-25. All links reference `github.com/agentscope-ai/QwenPaw`.*

</details>

<details>
<summary><strong>ZeroClaw</strong> — <a href="https://github.com/zeroclaw-labs/zeroclaw">zeroclaw-labs/zeroclaw</a></summary>

# ZeroClaw Project Digest — 2026-11-25

## 1. Today's Overview

ZeroClaw is in a high-velocity development phase, with 50 PRs updated in the last 24 hours (42 open, 8 merged/closed) and 9 active issues, but zero new releases. The PR activity is dominated by a large stacked refactor of the provider registry (PRs #12450, #12452, #12454, #12455, #12456, #12457) and an ACP/WebChat cutover effort (PRs #12651, #12652, #12654), both authored by repeat contributors. Issue activity skews toward security/architecture trackers (OIDC, runtime crate splitting) and S2-severity bugs in the MCP, Matrix, email, and model-switching paths. Overall project health is strong on contribution volume, but the absence of releases and a growing backlog of high-risk, status-blocked items (e.g., #9945) warrant attention.

## 2. Releases

No new releases in the last 24 hours. The most recent shipped version referenced in issue activity is **v0.9.0** (2026-11-12), which included the core OIDC stack and dashboard sign-in ([Issue #8289](https://github.com/zeroclaw-labs/zeroclaw/issues/8289)). Remaining OIDC close-out items are targeted at **v0.9.1**.

## 3. Project Progress

**Merged/closed PRs today (8 total):** The only closed PR surfaced in the top-20 is [#12398](https://github.com/zeroclaw-labs/zeroclaw/pull/12398) — `fix(runtime): surface exit status and stderr on failed shell runs`. This improves diagnosability of failed `shell` tool invocations by populating the `error` field with exit status and stderr (falling back to stdout), directly benefiting model self-correction and run-log forensics.

**Features advancing (open, actively updated):**
- **Provider registry V5 migration** — [#12450](https://github.com/zeroclaw-labs/zeroclaw/pull/12450) activates the decoupled V5 provider registry with per-model bindings and V4→V5 config-boundary migration; supporting layers [#12454](https://github.com/zeroclaw-labs/zeroclaw/pull/12454), [#12455](https://github.com/zeroclaw-labs/zeroclaw/pull/12455), [#12456](https://github.com/zeroclaw-labs/zeroclaw/pull/12456), [#12457](https://github.com/zeroclaw-labs/zeroclaw/pull/12457), [#12452](https://github.com/zeroclaw-labs/zeroclaw/pull/12452) add domain types, shared transport, timeout separation, config reflection, and Zerocode model selection.
- **ACP dashboard cutover** — [#12654](https://github.com/zeroclaw-labs/zeroclaw/pull/12654), [#12652](https://github.com/zeroclaw-labs/zeroclaw/pull/12652), [#12651](https://github.com/zeroclaw-labs/zeroclaw/pull/12651) wire ACP startup cutover, durable session management, legacy `gw_*` import, and runtime parity for WebChat policy/accounting/steering.
- **New channels/providers** — SimpleX messaging with voice notes and encrypted calls ([#12316](https://github.com/zeroclaw-labs/zeroclaw/pull/12316)), bf16.ai provider slot ([#12696](https://github.com/zeroclaw-labs/zeroclaw/pull/12696)), and Codex subscription usage in web chat ([#12691](https://github.com/zeroclaw-labs/zeroclaw/pull/12691)).

**Removals:** [#12678](https://github.com/zeroclaw-labs/zeroclaw/pull/12678) removes the `gemini_cli` coding tool outright, citing Google's replacement of Gemini CLI with Antigravity CLI and the June 18, 2026 shutdown of free/Pro/Ultra account access.

## 4. Community Hot Topics

| Item | Type | Comments | Underlying need |
|---|---|---|---|
| [#9945](https://github.com/zeroclaw-labs/zeroclaw/issues/9945) | Issue | 7 | Browser tool exposes only 16 of agent-browser's 100+ commands; iframes, JS dialogs, tabs, and form controls are unreachable. Users need full browser automation parity. Currently `status:blocked`, `risk:high`. |
| [#8289](https://github.com/zeroclaw-labs/zeroclaw/issues/8289) | Issue (tracker) | 6 | OIDC milestone close-out: canonical principals and inbound authentication. Core stack shipped in v0.9.0; remaining items on v0.9.1. Reflects demand for enterprise-grade identity. |
| [#12055](https://github.com/zeroclaw-labs/zeroclaw/issues/12055) | Issue (bug) | 3 | MCP HTTP client lacks pool/keep-alive control; stale pooled sockets cause outcome-unknown tool calls. Reliability concern for long-running agents. |
| [#12697](https://github.com/zeroclaw-labs/zeroclaw/issues/12697) | Issue (tracker) | 3 (👍 1) | Split `zeroclaw-runtime` into smaller crates. Maintainer-driven architecture hygiene; the only issue with a positive reaction today. |

The pattern is clear: the community's most-engaged threads are about **capability completeness** (browser tool), **security/identity hardening** (OIDC), and **runtime reliability** (MCP sockets, crate decomposition).

## 5. Bugs & Stability

Ranked by severity as labeled:

1. **S2 — MCP stale socket loses tool call as outcome-unknown** — [#12055](https://github.com/zeroclaw-labs/zeroclaw/issues/12055). `build_remote_http_client` uses a bare `reqwest::Client::builder()` with no pool tuning in `crates/zeroclaw-tools/src/mcp_transport.rs`. No fix PR linked yet.
2. **S2 — Matrix tool-approval prompts posted to room timeline instead of thread** — [#12558](https://github.com/zeroclaw-labs/zeroclaw/issues/12558). With `reply_in_thread = true`, approval prompts break conversation isolation. No fix PR linked.
3. **S2 — `/model <id>` reports success but requests use the profile's configured model** — [#12667](https://github.com/zeroclaw-labs/zeroclaw/issues/12667). Misleading UX and silent config divergence. No fix PR linked.
4. **Email channel UNSEEN backlog re-answering** — [#12703](https://github.com/zeroclaw-labs/zeroclaw/issues/12703). Live-processed messages never get the IMAP `\Seen` flag, so every daemon restart re-dispatches the entire backlog. No severity label; no fix PR linked.

**Fix shipped today:** [#12398](https://github.com/zeroclaw-labs/zeroclaw/pull/12398) (closed) improves shell-failure diagnostics — a stability/observability win rather than a bug fix per se.

Notably, **none of the four open S2 bugs have a linked fix PR**, which is a stability risk if they persist into the next release.

## 6. Feature Requests & Roadmap Signals

- **Native local Turso as opt-in memory backend** — [#12709](https://github.com/zeroclaw-labs/zeroclaw/issues/12709) (filed today). Requests the embedded Rust Turso engine (not libSQL/Turso Cloud) as an alternative to SQLite WAL for curated memories. SQLite remains default. **Likely candidate for a near-term opt-in feature** given the low-risk, additive framing.
- **Daemon-held OIDC refresh grants for device sessions (ADR-017)** — [#12707](https://github.com/zeroclaw-labs/zeroclaw/issues/12707) (filed today). Implementation tracker for keeping device-bound Zerocode sessions alive via IdP refresh held by the daemon. Pairs with the v0.9.1 OIDC close-out ([#8289](https://github.com/zeroclaw-labs/zeroclaw/issues/8289)) — **strong signal this lands in v0.9.1**.
- **Browser tool command expansion** — [#9945](https://github.com/zeroclaw-labs/zeroclaw/issues/9945). Long-standing, currently blocked; if unblocked, would be a headline feature.
- **Runtime crate split** — [#12697](https://github.com/zeroclaw-labs/zeroclaw/issues/12697). Maintainer roadmap item; expect a sequence of refactor PRs rather than a user-visible feature.

**Prediction:** v0.9.1 will most likely bundle the OIDC close-out (#8289, #12707) plus provider-registry V5 follow-through. Turso (#12709) is a plausible v0.9.x opt-in if a contributor picks it up.

## 7. User Feedback Summary

**Pain points expressed:**
- **Incomplete tooling surface** — the browser tool's 16/100+ command gap (#9945) is the loudest complaint, blocking real automation workflows involving iframes, dialogs, and forms.
- **Silent misbehavior** — the `/model` switch bug (#12667) and email UNSEEN backlog (#12703) both share a theme: the system reports success while doing something else, eroding operator trust.
- **Reliability of long-lived connections** — MCP socket reuse (#12055) causes outcome-unknown states, the worst class of failure for an agent that must decide whether to retry.
- **Channel correctness** — Matrix thread isolation (#12558) matters to users running multi-conversation rooms.

**Satisfaction signals:** Rapid merge cadence on provider/config refactors and the shipped OIDC core in v0.9.0 suggest contributors are satisfied with the direction; the positive reaction on the runtime-split tracker (#12697, 👍 1) indicates maintainer-aligned architectural work is welcomed.

## 8. Backlog Watch

- **[#9945](https://github.com/zeroclaw-labs/zeroclaw/issues/9945)** — Open since **2026-08-12** (~3.5 months), 7 comments, `status:blocked`, `risk:high`, `priority:p2`. The oldest and most-commented active issue; needs a decision on unblocking the browser backend expansion.
- **[#8289](https://github.com/zeroclaw-labs/zeroclaw/issues/8289)** — Open since **2026-06-24** (~5 months). Explicitly a close-out tracker; needs maintainer confirmation that remaining v0.9.1 items are scoped and assigned.
- **[#12450](https://github.com/zeroclaw-labs/zeroclaw/pull/12450)** — Open since **2026-11-15**, size XL, `risk: high`, `needs-author-action`. The keystone of the provider V5 stack; its review latency gates five dependent PRs.
- **[#12456](https://github.com/zeroclaw-labs/zeroclaw/pull/12456)** — Open since **2026-11-15**, `needs-maintainer-review`, size XL. A stacked dependency for the registry work; maintainer review is the bottleneck.
- **[#12316](https://github.com/zeroclaw-labs/zeroclaw/pull/12316)** — Open since **2026-11-09** (~2 weeks), size XL, adds SimpleX channel. A substantial community contribution at risk of stalling without review bandwidth.

**Health note:** The project's main constraint is not contribution supply but **review throughput on XL, high-risk PRs** and **unblocking the browser tool issue**. Clearing the provider-V5 stack and assigning owners to the four S2 bugs would materially improve the path to v0.9.1.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*