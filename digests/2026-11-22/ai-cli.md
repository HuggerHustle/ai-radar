# AI CLI Tools Community Digest 2026-11-22

> Generated: 2026-11-22 01:08 UTC | Tools covered: 7

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
**Date: 2026-11-22**

---

## 1. Ecosystem Overview

The AI CLI tooling landscape on 2026-11-22 shows a maturing but still unstable ecosystem, with **zero releases across half the tracked products** and reliability — not feature velocity — dominating community discourse. Cross-platform friction (Windows and Wayland specifically), session/context management, and multi-agent orchestration correctness are the three recurring battlefronts. Meanwhile, **cross-device session sync has crystallized as the industry's single most-requested unmet feature**, appearing as the top signal in both Codex and Claude Code communities. Safety incidents (destructive command execution, secret leakage) are shifting from edge cases to first-class trust concerns. The competitive axis is narrowing: differentiation now hinges less on model capability and more on **session durability, cross-surface continuity, and safe execution semantics**.

---

## 2. Activity Comparison

| Tool | Issues Updated | PRs Updated | Discussions | Release Status |
|---|---|---|---|---|
| **Claude Code** | 10 hot (heavy volume) | 3 (thin queue) | N/A (not provided) | No release |
| **OpenAI Codex** | 50 | 27 | ~10 active threads (72 👍 top) | No release |
| **Gemini CLI** | 10 hot | 10+ | N/A (not provided) | **v0.71.0-nightly** |
| **GitHub Copilot CLI** | 10 hot + several closed | 3 | N/A (not provided) | **3 releases** (v1.0.115-4/5/6) |
| **OpenCode** | 50 | 50 | N/A (not provided) | No release |
| **Pi** | 10 hot | 3 (2 substantive) | N/A (not provided) | No release |
| **Qwen Code** | 10 hot (CI-dominated) | 10+ | N/A (not provided) | **v0.28.3** + nightly |

**Notes:**
- Claude Code's PR queue is effectively dormant (3 items, one from bcherny's original 2025 setup); issue volume remains the community's only real signal channel.
- Codex and OpenCode show the highest raw activity (50/50 across both issues and PRs), but Codex's PRs are almost entirely `copyberry[bot]` — quality-over-quantity must be weighed.
- Copilot CLI is the only tool with **multiple same-day patch releases**, signaling a hot-fix posture rather than a stalled one despite a thin PR queue.
- Only 3/7 repos shipped anything in the window; **4/7 have no Discussions channel in the data** — this reflects upstream configuration (e.g., Claude Code and Copilot CLI route discussion through Issues), not inactivity.

---

## 3. Shared Feature Directions

Five cross-cutting requirements appear across **three or more** tool communities:

### 3.1 Cross-device / cross-session continuity *(dominant)*
- **Codex**: #14067 (72 👍, highest-conviction ask in dataset), #12590, #25580, #29719
- **Claude Code**: #91815 (start sessions from mobile), #111057 (Remote Control persistence), #107891, #98500
- **Copilot CLI**: #5468 (remote control across GitHub Mobile/web)
- **Qwen Code**: mobile Web Shell parity PR cluster (#17883, #17918, #18011)
- **Opencode**: workspace artifacts, session organization
- **Need**: threads/sessions must follow the user across TUI, desktop, mobile, and editor surfaces with preserved reasoning state.

### 3.2 Context & memory management
- **Pi**: #12165 (searchTools = 25% of context), #12242 (compaction summary 17k→164k), #12381, feature #12377 (`/context` inspector)
- **Codex**: #12567 (Memories), #40290 (handoff intent drift), #23347 (auto-handoff near quota)
- **Qwen Code**: #12597 (disable auto-compaction), #18042/18043 (microcompaction token loss), #18030 (worktree memory sharing)
- **OpenCode**: #65400 (migration drops prompt caching)
- **Need**: visibility, control, and correctness in how context is compressed, persisted, and shared across sessions/worktrees.

### 3.3 Subagent reliability & orchestration depth
- **Gemini CLI**: #22323 (MAX_TURNS false success), #21409 (hangs), #22267 (config ignored), #30170 PR
- **Copilot CLI**: #5543 (nested subagents can't be multi-turn)
- **Qwen Code**: #15748 (background notifications OOM top-level agent)
- **Need**: nested subagents must honor configured limits, report honest termination states, and support multi-turn background execution.

### 3.4 Multi-session resource management
- **Claude Code**: #107433 (24 sessions ≈ 9.3 GB, 125 GB box thrashing), #96382 (tabbed sidebar regression)
- **Codex**: #53071 (independent chats in VS Code tabs)
- **OpenCode**: V2 SQLite OOM (#65371, #64896), 35 GB DB wedging `stats` (#65241)
- **Need**: shared infrastructure (MCP servers, memory budgets) across many concurrent sessions without resource explosions.

### 3.5 Persistent, user-level permissions
- **Copilot CLI**: #2256, #1696, #5539 ("too complex to configure confidently") — loudest cluster; two closed today
- **Qwen Code**: #18059 (UNC/WSL rules that never match)
- **Claude Code**: implicit in multi-session friction
- **Need**: stop re-prompting for trusted operations; make policy models comprehensible.

### 3.6 Event-driven automation
- **Codex**: #24864 (👍13, triggers beyond timers)
- **Gemini CLI**: implicit in AST-tooling direction
- **Need**: webhooks, file-change, CI-event triggers — move beyond scheduled/heartbeat runs.

---

## 4. Differentiation Analysis

| Dimension | Claude Code | Codex | Gemini CLI | Copilot CLI | OpenCode | Pi | Qwen Code |
|---|---|---|---|---|---|---|---|
| **Primary focus** | IDE + mobile remote control | Cross-device sync, TUI polish | Subagent correctness, AST tooling | Enterprise/proxy, permission UX | V2 storage, provider breadth | Context economics | Web shell, CI reliability |
| **Target user** | Professional IDE developers | Multi-machine knowledge workers | Large-codebase agentic users | Enterprise/regulated orgs | Provider-agnostic power users | Deep-context long-session coders | Mobile + web developers |
| **Technical approach** | MCP-heavy, desktop+mobile integration | Cloud threads + TUI hardening bots | AST-aware tooling (`ast-grep`/`tilth`/`glyph`) | Protocol conformance (MCP Tasks/ACP) | Multi-provider runtime, SQLite V2 | Minimal, measurement-driven context tuning | Daemon-based web shell + SDKs |
| **Release cadence** | Slow (no release today) | Steady (no release today) | Nightly discipline | **Rapid patches (3/day)** | Batch/feature-driven | Slow, surgical | Versioned + nightly |
| **Distinctive strength** | Mobile-first remote control vision | Deepest discussion signal (72 👍 sync ask) | Executable roadmap (AST epic) | Enterprise hardening, protocol conformance | Broadest provider surface | Empirical context data | Full-stack (CLI + SDK + web shell) |
| **Distinctive weakness** | Windows bugs (4 same-day), 6-month Issue #71542 | Windows Computer Use, bot-only PRs | Browser agent fragility | Destructive-command safety (#5541) | V2 storage reliability | Headless automation hangs | CI flake churn |

**Key differentiators:**
- **Copilot CLI** is the only tool optimizing for **enterprise infrastructure** (proxies, Schannel TLS, org-required plugins) — its pain points are network and policy, not model behavior.
- **Gemini CLI** is the only tool with a **public AST-tooling roadmap** (#22745–22747), signaling a bet that token efficiency beats raw context size.
- **Pi** is uniquely **data-driven** — its issues carry hard numbers (#12165: "36 KB/call, 25% of context"), suggesting a measurement-first community.
- **OpenCode** and **Codex** are the only two with **full Discussions channels active at scale**; the rest rely on Issues as the sole community surface.

---

## 5. Community Momentum & Maturity

### Momentum ranking (volume × engagement quality)

| Rank | Tool | Signal |
|---|---|---|
| 1 | **OpenAI Codex** | 50 issues + 27 PRs + 72-👍 top discussion; highest aggregate signal |
| 2 | **OpenCode** | 50 issues + 50 PRs; deep V2 migration pain means high engagement |
| 3 | **Qwen Code** | 10 PRs/day, active releases, but signal muddied by CI-bot churn (500+ comment threads) |
| 4 | **Gemini CLI** | Strong PR throughput; nightly cadence; subagent bug cluster driving discussion |
| 5 | **Copilot CLI** | Fast patches, but only 3 PRs updated; discussion channel absent |
| 6 | **Pi** | High signal-to-noise (surgical PRs, quantified issues) but low volume |
| 7 | **Claude Code** | Issues active, PRs effectively dead (3 items, one 8 months old) — **highest risk of community frustration** |

### Maturity assessment

- **Most mature processes**: Copilot CLI (rapid patch cycle, semantic versioning) and Qwen Code (nightly + release + SDK).
- **Most rapidly iterating on features**: OpenCode (multimodal read, agent widgets, Antigravity provider, MCP Events beta all in-flight) and Gemini CLI (AST epic + nightly hardening).
- **Most stalled/criticized**: Claude Code — Issue #71542 open 6 months with 73 comments and 71 👍; the "open source claude code" PR (#41447) sitting open since March is a durable dissatisfaction signal.
- **Best self-critique culture**: Codex (#52835, a non-developer's "4 months, still no working app" post) and Qwen Code (post-merge regression tracking on #18042).
- **Community governance concern**: Qwen Code's CI-bot threads (500+ comments on a single gate failure) represent **churn masquerading as engagement** — a warning for other projects.

---

## 6. Trend Signals

### 6.1 Session is the new unit of value — not the prompt
Every project's top ask is about **session persistence, sync, or resumption** (Codex #14067, Claude #91815, Copilot #5468, Qwen #18030). Vendors that solve cross-surface thread continuity will own the multi-device developer. **Actionable for developers**: architect session state as a portable, cloud-or-local-syncable artifact from day one.

### 6.2 Context economics is becoming a measurable discipline
Pi's data (#12165, #12242, #12381) and Codex's memory thread (#12567) show communities now **quantify context waste** (25% of session, 164k-character summaries, ~36.6k tokens/turn baseline in Gemini CLI). Expect `/context` inspectors, lazy tool descriptions, and AST-aware reads to become table stakes. **Actionable**: treat tool-description size as a first-class engineering constraint.

### 6.3 Safety shifting from model guardrails to execution guardrails
The Copilot CLI `rsync --delete` drive-wipe (#5541) and Gemini CLI's SSH-key-in-paste leak (#30169/#26730) mark a pivot: **the highest-severity trust failures now come from tool execution, not model outputs**. Command dry-runs, quoting-normalization, and confirmation gates on destructive operations are emerging as must-haves. **Actionable**: implement pre-execution simulation for `rm`, `rsync --delete`, `git reset --hard`, and similar.

### 6.4 Windows is the industry-wide weak link
Four of seven tools reported **same-day Windows-specific bugs** (Claude Code's Bun panic + drive-letter bug + `CLAUDE_ENV_FILE` wedge; Codex's Send button + Computer Use + accessibility null; Copilot CLI's process cleanup; Qwen Code's UNC/WSL rule mismatch). **Actionable**: Windows CI parity is now a competitive variable, not a checkbox.

### 6.5 Multi-agent topologies exceed current tooling
Nested subagents (#5543 Copilot), config overrides ignored (#22267 Gemini), OOM from notification routing (#15748 Qwen), and false-success termination reports (#22323 Gemini) form a **cross-vendor correctness debt**. **Actionable**: avoid deep subagent nesting in production workflows until the execution layer stabilizes; prefer flat orchestration.

### 6.6 Silent failures are the leading trust-eroder
Remote Control disabling itself (#111057), sessions auto-archived (#107891), stalled providers retried invisibly (#62319), and mobile entries routing to the wrong session (#111587) share a signature: **things break without telling anyone**. **Actionable**: instrument for observability before feature work; "quiet failure" is the highest-severity bug class in agentic tooling.

### 6.7 Provider interop remains fragmentary
MCP `202 Accepted` handling (#65473), Tasks augmentation missing (#5540), session-header inconsistency (#5542), and Copilot PDF rejection (#65490) show the MCP/ACP ecosystem is still **conformance-incomplete**. **Actionable**: budget for per-provider compatibility shims; do not assume spec compliance.

---

*Report compiled from 2026-11-22 community digests. Comment/👍 counts reflect only items updated in the 24-hour window and may undercount cumulative engagement.*

---

## Per-Tool Reports

<details>
<summary><strong>Claude Code</strong> — <a href="https://github.com/anthropics/claude-code">anthropics/claude-code</a></summary>

## Claude Code Skills Highlights

> Source: [anthropics/skills](https://github.com/anthropics/skills)

# Claude Code Skills — Community Highlights Report
*Data as of 2026-11-22 | Source: github.com/anthropics/skills*

---

## 1. Top Skills Ranking (Most-Discussed PRs)

> Note: The provided PR dataset lists comment counts as `undefined`; ranking below is based on attention signals (recency of activity, update frequency, cross-referencing with linked Issues that carry comment counts). Skills are grouped by theme.

| # | Skill / PR | Functionality | Discussion Highlights | Status |
|---|-----------|---------------|----------------------|--------|
| 1 | **mcp-builder fix** — [PR #1742](https://github.com/anthropics/skills/pull/1742) | Fixes `mcp>=2.0.0` breaking change: `streamablehttp_client` → `streamable_http_client`, custom headers via `create_mcp_http_client` | Tied to Issue #1668; updated through Oct 2026 — long-running compatibility fix | OPEN |
| 2 | **skill-creator eval isolation** — [PR #1298](https://github.com/anthropics/skills/pull/1298) | Isolates trigger evals, fixes Windows `select()` on subprocess pipes, handles runtime failures | Addresses false-negative trigger rates; overlaps with Issues #556, #1352 | OPEN |
| 3 | **notion-spec-to-implementation + quantitative-resume-auditor** — [PR #1245](https://github.com/anthropics/skills/pull/1245) | Converts product specs into Notion tasks with acceptance criteria; resume auditing | Two-skill bundle; active through Oct 2026 | OPEN |
| 4 | **webapp-testing shell injection fix** — [PR #1980](https://github.com/anthropics/skills/pull/1980) | Removes `shell=True` in `with_server.py` (CWE-78 command injection) | Security-hardening PR; updated Nov 2026 | OPEN |
| 5 | **docx timeout/verification fix** — [PR #1792](https://github.com/anthropics/skills/pull/1792) | Reports LibreOffice timeout as error; verifies revision marks removed before claiming success | Reliability fix for document pipeline | OPEN |
| 6 | **proofcore-contract-auditor** — [PR #1771](https://github.com/anthropics/skills/pull/1771) | Static analysis of Solidity/Rust contracts; anchors audit proofs on TON Blockchain | Web3 vertical; new skill proposal | OPEN |
| 7 | **pyxel retro game dev** — [PR #525](https://github.com/anthropics/skills/pull/525) | Guides creation/debugging of retro Python games with headless frame inspection | Long-lived PR (Mar–Nov 2026) | OPEN |
| 8 | **document-typography** — [PR #514](https://github.com/anthropics/skills/pull/514) | Prevents orphan word wrap, widow paragraphs, numbering misalignment | Universal document-quality concern | OPEN |

**Other notable entries:** `md2video-audio` ([#1703](https://github.com/anthropics/skills/pull/1703)), `scnet-hpc` ([#1615](https://github.com/anthropics/skills/pull/1615)), `xlsx external_links_at_risk` fix ([#2019](https://github.com/anthropics/skills/pull/2019)).

---

## 2. Community Demand Trends (from Issues)

Distilled from the top 15 commented Issues:

- **Trust & namespace security** — [Issue #492](https://github.com/anthropics/skills/issues/492) (46 comments): community skills shipping under the `anthropic/` namespace impersonate official skills, enabling privilege escalation. *Highest-engagement issue in the dataset.*
- **Org-wide skill sharing** — [Issue #228](https://github.com/anthropics/skills/issues/228) (17 comments, 👍8): users want a shared skill library / direct share links instead of manual `.skill` file uploads.
- **Reliable trigger evaluation** — [Issue #556](https://github.com/anthropics/skills/issues/556) (13 comments, 👍7) and [Issue #1352](https://github.com/anthropics/skills/issues/1352) (6 comments): `run_eval.py` reports ~0% trigger rates, both single-worker and parallel-worker paths broken — a systemic quality-gate problem.
- **Context budget discipline** — [Issue #1487](https://github.com/anthropics/skills/issues/1487): `claude-api` skill eagerly injects ~156k tokens in one tool call; demand for lazy/selective skill loading.
- **Memory & agent state** — [Issue #1329](https://github.com/anthropics/skills/issues/1329): proposal for `compact-memory` using symbolic notation to shrink long-running agent state.
- **Output quality gates** — [Issue #1385](https://github.com/anthropics/skills/issues/1385): three-gate pipeline (calibration → adversarial review → delivery verification).
- **Governance / safety patterns** — [Issue #412](https://github.com/anthropics/skills/issues/412): policy enforcement, threat detection, trust scoring, audit trails for agent systems.
- **Plugin hygiene** — [Issue #189](https://github.com/anthropics/skills/issues/189): `document-skills` and `example-skills` install identical content → context-window duplicates.
- **Skill description quality** — [Issue #2064](https://github.com/anthropics/skills/issues/2064): frontmatter descriptions state *what* but not *when* to use a skill, hurting trigger accuracy.

**Directional summary:** demand is shifting from "more skills" to **skill reliability, security, and lifecycle governance**.

---

## 3. High-Potential Pending Skills (Active, Not Yet Merged)

| Skill | PR | Why It May Land Soon |
|-------|----|----------------------|
| skill-creator direct execution fix | [#1681](https://github.com/anthropics/skills/pull/1681) | Updated 2026-11-19 (freshest activity); fixes `ModuleNotFoundError` on standalone `package_skill.py` |
| YAML frontmatter scalar parsing | [#1997](https://github.com/anthropics/skills/pull/1997) | Corrects `parse_skill_md` quote/continuation handling; affects eval correctness |
| claude-api pause_turn guidance | [#1950](https://github.com/anthropics/skills/pull/1950) | Aligns docs with Python SDK 1.1.0 auto-resumption; updated 2026-11-10 |
| Docs snapshot clarification | [#2108](https://github.com/anthropics/skills/pull/2108) | Documents sync relationship to `~/.claude/skills/synced/`; freshest PR in dataset |
| pptx `--cols` validation | [#1975](https://github.com/anthropics/skills/pull/1975) | Small, well-scoped argparse fix; clear acceptance criteria |
| webapp-testing element reporting | [#1976](https://github.com/anthropics/skills/pull/1976) | Fixes textarea/select misreporting; tied to Issue #1891 |
| algorithmic-art wrapAround | [#1977](https://github.com/anthropics/skills/pull/1977) | Correct modulo wrapping; tied to Issue #1897 |

**Pattern:** the most merge-ready PRs are **narrow bug fixes with linked issues** (gerardrecinto's trio #1975–#1977), while larger new-skill submissions (#1245, #1771, #525) remain stalled.

---

## 4. Skills Ecosystem Insight

> **The community's most concentrated demand is no longer for new Skills, but for trustworthy, correctly-triggering, and securely-scoped Skills — i.e., hardening the skill lifecycle (evaluation, namespace trust, context budget) rather than expanding the catalog.**

---

*All links resolve to github.com/anthropics/skills. Comment counts for PRs were unavailable in the source data; attention ranking used update recency and linked-Issue engagement as proxies.*

---

# Claude Code Community Digest — 2026-11-22

## 1. Today's Highlights

No new releases landed in the last 24 hours, but issue activity remains intense: a long-running GitHub connector regression (#71542, 73 comments, 71 👍) continues to dominate discussion as it enters its sixth month. Windows-specific bugs and Remote Control reliability issues also dominate today's updated backlog, signaling persistent pain in cross-platform and mobile-handoff workflows.

## 2. Releases

No new releases in the last 24 hours.

## 3. Hot Issues

1. **[#71542](https://github.com/anthropics/claude-code/issues/71542)** — GitHub connector links repos but Claude can't access content for *any* repo (account-wide regression). **73 comments, 71 👍** — the single loudest thread in the tracker; the account-wide nature and long open window make it the top trust-eroder.
2. **[#19666](https://github.com/anthropics/claude-code/issues/19666)** — Bun panic crash in VS Code on Windows 11. **18 comments, 19 👍** — longstanding (since January) platform bug with memory/perf tags; a repeated source of Windows skepticism.
3. **[#91618](https://github.com/anthropics/claude-code/issues/91618)** — Windows isolation-worktree safety check rejects valid worktree due to case-sensitive drive-letter comparison. **11 comments** — classic Win32 path-handling regression tagged `regression`.
4. **[#91815](https://github.com/anthropics/claude-code/issues/91815)** — Desktop app: allow **starting** remote sessions from mobile with a device picker. **8 comments, 15 👍** — high-upvote feature; contrasts with the already-shipped "remote control by default."
5. **[#78146](https://github.com/anthropics/claude-code/issues/78146)** — Windows Bash tool permanently wedged: `CLAUDE_ENV_FILE` grows unboundedly across compacts, torn export kills every command (exit 127). **8 comments** — a serious session-killer for hook-heavy Windows setups.
6. **[#96118](https://github.com/anthropics/claude-code/issues/96118)** — Opus 5.5 safeguards flag messages with `reasoning_extraction`. **8 comments, 4 👍** — model-safety friction; users want visibility into *what* was flagged.
7. **[#107433](https://github.com/anthropics/claude-code/issues/107433)** — Memory controls for many concurrent sessions: shared MCP servers + per-agent memory budget. **7 comments** — studio-scale pain (24 sessions ≈ 9.3 GB, 125 GB box thrashing); strong enterprise signal.
8. **[#96382](https://github.com/anthropics/claude-code/issues/96382)** — VS Code extension lost the tabbed sidebar for managing active sessions (since 2.1.268, no opt-out). **4 comments, 4 👍** — a UX regression for anyone running multiple sessions per window.
9. **[#111057](https://github.com/anthropics/claude-code/issues/111057)** — macOS Desktop: Remote Control silently turns itself off on local sessions. **4 comments** — phone-first workflows break without warning; new but trending.
10. **[#85895](https://github.com/anthropics/claude-code/issues/85895)** — Project `.mcp.json` stdio server spawned **twice** per launch; single-connection backends lose their tools client. **5 comments** — subtle, reproducible MCP duplication bug.

## 4. Key PR Progress

The PR queue is thin (only 3 items updated in 24h), but notable:

1. **[#111198](https://github.com/anthropics/claude-code/pull/111198)** (CLOSED) — "Don't run `@claude` mentions on pull requests from forks." A security-hygiene change preventing untrusted fork PRs from triggering agent runs. Merged/closed within 2 days — good sign for supply-chain posture.
2. **[#41447](https://github.com/anthropics/claude-code/pull/41447)** (OPEN) — "feat: open source claude code ✨," closing issues #59, #456, #2846, #22002, #41434. Still open since March; effectively a community pressure-valve PR rather than a merge candidate.
3. **[#1](https://github.com/anthropics/claude-code/pull/1)** (CLOSED) — Original `SECURITY.md` creation by bcherny; resurfaced in the 24h window, no new content.

*No feature/fix PRs with meaningful diffs were updated in this window.*

## 5. Hot Discussions

No Discussions data was provided for this window; section omitted.

## 6. Feature Request Trends

Distilled from today's Issues, the most-requested directions cluster into five themes:

- **Remote/mobile control maturity** — Starting sessions *from* phones (#91815), keeping Remote Control persistently connected (#111057, #107891), and reliable iOS push notifications (#98500). Users want the phone to be a first-class control surface, not a viewer.
- **Multi-session resource management** — Shared MCP servers and memory budgets (#107433), plus headless cloud session lifecycle APIs akin to subagents (#97450). The "many concurrent sessions" use case is now mainstream and straining local resources.
- **Session continuity & draft persistence** — Preserving unsent prompts across tab/extension restarts (#102536), and cross-session UI affordances like PR chips (#77792).
- **Cross-session collaboration** — Sending messages to a teammate's Claude session for approval (#107281) — early signal of team-oriented workflows.
- **Novel interaction modes** — Live voice mode with codebase awareness (#111164).

## 7. Developer Pain Points

Recurring frustrations visible across today's updated issues:

- **Windows is the weak platform.** Bun panics (#19666), drive-letter case sensitivity in worktree checks (#91618), unbounded `CLAUDE_ENV_FILE` growth bricking Bash (#78146), and orphaned hook grandchildren hanging turns (#96476) — four distinct Windows issues updated in one day.
- **MCP reliability and duplication.** Servers spawn twice (#85895), and integrated-browser MCP tools hang forever in VS Code (#94475, closed as stale without an obvious fix). MCP is core infrastructure now; these are high-blast-radius bugs.
- **Silent failures and state drift.** Remote Control turning itself off (#111057), sessions being auto-archived on app quit (#107891), and mobile entries routing to the wrong local session (#111587) all share a signature: things break *quietly*.
- **Platform integration friction on macOS/Linux.** Local Network access denials (#95738), KDE Wayland screen-dimming blocked by "keep awake" (#104923), and stale OAuth refresh locks (#95739).
- **Stale-bot churn.** Several issues (#79689, #94475, #94410, #75425, #94487) were closed as `stale` despite reproducible bugs or real feature asks — a recurring community complaint about triage velocity versus backlog age (see #71542 at ~5 months).

---
*Generated from github.com/anthropics/claude-code issue/PR activity for 2026-11-22. Issue counts reflect only items updated in the last 24h; 👍 counts are as reported by the GitHub API.*

</details>

<details>
<summary><strong>OpenAI Codex</strong> — <a href="https://github.com/openai/codex">openai/codex</a></summary>

# OpenAI Codex Community Digest — 2026-11-22

## 1. Today's Highlights

No new releases shipped in the last 24 hours, but the issue tracker remains highly active with 50 issues and 27 PRs touched. A large batch of `copyberry[bot]` PRs landed focused on TUI polish (Markdown block selection/copy, completion popup suppression, Command Center docking, reasoning summary pickers). Two clusters dominate community attention: **Windows desktop reliability** (auth, send button, Computer Use timeouts) and **cross-device session/thread synchronization**, which has become the single highest-signal feature request.

## 2. Releases

No new releases in the last 24 hours.

## 3. Hot Issues

1. **[#17793](https://github.com/openai/codex/issues/17793) — Backspace deletes more than one character (CLOSED, 23 comments, 👍6)**
   A high-engagement TUI input bug on Linux/Kitty that made prompting painful. The volume of comments and eventual closure suggests a long-debugged core UX defect — a good example of foundational input handling being the top friction point.

2. **[#43189](https://github.com/openai/codex/issues/43189) — "Daybreak Verified" but content still blocked (OPEN, 15 comments)**
   Users who pass verification still hit "This content can't be shown." This erodes trust in the safety-check pipeline and remains unresolved — worth watching as a policy/enforcement consistency issue.

3. **[#62393](https://github.com/openai/codex/issues/62393) — Windows: Send button intermittently disabled (OPEN, 13 comments)**
   Newly filed (Nov 19) and already hot. A blocked Send button on non-empty input is a hard blocker for Windows desktop users; the recency + comment velocity signals a regression users want fixed fast.

4. **[#52039](https://github.com/openai/codex/issues/52039) — Pro 200 promotional credits depleted while weekly allowance remained (OPEN, 13 comments)**
   Billing/credit-accounting disputes are high-stakes. The report of analytics backfilling usage suggests deeper accounting or telemetry issues, not just a UI bug. No 👍 but heavy discussion.

5. **[#57674](https://github.com/openai/codex/issues/57674) — macOS: readiness retries indefinitely for cloud threads (OPEN, 12 comments)**
   Desktop repeatedly reports readiness to cloud threads and gets `thread placement not found` / `thread access denied`. This is core to cloud-thread reliability on macOS.

6. **[#24849](https://github.com/openai/codex/issues/24849) — Agent output truncated in terminal scrollback (CLOSED, 11 comments, 👍5)**
   Lines vanishing from mid-transcript is a serious correctness/trust issue for anyone reading agent output. Closed with solid community upvotes — a meaningful TUI rendering fix.

7. **[#24864](https://github.com/openai/codex/issues/24864) — Feature request: event-based automation triggers (OPEN, 8 comments, 👍13)**
   Highest-upvoted issue in this batch. Users want triggers beyond scheduled/heartbeat runs. Clear demand signal for a more programmable automation layer.

8. **[#56822](https://github.com/openai/codex/issues/56822) — Built-in browser opens but agent can't control it (OPEN, 8 comments)**
   A fundamental gap in the browser/computer-use story: if the agent can't drive the browser that opened, the feature is effectively inert.

9. **[#52319](https://github.com/openai/codex/issues/52319) — Windows Computer Use: `@oai/sky` returns `accessibility: null` (OPEN, 8 comments)**
   Window discovery succeeds but accessibility tree returns null for Notepad/Calculator — directly blocks native Windows automation. Paired with [#63052](https://github.com/openai/codex/issues/63052) (Computer Use init timeout on Windows), this looks like a systemic Windows computer-use problem.

10. **[#24419](https://github.com/openai/codex/issues/24419) — CLI intermittently stuck in "Working" state (OPEN, 5 comments, 👍5)**
    Intermittent hangs with premature reconnect retries. High 👍 relative to comments means many users silently share the pain — reliability is the top implicit ask.

**Also notable (closed with community traction):** [#16687](https://github.com/openai/codex/issues/16687) cursor jump/flash on delete (👍3), [#17823](https://github.com/openai/codex/issues/17823) cursor jumping in third-party terminals (👍4), [#16411](https://github.com/openai/codex/issues/16411) invisible text in light theme (👍4), [#13369](https://github.com/openai/codex/issues/13369) `@` picker surfacing `.git` internals (👍5).

## 4. Key PR Progress

All top PRs this cycle are from `copyberry[bot]` and are marked CLOSED — a concentrated TUI/UX hardening push.

1. **[#63058](https://github.com/openai/codex/pull/63058) — Keep Cloud reply stream recovery retryable after transient failures**
   Fixes exhaustion of recovery attempts and a shared deadline that ate into history-fetch time. Directly relevant to cloud-thread reliability complaints above.

2. **[#63056](https://github.com/openai/codex/pull/63056) — Keep TUI transcript selection cursor visible**
   Ensures the selection cursor never jumps offscreen on move or resize.

3. **[#63054](https://github.com/openai/codex/pull/63054) — Suppress TUI completion popups in shell mode**
   Stops PowerShell syntax like `$env:HTTP_PROXY` from triggering Codex completion menus during `!` shell commands.

4. **[#63047](https://github.com/openai/codex/pull/63047) — Select and copy Markdown blocks in the transcript**
   Adds block-level selection (`m`, `h`/`l`, `Tab` to expand). A meaningful productivity win for copying agent output.

5. **[#63046](https://github.com/openai/codex/pull/63046) — Refresh Code Mode exec catalog on helper signature changes**
   Prevents stale `functions.exec` declarations when nested tools update — correctness fix for Code Mode.

6. **[#63036](https://github.com/openai/codex/pull/63036) — Complete named settings for TUI slash commands**
   Adds flag/value completion for `/model`, `/permissions`, `/title`, `/statusline`, `/mcp login`.

7. **[#63022](https://github.com/openai/codex/pull/63022) — Fix clipboard text fallback and guard pending pastes**
   Addresses X11 clipboard image-vs-text race and prevents submitting before a paste resolves.

8. **[#63013](https://github.com/openai/codex/pull/63013) — Support the Orca integrated terminal**
   Adds Orca detection (`TERM_PROGRAM=Orca`), clickable Markdown links, and Kitty graphics gating.

9. **[#62986](https://github.com/openai/codex/pull/62986) — Dock the Agent Command Center beside the conversation**
   Turns the modal Command Center into a docked pane so transcript and draft stay visible.

10. **[#62905](https://github.com/openai/codex/pull/62905) / [#62904](https://github.com/openai/codex/pull/62904) / [#62903](https://github.com/openai/codex/pull/62903) — Reasoning summary controls**
    Adds a `/config` picker (Auto/Concise/Detailed/None), defaults TUI to automatic summaries, and enables concurrent reasoning summaries by default (`sequential_cutoff`). A coherent, user-visible model-behavior change.

## 5. Hot Discussions

### Ideas
- **[#14067 — Sync Codex Threads and Session Context Across Devices](https://github.com/openai/codex/discussions/14067)** (👍72, 14 comments) — The runaway top discussion. Users work across multiple machines and want threads to follow them. This is the clearest, highest-conviction ask in the entire dataset.
- **[#12567 — Memories in Codex](https://github.com/openai/codex/discussions/12567)** (42 comments, 👍14) — Maintainer-led thread on citation of prior threads and memory UX. Reflects active product exploration.
- **[#12590 — VS Code: Account-Linked Cross-Device Session Sync](https://github.com/openai/codex/discussions/12590)** (👍6) — Extension-specific variant of the sync theme, asking for cloud-persisted history and reasoning state.
- **[#25580 — Shared Codex sessions for team work](https://github.com/openai/codex/discussions/25580)** — Collaborative sessions; adjacent to the sync demand but for teams.
- **[#40290 — ChatGPT↔Codex handoffs cause false PASS results](https://github.com/openai/codex/discussions/40290)** — Requirements/completion criteria drift across handoffs; requests unified context and locked acceptance criteria.
- **[#23347 — Automatic `/handoff` skill near limit windows](https://github.com/openai/codex/discussions/23347)** — Automating session handoff when quota approaches zero.

### Q&A
- **[#37960 — Coordinating local and remote agents across model vendors](https://github.com/openai/codex/discussions/37960)** (11 comments) — Multi-agent, multi-vendor orchestration across machines.
- **[#52835 — AI-assisted KPI system: 4 months, still no working app](https://github.com/openai/codex/discussions/52835)** (9 comments) — A non-developer's sobering account; useful signal on onboarding/expectation gaps.
- **[#62960 — Can a pending command start after a Code Mode "still running" wait?](https://github.com/openai/codex/discussions/62960)** — Low-level Code Mode/executor semantics question.

### Show and tell
- **[#16329 — Awesome Codex CLI: 150+ ecosystem tools](https://github.com/openai/codex/discussions/16329)** (13 comments) — Curated subagents/skills/plugins/MCP list; a useful community index.
- **[#62244 — Octopost: remote MCP server for social posting](https://github.com/openai/codex/discussions/62244)** — One MCP call posts/schedules to X, Bluesky, Mastodon, LinkedIn.
- **[#62545 — Call local Codex from an existing OpenAI SDK](https://github.com/openai/codex/discussions/62545)** — Self-hosted gateway exposing Codex as `agent/codex` via `codex app-server`.
- **[#62928 — realornoise: compare recent vs earlier days in local session logs](https://github.com/openai/codex/discussions/62928)** — Local-only usage analytics.
- **[#62985 — ACQ: two-person text handoff experiment](https://github.com/openai/codex/discussions/62985)** — Agent-to-agent text relay via remote MCP.

## 6. Feature Request Trends

- **Cross-device / cloud session sync (dominant).** [#14067](https://github.com/openai/codex/discussions/14067), [#12590](https://github.com/openai/codex/discussions/12590), [#25580](https://github.com/openai/codex/discussions/25580), and issue [#29719](https://github.com/openai/codex/issues/29719) (session sync across TUI/desktop/mobile) all converge here. This is the #1 unmet need.
- **Event-driven automations.** [#24864](https://github.com/openai/codex/issues/24864) (👍13) wants triggers beyond timers — webhooks, file changes, CI events.
- **Memory & continuity.** [#12567](https://github.com/openai/codex/discussions/12567), [#40290](https://github.com/openai/codex/discussions/40290), [#23347](https://github.com/openai/codex/discussions/23347) — remembering prior threads, preserving intent across handoffs, automatic handoff at quota exhaustion.
- **Multi-chat / multi-session UI.** [#53071](https://github.com/openai/codex/issues/53071) (👍9) wants simultaneous independent chats in VS Code editor tabs.
- **Richer terminal/IDE integration.** Orca support ([#63013](https://github.com/openai/codex/pull/63013)), clickable links, third-party terminal compatibility ([#17823](https://github.com/openai/codex/issues/17823), [#22585](https://github.com/openai/codex/issues/22585)).
- **Agentic browser/computer control.** [#56822](https://github.com/openai/codex/issues/56822), [#52319](https://github.com/openai/codex/issues/52319), [#63052](https://github.com/openai/codex/issues/63052) — users want the browser and native windows to actually be drivable.

## 7. Developer Pain Points

- **Windows desktop is the loudest reliability sore spot.** Auth failures with only "Retry" ([#60311](https://github.com/openai/codex/issues/60311)), intermittent disabled Send ([#62393](https://github.com/openai/codex/issues/62393)), Computer Use init timeouts and null accessibility trees ([#63052](https://github.com/openai/codex/issues/63052), [#52319](https://github.com/openai/codex/issues/52319)), and spurious PowerShell prompts ([#23485](https://github.com/openai/codex/issues/23485)).
- **TUI input/rendering correctness.** Cursor jumps and multi-char backspace ([#17793](https://github.com/openai/codex/issues/17793), [#16687](https://github.com/openai/codex/issues/16687)), truncated scrollback ([#24849](https://github.com/openai/codex/issues/24849)), invisible light-theme text ([#16411](https://github.com/openai/codex/issues/16411)), IME issues ([#19501](https://github.com/openai/codex/issues/19501)), and Chinese text corruption ([#16840](https://github.com/openai/codex/issues/16840)). The volume of TUI PRs this cycle is a direct response.
- **Reliability/hangs and session state.** Stuck "Working" ([#24419](https://github.com/openai/codex/issues/24419)), session desync across surfaces ([#29719](https://github.com/openai/codex/issues/29719)), readiness retry loops ([#57674](https://github.com/openai/codex/issues/57674)), and MCP catalog failures ([#62631](https://github.com/openai/codex/issues/62631)).
- **Billing/credit accounting disputes.** [#52039](https://github.com/openai/codex/issues/52039) — promotional credits draining while allowance persists, with analytics backfilling, is the kind of transparency issue that damages trust.
- **Platform inconsistency on Linux/Wayland.** Image paste failures due to `arboard`/`data-control` gaps ([#24908](https://github.com/openai/codex/issues/24908)) and doc/behavior mismatches ([#27379](https://github.com/openai/codex/issues/27379)).

**Takeaway for the team:** the PR velocity on TUI polish is well-targeted, but the two structural gaps the community keeps returning to are **cross-device session sync** and **Windows/computer-use reliability** — neither of which is addressed by today's merged work. Neither shipped a release today; watch for the reasoning-summary and TUI selection changes to surface in the next build.

</details>

<details>
<summary><strong>Gemini CLI</strong> — <a href="https://github.com/google-gemini/gemini-cli">google-gemini/gemini-cli</a></summary>

# Gemini CLI Community Digest — 2026-11-22

## 1. Today's Highlights

Subagent reliability dominates this cycle: the community is converging on a cluster of bugs around MAX_TURNS misreporting, agent hangs, and configuration overrides being silently ignored. Meanwhile, a large backlog of closed PRs from early November has landed (or is landing), including security fixes for pasted `@` symbol secret leakage, Windows path resolution, and dangerous `rm` flag detection. Maintainers are also actively scoping AST-aware tooling as the next frontier for token-efficient codebase exploration.

---

## 2. Releases

**v0.71.0-nightly.20261121.geecccfcd5** (nightly)

- **fix(cli): expand Windows home-relative paths using tilde and backslash** — `~\...` style paths now resolve against `homedir()` on Windows instead of being treated as literal relative paths. Affects `policyPaths`, `adminPolicyPaths`, `includeDirectories`, and `extensionRegistryURI`. ([PR #30376](https://github.com/google-gemini/gemini-cli/pull/30376))
- **fix(cli): resume most recently *active* session instead of most recently *started*** — fixes session resumption ordering when multiple sessions were opened but only one was actually worked in.

---

## 3. Hot Issues

1. **[#22323 — Subagent recovery after MAX_TURNS reported as GOAL success](https://github.com/google-gemini/gemini-cli/issues/22323)** `p1` · 14 comments
   The `codebase_investigator` subagent reports `status: "success"` and `Termination Reason: "GOAL"` even when its own output admits it hit the turn limit before analyzing anything. This silently masks interrupted work — a correctness problem for anyone relying on subagent signal to gate downstream actions. High comment count reflects maintainer retesting activity.

2. **[#21409 — Generalist agent hangs](https://github.com/google-gemini/gemini-cli/issues/21409)** `p1` · 8 comments · 👍 8
   When `gemini-cli` defers to the generalist agent, it can hang indefinitely (up to an hour reported). Users report instructing the model *not* to use subagents as a workaround. Highest 👍 count in the issue set signals real-world impact.

3. **[#21968 — Gemini does not use skills and sub-agents enough](https://github.com/google-gemini/gemini-cli/issues/21968)** `p2` · 7 comments
   Anecdotal but persistent: the model won't autonomously invoke custom skills/subagents with obviously matching descriptions (e.g., a `gradle` skill for Gradle tasks) unless explicitly told to. Points at a routing/selection gap rather than a tooling gap.

4. **[#22745 — Assess impact of AST-aware file reads, search, and mapping](https://github.com/google-gemini/gemini-cli/issues/22745)** `p2` · 7 comments
   Epic tracking whether AST-aware tools can reduce misaligned reads, shrink token noise, and cut turn counts. Companion to [#22746](https://github.com/google-gemini/gemini-cli/issues/22746) and [#22747](https://github.com/google-gemini/gemini-cli/issues/22747), which point at `tilth`, `glyph`, and `ast-grep` as candidate backends.

5. **[#19873 — Zero-dependency OS sandboxing & post-execution intent routing](https://github.com/google-gemini/gemini-cli/issues/19873)** `p2` · 9 comments
   Proposal to lean into Gemini 3's native bash affinity (chained `grep`/`sed`/`awk`) while containing risk via sandboxing rather than restricting shell access. Strategic in nature — could reshape the agent's tool surface.

6. **[#22267 — Browser Agent ignores `settings.json` overrides](https://github.com/google-gemini/gemini-cli/issues/22267)** `p2` · 5 comments
   `AgentRegistry` reads and merges overrides correctly at init, but the Browser Agent doesn't honor them at runtime (e.g., `maxTurns`). Classic config-plumbing disconnect between registry and executor.

7. **[#21983 — Browser subagent fails in Wayland](https://github.com/google-gemini/gemini-cli/issues/21983)** `p1` · 4 comments
   Browser subagent reports `GOAL` termination yet fails on Wayland sessions. Combined with #22267 and [#22232](https://github.com/google-gemini/gemini-cli/issues/22232) (session takeover/lock recovery), the browser agent is accumulating a distinct reliability cluster.

8. **[#24246 — 400 error with >128 tools](https://github.com/google-gemini/gemini-cli/issues/24246)** `p2` · 3 comments
   Hard API ceiling hit when tool count grows (issue text cites >400, title cites >128). Users expect the agent to intelligently narrow the in-scope tool set per task rather than blow the request.

9. **[#22672 — Agent should stop/discourage destructive behavior](https://github.com/google-gemini/gemini-cli/issues/22672)** `p2` · 3 comments
   Model occasionally reaches for `git reset`/`--force` when safer alternatives exist. Aligns with the currently-open PR [#30171](https://github.com/google-gemini/gemini-cli/pull/30171) closing gaps in `rm -rf` flag detection.

10. **[#23571 — Model creates tmp scripts in random spots](https://github.com/google-gemini/gemini-cli/issues/23571)** `p2` · 3 comments
    When restricted to shell execution, the model scatters edit scripts across directories, making clean commits painful. A hygiene issue that will only grow with the bash-affinity direction in #19873.

---

## 4. Key PR Progress

1. **[#30169 — Keep pasted `@` text and fuzzy matches from attaching secrets](https://github.com/google-gemini/gemini-cli/pull/30169)** `p1` · security
   Fixes an SSH private key being silently attached to model requests when a pasted shell transcript contains `@`. Sets `ui.escapePastedAtSymbols` to default `true` and hardens fuzzy `@` file matching. Closes [#26730](https://github.com/google-gemini/gemini-cli/issues/26730).

2. **[#30171 — Flag recursive/forced `rm` regardless of flag position](https://github.com/google-gemini/gemini-cli/pull/30171)** `p1`
   `isDangerousCommand` only inspected `args[1]`, so `rm -r -f`, `rm -Rf`, `rm -vrf`, `rm --recursive --force`, and trailing `rm x -rf` all bypassed policy heuristics. Fixes a real safety gap.

3. **[#30170 — Stop subagents from waiting out their deadline on stalled model calls](https://github.com/google-gemini/gemini-cli/pull/30170)** `p1`
   Adds a per-turn timeout so a stalled call doesn't consume the entire `maxTimeMinutes` plus a recovery turn. Directly addresses the hanging behavior reported in #21409-adjacent scenarios.

4. **[#30175 — Apply local subagents' `generateContentConfig` for every model](https://github.com/google-gemini/gemini-cli/pull/30175)**
   Previously only honored for `auto` agents; now temperature, topP, topK, and `thinkingConfig` propagate for aliases (`flash`, `pro`) and concrete model names. Closes [#30168](https://github.com/google-gemini/gemini-cli/issues/30168).

5. **[#30172 — One result per tool-call ID in session records and live history](https://github.com/google-gemini/gemini-cli/pull/30172)** `p2`
   Removes the remaining sources of duplicated tool results that caused `--resume` corruption (#28004). Complements the earlier read-path fix in #29618.

6. **[#30174 — Stop body timeouts from killing and replaying long model turns](https://github.com/google-gemini/gemini-cli/pull/30174)**
   Undici body timeout aborted long streamed turns (e.g., a large `write_file` under heavy thinking) after 5 minutes of silence, then replayed the request up to 3×. Fixes [#29747](https://github.com/google-gemini/gemini-cli/issues/29747).

7. **[#30173 — Load `~/.gemini/.env` in untrusted folders](https://github.com/google-gemini/gemini-cli/pull/30173)** `p3` · security
   Workspace-account users keeping `GOOGLE_CLOUD_PROJECT` in `.env` were stuck in login loops outside trusted folders. Re-enables the read with the existing allowlist. Fixes [#27114](https://github.com/google-gemini/gemini-cli/issues/27114).

8. **[#30279 — Preserve trimmed function-call name to prevent 400 INVALID_ARGUMENT](https://github.com/google-gemini/gemini-cli/pull/30279)**
   When the model emits a call name with whitespace (`" update_topic"`), dispatch trims it but the `functionResponse` retained the untrimmed name → API rejection. Fixes [#30256](https://github.com/google-gemini/gemini-cli/issues/30256).

9. **[#30281 — Honor configured fetch timeouts on Node 26](https://github.com/google-gemini/gemini-cli/pull/30281)**
   Upgrades core Undici to 7.30.2 so global dispatchers are published under the symbol Node 26's built-in fetch actually reads. Includes regression tests for both dispatcher symbols.

10. **[#30267 — Detect local git clone installation from CLI executable path](https://github.com/google-gemini/gemini-cli/pull/30267)**
    Fixes source-checkout runs being misclassified as global npm installs, which triggered an unwanted background `npm install -g @google/gemini-cli@latest` during auto-update.

*Also notable:* [#30308](https://github.com/google-gemini/gemini-cli/pull/30308) (Windows tilde-backslash path expansion, now merged into nightly), [#30178](https://github.com/google-gemini/gemini-cli/pull/30178) (Korean IME final-syllable drop fix), and [#30268](https://github.com/google-gemini/gemini-cli/pull/30268) (respect active YOLO mode in taint/build checks).

---

## 5. Hot Discussions

No discussion data was provided for this cycle; this section is omitted.

---

## 6. Feature Request Trends

- **AST-aware codebase tooling** — A coordinated cluster (#22745, #22746, #22747) explores `ast-grep`/`tilth`/`glyph` for surgical reads, syntax-shape search, and codebase mapping. Motivation: reduce turn count from misaligned reads and cut the ~36.6k token/turn baseline (see also #19561 "Tactful Extraction").
- **Persistent, file-based task tracking** — #18836 proposes deprecating in-context `WriteToDo` in favor of CRUD-based tracking to eliminate context rot and cross-session memory loss. Related: #21000 (native file tools for task tracker), #20195 (local subagent sprint).
- **Better subagent observability** — #22598 asks for subagent trajectories via `/chat share`; #21763 notes `/bug` reports omit subagent context entirely.
- **Agent self-awareness** — #21432 wants the CLI to accurately describe its own flags, hotkeys, and self-execution patterns.
- **Per-workspace policy** — #18397 proposes workspace-scoped policy (vs. global) for auto-add approvals.
- **Parallel subagent collaboration / shared memory** — #18287 (currently blocked on parallel subagent support), #18285 (subagent discovery via `settings.json`).

---

## 7. Developer Pain Points

1. **Subagent reliability is the dominant theme.** MAX_TURNS misreporting (#22323), indefinite hangs (#21409), stalled-call deadline waste (#30170), and config overrides being ignored (#22267) together suggest the subagent execution layer needs a focused correctness pass. Users are already applying workarounds like disabling subagent deferral.

2. **Browser agent fragility.** Wayland incompatibility (#21983), settings overrides ignored (#22267), and fail-fast lock handling (#22232) form a distinct reliability cluster.

3. **Destructive command safety gaps.** Flag-position bypasses in `rm` detection (#30171/#26767) and general force-push/`git reset` tendencies (#22672) are actively being hardened — but the pattern suggests heuristics were under-tested against real shell idioms.

4. **Accidental secret exposure.** The pasted-`@` → SSH key attachment path (#30169/#26730) is a serious trust issue, now defaulted to inert behavior.

5. **Session/history integrity.** Duplicate tool results corrupting `--resume` (#30172/#28004) and untrimmed function-call names causing 400 errors (#30279/#30256) point to gaps between model output normalization and persistence.

6. **Workspace hygiene.** Scattered tmp scripts (#23571) and context bloat from firehose file reads (#19561, #22745) are recurring complaints that the AST-tooling track aims to address.

7. **Platform-specific friction.** Windows path handling (#30376, #30308), Node 26 fetch dispatcher symbols (#30281), and Wayland browser support (#21983) each reflect environment coverage still catching up.

---

*Generated from github.com/google-gemini/gemini-cli data for 2026-11-22.*

</details>

<details>
<summary><strong>GitHub Copilot CLI</strong> — <a href="https://github.com/github/copilot-cli">github/copilot-cli</a></summary>

# GitHub Copilot CLI Community Digest — 2026-11-22

## 1. Today's Highlights

A rapid patch cycle landed three releases (v1.0.115-4 through v1.0.115-6), headlined by a fix for a plugin initialization race that could block new sessions or prevent existing sessions from resuming — a significant stability win for extension-heavy workflows. Meanwhile, the issue tracker saw a surge of triage-stage reports, with the most alarming being a destructive `rsync --delete` incident in WSL that wiped a user drive, underscoring ongoing concerns about shell quoting safety in agent-executed commands. Session management and permission UX remain the dominant long-term themes, with several overlapping requests converging around persistent, user-level approvals.

## 2. Releases

Three builds shipped in the last 24 hours:

**v1.0.115-6** — Fixes
- Organization-required plugins can now install on the next attempt when a temporary policy change interrupts setup, without waiting for the usual retry delay.
- `/delegate` now explains that a login is needed instead of silently doing nothing when not signed in.
- Unix: shell command cancellation behavior addressed (release note truncated in source).

**v1.0.115-5** — Improved / Fixed
- Long-running local sessions consume less disk space and resume faster.
- Fixed: queuing a switch from a specific model to Copilot Fusion now acknowledges the requested routing profile instead of displaying the previous one.

**v1.0.115-4** — Added / Fixed
- Added structured clarification questions in ACP editors that support forms.
- Fixed: prevented a plugin initialization race from blocking new sessions or causing existing sessions to fail to resume.
- Fixed: on Windows, cleanup of child processes from Git commands, hooks, and language server checks.

## 3. Hot Issues

1. **[#5541 [OPEN] Agent ran `rsync -a --delete <dir>/ /` in WSL and irrecoverably wiped a user drive](https://github.com/github/copilot-cli/issues/5541)** — `triage:needs-human`. The most severe report of the day: a multi-line bash script passed from PowerShell to WSL had its quoting mangled, causing an empty variable to expand into a root-level destructive `rsync`. No comments yet, but this is a critical safety incident that will likely drive demand for command dry-runs or confirmation gates on destructive operations.

2. **[#3558 [CLOSED] Duplicate Item Errors](https://github.com/github/copilot-cli/issues/3558)** — `area:context-memory, area:models`. A long-running issue (opened May 2026) finally closed, involving `CAPIError: 400 Duplicate item found with id fc_call_...` during websocket processing. With 8 👍, it was among the most-upvoted items updated today — resolution suggests context-memory deduplication improvements landed.

3. **[#5547 [OPEN] install.sh: `VERSION=prerelease` installs an older build than the latest stable release](https://github.com/github/copilot-cli/issues/5547)** — A Git version-sort vs. semver mismatch causes prerelease installs to regress to an older build after a stable release. Filed same day as PR #5548 (see PRs), making this a fast-moving fix.

4. **[#5468 [OPEN] Remote control fails on GitHub Mobile and github.com — "sealed value must bind this connection's challenge"](https://github.com/github/copilot-cli/issues/5468)** — Cross-client relay connection failure (GitHub Mobile Android 1.284.0 and web). Sessions sync and are readable but not controllable. Reproducible across platforms, indicating a server/relay protocol issue rather than a client bug.

5. **[#5543 [OPEN] Subagents started by other subagents can't be multi-turn](https://github.com/github/copilot-cli/issues/5543)** — `mode "background"` is silently ignored for nested subagents, and `write_agent` refuses them. Contradicts changelog claims that multi-turn subagents are "always enabled" — a gap between documented behavior and reality for orchestration-heavy users.

6. **[#5550 [OPEN] Built-in GitHub MCP read tools are unavailable to custom agents when `gh` is on `PATH`](https://github.com/github/copilot-cli/issues/5550)** — A path-shadowing conflict: when the `gh` binary is present, custom agents lose access to built-in MCP read tools even when they explicitly declare GitHub access. Impacts agent authors relying on MCP over shell fallbacks.

7. **[#3192 [OPEN] `statusLine.command` is not executed or rendered when `footer.showCustom=true`](https://github.com/github/copilot-cli/issues/3192)** — Open since May 2026, still unresolved. Custom status line silently fails with no error output on macOS — a persistent configuration/rendering bug frustrating power users who customize their footer.

8. **[#5542 [OPEN] Supabase OAuth status probe fails with missing Mcp-Session-Id (HTTP 400) while normal tool calls succeed](https://github.com/github/copilot-cli/issues/5542)** — `area:mcp`. A split-brain MCP auth state: the OAuth status check fails while actual tool invocation works. Points to inconsistent session-header handling in the MCP client.

9. **[#5540 [OPEN] Copilot CLI does not send MCP Tasks augmentation for task-required tools](https://github.com/github/copilot-cli/issues/5540)** — CLI advertises MCP Tasks support at init but fails to send task augmentation for tools declared `taskSupport: "required"`, so servers reject the call. Reproduces with generic MCP servers — a protocol-conformance bug.

10. **[#5536 [OPEN] Permission prompts reset question dialogs in the CLI](https://github.com/github/copilot-cli/issues/5536)** — `area:permissions, area:agents, area:input-keyboard`. When a permission prompt interrupts a foreground agent's question box, approving/denying resets the user's in-progress input. A concrete UX regression for concurrent background-agent workflows.

Honorable mentions: **[#2256 (CLOSED) persistent binary approvals](https://github.com/github/copilot-cli/issues/2256)**, **[#1696 (CLOSED) resumed sessions re-requesting permissions](https://github.com/github/copilot-cli/issues/1696)**, and **[#4874 (CLOSED) `/exit` from nested sessions](https://github.com/github/copilot-cli/issues/4874)** all closed today — a cluster of long-standing session/permission complaints resolved in one batch.

## 4. Key PR Progress

1. **[#5548 [OPEN] install: sort stable releases after their prereleases](https://github.com/github/copilot-cli/pull/5548)** — Direct fix for #5547. Configures `versionsort.suffix` (or equivalent) so `VERSION=prerelease` no longer installs a stale build after a stable release. Fast turnaround — filed and patched the same day.

2. **[#5310 [OPEN] Fix container smoke-test workspace permissions](https://github.com/github/copilot-cli/pull/5310)** — Addresses amd64/arm64 smoke-test failures in workflow run 41153798295. The temp workspace's `0700` mode blocked the image runtime user (UID 10001), and root-initialized Git compounded the problem. CI reliability improvement for multi-arch builds.

3. **[#1512 [CLOSED] Updated Copilot CLI default model in readme](https://github.com/github/copilot-cli/pull/1512)** — Documentation fix updating the default model reference from Sonnet 4.5 to Sonnet 4.6. Open since February 2026; finally merged. Minor but reflects long doc-lag.

*(Note: only 3 PRs were updated in the last 24h; the remaining items below are drawn from the release changelog as shipped fixes, which represent the practical "PR progress" for this window.)*

4. **Plugin init race fix (v1.0.115-4)** — Prevents plugin initialization from blocking new sessions or breaking session resume. Directly addresses a class of extension-related session failures.

5. **Plugin policy-change retry fix (v1.0.115-6)** — Organization-required plugins now install on the next attempt after a temporary policy interruption, removing the retry-delay penalty.

6. **`/delegate` auth messaging (v1.0.115-6)** — Now surfaces a login prompt instead of silently no-op'ing when unauthenticated.

7. **Model-switch queue acknowledgment (v1.0.115-5)** — Switching to Copilot Fusion now reflects the requested routing profile rather than showing stale state.

8. **Session disk/resume optimization (v1.0.115-5)** — Long-running local sessions use less disk and resume faster — relevant to users running persistent agent sessions.

9. **Windows child-process cleanup (v1.0.115-4)** — Cleans up orphaned processes from Git commands, hooks, and language server checks on Windows.

10. **Structured clarification questions in ACP forms (v1.0.115-4)** — Adds form-based structured clarification for ACP editors that support it, improving agent–user disambiguation.

## 5. Hot Discussions

No Discussions data was provided for this window. Section omitted.

## 6. Feature Request Trends

Distilling across all issues:

- **Persistent, user-level permissions** — The single loudest cluster. [#2256](https://github.com/github/copilot-cli/issues/2256) (permanent binary approvals), [#1696](https://github.com/github/copilot-cli/issues/1696) (resumed sessions reusing grants), and [#5539](https://github.com/github/copilot-cli/issues/5539) (one permanent read rule across sessions/repos) all ask for the same thing: stop re-prompting for trusted operations. The closure of #2256 and #1696 today signals movement here.

- **Session lifecycle controls** — [#4874](https://github.com/github/copilot-cli/issues/4874) (`/exit` from nested sessions, closed) and [#5549](https://github.com/github/copilot-cli/issues/5549) (add `resume_session`/`suspend_session` tools + sidebar suspend action) point to demand for richer programmatic session management.

- **Subagent orchestration depth** — [#5543](https://github.com/github/copilot-cli/issues/5543) requests multi-turn nested subagents and background mode that actually works below the top level.

- **MCP protocol completeness** — [#5540](https://github.com/github/copilot-cli/issues/5540) (Tasks augmentation) and [#5542](https://github.com/github/copilot-cli/issues/5542) (session-header consistency) ask for fuller, more correct MCP client behavior.

- **Observability & cost visibility** — [#5537](https://github.com/github/copilot-cli/issues/5537) requests an AI-credits-used column in the session list.

- **Context management** — [#1682](https://github.com/github/copilot-cli/issues/1682) (closed) sought explicit context management controls as model quality degrades with context growth.

- **Browser/plugin breadth** — [#5538](https://github.com/github/copilot-cli/issues/5538) requests an approval flow for Chromium browsers without a native toolbar (e.g., Vivaldi).

## 7. Developer Pain Points

- **Destructive command safety** — [#5541](https://github.com/github/copilot-cli/issues/5541) (irrecoverable `rsync --delete` wipe) is the standout. Shell quoting across PowerShell→WSL boundaries is fragile, and agents executing destructive commands without a dry-run or hard confirmation is a trust-breaking failure mode.

- **Permission fatigue and complexity** — A persistent chorus: users are tired of re-approving `ls`/`grep`/`sed` every session, and [#5539](https://github.com/github/copilot-cli/issues/5539) explicitly calls the policy model "too complex to configure confidently." The UX asks for simplicity, but the system offers granular policy rules.

- **Network/proxy incompatibilities** — [#5544](https://github.com/github/copilot-cli/issues/5544) (Surge Fake-IP still rejected on 1.0.114, follow-up to closed [#5180](https://github.com/github/copilot-cli/issues/5180)) and [#5546](https://github.com/github/copilot-cli/issues/5546) (TLS `handshake_failure` on corporate filtered networks, Schannel `SEC_E_ILLEGAL_MESSAGE`) show enterprise/proxy environments remain poorly supported.

- **MCP client inconsistencies** — Auth-status probes that disagree with actual tool calls ([#5542](https://github.com/github/copilot-cli/issues/5542)), missing Tasks augmentation ([#5540](https://github.com/github/copilot-cli/issues/5540)), and `gh`-on-PATH shadowing built-in tools ([#5550](https://github.com/github/copilot-cli/issues/5550)) erode confidence in MCP as a reliable integration layer.

- **Nested-session and subagent gaps** — [#5468](https://github.com/github/copilot-cli/issues/5468) (remote control broken cross-client) and [#5543](https://github.com/github/copilot-cli/issues/5543) (nested subagents not multi-turn) reveal that multi-layer session/agent topologies are not yet first-class.

- **Config/rendering regressions with slow resolution** — [#3192](https://github.com/github/copilot-cli/issues/3192) has sat open for ~6 months with silent failure and no error output, a recurring pattern where customization bugs get low priority despite user investment.

---

*Digest compiled from github.com/github/copilot-cli activity on 2026-11-21/22. Only 3 PRs and 0 Discussions were present in the provided data window; release changelog entries were used to supplement PR coverage where noted.*

</details>

<details>
<summary><strong>OpenCode</strong> — <a href="https://github.com/anomalyco/opencode">anomalyco/opencode</a></summary>

# OpenCode Community Digest — 2026-11-22

## 1. Today's Highlights

No new releases landed in the last 24 hours, but the issue tracker is highly active with 50 updated issues and 50 updated PRs. The dominant themes are **V2 stability problems** (SQLite OOM/disk I/O failures, session drain bugs, desktop renderer hangs) and **provider integration friction** (Mistral GLM tool-call errors, MCP `202 Accepted` handling, V1→V2 migration silently dropping prompt caching). On the feature side, multimodal `read` support (audio/video) and Google Antigravity provider work are moving forward in PRs.

## 2. Releases

No new releases in the last 24 hours.

## 3. Hot Issues

1. **[#59387](https://github.com/anomalyco/opencode/issues/59387) — Free tier issues megathread** (405 comments, 30 👍) — The central tracking issue for free-tier quota failures ("Free usage exceeded", reset timers that never fire). Highest-traffic issue by far; the go-to thread for anyone hitting free tier limits.

2. **[#65371](https://github.com/anomalyco/opencode/issues/65371) — Server dies with V8 heap OOM during session warming** (10 comments, CLOSED) — Server v2.3.2 crashed four times in one day while `"warming": true` was active, with baseline heap near 2GB. Critical reliability signal for V2 server operators.

3. **[#63743](https://github.com/anomalyco/opencode/issues/63743) — `opencode upgrade` via npm uses `--force`, downloads ~2GB** (8 comments) — The updater spawns `npm install --force`, pulling all platform optionalDependencies. A concrete bandwidth/disk pain point for npm-managed installs.

4. **[#47836](https://github.com/anomalyco/opencode/issues/47836) — TUI: bindable "set as default model for this agent" action** (5 comments, 1 👍) — Requests UI-level persistence of per-agent default models instead of hand-editing `opencode.json(c)`. Ongoing 2.0 polish item.

5. **[#65277](https://github.com/anomalyco/opencode/issues/65277) — Parent gemini-4-neon hallucinates `<subagent state="completed">` blocks** (4 comments) — While children run, the parent model emits literal XML subagent blocks and raw turn delimiters. A notable model-behavior/session-integrity bug.

6. **[#62319](https://github.com/anomalyco/opencode/issues/62319) — Stalled upstream retried silently, nothing surfaced** (4 comments) — Provider endpoints that accept but never stream leave sessions hanging indefinitely with no WARN/INFO logs. A debuggability black hole.

7. **[#65438](https://github.com/anomalyco/opencode/issues/65438) — Background shell tool part stuck at `status: "running"`** (4 comments) — Completion notices arrive as separate messages but the original tool part is never updated, corrupting persisted session history.

8. **[#64896](https://github.com/anomalyco/opencode/issues/64896) — Session drain fails with `SQLiteError: out of memory`** (3 comments) — On Windows, host OOM kills the desktop silently; the next launch surfaces a broken drain. Compounds with other V2 storage issues.

9. **[#64616](https://github.com/anomalyco/opencode/issues/64616) — Desktop renderer hangs on `/api/event` SSE stream** (3 comments) — Repeated freezes requiring full relaunch while the background service stays healthy; points at the renderer's SSE reader and request queue.

10. **[#65400](https://github.com/anomalyco/opencode/issues/65400) — V1→V2 migration silently drops prompt caching for OpenAI-compatible Claude endpoints** (3 comments) — Every turn bills as uncached input with no warning. Cost-impacting migration regression.

## 4. Key PR Progress

1. **[#65503](https://github.com/anomalyco/opencode/pull/65503) — feat(read): attach audio and video files for multimodal models** — Extends `read` beyond images/PDFs to audio and video. Closes #54491, #54049, and umbrella #10531; replaces the cleanup-closed #54496.

2. **[#64870](https://github.com/anomalyco/opencode/pull/64870) — feat(tui): find in session** — Adds a find bar to the TUI (`<leader>f`, `super+f`, or `/find`), mirroring the desktop app. Closes long-standing #4714.

3. **[#65261](https://github.com/anomalyco/opencode/pull/65261) — feat(core): agent widgets** — Agents can render interactive widgets (PsychoScript templates + JSON data) natively in clients. Potentially the most impactful feature PR in flight.

4. **[#65489](https://github.com/anomalyco/opencode/pull/65489) — feat(core): add the Google Antigravity provider** — Implements the ACP route requested in #28889 (Antigravity CLI connector + Google OAuth). Replaces the bundled #65430.

5. **[#65241](https://github.com/anomalyco/opencode/pull/65241) — fix(core): run session stats off main thread** — Fixes #65137, where `opencode stats` wedged the server's event loop on a 35GB V2 database via synchronous full-range scans.

6. **[#65472](https://github.com/anomalyco/opencode/pull/65472) — fix(core): spell Claude variants for Bedrock inference profile ARNs** — Fixes #53756; `bedrockConverse` misclassified Claude vs. Nova for ARN-based `modelID`s.

7. **[#65492](https://github.com/anomalyco/opencode/pull/65492) — fix(core): disable Copilot PDF input on `/chat/completions`** — Closes #65490; Copilot Gemini routes reject `type: "file"` parts with HTTP 400.

8. **[#65467](https://github.com/anomalyco/opencode/pull/65467) — fix(core): never save a bare escalation wildcard from Always allow** — Closes #64627; an "Always allow" click previously saved a wildcard approving every command through an escalation wrapper.

9. **[#65498](https://github.com/anomalyco/opencode/pull/65498) — chore: write release notes and translations with Gemini 4 Neon** — Switches changelog/TUI-highlight and translation generators to `opencode/gemini-4-neon` at high reasoning. Interesting dogfooding signal.

10. **[#65271](https://github.com/anomalyco/opencode/pull/65271) — feat(mcp): follow the MCP Events beta for push delivery** — Brings the experimental MCP Events client up to the SEP-3415 beta, relevant to the MCP interoperability fixes above.

## 5. Hot Discussions

No discussion data was provided for this period.

## 6. Feature Request Trends

- **Session organization & UX**: custom session categories with per-category visibility in the picker (#65504), first-class work context bound to GitHub issues/PRs and worktrees (#42396), workspace artifacts with local preview and optional publishing (#35318).
- **Provider/auth expansion**: Google Antigravity + OAuth (#28889), Claude Agent provider via Claude Code login (#58782), self-hosted server without password behind an auth proxy (#65500).
- **TUI/desktop parity**: per-agent default model binding in the model dialog (#47836), find-in-session (#64870), cost estimates in the mini/run footer (#60653).
- **Tooling control**: configurable edit/patch tool selection (#63981), `@file` references without auto-reading content (#37468), local GPU-accelerated voice dictation (#65499).

## 7. Developer Pain Points

- **V2 storage reliability is the top cluster**: SQLite OOM on session drain (#64896), disk I/O error on resume from sleep leaving the service stuck at 500 (#59189), migration marker trusted while sessions open empty (#65497), and 35GB DBs wedging `opencode stats` (#65137).
- **Silent failures with no diagnostics**: stalled providers retried invisibly (#62319), desktop exits with no shutdown record (#65501), and ~80s of doomed retries on `ECONNREFUSED` (#65447).
- **Provider interop bugs recur**: Mistral GLM tool-call errors (#43199, #55743), MCP remote servers returning `202 Accepted` failing with "Unexpected content type: null" (#65473), Copilot PDF rejection (#65490).
- **Cost/quota visibility**: free-tier reset timers failing (#59387) and silent loss of prompt caching after migration (#65400) leave users unable to predict or explain spend.
- **Update/upgrade friction**: `opencode upgrade` pulling ~2GB via `--force` (#63743) is a frequently cited annoyance for npm installs.

</details>

<details>
<summary><strong>Pi</strong> — <a href="https://github.com/earendil-works/pi">earendil-works/pi</a></summary>

# Pi Community Digest — 2026-11-22

## 1. Today's Highlights

A busy 24 hours saw a wave of triaged and closed issues, headlined by a long-running npm search indexing problem (#7885) that kept new `pi-package` entries off the pi.dev gallery for over three months. Context-window management dominated the technical conversation, with a bug showing compaction summaries ballooning from 17k to 164k characters (#12242) and a related PR redesigning the summary budget to scale with the model's context window (#12380). Meanwhile, `searchTools()` was flagged as consuming roughly 25% of a long session's context (#12165), reinforcing a clear community appetite for tighter context accounting.

## 2. Releases

No new releases in the last 24 hours.

## 3. Hot Issues

1. **[#7885 [CLOSED] npm search not indexing newly published pi-packages](https://github.com/earendil-works/pi/issues/7885)** — A three-month-old blocker where packages tagged `pi-package` never surfaced in `npm search`, and thus never appeared in the pi.dev/packages gallery. With 18 comments and finally closed today, this unblocks discoverability for the entire third-party package ecosystem.

2. **[#11021 [OPEN] ChatGPT sign-in uses 272K for GPT-6.1 Sol despite 500K catalog](https://github.com/earendil-works/pi/issues/11021)** — Pi reports a smaller context window than the server actually advertises, shrinking compaction budgets for ChatGPT-authenticated users. At 8 👍, it's the most-upvoted open issue in this batch and a direct quality-of-life hit for large-context workflows.

3. **[#12242 [OPEN] Compaction summary grows on every update (17k → 164k chars over nine compactions)](https://github.com/earendil-works/pi/issues/12242)** — The "PRESERVE all existing information" update prompt causes monotonic summary growth; the ninth compaction took 588 seconds and 75k output tokens. A severe long-session cost and latency problem that directly motivated PR #12380.

4. **[#12165 [OPEN] searchTools() returns full tool descriptions — 36KB per call, ~25% of session context](https://github.com/earendil-works/pi/issues/12165)** — Measured data from a real 3-day coding session: 73 calls costing ~950KB, more than all file reads combined. A compelling, quantified case for lazy/truncated tool descriptions.

5. **[#12381 [CLOSED] Compaction summary budget is ~13k tokens regardless of model context window](https://github.com/earendil-works/pi/issues/12381)** — Shows `reserveTokens` conflates two unrelated jobs (trigger threshold and summary budget), pinning summary size independent of model capability. Closed same-day with an accompanying PR.

6. **[#12238 [OPEN] Headless `pi -p` hangs when a stdio MCP server stays connected](https://github.com/earendil-works/pi/issues/12238)** — A clean, reproducible CI/automation blocker: pi prints its result but never exits, requiring SIGKILL. Notable because it hits scripted usage specifically.

7. **[#12156 [OPEN] codemode schemaToType ignores limits for array items](https://github.com/earendil-works/pi/issues/12156)** — Type generation drops item-level constraints, producing under-specified schemas that feed wrong types to the model. A small but high-leverage correctness fix in codemode.

8. **[#12206 [OPEN] finish_reason: "error" is not auto-retried](https://github.com/earendil-works/pi/issues/12206)** — Streaming github-copilot sessions terminate mid-stream with `finish_reason: "error"` and are never retried, so transient provider errors become hard failures. A robustness gap likely affecting multiple openai-completions providers.

9. **[#12382 [CLOSED] isContextOverflow treats 429/5xx/quota errors as overflow](https://github.com/earendil-works/pi/issues/12382)** — Rate limits and quota errors get misclassified as context overflow, triggering pointless compaction instead of retry. Contributed upstream from the n8n-io/nod patches; closed today.

10. **[#12383 [CLOSED] Resumed Kimi session cannot select tools present in outbound payload](https://github.com/earendil-works/pi/issues/12383)** — Four of eight tools silently unavailable in a resumed session despite being present in the effective prompt and provider payload. A worrying session-serialization edge case, now triaged.

## 4. Key PR Progress

1. **[#12380 [CLOSED] fix(durable): size the compaction summary budget from the model's context window](https://github.com/earendil-works/pi/pull/12380)** — Replaces `0.8 × reserveTokens` with `min(10% × contextWindow, model.maxTokens)`. Directly addresses #12381 and #12242; large-context models stop over-compacting.

2. **[#12378 [CLOSED] fix(coding-agent): keep usage-backed estimate past post-usage context edits](https://github.com/earendil-works/pi/pull/12378)** — Stops `estimateProjectedContextTokens` from discarding real provider-measured usage whenever any `context_edit` exists, fixing an over-eager fallback to estimates.

3. **[#12390 [CLOSED] Fork/tooling](https://github.com/earendil-works/pi/pull/12390)** — Closed same-day fork/tooling PR with no description; likely a contributor fork submission rather than a merge candidate.

4–10. No other PRs were updated in the window. The remaining notable issue closures (#12376–#12391) landed without associated PRs in this dataset, though several are clearly actionable upstream fixes worth watching.

## 5. Hot Discussions

No discussion data was provided for this period.

## 6. Feature Request Trends

- **Context observability**: #12377 requests a read-only `/context` inspector breaking down system prompt vs tools vs history, cache-miss cost, and distance to compaction — echoing the quantified complaints in #12165 and #12242.
- **Namespaced package resources**: #8834 proposes an opt-in `pi.namespace` field unifying skills and prompt templates under `<namespace>:<name>`.
- **Source-qualified tool collisions**: #12387 asks that duplicate extension tool names register as `<plugin>__<tool>` instead of failing the whole extension load.
- **Richer tool-control APIs**: #12388 wants `prepareArguments` to return a full tool result rather than an opaque error; #12385 wants conditional per-run aborts that report what was withdrawn.
- **Model catalog accuracy**: #12379 flags Anthropic 4.5 aliases mislabeled "(latest)" while newer models exist — a model-picker correctness issue.

## 7. Developer Pain Points

- **Context economics is the dominant theme.** Three separate issues (#12165, #12242, #12381) quantify context waste — searchTools bloat, unbounded compaction summaries, and a fixed ~13k summary budget — and there is now both a PR and a feature request aimed at visibility and control.
- **Automation friction**: headless mode hanging on connected MCP servers (#12238) breaks scripted/CI use of `pi -p`.
- **Silent truncation and misclassification**: error conditions are misinterpreted rather than surfaced — 429/5xx classified as overflow (#12382), mid-stream `finish_reason: "error"` never retried (#12206), and HTTP error codes obscured by pi-ai (#12376).
- **Ecosystem discoverability**: the npm search gap (#7885) meant new packages were effectively invisible for months, a serious drag on third-party adoption.
- **Session integrity edge cases**: resumed sessions losing tool access (#12383), duplicate tool names failing extension loads (#12387), and an ENOSPC-truncated write being glued onto a lost fragment (#12386) all erode trust in persistence.
- **Rendering correctness**: unclosed `$` corrupting bold spans (#12389) and stacked Kitty images collapsing to one anchor (#12384) are small but visible TUI regressions.

</details>

<details>
<summary><strong>Qwen Code</strong> — <a href="https://github.com/QwenLM/qwen-code">QwenLM/qwen-code</a></summary>

# Qwen Code Community Digest — 2026-11-22

## 1. Today's Highlights

Qwen Code shipped **v0.28.3** with a new Web Shell feature for explaining background tasks from composer chips, while release engineering continued to stabilize nightly builds and CI gates. CI reliability remains the dominant theme of the day: multiple long-running failure-tracking issues (some with 500+ comments) were updated, and several deflake PRs targeted the same flaky `qwen-serve-restart-recovery` test. Meanwhile, core contributors landed and reviewed a wave of token-management fixes (#18042, #18043, #18045) following a large PR (#17875) that merged before its review round completed.

## 2. Releases

**v0.28.3** (released in the last 24h)
- `feat(web-shell)`: Explain background tasks from the composer chips — [#17398](https://github.com/QwenLM/qwen-code/pull/17398)
- No known breaking changes.

A nightly build `v0.28.3-nightly.20261121.56ef346859` also appears in the changelog with CI stabilization commits (live review bot for manual re-review, managed-agent gate stabilization).

## 3. Hot Issues

1. **[#14724](https://github.com/QwenLM/qwen-code/issues/14724)** — Main CI failed: Managed Agent gate, no test identified. **524 comments**, open since 2026-10-19. The longest-running CI failure thread; the bot keeps re-tracking the same gate across commits. Signals a persistent blind spot in the Managed Agent gate's test identification logic.
2. **[#11680](https://github.com/QwenLM/qwen-code/issues/11680)** — Main CI failed: E2E Tests, 104 comments, updated 2026-11-22. First reported 2026-09-11; still unresolved after two months. The `sandbox:docker` E2E shard remains a recurring failure source.
3. **[#11678](https://github.com/QwenLM/qwen-code/issues/11678)** — Main CI failed: Qwen Code CI (Windows Node 22.x), 56 comments. Windows CI failures keep resurfacing; a `[autofix/in-progress]` label indicates an automated repair attempt is active.
4. **[#17934](https://github.com/QwenLM/qwen-code/issues/17934)** — E2E: `qwen-serve-restart-recovery.test.ts` flakiness after SIGKILL, 36 comments. This exact test appeared in **four separate issues/PRs today** (#17934, #18050, #18051, #18055), making it the single most actively deflaked test right now.
5. **[#14104](https://github.com/QwenLM/qwen-code/issues/14104)** — SDK Java: `HostedShellLifecycleRecoveryIT.publicDeletionRecoversOriginalResources` failures, 21 comments, `[autofix/approved]`. A long-running Java SDK failure with an approved automated fix — worth watching for closure.
6. **[#16091](https://github.com/QwenLM/qwen-code/issues/16091)** — macOS unit test: `bun-pty.node-bun.test.ts` 300-toggle flood byte-exactness, 18 comments. A concrete stress-test failure in the terminal PTY layer, relevant to anyone shipping interactive CLI features.
7. **[#17479](https://github.com/QwenLM/qwen-code/issues/17479)** — `qwen serve`: SSE exhausts listener cap and locks out `/health`; explicit `--port` silently duplicates daemons. Reported by @wenshao (a top contributor) from a real long-running deployment. Two compounding defects that make a daemon alive but unreachable.
8. **[#18042](https://github.com/QwenLM/qwen-code/issues/18042)** — `[priority/P1]` Post-merge regressions from #17875: media-strip drops the recovery handle, web_fetch success-return handle regressions. A rare documented case where a PR merged ~2 minutes after review landed, forcing post-merge repair tracking.
9. **[#15748](https://github.com/QwenLM/qwen-code/issues/15748)** — Subagent background task notifications only reach the top-level agent; can cause OOM crashes. A user-facing correctness bug in the multi-agent orchestration path, ready for human triage.
10. **[#12597](https://github.com/QwenLM/qwen-code/issues/12597)** — Feature request: a true "disable auto-compaction" switch. 5 comments, open since September, tagged `roadmap/context-performance` + `need-discussion`. A recurring pain point for users who want deterministic context control.

## 4. Key PR Progress

1. **[#18066](https://github.com/QwenLM/qwen-code/pull/18066)** — `feat(web-shell)`: Scope ChatSurface admission locks to the owning session and bind `loadOlder`. By @wenshao. Closes two switch-readiness items deferred from the daemon main-column switch slice.
2. **[#18064](https://github.com/QwenLM/qwen-code/pull/18064)** — `feat(verify-pr)`: Preflight execution approvals for maintainer-driven `/verify-pr` rounds. Makes host/VM selection explicit and validated before untrusted PR code runs — a supply-chain hardening step.
3. **[#18058](https://github.com/QwenLM/qwen-code/pull/18058)** — `refactor(managed-agent)`: De-hash identity columns with bounded `VARCHAR` and canonical refs. Replaces the managed-agent identity-hash key layer with reversible canonical references — a meaningful schema simplification.
4. **[#18054](https://github.com/QwenLM/qwen-code/pull/18054)** — `feat(web-shell)`: Pause task creation and show an overload strip in the sidebar. Surfaces the daemon's load-admission pause at the point of action; all creation entry points disabled during sustained overload.
5. **[#18045](https://github.com/QwenLM/qwen-code/pull/18045)** — `fix(core)`: Preserve recovery handles through response processing. Fixes microcompaction dropping recovery metadata for nested media, and stops raw page artifacts masquerading as generated summaries. Directly addresses #18042.
6. **[#17918](https://github.com/QwenLM/qwen-code/pull/17918)** — `feat(web-shell)`: Accept follow-up suggestions on touch composers. Adds a touch acceptance path where suggestions previously appeared only as dimmed placeholder text.
7. **[#18011](https://github.com/QwenLM/qwen-code/pull/18011)** — `fix(web-shell)`: Prioritize session titles across devices. Moves Pin and optional row actions into the More menu; on coarse-pointer devices those actions always stay in More.
8. **[#17910](https://github.com/QwenLM/qwen-code/pull/17910)** — `fix(core)`: Retain oversized transcript indexes in a bounded cache class (256 MiB LRU) instead of refusing admission on every request. A performance fix for large-session users.
9. **[#18022](https://github.com/QwenLM/qwen-code/pull/18022)** — `feat(cli)`: Attribute Managed Agent sessions to the managed telemetry channel. Adds a `managed` client-channel value so Managed Agent traffic is distinguishable from ordinary daemon traffic.
10. **[#18062](https://github.com/QwenLM/qwen-code/pull/18062)** — `feat(cli)`: Let `/theme <name>` take a theme name directly, matching `/effort` and `/output-style`. Community-authored by @Bndrwe, addressing issue #18061.

## 5. Hot Discussions

No Discussions data was provided in this dataset; this section is omitted.

## 6. Feature Request Trends

- **Context / token management control**: The strongest recurring theme. Requests include a true "disable auto-compaction" switch ([#12597](https://github.com/QwenLM/qwen-code/issues/12597)) and multiple token-management correctness fixes ([#18042](https://github.com/QwenLM/qwen-code/issues/18042), [#18043](https://github.com/QwenLM/qwen-code/issues/18043)) around microcompaction clearing persisted outputs.
- **Memory sharing across Git worktrees**: [#18030](https://github.com/QwenLM/qwen-code/issues/18030) asks that project auto-memory be shared between a workspace and its linked worktrees, rather than each worktree learning in isolation.
- **CLI command ergonomics**: Scratch-the-itch requests like `/theme <name>` argument support ([#18061](https://github.com/QwenLM/qwen-code/issues/18061)) show users want slash commands to behave uniformly.
- **Mobile Web Shell parity**: Multiple PRs today (#17883, #17918, #18011) target iOS Safari keyboard overlap, touch suggestion acceptance, and cross-device session-title layout — mobile UX is an active investment area.
- **Windows / UNC path correctness**: [#18059](https://github.com/QwenLM/qwen-code/issues/18059) — "Always Allow" on UNC/WSL paths saves rules that never match; a class of permission-path normalization bugs unique to Windows.
- **Documentation accuracy**: [#16925](https://github.com/QwenLM/qwen-code/issues/16925) flags that MCP docs still claim a restart is required, when `mcpServers` hot-reload.

## 7. Developer Pain Points

- **CI flakiness dominates contributor attention**: The top 10 issues by comment count are almost entirely bot-filed CI failures, several exceeding 50–500 comments and spanning months (#14724, #11680, #11678). One test — `qwen-serve-restart-recovery.test.ts` — generated four separate issues/PRs in a single day, indicating the deflake loop itself is creating churn.
- **Self-hosted runner infrastructure fragility**: [#17037](https://github.com/QwenLM/qwen-code/issues/17037) documented `/tmp` inode exhaustion on `hz3` hosts from leftover verify work trees holding 92% of the tmpfs, causing jobs to fail before running. #18040 and #18065 are direct hardening responses.
- **Post-merge review gaps**: [#18042](https://github.com/QwenLM/qwen-code/issues/18042) explicitly records that #17875 merged ~2 minutes after review completed, leaving confirmed regressions with no branch to repair on. Contributors are asking for better merge gating.
- **Cross-platform path handling**: Windows UNC/WSL permission rules (#18059) and Windows CI failures (#11678) point to a persistent gap in Windows-specific testing and path normalization.
- **Daemon reliability under load**: [#17479](https://github.com/QwenLM/qwen-code/issues/17479) documents a `qwen serve` daemon that is "alive but completely unreachable" due to SSE listener-cap exhaustion, plus silent duplicate daemons on explicit `--port`.

---

*Note: GitHub comment counts and `+1` reactions were empty/zero across the provided dataset; "community reaction" above is inferred from comment volume, labels, and cross-issue references.*

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*