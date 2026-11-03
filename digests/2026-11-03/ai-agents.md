# OpenClaw Ecosystem Digest 2026-11-03

> Issues: 424 | PRs: 500 | Projects covered: 5 | Generated: 2026-11-03 02:52 UTC

- [OpenClaw](https://github.com/openclaw/openclaw)
- [Hermes Agent](https://github.com/nousresearch/hermes-agent)
- [IronClaw](https://github.com/nearai/ironclaw)
- [QwenPaw](https://github.com/agentscope-ai/QwenPaw)
- [ZeroClaw](https://github.com/zeroclaw-labs/zeroclaw)

---

## OpenClaw Deep Dive

# OpenClaw Project Digest — 2026-11-03

## 1. Today's Overview

OpenClaw shows very high activity: **424 issues** updated in the last 24h (207 still open/active, 217 closed) and **500 PRs** touched (327 open, 173 merged/closed). **No new releases** were published today, and the project is operating on a mature release line (2026.10.x, with extended-stable backports at 2026.9.34). The issue mix reveals a project under sustained stability pressure: a cluster of P0/P1 crash-loop, session-state, data-loss, and security issues (shared-state integrity failures, doctor hangs, gateway RSS growth, iOS pairing loops) are drawing heavy maintainer/triage attention. Positively, the PR pipeline is healthy — a large volume of fix PRs is open and several were merged/closed today, suggesting active remediation despite the lack of a release.

## 2. Releases

**None today.** There are no new versions, changelogs, breaking changes, or migration notes to report. The most recent release activity appears concentrated on the **2026.10.8** line and backports to the **2026.9.34 extended-stable** branch (see PR #191618, which backports hotfix ledger routing to **2026.11.1**). Note the version drift in issues — users are spread across 2026.7.1 through 2026.10.8, which itself is a source of confusion (see #183479, #169423).

## 3. Project Progress

**Merged/closed PRs today (173 total):** Representative examples from the top-comment PRs:

- **PR #191333** (closed, ready for maintainer look) — `fix(update): preserve run identity when admission fails` — fixes #191330; prevents the CLI from losing the run ID in failure output during update reconciliation. https://github.com/openclaw/openclaw/pull/191333
- **PR #191226** (closed) — `feat(ci): collect test observations for adaptive CI experiments` — base of a stacked CI-improvement series (#191226 → #191228 → #191229) targeting faster, smarter test selection. https://github.com/openclaw/openclaw/pull/191226
- **PR #188121** (closed) — `fix(codex): keep literal node-binding cwd values without trimming` — fixes a cwd mangling bug (#190067) that trimmed literal whitespace in Codex session bindings. https://github.com/openclaw/openclaw/pull/188121

**Open PRs advancing features:**
- **PR #186593** (XL, ready for maintainer look) — plugin author-recommended starter prompts, reusing the install/consent flow. https://github.com/openclaw/openclaw/pull/186593
- **PR #191469** (XL, security-boundary, needs proof) — new **OpenClaw ID** protocol contracts package for remote Gateway access. https://github.com/openclaw/openclaw/pull/191469
- **PR #184512** — transactional commit of session invitations with original messages (crash-safety for Inbox mentions). https://github.com/openclaw/openclaw/pull/184512

**Themes:** update/recovery robustness, CI efficiency, Postgres chat-history concurrency (#190129), and browser/Chrome debugger idle behavior (#191614).

## 4. Community Hot Topics

Most active issues by comment count, with underlying needs analysis:

| Issue | Comments | Underlying need |
|---|---|---|
| [#177656](https://github.com/openclaw/openclaw/issues/177656) — Native host exec returns shared-state integrity-admission error (P1, ~28 failures) | 25 | Users need **deterministic child-process execution and clear failure attribution**; "child effects unproved" suggests insufficient observability for side-effecting operations. |
| [#120385](https://github.com/openclaw/openclaw/issues/120385) — Code Mode tool catalog incomplete for cron/memory-flush turns, MCP tools missing | 24 | **Scheduled/autonomous turns must have parity with interactive turns** — a recurring theme for multi-channel, agentic workflows. |
| [#166634](https://github.com/openclaw/openclaw/issues/166634) — Late reclamation checkpoint failure leaves agent permanently unavailable (P0) | 22 | **Crash recovery guarantees**: an agent that never returns after a checkpoint failure is a severe reliability gap. |
| [#178359](https://github.com/openclaw/openclaw/issues/178359) — `doctor --fix` idles 15+ min, never reaches DB repair (P1, crash-loop) | 21 | Operators need **doctor to be trustworthy and non-hanging** — the primary repair tool silently idling erodes confidence. |
| [#187900](https://github.com/openclaw/openclaw/issues/187900) — `doctor` hangs indefinitely on Linux in *all* modes (P1, crash-loop) | 20 | Same as above; now reproduced across `--lint`, `--fix`, PTY and non-interactive — a systemic startup-path hang. |
| [#145309](https://github.com/openclaw/openclaw/issues/145309) — claude-cli ignores `CLAUDE_CONFIG_DIR`, resets transcripts (P1, diamond lobster) | 13 | **Multi-account Claude users** need proper env/config isolation. |

**Analysis:** The community's dominant needs are **reliability of recovery mechanisms (doctor, update, crash recovery)** and **parity of tool/session state across execution modes (interactive vs. cron vs. memory-flush)**.

## 5. Bugs & Stability

Ranked by severity (today's updates; fix PR exists where noted):

**P0 / Critical**
- **[#166634](https://github.com/openclaw/openclaw/issues/166634)** — Late reclamation checkpoint failure → agent permanently unavailable after crash recovery (session-state/message-loss/release-blocker). No fix PR; needs repro.
- **[#142821](https://github.com/openclaw/openclaw/issues/142821)** — Default-on transcript redaction poisons replayed agent context (data-loss/security). Linked PR open; needs security review.
- **[#164800](https://github.com/openclaw/openclaw/issues/164800)** — 2026.9.7→9.8 managed update leaves activation driver dead until host reboot (crash-loop). Fix-shape clear, no new fix PR.
- **[#161800](https://github.com/openclaw/openclaw/issues/161800)** — iOS embedded Dashboard creates a new browser device identity on every page load, looping pairing (security/release-blocker). No fix PR.

**P1 / High**
- **[#187900](https://github.com/openclaw/openclaw/issues/187900)** — `doctor` hangs indefinitely at startup on Linux (crash-loop). Maintainer review needed.
- **[#178359](https://github.com/openclaw/openclaw/issues/178359)** — `doctor --fix --non-interactive` idles 15+ min (crash-loop).
- **[#177656](https://github.com/openclaw/openclaw/issues/177656)** — Shared-state integrity-admission error on native host exec (P1).
- **[#144336](https://github.com/openclaw/openclaw/issues/144336)** — Deferred config-reload restart (SIGUSR1) fails shutdown step (platinum hermit). Needs live repro.
- **[#182369](https://github.com/openclaw/openclaw/issues/182369)** — Gateway RSS grows ~0.1 GiB/h off-heap until restart; internal monitor never fires (message-loss/crash-loop). No fix PR.
- **[#186684](https://github.com/openclaw/openclaw/issues/186684)** — claude-cli tool-list change invalidates native session; reseed refused → agent restarts with no history. Needs security review/live repro.

**Notable regressions**
- **[#154104](https://github.com/openclaw/openclaw/issues/154104)** — Idle Gateway with 4 Matrix E2EE accounts: ~50% CPU and ~52 MB/min writes (regression vs. 2026.7.1). No fix PR.
- **[#147344](https://github.com/openclaw/openclaw/issues/147344)** (closed) — Silent model auto-escalation to Sonnet + HIGH thinking burned ~$25 — closed, but highlights cost-control trust issues.

**Fix PRs confirmed today:** #191333 (update run identity, closed), #188121 (Codex cwd, closed), plus open fixes #190129 (Postgres chat history), #191614 (Chrome debugger idle), #191592 (degraded-summary warning), #191581 (iMessage pairing fail-closed).

## 6. Feature Requests & Roadmap Signals

Active feature/enhancement requests, with likely near-term targets:

- **[#173058](https://github.com/openclaw/openclaw/issues/173058)** (diamond lobster, security) — `tools.fs.workspaceOnly` doesn't actually restrict file tools because the OpenClaw state root is also granted. **Security-boundary fix likely prioritized**; PRs are opening with `security-sensitive-changed` labels.
- **[#107433](https://github.com/openclaw/openclaw/issues/107433)** (platinum hermit) — Fail-closed manifest-backed intentional omissions for `openclaw backup`. Plausible for a near-term release given update/backup hardening focus.
- **[#112372](https://github.com/openclaw/openclaw/issues/112372)** — Opt-in origin-bound deferred completion (`wakeOnReply`) for `sessions_send`; complements the active "degraded summary"/session semantics work (#191592). **Likely in next minor.**
- **[#150238](https://github.com/openclaw/openclaw/issues/150238)** — Context budget/skip policy for Skill Workshop Experience Review on oversized sessions. Emerging auto-learning subsystem; could appear alongside Plugin prompts (#186593).
- **[#138990](https://github.com/openclaw/openclaw/issues/138990)** — Enforceable checkpoints and bounded yields for long foreground WebChat runs — a recurring UX reliability ask.
- **[#158800](https://github.com/openclaw/openclaw/issues/158800)** — Browse/fork prior channel-chat segments after `/new` in Control UI. UI-surface feature; moderate likelihood.
- **Provider requests:** [#155633](https://github.com/openclaw/openclaw/issues/155633) (Databricks Unity Gateway, linked PR #155634 open), [#90074](https://github.com/openclaw/openclaw/issues/90074) (image gen should use Codex OAuth when provider config exists).

**Prediction:** Expect next release to focus on **security boundaries (fs workspaceOnly), doctor/update stability, backup fail-closed behavior, and session completion semantics** rather than new channels.

## 7. User Feedback Summary

**Pain points observed:**
- **Trust in tooling has eroded.** Multiple users report `doctor` hanging in every mode (#187900, #178359), updates failing silently, and the updater leaving services dead (#164800, #183479). Operators describe running commands for 15+ minutes "with no output."
- **Concurrency and resource leaks.** One user reports an idle gateway burning ~50% CPU and ~52 MB/min with Matrix E2EE (#154104); another reports off-heap RSS growth requiring restarts (#182369). Codex app-server stores grew to **13 GB across 14 agents** (~97% images) with no retention (#150940, closed).
- **Cost and identity control.** A costly silent model auto-escalation (#147344, closed) and iOS device-identity pairing loops (#161800) show users want explicit, predictable control over model selection and device trust.
- **Multi-account and multi-environment setups are fragile.** `CLAUDE_CONFIG_DIR` being ignored (#145309) and shared workspace roots breaking bootstrap files (#173057) affect power users running agent rosters.
- **Satisfaction signals:** Several well-scoped fixes are landing with tight PRs and clear repro (e.g., #191592, #191581, #188121), and community members continue filing precise, reproducible reports — a sign of an engaged, technically sophisticated user base that still trusts the maintainers to fix regressions.

## 8. Backlog Watch

Important long-unanswered or maintainer-blocked items needing attention:

- **[#114414](https://github.com/openclaw/openclaw/issues/114414)** — Dated TODO sweep (P3, bot-generated, 16 comments, 2026-07-27): overdue CI auth and `zizmor.yml` TODOs still open. Low severity but signals deferred hygiene.
- **[#149631](https://github.com/openclaw/openclaw/issues/149631)** (stale, since 2026-09-16) — PR preflight throws at 121 jobs against the 120 Node matrix cap; blocks CI for many PRs. No fix PR. **High leverage: fixing this could unblock contributor velocity.**
- **[#166133](https://github.com/openclaw/openclaw/issues/166133)** (stale, since 2026-10-06) — MCP tool_call wrapper coerces integer args to string, breaking integer-param MCP tools. Common integration blocker; needs owner.
- **[#155633](https://github.com/openclaw/openclaw/issues/155633)** (stale, 13 comments) — Databricks Unity Gateway provider request; implementation PR #155634 is open but stuck on product decision. Enterprise users blocked.
- **[#112313](https://github.com/openclaw/openclaw/issues/112313)** (since 2026-07-21, diamond lobster) — Dead-lettered outbound delivery queue entries are permanent; no CLI/RPC/TTL can clear them. Long-standing data-plane wart.
- **[#90074](https://github.com/openclaw/openclaw/issues/90074)** (since 2026-06-04, diamond lobster) — OpenAI image generation ignores Codex OAuth routing when explicit provider config exists. Oldest high-rated item in this digest.
- **[#107433](https://github.com/openclaw/openclaw/issues/107433)** (platinum hermit, since 2026-07-14) — Backup intentional-omission manifests; needs product + security decisions before it can land.

**Recommendation:** Prioritize owner assignment on #149631 (CI matrix cap — unblocks contributors), #166133 (MCP integer coercion — integration-breaking), and the two P0s lacking repro/fix (#166634, #161800).

---
*Digest generated from GitHub activity on 2026-11-03. Comment/reaction counts reflect the top-50 issues and top-30 PRs by engagement; full dataset includes 424 issues and 500 PRs.*

---

## Cross-Ecosystem Comparison

# Cross-Project Comparison Report
## Personal AI Assistant / Agent Open-Source Ecosystem — 2026-11-03

---

## 1. Ecosystem Overview

The personal AI assistant / agent open-source landscape on 2026-11-03 is bifurcated between **high-velocity core platforms** (OpenClaw, Hermes Agent, ZeroClaw, QwenPaw) and **low-activity or automation-only projects** (IronClaw). The four active projects share strikingly convergent pain points — **silent failures, upgrade fragility, sandbox/security hardening, and long-session resource leaks** — suggesting an ecosystem-wide maturation phase in which reliability, not feature velocity, is the binding constraint. Security auditing has become a first-class community contribution pattern, particularly in ZeroClaw and OpenClaw. Meanwhile, all four active projects are operating near a **release gate** (OpenClaw 2026.10.x, Hermes v0.22.6→v0.23.0, ZeroClaw pre-v0.9.0, QwenPaw 2.3.0-beta.2), implying the ecosystem is consolidating rather than expanding its surface area this cycle.

---

## 2. Activity Comparison

| Project | Issues (updated/24h) | PRs (updated/24h) | Open/Active Ratio | Release Status | Health Score* |
|---|---|---|---|---|---|
| **OpenClaw** | 424 (207 open, 217 closed) | 500 (327 open, 173 merged) | ~49% open issues / 65% open PRs | No release today; on 2026.10.x + 2026.9.34 extended-stable | **7.0 / 10** — high throughput, but heavy P0/P1 crash-loop & data-loss debt |
| **Hermes Agent** | 50 (44 active) | 50 (42 open, 8 merged) | 88% open issues / 84% open PRs | **v0.22.6 shipped Nov 2** (~776 PRs rolled up) | **7.5 / 10** — strong velocity + fresh release, but review backlog growing |
| **ZeroClaw** | 48 (47 active) | 50 (46 open, 4 merged) | 98% open issues / 92% open PRs | No release; pre-v0.9.0 release-gate phase | **6.5 / 10** — security-conscious but review-bound; multiple `p0`/`release:v0.9.0` items stalled |
| **QwenPaw** | 16 (9 open bugs) | 43 (28 open, 15 merged) | 56% open issues / 65% open PRs | **v2.3.0-beta.2 shipped** (crashes on sandbox import — #8515) | **7.0 / 10** — healthy close rate, but regression + silent-failure pattern + Windows backlog |
| **IronClaw** | 0 | 4 (2 open, 2 closed) | n/a | No release | **4.0 / 10** — stable but community-inactive; dependabot-only motion |

\*Health score is a composite heuristic (activity balance, release cadence, severity of open defects, review responsiveness). Not an official metric.

**Headline observation:** OpenClaw operates at ~8–10× the raw volume of peers, but its **open-defect severity skews higher** (P0s without repro/fix). Hermes and QwenPaw show the healthiest merge-to-intake ratios; ZeroClaw has the widest PR-merge deficit (46 open vs. 4 merged).

---

## 3. OpenClaw's Position

**Advantages vs. peers:**
- **Largest community by an order of magnitude** — 924 issue/PR events in 24h vs. ~100 for Hermes/ZeroClaw and ~59 for QwenPaw. This yields broader bug discovery, richer reproduction reports, and a deeper contributor pool.
- **Mature release-engineering** — explicit extended-stable (2026.9.34) and hotfix-backport workflows (PR #191618) that no peer project yet demonstrates.
- **Richer surface area** — plugin starter prompts (#186593), OpenClaw ID protocol contracts (#191469), Postgres chat-history concurrency (#190129), adaptive CI (#191226). Peer projects are still building foundational subsystems (Marketplace, plugin RPC).

**Technical approach differences:**
- OpenClaw's failures cluster around **distributed/stateful concerns** (shared-state integrity admission, gateway RSS growth, checkpoint reclamation, iOS device identity) — the signature of a **multi-channel, multi-host, stateful architecture** at scale.
- Peers (Hermes, QwenPaw, ZeroClaw) exhibit **single-node, session/gateway-scoped** failure modes (routing FIFO, worker sidecars, installer libc detection).

**Community size comparison:** OpenClaw ≈ 10× the engagement of Hermes/ZeroClaw, ≈ 15× QwenPaw, and effectively infinite relative to IronClaw's silent window. However, community size has not translated into faster P0 resolution — #166634 and #161800 remain fix-less, and `doctor` hangs (#187900, #178359) persist across all modes despite being the project's primary operator tool.

**Net position:** OpenClaw is the **de facto reference implementation** by scale and ecosystem depth, but its reliability debt is proportionally larger and more architecturally embedded than any peer's.

---

## 4. Shared Technical Focus Areas

The following requirements recur across ≥2 projects — these represent ecosystem-level, not project-level, needs:

| Cross-Cutting Need | OpenClaw | Hermes | ZeroClaw | QwenPaw | Evidence |
|---|---|---|---|---|---|
| **Silent-failure elimination** — success signals must not mask data loss or outage | #187900 doctor hangs; #142821 redaction poisons context | #145470 update exits 0 but gateway stopped; #110374 Slack status silent | #12187 tool envelope corruption; #12121 PATH truncation | #8500 Auto-Dream `success=True` drops memory; #8549 provider vanishes | **All 4** |
| **Upgrade / update safety** | #164800 dead activation driver; version-drift confusion | #148192 macOS Squirrel; #145470 gateway left down | #12153/#12156 musl/glibc mis-detect | #8515 beta crashes on import; #8547 fixed regression returns | **All 4** |
| **Long-session / always-on resource stability** | #182369 RSS +0.1 GiB/h; #154104 idle 50% CPU | multi-profile gateway self-restart #148023 | prompt-cache busting #11703 | #7222 backend memory → 20.7 GB | **All 4** |
| **Sandbox / path-boundary correctness** | #173058 workspaceOnly ineffective | — | #12126 UNC SMB credential leak; #12134 /mnt allowlist gaps; #12137 Seatbelt mis-escape | #8018 sandbox ACL on volume root | **3** |
| **Cross-platform (Windows-heavy) parity** | tooling hangs on Linux; iOS identity loops | Windows Kanban freeze #146440 | PATH truncation; installer mis-detect | GBK decode drops bytes #8234; CRLF #8235 | **3** |
| **Session/provider-switch resilience** | #186684 native session invalidation | #142844 un-drainable session; #148257 handoff wake | cached-turn poisoning #12187 | #7966 permanent session break after provider switch | **All 4** |
| **Secret/auth isolation for multi-account** | #145309 CLAUDE_CONFIG_DIR ignored | — | OIDC callback CSRF #12050 | — | **2** |
| **Prompt-cache / cost economics** | #147344 silent model escalation burned $25 | — | #11703 deferred tool activation busts cache | — | **2** |
| **Dependency/security currency** | — | #133435 18 high npm vulns | SSRF #12146, WebP unbounded #9883 | #8048 Office COM unsandboxed fallback | **3** |

**Synthesis:** The shared requirements are no longer "add capabilities" but **"make the capabilities we have trustworthy."** Silent failure is the single most consistent ecosystem signal — and it directly erodes the operator trust that always-on personal assistants depend on.

---

## 5. Differentiation Analysis

| Dimension | OpenClaw | Hermes Agent | ZeroClaw | QwenPaw | IronClaw |
|---|---|---|---|---|---|
| **Feature focus** | Multi-channel, plugin & protocol platform; enterprise-grade release engineering | Plugin platform maturity + Marketplace; multi-profile gateway; Kanban workers | Security hardening; plugin RPC/webhook foundation; workflow steering | Console UX, memory/cron workflows, creator/media tools, sandboxed deployment (NAS) | None observed |
| **Target users** | Power users, multi-host operators, agent roster maintainers | Multi-profile hosts, Slack/Discord teams, Kanban fleet operators, desktop remote-gateway workflows | Security-conscious self-hosters; audited/production deployments | Always-on home-server/NAS users, creator workflows, codex/qoder backend users | Unknown — community silent |
| **Technical architecture (inferred from failure modes)** | Stateful, distributed, multi-channel; Postgres chat history; gateway + device identity | Gateway/session-routing-centric; SQLite-backed; plugin runtime with sidecars | Rust core, Wasm-UI debate, per-profile config, sandbox profiles (Seatbelt) | Python backend (sqlite), sandbox ACL, restricted POSIX deployment | Rust (rustls dep) — otherwise opaque |
| **Release posture** | Mature extended-stable + backports | Aggregated patch releases (~776 PRs in v0.22.6) | Pre-v0.9.0 release-gate, security-label-driven | Rapid beta iteration (2.3.0 line) | Dependabot only |
| **Distinctive strength** | Scale + protocol ecosystem | Plugin API + Marketplace trajectory | Community security auditing culture | Console/UX polish + workflow breadth | — |
| **Distinctive weakness** | Architectural reliability debt at scale | Review backlog vs. intake | Review bandwidth bottleneck | Silent-failure pattern + Windows regressions | Zero community voice |

---

## 6. Community Momentum & Maturity

**Activity tiers:**

- **Tier 1 — Core-scale iterating (very high):** OpenClaw. Volume leader by ~10×; iterating on platform protocols and extended-stable discipline, but stabilizing under heavy P0/P1 pressure.
- **Tier 2 — Rapidly iterating (high):** Hermes Agent, ZeroClaw, QwenPaw. All three are in **stabilization ahead of a milestone release** (v0.23.0, v0.9.0, 2.3.0-stable respectively). Hermes shows the most balanced merge cadence; ZeroClaw the most acute review deficit; QwenPaw the best close rate (7 issues + 15 PRs closed in 24h).
- **Tier 3 — Dormant/automated:** IronClaw. Community axis silent; automation axis healthy.

**Maturity signals:**
- **Highest maturity:** OpenClaw (extended-stable backports, adaptive CI, protocol contracts) — though its reliability debt tempers the assessment.
- **Most rapidly iterating:** Hermes (776-PR rollup release) and ZeroClaw (same-day issue→PR turnaround, e.g., #12187→#12188).
- **Most stabilizing:** Hermes (moving from 776-PR churn into structured v0.23.0) and QwenPaw (beta-to-stable cadence).
- **Review-bottlenecked:** ZeroClaw (46 open PRs vs. 4 merged; `p0` #11225 unmerged) and QwenPaw (Windows/security PRs #8234/#8235/#8236/#8018 stalled 3–6 weeks).

**Contributor concentration risk:** ZeroClaw's security batch is largely driven by a **single power user (IftekharUddin)**; if that contributor disengages, the hardening pipeline thins. QwenPaw's Windows fixes share one author, creating similar key-person risk.

---

## 7. Trend Signals

**Extracted from cross-project community feedback — actionable for AI agent developers:**

1. **Silent success is the new critical bug class.** Across all four active projects, the most trust-eroding defects report success while losing data or leaving services down (QwenPaw #8500, Hermes #145470, ZeroClaw #12187). **Design principle: fail loudly, never `success=True` on partial failure.**

2. **Always-on workloads expose a shared runtime-stability gap.** Memory growth of 20 GB (QwenPaw), off-heap RSS creep (OpenClaw), and gateway restart loops (Hermes) all surface under continuous operation — the exact "personal assistant" deployment users are targeting. **Long-run soak testing and retention/TTL policies are lagging features.**

3. **Upgrade paths are the ecosystem's most fragile interface.** Every active project has update-failure reports (dead activation drivers, Squirrel breakage, left-stopped gateways, silent skips, reintroduced regressions). **Transactional, verified, observable updates are table stakes — and currently unmet.**

4. **Security auditing is becoming an organic community activity.** ZeroClaw's Windows/SMB/SSRF batch, OpenClaw's fs-boundary and redaction concerns, and QwenPaw's sandbox ACL work show power users now audit agent threat models unprompted. **Sandbox profile correctness (gating unsandboxed fallbacks, allowlist completeness, path canonicalization) is the emerging security frontier for agents.**

5. **Prompt caching is now a cost-control surface, not a nicety.** ZeroClaw #11703 and OpenClaw's model-escalation incident show operators measure per-turn token economics. **Tool-activation ordering and reasoning-effort defaults materially affect unit cost.**

6. **Windows and CJK environments remain second-class.** CRLF corruption, GBK byte-drops, PATH truncation, and sandbox ACL propagation cluster on Windows — a meaningful gap if the ecosystem wants mainstream adoption.

7. **Review bandwidth, not authoring throughput, is the ecosystem's bottleneck.** ZeroClaw (46:4 open:merged), QwenPaw (stalled Windows/security PRs), and OpenClaw (high-severity fix-less P0s) all point to **maintainer triage capacity as the limiting reagent** — not contribution volume.

**Bottom line for decision-makers:** The ecosystem has converged on capability parity and is now competing on **trustworthiness under always-on, multi-environment, security-audited conditions.** The projects that win the next cycle will be those that convert silent failures into visible ones, make upgrades transactional, and clear their review backlogs — before adding new surface area.

---

## Peer Project Reports

<details>
<summary><strong>Hermes Agent</strong> — <a href="https://github.com/nousresearch/hermes-agent">nousresearch/hermes-agent</a></summary>

# Hermes Agent — Project Digest
**Date:** 2026-11-03
**Repository:** [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent)

---

## 1. Today's Overview

Hermes Agent shows **very high development velocity** on 2026-11-03, with 50 issues and 50 PRs updated in the last 24 hours — a near-even split between issue triage and PR review activity. The project shipped **v0.22.6**, a patch release that rolls up roughly **776 PRs** merged since v0.22.5, signaling an unusually large stabilization window ahead of a planned v0.23.0. Despite the churn, **44 of 50 issues remain open/active** and only 8 of 50 PRs were merged/closed, suggesting a growing review backlog relative to intake. The most-commented threads cluster around **gateway/session routing bugs**, **mobile beta distribution limits**, and **install/update reliability on macOS and Windows**. Overall project health is strong on throughput but shows signs of **accumulating P2 bug debt** in gateway, sessions, and install-update subsystems.

---

## 2. Releases

### [v0.22.6](https://github.com/NousResearch/hermes-agent/releases) — Released November 2, 2026
> *"Patch release. This tag rolls up the ~776 PRs merged since v0.22.5 into a stable release for the GitHub release (CLI and installers), the Microsoft Store app, Docker and Hermes Cloud. Full curated notes for this window ship with v0.23.0."*

**Analysis:**
- **Scope:** Aggregate stabilization release; ~776 PRs folded in since v0.22.5.
- **Breaking changes:** None declared in this tag; curated migration notes are deferred to **v0.23.0**.
- **Migration notes:** Users on v0.22.5 should update to receive accumulated fixes; expect detailed changelog in v0.23.0.
- **Notable in-flight fixes targeting this window:** macOS Squirrel update fix ([PR #138708](https://github.com/NousResearch/hermes-agent/pull/138708), [PR #148192](https://github.com/NousResearch/hermes-agent/pull/148192)) and the sibling send-path Group Chat handoff fix (#145981, referenced in [#148257](https://github.com/NousResearch/hermes-agent/issues/148257)).

---

## 3. Project Progress

**Merged/closed PRs today (8 total, notable):**
- [PR #138708](https://github.com/NousResearch/hermes-agent/pull/138708) — **CLOSED** — `fix(bundles): bake pycs owner-writable so Squirrel.Mac updates install` (resolves [#138659](https://github.com/NousResearch/hermes-agent/issues/138659)).
- [PR #148192](https://github.com/NousResearch/hermes-agent/pull/148192) — **CLOSED** — Same fix as above via alternate path; resolves the long-standing macOS desktop update failure.
- [PR #146409](https://github.com/NousResearch/hermes-agent/pull/146409) — **CLOSED** — `plugin-catalog: holographic 0.26.3` — plugin catalog refresh with ~30× faster secret/instruction screening on long texts.

**Closed Issues today (6 total, notable):**
- [#143268](https://github.com/NousResearch/hermes-agent/issues/143268) — **CLOSED** — Local Kanban notify+wake FIFO routing bug (13 comments — most-discussed issue of the day).
- [#147036](https://github.com/NousResearch/hermes-agent/issues/147036) — **CLOSED** — `/api/config/schema` event-loop freeze (~3s stall) fixed.
- [#138659](https://github.com/NousResearch/hermes-agent/issues/138659) & [#137717](https://github.com/NousResearch/hermes-agent/issues/137717) — **CLOSED** — macOS/Windows bundle prepare & update failures.
- [#148198](https://github.com/NousResearch/hermes-agent/issues/148198) — **CLOSED** — Feature: `correlation_id` added to tool-hook payloads.

**Features advanced:**
- Plugin platform maturity: [PR #146732](https://github.com/NousResearch/hermes-agent/pull/146732) introduces **session forks, review signals, and idle tasks** for plugins (experimental APIs).
- Windows service introspection: [PR #146476](https://github.com/NousResearch/hermes-agent/pull/146476) adds `hermes-windows-services` plugin.
- Marketplace groundwork: [PR #148271](https://github.com/NousResearch/hermes-agent/pull/148271) hides legacy catalog links ahead of **Hermes Marketplace**.

---

## 4. Community Hot Topics

| Rank | Item | Comments | Signal |
|------|------|----------|--------|
| 1 | [#143268](https://github.com/NousResearch/hermes-agent/issues/143268) — Local Kanban notify+wake FIFO (CLOSED) | 13 | Session/gateway routing correctness |
| 2 | [#147269](https://github.com/NousResearch/hermes-agent/issues/147269) — Android beta Firebase tester limit | 12 | **Distribution bottleneck**, 2 👍 |
| 3 | [#110374](https://github.com/NousResearch/hermes-agent/issues/110374) — Slack status broken w/ slack-sdk ≥3.44 | 11 | **16 👍 — highest community demand** |
| 4 | [#133435](https://github.com/NousResearch/hermes-agent/issues/133435) — 18 high npm vulns in lockfile | 7 | Security/compliance concern |
| 5 | [#143653](https://github.com/NousResearch/hermes-agent/issues/143653) — chat -q fails from Kanban worker env | 6 | Canonical contract drift |

**Underlying needs:**
- **Gateway/session routing correctness** dominates the top of the list — three of the top five items touch session FIFO, routing scope, or canonical contracts.
- **Mobile beta availability** is a real demand signal: users are actively trying to onboard but are blocked by Firebase/TestFlight capacity.
- **Slack SDK compatibility** (#110374) with 16 👍 is the **clearest unmet user need** of the day — a silent UX regression affecting every turn.

---

## 5. Bugs & Stability

Ranked by severity and impact (P2 = high priority in this project):

| Severity | Issue | Impact | Fix PR? |
|----------|-------|--------|---------|
| 🔴 P2 | [#148023](https://github.com/NousResearch/hermes-agent/issues/148023) — Gateway **self-restart loop**, watchdog exit 75 | Multi-profile hosts see ~6-min restart cycles; silent outage | No |
| 🔴 P2 | [#142844](https://github.com/NousResearch/hermes-agent/issues/142844) — Live local session un-drainable (missing routing row) | Inputs queue forever; only restart recovers | No |
| 🔴 P2 | [#145470](https://github.com/NousResearch/hermes-agent/issues/145470) — `hermes update` exits 0 but leaves gateway **stopped** | Silent outage on cron/messaging hosts | No |
| 🔴 P2 | [#147857](https://github.com/NousResearch/hermes-agent/issues/147857) — Kanban worker crashes after 2 fallback compressions | `_fallback_probe_at` rejected by `worker_sidecars` | No |
| 🟠 P2 | [#110374](https://github.com/NousResearch/hermes-agent/issues/110374) — Slack status silently broken (slack-sdk ≥3.44) | Every Slack turn loses status indicator | No (16 👍) |
| 🟠 P2 | [#141971](https://github.com/NousResearch/hermes-agent/issues/141971) — CLI reports "outcome unknown" though turn completed | Misleading error on gateway socket close | No |
| 🟠 P2 | [#148238](https://github.com/NousResearch/hermes-agent/issues/148238) — `session.resume` refuses chats with missing cwd | Bare `invalid_params` on Desktop | ✅ [PR #148269](https://github.com/NousResearch/hermes-agent/pull/148269) |
| 🟠 P2 | [#148257](https://github.com/NousResearch/hermes-agent/issues/148257) — Group Chat members can't wake post-handoff | Authority epoch mismatch | No |
| 🟡 P2 | [#148272](https://github.com/NousResearch/hermes-agent/issues/148272) — `/compact` unreachable in Bot Mode | Bots can't shrink context | No |
| 🟡 P2 | [#147939](https://github.com/NousResearch/hermes-agent/issues/147939) — Concurrent config writers lose updates | No lock around single-key YAML RMW | No |

**Regressions observed post-0.22.6:** [#148257](https://github.com/NousResearch/hermes-agent/issues/148257) was explicitly reproduced on the **0.22.5 → 0.22.6 desktop update**, indicating a partial fix (send-path fixed by #145981) with the member-wake side still broken.

**Fix PRs exist today for:** `session.resume` cwd staleness ([#148269](https://github.com/NousResearch/hermes-agent/pull/148269)), ACP duplicate streaming replies ([#148268](https://github.com/NousResearch/hermes-agent/pull/148268)), Matrix attribute sanitizing ([#148265](https://github.com/NousResearch/hermes-agent/pull/148265)).

---

## 6. Feature Requests & Roadmap Signals

**User-requested features today:**
- [#148198](https://github.com/NousResearch/hermes-agent/issues/148198) (CLOSED) — `correlation_id` in tool-hook payloads for plugin state correlation → **already implemented**, likely lands in v0.23.0.
- [PR #146732](https://github.com/NousResearch/hermes-agent/pull/146732) — **Plugin session forks, review signals, idle tasks** — experimental APIs; strong candidate for v0.23.0.
- [PR #146476](https://github.com/NousResearch/hermes-agent/pull/146476) — `hermes-windows-services` plugin (services introspection).
- [PR #148018](https://github.com/NousResearch/hermes-agent/pull/148018) — `photo-to-part` v0.1.9 plugin (vision + physical reconstruction).
- [PR #148271](https://github.com/NousResearch/hermes-agent/pull/148271) — **Marketplace preparation** (hide legacy catalogs).

**Prediction for v0.23.0:**
1. **Plugin fork/idle-task APIs** — flagship feature of the cycle.
2. **Marketplace GA** — docs already being reorganized.
3. **macOS/Windows installer hardening** — three PRs (#138708, #148192, #148244) converge on bundle reliability.
4. **Kanban/worker sidecar fixes** — multiple P2s clustering around `worker_sidecars` validation.
5. **Slack SDK ≥3.44 compatibility** — high demand; likely prioritized given 👍 count.

---

## 7. User Feedback Summary

**Pain points (dissatisfaction):**
- **Silent failures** are the dominant theme — `hermes update` exits 0 but leaves gateway down ([#145470](https://github.com/NousResearch/hermes-agent/issues/145470)); Slack status indicators disappear silently ([#110374](https://github.com/NousResearch/hermes-agent/issues/110374)); CLI reports "outcome unknown" for successful turns ([#141971](https://github.com/NousResearch/hermes-agent/issues/141971)).
- **Mobile onboarding blocked** — Android beta at Firebase limit ([#147269](https://github.com/NousResearch/hermes-agent/issues/147269)) and iOS beta "Beta Not Found" ([#147556](https://github.com/NousResearch/hermes-agent/issues/147556)). Two separate distribution failures on the same day.
- **Windows worker freezes** during Kanban init ([#146440](https://github.com/NousResearch/hermes-agent/issues/146440)) — two stacked bugs (stdin pipe inheritance + lazy numpy import deadlock).
- **Config write races** ([#147939](https://github.com/NousResearch/hermes-agent/issues/147939)) — concurrent single-key writers lose updates silently.

**Use cases surfacing:**
- Multi-profile gateway hosts (self-restart loop, multiplexed profile actions).
- Kanban-managed worker fleets (worker crashes, triage card staleness).
- Slack-integrated agents (SDK version compatibility).
- Desktop remote-gateway workflows (workspace seeding, session resume).

**Satisfaction signals:**
- High 👍 on [#110374](https://github.com/NousResearch/hermes-agent/issues/110374) (16) shows an engaged user base willing to signal priorities.
- Rapid close of [#143268](https://github.com/NousResearch/hermes-agent/issues/143268) (13 comments) and [#147036](https://github.com/NousResearch/hermes-agent/issues/147036) shows responsive maintainer engagement on high-signal threads.

---

## 8. Backlog Watch

Long-unanswered or high-value items needing maintainer attention:

| Age | Item | Why it matters |
|-----|------|----------------|
| **~7 months** | [#6533](https://github.com/NousResearch/hermes-agent/issues/6533) — Slack gateway platform note incorrect when MCP tools available | Causes **false refusals** in production Slack deployments; open since 2026-04-09 with only 3 comments. |
| **~7 weeks** | [#110374](https://github.com/NousResearch/hermes-agent/issues/110374) — Slack status broken (slack-sdk ≥3.44) | **16 👍 — highest community demand**, no fix PR. Silent regression. |
| **~3 weeks** | [#133435](https://github.com/NousResearch/hermes-agent/issues/133435) — 18 high npm vulns pinned in lockfile | Security/compliance blocker; remediation blocked by design (`hermes update` discards lockfile churn). |
| **~2 weeks** | [#138449](https://github.com/NousResearch/hermes-agent/issues/138449) — Discord tools silently off without explicit `platform_toolsets.discord` | Docs contradict behavior; confusing for new Discord users. |
| **~11 days** | [#146440](https://github.com/NousResearch/hermes-agent/issues/146440) — Windows Kanban worker freeze | Platform-specific, two stacked root causes; no PR yet. |
| **~2 days** | [#148023](https://github.com/NousResearch/hermes-agent/issues/148023) — Gateway self-restart loop | **Highest-severity new bug**; watchdog kills gateway 7×/37min on multi-profile hosts. |

**Recommendation:** Prioritize [#148023](https://github.com/NousResearch/hermes-agent/issues/148023) (self-restart loop) and [#110374](https://github.com/NousResearch/hermes-agent/issues/110374) (Slack SDK) for v0.23.0 — both affect broad user cohorts and have clear repro paths but no assigned fix PRs.

---

*Digest generated from GitHub activity data for 2026-11-03. All links point to `github.com/NousResearch/hermes-agent`.*

</details>

<details>
<summary><strong>IronClaw</strong> — <a href="https://github.com/nearai/ironclaw">nearai/ironclaw</a></summary>

# IronClaw Project Digest — 2026-11-03

## 1. Today's Overview

IronClaw's activity over the last 24 hours is dominated entirely by automated dependency maintenance. Four pull requests were updated — two opened and two closed — all authored by `dependabot[bot]` and all concerning the same `rustls` crate bump (0.23.43 → 0.23.45/0.23.46). No issues were opened, updated, or closed in the period, and no new releases were published. Overall project health appears stable but community-quiet: there is no human-initiated feature work, bug discussion, or roadmap conversation visible in this window, and the only forward motion is routine supply-chain hygiene.

## 2. Releases

No new releases were published in the last 24 hours. Nothing to report on version changes, breaking changes, or migration notes.

## 3. Project Progress

Two PRs were closed today, both superseded dependency bumps:

- [PR #8151](https://github.com/nearai/ironclaw/pull/8151) `[CLOSED]` — chore(deps): bump `rustls` 0.23.43 → 0.23.45 in `/harness/latency/runner` (opened 2026-10-20, closed 2026-11-02)
- [PR #8152](https://github.com/nearai/ironclaw/pull/8152) `[CLOSED]` — chore(deps): bump `rustls` 0.23.43 → 0.23.46 (opened 2026-10-20, closed 2026-11-02)

Both closures appear to result from being replaced by newer, more current bump PRs (#8165, #8166), which target 0.23.46 instead of 0.23.45. **No feature work, bug fixes, or refactors advanced today.** The net progress is version currency on a security-relevant TLS dependency.

## 4. Community Hot Topics

There are no hot topics in the traditional sense. All four PRs carry `Comments: undefined` and `👍: 0`, indicating **zero community discussion or reactions**:

- [PR #8165](https://github.com/nearai/ironclaw/pull/8165) — `rustls` 0.23.43 → 0.23.46 (open)
- [PR #8166](https://github.com/nearai/ironclaw/pull/8166) — `rustls` 0.23.43 → 0.23.46 in `/harness/latency/runner` (open)
- [PR #8151](https://github.com/nearai/ironclaw/pull/8151) — `rustls` → 0.23.45 in harness runner (closed)
- [PR #8152](https://github.com/nearai/ironclaw/pull/8152) — `rustls` → 0.23.45 (closed)

**Underlying need analysis:** The only signal here is operational — the project maintains a multi-crate/manifest structure (a root workspace and at least one separate `harness/latency/runner` package), requiring parallel dependabot PRs for the same dependency. That the 0.23.45 PRs sat open for ~13 days before being closed in favor of 0.23.46 suggests a slow merge cadence for dependency updates. For an AI agent project, this is worth watching: prompt-injection and tool-execution surfaces make TLS/runtime dependency currency more security-sensitive than in a typical library.

## 5. Bugs & Stability

No bugs, crashes, or regressions were reported or discussed in the last 24 hours. The `rustls` bumps are precautionary version currency rather than incident-driven fixes, though the changelog fragment noted in the PR summary ("Delay saving KX hint until handshake confirmation") indicates upstream TLS handshake correctness improvements are being picked up. **No outstanding stability issues are visible in this window.**

## 6. Feature Requests & Roadmap Signals

No feature requests or roadmap discussions appeared today — zero issues were created or updated, so there is no user-driven signal to extrapolate from. Based on the observed data alone, the near-term pipeline is limited to merging the two open `rustls` 0.23.46 bumps (#8165, #8166); no product features can be predicted from this dataset.

## 7. User Feedback Summary

There is **no user feedback to report** today. With no issues opened, updated, or commented on, and no reactions on any PR, there is no evidence of user pain points, use cases, satisfaction, or dissatisfaction. This is a data gap rather than a negative signal — but it does mean the project's user-voice channels were silent in this 24-hour window.

## 8. Backlog Watch

- [PR #8165](https://github.com/nearai/ironclaw/pull/8165) and [PR #8166](https://github.com/nearai/ironclaw/pull/8166) — open dependabot bumps that **currently have no maintainer review**. Given that their 0.23.45 predecessors (#8151, #8152) lingered for 13 days before being superseded, there is a risk of the same slow-merge cycle repeating. Merging promptly would avoid a third redundant round of bump PRs.
- No long-unanswered issues exist in the current dataset (total issues: 0), so backlog risk is confined to the dependency-update queue.

---

**Health assessment:** Stable but inactive on the human/community axis; healthy on the automation axis (dependency currency maintained, no security regressions reported). The primary actionable item is maintainer review of the two open `rustls` bumps to prevent dependency-PR churn.

</details>

<details>
<summary><strong>QwenPaw</strong> — <a href="https://github.com/agentscope-ai/QwenPaw">agentscope-ai/QwenPaw</a></summary>

# QwenPaw Project Digest — 2026-11-03

## 1. Today's Overview

QwenPaw shows **high velocity** with 43 PRs and 16 issues updated in the last 24 hours, alongside a fresh beta release (`v2.3.0-beta.2`) that has already triggered a release-duty verification issue (#8539). The project is clearly in an active stabilization phase around the 2.3.0 line, with a heavy concentration of bug fixes touching Windows file I/O, restricted-deployment startup, memory lifecycle, and sandbox security. Community engagement remains strong but **skewed toward bug reporting rather than feature co-development** — 9 of 16 updated issues are open bugs, several of them regressions or data-loss-adjacent. The maintainer response rate appears healthy (7 issues closed in 24h, 15 PRs merged/closed), though a handful of significant PRs (#8235, #8236, #8234, #8018) have been open for 3+ weeks and are becoming stale.

## 2. Releases

**v2.3.0-beta.2** was published (release page: https://github.com/agentscope-ai/QwenPaw/releases/tag/v2.3.0-beta.2).

Scope of changes (partial changelog):
- `fix(console)`: limit agent skill selection to creation (@zhaozhuang521) — PR #8448
- `fix(console)`: compact media preview error cards (@zhaozhuang521) — PR #8451
- Console browser usability fixes (truncated in release notes)

**Migration / breaking notes:** None explicitly declared in the provided changelog. However, issue #8515 reports that this exact version (`2.3.0b2`) **crashes on import** in restricted POSIX sandboxes (fnOS NAS) because the dependency-maintenance lock root prioritizes `pwd.getpwuid(os.getuid()).pw_dir` over `$HOME`, and the `QWENPAW_DEPENDENCY_STATE_DIR` override is undocumented. Treat 2.3.0-beta.2 as **not yet safe for sandboxed/containerized deployments**.

A release-duty verification issue was auto-filed: #8539 (4-hour platform pass window, deadline 2026-11-02 10:08 UTC).

## 3. Project Progress

Closed/merged in the last 24h include several meaningful fixes:

- **#8541 [CLOSED]** (`fix(sqlite)`): skip completed startup migrations and snapshot live backups — removes startup blockage where scroll-history sync reprocessed already-synced agents. This is the fix PR for issue #8540.
- **#8545 [CLOSED]** (`fix(console)`): repair settings search navigation and indexing — settings were unfindable, mis-routed, or invisible inside drawers/modals; indexing now covers model routes, runtimes, scheduled tasks, and channel accounts.
- **#8536 [CLOSED]** (`feat(tools)`): AnySearch becomes the default `web_search` provider when unconfigured.
- **#8400 [CLOSED]** (`fix(skill)`): resolved a scanner false-positive (COMMAND_INJECTION_EVAL) that blocked the built-in `make-skill` validator.
- **#8548 [CLOSED]** (`fix(tests)`): isolate host dependency observation inputs on Windows.

Forward-looking work in review: #8504 (desktop approval notifications, XXXL), #8409 (QQ C2C streaming messages), #8178 (nested skill directories), #7903 (community + inbox integration, XXXL), #8544 (optional Jev completion decisions).

## 4. Community Hot Topics

Ranked by comment activity:

1. **#7715 [CLOSED]** — Daily Paper fails silently when arxiv.org unreachable (6 comments). https://github.com/agentscope-ai/QwenPaw/issues/7715 — Underlying need: **actionable error surfacing**. Users cannot distinguish network failure from plugin logic failure.
2. **#7222 [CLOSED]** — `qwenpaw-backend` memory grows unbounded to 20.7 GB after ~2 days (5 comments). https://github.com/agentscope-ai/QwenPaw/issues/7222 — Underlying need: **long-run stability for always-on assistants**; distinct from startup leaks, this is runtime accumulation.
3. **#7966 [OPEN]** — Session permanently broken after provider switch; `file://` media URLs rejected with `invalid_parameter_error` (4 comments). https://github.com/agentscope-ai/QwenPaw/issues/7966 — Underlying need: **provider-switch resilience**; a broken session with no recovery path is a hard blocker.
4. **#8500 [OPEN]** — Auto-Dream silently drops memory, checkpoints unusable extracts, `success=True` (4 comments). https://github.com/agentscope-ai/QwenPaw/issues/8500 — Underlying need: **memory integrity guarantees**; silent data loss with a success signal is the most trust-eroding class of bug in a personal assistant.

The pattern across hot topics: users are running QwenPaw **continuously and dependently**, and the failures that generate the most discussion are those where the system *lies about success* rather than failing loudly.

## 5. Bugs & Stability

Ranked by severity:

| Severity | Issue | Status | Fix PR |
|---|---|---|---|
| **Critical** | #8515 — v2.3.0b2 crashes on import in restricted sandbox (fnOS); `QWENPAW_DEPENDENCY_STATE_DIR` undocumented | OPEN | #8527 (Under Review) reports `DEPENDENCY_STATE_ROOT_UNAVAILABLE` at startup |
| **Critical** | #8500 — Auto-Dream silently drops a day of memory, checkpoints unusable extracts | OPEN | None |
| **High** | #7966 — Session permanently broken after provider switch (`file://` media URLs) | OPEN | #7973 (`fix(agents)`: recover from rejected media URLs) |
| **High** | #8549 — Model config write path bypasses validation; invalid `thinking_budget`/`max_input_length` persisted, provider silently disappears after restart | OPEN (filed today) | #8550 (filed today) |
| **High** | #8540 — Scroll history sync blocks startup, rescans completed migrations | CLOSED | #8541 (merged) |
| **Medium** | #8538 — Matrix channel plugin fails to activate when multiple workspaces enable it (10s shared startup window) | OPEN | None |
| **Medium** | #8533 — Codex/Qoder scheduled tasks misjudge non-empty requests as empty (`ValueError: Third-party agent requests require text or attachments`) | OPEN | None |
| **Medium** | #8547 — Creator cat-perspective example still unopenable on Windows in 2.0.4; regression of #7291 (closed as fixed in 1.1.2) | OPEN | None |
| **Medium** | #8534 — Creator TTS cannot use Aliyun Token Plan key; qwen-audio-tts uses a different DashScope service, protocol option missing from UI | OPEN | None |
| **Low (churn)** | #8378 — Model call anomaly after upgrade (legacy `agent.json` schema) | CLOSED | — |
| **Low (churn)** | #6726 — Long console session with heavy tool usage fails with 400 tool-role ordering error | CLOSED | — |
| **Low (churn)** | #8176 — Plugin Store "Update All" skips third-party plugins | CLOSED | — |

**Notable regressions:** #8547 (previously claimed fixed), and #8515 (new in beta.2). Windows remains the most bug-dense platform across file encoding (#8234), CRLF (#8235), and sandbox ACL (#8018) fixes in the PR queue.

## 6. Feature Requests & Roadmap Signals

Only one explicit feature request today:

- **#8537 [OPEN]** — Surface stale/unprocessed daily notes as deduplicated Inbox reminders. https://github.com/agentscope-ai/QwenPaw/issues/8537 — The author explicitly contrasts this with #4652 and ReMe#393 ("ReMe v4 covers it"), positioning it as a **residual gap verified in code**. This is a well-scoped request and a plausible candidate for a 2.3.x point release.

Roadmap signals from open PRs likely to land in 2.3.0 stable or 2.4.0:
- Approval/background **system notifications** (#8504, XXXL) — high user-visible value
- **Nested/categorized skill directories** (#8178, XXL) — brings QwenPaw in line with other agent frameworks
- **QQ C2C streaming** (#8409) — channel expansion
- **Community + inbox integration** (#7903) — platform-level feature, likely gated on Platform service readiness
- **Jev completion decisions** (#8544) — optional turn-completion quality gate

## 7. User Feedback Summary

**Pain points (dissatisfaction):**
- **Silent failure as a pattern.** #7715 (misleading "no returned content"), #8500 (`success=True` while dropping memory), #8549 (provider vanishes silently), #8176 (update-all silently skips plugins). Users repeatedly encounter systems that report success while doing nothing or losing data.
- **Upgrade fragility.** #8378 (schema config breaks after upgrade), #8515 (new beta crashes on import), #8547 (fixed regression returns). Users on stable channels are being burned by upgrade paths.
- **Windows as second-class platform.** CRLF corruption, GBK decoding byte-drops, sandbox ACL propagation, Creator example failure — a cluster of Windows-specific reports.
- **Long-session stability.** #7222 (20 GB growth) and #6726 (400 error after many tool calls) show the assistant degrades under exactly the "always-on personal assistant" workload it is marketed for.

**Use cases observed:** always-on NAS/home-server deployment (fnOS, Windows Server), scheduled cron agents via third-party backends (Codex/Qoder), memory/cron workflows (Daily Paper, Auto-Dream), and creator/media workflows (TTS, inspiration examples).

**Satisfaction signals:** High report quality (detailed repro steps, code-level root-cause analysis, version pinning) indicates an engaged, technically sophisticated user base willing to help. Fast closure of #8540/#8541 and #6726 shows the team does resolve hard issues.

## 8. Backlog Watch

PRs open 3+ weeks needing maintainer attention:

- **#8235** (open since 2026-10-14, Under Review) — `fix(tools)`: preserve CRLF line endings in `edit_file`. https://github.com/agentscope-ai/QwenPaw/pull/8235 — Windows data-integrity fix; stalled in review.
- **#8236** (2026-10-14, Under Review) — `fix(ollama)`: size context window from `num_ctx` instead of 128k default. https://github.com/agentscope-ai/QwenPaw/pull/8236 — Correctness fix for local models.
- **#8234** (2026-10-14, Under Review) — `fix(tools)`: decode GBK/CP936 in read/edit/grep instead of dropping bytes. https://github.com/agentscope-ai/QwenPaw/pull/8234 — Silent data loss on Chinese Windows; same author as #8235/#8236, three related PRs all waiting.
- **#8018** (2026-09-29) — `fix(sandbox)`: never write sandbox ACL on a volume root. https://github.com/agentscope-ai/QwenPaw/pull/8018 — Security-adjacent Windows fix, open 5 weeks.
- **#8048** (2026-09-30) — `fix(security)`: guard inline Office COM automation before unsandboxed fallback. https://github.com/agentscope-ai/QwenPaw/pull/8048 — Security hardening; open 5 weeks.
- **#7973** (2026-09-24) — `fix(agents)`: recover from rejected media URLs (fixes #7966). https://github.com/agentscope-ai/QwenPaw/pull/7973 — Six weeks open; the underlying session-breaking bug remains unpatched.

**Assessment:** The single largest health risk is a **review bottleneck on Windows/encoding correctness and security PRs**, several of which address silent data corruption or sandbox escape paths. These should be prioritized over net-new features. Combined with the silent-failure pattern dominating hot issues, the project's most valuable near-term investment is **making failures loud and making recovery possible**.

</details>

<details>
<summary><strong>ZeroClaw</strong> — <a href="https://github.com/zeroclaw-labs/zeroclaw">zeroclaw-labs/zeroclaw</a></summary>

# ZeroClaw Project Digest — 2026-11-03

## 1. Today's Overview

ZeroClaw shows **very high activity** with 48 issues and 50 PRs updated in the last 24 hours, though the issue tracker is heavily skewed toward open work (47 of 48 issues active; 46 of 50 PRs still open). No new releases landed, and the project remains in the pre‑v0.9.0 release-gate phase — several open items are explicitly tagged `release:v0.9.0`. A notable share of today's traffic is **security and hardening work on Windows and cross‑platform paths**, contributed largely by a small group of power users (IftekharUddin, JordanTheJet, Audacity88), which suggests a maturing threat model but also a concentration of review burden. Overall health: **active and security‑conscious, but maintainer bandwidth appears to be the bottleneck** — many high‑risk PRs carry `needs-author-action`/`needs-maintainer-review` labels.

## 2. Releases

None. No new releases were published in the last 24h.

## 3. Project Progress

Only **4 PRs** were merged/closed in the last 24h (against 46 open), so feature velocity this cycle is review‑bound rather than merge‑bound. The one clearly closed item in the sample is a runtime correctness fix:

- **PR #11297 [CLOSED]** `fix(runtime): honour keep_tool_context_turns when building provider requests` — restores the documented turn‑count semantics of `keep_tool_context_turns`, which had been treated as a boolean since the history rip‑out in #8196. [Link](https://github.com/zeroclaw-labs/zeroclaw/pull/11297)

**PRs advancing but not yet merged:**
- **#11320 / #11322** — plugin webhook dispatch over core RPC and gateway forwarding (stacked; XL, `risk:high`). [Link](https://github.com/zeroclaw-labs/zeroclaw/pull/11320)
- **#10407** — persistent session prompt attachments (SQLite‑backed, transactional TTL cleanup). [Link](https://github.com/zeroclaw-labs/zeroclaw/pull/10407)
- **#12059** — per‑profile OpenAI reasoning‑effort ("thinking" level). [Link](https://github.com/zeroclaw-labs/zeroclaw/pull/12059)
- **#12188** — fixes the tool‑result envelope corruption tracked in #12187 (same‑day issue → PR turnaround). [Link](https://github.com/zeroclaw-labs/zeroclaw/pull/12188)
- **#12157** — binds OIDC enrollment callbacks to the initiating browser (addresses #12050).

## 4. Community Hot Topics

| Item | Comments | Link |
|---|---|---|
| **#8132** Evaluate Rust/WASM web UI prototype before React/Vite migration | 12 | [Link](https://github.com/zeroclaw-labs/zeroclaw/issues/8132) |
| **#10926** Matrix `send_via` treats peer identities as room destinations | 7 | [Link](https://github.com/zeroclaw-labs/zeroclaw/issues/10926) |
| **#11580** x86_64 Linux binary ~0.7 MB under 64 MiB release cap | 4 | [Link](https://github.com/zeroclaw-labs/zeroclaw/issues/11580) |
| **#11703** Deferred tool activation busts prompt cache | 4 | [Link](https://github.com/zeroclaw-labs/zeroclaw/issues/11703) |
| **PR #11225** preserve owner in delegation (p0) | — | [Link](https://github.com/zeroclaw-labs/zeroclaw/pull/11225) |

**Underlying needs:**
- **#8132** is the deepest architectural debate: whether ZeroClaw should eliminate Node.js entirely and adopt a Rust→Wasm frontend. It signals contributor appetite for build‑simplification and supply‑chain reduction, but it's been open since June with a `needs-author-action` tag — a decision is overdue.
- **#11703** reflects growing **cost sensitivity** among operators running deferred MCP loading: prompt‑cache invalidation directly raises per‑turn token spend.
- **#11580** shows the release process is now uncomfortably close to a hard gate — 1% headroom is effectively no headroom.

## 5. Bugs & Stability

Ranked by severity (S1 = workflow blocked, S2 = degraded):

**S1 / Critical**
- **#12187** — Cached‑turn normalization merges a user turn into a `role=tool` envelope, permanently poisoning conversations on strict providers. **Fix PR exists: #12188** (opened same day). [Issue](https://github.com/zeroclaw-labs/zeroclaw/issues/12187) · [PR](https://github.com/zeroclaw-labs/zeroclaw/pull/12188)
- **#12126** — Outbound attachment markers canonicalize model‑supplied paths before the workspace check; on Windows a UNC target makes the daemon authenticate to an attacker's SMB/WebDAV server (credential disclosure). [Link](https://github.com/zeroclaw-labs/zeroclaw/issues/12126)
- **#12134** — Default `forbidden_paths` miss `/mnt` (WSL) and Windows system roots. [Link](https://github.com/zeroclaw-labs/zeroclaw/issues/12134)
- **#12137** — macOS Seatbelt profile mis‑escaping (`\\.`) breaks `~/.cargo`, `~/.nvm`, `~/.pyenv`, `~/.local` under the default sandbox. [Link](https://github.com/zeroclaw-labs/zeroclaw/issues/12137)

**S2 / Degraded**
- **#10926** — Matrix `send_via` peer/room confusion (`status:accepted`, still open). [Link](https://github.com/zeroclaw-labs/zeroclaw/issues/10926)
- **#12146** — MCP SSE client follows absolute server‑supplied `endpoint` URLs with configured secret headers (SSRF/token redirect to daemon loopback admin routes). [Link](https://github.com/zeroclaw-labs/zeroclaw/issues/12146)
- **#12127** — `git_operations` canonicalizes `gitdir:`/`commondir`/alternates before authorization (Windows UNC auth risk). [Link](https://github.com/zeroclaw-labs/zeroclaw/issues/12127)
- **#9883** — Inbound WebP decoded unbounded before the shared image validator (p1, `status:accepted`). [Link](https://github.com/zeroclaw-labs/zeroclaw/issues/9883)
- **#12052** — Gateway limiters key on the first `X-Forwarded-For` entry, allowing spoofed loopback exemption. [Link](https://github.com/zeroclaw-labs/zeroclaw/issues/12052)
- **#12050** — OIDC callback token page has no browser binding (login CSRF). **PR #12157** exists. [Link](https://github.com/zeroclaw-labs/zeroclaw/issues/12050)
- **#12121** — `setup.bat` `setx` duplicates machine PATH into user PATH and truncates at 1024 chars. [Link](https://github.com/zeroclaw-labs/zeroclaw/issues/12121)
- **#12104** — OpenAI Responses drops tool‑result image attachments. [Link](https://github.com/zeroclaw-labs/zeroclaw/issues/12104)
- **#12153 / #12156** — Installer/updater musl vs glibc mis‑detection (install picks musl on glibc hosts; updater always fetches glibc). **PR #12160** addresses detection. [Link](https://github.com/zeroclaw-labs/zeroclaw/issues/12153)

**Notable pattern:** the majority of today's bug reports are **Windows‑path and sandbox‑profile correctness issues**, plus gateway auth/SSRF vectors — i.e., hardening debt surfacing as the project moves toward a release gate.

## 6. Feature Requests & Roadmap Signals

- **#10893** — Steer an in‑flight turn when a message arrives mid‑generation (wire channel dispatch to the existing, currently producer‑less steering pipeline). Tagged `status:accepted`, `priority:p2`, `risk:high`. [Link](https://github.com/zeroclaw-labs/zeroclaw/issues/10893)
- **#12183** — Runtime prompt/command intercept & injection for active agents (observer/co‑pilot pattern). [Link](https://github.com/zeroclaw-labs/zeroclaw/issues/12183)
- **#12181** — Web managed document upload, first Phase‑2 Web slice of #9488 (opaque `FileId`, off by default). [Link](https://github.com/zeroclaw-labs/zeroclaw/issues/12181)
- **#12184 (PR)** — One‑tap Matrix approval reactions (✅/❌) replacing token copy‑paste. [Link](https://github.com/zeroclaw-labs/zeroclaw/pull/12184)
- **#11584 (PR)** — Opper provider (EU‑hosted, OpenAI‑compatible gateway). [Link](https://github.com/zeroclaw-labs/zeroclaw/pull/11584)
- **#11322/#11320 (PRs)** — Plugin webhook → core RPC pipeline, likely foundational for a plugins ecosystem.

**Prediction:** For v0.9.0, expect the **security/hardening fixes** (OIDC binding, path/allowlist corrections, installer libc detection) and **#12188** to land first, since they carry release‑gate and p0/p1 labels. Interactive steering (#10893) and the plugin RPC stack are larger, `risk:high` changes more likely to slip past v0.9.0.

## 7. User Feedback Summary

- **Onboarding friction:** #12153, #12155, and #12156 form a cluster of installer/updater confusion — quickstart claims "No config written" while a config exists, and musl/glibc detection misroutes users. This is the clearest source of user‑visible dissatisfaction today.
- **Cost & performance awareness:** #11703 (prompt‑cache busting) and #11580 (binary size headroom) show operators are tracking runtime economics, not just correctness.
- **Security expectations rising:** A single reporter (IftekharUddin) filed a large batch of Windows/sandbox/SSRF issues, indicating power users are now auditing ZeroClaw's threat model as it approaches production use.
- **UI/UX paper cuts:** #12087 (tool toggle autosaves *and* leaves Save dirty), plus a set of web PRs (#12206–#12209) fixing mobile layout, in‑flight turn restoration, and destructive Stop behavior — signals active dashboard usage on phones.
- **Autonomy/permission gaps:** #12167 (a `readonly` agent can still initiate peer turns via `send_message_to_peer`) points to an inconsistent multi‑agent permission model.

## 8. Backlog Watch

Items needing maintainer attention (long‑open or blocked):

- **#8132** — Rust/WASM UI decision, open since **2026‑06‑22**, `needs-author-action`, `priority:p3`, `risk:high`. An architectural fork in the road that has stalled for ~4.5 months. [Link](https://github.com/zeroclaw-labs/zeroclaw/issues/8132)
- **#9883** — Inbound WebP unbounded decode, open since **2026‑08‑10**, `priority:p1`, `status:accepted` — a security fix accepted but not yet resolved. [Link](https://github.com/zeroclaw-labs/zeroclaw/issues/9883)
- **PR #9745** — Per‑agent attribution/scoping for the knowledge graph, open since **2026‑08‑04**, `priority:p1`, `needs-maintainer-review`, `topic:identity-access`. [Link](https://github.com/zeroclaw-labs/zeroclaw/pull/9745)
- **PR #11225** — Preserve owner in delegation (`priority:p0`, `release:v0.9.0`) — a p0 correctness fix still unmerged. [Link](https://github.com/zeroclaw-labs/zeroclaw/pull/11225)
- **#10893** — Channel→steering pipeline wiring, open since **2026‑09‑15**, `status:blocked`, `risk:high`. [Link](https://github.com/zeroclaw-labs/zeroclaw/issues/10893)
- **PR #11320/#11322** — Plugin RPC stack, open since **2026‑10‑01**, `needs-author-action`, XL, `risk:high`; long‑lived stacked branches risk bit‑rot. [Link](https://github.com/zeroclaw-labs/zeroclaw/pull/11322)

---

**Health takeaway:** ZeroClaw is in an intense hardening phase with strong community security auditing and rapid issue→PR turnaround on the most acute bugs (#12187→#12188 same‑day is a good signal). The main risks are (a) **review bandwidth** — 46 open PRs vs. 4 merged, with multiple `p0`/`release:v0.9.0` items still pending, and (b) **architectural decisions deferred too long**, notably the WASM UI question. No release shipped today, but a v0.9.0 cut appears to be the near‑term focal point, contingent on clearing the tagged release‑gate security items.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*