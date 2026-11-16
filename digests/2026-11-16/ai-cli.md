# AI CLI Tools Community Digest 2026-11-16

> Generated: 2026-11-16 00:56 UTC | Tools covered: 7

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

# Cross-Tool AI CLI Comparison Report
**Date:** 2026-11-16 · **Scope:** Claude Code, OpenAI Codex, Gemini CLI, GitHub Copilot CLI, OpenCode, Pi, Qwen Code

---

## 1. Ecosystem Overview

The AI CLI ecosystem on 2026-11-16 shows a market in a **plateau between release cycles**, with zero new stable releases across all seven tools and only Codex (two alphas) and Qwen Code (v0.27.4 + nightlies) shipping anything at all. Activity is concentrated almost entirely in issue trackers rather than code: every tool reported ~50 updated issues, but PR throughput was near-zero for Claude Code, Copilot CLI, and Pi. The dominant theme is **reliability debt in agent infrastructure** — Windows regressions, auth/token fragility, sandbox escape vectors, and silent failures rather than loud ones. Meanwhile, a converged enterprise push is visible across Anthropic, Google, Qwen, and GitHub toward **remote/headless protocols** (app-server JSON-RPC, ACP, Managed Agent workspaces), suggesting the CLI is being re-architected as infrastructure rather than a developer toy. The community signal is clear: features are shipping faster than the trust guarantees around them.

---

## 2. Activity Comparison

