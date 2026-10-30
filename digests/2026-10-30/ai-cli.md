# AI CLI Tools Community Digest 2026-10-30

> Generated: 2026-10-30 00:48 UTC | Tools covered: 7

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

# Cross-Tool Comparison Report — AI CLI Developer Tools
**Date: 2026-10-30 | Scope: Claude Code, OpenAI Codex, Gemini CLI, GitHub Copilot CLI, OpenCode, Pi, Qwen Code**

---

## 1. Ecosystem Overview

The AI CLI landscape has matured into a seven-way contest where core agent loops are largely table stakes and differentiation has shifted to **reliability, session lifecycle management, and multi-surface integration**. This window is dominated by operational-scale problems rather than headline features: Codex Desktop users report 100–165 GiB session directories, Copilot CLI processes ballooning to 37 GiB, and OpenCode's event table reaching 13 GB. Simultaneously, several tools shipped meaningful UX upgrades (Codex's transcript selection/search, OpenCode's `/goal` loop and default image generation, Qwen v0.26.4) — evidence that shipping velocity has not slowed even as stability debt accrues. A converging theme across all communities is **agent observability and control**: subagents, MCP tools, and session state are increasingly treated as black boxes that developers are demanding the ability to inspect, steer, and audit.

---

## 2. Activity Comparison

| Tool | Issues (updated 24h) | PRs (updated 24h) | Discussions | Release Status |
|---|---|---|---|---|
| **Claude Code** | 50 | 2 (1 open, 1 closed) | N/A (none provided) | No release; 0.166.0-adjacent chatter absent |
| **OpenAI Codex** | ~10 flagged + active tracker | 10 substantive | Yes (Ideas, Q&A, Show & tell) | **rust-v0.166.0 + alpha.6 shipped** |
| **Gemini CLI** | 50 touched | 43 touched | N/A (none provided) | No release |
| **GitHub Copilot CLI** | 38 updated | **0** | N/A (none provided) | No release; triage-only day |
| **OpenCode** | Active (megathread 110 cmts) | 10 substantive | N/A (none provided) | **v2.2.2 + v2.2.1 + 2 daemon releases** |
| **Pi** | Active (5+ P0/crash reports) | 10+ landed fixes | Yes (Q&A, Show & tell) | No release |
| **Qwen Code** | Active (P1 CI cluster) | 10 substantive | N/A (none provided) | **v0.26.4 + nightly + SDK + desktop** |

**Notes:** Claude Code, Gemini CLI, Copilot CLI, OpenCode, and Qwen Code do not surface Discussions in the provided dataset — this reflects **data availability, not community inactivity**, and should not be interpreted as absence of a discussion channel.

---

## 3. Shared Feature Directions

The following requirements recur across **three or more** tool communities, indicating genuine ecosystem-level demand rather than tool-specific quirks:

### 3.1 Prompt-Cache Stability & Cost Transparency
- **Pi**: #10024 (system prompt head moves mid-run), #11529 (tool order = registration order busts cache), #6881 (prefer provider-reported cost)
- **OpenCode**: #45417 (subagent cost excluded — 17 👍), #59803 (Copilot long-context undercounting), #34877 ($0.00 for Chinese providers)
- **Qwen Code**: #14332 (context-aware truncation), #15855 (`contextWindowSize` stripped)
- **Codex**: #56899 (delegate model/cost mismatch warnings)
- **Copilot CLI**: #4802 (PRU quota wiped by Assisted Permissions)
> **Signal:** Every tool community is independently discovering that cost attribution and cache invalidation are broken. This is a *shared infrastructure gap*, not per-vendor polish.

### 3.2 Subagent / Agent Observability
- **Gemini CLI**: #22598 (`/chat share`), #21763 (`/bug` misses subagent context), #18287 (shared memory)
- **OpenCode**: #37267 (subagent output views), #27995 (activity sidebar), #38966 (steer/cancel subagents)
- **Qwen Code**: #13649 (A2A `contextId`), #15875 (SDK message-ID protocol bug)
- **Claude Code**: #16078 (active skill in status line), #98816 (Stop hook `background_tasks`)
> **Signal:** Agents fan out but no tool offers adequate visibility into what subagents are doing, costing, or how they terminated.

### 3.3 Trustworthy Termination / Silent-Failure Reporting
- **Gemini CLI**: #22323 (subagent reports GOAL success after MAX_TURNS), #21983 (GOAL despite failure), #21409 (indefinite hang)
- **Claude Code**: #88731 (silent regression in scheduled tasks), #99171 (Stop hook exit-2 silently non-blocking)
- **OpenCode**: #38723 (`opencode run` hangs ~56%), #32149 (stalls, 13 👍)
- **Copilot CLI**: #4600 (MCP images silently dropped under BYOK)
- **Pi**: #11157 (extensions silently force legacy transcript mode — p0)
> **Signal:** Agents failing *silently and reporting success* is the single most damaging cross-tool pattern — it breaks automation trust fundamentally.

