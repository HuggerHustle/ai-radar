# AI CLI Tools Community Digest 2026-10-26

> Generated: 2026-10-25 23:09 UTC | Tools covered: 7

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
**Digest window: 2026-10-25 → 2026-10-26**

---

## 1. Ecosystem Overview

The AI CLI tooling landscape has entered a consolidation phase where **reliability, cost transparency, and cross-platform parity** now dominate community discourse over raw capability gains. Every major tool shipped zero or near-zero releases in this window, yet issue volume remained intense — a sign that user bases are large and mature enough to surface deep operational bugs (memory exhaustion, session lock timeouts, quota accounting) rather than just feature gaps. Windows, in particular, has emerged as the ecosystem's weakest link, with Codex, Claude Code, Copilot CLI, Gemini CLI, and Pi all reporting platform-specific regressions. Meanwhile, **agentic orchestration** (subagents, MCP lifecycle, multi-session coordination) is the fastest-maturing surface, and its failures — silent, unobservable, or misleading — are the most emotionally charged complaints across every community.

---

## 2. Activity Comparison

| Tool | Issues (today) | PRs (today) | Discussions | Release Status |
|---|---|---|---|---|
| **Claude Code** | High (~10 highlighted, heavy stale-closure) | 1 (docs) | N/A (no data provided) | None in 24h |
| **OpenAI Codex** | ~50 updated | 0 | 9 | None in 24h |
| **Gemini CLI** | ~10 highlighted (p1-heavy) | ~10 landed | N/A (no data provided) | Nightly only (`v0.67.0-nightly`) |
| **GitHub Copilot CLI** | 10 highlighted (2 triage-level) | 0 | N/A (no data provided) | None in 24h |
| **OpenCode** | 10 highlighted (quota crisis cluster) | 10 (perf/fix/refactor) | N/A (no data provided) | None in 24h |
| **Pi** | 10 highlighted (provider interop) | 10 (bot + community) | 1 | None in 24h |
| **Qwen Code** | 10 highlighted (CI-blocked) | 10 (core loop/hook fixes) | N/A (no data provided) | `v0.26.1` shipped; SDK/runtime blocked |

**Reading the table:** Codex has by far the highest raw issue throughput (~50), driven by a Windows regression wave. Gemini CLI, Pi, Qwen Code, and OpenCode are the most **PR-active**, each landing ~10 fixes in the window — indicating active maintainer engagement. Copilot CLI is the outlier: **zero PRs and zero releases**, with issues accumulating faster than they're addressed. Claude Code shows heavy issue churn but a notable proportion is **stale auto-closure** rather than resolution.

---

## 3. Shared Feature Directions

Requirements appearing across **three or more** communities:

| Direction | Tools | Specific Needs |
|---|---|---|
| **Cost / rate-limit transparency** | Claude Code, Codex, Copilot CLI, OpenCode | Headless vs. interactive cost discrepancy (#97074); native `codex status`/usage API (#56209, #56932); ACP `usage_update` parity (#4233); free-tier quota reset visibility (#58831) |
| **Agentic orchestration reliability** | Claude Code, Codex, Gemini CLI, OpenCode, Pi | Subagent premature termination (#56951); MAX_TURNS reported as success (#22323); subagent empty results (#59051); Remote Control session drops (#104410) |
| **MCP lifecycle & hardening** | Codex, Copilot CLI, Pi, Gemini CLI | Agent-callable MCP reconnect (#56970); `inheritEnv: false` for stdio (#11361); deferred tool loading regression (#5195); `maxMessageBytes` on JSON (#11335); child-stderr diagnostics (#15567) |
| **Context/compaction correctness** | Gemini CLI, OpenCode, Pi, Qwen Code | AST-aware reads (#22745); unbounded compaction file lists (#11297); post-compaction double-counting (#15486); llama.cpp overflow detection (#10885) |
| **Cross-platform parity (esp. Windows)** | Claude Code, Codex, Gemini CLI, Copilot CLI, Pi | MSIX install corruption (#53132, #84851); `SYSTEMROOT` in sandbox env (#56264); Windows path separators (#11399); EBUSY extension locks (#19013); Entra token cache (#5236) |
| **Guardrail configurability** | Claude Code, Gemini CLI | Permission-gated opt-ins for dev/test workflows (#78160); discouraging destructive git/DB ops (#22672) |
| **ACP / IDE integration parity** | Copilot CLI, Gemini CLI | Mid-turn steering (#5198, #29901); usage updates (#4233); session rename (#5115) |

**The strongest convergence is cost transparency and orchestration reliability** — both appear in 4+ tools with high engagement (👍 counts), suggesting they are ecosystem-wide gaps, not vendor-specific issues.

---

## 4. Differentiation Analysis

| Tool | Feature Focus | Target Users | Technical Approach |
|---|---|---|---|
| **Claude Code** | Desktop/TUI UX, guardrails, memory, multi-session "Fleet" | Enterprise devs, automation/CI teams | Heavier product surface (desktop app, Remote Control, Routines); guardrail-first philosophy |
| **OpenAI Codex** | Computer Use, sandbox, MCP Apps, Windows desktop | Prosumer + pro-tier power users | Broadest surface area (desktop, VS Code, Computer Use); most exposed to platform regressions |
| **Gemini CLI** | Agent reliability, AST tooling, token efficiency, sandboxing | OSS-minded devs, IDE integrators | Architecturally ambitious (AST-aware reads, OS sandboxing); community-driven cross-platform PRs |
| **Copilot CLI** | ACP parity, enterprise policy, context budget | Enterprise GitHub users, editor (Zed) integrators | Enterprise-first (Entra, managed policy); ACP becoming a first-class integration surface |
| **OpenCode** | Free-tier access, v2 plugin/tool system, media blob storage | Hobbyists, OSS contributors, plugin authors | Fast-moving v2 rewrite; per-IP free-tier model creates scaling tension |
| **Pi** | Provider interoperability, MCP production-hardening, terminal ergonomics | Multi-provider power users, local-inference (llama.cpp) users | Provider-agnostic abstraction layer; deep terminal/tmux integration |
| **Qwen Code** | Managed runtime, K8s/Helm, CI automation, headless ops | Enterprise/infra teams, managed-agent operators | Infrastructure-heavy (Managed Agent control plane, external provisioners); CI reliability is the bottleneck |

**Key differentiators:**
- **Enterprise vs. prosumer:** Copilot CLI and Qwen Code lean enterprise (policy, Entra, K8s); OpenCode and Pi lean prosumer/OSS.
- **Breadth vs. depth:** Codex pursues breadth (Computer Use, MCP Apps, multi-IDE); Gemini CLI and Pi pursue depth in agent correctness and provider fidelity.
- **Guardrails:** Claude Code is the most guardrail-forward (and consequently the loudest source of false-positive complaints); others are more permissive.

---

## 5. Community Momentum & Maturity

**Momentum ranking (issue + PR + discussion throughput):**

1. **Codex** — Highest issue volume (~50), 9 discussions; a large, vocal, and technically sophisticated user base. Windows regressions are the current drag.
2. **Qwen Code** — 10 issues + 10 PRs; extremely active maintainer engagement but **CI-blocked**, which throttles release velocity.
3. **OpenCode** — 10 issues + 10 PRs; rapid v2 iteration, but the free-tier crisis is eroding trust.
4. **Pi** — 10 issues + 10 PRs (many bot-authored); a focused cleanup sprint signals organizational maturity.
5. **Gemini CLI** — 10 issues + 10 PRs; p1-heavy triage shows an engaged but stretched maintainer team.
6. **Claude Code** — Heavy issue churn but **stale auto-closure fatigue** is a trust risk; only 1 PR landed.
7. **Copilot CLI** — 10 issues, **0 PRs, 0 releases**; the lowest maintainer throughput relative to issue volume — a maturity red flag.

**Maturity signals:**
- **Most mature:** Claude Code and Codex (largest user bases, broadest surfaces, deepest bug reports).
- **Rapidly iterating:** OpenCode, Qwen Code, and Pi (highest PR velocity).
- **At risk:** Copilot CLI (issue accumulation without PR throughput) and Qwen Code (CI reliability blocking releases).

---

## 6. Trend Signals

**Industry-level takeaways for developers and decision-makers:**

1. **Cost predictability is now a first-class product feature.** The Claude Code headless-vs-interactive cost discrepancy (#97074, 48 👍), Codex's DIY usage-tracking thread (#56932), Copilot CLI's ACP usage parity (#4233), and OpenCode's quota crisis (#34344, 56 comments) all point the same direction: **users are willing to pay, but not to be surprised.** Tools that ship native usage APIs and predictable quota models will win automation/CI budgets.

2. **Agentic orchestration is the new reliability frontier.** Silent failures — subagents returning empty results (#59051), misleading `GOAL` success on turn-limit hits (#22323), denied writes with no prompt (#57603) — are the most trust-destroying class of bugs. **Observability (timestamps, model per agent, elapsed time, error codes) is the top request across tools.** Expect "agent observability" to become a competitive differentiator in 2027.

3. **Windows is the ecosystem's collective weak point.** Every major tool reported Windows-specific breakage in this window (MSIX corruption, sandbox env, path separators, Entra cache). **Cross-platform QA on Windows is an industry-wide gap** — a potential opening for a tool that gets it right.

4. **MCP has crossed from "spec-compliant" to "production-hardening."** Requests for env isolation (#11361), message-size enforcement (#11335), reconnect operations (#56970), and PiP support (#56069) show MCP is becoming a **platform**, not a protocol. Tool builders should treat MCP lifecycle management as core infrastructure.

5. **Context management is shifting from "compaction" to "handoff."** Qwen Code's handover-report proposal (#15545), Gemini CLI's AST-aware reads (#22745), and Pi's unbounded-file-list bug (#11297) all point to a future where **explicit context handoff replaces in-place summarization** — a structural change with major implications for long-running autonomous agents.

6. **Stable release channels are a nascent demand.** Copilot CLI's request for Stable/Beta channels (#5203) and Claude Code's stale-closure fatigue signal a maturing user base that **prioritizes stability over velocity.** Vendors optimizing for release cadence may need to offer escape hatches.

7. **ACP/IDE integration is the next battleground.** Mid-turn steering, usage updates, and session management across Zed/JetBrains/VS Code (Copilot CLI #5198, Gemini CLI #29901) indicate **editor integration parity is becoming table stakes** for CLI tools.

**Bottom line for decision-makers:** The differentiators are shifting from *model capability* to *operational trust* — cost predictability, agent observability, MCP hardening, and cross-platform reliability. Teams evaluating tools should weight these factors heavily, as they now drive community sentiment more than raw feature lists.

---

## Per-Tool Reports

<details>
<summary><strong>Claude Code</strong> — <a href="https://github.com/anthropics/claude-code">anthropics/claude-code</a></summary>

## Claude Code Skills Highlights

> Source: [anthropics/skills](https://github.com/anthropics/skills)

# Claude Code Skills — Community Highlights Report
**Source:** github.com/anthropics/skills | **Data as of:** 2026-10-26

---

## 1. Top Skills Ranking (by community attention)

> Note: comment counts are `undefined` on the PR side, so ranking blends issue-side discussion volume, update recency, and cross-referenced bug reports. All PRs below are **OPEN (unmerged)** unless noted.

| # | Skill | Author | Status | Why It's Drawing Attention |
|---|-------|--------|--------|----------------------------|
| 1 | **skill-creator** (multiple fixes) — [PR #1298](https://github.com/anthropics/skills/pull/1298), [PR #1681](https://github.com/anthropics/skills/pull/1681), [PR #1997](https://github.com/anthropics/skills/pull/1997) | MartinCajiao / Kuldeeep18 / BichengWang | Open | The meta-skill that builds all other skills. Three separate PRs target trigger-eval isolation, direct-execution `ModuleNotFoundError`, and YAML frontmatter parsing. It's the ecosystem's most fragile dependency. |
| 2 | **mcp-builder** — [PR #1742](https://github.com/anthropics/skills/pull/1742) | Kuldeeep18 | Open | Fixes the `streamablehttp_client → streamable_http_client` rename and custom-header handling for `mcp>=2`. Directly tied to [Issue #1390](https://github.com/anthropics/skills/issues/1390) where the eval harness scores 0/N against every real MCP server. |
| 3 | **webapp-testing** — [PR #1980](https://github.com/anthropics/skills/pull/1980), [PR #1976](https://github.com/anthropics/skills/pull/1976) | Pcmhacker-piro / gerardrecinto | Open | Removes `shell=True` command-injection risk (CWE-78) and fixes textarea/select element misreporting. A security + correctness one-two punch on a widely-used testing skill. |
| 4 | **docx** — [PR #1792](https://github.com/anthropics/skills/pull/1792), [PR #1734](https://github.com/anthropics/skills/pull/1734), [Issue #2018](https://github.com/anthropics/skills/issues/2018) | TINGyu123644 / rohitjain25 / BichengWang | Open | LibreOffice timeout reporting, orphaned comment detection, and invalid-XML-on-merge. The document toolchain is accumulating correctness debt faster than it's being closed. |
| 5 | **md2video-audio** — [PR #1703](https://github.com/anthropics/skills/pull/1703) | 70v-Yoyo | Open | Zero-cost Markdown → MP4 with voiceover via Marp. A pure new-capability submission (not a fix), signaling community appetite for media-generation skills. |
| 6 | **proofcore-contract-auditor** — [PR #1771](https://github.com/anthropics/skills/pull/1771) | ProofCore-Protocol | Open | Solidity/Rust static analysis with Merkle-proof anchoring on TON. Notably vendor-authored — a Web3 team shipping its own skill into the official repo. |
| 7 | **notion-spec-to-implementation** + **quantitative-resume-auditor** — [PR #1245](https://github.com/anthropics/skills/pull/1245) | mrdesouzaphd-cmyk | Open | Two skills in one PR: spec→Notion task breakdown, and resume auditing. Shows the "productivity pipeline" skill pattern gaining traction. |
| 8 | **document-typography** — [PR #514](https://github.com/anthropics/skills/pull/514) | PGTBoos | Open | Orphan/widow/numbering QC for generated docs. Small scope, but addresses a universal output-quality complaint. |

---

## 2. Community Demand Trends (from Issues)

Distilled from the top 15 issues by comment count:

- **Trust & supply-chain safety** — [Issue #492](https://github.com/anthropics/skills/issues/492) (46 comments, the single loudest thread) demands namespace separation so community skills can't masquerade as official `anthropic/` skills. This is the ecosystem's #1 unresolved risk.
- **Skill distribution & sharing UX** — [Issue #228](https://github.com/anthropics/skills/issues/228) (17 comments, 8 👍) wants org-wide skill libraries and share links instead of manual `.skill` file passing. Also [Issue #189](https://github.com/anthropics/skills/issues/189) (duplicate plugin content).
- **Reliable skill triggering & evaluation** — [Issue #556](https://github.com/anthropics/skills/issues/556) reports a **0% trigger rate** in `run_eval.py`; [Issue #1487](https://github.com/anthropics/skills/issues/1487) reports `claude-api` eagerly injecting ~156k tokens. Demand: trustworthy, token-efficient skill invocation.
- **Governance & quality gating** — [Issue #412](https://github.com/anthropics/skills/issues/412) (agent-governance) and [Issue #1385](https://github.com/anthropics/skills/issues/1385) (three-gate reasoning pipeline) propose policy enforcement, adversarial review, and delivery verification as first-class skills.
- **Compact agent state / memory** — [Issue #1329](https://github.com/anthropics/skills/issues/1329) proposes symbolic-notation `compact-memory` to cut context bloat.
- **Correctness of document skills** — recurring bug reports across docx/pdf/slack-gif-creator ([#2018](https://github.com/anthropics/skills/issues/2018), [#1868](https://github.com/anthropics/skills/issues/1868), [#1864/#1730](https://github.com/anthropics/skills/pull/1730)) point to a demand for **test coverage on bundled document skills**.

---

## 3. High-Potential Pending Skills

Active, still-open PRs with recent updates that may land soon:

| Skill | PR | Last Updated | Signal |
|-------|----|--------------|--------|
| md2video-audio | [#1703](https://github.com/anthropics/skills/pull/1703) | 2026-09-15 | New capability, clean scope |
| proofcore-contract-auditor | [#1771](https://github.com/anthropics/skills/pull/1771) | 2026-09-16 | Vendor-backed, updates tracking |
| scnet-hpc | [#1615](https://github.com/anthropics/skills/pull/1615) | 2026-08-24 | Niche but well-scoped (Slurm/SSH) |
| pyxel (retro game dev) | [#525](https://github.com/anthropics/skills/pull/525) | 2026-10-23 | Long-lived, still being touched |
| ODT skill | [#486](https://github.com/anthropics/skills/pull/486) | 2026-04-14 | Fills a real format gap |
| skill-quality-analyzer + skill-security-analyzer | [#83](https://github.com/anthropics/skills/pull/83) | 2026-01-07 | Meta-skills; aligns with Issue #492 concerns |
| claude-api URL fixes | [#1730](https://github.com/anthropics/skills/pull/1730) | 2026-10-04 | Trivial, verifiable, low-risk — likely merge candidate |

**Fastest-likely-to-merge:** #1730 (dead-URL fix), #1977/#1976 (small correctness fixes by gerardrecinto), #1792 (docx timeout verification).

---

## 4. Skills Ecosystem Insight

> **The community's most concentrated demand is reliability and trust in the skill supply chain** — fixing the meta-skill (`skill-creator`), securing distribution against namespace impersonation, and making skill triggering/evaluation actually work — rather than simply adding more skills.

---

*All links resolve to github.com/anthropics/skills. Comment counts marked `undefined` in the source data are excluded from ranking; PR ordering reflects update recency, cross-referenced issue volume, and topical clustering.*

---

# Claude Code Community Digest — 2026-10-26

## 1. Today's Highlights

No new releases landed in the last 24 hours, but issue activity was heavy: a high-engagement cost-accounting bug (#97074) tops the board with 48 👍, revealing that headless `claude -p` consumes ~1.8× more of the 5-hour rate-limit window per token than interactive CLI. A large batch of stale-tagged issues was closed out (agent-view, TUI, desktop), while several fresh platform-specific bugs (Linux Wayland Quick Entry, macOS skill tooltip) remain open. Community frustration continues to cluster around guardrail false positives, memory reliability, and multi-session orchestration stability.

## 2. Releases

No new releases in the last 24h.

## 3. Hot Issues

1. **[#97074](https://github.com/anthropics/claude-code/issues/97074)** — *OPEN, 28 comments, 48 👍* — Headless `claude -p` (SDK-CLI entrypoint) burns ~1.8× more of the 5-hour window per token than interactive CLI on identical workloads. Highest-engagement item today; directly impacts CI/automation cost budgets. Community reaction is strong (48 👍), suggesting broad reproducibility.
2. **[#78160](https://github.com/anthropics/claude-code/issues/78160)** — *OPEN, 18 comments, 25 👍* — Blanket refusal to type passwords breaks legitimate localhost/dev-environment test workflows. Request for a permission-gated opt-in. Sentiment: users accept the default is sensible but want an escape hatch for owned test servers.
3. **[#48805](https://github.com/anthropics/claude-code/issues/48805)** — *CLOSED, 14 comments, 63 👍* — Terminal font family setting in desktop app. Highest 👍 count in the batch; closed after months, indicating the desktop terminal customization gap was widely felt.
4. **[#84981](https://github.com/anthropics/claude-code/issues/84981)** — *CLOSED (stale)* — Background tasks SIGTERMed on an exact 30-minute internal timer (exit 144) in long-lived macOS sessions, with no TaskSt... signal. Precise 1800.000s kill intervals made this unusually well-documented.
5. **[#84851](https://github.com/anthropics/claude-code/issues/84851)** — *CLOSED (stale)* — Windows MSIX auto-update corrupts the package (Modified, NeedsRemediation), leaving the app unlaunchable and Repair failing. Serious updater reliability concern for Windows desktop users.
6. **[#89283](https://github.com/anthropics/claude-code/issues/89283)** — *CLOSED (stale)* — Desktop app creates duplicate project directories for UNC cwd due to trailing-separator normalization, causing daily chat-history loss. Data-loss severity noted.
7. **[#104410](https://github.com/anthropics/claude-code/issues/104410)** — *OPEN, cross-platform* — Remote Control sessions drop and don't self-recover; cross-session messages silently lost and identities change on reconnect. Undermines multi-session orchestration as a backbone.
8. **[#89882](https://github.com/anthropics/claude-code/issues/89882)** — *CLOSED (stale)* — `ListAgents`/`SendMessage` peer identity and reachability degrade after idle gaps in long-running multi-session coordination. Same orchestration reliability theme.
9. **[#75334](https://github.com/anthropics/claude-code/issues/75334)** — *CLOSED (stale)* — Auto-memory system ineffective: memories written but not reliably read/acted on across sessions. Recurring theme echoed by #84265 and #78375 (rules not followed).
10. **[#104069](https://github.com/anthropics/claude-code/issues/104069)** — *OPEN* — Linux GNOME Wayland: Quick Entry shortcut binds via GlobalShortcuts portal but Quick Entry never opens. Fresh, narrow, platform-specific desktop bug.

## 4. Key PR Progress

Only one PR was updated in the last 24h:

1. **[#29757](https://github.com/anthropics/claude-code/pull/29757)** — *CLOSED* — `docs(plugin-dev)`: clarifies skill naming in the skill-development guide — updates the frontmatter example to a lowercase hyphenated name, adds a metadata note that skill names must match the kebab-case directory identifier, and adds a review checklist item. Closes #24556.

*(No other PRs met the volume threshold for this window; the remaining nine slots are intentionally left unfilled rather than padded.)*

## 5. Hot Discussions

No discussion data was provided for this window. Section omitted.

## 6. Feature Request Trends

Distilled from today's issue set:

- **Guardrail configurability** — Multiple requests (#78160, #89957, #89949, #89961) ask for permission-gated opt-ins or a way to distinguish legitimate dev/test/security research from abuse. This is the single loudest enhancement cluster.
- **Desktop/TUI customization** — Terminal font family (#48805, 63 👍), Ctrl+Scroll zoom in fullscreen render mode (#89952), and Quick Entry fixes (#104069) show sustained demand for terminal/desktop UX parity.
- **Agent & session observability** — Show model per background agent (#82282), timestamps/elapsed time in session history (#84075), and PR-status coloring on unfocused rows (#82052) are all about making the Fleet/Agent view more legible.
- **Routines ergonomics** — Run a routine directly from its row (#89958) signals interest in streamlining manual routine execution.
- **Artifact sharing visibility** — View tracking for shared artifacts (#89962) points to team/collaboration use cases maturing.

## 7. Developer Pain Points

Recurring frustrations across the batch:

1. **Cost/rate-limit opacity** — The headless vs. interactive token-window discrepancy (#97074) is the standout; developers need predictable automation budgeting.
2. **Orchestration unreliability** — Remote Control session drops (#104410), stale agent peer discovery (#89882), and silent message loss make multi-session workflows fragile.
3. **Agent ignores instructions & memory** — A dense cluster (#75334, #84265, #78375, #89950) reports rules not followed, memory not acted on, and autonomous behavior overriding explicit user directives. This is the most emotionally charged theme ("CONSTANTLY", "who is in charge?").
4. **Guardrail false positives** — Legitimate sysadmin, smart-home, and system-analysis work flagged as cyber/policy violations (#89961, #89959, #89949, #89957).
5. **Stale auto-closure fatigue** — A large share of today's items are `[stale]`-closed without resolution, which may erode community trust if the underlying bugs persist.
6. **Platform-specific breakage** — Windows MSIX updater corruption (#84851), UNC path data loss (#89283), Linux Wayland Quick Entry (#104069), and macOS skill tooltip stickiness (#100897) each hit distinct user segments.

---
*Generated from github.com/anthropics/claude-code activity on 2026-10-25 (digest date 2026-10-26).*

</details>

<details>
<summary><strong>OpenAI Codex</strong> — <a href="https://github.com/openai/codex">openai/codex</a></summary>

# OpenAI Codex Community Digest — 2026-10-26

## 1. Today's Highlights

The Codex repository saw no new releases or merged PRs in the last 24 hours, but community activity remains intense—50 issues and 9 discussions were updated. The dominant theme is a **large cluster of Windows-specific regressions** across the desktop app, VS Code extension, sandbox, and Computer Use subsystems, several of which are blocking basic workflows (UI startup, thread resume, MSIX install). A secondary thread of discussion centers on **rate-limit transparency and usage visibility**, with users building their own tooling in the absence of a native `codex status` command.

## 2. Releases

No new releases in the last 24 hours. *(Section omitted per data.)*

## 3. Hot Issues

1. **#49383 — Windows Computer Use screenshot capture fails (FrameArrived timeout / E_INVALIDARG)** — [link](https://github.com/openai/codex/issues/49383)
   Highest-engagement issue (37 comments). Computer Use cannot reliably capture app windows on Windows, breaking the agent's ability to "see" the screen. High impact for anyone relying on desktop automation.

2. **#56691 — Codex 26.1021.22027 fails to start UI in VS Code 1.143.1 on Windows** — [link](https://github.com/openai/codex/issues/56691)
   30 comments, 14 👍. A fresh regression that blocks the extension from loading at all in the latest VS Code on Windows—the most upvoted issue in this batch.

3. **#50171 — Windows local task cannot continue (placement format version 2 / CloudThreadNotFoundError)** — [link](https://github.com/openai/codex/issues/50171)
   Breaks continuity of existing connected Windows tasks; a full restart does not resolve it.

4. **#56264 — Thread resume fails after update (MXC process.env lacks SYSTEMROOT)** — [link](https://github.com/openai/codex/issues/56264)
   Sandbox helper passes a reduced environment to the MXC launcher, so chats fail before even loading `AGENTS.md`. Clear root-cause analysis from the reporter.

5. **#53132 — MSIX installation repeatedly fails (0x80073CF6 / 0x80070005)** — [link](https://github.com/openai/codex/issues/53132)
   Stale packaged-service registration prevents install/repair on Windows 11, leaving users unable to update.

6. **#50728 — macOS Computer Use typing/paste duplication; 16–56s keyboard latency** — [link](https://github.com/openai/codex/issues/50728)
   A cross-platform Computer Use reliability problem; reporter includes CoreGraphics event-tap diagnostics.

7. **#54956 — Improve Codex Plus usage efficiency across all models** — [link](https://github.com/openai/codex/issues/54956)
   Enhancement request that captures broad frustration with how quickly quotas are consumed, and asks for cheaper experimental model access.

8. **#56771 — VS Code Remote SSH: webview never becomes ready (renderer_ready_timeout)** — [link](https://github.com/openai/codex/issues/56771)
   Blocks Codex over Remote SSH on Linux ARM64—an important workflow for server-side development.

9. **#54004 — Windows Pro: stalled agents and repeated HTTP 429s** — [link](https://github.com/openai/codex/issues/54004)
   A paying Pro user ($229/mo) reports severe degradation. Highlights the reputational risk of rate-limit behavior on high-tier plans.

10. **#56951 — Codex ends turns after review/checkpoint milestones despite unfinished work** — [link](https://github.com/openai/codex/issues/56951)
    Model-behavior bug on CLI 0.164.0 where the agent prematurely terminates multi-step tasks—directly undermines agentic reliability.

## 4. Key PR Progress

No pull requests were updated in the last 24 hours, so there is no PR activity to report. *(Section omitted per data.)*

## 5. Hot Discussions

**General**
- **#42049 — Bundled-marketplace refresh leaks staging directories (~31 GiB / 323 dirs on macOS)** — [link](https://github.com/openai/codex/discussions/42049)
  A serious disk-exhaustion bug in Codex Desktop; strong candidate for a quick engineering fix.
- **#56932 — Tracking 5h/weekly usage outside the TUI via `account/rateLimits/read` + rollout token_count** — [link](https://github.com/openai/codex/discussions/56932)
  Community workaround for the lack of `codex status --json`; ties directly into the rate-limit frustration seen in Issues.

**Q&A**
- **#52835 — AI-assisted KPI system: 4 months in, still no working app** — [link](https://github.com/openai/codex/discussions/52835)
  A sobering real-world account from a non-developer using Codex for business software; useful signal on expectations and tooling gaps.
- **#56069 — Is picture-in-picture supported for MCP Apps on macOS?** — [link](https://github.com/openai/codex/discussions/56069)
  MCP App UI integration question from a plugin developer.
- **#55553 — Remote execution preflight EACCES on process executable link** — [link](https://github.com/openai/codex/discussions/55553)
  Requests attribution and a support route for a sandbox/permissions failure in remote Linux workflows.

**Show and tell**
- **#56176 — Agent Relay Check: does a fresh session actually receive AGENTS.md?** — [link](https://github.com/openai/codex/discussions/56176)
  A repeatable before/after test for instruction-file propagation—useful given the #56264 resume bug.
- **#56731 — Agoryx: local-first shared conversation for Codex + Claude Code** — [link](https://github.com/openai/codex/discussions/56731)
  MIT-licensed GUI that puts both agents in one thread with the human directing a build/review loop.
- **#56856 — MarketMirror: test ads and pitches on simulated buyers** — [link](https://github.com/openai/codex/discussions/56856)
  AGPL-3.0 MCP server/plugin for pre-flight marketing experiments.
- **#55643 — Kingdoms: playing a strategy prototype by talking to Codex** — [link](https://github.com/openai/codex/discussions/55643)
  A creative demo of conversational game-state control.

## 6. Feature Request Trends

- **Usage/limit transparency:** Requests for visible remaining quotas (#56209) and better Plus-tier efficiency (#54956), plus the DIY usage-tracking thread (#56932), point to a strong demand for a native usage API/CLI.
- **MCP lifecycle control:** #56970 asks for an agent-callable MCP reconnect/rediscovery operation; #56069 asks about PiP support for MCP App UIs—signs MCP Apps are maturing into a platform.
- **Session/project portability:** #56979 requests moving chats between projects across clients; #42613 requests permanent deletion of archived chats.
- **Model/reasoning transparency:** #56977 asks for child-task metadata to expose resolved model and reasoning effort—an observability gap in subagent orchestration.
- **UI/UX polish:** Composer Predictions regressed (#55219), macOS Dock icon settings don't propagate (#31186), and voice dictation can silently truncate (#21448).

## 7. Developer Pain Points

- **Windows is the epicenter of breakage.** Ten of the top issues are Windows-tagged (UI startup, thread resume, MSIX install, sandbox `apply_patch`, Computer Use, MCP auth). The pattern—regressions appearing immediately after updates—suggests insufficient pre-release testing on Windows.
- **Computer Use remains unreliable cross-platform.** Screenshot capture (#49383), typing duplication/latency (#50728), and lost scroll/input control (#38508) collectively indicate the automation layer is not yet production-grade.
- **Sandbox and environment handling is brittle.** `SYSTEMROOT` missing in `process.env` (#56264), `apply_patch` failing in writable dirs (#54947), and EACCES preflight (#55553) all stem from environment/sandbox plumbing.
- **Rate limits dominate sentiment.** Multiple issues (#54956, #54004, #56209, #55443) and a discussion (#56932) converge on the same complaint: high-paying users cannot predict or monitor consumption, and "at capacity" errors interrupt tasks.
- **Agentic reliability gaps.** Premature turn termination (#56951) and stalled agents (#54004) erode trust in multi-step workflows—exactly the use case Codex is marketed for.

---
*Generated from github.com/openai/codex data for 2026-10-25 → 2026-10-26.*

</details>

<details>
<summary><strong>Gemini CLI</strong> — <a href="https://github.com/google-gemini/gemini-cli">google-gemini/gemini-cli</a></summary>

# Gemini CLI Community Digest — 2026-10-26

## 1. Today's Highlights

Activity this cycle is dominated by **agent reliability work**: several p1 bugs around subagent termination semantics, hangs, and browser-agent failures remain open and actively triaged. In parallel, a large wave of small platform/compatibility PRs landed from the community — Windows path expansion, Android/Termux ripgrep, TortoiseGitPlink SSH handling, and Unicode/whitespace preservation — signaling that cross-platform polish is a growing priority. No stable release shipped; only the routine nightly.

## 2. Releases

- **v0.67.0-nightly.20261025.gcd1b45c2d** — routine nightly build. No notable changes highlighted beyond the changelog.
  [Compare](https://github.com/google-gemini/gemini-cli/compare/v0.67.0-nightly.20261024.gcd1b45c2d...v0.67.0-nightly.20261025.gcd1b45c2d)

## 3. Hot Issues

1. **#22323 — Subagent MAX_TURNS reported as GOAL success** (p1, 13 comments) — A correctness bug where `codebase_investigator` claims success despite hitting its turn limit. This undermines trust in agent output and is the most-discussed issue today.
   https://github.com/google-gemini/gemini-cli/issues/22323

2. **#21409 — Generalist agent hangs** (p1, 8 👍) — The agent hangs indefinitely on simple tasks unless sub-agent deferral is disabled. High community signal (most upvoted in this set).
   https://github.com/google-gemini/gemini-cli/issues/21409

3. **#19873 — Zero-Dependency OS Sandboxing & Post-Execution Intent Routing** (p2, 9 comments) — Proposes leveraging Gemini 3's native bash affinity with sandboxing for security/UX. A strategic architectural discussion.
   https://github.com/google-gemini/gemini-cli/issues/19873

4. **#22745 — AST-aware file reads, search, and mapping** (p2, 7 comments) — EPIC investigating AST tooling to cut misaligned reads and token noise. Foundational for future token efficiency.
   https://github.com/google-gemini/gemini-cli/issues/22745

5. **#21968 — Gemini does not use skills/sub-agents enough** (p2, 7 comments) — Anecdotal but common: the model won't invoke custom skills unless explicitly told. Directly affects extensibility value.
   https://github.com/google-gemini/gemini-cli/issues/21968

6. **#21983 — Browser subagent fails on Wayland** (p1) — Platform-specific failure for Linux Wayland users; notable for desktop/Linux adoption.
   https://github.com/google-gemini/gemini-cli/issues/21983

7. **#22267 — Browser Agent ignores settings.json overrides** (p2) — Config `maxTurns` etc. are read by `AgentRegistry` but not honored at runtime. Config-trust issue.
   https://github.com/google-gemini/gemini-cli/issues/22267

8. **#24246 — 400 error with >128 tools** (p2) — Tool-count scaling limit; matters as MCP servers proliferate.
   https://github.com/google-gemini/gemini-cli/issues/24246

9. **#22672 — Agent should discourage destructive behavior** (p2) — Model uses `git reset`/`--force` when safer alternatives exist. Safety-relevant.
   https://github.com/google-gemini/gemini-cli/issues/22672

10. **#29939 — Add Vim keybindings (Vi mode)** — Freshly filed (2026-10-25), tapping a strongly-requested UX niche.
    https://github.com/google-gemini/gemini-cli/issues/29939

## 4. Key PR Progress

1. **#29942 — Scan complete plan content and report read failures** — Fixes a 1 KB sampling bug that rejected valid plans with long whitespace prefixes.
   https://github.com/google-gemini/gemini-cli/pull/29942

2. **#29935 — Preserve whitespace in referenced file content** — `@file` attachments currently lose indentation/trailing newlines; a meaningful correctness fix.
   https://github.com/google-gemini/gemini-cli/pull/29935

3. **#29931 / #29923 — Expand Windows home-relative paths** — Two PRs enabling `~\policies\custom.toml` resolution on Windows.
   https://github.com/google-gemini/gemini-cli/pull/29931 · https://github.com/google-gemini/gemini-cli/pull/29923

4. **#29871 — Keep unsent request when loop recovery starts** — Prevents dropped `functionResponse` and spurious "response lost" errors.
   https://github.com/google-gemini/gemini-cli/pull/29871

5. **#29912 — Strip trailing punctuation from web_fetch URLs** — Fixes comma-separated URL lists producing invalid URLs.
   https://github.com/google-gemini/gemini-cli/pull/29912

6. **#29823 — Fallback to system ripgrep on Android/Termux** — Fixes `spawn ENOENT` by skipping bundled glibc binaries under Bionic libc.
   https://github.com/google-gemini/gemini-cli/pull/29823

7. **#29901 — ACP: let clients steer a running turn** — Enables mid-turn user messages for Zed/JetBrains/VS Code ACP clients, matching terminal steering.
   https://github.com/google-gemini/gemini-cli/pull/29901

8. **#29924 — Preserve Unicode in session previews** — Non-ASCII prompts currently produce empty/misleading previews.
   https://github.com/google-gemini/gemini-cli/pull/29924

9. **#19013 — Fix Windows EBUSY extension update lock** — Long-standing Windows extension-update fix (fixes #18884).
   https://github.com/google-gemini/gemini-cli/pull/19013

10. **#26844 — Add missing CustomTheme properties to validation schema** — Resolves `"Unrecognized key"` startup errors from Zod strict validation.
    https://github.com/google-gemini/gemini-cli/pull/26844

*Also notable:* **#29922 / #29921** recognize TortoiseGitPlink as a PuTTY-family SSH client to fix git batch mode.

## 5. Hot Discussions

No Discussion data was provided for this cycle.

## 6. Feature Request Trends

Distilled from current issues and PRs, the most-requested directions are:

- **Agent orchestration quality** — Better subagent lifecycle handling, turn-limit semantics, self-awareness of CLI flags/hotkeys, and visible subagent trajectories (`/chat share`).
- **Token efficiency & context discipline** — AST-aware reads/search, "Tactful Extraction" surgical reads (#19561), and persistent file-based task tracking to replace in-context todos (#18836).
- **Security & safety guardrails** — OS sandboxing (#19873), discouraging destructive git/DB operations (#22672), and the long-running Conseca dynamic security layer (#13193).
- **Cross-platform parity** — Repeated requests/fixes for Windows, Android/Termux, and Wayland.
- **IDE/editor integration** — ACP steering (#29901) and Vim keybindings (#29939).
- **Config reliability** — Honoring `settings.json`, per-workspace policies (#18397).

## 7. Developer Pain Points

Recurring frustrations visible across this data:

- **Agent hangs and silent failures** — Generalist agent hangs (#21409) and browser-agent Wayland failures (#21983) cause long, unproductive waits with poor diagnostics.
- **Misleading success signals** — Agents reporting `GOAL`/`success` while actually failing (turn limits), eroding trust (#22323, #21983).
- **Configuration not respected** — `settings.json` overrides ignored by browser agent (#22267); unrecognized theme keys causing startup errors (#26844).
- **Tool-count scaling** — 400 errors once tool count exceeds ~128 (#24246).
- **Cross-platform rough edges** — Windows extension update locks (#19013), path/SSH handling, Android ripgrep, and Unicode/whitespace loss in file references — a persistent tax on non-macOS/Linux users.
- **Subagent under-utilization** — Model avoids skills/subagents unless explicitly instructed (#21968), plus missing subagent context in bug reports (#21763).

*Digest generated from the google-gemini/gemini-cli repository data for 2026-10-26.*

</details>

<details>
<summary><strong>GitHub Copilot CLI</strong> — <a href="https://github.com/github/copilot-cli">github/copilot-cli</a></summary>

# GitHub Copilot CLI Community Digest — 2026-10-26

## 1. Today's Highlights

No new releases or PRs landed in the last 24 hours, but issue activity remains intense: a pair of triage-level reports (#5254, #5253) flag severe memory growth (37 GiB) and session-lock timeouts in v1.0.103 during long parallel-agent runs. Meanwhile, the ACP integration path continues to attract parity requests (usage updates, mid-turn steering) as third-party clients like Zed push for feature equivalence with the interactive TUI.

## 2. Releases

_No releases published in the last 24 hours._

## 3. Hot Issues

1. **[#5254](https://github.com/github/copilot-cli/issues/5254) — 1.0.103: main process grows to 37 GiB (triage, OPEN)** — A 6h19m resumed session on a 32 GiB Mac hit 37.3 GiB physical footprint with 133M malloc allocations and 10.7 GiB fragmentation. Zero comments so far, but this is a critical stability signal for long-running agent workflows.

2. **[#5253](https://github.com/github/copilot-cli/issues/5253) — Persistent session-lock timeouts in 1.0.103 (triage, OPEN)** — Sessions become unresponsive with `session lock unavailable during is_session_generation_current: acquisition timed out`, even while nested tools still run. Two comments suggest it's reproducible, not a one-off.

3. **[#4233](https://github.com/github/copilot-cli/issues/4233) — ACP `usage_update` parity (OPEN, 👍4)** — The most-upvoted item today. ACP clients (Zed, etc.) can't display context-window or AI-credit usage because `--acp` never emits `usage_update`, despite the CLI already computing it for `/context` and `/usage`.

4. **[#5115](https://github.com/github/copilot-cli/issues/5115) — ACP `/rename` reports success but does nothing (OPEN)** — Silent failure in `--acp --stdio` mode: command ends `end_turn` in ~1 ms with no model call and no rename. Undermines ACP client session management.

5. **[#5195](https://github.com/github/copilot-cli/issues/5195) — Custom agent disables deferred MCP tool loading (OPEN)** — With tool search enabled, selecting a custom agent causes every MCP tool from every server to flood context from the second model call onward. A serious context-budget regression for MCP-heavy setups.

6. **[#5201](https://github.com/github/copilot-cli/issues/5201) — Prompt-budget rejection not machine-identifiable (OPEN)** — Headless JSON-RPC errors return `errorType: "query"` with no `errorCode` or remediation hint, making automated retry/compaction logic impossible. CI integrators will feel this one.

7. **[#5147](https://github.com/github/copilot-cli/issues/5147) — `/restart` fails with `--new-session-id` (OPEN)** — Argument conflict (`--new-session-id` vs `--session-id`) breaks every restart after launching with an explicit session ID. Related closed issue #4493 shows this is a recurring class of bug.

8. **[#5250](https://github.com/github/copilot-cli/issues/5250) — macOS Entra-broker MCP sign-in failures at startup (OPEN)** — Concurrent sign-ins are rejected with "sign-in is already in progress," and a rejected cached token isn't recovered. Blocks Azure DevOps remote MCP on macOS entirely.

9. **[#5236](https://github.com/github/copilot-cli/issues/5236) — Windows Entra token cache stays 0 bytes (OPEN)** — Companion to the macOS bug: after MCP sign-in, the cache file is written but empty, so every new process re-prompts for the account picker.

10. **[#5109](https://github.com/github/copilot-cli/issues/5109) — "copilot-cli is unusable" under enterprise managed policy (OPEN)** — A blunt but representative report: managed account policy refresh loops, blocking startup on v1.0.95. Echoed by #5130's "constant error message" complaint.

_Honorable mentions:_ [#4977](https://github.com/github/copilot-cli/issues/4977) (jemalloc page-size abort on 16KB ARM64 / Asahi Linux), [#4401](https://github.com/github/copilot-cli/issues/4401) (Windows skill discovery regression), [#5226](https://github.com/github/copilot-cli/issues/5226) (voice language hard-coded to `auto`).

## 4. Key PR Progress

_No pull requests were updated in the last 24 hours._

## 5. Hot Discussions

_No discussion data was provided in this dataset; section omitted._

## 6. Feature Request Trends

- **ACP feature parity with the interactive TUI** — Two open requests today alone: `usage_update` emission (#4233, 👍4) and mid-turn steering (#5198). The ACP surface is becoming a first-class integration target for editors like Zed, and users expect the same capabilities as the TUI.
- **Stable release channel** — #5203 asks for Stable/Beta channels to shield daily users from regressions introduced by the rapid release cadence — a direct response to bugs like #5254 and #5253 in 1.0.103.
- **Context-budget efficiency** — #5251/#5252 (duplicate pair) request adaptive, non-duplicative tool/prompt loading, citing ~40k tokens of fixed injected context before the first user message. Combined with #5195, context economy is clearly top-of-mind.
- **Local web UI** — #3301 (👍3) continues to accumulate support for an `opencode web`-style browser interface, arguing the terminal-only TUI limits adoption.
- **Localization / voice configurability** — #5226 requests making the voice transcription language configurable rather than hard-coded to `auto`.

## 7. Developer Pain Points

- **Memory and resource exhaustion in long sessions** — #5254's 37 GiB footprint and #5253's lock timeouts point to scaling limits in the session/agent architecture under sustained parallel-agent load.
- **Entra-broker authentication is fragile cross-platform** — #5250 (macOS concurrent sign-in rejection) and #5236 (Windows 0-byte token cache) together suggest the native Entra account-broker path needs a dedicated hardening pass for MCP servers.
- **State/session flag conflicts break recovery flows** — `/restart` fails under both `--new-session-id` (#5147) and `-w` (#4493, closed), and remote session lists go stale (#5202). Session lifecycle management is a persistent weak point.
- **Enterprise managed policy loops** — #5109 and #5130 report the same recurring "managed account policy" error, blocking enterprise users from starting the CLI at all.
- **Opaque, non-actionable errors in headless mode** — #5201's missing error codes and #5115's silent `/rename` success make automation and ACP client integration brittle.
- **Release velocity vs. stability** — #5203 captures the meta-complaint: frequent releases are introducing regressions that disrupt daily use, driving demand for a stable channel.

---

*Digest generated from github.com/github/copilot-cli issue activity on 2026-10-26. No releases, PRs, or discussions were active in the reporting window.*

</details>

<details>
<summary><strong>OpenCode</strong> — <a href="https://github.com/anomalyco/opencode">anomalyco/opencode</a></summary>

# OpenCode Community Digest — 2026-10-26

## 1. Today's Highlights

The dominant theme today is a **free-tier quota crisis**: at least a dozen issues report that free-usage limits never reset, countdowns sawtooth back to 86,400s after hitting zero, and paid "Go" subscribers are still blocked by "free usage exceeded" errors. A second cluster centers on **v2 plugin/tool regressions** — catalog-registered tools that can't be invoked directly, subagents silently returning empty results, and agents/providers listing before plugins finish activating. Maintainer `kitlangton` continues landing a steady stream of `beta`-backported perf and correctness fixes via `Hona`.

## 2. Releases

No new releases in the last 24 hours.

## 3. Hot Issues

1. **[#34344](https://github.com/anomalyco/opencode/issues/34344) — Unlimited usage exploit on free models (CLOSED, 56 comments)** — Reporter demonstrates that free-model rate limits are keyed to IP, so a VPN rotation fully resets quota; automated rotation sustained DeepSeek v4 Flash and MiMo v2.5 usage. Highest-engagement thread of the day and the likely root of the quota-fix churn below.
2. **[#58781](https://github.com/anomalyco/opencode/issues/58781) — Free Usage Exceeded on all free models in Desktop 1.19.4 (13 comments, 👍9)** — Broad regression affecting every free model on desktop, driving the highest upvote count of the day.
3. **[#58831](https://github.com/anomalyco/opencode/issues/58831) — Free quota timeout never recovers, sawtooths at 86400s (👍2)** — Countdown hits zero and immediately restarts at 24h; matches multiple duplicate reports (#58933, #59038, #58902), indicating a server-side reset bug rather than client display.
4. **[#39986](https://github.com/anomalyco/opencode/issues/39986) — TUI: support reactive external TSX plugins in packaged CLI (7 comments)** — Packaged Bun CLI mishandles OpenTUI's Solid runtime transform for external plugins; signals render once but never update. Core to the v2 plugin story.
5. **[#36348](https://github.com/anomalyco/opencode/issues/36348) — V2: define restart semantics for foreground/background shells (6 comments)** — Shell process ownership is process-local, so a managed-server restart orphans long-running jobs. Important 2.0 design question for anyone running background agents.
6. **[#50312](https://github.com/anomalyco/opencode/issues/50312) — Plugin tools in catalog cannot be invoked directly (6 comments)** — Tools registered via V2 plugins appear with a `tools.` prefix but fail with "No tool named … is currently available" on direct invocation; works only through `execute`. Duplicated by #58778, suggesting a systemic Code Mode dispatch gap.
7. **[#53623](https://github.com/anomalyco/opencode/issues/53623) — "Code Mode" instructions confuse Gemma-4-31B (👍2)** — Prompt wording causes the model to believe every tool must be wrapped in `execute`; the reporter also asks for a general prompt debugging/modification path.
8. **[#57603](https://github.com/anomalyco/opencode/issues/57603) — Delegated subagent write silently denied on "ask" permission (v2 regression)** — No approval prompt appears anywhere in Desktop; a v1→v2 behavioral break in the permission flow that undermines subagent trust.
9. **[#59051](https://github.com/anomalyco/opencode/issues/59051) — Subagent completes (idle_outcome=succeeded, real token cost) but returns empty result** — Parent receives "Subagent completed without a text response" while the child did real work; a silent data-loss class bug for multi-agent workflows.
10. **[#56057](https://github.com/anomalyco/opencode/issues/56057) / [#59047](https://github.com/anomalyco/opencode/issues/59047) — Desktop file tree unusable out of the box** — `showFileTree` defaults to `false` with no Settings UI, and the toggle renders `disabled: true` with no palette command. Two independent reports of the same UX dead-end.

## 4. Key PR Progress

1. **[#59046](https://github.com/anomalyco/opencode/pulls/59046) — ci: separate release builds from signing and publishing** — Splits `publish.yml` into plan/build/sign jobs, scopes every secret-using job to the `release` environment, adds CODEOWNERS and least-privilege permissions. Supply-chain hygiene for the release pipeline.
2. **[#59089](https://github.com/anomalyco/opencode/pulls/59089) — refactor(core): route FileAccess through Environment** — Removes direct host-disk reads from the path-approval logic, enabling workspace/remote Environments. Foundational for sandboxing.
3. **[#58803](https://github.com/anomalyco/opencode/pulls/58803) — perf(core): warm provider connection at prompt admission** — Opens DNS/TCP/TLS while the prompt is admitted and context loads, so the first model request reuses a warm socket; also warms the provider you switch to. Opt-in.
4. **[#59085](https://github.com/anomalyco/opencode/pulls/59085) — fix(app): slide between questions instead of flashing the question dock** — Replaces the opacity-fade question swap (which flashed near-empty cards) with directional slide transitions.
5. **[#59074](https://github.com/anomalyco/opencode/pulls/59074) — feat(core): add pcre2 option to grep tool** — Unlocks look-around and backreferences (e.g. `(?<![\w.])log(?![\w])`) by letting ripgrep use PCRE2. Long-requested for code search.
6. **[#59086](https://github.com/anomalyco/opencode/pulls/59086) — fix(core): reload compatibility skills only for their own sources** — Stops `.claude`/`.agents` skill rescans on unrelated config changes that were spamming `skill.updated` events to every client.
7. **[#59082](https://github.com/anomalyco/opencode/pulls/59082) — fix(server): let agent and provider lists wait for plugins** — Closes the startup race where clients cached a partial catalog and could send with the wrong agent/model (fixes #51282).
8. **[#56673](https://github.com/anomalyco/opencode/pulls/56673) — fix(core): retry and then fail turns that finish with no output** — Addresses Gemini intermittently closing SSE streams with `finishReason: STOP` and zero tokens, which previously synthesized a bogus `incomplete-stream` failure.
9. **[#58743](https://github.com/anomalyco/opencode/pulls/58743) + [#58657](https://github.com/anomalyco/opencode/pulls/58657) + [#58742](https://github.com/anomalyco/opencode/pulls/58742) — experimental `media:<hash>` blob storage** — Long screenshot-heavy sessions stop re-sending base64 on every load; bytes fetch on demand, with an offline backfill script for legacy rows. Opt-in via `experimental.media_blob`.
10. **[#58297](https://github.com/anomalyco/opencode/pulls/58297) — fix(core): support GitHub Bot in v2** — Ports `opencode github install/run` from v1, closing a notable v2 feature gap (#57911, possibly #58129).

## 5. Hot Discussions

No Discussions data was provided; section omitted.

## 6. Feature Request Trends

- **Prompt/skill ergonomics**: debug and modify prompts directly (#53623), deactivate spell-check (#58784).
- **TUI/Desktop UX**: sidebar session tabs in CLI (#58797), workspace lock to prevent file modification (#58241).
- **Extensibility & automation**: reactive external TSX plugins in packaged CLI (#39986), GitHub Bot parity in v2 (#58297).
- **Search capability**: PCRE2 look-around in grep (#59074) — merged direction of a long-standing ask.
- **Storage/perf**: media blob refs to stop base64 re-transmission (#58743/#58657), warm provider sockets (#58803).
- **Quota model changes**: numerous free-tier users are effectively requesting either a transparent reset schedule or a fairer per-account (not per-IP) limit (see #34344, #58805, #58831).

## 7. Developer Pain Points

1. **Free-tier quota system is broken and opaque.** The single largest frustration cluster: countdowns that reset to 86,400s at zero (#58831, #58933, #59038, #58902), per-IP limiting that penalizes shared fiber connections (#58805), and paid Go subscribers still receiving "free usage exceeded" (#58773, #58828). The IP-based design (#34344) is both exploitable and unfair to legitimate users behind CGNAT.
2. **V2 plugin/tool invocation regressions.** Catalog tools fail on direct invocation (#50312, #58778), agents/providers list before plugins activate (#51282 → fixed by #59082), and compatibility skills over-reload (#59086). Plugin authors are effectively debugging the harness.
3. **Silent failures in multi-agent flows.** Subagent writes denied without any prompt (#57603) and subagents returning empty results despite successful child sessions (#59051) erode trust in delegation — failures that produce no visible error are the worst class for agentic tooling.
4. **Desktop discoverability dead-ends.** The file tree is off by default with no settings UI and a disabled toggle (#56057, #59047), forcing users to edit config files for a basic feature.
5. **Release/CI trust.** Multiple in-flight PRs (#59046, backports via #59082–#59088) suggest recent releases shipped without the beta hardening, producing the v1→v2 behavior breaks users are now reporting.

</details>

<details>
<summary><strong>Pi</strong> — <a href="https://github.com/earendil-works/pi">earendil-works/pi</a></summary>

# Pi Community Digest — 2026-10-26

## 1. Today's Highlights

No new releases shipped in the last 24 hours, but issue and PR activity remains high across the coding agent and `pi-ai` layers. The dominant themes today are **provider interoperability bugs** (Anthropic tool removal, Kimi/Moonshot role handling, OpenRouter reasoning chunks) and **context/compaction edge cases** (llama.cpp overflow, unbounded file lists, re-overflow after recovery). A cluster of `robopipi[bot]` PRs also landed for Windows path handling, symlinked agent dirs, and provider-id-with-slash resolution — suggesting a focused clean-up sprint on cross-platform robustness.

## 2. Releases

No new releases in the last 24 hours.

## 3. Hot Issues

1. **#10956 — `cacheWarming: "idle"` silently stops** ([link](https://github.com/earendil-works/pi/issues/10956))
   Cache warming never fires once an extension handles `turn_end` or a compaction message is present in context. 507 logged `cache_warming_decision` events all at `continuationProbability: 1` — strong telemetry evidence. 10 comments, 2 👍; active debugging.

2. **#10628 — OSC 52 copy swallowed by tmux** ([link](https://github.com/earendil-works/pi/issues/10628))
   Fullscreen TUI copy-on-select doesn't wrap OSC 52 in a tmux passthrough, so tmux eats the sequence. Impactful for SSH/headless users; 5 👍 signals real-world pain.

3. **#11376 — [p0] Anthropic tool removal breaks all later requests** ([link](https://github.com/earendil-works/pi/issues/11376))
   Removing an initial tool mid-session (via extension reload) causes `tool_reference_unresolved` on every subsequent `claude-opus-5-5` call. Labeled `prio:p0`; AI-drafted but human-reviewed.

4. **#10885 — llama.cpp context overflow not detected** ([link](https://github.com/earendil-works/pi/issues/10885))
   `Context size has been exceeded.` from `llama-server` doesn't trigger auto-compaction, so sessions dead-end. Common setup for local-inference users.

5. **#11335 — MCP HTTP JSON bypasses `maxMessageBytes`** ([link](https://github.com/earendil-works/pi/issues/11335))
   A 512-byte limit is enforced for SSE but not for JSON responses — a security/correctness gap in MCP transport handling.

6. **#11297 — Compaction file lists grow unbounded** ([link](https://github.com/earendil-works/pi/issues/11297))
   Each compaction seeds `fileOps` from the previous compaction's details, so `<read-files>`/`<modified-files>` lists balloon across long sessions. Subtle context-bloat bug.

7. **#11311 — MCP OAuth hangs on "Connecting…"** ([link](https://github.com/earendil-works/pi/issues/11311))
   Successful browser auth, but Pi hangs 2–3 minutes and Ctrl+C does nothing. Bad UX for the OAuth flow.

8. **#9534 — OpenRouter drops signature-only reasoning chunks for Claude** ([link](https://github.com/earendil-works/pi/issues/9534))
   Long-standing (mid-September) issue that may affect reasoning preservation. Still open with 4 comments; worth triaging.

9. **#11361 — Expose `inheritEnv: false` for MCP stdio** ([link](https://github.com/earendil-works/pi/issues/11361))
   Native MCP stdio servers inherit the full Pi process env even when `env` is declared. Isolation request — small surface area, meaningful security win.

10. **#11394 — `--model "<provider>/<id>"` fails when provider id contains `/`** ([link](https://github.com/earendil-works/pi/issues/11394))
    Breaks URL-derived providers like `pi-llama-cpp`. Closed quickly with a fix-available label; multiple PRs (#11393, #11397) landed alongside.

## 4. Key PR Progress

1. **#10718 — Include system prompt in `--export` HTML** ([link](https://github.com/earendil-works/pi/pull/10718))
   Brings CLI export to parity with interactive `/export`. Open.

2. **#11397 — Resolve provider/id when provider id contains a slash** ([link](https://github.com/earendil-works/pi/pull/11397))
   Fixes `splitProviderPrefix()` splitting at the first `/`, breaking URL-derived ids. Closes #11394. Bot-authored.

3. **#11393 — Model-reference resolution for provider ids with `/`** ([link](https://github.com/earendil-works/pi/pull/11393))
   Community-authored fix for the same root cause, from the original reporter.

4. **#11399 — Normalize path separators in `check-entry-graphs` on Windows** ([link](https://github.com/earendil-works/pi/pull/11399))
   `path.relative()` returns `\` on Windows; allow/forbid patterns use `/`, silently bypassing checks.

5. **#11396 — Pass real path as npm prefix when agent dir is a symlink** ([link](https://github.com/earendil-works/pi/pull/11396))
   Fixes broken lockfile entries when `~/.pi` is symlinked into a dotfiles repo.

6. **#11395 — Unset all provider env vars in `pi-test.sh --no-env`** ([link](https://github.com/earendil-works/pi/pull/11395))
   Test harness had drifted behind `env-api-keys.ts`; leaked credentials into "no-env" runs.

7. **#11330 — Preserve split UTF-8 output in `pi.exec`** ([link](https://github.com/earendil-works/pi/pull/11330))
   Separate `StringDecoder` per stream; fixes mangled multibyte output (`你好` → `好`) across chunk boundaries.

8. **#11355 — Support Kimi Coding K3.1 Pro models** ([link](https://github.com/earendil-works/pi/pull/11355))
   Derives Kimi's K3 wire preset from parsed effort metadata rather than a hard-coded model list; fixes `reasoning_effort`, reasoning content preservation, and dynamic tool placement.

9. **#11367 — Lazy-compile models/keybindings/theme validators** ([link](https://github.com/earendil-works/pi/pull/11367))
   Moves TypeBox `Compile()` off module load to first use — modest startup-time win.

10. **#11409 — `pi update --extensions` npm audit noise** ([link](https://github.com/earendil-works/pi/issues/11409))
    Issue (closed) documenting that extension install omits `--no-audit`, and the suggested fix installs a second `pi` into the extension tree. Worth watching for a follow-up PR.

## 5. Hot Discussions

**Q&A / Show and tell**
- **#11404 — Official Pi code agent sandbox by Docker?** ([link](https://github.com/earendil-works/pi/discussions/11404))
  Docker appears to have published four sandbox images (`sbx/pi`, `sbx/pi-mixin`, `sbx/pi-image`, `sbx/pi-kit`). Community is asking whether these are official and how they relate to Pi. No replies yet — a good candidate for a maintainer response.

## 6. Feature Request Trends

- **MCP expansion & hardening**: elicitation support (#10274), `inheritEnv: false` for stdio (#11361), `maxMessageBytes` enforcement on JSON (#11335), OAuth reliability (#11311). The community is pushing MCP from "spec-compliant" toward "production-grade."
- **Context/compaction intelligence**: overflow detection for llama.cpp (#10885), bounded file-op lists (#11297), recovery from declared-vs-served `contextWindow` mismatch (#11387). Repeated requests for smarter, provider-aware context management.
- **Provider model coverage**: Bedrock GLM-5.3 (#11354), Kimi Coding K3.1 (#11355), Moonshot/Anthropic-compatible role handling (#11365). Steady demand for broader first-class provider support.
- **TUI/terminal ergonomics**: tmux OSC 52 passthrough (#10628), OSC 7501 / OSC 133 conflict (#11017), input loss on copy (#11379), `stripAnsi` CSI gaps (#11377). A long tail of terminal-integration polish.

## 7. Developer Pain Points

- **Silent failures with no diagnostics.** Cache warming stops without warning (#10956); auto-compaction misses server overflows (#10885); `tool_search` returns the wrong tool for exact-name queries (#11331). Users can't tell whether Pi is idle, stuck, or broken.
- **Provider interoperability is fragile.** Anthropic tool removal mid-session (#11376), Kimi role rejection (#11365), OpenRouter reasoning chunks (#9534), Moonshot detection gaps. The `openai-completions` / `anthropic-messages` abstraction leaks provider-specific behavior.
- **Context accounting diverges from reality.** Declared `contextWindow` vs served limit (#11387), unbounded compaction file lists (#11297), missing llama.cpp overflow detection (#10885). Long sessions degrade unpredictably.
- **Cross-platform rough edges.** Windows path separators in build scripts (#11399), symlinked agent dirs corrupting npm prefixes (#11396), local-path packages showing `dist` instead of package name (#11392).
- **Dependency hygiene.** Undici pin out of date for security fixes (#11208), `pi update --extensions` surfacing unfixable npm audit noise (#11409).
- **Tooling ergonomics.** `-e npm:` never re-fetches after first download (#11375), `--model` parsing broken by slashes in provider ids (#11394), `httpIdleTimeoutMs` enforced as a total deadline (#11388).

</details>

<details>
<summary><strong>Qwen Code</strong> — <a href="https://github.com/QwenLM/qwen-code">QwenLM/qwen-code</a></summary>

# Qwen Code Community Digest — 2026-10-26

## 1. Today's Highlights

Release activity is stalled: the `v0.26.1` CLI shipped, but both the SDK `0.1.23` publication and the managed-runtime release are blocked in CI, while a fresh P1 bug (forced `tool_choice` on Claude Sonnet/Opus 5.5) and a P1 auto-compaction double-count bug have surfaced. Meanwhile, Kubernetes/Helm deployment for the Managed Agent control plane and external Runtime provisioners are moving forward, and several core loop/hook correctness fixes landed as PRs.

## 2. Releases

No new releases in the last 24h. Note that `v0.26.1` is the current shipped version referenced across issues; downstream publication (SDK + managed runtime) is blocked (see #15498, #15499).

## 3. Hot Issues

1. **[#13395](https://github.com/QwenLM/qwen-code/issues/13395)** — *tracking(runtime): Kubernetes tool runtime progress & cross-platform delivery gate* (23 comments). Long-running tracker; two S1 fixes sit unmerged in PR #15457 and CI/ACK gates remain red. Community is watching this as the gating item for the whole K8s runtime roadmap.
2. **[#15498](https://github.com/QwenLM/qwen-code/issues/15498)** — *P1: SDK 0.1.23 publication blocked by integration timeouts after CLI v0.26.1* (11 comments). The `Run SDK Integration Tests` job hung ~6h and cancelled; `@qwen-code/sdk@0.1.23` never published. Directly blocks SDK consumers on 0.26.x.
3. **[#14724](https://github.com/QwenLM/qwen-code/issues/14724)** — *Main CI failed: Managed Agent gate — no test identified* (8 comments). Recurring bot-filed CI failure with repeated update markers; no test identified, suggesting flaky or mislabeled gates.
4. **[#15173](https://github.com/QwenLM/qwen-code/issues/15173)** — *Main CI failed: E2E Tests — no test identified* (7 comments). Docker sandbox E2E shard failing in `interactive/context-compress-interactive.test.ts`; ties into the context-compaction correctness cluster.
5. **[#15542](https://github.com/QwenLM/qwen-code/issues/15542)** — *P1: Anthropic provider JSON side queries fail with 400 on Claude Sonnet 5.5 / Opus 5.5* (3 comments). `tool_choice: {"type":"any"}` is rejected by these models. High-severity provider regression for Anthropic users; fix PR already open (#15558).
6. **[#15486](https://github.com/QwenLM/qwen-code/issues/15486)** — *P1: post-compaction size estimate double-counts pending tool result + 20K pad* (3 comments). Causes turns to be stopped or sent with `max_tokens: 1`. Core token-management correctness bug affecting long autonomous runs.
7. **[#15526](https://github.com/QwenLM/qwen-code/issues/15526)** — *P2: in warn mode the loop reminder is sent once, then a 59-call identical loop runs unguarded* (3 comments). Real user report: 70 identical `read_file` calls, 59 unguarded. Highlights the gap between loop-warning and loop-enforcement.
8. **[#15567](https://github.com/QwenLM/qwen-code/issues/15567)** — *P2: MCP startup failure omits child stderr from diagnostics* (4 comments). A stdio MCP server dying from a missing shebang interpreter yields only "disconnected" with no actionable stderr — a straightforward diagnostics-quality fix.
9. **[#15545](https://github.com/QwenLM/qwen-code/issues/15545)** — *P3: threshold-triggered handover continuation* (5 comments). Proposes writing a handover report at a configurable fill level then continuing in a fresh context — a structural alternative to auto-compaction's silent quality decay.
10. **[#15056](https://github.com/QwenLM/qwen-code/issues/15056)** — *P2: local `/autofix-pr` to watch a PR and fix CI failures, review feedback and conflicts* (6 comments). Strong community appetite for bringing the CI-autofix loop into local sessions.

## 4. Key PR Progress

1. **[#15558](https://github.com/QwenLM/qwen-code/pull/15558)** — *fix(core): avoid unsupported forced Anthropic tool selection*. Direct fix for #15542; switches to `auto` with explicit tool naming on Opus/Sonnet 5.5, Fable 5.1, Mythos 5.1.
2. **[#15575](https://github.com/QwenLM/qwen-code/pull/15575)** — *fix(core): preserve hook dedup across compaction*. Prevents duplicated `UserPromptSubmit` hook context after automatic compaction; complements #15552.
3. **[#15559](https://github.com/QwenLM/qwen-code/pull/15559)** — *fix(core): settle loop reminder delivery at model-acceptance boundary*. Fixes #15537 (reminder/telemetry lost before send while telemetry records delivery).
4. **[#15492](https://github.com/QwenLM/qwen-code/pull/15492)** — *feat(managed): add experimental Kubernetes deployment*. One-command Helm install for the signed Managed Agent control plane with co-located Hosted Harness and MySQL.
5. **[#15422](https://github.com/QwenLM/qwen-code/pull/15422)** — *feat: persistent session Workflow mode (DW-04A)*. Session-scoped workflow preference across CLI flag, `/workflows mode`, SDK, and ACP/daemon.
6. **[#15458](https://github.com/QwenLM/qwen-code/pull/15458)** — *feat(core): use XDG config directory for new installs on Linux*. Moves global state to `$XDG_CONFIG_HOME/qwen` — a long-standing packaging hygiene request.
7. **[#15388](https://github.com/QwenLM/qwen-code/pull/15388)** — *feat(ci): bound autofix takeover with a round budget*. Adds `@qwen-code /takeover for N` (1–99) to cap autofix loops.
8. **[#15538](https://github.com/QwenLM/qwen-code/pull/15538)** — *feat(ci): canary-split the PR review model by PR number*. Enables percentage-based canary rollouts of review models via repo variables.
9. **[#15466](https://github.com/QwenLM/qwen-code/pull/15466)** — *feat(serve): add user-scope Skill activation routes*. New daemon routes for enabling/disabling Skills at user scope, with batch support up to 100 names.
10. **[#15368](https://github.com/QwenLM/qwen-code/pull/15368)** — *fix(memory): match reader advice to the binding index budget*. Makes memory-index overflow guidance accurate to what actually competes for the budget.

## 5. Hot Discussions

No Discussion data was provided for this window; this section is omitted.

## 6. Feature Request Trends

- **External / pluggable Runtime provisioning**: A clear cluster around HTTP-backed Runtime provisioners and Hosted Workspace profiles for externally provisioned workers (#15247, #15512), building on the `external-scratch` phase-1 contract.
- **Context lifecycle beyond auto-compaction**: Handover-report continuation (#15545) plus the compaction-correctness bugs (#15486, #15575) show demand for first-class context handoff instead of in-place summarization.
- **Local automation of the PR loop**: `/autofix-pr` (#15056) and bounded `/takeover for N` (#15388) point to users wanting the CI-fix loop inside their own session, not just in managed automation.
- **Headless/observability improvements**: Retry classification surfaced in headless mode (#15513) and MCP child-stderr diagnostics (#15567).
- **Platform distribution**: Kubernetes/Helm deployment (#15492, #13395) and XDG-compliant Linux installs (#15458).

## 7. Developer Pain Points

- **CI reliability is the dominant blocker**: Multiple bot-filed "Main CI failed" issues (#14724, #15173, #15477) with "no test identified," plus SDK and managed-runtime releases stuck (#15498, #15499). Long post-publish fan-out waits (37–50 min, #15465) and Maven Central rate-limiting on the `ecs-qwen` pool (#15546) compound this.
- **Token/context accounting bugs**: The double-counted pending tool result + 20K pad after auto-compaction (#15486) can silently stop turns or force `max_tokens: 1` — a high-impact correctness issue for long autonomous sessions.
- **Loop guarding is warn-only in practice**: A user observed 59 unguarded identical calls after a single warning (#15526), exposing a real safety gap.
- **Provider-specific incompatibilities**: Forced `tool_choice` rejected by newest Claude models (#15542) and out-of-sync Bailian Token Plan model lists (#8432).
- **Opaque failure diagnostics**: MCP startup failures hide child stderr (#15567), and headless retries lack reason/attempt/status (#15513) — recurring theme of "the tool tells me it failed but not why."

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*