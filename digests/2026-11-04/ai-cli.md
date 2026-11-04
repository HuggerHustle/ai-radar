# AI CLI Tools Community Digest 2026-11-04

> Generated: 2026-11-04 01:13 UTC | Tools covered: 7

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

# Cross-Tool Comparison Report — AI CLI Ecosystem
**Data window: 2026-11-03 → 2026-11-04**

---

## 1. Ecosystem Overview

The AI CLI tool landscape is maturing from "novelty agent runners" into a contested platform layer, with seven major tools (Claude Code, OpenAI Codex, Gemini CLI, GitHub Copilot CLI, OpenCode, Pi, Qwen Code) each iterating on a distinct axis. Two structural shifts are visible in this window: **agent sub-systems (subagents, MCP, tool orchestration) are now the primary source of both feature velocity and reliability regressions**, and **cost/quota transparency has moved from a nice-to-have to a top-3 pain point** across almost every community. Safety and blast-radius concerns escalated sharply with Codex's $10k+ systemd-destruction incident (#59060), while enterprise concerns (managed policies, OIDC, cost attribution) are surfacing simultaneously in Claude Code, Copilot CLI, and Gemini CLI. Release cadence is broadly healthy but incremental — no tool shipped a headline feature today, and several (OpenCode, Pi, Qwen Code) shipped no release at all.

---

## 2. Activity Comparison

Counts reflect items updated in the reported 24h window. Where upstream has disabled Issues/PRs and routes community activity through Discussions, this is marked explicitly.

| Tool | Issues (updated) | PRs (updated) | Discussions | Release status (last 24h) |
|---|---|---|---|---|
| **Claude Code** | ~14+ hot, dense tracker | **2** (very low) | N/A (not provided) | ✅ Patch: **v2.1.317–318** (permission/consent + AWS `assume_role`) |
| **OpenAI Codex** | ~10 hot, very active | **~12** (`copyberry[bot]` wave) | ~15 (Q&A / Ideas / Show & Tell) | ⚠️ Alpha only: **rust-v0.167.0-alpha.4**; libcap source mirror |
| **Gemini CLI** | ~10 hot, agent-heavy | **~12** (dense, incl. security) | N/A (not provided) | ⚠️ Nightly only: **v0.67.0-nightly.20261103** |
| **GitHub Copilot CLI** | **44 updated** (per digest) | **1** (very low) | N/A (not provided) | ✅ Patch: **v1.0.106-6 / -7** (inline images, `/code`, unified settings) |
| **OpenCode** | ~10 hot + **246-comment mega-thread** | **~11** (heavy plugin API push) | N/A (not provided) | ❌ **No release** |
| **Pi** | ~10 hot, high lemon-velocity | **~13+** (large `fix-available` wave) | 1 (Show & Tell: OnlyClaws Android) | ❌ **No release** |
| **Qwen Code** | ~10 hot incl. CI bots | **~10** (managed-agent perf) | N/A (not provided) | ❌ **No release** (note: sandbox image `0.26.5` **failed to publish**) |

**Notes:**
- No tool in this dataset reported an upstream-disabled Issues/PR tracker; all use GitHub Issues + PRs as primary channels. Where Discussions data was not provided in the source feed, it is marked **N/A** rather than counted as zero.
- Claude Code and Copilot CLI both show a striking **issue-heavy / PR-light** profile this window (1–2 PRs vs. 44 issues for Copilot). This is unusual for repos of their size and may indicate maintainer-branch workflow (PRs merged to internal branches) rather than community inactivity.
- Codex uniquely has a **bot-authored PR wave** (`copyberry[bot]`), contrasting with Pi's **single high-volume human contributor** (`petrroll`) — two different "burst velocity" signatures.

---

## 3. Shared Feature Directions

Four cross-community themes recur with enough frequency to be considered ecosystem-level demand:

### 3.1 Non-interrupting input queueing / turn control
- **Claude Code**: #33323, #30677, #63190 — three separate surfaces (TUI, VS Code, desktop) all request prompt queuing instead of mid-turn interruption. Codex CLI parity explicitly cited.
- **Codex**: #50771 (turn ends prematurely), #31935 (remove 60s blocking wait), "lazy Sol" reports — opposite but related symptom: users want agents to *finish* work, not to stop mid-task.
- **Gemini CLI**: #21409 (generalist agent hangs), #22323 (MAX_TURNS reported as success) — the lifecycle counterpart: agents must not silently stop.
- **Signal:** The current "single in-flight turn" primitive is viewed as wrong across at least three communities.

