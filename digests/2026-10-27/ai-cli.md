# AI CLI Tools Community Digest 2026-10-27

> Generated: 2026-10-27 00:21 UTC | Tools covered: 7

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
**Date: 2026-10-27** | Sources: Claude Code, OpenAI Codex, Gemini CLI, GitHub Copilot CLI, OpenCode, Pi, Qwen Code

---

## 1. Ecosystem Overview

The AI CLI tooling landscape is now unmistakably in a **stabilization and architectural maturation phase** rather than a feature-land-grab. Across all seven trackers, the dominant signal is *reliability debt*: session lifecycle correctness, resource leaks, permission-mode semantics, and network/credential fragility now consume more community oxygen than net-new capabilities. Simultaneously, every major tool is converging on the same three architectural bets — **plugin/MCP extensibility with process isolation, multi-agent orchestration with subagent state persistence, and BYOK/multi-provider flexibility** — suggesting a shared mental model of where agentic coding is heading. Differentiation is increasingly found in *execution model* (sandboxing, AST-aware tooling, permission tiers) rather than in raw model access. Meanwhile, community trust is being stress-tested by billing anomalies, silent config corruption, and quantified model-quality regressions — issues that individual feature PRs cannot paper over.

---

## 2. Activity Comparison

> Note: Several repositories in this dataset did not surface Discussions data (not provided in source) or had zero PR activity in the 24h window. Those are marked accordingly rather than as "inactive."

