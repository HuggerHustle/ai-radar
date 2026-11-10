# AI CLI Tools Community Digest 2026-11-10

> Generated: 2026-11-10 03:25 UTC | Tools covered: 7

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
**Snapshot date: 2026-11-10 · Sources: Anthropic Claude Code, OpenAI Codex, Google Gemini CLI, GitHub Copilot CLI, OpenCode, Pi, Qwen Code**

---

## 1. Ecosystem Overview

The AI CLI tooling space has consolidated into a **seven-player field with clear tiering**: established platform incumbents (Claude Code, Codex, Gemini CLI, Copilot CLI) shipping weekly against challenger/independent tools (OpenCode, Pi, Qwen Code) iterating faster on narrower surfaces. Release cadence is high across the board — Claude Code, Codex, and Copilot CLI all shipped within 24 hours, while Qwen Code cut a coordinated CLI/Desktop/SDK release and Pi shipped a credential-UX milestone. **Reliability, not capability, is the story of the day**: the hottest issues across every tracker are about permissions that don't apply (3 tools), agents that stop early or misreport success (5 tools), compaction corrupting context (3 tools), and quota accounting users can't trust (3 tools). Meanwhile, **MCP and subagent/worktree orchestration** have become shared infrastructure concerns rather than differentiators. The competitive frontier is shifting from "what the model can do" to **"whether the harness, permissions, and state layer survive real multi-hour, multi-agent workflows."**

---

## 2. Activity Comparison (24h window)

| Tool | Issues (updated) | PRs (updated) | Discussions | Releases |
|---|---|---|---|---|
| **Claude Code** | 10+ hot items; ~12 closed today | **1** (substantive; Anthropic-authored) | N/A (no data) | **2** — v2.1.322, v2.1.321 (Fable 5.2 default) |
| **OpenAI Codex** | 10+ hot items | **20** (all `copyberry[bot]`, all closed) | **10+ active** (Show & Tell heavy) | **3** alpha bumps (0.169.0-α7/α6, 0.167.0-α4.1) |
| **Gemini CLI** | **50** updated | **38** updated | N/A (no data) | None |
| **GitHub Copilot CLI** | **29** updated | **0** | N/A (no data) | **2** — v1.0.109-0, v1.0.108 |
| **OpenCode** | 10+ hot items (incl. #59387 @ 339 comments) | 10 listed (mix open/closed) | N/A (no data) | None |
| **Pi** | 10+ hot items (#7547 @ 96 comments) | **10+** community-authored (petrroll cluster) | **1** (Ideas) | **1** — v1.5.1 (`pi auth`) |
| **Qwen Code** | 10+ hot items; multi-month CI failures | **10** listed (mix open/closed) | N/A (no data) | **3** — v0.27.1 CLI/Desktop, SDK 0.1.31 |

*Notes:* "N/A" for Discussions indicates the channel was not included in the digest data, not that the community is inactive. Issue/PR counts reflect items updated in the last 24h, not totals. Codex PR activity is dominated by an automated bot; true human PR throughput was effectively zero today.

---

## 3. Shared Feature Directions

**a) Permission & sandbox correctness** — *Claude Code, Codex, Gemini CLI, Copilot CLI, Qwen Code, Pi*
The single most cross-cutting theme. Claude Code's Bypass mode still prompts (#103832); Gemini CLI's shell redirect extractor misses `N>`, `>|` forms (#16140) and non-UTF-8 byte paths (#16757); Copilot CLI's macOS sandbox denies localhost despite `allowLocalNetwork: true` (#5390); Codex is mid-migration from `SandboxPolicy` → `PermissionProfile`; Qwen adds a literal backstop for `git commit --amend` (#16075); Pi hardens Windows Git-diff permission bypass (#30095). **The need is uniform: user-configured permissions must be predictable and non-bypassable.**

**b) Compaction/context correctness** — *Claude Code, OpenCode, Codex, Gemini CLI*
Claude Code's compaction erodes standing instructions (#108601); OpenCode has two reproducible compaction bugs (tool output dropped, #62481; tool calls stringified, #50814); Codex updated retry/compaction policy (#60473). **Compaction is now a reliability-critical subsystem, not a token-saving convenience.**

**c) Subagent/worktree orchestration** — *Claude Code, Codex, Gemini CLI, Qwen Code*
Claude Code's `cwd`-for-Task request (#12748, year-old); Gemini CLI's subagent turn-limit misreporting (#22323) and generalist-agent hangs (#21409); Codex discussion threads on running alongside other agents in isolated worktrees (#58834, #60282); Qwen's subagent context bloat to 105k (#15660). **Worktree isolation and subagent observability are the emergent workflow.**

**d) Quota/usage opacity** — *Codex, OpenCode, Copilot CLI, Qwen Code*
Codex #41220 (85 comments) is the canonical quota tracker; OpenCode #59387 (339 comments!) is the community's complaint desk and #60311 documents shared-vs-per-model limit drift; Copilot CLI #5392 reports doubled prompt accounting spiking billing; Qwen optimizes GitHub channel API budget (#16690–#16692). **Users increasingly demand a trustworthy local ledger and conditional-request polling.**

