# AI CLI Tools Community Digest 2026-10-20

> Generated: 2026-10-20 10:11 UTC | Tools covered: 7

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
**Date: 2026-10-20**

---

## 1. Ecosystem Overview

The AI CLI developer tool landscape on 2026-10-20 shows a maturing ecosystem in which core agentic capabilities (multi-agent orchestration, MCP integration, permission models) have become table stakes, and differentiation is shifting toward reliability, observability, and cost transparency. All six tracked tools are actively iterating — five shipped releases or nightly builds within 24 hours — but the dominant community signal is not feature velocity; it is **trust erosion from silent failures, permission inconsistencies, and orchestration bugs** across every community. Windows and CJK/localization support remain persistent cross-platform pain points, while MCP OAuth lifecycle bugs constitute a shared, unresolved infrastructure-level problem affecting Claude Code, Copilot CLI, Codex, and Gemini CLI simultaneously. Meanwhile, secondary clients (mobile, web, remote/headless control) are emerging as a clear next battleground, with OpenCode and Codex users leading demand.

---

## 2. Activity Comparison

| Tool | Issues (24h) | PRs (24h) | Discussions | Release Status |
|---|---|---|---|---|
| **Claude Code** | ~11+ hot issues; large stale backlog | 2 | N/A (not provided) | v2.1.304 shipped |
| **OpenAI Codex** | ~10 hot issues; Windows cluster | 10 (all closed, bot-authored) | 2 Ideas, 1 Q&A, 5 Show-and-tell | 3 alphas (rust-v0.164.0-α.4–6) |
| **Gemini CLI** | ~10 hot + notable; "need-retesting" wave | 10 | N/A (not provided) | v0.66.0-nightly.20261020 |
| **GitHub Copilot CLI** | 10 hot; MCP OAuth cluster | 0 | N/A (not provided) | v1.0.100 + v1.0.101-0 |
| **OpenCode** | 50 updated; ~10 hot | 50 updated; 10 notable | N/A (not provided) | No release (v2.0.x no notes) |
| **Pi** | 15 notable; 2× P0 | 12 (mixed open/closed) | 1 Show-and-tell | No release |
| **Qwen Code** | 10 hot; CI-failure wave | 10 | N/A (not provided) | v0.25.3-nightly.20261019 |

**Notes on data completeness:**
- **Codex** is the only tool with structured Discussions activity (Ideas, Q&A, Show-and-tell); its PRs are overwhelmingly automated (`copyberry[bot]`) infrastructure work.
- **OpenCode** has the highest raw throughput (50 issues + 50 PRs updated), but this reflects an active v2 stabilization period rather than a larger community.
- **Copilot CLI** had zero PR activity — signal is concentrated entirely in Issues.
- Claude Code, Gemini CLI, Copilot CLI, OpenCode, and Qwen Code had no Discussions data in this window; this is reported as **N/A**, not as inactivity. GitHub Discussions is not the primary channel for these repos.
- Pi uses Discussions as a secondary channel (Show-and-tell only in this window).

---

## 3. Shared Feature Directions

Several requirements recur independently across communities, indicating industry-wide demand rather than tool-specific gaps:

**a) Cost, usage, and quota transparency**
- Codex: per-run usage/cost receipts (#53113), Reset Calendar (#55333)
- OpenCode: model cost in picker (#14524), context/capability display (#41287)
- Gemini CLI: numerical model routing for cost/quota control (#29824)
- Copilot CLI: empty-turn billing under auto-continue (#5149)

**b) MCP lifecycle, auth, and tool-loading control**
- Claude Code: OAuth token races (#90970), missing `CLAUDE_PLUGIN_ROOT` (#90968)
- Copilot CLI: token persistence/reuse/refresh cluster (#4695, #4203, #5192, #4994); deferred tool loading regressions (#5195, #5191)
- Pi: per-session MCP registration (#11067), host-owned server filtering (#11048)
- Gemini CLI: MCP pagination ignoring `nextCursor` (#29825)
- OpenCode: MCP tool search / deferred schema loading (#49645), disabling failed servers (#56452)

**c) Modular, composable agent configuration**
- Codex: `@include` directive for AGENTS.md (#17401, 👍25)
- Gemini CLI: AST-aware reads, skill/subagent discoverability (#21968, #22745)
- OpenCode: per-subagent model selection (#46122)
- Qwen Code: unified loop-protection setting across surfaces (#14828)

**d) Permission granularity and safety that reflects real risk**
- Claude Code: deny-rule bypass in Auto Mode (#88770); scheduled-task prompting (#89632)
- Copilot CLI: read vs. write distinction (#4443); lost manual-approval prompts (#5177)
- Gemini CLI: Folder Trust (#18245), destructive-git discouragement (#22672)
- Codex: safety over-blocking of legitimate read-only ops (#55427, #55405)

**e) Non-terminal / secondary client surfaces**
- OpenCode: mobile/web UI (#10288, 👍98), image paste/viewing (#44310, #47544)
- Codex: remote control of WSL instances (#14595, 👍18)
- Copilot CLI: ACP-mode parity for mid-turn steering (#5198)

**f) Session organization and lifecycle**
- Claude Code: folder/grouping in VS Code & Desktop sidebars (#75126, #81683, #83040)
- OpenCode: auto-resume, session tabs, restored delete/fork (#44819, #44681, #41265)
- Gemini CLI: persistent task tracking to replace `WriteToDo` (#18836, #21000)

---

## 4. Differentiation Analysis

| Dimension | Claude Code | Codex | Gemini CLI | Copilot CLI | OpenCode | Pi | Qwen Code |
|---|---|---|---|---|---|---|---|
| **Primary focus** | Plugin/mod ecosystem, multi-agent orchestration | Runtime/daemon hardening, enterprise policy | Agent reliability & AST efficiency | MCP + sandbox correctness | v2 stability + TUI redesign | Provider fidelity + durability APIs | Managed Agent architecture, CI hardening |
| **Target user** | Extensibility-first developers; plugin authors | Enterprise + Windows desktop | Cost/context-conscious agent users | GitHub-embedded + ACP integrators | Multi-session power users | SDK/embedding developers | Headless/daemon + hosted operators |
| **Tech approach** | Hook precedence, `decider:"person"` human-in-loop | RuntimeAuthManager, registry policy overrides | Numerical routing, zero-dep sandboxing proposals | ACP mode, bwrap sandboxing | new-designs TUI stack, MCP connection reclaim | Durable submission APIs, prompt-cache anchoring | Dual-path Managed Agent, PTY backend |
| **Signature pain** | Permission inconsistency across modes | Windows workspace-settings 403s | Silent false-success status | MCP OAuth lifecycle | Destructive undo/revert | CJK + Windows shell handling | CI instability |

**Key differentiators:**
- **Claude Code** leads on **plugin/mod governance** — the `decider:"person"` primitive and org-ceiling-over-plugins PR (#99540) show deliberate investment in enterprise-grade hook contracts, even as the Auto Mode deny-bypass (#88770) undermines that story.
- **Codex** is the most **infrastructure-heavy** — bot-driven PRs on runtime auth, registry overrides, and daemon recovery indicate a push toward managed/enterprise deployment rather than end-user features.
- **Gemini CLI** is uniquely focused on **token efficiency and agent self-awareness** (AST reads, routing control, skill discoverability), suggesting a positioning around cost-per-task.
- **Copilot CLI** is the most **MCP-and-sandbox-centric**, with an unusually coherent (if large) auth bug cluster and cross-platform sandbox regressions.
- **OpenCode** is in a **v2 transition** with the most raw churn and the strongest user appetite for non-terminal clients (mobile 👍98).
- **Pi** differentiates on **provider fidelity and durability semantics** (schema preservation, prompt-cache retention, embedding APIs) — a more SDK/host-integration posture than a daily-driver CLI.
- **Qwen Code** is alone in treating **CI/runner health and hosted multi-tenancy** as first-class community issues, reflecting a daemon/serve-oriented architecture.

---

## 5. Community Momentum & Maturity

**Highest raw activity:** OpenCode (50 issues + 50 PRs) — but this is v2-stabilization churn, not necessarily healthy growth.

**Most engaged community signal (by quality):**
- **Codex** — Discussions are active and roadmap-shaping (#12567 Memories, 37 comments; #14595 Remote control, 👍18). The maintainer actively solicits feedback, indicating a mature, two-way community process.
- **Claude Code** — Highest-severity, most-technical issue reports (security regressions, concurrency latch bugs). The community is sophisticated and holds the tool to enterprise standards, but a large fraction of issues carry `stale` labels and top reports date to July–August, signaling **backlog fatigue**.
- **Gemini CLI** — A "status/need-retesting" wave suggests maintainers are actively re-verifying old bugs, a positive maturity signal, though unresolved P1s (generalist hang #21409, 8👍) remain.

**Rapidly iterating:**
- **Codex** (3 alphas/24h) and **Copilot CLI** (2 releases/24h) show the fastest release cadence.
- **Qwen Code** ships nightlies with meaningful daemon features but is bottlenecked by CI instability.

**Maturity assessment:**
- **Most mature governance:** Claude Code (explicit hook precedence contracts), Codex (enterprise registry policy), Copilot CLI (signed plugin distribution via `ghapp://`).
- **Least mature process:** OpenCode (v2 releases ship with **no changelogs**, #52184 👍33 — a self-inflicted transparency gap).
- **Most stable release discipline:** Gemini CLI (nightly with meaningful changelogs).

---

## 6. Trend Signals

**1. Silent failures are the new top-tier bug class.**
Across Claude Code (#90921 delayed messages, #89364 silent 50% usage burn), Codex (#47910 tool stalls), and Gemini CLI (#22323 false GOAL success, #21983 browser false-complete), the highest-severity reports are failures that produce *no error and plausible-looking success*. **Implication for developers:** invest in agent-run observability (status honesty, cost receipts, transcript integrity) before adding features — users are explicitly filing that status signals are untrustworthy.

**2. MCP OAuth is an industry-wide infrastructure debt.**
Four of six tools report MCP auth/token lifecycle bugs in the same 24h window. This is a **shared protocol-level problem**, not a single-vendor issue. **Implication:** teams deploying MCP at scale should expect multi-session auth failures and plan re-auth fallbacks; there is no tool that has solved this cleanly.

**3. Permission models are being re-architected toward human-in-the-loop primitives.**
Claude Code's `decider:"person"`, Copilot CLI's `assistedApprovalInstructions`, and Gemini CLI's Folder Trust all point the same direction: **explicit, per-tool human approval contracts** rather than blanket mode toggles. But every tool also has a regression where those contracts silently fail. **Implication:** treat permission guarantees as untested until validated in your specific mode (Auto, ACP, scheduled, background).

**4. Cost/quota observability is now a baseline expectation.**
Per-run receipts, model-cost columns, reset calendars, and routing controls appear across Codex, OpenCode, Gemini CLI, and Copilot CLI. **Implication:** tools without transparent cost surfacing will lose autonomous/continuous-run users.

**5. The terminal is no longer the only surface.**
Mobile (OpenCode 👍98), remote/headless WSL control (Codex 👍18), and ACP-mode parity (Copilot CLI) signal that **multi-surface parity is the next competitive axis**. Terminal-first tools risk ceding on-the-go and embedded use cases.

**6. Windows and CJK/localization remain systematically under-tested.**
Windows regressions appear in Codex (workspace-settings cluster), Copilot CLI (plugin `os error 5`, WSL2 voice segfault), Pi (shell selection, silent Ctrl+G exit), OpenCode (CRLF corruption, TMPDIR), and Gemini CLI (CI skips). CJK bugs persist in Pi (#10154, #11163) and Qwen Code (IME on macOS+tmux, #8177). **Implication:** for international or Windows-heavy teams, budget for platform-specific breakage regardless of vendor.

**7. Prompt-cache fragility has direct cost implications.**
Pi's precise cacheRead traces (#10940: 153,472 → 0) show that tool-set mutations can silently invalidate cached prefixes — a **latent cost/latency tax** that most tools don't surface. **Implication:** developers optimizing token costs should monitor cache-hit behavior across tool changes, not just context size.

**8. Orchestration reliability is the weakest link in multi-agent workflows.**
Claude Code (auto-continue not arming, worktree latch, orchestrator not waiting), Codex (delegated work stalls), Gemini CLI (generalist hang), and Copilot CLI (child-agent tool scoping) all report orchestration bugs in the same window. **Implication:** multi-agent workflows are still not production-grade across any vendor; single-agent tasks remain the reliable default.

---

*Report compiled from 2026-10-20 community digests for Claude Code, OpenAI Codex, Gemini CLI, GitHub Copilot CLI, OpenCode, Pi, and Qwen Code. Counts reflect data as reported in source digests; N/A denotes channels not represented in the source snapshot, not confirmed inactivity.*

---

## Per-Tool Reports

<details>
<summary><strong>Claude Code</strong> — <a href="https://github.com/anthropics/claude-code">anthropics/claude-code</a></summary>

## Claude Code Skills Highlights

> Source: [anthropics/skills](https://github.com/anthropics/skills)

# Claude Code Skills — Community Highlights Report
*Data snapshot: 2026-10-20 | Source: github.com/anthropics/skills*

---

## 1. Top Skills Ranking (Most-Discussed PRs)

**1. skill-creator: isolate trigger evals + Windows/runtime fixes** — [PR #1298](https://github.com/anthropics/skills/pull/1298)
- **Function:** Fixes the meta-Skill that helps users author new Skills. Addresses false misses in trigger evaluation, Windows subprocess incompatibility (`select()` on pipes), and runtime failures being misclassified as non-triggers (which falsely passes negative examples).
- **Discussion:** High attention as the tooling layer every skill author depends on; updated 2026-09-16.
- **Status:** OPEN (draft-quality fix, unmerged).

**2. skill-creator: harden eval viewer (XSS + localhost server)** — [PR #1961](https://github.com/anthropics/skills/pull/1961)
- **Function:** Security hardening of `generate_review.py` / `viewer.html` — closes script breakout via embedded JSON, DNS rebinding, cross-site POST to the local feedback server, and output escaping gaps.
- **Discussion:** Part of a cluster of security reports on the eval viewer (see Issue #1394); suggests the reviewer UI is a genuine attack surface since eval outputs are model-generated/untrusted.
- **Status:** OPEN (updated 2026-10-11).

**3. mcp-builder: support `mcp>=2` `streamable_http_client` + custom headers** — [PR #1742](https://github.com/anthropics/skills/pull/1742)
- **Function:** Adapts the MCP server-building Skill to the renamed `streamable_http_client` import and the new `create_mcp_http_client` header configuration in `mcp>=2.0.0`.
- **Discussion:** Fixes Issue #1668; paired with Issue #1390 (evaluation harness scoring 0/N against real servers), pointing to a broader "MCP tooling lags SDK" theme.
- **Status:** OPEN (updated 2026-10-08).

**4. Two new Skills: notion-spec-to-implementation + quantitative-resume-auditor** — [PR #1245](https://github.com/anthropics/skills/pull/1245)
- **Function:** (a) Turns Notion product/tech specs into Claude-implementable tasks with acceptance criteria and progress tracking; (b) audits resumes with quantitative rigor.
- **Discussion:** Long-lived (created 2026-06-02, updated 2026-10-15) — a bundled submission that keeps resurfacing; the Notion workflow is one of the most-requested integration directions.
- **Status:** OPEN.

**5. proofcore-contract-auditor (Web3 smart-contract notarization)** — [PR #1771](https://github.com/anthropics/skills/pull/1771)
- **Function:** Static analysis of Solidity/Rust contracts with cryptographic audit proofs anchored to the TON Blockchain via ProofCore's zero-storage Merkle protocol.
- **Discussion:** Notable as a vendor-backed submission — raises namespace/trust questions (see Issue #492); updated 2026-09-16.
- **Status:** OPEN.

**6. md2video-audio (Markdown → narrated MP4)** — [PR #1703](https://github.com/anthropics/skills/pull/1703)
- **Function:** Zero-cost pipeline: Markdown → Marp slides → professional MP4 with realistic voiceover.
- **Discussion:** Highly watchable "content automation" submission; updated 2026-09-15.
- **Status:** OPEN.

**7. document-typography (typographic QC)** — [PR #514](https://github.com/anthropics/skills/pull/514)
- **Function:** Prevents orphan word wrap, widow paragraphs, and numbering misalignment in AI-generated documents.
- **Discussion:** One of the oldest active PRs (created 2026-03-04) — a "quality-of-life" Skill that touches *every* generated doc, yet has stalled for 7+ months.
- **Status:** OPEN.

**8. skill-quality-analyzer + skill-security-analyzer (marketplace meta-Skills)** — [PR #83](https://github.com/anthropics/skills/pull/83)
- **Function:** Two meta-Skills that score community Skills across structure/documentation (20% weight) and security dimensions before distribution.
- **Discussion:** Directly responsive to the namespace-trust controversy (Issue #492); oldest submission in the top set (2025-11-06).
- **Status:** OPEN.

---

## 2. Community Demand Trends (Issues)

| Direction | Evidence | Signal |
|---|---|---|
| **Governance & trust of the Skills supply chain** | [Issue #492](https://github.com/anthropics/skills/issues/492) (46 comments) — community skills impersonating `anthropic/` namespace; [Issue #189](https://github.com/anthropics/skills/issues/189) — duplicate content across plugins | Highest-comment issue by far: users want signing, namespacing, and provenance |
| **Skills as shareable team assets** | [Issue #228](https://github.com/anthropics/skills/issues/228) — org-wide skill library / share links (8 👍) | Enterprise distribution friction; #1 in upvotes |
| **Reliable evaluation & triggering** | [Issue #556](https://github.com/anthropics/skills/issues/556) — 0% trigger rate in `run_eval.py` (13 comments); [Issue #1383](https://github.com/anthropics/skills/issues/1383) — six reproducible eval bugs | Eval harness reliability is the #1 technical pain point |
| **Context-budget discipline** | [Issue #1487](https://github.com/anthropics/skills/issues/1487) — `claude-api` injects ~156k tokens (4 comments) | Demand for lazy-loading / token-efficient skill design |
| **Richer document & media formats** | ODT ([PR #486](https://github.com/anthropics/skills/pull/486)), docx comment detection ([PR #1734](https://github.com/anthropics/skills/pull/1734)), docx XML correctness ([Issue #2018](https://github.com/anthropics/skills/issues/2018)) | Office-format fidelity and media generation remain the most-submitted Skill category |
| **Agent memory & reasoning quality gates** | [Issue #1329](https://github.com/anthropics/skills/issues/1329) — compact symbolic memory; [Issue #1385](https://github.com/anthropics/skills/issues/1385) — pre-task/adversarial/delivery gates; [Issue #412](https://github.com/anthropics/skills/issues/412) — agent governance (closed) | Movement beyond "helper skills" toward agent-lifecycle control |

---

## 3. High-Potential Pending Skills (Active, Unmerged)

| Skill | Link | Why it may land soon |
|---|---|---|
| **Docx tooling fixes** — orphan-comment detection [#1734](https://github.com/anthropics/skills/pull/1734), LibreOffice timeout reporting [#1792](https://github.com/anthropics/skills/pull/1792) | Small, scoped, test-backed; docx is a core bundled Skill |
| **algorithmic-art: `wrapAround()` fix** [#1977](https://github.com/anthropics/skills/pull/1977) + **webapp-testing: textarea/select reporting** [#1976](https://github.com/anthropics/skills/pull/1976) | Same author, both fix referenced issues (#1897, #1891), active as of 2026-10-18 — classic "trivial merge" candidates |
| **skill-creator: YAML frontmatter parser fix** [#1997](https://github.com/anthropics/skills/pull/1997) | Fresh (2026-10-10), addresses metadata drift in eval/optimization commands |
| **package_skill.py direct execution fix** [#1681](https://github.com/anthropics/skills/pull/1681) | `ModuleNotFoundError` is a hard blocker for standalone use; updated 2026-10-08 |
| **scnet-hpc** [#1615](https://github.com/anthropics/skills/pull/1615) | Niche but complete: SSH+Slurm cluster ops via profiles |
| **architecture-advisor** [#2040](https://github.com/anthropics/skills/pull/2040) | Newest in top set (2026-10-16); fourth skill of a coherent SDD suite — likely to evolve with PR #2039 |

---

## 4. Skills Ecosystem Insight

**The community's most concentrated demand is no longer "more Skills" but a trustworthy, evaluable, and token-disciplined Skills *infrastructure* — secure namespacing/provenance, reliable trigger evals, and lean context usage — without which the flood of new Skill submissions (document automation, Web3, video, HPC) cannot be safely adopted.**

---

# Claude Code Community Digest — 2026-10-20

## 1. Today's Highlights

A significant permissions regression dominates today's activity: Issue #88770 reports that explicit `permissions.deny` rules (e.g., `Bash(curl *)`) are silently bypassed under Auto Mode while working correctly in manual mode — a serious security concern. The latest release (v2.1.304) focuses on plugin hook transparency and a new `decider: "person"` option for tool-permission checks, reinforcing human-in-the-loop approval. Meanwhile, reusable "stale" traffic continues on scheduling, subagent orchestration, and MCP/plugin integration bugs across Desktop, VS Code, and Cowork.

---

## 2. Releases

**v2.1.304**
- Added a transcript line when a plugin that runs first **skips one of your mod's hooks**, naming the event and the plugin — improving visibility into plugin hook precedence.
- Added `decider: "person"` to a mod's `tool.check` answer: only the **permission dialog or a host callback** can approve the ask; otherwise it is refused with the mod's configured response. This gives mod authors a way to force explicit human approval for sensitive tool calls.
- 🔗 https://github.com/anthropics/claude-code/releases

---

## 3. Hot Issues

1. **[#88770](https://github.com/anthropics/claude-code/issues/88770) — `permissions.deny` silently bypassed under Auto Mode** (👍 2)
   Explicit deny rules for Bash commands are not enforced in Auto Mode but work in manual mode — same machine, same `settings.json`. Highest-severity item today; a security posture gap users should know about.

2. **[#89632](https://github.com/anthropics/claude-code/issues/89632) — Scheduled tasks run under interactive ask-every-tool permissions** (6 comments, Windows)
   Local scheduled tasks are framed as *unattended* (the harness injects a `<scheduled-task>` wrapper), yet still prompt per tool. Breaks the core promise of unattended automation; most-discussed issue today.

3. **[#89263](https://github.com/anthropics/claude-code/issues/89263) — Auto-continue never arms when limit kills only background subagents** (👍 1)
   Background agents die on session-limit; the main thread idles and never resumes at reset. Exposes a gap in the auto-continue state machine for the subagent path.

4. **[#89102](https://github.com/anthropics/claude-code/issues/89102) — `EnterWorktree` flips a session-wide isolation latch, breaking Bash for concurrent agents**
   Entering a worktree while subagents run poisons Bash for *every* agent, including those in their own worktrees. A concurrency/isolation correctness bug with real multi-agent impact.

5. **[#90970](https://github.com/anthropics/claude-code/issues/90970) — Slack MCP OAuth token race → `CONNECT_TIMEOUT` in all but the latest session**
   Only the session that most recently minted an OAuth token can connect; others hang 30s. Misleadingly looks like a network issue. High-impact for multi-session MCP users.

6. **[#90968](https://github.com/anthropics/claude-code/issues/90968) — MCP `headersHelper` runs without `CLAUDE_PLUGIN_ROOT` on Desktop (regression)**
   Plugin-provided HTTP MCP servers fall into doomed OAuth/DCR flows. A regression from ≤2.1.221 affecting the plugin + Desktop combination.

7. **[#91011](https://github.com/anthropics/claude-code/issues/91011) — Planning mode: orchestrator keeps working instead of waiting for subagents**
   Redundant, concurrent work during orchestration; flagged as a regression. Directly undermines multi-agent planning workflows.

8. **[#90921](https://github.com/anthropics/claude-code/issues/90921) — macOS Desktop: user messages silently delayed 5–10 min, scaling with concurrent sessions**
   3.4% failure at 1 session → 21.1% at 4 sessions, with no error or spinner. A quantified reliability regression in the Desktop→CLI handoff.

9. **[#89779](https://github.com/anthropics/claude-code/issues/89779) — Background Bash task SIGTERM'd by harness, correlated with memory-pressure**
   A `run_in_background` deploy-watch was killed with no user action. Raises questions about background task lifecycle guarantees under system pressure.

10. **[#90997](https://github.com/anthropics/claude-code/issues/90997) — `terminalSequence` from `async: true` hook parsed then dropped**
    The sequence is schema-validated and carried into the attachment but never emitted — a narrow but confusing hook-contract bug.

*Also notable:* [#81916](https://github.com/anthropics/claude-code/issues/81916) — bundled ugrep busy-loops at 100% CPU when `--ignore-files` resolves to a directory named `.gitignore`; orphaned children saturate the machine.

---

## 4. Key PR Progress

Only two PRs were updated in the window; both are from the same author and describe internal diff/engine and policy-mod behavior:

1. **[#99141](https://github.com/anthropics/claude-code/pull/99141) — diff: pane preservation until a drawer attaches**
   A `/diff` pane opened before any host can draw it is retained and appears once something can. Stacked on #99118. Improves robustness of the diff UI lifecycle for hosts with delayed page attachment.

2. **[#99540](https://github.com/anthropics/claude-code/pull/99540) — sec-default: org tool ceiling holds over user-installed plugins**
   An organization's required-approval policy now extends over plugins a person installs, and every deciding hook carries a `.catch`. Relevant to the broader permissions/security theme highlighted by #88770.

> Note: With only 2 PRs in the 24h window, PR throughput is low; the community signal this period is overwhelmingly in Issues.

---

## 5. Hot Discussions

No Discussions data was provided for this window, so this section is omitted.

---

## 6. Feature Request Trends

Distilled from Issues (enhancement-tagged and implicit requests):

- **Session organization in UI panels** — Folder/grouping for the VS Code session list ([#75126](https://github.com/anthropics/claude-code/issues/75126), 👍 7) and project-scoped grouping for the Desktop sidebar ([#81683](https://github.com/anthropics/claude-code/issues/81683)), plus grouping by git worktree/branch ([#83040](https://github.com/anthropics/claude-code/issues/83040), 👍 5). Session sprawl is the top UX pain.
- **Multi-agent knowledge sharing** — Let Claude instances share context by link/communication rather than copying ([#91001](https://github.com/anthropics/claude-code/issues/91001)).
- **Context persistence across turns** — Reduce repeated work / re-explaining ([#90975](https://github.com/anthropics/claude-code/issues/90975)).
- **Longer default feedback timeout** for long-running CLI commands beyond 120s ([#91006](https://github.com/anthropics/claude-code/issues/91006)).
- **Model choice flexibility** — Support alternative models beyond Opus 5; users strongly prefer Fable ([#91002](https://github.com/anthropics/claude-code/issues/91002)).
- **Nuanced safety filtering** — Reduce over-aggressive classifier blocks on legitimate dev work ([#90999](https://github.com/anthropics/claude-code/issues/90999), [#90998](https://github.com/anthropics/claude-code/issues/90998)).

---

## 7. Developer Pain Points

- **Permission model inconsistency is the top theme.** Deny rules bypassed in Auto Mode (#88770), scheduled tasks prompting despite being "unattended" (#89632), and external API actions posted without explicit confirmation (#91007) all point to a permission system whose guarantees don't hold across modes and async paths.
- **Subagent/orchestration reliability.** Auto-continue not arming (#89263), worktree isolation latch breaking concurrency (#89102), and orchestrator not waiting in planning mode (#91011) collectively erode trust in multi-agent workflows.
- **MCP/plugin integration fragility.** Token races (#90970), missing `CLAUDE_PLUGIN_ROOT` (#90968), remote-server prompts never surfacing in VS Code (#90979), and scheduled tasks not attaching MCP tools (#90972) show a rough edge in the plugin ecosystem.
- **Silent failures with costly side effects.** Desktop message delays (#90921) and a Cowork browser call consuming ~50% of usage with no output ([#89364](https://github.com/anthropics/claude-code/issues/89364)) — cost and latency failures are silent rather than surfaced.
- **Tool correctness edge cases.** Escape-sequence decoding in Edit/Write ([#82614](https://github.com/anthropics/claude-code/issues/82614)), invalid JSON escapes in StructuredOutput ([#79019](https://github.com/anthropics/claude-code/issues/79019)), and the ugrep busy-loop (#81916) cause silent, hard-to-repair breakage.
- **Stale backlog fatigue.** A large fraction of today's issues carry the `stale` label, and several top reports date from July–August — contributors are re-pinging on unresolved long-tail bugs.

---

*Compiled from github.com/anthropics/claude-code activity on 2026-10-20.*

</details>

<details>
<summary><strong>OpenAI Codex</strong> — <a href="https://github.com/openai/codex">openai/codex</a></summary>

# OpenAI Codex Community Digest — 2026-10-20

## 1. Today's Highlights

The Codex `rust-v0.164.0-alpha` line continues its rapid iteration with three new alpha builds (alpha.4–alpha.6) in 24 hours, signaling active stabilization work ahead of the next minor release. On the issue tracker, Windows desktop stability dominates discussion: a cluster of three related reports (#51917, #52790, #54168, #51691, #55489) traces "Couldn't load workspace settings" failures to Cloudflare challenges on `/settings/user` and `/accounts/check`, blocking new chats for Plus/Pro users. Meanwhile, a large batch of closed PRs from `copyberry[bot]` lands infrastructure work spanning runtime auth sharing, runtime agent registration, and diagnostics—suggesting the team is hardening the daemon/app-server layer.

## 2. Releases

Three pre-release builds published in the last 24h, all on the `0.164.0-alpha` track:

- **rust-v0.164.0-alpha.6**, **alpha.5**, **alpha.4** — release notes are empty stubs; no user-facing changelog is provided. The cadence (three alphas in ~24h) implies incremental, possibly CI-driven builds rather than feature releases. No action needed unless you track `main` closely.

## 3. Hot Issues (Top 10)

1. **#51917 — [Windows] "Couldn't load workspace settings" blocks new chats after update** (25 comments, 👍8) — The highest-engagement issue today. Reporter confirms the bug persists across app version `26.1007.21434`. This is the canonical thread for the Windows workspace-settings regression.
   https://github.com/openai/codex/issues/51917

2. **#17401 — `@include` directive for composable AGENTS.md files** (16 comments, 👍25) — The most-upvoted issue in this batch. Requests modular `@path/to/file.md` inlining at instruction-assembly time. High demand for maintainable, multi-file agent configs.
   https://github.com/openai/codex/issues/17401

3. **#49883 — [Dots/macOS] Delegated work stalls after task completion or approval blocker** (14 comments) — Subagent/orchestration reliability on macOS. Affects the Dots feature and required repeated reminders; a real workflow blocker for delegated tasks.
   https://github.com/openai/codex/issues/49883

4. **#19932 — [Intel macOS] Computer Use unavailable, bundled plugin missing** (10 comments) — Long-standing (since April) and still open. Intel Mac users cannot access Computer Use at all; a hardware-parity gap.
   https://github.com/openai/codex/issues/19932

5. **#55444 — CLI: all models report "Selected model is at capacity" on one Plus account** (5 comments) — Opened today. `codex-cli 0.162.1`, multiple models (`gpt-6-sol`, `gpt-5.6-sol medium`) all fail despite quota. Possible account/rate-limit routing bug.
   https://github.com/openai/codex/issues/55444

6. **#32222 — App-server daemon restart stalls on unreaped zombie after update** (6 comments) — Daemon lifecycle bug: new updater waits on old updater to release a lifecycle lock. Affects managed auto-updates.
   https://github.com/openai/codex/issues/32222

7. **#47910 — [Windows Desktop] Tool calls stall for hours; `/feedback` blocked by invalid `codex_app` transport** (6 comments) — Session JSONL evidence shows root turns waiting indefinitely on tool results. Serious reliability issue for long-running Windows sessions.
   https://github.com/openai/codex/issues/47910

8. **#45061 — Unrelated gambling/adult terms appear in auto-generated titles and agent output** (5 comments) — Model-behavior bug producing spam-like Chinese suffixes in conversation titles. Unsettling for users; likely a data/decoding artifact worth tracking.
   https://github.com/openai/codex/issues/45061

9. **#53113 — Expose per-run usage and cost receipts in hosted Codex** (4 comments) — Enhancement for autonomous research workflows. Users running continuous programs need cost observability; a clear billing-transparency request.
   https://github.com/openai/codex/issues/53113

10. **#55134 — [CLI 0.163.0][Ghostty] Scrolling past transcript leaks mouse-report text and interrupts the agent** (2 comments, 👍2) — TUI/terminal-emulator interaction bug that actively interrupts agent runs. Niche but disruptive for Ghostty users.
    https://github.com/openai/codex/issues/55134

## 4. Key PR Progress (Top 10)

Note: all PRs listed are **CLOSED**; most are authored by `copyberry[bot]`, indicating automated or batch-merged infrastructure work.

1. **#55413 — Share runtime authentication across requests and credential refreshes** — Introduces `RuntimeAuthManager` for request-scoped auth with shared runtimes. Foundational for multi-credential sessions.
   https://github.com/openai/codex/pull/55413

2. **#55402 — Add ephemeral runtime registration and signed assertions** — Extends `codex-runtime-agent-instance` with registration client + in-memory assertion signer. Security-relevant for runtime identity.
   https://github.com/openai/codex/pull/55402

3. **#55398 — Add wire types for runtime agent registration** — Serialization contracts for OAuth/PAT/API-key registration requests. Pairs with #55402.
   https://github.com/openai/codex/pull/55398

4. **#55456 — Support Windows registry overrides for `requirements.toml`** — Reads `RequirementsPath` from `HKLM\SOFTWARE\Policies\OpenAI\Codex`. Enterprise policy support for Windows.
   https://github.com/openai/codex/pull/55456

5. **#55442 — Check daemon feature overrides and prompt for mismatch recovery** — Fixes silent fallback to embedded mode on feature mismatch; adds confirmation for persisted overrides.
   https://github.com/openai/codex/pull/55442

6. **#55441 — Add cancellation for experimental thread samples** — New `thread/sample/cancel` request. Completes the sampling API surface.
   https://github.com/openai/codex/pull/55441

7. **#55401 — Defer environment disconnect notifications until recovery fails** — Adds `EnvironmentConnectionState::Recovering` to suppress false disconnect notifications during transient transport loss.
   https://github.com/openai/codex/pull/55401

8. **#55397 — Record OAuth provenance and login identity for account tokens** — Persists issuer/client ID and `login_owner_*` for correct token refresh; also redacts OAuth error bodies.
   https://github.com/openai/codex/pull/55397

9. **#55395 — Roll back interrupted Guardian reviews to preserve evidence** — Fixes cancelled/timed-out reviews leaving sessions without needed transcript evidence.
   https://github.com/openai/codex/pull/55395

10. **#55411 — Render async question prompts as Markdown in the TUI** — UX fix: emphasis, fenced code, and labeled links now render properly in async prompts.
    https://github.com/openai/codex/pull/55411

## 5. Hot Discussions

**Ideas**
- **#12567 — Memories in Codex** (37 comments, 👍14) — Most active discussion. Maintainer `jif-oai` soliciting feedback on memory citation behavior and per-thread memory controls. Directly shapes a roadmap feature.
  https://github.com/openai/codex/discussions/12567
- **#14595 — Remote control, when?** (9 comments, 👍18) — Highest-upvoted discussion. Strong demand for remote control of WSL Codex instances, with Claude Code cited as a comparison point.
  https://github.com/openai/codex/discussions/14595

**Q&A**
- **#55525 — Can't view the previous fork** (0 comments, 👍1) — `codex --fork` then `codex resume` hides the pre-fork point. Unresolved usability question.
  https://github.com/openai/codex/discussions/55525

**Show and tell**
- **#53955 — Unmix** (2 comments) — Local MCP server + Git task ledger for removing a recorded dev decision and adapting retained changes.
  https://github.com/openai/codex/discussions/53955
- **#55421 — TAHU** (1 comment) — Python authorization-gateway prototype; seeking 3 developer trials for agent email without leaking staff notes.
  https://github.com/openai/codex/discussions/55421
- **#55203 — Two agent skills from a failure log** (1 comment) — "Done" needs evidence; stop after two identical failures. Practical agent-discipline patterns.
  https://github.com/openai/codex/discussions/55203
- **#55099 — Goal Instruction Writer** (1 comment) — MIT-licensed skill for keeping multi-day tasks tied to observable outcomes.
  https://github.com/openai/codex/discussions/55099
- **#55333 — Codex Reset Calendar** (0 comments) — Free browser calendar distinguishing public reset events from personal usage windows.
  https://github.com/openai/codex/discussions/55333

## 6. Feature Request Trends

- **Modular/observable agent configuration** — `@include` for AGENTS.md (#17401, 25 upvotes) plus "Goal Instruction Writer" and evidence-based "done" skills (#55203, #55099) show demand for maintainable, verifiable instruction composition.
- **Cost and usage transparency** — #53113 requests per-run usage/cost receipts; the Reset Calendar (#55333) addresses reset/usage-window confusion. Billing observability is a recurring theme.
- **Remote/headless control** — #14595 (18 upvotes) makes a clear case for remote control of Codex instances, specifically for WSL setups.
- **Font/appearance granularity** — #25281 asks to split UI/code/terminal/chat font settings in the macOS app; a smaller but persistent polish request.
- **Memory integration** — #12567 shows the team actively designing memories, with users weighing citation transparency against per-thread control.

## 7. Developer Pain Points

- **Windows desktop workspace-settings failures** are the single largest cluster today (#51917, #52790, #54168, #51691, #55489). Root cause is repeatedly traced to `403 cloudflare_challenge` and `432 Workspace routing is unavailable` on `/settings/user` and `/accounts/check`. Re-login restores access only temporarily—a serious session-durability problem.
- **Long-running tool-call stalls** on Windows (#47910) and macOS delegated work (#49883) erode trust in autonomous/multi-step execution.
- **Daemon/app-server lifecycle fragility** — zombie-lock stalls (#32222) and invalidation of cached model metadata on catalog timeout (#54878) point to brittleness in the managed-update and remote-provider paths.
- **Safety/auto-review over-blocking** — read-only Git verification denied as "prompt-injection scope drift" (#55427), Browser Use site blocks without an approval path (#54886), and `cyber_policy` blocks (#55405) frustrate legitimate workflows.
- **Permission persistence broken** — `@computer` repeatedly ignores "Always allow" (#55527), compounding friction for Computer Use.
- **Rate-limit/account routing anomalies** — #55444 (all models "at capacity" on a single Plus account) suggests backend quota-routing issues worth monitoring.

---
*Generated from github.com/openai/codex data for 2026-10-20. All links point to upstream issues, PRs, and discussions.*

</details>

<details>
<summary><strong>Gemini CLI</strong> — <a href="https://github.com/google-gemini/gemini-cli">google-gemini/gemini-cli</a></summary>

# Gemini CLI Community Digest — 2026-10-20

## 1. Today's Highlights

The nightly channel shipped **v0.66.0-nightly.20261020.g76e4d7c04**, headlined by a terminal scrollback preservation fix and a fix for streamed Node HTTP chunk decoding. Agent reliability continues to dominate the backlog: top-issue volume clusters around subagent lifecycle reporting, hangs in the generalist agent, and configuration overrides being silently ignored. A broad wave of "status/need-retesting" issues suggests maintainers are actively re-verifying long-standing agent bugs against recent nightlies.

## 2. Releases

**v0.66.0-nightly.20261020.g76e4d7c04**

- `fix(ui)`: Preserve terminal scrollback during viewport refreshes ([PR #29792](https://github.com/google-gemini/gemini-cli/pull/29792)) — addresses flicker/lost-history complaints in long sessions.
- `fix(cli)`: Decode streamed Node HTTP activity chunks with `StringDecoder` ([PR #29793 batch](https://github.com/google-gemini/gemini-cli/pull/29837)) — prevents multi-byte UTF-8 corruption in streamed activity output.
- Version bump: [PR #29837](https://github.com/google-gemini/gemini-cli/pull/29837)

## 3. Hot Issues

1. **[#22323](https://github.com/google-gemini/gemini-cli/issues/22323) — Subagent MAX_TURNS reported as GOAL success** (13 comments, P1). `codebase_investigator` reports `status: "success"` / `Termination Reason: "GOAL"` despite hitting the turn limit with no analysis performed. This masks truncation as success and corrupts downstream automation — the highest-engagement issue today.
2. **[#21409](https://github.com/google-gemini/gemini-cli/issues/21409) — Generalist agent hangs forever** (8 comments, 8 👍, P1). Simple operations like folder creation hang indefinitely when delegation occurs; instructing the model not to delegate is the community workaround. Strong upvote signal.
3. **[#19873](https://github.com/google-gemini/gemini-cli/issues/19873) — Zero-dependency OS sandboxing + post-execution intent routing** (9 comments, P2). Proposes leaning into Gemini 3's native bash affinity via sandboxing rather than restricting shell use — a significant architectural direction for agent capability vs. safety.
4. **[#22745](https://github.com/google-gemini/gemini-cli/issues/22745) — AST-aware file reads, search, and mapping EPIC** (7 comments, P2). Tracks whether AST tooling reduces misaligned reads and context bloat; directly tied to token-efficiency concerns.
5. **[#21968](https://github.com/google-gemini/gemini-cli/issues/21968) — Gemini under-uses skills and sub-agents** (7 comments, P2). Users report skills like `gradle`/`git` are ignored unless explicitly invoked — a discoverability problem in model routing.
6. **[#21983](https://github.com/google-gemini/gemini-cli/issues/21983) — Browser subagent fails on Wayland** (4 comments, P1). Linux/Wayland users see the browser agent terminate with GOAL despite failure — a platform-specific reliability gap.
7. **[#22267](https://github.com/google-gemini/gemini-cli/issues/22267) — Browser Agent ignores `settings.json` overrides** (4 comments, P2). `maxTurns` and similar configs are silently dropped despite correct `AgentRegistry` merge — a config-trust bug.
8. **[#18245](https://github.com/google-gemini/gemini-cli/issues/18245) — Folder Trust & security review flags** (4 comments, P3, 🛠️ In Progress). Public-roadmap security work to restrict agent file-system access on initialization.
9. **[#24246](https://github.com/google-gemini/gemini-cli/issues/24246) — 400 error with >128 tools** (3 comments, P2). Users hitting tool-count ceilings want smarter in-scope tool limiting.
10. **[#29825](https://github.com/google-gemini/gemini-cli/issues/29825) — MCP pagination ignores `nextCursor`** (1 comment, new). Newly filed: multi-page `tools/list` responses silently drop tools past page one — a correctness issue for large MCP servers.

*Also notable:* [#22672](https://github.com/google-gemini/gemini-cli/issues/22672) (destructive `git reset`/`--force` behavior), [#20079](https://github.com/google-gemini/gemini-cli/issues/20079) (symlinked agent files not recognized), [#23571](https://github.com/google-gemini/gemini-cli/issues/23571) (tmp script litter).

## 4. Key PR Progress

1. **[#29838](https://github.com/google-gemini/gemini-cli/pull/29838) — Resolve relative paths against IDE workspace root** (P1, size/l). Fixes `WriteFileTool`/`EditTool`/`ReadFileTool` using stale `config.getTargetDir()` instead of the active IDE workspace — a high-impact correctness fix.
2. **[#29824](https://github.com/google-gemini/gemini-cli/pull/29824) — Numerical model routing** (P2, help wanted). Adds configurable complexity score bands (`routing.numericalRules`) so users control cost/quota/capability routing beyond Flash/Pro thresholds.
3. **[#29831](https://github.com/google-gemini/gemini-cli/pull/29831) — Surface ripgrep timeouts as errors** (size/l). Stops returning partial matches as "No matches found" or silent partials when the timeout fires.
4. **[#29822](https://github.com/google-gemini/gemini-cli/pull/29822) — Cap `total_max_matches` and clarify context overflow** (P2, help wanted). Hardens `SearchText` against context-window overflow (#17448).
5. **[#29718](https://github.com/google-gemini/gemini-cli/pull/29718) — `--userns=keep-id` for rootless Podman sandboxes** (P2). Fixes `EACCES` for non-root Podman users in sandboxed execution.
6. **[#29703](https://github.com/google-gemini/gemini-cli/pull/29703) — Atomic-write temp name within `NAME_MAX`**. Fixes `ENAMETOOLONG` when writing files whose names are 215–255 bytes.
7. **[#29810](https://github.com/google-gemini/gemini-cli/pull/29810) — Preserve `generateContentConfig` for tier aliases**. Fixes custom aliases silently losing config when resolving to `flash-lite`/`flash`/`pro`/`auto`.
8. **[#29726](https://github.com/google-gemini/gemini-cli/pull/29726) — Fix sandbox `trap` wrapper misidentification** (size/l). Restores per-command `sandbox.toml` rules and session approvals on POSIX.
9. **[#29727](https://github.com/google-gemini/gemini-cli/pull/29727) — Report omitted `list_directory` entries**. Prevents silent zero-entry results when path validation rejects files.
10. **[#29841](https://github.com/google-gemini/gemini-cli/pull/29841) — GitHub shorthand for extension installs** (`owner/repo`, `github.com/owner/repo`, `github:owner/repo`).

*Also merged/closed:* [#29638](https://github.com/google-gemini/gemini-cli/pull/29638) (remove VS Code marketplace update check on startup), [#29647](https://github.com/google-gemini/gemini-cli/pull/29647) / [#29691](https://github.com/google-gemini/gemini-cli/pull/29691) (Windows CI skips for `pwsh.exe`/symlink privilege).

## 5. Hot Discussions

No discussion data was provided for this window.

## 6. Feature Request Trends

- **Agent autonomy & self-awareness:** Better subagent trajectory visibility ([#22598](https://github.com/google-gemini/gemini-cli/issues/22598)), self-knowledge of CLI flags/hotkeys ([#21432](https://github.com/google-gemini/gemini-cli/issues/21432)), and stronger skill/sub-agent invocation ([#21968](https://github.com/google-gemini/gemini-cli/issues/21968)).
- **Context/token efficiency:** AST-aware reads and codebase mapping ([#22745](https://github.com/google-gemini/gemini-cli/issues/22745), [#22746](https://github.com/google-gemini/gemini-cli/issues/22746)), "Tactful Extraction" surgical reads ([#19561](https://github.com/google-gemini/gemini-cli/issues/19561)), and persistent task tracking to replace `WriteToDo` ([#18836](https://github.com/google-gemini/gemini-cli/issues/18836), [#21000](https://github.com/google-gemini/gemini-cli/issues/21000)).
- **Security & safety:** Folder Trust ([#18245](https://github.com/google-gemini/gemini-cli/issues/18245)), discouraging destructive git/DB operations ([#22672](https://github.com/google-gemini/gemini-cli/issues/22672)), and per-workspace policy scoping ([#18397](https://github.com/google-gemini/gemini-cli/issues/18397)).
- **Cost/quota control:** Numerical model routing ([#29824](https://github.com/google-gemini/gemini-cli/pull/29824)).

## 7. Developer Pain Points

- **Silent failure masking:** Multiple high-priority bugs report false success states — `GOAL` on turn-limit hit ([#22323](https://github.com/google-gemini/gemini-cli/issues/22323)), browser agent claiming completion on Wayland ([#21983](https://github.com/google-gemini/gemini-cli/issues/21983)), ripgrep partials as "no matches" ([#29831](https://github.com/google-gemini/gemini-cli/pull/29831)). Developers cannot trust agent status signals.
- **Hangs and stuck sessions:** The generalist agent hang ([#21409](https://github.com/google-gemini/gemini-cli/issues/21409)) and vite interactive-prompt deadlock ([#22465](https://github.com/google-gemini/gemini-cli/issues/22465)) remain unresolved.
- **Configuration not honored:** `settings.json` overrides ignored by browser agent ([#22267](https://github.com/google-gemini/gemini-cli/issues/22267)), tier alias config loss ([#29810](https://github.com/google-gemini/gemini-cli/pull/29810)), and cache/URL-handling regressions (e.g., [PR #29797](https://github.com/google-gemini/gemini-cli/pull/29797)).
- **Windows/CI test friction:** Repeated skips for missing `pwsh.exe` and symlink privileges ([#29647](https://github.com/google-gemini/gemini-cli/pull/29647), [#29691](https://github.com/google-gemini/gemini-cli/pull/29691)) point to ongoing cross-platform test fragility.
- **Context overflow & workspace hygiene:** Broad grep overflowing context ([#29822](https://github.com/google-gemini/gemini-cli/pull/29822)) and stray tmp scripts littering repos ([#23571](https://github.com/google-gemini/gemini-cli/issues/23571)).

---

*Generated from github.com/google-gemini/gemini-cli activity on 2026-10-20. Counts reflect comments and 👍 as shown in the source data.*

</details>

<details>
<summary><strong>GitHub Copilot CLI</strong> — <a href="https://github.com/github/copilot-cli">github/copilot-cli</a></summary>

# GitHub Copilot CLI Community Digest — 2026-10-20

## Today's Highlights
Two releases landed in the last 24 hours: **v1.0.100** introduces client telemetry opt-out (`--disable-client-telemetry`), `--trust-folder` for one-off prompt sessions, and verified Skills/plugins installation from GitHub install links, while **v1.0.101-0** adds native structured output for dynamic workflow subagents and an `assistedApprovalInstructions` setting. The issue tracker remains dominated by **MCP OAuth token lifecycle bugs** (persistence, reuse, silent refresh, and ACP-mode re-auth loops) and **sandbox/permission regressions** across macOS, Linux, and ACP mode. Several October harness-migration regressions are still open and gaining traction.

## Releases
**v1.0.101-0** (latest)
- **Added**: Native structured output for dynamic workflow subagents on supported models; `assistedApprovalInstructions` setting to guide Assisted Permissions confirmation decisions.
- **Fixed**: Shared MCP auth errors now point to your client's sign-in settings (CLI authentication warnings still surfaced).

**v1.0.100** (2026-10-19)
- Added `--disable-client-telemetry` to turn off client telemetry uploads from the CLI.
- Added `--trust-folder` for one-off prompt-mode sessions started with `-p` or piped stdin.
- Added support for installing verified Skills and plugins from GitHub install links via `copilot plugin install "ghapp://..."`.

## Hot Issues

1. **#4695 — MCP OAuth tokens not reliably reused across sessions (duplicate cache-key entries)** [OPEN, updated 10-20]
   HTTP-type MCP servers with PKCE/public-client OAuth mint new token-cache entries under different cache-key hashes instead of reusing valid cached tokens. Directly tied to the cluster of OAuth complaints below.
   https://github.com/github/copilot-cli/issues/4695

2. **#4203 — Expired MCP access token forces interactive re-auth instead of silent refresh** [OPEN, updated 10-20]
   A valid cached refresh token exists, but the CLI drops the server's tools and forces browser login instead of attempting the RFC 6749 §6 refresh grant. One of the oldest open auth bugs in the tracker.
   https://github.com/github/copilot-cli/issues/4203

3. **#5192 — ACP mode: MCP OAuth token never persisted after successful sign-in** [OPEN, created 10-19]
   Every new ACP session (e.g., each new client thread) starts unauthenticated, gets a 401, and reopens the browser. Newly filed and likely to gain visibility quickly — high-impact for anyone embedding the CLI.
   https://github.com/github/copilot-cli/issues/5192

4. **#4994 — Regression (1.0.88 → 1.0.89): MCP OAuth authorization page opens on every ACP session** [OPEN, updated 10-19]
   Even with a valid, unexpired access token cached, ACP sessions are answered with 401 and trigger the OAuth page. Confirms the auth-cluster spans interactive and non-interactive modes.
   https://github.com/github/copilot-cli/issues/4994

5. **#5177 — Regression: Manual Approval no longer prompts for repository-mutating Git commands after harness migration** [OPEN, updated 10-20]
   Post-October-migration, `git add`, `git commit`, and similar mutating commands run without explicit approval where they previously prompted. A safety-relevant regression that should be prioritized.
   https://github.com/github/copilot-cli/issues/5177

6. **#4438 — `disable-model-invocation: true` makes a skill unreachable, not manual-only** [OPEN, 12 comments, 👍14]
   Skill shows in `copilot skill list` but the model's `skill()` tool returns "Skill not found" on explicit invocation. The most-liked open issue in this batch and a real blocker for the skills feature.
   https://github.com/github/copilot-cli/issues/4438

7. **#5089 — `copilot --acp` ignores `--sandbox` and `sandbox.enabled`; shell commands run unsandboxed** [OPEN, updated 10-19]
   A security-relevant gap: sandbox flags are silently ignored in ACP mode, and writes outside sandbox policies succeed. Compounds with the Linux bwrap issues (#5176, #5199).
   https://github.com/github/copilot-cli/issues/5089

8. **#5176 — Linux sandbox: shell commands killed after ~10s (bwrap parent-death signal bound to exited thread)** [OPEN, updated 10-19]
   Long-running commands are SIGKILLed with `exit code -1` and no error message; passes outside the sandbox and with plain `bwrap`. A correctness bug in the sandbox wrapper that breaks normal workflows.
   https://github.com/github/copilot-cli/issues/5176

9. **#5149 — Claude Opus 5.5: 32k maxOutputTokens returns empty turns at max/xhigh reasoning, auto-continue bills each empty turn** [OPEN, updated 10-20]
   Hidden reasoning consumes the entire 32k cap on non-trivial tasks, producing empty responses — and auto-continue repeats the billing. A model-integration and cost-transparency issue.
   https://github.com/github/copilot-cli/issues/5149

10. **#5195 — Selecting a custom agent disables deferred MCP tool loading from second model call** [OPEN, created 10-19]
    With tool search enabled, deferral holds only for the first call under a custom agent; afterward every MCP tool from every server floods the context. Related to #5191 (child agents' tool discovery scoped to parent's tools) — a growing context-management cluster.
    https://github.com/github/copilot-cli/issues/5195

## Key PR Progress
No pull requests were updated in the last 24 hours (0 items), so there is no PR activity to report.

## Hot Discussions
No discussion data was provided for this period. This section is omitted.

## Feature Request Trends
Across the issue tracker, the most-requested feature directions are:

- **Permission granularity**: Distinguish read-only from write operations outside cwd (#4443), and restore manual approval for mutating Git commands (#5177). Users want approvals that reflect actual risk, not blanket path prompts.
- **MCP/Permission introspection**: Document `COPILOT_AGENT_SESSION_ID` for stdio MCP servers and give servers a supported way to read the effective sandbox policy (#5193).
- **Non-interactive/ACP parity**: Mid-turn steering in `--acp` mode to match interactive CLI and SDK "immediate" behavior (#5198); broader ACP feature parity is a recurring theme.
- **Input ergonomics**: Paste images into freeform question input (#4544, 👍3).
- **Signed plugin/Skill distribution**: Already partly delivered in v1.0.100 with GitHub install-link verification; expect follow-ups.

## Developer Pain Points
The following frustrations recur most frequently across issues:

- **MCP OAuth token lifecycle is unreliable**: tokens not persisted in ACP mode (#5192), not reused across sessions (#4695), not silently refreshed (#4203), and re-auth triggered despite valid tokens (#4994). This is the single largest bug cluster and affects every non-trivial MCP deployment.
- **Sandbox inconsistencies and regressions**: ACP mode ignores sandbox settings entirely (#5089), Linux long commands get killed at ~10s (#5176), Linux egress proxy ignores `NO_PROXY` when chaining to corporate proxies (#5199), and macOS blocks local Gradle daemon connections (#5105). Sandbox behavior varies unpredictably across platforms and modes.
- **Regressions from the October 2026 harness migration**: most notably the loss of manual approval prompts for repository-mutating Git commands (#5177).
- **Context/tool-loading regressions**: deferred MCP tool loading breaks under custom agents (#5195) and child-agent tool discovery is incorrectly scoped to the parent (#5191).
- **Platform-specific friction**: Windows plugin updates fail with `os error 5` when any CLI session is open (#4488, #5194); WSL2 voice server segfaults after 1.0.100 (#5197); VS Code Remote-SSH file links are not clickable (#5196).
- **Session/state surprises**: `/clear` silently resets the selected model to the default (#5189); Automode's "Task complete" hides model output (#5190); Ctrl+G external-editor failure can discard saved prompt text (#5188).

---
*Digest generated from github.com/github/copilot-cli data for 2026-10-20. Links point to issue pages on GitHub.*

</details>

<details>
<summary><strong>OpenCode</strong> — <a href="https://github.com/anomalyco/opencode">anomalyco/opencode</a></summary>

# OpenCode Community Digest — 2026-10-20

## 1. Today's Highlights

A very active day on the issue tracker: 50 issues and 50 PRs updated in the last 24 hours, with a wave of long-standing feature requests (#10288 mobile, #52184 v2 changelog, #14524 model cost display) finally closing. The v2 line continues to generate the bulk of bug reports — renderer freezes, CPU busy-loops, and destructive revert/undo behavior dominate the high-severity list. Meanwhile, the `new-designs` experiment is progressing rapidly through a stack of TUI PRs, and several contributor fixes target session management, MCP lifecycle, and Windows install paths.

## 2. Releases

No new releases in the last 24 hours. Note that v2.0.x releases continue to ship without published release notes (see #52184).

## 3. Hot Issues

1. **[#10288](anomalyco/opencode Issue #10288) — Mobile version of OpenCode (CLOSED, 👍 98)** — The single most-upvoted issue in this window. A mobile/Web UI for on-the-go AI coding assistance. Closed today after 20 comments; the reaction count signals strong demand for a non-terminal client.
2. **[#50155](anomalyco/opencode Issue #50155) — Go + DeepSeek V4 Flash requires "Global regions" but privacy setting is missing (OPEN, 16 comments)** — Paid Go subscribers are blocked by an error pointing to a privacy setting that doesn't exist in the UI. A configuration/documentation mismatch with direct billing impact.
3. **[#52184](anomalyco/opencode Issue #52184) — v2 releases have no published release notes (CLOSED, 👍 33)** — The changelog stops at v1.18.33 while v2.0.x releases ship with empty bodies. High engagement because it affects every v2 user's ability to track upgrades.
4. **[#41969](anomalyco/opencode Issue #41969) — Publish exact model versions/checkpoints for Go plan models (OPEN, 14 comments)** — Users can't tell whether `deepseek-v4-flash` serves the 0731 checkpoint. Reproducibility and trust concern for paid model access.
5. **[#14524](anomalyco/opencode Issue #14524) — Display model cost in the model picker (CLOSED, 👍 13)** — Adds a cost column to the TUI picker. Closed today; a small but frequently requested transparency feature.
6. **[#52236](anomalyco/opencode Issue #52236) — Renderer freeze (main thread blocked) when selecting a new directory (CLOSED)** — Desktop 2.0.20 hangs after path confirmation when many projects exist; LRU eviction + persistence locks the renderer. Workaround: close projects, but there's no close-project button.
7. **[#56712](anomalyco/opencode Issue #56712) — `serve --service` hangs in userspace busy-loop at 100% CPU (CLOSED)** — Orphaned v2.0.29 background process burns a full core for days, accumulating CPU time and RSS. A serious resource-leak class bug.
8. **[#54026](anomalyco/opencode Issue #54026) — Reverting a message restores the whole worktree, discarding other sessions' uncommitted changes (OPEN, severity:high)** — Data-loss risk in multi-session workflows; revert is not scoped to files touched by the reverted message.
9. **[#55121](anomalyco/opencode Issue #55121) — UNDO reverts changes done by hand (CLOSED, severity:high)** — Related to #46783; undo deletes manual edits made after the agent's last action. Directly erodes trust in the undo command.
10. **[#57374](anomalyco/opencode Issue #57374) — Startup time is "a century long" due to blocking upgrade availability check (OPEN, triaging)** — The version check runs every launch and blocks the user. Filed today; a quick-win performance target.

Honorable mentions: **[#54605](anomalyco/opencode Issue #54605)** (patch tool corrupts CRLF line endings on Windows), **[#50734](anomalyco/opencode Issue #50734)** (100% CPU hang snapshotting large git worktrees), **[#52636](anomalyco/opencode Issue #52636)** (ACP diff content derived from input schema instead of result metadata — write/patch tools never emit diffs).

## 4. Key PR Progress

1. **[#57155](anomalyco/opencode PR #57155) — Offer OpenCode account sign-in on OpenCode Go** — Fixes the provider ordering/sign-in gap where `/connect` and the Desktop picker list Go above Console but Go lacks the device OAuth flow.
2. **[#57146](anomalyco/opencode PR #57146) — Restore free-tier usage limit dialog on v2** — Ports v1's `FreeUsageLimitError` retry status handling to Desktop and server; closes #50996.
3. **[#56947](anomalyco/opencode PR #56947) — Restore `todowrite` tool behind experimental flag** — Brings back the V1 todo list for parity, gated behind `experimental.todo` (off by default).
4. **[#57367](anomalyco/opencode PR #57367) — Timeline without jumps (experimental draft)** — Incremental alternative to #57224 for a zero-jump session timeline; explicitly marked not merge-ready.
5. **[#53046](anomalyco/opencode PR #53046) — Reclaim discovery-only MCP connections** — Lazy MCP start and release of connections opened only to discover commands/tools/resources; fixes #51003.
6. **[#56452](anomalyco/opencode PR #56452) — Allow disabling failed MCP servers & persist the toggle** — Space in `/mcps` toggles any server state (failed/pending/connected) and persists it.
7. **[#57358](anomalyco/opencode PR #57358) — Keep local sessions in the selected directory** — Fixes draft directory being dropped on local session creation (#51191, #51992).
8. **[#56882](anomalyco/opencode PR #56882) — Preserve live transcript events during sync** — Prevents a late transcript GET snapshot from overwriting newer assistant events; closes #56725.
9. **[#57361](anomalyco/opencode PR #57361) — Wait for session create before switching model** — Fixes a race caused by optimistic session creation in the TUI (#57354).
10. **[#57355](anomalyco/opencode PR #57355) — Normalize Windows TMPDIR in the curl installer** — Git Bash passes Windows paths; `cygpath` conversion fixes tar extraction failures (#57342).

Also notable: the `new-designs` TUI stack from arvsrn — **[#56100](anomalyco/opencode PR #56100)** (setting descriptions), **[#56099](anomalyco/opencode PR #56099)** (settings/export dialogs), **[#56097](anomalyco/opencode PR #56097)** (free model picker) — and kitlangton's UI polish series **[#57363](anomalyco/opencode PR #57363)** (typographic rhythm) and **[#57332](anomalyco/opencode PR #57332)** (persistent debug bar).

## 5. Hot Discussions

No discussion data was provided for this window.

## 6. Feature Request Trends

- **Multi-surface clients**: Mobile/Web UI (#10288), better busy indicators across mobile/web/desktop (#49357), TUI image paste/drag-drop (#44310), and image viewing (#47544) all point to demand for richer, non-terminal interaction surfaces.
- **Cost & capability transparency**: Model cost in the picker (#14524), context window/capabilities in the picker (#41287), and exact model checkpoints for Go models (#41969).
- **Model configuration flexibility**: Per-subagent model selection (#46122), MCP tool search / deferred schema loading (#49645), and disabling failed MCP servers (#56452).
- **Session lifecycle control**: Auto-resume interrupted sessions (#44819), separate new sessions from session tabs (#44681), and restored delete/fork actions (#41265).
- **Terminal UX polish**: Jump-list for prompts (#49147), double-click word selection (#42543), collapsed shell output (#45538), and unified shell initialization (#17792).
- **Documentation/compliance**: Published v2 release notes (#52184) and security review docs (#57369) reflect growing process maturity expectations.

## 7. Developer Pain Points

- **v2 stability and data safety**: The most severe reports cluster around destructive or runaway behavior — undo reverting manual edits (#55121), revert wiping other sessions' worktree changes (#54026), renderer freezes (#52236), and background processes at 100% CPU (#56712, #50734). Multi-session and multi-project workflows are the common trigger.
- **Release/version opacity**: v2 ships without changelogs (#52184), and Go model checkpoints aren't documented (#41969), making upgrades and reproducibility hard to reason about.
- **Configuration gaps vs. error messages**: #50155 is the archetype — an error instructs users to change a "Privacy setting" that isn't exposed, blocking paid usage.
- **Windows friction**: CRLF corruption from the patch tool (#54605) and TMPDIR handling in the installer (#57342) show recurring platform-specific breakage.
- **Startup and blocking checks**: The upgrade-availability check (#57374) blocks launch, a fresh complaint with clear user impact.
- **Cross-platform feature parity**: Repeated requests for mobile, image attachments, and richer pickers indicate the terminal-first design is outpacing the other clients.

</details>

<details>
<summary><strong>Pi</strong> — <a href="https://github.com/earendil-works/pi">earendil-works/pi</a></summary>

# Pi Community Digest — 2026-10-20

## 1. Today's Highlights

A busy triage day on `earendil-works/pi`: two **P0** bugs surfaced around transcript handling — extensions that `sendMessage()` during `session_start` poison the initial system prompt (#11157), and a compaction path skips message sanitization, causing duplicate `tool_result` blocks that make Anthropic sessions unrecoverable with HTTP 400 (#11143). On the fix side, PR #11164 (initial system message lookup), PR #11142 (Responses prompt-cache retention across tool changes), and PR #11158 (overflow-recovery escape hatch) are the most consequential merges/closures in flight. CJK rendering continues to attract steady attention, with a TUI fix landed (#10730) and an HTML-export follow-up opened (#11168).

## 2. Releases

No new releases in the last 24 hours.

## 3. Hot Issues

1. **#9557 [OPEN] Anthropic adapter drops root-level JSON Schema keywords** — `convertTools()` strips `anyOf`/`oneOf`/`allOf` from non-strict `input_schema`, breaking tools that rely on schema composition. Long-running (since 2026-09-13), 6 comments — the most-discussed open issue today.
   https://github.com/earendil-works/pi/issues/9557

2. **#10154 [CLOSED] Chinese `**bold**` renders literally between CJK punctuation and CJK text** — Regression of #3353, fixed in TUI by PR #10730; still needs the HTML-export path (see PR #11168). A long-standing parity issue for CJK users.
   https://github.com/earendil-works/pi/issues/10154

3. **#10949 [OPEN, inprogress] `openai-responses` drops legacy `response.reasoning.delta` events** — Reasoning content from OpenAI-compatible Responses endpoints (e.g. Vercel AI Gateway + Kimi K3) is never streamed, so no `thinking_delta` is emitted. Affects any gateway that hasn't migrated to newer reasoning event names.
   https://github.com/earendil-works/pi/issues/10949

4. **#11049 [CLOSED, no-action] Prefer PowerShell over bash on Windows when both are enabled** — Model defaults to bash on Windows, which invokes Git Bash and causes quoting/path/encoding failures. Closed as no-action, along with companion #11051 (enable PowerShell by default), suggesting the team is not changing shell defaults yet.
   https://github.com/earendil-works/pi/issues/11049

5. **#11092 [OPEN] Tool previews inherit terminal foreground, unreadable on light cards** — With `light` theme on a dark terminal, tool-preview body text matches the terminal default color and disappears. Pure TUI theming bug, but highly visible.
   https://github.com/earendil-works/pi/issues/11092

6. **#11143 [OPEN, prio:p0] `_compactBeforeNextAssistantResponse()` skips sanitization → Anthropic 400** — Duplicate `tool_result` blocks reach Anthropic, returning `each tool_use must have a single result`; automatic retries loop the same failure and the session becomes unrecoverable. Highest-severity active bug today.
   https://github.com/earendil-works/pi/issues/11143

7. **#11157 [OPEN, prio:p0] Extensions sending at `session_start` make every session look legacy** — `getInitialSystemMessage()` only reads `messages[0]`; extensions like pi-memory and pi-session-search prepend messages, so Anthropic requests lose the `system` field and native tool anchoring. Fixed by PR #11164.
   https://github.com/earendil-works/pi/issues/11157

8. **#10940 [CLOSED, prio:p0] Responses deferred loads rewrite cached tools after a removal** — After any tool removal, later deferred loads rewrite the top-level `tools` array and repeatedly invalidate the prompt cache (cacheRead 153,472 → 0). Fixed by PR #11142.
   https://github.com/earendil-works/pi/issues/10940

9. **#11166 [CLOSED, untriaged] Concurrent extension dialogs: displaced `confirm()` never settles** — A second dialog replaces the first, and the first `ctx.ui.confirm()` promise hangs forever; batching deletes in one tool call deadlocks the agent. Classic UI concurrency trap.
   https://github.com/earendil-works/pi/issues/11166

10. **#11163 [CLOSED, no-action] Bare URL autolink swallows fullwidth punctuation and CJK text** — With OSC 8 enabled, `https://…1299（已强制更新…）` gets fully underlined and produces an invalid href. Another data point in the CJK text-handling cluster.
    https://github.com/earendil-works/pi/issues/11163

11. **#11149 [OPEN] pi-durable: admit a submission inside a host's own `harness.commit`** — Requests a public path to `admitSubmission()` so hosts can admit submissions after their own checks within a commit boundary; a durability/API-surface design ask.
    https://github.com/earendil-works/pi/issues/11149

12. **#11139 [OPEN, bug, durable] pi-durable: infinite loop when generation response errors** — If a host restarts mid-stream and the generation is flawed (e.g. DO OOM), `convertPartial` saves an `aborted` entry and re-issues the same request forever. Durability edge case worth watching.
    https://github.com/earendil-works/pi/issues/11139

13. **#11106 [CLOSED, no-action] DeepSeek requests time out at ~10.5s on Linux while curl succeeds** — undici's 10s `connect.timeout` is not configurable through Pi's stack, producing deterministic failures and retries. Illustrates how hardcoded HTTP client defaults leak into provider reliability.
    https://github.com/earendil-works/pi/issues/11106

14. **#11048 [OPEN] SDK: filter MCP servers before initialization** — Request for a host-owned server filter in `createMcpExtension()` applied before connect, so SDK children can avoid connecting to unwanted servers rather than merely hiding tools.
    https://github.com/earendil-works/pi/issues/11048

15. **#11167 [CLOSED, bug] Ctrl+G external editor exits pi with code 129 on Windows** — `emergencyTerminalExit` path triggers silent exit before the editor opens. Notable because it's a hard failure on Windows with no diagnostics.
    https://github.com/earendil-works/pi/issues/11167

## 4. Key PR Progress

1. **#11164 [CLOSED] fix(ai): find the initial system message past leading extension messages** — Root fix for #11157; `getInitialSystemMessage()` now scans past extension-injected messages so Anthropic keeps `system` and native tool anchoring.
   https://github.com/earendil-works/pi/pull/11164

2. **#11142 [CLOSED, pkg:ai] fix(ai): keep the prompt cache across tool changes on Responses** — Fixes #10940; anchors additions after a removal instead of rewriting top-level `tools`, preserving cached prefixes across deferred loads.
   https://github.com/earendil-works/pi/pull/11142

3. **#11158 [CLOSED] fix(coding-agent): overflow recovery escape hatch + output-budget-aware safety margin** — Stops unbounded compact-and-retry loops when an injector keeps feeding messages after failed recovery; adjusts the safety margin to the actual output budget.
   https://github.com/earendil-works/pi/pull/11158

4. **#10730 [CLOSED] fix(tui): render CJK emphasis next to fullwidth punctuation** — Vendors `marked-cjk-friendly` to relax CommonMark flanking rules for closing `**` between CJK punctuation and following characters. Long-awaited fix for #10154.
   https://github.com/earendil-works/pi/pull/10730

5. **#11168 [OPEN] fix(coding-agent): render CJK emphasis in HTML export** — Follow-up to #10730; vendors `marked-cjk-friendly` for export, syncs `marked` 18.0.5 → 18.0.11 with the TUI, and adds export tests mirroring TUI cases.
   https://github.com/earendil-works/pi/pull/11168

6. **#10943 [OPEN] fix(ai): update Ant Ling model compatibility and remove deprecated models** — Implements #11116: drops Ling 2.6 / Ring 2.6, adds Ling 3.0 / 3.0 Flash VL / 3.1 Flash, and switches reasoning to the DeepSeek-compatible format.
   https://github.com/earendil-works/pi/pull/10943

7. **#11145 [OPEN] fix: preserve scoped model order and prefer substring matches** — Fuzzy-scoring tweaks: option to ignore match-position penalties in the scoped picker so configured order is preserved, plus substring-match prioritization.
   https://github.com/earendil-works/pi/pull/11145

8. **#11140 [CLOSED] fix(compaction): retry summary without reasoning after token cap truncation** — Prevents the stuck-session failure mode where `Summarization failed: hit token cap` also breaks overflow recovery.
   https://github.com/earendil-works/pi/pull/11140

9. **#11109 [CLOSED] fix(durable): builtin `read` resolves images to `programs as image` blocks in codemode** — Gives `read` a union structured-output schema so nested reads of images survive codemode projection instead of being dropped as empty text.
   https://github.com/earendil-works/pi/pull/11109

10. **#9501 [CLOSED] fix(coding-agent): resolve Windows shells from installation directories** — Unifies scattered Windows binary discovery (hardcoded paths, env vars, fallbacks) into a documented approach; should materially improve Windows reliability.
    https://github.com/earendil-works/pi/pull/9501

11. **#11151 [CLOSED] feat(coding-agent): content-tool-call-assist example extension** — Lets small open models drive the loop when they emit tool calls in message content (fenced JSON, Hermes/Qwen XML) rather than structured tool-call fields.
    https://github.com/earendil-works/pi/pull/11151

12. **#11158 [CLOSED] feat(tui): Kitty images for Rex / #11150 OSC 8 detection for Rex** — Back-to-back terminal-capability additions: enable Kitty graphics for Rex and detect `TERM_PROGRAM=rex` for OSC 8 hyperlinks + truecolor. Small but user-visible quality-of-life for a new terminal.
    https://github.com/earendil-works/pi/pull/11153
    https://github.com/earendil-works/pi/pull/11150

## 5. Hot Discussions

**Show and tell**
- **#11160 — Weasley Subagents: parallel reviews and background delegation for Pi** — An Apache-2.0 extension for coordinating child agents with parallel reviews, sequential chains, background delegation, a terminal fleet view, and local JSON/JSONL lifecycle artifacts. Worth a look for anyone building multi-agent workflows on Pi.
  https://github.com/earendil-works/pi/discussions/11160

## 6. Feature Request Trends

- **Provider/tooling fidelity:** Preserve full JSON Schema semantics end-to-end (#9557), stream reasoning deltas from gateways (#10949), and keep provider server-tool blocks across turns (#11138).
- **MCP lifecycle control:** Per-session MCP registration in RPC mode (#11067) and host-owned server filtering before initialization in the SDK (#11048).
- **Durable/embedding APIs:** Public `admitSubmission()` for hosts committing inside their own transaction (#11149), documented numeric-ID ordering guarantees (#11113), and session-tree visibility for RPC/ACP clients (#11162).
- **Terminal/shell ergonomics:** Better Windows shell defaults (#11049/#11051), a `/cd` command to switch projects without relaunching (#11064), and new terminal support (Rex, #11153/#11150).
- **Provider expansion:** Requests to add new built-in providers continue (e.g. ai& on `openai-completions`, #11128).

## 7. Developer Pain Points

- **CJK text handling remains a recurring class of bugs:** bold emphasis (#10154), autolink punctuation swallowing (#11163), and TUI/export parity gaps. The community clearly keeps hitting these in real Chinese-language usage, and the fixes (vendoring `marked-cjk-friendly` in both TUI and export) show the workaround cost.
- **Windows is a second-class citizen:** shell selection, Git Bash breakage (#11049/#11051), binary discovery sprawl (#9501), Store aliases (#9504), and a silent Ctrl+G exit (#11167).
- **Transcript/system-prompt integrity:** Extensions injecting messages at `session_start` break providers (#11157/#11165), `tool_result` events not firing (#11100), and compaction producing duplicate `tool_result` blocks that brick Anthropic sessions (#11143). The 400-then-retry-forever pattern is especially painful because recovery requires manual intervention.
- **Prompt cache fragility:** Any tool-set mutation invalidating cached prefixes (#10940) has direct cost and latency implications; developers are watching cacheRead counters closely and filing precise traces.
- **Unconfigurable HTTP client defaults:** undici's 10s connect timeout producing deterministic provider failures (#11106) reflects a broader frustration that low-level client settings are not exposed or overridable.
- **Concurrency hazards in extension UI:** Displaced confirm dialogs that never settle (#11166) and non-atomic `setModel()` vs. session-tree navigation (#11103) show that extension-facing async APIs need stronger invariants.

---
*Generated from the `earendil-works/pi` repository issue/PR/discussion feed for 2026-10-20. All links point to the canonical GitHub records.*

</details>

<details>
<summary><strong>Qwen Code</strong> — <a href="https://github.com/QwenLM/qwen-code">QwenLM/qwen-code</a></summary>

# Qwen Code Community Digest — 2026-10-20

## 1. Today's Highlights

The `Managed Agent` dual-path architecture proposal (#12380) remains the dominant topic, with 71 comments and active stage-gated delivery tracking against `main`. CI reliability is the second major theme: a wave of "Main CI failed" issues (nearly all on the Managed Agent gate) and at least four follow-up investigations into runner queue depth, heap exhaustion, and checkstyle breakage. Meanwhile, the v0.25.3 nightly landed with daemon-side session-targeted Skill/Extension refresh support.

## 2. Releases

**v0.25.3-nightly.20261019.5dcf7c7cb1**
- `feat(daemon)`: support **session-targeted Skill and Extension refresh** ([#14050](https://github.com/QwenLM/qwen-code/pull/14050) by @callmeYe) — allows refreshing skills/extensions per session rather than globally.
- `fix(managed-agent)`: additional fix truncated in release notes.

## 3. Hot Issues

1. **[#12380](https://github.com/QwenLM/qwen-code/issues/12380)** — *proposal(serve): Define Managed Agent dual-path architecture and staged delivery* (71 comments, OPEN). The flagship architecture proposal, now tracking verified Stage F delivery pinned to `main@ae126a0`. Community engagement is by far the highest on the tracker.
2. **[#13078](https://github.com/QwenLM/qwen-code/issues/13078)** — *Daily dependency CVE audit failed* (26 comments). A recurring automated CVE audit failure; the volume of comments suggests repeated/lingering failure rather than a one-off.
3. **[#12668](https://github.com/QwenLM/qwen-code/issues/12668)** — *Self-update drops execute bit on vendored ripgrep binaries* (P1). A hard blocker: `EACCES` on ripgrep after `npm` self-update breaks core functionality.
4. **[#14850](https://github.com/QwenLM/qwen-code/issues/14850)** — *One shared schema and tenant-unscoped recovery scans let hosted IT classes drive each other's operations*. Test-isolation flaw in the hosted MySQL lane; flagged as ready-for-human.
5. **[#14859](https://github.com/QwenLM/qwen-code/issues/14859)** — *Four independent mechanisms keep the runner queue deep*. A capacity-tracking investigation — valuable for anyone blocked on CI latency.
6. **[#14828](https://github.com/QwenLM/qwen-code/issues/14828)** — *feat(core): one loop-protection setting (off / warn / stop)*. Consolidates loop-detection policy into a single setting across TUI, subagents, daemon, and SDK.
7. **[#14834](https://github.com/QwenLM/qwen-code/issues/14834)** — *memory: over-budget MEMORY.md warning blames entry length, but budget is exceeded by entry count*. A misleading diagnostic when memory stores grow large (~170 files).
8. **[#14877](https://github.com/QwenLM/qwen-code/issues/14877)** — *memory: writer drops over-budget index entries silently (oldest first)*. Silent data loss in the auto-memory path — pairs directly with #14834.
9. **[#8177](https://github.com/QwenLM/qwen-code/issues/8177)** — *IME cursor misalignment/garbled input on macOS + tmux*. A long-lived (since July) rendering bug affecting CJK input workflows.
10. **[#14879](https://github.com/QwenLM/qwen-code/issues/14879)** — *web-shell: ArrowUp/Down in a wrapped long prompt recalls history instead of moving the caret*. Small but high-annoyance editor UX regression.

## 4. Key PR Progress

1. **[#14046](https://github.com/QwenLM/qwen-code/pull/14046)** — *feat(core): add a real PTY backend for the Bun runtime*. Enables POSIX PTY for shell tools/Web Terminal, reading the pinned native addon's master descriptor directly.
2. **[#14281](https://github.com/QwenLM/qwen-code/pull/14281)** — *feat(memory): add scoped external import jobs for CLI and HTTP*. Qwen-owned external memory import (starting with Codex), with deterministic preview and durable background consolidation.
3. **[#14867](https://github.com/QwenLM/qwen-code/pull/14867)** — *feat(serve): add persisted workspace artifact library*. Workspace-qualified artifact read/unregister endpoints that work across live, unloaded, and archived sessions.
4. **[#14869](https://github.com/QwenLM/qwen-code/pull/14869)** — *feat(serve): add `qwen daemon start`*. Detached daemon launch that waits for discovery publication and returns URL/PID/log path.
5. **[#14583](https://github.com/QwenLM/qwen-code/pull/14583)** — *feat(web-shell): add account-wide code review workbench*. Default-off GitHub PR workbench ("Created by me" / "Needs my review").
6. **[#13902](https://github.com/QwenLM/qwen-code/pull/13902)** — *feat: project agent identity and Agent Team delivery onto the ACP/daemon wire*. Adds `_meta.agent` identity to subagent frames — foundational for multi-agent observability.
7. **[#13969](https://github.com/QwenLM/qwen-code/pull/13969)** — *feat(hooks): add FileChanged notifications for local sessions*. Hooks can watch literal files/dirs with recursive directory support.
8. **[#14890](https://github.com/QwenLM/qwen-code/pull/14890)** — *fix(serve): revalidate skill snapshots in the background*. Stale-while-revalidate with at most 1/s refresh, shared in-flight tasks, 5s deadline.
9. **[#14839](https://github.com/QwenLM/qwen-code/pull/14839)** — *fix(memory): report entry-count overflow and name dropped entries in the MEMORY.md warning*. Directly addresses #14834/#14877.
10. **[#14858](https://github.com/QwenLM/qwen-code/pull/14858)** — *feat(core): report why loop protection stopped a turn*. Every surface names the cause (explicit cap vs. backstop vs. stuck halt), complementing #14828.

## 5. Hot Discussions

No Discussion data was provided in the source snapshot, so this section is omitted.

## 6. Feature Request Trends

- **Managed Agent hardening & observability** — the dominant theme: dual-path architecture (#12380), hosted lifecycle waits, agent identity on the wire (#13902), and constant fault-gate expansion (FG11e/FG11f/FG12f/FG13b via #14819, #14848, #14881, #14892).
- **Memory subsystem maturity** — scoped external imports (#14281), accurate overflow diagnostics (#14839), and naming dropped entries (#14877). Memory is moving from "works" to "auditable."
- **Unified loop protection** — one `off/warn/stop` setting spanning TUI, headless, subagents, and daemon (#14828 + #14858).
- **Daemon/Headless operability** — `qwen daemon start` (#14869), persisted artifact libraries (#14867), background skill revalidation (#14890), session-targeted refresh (#14050).
- **Editor/terminal UX polish** — wrapped-prompt arrow keys (#14879), IME rendering on macOS/tmux (#8177), VP-mode alignment (#9305).

## 7. Developer Pain Points

- **CI instability is the top friction point.** Nearly every "Main CI failed" issue today is the *Managed Agent gate*, recurring across multiple commits (#14849, #14864, #14891). Root causes cited: V8 heap exhaustion in `packages/cli` `tsc --build` (#14823), missing Node on PATH, duplicate `prepare` builds (#14873, #14884), checkstyle violations blocking every managed-agent PR (#14887), and a shared MySQL schema causing cross-test interference (#14850). Four independent queue-depth mechanisms are under investigation (#14859).
- **Self-update breaking the toolchain.** The P1 ripgrep `EACCES` regression (#12668) is a severe trust issue for the update path.
- **Misleading/silent memory diagnostics.** Users get warnings blaming the wrong cause (#14834) while the writer silently drops the *oldest* memories (#14877).
- **IME/CJK input remains broken** on macOS + tmux since July (#8177) — a persistent, unresolved localization blocker.
- **Automated audit fatigue.** The dependency CVE audit keeps failing with low signal (#13078).

---
*Generated from github.com/QwenLM/qwen-code data for 2026-10-20.*

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*