# AI CLI Tools Community Digest 2026-11-17

> Generated: 2026-11-17 03:41 UTC | Tools covered: 7

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

# Cross-Tool Comparison Report: AI CLI Tools Ecosystem

**Date:** 2026-11-17 | **Scope:** Claude Code, OpenAI Codex, Gemini CLI, GitHub Copilot CLI, OpenCode, Pi, Qwen Code

---

## 1. Ecosystem Overview

The AI CLI tooling landscape in late 2026 is defined by **rapid architectural churn layered on top of unresolved reliability debt**. All seven tools are mid-flight on major internal refactors — sandboxing, session lifecycles, subagent orchestration, and Cloud/remote execution — while simultaneously fielding a persistent barrage of cost-visibility, authentication, and platform-specific (especially Windows) complaints. A clear convergence is emerging around **multi-surface parity** (TUI ↔ desktop ↔ web ↔ mobile) and **extension ecosystems** (MCP servers, plugins, skills). Meanwhile, three distinct community postures are visible: high-velocity alpha/beta churn (Codex, Qwen Code, OpenCode), security-and-stability hardening (Gemini CLI, Pi, Copilot CLI), and enterprise identity/cost governance demand (Claude Code). The ecosystem is transitioning from "can it work?" to "can we trust it in production?" — and the community signals reflect that shift.

---

## 2. Activity Comparison

| Tool | Releases (24h) | Hot Issues (open/active) | PR Activity | Discussions | Community Channel Notes |
|---|---|---|---|---|---|
| **Claude Code** | ✅ v2.1.326 (patch) | 10 issues, top #27302 (310 💬, 👍476) | 1 PR closed; near-zero new activity | N/A (Discussions not provided) | Issue tracker dominant; PRs sparse — indicates internal development model |
| **OpenAI Codex** | ✅ 4 alpha builds (`rust-v0.170/171`) | 10 issues; #57101 (42 💬) top comment; #2379 closed (👍38) | 10+ PRs (all `copyberry[bot]` automation, closed) | ✅ Very active (#9200: 53 💬, 👍195) | Dual-track: Issues + Discussions both high-signal |
| **Gemini CLI** | ❌ No release | 10 issues; #22323 (13 💬, P1) top | 10+ PRs, security-heavy (P0 build fix, P1 security) | N/A (not provided) | PR-centric; strong security/privacy focus |
| **GitHub Copilot CLI** | ✅ v1.0.113-0 | 10 issues, several closed today | **0 PRs** — triage-only day | N/A (not provided) | Issue-driven; PR pipeline quiet, indicating async release rhythm |
| **OpenCode** | ✅ process-daemon v0.6.0 (protocol 9) | 10 issues; #59387 mega-thread (385 💬) | 10 PRs, active feature work | N/A (not provided) | Massive free-tier issue hubs centralize feedback |
| **Pi** | ❌ No release | 10 issues; #9549 (18 💬) top perf bug | ~10 PRs, bug-fix heavy (petrroll batch) | ✅ 2 active threads (ideas + show-and-tell) | Extension-author community driving precise bug reports |
| **Qwen Code** | ✅ v0.27.4-nightly | 10 issues; #14724 CI (413 💬) top | 10 PRs; managed-agent + Web Shell push | N/A (not provided) | CI-flake-driven automation (bot-filed issues) dominates |

**Interpretation notes:**
- **PR count is not a proxy for velocity**: Codex's PRs are bot-generated and auto-closed; Gemini's are security-critical; Qwen Code's reflect a 1.0-preview migration in flight.
- **All tools show high issue volume**, but the *character* differs: Claude Code and Copilot show enterprise-integration friction; Codex and Qwen show platform state corruption; Gemini and Pi show correctness-of-signal bugs.
- **Discussions usage is uneven.** Only Codex and Pi provided meaningful discussion data. Where absent, this reflects digest scope, not usage — treat as N/A rather than "inactive."

---

## 3. Shared Feature Directions

The following requirements appear in **three or more** tool communities simultaneously:

