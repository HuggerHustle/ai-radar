# AI CLI Tools Community Digest 2026-10-20

> Generated: 2026-10-20 09:19 UTC | Tools covered: 7

- [Claude Code](https://github.com/anthropics/claude-code)
- [OpenAI Codex](https://github.com/openai/codex)
- [Gemini CLI](https://github.com/google-gemini/gemini-cli)
- [GitHub Copilot CLI](https://github.com/github/copilot-cli)
- [OpenCode](https://github.com/anomalyco/opencode)
- [Pi](https://github.com/earendil-works/pi)
- [Qwen Code](https://github.com/QwenLM/qwen-code)
- [Claude Code Skills](https://github.com/anthropics/skills)

---

## Cross-Tool Comparison

# Cross-Tool Comparison Report: AI CLI Developer Tools Ecosystem

**Report Date:** 2026-10-20
**Tools Covered:** Claude Code, OpenAI Codex, Gemini CLI, GitHub Copilot CLI, OpenCode, Pi, Qwen Code

---

## 1. Ecosystem Overview

The AI CLI tool landscape on 2026-10-20 is characterized by rapid, parallel iteration across seven major tools, each shipping nightly or alpha builds while their communities surface an increasingly convergent set of concerns: agent reliability, MCP lifecycle management, multi-agent orchestration, memory/session continuity, and enterprise-grade permission/sandbox controls. Windows desktop stability remains the single largest pain-point cluster (dominating Codex and Claude Code bug lists), while MCP OAuth and sandbox correctness regressions dominate Copilot CLI. A clear maturation pattern is visible: issues are shifting from "does the feature work" to "does it behave predictably, transparently, and safely at scale" — status-reporting correctness, silent failures, and cost/quota runaway are recurring themes. Meanwhile, CI/runner capacity is emerging as a first-class engineering concern (Qwen Code), and subagent trust (Gemini CLI, Pi) is becoming the new frontier. The ecosystem is bifurcating into vertically integrated vendor tools (Claude Code, Codex, Copilot, Gemini, Qwen) and independent/open-source alternatives (OpenCode, Pi) that compete on desktop parity, MCP flexibility, and configuration transparency.

---

## 2. Activity Comparison

| Tool | Issues (active, 24h) | PRs (active, 24h) | Discussions | Release Status (today) |
|---|---|---|---|---|
| **Claude Code** | ~10 hot issues + 1 closed (multi-connector #27302 top: 275 comments) | 2 open PRs | N/A (no discussion data) | **v2.1.304** shipped — plugin/mod security primitives |
| **OpenAI Codex** | 10 hot issues (top: #8197 CLOSED, 76 comments) | 10 PRs, all CLOSED (infra/auth/MCP reliability) | Yes — 2 Ideas + 5 Show-and-tell | **3 alpha releases** (rust-v0.164.0-alpha.4/5/6) — no changelogs |
| **Gemini CLI** | 10 hot issues (subagent reliability dominant) | 10 PRs (mix open/merged) | N/A | **v0.66.0-nightly.20261020** — 2 fixes |
| **GitHub Copilot CLI** | 26 issues updated (MCP OAuth cluster dominant) | 0 PRs | N/A | **v1.0.101-0** + v1.0.100 — structured output, telemetry opt-out |
| **OpenCode** | ~14 issues (V2 regressions dominant) | 10+ PRs (heavy UX + MCP lifecycle) | N/A | **No releases** (24h) |
| **Pi** | 10 hot issues (2× prio:p0 regressions) | 10 PRs (mostly CLOSED) | Yes — 1 Show-and-tell (Weasley Subagents) | **No releases** (24h) |
| **Qwen Code** | 10 issues (CI queue depth dominant) | 10 PRs (CI + daemon + memory + PTY) | N/A | **v0.25.3-nightly.20261019** — daemon session refresh |

**Notes:**
- **Claude Code** and **Pi** had only ~2 and ~10 PRs reported respectively; treat as snapshot-limited, not as a proxy for inactivity.
- **GitHub Copilot CLI** reported no PR data — marked N/A rather than inactive.
- **Discussions** channel is only actively reported for **Codex** and **Pi**; for other tools this is a data-availability gap, not a signal of disuse.
- **Codex** issue activity is unusually high-signal because the top issue (#8197) finally closed after ~10 months.

---

## 3. Shared Feature Directions

Several requirements converge across **three or more** tool communities, indicating ecosystem-level demand rather than repo-specific noise:

### 3.1 MCP Lifecycle & Auth Maturity
- **Copilot CLI** (#4695, #4203, #4994, #5192): OAuth token reuse, silent refresh, ACP persistence.
- **OpenCode** (#57341, #57364, #56452, #57023): orphaned MCP processes, in-session resource lookup failures, disable/persist toggles.
- **Codex** (#42454): env-override stability for MCP/exec-server.
- **Pi** (#11048): host-owned MCP tool filter hook.
- **Claude Code** (#103676): missing `$.http` primitive for mod network access.

**Shared need:** MCP has graduated from "connect a tool" to "manage a fleet" — lifecycle, auth, filtering, and observability are now table-stakes.

### 3.2 Multi-Agent / Subagent Trust & Orchestration
- **Gemini CLI**: #22323 (false success reporting), #21409 (generalist hang), #21968 (under-use of subagents).
- **Pi**: Weasley Subagents discussion; #11143 (compaction corrupts tool_result).
- **Claude Code**: #103406 (runaway polling burned $4.88 on 32 LOC), multi-agent fan-out cost concerns.
- **Qwen Code**: FG12/FG13 fault-gate residuals for managed multi-agent.

**Shared need:** Agents must report state truthfully, terminate predictably, and bound fan-out cost.

### 3.3 Cross-Session Memory & Context Continuity
- **Codex**: RFC #12567 "Memories in Codex" (maintainer-led, 37 comments).
- **Gemini CLI**: #18836/#21000 durable file-based task tracking vs. context rot.
- **Qwen Code**: #14877 silent memory trimming, #14281 scoped external memory imports.
- **OpenCode**: #53933 cross-session context reuse.

**Shared need:** Memory is transitioning from ephemeral context to a durable, auditable, portable subsystem.

### 3.4 Configuration Fidelity & Enterprise Controls
- **Gemini CLI**: #22267 (browser agent ignores `settings.json`).
- **OpenCode**: #54145 (`enabled_providers` regression in `/connect`).
- **Copilot CLI**: #5193, #5089 (sandbox policy transparency in ACP).
- **Codex**: #55456 (Windows registry policy overrides).
- **Claude Code**: PR #99540 (org tool ceiling over user plugins).

**Shared need:** Settings declared by admins must be authoritative; silent override is a trust-eroding bug class.

### 3.5 Windows & Platform Reliability
- **Codex**: ~1/3 of top issues (EFS/WindowsApps, workspace settings, Browser Use teardown).
- **Claude Code**: desktop focus bugs, `--user-data-dir` MSIX ignore, 143 GB orphaned output file.
- **Copilot CLI**: file-lock plugin update failures (#4488, #5194).
- **OpenCode**: installer temp-path failures (#57342 → #57355/#57353).
- **Pi**: PowerShell vs. Git Bash defaults campaign (#11049, #11051, #9501, #9504).

**Shared need:** Windows remains the weakest link across the entire ecosystem.

### 3.6 Cost, Quota & Cache Transparency
- **Claude Code**: #101685 (silent 5-min vs 1h cache fallback), #103406 (runaway loop).
- **Copilot CLI**: #5149 (Opus 5.5 reasoning budget produces billable empty turns).
- **Pi**: #10940 (prompt cache invalidated by tool removal; cacheRead 153472 → 0).
- **Codex**: #55444 (fresh capacity errors despite available quota).
- **OpenCode**: #57146 (restoring free-tier usage-limit dialog).

**Shared need:** Users cannot audit what they are being billed for; silent cache/route/budget behavior is unacceptable at scale.

---

## 4. Differentiation Analysis

| Dimension | Claude Code | Codex | Gemini CLI | Copilot CLI | OpenCode | Pi | Qwen Code |
|---|---|---|---|---|---|---|---|
| **Primary focus** | Plugin/mod permissions & desktop client | Rust runtime + Windows desktop | Subagent reliability + AST tooling | MCP auth + sandbox policy | V2 desktop parity + TUI | Extension API + compaction durability | CI/hosted infra + daemon |
| **Target user** | Individual pro/team + enterprise plugins | Individual + Pro IDE users | Google Cloud / Linux power users | Enterprise GitHub + ACP editors (Zed) | Multi-provider power users | Extension authors | Internal/enterprise hosted deployments |
| **Technical approach** | Transcript-native, first-class plugin/mod model, `decider: "person"` human-only approval | Rust, daemon `cua_repl`, registry-based enterprise policy | AST-aware reads, durable file-based todos, subagent orchestration | ACP-mode parity, sandbox via bwrap, CIMD OAuth | V1→V2 migration with regressions; kitlangton-led UX polish | Durable primitives, extension events, OpenAI Responses support | Managed Agent fault gates, PTY backend for Bun |
| **Release cadence** | Point releases with primitives | 3 alphas in one day (very rapid) | Nightly | Point releases (v1.0.100/101-0) | No release today; PR-heavy | No release today; PR-heavy | Nightly |
| **Distinctive strength** | Permission model depth | Infra/auth rigor (10 closed PRs) | Safety/sandbox architecture interest | Enterprise policy (HKLM-equivalent for OAuth) | Multi-provider breadth | Extension ecosystem depth | CI/infra self-discipline |

**Key differentiators:**

- **Claude Code** is the only tool shipping an explicit **human-only approval primitive** (`decider: "person"`) — betting that regulated environments need provable human gates.
- **Codex** is investing heavily in **auth/runtime infrastructure** (RuntimeAuthManager, ephemeral runtime registration, OAuth provenance) — implying multi-tenant or service-account usage is a target.
- **Gemini CLI** uniquely pursues **AST-aware tooling** — a long-horizon bet on token efficiency over brute-force reads.
- **Copilot CLI** is the only tool where **MCP OAuth failures** dominate — and the only one shipping a **Windows registry policy path** for enterprise config.
- **OpenCode** positions as the **multi-provider/V2-parity** option, but is visibly paying for a V1→V2 migration with regression debt.
- **Pi** is the most **extension-author-oriented** (durable primitives, `before_agent_start`, content-tool-call assist) with a small but technically deep community.
- **Qwen Code** is unusually **infra-focused** — the top issue is literally CI queue capacity, not a user-facing bug.

---

## 5. Community Momentum & Maturity

### Momentum Ranking (by engagement intensity, 24h window)

| Rank | Tool | Signal |
|---|---|---|
| 🥇 | **Codex** | 3 alphas in a day, 10 closed PRs, highest-comment issue (76) reconciled after 10 months, active Discussions |
| 🥈 | **Claude Code** | 275-comment flagship issue (#27302), 2× 419 👍 issues, high narrative pull |
| 🥉 | **Copilot CLI** | 26 issues, 4-issue MCP OAuth cluster, #1305 closed with 39 👍 |
| 4 | **Gemini CLI** | 10 hot issues + 10 PRs; subagent reliability is a coherent theme |
| 5 | **Pi** | 2× prio:p0 bugs, 10 PRs, first multi-agent discussion — small but disciplined |
| 6 | **OpenCode** | High PR volume (10+) but mostly polish/regression repair — reactive posture |
| 7 | **Qwen Code** | Infra-focused; user-facing momentum lower but operations improving |

### Maturity Assessment

- **Most mature ecosystems:** Codex and Claude Code — both have year-plus-old issues reaching resolution (Codex #8197) and structured RFC processes (Codex #12567 memories RFC).
- **Fastest iterating:** Codex (3 alphas/day) and Claude Code (point releases with novel primitives). Qwen Code iterates nightly but with narrower scope.
- **Elevated rework debt:** OpenCode shows clear V1→V2 regression repair (#55100 re-porting a lost fix, #54145 config regression, #54910 compaction regression). This is a maturity risk signal.
- **Highest per-issue signal:** Pi — small issue counts but frequent prio:p0 bugs and precise root-cause reports (e.g., #11157 extension `sendMessage` corrupting the initial system prompt).
- **Enterprise readiness trajectory:** Copilot CLI and Codex are visibly ahead — registry policy, org ceilings, auth provenance. Claude Code's PR #99540 (org tool ceiling over user plugins) is a direct competitive response.

---

## 6. Trend Signals

Six industry-level signals emerge from cross-tool community feedback, with actionable reference value for developers and technical decision-makers:

### 6.1 "Trustworthy Silence" Is the New Reliability Bar
Multiple tools ship features that fail silently (Gemini #22323 false `success` status; Gemini ripgrep timeouts returning partial results as complete; Claude Code #101685 silent cache TTL fallback; Qwen Code #14877 silent memory trimming). **Signal:** agent correctness now depends on **negative-space observability** — proving what did *not* happen. Builders should ship structured "what was skipped / capped / retried" telemetry by default.

### 6.2 MCP Is the Consolidating Integration Surface — and Its Weak Points Are Now Systemic
Five of seven tools reported MCP-specific failures in this window. The dominant failure modes are **OAuth token lifecycle**, **orphaned processes**, and **empty resource lookups**. **Signal:** MCP implementations will be judged on auth durability and process hygiene, not just protocol conformance. Teams depending on MCP should monitor for silent session-scoped auth loss.

### 6.3 Cost Runaway in Agent Fan-Out Is Real and Under-Instrumented
Concrete evidence: Claude Code #103406 ($4.88 / 195 requests / 32 LOC / 19 minutes), Copilot #5149 (empty turns still billed). **Signal:** Agent orchestration frameworks need **first-class budget primitives** (hard caps, fan-out limits, per-task cost accounting) rather than relying on users to notice. This is likely to become a procurement question.

### 6.4 Windows Remains the Ecosystem's Structural Weakness
Across Codex, Claude Code, Copilot CLI, OpenCode, and Pi, Windows-specific bugs form the largest single concentration of user frustration — EFS/WindowsApps packaging, MSIX user-data-dir ignores, file locks, temp-path handling, shell resolution. **Signal:** Cross-platform parity is a competitive moat waiting to be claimed; tools that solve Windows first will win enterprise desks.

### 6.5 Subagents Are Entering the "Do Not Trust By Default" Phase
Gemini CLI #22323, Pi #11143, and Claude Code #103406 all describe subagent behavior that either lies about success, corrupts transcript state, or burns resources. **Signal:** The next iteration of agent frameworks must ship **verifiable subagent contracts** (explicit termination reasons, bounded turn budgets, evidence-required completion) rather than trusting LLM self-reports.

### 6.6 Custom-Provider and ACP/IDE-Integration Parity Is a Growing Second-Order Market
Codex #36586 (DeepSeek loses subagent payloads), Copilot ACP OAuth cluster, Gemini CLI #24246 (>128 tools 400 error), Pi RPC/ACP parity asks (#11067, #11162), OpenCode enterprise provider filtering (#54145). **Signal:** The "bring your own model / bring your own editor" segment is expanding fast and is underserved. Tools that stabilize custom-provider contracts and ACP surface area will capture power-user and enterprise adoption.

---

### Bottom Line for Decision-Makers

- **For enterprise deployment:** Copilot CLI and Codex lead on policy/auth infrastructure; Claude Code is closing fast with org-ceiling and human-only approval primitives. Watch for MCP OAuth and Windows file-lock maturity signals before wide rollout.
- **For multi-provider flexibility:** OpenCode and Pi offer the most configurable surfaces, but OpenCode is carrying V2 migration debt that should be validated before commitment.
- **For subagent-heavy workloads:** Prefer tools that expose bounded fan-out (Gemini CLI, Claude Code) and treat status reports as untrusted — instrument cost and termination metrics externally.
- **For Linux-first teams:** Gemini CLI and Pi show the most active Linux-specific hardening; Wayland and Podman issues are being actively addressed.
- **For CI/batch use:** Qwen Code's self-inflicted CI queue depth is a cautionary tale; evaluate runner capacity before standardizing on nightly-dependent tools.

*Report compiled from 2026-10-20 community digests across seven repositories. Where the underlying snapshot omitted a data channel (e.g., Discussions), this is marked "N/A" rather than interpreted as zero activity.*

---

## Per-Tool Reports

<details>
<summary><strong>Claude Code</strong> — <a href="https://github.com/anthropics/claude-code">anthropics/claude-code</a></summary>

## Claude Code Skills Highlights

> Source: [anthropics/skills](https://github.com/anthropics/skills)

# Claude Code Skills — Community Highlights Report

*Data snapshot: 2026-10-20 · Source: github.com/anthropics/skills*

---

## 1. Top Skills Ranking (most-discussed PRs)

Note: the PR feed exposes comment counts as `undefined`, so ranking below is based on attention signals (issue linkage, revision cadence, cross-references) and active discussion in related Issues.

| # | Skill / PR | What it does | Discussion highlights | Status |
|---|---|---|---|---|
| 1 | **skill-creator hardening** — [PR #1961](https://github.com/anthropics/skills/pull/1961) | Security hardening of the eval viewer (script breakout, DNS rebinding, cross-site POST, escaping) | Part of a cluster of skill-creator reliability/security PRs (#1298, #1681, #1997); ties into Issue #1394 (XSS) and #1383 (silent benchmark failures) | OPEN |
| 2 | **mcp-builder fix** — [PR #1742](https://github.com/anthropics/skills/pull/1742) | Supports `mcp>=2.0.0` `streamable_http_client` rename + custom headers via `create_mcp_http_client` | Fixes #1668; complements Issue #1390 (evaluation.py scores 0/N against real MCP servers) | OPEN |
| 3 | **docx tooling fixes** — [PR #1792](https://github.com/anthropics/skills/pull/1792) & [PR #1734](https://github.com/anthropics/skills/pull/1734) | LibreOffice timeout → proper error + output verification; orphaned comment detection | Sits alongside Issue #2018 (invalid XML from `merge_runs.py`) — docx is the highest-maintenance skill area | OPEN |
| 4 | **frontend-design improvements** — [PR #210](https://github.com/anthropics/skills/pull/210) | Rewrites guidance for clarity, actionability, single-conversation coherence | Long-running (Jan→Mar 2026); reflects community interest in prompt-quality of design skills | OPEN |
| 5 | **skill-quality / skill-security analyzers** — [PR #83](https://github.com/anthropics/skills/pull/83) | Meta-skills scoring SKILL.md structure, docs, security posture | Earliest meta-skill proposal; precursor to the skill-creator hardening wave | OPEN |
| 6 | **notion-spec-to-implementation + resume auditor** — [PR #1245](https://github.com/anthropics/skills/pull/1245) | Spec → Notion tasks with acceptance criteria; quantitative resume review | Updated through Oct 2026 — sustained author engagement | OPEN |
| 7 | **md2video-audio** — [PR #1703](https://github.com/anthropics/skills/pull/1703) | Markdown → MP4 with Marp slides + synthetic voiceover, zero-cost | Representative of the "content production pipeline" skill class | OPEN |
| 8 | **document-typography** — [PR #514](https://github.com/anthropics/skills/pull/514) | Typographic QC: orphan/widow control, numbering alignment | Broad-appeal quality skill; addresses output polish gap | OPEN |

Also notable: **proofcore-contract-auditor** ([PR #1771](https://github.com/anthropics/skills/pull/1771), Web3/Solidity/Rust + TON notarization) and **scnet-hpc** ([PR #1615](https://github.com/anthropics/skills/pull/1615), Slurm/SSH cluster ops) — both domain-specific but structurally ambitious.

---

## 2. Community Demand Trends (from Issues)

1. **Trust & supply-chain security** — Issue [#492](https://github.com/anthropics/skills/issues/492) (46 comments, top issue): community skills impersonating the `anthropic/` namespace. Demand for signing, provenance, and namespace separation.
2. **Org-wide skill distribution** — Issue [#228](https://github.com/anthropics/skills/issues/228) (16 comments, 👍8): shared skill libraries / share links instead of manual `.skill` file uploads.
3. **Reliable skill evaluation & triggering** — Issues [#556](https://github.com/anthropics/skills/issues/556) (0% trigger rate), [#1383](https://github.com/anthropics/skills/issues/1383), [#1390](https://github.com/anthropics/skills/issues/1390): the eval harness itself is the most-reported broken component. Demand for trustworthy trigger/benchmark testing.
4. **Context-window economics** — Issue [#1487](https://github.com/anthropics/skills/issues/1487): `claude-api` eagerly injects ~156k tokens. Demand for lazy-loading / progressive disclosure of skill content.
5. **Agent state & memory** — Issue [#1329](https://github.com/anthropics/skills/issues/1329): compact symbolic notation for long-running agent memory.
6. **Quality/security meta-skills & governance** — Issues [#202](https://github.com/anthropics/skills/issues/202) (skill-creator best practices), [#412](https://github.com/anthropics/skills/issues/412) (agent governance), [#1385](https://github.com/anthropics/skills/issues/1385) (reasoning quality gates): demand for skills that police other skills.
7. **Plugin hygiene** — Issue [#189](https://github.com/anthropics/skills/issues/189) (👍9): `document-skills` and `example-skills` ship identical content → duplicate context bloat.

**Net signal:** demand is shifting from "more skills" toward **trust, evaluation, and context efficiency** of the skills system itself.

---

## 3. High-Potential Pending Skills (active, unmerged)

| PR | Skill | Why it may land soon |
|---|---|---|
| [#2040](https://github.com/anthropics/skills/pull/2040) | **architecture-advisor** — pattern selection with written justification | Newest (2026-10-16); part of a 4-skill SDD suite (companion PR #2039); coherent, scoped design |
| [#1997](https://github.com/anthropics/skills/pull/1997) | skill-creator YAML frontmatter parser fix | Updated 2026-10-19 (most recent activity); small, testable bug fix tied to eval correctness |
| [#1977](https://github.com/anthropics/skills/pull/1977) / [#1976](https://github.com/anthropics/skills/pull/1976) | algorithmic-art `wrapAround()` fix; webapp-testing textarea/select reporting | Paired bug fixes by same author, each closing an issue (#1897, #1891); low-risk |
| [#1742](https://github.com/anthropics/skills/pull/1742) | mcp-builder streamable_http_client support | Active through 2026-10-08; unblocks MCP v2 compatibility |
| [#1245](https://github.com/anthropics/skills/pull/1245) | notion-spec-to-implementation + resume auditor | Updated 2026-10-15; longest sustained author iteration |
| [#1961](https://github.com/anthropics/skills/pull/1961) | skill-creator eval viewer hardening | Security fixes are high-priority given Issue #492 climate |

---

## 4. Skills Ecosystem Insight

> **The community's most concentrated demand is no longer for new domain skills, but for a trustworthy, correctly-evaluated, and context-efficient skills infrastructure — security/provenance, reliable trigger evaluation, and non-bloated skill loading dominate the conversation.**

---

# Claude Code Community Digest — 2026-10-20

## 1. Today's Highlights

Release `v2.1.304` introduces two plugin/mod security primitives: a transcript notice when a first-run plugin skips a mod's hook, and a `decider: "person"` option in `tool.check` that forces human-only approval. Meanwhile, the two highest-engagement issues remain unresolved and increasingly vocal: multi-connector account support (#27302, 275 comments, 419 👍) and long-standing `AGENTS.md` / `.agents/skills/` support (#31005, 34 comments, 419 👍), the latter now openly noting "zero official response" since August 2025. A fresh batch of Windows/macOS desktop and Windows background-process bugs suggest the desktop client and bash-tool lifecycle remain the most fragile surfaces.

---

## 2. Releases

### v2.1.304
- Added a transcript line when a plugin that **runs first skips one of a mod's hooks**, naming the event and the plugin involved — improves plugin/mod debuggability.
- Added `decider: "person"` to a mod's `tool.check` answer: only the permission dialog or a host callback can approve the ask; automated paths are refused with the mod's message.

**Takeaway:** Continued incremental hardening of the plugin/mod permission model, extending the "who can approve what" story beyond simple allow/deny.

---

## 3. Hot Issues

1. **[#27302] Support multiple Connector accounts (same connector, different accounts)** — OPEN · 275 comments · 419 👍
   The single most-commented issue in this snapshot. Multi-account connector support blocks real workflows (personal vs. work accounts). Highest 👍 count signals broad demand.
   https://github.com/anthropics/claude-code/issues/27302

2. **[#31005] Support for AGENTS.md and .agents/skills/** — OPEN · 34 comments · 419 👍
   Community has requested this since August 2025, with the author explicitly calling out "zero official response." Tied at the top sympathy count — represents a standardization friction point for cross-tool agent configs.
   https://github.com/anthropics/claude-code/issues/31005

3. **[#99395] Desktop: first click on a plugin pane button only moves focus; needs a second click** — OPEN · 12 comments · 6 👍
   Classic focus-handling bug in the desktop plugin panes; reproducible and platform-specific (Windows). Low friction but high annoyance for desktop plugin users.
   https://github.com/anthropics/claude-code/issues/99395

4. **[#75599] Granular control over mouse-click behavior in interactive menus** — OPEN · 12 comments · 26 👍
   Since v2.1.181, clicking in select menus immediately confirms — no opt-out. A regression in ergonomics for users who prefer keyboard/confirm flows.
   https://github.com/anthropics/claude-code/issues/75599

5. **[#101685] Interactive sessions write the 5-minute prompt cache despite requesting 1h (2.1.296–2.1.300)** — OPEN · 11 comments · 10 👍
   A cost/performance-relevant bug: interactive sessions silently fall back to 5-minute cache TTL while headless `claude -p` correctly uses 1h. Affects Team/Max; likely a significant token-cost driver.
   https://github.com/anthropics/claude-code/issues/101685

6. **[#74902] claude-in-chrome MCP can't distinguish two Chrome profiles** — OPEN · 10 comments · 9 👍
   `list_connected_browsers` returns unstable generic names ("Browser 1/2"), causing disambiguation loops and wrong-profile actions. Security-adjacent for anyone running multi-profile Chrome with automation.
   https://github.com/anthropics/claude-code/issues/74902

7. **[#82017] Compaction-continued sessions lose skill inventory (`skill_listing`)** — OPEN · 7 comments · 3 👍
   After auto-compaction, the model goes routing-blind to previously registered skills because only deltas are re-injected. Directly degrades the skills feature's reliability in long sessions.
   https://github.com/anthropics/claude-code/issues/82017

8. **[#103179] Headless multi-host login is manual/repetitive; over-refusal on owner actions** — OPEN · 7 comments
   Max subscriber running a Windows + 4× Linux fleet reports considering migration to other tools. Signals that headless orchestration and auth ergonomics are a retention risk at the power-user tier.
   https://github.com/anthropics/claude-code/issues/103179

9. **[#103693] macOS Desktop: ~90 idle Code sessions exhausted 42 GB swap on a 32 GB Mac** — OPEN · 1 comment
   Idle sessions keep their entire MCP server set alive. Memory footprint of idle sessions is a serious scaling problem for heavy desktop users; follow-up to stale-closed #76268.
   https://github.com/anthropics/claude-code/issues/103693

10. **[#103676] Mods: add `$.http` so a mod can make an HTTPS request without spawning a process** — OPEN · 1 comment
    A probe mod found `fetch`, `process`, `Bun`, `Deno` all undefined and `require` throwing — the only network route is spawning a process. Missing HTTP primitive blocks modern plugin/mod capability.
    https://github.com/anthropics/claude-code/issues/103676

Also worth noting: **#103406 (CLOSED)** — a runaway Opus 5.5 polling loop burned $4.88 / 195 requests for 32 LOC and exhausted a 5-hour session quota in under 19 minutes during a parallel multi-agent workflow. Cost-runaway in agent fan-out is a legitimate concern. https://github.com/anthropics/claude-code/issues/103406

---

## 4. Key PR Progress

Only two PRs were updated in the last 24 hours; both remain open.

1. **[#99141] diff: a pane nothing can draw yet is kept, and shows once something can** — OPEN · by poteat
   Fixes `/diff` behavior when no pane renderer is attached yet: the pane is retained and appears as soon as a renderer becomes available. Stacked on #99118.
   https://github.com/anthropics/claude-code/pull/99141

2. **[#99540] sec-default: an organization's ceiling on a tool holds over the plugins a person installs** — OPEN · by poteat
   Extends org-level tool approval requirements ("ceiling") so they apply over user-installed plugins and connector tools, with a `.catch` on every deciding hook. Directly relevant to enterprise security posture.
   https://github.com/anthropics/claude-code/pull/99540

> Note: only 2 PRs were reported in this snapshot. The digest does not fabricate additional PR entries; the remaining candidate items below are drawn from Issues tagged as enhancements/features, which function as the community's de-facto "proposed changes" feed. Treat them as issue-level proposals, not merged PRs.

---

## 5. Hot Discussions

*No discussion data (GitHub Discussions / Q&A / Show-and-tell) was provided in this snapshot, so this section is omitted per instructions.*

---

## 6. Feature Request Trends

Distilled from all Issues in this snapshot:

1. **Multi-account / multi-identity support** — #27302 (connectors) is the dominant ask; the same "I need two of the same thing" pattern recurs in browser profiles (#74902) and headless multi-host auth (#103179).
2. **Cross-tool agent config standardization** — `AGENTS.md` and `.agents/skills/` support (#31005) with 419 👍 and explicit "no official response" frustration.
3. **Granular UX controls** — mouse behavior in interactive menus (#75599), desktop sidebar theming (#102699), enlarged session status indicators (#102824).
4. **Plugin/mod capability expansion** — `$.http` for network access (#103676), `ui.copy` event for copy-on-select rewriting (#99758).
5. **Ongoing permissions/attribution preferences** — opt-in commit/PR attribution (#103691), "ask for approval" instead of Auto-mode auto-deny in remote sessions (#103687).

---

## 7. Developer Pain Points

- **Desktop client fragility dominates the bug list**: plugin pane focus (#99395), missing stats view (#102098), scheduled-task chips regression (#102449), `--user-data-dir` ignored on Windows/MSIX (#103068), and Cowork bridge disconnects (#91111).
- **Windows background tasks leak resources**: `pyenv-win python.exe` orphaned after kill, output file grew to 143 GB (#101456).
- **Local shell safety checks cause false positives**: `bash -c $'...'` scripts with no `rm` trigger bypass-mode prompts (#99320, CLOSED).
- **Long-session reliability**: compaction drops skill inventory (#82017); cache TTL mismatch silently increases interactive costs (#101685).
- **Cost/quota runaway in multi-agent parallel workflows**: #103406 ($4.88 / 195 requests / 32 LOC) exemplifies uncontrolled fan-out burn.
- **Desktop memory scaling**: ~90 idle sessions → 42 GB swap on 32 GB Mac (#103693).
- **Clipboard/host interop**: TUI copy fails to paste into older RDP clients (#103701).

---

*Generated from `github.com/anthropics/claude-code` data dated 2026-10-20. All links verified against provided URLs.*

</details>

<details>
<summary><strong>OpenAI Codex</strong> — <a href="https://github.com/openai/codex">openai/codex</a></summary>

# OpenAI Codex Community Digest — 2026-10-20

## 1. Today's Highlights

The Codex project continues its rapid alpha cadence, shipping three `rust-v0.164.0-alpha` releases in a single day. Issue activity is dominated by a wave of Windows desktop regressions affecting workspace settings, project visibility, and Browser Use stability, several of which remain open after weeks. Meanwhile, a large batch of closed PRs from the `copyberry[bot]` automation stream signals active infra work around authentication, runtime registration, and MCP/exec-server reliability.

## 2. Releases

Three alpha releases were published in the last 24 hours:

- [rust-v0.164.0-alpha.6](https://github.com/openai/codex/releases)
- [rust-v0.164.0-alpha.5](https://github.com/openai/codex/releases)
- [rust-v0.164.0-alpha.4](https://github.com/openai/codex/releases)

Release notes are limited to version identifiers only (no changelog detail provided), consistent with the project's fast-moving alpha track. Users on `0.163.0-alpha.x` builds should expect the incremental rollout to `0.164.0` track.

## 3. Hot Issues

1. **[#8197 [CLOSED] Panel becomes grey after running for a long time (VS Code extension)](https://github.com/openai/codex/issues/8197)** — 76 comments, 27 👍. The single most-discussed issue in the dataset, spanning nearly a year from creation (2025-12) to closure (2026-10-20). High engagement reflects how disruptive a hung panel UI is to daily IDE workflows.

2. **[#25220 [OPEN] Windows: Bundled plugins (Computer Use, Browser, Chrome, LaTeX) unavailable — copyfile fails on EFS-encrypted WindowsApps](https://github.com/openai/codex/issues/25220)** — 49 comments, 6 👍. A persistent Windows-specific blocker that makes the entire plugin marketplace unusable for affected users. The EFS/WindowsApps angle suggests a Store-packaging interaction bug.

3. **[#51917 [OPEN] Windows: "Couldn't load workspace settings" still blocks new chats after update](https://github.com/openai/codex/issues/51917)** — 25 comments, 8 👍. Directly blocks chat creation for Windows users and remained unfixed across multiple reported builds — a high-severity regression.

4. **[#48449 [OPEN] Windows: Repeated app crashes during Browser Use tab teardown / PiP cleanup](https://github.com/openai/codex/issues/48449)** — 15 comments. Crash-loop during browser teardown, compounded by spurious password-save prompts. Affects Pro-tier users doing agentic browsing.

5. **[#43738 [OPEN] Codex at capacity: widespread "Selected model is at capacity" errors since Sep 8](https://github.com/openai/codex/issues/43738)** — 14 comments, 3 👍. A meta-issue aggregating capacity complaints post-GPT-6 Astra launch. Root-cause uncertainty (model routing vs. infra) makes it hard for users to self-remediate.

6. **[#36586 [OPEN] Subagent task payload invisible to custom non-OpenAI providers (DeepSeek)](https://github.com/openai/codex/issues/36586)** — 12 comments, 7 👍. Important for the custom-provider ecosystem: encrypted_content block dropped under `multi_agent_version v2`, silently breaking subagents.

7. **[#42454 [OPEN] Allow stable cua_repl env overrides instead of replacing generated config on startup](https://github.com/openai/codex/issues/42454)** — 12 comments, 4 👍. Enterprise proxy users cannot inject env config after the node_repl → cua_repl migration. A configurability/regression concern.

8. **[#47366 [OPEN] macOS: Owned shared projects and chats missing from Projects, Pinned, and search](https://github.com/openai/codex/issues/47366)** — 9 comments. Data-visibility issue with a confirmed working fallback (ChatGPT Classic), which increases urgency to port the fix.

9. **[#15214 [OPEN] Allow user to create rules with improved Starlark support](https://github.com/openai/codex/issues/15214)** — 5 comments, 8 👍. High ratio of upvotes to comments indicates broad silent agreement that `prefix_rule` is too limited for sandbox rule authoring.

10. **[#55444 [OPEN] Codex CLI: All models report "Selected model is at capacity" on one Plus account despite available quota](https://github.com/openai/codex/issues/55444)** — 4 comments, filed the same day. A fresh 2026-10-20 report suggesting the capacity crisis continues; account-scoped failures are especially hard to debug.

## 4. Key PR Progress

1. **[#55498 [CLOSED] Add correlated diagnostics for Noise relay handshakes](https://github.com/openai/codex/pull/55498)** — Adds structured spans and UUID-normalized stream IDs for executor handshake rejections, improving observability of transport failures.

2. **[#55463 [CLOSED] Add optional MCP disablement for prediction forks and samples](https://github.com/openai/codex/pull/55463)** — Introduces `experimentalDisablePredictionMcp` for `thread/fork` and `disableMcp` for `thread/sample`, useful when incremental tools exist on Responses Lite.

3. **[#55456 [CLOSED] Support Windows registry overrides for `requirements.toml`](https://github.com/openai/codex/pull/55456)** — Reads `RequirementsPath` from `HKLM\SOFTWARE\Policies\OpenAI\Codex`, enabling enterprise policy-based config. Requires absolute paths.

4. **[#55442 [CLOSED] Check daemon feature overrides and prompt for mismatch recovery](https://github.com/openai/codex/pull/55442)** — Fixes silent fallback to embedded mode and prevents auto-startup from persisting unconfirmed overrides.

5. **[#55441 [CLOSED] Add cancellation for experimental thread samples](https://github.com/openai/codex/pull/55441)** — New `thread/sample/cancel` request with `requestId` scoping, cleaning up in-flight samples.

6. **[#55413 [CLOSED] Share runtime authentication across requests and credential refreshes](https://github.com/openai/codex/pull/55413)** — Introduces `RuntimeAuthManager` to reuse a single runtime per credential source across requests.

7. **[#55410 [CLOSED] Track credential sources separately from auth owners](https://github.com/openai/codex/pull/55410)** — Distinguishes same-account re-logins from credential refreshes, enabling correct runtime reuse decisions.

8. **[#55402 [CLOSED] Add ephemeral runtime registration and signed assertions](https://github.com/openai/codex/pull/55402)** — Adds registration client + in-memory assertion signer with idempotency keys across retries.

9. **[#55397 [CLOSED] Record OAuth provenance and login identity for account tokens](https://github.com/openai/codex/pull/55397)** — Persists issuer/client ID at login to support correct token refresh; scrubs OAuth error bodies that may echo credentials.

10. **[#55395 [CLOSED] Roll back interrupted Guardian reviews to preserve evidence](https://github.com/openai/codex/pull/55395)** — Marks cancelled/timed-out reviews for rollback so subsequent reviews retain required transcript evidence.

## 5. Hot Discussions

### Ideas
- **[#12567 — Memories in Codex](https://github.com/openai/codex/discussions/12567)** (37 comments, 14 👍) — Maintainer-led RFC on memory citation and per-thread vs. global memory preferences. High engagement makes this the most mainstream direction on the roadmap.
- **[#14595 — Remote control when?](https://github.com/openai/codex/discussions/14595)** (9 comments, 18 👍) — Strong upvote-to-comment ratio; users explicitly compare Codex's remote-control story unfavorably to Claude Code's.

### Show and tell
- **[#55421 — TAHU: harmless agent email without leaking staff notes; seeking 3 developer trials](https://github.com/openai/codex/discussions/55421)** — Authorization-gateway prototype for reducing approval friction.
- **[#55203 — Two agent skills from our failure log](https://github.com/openai/codex/discussions/55203)** — Practical skill patterns: require evidence for "done," and abort after two identical failures.
- **[#55099 — Goal Instruction Writer: keeping multi-day Codex tasks on target](https://github.com/openai/codex/discussions/55099)** — MIT-licensed skill for bounded-loop, observable-outcome task framing.
- **[#53955 — Unmix: remove a recorded development decision, then adapt retained changes via Codex MCP](https://github.com/openai/codex/discussions/53955)** — MCP server + Git task ledger for decision reversal.
- **[#55333 — Codex Reset Calendar](https://github.com/openai/codex/discussions/55333)** — Distinguishes public reset events from personal usage windows.

## 6. Feature Request Trends

- **Memory / cross-thread continuity** — The #12567 RFC signals official appetite for persistent memory; discussion focuses on citation transparency and scope control.
- **Remote control / headless operation** — #14595 reflects demand for remote operation of Codex instances (including WSL), heavily compared against competitor tooling.
- **Richer sandbox/rule authoring** — #15214 pushes for full Starlark support beyond `prefix_rule`; strong upvote ratio.
- **Separable typography settings** — #25281 requests splitting UI, code, terminal, and chat font controls in the macOS app.
- **Diff export/save** — #8710 (now closed) tracks demand for exporting VS Code Codex diffs to files.
- **Enterprise configurability** — Multiple issues and PRs (#42454, #55456) point to demand for stable env overrides and policy-driven config, especially for proxies and MCP.

## 7. Developer Pain Points

- **Windows desktop reliability is the dominant theme.** Roughly a third of the top-commented issues touch Windows-specific crashes, blank windows, missing workspace settings, project cache loss, and EFS/MSIX packaging failures (#25220, #51917, #48449, #47366, #41073, #41093, #52012, #54538, #55014). This is the single largest concentration of user frustration.
- **Capacity / rate-limit errors persist post-DevDay.** #43738, #54227, and the fresh #55444 on 2026-10-20 show "Selected model is at capacity" is still widespread — including on accounts with remaining quota.
- **Cloudflare challenges block desktop auth.** #51691 and #55489 both report `/settings/user` and `/accounts/check` returning `403 cloudflare_challenge` and `432 Workspace routing unavailable`, blocking message composition even when web works.
- **Workspace-settings loading is a recurring blocker** across multiple independent reports (#51917, #54168, #55489), suggesting the underlying recovery path is fragile.
- **Custom-provider integration gaps** — #36586 shows third-party providers like DeepSeek lose subagent task payloads, hampering the "bring your own model" workflow.
- **Sandbox/config friction on Windows** — #54610 (spurious "blocked by policy" despite Full Access) and #51278 (missing "Approve for me" in VS Code/WSL) show policy enforcement is not matching user expectations.

---
*Generated for 2026-10-20 from github.com/openai/codex activity.*

</details>

<details>
<summary><strong>Gemini CLI</strong> — <a href="https://github.com/google-gemini/gemini-cli">google-gemini/gemini-cli</a></summary>

# Gemini CLI Community Digest — 2026-10-20

## 1. Today's Highlights

A new nightly (`v0.66.0-nightly.20261020.g76e4d7c04`) landed with two targeted fixes: preserving terminal scrollback during viewport refreshes and more robust decoding of streamed Node HTTP activity chunks. Meanwhile, the issue tracker is dominated by subagent reliability concerns — recovery semantics, hangs, Wayland/browser failures, and configuration overrides being ignored — suggesting agent orchestration remains the top area of friction. PR activity shows a healthy stream of correctness fixes around search timeouts, path resolution, and sandbox/Podman behavior.

## 2. Releases

**v0.66.0-nightly.20261020.g76e4d7c04**

- **[PR #29792](https://github.com/google-gemini/gemini-cli/pull/29792)** — `fix(ui)`: Preserve terminal scrollback during viewport refreshes. Prevents loss of scroll history when the UI re-renders.
- **[PR #29793](https://github.com/google-gemini/gemini-cli/pull/29793)** *(linked from release notes as #29792 cluster)* — `fix(cli)`: Decode streamed Node HTTP activity chunks with `StringDecoder` to avoid mangled output on multi-byte boundaries.

This is a nightly build; expect behavior to continue evolving toward the next stable release.

## 3. Hot Issues

1. **[#22323](https://github.com/google-gemini/gemini-cli/issues/22323) — Subagent reports GOAL success after MAX_TURNS (p1, 13 comments)**  
   The `codebase_investigator` subagent claims `status: "success"` / `Termination Reason: "GOAL"` even after hitting the max turn limit mid-analysis. This is a correctness bug in agent reporting semantics — consumers can't trust success signals. High comment count indicates active triage and disagreement about the right fix.

2. **[#21409](https://github.com/google-gemini/gemini-cli/issues/21409) — Generalist agent hangs forever (p1, 8 comments, 👍: 8)**  
   Simple operations (e.g., folder creation) hang indefinitely when the CLI defers to the generalist agent. Users report waiting up to an hour. The strong 👍 reaction suggests broad impact; the workaround (forbidding delegation) is not a real fix.

3. **[#21983](https://github.com/google-gemini/gemini-cli/issues/21983) — Browser subagent fails on Wayland (p1, 4 comments)**  
   The browser subagent terminates with `GOAL` but does nothing on Wayland sessions, a common Linux desktop setup. This blocks browser automation for a meaningful slice of Linux users.

4. **[#19873](https://github.com/google-gemini/gemini-cli/issues/19873) — Zero-dependency OS sandboxing + post-execution intent routing (p2, 9 comments)**  
   Proposes leveraging Gemini 3's bash affinity safely via sandboxing and intent-based routing, rather than restricting shell use. High comment count signals architectural interest; could shape how agent tooling evolves.

5. **[#21968](https://github.com/google-gemini/gemini-cli/issues/21968) — Gemini under-uses skills and sub-agents (p2, 7 comments)**  
   Anecdotal but persistent: the model rarely invokes available skills/subagents unless explicitly told. This undermines the value of the subagent system and the user's setup effort.

6. **[#22745](https://github.com/google-gemini/gemini-cli/issues/22745) — AST-aware file reads, search, and codebase mapping (p2, 7 comments)**  
   An EPIC exploring whether AST-aware tools can reduce misaligned reads and token noise. This is a forward-looking bet on agent efficiency; paired with [#22746](https://github.com/google-gemini/gemini-cli/issues/22746) and [#22747](https://github.com/google-gemini/gemini-cli/issues/22747).

7. **[#24246](https://github.com/google-gemini/gemini-cli/issues/24246) — 400 error with > 128 tools (p2, 3 comments)**  
   Tool-count limits cause hard failures instead of graceful scoping. Important as extension/agent ecosystems grow; the fix likely needs smarter tool filtering.

8. **[#22267](https://github.com/google-gemini/gemini-cli/issues/22267) — Browser Agent ignores `settings.json` overrides (p2, 4 comments)**  
   `maxTurns` and similar overrides are read by `AgentRegistry` but not honored by the browser agent. Configuration should be authoritative — this erodes trust in settings.

9. **[#22672](https://github.com/google-gemini/gemini-cli/issues/22672) — Agent should avoid destructive behavior (p2, 3 comments)**  
   The model occasionally uses `git reset` / `--force` when safer alternatives exist. Safety-adjacent; likely to attract more attention as agents operate on real repos and databases.

10. **[#22465](https://github.com/google-gemini/gemini-cli/issues/22465) — CLI stuck at interactive prompt creating Vite app (p2, 2 comments)**  
    Interactive prompt handling remains a recurring failure mode for scaffolding tools. Suggests need for behavioral evals around TTY-interactive commands.

## 4. Key PR Progress

1. **[#29838](https://github.com/google-gemini/gemini-cli/pull/29838) — Resolve relative paths against active IDE workspace root (p1, maintainer-only)**  
   Fixes `WriteFileTool`, `EditTool`, `ReadFileTool`, and `correctPath` to use `ideContextStore`'s workspace root instead of the initial `config.getTargetDir()`. Important for multi-root/nested-repo IDE workflows.

2. **[#29831](https://github.com/google-gemini/gemini-cli/pull/29831) — Surface ripgrep search timeouts as errors**  
   Currently, timeouts resolve with partial results silently, so 1–3 matches look like "No matches" and larger result sets look complete. Fixing this is critical for correct agent reasoning.

3. **[#29703](https://github.com/google-gemini/gemini-cli/pull/29703) — Keep atomic-write temp filename within `NAME_MAX`**  
   Writing files with 215–255 byte names fails with `ENAMETOOLONG` because a 41-byte `.uuid.tmp` suffix overflows the limit. A precise fix to a real edge case.

4. **[#29718](https://github.com/google-gemini/gemini-cli/pull/29718) — Use `--userns=keep-id` for rootless Podman sandboxes (p2)**  
   Fixes `EACCES` for rootless Podman users by mapping caller UID inside the container. Nice sandbox portability improvement for Linux users.

5. **[#29726](https://github.com/google-gemini/gemini-cli/pull/29726) — Ignore trap wrapper when resolving command name in sandbox**  
   POSIX command rules in `sandbox.toml` were never applied because wrapped commands were mistaken for `trap`. This unlocks per-command sandbox policy on Linux/macOS.

6. **[#29727](https://github.com/google-gemini/gemini-cli/pull/29727) — Report omitted `list_directory` entries**  
   Rejected paths were silently dropped, making directories appear empty. Now surfaced to the model and user.

7. **[#29822](https://github.com/google-gemini/gemini-cli/pull/29822) — Cap `total_max_matches` and clarify context overflow message (p2)**  
   Addresses context overflow from broad grep queries (#17448) with clearer messaging and an enforced cap.

8. **[#29841](https://github.com/google-gemini/gemini-cli/pull/29841) — GitHub repository shorthand for extension install**  
   Supports `owner/repo`, `github.com/owner/repo`, and `github:owner/repo` forms for `gemini extensions install`. Quality-of-life improvement.

9. **[#29824](https://github.com/google-gemini/gemini-cli/pull/29824) — Configurable numerical model routing (p2)**  
   Adds `routing.numericalRules` with complexity score bands, letting users steer requests by cost/quota/capability rather than a Flash/Pro threshold alone.

10. **[#29810](https://github.com/google-gemini/gemini-cli/pull/29810) — Preserve `generateContentConfig` when alias resolves to own tier**  
    Fixes a subtle aliasing bug where a custom alias pointing at a tier silently loses its `temperature`/`maxOutputTokens`/`thinkingLevel` on first request.

## 5. Hot Discussions

No discussion data was provided for this period, so this section is omitted.

## 6. Feature Request Trends

- **Smarter subagent orchestration and visibility**: auto-invocation of skills/subagents ([#21968](https://github.com/google-gemini/gemini-cli/issues/21968)), visible subagent trajectories via `/chat share` ([#22598](https://github.com/google-gemini/gemini-cli/issues/22598)), and shared/parallel subagent memory ([#18287](https://github.com/google-gemini/gemini-cli/issues/18287)).
- **AST-aware code intelligence**: an EPIC plus follow-ups exploring AST grep and mapping tools for surgical reads and search ([#22745](https://github.com/google-gemini/gemini-cli/issues/22745), [#22746](https://github.com/google-gemini/gemini-cli/issues/22746), [#22747](https://github.com/google-gemini/gemini-cli/issues/22747), [#19561](https://github.com/google-gemini/gemini-cli/issues/19561)).
- **Durable, file-based task tracking**: replacing in-context `WriteToDo` with persistent CRUD to fight context rot ([#18836](https://github.com/google-gemini/gemini-cli/issues/18836), [#21000](https://github.com/google-gemini/gemini-cli/issues/21000)).
- **Safety and sandboxing depth**: zero-dependency OS sandboxing ([#19873](https://github.com/google-gemini/gemini-cli/issues/19873)), discouraging destructive commands ([#22672](https://github.com/google-gemini/gemini-cli/issues/22672)), per-workspace policies ([#18397](https://github.com/google-gemini/gemini-cli/issues/18397)).
- **Self-awareness and configuration fidelity**: accurate CLI flags/hotkeys ([#21432](https://github.com/google-gemini/gemini-cli/issues/21432)), honoring `settings.json` ([#22267](https://github.com/google-gemini/gemini-cli/issues/22267), [#18285](https://github.com/google-gemini/gemini-cli/issues/18285)).

## 7. Developer Pain Points

- **Silent failures and misleading success signals**: subagents report `GOAL`/`success` after hitting limits ([#22323](https://github.com/google-gemini/gemini-cli/issues/22323)) and ripgrep timeouts return partial results as if complete ([#29831](https://github.com/google-gemini/gemini-cli/pull/29831)).
- **Hangs and stalls**: generalist agent hanging ([#21409](https://github.com/google-gemini/gemini-cli/issues/21409)) and getting stuck at interactive prompts ([#22465](https://github.com/google-gemini/gemini-cli/issues/22465)).
- **Configuration not honored**: browser agent ignoring `settings.json` overrides ([#22267](https://github.com/google-gemini/gemini-cli/issues/22267)).
- **Environment/platform friction**: Wayland browser failures ([#21983](https://github.com/google-gemini/gemini-cli/issues/21983)), rootless Podman permissions ([#29718](https://github.com/google-gemini/gemini-cli/pull/29718)), Windows symlink/pwsh test gaps ([#29691](https://github.com/google-gemini/gemini-cli/pull/29691), [#29647](https://github.com/google-gemini/gemini-cli/pull/29647)).
- **Tool sprawl and limits**: 400 errors when tool counts exceed limits ([#24246](https://github.com/google-gemini/gemini-cli/issues/24246)).
- **Terminal UX rough edges**: resize flicker and scrollback handling ([#21924](https://github.com/google-gemini/gemini-cli/issues/21924), [#29792](https://github.com/google-gemini/gemini-cli/pull/29792)).

Overall, the community's energy is concentrated on making the subagent system *trustworthy* — accurate statuses, honoring configuration, and not hanging — while the platform team invests in efficiency (AST tooling, token-frugal reads) and safety (sandboxing, destructive-command avoidance).

</details>

<details>
<summary><strong>GitHub Copilot CLI</strong> — <a href="https://github.com/github/copilot-cli">github/copilot-cli</a></summary>

# GitHub Copilot CLI Community Digest — 2026-10-20

## 1. Today's Highlights

Release activity continues with v1.0.101-0 adding native structured output for workflow subagents and a new `assistedApprovalInstructions` setting, building on v1.0.100's client telemetry opt-out and verified plugin installation. The issue tracker remains dominated by MCP OAuth lifecycle problems — token reuse, silent refresh, and ACP-mode persistence failures — now spanning four separate open issues (#4695, #4203, #4994, #5192). Sandbox regressions also escalated today, with Linux, macOS, and ACP-mode sandboxing all reporting distinct breakages.

## 2. Releases

**v1.0.101-0** ([repo](https://github.com/github/copilot-cli))
- **Added**: Native structured output for dynamic workflow subagents on supported models; `assistedApprovalInstructions` setting to guide Assisted Permissions confirmation decisions.
- **Fixed**: Shared MCP auth errors now point to the client's sign-in settings (CLI authentication warnings unchanged).

**v1.0.100** (2026-10-19)
- **Added**: `--disable-client-telemetry` flag to disable client telemetry uploads; `--trust-folder` for one-off prompt-mode sessions (`-p` or piped stdin); installation of verified Skills and plugins via `copilot plugin install "ghapp://air/install?...`.

## 3. Hot Issues

1. **[#1305 [CLOSED] Support CIMD for Remote OAuth MCP Servers](https://github.com/github/copilot-cli/issues/1305)** — 👍 39, the highest-reacted issue in this batch. Closed after 8 months; extends DCR support to Client ID Metadata Documents for remote OAuth MCP servers. Signals the maintainers are modernizing MCP auth.

2. **[#4203 Remote MCP (OAuth): expired access token forces interactive re-auth instead of silent refresh_token grant](https://github.com/github/copilot-cli/issues/4203)** — The CLI abandons a valid cached refresh token and forces a browser login. Root cause class for several sibling issues; high impact on headless/CI workflows.

3. **[#5192 ACP mode: MCP OAuth token is never persisted after successful sign-in](https://github.com/github/copilot-cli/issues/5192)** — Fresh today. Every new ACP thread re-opens the browser. Makes OAuth-protected MCP effectively unusable in editor integrations.

4. **[#4994 Regression (1.0.88 → 1.0.89): MCP OAuth page opens on every ACP session](https://github.com/github/copilot-cli/issues/4994)** — Same symptom, different mechanism: valid unexpired tokens in `~/.copilot/mcp-oauth-config` are ignored. The 1.0.88→1.0.89 regression window is a useful bisect hint.

5. **[#4695 MCP OAuth tokens not reliably reused — duplicate cache-key entries force repeated re-auth](https://github.com/github/copilot-cli/issues/4695)** — Cache-key hashing mints duplicate entries instead of reusing valid tokens. The infrastructure-level root cause tying the OAuth cluster together.

6. **[#5177 Regression: Manual Approval no longer prompts for repository-mutating Git commands after harness migration](https://github.com/github/copilot-cli/issues/5177)** — A safety regression: `git add`/`git commit`-class commands now execute without the previous explicit approval. Introduced with the October 2026 harness migration.

7. **[#5089 `copilot --acp` ignores `--sandbox` and `sandbox.enabled`; shell commands run unsandboxed](https://github.com/github/copilot-cli/issues/5089)** — Security-relevant: sandbox silently disabled in ACP mode despite explicit flags. Zero reactions but high severity.

8. **[#5176 Linux sandbox: shell commands killed after ~10 s (bwrap parent-death signal bound to exited thread)](https://github.com/github/copilot-cli/issues/5176)** — Precise root-cause analysis from the reporter; makes the Linux sandbox unusable for long builds.

9. **[#5176-adjacent #5105 [CLOSED] macOS sandbox blocks Gradle daemon connection](https://github.com/github/copilot-cli/issues/5105)** — Closed, but illustrates a pattern: sandbox networking policies break localhost daemon IPC (Gradle, and by extension similar tooling).

10. **[#5149 Claude Opus 5.5: 32k maxOutputTokens makes `--reasoning-effort max/xhigh` return empty turns; auto-continue bills each empty turn](https://github.com/github/copilot-cli/issues/5149)** — Cost-impacting model integration bug: the reasoning budget consumes the entire output cap, producing billable empty turns.

Honorable mentions worth watching: **[#4438](https://github.com/github/copilot-cli/issues/4438)** (`disable-model-invocation: true` makes skills unreachable rather than manual-only, 👍 14) and **[#4488](https://github.com/github/copilot-cli/issues/4488)** (Windows plugin updates blocked by file locks from unrelated sessions, a long-standing papercut also filed today as **[#5194](https://github.com/github/copilot-cli/issues/5194)**).

## 4. Key PR Progress

No pull request data was provided for the last 24h (Total: 0 items). This section is omitted.

## 5. Hot Discussions

No discussion data was provided. This section is omitted.

## 6. Feature Request Trends

Distilled from all 26 issues:

- **MCP auth lifecycle maturity** — The dominant theme: silent `refresh_token` grants, reliable token-cache reuse, CIMD support, and OAuth persistence in ACP mode. The community wants MCP auth to behave like a mature OAuth client, not a browser redirect loop.
- **Sandbox policy transparency and correctness** — Requests for MCP servers to read the effective sandbox policy ([#5193](https://github.com/github/copilot-cli/issues/5193)), read-only vs. write-aware permission prompts for out-of-cwd paths ([#4443](https://github.com/github/copilot-cli/issues/4443)), and consistent sandbox enforcement across interactive, `-p`, and `--acp` modes.
- **ACP-mode parity** — Mid-turn steering ([#5198](https://github.com/github/copilot-cli/issues/5198)), sandbox support, and OAuth persistence all ask for `--acp` to reach parity with the interactive CLI and SDK mode.
- **Agent/tool scoping correctness** — Deferred MCP tool loading breaking under custom agents ([#5195](https://github.com/github/copilot-cli/issues/5195)) and child agents unable to discover their own permitted MCP tools ([#5191](https://github.com/github/copilot-cli/issues/5191)).
- **Session/state preservation** — `/clear` resetting the model ([#5189](https://github.com/github/copilot-cli/issues/5189)) and Ctrl+G external-editor round-trips losing prompt text ([#5188](https://github.com/github/copilot-cli/issues/5188)).
- **Terminal/input polish** — Image paste into freeform question inputs ([#4544](https://github.com/github/copilot-cli/issues/4544)), clickable file links over Remote-SSH ([#5196](https://github.com/github/copilot-cli/issues/5196)), and WSL2 voice stability ([#5197](https://github.com/github/copilot-cli/issues/5197)).

## 7. Developer Pain Points

- **Repeated OAuth re-authentication** is the single biggest frustration. Four open issues (#4695, #4203, #4994, #5192) describe the same user-visible symptom through different code paths — tokens not reused, not refreshed, or not persisted. Affected users are stuck in browser sign-in loops, which is especially damaging in ACP/editor and headless contexts.
- **Sandbox regressions across platforms**: macOS blocks localhost daemon connections, Linux kills long-running processes after ~10s and ignores `NO_PROXY` when chaining to corporate proxies ([#5199](https://github.com/github/copilot-cli/issues/5199)), and ACP mode ignores sandbox flags entirely. Developers report `exit code -1` with no error message.
- **Permission-model trust erosion**: manual approval no longer intercepts repo-mutating Git commands post-harness-migration (#5177), reversing a documented safety behavior with no opt-in.
- **Windows file-locking**: plugin update/uninstall fails with `os error 5` whenever any other CLI or VS Code session is open (#4488, #5194) — blocking upgrades for multi-session users.
- **Model misconfiguration with billing impact**: Opus 5.5's 32k output cap consumes the whole budget on reasoning, producing empty turns that auto-continue still bills (#5149).
- **Protocol correctness edge cases**: the MCP client sends a legacy `initialize` after a successful modern `server/discover`, breaking dual-era SDK servers (#4888).

---

*Data source: [github.com/github/copilot-cli](https://github.com/github/copilot-cli) — 26 issues updated in last 24h, 2 releases, 0 PRs.*

</details>

<details>
<summary><strong>OpenCode</strong> — <a href="https://github.com/anomalyco/opencode">anomalyco/opencode</a></summary>

# OpenCode Community Digest — 2026-10-20

## Today's Highlights

No new releases landed in the past 24 hours, but the issue tracker stayed busy: the biggest threads remain the **V2 desktop model picker showing "No reasoning" for every reasoning-capable model** (#50257, 14 comments) and a persistent **free-tier access error** blocking users who run OpenCode through non-OpenCode surfaces (#49678). On the PR side, maintainer **kitlangton** filed a cluster of UX/polish fixes (timeline jump behavior, debug bar persistence, iOS-style agent status orbs, typography) alongside a proposed v2 free-tier usage-limit dialog restoration, while third-party contributors pushed through MCP connection lifecycle fixes and Windows installer hardening.

## Releases

No releases in the last 24 hours.

## Hot Issues

1. **[#50257 — desktop: model picker shows "No reasoning" for all V2 models](https://github.com/anomalyco/opencode/issues/50257)** (OPEN, 14 comments, 👍4)
   `capabilities.reasoning` is never populated, so every V2 model — including `deepseek-v4.1-flash`, `kimi-k3`, and `glm-5.3` — reports no reasoning support. The highest-engagement issue of the day; a fix PR (#55100) is already linked.

2. **[#49678 — "OpenCode's free tier can only be used from within OpenCode"](https://github.com/anomalyco/opencode/issues/49678)** (OPEN, 11 comments, 👍2)
   Users hit a provider-side console error on the latest build, with no version info exposed in the UI (`Help > About` absent). A recurring access complaint that has grown into a broader trust/support-surface grievance.

3. **[#26915 — [FEATURE] RTL (Right-to-Left) language support in the chat panel](https://github.com/anomalyco/opencode/issues/26915)** (OPEN, 8 comments, 👍5)
   The most-upvoted issue in this digest. Arabic, Hebrew, and Persian text cannot render correctly in the chat panel — a real internationalization gap for a tool with global adoption.

4. **[#52706 — desktop: ResizeObserver loop makes app unresponsive](https://github.com/anomalyco/opencode/issues/52706)** (OPEN, 4 comments, 👍1)
   Electron renderer floods with `ResizeObserver loop completed with undelivered notifications` and the UI locks up until restart. A hard reliability bug for desktop users.

5. **[#54145 — `/connect` shows providers that are disabled in the config](https://github.com/anomalyco/opencode/issues/54145)** (OPEN, reproduced, 4 comments, 👍3)
   Regression from v1: `enabled_providers` no longer restricts the `/connect` list, undermining enterprise lock-down controls. Marked reproduced; 3 upvotes signal real org-level impact.

6. **[#54910 — compaction: manual `/compact` keeps full conversation in next request](https://github.com/anomalyco/opencode/issues/54910)** (OPEN, reproduced, 3 comments)
   Manual compaction produces a summary but context size doesn't drop; recovery-path compaction still works. A correctness/regression concern for anyone managing long sessions and token budgets.

7. **[#55764 — [FEATURE] Session pinning in the Desktop app (TUI parity)](https://github.com/anomalyco/opencode/issues/55764)** (OPEN, 3 comments, 👍1)
   Desktop/web lack the session pinning the TUI already has, despite an earlier scoped request (#28813). A clear parity gap users are tracking across multiple issues.

8. **[#57341 — Local MCP server processes are not terminated when their owning client/session disconnects](https://github.com/anomalyco/opencode/issues/57341)** (OPEN, 3 comments)
   Every launch spawns a fresh stdio MCP server and old instances leak. Filed today; a serious resource-leak class bug for anyone running local MCP tooling.

9. **[#57364 — Configured MCP servers shown by `opencode mcp list` but unavailable in sessions](https://github.com/anomalyco/opencode/issues/57364)** (OPEN, triaging, 2 comments)
   Internal MCP resource lookup returns an empty list inside sessions even though config is valid. Directly blocks MCP-dependent workflows.

10. **[#57337 — OPENCODE_API_KEY auth fails silently in GitHub Actions CI](https://github.com/anomalyco/opencode/issues/57337)** (OPEN, 2 comments)
    Keys containing certain characters break duplicate detection, and `gh` CLI auth is described as fragile. High-leverage for teams trying to run OpenCode in CI pipelines.

**Also notable (closed/quick triage):** [#56348](https://github.com/anomalyco/opencode/issues/56348) (insufficient funds), [#57028](https://github.com/anomalyco/opencode/issues/57028) (console logs crash), [#57020](https://github.com/anomalyco/opencode/issues/57020) (proxy routing breaks concurrent spawns), [#57359](https://github.com/anomalyco/opencode/issues/57359) (Windows shell permission bypass via `--`), [#57351](https://github.com/anomalyco/opencode/issues/57351) (ENOSPC TUI crash).

## Key PR Progress

1. **[#57367 — feat(app): timeline without jumps (alternative)](https://github.com/anomalyco/opencode/pull/57367)** by kitlangton
   Experimental draft building on #57224; three-file incremental approach to eliminate timeline jumpiness. Explicitly marked not-merge-ready, but directionally important for chat UX.

2. **[#55100 — fix(core): expose model reasoning capability](https://github.com/anomalyco/opencode/pull/55100)** by zhengkaics
   Closes #50257 and #53520. V2 port of the earlier #50283 that was swept away during the V1→V2 promotion. Highest-impact fix in flight.

3. **[#57146 — fix: restore free-tier usage limit dialog on v2](https://github.com/anomalyco/opencode/pull/57146)** by kitlangton
   Restores v1's `FreeUsageLimitError` (HTTP 429) handling and the desktop/server usage-exceeded dialog. Closes #50996; related follow-up to show reset time (#52894).

4. **[#57155 — fix: offer OpenCode account sign-in on OpenCode Go, listed below OpenCode Console](https://github.com/anomalyco/opencode/pull/57155)** by kitlangton
   Fixes provider ordering and closes the TUI/server sign-in gap for OpenCode Go — `OpencodePlugin` currently only registers the Console device flow.

5. **[#56452 — feat: allow disabling failed MCP servers & persist the toggle](https://github.com/anomalyco/opencode/pull/56452)** by VlexWest
   Space in `/mcps` disables a server in any state (failed, pending, connected) and persists it. Closes #56451 — directly relevant to the MCP pain points in today's issues.

6. **[#53046 — fix(mcp): reclaim discovery-only connections](https://github.com/anomalyco/opencode/pull/53046)** by mlimarenko
   Starts MCP lazily and releases connections opened solely to discover commands/tools/resources. Closes #51003; complements #57341's process-leak report.

7. **[#57361 — fix(tui): wait for session create before switching a session's model](https://github.com/anomalyco/opencode/pull/57361)** by Bearmancer
   Fixes the optimistic-session race behind #57354's "Session not found" toast. Same-day issue-to-PR turnaround.

8. **[#57355](https://github.com/anomalyco/opencode/pull/57355) / [#57353](https://github.com/anomalyco/opencode/pull/57353) — Windows installer temp/path fixes** by RikoOphorst and Dreamer-HIT
   Two independent fixes for #57342: Git Bash passing `TMPDIR` as a Windows path causes tar to read the drive letter as a remote host. Complementary approaches (cygpath normalization vs. extracting from inside the temp dir).

9. **[#57348 — fix(install): create `~/.zshrc` when missing so opencode lands on PATH](https://github.com/anomalyco/opencode/pull/57348)** by kitlangton
   Fresh macOS machines have no `~/.zshrc`, so the curl installer silently fails to add OpenCode to PATH. A classic first-run footgun.

10. **[#56826 — feat(core): aggregate VCS changes from nested git repositories](https://github.com/anomalyco/opencode/pull/56826)** by hsynkrkmz
    Git never descends into embedded repos; this aggregates changes across nested checkouts. Closes #45498, related to #52220 — meaningful for monorepo/submodule users.

**Other contributions:** [#57357](https://github.com/anomalyco/opencode/pull/57357) (iOS agent-status orbs in sidebar), [#57332](https://github.com/anomalyco/opencode/pull/57332) (persistent debug bar), [#57363](https://github.com/anomalyco/opencode/pull/57363) (session view typography), [#56882](https://github.com/anomalyco/opencode/pull/56882) (preserve live transcript during sync), [#56691](https://github.com/anomalyco/opencode/pull/56691) (retain shell output after undo), [#57347](https://github.com/anomalyco/opencode/pull/57347) (flush session exports before exit).

## Feature Request Trends

- **Internationalization & accessibility:** RTL chat support (#26915) is the single most-upvoted feature ask, with no committed implementation yet.
- **Desktop ↔ TUI parity:** Session pinning (#55764), subagent model/reasoning display in the bottom bar (#57366), and tool-approval dialog scrolling (#57362, follow-up to closed #45299) all point to desktop/web UI lagging the TUI feature set.
- **Cross-session context reuse:** #53933 asks for selecting and referencing another session's context in V2 — a workflow-level capability with no current equivalent.
- **Enterprise configurability:** Restricting `/connect` to `enabled_providers` (#54145), disabling failed MCP servers (#56452), and restoring quota visibility (#46877) reflect organizational deployment needs.
- **MCP lifecycle management:** Disabling/persisting MCP state, reclaiming discovery connections, and terminating orphaned processes indicate MCP is now a first-class surface users expect to be manageable.

## Developer Pain Points

- **V2 regressions from V1:** Multiple issues explicitly compare behavior to v1 and call out regressions — `/connect` ignoring `enabled_providers` (#54145), broken manual compaction (#54910), and the dropped `todowrite` tool (restored behind a flag in #56947). Contributors are re-porting V1 fixes (e.g., #55100) that were lost in the V1→V2 promotion sweep.
- **MCP reliability:** Orphaned processes (#57341), empty in-session resource lookups (#57364), arguments passed as strings breaking Pydantic validation (#57023), and Figma OAuth callback-path rejection (#57360) form a dense cluster of MCP integration failures.
- **Enterprise/proxy environments:** Proxy env leaking into localhost service discovery causing "port already in use" (#57020), silent CI auth failures (#57337), and the Windows `--` permission bypass (#57359) hit exactly the users deploying OpenCode at scale.
- **Installer & platform friction:** Repeated Windows temp-path failures (#57342 → #57355/#57353), the missing `~/.zshrc` PATH problem (#57348), and the ENOSPC watch crash (#57351) show first-run and platform setups remain brittle.
- **Support transparency:** Users repeatedly note there is no standard version-reporting surface (`Help > About`) and that errors like the free-tier console rejection (#49678) and account bans (#57352) arrive with no diagnostic detail — fueling frustration beyond the underlying bugs themselves.

---
*Digest generated from GitHub activity on [anomalyco/opencode](https://github.com/anomalyco/opencode) for 2026-10-20. No discussion data was provided, so the Discussions section is omitted.*

</details>

<details>
<summary><strong>Pi</strong> — <a href="https://github.com/earendil-works/pi">earendil-works/pi</a></summary>

# Pi Community Digest — 2026-10-20

## 1. Today's Highlights

A surge of `prio:p0` bugs landed in the Pi issue tracker today, with two distinct regressions dominating attention: extensions calling `sendMessage` during `session_start` corrupting the initial system prompt on all providers (#11157, #11165), and a compaction path that lets duplicate `tool_result` blocks reach Anthropic (#11143). Meanwhile, the long-running CJK bold rendering saga (#10154) finally closed after a fix PR (#10730) landed, and a prompt-cache regression on the Responses API (#10940) was resolved by @mitsuhiko in PR #11142.

## 2. Releases

No new releases in the last 24 hours.

## 3. Hot Issues

1. **[#10154](https://github.com/earendil-works/pi/issues/10154)** — *[CLOSED]* Chinese `**bold**` renders literally when the closing `**` sits between CJK punctuation and a CJK character. A two-month-old bug (originally #3353) finally closed; the fix landed via PR #10730. High community interest given Pi's large CJK user base.

2. **[#10949](https://github.com/earendil-works/pi/issues/10949)** — *[OPEN, inprogress]* `openai-responses` drops legacy `response.reasoning.delta` events, breaking reasoning streaming for OpenAI-compatible endpoints (e.g., Vercel AI Gateway + Kimi K3). Active work; affects anyone using third-party Responses endpoints.

3. **[#11143](https://github.com/earendil-works/pi/issues/11143)** — *[OPEN, prio:p0]* `_compactBeforeNextAssistantResponse()` skips sanitization, so duplicate `tool_result` blocks reach Anthropic and return 400—making Claude/Opus sessions unrecoverable. Critical reliability bug.

4. **[#11157](https://github.com/earendil-works/pi/issues/11157)** — *[OPEN, prio:p0]* Extensions that `sendMessage` at `session_start` demote every session to a "legacy" transcript. This breaks the Anthropic `system` field, native tool anchoring, and more. A significant extension-ecosystem footgun.

5. **[#10940](https://github.com/earendil-works/pi/issues/10940)** — *[CLOSED, prio:p0]* Deferred loads rewrite cached tools after any removal, repeatedly invalidating the cached prefix (observed cacheRead 153472 → 0). Closed with PR #11142 from @mitsuhiko.

6. **[#11116](https://github.com/earendil-works/pi/issues/11116)** — *[OPEN, inprogress, prio:p0]* Update Ant Ling models to Ling 3.x and switch to DeepSeek-compatible reasoning format, retiring the provider-specific `thinkingFormat: "ant-ling"`.

7. **[#11067](https://github.com/earendil-works/pi/issues/11067)** — *[CLOSED, no-action]* RPC mode has no per-session MCP server registration command, blocking ACP adapters (e.g., Zed) that need to map `session/new.mcpServers`.

8. **[#11156](https://github.com/earendil-works/pi/issues/11156)** — *[OPEN]* Third-party extensions fail to load because `@earendil-works/pi-ai/models` is not resolvable from the extension loader — a packaging/loader contract gap affecting external providers.

9. **[#11163](https://github.com/earendil-works/pi/issues/11163)** — *[CLOSED, no-action]* Bare URL autolink swallows fullwidth punctuation and trailing CJK text, producing invalid hrefs with OSC 8 enabled. Another CJK/terminal hygiene issue.

10. **[#11100](https://github.com/earendil-works/pi/issues/11100)** — *[CLOSED, bug]* The `tool_result` extension event never fired in 1.1.0, silently breaking extensions like `claude-mem` that rely on tool-call observation.

## 4. Key PR Progress

1. **[#10730](https://github.com/earendil-works/pi/pull/10730)** — *[CLOSED]* `fix(tui): render CJK emphasis next to fullwidth punctuation` — Resolves #10154 by adjusting CommonMark flanking behavior for CJK closing `**`. Long-awaited fix.

2. **[#11164](https://github.com/earendil-works/pi/pull/11164)** — *[CLOSED]* `fix(ai): find the initial system message past leading extension messages` — Fixes #11157 by having `getInitialSystemMessage()` scan past extension-emitted messages at index 0.

3. **[#11142](https://github.com/earendil-works/pi/pull/11142)** — *[CLOSED, pkg:ai]* `fix(ai): keep the prompt cache across tool changes on Responses` — Preserves the cached prefix after tool removal on OpenAI Responses, resolving #10940.

4. **[#10943](https://github.com/earendil-works/pi/pull/10943)** — *[OPEN]* `fix(ai): update Ant Ling model compatibility and remove deprecated models` — Adds Ling 3.0/3.0 Flash VL/3.1 Flash and unifies with DeepSeek-compatible API format.

5. **[#11158](https://github.com/earendil-works/pi/pull/11158)** — *[CLOSED]* `fix(coding-agent): overflow recovery escape hatch + output-budget-aware safety margin` — Prevents unbounded compact-and-retry loops when an injector keeps feeding messages after failed recovery.

6. **[#11108](https://github.com/earendil-works/pi/pull/11108)** — *[CLOSED]* `fix(tui): keep the leading tilde in fullscreen double-click word selection` — Adds `~` to `TERMINAL_WORD_SELECTION_JOINERS` so `~/Downloads` double-clicks correctly.

7. **[#11109](https://github.com/earendil-works/pi/pull/11109)** — *[CLOSED]* `fix(durable): builtin read resolves images to programs as image blocks in codemode` — Gives `read` a union structured-output schema so code-mode programs receive image blocks instead of empty strings.

8. **[#11150](https://github.com/earendil-works/pi/pull/11150)** — *[CLOSED]* `feat(tui): detect Rex terminal for OSC 8 hyperlinks` — Adds `TERM_PROGRAM=rex` detection for hyperlinks and truecolor (images stay off due to partial Kitty support).

9. **[#11140](https://github.com/earendil-works/pi/pull/11140)** — *[CLOSED]* `fix(compaction): retry summary without reasoning after token cap truncation` — Adds a retry path when auto-compaction hits the token cap, unsticking sessions with growing context.

10. **[#11151](https://github.com/earendil-works/pi/pull/11151)** — *[CLOSED]* `feat(coding-agent): content-tool-call-assist example extension` — Demonstrates letting small open models drive the agent loop when tool calls appear in message content (fenced JSON or Hermes/Qwen XML).

Also notable: **[#9501](https://github.com/earendil-works/pi/pull/9501)** and **[#9504](https://github.com/earendil-works/pi/pull/9504)** clean up Windows shell resolution (installation directories + Store aliases), improving Windows reliability.

## 5. Hot Discussions

**Show and tell**
- **[#11160](https://github.com/earendil-works/pi/discussions/11160)** — *Weasley Subagents*: an Apache-2.0 extension for coordinating child agents in Pi, with parallel reviews, sequential task chains, background delegation, a terminal fleet view, and local JSON/JSONL lifecycle artifacts. First community discussion of a multi-agent orchestration pattern built directly on Pi's durable primitives.

## 6. Feature Request Trends

- **Extension/system-prompt APIs**: Several issues (#11146, #11157, #11165) ask for extensions to participate safely in system prompt construction rather than only overriding it. The current `before_agent_start` model is too coarse.
- **RPC/ACP parity**: Multiple requests (#11067, #11162) seek RPC-level equivalents for MCP registration and session-tree visibility, driven by ACP adapters (Zed via pi-acp).
- **MCP server filtering**: #11048 asks for a host-owned filter hook in `createMcpExtension()` to hide unselected tools before initialization.
- **Provider expansion**: Requests to add `ai&` (#11128) and update Ant Ling (#11116) show continued demand for regional/sovereign model providers on `openai-completions`.
- **Transport configurability**: #11115 and #11106 (Linux DeepSeek 10.5s timeouts) converge on making undici's connect timeout and request-level diagnostics user-configurable.
- **Durable/public API surface**: #11113, #11141, #11144, #11149 all probe or request public contracts for `pi-durable` (ID ordering, per-turn tasks, HTML export, submission admission).
- **Windows shell defaults**: #11049 and #11051 push to prefer PowerShell over Git Bash when both are enabled, and to enable PowerShell by default on Windows.

## 7. Developer Pain Points

- **Compaction and overflow fragility**: #11143 and #11158 both describe sessions that become unrecoverable or loop unbounded after compaction/overflow events — a recurring class of critical bugs.
- **Extension event reliability**: #11100 (`tool_result` never fires) and #11157 (session_start message ordering) show extension authors repeatedly hitting undocumented or broken event semantics.
- **CJK/fullwidth text handling in the TUI**: #10154 and #11163 (two issues in one day's window) highlight that markdown and autolink rendering around CJK punctuation has been a persistent irritant for Chinese-language users.
- **Prompt cache invalidation**: #10940 illustrates that small changes (tool removal) can silently destroy large cached prefixes, with real cost/latency impact.
- **Windows shell environments**: #11049, #11051, #9501, #9504 together constitute a broad Windows usability campaign — Git Bash path/quoting/missing-tool problems are widely reported.
- **Model/provider compatibility edge cases**: #10949 (dropped reasoning deltas), #11106 (undici connect timeout), #11138 (server-tool block persistence), and #11116 (Ant Ling reasoning format) each represent adapter-level breakages that surface only with specific provider/model combinations.

</details>

<details>
<summary><strong>Qwen Code</strong> — <a href="https://github.com/QwenLM/qwen-code">QwenLM/qwen-code</a></summary>

# Qwen Code Community Digest — 2026-10-20

## 1. Today's Highlights

CI infrastructure is the dominant theme today: four independent runner-queue mechanisms are keeping the queue deep, and a series of fixes target redundant builds, transient install failures, and gate runs triggered by non-approval reviews. Alongside the CI work, the team landed a nightly release with daemon session-targeted refresh support, and the Web Shell and memory subsystems each surfaced P2 usability bugs around caret navigation and silent memory-index trimming.

## 2. Releases

**v0.25.3-nightly.20261019.5dcf7c7cb1**

- `feat(daemon)`: support session-targeted Skill and Extension refresh ([#14050](https://github.com/QwenLM/qwen-code/pull/14050))
- `fix(managed-agent)`: partial fix per truncated release notes

## 3. Hot Issues

1. **[#14859](https://github.com/QwenLM/qwen-code/issues/14859) [OPEN] CI capacity: four independent mechanisms keep the runner queue deep** — Tracking issue documenting that the queue problem is not one bug but four unrelated mechanisms, two of which need design decisions before coding. Measurements span 2026-10-19/20. High community engagement (3 comments) and a `need-discussion` label mark this as the central CI-health thread.

2. **[#14879](https://github.com/QwenLM/qwen-code/issues/14879) [OPEN] Web Shell: ArrowUp/Down in wrapped prompt recalls history instead of moving caret** — A clear UX bug: in the composer with `lineWrapping`, arrow keys inside a multi-row paragraph jump to history rather than navigating the caret. Simple to reproduce, high user impact for anyone typing long prompts. Flagged `ready-for-agent`.

3. **[#14877](https://github.com/QwenLM/qwen-code/issues/14877) [OPEN] Memory writer silently drops over-budget index entries** — The memory writer trims `MEMORY.md` silently and drops the *oldest* memories; the stamped notice should name what was dropped. Important for trust in the memory subsystem — silent data loss in a feature users depend on for continuity.

4. **[#14880](https://github.com/QwenLM/qwen-code/issues/14880) [OPEN] FG12 residuals: late reply after outcome_unknown, pre-dispatch cancel, post-drained R1-1** — Three uncovered test cells in the managed-agent fault-gate matrix, each requiring production or fixture changes beyond a test-only PR. Signals continued hardening of the managed-agent lifecycle.

5. **[#14854](https://github.com/QwenLM/qwen-code/issues/14854) [CLOSED] Review comment starts a Managed Agent gate run that can only report "no full run"** — `on.pull_request_review: [submitted]` fires for `commented` and `changes_requested`, wasting runners on runs that cannot change the gate outcome. Closed same day with a fix PR — a good example of fast triage on CI waste.

6. **[#14784](https://github.com/QwenLM/qwen-code/issues/14784) [OPEN] Main CI failed: Managed Agent gate — HostedHookFaultGatesIT (+6 more)** — A multi-test failure cluster in the Hook fault gates on MySQL, still open with `autofix/approved`. Reflects the ongoing flakiness pressure in hosted fault-injection tests.

7. **[#14492](https://github.com/QwenLM/qwen-code/issues/14492) [CLOSED] SDK Java — HostedExtensionsIT.publishedExtensionsSurviveHarnessReplacementCancellationAndCloseOnMySql** — Full-suite failure at commit `910a2909`, ten failures total; closed after 6 comments. Notable for the fix landed in [#14806](https://github.com/QwenLM/qwen-code/pull/14806), which treats `hosted_turn_active` as a lifecycle wait.

8. **[#14871](https://github.com/QwenLM/qwen-code/issues/14871) [OPEN] Qwen Code CI: serve fast-path bundle check failed** — Lint/static failure on Node 22 specifically in the serve fast-path bundle check. Small but indicates a gap in the fast-path bundling validation.

9. **[#14864](https://github.com/QwenLM/qwen-code/issues/14864) / [#14849](https://github.com/QwenLM/qwen-code/issues/14849) [CLOSED] Managed Agent gate failures: Java 11 SDK lane, Node.js dependency install** — Two commit-scoped gate failures closed same-day; both point at the same fragile install step that [#14851](https://github.com/QwenLM/qwen-code/pull/14851) now retries.

10. **[#14720](https://github.com/QwenLM/qwen-code/issues/14720) [CLOSED] HostedPublicWorkspaceIT.workspaceCwdChangeSettlesThroughBothSurfaces** — MariaDB/Java 21 lane failure around workspace CWD settling; closed with `autofix/in-progress`. Part of the steady stream of hosted-integration failures being worked down.

## 4. Key PR Progress

1. **[#14869](https://github.com/QwenLM/qwen-code/pull/14869) feat(serve): add `qwen daemon start`** — Launches `qwen serve` as a detached child, waits for the discovery record, and returns the bound URL, PID, log path, and stop command. A meaningful DX improvement for running the daemon outside a foreground terminal.

2. **[#14860](https://github.com/QwenLM/qwen-code/pull/14860) fix(ci): hold chosen RocketMQ ports until JVMs bind them** — Closes a race where the port chooser released sockets immediately while JVMs bound them minutes later after a distribution download. Directly targets a class of cross-job port collisions.

3. **[#14857](https://github.com/QwenLM/qwen-code/pull/14857) ci(gate): skip Managed Agent gate for non-approval reviews** — Implements the fix for #14854, ensuring `commented` and `changes_requested` reviews no longer consume runners. Paired with #14851, this is the main queue-relief effort.

4. **[#14851](https://github.com/QwenLM/qwen-code/pull/14851) fix(ci): retry transient pnpm installs in SDK Java workflow** — Wraps dependency installs in the repo's existing bounded retry, absorbing registry/runner blips up to three attempts. Targets the failure mode behind #14864/#14849.

5. **[#14884](https://github.com/QwenLM/qwen-code/pull/14884) / [#14873](https://github.com/QwenLM/qwen-code/pull/14873) fix(ci): skip duplicate prepare build in daemon E2E lane** — Sets `QWEN_SKIP_PREPARE=1` so `corepack pnpm install` no longer runs the full workspace build/bundle that the lane's explicit steps immediately repeat. Pure CI time savings.

6. **[#14046](https://github.com/QwenLM/qwen-code/pull/14046) feat(core): real PTY backend for Bun runtime** — Enables a POSIX PTY backend so shell tools and Web Terminal sessions get real terminal output, resizing, and exit observation instead of falling back to ordinary child processes. A long-running enhancement with broad reach across shell tooling.

7. **[#14281](https://github.com/QwenLM/qwen-code/pull/14281) feat(memory): scoped external import jobs for CLI and HTTP** — Adds a Qwen-owned external memory import service starting with Codex: preview, section/destination selection, then durable background consolidation. Significant step for memory portability.

8. **[#14765](https://github.com/QwenLM/qwen-code/pull/14765) feat(runtime): explicit idle resident Workspace retirement** — Adds idle retirement for resident Workspaces with an admin command to inspect, fence, and delete the original Pod, plus bilingual design docs. Resource-lifecycle hygiene for hosted deployments.

9. **[#14349](https://github.com/QwenLM/qwen-code/pull/14349) fix(cli): resolve `/auth` strings at render time, not import time** — Fixes the half-translated `/auth` dialog by moving string resolution from module scope to paint time. A quality-of-life fix for localization parity.

10. **[#14856](https://github.com/QwenLM/qwen-code/pull/14856) fix(core): protocol-tag sanitization telemetry on non-streaming route** — Brings the non-streaming path to parity with streaming for `protocol_tag_sanitized` telemetry and warn logs when stripping orphan ``/`</thinking>` tags. Improves observability of model-output cleanup.

## 5. Hot Discussions

No discussion data was provided for this period.

## 6. Feature Request Trends

- **Daemon & service lifecycle**: `qwen daemon start` (#14869) and session-targeted Skill/Extension refresh (#14050) show growing investment in running Qwen Code as a managed background service.
- **Memory system maturity**: external scoped imports (#14281) and visible trimming notices (#14877) point toward memory as a first-class, portable, trustworthy subsystem.
- **Terminal fidelity**: the Bun PTY backend (#14046) reflects demand for true terminal semantics in shell tools and Web Terminal.
- **Workspace resource management**: idle retirement (#14765) signals multi-tenant/hosted operational features are maturing.
- **Multi-agent fault tolerance**: the FG12/FG13 test residuals (#14880, #14848) reflect continued roadmap investment in managed multi-agent reliability.

## 7. Developer Pain Points

- **CI queue depth and cost**: The single biggest frustration cluster. Four independent mechanisms (#14859), review-triggered gate runs (#14854), duplicate `prepare` builds (#14884), and transient pnpm installs (#14851) all point to a CI pipeline that burns runner capacity unnecessarily and produces noisy commit-scoped failure issues.
- **Hosted MySQL integration flakiness**: Repeated failures across `HostedExtensionsIT`, `HostedHookFaultGatesIT`, and `HostedPublicWorkspaceIT` (#14492, #14784, #14720), plus deadlock retries (#14812) and cross-class test isolation (#14875), indicate persistent test-environment instability.
- **Silent behavior in memory management**: Dropping oldest memories without naming them (#14877) erodes trust — developers want explicit, auditable trimming.
- **Web Shell polish gaps**: The wrapped-prompt arrow-key bug (#14879) is the kind of small interaction defect that disproportionately annoys daily users.
- **Auth UI localization**: Import-time string resolution producing half-translated dialogs (#14349) highlights a recurring pattern of module-scope constants fighting i18n.

---
*Note: PR comment counts were unavailable in the source data; PR selections above are based on impact and topical relevance.*

</details>