# AI CLI Tools Community Digest 2026-11-21

> Generated: 2026-11-21 02:06 UTC | Tools covered: 7

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

**Date:** 2026-11-21
**Sources:** Community digests for Claude Code, OpenAI Codex, Gemini CLI, GitHub Copilot CLI, OpenCode, Pi, and Qwen Code

---

## 1. Ecosystem Overview

The AI CLI tooling landscape on 2026-11-21 is characterized by rapid iteration on agentic runtimes coupled with a persistent drag from platform-specific regressions — particularly on Windows and macOS desktop. Vendors are converging on a common feature set (subagents, MCP, cross-session memory, remote control), but differentiation is increasingly expressed through execution reliability, permission/safety models, and enterprise readiness rather than raw model access. Release cadence is high across the board (four of seven tools shipped in the last 24h), yet the highest-engagement threads remain unresolved correctness bugs rather than new features. A notable structural signal: Qwen Code now spends a disproportionate share of maintainer bandwidth on CI gate stability (one issue at 506 comments), while Copilot CLI and OpenCode surface serious destructive-command and permission-enforcement incidents. Across all seven communities, the dominant *trust* battles are session continuity, quota/cost transparency, and safety guardrails that don't false-positive.

---

## 2. Activity Comparison

| Tool | Hot Issues (window) | PR Activity (24h) | Discussions | Release Status |
|---|---|---|---|---|
| **Claude Code** | 10 flagged (top: 31 comments, 👍38) | 1 PR (security hardening, closed) | N/A | v2.1.330 (Enterprise Admin Console sign-in, easel mod) |
| **OpenAI Codex** | 10 flagged (top: 75 comments) | 11 PRs (sandbox, OAuth, MCP prewarm, protocol) | Active — 4 Ideas, 3 Q&A, 4 Show-and-tell | 4 alphas (rust-v0.173.0-alpha.1–.4) |
| **Gemini CLI** | 10 flagged (top: 13 comments, 👍8) | 10 PRs (sec/reliability, mostly closed) | N/A | v0.71.0-nightly.20261121 |
| **GitHub Copilot CLI** | 10 flagged (top: 8 comments on #5478) | 0 PRs updated | N/A | 3 patches (v1.0.115-2/3/4) |
| **OpenCode** | 10 flagged (top: 24 comments, 👍7) | 10+ PRs (CI repair, sandbox, MCP events) | N/A | No release in window |
| **Pi** | 10 flagged (3× P0 regressions) | 10+ PRs (Windows, Bedrock, catalog perf) | 1 Show-and-tell | v1.6.0 (GPT-6.2 Astra/Sol, default Sol) |
| **Qwen Code** | 10 flagged (top: 506 comments on CI gate) | 10+ PRs (managed-agent, Web Shell, i18n) | N/A | v0.28.3 + preview + nightly (CI/test hardening) |

**Notes:**
- **Discussions disabled/unused:** Claude Code, Gemini CLI, Copilot CLI, OpenCode, and Qwen Code provide no Discussions data in this window and are marked **N/A** rather than inactive.
- **Copilot CLI** is a special case — Issues are enabled but PRs are not visible upstream (PR count = 0), reflecting a closed-development model with community feedback via issues only.
- **Claude Code** shows only one PR in the window, indicating either a strict PR-gating policy or external contributions routed elsewhere; not a sign of low internal velocity given the v2.1.330 ship.

---

## 3. Shared Feature Directions

The following requirements recur across **≥3 communities**, indicating ecosystem-level demand rather than vendor-specific quirks:

| Direction | Tools Requesting | Specific Need |
|---|---|---|
| **Cross-session memory / continuity** | Claude Code (#102045, #85657), Codex (#12567 Memories — highest-engagement thread), Pi (#11055 hook control), Qwen Code (#17910 transcript retention) | Durable, citable, project-scoped memory that survives session boundaries; external "canonical state" layers proposed by both Codex and Claude Code users. |
| **Subagent visibility & control** | OpenCode (#64073 — 24 comments), Gemini CLI (#22323, #21763, #22598), Claude Code (#100347 sub-agent params) | Foreground/background toggles, trajectory exposure via share commands, accurate termination-status reporting (no silent MAX_TURNS masking). |
| **MCP robustness & protocol completeness** | Copilot CLI (#4203 OAuth refresh, #5050 case-insensitivity, #5542 status probe), Codex (#62631 status/list, #62871 metadata), OpenCode (#64117 tools/list_changed), Gemini CLI (#24246 >128 tools) | Token lifecycle correctness, dynamic tool registration, catalog status reporting, and scaling beyond ~128-tool surfaces. |
| **Permission-model simplification** | Copilot CLI (#5539, #5066, #5541), OpenCode (#65290 external_directory bypass), Gemini CLI (#22672 destructive commands, #18397 workspace policy), Codex (#62882 managed domain rules) | Persistent user-level rules over per-repo duplication; confirmation gates for destructive ops; rules that are actually enforced (not silently bypassed). |
| **Cost / quota / cache transparency** | Copilot CLI (#5220 1h Claude cache, +17👍), Codex (#59398 quota), Pi (#12308 cost accounting), Qwen Code (#17902 token ledger) | Accurate token accounting, configurable prompt-cache TTLs, non-opaque rate-limit depletion, aligned exit codes for CI pipelines. |
| **Cross-platform / remote parity** | Claude Code (#110673 Desktop Code Mode, #95364 Remote Control), Codex (#62877, #62472, #61904 remote/history), Copilot CLI (#5468 GitHub Mobile), OpenCode (#65214 Windows shell) | Consistent behavior across CLI, Desktop, web, and mobile; history sync across authorized devices; remote sessions that survive updates. |
| **Localization / IME / non-Latin input** | Gemini CLI (#30178 Korean IME), OpenCode (#55676 Cyrillic keybinds), Qwen Code (#17437 Arabic + RTL), Pi (#11383 ANSI paste) | Correct commit behavior on IME-contiguous input, layout-agnostic keybind matching, RTL layout support. |

**Emerging (2 communities, worth watching):** Sandbox architecture as a first-class primitive (OpenCode #65168 experimental foundation; Codex #62882/#62865 managed domain rules + Windows sandbox owner restoration). This suggests a shift from per-command approval toward declarative capability sandboxes.

---

## 4. Differentiation Analysis

**Claude Code — Enterprise-first, governance-oriented.**
The v2.1.330 Enterprise Admin Console sign-in and org-routed cloud/gateway support signal a deliberate pivot toward managed deployment. Its community, however, is dominated by TUI regressions (scrollback duplication 👍38, 7 months open) and session-lifecycle transparency issues. Target user: enterprise teams needing org policy and audit trails. Weakness: TUI durability and auth-support dead ends (#79808 — a paying user locked out with no escalation).

**OpenAI Codex — Aggressive alpha velocity, desktop-heavy.**
Four alphas in 24h and 11 PRs indicate fast iteration on the Rust agent core, sandboxing, and app-server protocol. But its pain profile is the most acute: two macOS **launch-blocking** crashes (#62650 wallpaper tint; #62856 profile-specific) plus two Windows hang classes (#62731 MSIX; #60484 WSL PATH probe on the main thread). Target user: power users on desktop with multi-device remote workflows. Weakness: release-quality gating — users report downgrading.

**Gemini CLI — Subagent subsystem as the center of gravity.**
Issues cluster heavily around agent/subagent correctness (hangs, silent success masking, browser-agent Wayland failures). BigSmoKe07's security PR burst (dangerous-`rm` flag-position bypass, pasted-`@` secret attachment) shows a focused hardening push on tool-invocation safety. Target user: developers leveraging Gemini's native bash affinity. Weakness: subagent reliability and configuration being ignored (#22267 Browser Agent bypassing `settings.json`).

**GitHub Copilot CLI — MCP and Windows enterprisization.**
A three-patch day focused on Windows sandboxing and plugin init races, while the backlog is dominated by MCP OAuth lifecycle and enterprise EDR interference (#5478 Cortex XDR killing spawned git). The #5541 `rsync --delete` WSL incident is the most severe safety report across all seven tools. Target user: GitHub-ecosystem enterprise devs, IDE-adjacent workflows. Weakness: destructive-command guardrails and MCP auth brittleness in unattended/CI flows.

**OpenCode (anomalyco) — Open-source velocity with Windows broken-window risk.**
No release in the window but heavy PR flow: CI repair, MCP Events beta (SEP-3415), experimental agent sandbox, session full-text search. The pain cluster is explicit v2.3.2 regressions on Windows (empty shell output, `%USERPROFILE%` desktop opening, double-quote escaping). Target user: OSS developers and tinkerers who value SDK/API control. Weakness: release-cycle discipline (2.3.2 cited across many issues).

**Pi (earendil-works) — Provider-agnostic reasoning fidelity.**
v1.6.0's GPT-6.2 Sol-default rollout landed with two P0 regressions within 24h (#12361 thinking-effort downgrade to "medium"; #12367 prefix_mismatch reasoning drops), plus Anthropic Team/Enterprise OAuth scope rejection (#12318). Its distinctive concern is *cross-provider consistency* — `--thinking` must map to each provider's native controls. Target user: multi-provider developers. Weakness: post-release regression testing on provider compatibility paths.

**Qwen Code — Managed-agent runtime maturity + CI gate crisis.**
Three builds sharing one change set (managed-agent E2E + verify-pr hardening) reveal the real investment: a server-side managed agent with Broker/Control Plane, runtime-owned background observation, and Web Shell migration. Meanwhile #14724 at **506 comments** is a chronic CI gate failure re-firing per commit — the most extreme maintainer-bandwidth sink in the set. Target user: large-repo teams and China-ecosystem channel integrations (DingTalk, Teams, QQ). Weakness: CI gate instability blocking required-check adoption.

---

## 5. Community Momentum & Maturity

**Momentum ranking (iteration velocity × engagement):**

| Tier | Tools | Evidence |
|---|---|---|
| **Very high velocity** | OpenAI Codex, Qwen Code | Codex: 4 alphas + 11 PRs in 24h. Qwen: 3 builds + 10+ stacked managed-agent PRs. Qwen's 506-comment CI thread also reflects intense (if costly) activity. |
| **High velocity** | Pi, OpenCode, Gemini CLI | Pi: v1.6.0 + follow-up PR cascade. OpenCode: 10+ PRs and experimental sandbox without a release. Gemini CLI: nightly + BigSmoKe07 security burst. |
| **Steady / patch-focused** | Claude Code, Copilot CLI | Claude Code: one meaningful release + one PR (gatekeeping model). Copilot: 3 patches, no PRs visible upstream. |

**Community health signals:**
- **Healthiest feedback loops:** Codex (Discussions actively used for memory design), Pi (community OAuth shim #12364 offered as workaround), Copilot CLI (#2109 ACP request shipped in v1.0.115-4 — a clear community win).
- **Maturity signals:** Claude Code and Copilot CLI show enterprise-grade governance (admin console, sandbox capabilities toggles), but at the cost of slower community responsiveness.
- **At-risk signals:** Qwen Code's 506-comment CI issue and repeated "no test identified" failures indicate process debt consuming contributor cycles. OpenCode's concentrated 2.3.2 regressions suggest release QA gaps.

**Maturity vs. velocity trade-off:** The enterprise-leaning tools (Claude Code, Copilot CLI) are the most *stable* but least *responsive*; the high-velocity tools (Codex, Pi, Qwen) deliver features fastest but absorb regression pain in public.

---

## 6. Trend Signals

**For technical decision-makers:**

1. **Desktop is the new reliability frontier.** Launch-blocking desktop regressions at Codex (macOS wallpaper tint, Windows MSIX hang), Claude Code (stealth-update killing remote sessions), and OpenCode (Windows shell/path failures) suggest vendor QA still prioritizes CLI over the GUI surface. Teams standardizing on desktop clients should pin versions and maintain rollback paths.

2. **Safety guardrails are bifurcating into two problems** — *false negatives* (Copilot CLI #5541 `rsync --delete` data loss; Copilot #5066 over-prompting) and *false positives* (Claude Code's six closed `[Bug][cyber]` reports from a legitimate embedded-firmware developer; Gemini CLI's pasted-`@` secret attachment capability). Expect vendors to converge on **dry-run defaults + confirmation gates + declarative sandboxes** rather than binary allow/deny.

3. **Cross-session memory is the next competitive battleground.** Codex's #12567 survey, Claude Code's continuity complaints, and Pi/Qwen transcript work all point the same direction. The differentiator will be *citable* (attributable) memory with project-scoping — a security-relevant design choice, not just a convenience feature.

4. **Windows is systematically under-served.** Every tool with a Windows footprint reports a dedicated pain cluster: EDR interference (Copilot), Cygwin argument truncation at 8,186 chars (Pi), WSL PATH probe hangs (Codex), argv 32,767-char limit (Qwen), empty shell output (OpenCode), path expansion bugs (Gemini CLI). For Windows-majority enterprises, this is the single most actionable diligence item.

5. **Permission enforcement is becoming a trust/security issue, not UX.** OpenCode's `external_directory` bypass (#65290, severity:high) and cross-machine approval leakage (#65295) plus Copilot's destructive-command incident show that permission systems are being *bypassed in practice*. Buyers evaluating agentic CLIs should audit whether configured rules are actually enforced, not just declared.

6. **MCP has crossed from "supported" to "expected to be robust."** OAuth token lifecycle, dynamic tool registration, catalog status, and >128-tool scaling are now baseline requirements across Copilot CLI, Codex, OpenCode, and Gemini CLI. MCP reliability will be a differentiating selection criterion for teams running many servers.

7. **CI/MCP-in-CI is a growing blind spot.** Copilot CLI's stricter CI exit codes on MCP startup failure (#3064), Pi's JSON-mode exit-code alignment (#12356), and Qwen's CI gate crisis all indicate that agentic CLIs are increasingly invoked from pipelines — where silent failures and nonzero-exit semantics matter more than interactive ergonomics.

---

*Compiled 2026-11-21 from community digests for the seven referenced repositories. Comment/upvote counts reflect the snapshot provided and are directional, not exhaustive.*

---

## Per-Tool Reports

<details>
<summary><strong>Claude Code</strong> — <a href="https://github.com/anthropics/claude-code">anthropics/claude-code</a></summary>

## Claude Code Skills Highlights

> Source: [anthropics/skills](https://github.com/anthropics/skills)

# Claude Code Skills — Community Highlights Report
*Data snapshot: 2026-11-21 · Source: github.com/anthropics/skills*

---

## 1. Top Skills Ranking (Most-Discussed PRs)

> Note: The PR dataset shows `Comments: undefined` for all top-20 entries, so ranking below is based on relative community attention inferred from update frequency, issue linkage, and cross-referencing with high-comment Issues.

| # | Skill / PR | Functionality | Discussion Highlight | Status |
|---|-----------|---------------|---------------------|--------|
| 1 | **mcp-builder fix** ([#1742](https://github.com/anthropics/skills/pull/1742)) | Fixes `streamable_http_client` import rename & custom header config for MCP ≥2.0 | Breaks real MCP connections; tracked via Issue #1668. Bumped repeatedly (Sep→Oct). | OPEN |
| 2 | **skill-creator eval isolation** ([#1298](https://github.com/anthropics/skills/pull/1298)) | Fixes false trigger-eval misses; Windows subprocess + runtime failure handling | Directly tied to the loudest eval bug (Issues #556, #1352). Long-lived since June. | OPEN |
| 3 | **notion-spec-to-implementation + quantitative-resume-auditor** ([#1245](https://github.com/anthropics/skills/pull/1245)) | Turns product specs into Notion tasks Claude can execute; plus resume auditing | Two-for-one submission; active through Oct despite June creation. | OPEN |
| 4 | **webapp-testing: drop `shell=True`** ([#1980](https://github.com/anthropics/skills/pull/1980)) | Removes CWE-78 command-injection risk in `with_server.py` | Security-hardening angle resonates with Issue #492 trust concerns. | OPEN |
| 5 | **docx: LibreOffice timeout → error** ([#1792](https://github.com/anthropics/skills/pull/1792)) | `accept_changes.py` now errors on timeout and verifies revision marks removed | Silent-success bug fix; verified correctness matters for doc pipelines. | OPEN |
| 6 | **pyxel retro game skill** ([#525](https://github.com/anthropics/skills/pull/525)) | Guides retro Python game dev: headless input runs, frame inspection, state checks | Oldest still-active PR (Mar→Nov); niche but persistent. | OPEN |
| 7 | **xlsx: external link resolution** ([#2019](https://github.com/anthropics/skills/pull/2019)) | Fixes false negatives for worksheet-scoped defined names in `recalc.py` | Fixes #2013; Oct–Nov activity shows ongoing spreadsheet pain. | OPEN |
| 8 | **document-typography** ([#514](https://github.com/anthropics/skills/pull/514)) | Prevents orphan/widow text and numbering misalignment in generated docs | Universal output-quality gap every user hits. | OPEN |

---

## 2. Community Demand Trends (from Issues)

Distilling the highest-comment Issues reveals **five clear demand axes**:

1. **Trust & namespace security** — Issue [#492](https://github.com/anthropics/skills/issues/492) (46 comments, top of list) calls out community skills masquerading under the `anthropic/` namespace, enabling privilege escalation. This is the single loudest concern.
2. **Skill sharing & org distribution** — Issue [#228](https://github.com/anthropics/skills/issues/228) (17 comments, 👍8) wants org-wide skill libraries instead of manual `.skill` file passing via Slack.
3. **Trustworthy evaluation tooling** — Issues [#556](https://github.com/anthropics/skills/issues/556) (0% trigger rate) and [#1352](https://github.com/anthropics/skills/issues/1352) (parallel-worker cross-matching) expose that the skill-eval harness itself is unreliable — a meta-quality crisis.
4. **Context-budget governance** — Issue [#1487](https://github.com/anthropics/skills/issues/1487) reports `claude-api` eagerly injecting ~156k tokens in one call. Demand for lazy/on-demand skill loading.
5. **Reasoning & output quality gates** — Issue [#1385](https://github.com/anthropics/skills/issues/1385) proposes a pre-task calibration → adversarial review → delivery verification pipeline; [#1143](https://github.com/anthropics/skills/issues/1143) (👍18, highest) shows platform-level frustration spilling into skills requests.

**Emerging proposed directions:** compact symbolic memory ([#1329](https://github.com/anthropics/skills/issues/1329)), agent-governance safety patterns ([#412](https://github.com/anthropics/skills/issues/412), closed), and description-quality linting ([#2064](https://github.com/anthropics/skills/issues/2064)).

---

## 3. High-Potential Pending Skills (Active, Unmerged)

These are the strongest candidates to land soon based on recency + breadth:

- **mcp-builder fix** ([#1742](https://github.com/anthropics/skills/pull/1742)) — High impact, blocks real MCP users. Likely near-merge.
- **skill-creator direct execution** ([#1681](https://github.com/anthropics/skills/pull/1681)) — Active to Nov 19; fixes `ModuleNotFoundError` on standalone runs. Complementary to #1298/#1997.
- **skill-creator YAML frontmatter parsing** ([#1997](https://github.com/anthropics/skills/pull/1997)) — Correctness fix for eval metadata; clean scope.
- **webapp-testing element discovery** ([#1976](https://github.com/anthropics/skills/pull/1976)) — Small, targeted fix (textarea/select reporting).
- **algorithmic-art wraparound** ([#1977](https://github.com/anthropics/skills/pull/1977)) — Clean modulo fix, resolves #1897.
- **md2video-audio skill** ([#1703](https://github.com/anthropics/skills/pull/1703)) — Zero-cost Markdown→MP4 with voiceover; novel content-generation addition.
- **scnet-hpc skill** ([#1615](https://github.com/anthropics/skills/pull/1615)) — Slurm/SSH cluster operations for scientific computing; fills a real vertical gap.
- **notion-spec-to-implementation** ([#1245](https://github.com/anthropics/skills/pull/1245)) — Product-spec→task automation; high workflow value if reviewers engage.

---

## 4. Skills Ecosystem Insight

> **The community's most concentrated demand is not for more Skills, but for a trustworthy Skill substrate — verified triggers, secure namespacing, honest error reporting, and context-efficient loading — before breadth can safely scale.**

The top PRs and Issues converge on the same theme: fixes to *existing* tooling (skill-creator, mcp-builder, docx/xlsx scripts) vastly outnumber genuinely new Skill proposals, and the loudest open Issue (#492) is a trust-boundary vulnerability rather than a missing feature.

---

# Claude Code Community Digest — 2026-11-21

## 1. Today's Highlights

Release v2.1.330 ships Enterprise Admin Console sign-in, letting `claude auth login` apply organization settings and route through the org's cloud provider or gateway — a notable step for enterprise adoption. Meanwhile, the issue tracker shows a cluster of long-running regressions (scrollback duplication, paste-handling bugs, session-resume quirks) that continue to accumulate comments months after filing. A new PR (#111198) closes a security-relevant gap by preventing `@claude` mentions on fork PRs from triggering runs.

## 2. Releases

**v2.1.330** ([release notes](https://github.com/anthropics/claude-code/releases))
- Added sign-in to organizations managed in Anthropic's Enterprise Admin Console: after `claude auth login`, Claude Code applies the organization's settings and uses its cloud provider or gateway.
- Added "easel," a built-in mod that draws charts when asked and under MCP metrics results.

## 3. Hot Issues

1. **[#79808](https://github.com/anthropics/claude-code/issues/79808) — Auth lockout with no escalation path** (31 comments, 👍7, OPEN). A user's verification emails are suppressed and the support bot offers no human escalation — a severe blocker for a paying user, and the top-commented issue today.
2. **[#51828](https://github.com/anthropics/claude-code/issues/51828) — Scrollback duplication on terminal resize** (31 comments, 👍38, OPEN, regression). The highest-upvoted item in today's set, still persisting from 2.1.116 in VS Code's integrated terminal on macOS. Strong signal that this TUI regression is widely felt.
3. **[#89690](https://github.com/anthropics/claude-code/issues/89690) — `opusplan` row silently dropped from model picker** (23 comments, OPEN). A logic bug where the picker considers `opusplan` "already covered" by a built-in lineup that contains no Opus Plan Mode row — model selection correctness issue.
4. **[#95364](https://github.com/anthropics/claude-code/issues/95364) — Desktop "stealth update" kills Remote Control sessions** (22 comments, 👍24, OPEN). Auto-update quits and relaunches the app while the user is away, dropping every remote session — a workflow-breaking reliability issue for remote-control users.
5. **[#85654](https://github.com/anthropics/claude-code/issues/85654) — Slash commands inside collapsed pastes never dispatch** (8 comments, OPEN, reproduced). Pasted `/command` text is submitted as a plain message instead of executing — subtle but frustrating TUI correctness bug.
6. **[#92434](https://github.com/anthropics/claude-code/issues/92434) — Auto-compact uses stale token counts** (7 comments, OPEN). Re-injected instruction files can overflow the context window because compaction decisions lag a turn behind — a core context-management concern.
7. **[#102045](https://github.com/anthropics/claude-code/issues/102045) — No project-decision memory across sessions** (6 comments, OPEN). Claude Code forgets prior decisions even with the same session link — a recurring memory/continuity complaint on the web platform.
8. **[#79223](https://github.com/anthropics/claude-code/issues/79223) — `CLAUDE_SECURESTORAGE_CONFIG_DIR` undocumented** (4 comments, 👍3, OPEN). Ecosystem tooling widely relies on this credential-store override, but it's absent from env-var docs — a low-cost docs fix with outsized impact.
9. **[#100004](https://github.com/anthropics/claude-code/issues/100004) — Resume after usage-limit retry produces synthetic "No response requested."** (3 comments, OPEN). Resuming an interrupted session answers the pending message with a placeholder — confusing and potentially lossy behavior.
10. **[#110673](https://github.com/anthropics/claude-code/issues/110673) — Code Mode in Desktop's Code tab** (2 comments, 👍4, OPEN, enhancement). Experimental Code Mode only works in the interactive CLI; users want parity in the Desktop app — a clear platform-consistency request.

Also notable: a cluster of six `[Bug][cyber]` false-positive reports from user `sworrl` ([#94166](https://github.com/anthropics/claude-code/issues/94166), [#94164](https://github.com/anthropics/claude-code/issues/94164), [#94163](https://github.com/anthropics/claude-code/issues/94163), [#94162](https://github.com/anthropics/claude-code/issues/94162), [#94161](https://github.com/anthropics/claude-code/issues/94161), [#94167](https://github.com/anthropics/claude-code/issues/94167)) were all closed today — safety filters blocking authorized embedded-firmware debugging, triaged as duplicates.

## 4. Key PR Progress

Only one PR was updated in the last 24 hours:

1. **[#111198](https://github.com/anthropics/claude-code/pull/111198) — Don't run `@claude` mentions on pull requests from forks** (CLOSED, by mhegazy). Prevents fork-originated PRs from triggering `@claude` runs — an important supply-chain/security hardening for anyone running the GitHub integration on public repos.

*Note: the data source shows only this single PR updated in the window, so a larger "top 10" list cannot be provided without fabricating entries.*

## 5. Hot Discussions

No Discussions data was provided in the source dataset — this section is omitted.

## 6. Feature Request Trends

Distilled from the issue set:

- **Cross-platform parity** — Code Mode in Desktop's Code tab ([#110673](https://github.com/anthropics/claude-code/issues/110673)); desktop surfacing of on-disk transcripts for cross-machine continuity ([#81835](https://github.com/anthropics/claude-code/issues/81835)).
- **Session/memory continuity** — retaining project decisions across sessions ([#102045](https://github.com/anthropics/claude-code/issues/102045)); resumable background sessions with correct semantics ([#85657](https://github.com/anthropics/claude-code/issues/85657)).
- **Composability of commands/skills** — opt-in frontmatter letting custom slash commands expand into built-in command invocations ([#91146](https://github.com/anthropics/claude-code/issues/91146)).
- **Documentation completeness** — credential-store path override ([#79223](https://github.com/anthropics/claude-code/issues/79223)); sub-agent `effort` and per-invocation `model` parameters ([#100347](https://github.com/anthropics/claude-code/issues/100347)).
- **Remote-control reliability** — keeping Remote Control sessions alive across updates ([#95364](https://github.com/anthropics/claude-code/issues/95364)) and preventing auto-disable while away ([#109419](https://github.com/anthropics/claude-code/issues/109419)).

## 7. Developer Pain Points

- **Auth and support dead ends.** Verification-email suppression with no escalation path ([#79808](https://github.com/anthropics/claude-code/issues/79808)) is the sharpest example of users being fully locked out with no recourse.
- **TUI regressions that linger.** Scrollback duplication on resize ([#51828](https://github.com/anthropics/claude-code/issues/51828), 7 months open, 👍38), paste-collapsed slash commands ([#85654](https://github.com/anthropics/claude-code/issues/85654)), and hidden assistant text during `AskUserQuestion` ([#108098](https://github.com/anthropics/claude-code/issues/108098)) erode trust in the terminal experience.
- **Session lifecycle surprises.** Stale-token auto-compaction ([#92434](https://github.com/anthropics/claude-code/issues/92434)), synthetic "No response requested." on resume ([#100004](https://github.com/anthropics/claude-code/issues/100004)), and un-resumable `sessionKind:bg` entries ([#85657](https://github.com/anthropics/claude-code/issues/85657)) make resumption unpredictable.
- **Update/relaunch behavior breaks long-running work.** Desktop stealth updates dropping Remote Control sessions ([#95364](https://github.com/anthropics/claude-code/issues/95364)) and Remote Control self-disabling on Windows ([#109419](https://github.com/anthropics/claude-code/issues/109419)) both punish users who step away.
- **Safety-filter false positives on legitimate work.** The six closed `[Bug][cyber]` reports from one embedded-firmware developer show that overly broad safeguards can halt authorized engineering sessions.
- **Multi-account isolation gaps.** Shared skill-sync buckets churning `~/.claude/skills/.trash` across accounts ([#98526](https://github.com/anthropics/claude-code/issues/98526)) highlight friction for developers juggling multiple identities.

---

*Digest generated from github.com/anthropics/claude-code activity for 2026-11-21. Comment/upvote counts reflect the snapshot provided.*

</details>

<details>
<summary><strong>OpenAI Codex</strong> — <a href="https://github.com/openai/codex">openai/codex</a></summary>

# OpenAI Codex Community Digest — 2026-11-21

## 1. Today's Highlights

A new `rust-v0.173.0-alpha.4` release continues the rapid alpha cadence for the 0.173 line. The community's attention is dominated by **launch-blocking desktop app regressions** on macOS and Windows (wallpaper tint crash, MSIX update hangs), plus a cluster of **Codex Remote connectivity failures** across iOS/macOS/Windows. A large batch of closed PRs from the `copyberry[bot]` pipeline shows internal work on sandboxing, OAuth, MCP prewarming, and app-server protocol refinements.

## 2. Releases

Four alpha builds shipped in the last 24 hours:

- [`rust-v0.173.0-alpha.4`](https://github.com/openai/codex/releases/tag/rust-v0.173.0-alpha.4)
- [`rust-v0.173.0-alpha.3`](https://github.com/openai/codex/releases/tag/rust-v0.173.0-alpha.3)
- [`rust-v0.173.0-alpha.2`](https://github.com/openai/codex/releases/tag/rust-v0.173.0-alpha.2)
- [`rust-v0.173.0-alpha.1`](https://github.com/openai/codex/releases/tag/rust-v0.173.0-alpha.1)

Release notes are terse (no changelog detail), but the rapid alpha iteration suggests active CLI/agent refactoring on the Rust side.

## 3. Hot Issues

1. **[#57101](https://github.com/openai/codex/issues/57101)** — Windows Computer Use leaves the capture border and access open after a turn completes. 75 comments, 👍13. Longest-running active thread; possible resource/permission leak in the unified CUA plugin.
2. **[#62650](https://github.com/openai/codex/issues/62650)** — macOS Codex App 26.1117.31558 crashes on launch in a wallpaper tint fallback. 👍16. **Launch-blocking**; affects default Apple wallpapers.
3. **[#62856](https://github.com/openai/codex/issues/62856)** — Separate macOS crash (`NSUnknownKeyException`) that reproduces only on one user profile. Strong signal of corrupted per-user state.
4. **[#62472](https://github.com/openai/codex/issues/62472) [CLOSED]** — Codex Remote WebSocket opens but `initialize` times out after 30s on macOS and Windows. Community-wide since Nov 17–18.
5. **[#62877](https://github.com/openai/codex/issues/62877)** — Codex Remote Control spinning/unavailable from iOS and macOS; matches the same Nov 20 window.
6. **[#60484](https://github.com/openai/codex/issues/60484)** — Windows Desktop hangs on startup due to a `spawnSync bash -ilc` WSL PATH probe with no timeout on the main thread. Clean, actionable root cause.
7. **[#62731](https://github.com/openai/codex/issues/62731)** — Windows app hangs (MoAppHang) on every launch after the MSIX update, reproducible with a fresh `CODEX_HOME`.
8. **[#29809](https://github.com/openai/codex/issues/29809)** — SSH reconnect leaks stale remote app-server processes across hosts, eventually hitting `fork/exec` failures. Long-running reliability issue.
9. **[#59398](https://github.com/openai/codex/issues/59398)** — Plus five-hour quota hits 98% in ~5 minutes with Astra medium and mostly cached long context. Quota accounting concern.
10. **[#61548](https://github.com/openai/codex/issues/61548)** — Windows Work mode: GPT-6.1 Sol stops at Max even with Ultra enabled. Model-tier selection bug on Windows.

Also notable: [#62631](https://github.com/openai/codex/issues/62631) (MCP catalog rejects `mcpServerStatus/list` 156× in logs) and [#61904](https://github.com/openai/codex/issues/61904) (iOS remote history empty while Windows shows the same host sessions).

## 4. Key PR Progress

1. **[#62882](https://github.com/openai/codex/pull/62882)** — Compose managed domain rules across `[permissions.network]`, `[network_proxy]`, and `[experimental_network]`. Fixes silent rule loss in managed configs.
2. **[#62867](https://github.com/openai/codex/pull/62867)** — Enable configuration server OAuth during app-server startup (`--print-startup-config` flow).
3. **[#62859](https://github.com/openai/codex/pull/62859)** — Protocol definition for startup OAuth, adding `{"kind":"configServer"}` as a target.
4. **[#62865](https://github.com/openai/codex/pull/62865)** — Defer Windows sandbox owner restoration until sign-in; hardens against missing sessions/tokens at boot.
5. **[#62876](https://github.com/openai/codex/pull/62876)** — Prewarm MCP servers during cloud catalog refresh to avoid first-turn latency.
6. **[#62871](https://github.com/openai/codex/pull/62871)** — Preserve per-image `imageMetadata` on app-server image generation items.
7. **[#62863](https://github.com/openai/codex/pull/62863)** — Send `x-codex-exclude: tools` to make Responses API omit the echoed tool catalog (wire-size reduction).
8. **[#62857](https://github.com/openai/codex/pull/62857)** — Defer Default-mode instructions until a thread actually uses Plan mode; reduces prompt noise.
9. **[#62849](https://github.com/openai/codex/pull/62849)** — Cut allocations in tool schema budget checks and Responses Lite catalog building.
10. **[#62858](https://github.com/openai/codex/pull/62858)** — Keep Cloud threads fresh in the Agents overview via Cloud stream notifications.
11. **[#62852](https://github.com/openai/codex/pull/62852)** — Cap guardian resampling to a single retry to prevent turn-stalling loops.

## 5. Hot Discussions

**Ideas**
- **[#12567](https://github.com/openai/codex/discussions/12567)** — *Memories in Codex* (42 comments, 👍14). The team is surveying how cross-thread memory should be surfaced and cited. Highest-engagement thread today.
- **[#33353](https://github.com/openai/codex/discussions/33353)** — Canonical project-state layer for ChatGPT Projects.
- **[#44795](https://github.com/openai/codex/discussions/44795)** — Live integrations, secure sign-in, low-latency computer use.
- **[#62661](https://github.com/openai/codex/discussions/62661)** — Open Temporary Chat in a separate window.

**Q&A**
- **[#2503](https://github.com/openai/codex/discussions/2503)** — How to scroll terminal conversation history (👍38, still unanswered by docs — a recurring docs gap).
- **[#37960](https://github.com/openai/codex/discussions/37960)** — Coordinating local + remote agents across model vendors.
- **[#57029](https://github.com/openai/codex/discussions/57029)** — Multi-account Gmail plugin access.

**Show and tell**
- **[#61475](https://github.com/openai/codex/discussions/61475)** — Ragmir: cited project context for Codex over code/PDF/Office.
- **[#62545](https://github.com/openai/codex/discussions/62545)** — Open Agent API: call local Codex through an existing OpenAI SDK.
- **[#62426](https://github.com/openai/codex/discussions/62426)** — TernaryCode: Rust-based multi-agent session monitor.
- **[#1303](https://github.com/openai/codex/discussions/1303)** — Bell-sound notifications for Codex CLI (👍8).

## 6. Feature Request Trends

- **Cross-session memory / continuity** — the Memories thread (#12567) plus multiple "boot protocol + external canonical state" proposals (#51228, #33353) show sustained demand for durable, citable memory.
- **Remote/mobile parity** — across #61904, #62877, #62472, #60807: history sync, ghost chats, and reliable device handoff.
- **Quota transparency** — #59398, #62880, #59428 all flag surprising or fast rate-limit depletion.
- **First-class integrations** — #44795 and #40230 request a permission-scoped Codex↔ChatGPT bridge and a general integration layer.
- **Multi-agent orchestration** — #37960 and related work on concurrency guidance and role-tagged instructions.
- **Better MCP tooling** — prewarming, catalog status reporting (#62631), and per-image metadata (#62871).

## 7. Developer Pain Points

- **Desktop launch regressions are the top acute pain.** macOS wallpaper-tint crash (#62650, 👍16), multi-user-only macOS crash (#62856), and two Windows hang classes (#62731, #60484) are all launch blockers introduced in recent updates; users report having to downgrade or change system settings.
- **Codex Remote reliability** degraded around Nov 17–20: WebSocket opens, `initialize` times out (#62472), Remote Control spins (#62877). Users with multiple authorized devices see inconsistent history.
- **Windows/sandbox fragility** — elevated sandbox reprovisioning on every local command (#62847), WSL integration blocking startup (#61546), and startup-path hangs caused by synchronous probes.
- **Quota accounting feels opaque** — multiple Pro/Plus users report losing nearly a full 5-hour window in minutes, with cached context, and misleading work-status indicators (#59398, #62880).
- **State corruption and ghosts** — path-titled ghost chats (#60807), archived threads that can't be unarchived (#56642), and stale remote app-server processes (#29809) suggest real gaps in state lifecycle management.
- **App-server protocol surface mismatch** — MCP catalog calls against unsupported methods (#62631) and missing delete APIs (#50618) force users into awkward workarounds.

</details>

<details>
<summary><strong>Gemini CLI</strong> — <a href="https://github.com/google-gemini/gemini-cli">google-gemini/gemini-cli</a></summary>

# Gemini CLI Community Digest — 2026-11-21

## 1. Today's Highlights

The project shipped a new nightly (`v0.71.0-nightly.20261121`) with two targeted CLI fixes: Windows home-relative path expansion (tilde/backslash) and smarter session resumption that reopens the *most recently active* session rather than the most recently started one. Issue activity continues to be dominated by the agent/subagent subsystem, with several long-running P1 bugs (generalist agent hangs, browser agent Wayland failures, subagent MAX_TURNS misreporting) still in `need-retesting` and drawing consistent community engagement. Meanwhile, a large batch of security- and reliability-oriented PRs from BigSmoKe07 landed in the last 24h, suggesting a focused hardening push across core and CLI.

---

## 2. Releases

**v0.71.0-nightly.20261121.geecccfcd5**

- `fix(cli)`: Expand Windows home-relative paths using tilde and backslash — [PR #30376](https://github.com/google-gemini/gemini-cli/pull/30376)
- `fix(cli)`: Resume most recently *active* session instead of most recently *started* session (fixes a long-standing UX annoyance for users running multiple sessions)

No stable release was published in the last 24h.

---

## 3. Hot Issues

1. **[#22323](https://github.com/google-gemini/gemini-cli/issues/22323) — Subagent recovery after MAX_TURNS reported as GOAL success** *(P1, 13 comments, 2 👍)*
   `codebase_investigator` reports `status: "success"` and `Termination Reason: "GOAL"` despite hitting the turn limit before doing any real work. This silently masks interruption — a correctness problem for anyone relying on subagent output in automation.

2. **[#19873](https://github.com/google-gemini/gemini-cli/issues/19873) — Zero-dependency OS sandboxing & post-execution intent routing** *(P2, 9 comments)*
   Proposes letting Gemini 3 lean fully into its native bash affinity (`grep`, `sed`, `awk` chains) without compromising security. A significant architectural direction for agent capability versus safety.

3. **[#21409](https://github.com/google-gemini/gemini-cli/issues/21409) — Generalist agent hangs** *(P1, 8 comments, 8 👍)*
   The most-upvoted issue in the batch. Whenever the CLI defers to the generalist agent, it hangs indefinitely — even for trivial operations like folder creation. Workaround is instructing the model not to defer to subagents.

4. **[#22745](https://github.com/google-gemini/gemini-cli/issues/22745) — AST-aware reads, search, and mapping EPIC** *(P2, 7 comments)*
   Tracks whether AST-aware tooling can reduce turns from misaligned reads and cut token noise. High-leverage for context efficiency; see also the companion [#22746](https://github.com/google-gemini/gemini-cli/issues/22746).

5. **[#21968](https://github.com/google-gemini/gemini-cli/issues/21968) — Gemini doesn't use skills/subagents enough** *(P2, 7 comments)*
   Anecdotal but widely echoed: skills and subagents exist but are rarely invoked unless explicitly instructed. Undermines the value of the extensibility model.

6. **[#22267](https://github.com/google-gemini/gemini-cli/issues/22267) — Browser Agent ignores `settings.json` overrides** *(P2, 5 comments)*
   `AgentRegistry` reads and merges settings correctly, but the Browser Agent bypasses them (e.g., `maxTurns`). Configuration not being honored is a trust issue for agent tuning.

7. **[#29425](https://github.com/google-gemini/gemini-cli/issues/29425) — Code Assist Standard: QUOTA_EXHAUSTED despite 95.8% quota remaining** *(P1, 4 comments)*
   Enterprise/Workspace blocker: `loadCodeAssist` reports `gcp-standard-tier` with substantial remaining quota, yet CLI requests fail. Directly impacts paid users.

8. **[#21983](https://github.com/google-gemini/gemini-cli/issues/21983) — Browser subagent fails on Wayland** *(P1, 4 comments)*
   Linux users on Wayland get a `Termination Reason: GOAL` with no useful work. Part of a cluster of browser-agent reliability issues ([#22232](https://github.com/google-gemini/gemini-cli/issues/22232), [#22598](https://github.com/google-gemini/gemini-cli/issues/22598)).

9. **[#24246](https://github.com/google-gemini/gemini-cli/issues/24246) — 400 error with >128 tools** *(P2, 3 comments)*
   Scale limit hits real users with large MCP/tool surfaces. Suggests smarter in-scope tool filtering is needed before tool counts grow further.

10. **[#22672](https://github.com/google-gemini/gemini-cli/issues/22672) — Agent should discourage destructive behavior** *(P2, 3 comments, 1 👍)*
    Model occasionally reaches for `git reset` / `--force` when safer alternatives exist. Safety-relevant behavior issue, echoed in the related dangerous-`rm` flag-position PR below.

---

## 4. Key PR Progress

1. **[#30174](https://github.com/google-gemini/gemini-cli/pull/30174) — Stop body timeouts from killing and replaying long model turns** *(CLOSED)*
   Fixes a 5-minute undici body timeout that aborted long single-turn generations (e.g., large `write_file` args at high thinking) and replayed them up to 3×.

2. **[#30169](https://github.com/google-gemini/gemini-cli/pull/30169) — Keep pasted `@` text and fuzzy matches from attaching secrets** *(CLOSED, P1 security)*
   Closes a real path where a pasted shell transcript could silently attach an SSH private key to a model request. `ui.escapePastedAtSymbols` now defaults to `true`.

3. **[#30171](https://github.com/google-gemini/gemini-cli/pull/30171) — Flag recursive and forced `rm` regardless of flag position** *(CLOSED, P1)*
   Previously `rm -r -f`, `rm -Rf`, `rm -vrf`, `rm --recursive --force x`, and `rm x -rf` all evaded the dangerous-command policy engine. Important hardening.

4. **[#30175](https://github.com/google-gemini/gemini-cli/pull/30175) — Apply local subagents' `generateContentConfig` for every model** *(CLOSED)*
   Subagents now honor declared `temperature`/`topP`/`topK`/`thinkingConfig` for `auto`, aliases (`flash`, `pro`), and concrete model names — not just `auto`.

5. **[#30170](https://github.com/google-gemini/gemini-cli/pull/30170) — Stop local subagents waiting out their deadline on stalled model calls** *(CLOSED, P1)*
   Adds an optional per-turn response limit so `cli_help` no longer burns its full 3-minute budget plus 60s recovery before reporting timeout.

6. **[#30172](https://github.com/google-gemini/gemini-cli/pull/30172) — One result per tool-call ID in session records and live history** *(CLOSED)*
   Eliminates the two remaining paths that produced duplicate tool results per call ID (follow-up to #29618), improving determinism on `--resume`.

7. **[#30178](https://github.com/google-gemini/gemini-cli/pull/30178) — Submit full text when IME commit and Enter arrive in the same tick** *(CLOSED)*
   Fixes dropped final Hangul syllable (e.g., `테스트` → `테스`) in Korean IME input. Nice localization win.

8. **[#30173](https://github.com/google-gemini/gemini-cli/pull/30173) — Load `~/.gemini/.env` in untrusted folders** *(CLOSED)*
   Resolves an endless login loop for Workspace-account users who keep `GOOGLE_CLOUD_PROJECT` in `~/.gemini/.env` and operate outside trusted folders.

9. **[#30268](https://github.com/google-gemini/gemini-cli/pull/30268) — Respect active YOLO mode in taint and build-file checks** *(OPEN)*
   Prevents `--approval-mode=yolo` runs from being interrupted by confirmation prompts or hard `POLICY_VIOLATION` denials on legitimate edits.

10. **[#30281](https://github.com/google-gemini/gemini-cli/pull/30281) — Honor configured fetch timeouts on Node 26** *(OPEN)*
    Upgrades core Undici to 7.30.2 so configured global dispatchers are published under the symbol used by Node 26's built-in `fetch`. Forward-compat fix.

---

## 5. Hot Discussions

No GitHub Discussions data was provided for this window — section omitted.

---

## 6. Feature Request Trends

Distilled from the Issues set, the most-requested directions are:

- **Agent self-awareness & configurability** — Accurate CLI flags/hotkeys self-description ([#21432](https://github.com/google-gemini/gemini-cli/issues/21432)), honoring `settings.json` in all agents ([#22267](https://github.com/google-gemini/gemini-cli/issues/22267)), and more proactive use of skills/subagents ([#21968](https://github.com/google-gemini/gemini-cli/issues/21968)).
- **Context frugality & precision** — AST-aware reads/search/mapping ([#22745](https://github.com/google-gemini/gemini-cli/issues/22745), [#22746](https://github.com/google-gemini/gemini-cli/issues/22746)) and "Tactful Extraction" surgical read hierarchies ([#19561](https://github.com/google-gemini/gemini-cli/issues/19561)) to control a ~36.6k-token baseline.
- **Persistent task tracking** — Replacing in-context `WriteToDo` with file-based CRUD task tracking ([#18836](https://github.com/google-gemini/gemini-cli/issues/18836)).
- **Subagent observability** — Exposing subagent trajectories via `/chat share` ([#22598](https://github.com/google-gemini/gemini-cli/issues/22598)) and richer subagent context in bug reports ([#21763](https://github.com/google-gemini/gemini-cli/issues/21763)).
- **Parallel/collaborative agents** — Shared memory or parallel subagent collaboration ([#18287](https://github.com/google-gemini/gemini-cli/issues/18287)).
- **Safety guardrails** — Discouraging destructive commands ([#22672](https://github.com/google-gemini/gemini-cli/issues/22672)) and per-workspace policy scoping ([#18397](https://github.com/google-gemini/gemini-cli/issues/18397)).

---

## 7. Developer Pain Points

- **Subagent reliability and transparency.** Hangs ([#21409](https://github.com/google-gemini/gemini-cli/issues/21409)), silent MAX_TURNS masking ([#22323](https://github.com/google-gemini/gemini-cli/issues/22323)), Wayland browser failures ([#21983](https://github.com/google-gemini/gemini-cli/issues/21983)), and hidden subagent context ([#21763](https://github.com/google-gemini/gemini-cli/issues/21763)) recur across the tracker. This is the single largest source of friction.
- **Configuration not being honored.** `settings.json` overrides ignored by Browser Agent ([#22267](https://github.com/google-gemini/gemini-cli/issues/22267)) and tool-count limits causing 400s ([#24246](https://github.com/google-gemini/gemini-cli/issues/24246)) erode trust in the config surface.
- **Enterprise/paid-tier breakage.** `QUOTA_EXHAUSTED` despite ample remaining quota ([#29425](https://github.com/google-gemini/gemini-cli/issues/29425)) blocks Workspace Standard users despite active subscriptions.
- **Session and workspace hygiene.** Models creating temp scripts in random directories ([#23571](https://github.com/google-gemini/gemini-cli/issues/23571)), destructive git commands ([#22672](https://github.com/google-gemini/gemini-cli/issues/22672)), and duplicate tool results in history ([#30172](https://github.com/google-gemini/gemini-cli/pull/30172)) make clean commits and reproducible sessions harder than they should be.
- **Installation/auto-update misclassification.** Project-local installs launched outside the project root trigger unintended global `npm install -g` ([#30393](https://github.com/google-gemini/gemini-cli/issues/30393), [#30267](https://github.com/google-gemini/gemini-cli/pull/30267), [#30272](https://github.com/google-gemini/gemini-cli/pull/30272)) — an active cluster of fixes under review.

*Digest compiled 2026-11-21 from google-gemini/gemini-cli activity.*

</details>

<details>
<summary><strong>GitHub Copilot CLI</strong> — <a href="https://github.com/github/copilot-cli">github/copilot-cli</a></summary>

# GitHub Copilot CLI Community Digest — 2026-11-21

## 1. Today's Highlights

A busy release day: three patch releases (v1.0.115-2/3/4) landed hardening Windows sandboxing, macOS Mach service lookups, and fixing a plugin initialization race that could block or corrupt session resumption. The issue tracker is dominated by MCP reliability concerns — OAuth token lifecycle, Task augmentation, and server probe failures — alongside a serious new report (#5541) of an agent running a destructive `rsync --delete` command in WSL. Community attention is also converging on long-standing requests: 1-hour Claude prompt cache TTL (#5220, +17 👍) and ACP structured clarification questions, which just shipped in v1.0.115-4.

---

## 2. Releases

**v1.0.115-4**
- **Added:** Structured clarification questions in ACP editors that support forms.
- **Fixed:**
  - Plugin initialization race that blocked new sessions or prevented existing sessions from resuming.
  - Windows: child process cleanup for Git commands, hooks, and language server checks.

**v1.0.115-3**
- **Fixed:** The `@` mention picker now stays visible until an empty search completes, restoring normal `Ctrl+Y` and `Tab` behavior on close.

**v1.0.115-2**
- **Added:**
  - Windows sandbox package queries enabled by default (`sandbox.userPolicy.capabilities: []` to opt out).
  - macOS sandboxed commands can now allow specific Mach service lookups via `sandbox.userPolicy.seatbelt.extraMachLookups` (without enabling Keychain access).
  - `Ctrl+X` then `A` shortcut added in `/model`.

> Note: v1.0.115-4 closes the long-standing ACP request in Issue #2109 — see Hot Issues below.

---

## 3. Hot Issues

1. **[#5478](https://github.com/github/copilot-cli/issues/5478) — Cortex XDR kills the shell when Copilot CLI spawns git (OPEN, 8 comments)**
   On Windows, Cortex XDR flags `parent_process_spoofing` and terminates `cmd`/`powershell` when Copilot CLI invokes git. A hard blocker for enterprise users with EDR tooling — the highest-comment issue in the window.

2. **[#5066](https://github.com/github/copilot-cli/issues/5066) — Assisted permissions regression (CLOSED, 5 comments)**
   Users report assisted-permissions mode demanding approval for trivially safe commands (e.g., a PowerShell directory listing). Now closed, but emblematic of the permission-UX friction discussed in #5539.

3. **[#4203](https://github.com/github/copilot-cli/issues/4203) — Remote MCP OAuth: expired access token forces interactive re-auth (OPEN, 5 comments, +5 👍)**
   The CLI ignores a cached refresh token and forces a fresh OAuth login when the access token expires — dropping all server tools. Directly undermines the value of OAuth-protected MCP servers in unattended flows.

4. **[#4805](https://github.com/github/copilot-cli/issues/4805) — Stale `inuse.<pid>.lock` makes sessions unrevivable (OPEN, 4 comments)**
   After a host crash, session lock files are never reclaimed, permanently bricking otherwise intact sessions. A data-loss-adjacent reliability bug that erodes trust in session persistence.

5. **[#2109](https://github.com/github/copilot-cli/issues/2109) — ACP: support an `ask_user`/`ask_question` extension method (CLOSED, 4 comments, +9 👍)**
   The most-upvoted issue in this window, requesting structured clarification questions for custom ACP clients. Notably, v1.0.115-4 ships exactly this capability — a strong community win.

6. **[#5220](https://github.com/github/copilot-cli/issues/5220) — Option for 1-hour prompt cache TTL for Claude models (OPEN, 4 comments, +17 👍)**
   The highest-👍 open issue: Anthropic's default 5-minute cache TTL routinely expires between interactive prompts, causing full-conversation re-billing. A concrete cost and latency pain point.

7. **[#5090](https://github.com/github/copilot-cli/issues/5090) — Boot experience + input line experience (OPEN, 3 comments)**
   Users must wait for MCP/plugin loading before typing; the request is for async startup. Critical for large repos with many MCP servers.

8. **[#5468](https://github.com/github/copilot-cli/issues/5468) — Remote control fails on GitHub Mobile and github.com (OPEN, updated 2026-11-21, 2 comments)**
   Relay connect fails with "sealed value must bind this connection's challenge." Sessions sync and read fine but cannot be controlled — a cross-surface regression affecting the mobile workflow.

9. **[#5440](https://github.com/github/copilot-cli/issues/5440) — Agent Plugins 1.0: `.instructions.md` and `applyTo` frontmatter silently ignored (OPEN)**
   Plugin packaging loads skills/MCP/agents/hooks, but `com.github.copilot/rules/` instruction files are dropped without warning. Silent failure is especially damaging to plugin authors.

10. **[#5541](https://github.com/github/copilot-cli/issues/5541) — Agent ran `rsync -a --delete <dir>/ /` in WSL, wiping a user drive (OPEN, triage)**
    A quoting failure across the PowerShell→WSL boundary produced a catastrophic command. Zero-upvote so far, but the most severe safety incident reported — merits immediate guardrail discussion (e.g., destructive-command confirmation).

---

## 4. Key PR Progress

No pull requests were updated in the last 24 hours (total: 0 items), so there is no PR activity to report for this window.

---

## 5. Hot Discussions

No Discussions data was provided in the source feed, so this section is omitted.

---

## 6. Feature Request Trends

- **MCP robustness & protocol completeness:** Silent `refresh_token` grant (#4203), Tasks augmentation for `task-required` tools (#5540), case-insensitive `/mcp <server>` matching (#5050), OAuth status probe fixes (#5542), and stricter CI exit codes on MCP startup failure (#3064).
- **Permission model simplification:** One persistent, user-level read-access rule across sessions and repos instead of per-repo duplication or complex rules (#5539); fewer spurious approvals in assisted mode (#5066).
- **Session lifecycle & observability:** Lock reclamation (#4805), AI-credit usage columns in session lists (#5537), and deterministic model/context-window switching (#5535).
- **Editor & terminal ergonomics:** Multiline selection for comments in `/diff` (#5534), stable scroll position during streaming output (#5533), and ACP structured questions (#2109, now shipped).
- **Extension & workflow breadth:** Browser-extension approval flow for non-Chromium/Edge browsers like Vivaldi (#5538).
- **Cost/latency controls:** 1-hour Claude prompt cache TTL (#5220).

---

## 7. Developer Pain Points

1. **Destructive-command safety:** The WSL `rsync --delete` incident (#5541) shows that quoting/escaping failures across shells can escalate into data loss. Users need confirmation gates or dry-run defaults for destructive operations.
2. **MCP auth friction:** Repeated interactive re-auth despite cached refresh tokens (#4203), callback-port mismatches (#4793), and login failures when servers reject a protocol version (#5039) make MCP setup feel brittle — especially in CI and remote workflows.
3. **Windows platform friction:** EDR/antivirus interference (#5478), `/upgrade` bypassing winget and desyncing Add/Remove Programs (#5071), plugin uninstall access-denied errors (#5119), and WSL-only OAuth callback 404s (#4632) form a consistent Windows pain cluster.
4. **Permission fatigue and complexity:** Both too many prompts (#5066) and overly complex configuration (#5539) are reported — users want simple, durable rules, not per-repo policy tuning.
5. **Session fragility and UX resets:** Unreclaimable locks (#4805), context loss at `max_output_tokens` (#4733), permission prompts resetting in-progress question dialogs (#5536), and disappearing `/ask` answers (#4803) all erode session continuity.
6. **Silent failures:** Ignored plugin instruction files (#5440), empty MCP `text/plain` blobs (#4916), and secrets not reaching spawned MCP processes (#4985) are hard to diagnose because nothing surfaces an error.

---

*Generated for 2026-11-21 · Source: github.com/github/copilot-cli*

</details>

<details>
<summary><strong>OpenCode</strong> — <a href="https://github.com/anomalyco/opencode">anomalyco/opencode</a></summary>

# OpenCode Community Digest — 2026-11-21

## 1. Today's Highlights

No new releases landed in the last 24 hours, but the dev branch saw a burst of CI repair and experimental feature work: core typecheck fixes (#65302, #65304), MCP pool test stabilization on Windows (#65305, #65308, #65310), and the first slice of an experimental agent sandbox architecture (#65168). Meanwhile, issue activity is dominated by v2 regressions on Windows and macOS — snapshot bloat, TUI session loss, shell quoting, and permission enforcement gaps.

## 2. Releases

No new releases in the last 24h.

## 3. Hot Issues

1. **[#64073](https://github.com/anomalyco/opencode/issues/64073) — Restore Foreground Subagent Execution** (OPEN, 24 comments, 👍7)
   The most-discussed open issue today. Users want subagent execution to visibly block/foreground rather than silently running in the background, which matters for observability and trust in multi-agent runs. High 👍 count signals strong community demand.

2. **[#50979](https://github.com/anomalyco/opencode/issues/50979) — Session move re-points the global project's worktree** (OPEN, reproduced, 8 comments)
   A data-integrity bug: moving a session into an empty git repo silently mutates the `global` project's worktree, making unrelated sessions point at the wrong directory. Reproduced status raises its severity.

3. **[#60839](https://github.com/anomalyco/opencode/issues/60839) — TUI returns to start screen after sleep/wake** (OPEN, reproduced, 7 comments, 👍4)
   Long unattended runs appear lost after the machine sleeps. The session survives, but the UI doesn't — a real workflow-breaker for overnight agents. A fix PR is already open (#65311).

4. **[#65156](https://github.com/anomalyco/opencode/issues/65156) — Qwen2.5-Coder 1.5B empty `analyze` tool calls via Ollama** (CLOSED, 7 comments)
   Local-model users hitting empty tool calls. Closed quickly, but illustrates ongoing friction between small local models and OpenCode's tool-calling contract.

5. **[#52067](https://github.com/anomalyco/opencode/issues/52067) — `edit` tool "Could not find oldString" for present text** (CLOSED, 6 comments, 👍3)
   Intermittent edit failures and whitespace-insensitive matching bugs block file edits entirely. Core reliability issue for anyone using OpenCode as a coding agent.

6. **[#64117](https://github.com/anomalyco/opencode/issues/64117) — MCP `tools/list_changed` doesn't surface new tools** (OPEN, repro-simulated, 4 comments)
   Dynamically enabled MCP tools never become callable. This breaks a core MCP capability and affects anyone running MCP servers that hot-reload tools.

7. **[#65214](https://github.com/anomalyco/opencode/issues/65214) — Windows `shell` tool returns empty output for path arguments** (CLOSED, 4 comments)
   On 2.3.2 Windows, commands with path arguments return nothing. File inspection and syntax checks silently fail — a serious platform regression.

8. **[#65127](https://github.com/anomalyco/opencode/issues/65127) — Snapshots pack 90 GB, include git-ignored and >2 MiB files** (OPEN, repro-simulated, 4 comments)
   The `/undo` snapshot store ignores `.gitignore` and size limits, ballooning to 90 GB. A PR (#65239) addressing both bugs is already open.

9. **[#55676](https://github.com/anomalyco/opencode/issues/55676) — Keybinds fail on non-Latin layouts** (OPEN, reproduced, 3 comments)
   `Ctrl+F` and letter shortcuts break on Russian/Cyrillic layouts because matching uses `event.key`. Long-standing i18n accessibility gap, now reproduced.

10. **[#65290](https://github.com/anomalyco/opencode/issues/65290) — `external_directory` ask rule never prompts** (OPEN, severity:high, 2 comments)
    A security-relevant bug: configured permission rules for reads outside the project are loaded but silently bypassed. Severity:high tag makes this one to watch.

## 4. Key PR Progress

1. **[#65311](https://github.com/anomalyco/opencode/pull/65311) — fix(tui): retry session reads after reconnect** — Direct fix for #60839; keeps long-running sessions visible after sleep/wake instead of falling back to the start screen.

2. **[#65168](https://github.com/anomalyco/opencode/pull/65168) — feat(core): experimental agent sandbox foundation** — First slice of the sandbox architecture from #62292, partial work toward #48411. Foundational for safe agent execution.

3. **[#65271](https://github.com/anomalyco/opencode/pull/65271) — feat(mcp): follow MCP Events beta (SEP-3415)** — Brings the experimental MCP Events client up to the push-delivery beta, enabling server-initiated events.

4. **[#65239](https://github.com/anomalyco/opencode/pull/65239) — fix(core): enforce snapshot ignore/size limits** — Fixes #64918 and #65127 by respecting `.gitignore` and bounding capture time/size in the snapshot store.

5. **[#65293](https://github.com/anomalyco/opencode/pull/65293) / [#65296](https://github.com/anomalyco/opencode/pull/65296) — Automations on by default + config key** — Moves automations from an experimental opt-in flag to a top-level config setting enabled in every build.

6. **[#65300](https://github.com/anomalyco/opencode/pull/65300) — feat(core): session full-text search in dev builds** — Removes `sqlite_fts` from the opt-in-only list, making session search testable by default in dev.

7. **[#65295](https://github.com/anomalyco/opencode/pull/65295) — fix(core): machine review fixes** — Notably fixes "always approve" on one machine leaking approval to every connected machine. Important multi-machine security fix.

8. **[#65307](https://github.com/anomalyco/opencode/pull/65307) — feat(data): weekly view for bar charts** — Adds a Daily/Weekly toggle across all opencode.ai/data time-series charts (models, usage, tokens).

9. **[#65193](https://github.com/anomalyco/opencode/pull/65193) — fix(core): record top-level Code Mode tool calls as execute programs** — Fixes weaker models that call Code Mode tools at the top level, improving session replay/search fidelity.

10. **[#65308](https://github.com/anomalyco/opencode/pull/65308) / [#65302](https://github.com/anomalyco/opencode/pull/65302) / [#65304](https://github.com/anomalyco/opencode/pull/65304) — dev CI restoration** — A cluster of fixes restoring dev typecheck and stabilizing the Windows MCP pool tests. Not glamorous, but unblocks everything else.

## 5. Hot Discussions

No discussion data was provided for this period.

## 6. Feature Request Trends

- **Subagent visibility & control** (#64073): users want foreground execution and clearer background/foreground separation. Follow-on work in #65303/#65306 shows the team is already tuning how Code Mode scripts appear in the background pill.
- **UI ergonomics**: dismissable thinking blocks with a tap/click (#60009) and general TUI/desktop polish requests.
- **SDK/API correctness**: `session.interrupt` always reports `reason: "user"` (#65279) — callers want accurate interrupt attribution for programmatic control.
- **Automations as a first-class feature**: the flag→config migration in #65293/#65296 reflects sustained demand for scheduled/automated runs.
- **Sandboxing & permissions**: #65168 and #65290 together show demand for both safer execution *and* reliable enforcement of existing permission rules.

## 7. Developer Pain Points

- **Windows is the dominant pain surface**: empty shell output for path args (#65214), `cmd` double-quote escaping (#64573), CLI infinite hang on first message (#65245), NumPad Home/End bindings (#65158), desktop opening `%USERPROFILE%` instead of the project (#65309), and repeated Windows CI failures in the MCP pool tests (#65305, #65310).
- **v2.3.2 regressions**: multiple issues explicitly cite 2.3.2 (desktop duplicate projects #65145, Inbox paint bug #65278, shell behavior), suggesting a rough release cycle.
- **Edit/snapshot reliability**: intermittent `oldString` matching failures (#52067) and runaway snapshot capture (#65127) undermine the core edit/undo loop.
- **Permission enforcement gaps**: configured rules not being prompted (#65290) and cross-machine approval leakage (#65295) erode trust in the safety model.
- **Upgrade friction**: `opencode upgrade` failing on Linux (#65253).
- **Non-Latin layout support**: keybind matching on `event.key` continues to break shortcuts for Cyrillic and other layouts (#55676).

</details>

<details>
<summary><strong>Pi</strong> — <a href="https://github.com/earendil-works/pi">earendil-works/pi</a></summary>

# Pi Community Digest — 2026-11-21

## 1. Today's Highlights

Pi **v1.6.0** ships with GPT-6.2 Astra and GPT-6.2 Sol across `openai`, `azure`, and `openai-codex` providers, with Sol becoming the default model everywhere. The release triggered a wave of follow-up bug reports — most notably a P0 regression where `--thinking high/xhigh` on GPT-6 models silently downgrades to `reasoning.effort: "medium"` (#12361), plus intermittent "reasoning items dropped (prefix_mismatch)" errors (#12367). Meanwhile, Windows-specific reliability issues (Git Bash command truncation, console shutdown cleanup) and Gemini 4 Hydrogen's unsupported `xhigh` thinking level dominate the maintenance queue.

---

## 2. Releases

**v1.6.0** — [Release link](https://github.com/earendil-works/pi/releases/tag/v1.6.0)
- **GPT-6.2 Astra & GPT-6.2 Sol** added to the `openai`, `azure`, and `openai-codex` providers.
- **GPT-6.2 Sol is now the default model** for all three providers.
- Provider docs: [packages/coding-agent/docs/providers.md](https://github.com/earendil-works/pi/blob/v1.6.0/packages/coding-agent/docs/providers.md)

---

## 3. Hot Issues

1. **[OPEN][bug, prio:p0] openai-codex 1.6.0: --thinking high/xhigh on GPT-6 models gets less reasoning** ([#12361](https://github.com/earendil-works/pi/issues/12361))
   A direct regression from v1.6.0: `compat.supportsMidConvoEffort: true` forces `reasoning.effort: "medium"` regardless of the selected thinking level, so users selecting high/xhigh get *less* reasoning than requested. High impact for anyone relying on codex providers for deep reasoning tasks.

2. **[OPEN][bug, prio:p0] OpenAI drops reasoning items (prefix_mismatch)** ([#12367](https://github.com/earendil-works/pi/issues/12367))
   Post-1.6.0 upgrade, sessions intermittently fail with dropped reasoning items. Reproducible session linked; likely tied to the same codex reasoning-effort changes as #12361.

3. **[OPEN][inprogress, prio:p0] Anthropic /login fails on Claude Team/Enterprise seats: "Unknown scope"** ([#12318](https://github.com/earendil-works/pi/issues/12318))
   OAuth request rejected with `Unknown scope: user:i…` before the consent screen for Team seats. Blocks enterprise adoption; already in progress.

4. **[OPEN][bug, prio:p0] Google adapters reject Gemini 4 Hydrogen's advertised xhigh level** ([#12184](https://github.com/earendil-works/pi/issues/12184), 👍 2)
   models.dev advertises `xhigh`, `/thinking` lets you select it, but selection throws before any HTTP request. A companion request ([#12177](https://github.com/earendil-works/pi/issues/12177), 👍 2) asks for native `xhigh` support in both `google-generative-ai` and `google-vertex` adapters.

5. **[OPEN][bug] Windows Git Bash silently truncates long RPC bash commands** ([#12340](https://github.com/earendil-works/pi/issues/12340))
   8,336-char RPC commands are cut to 8,186 chars by the Cygwin runtime, returning `exitCode: 0` and `truncated: false` — silent data loss on Windows. Independent of the similar #7547.

6. **[OPEN][inprogress, prio:p0] OpenAI service tier pricing: ultrafast bills at 1x; Codex misses fast tiers set in onPayload** ([#12308](https://github.com/earendil-works/pi/issues/12308))
   `usage.cost` underreports in three OpenAI scenarios, including ultrafast billing at standard rates. Cost-accuracy concern for heavy API users.

7. **[CLOSED] Session with >~120k entries after last compaction fails to load: RangeError** ([#12154](https://github.com/earendil-works/pi/issues/12154))
   A spread operator passed every entry as a function argument, blowing the call stack on long sessions. Long-session stability fix landed in [PR #12360](https://github.com/earendil-works/pi/pull/12360).

8. **[CLOSED] createProvider re-merges the whole model catalog on every getModels() call (quadratic)** ([#12311](https://github.com/earendil-works/pi/issues/12311))
   `findIndex` per fetched model on every call made lookups quadratic in catalog size. Fixed in [PR #12366](https://github.com/earendil-works/pi/pull/12366); noticeable startup latency win for large catalogs.

9. **[OPEN] Pasted ANSI leaves escape-sequence corpses in the prompt; unterminated bracketed paste wedges the editor** ([#11383](https://github.com/earendil-works/pi/issues/11383), 👍 1)
   Pasting terminal output injects escape bodies as literal text; worse, an unterminated bracketed paste deadlocks the editor including Ctrl+C. Long-standing TUI robustness gap (`pi-tui` 1.4.0).

10. **[CLOSED][fix-available] Bedrock requests hang with HTTPS_PROXY set: AWS credential chain ignores the proxy** ([#12353](https://github.com/earendil-works/pi/issues/12353))
    SSO profile credential resolution builds its own SSO/OIDC clients without proxy awareness, causing 120–400s hangs. Fix available in [PR #12365](https://github.com/earendil-works/pi/pull/12365).

---

## 4. Key PR Progress

1. **[#12369](https://github.com/earendil-works/pi/pull/12369) (OPEN) — fix(coding-agent): pass Windows bash commands in an environment variable**
   Closes #12340. Works around Cygwin's 8,186-char argument cap and newline splitting for Node-spawned Git Bash. Critical for Windows RPC users.

2. **[#12365](https://github.com/earendil-works/pi/pull/12365) (CLOSED) — fix(ai): resolve Bedrock SSO credentials through HTTPS_PROXY**
   Routes SSO GetRoleCredentials and token-refresh clients through the proxy-aware handler, unblocking Bedrock behind corporate proxies.

3. **[#12360](https://github.com/earendil-works/pi/pull/12360) (CLOSED) — load sessions with very many entries after the last compaction**
   Replaces an argument-spread `push(...)` with safe appending — fixes the 120k-entry `RangeError` and restores `--session` startup.

4. **[#12366](https://github.com/earendil-works/pi/pull/12366) (CLOSED) — merge createProvider model catalog once per publish, not per read**
   Removes the quadratic `findIndex`-per-model merge; catalog merging now happens at publish time only.

5. **[#12371](https://github.com/earendil-works/pi/pull/12371) (CLOSED) — Gemini 3+ detection for prefixed Google model IDs, add compat.supportsStrictMode**
   Closes #12321. Models like `google/gemini-4-argon` now get strict tools and tool-call ID handling instead of falling back to legacy Gemini behavior.

6. **[#12357](https://github.com/earendil-works/pi/pull/12357) (OPEN) — distinguish Google prompt blocks from incomplete streams**
   When Google returns `promptFeedback` with no candidates, callers now get actionable diagnostics instead of a generic incomplete-stream error.

7. **[#12352](https://github.com/earendil-works/pi/pull/12352) (CLOSED) — retry gateway provider-unavailable and partial-response errors**
   Adds retry handling for OpenRouter-style mid-stream SSE error frames ("provider temporarily unavailable", "response ended before complete") that lack HTTP status codes.

8. **[#12356](https://github.com/earendil-works/pi/pull/12356) (OPEN) — exit nonzero in JSON mode when the final response fails**
   Aligns `--mode json` exit codes with text mode for `error`/`aborted` stop reasons — important for CI pipelines consuming JSON output.

9. **[#12358](https://github.com/earendil-works/pi/pull/12358) (CLOSED) — report OpenAI Decisions cache read and write tokens**
   `parseClassifierUsage()` previously hardcoded `cacheRead: 0, cacheWrite: 0`, so every classifier call was mispriced. Now surfacing `cached_tokens` and `cache_write_tokens`.

10. **[#12349](https://github.com/earendil-works/pi/pull/12349) (CLOSED) — repaint editor after extension pasteToEditor and setEditorText**
    Extensions mutating editor state outside terminal input handling now repaint immediately instead of appearing dead until the next keypress.

*Also worth noting:* [#12370](https://github.com/earendil-works/pi/pull/12370) and [#12280](https://github.com/earendil-works/pi/pull/12280) offer competing fixes for the tree-navigation history duplication bug (#12279); [#12348](https://github.com/earendil-works/pi/pull/12348) cleans up abort listener leaks during retry backoff; [#12134](https://github.com/earendil-works/pi/pull/12134) changes the default openai-completions instruction role from `developer` to `system` for broader gateway compatibility.

---

## 5. Hot Discussions

**Show and tell**
- **[#12364 — Claude subs in Pi without installing Claude Code](https://github.com/earendil-works/pi/discussions/12364)** (👍 1)
  Uses Pi's own tools, models, and harness with a Claude Pro/Max subscription via `pi install npm:pi-anthropic-oauth`. Relevant given the enterprise-seat OAuth problems in #12318 — community workaround for auth-adjacent friction.

---

## 6. Feature Request Trends

- **Reasoning-effort fidelity across providers.** Multiple open items (`#12361`, `#12384`/`#12184`, `#12377`) demand that the `--thinking` level actually map to each provider's native effort controls — including Gemini 4 Hydrogen's `xhigh` — without silent downgrades or pre-request rejections.
- **Model detection by capability, not naming convention.** Requests in `#12321` and `#12359` want Gemini (and by extension other families) recognized by provider metadata rather than `gemini-`-prefixed IDs, since third-party gateways use arbitrary prefixes.
- **Cache-warming configurability.** `#11127` asks for a configurable idle cache-warming horizon (e.g., 60–120 min vs. the 30-min default) to better match prompt-cache TTLs.
- **More first-class providers.** `#12258` (Sarvam AI Token Factory) and `#11999` (Ant Ling 3.x migration) show continued demand for built-in provider coverage and keeping stale catalogs current.
- **Extension/hook control.** `#11055` requests the ability for `beforeRequest` hooks to actually reject a request rather than being advisory-only.

## 7. Developer Pain Points

- **Windows is the sharpest edge.** Long command truncation (#12340), missing SIGHUP-equivalent shutdown cleanup (#11889), and install-script confusion with Ubuntu's unrelated `pi` package (#12166) form a recurring cluster of platform friction.
- **Silent failures erode trust.** Truncated-but-"successful" commands (#12340), dropped SSE error codes before retry classification (#12169), and underreported cost tiers (#12308) all share a pattern: wrong behavior with no signal to the developer.
- **Post-1.6.0 reasoning regressions.** #12361 and #12367 arriving within 24h of release suggest the codex `supportsMidConvoEffort` change needs a more careful rollout or per-level validation.
- **OAuth and enterprise auth fragility.** Anthropic Team/Enterprise scope rejection (#12318) plus the community OAuth shim (#12364) indicate auth paths need clearer error surfaces and broader seat-type coverage.
- **TUI terminal-state robustness.** ANSI paste corruption and editor deadlock (#11383) and theme-contrast readability (#12347) remain persistent papercuts in `pi-tui`.
- **Long-session scale.** The 120k-entry `RangeError` (#12154) and quadratic catalog merge (#12311) show the codebase needs more stress testing at realistic session and catalog sizes.

</details>

<details>
<summary><strong>Qwen Code</strong> — <a href="https://github.com/QwenLM/qwen-code">QwenLM/qwen-code</a></summary>

# Qwen Code Community Digest — 2026-11-21

## 1. Today's Highlights

A patch release (**v0.28.3**) plus a preview and nightly landed, all carrying the same managed-agent E2E and PR-verification hardening work. CI reliability remains the dominant theme: the long-running Managed Agent gate failure (#14724, now 506 comments) and a fresh E2E flake (#17934) drove most activity. Meanwhile, the managed-agent runtime and Web Shell migration continued to advance through a steady stream of stacked PRs.

## 2. Releases

Three builds published in the last 24h, all sharing an identical change set:

- **v0.28.3** (stable) — [release](https://github.com/QwenLM/qwen-code/releases)
- **v0.28.1-preview.1** — [release](https://github.com/QwenLM/qwen-code/releases)
- **v0.28.0-nightly.20261120.19b31401f5** — [release](https://github.com/QwenLM/qwen-code/releases)

Common changes:
- `test(managed-agent)`: observe a real scheduled `/loop` fire in the full-stack E2E ([#17506](https://github.com/QwenLM/qwen-code/pull/17506)) by @wenshao
- `fix(verify-pr)`: harden the watch-state shell logic

This is a test/CI hardening release rather than a user-facing feature drop — the notable signal is the team investing in real E2E coverage for the managed-agent scheduler before the 0.28 line stabilizes.

## 3. Hot Issues

1. **[#14724](https://github.com/QwenLM/qwen-code/issues/14724)** — Main CI failed: Managed Agent gate, no test identified. **506 comments**, open since 2026-10-19. The single most active thread in the repo; a chronic gate that keeps re-firing per commit. Community reaction: near-total bot churn, but it signals a systemic CI stability problem.
2. **[#11680](https://github.com/QwenLM/qwen-code/issues/11680)** — Main CI failed: E2E Tests (sandbox:docker shard). 100 comments, open since September. A long-lived sandbox E2E failure that never closed — evidence the docker sandbox lane is a persistent weak point.
3. **[#15486](https://github.com/QwenLM/qwen-code/issues/15486)** — **P1 bug**: after automatic compaction, the next request double-counts the pending tool result and adds a 20K pad, forcing `max_tokens: 1` or a stopped turn. The most substantive correctness bug on the board — directly affects token management and turn success.
4. **[#17039](https://github.com/QwenLM/qwen-code/issues/17039)** — `ci`: make the Managed Agent gate name stable so it can become a required check. Root-cause analysis of why a broken Java suite merged via #17006. Now closed/ready-for-human — good sign the gate instability is being addressed at the source.
5. **[#16832](https://github.com/QwenLM/qwen-code/issues/16832)** — Manual PR re-review channel dead because `qwen-code-pr-review.yml` gates on a bot account that no longer exists (404). Closed. Notable because it broke re-review repo-wide.
6. **[#17523](https://github.com/QwenLM/qwen-code/issues/17523)** — managed-agent: pre-admission load refusals still consume the ordinary retry budget. A correctness issue in session load/retry semantics; P2.
7. **[#17885](https://github.com/QwenLM/qwen-code/issues/17885)** — Windows Java lane red since #17478: a 32,780-char capture payload passed through argv exceeds the Windows 32,767 limit. Sharp, well-diagnosed platform bug; closed.
8. **[#17934](https://github.com/QwenLM/qwen-code/issues/17934)** — E2E: `qwen-serve-restart-recovery` fails after daemon SIGKILL. Fresh (created 2026-11-20), 14 comments — the newest reliability regression.
9. **[#17957](https://github.com/QwenLM/qwen-code/issues/17957)** — Managed Agent gate: `RuntimeProviderPluginsTest.builtinProvidersAreTrulyOptionalOnTheApplicationClasspath`. Another per-commit gate failure — reinforces the pattern of #14724.
10. **[#17086](https://github.com/QwenLM/qwen-code/issues/17086)** — `qwen4-max-preview`: server-side Chinese tool-URL rule (routify) leaks into context and the model flags it as prompt injection. Closed but a genuinely interesting model-behavior/context-hygiene case.

Also worth noting: **[#17188](https://github.com/QwenLM/qwen-code/issues/17188)** (DeepSeek V3.1/V3.2 fall back to the generic 32K output limit despite catalog listing 65536) and **[#17963](https://github.com/QwenLM/qwen-code/issues/17963)** (Web Shell environment panel hidden behind the pending-question card, unscrollable).

## 4. Key PR Progress

1. **[#17965](https://github.com/QwenLM/qwen-code/pull/17965)** / **[#17964](https://github.com/QwenLM/qwen-code/pull/17964)** — `fix(managed-agent)`: create the ephemeral Runtime state directory at spawn time, not at provider creation. Restores the rule that constructing a Runtime provider must not touch the filesystem. Two competing implementations from @yiliang114 and @wenshao.
2. **[#17953](https://github.com/QwenLM/qwen-code/pull/17953)** — `feat(managed-agent)`: runtime-owned background observation (Phase 3b slice 1 + staging schema). Moves running-output digest out of the Harness process so a Harness restart doesn't lose background Shell/Monitor state.
3. **[#17474](https://github.com/QwenLM/qwen-code/pull/17474)** — `feat(managed-agent)`: wire external foreground Shell into Broker and Control Plane [17357 B/2]. Broker dispatch/cancel/reconcile/close fences plus Control Plane profile negotiation; stacked on #17472.
4. **[#17910](https://github.com/QwenLM/qwen-code/pull/17910)** — `fix(core)`: retain oversized transcript indexes in a bounded cache class (256 MiB LRU) instead of refusing admission under the shared 64 MiB budget. Directly relevant to large-session performance.
5. **[#17952](https://github.com/QwenLM/qwen-code/pull/17952)** — `feat(web-shell)`: contract-driven `ChatSurface` chat column. Backend-neutral renderer for the unified chat surface migration — a key step in the Web Shell refactor.
6. **[#17902](https://github.com/QwenLM/qwen-code/pull/17902)** — `fix(core)`: correct usage token accounting across the dashboard and `/stats`, sourcing from the per-request usage ledger instead of session summaries that replay resumed history.
7. **[#17951](https://github.com/QwenLM/qwen-code/pull/17951)** — `fix(release)`: resume a partial release instead of refusing its retry. Compares the regenerated tree against the existing release branch tip so a partial npm publish can continue.
8. **[#17903](https://github.com/QwenLM/qwen-code/pull/17903)** — `fix(ci)`: gate the Teams channel on its npm publishing bootstrap, holding it out of release until a maintainer does the one-time public publish.
9. **[#17823](https://github.com/QwenLM/qwen-code/pull/17823)** — `fix(agents)`: keep A2A tasks recoverable after transcript read errors; returns retryable `-32012` instead of losing task results.
10. **[#17437](https://github.com/QwenLM/qwen-code/pull/17437)** — `feat(i18n)`: Arabic support for CLI and Web Shell with RTL layout, including exported HTML transcripts. Largest user-facing localization addition in the window.

Other notable: **[#17968](https://github.com/QwenLM/qwen-code/pull/17968)** (strengthen four managed DingTalk witnesses that passed for the wrong reason), **[#17918](https://github.com/QwenLM/qwen-code/pull/17918)** (touch acceptance for Web Shell follow-up suggestions), **[#17935](https://github.com/QwenLM/qwen-code/pull/17935)** (dark-theme sidebar logo).

## 5. Hot Discussions

No GitHub Discussions data was provided for this window; this section is omitted.

## 6. Feature Request Trends

Distilled from issues and PRs active in the last 24h:

- **Managed-agent runtime maturity** — the largest cluster: runtime-owned background observation (#17953), external foreground Shell into Broker/Control Plane (#17474), ephemeral state directory handling (#17964/#17965), and retry-budget correctness (#17523). The managed-agent server is clearly the active development frontier.
- **Session/context management** — transcript index retention (#17910), token accounting (#17902), worktree Codex parity P6/P7 (#17237), and JSONL append diagnostics (#17852).
- **Web Shell unification** — the shared `ChatSurface` migration (#17952), worktree parity, touch-suggestion UX (#17918), and UI layout fixes (#17963).
- **Internationalization** — Arabic/RTL (#17437) joins the shipped language set.
- **Historical statistics** — native `/stats` activity and efficiency view (#17376).
- **Channel integrations** — DingTalk, Teams, QQ, Aone follow-up trackers dominate the integration backlog.

## 7. Developer Pain Points

- **Chronic CI gate instability** — #14724 (506 comments) and the recurring "no test identified" per-commit failures (#11680, #11678, #13471, #17957) are the top frustration. The gate name being unstable blocked it from becoming a required check (#17039), and a broken Java suite merged via #17006, poisoning subsequent PRs.
- **Broken tooling infrastructure** — the PR re-review channel silently died because it referenced a deleted bot account (#16832), a 404-level breakage of maintainer workflow.
- **Platform-specific failures** — the Windows argv 32,767-char limit (#17885) and macOS/docker E2E lanes produce deterministic, hard-to-triage red lanes.
- **Token/context accounting bugs** — double-counting after compaction (#15486) and model output-limit normalization (DeepSeek #17188) cause real user-visible turn failures.
- **Flaky tests** — repeated deflake issues (e.g., #17884) show nondeterministic tests consuming review cycles.
- **Process overhead** — many issues are "follow-up trackers" for deferred non-blocking review suggestions (#17173, #17517, #17673, #17769, #17924, #17931), suggesting a heavy review-convergence process that defers rather than resolves items.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*