| Tool | Issues (active/updated 24h) | PRs (updated 24h) | Discussions | Release Status (24h) |
|---|---|---|---|---|
| **Claude Code** | ~10 hot issues surfaced (tracker highly active) | 10 PRs reported (mixed open/closed) | N/A (not provided in source) | **Yes** — v2.1.311 (self-hosted runner idle controls, startup freeze fix) |
| **OpenAI Codex** | 10 hot issues + incident logs (#57084 at 65 comments) | 10 PRs reported | **Yes** — 6 Show & Tell + 2 Q&A threads | **Yes** — rust-v0.165.0-alpha.3 (version bump only) |
| **Gemini CLI** | 50 issues touched | 37 PRs touched | N/A (not provided in source) | **No** releases in 24h |
| **GitHub Copilot CLI** | 50 issues updated | **0 PRs updated** | N/A (not provided in source) | **Yes** — v1.0.104-4 (generic patch) |
| **OpenCode** | 10 hot issues + several closed | 10 PRs reported | N/A (not provided in source) | **No** releases in 24h |
| **Pi** | 10 hot issues + honorable mentions | 10 PRs reported (many bot-authored) | **Yes** — 1 discussion (thank-you offer) | **No** releases in 24h |
| **Qwen Code** | 10 hot issues (CI tracker #14724 at 64 comments) | 10 PRs reported | N/A (not provided in source) | **Yes** — 3 releases (v0.26.2-preview.0, nightly, sdk-typescript-v0.1.23) |

**Reading the table:**
- **Gemini CLI** shows the highest raw issue+PR churn (50/37), consistent with an active `area/agent` stabilization push.
- **Copilot CLI** has the starkest asymmetry: 50 issues updated, **zero PR activity** — a red flag for maintainer throughput relative to community demand.
- **Codex and Pi** are the only tools with meaningful Discussion activity, both used for Show & Tell / Q&A rather than issue triage.
- **Qwen Code** shipped the most releases (3), but two are preview/nightly variants of the same managed-permissions feature.

---

## 3. Shared Feature Directions

Requirements appearing across **multiple** communities, ranked by breadth:

| Direction | Tools Requesting | Specific Needs |
|---|---|---|
| **Plugin/MCP extensibility + process isolation** | Claude Code (#91870 Mods), Codex (#57290 plugin host w/ bounded IPC), OpenCode (#55246 Desktop GUI plugins), Pi (#10259 tool-presentation API) | Deeper hook systems, sandboxed plugin execution, public APIs for tool presentation, plugin resource bounding |
| **Multi-agent / multi-engine orchestration** | Codex (#57022 two-engines-gate, multi-agent workflows), Qwen Code (#15682 global agents/squads), Gemini CLI (subagent backgrounding #22741, shared memory #18287), OpenCode (#58782 Claude Agent provider) | Cross-engine review gates, per-thread tool policies, shared memory between agents, subagent lifecycle rigor |
| **BYOK / multi-provider flexibility** | Copilot CLI (#3709 mid-session model switch, #4703 per-agent provider), OpenCode (#58782 Claude login reuse), Pi (#5262 Anthropic Vertex, #11132 OpenCode endpoints) | Provider-agnostic sessions, documented per-provider paths, existing-login reuse instead of separate credentials |
| **Session lifecycle correctness** | Claude Code (#69364 `--resume` registry), Copilot CLI (#5253 lock timeouts, #4251 OOM on resume), Pi (#10470 duplicate `session_start`, #11451 stale thinking level), OpenCode (#54181 service session loss), Qwen Code (#15686 Active Goal holding input) | Multi-process safety, idempotent lifecycle events, state that matches live session |
| **Subagent correctness & context hygiene** | Gemini CLI (#22323 false GOAL, #21409 hangs), Qwen Code (#15660 105k subagent context), Claude Code (#104791 subagent MCP inheritance) | Honest termination reporting, bounded subagent context, no silent failure |
| **Permission-mode / config-that-takes-effect** | Gemini CLI (#22267 ignored `settings.json`), Qwen Code (#15597, #15600 headless denies), Copilot CLI (#4537 ACP auto-approve), Pi (#11417 world-readable sessions) | Overrides honored end-to-end, safe defaults, no silent denials |
| **AST-aware / token-frugal codebase tooling** | Gemini CLI (#22745 EPIC), Claude Code (WebFetch token exhaustion #73514) | Syntax-aware reads/search/mapping to cut token noise and misaligned reads |
| **Observability & telemetry trust** | Gemini CLI (#29960 telemetry version), OpenCode (#59448 retry budget), Claude Code (usage-meter anomaly #105015) | Correct version attribution, tunable retry budgets, transparent cost/usage |

**Notable convergence:** *Process isolation for plugins* and *subagent state persistence* appear in four of seven communities each — these are becoming table-stakes architecture, not differentiators.

---

## 4. Differentiation Analysis

| Dimension | Claude Code | OpenAI Codex | Gemini CLI | Copilot CLI | OpenCode | Pi | Qwen Code |
|---|---|---|---|---|---|---|---|
| **Primary focus** | Extensibility layer (Mods/plugins) | Desktop + Computer Use stability | Agent architecture & autonomy | Enterprise session/MCP plumbing | V2 migration & free-tier | Provider parity & TUI polish | Managed agent & CI robustness |
| **Target user** | Power users extending the tool | Desktop app / cross-surface | Agent-heavy autonomous workflows | Enterprise/GitHub-integrated teams | OSS/self-hosted developers | Multi-provider CLI tinkerers | Teams + channel integrations |
| **Technical approach** | Hook precedence, marketplace install | Computer Use service, plugin host | AST-aware tooling, sandboxing proposal | ACP protocol, BYOK | Protocol contracts, SQLite storage | Extension APIs, iTerm2/Kitty TUI | Kubernetes runtime, channel adapters |
| **Signature strength** | Plugin ecosystem maturity | Multi-surface reach (desktop+CLI) | Agent self-awareness roadmap | GitHub-native enterprise path | Rapid `@opencode/ai` package iteration | Provider breadth (Vertex, OpenCode, Bedrock) | Release cadence + managed control plane |
| **Signature weakness** | Network instability (#103488 cluster) | macOS Computer Use crashes since Aug | Subagent false-success reports | Zero PR throughput vs. 50 issues | V1→V2 config/env breakage | Windows path handling, session drift | CI noise, headless permission bugs |
| **Community channel** | Issues + PRs | Issues + **Discussions** | Issues + PRs | Issues only (no PRs 24h) | Issues + PRs | Issues + **Discussions** | Issues + PRs |

**Key differentiators:**
- **Claude Code** is the only tool where the *top engagement thread* (#91870, 274 comments) is a **forward-looking extensibility initiative** rather than a bug — a sign of a mature community shaping roadmap.
- **Codex** is uniquely burdened by **native/desktop stability** (kernel panics, spawn storms) — its pain is OS-level, not protocol-level.
- **Gemini CLI** is betting on **agent autonomy and AST tooling** as a step-change, whereas peers are still patching subagent delegation.
- **Copilot CLI** is the most **enterprise-oriented** (credential registration, policy gating, ACP), but its issue-to-PR ratio suggests resource constraints.
- **Pi** differentiates on **provider namespace parity** — treating each provider's documented API path as a first-class citizen.
- **Qwen Code** is the only one shipping a **managed Kubernetes control plane** — a distinct enterprise-deployment posture.

---

## 5. Community Momentum & Maturity

**Highest raw activity:**
- **Gemini CLI** (50 issues / 37 PRs) and **Copilot CLI** (50 issues / 0 PRs) lead on issue churn.
- **Gemini CLI** leads on *balanced* churn — heavy PR throughput alongside issue volume signals active maintainer response.

**Rapidly iterating (shipping releases + merging architecture):**
- **Qwen Code** — 3 releases in 24h, plus Kubernetes and web-shell feature PRs. Fastest cadence in the set.
- **OpenCode** — heavy `@opencode/ai` package work (`LLM.loop` landing, async tools, provider additions), though no release this window.
- **Gemini CLI** — high PR throughput concentrated in stabilization, not features.

**Mature but strained:**
- **Claude Code** — high-engagement, roadmap-shaping community, but persistent network and billing trust issues.
- **Copilot CLI** — high community demand (34 👍 on #3709), **zero PR activity** in the window — the clearest maturity/throughput mismatch.

**Smaller but cohesive:**
- **Pi** — bot-assisted maintenance (`robopipi[bot]`), security-conscious PRs (undici bump), and a Show & Tell culture. Punching above its weight on provider breadth.
- **Codex** — strong Discussions culture (Show & Tell, cross-engine workflows) but the deepest *unresolved* stability debt (Computer Use issues open since August).

**Momentum verdict:** Gemini CLI and Qwen Code are iterating fastest; Claude Code has the most strategically engaged community; Copilot CLI has the largest unmet demand relative to visible maintainer output.

---

## 6. Trend Signals

**Industry-level signals with developer reference value:**

1. **Reliability > features is the new competitive frontier.** Every tool's top pain points are now *operational* (network resets, session locks, OOM, resource leaks), not capability gaps. **Takeaway:** for developers adopting these tools, budget for session-isolation and resource-capping practices; for builders, reliability is now a moat.

2. **Subagent honesty is emerging as a trust metric.** Gemini CLI's false `GOAL` reports, Qwen's unguarded 59-call loops, and Claude Code's subagent MCP inheritance all point to the same risk: **agents that silently fail are worse than agents that loudly fail.** Expect termination-reason contracts to become a de facto spec.

3. **Plugin sandboxing is standardizing around bounded IPC.** Codex's `codex-plugin-host` (256 KiB frame limits), Claude Code's Mods, and OpenCode's GUI plugins independently converge on process isolation with explicit resource bounds. **Takeaway:** design plugins as separate processes with declared limits, not in-process extensions.

4. **BYOK is moving from "supported" to "expected."** Copilot CLI's most-upvoted issue (#3709, 34 👍), OpenCode's Claude-login reuse, and Pi's Vertex/OpenCode endpoints all demand provider flexibility mid-session. **Takeaway:** single-provider sessions will become a support burden.

5. **AST-aware tooling is the next efficiency unlock.** Gemini CLI's coordinated EPIC (#22745–22747) and Claude Code's WebFetch token exhaustion signal that **naive file reads are the dominant token sink.** This is the highest-leverage area for cost reduction in agentic coding.

6. **Billing/usage transparency is a trust cliff.** Claude Code's phantom 5-hour-limit drain and Opus 5.5 accuracy regression (#105112) show that **quantified regressions get attention faster than anecdotal ones.** Expect more community-driven, methodology-backed quality audits.

7. **Free-tier reliability shapes OSS adoption.** OpenCode's free-tier flood (prompting an official umbrella triage issue) demonstrates that **free tiers are now the on-ramp for agentic CLI adoption** — and their flakiness directly caps community growth.

8. **Cross-engine workflows are nascent but real.** Codex's `two-engines-gate` (Codex reviewing Claude Code commits) and Pi's downstream adoption signals suggest a future where **multiple AI CLIs coexist in one repo**, requiring interoperable hooks and review gates.

---

*Report compiled from community digests for 2026-10-27. Metrics reflect activity in the preceding 24-hour window unless otherwise noted.*

---

## Per-Tool Reports

<details>
<summary><strong>Claude Code</strong> — <a href="https://github.com/anthropics/claude-code">anthropics/claude-code</a></summary>

## Claude Code Skills Highlights

> Source: [anthropics/skills](https://github.com/anthropics/skills)

# Claude Code Skills — Community Highlights Report
*Data as of 2026-10-27 · Source: github.com/anthropics/skills*

---

## 1. Top Skills Ranking (by community attention)

| # | Skill / PR | Function | Discussion Highlights | Status |
|---|-----------|----------|----------------------|--------|
| 1 | [#1742 fix(mcp-builder)](https://github.com/anthropics/skills/pull/1742) | Updates MCP builder for `mcp>=2.0.0` (`streamable_http_client` rename, custom headers via `create_mcp_http_client`) | High-traffic maintenance fix; resolves issue #1668; touches the widely used MCP connection scripts | OPEN |
| 2 | [#1298 fix(skill-creator)](https://github.com/anthropics/skills/pull/1298) | Isolates trigger evals, handles Windows + runtime failures in `skill-creator` | Fixes false-negative trigger scoring; cross-platform reliability; long-lived (Jun–Sep) | OPEN |
| 3 | [#1245 notion-spec-to-implementation + quantitative-resume-auditor](https://github.com/anthropics/skills/pull/1245) | Converts product specs into actionable Notion tasks; audits resumes quantitatively | Two-for-one skill submission; workflow automation angle | OPEN |
| 4 | [#525 pyxel skill](https://github.com/anthropics/skills/pull/525) | Retro game dev in Python (implementation, headless runs, frame inspection) | One of the oldest still-open PRs (Mar–Oct); niche creative-dev demand | OPEN |
| 5 | [#514 document-typography](https://github.com/anthropics/skills/pull/514) | Typographic QC for generated docs (orphans, widows, numbering) | Addresses universal document-quality pain point | OPEN |
| 6 | [#83 skill-quality-analyzer + skill-security-analyzer](https://github.com/anthropics/skills/pull/83) | Meta-skills: 5-dimension quality scoring + security analysis for Skills | Earliest meta-skill proposal; marketplace integration intent | OPEN |
| 7 | [#1771 proofcore-contract-auditor](https://github.com/anthropics/skills/pull/1771) | Static analysis of Solidity/Rust contracts, anchors proofs on TON blockchain | Web3/Agent-Skill crossover; novel notarization use case | OPEN |
| 8 | [#1703 md2video-audio](https://github.com/anthropics/skills/pull/1703) | Compiles Markdown → MP4 with AI voiceover (via Marp) | Zero-cost media pipeline; content-creation demand | OPEN |

**Note:** All top PRs report `Comments: undefined` and `👍: 0` in the dataset — attention here is inferred from recency, update cadence, and issue linkage rather than explicit engagement metrics. Issues carry the real discussion volume.

---

## 2. Community Demand Trends (from Issues)

- **Security & trust boundaries** — [#492](https://github.com/anthropics/skills/issues/492) (46 comments, the highest-engagement issue) flags community skills impersonating the `anthropic/` namespace. Strong demand for **namespace integrity, permission scoping, and skill provenance**.
- **Org-wide sharing & distribution** — [#228](https://github.com/anthropics/skills/issues/228) (17 comments) requests a shared skill library / direct sharing links instead of manual `.skill` file exchange. **Collaboration infrastructure** is a clear gap.
- **Evaluation & testing reliability** — [#556](https://github.com/anthropics/skills/issues/556) (13 comments) reports 0% trigger rates in `run_eval.py`; [#1390](https://github.com/anthropics/skills/issues/1390) shows `mcp-builder` scoring 0/N against real servers. Demand for **trustworthy eval harnesses**.
- **Context/token efficiency** — [#1487](https://github.com/anthropics/skills/issues/1487) (`claude-api` injecting ~156k tokens) and [#1329](https://github.com/anthropics/skills/issues/1329) (compact-memory symbolic notation). Demand for **lazy loading and compact agent state**.
- **Document/artifact quality** — [#2018](https://github.com/anthropics/skills/issues/2018) (docx invalid XML), [#1868](https://github.com/anthropics/skills/issues/1868) (gradient off-by-one), [#2064](https://github.com/anthropics/skills/issues/2064) (theme-factory descriptions). Steady stream of **document generation correctness** issues.
- **Governance & safety patterns** — [#412](https://github.com/anthropics/skills/issues/412) (closed) and [#1385](https://github.com/anthropics/skills/issues/1385) (reasoning quality gates). Emerging interest in **agent governance and output verification pipelines**.

**Most-anticipated new directions:** security/trust tooling → org collaboration → reliable eval frameworks → context efficiency → document fidelity.

---

## 3. High-Potential Pending Skills (active, not yet merged)

| PR | Skill | Why it may land soon |
|----|-------|---------------------|
| [#1980](https://github.com/anthropics/skills/pull/1980) | webapp-testing: remove `shell=True` | Security fix (CWE-78) on core script; updated Oct 25 |
| [#1997](https://github.com/anthropics/skills/pull/1997) | skill-creator YAML parsing | Correctness fix for eval/description optimization |
| [#1792](https://github.com/anthropics/skills/pull/1792) | docx: LibreOffice timeout handling | Robustness fix with output verification |
| [#1681](https://github.com/anthropics/skills/pull/1681) | skill-creator: standalone execution | Fixes `ModuleNotFoundError`; active Oct 24 |
| [#1730](https://github.com/anthropics/skills/pull/1730) | claude-api: dead URL replacement | Low-risk doc fix, verified HTTP 200 |
| [#1977](https://github.com/anthropics/skills/pull/1977) | algorithmic-art: wrapAround() | Small, well-scoped bug fix |
| [#1976](https://github.com/anthropics/skills/pull/1976) | webapp-testing: textarea/select reporting | Paired with #1977, clear fix |
| [#1615](https://github.com/anthropics/skills/pull/1615) | scnet-hpc | Complete new skill (SSH/Slurm workflows) |
| [#1734](https://github.com/anthropics/skills/pull/1734) | Detect orphaned docx comments | Feature addition, active updates |
| [#210](https://github.com/anthropics/skills/pull/210) | frontend-design clarity | Long-running refinement, still active |

**Pattern:** The pipeline is dominated by **bug-fix PRs to existing core skills** (skill-creator, webapp-testing, docx, mcp-builder) rather than net-new skills — a sign the ecosystem is maturing toward stability over novelty.

---

## 4. Skills Ecosystem Insight

> **The community's most concentrated demand is trustworthiness and reliability of the Skill toolchain itself** — security/namespace integrity, accurate evaluation harnesses, cross-platform robustness, and token-efficient loading — rather than new Skill categories, indicating the ecosystem is shifting from expansion to hardening.

---

# Claude Code Community Digest — 2026-10-27

## 1. Today's Highlights
The dominant theme today is the maturation of the **Mods/plugin extensibility layer** (issue #91870 is now at 274 comments and 131 👍), with the community actively stress-testing hook precedence in Team orgs. Meanwhile, a cluster of **networking reliability issues** ("Connection lost mid-response") across macOS, Linux, and Windows is generating significant user reports and packet-level debugging. A new release (v2.1.311) landed with self-hosted runner idle-session controls and startup freeze fixes.

## 2. Releases
**v2.1.311**
- Added `--hold-idle-file` and `--max-hold-min` flags to `self-hosted-runner` — keeps an idle session alive while the host reports processes it left running.
- Added a tip for the Explanatory output style, surfaced when users request explanations.
- Fixed long freezes at startup and after [truncated in source].

[Release link](https://github.com/anthropics/claude-code/releases)

## 3. Hot Issues

1. **[#91870](https://github.com/anthropics/claude-code/issues/91870) — Mods: make Claude 10x more extensible** `[OPEN]` · 274 comments · 👍131
   The flagship extensibility initiative. Community update confirms shipping is imminent. This is the highest-engagement thread in the tracker and defines the plugin/mods roadmap.

2. **[#89690](https://github.com/anthropics/claude-code/issues/89690) — modelPicker skips `opusplan` row** `[OPEN]` · 16 comments
   A `modelPicker` row for `opusplan` never surfaces in `/model` because Claude Code treats it as covered by the built-in lineup — but no Opus Plan Mode row exists. The conflation of "mode" vs "mod" is the crux.

3. **[#69364](https://github.com/anthropics/claude-code/issues/69364) — `--continue`/`--resume` doesn't check live-session registry** `[OPEN]` · 12 comments
   Two processes can append to the same session JSONL. A real data-integrity concern for anyone running parallel sessions.

4. **[#89858](https://github.com/anthropics/claude-code/issues/89858) — MCP elicitation answered `decline` by client that never drew a prompt** `[OPEN]` · 7 comments
   Affects desktop app, `--input-format stream-json`, and SDK 0.3.234. Two prior related issues were closed without merits — community frustration is building.

5. **[#105212](https://github.com/anthropics/claude-code/issues/105212) — Significant issue following AGENTS.md** `[OPEN]` · 6 comments
   Fresh (filed 2026-10-26) and moving fast. Windows macOS cross-tagging on model/hooks areas.

6. **[#73514](https://github.com/anthropics/claude-code/issues/73514) — WebFetch ignores prompt-based extraction, dumps raw page** `[OPEN]` · 👍0
   Reproducible token exhaustion: the `prompt` parameter for extraction is ignored, filling the 1M context after 3–4 fetches. Long-standing and costly.

7. **[#103488](https://github.com/anthropics/claude-code/issues/103488) — "Connection lost mid-response" traced to TCP resets from 160.79.104.10** `[OPEN]` · 5 comments
   Packet capture evidence showing resets originate server-side. 39 occurrences Oct 3–18. High-value diagnostic report.

8. **[#78988](https://github.com/anthropics/claude-code/issues/78988) — `CLAUDE_CONFIG_DIR` containing `~` written as literal `./~/` dir** `[OPEN]`
   Silent config corruption: entire config tree (transcripts, sessions, history) lands in the project directory. Reproduces on 2.1.214.

9. **[#105015](https://github.com/anthropics/claude-code/issues/105015) — 5-hour limit drained 0% → 100% with zero local requests** `[OPEN]`
   Billing/usage-meter anomaly repeated on 2026-10-21 and 10-25. Serious trust issue for Pro users; weekly meter jumped 70%→79% too.

10. **[#105112](https://github.com/anthropics/claude-code/issues/105112) — Opus 5.5 regression: answer correction rate 5.2% → 25.4% since Oct 19** `[OPEN]`
    Quantified model-quality regression over 900 vs 5,738 answers. The kind of methodology that draws Anthropic's attention.

## 4. Key PR Progress

1. **[#105303](https://github.com/anthropics/claude-code/pull/105303) — Install marketplace plugins from claude-plugins-official** `[OPEN]`
   Migrates the marketplace to install all plugins from the official repo. Has an explicit merge-order dependency on two upstream PRs — the most structurally important PR in the batch.

2. **[#96434](https://github.com/anthropics/claude-code/pull/96434) — security-guidance: keep denied/secret files out of reviewer's reach** `[CLOSED]`
   Review sub-agent now honors `Read` deny/ask rules and excludes `.env`, keys, credential stores; no shell access. Fixes #96276.

3. **[#87079](https://github.com/anthropics/claude-code/pull/87079) — fix `**` glob matching zero-depth paths** `[CLOSED]`
   Silent security-rule non-coverage: `**/*.ts` previously required a literal `/`, excluding top-level files. Important correctness fix for a security plugin.

4. **[#85409](https://github.com/anthropics/claude-code/pull/85409) — Update default model refs to Opus 5 / Sonnet 5** `[CLOSED]`
   Replaces hardcoded Opus 4.7 / Sonnet 4.6 references in README and hooks. Housekeeping that unblocks correct defaults.

5. **[#81426](https://github.com/anthropics/claude-code/pull/81426) — Fix Windows venv layout for agentic reviewer** `[CLOSED]`
   Windows users couldn't use the strongest security layer (agentic commit reviewer) because the bootstrap returned `SKIP_WIN32`. Real cross-platform parity fix.

6. **[#76640](https://github.com/anthropics/claude-code/pull/76640) — Load macOS system certs + handle NO_PROXY blackhole for Bun runtime** `[CLOSED]`
   Fixes "Self-signed certificate detected" Cowerk failures via Bun runtime on macOS (closes #24470).

7. **[#66640](https://github.com/anthropics/claude-code/pull/74021) — Allow `null` findings in StructuredOutput schema** `[CLOSED]`
   Commit reviewer wasted a turn retrying when the model emitted `null` instead of `[]` — observed in 31 sessions across 7 repos. Small but high-value DX fix.

8. **[#65875](https://github.com/anthropics/claude-code/pull/65875) — Forward `ANTHROPIC_BASE_URL` to agentic_review child process** `[CLOSED]`
   Fixes advisor feature failing behind proxy/gateway endpoints (LiteLLM, Bifrost).

9. **[#61373](https://github.com/anthropics/claude-code/pull/61373) — Add `exclude_substrings` to cut false positives** `[CLOSED]`
   `eval(` matching `ast.literal_eval(`, `exec(` matching `db.exec(...)` — reduces security-review noise.

10. **[#53204](https://github.com/anthropics/claude-code/pull/53204) — Add `sql_injection` and `hardcoded_secret` patterns** `[CLOSED]`
    Expands security-guidance pattern set from 9 to 11. Community-requested detection coverage.

## 5. Hot Discussions
No dedicated Discussions data was provided in this dataset (only Issues and PRs). Section omitted.

## 6. Feature Request Trends
- **Extensibility & Mods** (#91870): The single largest ask — a deeper plugin/hook system, currently in rollout.
- **Session lifecycle correctness**: `--continue`/`--resume` should check the live-session registry (#69364); improve multi-process safety.
- **Cost/usage controls**: Subagents shouldn't inherit all MCP server instructions (~12k tokens each, #104791); requests for cost visibility (#89832, closed stale); usage-meter anomalies (#105015).
- **MCP protocol contract**: Define the channel contract on MCP revision 2026-07-28 (#105234); fix strict schema handling for `anyOf: [X, null]` (#105223).
- **Desktop Code tab UX**: Stop forcing the `wrap_up` next-step box every turn (#104245); fix AbovePrompt render being hidden (#102480).
- **Cowork**: Sort project chats by last activity rather than creation date (#87723).

## 7. Developer Pain Points
- **Network instability is the #1 recurring complaint.** Multiple independent reports (#103488, #103058, #104603, #104527, #89475) describe mid-stream "Connection lost" / ECONNRESET errors across all platforms, with one packet capture proving server-side TCP resets. This is the most cross-cutting reliability issue in the tracker.
- **Silent misconfiguration/corruption**: `CLAUDE_CONFIG_DIR` with `~` writing to `./~/` (#78988); config tree lost without warning.
- **Security plugin false positives & gaps**: The high volume of security-guidance PRs (many closed) reveals ongoing churn around escaping issues, path handling, and Windows parity.
- **Model quality and usage-meter trust**: Quantified Opus 5.5 answer-accuracy regression (#105112) and phantom 5-hour-limit drain (#105015) erode confidence in billing and model consistency.
- **Hook precedence opacity in Team orgs** (#104236): `cc-plugin-sec-default` silently overrides user-tier `classic.Stop`/`StopFailure`/`SessionStart` hooks — "the Stop skip is silent" is a notable DX complaint.
- **Desktop/MCP auth failures**: Docs plugin MCP 401s (#104898), MCP OAuth keychain losses under load (#99471), and elicitation prompts silently declined (#89858).

---
*Generated from github.com/anthropics/claude-code data for 2026-10-27. Links use the `anthropics/claude-code` repository path for Issues and PRs.*

</details>

<details>
<summary><strong>OpenAI Codex</strong> — <a href="https://github.com/openai/codex">openai/codex</a></summary>

# OpenAI Codex Community Digest — 2026-10-27

## 1. Today's Highlights
A significant surge of activity centers on **Computer Use instability on macOS**, where `SkyComputerUseService` spawn storms continue to crash the desktop app across multiple builds (issues dating back to August are still active). Meanwhile, a high-volume incident log for **HTTP 429 rate-limiting on Linux/VS Code** (#57084) has attracted 65 comments, suggesting a widespread regression despite ample Pro allowance. On the tooling side, PR activity reveals active work on **model catalog expansion (GPT-6.1 Terra)**, plugin process isolation, and Guardian context refactoring.

## 2. Releases
- **rust-v0.165.0-alpha.3** — Minimal release notes; only version bump `0.165.0-alpha.3` published. No changelog details available.

## 3. Hot Issues

1. **[#57084 — Linux/VS Code recurring HTTP 429s](https://github.com/openai/codex/issues/57084)** — *65 comments, 8 👍*
   Users on Pro plans hit "model at capacity" and retry-limit failures despite 84–99% allowance remaining. High engagement signals a likely backend/quota-sync bug.

2. **[#49453 — Browser site-denial persists after allowing](https://github.com/openai/codex/issues/49453)** — *37 comments*
   Stored chat-level denials block browser access irreversibly on Windows. Community reaction suggests a state-management regression in permission handling.

3. **[#25015 — MCP process stack leak for subagents](https://github.com/openai/codex/issues/25015)** — *17 comments, 5 👍*
   Long-running `codex app-server` leaks MCP stdio processes after subagent completion, causing linear memory growth on Linux. Flagged as a "Papercut 2026" — significant for server deployments.

4. **[#43803 — `request_user_input_async` card auto-dismissed](https://github.com/openai/codex/issues/43803)** — *17 comments, 12 👍*
   Clarification cards vanish when the turn's final message renders, making questions unanswerable. Highest 👍 in the top set — strong signal of workflow disruption.

5. **[#38760 — Computer Use spawn storm → kernel panic](https://github.com/openai/codex/issues/38760)** — *15 comments*
   ~5–8 processes/sec of `SkyComputerUseService` exhaust `launchservicesd` and trigger WindowServer watchdog kernel panics. Severe stability issue.

6. **[#40153 — macOS spawn storm still present in 26.818](https://github.com/openai/codex/issues/40153)** — *9 comments, 2 👍*
   Confirms the Computer Use bug persists across builds, frustrated users noting rollback is the only fix.

7. **[#38637 — New Codex release unstable, high CPU on Mac](https://github.com/openai/codex/issues/38637)** — *9 comments, 6 👍*
   Requests a revert; crashes within minutes and long-chat unusability. High 👍 indicates broad agreement.

8. **[#42611 — CLI auto-compaction replays answered messages](https://github.com/openai/codex/issues/42611)** — *9 comments*
   Post-compaction, an already-answered user message is replayed as a new turn — breaks conversation continuity.

9. **[#46690 — Windows renderer memory leak to 4–7 GB](https://github.com/openai/codex/issues/46690)** — *8 comments*
   Desktop 26.915 repeatedly crashes on Windows with light workloads; rollback to 26.903 stable.

10. **[#53136 — Dot-started tasks lose MCP tool access](https://github.com/openai/codex/issues/53136)** — *4 comments, 7 👍*
    Enabled local MCP tools invisible to Dot-started tasks on macOS. High 👍 relative to comments signals quiet but real demand.

## 4. Key PR Progress

1. **[#57313 — Default gateway OAuth to Authorization bearer tokens](https://github.com/openai/codex/pull/57313)** — Simplifies gateway auth by defaulting to `Authorization: Bearer` when `delivery` is omitted.

2. **[#57312 — Centralize Guardian root context preparation](https://github.com/openai/codex/pull/57312)** — Moves root message prep and handoff selection into `codex-guardian-context`.

3. **[#57311 — Preserve tool output versions in rollout traces](https://github.com/openai/codex/pull/57311)** — Fixes trace reducer rejecting valid multi-output tool calls after compaction.

4. **[#57293 — Add GPT-6.1 Terra to model catalogs](https://github.com/openai/codex/pull/57293)** — Bundled catalog + GCP Vertex + Bedrock (Global/US cross-region) support for the new model.

5. **[#57290 — Plugin process host with bounded IPC](https://github.com/openai/codex/pull/57290)** — Adds `codex-plugin-host` with 256 KiB frame limits, startup handshake, and lifecycle management — key for plugin sandboxing.

6. **[#57286 — Support `network_proxy` in managed requirements](https://github.com/openai/codex/pull/57286)** — Accepts `[network_proxy]` in `requirements.toml`, keeps `[experimental_network]` as alias.

7. **[#57287 — Preserve parent tool declarations in prediction forks](https://github.com/openai/codex/pull/57287)** — Keeps inherited tool declarations in MCP-disabled forks.

8. **[#57280 — Preserve full MCP results in rollout traces](https://github.com/openai/codex/pull/57280)** — Retains untruncated MCP completion responses for trace fidelity.

9. **[#57282 — Promote rounded token counts to next unit](https://github.com/openai/codex/pull/57282)** — "1000K" now displays as "1M"; polish for the TUI.

10. **[#57281 — Enable agents navigation for remote sessions](https://github.com/openai/codex/pull/57281)** — Brings `← for agents` shortcut and hint to remote App Server sessions.

## 5. Hot Discussions

### Show and Tell
- **[#56176 — Does a fresh session receive AGENTS.md?](https://github.com/openai/codex/discussions/56176)** — "Agent Relay Check" tool for verifying AGENTS.md propagation across sessions. Practical for teams relying on nested instructions.
- **[#57022 — two-engines-gate: Codex reviews Claude Code commits](https://github.com/openai/codex/discussions/57022)** — Cross-engine review gate requiring an ACCEPT before merge. Interesting multi-agent workflow pattern.
- **[#56564 — Haru Café, a company built with Codex](https://github.com/openai/codex/discussions/56564)** — Long-running showcase of an AI-founded company project.
- **[#57250 — Open dataset of coding-agent tool-call failures](https://github.com/openai/codex/discussions/57250)** — CC BY 4.0 dataset with Codex cases — valuable for eval builders.
- **[#57011 — pkg-guard: PreToolUse hook for slopsquatting](https://github.com/openai/codex/discussions/57011)** — Blocks hallucinated/typosquatted `pip`/`npm` installs before execution.
- **[#57001 — AEGIS: Windows activity inspector for Codex CLI](https://github.com/openai/codex/discussions/57001)** — Process-tree and file/TCP activity view for coding agents.

### Q&A
- **[#57025 — Can app-server apply ToolPolicy when starting a thread?](https://github.com/openai/codex/discussions/57025)** — Asks how to start a thread with no tools available for a review-handoff pattern.
- **[#57029 — Work email inaccessible via Plugins → Gmail](https://github.com/openai/codex/discussions/57029)** — Multi-account Gmail plugin fails to resolve secondary mailbox.

## 6. Feature Request Trends
- **Multi-engine / multi-agent workflows** — Repeated interest in using Codex alongside Claude Code and other engines in the same repo (e.g., `two-engines-gate`).
- **Instruction propagation observability** — Tools like `Agent Relay Check` reflect demand for verifying `AGENTS.md` and context delivery end-to-end.
- **Per-thread tool gating** — Requests for programmatic `ToolPolicy` control at thread start, rather than relying on prompts.
- **Plugin/MCP resource isolation** — PRs and issues converge on bounding MCP/plugin process lifetimes and IPC.
- **Model catalog transparency** — Frequent additions (GPT-6.1 Terra) hint at appetite for faster model availability across providers (Bedrock, Vertex).
- **Guardrails hooks** — PreToolUse-style policies (e.g., `pkg-guard`) for supply-chain safety.

## 7. Developer Pain Points
- **Rate limiting misbehavior** — Pro users throttled despite high remaining allowance (Linux/VS Code) — top-commented issue.
- **Computer Use instability on macOS** — Unbounded `SkyComputerUseService` spawning causes crashes, kernel panics, and V8 OOM aborts across many builds; no fix in sight since August.
- **Memory/resource leaks** — MCP process stacks on Linux and renderer leaks on Windows (4–7 GB) degrade long-running sessions.
- **Permission state inconsistency** — Auto-declined prompts saved as user choices; browser denials persist after "allow."
- **Interactive prompt loss** — Question cards disappearing before users can answer, on both macOS and Windows desktop.
- **Session continuity bugs** — Auto-compaction re-executes answered messages; rollout traces losing tool output versions.
- **Cross-platform parity gaps** — Windows-specific issues (elevation, `spawn EPERM`, missing Chrome/Edge in `@` menu, project visibility) keep accumulating.

*All links reference `github.com/openai/codex`.*

</details>

<details>
<summary><strong>Gemini CLI</strong> — <a href="https://github.com/google-gemini/gemini-cli">google-gemini/gemini-cli</a></summary>

# Gemini CLI Community Digest — 2026-10-27

## 1. Today's Highlights

No new releases landed in the last 24 hours, but issue and PR activity remained intense — 50 issues and 37 PRs were touched, heavily concentrated in the `area/agent` workstream. The most concerning signal is a cluster of P1 subagent bugs (`#22323`, `#21409`, `#21983`) where agents report `Termination Reason: GOAL` despite hitting turn limits, hanging indefinitely, or failing outright on Wayland. Meanwhile, the platform team is pushing through a wave of stabilization PRs targeting terminals, telemetry, and CRLF/Unicode edge cases.

## 2. Releases

No releases in the last 24h.

## 3. Hot Issues

1. **[#22323](https://github.com/google-gemini/gemini-cli/issues/22323)** — *Subagent recovery after MAX_TURNS misreported as GOAL success* (13 comments, P1). The `codebase_investigator` subagent claims success even when it hit the turn limit before doing any work. This is a correctness bug in the agent termination contract — silent failures are far worse than loud ones.

2. **[#21409](https://github.com/google-gemini/gemini-cli/issues/21409)** — *Generalist agent hangs forever* (8 comments, 👍8, P1). Simple operations like folder creation hang indefinitely when deferred to the generalist agent. The workaround (instructing the model not to use subagents) reveals a core delegation defect, and the 8 upvotes show broad impact.

3. **[#19873](https://github.com/google-gemini/gemini-cli/issues/19873)** — *Zero-dependency OS sandboxing & post-execution intent routing* (9 comments, P2). A substantial design proposal to let Gemini 3's native bash affinity shine without compromising security. Signals that the team is thinking about rewiring the execution model rather than patching it.

4. **[#21968](https://github.com/google-gemini/gemini-cli/issues/21968)** — *Gemini doesn't use skills/subagents autonomously* (7 comments, P2). Anecdotal but resonant: custom skills like `gradle` and `git` go ignored unless explicitly invoked. Directly undermines the value proposition of the skills system.

5. **[#22745](https://github.com/google-gemini/gemini-cli/issues/22745)** — *AST-aware file reads, search, mapping* (7 comments, P2). An EPIC investigating syntax-aware tooling to reduce misaligned reads and token noise. If successful, this could be a step-change in agent efficiency — see also [#22746](https://github.com/google-gemini/gemini-cli/issues/22746) and [#22747](https://github.com/google-gemini/gemini-cli/issues/22747).

6. **[#22267](https://github.com/google-gemini/gemini-cli/issues/22267)** — *Browser Agent ignores `settings.json` overrides* (4 comments, P2). Configuration that is read by `AgentRegistry` but then discarded downstream is a classic plumbing bug — users are losing control over `maxTurns` and similar knobs.

7. **[#21983](https://github.com/google-gemini/gemini-cli/issues/21983)** — *Browser subagent fails on Wayland* (4 comments, P1). Linux users on modern display servers are blocked. Combined with #22267 and [#22232](https://github.com/google-gemini/gemini-cli/issues/22232), the browser agent is accumulating real reliability debt.

8. **[#24246](https://github.com/google-gemini/gemini-cli/issues/24246)** — *400 error with >128 tools* (3 comments, P2). A hard ceiling on tool count with no graceful degradation. Anyone running rich MCP setups will collide with this.

9. **[#22672](https://github.com/google-gemini/gemini-cli/issues/22672)** — *Agent should stop/discourage destructive behavior* (3 comments, P2). The model reaches for `git reset` and `--force` when safer paths exist. Trust and safety adjacent — worth watching.

10. **[#18836](https://github.com/google-gemini/gemini-cli/issues/18836)** — *Replace WriteToDo with persistent file-based task tracking* (2 comments, P3). Addresses "context rot" and cross-session memory loss. A quiet but architecturally important proposal.

Honorable mentions: [#21763](https://github.com/google-gemini/gemini-cli/issues/21763) (bug reports omit subagent context), [#23571](https://github.com/google-gemini/gemini-cli/issues/23571) (tmp script litter), [#20079](https://github.com/google-gemini/gemini-cli/issues/20079) (symlinked agents not recognized).

## 4. Key PR Progress

1. **[#29951](https://github.com/google-gemini/gemini-cli/pull/29951)** — *Retry transient VS Code download failures in integration tests* (P0). A nightly run failed on a network timeout rather than a real regression; this hardens CI against flakiness.

2. **[#29905](https://github.com/google-gemini/gemini-cli/pull/29905)** — *Handle terminals rendering ambiguous-width chars as wide* (P2, maintainer). Fixes layout corruption on macOS Terminal.app, iTerm2, WezTerm, and CJK-locale terminals. A long-tail internationalization fix with real user impact.

3. **[#29904](https://github.com/google-gemini/gemini-cli/pull/29904)** — *Bound inline history re-render after terminal width changes* (P2, maintainer). Directly addresses the flicker and resize performance issue tracked in [#21924](https://github.com/google-gemini/gemini-cli/issues/21924).

4. **[#29966](https://github.com/google-gemini/gemini-cli/pull/29966)** — *Normalize CRLF before diffing in `getDiffContextSnippet`*. Windows users have been getting corrupted diff previews due to LF/CRLF mismatch. Small fix, meaningful for Windows adoption.

5. **[#29965](https://github.com/google-gemini/gemini-cli/pull/29965) / [#29963](https://github.com/google-gemini/gemini-cli/pull/29963)** — *Unicode truncation fix in ExpandableText*. Surrogate-pair boundaries were splitting emoji in collapsed labels. A duplicate pair — worth merging carefully.

6. **[#29959](https://github.com/google-gemini/gemini-cli/pull/29959)** — *Configurable numeric score-based model routing* (P2). Lets users define custom routing rules while preserving defaults. A meaningful step toward power-user control over cost/quality tradeoffs.

7. **[#29958](https://github.com/google-gemini/gemini-cli/pull/29958)** — *Send ACP clients shell output for AnsiOutput results* (P2). Fixes empty `tool_call_update` payloads for `run_shell_command`. Editor integrations benefit.

8. **[#29948](https://github.com/google-gemini/gemini-cli/pull/29948)** — *Respect cancellation during background output reads* (P2, help wanted). Aborting a delayed invocation now actually aborts instead of completing anyway.

9. **[#29960](https://github.com/google-gemini/gemini-cli/pull/29960)** — *Use CLI version instead of Node runtime for telemetry `SERVICE_VERSION`*. Enterprise observability dashboards have been attributing telemetry to the wrong version.

10. **[#29884](https://github.com/google-gemini/gemini-cli/pull/29884)** — *Allow trusted system paths on Android/Termux for ripgrep* (P2, help wanted). Unblocks `grep_search` for Termux users — a nice niche win for mobile/embedded workflows.

Also notable: [#29910](https://github.com/google-gemini/gemini-cli/pull/29910) (MCP metadata in ACP permission requests), [#29961](https://github.com/google-gemini/gemini-cli/pull/29961) (spending-cap errors classified as terminal quota errors).

## 5. Hot Discussions

No Discussion data was provided for this period.

## 6. Feature Request Trends

Distilling the issue backlog, four clear feature directions dominate:

- **Agent self-awareness and autonomy** — The community wants Gemini to use its own skills ([#21968](https://github.com/google-gemini/gemini-cli/issues/21968)), understand its own CLI flags and hotkeys ([#21432](https://github.com/google-gemini/gemini-cli/issues/21432)), and stop destructive behavior ([#22672](https://github.com/google-gemini/gemini-cli/issues/22672)).
- **AST-aware codebase tooling** — A coordinated EPIC ([#22745](https://github.com/google-gemini/gemini-cli/issues/22745), [#22746](https://github.com/google-gemini/gemini-cli/issues/22746), [#22747](https://github.com/google-gemini/gemini-cli/issues/22747)) plus related token-frugal reads ([#19561](https://github.com/google-gemini/gemini-cli/issues/19561)). If executed, this redefines how agents navigate large repos.
- **Persistent, backgroundable agent state** — File-based task tracking ([#18836](https://github.com/google-gemini/gemini-cli/issues/18836)), backgrounding subagents ([#22741](https://github.com/google-gemini/gemini-cli/issues/22741)), and shared memory between agents ([#18287](https://github.com/google-gemini/gemini-cli/issues/18287)).
- **Observability and trust** — Subagent trajectories via `/chat share` ([#22598](https://github.com/google-gemini/gemini-cli/issues/22598)), richer bug reports ([#21763](https://github.com/google-gemini/gemini-cli/issues/21763)), and per-workspace policies ([#18397](https://github.com/google-gemini/gemini-cli/issues/18397)).

## 7. Developer Pain Points

The most frequently recurring frustrations, ordered by severity:

1. **Subagent reliability is the #1 pain.** Hangs, hangs-forever, false GOAL reports, Wayland failures, per-agent settings ignored — the `area/agent` label dominates both P1 bug counts and comment volume. The trust deficit here is real: users cannot tell whether a subagent succeeded or silently gave up.
2. **Configuration that doesn't take effect.** `settings.json` overrides ignored by Browser Agent ([#22267](https://github.com/google-gemini/gemini-cli/issues/22267)), symlinked agents not discovered ([#20079](https://github.com/google-gemini/gemini-cli/issues/20079)), and tool-count hard limits ([#24246](https://github.com/google-gemini/gemini-cli/issues/24246)). Users expect overrides to be honored end-to-end.
3. **Resource hygiene.** The model creating temp scripts across directories ([#23571](https://github.com/google-gemini/gemini-cli/issues/23571)) and destructive git operations ([#22672](https://github.com/google-gemini/gemini-cli/issues/22672)) force manual cleanup and review — friction that scales with usage.
4. **Interactive prompt deadlocks.** Both the generalist agent and the vite-app flow ([#22465](https://github.com/google-gemini/gemini-cli/issues/22465)) get stuck at interactive prompts with no timeout or auto-response, a common class of AI-CLI failure.
5. **Terminal rendering polish.** Resize flicker ([#21924](https://github.com/google-gemini/gemini-cli/issues/21924)), Unicode truncation, and ambiguous-width handling show that TUI robustness is an ongoing tax on the project.

Overall: the project is deep in a stabilization and agent-architecture phase. Expect subagent correctness to remain the top community concern until the `status/need-retesting` P1s are definitively closed.

</details>

<details>
<summary><strong>GitHub Copilot CLI</strong> — <a href="https://github.com/github/copilot-cli">github/copilot-cli</a></summary>

# GitHub Copilot CLI — Community Digest
**Date: 2026-10-27** | Source: [github.com/github/copilot-cli](https://github.com/github/copilot-cli)

---

## 1. Today's Highlights

A quiet release day with only a patch build (`v1.0.104-4`), but the issue tracker remains highly active: 50 issues were updated in the last 24 hours, led by a 14-comment escalation on voice-mode ASR failures and an 11-comment/34-upvote thread pushing for multi-model switching within a single session. The dominant themes are session stability (locks, OOM on resume, credential expiry), MCP authentication/registry plumbing, and BYOK/local-provider flexibility.

---

## 2. Releases

**v1.0.104-4** — Patch build with generic "fixes and changes." No detailed changelog was published alongside this release; treat it as a maintenance drop rather than a feature release. No PRs were updated in the last 24 hours, so there is no code-level context to corroborate the release contents.

---

## 3. Hot Issues (Top 10)

1. **[#4024 — Voice mode: all bundled ASR models fail silently](https://github.com/github/copilot-cli/issues/4024)** *(OPEN, area:models, 14 comments)*
   All three `/voice` ASR models (`nemotron-3.5-asr-streaming-0.6b`, `nemotron-speech-streami...`) return empty transcriptions despite confirmed mic capture. Reporter traces it to a MultiModalProcessor routing bug for RNNT models in Foundry Local Core. Highest-engagement issue of the day; zero 👍 but heavy maintainer back-and-forth suggests an active triage.

2. **[#3709 — Allow `/model` to switch between multiple models incl. BYOK/local in one session](https://github.com/github/copilot-cli/issues/3709)** *(OPEN, area:models, 11 comments, 34 👍)*
   BYOK pins a session to one model via `COPILOT_MODEL`, and `/model` only lists GitHub-hosted models. This is the most-upvoted open issue in the batch — clear signal that multi-provider flexibility is a top community ask.

3. **[#4905 — Desktop app sessions die: "GitHub credential registration no longer available"](https://github.com/github/copilot-cli/issues/4905)** *(OPEN, triage, 7 comments, 4 👍)*
   Desktop app 1.1.22 (bundled CLI 1.0.84-5) sessions die minutes after spawn when credential registration expires, leaving the github-mcp-server catalog stale and fatal. High severity: sessions become unusable shortly after launch.

4. **[#4251 — Resume of large session OOMs / burns one CPU core ~70 min (regression in 1.0.74)](https://github.com/github/copilot-cli/issues/4251)** *(OPEN, area:sessions, 5 comments, 1 👍)*
   A controlled A/B (1.0.73 vs 1.0.74) isolates a ~3–4× memory regression on resume. This is a well-documented regression report — the kind maintainers can act on quickly, and a major pain point for long-lived sessions.

5. **[#5253 — 1.0.103: persistent session-lock timeouts and unresponsive tasks](https://github.com/github/copilot-cli/issues/5253)** *(OPEN, area:sessions/agents, 4 comments)*
   `session lock unavailable during is_session_generation_current: acquisition timed out` renders long-lived sessions largely unresponsive. Created 2026-10-25 — the most recent high-impact report, and possibly related to the v1.0.104-4 patch.

6. **[#4026 — Windows: repeated native-runtime crashes since May 2026, unresolved across versions](https://github.com/github/copilot-cli/issues/4026)** *(OPEN, area:platform-windows, 4 comments)*
   Crashes across v1.0.15, v1.0.52, v1.0.53 and later — a long-tail Windows stability problem that has resisted multiple releases.

7. **[#4017 — MCP OAuth: non-first-party HTTP servers cancel host token, never launch browser flow](https://github.com/github/copilot-cli/issues/4017)** *(OPEN, triaged, area:authentication/mcp, 4 comments, 3 👍)*
   Atlassian and incident.io MCP servers silently fail to authenticate with no popup and no error. Triaged status and cross-surface impact make this one of the more important MCP auth bugs.

8. **[#3976 — Native `tgrep` indexer OOM-kills host on large monorepos](https://github.com/github/copilot-cli/issues/3976)** *(OPEN, area:tools, 4 comments)*
   The experimental Rust trigram indexer spawns a persistent daemon with no memory cap, killing the host on large repos. A serious risk for enterprise monorepo users who receive the `copilot_cli_tgrep` experiment.

9. **[#3839 — Ollama Cloud rejects `custom_tool_call` payload used by Copilot CLI](https://github.com/github/copilot-cli/issues/3839)** *(OPEN, area:agents/models, 2 comments, 7 👍)*
   BYOK + Fleet Mode via Ollama Cloud fails with a 400 (`unknown input item type: "custom_tool_call"`). The 7 👍 against only 2 comments signals broad silent agreement from BYOK users.

10. **[#5149 — Claude Opus 5.5: 32k `maxOutputTokens` yields empty turns at max/xhigh reasoning](https://github.com/github/copilot-cli/issues/5149)** *(OPEN, area:non-interactive/models, 2 comments)*
    Hidden reasoning consumes the entire 32k cap, producing empty replies that auto-continue still bills. A cost-and-correctness issue for high-effort reasoning workflows.

---

## 4. Key PR Progress

**No pull requests were updated in the last 24 hours (0 items).** There is no PR activity to report for this digest window. Developers tracking in-flight fixes should follow the linked issues above; several (e.g., #5253, #4251) appear ripe for a patch in the near term given the `v1.0.104-4` release cadence.

---

## 5. Hot Discussions

No Discussions data was provided in the source dataset. This section is omitted.

---

## 6. Feature Request Trends

Distilled from the issue set:

- **Multi-model / multi-provider sessions** — [#3709](https://github.com/github/copilot-cli/issues/3709) (switch models mid-session incl. BYOK/local) and [#4703](https://github.com/github/copilot-cli/issues/4703) (per-agent provider selection) both ask for provider flexibility that today's process-wide `COPILOT_PROVIDER_BASE_URL` cannot deliver.
- **ACP protocol completeness** — [#4880](https://github.com/github/copilot-cli/issues/4880) wants the model list exposed as a `category:model` config option over `--acp`; [#4555](https://github.com/github/copilot-cli/issues/4555) and [#4537](https://github.com/github/copilot-cli/issues/4537) request correct session/prompt and permission semantics in ACP mode.
- **Configurable reasoning effort** — [#4560](https://github.com/github/copilot-cli/issues/4560) asks that `auto` respect a reasoning-effort setting instead of hardcoding `null`.
- **Non-interactive parity** — [#4507](https://github.com/github/copilot-cli/issues/4507) requests that repo-level `enabledPlugins` be honored in `copilot -p` mode, matching interactive behavior.
- **Adversarial review integrity** — [#4380](https://github.com/github/copilot-cli/issues/4380) asks Rubber Duck to select a model family independent of the primary session.

---

## 7. Developer Pain Points

Recurring frustrations across the updated issues:

- **Session lifecycle fragility** — lock acquisition timeouts ([#5253](https://github.com/github/copilot-cli/issues/5253)), OOM on resume ([#4251](https://github.com/github/copilot-cli/issues/4251)), unresumable sessions from masked telemetry metrics ([#5023](https://github.com/github/copilot-cli/issues/5023)), and model-name prefix mismatches ([#4282](https://github.com/github/copilot-cli/issues/4282)) all point to brittle session persistence and restoration.
- **MCP authentication and discovery** — OAuth flows that silently no-op ([#4017](https://github.com/github/copilot-cli/issues/4017)), 400s on stateful servers like Atlassian ([#5014](https://github.com/github/copilot-cli/issues/5014)), custom registry unreachable in CLI but working in VS Code ([#4949](https://github.com/github/copilot-cli/issues/4949)), runaway Windows OAuth loops ([#5134](https://github.com/github/copilot-cli/issues/5134)), and orphaned stdio processes after auth-driven client rebuild ([#4392](https://github.com/github/copilot-cli/issues/4392)).
- **Credential and policy confusion** — desktop sessions dying on stale GitHub credential registration ([#4905](https://github.com/github/copilot-cli/issues/4905)) and enterprise policy gating mismatches ([#4481](https://github.com/github/copilot-cli/issues/4481)).
- **Resource safety on large repos** — uncapped `tgrep` memory ([#3976](https://github.com/github/copilot-cli/issues/3976)) and inotify exhaustion on shared Linux hosts ([#5242](https://github.com/github/copilot-cli/issues/5242)) both cause host- or session-level failures in containerized/enterprise environments.
- **BYOK interop gaps** — null-length errors ([#3911](https://github.com/github/copilot-cli/issues/3911)) and provider-specific payload rejection ([#3839](https://github.com/github/copilot-cli/issues/3839)) show BYOK still lacks broad compatibility testing.
- **Permission prompt UX** — edit-permission requests timing out on unattended sessions ([#4486](https://github.com/github/copilot-cli/issues/4486)) and ACP auto-approving tool calls without `session/request_permission` ([#4537](https://github.com/github/copilot-cli/issues/4537)) erode trust in the permission model.

---

*Digest generated from GitHub issue and release metadata for 2026-10-27. Links point to the public `github/copilot-cli` tracker.*

</details>

<details>
<summary><strong>OpenCode</strong> — <a href="https://github.com/anomalyco/opencode">anomalyco/opencode</a></summary>

# OpenCode Community Digest — 2026-10-27

## 1. Today's Highlights

The free-tier experience dominates community attention this cycle: a consolidated "read this first" triage issue (#59387) was opened to funnel the flood of `Free usage exceeded` reports, while the long-running clipboard bug (#4283) finally closed after 159 comments. On the engineering side, v2 migration pain continues to surface — config directory semantics, env-var compatibility, and service stalls are generating sustained discussion. PR activity is heavy on the `@opencode/ai` package, with `LLM.loop` landing and async tool support on the way.

## 2. Releases

No new releases in the last 24 hours.

## 3. Hot Issues

1. **[#4283](https://github.com/anomalyco/opencode/issues/4283) — Copy To Clipboard not working** (CLOSED, 159 comments, 👍134)
   The single most-commented issue in the set. Text selection in the TUI wasn't reaching the clipboard across OSes. Its closure after nearly a year of reports is a meaningful quality-of-life win for daily users.

2. **[#56324](https://github.com/anomalyco/opencode/issues/56324) — Free models fail in official TUI with "free tier can only be used from within OpenCode"** (CLOSED, 71 comments, 👍30)
   The irony of an official client rejecting its own free tier on Windows v2.0.32 made this a high-severity, high-visibility bug. Now closed, but emblematic of free-tier routing problems.

3. **[#34344](https://github.com/anomalyco/opencode/issues/34344) — Unlimited usage exploit on opencode models** (CLOSED, 65 comments)
   A disclosure that IP-keyed rate limits reset via VPN rotation. Zero upvotes but massive comment volume — a policy/abuse thread as much as a technical one, since it touches cost and fair-use enforcement.

4. **[#59387](https://github.com/anomalyco/opencode/issues/59387) — [zen] Free tier issues: read this first** (OPEN, 7 comments)
   A newly created umbrella issue collecting all free-tier symptoms (`usage exceeded`, resets that never fire, desktop version rejections). Worth watching as the canonical tracker going forward.

5. **[#54181](https://github.com/anomalyco/opencode/issues/54181) — Managed service stalls, watchdog loses sessions, restart stampede** (OPEN, 8 comments, severity:high)
   Three coupled failures around `opencode serve --service`: silent session destruction via 404 "session not found". Session loss during active work is the most damaging class of bug here.

6. **[#32825](https://github.com/anomalyco/opencode/issues/32825) — `OPENCODE_CONFIG_DIR` replaces global config in v2 services** (OPEN, 10 comments)
   A breaking semantic divergence between the V1 and V2 config loaders. Classic migration hazard — same var, different behavior, silently different config resolution.

7. **[#36990](https://github.com/anomalyco/opencode/issues/36990) — Restore non-experimental env-var compatibility in v2** (OPEN, 8 comments)
   Umbrella issue for V1→V2 environment-variable regressions. Touchpoint for anyone scripting automation against OpenCode; flags still declared but unconsumed.

8. **[#53393](https://github.com/anomalyco/opencode/issues/53393) — Un-debounced compatibility reload + skills watcher resubscribe loop** (OPEN, 6 comments, v2.0.23)
   Any file write in the config dir triggers a full reload with no debounce; paired with the skills watcher, this loops. Root cause behind the idle-CPU reports.

9. **[#54114](https://github.com/anomalyco/opencode/issues/54114) — Service skill watcher self-loops, ~37% idle CPU** (OPEN, reproduced, 6 comments)
   The resource-consumption face of #53393: the background service rebuilds inotify watches ~1–2×/sec while otherwise idle. Reproduced and still open.

10. **[#54603](https://github.com/anomalyco/opencode/issues/54603) — npm CLI ships native binary as `bin/opencode.exe` on Linux/macOS** (OPEN, 7 comments)
    Packaging bug with broad blast radius: the npm package mislabels the ELF/Mach-O binary with a `.exe` suffix. Easy to fix, annoying to hit, affects every npm-based install path.

**Also notable (closed):** [#6912](https://github.com/anomalyco/opencode/issues/6912) Windows Ctrl+C mouse-tracking flood (👍21) and [#45856](https://github.com/anomalyco/opencode/issues/45856) v2 `serve` Basic Auth always returning 401.

## 4. Key PR Progress

1. **[#59421](https://github.com/anomalyco/opencode/pull/59421) — feat(ai): add `LLM.loop` to run tools until the model stops** (CLOSED)
   Adds a first-class tool-use loop to `@opencode/ai`, removing the need for callers to hand-roll run-tool → rebuild-message → re-call cycles. Foundational for the AI package.

2. **[#59445](https://github.com/anomalyco/opencode/pull/59445) — feat(ai): async tools + `generateObject` on the Promise client** (OPEN)
   `AI.tool` now accepts plain sync/async execute functions (no Effect boilerplate), plus `generateObject` is added. Lowers the barrier to authoring tools considerably.

3. **[#59442](https://github.com/anomalyco/opencode/pull/59442) — fix(ai): stop `LLM.loop` on provider error** (OPEN)
   Loop previously continued — and ran tools — after a step whose stream reported a provider error. Now halts and forwards the error without executing tools. Important correctness guardrail.

4. **[#59441](https://github.com/anomalyco/opencode/pull/59441) — fix(core): size compaction from provider's last token count** (OPEN)
   Compaction was approximating with `chars / 4` even when the provider reported real token counts. More accurate context management; co-authored with kitlangton.

5. **[#59190](https://github.com/anomalyco/opencode/pull/59190) — feat(protocol): image & decision generation endpoints (experimental)** (OPEN)
   Defines HTTP contracts for image/decision generation that currently only exist in the `@opencode/ai` clients. Contracts-only for now (decode then fail), letting clients build ahead.

6. **[#58782](https://github.com/anomalyco/opencode/pull/58782) — feat(core): add Claude Agent provider** (OPEN, needs:compliance)
   Built-in provider that runs Claude models through the user's own Claude Code login via the Claude Agent SDK. Notable for auth/policy review; watched closely.

7. **[#55246](https://github.com/anomalyco/opencode/pull/55246) — feat(plugin): OpenCode Desktop GUI plugins** (OPEN)
   Plugins can ship a `./gui-experimental` export to add UI to the desktop app; core features become built-in plugins on the same SDK. A significant extensibility expansion.

8. **[#59072](https://github.com/anomalyco/opencode/pull/59072) — refactor(client): group experimental SDK methods under `client.experimental`** (OPEN)
   Clear stable-vs-experimental separation with no wire-format change. Good API hygiene ahead of wider v2 adoption.

9. **[#59446](https://github.com/anomalyco/opencode/pull/59446) — feat(opencode): declare model input modalities in the system prompt** (OPEN)
   System prompt now tells the model which modalities it accepts. Small but valuable for multimodal correctness.

10. **[#59437](https://github.com/anomalyco/opencode/pull/59437) — feat(core): `/goal` with a client-side done check** (OPEN)
    Adds a `/goal` command with TUI/desktop UI; alternative to #58508, deriving "done" from already-synced client data instead of a new `session.settled` server event.

**Also worth noting:** [#59448](https://github.com/anomalyco/opencode/pull/59448) configurable retry budget via env; [#59447](https://github.com/anomalyco/opencode/pull/59447) dev→beta merge to green up e2e; [#59444](https://github.com/anomalyco/opencode/pull/59444) revert of `OPENCODE_SERVER_USERNAME` honoring (see #45856/#36990).

## 5. Hot Discussions

No discussion data was provided for this cycle.

## 6. Feature Request Trends

- **V2 filesystem & path contracts** — A cluster of romanilyin proposals: canonical path contracts across runtime/storage/clients ([#54615](https://github.com/anomalyco/opencode/issues/54615)), offline SQLite inspection/backup/vacuum ([#54618](https://github.com/anomalyco/opencode/issues/54618)), and boundary validation for foreign directory hints ([#54617](https://github.com/anomalyco/opencode/issues/54617)). A push for a coherent, safe storage layer.
- **Plugin extensibility** — Requests to expand plugin surface area: a slot for the session tab bar ([#54927](https://github.com/anomalyco/opencode/issues/54927)) and unified tool-card labels/progress across MCP and Code Mode ([#54812](https://github.com/anomalyco/opencode/issues/54812)), alongside the Desktop GUI plugin PR.
- **Observability & UX polish** — Retry-budget configurability, model modality transparency, and long-message folding (PRs #59448, #59446, #59435) suggest demand for more tunable, transparent client behavior.
- **Provider/auth flexibility** — Claude Agent provider (#58782) reflects appetite for leveraging existing logins rather than managing separate credentials.

## 7. Developer Pain Points

- **Free-tier reliability is the loudest complaint.** Multiple issues ([#58550](https://github.com/anomalyco/opencode/issues/58550), [#59307](https://github.com/anomalyco/opencode/issues/59307), [#59387](https://github.com/anomalyco/opencode/issues/59387)) report `Free usage exceeded` on first use and resets that never fire — prompting the official umbrella triage issue. Trust in the free tier is eroding.
- **V1→V2 migration friction.** Config directory semantics (#32825), env-var compatibility (#36990), and Basic Auth regressions (#45856, plus the #59444 revert) show the v2 core/path diverging from established behavior in ways that break existing setups.
- **Background service instability.** The service stalls, loses sessions, and races its own restart ([#54181](https://github.com/anomalyco/opencode/issues/54181)); watcher self-loops burn ~37% idle CPU ([#53393](https://github.com/anomalyco/opencode/issues/53393), [#54114](https://github.com/anomalyco/opencode/issues/54114)). Resource cost and data-loss risk combined.
- **First-call race conditions.** A recurring pattern of cold-location races: `plugin list` returns "No plugins found" on first call ([#54654](https://github.com/anomalyco/opencode/issues/54654)), mirroring prior races in `mcp.list`, `skill.list`, `agent.list`, and `model.list`. Same class of bug, repeatedly.
- **Cross-platform polish.** Windows mouse-tracking on Ctrl+C (#6912), Linux/macOS `.exe` binary mislabeling (#54603), and more desktop i18n gaps ([#59377](https://github.com/anomalyco/opencode/issues/59377)) all point to platform-specific rough edges.

---
*Generated from github.com/anomalyco/opencode activity on 2026-10-27.*

</details>

<details>
<summary><strong>Pi</strong> — <a href="https://github.com/earendil-works/pi">earendil-works/pi</a></summary>

# Pi Community Digest — 2026-10-27

## 1. Today's Highlights

No new releases landed in the last 24 hours, but issue and PR activity remains heavy. A long-running Windows usability thread (#7547) continues to draw attention, while a cluster of fresh bug reports around MCP, TUI input handling, and Bedrock tool schemas arrived today. On the PR side, a set of `robopipi[bot]`-authored fixes for `tool_search` ranking, `undici` security bumps, and the `prompt-url-widget` extension all closed, signaling active automation-assisted maintenance.

## 2. Releases

No new releases in the last 24 hours. (Note: PR #11435 addresses a security-sensitive `undici` pin bump that may warrant a patch release soon — see Key PR Progress.)

## 3. Hot Issues

1. **[#7547](https://github.com/earendil-works/pi/issues/7547) — How do you use Pi on Windows? (OPEN, 90 comments)**
   The single most-commented open issue. Maintainers are trying to decide where to invest Windows effort: fix core, extend, or document. Community is clearly split across WSL, native, and MSYS2 paths. High strategic relevance.

2. **[#2870](https://github.com/earendil-works/pi/issues/2870) — Follow XDG Base Directory (CLOSED, 25 comments, 👍70)**
   Highest-reacted issue in this batch. Linux users pushed back hard on Pi cluttering `$HOME`. Now closed — a meaningful polish win for Linux packaging.

3. **[#8834](https://github.com/earendil-works/pi/issues/8834) — Opt-in `pi.namespace` for skills and prompt templates (CLOSED)**
   Proposes a unified `<namespace>:<name>` resolution surface. Closed as `no-action` today, but the design discussion will likely resurface as the extension ecosystem grows.

4. **[#10470](https://github.com/earendil-works/pi/issues/10470) — RPC emits `session_start` twice on new/switch/fork/clone (OPEN)**
   Duplicate lifecycle events break extension authors writing idempotent handlers. AI-drafted but human-verified; clean repro.

5. **[#11221](https://github.com/earendil-works/pi/issues/11221) — Pi doesn't pick up refreshed AWS credentials in long sessions (OPEN)**
   Bedrock users hit `ExpiredTokenException` after hours. Affects anyone running long agent sessions against AWS — a real enterprise blocker.

6. **[#11335](https://github.com/earendil-works/pi/issues/11335) — MCP HTTP JSON responses bypass `maxMessageBytes` (OPEN)**
   Clear inconsistency: SSE enforces the limit, JSON doesn't. Leads to unexpected large payloads being accepted. Security/robustness relevant.

7. **[#11416](https://github.com/earendil-works/pi/issues/11416) — Bedrock fails when tools have >16 optional params (OPEN, prio:p0)**
   Hard schema constraint from Bedrock. `prio:p0` signals maintainer urgency. Impacts MCP-heavy or tool-rich configurations.

8. **[#11383](https://github.com/earendil-works/pi/issues/11383) — ANSI paste corruption + bracketed paste wedges editor (OPEN, 👍1)**
   Pasting terminal output leaves escape-sequence corpses; unterminated bracketed paste bricks the editor including Ctrl+C. Nasty UX bug in `pi-tui`.

9. **[#11451](https://github.com/earendil-works/pi/issues/11451) — Resume restores stale thinking level after `/tree` navigation (OPEN)**
   Session-state integrity issue: live level vs. resumed level diverge after rewinds. Confusing and hard to debug.

10. **[#11417](https://github.com/earendil-works/pi/issues/11417) — Session JSONL files created world-readable (0644) on shared machines (CLOSED)**
    A concise security-hygiene concern: session transcripts are sensitive and shouldn't be readable by other users. Closed quickly.

Honorable mentions: [#10259](https://github.com/earendil-works/pi/issues/10259) (public tool-presentation API), [#11342](https://github.com/earendil-works/pi/issues/11342) (env watch IN_IGNORED under Docker Desktop), [#10754](https://github.com/earendil-works/pi/issues/10754) (abort-signal-pinning tools).

## 4. Key PR Progress

1. **[#11435](https://github.com/earendil-works/pi/pull/11435) — Bump `undici` to 8.12.3 (CLOSED)**
   Fixes multiple published advisories (GHSA-xjj6-f33q-929c, GHSA-4qv8-2p9j-2685, GHSA-f72v-6w45-q472). Every published version through 1.4.0 is affected — this deserves a prompt patch release.

2. **[#11437](https://github.com/earendil-works/pi/pull/11437) & [#11440](https://github.com/earendil-works/pi/pull/11440) — Rank exact tool name matches first in `tool_search`**
   Two competing/coordinated fixes for `Bm25Ranker` length-normalization hiding exact matches. Closes #11331. Directly improves MCP tool discovery.

3. **[#11436](https://github.com/earendil-works/pi/pull/11436) — Skip custom-message runs in `prompt-url-widget`**
   Fixes the `Cannot read properties of undefined (reading 'match')` crash when `pi.sendMessage(..., { triggerTurn: true })` starts a run. Closes #11366.

4. **[#11427](https://github.com/earendil-works/pi/pull/11427) — Preserve cancellation ownership and close lifecycle in MCP**
   Makes `McpClient.close()` race-safe, guards late init, preserves inbound cancellation controllers. Addresses #11430's disposer-failure concern.

5. **[#11445](https://github.com/earendil-works/pi/pull/11445) — Preserve thinking level in branch summaries**
   Fixes #11444: branch summaries dropped the thinking level, breaking providers that require reasoning config. Complements #11451's stale-level bug.

6. **[#11441](https://github.com/earendil-works/pi/pull/11441) — Support `colorFn` overrides in `BranchSummaryStatusIndicator`**
   Follow-up to the compaction status indicator work (#10810 / #10809). Small but consistent TUI polish.

7. **[#11438](https://github.com/earendil-works/pi/pull/11438) — Parallelize CI test jobs, drop unused apt packages**
   Cuts `build-check-test` from 8–11 min to something leaner by parallelizing coding-agent and durable suites. Developer-velocity win.

8. **[#11411](https://github.com/earendil-works/pi/pull/11411) — Keep iTerm2 inline images in fullscreen**
   Restores image rendering in alt-screen mode; tool results were falling back to `[Image: ...]` text. Nice fix for iTerm2 users.

9. **[#11422](https://github.com/earendil-works/pi/pull/11422) — Correct Kitty function key decoding (OPEN)**
   Fixes F1–F12 with modifiers, repeat and release events; stops Kitty private-use keycodes leaking as text. Fixes #11345.

10. **[#5262](https://github.com/earendil-works/pi/pull/5262) — Add Anthropic Vertex provider (OPEN, long-running)**
    Adds a built-in `anthropic-vertex` adapter for Claude on Google Cloud Vertex AI. Still open since May — enterprises on GCP will be watching.

Also notable: [#11434](https://github.com/earendil-works/pi/pull/11434) (OpenCode protocol-specific endpoints, closes #11132) and [#10718](https://github.com/earendil-works/pi/pull/10718) (`--export` HTML now includes the system prompt).

## 5. Hot Discussions

**Show and tell**
- **[#11418](https://github.com/earendil-works/pi/discussions/11418) — A thank-you offer: free multi-agent PR reviews for pi**
  The author of `wrok.in` (whose Hunter agent is built on pi) offers their multi-agent review service as an open-source contribution back to the repo. Reflects growing downstream adoption and goodwill — worth a maintainer response.

*(Only one discussion updated in the last 24h; grouped above.)*

## 6. Feature Request Trends

- **Windows as a first-class target.** #7547 is the loudest signal — the community wants a clear, opinionated story on WSL vs. native, plus focused bug-fixing in the chosen path.
- **Extension/UI customization surfaces.** Repeated asks for a public tool-presentation API (#10259), assistant message transformers (#11450), `user_bash_complete` events (#8530), `pi.namespace` for skill/template scoping (#8834), and OSC 7501 blocked status for inline custom dialogs (#11428). Extension authors want more hooks, not fewer.
- **Provider namespace parity.** Requests for a native Anthropic Vertex provider (#5262) and protocol-specific OpenCode endpoints (#11132/#11434) — users want Pi to speak each provider's documented path rather than a shared base.
- **Smarter tool discovery.** Ensuring `tool_search` ranks exact names ahead of fuzzy neighbors (#11331) is really a feature ask for more predictable MCP tooling.

## 7. Developer Pain Points

- **Windows path and shell handling remain fragile.** #7547 (huge thread) and #6817 (`src/**/*.spec.ts` glob returns nothing on Windows) both point to the `find.ts` path-normalization logic being a recurring source of friction.
- **Long-running session state drifts.** AWS credential refresh (#11221), stale thinking level after `/tree` (#11451), and branch-summary thinking levels (#11445) all describe the same class of problem: session-serialized state not matching live state.
- **Lifecycle and cancellation rigor.** Duplicate `session_start` emissions (#10470), abort-signal-ignoring tools that pin runs forever (#10754), and non-race-safe MCP close paths (#11430/#11427) suggest webhook/lifecycle semantics need hardening.
- **TUI input edge cases.** ANSI paste corruption (#11383), Kitty function keys (#11422), iTerm2 fullscreen images (#11411), and "weird characters pre-loaded in the prompt" (#10442) show `pi-tui` is where UX polish compounds.
- **Security hygiene.** World-readable session JSONL (#11417) and the unpatched `undici` pin (#11413/#11435) both point to a need for a routine dependency and permissions audit before the next release.
- **Provider-specific schema limits.** Bedrock's >16 optional-parameter failure (#11416, `prio:p0`) is a reminder that tool-heavy configs need per-provider validation rather than a one-size schema.

---

*Generated 2026-10-27 from github.com/earendil-works/pi activity in the prior 24 hours.*

</details>

<details>
<summary><strong>Qwen Code</strong> — <a href="https://github.com/QwenLM/qwen-code">QwenLM/qwen-code</a></summary>

# Qwen Code Community Digest — 2026-10-27

## 1. Today's Highlights

Qwen Code shipped three releases in the last 24 hours, headlined by `v0.26.2-preview.0`, which introduces **session permission rules and Auto approval** in managed mode (PR #15448) alongside CLI token-resolution hardening. Meanwhile, the community is actively flagging **headless `-p` permission-mode bugs**: managed auto-memory can never write in non-interactive default/Auto mode (#15597), and read-only shell commands using fd duplication (`2>&1`) are wrongly denied as "write" operations (#15600). CI stability remains a recurring theme, with multiple main-branch failures tracked (e.g., #14724 with 64 comments) and the Kubernetes runtime tracking issue #13395 reporting two S1 native regressions now passing.

## 2. Releases

Three releases landed in the last 24h:

- **`v0.26.2-preview.0`** — Preview release
  - `feat(managed)`: session permission rules + Auto approval (#15448)
  - `fix(cli)`: harden serve token resolution
- **`v0.26.1-nightly.20261026.34769f9d41`** — Nightly carrying the same managed session permission / Auto approval feature and CLI token fix.
- **`sdk-typescript-v0.1.23`** — TypeScript SDK release bundling CLI `0.26.1` (built from the same ref as the SDK). Note: the release notes reference both `0.26.1` and `0.26.0` as bundled CLI versions, suggesting a documentation duplication worth a maintainer review.

## 3. Hot Issues

1. **#14724 — Main CI failed: Managed Agent gate (64 comments)** — Long-running CI failure tracker; the highest-activity thread in the repo, signaling maintenance strain on the CI gate.
   https://github.com/QwenLM/qwen-code/issues/14724

2. **#15597 — Headless `-p` managed auto-memory can never save (P1)** — In non-interactive default/Auto mode, the implicit edit/write_file deny overrides the memory agent's scoped allow, so memory silently fails while still billing tokens (P1, 7 comments).
   https://github.com/QwenLM/qwen-code/issues/15597

3. **#15600 — Headless `-p` refuses read-only commands using `2>&1` (P2)** — The safety parser treats fd duplication as a write to a file named `&1`, blocking common read-only shell patterns. High developer friction for scripting/automation.
   https://github.com/QwenLM/qwen-code/issues/15600

4. **#13395 — Kubernetes tool runtime progress & cross-platform gate (P2, 25 comments)** — Tracking issue for platform distribution; maintainers report two S1 native regressions passing but keep the issue OPEN due to a remaining SDK CI gate gap.
   https://github.com/QwenLM/qwen-code/issues/13395

5. **#1379 — "Stop adding Co-authored-by: Qwen-Coder" (CLOSED, 7 comments)** — Long-standing community complaint about commit attribution. Now closed, but it remains a signal about default commit-message behavior.
   https://github.com/QwenLM/qwen-code/issues/1379

6. **#15526 — Warn-mode loop reminder fires once, then a 59-call identical loop runs unguarded (P2)** — Real-world autonomous session with a local model issued 70 byte-identical `read_file` calls; loop guard did not intervene. Directly impacts reliability for long autonomous tasks.
   https://github.com/QwenLM/qwen-code/issues/15526

7. **#15686 — Active Goal holds ordinary user input until the Goal leaves active state (P2)** — Enter-steered and pasted messages are queued instead of delivered at the next safe sampling boundary, undermining the documented steering behavior.
   https://github.com/QwenLM/qwen-code/issues/15686

8. **#15675 — `sed` edit simulation differs from real sed (P1)** — The in-process `sed` simulator omits `s`/`u` flags, so `.` doesn't match `\r` or whole emoji, causing behavior divergence from real `sed`. Potential correctness issue for edits.
   https://github.com/QwenLM/qwen-code/issues/15675

9. **#15660 — Subagents start with unexpectedly large context (P2)** — Parent at ~42k context but subagent sessions report ~105k prompts, growing each spawn. Significant cost/latency concern for multi-agent workflows.
   https://github.com/QwenLM/qwen-code/issues/15660

10. **#15470 — main-push failures file no issues; reporter dropped as superseded (P2)** — Ten main-push failures produced zero issues in a 3.5-hour window, indicating the CI→issue reporter is unreliable, which slows triage.
    https://github.com/QwenLM/qwen-code/issues/15470

## 4. Key PR Progress

1. **#15448 — `feat(managed)`: session permission rules and Auto approval** (merged into the releases above) — Adds per-session permission rules and Auto approval mode, the headline feature in `v0.26.2-preview.0`.
   https://github.com/QwenLM/qwen-code/pull/15448

2. **#15492 — `feat(managed)`: experimental Kubernetes deployment** — One-command Helm install for the signed Managed Agent control plane with co-located Hosted Harness and persistent MySQL; optional trusted single-node LOCAL execution.
   https://github.com/QwenLM/qwen-code/pull/15492

3. **#15668 — `feat(web-shell)`: show/stop `/autofix-pr` watches** — Final part of the `/autofix-pr` usability series (#15510, #15548, #15578); surfaces watches in Web Shell with stop controls.
   https://github.com/QwenLM/qwen-code/pull/15668

4. **#15625 — `feat(cli)`: bind the PR named by `/verify-pr`** — Sessions running `/verify-pr <n>` now carry the PR badge, matching `/review <n>`, unifying the PR-binding grammar.
   https://github.com/QwenLM/qwen-code/pull/15625

5. **#15663 — `feat(web-shell)`: configurable simple composer** — Opt-in compact input sharing editor/attachments/session actions across panes; existing hosts keep the current composer by default.
   https://github.com/QwenLM/qwen-code/pull/15663

6. **#13428 — `feat(cli)`: deliver cross-session messages at tool-round boundaries (opt-in)** — Lets accepted cross-session messages reach the model between tool rounds rather than waiting for idle; each message gets its own terminal line.
   https://github.com/QwenLM/qwen-code/pull/13428

7. **#12513 — `feat(serve)`: batch workspace session live-state snapshots** — One read-only request for 1–20 workspaces, each retaining canonical identity and independent success/error results.
   https://github.com/QwenLM/qwen-code/pull/12513

8. **#15466 — `feat(serve)`: user-scope Skill activation routes** — Adds `PUT /skills/:name/activation` and batch activation (up to 100) at user scope, mirroring extension activation.
   https://github.com/QwenLM/qwen-code/pull/15466

9. **#14348 — `feat(channels)`: expose adapter tools to agent sessions + QQ recall tool** — Lets channel adapters publish tools to their agent sessions, with the QQ moderation surface as first consumer.
   https://github.com/QwenLM/qwen-code/pull/14348

10. **#15570 — `ci`: split required Linux test lanes (CLOSED)** — Main lane runs CLI/core at full Vitest cap; side lane runs everything else. Reflects ongoing CI throughput tuning.
    https://github.com/QwenLM/qwen-code/pull/15570

## 5. Hot Discussions

No Discussions data was provided in the source. This section is omitted.

## 6. Feature Request Trends

- **Agent collaboration & multi-agent rosters** — User-level (global) agents and squads available across every trusted workspace (#15682), continuing the multi-agent roadmap.
- **Mod runtime with Claude Code compatibility** — A staged Claude Code-style Mod runtime with `register`/`on` contract (#13749) is the most-commented feature request, signaling demand for ecosystem portability.
- **Platform integrations** — Microsoft Teams channel extension (#15618), QQ proactive-loop delivery semantics (#15631), and configurable web-search trusted hosts (#15299) show growing channel/enterprise integration appetite.
- **Web Shell UX** — Keyboard shortcuts for Session Overview / Split View (#13175), inline rename pre-selecting existing names (#15629), and pinned-turn prompt headers (#15683).
- **Runtime/execution platform** — External Hosted Workspace profiles on externally provisioned workers (#15512) and continued Kubernetes distribution work (#13395).

## 7. Developer Pain Points

- **Headless/`-p` permission-mode correctness** — Multiple P1/P2 bugs (#15597, #15600) show that default/Auto approval in non-interactive mode produces false denies and silent no-ops, especially around `write_file`/`edit` and shell parsing.
- **CI reliability and main-branch noise** — Repeated CI failures (#14724, #15173, #14104, #13009, #14796), a broken CI→issue reporter (#15470), and flaky self-hosted Java/installed-distribution lanes (#15274/#15275/#15286, #15677) dominate maintainer attention.
- **Subagent context bloat** — Subagents starting with ~105k prompts (#15660) constitute an unclear cost/latency sink.
- **Loop/steering guardrails** — Unguarded 59-call loops in warn mode (#15526) and Active Goal holding user input (#15686) undermine autonomous-task trust.
- **Tool simulation fidelity** — `sed` simulation divergence (#15675) highlights risk in the in-process edit path.
- **Config/path clarity** — Setting descriptions still hardcode `~/.qwen` even when a different global directory is used (#15628).
- **Token/context management** — Cross-cutting concern visible across memory (#15597), subagent context (#15660), and token-management scoped issues.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*