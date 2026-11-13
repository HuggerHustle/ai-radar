# AI CLI Tools Community Digest 2026-11-13

> Generated: 2026-11-13 01:46 UTC | Tools covered: 7

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

# Cross-Tool Community Comparison Report — 2026-11-13

**Scope:** Claude Code · OpenAI Codex · Gemini CLI · GitHub Copilot CLI · OpenCode · Pi · Qwen Code

---

## 1. Ecosystem Overview

The AI CLI ecosystem is now a mature, multi-polar market with at least seven credible contenders, each iterating on a weekly cadence. The competitive frontier has shifted from raw model capability to **agent runtime robustness**: subagent lifecycle, checkpointing, sandboxing, tool dispatch correctness, and auth/MCP plumbing now dominate issue trackers. Simultaneously, a **convergence on agentic architecture** is visible — Code Mode (Claude Code), event-driven loop kernels (Qwen Code), the Advisor dual-model tool (OpenCode), and agent-tree suspension (Codex) all point toward the same destination: multi-agent, resumable, tool-rich sessions. Meanwhile, platform-specific friction (Windows, WSL, Wayland, tmux/screen, headless Linux) has become a first-order source of user pain. Underneath the polish, every project is fighting the same physics: **context budgets, MCP authentication, and resource leaks in long-lived processes.**

---

## 2. Activity Comparison

| Tool | Issues (hot/active today) | PRs (updated 24h) | Discussions | Release Status (24h) |
|---|---|---|---|---|
| **Claude Code** | 10+ highlighted; heavy filing | 1 open (stale since July) | Omitted (no data provided) | ✅ v2.1.323 (Code Mode, plugin engines) |
| **OpenAI Codex** | 10 highlighted + 3 closed | ~13 closed (all merged/resolved) | ✅ 8 active (Ideas, Q&A) | ✅ 2 alphas (rust-v0.170.0-alpha.3/.4) |
| **Gemini CLI** | 10 highlighted | 10 active (2 closed) | Omitted (no data provided) | ❌ None |
| **GitHub Copilot CLI** | 10 highlighted | **0** | Omitted (no data provided) | ✅ v1.0.110 (password helper, Entra polish) |
| **OpenCode** | 10 highlighted | ~11 active (1 closed) | Omitted (no data provided) | ❌ None |
| **Pi** | 10 highlighted (many closing) | 10 (mostly closed) | Omitted (no data provided) | ❌ None |
| **Qwen Code** | 10 highlighted | ~10 active | Omitted (no data provided) | ✅ 5 releases (v0.27.3 + v1.0.0-preview.1 + SDK + Desktop + nightly) |

**Reading the table:** Copilot CLI's **zero-PR day** is stark given its large user base — community momentum is entirely issue-side this cycle. Codex shows the most aggressive *merge* velocity (~13 PRs closed in 24h), while Qwen Code shows the most aggressive *release* velocity (five artifacts in one day, including the 1.0 preview). Claude Code's near-total absence of PR activity (1 stale PR) is unusual for a repo of its scale and suggests either a maintainer-gated contribution model or backlog pressure. **Note:** Discussions sections marked "Omitted" reflect the absence of data in the source feeds, not necessarily zero activity; absence of a Discussions channel in a repo is a configuration fact, not evidence of inactivity.

---

## 3. Shared Feature Directions

Five requirements recurring across **three or more** tool communities:

**1. Session/workspace continuity & resumability**
- Codex: workspace-scoped chats (#25319, top-voted), thread-input preservation across resumes (#61216), safe checkpointing at usage limits (#60447)
- Claude Code: mid-session re-login killing background subagents (#108585)
- Pi: `/resume` selection stability (#12111), kill-on-quit zombie processes (#12107)
- Qwen Code: resume interrupted turns on session load (#16528)
- OpenCode: "Advisor" and cross-session hooks (#63637, #63590)

**2. Safe checkpointing / graceful degradation under resource limits**
- Codex: terminate without safe checkpoint (#60447, explicit "19 files modified, tests passing, then killed" scenario)
- Pi: `ENOSPC`/`EACCES` on `/tmp` crashing whole process (#10585)
- Copilot CLI: OOM crashes in long sessions (#5435), event-store exhaustion (#4467)
- OpenCode: long turns dying mid-stream with ECONNRESET (#60940)
- Qwen Code: ACP child idle-unresponsive after network calls (#17040)

**3. MCP authentication & lifecycle maturity**
- Copilot CLI: Entra broker cache (#5236), Google Workspace OAuth (#4606), OAuth in delegated children (#5437)
- Pi: Google MCP refresh tokens requiring `access_type=offline` (#10563)
- Codex: SSPI/OAuth metadata handling (#47756), MCP subagent process leaks (#25015)
- Claude Code: MCP server recompilation tax (#109426)
- OpenCode: MCP `opencode_console` silent 403 reconnects (#59806)

**4. Subagent reliability & permission propagation**
- Gemini CLI: subagent MAX_TURNS reported as success (#22323), generalist agent hangs (#21409), Browser Agent ignoring settings (#22267)
- Copilot CLI: subagents refuse `/tmp` writes despite allow-all (#5441), delegated children can't auth MCP (#5437)
- Claude Code: idle teammate stuck in Stop hook's `background_tasks` (#109427)
- Codex: agent-tree suspension/recovery design (#61198)

**5. Observability of agent state and tool outputs**
- OpenCode: shell exit code/elapsed time/log path exposure (#63647), stale-model footer (#63506)
- Gemini CLI: subagent trajectories in `/chat share` (#22598)
- Qwen Code: machine-readable HTTP statuses in headless errors (#16686), failed `todo_write` surfacing (#16679)
- Copilot CLI: misleading auth-failure messages masking structured errors (#5436)

---

## 4. Differentiation Analysis

| Dimension | Claude Code | Codex | Gemini CLI | Copilot CLI | OpenCode | Pi | Qwen Code |
|---|---|---|---|---|---|---|---|
| **Primary focus** | Agentic experimentation (Code Mode), desktop/cloud parity | Enterprise Windows + VS Code, Rust core | Subagent orchestration, AST tooling | GitHub/Microsoft ecosystem, MDM fleets | Plugin/API stability, V2 migration | Terminal correctness, minimal footprint | Unified agent loop, subscription integration |
| **Target user** | Power devs, org fleet admins | Windows enterprise, Rust-tooling contributors | Google Cloud + Pro subscribers | GitHub Enterprise, regulated orgs | Plugin authors, V2 early adopters | Multiplexer/headless/SSH users | Qwen subscription users, CI/headless |
| **Technical approach** | Tool-call → JS Code Mode (opt-in) | Rust workspace (1.99.1), SPIFFE identity, seccomp | Zero-dep OS sandboxing, Gemini 3 bash fluency | Node CLI, ACP mode, Entra broker | Multi-model "Advisor", hook metadata propagation | Native TUI, XDG-compliant, provider adapters | Event-driven `query()` kernel, `experimental.unifiedAgentLoop` |
| **Contribution model** | Maintainer-gated (1 stale PR) | Bot-merged at scale (copyberry) | Maintainer-led workstreams | Low PR activity | High contributor churn, rapid reverts | Community contributor-led (petrroll, acmerfight) | Rapid release + tracking issues |
| **Distinguishing bet** | Code Mode as architectural experiment | Windows-first enterprise hardening | Subagent self-awareness & habit | Integration depth with GitHub | Plugin surface stability pre-GA | Silent-correction correctness | 1.0 loop consolidation |

**Key contrasts:**
- **Claude Code and Codex** are the two most "enterprise-pull" tools but diverge sharply: Codex is *Windows-first engineering* (Computer Use, WSL, AppX), Claude Code is *auth-surface-first* (passkeys, WebAuthn, cross-surface parity).
- **Gemini CLI and Qwen Code** both run formalized **tracking-issue roadmaps** (P1 kernels, unified loops), unlike the more chaotic forums of OpenCode and Pi.
- **Pi and Copilot CLI** are the two with the *most terminal-native focus* — Pi on multiplexer/XDG correctness, Copilot on masked-dialog and screen-reader accessibility.
- **OpenCode** is the only project with the **Advisor dual-model** pattern in-window — a genuinely distinct architectural direction versus single-model competitors.

---

## 5. Community Momentum & Maturity

**Highest raw engagement (upvote/comment leaders):**
- **Claude Code:** #84862 passkey request at **184 👍** — highest single-item endorsement in the entire dataset, indicating a large, motivated, and organized user base.
- **OpenAI Codex:** #25319 VS Code workspace scoping at **134 👍 / 60 comments** — the most-discussed single issue across all tools.
- **Pi:** #2870 XDG compliance at **75 👍** — a standards-compliance win with outsized community resonance.
- **Codex Discussions:** 8 concurrent threads (collab workspaces, agent handoff protocols, MCP service launches) — the **only tool with a thriving Discussions channel** in this window, suggesting a more mature community-governance layer than competitors.

**Rapid-release iterators:**
- **Qwen Code** — five artifacts in 24h including a 1.0 preview; iteration speed is the highest in the cohort, albeit with CI instability as the visible cost.
- **Codex** — 13 merged PRs in 24h, toolchain upgrades, security fixes (seccomp x32), enterprise identity (SPIFFE).
- **Pi** — large closed-PR wave led by named contributors; highest *individual* leverage (PR #12109 closing five issues at once).

**Momentum concerns:**
- **Copilot CLI** — zero PRs, auth-dominated issue tracker, no Discussions activity. Momentum is entirely consumption-side; contributor pipeline appears thin or gated.
- **Claude Code** — one stale PR open since July, issue-dominated tracker, and a cluster of **auth regressions** that are likely suppressing trust. The community is highly engaged but notably *not* contributing code — a signal about contribution friction.
- **Gemini CLI** — no releases, maintainer-led design threads, and a recurring auth loop blocking *paying Pro users* (#29267). Steady but not accelerating.

**Maturity ranking (colloquial):**
1. **Codex** — mature process, high merge throughput, enterprise-grade fixes, active Discussions
2. **Claude Code** — mature product, but contribution model and auth regressions are friction points
3. **Qwen Code** — fast-maturing 1.x, strong roadmap clarity, but CI debt
4. **Gemini CLI** — mid-maturity, maintainer-driven, subagent reliability still forming
5. **Copilot CLI** — enterprise-ready surface, but community/contributor layer underdeveloped
6. **OpenCode** — industrious but pre-GA V2; correctness churn visible
7. **Pi** — small but highly focused and responsive; quality-per-contributor is high

---

## 6. Trend Signals

**For decision-makers evaluating tooling:**

1. **Agent runtimes are now infrastructure, and infrastructure reliability is the buying criterion.** Every tool's top-priority bugs are lifecycle bugs (subagent hangs, mid-task termination, resource leaks), not model-quality bugs. Budget for runtime reliability evaluation, not just token pricing.

2. **MCP auth is the new integration tax.** Five of seven tools report MCP authentication pain spanning Windows (Entra), Google (OAuth), macOS (keychain), and delegated subagents. **Expect to invest in MCP auth plumbing regardless of tool choice**, and prioritize tools with delegated-agent auth propagation (currently weak across the board).

3. **Workspace/session scoping is a cross-tool gap, not a UX detail.** Codex's most-voted issue is scoping chats to workspaces; OpenCode has hooks for it; Claude Code's cloud sessions lack image attach. **Treat session-scope guarantees as a procurement requirement for multi-repo orgs.**

4. **Platform coverage is uneven and quantifiably so.** Windows is roughest in Codex (Computer Use, WSL, reconnect). Wayland is rough in Gemini CLI and OpenCode. Multiplexers (tmux/screen) are rough in Pi. **Match tool choice to your developers' actual terminal environments** — the mainstream marketing sites won't tell you this.

**For developers building on these tools:**

5. **Plugin/extension APIs are still settling.** OpenCode's explicit "stabilize V2 plugin API pre-GA" trajectory, Claude Code's new `engines["claude-code"]` constraint, and Pi's request for lightweight extension subpath exports (#11446) all indicate the extension layer is in flux. **Pin to specific versions and budget for migration.**

6. **Structured tool output is becoming a first-class contract.** OpenCode (#63647), Qwen Code (#16686), and Codex (#61222 trace schema v3) are all formalizing tool outputs (exit codes, status, payload schemas). **Write for the machine-readable form, not the human string.**

7. **Dual-model and multi-model reasoning is arriving.** OpenCode's Advisor tool (#63637) — where the active model consults a secondary model — is the clearest signal yet that the next architectural frontier is *composable reasoning*, not just bigger single models. Watch this pattern; if it ships and sticks, competitors will follow.

8. **Subscription/usage-limit thinking is shifting from "metering" to "degradation contracts."** Codex (#60447), Qwen Code (#17038), and OpenCode (#63568 opaque quota) all surface the same emerging user expectation: **a session that hits a limit should degrade gracefully, not die mid-task.** Tools that implement checkpoint-then-suspend will win trust in long-horizon work.

9. **Primary-source signal > marketing.** The 184-👍 passkey request, 134-👍 VS Code scoping, and 75-👍 XDG compliance tell you what users *actually* need more reliably than any roadmap blog. **Monitor issue upvote velocity as a leading indicator of the next feature each vendor ships.**

---

*Report compiled from 2026-11-13 community digests across seven AI CLI projects. Upvote and comment counts reflect the snapshot at generation time and may have moved.*

---

## Per-Tool Reports

<details>
<summary><strong>Claude Code</strong> — <a href="https://github.com/anthropics/claude-code">anthropics/claude-code</a></summary>

## Claude Code Skills Highlights

> Source: [anthropics/skills](https://github.com/anthropics/skills)

# Claude Code Skills — Community Highlights Report
*Data snapshot: 2026-11-13 · Source: github.com/anthropics/skills*

---

## 1. Top Skills Ranking (Most-Discussed PRs)

Note: the PR dataset lists `Comments: undefined` for all entries, so ranking below is inferred from cross-referenced issue activity, update frequency, and thematic prominence.

| # | Skill / PR | Functionality | Discussion Highlights | Status |
|---|---|---|---|---|
| 1 | **mcp-builder fix** ([#1742](https://github.com/anthropics/skills/pull/1742)) | Updates MCP connection scripts for `mcp>=2.0.0` (`streamable_http_client` rename, custom headers via `create_mcp_http_client`) | Fixes #1668; breaking API change in MCP SDK affecting all MCP-based skills | OPEN |
| 2 | **skill-creator eval isolation** ([#1298](https://github.com/anthropics/skills/pull/1298)) | Isolates trigger evals, fixes Windows subprocess handling, handles runtime failures | Ties directly to high-traffic Issue #1352 (false-negative trigger rates with parallel workers) | OPEN |
| 3 | **notion-spec-to-implementation + quantitative-resume-auditor** ([#1245](https://github.com/anthropics/skills/pull/1245)) | Converts product specs into Notion tasks; audits resumes quantitatively | Dual-skill PR; long-lived (Jun–Oct), spans PM + HR workflows | OPEN |
| 4 | **webapp-testing: remove `shell=True`** ([#1980](https://github.com/anthropics/skills/pull/1980)) | Eliminates command-injection risk (CWE-78) in `with_server.py` | Security hardening of an official testing skill | OPEN |
| 5 | **docx: LibreOffice timeout handling** ([#1792](https://github.com/anthropics/skills/pull/1792)) | Reports timeouts as errors; verifies output has no revision marks | Part of a cluster of docx reliability fixes (#1734, #2018) | OPEN |
| 6 | **pyxel retro game dev** ([#525](https://github.com/anthropics/skills/pull/525)) | Create/debug/verify retro Python games via Pyxel | Oldest active PR (Mar–Nov); sustained community interest in creative-coding skills | OPEN |
| 7 | **proofcore-contract-auditor** ([#1771](https://github.com/anthropics/skills/pull/1771)) | Static analysis of Solidity/Rust contracts + TON blockchain notarization | First Web3/blockchain skill proposal in the top set | OPEN |
| 8 | **md2video-audio** ([#1703](https://github.com/anthropics/skills/pull/1703)) | Compiles Markdown → MP4 videos with TTS voiceovers via Marp | Zero-cost media-generation pipeline; expands skill scope beyond text | OPEN |

**Also notable:** `document-typography` ([#514](https://github.com/anthropics/skills/pull/514)), `scnet-hpc` ([#1615](https://github.com/anthropics/skills/pull/1615)), and a cluster of `skill-creator` correctness fixes ([#1681](https://github.com/anthropics/skills/pull/1681), [#1997](https://github.com/anthropics/skills/pull/1997)).

---

## 2. Community Demand Trends (from Issues)

- **Trust & namespace security** — Issue [#492](https://github.com/anthropics/skills/issues/492) (46 comments) is the single most-discussed issue: community skills shipping under the `anthropic/` namespace create a trust-boundary abuse risk.
- **Org-wide skill sharing** — Issue [#228](https://github.com/anthropics/skills/issues/228) (17 comments, 8 👍) requests a shared skill library / direct share links instead of manual `.skill` file exchange.
- **Eval/trigger reliability** — Issues [#556](https://github.com/anthropics/skills/issues/556) (13 comments) and [#1352](https://github.com/anthropics/skills/issues/1352) (6 comments) report that `run_eval.py` yields 0% or false-negative trigger rates — a systemic quality problem for skill authors.
- **Context-window economics** — Issue [#1487](https://github.com/anthropics/skills/issues/1487): `claude-api` skill eagerly injects ~156k tokens in one tool call.
- **Plugin duplication** — Issue [#189](https://github.com/anthropics/skills/issues/189) (9 👍): `document-skills` and `example-skills` install identical content.
- **Governance & quality pipelines** — Issues [#412](https://github.com/anthropics/skills/issues/412) (agent-governance) and [#1385](https://github.com/anthropics/skills/issues/1385) (Reasoning Quality Gate Pipeline) signal demand for safety/verification-oriented skills.
- **Persistent memory** — Issue [#1329](https://github.com/anthropics/skills/issues/1329) proposes `compact-memory` (symbolic notation for agent state).

**Emerging directions:** workflow automation (spec→tasks), document QA (typography, orphaned comments), security/governance, media generation, and eval tooling.

---

## 3. High-Potential Pending Skills

These active PRs (recently updated, still OPEN) are the most likely to land soon:

- **mcp-builder MCP v2 compatibility** — [#1742](https://github.com/anthropics/skills/pull/1742) · updated 2026-10-08
- **notion-spec-to-implementation + quantitative-resume-auditor** — [#1245](https://github.com/anthropics/skills/pull/1245) · updated 2026-10-15
- **webapp-testing shell=True removal** — [#1980](https://github.com/anthropics/skills/pull/1980) · updated 2026-11-01
- **docx LibreOffice timeout fix** — [#1792](https://github.com/anthropics/skills/pull/1792) · updated 2026-11-01
- **xlsx external-links resolution** — [#2019](https://github.com/anthropics/skills/pull/2019) · updated 2026-11-03
- **claude-api docs sync (pause_turn)** — [#1950](https://github.com/anthropics/skills/pull/1950) · updated 2026-11-10
- **pyxel retro game skill** — [#525](https://github.com/anthropics/skills/pull/525) · updated 2026-11-01 (long-running but persistent)

---

## 4. Skills Ecosystem Insight

> **The community's most concentrated demand is not for new capabilities but for reliability, security, and trust infrastructure around existing skills** — fixing eval/trigger correctness, hardening scripts against injection and context blow-up, and resolving namespace/identity ambiguity so users can safely delegate to community-authored skills.

---

# Claude Code Community Digest — 2026-11-13

## 1. Today's Highlights

Anthropic shipped **v2.1.323**, introducing experimental **Code Mode** (Claude writes JavaScript to call its own tools) and a new `engines["claude-code"]` constraint field for plugin compatibility. Community attention is split between a highly-upvoted **passkey/WebAuthn** authentication request (184 👍) and a cluster of **auth-related regressions** — forced mid-session re-login killing background subagents, Android Play Integrity sign-in failures, and a help-form redirect loop. A steady stream of sandbox, hooks, and MCP bugs continues to dominate fresh issue filings.

---

## 2. Releases

**v2.1.323**
- **Code Mode (experimental, opt-in):** Claude writes JavaScript to invoke its tools instead of using the standard tool-call path. Can be enabled/disabled per-organization via the docs at `code.claude.com/docs/en/code-mode`. This is a notable architectural experiment worth watching for agentic workflows.
- **Plugin engine constraints:** `plugin.json` now supports `engines["claude-code"]`, allowing plugins to declare a required Claude Code version; plugins outside their stated range are now handled (rejected/flagged).

---

## 3. Hot Issues

| # | Issue | Why it matters | Reaction |
|---|-------|----------------|----------|
| [#84862](https://github.com/anthropics/claude-code/issues/84862) | **Passkey (WebAuthn) sign-in across every surface** | The single most-upvoted open request; users want passwordless auth everywhere Claude is available. | 37 comments, **184 👍** |
| [#105770](https://github.com/anthropics/claude-code/issues/105770) | Android sign-in fails with Play Integrity "unverified" (HTTP 400 on `/auth/verify_google_mobile`) | Blocks rooted/unlocked-bootloader users entirely — a growing, legitimate developer segment. | 13 comments, 10 👍 |
| [#94675](https://github.com/anthropics/claude-code/issues/94675) | `UserPromptSubmit` fires for system-injected messages with no `prompt_source`/`is_meta` | **Security surface:** hooks can't distinguish typed input from injected prompts (cross-session SendMessage, task notifications, cron). Prompt-injection risk. | 9 comments |
| [#108726](https://github.com/anthropics/claude-code/issues/108726) | `DISABLE_TELEMETRY=1` hides Fable 5.2 from `/model` picker | Privacy-conscious users silently lose model access because feature flags are skipped. | 9 comments, 23 👍 |
| [#108585](https://github.com/anthropics/claude-code/issues/108585) | Mandatory re-login mid-session kills background subagents | Destroys in-flight multi-agent work; forced re-login during long runs is a serious reliability issue. | 5 comments |
| [#97926](https://github.com/anthropics/claude-code/issues/97926) | Cowork sessions missing `list_repos`/`add_repo` GitHub tools on one account | Inconsistent GitHub App behavior between accounts breaks private-repo workflows. | 6 comments |
| [#92684](https://github.com/anthropics/claude-code/issues/92684) | `sandbox.filesystem.denyWrite` silently ignores mid-path wildcards (Linux) | Security rules fail silently — users believe they are protected when they are not. | 3 comments |
| [#109393](https://github.com/anthropics/claude-code/issues/109393) | `--json-schema` ignored under `--agent` when `tools:` is restricted | Breaks headless/CI pipelines relying on structured output. | 1 comment |
| [#109426](https://github.com/anthropics/claude-code/issues/109426) | Desktop app sets `PYTHONDONTWRITEBYTECODE=1`; plugin hooks & MCP servers recompile Python every run | Persistent performance tax on every Python-based plugin/hook invocation. | New today |
| [#109427](https://github.com/anthropics/claude-code/issues/109427) | Idle teammate remains in Stop hook's `background_tasks` forever | Hook authors receive stale agent state, complicating orchestration logic. | New today |

Also notable: [#106049](https://github.com/anthropics/claude-code/issues/106049) (cloud sessions can't attach images to PRs — GitHub proxy rejects all GraphQL), [#108577](https://github.com/anthropics/claude-code/issues/108577) (expose voice dictation to Agent SDK), [#109414](https://github.com/anthropics/claude-code/issues/109414) (`claude stop --all` bulk command).

---

## 4. Key PR Progress

Only **one** PR was updated in the last 24h:

| PR | Description |
|----|-------------|
| [#81672](https://github.com/anthropics/claude-code/pull/81672) | **`fix(hookify)` — make package import independent of install directory name.** The `hookify` plugin currently puts `os.path.dirname(CLAUDE_PLUGIN_ROOT)` on `sys.path` and relies on the directory being named exactly `hookify`. Marketplace installs use different directory names, so the import fails. This fix removes that fragile assumption. Addresses #69665 and #81448. Open since July; still unmerged. |

No other PRs were updated in the window — activity this cycle is overwhelmingly issue-driven.

---

## 5. Hot Discussions

No Discussion data was provided for this window. Section omitted.

---

## 6. Feature Request Trends

Distilled from open enhancement requests:

1. **Passwordless / modern auth** — Passkey/WebAuthn across all surfaces (#84862) is the dominant ask by vote count; users want auth parity between web, desktop, CLI, and mobile.
2. **Bulk & programmatic agent control** — `claude stop --all` for background agents (#109414) mirrors the existing `respawn --all`; demand for batch lifecycle management of `--bg` sessions.
3. **Agent SDK surface expansion** — Expose voice dictation to Agent SDK / stream-json hosts (#108577) so third-party hosts reach feature parity with the terminal UI and VS Code.
4. **UI personalization** — Custom icons for MCP servers (#108788) and granular spellcheck/autocorrect settings with language selection (#108885) point to a desire for finer desktop polish.
5. **Desktop session continuity** — Keep Remote Control enabled across app restarts/auto-updates (#109432) and restore the current git branch display in Code tab sessions (#109412).
6. **Cloud/web parity** — Image attachments for PRs and issues in cloud sessions (#106049) reflects frustration with the restrictive GitHub proxy.

---

## 7. Developer Pain Points

Recurring frustrations across the issue tracker:

- **Auth fragility is the #1 theme.** Forced mid-session re-logins (#108585), Android Play Integrity rejections (#105770), identity-verification redirect loops (#108830), and the lack of passkeys (#84862) collectively describe an authentication layer that interrupts work and blocks entire user segments.
- **Safety/security features failing silently.** `sandbox.filesystem.denyWrite` ignoring mid-path wildcards (#92684) and feature flags being dropped under `DISABLE_TELEMETRY` (#108726) both give users a false sense of configuration — dangerous in security-sensitive setups.
- **Hooks and agent lifecycle are hard to reason about.** `UserPromptSubmit` firing for injected messages (#94675), idle teammates sticking in `background_tasks` (#109427), and `/btw` side-chat context never merging into the main session (#108777) show the agent/hook model has ambiguous state boundaries.
- **Environment pollution from the desktop app.** `PYTHONDONTWRITEBYTECODE=1` (#109426) is a self-inflicted performance regression affecting every Python plugin and MCP server.
- **Inconsistent Windows/Git Bash behavior.** `--json-schema` being ignored under restricted `--agent` tool sets (#109393) and TUI paste re-inserting deleted content (#109434) suggest cross-platform testing gaps.
- **GitHub integration reliability.** Cowork tool availability differing by account (#97926), cloud-session GraphQL rejections (#106049), and repo-connection failures (#109406) make CI-scale automation brittle.

---

*Generated from github.com/anthropics/claude-code activity window ending 2026-11-13.*

</details>

<details>
<summary><strong>OpenAI Codex</strong> — <a href="https://github.com/openai/codex">openai/codex</a></summary>

# OpenAI Codex Community Digest — 2026-11-13

## 1. Today's Highlights

Two new `rust-v0.170.0-alpha` releases landed, signaling continued churn in the Rust CLI/core toolchain as the team preps 0.170.0. Issue traffic remains dominated by **Windows-specific regressions** (Computer Use UI lag, WSL startup policy, policy/approval inconsistencies) and by a major VS Code extension feature request (#25319) now at **134 👍 and 60 comments** — the single most-supported open ask in this batch. Meanwhile, a large merged PR wave (#61198–#61227) focused on TUI status rendering, agent-tree suspension/recovery, rollout trace storage, and Rust toolchain upgrades to 1.99.1.

---

## 2. Releases

- **[rust-v0.170.0-alpha.4](https://github.com/openai/codex/releases)** — alpha bump, no detailed changelog in release notes.
- **[rust-v0.170.0-alpha.3](https://github.com/openai/codex/releases)** — previous alpha in the same 0.170.0 line.

Both are pre-release tags; no stable changelog entries were provided.

---

## 3. Hot Issues

1. **[#25319 — Scope Codex VS Code chats to the current workspace/project](https://github.com/openai/codex/issues/25319)** *(OPEN, 60 comments, 134 👍)* — The highest-signal open request: chat/thread history in the VS Code extension isn't scoped per workspace. Community reaction is strong and sustained; opened after maintainer guidance to file fresh.
2. **[#57101 — Windows Computer Use: capture access & yellow border persist after screenshot turn](https://github.com/openai/codex/issues/57101)** *(OPEN, 24 comments)* — Desktop capture overlay not released after a turn completes — privacy/UX concern on Windows.
3. **[#56941 — Windows Computer Use causes system-wide UI lag until `codex-computer-use.exe` is killed](https://github.com/openai/codex/issues/56941)** *(OPEN, 24 comments)* — Severe performance regression affecting the whole OS, not just Codex.
4. **[#47511 — Missing git commit/push button in Codex desktop app](https://github.com/openai/codex/issues/47511)** *(OPEN, 20 comments, 49 👍)* — Regression from 26.917.51856; high 👍 despite low comment count — widely felt.
5. **[#25015 — App-server leaks MCP process stacks for subagents (Linux)](https://github.com/openai/codex/issues/25015)** *(OPEN, 19 comments)* — Long-lived memory/process growth on Linux; tagged as a Papercut.
6. **[#59546 — Built-in automation restriction blocks monitoring tasks in external web systems](https://github.com/openai/codex/issues/59546)** *(OPEN, 15 comments, 19 👍)* — Direct conflict between automation guardrails and documented Scheduled tasks behavior.
7. **[#59931 — Windows Desktop does not auto-connect enabled SSH host after restart](https://github.com/openai/codex/issues/59931)** *(OPEN, 14 comments)* — Remote workflow friction on Windows, reproduced across two devices.
8. **[#23037 — Remote SSH fails when server requires keyboard-interactive/PAM after public-key auth](https://github.com/openai/codex/issues/23037)** *(OPEN, 11 comments, 9 👍)* — Blocks enterprise SSH setups using layered auth.
9. **[#60530 — GPT-6.1 Sol usage limits depleting much faster than before](https://github.com/openai/codex/issues/60530)** *(OPEN, 7 comments)* — Rate-limit regression concern; early but potentially high-impact.
10. **[#60447 — Codex should not terminate active tasks without a safe checkpoint at usage limits](https://github.com/openai/codex/issues/60447)** *(OPEN, enhancement)* — Concrete scenario: 19 files modified, tests passing, then killed mid-task. Strong candidate for a checkpointing feature.

Also closed today: **#29223** (fresh sessions missing `codex_app` thread tools), **#61217** (`codex exec` connectivity with custom providers), **#60493** (npm launcher dropped repeated SIGTERM) — all resolved or superseded by PRs below.

---

## 4. Key PR Progress

All PRs below are CLOSED (merged or resolved) in the last 24h, mostly via `copyberry[bot]`.

1. **[#61227 — Include Win32 error codes in MXC process launch failures](https://github.com/openai/codex/pull/61227)** — Better native diagnostics on Windows process launch failures.
2. **[#61224 — Include AppX event IDs in Windows runtime registration errors](https://github.com/openai/codex/pull/61224)** — Correlates MSIX deployment failures with Windows event log IDs.
3. **[#61222 — Store rollout trace payloads in compressed shards](https://github.com/openai/codex/pull/61222)** — Trace schema v3: Zstandard-sharded payloads, new `PayloadReader`, HTTP body capture for replay.
4. **[#61221 — Forward repeated signals through the npm wrapper](https://github.com/openai/codex/pull/61221)** — Fixes #60493; repeated SIGTERM/SIGINT/SIGHUP now reach the child for graceful drain.
5. **[#61219 — Hide TUI status details for read-only history](https://github.com/openai/codex/pull/61219)** — Cleaner UX when viewing saved/unavailable threads.
6. **[#61216 — Preserve thread input across TUI session resumes](https://github.com/openai/codex/pull/61216)** — Drafts, queued follow-ups, and retries stay bound to their originating thread.
7. **[#61207 — SPIFFE JWT-SVID workload identity support](https://github.com/openai/codex/pull/61207)** — New `OPENAI_IDENTITY_TOKEN_SOURCE=spiffe` for Unix workloads; enterprise identity integration.
8. **[#61206 — Enforce Linux seccomp restrictions for x32 syscalls](https://github.com/openai/codex/pull/61206)** — Security fix: closes an x32 ABI sandbox-escape gap (shares x86-64 audit arch).
9. **[#61205 — Upgrade Rust toolchain to 1.99.1](https://github.com/openai/codex/pull/61205)** — Workspace, Bazel, CI, and Windows setup bumped from 1.95.0; code adapted to new Clippy lints.
10. **[#61198 — Graceful agent-tree suspension and recovery](https://github.com/openai/codex/pull/61198)** — Adds `ThreadManager::suspend_agent_tree` to preserve unfinished turns/child results across teardown.

Also notable: **#61220** (dedupe Apps tool listings), **#61212/#61211** (persistent TUI status line provider config), **#61199** (rollout trace same-binary replay contract).

---

## 5. Hot Discussions

### Ideas / Show and tell
- **[#61174 — Commonly: shared pod where each teammate's Codex joins from their own Mac](https://github.com/openai/codex/discussions/61174)** — Apache-2.0 collaborative workspace where agents stay local but share conversation, task board, and files.
- **[#55082 — estafeta: handing a coding project from Codex to the next agent](https://github.com/openai/codex/discussions/55082)** — Session handoff protocol (`session-end` / `session-start`) across terminal agents.
- **[#59147 — SnipToss: annotate images/videos Codex made, hand notes back as files](https://github.com/openai/codex/discussions/59147)** — Visual feedback loop for generated media.
- **[#61058 — 1ToolRing: live Google/Maps/Amazon data via remote MCP server](https://github.com/openai/codex/discussions/61058)** — Paid MCP service, per-call pricing, disclosure included.
- **[#61049 — TokenWatch: usage/reset dashboard for Codex + Claude (iOS/Android)](https://github.com/openai/codex/discussions/61049)** — Free through Nov 16; solves the "check usage in terminal" annoyance.
- **[#61030 — Mons beta: continue a Codex CLI session across computer/iPhone/iPad](https://github.com/openai/codex/discussions/61030)** — Persistent terminal session accessible from mobile clients.
- **[#55013 — CSV Handoff Kit: browser CSV→XLSX demo](https://github.com/openai/codex/discussions/55013)** — Niche but clean example of AI-assisted small tooling.

### Q&A
- **[#61177 — Can app-server verify a fresh thread's inputs before the first turn?](https://github.com/openai/codex/discussions/61177)** — Requests an API to confirm which instruction-file bytes were loaded and in what order before `thread/start` sends the first message.

---

## 6. Feature Request Trends

- **Workspace/project scoping**: Chat and thread history should be bound to the current workspace/project (#25319) — the dominant ask.
- **Safe checkpointing at usage limits**: Don't kill in-flight multi-file work without a recoverable state (#60447).
- **Per-message model & reasoning-effort controls**: Especially for queued messages (#50383).
- **Terminal/TUI UX polish**: Mouse-selectable warnings panel (#47561), status-line provider selection (#61211), cleaner read-only history (#61219).
- **Session continuity across surfaces**: Web/phone/host handoffs (#61030, #55082, #61174) and cross-session input preservation (#61216).
- **Remote & enterprise auth robustness**: SSH auto-reconnect (#59931), keyboard-interactive/PAM support (#23037), SPIFFE workload identity (#61207).
- **MCP ecosystem maturation**: OAuth metadata handling (#47756), tool-listing dedupe (#61220), remote MCP data providers (#61058).

---

## 7. Developer Pain Points

- **Windows is the roughest platform right now**: Computer Use UI lag (#56941), lingering capture borders (#57101), WSL startup policy breaking relocation (#60974), policy/approval inconsistencies (#58401, #58780, #61191), and SSH reconnect gaps (#59931). This cluster dominates the issue tracker.
- **Resource leaks in long-lived app-server**: MCP subagent process/memory growth on Linux (#25015) undermines always-on usage.
- **Usage-limit behavior is disruptive**: Faster-than-expected depletion (#60530) plus hard termination mid-task (#60447) erode trust during long implementations; memory generation defaults also burn quota (#36806).
- **Remote SSH auth edge cases**: Layered public-key + PAM (#23037) and post-restart auto-connect (#59931) block common enterprise setups.
- **Desktop feature regressions**: Missing commit/push button (#47511) and lost project visibility (#60758, #60324) suggest desktop state management needs hardening.
- **Documentation vs. behavior drift**: Automation restrictions contradicting Scheduled tasks docs (#59546); the community increasingly flags policy/UX mismatches as first-class bugs.

</details>

<details>
<summary><strong>Gemini CLI</strong> — <a href="https://github.com/google-gemini/gemini-cli">google-gemini/gemini-cli</a></summary>

# Gemini CLI Community Digest — 2026-11-13

## 1. Today's Highlights

No new releases landed in the past 24 hours, but the issue tracker saw heavy activity across the agent subsystem. The most significant threads concern **subagent reliability**: a P1 bug where `MAX_TURNS` interruptions are falsely reported as goal success (#22323) and a widely-upvoted report of the generalist agent hanging indefinitely (#21409). Meanwhile, maintainer-led workstreams continue to push on sandboxing (#19873), AST-aware tooling (#22745), and persistent task tracking (#18836).

## 2. Releases

*No new releases in the last 24 hours.*

## 3. Hot Issues

1. **[#22323](https://github.com/google-gemini/gemini-cli/issues/22323)** — *Subagent recovery after MAX_TURNS reported as GOAL success* (P1, 13 comments). The `codebase_investigator` subagent reports success despite hitting its turn limit before doing any analysis. This masks real failures in agent orchestration and is the most-commented issue today — a correctness problem for anyone relying on subagent status signals.

2. **[#29267](https://github.com/google-gemini/gemini-cli/issues/29267)** — *Stuck in auth loop* (P2, 12 comments). A Pro member reports being trapped in a repeated login loop despite valid credentials, blocking daily usage entirely. High comment volume reflects shared frustration with the authentication path, especially for users comparing against `agy`.

3. **[#21409](https://github.com/google-gemini/gemini-cli/issues/21409)** — *Generalist agent hangs forever* (P1, 8 comments, 8 👍). Simple operations like folder creation block indefinitely when the CLI defers to the generalist agent. The community workaround — explicitly instructing the model not to use subagents — signals how disruptive this is; the 8 upvotes make it the most-endorsed issue in today's set.

4. **[#19873](https://github.com/google-gemini/gemini-cli/issues/19873)** — *Zero-dependency OS sandboxing & post-execution intent routing* (P2, 9 comments). Proposes leaning into Gemini 3's native bash fluency (`grep`, `sed`, `awk`) while containing it via OS-level sandboxing. A strategic design thread from a maintainer that will shape how shell execution evolves.

5. **[#23323](https://github.com/google-gemini/gemini-cli/issues/23323)** — *Task-aware compression and memories* (P1, 7 comments). Requests context-aware memory compression that avoids compressing the active task and prioritizes relevance to future tasks. Directly addresses context rot in long sessions.

6. **[#21968](https://github.com/google-gemini/gemini-cli/issues/21968)** — *Gemini underuses skills and sub-agents* (P2, 7 comments). Anecdotal but widely felt: the model won't invoke custom skills (e.g., `gradle`, `git`) unless explicitly told. Undermines the value of building a skill library.

7. **[#22267](https://github.com/google-gemini/gemini-cli/issues/22267)** — *Browser Agent ignores settings.json overrides* (P2, 5 comments). The `AgentRegistry` merges settings correctly, but the Browser Agent bypasses them — a configuration-integrity bug affecting `maxTurns` and similar constraints.

8. **[#21983](https://github.com/google-gemini/gemini-cli/issues/21983)** — *Browser subagent fails on Wayland* (P1, 4 comments). Reproducible failure on Linux Wayland desktops; matters for the growing Linux contributor base.

9. **[#24246](https://github.com/google-gemini/gemini-cli/issues/24246)** — *400 error with >128 tools* (P2, 3 comments). The CLI hits API errors when too many tools are in scope and needs smarter tool pruning. A scaling limit for users with rich extensions and MCP servers.

10. **[#22186](https://github.com/google-gemini/gemini-cli/issues/22186)** — *`get-shit-done` output hook causes crash* (P1, 3 comments). Reproducible crash at the end of a long-running output hook, indicating fragility in the hook/output pipeline.

## 4. Key PR Progress

1. **[#30159](https://github.com/google-gemini/gemini-cli/pull/30159)** — *Add `gemini-2.5-flash-image` model config* (open). Registers Nano Banana as a selectable image-generation model for the first time; fixes #28445.

2. **[#30162](https://github.com/google-gemini/gemini-cli/pull/30162)** — *Fix zizmor template-injection findings in eval-pr workflow* (open). Hardens CI by removing direct GitHub Actions expression injection into bash.

3. **[#30161](https://github.com/google-gemini/gemini-cli/pull/30161)** — *Add `--no-tags` to eval-pr git fetch* (open). Small CI efficiency win for PR evaluation workflows.

4. **[#30157](https://github.com/google-gemini/gemini-cli/pull/30157)** — *Only replace true cycles with `[Circular]`* (open). Fixes `safeJsonStringify` corrupting shared (non-cyclic) telemetry objects like OpenTelemetry `endTime` arrays — important for telemetry accuracy.

5. **[#30156](https://github.com/google-gemini/gemini-cli/pull/30156)** — *Buffer chat compression events until OTel SDK ready* (open). Prevents dropped `gemini_cli.chat_compression` metrics when compression fires during startup.

6. **[#30154](https://github.com/google-gemini/gemini-cli/pull/30154)** — *Flush buffered stdio before entering ACP mode* (open). Fixes silent loss of hook warnings in ACP sessions; would otherwise require SIGKILL to manifest.

7. **[#29546](https://github.com/google-gemini/gemini-cli/pull/29546)** — *Support `/skill-name` activation in non-interactive mode* (open, help wanted). Extends skills to scripted/CI usage — a common community ask.

8. **[#30259](https://github.com/google-gemini/gemini-cli/pull/30259)** — *Restore workspace dirs only after `resumeChat` succeeds* (merged/closed). Fixes session-resume failures leaving stale workspace directories active.

9. **[#30253](https://github.com/google-gemini/gemini-cli/pull/30253)** — *Report accurate output token limits in `models list`* (merged/closed). Corrects hardcoded 8,192 limits to the documented 65,536 for Gemini 2.5/3 models.

10. **[#30258](https://github.com/google-gemini/gemini-cli/pull/30258)** — *Scale undici `bodyTimeout` with request timeout* (merged/closed). Prevents body timeouts from killing long-running requests when a >300s request timeout is configured.

## 5. Hot Discussions

*No Discussions data was provided for this period.*

## 6. Feature Request Trends

- **Smarter context & memory management** — Task-aware compression (#23323), persistent file-based task tracking to replace WriteToDo (#18836), and "tactful extraction" for surgical reads (#19561) all target context bloat and cross-session memory loss.
- **Higher-quality codebase understanding** — AST-aware file reads, search, and mapping (#22745, #22746) aim to cut wasted turns and token noise during investigation.
- **Autonomous skill/subagent usage** — Users want Gemini to *choose* skills and subagents proactively (#21968) and to activate skills non-interactively (#29546).
- **Safety rails on destructive behavior** — Preventing `git reset`/`--force` and careless DB modifications (#22672), plus sandboxing bash-centric workflows (#19873).
- **Better observability of agent trajectories** — Surfacing subagent trajectories via `/chat share` (#22598) and including subagent context in bug reports (#21763).
- **Agent self-awareness** — Accurate knowledge of its own CLI flags, hotkeys, and self-execution (#21432).

## 7. Developer Pain Points

1. **Subagent reliability and silence** — Hangs (#21409), false success reporting (#22323), and Wayland failures (#21983) make subagents feel unpredictable; the informal workaround (disable subagents) is telling.
2. **Authentication friction** — The recurring auth loop (#29267) blocks even paying Pro users from using the tool at all.
3. **Configuration not honored** — Settings like `maxTurns` are silently ignored by the Browser Agent (#22267), eroding trust in `settings.json` as a control surface.
4. **Workspace pollution** — Models creating temp scripts in random directories (#23571) complicates clean commits.
5. **Tool-scope scaling limits** — The 400 error above 128 tools (#24246) penalizes power users with many MCP servers/extensions.
6. **Context rot and token cost** — A persistent baseline of ~36.6k tokens/turn (#19561) drives most of the memory/compression feature requests.

*Note: several P1 agent issues (#21409, #21968, #22267, #21763) carry `status/need-retesting`, suggesting fixes may be in flight — worth re-verifying on nightly builds.*

</details>

<details>
<summary><strong>GitHub Copilot CLI</strong> — <a href="https://github.com/github/copilot-cli">github/copilot-cli</a></summary>

# GitHub Copilot CLI Community Digest — 2026-11-13

## 1. Today's Highlights

A new patch, **v1.0.110**, lands with an experimental masked-dialog password helper for `git`, `ssh`, and `sudo` prompts, plus better Entra sign-in handling and improved screen-reader session identification. The issue tracker remains dominated by **authentication/MCP problems** (Entra broker cache, Google Workspace OAuth, delegated-task OAuth), alongside a fresh report in 1.0.109 of a **recurring OOM crash** in long sessions. Notably, there were no pull requests updated in the last 24 hours, so all community momentum visible today is on the issues side.

---

## 2. Releases

**v1.0.110** (2026-11-12)
- **Experimental password prompt handling:** Agent commands can now answer `git`, `ssh`, and `sudo` password prompts through a masked dialog (enable via `/experimental on`).
- **Entra sign-in polish:** Avoids unnecessary error popups when an organization account is available during Microsoft Entra sign-in.
- **Accessibility:** Screen readers now identify the current session and announce relevant state changes.

---

## 3. Hot Issues

1. **#5236 — Windows Entra broker token cache stays 0 bytes after MCP sign-in** ([link](https://github.com/github/copilot-cli/issues/5236))
   The broker writes `~\.copilot\entra-broker-accounts\<id>.bin` but the cache never populates, forcing an account picker on every new process (a same-process `/restart` is fine). Impacts Windows + MCP workflows most; 7 comments and active triage on `area:platform-windows, area:mcp`.

2. **#4606 — Google Workspace MCP OAuth fails on trailing-slash issuer mismatch** ([link](https://github.com/github/copilot-cli/issues/4606))
   Standard `accounts.google.com/` issuer mismatch blocks the browser flow before it starts. A canonical OAuth spec edge case — a blocker for any org relying on Google's official Workspace MCP endpoints (5 comments, 2 👍).

3. **#4515 — CLI exposes both MCP `content` and `structuredContent`** ([link](https://github.com/github/copilot-cli/issues/4515))
   Closed but worth watching: duplicated fields inflate conversation context. Sets an important precedent for how structured MCP results should be surfaced (4 comments).

4. **#4837 — Policy-driven `enabledPlugins` persists `"enabled": false`** ([link](https://github.com/github/copilot-cli/issues/4837))
   MDM/device-policy installs the plugin but never activates it, with no self-correction. Critical for enterprise fleet deployments where policy is the only install path.

5. **#5151 — Static context (15K → ~260K tokens) rejects Sol models before first prompt** ([link](https://github.com/github/copilot-cli/issues/5151))
   Regression dated around 2026-10-14: `compaction_static_context_blocked` fails the session before the user types. Highlights how tool-definition growth is outpacing model context budgets.

6. **#4467 — Long-running agent sessions exhaust remote event store, appear cancelled** ([link](https://github.com/github/copilot-cli/issues/4467))
   Sessions with many subagents lose status/handoff fidelity while the CLI stays alive. A foundational reliability issue for anyone running autonomous/handoff-style workflows.

7. **#5435 — Repeated OOM crash during long interactive session in 1.0.109** ([link](https://github.com/github/copilot-cli/issues/5435))
   Fresh report (2026-11-12): after the crash, the resumed session could not access the prior background agent. Reinforces the #4467/#5446 memory-pressure cluster.

8. **#5446 — MCP tool cache grows with temporary workspaces, can exhaust memory at startup** ([link](https://github.com/github/copilot-cli/issues/5446))
   `%LOCALAPPDATA%\copilot\mcp-tools` accumulates per-workspace snapshots — a slow leak specifically triggered by eval harnesses and CI that mint fresh workspaces each run.

9. **#5447 — ACP mode never attaches to the IDE (`--acp` skips `~/.copilot/ide` discovery)** ([link](https://github.com/github/copilot-cli/issues/5447))
   Non-interactive ACP sessions get no IDE MCP server and no "Visual Studio Connected" indicator, even from the editor's own terminal. Contrasts with interactive CLI attaching in ~1s.

10. **#5441 — Subagents refuse `/tmp` writes before tool execution despite allow-all** ([link](https://github.com/github/copilot-cli/issues/5441))
    Parent agent can write to an authorized `/tmp`, but a background `general-purpose` subagent refuses pre-execution. Surfaces inconsistency in how permissions propagate to delegated children.

Also notable: **#5437** (delegated `task` children can't auth HTTP-OAuth MCP servers) and **#5434** (macOS keychain re-prompts after "Always Allow" with duplicate items) continue the auth-heavy day.

---

## 4. Key PR Progress

No pull requests were updated in the last 24 hours (Total: 0 items). No PR activity to report today.

---

## 5. Hot Discussions

No discussion data was provided in the source feed; this section is omitted.

---

## 6. Feature Request Trends

- **BYOK / provider configurability:** Publish a `jsonschema` for `providers.json` so users can discover valid BYOK parameters (#5287).
- **Session ergonomics:** Attach an existing chat/session to a Project after the fact (#4922); Vim-style normal-mode commands like `:q`/`:w`/`:model` (#5442).
- **Storage hygiene:** Reuse or release inactive per-session Git worktrees to reduce duplicated build output and disk usage (#5443).
- **Structured MCP result handling:** Prefer `structuredContent` over duplicated `content` when both are present (#4515).
- **Delegation reliability:** Consistent auth and permission propagation to subagents/task children (#5437, #5441).

---

## 7. Developer Pain Points

1. **MCP authentication is the top friction area.** Entra broker cache not persisting on Windows (#5236), Google Workspace trailing-slash issuer mismatch (#4606), macOS keychain re-prompting after "Always Allow" (#5434), and OAuth failures in delegated children (#5437) form a coherent cluster.
2. **Memory pressure and leaking state.** OOM crashes in long sessions (#5435), growing MCP tool caches (#5446), and event-store exhaustion in subagent-heavy sessions (#4467) all point to resource management under sustained use.
3. **Permissions inconsistency between parent and child agents.** #5441 and #5437 show delegated agents not inheriting the parent's authorization — a blocker for autonomous multi-agent workflows.
4. **Enterprise policy paths silently fail.** Policy-driven plugin installation landing as `"enabled": false` (#4837) undermines MDM-managed rollouts.
5. **Context budget pressure.** Tool definitions ballooning to ~260K tokens (#5151) is degrading model selection before users even start.
6. **Misleading error surfaces.** Generic auth-failure messages masking structured provider errors (#5436) cost developers debugging time.

*Generated from github.com/github/copilot-cli activity for 2026-11-13.*

</details>

<details>
<summary><strong>OpenCode</strong> — <a href="https://github.com/anomalyco/opencode">anomalyco/opencode</a></summary>

# OpenCode Community Digest — 2026-11-13

## 1. Today's Highlights

No new releases shipped in the last 24 hours, but engineering activity is intense: the core team landed and re-landed a series of tool-repair/dispatch fixes (PRs #63630 → #63633 → #63573) that touch Code Mode tool execution and plugin hooks. A high-profile new feature request — an "Advisor" tool letting the session model consult a second model (Issue #63631 / PR #63637) — arrived and got an accompanying PR the same day. Meanwhile, several V2 regressions continue to surface, notably stale model display in the Desktop prompt footer and unexplained turn aborts on Windows/Linux.

---

## 2. Releases

No new releases in the last 24 hours.

---

## 3. Hot Issues

1. **[#785] Is there a way to disable streaming mode? (CLOSED)** — 37 comments, 👍40
   The most-discussed issue in the window. Users behind non-streaming proxies (e.g. Credal OpenAI Proxy) hit `AI_APICallError: Streaming is not supported`. High upvote count signals real demand for a `--no-stream` / non-streaming provider mode.
   https://github.com/anomalyco/opencode/issues/785

2. **[#49742] Message timestamp option missing in CLI v2.0.8 (OPEN)** — 13 comments, 👍10
   Regression from v1.18.31: `Ctrl+P` timestamp toggle is gone. A visible UX downgrade in the V2 migration — historically significant because it's been open since September.
   https://github.com/anomalyco/opencode/issues/49742

3. **[#53756] [V2] Bedrock inference profile ARN gets Nova-format effort variants for Claude models (OPEN)** — 10 comments
   Claude models behind Bedrock application inference profile ARNs get Nova-format `reasoningConfig`, returning HTTP 400. Important for enterprise AWS Bedrock users.
   https://github.com/anomalyco/opencode/issues/53756

4. **[#23655] [FEATURE] Add Responses API support for Go service (CLOSED)** — 10 comments, 👍31
   Highest upvote count in the list. The Go service lacking Responses API support is a major gap for OpenAI-compatible backends.
   https://github.com/anomalyco/opencode/issues/23655

5. **[#26915] [FEATURE] RTL language support in chat panel (CLOSED)** — 10 comments, 👍5
   Arabic/Hebrew/Persian rendering support. Community-driven i18n/accessibility request now closed.
   https://github.com/anomalyco/opencode/issues/26915

6. **[#48099] [FEATURE] OpenCode desktop MSI installer (CLOSED)** — 7 comments
   Enterprise deployment gap — no MSI or silent-install switches for the desktop app. Relevant for IT-managed fleets.
   https://github.com/anomalyco/opencode/issues/48099

7. **[#63506] Desktop: prompt footer keeps stale model after a command sets its own model (OPEN)** — 6 comments
   Slash command with `model:` in frontmatter switches the session model (confirmed by API/metadata/events) but the TUI footer still shows the old model — a trust/observability bug in a user-facing surface.
   https://github.com/anomalyco/opencode/issues/63506

8. **[#61504] [FEATURE] Timeouts for permission requests (OPEN)** — 6 comments
   `ask`-resolved permission rules block a session forever. Requests an idle timeout so unattended sessions don't hang indefinitely. Practical CI/headless concern.
   https://github.com/anomalyco/opencode/issues/61504

9. **[#63632] [2.0.22 / 2.0.27] Turns are aborted with nothing asking for it (OPEN)** — 4 comments
   A sharply-worded report on turn aborts where "the engine no longer says who asked" — store/stream state divergence. Filed 2026-11-13; the author notes the tracker asked for this report twice. High-signal V2 correctness bug.
   https://github.com/anomalyco/opencode/issues/63632

10. **[#52420] Tool names differing only in normalized characters silently collide (OPEN)** — 5 comments
    `normalizedName` maps `[^a-zA-Z0-9_-]` to `_`, so distinct tools can silently overwrite each other in the registry. A latent correctness landmine for plugin authors.
    https://github.com/anomalyco/opencode/issues/52420

---

## 4. Key PR Progress

1. **[#63647] refactor(core): expose shell exit code, elapsed time, and log path** — `shell` tool now returns `{ output, exitCode, wallTimeSeconds }`; background jobs return null exit code plus shell ID. Improves tool-output ergonomics.
   https://github.com/anomalyco/opencode/pull/63647

2. **[#63646] fix(app): run scripts in HTML file previews in the web UI** — Fixes CSP inheritance on `blob:` iframe URLs (Closes #63644). Directly improves preview fidelity.
   https://github.com/anomalyco/opencode/pull/63646

3. **[#63645] fix(core): refresh provider OAuth tokens only near expiry** — Prevents spurious OAuth refresh on providers whose tokens expire far later than the 5-minute default margin (Closes #50759).
   https://github.com/anomalyco/opencode/pull/63645

4. **[#63590] fix(core): pass stored message metadata to session request hooks (CLOSED)** — Fixes #63252; restores `metadata` propagation from `prompt` hooks to `context` hooks, unblocking per-message plugin context. Landed.
   https://github.com/anomalyco/opencode/pull/63590

5. **[#63637] feat: add an advisor tool the session model can consult** — Implements Claude Code–style "advisor": the working model can query a second user-selected model for guidance. Closes #63631.
   https://github.com/anomalyco/opencode/pull/63637

6. **[#63641] fix(ai): a structured answer replays instead of "Tool result missing"** — Fixes replay of typed-object responses so they appear as the result of the producing call, not a missing tool result.
   https://github.com/anomalyco/opencode/pull/63641

7. **[#63640] fix(ai): report a repeated stop instead of a new step** — Correctly classifies a second provider stop as duplicate-finish error rather than a phantom new step; trailing keepalive pings still tolerated.
   https://github.com/anomalyco/opencode/pull/63640

8. **[#63635] refactor(core): return the edit summary as a string** — `edit` now returns the same human-readable string the model sees (`Edited src/a.ts (1 replacement)`). Simplifies tool consumers.
   https://github.com/anomalyco/opencode/pull/63635

9. **[#63633] fix(core): honor plugin tool repairs in Code Mode** — Re-proposes #63444 after #63630's revert; previously a `tool.execute.before` rewrite of the tool name had no effect in Code Mode.
   https://github.com/anomalyco/opencode/pull/63633

10. **[#63573] fix(core): honor advertised tool names during direct call repair** — When `preview` is advertised as `bash`, direct calls to `bash` could erroneously run `shell`. Stacks on #63633.
    https://github.com/anomalyco/opencode/pull/63573

Also notable: **[#63634] refactor(ai): remove Gemini Veo and Runway video protocols** (Google shut down Veo 2; Runway deprecated) — part of an ongoing protocol cleanup.
https://github.com/anomalyco/opencode/pull/63634

---

## 5. Hot Discussions

No discussion data was provided in the source dataset; this section is omitted.

---

## 6. Feature Request Trends

Distilling across all issues and PRs in this window, the dominant directions are:

- **Provider/transport flexibility** — non-streaming mode (#785), Responses API for the Go service (#23655), Bedrock inference-profile correctness (#53756), GitLab Duo tool-calling repair (#63212), and "unload local model on /clear and /exit " (#63612). Users want broader, more reliable backend coverage.
- **Headless/enterprise readiness** — MSI installer and silent deploy switches (#48099), permission-request timeouts (#61504), and GitHub OAuth/commit attribution (#54670). Requests cluster around managed, unattended environments.
- **Multi-model reasoning workflows** — the advisor tool (#63631/#63637) is the clearest new direction: let the active model consult a second model.
- **TUI/UX parity with V1** — timestamps (#49742), RTL support (#26915), collapsible compaction summaries (#48596), and stale-model footer display (#63506) are all about restoring or extending terminal UX.
- **Plugin/API surface stability** — V2 model-context hook (#35408), per-session tool availability (#35647), durable naming review (#34922), and metadata hook fixes (#63252/#63590) point to plugin authors needing a stable, documented V2 API before GA.

---

## 7. Developer Pain Points

Recurring frustrations across the dataset:

- **V2 regressions eroding trust**: missing timestamps (#49742), stale model in footer (#63506), and silent turn aborts (#63632) each describe the UI/engine showing something different from reality. The #63632 author explicitly notes the tracker asked for this report "twice" — friction with triage.
- **Silent failures and swallowed errors**: tool-name collision from normalization (#52420), MCP `opencode_console` 403 with silent 6-second reconnects (#59806), and GitLab Duo turns ending "with no output and no error" (#63212). Errors aren't surfaced to users.
- **Performance/scale issues**: git polling saturating CPU on 1.3M-file worktrees (#62948), long agent turns dying mid-stream with ECONNRESET (#60940), and even one-word prompts taking a very long time on Desktop 2.2.7 (#63576).
- **Install/upgrade friction**: raw npm EACCES stack traces on root-owned global prefixes, with an older v1 binary potentially shadowing the new one on PATH (#63626).
- **Platform-specific gaps**: Wayland clipboard image paste does nothing on GNOME (#63567); Desktop renderer crashes on Windows x64 (#63001).
- **Free-tier rate limiting confusion**: #63568 reports a hit limit after a four-week idle period despite near-zero usage — opaque quota accounting.

The through-line: the community is heavily invested in V2 but is hitting correctness, observability, and platform-ergonomics rough edges. The rapid back-and-forth on tool-repair PRs (#63630 revert → #63633 → #63573) suggests the maintainers are themselves iterating quickly under contributor pressure.

</details>

<details>
<summary><strong>Pi</strong> — <a href="https://github.com/earendil-works/pi">earendil-works/pi</a></summary>

# Pi Community Digest — 2026-11-13

## 1. Today's Highlights

A large batch of long-standing issues and PRs were closed on 2026-11-12, spanning terminal-rendering correctness, provider integrations (Copilot reasoning effort, Google custom fetch, Qwen Token Plan branding), and crash-class bugs in the read/bash tools. The dominant theme is a coordinated cleanup of "TUI writes to the terminal behind its own back" problems, led by contributor `petrroll`, alongside several high-priority reliability fixes from `acmerfight`. Community demand remains strongest for stability under constrained environments (read-only FS, full `/tmp`, slow clients, nested terminals like tmux/screen).

## 2. Releases

No new releases in the last 24 hours.

## 3. Hot Issues

1. **[#2870 [CLOSED] Follow XDG Base Directory](https://github.com/earendil-works/pi/issues/2870)** — 28 comments, 75 👍. The single highest-signal item in the digest: Pi was cluttering `$HOME` with config/state dirs on Linux instead of honoring `$XDG_CONFIG_HOME`. Its closure marks a meaningful standards-compliance win and explains the unusually high upvote count (75). *Why it matters:* filesystem-convention bugs are quietly corrosive for Linux power users and dotfile managers (Nix, home-manager, chezmoi).

2. **[#10628 [OPEN] OSC 52 copy in fullscreen TUI swallowed by tmux](https://github.com/earendil-works/pi/issues/10628)** — 14 comments. Copy-on-select emits a raw OSC 52 escape sequence that tmux intercepts into its own paste buffer instead of relaying. Pi falsely reports "Copied!" either way — a dangerous silent-failure mode on headless SSH hosts where there is no LOCAL clipboard fallback. *Why it matters:* clipboard correctness is a trust issue for remote workflows; users only discover the failure downstream.

3. **[#12019 [OPEN] [prio:p0] github-copilot: Gemini models never get reasoning_effort](https://github.com/earendil-works/pi/issues/12019)** — 9 comments. The bundled Copilot catalog hardcodes `supportsReasoningEffort: false` for all `openai-completions` models, so `--thinking` is silently a no-op on Gemini models and `usage.reasoning_tokens` is ignored. *Why it matters:* a P0 that silently disables a flagship feature; a fix PR (#12110) is already open.

4. **[#11026 [OPEN] [durable] permanently delete a conversation](https://github.com/earendil-works/pi/issues/11026)** — 8 comments, 6 👍. Requests `harness.deleteConversation(id, ctx)` that refuses while a run is active, then removes entries, docs, inbox items, and scheduler state. *Why it matters:* data-lifecycle completeness in `pi-durable`; users currently have no first-class deletion path.

5. **[#10618 [OPEN] GNU screen: inherited COLORTERM overrides screen guard](https://github.com/earendil-works/pi/issues/10618)** — 7 comments. `screen` passes `COLORTERM=truecolor` through, but its own truecolor option is off by default, so the TUI emits 24-bit color that gets mangled and colors vanish. *Why it matters:* same family as the tmux bug — multiplexer environment detection is a recurring blind spot.

6. **[#10563 [CLOSED] MCP OAuth: Google servers never get a refresh token](https://github.com/earendil-works/pi/issues/10563)** — 6 comments. Google only issues refresh tokens when `access_type=offline` is sent; the ability to add authorization-request parameters now makes Gmail/Calendar MCP servers usable long-term. *Why it matters:* unblocks persistent OAuth for Google's MCP surface.

7. **[#8617 [OPEN] Codex: use file references for image-heavy tool results](https://github.com/earendil-works/pi/issues/8617)** — 6 comments. Proposes storing image bytes locally and materializing outbound images as ChatGPT `file_id` references instead of replaying base64 on every request. The author has a working prototype. *Why it matters:* a direct payload-size and cost lever for image-heavy agent workflows.

8. **[#10585 [OPEN] [prio:p0] bash temp-file stream errors crash the whole process](https://github.com/earendil-works/pi/issues/10585)** — 4 comments. On 1.0.4, an `ENOSPC` on `/tmp` (or `EACCES`) produced an uncaught exception that killed the process mid-run, with the in-flight run lost and no tool error surfaced. *Why it matters:* a crash in constrained environments; exactly the class of bug that erodes trust in unattended runs.

9. **[#9448 [OPEN] `pi auth check` cannot see extension-registered providers](https://github.com/earendil-works/pi/issues/9448)** — 4 comments. The documented scriptable readiness check reports extension providers as `invalid_state`, breaking non-interactive pipelines that gate on it. *Why it matters:* small-looking inconsistency with outsized impact on CI/review automation.

10. **[#11446 [OPEN] [durable] lightweight extension-authoring entry point](https://github.com/earendil-works/pi/issues/11446)** — 2 comments. Requests a `@earendil-works/pi-durable/extension` subpath exporting `defineDoc`, `defineExtension`, `hook`, and `ToolTask` without pulling in session runtime, storage, or model code. *Why it matters:* extension authors currently pay a heavy import cost for pure type/helper usage.

## 4. Key PR Progress

1. **[#12116 [CLOSED] fix(coding-agent): anchor find path patterns at the search path](https://github.com/earendil-works/pi/pull/12116)** — Fixes #12066. `find src/**/*.ts` was matching files *above* the project root because `fd --full-path` globs against absolute paths. *Impact:* eliminates cross-project false positives in a core tool.

2. **[#12110 [OPEN] fix(ai): send reasoning_effort and read reasoning tokens for GitHub Copilot](https://github.com/earendil-works/pi/pull/12110)** — Closes the P0 #12019; sources `supportsReasoningEffort` from models.dev and additionally enables it for `gemini-4-carbon`. *Impact:* restores `--thinking` semantics on Copilot.

3. **[#12109 [CLOSED] fix(tui): hide terminal images covered by overlays](https://github.com/earendil-works/pi/pull/12109)** — Closes #11584 and duplicates #6995, #9439, #10863, #11284. `compositeTuiLine` passed image rows through, leaving a "hole" in overlays. *Impact:* one fix retiring five issues — the highest-leverage TUI PR in this batch.

4. **[#12112 [CLOSED] fix(ai): move Qwen Token Plan to current gateways and model lists](https://github.com/earendil-works/pi/pull/12112)** — Closes #11773, covers remaining model-list problems from #7491/#7674; defaults all four Qwen Token Plan providers to current hosts. *Impact:* prevents auth/routing failures against deprecated endpoints.

5. **[#12111 [CLOSED] fix(coding-agent): keep /resume selection stable during progressive reload](https://github.com/earendil-works/pi/pull/12111)** — After delete/rename, a partially loaded list clamps the index onto an unrelated session. *Impact:* fixes a subtly destructive UX bug during session cleanup.

6. **[#12107 [CLOSED] fix(extensions): bound session_shutdown dispatch so quit cannot hang](https://github.com/earendil-works/pi/pull/12107)** — Quitting sometimes left `pi` running for days after the TUI disappeared (observed on macOS with gentle-shell). *Impact:* fixes a zombie-process class bug that is very hard for users to diagnose.

7. **[#11966 [CLOSED] fix(coding-agent): stop writing to the terminal while the TUI draws](https://github.com/earendil-works/pi/pull/11966)** — Fixes #11264. Direct stdout/stderr writes left the TUI's screen model stale, causing persistent redraw artifacts. *Impact:* architectural hygiene; several follow-ups (#12117, #12115, #11973) continue the sweep.

8. **[#11952 [CLOSED] fix(coding-agent): run bash calls alone, other calls in parallel](https://github.com/earendil-works/pi/pull/11952)** — Closes #11950. Prevents a `read` from racing a concurrent `bash` that is supposed to produce the file. *Impact:* removes a real correctness hazard in mixed tool batches.

9. **[#12087 [CLOSED] fix(coding-agent): skip VCS directories in grep and find](https://github.com/earendil-works/pi/pull/12087)** — Closes #12084. `--hidden` was causing `.git/` internals (reflogs, hook samples) to pollute results — 15 of 18 `TODO` matches in the report were from `.git/`. *Impact:* noise reduction in the two most-used search tools.

10. **[#12093 [CLOSED] fix(ai): retry provider errors reading "Connection closed."](https://github.com/earendil-works/pi/pull/12093)** — Adds the common mid-stream gateway drop to `isRetryableAssistantError`. *Impact:* converts a hard turn failure into a transparent retry.

## 5. Hot Discussions

No discussion data was provided for this period.

## 6. Feature Request Trends

- **Data lifecycle & persistence controls:** explicit deletion for `pi-durable` conversations (#11026), extension-authoring subpath exports (#11446) — the durable layer is maturing from "works" toward "manageable."
- **Terminal/environment correctness:** XDG compliance (#2870), tmux OSC 52 passthrough (#10628), GNU screen truecolor handling (#10618) — a consistent push for Pi to behave well in multiplexers and standards-compliant Linux environments.
- **Provider fidelity:** reasoning effort propagation for Copilot/Gemini (#12019), custom `fetch` in Google adapters (#12097), MCP OAuth authorization parameters for Google (#10563), namespace-scoped `tool_search` (#11558).
- **Payload efficiency:** file-reference-based image handling for Codex (#8617), prompt-cache-preserving branch summaries (#9411).

## 7. Developer Pain Points

- **Silent failures:** Pi reports "Copied!" when tmux swallowed the copy (#10628); settings changes look successful on a read-only `settings.json` with no error (#10168); `--thinking` is accepted but silently ignored on Copilot models (#12019). Users cannot distinguish success from a no-op.
- **Crash-instead-of-degrade:** uncaught `ENOSPC`/`EACCES` on bash temp files (#10585), uncaught `AbortError` on aborted reads (#12118), and `pi.exec` mapping signal-killed commands to exit code 0 (#12089) — resource exhaustion and signals turn into lost runs or false success.
- **Multi-tenant terminal environments:** tmux, GNU screen, and nested SSH sessions repeatedly break clipboard and color behavior, suggesting environment detection logic needs a consolidated pass rather than per-multiplexer patches.
- **Tooling noise:** VCS directories polluting `grep`/`find` (#12087), path globs escaping the search root (#12066) — small annoyances that compound across long agent sessions.

*Note: counts reflect the data snapshot as presented; several issues were updated on 2026-11-12/13 and may have closed since.*

</details>

<details>
<summary><strong>Qwen Code</strong> — <a href="https://github.com/QwenLM/qwen-code">QwenLM/qwen-code</a></summary>

# Qwen Code Community Digest — 2026-11-13

## 1. Today's Highlights

The 1.0 preview line took center stage today with the release of **v1.0.0-preview.1**, which fixes Qwen subscription account sign-in and syncs the subscription model catalog/thinking-budget mapping. In parallel, the team continued hardening the **v0.27.3** release across CLI, SDK (TypeScript v0.1.33), and Desktop, while a major tracking issue (#17045) opened to land the 1.0 event-driven loop kernel on `main` incrementally. CI stability remains the dominant operational theme, with multiple flaky-test and infrastructure issues (inode exhaustion, artifact timeouts) under active triage.

## 2. Releases

- **v0.27.3** — Stable release of the CLI. Release notes are currently a stub (`qwen-release-notes:v1`), with the full change list to follow.
- **sdk-typescript-v0.1.33** — Bundles CLI 0.27.3 (built from the same branch/ref as the SDK). Note: the release body also references CLI 0.27.2, suggesting a possible note-generation merge artifact worth watching.
- **desktop-v0.27.3** — Desktop build. Includes CI prettier-ignore fixes (#16729) and Agent Host retrieval fixes.
- **v1.0.0-preview.1** — Preview release. Headline fix: subscription accounts can now use subscription models after sign-in, with the model catalog following sign-in state automatically (no manual provider config). Subscription catalog and thinking-budget mapping synced with Qwen Code 0.2x.
- **v0.27.2-nightly.20261112** — Nightly with managed-agent fixes: releasing the MCP owner when a Session closes (#16728) and hardening the managed-agent host.

**Feature note:** A new UI affordance added chips above the Web Shell composer for unfinished background workflows, shells, monitors, and local agents.

## 3. Hot Issues

1. **[#17045](https://github.com/QwenLM/qwen-code/issues/17045) — tracking(core): land the 1.0 Preview loop kernel on main (P1, 7 comments)** — The central roadmap issue for migrating the event-driven `query()` kernel from v1.0.0-preview to `main`, one surface at a time with a switch back. High strategic importance for anyone building on the agent loop.
2. **[#15327](https://github.com/QwenLM/qwen-code/issues/15327) — tracking(core): run every surface on one agent loop behind `experimental.unifiedAgentLoop` (P1)** — Companion tracking issue to #17045. Signals a consolidation of the loop implementation across all surfaces; critical for long-term API stability.
3. **[#14724](https://github.com/QwenLM/qwen-code/issues/14724) — Main CI failed: Managed Agent gate (342 comments)** — The longest-running CI failure thread on the tracker. Enormous comment volume reflects sustained automation churn rather than new user impact, but it's a persistent maintenance tax.
4. **[#16927](https://github.com/QwenLM/qwen-code/issues/16927) — CI built-tree download timeouts redden PR checks with no tests run (P1, 7 comments)** — All 58 jobs on the hz fleet affected; artifact handoff expires on both attempts, turning PRs red after ~31 minutes without executing a single test. Directly blocks contributor velocity.
5. **[#17040](https://github.com/QwenLM/qwen-code/issues/17040) — ACP session child goes idle-unresponsive after curl/network calls (P1, 5 comments)** — Web Shell sessions die with `agent channel closed mid-request` when a turn runs `curl` through a local proxy; the child isn't crashing but stops answering the daemon. Real user-facing reliability bug in the daemon path.
6. **[#13570](https://github.com/QwenLM/qwen-code/issues/13570) — Auto mode blocks inert text mentioning the amend phrase (P2, 9 comments)** — A permissions false-positive: the destructive-command guard fires on text that merely *mentions* the amend phrase, ahead of the user's own ask rule, with no escape hatch. Security/UX tension worth resolving.
7. **[#16579](https://github.com/QwenLM/qwen-code/issues/16579) — Hosted v1 detach wedges on a Hook-configured turn's live background run (P1, 4 comments)** — Scope was corrected on 2026-11-12: the wedge is on the v1 detach path, needs a keep-READY drain. Important for managed/hosted deployments.
8. **[#17038](https://github.com/QwenLM/qwen-code/issues/17038) — CLI stuck in login verification state on headless Linux (P2, 3 comments)** — OAuth flow over headless Linux with browser-on-another-machine doesn't auto-continue. Common CI/SSH developer scenario.
9. **[#16915](https://github.com/QwenLM/qwen-code/issues/16915) — Task reports "connection to the model service was interrupted" and cannot continue (P2, closed)** — User-reported task interruption; closed quickly. Mirrors recurring connection-loss complaints (see also #16908).
10. **[#16449](https://github.com/QwenLM/qwen-code/issues/16449) — core(permissions): extend amend-guard inert proof and recognizer coverage (P2, 5 comments)** — Follow-up to #16075. Tracks the remaining non-blocking security-hardening items from review, keeping a fail-closed backstop.

## 4. Key PR Progress

1. **[#17055](https://github.com/QwenLM/qwen-code/pull/17055) — feat(core): resolve loop switches per surface with env force on/off** — Lets each surface resolve its own experimental loop switch, with environment override. Foundational for the #17045 rollout.
2. **[#17050](https://github.com/QwenLM/qwen-code/pull/17050) — feat(ci): add kernel and OpenTUI nightly legs for the loop rollout** — Adds the nightly E2E legs the loop rollout depends on, including a third `kernel` arm for the Linux sandbox:none matrix and three-arm loop matrix for OpenTUI.
3. **[#16528](https://github.com/QwenLM/qwen-code/pull/16528) — feat(web-shell): resume an interrupted turn when a session loads** — Automatically resumes persisted turns interrupted by daemon/environment restarts instead of leaving them idle behind Continue. Meaningful reliability win for Web Shell.
4. **[#17088](https://github.com/QwenLM/qwen-code/pull/17088) — feat(managed-agent): fixed-interval /loop schedules for Managed Sessions** — Enables recurring `/loop` schedules in Managed Sessions, leveraging H6 definitions, single-claim scanner, and run ledger. Expands automation capability.
5. **[#16661](https://github.com/QwenLM/qwen-code/pull/16661) — fix(mcp): repair the MCP connection torn down by an aborted tool call** — Aborting an in-flight MCP request could leave a dead transport; the abort path now repairs the connection. Fixes a real session-degradation bug.
6. **[#16686](https://github.com/QwenLM/qwen-code/pull/16686) — feat(headless): keep provider HTTP status on terminal error results** — Terminal error envelopes now carry an optional `status` (401/429/5xx) for machine-readable consumers. Valuable for CI/headless integrations.
7. **[#16679](https://github.com/QwenLM/qwen-code/pull/16679) — fix(acp): surface failed `todo_write` calls instead of dropping them** — Failed todo writes now emit a terminal `tool_call_update` with `status: failed` rather than silently producing no frame. Better observability for ACP clients.
8. **[#17012](https://github.com/QwenLM/qwen-code/pull/17012) — feat(channels): add Feishu custom bot webhook delivery** — Adds a send-only Feishu custom-bot Channel with Markdown card delivery for Notify, prompt results, and scheduled results. Expands integrations.
9. **[#16779](https://github.com/QwenLM/qwen-code/pull/16779) — feat(web-shell): improve session search experience** — Dedicated centered dialog, clear titles/snippets/workspace context, keyboard selection, focus restoration, loading/retry states.
10. **[#16924](https://github.com/QwenLM/qwen-code/pull/16924) — fix(core): let glob match directories, not just files** — Previously every real directory was filtered out while a symlink pointing at one survived, producing inconsistent existence probes. Correctness fix.

## 5. Hot Discussions

No Discussion data was provided in the source. This section is omitted.

## 6. Feature Request Trends

- **Unified agent loop / session management** — The strongest emerging direction. Two P1 tracking issues (#17045, #15327) target landing a single event-driven loop kernel across all surfaces, gated experimentally. This is the defining 1.x roadmap bet.
- **Background & scheduled workflow visibility** — New composer chips for unfinished background workflows/shells/monitors/local agents, plus recurring `/loop` schedules in Managed Sessions (#17088), point to growing demand for long-running, asynchronous task management.
- **Integration channels** — Feishu bot webhook delivery (#17012) signals appetite for broader notification/delivery integrations beyond the existing surfaces.
- **Headless/CI ergonomics** — Machine-readable error statuses (#16686) and headless OAuth fixes (#17038) reflect real demand for scriptable, automation-friendly behavior.
- **Web Shell polish** — Session search redesign (#16779), interrupted-turn resume (#16528), and focus fixes (#17089) indicate active investment in the Web Shell UX.

## 7. Developer Pain Points

1. **CI instability is the top friction** — Multiple P1 CI issues (#16927, #17037, #14724, #11680) describe PRs going red with no tests run (artifact download timeouts), `/tmp` inode exhaustion on hz3 hosts, and long-running managed-agent gate failures. This is directly blocking contributor throughput and consuming maintainer bandwidth.
2. **Connection reliability / silent interruption** — Recurring reports (#16915, #16908, #17040, #17038) of model connection losses, stuck sessions, and daemon-killed ACP children mid-request. Users repeatedly lack detailed logs to diagnose root causes.
3. **Permission-guard false positives** — The auto-mode guard firing on inert text that merely mentions the amend phrase (#13570), with no escape hatch and taking precedence over the user's own instruction, is a notable security-vs-usability tension.
4. **Flaky test noise** — A high volume of auto-filed `deflake:` issues (#17063, #17057, #17046, #17079, #17084, #16975) from the CI Failure Patrol indicates persistent nondeterminism in Web Shell E2E and process-bootstrap tests.
5. **Dependency security debt** — #16434 tracks published advisories still resolved by `@qwen-code/sdk@0.1.28` and `@qwen-code/web-shell@0.26.8`, awaiting dependency upgrades and republishing.
6. **Windows/daemon edge cases** — #17040 (Windows ACP child idle-unresponsive after curl) and #13570 (macOS/VS Code permissions) reflect platform-specific gaps in the daemon and permissions paths.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*