### 3.1 Cost Governance & Token Predictability
- **Claude Code:** Per-session spend caps (#95964), early quota depletion (#100746), cache-write storms (#105132).
- **Codex:** Hard token bounds (#56686), `UsageAccountingDecision::ExhaustedForTurn` PR (#61958).
- **OpenCode:** One-off prompts breaking prefix cache (#62554), free-tier opacity (#64334, #59387).
- **Pi:** Fresh `BedrockRuntimeClient` per request (#11527), TTFT/TTFA telemetry (#12249).
- **Qwen Code:** Thinking-budget vs. output-cap conflict (#17258), whitespace token waste on Windows (#17350).
- **Copilot CLI:** 1-hour Claude cache TTL request (#5220, 👍11), autopilot loop cost drain (#2881).
- **Gemini CLI:** Token-frugal context proposals (#19561, #18836).
> **Signal:** Cost visibility is the single most consistent cross-tool demand. Communities want *interactive-session* budget controls, not just print-mode flags.

### 3.2 Session Continuity & Multi-Session UX
- **Claude Code:** Session handoff (#11455), cross-project artifact/memory transfer (#110525), subagent history resends (#110403).
- **Codex:** Remote control from ChatGPT app (#9200), canonical project-state layer (#33353), per-thread context profiles (#40429).
- **Pi:** Juggling live conversations (#11830), session reservation (#12216), `session_start` lifecycle correctness (#12230).
- **OpenCode:** Scratchpads (#64327), pinned sessions/tabs (#60236), keep blocking subagent calls (#64096, #64073).
- **Qwen Code:** Unified chat surface for daemon + managed sessions (#17460), stateful Web Shell (#14019).
> **Signal:** Long-horizon workflows are breaking the one-session-per-terminal model. Every tool is being asked for session portability, resumption, and parallelism.

### 3.3 Safety / Permission Model Refinement
- **Codex:** Wildcard argument matching (#36238), preserved scoped Git approvals (#56742).
- **Gemini CLI:** Windows git diff bypass (PR #30095), project Git env injection (PR #30206), destructive-behavior discouragement (#22672).
- **Copilot CLI:** Manual approval regression for repo-mutating commands (#5177), macOS Mach/XPC allowlist (#4881).
- **Claude Code:** `--allowedTools`/`--disallowedTools` startup validation (v2.1.326).
- **OpenCode:** `--no-password` for v2 serve (#43039, 👍35), silently ignored `permission` blocks (#64253).
> **Signal:** Literal-match permission models are hitting scaling limits. Wildcards, pattern classes, and *preserved scoped approvals* are the emerging ask.

### 3.4 Extension / Plugin / MCP Ecosystem Maturation
- **Claude Code:** Plugin/hook parity for worktrees (#83953), plugin usage tracking (#110537).
- **Codex:** Explosion of show-and-tell MCP servers (SnipToss, Runheed, Taskhold, CallForMe, Ragmir).
- **Gemini CLI:** `settings.json` discovery (#18285), curated examples (#18283), shared memory (#18287).
- **OpenCode:** Marketplace master issue closed (#28696, 👍38), ecosystem docs PR (#64348).
- **Pi:** Extension lifecycle events (`user_bash_complete` #8530), official Web UI base discussion (#8420).
- **Qwen Code:** Keenable as keyless MCP web search (#16204), generic webhook destinations (#17374).
- **Copilot CLI:** MCP/OAuth robustness cluster (#4901, #4584, #3973).
> **Signal:** MCP is now table stakes; the differentiation battle is *discovery, lifecycle contracts, and reliability*.

### 3.5 Cross-Surface (TUI ↔ Desktop ↔ Web ↔ Mobile) Parity
- **Claude Code:** Cowork sessions in deprecated mode (#107077), Desktop narration drops (#95764).
- **Codex:** iOS task list regression (#60778), Mac sidebar missing remote projects (#31407).
- **OpenCode:** Desktop `/cd` command (#64353), signed-in browser pane (#63002).
- **Pi:** Official Web UI base discussion (#8420).
- **Qwen Code:** Web Shell worktree Codex-parity phases P6/P7 (#17237).
> **Signal:** Features landing in one surface routinely fail to propagate. Parity is becoming an explicit roadmap axis.

---

## 4. Differentiation Analysis

| Dimension | Claude Code | OpenAI Codex | Gemini CLI | Copilot CLI | OpenCode | Pi | Qwen Code |
|---|---|---|---|---|---|---|---|
| **Primary focus** | Enterprise identity, cost governance | Remote/mobile control, Cloud environments | Security hardening, subagent correctness | MCP/OAuth, sandbox config | Marketplace, free-tier ops | Performance, extension API | CI reliability, managed-agent channels |
| **Target user** | Enterprise multi-identity teams | Prosumer devs + mobile-first | Safety-conscious devs, OSS maintainers | GitHub-native enterprise teams | Hobbyist → prosumer free tier | Extension authors, power users | Qwen subscription + managed channels |
| **Technical approach** | Closed-core, sparse external PRs | Rust core, bot-driven PR pipeline | Security-first, design-proposal heavy | Triage-driven async releases | Process daemon architecture, protocol versioning | Extension-first RPC surface | Event-driven kernel migration (1.0 preview) |
| **Release cadence** | Patch-level, conservatively disclosed | Rapid alpha (`0.171.0-alpha.x`) | Slow stable, heavy PR queue | Terse patch releases | Protocol-versioned daemon releases | No release this window | Nightly iteration toward freeze |
| **Distinctive pain** | Silent API stalls (#26224, #88178) | Windows sandbox bricks (#59941) | False-success termination reasons (#22323) | IPv4 sandbox, macOS allowlist | Zombie processes (#63817, #63976) | Streaming transport fragility (#12225, #12060) | CI flake backlog (#14724, 413 💬) |
| **Security posture** | Startup validation, tool-flag checks | Wrapped sandbox command consolidation | Aggressive (env injection, git bypass fixes) | Approval regression recovery | Opt-in screen reader, OAuth fixes | Dependency pin hygiene (undici) | Managed-agent authority unification |

**Key differentiators:**

- **Claude Code** is the most *enterprise-shaped* community: multi-connector auth (#27302) and cost caps dominate, and PR activity is nearly absent — suggesting an internal-only development model where the tracker is primarily a *feedback channel*, not a *contribution surface*.
- **OpenAI Codex** is the most *rapidly onboarding new surfaces*: Cloud environments, saved-environment APIs, iOS/mobile remote control. The `copyberry[bot]` PR pipeline suggests heavy internal automation — community contribution is largely via Discussions and show-and-tell.
- **Gemini CLI** is the most *security-forward*: distinct P0/P1 security PRs (Git env injection, Windows diff bypass) and explicit design proposals for sandboxed bash (#19873). Its "false-success termination reason" bug class (#22323, #21983) is uniquely trust-critical.
- **GitHub Copilot CLI** is the most *OAuth/MCP-challenged*: repeated enterprise IdP friction (Atlassian, Entra, loopback caching) with a quiet PR channel implies a managed release pipeline where issues drive priorities but not code.
- **OpenCode** has the most *concentrated free-tier community*: the #59387 mega-thread (385 💬) functions as a de facto status page. Process daemon versioning suggests a real systems-engineering posture.
- **Pi** has the most *extension-author-centric* community: precise, taut bug reports (`session_start` duplications, SSE lock leaks) and a live debate on an official Web UI base (#8420).
- **Qwen Code** is the most *CI-automation-driven*: bots file flaky-test issues and explicit guidance warns maintainers against papering over deterministic failures — an unusually mature test-health workflow.

---

## 5. Community Momentum & Maturity

### Momentum (velocity of activity + iteration cadence)
1. **OpenAI Codex** — 4 alphas/24h; Discussions thread at 👍195; show-and-tell pipeline flooding with MCP servers. **Highest iteration velocity.**
2. **Qwen Code** — Nightly cuts, 1.0-preview migration with an explicit freeze date (2026-11-21), and a 413-comment CI thread. **Highest roadmap urgency.**
3. **OpenCode** — Protocol-versioned daemon release, marketplace master closed, active feature PRs. **Strong systems maturity.**
4. **Claude Code** — High issue engagement (310-comment top thread) but near-zero PR velocity. **High demand signal, low external throughput.**
5. **Gemini CLI** — Sustained P0/P1 security work; slow stable releases; broad subagent workstream. **Deep, careful iteration.**
6. **Pi** — Dense bug-fix PR batch from one contributor; strong extension ecosystem, smaller surface. **Focused, high-quality momentum.**
7. **Copilot CLI** — Zero PRs, triage-heavy day, but meaningful closures (autopilot loop, MCP binding, approval regression). **Quiet but consequential.**

### Maturity (production-readiness signals)
- **Most mature production posture:** GitHub Copilot CLI and Claude Code (enterprise auth, cost, and lifecycle scaffolding) — but both suffer reliability debt.
- **Most mature *engineering practices*:** Pi (precise lifecycle contracts, security pin hygiene) and Gemini CLI (security-first PR discipline).
- **Fastest-growing community:** OpenAI Codex, measured by Discussions engagement and third-party extension surface.
- **Most fragile maturity gap:** Windows is the unanimous weak point — Codex (7+ open Windows issues), Claude Code (MSIX/junction issues), Gemini CLI (shell description, diff bypass), OpenCode (dot-directory, worktree locks), Copilot CLI (loopback port caching).

---

## 6. Trend Signals

### 6.1 Cost is no longer a "nice-to-have" — it's a trust issue
Across 6/7 tools, cost complaints are framed not as budget concerns but as **trust erosion**: silently consuming quota (#100746), breaking caches (#62554), forcing re-sends after cache TTL expiry (#5220), and wasting tokens via terminal-width padding (#17350). Developers are asking for **interactive-session budget caps** and **per-model usage surfacing to status lines**. Vendors treating cost controls as print-mode-only features are behind community expectations.

### 6.2 Session state is the new frontier of correctness
The most damaging bugs this cycle are not crashes — they are **silent state corruption**: false-success termination reasons (Gemini #22323), projects vanishing post-update (Codex #61294), and `session_start` duplicating or dropping (Pi #10470). As agents run longer, **lifecycle event contracts** (start, resume, replace, fork) become as important as the agent logic itself.

### 6.3 MCP is commoditizing; discovery and reliability are the moat
The MCP server explosion in Codex show-and-tell (Runheed, Taskhold, Ragmir, CallForMe) and the closed OpenCode marketplace master issue (#28696) signal that **MCP server supply is no longer a bottleneck — discovery, curation, and OAuth reliability are**. Copilot's recurring MCP/OAuth failures (#4901, #4584, #3973) and Gemini's >128-tool 400 error (#24246) preview the scaling problems coming for every tool.

### 6.4 Windows remains the systemic weak point
Not one tool escaped Windows-specific regressions this cycle: Codex's sandbox brick (#59941), Claude Code's MSIX junction/case-sensitivity issues, Copilot's loopback caching, OpenCode's dot-directory search and worktree locks, Gemini's diff bypass. **Windows is where product promises meet platform reality — and where the ecosystem currently loses credibility.**

### 6.5 Remote/mobile control is the next UX inflection
Codex's #9200 (👍195, top-voted thread in the dataset) — running Codex headless from the ChatGPT mobile app — outranks every other single-community request this cycle. Claude Code's session portability asks (#11455) and Pi's multi-conversation UX thread (#11830) echo the same underlying want: **the agent should not be tethered to the terminal that launched it.**

### 6.6 Accessibility and ergonomics are entering roadmaps
OpenCode's screen-reader TUI mode (#39368 → PR #64350) and Claude Code's plugin usage tracking (#110537) reflect a maturation step: **communities are now asking for inclusive and non-expert-friendly experiences**, not just raw capability. This is an early signal — expect accessibility to become a differentiator in 2027.

### 6.7 Subagent reliability is the emerging quality benchmark
Gemini's false-success reports (#22323, #21983), Claude Code's post-pause history resends (#110403), and OpenCode's contested background-subagent migration (#64096, #64073) all point to **subagents being the most fragile layer** in the stack. Vendors that ship *observable, correctly-terminating, budget-bounded* subagents will win the next wave of trust.

---

## Bottom Line for Decision-Makers

- **Choose by posture, not feature list.** Codex for mobile/remote-first teams, Gemini CLI for security-sensitive workflows, Qwen Code for managed-channel + CI automation, OpenCode for extensible free-tier development, Pi for extension-authorship, Copilot CLI for GitHub-native enterprise, Claude Code for multi-identity enterprise with budget governance needs.
- **Budget for Windows friction.** Any Windows deployment should plan for sandbox, path, and credential regressions regardless of vendor.
- **Instrument cost and session lifecycle from day one.** The community's loudest asks map directly to the two operational risks most likely to hit your team: unpredictable token spend and silent session-state loss.
- **MCP maturity ≠ MCP reliability.** Server supply is abundant; treat OAuth and tool-scoping as the real integration risks.

*End of report.*

---

## Per-Tool Reports

<details>
<summary><strong>Claude Code</strong> — <a href="https://github.com/anthropics/claude-code">anthropics/claude-code</a></summary>

## Claude Code Skills Highlights

> Source: [anthropics/skills](https://github.com/anthropics/skills)

# Claude Code Skills — Community Highlights Report
*Data as of 2026-11-17 | Source: github.com/anthropics/skills*

---

## 1. Top Skills Ranking (by community attention)

The "comments" field in this dataset is largely `undefined`, so ranking below reflects composite attention signals: issue-referenced PRs, recurring author activity, and linked discussion volume. All items are **OPEN** unless noted.

| Rank | Skill / PR | What It Does | Discussion Highlights | Status |
|---|---|---|---|---|
| 1 | **mcp-builder fix** — PR [#1742](https://github.com/anthropics/skills/pull/1742) | Fixes broken MCP v2 import (`streamablehttp_client` → `streamable_http_client`) and custom-header config in `connections.py`. | Fixes issue #1668; blocks anyone using `mcp>=2.0.0`. High blast radius since mcp-builder is a core skill. | OPEN |
| 2 | **skill-creator trigger-eval fix** — PR [#1298](https://github.com/anthropics/skills/pull/1298) | Isolates trigger evals per worker, fixes Windows `select()` on subprocess pipes, and treats runtime failures as errors instead of false non-triggers. | Directly addresses systemic false-negative eval scores; overlaps with issues #1352 and #556. | OPEN |
| 3 | **notion-spec-to-implementation + quantitative-resume-auditor** — PR [#1245](https://github.com/anthropics/skills/pull/1245) | Converts product/tech specs into Notion implementation tasks with acceptance criteria; second skill audits resumes quantitatively. | Most recent update 2026-10-15; long-lived PR bundling two skills — review may be split. | OPEN |
| 4 | **webapp-testing `shell=True` removal** — PR [#1980](https://github.com/anthropics/skills/pull/1980) | Replaces `subprocess.Popen(..., shell=True)` in `with_server.py` to close a CWE-78 command-injection vector. | Security-hardening PR; ties into broader trust-boundary discussion in issue #492. | OPEN |
| 5 | **docx LibreOffice timeout fix** — PR [#1792](https://github.com/anthropics/skills/pull/1792) | Returns an error on `soffice` timeout and verifies revision marks are gone before claiming success. | Complements docx bug reports (#1734 orphaned comments, #2018 invalid XML). | OPEN |
| 6 | **pyxel retro-game skill** — PR [#525](https://github.com/anthropics/skills/pull/525) | Guides building, debugging, and headless-verifying retro Python games via Pyxel, with frame inspection and state checks. | One of the longest-running open PRs (since March), still updated Nov 1 — signals sustained maintainer interest. | OPEN |
| 7 | **proofcore-contract-auditor** — PR [#1771](https://github.com/anthropics/skills/pull/1771) | Static analysis of Solidity/Rust contracts with audit proofs anchored on TON Blockchain via Merkle protocol. | Web3 vertical; zero-storage notarization angle drew reviewer scrutiny. | OPEN |
| 8 | **md2video-audio** — PR [#1703](https://github.com/anthropics/skills/pull/1703) | Compiles Markdown into MP4 videos via Marp slides + realistic voiceover, zero-cost. | Representative of the "content-production pipeline" skill cluster. | OPEN |

---

## 2. Community Demand Trends (from Issues)

Distilled from the highest-comment issues:

1. **Trust-boundary / provenance security** — Issue [#492](https://github.com/anthropics/skills/issues/492) (46 comments) is by far the most-discussed: community skills shipping under an `anthropic/` namespace enable impersonation. Demand: clear namespace separation, signing, and provenance metadata.
2. **Reliable skill evaluation & triggering** — Issues [#556](https://github.com/anthropics/skills/issues/556) (13) and [#1352](https://github.com/anthropics/skills/issues/1352) (6) expose near-0% trigger rates and parallel-worker UUID cross-matching. Demand: a trustworthy eval harness before more skills land.
3. **Enterprise/org-level skill distribution** — Issue [#228](https://github.com/anthropics/skills/issues/228) (17 comments, 8 👍): users want a shared skill library instead of Slack-ing `.skill` files. Closely related: duplicate-install bug [#189](https://github.com/anthropics/skills/issues/189) (9 👍).
4. **Context-window efficiency** — Issue [#1487](https://github.com/anthropics/skills/issues/1487): `claude-api` eagerly injects ~156k tokens in a single call. Demand: lazy loading and budget-aware skill activation.
5. **Skill authoring quality standards** — Issue [#202](https://github.com/anthropics/skills/issues/202) (CLOSED) and [#2064](https://github.com/anthropics/skills/issues/2064): descriptions must state *when* to use a skill, not just what it does. Demand: a linter/best-practice validator for `SKILL.md`.
6. **Agent-state & reasoning quality** — Proposals [#1329](https://github.com/anthropics/skills/issues/1329) (compact-memory notation) and [#1385](https://github.com/anthropics/skills/issues/1385) (three-gate reasoning QA pipeline) show appetite for context-compression and self-verification skills.
7. **Governance & safety patterns** — Issue [#412](https://github.com/anthropics/skills/issues/412) (policy enforcement, threat detection, audit trails) — now closed, but the theme recurs in #492.

**Emerging verticals:** HPC/Slurm ops ([#1615](https://github.com/anthropics/skills/pull/1615)), Web3 auditing ([#1771](https://github.com/anthropics/skills/pull/1771)), and document typography QA ([#514](https://github.com/anthropics/skills/pull/514)).

---

## 3. High-Potential Pending Skills (active, not yet merged)

| PR | Signal | ETA Likelihood |
|---|---|---|
| [#1681](https://github.com/anthropics/skills/pull/1681) skill-creator direct execution fix | Author also owns #1742; both target core tooling; last update Oct 24 | High |
| [#1997](https://github.com/anthropics/skills/pull/1997) YAML frontmatter parsing fix | Correctness fix with clear repro; updated Oct 19 | High |
| [#1977](https://github.com/anthropics/skills/pull/1977) `wrapAround()` modulo fix | Tiny, well-scoped, fixes #1897 | High |
| [#1976](https://github.com/anthropics/skills/pull/1976) element_discovery textarea/select | Same author/PR series as #1977, #1975; fixes #1891 | High |
| [#1975](https://github.com/anthropics/skills/pull/1975) pptx `--cols` arg validation | Argparse guard; fixes #1809 | High |
| [#2019](https://github.com/anthropics/skills/pull/2019) xlsx worksheet-scoped defined names | Fixes false negatives in external-link detection (#2013); updated Nov 3 | Medium-High |
| [#1730](https://github.com/anthropics/skills/pull/1730) claude-api dead URL cleanup | Docs-only; HTTP 200 verified | Medium |
| [#2108](https://github.com/anthropics/skills/pull/2108) README document-skills snapshot clarification | Docs-only, freshly updated Nov 3; resolves contributor confusion | Medium |
| [#525](https://github.com/anthropics/skills/pull/525) pyxel skill | Long-lived but continues to receive updates — likely awaiting maintainer bandwidth | Medium |
| [#1245](https://github.com/anthropics/skills/pull/1245) notion-spec + resume-auditor | Bundled submission may need splitting | Medium |

> **Pattern:** the fastest path to merge appears to be small, single-bug fixes to existing `skill-creator` / `docx` / `xlsx` / `pptx` scripts, often with a linked issue number and a clear repro — while net-new skills (e.g., pyxel, proofcore, md2video-audio) wait longer.

---

## 4. Skills Ecosystem Insight

> **The community's most concentrated demand is not new capabilities but trust and reliability of the skill layer itself** — namespacing/provenance (#492), trustworthy trigger evaluation (#556, #1352), and context-budget safety (#1487) dominate discussion far more than any single new skill proposal, meaning the ecosystem has shifted from "what can Claude do?" to "can I safely rely on what it loads?"

---

*Note: Comment counts for PRs were `undefined` in the source data and have been inferred from linked issues, update recency, and author activity patterns. Issue comment counts are as reported.*

---

# Claude Code Community Digest — 2026-11-17

## 1. Today's Highlights
A new patch release (v2.1.326) improves the interaction between Code Mode and agent teams, and adds stricter startup validation for tool-flag values. Meanwhile, community attention remains dominated by a long-running multi-connector auth request (#27302, 310 comments) and persistent reports of Claude Code hanging on prompts (#26224, 133 comments). Cost/usage-tracking issues and plugin/hook inconsistencies continued to surface across the tracker.

## 2. Releases
**v2.1.326**
- Code Mode can now be enabled while agent teams are active; existing users with teams enabled will start sessions in Code Mode.
- Added a startup warning when `--allowedTools`, `--disallowedTools`, or `--tools` values do not look like valid tool entries.
- https://github.com/anthropics/claude-code/releases

## 3. Hot Issues
1. **#27302 — Multi-connector account support (310 comments, 👍476)** — Users want to link multiple accounts for the same connector in Claude/Claude Code on the web. By far the most upvoted request this cycle, indicating strong enterprise/multi-identity demand. https://github.com/anthropics/claude-code/issues/27302
2. **#26224 — Claude Code hangs/freezes for 5–20 min on prompts (133 comments, 👍152)** — A high-severity reliability blocker with substantial community traction; unresolved since February. https://github.com/anthropics/claude-code/issues/26224
3. **#11455 — Session handoff / continuity support (44 comments)** — Long-running request for persistent context across CLI sessions. https://github.com/anthropics/claude-code/issues/11455
4. **#88178 — Silent API stalls (~15 min) reported as 5 separate issues** — Author consolidates a systemic "no FIN/RST detection" failure class in Claude Desktop. https://github.com/anthropics/claude-code/issues/88178
5. **#107077 — Cowork cloud sessions stuck in deprecated mode** — Plugin hooks and slash commands silently fail in one of two launch modes. https://github.com/anthropics/claude-code/issues/107077
6. **#95764 — Opus 5 narration returned as summarized thinking blocks** — Prose between tool calls is dropped from Desktop; model believes user saw it. https://github.com/anthropics/claude-code/issues/95764
7. **#100746 — Usage limits depleting faster than expected** — Weekly/session quotas triggering early; recurring cost-related frustration. https://github.com/anthropics/claude-code/issues/100746
8. **#95964 — Per-session spend cap for interactive sessions** — `--max-budget-usd` is print-mode only; interactive users lack budget guards. https://github.com/anthropics/claude-code/issues/95964
9. **#105132 — Repeated 0.76–0.79M-token cache writes after image-history trimming** — Significant cost exposure on Windows/VS Code with Opus 5.5. https://github.com/anthropics/claude-code/issues/105132
10. **#110403 — Subagents re-send entire history after 5-minute pause** — Cache-tier behavior causes 187k-token rewrites on long subagent continuations. https://github.com/anthropics/claude-code/issues/110403

## 4. Key PR Progress
Only one PR was updated in the last 24h, and it was closed:
1. **#78049 [CLOSED] — `Set-ClaudeCodePolicy.ps1` writes to Program Files (x86) under 32-bit PowerShell** — Fixes an Intune/MDM deployment path bug caused by the 32-bit PowerShell host not being enforced, which redirected policy writes to the wrong Program Files directory. https://github.com/anthropics/claude-code/pull/78049

No other PR activity was recorded in this window.

## 5. Hot Discussions
No discussion data was provided; this section is omitted.

## 6. Feature Request Trends
- **Multi-account / multi-connector support** (#27302): top-voted request, spanning auth and integrations.
- **Session continuity & portability** (#11455, #110525): handoff between sessions, and transferring artifacts/rules/memories across projects and repos.
- **Cost governance for interactive use** (#95964, #99223): per-session spend caps and per-model weekly usage exposed to `statusLine`.
- **Cross-surface read-only integrations** (#106011): read claude.ai Projects and chat history from Claude Code.
- **Worktree/plugin parity** (#83953, #110537): project-scope hooks should reach git worktrees, and plugin usage should be tracked so plugins aren't flagged for removal.

## 7. Developer Pain Points
- **Reliability of long-running sessions**: silent API stalls with multi-minute spinners, no timeout detection, and no auto-retry remain the dominant complaint cluster (#26224, #88178).
- **Cost unpredictability**: usage limits depleting early, cache rewrites from image trimming, subagent history resends after 5-minute pauses, and irreversible one-click "Reset for free" actions (#100746, #105132, #110403, #102938, #108822).
- **Plugin/hook inconsistency**: hooks not reaching worktrees, Cowork sessions launching in deprecated mode, and plugins with hook modules never recorded as used (#83953, #107077, #110537).
- **Windows/macOS platform friction**: MSIX virtualization treated as a junction, case-sensitive drive-letter worktree checks, transient install failures leaving persistent banners, and Desktop input duplication (#102772, #91618, #65093, #110547).
- **Usage-limit auto-continue broken**: `/config` shows the setting enabled but the key is absent from config, so auto-continue never fires (#103591).

---
*Digest generated from GitHub activity on anthropics/claude-code for 2026-11-17. Issue/PR counts reflect the sample provided (50 issues, 1 PR updated in the last 24h).*

</details>

<details>
<summary><strong>OpenAI Codex</strong> — <a href="https://github.com/openai/codex">openai/codex</a></summary>

# OpenAI Codex Community Digest — 2026-11-17

---

## 1. Today's Highlights

A dense wave of `rust-v0.171.0-alpha.*` releases lands alongside a large batch of closed PRs from the `copyberry[bot]` automation pipeline, spanning undo/redo, sandbox hardening, Cloud environments, and thread-list concurrency. Windows remains the most friction-heavy platform this cycle, with sandbox blockers, missing workspace auth tokens, and CLI cwd misrouting all active. Meanwhile, community "Show and tell" activity is booming—MCP servers for error tracking, task lists, telephony, and retrieval (Ragmir) are proliferating.

---

## 2. Releases

Four alpha builds shipped in the last 24h, all within the `rust-v0.170–0.171` line:

| Version | Notes |
|---|---|
| `rust-v0.170.0-alpha.4.1` | Patch on the 0.170 alpha line |
| `rust-v0.171.0-alpha.8` | 0.171 alpha iteration |
| `rust-v0.171.0-alpha.9` | 0.171 alpha iteration |
| `rust-v0.171.0-alpha.10` | Latest 0.171 alpha |

Release notes are not yet populated beyond the tag string. The rapid `0.171.0-alpha.x` cadence suggests active stabilization work—consistent with the heavy PR churn noted below.

---

## 3. Hot Issues

1. **[#57101](https://github.com/openai/codex/issues/57101) — Windows Computer Use: capture border persists after screenshot turn** (42 comments, 👍7, OPEN)
   A gold/yellow capture-access border remains visible after a screenshot-producing turn completes. Highest-comment issue of the cycle; indicates the Windows Computer Use plugin is a major source of user friction.

2. **[#60778](https://github.com/openai/codex/issues/60778) — iOS "No tasks yet" while conversations remain searchable** (21 comments, 👍13, OPEN)
   Task list empty on iPhone despite a connected Mac host and reachable conversations via search. Top-voted issue; a clear session-store regression on mobile.

3. **[#49682](https://github.com/openai/codex/issues/49682) — ChatGPT dots: cloud-computer files vanish** (35 comments, 👍10, OPEN)
   Files for a previously working service became unavailable, and a desktop terminal also disappeared. Intermittent reproducibility makes root-causing difficult.

4. **[#2379](https://github.com/openai/codex/issues/2379) — Undo/redo typing in TUI** (16 comments, 👍38, CLOSED)
   The most-upvoted issue in the batch, finally closed—matching PRs #61951/#61954 today added configurable composer undo/redo. A strong signal that long-standing TUI requests are being triaged into the 0.171 line.

5. **[#59410](https://github.com/openai/codex/issues/59410) — Windows account auth: tokens lack `chatgpt_account_id`** (7 comments, OPEN)
   Workspace routing returns 432; the ChatGPT web app works fine on the same account. This is a blocker for Free-tier Windows users and worth close attention from platform maintainers.

6. **[#42797](https://github.com/openai/codex/issues/42797) — Windows CLI ignores session cwd, runs in wrong repo** (5 comments, OPEN)
   Commands like `git status` and tests execute in a different checkout than the reported session cwd. Potentially destructive; should be prioritized alongside the Windows sandbox work.

7. **[#59941](https://github.com/openai/codex/issues/59941) — Windows: `CreateProcessSecurityEnvironment 0x8007000F`** (5 comments, OPEN)
   A post-update regression that blocks *all* local commands, including a bare `Get-Location`. Effectively bricks the desktop app for affected users.

8. **[#61703](https://github.com/openai/codex/issues/61703) — Relational context loss → confident false memory** (9 comments, OPEN)
   ChatGPT Memory reconstructs plausible-but-wrong relational context during retrieval. A model-behavior issue with real trust implications for long-running projects.

9. **[#61294](https://github.com/openai/codex/issues/61294) — Windows: local Codex projects disappear after update** (6 comments, OPEN)
   Existing chats remain accessible, but local project entries vanish post-update—likely a state-migration bug in the desktop client.

10. **[#54403](https://github.com/openai/codex/issues/54403) — [Dots] GitHub CLI blocked by network policy** (4 comments, OPEN)
    `gh auth login` succeeds but `api.github.com:443` is blocked by policy inside the cloud computer's sandbox. Blocks a very common setup workflow for dot-based agents.

---

## 4. Key PR Progress

All PRs below are from the `copyberry[bot]` automation pipeline and are marked **CLOSED** as of this update.

1. **[#61956](https://github.com/openai/codex/pull/61956) — Support saved environments when starting Cloud threads**
   Adds an `EnvironmentSelection` type allowing threads to start with either a saved environment ID or a project checkout in the default environment—aligning Cloud-thread behavior with the new environment-configs API.

2. **[#61954](https://github.com/openai/codex/pull/61954) — Add undo and redo to the non-Vim prompt composer**
   Closes long-requested #2379. Defaults: `Alt+Z` on Unix, `Ctrl+Z` on Windows, `F7` fallback, `Super+Z` on macOS; `Shift` to redo.

3. **[#61951](https://github.com/openai/codex/pull/61951) — Refactor composer undo/redo history**
   Renames `VimHistory` → `EditHistory`, unifying undo/redo stack transfers and history trimming for both Vim and non-Vim modes.

4. **[#61947](https://github.com/openai/codex/pull/61947) — Mask system SSH config drop-ins in the Linux sandbox**
   Fixes a subtle bug where host root-owned SSH config drop-ins appeared owned by `nobody` inside the user namespace, causing OpenSSH to reject connections.

5. **[#61946](https://github.com/openai/codex/pull/61946) — Include enclosing tool context in nested Guardian approvals**
   Ensures Guardian reviews of nested MCP approvals carry the enclosing tool invocation context, even when the transcript delta no longer includes it.

6. **[#61942](https://github.com/openai/codex/pull/61942) — Centralize exec-server launches in `WrappedSandboxCommand`**
   Consolidates process spawning and Windows token session preparation into `codex-sandboxing`; rejects unsandboxed conversions—directly relevant to the Windows sandbox issues above.

7. **[#61940](https://github.com/openai/codex/pull/61940) — Add saved environment listing to the Cloud client**
   New `Client::list_saved_environments` API that returns ID, name, and workspace-sharing status—foundation for the Cloud-thread selection work in #61956.

8. **[#61934](https://github.com/openai/codex/pull/61934) — Allow independent app-server thread resumes to overlap**
   Removes a global exclusive permit bottleneck so a slow thread resume (e.g., waiting on MCP startup) no longer blocks unrelated resumes.

9. **[#61922](https://github.com/openai/codex/pull/61922) + [#61920](https://github.com/openai/codex/pull/61920) — TUI conversation-file chooser and inventory**
   Builds a per-conversation file inventory from message links, completed diffs, generated images, and opened docs, then exposes it via the TUI sidebar chooser.

10. **[#61939](https://github.com/openai/codex/pull/61939) — Preserve partial Git metadata when worktree status is slow**
    Honors the one-second Git metadata deadline without discarding already-observed HEAD/remote data—improves perceived responsiveness on large monorepos.

Also worth noting: **#61958** (`UsageAccountingDecision::ExhaustedForTurn`), **#61955** (bounded item loading in paginated `read_thread`), and **#61949** (extracted `codex-user-input` crate) — smaller but meaningful architecture work on budget accounting, pagination, and modularization.

---

## 5. Hot Discussions

### Ideas

- **[#9200](https://github.com/openai/codex/discussions/9200) — Remote control Codex from the ChatGPT app** (53 comments, 👍195)
  Top-voted discussion board thread of the entire dataset: run Codex headless/daemonized and drive it from the mobile app. Strong demand signal for a first-class remote-control path.
- **[#36238](https://github.com/openai/codex/discussions/36238) — Wildcards in the permission model** (2 comments, 👍3)
  Argues literal argument matching makes it impossible to safely allow `git [show|log|...]` with interspersed flags. Complements CLI permission requests elsewhere.
- **[#33353](https://github.com/openai/codex/discussions/33353) — Canonical project-state layer for ChatGPT Projects**
  Multi-day technical workflows lose continuity between sessions; asks for an explicit project-state contract.
- **[#61844](https://github.com/openai/codex/discussions/61844) — Intelligent model routing / auto complexity assessment**
  Proposes automatic model+reasoning selection based on a lightweight complexity classifier.

### Q&A

- **[#22829](https://github.com/openai/codex/discussions/22829) — VS Code extension shows all sessions, not per-project** (👍5)
  Session list is unscoped and generically named, making reload/navigation painful.
- **[#56686](https://github.com/openai/codex/discussions/56686) — Hard pre-request token bounds for `codex exec`**
  Practitioners need a supported way to cap accounted tokens per session without API-key transport.
- **[#61849](https://github.com/openai/codex/discussions/61849) — Supported metadata-only timing for screenshot/tool latency**
  Diagnosing first-output latency vs. command delivery in `0.169.0` app-server.

### Show and tell

- **[#59147](https://github.com/openai/codex/discussions/59147) — SnipToss**
  Mark up images/videos Codex generates and hand notes back as files—targets the "describe *where* in words" loop.
- **[#61923](https://github.com/openai/codex/discussions/61923) — Runheed**
  Remote MCP server exposing production errors (stack traces, breadcrumbs) so Codex can triage and resolve them.
- **[#61893](https://github.com/openai/codex/discussions/61893) — Taskhold**
  Shared task list with live progress as a remote MCP, one-command setup via `codex mcp add`.
- **[#61870](https://github.com/openai/codex/discussions/61870) — CallForMe**
  Gives the agent a phone; OAuth-based, no key paste.
- **[#61475](https://github.com/openai/codex/discussions/61475) — Ragmir**
  Open-source (AGPL-3.0) cited-context retrieval layer for code, PDFs, and Office files.
- **[#61788](https://github.com/openai/codex/discussions/61788) — Codex Windows sandbox protection gaps (38 scenarios)**
  Structured report across privacy (camera/mic/screen), interaction (cursor, disruptive windows), and system categories. High-quality community security research.
- **[#61953](https://github.com/openai/codex/discussions/61953) — Worktree Preflight**
  Read-only check for when Codex runs Git in the wrong Windows checkout—direct companion tooling to Issue #42797.

---

## 6. Feature Request Trends

Distilling across the Issues and Discussions above, the dominant asks cluster into five directions:

1. **Session/context control per thread** — per-thread context-window profiles ([#40429](https://github.com/openai/codex/issues/40429)), subagent context/auto-compaction defaults ([#49195](https://github.com/openai/codex/issues/49195)), and per-agent overrides ([#45164](https://github.com/openai/codex/issues/45164)). Developers want to trade cost vs. context per session rather than globally.
2. **A richer permission/approval model** — wildcard argument matching ([#36238](https://github.com/openai/codex/discussions/36238)), preserved scoped Git approvals across chats ([#56742](https://github.com/openai/codex/issues/56742)), and clearer approval semantics after updates.
3. **Remote/mobile control** — [#9200](https://github.com/openai/codex/discussions/9200) dominates; driven by users already pairing Tailscale + SSH and wanting a first-class UI.
4. **Auto-surface edited artifacts** — auto-open edited files in the sidebar preview ([#40079](https://github.com/openai/codex/issues/40079)), plus workspace isolation improvements ([#35749](https://github.com/openai/codex/issues/35749)).
5. **Smarter model selection** — automatic complexity assessment and routing ([#61844](https://github.com/openai/codex/discussions/61844)) as an alternative to manual reasoning-level toggles.

---

## 7. Developer Pain Points

- **Windows is the top friction surface.** Issues #57101 (persistent capture border), #59410 (missing `chatgpt_account_id`), #59941 (`CreateProcessSecurityEnvironment` failure), #61294 (projects vanish post-update), #42797 (CLI cwd misrouting), #56742 (approvals regression), and #46129 (4.8 MB Statsig payload exceeding nodeRepl.fetch limits) collectively describe a platform where updates and sandboxing repeatedly break working setups. The `WrappedSandboxCommand` consolidation in PR #61942 is a welcome response.
- **Session and workspace state is fragile.** Windows projects vanishing (#61294), iOS task lists empty while chats remain searchable (#60778), Mac sidebar missing remote projects (#31407), and dots reverting cloud workspaces three times in a day (#59808) point to inconsistent persistence across clients.
- **Long-running task stalls.** macOS HTTP 400s after successful tool ops (#58569) and WebSocket closes before `response.completed` (#32366) leave users blocked mid-task with only costly retries.
- **Cloud/dot network policy blocks common tooling.** GitHub CLI auth blocked inside Dots (#54403) and JetBrains Central proxy quota failures surfacing as opaque HTTP 477 (#61907) make third-party integrations brittle.
- **Memory trust erosion.** False-memory reconstruction (#61703) undermines confidence in long-horizon sessions—arguably the most consequential non-blocking issue this cycle.
- **Pagination and cost visibility.** PR #61955 (bounded `read_thread`) and Discussion #56686 (hard token bounds) reflect a shared concern: developers want predictable, bounded resource use and clear accounting when talking to long histories.

The overall picture: strong iteration velocity on architecture (sandboxing, Cloud environments, TUI ergonomics, undo/redo), but Windows stability and cross-client session persistence remain the highest-leverage areas for the next release window.

</details>

<details>
<summary><strong>Gemini CLI</strong> — <a href="https://github.com/google-gemini/gemini-cli">google-gemini/gemini-cli</a></summary>

# Gemini CLI Community Digest — 2026-11-17

## 1. Today's Highlights

No new releases landed in the last 24 hours, but activity remains heavily concentrated in the `area/agent` workstream, where subagent reliability, termination-reason correctness, and browser-agent resilience dominate the issue tracker. On the PR side, the most consequential work is around security hardening (Git environment injection, Windows diff permission bypass) and a release-blocking build fix for the nightly `413 Request Entity Too Large` publish failures.

## 2. Releases

No new releases in the last 24 hours.

## 3. Hot Issues

1. **[#22323](https://github.com/google-gemini/gemini-cli/issues/22323) — Subagent recovery after MAX_TURNS reported as GOAL success (P1, 13 comments)**
   The `codebase_investigator` subagent reports `status: "success"` / `Termination Reason: "GOAL"` even when it hit the max turn limit without doing any analysis. This is a correctness-of-signal bug: agents and users relying on termination reasons are being silently misled. It's the most-commented issue of the day and is tagged `need-retesting`.

2. **[#21409](https://github.com/google-gemini/gemini-cli/issues/21409) — Generalist agent hangs (P1, 8 comments, 8 👍)**
   Any deferral to the generalist agent hangs indefinitely — even trivial tasks like folder creation. Users report waiting up to an hour; disabling subagent deferral works around it. The high 👍 count signals broad impact.

3. **[#19873](https://github.com/google-gemini/gemini-cli/issues/19873) — Zero-dependency OS sandboxing & post-execution intent routing (P2, 9 comments)**
   A design proposal to let Gemini 3 lean into its native bash affinity by chaining POSIX tools, while containing risk via sandboxing and intent routing. Reflects the team's thinking on the safety/UX tradeoff for shell-heavy agents.

4. **[#21968](https://github.com/google-gemini/gemini-cli/issues/21968) — Gemini does not use skills and sub-agents enough (P2, 7 comments)**
   Anecdotal but widely echoed: custom skills and subagents are only invoked when explicitly instructed, never proactively. This undermines the entire premise of a skill ecosystem.

5. **[#22745](https://github.com/google-gemini/gemini-cli/issues/22745) — Assess impact of AST-aware file reads, search, and mapping (P2, 7 comments)**
   An EPIC exploring whether AST-aware tooling can reduce misaligned reads, token noise, and turn counts. Related investigations ([#22746](https://github.com/google-gemini/gemini-cli/issues/22746), [#22747](https://github.com/google-gemini/gemini-cli/issues/22747)) point at `tilth`, `glyph`, and `ast-grep` as candidates.

6. **[#22267](https://github.com/google-gemini/gemini-cli/issues/22267) — Browser Agent ignores `settings.json` overrides (P2, 5 comments)**
   `AgentRegistry` reads and merges settings correctly, but the Browser Agent then ignores them (e.g., `maxTurns`). A configuration-integrity bug with clear user expectations violated.

7. **[#21983](https://github.com/google-gemini/gemini-cli/issues/21983) — Browser subagent fails on Wayland (P1, 4 comments)**
   Browser Agent reports "Termination Reason: GOAL" while actually failing under Wayland — another instance of the false-success pattern seen in #22323, this time in the browser stack.

8. **[#24246](https://github.com/google-gemini/gemini-cli/issues/24246) — 400 error with > 128 tools (P2, 3 comments)**
   CLI hits a 400 when too many tools are in scope. Users expect smarter tool scoping rather than a hard failure — increasingly relevant as MCP servers multiply.

9. **[#22672](https://github.com/google-gemini/gemini-cli/issues/22672) — Agent should stop/discourage destructive behavior (P2, 3 comments)**
   Reports of `git reset`/`--force` being used when safer alternatives exist, plus unsafe DB modification patterns. A safety-behavior gap rather than a crash bug.

10. **[#22186](https://github.com/google-gemini/gemini-cli/issues/22186) — `get-shit-done` output hook causes crash (P1, 3 comments)**
    A reproducible crash in Gemini CLI during the final summary print of a hook. Narrow scope but P1 due to the hard crash.

Honorable mentions: [#20079](https://github.com/google-gemini/gemini-cli/issues/20079) (symlinked agent files not recognized), [#22465](https://github.com/google-gemini/gemini-cli/issues/22465) (stuck at interactive Vite prompt), [#21763](https://github.com/google-gemini/gemini-cli/issues/21763) (`/bug` reports omit subagent context), [#23571](https://github.com/google-gemini/gemini-cli/issues/23571) (tmp scripts scattered across directories).

## 4. Key PR Progress

1. **[#30207](https://github.com/google-gemini/gemini-cli/pull/30207) — fix(build): clear `bundle/` before esbuild (P0)**
   Nightly publishes have failed every night since 2026-11-05 with `413 Request Entity Too Large`; ~70 MB of stale chunks are inflating the tarball to 25.2 MB. This is the highest-priority fix in the queue.

2. **[#30095](https://github.com/google-gemini/gemini-cli/pull/30095) — fix: prevent Windows git diff permission bypass (P1, security, closed)**
   Dangerous Git arguments could be treated as safe read-only ops on Windows. Extracts shared Git command safety validation into reusable helpers and applies consistent read-only checks.

3. **[#30206](https://github.com/google-gemini/gemini-cli/pull/30206) — fix: block project Git environment injection (P1, security)**
   Prevents workspace-supplied Git env vars (via `.env` loading) from influencing internal Git and shell operations — a supply-chain-adjacent hardening.

4. **[#30292](https://github.com/google-gemini/gemini-cli/pull/30292) — fix(core): preserve oversized background log tails and mark truncated reads**
   Fixes `read_background_output` silently dropping the first split line, which lost entire outputs for single-line logs > 64 KB. Complements [#30325](https://github.com/google-gemini/gemini-cli/pull/30325), which addresses the misleading "Full Log Output:" header.

5. **[#30210](https://github.com/google-gemini/gemini-cli/pull/30210) — fix(core): stop WebFetch fallback work after cancellation**
   Cancellation now short-circuits fallback URL attempts instead of continuing to process after the user has moved on.

6. **[#30289](https://github.com/google-gemini/gemini-cli/pull/30289) — fix(cli): disclose canonical link path and default consent prompt to no (P1)**
   `gemini extensions link` now resolves to canonical paths via `fs.realpathSync` and defaults the non-interactive consent prompt to "no" — safer-by-default extension handling.

7. **[#30315](https://github.com/google-gemini/gemini-cli/pull/30315) — fix(cli): detect local git clone from CLI path instead of cwd**
   Fixes auto-update misclassifying a local source checkout as a global npm install when invoked outside the clone root (including `npm link` and `packages/cli` aliases).

8. **[#30283](https://github.com/google-gemini/gemini-cli/pull/30283) — fix(cli): skip system MCP servers with insecure command permissions (closed)**
   Extends prior ownership/permission checks on system config files to the MCP server commands and script arguments they reference.

9. **[#30316](https://github.com/google-gemini/gemini-cli/pull/30316) — fix(core): preserve custom model alias generation settings**
   `applyModelSelection()` compared concrete resolved model names against tier names, breaking custom aliases extending `flash-lite` and similar tiers.

10. **[#30097](https://github.com/google-gemini/gemini-cli/pull/30097) — fix(cli): make image paste work on WSL2**
    WSLg sets `WAYLAND_DISPLAY` but not `XDG_SESSION_TYPE`, so clipboard detection silently failed. Adds WSLg detection and a BMP fallback.

Also notable: [#30281](https://github.com/google-gemini/gemini-cli/pull/30281) (fetch timeout honored on Node 26 via Undici 7.30.2), [#30312](https://github.com/google-gemini/gemini-cli/pull/30312) (accurate Windows shell description), [#30305](https://github.com/google-gemini/gemini-cli/pull/30305) (docs fix for `excludeTools` form that never matches), [#30321](https://github.com/google-gemini/gemini-cli/pull/30321) (workspace dep and sandbox runtime updates).

## 5. Hot Discussions

No Discussion data was provided for this period.

## 6. Feature Request Trends

- **Subagent observability and control** — Making subagent trajectories visible via `/chat share` ([#22598](https://github.com/google-gemini/gemini-cli/issues/22598)), including subagent context in `/bug` reports ([#21763](https://github.com/google-gemini/gemini-cli/issues/21763)), and surfacing accurate termination reasons ([#22323](https://github.com/google-gemini/gemini-cli/issues/22323)).
- **AST-aware codebase tooling** — A cluster of issues ([#22745](https://github.com/google-gemini/gemini-cli/issues/22745), [#22746](https://github.com/google-gemini/gemini-cli/issues/22746), [#22747](https://github.com/google-gemini/gemini-cli/issues/22747)) investigating AST grep/tilth/glyph for more precise reads and searches.
- **Token-frugal, surgical context** — [#19561](https://github.com/google-gemini/gemini-cli/issues/19561) "Tactful Extraction" and [#18836](https://github.com/google-gemini/gemini-cli/issues/18836) persistent file-based task tracking aim to reduce context bloat and context rot.
- **Proactive skill/subagent invocation** — [#21968](https://github.com/google-gemini/gemini-cli/issues/21968) asks the model to actually use skills when relevant, not only on explicit instruction.
- **Safety-by-default agent behavior** — Discouraging destructive Git/DB operations ([#22672](https://github.com/google-gemini/gemini-cli/issues/22672)) and sandboxed bash execution ([#19873](https://github.com/google-gemini/gemini-cli/issues/19873)).
- **Subagent ecosystem plumbing** — Discovery via `settings.json` ([#18285](https://github.com/google-gemini/gemini-cli/issues/18285)), curated in-repo examples ([#18283](https://github.com/google-gemini/gemini-cli/issues/18283)), and shared memory/parallel collaboration ([#18287](https://github.com/google-gemini/gemini-cli/issues/18287)).

## 7. Developer Pain Points

- **Silent false-success termination reasons** — The recurring pattern across [#22323](https://github.com/google-gemini/gemini-cli/issues/22323) (subagent) and [#21983](https://github.com/google-gemini/gemini-cli/issues/21983) (browser agent on Wayland): the agent reports `GOAL` when it actually failed or was interrupted. This erodes trust in automated pipelines.
- **Agent hangs** — The generalist agent hang ([#21409](https://github.com/google-gemini/gemini-cli/issues/21409)) and the interactive-prompt hang in Vite scaffolding ([#22465](https://github.com/google-gemini/gemini-cli/issues/22465)) make the CLI unusable for affected workflows.
- **Configuration not honored** — Browser Agent ignoring `settings.json` ([#22267](https://github.com/google-gemini/gemini-cli/issues/22267)) and symlinked agent files not being discovered ([#20079](https://github.com/google-gemini/gemini-cli/issues/20079)) violate clear user expectations.
- **Tool-scope scaling limits** — The >128-tool 400 error ([#24246](https://github.com/google-gemini/gemini-cli/issues/24246)) will become more frequent as MCP server adoption grows.
- **Workspace hygiene** — The model creating temporary edit scripts across random directories ([#23571](https://github.com/google-gemini/gemini-cli/issues/23571)) creates cleanup overhead for developers.
- **Nightly release instability** — The ongoing `413` publish failures ([#30207](https://github.com/google-gemini/gemini-cli/pull/30207)) mean nightly consumers have been without fresh builds for nearly two weeks.

</details>

<details>
<summary><strong>GitHub Copilot CLI</strong> — <a href="https://github.com/github/copilot-cli">github/copilot-cli</a></summary>

# GitHub Copilot CLI Community Digest — 2026-11-17

## 1. Today's Highlights

A large batch of previously noisy issues was closed today (notably MCP and sandbox-related regressions), while several long-standing open items saw renewed activity. Two brand-new triage issues landed today (#5483, #5484), and issue #5483 highlights a subtle but impactful input-merging bug where multiple "immediate" messages collapse into a single malformed string. No pull requests were updated in the last 24 hours, so all forward progress today came from issue triage and closures.

## 2. Releases

- **v1.0.113-0** — "Fixes and changes" (release notes are terse; no detailed changelog provided).

No other releases in the last 24h.

## 3. Hot Issues

1. **[#4998 [CLOSED] Copilot CLI unusable after macOS update/reboot due to stale `.mcp-writer.binding`](https://github.com/github/copilot-cli/issues/4998)** — 12 comments, 11 👍. A high-impact bug where a stale filesystem device ID in `.mcp-writer.binding` bricked all sessions post-reboot. Closure is significant for macOS users; strong community upvote signal.
2. **[#5145 [OPEN] 400 `reasoning_text` must be passed back after runtime-synthesized assistant turn](https://github.com/github/copilot-cli/issues/5145)** — 9 comments. Blocks custom OpenAI-compatible providers (DeepSeek) using `wireApi: "responses"`. Ongoing and important for third-party model support.
3. **[#4905 [OPEN] Desktop app sessions die: "GitHub credential registration is no longer available"](https://github.com/github/copilot-cli/issues/4905)** — 7 comments, 4 👍. Auth/session/MCP cross-cutting failure that makes the github-mcp-server catalog stale and fatal.
4. **[#2881 [CLOSED] Autopilot infinite loop draining premium requests](https://github.com/github/copilot-cli/issues/2881)** — 5 comments. Long-standing cost-impacting bug now closed — meaningful for anyone relying on `/autopilot`.
5. **[#4041 [CLOSED] `web_fetch` fails on all URLs in IPv4-only sandboxes](https://github.com/github/copilot-cli/issues/4041)** — 3 comments. Networking/tools fix relevant to sandboxed CI-style environments.
6. **[#5220 [OPEN] 1-hour prompt cache TTL for Claude models](https://github.com/github/copilot-cli/issues/5220)** — 3 comments, **11 👍**. Strongly upvoted feature request; 5-minute TTL expires during normal interactive use.
7. **[#5359 [CLOSED] Resumed session 400 "Tool reference not found" after MCP tools change](https://github.com/github/copilot-cli/issues/5359)** — 3 comments. Session/MCP state desync now fixed.
8. **[#5177 [CLOSED] Regression: Manual Approval no longer prompts for repo-mutating Git commands](https://github.com/github/copilot-cli/issues/5177)** — 3 comments. Security-relevant permission regression tied to the October harness migration; closure is welcome.
9. **[#4901 [OPEN] Atlassian MCP OAuth fails: `redirect_uri is not registered`](https://github.com/github/copilot-cli/issues/4901)** — 3 comments. Recurring MCP OAuth blocker for enterprise users.
10. **[#5483 [OPEN] [triage] Immediate messages merge into one string ("no" + "drop phase 7" = "nodrop phase 7")](https://github.com/github/copilot-cli/issues/5483)** — New today. Subtle but high-risk correctness bug in `session.send` handling.

Also notable: **[#2378](https://github.com/github/copilot-cli/issues/2378)** (cancel queued messages) remains open with 7 👍.

## 4. Key PR Progress

No pull requests were updated in the last 24 hours (total: 0 items). No PR activity to report.

## 5. Hot Discussions

No discussion data was provided. Section omitted.

## 6. Feature Request Trends

Distilled from open issues:

- **Model/provider flexibility**: 1-hour prompt cache TTL for Claude (#5220), 1M token context for Claude (#2601), better custom OpenAI-compatible provider handling (#5145), and deferring MCP tools for org-managed GPT models (#5481).
- **Session & UI ergonomics**: Cancel queued messages without stopping the current operation (#2378), copy older assistant responses (#5484), archived chats view with Restore (#5482), and turning off "Task complete" summaries in autopilot (#5033).
- **Sandbox configuration control**: Exposing a Mach/XPC allowlist on macOS (#4881), fixing `allowLocalNetwork` behavior (#5390), and WSL sandbox support for VS Code Remote (#4546).
- **MCP/OAuth robustness**: Repeated requests to fix Atlassian (#4901), agentgateway + Entra ID (#4584), and Windows loopback port caching (#3973).
- **Managed settings reliability**: `forceRemoteSettingsRefresh` warning on session init (#5479).

## 7. Developer Pain Points

- **MCP + OAuth instability** dominates: multiple open issues across macOS, Windows, and enterprise IdPs (#4901, #4584, #3973, #4463). Users repeatedly hit re-auth loops and `redirect_uri`/issuer mismatches.
- **Sandbox configuration friction**: macOS local sandbox lacks a Mach/XPC allowlist (#4881); `allowLocalNetwork` doesn't actually allow loopback (#5390); WSL sandboxes break VS Code Remote (#4546). Gradle and 1Password CLI are concrete casualties.
- **Session state desync**: Resumed sessions break after MCP tool changes (#5359), config.json managed state is lost on concurrent session exit (#4900), and branch-type sessions flood the sidebar on every `git checkout` (#4903).
- **Cost/runaway behavior**: Autopilot infinite loops draining premium requests (#2881) and 5-minute Claude cache expiry forcing full re-sends (#5220) are recurring cost concerns.
- **Environment integrity**: Python venv interpreters are silently replaced with global Python (#5480), and Windows permission previews truncate critical path segments (#4701) — both create hard-to-debug trust and correctness issues.
- **Input handling correctness**: Immediate message concatenation (#5483) can silently corrupt user intent, a class of bug that undermines confidence in interactive use.

---
*Digest generated from github.com/github/copilot-cli data for 2026-11-17. All issue links point to the repository's issue tracker.*

</details>

<details>
<summary><strong>OpenCode</strong> — <a href="https://github.com/anomalyco/opencode">anomalyco/opencode</a></summary>

# OpenCode Community Digest — 2026-11-17

## Today's Highlights
The `opencode-pty` process daemon shipped v0.6.0 (protocol 9) to address the wave of zombie-process reports that dominated the weekend. Community attention remains split between free-tier quota confusion and the fallout from 2.3.0's always-background subagents change, while accessibility work moved forward with a screen reader mode PR closing a long-standing TUI request.

## Releases
- **[process-daemon-v0.6.0](https://github.com/anomalyco/opencode/releases)** — `opencode-pty` v0.6.0, protocol 9, published to npm as `@opencode/pty@0.6.0`. This lands directly on top of the zombie-child leak reports (#63817, #63976) filed against 2.3.0.

## Hot Issues
1. **[#59387 — Free tier mega-thread (OPEN, 385 comments)](https://github.com/anomalyco/opencode/issues/59387)** — The canonical reporting hub for free-tier failures: quota-not-resetting, "subscribe to Go" prompts, and desktop version mismatches. Comment volume makes it the de facto pulse of free-tier health.
2. **[#28696 — Plugin/Agent/Skills marketplace (CLOSED, 38 👍)](https://github.com/anomalyco/opencode/issues/28696)** — Master issue for a unified registry/discovery system, now closed as a planning artifact. Highest-upvoted item in the window and a clear signal of ecosystem direction.
3. **[#63817 — pty zombies on Linux (CLOSED, reproduced)](https://github.com/anomalyco/opencode/issues/63817)** — Confirmed regression from 2.2.7 → 2.3.0: finished shell commands never reaped. Closed alongside #63976, consistent with the v0.6.0 daemon release.
4. **[#63976 — Unbounded zombie growth under daemon PID (CLOSED, reproduced)](https://github.com/anomalyco/opencode/issues/63976)** — Companion report detailing monotonic zombie accumulation. Together with #63817 it defined the week's most impactful service-layer bug.
5. **[#64096 — Keep a blocking subagent call (CLOSED, 9 comments)](https://github.com/anomalyco/opencode/issues/64096)** — Users object to 2.3.0 making subagents always-background; request is to preserve foreground/blocking semantics. Active triage signals this is still contested.
6. **[#64073 — Restore foreground subagent execution (OPEN)](https://github.com/anomalyco/opencode/issues/64073)** — Duplicate-in-spirit of #64096, reinforcing that the background-subagent migration broke real workflows.
7. **[#39368 — Screen-reader-friendly TUI mode (OPEN)](https://github.com/anomalyco/opencode/issues/39368)** — NVDA/Ubuntu user details how banner, animations, footer, and alt-screen make the TUI unusable. Now has a matching PR (#64350).
8. **[#43039 — `--no-password` flag for `opencode2 serve` (OPEN, 35 👍)](https://github.com/anomalyco/opencode/issues/43039)** — High-upvote friction point: v2 serve enables auth by default where v1 did not, breaking local/devcontainer setups.
9. **[#62554 — One-off prompts break the cached prefix (OPEN, reproduced)](https://github.com/anomalyco/opencode/issues/62554)** — Goal reminders, keep-alives, and compaction prompts steal the cache breakpoint, degrading cache hit rates. A cost-relevant correctness bug.
10. **[#64304 — Free models wrongly require training consent (OPEN)](https://github.com/anomalyco/opencode/issues/64304)** — Four free models return HTTP 400 unless training consent is enabled, contradicting documented zero-retention. Trust/consistency issue worth watching.

## Key PR Progress
1. **[#64350 — feat(tui): screen reader mode](https://github.com/anomalyco/opencode/pull/64350)** — Opt-in plain-text mode on `opencode mini`; closes #39368. Accessibility milestone.
2. **[#64335 — feat(core): `shell` as the sole Code Mode shell tool](https://github.com/anomalyco/opencode/pull/64335)** — jlongster's alternative to #64319: removes `shell_status`/`shell_wait` under `full_codemode`, simplifying the tool surface.
3. **[#64347 — fix(codemode): accept plain string query in `search`](https://github.com/anomalyco/opencode/pull/64347)** — Fixes `InvalidToolInput` when models call `search("notes")` instead of the object form; a real model-ergonomics fix.
4. **[#64344 — fix(codemode): drop null result line before logs](https://github.com/anomalyco/opencode/pull/64344)** — Removes the meaningless `null` prefix from log-only `execute` programs.
5. **[#64353 — feat(app): `/cd` slash command for desktop](https://github.com/anomalyco/opencode/pull/64353)** — Brings TUI session-move parity to the desktop composer.
6. **[#64340 — fix(core): avoid WAL on Linux NFS databases](https://github.com/anomalyco/opencode/pull/64340)** — Narrowly scoped fix for NFS/WAL startup failures (#56282), building on #43141.
7. **[#63002 — feat(desktop): signed-in browser pane](https://github.com/anomalyco/opencode/pull/63002)** — Large feature: in-app browser with profile/sign-in import, previews, and agent safeguards.
8. **[#62146 — fix(core): pin npm cache generations during plugin use](https://github.com/anomalyco/opencode/pull/62146)** — Prevents `Npm.update` from pruning cache generations a live plugin instance depends on.
9. **[#64287 — fix(cli): show package id for TUI plugins](https://github.com/anomalyco/opencode/pull/64287)** — `opencode plugin list` no longer prints `-` for TUI-only plugins.
10. **[#64349 — fix(ci): github-hosted runner for v1 publishing](https://github.com/anomalyco/opencode/pull/64349)** — Follow-up to #63458; moves final npm publish to `ubuntu-24.04` for trusted publishing.

## Feature Request Trends
- **Marketplace & distribution**: the closed marketplace master issue (#28696) plus the ecosystem docs PR (#64348) point to a growing plugin registry push.
- **Session/agent ergonomics**: subagent execution semantics (#64096, #64073), session scratchpads (#64327), and pinned sessions with tabs (#60236).
- **Accessibility**: screen reader TUI mode (#39368 → PR #64350) and OAuth redirect prompt fixes (#63246).
- **Auth/serve flexibility**: `--no-password` for v2 serve (#43039) and Google/Antigravity OAuth (#28889).
- **MCP extensibility**: surfacing custom server→client notifications to sessions (#48855).

## Developer Pain Points
- **Free-tier opacity**: quota state is invisible until a 429 hits (#64334), reset behavior is unreliable (#59387), and consent gating on supposedly zero-retention models (#64304) erodes trust.
- **2.3.0 pty regressions**: zombie leaks (#63817, #63976), orphaned shells locking worktrees on Windows (#64317), and Ctrl+C not interrupting in the desktop terminal (#61899).
- **Caching efficiency**: one-off prompts breaking prefix caches (#62554) directly raises token costs.
- **v1→v2 compat**: silently ignored `permission` blocks (#64253) and default-on serve auth (#43039) disrupt existing setups.
- **Platform edges**: dot-directory file search on Windows (#46144), NUL-byte project IDs (#53991), and non-UTF-8 grep failures (#51912).

</details>

<details>
<summary><strong>Pi</strong> — <a href="https://github.com/earendil-works/pi">earendil-works/pi</a></summary>

# Pi Community Digest — 2026-11-17

## 1. Today's Highlights

No new releases in the last 24h, but the issue tracker is exceptionally active: a large batch of `petrroll` PRs landed fixing session-lifecycle and TUI correctness bugs (RPC duplicate `session_start`, Codex websocket reconnection, fullscreen render cost). Performance and concurrency remain the dominant themes, with two p0 issues — concurrent bash/read tool execution (#11950) and zstd-compressed Codex SSE 400s (#12060) — drawing sustained attention. Security-adjacent dependency work also progressed: the `undici` 8.12.3 → 8.12.4 pin bump (#12159/#12200) was resolved after a contribution-gate friction episode.

## 2. Releases

No new releases published in the last 24 hours.

## 3. Hot Issues

1. **#9549 — Fullscreen large-transcript re-render saturates a core** ([link](https://github.com/earendil-works/pi/issues/9549)) — On a 2-core Windows machine, every resize re-emits the entire transcript each frame. 18 comments and still `[inprogress]`; the most-discussed open performance bug, now partially addressed by PR #11968.
2. **#11950 — p0: bash and read run concurrently in one assistant message** ([link](https://github.com/earendil-works/pi/issues/11950)) — The model's read executes before its preceding bash finishes, yielding stale or missing files. High-severity correctness bug for agentic workflows; tagged `prio:p0`.
3. **#12060 — p0: zstd-compressed Codex SSE requests return 400** ([link](https://github.com/earendil-works/pi/issues/12060)) — Same request body passes uncompressed but fails compressed, breaking long `openai-codex` SSE sessions since ~Nov 9.
4. **#11527 — New `BedrockRuntimeClient` per request** ([link](https://github.com/earendil-works/pi/issues/11527)) — Every model call spins up a fresh client, credential provider, and HTTP/2 session; with SSO profiles this adds a `GetRoleCredentials` round trip per call. Clear, well-scoped perf fix.
5. **#10470 — RPC session replacement emits `session_start` twice** ([link](https://github.com/earendil-works/pi/issues/10470)) — Fixed via PR #12230; important for extension authors relying on lifecycle correctness.
6. **#12096 — `/login llama.cpp` connection store doesn't persist across sessions** ([link](https://github.com/earendil-works/pi/issues/12096)) — Local-model users must re-authenticate each session, contradicting documented behavior.
7. **#12248 — `pi update --models` skips providers registered by built-in extensions** ([link](https://github.com/earendil-works/pi/issues/12248)) — The refresh path builds a bare `ModelRuntime`, bypassing extension-registered catalogs. Filed and closed same day.
8. **#12225 — SSE readers release lock without cancelling response body** ([link](https://github.com/earendil-works/pi/issues/12225)) — Anthropic and Pi SSE paths leak/cancel incorrectly; a subtle streaming-correctness issue.
9. **#12224 — MCP SSE rescans incomplete large events on every chunk** ([link](https://github.com/earendil-works/pi/issues/12224)) — O(n²) string concatenation/rescan for large events delivered in many chunks.
10. **#12159 — Bump exact undici 8.12.3 pin (six advisories, one high)** ([link](https://github.com/earendil-works/pi/issues/12159)) — Security-relevant dependency pin; led to #12200's approval request after the contributor gate auto-closed the PR.

Also worth noting: **#11226** (codemode script fails when a top-level var is named `tools`) and **#11172** (split mouse-report escape timeout leaks into the prompt editor) — both quirky but well-reproduced bugs from the community.

## 4. Key PR Progress

1. **#12229 — Recover from Codex websocket 60-minute limit** ([link](https://github.com/earendil-works/pi/pull/12229)) — Closes #12124; reconnects mid-turn instead of only before the first event.
2. **#12230 — Emit `session_start` once on RPC session replacement** ([link](https://github.com/earendil-works/pi/pull/12230)) — Closes #10470; corrects duplicate lifecycle events for `new_session`/`switch_session`/`fork`/`clone`.
3. **#11968 — Make fullscreen scroll frames O(viewport)** ([link](https://github.com/earendil-works/pi/pull/11968)) — Directly addresses #9549's scroll path by caching `renderLayoutFrame` output.
4. **#12249 — Record `ttftMs` and `ttfaMs` on streamed assistant messages** ([link](https://github.com/earendil-works/pi/pull/12249)) — Extends existing `durationMs` telemetry with first-token and first-audio latency; useful for provider benchmarking.
5. **#11370 — Add DeepInfra, Nebius, Ollama Cloud, Scaleway, SiliconFlow, StepFun providers** ([link](https://github.com/earendil-works/pi/pull/11370)) — Large multi-provider addition curated from models.dev; stacked on #11369.
6. **#12246 — `/login` and `/logout` search selects best match** ([link](https://github.com/earendil-works/pi/pull/12246)) — Fixes Enter picking the wrong provider after scrolling + typing.
7. **#12231 — Emit `session_start` on reload after `bindExtensions({})`** ([link](https://github.com/earendil-works/pi/pull/12231)) — Extensions silently missed lifecycle events when a host used empty options.
8. **#12232 — Stream `session_start` events in JSON print mode** ([link](https://github.com/earendil-works/pi/pull/12232)) — Events emitted during `bindExtensions` were dropped before the JSON writer subscribed.
9. **#12115 / #12234 — Report session-replacement diagnostics and model fallback in every mode** ([link](https://github.com/earendil-works/pi/pull/12115), [link](https://github.com/earendil-works/pi/pull/12234)) — Fills gaps where fallback warnings were shown only in interactive mode.
10. **#12134 — Make `system` the default instruction role in openai-completions** ([link](https://github.com/earendil-works/pi/pull/12134)) — Fixes Groq/Qwen and similar backends rejecting the `developer` role.

## 5. Hot Discussions

**Ideas**
- **#8420 — Does Pi need an official Web UI base?** ([link](https://github.com/earendil-works/pi/discussions/8420)) — Compares the DSH plugin ecosystem (many UI plugins) with Pi's extension community (mostly non-UI), asking whether a shared Web UI foundation is missing. 3 👍, bilingual thread.
- **#11830 — How do you juggle two live conversations?** ([link](https://github.com/earendil-works/pi/discussions/11830)) — Each additional conversation costs a terminal tab; switching tears down the running session via `teardownCurrent()`. Points at multi-session UX as an unmet need.

**Show and tell**
- **#10069 — agent-chat: peer-to-peer messaging for independent Pi agents** ([link](https://github.com/earendil-works/pi/discussions/10069)) — Extension enabling coordinator-free coordination between Pi sessions sharing Docker containers, ports, and databases.

## 6. Feature Request Trends

- **Multi-session and concurrency UX**: juggling live conversations (#11830), background bash with exit notifications (#12223), and session reservation for external work (#12216) all point to users wanting richer concurrent-session primitives.
- **Provider breadth and portability**: PR #11370 adds six hosted providers; #12247 proposes Keln as built-in; #11071 asks for structured provider failure metadata (HTTP status, error code, retryability) surfacing through `AssistantMessage`.
- **Extension lifecycle and observability**: requests for a `user_bash_complete` event (#8530), faithful `session_start` emission (#12231, #12232), and diagnostics after session replacement (#12115) show extension authors need a more predictable event contract.
- **Structured telemetry**: TTFT/TTFA metrics (#12249) reflect growing appetite for latency instrumentation.
- **Official Web UI foundation**: discussion #8420 raised the question of whether Pi should ship a Web UI base rather than leaving UI to per-extension effort.

## 7. Developer Pain Points

- **Performance at scale**: large transcripts drive sustained CPU cost in fullscreen (#9549), the loading spinner (#9399), and MCP SSE parsing (#12224). Multiple independent reports suggest this is systemic rather than isolated.
- **Streaming robustness**: duplicate `session_start` events (#10470), SSE locks released without cancellation (#12225), the 60-minute Codex websocket ceiling (#12124), and zstd SSE 400s (#12060) form a cluster of transport-layer fragility.
- **Session state races**: prompts accepted during `switchSession` run on disposed sessions (#12243); RPC start hooks can block stdin attach (#8735). Hosts embedding Pi via RPC face ordering hazards.
- **Headless/print mode hangs**: `pi -p` fails to exit whenever extensions load (#12241) — a regression from 1.4.0 tracked as a follow-up.
- **Contribution friction**: the `undici` security bump (#12159) was auto-closed by the contributor gate, requiring a separate approval request (#12200) — a process pain point for external contributors.
- **Dependency hygiene**: six undici advisories pinned in `latest` is a reminder that exact-pin dependencies need active maintenance.

*Source: github.com/earendil-works/pi — generated 2026-11-17.*

</details>

<details>
<summary><strong>Qwen Code</strong> — <a href="https://github.com/QwenLM/qwen-code">QwenLM/qwen-code</a></summary>

# Qwen Code Community Digest — 2026-11-17

## 1. Today's Highlights

The v0.27.4 nightly line continues to iterate, headlined by a Web Shell sidebar workspace filter and a new DingTalk managed-agent adapter. Meanwhile, the 1.0 Preview effort is in full swing: issue #17045 tracks landing the event-driven agent loop kernel on `main` one surface at a time, with a freeze date of 2026-11-21. CI stability remains the dominant operational theme, with multiple long-running flaky-test and main-CI-failure issues still absorbing maintainer attention.

## 2. Releases

**v0.27.4-nightly.20261116.eb3a599ef3** (nightly)
- `feat(web-shell)`: Added a sidebar workspace filter (PR #17244, @callmeYe).
- `feat(managed-agent)`: Added the DingTalk adapter.

No stable release in the last 24h; this is a nightly cut. The DingTalk adapter is notable as it expands the managed-channel surface beyond email, aligning with the broader channels roadmap.

## 3. Hot Issues

1. **#14724 — Main CI failed: Managed Agent gate** ([link](https://github.com/QwenLM/qwen-code/issues/14724)) — Open since 2026-10-19 with **413 comments**, the highest-traffic issue in the tracker. A persistent CI gate failure with no test identified; the sheer comment volume signals a long-running triage struggle.

2. **#17045 — tracking(core): land the 1.0 Preview loop kernel on main** ([link](https://github.com/QwenLM/qwen-code/issues/17045)) — The centerpiece of the 1.0 migration. Tracks landing the event-driven `query()` kernel incrementally across surfaces with switchbacks. P1 and explicitly time-boxed (freeze 2026-11-21), so it is the single most consequential open work item.

3. **#17258 — Subscription models: output cap vs. fixed thinking_budget** ([link](https://github.com/QwenLM/qwen-code/issues/17258)) — `max_completion_tokens [4000] must be greater than thinking_budget [16384]`. A P1 bug blocking long-context subscription users (qwen4.0-max-preview, ~230k tokens). Highlights a real conflict between window budgeting and reasoning budgets.

4. **#17467 — managed-config_install missing from Session Store reference traversal** ([link](https://github.com/QwenLM/qwen-code/issues/17467)) — P1 correctness bug: `collectNestedResourceRefs` returns `[]`, so a commit drops its dependency closure (bundle, root snapshot, acks). Serious data-integrity implication for managed sessions.

5. **#17350 — Windows: run_shell_command output padded to terminal width** ([link](https://github.com/QwenLM/qwen-code/issues/17350)) — Regression since v0.24.0: 26–34% of shell output sent to the model is trailing whitespace. Wastes tokens and pollutes context; a clean, high-signal bug report with a clear repro.

6. **#13078 — Daily dependency CVE audit failed** ([link](https://github.com/QwenLM/qwen-code/issues/13078)) — 54 comments; a scheduled security audit stuck failing, possibly due to npm audit endpoint availability. Persistent security-hygiene noise.

7. **#11680 — Main CI failed: E2E Tests** ([link](https://github.com/QwenLM/qwen-code/issues/11680)) — 63 comments since September; docker-sandbox E2E shard failures. Representative of the CI-reliability backlog.

8. **#17038 — CLI stuck in login verification on headless Linux** ([link](https://github.com/QwenLM/qwen-code/issues/17038)) — Closed, but a notable OAuth/headless UX failure: browser-based login on another machine never resumes in the CLI. Affects CI and server environments.

9. **#17237 — Web Shell worktree Codex parity: retention + snapshots (P6) and configurable root (P7)** ([link](https://github.com/QwenLM/qwen-code/issues/17237)) — Tracks the remaining phases after PR #17228 delivered P1–P5. Shows a deliberate, phased parity program against Codex worktree behavior.

10. **#17483 / #17366 — deflake: Web Shell E2E specs** ([#17483](https://github.com/QwenLM/qwen-code/issues/17483), [#17366](https://github.com/QwenLM/qwen-code/issues/17366)) — CI Failure Patrol auto-filed flaky-test issues; the guidance explicitly warns not to "stabilize" deterministically failing tests. Reflects a maturing, bot-driven test-health workflow.

## 4. Key PR Progress

1. **#17477 — fix(core): deliver background async hook output to the model** ([link](https://github.com/QwenLM/qwen-code/pull/17477)) — Fixes capability-ledger defect L11: async hook output accumulated in the registry but never reached the model via `getPendingAsyncOutput()`. Meaningful for automation/hook users.

2. **#17513 — feat: add qwen4-max support with native effort ladder, cache TTL, image detail** ([link](https://github.com/QwenLM/qwen-code/pull/17513)) — First-class support for the new flagship across all four channels (ModelStudio, Token Plan, QwenCloud, Qwen Subscription), including effort ladder and cache TTL.

3. **#17511 — feat(channels): add GitHub as the third managed channel adapter** ([link](https://github.com/QwenLM/qwen-code/pull/17511)) — Polls bot notifications and admits @mention comments on issues/PRs into control-plane sessions. Extends the managed-channel strategy to GitHub.

4. **#17502 — fix(serve): reserve listener headroom from SSE and reap stalled writers** ([link](https://github.com/QwenLM/qwen-code/pull/17502)) — Adds `--max-sse-connections` (default 80% of listener cap) and default reaping of stalled SSE writers. Hardens the `qwen serve` fleet against connection exhaustion.

5. **#17514 — fix(web-shell): scope change overview commit fallback to session start commit** ([link](https://github.com/QwenLM/qwen-code/pull/17514)) — Retires display residuals from #17378; narrows the fallback window to the session's immutable start commit.

6. **#17509 — refactor(managed-agent): replace regex DDL catalog parsing with a tokenizing parser** ([link](https://github.com/QwenLM/qwen-code/pull/17509)) — Swaps indentation-sensitive regex parsing for a quote/comment/paren-aware tokenizer. Improves schema-validation robustness.

7. **#17480 — fix(managed-agent): resolve shared workspace owners for extension control** ([link](https://github.com/QwenLM/qwen-code/pull/17480)) — Makes extension metadata control work on shared workspace-isolated runtime bindings (addresses #17135). Closed quickly.

8. **#17471 — feat(managed-agent): unify unbound Session authority under the ownership row** ([link](https://github.com/QwenLM/qwen-code/pull/17471)) — Split from #16023; migrates unbound-session principal ownership. An authorization-model consolidation.

9. **#17398 — feat(web-shell): explain background tasks from composer chips** ([link](https://github.com/QwenLM/qwen-code/pull/17398)) — Adds a "?" affordance to background-task chips that asks the model to explain the task and streams the answer inline. Nice UX increment.

10. **#17460 — docs(design): unified chat surface for daemon and managed sessions** ([link](https://github.com/QwenLM/qwen-code/pull/17460)) — Bilingual design proposal to collapse three parallel chat orchestrations into one shared surface. Architecturally significant if adopted.

## 5. Hot Discussions

No GitHub Discussions data was provided for this period.

## 6. Feature Request Trends

- **Agent loop / session management (1.x roadmap):** #17045 and its follow-up #17284 dominate. The direction is a single event-driven kernel with incremental surface migration, plus a formal backlog of what the freeze leaves out.
- **Managed channels & integrations:** Rapid expansion — DingTalk (released), GitHub (#17511), QQ outbound media (#15450, #17167), and a generic outbound webhook destination (#17374). "Channels" is becoming a first-class extensibility axis.
- **Web Shell intelligence & worktree parity:** Stateful/interactive UI (#14019) and Codex-parity worktrees (P6/P7, #17237) show sustained investment in the browser surface.
- **Web search / MCP ecosystem:** #16204 requests listing Keenable as a keyless MCP web-search option, extending the MCP discovery surface.
- **Configuration & integration ergonomics:** e.g., generic webhook destinations and configurable worktree roots.

## 7. Developer Pain Points

- **CI reliability is the dominant frustration.** The top issues by comment count are all main-CI or flaky-test failures (#14724, #11680, #11678, #16091, #14104). Volume is high enough that automated bots now file and track these, and maintainers explicitly warn against papering over deterministic failures as "flakes."
- **Managed-agent edge cases:** A cluster of P1/P2 bugs from @yiliang114 around provisioning races (`hosted_harness_unavailable` #17380), stuck `RECOVERY_BLOCKED` sessions with no user recovery path (#17383), missing resource-closure tracking (#17467), and hook metadata rejection (#17381). These point to hardening needs in the managed runtime lifecycle.
- **Windows-specific regressions:** Output padding to terminal width (#17350) and settings/extensions bootstrap watch roots (#17491) indicate Windows path and ConPTY handling remains a rough edge.
- **Token/context efficiency:** Whitespace padding (#17350) and thinking-budget conflicts (#17258) both directly waste tokens or block valid configurations.
- **Auth/headless UX:** Browser-based OAuth that never resumes in headless environments (#17038) is a recurring friction point for CI and server deployments.
- **Review/merge latency:** Multiple issues (#17077, #17167) document merge-ready PRs stalled on approvals for 72h+, suggesting a maintainer-bandwidth bottleneck in the channels area.

---
*Generated from github.com/QwenLM/qwen-code data for 2026-11-17. Links point to the upstream repository.*

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*