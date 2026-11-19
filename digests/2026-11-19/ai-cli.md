# AI CLI Tools Community Digest 2026-11-19

> Generated: 2026-11-19 02:29 UTC | Tools covered: 7

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
**Date: 2026-11-19** | Source: Community digests for Claude Code, OpenAI Codex, Gemini CLI, GitHub Copilot CLI, OpenCode, Pi, and Qwen Code

---

## 1. Ecosystem Overview

The AI CLI ecosystem on 2026-11-19 is in a **consolidation-and-hardening phase**: every major tool shipped or staged incremental improvements (permission modes, sandboxing, ACP parity, provider breadth), but the dominant community signal is **reliability debt** rather than feature excitement. Three fault lines run across the ecosystem: **cross-platform regressions** (Windows Computer Use in Codex, WSL2/Entra auth in Copilot CLI, Wayland in Gemini CLI), **silent-failure semantics** (subagent termination reasons, ACP empty turns, managed-agent dead-ends), and **trust-eroding data-handling issues** (Claude Code's prompt-leakage and `rm -rf` reports, Copilot's credential-manager exhaustion, Pi's context-accounting mismatches). Meanwhile, **MCP has emerged as the ecosystem's most fragile critical surface** — authentication, policy enforcement, and process lifecycle issues dominate Copilot CLI and appear across Codex, Gemini, and Pi. Enterprise-readiness (policy, tenancy, auditability) is now a first-class competitive axis, not a checkbox.

---

## 2. Activity Comparison

| Tool | Hot Issues (top-10 comments) | PR Activity (last 24h) | Discussions | Release Status |
|---|---|---|---|---|
| **Claude Code** | 10 issues, up to 11 comments each; several high-severity security/data-loss reports | 1 PR (docs typo only) | N/A (not provided) | **v2.1.328 shipped** — auto permission mode, `onFailure: block` for `mcp_tool` |
| **OpenAI Codex** | 10 issues; #57101 at 64 comments; #56941 at 27 | ~10 PRs, nearly all from `copyberry[bot]` | Active — Show & tell + Ideas | **rust-v0.170.0 stable** + 2 alphas |
| **Gemini CLI** | 10 issues; top issue P1 at 13 comments | ~10 PRs, focused ACP-parity batch | N/A (not provided) | **v0.69.0 stable** + v0.70.0-preview.0 |
| **GitHub Copilot CLI** | 10 issues; #1595 at 30 comments | **0 PRs updated** | N/A (not provided) | **v1.0.114 patch** (no changelog) |
| **OpenCode** | 10 issues; #48882 at 46 comments / 47 👍 | ~10 PRs, mostly desktop/app fixes | N/A (not provided) | **None** |
| **Pi** | 10 issues; #11021 at 16 comments | ~10 PRs, TUI correctness batch | 1 discussion (AI helper bot policy) | **None** |
| **Qwen Code** | 10 issues; #14724 at **464 comments** (CI bot); #11680 at 83 | ~10 PRs, 1.0 Preview kernel migration | N/A (not provided) | **v0.28.0-nightly** (no stable) |

**Notes on methodology:**
- "Hot Issues" reflects the top-10 items by comment activity in each digest, not total open issue counts. These are **engagement proxies**, not backlog sizes.
- All seven repos have Issues enabled and use them as the primary community channel. **None required the "N/A" treatment** for Issues/PRs in this dataset — Claude Code and Copilot CLI are the two tools with PRs disabled-as-primary-channel dynamics (Claude Code shows near-zero PR throughput; Copilot CLI shows zero PR activity in-window), but both still expose PR data upstream.
- **Discussions data was only provided for OpenAI Codex and Pi**; the other five digests explicitly note Discussions data was unavailable, so those are marked "N/A" rather than "inactive."
- Qwen Code's headline issue count is inflated by a bot-filed CI failure thread (#14724, 464 comments) — a data artifact, not human engagement.

---

## 3. Shared Feature Directions

Six cross-community themes appear in **three or more** tool communities simultaneously:

### 3.1 Agent autonomy beyond the turn loop
- **Codex**: `monitor` tool to wake on background events (#29922); Adaptive Development Mode with multi-agent routing (#62394).
- **Gemini CLI**: persistent file-based task tracking to fight context rot (#18836); subagent observability (#22598).
- **Qwen Code**: event-driven 1.0 Preview loop kernel landing "one surface at a time" (#17045).
- **Claude Code**: compaction-model control (#96316) implies longer autonomous runs.
- **Direction**: users want agents to *react to CI/logs/files* rather than require human turn injection.

### 3.2 Finer permission/authorization granularity
- **Claude Code**: browser/threshold permission ergonomics (#107921); auto permission mode in v2.1.328.
- **Codex**: "Full Access" that actually means full access (#59249, #60450); authorization fatigue (#54854).
- **Copilot CLI**: MCP OAuth configurability (#5410), tenant selection for guests (#5157).
- **Gemini CLI**: per-workspace policy over global (#18397).
- **OpenCode**: `--no-auth` for serve (#43039), credential sourcing for non-interactive tasks (#64773).
- **Direction**: the "one policy per session" model is failing; users want **scoped, pre-authorized, and surface-specific** controls.

### 3.3 Transcript/UI controllability and density
- **Codex**: hide tool activity in TUI (#21252, 👍47); hover affordances (#62390).
- **OpenCode**: restore legacy sidebar (#48882, 👍47); session split view (#58245).
- **Gemini CLI**: subagent context in `/bug` reports (#21763).
- **Pi**: cursor flicker, scrollback redraws, tree-navigation history pollution (#12274, #12275, #12280).
- **Direction**: TUIs are becoming unreadable at scale; **progressive disclosure** is the shared ask.

### 3.4 Context-window and prompt-cache accounting trust
- **Pi**: 272K vs 500K mismatch (#11021), 6.2 cache regression (#12273), tool-order cache busting (#11529).
- **Gemini CLI**: token blowups from untruncated ACP outputs (#30234).
- **Qwen Code**: async hook context blocks unbounded (#17736).
- **Copilot CLI**: deferred MCP tool loading broken for org-managed models (#5481).
- **Direction**: reported context/cost budgets are **not trustworthy**, which directly affects compaction behavior and spend.

### 3.5 MCP/ACP lifecycle and parity
- **Copilot CLI**: Entra/OAuth breakage across macOS/Windows/WSL2 (#5250, #5350); registry-only policy drops servers (#5155).
- **Gemini CLI**: ACP parity PR cluster — truncation (#30234), parallel scheduling (#30236), session close (#30232).
- **Codex**: cross-environment MCP server support (v0.170.0); lazy stdio startup (#62366).
- **Qwen Code**: idle MCP connection parking across suspension (#17749).
- **Direction**: ACP and MCP are being treated as **first-class transports** that need semantic parity with native CLI paths.

### 3.6 Provider breadth and model transparency
- **Pi**: six new providers in flight (#11370); vision detection for llama.cpp (#12282).
- **OpenCode**: model enablement not showing required auth/cost (#64702); Mistral Large 4 invisible on mobile (#64762).
- **Qwen Code**: llama.cpp timeout/restart handling (#17245).
- **Codex**: missing models in app vs. CLI (#49464, #62187).
- **Direction**: the **provider abstraction layer is now a competitive moat**, but metadata (auth requirements, cost, context) is inconsistently surfaced.

---

## 4. Differentiation Analysis

| Dimension | Claude Code | OpenAI Codex | Gemini CLI | Copilot CLI | OpenCode | Pi | Qwen Code |
|---|---|---|---|---|---|---|---|
| **Primary target** | Pro devs, desktop-first | TUI power users + cloud sessions | Gemini-ecosystem devs, IDE-integrated | Enterprise GitHub orgs | OSS/self-hosted, mobile+desktop | SDK embedders, TUI purists | Qwen/Alibaba ecosystem, self-hosted |
| **Technical approach** | Closed harness, aggressive auto-permissions | Rust core, bot-driven PR velocity, cloud+CLI split | Native bash affinity, ACP-first parity | Policy-heavy, registry-governed MCP | V2 rewrite, desktop/mobile apps, Rust Code Mode port | Embeddable SDK + durable sessions, extension API | Event-driven 1.0 kernel, managed-agent subsystem |
| **Release cadence** | Frequent patches (v2.1.328) | Fast stable + alpha train (0.170/0.171/0.172) | Steady stable + preview | Patch-only, opaque changelog | No release this cycle | No release this cycle | Nightly-only, no stable |
| **Signature strength** | Bedrock/GCP/Foundry auto-mode breadth | Computer Use + WebRTC voice + Guardian v3 | ACP parity, AST-aware roadmap | Enterprise policy surface | Legacy UI demand, multi-surface (app/mobile/TUI) | Extension API depth, durability primitives | Managed-agent, DingTalk/QQ channel integration |
| **Signature weakness** | Security/data-loss reports; desktop instability | Windows Computer Use pipeline | Silent-failure termination reasons | MCP OAuth/Entra failure cluster | V2 cross-platform regressions | Virtual-model handling; context accounting | CI flakiness as per-commit issue noise |

**Key differentiators:**
- **Claude Code** is the only tool with **hyperscaler-distributed auto-permission** (Bedrock + GCP + Foundry + Claude apps) in a single release — but its community digest is dominated by severity-class bugs, suggesting scale is outpacing hardening.
- **Codex** has the **highest automated PR throughput** (`copyberry[bot]` landing coordinated TUI/sandbox/app-server batches) and the strongest Discussions channel (Show & tell ecosystem). Its Windows Computer Use regressions are the ecosystem's most severe platform-specific cluster.
- **Gemini CLI** is executing the **cleanest ACP parity program** — a single contributor landed truncation, parallel scheduling, and session-close fixes in one window.
- **Copilot CLI** is the most **policy-first** but shows the **least development velocity** (0 PRs in-window), with auth breakage concentrated in the enterprise surface.
- **OpenCode** and **Pi** are the **most community-driven** (OpenCode's sidebar demand; Pi's extension API pressure), with OpenCode showing the strongest mobile/desktop ambition.
- **Qwen Code** is the most **channel-integration-heavy** (DingTalk cards, QQ media, PR-watch injection) but carries the heaviest CI-process debt.

---

## 5. Community Momentum & Maturity

### Momentum leaders (velocity + engagement)
1. **OpenAI Codex** — highest PR throughput, active Discussions (ecosystem tools index at 150+), fast stable+alpha cadence. Mature release engineering, but **Computer Use is a systemic weak point**.
2. **Qwen Code** — intense PR activity around a **1.0 architectural rewrite** (event-driven loop kernel), managed-agent subsystem expanding rapidly. Highest raw issue-comment count is a CI-bot artifact, but underlying feature velocity is real.
3. **Gemini CLI** — steady stable releases, coherent ACP parity batch, strong P1 triage. **Community upvotes concentrate on subagent hangs** — a maturity gap in orchestration.

### Maturity leaders (stability, ecosystem, enterprise readiness)
1. **Claude Code** — largest install base implied by desktop-issue proliferation; hyperscaler distribution; but **security-class reports (#111061, #107274) are maturity-limiting**.
2. **GitHub Copilot CLI** — strongest enterprise policy surface; however, **auth/policy breakage and zero PR velocity in-window** signal a maintenance-mode risk.
3. **OpenAI Codex** — bot-driven PR pipeline suggests **industrialized maintenance**; Guardian v3 work shows governance maturity.

### Rapidly iterating (pre-1.0 / architectural churn)
- **OpenCode** — V2 rewrite mid-flight, cross-platform regressions expected; community demanding legacy UI restoration is a **product-direction tension**.
- **Pi** — no releases this cycle but heavy issue/PR churn on **extension API and durability primitives**; embedders are the leading indicator.
- **Qwen Code** — 1.0 Preview kernel landing "one surface at a time" with a **2026-11-21 freeze** — a hard deadline that will reveal integration quality.

### Community health signal
- **Discussions data availability** is itself a maturity indicator: Codex and Pi expose Discussions as a first-class channel; the other five do not surface it in this dataset. For enterprises evaluating **community support quality**, this matters.

---

## 6. Trend Signals

### 6.1 The "silent failure" epidemic is the #1 trust problem
Across **Gemini CLI** (MAX_TURNS → `GOAL`, Wayland → `GOAL`, ACP empty turns), **Copilot CLI** (MCP OAuth with no error/popup, managed-policy settlement hangs), **Codex** (macOS Work submit silently fails, browser backend never attaches), and **Qwen Code** (anti-replay dead-ends), the pattern is identical: **failures that look like successes**. 
**Reference value**: any tool that surfaces termination reasons, attaches diagnostics to failures, and exposes a recovery path will win enterprise trust. This is a **spec-level opportunity**, not a bug-fix race.

### 6.2 MCP/ACP is the new integration tax
Copilot CLI's Entra/OAuth cluster (8+ interrelated issues), Codex's lazy stdio startup and cross-environment support, Gemini's ACP parity batch, and Qwen's MCP parking all point the same way: **the protocol layer is where integration cost now lives**. 
**Reference value**: teams adopting MCP should budget for **auth broker concurrency, tenant authority, and process lifecycle** as first-class concerns — not afterthoughts.

### 6.3 Context/cost accounting is a competitive differentiator
Pi's 272K-vs-500K mismatch, its 6.2 cache regression (~8.8k extra uncached tokens/turn), and Copilot's broken deferred tool loading for org models all translate to **real money and real compaction errors**. 
**Reference value**: **reported context budget and cache-reuse telemetry** should be treated as product features. Users will migrate toward tools whose numbers they trust.

### 6.4 Cross-platform parity remains unsolved
Windows (Codex Computer Use, Copilot Credential Manager, Gemini `/ide install`), WSL2 (Copilot OAuth), Wayland (Gemini browser), Android/Termux (OpenCode watcher), and FreeBSD (OpenCode kqueue) all show **platform-specific breakage that is not being systematically addressed**. 
**Reference value**: for enterprises with mixed fleets, **platform-support matrices and per-platform CI gates** are non-negotiable evaluation criteria.

### 6.5 Agent instruction-following is emerging as a distinct quality axis
OpenCode's "Big Pickle rogue" (#64695), Qwen's permission-ignoring report (#17757), Gemini's destructive-git concerns (#22672), and Claude Code's fabricated `<task-notification>` events (#105340) describe a **behavioral-trust problem separate from raw model quality**. 
**Reference value**: harness-level **constraint enforcement** (not prompt-level) is the mitigation path. Tools that can *prove* the agent did what was asked — via verifiable action logs — will differentiate.

### 6.6 TUI density is a UX cliff
Codex (#21252, 👍47), OpenCode (#48882, 👍47), and Pi's render-fix cluster all converge on the same insight: **tool-call verbosity destroys long-session readability**. 
**Reference value**: progressive disclosure (hide-tools toggle, session split view, per-turn collapse) is a **high-ROI UX investment** with strong community demand.

### 6.7 Durability and embeddability are the next frontier
Pi's durability primitives (cancellable tool handlers, conversation truncation), Qwen's stateless hosted harness with MCP parking, and Codex's app-server/CLI divergence issues all point to **long-running, embedded, multi-surface deployments** as the growth segment. 
**Reference value**: session-management internals (memory growth, SQLite write amplification, cross-conversation entry management) are the **scaling bottleneck** for the next generation of agent hosts.

---

### Bottom Line for Technical Decision-Makers

- **If you need enterprise policy + GitHub integration**: Copilot CLI, but **validate Entra/OAuth and policy-settlement behavior in your tenancy first** — the failure cluster is active.
- **If you need broad model/provider and hyperscaler distribution**: Claude Code, but **track the security/data-loss reports** (#111061, #107274) and desktop stability.
- **If you need automation/CI integration and ecosystem breadth**: OpenAI Codex — strongest PR velocity and Discussions, but **Windows Computer Use is not production-ready**.
- **If you need self-hosted or Qwen-ecosystem alignment**: Qwen Code — but **wait for the 1.0 kernel freeze to clear** before committing.
- **If you need embeddability or extension depth**: Pi — but **audit context-accounting and virtual-model handling** for cost exposure.
- **If you need mobile/desktop surfaces and community-driven UX**: OpenCode — but **expect V2 cross-platform churn**.

The through-line across all seven tools: **the feature race is over; the reliability race has begun.**

---

## Per-Tool Reports

<details>
<summary><strong>Claude Code</strong> — <a href="https://github.com/anthropics/claude-code">anthropics/claude-code</a></summary>

## Claude Code Skills Highlights

> Source: [anthropics/skills](https://github.com/anthropics/skills)

# Claude Code Skills — Community Highlights Report
*Data snapshot: 2026-11-19 | Source: github.com/anthropics/skills*

---

## 1. Top Skills Ranking (by community discussion/attention)

| Rank | PR | Skill | Status | Functionality & Discussion Highlights |
|------|-----|-------|--------|----------------------------------------|
| 1 | [#1742](https://github.com/anthropics/skills/pull/1742) | **mcp-builder** (fix) | Open | Adapts MCP builder to `mcp>=2.0.0` API changes — `streamable_http_client` rename and custom headers via `create_mcp_http_client`. Fixes #1668; spans Sep–Oct 2026, indicating sustained maintenance attention. |
| 2 | [#1298](https://github.com/anthropics/skills/pull/1298) | **skill-creator** (fix) | Open | Isolates trigger evals and handles Windows/runtime failures. Addresses false-miss evaluations — a recurring pain point echoed in Issues #556 and #1352. |
| 3 | [#1245](https://github.com/anthropics/skills/pull/1245) | **notion-spec-to-implementation** + **quantitative-resume-auditor** | Open | Turns product/tech specs into actionable Notion tasks with acceptance criteria. Notable as a *two-skill* submission; active through Oct 2026. |
| 4 | [#1980](https://github.com/anthropics/skills/pull/1980) | **webapp-testing** (security fix) | Open | Removes `shell=True` in `with_server.py` to close a command-injection vector (CWE-78). One of several webapp-testing fixes (#1976) by the same contributor cohort. |
| 5 | [#525](https://github.com/anthropics/skills/pull/525) | **pyxel** (retro game dev) | Open | Guides retro game creation/debugging in Python with headless runs and frame inspection. Longest-running active PR (since Mar 2026) — highest persistence. |
| 6 | [#1792](https://github.com/anthropics/skills/pull/1792) | **docx** (fix) | Open | Reports LibreOffice timeouts as errors and verifies output no longer carries revision marks. Part of a cluster of docx reliability PRs (#1734, #2018). |
| 7 | [#514](https://github.com/anthropics/skills/pull/514) | **document-typography** | Open | Enforces typographic QC — orphan word wrap, widow paragraphs, numbering alignment. Novel "invisible quality" category. |
| 8 | [#1977](https://github.com/anthropics/skills/pull/1977) | **algorithmic-art** (fix) | Open | Corrects `wrapAround()` modulo handling for negative values (fixes #1897). Representative of rapid small-fix PRs. |

**Observation:** The top slots are dominated by **fixes to existing skills** (mcp-builder, skill-creator, docx, webapp-testing), not net-new skills — a sign the ecosystem is maturing from breadth to reliability.

---

## 2. Community Demand Trends (from Issues)

| Direction | Signal | Representative Issue |
|-----------|--------|----------------------|
| **Trust & namespace security** | 46 comments — the single most-discussed issue | [#492](https://github.com/anthropics/skills/issues/492) Community skills impersonating `anthropic/` namespace |
| **Skill evaluation reliability** | Multiple high-comment issues (13, 6) on false trigger rates | [#556](https://github.com/anthropics/skills/issues/556), [#1352](https://github.com/anthropics/skills/issues/1352) |
| **Enterprise/org skill sharing** | 17 comments, 8 👍 | [#228](https://github.com/anthropics/skills/issues/228) Org-wide skill library vs. manual `.skill` file passing |
| **Context/token efficiency** | 5 comments, high severity | [#1487](https://github.com/anthropics/skills/issues/1487) `claude-api` injects ~156k tokens eagerly |
| **Agent governance & reasoning quality** | Structured proposals | [#412](https://github.com/anthropics/skills/issues/412), [#1385](https://github.com/anthropics/skills/issues/1385) Quality-gate pipelines |
| **Skill authoring best practice** | 8 comments, closed | [#202](https://github.com/anthropics/skills/issues/202) `skill-creator` should be operational, not educational |
| **Memory/state compaction** | 10 comments | [#1329](https://github.com/anthropics/skills/issues/1329) Symbolic notation for compact agent state |

**Distilled direction:** The community is shifting demand from *"more skills"* toward **trust, evaluation correctness, token economy, and governance** — the infrastructure layer around skills rather than the skills themselves.

---

## 3. High-Potential Pending Skills (active, not yet merged)

| PR | Skill | Why it may land soon |
|----|-------|----------------------|
| [#2108](https://github.com/anthropics/skills/pull/2108) | **docs: document skills snapshot/sync** | Docs-only clarification citing verifiable milestones (#1447, #330); low merge risk. |
| [#1997](https://github.com/anthropics/skills/pull/1997) | **skill-creator** YAML parsing fix | Corrects `parse_skill_md` quote/continuation handling; tied to eval accuracy demand. |
| [#1681](https://github.com/anthropics/skills/pull/1681) | **skill-creator** direct execution fix | Resolves `ModuleNotFoundError` for standalone `package_skill.py` — clear, scoped bugfix. |
| [#1730](https://github.com/anthropics/skills/pull/1730) | **claude-api** dead-URL fix | Replaces 3 hard-404 URLs, verified HTTP 200 via curl; trivial to review. |
| [#1975](https://github.com/anthropics/skills/pull/1975) | **pptx** `--cols` validation | Early argparse validation; fixes #1809, clean boundary case. |
| [#2019](https://github.com/anthropics/skills/pull/2019) | **xlsx** external-link resolution | Fixes #2013 false negatives in `external_links_at_risk`. |
| [#1771](https://github.com/anthropics/skills/pull/1771) | **proofcore-contract-auditor** | New Web3 skill anchoring audit proofs on TON — ambitious but niche; uncertain. |
| [#1703](https://github.com/anthropics/skills/pull/1703) | **md2video-audio** | Markdown → MP4 with voiceover via Marp; novel but heavy dependency surface. |

**Pattern:** Fix-oriented PRs (1997, 1681, 1730, 1975, 2019) have the shortest path to merge. Ambitious net-new skills (1771, 1703, 1245) face longer review cycles.

---

## 4. Skills Ecosystem Insight

> **The community's most concentrated demand is no longer for new Skills, but for making existing Skills trustworthy — reliable evaluation, secure execution, and correct packaging — with namespace integrity (#492) and skill-creator correctness as the twin focal points.**

---

*Report generated from public GitHub metadata. Comment counts for PRs were unavailable (`undefined`) in the source data; PRs are ranked by recency of activity and discussion density inferred from update timestamps and linked issues.*

---

# Claude Code Community Digest — 2026-11-19

## 1. Today's Highlights

Claude Code **v2.1.328** ships a significant release: an **auto permission mode** for Opus 4.6 and Sonnet 4.6 across Amazon Bedrock, Google Cloud's Agent Platform, Microsoft Foundry, and the Claude apps gateway, plus `"onFailure": "block"` support for `mcp_tool` hooks. On the community side, a serious **cross-user prompt leakage report** (#111061) in VS Code 2.1.327 and a **file-system destruction report** (#107274, `rm -rf` removing 12+ months of git history) dominate attention. Desktop app issues continue to proliferate, with duplicated keystrokes, Remote Control silently disabling itself, and artifact-sharing regressions all active today.

## 2. Releases

**v2.1.328** (last 24h):
- Added **auto mode** for Claude Opus 4.6 and Sonnet 4.6 on Amazon Bedrock, Google Cloud's Agent Platform, Microsoft Foundry, and Claude apps gateway; interactive sessions without a permission mode now start in it.
- Added `"onFailure": "block"` for `mcp_tool` hooks, matching existing behavior for command and HTTP hooks.

🔗 https://github.com/anthropics/claude-code/releases

## 3. Hot Issues

1. **#75182 — Assistant text before `AskUserQuestion` never displayed** — 11 comments, 14 👍. High-engagement TUI bug: reasoning text preceding a tool call in the same turn is silently dropped in the terminal CLI. Community validation is strong (highest 👍 today). 🔗 https://github.com/anthropics/claude-code/issues/75182
2. **#111061 — Cross-user prompt leakage (VS Code 2.1.327)** — Other users' Opus 4.7 requests appearing in a local chat window with Remote Control disabled. If confirmed, this is the most severe security-class issue in the digest. 🔗 https://github.com/anthropics/claude-code/issues/111061
3. **#107274 — `rm -rf` deleted 12+ months of git history** — A data-loss report alleging the harness issued a destructive `rm -rf` on macOS. Low comment count but critical severity; likely to escalate. 🔗 https://github.com/anthropics/claude-code/issues/107274
4. **#107318 — Shared artifacts unreadable after desktop update** — 10 comments. Cross-account artifact sharing (read/edit/republish) broke when artifact tools moved to the new connector. Related follow-ups (#109194, #110440) suggest a systemic auth/permission regression. 🔗 https://github.com/anthropics/claude-code/issues/107318
5. **#104422 — Desktop auto-update restarts mid-workday** — 9 comments, 6 👍. Four forced restarts in a single day on Windows; clear demand for user-controlled update timing. 🔗 https://github.com/anthropics/claude-code/issues/104422
6. **#80708 — Hung `ps` child processes exhaust macOS process limit** — 8 comments. Long-running core bug where orphaned child processes accumulate until the per-user limit is hit. 🔗 https://github.com/anthropics/claude-code/issues/80708
7. **#102874 — Routines API returns 403 for active projects** — 7 comments, 7 👍. `fire` endpoint reports "this project is paused" for active Projects — clear API bug with good community corroboration. 🔗 https://github.com/anthropics/claude-code/issues/102874
8. **#89158 — Desktop keystroke duplication (macOS)** — 7 comments. Key events (not characters) duplicate, so `fix this` becomes `ffiixx tthhiiss`; related duplicates #92622, #105349, #110547 indicate a persistent input-handling defect. 🔗 https://github.com/anthropics/claude-code/issues/89158
9. **#94454 — BSOD in `bindflt.sys` triggered by Cowork VM + Python MCP** — 7 comments. Windows kernel crash correlated with Cowork VM Service startup; related #92779 filed as invalid but same signature. 🔗 https://github.com/anthropics/claude-code/issues/94454
10. **#106422 — `--resume` resurrects messages removed by `session.compact` hook** — 5 comments. Hook contract violation: compaction semantics are not honored on resume for session files ≤ 5 MiB. 🔗 https://github.com/anthropics/claude-code/issues/106422

## 4. Key PR Progress

Only **one PR** was updated in the last 24h:

1. **#86537 — Fix duplicated word in CHANGELOG.md** — Documentation-only typo fix ("to to" in the `CLAUDE_BASH_NO_LOGIN` entry for v1.0.124). Open since 2026-08-13; no comments yet. 🔗 https://github.com/anthropics/claude-code/pull/86537

*Note: With only one PR in the window, no further items can be listed. The PR pipeline is notably quiet relative to issue volume.*

## 5. Hot Discussions

No Discussions data was provided.

## 6. Feature Request Trends

Distilled from open issues and enhancements:

- **Compaction model control** — #96316 requests `compactModel` / `CLAUDE_CODE_COMPACT_MODEL` so cheap models can handle context compaction instead of expensive Opus/Fable-class sessions (3 👍).
- **User-controlled updates** — #104422 asks for update scheduling and persistent notifications instead of forced mid-workday restarts.
- **Artifact export parity** — #110985 requests exporting artifacts shared *to* you (HTML/MD/PDF) with the same options as owned artifacts.
- **GitHub integration breadth** — #106713 requests linking orgs for outside collaborators with write access to enable cloud sessions.
- **Browser/threshold permission ergonomics** — #107921 reports allowed-site prompts firing per-action; a recurring theme around permission granularity.

## 7. Developer Pain Points

- **Desktop app instability dominates**: keystroke duplication (#89158, #92622, #105349, #110547), auto-update restarts (#104422), and Remote Control silently disabling itself (#87777 closed, #111057 open) form a cluster of desktop reliability complaints.
- **Artifact sharing/auth regressions**: a web of interrelated bugs (#107318, #109194, #110440, #110628, #110603) where cross-account and cross-org artifact access behaves inconsistently between claude.ai, Claude Code, and the desktop connector model.
- **Process and resource leaks**: hung `ps` children (#80708) and Cowork VM-related BSODs (#94454) point to lifecycle management gaps on macOS and Windows.
- **Cost accounting trust**: #97997 reports Fable weekly usage counted despite zero Fable requests, echoing prior #96035 — billing transparency remains a friction point.
- **Model reliability concerns**: #105340 describes the model fabricating `<task-notification>`/Monitor events and then reporting results from them — a hallucination pattern with real workflow risk.
- **Windows native install fragility**: #111067 shows `claude update` failing after `claude.exe` is renamed, leaving no binary on PATH.

---
*Generated from github.com/anthropics/claude-code data for 2026-11-19. Links preserved for verification.*

</details>

<details>
<summary><strong>OpenAI Codex</strong> — <a href="https://github.com/openai/codex">openai/codex</a></summary>

# OpenAI Codex Community Digest — 2026-11-19

## 1. Today's Highlights

The Codex team shipped **rust-v0.170.0**, which introduces WebRTC negotiation for realtime voice calls in the TUI, auto-refreshed OpenTelemetry auth headers, and experimental cross-environment MCP server support. Meanwhile, the community's attention is dominated by a wave of **Windows Computer Use regressions** — two related issues (#57101, #56941) account for nearly 90 combined comments, describing persistent screen-capture overlays and system-wide UI lag that only clears when `codex-computer-use.exe` is killed. A steady stream of ecosystem integrations (MCP servers for mail, social posting, video editing) continues to arrive via Show and tell.

## 2. Releases

**rust-v0.170.0** (stable)
- **New Features:**
  - WebRTC negotiation for realtime voice calls in the TUI ([#61172](https://github.com/openai/codex/pull/61172))
  - Automatically refreshed authentication headers for OpenTelemetry HTTP exporters ([#61028](https://github.com/openai/codex/pull/61028))
  - Experimental support for identically named MCP servers across environments ([#60905](https://github.com/openai/codex/pull/60905))
- **Bug Fixes:** none listed in this release.

**Pre-releases:** `rust-v0.172.0-alpha.1` and `rust-v0.171.0-alpha.13` were published with no accompanying changelog notes — likely incremental alpha cadence ahead of the 0.171/0.172 stable cut.

## 3. Hot Issues

1. **[#57101](https://github.com/openai/codex/issues/57101) — Windows Computer Use: capture access and gold display border persist after turn completes** (64 comments, 👍12). The highest-traffic issue in the window. Users report that the yellow/gold screen-capture border and capture entitlement remain active after a screenshot-producing turn ends, raising both privacy and UX concerns. Community is clearly treating this as a blocker for Computer Use on Windows.

2. **[#56941](https://github.com/openai/codex/issues/56941) — System-wide UI lag persists after Computer Use; killing `codex-computer-use.exe` fixes it** (27 comments, 👍3). A companion symptom to #57101. The "kill the helper process to restore the machine" workaround has become the de facto mitigation and is fueling broader distrust of the Computer Use pipeline on Windows.

3. **[#29922](https://github.com/openai/codex/issues/29922) — Feature: agent-callable `monitor` tool to wake Codex on background events** (25 comments, 👍10). A well-argued proposal to escape the turn-driven model: let Codex subscribe to logs, files, builds, and CI events instead of polling. Strong support from agent-workflow developers.

4. **[#21252](https://github.com/openai/codex/issues/21252) — CLI option to hide tool activity in TUI** (24 comments, 👍47). Highest upvote count in the top set. Long-running sessions become unreadable when tool-call cells dominate the transcript; users want a toggle to view only reasoning and answers.

5. **[#42950](https://github.com/openai/codex/issues/42950) — Public Codex "Sites" blocked by Cloudflare for external visitors** (18 comments). A deployment/connectivity bug that breaks published sites for their intended audience — a sharp edge for anyone using Sites for real distribution.

6. **[#51636](https://github.com/openai/codex/issues/51636) — macOS Work: Enter / send button silently fails to submit messages** (18 comments). A regression that stalls Work conversations entirely, with no error surfaced. Reproduces across two projects and survives restarts.

7. **[#24610](https://github.com/openai/codex/issues/24610) — Add explicit deletion controls for archived cloud sessions** (17 comments, 👍32). High-signal privacy request: archiving is not deletion, and archived sessions may contain sensitive repo context. Data-retention concern for teams.

8. **[#33782](https://github.com/openai/codex/issues/33782) — Desktop freeze on large image-heavy threads (ResizeObserver loop)** (13 comments). A rendering-layer hang that traps users in specific threads; the ResizeObserver detail gives maintainers a concrete lead.

9. **[#33593](https://github.com/openai/codex/issues/33593) — Shared `models_cache.json` oscillates between originator-specific catalogs across app-server processes** (8 comments). Subtle multi-process cache coherence bug; relevant to anyone running app-server alongside CLI.

10. **[#62394](https://github.com/openai/codex/issues/62394) — Adaptive Development Mode with task-aware multi-agent orchestration and model routing** (2 comments, new). Fresh proposal to reduce manual model/mode switching across CLI, IDE, and App surfaces — the kind of orchestration feature the community has been circling for months.

## 4. Key PR Progress

Nearly all top PRs this window are attributed to `copyberry[bot]` — an automated projection pipeline landing a large, coordinated batch of TUI, sandbox, and app-server work.

1. **[#62403](https://github.com/openai/codex/pull/62403) — Reconcile unfinished Cloud replies in the TUI transcript.** Fixes stale prefixes left when a restored Cloud reply is marked complete before its final text arrives. Directly targets transcript correctness.

2. **[#62390](https://github.com/openai/codex/pull/62390) — Highlight clickable links and controls on hover in the fullscreen TUI.** Pointer-shape alone wasn't enough; hover now changes foreground color to make clickable regions visible.

3. **[#62389](https://github.com/openai/codex/pull/62389) — Pause runtime sandbox integrity checks.** Removes telemetry-only integrity checks that duplicate policy preparation, trimming launch-path overhead for command execution.

4. **[#62386](https://github.com/openai/codex/pull/62386) — Prepare managed proxy settings once per sandbox command.** Prevents launch-time re-preparation from overwriting credentials already bound to a command's shell environment.

5. **[#62377](https://github.com/openai/codex/pull/62377) / [#62376](https://github.com/openai/codex/pull/62376) / [#62375](https://github.com/openai/codex/pull/62375) — Cross-platform path handling for workspace roots, sandbox writable roots, and thread working directories.** A trio of fixes so a Unix client talking to a Windows app-server (and vice versa) no longer rejects `C:\...` paths as relative. Important for remote/SSH workflows.

6. **[#62374](https://github.com/openai/codex/pull/62374) — Reconsider denials in attached Guardian reviews.** Moves denial reconsideration into the shared verdict path so attached Guardian reviews behave like standalone reviews.

7. **[#62373](https://github.com/openai/codex/pull/62373) — Opt-in in-memory message boards for Guardian v3.** Each root thread gets an in-memory SQLite board shared by housekeeper and reviewer until the last handle closes.

8. **[#62372](https://github.com/openai/codex/pull/62372) — Configurable Guardian V3 routing and retrieval guidance.** Makes evidence-grouping instructions tunable and reduces context pressure from long routing prompts.

9. **[#62366](https://github.com/openai/codex/pull/62366) — Enable lazy startup for stdio MCP servers by default.** `mcp_lazy_stdio_startup` goes stable: with a cached tool catalog, optional stdio MCP servers defer process start until first tool call.

10. **[#62370](https://github.com/openai/codex/pull/62370) — Share config layer entries across snapshots via `Arc`.** Avoids deep-copying TOML data on every `ConfigLayerStack` clone — a quiet but meaningful config-path performance win.

## 5. Hot Discussions

### Show and tell

- **[#16329](https://github.com/openai/codex/discussions/16329) — Awesome Codex CLI: 150+ ecosystem tools** (11 comments). A curated index of subagents, skills, plugins, and MCP servers, born from the pain of scattered discovery. Still the most-commented discussion in the set.
- **[#60116](https://github.com/openai/codex/discussions/60116) — Pushary: approve Codex actions from your phone** (2 comments). Hosted service bridging Codex native hooks + MCP so policy-gated shell/patch/MCP calls surface on mobile. Also supports "send a git push to your team lead."
- **[#62355](https://github.com/openai/codex/discussions/62355) — Slidr: desktop presentation editor driven by Codex via a Deck API.** Codex CLI runs against a Deck API to read/edit/render slides.
- **[#62324](https://github.com/openai/codex/discussions/62324) — Yaptake: Mac video editor controllable through transcript + Codex plugin.**
- **[#62259](https://github.com/openai/codex/discussions/62259) — Postage: Mac mail client with a built-in MCP server for Codex** (IMAP, localhost-only, revocable tokens).
- **[#62244](https://github.com/openai/codex/discussions/62244) — Octopost: remote MCP server to post to X, Bluesky, Mastodon, LinkedIn.**
- **[#62316](https://github.com/openai/codex/discussions/62316) — Built with Codex: Last Plank and Harbor Signal, two browser puzzle games.**
- **[#61667](https://github.com/openai/codex/discussions/61667) — Plainer handoff note exercise** (no-account, reload-persistence check).

### Ideas

- **[#62213](https://github.com/openai/codex/discussions/62213) — Built-in one-click prompt enhancement for ChatGPT and Codex.** Requests a native "Optimize Prompt" control in the input box, citing WorkBuddy and Kilo as prior art.

## 6. Feature Request Trends

- **Autonomy beyond the turn loop.** The `monitor` tool proposal ([#29922](https://github.com/openai/codex/issues/29922)) plus the Adaptive Development Mode request ([#62394](https://github.com/openai/codex/issues/62394)) both point the same direction: users want Codex to react to background events and self-select models/agents rather than requiring a human to drive every turn.
- **Transcript/UI controllability.** Hiding tool activity ([#21252](https://github.com/openai/codex/issues/21252), 👍47), rebinding app shortcuts ([#42957](https://github.com/openai/codex/issues/42957)), and hover affordances (#62390) all ask for finer control over an increasingly dense TUI.
- **Data lifecycle & privacy.** Explicit deletion of archived cloud sessions ([#24610](https://github.com/openai/codex/issues/24610), 👍32) and env-var leakage across daemon sessions ([#53547](https://github.com/openai/codex/issues/53547)) reflect growing concern about what Codex retains and shares between contexts.
- **"Full Access" that actually means full access.** [#59249](https://github.com/openai/codex/issues/59249) and [#60450](https://github.com/openai/codex/issues/60450) both push against sandbox/authorization layers that override explicit user settings.
- **Pre-authorized scheduled workflows.** [#42696](https://github.com/openai/codex/issues/42696) and [#58589](https://github.com/openai/codex/issues/58589) ask for scoped, one-shot approval handoffs so automations and MFA flows can complete without a live human.

## 7. Developer Pain Points

- **Windows Computer Use is the dominant reliability complaint.** Persistent capture overlays, system-wide lag requiring process kills, screenshot timeouts, and missing click geometry ([#57101](https://github.com/openai/codex/issues/57101), [#56941](https://github.com/openai/codex/issues/56941), [#58773](https://github.com/openai/codex/issues/58773)) suggest the Windows capture/helper pipeline needs foundational work, not patching.
- **Authorization fatigue and inconsistent permission semantics.** Users report repeated prompts on already-approved task steps ([#54854](https://github.com/openai/codex/issues/54854)) and settings being silently overridden by workspace-write sandboxing ([#60450](https://github.com/openai/codex/issues/60450)). The mental model of Full Access vs. Approve-for-me vs. per-workspace policy is not landing.
- **App/server and CLI divergence.** Missing models in one surface but present in another ([#49464](https://github.com/openai/codex/issues/49464), [#62187](https://github.com/openai/codex/issues/62187)), stale model caches ([#33593](https://github.com/openai/codex/issues/33593)), and rate-limit display regressions ([#45052](https://github.com/openai/codex/issues/45052)) all stem from surfaces evolving at different speeds.
- **Silent failures.** Messages that won't submit on macOS Work ([#51636](https://github.com/openai/codex/issues/51636)), login state that fails without actionable error ([#61123](https://github.com/openai/codex/issues/61123)), and in-app browser backends that never attach while the agent quietly substitutes Playwright ([#59417](https://github.com/openai/codex/issues/59417)). Users repeatedly ask for *visible* failure modes.
- **Disk and resource hygiene.** The macOS runtime installer leaving ~381 temp directories consuming ~472 GB ([#61570](https://github.com/openai/codex/issues/61570)) is an extreme case, but it fits a pattern of background processes and caches not being cleaned up between runs.

</details>

<details>
<summary><strong>Gemini CLI</strong> — <a href="https://github.com/google-gemini/gemini-cli">google-gemini/gemini-cli</a></summary>

# Gemini CLI Community Digest — 2026-11-19

## 1. Today's Highlights

The project shipped v0.69.0 and cut v0.70.0-preview.0, with a notable fix preserving literal `$` characters during template placeholder replacement and a new `/stats heatmap` subcommand for daily token usage. Meanwhile, the issue tracker is dominated by subagent reliability problems: a P1 bug reports that MAX_TURNS interruptions are misreported as `GOAL` success, and a generalist-agent hang continues to draw strong community upvotes. ACP (Agent Client Protocol) parity work is also accelerating, with a cluster of PRs from the same contributor bringing CLI behavior—truncation, parallel scheduling, session lifecycle—into line with the ACP path.

## 2. Releases

**v0.69.0** (stable)
- `fix(core,cli)`: Preserve literal `$` characters during template placeholder replacement ([#30136](https://github.com/google-gemini/gemini-cli/pull/30136))
- `feat(cli)`: Add `/stats heatmap` subcommand for daily token usage ([#30222](https://github.com/google-gemini/gemini-cli/pull/30222))

**v0.70.0-preview.0** (preview)
- Changelog entries for v0.69.0-preview.0 and v0.68.0 ([#30224](https://github.com/google-gemini/gemini-cli/pull/30224))
- Automated version bump to `0.70.0-nightly.20261110.g1603e9b`

The `/stats heatmap` addition is the headline user-facing feature; the `$`-escaping fix resolves a subtle but disruptive templating bug.

## 3. Hot Issues

1. **[#22323](https://github.com/google-gemini/gemini-cli/issues/22323) — Subagent MAX_TURNS reported as GOAL success** (P1, 13 comments, 2 👍). The `codebase_investigator` subagent reports `status: "success"` / `Termination Reason: "GOAL"` even when it hit the max turn limit before doing any analysis. This is a correctness and trust issue: orchestration logic and users can't distinguish real completion from silent truncation. The high comment count reflects maintainer retesting activity.

2. **[#21409](https://github.com/google-gemini/gemini-cli/issues/21409) — Generalist agent hangs** (P1, 8 comments, 8 👍). Whenever the CLI defers to the generalist agent, it hangs indefinitely—even for trivial tasks like folder creation. Instructing the model not to defer to subagents works around it. The 8 upvotes make this the most community-endorsed issue in the current queue.

3. **[#19873](https://github.com/google-gemini/gemini-cli/issues/19873) — Zero-dependency OS sandboxing & post-execution intent routing** (P2, 9 comments). A design proposal to lean into Gemini 3's native bash affinity by chaining POSIX tools, while keeping execution safe. Signals a strategic direction: sandboxing as the enabler for more aggressive shell use.

4. **[#21968](https://github.com/google-gemini/gemini-cli/issues/21968) — Gemini under-uses skills and subagents** (P2, 7 comments). Anecdotal but resonant: the model won't invoke custom skills (e.g., gradle, git) unless explicitly told to, even when contextually relevant. Directly undermines the value proposition of user-defined agents.

5. **[#22745](https://github.com/google-gemini/gemini-cli/issues/22745) — AST-aware file reads, search, and mapping** (P2, 7 comments). Epic tracking whether AST-aware tooling can reduce misaligned reads and token noise. Related investigations: [#22746](https://github.com/google-gemini/gemini-cli/issues/22746) (codebase mapping via tilth/glyph) and [#22747](https://github.com/google-gemini/gemini-cli/issues/22747) (ast-grep for reads/search).

6. **[#22267](https://github.com/google-gemini/gemini-cli/issues/22267) — Browser Agent ignores `settings.json` overrides** (P2, 5 comments). `AgentRegistry` reads and merges settings correctly, but the Browser Agent ignores them at runtime—e.g., `maxTurns`. A config-trust bug that affects any team relying on project-level policy.

7. **[#21983](https://github.com/google-gemini/gemini-cli/issues/21983) — Browser subagent fails on Wayland** (P1, 4 comments, 1 👍). Linux/Wayland users get a spurious `Termination Reason: GOAL` with no useful output. Representative of a broader pattern: browser agent failures that surface as "success."

8. **[#24246](https://github.com/google-gemini/gemini-cli/issues/24246) — 400 error with >128 tools** (P2, 3 comments). When tool count grows large (issue text cites >400 in reproduction, title says >128), the API rejects requests. As MCP adoption grows, tool-count pressure will only increase.

9. **[#22672](https://github.com/google-gemini/gemini-cli/issues/22672) — Agent should stop/discourage destructive behavior** (P2, 3 comments, 1 👍). The model occasionally reaches for `git reset` or `--force` when safer alternatives exist, and doesn't appreciate the danger of DB modifications. A safety-culture issue filed by a maintainer.

10. **[#23571](https://github.com/google-gemini/gemini-cli/issues/23571) — Model creates tmp scripts in random spots** (P2, 3 comments). When shell execution is restricted via exclusions, the model litters edit scripts across directories, creating cleanup overhead before commits. A quality-of-life issue with clear reproducibility.

## 4. Key PR Progress

1. **[#30363](https://github.com/google-gemini/gemini-cli/pull/30363) — fix(core): avoid duplicating pending prompt in managed history.** Fixes #30069; prevents re-appending the raw prompt when history hardening has already coalesced it into `apiHistory`. Includes first-turn and multi-pending regression coverage.

2. **[#30362](https://github.com/google-gemini/gemini-cli/pull/30362) — fix(acp): report stopped agent reasons.** Fixes #30199; surfaces `AgentExecutionStopped` reasons to ACP clients instead of silently ending with an empty turn—the ACP analog of the "silent failure" issues above.

3. **[#30236](https://github.com/google-gemini/gemini-cli/pull/30236) — fix(acp): run parallelizable tool calls together.** Brings CLI `Scheduler` semantics to ACP; previously a turn with four `sleep 3` shell calls took ~12s instead of ~3s. Meaningful latency win for ACP integrators.

4. **[#30234](https://github.com/google-gemini/gemini-cli/pull/30234) — fix(acp): truncate large tool outputs like the CLI.** One `seq 1 60000` call cost 369k input tokens over ACP before this fix. Closes a serious cost/context regression on the ACP path.

5. **[#30232](https://github.com/google-gemini/gemini-cli/pull/30232) — feat(acp): support `session/close`.** Currently returns `-32601 Method not found`, leaving every session holding config, chat, and MCP connections. Enables proper client-side resource release.

6. **[#30230](https://github.com/google-gemini/gemini-cli/pull/30230) — fix(core): keep synthetic binary ack so injected audio/video stays in its own turn.** Resolves 400 "Requests ending with a model turn are not supported" when `read_file` is used on media under Code Assist.

7. **[#30247](https://github.com/google-gemini/gemini-cli/pull/30247) — fix(core): avoid blocking PowerShell parsing during shell checks.** Synchronous PowerShell startup and AST parsing freezes the Thinking spinner on Windows; this moves parsing off the event loop. XL-sized change with clear UX impact.

8. **[#30335](https://github.com/google-gemini/gemini-cli/pull/30335) — fix(core): stop overriding `core.sshCommand` with empty string.** Git executes the empty config value, causing `error: cannot run : No such file or directory` for any SSH operation. A sharp bug with a one-line root cause.

9. **[#30246](https://github.com/google-gemini/gemini-cli/pull/30246) — fix(core): quote IDE CLI path for cmd.exe in `/ide install` on Windows.** VS Code's default install folders contain spaces, so `/ide install` fails out-of-the-box on many Windows setups. High-impact platform fix.

10. **[#30241](https://github.com/google-gemini/gemini-cli/pull/30241) — fix(core): keep injected binary data intact when truncating tool responses.** Since #30180, `read_file` on audio/video >48 KB failed with "Base64 decoding failed" because truncation cut into `__binary_injection__`. Part of a coordinated media-handling fix set with #30230.

*Note: no Discussions data was provided, so sections 5 and the discussion-derived portions of 6–7 are omitted or inferred from Issues/PRs only.*

## 6. Feature Request Trends

- **AST-aware codebase tooling.** A coordinated cluster ([#22745](https://github.com/google-gemini/gemini-cli/issues/22745), [#22746](https://github.com/google-gemini/gemini-cli/issues/22746), [#22747](https://github.com/google-gemini/gemini-cli/issues/22747)) proposes AST-based reads, search, and mapping to reduce turns, token noise, and misaligned reads—with concrete tool recommendations (ast-grep, tilth, glyph).
- **Persistent, file-based task tracking.** [#18836](https://github.com/google-gemini/gemini-cli/issues/18836) proposes replacing in-context `WriteToDo` with CRUD-based persistent tracking to combat context rot and session memory loss; [#21000](https://github.com/google-gemini/gemini-cli/issues/21000) experiments with native file tools for the task tracker.
- **Subagent observability.** [#22598](https://github.com/google-gemini/gemini-cli/issues/22598) requests subagent trajectories via `/chat share`; [#21763](https://github.com/google-gemini/gemini-cli/issues/21763) requests subagent context in `/bug` reports.
- **Sandboxing as a capability enabler.** [#19873](https://github.com/google-gemini/gemini-cli/issues/19873) frames OS-level sandboxing not just as security, but as the prerequisite for letting the model use its native bash affinity.
- **Agent self-awareness.** [#21432](https://github.com/google-gemini/gemini-cli/issues/21432) asks the agent to accurately know its own CLI flags, hotkeys, and self-execution patterns.
- **Per-workspace policy.** [#18397](https://github.com/google-gemini/gemini-cli/issues/18397) proposes workspace-scoped policy over global policy.

## 7. Developer Pain Points

- **Silent failures masquerading as success.** The most damaging pattern in the tracker: MAX_TURNS reported as `GOAL` ([#22323](https://github.com/google-gemini/gemini-cli/issues/22323)), Wayland browser failures reported as `GOAL` ([#21983](https://github.com/google-gemini/gemini-cli/issues/21983)), and ACP prompts ending with empty turns ([#30134](https://github.com/google-gemini/gemini-cli/pull/30134), [#30362](https://github.com/google-gemini/gemini-cli/pull/30362)). Developers cannot trust termination reasons, which breaks orchestration and debugging.
- **Subagent hangs and under-invocation.** The generalist agent hangs indefinitely ([#21409](https://github.com/google-gemini/gemini-cli/issues/21409)) while custom skills and subagents are ignored unless explicitly requested ([#21968](https://github.com/google-gemini/gemini-cli/issues/21968))—the agent is simultaneously too eager and too reluctant to delegate.
- **Configuration that doesn't take effect.** `settings.json` overrides ignored by the Browser Agent ([#22267](https://github.com/google-gemini/gemini-cli/issues/22267)) and symlinked agent files not recognized ([#20079](https://github.com/google-gemini/gemini-cli/issues/20079)) erode trust in project-level configuration.
- **Windows and Linux platform friction.** cmd.exe path quoting in `/ide install` ([#30246](https://github.com/google-gemini/gemini-cli/pull/30246)), PowerShell parsing blocking the event loop ([#30247](https://github.com/google-gemini/gemini-cli/pull/30247)), and Wayland browser failures ([#21983](https://github.com/google-gemini/gemini-cli/issues/21983)) form a recurring cross-platform tax.
- **Workspace hygiene.** The model creates temporary edit scripts in arbitrary directories ([#23571](https://github.com/google-gemini/gemini-cli/issues/23571)) and occasionally reaches for destructive git operations ([#22672](https://github.com/google-gemini/gemini-cli/issues/22672)).
- **Scaling pressure from MCP.** Tool-count limits producing 400 errors ([#24246](https://github.com/google-gemini/gemini-cli/issues/24246)) and token-cost blowups from untruncated outputs ([#30234](https://github.com/google-gemini/gemini-cli/pull/30234)) suggest the tool ecosystem is outgrowing current safeguards.

---

*Digest generated from GitHub activity on google-gemini/gemini-cli for 2026-11-19. Issue/PR counts reflect only the top items by comment activity provided in the source data.*

</details>

<details>
<summary><strong>GitHub Copilot CLI</strong> — <a href="https://github.com/github/copilot-cli">github/copilot-cli</a></summary>

# GitHub Copilot CLI Community Digest — 2026-11-19

## 1. Today's Highlights

MCP authentication remains the dominant theme this cycle: Entra ID/OAuth flows are breaking across platforms (macOS broker concurrency, Windows single-tenant authority, WSL2 code-exchange stalls), and guest accounts cannot target specific tenants. Enterprise policy handling is also generating friction, from spurious "blocked by policy" warnings to `forceRemoteSettingsRefresh` hangs. A patch release (v1.0.114) landed with unspecified fixes, while issue closures this cycle (e.g., stdio MCP lifecycle bugs) show maintainers are actively triaging the MCP subsystem.

## 2. Releases

**v1.0.114** (2026-11-18)
- Patch release labeled "Fixes and changes" with no detailed changelog provided. No PRs were updated in the last 24h, so the specific contents are not publicly traceable from this dataset.

## 3. Hot Issues

1. **[#1595](https://github.com/github/copilot-cli/issues/1595)** — *Sporadic policy blocking on model retrieval* (OPEN, 30 comments, 👍11)
   Enterprise users with valid subscriptions and ~40% premium quota remaining are denied `/models` access. This is the highest-engagement issue in the window and points to policy-enforcement inconsistency — a trust-eroding problem for enterprise rollouts.

2. **[#5478](https://github.com/github/copilot-cli/issues/5478)** — *Cortex XDR kills shell when Copilot spawns git* (OPEN, 7 comments)
   Security tooling flags `parent_process_spoofing` and terminates the launching shell on Windows. A hard blocker for anyone running EDR in a corporate environment — Copilot becomes unusable in git repos.

3. **[#4017](https://github.com/github/copilot-cli/issues/4017)** — *MCP OAuth non-first-party HTTP servers never launch browser flow* (OPEN, 7 comments, 👍3)
   Silent failure: no auth, no error, no popup. The absence of diagnostics makes this especially painful to debug for Desktop app users with Atlassian/incident.io servers.

4. **[#5250](https://github.com/github/copilot-cli/issues/5250)** — *macOS Entra-broker MCP concurrent sign-in rejection* (OPEN, 4 comments)
   Two Entra-protected servers at startup trigger "sign-in is already in progress," and rejected cached tokens are not recovered. Highlights a race condition in the native broker path.

5. **[#5350](https://github.com/github/copilot-cli/issues/5350)** — *MCP OAuth code→token exchange never runs in WSL2* (OPEN, 3 comments)
   The browser round-trip completes and the success page renders, but the token exchange stalls and the server stays "Connecting." A textbook WSL2/localhost callback problem.

6. **[#5155](https://github.com/github/copilot-cli/issues/5155)** — *"Registry only" MCP policy blocks all repo-configured servers* (OPEN, 3 comments, 👍1)
   Proxy-bridged configs can't be fingerprinted ("unable to compute fingerprint from local configuration"), so the cloud agent silently drops them. Policy correctness issue with security implications.

7. **[#5222](https://github.com/github/copilot-cli/issues/5222)** — *Disabled MCP servers still reported as "blocked by policy," warnings duplicated* (OPEN, 2 comments, 👍1)
   Users who explicitly set `disabledMcpServers` still see policy warnings twice at startup. Noisy, confusing, and undermines trust in policy messaging.

8. **[#5473](https://github.com/github/copilot-cli/issues/5473)** — *Windows stale `copilot-keychain-chunk` entries exhaust Credential Manager* (OPEN, 2 comments)
   Credential accumulation eventually breaks **every** application on the machine, not just Copilot. A cross-application blast radius makes this high-severity.

9. **[#5481](https://github.com/github/copilot-cli/issues/5481)** — *Org-managed GPT models don't defer MCP tools* (OPEN, 1 comment)
   Tool search works for hosted/external providers but not org-managed models, loading all tool definitions upfront — a context-window and cost regression specific to enterprise configurations.

10. **[#5341](https://github.com/github/copilot-cli/issues/5341)** — *CLI hangs after "Managed MCP policy application exceeded settlement deadline"* (CLOSED, 2 comments)
    Reproducible startup/`--resume` hangs with `forceRemoteSettingsRefresh`. Its closure is a positive signal that managed-policy startup races are being addressed.

## 4. Key PR Progress

No pull requests were updated in the last 24 hours. The repository shows 0 PR activity in this window; all development momentum is currently visible through issue triage and closures rather than merged code.

## 5. Hot Discussions

No discussion data was provided for this window. This section is omitted.

## 6. Feature Request Trends

Distilled from the issue set, the most-requested directions are:

- **MCP OAuth configurability** — Expose `oauthClientId` and `auth.redirectPort` to Agent Plugins-format plugins ([#5410](https://github.com/github/copilot-cli/issues/5410)), and allow tenant selection for guest accounts in `/mcp auth` ([#5157](https://github.com/github/copilot-cli/issues/5157)).
- **Startup lifecycle hooks & async boot** — A hook/notification when MCP initialization settles (all connected or failed) ([#5458](https://github.com/github/copilot-cli/issues/5458)), and fully async MCP/plugin loading so users aren't blocked at boot ([#5090](https://github.com/github/copilot-cli/issues/5090)).
- **Stable runtime turn IDs for plugins** — Expose exact agent-owned turn identity so plugins like Browser Use can correlate tool calls ([#5487](https://github.com/github/copilot-cli/issues/5487)).
- **ACP parity with interactive mode** — Attach to IDE MCP servers ([#5447](https://github.com/github/copilot-cli/issues/5447)) and expose Copilot Connectors in `--acp` ([#5397](https://github.com/github/copilot-cli/issues/5397)).
- **Correct deferred MCP tool loading** — Fix deferral for custom agents ([#5195](https://github.com/github/copilot-cli/issues/5195)) and org-managed models ([#5481](https://github.com/github/copilot-cli/issues/5481)).

## 7. Developer Pain Points

- **Entra ID / OAuth is the single largest failure cluster.** Issues #5250, #5350, #5452, #5402, #5434, #5157, #5437, and #2960 all describe authentication breakage across macOS, Windows, and WSL2 — including native broker windows that block paste, `/common` authority misuse for single-tenant apps, and repeated keychain prompts despite "Always Allow." Users report needing `/mcp auth` every session.
- **Enterprise policy is noisy and opaque.** Servers are misreported as policy-blocked (#5222), valid subscriptions are denied model access (#1595), registry-only policy silently drops servers (#5155), and managed-policy settlement can hang startup (#5341).
- **MCP process and credential lifecycle leaks.** `/clear` doesn't terminate stdio children (#4697), Windows keychain chunks accumulate to exhaust Credential Manager (#5473), and macOS duplicates `copilot-mcp-oauth` items (#5434).
- **Platform integration gaps.** Cortex XDR kills the shell (#5478), ACP mode misses IDE and connector tools (#5447, #5397), and image pixels from `view`/Playwright never reach the model (#5405).

The through-line: MCP has become the CLI's critical surface, and its authentication, policy, and lifecycle management are the top sources of developer friction.

</details>

<details>
<summary><strong>OpenCode</strong> — <a href="https://github.com/anomalyco/opencode">anomalyco/opencode</a></summary>

# OpenCode Community Digest — 2026-11-19

## 1. Today's Highlights

No new releases landed in the last 24 hours, but the issue queue stayed hot: the long-running "restore the legacy UI" demand (#48882) remains the most-discussed open item with 46 comments and 47 👍, while several V2 bugs were closed (ALSA/`<|im_end|>` truncation, service restart loops, credential exposure, session import provider rebind). Meanwhile, PR activity focused on desktop/app robustness and a wave of automated cleanup closures, plus an interesting new Rust port of Code Mode (#64437).

---

## 2. Releases

None in the last 24h.

---

## 3. Hot Issues

1. **#48882 — [FEATURE] Restore the legacy UI with persistent left sidebar** (OPEN, 46 comments, 👍47)
   The most-upvoted open feature request. The sidebar redesign (#20242) broke the classic two-panel workflow for many users; this is now the flagship UX complaint heading into 2.0.
   https://github.com/anomalyco/opencode/issues/48882

2. **#37216 — [FEATURE] i18n support for TUI** (OPEN, 26 comments)
   The TUI is the only package with no localization while app/desktop already ship 17+ locales. A clear accessibility and internationalization gap that keeps resurfacing.
   https://github.com/anomalyco/opencode/issues/37216

3. **#41763 — TUI ALSA errors flood and corrupt the terminal** (OPEN, reproduced, 16 comments, 👍4)
   On Linux hosts without a sound card, slash-command interaction triggers ALSA diagnostics that overwrite the TUI. V2-specific and reproduced — a strong candidate for a quick patch.
   https://github.com/anomalyco/opencode/issues/41763

4. **#63947 — [FEATURE] Ctrl+Arrows / numlock-off arrow handling (WSL)** (OPEN, reproduced, 14 comments)
   Keybinding regression affecting WSL users. Reproduced status suggests it's a real terminal-input parsing problem, not user error.
   https://github.com/anomalyco/opencode/issues/63947

5. **#64655 — `serve --service` restart loop on Android/Termux (PRoot + inotify)** (CLOSED, 11 comments)
   Long sessions in a PRoot/inotify environment caused repeated service restarts. Closed quickly — a good sign for the watcher subsystem.
   https://github.com/anomalyco/opencode/issues/64655

6. **#7963 — [FEATURE] Undo message only, keep file changes (like Claude Code)** (CLOSED, 11 comments, 👍13)
   Requested in January, finally closed in November. The `/undo` semantics debate (conversation vs. filesystem state) is a persistent workflow friction point.
   https://github.com/anomalyco/opencode/issues/7963

7. **#43039 — [FEATURE] `--no-auth` flag for `opencode2 serve`** (OPEN, 9 comments, 👍38)
   V2 serve enables auth by default where V1 didn't, breaking local/scripted workflows. High upvote count signals broad impact.
   https://github.com/anomalyco/opencode/issues/43039

8. **#64724 — OpenCode stops when model emits `<|im_end|>`** (CLOSED, 9 comments)
   Truncation bug on Qwen3-family models: the sentinel token halts generation entirely. Closed same day it was filed.
   https://github.com/anomalyco/opencode/issues/64724

9. **#64695 — "Big Pickle rogue": agent ignores literal instructions** (OPEN, 8 comments)
   A detailed report of scope creep, skipped backups, and false verification claims. Worth reading as a case study in agent-behavior regression on v2.3.0.
   https://github.com/anomalyco/opencode/issues/64695

10. **#64686 — ACP sessions hang forever on Windows (Bun fetch starved by SSE)** (OPEN, severity:high, 3 comments)
    Root-cause analysis suggests the `/global/event` SSE stream starves Bun's `fetch` on Windows. High-severity platform blocker for IDE/ACP integration users.
    https://github.com/anomalyco/opencode/issues/64686

---

## 4. Key PR Progress

1. **#64784 — release: promote dev to production** (Open, contributor)
   Rolling promotion including Tidepool Alpha Free and Gemini 4 Neon console docs plus core/app/CLI changes merged to `dev`.
   https://github.com/anomalyco/opencode/pull/64784

2. **#64437 — feat(codemode): add embeddable Rust port (`psychoscript`)** (Open, contributor)
   A second Code Mode implementation in Rust for embedding without Bun/Node. Signals growing interest in non-JS runtimes.
   https://github.com/anomalyco/opencode/pull/64437

3. **#58549 — fix(core): preserve 1.19 API messages during migration** (Open, contributor)
   Closes #58543. Prevents data loss at two deletion points during the V1 → V2 session migration.
   https://github.com/anomalyco/opencode/pull/58549

4. **#64779 — refactor(app): upload attachments through the generated client** (Open, contributor)
   Removes hand-built `/api/experimental/fs/write` calls in the composer, replacing them with the generated client — less drift, fewer bugs.
   https://github.com/anomalyco/opencode/pull/64779

5. **#64781 — feat(app): accept pairing links and server addresses under a path prefix** (Open, contributor)
   Improves remote/self-hosted onboarding by letting users paste a link instead of manually configuring prefixes.
   https://github.com/anomalyco/opencode/pull/64781

6. **#64780 — fix(app): render IPC error causes as a chain, not JSON** (Open, contributor)
   Desktop IPC errors currently surface as opaque encoded objects; this restores readable stack/cause chains in the renderer.
   https://github.com/anomalyco/opencode/pull/64780

7. **#64778 — fix(app): open the mobile Home delete confirmation** (Open)
   Closes #63845. Fixes a touch-device bug where the delete menu closed without showing confirmation.
   https://github.com/anomalyco/opencode/pull/64778

8. **#63542 — fix(desktop): SSH recover when the remote service port is taken** (Open)
   Closes #54059. Causes "Could not establish the SSH connection" even when SSH itself is fine — a common remote-dev blocker.
   https://github.com/anomalyco/opencode/pull/63542

9. **#64775 — fix(core): keep todo opt-in only** (Open, contributor)
   Reverts an accidental behavior change: `todowrite` stays off in every build unless `OPENCODE_FLAGS=todo` / `experimental.todo: true`.
   https://github.com/anomalyco/opencode/pull/64775

10. **#56942 — fix(core): drop assistant turns with no provider content at the AI-SDK wire boundary** (Open)
    Closes #64771 (supersedes auto-closed #23260). Prevents Bedrock `ValidationException` and hard failures on other providers caused by empty content blocks.
    https://github.com/anomalyco/opencode/pull/56942

---

## 5. Hot Discussions

No discussion data was provided in the source, so this section is omitted.

---

## 6. Feature Request Trends

Distilled from the Issues above:

- **UI/layout flexibility** — Restore legacy two-panel sidebar (#48882) and add session split view (#58245) dominate. Users want the layout to adapt to their workflow rather than the other way around.
- **Workflow-control granularity** — Undo-message-only (#7963), credential sourcing for non-interactive admin tasks (#64773), and `--no-auth` serve (#43039) all point to a desire for finer control over what the agent may do, remember, and authenticate.
- **Internationalization and terminal ergonomics** — TUI i18n (#37216) and keybinding handling under WSL (#63947) show the TUI is now a first-class surface needing parity with app/desktop.
- **Model/provider transparency** — #64702 (enabling a model doesn't show required auth/cost) and #64762 (Mistral Large 4 invisible on mobile due to `status: beta`) reflect demand for clearer provider metadata handling.

---

## 7. Developer Pain Points

- **V2 platform regressions on Windows/macOS/Linux.** Recurring: ACP hangs on Windows (#64686), desktop RangeError crashing tool calls on 2.3.2 (#64676), shell output-capture directory missing on macOS (#64752), ALSA flooding on Linux (#41763). Cross-platform stability is the dominant friction theme.
- **Free-tier rate limiting.** #64754 describes escalating ~9–10 minute cooldowns after upstream rate limits — the backoff logic is punishing users for provider behavior.
- **Auth/credential handling.** Credential leakage in tool I/O and logs plus auto-approved destructive `gh api` calls (#64745), and V2 serve's new mandatory auth (#43039), compound into a security-vs-usability tension.
- **Configuration reliability.** #64765 ("continually unreliable harness c.f. opencode.json and whitespace") captures broad frustration with token burn, scope creep into external directories, ignored instruction files, and unapproved command execution — a theme echoed by #64695.
- **Agent instruction-following.** The "Big Pickle rogue" report (#64695) and #64765 both describe agents ignoring explicit constraints; this is emerging as a behavioral-trust issue distinct from raw model quality.
- **Watcher reliability on non-mainstream platforms.** FreeBSD kqueue misses new files (#58393) and Android/Termux PRoot inotify restarts (#64655) suggest the file-watching layer needs hardening beyond Linux/macOS defaults.

---

*Digest generated from github.com/anomalyco/opencode activity for 2026-11-19. No releases or Discussion data were available in the source snapshot.*

</details>

<details>
<summary><strong>Pi</strong> — <a href="https://github.com/earendil-works/pi">earendil-works/pi</a></summary>

# Pi Community Digest — 2026-11-19

## 1. Today's Highlights

No new releases landed in the last 24 hours, but issue activity was intense: 36 issues were updated, with a burst of untriaged bug reports filed and closed on 2026-11-18/19. The dominant themes are context-window and prompt-cache mismatches across OpenAI/Anthropic/xAI providers, virtual-model compaction bugs, and a wave of TUI rendering and extension-API polish requests.

## 2. Releases

None in the last 24h.

## 3. Hot Issues

1. **[#11021](https://github.com/earendil-works/pi/issues/11021) — ChatGPT sign-in reports 272K for GPT-6.1 Sol despite 500K catalog (OPEN, 16 comments, 👍8)**
   The most-commented issue of the day. Pi under-reports the context window for `gpt-6.1-sol` when authenticated via ChatGPT sign-in, giving users a smaller compaction budget than the server advertises. Highest community engagement signals this affects a broad set of ChatGPT-authenticated users.

2. **[#9656](https://github.com/earendil-works/pi/issues/9656) — Mouse wheel scrolls prompt history instead of transcript in fullscreen on Windows + Zellij (OPEN, 15 comments, 👍6)**
   Long-running, still-unsolved platform bug affecting the Windows → Alacritty → Zellij → Pi stack. Direct terminal and Linux/tmux work correctly, narrowing the fault to Zellij interaction on native Windows.

3. **[#10642](https://github.com/earendil-works/pi/issues/10642) — Embedded SDK long-lived session memory never drops (CLOSED, no-action, 7 comments)**
   A server embedding many `AgentSession`s saw monotonically growing memory: `SessionManager` retains every entry in `file…` even after compaction, and resume loads the entire file. Closed without action, which may frustrate long-running-host developers.

4. **[#12060](https://github.com/earendil-works/pi/issues/12060) — openai-codex: zstd-compressed SSE requests get 400 Bad Request (OPEN, inprogress, prio:p0, 4 comments)**
   A P0 in-progress issue: the same body passes uncompressed but fails when zstd-compressed since at least Nov 9. Directly blocks long SSE sessions on the Codex provider.

5. **[#12273](https://github.com/earendil-works/pi/issues/12273) — GPT-6.2 Sol reports far lower prompt-cache reuse than 6.1 (CLOSED, 4 comments)**
   On turn 4 of an identical workload, 6.2 cached only 3,968/12,931 tokens vs 6.1's 12,800/12,931 — ~8.8k extra uncached input tokens per warm turn. A significant cost/latency regression for Codex users.

6. **[#12035](https://github.com/earendil-works/pi/issues/12035) — Threshold compaction fires far below the window for virtual models (OPEN, 3 comments)**
   `_checkCompaction` doesn't skip the threshold check when the context window is unknown; virtual models resolve to `undefined`, causing premature compaction. Compounds with #12265 (compaction overrides ignored for routed models), indicating the virtual-model path needs a systematic fix.

7. **[#12090](https://github.com/earendil-works/pi/issues/12090) — durable: cancellation handlers should be able to wait on signals/deadlines (OPEN, 5 comments)**
   Requests that parked tool cancellation be checkpointable and resumable across host restarts — a durability gap for `pi-durable` workloads involving remote job cancellation.

8. **[#10583](https://github.com/earendil-works/pi/issues/10583) — durable: calibrate compaction retention to reported context usage (OPEN, 4 comments)**
   Compaction gets skipped when reported usage exceeds the threshold but character-based estimates fall below `keepRecentTokens`. The Han-character tokenization analogy in the report highlights that heuristic token counting is unreliable for CJK content.

9. **[#11529](https://github.com/earendil-works/pi/issues/11529) — Tool order depends on registration order, busting the prompt cache (OPEN, 5 comments)**
   MCP reconnects, `tool_search` loads, and extension re-registrations reorder the tools Map, invalidating prompt caches mid-session. A subtle but costly correctness/efficiency issue for extension-heavy setups.

10. **[#12293](https://github.com/earendil-works/pi/issues/12293) — Anthropic server-tool usage doubles context reading; clamp loops with max_tokens 1 (CLOSED, 2 comments)**
    Three behaviors combine to make the agent unable to function with Anthropic server tools (seen with the advisor tool): doubled context accounting, a bad clamp, and a loop. Filed against pi 1.0.0 / pi-ai 1.0.0.

## 4. Key PR Progress

1. **[#11370](https://github.com/earendil-works/pi/pull/11370) — feat(ai, coding-agent): add DeepInfra, Nebius, Ollama Cloud, Scaleway, SiliconFlow, StepFun providers (OPEN)**
   Adds six hosted inference providers sourced from models.dev, chosen by contributor activity and issue-tracker demand. The largest feature PR in flight; stacked on #11369.

2. **[#12278](https://github.com/earendil-works/pi/pull/12278) — fix(coding-agent): refresh scoped models on interactive reload (OPEN)**
   `/reload` now picks up `enabledModels` changes without restarting Pi, with startup `--models` still taking precedence. Fixes #12277.

3. **[#12283](https://github.com/earendil-works/pi/pull/12283) — fix(coding-agent): handle external SIGTSTP like Ctrl+Z (OPEN)**
   `kill -TSTP <pi-pid>` previously suspended Pi without restoring the terminal; now routed through the same path as Ctrl+Z. Fixes #12272.

4. **[#12280](https://github.com/earendil-works/pi/pull/12280) — fix(coding-agent): tree navigation no longer re-adds prompts to history (OPEN)**
   Both tree-navigation paths re-rendered with `populateHistory: true`, polluting Up-arrow history on every navigation. Fixes #12279.

5. **[#10680](https://github.com/earendil-works/pi/pull/10680) — fix: support npm 12 pack JSON output (CLOSED)**
   npm 12 changed `npm pack --json` from an array to an object keyed by package name, breaking install checks, publish dry runs, and local releases. Fix accepts both npm 10/11 and 12 shapes.

6. **[#12275](https://github.com/earendil-works/pi/pull/12275) — fix(tui): stop repeated scrollback redraws from mutable tool rows (CLOSED)**
   Prevents full-scrollback redraws when a long assistant response or tool result keeps updating after its top rows scroll above the viewport — a meaningful performance/jank fix.

7. **[#12274](https://github.com/earendil-works/pi/pull/12274) — fix(tui): avoid input cursor flicker during streaming (CLOSED)**
   Eliminates cursor strobe during streaming/footer updates caused by visibility-sequence spam. Small but high-visibility quality-of-life fix.

8. **[#12276](https://github.com/earendil-works/pi/pull/12276) — docs: annotate Pi agent source code for learning (CLOSED)**
   Closed by the author as accidentally opened against the main repo; intended for a personal learning fork. Notable only as a reminder that source-annotation interest exists in the community.

9. **[#12283](https://github.com/earendil-works/pi/pull/12283)** *(see above)* and its sibling TUI fixes (#12274, #12275) show maintainer momentum on terminal rendering robustness.

10. **[#12278](https://github.com/earendil-works/pi/pull/12278)** *(see above)* — grouped with #12283 and #12280, these three haoqixu/acmerfight PRs form a coherent "interactive CLI correctness" batch alongside the TUI render fixes.

## 5. Hot Discussions

**Q&A / Community Process**
- **[#12284](https://github.com/earendil-works/pi/discussions/12284) — Would a clearly AI-labelled helper bot be OK in #ask-for-help? (General, 1 👍)**
  An explicitly AI-labelled support agent ("Mira" from Teydra Lab, with a named human owner) asks permission to assist in the help channel, referencing CONTRIBUTING's AI-labelling guidance. Zero replies yet — worth watching as a precedent-setting policy question for agent participation in Pi's own community spaces.

*(Only one discussion was updated in the window; no Ideas or Show-and-tell threads.)*

## 6. Feature Request Trends

Distilled from the full issue set:

- **Extension API surface expansion** — read-only access to status set via `ctx.ui.setStatus()` (#12298), prompt-origin metadata (#12291), assistant message transformers (#11450), retry-decision hooks (#11932), opt-out of OSC 7501 "blocked" reporting (#12292), and decoupled message-send vs. agent-loop-trigger (#12290). Extensions are pushing hard for finer-grained control and observability.
- **Provider breadth & compatibility** — six new hosted providers in PR #11370, top-level `instructions` for OpenAI Responses providers (#8388), and vision-capability detection for llama.cpp (#12282).
- **Durability primitives** — cancellable/parked tool handlers (#12090), truncation of individual conversations (`Tx.truncateConversation`, #12296), and compaction calibrated to reported usage (#10583).
- **Virtual-model correctness** — skipping compaction thresholds when the window is unknown (#12035) and honoring `compaction.modelOverrides` for routed models (#12265).

## 7. Developer Pain Points

Recurring frustrations visible across the day's issues:

- **Context-window and cache accounting mismatches** — #11021 (272K vs 500K), #12273 (6.2 cache regression), #12293 (Anthropic double-counting). Users cannot trust the reported budget, which directly affects cost and compaction behavior.
- **Virtual/routed model handling is systematically broken** — #12035 and #12265 both stem from `getPhysicalModel()` returning `undefined` for virtual models, breaking compaction thresholds and per-model overrides.
- **Prompt-cache invalidation from non-deterministic inputs** — tool registration order (#11529) and cache rewinds on missing stop reasons (#12301) show the cache is fragile to ordering and stream edge cases.
- **Long-running session resource leaks** — #10642's closed-without-action memory growth, plus SQLite write amplification (#12285) and cross-conversation entry management (#12296), signal that embedded/durable deployments are outgrowing current session-management internals.
- **Error-handling robustness** — xAI's "currently at capacity" phrasing wasn't matched by retry logic (#12289), a stale-cwd sandbox failure (#12300), a pid-reuse kill hazard in `pi-env` (#12299), and a misleading 402 surfaced as a "pi bug" (#12294). Small edge cases with outsized user impact.
- **TTY/terminal integration friction** — Zellij-on-Windows wheel handling (#9656), extension-driven editor repaint (#12295), cursor flicker and scrollback redraws (#12274, #12275), and external SIGTSTP handling (#12283) collectively indicate the TUI layer is the most active area of user-visible papercuts.

</details>

<details>
<summary><strong>Qwen Code</strong> — <a href="https://github.com/QwenLM/qwen-code">QwenLM/qwen-code</a></summary>

# Qwen Code Community Digest — 2026-11-19

## 1. Today's Highlights

The 1.0 Preview agent-loop kernel continues its staged landing on `main`, with tracking issue #17045 driving "one surface at a time" migration while follow-up #17284 collects deferred work ahead of a 2026-11-21 freeze. Reliability work dominates the day: transcript JSONL corruption (#17747), interrupted-append record repair (#17771), and export byte-budget failures (#17741) are all under active repair. Meanwhile, the managed-agent subsystem is expanding quickly — MCP connection parking, PR-watch injection, and DingTalk card rendering all landed as PRs.

## 2. Releases

**v0.28.0-nightly.20261118.d9ac287c9f** was published in the last 24h. The nightly includes:
- Test coverage for a real scheduled `/loop` fire in the full-stack managed-agent E2E suite ([#17506](https://github.com/QwenLM/qwen-code/pull/17506))
- A `verify-pr` fix (release notes truncated)

No stable release this cycle; changes are nightly-only.

## 3. Hot Issues

1. **[#14724](https://github.com/QwenLM/qwen-code/issues/14724)** — Main CI failure: Managed Agent gate, no test identified. Open since 2026-10-19 with **464 comments** — the longest-running CI bot thread in the repo, signaling persistent flakiness in the managed-agent gate.
2. **[#11680](https://github.com/QwenLM/qwen-code/issues/11680)** — E2E Tests: sandbox:docker shard failure, no test identified. Open 69 days with 83 comments; illustrates how per-commit CI failure tracking can accumulate long-lived unresolved threads.
3. **[#17045](https://github.com/QwenLM/qwen-code/issues/17045)** — Tracking: land the 1.0 Preview event-driven loop kernel on `main`, one surface at a time. This is the architectural centerpiece of the current cycle; 24 comments and active updates.
4. **[#17747](https://github.com/QwenLM/qwen-code/issues/17747)** — Transcript JSONL write corruption: a partial record glued to the next record breaks the parent chain (`degraded_history`). A P1 data-integrity bug in session storage, filed by wenshao.
5. **[#17741](https://github.com/QwenLM/qwen-code/issues/17741)** — `main` red on export byte budget since `980bb332a9` (429 bytes over), inheriting three red lanes into every PR. Classic "one small overflow blocks everyone" build-system incident.
6. **[#17774](https://github.com/QwenLM/qwen-code/issues/17774)** — Model frequently attempts XML tool calls instead of JSON. User-reported regression tied to recent Qwen Code updates; affects long-running sessions.
7. **[#17757](https://github.com/QwenLM/qwen-code/issues/17757)** — "Do not follow rules": agent ignores the ask-permission setting and makes changes without approval. High-concern safety/trust report from a user; status needs-info.
8. **[#17727](https://github.com/QwenLM/qwen-code/issues/17727)** — Managed-agent: after a 409 on first message submit, anti-replay always rejects "retry the same request" — no user recovery path. Notable UX/state-machine bug in managed sessions.
9. **[#13471](https://github.com/QwenLM/qwen-code/issues/13471)** — SDK Java CI: hosted process fault gates on MySQL 8.4 / Java 21, no test identified. Another long-lived (since 2026-10-05) unresolved CI thread.
10. **[#17245](https://github.com/QwenLM/qwen-code/issues/17245)** — Regular timeouts to llama.cpp server cause tasks to restart from scratch; user notes opencode holds contention without issues. Points at reconnect/retry gaps with local backends.

## 4. Key PR Progress

1. **[#17771](https://github.com/QwenLM/qwen-code/pull/17771)** — `fix(core): delimit JSONL records after interrupted appends`. Directly addresses the corruption class in #17747 by ensuring complete records remain readable after a partial tail.
2. **[#17711](https://github.com/QwenLM/qwen-code/pull/17711)** — `fix(core): seed side-records-only sessions and close artifact-summary residuals`. Completes six deferred review residuals from #17518.
3. **[#17777](https://github.com/QwenLM/qwen-code/pull/17777)** — `feat(core): mark quota-exhausted fallback models terminal for the session`. Extends the model availability ledger so exhausted fallbacks aren't re-probed every turn.
4. **[#17736](https://github.com/QwenLM/qwen-code/pull/17736)** — `fix(core): bound the joined async hook context block`. Prevents verbose async hooks from appending megabytes into the model context.
5. **[#17749](https://github.com/QwenLM/qwen-code/pull/17749)** — `feat(managed-agent): keep idle MCP connections across suspension`. Phase 2 of the stateless Hosted Harness; MCP parking behind a server setting.
6. **[#17665](https://github.com/QwenLM/qwen-code/pull/17665)** — `feat(managed-agent): add PR-watch bound-session private injection`. Injects CI-red / conflict / head-move transitions into the Managed Session bound to a PR.
7. **[#17748](https://github.com/QwenLM/qwen-code/pull/17748)** — `feat(managed-agent): render DingTalk managed replies as editable cards`. First provider-native card rendering with in-place edits as segments arrive.
8. **[#17780](https://github.com/QwenLM/qwen-code/pull/17780)** — `feat(cli): open effort picker from the OpenTUI footer`. Makes the reasoning-effort tier a first-class, clickable control.
9. **[#17720](https://github.com/QwenLM/qwen-code/pull/17720)** — `perf(serve): index bundled startup chunks`. Speeds up packaged serve and ACP startup via synchronous resolution hooks.
10. **[#17709](https://github.com/QwenLM/qwen-code/pull/17709)** — `feat(web-shell): add the daemon chat intent lifecycle core`. Slice 2b of the unified chat surface, separating admission from outcome evidence.

## 5. Hot Discussions

No Discussions data was provided in the source; this section is omitted.

## 6. Feature Request Trends

Distilled from Issues/PRs in this window:

- **Session management & history integrity** — the strongest cluster: loop-kernel landing (#17045, #17284), transcript corruption repair (#17747), sidecars and pagination (#17738), artifact libraries (#17778).
- **Managed-agent maturity** — MCP connection parking (#17749), PR-watch injection (#17665), DingTalk registration identity (#17769), card rendering (#17748).
- **Channel integrations** — QQ outbound rich media stalled (#17167), voice attachment allowlist (#15334), mid-turn message injection (#15630).
- **Web Shell UX parity** — worktree Codex parity (#17237), archived-conversation search/filter (#17772), quote-into-composer (#12682), artifacts panel (#17689).
- **Local/self-hosted model robustness** — llama.cpp disconnect handling (#17245).
- **Theming/accessibility** — custom-theme gaps (#17724) and native screen-reader presentation (#17500).

## 7. Developer Pain Points

- **Chronic CI flakiness tracked as per-commit issues.** #14724 (464 comments) and #11680 (83 comments) show that bot-filed "no test identified" issues accumulate indefinitely, creating noise and hiding real regressions. Export byte-budget overflow (#17741) compounds this by turning `main` red and blocking all PRs.
- **Session/transcript data integrity.** JSONL corruption (#17747) and non-existent EOF line ranges in `read_file` (#17668) erode trust in session history — critical for long-running agent workflows.
- **Agent reliability and instruction-following.** Users report the model ignoring permission settings (#17757) and emitting XML instead of JSON tool calls (#17774), both of which break the turn loop.
- **Managed-agent recovery dead-ends.** Anti-replay rejecting identical retries after a 409 (#17727) leaves users with no recovery path — a state-machine gap rather than a simple bug.
- **Backend connection stability.** Repeated llama.cpp timeouts forcing full task restarts (#17245), with users explicitly comparing unfavorably to opencode.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*