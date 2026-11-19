# OpenClaw Ecosystem Digest 2026-11-19

> Issues: 486 | PRs: 500 | Projects covered: 5 | Generated: 2026-11-19 02:29 UTC

- [OpenClaw](https://github.com/openclaw/openclaw)
- [Hermes Agent](https://github.com/nousresearch/hermes-agent)
- [IronClaw](https://github.com/nearai/ironclaw)
- [QwenPaw](https://github.com/agentscope-ai/QwenPaw)
- [ZeroClaw](https://github.com/zeroclaw-labs/zeroclaw)

---

## OpenClaw Deep Dive

# OpenClaw Project Digest — 2026-11-19

## 1. Today's Overview

OpenClaw shows very high sustained activity: **486 issues** and **500 PRs** updated in the last 24h, with a healthy merge/close ratio (215 of 500 PRs merged or closed; 131 of 486 issues closed). One new release shipped — **v2026.10.33**, an `extended-stable` (LTS-equivalent) gateway-only release bundling critical security and reliability fixes. The issue mix skews toward **stability and session-state defects**: top-commented open items involve gateway stop failures on macOS, synchronous persistence blocking the event loop, and SQLite WAL/update finalization problems. Overall health is solid but the project is carrying a heavy maintenance load of P1/P0 session-state, message-loss, and crash-loop bugs across platforms (macOS, Windows, Linux/K8s), which suggests the `extended-stable` line is absorbing fixes faster than regressions are being closed.

---

## 2. Releases

**v2026.10.33** — `openclaw 2026.10.33` (gateway-only, `extended-stable` / LTS-equivalent)

- Represents OpenClaw as of end of October 2026, plus:
  - Critical security updates
  - Reliability and performance fixes
  - New model support
- **Migration notes:** No breaking changes explicitly documented in the provided release note. As a gateway-only `extended-stable` release, it is positioned for operators who need stability over feature velocity.
- **Caveat worth flagging for operators:** Multiple surrounding issues (#197083, #200606, #201463, #201538) describe managed-update/Doctor failures on nearby versions (11.1→11.3, 11.3→11.5), including "state-migrated-no-rollback" partial finalization and candidate-Doctor migration conflicts. Users upgrading into stable branches should verify Doctor post-install completion and plugin migration state.

---

## 3. Project Progress

**Today (PRs updated 2026-11-19):** 215 PRs merged/closed, 285 still open.

Notable closed/merged work:
- **#201568 (CLOSED)** — test fix accounting for new `turnTainted: "unknown"` hook field; restores plugin CI lane. [link](https://github.com/openclaw/openclaw/pull/201568)
- **#201567 (CLOSED)** — align Goal authority proof with admitted-run policy (fixes 120s E2E timeout after #201377). [link](https://github.com/openclaw/openclaw/pull/201567)
- **#201463 (CLOSED)** — Git checkout updates no longer fail before new release starts on schema change / busy DB. [link](https://github.com/openclaw/openclaw/pull/201463)
- **#201557 (CLOSED)** — SQLite nested page reclamation no longer deadlocks against foreground writer. [link](https://github.com/openclaw/openclaw/pull/201557)
- **#201087 (CLOSED)** — `openclaw status` gateway token conflict hint made readable. [link](https://github.com/openclaw/openclaw/pull/201087)
- **#186942 (CLOSED)** — round-trip LiteLLM thought signatures on openai-completions routes. [link](https://github.com/openclaw/openclaw/pull/186942)
- **#196367 (CLOSED)** — reject captionless message tables instead of silently dropping them. [link](https://github.com/openclaw/openclaw/pull/196367)

**Open but advancing (ready for maintainer look):**
- **#201569** — retryable early chat metadata reads during startup. [link](https://github.com/openclaw/openclaw/pull/201569)
- **#201566** — concurrent chat-history searches stay responsive. [link](https://github.com/openclaw/openclaw/pull/201566)
- **#201545** — package updates can start while Gateway writes to agent DB. [link](https://github.com/openclaw/openclaw/pull/201545)
- **#196659** — browser page-text reads no longer mix documents on mid-read navigation. [link](https://github.com/openclaw/openclaw/pull/196659)

The day's theme: **update/upgrade robustness, SQLite concurrency, and UI reliability**, with several long-running platform fixes converging.

---

## 4. Community Hot Topics

Ranked by comment volume:

1. **#191944 — macOS gateway stop fails: "Process ancestry could not be fully inspected"** (37 comments, P2, UX friction)
   `openclaw gateway stop` and `stop --force` both fail on Intel macOS, blocking managed handoff.
   → Need: reliable macOS service inspection/control; operators are stuck between "retry from independent terminal" and "use Gateway update action."
   [link](https://github.com/openclaw/openclaw/issues/191944)

2. **#119720 — Synchronous agent persistence blocks Gateway event loop at scale** (28 comments, P1, diamond lobster, message-loss + crash-loop)
   Long-running P1 spanning August→November; partial repairs landed (#140231, #138984) but core blocking persists.
   → Need: async/off-loop persistence and transcript maintenance for large deployments.
   [link](https://github.com/openclaw/openclaw/issues/119720)

3. **#197083 — Post-install Doctor WAL verification leaves 11.3 update partially finalized** (25 comments, P2)
   `SQLite WAL commit publication could not be verified`; updater refuses rollback (`state-migrated-no-rollback`) and leaves external plugin state inconsistent.
   → Need: transactional, fully-verified update finalization.
   [link](https://github.com/openclaw/openclaw/issues/197083)

4. **#123792 — Assistant turns render twice with CLI backends** (20 comments, P2, session-state)
   Duplicate persistence via live per-block view + concatenated aggregate; affects webchat and Android, not Telegram.
   → Need: single-source-of-truth turn rendering.
   [link](https://github.com/openclaw/openclaw/issues/123792)

5. **#182891 — Prompt cache never reused (`cache read dropped N -> 0`)** (19 comments, P2)
   Envelope rewrites and `runtimeContextCarrier` changes invalidate cache every request.
   → Need: cache-stable prompt envelopes — directly tied to cost and latency for OpenAI-compatible providers.
   [link](https://github.com/openclaw/openclaw/issues/182891)

6. **#153426 — Curated memory roots silently excluded by provenance ratchet** (18 comments, P0, security + session-state, release-blocker rated)
   `MEMORY.md`/`USER.md` permanently dropped from bootstrap injection after an ordinary web-search turn; no diagnostics, no recovery CLI.
   → Need: recoverable provenance state, operator tooling, and diagnostics for memory injection.
   [link](https://github.com/openclaw/openclaw/issues/153426)

**PR-side hotspots:** #159478 (selective group participation, XL, compatibility risk), #141004 (runtime skill-usage audit), #192350 (GitHub integration → plugin migration), #129388 (context-pressure-aware continuation, XL, multi-channel), #194376 (gateway admission for `sessions_send` wake starts, cross-channel).

---

## 5. Bugs & Stability

**Critical / release-blocker class:**

- **#153426 (P0)** — Memory roots permanently excluded from bootstrap after benign agent behavior. Security- and session-state-flagged; needs product decision + security review. No fix PR.

- **#119720 (P1)** — Event-loop blocking from synchronous persistence; message-loss and crash-loop impacts. Partial repairs only; no new fix PR.

- **#194451 (P1, CLOSED)** — `/think` and other directives during an agent turn killed the turn with `SqliteTranscriptMutationConflictError`; #192585 had only covered `/status`. **Closed with linked PR** — this is a genuine win.

- **#196199 (P1)** — Regression since 2026.10.10: native Codex helper completions fail to resume parents, pausing goals and locking users out. Needs info; high user impact.

- **#152965 (P1)** — Hot-reloading a non-channel plugin disposes channel plugins without reconnecting, cutting streams and dropping inbound messages.

- **#191476 (P1)** — Matrix rooms stuck on "Plugin matrix consumer is closed" after image_generate races inbound message. A fix PR candidate exists: **#201554**.

- **#198218 (P1)** — Doctor/update maintenance livelock on stopped Gateway (reproduced on 2026.10.6 and 11.3); update-run admission re-hashes unchanged state DB indefinitely.

- **#135712 / #157712 (P1)** — CLI state reads leak ~162 MB read-only DB snapshots into cache; reported 23 GB in 25 min from scheduled scripts. A modern relative is **#170496** (per-read snapshot copies on busy Gateway).

- **#200606 (P1)** — 2026.11.5 candidate Doctor blocks update with plugin migration conflict and `changed=[]`.

**Notable closed-as-resolved today:**

- **#192667 (CLOSED)** — macOS Settings slowness and dark-theme input visibility both resolved after gateway update to 2026.11.5 (reporter confirmed).
- **#164279 (CLOSED)** — self-learning background experience review 0% completion (50 consecutive failures since 2026-09-27).
- **#151962 (CLOSED)** — phantom user messages from internal runtime strings not persisted to `transcript_events`.

**Fix-PR availability snapshot:** Several high-severity items now have open candidate PRs on the board — #201554 (Matrix consumer recovery), #201545 (update vs. live agent DB), #201463 (closed; Git checkout half-switch), #201538 (finish half-switched Git update). The WAL/update-finalization cluster (#197083, #200606, #198218) still lacks a merged fix.

---

## 6. Feature Requests & Roadmap Signals

- **#170562 — Doctor recovery for stranded requester settle wakes** — targeted operator recovery without hand-editing the state DB. High likelihood of landing given the pattern of adjacent Doctor tooling work.
- **#179954 (P3) — Per-entry chunking paths for curated memory** — lets list-style `memory/` files index one entry per chunk. Plausible for a memory-core minor release.
- **#169428 (P3) — Usage footer expose auth profile (`model.auth_label`)** — parity with `/status`; low-risk, likely fast-tracked.
- **#154524 — Accessibility: chat messages as headings for screen reader navigation** — accessibility investment signal.
- **#155039 — Manual team-sidebar agent ordering** — operator UX for multi-agent teams.
- **#183048 — CLI to inspect/settle `unknown_after_send` outbound entries** — Slack delivery reconciliation tooling; fits the reliability theme of the current cycle.

**Prediction:** The next release window is most likely to emphasize (a) update/Doctor hardening, (b) SQLite/WAL concurrency and reclamation, (c) cache-stability work (#182891, #198373, #155868 cluster), and (d) memory provenance recovery (#153426). These areas dominate both issue volume and active PRs.

---

## 7. User Feedback Summary

**Pain points expressed by real users:**

- **Upgrade trust is eroding.** Multiple independent reports (#197083, #200606, #201463 pre-fix, #201538) describe updates failing at Doctor/preflight or finalizing only partially, occasionally with rollback refused. One reporter even confirmed symptoms *resolved by updating* (#192667), highlighting how update quality directly gates user experience.
- **macOS operational gaps.** #191944 (stop fails), #195192 (Safari 27.3 missing composer), #167696 (Voice Wake ignores session route), #185578-lineage memory growth — Mac users are hitting platform-specific friction repeatedly.
- **Cost/latency anxiety.** Prompt-cache collapse (#182891, #198373) and Chinese quota-exhaustion failover (#177077) directly affect spend and reliability on third-party providers.
- **Silent data loss is the most feared class.** Phantom messages (#151962), dropped inter-session messages (#144594), memory roots vanishing (#153426), and duplicate/misplaced replies (#179003) all draw strong engagement.
- **Satisfaction signals:** Reporter-confirmed resolutions (#192667), closure of the `/think` mutation conflict (#194451), and the steady flow of "ready for maintainer look" PRs indicate contributors remain engaged and fixes do land — but the backlog of P1 session-state issues suggests users would benefit from a focused stabilization cycle.

---

## 8. Backlog Watch

Long-running or high-severity items needing maintainer attention:

| Issue | Age | Severity | Why it matters |
|---|---|---|---|
| [#119720](https://github.com/openclaw/openclaw/issues/119720) | ~3.5 months | P1 | Event-loop blocking at scale; only partial fixes |
| [#153426](https://github.com/openclaw/openclaw/issues/153426) | ~2 months | P0 | Permanent silent memory-root exclusion; needs product + security decision |
| [#112638](https://github.com/openclaw/openclaw/issues/112638) | ~4 months | P2 | `session.maintenance enforce` silently unbounded; thread/channel entries exempt |
| [#127195](https://github.com/openclaw/openclaw/issues/127195) | ~3 months | P2 | 16 call sites emit identical error with no reason code — undebuggable in production |
| [#152965](https://github.com/openclaw/openclaw/issues/152965) | ~2 months | P1 | Plugin hot-reload disposes channel plugins; drops inbound messages |
| [#162585](https://github.com/openclaw/openclaw/issues/162585) | ~7 weeks | P2 | Windows plugin staging never converges (290 MB → 612 MB); gateway never healthy |

**Backlog PRs needing direction:** #159478 (group participation, stalled "waiting on author"), #129388 (continuation, XL, `clawsweeper-recovery-stuck`), #194376 (gateway `sessions_send` admission, very broad surface), #192350 (GitHub plugin migration, depends on #192349).

**Overall health verdict:** The project is *actively maintained and responsive* — 215 PRs closed and 131 issues resolved in 24h — but is in a **stabilization-required phase**: severity-weighted backlog is dominated by session-state, update-pipeline, and platform-specific stability defects. The `extended-stable` release cadence is a sensible mitigation; the main risk is that regression inflow (regressions like #196199, #198373) may outpace the fix pipeline without a dedicated hardening milestone.

---

## Cross-Ecosystem Comparison

# Cross-Project Comparison Report
**Personal AI Assistant / Agent Open-Source Ecosystem**
*Snapshot date: 2026-11-19*

---

## 1. Ecosystem Overview

The personal AI assistant open-source landscape in late 2026 is bifurcated between **mature, stabilization-phase platforms** (OpenClaw) and **fast-iterating challengers executing architectural pivots** (QwenPaw, ZeroClaw, Hermes Agent). Activity is dominated by the same core concerns across every project: session-state integrity, prompt-cache economics, update/upgrade trust, and security of persisted credentials. None of the projects is feature-starved — the binding constraint is *reliability debt* accumulated from aggressive feature velocity, with severity-weighted backlogs concentrated in P0/P1 session-state and update-pipeline defects. The ecosystem is converging on a common architecture (plugin-based extensibility, MCP integration, multi-channel gateways, LTS-style release lines), while differentiation shifts to target user, channel coverage, and governance posture.

---

## 2. Activity Comparison

| Project | Issues (24h) | PRs (24h) | Merge/Close Ratio | Release Status | Health Score* |
|---|---|---|---|---|---|
| **OpenClaw** | 486 updated / 131 closed | 500 updated / 215 merged-closed | ~43% PR, ~27% issue | **v2026.10.33** shipped (`extended-stable`, gateway-only) | **7.5 / 10** — high throughput, heavy P0/P1 backlog |
| **Hermes Agent** | 50 updated / 6 closed | 50 updated / 14 merged-closed | ~28% PR, ~12% issue | **v0.23.2+canary** (no changelog) | **7.0 / 10** — healthy velocity, backlog-heavy |
| **QwenPaw** | 14 updated | 29 updated / 11 merged-closed | ~38% PR | **v2.3.0.post1** (post-release patch; regressions flagged) | **6.5 / 10** — post-release regressions strain trust |
| **ZeroClaw** | 50 updated / 10 closed | 50 updated / **2 merged-closed** | **~4% PR** (low merge day) | No release; **v0.9.1** in flight | **6.5 / 10** — strong triage, stalled XL PRs |
| **IronClaw** | — | — | — | No activity in 24h | **N/A** |

\* Health score is a composite heuristic weighting throughput, severity-weighted backlog, release discipline, and community responsiveness — not an official project metric.

**Key observation:** OpenClaw operates at ~10× the absolute activity of its peers, which is expected given its role as the reference implementation. However, its **issue-close rate (27%) trails its PR-close rate (43%)**, indicating issues accumulate faster than they resolve. ZeroClaw's **2:48 merge-to-open PR ratio** today is the weakest signal in the set — a review-bandwidth bottleneck, not a contribution drought.

---

## 3. OpenClaw's Position

**Advantages vs. peers:**
- **Scale and maturity.** 486 issues / 500 PRs in 24h is an order of magnitude above any peer. It has the only **LTS-equivalent release line** (`extended-stable`), a signal that operators treat it as production infrastructure rather than a project to tinker with.
- **Channel breadth.** Session-state bugs span webchat, Android, Telegram, Matrix, Slack — evidence of the widest surface area in the ecosystem.
- **Ecosystem gravity.** Community hot topics (#159478 group participation, #192350 GitHub plugin migration) show third-party extension pressure that peers have not yet attracted at comparable volume.

**Technical approach differences:**
- OpenClaw runs a **gateway-centric architecture** with SQLite-backed transcript/session persistence and a `Doctor` diagnostic/migration subsystem. This is a heavier, operator-oriented design than peers.
- Hermes Agent emphasizes **CLI-first ergonomics with a Desktop companion**; QwenPaw is mid-pivot to a **plugin-extracted "lighter core"**; ZeroClaw is **SOP- and permission-tier-centric** (fail-closed decision gates, multi-agent scoping).

**Community size comparison (proxy: 24h issue+PR touch volume):**

| Project | 24h touch volume | Relative community scale |
|---|---|---|
| OpenClaw | ~986 | **~10× baseline** |
| Hermes Agent | ~100 | ~1× |
| ZeroClaw | ~100 | ~1× |
| QwenPaw | ~43 | ~0.4× |

**Verdict:** OpenClaw is the de facto reference and the only project with an enterprise-operator posture. Its risk is **regression inflow outpacing fixes** — a classic scaling hazard for a project carrying everyone else's use cases.

---

## 4. Shared Technical Focus Areas

Four requirements recur independently across multiple projects, indicating ecosystem-level gaps rather than project-specific bugs:

**A. Session-state integrity / message duplication**
- *OpenClaw*: #123792 (assistant turns render twice, CLI backends); #151962 (phantom user messages)
- *Hermes*: #137287 (Desktop transcript duplicates/scatters/drops); #131591 (double-rendered turns); #156739 (internal summaries shown as user bubbles)
- *QwenPaw*: #8806 (phantom user messages drive looping)
- **Shared need:** single-source-of-truth turn rendering with deduplication across live-stream and hydrated views. This is the single most cross-cutting defect class in the ecosystem.

**B. Prompt-cache economics and cost control**
- *OpenClaw*: #182891 (`cache read dropped N → 0`); #198373 cluster
- *Hermes*: #156455 (merged — cache kept warm while it pays, then compacts); #157583 (cache miss after image turn)
- *ZeroClaw*: #11696 (system prompt rebuilt from disk every turn busts cache)
- **Shared need:** cache-stable prompt envelopes and idle-cache economics. Every project with multi-provider support is bleeding cost here.

**C. Update/upgrade trust and transactional finalization**
- *OpenClaw*: #197083, #200606, #198218, #201463 — Doctor/WAL finalization failures, refused rollbacks
- *QwenPaw*: #8811, #8812 — regressions introduced by v2.3.0.post1
- *ZeroClaw*: SHA256SUMS verification parity for Windows installers (#12122)
- **Shared need:** transactional, verifiable update pipelines with rollback. This is the top *trust-eroding* class — users explicitly state they are wary of updating.

**D. Runaway-loop / safety-gate reliability**
- *QwenPaw*: #8712 (`DoomLoopGate` never fires in production)
- *OpenClaw*: #119720 (event-loop blocking → crash-loop), #153426 (P0 memory-root exclusion)
- *ZeroClaw*: #11124 (S0 SOP decision-gate bypass — now fixed by #12237)
- **Shared need:** safety mechanisms that are *proven to fire* under adversarial/repetitive input, not just present in code.

**E. Credential/secret handling on disk**
- *Hermes*: #62336 (terminal env snapshots persist credentials to disk); #157615 (redaction misses label-prefixed dumps)
- *OpenClaw*: #153426 (P0, security-flagged memory provenance)
- *QwenPaw*: #7757, #8028 (destructive-command and COM-automation guards)
- **Shared need:** defense-in-depth for persisted state, with redaction classifiers that handle real-world secret formats.

---

## 5. Differentiation Analysis

| Dimension | OpenClaw | Hermes Agent | QwenPaw | ZeroClaw |
|---|---|---|---|---|
| **Target user** | Operators / enterprise deployments | Developers / power CLI users | Plugin developers, Chinese-language users | Security-conscious multi-agent operators |
| **Architecture** | Gateway + SQLite, Doctor subsystem | CLI + Desktop, provider-routing | Plugin-extracted "lighter core" | SOP engine, permission tiers, fail-closed gates |
| **Release posture** | LTS-equivalent (`extended-stable`) | Canary-only (no changelog) | Rapid post-releases (regression-prone) | Feature-gated on v0.9.1 → v0.10 |
| **Signature feature focus** | Channel breadth, session continuity | Prompt-cache economics, cua-driver computer-use | Plugin SDK 1.1, MCP-as-plugin | Canonical provider registry, SOP authorization |
| **Weakest link** | P0/P1 backlog (memory provenance, event loop) | Desktop transcript integrity, credential persistence | Post-release validation, resource caps | XL PR review bottleneck |
| **Notable differentiator** | Only project with production-stable line | Deepest cost-optimization work | Most aggressive plugin-ecosystem pivot | Strongest security close-out cadence (10 issues/day) |

**Architectural divergence:** OpenClaw and ZeroClaw both invest heavily in **authorization boundaries** (Doctor migrations vs. SOP decision gates), while Hermes optimizes for **economic efficiency** (cache warming, offload) and QwenPaw optimizes for **extensibility surface** (theme tokens, plugin lifecycle). These are complementary rather than competing strategies — the ecosystem is specializing.

---

## 6. Community Momentum & Maturity

**Tier 1 — Reference scale, stabilization-required**
- **OpenClaw.** Actively maintained and responsive (215 PRs closed in 24h), but in a **stabilization-required phase**. Severity-weighted backlog is dominated by session-state, update-pipeline, and platform-specific defects. The `extended-stable` cadence is the correct mitigation; the risk is regression inflow outpacing the fix pipeline.

**Tier 2 — High velocity, architectural pivot**
- **QwenPaw.** Rapidly iterating toward a plugin-based core with multiple XXXL PRs in flight, but **post-release regressions (#8811, #8812) are eroding trust**. Momentum is real; release validation is the bottleneck.
- **Hermes Agent.** High maintainer throughput (14 merged/closed, coherent salvage wave), engaged extension ecosystem, but long-tail P2 bugs persist weeks-to-months with `needs-repro`/`needs-decision` tags.

**Tier 3 — Hardening phase, review-bound**
- **ZeroClaw.** Strong triage responsiveness (10 issues closed today, security-heavy) but **review bandwidth is the binding constraint** — 2 merged PRs against 48 open, with XL PRs (#10391, #10412, #11847) stalled on author/maintainer action. Momentum is positive; throughput is throttled.

**Tier 4 — Dormant**
- **IronClaw.** No activity in the last 24h.

**Maturity ranking:** OpenClaw (production infrastructure) > Hermes ≈ ZeroClaw (production-adjacent) > QwenPaw (rapid iteration) > IronClaw (inactive).

---

## 7. Trend Signals

**For AI agent developers, five industry trends emerge from the aggregated community feedback:**

**1. Reliability is the new feature war.**
Every project's top-engagement items are correctness defects, not capability gaps. Users no longer ask "can it do X?" — they ask "will it silently break X?" Silent failures (#9770 cron dropouts, #9896 memory-status lies, #151962 phantom messages) generate the strongest emotional response. **Implication:** ship observability and loud failure modes before new tools.

**2. Cost/latency anxiety is now a first-class UX concern.**
Prompt-cache invalidation (#182891, #157583, #11696) is tracked as a *bug*, not a tuning detail. Multi-hour sessions are the norm, and cache misses translate directly to dollars and broken chats. **Implication:** cache-stable prompt envelopes are a competitive differentiator, not an optimization.

**3. Update trust is a gate on adoption.**
Users explicitly report wariness of updating (QwenPaw "升级后出现"; OpenClaw's rollback-refusal cluster). Transactional finalization with verified rollback is becoming table stakes. **Implication:** invest in update pipelines as a product surface, not infrastructure plumbing.

**4. Plugin ecosystems are the extensibility battleground.**
QwenPaw's "lighter core" pivot, OpenClaw's GitHub-integration-to-plugin migration, and Hermes' plugin-catalog PRs all point the same direction: **extract capabilities into a governed plugin SDK**. Theme-token depth (#8071, 21 comments) shows plugin developers will demand real API surface, not single-knob toggles. **Implication:** design plugin lifecycle and theming early — retrofitting is expensive.

**5. Safety mechanisms must be adversarially verified.**
QwenPaw's `DoomLoopGate` "never fired in production" (#8712) and ZeroClaw's SOP decision-gate bypass (#11124, S0) reveal that safety code shipped without proof-of-firing is a liability. **Implication:** safety gates need test harnesses that prove interruption under realistic repetitive/adversarial input, not just unit coverage.

**6. Provider-catalogue churn is a regression source.**
ZeroClaw's OpenCode Go bugs (#12412, #12413) and QwenPaw's gateway failures (#8718) both trace to recent provider-catalogue refactors. As multi-provider support expands, the **provider registry is becoming a critical, regression-prone subsystem**. **Implication:** treat provider registries as versioned, testable contracts.

---

### Bottom Line for Decision-Makers

- **Choosing a platform for production:** OpenClaw is the only project with an LTS-equivalent line and enterprise-operator tooling — but budget for a stabilization cycle and audit the P0/P1 backlog (notably #153426, #119720) before committing.
- **Choosing for extensibility:** QwenPaw's plugin SDK is the most ambitious bet, but its post-release regression rate warrants pinning to tested versions.
- **Choosing for security posture:** ZeroClaw's fail-closed SOP model and security-heavy close-out cadence are the strongest in the set — contingent on clearing its review bottleneck.
- **Cross-cutting investment:** session-state deduplication, cache-stable envelopes, and transactional updates are ecosystem-wide gaps. A project that solves these cleanly will differentiate on *trust*, which is emerging as the scarcest currency in the category.

---

## Peer Project Reports

<details>
<summary><strong>Hermes Agent</strong> — <a href="https://github.com/nousresearch/hermes-agent">nousresearch/hermes-agent</a></summary>

# Hermes Agent — Project Digest
**Date: 2026-11-19** | Repository: [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent)

---

## 1. Today's Overview

Hermes Agent remains in a **high-velocity, healthy maintenance-and-feature mode**, with 50 issues and 50 PRs touched in the last 24 hours and one canary release shipped. The open-to-merged ratio (44 open issues vs. 6 closed; 36 open PRs vs. 14 merged/closed) indicates a **substantial open backlog** but steady throughput, with `teknium1` (a core maintainer) driving a large batch of "salvage" and quality-of-life PRs. Activity skews toward **stability fixes** (DST cron handling, shell/noclobber, prompt-cache economics, computer-use / cua-driver), plugin-catalog housekeeping, and agent-instruction hygiene rather than headline features. Recurring pain clusters persist around **Desktop transcript rendering**, **computer-use (cua-driver) compatibility**, and **security/redaction edge cases**, several of which are long-lived. Overall health is **positive but backlog-heavy**, with a notable concentration of P2 bugs awaiting repro or decisions.

---

## 2. Releases

**New release:** [`v0.23.2+canary.20261118T064620Z`](https://github.com/NousResearch/hermes-agent/releases) (Release Date: November 18, 2026)

- **Channel:** Canary (not stable). Consumers on stable should not adopt automatically.
- **Contents:** The release notes body is the standard build/download template (`HERMES_BUILDS_TABLE`, Hermes Desktop DMG for macOS Apple Silicon and other OS/arch assets). No explicit changelog, **no documented breaking changes, and no migration notes** were provided in the release payload.
- **Assessment:** Treated as a routine canary build artifact. The absence of a changelog makes it unsuitable for assessing behavioral deltas; downstream testing against `main` (which carries the PRs listed below) is the more meaningful signal today.

*No breaking changes or migration actions required based on available data.*

---

## 3. Project Progress

**14 PRs were merged/closed** in the last 24h. Notable advances visible in the window:

- **[CLOSED] PR #157377** — *Agent instructions point at the file tools instead of terminal `grep`, `cat` and `sed`.* Aligns `AGENTS.md` and bundled skills with actual tool schemas, eliminating a long-standing contradiction that pushed models to shell text tools. [Link](https://github.com/NousResearch/hermes-agent/pull/157377)
- **[CLOSED] PR #156455** — *Prompt cache kept warm while it pays, then the idle chat compacts or offloads.* A cost-optimization feature: keeps provider prompt cache warm while cheaper than re-sending, then compacts/offloads when it stops paying (with local-backend tool-output archiving). [Link](https://github.com/NousResearch/hermes-agent/pull/156455)
- **[CLOSED] PR #138142** — *feat(gateway): gate the memory recall indicator* — adds `display.recall_notifications` (`off|on`, default `on`) plus per-platform overrides (Slack can silence the recall line in shared channels). [Link](https://github.com/NousResearch/hermes-agent/pull/138142)
- **[CLOSED] Issue #71998** — `pre_llm_call` plugin context now delivered for multimodal image turns. [Link](https://github.com/NousResearch/hermes-agent/issues/71998)
- **[CLOSED] Issue #135872 / #132876** — computer_use `element_index` sent to strict token-only CUA schemas (cua-driver 0.34/0.32) resolved. [Link](https://github.com/NousResearch/hermes-agent/issues/135872)
- **[CLOSED] Issue #126587** — `pm(cua-driver)` pin-never-advances (all upstream releases flagged `prerelease`) addressed.
- **[CLOSED] Issue #157585** — Mobile session list omitting `source=local` sessions now fixed.

A large open PR wave from `teknium1` is staged (see §6), pointing to continued momentum in agent-instruction correctness, cron/DST handling, and subagent context handoff.

---

## 4. Community Hot Topics

Ranked by comment count:

| Rank | Item | Comments | Signal |
|---|---|---|---|
| 1 | **[#62336](https://github.com/NousResearch/hermes-agent/issues/62336)** [OPEN][Security] Terminal env snapshots capture credential-bearing env vars to disk | 20 | Highest-engagement item; persists since July. Credentials from `bws run`/Bitwarden captured via `export -p` to `cache/terminal/`. Tagged `needs-decision`. |
| 2 | **[#137287](https://github.com/NousResearch/hermes-agent/issues/137287)** [OPEN][Bug] Desktop transcript duplicates/scatters/drops messages | 17 (👍1) | Long-running Desktop correctness bug; **risk-session-state**. |
| 3 | **[#71998](https://github.com/NousResearch/hermes-agent/issues/71998)** [CLOSED] pre_llm_call context dropped for multimodal turns | 8 | Resolved today. |
| 4 | **[#106487](https://github.com/NousResearch/hermes-agent/issues/106487)** [OPEN][Bug] Dashboard CJK/IME input garbled | 8 (👍2) | Internationalization gap; highest 👍 among issues. |
| 5 | **[#135872](https://github.com/NousResearch/hermes-agent/issues/135872)** [CLOSED] computer_use `element_index` refused on cua-driver 0.34 | 7 (👍1) | Resolved. |

**Underlying needs:** The community is most exercised by **security of persisted state** (#62336 — credential leakage to disk) and **session-state integrity** (Desktop transcript corruption #137287). These are foundational trust issues rather than feature gaps. The strong reaction to the CJK IME bug (#106487) shows a meaningful **non-English user base** whose input path is partially unusable.

---

## 5. Bugs & Stability

Ranked by severity/impact (P2 = high in this taxonomy):

**Critical / Security**
- **[#62336](https://github.com/NousResearch/hermes-agent/issues/62336)** — Terminal env snapshots persist injected credentials to disk. *No linked fix PR visible; tagged `needs-decision`.* **Highest priority.**
- **[#157615](https://github.com/NousResearch/hermes-agent/issues/157615)** [P3] — Secret redaction misses label-prefixed field dumps (e.g., 1Password Connect `field password: TYPE = "value"`). Redaction classifier gap.

**Session-State Integrity**
- **[#137287](https://github.com/NousResearch/hermes-agent/issues/137287)** [P2] — Desktop transcript duplication/scatter/drop (active since Oct 12).
- **[#131591](https://github.com/NousResearch/hermes-agent/issues/131591)** [P2] — Desktop double-renders completed turns (live-stream + hydrated copies).
- **[#156739](https://github.com/NousResearch/hermes-agent/issues/156739)** [P2] — Desktop renders internal compaction handoff summaries as user bubbles.
- **[#103355](https://github.com/NousResearch/hermes-agent/issues/103355)** [P3] — Compression attempt budget never re-arms under plugin context engine (hermes-lcm) → long turns die at `max_attempts`.

**Performance / Caching**
- **[#157583](https://github.com/NousResearch/hermes-agent/issues/157583)** [P2] — Turn after an image message misses prompt cache (image rows reloaded without injected context) — **directly relevant to the #156455 cache-warming work.**

**computer_use / cua-driver**
- **[#132084](https://github.com/NousResearch/hermes-agent/issues/132084)** [P2] — `pm/lock.json` pins cua-driver 0.21.0, predating the macOS Retina backing-scale fix (needs ≥0.22.2).
- **[#147405](https://github.com/NousResearch/hermes-agent/issues/147405)** [P2] — cua-driver 0.21.0 on macOS 26.6.2: 0 elements for Electron/Chrome windows.
- **[#146970](https://github.com/NousResearch/hermes-agent/issues/146970)** [P2] — Windows: Illustrator 2026 `get_window_state` times out.

**Process / Runtime**
- **[#40343](https://github.com/NousResearch/hermes-agent/issues/40343)** [P2] — Background processes survive CLI exit and `/reset` (port conflicts, orphaned resources).
- **[#97115](https://github.com/NousResearch/hermes-agent/issues/97115)** [P2] — Tool-dispatch branches in `agent/tool_executor.py` silently drop schema params (3 live instances).
- **[#95803](https://github.com/NousResearch/hermes-agent/issues/95803)** [P2] — Auto-repaired tool-name notice uses bare `print()`, ignoring `--quiet` (~4.8K log lines/24h).
- **[#157330](https://github.com/NousResearch/hermes-agent/issues/157330)** [P2] — `GET /v1/skills` always 500s (orphaned `include_editorial` kwarg from incomplete revert).
- **[#157631 / #157632](https://github.com/NousResearch/hermes-agent/issues/157632)** [P2] — Classic CLI one-shot inline images print Python tuple repr instead of drawing; Zellij/kitty Unicode-placeholder images broken (#157605).
- **[#157231](https://github.com/NousResearch/hermes-agent/issues/157231)** [P2] — `pm sync` overwrites update `latest.json`, erasing receipts.

**UI / Platform**
- **[#140633](https://github.com/NousResearch/hermes-agent/issues/140633)** [P3] — Linux/Wayland HDR: washed-out UI under SwiftShader fallback.
- **[#140632](https://github.com/NousResearch/hermes-agent/issues/140632)** [P2] — Right-rail plugin pane collapses chat column to 28px.
- **[#157603](https://github.com/NousResearch/hermes-agent/issues/157603)** [P2] — Desktop Plugins search can't find installed plugin by id.

**Fix PRs exist for several:** Windows flaky tests ([#157567](https://github.com/NousResearch/hermes-agent/pull/157567)), noclobber shell exports ([#157533](https://github.com/NousResearch/hermes-agent/pull/157533)), EXIF orientation ([#130365](https://github.com/NousResearch/hermes-agent/pull/130365)), and gateway approval-card states ([#156907](https://github.com/NousResearch/hermes-agent/pull/156907)).

---

## 6. Feature Requests & Roadmap Signals

**User-requested features:**
- **[#83244](https://github.com/NousResearch/hermes-agent/issues/83244)** [P3] — Add **Antigravity (Google) as a first-class OAuth provider** (Claude Sonnet/Opus 4.6, Gemini 3.x via Google OAuth), alongside `openai-codex` and `nous`. Strong candidate for provider roadmap.
- **[#22009](https://github.com/NousResearch/hermes-agent/issues/22009)** [P3] — TUI UP/DOWN should navigate wrapped visual lines before history cycling (Readline-like).
- **[#146503](https://github.com/NousResearch/hermes-agent/issues/146503)** [P3] — "Bens Magical Ticket of Multi-tenancy": hosted Hermes serving many tenants from one shared process, with tenant code sandboxed remotely and only curated plugins/MCP loaded in-process.

**Staged feature PRs (not yet merged) — likely near-term roadmap:**
- **[#157545](https://github.com/NousResearch/hermes-agent/pull/157545)** — File tools get log tails, folder listing with sizes, "search found everything" assurance, and execute_code-ready results (reduces shell fallback).
- **[#156936](https://github.com/NousResearch/hermes-agent/pull/156936)** — Subagents start primed with files/context instead of re-reading the codebase.
- **[#157534](https://github.com/NousResearch/hermes-agent/pull/157534)** — Resumed chats with fewer tools stop describing removed tools.
- **[#157639](https://github.com/NousResearch/hermes-agent/pull/157639)** [P2] — Cron correctness through DST fall-back (salvage of #128024 + #146444).
- Plugin-catalog additions: `agent-runs` ([#157637](https://github.com/NousResearch/hermes-agent/pull/157637)), `laso-finance` bump ([#157640](https://github.com/NousResearch/hermes-agent/pull/157640)), `PLUR1BUS` pin ([#157636](https://github.com/NousResearch/hermes-agent/pull/157636)).

**Prediction:** The next canary/stable is likely to bundle **cron DST fixes**, **file-tool ergonomics (#157545)**, **subagent context handoff (#156936)**, and **prompt-cache improvements** (building on merged #156455). Antigravity provider support hinges on addressing the `needs-decision` tag.

---

## 7. User Feedback Summary

**Pain points (by frequency and emotional weight):**
- **Trust in persisted state:** Credential leakage (#62336) and Desktop transcript corruption (#137287) directly undermine confidence in sessions and secrets — the top two engagement items.
- **computer-use reliability:** Multiple P2 reports across macOS Retina scaling (#132084), macOS Electron/Chrome capture (#147405), and Windows UIA timeouts (#146970) suggest the cua-driver pin is a systemic bottleneck, compounded by PM's inability to advance the pin (#126587, now closed) and upstream `prerelease` flagging.
- **Non-English UX:** CJK IME garbling in the web dashboard (#106487) remains unresolved despite clear demand (2 👍), indicating an internationalization gap.
- **Cost/latency awareness:** Users track prompt-cache misses after image turns (#157583) and idle-cache economics — the merged #156455 shows maintainers are responding to cost-sensitivity.
- **Log hygiene in headless deployments:** #95803 (4.8K noisy lines/24h) reflects operational frustration in automation contexts.

**Satisfaction signals:** Rapid closure of computer_use schema bugs (#135872, #132876), `pre_llm_call` multimodal fix (#71998), and same-day fixes for fresh issues (#157330, #157231) demonstrate **responsive maintenance**. The volume of community-submitted plugin-catalog PRs reflects an engaged extension ecosystem.

**Dissatisfaction signals:** Several P2 bugs persist **weeks-to-months** (e.g., #40343 since June, #137287 since October, #97115 since August) with `needs-repro`/`needs-decision` tags — indicating long-tail backlogs where reporters may feel stuck.

---

## 8. Backlog Watch

Important items needing maintainer attention (age + severity + stalled status):

| Issue | Age | Status | Why it matters |
|---|---|---|---|
| **[#40343](https://github.com/NousResearch/hermes-agent/issues/40343)** Background processes survive CLI exit / `/reset` | Since 2026-06-06 | [OPEN][P2] | Resource leaks & port conflicts; **oldest high-severity open bug**. |
| **[#62336](https://github.com/NousResearch/hermes-agent/issues/62336)** Credential capture to disk | Since 2026-07-10 | [OPEN][P3, needs-decision] | **Security**; 20 comments with no resolution — needs a decision, not just triage. |
| **[#137287](https://github.com/NousResearch/hermes-agent/issues/137287)** Desktop transcript corruption | Since 2026-10-12 | [OPEN][P2, needs-repro] | Core session integrity; stalled on reproduction. |
| **[#97115](https://github.com/NousResearch/hermes-agent/issues/97115)** Tool-dispatch drops schema params | Since 2026-08-28 | [OPEN][P2] | Silent data loss across 3 tools; architectural refactor implied. |
| **[#132084](https://github.com/NousResearch/hermes-agent/issues/132084)** cua-driver pin blocks macOS Retina fix | Since 2026-10-03 | [OPEN][P2] | Cross-links with closed #126587; pin still 0.21.0. |
| **[#89384](https://github.com/NousResearch/hermes-agent/issues/89384)** Auxiliary tasks ignore `provider_routing` | Since 2026-08-18 | [OPEN][P2] | Routing/cost-governance gap across vision, title-gen, session_search, compression. |
| **[#83244](https://github.com/NousResearch/hermes-agent/issues/83244)** Antigravity OAuth provider | Since 2026-08-10 | [OPEN][P3, needs-decision] | High-value provider request awaiting a roadmap call. |
| **[#106487](https://github.com/NousResearch/hermes-agent/issues/106487)** CJK IME input | Since 2026-09-09 | [OPEN][P2] | Internationalization blocker with user reactions. |

**PRs stalled in review:** Cron DST fixes [#128024](https://github.com/NousResearch/hermes-agent/pull/128024) (since 2026-09-29) and [#146444](https://github.com/NousResearch/hermes-agent/pull/146444) (since 2026-10-29) — now being consolidated by salvage PR [#157639](https://github.com/NousResearch/hermes-agent/pull/157639), suggesting overdue consolidation rather than neglect.

---

### Health Verdict
**Positive trajectory with concentrated risk.** Maintainer throughput is high (14 merged/closed PRs; a broad, coherent salvage wave), and same-day fixes for fresh bugs show

</details>

<details>
<summary><strong>IronClaw</strong> — <a href="https://github.com/nearai/ironclaw">nearai/ironclaw</a></summary>

No activity in the last 24 hours.

</details>

<details>
<summary><strong>QwenPaw</strong> — <a href="https://github.com/agentscope-ai/QwenPaw">agentscope-ai/QwenPaw</a></summary>

# QwenPaw Project Digest — 2026-11-19

## 1. Today's Overview

QwenPaw shows **high development velocity** with 14 issues and 29 PRs updated in the last 24 hours, plus a fresh patch release (v2.3.0.post1). The project is in the midst of a **significant architectural transition** toward a plugin-based model, with multiple large PRs extracting MCP, providers, and local model management into plugins. However, the volume of new bug reports—particularly around narrow-screen rendering, startup diagnostics, and memory/malloc behavior—suggests the recent v2.3.0 release introduced **several regressions** requiring immediate attention. Community engagement remains healthy, with active discussion on plugin extensibility and governance issues. Overall project health is **good but strained**: core contributors are pushing refactors while simultaneously firefighting regressions from the latest release.

---

## 2. Releases

### v2.3.0.post1 (Post Release)

A post-release patch following v2.3.0. Key changes:

- **feat(agent):** Extract third-party agent into plugins ([PR #8426](https://github.com/agentscope-ai/QwenPaw/pull/8426)) by @Luohh5
- **feat(console):** Quote response selections in follow-up drafts ([PR #8609](https://github.com/agentscope-ai/QwenPaw/pull/8609)) by @yang0228
- **fix(console):** Restore Safari support

**Migration Notes / Regressions Flagged (see bugs section):**
- Issue [#8812](https://github.com/agentscope-ai/QwenPaw/issues/8812) — `startup_diagnostic` floods output with WARNING lines; DingTalk/Feishu Channels unavailable by default until manually updated.
- Issue [#8811](https://github.com/agentscope-ai/QwenPaw/issues/8811) — Narrow-screen text clipping regression appeared **after upgrading from v2.3.0 to v2.3.0.post1**.

A version bump to `2.3.1b1` was merged ([PR #8809](https://github.com/agentscope-ai/QwenPaw/pull/8809)), signaling the next cycle has begun.

---

## 3. Project Progress

### Merged/Closed PRs (11 total)

| PR | Title | Impact |
|---|---|---|
| [#8756](https://github.com/agentscope-ai/QwenPaw/pull/8756) | fix(channels): scope WeChat credentials per agent workspace | Multi-agent WeChat account isolation |
| [#8028](https://github.com/agentscope-ai/QwenPaw/pull/8028) | fix(security): flag inline Office COM automation in shell commands | Closes long-standing [#8002](https://github.com/agentscope-ai/QwenPaw/issues/8002) |
| [#7757](https://github.com/agentscope-ai/QwenPaw/pull/7757) | fix(governance): enforce destructive-command and system-credential guards | Security hardening |
| [#8730](https://github.com/agentscope-ai/QwenPaw/pull/8730) | fix(pawapp): disable proxy buffering on chat and tool-call SSE streams | Streaming reliability |
| [#8809](https://github.com/agentscope-ai/QwenPaw/pull/8809) | chore: bump version to 2.3.1b1 | Next cycle opened |

### Notable Open PRs Advancing Features

- **[#8469](https://github.com/agentscope-ai/QwenPaw/pull/8469)** (XXXL) — Extract MCP into a plugin. Core to the "lighter core" initiative.
- **[#8499](https://github.com/agentscope-ai/QwenPaw/pull/8499)** (XXXL) — Extract local model management into plugin.
- **[#8764](https://github.com/agentscope-ai/QwenPaw/pull/8764)** (XXXL) — Plugin SDK 1.1 expansion with lifecycle management.
- **[#8713](https://github.com/agentscope-ai/QwenPaw/pull/8713)** — Fix doom-loop gate so repeated tool calls trigger interruption (fixes #8712).
- **[#8810](https://github.com/agentscope-ai/QwenPaw/pull/8810)** — Require approval for shell-based email/HTTP-write/upload operations.

**Direction:** The project is clearly executing on the "QwenPaw Is Getting Lighter and Easier to Extend" roadmap ([#8808](https://github.com/agentscope-ai/QwenPaw/issues/8808)) announced by @Luohh5.

---

## 4. Community Hot Topics

### 🔥 [#8071](https://github.com/agentscope-ai/QwenPaw/issues/8071) — Plugin-facing theme extension point (21 comments, OPEN since 2026-10-01)
The most-discussed open issue. Plugin authors are limited to a single `colorPrimary` knob and want semantic token overrides. **Underlying need:** plugin ecosystem maturity — themes are a first-order concern for plugin developers, and the current API is too shallow. Related PR [#8787](https://github.com/agentscope-ai/QwenPaw/pull/8787) is already open addressing semantic colour roles.

### [#8712](https://github.com/agentscope-ai/QwenPaw/issues/8712) — Doom-loop gate never fires (OPEN)
Detailed investigation showing `DoomLoopGate` records at most one call per reply, so repeated identical `Bash` invocations approved 14 times never trip. Fix PR [#8713](https://github.com/agentscope-ai/QwenPaw/pull/8713) is open. **Underlying need:** reliable runaway-loop protection — a core safety guarantee users assume exists.

### [#8808](https://github.com/agentscope-ai/QwenPaw/issues/8808) — 📢 "QwenPaw Is Getting Lighter and Easier to Extend" (1 👍, OPEN)
Official roadmap communication from @Luohh5. Signals plugin extraction as the top strategic priority. High community interest given it received the only 👍 among recent issues.

### [#8806](https://github.com/agentscope-ai/QwenPaw/issues/8806) — CLOSED — Phantom user messages drive agent looping
A concerning bug report (now closed) where the agent receives never-sent user messages and loops tool execution. Closed quickly — good triage responsiveness.

---

## 5. Bugs & Stability

Ranked by severity:

| Severity | Issue | Status | Fix PR? |
|---|---|---|---|
| **High** | [#8805](https://github.com/agentscope-ai/QwenPaw/issues/8805) — Base image missing `MALLOC_ARENA_MAX` cap; main app pins 1.78 GB across 29 glibc arenas (v2.3.0, 112 threads) | OPEN | No — follow-up to #8654 which only fixed Creator entrypoint |
| **High** | [#8802](https://github.com/agentscope-ai/QwenPaw/issues/8802) — Context overflow (`MODEL_CONTEXT_LENGTH_EXCEEDED`) after ~20 consecutive MCP calls; task aborts | OPEN | No |
| **High** | [#8811](https://github.com/agentscope-ai/QwenPaw/issues/8811) — Narrow-screen text clipping + wide content (tables/code) uncuttable & no horizontal scroll — **regression in v2.3.0.post1** | OPEN | No |
| **Medium** | [#8812](https://github.com/agentscope-ai/QwenPaw/issues/8812) — Startup diagnostic WARNING spam; DingTalk/Feishu Channels unavailable by default after update | OPEN | No |
| **Medium** | [#8712](https://github.com/agentscope-ai/QwenPaw/issues/8712) — Doom-loop gate never interrupts repeated tool calls | OPEN | ✅ [#8713](https://github.com/agentscope-ai/QwenPaw/pull/8713) |
| **Closed** | [#8806](https://github.com/agentscope-ai/QwenPaw/issues/8806) — Phantom user messages drive looping | CLOSED | — |
| **Closed** | [#8718](https://github.com/agentscope-ai/QwenPaw/issues/8718) — Hub model gateway fails for Anthropic/MiniMax presets (`provider_headers()` calls missing `request_headers()`) | CLOSED | — |
| **Closed** | [#8736](https://github.com/agentscope-ai/QwenPaw/issues/8736) — Subagent completions incorrectly trigger desktop notifications | CLOSED | — |
| **Closed** | [#8002](https://github.com/agentscope-ai/QwenPaw/issues/8002) — Windows auto mode w/ sandbox off allows Office COM `Quit()` to close user's PowerPoint | CLOSED | ✅ [#8028](https://github.com/agentscope-ai/QwenPaw/pull/8028) merged |
| **Closed** | [#7197](https://github.com/agentscope-ai/QwenPaw/issues/7197) — Custom channel plugin not selectable in MCP tool authorization rules | CLOSED | — |

**Regression concern:** Two of the open high-severity bugs (#8811, #8812) are directly attributable to the v2.3.0.post1 update, suggesting the release validation pipeline may need strengthening before post-releases ship.

---

## 6. Feature Requests & Roadmap Signals

| Request | Likelihood in Next Version | Reasoning |
|---|---|---|
| **Plugin theme semantic token override** ([#8071](https://github.com/agentscope-ai/QwenPaw/issues/8071)) | **Very High** | PR [#8787](https://github.com/agentscope-ai/QwenPaw/pull/8787) already open implementing semantic colour roles; 21 comments show strong demand. |
| **MCP as plugin** ([#8469](https://github.com/agentscope-ai/QwenPaw/pull/8469)) | **Very High** | XXXL PR already open; aligns with the "lighter core" roadmap ([#8808](https://github.com/agentscope-ai/QwenPaw/issues/8808)). |
| **Plugin SDK 1.1 with lifecycle management** ([#8764](https://github.com/agentscope-ai/QwenPaw/pull/8764)) | **High** | Open XXXL PR; foundational for the plugin ecosystem. |
| **Local model management as plugin** ([#8499](https://github.com/agentscope-ai/QwenPaw/pull/8499)) | **High** | Open XXXL PR; part of the systematic plugin extraction. |
| **Local Whisper as SDK plugin** ([#8431](https://github.com/agentscope-ai/QwenPaw/pull/8431)) | **Medium-High** | Open XXXL PR since 2026-10-26; may land in 2.4.x. |
| **Security: approval for shell email/HTTP-write/uploads** ([#8810](https://github.com/agentscope-ai/QwenPaw/pull/8810)) | **High** | Already submitted as PR; MEDIUM-severity rules added. |

**Prediction:** The v2.4.0 milestone will likely be headlined by the **plugin SDK 1.1 + MCP/provider extraction**. Theme extension points and security hardening will ride along as point releases or patches.

---

## 7. User Feedback Summary

### Pain Points

1. **Post-release regressions are eroding trust.** Two users reported issues immediately after upgrading to v2.3.0.post1 (#8811 narrow-screen clipping, #8812 startup WARNING spam + channel unavailability). The phrase "升级后出现" (appeared after upgrade) signals users are wary of updating.

2. **Resource management under load is fragile.** [#8805](https://github.com/agentscope-ai/QwenPaw/issues/8805) documents 1.78 GB pinned in glibc arenas on a 56-core host. [#8802](https://github.com/agentscope-ai/QwenPaw/issues/8802) shows context overflow aborting long MCP sequences. Enterprise users running multi-core Docker deployments are most affected.

3. **Runaway loops persist.** [#8712](https://github.com/agentscope-ai/QwenPaw/issues/8712) reveals the doom-loop gate has *never* fired in production — a fundamental safety mechanism is silently broken. Combined with [#8806](https://github.com/agentscope-ai/QwenPaw/issues/8806) (phantom messages causing loops), users report agents executing indefinitely.

4. **Plugin API surface is too narrow.** Plugin developers (#8071) want deeper theme control. The single `colorPrimary` option is insufficient for real plugin UI needs.

5. **Model gateway errors are opaque.** [#8798](https://github.com/agentscope-ai/QwenPaw/issues/8798) — user hit `MODEL_QUOTA_EXCEEDED` with a confusing signup message; frustration evident in tone ("keep getting a damn..."). Better error surfacing needed.

### Satisfaction Signals

- Fast triage on #8806 and #7197 (same-day closure).
- Official roadmap communication (#8808) from maintainer @Luohh5 is well-received.
- The plugin ecosystem direction has broad buy-in from contributors (multiple XXXL PRs from different authors).

---

## 8. Backlog Watch

Items needing maintainer attention:

| Item | Age | Why It Matters |
|---|---|---|
| [#8071](https://github.com/agentscope-ai/QwenPaw/issues/8071) — Plugin theme extension point | **49 days open**, 21 comments | Highest-engagement open issue. PR #8787 partially addresses it but the issue remains open — needs a maintainer decision on scope/acceptance. |
| [#8431](https://github.com/agentscope-ai/QwenPaw/pull/8431) — Local Whisper SDK plugin | **24 days open**, no comments visible | XXXL PR with no apparent reviewer activity. Risk of bit-rot as the SDK evolves. |
| [#8469](https://github.com/agentscope-ai/QwenPaw/pull/8469) — MCP plugin extraction | **22 days open** | Critical path for the roadmap; needs review bandwidth. |
| [#8499](https://github.com/agentscope-ai/QwenPaw/pull/8499) — Local model management plugin | **21 days open** | Same concern as above. |
| [#8268](https://github.com/agentscope-ai/QwenPaw/pull/8268) — TaskTracker run-completion cleanup | **34 days open** | Fixes half of #8173; a hung callback leaves runs stuck `running` forever. Low-risk fix that's been waiting too long. |
| [#8295](https://github.com/agentscope-ai/QwenPaw/pull/8295) — Hide internal scaffolding at display boundary | **33 days open**, Under Review | XL fix for leaking `<system-info>` tags to end users. Marked "Under Review" but stalled. |
| [#8133](https://github.com/agentscope-ai/QwenPaw/pull/8133) — Fix CJK emphasis boundaries in Markdown | **42 days open**, Under Review | Affects a large user base (Chinese-language users); `**中文。**` never renders correctly. Long review cycle for a size/L PR. |

**Recommendation:** The maintainer team appears bottlenecked on reviewing XXXL PRs. Consider designating additional reviewers or splitting the large plugin-extraction PRs into mergeable slices to unblock the roadmap.

---

*Generated from GitHub data snapshot 2026-11-19. All links point to github.com/agentscope-ai/QwenPaw.*

</details>

<details>
<summary><strong>ZeroClaw</strong> — <a href="https://github.com/zeroclaw-labs/zeroclaw">zeroclaw-labs/zeroclaw</a></summary>

# ZeroClaw Project Digest — 2026-11-19

## 1. Today's Overview

ZeroClaw is in a **high-velocity maintenance and hardening phase**, with 50 issues and 50 PRs touched in the last 24 hours and no new releases cut. Activity is dominated by the canonical provider registry work stream (a cluster of stacked XL PRs from NiuBlibing, #12448–#12457) and a steady stream of security/robustness bug fixes. The issue backlog skews heavily toward **S2 "degraded behavior" bugs** rather than S0/S1 incidents, though one S1 (tool-context collapse on Claude Opus 5.5, #12401) is in progress. Notably, **10 issues were closed today** across security, SOP, and observability domains, indicating effective maintainer throughput. Overall project health looks strong on triage responsiveness, but the volume of long-lived `status:in-progress` S2 issues suggests a growing stabilization debt heading into v0.9.1.

## 2. Releases

**No new releases in the last 24 hours.** The most recent release in flight is **v0.9.1**, referenced in tags on #12401 and PR #12237. No migration or breaking-change notes to publish today.

## 3. Project Progress

Only **2 PRs were merged/closed** today against 48 still open — a low merge day, consistent with a large stack of dependency-chained PRs awaiting review.

Closed:
- **[PR #12237](https://github.com/zeroclaw-labs/zeroclaw/pull/12237)** — `fix(sop): use the fail-closed mode when the decision answers are unusable`. Resolves the S0 decision-gate bypass tracked in **#11124**, where a malformed/missing gate answer could let an SOP start in Auto mode. This is a meaningful security hardening for the SOP subsystem.

Closed issues advancing features/fixes:
- **[#12122](https://github.com/zeroclaw-labs/zeroclaw/issues/12122)** — Windows prebuilt installers now expected to perform SHA256SUMS verification (parity with `install.sh`).
- **[#12146](https://github.com/zeroclaw-labs/zeroclaw/issues/12146)** — MCP SSE client no longer accepts an absolute `endpoint` URL and leaks bearer tokens cross-origin.
- **[#12144](https://github.com/zeroclaw-labs/zeroclaw/issues/12144)** — `file_upload`/`file_edit` no longer authorize through the write tier, closing a sibling-workspace read escalation.
- **[#12053](https://github.com/zeroclaw-labs/zeroclaw/issues/12053)** — Unpinned third-party script on `/api/docs` origin addressed.
- **[#12280](https://github.com/zeroclaw-labs/zeroclaw/issues/12280)** — Forwarded loopback addresses no longer treated as local for SOP cancel authorization.
- **[#10318](https://github.com/zeroclaw-labs/zeroclaw/issues/10318)** — Concurrent SOP authoring writes serialized.
- **[#9655](https://github.com/zeroclaw-labs/zeroclaw/issues/9655)**, **[#9736](https://github.com/zeroclaw-labs/zeroclaw/issues/9736)**, **[#12169](https://github.com/zeroclaw-labs/zeroclaw/issues/12169)** — Telegram approval-card positioning, SessionState persistence gap, and `send_message_to_peer` tool-scope leakage respectively.

Net: **a security-heavy close-out day**, especially around SOP authorization, multi-agent permission tiers, and channel-secret handling.

## 4. Community Hot Topics

| Rank | Item | Comments | Underlying need |
|------|------|----------|-----------------|
| 1 | **[#12401](https://github.com/zeroclaw-labs/zeroclaw/issues/12401)** — `keep_tool_context_turns` breaks Claude Opus 5.5 chats with thinking-signature 400 | 6 | Users need **long-running tool-use sessions** to survive context windowing without poisoning the conversation permanently. |
| 2 | **[#9770](https://github.com/zeroclaw-labs/zeroclaw/issues/9770)** — `cron update` silently discards declarative job changes (six columns) | 3 | Silent data loss in declarative config is eroding trust in `zeroclaw cron` as a source-of-truth workflow. |
| 3 | **[#9655](https://github.com/zeroclaw-labs/zeroclaw/issues/9655)** (closed) — Approval cards carry no position | 3 | Multi-tool-call turns in Telegram are **unreviewable** when cards are indistinguishable — an operator UX blocker. |
| 4 | **[#9736](https://github.com/zeroclaw-labs/zeroclaw/issues/9736)** (closed) — RPC prompt path never writes persisted SessionState | 3 | RPC-attached surfaces (zerocode, gateway) need **state parity** with the WebSocket path. |
| 5 | **[#11696](https://github.com/zeroclaw-labs/zeroclaw/issues/11696)** — System prompt rebuilt from disk every turn busts prompt cache | 3 | **Cost regression** for operators running many live sessions; personality-file edits invalidate everyone. |

The theme across hot topics is **operational trust**: users are hitting edge cases where the agent silently misbehaves (400-loop, silent config drops, cache invalidation) rather than erroring loudly.

## 5. Bugs & Stability

Ranked by severity:

**S1 — Workflow blocked**
- **[#12401](https://github.com/zeroclaw-labs/zeroclaw/issues/12401)** — Claude Opus 5.5 chats permanently fail after older tool turns leave `keep_tool_context_turns`. `status:in-progress`, tagged `release:v0.9.1`. **No fix PR linked yet** — this is the highest-priority stability item today.

**S0 — Security/data risk (now closed)**
- **[#11124](https://github.com/zeroclaw-labs/zeroclaw/issues/11124)** — SOP decision gate strict fallback bypass. Fixed by [PR #12237](https://github.com/zeroclaw-labs/zeroclaw/pull/12237).

**S2 — Degraded behavior (open, new/updated today)**
- **[#12504](https://github.com/zeroclaw-labs/zeroclaw/issues/12504)** — Anthropic provider replays unsigned thinking block; every retry fails with `signature: Field required`. Related to #12401.
- **[#12558](https://github.com/zeroclaw-labs/zeroclaw/issues/12558)** — Matrix tool-approval prompts posted to room timeline instead of thread.
- **[#12559](https://github.com/zeroclaw-labs/zeroclaw/issues/12559)** — Config setters accept `inf`/`NaN`/`1e999` for decimal settings.
- **[#12413](https://github.com/zeroclaw-labs/zeroclaw/issues/12413)** & **[#12412](https://github.com/zeroclaw-labs/zeroclaw/issues/12412)** — OpenCode Go context-window discovery returns no capacity; OpenCode Go uses Zen's catalogue. Both v0.9.0 regressions.
- **[#11823](https://github.com/zeroclaw-labs/zeroclaw/issues/11823)** — Shell scanner skips command substitution in unquoted-delimiter heredoc bodies (sandbox bypass).
- **[#9896](https://github.com/zeroclaw-labs/zeroclaw/issues/9896)** — Status banner reports `Memory: none` when backend is sqlite.
- **[#11696](https://github.com/zeroclaw-labs/zeroclaw/issues/11696)** — Per-turn prompt rebuild cost regression.

**Pattern note:** Two Anthropic thinking-signature bugs (#12401, #12504) filed within a week suggest the new Claude Opus 5.5 thinking-block handling needs a consolidated fix.

## 6. Feature Requests & Roadmap Signals

New/enhancement requests today:

- **[#12562](https://github.com/zeroclaw-labs/zeroclaw/issues/12562)** — Telegram `trusted_groups`: allow group-member messages without per-sender allowlist entries. **Likely candidate for a channel-focused minor release** — small surface, clear operator value.
- **[#12561](https://github.com/zeroclaw-labs/zeroclaw/issues/12561)** — Matrix: bounded cleanup of declined room invites (follow-up to #12495).
- **[#11050](https://github.com/zeroclaw-labs/zeroclaw/issues/11050)** — Pace native polls with other outbound channel messages (WhatsApp).
- **[#9914](https://github.com/zeroclaw-labs/zeroclaw/issues/9914)** — Preserve Docker coding CLI workspace root with relative cwd.
- **[#9685](https://github.com/zeroclaw-labs/zeroclaw/issues/9685)** — `sops/cancel` RPC method (explicitly deferred until #9476 merges).
- **[#11768](https://github.com/zeroclaw-labs/zeroclaw/issues/11768)** — Honor HTTP `Retry-After` for provider 429s.

**Prediction:** Expect messaging-channel polish (Telegram trusted groups, Matrix invite cleanup, WhatsApp poll pacing) to land in **v0.9.2**, while the SOP cancel RPC (#9685) waits on the SOP MVP cutover. The canonical provider registry stack (#12448–#12457) is clearly the flagship feature for the **v0.10 line**, not v0.9.x.

## 7. User Feedback Summary

**Pain points surfaced today:**
- **Cost & cache sensitivity** — #11696 and #12401 both stem from how prompt/tool context is assembled per turn. Multi-hour sessions are the norm, and users are feeling the cost in both dollars and broken chats.
- **Silent failures over loud ones** — #9770 (cron update dropout) and #9896 (memory status lie) both describe the system *telling the user things worked* when they didn't. This is the most consistent friction theme.
- **Channel operator UX** — #9655 (approval cards) and #12558 (Matrix thread vs. timeline) show approval flows still assume a single-tool-call, non-threaded world.
- **Provider ecosystem churn** — Two OpenCode Go bugs (#12412, #12413) in the same 24h window indicate the v0.9.0 provider-catalogue refactor introduced model-list regressions.

**Satisfaction signals:** The rapid closure of 10 issues (many security-tagged) suggests users are filing well-scoped reports and maintainers are landing fixes — a healthy loop. No 👍 reactions on any tracked item, so sentiment data is comment-volume only.

## 8. Backlog Watch

Long-lived or high-risk items deserving maintainer attention:

- **[#9492](https://github.com/zeroclaw-labs/zeroclaw/issues/9492)** (open since **2026-07-28**, p1, risk:high) — `auth refresh` dead-ends when an external client rotated the shared OpenAI-Codex refresh token. Nearly 4 months old with only 1 comment; single-use rotating tokens make this a recurring footgun.
- **[#9770](https://github.com/zeroclaw-labs/zeroclaw/issues/9770)** (open since **2026-08-05**, p1) — Cron update silently discards declarative changes. High-trust-impact silent data loss still unfixed after 3.5 months.
- **[#10391](https://github.com/zeroclaw-labs/zeroclaw/pull/10391)** (open since **2026-08-26**, size:XL, risk:high, `needs-author-action`) — The delegate workspace/tool-ceiling bounding fix. Three master merges into the branch and still not landed; blocks #9872.
- **[#10412](https://github.com/zeroclaw-labs/zeroclaw/pull/10412)** (open since **2026-08-27**, size:XL, `breaking-change`, p1) — Shared `SessionBackend` atomic ownership contract. Foundational for RPC/WebSocket admission parity but stalled.
- **[#11847](https://github.com/zeroclaw-labs/zeroclaw/pull/11847)** (open since **2026-10-19**, size:XL, `needs-maintainer-review`) — Native Rust XMPP with optional OMEMO. Marks the WeCom/WeChat/Lark channel expansion but has been waiting on maintainer review for a month.
- **[#10391](https://github.com/zeroclaw-labs/zeroclaw/pull/10391)** companion doc PR **[#12403](https://github.com/zeroclaw-labs/zeroclaw/pull/12403)** — Composition-seam row; both need author action.

**Recommendation:** The `needs-author-action` and `needs-maintainer-review` XL PRs (#10391, #10412, #11847) are the project's critical path. Clearing them unblocks #9872, session ownership, and the XMPP channel respectively, and would materially improve the merge-to-open ratio (currently 2:48 today).

---
*Digest generated from GitHub API snapshot; all links refer to `github.com/zeroclaw-labs/zeroclaw`.*

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*