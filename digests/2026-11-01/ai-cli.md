# AI CLI Tools Community Digest 2026-11-01

> Generated: 2026-11-01 00:02 UTC | Tools covered: 7

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

# Cross-Tool Comparison Report: AI CLI Ecosystem

**Date:** 2026-11-01
**Scope:** Claude Code, OpenAI Codex, Gemini CLI, GitHub Copilot CLI, OpenCode, Pi, Qwen Code
**Generated from:** 2026-11-01 community digests

---

## 1. Ecosystem Overview

The AI CLI tooling landscape has entered a **reliability-and-governance phase**: after a year of capability expansion, the dominant community signals on 2026-11-01 are about *cost transparency, agent isolation correctness, silent config overrides, and platform-specific fragility* — not raw model capability. Every repo shows meaningful focus on **subagent/agent runtime semantics** (isolation, attribution, lifecycle) and **session durability** (compaction, resume, rollover), indicating the market has commoditized the "agent loop" and is now competing on operational trust. Enterprise spend governance is maturing fastest at the vendor layer (see Claude Code's pooled group budgets), while cross-vendor interoperability is emerging bottom-up via community projects (Codex's `recall`, `toli`; Pi's Rust port study). Windows remains the single most consistently painful platform across *all* repos with desktop/TUI components, suggesting a shared, structural deficiency in the ecosystem's terminal and shell integration strategy. No repo shipped a headline release today; today's activity was dominated by backlog cleanup, CI triage, and correctness patches — a maintenance-shaped day.

---

## 2. Activity Comparison

| Tool | Issues (updated 24h) | PRs (updated 24h) | Discussions | Release Status | Notes |
|---|---|---|---|---|---|
| **Claude Code** | ~10+ (cost/usage cluster dominant) | 3 (all **CLOSED, not merged**, dated 2026-03-10) | N/A (not provided) | **v2.1.316** — kill switch + pooled budgets | Backlog cleanup pattern; stale-bot closures flagged |
| **OpenAI Codex** | 10 (Windows + token-burn cluster) | 1 (CLOSED, copyberry bot) | **Active** — 2 Ideas, 3 Q&A, 5 Show & tell | None | Discussions are a first-class channel here |
| **Gemini CLI** | 10 (agent reliability dominant) | **31 PRs** (10 highlighted; 3 CLOSED including ripgrep/ACP fixes) | N/A (not provided) | **v0.67.0-nightly.20261031** | Highest PR velocity of the set |
| **GitHub Copilot CLI** | **31 (most of any repo)** | 1 (CI fix) | N/A (not provided) | **v1.0.106-1** — `apply_patch` line endings, GHES host | Extremely high issue inflow; low PR throughput |
| **OpenCode** | 10 highlighted (167-comment megathread) | **~10** (heavy `@opencode/ai` refactor batch) | N/A (issue-centric) | None | Free-tier megaissue skews the count |
| **Pi** | 10 highlighted | ~9 (docs + TUI fixes; #11642 is flagship) | 1 Show & tell (Rust study) | None | Concentrated on Windows/ConPTY fix family |
| **Qwen Code** | 10 highlighted; **CI-failure-dominated** | **10** (eds , Windows, LSP, Web Shell) | N/A (not provided) | None | CI health is dominant theme |

**Reading notes:**
- **N/A cells** indicate the source digest did not supply data — *not* that the channel is disabled. Only Codex and Pi explicitly surfaced Discussions content today.
- **"Highlighted" counts** reflect what each digest chose to report; raw issue volume is generally higher (Copilot CLI explicitly reports 31).
- **Release cadence** today was dominated by patches/nightlies. Only Claude Code, Gemini CLI (nightly), and Copilot CLI shipped anything.

---

## 3. Shared Feature Directions

The strongest cross-cutting demands, with tool attribution:

### 3.1 Agent/subagent observability & runtime integrity *(all repos with agent systems)*
- **Claude Code:** worktree isolation leaks (#88950, #90668), phantom `agent_id` in hook events (#90662), missing subagent model display (#89133).
- **Gemini CLI:** false GOAL/success signals (#22323, #21983), subagent trajectory sharing (#22598), context attachment to bug reports (#21763).
- **OpenCode:** `sessionID` truncation breaking subagent resume (#59293, #60493).
- **Copilot CLI:** context rollover failures (#5312), autopilot overriding decision-requiring skills (#5276).
- **Pi:** summary replay leaking abandoned responses (#11602), tool identity lost in compaction (#11640).
- **Need:** deterministic, inspectable agent runtime with accurate event attribution and honest termination signals.

### 3.2 Cost/usage transparency & spend controls
- **Claude Code:** pooled group budgets (released), plus a *large* regression cluster (#103437, #87419) — usage accelerating without plan change.
- **OpenAI Codex:** token burn from background polling re-sending full history (#13733, 47 👍); quota confusion (#58098, #55507).
- **OpenCode:** free-tier gating megathread (#59387, 167 comments) — limits not resetting.
- **Copilot CLI:** rollover / CAPI 5MB blowout from stored binaries (#4097).
- **Need:** auditable, reconcilable accounting — users want to *see* what they spent and *why*.

### 3.3 Configuration as source of truth *(silent override theme)*
- **Claude Code:** `switchModelsOnFlag:false` ignored (#98875).
- **Gemini CLI:** `settings.json` overrides dropped for Browser Agent (#22267), `contextManagement` threshold reverted silently (#30068).
- **Pi:** pinned Git SHA change silently ignored (#10758); glob separators silently returning nothing (#9262).
- **Copilot CLI:** `--available-tools ""` exposing *all* tools (#5306); undocumented `DYNAMIC_AUTO_TIERS` needed for `--model fusion` (#5298).
- **Need:** explicit user settings must win, or fail loudly.

### 3.4 Cross-vendor interoperability & memory portability
- **OpenAI Codex Discussions:** `recall` (#58220) exposes Claude Code memories to Codex; `toli` (#57591) lets Codex and Claude Code collaborate across machines.
- **Pi:** Rust runtime study claiming 186/186 behavioral atoms identical to upstream — fidelity-preservation as a design goal.
- **Need:** shared memory, credential isolation (Bossanova #58492), and multi-agent coordination in a single repo.

### 3.5 Windows / ConPTY / platform parity *(the most universal pain)*
- **Claude Code:** Windows sidebar regression (#105245), installer re-download loop (#106436).
- **OpenAI Codex:** *cluster* — browser toggle (#54989), taskbar conflicts (#45369), routing timeouts (#50923), 63MB/request (#54668).
- **Pi:** the largest single cluster — ConPTY color leak family (#10256 and 4 duplicates), `pi update` breakage (#11597), 94-comment "how do you use Pi on Windows" (#7547).
- **Qwen Code:** locked `node.exe` breaking updates (#15276), script incompatibilities (#15034).
- **OpenCode:** v2 startup hangs and freezes (#41746, #41477).
- **Copilot CLI:** PowerShell generation failures (#5302), OpenWith dialog spam (#5299).
- **Need:** a coherent Windows story — terminals, updates, locks, and shell integration treated as first-class.

### 3.6 Safety-classifier precision & user-agency over safeguards
- **Claude Code:** `[cyber]`/`[bio]` false positives blocking legitimate security and IT work (#90680, #98875); Claude Browser cannot be disabled (#93317).
- **Copilot CLI:** ACP auto-approving tool calls (a regression of #845) (#4537).
- **Codex:** auto-review loops that don't durably honor explicit user approval (#36501, #54685).
- **Gemini CLI:** model reaches for `git reset --force` when safer alternatives exist (#22672).
- **Need:** graduated permissions, double-confirmation for wide scope, and *recoverable* false positives.

### 3.7 Persistent, file-based session & task state
- **Gemini CLI:** persistent task files replacing in-context WriteToDo (#18836, #21000); `contextManagement` threshold forwarding (#30068).
- **OpenCode:** compaction summary retry (#60947), cache-TTL-aware session warming (#60969).
- **Copilot CLI:** durable repository-level permission sets (#5297), session rename persistence (#2622).
- **Need:** context engineering that survives compaction, rollover, and cross-machine migration.

---

## 4. Differentiation Analysis

| Dimension | Claude Code | OpenAI Codex | Gemini CLI | Copilot CLI | OpenCode | Pi | Qwen Code |
|---|---|---|---|---|---|---|---|
| **Primary target** | Enterprise / regulated orgs; Claude Max users | ChatGPT + Codex Desktop power users; mobile/remote | Google Cloud / Gemini 3 developers; ACP-capable editors | GitHub Enterprise + GHES teams; VS Code ecosystem | Self-hosters + free-tier plugin developers | Terminal-first OSS CLI purists (Unix/Windows) | Qwen/LM ecosystem, Web Shell + managed-agent hosts |
| **Technical approach** | Hook/plugin system; gateway-level spend governance | App-server + ACP; heavy desktop UX focus | ACP + AST-aware code intelligence; subagent-first architecture | ACP; deep VS Code/GHES integration; policy fail-closed defaults | Multi-provider abstraction (`@opencode/ai`); Desktop + CLI | ConPTY-aware TUI; durable JSONL sessions; embeddable runtime | Managed-agent daemon; user-scope Skill routes; LSP-first |
| **Signature strength today** | Enterprise spend controls (pooled budgets) | Discussion ecosystem + memory reuse (`recall`) | PR velocity + AST-aware roadmap | Feature-request breadth + permission standardization | Provider-agnostic abstractions; observability tracing | ConPTY fix #11642; docs-driven terminal guidance | Windows script compat; managed-agent primitives |
| **Signature weakness today** | Cost regressions + stale-bot closures | Token waste in polling; Windows desktop | Misleading agent success signals | ACP permission regression; low PR throughput | Free-tier gating; v2 instability | Windows TUI fragility | CI reliability dominating signal |
| **Release discipline** | Frequent patches | Sparse releases; Discussions-heavy | Nightly cadence, high merge throughput | Patch releases | No release today; refactor-heavy | Docs-heavy; conservative fixes | No release; CI-blocked |
| **Distribution model** | Vendor-owned, closed-loop | Vendor-owned | Vendor-owned, nightly OSS cadence | Vendor-owned, GHES-integrated | OSS, multi-model | OSS, unix-philosophy | OSS, Qwen-aligned |

**Key structural observation:** the repos split into two camps. **Vendor-controlled** (Claude Code, Codex, Copilot CLI, Gemini CLI) tend to ship enforcement/governance features top-down but accumulate stale, high-repro community issues that maintainers can't keep up with. **Community/OSS** (OpenCode, Pi, Qwen Code) surface fragility *earlier* and more loudly, with faster triage loops but higher variance in release quality. Codex is the outlier — vendor-owned but notably discussion-driven, with a product-direction thread (#12567 Memories) that behaves like an OSS roadmap debate.

---

## 5. Community Momentum & Maturity

### Momentum leaders (24h)
1. **Gemini CLI** — **31 PRs updated**, nightly release, and a coherent product-roadmap cluster (AST-aware, persistent tasks, subagent observability). Highest merge velocity and clearest technical direction.
2. **OpenCode** — **~10 substantive PRs**, mostly `@opencode/ai` architectural refactors (unified transport, structured errors, name-keyed decisions). Classic pre-1.0 consolidation behavior.
3. **Qwen Code** — **10 PRs** across Windows, LSP, Web Shell; but **CI health dominates issue traffic** (5 of top-10 issues are CI failures). Momentum is real but partially absorbed by infrastructure debt.

### Maturity signals (trust through reliability, not velocity)
- **Claude Code is the most *mature enterprise artifact***: it shipped governance primitives (pooled budgets, kill switches) that no peer has. But its stale-bot closures of high-repro bugs (#88950, #90668, #90680) are a *negative* maturity signal — invested contributor effort is being discarded, which will degrade future report quality.
- **OpenAI Codex has the healthiest discussion-to-issue ratio** — Ideas/Q&A/Show-and-tell are active, product direction is debated publicly. This is unusual for a vendor repo and correlates with a more constructive community.
- **Copilot CLI has the *highest issue velocity with the lowest PR throughput*** — 31 issues, 1 PR. That is a classic "large user base outpaces a small maintainer team" signature, and it portends growing triage debt.
- **Pi is the most *engineered* OSS entry** — its ConPTY analysis (#11642), terminal guidance docs (#11644, #11647), and behavior-fidelity Rust study define a level of rigor uncommon in the space. Its 94-comment "how do you use Pi on Windows" (#7547) thread reads like community roadmap formation, not complaint volume.

### Rapid iterations vs. reliability:
- **Rapid iteration:** Gemini CLI, OpenCode, Qwen Code.
- **Reliability debt:** Claude Code (cost regressions), Copilot CLI (permission regressions), Codex (Windows desktop), OpenCode (free-tier + v2 line), Pi (Windows TUI).

### Platform asymmetry
Windows pain appears in **6 of 7 repos** and is *the* unifying negative theme. If any vendor solves Windows terminal/shell robustness end-to-end, it becomes a differentiator overnight.

---

## 6. Trend Signals

### For technical decision-makers

1. **Spend governance is now a purchasing requirement, not a nice-to-have.** Claude Code's pooled group budgets, Codex's token-waste megathread, and OpenCode's 167-comment free-tier issue show that *cost predictability under agentic loops* is the #1 blocker to enterprise adoption. Expect RFPs to include per-group budget APIs, poll-cost telemetry, and per-turn spend attribution by mid-2027.

2. **Agent isolation and event attribution are the new correctness frontier.** Worktree leaks (Claude Code), `sessionID` truncation (OpenCode), phantom `agent_id`s (Claude Code), and false GOAL signals (Gemini) collectively indicate no vendor has fully solved *safe parallel agent execution*. Anyone building policy or observability tooling on top of these primitives should assume the substrate is not yet stable.

3. **Silent config overrides are an emerging trust category.** Across Claude Code, Gemini CLI, Pi, and Copilot CLI, user settings are being silently discarded. Users increasingly treat *explicit config honored with a loud failure on conflict* as a baseline expectation, not a feature.

4. **Cross-vendor interoperability is happening bottom-up, not top-down.** `recall`, `toli`, Bossanova, and the ACP protocol show developers stitching together multi-agent workflows on their own. Vendors that ship first-class MCP/ACP bridges and memory export will capture the integration layer before the standards bodies do.

5. **Windows terminal fragility is a systemic, unsolved problem.** ConPTY color leaks, shell locks, and update-path breakage appear in nearly every repo. This is a market gap for a vendored, cross-tool terminal abstraction — or for whichever vendor invests in becoming *the* first-class Windows agent CLI.

### For developers building on these tools

- **Pin your versions and guard against perf regressions.** OpenCode's 50–100× slowdown (#60050), Copilot CLI's ACP permission regression (#4537), and Gemini's discarded `contextManagement` threshold (#30068) all shipped between minor versions. Regression test suites for cost, latency, and permission behavior are now table stakes.
- **Prefer ACP + MCP composability over vendor lock-in.** Gemini's ACP steering PR (#29901), Qwen's Web Shell mount API (#15928), and Codex/Pi Discussions all point to a protocol-first integration future. Tools that expose clean ACP surfaces will survive vendor churn.
- **Instrument session durability deliberately.** Compaction, rollover, and resume are the *least* reliable parts of every stack (Copilot rollover #5312, OpenCode compaction #60947, Pi branch summaries #11602). Design workflows to checkpoint at boundaries you control, not at vendor-defined ones.
- **Budget for Windows support as a distinct workstream.** If your team includes Windows developers, plan for terminal-negotiation, shell-locking, and update-path issues as ongoing — not one-time — costs.

---

*Report compiled from 2026-11-01 community digests across the seven repos listed. Counts marked "highlighted" reflect digest curation; raw volume may be higher. N/A reflects missing source data, not disabled channels.*

---

## Per-Tool Reports

<details>
<summary><strong>Claude Code</strong> — <a href="https://github.com/anthropics/claude-code">anthropics/claude-code</a></summary>

## Claude Code Skills Highlights

> Source: [anthropics/skills](https://github.com/anthropics/skills)

# Claude Code Skills Community Highlights Report
*Data source: github.com/anthropics/skills | As of 2026-11-01*

---

## 1. Top Skills Ranking

> Note: The provided PR data shows `Comments: undefined` for all pull requests, so ranking below is based on composite attention signals (update recency, issue cross-references, review activity, and contributor reputation).

| Rank | Skill / PR | Functionality | Discussion Highlights | Status |
|------|-----------|---------------|----------------------|--------|
| 1 | **mcp-builder fix** — [PR #1742](https://github.com/anthropics/skills/pull/1742) | Fixes `streamablehttp_client` → `streamable_http_client` rename and custom-header configuration for `mcp>=2.0.0` | Ties directly to issue [#1390](https://github.com/anthropics/skills/issues/1390) (evaluation harness scores 0/N against real MCP servers); high community scrutiny because MCP is the hottest integration surface | Open |
| 2 | **skill-creator fixes** — [PR #1298](https://github.com/anthropics/skills/pull/1298), [#1681](https://github.com/anthropics/skills/pull/1681), [#1997](https://github.com/anthropics/skills/pull/1997) | Three separate PRs: trigger-eval isolation + Windows support; direct execution of `package_skill.py`; correct YAML frontmatter parsing | The meta-tool for building Skills attracts the most fix traffic — false-miss evals, cross-platform breakage, and metadata drift are recurring pain points (see issue [#202](https://github.com/anthropics/skills/issues/202), [#556](https://github.com/anthropics/skills/issues/556)) | All Open |
| 3 | **proofcore-contract-auditor** — [PR #1771](https://github.com/anthropics/skills/pull/1771) | Static analysis of Solidity/Rust contracts with Merkle-proof notarization anchored to TON Blockchain | Novel Web3/audit vertical; vendor-authored (ProofCore-Protocol), raising namespace-trust questions flagged in issue [#492](https://github.com/anthropics/skills/issues/492) | Open (draft-stage) |
| 4 | **notion-spec-to-implementation + quantitative-resume-auditor** — [PR #1245](https://github.com/anthropics/skills/pull/1245) | Converts Notion specs into executable tasks with acceptance criteria; audits résumés quantitatively | Bundled two-skill submission; active through mid-October; representative of "spec → execution" workflow demand | Open |
| 5 | **md2video-audio** — [PR #1703](https://github.com/anthropics/skills/pull/1703) | Compiles Markdown → Marp slides → narrated MP4 with zero-cost TTS | Content-generation pipeline; notable for zero-cost positioning and multimodal output | Open |
| 6 | **webapp-testing hardening** — [PR #1980](https://github.com/anthropics/skills/pull/1980), [#1976](https://github.com/anthropics/skills/pull/1976) | Removes `shell=True` command-injection risk (CWE-78); fixes element discovery for textarea/select | Security + correctness fixes to an official skill; pairs with issue [#1891](https://github.com/anthropics/skills/issues/1891) | Open |
| 7 | **pyxel** — [PR #525](https://github.com/anthropics/skills/pull/525) | Retro game development in Python — implementation, headless input-driven runs, frame inspection | Longest-running active PR (since March 2026, updated October); demonstrates sustained community persistence | Open |
| 8 | **document-typography** — [PR #514](https://github.com/anthropics/skills/pull/514) | Typographic QC: orphan word wrap, widow paragraphs, numbering alignment | Quality-of-output niche applicable to every generated document; steady review activity | Open |

**Observation:** Every top PR is still **Open** — zero merges among the 20 most-active PRs. The review backlog is the ecosystem's defining bottleneck.

---

## 2. Community Demand Trends

Distilled from Issues activity:

1. **Trust & namespace governance** — Issue [#492](https://github.com/anthropics/skills/issues/492) (46 comments, the most-discussed issue) demands clear separation between official and community Skills. This is a *platform-level* demand, not a Skill request.
2. **Org-wide skill distribution** — Issue [#228](https://github.com/anthropics/skills/issues/228) (17 comments, 8 👍): users want shareable skill libraries inside Claude.ai instead of manual `.skill` file passing.
3. **Quality-gate / self-verification workflows** — Issue [#1385](https://github.com/anthropics/skills/issues/1385): pre-task calibration → adversarial review → delivery verification; plus Issue [#412](https://github.com/anthropics/skills/issues/412) (agent-governance: policy enforcement, audit trails). Demand is shifting from *capability* Skills to *reliability* Skills.
4. **Agent state & memory compression** — Issue [#1329](https://github.com/anthropics/skills/issues/1329): symbolic notation to keep long-running agent memory compact.
5. **Testing/eval infrastructure** — Issues [#556](https://github.com/anthropics/skills/issues/556) and [#1390](https://github.com/anthropics/skills/issues/1390): the community is loudly reporting that skill *triggering and evaluation* is broken, indicating demand for a trustworthy eval harness more than new Skills.
6. **Correctness of description metadata** — Issue [#2064](https://github.com/anthropics/skills/issues/2064): descriptions must state *when to use* a skill, not just what it does.

---

## 3. High-Potential Pending Skills

Active-comment or recently-updated PRs with strong landing odds:

- **[PR #1742](https://github.com/anthropics/skills/pull/1742)** — mcp-builder `mcp>=2` compatibility. High-impact bug fix with a linked issue; most likely near-term merge.
- **[PR #1997](https://github.com/anthropics/skills/pull/1997)** — YAML frontmatter parsing in skill-creator. Narrow, well-scoped, fixes demonstrated metadata corruption.
- **[PR #1980](https://github.com/anthropics/skills/pull/1980)** — removes `shell=True` (CWE-78) in webapp-testing. Security fixes typically get fast-tracked.
- **[PR #1977](https://github.com/anthropics/skills/pull/1977) / [#1976](https://github.com/anthropics/skills/pull/1976) / [#1975](https://github.com/anthropics/skills/pull/1975)** — a trio of small correctness fixes from one contributor (algorithmic-art wrapAround, element discovery, thumbnail `--cols` validation); low-risk, high-merge-probability batch.
- **[PR #1792](https://github.com/anthropics/skills/pull/1792)** — docx: report LibreOffice timeout as error + verify output. Correctness fix aligned with issue [#2018](https://github.com/anthropics/skills/issues/2018) (invalid XML from `merge_runs.py`).
- **[PR #1730](https://github.com/anthropics/skills/pull/1730)** — replaces 3 dead documentation URLs (HTTP 200 verified). Trivial, safe.
- **[PR #1245](https://github.com/anthropics/skills/pull/1245)** — notion-spec-to-implementation + quantitative-resume-auditor. Highest-concept new-Skill submission still active in October; needs maintainer design review.
- **[PR #525](https://github.com/anthropics/skills/pull/525)** — pyxel. Sustained 8-month activity signals serious intent; niche but complete.

---

## 4. Skills Ecosystem Insight

**The community's most concentrated demand is not for more Skills but for a trustworthy, secure, and mergeable Skills pipeline — namespace integrity, working eval/trigger tooling, and cross-platform correctness fixes dominate attention far more than any single new capability Skill.**

---

# Claude Code Community Digest — 2026-11-01

## 1. Today's Highlights

A new patch (v2.1.316) ships a kill switch for the `ultrathink` keyword and introduces pooled group budgets for the Claude apps gateway — a signal that enterprise spend governance is maturing. Meanwhile, the issue tracker is dominated by a surge of `area:cost` bug reports describing sudden, large jumps in Max-plan usage consumption since mid-October. A batch of long-stale plugin/hook PRs were also closed out, suggesting maintainers are clearing backlog rather than merging new functionality.

## 2. Releases

**v2.1.316**
- Added `CLAUDE_CODE_DISABLE_ULTRATHINK` env var, which disables the `ultrathink` keyword — useful for teams standardizing prompting conventions or limiting reasoning-token spend.
- Added **pooled group budgets** to the Claude apps gateway: a shared monthly budget for a group of members, layered on top of each member's individual limit, configured via `pooled_budget` on the spend-limits admin API. Directly relevant to orgs that previously had to manage per-seat limits manually.

## 3. Hot Issues

1. **[#103437](https://github.com/anthropics/claude-code/issues/103437)** — *Sudden massive increase in Claude Code usage consumption on Max 5x since mid-October 2026.* The top open issue today; the "usage got worse and nobody said why" pattern predictably drives strong engagement (9 comments). Worth watching as a potential regression or pricing-model change.
2. **[#87419](https://github.com/anthropics/claude-code/issues/87419)** — *Weekly + Fable scoped meters deplete 1.7–5x faster; OAuth token carried `rateLimitTier` default_claude_max_5x.* A well-scoped, has-repro report linking entitlement metadata to billing behavior. Closed, but the underlying tier-token mismatch makes it a credible companion to #103437.
3. **[#105245](https://github.com/anthropics/claude-code/issues/105245)** — *Desktop Code tab sidebar no longer shows session status (working/waiting/done) on Windows.* A small UI regression with outsized workflow impact — users can't tell if an agent is stuck. 3 👍 in five days signals broad agreement.
4. **[#98875](https://github.com/anthropics/claude-code/issues/98875)** — *Safety-classifier fallback silently switches whole session to Opus 4.8; `switchModelsOnFlag:false` is ignored.* The most consequential correctness issue in the set: an explicit user configuration is overridden without notice. Relevant to anyone doing legitimate-but-flagged work (IT admin, security testing).
5. **[#90680](https://github.com/anthropics/claude-code/issues/90680)** — *Fable 5 `[cyber]` false-positive blocks writing a regression test for the team's own security fix.* A crisp illustration of the false-positive cost: safeguard recovery UI also causes silent model downgrades. Closed as stale, which will frustrate the reporter.
6. **[#88950](https://github.com/anthropics/claude-code/issues/88950)** — *Worktree isolation pin shared across parallel subagents causes cross-agent command execution.* Potentially the most severe correctness/safety bug listed: parallel agents leaking into each other's worktrees can corrupt state or execute unintended commands. Closed stale despite a has-repro tag.
7. **[#90668](https://github.com/anthropics/claude-code/issues/90668)** — *`spawn_task` chip runs in the spawning session's working tree, not an isolated worktree — while that session is still editing it.* Same isolation theme as #88950, different mechanism. The tool's own return text tells users the opposite of what happens.
8. **[#93317](https://github.com/anthropics/claude-code/issues/93317)** — *Claude Browser cannot be reliably disabled.* Less about AI capability, more about user agency: a feature you can't turn off undermines self-imposed focus controls. Only 1 comment, but representative of a steady stream of "can't disable X" reports.
9. **[#106436](https://github.com/anthropics/claude-code/issues/106436)** — *`claude_install.sh` re-downloads the entire executable after already downloading it, failing on slow connections.* A fresh, has-repro installation bug with a clear fix; the kind of paper cut that disproportionately affects new users on constrained networks.
10. **[#90662](https://github.com/anthropics/claude-code/issues/90662)** — *PreToolUse/PostToolUse inside a running subagent reported under a phantom `agent_id` with no SubagentStart/Stop.* Hook authors can't reliably correlate events to agents — a real blocker for anyone building observability or policy tooling on top of hooks.

## 4. Key PR Progress

All three PRs updated in the last 24h are **CLOSED (not merged)** and dated 2026-03-10, indicating backlog cleanup rather than new work. Review them as proposals, not shipped functionality:

1. **[#32756](https://github.com/anthropics/claude-code/pull/32756)** — `feat(plugins): add pattern-sweep command for similar-pattern bug fixes.` Adds a `/pattern-sweep` slash command that reads the recent `git diff`, identifies the buggy pattern, and searches the codebase for similar instances so all occurrences can be fixed at once. Addresses #32647.
2. **[#32755](https://github.com/anthropics/claude-code/pull/32755)** — `feat(plugins): add edit-verifier plugin for post-edit verification.` Adds a PostToolUse hook that verifies Edit-tool success, addressing the well-known failure mode where a whitespace mismatch makes an edit silently no-op and Claude proceeds on false assumptions. Addresses #32658.
3. **[#32751](https://github.com/anthropics/claude-code/pull/32751)** — `fix(hookify): map stop/prompt events to correct field names.` Fixes Hookify rules with `event: stop`/`event: prompt` never firing because `config_loader.py` maps them to `field='content'`, which `rule_engine._extract_field()` can't resolve for Stop/UserPromptSubmit. Fixes #32153.

*Note: the remaining 7 of the requested "10 important PRs" are not available — only 3 PRs were updated in the reporting window.*

## 5. Hot Discussions

No Discussions data was provided for this window. Section omitted.

## 6. Feature Request Trends

Distilled from the issue set (explicit `enhancement` items plus implicit requests):

- **Session/agent visibility in the UI** — [#83699](https://github.com/anthropics/claude-code/issues/83699) (collapsed groups should show active sessions), [#90682](https://github.com/anthropics/claude-code/issues/90682) (session counts on collapsed groups), [#89133](https://github.com/anthropics/claude-code/issues/89133) (subagent model not shown for parallel agents), [#105245](https://github.com/anthropics/claude-code/issues/105245) (status indicator regression). Consistent demand for *knowing what the fleet of agents is doing*.
- **Granular, graduated permissions and safety UX** — [#90660](https://github.com/anthropics/claude-code/issues/90660) proposes double-confirmation for wide-scope grants (e.g., trusting `$HOME`) instead of the same single "Yes" for everything, plus [#90681](https://github.com/anthropics/claude-code/issues/90681) asking for credential-paste warnings.
- **Reasoning/agent isolation controls** — worktree isolation bugs (#88950, #90668) are surfacing as feature-shaped demands for reliable per-agent sandboxing.
- **Provider spending controls** — the pooled-budget release is a direct response to enterprise requests for shared group budgets rather than per-seat micromanagement.
- **TUI/accessibility polish** — [#90635](https://github.com/anthropics/claude-code/issues/90635) (underline links on hover).

## 7. Developer Pain Points

1. **Opaque cost/usage accounting (highest heat).** The cluster of #103437, #87419, and related reports (#79773, #65678, #69430, #52135, #54714) all describe consumption accelerating without a plan change or user action. The common thread is *lack of transparency*: users can't reconcile what they did with what they were charged.
2. **Silent model downgrades and config overrides.** `switchModelsOnFlag:false` being ignored (#98875), Fable→Opus fallback in Remote Control (#90670), and recovery UI triggering downgrades (#90680). Explicit user settings losing to internal fallbacks erodes trust.
3. **Safety-classifier false positives on legitimate work.** `[cyber]` (#90680, #98875) and `[bio]` (#90671) flags blocking security fixes, IT fleet administration, and mainframe COBOL/JCL analysis. The pattern: users rephrase prompts repeatedly with no recourse path.
4. **Subagent isolation and hook/event integrity.** #88950, #90668, and #90662 together describe an agent-runtime layer where isolation and event attribution are unreliable — a blocker for anyone building automation on top of subagents.
5. **Installation and platform friction.** #90651 (hang without hardware virtualization), #106436 (installer re-download loop on slow connections), #90676 (`pwsh.exe` exit 126 in sandbox). Different bugs, same outcome: new-user setup failures with no actionable error message.
6. **Aggressive stale-bot closures.** Many detailed, has-repro reports (#88950, #90680, #90668) were closed `stale` on 2026-10-31. Contributors who invested effort in reproduction steps are losing their reports without resolution — a meta-pain point likely to affect future reporting quality.

</details>

<details>
<summary><strong>OpenAI Codex</strong> — <a href="https://github.com/openai/codex">openai/codex</a></summary>

# OpenAI Codex Community Digest — 2026-11-01

## 1. Today's Highlights

No new releases landed in the last 24 hours, but community activity remains intense: a long-running **token-waste bug in background process polling** (#13733, 46 comments, 47 👍) is now the most-discussed issue, signaling broad concern over uncontrolled API turn costs. **Windows desktop reliability** continues to dominate new reports — browser toggles, workspace-routing timeouts, taskbar conflicts, and HTTP 403/400 failures all appeared or were updated today. On the collaboration/ecosystem side, community "Show and tell" posts (recall, toli, Bossanova) reveal growing demand for **cross-agent memory sharing and credential isolation**.

---

## 2. Releases

None in the last 24 hours. Next digest will cover the first release after this window.

---

## 3. Hot Issues (Top 10)

1. **[#13733] Background process polling wastes tokens — each `write_stdin` poll triggers a full API turn with complete history** — *OPEN, 46 comments, 47 👍*
   The highest-signal bug of the day. Codex's polling loop for `cargo build`/`cargo test` sends the entire conversation history on every status check, making token cost proportional to history size × poll count. Community reaction is strongly supportive (47 upvotes), as this directly impacts cost predictability for long-running agentic tasks.
   [openai/codex#13733](https://github.com/openai/codex/issues/13733)

2. **[#54989] Windows: browser reports disabled in Work settings while Browser toggle is enabled** — *OPEN, 21 comments*
   A high-frequency desktop bug: browser-use tools error out even when the toggle is on; only a full app restart restores access. Reflects broader state-persistence issues in the Windows desktop shell.
   [openai/codex#54989](https://github.com/openai/codex/issues/54989)

3. **[#54685] Auto-review denies cross-task approval after trusted-context omissions** — *OPEN, 16 comments*
   The auto-review guardian rejects execution despite complete original evidence, pointing to gaps in how scoped authorization is retained across task boundaries.
   [openai/codex#54685](https://github.com/openai/codex/issues/54685)

4. **[#42950] Public Codex Site blocked by Cloudflare for external visitors** — *OPEN, 14 comments*
   Long-running complaint (since September) that Codex Sites are rendered inaccessible to external users. Still open, indicating unresolved infrastructure interaction with Cloudflare.
   [openai/codex#42950](https://github.com/openai/codex/issues/42950)

5. **[#45369] [Windows] Auto-hidden taskbar cannot be revealed while ChatGPT Desktop is maximized** — *OPEN, 13 comments, 3 👍*
   A desktop shell integration bug that breaks OS-level UI patterns. Small but highly visible to Windows users; tends to indicate window management regressions.
   [openai/codex#45369](https://github.com/openai/codex/issues/45369)

6. **[#50923] Windows Desktop: concurrent turns end in workspace-routing timeouts alongside MCP discovery and queue stalls** — *OPEN, 11 comments*
   Reproducible app-server 0.160.0 stalls during concurrent chats. Important because multi-chat usage is becoming the default workflow for power users.
   [openai/codex#50923](https://github.com/openai/codex/issues/50923)

7. **[#42291] Support multiple independent chats in tiled / split view** — *OPEN, 10 comments, 5 👍*
   A structural enhancement request for first-class multi-pane conversations with independent context. Pairs directly with #50923's reliability concerns.
   [openai/codex#42291](https://github.com/openai/codex/issues/42291)

8. **[#36501] Auto-review converts explicit user approval into an unbound consent phrase loop** — *OPEN, 9 comments, 3 👍*
   Auto-review loses the semantic link between user intent and the pending command, forcing repeated prose confirmation. Highlights a pattern across multiple auto-review reports today (#54685, #48998, #58604).
   [openai/codex#36501](https://github.com/openai/codex/issues/36501)

9. **[#58310] Android Codex Remote (Mac host) consumes >10 GB cellular data in ~2 hours** — *OPEN, 2 comments, 1 👍*
   A newly-filed but high-severity report: ~470 MB in 7 minutes over metered LTE. Could reflect oversized payloads (see also #54668's ~63 MB per HTTP request report).
   [openai/codex#58310](https://github.com/openai/codex/issues/58310)

10. **[#54668] Windows Desktop: retained inline images cause ~63 MB per HTTP request** — *OPEN, 3 comments*
    Tie-in with #58310: payload bloat from historical image retention is a clear architectural pain point. Requesting safe old-thread recovery.
    [openai/codex#54668](https://github.com/openai/codex/issues/54668)

---

## 4. Key PR Progress (Top 10)

Only one PR updated in the last 24h, so this section is reduced accordingly.

1. **[#58459 — Tighten Bazel CI snapshot handling and OTLP test cleanup](https://github.com/openai/codex/pull/58459)** — *CLOSED, copyberry[bot]*
   - Failed snapshot assertions now print diffs without leaving `.snap.new` artifacts after a passing retry.
   - OTLP loopback collector shuts down promptly after exporter shutdown rather than waiting for its deadline.
   - Small but meaningful CI hygiene improvement — reduces flake noise in test artifacts and tightens telemetry test lifecycle.

*(Only one PR met the 24h window; no further entries to report.)*

---

## 5. Hot Discussions

### Ideas
- **[#12567] Memories in Codex** — *40 comments, 14 👍* — The flagship product-direction thread. Community is actively weighing whether future Codex replies should cite prior threads and how visible memory usage should be. [link](https://github.com/openai/codex/discussions/12567)
- **[#58460] Secure integration between ChatGPT, Codex, Work, and macOS** — *1 👍* — A French-language request for continuous, auditable collaboration between ChatGPT and agents running locally on a Mac. [link](https://github.com/openai/codex/discussions/58460)

### Q&A
- **[#5523] How can sensitive files remain uncompromised when using Codex CLI?** — *5 comments, 5 👍* — Notes a nuance in `.gitignore` handling: `@`-referenced ignored files are excluded from model context, but other access paths may not be. High-value security question. [link](https://github.com/openai/codex/discussions/5523)
- **[#57029] Using my work email** — *1 comment* — Gmail plugin shows multiple connected accounts but no selector; assistant cannot confirm access to the second mailbox. [link](https://github.com/openai/codex/discussions/57029)
- **[#58546] Supported same-ID migration of indexed paginated history** — *1 👍* — Asking for a supported way to migrate a local Codex thread (with history, attachments, and model-visible context) between Windows and Intel Mac. [link](https://github.com/openai/codex/discussions/58546)

### Show and tell
- **[#58220] recall — give Codex the memory Claude Code already wrote for your repo (MCP, zero deps)** — *1 👍* — Zero-dependency MCP bridge that surfaces Claude Code's local Markdown memories to Codex. A pragmatic response to the fragmented memory landscape. [link](https://github.com/openai/codex/discussions/58220)
- **[#57591] toli — Let Codex and Claude Code collaborate, even on different machines** — *1 👍* — Apache-2.0 tool that lets existing agents talk directly, including across developers' machines. [link](https://github.com/openai/codex/discussions/57591)
- **[#57746] Zozo — inspectable issue-to-PR example and a review checklist for coding-agent work** — *1 👍* — Positions the project as a coordinator for coding runtimes against a backlog, with public issue/diff/CI evidence. [link](https://github.com/openai/codex/discussions/57746)
- **[#55643] Kingdoms — playing a strategy prototype by talking to Codex** — *1 👍* — Persistent map state + conversation-driven orders; a fun look at agent-as-game-controller patterns. [link](https://github.com/openai/codex/discussions/55643)
- **[#58492] Bossanova — let Codex use an API key without putting its value in the conversation** — *1 👍* — Local encrypted vault with an optional MCP bridge for Codex CLI. Directly targets the plaintext-secret problem. [link](https://github.com/openai/codex/discussions/58492)

---

## 6. Feature Request Trends

Distilled from Issues and Discussions over the last 24h:

- **First-class memory & cross-session context** — Discussions #12567 and #58220, plus the Windows/macOS history migration ask (#58546), converge on: Codex should retain, cite, and migrate conversation memory in user-controllable ways.
- **Multi-chat / split-view workflow** — #42291 requests tiled independent chats; #50923 documents that concurrent turns already break. Capability and reliability need to advance together.
- **Hard tool allowlists and scoped authorization** — #47652 asks for a first-class global tool allowlist; #58604 asks for durable scoped authorization with visible effective policy. Auto-review-related threads (#36501, #54685, #48998) supply the underlying motivation.
- **Secret and credential isolation** — Bossanova (#58492) and Discussion #5523 both push toward keeping API keys and sensitive files out of model-visible context.
- **Payload and bandwidth discipline** — #58310 (10 GB over LTE in 2h) and #54668 (63 MB/request) are two sides of the same request: reduce what gets shipped over the wire, especially for remote/mobile sessions.
- **Multi-agent, cross-vendor collaboration** — toli (#57591), Zozo (#57746), and recall (#58220) collectively show users want Codex to interoperate with other agents and tools in the same repo.

---

## 7. Developer Pain Points

- **Token burn from agentic loops (#13733)** — The single strongest pain signal today (47 👍). Polling loops that re-send full history make costs scale super-linearly with session length and undermine trust in background builds/tests.
- **Windows desktop reliability cluster** — #54989, #45369, #50923, #52981, #55743, #57874, #58599, #54668 all describe desktop-state, routing, shell, or connectivity failures. Windows users are disproportionately represented among today's reports.
- **Auto-review authorization friction** — A recurring cluster (#36501, #54685, #48998, #58604) where explicit approvals are not durably honored, causing re-approval loops or denials. Erodes trust in the safety layer for long-running tasks.
- **Rate limits and usage accounting** — #58098 ("82% weekly usage in one day"), #55507 (429s on Business plan), and #45619 (allowance not resetting after renewal) show ongoing confusion and frustration around quota behavior and transparency.
- **Payload bloat in remote/mobile contexts** — #58310 and #54668 reveal that session history and inline images can silently inflate per-request size to tens or hundreds of megabytes, with real-world cellular data consequences.
- **Cross-platform and language-support gaps** — Arabic RTL rendering in CLI (#34871), Russian dictation regression on macOS (#58387), and cross-OS history migration (#58546) all point to incomplete international and cross-platform coverage.

---

*Compiled from github.com/openai/codex activity observed for 2026-11-01.*

</details>

<details>
<summary><strong>Gemini CLI</strong> — <a href="https://github.com/google-gemini/gemini-cli">google-gemini/gemini-cli</a></summary>

# Gemini CLI Community Digest — 2026-11-01

## 1. Today's Highlights

The project shipped nightly `v0.67.0-nightly.20261031`, headlined by a fix ensuring the shadow repo respects `.git/info/exclude` and `core.excludesFile`, plus an SSE buffer flush at stream EOF in `CodeAssistServer`. Issue activity remains dominated by **agent/subagent reliability**: false-positive success reporting, hangs, and ignored configuration overrides. Several long-running community PRs (ripgrep error propagation, ACP tool-output truncation, SSE end-of-stream dispatch) were closed this cycle, suggesting maintainers are clearing a review backlog.

## 2. Releases

**v0.67.0-nightly.20261031.g6814e00d6** — nightly build
- `fix(core)`: honor `.git/info/exclude` and `core.excludesFile` in shadow repo ([#30034](https://github.com/google-gemini/gemini-cli/pull/30034))
- `fix(core)`: flush pending SSE event buffer at stream EOF in `CodeAssistServer` ([#30034-related](https://github.com/google-gemini/gemini-cli/pull/30034))

## 3. Hot Issues

1. **[#22323](https://github.com/google-gemini/gemini-cli/issues/22323) — Subagent recovery after MAX_TURNS reported as GOAL success** (13 comments, 👍2, P1). A subagent claims `status: "success"` / `Termination Reason: "GOAL"` while its own output admits it hit the turn limit before analyzing anything. This is a correctness issue that undermines trust in agent telemetry — the most-discussed issue of the day.

2. **[#19873](https://github.com/google-gemini/gemini-cli/issues/19873) — Zero-dependency OS sandboxing & post-execution intent routing** (9 comments, P2). Proposes leaning into Gemini 3's native bash affinity with sandboxing to safely unlock chained POSIX-tool workflows. High-value architectural direction for the agent roadmap.

3. **[#21409](https://github.com/google-gemini/gemini-cli/issues/21409) — Generalist agent hangs** (8 comments, 👍8, P1). Simple operations (e.g., folder creation) hang indefinitely when deferred to the generalist agent; users report hour-long waits. The 👍8 ratio signals broad impact.

4. **[#22745](https://github.com/google-gemini/gemini-cli/issues/22745) — Assess impact of AST-aware reads/search/mapping** (7 comments, P2). Epic exploring whether AST-aware tooling reduces misaligned reads, token noise, and turn count. Complements [#22746](https://github.com/google-gemini/gemini-cli/issues/22746).

5. **[#21968](https://github.com/google-gemini/gemini-cli/issues/21968) — Gemini under-uses skills and subagents** (7 comments, P2). Anecdotal but widely echoed: custom skills/subagents are only invoked when explicitly instructed. Directly affects the value proposition of the subagent system.

6. **[#22267](https://github.com/google-gemini/gemini-cli/issues/22267) — Browser Agent ignores settings.json overrides** (5 comments, P2). `maxTurns` and similar overrides are discarded because the factory rebuilds the agent from hardcoded defaults — despite `AgentRegistry` merging settings correctly.

7. **[#22232](https://github.com/google-gemini/gemini-cli/issues/22232) — Browser agent session takeover & lock recovery** (4 comments, P3). Requests replacing fail-fast locked-profile behavior with automatic takeover, improving resilience for persistent sessions.

8. **[#21983](https://github.com/google-gemini/gemini-cli/issues/21983) — Browser subagent fails on Wayland** (4 comments, P1). Reports a "GOAL" termination despite failure — another instance of the misleading success-signal pattern in #22323.

9. **[#24246](https://github.com/google-gemini/gemini-cli/issues/24246) — 400 error with >128 tools** (3 comments, P2). Tool-count overflow causes API errors; users expect smarter scoping of enabled tools. A scaling pain point as MCP adoption grows.

10. **[#22672](https://github.com/google-gemini/gemini-cli/issues/22672) — Discourage destructive agent behavior** (3 comments, 👍1, P2). The model reaches for `git reset`/`--force` when safer alternatives exist. Safety-relevant and likely to grow in priority.

## 4. Key PR Progress

1. **[#30067](https://github.com/google-gemini/gemini-cli/pull/30067) — Honor settings.json overrides for Browser Agent** (P2). Fixes the factory reconstructing the agent from hardcoded defaults; direct counterpart to issue #22267.

2. **[#30070](https://github.com/google-gemini/gemini-cli/pull/30070) — Retain executing subagent tool calls in useToolScheduler** (P2). Restores nested `parentCallId` hierarchy so the task-tree visualization shows subagent activity that bypasses approval.

3. **[#30020](https://github.com/google-gemini/gemini-cli/pull/30020) — Drop tool calls streamed by failed attempts on retry**. Prevents duplicate execution of side-effecting commands when a mid-stream retry yields both failed and successful attempts.

4. **[#30068](https://github.com/google-gemini/gemini-cli/pull/30068) — Forward contextManagement settings to core**. Fixes a discarded output-masking threshold (configured 400k silently reverting to 50k default).

5. **[#30051](https://github.com/google-gemini/gemini-cli/pull/30051) — Kill active shells and persist tool calls on headless interruption**. Addresses signal-exit codes and orphaned detached shells in `--yolo`/headless runs.

6. **[#30058](https://github.com/google-gemini/gemini-cli/pull/30058) — Prevent interrupted Whisper downloads treated as installed** (P2). Partial model files no longer pass `isModelInstalled()`, fixing a nasty download-corruption trap.

7. **[#29901](https://github.com/google-gemini/gemini-cli/pull/29901) — Let ACP clients steer a running turn**. Brings terminal-style `modelSteering` to ACP editors (Zed, JetBrains, VS Code) without cancelling the turn.

8. **[#29800](https://github.com/google-gemini/gemini-cli/pull/29800) — Fall back across model tiers only when Auto quota is exhausted**. Rebuilds terminal-quota routing so Auto mode routes Pro ↔ Flash on true exhaustion rather than dead-ending sessions.

9. **[#29779](https://github.com/google-gemini/gemini-cli/pull/29779) — Mark failed ripgrep searches as tool errors** (CLOSED). Fixes `RipGrepTool` returning failures without `error`, causing scheduler to record them as successes.

10. **[#29778](https://github.com/google-gemini/gemini-cli/pull/29778) — Truncate tool output in ACP mode** (CLOSED). Applies `truncateToolOutputThreshold` in `gemini --acp`, preventing 400 input-token-limit errors from large shell outputs.

*Also notable:* security PoC PRs [#30066](https://github.com/google-gemini/gemini-cli/pull/30066) and CI probes [#30064](https://github.com/google-gemini/gemini-cli/pull/30064)/[#30065](https://github.com/google-gemini/gemini-cli/pull/30065) tested fork-branch execution on self-hosted runners — worth monitoring from a supply-chain perspective.

## 5. Hot Discussions

No GitHub Discussions data was provided for this cycle; this section is omitted.

## 6. Feature Request Trends

- **AST-aware code intelligence**: [#22745](https://github.com/google-gemini/gemini-cli/issues/22745), [#22746](https://github.com/google-gemini/gemini-cli/issues/22746), and [#19561](https://github.com/google-gemini/gemini-cli/issues/19561) ("Tactful Extraction") all push toward surgical, token-frugal codebase navigation using AST tooling.
- **Persistent, file-based task tracking**: [#18836](https://github.com/google-gemini/gemini-cli/issues/18836) and [#21000](https://github.com/google-gemini/gemini-cli/issues/21000) propose replacing in-context WriteToDo with CRUD-style persistent task files to combat context rot.
- **Subagent observability**: [#22598](https://github.com/google-gemini/gemini-cli/issues/22598) (trajectories via `/chat share`) and [#21763](https://github.com/google-gemini/gemini-cli/issues/21763) (subagent context in bug reports) target debugging visibility.
- **Agent self-awareness**: [#21432](https://github.com/google-gemini/gemini-cli/issues/21432) asks the CLI to accurately describe its own flags, hotkeys, and self-execution.
- **Parallel/shared-memory subagents**: [#18287](https://github.com/google-gemini/gemini-cli/issues/18287) (blocked on parallel subagent support).
- **Subagent discovery/config**: [#18285](https://github.com/google-gemini/gemini-cli/issues/18285) (settings.json discovery), [#20195](https://github.com/google-gemini/gemini-cli/issues/20195) (Sprint 1 tracking).
- **Per-workspace policies**: [#18397](https://github.com/google-gemini/gemini-cli/issues/18397).

## 7. Developer Pain Points

1. **Misleading agent success signals** — Subagents report `GOAL`/`success` after hitting MAX_TURNS or failing outright ([#22323](https://github.com/google-gemini/gemini-cli/issues/22323), [#21983](https://github.com/google-gemini/gemini-cli/issues/21983)). This erodes trust in automation and any downstream eval tooling.

2. **Hangs and interactive-prompt stalls** — The generalist agent hangs indefinitely ([#21409](https://github.com/google-gemini/gemini-cli/issues/21409)), and the CLI gets stuck on interactive prompts (e.g., creating a Vite app, [#22465](https://github.com/google-gemini/gemini-cli/issues/22465)).

3. **Configuration overrides silently ignored** — Repeated pattern: Browser Agent ignores `settings.json` ([#22267](https://github.com/google-gemini/gemini-cli/issues/22267)), `contextManagement` thresholds dropped ([#30068](https://github.com/google-gemini/gemini-cli/pull/30068)), `truncateToolOutputThreshold` unapplied in ACP ([#29778](https://github.com/google-gemini/gemini-cli/pull/29778)).

4. **Reliability of cross-platform/streaming edges** — Wayland browser failures, SSE events dropped at stream EOF, orphaned shells on headless interrupt, and duplicate tool calls on retry all point to fragile boundary handling.

5. **Workspace pollution** — The model scatters temporary edit scripts across directories ([#23571](https://github.com/google-gemini/gemini-cli/issues/23571)), complicating clean commits.

6. **Session state loss** — `/compress` not persisted across resume ([#21335](https://github.com/google-gemini/gemini-cli/issues/21335)) and quota-interrupted sessions losing resumable history ([#29799](https://github.com/google-gemini/gemini-cli/pull/29799)).

7. **Skill/subagent under-utilization** — Users must explicitly invoke skills and subagents that should trigger contextually ([#21968](https://github.com/google-gemini/gemini-cli/issues/21968)).

8. **Tool-count scaling limits** — >128 tools triggering 400 errors ([#24246](https://github.com/google-gemini/gemini-cli/issues/24246)) as MCP servers proliferate.

</details>

<details>
<summary><strong>GitHub Copilot CLI</strong> — <a href="https://github.com/github/copilot-cli">github/copilot-cli</a></summary>

# GitHub Copilot CLI Community Digest — 2026-11-01

## 1. Today's Highlights

A new patch release **v1.0.106-1** lands with important correctness fixes for `apply_patch` line-ending handling on mixed LF/CRLF files and improved `COPILOT_PROVIDER_GHES_HOST` parsing. Meanwhile, the issue tracker remains extremely active (31 issues updated in 24h), with the most notable activity clustering around **context window rollover regressions**, **ACP (Agent Client Protocol) behavior**, and **autopilot mode overriding user-decision skills**. The community is pushing hard on session/agent ergonomics, permissions granularity, and Windows/WSL reliability.

## 2. Releases

**v1.0.106-1** — [Release](https://github.com/github/copilot-cli/releases)

- **Fixed:** `apply_patch` now preserves the line endings of every line it does not modify in files with mixed LF and CRLF endings, rather than normalizing the whole file to the ending style of its first few lines. This eliminates a class of spurious whitespace diffs that were polluting patches in mixed-ending repositories.
- **Fixed:** `COPILOT_PROVIDER_GHES_HOST` now accepts the instance's browser address (e.g. `https://ghes.example...`), removing a common GHES configuration friction point.

Only one release in the last 24h; no other version data provided.

## 3. Hot Issues

1. **#4994 (CLOSED) — MCP OAuth regression opens browser every ACP session** [link](https://github.com/github/copilot-cli/issues/4994)
   Regression 1.0.88 → 1.0.89: A valid, unexpired token in `mcp-oauth-config` is ignored (HTTP 401) and the OAuth page reopens on every `--acp` session. High community engagement (8 👍) because it breaks automated/headless workflows.

2. **#2776 (OPEN) — Shift+Enter submits instead of inserting newline** [link](https://github.com/github/copilot-cli/issues/2776)
   Long-running UX complaint (open since April, 8 comments, 3 👍). Directly affects prompt composition for multi-line prompts — likely the single most-requested keyboard behavior fix.

3. **#4097 (CLOSED) — apply_patch stores deleted binary in session history, blowing CAPI 5 MB limit** [link](https://github.com/github/copilot-cli/issues/4097)
   When a large binary is deleted, `tool.execution_complete` stores the full binary as a textual diff, permanently poisoning conversation history until `/compact`. Serious for long sessions; strong upvote ratio (5 👍).

4. **#5312 (OPEN) — Context rollover still fails on 1.0.105 after #5205 closed** [link](https://github.com/github/copilot-cli/issues/5312)
   The community escalation of #5205: rollover crashes with `checkpoint.md is absent for this agent`. Filed because the prior issue was closed without a PR, commit, or fix release — a trust concern for long-running agent users.

5. **#4537 (CLOSED) — ACP mode auto-approves tool calls (regression of #845)** [link](https://github.com/github/copilot-cli/issues/4537)
   `session/request_permission` is no longer sent since 1.0.81-1; shell/file edits execute unattended with no session log entry. A security-relevant regression that undermines client-side permission gating.

6. **#5276 — Autopilot overrides skills requiring user decisions (`ask_user` auto-replies "work autonomously")** [link](https://github.com/github/copilot-cli/issues/5276)
   Autopilot mode hijacks interactive skills (e.g. `grilling`) by auto-answering `ask_user`. Highlights friction between autonomy modes and plugins that deliberately require user input.

7. **#5256 — High CPU and tight retry loop of `gh auth token` when unsigned** [link](https://github.com/github/copilot-cli/issues/5256)
   Background auth probe retries with no backoff when no GitHub credential is present (e.g. BYOK provider users). Easy-to-hit resource drain; notable for BYOK-heavy users.

8. **#5306 — `--available-tools` with empty value exposes all tools instead of none** [link](https://github.com/github/copilot-cli/issues/5306)
   Documented behavior says empty should disable everything, but all 21 built-in tools are sent. Prevents a "no tools" sandboxed run via `copilot -p`; a clean, reproducible bug.

9. **#5301 — `web_search` failing with HTTP 504 ~50%+ of calls** [link](https://github.com/github/copilot-cli/issues/5301)
   Remote GitHub MCP server gateway timeout (~120s) affecting more than half of calls over ~9 days. Major reliability concern for anyone relying on built-in web search.

10. **#5297 — Feature: repository-level, version-controlled command permissions (allow/ask/deny)** [link](https://github.com/github/copilot-cli/issues/5297)
    Wants shareable permission sets committed alongside instructions/skills/agents for workshop and team onboarding. Points to an emerging standardization need across teams.

Honorable mentions: #5112 (OSC 7501 program status), #5302 (Windows PowerShell generation failures), #5299 (Windows OpenWith dialog spam from spaced profile paths), #5298 (`--model fusion` requires undocumented `DYNAMIC_AUTO_TIERS`).

## 4. Key PR Progress

Only **one** PR was updated in last 24h, so the "Key PR Progress" section is limited by available data:

1. **#5310 — Fix container smoke-test workspace permissions** [link](https://github.com/github/copilot-cli/pull/5310)
   Fixes amd64/arm64 smoke-test failures in CI run 41153798295. The temp workspace is created mode `0700`, blocking the image runtime user (UID 10001); the PR also addresses Git being initialized as root. Directly improves CI health for the container pipeline.

No other PRs were provided. Historically important fixes referenced by issues (e.g., the still-missing fix for #5312/#5205 rollover) are not yet represented by PRs in this data.

## 5. Hot Discussions

No Discussion data (Ideas / Q&A / Show and tell) was provided in this dataset. **This section is omitted.**

## 6. Feature Request Trends

Distilled from all issues and the sole PR:

- **Session & agent ergonomics:** In-session `/rename` persistence (#2622), `/rename` in VS Code agent sessions and agent-invocable rename (#4244), autopilot output fidelity (#5303).
- **Hooks & extensibility:** Hook events for slash-command/skill invocation, async command hooks (#5305); prompt enhancer-style capability (#79); plugin hook expansion for cross-tool parity with Claude Code.
- **Permissions & policy:** Repository-level, version-controlled allow/ask/deny command permissions (#5297); correct parent-directory handling inside the project (#4601); Windows path normalization (#5299).
- **ACP (Agent Client Protocol) completeness:** Model list as a `category:model` config option in `session/new` (#4880), correct `currentModelId` (#2044), and permission prompts in ACP mode (#4537).
- **Terminal integration:** OSC 7501 program status broadcasting (#5112); WSL2 `/keep-alive` actually inhibiting Windows host sleep (#5304).
- **Model/config discoverability:** `--model fusion` should work without undocumented `DYNAMIC_AUTO_TIERS` (#5298).

## 7. Developer Pain Points

Recurring frustrations across the tracker:

- **Context/session reliability:** Rollover failures (`checkpoint.md absent`) recur even after issues are closed as completed (#5312, #5205). Long sessions also blow the CAPI 5 MB limit from stored binaries (#4097). Session renaming is overwritten by auto-naming (#2622).
- **Security & permission regressions:** ACP auto-approves tool calls without prompting (#4537); Enterprise interim fail-closed MCP policy drops user servers during resolution windows (#4419).
- **Cross-platform friction:** Windows PowerShell command invalidity (#5302), OpenWith dialog spam with spaces in profile paths (#5299), WSL2 keep-alive not preventing host sleep (#5304), IPv6-only hangs on SEA binary (#2361).
- **Reliability of core tools:** `web_search` 504 timeouts (#5301), mismatched `model_not_supported` errors after content filters (#5309), tight auth retry loops burning CPU when unsigned (#5256).
- **UX papercuts:** Shift+Enter submitting prompts (#2776), `--available-tools` empty value enabling all tools (#5306), repeated parent-directory prompts for paths inside the approved working dir (#4601, #5311).
- **Autonomy vs. control:** Autopilot overriding decision-requiring skills (#5276) and producing empty responses before `task_complete` (#5303).

---

*Digest compiled from github.com/github/copilot-cli data for 2026-11-01. Note: Discussion data was not supplied, so Section 5 is omitted; PR coverage is limited to the single PR updated in the window.*

</details>

<details>
<summary><strong>OpenCode</strong> — <a href="https://github.com/anomalyco/opencode">anomalyco/opencode</a></summary>

# OpenCode Community Digest — 2026-11-01

## Today's Highlights

No new releases shipped in the last 24h, but the community was highly active: the free-tier megathread (#59387) continued to dominate with 167 comments, and CPU compatibility (SSE4.2) emerged as a breaking change affecting older hardware. The PR queue also saw heavy contributor activity from the core team, with a large batch of `@opencode/ai` refactors and transport-layer fixes landing for review.

---

## Releases

No new releases in the last 24 hours.

---

## Hot Issues

1. **[#59387](https://github.com/anomalyco/opencode/issues/59387) — [zen] Free tier issues megathread** (OPEN, 167 comments, 👍12)
   The central tracking issue for all free-tier failures: usage-limit errors that never reset, "subscribe to Go" misfires, and Desktop version incompatibilities. With 167 comments, this is by far the loudest thread in the tracker and signals that the free-tier gating logic needs urgent attention.

2. **[#59461](https://github.com/anomalyco/opencode/issues/59461) — Crash on startup (Error 134 / Missing SSE4.2)** (OPEN, 6 comments)
   Recent Desktop builds switched to a Bun runtime requiring SSE4.2, causing immediate crashes on older CPUs. This is a hard regression for a segment of users and has spawned a follow-up feature request (#60982, below).

3. **[#60982](https://github.com/anomalyco/opencode/issues/60982) — Feature Request: Node.js fallback for non-SSE4.2 CPUs** (OPEN, 3 comments)
   Direct community response to #59461, asking for a compatibility mode so users on legacy processors aren't locked out. A clear signal that binary runtime choices are now a first-class community concern.

4. **[#42960](https://github.com/anomalyco/opencode/issues/42960) — [2.0] V2: Esc interrupt broken** (CLOSED, 12 comments, 👍3)
   Esc no longer interrupts tasks; background sessions keep running after Ctrl+C and resume. A core UX reliability bug in the v2 line, now closed but notable given the long triage window.

5. **[#42856](https://github.com/anomalyco/opencode/issues/42856) — [2.0] User-defined local provider models never enter the catalog** (CLOSED, 11 comments, 👍7)
   Locally-configured OpenAI-compatible providers are parsed but never exposed, breaking local-model workflows. High 👍 count shows strong interest from self-hosters.

6. **[#41746](https://github.com/anomalyco/opencode/issues/41746) — [v2 Windows] Hangs at "Starting background server..." after reinstall** (CLOSED, 9 comments, 👍9)
   A reproducible Windows install/reinstall hang where `opencode2 serve` works standalone but the main entrypoint stalls. The 👍9 indicates broad Windows-user impact.

7. **[#60493](https://github.com/anomalyco/opencode/issues/60493) / [#59293](https://github.com/anomalyco/opencode/issues/59293) — Subagent session resume fails, sessionID truncated to "ses"** (CLOSED/OPEN, 3 comments each)
   Two separate reports of the same root cause: `sessionID` is truncated to `"ses"`, making subagent session continuation impossible. Duplicate reports suggest broader usage of subagent APIs than the team may have expected.

8. **[#60050](https://github.com/anomalyco/opencode/issues/60050) — 2.2.0: `/api/experimental/generate` 50–100× slower** (CLOSED, 3 comments)
   A 12.8 KB prompt regressed from 18–42s (2.1.4) to 200–223s (2.2.0). A serious performance regression for plugin/API consumers that warrants a regression-test guard.

9. **[#60690](https://github.com/anomalyco/opencode/issues/60690) — "Upstream request failed" on paid models** (CLOSED, 4 comments)
   Users with active OpenCode Go credit hit persistent upstream failures on DeepSeek/Kimi K3 despite valid API keys. Billing-adjacent errors amplify urgency.

10. **[#60700](https://github.com/anomalyco/opencode/issues/60700) — ECONNRESET / "Failed to drain Session" on every request** (CLOSED, 3 comments)
    Every model request fails behind a NaiveProxy on Windows Desktop 2.2.3, surviving reboots. Highlights fragile transport handling in proxied/restricted networks.

---

## Key PR Progress

1. **[#60980](https://github.com/anomalyco/opencode/pull/60980) — feat(core): surface Meta API usage quota**
   Adds Meta quota handling (`x-ratelimit-*` headers, per-request `usage`, 429 quota errors). Closes a gap where Meta responses carried quota data that opencode ignored.

2. **[#56018](https://github.com/anomalyco/opencode/pull/56018) — fix(desktop): stage the bundled CLI next to the app by default**
   Fixes Windows Desktop copying `opencode-cli.exe` into `userData`, addressing a class of install/path issues related to the background service.

3. **[#60978](https://github.com/anomalyco/opencode/pull/60978) — fix(core): end the tool step on a Claude non-streaming fallback**
   Handles `tool_use` blocks arriving without `message_stop` when Claude falls back to non-streaming — a subtle correctness fix in the step reader.

4. **[#60974](https://github.com/anomalyco/opencode/pull/60974) — feat(core): per-request and per-turn tracing with session/tool/model details**
   Replaces the "one giant startup trace" with per-request and per-session-turn traces, dramatically improving observability ("what happened in this session?").

5. **[#60969](https://github.com/anomalyco/opencode/pull/60969) — feat(core): time session warming from the model's cache TTL**
   Introduces `warming.interval: "auto"` to ping at 90% of a model's `cache.ttl`, eliminating wasteful fixed 4-minute pings. Complements #60025 (per-provider warming config).

6. **[#60797](https://github.com/anomalyco/opencode/pull/60797) — fix(ai): loop recovers from bad tool input, skips truncated calls**
   Bad JSON tool arguments are now returned to the model as an error result instead of terminating the loop, plus truncation handling and a single forced `toolChoice`. Meaningful loop-robustness gains.

7. **[#60808](https://github.com/anomalyco/opencode/pull/60808) — feat(ai): `status`, `code`, `isRetryable`, `retryAfterMs` on AIError**
   Exposes common failure fields directly on `AIError`, simplifying retry logic and error classification for callers.

8. **[#60970](https://github.com/anomalyco/opencode/pull/60970) — feat(ai): share headers, fetch and timeout across every request**
   Unifies per-call transport (headers/fetch/timeouts) that previously lived in a nested object and was silently ignored by image/decision/media requests.

9. **[#60947](https://github.com/anomalyco/opencode/pull/60947) — fix(core): retry compaction summaries truncated at the output limit**
   Adds retry for compaction summaries hitting the output cap, closing a long-standing failure (#56862, duplicate #57187). Directly improves long-session stability.

10. **[#60973](https://github.com/anomalyco/opencode/pull/60973) — refactor(ai): decision questions and answers keyed by name**
    Replaces positional (`answers[0]`) access with name-keyed records, removing an entire class of list-alignment bugs for plugin authors.

*Bonus:* **[#60880](https://github.com/anomalyco/opencode/pull/60880)** — migrates all app benchmarks to `strobe`, deleting the Playwright harness (−11,020/+2,310 lines). **[#60780](https://github.com/anomalyco/opencode/pull/60780)** — makes AWS/Google auth libs optional peer deps, trimming install weight.

---

## Hot Discussions

No dedicated Discussion data was provided for this window. Community conversation is concentrated in Issues (see Hot Issues above) and PR review threads.

---

## Feature Request Trends

Distilled from Issues and PRs:

- **Hardware/runtime compatibility** — Node.js fallback or compatibility mode for CPUs lacking SSE4.2 (#60982), driven by the Bun runtime change.
- **Per-provider/per-model configuration** — configurable session warming (#60025, #60969), flexible model catalogs, and correct variant serialization for OpenAI-compatible providers (#41971).
- **Better observability** — per-request/per-turn tracing (#60974) and structured AI errors (#60808) reflect demand for debuggability in long agent sessions.
- **UI/UX refinement** — hiding or repositioning question modals (#37173), fixing reasoning-token rendering (#36037), and improving Desktop project pickers (#60735).
- **Subagent/session lifecycle** — resume support via `sessionID` (#59293, #60493) is a recurring capability gap.
- **Quota/provider integrations** — Meta quota surfacing (#60980), OpenCode Zen config drift (#40560), and Copilot model sync reliability (#60711).

---

## Developer Pain Points

- **Free-tier gating is the #1 friction source.** #59387 alone has 167 comments reporting limit errors that don't reset and misleading upgrade prompts — the highest-urgency reliability issue in the tracker.
- **v2/Desktop instability dominates the issue list.** Interrupt handling (#42960), startup hangs (#41746), 30+ second launches (#41477), silent restart loops (#37239), and frozen "thinking" states (#41365) collectively erode trust in the v2 line.
- **Performance regressions between minor versions.** The 50–100× slowdown in `/api/experimental/generate` (#60050) shows release-to-release performance needs automated guarding.
- **Provider/transport fragility.** ECONNRESET behind proxies (#60700), camelCase serialization rejected by strict providers (#41971), and Copilot sync timeouts under the shared service (#60711) all point to insufficiently defensive networking/auth paths.
- **Subagent session resumption is simply broken.** Two independent reports (#59293, #60493) of the same `"ses"` truncation bug indicate a small but high-impact logic error affecting API consumers.
- **Windows remains the most affected platform**, with hangs, freezes, slow startup, and disappearing chat inputs reported across multiple Desktop versions.

---

*Generated from github.com/anomalyco/opencode activity for 2026-11-01. Note: issue/PR timestamps reflect the dataset's synthetic future dating; all links point to the referenced repository items.*

</details>

<details>
<summary><strong>Pi</strong> — <a href="https://github.com/earendil-works/pi">earendil-works/pi</a></summary>

# Pi Community Digest — 2026-11-01

## 1. Today's Highlights

Windows and ConPTY terminal handling dominates today's activity: a major PR (#11642) lands to fix the long-standing terminal color-query leak family (#10256, #10362, #10742, #10717, #10970), while maintainers petrroll push through docs and fixes for `pi update` on Windows. Community attention is also clustering around OpenAI/ChatGPT provider inconsistencies (context window reporting, Responses-API tool handling) and a lively meta-discussion on porting Pi's runtime to Rust.

## 2. Releases

No new releases in the last 24 hours.

## 3. Hot Issues

1. **[#7547](https://github.com/earendil-works/pi/issues/7547) — How do you use Pi on Windows? (94 comments)** The single hottest thread in the repo. Community is coalescing around "too many ways to run Pi on Windows" and where core effort should go. This is effectively a roadmap-shaping discussion.
2. **[#10256](https://github.com/earendil-works/pi/issues/10256) — 0.99.x: terminal color query replies leak into prompt / BEL opens editor** The flagship regression of the 0.99.x line on mintty/ConPTY; 👍4. Now targeted by PR #11642 and bundled with four duplicates.
3. **[#6300](https://github.com/earendil-works/pi/issues/6300) — Windows: input line redrawn on every keystroke** Closed after 21 comments. A canonical Windows TUI rendering bug referenced repeatedly by other issues (#9186).
4. **[#11021](https://github.com/earendil-works/pi/issues/11021) — ChatGPT sign-in uses 272K context for GPT-6.1 Sol despite 500K catalog** 👍7, the most-upvoted issue today. Under-reporting context directly shrinks compaction budgets—users want the server-advertised 500K honored.
5. **[#11602](https://github.com/earendil-works/pi/issues/11602) — Branch summaries replay assistant content omitted by automatic retry** A correctness bug: abandoned failed responses can leak into new branch summaries. Reproduced offline with the faux provider.
6. **[#11613](https://github.com/earendil-works/pi/issues/11613) — bash tool reports timeout for commands that already exited** A subtle pipe-inheritance issue: a live descendant holding stdout causes a false "Command timed out" even when the shell exited with a real code.
7. **[#10758](https://github.com/earendil-works/pi/issues/10758) — Changing a pinned Git SHA in settings doesn't update the checkout** Configuration silently ignored on startup—no warning, just stale code. Erodes trust in settings-as-source-of-truth.
8. **[#9262](https://github.com/earendil-works/pi/issues/9262) — find tool: Windows separators in globs silently return nothing** Follow-up to #6817. Silent failures are especially dangerous for agents that conclude files don't exist.
9. **[#10618](https://github.com/earendil-works/pi/issues/10618) — GNU screen: inherited COLORTERM kills all colors** Environmental-variable leakage defeats Pi's screen guard; combined with #10256 this is a broader terminal-negotiation theme.
10. **[#11597](https://github.com/earendil-works/pi/issues/11597) — `pi update`: `git clean -fdx` fails on Windows (use `-ffdx`)** Closed, fixed by PR #11648. A concrete Windows update-path regression with a readily available fix.

## 4. Key PR Progress

1. **[#11642](https://github.com/earendil-works/pi/pull/11642) — fix(tui): keep late and header-less color replies out of the prompt** The most consequential open PR today. Fixes #10256 and covers #10362, #10742, #10717, #10970, plus parts of #10250/#10679. Explains the ConPTY DA1 interaction precisely.
2. **[#11648](https://github.com/earendil-works/pi/pull/11648) — fix(coding-agent): keep updating git packages when git clean fails** Closed; fixes #11597 with a Windows-aware `-ffdx` workaround for locked native modules.
3. **[#11638](https://github.com/earendil-works/pi/pull/11638) — fix(ai): declare tools at top level for custom openai baseUrl** Fixes #11637: gateways that drop `additional_tools` currently lose all 28 tools. Restores compatibility for third-party Responses gateways.
4. **[#11644](https://github.com/earendil-works/pi/pull/11644) — docs(coding-agent): document Windows terminal and conhost limitations** Adds a "Choose a terminal" section with tables on which terminals are recommended vs. which use buggy conhost.
5. **[#11645](https://github.com/earendil-works/pi/pull/11645) — docs(coding-agent): note tmux 3.6 color reply leak** Documents the tmux 3.6 palette-query forwarding behavior—complements the #11642 fix with user-facing guidance.
6. **[#11647](https://github.com/earendil-works/pi/pull/11647) — docs(coding-agent): restructure external limitations as known issues with remedies** Cleans up the tmux and Windows guides into actionable "Known issues" tables.
7. **[#10789](https://github.com/earendil-works/pi/pull/10789) — feat(session): coalesce session-JSONL write syscalls** Closed; batch file creation/rewrites into a single write while preserving synchronous durability. Performance-focused, no compiler-level events.
8. **[#11646](https://github.com/earendil-works/pi/issues/11646) (issue) / minimatch pin bump** Flags `minimatch@10.2.6` against GHSA-g3hv-75wg-m249; requires bump to ≥11.0.1 in `@earendil-works/pi-coding-agent@1.4.0`.
9. **[#11652](https://github.com/earendil-works/pi/issues/11652) — pi-durable: non-persisting prompt preparation API** Hosts need to estimate candidate model requests without mutating persisted model or triggering compaction—an important embedding-primitive request.
10. **[#11649](https://github.com/earendil-works/pi/issues/11649) — Package resolution installs/refreshes packages with no host opt-out** A side-effect at startup/reload that embedding hosts can't separate from pure resolution. Relevant for anyone integrating Pi programmatically.

## 5. Hot Discussions

**Show and tell**
- **[#11634](https://github.com/earendil-works/pi/discussions/11634) — A Rust study of Pi's runtime cost: behavior-verified rebuild, 186/186 atoms identical to upstream main** A thorough derivative study of Pi's design (explicitly credited to @badlogic and team), exploring whether a Rust runtime makes sense given ~99% of wall time is spent waiting on the model. Notably verifies identical behavior across 186/186 atoms. Worth reading for anyone thinking about performance vs. fidelity trade-offs in agent runtimes.

## 6. Feature Request Trends

- **Windows platform maturation**: The dominant theme. Requests span a canonical "best way" to run on Windows (#7547), better conhost handling, and clearer terminal guidance (#11644, #11647).
- **Durable/host embedding primitives**: A cluster of requests around making Pi safely embeddable—non-persisting prompt preparation (#11652), opt-out of side-effectful package resolution (#11649), preserving tool identity in compaction transcripts (#11640), and a durable MCP extension (#10837).
- **Provider fidelity to server catalogs**: Users want Pi to reflect what providers actually advertise (context windows in #11021, header conventions in #11639, tool support in custom gateways #11637).
- **Configuration as source of truth**: Fixes requested so that settings changes (pinned Git SHAs, #10758) reliably take effect.
- **UI/dashboard integration**: Program status customization for launcher dashboards (#11641).

## 7. Developer Pain Points

1. **Windows + ConPTY terminal negotiation is the single largest pain cluster.** Color-query replies, DA1 handling, BEL-as-Ctrl+G, and mintty/WezTerm/ConPTY quirks generate a stream of duplicates (#10256, #10362, #10742, #10717, #10970, #9186, #9583). PR #11642 is the first comprehensive fix attempting to close the whole family—watch it closely.
2. **Silent failures erode trust.** Glob patterns with Windows separators returning nothing (#9262), pinned SHAs not updating without warning (#10758), and false timeout messages (#11613) all share a pattern: Pi reports success or nothing when it should report an error.
3. **Update-path fragility on Windows.** Locked native modules breaking `pi update` (#11597) and side-effectful package resolution (#11649) make updates risky or non-opt-outable.
4. **Provider/server metadata drift.** Context window under-reporting (#11021) and lost tools on custom gateways (#11637) force developers to work with budgets and capabilities that don't match what servers advertise.
5. **Durability and correctness of summaries.** Failed-response leakage into branch summaries (#11602) and lost tool identity in compaction (#11640) suggest the summarization/compaction path needs stronger invariants around what gets replayed.

---

*Note: Only one discussion qualified under the 24-hour window, so the Discussions section is intentionally brief. Releases section omitted as no new versions shipped.*

</details>

<details>
<summary><strong>Qwen Code</strong> — <a href="https://github.com/QwenLM/qwen-code">QwenLM/qwen-code</a></summary>

# Qwen Code Community Digest — 2026-11-01

## 1. Today's Highlights

CI health continues to dominate the project's attention: multiple long-running main-branch failures (Issues #14724, #15173, #12714) remain open with heavy bot and maintainer traffic, while two new infrastructure issues (#16005, #16003) surfaced today. Beyond CI, the day brought meaningful feature work in the managed-agent and Web Shell areas, plus several new PRs addressing Windows support, LSP resilience, and CLI rendering. No new releases shipped in the last 24 hours.

---

## 2. Releases

No new releases in the last 24 hours.

---

## 3. Hot Issues

1. **[#14724](https://github.com/QwenLM/qwen-code/issues/14724) — Main CI failed: Managed Agent gate (OPEN, 105 comments)**  
   The highest-traffic issue in the repo. A recurring CI gate failure with no identifiable test, now over a week old with no resolution. The comment volume reflects a mix of bot retries and maintainer triage — a notable drag on merge velocity.

2. **[#13078](https://github.com/QwenLM/qwen-code/issues/13078) — Daily dependency CVE audit failed (OPEN, 37 comments)**  
   A scheduled CVE audit has been failing since late September. The ambiguity between "new vulnerability" and "npm audit endpoint down" makes this a persistent triage burden and a potential security-signal blind spot.

3. **[#15173](https://github.com/QwenLM/qwen-code/issues/15173) — Main CI failed: E2E Tests, context-compress-interactive (OPEN, 23 comments)**  
   An E2E failure in the interactive context-compression test. Autofix is in progress, but the issue has been open for ten days, indicating the fix is non-trivial.

4. **[#12714](https://github.com/QwenLM/qwen-code/issues/12714) — Main CI failed: Qwen Code CI (OPEN, 17 comments)**  
   Open since September 25 — the longest-running CI failure thread. Multiple failure signatures are attached, suggesting a flaky or environment-dependent root cause that autofix has been unable to isolate.

5. **[#14859](https://github.com/QwenLM/qwen-code/issues/14859) — ci: track runner capacity and independent main validation (OPEN, 11 comments)**  
   A maintainer-authored proposal to track CI runner capacity and preserve independent validation on main. Notable because it reframes the CI failures as a capacity/throughput problem rather than purely a code problem, and explicitly retracts earlier percentage estimates.

6. **[#16005](https://github.com/QwenLM/qwen-code/issues/16005) — ecs-qwen-hz6-18 missing Node.js breaks Lint & Static (OPEN, 5 comments)**  
   A single pool host lacking Node.js causes red builds on unrelated commits because `Lint & Static` is a required check. A clear example of infrastructure debt producing false-negative signal for contributors.

7. **[#15276](https://github.com/QwenLM/qwen-code/issues/15276) — Windows desktop update fails, node.exe locked (OPEN, 4 comments)**  
   In-app updates on Windows fail at the file-copy stage because the bundled Node runtime holds a lock on `node.exe`. Affects all Windows desktop users attempting updates — a significant platform-specific blocker.

8. **[#15741](https://github.com/QwenLM/qwen-code/issues/15741) — MCP duplicate tool names discard the entire server (CLOSED, 3 comments)**  
   One MCP server with duplicate tool names causes the whole server to be discarded with a misleading "no tools" error. Closed quickly, but the diagnostic quality complaint is worth noting for future error-handling work.

9. **[#12514](https://github.com/QwenLM/qwen-code/issues/12514) — Session-commit registration gaps cause false amend blocks (OPEN, 5 comments)**  
   The session-commit registry doesn't cover every path/spelling that can land a commit, producing false "not made by the agent in this session" blocks. Affects git workflows and agent trust signals; a P2 security-adjacent correctness issue.

10. **[#16020](https://github.com/QwenLM/qwen-code/issues/16020) — Web Shell: ChatGPT-inspired activity view (OPEN, 2 comments)**  
    A fresh feature request for an activity view surfacing conversations needing input/approval. Fits the broader trend of session-management and discoverability improvements in the Web Shell.

---

## 4. Key PR Progress

1. **[#15982](https://github.com/QwenLM/qwen-code/pull/15982) — fix(cli): keep a long /btw answer readable in a bounded viewport**  
   Renders `/btw` side answers in a scrollable viewport capped at half the terminal, with mouse/wheel and keyboard scrolling. Addresses a real usability pain in the side-answer UI.

2. **[#16027](https://github.com/QwenLM/qwen-code/pull/16027) — fix(core): note failed servers on partial LSP diagnostics**  
   When one language server fails during a multi-server diagnostics query, the tool now preserves successful results and appends a `Note:` line per failed server. Better partial-failure semantics for LSP.

3. **[#14952](https://github.com/QwenLM/qwen-code/pull/14952) — fix(core): let the file crawler use the bundled ripgrep**  
   The `@`-file crawler now resolves the vendored ripgrep binary rather than a bare `rg` on `PATH`. Fixes search on installations that don't expose `rg` globally.

4. **[#15466](https://github.com/QwenLM/qwen-code/pull/15466) — feat(serve): add user-scope Skill activation routes**  
   Adds daemon routes to enable/disable Skills at user scope (single and batch up to 100), mirroring the extension activation API. Expands programmatic control over Skills.

5. **[#15440](https://github.com/QwenLM/qwen-code/pull/15440) — fix(managed-agent): join a child's answer the way its journal does**  
   Aligns how a parent session assembles a child's final answer text with the journal's own projection, preventing interleaved event boundaries from splitting text parts incorrectly.

6. **[#15684](https://github.com/QwenLM/qwen-code/pull/15684) — feat(managed-agent): materialize inert external workspaces**  
   Operator-only path to turn a registered external storage alias into a discoverable Workspace with delegated ownership — metadata only, no storage allocation.

7. **[#15928](https://github.com/QwenLM/qwen-code/pull/15928) — feat(web-shell): host mount entries + managed empty-state layout**  
   Adds non-React host mount surfaces (`renderManagedAgentWebShell`, `renderWebShellApp`) so hosts can embed the Web Shell without re-implementing chrome.

8. **[#15703](https://github.com/QwenLM/qwen-code/pull/15703) — fix(cli): align Skills config catalog with runtime discovery**  
   Fixes stale per-workspace Skill inventories by rebuilding when Skills are created directly on disk (including by the agent itself). Important for consistency between UI and runtime.

9. **[#15034](https://github.com/QwenLM/qwen-code/pull/15034) — fix(scripts): run workspace clean scripts on Windows**  
   Replaces `rm -rf` and `chmod +x` with cross-platform equivalents in four packages, unblocking Windows `cmd` builds. Part of a broader Windows-compatibility push.

10. **[#14140](https://github.com/QwenLM/qwen-code/pull/14140) — fix(cli): accept explicitly named Local Control addresses outside RFC 1918/3927**  
    Treats an explicit `--local-control-address` as operator intent, allowing non-RFC1918/3927 LAN addresses common in enterprise intranets.

---

## 5. Hot Discussions

No discussion data was provided in the source material; this section is omitted.

---

## 6. Feature Request Trends

Distilled from Issues and linked PRs:

- **Session management & discoverability:** Scheduled-task controller sessions absent from the session list (#12576); batch workspace live-state snapshots (#12511); ranked Web Shell session views.
- **Web Shell UX maturing toward parity with desktop apps:** ChatGPT-style activity view (#16020), touch-device composer focus handling (#15996), compact-layout navigation for Plugins (#15646).
- **Managed/daemon configuration control:** Settings to disable models.dev catalog refresh and honor privacy opt-outs (#16006); user-scope Skill activation routes (#15466); TTL-based sub-session cleanup (#14335).
- **CLI ergonomics:** Explicit-version updates without npm registry discovery (#11484); bounded `/btw` rendering (#15982).
- **LSP as a first-class capability:** User-scoped LSP enablement (#14613); graceful partial-failure diagnostics (#16027).
- **Windows parity:** Repeated requests and PRs targeting Windows install/update, script compatibility, and desktop runtime handling (#15276, #15034, #14951).

---

## 7. Developer Pain Points

- **CI reliability is the dominant frustration.** Five of the ten most-commented issues today are main-branch CI failures, several open for weeks. Bot-generated issues with `autofix/skip` and unresolved signatures (#14724, #15173, #12714, #13370) signal that automated remediation has plateaued.
- **Infrastructure-induced false failures.** Missing Node.js on a single runner (#16005) and disk exhaustion on Java lanes (#16003) turn red builds into noise unrelated to code, eroding trust in required checks.
- **Platform-specific breakage on Windows.** Locked `node.exe` blocking updates (#15276), script incompatibilities (#15034, #14951), and multiple pending Windows PRs indicate sustained friction for Windows developers.
- **Poor diagnostics from tools.** MCP duplicate tool names producing a misleading "no tools" error (#15741) and LSP partial failures needing explicit notes (#16027) reflect a recurring pattern: correct behavior masked by unhelpful error messages.
- **Correctness gaps in session/agent bookkeeping.** False amend blocks from incomplete session-commit registration (#12514), lock-lifecycle bugs in `SharedTokenManager` (#15653), and stale cross-process lock timings (#15991) point to ongoing edge-case work in concurrency and session state.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*