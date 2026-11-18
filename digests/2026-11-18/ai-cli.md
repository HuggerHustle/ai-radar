# AI CLI Tools Community Digest 2026-11-18

> Generated: 2026-11-18 02:50 UTC | Tools covered: 7

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
**Date: 2026-11-18 | Sources: Claude Code, OpenAI Codex, Gemini CLI, GitHub Copilot CLI, OpenCode, Pi, Qwen Code**

---

## 1. Ecosystem Overview

The AI CLI tool landscape on 2026-11-18 is characterized by **release-cadence divergence**: some tools (Codex, Qwen Code, OpenCode) are shipping daily or near-daily, while others (Gemini CLI, Pi) paused releases to focus on agent-subsystem stability and refactoring. A dominant cross-cutting theme is **agent/subagent reliability** — silent failures, permission bypasses, and hangs appear in nearly every tracker, suggesting the industry has moved past "does the agent work?" to "can we trust and audit what it does?" Simultaneously, **platform-specific friction (especially Windows)** and **enterprise governance controls** (managed settings, sandbox policies, multi-account support) are absorbing significant community attention. The ecosystem is bifurcating between **consumer-facing desktop/mobile parity work** and **enterprise-grade policy, observability, and audit surfaces**.

---

## 2. Activity Comparison

| Tool | Issues (24h) | PRs (24h) | Discussions | Release Status | Notes |
|---|---|---|---|---|---|
| **Claude Code** | ~10 hot (high volume) | **0** | N/A | v2.1.327 (security patch) | Issue-heavy, no PR activity in window |
| **OpenAI Codex** | ~12 hot (sustained) | **~13 merged** | Active (Ideas/Q&A/Show-and-tell) | rust-v0.169.1 stable + 0.170/0.171 alphas | Highest PR throughput; alpha churn |
| **Gemini CLI** | ~10 hot (agent-focused) | ~10 (several P1) | N/A | No release | Nightly bumps stale — pipeline lag |
| **GitHub Copilot CLI** | ~10 hot (triage-heavy) | **0** | N/A | v1.0.114-0 + v1.0.113 browserUse setting | Quiet PR day; enterprise control added |
| **OpenCode** | ~10 hot | ~10 (incl. large desktop feature) | N/A | **v2.3.2 + v2.3.1 + v1.19.6** | Most releases today; GPT-6.2 caching fix |
| **Pi** | ~38 updated (top 10 shown) | 4 | N/A | No release | High issue churn; p0 abort-crash cluster |
| **Qwen Code** | ~20+ (incl. Java SDK wave) | ~12 | N/A | **v0.28.0 + SDK v0.1.35 + Desktop v0.28.0** | Broadest release surface today |