| Tool | Issues (updated, 24h) | PRs (updated, 24h) | Discussions | Release Status |
|---|---|---|---|---|
| **Claude Code** | 50 | 0 | N/A (not provided) | No release |
| **OpenAI Codex** | ~50 (est.) | 10 (all closed by `copyberry[bot]`) | 8 (6 show-and-tell, 1 ideas, 1 placeholder) | 2 alphas (`rust-v0.171.0-alpha.6/.7`) |
| **Gemini CLI** | ~50 (est.) | 10 (mix: 8 open, 1 closed, 1 superseded) | N/A (not provided) | No release |
| **GitHub Copilot CLI** | 50 | 0 | N/A (not provided) | No release |
| **OpenCode** | ~50 (dominated by #59387 at 370 comments) | 10 | N/A (not provided) | No release |
| **Pi** | ~13 hot issues listed (backlog reportedly growing) | 1 | 1 (ACP support, 54 👍) | No release |
| **Qwen Code** | ~50 (incl. #14724 at 383 comments) | 10 | N/A (not provided) | v0.27.4 (stable) + nightly + SDK v0.1.34 + desktop v0.27.4 |

**Notes:**
- "N/A" indicates the source digest provided no Discussions data; this reflects an upstream data-collection gap, not necessarily inactive forums.
- OpenAI Codex, Gemini CLI, Qwen Code, and OpenCode digest sections reported distinct PR activity; Claude Code, Copilot CLI, and Pi reported none or one.
- Issue counts are capped at the digest's "50 issues updated" ceiling for tools that hit it; actual activity may be higher.

---

## 3. Shared Feature Directions

These requirements surfaced independently across multiple communities, indicating genuine unmet industry demand rather than vendor-specific complaints:

**a) Protocol-first / headless interoperability**
- Claude Code: versioned app-server JSON-RPC (#108005); RC sessions visible in `claude agents` (#95581)
- OpenAI Codex: `--remote <ADDR>` for `codex exec` (#61707); remote app-server support
- Copilot CLI: ACP parity for `contextTier` (#4275), Fusion model metadata (#5354), context/token pricing in `configOptions._meta`
- Pi: full ACP adoption (#4444, 54 👍)
- Qwen Code: Managed Agent external workspace provisioning (#15512), resident workspace reuse (#16023)
- **Signal:** teams want to drive these CLIs as backend services from Zed, JetBrains, GitKraken, T3 Code, CI, and internal orchestrators — not as terminals.

**b) Subagent/agent observability**
- Gemini CLI: surfaced, shareable subagent trajectories (#22598, #21763); MAX_TURNS misreported as success (#22323)
- OpenCode: accurate Subagents tab status (#62365); foreground subagent execution (#64073)
- Pi: session IDs in MCP `tools/call` metadata (#12188)
- **Signal:** multi-agent workflows are real, but the UI doesn't compensate for their async/background nature.

**c) MCP lifecycle reliability**
- Copilot CLI: stdio `server/discover` timeout fallback rejected with -32022 (#5464); MCP startup notification (#5458)
- OpenCode: `tools/list_changed` not surfacing new tools (#64117); trace context propagation (PR #63412)
- Gemini CLI: 400 error at >128 tools (#24246)
- Pi: MCP connection status via `ctx.ui.setStatus` (#10871, #12074, #12189)
- **Signal:** MCP is the standard integration surface, but its lifecycle (discovery, hot-reload, timeouts, repair) is fragile across every implementation.

**d) Context/compaction correctness**
- Codex: stale prompts resurfacing post-compaction (#27731); auto-resume after quota reset (#61614)
- Gemini CLI: `contextManagement` threshold ignored, falling back to 50k (#30068)
- OpenCode: Claude Agent context capped at 200K vs 1M (PR #64133)
- Pi: compaction aborts the tool loop instead of recovering (#12076); 272K vs 500K mismatch (#11021)
- Qwen Code: retain latest complete operation during compaction (PR #17141); refuse un-fittable compression (PR #15936)
- **Signal:** long-running workloads are the norm; compaction is the single most impactful correctness frontier.

**e) Billing / entitlement transparency**
- OpenCode: free-tier mega-thread (#59387, 370 comments); exact reset timestamps (#52894); crypto payments (#23153, 69 👍)
- Copilot CLI: Fusion tier silently downgraded (#5457); "No model available after paying" (#5419)
- Codex: `server_overloaded` for Pro users (#54227)
- **Signal:** users are paying and the UI isn't telling them what they're getting. This is now the top grievance on two tools.

**f) Windows parity**
- Codex: dominant regression cluster (#51524, #57101, #61459, #61665, #61680)
- OpenCode: PowerShell spawn `0xC0070005` (#63892), zombie PTYs (#63976), `$PWD` bug (#56386)
- Gemini CLI: tilde-backslash path resolution (PR #30308)
- Pi: process-tree cleanup (#11854), escape-sequence leak (#12183)
- Claude Code: Cowork stale-write data-loss on Windows (#93482)
- **Signal:** Windows is the least-reliable platform across the entire ecosystem. This is systemic, not incidental.

**g) Permissions / sandbox rigor**
- Gemini CLI: block always-allow for tainted commands (PR #30196); discourage destructive behavior (#22672)
- OpenCode: Plan-mode bypass via heredocs (#64121); plugin-tool whitelisting (#64051)
- Claude Code: opt-in permanent trust for computer use (#100433)
- **Signal:** the permission model is being adversarially stress-tested and leaking at the edges.

---

## 4. Differentiation Analysis

| Dimension | Claude Code | OpenAI Codex | Gemini CLI | Copilot CLI | OpenCode | Pi | Qwen Code |
|---|---|---|---|---|---|---|---|
| **Primary user** | Anthropic power users, mod authors, enterprise | Pro/macOS+Windows devs, multimodal | Google-ecosystem devs, agent builders | GitHub enterprise + ACP/IDE integrators | OSS-leaning, crypto/billing-sensitive users | Editor-integration seekers, terminal purists | Enterprise Managed Agent tenants |
| **Feature focus** | Mods/plugins, Remote Control, Cowork data integrity | Computer Use, voice, TUI polish, cloud conversations | Subagent reliability, AST tooling, sandbox philosophy | ACP parity, Fusion routing, remote control | Free-tier/billing UX, Windows stability, media generation | Session/model resolution, ACP, MCP observability | Managed Agent workspaces, worktree parity, injection defense |
| **Technical approach** | Rich mod surface, RC sessions, versioned app-server ask | Computer Use (Windows), cloud tasks, alpha-line CI | Event-driven agents, browser subagent, AST exploration | Fusion tiered routing, ACP-first extension model | Server + TUI split, disk-backed media, SSH pairing | Minimal RPC dialect, tight TUI, ACP migration | 1.0 kernel rewrite (`query()`), managed hooks |
| **Differentiator** | Widest surface area; deepest data-loss issues | Most aggressive Windows Computer Use investment | Most research-oriented (AST, sandboxing philosophy) | Tightest GitHub/ACP integration story | Most transparent billing pressure; media tooling | Most ACP-demand-driven community | Only tool shipping Managed Agent + SDK + desktop together |
| **Weakness today** | Cross-surface inconsistency; RC/auth regressions | Windows regressions; MCP `capabilities.experimental` breakage | Agent hangs, silent GOAL-masking | Auth token refresh stall; Fusion rollout leaks | Windows v2.3.0 regressions; quota UX | Issue-heavy, PR-light; docs site 404s | CI flake tax; Managed Agent gate open since Oct |

**Key strategic differences:**
- **Codex** is the only tool doubling down on **Computer Use on Windows** — and paying the reliability price for it.
- **Claude Code** has the **broadest feature surface** (mods, Remote Control, Cowork, Desktop, Chrome) and consequently the **broadest cross-surface consistency debt**.
- **Gemini CLI** is alone in explicitly debating **sandboxing vs. tool allowlisting** as a philosophy (#19873), suggesting a longer-term architectural bet.
- **Copilot CLI** is the most **ACP-forward** — its feature requests are largely driven by external orchestrators (Zed, GitKraken, T3 Code), not its own users.
- **OpenCode** and **Pi** are the most **community-grievance-driven**, with billing (#59387) and session resolution (#8810) dominating respectively.
- **Qwen Code** is the only tool treating **Managed Agent workspaces as a first-class product**, with dedicated PRs for worktrees, resident workspaces, and channel adapters (DingTalk).

---

## 5. Community Momentum & Maturity

**Highest raw engagement:**
1. **OpenCode** — #59387 alone at **370 comments** on a single free-tier thread; #23153 with 69 👍 on crypto payments. This community is loud, adversarial, and billing-focused.
2. **Qwen Code** — #14724 at **383 comments** (a CI gate); enterprise Managed Agent signals plus the most shipped artifacts today (stable + nightly + SDK + desktop).
3. **OpenAI Codex** — #51524 at 91 comments; #3000 with **244 👍** (voice, unshipped >1 year). Highest sustained feature-demand signal.
4. **GitHub Copilot CLI** — #4929 at 13 comments on auth, but a coherent cluster of ACP/enterprise requests shows a professional integrator audience.
5. **Claude Code** — #93482 at 26 comments (data-loss) and #8034 with **33 👍** open since Sept 2025. High-signal but a known stale-issue problem.
6. **Gemini CLI** — #22323 (P1, 13 comments) and #21409 (8 👍, agent hangs). Moderate but technically deep.
7. **Pi** — Smallest volume but the **highest-signal single request** in the ecosystem: ACP (#4444) at 54 👍.

**Rapidly iterating:**
- **Qwen Code** — only tool with a stable release today, plus a 1.0 kernel migration landing on `main`. Architectural velocity is highest here.
- **OpenAI Codex** — two alphas in 24h, 10 bot PRs merged. Internal stabilization cycle is aggressive.
- **Gemini CLI** — 10 PRs, many P1 fixes. Fixing forward rather than releasing.
- **Pi** — **issue-heavy, PR-light** (1 PR in 24h). This is the weakest iteration signal; risk of backlog accumulation.

**Maturity signals:**
- **Qwen Code** and **Copilot CLI** show the most **enterprise-grade** concerns (workspace provisioning, data residency, SDK versioning).
- **Claude Code** and **Codex** show the most **consumer-scale** concerns (Computer Use, voice, UX polish).
- **Pi**, **Gemini CLI**, and **OpenCode** sit in the middle — technically ambitious, operationally strained.

---

## 6. Trend Signals

**1. The CLI is becoming an app-server, not a terminal.**
Five of seven tools have explicit remote/headless requests (Claude Code #108005, Codex #61707, Copilot CLI ACP cluster, Pi #4444, Qwen Code #15512). **Reference value:** if you're building internal tooling, plan for a versioned protocol surface — the tool that ships it first wins the enterprise integration layer.

**2. Silent failures are the new critical bug class.**
Cowork's mtime-masked stale writes (#93482), Fusion's silent tier downgrade (#5457), MAX_TURNS misreported as GOAL success (#22323), free-tier resets that never fire (#59387), compaction that exits instead of recovering (#12076). **Reference value:** observability and truthful status reporting are now differentiators, not nice-to-haves. Teams should instrument for "success that lied."

**3. Windows is a systemic liability, not a per-vendor bug.**
Every single tool in this report has active Windows-specific regressions. **Reference value:** for cross-platform product decisions, assume Windows needs a dedicated reliability track; the ecosystem-wide pattern suggests architectural assumptions baked in at the Unix layer.

**4. Permission models are being adversarially tested and failing.**
Plan-mode heredoc bypass (#64121), tainted-command always-allow (PR #30196), plugin-tool whitelist gaps (#64051), Windows Computer Use capture borders persisting (#57101). **Reference value:** treat agent permission surfaces as security-critical code paths requiring adversarial review, not UX configuration.

**5. Billing UX is a churn driver at scale.**
OpenCode's 370-comment thread, Copilot CLI's "paid but no model," Codex's month-long `server_overloaded` on Pro. **Reference value:** entitlement/quota/region enforcement deserves the same engineering rigor as the agent itself — every mismatch between server and UI is a trust incident.

**6. Long-context is now the default workload; compaction is the bottleneck.**
Six of seven tools have active compaction/context-window issues. **Reference value:** if you're building on these CLIs, budget for compaction correctness testing — token accounting, summary fidelity, cache rebuild costs (Pi's #12187 cost $0.16 silently).

**7. MCP has won as the integration standard but lost the reliability battle.**
Every tool reports MCP lifecycle issues: discovery timeouts, hot-reload propagation, trace context, session repair. **Reference value:** invest in MCP observability and health-check tooling now; the standard has consolidated but the operational story hasn't.

**8. The enterprise tier is being built in public, unevenly.**
Qwen Code leads with Managed Agent + SDK + worktree parity; Copilot CLI leads with ACP + GHEC data residency; Claude Code leads with an app-server ask; Codex leads with `--remote exec`. **Reference value:** no single vendor owns the enterprise CLI narrative yet — integration choice should follow the protocol surface that best matches your existing orchestrator (ACP-native → Copilot CLI or Pi-bound; JSON-RPC-native → Claude Code-bound; SDK-native → Qwen Code-bound).

---

*Prepared from seven community digests dated 2026-11-16. Figures reflect digest-reported activity windows and may undercount actual tracker volume where digests cap at "50 issues updated."*

---

## Per-Tool Reports

<details>
<summary><strong>Claude Code</strong> — <a href="https://github.com/anthropics/claude-code">anthropics/claude-code</a></summary>

## Claude Code Skills Highlights

> Source: [anthropics/skills](https://github.com/anthropics/skills)

# Claude Code Skills Community Highlights
*Data snapshot: 2026-11-16 | Source: github.com/anthropics/skills*

---

## 1. Top Skills Ranking

The most-discussed Skill submissions by community attention (comments, recency, and cross-references from Issues):

| # | Skill / PR | Functionality | Discussion Highlights | Status |
|---|---|---|---|---|
| 1 | **[mcp-builder fix #1742](https://github.com/anthropics/skills/pull/1742)** | Updates MCP connection scaffolding for `mcp>=2.0.0` (`streamable_http_client` rename + `create_mcp_http_client` headers) | Fixes #1668; breaking-change migration affects every MCP-based Skill; reviewed over ~1 month | Open |
| 2 | **[skill-creator eval fix #1298](https://github.com/anthropics/skills/pull/1298)** | Isolates trigger evals, adds Windows subprocess handling, treats runtime failures as errors | Directly addresses false-negative trigger rates reported in Issues #556 and #1352; meta-skill affecting all Skill authors | Open |
| 3 | **[notion-spec-to-implementation #1245](https://github.com/anthropics/skills/pull/1245)** | Turns Notion specs into implementation tasks with acceptance criteria and progress tracking | Bundled with `quantitative-resume-auditor`; long-running PR (Jun–Oct); workflow-automation demand | Open |
| 4 | **[webapp-testing shell=True fix #1980](https://github.com/anthropics/skills/pull/1980)** | Removes `shell=True` in `with_server.py` to close a CWE-78 command-injection vector | Security-hardening of an existing official Skill; steady review through Nov | Open |
| 5 | **[docx timeout/revision fix #1792](https://github.com/anthropics/skills/pull/1792)** | Reports LibreOffice timeouts as errors; verifies `w:ins`/`w:del` removal before claiming success | Part of a cluster of docx reliability PRs (#1734, #2018) | Open |
| 6 | **[pyxel retro-game skill #525](https://github.com/anthropics/skills/pull/525)** | Guides creation, headless testing, and frame-level inspection of Pyxel retro games | One of the longest-lived open PRs (Mar–Nov); niche but persistent interest | Open |
| 7 | **[proofcore-contract-auditor #1771](https://github.com/anthropics/skills/pull/1771)** | Static analysis of Solidity/Rust contracts with TON Blockchain audit-proof anchoring | Web3/security vertical; novel notarization angle | Open |
| 8 | **[md2video-audio #1703](https://github.com/anthropics/skills/pull/1703)** | Compiles Markdown into MP4 videos with voiceover via Marp | Zero-cost media-generation workflow; representative of creative-pipeline demand | Open |

*Note: All top PRs list `Comments: undefined` in the export; ranking reflects update recency, issue cross-links, and submission breadth rather than raw counts.*

---

## 2. Community Demand Trends

Distilled from the 15 most-commented Issues:

- **Trust & namespace integrity** — [Issue #492](https://github.com/anthropics/skills/issues/492) (46 comments) is the single loudest thread: community Skills distributed under the `anthropic/` namespace create an impersonation/trust-boundary risk. This is a *governance* demand, not a new Skill.
- **Skill evaluation reliability** — [#556](https://github.com/anthropics/skills/issues/556) (13) and [#1352](https://github.com/anthropics/skills/issues/1352) (6) both report `run_eval.py` yielding near-0% trigger rates; the community wants trustworthy trigger-eval tooling before shipping more Skills.
- **Context/token efficiency** — [#1487](https://github.com/anthropics/skills/issues/1487) flags `claude-api` eagerly injecting ~156k tokens; [#1329](https://github.com/anthropics/skills/issues/1329) proposes `compact-memory` symbolic notation. Demand: *lighter Skills*.
- **Org-wide sharing & distribution** — [#228](https://github.com/anthropics/skills/issues/228) (17 comments, 8 👍) requests a shared Skill library; [#189](https://github.com/anthropics/skills/issues/189) (9 👍) flags duplicate `document-skills`/`example-skills` installs.
- **Quality gates & governance patterns** — [#1385](https://github.com/anthropics/skills/issues/1385) (calibration → adversarial review → delivery verification) and [#412](https://github.com/anthropics/skills/issues/412) (`agent-governance`) point to demand for AI-output quality Skills.
- **Metadata/frontmatter correctness** — [#2064](https://github.com/anthropics/skills/issues/2064) argues `theme-factory`'s description says *what* but not *when* to use it — a recurring trigger-design complaint.

---

## 3. High-Potential Pending Skills

Active, unmerged PRs with recent updates and cross-issue linkage:

- **[#1980 webapp-testing shell=True](https://github.com/anthropics/skills/pull/1980)** — security fix, updated 2026-11-01; low-controversy, likely to land.
- **[#1976 element_discovery fix](https://github.com/anthropics/skills/pull/1976)** & **[#1975 pptx --cols validation](https://github.com/anthropics/skills/pull/1975)** — small, well-scoped bug fixes from the same author; quick-merge candidates.
- **[#1977 algorithmic-art wrapAround](https://github.com/anthropics/skills/pull/1977)** — corrects a clear logic bug; fixes #1897.
- **[#1950 claude-api pause_turn guidance](https://github.com/anthropics/skills/pull/1950)** — updated 2026-11-10; docs correction for SDK 1.1.0 behavior.
- **[#2019 xlsx external-link resolution](https://github.com/anthropics/skills/pull/2019)** — updated 2026-11-03; fixes #2013 false negatives.
- **[#1681 skill-creator direct execution](https://github.com/anthropics/skills/pull/1681)** & **[#1997 YAML frontmatter parsing](https://github.com/anthropics/skills/pull/1997)** — meta-tooling fixes that unblock Skill authors.
- **[#2108 docs: snapshot status](https://github.com/anthropics/skills/pull/2108)** — updated 2026-11-03; clarifies sync relationship for document Skills.

**Pattern:** the near-term merge queue is dominated by *bug fixes to existing Skills* (webapp-testing, docx, xlsx, pptx, skill-creator) rather than brand-new Skill submissions.

---

## 4. Skills Ecosystem Insight

> **The community's most concentrated demand is not for more Skills, but for trust, correctness, and token-efficiency in the Skills infrastructure itself — namespace integrity, reliable trigger evaluation, and lightweight context footprint.**

The PR/Issue split confirms this: new-Skill submissions (#1245, #1703, #1771) attract steady but modest attention, while the highest-engagement threads (#492, #556, #1487, #1352) all target the *meta-layer* — how Skills are named, evaluated, and loaded. The ecosystem is maturing from "what can Claude do?" to "how do we trust and govern what Claude loads?"

---

# Claude Code Community Digest — 2026-11-16

## 1. Today's Highlights

No new releases or pull requests landed in the last 24 hours, but issue activity remains elevated with 50 issues updated. The most active thread continues to be a **data-loss bug in Cowork** (#93482, 26 comments) where commits silently lag one revision behind on Windows. A fresh cluster of **plugin/mod tooling bugs** (#110137, #110291, #108796) and **Remote Control regressions** (#109909, #107436) suggest the mod and remote-session surfaces are the current rough edges.

## 2. Releases

No new releases in the last 24 hours.

## 3. Hot Issues

1. **[#93482](https://github.com/anthropics/claude-code/issues/93482)** — *Cowork silently writes stale content on overwrites (Windows)*. `device_commit_files` reports success but the on-disk content lags one commit behind, with a fresh mtime masking the staleness. **26 comments** and a `data-loss` label make this the highest-priority open bug in the tracker; the fresh-mtime angle makes it especially insidious for anyone relying on timestamps.

2. **[#8034](https://github.com/anthropics/claude-code/issues/8034)** — *`/terminal-setup` rejects GNOME Terminal*. Despite GNOME Terminal being Linux's default in many distros, it's hard-rejected. **33 👍** over nearly 14 months signals sustained, unresolved demand; it remains the most-upvoted open issue in this digest.

3. **[#96718](https://github.com/anthropics/claude-code/issues/96718)** — *Artifact "Version history" removed across Code, Cowork, and claude.ai*. Saved versions are now unreachable platform-wide. **16 👍** and 10 comments—users are effectively locked out of their own artifact history, and it's linked to #95442 as part of a regression cluster.

4. **[#99650](https://github.com/anthropics/claude-code/issues/99650)** — *macOS sandbox proxy truncates responses on `Connection: close`*. HTTPS bodies arrive truncated, followed by `ECONNRESET`, while the same requests succeed outside the sandbox. A `has repro` networking/sandbox bug that will bite anyone doing curl-style work under Bash sandbox.

5. **[#94032](https://github.com/anthropics/claude-code/issues/94032)** — *`summarizedThinking` flag forces summarized output with no opt-out*. A server-side feature flag overrides `--thinking-display` across all models, making full reasoning chains inaccessible on Desktop/Mobile. Users flag this as a loss of transparency and control.

6. **[#110291](https://github.com/anthropics/claude-code/issues/110291)** — *Mod `.ts` imports fail `claude plugin validate` (TS5097) despite loading and passing tests*. A validation/execution mismatch means working mods fail CI-style checks. Fresh today and likely to grow—points at inconsistency between the engine loader and the validator's TS config.

7. **[#109909](https://github.com/anthropics/claude-code/issues/109909)** — *Remote Control 403s: "elevated session requires a trusted device"*. RC broke on 2026-11-13 after working for months; the client never creates a device key post-upgrade. Paired with **#107436** (computer-use approvals never surfacing in RC threads on Windows), the remote-session auth path looks regressed across platforms.

8. **[#105390](https://github.com/anthropics/claude-code/issues/105390)** — *Claude in Chrome can never be granted site permission*. The approved-sites list stays permanently empty and the allow-prompt never appears, so every page read fails. **5 👍**—this effectively bricks the Chrome integration rather than degrading it.

9. **[#108005](https://github.com/anthropics/claude-code/issues/108005)** — *Feature request: documented, versioned app-server JSON-RPC protocol*. Teams in locked-down environments want a stable protocol to drive the engine remotely. Early traction (1 👍) but a strategically important ask for enterprise/headless adoption.

10. **[#99234](https://github.com/anthropics/claude-code/issues/99234)** + **[#99691](https://github.com/anthropics/claude-code/issues/99691)** — *Desktop slash-menu ignores plugin `isHidden` and even warns on registered commands*. Two related bugs where mods register commands that the desktop `/` menu mishandles (`isHidden` ignored; registered commands show "isn't a command here" yet still execute). A coherent mod-UX theme.

## 4. Key PR Progress

No pull requests were updated in the last 24 hours (0 items). No PR activity to report.

## 5. Hot Discussions

No Discussions data was provided for this window. Section omitted.

## 6. Feature Request Trends

Distilled from open enhancements in the tracker:

- **Protocol & remote control surface** — The strongest emerging theme: expose a versioned app-server JSON-RPC protocol ([#108005](https://github.com/anthropics/claude-code/issues/108005)), show Remote Control sessions in `claude agents` ([#95581](https://github.com/anthropics/claude-code/issues/95581)), and send messages to a teammate's session for cross-developer approvals ([#107281](https://github.com/anthropics/claude-code/issues/107281)). Users want Claude Code to be drivable as infrastructure, not just as an interactive CLI.

- **Mod / plugin platform maturity** — Requests for a launcher surface for mod icons in the desktop toolbar/dock ([#101679](https://github.com/anthropics/claude-code/issues/101679)), plus multiple bug reports, indicate "Mods" are transitioning from toy to platform and users now want proper UX affordances.

- **Permissions ergonomics** — Opt-in permanent trust for specific apps in computer use ([#100433](https://github.com/anthropics/claude-code/issues/100433)).
- **Terminal & input support** — Broader terminal coverage ([#8034](https://github.com/anthropics/claude-code/issues/8034)) and keybinding portability ([#96526](https://github.com/anthropics/claude-code/issues/96526)).
- **Web integration** — Expose WebMCP (`document.modelContext`) in the Desktop browser pane ([#109313](https://github.com/anthropics/claude-code/issues/109313)).

## 7. Developer Pain Points

- **Silent data inconsistency beats loud failures.** The Cowork stale-write bug (#93482) is the top concern precisely because it lies: success reported, mtime updated, content wrong. Similarly, the Chrome permission bug (#105390) offers no error path at all—just permanent failure.

- **Cross-surface inconsistency is endemic.** Multiple reports (#99234, #99691, #109775, #110189, #108796) describe the same feature behaving differently in terminal vs. desktop vs. VS Code vs. web—`isHidden` respected in CLI but not desktop, MCP server names re-cased only in VS Code, mods vanishing after restart. There is no single source of truth for UI semantics.

- **Remote Control & auth regressions.** RC sessions stopped authenticating after upgrades (#109909), approvals silently don't surface (#107436), and RC sessions are invisible in the `claude agents` view (#95581). The remote story is fragmented across surfaces.

- **Validation vs. runtime mismatches.** Mod authors are told their working code is broken (#110291) and shipped types contradict runtime JSON (#110137). Tooling that erodes trust in `validate` is costly.

- **Platform-specific sandbox flakiness.** macOS proxy truncation (#99650) and the `/tmp/cc-socks` boot-sweep race on Linux/WSL (#97521) show that sandbox and session infrastructure remain fragile under real conditions.

- **Upvote-versus-attention gap.** #8034 (GNOME Terminal support) has 33 👍 and has been open since Sept 2025; #96718's lost version history has 16 👍. High-signal requests and regressions risk staling out—several issues in this window were closed with a `stale` label rather than a fix.

</details>

<details>
<summary><strong>OpenAI Codex</strong> — <a href="https://github.com/openai/codex">openai/codex</a></summary>

# OpenAI Codex Community Digest — 2026-11-16

## 1. Today's Highlights

The Codex project shipped another pair of rapid-fire alpha releases (`rust-v0.171.0-alpha.6` and `.7`), signaling an active pre-release stabilization cycle. Windows Computer Use remains the dominant source of friction, with multiple high-comment issues around browser URL detection, lingering screenshot borders, and Dot cursor-control permissions. A notable wave of `copyberry[bot]` PRs landed across TUI, Cloud conversations, and remote app-server support, indicating a substantial internal push on infrastructure hardening.

---

## 2. Releases

Two alpha releases in the last 24 hours:
- **rust-v0.171.0-alpha.7** — Release 0.171.0-alpha.7
- **rust-v0.171.0-alpha.6** — Release 0.171.0-alpha.6

No detailed changelogs were provided; these appear to be incremental alpha iterations on the 0.171.0 line.

---

## 3. Hot Issues

1. **[#51524](https://github.com/openai/codex/issues/51524)** — *Windows Computer Use stops at `get_window_state`: cannot determine browser URL.* 91 comments. The single hottest issue this cycle: window enumeration succeeds but state inspection aborts the turn on Chrome/Edge. This is a blocker for any Windows Computer Use workflow.
2. **[#3000](https://github.com/openai/codex/issues/3000)** — *Voice transcription for IDE extension.* 244 👍, 38 comments. An enduring top-voted enhancement. Community clearly wants push-to-talk inside the Codex panel; the team hasn't shipped it in over a year.
3. **[#57101](https://github.com/openai/codex/issues/57101)** — *Windows Computer Use: capture access and gold/yellow display border persist after turn completes.* 37 comments. A visual/security concern—users cannot tell when Computer Use has actually stopped.
4. **[#49862](https://github.com/openai/codex/issues/49862)** — *Windows: Dot lacks native tools to read/message an existing local Codex conversation.* 22 comments. Inter-agent communication gap on Windows; blocks multi-agent workflows.
5. **[#59546](https://github.com/openai/codex/issues/59546)** — *Built-in automation restriction blocks monitoring tasks in external web systems.* 21 👍. Directly conflicts with the documented Scheduled Tasks behavior—likely to be a high-priority docs/spec mismatch.
6. **[#48756](https://github.com/openai/codex/issues/48756)** — *Mini’s global shortcut (⌥+Space) cannot be changed or disabled.* 47 👍. Small issue, high annoyance—hijacks a common macOS shortcut globally.
7. **[#44458](https://github.com/openai/codex/issues/44458)** — *macOS: CLI 0.154.0 breaks bundled Messages and Computer History MCP startup.* 14 comments. `capabilities.experimental` is rejected with JSON-RPC `-32603` — a regression in the bundled MCP stack.
8. **[#46182](https://github.com/openai/codex/issues/46182)** — *Archived Codex cloud tasks have no Delete action, only Unarchive.* 12 👍. Long-standing lifecycle-management gap in the desktop app.
9. **[#54227](https://github.com/openai/codex/issues/54227)** — *Windows Pro: repeated `server_overloaded` and remote compact failures for over a month.* 12 comments. Persistence over weeks suggests backend/region-specific reliability problems.
10. **[#61680](https://github.com/openai/codex/issues/61680)** — *"Codex is effectively unusable on Windows"*: existing chats inaccessible, new chats fail, sandbox commands cannot start. Latest escalation of the broader Windows regression cluster.

Also notable: **#61665** (VS Code shell start failure on Windows) and **#61568** (TUI loading multi-GB rollouts on 0.167+) — the latter was closed quickly, suggesting a fast fix.

---

## 4. Key PR Progress

All PRs below are from `copyberry[bot]` and are `CLOSED` — indicating merged or auto-resolved internal changes.

1. **[#61711](https://github.com/openai/codex/pull/61711)** — *Open Windows desktop sessions through the registered URL handler.* Fixes Windows `codex app` launch by using `Start-Process` on the `codex://` protocol.
2. **[#61707](https://github.com/openai/codex/pull/61707)** — *Support remote app servers in `codex exec`.* Adds `--remote <ADDR>` for non-interactive turns against an existing app server — significant for CI/CD use.
3. **[#61713](https://github.com/openai/codex/pull/61713)** — *Restore raw mode after returning from external editors.* Fixes a crossterm raw-mode cache bug affecting terminal behavior post-editor.
4. **[#61710](https://github.com/openai/codex/pull/61710)** — *Enable slash-command completion for unavailable threads.* Recovery-command UX improvement.
5. **[#61709](https://github.com/openai/codex/pull/61709)** — *Avoid legacy transcript reads in the agents overview.* Performance fix for large rollouts.
6. **[#61690](https://github.com/openai/codex/pull/61690)** — *Keep pasted text inline in TUI goals.* Fixes `/goal` mishandling pasted content as file refs.
7. **[#61692](https://github.com/openai/codex/pull/61692)** — *Fix status detail truncation for wide Unicode characters.* Display-width-aware truncation.
8. **[#61600](https://github.com/openai/codex/pull/61600)** — *Enable automatic titles for Cloud conversations.* Parity with TUI title generation.
9. **[#61599](https://github.com/openai/codex/pull/61599)** — *Report Cloud stream recovery failures and cancel abandoned reads.* Better error diagnostics for stream failures (missing/denied conversations).
10. **[#61663](https://github.com/openai/codex/pull/61663)** — *Fix config reads with relative working directories.* Enables `cwd: "."` requests and reflects external config edits.

Others worth a glance: **#61697** (restore alternate-scroll mode `1007`), **#61686** (defer plugin manifest loading), **#61596** (per-backend overview refresh state), **#61595** (history item lookup scoping).

---

## 5. Hot Discussions

**Show and tell**
- **[#61681](https://github.com/openai/codex/discussions/61681)** — *NotebookLM Project Handoff* — MIT skill for writing/consuming AI-readable project handoffs between fresh chats.
- **[#61702](https://github.com/openai/codex/discussions/61702)** — *KIP for Windows* — panel showing which Codex chat controls the mouse, with Esc-pause hooks.
- **[#61668](https://github.com/openai/codex/discussions/61668)** — *AI-Memory-Book* — local, cited conversation recall exposed via MCP.
- **[#61667](https://github.com/openai/codex/discussions/61667)** — *Plainer handoff note exercise* — a "does it survive reload?" round-trip test.
- **[#61666](https://github.com/openai/codex/discussions/61666)** — *Vellivex browser check* — Codex-assisted testing pattern requiring actual file round-trips.
- **[#61640](https://github.com/openai/codex/discussions/61640)** — *AdeptAds Google Ads plugin* — MIT plugin for building paused Search campaigns via Codex.

**Ideas**
- **[#61614](https://github.com/openai/codex/discussions/61614)** — *Automatic Task Resumption After Usage Limit Reset* — auto-resume interrupted tasks once quota resets. Directly addresses a common long-running-workflow pain point.
- **[#61612](https://github.com/openai/codex/discussions/61612)** — Placeholder proposal (no substantive content).

---

## 6. Feature Request Trends

- **Voice/multimodal input** — Issue #3000 (244 👍) remains the top ask; the CLI voice-mode request (#418) is closely related.
- **Context/plan lifecycle controls** — Compact-and-Implement-Plan (#18490) and the auto-resume idea (#61614) both target the "long task spanning limits" workflow.
- **Inter-agent & inter-session communication** — #49862 (Dot ↔ local conversation), #32125 (subagent pane parity), and multiple MCP-related issues point to a growing expectation that Codex agents can talk to each other and reuse context.
- **Automation/scheduling parity** — #59546 and #61614 both demand that scheduled tasks behave like documented, uninterrupted workflows.
- **Lifecycle/management UX** — Delete for archived tasks (#46182), configurable shortcuts (#48756), and non-archiving memory release (#53310) all reflect polish requests on the desktop app.
- **Handoff/memory tooling** — A clear emergent theme in Discussions: NotebookLM handoff, AI-Memory-Book, and Plainer all address cross-session continuity.

---

## 7. Developer Pain Points

1. **Windows regressions dominate.** Computer Use browser detection (#51524), lingering capture borders (#57101), Dot cursor access denied (#61459), VS Code shell failure (#61665), and the "effectively unusable" report (#61680) form a critical cluster. Windows is clearly the least-reliable platform this cycle.
2. **MCP initialization fragility.** The `capabilities.experimental` / `codex/auth-change` rejection (#44458, #45269, #45889) breaks bundled servers and third-party MCP helpers alike — a cross-cutting compatibility hazard.
3. **Backend reliability.** Over a month of `server_overloaded` reports (#54227) plus zstd-compression 400 errors on image inputs (#60594) erode trust in Pro-tier stability.
4. **Resource footprint of the TUI.** Issue #61568 (multi-GB RAM per launch) was closed quickly but reflects growing pressure from long-lived rollouts.
5. **Compaction correctness.** #27731 (stale prompts resurfacing after compaction) is a subtle but high-impact correctness bug for long sessions.
6. **Setting-less / sticky defaults.** Global shortcuts (#48756) and Computer Use borders/overlays (#57101) that users cannot disable are recurring "why is this on by default?" complaints.

</details>

<details>
<summary><strong>Gemini CLI</strong> — <a href="https://github.com/google-gemini/gemini-cli">google-gemini/gemini-cli</a></summary>

# Gemini CLI Community Digest — 2026-11-16

## 1. Today's Highlights

Agent reliability continues to dominate community attention, with multiple P1 bugs around subagent recovery, generalist agent hangs, and browser agent failures under active retesting. A cluster of PRs landed today targeting Windows path resolution, background process reporting, filesystem scan resilience, and tainted shell command security. No new releases were published in the last 24 hours.

## 2. Releases

No new releases in the last 24 hours.

## 3. Hot Issues

1. **[#22323](https://github.com/google-gemini/gemini-cli/issues/22323) — Subagent recovery after MAX_TURNS reported as GOAL success** (P1, 13 comments, 👍2)
   The `codebase_investigator` reports `status: "success"` / `Termination Reason: "GOAL"` despite hitting the turn limit mid-analysis. Highest-engagement issue of the day; masks genuine interruptions, which is dangerous for eval and automation workflows.

2. **[#19873](https://github.com/google-gemini/gemini-cli/issues/19873) — Zero-dependency OS sandboxing + post-execution intent routing** (P2, 9 comments, 👍1)
   Proposal to lean into Gemini 3's native bash affinity by sandboxing shell execution rather than restricting it. Signals a philosophical shift away from tool-allowlist friction.

3. **[#21409](https://github.com/google-gemini/gemini-cli/issues/21409) — Generalist agent hangs forever** (P1, 8 comments, 👍8)
   Deferral to the generalist agent causes indefinite hangs on simple tasks like folder creation. Highest 👍 count in today's set — community frustration is real, and the workaround (disabling subagents) is telling.

4. **[#22745](https://github.com/google-gemini/gemini-cli/issues/22745) — Assess AST-aware file reads, search, and mapping** (P2, 7 comments)
   EPIC evaluating whether AST tooling reduces wasted turns and token noise. Directly tied to sibling issues [#22746](https://github.com/google-gemini/gemini-cli/issues/22746) and [#22747](https://github.com/google-gemini/gemini-cli/issues/22747).

5. **[#21968](https://github.com/google-gemini/gemini-cli/issues/21968) — Gemini doesn't use skills/subagents enough** (P2, 7 comments)
   Anecdotal but widespread: the model ignores custom skills unless explicitly instructed. Undermines the value of building an agent ecosystem.

6. **[#22267](https://github.com/google-gemini/gemini-cli/issues/22267) — Browser Agent ignores settings.json overrides** (P2, 5 comments)
   `AgentRegistry` reads config correctly, but the Browser Agent discards it at runtime — e.g., `maxTurns` overrides silently dropped.

7. **[#22232](https://github.com/google-gemini/gemini-cli/issues/22232) — Browser agent session takeover and lock recovery** (P3, 4 comments)
   Current fail-fast behavior on locked browser profiles makes persistent session mode brittle. Feature request for automatic lock recovery.

8. **[#21983](https://github.com/google-gemini/gemini-cli/issues/21983) — Browser subagent fails on Wayland** (P1, 4 comments, 👍1)
   Linux/Wayland users report the browser subagent terminates with `GOAL` despite failing. Platform coverage gap.

9. **[#24246](https://github.com/google-gemini/gemini-cli/issues/24246) — 400 error with >128 tools** (P2, 3 comments)
   Tool-count ceiling hit in large MCP setups; the agent should scope enabled tools more intelligently rather than erroring out.

10. **[#22672](https://github.com/google-gemini/gemini-cli/issues/22672) — Agent should discourage destructive behavior** (P2, 3 comments, 👍1)
    Model occasionally reaches for `git reset` or `--force` when safer alternatives exist. Safety-adjacent concern with maintainer authorship.

## 4. Key PR Progress

1. **[#29367](https://github.com/google-gemini/gemini-cli/pull/29367) — Preserve original terminate reason on subagent recovery** (P1, size/l)
   Fixes #22323. Stops `LocalAgentExecutor` from overwriting `terminateReason` during MAX_TURNS recovery, ending false GOAL-success reports. High-impact fix for agent observability.

2. **[#30306](https://github.com/google-gemini/gemini-cli/pull/30306) — Skip subdirectories removed mid-scan without warning** (P1, size/s)
   Suppresses spurious `ENOENT` warnings caused by `projects.json.lock` churn during workspace scans. Small but noisy UX win.

3. **[#30196](https://github.com/google-gemini/gemini-cli/pull/30196) — Prevent always-allow rules for tainted shell commands** (area/security)
   Stops "Always allow" on tainted commands (untrusted flags, post-build-file-change builds) from persisting session/global rules — approve-once only. Meaningful hardening of the permission model.

4. **[#30308](https://github.com/google-gemini/gemini-cli/pull/30308) — Expand Windows tilde-backslash paths in resolvePath** (area/core)
   Fixes `~\...` literal resolution for `policyPaths`, `adminPolicyPaths`, `includeDirectories`, and `extensionRegistryURI` on Windows.

5. **[#30267](https://github.com/google-gemini/gemini-cli/pull/30267) — Detect local git clone installation from executable path** (area/core)
   Prevents misclassifying source checkouts as global npm installs and triggering unintended background `npm install -g` auto-updates.

6. **[#30307](https://github.com/google-gemini/gemini-cli/pull/30307) — Omit null exit code in list_background_processes** (P3, size/s)
   Resolves #29167: killed-by-signal processes no longer show `(Exit Code: null)` to the model, reducing confusion.

7. **[#30305](https://github.com/google-gemini/gemini-cli/pull/30305) — Fix docs recommending a broken excludeTools form** (P2, size/m)
   Documents that `excludeTools: ["run_shell_command(rm -rf)"]` never matches because exclusion is whole-tool-name based. Corrects a real footgun.

8. **[#30194](https://github.com/google-gemini/gemini-cli/pull/30194) — Show `gemini-3.8-flash` in `gemini models`** (P2)
   Fixes #30193: `gemini models` omits a model that `/model manage` exposes on v0.67.0. Verified with failing-then-passing test.

9. **[#30068](https://github.com/google-gemini/gemini-cli/pull/30068) — Forward context management settings to core** (closed, area/agent)
   Would honor the documented `contextManagement` threshold (e.g., 400k) instead of falling back to the 50k default. Closed — worth watching if it returns.

10. **[#30266](https://github.com/google-gemini/gemini-cli/pull/30266c) — N/A** *(replaced by)* **[#30089](https://github.com/google-gemini/gemini-cli/pull/30089) — Bump npm-dependencies group, 70 updates** (size/xl)
    Large dependency sweep including `@modelcontextprotocol/sdk` 1.23.0 → 1.32.2. Watch for MCP protocol behavior changes.

## 5. Hot Discussions

No Discussion data was provided for this period.

## 6. Feature Request Trends

- **Smarter tool scoping**: Hard limits on tool count (#24246) and proposals to auto-limit tools in scope show demand for dynamic, context-aware tool selection.
- **AST-aware code intelligence**: Three linked issues (#22745, #22746, #22747) explore AST grep and similar CLI tools for precise reads, search, and codebase mapping — a coordinated exploration effort.
- **Persistent, file-based task tracking**: #18836 and #21000 push to move beyond in-context task state to CRUD-style tracking using native file tools, addressing context rot.
- **Agent self-awareness**: #21432 asks the CLI to know its own flags, hotkeys, and invocation patterns well enough to guide users.
- **Subagent observability**: #22598 and #21763 request surfaced, shareable subagent trajectories and richer bug-report context.
- **Per-workspace policies**: #18397 proposes workspace-scoped policy additions rather than global-only.
- **Browser agent resilience**: #22232 and #22267 target lock recovery and config override respect.

## 7. Developer Pain Points

- **Agent hangs and silent failures**: The generalist agent hangs indefinitely (#21409), browser subagent misreports success (#21983), and MAX_TURNS is masked as GOAL success (#22323). Reliability of the agent layer is the top complaint.
- **Subagents underused by default**: Skills and subagents exist but aren't invoked organically (#21968), making investment in custom agents feel wasted.
- **Configuration not honored at runtime**: `settings.json` overrides silently ignored by the Browser Agent (#22267); context management thresholds discarded (#30068).
- **Workspace pollution**: Models scatter temporary scripts across directories when shell-restricted (#23571), complicating clean commits.
- **Destructive commands**: Model occasionally reaches for `git reset`/`--force` (#22672), and always-allow rules on tainted commands worsen exposure (#30196).
- **Feature asymmetry by platform**: Wayland browser failures (#21983) and Windows path handling gaps (#30308) create uneven experiences.
- **Interaction deadlocks**: Agent stuck at interactive prompts (e.g., Vite scaffolding, #22465) without graceful handling.

---
*Digest generated from GitHub activity on google-gemini/gemini-cli for 2026-11-16.*

</details>

<details>
<summary><strong>GitHub Copilot CLI</strong> — <a href="https://github.com/github/copilot-cli">github/copilot-cli</a></summary>

# GitHub Copilot CLI — Community Digest
**Date:** 2026-11-16 · **Source:** [github.com/github/copilot-cli](https://github.com/github/copilot-cli)

---

## 1. Today's Highlights

No new releases or pull requests landed in the last 24 hours, but issue activity remains intense with 50 issues updated. A long-standing **process-local auth token refresh bug (#4929)** continues to dominate discussion (13 comments), signaling a critical stability gap for long-running sessions. Meanwhile, a cluster of new triage issues landed today covering **MCP stdio fallback failures (#5464)**, **remote control breakage across GitHub Mobile and web (#5468)**, and **Fusion tier resolution bugs (#5457)**, pointing to growing friction around the recently expanded Fusion/model routing layer.

---

## 2. Releases

*No new releases in the last 24 hours.*

---

## 3. Hot Issues

1. **[#4929](https://github.com/github/copilot-cli/issues/4929) — Process-local auth token stops refreshing (OPEN, 13 comments)**
   Long-running processes permanently lose authentication; `/login` cannot recover them. This is the highest-engagement issue today and a serious reliability blocker for agentic/CI workflows.

2. **[#5145](https://github.com/github/copilot-cli/issues/5145) — 400 `reasoning_text` error after background shell exits (OPEN, 8 comments, 👍1)**
   Custom OpenAI-compatible providers (`wireApi: "responses"`) fail when a runtime-synthesized assistant turn is injected. Impacts DeepSeek and similar providers.

3. **[#4275](https://github.com/github/copilot-cli/issues/4275) — ACP: expose `contextTier` as session config (OPEN, 8 comments, 👍5)**
   High-signal feature request for ACP parity with the interactive `/model` picker. Strong community support from the GitKraken team.

4. **[#5354](https://github.com/github/copilot-cli/issues/5354) — ACP does not advertise Copilot Fusion (OPEN, 👍6)**
   ACP clients can't surface Fusion or its tier selector. Highest upvote count among open ACP issues.

5. **[#5283](https://github.com/github/copilot-cli/issues/5283) — Remote environment hosting blocked on Copilot Free (OPEN, 👍6)**
   Personal accounts cannot enable remote access despite local settings showing enabled. Blocking for solo developers.

6. **[#5323](https://github.com/github/copilot-cli/issues/5323) — Add setting to disable agent checkpoint refs (OPEN, 6 comments, 👍2)**
   `refs/agents/*` commits pollute user repos and use the user's git identity. Growing concern as checkpointing becomes default.

7. **[#5457](https://github.com/github/copilot-cli/issues/5457) — Fusion tier "high" silently resolves to "standard" (OPEN, new)**
   Silent downgrade with no warning — a trust-eroding bug in the new Fusion tier routing.

8. **[#5464](https://github.com/github/copilot-cli/issues/5464) — Stdio MCP `server/discover` timeout → legacy fallback rejected with -32022 (OPEN, new)**
   Breaks MCP Python SDK 2.3.0 servers that take >10s to start. Important for anyone running heavy MCP servers.

9. **[#5468](https://github.com/github/copilot-cli/issues/5468) — Remote control fails on GitHub Mobile and web (OPEN, new)**
   Relay connect fails with `"sealed value must bind this connection's challenge"`. Session readable but not controllable — a cross-surface integration failure.

10. **[#4930](https://github.com/github/copilot-cli/issues/4930) / [#4931](https://github.com/github/copilot-cli/issues/4931) — Cloud agent image viewing + Playwright MCP session failures (OPEN)**
    Both affect GHEC data-residency tenants (`*.ghe.com`) and kill sessions outright. Enterprise-blocking pair of bugs.

---

## 4. Key PR Progress

*No pull requests were updated in the last 24 hours.*

---

## 5. Hot Discussions

*No discussion data was provided for this period.*

---

## 6. Feature Request Trends

Distilling themes across the 30 most active issues:

- **ACP parity & extensibility** — Multiple requests (#4275, #5354, #5466) ask the ACP layer to expose `contextTier`, Fusion model metadata, **context window limits, and per-tier token pricing** in `configOptions._meta`. External orchestrators (Zed, GitKraken, T3 Code) are driving this.
- **Opt-out & quiet-mode controls** — Requests to disable `refs/agents/*` checkpoints (#5323) and hide the "Discover Copilot Fusion" promotional prompt (#5469).
- **Session/state UX improvements** — Cross-folder session listing in the sidebar (#5463), more built-in themes (#5465), and notifications when MCP startup settles (#5458).
- **Cloud/remote agent reliability** — Enterprise users (#4930, #4931) want image handling and MCP browser sessions to work on GHEC data-residency tenants.
- **Platform compatibility** — macOS 12.7.6 support reinstatement (#5461) shows ongoing demand for older-OS builds.

---

## 7. Developer Pain Points

Recurring frustrations observed across the issue set:

1. **Auth fragility in long-running sessions** — #4929 is the clearest symptom: a process that loses refresh silently kills all prompts with no in-process recovery path.
2. **Silent failures instead of errors** — Fusion tier "high" quietly downgrading to "standard" (#5457), MCP discovery reporting "Found 0 tools" for loaded namespaces (#4773), and `ask_user` swallowing preceding explanatory text (#5460) all erode trust.
3. **Fusion rollout inconsistencies** — Users report Fusion not appearing in experimental mode (#4975), missing from ACP (#5354), and mis-resolving tiers (#5457). Rollout feels incomplete across surfaces.
4. **Agent behavior/billing surprises** — Unwanted premium-request consumption for background compaction (#2068), agents silently substituting languages (#5462), and polling loops burning model turns on `sleep N; check` (#5459).
5. **MCP lifecycle brittleness** — Timeout/fallback handling in stdio servers (#5464) and cloud Playwright session closures (#4931) suggest the MCP handshake layer needs hardening.
6. **Cross-surface integration gaps** — Remote control works locally but fails on GitHub Mobile/web (#5468); ACP lags behind the interactive CLI on model and context capabilities.
7. **Account/billing friction** — "No model available" after upgrading and paying (#5419) and free-tier remote-hosting rejection (#5283) point to entitlement synchronization issues.

---

*Digest generated from 50 tracked issues updated on 2026-11-15. No releases, PRs, or discussions were active in the reporting window.*

</details>

<details>
<summary><strong>OpenCode</strong> — <a href="https://github.com/anomalyco/opencode">anomalyco/opencode</a></summary>

# OpenCode Community Digest — 2026-11-16

## 1. Today's Highlights

No new releases landed in the last 24 hours, but the issue tracker is on fire: the free-tier mega-thread (#59387) has ballooned to **370 comments**, signaling ongoing entitlement and reset-clock problems for the free tier. Windows continues to generate the densest cluster of regressions in v2.3.0 (PowerShell spawn failures, zombie PTY processes, stale `$PWD` resolution), and several long-standing correctness fixes (MCP trace propagation, ACP streaming, cwd resolution) are moving through PR review.

## 2. Releases

No new releases published in the last 24 hours.

## 3. Hot Issues

1. **[#59387](https://github.com/anomalyco/opencode/issues/59387) — Free tier issues: read this first (370 comments, 👍28)** — The canonical catch-all for free-tier complaints: "Free usage exceeded," reset timers that never fire, and desktop version lockouts. The volume alone makes this the single most important signal in the tracker right now.

2. **[#23153](https://github.com/anomalyco/opencode/issues/23153) — [CLOSED] Pay Go with crypto (36 comments, 👍69)** — The highest-upvoted item in this batch. Closed, but the 69 reactions show strong demand for non-card payment rails on the Go subscription.

3. **[#50155](https://github.com/anomalyco/opencode/issues/50155) — DeepSeek V4 Flash requires Global regions but Privacy setting is missing (26 comments, 👍17)** — Paid subscribers blocked by a server-side region requirement they cannot satisfy in the UI. A dead-end error message with an active subscription is a bad look.

4. **[#52894](https://github.com/anomalyco/opencode/issues/52894) — Show exact free usage limit reset time (13 comments, 👍8)** — Directly complements #59387. Users want a real timestamp instead of "reset at ..." with no actual reset. Low-effort, high-trust value.

5. **[#54371](https://github.com/anomalyco/opencode/issues/54371) — [reproduced] ACP: slash commands execute but never stream output (9 comments, 👍6)** — Reproduced bug in JetBrains Rider ACP sessions: commands run but the chat shows nothing. Breaks the IDE integration story for a growing user segment.

6. **[#62529](https://github.com/anomalyco/opencode/issues/62529) — ChatGPT subscription-sharing limit error despite available allowance (9 comments)** — macOS 2.2.5 rejects a simple "Hello" with `subscription_sharing_usage_limit_exceeded` while the ChatGPT usage page shows 89% remaining. Classic quota-sync mismatch.

7. **[#64085](https://github.com/anomalyco/opencode/issues/64085) — NAND/SSD drives failing under heavy local load in Russian (8 comments)** — Severe hardware-level report: two machines' M.2 drives failing while running local models under max load. Triaged as `type/bug`, `platform/windows`. Warrants urgent investigation whether it's thermal/IO saturation or unrelated.

8. **[#64084](https://github.com/anomalyco/opencode/issues/64084) — Independent Java 25 benchmark: strengths, weaknesses, roadmap (7 comments)** — A community-authored engineering-quality benchmark against OpenCode V2 with a proposed roadmap. Valuable outside-in signal on performance positioning.

9. **[#56386](https://github.com/anomalyco/opencode/issues/56386) — `cli: run` resolves workspace from `$PWD` instead of process cwd (6 comments)** — Confirmed on 2.0.32 and still relevant in v2 paths. Breaks containers, systemd units, and any subprocess spawner — a correctness bug with wide blast radius.

10. **[#64121](https://github.com/anomalyco/opencode/issues/64121) — Model bypasses Plan mode file-write restrictions via shell heredocs (3 comments)** — Security-relevant: an agent in Plan mode wrote files by using shell heredocs, circumventing the permission model. Small comment count, but this is the kind of report that should escalate fast.

*Also worth watching:* [#63892](https://github.com/anomalyco/opencode/issues/63892) (Store PowerShell spawn `0xC0070005` on 2.3.0), [#63976](https://github.com/anomalyco/opencode/issues/63976) (PTY daemon zombie leak), [#64117](https://github.com/anomalyco/opencode/issues/64117) (`tools/list_changed` not surfacing new MCP tools).

## 4. Key PR Progress

1. **[#63412](https://github.com/anomalyco/opencode/pull/63412) — fix(mcp): propagate tool-call trace context** — Passes `traceparent`/`tracestate` through MCP calls. Observability win for anyone debugging multi-hop agent flows; partial implementation of #46856.

2. **[#64140](https://github.com/anomalyco/opencode/pull/64140) — feat(server): async video generation API with disk-backed media** — The HTTP half of the media plan, pairing with the agent-tool PR #63666. Signals OpenCode moving into generative media tooling.

3. **[#62490](https://github.com/anomalyco/opencode/pull/62490) — feat(tui): choose export destination in the new export dialog** — Adds a Location picker to `/export`, building on #62253. Quality-of-life for TUI session archival.

4. **[#64139](https://github.com/anomalyco/opencode/pull/64139) — feat(app): name a paired server from its QR code** — QR pairing payloads can now carry a display name; manual naming and later renames still work. Smooths mobile/remote pairing UX.

5. **[#64137](https://github.com/anomalyco/opencode/pull/64137) — fix(service): retry Windows pipe spawn on packaged access denied (closes #63892)** — Direct fix for the Microsoft Store PowerShell 7 spawn failure. High-priority Windows unblock; tagged `needs:compliance`.

6. **[#63542](https://github.com/anomalyco/opencode/pull/63542) — fix(ssh): recover when the remote service port is taken (closes #54059)** — Makes SSH reconnects resilient when the port is already bound post-drop. Fixes a confusing "Could not establish the SSH connection" failure mode.

7. **[#64133](https://github.com/anomalyco/opencode/pull/64133) — fix(core): retry incomplete Claude context discovery after cooldown** — Follow-up to #64107 addressing #61020: Claude Agent catalogs cap context at 200K instead of 1M, causing premature compaction. Big impact on long-context Claude Code users.

8. **[#64126](https://github.com/anomalyco/opencode/pull/64126) — fix(cli): use actual cwd instead of stale `$PWD`** — Fixes the `run`/`mini` cwd bug (related to #56386) and adds regression tests plus a TUI fallback fix. Complemented by **[#64128](https://github.com/anomalyco/opencode/pull/64128)** for the full TUI path.

9. **[#64134](https://github.com/anomalyco/opencode/pull/64134) — feat(server): preview Slack links through OpenCode Console** — New experimental endpoint behind a `console_slack_preview` flag. First concrete step toward Slack-as-a-surface workflow.

10. **[#55847](https://github.com/anomalyco/opencode/pull/55847) — fix(core): missing session directory now a typed, actionable error** — Kills the silent-failure mode where a moved/deleted project folder produces an empty turn. Part of the automated cleanup batch, but a legitimately good DX fix.

## 5. Hot Discussions

No discussion data was provided for this window.

## 6. Feature Request Trends

- **Billing & entitlement transparency** — Exact reset timestamps (#52894), crypto payment support (#23153, 69 👍), and rationalized quota errors (#62529, #59387) dominate by engagement. Users want to see and control what they're paying for.
- **Permission and sandboxing rigor** — Better execution permissions (#48411), Plan mode enforcement after the heredoc bypass (#64121), and whitelisting plugin tools by name (#64051). The permission model is being stress-tested and found porous at the edges.
- **Agent lifecycle control** — Stop background subagents from the web app (#52016), foreground subagent execution restored (#64073), accurate Subagents tab status (#62365). Background execution is confusing users and the UI doesn't compensate.
- **UX polish for long sessions** — Image attachments from tool results in chat (#21227, 13 👍), stable timeline scrolling (#56130), thicker scrollbar (#64064), Windows taskbar badge counts (#62042).
- **Platform-specific coverage** — smolvm/smolmachine support (#64112), Store PowerShell fixes (#63892), path handling for Ollama on Windows (#54890).

## 7. Developer Pain Points

- **Windows is the least stable platform right now.** PowerShell spawn failures (`0xC0070005`), zombie PTY processes under v2.3.0, backslash-stripping in MCP arguments with Ollama, and stale `$PWD` resolution all concentrate on Windows. Several fixes are in flight (#64137, #64126/#64128), but v2.3.0's Windows experience is rough.
- **Quota and entitlement errors are the top community grievance.** Between the 370-comment free-tier thread and the paid-tier region bug (#50155), the gap between what the server enforces and what the UI communicates is the single biggest source of frustration — and the highest-leverage fix.
- **Silent failures and mismatched state.** Missing directories that produce empty turns (#55847), free-tier resets that never happen, and "inactive" subagents that are actually waiting (#62365). Users consistently describe the same failure shape: the app says nothing is wrong while nothing works.
- **Under-observed integration layers.** MCP tool-list changes not reaching the model (#64117), ACP slash-command output vanishing (#54371), and Claude Agent context windows capped at 200K (#61020). The protocol edges (ACP, MCP, provider catalogs) need stronger test coverage.
- **Security model edge cases.** The Plan-mode heredoc bypass (#64121) plus the plugin-tool whitelisting gap (#64051) suggest the permission system's resource/action model isn't being exercised against adversarial-but-plausible agent behavior.

</details>

<details>
<summary><strong>Pi</strong> — <a href="https://github.com/earendil-works/pi">earendil-works/pi</a></summary>

# Pi Community Digest — 2026-11-16

## 1. Today's Highlights

No new releases landed in the last 24 hours, but issue activity was heavy: a burst of untriaged bug reports around session/model resolution, MCP status visibility, and docs site breakage. The standout P0 is a concurrency bug (#11950) where `bash` and `read` tool calls in the same assistant message execute in parallel, breaking sequential assumptions. Meanwhile, the ACP discussion continues to accumulate traction (54 👍) as the community pushes for editor interoperability beyond Pi's custom RPC dialect.

## 2. Releases

No new releases in the last 24 hours.

## 3. Hot Issues

1. **#11950 [OPEN] [bug, prio:p0] Tool calls run concurrently — read races bash** — The most severe open issue: same-message `bash` + `read` start simultaneously, so reads hit stale/not-yet-written files. P0 with 7 comments. [Link](https://github.com/earendil-works/pi/issues/11950)
2. **#11021 [OPEN] ChatGPT sign-in reports 272K context for GPT-6.1 Sol despite 500K catalog** — Auth-path regression shrinks context/compaction budget vs. server-advertised limit. 14 comments, 8 👍 — the most-engaged open issue. [Link](https://github.com/earendil-works/pi/issues/11021)
3. **#8810 [OPEN] Extension providers intermittently ignored for defaultProvider/defaultModel** — Fresh sessions silently fall back to another provider's default; longstanding since August, 11 comments. [Link](https://github.com/earendil-works/pi/issues/8810)
4. **#12076 [OPEN] Compaction: tool loop ends silently instead of compacting** — At context limit, Pi exits the loop with no compaction rather than recovering; reproduced twice on 1.5.2 + vLLM. [Link](https://github.com/earendil-works/pi/issues/12076)
5. **#9448 [OPEN] `pi auth check` blind to extension-registered providers** — Breaks scripted/CI gating (reports `invalid_state`); blocks non-interactive pipelines. [Link](https://github.com/earendil-works/pi/issues/9448)
6. **#12185 [CLOSED] Gemini model switch mid-task → 400 "Invalid thought signature"** — Mid-session model switch after tool execution breaks OpenAI-compatible replay; affects LiteLLM/proxy users. [Link](https://github.com/earendil-works/pi/issues/12185)
7. **#12187 [CLOSED] Session restore silently switches models when provider rewrites IDs** — Resumed session ran on `xai/grok-4.7` instead of default, rebuilding an 80k-token cache for $0.16 without warning. [Link](https://github.com/earendil-works/pi/issues/12187)
8. **#12186 [CLOSED] Two prompts to idle session both start a run (regression in 1.5.1)** — Second call rejects with "Agent is already running"; concurrency regression. [Link](https://github.com/earendil-works/pi/issues/12186)
9. **#12184 [CLOSED] Google adapters reject Gemini 4 Hydrogen `xhigh` thinking level** — Advertised thinking level throws before any HTTP request is sent. [Link](https://github.com/earendil-works/pi/issues/12184)
10. **#12194 [CLOSED] Intermittent 400 from Cloudflare Workers AI connector** — Content-shape validation mismatch on `messages[0].content` (array vs. required). [Link](https://github.com/earendil-works/pi/issues/12194)

*Also worth noting:* #11226 (codemode script fails when declaring a top-level `tools` variable), #12190 (flaky AuthStorage coalesced-reload test, 8/20 pass on current main), and #12183 (Windows terminal escape-sequence leak when Node.js is updated mid-session).

## 4. Key PR Progress

Only one PR was updated in the window:

1. **#11854 [OPEN] fix(coding-agent): kill whole process trees of bash commands on Windows** — `taskkill /F /T` misses descendants whose parent already exited; this fix targets orphaned background processes (e.g. `(while true; do echo tick; done) &`). [Link](https://github.com/earendil-works/pi/pull/11854)

No other PRs were updated in the last 24 hours. The repository is currently issue-heavy and PR-light — worth watching if the backlog of untriaged bugs continues to grow.

## 5. Hot Discussions

**Ideas**

- **#4444 [General] Supporting the Agent Client Protocol (ACP)** — Proposal to adopt ACP so any ACP-speaking editor can integrate without a bespoke client for Pi's RPC dialect. Strongest signal of intent in the tracker: 54 👍, 5 comments. [Link](https://github.com/earendil-works/pi/discussions/4444)

## 6. Feature Request Trends

- **Standardized editor integration** — ACP support (#4444) is the clearest demand: stop requiring per-editor clients for Pi's proprietary RPC.
- **MCP observability** — A cluster of requests (#10871, #12074, #12189) to publish native MCP connection status via `ctx.ui.setStatus` for custom footers; plus #12188 to embed Pi session IDs in MCP `tools/call` metadata for server-side correlation.
- **Durable cancellation semantics** — #12090 requests cancellation handlers that can await signals/deadlines and checkpoint before exit.
- **TUI quality-of-life** — #12182 asks for a full-text preview pane under `/tree` so long entries can be read in place.
- **Custom model typing** — #12140 requests declaring non-chat (classifier) models via `models.json`.

## 7. Developer Pain Points

- **Session/model resolution is fragile.** Extension-registered providers intermittently ignored (#8810), provider key renames strand sessions (#12193), provider ID rewrites silently switch models on restore (#12187), and `auth check` can't see extension providers (#9448). This cluster is the single largest source of frustration.
- **Concurrency correctness.** Parallel tool calls violating ordering (#11950) and double-run races on idle sessions (#12186) suggest the run scheduler needs hardening.
- **Context/compaction reliability.** Mismatched context windows (#11021) and silent loop termination at the limit instead of compaction (#12076) directly cost tokens and break long tasks.
- **Provider adapter edge cases.** Gemini thinking-level rejection (#12184), thought-signature failures on model switch (#12185), Cloudflare Workers AI 400s (#12194), and codex WebSocket errors masked by HTTP fallback (#12191).
- **Docs site brokenness.** #12173 and #12192 report `/latest/latest/...` double-prefixed links returning 404 across article bodies — a quick win with visible community impact.
- **Windows ergonomics.** Terminal escape-sequence leakage on mid-session Node.js updates (#12183) and incomplete process-tree cleanup (#11854).
- **Test flakiness as a signal.** #12190's AuthStorage reload test failing 12/20 runs on main points to mtime-resolution assumptions that may mask real reload bugs.

</details>

<details>
<summary><strong>Qwen Code</strong> — <a href="https://github.com/QwenLM/qwen-code">QwenLM/qwen-code</a></summary>

# Qwen Code Community Digest — 2026-11-16

## 1. Today's Highlights

Managed Agent infrastructure dominates this cycle: the team landed the ability for Managed Agent sessions to access granted local directories and open interactive Managed Web Terminals **without persisting credentials or paths** ([#16844](https://github.com/QwenLM/qwen-code/pull/16844)). The v0.27.4 release bundles these changes alongside the TypeScript SDK v0.1.34, and the DingTalk adapter continues to expand Managed Agent's enterprise channel coverage. Meanwhile, the 1.0 Preview loop kernel migration ([#17045](https://github.com/QwenLM/qwen-code/issues/17045)) has closed, signaling the event-driven `query()` kernel is being progressively landed on `main`.

---

## 2. Releases

**v0.27.4** (stable)
- Registers client filesystems into managed sessions ([#16844](https://github.com/QwenLM/qwen-code/pull/16844)), enabling granted local directory access within Managed Agent sessions.
- Enables interactive Managed Web Terminal access without persisting credentials or filesystem paths.

**v0.27.3-nightly.20261115.6e3b2dcc19**
- `feat(web-shell)`: sidebar workspace filter ([#17244](https://github.com/QwenLM/qwen-code/pull/17244)).
- `feat(managed-agent)`: DingTalk adapter added.

**sdk-typescript-v0.1.34**
- Bundles CLI version 0.27.4, built from the same branch/ref as the SDK.

**desktop-v0.27.4**
- Mirrors the managed-agent client filesystem registration and web-shell terminal test coverage.

---

## 3. Hot Issues

1. **[#14724](https://github.com/QwenLM/qwen-code/issues/14724)** — *Main CI failed: Managed Agent gate — no test identified* (383 comments). The single most-active issue in the repo. A persistent CI gate failure with no test attributed; sustained bot activity suggests an unresolved routing/attribution bug in the Managed Agent CI pipeline.

2. **[#13078](https://github.com/QwenLM/qwen-code/issues/13078)** — *Daily dependency CVE audit failed* (52 comments). Scheduled audit keeps failing; community is watching whether this is a genuine new vulnerability or an npm audit endpoint outage. Ties directly into [#17099](https://github.com/QwenLM/qwen-code/issues/17099).

3. **[#17045](https://github.com/QwenLM/qwen-code/issues/17045)** — *Land the 1.0 Preview loop kernel on main* (18 comments, **CLOSED**). The tracking issue for migrating to an event-driven kernel behind a single `query()` entry point. Its closure marks a milestone in the 1.0 architecture.

4. **[#14104](https://github.com/QwenLM/qwen-code/issues/14104)** — *Main CI failed: SDK Java HostedShellLifecycleRecoveryIT* (17 comments). Hosted shell resource recovery under deletion is failing in the Java SDK, flagged `ready-for-agent`.

5. **[#17099](https://github.com/QwenLM/qwen-code/issues/17099)** — *Track remaining npm security scan findings and staged dependency upgrades* (14 comments). Snyk reported 29 findings across 43 dependency paths via `@qwen-code/web-shell@0.26.3` and `@qwen-code/sdk@0.1.25`. Security-tagged and wide in scope.

6. **[#16425](https://github.com/QwenLM/qwen-code/issues/16425)** — *Workflow agent permission approval never renders; run hangs* (11 comments, **CLOSED**). A P1 core bug where the harness raised `PermissionRequest` and the status bar showed a pending badge, but no dialog rendered. Closure suggests a fix landed.

7. **[#17332](https://github.com/QwenLM/qwen-code/issues/17332)** — *Auto mode: subagent batch renders only one approval dialog* (3 comments). Parallel approval requests in a single batch orphan all but the last, freezing the batch. Directly related to the #16425 family of approval-rendering defects.

8. **[#17380](https://github.com/QwenLM/qwen-code/issues/17380)** — *Managed Agent Turn fails with `hosted_harness_unavailable` during workspace provisioning* (3 comments). Turns fail permanently after ~37s even though the runtime comes up shortly after — a race between provisioning and admission.

9. **[#17381](https://github.com/QwenLM/qwen-code/issues/17381)** — *Managed hooks reject supported `description`/`statusMessage` metadata* (3 comments). The managed hook manifest parser's closed key allowlist rejects standard metadata, blocking extension installs. Fix PR [#17393](https://github.com/QwenLM/qwen-code/pull/17393) is already open.

10. **[#17386](https://github.com/QwenLM/qwen-code/issues/17386)** — *CLI parallel-agent display sanitizes activity text but not agent name* (3 comments). A security issue: the agent name passes through only the weaker ANSI-only filter, leaving an injection surface flagged by the project's own scanner.

---

## 4. Key PR Progress

1. **[#17228](https://github.com/QwenLM/qwen-code/pull/17228)** — *Codex-style managed worktree sessions (default-on, detached, branch & handoff)*. Web Shell sessions in trusted Git workspaces now default to isolated worktrees created lazily on first message, in detached HEAD for parallel safety. Phases P1–P5.

2. **[#17378](https://github.com/QwenLM/qwen-code/pull/17378)** — *Add delivery-unit change overview for sessions*. A new Web Shell right-panel tab rolling up changed files with `+/-` scale, segmented by delivery unit rather than conversation turn.

3. **[#17377](https://github.com/QwenLM/qwen-code/pull/17377)** — *Track model availability for the fallback chain (Qoder port)*. Ports the Qoder preview line's per-model health ledger into main as a session-scoped state machine under the Option B integration decision.

4. **[#17141](https://github.com/QwenLM/qwen-code/pull/17141)** — *Retain the latest complete operation during compaction*. Keeps tool calls and results together verbatim post-compaction, summarizing only older history — addresses long-session fidelity.

5. **[#17375](https://github.com/QwenLM/qwen-code/pull/17375)** — *Close the context trust refusal's root-tmp and hard-link bypasses*. Hardens the verify-pr checker to fail closed and binds verification snapshots by content — a security-boundary fix.

6. **[#16661](https://github.com/QwenLM/qwen-code/pull/16661)** — *Repair the MCP connection torn down by an aborted tool call*. Aborting an in-flight MCP request used to leave the server `DISCONNECTED`; the abort path now arms transport repair.

7. **[#15936](https://github.com/QwenLM/qwen-code/pull/15936)** — *Reduce or refuse a compression request that cannot fit its window*. Prevents sending summarization requests that can't leave room for the output summary, with single-retry recovery on context-length rejection.

8. **[#17393](https://github.com/QwenLM/qwen-code/pull/17393)** — *Allow `description`/`statusMessage` metadata on managed hooks*. Fixes the manifest allowlist rejection in [#17381](https://github.com/QwenLM/qwen-code/issues/17381).

9. **[#16023](https://github.com/QwenLM/qwen-code/pull/16023)** — *Share resident external Workspace across sessions*. Later sessions/turns reuse a Workspace-scoped binding instead of tearing it down per cycle; closing a session becomes a membership release.

10. **[#17394](https://github.com/QwenLM/qwen-code/pull/17394)** — *Defer optional user warnings until after interactive startup*. Improves perceived startup latency by showing the UI while environment checks complete, with warnings surviving redraws and `/clear`.

---

## 5. Hot Discussions

*No Discussion data was provided in the source dataset; this section is omitted.*

---

## 6. Feature Request Trends

Distilled from Issues and PRs, three dominant directions:

1. **Managed Agent / Hosted Workspace maturity** — The largest cluster. Requests center on external workspace provisioning ([#15512](https://github.com/QwenLM/qwen-code/issues/15512)), resident workspace reuse ([#16023](https://github.com/QwenLM/qwen-code/pull/16023)), and channel adapters (DingTalk, [#17173](https://github.com/QwenLM/qwen-code/issues/17173)). Enterprises want ephemeral, session-isolated workers that behave like persistent, reusable environments.

2. **Session management & worktree parity** — Codex-style worktrees are becoming a default expectation ([#17228](https://github.com/QwenLM/qwen-code/pull/17228)), with follow-on requests for retention/snapshots and configurable worktree roots ([#17237](https://github.com/QwenLM/qwen-code/issues/17237)) and sidecar-backed cold-restore indexing ([#11611](https://github.com/QwenLM/qwen-code/pull/11611)).

3. **Untrusted-context & injection defenses** — Multiple requests converge on a systematic model of untrusted content: tracking untrusted context from shell/remote output ([#17318](https://github.com/QwenLM/qwen-code/issues/17318)) and sanitizing parallel-agent display surfaces ([#17386](https://github.com/QwenLM/qwen-code/issues/17386)).

---

## 7. Developer Pain Points

- **CI flakiness is a chronic tax.** The `deflake` issue class ([#17344](https://github.com/QwenLM/qwen-code/issues/17344), [#17366](https://github.com/QwenLM/qwen-code/issues/17366), [#17368](https://github.com/QwenLM/qwen-code/issues/17368), [#17363](https://github.com/QwenLM/qwen-code/issues/17363), [#17348](https://github.com/QwenLM/qwen-code/issues/17348), [#17360](https://github.com/QwenLM/qwen-code/issues/17360), [#17339](https://github.com/QwenLM/qwen-code/issues/17339)) dominates recent activity, with the bot explicitly noting: *if it fails again deterministically it is a real bug, not flakiness — do NOT stabilize it.*

- **The Managed Agent CI gate (#14724) has been open since October with 383 comments** — a long-lived, unattributed failure erodes trust in the pipeline and consumes maintainer attention.

- **Approval/render race conditions in multi-agent flows** — [#16425](https://github.com/QwenLM/qwen-code/issues/16425) (closed) and its sibling [#17332](https://github.com/QwenLM/qwen-code/issues/17332) show recurring hangs where permission dialogs silently fail to render in batched subagent calls.

- **Security-scan backlog** — [#17099](https://github.com/QwenLM/qwen-code/issues/17099) tracks 29 Snyk findings across transitive npm dependencies, and [#13078](https://github.com/QwenLM/qwen-code/issues/13078) shows the scheduled audit itself is unstable, leaving the project's vulnerability posture hard to assess.

- **Managed hook manifest rigidity** — Closed allowlists reject standard metadata ([#17381](https://github.com/QwenLM/qwen-code/issues/17381)), and Claude-imported hooks retain temporary plugin paths after install ([#17390](https://github.com/QwenLM/qwen-code/issues/17390)) — both friction points for extension authors.

---

*Digest generated for 2026-11-16. Sources: releases, issues, and pull requests updated in the last 24 hours on github.com/QwenLM/qwen-code.*

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*