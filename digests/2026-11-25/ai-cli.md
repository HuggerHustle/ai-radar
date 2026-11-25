# AI CLI Tools Community Digest 2026-11-25

> Generated: 2026-11-25 04:05 UTC | Tools covered: 7

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

# AI CLI Developer Tools — Cross-Tool Comparison Report
**Data date: 2026-11-25** | Sources: community digests for Claude Code, OpenAI Codex, Gemini CLI, GitHub Copilot CLI, OpenCode, Pi, and Qwen Code

---

## 1. Ecosystem Overview

The AI CLI landscape on 2026-11-25 is characterized by **release-driven velocity over community PR throughput**: Claude Code, Copilot CLI, and Qwen Code all shipped or staged changes through release branches and internal fix clusters, while only OpenCode and Pi show meaningful community PR activity. The dominant engineering theme is **the V1→V2 transition tax** — OpenCode and Qwen Code are both working through migration regressions (model routing, session storage, CI kernel migration), while Claude Code and Copilot CLI are absorbing "second-order" costs of mature adoption (prompt-cache thrashing, quota transparency, sandbox bypasses). **Security and sandbox integrity** emerged as a cross-cutting concern this cycle, with shell-permission bypasses found in OpenCode and `deniedPaths` read-snapshot leaks in Copilot CLI. Meanwhile, **long-session reliability** (compaction blowups, transcript index ceilings, background waits) is the single most repeated pain point across Pi, Qwen Code, and OpenCode — a signal that agentic workflows are now routinely exceeding the design envelope of these tools.

---

## 2. Activity Comparison

| Tool | Issues (updated 24h) | PRs (updated 24h) | Discussions | Release Status |
|---|---|---|---|---|
| **Claude Code** | ~10 hot + honorable mentions; 1 long-running top request (497 👍) | 1 (closed, no description) | N/A (not provided) | **v2.1.332 shipped** (MCP-sourced skills beta, `PreSkillShellCommand` hook) |
| **OpenAI Codex** | N/A | N/A | N/A | ⚠️ **Summary generation failed** — no data |
| **Gemini CLI** | N/A | N/A | N/A | ⚠️ **Summary generation failed** — no data |
| **GitHub Copilot CLI** | **35 issues updated** (highest volume) | 2 (both closed, devcontainer infra) | N/A (not provided) | **4 releases in 24h** (v1.0.116-0 → -3) |
| **OpenCode** | ~10 hot; heavy v2 regression cluster | ~10 notable (perf series + UX stack) | N/A (not provided) | **No release** |
| **Pi** | ~10 hot; enterprise/durable wave | ~10 notable (many merged/closed same-day) | N/A (not provided) | **No release** |
| **Qwen Code** | ~10 hot; CI-bot dominated | ~10 notable (CI repair + Managed Agent) | N/A (not provided) | **No release** |

**Data caveats:** Codex and Gemini CLI digests failed to generate — treat as **unknown**, not inactive. No tool in this set reported Discussion-channel data; Claude Code, Copilot CLI, OpenCode, Pi, and Qwen Code use GitHub Issues as their primary channel. Issue/PR counts are "updated in last 24h," not total open counts, and are digest-derived approximations.

---

## 3. Shared Feature Directions

Requirements appearing across **two or more** tool communities:

| Direction | Tools | Specific Needs |
|---|---|---|
| **Session lifecycle & persistence** | Claude Code, OpenCode, Pi, Qwen Code | Per-session delete/CRUD (Claude #26904), directory-scoped resume (Claude #111879), V1 session ID migration (OpenCode #62014), transcript index scaling (Qwen #13113), cross-worktree memory sharing (Qwen #18030) |
| **Sandbox / permission integrity** | OpenCode, Copilot CLI, Claude Code | Shell redirect bypass of permission checks (OpenCode #66053), `deniedPaths` read/snapshot leak (Copilot #5564), permission persistence across sessions (Copilot #3253), skill-time command gating (Claude `PreSkillShellCommand`) |
| **MCP reliability & enterprise readiness** | Claude Code, Copilot CLI, OpenCode, Pi | Duplicate-endpoint warnings (Copilot), Entra OAuth loopback failures (Copilot #5040), `list_changed` stream death (OpenCode #66072), stateless MCP protocol support (Pi #12479), MCP-sourced skills (Claude) |
| **Cost correctness & quota transparency** | Claude Code, OpenCode, Pi | Prompt-cache thrashing (Claude #105564), cross-backend re-billing (OpenCode #66067), idle cache warming never firing (Pi #10956), quota-drain complaints (Claude #105621) |
| **Long-session memory/compaction** | Claude Code, Pi, Qwen Code | Configurable `MEMORY.md` limits (Claude #79217), compaction summary blowup (Pi #12242), compaction customization (Claude #89797) |
| **Reasoning/thinking control fidelity** | Pi, Qwen Code | `reasoning_opaque` replay (Pi #12418), thinking-delta boundaries (Pi #12456), `<thinking>` leak to output (Qwen #10791) |
| **Editor/ACP parity** | Copilot CLI, Claude Code | Context-tier selection in ACP (Copilot #4275, shipped), VS 2026 integration (Claude #15942), ACP retry/fallback visibility (Qwen #14138) |
| **Windows platform friction** | Claude Code, Copilot CLI, Pi | CRLF forcing (Copilot #1148, fixed), BOM-less `.ps1` (Claude #90962), Git Bash discovery (Pi #12408), terminal restore on exit (Pi #12133) |
| **CLI ergonomics / backward compat** | OpenCode, Claude Code | `-m` on root command regression (OpenCode #56218), finer-grained session commands (Claude #85906) |

---

## 4. Differentiation Analysis

**Claude Code — Enterprise/IDE-integration flagship.** Largest user base signal (497 👍 on one request). Target: professional developers in mixed Windows/.NET and Unix shops. Approach: **release-driven feature delivery** (MCP skills, hook gating) with an enterprise policy layer (`PreSkillShellCommand`). Weakness: process friction — stale-closure churn and users re-filing closed regressions.

**GitHub Copilot CLI — Highest release cadence, editor-ecosystem play.** Four releases in 24h; closes parity gaps fast (ACP context tier). Target: users already inside GitHub/VS Code/Zed ecosystems. Approach: **rapid incremental shipping** with ACP as the integration surface. Weakness: platform-specific testing gaps (macOS TLS 1.3 regression) and sandbox integrity issues surfacing faster than they're fixed.

**OpenCode — Community-driven, performance-focused, V2 in transition.** Target: power users and self-hosters who value configurability. Approach: **transparent PR-driven iteration** — visible perf series (Code Mode) and a deep UX fix stack from a single contributor. Weakness: **V2 regression cluster** (model races, CLI flag removal, session storage) is the dominant community theme — a classic migration-rough-edge risk.

**Pi — Enterprise/durable-runtime adoption curve.** Target: teams running long-lived, headless/RPC agent harnesses. Approach: **protocol-forward** (stateless MCP 2026-07-28, OSC 7501 program-status reporting, Durable/Chord/Postgres backends). Weakness: non-interactive surface is outpacing its own reliability (unanswerable RPC dialogs, draft-proxy write drops).

**Qwen Code — CI-stability-constrained, Managed Agent productization.** Target: self-hosted and Chinese-language/APAC users (Arabic i18n PR signals broader non-English push). Approach: **heavy architectural migration** (1.0 Preview loop kernel) plus Managed Agent/SDK maturity. Weakness: **CI flakiness is the dominant friction** — auto-filed bot issues and structural gates block unrelated PRs.

**Codex & Gemini CLI — Insufficient data this cycle.** Cannot be positioned; their absence from the comparison is a data gap, not a signal.

---

## 5. Community Momentum & Maturity

**Momentum (activity intensity):**
1. **Copilot CLI** — 35 issues updated + 4 releases/24h. Highest raw throughput, but partly noise (triage churn).
2. **OpenCode** — largest PR volume and a coherent perf+UX push; strongest *community contribution* signal.
3. **Pi** — many PRs merged/closed same-day; fast maintainer responsiveness, enterprise adoption wave.
4. **Qwen Code** — high issue volume but **bot-generated**, which inflates counts without reflecting human demand.
5. **Claude Code** — moderate issue volume but **highest per-issue engagement** (👍 density); release cadence steady.

**Maturity (stability vs. velocity):**
- **Most mature surfaces:** Claude Code (hook/policy layer), Copilot CLI (ACP integration), Pi (protocol coverage).
- **Least mature / highest regression risk:** OpenCode (V2 transition), Qwen Code (CI + kernel migration).
- **Iteration speed:** Copilot CLI and Pi are shipping fastest; Claude Code is release-paced; OpenCode and Qwen Code are constrained by migration and CI debt respectively.

---

## 6. Trend Signals

Industry-level signals from this cycle's community feedback, with reference value for developers and decision-makers:

1. **Agentic sessions are outgrowing tool design envelopes.** Compaction blowups (Pi), transcript index ceilings (Qwen), and 100% CPU spin (Claude) all point to the same root cause: long-running, multi-turn agent workflows now routinely exceed assumptions baked into v1 architectures. **Reference:** if you run long sessions, budget for compaction tuning and session-size limits; treat these as first-class operational concerns.

2. **Security is shifting from "auth" to "sandbox integrity."** The most serious findings this cycle were bypasses and leaks, not credential bugs: shell redirects escaping permission checks (OpenCode), denied paths being read and snapshotted (Copilot), and multi-agent cross-session commits (Claude #111384). **Reference:** audit your tool's permission model against redirection, path-denial, and multi-agent isolation before trusting it in CI or shared repos.

3. **Cost correctness is becoming a trust differentiator.** Cache thrashing, cross-backend re-billing, and idle warming failures are all "invisible" cost bugs — users pay without seeing why. **Reference:** demand per-turn cost visibility and honest quota UI; these are now selection criteria, not nice-to-haves.

4. **MCP is maturing toward enterprise requirements.** Duplicate-endpoint warnings, OAuth callback compatibility, `list_changed` resilience, and stateless protocol support show MCP moving from "does it connect?" to "does it survive redeploys and enterprise IdPs?" **Reference:** validate MCP integrations against Entra/OIDC and long-lived stream drop scenarios.

5. **Windows remains the highest-friction platform — but fixes are landing.** CRLF forcing (Copilot, fixed), BOM-less PowerShell writes (Claude), Git Bash discovery (Pi), and terminal-restore bugs recur across all five reporting tools. **Reference:** Windows/.NET teams should expect to be the primary bug reporters and should track cross-platform test coverage as a vendor-selection factor.

6. **V1→V2 migrations are the biggest near-term risk.** OpenCode's regression cluster and Qwen's kernel migration both show that architectural transitions temporarily degrade reliability. **Reference:** pin versions and stage upgrades for team-wide deployments during active migration windows.

7. **Headless/CI adoption is outpacing non-interactive surface quality.** Pi's RPC dialog gaps, Qwen's capture-tui flake, and Copilot's session-wedge bugs all affect automated workflows. **Reference:** if you drive these tools from CI or orchestration harnesses, test timeout/abort/cleanup paths explicitly — they are the least-polished surfaces.

---

*Report compiled from digest-derived, 24-hour snapshots. Codex and Gemini CLI are excluded from all comparative rankings due to failed summary generation — their absence is a data limitation, not an activity signal. Verify current state against canonical repositories before acting on specific issue numbers.*

---

## Per-Tool Reports

<details>
<summary><strong>Claude Code</strong> — <a href="https://github.com/anthropics/claude-code">anthropics/claude-code</a></summary>

## Claude Code Skills Highlights

> Source: [anthropics/skills](https://github.com/anthropics/skills)

# Claude Code Skills — Community Highlights Report
*Data snapshot: 2026-11-25 · Source: github.com/anthropics/skills*

---

## 1. Top Skills Ranking

*Note: The PR dataset supplies `Comments: undefined`, so ranking below uses visible engagement signals (👍, update recency, follow-up fixes/issues referencing the PR).*

| # | Skill / PR | Function | Discussion Highlight | Status |
|---|---|---|---|---|
| 1 | **[#514 document-typography](https://github.com/anthropics/skills/pull/514)** | Typographic QC for generated docs — orphan/widow control, numbering alignment | Cross-cutting pain: affects *every* Claude-generated document | OPEN |
| 2 | **[#1771 proofcore-contract-auditor](https://github.com/anthropics/skills/pull/1771)** | Static analysis of Solidity/Rust contracts + Merkle audit proofs on TON | First Web3/notarization skill; contested scope & trust model | OPEN |
| 3 | **[#1703 md2video-audio](https://github.com/anthropics/skills/pull/1703)** | Markdown → MP4 with Marp slides + TTS voiceover | Zero-cost pipeline; novel modality beyond text/code | OPEN |
| 4 | **[#1742 mcp-builder fix](https://github.com/anthropics/skills/pull/1742)** | Repairs `mcp>=2` `streamable_http_client` + custom headers | Breaks the flagship MCP scaffolding skill; high blast radius | OPEN |
| 5 | **[#1245 notion-spec-to-implementation](https://github.com/anthropics/skills/pull/1245)** | Spec → Notion tasks w/ acceptance criteria & tracking | Bundles 2 skills (also resume-auditor); reviewer pushback on scope | OPEN |
| 6 | **[#525 pyxel](https://github.com/anthropics/skills/pull/525)** | Retro game dev in Python — headless runs, frame inspection | Oldest surviving open PR (Mar 2026); still updated Nov | OPEN |
| 7 | **[#1615 scnet-hpc](https://github.com/anthropics/skills/pull/1615)** | SCNet HPC via profile SSH + Slurm workflows | First HPC/infra ops skill; niche but deep | OPEN |
| 8 | **[#1681 skill-creator packaging fix](https://github.com/anthropics/skills/pull/1681)** | Fixes `ModuleNotFoundError` when running `package_skill.py` standalone | Meta-skill reliability; blocks community skill authors | OPEN |

**Pattern:** Top-ranked items cluster around **meta-tooling fixes** (mcp-builder, skill-creator) and **document quality**, not flashy new domains.

---

## 2. Community Demand Trends

Distilled from the 15 top Issues:

| Trend | Evidence | Demand Signal |
|---|---|---|
| **Trust & provenance** | [#492 namespace impersonation (46 comments, highest)](https://github.com/anthropics/skills/issues/492) | Community skills squatting `anthropic/` namespace — #1 topic by far |
| **Skill distribution / sharing** | [#228 org-wide sharing (17c, 8👍)](https://github.com/anthropics/skills/issues/228), [#189 duplicate plugins (6c, 9👍)](https://github.com/anthropics/skills/issues/189) | Users want a shared library; current Slack-and-upload flow is broken |
| **Eval / trigger reliability** | [#556 0% trigger rate (13c, 7👍)](https://github.com/anthropics/skills/issues/556), [#1352 parallel UUID cross-match](https://github.com/anthropics/skills/issues/1352) | `run_eval.py` silently reports false negatives — undermines skill quality gates |
| **Context budget discipline** | [#1487 claude-api injects ~156k tokens](https://github.com/anthropics/skills/issues/1487) | Skills must be lazy-loaded; eager injection is a hard blocker |
| **Reasoning/quality pipelines** | [#1385 three-gate calibration→adversarial→verification](https://github.com/anthropics/skills/issues/1385) | Requests for lifecycle-wide quality enforcement |
| **Agent memory compaction** | [#1329 compact-memory symbolic notation](https://github.com/anthropics/skills/issues/1329) | Long-running agent state as a first-class skill domain |
| **Governance/safety patterns** | [#412 agent-governance (closed)](https://github.com/anthropics/skills/issues/412) | Policy enforcement, threat detection, audit trails |

**Non-Skill drift:** [#1143 change account email (7c, 20👍)](https://github.com/anthropics/skills/issues/1143) — platform feature, not skill scope.

---

## 3. High-Potential Pending Skills

Active-comment / recently-updated PRs with strong merge likelihood:

- **[#1792 docx LibreOffice timeout → error](https://github.com/anthropics/skills/pull/1792)** — Correctness fix; verifies output before claiming success. Updated Nov 1.
- **[#2019 xlsx external_links_at_risk](https://github.com/anthropics/skills/pull/2019)** — Fixes false negatives for worksheet-scoped defined names (closes #2013). Updated Nov 3.
- **[#1977 algorithmic-art wrapAround](https://github.com/anthropics/skills/pull/1977)** & **[#1976 element_discovery](https://github.com/anthropics/skills/pull/1976)** & **[#1975 pptx --cols validation](https://github.com/anthropics/skills/pull/1975)** — Same author (gerardrecinto) filing tight, well-scoped bug fixes with linked issues; likely to land as a batch.
- **[#1950 claude-api pause_turn guidance](https://github.com/anthropics/skills/pull/1950)** — Docs sync with Python SDK 1.1.0 auto-resumption. Updated Nov 10.
- **[#2108 document skills snapshot docs](https://github.com/anthropics/skills/pull/2108)** — Clarifies sync relationship & export milestones. Low-risk merge.
- **[#1980 webapp-testing shell=True → CWE-78 fix](https://github.com/anthropics/skills/pull/1980)** — Security hardening; easy reviewer win.

**Observation:** The path to merge is shortest for **bug fixes with linked Issues**, not new skill proposals.

---

## 4. Skills Ecosystem Insight

> **The community's most concentrated demand is not for new Skill domains but for *trust and reliability infrastructure* — secure namespacing, working distribution, and trustworthy trigger evaluation — because the existing skill supply is only as valuable as the community's ability to verify, share, and safely install it.**

---

### Quick Links
- Repo: https://github.com/anthropics/skills
- Hottest Issue: [#492 namespace trust boundary](https://github.com/anthropics/skills/issues/492)
- Oldest surviving PR: [#525 pyxel](https://github.com/anthropics/skills/pull/525)

---

# Claude Code Community Digest — 2026-11-25

## 1. Today's Highlights

Release v2.1.332 lands MCP-server-sourced skills (beta) plus a new `PreSkillShellCommand` hook for intercepting inline shell commands at skill load time. Community attention is split between a long-running Windows/Visual Studio 2026 integration request (497 👍) and a fresh crop of correctness bugs — PowerShell BOM handling, prompt-cache thrashing on second turns, and a 0-byte plugin marketplace file that silently disables all plugins. Cost and permissions complaints (draining usage limits, over-strict credential prompts) continue to dominate bug reports.

## 2. Releases

**v2.1.332** ([release](https://github.com/anthropics/claude-code/releases))
- **MCP server skills (beta):** Skills served from MCP servers now appear in the `/` menu as `server:skill`; locally-defined skills keep their plain names. This is the first step toward a distributed/extensible skill surface.
- **`PreSkillShellCommand` hook:** A new hook event that can *refuse* the inline shell commands a skill or command would run as it loads. On 2.1.331 and older, naming this event in a settings file produc… (release note truncated) — i.e., there's a migration consideration for anyone with older settings files.
- Practical takeaway: hook authors and enterprise policy teams should review the new event; it's the first gate-point for skill-time command execution.

## 3. Hot Issues

1. **[#15942](https://github.com/anthropics/claude-code/issues/15942) — Visual Studio 2026 integration (OPEN, 158 comments, 497 👍).** The single most-upvoted open request and the loudest signal in the tracker. Windows/.NET shops want parity with the existing VS Code and JetBrains integrations; the thread's comment count suggests sustained pressure. Likely the marquee IDE gap heading into 2027.

2. **[#26904](https://github.com/anthropics/claude-code/issues/26904) — `/delete` command for current session (OPEN, 28 comments, 115 👍).** Session hygiene is a recurring theme; users want to remove a session without the coarse `claude project purge`. High engagement indicates this is a frequent daily annoyance.

3. **[#90708](https://github.com/anthropics/claude-code/issues/90708) — Desktop: restore context-usage indicator (OPEN, 21 comments).** A UX regression report: the footer's 5-hour usage ring replaced the context-window gauge. For long agentic sessions, context headroom (am I about to compact?) is the more decision-relevant number. Clear product feedback with a concrete alternative (make the widget configurable).

4. **[#79217](https://github.com/anthropics/claude-code/issues/79217) — Make `MEMORY.md` size limit configurable (OPEN, 14 comments).** The 200-line/25KB auto-memory cap is hardcoded; power users with large project memory want to tune it. Low 👍 but persistent discussion — a "small config change, big workflow impact" request.

5. **[#105621](https://github.com/anthropics/claude-code/issues/105621) — Usage limits draining faster since mid-October (OPEN, 13 comments).** Max-tier Windows desktop users report materially faster quota consumption with unchanged workflows. Labeled duplicate but still active — cost-per-work complaints are a reputational risk for the subscription tiers.

6. **[#77473](https://github.com/anthropics/claude-code/issues/77473) — Built-in browser lacks WebAuthn/passkey support on macOS (OPEN, has repro, 17 👍).** Blocks GitHub login entirely for passkey-only users. A hard blocker, not a nitpick — good repro quality makes this tractable.

7. **[#83841](https://github.com/anthropics/claude-code/issues/83841) — macOS 26 re-prompts "access data from other apps" every session (OPEN, 11 comments, 12 👍).** Permission prompt cannot be cleared; the helper-binary launch path (`disclaimer` exec'ing a differently-signed binary) is the suspected cause. Repeated modal friction on every launch.

8. **[#90962](https://github.com/anthropics/claude-code/issues/90962) — `Write` emits `.ps1` without BOM; PowerShell 5.1 mojibake silently kills scheduled scripts (OPEN, has repro).** A nasty correctness bug: UTF-8-without-BOM is misparsed as ANSI, and the failure is *silent* under Task Scheduler (0x80070001, no log). Filed semi-autonomously by an AI agent, with an explicit "re-run to verify" framing.

9. **[#105564](https://github.com/anthropics/claude-code/issues/105564) — Second turn re-writes ~17k session-start context to prompt cache (OPEN).** Every new session pays an avoidable cache-write on turn 2 even though the block is identical to turn 1's. Low visibility, high aggregate cost impact — exactly the kind of efficiency bug that matters at scale.

10. **[#104402](https://github.com/anthropics/claude-code/issues/104402) — Deleting `<cwd>\.claude` mid-session pins `claude.exe` at 100% of a core (OPEN, has repro, duplicate of stale-closed #77983/#88913).** Windows-only, permanent spin, regressed across versions. The fact that prior reports were auto-closed as stale without a fix is itself a community grievance.

*Honorable mentions:* [#112096](https://github.com/anthropics/claude-code/issues/112096) (0-byte `known_marketplaces.json` silently disables all plugins, follow-up to closed-as-inactive #94451), [#111384](https://github.com/anthropics/claude-code/issues/111384) (model used `git commit -am` and pushed other sessions' WIP despite a memory rule against it — multi-agent safety), [#104216](https://github.com/anthropics/claude-code/issues/104216) (un-silenceable "hook was skipped" notices on Team/Enterprise).

## 4. Key PR Progress

Only one PR updated in the last 24h, and it carries no description:

- **[#45553](https://github.com/anthropics/claude-code/pull/45553) — "resolve duplicate IPs" (CLOSED, updated 2026-11-24).** Closed, no summary provided, created back in April 2026. Nothing actionable to extract; noted for completeness.

There is no meaningful PR activity to rank this cycle. The repository's development surface is effectively release-driven right now — feature movement is visible in v2.1.332 and the issue tracker, not in open pull requests.

## 5. Hot Discussions

No Discussions data was provided for this period; section omitted.

## 6. Feature Request Trends

Distilling today's open enhancement issues, four directions dominate:

- **Session lifecycle management.** `/delete` for the current session ([#26904](https://github.com/anthropics/claude-code/issues/26904)), a finer-grained `claude session` command ([#85906](https://github.com/anthropics/claude-code/issues/85906)), and directory-scoped resume so `claude -c` doesn't jump across projects ([#111879](https://github.com/anthropics/claude-code/issues/111879)). Users clearly want per-session CRUD, not project-wide purge.
- **Multi-session / parallel-work visibility.** Desktop sidebar status and last-activity indicators ([#107819](https://github.com/anthropics/claude-code/issues/107819)), project overview pages ([#106064](https://github.com/anthropics/claude-code/issues/106064)), master/detail agent view ([#109379](https://github.com/anthropics/claude-code/issues/109379)), cross-project coordination with shared work views and claims ([#110284](https://github.com/anthropics/claude-code/issues/110284)), and multi-context sessions for parallel PR review ([#109117](https://github.com/anthropics/claude-code/issues/109117)). The "many concurrent agents" workflow is outgrowing the current UI.
- **Remote Control integration parity.** Surface RC sessions in `/resume` and add `claude rc list-sessions` ([#94369](https://github.com/anthropics/claude-code/issues/94369)); draw mod themes in RC sessions ([#110383](https://github.com/anthropics/claude-code/issues/110383)). Phone-started sessions are currently second-class citizens on desktop.
- **Tunable core behavior.** Configurable `MEMORY.md` limits ([#79217](https://github.com/anthropics/claude-code/issues/79217)), compaction customization backed by a 354-case measurement set ([#89797](https://github.com/anthropics/claude-code/issues/89797)), and task-list tools (`TaskCreate`/`TaskGet`/`TaskList`/`TaskUpdate`) made available in background subagents ([#112092](https://github.com/anthropics/claude-code/issues/112092)).

## 7. Developer Pain Points

Recurring frustrations across today's tracker:

- **Platform gaps on Windows.** Missing VS 2026 IDE support ([#15942](https://github.com/anthropics/claude-code/issues/15942)), BOM-less `.ps1` writes breaking PowerShell 5.1 ([#90962](https://github.com/anthropics/claude-code/issues/90962)), 100%-core spin after deleting `.claude` mid-session ([#104402](https://github.com/anthropics/claude-code/issues/104402)), and a silently unrepairable marketplace manifest ([#112096](https://github.com/anthropics/claude-code/issues/112096)). Windows remains the highest-friction platform by volume.
- **Cost and quota transparency.** Faster quota drain ([#105621](https://github.com/anthropics/claude-code/issues/105621)), misleading fast-mode state ([#100998](https://github.com/anthropics/claude-code/issues/100998)), and avoidable prompt-cache rewrites ([#105564](https://github.com/anthropics/claude-code/issues/105564)). Users want both cheaper behavior and honest UI about what's consuming budget.
- **Permission and auth friction.** Over-strict credential prompts ([#112098](https://github.com/anthropics/claude-code/issues/112098)), unbidden macOS data-access re-prompts ([#83841](https://github.com/anthropics/claude-code/issues/83841)), passkey/WebAuthn gaps in the built-in browser ([#77473](https://github.com/anthropics/claude-code/issues/77473)), and a false-positive ban lost in a support automation loop ([#111617](https://github.com/anthropics/claude-code/issues/111617)). Security versus ergonomics is the core tension.
- **Silent failures and stale-closure churn.** BOM mojibake with no log ([#90962](https://github.com/anthropics/claude-code/issues/90962)), a 0-byte config disabling all plugins without a message ([#112096](https://github.com/anthropics/claude-code/issues/112096)), and regressions that were auto-closed as stale and then resurfaced ([#104402](https://github.com/anthropics/claude-code/issues/104402), [#112096](https://github.com/anthropics/claude-code/issues/112096)). Contributors are starting to file follow-ups specifically to re-litigate closed reports — a process signal worth noting.
- **Multi-agent safety.** A model running `git commit -am` and pushing another session's ~20 WIP files despite an explicit memory rule ([#111384](https://github.com/anthropics/claude-code/issues/111384)) is a concrete example of the containment gap for parallel sessions. Expect this category to grow with agent-view and Projects adoption.

</details>

<details>
<summary><strong>OpenAI Codex</strong> — <a href="https://github.com/openai/codex">openai/codex</a></summary>

⚠️ Summary generation failed.

</details>

<details>
<summary><strong>Gemini CLI</strong> — <a href="https://github.com/google-gemini/gemini-cli">google-gemini/gemini-cli</a></summary>

⚠️ Summary generation failed.

</details>

<details>
<summary><strong>GitHub Copilot CLI</strong> — <a href="https://github.com/github/copilot-cli">github/copilot-cli</a></summary>

# GitHub Copilot CLI Community Digest — 2026-11-25

## 1. Today's Highlights

A rapid-fire release cycle continues with **v1.0.116-0 through v1.0.116-3** landing within 24 hours, headlined by ACP editor parity for context tier selection (closing a long-standing parity gap with the interactive `/model` picker), structured environment variables for subprocesses, and an MCP duplicate-endpoint warning in `/mcp`. The issue tracker remains highly active with **35 issues updated**, surfacing a notable new **TLS 1.3 regression on macOS** since 1.0.93-0 and multiple fresh triage items including a session-host hang without timeout and a sandbox `deniedPaths` bypass. Meanwhile, the CRLF line-ending bug (#1148) — one of the most upvoted issues in the repo — was finally **closed** after ~10 months.

## 2. Releases

Four releases shipped in the last 24 hours as part of the 1.0.116 line:

| Version | Key Changes |
|---|---|
| **v1.0.116-3** | New "Jump to latest" control in the fullscreen timeline to resume output-following; per-model context size selection in ACP-compatible editors without mutating saved defaults; environment variable injection for every process Copilot spawns. |
| **v1.0.116-2** | Warns when a plugin and a standalone MCP server target the same endpoint, with `/mcp` guidance to disable one; fixes for canceling pending prompts without waiting on activity refresh, and idle sessions incorrectly shown as busy after host reconnect. |
| **v1.0.116-1** | Same MCP duplicate-endpoint warning and cancellation/idle-state fixes as -2 (incremental build). |
| **v1.0.116-0** | Suppresses redundant slow-connection/sign-in warnings for org-managed MCP servers (Connectors excepted) and flags sign-in needs in the startup summary; MCP status summary at startup; `/mcp auth <name>` now blocks before browser launch. |
| **v1.0.115** (2026-11-23) | Structured clarification questions in ACP editors supporting forms; Windows sandbox package queries enabled by default (opt-out via `sandbox.userPolicy.capabilities=[]`); macOS Mach service allowlisting via `sandbox.userPolicy.seatbelt`. |

The context-tier ACP addition directly closes **#4275**, indicating responsive maintainer turnaround on editor-integration parity requests.

## 3. Hot Issues

1. **[#1148 [CLOSED] CRLF line endings forced on all touched files](https://github.com/github/copilot-cli/issues/1148)** — 8 comments, 9 👍. Open since January, this Windows platform bug silently rewrote LF files to CRLF on every edit. Its closure is a significant quality-of-life win for cross-platform repos and Windows/POSIX mixed teams.

2. **[#4275 [CLOSED] ACP: expose contextTier as session config option](https://github.com/github/copilot-cli/issues/4275)** — 8 comments, 5 👍. A GitKraken-authored parity request now delivered in v1.0.116-3, closing the gap between interactive `/model` tier selection and ACP clients.

3. **[#2165 [OPEN] Ubuntu keychain support is broken](https://github.com/github/copilot-cli/issues/2165)** — 7 comments, **23 👍** (highest engagement). Documents incorrect troubleshooting docs plus missing `secret-tool` dependency handling. Still `more-info-needed` after 8 months — a persistent auth pain point on Linux.

4. **[#5323 [OPEN] Setting to disable agent checkpoint refs (`refs/agents/*`)](https://github.com/github/copilot-cli/issues/5323)** — 7 comments, 5 👍. Agent turns author commits under the user's own git identity, polluting `git log --all` and ref-rendering tools. A repo-hygiene concern with broad tooling implications.

5. **[#5171 [CLOSED] NumLock-off numpad navigation ignored](https://github.com/github/copilot-cli/issues/5171)** — 6 comments. A Windows Terminal input regression affecting accessibility and muscle-memory navigation; now resolved.

6. **[#5040 [OPEN] MCP OAuth: Entra rejects 127.0.0.1 callback (AADSTS50011)](https://github.com/github/copilot-cli/issues/5040)** — 4 comments. Remote MCP servers behind Microsoft Entra ID fail auth due to loopback callback restrictions with no `localhost` host override. Blocks enterprise MCP adoption.

7. **[#4755 [OPEN] Session wedges permanently when queued message lands at turn end](https://github.com/github/copilot-cli/issues/4755)** — 3 comments. A non-crashing deadlock where sessions accept no input and require process kill — a serious reliability concern for long-running workflows.

8. **[#5559 [OPEN] [Regression] TLS 1.3 broken on macOS since 1.0.93-0](https://github.com/github/copilot-cli/issues/5559)** — 2 comments, newly filed. Breaks streamable-HTTP MCP connections (e.g., Jenkins MCP server). Regression flags merit urgent triage.

9. **[#4976 [OPEN] BYOK: Support multiple external models/providers](https://github.com/github/copilot-cli/issues/4976)** — 2 comments, **8 👍**. Requests parity with the Copilot app's multi-provider BYOK configuration, currently limited to a single provider/model in the CLI.

10. **[#5564 [OPEN] Sandbox `deniedPaths` files still read and backed up](https://github.com/github/copilot-cli/issues/5564)** — 0 comments, fresh triage. The `edit` tool reads and snapshots denied files into `~/.copilot/session-state/.../rewind-file-snapshots/` before rejecting the edit — a sandbox-integrity and data-exposure concern worth immediate attention.

## 4. Key PR Progress

Only two PRs were updated in the last 24 hours, both now closed:

1. **[#4316 [CLOSED] Create devcontainer.json](https://github.com/github/copilot-cli/pull/4316)** — Adds a development container definition to streamline contributor onboarding and reproducible dev environments.

2. **[#4428 [CLOSED] Add initial devcontainer configuration](https://github.com/github/copilot-cli/pull/4428)** — Companion/maturation of the devcontainer effort ("LGTM"). Together these represent incremental contributor-experience infrastructure rather than product features.

Note: PR throughput is minimal; the project's velocity is concentrated in release branches and issue triage rather than community PRs.

## 5. Hot Discussions

No Discussion data was provided for this digest period, so this section is omitted.

## 6. Feature Request Trends

Distilling the current issue set, the dominant feature directions are:

- **Editor/ACP parity**: Exposing interactive-only capabilities (context tier, structured forms) to ACP hosts — driven by editor vendors like GitKraken and Zed.
- **Configurable defaults & policy**: Default agent selection (#5383), disabling agent checkpoint refs (#5323), and sandbox capability opt-outs (#5564 area).
- **Multi-provider BYOK**: Moving beyond a single external model/provider to match the Copilot app (#4976).
- **MCP enterprise readiness**: OAuth callback compatibility (#5040), registry request headers (#5568), and re-authentication flows outside the CLI (#5175).
- **Accessibility & input fidelity**: Screen-reader editing (#1573), markdown rendering in `ask_user` prompts (#5084), and keyboard/numpad handling (#5171).

## 7. Developer Pain Points

Recurring frustrations visible across the tracker:

- **Terminal rendering fragility**: Clipped/lost responses (#3541, #5563), clipboard failures under WSL→tmux/screen (#4191), and literal markdown in structured prompts (#5084) collectively erode trust in long-form output.
- **Sandbox and permission integrity**: Permissions not persisting across sessions (#3253), `deniedPaths` read/snapshot bypass (#5564), and opaque sandbox behavior.
- **Session lifecycle reliability**: Permanent wedging (#4755), indefinite `create_session` hangs without timeout (#5565), and SIGINT leaving orphaned model work reported as success (#4863).
- **Authentication on Linux and enterprise MCP**: Broken Ubuntu keychain support (#2165) and Entra OAuth failures (#5040) disproportionately block Linux and enterprise users.
- **Cross-platform regressions**: Windows CRLF (#1148, now fixed) and macOS TLS 1.3 breakage (#5559) highlight platform-specific testing gaps.

---

*Generated from github.com/github/copilot-cli activity on 2026-11-25. Issue and PR links point to the canonical repository.*

</details>

<details>
<summary><strong>OpenCode</strong> — <a href="https://github.com/anomalyco/opencode">anomalyco/opencode</a></summary>

# OpenCode Community Digest — 2026-11-25

## 1. Today's Highlights

No new releases landed in the last 24 hours, but the issue tracker is extremely active: a cluster of **v2 regressions** (model routing, session storage, shell permission bypasses, MCP list_changed, and desktop search) dominate the board. The PR queue shows maintainers aggressively pushing **performance work in Code Mode** and a long, careful stack of **timeline/reader UX fixes** from contributor Hona, alongside a new **push notification** feature draft for mobile.

## 2. Releases

No new releases were published in the last 24 hours.

## 3. Hot Issues

1. **[#64073] Restore Foreground Subagent Execution** — *OPEN, 27 comments, 12 👍*
   The single most-discussed open issue. Users want subagents to be able to run in the foreground again, implying a significant workflow regression in how subagent execution is surfaced. High engagement (both comments and reactions) suggests this is a blocker for multi-agent workflows.
   https://github.com/anomalyco/opencode/issues/64073

2. **[#52958] OpenCode Go: all payment methods declined from Italy (EU)** — *OPEN, 27 comments, 5 👍*
   A long-running billing failure blocking an entire region from subscribing. Multiple payment methods (card, Apple Pay, Stripe Link, virtual Mastercard) all fail, which points to a systemic payment-provider or geo-fencing problem rather than user error.
   https://github.com/anomalyco/opencode/issues/52958

3. **[#66067] Go: stable session routed across multiple deepseek-v4.1-flash backends, re-billing full prefix** — *OPEN, 19 comments*
   A serious cost-correctness bug: a single conversation with a stable `x-opencode-session` header gets split across ≥3 upstream backends, each with its own prompt cache, so the full prefix is re-billed on every switch. Directly impacts user costs and is likely to escalate fast.
   https://github.com/anomalyco/opencode/issues/66067

4. **[#48411] Better execution permissions and sandboxing** — *OPEN, 14 comments, 7 👍*
   Requests three improvements to execution controls, including easier access to permission mode. This ties directly into the security-themed issues below and reflects sustained demand for a more robust sandbox model.
   https://github.com/anomalyco/opencode/issues/48411

5. **[#66053] `cd . > file` style redirected directory commands skip all shell permission checks** — *OPEN, repro-simulated*
   A genuine security bypass: `ShellParse.scan` drops directory-changing commands when they include I/O redirection, so `cd . > /tmp/out` and similar escape permission checks entirely. High-severity given the sandboxing theme.
   https://github.com/anomalyco/opencode/issues/66053

6. **[#56218] v2: `opencode -m provider/model` no longer accepted on root command** — *OPEN, 7 comments, 5 👍*
   A clear CLI regression from v1: `-m` only exists on subcommands now, breaking scripts and muscle memory. Small surface area, wide impact on CLI-driven workflows.
   https://github.com/anomalyco/opencode/issues/56218

7. **[#66110] v2: new session sometimes gets built-in default model (`opencode/big-pickle`) instead of configured model** — *OPEN, repro-simulated*
   Intermittent model-selection race where the configured `model` is ignored but `small_model` still fires for titles. Confusing and hard to diagnose for users paying for a specific provider.
   https://github.com/anomalyco/opencode/issues/66110

8. **[#66072] MCP: `list_changed` stops permanently once the `subscriptions/listen` stream ends** — *OPEN, repro-simulated*
   On modern MCP connections, tool/prompt/resource change notifications silently die if the listen stream drops (redeploy, idle timeout, serverless limit). Affects long-lived MCP integrations.
   https://github.com/anomalyco/opencode/issues/66072

9. **[#65962] Desktop 2.4.1: Ctrl+F does nothing in conversation; Find hidden from palette** — *OPEN*
   A desktop UX regression removing in-conversation search entirely. Combined with the Hona PR stack around timeline focus/reader position, search and navigation in long sessions is clearly an active pain area.
   https://github.com/anomalyco/opencode/issues/65962

10. **[#66146] Deleting a git worktree wipes project skills from the shared registry** — *CLOSED, 4 comments*
    Deleting a worktree causes the shared background service to rescan from the deleted (now empty) directory, wiping skills for *all other* projects. Closed quickly, but a scary blast-radius bug worth a regression test.
    https://github.com/anomalyco/opencode/issues/66146

## 4. Key PR Progress

1. **[#66257] fix(app): send crashes to Sentry only when Report is clicked** — *OPEN, contributor*
   Privacy fix: crash reports now require explicit user consent via the Report button rather than auto-uploading.
   https://github.com/anomalyco/opencode/pull/66257

2. **[#66130] feat(core): add push notifications for the mobile apps** — *OPEN, draft*
   Adds server-side push notification support for mobile clients. A draft that will iterate; signals a mobile-first direction.
   https://github.com/anomalyco/opencode/pull/66130

3. **[#66254] feat(core): trace background compaction and the wait for it** — *OPEN*
   Adds tracing for background compaction waits (one observed wait: 111 s). Observability for a previously invisible latency source.
   https://github.com/anomalyco/opencode/pull/66254

4. **[#66251] perf(codemode): skip redundant schema work in Code Mode catalogs** — *OPEN*
   Removes four unnecessary schema operations. Part of a rapid perf series (#66242 → #66250 → #66251).
   https://github.com/anomalyco/opencode/pull/66251

5. **[#66250] perf(core): cut repeated work in Code Mode runs** — *OPEN*
   Removes four pieces of repeated work in Code Mode with no output change.
   https://github.com/anomalyco/opencode/pull/66250

6. **[#66246] perf(core): diff file changes once and skip diffing empty sides** — *OPEN*
   Makes every write/edit/patch/`Bun.write` cheaper by computing file diffs once and skipping empty comparisons.
   https://github.com/anomalyco/opencode/pull/66246

7. **[#66242] fix(core): stop Code Mode `Bun.write` from walking every byte of a Uint8Array** — *CLOSED*
   Fixes a reported server-restart-mid-session issue caused by `Bun.write` blocking on byte-by-byte traversal. Root of the perf series above.
   https://github.com/anomalyco/opencode/pull/66242

8. **[#62014] fix(core): do not reuse an unmigrated V1 session ID on create** — *OPEN*
   Closes #61947: continuing an unmigrated V1 session by ID previously missed the V2 lookup. Important for upgrade continuity.
   https://github.com/anomalyco/opencode/pull/62014

9. **[#66144] fix(ui): keep the reader's place when focus is rescued** — *OPEN*
   Prevents readers deep in history from being jumped to the latest message when focus is rescued (e.g., closing Find). One of many stacked reader-position fixes (#66188, #66173, #66156, #66054).
   https://github.com/anomalyco/opencode/pull/66144

10. **[#66247] fix(app): send quotes as plain reply-style blockquotes** — *CLOSED*
    Changes how desktop quotes are sent to the model (blockquote + comment), with matching docs update in #66248.
    https://github.com/anomalyco/opencode/pull/66247

## 5. Hot Discussions

No GitHub Discussions data was provided in the source dataset; this section is omitted.

## 6. Feature Request Trends

- **Foreground / subagent execution control** (#64073): restoring and refining how subagents run and are surfaced.
- **Execution permissions & sandboxing** (#48411, #66053): demand for accessible permission modes and airtight shell command checks.
- **Network / remote-only mode for desktop** (#64298): users want to disable the bundled local server and run remote-only.
- **Configurability & localization** (#66087 cost display in CNY, #66203 model variant stickiness, #47836 default-model binding): persistent requests to make defaults and displays configurable rather than hardcoded.
- **Accessibility** (#57512, #54652): screen-reader announcement of streaming content remains a recurring, only partially-addressed ask.
- **CLI compatibility** (#56218): restoring v1 CLI ergonomics (`-m` on root command).

## 7. Developer Pain Points

- **V2 regressions are the dominant theme.** Model selection races (#66110), CLI flag removal (#56218), session storage resets (#66124), and config-driven custom providers not registering on service boot (#66166) all point to rough edges in the V1→V2 transition.
- **Security/sandboxing gaps.** #66053 (redirected `cd` bypassing permission checks) and #48411 (better sandboxing) show users are probing — and finding — holes in shell permission enforcement.
- **MCP reliability.** #66072 (`list_changed` dying permanently) highlights fragility in long-lived MCP streams.
- **Cost correctness.** #66067 (session routed across backends, re-billing full prefix) and #52958 (regional payment failures) both directly affect users' wallets and trust.
- **Latency & hangs.** #66254 (background compaction waits up to 111 s) and #66121 (`opencode-pty` busy-loop causing shell timeouts) show intermittent but severe blocking behavior.
- **Session/UI state integrity.** #61189 (history replay truncation) and the large Hona PR stack around timeline focus and reader position indicate that long-session navigation is a known, actively-worked pain area.

</details>

<details>
<summary><strong>Pi</strong> — <a href="https://github.com/earendil-works/pi">earendil-works/pi</a></summary>

# Pi Community Digest — 2026-11-25

## 1. Today's Highlights

No new releases landed in the last 24 hours, but the issue tracker and PR queue were extremely active: Windows shell/terminal handling, GitHub Copilot model visibility, and streaming/compaction robustness dominated the day. A notable wave of "untriaged" bugs filed on 2026-11-25 (Kimi streaming, Durable commit semantics, Chord/Postgres backend, transcript sidecars) signals growing enterprise/durable-runtime adoption. Several high-value fixes already merged or opened today, including OSC 7501 startup-dialog reporting and OpenAI `reasoning_opaque` replay.

## 2. Releases

No new releases in the last 24 hours.

## 3. Hot Issues

1. **[#10956](https://github.com/earendil-works/pi/issues/10956) — `cacheWarming: "idle"` never fires with custom/compaction messages (OPEN, 17 comments, 👍5)**
   The most-discussed open issue: 507 `cache_warming_decision` events all at `continuationProbability: 1`, none at 0.15, so idle cache warming silently never triggers. High community engagement (👍5) because it affects cost/latency for long sessions with extensions.

2. **[#12242](https://github.com/earendil-works/pi/issues/12242) — Compaction summary grows unboundedly across compactions (OPEN)**
   Summary balloons from 17k → 164k chars over nine compactions; the ninth took 588s and 75k output tokens. The "PRESERVE all existing information" prompt is the suspected culprit. Critical for long-running agent sessions.

3. **[#12133](https://github.com/earendil-works/pi/issues/12133) — Windows terminal left with mouse/Kitty input reporting enabled after exit (CLOSED)**
   PowerShell prompt floods with SGR mouse/Kitty escape sequences after quitting. Classic terminal-restore bug; closed today, likely paired with a follow-up fix.

4. **[#12224](https://github.com/earendil-works/pi/issues/12224) — MCP SSE repeatedly concatenates and rescans incomplete large events (CLOSED)**
   O(n²) buffering in `consumeSseStream()` on large chunked events. Closed via PR #12451 (linear-time stream readers).

5. **[#12408](https://github.com/earendil-works/pi/issues/12408) — Git for Windows outside `Program Files` never found (CLOSED)**
   `getShellConfig()` only probes default install paths, falling through to `System32\bash.exe` (WSL). Fix merged via PR #12494, probing `where git` / PATH.

6. **[#12407](https://github.com/earendil-works/pi/issues/12407) — `gemini-4-neon` stops mid-stream (OPEN)**
   OpenRouter normalizes `MALFORMED_RESPONSE` into a benign-looking finish reason; Pi treats it as a clean stop. Tracked alongside PR #12470 consuming `native_finish_reason`.

7. **[#12439](https://github.com/earendil-works/pi/issues/12439) / [#12440](https://github.com/earendil-works/pi/issues/12440) — OSC 7501 status missing for startup dialogs; late DA1 reply disables reporting (CLOSED)**
   Project-trust dialog sends no `blocked` status; a late DA1 reply from the dialog terminal kills OSC 7501 for the next `ProcessTerminal`. Important for host/IDE integrations relying on program status.

8. **[#12443](https://github.com/earendil-works/pi/issues/12443) — `xhigh` thinking fails on `gemini-4-neon`/`hydrogen` (CLOSED)**
   Mapping rejects `xhigh → xhigh` despite Google supporting it. Quick-fix closed, relevant to power users of Google native APIs.

9. **[#12433](https://github.com/earendil-works/pi/issues/12433) — `developer` role sent by default to OpenAI-compatible proxies that reject it (CLOSED)**
   Proxies like Kimi Coding and Qwen compatible-mode 400 on every turn. `supportsDeveloperRole` defaults true in `getCompat`. High-impact for users of third-party compatible endpoints.

10. **[#12147](https://github.com/earendil-works/pi/issues/12147) — RPC mode: extension dialogs during `session_start` unanswerable (OPEN)**
    Pi exits ~20ms after sending `extension_ui_request` without reading the response. Blocks headless/RPC harnesses that require extension UI during startup.

## 4. Key PR Progress

1. **[#12505](https://github.com/earendil-works/pi/pull/12505) — Replay Copilot `reasoning_opaque` in `openai-completions` (OPEN)**
   Fixes #12418. Captures and replays `reasoning_opaque` alongside `reasoning_text` for tool-call and reasoning-only assistant messages; observed live with `claude-opus-5.5`.

2. **[#12494](https://github.com/earendil-works/pi/pull/12494) — Find Git Bash on PATH on Windows (CLOSED)**
   Fixes #12408. Probes `where git`-derived install roots before falling back to `System32\bash.exe`.

3. **[#12495](https://github.com/earendil-works/pi/pull/12495) — Add `gpt-6-luna-decisions`, filter Copilot classifiers by account (CLOSED)**
   Fixes #12395. Uses `billing.restricted_to` to hide Business/Enterprise-only classifier models from personal accounts.

4. **[#12490](https://github.com/earendil-works/pi/pull/12490) / [#12487](https://github.com/earendil-works/pi/pull/12487) — OSC 7501 `blocked` reporting for startup dialogs and trust/setup (CLOSED)**
   Startup dialogs (project trust, missing session folder, picker) now report `permission`-kind blocked status per the Program Status Protocol.

5. **[#12489](https://github.com/earendil-works/pi/pull/12489) — Claude thinking-off support from models.dev (CLOSED)**
   Fixes #12429. Replaces hand-written per-provider `DISABLED_THINKING_MODELS`/`claude55ThinkingLevels()` lists with catalog-driven capability data.

6. **[#12451](https://github.com/earendil-works/pi/pull/12451) — Linear-time streamed line/event readers across mcp, ai, agent, coding-agent, tui (CLOSED)**
   Fixes #12224. Addresses V8 string flattening on `+=` in stream readers — meaningful performance win for large SSE/MCP payloads.

7. **[#12502](https://github.com/earendil-works/pi/pull/12502) — Report HTTP error responses to `onResponse` / `after_provider_response` (CLOSED)**
   Fixes #12376. 4xx/5xx previously never fired `onResponse` on SDK adapters (e.g., openai-completions 429s rejected before callback).

8. **[#12470](https://github.com/earendil-works/pi/pull/12470) — Handle OpenRouter `native_finish_reason` (CLOSED)**
   Fixes #12407. Surfaces upstream failures (e.g., Gemini `MALFORMED_RESPONSE`) instead of presenting them as clean stops.

9. **[#12325](https://github.com/earendil-works/pi/pull/12325) — Newly enabled Copilot models stay hidden after `pi update --models` (OPEN)**
   Fixes #11006. `availableModelIds` only updated on token refresh; model refresh never refreshes it. Important for Copilot users stuck on stale model lists.

10. **[#12479](https://github.com/earendil-works/pi/pull/12479) — Support stateless MCP protocol `2026-07-28` (OPEN)**
    Adds the stateless MCP revision to `pi-mcp` and the MCP extension, with backward compatibility for `2025-11-25` handshake sessions. Forward-looking infrastructure work.

*Additional notable:* **#12475** (OSC 8 hyperlink heap exhaustion on very long URLs), **#12473** (Tabby Windows double-paste on right-click), **#12492** (CI model-catalog drift from models.dev removals).

## 5. Hot Discussions

No discussion data was provided in the source.

## 6. Feature Request Trends

- **Model catalog & provider expansion:** EXAONE 2.5 as a built-in provider (#12481); GitHub Copilot business-tier filtering (#12395); native Google provider work (#12485).
- **Reasoning/thinking control fidelity:** expose reasoning summary part boundaries on `thinking_delta` (#12456); account-aware thinking-off support (#12429); Copilot `reasoning_opaque` replay (#12418).
- **Extensibility hooks:** `turn_end` handler requesting native compaction without aborting the run (#12476); warn when extensions resolve physical copies of host packages (#12493); HTTP error codes to extensions (#12376).
- **Durable/agent-harness infrastructure:** Postgres backend for Chord's store (#12507); withdrawn input IDs from conversation abort (#12445); transcript sidecars with tool-result elision (#12506); opt-in retry jitter (#12478).
- **Terminal/UX polish:** clear selection on typing in fullscreen mode (#10592); OSC 7501 status reporting for dialogs (#12439, #12440).

## 7. Developer Pain Points

1. **Long-session memory/compaction instability** — Compaction summaries growing unboundedly (#12242), `idle` cache warming never firing (#10956), and output budget not rechecked after mid-turn compaction (#12482). These compound: long agent runs degrade in cost, latency, and reliability.
2. **Windows terminal/shell friction** — Repeated reports: mouse/Kitty input reporting not restored on exit (#12133), Git Bash resolution failing outside `Program Files` (#12408), Tabby double right-click paste (#12473). Windows remains the least-polished platform.
3. **Provider compatibility roulette** — OpenAI-compatible proxies rejecting the `developer` role (#12433), OpenRouter `MALFORMED_RESPONSE` normalization hiding failures (#12407), Copilot streaming `reasoning_opaque` dropped (#12418), Kimi splitting one function call across multiple output items (#12509). SDK-based adapters consistently leak provider-specific quirks.
4. **Streaming/buffering performance** — O(n²) SSE event buffering (#12224) and OSC 8 heap exhaustion (#12475) show large or adversarial payloads still find performance cliffs.
5. **Headless/RPC harness gaps** — Unanswerable extension dialogs in `--mode rpc` (#12147), missing OSC 7501 for startup dialogs (#12439), and dropped JSONL transcript concerns (#12506) reflect growing non-interactive/CI adoption outpacing the RPC surface.
6. **Durable runtime correctness** — `(doc.x ??= {})[k] = v` silently dropping writes in commits (#12508) signals draft-proxy semantics need hardening before Durable can be trusted as a primary store.

</details>

<details>
<summary><strong>Qwen Code</strong> — <a href="https://github.com/QwenLM/qwen-code">QwenLM/qwen-code</a></summary>

# Qwen Code Community Digest — 2026-11-25

## Today's Highlights

CI stability dominates today's activity: the `Managed Agent gate` and `Qwen Code CI` pipelines continue to fail on `main`, triggering a wave of auto-filed bot issues (#18252, #18253, #18258, #18264, #18288) and motivating a batch of repair PRs (#18297, #18310, #18312). Meanwhile, the 1.0 Preview loop-kernel migration (#17045) and Managed Agent Action-parking work (#18149 → PR #18303) remain the most substantive roadmap threads. Community attention is also converging on session robustness and voice/ASR model compatibility, with two new issues filed on DashScope `qwen-audio` model support.

## Releases

No new releases in the last 24 hours.

## Hot Issues

1. **#14724 — Main CI failed: Managed Agent gate (546 comments)** — The longest-running CI bot thread on the tracker, still open and updated daily. Its sheer comment volume reflects how persistent the managed-agent gate flakiness has become. [Link](https://github.com/QwenLM/qwen-code/issues/14724)

2. **#17045 — tracking(core): land the 1.0 Preview loop kernel on main (24 comments)** — The central roadmap issue for migrating the event-driven `query()` kernel from `v1.0.0-preview` onto `main` incrementally. This is the highest-leverage architectural change in flight. [Link](https://github.com/QwenLM/qwen-code/issues/17045)

3. **#18252 — E2E Tests failure: cron-tools registration (+73 more) (22 comments)** — A large cascading E2E failure flagged as provisional; the community is actively watching whether the next tip run clears it. [Link](https://github.com/QwenLM/qwen-code/issues/18252)

4. **#16346 — Managed Agent gate: ClassSizeRatchetTest (21 comments)** — A recurring class-size ratchet violation that blocks unrelated PRs, illustrating the friction of strict structural gates. [Link](https://github.com/QwenLM/qwen-code/issues/16346)

5. **#13113 — Session unopenable: "Transcript snapshot too large to index" (12 comments)** — Long-running sessions exceed a hardcoded 256 MiB index limit because `file_history_snapshot` grows quadratically. A serious data-loss-adjacent bug for power users. [Link](https://github.com/QwenLM/qwen-code/issues/13113)

6. **#10791 — `<thinking>` blocks leak to user-visible output (8 comments)** — A long-tracked content-generation bug with a fix in PR #11188; still open pending verification. [Link](https://github.com/QwenLM/qwen-code/issues/10791)

7. **#18149 — proposal(managed-agent): widen Action parking (8 comments)** — Design follow-up to #18115 extending which session waits can be parked during cold recovery. Directly feeds PR #18303 today. [Link](https://github.com/QwenLM/qwen-code/issues/18149)

8. **#17446 — feat(cli): discover models during custom provider setup (7 comments)** — Requests that `/auth` model discovery extend to Custom Provider (OpenAI/Anthropic-compatible) endpoints via a bounded catalog fetch. High-quality-of-life for self-hosted users. [Link](https://github.com/QwenLM/qwen-code/issues/17446)

9. **#17000 — Live Voice: hardcoded `semantic_vad` rejected by qwen-audio realtime (6 comments)** — Realtime clients hardcode `semantic_vad`, which the `qwen-audio-3.0-realtime-plus` family rejects with no override setting. [Link](https://github.com/QwenLM/qwen-code/issues/17000)

10. **#18030 — feat(memory): share project auto-memory across Git worktrees (4 comments)** — Since #6462, each worktree gets isolated auto-memory, so durable lessons learned in a worktree never reach the main workspace. [Link](https://github.com/QwenLM/qwen-code/issues/18030)

## Key PR Progress

1. **#18312 — fix(cli): drain queued signals before capture-tui exits** — Targets the chronic `capture-tui (real tmux)` flake blocking unrelated PRs. [Link](https://github.com/QwenLM/qwen-code/pull/18312)

2. **#18297 — fix(ci): repair reproducible main branch failures** — Addresses hosted-harness command identity limits, storage overlap guard miscompares, and related main failures. [Link](https://github.com/QwenLM/qwen-code/pull/18297)

3. **#18310 — fix(ci): scope Managed Agent fast checks by changed paths** — Path-scoped Java/daemon checks so unrelated PRs stop reporting against the full SDK Java gate. [Link](https://github.com/QwenLM/qwen-code/pull/18310)

4. **#18303 — feat(managed-agent): park Shell approvals on version-0 public Shell Sessions (S8a)** — Implements Stage 5 of #18149, parking approval waits on both Shell lanes. [Link](https://github.com/QwenLM/qwen-code/pull/18303)

5. **#14138 — feat(acp): surface retry and model-fallback progress to daemon clients** — Stops provider recovery from being invisible to VS Code, the daemon HTTP API, and Web Shell. [Link](https://github.com/QwenLM/qwen-code/pull/14138)

6. **#18304 — fix(core): resolve context windows for same-provider model overrides** — Closes a gap where same-provider model switches inherited the wrong `contextWindowSize`. [Link](https://github.com/QwenLM/qwen-code/pull/18304)

7. **#18247 — feat(sdk-java): add a public Managed Agent client** — Adds a first-class Java client for Managed Agent. [Link](https://github.com/QwenLM/qwen-code/pull/18247)

8. **#18280 / #18277 — microVM guest-exec & vsock bridges for /verify-pr** — Two PRs building hardware-isolated PR review execution (UDS/vsock input channel, model proxy bridge) with no host directory mounts. [Link](https://github.com/QwenLM/qwen-code/pull/18280) · [Link](https://github.com/QwenLM/qwen-code/pull/18277)

9. **#18306 — feat(voice): support `qwen-audio-*-asr-flash` via native DashScope ASR** — Adds a `dashscope-multimodal-asr` transport, fixing the whitelist rejection in #18305. [Link](https://github.com/QwenLM/qwen-code/pull/18306)

10. **#17437 — feat(i18n): Arabic support for CLI and Web Shell (RTL)** — A large internationalization PR adding full Arabic support including right-to-left layout. [Link](https://github.com/QwenLM/qwen-code/pull/17437)

Honorable mention: **#18301** fixes Web Shell rendering of unset booleans as OFF (matching issue #18298), and **#18299** surfaces unrunnable hooks as user-visible warnings.

## Hot Discussions

No discussion data was provided in this dataset; this section is omitted.

## Feature Request Trends

- **Model/provider flexibility**: Custom Provider model discovery (#17446), same-provider context-window resolution (#13338, PR #18304), and voice/ASR model support for the full `qwen-audio` family (#17000, #18305).
- **Managed Agent maturity**: Action parking beyond increment 1 (#18149), host-supplied execution-definition inputs (#18289), and public SDK clients (#18247) all point toward productionizing the Managed Agent surface.
- **Memory & session durability**: Cross-worktree auto-memory sharing (#18030) and transcript/index scaling (#13113) are recurring asks about long-lived sessions.
- **Extensibility**: Custom panels in the built-in Web Shell (#18159) and extension contribution guidance (#14540) show demand for first-class plugin surfaces.
- **Internationalization**: Arabic support (#17437) signals growing non-English user demand.

## Developer Pain Points

- **CI flakiness is the dominant friction**. The `Managed Agent gate`, `E2E Tests`, and `ClassSizeRatchetTest` are failing repeatedly on `main`, generating auto-filed issues (#18252, #18253, #18258, #18264, #18288) and blocking unrelated PRs (e.g., #18270 blocked twice by the capture-tui flake). Today's PR cluster (#18297, #18310, #18312) is a direct response.
- **Provisional CI reports add noise**. Many bot issues self-flag as provisional ("main advanced past this head"), forcing triage overhead.
- **Hardcoded limits bite power users**. The 256 MiB transcript index ceiling (#13113) and hardcoded `semantic_vad` turn detection (#17000) both demonstrate rigidity that users cannot override via settings.
- **Structural gates impede velocity**. The class-size ratchet and command-identity server limits keep surfacing as recurring blockers rather than one-off bugs.
- **Silent failure modes**: missing voice-transport whitelist entries (#18305), dropped retry/fallback progress (#14138), and undiscoverable unrunnable hooks (#18299) all reflect a pattern of failures that were previously invisible to users.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*