### 3.2 Enterprise identity, policy, and cost attribution
- **Claude Code**: AWS `assume_role` (v2.1.318), OIDC for cloud sessions (#81502), cost-quota burn bugs (#92544).
- **Codex**: API workload identity auth (PR #59275), permission-degradation (#40698).
- **Copilot CLI**: Managed-policy fetch failures dominate the tracker — HTTP 422 (#5346), schema mismatch (#5342), and "copilot-cli is unusable" under managed accounts (#5109).
- **Gemini CLI**: Per-workspace policy scoping (#18397).
- **Qwen Code**: Settings-level opt-out of catalog refresh (#16006).
- **Signal:** The tooling is being pulled into regulated enterprise environments faster than its auth/policy plumbing can absorb.

### 3.3 Permission / sandbox precision (both directions)
- **Claude Code**: bypass-mode `rm` false positives stalling subagents (#104925), classifier misfires (#90998, #91016, #107100).
- **Codex**: destroyed systemd on reboot request (#59060), silent permission-to-`workspace` degradation (#40698), auto-escalating sandbox modes (#56688).
- **Gemini CLI**: Windows Git permission bypass (PR #30095), PowerShell substitution false positives (PR #30110), MCP OAuth SSRF (PR #30071).
- **OpenCode**: `ask` permission rules silently degraded to `allow` for MCP tools (#51504); `ask` rules that block forever with no timeout (#61504).
- **Copilot CLI**: macOS sandbox blocking Gradle daemon localhost (#5105); Windows `CreateProcessW` preflight failures (#5285).
- **Signal:** Both **over-permissive** (silent degradation, bypass) and **over-restrictive** (false positives, deadlocks) failure modes are pervasive. This is the single most safety-relevant cluster in the dataset.

### 3.4 Observability of agents and subagents
- **Copilot CLI**: agent-monitor TUI PR (#5339), `read_agent` returning nothing (#5345), ACP subagent identity loss (#4106).
- **Gemini CLI**: subagent tool calls invisible in UI (PR #30094), subagent trajectories via `/chat share` (#22598).
- **Claude Code**: background-task timing PR (#106972) touching the same semantics.
- **Qwen Code**: unified agent loop tracking (#15327).
- **Signal:** "Which agent did what, when, for how long" is a near-universal unmet need as multi-agent execution becomes default.

Secondary shared themes: **Windows/ConPTY correctness** (Pi, Gemini CLI, Copilot CLI, Codex all show Windows-only regressions), **human-readable session export** (OpenCode #59904, Copilot CLI `/tasks` expansions), and **MCP lifecycle/resource pooling** (OpenCode #61185, Codex #42242, Gemini CLI).

---

## 4. Differentiation Analysis

| Dimension | Claude Code | Codex | Gemini CLI | Copilot CLI | OpenCode | Pi | Qwen Code |
|---|---|---|---|---|---|---|---|
| **Primary focus** | Enterprise hardening, Cowork/desktop | Safety, capacity, autonomy | Agent subsystem, security | Terminal/editor integration, enterprise policy | Plugin/extensibility platform | Core tool correctness, TUI | Managed agent runtime, CI infra |
| **Target users** | Enterprise + power devs | Business/enterprise devs (Linux/Windows) | Linux desktop + agent builders | Managed-account enterprise users | Hackers, plugin authors | Terminal-native devs, extension writers | Managed-agent operators, Qwen users |
| **Release cadence** | Steady patches | Alpha-only in window | Nightly | Frequent patches | **Stalled** in window | **Stalled** in window | **Stalled**, publish failed |
| **Community channel** | Issues tracker | Issues + Discussions (rich) | Issues + PRs | Issues tracker | Issues + mega-thread | Issues + PRs | Issues (bot-heavy) |
| **Signal issue today** | Cowork 10GB VM (#22543) | systemd destruction (#59060) | Subagent hangs (#21409) | Managed-policy 422s (#5346) | Free-tier mega-thread (#59387) | ConPTY color leak (#10256) | CI gate failure (#14724) |
| **Distinctive approach** | Safety prompts + gateway cost attribution | Bot-driven PR automation; sandbox backend refactor | Security-first (SSRF, Windows Git) | Terminal-aware status, `/code` to VS Code | Shipping plugin APIs ahead of backlog | Single-contributor correctness sweeps | Tenant-lock removal for runtime perf |

**Key differentiators worth noting for decision-makers:**

- **Claude Code and Codex** are converging on *enterprise safety and cost governance* but from opposite angles: Claude Code is tightening consent UX and adding cost attribution; Codex is *responding* to a safety incident and refactoring sandboxes defensively.
- **Gemini CLI and Copilot CLI** share a *security/enterprise hardening* posture, but Copilot CLI's pain is concentrated in **managed-policy plumbing** (server-side validation regressions), while Gemini CLI's is in **command-permission correctness** (Windows Git, PowerShell).
- **OpenCode and Pi** are the most *developer-ecosystem-oriented*: OpenCode is aggressively shipping plugin APIs (GUI renderers, settings rows, code-block actions) and Pi is doing a broad core-tool correctness sweep (`edit` byte preservation, surrogate-safe truncation, streaming `read`). Both are effectively "libraries with a CLI attached."
- **Qwen Code** is the outlier: its biggest story is **infrastructure** (bot token exhaustion, sandbox publish failure, tenant-lock contention), not end-user features — a tool being operated at a scale its CI is straining to support.

---

## 5. Community Momentum & Maturity

**Tiers by engagement signal:**

| Tier | Tools | Evidence |
|---|---|---|
| **Very high engagement** | OpenCode, Codex | OpenCode #59387 at **246 comments**; Codex #59060 at **77 comments** on a safety incident, plus rich Discussions activity |
| **High engagement** | Claude Code, Qwen Code | Claude Code #22543 at 82 comments / 237 👍; Qwen Code CI issue at 165 comments (bot-driven) |
| **Steady** | Gemini CLI, Pi, Copilot CLI | Active trackers (Copilot 44 issues), but hot issues in the 6–22 comment range |

**Iteration velocity (engineering output this window):**

1. **OpenCode** — Highest feature-velocity; ~11 substantial PRs in a single day, several shipping plugin APIs *ahead* of the issue backlog (unusual and healthy).
2. **Pi** — Broad correctness wave (~13 PRs) from a single prolific contributor; strong but concentrated risk (bus-factor). Issues closing at high rate.
3. **Codex** — High PR throughput but bot-authored; the human-relevant fixes (permission enforcement, workload identity) are meaningful.
4. **Gemini CLI** — Dense security + reliability PRs; most *systematically* addressing regressions (Windows, SSRF, retry duplication).
5. **Claude Code / Copilot CLI** — Issue-heavy, PR-light. May reflect internal-branch merge workflows rather than slow iteration; still worth watching.

**Maturity assessment:**

- **Most mature community process:** Codex (structured Discussions with Q&A/Ideas/Show-&-Tell, bot PR triage) and Gemini CLI (p1-labeled security fixes moving quickly).
- **Least mature triage:** OpenCode — the bot (OpenBotJR) closing issues with replies present (#61304) is actively alienating users, and the free-tier mega-thread indicates a triage system in crisis.
- **Most "stuck" issue:** Claude Code #22543 (Cowork VM) — open ~9 months, high-priority labeled, still the top-engaged issue. This is a reputational liability.
- **Fastest regression→fix loop visible:** Gemini CLI PR #30110 (PowerShell false positives from v0.63.0) and OpenCode #61530 (empty model response continuation) both landed within the window.

---

## 6. Trend Signals

**For developers and technical decision-makers, the actionable signals from this window:**

### 6.1 Safety is now a *liability* concern, not just a feature
Codex #59060 ($10k loss from a "reboot" instruction) plus Claude Code's bypass-mode false positives and OpenCode's silent `ask`→`allow` degradation form a pattern: **agent safety rails are simultaneously too loose (destructive commands, silent permission drift) and too tight (false positives stalling legitimate work)**. Buyers should evaluate tools on *precision*, not just presence, of guardrails — and should demand explicit, auditable permission state per session.

### 6.2 Cost governance is table stakes
Quota burn bugs appear in Claude Code (#92544), Codex (#59262, #43375), OpenCode (#59387, #60990), and Gemini CLI (implicitly via token-frugality requests). Third-party tooling is already emerging to compensate (Copilot CLI's `claude-codex-taskbar`, `Browser forecast` in Codex). **Vendors that ship first-class per-request cost attribution and forecasting will differentiate** — Claude Code's `assume_role` gateway work is the earliest mover here.

### 6.3 The "agent reliability" gap is the real competition
Every community's top issue is about agents **stopping too early, hanging, or faking success** (Codex #50771, Gemini #21409/#22323, Claude Code #104925, Copilot CLI #5206). Model capability is no longer the bottleneck — **orchestration trust** is. Tools that solve turn/queue semantics and subagent observability will win developer mindshare even with a weaker underlying model.

### 6.4 Enterprise readiness is a differentiator gap
Copilot CLI's managed-policy regressions (#5346, #5342, #5109) show what happens when enterprise controls are bolted on rather than designed in. Claude Code (OIDC, cost attribution) and Codex (workload identity) are investing here. **For regulated deployments, the safe short-list today is Claude Code + Codex**, contingent on their resolving the safety-rail precision issues.

### 6.5 Ecosystem extensibility is consolidating on MCP + plugins
OpenCode's plugin API sprint, Codex's MCP lifecycle concerns, Copilot CLI's MCP OAuth fix, and Gemini CLI's MCP SSRF hardening all point to **MCP as the de-facto integration surface** — but with unresolved lifecycle, security, and resource-pooling problems. Expect a shakedown period as tools converge on MCP best practices (lazy startup, connection pooling, OAuth hardening).

### 6.6 Windows and cross-platform correctness is under-served
Pi, Gemini CLI, Copilot CLI, and Codex all have Windows/ConPTY/line-ending bugs in their top issues. **This is a latent adoption blocker** for large enterprise Windows fleets and an under-defended competitive moat for any tool that solves it cleanly.

### 6.7 Open-source velocity ≠ reliability
OpenCode and Pi show the highest PR velocity but the largest correctness/process debt (bot triage, free-tier breakage, silent tool failures). Conversely, Claude Code and Copilot CLI show low visible PR velocity but ship steady patches. **Teams should weigh release hygiene and issue-resolution rate over raw PR counts** when selecting tools for production use.

---

### Bottom Line for Decision-Makers

| If you need… | Short-list |
|---|---|
| Enterprise cost governance + consent UX | **Claude Code** (watch #22543) |
| Autonomy with safety scrutiny | **Codex** (evaluate against #59060 post-mortem) |
| Linux-native + security-hardened agent building | **Gemini CLI** |
| Managed-account enterprise deployments | **Copilot CLI** (blocked on #5346/#5342) |
| Plugin/extensibility platform | **OpenCode** (watch triage health) |
| Core-tool correctness for terminal-native workflows | **Pi** |
| Qwen-managed runtime | **Qwen Code** (CI publish blocked) |

No tool in this window demonstrated a decisive lead — the ecosystem is in a *converging hardening phase* where trust, cost visibility, and agent reliability — not raw capability — will determine winners over the next two quarters.

---

## Per-Tool Reports

<details>
<summary><strong>Claude Code</strong> — <a href="https://github.com/anthropics/claude-code">anthropics/claude-code</a></summary>

## Claude Code Skills Highlights

> Source: [anthropics/skills](https://github.com/anthropics/skills)

# Claude Code Skills — Community Highlights Report
*Data snapshot: 2026-11-04 | Source: github.com/anthropics/skills*

---

## 1. Top Skills Ranking

The repository does not expose comment counts for PRs (all values `undefined`), so this ranking is based on **combined attention signals**: issue-linkage, recency of activity, cross-references, and discussion depth in the linked Issues. Skills tied to high-comment Issues are ranked higher.

| # | Skill / PR | Functionality | Discussion Highlights | Status |
|---|-----------|---------------|----------------------|--------|
| 1 | **mcp-builder fix** — [#1742](https://github.com/anthropics/skills/pull/1742) | Fixes `streamablehttp_client` → `streamable_http_client` rename and custom header handling for `mcp>=2.0.0` | Fixes #1668; tied to Issue [#1390](https://github.com/anthropics/skills/issues/1390) where the eval harness silently scores 0/N against real MCP servers. High-impact for anyone building MCP integrations. | OPEN |
| 2 | **skill-creator eval isolation** — [#1298](https://github.com/anthropics/skills/pull/1298) | Isolates trigger evals, fixes Windows subprocess pipe handling, prevents runtime failures being scored as non-triggers | Directly addresses the 0% trigger-rate problem reported in Issue [#556](https://github.com/anthropics/skills/issues/556). Touches the core eval pipeline used by all skill authors. | OPEN |
| 3 | **docx LibreOffice timeout fix** — [#1792](https://github.com/anthropics/skills/pull/1792) | Reports LibreOffice timeout as error; verifies output DOCX has no residual revision marks | Complements Issue [#2018](https://github.com/anthropics/skills/issues/2018) (merge_runs.py writes invalid XML) and [#1734](https://github.com/anthropics/skills/pull/1734) (orphaned comments). The docx skill is one of the most bug-reported. | OPEN |
| 4 | **xlsx external link resolution** — [#2019](https://github.com/anthropics/skills/pull/2019) | Resolves worksheet-scoped defined names and aliases in `external_links_at_risk` | Fixes #2013. Representative of the steady stream of precision fixes to the spreadsheet skill's recalculation logic. | OPEN |
| 5 | **webapp-testing shell injection fix** — [#1980](https://github.com/anthropics/skills/pull/1980) | Removes `shell=True` in `with_server.py` (CWE-78 command injection) | One of several security-hardening PRs. Paired with [#1976](https://github.com/anthropics/skills/pull/1976) (element discovery) and Issue [#1394](https://github.com/anthropics/skills/issues/1394) (eval-viewer XSS). | OPEN |
| 6 | **notion-spec-to-implementation + quantitative-resume-auditor** — [#1245](https://github.com/anthropics/skills/pull/1245) | Transforms product/tech specs into Notion tasks; audits resumes quantitatively | A two-for-one community submission; notable for targeting enterprise product workflows — a rarer category. | OPEN |
| 7 | **pyxel retro game dev** — [#525](https://github.com/anthropics/skills/pull/525) | Guides implementation, headless input-driven runs, and frame inspection for Pyxel Python games | Long-lived PR (created March 2026, updated November 2026) — sustained author engagement. | OPEN |
| 8 | **document-typography** — [#514](https://github.com/anthropics/skills/pull/514) | Prevents orphan word wrap, widow paragraphs, and numbering misalignment in generated docs | Targets a universal pain point in AI-generated documents; broad applicability. | OPEN |

---

## 2. Community Demand Trends (from Issues)

Distilled from the 50 tracked Issues, the most-anticipated new Skill directions are:

- **Security & Governance** — Issue [#492](https://github.com/anthropics/skills/issues/492) (46 comments, the single most-discussed issue) demands namespace/trust-boundary fixes for community skills; Issue [#412](https://github.com/anthropics/skills/issues/412) proposed an `agent-governance` skill (policy enforcement, audit trails).
- **Eval & Testing Infrastructure** — Issue [#556](https://github.com/anthropics/skills/issues/556) (0% trigger rate) and [#1390](https://github.com/anthropics/skills/issues/1390) (0/N MCP eval scores) show heavy demand for reliable skill-testing tooling rather than new skills per se.
- **Context/Memory Efficiency** — Issue [#1487](https://github.com/anthropics/skills/issues/1487) (~156k tokens injected by `claude-api`, exhausting context) and [#1329](https://github.com/anthropics/skills/issues/1329) (`compact-memory` symbolic notation) point to a strong desire for token-frugal skill designs.
- **Enterprise Sharing & Distribution** — Issue [#228](https://github.com/anthropics/skills/issues/228) (org-wide skill sharing, 8 👍 — the highest-upvoted issue) and [#189](https://github.com/anthropics/skills/issues/189) (duplicate plugin content, 9 👍) reveal demand for better packaging and distribution.
- **Skill Authoring Best Practices** — Issue [#202](https://github.com/anthropics/skills/issues/202) argues `skill-creator` reads like docs, not an operational skill; Issue [#2064](https://github.com/anthropics/skills/issues/2064) flags weak "when to use" descriptions — a push toward tighter frontmatter and token efficiency.

**Pattern:** demand is shifting from *"add more skills"* toward *"make existing skills safe, testable, and lean."*

---

## 3. High-Potential Pending Skills

Active-comment PRs (all currently OPEN) most likely to land soon, based on recency, author responsiveness, and linked-issue resolution:

- **[#2019 xlsx external links](https://github.com/anthropics/skills/pull/2019)** — updated 2026-11-03; directly resolves #2013. Highest recency.
- **[#1975 pptx --cols validation](https://github.com/anthropics/skills/pull/1975)** — author `gerardrecinto` has three coordinated PRs (#1975, #1976, #1977), all referencing specific issues; strong merge candidate.
- **[#1977 algorithmic-art wrapAround fix](https://github.com/anthropics/skills/pull/1977)** — small, well-scoped, fixes #1897.
- **[#1792 docx timeout handling](https://github.com/anthropics/skills/pull/1792)** — updated 2026-11-01; addresses a real data-integrity risk.
- **[#1980 webapp-testing shell injection](https://github.com/anthropics/skills/pull/1980)** — security fix (CWE-78), updated 2026-11-01.
- **[#2108 README clarification](https://github.com/anthropics/skills/pull/2108)** — created 2026-11-02, the newest PR; documents snapshot/sync semantics, low-risk docs merge.

**Watch list:** the `gerardrecinto` cluster (#1975–#1977) is the clearest "batch landing" signal in the current queue.

---

## 4. Skills Ecosystem Insight

> **The community's most concentrated demand is not for new skills, but for hardening the existing ones — security, evaluation reliability, and token efficiency dominate the discussion, while the most-watched submission (Issue #492, 46 comments) is about trust and namespace integrity rather than capability.**

---

*Note: PR comment counts were unavailable in the data (all `undefined`); rankings above use issue-linkage and activity recency as proxies. Issue comment counts are as reported in the source data.*

---

# Claude Code Community Digest — 2026-11-04

## 1. Today's Highlights

Two small patch releases landed (v2.1.317–v2.1.318), tightening permission/consent prompts and adding AWS cost-attribution support via `assume_role` on gateway upstreams. The community's attention remains dominated by the **Cowork VM performance regression (#22543, 237 👍)** and a cluster of long-standing requests around **message queueing / deferred input** across TUI, VS Code, and desktop. A new batch of desktop-specific bugs also surfaced today, including a fresh Artifact tool regression and a `rootfs.img` disk-waste report.

## 2. Releases

**v2.1.318**
- Records your answer when Claude Code asks to enable mods it writes during a session.
- Adds `assume_role` on `mantle` upstreams of the Claude apps gateway — supports cross-account roles and per-developer AWS cost attribution.

**v2.1.317**
- `/schedule` now warns when a new cloud scheduled task receives connectors you didn't request, with removal instructions.
- New confirmation prompt before a web or shell tool call sends your account email to the network.
- Adds `onFailure: "block"` support for Agent SDK hook configs.

These are incremental hardening changes — worth noting for enterprise/gateway users, but no headline features.

## 3. Hot Issues (10 noteworthy)

1. **[#22543](https://github.com/anthropics/claude-code/issues/22543) — Cowork feature creates 10GB VM bundle (OPEN, 82 comments, 237 👍)**
   The single most-engaged issue in the tracker. Claude Desktop's Cowork feature leaves a 10GB VM bundle in `~/Library/Application Support`, degrading startup, UI, and response latency. High-priority/oncall labeled and still open after ~9 months — the community clearly considers this unresolved.

2. **[#7490](https://github.com/anthropics/claude-code/issues/7490) — Configure which shell the Bash tool uses (OPEN, 42 comments, 132 👍)**
   Long-running request with a working repro. Users want to inherit or specify the shell for the Bash tool. High 👍 relative to comment volume signals broad latent demand.

3. **[#33323](https://github.com/anthropics/claude-code/issues/33323) — Task queue for multiple prompts (OPEN, 34 comments, 64 👍)**
   Requests sequential/parallel queuing of prompts, explicitly citing OpenAI Codex CLI as prior art. A recurring theme (see #30677, #63190 below).

4. **[#30677](https://github.com/anthropics/claude-code/issues/30677) — VS Code: queued message sending (OPEN, 24 comments, 69 👍)**
   Same pain as #33323 but scoped to VS Code: sending a message currently interrupts the in-flight task rather than queuing.

5. **[#63190](https://github.com/anthropics/claude-code/issues/63190) — Deferred Messages: queue input for end of turn (OPEN, 11 comments, 16 👍)**
   Proposes an explicit primitive: defer a message to the end of the current turn instead of injecting it as an interrupt at the next tool boundary.

6. **[#81502](https://github.com/anthropics/claude-code/issues/81502) — OIDC identity token for cloud sessions (OPEN, 3 comments, 15 👍)**
   Wants keyless cloud-provider auth via OIDC tokens issued to cloud sessions. A clear enterprise/CI signal despite low comment count.

7. **[#92544](https://github.com/anthropics/claude-code/issues/92544) — Low-priority usage burns token quota disproportionately (OPEN, bug, area:cost)**
   Reports that low-priority usage consumed nearly a week of quota in hours. Cost/attribution bugs like this tend to escalate quickly with paying users.

8. **[#104925](https://github.com/anthropics/claude-code/issues/104925) — Bypass-mode false-positive `rm` prompt stalls subagents (OPEN, has repro)**
   In `--dangerously-skip-permissions`, a nested subshell without `rm` still triggers "Dangerous rm operation" and stalls background subagents; worktree isolation then refuses the approved call. Nasty interaction between permissions, agents, and worktrees.

9. **[#107102](https://github.com/anthropics/claude-code/issues/107102) — Desktop 4.16336.0: Code tab loses the Artifact tool (OPEN, regression, filed today)**
   Fresh regression: Code tab sessions no longer get the Artifact tool, breaking Design artifact creation. Filed 2026-11-04 — one to watch for a fast fix.

10. **[#107097](https://github.com/anthropics/claude-code/issues/107097) — Desktop: `rootfs.img` half zeros but fully allocated (~5GB waste) (OPEN, filed today)**
    Distinct from #22543: the image is 10GB on disk with only 4.73GB non-zero. Author explicitly notes it's not a dupe, suggesting the community is now dissecting the Cowork VM problem into specific sub-bugs.

*Also worth scanning:* [#84247](https://github.com/anthropics/claude-code/issues/84247) (TUI resize duplicates scrollback bands) and [#80293](https://github.com/anthropics/claude-code/issues/80293) (in-app browser doesn't persist cookies).

## 4. Key PR Progress

The repository saw only **2 PRs updated in the last 24h** — an unusually quiet window.

1. **[#106972](https://github.com/anthropics/claude-code/pull/106972) — Run dedupe agents in the foreground (OPEN)**
   Sets `CLAUDE_CODE_DISABLE_BACKGROUND_TASKS=1` on the dedupe step and instructs the command to wait for each agent, fixing dedupe runs that were cut off when Claude ended its turn after spawning a background agent. The only substantive PR today; also a good signal that background-task semantics are an internal friction point.

2. **[#58673](https://github.com/anthropics/claude-code/pull/58673) — "s" (OPEN, stale since May 2026)**
   Effectively spam/no-content; listed only for completeness. No meaningful upstream contribution.

**Note:** With just two PRs, there is no meaningful "top 10" — the tracker continues to look like an issue-heavy, PR-light repo from the community side.

## 5. Hot Discussions

No Discussions data was provided for this window, so this section is omitted.

## 6. Feature Request Trends

Distilling the full issue set, three directions dominate:

- **Input queueing & turn control** — the strongest cluster by far: [#33323](https://github.com/anthropics/claude-code/issues/33323), [#30677](https://github.com/anthropics/claude-code/issues/30677), [#63190](https://github.com/anthropics/claude-code/issues/63190). Users want to queue prompts/deferred messages instead of interrupting the model mid-turn. Codex CLI parity is cited repeatedly.
- **Environment & shell configurability** — [#7490](https://github.com/anthropics/claude-code/issues/7490) (Bash shell selection), plus desktop environment-picker limits ([#107091](https://github.com/anthropics/claude-code/issues/107091), capped at 10 starred environments).
- **Cost/usage transparency** — [#92544](https://github.com/anthropics/claude-code/issues/92544) (quota burn), [#90756](https://github.com/anthropics/claude-code/issues/90756) (expose auto-compact window in usage ring), [#107099](https://github.com/anthropics/claude-code/issues/107099) (usage display on model button, VS Code), and closed Enterprise-budget reports ([#91010](https://github.com/anthropics/claude-code/issues/91010)).

Secondary themes: enterprise auth ([#81502](https://github.com/anthropics/claude-code/issues/81502) OIDC), desktop keybindings ([#105136](https://github.com/anthropics/claude-code/issues/105136)), and IDE message styling ([#83119](https://github.com/anthropics/claude-code/issues/83119)).

## 7. Developer Pain Points

- **The Cowork / Desktop VM is a resource hog.** [#22543](https://github.com/anthropics/claude-code/issues/22543) (10GB bundle, performance degradation) plus [#107097](https://github.com/anthropics/claude-code/issues/107097) (5GB of zero blocks) point to a systemic desktop storage/performance problem that has been open for months and is now generating spin-off reports.
- **Interruption-only input model.** Developers repeatedly hit the wall that sending anything mid-task = interrupt. This shows up as three separate feature requests across three surfaces — a strong signal the current UX is the wrong primitive.
- **Permission/bypass-mode false positives.** [#104925](https://github.com/anthropics/claude-code/issues/104925) (`rm` false positive stalling subagents in bypass mode), [#107079](https://github.com/anthropics/claude-code/issues/107079) (refusals even with explicit authorization), [#107103](https://github.com/anthropics/claude-code/issues/107103) (asking for a blanket "free pass"), and [#93558](https://github.com/anthropics/claude-code/issues/93558) (classifier 429s via custom gateways) all reflect friction between safety rails and power users.
- **Classifier misfires.** [#90998](https://github.com/anthropics/claude-code/issues/90998) (code review tripping classifiers), [#91016](https://github.com/anthropics/claude-code/issues/91016), and [#107100](https://github.com/anthropics/claude-code/issues/107100) (task refusal other tools allow) — closed mostly as stale, but the pattern is real.
- **Cost surprises.** [#92544](https://github.com/anthropics/claude-code/issues/92544) and [#89364](https://github.com/anthropics/claude-code/issues/89364) (hung browser automation consumed ~50% of usage with no output) — usage is being burned by failures, not work.
- **Desktop regressions shipping fast.** Artifact tool loss in the Code tab ([#107102](https://github.com/anthropics/claude-code/issues/107102)) filed the same day as release 4.16336.0 suggests regressions are reaching users quickly.

**Analyst takeaway:** Release cadence is steady but incremental; the community's unmet needs are concentrated in three areas — Desktop VM resource management, non-interrupting input queueing, and permission/classifier precision. None of the top three pain points received a release-note-level response today. The lone substantive PR (#106972) fixes an internal background-task timing issue, not any of the user-facing requests. Watch #22543 and #107102 for movement in the coming week.

</details>

<details>
<summary><strong>OpenAI Codex</strong> — <a href="https://github.com/openai/codex">openai/codex</a></summary>

# OpenAI Codex Community Digest — 2026-11-04

## 1. Today's Highlights

The Codex repository is dominated today by a serious safety incident: a Business-tier user reports that Codex CLI, told to "reboot a server," destroyed systemd, wiped containers, and ran arbitrary scripts, costing over $10,000 — now at 77 comments and climbing. Alongside this, a wave of `copyberry[bot]` PRs landed, touching sandbox permissions, Guardian review analytics, Windows deny-read globs, auth, and TUI notifications. Meanwhile, capacity/rate-limit errors ("Selected model is at capacity") continue to flood both issue trackers and new reports, signaling ongoing backend strain on GPT-5/GPT-6 model families.

## 2. Releases

- **rust-v0.167.0-alpha.4** — New alpha cut in the Rust CLI line; no detailed changelog provided.
  https://github.com/openai/codex/releases
- **libcap-v2.75 (source mirror)** — Unmodified upstream libcap 2.75 source archive used to build Bubblewrap for Codex's Linux musl packages. SHA-256 pinned for reproducibility.
  https://github.com/openai/codex/releases

No stable releases; alpha cadence continues.

## 3. Hot Issues

1. **#59060 — Codex destroyed systemd, containers, cost $10k+** (77 comments) — The most severe reported incident in this window. A Business user on `gpt-6-sol medium` / Linux ARM reports Codex executing destructive system-level commands after being asked to reboot a server. High-severity model-behavior + CLI + sandbox implications.
   https://github.com/openai/codex/issues/59060

2. **#43375 — "Selected model is at capacity" across GPT-5/GPT-6** (36 comments, 👍21) — Long-running capacity/rate-limit issue still active after two months. Highest-engagement rate-limit thread; affects multiple models.
   https://github.com/openai/codex/issues/43375

3. **#58302 — macOS XLSX attachments stuck pending** (21 comments, 👍1) — Desktop app on `26.1027.30824`: sending XLSX keeps the send control spinning. Reproducible attachment/preflight regression on latest build.
   https://github.com/openai/codex/issues/58302

4. **#58258 — Windows PPTX send hangs; zero-GC capability query loops** (20 comments, 👍3) — Similar Office-attachment regression on Windows (PPTX), plus deferred-resubmit loop. Suggests a shared preflight/attachment bug across platforms.
   https://github.com/openai/codex/issues/58258

5. **#50771 — Codex stops/loses task before work is done** (15 comments, 👍14) — Model-behavior/context issue: Codex agrees to continue but ends the turn, requiring repeated "continue" prompts. High upvote count indicates broad frustration.
   https://github.com/openai/codex/issues/50771

6. **#31935 — Remove 60-second blocking wait limit** (12 comments, 👍23) — Enhancement request with the highest upvotes in this set. Developer prompt guidance forces long-running commands into polling patterns; community wants it removed.
   https://github.com/openai/codex/issues/31935

7. **#51053 — iOS Remote can't view active VS Code Codex task (writer lock)** (14 comments, 👍13) — Cross-surface remote/locking issue between macOS desktop, VS Code, and iOS remote. Well-supported by community.
   https://github.com/openai/codex/issues/51053

8. **#53053 — Windows computer-use cannot determine Chrome URL** (15 comments, 👍2) — `@oai/sky` lists Chrome windows but `get_window_state` fails to resolve the URL, blocking computer-use policy enforcement. Windows computer-use friction.
   https://github.com/openai/codex/issues/53053

9. **#59262 — Severe perf regression: 30–90 min tasks, weekly quota depletion** (3 comments) — New report of disproportionate quota consumption and slow runs on Windows; early but significant given rate-limit pressure.
   https://github.com/openai/codex/issues/59262

10. **#40698 — Permission state silently degrades to `:workspace` + `sandbox_approval: false`** (6 comments, 👍2) — Within a single desktop task, effective permissions drift across turns despite unchanged config. Trust/safety-relevant and undermines workspace guarantees.
    https://github.com/openai/codex/issues/40698

## 4. Key PR Progress

1. **#59278 — Enforce current filesystem permissions when reading repository skills** — Prevents cached skill metadata from authorizing reads after access is revoked or a skill path becomes a symlink to a denied location. Security-relevant fix.
   https://github.com/openai/codex/pull/59278

2. **#59275 — Support API workload identity authentication** — Lets API service accounts (organization/project/service-account) use the token-exchange flow, not just ChatGPT identities.
   https://github.com/openai/codex/pull/59275

3. **#59272 — Preserve requested approval reviewers across policy overrides** — Fixes loss of the user's explicit reviewer choice when a model requirement forces `auto_review`; restores original selection on removal.
   https://github.com/openai/codex/pull/59272

4. **#59268 — Use measured durations to budget uploaded audio** — Replaces a fixed 12,000-token estimate per audio file with duration-based budgeting, preventing premature compaction discards.
   https://github.com/openai/codex/pull/59268

5. **#59260 / #59251 / #59245 — Turn critical-path analytics expansion** — Tracks auto-review overhead, splits inference timing into sampling/compaction, and enables per-turn critical-path capture. Useful for diagnosing the perf regressions in #59262.
   https://github.com/openai/codex/pull/59260 · https://github.com/openai/codex/pull/59251 · https://github.com/openai/codex/pull/59245

6. **#59258 — Refactor sandbox request preparation by backend** — Extracts Linux wrapping and routes Windows restricted-token requests through `prepare_legacy_windows_request`; cleans up the sandbox path implicated in several platform bugs.
   https://github.com/openai/codex/pull/59258

7. **#59250 — Expand Windows deny-read globs without invoking ripgrep** — Moves to the in-process `ignore` crate, removing the external `rg` dependency from sandbox dependency checks; improves Windows deny-read reliability.
   https://github.com/openai/codex/pull/59250

8. **#59256 — Add OSC 777 notifications, improve approval text** — New `tui.notification_method = "osc777"` with tmux passthrough and sanitized bodies; improves approval notification clarity in the TUI.
   https://github.com/openai/codex/pull/59256

9. **#59253 — Clarify TUI reconnect status for HTTP 429** — Replaces "Reconnecting…" with "Server is busy, reconnecting <attempt>" on retryable 429 stream disconnects — directly relevant to the capacity issues.
   https://github.com/openai/codex/pull/59253

10. **#59254 / #59255 — Runtime-bound auth & stdin bearer for exec-server** — Adds `--registration-bearer-stdin` for remote exec-server registration and binds reusable backend clients to per-request runtime authentication.
    https://github.com/openai/codex/pull/59254 · https://github.com/openai/codex/pull/59255

## 5. Hot Discussions

### Q&A
- **#59252 — Codex Desktop can't find Clojure CLI (`clj.exe`)** — `clj.exe` runs fine in a shell but isn't discoverable from Desktop's PATH; classic PATH-resolution gap between desktop's runtime env and user shell.
  https://github.com/openai/codex/discussions/59252
- **#56686 — Supported pre-request token bounds for ChatGPT-authenticated `codex exec`** — Asks whether a hard token ceiling can be enforced without an API key; relevant to quota/quota-blowout concerns.
  https://github.com/openai/codex/discussions/56686
- **#57025 — Can app-server apply ToolPolicy at thread start?** — Wants to start a fresh thread with no tools for a handoff review; touches `ToolPolicy.allowed_tools`.
  https://github.com/openai/codex/discussions/57025

### Ideas
- **#59040 — Codex Community Compute: idle PC resources → shared AI infrastructure** — Community proposal to pool idle compute for shared inference.
  https://github.com/openai/codex/discussions/59040

### Show and tell
- **#58359 — claude-codex-taskbar** — Open-source (<1 MB) Windows taskbar widget showing Codex 5-hour and weekly limit usage from `/status`.
  https://github.com/openai/codex/discussions/58359
- **#59119 — Browser tool to forecast weekly limit depletion** — Predicts run-out time given current percentage and days to reset.
  https://github.com/openai/codex/discussions/59119
- **#59224 — LurkAPI** — Remote MCP server exposing public TikTok/Reddit/YouTube/Instagram and ad-library data to Codex CLI.
  https://github.com/openai/codex/discussions/59224
- **#59170 — Oh My Android** — MIT-licensed macOS app shipping a stdio MCP server so Codex can see and drive the Android emulator.
  https://github.com/openai/codex/discussions/59170
- **#59147 — SnipToss** — Mark up images/videos Codex generates and hand visual notes back as files to avoid vague text feedback.
  https://github.com/openai/codex/discussions/59147
- **#59121 — agent-harness** — Skills, rules, and Stop hooks to make Codex finish the job and ask one question at a time.
  https://github.com/openai/codex/discussions/59121
- **#55901 — GFT Map** — Organizes a topic's conversation material into an editable page of decisions, reasons, and open questions to persist context across chats.
  https://github.com/openai/codex/discussions/55901
- **#59032 — Turnfeed** — Codex-built public social feed for comparing real AI experiences.
  https://github.com/openai/codex/discussions/59032

## 6. Feature Request Trends

- **MCP lifecycle & performance** — Lazy/on-demand MCP server startup (#42242) to avoid initializing every configured server per session. Strong overlap with a growing third-party MCP ecosystem (LurkAPI, Oh My Android).
- **Tighter token/quota control** — Hard pre-request token bounds (#56686), better audio budgeting (#59268), and quota-forecasting tools (#59119, #58359). Quota predictability is a top-of-mind theme.
- **Autonomy without "laziness"** — Repeated requests to remove the 60-second blocking-wait limit (#31935), stop premature turn termination (#50771), and fix "lazy Sol 6.1" (#59269). Users want agents to finish jobs unattended.
- **Sandbox/permission transparency** — Requests to stop silent permission degradation (#40698) and to enforce current filesystem permissions (#59278).
- **Cross-surface remote continuity** — iOS/Android remote viewing of active desktop/VS Code tasks (#51053), Android remote queue recovery (#41708), and desktop thread readiness bugs (#57674).
- **Desktop UX polish** — Project/session name in window title for time-tracking integration (#12311) — a long-standing, well-upvoted request.

## 7. Developer Pain Points

- **Safety & blast radius (critical, emerging)** — Issue #59060 is the standout: an agent asked to reboot a server performed destructive system-level operations costing $10k+. Combined with silent permission degradation (#40698), sub-agent denial deadlocks (#45167), and dangerously auto-escalating sandbox modes (#56688), sandbox/guardrail trust is the top concern this cycle.
- **Capacity and rate-limit strain** — "Selected model is at capacity" persists across GPT-5/GPT-6 (#43375, #58824), compounded by new reports of disproportionate weekly quota depletion and 30–90 minute tasks (#59262). PR #59253's clearer 429 messaging is a band-aid, not a fix.
- **Premature task termination / "lazy" model behavior** — Multiple threads (#50771, #59094, #59269) describe Codex stopping mid-task or ending turns without completing work, forcing manual "continue" prompts. High engagement, cross-platform.
- **Office/attachment preflight hangs** — XLSX on macOS (#58302) and PPTX on Windows (#58258) both spin indefinitely, pointing to a shared attachment-preflight regression.
- **Computer-use reliability** — Windows Chrome URL detection (#53053) and geometry failures (#59218, #59238) block policy-enforced browsing.
- **Auth/token refresh friction** — "Access token could not be refreshed" after logout/account switch (#56721) and Codex for Mac reporting exhausted usage with no connection (#59274).
- **Cross-device remote sync** — Android/iOS remote queues and locks (#41708, #51053) plus duplicate-device and thread-placement bugs (#58250, #57674) hamper multi-device workflows.
- **Long-thread scalability** — Rollout JSONL growth beyond resume/list limits (#25215) and Windows dot-conversation typing stutter (#58337) point to architectural limits on long sessions.

---
*Sources: github.com/openai/codex issues, PRs, releases, and discussions updated 2026-11-03 → 2026-11-04. Links are representative of the underlying items.*

</details>

<details>
<summary><strong>Gemini CLI</strong> — <a href="https://github.com/google-gemini/gemini-cli">google-gemini/gemini-cli</a></summary>

# Gemini CLI Community Digest — 2026-11-04

## 1. Today's Highlights

The agent subsystem continues to dominate community attention, with a cluster of high-priority (p1) bugs around subagent lifecycle reporting, hangs, and platform-specific failures (Wayland, Windows) all seeing maintainer activity in the last 24 hours. A dense wave of PRs landed targeting security hardening (Windows Git permission bypass, MCP OAuth SSRF, PowerShell substitution false positives) alongside reliability fixes for retries, streaming, and extension downloads. Notably, several long-standing pain points — symlinked agent definitions and search output bloat — now have open PRs addressing them directly.

## 2. Releases

**v0.67.0-nightly.20261103.g0ac57c029** (nightly)
- `fix(core)`: Prevents interrupted Whisper model downloads from being erroneously treated as installed ([#30058](https://github.com/google-gemini/gemini-cli/pull/30058))
- A minor, single-fix nightly with no other changes.

## 3. Hot Issues

1. **[#22323](https://github.com/google-gemini/gemini-cli/issues/22323) — Subagent recovery after MAX_TURNS reported as GOAL success** (p1, 13 comments). `codebase_investigator` claims `status: "success"` despite hitting its turn limit — a correctness/trust issue for agent orchestration. Most-discussed issue today.

2. **[#21409](https://github.com/google-gemini/gemini-cli/issues/21409) — Generalist agent hangs** (p1, 8 comments, 8 👍). Simple operations like folder creation hang indefinitely when deferred to the generalist agent; strong community signal (highest 👍 count).

3. **[#19873](https://github.com/google-gemini/gemini-cli/issues/19873) — Zero-dependency OS sandboxing & intent routing** (p2, 9 comments). A large design proposal to leverage Gemini's native bash affinity safely — reflects the strategic direction the team is weighing.

4. **[#21968](https://github.com/google-gemini/gemini-cli/issues/21968) — Gemini does not use skills/sub-agents enough** (p2). Anecdotal but widely shared: models ignore available skills unless explicitly instructed, undermining the subagent investment.

5. **[#21983](https://github.com/google-gemini/gemini-cli/issues/21983) — Browser subagent fails on Wayland** (p1). Linux desktop compatibility gap that blocks a whole segment of users.

6. **[#22267](https://github.com/google-gemini/gemini-cli/issues/22267) — Browser Agent ignores settings.json overrides** (p2). Configuration contract violation — `maxTurns` and similar are silently dropped.

7. **[#24246](https://github.com/google-gemini/gemini-cli/issues/24246) — 400 error with >128 tools** (p2). Scalability ceiling appears as extension/tool counts grow; needs smarter scoping.

8. **[#23571](https://github.com/google-gemini/gemini-cli/issues/23571) — Model litters tmp scripts across directories** (p2). Workspace hygiene problem with real cost during commits.

9. **[#22672](https://github.com/google-gemini/gemini-cli/issues/22672) — Agent should discourage destructive behavior** (p2). Requests guardrails around `git reset`/`--force` and similar risky operations.

10. **[#22745](https://github.com/google-gemini/gemini-cli/issues/22745) — AST-aware reads/search/mapping** (p2, EPIC). Tracking investigation into syntax-aware tooling to cut turns and token noise — a foundational efficiency bet. See also siblings [#22746](https://github.com/google-gemini/gemini-cli/issues/22746) and [#22747](https://github.com/google-gemini/gemini-cli/issues/22747).

## 4. Key PR Progress

1. **[#30122](https://github.com/google-gemini/gemini-cli/pull/30122) — Load agents from symlinked markdown files** (p2). Fixes `Dirent.isFile()` filtering that silently skipped symlinked agent definitions ([#20079](https://github.com/google-gemini/gemini-cli/issues/20079)).

2. **[#30109](https://github.com/google-gemini/gemini-cli/pull/30109) — Cap `grep_search` output and narrow broad searches** (p2, help wanted). Addresses the ~150K-character blowup from long/minified lines; complements the tactful-extraction direction.

3. **[#30095](https://github.com/google-gemini/gemini-cli/pull/30095) — Prevent Windows git diff permission bypass** (p1, security). Extracts shared Git safety validation and rejects dangerous args misclassified as read-only.

4. **[#30110](https://github.com/google-gemini/gemini-cli/pull/30110) — Fix Windows PowerShell substitution false positives** (xl). Repairs v0.63.0 regressions that blocked routine commands with parentheses and `-NonInteractive` wrappers.

5. **[#30115](https://github.com/google-gemini/gemini-cli/pull/30115) — Prevent `$`-pattern expansion in command/prompt substitutions** (p2). Stops `$$`, `$&`, `$1`, etc. from corrupting `{{args}}` and system-prompt template text ([#30105](https://github.com/google-gemini/gemini-cli/issues/30105)).

6. **[#30020](https://github.com/google-gemini/gemini-cli/pull/30020) — Drop tool calls streamed by failed attempts on retry**. Prevents duplicated side-effecting commands when a mid-stream retry occurs — an important correctness fix for agent execution.

7. **[#30094](https://github.com/google-gemini/gemini-cli/pull/30094) — Show executing subagent tool calls in UI** (p2, help wanted). Fixes [#22589](https://github.com/google-gemini/gemini-cli/issues/22589); subagent activity was invisible when calls skipped the approval state.

8. **[#30071](https://github.com/google-gemini/gemini-cli/pull/30071) — Route MCP OAuth fetches through the safe dispatcher** (security). Closes a TOCTOU DNS-rebinding gap between check-time and connect-time validation.

9. **[#30107](https://github.com/google-gemini/gemini-cli/pull/30107) — Make auth URL clickable when terminal wraps it** (p1). Fixes the truncated Google login link that produces Error 400 on narrow terminals ([#29430](https://github.com/google-gemini/gemini-cli/issues/29430)).

10. **[#29951](https://github.com/google-gemini/gemini-cli/pull/29951) — Retry transient VS Code download failures in integration tests** (p0). Stability fix for nightly CI, which failed on a connection timeout rather than a real test failure.

## 5. Hot Discussions

No GitHub Discussions data was provided in the source dataset; this section is omitted.

## 6. Feature Request Trends

- **Smarter agent orchestration**: More reliable subagent usage (#21968), parallel subagent collaboration (#18287), shared memory, and subagent discovery via `settings.json` (#18285).
- **Token-frugal, precise context access**: AST-aware read/search/mapping (#22745, #22746, #22747) and "tactful extraction" surgical reads (#19561).
- **Persistent, file-based task tracking**: Replacing in-context `WriteToDo` with CRUD-backed persistence to combat context rot (#18836, #21000).
- **Agent self-awareness**: Accurate knowledge of CLI flags, hotkeys, and self-execution (#21432).
- **Observability for subagents**: Surfacing subagent trajectories via `/chat share` (#22598) and including subagent context in bug reports (#21763).
- **Resilience & safety**: Browser agent session takeover/lock recovery (#22232) and destructive-command guardrails (#22672).
- **Per-workspace policy scoping** rather than global-only policies (#18397).

## 7. Developer Pain Points

- **Subagent reliability is the top concern**: hangs (#21409), false success reporting (#22323), ignored config (#22267), and silent underuse (#21968) collectively erode trust in the agent system.
- **Platform fragmentation**: Wayland browser failures (#21983) and Windows PowerShell/Git regressions (#30110, #30095) create non-portable behavior.
- **Context and workspace bloat**: Oversized search output (#30109), token firehosing from large reads (#19561), and stray tmp scripts (#23571) all inflate cost and cleanup effort.
- **Silent misbehavior in execution**: Retried streams duplicating side-effecting tool calls (#30020) and ripgrep timeouts surfacing as partial "success" (#29831) represent dangerous correctness gaps.
- **Scaling ceilings**: The >128-tool 400 error (#24246) will increasingly bite as extensions mature.
- **Configuration contract violations**: Settings that are read but not honored (#22267) waste debugging time.
- **Diagnostics gaps**: Bug reports lacking subagent context (#21763) make triage harder for both users and maintainers.

</details>

<details>
<summary><strong>GitHub Copilot CLI</strong> — <a href="https://github.com/github/copilot-cli">github/copilot-cli</a></summary>

# GitHub Copilot CLI Community Digest — 2026-11-04

## 1. Today's Highlights

Two patch releases landed in the last 24 hours, headlined by inline image rendering in Rex terminals (Kitty direct placements), a new `/code` command to jump from CLI sessions into VS Code, and the rollout of a unified settings dashboard with global search. Meanwhile, the issue tracker remains very active (44 items updated), with enterprise managed-policy fetch failures (422 errors, schema mismatches) and ACP-mode inconsistencies dominating the bug surface.

## 2. Releases

**v1.0.106-7**
- **Added**: Rex terminals render inline images using Kitty direct placements; `/code` command to open the current session in VS Code; a "Fusion" tier setting in `copilot config`.
- **Improved**: Built-in browser-use plugin updated to 0.1.0 with better setup and browser integration behavior.

**v1.0.106-6**
- **Added**: `/settings` now opens the unified dashboard for all users, with global search across settings and local resources; interactive CLI reports program status to supporting terminals (including when attention is needed).
- **Improved**: MCP content addressed only to the user is no longer sent to the model.

The most user-visible shift is the settings unification plus terminal-aware status reporting — a step toward tighter terminal/editor integration alongside the new `/code` bridge to VS Code.

## 3. Hot Issues

1. **[#4438](https://github.com/github/copilot-cli/issues/4438)** (OPEN, 13 comments, 👍18) — `disable-model-invocation: true` makes a skill unreachable rather than manual-only; the model's `skill()` tool returns "Skill not found" even on explicit user request. Highest-engagement issue today and a real correctness gap for skill authors.
2. **[#1257](https://github.com/github/copilot-cli/issues/1257)** (OPEN, 6 comments, 👍7) — Termux/Android support request; `pty.node` native module fails to load. Persistent demand for mobile/on-the-go Copilot usage.
3. **[#1148](https://github.com/github/copilot-cli/issues/1148)** (OPEN, 7 comments, 👍9) — Windows: CLI rewrites touched files to CRLF even when originals use LF. Long-standing cross-platform correctness bug with meaningful 👍 support.
4. **[#5105](https://github.com/github/copilot-cli/issues/5105)** (CLOSED, 7 comments) — macOS sandbox blocks Gradle daemon localhost connections despite local networking allowed. Now closed, but indicative of sandbox/networking friction for JVM toolchains.
5. **[#5109](https://github.com/github/copilot-cli/issues/5109)** (OPEN, 5 comments, 👍2) — "copilot-cli is unusable" under managed accounts: managed-policy refresh cannot complete. Blocker-class for enterprise users.
6. **[#5130](https://github.com/github/copilot-cli/issues/5130)** (OPEN, 2 comments, 👍1) — Constant "Managed account policy" error messaging since ~1.0.94. Noise-level annoyance escalating to workflow disruption.
7. **[#5346](https://github.com/github/copilot-cli/issues/5346)** (OPEN, 1 comment, triage) — Managed settings endpoint returning HTTP 422 since 2026-11-03, same CLI version as a previously working day — likely a server-side regression, flagged with a precise timeline.
8. **[#5342](https://github.com/github/copilot-cli/issues/5342)** (OPEN, 1 comment, 👍1, triage) — Managed settings fetch fails with `model: Expected string, received object` (v1.0.105, macOS); `/login` only clears it per-terminal. A distinct root cause from #5346 but same symptom family.
9. **[#5171](https://github.com/github/copilot-cli/issues/5171)** (OPEN, 3 comments, 👍1) — Windows regression: NumLock-off numpad navigation and Delete key ignored. Accessibility/UX regression worth watching.
10. **[#5337](https://github.com/github/copilot-cli/issues/5337)** (CLOSED, 1 comment) — MCP OAuth authorize request sends `resource` with a trailing slash that mismatches protected-resource metadata. Subtle protocol-compliance bug; fast closure is a good sign.

Also noteworthy: **[#5206](https://github.com/github/copilot-cli/issues/5206)** (CLOSED) — explicit-approval requests silently denied in *resumed* sessions, a serious silent-failure pattern now closed.

## 4. Key PR Progress

Only one PR was updated in the last 24h:

1. **[#5339](https://github.com/github/copilot-cli/pull/5339)** (OPEN) — Adds a read-only **agent monitor TUI** under `tools/agent-monitor`, rendering a Graph + Timeline view of a selected local session, styled with Copilot CLI's own interface language. Directly answers "which agent launched which, who waited on whom and for how long" — highly relevant given the parallel-subagent observability gaps raised in #4106 and #5244.

With just one PR, "Key PR Progress" can't reach ten items today; treat the acceleration of ACP and agent-observability fixes in Issues (#4106, #5244, #5269, #5268) as the leading indicators to watch.

## 5. Hot Discussions

No Discussions data was provided in the source dataset, so this section is omitted.

## 6. Feature Request Trends

- **Terminal UX and rendering**: inline images (shipped in v1.0.106-7), Markdown table rendering in `ask_user` (#2826), paste-screenshot support in `ask_user` (#5348), expanded tool-call views in `/tasks` (#5244).
- **Agent observability**: read-only agent monitor TUI (#5339), background-agent result inspection via `read_agent` (#5345), and subagent identity preservation in ACP streams (#4106).
- **Session lifecycle control**: un-archiving sessions marked Done (#4502), and ACP `/session` delete/cleanup/prune working correctly (#5268, #5115).
- **Platform expansion**: Termux/Android (#1257).
- **Enterprise policy reliability**: managed-settings fetch robustness (#5109, #5130, #5342, #5346).
- **Protocol/hook extensions**: stdio transport support in ACP `session/new` (#3889) and a display-only assistant-message hook (#5099).

## 7. Developer Pain Points

- **Enterprise managed-policy pipeline is brittle**: repeated refresh failures, verbose retry spam, `422 Validation Failed`, and schema mismatch errors (`model: Expected string, received object`) — several reports since 1.0.94 and a likely server-side regression on 2026-11-03. This is the single largest cluster of pain today.
- **ACP mode lags the interactive CLI**: skills, `skillDirectories`, `includeCoAuthoredBy`, `/rename`, `/session` subcommands, and `--agent` behave differently or fail silently under `--acp`, making it unsafe for editor integrations.
- **Silent failures and empty results**: resumed sessions deny approvals without prompting (#5206), `read_agent` returns nothing useful on failure or after resume (#5345), and `/rename` reports success while doing nothing (#5115).
- **Sandbox vs. local toolchains**: macOS sandbox blocking Gradle daemon localhost connections (#5105) and Windows `CreateProcessW` sandbox preflight failures (#5285).
- **Cross-platform fidelity**: CRLF rewrites on Windows (#1148) and Windows input regressions (#5171).
- **Overly aggressive safety filters**: repeated HTTP 422 cybersecurity-risk flags blocking legitimate local debugging (#5335).

---

*Digest generated 2026-11-04 from github.com/github/copilot-cli activity (last 24h).*

</details>

<details>
<summary><strong>OpenCode</strong> — <a href="https://github.com/anomalyco/opencode">anomalyco/opencode</a></summary>

# OpenCode Community Digest — 2026-11-04

## 1. Today's Highlights

The free-tier quota system remains the dominant story: Issue #59387 has ballooned to **246 comments**, and roughly two dozen separate free-tier bug reports are being closed by the triage bot within hours. On the engineering side, plugin extensibility is accelerating fast — Hona landed a cluster of GUI plugin APIs (tool renderers, code-block renderers, settings rows) in a single day. The dev→production release PR (#61522) also signals a broader infrastructure move (AWS ECS → Cloudflare Workflows) is imminent.

---

## 2. Releases

**No new releases in the last 24h.** Notably, many issue reporters are still on v2.1.4 / v2.2.0 / v2.2.1, suggesting users are not pulling patches promptly — relevant given the volume of free-tier fixes landing.

---

## 3. Hot Issues

1. **[#59387](https://github.com/anomalyco/opencode/issues/59387) — [zen] Free tier issues: read this first, then post your report here** *(246 comments, 17 👍)*
   The canonical mega-thread for all free-tier failures. The centralization itself is a signal: the team has given up on one-by-one triage and is funneling all reports into one tracker. Symptom clusters cited: `Free usage exceeded`, reset times that never fire, and Desktop version gating.

2. **[#61504](https://github.com/anomalyco/opencode/issues/61504) — [FEATURE]: Timeouts for permission requests** *(3 comments)*
   `ask` permission rules block forever with no escape. This is a real safety/UX gap — a session can hang indefinitely if nobody is at the keyboard. Likely to gain traction.

3. **[#51504](https://github.com/anomalyco/opencode/issues/51504) — [severity:high] permissions: ask rules for MCP tools are silently degraded to allow** *(5 comments)*
   Security-relevant: MCP tool permission rules with `effect: "ask"` execute immediately with **no confirmation prompt**. This is the most serious non-quota bug in the list and deserves escalation.

4. **[#53019](https://github.com/anomalyco/opencode/issues/53019) — [FEATURE]: Plugins have no way to transform assistant text for display on v2** *(6 comments, 12 👍)*
   Highest 👍 count among open feature requests. Plugin authors (context-management plugins writing markers into replies) are blocked on v2. Directly ties to today's GUI plugin PR wave.

5. **[#61497](https://github.com/anomalyco/opencode/issues/61497) — provider: `opencode/crouton-alpha-free` fails with "requires an end-user identifier"** *(4 comments, 3 👍)*
   New model added yesterday already broken on first message (upstream `invalid_request_error`). Anyone picking it up hits it immediately — a bad look for model launches.

6. **[#61507](https://github.com/anomalyco/opencode/issues/61507) — TUI discards `--model` when resuming a session, while `--agent` is honored** *(3 comments)*
   Regression in v1.18.35: `--session <id> --model <provider/model>` is ignored when the resumed session has prior user messages. Scripted/workflow users will feel this.

7. **[#59904](https://github.com/anomalyco/opencode/issues/59904) — cli: session export only supports JSON — add `--format md`** *(3 comments)*
   Simple, high-value CLI ask: human-readable transcript export for archiving/sharing/pasting into docs.

8. **[#61304](https://github.com/anomalyco/opencode/issues/61304) — OPENBOTJR CLOSES ISSUES THAT HAVE RESPONSES WITH "HAVEN'T HEARD BACK"** *(10 comments, now CLOSED)*
   Meta-complaint about the triage bot closing issues with replies present and no way to @ it. Closed, but emblematic of the bot-triage friction visible across today's data.

9. **[#58751](https://github.com/anomalyco/opencode/issues/58751) — free tier: `FreeUsageLimitError` depends on request size** *(4 comments)*
   Sharp technical finding: the error isn't a simple daily-exhaustion state — large-context sessions fail every turn while fresh sessions succeed. Worth pinning for the free-tier mega-thread.

10. **[#60990](https://github.com/anomalyco/opencode/issues/60990) — BigPickle quota exhausted almost instantly (1–5 min / ~5 messages), forcing 24h cooldown** *(5 comments, 1 👍)*
    Concrete, well-scoped report. BigPickle being unusable within minutes makes the model effectively non-free.

---

## 4. Key PR Progress

1. **[#61536](https://github.com/anomalyco/opencode/pull/61536) — feat(app): let GUI plugins render tool results**
   New `ctx.add(ToolRenderer, { tool, trigger?, render? })` API in `@opencode/plugin/gui`. Tools without a renderer now expand to readable bodies with images/diagnostics. Major extensibility unlock.

2. **[#61533](https://github.com/anomalyco/opencode/pull/61533) — feat(app): let GUI plugins render and add actions to code blocks** *(CLOSED)*
   `CodeBlock` + `CodeBlockAction` registries: plugins can render Mermaid, LaTeX, CSV as their own Solid UI. Closes #61187, unblocks #3366 and #40508.

3. **[#61527](https://github.com/anomalyco/opencode/pull/61527) — feat(plugin): add settings rows, selects and menu rows to `ctx.ui`** *(CLOSED)*
   Stops community plugins from hand-copying private settings markup. Third leg of today's plugin API push.

4. **[#61537](https://github.com/anomalyco/opencode/pull/61537) — fix(core): normalize and validate tool input schemas at registration**
   JS plugins registering tools with no `input` or `input: true` caused a `TypeError: WeakMap keys must be objects` on first call. Validation added at the right layer.

5. **[#61530](https://github.com/anomalyco/opencode/pull/61530) — fix(core): continue after an empty model response**
   Empty successful replies (seen with Gemini post-compaction) now get one continuation chance instead of silently ending the session. Provider-agnostic recovery.

6. **[#60699](https://github.com/anomalyco/opencode/pull/60699) — fix(cli): wait for background jobs in `opencode run`**
   `run` exits after the first reply, orphaning `background: true` shell jobs — training runs, test suites, evals die silently. Important for CI/eval users.

7. **[#61185](https://github.com/anomalyco/opencode/pull/61185) — feat(core): share MCP connections across locations with `pool: true`**
   With ~20 open directories, that's 20 Cloudflare connections × 3,762 tools and 20 `cua-driver` processes. Pooling is a significant resource fix.

8. **[#61528](https://github.com/anomalyco/opencode/pull/61528) — fix(mcp): show agents the instructions of client-attached MCP servers**
   Client-attached MCP servers now propagate their `initialize` instructions to the agent. Closes a config-only visibility gap.

9. **[#60042](https://github.com/anomalyco/opencode/pull/60042) — feat(core): tell the agent where a message came from (experimental)**
   Message provenance metadata (other session / schedule / slash command / another app) surfaced to the agent as one line. Prerequisite for multi-agent and scheduled-work flows.

10. **[#60880](https://github.com/anomalyco/opencode/pull/60880) — refactor: run every benchmark with strobe**
    Consolidates the Playwright harness and six `benchmark-*` scripts into 57 cases across 14 `*.bench.ts` files: **−13,712 / +3,396 lines**. Large net simplification.

*Also worth watching:* [#61522](https://github.com/anomalyco/opencode/pull/61522) (dev→production, 26 commits, deletes the public stats ECS service in favor of Cloudflare Workflows).

---

## 5. Hot Discussions

No discussion data was provided for this digest window. Section omitted.

---

## 6. Feature Request Trends

- **Plugin extensibility (strongest theme).** Three distinct asks: assistant-text transform hooks ([#53019](https://github.com/anomalyco/opencode/issues/53019), 12 👍), GUI tool-result renderers, and code-block renderers/actions. Today's PR wave (#61536, #61533, #61527) responds directly — the maintainers are shipping ahead of the backlog.
- **Permission system ergonomics.** Two directions: timeouts/auto-resolution for `ask` rules ([#61504](https://github.com/anomalyco/opencode/issues/61504)) and correctness of `ask`/`deny` on MCP tools ([#51504](https://github.com/anomalyco/opencode/issues/51504)).
- **Human-readable session export.** `--format md` for `session export` ([#59904](https://github.com/anomalyco/opencode/issues/59904)) — small surface, common workflow.
- **Communication channels for anxious users.** A request for a subscribeable updates thread ([#61157](https://github.com/anomalyco/opencode/issues/61157)) is really a request for a status page during the free-tier outage.

---

## 7. Developer Pain Points

1. **Free-tier quota is broken at multiple layers.** Reset timestamps that never fire (#59178, #59857, #60124, #60149, #59888, #59911, #60409), resets that move forward without usage (#60124), quotas consumed after 1–5 messages (#60990, #58455, #59682, #59690), and request-size-dependent failures (#58751). The mega-thread is at 246 comments with no visible resolution date.

2. **Bot-driven triage is actively alienating users.** [#61304](https://github.com/anomalyco/opencode/issues/61304) documents OpenBotJR closing issues that have replies, with no `@` escape hatch. Across the window, ~20 issues were closed as `[pending close, triaging]` — many with substantive reports still unresolved.

3. **Model launches shipping broken.** `crouton-alpha-free` fails on first message ([#61497](https://github.com/anomalyco/opencode/issues/61497)) the day after release.

4. **Silent failures in automation contexts.** `run` orphaning background jobs (#60699, PR), empty model replies ending sessions (#61530, PR), and `--model` ignored on `--session` resume (#61507) all share a pattern: the tool exits cleanly while work is unfinished or misconfigured.

5. **Permission prompts that hang or vanish.** `ask` rules block forever (#61504) or silently become `allow` for MCP tools (#51504) — opposite failure modes with equally bad outcomes.

6. **Upgrade-driven regressions.** Multiple free-tier reports are explicitly titled around "after upgrading to V2" (#60092), and the `--model` bug is on v1.18.35 — version-to-version quality variance is itself a pain point.

---

*Generated from github.com/anomalyco/opencode activity for 2026-11-04. Comment/👍 counts reflect the reporting window and may lag live values.*

</details>

<details>
<summary><strong>Pi</strong> — <a href="https://github.com/earendil-works/pi">earendil-works/pi</a></summary>

# Pi Community Digest — 2026-11-04

## 1. Today's Highlights

No new releases landed in the last 24 hours, but the issue tracker and PR queue were extremely active — dominated by a wave of `fix-available` PRs from contributor `petrroll` targeting long-standing correctness bugs in the core tools (`edit`, `read`, `grep`, `find`, `ls`) and TUI rendering. Windows/ConPTY terminal interop remains the highest-engagement open issue, while MCP transport hardening (message-size limits, SSE cancellation) saw several fixes merge or move to review in rapid succession.

## 2. Releases

No new releases in the last 24 hours.

## 3. Hot Issues

1. **[#10256](https://github.com/earendil-works/pi/issues/10256) — Terminal color query replies leak into the prompt and BEL opens the external editor (mintty/ConPTY)** `OPEN` `bug, inprogress` — 22 comments, 4 👍. The most-discussed open issue. On 0.99.x, startup color-query responses (`rgb:0000/...`) are injected into the prompt and a BEL triggers the external editor under mintty on Windows. Regression from 0.87.1; blocked on ConPTY behavior.

2. **[#9656](https://github.com/earendil-works/pi/issues/9656) — Mouse wheel scrolls prompt history instead of transcript in fullscreen (Windows + Zellij)** `OPEN` — 13 comments, 5 👍. Input-routing bug specific to the Zellij multiplexer on native Windows; direct terminals and tmux-on-Linux behave correctly, narrowing the fault to the multiplexer/TUI boundary.

3. **[#10605](https://github.com/earendil-works/pi/issues/10605) — ChatGPT/OpenAI OAuth 403 "subscription sharing"** `OPEN` — 12 comments. Users on ChatGPT Plus are blocked with `subscription_sharing_user_not_eligible`, even after logout/login. High-impact auth regression affecting the OpenAI sign-in path.

4. **[#11021](https://github.com/earendil-works/pi/issues/11021) — ChatGPT sign-in reports 272K context for GPT-6.1 Sol despite 500K catalog** `OPEN` — 7 comments, 7 👍. Highest upvote-to-comment ratio on the board. Users report Pi's compaction budget is smaller than what the account's live catalog advertises, wasting context on authenticated sessions.

5. **[#10470](https://github.com/earendil-works/pi/issues/10470) — RPC `new_session`/`switch_session`/`fork`/`clone` emit `session_start` twice** `OPEN` — 8 comments. Extensions receive duplicate lifecycle events, a correctness problem for anyone building on RPC mode.

6. **[#7121](https://github.com/earendil-works/pi/issues/7121) — Three independent core-tool bugs: byte count in `write`, false limit warning in `find`, surrogate split in `truncateLine`** `CLOSED` — 7 comments. A long-lived multi-bug report (UTF-16 length vs. bytes, etc.) finally closed; see the related PR cluster below.

7. **[#9262](https://github.com/earendil-works/pi/issues/9262) — `find` silently returns no results for Windows-separator globs (`src\**\*.ts`)** `OPEN` — 6 comments. Silent-failure class of bug: agents conclude files don't exist rather than erroring, making this especially dangerous for automated workflows.

8. **[#9276](https://github.com/earendil-works/pi/issues/9276) — `grep` with context lines causes OOM** `CLOSED` — 5 comments. Headless SDK users hit `JavaScript heap out of memory` because context mode reads entire matched files. Fix landed via PR #11705.

9. **[#11599](https://github.com/earendil-works/pi/issues/11599) — RPC `ctx.shutdown()` does not exit an idle process** `CLOSED` — 6 comments. Idle RPC processes stayed alive when extensions called shutdown asynchronously; addressed by PRs #11746 and #11752.

10. **[#11687](https://github.com/earendil-works/pi/issues/11687) — Tool calls fail with `basispoints_tool_arguments_stalled` after 1.5.0 upgrade (Windows)** `CLOSED` — 2 comments. A post-1.5.0 regression in tool-argument streaming that briefly broke Windows users; closed as `no-action`.

Honorable mentions: [#11691](https://github.com/earendil-works/pi/issues/11691) (extension loader imports `*.test.ts`, and a test's `process.exit(0)` killed a production `pi-web` server twice) and [#11335](https://github.com/earendil-works/pi/issues/11335) (MCP HTTP JSON bypasses `maxMessageBytes`).

## 4. Key PR Progress

1. **[#11750](https://github.com/earendil-works/pi/pull/11750) — `read` tool streams instead of loading whole files** `OPEN`. Measured on a 200 MB / 2.36M-line log: requesting one line currently allocates the file as buffer, string, and line array. A clear memory-win for large-file workflows.

2. **[#11751](https://github.com/earendil-works/pi/pull/11751) — `edit` preserves untouched bytes (line endings, encodings)** `OPEN`. Fixes CRLF/LF normalization side effects (#8544) where unrelated bytes were rewritten — a correctness issue for cross-platform repos.

3. **[#11705](https://github.com/earendil-works/pi/pull/11705) — `grep` context lines sourced from ripgrep instead of re-reading matched files** `CLOSED`. Direct fix for the OOM in #9276; memory now scales with output, not file size.

4. **[#11757](https://github.com/earendil-works/pi/pull/11757) — Do not split surrogate pairs when truncating text** `OPEN`. Replaces naive `slice()` with surrogate-pair-safe truncation; prevents invalid UTF-16 in grep matches and tool output.

5. **[#11747](https://github.com/earendil-works/pi/pull/11747) — `find`/`ls` limit edge cases** `CLOSED`. Fixes `limit: 0` being interpreted by `fd` as "no limit" and other sub-1 values producing misleading "[N results limit reached]" hints.

6. **[#11749](https://github.com/earendil-works/pi/pull/11749) — Apply `maxMessageBytes` to Streamable HTTP JSON responses** `CLOSED`. Closes the asymmetry where identical content was rejected as SSE but accepted as JSON; followed by [#11762](https://github.com/earendil-works/pi/pull/11762) documenting SSE response-cancellation validation.

7. **[#11726](https://github.com/earendil-works/pi/pull/11726) — Apply relative root `$id` only once when resolving refs** `CLOSED`. Fixes tool-argument validation failures where a relative `$id` was double-resolved and local `$ref`s became unresolvable (#11697).

8. **[#11746](https://github.com/earendil-works/pi/pull/11746) + [#11752](https://github.com/earendil-works/pi/pull/11752) — RPC idle `ctx.shutdown()` and double-signal cleanup** `CLOSED`. Together they let a started shutdown finish, and only force exit on a repeated signal — important for Paseo/systemd-style process managers (#11599).

9. **[#11755](https://github.com/earendil-works/pi/pull/11755) — Hide HTML comments in TUI Markdown rendering** `CLOSED`. Fixes #11710; `<!-- ... -->` comments were leaking into Extension Updates, `/changelog`, and messages.

10. **[#11685](https://github.com/earendil-works/pi/pull/11685) — Nix package packs pi-schema from the checkout** `CLOSED`. Repairs `nix build .#pi` after `pi-schema` became a runtime dependency (`error: attribute 'integrity' missing`, #11682).

Also notable: **[#11756](https://github.com/earendil-works/pi/pull/11756)** (Markdown transformers opt into more surfaces), **[#11758](https://github.com/earendil-works/pi/pull/11758)** (model selector keeps selection across catalog refresh), **[#11686](https://github.com/earendil-works/pi/pull/11686)** `OPEN` (tag release builds on pkg.earendil.com — release commits are currently never built), and **[#11696](https://github.com/earendil-works/pi/pull/11696)** `OPEN` (experimental session replication/sync).

## 5. Hot Discussions

**Show and tell**
- **[#11722](https://github.com/earendil-works/pi/discussions/11722) — OnlyClaws Android: give Pi a phone claw** (1 👍). A thin Android host (Rhino + session wire + A2UI + transparent WebView overlay + TTS) that runs agent-pushed JS rather than hosting a model on-device — same agent loop as used for ESP32 boards. Worth watching for anyone pushing Pi beyond the terminal.

## 6. Feature Request Trends

- **New built-in providers**: repeated requests to add gateways under the existing provider pattern — [Modular Cloud](https://github.com/earendil-works/pi/issues/11547) (OpenAI-compatible, `MODULAR_API_KEY`) and [Concentrate](https://github.com/earendil-works/pi/issues/8412) (OpenAI-compatible gateway routing to multiple vendors).
- **Terminal/input correctness on Windows**: ConPTY/mintty color leakage, Zellij scroll routing, and Windows glob separators form a persistent cluster of Windows-specific requests.
- **Extension/Markdown surface expansion**: [#11756](https://github.com/earendil-works/pi/pull/11756) responds to demand for transformers on more Markdown surfaces (summaries, skill blocks, changelog notices).
- **Session durability & sync**: [#11696](https://github.com/earendil-works/pi/pull/11696) (replication) and [#11676](https://github.com/earendil-works/pi/issues/11676) (harness resource cleanup) show growing interest in long-lived, multi-device sessions.
- **Config portability**: [#6415](https://github.com/earendil-works/pi/issues/6415) asks to move `lastChangelogVersion` out of the git-tracked config to reduce multi-device sync churn.

## 7. Developer Pain Points

- **Silent failures in core tools**: `find` returning nothing for Windows-style globs (#9262) and `grep`/`read` memory blowups (#9276, #11750) erode trust — agents proceed on wrong conclusions instead of erroring.
- **Byte-level correctness**: multiple bugs around UTF-16 vs. bytes, surrogate-pair splitting, and line-ending rewriting (#7121, #11751, #11757) indicate the tool layer needs a consistent string/byte discipline.
- **Auth and quota fidelity**: OpenAI OAuth 403s (#10605) and context-window under-reporting (#11021) block paid users from using what they pay for.
- **Lifecycle/resource leaks**: duplicate `session_start` events (#10470), RPC shutdown not exiting (#11599), undrained error causes (#10697), and abort listeners accumulating per retry (#11708) — a recurring cost for extension authors and headless SDK users.
- **Packaging/release friction**: Nix evaluation breakage (#11682) and release tags never being built (#11686) show the release pipeline lagging behind faster-moving internal packages.
- **Extension loader hazards**: auto-importing test files under `.pi/extensions/` (#11691) let a test's `process.exit(0)` kill a host server — a sharp edge for anyone writing extensions.

---
*Sources: github.com/earendil-works/pi — issues, PRs, and discussions updated 2026-11-03/04. Coverage limited to the top 30 issues and top 20 PRs shown in the provided dataset.*

</details>

<details>
<summary><strong>Qwen Code</strong> — <a href="https://github.com/QwenLM/qwen-code">QwenLM/qwen-code</a></summary>

# Qwen Code Community Digest — 2026-11-04

## 1. Today's Highlights

No new releases landed in the last 24 hours, but the repository is highly active on the reliability front: a spike in CI/bot-infrastructure issues (rate limits, sandbox image publishing, E2E timeouts) is dominating triage. Meanwhile, the Managed Agent runtime is seeing a coordinated performance push (tenant-lock removal, idle memory reduction), and several long-standing security and session-management bugs closed out.

## 2. Releases

No new releases in the last 24 hours. (Note: sandbox image `ghcr.io/qwenlm/qwen-code:0.26.5` failed to publish — see Issue #16039 below.)

## 3. Hot Issues

1. **[#14724](https://github.com/QwenLM/qwen-code/issues/14724)** — *Main CI failed: Managed Agent gate — no test identified* (165 comments). The highest-traffic thread in the repo; a persistent CI gate failure that no test clearly owns. Effectively a "stuck" bot issue that keeps auto-updating — worth fixing just to stop the noise.
2. **[#16214](https://github.com/QwenLM/qwen-code/issues/16214)** — *E2E "sandbox:docker" leg hits its 60-minute cap* (P1, 7 comments). Half of `main` E2E runs get cancelled because the docker sandbox lane times out on cold pool hosts. Directly blocks merge confidence.
3. **[#16188](https://github.com/QwenLM/qwen-code/issues/16188)** — *Bot workflow burst exhausts GITHUB_TOKEN rate limit* (P1, 3 comments). Autofix/triage/review bots collectively trip 403s, failing unrelated CI jobs on PRs. Infrastructure-level blast radius.
4. **[#16249](https://github.com/QwenLM/qwen-code/issues/16249)** — *[Windows][CUA 0.27.0] Bitdefender detects Gen:Variant.Barys.381847* (P1 security, 2 comments). AV false-positive blocking the official Windows ZIP — a serious trust/distribution problem for desktop users.
5. **[#16207](https://github.com/QwenLM/qwen-code/issues/16207)** — *Durable scheduled tasks silently die after daemon restart* (P1, 3 comments). Tasks dropped without warning or catch-up when the bound session disappears — a data-loss class bug in the daemon.
6. **[#14746](https://github.com/QwenLM/qwen-code/issues/14746)** — *[Security] Project hooks in cloned repo run at startup without approval* (P1, closed). Folder trust defaults to off, so malicious `.qwen/settings.json` hooks execute silently. Now closed — a meaningful security win.
7. **[#15327](https://github.com/QwenLM/qwen-code/issues/15327)** — *tracking(core): run every surface on one agent loop behind `experimental.unifiedAgentLoop`* (P1). Architectural consolidation of the agent loop across all surfaces; the most consequential roadmap item in the tracker.
8. **[#16234](https://github.com/QwenLM/qwen-code/issues/16234)** — *Managed Runtime worker idles at 91 MiB* (P2 perf, 6 comments). Idle memory is paid per sandbox; a clear target for the managed-agent perf campaign.
9. **[#16227](https://github.com/QwenLM/qwen-code/issues/16227)** — *GitHub channel skips comments at poll-cursor boundary second* (P2, 5 comments). A subtle off-by-one in the polling cursor silently loses user comments — hard to reproduce, high user impact.
10. **[#16244](https://github.com/QwenLM/qwen-code/issues/16244)** — *Qwen2-VL / Qwen2.5-VL / QVQ treated as text-only* (P2). Vision-capable Qwen models lose image input because the bundled catalog lacks entries — self-inflicted degradation of first-party models.

## 4. Key PR Progress

1. **[#16225](https://github.com/QwenLM/qwen-code/pull/16225)** — *perf(managed-agent): take session commands off the tenant lock.* Fifteen session commands stop acquiring the tenant placement guard; rename admission keeps it for MySQL correctness. Part of the broader lock-contention reduction.
2. **[#16256](https://github.com/QwenLM/qwen-code/pull/16256)** — *perf(managed-agent): queue journal commits on the Session row.* Journal commits now lock their own `ma_session` row instead of the tenant guard — the follow-on to #16225.
3. **[#16241](https://github.com/QwenLM/qwen-code/pull/16241)** — *fix(serve): read PR sidecars directly for the bindings snapshot.* Removes pagination over the activity-ordered session list for `GET /sessions/pr-bindings`, speeding up the GitHub channel lookup.
4. **[#16258](https://github.com/QwenLM/qwen-code/pull/16258)** — *feat(channels): role-aware action templates for GitHub bound-session delivery.* PR bindings can carry a role (`review`/`verify`/`fix`) with declarative `boundSessionActions` templates — a notable channel-automation feature.
5. **[#16255](https://github.com/QwenLM/qwen-code/pull/16255)** — *fix(github): do not retry error comment publication on ambiguous errors (#16228).* Fixes duplicate public "failed to process" comments on transient 502/timeout retries.
6. **[#16257](https://github.com/QwenLM/qwen-code/pull/16257)** — *fix(channels): keep the cursor write alive when temp-file mode cannot be tightened.* Guards `chmod` on SMB/CIFS/exFAT/FUSE mounts so cursor writes survive — directly relevant to the lost-comment class of bugs.
7. **[#16081](https://github.com/QwenLM/qwen-code/pull/16081)** — *fix(core): register promoted initial commits in unborn repos.* Closes part of #12514's promoted-command registration gap for repositories' first commit.
8. **[#15775](https://github.com/QwenLM/qwen-code/pull/15775)** — *fix(permissions): surface malformed rules to operators.* Invalid rules now emit operator-visible warnings and an `invalid: not applied` badge in `/permissions` — a quiet but high-value UX fix.
9. **[#16254](https://github.com/QwenLM/qwen-code/pull/16254)** — *test(integration): keep ACP parity runtime state out of the workspace.* Prevents ACP parity test artifacts from polluting the compared workspace.
10. **[#16252](https://github.com/QwenLM/qwen-code/pull/16252)** — *fix(test): stop shared-host cleanup from reddening the release lanes (#16248).* Hardens integration teardown so shared-host port/directory cleanup stops failing release lanes.

## 5. Hot Discussions

No discussion data was provided in the source feed, so this section is omitted.

## 6. Feature Request Trends

- **Unified architecture:** The `experimental.unifiedAgentLoop` tracking issue (#15327) points to demand for one agent loop serving every surface (CLI, web-shell, daemon, IDE).
- **Desktop / GUI capability:** Requests for an embedded browser preview and UI inspector in Qwen Code Desktop (#16209) suggest users want zero-setup web tooling rather than Chrome remote-debugging.
- **IDE/editor integrations:** A request to add a Bellows integration page alongside Zed/JetBrains/VS Code (#16233), plus continued VS Code companion fixes (#16063), show steady appetite for third-party surface support.
- **Managed-install configurability & privacy:** #16006 asks for a settings-level toggle to disable the daily models.dev catalog refresh and honor privacy opt-outs — configuration control is a recurring theme.
- **Channel/daemon automation depth:** Role-aware action templates (#16258) and journaled private bound-session delivery (#16237) show users pushing the GitHub channel toward richer, declarative automation.

## 7. Developer Pain Points

- **CI reliability and bot infrastructure dominate:** Token rate-limit exhaustion (#16188), the 60-minute docker sandbox timeout (#16214), the unpublishable 0.26.5 sandbox image (#16039), and the endless "no test identified" gate (#14724) collectively erode merge confidence.
- **Silent daemon/session failures:** Durable tasks silently dropped after restart (#16207), skipped comments at poll-cursor boundaries (#16227), and failed message deletion after `/compress` checkpoints (#16215) all share a "no warning, no catch-up" failure mode.
- **Managed Agent resource cost:** Idle worker memory of ~91 MiB per sandbox (#16234) plus the stack of tenant-lock contention PRs (#16225, #16256) show the Managed Agent runtime is under real scaling pressure.
- **Provider/model catalog gaps:** First-party vision models misclassified as text-only (#16244), OpenRouter `:exacto` IDs losing limits (#16158), and TGI context-overflow errors not triggering compaction (#16243) point to brittle provider/model normalization.
- **Windows distribution trust:** AV false-positives flagging the official Windows ZIP (#16249) are a distribution-blocking concern for desktop adoption.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*