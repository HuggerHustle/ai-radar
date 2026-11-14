# AI CLI Tools Community Digest 2026-11-14

> Generated: 2026-11-14 01:24 UTC | Tools covered: 7

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
**Data window: 2026-11-14 | Tools: Claude Code, OpenAI Codex, Gemini CLI, GitHub Copilot CLI, OpenCode, Pi, Qwen Code**

---

## 1. Ecosystem Overview

The AI CLI tooling landscape has consolidated around a shared set of hard problems — **destructive-command safety, credential hygiene, subagent reliability, and cross-platform (especially Windows) stability** — even as each tool pursues distinct architectural bets. Release cadence remains high: Codex, Copilot CLI, and OpenCode all shipped stable releases within the window, while Claude Code pushed a security patch and Gemini CLI entered a quiet stabilization phase with no releases. A clear bifurcation is emerging between **first-party vendor tools** (Claude Code, Codex, Gemini CLI, Copilot CLI) optimizing for deep integration with their own model ecosystems, and **independent aggregators** (OpenCode, Pi, Qwen Code) competing on provider-agnostic routing, plugin/SDK extensibility, and multi-channel deployment. Across all communities, users are hitting the limits of single-session, single-surface agent workflows and demanding continuity, observability, and finer lifecycle control. Security and data-loss reports are no longer isolated — they form recurring bug *classes* rather than one-offs, signaling that guardrail architecture is now a first-order competitive differentiator.

---

## 2. Activity Comparison

| Tool | Hot Issues (today) | PRs Updated (24h) | Discussions | Release Status (24h) |
|---|---|---|---|---|
| **Claude Code** | 10 notable (2 filed today; 2 new data-loss incidents) | 1 (near-empty pipeline) | N/A (not provided) | v2.1.325 patch (zstd security fix) |
| **OpenAI Codex** | 10 notable (Windows auth dominant) | ~14 (mostly `copyberry[bot]`, closed same-day) | 7 active (Ideas/Q&A/Show-and-tell) | rust-v0.169.0 + v0.168.0 stable; v0.171 alphas |
| **Gemini CLI** | 10 notable (P1 subagent bugs) | 10 (security/sandbox heavy) | N/A (not provided) | None |
| **GitHub Copilot CLI** | 10 notable + 3 honorable mentions | 2 (both Dependabot, closed) | N/A (not provided) | v1.0.111 + v1.0.112 patch |
| **OpenCode** | 10 notable (366-comment free-tier mega-thread) | 10 (accessibility, session hygiene) | N/A (not provided) | v2.3.0 (background subagents; regressions reported) |
| **Pi** | 10 notable (retry/resilience cluster) | 7 (all closed; stability-focused) | 3 (Show-and-tell/projects) | None |
| **Qwen Code** | 10 notable (CI flakes dominate) | 10 (feature fixes + CI deflake) | N/A (not provided) | None |

**Notes:**
- **N/A** in Discussions indicates no Discussion data was supplied for that repo in the source digests — this reflects reporting scope, not channel inactivity. GitHub Issues/PRs remain the primary channel for Claude Code, Gemini CLI, Copilot CLI, OpenCode, and Qwen Code.
- Pi's issue/PR links were provided without full URLs; counts reflect the digest's top-10 lists.

---

## 3. Shared Feature Directions

Several requirements recur across **three or more** communities, making them the clearest industry-level signals:

**A. Destructive-command guardrails & safer execution**
- *Claude Code*: `rm -rf`, `rsync --delete`, malformed `pkill` incidents (##95426, #109735, #109627) — top pain point, explicitly called "overdue" for variable-expansion validation.
- *Gemini CLI*: models reaching for `git reset --force`; workspace pollution (#22672, #23571); sandbox permission denial gaps (#30277).
- *OpenCode*: agent continued after explicit STOP, unauthorized file modification (#63216).
- **Shared need:** pre-execution validation of variable expansion, configurable allowlists, and reliable kill/containment semantics.

**B. Credential hygiene — move secrets out of plaintext**
- *Claude Code*: OS secret store request, 👍11 (#73582); plaintext tokens under `~/.claude/`.
- *Codex*: shell snapshots persisting secret env vars in plaintext (#30971).
- *Copilot CLI*: Entra token cache stays 0 bytes after MCP sign-in (#5236, closed); sandboxed git credential injection (#5102, closed).
- **Shared need:** first-class OS keychain integration and MCP-derived token isolation.

**C. Subagent reliability, observability & lifecycle control**
- *Gemini CLI*: false-success reporting (`status: "success"` on MAX_TURNS, #22323), hangs (#21409), Wayland failures (#21983), subagent traces via `/chat share` (#22598).
- *OpenCode*: `sessionID` continuation broken (#59293), suspend/resume request 👍18 (#27511), model-call failures (#63778).
- *Pi*: orphaned subagent children on quit (#12130, closed).
- *Qwen Code*: continuable subagents (#16518); loop-stop semantics (#15894).
- **Shared need:** truthful status reporting, hierarchical token accounting, and pause/resume.

**D. Cross-surface session continuity**
- *Codex*: "continuous engineering workspace" (#61348), address existing conversations (#49862), verify thread startup state (#61177).
- *Copilot CLI*: `--host-allow-session-creation` for remote hosts (v1.0.111).
- *Claude Code*: phone-initiated remote sessions (#91815, 👍14).
- **Shared need:** sessions that are inspectable, resumable, and addressable across Desktop/CLI/mobile/app-server.

**E. Windows platform parity**
- *Claude Code*: MSIX MCP config silently fails (#26073), ConPTY `pwsh.exe` leaks (#95387).
- *Codex*: organization settings deadlock (#48324 + 3 companions), unreaped MCP children (#28361).
- *Copilot CLI*: Entra cache (#5236), parent-shell killer (#5404).
- *OpenCode*: `%APPDATA%` execution restrictions (#56016), custom agents vanishing (#63201).
- **Shared need:** Windows is consistently the least-stable surface across the entire ecosystem.

**F. Rate-limit ergonomics & cost predictability**
- *Codex*: preserve separate High/Work allowances (#58530, 👍51), usage drain (#61336), cache misses (#54091).
- *OpenCode*: auto pause/resume on known reset (#43126, 👍16), 366-comment free-tier mega-thread (#59387).
- *Claude Code*: idle compaction failing 83% of long pauses (#108789), hardcoded 200k windows (#109750).
- **Shared need:** transparent quota accounting, auto-resume, and predictable context/compaction behavior.

---

## 4. Differentiation Analysis

| Dimension | Claude Code | OpenAI Codex | Gemini CLI | Copilot CLI | OpenCode | Pi | Qwen Code |
|---|---|---|---|---|---|---|---|
| **Primary focus** | Claude-native agent workflows + IDE/desktop integration | Terminal as first-class agent command center (TUI depth) | Agent/sandbox security & structured context | Enterprise policy + sandboxing | Provider-agnostic parallel agents | Resilience across providers | Channel ecosystem + 1.0 kernel migration |
| **Target user** | Individual devs → orgs on Anthropic stack | ChatGPT/Codex power users, TUI devotees | Google Cloud / Gemini 3 users | Enterprise GitHub/Entra orgs | Multi-provider tinkerers, SDK integrators | Local-LLM + multi-model users | Multi-channel enterprise (Teams, DingTalk, QQ) |
| **Technical approach** | Tight model-harness coupling; lean PR pipeline, issue-driven | Structured statusline state machine (14-PR batch); internal CI automation | RE2 linear-time policy eval, zero-dep sandboxing proposals | Regex enterprise permissions, per-model context windows | Background subagents by default; v2 SDK | Retry/backoff tuning; TUI stability | Event-driven `query()` kernel, per-surface rollout |
| **Notable signal** | Guardrails described as "overdue" | Highest-👍 issue = rate-limit policy, not a bug | Maintainers flag flaky evals undermining QA | Silent regressions with no escape hatch | v2.3.0 shipped headline feature *with* regressions | Small, disciplined, all-closed PR set | CI flake noise obscuring real regressions |

**Key differentiators:**
- **Codex** is the only tool with a coordinated, PR-driven statusline/state architecture visible in its merge pattern — suggesting investment in TUI as a durable product surface.
- **Gemini CLI** is the most security-forward in PR velocity (RE2 policy eval, MCP command permission checks, symlink resolution) but struggles with agent *correctness* (false-success reporting).
- **OpenCode** is the most architecturally aggressive (background subagents enabled by default) but absorbs corresponding upgrade fragility.
- **Copilot CLI** occupies a distinct enterprise-governance niche (regex permission rules, org policy surfaces) with the least community show-and-tell activity.
- **Pi** and **Qwen Code** are resilience/integration-focused, with Pi notably clean in its PR hygiene (all resolved) and Qwen Code visibly early in stabilization.

---

## 5. Community Momentum & Maturity

**Highest raw engagement:**
- **OpenCode** — the 366-comment free-tier thread (#59387) is the single loudest community artifact across all seven tools, and combined with 18- and 16-👍 feature requests, indicates a large, vocal user base.
- **Codex** — highest single-issue 👍 (51) and multiple 30+ comment threads; discussions channel is uniquely active with Show-and-tell projects (Lichen, TokenWatch) signaling ecosystem extension.
- **Claude Code** — highest-comment issue (34) plus recurring *severity* (600GB deletion, WSL root wipe) that drives outsized attention relative to volume.

**Rapidly iterating (release velocity):**
- **Codex** — three-stage cadence (168 stable → 169 stable → 171 alpha, skipping 170) signals fast-forward engineering.
- **Copilot CLI** — two patch releases in 24h; steady incremental shipping.
- **OpenCode** — v2.3.0 architectural shift, though regression reports dampen the win.
- **Claude Code** — frequent patches (v2.1.325) but *near-empty PR pipeline*, implying a closed, internally-developed contribution model.

**Stabilization / lower external velocity:**
- **Gemini CLI** — no releases, but active security PRs; mature but currently in maintenance posture.
- **Pi** — no releases; disciplined closed-PR cleanup; smaller, quieter community.
- **Qwen Code** — no releases; CI-flake-dominated tracker suggests pre-1.0 maturation and pre-parity community size.

**Maturity observations:** Tools with **closed development models** (Claude Code, Copilot CLI) show sparse public PR pipelines but high issue engagement — healthy *user* communities, limited *contributor* communities. Tools with **open-ish contribution** (Codex, Gemini CLI, OpenCode, Pi, Qwen Code) show richer PR flows but also more internal-CI noise bleeding into public trackers.

---

## 6. Trend Signals

**1. Safety is becoming a product category, not a checkbox.**
Across Claude Code, Gemini CLI, Copilot CLI, and OpenCode, destructive-command and containment failures form recurring bug classes. Expect variable-expansion validation, pre-execution dry-runs, and configurable deny-lists to become table-stakes differentiators in 2027.

**2. Credential hygiene is a looming compliance risk.**
Plaintext secrets in `~/.claude/`, `~/.codex/shell_snapshots`, and broken Entra caches make OS-keychain integration a near-certain requirement as these tools enter regulated enterprises. *Reference value:* vendors should treat secret storage as a security-critical surface now, before procurement questionnaires force it.

**3. Truthful agent status reporting is an unaddressed trust gap.**
Gemini CLI's `status: "success"` on turn-limit termination, OpenCode's post-STOP execution, and Claude Code's silent MCP failures all describe the same pathology: **agents that fail without saying so.** Reliability claims (SUBGOAL vs GOAL, compaction success rates) need verifiable telemetry, not self-reports.

**4. Cross-surface continuity is the next UX frontier.**
Codex's "continuous engineering workspace," Copilot CLI's remote session creation, and Claude Code's phone-initiated sessions point to a future where *the session*, not *the binary*, is the unit of work. Integrators building on top of these tools should design for session-addressable, device-agnostic architectures.

**5. Rate-limit and cost transparency drives engagement more than any bug.**
Codex's top-👍 issue is a *policy* concern (allowance preservation), not a defect; OpenCode's free-tier thread dominates; Claude Code's compaction/cost issues rank highly. **Cost predictability is now a retention lever**, and tools offering auto-resume (#43126) and transparent hierarchical accounting will win rate-limited power users.

**6. Windows remains the ecosystem's weakest link.**
Five of seven tools report Windows-specific severe bugs (auth, process leaks, shell killers, MCP config). Teams deploying multi-developer agent workflows should budget for Windows-specific QA and treat "runs on Windows" as an unproven claim across nearly every tool.

**7. Resilience engineering is quietly differentiating aggregator tools.**
Pi's entire 24h PR set targeted retry/backoff and socket-error handling; the general lesson — **streaming LLM turns need robust transient-error recovery** — is broadly applicable and currently under-addressed in first-party tools that assume stable provider connections.

**8. Contribution-model architecture matters for enterprise evaluation.**
Closed pipelines (Claude Code, Copilot CLI) deliver faster security patches but slower community fixes; open pipelines (Codex, Gemini CLI, OpenCode, Qwen Code) surface more regressions and CI noise but enable faster external contribution. **Match your adoption strategy to your tolerance for each.**

---

*Report synthesized from seven per-tool community digests dated 2026-11-14. Counts reflect the top-N lists each digest provided; "N/A" denotes channels not reported in source data rather than confirmed inactivity. Issue/PR identifiers are as cited in the source digests.*

---

## Per-Tool Reports

<details>
<summary><strong>Claude Code</strong> — <a href="https://github.com/anthropics/claude-code">anthropics/claude-code</a></summary>

## Claude Code Skills Highlights

> Source: [anthropics/skills](https://github.com/anthropics/skills)

# Claude Code Skills — Community Highlights Report

*Data source: github.com/anthropics/skills · Snapshot date: 2026-11-14*

---

## 1. Top Skills Ranking (by discussion volume & attention)

| # | Skill / PR | Functionality | Discussion Highlights | Status |
|---|---|---|---|---|
| 1 | [**fix(mcp-builder): mcp>=2 `streamable_http_client` + custom headers** #1742](https://github.com/anthropics/skills/pull/1742) | Repairs the `mcp-builder` skill's connection scripts for the `mcp>=2.0.0` API rename and new header config path | Highest-visibility PR in the set; addresses breaking import changes and custom-header handling in `connections.py` | **OPEN** (created 2026-09-08, updated 2026-10-08) |
| 2 | [**fix(skill-creator): isolate trigger evals, Windows + runtime failures** #1298](https://github.com/anthropics/skills/pull/1298) | Fixes false-negative trigger evaluation caused by parallel worker contention, Windows `select()` failures, and runtime error misclassification | Directly addresses the notorious "0% trigger rate" class of bugs in the eval harness | **OPEN** (updated 2026-09-16) |
| 3 | [**Add notion-spec-to-implementation + quantitative-resume-auditor** #1245](https://github.com/anthropics/skills/pull/1245) | Two-skill bundle: converts Notion specs into actionable implementation tasks; audits resumes quantitatively | Long-lived PR (5+ months) with sustained maintainer/author back-and-forth | **OPEN** (updated 2026-10-15) |
| 4 | [**webapp-testing: avoid `shell=True` in with_server.py** #1980](https://github.com/anthropics/skills/pull/1980) | Removes command-injection risk (CWE-78) in the webapp-testing server spawner | Security-hardening PR; aligns with the broader namespace/trust discussion in Issue #492 | **OPEN** (updated 2026-11-01) |
| 5 | [**fix(docx): report LibreOffice timeout as error + verify output** #1792](https://github.com/anthropics/skills/pull/1792) | Makes `accept_changes.py` fail loudly on `soffice` timeout and verify revision marks are gone before claiming success | Correctness/observability fix for the widely used document skill | **OPEN** (updated 2026-11-01) |
| 6 | [**Add pyxel skill for retro game development** #525](https://github.com/anthropics/skills/pull/525) | Python retro-game creation/debugging with headless input-driven runs and frame inspection | One of the oldest open PRs (since March 2026) — sustained community interest in creative-coding skills | **OPEN** (updated 2026-11-01) |
| 7 | [**fix(xlsx): worksheet-scoped defined names in external_links_at_risk** #2019](https://github.com/anthropics/skills/pull/2019) | Eliminates false negatives in `recalc.py` when external links are referenced via worksheet-scoped names/aliases | Fixes #2013; part of a cluster of xlsx correctness PRs | **OPEN** (updated 2026-11-03) |
| 8 | [**Add document-typography skill** #514](https://github.com/anthropics/skills/pull/514) | Typographic QC: orphan word wrap, widow paragraphs, numbering misalignment | Widely relatable pain point ("affects every document Claude generates") | **OPEN** (updated 2026-03-13) |

**Also notable (active but lower comment counts):** [proofcore-contract-auditor #1771](https://github.com/anthropics/skills/pull/1771), [md2video-audio #1703](https://github.com/anthropics/skills/pull/1703), [scnet-hpc #1615](https://github.com/anthropics/skills/pull/1615), [algorithmic-art wrapAround fix #1977](https://github.com/anthropics/skills/pull/1977).

---

## 2. Community Demand Trends (from Issues)

Distilled from the 15 highest-comment issues:

1. **Trust, namespace & security governance** — [Issue #492](https://github.com/anthropics/skills/issues/492) (46 comments, top issue): community skills shipping under the `anthropic/` namespace enable impersonation and trust-boundary abuse. Demand for verification/attribution of official vs. community skills.

2. **Reliable skill evaluation & triggering** — [Issue #556](https://github.com/anthropics/skills/issues/556) (13 comments) and [Issue #1352](https://github.com/anthropics/skills/issues/1352) (parallel workers cross-matching UUIDs → false negatives). The community's biggest *technical* demand: a trustworthy `run_eval.py`.

3. **Org-wide sharing & distribution** — [Issue #228](https://github.com/anthropics/skills/issues/228) (17 comments, 8 👍): a shared skill library / direct sharing link instead of manual `.skill` uploads.

4. **Context-window efficiency** — [Issue #1487](https://github.com/anthropics/skills/issues/1487): `claude-api` eagerly injects ~156k tokens; [Issue #202](https://github.com/anthropics/skills/issues/202): skill-creator too verbose/token-inefficient. Demand for lean, operational skill authoring.

5. **Document-quality correctness** — [Issue #2018](https://github.com/anthropics/skills/issues/2018) (docx invalid XML), [Issue #1868](https://github.com/anthropics/skills/issues/1868) (gradient off-by-one), [Issue #2064](https://github.com/anthropics/skills/issues/2064) (description says *what* not *when*). Demand for output-verified document/creative skills.

6. **New skill domains proposed by the community** — agent governance ([#412](https://github.com/anthropics/skills/issues/412)), reasoning quality gates ([#1385](https://github.com/anthropics/skills/issues/1385)), compact symbolic memory ([#1329](https://github.com/anthropics/skills/issues/1329)). Direction: **workflow/agent orchestration & quality assurance**, not just single-task tools.

---

## 3. High-Potential Pending Skills (likely to land soon)

Active-comment, unmerged PRs with recent updates and clear scope:

- [**#1742 mcp-builder fix**](https://github.com/anthropics/skills/pull/1742) — unblocks all mcp-builder users on mcp≥2; highest merge priority.
- [**#1980 webapp-testing security fix**](https://github.com/anthropics/skills/pull/1980) — small, self-contained CWE-78 remediation.
- [**#1792 docx timeout/verification**](https://github.com/anthropics/skills/pull/1792) — high-value correctness fix for a flagship document skill.
- [**#2019 xlsx worksheet-scoped names**](https://github.com/anthropics/skills/pull/2019) — closes a filed issue (#2013); low-risk.
- [**#1975 / #1976 / #1977 gerardrecinto trio**](https://github.com/anthropics/skills/pull/1975) — small, targeted bug fixes (pptx `--cols`, webapp-testing element discovery, algorithmic-art `wrapAround`) that fix filed issues #1809/#1891/#1897. These are prime candidates for quick merge.
- [**#1298 skill-creator eval isolation**](https://github.com/anthropics/skills/pull/1298) — overlaps with Issue #1352; would resolve the community's most-cited eval bug.
- [**#1997 skill-creator YAML frontmatter parsing**](https://github.com/anthropics/skills/pull/1997) — correctness fix for eval/description optimization inputs.

**Watch list (new skills, longer review cycle):** [#1771 proofcore-contract-auditor](https://github.com/anthropics/skills/pull/1771), [#1703 md2video-audio](https://github.com/anthropics/skills/pull/1703), [#525 pyxel](https://github.com/anthropics/skills/pull/525), [#1615 scnet-hpc](https://github.com/anthropics/skills/pull/1615), [#1245 notion-spec-to-implementation](https://github.com/anthropics/skills/pull/1245).

---

## 4. Skills Ecosystem Insight

> **The community's most concentrated demand is for trustworthy, correctly-evaluated Skills: fixing the skill-creator eval/trigger pipeline and hardening the security and correctness of existing skills (mcp-builder, docx, xlsx, webapp-testing) — before adding new ones.**

---

*All links point to github.com/anthropics/skills. Statuses reflect the 2026-11-14 snapshot; comment counts were unavailable for PRs in the source data, so PR ranking is inferred from recency, issue linkage, and cross-referenced discussion volume.*

---

# Claude Code Community Digest — 2026-11-14

## 1. Today's Highlights

A patch release (v2.1.325) landed with a zstd decoding security fix and a Jupyter-related VS Code UX tweak, but the community's attention is dominated by a cluster of high-severity destructive-command bug reports — including two new data-loss incidents today involving `rsync --delete` and malformed `pkill`. Meanwhile, long-running platform issues (Windows MSIX MCP config, macOS fseventsd runaway, idle compaction reliability) continue to accumulate comments and remain unresolved.

## 2. Releases

**v2.1.325**
- **Security fix**: Corrected a vulnerability in how zstd-compressed responses are decoded.
- **UX**: Added a one-time spinner tip in VS Code and similar integrated terminals, prompting users to re-run a notebook cell after Claude has read or edited a Jupyter notebook.
- **Other**: Minor error-message addition shown when an organization-level condition is hit.

## 3. Hot Issues

1. **[#26073](https://github.com/anthropics/claude-code/issues/26073)** — *Windows MSIX: "Edit Config" opens wrong `claude_desktop_config.json`; MCP servers silently fail to load* (24 comments, 👍34). The highest-comment issue today. Silent MCP failures on Windows are especially damaging because there is no error surfaced to the user.

2. **[#89690](https://github.com/anthropics/claude-code/issues/89690)** — *`modelPicker` skips an `opusplan` row as already covered, but the picker shows no Opus Plan Mode row* (20 comments). A logic bug in how Claude Code deduplicates custom picker rows against the built-in lineup; `opusplan` is a mode, not a model, so nothing actually covers it.

3. **[#98769](https://github.com/anthropics/claude-code/issues/98769)** — *macOS: fseventsd runaway on agent-heavy Macs (24 GB, 800x its budget, a core pinned for days, no self-recovery)* (18 comments). Claude Code can block on fseventsd at startup with no detection or recovery path — a serious reliability concern for agent-heavy workflows.

4. **[#95426](https://github.com/anthropics/claude-code/issues/95426)** — *Claude Code deleted ~600GB: unprompted `rm -rf` on a substitution that resolved to a drive root* (10 comments). A `cygpath -u 'C:\'` substitution expanded to `/` under Cygwin, and the harness executed `rm -rf` unprompted. One of the most severe data-loss reports on the tracker.

5. **[#108789](https://github.com/anthropics/claude-code/issues/108789)** — *Idle compaction lost in 83% of long pauses: governor eviction and near-limit refusal* (8 comments). Measured across 7 days / 615 pauses: `compact_on_return` fired in only 104 cases, forcing full context rewrites on return. Directly affects cost and latency for long sessions.

6. **[#73582](https://github.com/anthropics/claude-code/issues/73582)** — *Store API credentials in the OS secret store instead of plaintext* (7 comments, 👍11). Persistent enhancement request: API keys, OAuth tokens, and MCP-derived third-party tokens currently live in plaintext under `~/.claude/`.

7. **[#89165](https://github.com/anthropics/claude-code/issues/89165)** — *Sandbox network `allowedDomains` not enforced for HTTPS CONNECT tunneling* (7 comments). A documented allowlist that does not actually block non-allowed hosts via CONNECT — a fundamental sandbox-trust problem.

8. **[#85225](https://github.com/anthropics/claude-code/issues/85225)** — *LSP stale index: files created mid-session never send `workspace/didChangeWatchedFiles` (Created)* (7 comments). Reproduced; causes stale symbol/index state for files created after session start.

9. **[#109735](https://github.com/anthropics/claude-code/issues/109735)** — *[Data loss] Subagent ran `rsync -a --delete` with an empty destination variable via `wsl.exe`, wiping the WSL root and mounted Windows drive* (1 comment, filed today). `TaskStop` also failed to kill the Linux-side process. Notable for combining both a destructive-command failure and a containment failure.

10. **[#109627](https://github.com/anthropics/claude-code/issues/109627)** — *Agent ran malformed `pkill` on macOS, SIGTERMing all Claude Code sessions and user processes* (~66 processes killed). Related to the broader `pkill -f` over-matching family (#94632, #99281) — this is now a recurring class of bug, not a one-off.

## 4. Key PR Progress

Only **one** PR was updated in the last 24h:

1. **[PR #45553](https://github.com/anthropics/claude-code/pull/45553)** — *resolve duplicate IPs*, by `johnkohler00`. Open since 2026-04-09 and updated 2026-11-13. No description provided.

> Note: the PR pipeline is nearly empty today, so the rest of this section is omitted rather than padded.

## 5. Hot Discussions

No Discussion data was provided in the source dataset; this section is omitted.

## 6. Feature Request Trends

Distilled from the issue set:

- **Tooling/integration breadth** — First-class Forgejo/Gitea support across desktop, CLI, cloud sessions, and connectors ([#106412](https://github.com/anthropics/claude-code/issues/106412)); continuation of the multi-code-host theme.
- **Phone-initiated remote sessions** — Allow starting a *new* session on a machine from mobile, with a device picker ([#91815](https://github.com/anthropics/claude-code/issues/91815), 👍14). Distinct from the shipped "make Desktop sessions visible on phone" feature.
- **Credential hygiene** — Move secrets out of plaintext into OS keychains ([#73582](https://github.com/anthropics/claude-code/issues/73582), 👍11).
- **Plugin/API extensibility** — Plugin API to replay the main thread's last request for cache pre-warming/keepalive mods ([#101755](https://github.com/anthropics/claude-code/issues/101755)).
- **Model/context configuration** — Override or auto-detect `autoCompactWindow` for models not in the built-in list ([#109750](https://github.com/anthropics/claude-code/issues/109750)).

## 7. Developer Pain Points

- **Destructive command safety is the top concern.** `rm -rf`, `rsync --delete`, and `pkill -f` incidents ([#95426](https://github.com/anthropics/claude-code/issues/95426), [#107274](https://github.com/anthropics/claude-code/issues/107274), [#109735](https://github.com/anthropics/claude-code/issues/109735), [#109627](https://github.com/anthropics/claude-code/issues/109627), [#94632](https://github.com/anthropics/claude-code/issues/94632), [#99281](https://github.com/anthropics/claude-code/issues/99281)) — including *silent process-kill containment failures* — suggest guardrails and variable-expansion validation are overdue.
- **Silent failures with no user-visible signal**: MCP config pointing at the wrong file on Windows ([#26073](https://github.com/anthropics/claude-code/issues/26073)), invisible pending updates on Windows ([#109751](https://github.com/anthropics/claude-code/issues/109751)), and undocumented Code Mode ([#109442](https://github.com/anthropics/claude-code/issues/109442)).
- **Cross-platform runtime resource leaks**: fseventsd runaway on macOS ([#98769](https://github.com/anthropics/claude-code/issues/98769)), per-session ConPTY `pwsh.exe` leaks on Windows ([#95387](https://github.com/anthropics/claude-code/issues/95387)).
- **Cost unpredictability from context behavior**: idle compaction failing most of the time ([#108789](https://github.com/anthropics/claude-code/issues/108789)) and hardcoded 200k compaction windows for unlisted models ([#109750](https://github.com/anthropics/claude-code/issues/109750)).
- **Regression-style breakage in shipping builds**: `file_upload` path rejection after a Desktop update ([#87386](https://github.com/anthropics/claude-code/issues/87386), now closed) and duplicate usage-reset consumption ([#108822](https://github.com/anthropics/claude-code/issues/108822)).

---

*Data window: GitHub activity updated 2026-11-13/14 on github.com/anthropics/claude-code. Issue/PR links are relative to that repository.*

</details>

<details>
<summary><strong>OpenAI Codex</strong> — <a href="https://github.com/openai/codex">openai/codex</a></summary>

# OpenAI Codex Community Digest — 2026-11-14

## 1. Today's Highlights

The Codex team shipped a large batch of TUI improvements in `rust-v0.169.0` and `rust-v0.168.0`, most notably multi-tab side-chat support, model provider browsing, and searchable task history — a continued push toward the terminal workspace as a first-class agent command center. Meanwhile, the community remains most agitated about Windows Desktop reliability, specifically a persistent "Unable to load organization settings" blocker affecting multiple users, and the confirmed December 2026 consolidation of ChatGPT High and Codex/Work rate-limit allowances. A dense run of statusline-related PRs (14 in ~24h) suggests a coordinated engineering effort around structured, provider-facing TUI state.

---

## 2. Releases

**`rust-v0.169.0` (stable)**
- Opt-in terminal workspace now supports **multiple side-chat tabs**: switch via keyboard or mouse, and reopen saved local side chats after Codex restarts. (#59784, #60152, #60181)
- **Search older tasks** in the agent command center by name, prompt preview, or working directory.

**`rust-v0.168.0` (stable)**
- New **Sessions → Model providers** browser for selecting the default provider for new chats. (#59541, #59722)
- `features.tui_workspace` flag enables a side conversation beside the main chat, with draggable divider and `leader z` zoom for the focused pane.

**`rust-v0.171.0-alpha.1 / .2 / .4 / .5`** — rolling alpha releases with no published changelogs; presumably stabilization work ahead of 0.171.0 stable.

The three-stage release cadence (168 stable, 169 stable, 171 alpha line) with 170 skipped in the alpha sequence suggests either a fast-forward or an internal-only branch cut — worth watching for next week.

---

## 3. Hot Issues

1. **[#48324](https://github.com/openai/codex/issues/48324) — Windows Desktop: "Unable to load organization settings" (53 comments, 11 👍)**  
   The single most-commented issue this period. Codex fails before the composer loads, so no session ID can even be generated to file feedback — a deadlock for affected users. Companion issues [#51586](https://github.com/openai/codex/issues/51586) and [#56680](https://github.com/openai/codex/issues/56680) show this is a family of related Windows auth/startup failures, not a one-off.

2. **[#58530](https://github.com/openai/codex/issues/58530) — Preserve separate ChatGPT High and Codex/Work allowances (32 comments, 51 👍)**  
   Highest-👍 issue in the window. OpenAI has already confirmed the December 2026 shared-allowance change, but the community is fighting to keep the two budgets distinct — framed around "first idea to first income" workflows. Strong signal that rate-limit policy is the top user-facing concern.

3. **[#59855](https://github.com/openai/codex/issues/59855) — Windows: cloud-managed chats fail to resume with `AbsolutePathBuf` error (32 comments)**  
   A clean reproduction path with a specific error string (`AbsolutePathBuf deserialized without a base path`) — the kind of bug report that usually accelerates a fix. Reads still succeed, so the corruption is in the resume path only.

4. **[#32188](https://github.com/openai/codex/issues/32188) — Event-driven wakeup when background exec sessions complete (29 comments, 28 👍)**  
   Long-standing, well-reasoned request: replace `write_stdin` polling with event-driven wakeups to cut unnecessary model turns. High 👍-to-comment ratio indicates broad agreement rather than controversy.

5. **[#47270](https://github.com/openai/codex/issues/47270) — Desktop Browser Use can't discover Chrome tabs (27 comments)**  
   No ChatGPT browser route means Browser Use is effectively inert on Desktop. Blocks a marquee feature on a major platform.

6. **[#49862](https://github.com/openai/codex/issues/49862) — Windows: no native tools to read or message an existing local conversation (20 comments)**  
   Pro Lite subscriber. Highlights a gap between Desktop, CLI, and app-server in cross-conversation addressability — foundational for the "continuous workspace" theme (see #61348).

7. **[#61348](https://github.com/openai/codex/issues/61348) — Make ChatGPT + Work + Codex a continuous engineering workspace (14 comments)**  
   Newly filed but immediately popular. Explicitly notes AI-assisted provenance verification — an emerging reporting pattern worth noting for triage.

8. **[#28361](https://github.com/openai/codex/issues/28361) — Windows MCP/app-server child processes never reaped (13 comments)**  
   Process leaks accumulating into the hundreds. Serious for anyone running Codex as an MCP server under a host like Claude Code; a stability issue with long-tail impact.

9. **[#30971](https://github.com/openai/codex/issues/30971) — Shell snapshots can persist secret env vars in plaintext (9 comments)**  
   Security-adjacent: credential-helper prompts triggered on startup, secrets written to `~/.codex/shell_snapshots`. Lower comment count than its severity warrants — worth surfacing.

10. **[#60778](https://github.com/openai/codex/issues/60778) — iOS shows "No tasks yet" but conversations reachable via search (13 comments, 8 👍)**  
    Paired with [#60799](https://github.com/openai/codex/issues/60799) (cold-start `experimentalApi` omission), this looks like a consistent iOS Remote list-loading regression affecting multiple users.

---

## 4. Key PR Progress

Nearly all visible PRs were authored by the `copyberry[bot]` automation and closed within the day — consistent with an internal CI/batch-merge workflow. Thematically they cluster into two groups:

**Structured statusline state (coordinated series, #61403–#61417):**
1. **[#61403](https://github.com/openai/codex/pull/61403)** — Adds serializable `StatuslineState` (app config, thread identity, agent state, model settings, approvals).
2. **[#61408](https://github.com/openai/codex/pull/61408) / [#61409](https://github.com/openai/codex/pull/61409) / [#61410](https://github.com/openai/codex/pull/61410)** — Expose token totals, context-window usage, and thread cost estimates to provider-facing state; reject stale usage reads after chat-widget replacement.
3. **[#61415](https://github.com/openai/codex/pull/61415) / [#61411](https://github.com/openai/codex/pull/61411)** — Workspace headline in status state, with stale-request and archived-message filtering.
4. **[#61417](https://github.com/openai/codex/pull/61417)** — Expose Codex rate-limit windows (primary/secondary percentages, reset timestamps) via statusline.

**TUI / transcript UX:**
5. **[#61422](https://github.com/openai/codex/pull/61422)** — Keyboard table selection in transcript (`leader v` to mark, `hjkl` to extend, `y` to copy).
6. **[#61424](https://github.com/openai/codex/pull/61424)** — Fix viewport not refilling when collapsing tool groups.
7. **[#61405](https://github.com/openai/codex/pull/61405)** — Show primary executor's workspace (not app-server's) in TUI status surfaces.

**Platform / provider correctness:**
8. **[#61419](https://github.com/openai/codex/pull/61419)** — Resolve pasted Windows paths via `/bin/wslpath -u` instead of hardcoded `/mnt/<drive>` mapping.
9. **[#61420](https://github.com/openai/codex/pull/61420)** — GCP setup now clears stale `base_url` override instead of blocking.
10. **[#61401](https://github.com/openai/codex/pull/61401) / [#61430](https://github.com/openai/codex/pull/61430)** — MCP OAuth: release read locks before keyring access; instrument lock acquisition/hold durations.

Also notable: **[#61418](https://github.com/openai/codex/pull/61418)** hardens government-backend workspace routing, and **[#61426](https://github.com/openai/codex/pull/61426)** flips `incremental_tools_legacy` on by default for Bedrock.

---

## 5. Hot Discussions

**Ideas**
- **[#28073](https://github.com/openai/codex/discussions/28073)** — Clickable user-prompt navigator for the current conversation (4 👍). A lightweight in-thread index, explicitly *not* a global history manager; still gathering support after five months.

**Q&A**
- **[#61320](https://github.com/openai/codex/discussions/61320)** — Supported Windows sandbox config for native memory consolidation in app-server; consolidation agent fails with `failed_invalid` on file-write commands.
- **[#61177](https://github.com/openai/codex/discussions/61177)** — Can app-server verify a fresh thread's loaded instruction bytes and startup input order before the first turn? A real gap for teams needing reproducibility.
- **[#60409](https://github.com/openai/codex/discussions/60409)** — How to safely investigate a blocked Windows inspection; the warning doesn't name the command, destination, or process.

**Show and tell**
- **[#60818](https://github.com/openai/codex/discussions/60818)** — Running 5–10 Codex + Claude Code agents in one Windows window (Lichen, free, closed source). Practical notes on waiting detection and context copying.
- **[#61238](https://github.com/openai/codex/discussions/61238)** — TokenWatch: iOS/Android dashboard for Codex/Claude usage and reset times, free through Nov 16.

---

## 6. Feature Request Trends

- **Cross-surface continuity**: The strongest emergent theme. #61348 ("continuous engineering workspace"), #49862 (address existing local conversations), and #61177 (verify thread startup state) all point to users wanting sessions to be inspectable, resumable, and addressable across Desktop, CLI, iOS, and app-server — not disposable tasks.
- **Observability and accounting**: #61406 (per-sub-agent-tree token usage, with a striking 305.5M-token child total vs. 42.8M parent), #61417 (statusline rate limits), and the broader statusline PR series show demand for accurate, hierarchical cost/usage visibility.
- **Event-driven agent orchestration**: #32188 is the canonical request — eliminate polling loops in favor of completion events.
- **Navigation and findability**: #28073 (in-conversation prompt navigator) plus the just-shipped task search in 0.169.0 indicate that as conversation volume grows, retrieval is becoming a top workflow bottleneck.
- **Side-by-side reasoning**: The new multi-tab side chats in 0.169.0 directly fulfill a long-standing ask to compare approaches without leaving the main thread.

---

## 7. Developer Pain Points

1. **Windows Desktop startup/auth is the #1 reliability problem.** Four separate issues (#48324, #51586, #56680, #59410) describe variants of organization-settings load failures, missing `chatgpt_account_id` claims, and auth-token routing errors. Users report reinstall + CLI login success does not unblock the Desktop app, and Retry/Sign out controls themselves fail — a compounding usability trap.
2. **Rate-limit anxiety is driving engagement more than any single bug.** #58530 (51 👍) and #61336 ("usage draining rapidly for no reason") reflect deep concern over the December allowance consolidation; #54091 (frequent cache misses within a turn) suggests some drain may be attributable to prompt-cache behavior rather than user activity.
3. **Process and resource lifecycle on Windows.** #28361 (unreaped MCP/app-server children) and #60344 (PowerShell exit-70 under MXC sandbox on ARM64) point to platform-level lifecycle management gaps.
4. **Secrets hygiene and shell integration.** #30971 (plaintext secrets in shell snapshots) is the clearest security concern; #46664 (PreToolUse hook rejects valid rewrites unless `allow` is also returned) is a smaller but sharp API-contract bug.
5. **Cross-chat authorization inconsistency.** #50758 reports the same instruction succeeding when typed directly in the destination chat but rejected when relayed from another thread — an agent-scope/permission-model ambiguity that will matter more as multi-agent workflows grow.
6. **Platform parity gaps.** iOS list-loading regressions (#60778, #60799), Desktop Browser Use discovery (#47270), and cloud-managed chat resume on Windows (#59855) all fit a pattern: features ship on some surfaces faster than others, and users notice.

---

*Digest generated from openai/codex activity for 2026-11-14. Alpha release notes were not published; version deltas inferred from release tags only.*

</details>

<details>
<summary><strong>Gemini CLI</strong> — <a href="https://github.com/google-gemini/gemini-cli">google-gemini/gemini-cli</a></summary>

# Gemini CLI Community Digest — 2026-11-14

## 1. Today's Highlights

Agent reliability remains the dominant theme this cycle, with multiple P1 issues tracking subagent hangs, false-success reporting, and Wayland browser failures. Maintainers are actively pushing security and sandboxing work through PRs (MCP command permission checks, RE2-based policy evaluation), while the community continues to press for smarter tool selection and safer destructive-command behavior. Notably, no new releases shipped in the last 24 hours.

## 2. Releases

No new releases in the last 24 hours.

## 3. Hot Issues

1. **[#22323](https://github.com/google-gemini/gemini-cli/issues/22323) — Subagent recovery after MAX_TURNS reported as GOAL success (P1, 13 comments)**
   A `codebase_investigator` subagent reports `status: "success"` / `Termination Reason: "GOAL"` even when it hit its turn limit before doing any analysis. This is a correctness bug that silently masks failures — dangerous for anyone relying on subagent output. Highest-comment issue today.

2. **[#19873](https://github.com/google-gemini/gemini-cli/issues/19873) — Zero-dependency OS sandboxing & post-execution intent routing (P2, 9 comments)**
   Proposes letting Gemini 3 lean into its native bash affinity (grep/sed/awk chains) while keeping execution safe. A foundational proposal that touches security, UX, and model alignment simultaneously.

3. **[#21409](https://github.com/google-gemini/gemini-cli/issues/21409) — Generalist agent hangs (P1, 8 comments, 👍8)**
   The generalist agent hangs indefinitely on trivial tasks like folder creation; users report waiting up to an hour. Highest-reaction issue today — a clear blocker for anyone delegating to subagents.

4. **[#22745](https://github.com/google-gemini/gemini-cli/issues/22745) — Assess AST-aware file reads, search, and mapping (P2, 7 comments)**
   EPIC investigating whether AST-aware tooling can cut misaligned reads and token noise. Signals a shift from brute-force context to structured code intelligence.

5. **[#21968](https://github.com/google-gemini/gemini-cli/issues/21968) — Gemini doesn't use skills/sub-agents enough (P2, 7 comments)**
   Anecdotal but widely relatable: custom skills with clear descriptions go unused unless explicitly invoked. Directly undermines the value proposition of the subagent system.

6. **[#22267](https://github.com/google-gemini/gemini-cli/issues/22267) — Browser Agent ignores settings.json overrides (P2, 5 comments)**
   `maxTurns` and other config are read at registry init but ignored at runtime. Config drift between what users set and what agents do.

7. **[#21983](https://github.com/google-gemini/gemini-cli/issues/21983) — Browser subagent fails on Wayland (P1, 4 comments)**
   Linux/Wayland users see the browser agent terminate with `GOAL` despite failing — another instance of the false-success pattern. Notable platform-specific blocker.

8. **[#24246](https://github.com/google-gemini/gemini-cli/issues/24246) — 400 error with >128 tools (P2, 3 comments)**
   Tool-count explosion triggers API errors; users expect the agent to scope tools more intelligently. Becomes more pressing as MCP adoption grows.

9. **[#22672](https://github.com/google-gemini/gemini-cli/issues/22672) — Agent should discourage destructive behavior (P2, 3 comments)**
   Model reaches for `git reset`/`--force` when safer paths exist. A trust-and-safety concern for production repos.

10. **[#22598](https://github.com/google-gemini/gemini-cli/issues/22598) — Subagent trajectory visible via `/chat share` (P3, 2 comments)**
    Subagent traces are recorded but not surfaced — improving observability is a prerequisite for debugging the reliability issues above.

## 4. Key PR Progress

1. **[#30289](https://github.com/google-gemini/gemini-cli/pull/30289) — Disclose canonical link path; default consent prompt to no (P1)**
   Resolves symlinks via `fs.realpathSync` and makes non-interactive extension consent default to denial. Security hardening for extension linking.

2. **[#30283](https://github.com/google-gemini/gemini-cli/pull/30283) — Skip system MCP servers with insecure command permissions**
   Extends PR #29115: now verifies ownership/write permissions on MCP server commands referenced by system config, not just the config files themselves.

3. **[#30282](https://github.com/google-gemini/gemini-cli/pull/30282) — Use re2js for linear-time policy argsPattern evaluation**
   Replaces built-in `RegExp` with a `SafeRegExp` wrapper for policy patterns, eliminating catastrophic backtracking risk. Solid defense-in-depth for policy evaluation.

4. **[#30279](https://github.com/google-gemini/gemini-cli/pull/30279) — Preserve trimmed function-call name in history (fixes #30256)**
   Fixes `400 INVALID_ARGUMENT` when the model emits function names with leading/trailing whitespace. Small fix, meaningful reliability win.

5. **[#30281](https://github.com/google-gemini/gemini-cli/pull/30281) — Honor configured fetch timeouts on Node 26**
   Upgrades Undici to 7.30.2 so global dispatchers work with Node 26's built-in fetch. Forward-compatibility for the runtime upgrade path.

6. **[#30277](https://github.com/google-gemini/gemini-cli/pull/30277) — Improve sandbox permission denial detection (fixes #29338)**
   Fixes missed POSIX sandbox denials and handles restricted/containerized environments more gracefully.

7. **[#30278](https://github.com/google-gemini/gemini-cli/pull/30278) — Explain Gemini API fetch failures**
   Adds network troubleshooting guidance when requests fail before an HTTP response, distinguishing transport failures from HTTP errors like 503.

8. **[#30273](https://github.com/google-gemini/gemini-cli/pull/30273) — Unify exit codes mapping and fatal error hierarchy**
   Consolidates hardcoded numeric exit codes into a single `ExitCodes` source of truth. Improves scriptability for CI users.

9. **[#30210](https://github.com/google-gemini/gemini-cli/pull/30210) — Stop WebFetch fallback work after cancellation (fixes #30099)**
   Prevents wasted fallback URL attempts after cancellation — a nice responsiveness/efficiency fix.

10. **[#30271](https://github.com/google-gemini/gemini-cli/pull/30271) — Initialize auth capabilities when listing models (closed)**
    Fixes `gemini models list` omitting `gemini-3.8-flash` for authenticated users, bringing non-interactive listing to parity with `/model manage`.

## 5. Hot Discussions

No discussion data was provided for this period.

## 6. Feature Request Trends

- **AST-aware code intelligence**: Three linked issues ([#22745](https://github.com/google-gemini/gemini-cli/issues/22745), [#22746](https://github.com/google-gemini/gemini-cli/issues/22746), [#22747](https://github.com/google-gemini/gemini-cli/issues/22747)) explore AST tooling (tilth, glyph, ast-grep) for reads, search, and codebase mapping — a coordinated bet on structured context over raw reads.
- **Token-frugal tooling**: [#19561](https://github.com/google-gemini/gemini-cli/issues/19561) (Tactful Extraction) and the AST EPIC both target context bloat (~36.6k baseline tokens/turn).
- **Persistent task tracking**: [#18836](https://github.com/google-gemini/gemini-cli/issues/18836) proposes replacing in-context WriteToDo with file-based CRUD to combat context rot.
- **Subagent observability**: [#22598](https://github.com/google-gemini/gemini-cli/issues/22598) (`/chat share` for subagent traces) and [#21763](https://github.com/google-gemini/gemini-cli/issues/21763) (subagent context in bug reports).
- **Better agent self-awareness**: [#21432](https://github.com/google-gemini/gemini-cli/issues/21432) wants the CLI to accurately describe its own flags, hotkeys, and invocation patterns.
- **Parallel subagent collaboration / shared memory**: [#18287](https://github.com/google-gemini/gemini-cli/issues/18287), currently blocked on parallel subagent support.
- **Per-workspace policies**: [#18397](https://github.com/google-gemini/gemini-cli/issues/18397) requests workspace-scoped policy additions instead of global-only.

## 7. Developer Pain Points

1. **Subagents silently fail or hang.** The recurring pattern across [#22323](https://github.com/google-gemini/gemini-cli/issues/22323), [#21409](https://github.com/google-gemini/gemini-cli/issues/21409), and [#21983](https://github.com/google-gemini/gemini-cli/issues/21983): agents report `GOAL` success while actually failing or stalling. This erodes trust in the entire delegation model.

2. **Skills and subagents go unused unless explicitly invoked.** [#21968](https://github.com/google-gemini/gemini-cli/issues/21968) captures a widely felt gap between capability and actual routing behavior.

3. **Configuration is inconsistently honored.** Browser Agent ignores `settings.json` overrides ([#22267](https://github.com/google-gemini/gemini-cli/issues/22267)); symlinked agent files aren't recognized ([#20079](https://github.com/google-gemini/gemini-cli/issues/20079)).

4. **Destructive commands and workspace pollution.** Models reach for `git reset`/`--force` ([#22672](https://github.com/google-gemini/gemini-cli/issues/22672)) and litter repos with tmp scripts ([#23571](https://github.com/google-gemini/gemini-cli/issues/23571)), creating cleanup overhead before clean commits.

5. **Tool-count and context pressure.** The >128 tools 400 error ([#24246](https://github.com/google-gemini/gemini-cli/issues/24246)) and persistent context bloat point to a scaling ceiling as MCP servers multiply.

6. **Interactive prompts block automation.** The agent gets stuck on Vite's interactive prompt ([#22465](https://github.com/google-gemini/gemini-cli/issues/22465)) — a reminder that many CLI flows still assume a human at the terminal.

7. **Eval instability undermines quality signals.** Maintainers themselves flag flaky evals ([#23313](https://github.com/google-gemini/gemini-cli/issues/23313), [#23166](https://github.com/google-gemini/gemini-cli/issues/23166)), making it harder to validate fixes for the issues above.

---

*Digest generated from github.com/google-gemini/gemini-cli data for 2026-11-14.*

</details>

<details>
<summary><strong>GitHub Copilot CLI</strong> — <a href="https://github.com/github/copilot-cli">github/copilot-cli</a></summary>

# GitHub Copilot CLI Community Digest — 2026-11-14

## 1. Today's Highlights
Two patch releases (v1.0.111 and v1.0.112) landed in the last 24 hours, headlined by **regular-expression support in enterprise-managed Shell/Bash/PowerShell permission rules** and a new `--host-allow-session-creation` flag for remote CLI hosts. The changelog also reveals a controversial default shift: the CLI now uses "each model's recommended context window," while macOS "best-effort startup" on Ventura 13.5+ is being quietly expanded without official OS support. Meanwhile, the issue tracker is dominated by long-tail permission, sandbox, and Windows/MCP authentication regressions — several of which (PRU quota wipe, Entra token cache) were closed today.

## 2. Releases

**v1.0.112** (2026-11-13) — [Release](https://github.com/github/copilot-cli/releases)
- Failed `/compact` now surfaces the model provider's actual error instead of an internal host-rethrow prefix.
- Pasted prompts entered before managed-account policy finishes loading are preserved; pressing Enter re-sends the paste rather than dropping it.
- **v1.0.112-0** (prerelease): improved best-effort startup on macOS Ventura 13.5+; per-model recommended context windows used by default (explicit overrides still honored); `/chronicle cost-tips` now includes Copilot App sessions and recommends cheaper models.

**v1.0.111** (2026-11-13) — [Release](https://github.com/github/copilot-cli/releases)
- **Regex support** added to enterprise-managed Shell, Bash, and PowerShell permission rules.
- New `--host-allow-session-creation` flag lets remote clients create sessions on CLI hosts for a single launch without mutating saved settings.
- `/usage` premium-request percentages refreshed.
- **v1.0.111-0** (prerelease): same two additions above, plus organization support links in policy surfaces.

## 3. Hot Issues

1. **[#4802](https://github.com/github/copilot-cli/issues/4802) [CLOSED] PRU Quota Wiped Out, likely tied to Assisted Permissions** — A Copilot Pro (legacy request-based) user reports 234 PRUs vanishing after enabling Assisted Permissions; 11 comments. Closed today, but this is the highest-engagement thread and signals billing-adjacent risk in the permissions subsystem.

2. **[#5236](https://github.com/github/copilot-cli/issues/5236) [CLOSED] Windows: Entra broker token cache stays 0 bytes after MCP sign-in** — Every new process re-prompts for Entra auth because the cache file is never written. Closed after 8 comments; important for Windows enterprise users running HTTP MCP servers.

3. **[#2374](https://github.com/github/copilot-cli/issues/2374) [CLOSED] Autopilot enters an infinite loop** — Workflow reproduces via `/plan` → autopilot approval. Closed after ~8 months and 8 comments; a notable long-standing reliability fix.

4. **[#5323](https://github.com/github/copilot-cli/issues/5323) [OPEN] Add setting to disable agent checkpoint refs (`refs/agents/*`)** — Every agent turn creates commits under the user's own git identity. 6 comments, 2 👍. This pollutes `git log --all` and any ref-rendering tool — a real ergonomics/compliance concern.

5. **[#5066](https://github.com/github/copilot-cli/issues/5066) [OPEN] Assisted permissions regression** — Too many commands (even a simple PowerShell file-find) now demand approval. 4 comments, 1 👍; pairs with #4802 to suggest the Assisted Permissions model needs tuning.

6. **[#4866](https://github.com/github/copilot-cli/issues/4866) [CLOSED] Ctrl-D in `ask_user`/elicitation fields shuts down the session** — In-progress input is discarded when Ctrl-D is pressed inside agent elicitation forms, unlike the main composer. 3 comments, 3 👍; classic input-handling regression fixed today.

7. **[#3192](https://github.com/github/copilot-cli/issues/3192) [OPEN] `statusLine.command` not executed when `footer.showCustom=true`** — Open since May, still unpatched as of 1.0.43+; blocks custom footer tooling (branch, cost, model indicators). 3 comments, 2 👍.

8. **[#3339](https://github.com/github/copilot-cli/issues/3339) [OPEN] Quoted strings starting with `/` misread as paths** — The path-access scanner flags literal arguments as filesystem intents, causing spurious permission prompts. Long-lived (#3339, since May) with low visibility but high annoyance for shell-heavy workflows.

9. **[#5404](https://github.com/github/copilot-cli/issues/5404) [OPEN] Windows: launching copilot in a git repo kills parent `pwsh.exe`** — tgrep indexing crashes the parent shell and tears down the terminal tab (and attached processes like ssh-agent). Only 1 comment so far but severe severity — reported on 1.0.108.

10. **[#5102](https://github.com/github/copilot-cli/issues/5102) [CLOSED] Sandboxed git can't use credentials differing from Copilot/gh identity** — `sandbox.auth.git` injects a highest-precedence empty `credential.helper`, discarding fine-grained PATs. Closed today; matters for enterprise sandbox users with separate service identities.

Honorable mentions: [#4509](https://github.com/github/copilot-cli/issues/4509) (6 👍, `--no-alt-screen` silently removed), [#5085](https://github.com/github/copilot-cli/issues/5085) (macOS sandbox + Mach `SecurityServer` breaks HTTPS), [#5390](https://github.com/github/copilot-cli/issues/5390) (macOS sandbox `allowLocalNetwork` ignored in proxy mode).

## 4. Key PR Progress

Only **2 PRs** were updated in the last 24h, both Dependabot and both CLOSED:

1. **[#5454](https://github.com/github/copilot-cli/pull/5454) [CLOSED] bump debian `f6b08b0` → `a72b443` in `/container`** — Docker base image refresh for the container image. Routine supply-chain hygiene.

2. **[#5453](https://github.com/github/copilot-cli/pull/5453) [CLOSED] bump docker/login-action 4.7.0 → 4.8.0** — CI auth action update (v4.8.0 sets Docker docs metadata). Low risk, automated.

No feature PRs landed in the last 24h window; all notable feature movement is in the v1.0.111/112 release notes above.

## 5. Hot Discussions
No GitHub Discussions data was provided in the source dataset; this section is omitted.

## 6. Feature Request Trends

- **Agent checkpoint hygiene** ([#5323](https://github.com/github/copilot-cli/issues/5323)): users want to opt out of `refs/agents/*` commits polluting their repos.
- **Enterprise policy granularity** ([#4783](https://github.com/github/copilot-cli/issues/4783)): separate policy scope for CLI sandbox + yolo mode; also mirrored by the new regex permission support in v1.0.111.
- **Sandboxing allowlists** ([#4881](https://github.com/github/copilot-cli/issues/4881), [#4046](https://github.com/github/copilot-cli/issues/4046)): exact Mach/XPC allowlists on macOS and a documented cross-platform sandbox support matrix.
- **Instruction-file deduplication** ([#4603](https://github.com/github/copilot-cli/issues/4603)): persistent per-user exclusion for duplicate `CLAUDE.md`/`AGENTS.md`.
- **Plugin format completeness** ([#5440](https://github.com/github/copilot-cli/issues/5440)): Agent Plugins 1.0 `rules/` and `applyTo` frontmatter are silently ignored — a parity gap that will bite plugin authors.

## 7. Developer Pain Points

1. **Permissions friction and cost exposure** — Assisted Permissions is the top theme: too many prompts (#5066) and a reported PRU wipe (#4802). Users need predictable, tunable approval behavior.
2. **Sandbox instability across platforms** — macOS Mach/XPC restrictions break HTTPS (#5085) and local networking (#5390); Windows sandbox requirements are undocumented (#4046); sandboxed git credential injection is broken (#5102). This is the single largest cluster of open bugs.
3. **Windows regressions** — Entra token cache (#5236) and the parent-shell killer (#5404) show Windows remains a second-class platform for CLI stability.
4. **Silent regressions with no escape hatch** — Removal of `--no-alt-screen` (#4509) with no replacement or deprecation notice is cited as a pattern of breaking changes arriving without migration paths.
5. **MCP auth edge cases** — Headless OAuth timeouts (#3039) and metadata URL redirect mismatches (#4769) continue to block MCP adoption outside interactive desktop environments.
6. **Long-lived renderer/config bugs** — Custom statusLine (#3192) and path-scanner false positives (#3339) have been open for ~6 months, eroding trust in the configuration surface.

---
*Generated from github.com/github/copilot-cli data on 2026-11-14.*

</details>

<details>
<summary><strong>OpenCode</strong> — <a href="https://github.com/anomalyco/opencode">anomalyco/opencode</a></summary>

# OpenCode Community Digest — 2026-11-14

## 1. Today's Highlights

OpenCode shipped **v2.3.0**, headlined by **background subagents enabled by default** — subagents now return immediately, run concurrently, and report back when idle, a significant architectural shift for parallel agent workflows. The release also appears to have introduced regressions: within 24 hours, users reported **zombie PTY processes on Linux** (#63817) and **old cancelled/failed sessions unexpectedly re-executing** (#63802). Meanwhile, the long-running **free-tier issue thread (#59387)** has ballooned to 366 comments, cementing free-tier quota handling as the community's most persistent pain point.

---

## 2. Releases

### v2.3.0
- **Background Subagents by Default** — Subagents now return immediately and continue in the background, reporting back when idle. Multiple subagents can run concurrently while work continues in the parent session. ([#63382](https://github.com/anomalyco/opencode/pull/63382))

⚠️ **Early regression reports against 2.3.0:**
- [#63817](https://github.com/anomalyco/opencode/issues/63817) — Shell commands leave **zombie processes** under `opencode-pty daemon` on Linux (not present in 2.2.7).
- [#63802](https://github.com/anomalyco/opencode/issues/63802) — Upgrading to 2.3.0 **re-ran an old cancelled/failed session**, posting an unexpected GitHub review.

---

## 3. Hot Issues

1. **[#59387](https://github.com/anomalyco/opencode/issues/59387) — Free tier issues mega-thread** (366 comments, 28 👍, OPEN). The central hub for free-tier failures: quota-exceeded errors, limits that never reset, and desktop version lockouts. Its volume makes it the single clearest signal of free-tier friction.

2. **[#52941](https://github.com/anomalyco/opencode/issues/52941) — Desktop file tree/preview show stale contents after agent edits** (13 comments, reproduced). Users can't trust the Review pane to reflect agent changes — a core trust issue for the desktop workflow.

3. **[#63216](https://github.com/anomalyco/opencode/issues/63216) — Rogue actions: agent continued after explicit STOP** (12 comments, CLOSED). A high-severity report of unauthorized file modification on Windows. Closed, but the underlying control-safety concern resonates broadly.

4. **[#52154](https://github.com/anomalyco/opencode/issues/52154) — Message history isolation per session** (10 comments, 7 👍, OPEN). Arrow-up recalls prompts from *other* sessions — a frequent annoyance for users running many parallel sessions. A fix PR is already in flight (see #55261).

5. **[#27511](https://github.com/anomalyco/opencode/issues/27511) — Suspend/Resume for agent and subagent execution** (9 comments, 18 👍, OPEN). High-upvote request to pause and resume agent execution — increasingly relevant with concurrent background subagents in 2.3.0.

6. **[#50130](https://github.com/anomalyco/opencode/issues/50130) — V1 sessions after completed migration are never imported** (9 comments, reproduced). Data-continuity bug: sessions landing in the DB after `migration.v1-v2` completes stay orphaned in legacy tables.

7. **[#63778](https://github.com/anomalyco/opencode/issues/63778) — Subagent model calls fail with "Specified function… not found"** (8 comments, CLOSED). Specialist subagents (sage/architect/forge) failed on first model call across providers — notable given subagents are the focus of 2.3.0.

8. **[#43126](https://github.com/anomalyco/opencode/issues/43126) — Auto pause/resume on known rate-limit reset** (7 comments, 16 👍, OPEN). Persist session, pause, and auto-resume when a provider reports a reset time — a high-demand automation for rate-limited workflows.

9. **[#59293](https://github.com/anomalyco/opencode/issues/59293) — Subagent `sessionID` continuation always fails** (4 comments, OPEN). `sessionID` is coerced to `"ses"`, making it impossible to continue an existing subagent conversation — directly relevant to the new background-subagent model.

10. **[#63218](https://github.com/anomalyco/opencode/issues/63218) — Local DB recreated empty after restart following auth failure** (2 comments, CLOSED, severity: high). Total loss of sessions and projects; a catastrophic data-loss scenario worth monitoring for recurrence.

---

## 4. Key PR Progress

1. **[#55261](https://github.com/anomalyco/opencode/pull/55261) — `prompt.history_scope` setting** (OPEN). Adds opt-in `session` scoping so Up/Down recall only the current session's prompts — the direct fix for #52154.

2. **[#58846](https://github.com/anomalyco/opencode/pull/58846) — Repair V1 global sessions left by completed imports** (OPEN). Backfills folder→project attribution for users who already upgraded past the migration window (fixes fallout from #49827).

3. **[#60895](https://github.com/anomalyco/opencode/pull/60895) — `opencode session list --all` with cursor pagination** (OPEN). Removes the current-directory project filter so sessions across projects are visible.

4. **[#63872](https://github.com/anomalyco/opencode/pull/63872) — Larger image budget for `claude-agent`** (OPEN). Raises `boundImages` cut/drop thresholds from 25/15 MiB to 96/64 MiB, fixing #63870.

5. **[#63873](https://github.com/anomalyco/opencode/pull/63873) — Merge `claude-agent` catch-up text into one block** (OPEN). Emits a single text block instead of one per role/tool tag, improving Anthropic prompt-cache hit rates.

6. **[#61386](https://github.com/anomalyco/opencode/pull/61386) — Preserve explicit `traceparent` in HTTP requests** (OPEN). Stops Effect's HTTP client from overwriting caller-supplied trace context — important for observability integrations.

7. **[#61622](https://github.com/anomalyco/opencode/pull/61622) — Separate model capabilities in localized summaries** (OPEN). Fixes concatenated labels (e.g., `TextImageTools`) in Simplified Chinese via narrow conjunction formatting.

8. **[#63866](https://github.com/anomalyco/opencode/pull/63866) — Skip-to-content link in the shell** (OPEN). WCAG 2.4.1 bypass-blocks accessibility improvement, the first focusable element in the shell.

9. **[#63851](https://github.com/anomalyco/opencode/pull/63851) — Accessible names for unnamed controls** (OPEN). Names the session search listbox, directory pickers, and other controls previously invisible to assistive tech (part of the #57491 accessibility push alongside #63865).

10. **[#58542](https://github.com/anomalyco/opencode/pull/58542) — Cmd+X cut in the TUI prompt** (OPEN). Copies (with pasted-text placeholders expanded) and deletes the selection, matching standard editor behavior.

---

## 5. Hot Discussions

No discussion data was provided in the source dataset; this section is omitted.

---

## 6. Feature Request Trends

- **Session history hygiene** — Per-session prompt recall (#52154/#55261) and no-restore TUI tab scopes (#61063) reflect demand for clean, isolated session state as users run many parallel sessions.
- **Agent lifecycle control** — Suspend/resume execution (#27511, 18 👍), plugin-driven `session.stop` (#63650), and auto pause/resume on rate-limit reset (#43126, 16 👍) all point to users wanting finer-grained control over long-running agents.
- **Rate-limit ergonomics** — From auto-resume (#43126) to the free-tier mega-thread (#59387), quota handling is the dominant feature-request theme.
- **SDK/plugin extensibility** — Binding agent/model/variant to queued prompts (#48356) and the `session.stop` API (#63650) show the v2 SDK is being stretched by integrators like Kimaki.
- **Desktop/UI polish** — Resizable content width (#53382), unified Thinking/Patch indicators (#44164), and a broad accessibility sweep (#57491) indicate growing investment in the desktop and TUI experience.

---

## 7. Developer Pain Points

1. **Free-tier quotas and reset failures** — The 366-comment thread (#59387) captures quota errors, limits that never reset, and desktop version lockouts. This is the single loudest community frustration.
2. **Stale state after agent edits** — The desktop file tree and preview pane (#52941, #57099) frequently show outdated contents; `Reload` doesn't help. Erodes trust in the primary review workflow.
3. **Subagent reliability** — The 2.3.0 headline feature is shadowed by bugs: `sessionID` continuation broken (#59293), model-call failures (#63778), and `session.stop` gaps (#63650).
4. **Upgrade/migration fragility** — 2.3.0 re-ran old sessions (#63802), 2.2.7→2.3.0 left zombie PTYs (#63817), completed migrations orphan V1 sessions (#50130), and a restart after auth failure wiped the local DB (#63218).
5. **Process/resource leaks** — MCP config reloads leak server processes (#63847), and pooled MCP is silently ignored for legacy-protocol servers with no runtime signal (#63848).
6. **Plugin cache staleness** — `@latest` plugin specs never refresh cached installs (#54127), forcing version pins to pick up bug fixes — a repeated footgun for plugin authors.
7. **Windows/desktop startup issues** — `%APPDATA%` execution restrictions break server startup (#56016), and custom agents vanish after reload on Windows (#63201).

</details>

<details>
<summary><strong>Pi</strong> — <a href="https://github.com/earendil-works/pi">earendil-works/pi</a></summary>

## 🛠️ Pi Community Digest: 2026-11-14

This digest summarizes recent activity in the `earendil-works/pi` repository, focusing on critical fixes, feature advancements, and community discussions impacting the AI developer experience.

### 1. Today's Highlights
*   **Copilot Enhancements:** A significant pull request has been closed, ensuring that GitHub Copilot models correctly propagate `reasoning_effort` and usage token data back to the Pi engine.
*   **Stability Improvements:** Several high-priority bugs related to TUI crashes (large diff rendering) and intermittent connection errors during streaming have been addressed.
*   **Community Showcase:** New projects like `pi-opentui` and `tinyCode` were shared, demonstrating evolving frontend and context management efforts.

### 2. Releases
No new releases were detected in the last 24 hours.

### 3. Hot Issues
Here are 10 noteworthy open and recently addressed issues:

*   **Issue #12019 [CLOSED] Copilot Reasoning Effort:** Fixed an issue where Gemini models in `github-copilot` were ignoring `reasoning_effort` and `reasoning_tokens`, impacting the visibility of model thinking processes.
    *   [earendil-works/pi Issue #12019](https://github.com/earendil-works/pi#12019)
*   **Issue #8036 [CLOSED] TUI Crash on Large Diff:** Resolved a critical crash in the interactive TUI when rendering excessively large diff outputs from the `edit` tool.
    *   [earendil-works/pi Issue #8036](https://github.com/earendil-works/pi#8036)
*   **Issue #10024 [OPEN] Mid-Run Tool Change:** A concern exists where changing the active tool set mid-run shifts the system prompt header, leading to unexpected conversational re-billing.
    *   [earendil-works/pi Issue #10024](https://github.com/earendil-works/pi#10024)
*   **Issue #12148 [OPEN] Mistral Large 4 Hang:** Reports indicate that Mistral Large 4 hangs when attempting to utilize tools, suggesting potential model-tool integration issues.
    *   [earendil-works/pi Issue #12148](https://github.com/earendil-works/pi#12148)
*   **Issue #9986 [CLOSED] Aborting Tool Execution:** Fixed a scenario where aborting a batch of tool executions left subsequent tool calls unanswered in the session history.
    *   [earendil-works/pi Issue #9986](https://github.com/earendil-works/pi#9986)
*   **Issue #12096 [OPEN] Llama.cpp Persistence:** The `/login llama.cpp` connection state is not persisting across Pi sessions as expected, complicating session management for local LLMs.
    *   [earendil-works/pi Issue #12096](https://github.com/earendil-works/pi#12096)
*   **Issue #12070 [OPEN] Vertex AI Stream Timeouts:** A concern regarding `wire stream timeoutMs` on Google Vertex AI causing mid-stream `ECONNRESET` or timeouts that are not being correctly categorized for retry.
    *   [earendil-works/pi Issue #12070](https://github.com/earendil-works/pi#12070)
*   **Issue #12124 [OPEN] Codex 60-Min Limit:** Users are hitting the 60-minute connection limit for Codex websockets during long, continuous reasoning turns, even when recent fixes were applied.
    *   [earendil-works/pi Issue #12124](https://github.com/earendil-works/pi#12124)
*   **Issue #12130 [CLOSED] Process Leak on Quit:** Addressed a bug where quitting Pi from the TUI left detached subagent children processes running indefinitely on the host machine.
    *   [earendil-works/pi Issue #12130](https://github.com/earendil-works/pi#12130)
*   **Issue #12133 [CLOSED] Windows Terminal Artifact:** Resolved an issue where exiting Pi on Windows Terminal left behind ghost input sequences when interacting with the PowerShell prompt.
    *   [earendil-works/pi Issue #12133](https://github.com/earendil-works/pi#12133)

### 4. Key PR Progress
Several PRs stabilized core functionality and improved robustness:

*   **PR #12110 [CLOSED] Copilot Reasoning Fix:** Implemented the fix to pass `reasoning_effort` for Gemini/Kimi models in GitHub Copilot integration. [Details](https://github.com/earendil-works/pi/pull/12110)
*   **PR #12145 [CLOSED] Large Diff Rendering Safety:** Increased the robustness of `ToolExecutionComponent.render()` to safely handle and render extremely large self-rendered tool outputs, like massive code diffs. [Details](https://github.com/earendil-works/pi/pull/12145)
*   **PR #12139 [CLOSED] Image Warning Consistency:** Prevented persistent non-vision image warnings from being sent to subsequent vision models after a model switch. [Details](https://github.com/earendil-works/pi/pull/12139)
*   **PR #12136 [CLOSED] Socket Error Retries:** Enhanced the retry logic to specifically catch and handle generic Node socket error codes (`ECONNRESET`, `EPIPE`) during provider calls, preventing premature session failure. [Details](https://github.com/earendil-works/pi/pull/12136)
*   **PR #12127 [CLOSED] Socket Retry Logic:** Improved the `isRetryableAssistantError` logic to properly account for bare Node socket error codes encountered during streaming failures. [Details](https://github.com/earendil-works/pi/pull/12127)
*   **PR #12128 [CLOSED] Streaming Abort Resilience:** Modified the system to better handle transient socket errors during streaming, leading to retries instead of immediate, hard turn abort. [Details](https://github.com/earendil-works/pi/pull/12128)
*   **PR #11787 [CLOSED] Auth Lock Cross-Link Safety:** Ensured the `auth.json` lock mechanism functions correctly across symbolic links in file systems, preventing authentication conflicts. [Details](https://github.com/earendil-works/pi/pull/11787)

### 5. Hot Discussions
**Show and Tell:**
*   **pi-opentui:** A public alpha OpenTUI frontend inspired by OpenCode was shared by `arahisman`. [Discussion #12155](https://github.com/earendil-works/pi/discussions/12155)
*   **tinyCode:** A project sharing techniques for maintaining small contexts to keep local model inference efficient (targeting 16k context). [Discussion #12146](https://github.com/earendil-works/pi/discussions/12146)

**General/Projects:**
*   **BOSS Harness:** A developer shared a custom job harness for recruitment tasks, separating UI, kernel execution, and CLI components. [Discussion #12152](https://github.com/earendil-works/pi/discussions/12152)

### 6. Feature Request Trends
*   **State Management/Persistence:** Requests for reliable cross-session state, especially regarding login tokens (Llama.cpp) and atomic session saving.
*   **API Control:** Desire for more granular control over provider interaction, such as bounded retries for specific error types (e.g., Gemini `MALFORMED_FUNCTION_CALL`).
*   **Tool Execution Transparency:** High interest in making the execution flow more visible, such as ensuring `reasoning_effort` is exposed for all models.

### 7. Developer Pain Points
*   **TUI/UX Stability:** Developers are frequently reporting or solving issues where complex UI interactions (large diffs, terminal resizing, theme switching) cause TUI instability.
*   **Connection Resilience:** Handling transient network errors (especially raw socket errors) during streaming LLM turns remains a complex area requiring deeper retry logic.
*   **Resource Management:** Ensuring cleanup is perfect, preventing orphaned background processes after TUI quits.

</details>

<details>
<summary><strong>Qwen Code</strong> — <a href="https://github.com/QwenLM/qwen-code">QwenLM/qwen-code</a></summary>

# Qwen Code Community Digest — 2026-11-14

## 1. Today's Highlights
The project is in a heavy stabilization phase: a large batch of CI failure reports and `deflake` issues dominate the last 24h, with most bot-filed flakes being rerun and closed. Alongside that, the 1.0 Preview kernel migration (#17045) continues to move toward `main`, and an active cluster of fixes targets loop/cron cancellation, memory re-injection, and Web Shell HTTP compatibility. No new releases landed in the window.

## 2. Releases
None in the last 24h.

## 3. Hot Issues

1. **[#14724](https://github.com/QwenLM/qwen-code/issues/14724)** — *Main CI failed: Managed Agent gate* (359 comments, OPEN). Stale but still the highest-traffic CI tracker; shows how long-lived some gate failures have become despite `autofix/skip`.
2. **[#11680](https://github.com/QwenLM/qwen-code/issues/11680)** — *E2E Tests: sandbox:docker shard* (59 comments, OPEN). Persistent Docker-sandbox E2E failure; a recurring source of noise for contributors merging into `main`.
3. **[#16787](https://github.com/QwenLM/qwen-code/issues/16787)** — *TUI agent-loop parity: approved write then declined* (48 comments, CLOSED). Closed after an interactive/TUI parity regression was resolved — important because it guards tool-approval parity between CLI and Ink UIs.
4. **[#13009](https://github.com/QwenLM/qwen-code/issues/13009)** — *cron-tools default registration* (24 comments, `ready-for-agent`). Blocking cron tooling surface; carries the `autofix/approved` label and is a strong candidate for automation.
5. **[#17045](https://github.com/QwenLM/qwen-code/issues/17045)** — *Land the 1.0 Preview loop kernel on main, one surface at a time* (15 comments, P1). The strategic roadmap item: incremental adoption of the event-driven `query()` kernel with per-surface switches.
6. **[#14104](https://github.com/QwenLM/qwen-code/issues/14104)** — *SDK Java HostedShellLifecycleRecoveryIT* (15 comments, OPEN). Java SDK lifecycle/recovery test failures; relevant to hosted-shell consumers.
7. **[#17099](https://github.com/QwenLM/qwen-code/issues/17099)** — *Track remaining npm security scan findings* (12 comments, P2 security). 29 Snyk findings across 43 dependency paths in `@qwen-code/web-shell` and `@qwen-code/sdk`; actively triaged.
8. **[#15894](https://github.com/QwenLM/qwen-code/issues/15894)** — *`loop_wakeup` not cancelled by a user stop* (8 comments, P2). Self-paced loops resume after explicit stop — a correctness bug for autonomous manager workflows.
9. **[#17091](https://github.com/QwenLM/qwen-code/issues/17091)** — *AUTO mode classifier cannot see approved plan* (`exit_plan_mode` rendered as `{}`). Permission-classifier blind spot; the plan/approval context never reaches the classifier.
10. **[#16824](https://github.com/QwenLM/qwen-code/issues/16824)** — *Repeated hallucinated project name despite clean reinstall* (5 comments, long-context/token-management). Highlights memory/context-persistence problems in long sessions.

## 4. Key PR Progress

1. **[#15620](https://github.com/QwenLM/qwen-code/pull/15620)** — *feat(channels): Microsoft Teams extension and host ingress*. Adds a Teams channel with threads, mentions, and ordered final-text replies; still open under autofix takeover.
2. **[#16023](https://github.com/QwenLM/qwen-code/pull/16023)** — *feat(managed-agent): share resident external Workspace across sessions*. Turns workspace acquisition into a membership refcount rather than per-cycle teardown.
3. **[#17164](https://github.com/QwenLM/qwen-code/pull/17164)** — *fix(memory): identify legacy recalled memory as contextual reminders*. Directly addresses the repeated-rule/repeated-confirmation loop seen in #17129.
4. **[#17196](https://github.com/QwenLM/qwen-code/pull/17196)** — *fix(web-shell): keep terminal and local commands working over plain HTTP*. UUID id-minting fallback for non-secure contexts (`getRandomValues` path).
5. **[#17025](https://github.com/QwenLM/qwen-code/pull/17025)** — *fix(cli): stabilize OpenTUI streaming markdown preview*. Disables sync streaming preview to eliminate jitter.
6. **[#16439](https://github.com/QwenLM/qwen-code/pull/16439)** — *fix(core): replay the persisted startup prelude on resume*. Resumed sessions re-use the original prelude (date, git snapshot, MCP instructions) rather than rebuilding.
7. **[#17055](https://github.com/QwenLM/qwen-code/pull/17055)** — *feat(core): resolve loop switches per surface with env force on/off*. Per-surface loop toggles with environment override — the rollout mechanism for #17045.
8. **[#17194](https://github.com/QwenLM/qwen-code/pull/17194)** — *test(cli): deflake managed runtime terminal replay (#17192)*. Attaches the listener before the socket opens so the replayed snapshot isn't missed.
9. **[#16973](https://github.com/QwenLM/qwen-code/pull/16973)** — *fix(ci): run lint through symlinked entry paths*. Fixes silent lint no-ops that pass without checking anything.
10. **[#17190](https://github.com/QwenLM/qwen-code/pull/17190)** / **[#17202](https://github.com/QwenLM/qwen-code/pull/17202)** — *fix(core): model-catalog normalization for DeepSeek V3.1/V3.2 and Ollama llama4 tags*. Prevents output-token/image-capability losses from id-normalization mismatches.

## 5. Hot Discussions
No dedicated Discussion data was provided in this window; omitted.

## 6. Feature Request Trends
- **Channel ecosystem expansion**: Teams (#15620), QQ outbound media (#15450/#17167), DingTalk follow-ups (#17173) — multi-channel integration is clearly a top investment.
- **Programmatic tool calling** (#16944, closed as duplicate): model-written sandbox programs that orchestrate multiple tool calls and return only the result.
- **Continuable subagents** (#16518): follow-up messages into sub-sessions and failed background agents instead of one-shot subagent invocation.
- **Self-paced /loop autonomy**: re-arming wakeups, plus the need for reliable stop semantics (#15894).
- **Web Shell UX**: session search redesign (#16778) and "Ask in side task" in the message selection menu (#16964).

## 7. Developer Pain Points
- **CI noise and flakes dominate**: the highest-comment items are all bot-filed CI failures; dozens of `deflake` issues (#17159, #17184, #17186, #17192, #17195, #17203) crowd the tracker and obscure real regressions.
- **Infra instability**: `hz5` runners accepting jobs they cannot check out (#17030) — seven jobs across five PRs failed at `checkout` due to broken github.com routing.
- **Context/memory contamination**: duplicated rule injection per turn (#17129, #17164) and hallucinated project names persisting across reinstalls (#16824).
- **Loop stop semantics**: a user-sent stop does not cancel `loop_wakeup`, so `/loop` resumes itself (#15894).
- **Permissions correctness**: malformed rules parsing as inert without reporting (#16078); AUTO-mode classifier blind to approved plans (#17091).
- **Review latency**: merge-ready PRs stalling 72h+ on approvals and host-class CI reruns (#17167).

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*