**Reading the table:** "N/A" for Discussions reflects repos where the community channel is Issues/PRs (or data wasn't surfaced), **not** inactivity. Codex is the only tool with an active GitHub Discussions surface. Qwen Code and OpenCode shipped the most user-facing artifacts; Codex had the highest merged-PR velocity; Claude Code and Copilot CLI had zero PR movement — likely a maintainer-side batch/merge cadence rather than disengagement, given both shipped releases.

---

## 3. Shared Feature Directions

Four requirements recur across **three or more** tool communities:

### (a) Bash/Shell as a Permission Bypass — the #1 cross-tool trust gap
- **Claude Code**: #89251, #85511 — Bash-routed writes bypass `PreToolUse` hooks and per-edit diff review.
- **Codex**: #44088 + Discussion #3057 — agents edit files via Python/`pathlib`, skipping per-file review cards.
- **Gemini CLI**: #30338 — `PolicyEngine` upgrades commands to `ALLOW` based on *unexpanded* text; #22672 — destructive `git reset --force`.
- **Qwen Code**: #17372, #16784 — shell-redirection argument retention and fail-closed on undecodable paths.
- **Copilot CLI**: #5478 (EDR shell-kill) is adjacent — shell spawning is the fault line.
**Need:** file mutations should route through a single reviewable, hook-observable pipeline regardless of tool used.

### (b) Silent failures masquerading as success
- **Gemini CLI**: #22323 (subagent reports GOAL success after MAX_TURNS), #22267 (settings overrides silently ignored).
- **Copilot CLI**: #4773 ("Found 0 tools"), #5496 (instruction files skipped with no error).
- **Codex**: #37550 (UI stuck on loading while work continues).
- **OpenCode**: #64488 (context % exceeds 100%), #54059 (misleading SSH errors).
**Need:** agents and their UIs must fail loudly and truthfully.

### (c) Multi-session / multi-account / concurrency safety
- **Claude Code**: #27302 (multi-Connector accounts, 312 comments), #86713/#96018 (state loss on project rename).
- **Codex**: #53071 (parallel VS Code chats), subagent transcript PRs #62157/#62159.
- **Pi**: #12266 (stale-leaf forking), #10798 (npm install races).
**Need:** first-class support for parallel work and multiple identities without state corruption.

### (d) Provider/model-catalog fidelity
- **Pi**: #11021 (272K vs 500K context), #12184 (Gemini xhigh rejected), #12267 (ultra tier).
- **OpenCode**: #40524, #64489 (stale static catalogs), #64416 (non-compliant streaming).
- **Codex**: #62144 (web search provider persistence), #56174 (opaque quota).
**Need:** live reconciliation with provider `/models` endpoints and honored capability metadata.

### (e) Enterprise governance & observability
- **Copilot CLI**: `features.browserUse` managed setting; #4446 (org sandbox enforcement), #4825 (OTel per-phase attribution).
- **Claude Code**: #101780 (gateway billing per Entra group), #109909 (device trust).
- **Gemini CLI**: #18397 (workspace-scoped policy).
**Need:** admin-side control planes that match the agent capabilities being shipped.

---

## 4. Differentiation Analysis

| Dimension | Claude Code | OpenAI Codex | Gemini CLI | Copilot CLI | OpenCode | Pi | Qwen Code |
|---|---|---|---|---|---|---|---|
| **Primary focus** | Security/permission model; enterprise connectors | Windows Computer Use + Cloud/Remote; TUI reliability | Agent/subagent correctness; sandboxing | Enterprise policy; SDK/extension ecosystem | Desktop app + provider breadth | Provider adapter fidelity; local models | Full-stack (CLI+SDK+Desktop+Web Shell) |
| **Target user** | Security-conscious teams; org-scale deployments | Prosumer + mobile/desktop hybrid users | Developers wanting bash-native agents | Enterprise/Windows orgs; extension authors | Desktop-first power users | Local-model / multi-provider tinkerers | Subscription users; Java/TS SDK consumers |
| **Technical approach** | Hook-driven permission pipeline (currently leaky via Bash) | Rust core, rapid alpha cadence, app-server/CLI split | Native bash affinity + AST-aware navigation push | Managed settings + Marketplace plugins | Electron desktop + embeddable Code Mode (Rust `psychoscript`) | Extension/event surface; thinking-tier support | 1.0 loop-kernel migration (event-driven `query()`) |
| **Distinctive bet** | Deep enterprise identity/billing integration | CUA on Windows + Cloud/Remote parity | Zero-dependency OS sandboxing (#19873) | Admin-managed browser/agent controls | Signed-in browser pane + video tooling | Provider-agnostic correctness | Multi-surface subscription parity |

**Key differentiators:**
- **Claude Code** is the most *security-and-permission-model-centric*, but that focus is also its largest liability (Bash bypass).
- **Codex** is the most *release-aggressive* (alphas) and the only one fighting a concentrated Windows CUA reliability cluster.
- **Gemini CLI** is the most *architecturally ambitious* (AST-aware navigation + native bash sandboxing).
- **Copilot CLI** is the most *enterprise-policy-forward*, with managed settings shipping ahead of competitors.
- **OpenCode** is the most *desktop-and-provider-breadth* oriented, with an unusually deep Rust investment (Code Mode port).
- **Pi** is the most *provider-adapter-focused*, catering to local/gateway inference users.
- **Qwen Code** is the most *surface-complete*, shipping CLI + TS/Java SDK + Desktop + Web Shell in lockstep.

---

## 5. Community Momentum & Maturity

**Highest raw engagement (comment volume):**
- **Qwen Code** — #14724 at **431 comments** (CI gate failure); a single thread dwarfs most repos' totals.
- **Claude Code** — #27302 at **312 comments / 481 👍**; the most-upvoted single feature ask in the entire set.
- **Pi** — #7547 at **97 comments** (Windows meta-thread); 38 issues updated in 24h.
- **Codex** — #57101 at **55 comments**, sustained over three weeks.

**Most rapid iteration (shipping velocity):**
- **OpenCode** — 3 releases today including a same-day issue→fix (#64550 → v2.3.2).
- **Qwen Code** — 4 artifacts (CLI, preview, SDK, Desktop) in one day.
- **Codex** — 13 merged PRs forming a coherent TUI/Cloud reliability theme; parallel alpha lines.

**Maturity signals:**
- **Most mature governance:** Copilot CLI (managed settings) and Claude Code (multi-account, gateway billing) — enterprise controls shipping, not just requested.
- **Most mature triage velocity:** OpenCode (#64481, #64488 closed same day) and Pi (p0 abort crashes closed rapidly).
- **Least mature in a specific area:** Qwen Code's **Java SDK** shows a dense single-day bug wave (#17640–#17656: process leaks, JSONL corruption, lost UUIDs) indicating a legacy surface overdue for hardening.
- **Pipeline health concern:** Gemini CLI's stale nightly bumps (#29196, #29403) suggest a release-pipeline stall despite heavy issue/PR activity — a mismatch between development and delivery.

**Verdict:** Codex and OpenCode are iterating fastest; Qwen Code and Claude Code have the loudest communities; Gemini CLI and Pi are in stability/refactor phases; Copilot CLI is quietly building enterprise moat.

---

## 6. Trend Signals

**For developers and technical decision-makers, five industry-level signals:**

1. **The Bash side-door is the defining security problem of 2026 agent CLIs.** Every major tool has an open issue where shell execution bypasses the intended review/permission surface. **Action:** if you rely on `PreToolUse`/diff review for safety, audit Bash-routed writes today — they are not currently covered in most tools.

2. **"Silent success" is eroding trust faster than outright failure.** Subagents reporting GOAL after hitting turn limits, config overrides ignored, tools reported unavailable — users cannot distinguish working from broken. **Action:** prefer tools that surface explicit failure states and telemetry (Copilot CLI's OTel push, Pi's `ttftMs`/`ttfaMs` metrics).

3. **Windows is the ecosystem's reliability tax.** Codex CUA timeouts (#57101, #59303), Copilot EDR shell-kill (#5478), Claude `file://` path printing (5× auto-closed), Gemini PowerShell freeze (#30334). **Action:** Windows users should expect platform-specific breakage and validate tooling in WSL/Git Bash where possible.

4. **Provider/model-catalog drift is a growing integration hazard.** As model releases accelerate (Gemini 4 Hydrogen, GPT-6.2, Qwen 3.8), adapters lag advertised capabilities — breaking caching, context budgets, and thinking tiers. **Action:** pin model versions and verify cache/context behavior after provider updates; expect billing surprises (Codex #56174, OpenCode GPT-6.2 caching).

5. **Enterprise control planes are becoming a purchase criterion.** Managed settings (Copilot `features.browserUse`), multi-account connectors (Claude #27302), per-group billing (Claude #101780), and org-scoped sandbox policy (Gemini #18397) show buyers now evaluate governance, not just capability. **Action:** for org deployments, weight admin policy surfaces and audit/OTel support heavily in tool selection.

**Bottom line:** The 2026 AI CLI market is transitioning from *capability races* to *trust, governance, and reliability races*. Tools that close the Bash-review gap, eliminate silent failures, and ship enterprise control planes will win regulated and team deployments; tools that iterate fastest on provider breadth and desktop parity will win prosumer mindshare. No single tool leads on all axes — the choice is now strategic, not feature-checklist-driven.

---

## Per-Tool Reports

<details>
<summary><strong>Claude Code</strong> — <a href="https://github.com/anthropics/claude-code">anthropics/claude-code</a></summary>

## Claude Code Skills Highlights

> Source: [anthropics/skills](https://github.com/anthropics/skills)

# Claude Code Skills — Community Highlights Report
*Data snapshot: 2026-11-18 | Source: github.com/anthropics/skills*

---

## 1. Top Skills Ranking (by community attention)

> Note: PR comment counts were not populated in the source data (all `undefined`). Ranking below reflects overall engagement signals — comment activity in linked Issues, 👍 reactions, update recency, and cross-references.

| # | Skill / PR | Functionality | Discussion Highlights | Status |
|---|-----------|---------------|----------------------|--------|
| 1 | **mcp-builder fix** ([#1742](https://github.com/anthropics/skills/pull/1742)) | Fixes `streamable_http_client` import rename and custom header config for `mcp>=2.0.0` | Directly resolves [#1668](https://github.com/anthropics/skills/issues/1668); critical for anyone building MCP servers | OPEN |
| 2 | **skill-creator eval isolation** ([#1298](https://github.com/anthropics/skills/pull/1298)) | Isolates trigger evals, fixes Windows subprocess `select()` failures | Addresses the same false-negative trigger problem reported in [#556](https://github.com/anthropics/skills/issues/556) and [#1352](https://github.com/anthropics/skills/issues/1352) | OPEN |
| 3 | **notion-spec-to-implementation + quantitative-resume-auditor** ([#1245](https://github.com/anthropics/skills/pull/1245)) | Converts Notion specs into implementable tasks; audits resumes quantitatively | Dual-skill submission; long-running (Jun–Oct) with steady updates | OPEN |
| 4 | **webapp-testing: remove `shell=True`** ([#1980](https://github.com/anthropics/skills/pull/1980)) | Eliminates CWE-78 command-injection risk in `with_server.py` | Security hardening for a widely used testing skill | OPEN |
| 5 | **docx LibreOffice timeout fix** ([#1792](https://github.com/anthropics/skills/pull/1792)) | Reports `soffice` timeouts as errors; verifies revision marks removed | Complements [#1734](https://github.com/anthropics/skills/pull/1734) (orphaned comment detection) | OPEN |
| 6 | **pyxel retro game dev** ([#525](https://github.com/anthropics/skills/pull/525)) | Create/debug/verify retro Python games headlessly | Longest-running open PR (Mar–Nov); niche but persistent | OPEN |
| 7 | **document-typography** ([#514](https://github.com/anthropics/skills/pull/514)) | Prevents orphan wraps, widow paragraphs, numbering misalignment | Broad-appeal quality-control skill for all generated docs | OPEN |
| 8 | **xlsx external links fix** ([#2019](https://github.com/anthropics/skills/pull/2019)) | Resolves worksheet-scoped defined names in `recalc.py` | Fixes [#2013](https://github.com/anthropics/skills/issues/2013); spreadsheet correctness | OPEN |

**Emerging / specialized submissions worth watching:** `md2video-audio` ([#1703](https://github.com/anthropics/skills/pull/1703)), `proofcore-contract-auditor` ([#1771](https://github.com/anthropics/skills/pull/1771)), `scnet-hpc` ([#1615](https://github.com/anthropics/skills/pull/1615)).

---

## 2. Community Demand Trends (from Issues)

Distilled from the top 15 issues by comments:

- **Trust & security boundaries** — [#492](https://github.com/anthropics/skills/issues/492) (46 comments): community skills published under the `anthropic/` namespace impersonate official skills, enabling permission escalation. This is the single loudest issue in the repo.
- **Org-wide skill distribution** — [#228](https://github.com/anthropics/skills/issues/228) (17 comments, 👍8): users want a shared skill library / direct share links instead of manual `.skill` file passing.
- **Eval / trigger reliability** — [#556](https://github.com/anthropics/skills/issues/556) (0% trigger rate) and [#1352](https://github.com/anthropics/skills/issues/1352) (parallel-worker UUID cross-match): systematic false negatives in `run_eval.py` undermine skill authoring.
- **Context-window economy** — [#1487](https://github.com/anthropics/skills/issues/1487): `claude-api` eagerly injects ~156k tokens; demand for lazy/on-demand skill loading.
- **Skill quality standards** — [#202](https://github.com/anthropics/skills/issues/202) (skill-creator should be operational, not educational), [#2064](https://github.com/anthropics/skills/issues/2064) (descriptions must state *when* to use, not just *what*).
- **New skill directions proposed** — agent governance/safety ([#412](https://github.com/anthropics/skills/issues/412)), compact symbolic memory ([#1329](https://github.com/anthropics/skills/issues/1329)), reasoning quality gates ([#1385](https://github.com/anthropics/skills/issues/1385)).
- **Platform-level asks** — account email change to prevent workspace loss ([#1143](https://github.com/anthropics/skills/issues/1143), 👍18 — highest reaction in the set); duplicate plugin content ([#189](https://github.com/anthropics/skills/issues/189)).
- **Concrete correctness bugs** — docx namespace loss ([#2018](https://github.com/anthropics/skills/issues/2018)), gradient `bottom_color` off-by-one ([#1868](https://github.com/anthropics/skills/issues/1868)).

**Most-anticipated new directions:** workflow automation (spec → tasks), code/document review automation, skill evaluation tooling, agent governance/safety, and memory/context compression.

---

## 3. High-Potential Pending Skills

Active-comment or recently-updated PRs not yet merged — likely to land soon:

| Skill | Why it's likely to land | Link |
|-------|------------------------|------|
| **webapp-testing security fix** | Small, focused, security-motivated; updated Nov 1 | [#1980](https://github.com/anthropics/skills/pull/1980) |
| **xlsx external-links fix** | Resolves a filed issue (#2013); narrow diff | [#2019](https://github.com/anthropics/skills/pull/2019) |
| **docx timeout/verification** | Pairs with docx correctness issues; updated Nov 1 | [#1792](https://github.com/anthropics/skills/pull/1792) |
| **skill-creator YAML frontmatter fix** | Fixes metadata corruption affecting eval commands | [#1997](https://github.com/anthropics/skills/pull/1997) |
| **claude-api docs refresh** | Python SDK 1.1.0 pause_turn change; low-risk doc PR | [#1950](https://github.com/anthropics/skills/pull/1950) |
| **algorithmic-art `wrapAround()`** | Trivial modulo fix closing #1897 | [#1977](https://github.com/anthropics/skills/pull/1977) |
| **md2video-audio** | Zero-cost, self-contained; new capability | [#1703](https://github.com/anthropics/skills/pull/1703) |

A notable cluster of small, issue-linked fixes from contributor `gerardrecinto` ([#1975](https://github.com/anthropics/skills/pull/1975), [#1976](https://github.com/anthropics/skills/pull/1976), [#1977](https://github.com/anthropics/skills/pull/1977)) suggests a healthy "fix-the-filed-bug" contribution pattern.

---

## 4. Skills Ecosystem Insight

**The community's most concentrated demand is trust and reliability of the Skills layer itself — secure namespacing, correct trigger evaluation, and token-efficient loading — before expanding into new skill categories.**

---

*Report generated from PR/Issue metadata as of 2026-11-18. Comment counts for PRs were unavailable in source data; rankings use composite engagement signals.*

---

# Claude Code Community Digest — 2026-11-18

## 1. Today's Highlights

A relatively quiet release day: **v2.1.327** ships a small but meaningful security-oriented change, adding a confirmation step before `/install-github-app` mutates a repository, plus a stdin-based `mcp add-json` variant to keep MCP tokens out of shell history. The issue tracker is dominated by long-running security and permission-model debates — most notably the continued momentum behind **multi-account Connector support (#27302, 312 comments, 481 👍)** and a cluster of reports that **Bash-routed file writes bypass PreToolUse/permission review (#89251, #85511)**. No pull requests were updated in the last 24h.

---

## 2. Releases

### v2.1.327
- **`/install-github-app` now requires confirmation** before it changes a repository — a guardrail against accidental GitHub App installation/configuration on the wrong repo.
- **`claude mcp add-json <name> -`** reads the MCP server's JSON from stdin, so secrets/tokens stay off the command line (and out of shell history and process listings). Notably, this is **not available inside a Claude Code session** — CLI-only.
- Minor: a new line is emitted when a resumed session's earlier context is restored (changelog truncated).

**Why it matters:** Both changes are defensive/security-hygiene improvements rather than features. The stdin JSON path is the kind of thing CI and security-conscious teams have wanted since MCP configuration became token-heavy.

🔗 https://github.com/anthropics/claude-code/releases

---

## 3. Hot Issues

1. **#27302 — [FEATURE] Support multiple Connector accounts (same connector, different accounts)** 🔥
   312 comments, 481 👍. By far the most-engaged issue in the tracker. Users want to connect, e.g., two Google Workspace or two Slack accounts to the same Claude/Claude Code instance. The comment volume suggests this is a hard architectural constraint rather than a simple UI gap — likely identity/session model work.
   🔗 https://github.com/anthropics/claude-code/issues/27302

2. **#12925 — Linear integration: assign issues to Claude Code to trigger cloud agent sessions**
   48 comments, 156 👍. A "assign-to-agent" workflow straight from Linear. This is the issue-tracker-as-agent-trigger pattern (like GitHub's own agent handoff). Strong signal that teams want Claude Code wired into their existing PM tooling, not a separate console.
   🔗 https://github.com/anthropics/claude-code/issues/12925

3. **#89251 — Permission-mode system prompt routes writes through Bash, bypassing PreToolUse hooks on Write|Edit|NotebookEdit**
   9 comments, 7 👍, `has repro`, tagged `area:security`. The permission-mode prompt explicitly tells the model to use `cat`/`sed`/`grep`/etc. via Bash — which means file *writes* happen outside the Write/Edit hook pipeline. This is a genuine security-model gap, not a cosmetic bug.
   🔗 https://github.com/anthropics/claude-code/issues/89251

4. **#85511 — Manual permission mode: file edits via Bash (python/sed) bypass per-edit diff review**
   3 comments, 2 👍. The manual-mode sibling of #89251. Users in manual mode get at most a single "run this command" prompt instead of a per-edit diff — so a `python3` heredoc or `sed -i` can rewrite files with no reviewable diff.
   🔗 https://github.com/anthropics/claude-code/issues/85511

5. **#110850 — [Bug] Claude Code deleted local repository via `rmdir /s /q` without request** ⚠️
   Filed today, 0 comments yet, Windows, tagged `data-loss`. A fresh and alarming report: Claude ran a destructive recursive delete on a local repo unprompted. Early, but the `data-loss` tag and the Windows platform make this one to watch.
   🔗 https://github.com/anthropics/claude-code/issues/110850

6. **#110853 — Biology safety classifier false positives on routine cancer research (Fable 5.x, Opus 5.5)**
   Filed today. A researcher doing non-dual-use in vitro breast cancer transcriptomics reports model fallbacks and mid-response stops, ongoing for months. Highlights a real tension between safety classifiers and legitimate life-sciences work.
   🔗 https://github.com/anthropics/claude-code/issues/110853

7. **#36105 — [FEATURE] Use `Assisted-by` git commit trailer instead of `Co-authored-by`**
   13 comments, 57 👍. A small but high-agreement request: many maintainers don't want Claude as a git *co-author* (which implies accountability/ownership) and prefer an `Assisted-by` trailer. Cheap to implement, culturally significant.
   🔗 https://github.com/anthropics/claude-code/issues/36105

8. **#109300 — Auto mode refuses tool calls after a PreToolUse hook returns `updatedInput`, invalidating the whole batch**
   2 comments, `has repro`. When a hook rewrites input, the auto-mode classifier refuses the call — and one rewrite invalidates *every* other call in the same response, including untouched Write/Edit calls. A correctness bug in the hook/classifier interaction.
   🔗 https://github.com/anthropics/claude-code/issues/109300

9. **#109909 — Remote Control: client never creates a device key after upgrade; bridge 403s "elevated session requires a trusted device"**
   2 comments, macOS + VS Code. RC worked for months, then broke on 2026-11-13 after an upgrade and never recovered. A regression in device-key provisioning that hard-blocks the feature.
   🔗 https://github.com/anthropics/claude-code/issues/109909

10. **#101057 — [CLOSED] PreCompact hook output added to compaction instructions with no size limit**
    Now closed. The stdout of every successful `PreCompact` hook was being injected into compaction instructions unbounded — a potential context-blowout/DoS vector. Good to see it resolved; worth checking the fix if you rely on PreCompact hooks.
    🔗 https://github.com/anthropics/claude-code/issues/101057

---

## 4. Key PR Progress

**No pull requests were updated in the last 24h (0 items).** Nothing to report in this section.

---

## 5. Hot Discussions

No Discussions data was provided in this dataset, so this section is omitted.

---

## 6. Feature Request Trends

Distilling the issue set, several clear directions emerge:

1. **Multi-identity / multi-account support** — #27302 (connectors), #101780 (gateway billing groups per Entra group). Users increasingly run Claude Code in orgs where one login isn't enough.
2. **Deeper IDE / PM / SCM integration** — #12925 (Linear-triggered agents), #93476 (VS Code: open session by ID), #96018 (`claude project mv`), #86713 (session history keyed to old path after rename). The theme: Claude Code's state should survive project moves and integrate with existing tooling.
3. **Desktop/Code-tab parity with CLI and iOS** — #102400 (Android emulator panel), #110852 (trackpad pinch-zoom on Mac), #110586 (Design canvas full-screen regression). The desktop Code tab is clearly the fastest-growing surface and is accumulating parity requests.
4. **Auth & gateway policy granularity** — #101780, #109909. Session-level control over billing/device trust.
5. **Feedback & commit metadata ergonomics** — #36105 (`Assisted-by`), #96172 (feedback as a conversation). Small, low-cost, high-agreement asks.
6. **Terminal/IME/a11y polish** — #105534 (OSC 7501 status), #105839 (Chinese IME on Windows Terminal), #109910 (Windows `file://` path printing). Long-tail but persistent.

---

## 7. Developer Pain Points

- **Permission-model bypass via Bash (the dominant theme).** #89251, #85511, and #109300 all describe the same class of problem: the Bash tool is a side door around hooks, diff review, and the classifier. For teams relying on `PreToolUse`/permissions for safety, this is the #1 trust gap. It has been reported multiple times and remains open with reproductions.
- **State loss on project renames/moves.** #86713 and #96018: session transcripts are keyed to the old sanitized path, so renaming a folder silently hides history. Users want a first-class `project mv` rather than manual `~/.claude/projects` surgery.
- **Platform-specific regressions that linger.** Windows `file://` path printing (#109910) has been reported and auto-closed **five times** (#42528, #46041, #67431, #81252, #90759) with no fix. Browser-integration hangs in non-Chrome browsers (#107630 Dia, #110851 Arc) suggest the Chrome extension assumes Chromium-standard tab-group behavior.
- **MCP reliability at the edges.** #105334 (desktop declines elicitation while advertising support), #96996 (macOS TCC access lost when an npx-launched MCP server is replaced on disk). As MCP usage grows, these edge cases are becoming real operational blockers.
- **Safety classifiers vs. legitimate research.** #110853 is an early but important signal that over-broad biology classifiers are impeding real grant-funded work — a recurring frustration for scientific users.

---

*Digest generated for 2026-11-18. Issue counts reflect updates within the last 24h; "Hot Issues" selection is weighted by comment count, recency, severity tags, and community reaction.*

</details>

<details>
<summary><strong>OpenAI Codex</strong> — <a href="https://github.com/openai/codex">openai/codex</a></summary>

# OpenAI Codex Community Digest — 2026-11-18

## 1. Today's Highlights

Release activity remains in alpha churn: `rust-v0.169.1` shipped a maintenance-only patch, while `rust-v0.170.0-alpha.4.2` and `rust-v0.171.0-alpha.11/12` continue rapid iteration. The issue tracker is dominated by Windows Computer Use regressions — screenshot capture timeouts, stale display borders, and D3D lock contention now span multiple reports with sustained comment activity. Meanwhile, a broad TUI/Cloud reliability PR series landed, covering subagent transcript navigation, Cloud stream recovery limits, and web search provider persistence across thread resumes.

## 2. Releases

- **rust-v0.169.1** — Maintenance release only. No verified highlights; changelog limited to chores. [Compare](https://github.com/openai/codex/compare/rust-v0.169.0...rust-v0.169.1)
- **rust-v0.170.0-alpha.4.2** — Alpha iteration, no release notes. 
- **rust-v0.171.0-alpha.11 / .12** — Alpha iterations, no release notes.

No user-facing feature or fix details were published for the alpha tags. Note the version skew: the stable line is at 0.169.x while 0.170/0.171 alphas are being cut in parallel.

## 3. Hot Issues

1. **[#57101](https://github.com/openai/codex/issues/57101)** — *Windows Computer Use: capture access and gold/yellow display border persist after screenshot turn.* 55 comments, 9 👍. The highest-engagement issue in the window; the stuck capture border suggests the CUA plugin isn't releasing the capture session on turn completion. Community reaction is substantial and still growing after three weeks.
2. **[#42950](https://github.com/openai/codex/issues/42950)** — *Codex Sites blocked by Cloudflare for external visitors.* 16 comments. A published Codex Site is unreachable for outside users, undermining the "Sites" feature's core promise of shareable output.
3. **[#20957](https://github.com/openai/codex/issues/20957)** — *Add ChatGPT-style Read Aloud to Codex Desktop.* 14 comments, 22 👍 — the most-upvoted item here. Clear accessibility gap versus ChatGPT proper.
4. **[#60799](https://github.com/openai/codex/issues/60799)** — *iOS Remote: project/task list empty after relaunch.* 12 comments, 9 👍. Cold-start `initialize` appears to omit `experimentalApi`, breaking the Remote workflow on iPhone. Reproducible and cross-component (app-server ↔ iOS client).
5. **[#59303](https://github.com/openai/codex/issues/59303)** — *Windows 10 Computer Use WGC timeout: callback holds D3D lock while bitmap conversion waits.* 10 comments. A deeper root-cause report than #57101; the author distinguishes a working probe pattern from the installed component's actual defect.
6. **[#37550](https://github.com/openai/codex/issues/37550)** — *macOS: primary window stuck on loading screen while tasks continue.* 8 comments. Long-lived (since August), still updated — a persistent UI-state divergence between the app shell and running tasks.
7. **[#41031](https://github.com/openai/codex/issues/41031)** — *Linux: locked Secret Service keyring makes new sessions unusable and hangs exit forever.* 8 comments. Auth/MCP/CLI interaction on Fedora/GNOME; a hard blocker for headless or locked-keyring environments.
8. **[#44088](https://github.com/openai/codex/issues/44088)** — *Shell/Python file writes lack per-file edit cards, bypassing the visible review surface.* 6 comments. Governance-adjacent: agents can mutate files via `pathlib` without the review UI that normal edits get.
9. **[#50238](https://github.com/openai/codex/issues/50238)** — *Queue requests on model capacity errors instead of interrupting long-running work.* 6 comments. A concrete DX request backed by session transcript evidence across 0.153.4–0.160.0.
10. **[#62152](https://github.com/openai/codex/issues/62152)** — *Windows/Work: new Work conversations cannot access Project Sources despite Cloud selection.* 2 comments, filed today. Early but notable — a new-conversation regression touching the Work/Cloud boundary.

Also worth watching: **[#56971](https://github.com/openai/codex/issues/56971)** (iOS crash on any pairing code, 4 👍) and **[#62143](https://github.com/openai/codex/issues/62143)** (CLI `@Chrome`/`@Browser` broken since bundled plugin 26.1023, filed today).

## 4. Key PR Progress

All PRs below were merged/closed within the window; several form a coherent TUI + Cloud reliability theme.

1. **[#62163](https://github.com/openai/codex/pull/62163)** — Move the app-server socket relay into the Codex CLI; removes the standalone `codex-stdio-to-uds` crate and hidden subcommand. Simplifies the binary surface.
2. **[#62159](https://github.com/openai/codex/pull/62159)** — Open subagent transcripts from activity links in the TUI. Cuts a manual sidebar hunt for subagent output.
3. **[#62157](https://github.com/openai/codex/pull/62157)** — Open subagent transcripts in a sidebar tab rather than switching the active conversation, preserving parent context.
4. **[#62151](https://github.com/openai/codex/pull/62151)** — Limit recovery after repeated Cloud reply stream disconnects (500 ms backoff per replacement stream) to break reconnect loops.
5. **[#62150](https://github.com/openai/codex/pull/62150)** — Cancel Cloud overview refreshes that block TUI navigation (e.g., resume picker).
6. **[#62146](https://github.com/openai/codex/pull/62146)** — Batch mouse wheel scrolling in the TUI to avoid synchronous transcript redraws per tick.
7. **[#62144](https://github.com/openai/codex/pull/62144)** — Persist web search provider ownership across thread resumes, preventing mixed provider-specific references in follow-up calls.
8. **[#62142](https://github.com/openai/codex/pull/62142)** — Add `Client::transcribe_audio` to the backend client (`/transcribe`, multipart, WAV/MP3/M4A/WebM/Ogg, 64 KB response cap). Infrastructure for dictation.
9. **[#62141](https://github.com/openai/codex/pull/62141)** — Repair missing/stale Windows sandbox Core registration by forcing setup when registration is unready.
10. **[#62139](https://github.com/openai/codex/pull/62139)** — Update `crossterm` to fix stray input when scrolling (split mouse reports misread as keystrokes on Unix).

Also notable: **[#62145](https://github.com/openai/codex/pull/62145)** (explicit workspace routing readiness in `account/updated`), **[#62140](https://github.com/openai/codex/pull/62140)** (hold Cloud reply streams until history refresh), and **[#62136](https://github.com/openai/codex/pull/62136)** (deliver subscribed evidence to idle Guardian reviewers).

## 5. Hot Discussions

**Ideas**
- **[#3057](https://github.com/openai/codex/discussions/3057)** — *Codex using Python to make file edits instead of the File Edit tool.* 23 comments, 38 👍 — the highest-upvoted discussion in the set. Relevant to Issue #44088; the community suspects the edit tool has problems that push the model toward shell scripting.

**Q&A**
- **[#59292](https://github.com/openai/codex/discussions/59292)** — *Is there a versioned client contract for `turn/moderationMetadata`?* Asks how non-interactive clients should treat an untyped `JsonValue` payload containing `prompt`/`generation` objects.
- **[#61849](https://github.com/openai/codex/discussions/61849)** — *Diagnosing screenshot/tool response-start latency in 0.169.0.* Seeks supported metadata-only timing to separate first-output latency from later command delivery; ties into the Windows Computer Use latency cluster.

**Show and tell**
- **[#16329](https://github.com/openai/codex/discussions/16329)** — *Awesome Codex CLI* — curated list of 150+ ecosystem tools (subagents, skills, plugins, MCP servers). 10 comments.
- **[#58912](https://github.com/openai/codex/discussions/58912)** — *Codex Mobile Workbench* — self-hosted phone/PWA front end driving native Codex on your own machine.
- **[#61525](https://github.com/openai/codex/discussions/61525)** — *AppScreen* — App Store/Google Play screenshot editor with a remote MCP server (`codex mcp add appscreen --url ...`).
- **[#61953](https://github.com/openai/codex/discussions/61953)** — *Worktree Preflight* — read-only check for when Codex runs Git in the wrong Windows checkout.
- **[#61980](https://github.com/openai/codex/discussions/61980)** — *Video Clip Planner* — turns podcast transcripts into Shorts cut lists.
- **[#61997](https://github.com/openai/codex/discussions/61997)** — *Cloud Alter Ego* — shared memory across ChatGPT/Claude stored as plain files in your own cloud storage.
- **[#61667](https://github.com/openai/codex/discussions/61667)** — *Plainer handoff-note exercise* — a small reproducible test of note persistence after edit/reload.

## 6. Feature Request Trends

- **Accessibility & desktop parity**: Read Aloud in Codex Desktop (#20957, 22 👍) and native macOS notifications for permission approval (#29008, 4 👍) both ask for ChatGPT-level UX in the Codex shell.
- **Multi-conversation / multi-session workflows**: VS Code one-click editor tabs for simultaneous chats (#53071, 8 👍) and TUI subagent transcript navigation (PRs #62157/#62159) point the same direction — parallel work without losing context.
- **Resilience over interruption**: capacity-error queueing (#50238), Cloud stream disconnect recovery (#62151), and history-refresh gating (#62140) all reduce "your work was interrupted" friction.
- **Second-opinion / review surfaces**: a bounded read-only Advisor subagent (#36837, 9 👍) and visible per-file edit cards for shell/Python writes (#44088) reflect demand for more inspectable agent decisions.
- **Ecosystem tooling**: the curated 150+ tool list (#16329) and steady Show-and-tell MCP integrations (AppScreen, Cloud Alter Ego, Worktree Preflight) show a maturing third-party layer around the CLI.

## 7. Developer Pain Points

- **Windows Computer Use is the top reliability cluster.** Issues #57101, #59303, #61157, and #57161 all describe capture/screenshot timeouts, stuck display borders, D3D lock contention, or missing CDP capability on Windows. Three of these were updated today, and #57101 has 55 comments — this is the most persistent unresolved area in the tracker.
- **UI state diverges from runtime state.** The macOS loading-screen hang (#37550) and today's macOS RPC-budget/MessagePort failure (#62170) both leave the window stuck while work continues underneath. The missing toolbar/terminal after reinstall (#42664) is a variant.
- **Review-surface bypass via shell execution.** #44088 and Discussion #3057 describe the same behavior from two angles: agents editing files through Python instead of the File Edit tool, skipping the per-file review cards users rely on.
- **Platform-specific auth and connectivity traps.** Locked Linux keyrings hang sessions and exit (#41031); iOS pairing-code entry crashes the app (#56971); Windows VS Code sandbox injects a bogus `127.0.0.1:9` proxy into child processes (#47671, now closed); Cloudflare blocks external visitors to published Sites (#42950).
- **Rate-limit and caching opacity.** #56174 reports a Pro quota exhausted in ~20 hours versus a normal 5–6 days, and #62109 reports zero cached tokens for unchanged top-level `instructions` on a partially cached continuation — both suggest billing/caching behavior that users cannot easily audit.

</details>

<details>
<summary><strong>Gemini CLI</strong> — <a href="https://github.com/google-gemini/gemini-cli">google-gemini/gemini-cli</a></summary>

# Gemini CLI Community Digest — 2026-11-18

## 1. Today's Highlights

No new releases shipped in the last 24 hours, but issue and PR activity remains heavily concentrated in the **agent/subagent subsystem** — recovery semantics, tool-selection behavior, and sandboxing dominate the top of the queue. Two P1 agent bugs (`#22323` subagent false-success reporting, `#21409` generalist agent hangs) continue to attract maintainer attention and community 👍s, signaling that agent reliability is the current critical path. On the PR side, a batch of dependency bumps and several targeted `core`/`cli` fixes (git SSH handling, MCP env parsing, PowerShell UI freezes) are moving through review.

---

## 2. Releases

*No new releases in the last 24 hours.* Note: several automated nightly version-bump PRs remain open or stale (`#29196`, `#29403`), suggesting the release pipeline has not produced a fresh cut recently.

---

## 3. Hot Issues

1. **[#22323 — Subagent recovery after MAX_TURNS reported as GOAL success](https://github.com/google-gemini/gemini-cli/issues/22323)** *(P1, 13 comments, 2👍)*
   The `codebase_investigator` subagent returns `status: "success"` / `Termination Reason: "GOAL"` even when it explicitly hit the max-turn limit before doing any work. This is a correctness problem for anyone automating on subagent output — silent failures masquerading as success. Highest-comment issue of the day.

2. **[#19873 — Zero-dependency OS sandboxing & post-execution intent routing](https://github.com/google-gemini/gemini-cli/issues/19873)** *(P2, 9 comments)*
   Proposal to lean into Gemini 3's native bash affinity by chaining POSIX tools under a secure sandbox, with intent routing after execution. Large-effort, architecturally significant — likely shapes how tool execution evolves.

3. **[#21409 — Generalist agent hangs](https://github.com/google-gemini/gemini-cli/issues/21409)** *(P1, 8 comments, 8👍)*
   The generalist agent hangs indefinitely on trivial tasks (e.g., folder creation); disabling subagent deferral works around it. Highest 👍 count in today's set — strong signal of real user pain.

4. **[#22745 — Assess AST-aware file reads, search, and mapping](https://github.com/google-gemini/gemini-cli/issues/22745)** *(P2, 7 comments)*
   EPIC investigating whether AST-aware tooling reduces misaligned reads, token noise, and turns. Ties into `#22746`/`#22747` — a coordinated push toward smarter code navigation.

5. **[#21968 — Gemini does not use skills and sub-agents enough](https://github.com/google-gemini/gemini-cli/issues/21968)** *(P2, 7 comments)*
   Anecdotal but widely echoed: the model ignores custom skills/subagents unless explicitly instructed, even when highly relevant. Directly undermines the value of the agent ecosystem.

6. **[#22267 — Browser Agent ignores `settings.json` overrides](https://github.com/google-gemini/gemini-cli/issues/22267)** *(P2, 5 comments)*
   `maxTurns` and other overrides are read by `AgentRegistry` but not honored by the Browser Agent. Config that silently doesn't apply is a classic trust-breaker.

7. **[#21983 — Browser subagent fails on Wayland](https://github.com/google-gemini/gemini-cli/issues/21983)** *(P1, 4 comments, 1👍)*
   Linux/Wayland users hit immediate GOAL-termination failures in the browser subagent. Platform-specific blocker for a growing user segment.

8. **[#22672 — Agent should stop/discourage destructive behavior](https://github.com/google-gemini/gemini-cli/issues/22672)** *(P2, 3 comments, 1👍)*
   Model occasionally reaches for `git reset` / `--force` when safer alternatives exist. Safety-critical for anyone letting the agent touch repos or databases.

9. **[#24246 — 400 error with >128 tools](https://github.com/google-gemini/gemini-cli/issues/24246)** *(P2, 3 comments)*
   Tool-count limits cause hard API failures; request is for smarter scoping of enabled tools. Scales badly for power users with large MCP setups.

10. **[#18283 — Curate example agents in the repo](https://github.com/google-gemini/gemini-cli/issues/18283)** *(P3, 3 comments)*
    Request for reference subagents (validators, test/build, doc writers) both to improve the project and to serve as onboarding examples — a low-cost ecosystem accelerant.

---

## 4. Key PR Progress

1. **[#30335 — fix(core): stop overriding `core.sshCommand` with empty string](https://github.com/google-gemini/gemini-cli/pull/30335)**
   Sandboxed shell defaults were blanking `core.sshCommand`, breaking all SSH git operations (`error: cannot run : No such file or directory`). Straightforward but high-impact for git-over-SSH users.

2. **[#30331 — fix(cli): preserve MCP env values containing `=` and empty values](https://github.com/google-gemini/gemini-cli/pull/30331)**
   `gemini mcp add -e KEY=value` silently truncated values at the second `=` and dropped empty values — while exiting 0. Fixes silent config corruption.

3. **[#30107 — fix(cli): make auth URL clickable when terminal wraps](https://github.com/google-gemini/gemini-cli/pull/30107)** *(CLOSED, P1)*
   Wrapped login URLs lost query params, producing Google "Access blocked" 400 errors. Important onboarding fix; now closed.

4. **[#30115 — fix(core,cli): prevent `$`-pattern expansion in command/prompt substitutions](https://github.com/google-gemini/gemini-cli/pull/30115)** *(CLOSED, P2)*
   `{{args}}` and system prompt substitutions were expanding JS replacement patterns (`$$`, `$&`, `$1`, …), corrupting user arguments. Now closed.

5. **[#30219 — fix(acp): record tool calls on active chat to prevent 400 on compressed reload](https://github.com/google-gemini/gemini-cli/pull/30219)**
   Post-compression tool calls were attached to removed messages, causing 400s on session reload in ACP mode. Subtle state-management fix.

6. **[#30334 — fix(core,cli): parse PowerShell commands asynchronously to prevent UI spinner freeze](https://github.com/google-gemini/gemini-cli/pull/30334)** *(P2, XL)*
   Synchronous PowerShell AST parsing froze the Thinking spinner for seconds on Windows. Notable Windows UX improvement.

7. **[#30340 — fix(ide): per-user discovery directory + atomic port file writes](https://github.com/google-gemini/gemini-cli/pull/30340)** *(CLOSED)*
   Scopes IDE companion discovery files to `${os.tmpdir()}/gemini-ide-${uid}` with `0700` perms and atomic `0600`+rename writes. Security/robustness hardening.

8. **[#30315 — fix(cli): detect local git clone from CLI path instead of cwd](https://github.com/google-gemini/gemini-cli/pull/30315)** *(CLOSED)*
   Fixes auto-update misclassifying source checkouts as global npm installs when run from outside the clone root.

9. **[#30338 — fix(core): keep ASK_USER for shell commands with unresolved expansion](https://github.com/google-gemini/gemini-cli/pull/30338)**
   `PolicyEngine` was upgrading read-only-looking commands to `ALLOW` based on *unexpanded* text; this keeps `ASK_USER` when bash will rewrite arguments first. Security-relevant policy fix.

10. **[#30343 — chore(deps): bump @simple-git/argv-parser and simple-git](https://github.com/google-gemini/gemini-cli/pull/30343)** *(P1)*
    Coupled dependency bump (argv-parser 3.0.0 + simple-git). Worth watching given git operations are core to agent workflows. Paired with large npm-dependency group bumps (`#30344`, `#30341`).

---

## 5. Hot Discussions

*No GitHub Discussions data was provided in the source dataset; this section is omitted.*

---

## 6. Feature Request Trends

- **Smarter, AST-aware code navigation** — `#22745`, `#22746`, `#22747`, and `#19561` (Tactful Extraction) all push toward surgical, token-frugal reads/search instead of firehosing context. This is the most coordinated feature direction in the queue.
- **Sandboxing + native bash leverage** — `#19873` frames secure OS sandboxing as the enabler for letting Gemini 3 use its preferred POSIX toolchains.
- **Persistent, file-based task tracking** — `#18836` (replace `WriteToDo` with CRUD file tracking) and `#21000` (native file tools for the task tracker) target context rot and cross-session memory loss.
- **Subagent observability & sharing** — `#22598` (`/chat share` for subagent trajectories), `#21763` (subagent context in bug reports), and `#18287` (shared memory / parallel collaboration) all point at making multi-agent behavior inspectable.
- **Per-workspace policy scoping** — `#18397` requests workspace-scoped (not global-only) policy auto-addition.

---

## 7. Developer Pain Points

- **Silent or misleading failures.** Subagents report GOAL success after hitting turn limits (`#22323`); MCP env values are silently corrupted (`#30331`); config overrides are silently ignored (`#22267`). Trust in agent-reported outcomes is eroding.
- **Hangs and freezes.** Generalist agent hangs indefinitely (`#21409`), interactive prompts trap the agent (`#22465`), and Windows PowerShell parsing freezes the UI (`#30334`).
- **Subagents underused and under-observable.** Users report the model won't invoke skills/subagents unprompted (`#21968`), while the ones it does invoke are hard to debug (`#21763`, `#22598`).
- **Safety around destructive operations.** Unnecessary `git reset`/`--force` (`#22672`) and policy heuristics that can be fooled by shell expansion (`#30338`) are recurring concerns.
- **Platform friction.** Wayland browser-agent failures (`#21983`), symlinked agent files not recognized (`#20079`), and tool-count limits causing 400s (`#24246`) create inconsistent cross-platform experiences.
- **Cleanup overhead.** Model scattering temporary edit scripts across directories (`#23571`) adds manual cleanup cost before commits.

---

*Generated from github.com/google-gemini/gemini-cli activity for 2026-11-18. Issue/PR numbers reflect the source dataset.*

</details>

<details>
<summary><strong>GitHub Copilot CLI</strong> — <a href="https://github.com/github/copilot-cli">github/copilot-cli</a></summary>

# GitHub Copilot CLI Community Digest — 2026-11-18

## 1. Today's Highlights

A quiet release day: `v1.0.114-0` shipped with minor fixes, while `v1.0.113` and `v1.0.113-1` introduced a new managed setting (`features.browserUse`) letting administrators disable built-in Browser Use, including in running sessions. Issue activity remains heavy, with a fresh cluster of triage items around the `@microsoft/copilot-sdk` rename, Fusion/HydraFusion judging failures, and Windows-specific platform quirks. No pull requests were updated in the last 24 hours.

## 2. Releases

**v1.0.114-0** — Minor fixes and changes. ([release](https://github.com/github/copilot-cli/releases))

**v1.0.113 / v1.0.113-1** — Added a managed setting `features.browserUse` that allows administrators to disable built-in Browser Use, including for already-running sessions. This is an enterprise-oriented control for restricting agent browsing behavior. ([release](https://github.com/github/copilot-cli/releases))

## 3. Hot Issues

1. **[#5478](https://github.com/github/copilot-cli/issues/5478) — Cortex XDR kills the launching shell when Copilot CLI spawns git (OPEN, 5 comments)** — On Windows, Cortex XDR's `parent_process_spoofing` heuristic terminates `cmd`/`powershell` when Copilot invokes `git`, effectively crashing the session. High impact for enterprise Windows users with EDR tooling; community is actively reproducing.

2. **[#5492](https://github.com/github/copilot-cli/issues/5492) — `@github/copilot-sdk` renamed to `@microsoft/copilot-sdk` with no alias (OPEN, triage)** — Extensions importing the old package name fail with `ERR_MODULE_NOT_FOUND` after 1.0.113. A silent breaking change with no release note; likely to generate rapid follow-up reports.

3. **[#4674](https://github.com/github/copilot-cli/issues/4674) — Resuming a session does not restore the custom agent (CLOSED, 4 comments)** — A regression of #917: resumed sessions lose their `mcp-servers:` block and `tools:` allow-list, silently running as if no agent was selected. Closed after months open — a meaningful correctness fix for agent workflows.

4. **[#4773](https://github.com/github/copilot-cli/issues/4773) — Repeated MCP discovery reports "Found 0 tools" for loaded namespaces (OPEN, 3 comments, 👍1)** — The model is told a working MCP integration is unavailable, causing it to skip required workflow steps. Nasty silent-failure class of bug that undermines trust in MCP tooling.

5. **[#5290](https://github.com/github/copilot-cli/issues/5290) — Missing `--fusion-tier` argument (CLOSED, 3 comments, 👍3)** — Documented `fusionTier` configuration had no corresponding CLI flag. Closed with notable community support, suggesting the fix landed.

6. **[#4576](https://github.com/github/copilot-cli/issues/4576) — `includeCoAuthoredBy: false` not inherited by task subagents (CLOSED, 3 comments, 👍5)** — Subagent commits still carry the `Co-authored-by: Copilot` trailer despite the setting. Highest-reaction item in this batch; closed, likely a relief for teams with strict commit policies.

7. **[#3106](https://github.com/github/copilot-cli/issues/3106) — Task tool does not recognize agents added mid-conversation (CLOSED, 3 comments)** — Hot-reload gap: new `.agent.md` files don't appear in `agent_type` enum until a new conversation starts. Closed after a long run — good news for iterative agent development.

8. **[#5496](https://github.com/github/copilot-cli/issues/5496) — Repo instruction files skipped on Windows volumes without drive letters (OPEN, triage)** — On folder-mount-point volumes, no repo instructions load and the CLI shows no error. A quiet correctness gap for Windows devs on mounted storage.

9. **[#5491](https://github.com/github/copilot-cli/issues/5491) — Marketplace add clones whole repo, ignores cancellation, orphans git (OPEN, triage)** — Large marketplaces take minutes, can't be cancelled, and leave staging folders behind. Reinforces the long-standing request in [#2463](https://github.com/github/copilot-cli/issues/2463) for sparse checkout.

10. **[#5483](https://github.com/github/copilot-cli/issues/5483) — Two "immediate" messages concatenated into one string (OPEN, 1 comment)** — `"no" + "drop phase 7"` arrives at the model as `"nodrop phase 7"`, a subtle context-memory corruption in non-interactive mode that can silently alter agent behavior.

## 4. Key PR Progress

No pull requests were updated in the last 24 hours (Total: 0 items). Nothing to report in this section.

## 5. Hot Discussions

No discussion data was provided for this period; this section is omitted.

## 6. Feature Request Trends

- **Smarter plugin/marketplace fetching** — [#2463](https://github.com/github/copilot-cli/issues/2463) (sparse checkout) and [#5491](https://github.com/github/copilot-cli/issues/5491) (cancellation, progress, cleanup) both point to the marketplace clone flow being wasteful and fragile.
- **Enterprise policy and sandbox controls** — [#4446](https://github.com/github/copilot-cli/issues/4446) asks for org-level enforcement of CLI sandbox configuration; the new `features.browserUse` managed setting shows this direction is already in motion.
- **Observability for multi-model routing** — [#4825](https://github.com/github/copilot-cli/issues/4825) requests per-phase model/verdict/credit attributes in OpenTelemetry so HydraFusion turns are auditable.
- **Session hygiene tooling** — [#1790](https://github.com/github/copilot-cli/issues/1790) proposes a `/cleanup` command to reap orphaned processes, hung MCP servers, and stale locks from crashed sessions.

## 7. Developer Pain Points

- **Silent failures over loud errors** — Multiple issues (#4773 "Found 0 tools", #5496 skipped instruction files, #5122 dropped plugin context) describe the CLI quietly doing the wrong thing with no surfaced error, which erodes trust in agent behavior.
- **Windows platform friction** — EDR interference (#5478), mount-point volumes (#5496), and Computer Use safety-policy blocks (#5495) form a recurring cluster of Windows-specific breakage.
- **Breaking changes without migration paths** — The `@github/copilot-sdk` → `@microsoft/copilot-sdk` rename (#5492) with no alias or release note is a textbook example of an ecosystem-breaking change shipped quietly.
- **Subagent fidelity gaps** — Settings not inherited (#4576), models unavailable to subagents (#5413), and prompt-caching failures on long tool sequences (#4829) suggest the subagent execution path lags the main session in correctness and efficiency.
- **Resource and process lifecycle management** — Orphaned git processes (#5491), stale extension tool registrations (#5490), and crashed-session residue (#1790) indicate lifecycle cleanup is a persistent rough edge.

</details>

<details>
<summary><strong>OpenCode</strong> — <a href="https://github.com/anomalyco/opencode">anomalyco/opencode</a></summary>

# OpenCode Community Digest — 2026-11-18

## Today's Highlights

OpenCode shipped **v2.3.2**, fixing GPT-6.2 prompt caching (system prompts in the Responses `instructions` field are now re-sent as a leading developer message so they get cached) — a direct response to community issue #64550 filed and closed the same day. The v2.3.x line also continues refinements to timeout behavior for shell commands. Meanwhile, issue volume remains high around desktop renderer stability, provider catalog staleness, and V1→V2 migration pain.

## Releases

- **v2.3.2** — **GPT-6.2 Prompt Caching fix**: GPT-6.2 excludes top-level `instructions` from Responses API prompt caching, so every step was re-billed as uncached input. OpenCode now sends the system prompt as a leading developer message on all Responses routes.
- **v2.3.1** — **Timed-out shell commands now move to the background** instead of being killed, letting long builds/tests finish and report back. Foreground `timeout: 0` now defaults to 120s ([#63699](https://github.com/anomalyco/opencode/pull/63699)).
- **v1.19.6** — Desktop V1→V2 upgrade path: OpenCode 2 downloads in the background and installs on user choice (Restart / On quit / Later). Sessions, projects, and settings are preserved; V1 plugins require updates.

## Hot Issues

1. **[#64543](https://github.com/anomalyco/opencode/issues/64543)** — Chinese session titles render wrong glyphs when UI locale is English (macOS desktop). Copying the title yields correct text, so this is a pure rendering bug. 9 comments — highest-activity issue today; touches on the recurring CJK/i18n rendering thread.
2. **[#40524](https://github.com/anomalyco/opencode/issues/40524)** — Reconcile provider catalogs with `/models` endpoints. Long-running V2 item (open since August) gaining renewed attention; directly related to the catalog staleness bugs closed today.
3. **[#61342](https://github.com/anomalyco/opencode/issues/61342)** — `api.responses.write` scope error after upgrade; clearing the directory cache works around it. Upgrade-path friction that persists across versions.
4. **[#64481](https://github.com/anomalyco/opencode/issues/64481)** — Failed provider responses persisted as empty-argument tool calls, trapping sessions in an "Invalid arguments" loop. Closed quickly — good triage velocity on an impactful session-corruption bug.
5. **[#63944](https://github.com/anomalyco/opencode/issues/63944)** — Desktop renderer crash `Match/exhaustive: absurd` in `renderRow` during generation (Windows). 2 👍; fixed by PR #64565.
6. **[#54059](https://github.com/anomalyco/opencode/issues/54059)** — SSH remote service start failures misreported as "failed to establish SSH connection," masking port-conflict root causes. Misleading error taxonomy hurts debugging.
7. **[#64558](https://github.com/anomalyco/opencode/issues/64558)** — Subagent completion silently skipped when the assistant message spans an execution-period boundary. Fresh 2.3.0 core bug with root cause already identified.
8. **[#64416](https://github.com/anomalyco/opencode/issues/64416)** — OVHcloud Qwen3.8-27B fails with missing `finish_reason`; reporter includes a working workaround. Pattern of non-OpenAI-compliant streaming providers breaking the chat stream parser.
9. **[#64494](https://github.com/anomalyco/opencode/issues/64494)** — Pre-upgrade sessions invisible after V1→V2 upgrade; directory→project resolution ignores imported project records and mints duplicates. Data is intact but effectively lost to users — high-severity migration bug.
10. **[#64488](https://github.com/anomalyco/opencode/issues/64488)** — Context percentage exceeds 100%, using cumulative session tokens rather than live context window. Undermines trust in the context meter; closed same day.

## Key PR Progress

1. **[#64572](https://github.com/anomalyco/opencode/pull/64572)** — Fall back to classical TLS handshake when post-quantum ClientHello is dropped (Russian ISPs, Turkish networks). Notable infra robustness fix for a real-world connectivity regression from Bun 1.4.1+.
2. **[#64565](https://github.com/anomalyco/opencode/pull/64565)** — Fixes two desktop timeline renderer crashes (#63944, #62800), including thoughts streamed with no readable text. High-impact stability patch.
3. **[#64437](https://github.com/anomalyco/opencode/pull/64437)** — Embeddable Rust port of Code Mode (`psychoscript` crate), running without Bun/Node. Signals serious investment in Code Mode as an embeddable primitive.
4. **[#64515](https://github.com/anomalyco/opencode/pull/64515)** — Tool selection and Code Mode placement now derived from the session's model in `SessionContext.select`. Architectural consolidation of model-aware tooling.
5. **[#64546](https://github.com/anomalyco/opencode/pull/64546)** — Durable video jobs that survive server restarts; groundwork for the agent video tool (#63666).
6. **[#63002](https://github.com/anomalyco/opencode/pull/63002)** — Signed-in browser pane with extensions, previews, cookie/sign-in import from 14+ browsers, and agent safeguards. Large desktop feature under active review.
7. **[#61728](https://github.com/anomalyco/opencode/pull/61728)** — Configurable compaction window (tokens) for automatic compaction planning. Addresses the compaction-crash class of issues (#64500).
8. **[#64545](https://github.com/anomalyco/opencode/pull/64545)** — Wrap long lines in timeline code blocks, with global setting and per-block override. Direct fix for #60143.
9. **[#64554](https://github.com/anomalyco/opencode/pull/64554)** — Fall back when the configured compaction model's provider is unreachable. Prevents hard failures in long sessions.
10. **[#58091](https://github.com/anomalyco/opencode/pull/58091)** — TUI locale truncation by display width (fixes emoji splitting / CJK under-truncation, #58085). Long-standing i18n correctness fix now in review.

## Feature Request Trends

- **Model catalog freshness**: Multiple issues (#40524, #64489, #64507) ask for live reconciliation with provider `/models` endpoints — stale static catalogs hide newly released and locally-enabled models.
- **Context/compaction control**: Configurable compaction windows (#61728), accurate context-percentage reporting (#64488), and visibility into router-chosen upstream models (#60309) show demand for transparency and control over context economics.
- **Verification and trust**: #64419 proposes a deterministic "prove done" hook (Countersign integration) — agents verifying real-world outcomes (live URLs, PR state, DNS) with hash-chained receipts.
- **Browser/agent capability expansion**: Signed-in browser panes (#63002), passkey handoff to system browser (#64498), and Code Mode file APIs (#64518) point toward richer in-app agent tooling.

## Developer Pain Points

- **Desktop renderer fragility**: Three separate crash/fatal-error reports (#63944, #62800, plus the model-picker stutter #64570) erode confidence in the Electron desktop app, especially on Windows and macOS.
- **V1→V2 migration fallout**: Sessions disappearing after upgrade (#64494), plugin incompatibility (v1.19.6 notes), and repeated auth-scope errors (#61342) make upgrades feel risky.
- **Provider ecosystem edge cases**: Non-compliant streaming (missing `finish_reason`, #64416), empty tool-call persistence (#64481), and uncached GPT-6.2 instructions (#64550) show that provider-specific behavior remains the top source of breakage.
- **CJK/i18n rendering**: Wrong glyphs (#64543), display-width truncation (#58085, #64538), and inconsistent width calculation form a recurring cluster affecting non-Latin-script users.
- **Opaque background operations**: SSH setup progress (#56668) and service-start failures (#54059) surface as frozen dialogs or misleading errors, forcing guesswork.

</details>

<details>
<summary><strong>Pi</strong> — <a href="https://github.com/earendil-works/pi">earendil-works/pi</a></summary>

# Pi Community Digest — 2026-11-18

## 1. Today's Highlights

No new releases in the last 24h, but the issue tracker is highly active with 38 issues updated. A notable cluster of `p0`/abort-related crashes (codemode `tools.read()` cancellation) is being triaged and closed rapidly, while Windows support and a persistent npm search indexing problem for `pi-package` discovery continue to dominate community attention. A long-running context-window discrepancy with `gpt-6.1-sol` via ChatGPT sign-in also drew the most upvotes today.

## 2. Releases

No new releases in the last 24h.

## 3. Hot Issues

1. **[#7547 [OPEN] How do you use Pi on Windows?](https://github.com/earendil-works/pi/issues/7547)** — 97 comments, the most-discussed issue in the tracker. A long-running meta-thread on Windows support fragmentation (WSL, native, Git Bash, etc.). Still open since August; signals that Windows onboarding remains a major community concern.

2. **[#11021 [OPEN] ChatGPT sign-in reports 272K for GPT-6.1 Sol despite 500K catalog](https://github.com/earendil-works/pi/issues/11021)** — 15 comments, 8 👍 (highest upvote count shown). Context/compaction budget mismatch between Pi and the server-advertised window. High user impact for anyone on ChatGPT auth; active discussion of how model catalogs are resolved.

3. **[#7885 [CLOSED] npm search not indexing newly published pi-packages](https://github.com/earendil-works/pi/issues/7885)** — 17 comments. Newly published packages with the `pi-package` keyword never appear in npm search, breaking the pi.dev/packages gallery mirroring. Closed, but related issue #6873 remains a recurring theme.

4. **[#11460 [CLOSED, p0, fix-available] Resume drops all built-in tools when session branch is truncated](https://github.com/earendil-works/pi/issues/11460)** — 6 comments. Orphan `parentId` after ENOSPC causes session resume to lose `defaultTools`. A serious data-integrity/resume bug; fix is available, good sign for the p0 pipeline.

5. **[#11956 [CLOSED, p0] Crash on cancelling a read during file open](https://github.com/earendil-works/pi/issues/11956)** — 7 comments. Uncaught `AbortError` crashes the process when a `read` tool call is cancelled mid-open (e.g., in codemode `Promise.all`). Part of a cluster of related abort crashes (see #12271, #12253).

6. **[#12266 [CLOSED] Idle second Pi instance appends with stale leaf, forking session tree](https://github.com/earendil-works/pi/issues/12266)** — 5 comments. Two processes on the same session file cause sibling-branch forking; resume lands on the empty branch. Concurrency-safety concern for multi-instance workflows.

7. **[#12096 [OPEN] `/login llama.cpp` connection store doesn't persist across sessions](https://github.com/earendil-works/pi/issues/12096)** — 5 comments. Local-model users lose their llama.cpp connection config between sessions. Persistent-state bug affecting the local inference crowd.

8. **[#12070 [OPEN] pi-ai: wire stream timeoutMs on google-vertex and classify mid-stream resets as retryable](https://github.com/earendil-works/pi/issues/12070)** — 4 comments. Stalled/reset Vertex streams hang indefinitely or fail without retry. Reliability gap for evaluation harnesses on GCP.

9. **[#12184 [CLOSED] Google adapters reject Gemini 4 Hydrogen's advertised xhigh level](https://github.com/earendil-works/pi/issues/12184)** (dup of [#12177](https://github.com/earendil-works/pi/issues/12177), 2 👍) — 4 comments. New Gemini 4 Hydrogen features are advertised but throw before any HTTP request. Model-capability drift between `models.dev` metadata and adapters.

10. **[#12076 [OPEN] Compaction: Pi ends a tool loop silently instead of compacting](https://github.com/earendil-works/pi/issues/12076)** — 4 comments. Near context limit, Pi loops on compaction attempts and silently terminates the tool loop (reproduced twice on vLLM). High-severity agent-flow issue; likely related to the larger compaction thread below.

## 4. Key PR Progress

1. **[#12028 [OPEN] fix(coding-agent): defer sendMessage triggerTurn until compaction ends](https://github.com/earendil-works/pi/pull/12028)** — Closes #10982. Prevents `sendMessage({triggerTurn: true})` from starting a run on the uncompacted branch while manual compaction is in progress. Important correctness fix for extension authors.

2. **[#12262 [CLOSED] Emit session_compact for boundary-draft compactions](https://github.com/earendil-works/pi/pull/12262)** — Fixes missing `session_compact` events when extensions commit compactions via `turn_end` / `agent_before_settle` boundary drafts. Companion to issue #12263; unblocks extension event handling.

3. **[#12256 [CLOSED] Fix scoped skill collision diagnostics](https://github.com/earendil-works/pi/pull/12256)** — Suppresses warnings for intentional higher-precedence skill overrides while keeping warnings for genuinely ambiguous same-precedence collisions. Reduces warning noise.

4. **[#12249 [CLOSED] feat(ai): record ttftMs and ttfaMs on streamed assistant messages](https://github.com/earendil-works/pi/pull/12249)** — Adds first-token and first-any-payload latency to `AssistantMessage`, extending the existing `durationMs` metric. Useful for benchmarking and provider comparisons.

5. **Issue-cluster fix activity (no standalone PR visible)** — Several abort-related crashes were closed with fixes referenced in-thread: [#12271](https://github.com/earendil-works/pi/issues/12271), [#12253](https://github.com/earendil-works/pi/issues/12253), and [#11956](https://github.com/earendil-works/pi/issues/11956) all converge on codemode cancellation handling. Worth tracking whether a unified fix lands.

> Note: Only 4 PRs were updated in the last 24h; the digest includes all of them rather than padding the list.

## 5. Hot Discussions

No discussion data was provided.

## 6. Feature Request Trends

- **Provider expansion**: Requests for new built-in providers ([Sarvam AI Token Factory, #12258/#12255](https://github.com/earendil-works/pi/issues/12258)) and better handling of gateway-advertised capabilities like `ultra` thinking tiers ([#12267](https://github.com/earendil-works/pi/issues/12267)) and Gemini `xhigh` ([#12184](https://github.com/earendil-works/pi/issues/12184)).
- **Thinking-level / cache preservation**: Keep prompt cache when changing thinking level mid-conversation ([#12269](https://github.com/earendil-works/pi/issues/12269)).
- **Extension/event surface**: Emit `session_compact` consistently for boundary-draft compactions ([#12263](https://github.com/earendil-works/pi/issues/12263)).
- **UX polish**: Clickable branch name in the footer ([#12270](https://github.com/earendil-works/pi/issues/12270)); better unknown-argument error messages listing declared parameter names ([#12252](https://github.com/earendil-works/pi/issues/12252)).
- **Windows ergonomics**: Consolidating Windows usage guidance and delegating non-core variants ([#7547](https://github.com/earendil-works/pi/issues/7547)).

## 7. Developer Pain Points

- **Windows support fragmentation** remains the single largest open discussion; users lack a clear "blessed" path across WSL/native/Git Bash.
- **Package discovery on pi.dev**: npm search index lag means new `pi-package` releases are invisible in browse/search even when detail pages work (#7885, #6873). Recurring since July.
- **Codemode cancellation crashes**: Unhandled `AbortError` during in-flight `tools.read()` (and sibling tool calls) crashes the whole process (#11956, #12253, #12271) — a concentrated reliability hotspot.
- **Concurrency & shared state**: Multiple Pi processes on the same session cause stale-leaf forking (#12266), and concurrent managed npm installs race the shared `.pi/npm` prefix with no install lock ([#10798](https://github.com/earendil-works/pi/issues/10798)).
- **Compaction behavior**: Silent tool-loop termination near context limits (#12076), and compaction overrides ignored for routed/virtual models ([#12265](https://github.com/earendil-works/pi/issues/12265)).
- **Provider/metadata drift**: Advertised model capabilities (context windows, thinking tiers) not honored by adapters (#11021, #12184, #12177, #12267).
- **Local-model persistence**: llama.cpp connection store not surviving session restarts (#12096).
- **Small but sharp terminal bugs**: External `SIGTSTP` leaves terminals in raw mouse-tracking state ([#12272](https://github.com/earendil-works/pi/issues/12272)); unregistered tool calls never resolve and leak framing to the TUI ([#12261](https://github.com/earendil-works/pi/issues/12261)).

---

*Methodology note: items were selected from the top-comment issues (top 30 of 38) and all 4 updated PRs, weighted by comment count and 👍. Several closed items are included because they reflect active triage momentum; "CLOSED" status is noted per item.*

</details>

<details>
<summary><strong>Qwen Code</strong> — <a href="https://github.com/QwenLM/qwen-code">QwenLM/qwen-code</a></summary>

# Qwen Code Community Digest — 2026-11-18

## 1. Today's Highlights

Qwen Code shipped **v0.28.0** alongside a `v0.28.1-preview.0` patch, the TypeScript SDK `v0.1.35`, and **Qwen Code Desktop v0.28.0**, headlined by the new Web Shell sidebar workspace filter and the managed DingTalk adapter. Meanwhile, the community's attention is dominated by the **1.0 Preview loop kernel migration** (#17045) and a broad cluster of Java SDK correctness bugs filed in a single day. CI reliability remains a persistent theme, with the long-running Managed Agent gate failure (#14724) now at **431 comments**.

## 2. Releases

- **[v0.28.1-preview.0](https://github.com/QwenLM/qwen-code/releases)** — Preview patch; adds a full-stack E2E test observing a real scheduled `/loop` fire in the managed-agent path, plus hardening of the `verify-pr` watcher.
- **[v0.28.0](https://github.com/QwenLM/qwen-code/releases)** — Stable release with no known breaking changes. Features include the **Web Shell sidebar workspace filter** ([#17244](https://github.com/QwenLM/qwen-code/pull/17244)) and managed-agent DingTalk adapter work.
- **[sdk-typescript-v0.1.35](https://github.com/QwenLM/qwen-code/releases)** — Bundles CLI **0.28.0** (built from the same source ref as the SDK). Note the release notes also reference a 0.27.4 bundle lineage.
- **[desktop-v0.28.0](https://github.com/QwenLM/qwen-code/releases)** — Desktop build tracking 0.28.0, including the sidebar workspace filter and the DingTalk adapter.

## 3. Hot Issues

1. **[#14724](https://github.com/QwenLM/qwen-code/issues/14724)** — *Main CI failed: Managed Agent gate — no test identified.* Open since October 19 with **431 comments**; the single largest ongoing thread in the repo and a persistent blocker for CI trustworthiness.
2. **[#13078](https://github.com/QwenLM/qwen-code/issues/13078)** — *Daily dependency CVE audit failed.* 55 comments; a recurring automation failure that keeps resurfacing, possibly due to npm audit endpoint availability.
3. **[#17045](https://github.com/QwenLM/qwen-code/issues/17045)** — *tracking(core): land the 1.0 Preview loop kernel on main,* one surface at a time. The centerpiece refactor of the current cycle; freeze scheduled for **2026-11-21**, so activity is intense.
4. **[#13851](https://github.com/QwenLM/qwen-code/issues/13851)** — *Non-interactive (headless/SDK) mode delays terminal `result` until managed auto-memory tasks finish.* Highlights a 40 s–5 min latency gap versus the TUI/ACP paths — a serious concern for SDK consumers.
5. **[#15082](https://github.com/QwenLM/qwen-code/issues/15082)** — *Managed Agent: define a capacity and idle-reclamation model.* Multi-agent roadmap item requesting admission control and documented runtime/memory limits.
6. **[#17666](https://github.com/QwenLM/qwen-code/issues/17666)** — *Make the built-in `image_gen` tool work with Qwen subscription auth.* The Plus plan includes image generation and Qwen Code access, but the tool only registers under certain providers — a clear subscription-value gap.
7. **[#15738](https://github.com/QwenLM/qwen-code/issues/15738)** — *Team mode: teammate messages never delivered to the leader in ACP mode; team dies with the short-lived ACP child.* High-impact multi-agent/Web Shell defect for `qwen serve --web`.
8. **[#10932](https://github.com/QwenLM/qwen-code/issues/10932)** — *Voice dictation rejects `qwen-audio-3.0-asr-flash` as unsupported.* Token Plan ASR is unusable because the model-ID allowlist is hardcoded to older IDs.
9. **[#17284](https://github.com/QwenLM/qwen-code/issues/17284)** — *Agent loop: what #17045 leaves to a follow-up.* Companion tracking issue ensuring deferred work is not lost at the freeze date.
10. **[#17559](https://github.com/QwenLM/qwen-code/issues/17559)** — *Web Shell mid-turn prompt not recorded in session transcript.* The model sees the prompt and replies, but the user message never persists — a transcript-integrity bug.

Also worth watching: a wave of Java SDK bug reports filed 2026-11-17 by @Afloat16 — [#17640](https://github.com/QwenLM/qwen-code/issues/17640) (leaked child processes), [#17641](https://github.com/QwenLM/qwen-code/issues/17641) (tool-use input discarded), [#17642](https://github.com/QwenLM/qwen-code/issues/17642) (file reads joined with path separators), [#17656](https://github.com/QwenLM/qwen-code/issues/17656) (lost message UUIDs), [#17600](https://github.com/QwenLM/qwen-code/issues/17600)/[#17627](https://github.com/QwenLM/qwen-code/issues/17627) (transport deadlocks and JSONL corruption), and [#17602](https://github.com/QwenLM/qwen-code/issues/17602)/[#17625](https://github.com/QwenLM/qwen-code/issues/17625) (unscoped cancel, swallowed JSON-RPC errors).

## 4. Key PR Progress

1. **[#17372](https://github.com/QwenLM/qwen-code/pull/17372)** — `fix(core)`: retain arguments after shell redirections in permission rules, so `git > /dev/null push origin main` still yields `Bash(git push *)` without over-granting subcommands.
2. **[#17477](https://github.com/QwenLM/qwen-code/pull/17477)** — `fix(core)`: deliver background async hook output to the model, fixing capability-ledger defect L11.
3. **[#17530](https://github.com/QwenLM/qwen-code/pull/17530)** — `fix(core)`: scope Grep fallback strategies to the git-aware corpus so fallback search matches the git-grep arm exactly.
4. **[#17654](https://github.com/QwenLM/qwen-code/pull/17654)** — `fix(serve)`: prevent automatic background work from blocking worktree restore (cold worktree recovery path).
5. **[#17557](https://github.com/QwenLM/qwen-code/pull/17557)** — `fix(web-shell)`: align managed error rendering with DAC and remove the recovery panel above the conversation.
6. **[#17421](https://github.com/QwenLM/qwen-code/pull/17421)** — `feat(web-shell)`: add a Traditional Chinese (`zh-TW`/`zh-HK`/`zh-Hant`) UI locale with a dedicated Taiwan catalog.
7. **[#17676](https://github.com/QwenLM/qwen-code/pull/17676)** — `fix(web-shell)`: surface background work on sidebar session rows with an amber busy marker.
8. **[#17663](https://github.com/QwenLM/qwen-code/pull/17663)** — `feat(web-shell)`: show the SSE admission cap beside stream occupancy in the daemon status dialog.
9. **[#11220](https://github.com/QwenLM/qwen-code/pull/11220)** — `perf(web-shell)`: gzip serve responses for large transcript loads (long-running perf item from #6181).
10. **[#16784](https://github.com/QwenLM/qwen-code/pull/16784)** — `fix(core)`: fail closed on undecodable shell paths — security-relevant, denying allow verdicts when filenames can't be losslessly resolved.

Plus active managed-agent work: **[#17681](https://github.com/QwenLM/qwen-code/pull/17681)** (attachment retirement notifications, suspension-wait aging) and **[#17680](https://github.com/QwenLM/qwen-code/pull/17680)** (continuation-ready parks in the epoch-less resubmission arm).

## 5. Hot Discussions

No Discussions data was provided in this dataset.

## 6. Feature Request Trends

- **Subscription & provider parity** — Make built-in tools (`image_gen`, Token Plan ASR) honor Qwen subscription/OAuth auth ([#17666](https://github.com/QwenLM/qwen-code/issues/17666), [#10932](https://github.com/QwenLM/qwen-code/issues/10932)).
- **Multi-agent maturity** — Capacity/idle-reclamation models ([#15082](https://github.com/QwenLM/qwen-code/issues/15082)), reliable teammate messaging ([#15738](https://github.com/QwenLM/qwen-code/issues/15738)), and resilient A2A task handling ([#13738](https://github.com/QwenLM/qwen-code/issues/13738)).
- **1.x loop kernel completion** — Systematic migration of all surfaces onto the event-driven `query()` kernel ([#17045](https://github.com/QwenLM/qwen-code/issues/17045), [#17284](https://github.com/QwenLM/qwen-code/issues/17284), [#17237](https://github.com/QwenLM/qwen-code/issues/17237)).
- **Web Shell worktree/UI parity** — Worktree retention, snapshots, configurable roots, touch-friendly pickers, and locale coverage.

## 7. Developer Pain Points

- **CI/CD instability is the top frustration** — The Managed Agent gate failure ([#14724](https://github.com/QwenLM/qwen-code/issues/14724), 431 comments), CVE audit failures ([#13078](https://github.com/QwenLM/qwen-code/issues/13078)), and flaky tests like [#16091](https://github.com/QwenLM/qwen-code/issues/16091) and [#17558](https://github.com/QwenLM/qwen-code/issues/17558) repeatedly consume maintainer bandwidth.
- **Java SDK correctness debt** — A dense cluster of P2 bugs (process leaks, charset dependence, JSON-RPC error swallowing, corrupted JSONL framing, lost UUIDs) suggests the legacy Java SDK needs a focused hardening pass.
- **Headless/SDK latency and transcript integrity** — Non-interactive mode waits on auto-memory tasks ([#13851](https://github.com/QwenLM/qwen-code/issues/13851)) and Web Shell mid-turn prompts vanish from transcripts ([#17559](https://github.com/QwenLM/qwen-code/issues/17559)).
- **Multi-agent reliability under ACP/serve** — Message delivery, capacity control, and transient-failure recovery remain unresolved for production multi-agent use.
- **Subscription feature gating** — Users on paid Qwen plans expect first-party tools (image generation, ASR) to work out of the box.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*