### 3.4 Session Storage & Lifecycle Hygiene
- **Codex**: 100–165 GiB sessions (#35458, #23257), 1,784 stale marketplace clones (#29994), re-uploading images every turn (#35732)
- **OpenCode**: 13 GB `event` table (#33356)
- **Pi**: session dirs `0755`/files `0644` (#10770, fixed by #11587)
- **Claude Code**: VM bundle location control (#56089, top upvote)
- **Copilot CLI**: 37 GiB process growth (#5254)
> **Signal:** Long-lived sessions were not designed for the scale users now operate at. Storage/resource governance is a universal unmet need.

### 3.5 MCP Reliability & Authorization Lifecycle
- **Claude Code**: #88901 (elicitation capability declared but never rendered), #105744 (1Password `not_connected`)
- **Copilot CLI**: #4994 (OAuth reopens every ACP session — 8 👍), #5058 (Datadog token exchange)
- **Codex**: #58161 (richer MCP approval metadata), #56970 (hot-reload MCP)
- **Pi**: #11558 (namespace-scoped `tool_search` for overlapping MCP servers)
- **Gemini CLI**: #24246 (>128 tools → 400 error)
> **Signal:** MCP is now load-bearing infrastructure, and its authorization lifecycle and tool-count scaling are weak links.

### 3.6 Safer Credential & Destructive-Command Handling
- **Claude Code**: #96762 (1Password-style credential handoff)
- **Codex**: #58161 (annotation hints in approvals)
- **OpenCode**: #52083 (permission bypass via compound shell — high severity), #36682 (compaction prompt injection)
- **Gemini CLI**: #22672 (stop/reduce `git reset --force` behavior)
- **Copilot CLI**: #5275 (default-deny with allowlists for non-interactive)
> **Signal:** Permission model brittleness is a top security concern, especially for CI/headless use.

---

## 4. Differentiation Analysis

| Dimension | Claude Code | OpenAI Codex | Gemini CLI | Copilot CLI | OpenCode | Pi | Qwen Code |
|---|---|---|---|---|---|---|---|
| **Primary target** | Enterprise desktop + Cowork VM workflows | Desktop + VS Code + voice, ChatGPT ecosystem | Agentic codebase investigation (subagents, AST) | GitHub/enterprise orgs, ACP integrators | Cost-conscious multi-provider power users | Terminal purists, extension authors | Self-hosted / CI, Qwen model users |
| **Technical approach** | Desktop-first, VM isolation, hook system | Rust core, app-server + remote/mobile, ACP | Subagent-first orchestration, AST roadmap | ACP + MCP parity with TUI | Provider-agnostic, daemon/PTY architecture, plugins | Minimal Rust-ish core, strong TUI, extensions | Managed Agent stack, hybrid code mode, ECS CI |
| **Distinct focus today** | Cowork VM stability, MCP elicitation | Desktop storage leaks, transcript UX | Agent termination correctness, Windows | Auth/entitlement, ACP feature gap | `/goal` loop, image-gen, cost accuracy | Prompt-cache stability, terminal edge cases | CI/CD infrastructure reliability |
| **Release cadence** | Quiet | **Active (0.166.0 line)** | Quiet | Quiet | **Very active (4 releases)** | Quiet | **Active (4 artifacts)** |
| **Philosophical stance** | Managed, sandboxed, permissioned | Multi-surface, mobile-continuity | Model-native, agentic autonomy | Enterprise integration, ACP | Provider neutrality, plugin ecosystem | Transparency, low-level control | Self-hosted, CI-native |

**Key divergences:**
- **Claude Code and Codex** both invest in *cross-device session continuity* (Remote Control, Android Remote, mobile app) — the only two clearly pursuing mobile as a first-class surface.
- **Gemini CLI** is alone in making *AST-aware tooling* a strategic EPIC — a differentiated bet on token efficiency.
- **Pi** is idiosyncratic in its focus on *prompt-cache correctness and terminal multiplexer behavior* — a sign of a highly technical, opinionated user base.
- **OpenCode and Copilot CLI** depend most heavily on **ACP** as an external integration surface; both show ACP parity as a top feature trend.
- **Qwen Code** is the only tool where **CI/CD infrastructure itself** is the #1 tracked concern — reflecting its self-hosted/deployment-first user base.

---

## 5. Community Momentum & Maturity

**Rapidly iterating (high release + PR velocity):**
- **OpenCode** — 4 releases in-window, 10 substantive PRs, new `/goal` primitive and default image generation. Highest shipping tempo; classic fast-moving-but-accumulating-debt profile (see 13 GB DB, prompt injection).
- **Qwen Code** — v0.26.4 + nightly + SDK + desktop across 10 PRs including large modularization (#15871) and hybrid code mode (#11854). Enterprise-grade CI investment signals organizational maturity.
- **Codex** — 0.166.0 line actively iterating; 10 well-scoped PRs on config, security, and agent resilience.

**High-engagement / high-signal communities:**
- **Gemini CLI** — 50 issues + 43 PRs touched; P1 correctness bugs with strong reproduction (👍8 on hang). Deep, technically substantive discourse.
- **Claude Code** — 50 issues updated; strong upvote signals (#56089 at 59, #37569 at 27, #16078 at 25) on concrete UX/storage requests. Mature triage, though "stale-bot churn" is a noted friction.
- **Copilot CLI** — 38 issues but **zero PRs and zero releases**; a triage-only window with an unresolved flagship auth bug (#552, 31 comments, open since ~early cycle). Slower maintainer throughput is the notable maturity gap.
- **Pi** — Smaller scale but high technical density: p0 extension footgun (#11157), 5 OOM crash reports in 2 days (#11570), plus a community Rust port (`pi-rs`) demonstrating ecosystem enthusiasm.

**Maturity read:** Codex, Claude Code, and Gemini CLI show mature, structured triage at scale. OpenCode and Qwen Code show the strongest *feature* momentum. Copilot CLI shows the widest gap between community demand and maintainer output in this window.

---

## 6. Trend Signals

**1. The "agent correctness" reckoning.** The most consequential emerging theme is that agents can *lie* — reporting `GOAL success` after hitting a cap (Gemini #22323), silently regressing scheduled tasks (Claude #82501), or hanging with no output (OpenCode #38723). For developers building on these CLIs in CI, **verifiable termination semantics are becoming a procurement criterion**, not a nice-to-have.

**2. Storage and resource governance as a first-class discipline.** Across Codex, OpenCode, Pi, Claude Code, and Copilot CLI, unbounded session/DB/process growth is a top pain point. Expect vendors to ship retention policies, dedup of compaction snapshots, and storage caps — and expect **this to be a differentiator for self-hosted/enterprise deployments**.

**3. MCP is infrastructure — and its auth lifecycle is the weak point.** OAuth re-prompts, dropped images, and token-exchange failures span four tools. As MCP server counts grow, **per-server TLS trust, hot-reload, and scoped tool namespacing** (Pi #11558, Codex #56970) are becoming the natural evolution.

**4. Cost transparency is broken across the board.** Subagent costs excluded, provider rates wrong, cache invalidation re-billing — this is the clearest *shared* unmet need. A tool that nailed accurate, real-time cost attribution would have a genuine competitive wedge.

**5. Agent observability is the next UX frontier.** After chat UX matured (transcript search, `/goal`, status lines), the frontier has moved to *inspecting the agent's internal work* — subagent trajectories, skill attribution, tool-call pairing (Gemini #30043), and session sharing.

**6. Self-hosted and CI-native use cases are maturing.** Context immutability for slow local models (Qwen #14215), CI-runner reliability (Qwen cluster), and default-deny permissions for automation (Copilot #5275) show a distinct enterprise/CI user segment with needs that differ from interactive desktop users.

**Reference value for developers:**
- If you run these tools **in CI**, prioritize tools with trustworthy termination reporting and default-deny permissions — and verify subagent status semantics before trusting automation.
- If you operate **long-lived or self-hosted sessions**, storage governance and prompt-cache stability are your highest-risk areas today.
- If you are building **on MCP or ACP**, expect OAuth and tool-scaling (128-tool limits, namespace collisions) to be the friction points to design around.
- **Watch OpenCode and Qwen Code** for fastest feature iteration; **watch Codex and Pi** for the most disciplined correctness work; **watch Copilot CLI** for whether maintainer throughput catches up to community demand.

---

*Report compiled from 2026-10-30 community digests across seven repositories. Counts reflect items updated in the preceding 24 hours as reported in source datasets; "N/A" denotes channel data not provided, not confirmed absence.*

---

## Per-Tool Reports

<details>
<summary><strong>Claude Code</strong> — <a href="https://github.com/anthropics/claude-code">anthropics/claude-code</a></summary>

## Claude Code Skills Highlights

> Source: [anthropics/skills](https://github.com/anthropics/skills)

# Claude Code Skills — Community Highlights Report
*Data as of 2026-10-30 | Source: github.com/anthropics/skills*

---

## 1. Top Skills Ranking (by community attention)

| # | Skill / PR | Functionality | Discussion Highlights | Status |
|---|-----------|---------------|----------------------|--------|
| 1 | [#492 — Security: `anthropic/` namespace trust abuse](https://github.com/anthropics/skills/issues/492) | *Issue, not PR — but the single most-discussed thread (46 comments)* | Community skills distributed under `anthropic/` namespace impersonate official skills; users may grant elevated permissions believing them official | OPEN |
| 2 | [#1742 — fix(mcp-builder): `mcp>=2` streamable HTTP client](https://github.com/anthropics/skills/pull/1742) | Repairs MCP-builder connection scripts for `mcp>=2.0.0` (renamed `streamable_http_client`, custom headers via `create_mcp_http_client`) | Fixes #1668; breakage from upstream MCP SDK rename affects all MCP-builder users | OPEN |
| 3 | [#1298 — fix(skill-creator): isolate trigger evals](https://github.com/anthropics/skills/pull/1298) | Makes trigger evaluation reliable: isolates per-worker command probes, fixes Windows `select()` on subprocess pipes, handles runtime failures | Trigger evals currently report false misses/invalid scores, misleading optimization | OPEN |
| 4 | [#1245 — notion-spec-to-implementation + quantitative-resume-auditor](https://github.com/anthropics/skills/pull/1245) | Converts Notion product/tech specs into implementation tasks Claude Code can execute; second skill audits resumes quantitatively | Two-in-one submission; long-lived (created Jun, updated Oct) — signals continued author investment | OPEN |
| 5 | [#1771 — proofcore-contract-auditor](https://github.com/anthropics/skills/pull/1771) | Static analysis of Solidity/Rust contracts; anchors audit proofs on TON Blockchain via Merkle protocol | First Web3-oriented skill in the collection; zero-storage proof model | OPEN |
| 6 | [#1703 — md2video-audio](https://github.com/anthropics/skills/pull/1703) | Compiles Markdown into MP4 videos with slides (Marp) + human-like voiceovers | "Zero-cost" media pipeline; notable for going beyond text outputs | OPEN |
| 7 | [#1681 — fix(skill-creator): direct `package_skill.py` execution](https://github.com/anthropics/skills/pull/1681) | Fixes `ModuleNotFoundError` when running packaging script standalone; updates stale usage paths | Second skill-creator fix by same author (cf. #1742 Kuldeeep18) — highlights skill-creator tooling fragility | OPEN |
| 8 | [#1997 — fix(skill-creator): YAML frontmatter parsing](https://github.com/anthropics/skills/pull/1997) | `parse_skill_md` mishandles quotes/continuation lines, silently corrupting eval metadata | Directly undermines description-optimization accuracy | OPEN |

> Note: All top PRs are OPEN with `Comments: undefined` in the dataset; rank reflects recency-weighted activity and issue linkage (e.g., “Fixes #…”). The most *commented* item overall is Issue #492 (46 comments).

---

## 2. Community Demand Trends (from Issues)

1. **Trust, security & governance** — [#492 namespace impersonation](https://github.com/anthropics/skills/issues/492) (46 comments, top overall), [#412 agent-governance skill proposal](https://github.com/anthropics/skills/issues/412), and [#1394 eval-viewer XSS](https://github.com/anthropics/skills/issues/1394) show strong demand for provenance guarantees and safety patterns.
2. **Skill distribution & team workflow** — [#228 org-wide skill sharing in Claude.ai](https://github.com/anthropics/skills/issues/228) (17 comments, 8 👍) and [#189 duplicate plugin content](https://github.com/anthropics/skills/issues/189) (9 👍) reveal demand for a shared skill library and cleaner packaging.
3. **Evaluation reliability** — [#556 run_eval.py 0% trigger rate](https://github.com/anthropics/skills/issues/556) (13 comments, 7 👍) and [#1390 mcp-builder evaluation scores 0/N](https://github.com/anthropics/skills/issues/1390): the community wants trustworthy skill-eval harnesses before scaling contributions.
4. **Context efficiency** — [#1487 claude-api injects ~156k tokens](https://github.com/anthropics/skills/issues/1487) and [#1329 compact-memory symbolic notation](https://github.com/anthropics/skills/issues/1329): demand for token-lean skill design and compact agent state.
5. **Quality-gate pipelines** — [#1385 reasoning quality gates](https://github.com/anthropics/skills/issues/1385) (calibration → adversarial review → delivery verification) and [#202 skill-creator best practices](https://github.com/anthropics/skills/issues/202): appetite for output-verification and authoring guidance.

**Distilled directions:** security/provenance → team sharing → reliable evaluation → token efficiency → document/artifact quality control.

---

## 3. High-Potential Pending Skills (active, unmerged)

| Skill / PR | Why it may land soon |
|-----------|---------------------|
| [#1742 mcp-builder mcp>=2 fix](https://github.com/anthropics/skills/pull/1742) | Upstream SDK breakage blocks all MCP-builder users; straightforward compat fix, updated Oct 8 |
| [#1977 algorithmic-art wrapAround()](https://github.com/anthropics/skills/pull/1977) / [#1976 element_discovery textarea/select](https://github.com/anthropics/skills/pull/1976) / [#1975 pptx --cols validation](https://github.com/anthropics/skills/pull/1975) | Same author (gerardrecinto), all small self-contained bug fixes linked to filed issues (#1897/#1891/#1809); high merge odds |
| [#1734 Detect orphaned docx comments](https://github.com/anthropics/skills/pull/1734) | Docx quality gap, updated Sep 25, minimal scope |
| [#1792 docx LibreOffice timeout → error](https://github.com/anthropics/skills/pull/1792) | Fixes silent false-success; verifies output XML before claiming success |
| [#525 pyxel retro game skill](https://github.com/anthropics/skills/pull/525) | Long-running (since Mar) but continuously updated (Oct 23) — sustained author commitment |
| [#1245 notion-spec-to-implementation](https://github.com/anthropics/skills/pull/1245) | Updated Oct 15; workflow-automation demand aligns with community trends |
| [#514 document-typography](https://github.com/anthropics/skills/pull/514) | Addresses orphan/widow/numbering issues “every document Claude generates” — broad applicability |
| [#1980 webapp-testing shell=True fix](https://github.com/anthropics/skills/pull/1980) | CWE-78 injection fix, updated Oct 25 — security-adjacent, easy review |

---

## 4. Skills Ecosystem Insight

**The community's most concentrated demand is trust and reliability infrastructure — provenance/security guarantees, shareable team distribution, and accurate skill-evaluation tooling — rather than new skill categories themselves.**

---

*Links are formatted as `anthropics/skills PR/Issue #N`. “Comments: undefined” in the source dataset was treated as unavailable; ranking weighted by update recency and issue linkage.*

---

# Claude Code Community Digest — 2026-10-30

## 1. Today's Highlights

No new releases landed in the past 24 hours, but the issue tracker remains highly active with 50 issues updated. Windows and macOS desktop/Cowork problems dominate the conversation, spanning VM storage configuration, kernel pool leaks, and Remote Control session persistence. A cluster of low-comment but high-severity bugs around MCP elicitation, credential connectors, and background task handling signals ongoing stability gaps in the desktop and agent-session layers.

## 2. Releases

No new releases in the last 24 hours.

## 3. Hot Issues

1. **[#56089](https://github.com/anthropics/claude-code/issues/56089)** — *Allow configuring VM bundle (vhdx) storage location* (14 comments, 👍59). The single most-upvoted item in this window; users want control over where Claude Cowork's VM disk lives, likely driven by disk-space constraints on Windows. High community traction.

2. **[#88731](https://github.com/anthropics/claude-code/issues/88731)** — *Artifact tool absent in `claude remote-control` server-mode sessions* (10 comments). A parity bug: `claude --remote-control` works but server-mode spawns lose the Artifact tool. Matters for teams relying on headless/remote agent workflows.

3. **[#82501](https://github.com/anthropics/claude-code/issues/82501)** — *`send_message` from scheduled-task sessions silently regressed* (8 comments). A behavior change between 2026-07-21 and 2026-07-30 with no confirmation path — concerning for automation reliability.

4. **[#88901](https://github.com/anthropics/claude-code/issues/88901)** — *Embedded claude-code declares elicitation capability but never renders it* (7 comments, 👍5). MCP server-initiated elicitations hang until timeout in Desktop/Cowork. A core MCP protocol conformance issue.

5. **[#100114](https://github.com/anthropics/claude-code/issues/100114)** — *Windows desktop: Remote Control not restored after relaunch* (7 comments, 👍3). Sessions show as archived on mobile after silent updates — a cross-device state-sync regression.

6. **[#96762](https://github.com/anthropics/claude-code/issues/96762)** — *Opt-in credential/payment entry + 1Password-style handoff* (7 comments, 👍4). Requests a safer path than the current blanket "prohibited" list for browser automation.

7. **[#37569](https://github.com/anthropics/claude-code/issues/37569)** — *Option to disable streamed response output* (6 comments, 👍27). Second-highest upvote count; users find token-by-token streaming distracting and want a full-response mode.

8. **[#16078](https://github.com/anthropics/claude-code/issues/16078)** — *Show active skill in status line* (3 comments, 👍25). Simple but strongly requested TUI observability improvement as skill usage grows.

9. **[#91265](https://github.com/anthropics/claude-code/issues/91265)** — *Cowork VM causes persistent kernel pool leak on Windows* (2 comments). Toke/File/SeAt pool leaks degrade system-wide UI — a serious resource-management bug.

10. **[#89110](https://github.com/anthropics/claude-code/issues/89110)** — *Claude Desktop inhibits sleep on Linux and leaves orphaned processes* (5 comments, 👍3). Platform hygiene issue affecting Linux desktop users.

## 4. Key PR Progress

Only two PRs were updated in the last 24 hours, both modest:

1. **[#57333](https://github.com/anthropics/claude-code/pull/57333)** — *Update README.md* (CLOSED). Documentation-only change by M-Mikran-Sandhu; closed without further detail.

2. **[#32751](https://github.com/anthropics/claude-code/pull/32751)** — *fix(hookify): map stop/prompt events to correct field names* (OPEN). Fixes [#32153](https://github.com/anthropics/claude-code/issues/32153): Hookify rules using `pattern` syntax with `event: stop`/`event: prompt` never fire because `config_loader.py` maps them to `field='content'`, which `rule_engine._extract_field()` can't resolve for Stop/UserPromptSubmit. This is the only substantive open PR in the window and directly addresses a hook-reliability bug.

*Note: fewer than 10 PRs were available in the dataset; all are listed above.*

## 5. Hot Discussions

No discussion data was provided in this dataset. Section omitted.

## 6. Feature Request Trends

Distilling across all issues in this window, the dominant feature directions are:

- **Configurable resource/storage control** — VM bundle location ([#56089](https://github.com/anthropics/claude-code/issues/56089)), working-directory awareness for `/diff` ([#92108](https://github.com/anthropics/claude-code/issues/92108)).
- **TUI observability & UX toggles** — disable streaming output ([#37569](https://github.com/anthropics/claude-code/issues/37569)), show active skill in status line ([#16078](https://github.com/anthropics/claude-code/issues/16078)).
- **Safer credential/browser automation** — opt-in credential entry with handoff ([#96762](https://github.com/anthropics/claude-code/issues/96762)).
- **Artifact/comment workflow routing** — send artifact comments to the publishing session, not an auto-replier ([#103510](https://github.com/anthropics/claude-code/issues/103510)).
- **Adaptive agent orchestration** — "Ultracode Auto" letting Claude judge per-prompt whether a workflow is worthwhile ([#106080](https://github.com/anthropics/claude-code/issues/106080)).
- **Deliverables execution** — Desktop deliverables list opening scripts as text-only and prompting users to paste secrets ([#106081](https://github.com/anthropics/claude-code/issues/106081)).

## 7. Developer Pain Points

Recurring frustrations across the tracker:

- **Desktop/Cowork stability on Windows & Linux** — VM kernel pool leaks ([#91265](https://github.com/anthropics/claude-code/issues/91265)), MSIX path-desync breaking the bundled binary ([#105511](https://github.com/anthropics/claude-code/issues/105511)), Cowork VM crashing host VirtualBox VMs ([#106078](https://github.com/anthropics/claude-code/issues/106078)), and orphaned processes / sleep inhibition on Linux ([#89110](https://github.com/anthropics/claude-code/issues/89110)).
- **Session & background-task reliability** — Remote Control not restored ([#100114](https://github.com/anthropics/claude-code/issues/100114)), silent model switching and dropped background agents ([#106076](https://github.com/anthropics/claude-code/issues/106076)), and Stop hook `background_tasks` including ambient watchers ([#98816](https://github.com/anthropics/claude-code/issues/98816)).
- **MCP protocol gaps** — elicitation capability declared but never rendered ([#88901](https://github.com/anthropics/claude-code/issues/88901)); 1Password connector failing with `not_connected` ([#105744](https://github.com/anthropics/claude-code/issues/105744)).
- **Permissions/approval friction** — auto-memory prompting on symlinked config dirs ([#98044](https://github.com/anthropics/claude-code/issues/98044)); EnterWorktree blocking background jobs on nested-repo prompts ([#104541](https://github.com/anthropics/claude-code/issues/104541)).
- **Hooks & tooling correctness** — Stop hook exit-2 silently made non-blocking ([#99171](https://github.com/anthropics/claude-code/issues/99171)); plugin `$.store.set` lock contention across sessions ([#106079](https://github.com/anthropics/claude-code/issues/106079)).
- **Auth/environment regressions** — background sessions setting `BROWSER=true` breaking Bedrock+SSO credential_process ([#104398](https://github.com/anthropics/claude-code/issues/104398)).
- **Stale-bot churn** — valid bugs closed as stale then auto-locked, forcing re-files (e.g., [#99171](https://github.com/anthropics/claude-code/issues/99171) referencing [#60490](https://github.com/anthropics/claude-code/issues/60490)).

Overall, the community's attention is concentrated on **desktop/Cowork reliability, session persistence across devices, and MCP/hook correctness**, with a steady undercurrent of requests for TUI configurability and safer credential handling.

</details>

<details>
<summary><strong>OpenAI Codex</strong> — <a href="https://github.com/openai/codex">openai/codex</a></summary>

# OpenAI Codex Community Digest — 2026-10-30

## 1. Today's Highlights

Release activity continues on the 0.166.0 line, headlined by a substantial TUI upgrade: keyboard-driven transcript selection with word/line/page motions, integrated search, and configurable shortcuts. Meanwhile, the issue tracker remains dominated by a severe cluster of session-storage blowups in Codex Desktop, where compaction and subagent forking re-persist full image payloads, pushing `$CODEX_HOME/sessions` past 100–165 GiB in reported cases.

## 2. Releases

**rust-v0.166.0** — https://github.com/openai/codex/releases
- Added keyboard-driven transcript selection (word/line/page motions), integrated search, and configurable shortcuts (#57221–#57224).
- Rendered Markdown consistently across async questions, choices, answers, and transcript replies (#57259, #57292).
- Added GPT-related feature work (release note truncated).

**rust-v0.166.0-alpha.6** — https://github.com/openai/codex/releases
- Alpha cut of the 0.166.0 line; no detailed notes provided.

## 3. Hot Issues

1. **#34268 [CLOSED] Multi-agent V2 full-history forks duplicate compaction snapshots and inline images (~110 GiB sessions)** — https://github.com/openai/codex/issues/34268
   The canonical report of multiplicative session growth: forked subagents inherit duplicated compaction snapshots and inline images. Closed with 17 comments and 7 👍, suggesting a fix landed — but see the still-open siblings below.

2. **#35458 [OPEN] Desktop screenshots re-persisted on every compaction and inherited by subagent forks (~165 GiB, 95% base64)** — https://github.com/openai/codex/issues/35458
   The largest reported footprint yet, on a Pro ($200) plan. 16 comments, still open — the community is treating this as the flagship storage-leak thread.

3. **#23257 [OPEN] Desktop compaction repeatedly embeds full image base64 in compacted checkpoints** — https://github.com/openai/codex/issues/23257
   The oldest of the cluster (May 2026) and likely a root cause for #34268/#35458. Its longevity (13 comments, 5 👍) is itself a signal of slow resolution.

4. **#41708 [OPEN] Android Remote message queue stuck after host turn completes; recovery may lose/delay messages** — https://github.com/openai/codex/issues/41708
   Mobile-to-host delivery reliability gap: UI shows an active Stop control after the authoritative host turn ended. 13 comments, 3 👍 — a correctness issue for remote workflows.

5. **#50520 [OPEN] Windows sandbox: recurring `helper_sandbox_lock_failed` after `.sandbox-bin` permissions revert to Modify** — https://github.com/openai/codex/issues/50520
   Sandbox initialization failure blocks all shell execution until ACLs are manually fixed. 13 comments — high operational impact on Windows.

6. **#37526 [OPEN] App-server still drops remote-control clients when outbound queue fills (128 messages)** — https://github.com/openai/codex/issues/37526
   Explicit regression report: the earlier #18203 fix missed this code path, still reproducible on `main`. 8 comments, 3 👍 — notable because it's a known-unfixed disconnect.

7. **#29994 [OPEN] Marketplace upgrades leave full git clones in `.tmp/marketplaces/.staging/`** — https://github.com/openai/codex/issues/29994
   1,784 leftover staging directories accumulated. A second, independent disk-growth vector beyond sessions. 7 comments, 2 👍.

8. **#37950 [OPEN] Realtime voice sessions do not receive AGENTS.md / Personality instructions** — https://github.com/openai/codex/issues/37950
   Instruction-parity bug: text sessions honor project instructions, voice does not. 6 comments, 4 👍 — strong agreement ratio for a config-correctness issue.

9. **#38861 [OPEN] App reports "Context compacted" after remote compaction failed, then stuck reconnecting** — https://github.com/openai/codex/issues/38861
   Misleading state reporting plus a reconnect loop — a compounding UX/connectivity failure. 5 comments, 3 👍.

10. **#35732 [OPEN] Historical images re-uploaded on every turn in Desktop and VS Code** — https://github.com/openai/codex/issues/35732
    The network-side twin of the storage leak: full image history resent each turn. 3 comments but tightly correlated with #55083 (≥1 GB upload per round) — together they form a coherent performance theme.

## 4. Key PR Progress

1. **#58202 Keep chats accessible across model provider changes** — https://github.com/openai/codex/pull/58202
   Prevents saved chats from disappearing when resuming after a provider mismatch, missing config, or policy conflict.

2. **#58198 Centralize TOML config deserialization** — https://github.com/openai/codex/pull/58198
   Routes `ConfigToml` through a shared `TryFrom<toml::Value>` with strict ignored-field validation — config-reliability groundwork.

3. **#58196 Require Bazel release artifacts and publish DotSlash manifests** — https://github.com/openai/codex/pull/58196
   Removes `continue-on-error` from Bazel release jobs; desktop consumers now get guaranteed Cargo + Bazel artifacts.

4. **#58195 Preserve remote read compatibility with older executors** — https://github.com/openai/codex/pull/58195
   Omits sandbox contexts from remote read ops when policy allows unrestricted reads, fixing skill loading across executor versions.

5. **#58190 Allow providers to opt into Cyber access programs** — https://github.com/openai/codex/pull/58190
   Adds `capabilities.cyber_access_programs` so custom (non-`openai`) providers can accept explicit program selections.

6. **#58182 Support managed network requirements under `permissions.network`** — https://github.com/openai/codex/pull/58182
   Extends `requirements.toml` with shared network constraints, applied through config loading, approvals, and Windows sandbox validation.

7. **#58165 Keep remote plugin bundle URLs out of diagnostics** — https://github.com/openai/codex/pull/58165
   Security fix: strips signature tokens from debug/error output for remote plugin bundle downloads.

8. **#58161 Include tool names and annotation hints in MCP approval metadata** — https://github.com/openai/codex/pull/58161
   Adds `tool_name` plus `readOnlyHint`/`destructiveHint`/`idempotentHint`/`openWorldHint` to approval elicitations — better-informed consent for MCP tools.

9. **#58157 Expose system proxy support as an experimental setting** — https://github.com/openai/codex/pull/58157
   Adds "System proxy" to `/experimental` (macOS/Windows), default-off, with updated doctor guidance.

10. **#58147 Return standalone web search failures to the model** — https://github.com/openai/codex/pull/58147
    Converts fatal turn-aborting search errors into unsuccessful tool outputs the model can respond to — a meaningful agent-resilience change.

## 5. Hot Discussions

**Ideas**
- **#57967 1–2 free Codex usage resets per month for ChatGPT Plus subscribers** — https://github.com/openai/codex/discussions/57967 — Requests converting occasional promotional resets into a predictable monthly allowance.

**Q&A**
- **#8582 Search/Find in the active chat history** — https://github.com/openai/codex/discussions/8582 — Ctrl-F is captured by the editor pane; no in-canvas search exists. Notably relevant given transcript search just shipped in the TUI (#57221–#57224).
- **#5210 Any way to clear the text area?** — https://github.com/openai/codex/discussions/5210 — No shortcut for clearing a large accidental paste.

**Show and tell**
- **#53803 swe-mux: run several Codex sessions with live status, on desktop and phone** — https://github.com/openai/codex/discussions/53803 — Runs the real CLI in real terminals; surfaces "working / done / waiting on you" status across sessions.
- **#57591 toli: let Codex and Claude Code collaborate across machines** — https://github.com/openai/codex/discussions/57591 — Apache-2.0 inter-agent communication layer, motivated by split context between two developers' agents.
- **#58093 OpenFusion: orchestrator/router for subtask handling** — https://github.com/openai/codex/discussions/58093 — Routes each subtask to the cheapest capable model with judge-based escalation; ships benchmarks.
- **#57746 Zozo: an inspectable issue-to-PR example and review checklist** — https://github.com/openai/codex/discussions/57746 — Coordinates Codex and other runtimes against a backlog, with a public issue/diff/CI trace.
- **#56337 Off the Wall: recall past corrections before Codex answers** — https://github.com/openai/codex/discussions/56337 — MIT-licensed memory of user corrections, quoted in-context; works with Codex or Claude Code.
- **#58104 Kilobat: networking for AI agents and humans** — https://github.com/openai/codex/discussions/58104 — macOS menu-bar app tracking Codex/Claude Code/Gemini traffic, with a free CLI + MCP.
- **#51338 Brok: what should an AI assistant actually do in a developer workflow?** — https://github.com/openai/codex/discussions/51338 — Design discussion moving past the chat-interface model.
- **#58031 Using Codex with current Alibaba Cloud documentation and official citations** — https://github.com/openai/codex/discussions/58031 — Practical pattern for verifying cloud-specific facts (endpoints, regions, quotas) before use.

## 6. Feature Request Trends

- **Session lifecycle & storage management**: The single loudest theme. Requests and bugs converge on compaction deduplication, subagent fork isolation, image re-upload suppression, and cleanup of stale marketplace staging clones (#34268, #35458, #23257, #29994, #35732).
- **Cross-surface session visibility**: Show/search/open local CLI sessions in the Desktop app (#24197, now closed), plus in-chat history search (#8582) — users want one searchable session corpus across CLI, Desktop, and VS Code.
- **Agent-callable dynamic reconfiguration**: Refresh MCP connections and rediscover tools mid-chat without restarting (#56970); MCP approval metadata enrichment (#58161) is the upstream counterpart.
- **Predictable quota and cost transparency**: Monthly usage resets (#57967) and actionable model/cost mismatch warnings when parent model switches leave delegates running on old models (#56899).
- **Instruction and capability parity across modes**: AGENTS.md/Personality parity for voice (#37950), and built-in image generation exposed consistently across App/Desktop (#40248, #44039).

## 7. Developer Pain Points

- **Unbounded session storage growth in Codex Desktop**: Multiple independent reports of 100–165 GiB session directories, driven by compaction re-embedding base64 images and subagent forks inheriting full history (#34268, #35458, #23257). One thread is closed; the underlying behavior clearly persists in others.
- **Massive redundant network egress**: Historical images re-uploaded on every turn, with one report of ≥1 GB upstream per generation round and ~40 GB over two days (#35732, #55083).
- **Connection instability and misleading state**: WebSocket broken-pipe loops during media work (#51889), "Context compacted" shown after a failed remote compaction followed by reconnect loops (#38861), and app-server queue-overflow disconnects (#37526, a known-missed fix).
- **Windows sandbox friction**: `helper_sandbox_lock_failed` requiring manual ACL repair (#50520), plus false-positive command rejection for benign PowerShell here-strings (#50724).
- **Remote/mobile queue reliability**: Android Remote messages stuck or lost after host completion (#41708).
- **Latency regressions on image-heavy chats**: 105–140 s first replies in one Desktop chat while a concurrent WebSocket chat replied in 8 s (#54554).
- **First-party integration failures**: Notion MCP broken on CLI 0.166.0 (#58200) and the Finances plugin failing to connect in Codex while working in ChatGPT web (#46017).

</details>

<details>
<summary><strong>Gemini CLI</strong> — <a href="https://github.com/google-gemini/gemini-cli">google-gemini/gemini-cli</a></summary>

# Gemini CLI Community Digest — 2026-10-30

## 1. Today's Highlights

No new releases landed in the last 24 hours, but issue triage activity remained intense: 50 issues and 43 PRs were touched, with the **agent subsystem** dominating attention. Two P1 correctness bugs stand out — subagents falsely reporting `GOAL` success after hitting `MAX_TURNS` (#22323) and the generalist agent hanging indefinitely (#21409) — while the platform team pushed a wave of Windows and symlink robustness fixes in core. Maintainers also kept evaluating AST-aware tooling (#22745, #22746, #22747) as a path to reduce token bloat and misaligned file reads.

## 2. Releases

No new releases in the last 24 hours.

## 3. Hot Issues

1. **[#22323](https://github.com/google-gemini/gemini-cli/issues/22323)** — *P1: Subagent recovery after MAX_TURNS reported as GOAL success.* `codebase_investigator` claims `status: "success"` even when it hit the turn cap before analyzing anything. This silently hides interruptions — a serious trust problem for anyone relying on subagent output in CI. 13 comments, 👍2.
2. **[#19873](https://github.com/google-gemini/gemini-cli/issues/19873)** — *Leverage model's bash affinity via Zero-Dependency OS Sandboxing & Post-Execution Intent Routing.* Proposes letting Gemini 3's native bash-chaining behavior run free inside a sandbox rather than fighting it with tool restrictions. Large-effort enhancement; 9 comments.
3. **[#21409](https://github.com/google-gemini/gemini-cli/issues/21409)** — *P1: Generalist agent hangs.* Simple tasks like folder creation hang forever when delegation kicks in; workaround is to forbid subagents entirely. Highest community engagement on the list (👍8), signaling broad reproduction.
4. **[#22745](https://github.com/google-gemini/gemini-cli/issues/22745)** — *EPIC: Assess AST-aware file reads, search, and mapping.* Tracks whether syntax-aware tools reduce misaligned reads and token noise. Parent EPIC for #22746/#22747 — a strategic direction for the core toolset.
5. **[#21968](https://github.com/google-gemini/gemini-cli/issues/21968)** — *Gemini does not use skills and sub-agents enough.* Anecdotal but widely felt: the model ignores custom skills (e.g. `gradle`, `git`) unless explicitly instructed. Directly undermines the value of the skills system.
6. **[#22267](https://github.com/google-gemini/gemini-cli/issues/22267)** — *Browser Agent ignores `settings.json` overrides.* `maxTurns` and other overrides are read by `AgentRegistry` but never applied — a config-correctness bug with clear repro.
7. **[#21983](https://github.com/google-gemini/gemini-cli/issues/21983)** — *P1: Browser subagent fails on Wayland.* Reports `Termination Reason: GOAL` despite failing — pairs with #22323 as evidence the termination-reason reporting is unreliable.
8. **[#24246](https://github.com/google-gemini/gemini-cli/issues/24246)** — *400 error with >128 tools.* Tool-count scaling problem; the agent should scope tools intelligently rather than blow past API limits.
9. **[#22672](https://github.com/google-gemini/gemini-cli/issues/22672)** — *Agent should stop/discourage destructive behavior.* Model reaches for `git reset`/`--force` when safer alternatives exist. Safety-adjacent, from a maintainer, likely to shape policy defaults.
10. **[#21763](https://github.com/google-gemini/gemini-cli/issues/21763)** — *P1: Bug report lacks subagent context.* `/bug` dumps only the main session, making subagent failures nearly undebuggable — a direct impediment to triaging the very bugs above.

## 4. Key PR Progress

1. **[#30044](https://github.com/google-gemini/gemini-cli/pull/30044)** — *Handle Windows libuv zero-device stat reporting in `readSecureFileBuffer`.* Works around `dev: 0` on Node 22.12–22.16 (libuv 1.49–1.50) that causes every secure read to fail with "device or inode changed."
2. **[#30033](https://github.com/google-gemini/gemini-cli/pull/30033)** — *Tolerate `dev 0` from Windows path stat in secure file reads.* Alternative fix for the same class of bug (closes #29898); worth watching which lands.
3. **[#30042](https://github.com/google-gemini/gemini-cli/pull/30042)** — *Resolve symlinked paths canonically in `GlobTool`.* Fixes workspace-boundary validation and output for symlinked roots/entries — complements the long-standing symlink issues in agent discovery.
4. **[#30043](https://github.com/google-gemini/gemini-cli/pull/30043)** — *Expose tool call IDs to hooks (`BeforeTool`/`AfterTool`).* Enables integrations to pair hook events reliably; closes #29975.
5. **[#30034](https://github.com/google-gemini/gemini-cli/pull/30034)** — *Honor `.git/info/exclude` and `core.excludesFile` in shadow repo.* Prevents `/restore` from reverting files Git would ignore — a real data-loss-adjacent fix.
6. **[#30039](https://github.com/google-gemini/gemini-cli/pull/30039)** — *Serialize concurrent extension installs with a per-extension lock.* Addresses a race in `installOrUpdateExtension()` (#29036) that can corrupt extension state.
7. **[#30010](https://github.com/google-gemini/gemini-cli/pull/30010)** — *Expose `skill_name` in safe tool metadata whitelist.* Lets enterprises with `telemetry.logPrompts=false` still see skill attribution. Tagged `status/need-issue`.
8. **[#30032](https://github.com/google-gemini/gemini-cli/pull/30032)** — *Add missing `ui.active`/`ui.focus` keys to custom theme schema.* Completes the custom-theme schema mismatch from #25689/#25610.
9. **[#30041](https://github.com/google-gemini/gemini-cli/pull/30041)** — *Decouple `ToolGroupMessage` from internal type guards.* Refactor moving dense-payload detection into the `toolMapping` adapter — architectural cleanup for the CLI rendering layer.
10. **[#29965](https://github.com/google-gemini/gemini-cli/pull/29965)** — *Fix Unicode truncation in `ExpandableText`.* Prevents half-surrogate-pair rendering (broken emoji) when collapsed labels are truncated.

*Also notable:* #[30035](https://github.com/google-gemini/gemini-cli/pull/30035) replaces `String.replace` with `safeTemplateReplace()` to stop `$`-pattern corruption in LLM prompt templates.

## 5. Hot Discussions

No Discussions data was provided for this period; this section is omitted.

## 6. Feature Request Trends

- **AST-aware codebase tooling** — #22745, #22746, #22747 form a coordinated EPIC to replace firehose reads with syntax-shape queries (`ast-grep`, `tilth`, `glyph`), targeting fewer turns and lower token cost.
- **Smarter tool/skill selection** — #21968 (skills underused), #24246 (tool overflow past 128/400), #19561 ("Tactful Extraction" hierarchy) all point at the agent needing better awareness of *what* to invoke.
- **Persistent, file-based task tracking** — #18836 proposes deprecating in-context `WriteToDo` for CRUD-backed tasks to fight context rot; #21000 explores native file tools for the tracker.
- **Subagent observability** — #22598 (`/chat share` for subagent trajectories), #21763 (subagent context in `/bug`), #18287 (shared memory / parallel collaboration). The theme: subagents are a black box today.
- **Self-awareness of the CLI itself** — #21432 asks the agent to know its own flags, hotkeys, and invocation patterns accurately.
- **Safety hardening for destructive ops** — #22672 requests guardrails around `git reset --force` and DB-modifying commands.
- **Per-workspace policy scoping** — #18397 wants policies scoped to a workspace rather than global.

## 7. Developer Pain Points

1. **Silent subagent failure** — The most damaging cluster: #22323 (false GOAL success), #21983 (GOAL despite failure), #21409 (infinite hang). Termination reasons and statuses are not trustworthy, which cascades into automation failures and wasted debugging time.
2. **Config that doesn't apply** — #22267 (Browser Agent ignores `settings.json`), #20079 (symlinked agent files not discovered), #30032 (missing schema keys). Users set overrides; the agent silently ignores them.
3. **Subagent debugging is near-impossible** — #21763 shows `/bug` captures only the main session; #22598 notes trajectories are saved but inaccessible. Fixing subagent bugs is gated on making them observable.
4. **Context/token bloat** — #19561 cites ~36.6k tokens/turn baseline and +15k spikes from firehose file reads; AST-aware reads are the proposed escape hatch.
5. **Destructive agent behavior** — #23571 (stray tmp scripts polluting the workspace) and #22672 (force-push-style commands) create cleanup overhead and real risk.
6. **Windows/symlink environmental fragility** — Multiple concurrent PRs (#30044, #30033, #30042, #30006) patch Windows `dev: 0`, symlink canonicalization, and PowerShell process lookup — a sign the platform surface is a steady source of paper cuts.

---
*Digest generated from GitHub activity on `google-gemini/gemini-cli` for 2026-10-30. Issue/PR numbers and metadata are taken verbatim from the provided dataset.*

</details>

<details>
<summary><strong>GitHub Copilot CLI</strong> — <a href="https://github.com/github/copilot-cli">github/copilot-cli</a></summary>

# GitHub Copilot CLI Community Digest — 2026-10-30

## 1. Today's Highlights

No new releases or PRs landed in the last 24 hours, but the issue tracker remains highly active with 38 updated items. The most visible thread is the long-running model-listing authorization failure (#552, now at 31 comments), while fresh triage items point to recurring problems with `--cloud` provisioning, automatic compaction timeouts, and `/copy` output regressions. A cluster of ACP/MCP OAuth and session-handling bugs continues to attract maintainer attention.

## 2. Releases

None in the last 24 hours.

## 3. Hot Issues

1. **[#552](https://github.com/github/copilot-cli/issues/552) — 403 on model listing despite org-enabled CLI** (OPEN, 31 comments, 👍4)
   Longest-running thread in the tracker. Users with org-enabled Copilot CLI still get `403 : unauthorized: not authorized to use this Copilot feature` when listing models. High engagement suggests an entitlement/permission mapping problem rather than a user error.

2. **[#4802](https://github.com/github/copilot-cli/issues/4802) — PRU quota wiped after enabling Assisted Permissions** (OPEN, 8 comments)
   Reports of Premium Request Unit balances being consumed unexpectedly after turning on Assisted Permissions. Financially impactful for Pro/legacy request-based subscribers; worth watching for a root cause.

3. **[#4275](https://github.com/github/copilot-cli/issues/4275) — ACP should expose `contextTier` as session config** (OPEN, 7 comments, 👍4)
   Requests parity between the interactive `/model` context-tier picker and ACP clients. A clear signal that ACP integrators want feature parity with the TUI.

4. **[#4851](https://github.com/github/copilot-cli/issues/4851) — Azure MCP registry BrokenPipe (CLOSED, 6 comments, 👍10)** 
   A regression that broke a previously working Azure API Center MCP registry overnight. Now closed — one of the few definitively resolved items in the batch.

5. **[#4994](https://github.com/github/copilot-cli/issues/4994) — MCP OAuth page reopens every ACP session (1.0.88→1.0.89 regression)** (OPEN, 5 comments, 👍8)
   Valid, unexpired tokens are ignored and users are forced through browser SSO on every session. High 👍 count reflects broad ACP user impact.

6. **[#2109](https://github.com/github/copilot-cli/issues/2109) — Add `ask_user`/`ask_question` ACP extension** (OPEN, 4 comments, 👍8)
   Feature request to let ACP clients surface clarifying questions with structured answers. Well-supported by the community and a natural complement to `session/request_permission`.

7. **[#4600](https://github.com/github/copilot-cli/issues/4600) — MCP image results silently dropped with BYOK** (OPEN, 3 comments)
   Silent data loss: MCP tool images never reach the model under BYOK providers, with no error surfaced. Silent failures like this are especially costly to debug.

8. **[#4710](https://github.com/github/copilot-cli/issues/4710) — Runaway `copilot-file-search` thread (CLOSED, 3 comments)**
   Idle `--yolo` sessions pinned a CPU core and wrote unbounded logs. Closed, but a notable resource-leak class worth monitoring.

9. **[#4613](https://github.com/github/copilot-cli/issues/4613) — MCP schemas eagerly injected, +354K startup tokens (CLOSED, 3 comments)**
   High-severity 1.0.80+ regression where full MCP catalogs were injected into the first request. Now closed; a reminder of how tool-schema handling can blow up token budgets.

10. **[#5254](https://github.com/github/copilot-cli/issues/5254) — Main process grows to 37 GiB in parallel-agent sessions** (OPEN, 2 comments)
    1.0.103 long-running sessions exceeded physical RAM on a 32 GiB machine. Memory growth under parallel agents is one of the most serious stability reports in this batch.

## 4. Key PR Progress

No pull requests were updated in the last 24 hours. Maintainer activity this cycle appears focused on issue triage and closures (e.g., #4851, #4710, #4613) rather than merged PRs.

## 5. Hot Discussions

No discussion data was provided for this period.

## 6. Feature Request Trends

- **ACP parity with interactive mode**: Exposing `contextTier` (#4275) and adding an `ask_user`/`ask_question` extension (#2109) both push ACP toward feature parity with the TUI.
- **Granular permission control**: Requests for default-deny tool permissions with explicit allowlists in non-interactive mode (#5275) reflect a need for safer CI/automation usage.
- **Configurable UX/keybinds**: Requests to swap `shift+enter`/`enter` behavior (#5291) and restore Markdown output from `/copy` (#5288) show demand for finer-grained user configuration.
- **Model configuration surface**: The missing `--fusion-tier` argument (#5290) highlights gaps between documented model settings and actual CLI flags.

## 7. Developer Pain Points

- **Authentication and entitlement friction**: Repeated 403s on model listing (#552), Entra scope rejection (#5061), macOS keychain prompts (#4273), and empty Entra broker token caches on Windows (#5236) form a persistent auth cluster.
- **MCP OAuth reliability**: ACP sessions re-triggering browser auth despite valid/refreshable tokens (#4994, #5229) and Datadog token-exchange failures (#5058) suggest the OAuth lifecycle needs hardening.
- **Resource leaks and memory growth**: Runaway file-search threads (#4710), 37 GiB process growth (#5254), and eager MCP schema injection (#4613) indicate systemic resource-management concerns.
- **Context/compaction instability**: Rollover failures (#5205), 50% compaction triggers with GPT-5.6 Luna Max (#4571), and 300s summarizer timeouts (#5292) point to fragile long-session handling.
- **Silent failures**: Dropped MCP images under BYOK (#4600) and inactive plugin agents in interactive mode (#4592) are hard to diagnose because errors are not surfaced.
- **Platform-specific regressions**: Windows clipboard breakage (#3981), missing PowerShell environment inheritance (#5281), and Docker/multi-HOME plugin cache paths (#3864) show cross-platform polish still lags.

---
*Generated from github.com/github/copilot-cli activity on 2026-10-30. No releases or PRs in this window; issue links above reflect the tracker snapshot.*

</details>

<details>
<summary><strong>OpenCode</strong> — <a href="https://github.com/anomalyco/opencode">anomalyco/opencode</a></summary>

# OpenCode Community Digest — 2026-10-30

## 1. Today's Highlights

OpenCode shipped **v2.2.2** and **v2.2.1**, bringing image generation by default for capable providers and a new `/goal` loop that keeps sessions running until an objective is verified. Meanwhile, the free-tier issue thread (#59387) continues to dominate community attention with 110 comments, and a new report (#60250) flags that Plan mode enforcement is broken in v2.2.1.

## 2. Releases

- **v2.2.2** — Image generation now works by default when a connected provider supports image models; agents can use `experimental_image_generate` without extra configuration, with model selection via `experimental.image_generate.model`. ([#60258](https://github.com/anomalyco/opencode/pull/60258))
- **v2.2.1** — Adds `/goal <objective>` in TUI/Desktop to keep a session running until a reviewer confirms completion, with `/goal pause`, `/goal resume`, and `/goal clear` controls. ([#59437](https://github.com/anomalyco/opencode/pull/59437))
- **process-daemon-v0.4.0** — `opencode-pty` 0.4.0 (protocol 7), published to npm as `@opencode/pty@0.4.0`.
- **process-daemon-v0.3.3** — `opencode-pty` 0.3.3 (protocol 7), published to npm as `@opencode/pty@0.3.3`.

## 3. Hot Issues

1. **[#59387](https://github.com/anomalyco/opencode/issues/59387) — Free tier issues megathread (110 comments)** — The central hub for free-tier failures (`Free usage exceeded`, non-resetting limits, Desktop version blocks). High engagement signals ongoing friction with Zen's free offering.
2. **[#33356](https://github.com/anomalyco/opencode/issues/33356) — Unbounded `event` table growth (47 comments, 12 👍)** — `opencode.db` reaching 13GB+ on long-lived instances due to unpruned `message.updated.1` snapshots. A serious operational risk now closed but widely watched.
3. **[#32149](https://github.com/anomalyco/opencode/issues/32149) — Requests stall with no response (23 comments, 13 👍)** — Agent enters "thinking" then silently stops; high 👍 count reflects broad reproducibility.
4. **[#26602](https://github.com/anomalyco/opencode/issues/26602) — Desktop 5-minute Headers Timeout with local providers (23 comments)** — `"timeout": false` is ignored, breaking slow local OpenAI-compatible backends.
5. **[#60250](https://github.com/anomalyco/opencode/issues/60250) — Plan mode broken in v2.2.1 (6 comments)** — Agent implements instead of planning despite reminders; a fresh regression in the newest release.
6. **[#45417](https://github.com/anomalyco/opencode/issues/45417) — Session cost excludes subagent cost (10 comments, 17 👍)** — Reported cost far below billed amount for fan-out workflows; highest 👍 in this set.
7. **[#36682](https://github.com/anomalyco/opencode/issues/36682) — Compaction summary prompt injection (9 comments)** — Auto-compaction "Next Move" sections are executed without consent — a security concern.
8. **[#52083](https://github.com/anomalyco/opencode/issues/52083) — Permission bypass via compound shell commands (5 comments, severity:high)** — Allowed commands chained with redirection become unprompted file writes.
9. **[#31554](https://github.com/anomalyco/opencode/issues/31554) — MCP duplicate process spawn (8 comments)** — 2–4 processes per MCP server cause TasksMax exhaustion and `EAGAIN` errors on Linux.
10. **[#38723](https://github.com/anomalyco/opencode/issues/38723) — `opencode run` hangs during init (~56% failure)** — Intermittent silent hang with zero output; a major CI/scripting blocker.

## 4. Key PR Progress

1. **[#60406](https://github.com/anomalyco/opencode/pull/60406) — fix(client): store session forms created without a location** — Fixes `form.created` publishing without `Location.Service`; replaces #60404 with compliant branch naming.
2. **[#59803](https://github.com/anomalyco/opencode/pull/59803) — fix(core): price Copilot long-context tiers and cache writes** — Corrects severe undercounting of GitHub Copilot costs on long sessions.
3. **[#60407](https://github.com/anomalyco/opencode/pull/60407) — refactor(ai): one tool() for both clients** — Unifies Promise and Effect clients' tool construction; stacked on #60390.
4. **[#60388](https://github.com/anomalyco/opencode/pull/60388) — fix(desktop): keep the browser pane chunk parseable** — Fixes an unparseable desktop build artifact in 2.2.2.
5. **[#58066](https://github.com/anomalyco/opencode/pull/58066) — fix(server): allow credential.update to rotate stored value** — Previously `PATCH /api/credential/:id` silently ignored key rotation.
6. **[#60039](https://github.com/anomalyco/opencode/pull/60039) — feat(mcp): per-server TLS trust for remote MCP servers** — Adds a `tls` config block for self-signed/private-CA MCP endpoints.
7. **[#60041](https://github.com/anomalyco/opencode/pull/60041) — feat(mcp): trust private-network server certs on first use** — First-use trust flow stacked on #60039.
8. **[#60401](https://github.com/anomalyco/opencode/pull/60401) — feat(core): load Console workspace instructions and skills** — Console "Library" Markdown instructions/skills now flow into OpenCode via the polled config document.
9. **[#60392](https://github.com/anomalyco/opencode/pull/60392) — feat(core): free-only OpenCode model filter** — Adds `OPENCODE_ONLY_FREE_MODELS=1` as the inverse of the existing disable flag.
10. **[#60390](https://github.com/anomalyco/opencode/pull/60390) — fix(ai): accept typed tools in loop** — Resolves compile-time rejection of typed tools in `LLM.loop` and `ai.llm.loop`.

## 5. Hot Discussions

No discussion data was provided for this digest period.

## 6. Feature Request Trends

- **Agent observability & control** — Repeated requests for subagent output views (#37267), an agent activity sidebar (#27995), and the ability to steer/cancel individual running subagents (#38966).
- **Session & project lifecycle management** — Requests to remove projects/sessions (#37280) and a `session.stopping` plugin hook to re-enter the agent loop (#16626).
- **Desktop UX polish** — Clickable file paths in chat (#37891), custom Linux titlebar (#36225), and a persistent auto-accept permissions indicator (#38289).
- **CI/container ergonomics** — `OPENCODE_DISABLE_INSTALL` env var to skip npm installs at startup (#37888) and a missing `--variant` flag for new sessions (#37925).
- **Account & identity management** — Email change/removal in OpenCode Zen (#18654, 20 👍).
- **Internationalization** — RTL support for Persian/Arabic (#16875) and French placeholder translations (PR #60403).

## 7. Developer Pain Points

- **Free tier reliability** — The megathread (#59387) shows quota messages and resets failing to behave as documented.
- **Silent failures and hangs** — `opencode run` stalls (#38723) and unresponsive request processing (#32149) erode trust in automation.
- **Cost tracking inaccuracy** — Subagent costs excluded (#45417), Chinese providers showing $0.00 (#34877), and Copilot undercounting (#59803) collectively undermine spend visibility.
- **Security and permission semantics** — Prompt injection via compaction summaries (#36682) and permission bypass through compound shell commands (#52083) are the highest-severity concerns.
- **Resource leaks and timeouts** — Unbounded DB growth (#33356), duplicate MCP processes (#31554), and the ignored Desktop timeout setting (#26602) are recurring operational complaints.
- **Plugin ecosystem fragility** — TUI plugin loading regressions (#33884) and missing plugin lifecycle hooks (#16626) frustrate extension authors.

</details>

<details>
<summary><strong>Pi</strong> — <a href="https://github.com/earendil-works/pi">earendil-works/pi</a></summary>

# Pi Community Digest — 2026-10-30

## 1. Today's Highlights

A large batch of `no-action`/`CLOSED` triage dominated activity, with core maintainers landing fixes for Windows path casing, session file permissions, and TUI wrapping bugs. A notable uptick in reliability-focused reports: V8 OOM crashes in multi-day sessions, Bedrock client churn, and prompt-cache-busting tool ordering. A community Rust port (`pi-rs`) of the headless core was announced with atom-level behavioral parity claims.

## 2. Releases

No new releases in the last 24 hours.

## 3. Hot Issues

1. **[#9656](https://github.com/earendil-works/pi/issues/9656) — Mouse wheel scrolls prompt history instead of transcript (Windows + Zellij)** — 12 comments, 5 👍. Highest-traffic open issue; specific to Windows → Alacritty → Zellij chains, works fine without a multiplexer. Indicates terminal-multiplexer escape handling needs attention.
2. **[#9508](https://github.com/earendil-works/pi/issues/9508) — pi-ai sends unsupported OpenAI-specific fields to compatible providers** — 9 comments. Breaks otherwise-working OpenAI-compatible backends with 400/422s. High compatibility impact across the ecosystem.
3. **[#10024](https://github.com/earendil-works/pi/issues/10024) — Mid-run tool-set change moves system prompt head and re-bills conversation** — 5 comments, 2 👍. Direct cost regression for users; tied to prompt caching strategy.
4. **[#10187](https://github.com/earendil-works/pi/issues/10187) — Move `deviceId` out of global settings** — 5 comments, 3 👍. Dotfile-sharing users hit conflicts when device IDs live alongside shared preferences.
5. **[#11157](https://github.com/earendil-works/pi/issues/11157) — Extensions calling `sendMessage` at `session_start` force legacy transcript mode** — 3 comments, `prio:p0`. Extensions like `pi-memory` and `pi-session-search` inadvertently disable Anthropic `system` field optimization for all sessions.
6. **[#11570](https://github.com/earendil-works/pi/issues/11570) — V8 OOM (SIGABRT) in long sessions** — 3 comments. Five production crash reports over two days on macOS; giant ConsString flattening in long-lived sessions. Serious stability concern for heavy users.
7. **[#11527](https://github.com/earendil-works/pi/issues/11527) — New `BedrockRuntimeClient` created per request** — 3 comments. SSO users pay a `GetRoleCredentials` round trip plus fresh HTTP/2 session on every call. Clear performance regression.
8. **[#11529](https://github.com/earendil-works/pi/issues/11529) — Tool order depends on registration order, busts prompt cache** — 3 comments. MCP reconnects and dynamic tool loading reorder tools, invalidating cached prefixes. Compounds with #10024.
9. **[#11172](https://github.com/earendil-works/pi/issues/11172) — Split mouse report tail leaks into prompt** — 3 comments. Escape-timeout races flush partial sequences into the editor; reproducible with shipped `StdinBuffer`.
10. **[#11567](https://github.com/earendil-works/pi/issues/11567) — `getSessionName()` scans every entry on each render** — 2 comments. Keystroke latency rises from 1.5 ms to 21 ms at ~400k entries; footer hot path.

Also worth noting: **[#11558](https://github.com/earendil-works/pi/issues/11558)** (namespace-scoped `tool_search`, e.g. `+docs read_page`) and **[#11552](https://github.com/earendil-works/pi/issues/11552)** (recoverable handling of unsupported tool-result image formats) both remain open with maintainer-visible proposals.

## 4. Key PR Progress

1. **[#11587](https://github.com/earendil-works/pi/pull/11587)** — Create session dirs as `0700` and files as `0600`. Closes #10770; privacy hardening against shared-host reads.
2. **[#11588](https://github.com/earendil-works/pi/pull/11588)** — Case-insensitive path comparison on Windows. Fixes false skill collisions (#10488) between `c:\Users` and `C:\Users`.
3. **[#11589](https://github.com/earendil-works/pi/pull/11589)** — Honor saved project trust for projects without trust-requiring resources. Closes #10947; the auto-trust check was running before reading the trust store.
4. **[#11590](https://github.com/earendil-works/pi/pull/11590)** — Refresh unpinned temporary npm extensions when a newer version exists. Fixes #11375 (`pi -e npm:` stuck on first download).
5. **[#11586](https://github.com/earendil-works/pi/pull/11586)** / **[#11585](https://github.com/earendil-works/pi/pull/11585)** — Treat Apple Terminal `ESC`+`Return` with native Shift held as Shift+Enter. Fixes #11559; prompt no longer queues as a follow-up.
6. **[#11591](https://github.com/earendil-works/pi/pull/11591)** — Drop space after styled word at wrap boundary; reset strikethrough at line end. Fixes #10925.
7. **[#11577](https://github.com/earendil-works/pi/pull/11577)** — Pick the smaller of PNG/JPEG when resizing images. Fixes #11550; PNG-first ordering was producing ~10× larger payloads.
8. **[#11572](https://github.com/earendil-works/pi/pull/11572)** — Do not retry Zhipu usage limit errors (code 1308). The cap resets after hours; retrying was wasting agent-level budget.
9. **[#11562](https://github.com/earendil-works/pi/pull/11562)** (open) — Start new sessions in the cwd's default directory. Changes `/new`, `/fork`, `/clone` save behavior when cwd differs from the source session.
10. **[#11580](https://github.com/earendil-works/pi/pull/11580)** — Add Arabic RTL rendering to the TUI (bidirectional text, Windows Terminal). Implements UAX #9 shaping for terminals lacking Bidi support.

Additional landed fixes: **[#11565](https://github.com/earendil-works/pi/pull/11565)** (stop writing OSC 133 markers in regular mode), **[#11566](https://github.com/earendil-works/pi/pull/11566)** (relabel skill diagnostics as `[Skill warnings]`), **[#11578](https://github.com/earendil-works/pi/pull/11578)** (accept unfixable zod advisory in npm audit), **[#6881](https://github.com/earendil-works/pi/pull/6881)** (use provider-reported cost when present), **[#11594](https://github.com/earendil-works/pi/pull/11594)** (Alibaba reasoning-model developer-role 400 fix).

## 5. Hot Discussions

**Show and tell**
- **[#11503](https://github.com/earendil-works/pi/discussions/11503) — `pi-rs`: a Rust port of the headless core** — Community-authored Rust reimplementation of pi 0.74.2's agent loop, seven built-in tools, session JSONL, and CLI surface, with claimed atom-level behavioral parity and a DeepSeek API compatibility finding. MIT-licensed; author credits Pi for all design.

**Q&A**
- **[#11574](https://github.com/earendil-works/pi/discussions/11574) — How to upload an npm package to a Pi package source?** — User has authored a Pi package and is asking for the publishing path. No replies yet; indicates a documentation/packaging gap for third-party contributors.

## 6. Feature Request Trends

- **Prompt-cache stability**: #10024 (system-prompt head moves mid-run) and #11529 (tool order = registration order) both point to demand for a stable, canonicalized request prefix so caching actually saves cost.
- **Namespace-scoped tool discovery**: #11558 asks for `+server tool` syntax in `tool_search` when multiple MCP servers expose overlapping names.
- **Image/tool-result robustness**: #11552 proposes validating unsupported MIME types before provider submission and falling back to visible text rather than invalid image blocks.
- **Configuration portability**: #10187 (`deviceId` out of global settings) reflects a broader desire for dotfile-shareable settings separate from device state.
- **Timeouts as settings**: #11549 requests `oauthRefreshTimeoutMs` and `githubCopilotModelsTimeoutMs` exposed in agent settings.
- **Origin tagging for model calls**: #11596 wants `HarnessOptions.models` to receive the origin of each call for host-side authorization/audit/egress.

## 7. Developer Pain Points

- **Cross-platform terminal edge cases remain a top source of noise**: Windows + Zellij wheel scrolling (#9656), Apple Terminal Shift+Enter (#11559, fixed), split mouse reports leaking into the editor (#11172), drive-letter casing (#10488), and RTL rendering (#11580) all surfaced within weeks.
- **Long-session stability and performance degrade noticeably**: V8 OOM/SIGABRT after ~2 days (#11570) and O(n) `getSessionName()` scans at ~400k entries (#11567) suggest the session model was not designed for very long-lived processes.
- **Unnecessary per-request overhead in provider clients**: Bedrock constructs a new `BedrockRuntimeClient` per call (#11527), triggering SSO round trips.
- **Cost-accounting mismatches** keep reappearing: disjoint `reasoning_tokens` in OpenAI-compatible streaming (#10367), provider-reported cost not being preferred over catalog rates (#6881), and prompt-cache invalidation re-billing users (#10024).
- **Trust and privacy defaults**: default `0755`/`0644` on session dirs (#10770), saved "do not trust" being ignored for resource-less projects (#10947), and `deviceId` leaking into shared dotfiles (#10187).
- **Extension lifecycle hazards**: extensions calling `sendMessage` at `session_start` silently downgrade every session to legacy transcript mode (#11157) — a p0-labeled footgun for the extension ecosystem.

</details>

<details>
<summary><strong>Qwen Code</strong> — <a href="https://github.com/QwenLM/qwen-code">QwenLM/qwen-code</a></summary>

# Qwen Code Community Digest — 2026-10-30

## 1. Today's Highlights

Qwen Code shipped **v0.26.4** with a host-theme-following fix for generated UI views, alongside a fresh TypeScript SDK release (v0.1.26) that bundles CLI 0.26.4. CI/CD infrastructure remains the dominant theme across issues and PRs, with a new P1 smoke-test timeout (#15861), a steady stream of Managed Agent CI failure reports, and several PRs aimed at routing release/E2E jobs onto self-hosted ECS runners. Community PR activity is also strong, with recurring contributions to web-shell UX, config correctness, and CLI tooling.

## 2. Releases

- **v0.26.4** ([release](https://github.com/QwenLM/qwen-code/releases)) — Follows the host theme in generated UI views ([#15798](https://github.com/QwenLM/qwen-code/pull/15798)). No known breaking changes.
- **v0.26.4-nightly.20261029.70be140e14** — Adds bounded SQL history queries in the managed layer ([#15839](https://github.com/QwenLM/qwen-code/pull/15839)) and continued generated-UI chat support.
- **sdk-typescript-v0.1.26** — Bundles CLI 0.26.4 (source-built from the same ref).
- **desktop-v0.26.4** — Fixes silently dropped config controls ([#15794](https://github.com/QwenLM/qwen-code/pull/15794)) and adds docs for shared-session behavior.

## 3. Hot Issues

1. **[#14724](https://github.com/QwenLM/qwen-code/issues/14724)** — Managed Agent gate CI failure with **95 comments**; the highest-traffic issue in the queue, unresolved since 2026-10-19. Signals fragility in the Managed Agent test classification gate.
2. **[#13078](https://github.com/QwenLM/qwen-code/issues/13078)** — Daily dependency CVE audit failing repeatedly (35 comments). Persistent security-automation noise that needs triage.
3. **[#15052](https://github.com/QwenLM/qwen-code/issues/15052)** — Main E2E concurrency can replace pending runs, losing per-SHA validation. A real correctness gap in CI design, not just flakiness.
4. **[#15855](https://github.com/QwenLM/qwen-code/issues/15855)** — **P1**: `contextWindowSize` is silently stripped from user config. High impact for self-hosted users on constrained hardware.
5. **[#15861](https://github.com/QwenLM/qwen-code/issues/15861)** — **P1**: web-shell host-directory-picker smoke test times out deterministically, penalizing every PR. Merged regardless of PR content, so it's pure CI tax.
6. **[#14215](https://github.com/QwenLM/qwen-code/issues/14215)** — Feature request for **context immutability** for self-hosted models with slow prompt processing. Resonates with local-inference users; marked `need-discussion`.
7. **[#13649](https://github.com/QwenLM/qwen-code/issues/13649)** — A2A messages lacking `contextId` create unbounded, indistinguishable chat sessions. Important for the multi-agent roadmap.
8. **[#15461](https://github.com/QwenLM/qwen-code/issues/15461)** / **[#15465](https://github.com/QwenLM/qwen-code/issues/15465)** — Release infrastructure can't get off GitHub-hosted runners; post-publish fan-out waits 37–50 min. Blocks fast release feedback.
9. **[#15875](https://github.com/QwenLM/qwen-code/issues/15875)** — SDK stream-json message IDs change after thinking without a new `message_start`. A protocol-correctness bug affecting SDK consumers.
10. **[#15783](https://github.com/QwenLM/qwen-code/issues/15783)** — Proposal to move routine macOS CI to overnight runs. Reflects growing runner-cost/throughput pressure.

## 4. Key PR Progress

1. **[#15634](https://github.com/QwenLM/qwen-code/pull/15634)** — New `inject` dispatch mode delivers messages into the running turn instead of buffering. Significant for channel-based workflows.
2. **[#15871](https://github.com/QwenLM/qwen-code/pull/15871)** — Splits Managed Agent server into six production Maven modules. Large architectural refactor toward modularity.
3. **[#15870](https://github.com/QwenLM/qwen-code/pull/15870)** — Removes persisted public message snapshots in the managed layer. Simplifies state handling.
4. **[#11854](https://github.com/QwenLM/qwen-code/pull/11854)** — Adds a Codex-aligned **hybrid code mode** (`tools.mode` enum) with an isolated `exec` JavaScript tool. Notable capability expansion.
5. **[#15880](https://github.com/QwenLM/qwen-code/pull/15880)** — Auto-verifies PRs whose review came back clean. Automates maintainer verification handoff.
6. **[#11486](https://github.com/QwenLM/qwen-code/pull/11486)** — `qwen update --target-version <version>` for exact-version standalone updates, skipping npm discovery.
7. **[#14332](https://github.com/QwenLM/qwen-code/pull/14332)** — Makes tool-output truncation depend on the **remaining context window** rather than a fixed char count. Directly addresses context pressure.
8. **[#15829](https://github.com/QwenLM/qwen-code/pull/15829)** — Fixes VS Code companion rewriting `settings.model` and dropping sibling keys.
9. **[#13628](https://github.com/QwenLM/qwen-code/pull/13628)** — Gates system-settings env overrides behind administrator-controlled paths. Security-hardening fix.
10. **[#14373](https://github.com/QwenLM/qwen-code/pull/14373)** — Surfaces session rename inline with an F2 shortcut. Quality-of-life improvement for the Web Shell sidebar.

## 5. Hot Discussions

_No discussion data was provided in the source dataset; this section is omitted._

## 6. Feature Request Trends

- **CI/CD and release infrastructure reliability** — The single largest cluster: E2E concurrency ([#15052](https://github.com/QwenLM/qwen-code/issues/15052)), ECS runner activation ([#15461](https://github.com/QwenLM/qwen-code/issues/15461)), post-publish fan-out latency ([#15465](https://github.com/QwenLM/qwen-code/issues/15465)), and macOS CI scheduling ([#15783](https://github.com/QwenLM/qwen-code/issues/15783)).
- **Context & performance management** — Context immutability for self-hosted models ([#14215](https://github.com/QwenLM/qwen-code/issues/14215)), context-aware truncation ([#14332](https://github.com/QwenLM/qwen-code/pull/14332)), and preserving `contextWindowSize` config ([#15855](https://github.com/QwenLM/qwen-code/issues/15855)).
- **Multi-model / multi-agent support** — Dynamic OpenAI-compatible model switching ([#1206](https://github.com/QwenLM/qwen-code/issues/1206)), A2A session hygiene ([#13649](https://github.com/QwenLM/qwen-code/issues/13649)), and hybrid code mode ([#11854](https://github.com/QwenLM/qwen-code/pull/11854)).
- **Web Shell UX polish** — Rename shortcuts ([#14373](https://github.com/QwenLM/qwen-code/pull/14373)), i18n for non-Chinese locales ([#13391](https://github.com/QwenLM/qwen-code/issues/13391)), scrollbar fixes ([#14620](https://github.com/QwenLM/qwen-code/issues/14620)), and sidebar consistency ([#15867](https://github.com/QwenLM/qwen-code/issues/15867)).
- **Remote/self-hosted workflows** — Remote daemon connection clarity ([#15877](https://github.com/QwenLM/qwen-code/issues/15877)) and exact-version updates ([#11486](https://github.com/QwenLM/qwen-code/pull/11486)).

## 7. Developer Pain Points

- **CI flakiness and attribution cost** — Multiple issues note tests that "fail on unrelated PRs," forcing re-attribution rounds ([#15861](https://github.com/QwenLM/qwen-code/issues/15861), [#14724](https://github.com/QwenLM/qwen-code/issues/14724), [#12714](https://github.com/QwenLM/qwen-code/issues/12714)). This is the top recurring frustration.
- **Config silently mutated** — Users report settings (`contextWindowSize`, `settings.model` siblings) being dropped without warning ([#15855](https://github.com/QwenLM/qwen-code/issues/15855), [#15829](https://github.com/QwenLM/qwen-code/pull/15829)).
- **Slow / opaque release tooling** — The post-publish fan-out waiting ~40 minutes undermines release velocity ([#15465](https://github.com/QwenLM/qwen-code/issues/15465)).
- **Self-paced `/loop` stop not honored** — [#15894](https://github.com/QwenLM/qwen-code/issues/15894): a user-message stop doesn't cancel a pending `loop_wakeup`, so loops resume themselves. Autonomy-control concern.
- **Model repetition without circuit-breaking** — [#7959](https://github.com/QwenLM/qwen-code/issues/7959) (Qwen 3.5 0.8b looping) suggests a desired "repetition detector."
- **PR review latency** — [#15869](https://github.com/QwenLM/qwen-code/issues/15869) flags PRs with no maintainer activity for 3+ days, indicating review-capacity strain as community contributions grow.

---
*Sources: [QwenLM/qwen-code](https://github.com/QwenLM/qwen-code) issues, PRs, and releases updated in the last 24h.*

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*