**e) MCP friction** — *Codex, OpenCode, Copilot CLI, Pi, Gemini CLI*
Codex stdio MCP >16 MiB silent drops (#60383); OpenCode MCP OAuth refresh fragility (#63008/#63012); Copilot CLI Entra `/common` authority mismatch forcing per-session reauth (#5402); Pi's `tool_search` failing to surface direct MCP tools (#11921); Gemini CLI's >128 tools ⇒ HTTP 400 (#24246). **MCP moved from novelty to infrastructure, and its rough edges are now user-visible.**

**f) Remote/approval workflow automation** — *Codex, Copilot CLI, Pi*
Multiple independent Codex discussions (#60441 Tapproval/Apple Watch, #60116 Pushary/phone, #59121 agent-harness hooks) target structured remote approval; Copilot CLI's trusted-access linkage (#4322); Pi's `pi auth` standalone credential flow. **Approval is being decoupled from the terminal.**

---

## 4. Differentiation Analysis

| Tool | Focus | Target User | Technical Approach |
|---|---|---|---|
| **Claude Code** | Enterprise-grade harness with broadest surface (CLI, Desktop, mobile Remote Control, Cowork VM, browser) | Professional/enterprise devs | Anthropic-hosted models (Fable 5.2, 1M context); heavy Cowork/VM footprint; per-surface permission model |
| **Codex** | Windows Desktop + Computer Use flagship; Rust core with alpha-release discipline | Desktop-first devs, MCP integrators | Rust (`rust-v*` tags); `PermissionProfile` migration; heavy automated PR pipeline (copyberry bot) |
| **Gemini CLI** | Agent reliability & code intelligence; harness depth | Agent-runtime engineers, power users | AST-aware tooling roadmap (#22745); OS-sandbox proposals (#19873); aggressive `priority/p1` rollup triage |
| **Copilot CLI** | Enterprise/security posture on GitHub's platform | GitHub-centric enterprise teams | tgrep shared indexing, enumerate-only Windows FS grants, per-subdomain approvals, GHE data-residency features |
| **OpenCode** | Free-tier accessibility + open extensibility | Cost-sensitive individual devs, plugin authors | Free tier as loss-leader; GUI plugin architecture; embeddings stack being built (`@opencode/ai`) |
| **Pi** | TUI polish + durable execution + provider breadth | Terminal purists, local-model users | `pi-durable` execution layer, `pi-windows-*` zips, thin-provider-abstraction design |
| **Qwen Code** | Multi-surface (CLI/Desktop/SDK) + messenger/channel platform | APAC ecosystem, QQ/WeChat/DingTalk integrators | Channel-first architecture (WebShell), Tauri desktop, GitHub/Java CI lanes |

**Sharpest contrasts:**
- **Platform breadth vs. depth**: Claude Code owns the most surfaces but leaks the most bugs (Windows memory governor #92059, macOS permission prompts); Gemini CLI owns the narrowest surface but invests deepest in agent-internals correctness (silent success misreporting, hook crashes).
- **Enterprise vs. individual**: Copilot CLI and Claude Code optimize for compliance/security (token masking, role semantics); OpenCode and Qwen Code optimize for reach (free tier, chat-channel integrations).
- **TUI/durable vs. Desktop/Computer-Use**: Pi and OpenCode treat the terminal as the product; Codex and Copilot treat the desktop as the product.

---

## 5. Community Momentum & Maturity

**Tier 1 — High-velocity, mature platforms**
- **Gemini CLI**: highest raw activity today (50 issues + 38 PRs), disciplined `p1` rollups, but plagued by CI noise and long-lived silently-mis-succeeding subagent bugs.
- **Codex**: three alpha releases + 20 closed PRs in 24h; but **all PRs bot-authored and zero human PRs**, and the hottest issue is a month-old quota tracker — high throughput, lower community self-service signal.
- **Qwen Code**: coordinated CLI/Desktop/SDK release, strongest CI problem (6 top issues are CI failures), maintainer responsiveness to API-budget requests suggests a briefly-overextended but well-run operation.

**Tier 2 — Established with concentrated community pain**
- **Claude Code**: only one PR in 24h (though substantive), but four distinct Windows/macOS bug clusters and the highest-reaction security request in the dataset (passkey #84862, 171 👍). Community is loud; maintainer PR velocity is thin.
- **Copilot CLI**: 29 issues, zero PRs updated — healthy issue backlog, quiet merge cadence; strongest enterprise-specific feature stream (data-residency token masking, subdomain approval).
- **OpenCode**: #59387 alone has 339 comments — **the single largest community thread across all seven tools** — which is simultaneously a momentum signal and a reputational risk (free-tier crisis).

**Tier 3 — Niche but rapidly iterating**
- **Pi**: strongest human-authored PR throughput of the day (petrroll's Windows-fix wave), a 96-comment meta-thread signaling genuine investment in a platform (Windows) the maintainers are still deciding whether to own, and the fastest credential-UX fix (#11977 closed same-day). **Highest signal-to-noise of any tool today.**

**Maturity scoring (qualitative):** Gemini CLI and Codex have the most mature engineering pipelines; Claude Code has the most mature enterprise surface; Pi and OpenCode are the most responsive to individual contributors; Qwen Code has the most visible organizational strain (CI).

---

## 6. Trend Signals

**1. The connector/integration reliability gap is now the #1 shipping risk.**
Claude Code's Docs connector returns 403/404 (#108161); Codex Computer Use fails across localized Chrome (#54474, #59380); Copilot CLI's MCP Entra flow forces per-session reauth. **Shipping a connector that half-works now costs more trust than not shipping it.** For decision-makers: treat integration reliability SLAs (not feature lists) as the procurement differentiator.

**2. "Silent success" is the most dangerous agent failure mode.**
Gemini CLI's `Termination Reason: "GOAL"` on failure (#22323, #21983), Codex's premature task termination (#50771, #36596), and OpenCode's compaction dropping tool outputs (#62481) all confirm: **when the harness reports success but the work failed, automation becomes unusable.** Expect "verification hooks" and evidence-backed review skills (#58849) to become standard harness primitives.

**3. Quota trust is eroding faster than quota efficiency is improving.**
Copilot CLI's doubled prompt counting (#5392), OpenCode's shared-vs-per-model docs drift (#60311), and Codex's #41220 all point to the same conclusion: **users no longer trust provider accounting and are building their own ledgers** (cct #58359 in Codex discussions). Vendors that publish a verifiable local ledger will have a real moat.

**4. Windows remains the industry's neglected platform.**
Every single tool in this dataset has Windows-specific pain points — Claude Code's memory governor and Remote Control persistence, Codex's project loss and hidden taskbar, Copilot CLI's PowerShell hangs, OpenCode's renderer crashes and console spawning, Pi's 96-comment meta-thread and GitHub-detection regressions. **Windows users are systematically underserved across the field** — a real opening for whichever vendor commits first.

**5. Agent orchestration is formalizing.**
Pi's Redux/Saga proposal (#11984), Codex's worktree orchestrators (#58834, #60282), and Gemini CLI's unified-agent-loop request (#15327) all argue the same thing: **the community is outgrowing ad-hoc agent supervision and wants structured orchestration patterns** (sagas, handoff verification, receipts). Developers building adjacent tooling should target this gap now.

**6. Enterprise security reviews are becoming gating items.**
Copilot CLI's token masking under GHE data residency (#5388), trusted-access linkage (#4322), and browser-use plugin documentation for enterprise review (#5389) show that **enterprise procurement now requires the same audit trail that individual devs want for debugging.** Fields like "trusted access for cyber" and "audit-logged destructive actions" (OpenCode #63018) will become table-stakes.

**7. Bot-generated backlog is a growing ecosystem tax.**
Qwen Code's "provisional / no test identified" CI issues (#14724, #13078), Codex's all-bot PR stream, and Gemini CLI's maintainer-only rollups all indicate that **automated tooling is beginning to drown human signal**. The tools that invest in smart triage/budget-aware polling (Qwen's ETag PRs #16741) will keep contributor velocity where others lose it.

---

### Bottom Line for Technical Decision-Makers

- **Choose on reliability surfaces, not feature lists.** Every tool can now call tools, use MCP, and run subagents. What separates them is whether permissions are honored, compaction preserves semantics, and failures are reported honestly.
- **Gemini CLI and Codex** offer the most mature engineering cadence today; **Claude Code** offers the most enterprise surface; **Pi** is the best barometer for where the power-user community is heading (Windows, durable storage, TUI polish).
- **Watch two threads closely:** OpenCode #59387 (whether free-tier economics are sustainable) and the cross-vendor quota-accounting debates — the first vendor to ship a **verifiable, local usage ledger** will likely win durable developer trust in 2027.

---

## Per-Tool Reports

<details>
<summary><strong>Claude Code</strong> — <a href="https://github.com/anthropics/claude-code">anthropics/claude-code</a></summary>

## Claude Code Skills Highlights

> Source: [anthropics/skills](https://github.com/anthropics/skills)

# Claude Code Skills — Community Highlights Report
*Data as of 2026-11-10 | Source: github.com/anthropics/skills*

---

## 1. Top Skills Ranking (by PR attention)

> Note: The dataset does not expose per-PR comment counts (all `Comments: undefined`), so ranking below reflects overall community attention inferred from issue linkage, revision activity, ecosystem discussion, and topical salience.

**1. mcp-builder — MCP v2 compatibility fix**
- **Function:** Generates MCP (Model Context Protocol) servers; the failing script is the connection helper.
- **Highlights:** Fixes #1668. Adapts to the `mcp>=2.0.0` rename of `streamablehttp_client` → `streamable_http_client` and the new `create_mcp_http_client` header pattern. Touches the most plumbing-sensitive part of the Skills stack (MCP transport), so it has broad downstream impact.
- **Status:** OPEN (created 2026-09-08, last updated 2026-10-08)
- **Link:** https://github.com/anthropics/skills/pull/1742

**2. skill-creator — Trigger-eval isolation & cross-platform fixes**
- **Function:** The meta-skill that teaches Claude to author and evaluate other skills.
- **Highlights:** Addresses false-miss/negative-pass scoring in trigger evals from per-worker probe competition, Windows `select()` on subprocess pipes, and unrelated tool interference. Directly tied to the contested Issue #556 (0% trigger rate) and #1352 (UUID cross-matching).
- **Status:** OPEN (2026-06-10 → 2026-09-16)
- **Link:** https://github.com/anthropics/skills/pull/1298

**3. notion-spec-to-implementation + quantitative-resume-auditor (dual-skill PR)**
- **Function:** Transforms Notion specs into implementable task breakdowns; plus a resume-auditing skill.
- **Highlights:** One of the few PRs bundling two new community skills. The Notion spec-to-task flow is a rare "PM-to-agent" bridge, which is a high-demand workflow direction.
- **Status:** OPEN (2026-06-02 → 2026-10-15)
- **Link:** https://github.com/anthropics/skills/pull/1245

**4. docx — Timeout & revision-mark verification fix**
- **Function:** Word document generation/editing.
- **Highlights:** Fixes a false-success bug where `soffice` timeouts were reported as successful; adds verification that `w:ins`/`w:del`/`w:moveFrom`/`w:moveTo` revision marks were actually cleared. Relevant to the broader docx correctness cluster (see Issue #2018 on invalid merged-run XML).
- **Status:** OPEN (2026-09-19 → 2026-11-01)
- **Link:** https://github.com/anthropics/skills/pull/1792

**5. webapp-testing — Security hardening (`shell=True` removal)**
- **Function:** End-to-end testing of web apps via scripted browser/server flows.
- **Highlights:** Removes `subprocess.Popen(..., shell=True)` in `with_server.py`, closing a CWE-78 command-injection vector when agent/user command strings flow into a system shell. Signals that the community is starting to audit shipped skills for security, not just features.
- **Status:** OPEN (2026-10-06 → 2026-11-01)
- **Link:** https://github.com/anthropics/skills/pull/1980

**6. pyxel — Retro game development**
- **Function:** Building/debugging/verifying Pyxel retro games in Python, with headless input-driven runs and frame inspection.
- **Highlights:** One of the longest-lived open PRs (since March 2026). Stands in for the "creative/indie dev" category that otherwise has little representation in the official set.
- **Status:** OPEN (2026-03-05 → 2026-11-01)
- **Link:** https://github.com/anthropics/skills/pull/525

**7. xlsx — External link resolution in `recalc.py`**
- **Function:** Excel spreadsheet recalculation and external-reference risk detection.
- **Highlights:** Fixes #2013 — `external_links_at_risk` only inspected workbook-level defined names, missing worksheet-scoped aliases and indirect references, producing false negatives on formulas pointing at external workbooks.
- **Status:** OPEN (2026-10-14 → 2026-11-03)
- **Link:** https://github.com/anthropics/skills/pull/2019

**8. md2video-audio / proofcore-contract-auditor (emerging long-tail)**
- **Function:** Markdown → MP4 with TTS voiceover via Marp; and Solidity/Rust static analysis with TON blockchain audit anchoring.
- **Highlights:** Illustrate the two fastest-growing long-tail categories: media generation and Web3/smart-contract auditing. Both are self-contained, single-purpose skills — exactly the pattern the community is now favoring.
- **Status:** OPEN
- **Links:** https://github.com/anthropics/skills/pull/1703 · https://github.com/anthropics/skills/pull/1771

---

## 2. Community Demand Trends (from Issues)

Ranked by comment volume and 👍 signal:

| Trend | Signal Issue | What the community wants |
|---|---|---|
| **Namespace trust & provenance** | [#492](https://github.com/anthropics/skills/issues/492) (46💬, 3👍) | Stop community skills from shipping under `anthropic/`; users may grant elevated permissions to non-official skills. Comments are highest in the entire tracker — this is the #1 concern. |
| **Org-wide skill distribution** | [#228](https://github.com/anthropics/skills/issues/228) (17💬, 8👍) | Shared skill libraries inside a Claude.ai org instead of manually emailing `.skill` files. High 👍 ratio = strong product intent. |
| **Skill-trigger truthfulness** | [#556](https://github.com/anthropics/skills/issues/556) (13💬, 7👍) | `run_eval.py` reports 0% trigger rate with `claude -p`; the eval harness itself is unreliable. Corroborated by [#1352](https://github.com/anthropics/skills/issues/1352) (multi-worker UUID cross-match). |
| **Context budget** | [#1487](https://github.com/anthropics/skills/issues/1487) (5💬) | `claude-api` eagerly injects ~156k tokens, blowing the context window in one tool call. Demand for lazy/progressive SKILL.md loading. |
| **Tooling/governance skills** | [#412](https://github.com/anthropics/skills/issues/412), [#1385](https://github.com/anthropics/skills/issues/1385), [#1329](https://github.com/anthropics/skills/issues/1329) | Agent-governance patterns, a three-gate "reasoning quality" pipeline, and a symbolic compact-memory notation. All are meta-workflow / agent-reliability proposals. |
| **Skill-authoring best practice** | [#202](https://github.com/anthropics/skills/issues/202) (CLOSED, 8💬) | `skill-creator` reads like developer docs; wants concise, operational, token-efficient instructions. |
| **Descriptions that say *when*, not just *what*** | [#2064](https://github.com/anthropics/skills/issues/2064) | Frontmatter descriptions must be trigger-oriented, not feature-oriented. |

**Distilled new-Skill directions the community most wants:**
1. Security & provenance tooling (namespace verification, permission auditing)
2. Quality-gate / reasoning-verification pipelines
3. Memory & context compression
4. Spec → implementation workflow automation
5. Reliability fixes to *existing* bundled skills (docx, xlsx, webapp-testing, skill-creator)

---

## 3. High-Potential Pending Skills (Open PRs, active within last ~30 days)

These are unmerged but have strong momentum and low merge risk (small, verifiable fixes):

1. **PPTX — `--cols` input validation** ([#1975](https://github.com/anthropics/skills/pull/1975)) — Fail-fast argparse instead of a ValueError after LibreOffice render.
2. **webapp-testing — element discovery fix** ([#1976](https://github.com/anthropics/skills/pull/1976)) — `textarea`/`select` were misreported as `text`.
3. **algorithmic-art — `wrapAround()` correctness** ([#1977](https://github.com/anthropics/skills/pull/1977)) — Modulo wraps negatives into `[0, max)`; fixes #1897.
4. **skill-creator — YAML frontmatter parsing** ([#1997](https://github.com/anthropics/skills/pull/1997)) — Preserve quoted scalars and escaped characters through eval/optimization.
5. **pdf — case-sensitive file references** ([#538](https://github.com/anthropics/skills/pull/538)) — `REFERENCE.md`/`FORMS.md` → lowercase; breaks on Linux/macOS.
6. **claude-api — dead documentation URLs** ([#1730](https://github.com/anthropics/skills/pull/1730)) — 3 hard-404s verified by `curl -sI -L`.
7. **docs — clarify document-skills snapshot status** ([#2108](https://github.com/anthropics/skills/pull/2108)) — Explains the sync relationship to `~/.claude/skills/synced/`; resolves confusion behind Issue #189 (duplicate skills).
8. **scnet-hpc — HPC cluster operations** ([#1615](https://github.com/anthropics/skills/pull/1615)) — Slurm + SSH profiles; a niche but well-scoped new skill.

**Best merge bets:** #1975, #1976, #1977 (each a one-line-logic fix tied to a filed issue, by an author with a clean PR cluster) and #1730 (documentation-only).

---

## 4. Skills Ecosystem Insight

> **The community's most concentrated demand is trust and correctness of the skill harness itself — not more skills:** users are loudly asking for namespace/provenance integrity, reliable trigger evaluation, and bounded context injection, which together determine whether any skill can be safely discovered and executed at all.

---

# Claude Code Community Digest — 2026-11-10

## 1. Today's Highlights

Two releases landed: **v2.1.322** adds Vertex fast mode across global/US/EU regions, while **v2.1.321** introduces **Claude Fable 5.2** as the new default Fable model (1M context, $8/$40 per Mtok) and a `--settings <file>` flag for `claude remote-control`. On the issue tracker, the highest-engagement item remains the passkey/WebAuthn sign-in request (#84862, 171 👍), and a cluster of permission-handling bugs on macOS and Windows continues to dominate activity.

## 2. Releases

**v2.1.322**
- Added fast mode on Vertex in global, US, and EU regions, with automatic fallback to standard speed if Vertex refuses the request.

**v2.1.321**
- Added **Claude Fable 5.2** (`claude-fable-5-2`) — now the default Fable model. 1M context window, $8/$40 per Mtok, $0.20/Mtok cache reads.
- Added `--settings <file>` to `claude remote-control`, applying a settings file to every session it launches (note: mid-run file changes do not apply to new sessions, per the truncated changelog).

## 3. Hot Issues

1. **[#84862](https://github.com/anthropics/claude-code/issues/84862)** — *Passkey (WebAuthn) sign-in across every surface* (33 comments, 171 👍). Long-running top-voted enhancement; consensus is that password-based auth is the weakest link in Claude's account security story.
2. **[#93201](https://github.com/anthropics/claude-code/issues/93201)** — *Built-in browser ignores Allowed sites for internal hostnames* (24 comments, 37 👍). macOS Cowork browser prompts on every action for `*.habifino.local` with "site-level permissions disabled" — a serious blocker for private-network workflows.
3. **[#12748](https://github.com/anthropics/claude-code/issues/12748)** — *Add `cwd` parameter to Task tool for Git worktrees* (19 comments, 30 👍). A year-old request still drawing attention; subagent worktree isolation remains awkward without it.
4. **[#56089](https://github.com/anthropics/claude-code/issues/56089)** — *Configurable VM bundle (vhdx) storage location on Windows* (17 comments, 62 👍). High-reaction request driven by disk-space pain from Cowork's VM image placement.
5. **[#103832](https://github.com/anthropics/claude-code/issues/103832)** — *Bypass mode still prompts on `start_session`* (12 comments, 19 👍). Regression: `mcp__ccd_session__start_session` now needs two approvals even in Bypass — direct violation of the mode's contract.
6. **[#100114](https://github.com/anthropics/claude-code/issues/100114)** — *Windows: Remote Control not restored after relaunch* (10 comments). Sessions silently archive on mobile after desktop restarts; Remote Control state persistence is unreliable.
7. **[#108161](https://github.com/anthropics/claude-code/issues/108161)** — *Docs connector output unreachable to the session* (4 comments). Docs created via the connector can't be read back (403/404), and `@Claude` comments never arrive — the connector loop is broken end-to-end.
8. **[#108601](https://github.com/anthropics/claude-code/issues/108601)** — *Orchestrator ignores standing instructions across compactions* (3 comments). A notable long-form report: an "oversee only" session repeatedly intervenes across Opus 5.5 and Fable 5.1, suggesting compaction erodes persistent directives.
9. **[#92059](https://github.com/anthropics/claude-code/issues/92059)** — *Windows memory governor evicts "0 of 0" idle sessions; app hits 12.4 GB RSS* (3 comments). Desktop app grows unbounded with 15+ live sessions and requires force-kill — a stability red flag.
10. **[#108692](https://github.com/anthropics/claude-code/issues/108692)** — *CLI spins a full core after project `.claude` dir deletion* (1 comment, same day). Hot-off-the-press watcher-loop bug on 2.1.321, explicitly linked to prior closed-but-unresolved reports (#77983).

Also worth noting: **#107895** (Windows "computer use" toggle greyed out) and **#96858** (worktree fetch leaves ssh consuming keystrokes) both closed today.

## 4. Key PR Progress

Only one PR was updated in the last 24h, but it's substantive:

1. **[#89404](https://github.com/anthropics/claude-code/pull/89404)** — *validate-agent.sh: don't abort at the first warning; stop false-flagging valid agents*. Fixes public issue #83803. Addresses three `set -euo pipefail` interactions in the plugin-dev skill's validator: early abort on `((warning_count++))`, arithmetic-expression exit codes, and false positives on valid agent files. Authored by **bcherny** (Anthropic). No other PRs were updated in the window, so the remaining nine slots are omitted rather than padded.

## 5. Hot Discussions

No Discussion data was provided for this window; this section is omitted.

## 6. Feature Request Trends

- **Authentication & identity**: Passkey/WebAuthn sign-in (#84862) is the single highest-signal request on the tracker. Adjacent friction (rooted-device Google sign-in failures, #105770) reinforces that auth is a top community priority.
- **Desktop/Code-tab UX**: Recurring asks for hierarchical session organization (#107889), configurable voice-dictation shortcuts (#97929), and prompt-draft persistence in VS Code (#102536). The Code tab is now a first-class surface and users want it to behave like one.
- **Platform hygiene**: Configurable VM storage on Windows (#56089) and project-level agent management in the terminal (#103130) reflect demand for better multi-project and multi-environment ergonomics.
- **Worktree/agent orchestration**: The `cwd` parameter for the Task tool (#12748) and mod annotations for background-subagent token counts (#105934) point to a maturing subagent workflow that the tooling hasn't fully caught up with.

## 7. Developer Pain Points

1. **Permissions that don't respect their own settings** — The dominant theme this week: Bypass mode prompting anyway (#103832), Allowed-sites being ignored for private hostnames (#93201, duplicated in #108683), and non-deterministic auto-mode classifier blocks (#97559). Users can't predict when Claude will or won't ask.
2. **Session state loss and lifecycle bugs** — Remote Control not restoring after relaunch (#100114), sessions archived on mobile, and memory-governor failures (#92059) make the desktop/mobile handoff feel fragile.
3. **Resource leaks and runaway processes** — The CPU-spin watcher loop (#108692, recurring from #77983/#105715), 12.4 GB RSS growth, and the Linux SIGILL/SIGSEGV crashes in the JSC GC thread (#91914) form a cluster of reliability concerns, especially on Windows and native Linux builds.
4. **Instruction persistence across compaction** — #108601's detailed report of orchestrator sessions violating explicit standing instructions across compactions suggests a systemic model-behavior issue that users are tracking carefully.
5. **Connector/integration dead-ends** — The Docs connector producing unreachable artifacts (#108161) and Claude-in-Chrome failing in Dia (#107630) show integration surfaces shipping ahead of their reliability.

</details>

<details>
<summary><strong>OpenAI Codex</strong> — <a href="https://github.com/openai/codex">openai/codex</a></summary>

# OpenAI Codex Community Digest — 2026-11-10

## 1. Today's Highlights

The Codex project shipped three alpha releases (`rust-v0.169.0-alpha.7`, `.6`, and `rust-v0.167.0-alpha.4.1`) while the issue tracker remains dominated by Windows Desktop regressions and quota/usage-accounting concerns. A large batch of `copyberry[bot]` PRs landed today, focused on hardening error classification (terminal vs. retryable errors), telemetry/sandbox refactors, and MCP trace context. Meanwhile, the community's most active thread (#41220) continues tracking abnormal quota depletion with 85 comments.

---

## 2. Releases

Three alpha releases were published (no detailed changelogs beyond version bumps):

- **rust-v0.169.0-alpha.7** — [Release](https://github.com/openai/codex/releases)
- **rust-v0.169.0-alpha.6** — [Release](https://github.com/openai/codex/releases)
- **rust-v0.167.0-alpha.4.1** — [Release](https://github.com/openai/codex/releases)

These are incremental alpha builds on the 0.169 and 0.167 lines; no breaking-change notes were provided. Developers on `0.167.0-alpha.3.2` should be aware that several of today's PRs (error handling, sandbox telemetry) target these channels.

---

## 3. Hot Issues

1. **[#41220](https://github.com/openai/codex/issues/41220) — [Meta] Abnormal Codex usage/quota depletion tracker** (85 comments, 👍21)
   Cross-report tracker consolidating many user-visible quota/accounting inconsistencies. It has become the canonical thread for users suspecting credits drain faster than token evidence predicts — the single highest-signal billing concern in the repo.

2. **[#59895](https://github.com/openai/codex/issues/59895) — Windows: local projects disappear after app update / account switch** (43 comments, 👍16)
   After updating the Windows package and switching back to a personal account, all local projects vanish. High comment volume indicates broad reproducibility and data-loss severity.

3. **[#47270](https://github.com/openai/codex/issues/47270) — [Desktop][Browser Use] No ChatGPT browser route for tab discovery** (23 comments)
   Desktop Browser Use cannot discover or control any Chrome/built-in browser tabs. Blocks a flagship Computer Use workflow on macOS.

4. **[#50728](https://github.com/openai/codex/issues/50728) — macOS Computer Use typing/paste duplication + 16–56s latency** (19 comments)
   Keystroke duplication and severe event-tap latency in Claude Desktop and Opera. Includes a read-only CoreGraphics tap inspection, giving it strong diagnostic value.

5. **[#50771](https://github.com/openai/codex/issues/50771) — Codex stops or loses the task before completion** (19 comments, 👍19)
   Model-behavior bug where Codex says it will continue, then ends the turn. High upvote count signals this is a widespread autonomy/reliability complaint.

6. **[#36596](https://github.com/openai/codex/issues/36596) — Codex terminates autonomous work despite "continue until done"** (18 comments, 👍7)
   Closely related to #50771; a long-running (since August) complaint about premature turn termination in autonomous mode.

7. **[#45369](https://github.com/openai/codex/issues/45369) — Windows auto-hidden taskbar cannot be revealed when ChatGPT Desktop is maximized** (17 comments)
   A UI/OS-integration regression that traps users out of the taskbar — small bug, high daily-friction impact.

8. **[#51049](https://github.com/openai/codex/issues/51049) — [Windows][dots] AbsolutePathBuf deserialization failure on follow-up** (17 comments)
   Server-side path-handling bug (`AbsolutePathBuf deserialized without a base path`) breaks follow-ups to dot-created tasks. Notable as an app-server/runtime-level defect rather than pure UI.

9. **[#49608](https://github.com/openai/codex/issues/49608) — Windows: cannot create Cloud Work task, Send stays disabled** (16 comments)
   Functional blocker for Cloud Work on Windows Desktop with no error surfaced, making self-diagnosis impossible.

10. **[#60383](https://github.com/openai/codex/issues/60383) — Stdio MCP replies >16 MiB silently dropped, 300s hang** (4 comments)
    New and technically precise: oversized MCP responses are dropped silently, hanging MCP App requests. Likely a critical one for MCP integrators building large-context tools.

---

## 4. Key PR Progress

All 20 listed PRs share the `copyberry[bot]` author and are marked `[CLOSED]`. Highlights by thematic cluster:

**Error Classification & Retry Semantics**
1. **[#60511](https://github.com/openai/codex/pull/60511) — Treat inference hook denials as terminal errors** — denials from workspace inference hooks now halt retries and compaction fallback.
2. **[#60482](https://github.com/openai/codex/pull/60482) — Consistent context-length error handling across transports** — HTTP 400 `context_length_exceeded` now routes into context-window recovery; streaming failures end immediately.
3. **[#60480](https://github.com/openai/codex/pull/60480) / [#60479](https://github.com/openai/codex/pull/60479) / [#60476](https://github.com/openai/codex/pull/60476) / [#60475](https://github.com/openai/codex/pull/60475)** — A coordinated sweep making workspace-access denial, content-policy violation, access-program denial, and invalid-workspace errors non-retryable.

**Compaction & Context**
4. **[#60473](https://github.com/openai/codex/pull/60473) — Respect error retry policy during local compaction** — honors server `Retry-After` instead of blind local backoff.
5. **[#60487](https://github.com/openai/codex/pull/60487) — Enable untrusted context tool outputs by default** — browser context/goal objectives now reach the model as `function_call_output` items.

**MCP & gRPC**
6. **[#60506](https://github.com/openai/codex/pull/60506) — Preserve MCP trace context when tracing is disabled** — W3C trace context carried even without an OTel layer.
7. **[#60505](https://github.com/openai/codex/pull/60505) — Trace MCP refresh causes and plugin metadata changes** — adds `McpRefreshReason` logging.
8. **[#60496](https://github.com/openai/codex/pull/60496) — Preserve typed gRPC code-mode session admission errors** — callers can now inspect terminal admission status.
9. **[#60488](https://github.com/openai/codex/pull/60488) — Remove Xcode 26.4 MCP elicitation workaround** — routes elicitations through standard paths.

**Sandbox / Permissions / Build**
10. **[#60500](https://github.com/openai/codex/pull/60500) — Derive sandbox telemetry labels from permission profiles** and **[#60472](https://github.com/openai/codex/pull/60472) — Serialize default thread permissions as a permission profile** — part of a migration away from legacy `SandboxPolicy` toward `PermissionProfile`. Also notable: **[#60507](https://github.com/openai/codex/pull/60507) — Hermetic LLVM for Windows MSVC Bazel builds**, improving cross-compile reproducibility.

---

## 5. Hot Discussions

### Show and tell (most active)

1. **[#58359](https://github.com/openai/codex/discussions/58359) — cct: Codex 5-hour/weekly limits on the Windows taskbar** (<1 MB, open source) — surfaces `/status` quota directly in the taskbar. Directly relevant to the #41220 quota anxiety.

2. **[#59121](https://github.com/openai/codex/discussions/59121) — agent-harness: skills, rules and Stop hooks to make Codex finish the job** — community-built harness targeting the exact "agent stops early" behavior reported in #50771/#36596.

3. **[#58849](https://github.com/openai/codex/discussions/58849) — code-review-skill: evidence-backed review with a JSON merge gate** — every finding points to a location, contract/path, and severity; four fresh-context probes.

4. **[#60441](https://github.com/openai/codex/discussions/60441) — Tapproval: approve Codex actions from an Apple Watch, with risk annotation** — hook-based remote approval via `hooks.json`.

5. **[#60116](https://github.com/openai/codex/discussions/60116) — Pushary: answer Codex approvals from your phone / forward git push to a team lead** — paid hosted service via native hooks + MCP server.

6. **[#60185](https://github.com/openai/codex/discussions/60185) — agent-recap: local search across Codex and Claude Code transcripts** — no account/upload; searches JSONL transcripts in-browser.

7. **[#58834](https://github.com/openai/codex/discussions/58834) — Friday: run Codex next to Claude Code and Cursor, each in its own git worktree** — MIT-licensed desktop orchestrator.

8. **[#60282](https://github.com/openai/codex/discussions/60282) — Worktree receipt: detect local-file drift when Git status is clean** — targets handoff gaps between identical commits.

9. **[#60358](https://github.com/openai/codex/discussions/60358) — 10 MIT-licensed habits for running Codex safely** — practical unattended-agent guardrails.

10. **[#54474](https://github.com/openai/codex/discussions/54474) — Windows Computer Use repair for Korean Chrome URL detection** — version-bound fix community-published alongside a bug report; notable localization workaround.

### Q&A
- **[#60409](https://github.com/openai/codex/discussions/60409) — How can I safely investigate a blocked Windows inspection?** — read-only inspection blocked for "possible telemetry to an unverified destination" with no command/destination/process identified. Highlights telemetry-opacity pain.

---

## 6. Feature Request Trends

- **Multi-select / bulk task management** — [#46587](https://github.com/openai/codex/issues/46587) requests multi-select archive/unarchive/delete for conversations and tasks.
- **Remote session attachment** — [#21886](https://github.com/openai/codex/issues/21886) (closed) requests importing existing remote CLI sessions into App projects, reflecting demand for App↔CLI session continuity.
- **API-key / custom-model parity** — [#27940](https://github.com/openai/codex/issues/27940) wants fast mode available in Desktop/VSCode when using API auth, not just CLI.
- **Third-party composer integrations** — [#26726](https://github.com/openai/codex/issues/26726) wants Grammarly for Mac support restored in the macOS composer.
- **Approval workflow automation** — Discussions #60441, #60116, and #59121 all independently target remote/structured approval of agent actions.
- **Cross-agent worktree orchestration** — Discussions #58834 and #60282 show a trend toward running Codex alongside other agents in isolated worktrees with handoff verification.

---

## 7. Developer Pain Points

1. **Quota and usage accounting opacity** — #41220 (85 comments) and the popularity of quota-watching tools like #58359 show persistent distrust in credit accounting; users lack a trustworthy local ledger.
2. **Windows Desktop is the dominant regression surface** — storage/project loss (#59895), taskbar behavior (#45369), Cloud Work creation (#49608), XLSX sends spinning (#58432), SSH auto-connect (#59931), MXC sandbox directory leaks (#55046), and API-key fork failures (#59308). Windows-specific issues occupy a majority of the hottest list.
3. **Computer Use reliability** — typing duplication and 16–56s latency (#50728), screenshot timeouts (#58773, #59422), browser URL detection failures (#59380), and Korean-locale URL detection (#54474) collectively suggest Computer Use is still fragile across localized environments.
4. **Premature task termination / autonomy loss** — #50771 and #36596 are two high-visibility threads about the agent ending turns before completing work, and community harnesses (#59121, #60358) exist precisely to compensate at the prompt/hook layer.
5. **Session and organizational state loss** — account switching wipes sidebar organization (#60364), project associations disappeared post-update (#59895) with manual recovery (#60360), and worktree icons vanished (#57620). State durability across updates/accounts is a repeat theme.
6. **Auth/pairing friction for CLI and API-key users** — headless Linux Remote pairing failure (#60348), Android Remote nav issues (#42489), and fork failures for non-ChatGPT sign-ins (#59308) indicate follow-on auth flows lag the CLI's API-key story.
7. **Silent failures without diagnostics** — MCP >16 MiB drops (#60383), disabled Send buttons (#49608), and unattributed telemetry blocks (#60409) all share a missing-error-message pattern that forces users into guesswork.

---

*All links reference `openai/codex` on GitHub. Issue/PR numbers and counts reflect data as of 2026-11-10.*

</details>

<details>
<summary><strong>Gemini CLI</strong> — <a href="https://github.com/google-gemini/gemini-cli">google-gemini/gemini-cli</a></summary>

# Gemini CLI Community Digest — 2026-11-10

## 1. Today's Highlights

No new releases landed in the last 24 hours, but issue and PR activity remains high with 50 updated issues and 38 updated PRs. The dominant theme is **agent reliability**: subagent turn-limit handling, generalist agent hangs, and browser-agent failures continue to generate maintainer-only, `priority/p1` rollup work. Meanwhile, a large batch of PRs targeting Windows Git safety, IDE companion lifecycle bugs, and headless abort handling moved toward closure.

## 2. Releases

No new releases in the last 24 hours.

## 3. Hot Issues

1. **[#22323](https://github.com/google-gemini/gemini-cli/issues/22323) — Subagent MAX_TURNS reported as GOAL success** (`p1`, 13 comments)
   `codebase_investigator` reports `status: "success"` / `Termination Reason: "GOAL"` despite hitting the max-turn limit before doing any analysis. This silently masks agent interruption — a correctness bug for anyone relying on subagent results in automation. Highest-comment item today.

2. **[#21409](https://github.com/google-gemini/gemini-cli/issues/21409) — Generalist agent hangs forever** (`p1`, 8 comments, 👍 8)
   Deferring to the generalist agent hangs indefinitely even on trivial tasks like folder creation. Users confirm that disabling subagent deferral works around it. Strong community signal (8 upvotes) on a foundational blocker.

3. **[#19873](https://github.com/google-gemini/gemini-cli/issues/19873) — Zero-dependency OS sandboxing + post-execution intent routing** (`p2`, 9 comments)
   Proposal to let Gemini 3 lean into its native bash affinity (`grep`/`sed`/`awk` chains) under an OS sandbox instead of restrictive tool wrappers. A significant architectural direction for the agent runtime.

4. **[#22745](https://github.com/google-gemini/gemini-cli/issues/22745) — AST-aware file reads, search, and codebase mapping** (`p2`, 7 comments)
   EPIC evaluating whether AST-aware tooling reduces wasted turns and token noise in codebase exploration. Directly tied to the `codebase_investigator` improvement line of work.

5. **[#21968](https://github.com/google-gemini/gemini-cli/issues/21968) — Gemini doesn't use skills/subagents enough** (`p2`, 7 comments)
   Anecdotal but widely relatable: the model ignores custom skills and subagents unless explicitly instructed. Points at a routing/selection gap rather than a capability gap.

6. **[#22267](https://github.com/google-gemini/gemini-cli/issues/22267) — Browser Agent ignores `settings.json` overrides** (`p2`, 5 comments)
   `maxTurns` and other settings are correctly merged by `AgentRegistry` but never applied by the Browser Agent — a config-plumbing bug that undermines user trust in settings.

7. **[#24246](https://github.com/google-gemini/gemini-cli/issues/24246) — 400 error with >128 tools** (`p2`, 3 comments)
   Tool-count scaling limit becomes visible as extensions and MCP servers accumulate. Needs smarter in-scope tool selection rather than a hard failure.

8. **[#22672](https://github.com/google-gemini/gemini-cli/issues/22672) — Agent should discourage destructive behavior** (`p2`, 3 comments, 👍 1)
   Occasional `git reset` / `--force` on complex git operations when safer paths exist, plus risky DB modifications. Safety-adjacent UX concern raised by a maintainer.

9. **[#22186](https://github.com/google-gemini/gemini-cli/issues/22186) — Output hook causes crash** (`p1`, 3 comments)
   CLI crashes near the end of printing an output summary. Reproducible crash in a high-visibility code path.

10. **[#21983](https://github.com/google-gemini/gemini-cli/issues/21983) — Browser subagent fails on Wayland** (`p1`, 4 comments, 👍 1)
    Linux/Wayland users see Browser Agent terminate with `GOAL` despite failure — same misleading-success pattern as #22323.

## 4. Key PR Progress

1. **[#30095](https://github.com/google-gemini/gemini-cli/pull/30095) — Prevent Windows Git diff permission bypass** (`p1`, security)
   Shared Git safety helpers now applied consistently on Windows; dangerous args can no longer masquerade as read-only. Important hardening.

2. **[#30211](https://github.com/google-gemini/gemini-cli/pull/30211) — `read-many-files` only inlines explicitly requested binaries** (`p1`, closed)
   Stops base64-inlining images/PDFs/audio matched incidentally by directory globs — a real context-bloat and cost fix.

3. **[#30185](https://github.com/google-gemini/gemini-cli/pull/30185) — Prevent recursive interactive sessions in shell mode** (`p1`, closed)
   Blocks spawning nested interactive `gemini` from `!` shell mode or the `[Shell]` tool, and rejects unsupported config subcommands.

4. **[#30164](https://github.com/google-gemini/gemini-cli/pull/30164) — Resolve folder trust before macOS Seatbelt sandbox** (`p1`, closed)
   Fixes `trustedFolders.json` access being denied inside the sandbox, completing the fix chain from #28598/#30143.

5. **[#30204](https://github.com/google-gemini/gemini-cli/pull/30204) — Kill child processes and preserve signal exit codes on headless abort** (`closed`)
   SIGTERM/SIGINT/SIGHUP during `-p` runs now terminate detached process groups and PTYs instead of leaking them.

6. **[#30212](https://github.com/google-gemini/gemini-cli/pull/30212) — Configurable per-tool-call timeout** (`p3`, help wanted)
   New `tools.callTimeout` setting surfaces timeouts as recoverable `TOOL_CALL_TIMEOUT` errors so the model can adapt rather than stall.

7. **[#30109](https://github.com/google-gemini/gemini-cli/pull/30109) — Cap `grep_search` output size** (`p2`, help wanted)
   Match count caps didn't limit line size; broad searches could emit ~150K characters. This trims context and nudges the model to narrow queries.

8. **[#30210](https://github.com/google-gemini/gemini-cli/pull/30210) — Stop WebFetch fallback after cancellation**
   Cancelled fetches no longer continue through fallback URL attempts — fixes #30099.

9. **[#30214](https://github.com/google-gemini/gemini-cli/pull/30214) — Recognize TortoiseGitPlink as PuTTY-family SSH client**
   Ensures `-batch` is injected instead of OpenSSH's `-o BatchMode=yes`, fixing hardened Git SSH on Windows for TortoiseGit users.

10. **[#30104](https://github.com/google-gemini/gemini-cli/pull/30104) — Refresh slash commands after `/skills link`** (`p2`, help wanted)
    Re-discovers skills so `/<skill-name>` works immediately after linking, closing a rough edge in the skills workflow.

## 5. Hot Discussions

No discussion data was provided in this dataset.

## 6. Feature Request Trends

- **AST-aware code intelligence**: Multiple linked issues (#22745, #22746, #22747) pursue AST-based reads, search, and codebase mapping — "tilth" and "glyph" named as candidate CLI tools, plus AST-grep as a robust query-based alternative.
- **Subagent observability & configuration**: Trajectory visibility via `/chat share` (#22598), subagent context in bug reports (#21763), settings-based discovery (#18285), and per-workspace policy (#18397).
- **Persistent task tracking**: Replacing in-context `WriteToDo` with file-based CRUD task tracking (#18836) to combat context rot and cross-session amnesia.
- **Parallel/shared-memory subagents** (#18287) — currently blocked pending parallel subagent support.
- **Self-awareness**: The agent should accurately describe its own flags, hotkeys, and invocation patterns (#21432).
- **Curated in-repo agent examples** (#18283) and **Local Subagent Sprint 1** (#20195) signal an investment phase in the subagent ecosystem.

## 7. Developer Pain Points

1. **Silent or misleading agent failures.** The recurring `status: "success"` / `Termination Reason: "GOAL"` pattern (#22323, #21983) hides real failures behind a success label — the single most damaging theme for trust in agent output.
2. **Hangs and stalls.** Generalist agent hangs (#21409, 8 👍) and interactive-prompt deadlocks during `vite` scaffolding (#22465) block common workflows.
3. **Configuration that doesn't apply.** Browser Agent ignoring `settings.json` (#22267) and symlinked agent files going unrecognized (#20079) make configuration feel unreliable.
4. **Workspace pollution.** The model scattering temp scripts across directories (#23571) creates cleanup overhead before every commit.
5. **Safety-adjacent command use.** Occasional `git reset`/`--force` and risky DB operations (#22672) push toward Windows-specific guard PRs like #30095.
6. **Scaling limits.** Tool-count 400 errors (#24246) and oversized grep/search payloads (#30109) show the harness still struggles as extensions and context grow.
7. **Platform rough edges.** Wayland browser failures, macOS Seatbelt trust resolution, and a cluster of Windows Git/SSH issues (#30214) dominate platform bug traffic.

</details>

<details>
<summary><strong>GitHub Copilot CLI</strong> — <a href="https://github.com/github/copilot-cli">github/copilot-cli</a></summary>

# GitHub Copilot CLI Community Digest — 2026-11-10

## 1. Today's Highlights

The Copilot CLI shipped two releases in the last 24 hours: **v1.0.109-0** tightens local file sharing safety (symlink confirmation for `/share` and `/export`) and refines permission prompts for read-only shell scripts and subdomain approvals. **v1.0.108** introduces Windows enumerate-only directory grants, `/index` commands, and shared tgrep indexing. Issue activity remains high (29 items), with notable clusters around sandboxing, MCP auth, sessions/subagents, and billing/usage anomalies.

---

## 2. Releases

**v1.0.109-0** ([repo](https://github.com/github/copilot-cli))
- Improved: Confirmation prompt before `/share` or `/export` follows symlinks when saving local files.
- Improved: URL permission prompts now support approving **every subdomain** for the current session.
- Improved: Read-only shell scripts request permission less often; scripts that mutate git refs or read files via `hid*` still prompt.

**v1.0.108** (2026-11-09)
- Added `sandbox.userPolicy.filesystem.enumeratePaths` in `settings.json` for Windows enumerate-only directory grants.
- Added `/index` commands; managed shared tgrep indexing now enabled by default for eligible repositories.
- Fixed: PDF attachments on Grok 4.7 and Grok 4.6 fall back to file references.

---

## 3. Hot Issues (Top 10)

1. **#5320 — OSC 7501 agent-status reporting (CLOSED, 👍11)** — Request for Program Status Protocol support so terminals like Herdr can display Copilot sessions. Strong community support; now closed — likely addressed or triaged. [Link](https://github.com/github/copilot-cli/issues/5320)

2. **#5323 — Setting to disable agent checkpoint refs (👍1)** — Every agent turn writes `refs/agents/<session>/checkpoints/turn/N` using the user's git identity, polluting tools that render all refs. High-impact for monorepo users. [Link](https://github.com/github/copilot-cli/issues/5323)

3. **#5392 — Claude usage prompt doubled on ~0.3% of calls (billing)** — Reported since 2026-11-04; doubled prompt inflates billing and can spuriously trigger compaction. Serious billing/trust concern. [Link](https://github.com/github/copilot-cli/issues/5392)

4. **#5400 — Regression in 1.0.108: deferred MCP function_call loses namespace (CLOSED)** — SDK-hosted sessions break with `400 Missing namespace for function_call` after deferred MCP tool call. Fast closure suggests a fix is inbound. [Link](https://github.com/github/copilot-cli/issues/5400)

5. **#5393 — Auto-compaction starts on self-contradicting usage reading** — Compaction triggers on a single doubled prompt number even though the runtime's own breakdown disagrees. Compounds #5392. [Link](https://github.com/github/copilot-cli/issues/5393)

6. **#5394 — cancelBackgroundCompaction() never emits compaction_complete** — SDK cancellation leaves "Compacting conversation…" stuck in the UI. State-machine reliability issue for extension authors. [Link](https://github.com/github/copilot-cli/issues/5394)

7. **#5398 — macOS 26: native canvas windows stay blank (WKWebView)** — Every canvas opens blank; localhost server receives no requests. Platform-specific rendering blocker for macOS 26.7 users. [Link](https://github.com/github/copilot-cli/issues/5398)

8. **#5390 — macOS sandbox: `allowLocalNetwork: true` still yields `hostLoopback: deny`** — Breaks Gradle (client can't reach localhost daemon). Sandboxing regressions continue to bite real build tooling. [Link](https://github.com/github/copilot-cli/issues/5390)

9. **#5388 — Sandbox token masking ineffective for `GH_TOKEN`/`GH_ENTERPRISE_TOKEN` on GHE data-residency** — Tokens are dropped before masking on `<tenant>.ghe.com`. Enterprise-security-relevant. [Link](https://github.com/github/copilot-cli/issues/5388)

10. **#5402 — MCP Entra silent sign-in uses `/common`, fails for single-tenant apps** — AADSTS50194 forces `/mcp auth` every session since 1.0.107. Recurring enterprise auth friction. [Link](https://github.com/github/copilot-cli/issues/5402)

**Also noteworthy:** #2616 (OS notification on long task completion — long-lived request since April), #4322 (trusted access linkage for cyber flagging, 👍5), #5185 (critical Datadog runtime bazel-cache memory alert).

---

## 4. Key PR Progress

No pull requests were updated in the last 24 hours (0 items). Skip this section for today.

---

## 5. Hot Discussions

No discussion data was provided. Section omitted.

---

## 6. Feature Request Trends

Distilled from Issues over the past 24h:

- **Permissions & sandboxing configurability** — Multiple requests to refine sandbox defaults: local network in macOS sandbox (#5390), token masking for GH/GHE tokens (#5388), finer permission UX (#316 epic), and reducing prompt churn for read-only scripts (already improving in 1.0.109-0).
- **Session lifecycle & agent hygiene** — Disable checkpoint refs (#5323), subagent temp-directory misinterpretation (#5352), resumability after `close_session` (#5386), and background task timeout resilience (#5395).
- **MCP auth robustness** — Fixed OAuth callback ports (#5391), Entra single-tenant support (#5402), Kerberos/Negotiate proxy support (#5142), and non-Microsoft OAuth `prompt=select_account` fix (#4526).
- **Platform-specific rendering & tooling** — macOS 26 canvas blank windows (#5398), Windows PowerShell background-process hangs (#5387).
- **Observability & UX polish** — OSC 7501 status (#5320), native OS notifications (#2616), statusline quota visibility when `providers.json` is set (#5403), and remote voice mode (#5315).
- **Enterprise & security reviews** — Trusted Access for Cyber linkage (#4322) and browser-use plugin/extension documentation for enterprise review (#5389).

---

## 7. Developer Pain Points

Recurring frustrations surfaced by this window:

1. **Billing/usage anomalies** — Doubled prompt token reporting on Claude (0.3% of calls) driving both over-billing and spurious auto-compaction (#5392, #5393, #5394). Highest-severity trust issue today.
2. **Sandbox over-blocking** — macOS sandbox denying localhost despite `allowLocalNetwork: true` breaks Gradle and similar daemon-backed toolchains (#5390); token masking gaps under GHE data residency (#5388).
3. **MCP auth churn** — Entra `/common` authority mismatch forces re-auth every session (#5402); no fixed OAuth callback port (#5391); Kerberos proxy failures (#5142).
4. **Platform regressions** — macOS 26 blank canvas windows (#5398) and Windows PowerShell process-lifetime hangs (#5387) reduce reliability on mainstream dev platforms.
5. **Agent/session state bugs** — Stuck compaction UI, lost background sub-agent results, and unresumable sessions erode confidence in long-running workflows (#5394, #5395, #5386).
6. **Config visibility regressions** — `providers.json` hides quota in the statusline even when using GitHub-hosted models (#5403), a small but disruptive UX bug for mixed-provider users.
7. **Long-standing asks** — OS-level notifications for long tasks (#2616, open since April) and reducing checkpoint ref noise (#5323) remain unaddressed.

---

*Digest generated from github.com/github/copilot-cli data as of 2026-11-10. PRs: 0 updated; Issues: 29 updated.*

</details>

<details>
<summary><strong>OpenCode</strong> — <a href="https://github.com/anomalyco/opencode">anomalyco/opencode</a></summary>

# OpenCode Community Digest — 2026-11-10

## 1. Today's Highlights

No new releases landed in the last 24 hours, but the issue tracker is dominated by a **free-tier usage-limits crisis**: the pinned mega-thread #59387 has grown to 339 comments, with dozens of reports of premature exhaustion and broken resets. Meanwhile, the engineering team continues a rapid cadence of PRs around embeddings, MCP OAuth refresh, and Windows process-spawning fixes. Desktop stability regressions (session deletion, Windows renderer crashes) are also drawing fresh attention.

## 2. Releases

No new releases in the last 24 hours.

## 3. Hot Issues

1. **[#59387 [OPEN] Free tier issues: read this first, then post your report here](https://github.com/anomalyco/opencode/issues/59387)** — 339 comments, 27 👍. The canonical aggregation thread for free-tier complaints (quota exceeded, resets that never happen, desktop downgrades). Its size alone signals a systemic billing/quota problem rather than isolated bugs.

2. **[#23153 [CLOSED] [FEATURE]: Pay Go with crypto](https://github.com/anomalyco/opencode/issues/23153)** — 35 comments, 67 👍. Closed after long discussion; crypto payment support for OpenCode Go remains one of the highest-upvoted feature requests.

3. **[#58302 [CLOSED] OpenCode 刚打开就提示免费额度耗尽](https://github.com/anomalyco/opencode/issues/58302)** — 25 comments. Chinese-language report of quota draining within ~30 minutes of a fresh day; suspects the desktop upgrade. Echoes the broader quota-reset inconsistency.

4. **[#33300 [OPEN] [FEATURE]: Voice/Speech Input Support for Desktop App](https://github.com/anomalyco/opencode/issues/33300)** — 11 comments, 13 👍. Long-running accessibility/UX request; still open, suggesting it's non-trivial to scope.

5. **[#62460 [CLOSED] Stalling Beam Free](https://github.com/anomalyco/opencode/issues/62460)** — 9 comments. Beam Free repeatedly emits "let me do this now" and terminates the message instead of continuing; needs manual nudging. Highlights model-behavior regressions on the free tier.

6. **[#60976 [OPEN] [FEATURE]: Load configured ./gui-experimental plugins in the web app](https://github.com/anomalyco/opencode/issues/60976)** — 8 comments, 4 👍. GUI plugins currently only work in Desktop; web-app parity is a recurring integration ask.

7. **[#50814 [OPEN] compaction: model emits tool calls as literal text after compaction](https://github.com/anomalyco/opencode/issues/50814)** — 8 comments. Post-compaction tool calls become plain text and never dispatch, silently breaking long sessions.

8. **[#51570 [OPEN] [reproduced] model discovery fails for LM Studio when using API keys](https://github.com/anomalyco/opencode/issues/51570)** — 8 comments, 4 👍. `/models` fails because the API key isn't forwarded during discovery even though inference works.

9. **[#62481 [CLOSED] compaction: auto compaction between a tool call and its result drops the tool output](https://github.com/anomalyco/opencode/issues/62481)** — 6 comments. Reproducible `No tool output found for function call` rejection from OpenAI after mid-step compaction.

10. **[#60311 [OPEN] [reproduced] docs: Go usage limits are shared across all models, not per-model as documented](https://github.com/anomalyco/opencode/issues/60311)** — 6 comments. Documentation says per-model limits; reality is a single shared pool. Directly relevant to the quota confusion driving #59387.

## 4. Key PR Progress

1. **[#63018 [OPEN] fix(core): log session deletions](https://github.com/anomalyco/opencode/pull/63018)** — Adds `session.deleted` to `EventLogger`. Directly motivated by #63013, where connecting a provider silently deleted an active session with no tombstone or audit trail.

2. **[#63008 [OPEN] fix(core): refresh MCP OAuth tokens before they expire](https://github.com/anomalyco/opencode/pull/63008)** — MCP OAuth currently only retries after a 401; this aligns behavior with provider logins (refresh within 5 minutes of expiry).

3. **[#63012 [CLOSED] fix(core): keep MCP OAuth credentials when a refresh fails temporarily](https://github.com/anomalyco/opencode/pull/63012)** — Prevents transient refresh failures (429/5xx/timeout) from being treated as a lost login and forcing re-auth.

4. **[#63007 [OPEN] test(core): capture variant requests after config and plugin edits](https://github.com/anomalyco/opencode/pull/63007)** — Test harness for reasoning-variant requests; supports the fix in #63010.

5. **[#63010 [OPEN] fix(core): spell reasoning variants for the model's final package](https://github.com/anomalyco/opencode/pull/63010)** — Fixes `#high`/`#low` reasoning variants being emitted in the wrong provider dialect after a package override (e.g., Gemini Interactions).

6. **[#62997 [CLOSED] feat(core): add GitHub Copilot Auto and a model resolve hook](https://github.com/anomalyco/opencode/pull/62997)** — Introduces `experimental.model.resolve`, letting plugins dynamically pick a model per request kind (primary / compaction / etc.).

7. **[#62844 [CLOSED] feat(ai): add Vertex predict embeddings](https://github.com/anomalyco/opencode/pull/62844)** — Part of a stacked series adding embedding support (Google `embedContent`, Vertex `:predict`, OpenAI protocol) to `@opencode/ai`.

8. **[#62802 [OPEN] fix(core): launch snapshot Git and shell tool commands off the server thread on Windows](https://github.com/anomalyco/opencode/pull/62802)** — Windows process creation (~5 ms, tail up to 160 ms) was blocking the server thread during multi-agent runs; moves it off-thread.

9. **[#57998 [CLOSED] fix(tui): avoid quadratic prompt hydration for large session families](https://github.com/anomalyco/opencode/pull/57998)** — Fixes quadratic scanning when opening large session families; a real performance win for heavy TUI users.

10. **[#54251 [OPEN] fix(core): retain completed execute results on interruption](https://github.com/anomalyco/opencode/pull/54251)** — Preserves bounded previews and logs of completed nested calls when a parent `execute` is interrupted.

## 5. Hot Discussions

No discussion data was provided in the source, so this section is omitted.

## 6. Feature Request Trends

- **Payment flexibility** — Crypto payment for Go (#23153, 67 👍) remains the single highest-upvoted request.
- **Desktop UX parity** — Voice/speech input (#33300), GUI plugins in the web app (#60976), and offering an MIT Android client (#62897) all point to cross-platform feature parity and expansion.
- **Compaction correctness** — Multiple issues (#50814, #62481) describe compaction corrupting tool-call/tool-result pairs. This is less a "feature" than a correctness gap that keeps surfacing.
- **Model/provider ergonomics** — LM Studio API-key handling (#51570), TUI model-picker truncation (#62447), and Go limits being shared vs. per-model (#60311) form a cluster of "the UI and docs don't match the runtime" requests.
- **Observability/audit** — Session deletion logging (#63018) reflects a growing demand for undo/audit trails on destructive actions.

## 7. Developer Pain Points

1. **Free-tier quota opacity** — The dominant pain by volume: premature exhaustion (#58302, #62803), resets that don't happen, and limits silently shared across models despite per-model documentation (#60311). Thread #59387 is effectively the community's complaint desk.

2. **Compaction breaking sessions** — Auto-compaction drops tool outputs (#62481) or converts tool calls into literal text (#50814), turning long agentic runs into dead sessions with unhelpful downstream errors.

3. **Windows instability** — Renderer crashes on Desktop 2.2.6 (#63001), a background service spawning visible consoles every ~2 s and stealing focus (#62988), and blocking Git/shell spawns (#62802) make Windows the most fragile platform right now.

4. **MCP friction** — Fragile OAuth refresh (#63008, #63012), Node 26 incompatibilities in popular MCP servers (#62441), and per-project MCP process explosion at startup (#43845).

5. **Destructive actions without safety nets** — Silent session deletion when connecting a provider (#63013) and whole-config rejection with no last-good fallback (#62872) both risk losing user work with no recovery path.

6. **Docs vs. runtime drift** — Shared-vs-per-model Go limits (#60311) and per-project vs. per-service MCP spawning (#43845) show documentation lagging behind actual behavior, compounding support load.

---
*Generated from github.com/anomalyco/opencode activity on 2026-11-10.*

</details>

<details>
<summary><strong>Pi</strong> — <a href="https://github.com/earendil-works/pi">earendil-works/pi</a></summary>

# Pi Community Digest — 2026-11-10

## 1. Today's Highlights

Pi shipped **v1.5.1** with standalone credential commands (`pi auth login/logout`) that work without starting a session. The issue tracker was dominated by a major Windows-experience consolidation thread (#7547, 96 comments) plus a wave of community PRs from `petrroll` fixing Windows-specific shell, path-glob, UTF-16, and PowerShell exit-code bugs. Hotfixes also landed for the Pi 1.5.0 `StringEnum` typing regression and stuck pi-durable tasks.

## 2. Releases

**v1.5.1**
- **Shell login and logout**: `pi auth login <provider>` / `pi auth logout <provider>` now work standalone, without starting a session. Supports API-key and no-browser sign-in flows.
- Docs: [Credential commands](https://github.com/earendil-works/pi/blob/v1.5.1/packages/coding-agent/docs/cli.md#credent)

## 3. Hot Issues

1. **[#7547](https://github.com/earendil-works/pi/issues/7547) — [Windows] How do you use Pi on Windows? (OPEN, 96 comments)** — The community's central Windows meta-thread: cataloguing the many ways Pi runs on Windows to decide what should be core-supported vs. delegated to extensions. High engagement and a clear signal that Windows support is now a first-class concern.
2. **[#5103](https://github.com/earendil-works/pi/issues/5103) — pi-windows-x64.zip can't detect git-bash from PATH (CLOSED, 25 comments)** — Long-running bug finally resolved: the built-in bash tool failed on release zip builds even with Git Bash installed. Closure marks real progress on the out-of-box Windows path.
3. **[#3200](https://github.com/earendil-works/pi/issues/3200) — Support video/audio content in `prompt` (OPEN, 12 comments, 👍8)** — Requests extending the `prompt` RPC beyond images to video/audio for multimodal models. Highest-upvoted open feature ask; indicates demand for richer agent inputs.
4. **[#11869](https://github.com/earendil-works/pi/issues/11869) — New `StringEnum` breaks compile-time typing (OPEN, prio:p0, 👍3)** — Pi 1.5.0's migration of `StringEnum` off typebox degrades tool-parameter types to `unknown`, causing typecheck failures for extension authors. A P0 regression with real downstream breakage.
5. **[#9216](https://github.com/earendil-works/pi/issues/9216) — Ollama qwen3 stream 'terminated' + auto-compaction regression (OPEN)** — Clean 0.84→0.85 regression with local models: repeated `terminated` errors and auto-compaction failing to re-trigger. Matters for the local/offline model cohort.
6. **[#11892](https://github.com/earendil-works/pi/issues/11892) — pi-durable 1.5.0: tasks stuck in waiting/completing (CLOSED)** — Reproduced with `MemoryStorage` via the publishing hook; a correctness bug in the durable execution layer that was fixed quickly.
7. **[#11773](https://github.com/earendil-works/pi/issues/11773) — Upgrade Token Plan branding / gateway setup (OPEN, prio:p0)** — Qianwen AI Platform migration with new China/international gateway defaults. High-priority provider compatibility work.
8. **[#11977](https://github.com/earendil-works/pi/issues/11977) — `/login` draws API keys on screen and stores them as config values (CLOSED)** — Security/UX flaw: keys echoed during entry and left visible in the prompt. Fast closure is good, but the pattern deserves audit elsewhere.
9. **[#11026](https://github.com/earendil-works/pi/issues/11026) — pi-durable: permanently delete a conversation (OPEN, 👍5)** — Requests a `deleteConversation` API with safe refusal while runs are active. Data lifecycle management is a recurring durable-storage gap.
10. **[#11921](https://github.com/earendil-works/pi/issues/11921) — `tool_search` says "No matching tools found" for direct MCP tools (OPEN, fix-available)** — Direct-exposure MCP tools aren't named in the system prompt, causing weaker models to conclude the tool doesn't exist. A subtle but impactful MCP ergonomics bug.

## 4. Key PR Progress

1. **[#11978](https://github.com/earendil-works/pi/pull/11978) — Expand env vars in custom `shellPath`** — Fixes `%LOCALAPPDATA%`-style values failing verbatim `fs.accessSync` checks on Windows (closes the gap in #11979).
2. **[#11975](https://github.com/earendil-works/pi/pull/11975) — Offer fork when session cwd no longer exists** — Closes #11060: the chosen folder is now persisted, ending the "ask every resume" loop after project renames.
3. **[#11974](https://github.com/earendil-works/pi/pull/11974) — Don't start `fd` after `find` was aborted** — Fixes an orphaned `fd` process that walked the whole filesystem after an abort during `.git` lookup.
4. **[#11972](https://github.com/earendil-works/pi/pull/11972) — Match Windows find path patterns across every `fd` version** — Normalizes `src\**\*.ts`-style patterns so results don't silently depend on the user's `fd` release (follow-up to #9262).
5. **[#11970](https://github.com/earendil-works/pi/pull/11970) — Bump Claude Code user-agent for Fable 5.2** — Fixes HTTP 400 `claude_code_version_too_old` by bumping the advertised version from 2.1.280 to 2.1.321.
6. **[#11968](https://github.com/earendil-works/pi/pull/11968) — Make fullscreen scroll frames O(viewport)** — Eliminates full-transcript rebuilds per wheel event (up to 60 fps), a meaningful fullscreen performance win (refs #9549).
7. **[#11967](https://github.com/earendil-works/pi/pull/11967) — Read/edit/write UTF-16 files with BOM** — Handles PowerShell `Out-File` / `reg export` output correctly instead of showing replacement chars (Windows data fidelity).
8. **[#11966](https://github.com/earendil-works/pi/pull/11966) — Stop writing to the terminal while the TUI draws** — Closes #11264: stray stdout/stderr writes corrupted the TUI's screen model, leaving stale content behind.
9. **[#11964](https://github.com/earendil-works/pi/pull/11964) — Report native exit codes in PowerShell tool on PS 5.1** — Fixes #8842: stderr progress output no longer flips a successful native command to failure.
10. **[#11961](https://github.com/earendil-works/pi/pull/11961) — Clean up provider resources when a harness closes** — Closes #11676: `Harness.close()` now releases pi-ai provider sessions so Node processes can exit cleanly.

Also worth noting: **[#11952](https://github.com/earendil-works/pi/pull/11952)** serializes `bash` calls ahead of parallel tools (fixes races on build artifacts), **[#11957](https://github.com/earendil-works/pi/pull/11957)** makes `tool_search` report already-declared MCP tools, and **[#11949](https://github.com/earendil-works/pi/pull/11949)** preserves Azure OpenAI's long-context price tier.

## 5. Hot Discussions

**Ideas**
- **[#11984](https://github.com/earendil-works/pi/discussions/11984) — Use Redux/Redux-Saga for Pi state management** — Proposes modeling agent orchestration with saga effects; the author cites a reply from Redux's creator but admits they can't yet implement it. Echoes the community's growing interest in formalized agent orchestration patterns.

## 6. Feature Request Trends

- **Multimodal input expansion** — Beyond images: video and audio in `prompt` (#3200), and image-heavy tool results via file references (#8617).
- **Durable-storage lifecycle** — Permanent conversation deletion (#11026) and correct resource release on harness close (#11676) point to maturing pi-durable beyond "works" to "operable."
- **MCP/tool ergonomics** — Per-tool exposure toggles from the `/mcp` TUI (#11526) and fixing `tool_search` discoverability for direct tools (#11921).
- **Provider/config flexibility** — Env-var expansion in `shellPath` (#11979), Token Plan gateway rebranding (#11773), and model-scope diagnostics at startup (#11973).
- **TUI polish & performance** — Fullscreen scroll cost (#9549), codemode highlighting caching (#10971), and relative Markdown link handling (#10993).

## 7. Developer Pain Points

- **Windows remains the dominant friction surface.** Git Bash detection (#5103), PowerShell 5.1 stderr/exit-code misclassification (#8842, #11944), `fd` glob separators (#9262), UTF-16 files (#11967), `shellPath` env vars (#11979), and empty bracketed pastes on WSL Terminal (#11259) all cluster here. The 96-comment meta-thread (#7547) confirms this is the community's biggest structural concern.
- **Terminal/TUI ownership conflicts.** Stray writes corrupting the TUI (#11264), silent no-result glob behavior (#9262), and the codemode highlight cost (#10969) show the TUI is still fragile under real-world conditions.
- **Provider compatibility churn.** Fable 5.2 header bumps (#11969), Codex WebSocket `onResponse` never firing (#11898), Azure cost-tier regressions (#11949), and Ollama stream regressions (#9216) mean model/provider integration is a constant maintenance tax.
- **Security hygiene in credential UX.** Passwords/keys echoed on screen during `/login` (#11977) is a class of issue worth scanning for across other interactive prompts.

---
*Generated from github.com/earendil-works/pi activity on 2026-11-10. Note: some issue dates in the source data predate this digest window (e.g., #3200 from April, #7547 from August); items are included because they were updated in the last 24h.*

</details>

<details>
<summary><strong>Qwen Code</strong> — <a href="https://github.com/QwenLM/qwen-code">QwenLM/qwen-code</a></summary>

# Qwen Code Community Digest — 2026-11-10

## 1. Today's Highlights

Qwen Code shipped **v0.27.1** across the CLI, Desktop, and TypeScript SDK (bundling CLI 0.27.1), headlined by active-shell naming in the startup context. Meanwhile, stability work dominated the tracker: a P1 Java lane compilation break on `main` (#16712) was opened and closed within the day, and a cluster of GitHub-channel quota optimizations from @wenshao moved through review. Community attention remains concentrated on shell permission guard correctness and subagent context bloat.

## 2. Releases

**CLI / Core — v0.27.1**
- `feat(core)`: name the active shell in the startup context (#16491, @2Sin)

**Desktop — v0.27.1**
- docs(providers): document Wally under OpenAI-compatible providers (#16529)
- fix(core): share one g… *(release notes truncated upstream)*

**SDK TypeScript — v0.1.31**
- Bundles CLI 0.27.1 (built from source on the same branch/ref as the SDK). No known breaking changes across any channel.
- Note: the release body also lists a bundled CLI 0.27.0 reference, suggesting a stacked/duplicated release note — worth confirming the canonical bundled version if you pin SDK/CLI pairs.

## 3. Hot Issues

1. **#14724 — Main CI failed: Managed Agent gate (287 comments)** — A month-old CI gate failure with no identifiable test, still the most-commented issue in the repo. Its persistence signals the gate may be misconfigured rather than flaky. [link](https://github.com/QwenLM/qwen-code/issues/14724)
2. **#13078 — Daily dependency CVE audit failed (47 comments)** — Scheduled audit has been failing for ~6 weeks, possibly due to a new high-severity CVE or an unavailable npm audit endpoint. Supply-chain visibility is degraded until resolved. [link](https://github.com/QwenLM/qwen-code/issues/13078)
3. **#16672 — Managed Agent gate: HostedExtensionsIT failures (+11 more, 37 comments)** — A broad managed-agent CI failure on MySQL 8.4 / Java 21, indicating hosted-extension lifecycle instability. [link](https://github.com/QwenLM/qwen-code/issues/16672)
4. **#16712 — [P1, CLOSED] Java lane fails to compile: duplicate case labels (5 comments)** — `main` was broken for every PR's Java lane by duplicate case labels in `SurfaceAdmissionAcceptanceTest` (from #16641). Fast turnaround, but it highlights how a single test file can block an entire CI tier. [link](https://github.com/QwenLM/qwen-code/issues/16712)
5. **#15660 — Subagents start with 105k context from unknown origin (4 comments)** — Parent uses 42k, subagent prompt is 1k, yet sessions reportedly start at 105k and grow. Token-management impact is severe for multi-agent workflows. [link](https://github.com/QwenLM/qwen-code/issues/15660)
6. **#16140 — [P1, security] Shell redirect extractor drops `N>`, `>|`, no-space `cd>file` (3 comments)** — Deny rules cannot fire on these forms, so `Write`/`Edit` guards are bypassable. Part of a broader shell-semantics correctness cluster. [link](https://github.com/QwenLM/qwen-code/issues/16140)
7. **#16690 — GitHub channel: surface API budget, protect mention lane (CLOSED, 5 comments)** — The channel only inspects rate-limit headers after failures. Closed with corresponding PRs (#16741), showing maintainer responsiveness to token/quota economics. [link](https://github.com/QwenLM/qwen-code/issues/16690)
8. **#16683 — Desktop 0.27 fails on Intel x64 Mac (3 comments)** — Native crash (`Check failed: 12 == (*__error())`) at runtime startup; Intel Mac users are currently blocked. [link](https://github.com/QwenLM/qwen-code/issues/16683)
9. **#16757 — Non-UTF-8 ANSI-C bytes collapse to U+FFFD, guards miss bash's actual path (3 comments)** — On Linux, filenames are raw bytes; UTF-8 decoding makes the permission analyzer check a different path than bash opens. A genuine security-analysis gap. [link](https://github.com/QwenLM/qwen-code/issues/16757)
10. **#16700 — `/branch` refuses while tasks appear complete (3 comments)** — Users see "cannot branch while response or tool call in progress" with no force-terminate escape hatch after upgrading to 0.27.0. [link](https://github.com/QwenLM/qwen-code/issues/16700)

## 4. Key PR Progress

1. **#16732 — feat(serve): PR-watch host discovery and ordered shutdown (CLOSED)** — Infrastructure slice for daemon PR-state watch; watch itself remains off. Enables conditional-request and GraphQL batching work downstream. [link](https://github.com/QwenLM/qwen-code/pull/16732)
2. **#16741 — perf(github): conditional requests for polling (CLOSED)** — PR-state watch and notifications now send ETag/Last-Modified validators, so unchanged data costs no quota. Directly addresses #16690/#16691. [link](https://github.com/QwenLM/qwen-code/pull/16741)
3. **#16725 — fix(core): attribute `gh pr create` in the directory the command runs in** — Sessions auto-bind PRs created from inside worktrees via in-command `cd`, asking GitHub about the actual repo. Nice ergonomic win for worktree-based flows. [link](https://github.com/QwenLM/qwen-code/pull/16725)
4. **#16731 — fix(cli): idle-only slash commands run from an idle session** — Commands now read per-submission idle state instead of app-wide state, likely relevant to the `/branch` blockage in #16700. [link](https://github.com/QwenLM/qwen-code/pull/16731)
5. **#16075 — fix(permissions): parsed recognizer + literal backstop for `git commit --amend`** — Unprovable literal mentions route to manual approval rather than hard-block (issue #13570). Structural close instead of another prover corner. [link](https://github.com/QwenLM/qwen-code/pull/16075)
6. **#16594 — fix(cli): never terminally release a config-scoped Hook owner on detach** — Both held-Runtime drains now respect owner recomputation semantics, fixing a lifecycle-v1/v2 resource settlement hazard. [link](https://github.com/QwenLM/qwen-code/pull/16594)
7. **#16736 — feat(web-shell): WeChat channel with in-browser QR login** — WeChat joins the configurable channel platform list with account panel, QR rendering, and scan-state reporting. [link](https://github.com/QwenLM/qwen-code/pull/16736)
8. **#15450 — feat(qqbot): agent can send local files to chat** — Per-channel, off-by-default switch exposing four media tools (file/image/video/voice) with regular-file validation. [link](https://github.com/QwenLM/qwen-code/pull/15450)
9. **#16781 — feat(verify-pr): deepen verify checkout to PR history** — Trusted step deepens the depth-2 checkout on both sides before PR code runs, so `/verify` sees authored commits and their parents. Strengthens sandboxed verification. [link](https://github.com/QwenLM/qwen-code/pull/16781)
10. **#16758 — feat(managed-agent): private BTW and session recap** — Durable, actor-private follow-ups plus manual/auto recap, including ACTIVE sessions with reclaimed Runtimes; persisted results and private SSE. [link](https://github.com/QwenLM/qwen-code/pull/16758)

*Also notable:* #15684 (external workspace execution), #15659 (ACP teammate activity display), #15786 (BOM-tolerant extension manifests), #16777 (autofix budget to 240 min on self-hosted).

## 5. Hot Discussions

No GitHub Discussions data was provided in this dataset, so this section is omitted.

## 6. Feature Request Trends

- **Channel/webhook delivery targets** — #16752 and #16753 request configured delivery destinations and DingTalk webhook sending as the first consumer, extending the scheduled-tasks/Channels work from #16524. Expect platform-per-platform integration buildout (WeChat, QQ, DingTalk).
- **GitHub channel API-budget discipline** — Three related requests (#16690, #16691, #16692) ask for budget awareness, conditional requests, and batched GraphQL PR-state watch. A clear "poll smarter, not more" direction.
- **Unified agent loop** — #15327 tracks running every surface on one `packages/core` agent loop behind `experimental.unifiedAgentLoop` — a roadmap-scale architectural request.
- **Web Shell UX polish** — #16778 (dedicated search dialog), #16775 (sort button placement), and #16753 (channel configuration UI) show sustained investment in Web Shell ergonomics.
- **Managed-agent surface parity** — #16546's capability matrix compares control-plane, WebShell slots, and Java REST, requesting Skills-list and sidebar capabilities in WebShell.

## 7. Developer Pain Points

- **CI noise is the dominant frustration.** Six of the top-commented issues are main-branch CI failures (#14724, #13078, #16672, #11680, #11678, #16505), several with "no test identified" or "provisional" labels. The bot-generated tracker is drowning out human reports, and a single test file (#16712) blocked all Java PRs.
- **Shell permission analyzers keep missing paths.** #16140, #16757, and #13139 describe redirect forms, non-UTF-8 bytes, and quoting-artifact `cd` targets that evade guards — a recurring security-critical theme from the same set of authors.
- **Subagent context/notification plumbing is broken.** #15660 (105k unexpected context) and #15748 (background-task notifications only reach the top-level agent, risking OOM) point to multi-agent architecture gaps.
- **Platform-specific desktop breakage.** #16683 (Intel Mac native crash) and #16766 (Generated UI cards stuck in macOS WKWebView) show the Tauri/desktop path needs platform-matrix attention.
- **No escape hatch for stuck state.** #16700's inability to branch or force-terminate a "busy" session is a UX failure mode users hit even when `/task` shows everything complete.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*