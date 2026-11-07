# AI CLI Tools Community Digest 2026-11-07

> Generated: 2026-11-07 00:50 UTC | Tools covered: 7

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

# Cross-Tool Comparison Report — AI CLI Developer Tools Ecosystem
**Date: 2026-11-07 | Coverage: 7 tools (Claude Code, OpenAI Codex, Gemini CLI, GitHub Copilot CLI, OpenCode, Pi, Qwen Code)**

---

## 1. Ecosystem Overview

The AI CLI tool category has matured into a seven-way race where differentiation is shifting from raw model access to **agent runtime reliability, orchestration, and governance**. Across every community today, the dominant signal is no longer "add capabilities" but "make existing capabilities trustworthy": subagent lifecycle correctness, compaction/context integrity, permission semantics, and process/resource hygiene dominate the hot-issue lists. Release cadences remain aggressive (three of seven tools shipped stable builds today), but maturity is uneven — several tools are converging on the same architectural concepts (multi-agent orchestration, MCP connection pooling, skills/plugins portability) while differentiating on safety posture and target audience. A notable cross-cutting trend is **ecosystem interoperability**: communities are independently proposing shared standards for skills, plugins, and cross-agent config (Agent Plugins standard, cross-tool skill catalogs, Tessera-style runners), suggesting the next competitive axis will be portability rather than lock-in.

---

## 2. Activity Comparison

> **Note:** Claude Code, OpenAI Codex, Gemini CLI, GitHub Copilot CLI, OpenCode, and Qwen Code all expose Issues and PRs via GitHub. Per the source digests, no Discussion data was provided for Claude Code, Gemini CLI, Copilot CLI, OpenCode, or Qwen Code; those are marked **N/A** (not "inactive"). Pi is the only tool with visible Discussion activity in this window.

| Tool | Hot Issues (reported) | PRs Active (24h) | Discussions | Release Status (24h) |
|---|---|---|---|---|
| **Claude Code** | 10 (top issue: 689 👍, 98 comments) | 1 (transparency PR, closed) | N/A | **v2.1.319** stable (security-hardening) |
| **OpenAI Codex** | 10 (top: 79 comments; #30408 at 23 👍) | 10+ substantive (+ Guardian series #59993–#60002) | **Yes** — 3 Q&A + 7 Show-and-tell | **rust-v0.167.0** stable + **v0.169.0-alpha.2** |
| **Gemini CLI** | 10 (top: #22323, 13 comments; #21409 at 8 👍) | 10 (+4 honorable mentions), mostly closed fixes | N/A | **No release** |
| **GitHub Copilot CLI** | 10 (top: #1972 at 48 👍) | 1 (docs/i18n) | N/A | **v1.0.108-0** + 1.0.107/1.0.106 notes |
| **OpenCode** | 10 (+4 notable; #59387 at **315 comments**, #27110 at **42 👍**) | 10+ (Code Mode VM cluster) | N/A | **v2.2.6** stable |
| **Pi** | 10 (top: #10605, 13 comments; P0 #11869) | 10 (mostly closed fixes) | **Yes** — 1 Q&A + 1 Show-and-tell | **No release** |
| **Qwen Code** | 10 (top: #14724 at **217 comments** — CI bot noise) | 10 (refactor/feat heavy) | N/A | **v0.26.9** stable + nightly |

**Caveats on comparability:** Comment counts are not normalized for bot activity (Qwen Code's #14724 is CI-bot meta-churn; OpenCode's #59387 is a consolidated megathread), and 👍 counts reflect repo scale differences. Treat row-level counts as directional, not absolute.

---

## 3. Shared Feature Directions

Requirements appearing independently across multiple communities:

| Direction | Tools | Specific Needs |
|---|---|---|
| **Multi-agent orchestration & subagent correctness** | Codex, Gemini CLI, OpenCode, Claude Code, Pi, Qwen Code | Codex: Guardian reviewer pipeline + `multi_agent_v2`; Gemini: generalist-agent hangs (#21409), false success reporting (#22323); OpenCode: parallel subagent caps (#27110, 42 👍), premature `completed` status (#48826); Claude Code: subagent transcript/180s interruption issues |
| **Context/compaction integrity** | OpenCode, Claude Code, Qwen Code, Copilot CLI, Pi | OpenCode loses top-level tools post-compact (#51949); Qwen Code quadratic transcript growth (#13113) + compaction escalation (#16418); Copilot CLI: model-judged pruning proposal (#5362) + MCP schema loss (#5367); Pi: per-conversation compaction policy (#11771) |
| **Permission & approval governance** | Copilot CLI, OpenCode, Qwen Code, Gemini CLI, Claude Code | Command-identifier allowlists with spaces (#4150); opt-out of persistent "Allow always" (#62432); headless auto-memory deny overrides (#15597); destructive git-op guardrails (#22672); fine-grained tool gating at thread start (Codex Q&A #57025) |
| **MCP lifecycle & resource management** | Codex, Copilot CLI, OpenCode, Claude Code | Codex: per-thread process leaks, 9–37 GB RSS (#30408/#12491); Copilot: OAuth token expiry with stale `mcp.list` status (#5366), schema loss (#5367); OpenCode: OAuth dialog mid-flow close, lost session IDs (#59640); Claude Code: `tools/list` discarded as errors (#107111) |
| **Cross-agent skills/plugin portability** | Codex, OpenCode, Pi | Agent Plugins standard (#40993, 21 👍); Tessera cross-CLI runner (#59896); cross-tool skill catalogs (#59844, Pi #11870) |
| **Quota/usage visibility & metering trust** | Codex, OpenCode, Claude Code | Taskbar quota tool (#58359); 50% limit-reduction reports (#59594); free-tier opacity megathread (#59387); $10 depleted in 15 min (#107558) |
| **Streaming/protocol resilience** | Pi, Gemini CLI, Claude Code | OpenAI-compatible tool-call streaming contract violations (#11881/#11891/#11882); ACP mid-stream retry corruption (#30165); >5-min request timeouts (#107232) |
| **Cross-platform parity (Windows/macOS/Linux)** | Codex, Copilot CLI, Claude Code, Pi, Qwen Code, Gemini CLI | Windows Computer Use (#51524), Windows project loss (#42739); Entra token caches (#5236); macOS auth verification (#103788); Windows shutdown handlers (#11889); Windows shell-awareness (#15310); Wayland browser failures (#21983) |
| **Safety false-positive reduction** | Claude Code, Codex, Gemini CLI | Opus 5.5 safeguard regressions (#108048, #108067); blocked authorized local dev (#56475); semantic vs. keyword moderation request (#91579); region blocklists (naver #95539, VK #59738) |

---

## 4. Differentiation Analysis

**Feature focus by tool:**

- **Claude Code** — Enterprise auditability and privacy-first. Today's headline (User-Agent email leak, #107757, 689 👍) and the maintainers' response (open-sourcing the `privacy` mod, #107768) plus the v2.1.319 hardening (no classifier fallback behind gateways) reveal a deliberate posture: **verifiability over convenience** in restricted environments. The Opus 5.5 safeguard false-positive cluster is its principal capability/filtering tension.
- **OpenAI Codex** — **Orchestration depth and automation maturity**. The Guardian evidence/reviewer pipeline, agent command center, cross-backend session switching, and a visibly automated contribution pipeline (`copyberry[bot]`) indicate an industrial-scale, platform-integrated direction. Its pain profile (process leaks, quota lockouts, Windows regressions) is that of a product scaling faster than its lifecycle management.
- **Gemini CLI** — **Agent-layer correctness and evaluation rigor**. The day's activity is almost entirely stability fixes (PTY FD leaks, timeout handling, retry corruption, heap OOM bundling), reflecting a team investing in the runtime substrate (sandboxing architecture #19873, AST-aware tooling EPIC #22745–#22747). Browser subagent is its weakest surface.
- **GitHub Copilot CLI** — **IDE/GitHub ecosystem integration and enterprise identity**. Highlights are Windows sandbox grants, shared `tgrep` indexing, `/code` VS Code bridging, Fusion tier config. Its pain is distinctly enterprise-auth-shaped (Entra broker token caches, MCP OAuth expiry) and input-ergonomics-shaped (IME/Shift+Enter, a years-long CJK demand at 48 👍).
- **OpenCode** — **Open/provider-neutral and community-governed**. Shared MCP connection pooling, Code Mode VM durability semantics, multi-provider model plumbing, and the loudest free-tier community in the set (315-comment megathread). Targets users running local/Ollama models and multi-vendor setups — hence top ask #27110 (parallel subagent cap for VRAM-constrained inference).
- **Pi** — **SDK/embedded-agent builder focus**. The P0 `StringEnum` typing regression (#11869) and `Harness.close()` session leaks (#11676) directly affect SDK consumers; streaming-protocol fixes target vLLM/LiteLLM/self-hosted stacks. Accessibility (#1188, closed) and codemode safety (#11858: 24,018 repeated tool calls) round out a developer-library identity.
- **Qwen Code** — **Skill lifecycle and managed-agent infrastructure**. v0.26.9's ZIP uploads, daemon APIs, TS SDK, bulk activation, and the managed-agent execution-diagnostics PR (#16498) show investment in organizational skill distribution. Its signal is degraded by CI-bot noise drowning the tracker.

**Target users:** Claude Code (regulated/enterprise), Codex (platform teams, multi-surface), Copilot CLI (GitHub-centric enterprise devs), Gemini CLI (Google-stack + Linux power users), OpenCode (open-source/local-model hobbyists-to-prosumers), Pi (agent builders/SDK consumers), Qwen Code (APAC/enterprise skill governance).

**Technical approaches:** Claude Code leans on mod-level enforcement and server-verified auto mode; Codex on structured reviewer pipelines and SQLite-backed session state; Gemini on OS-sandbox + AST tooling and fail-fast messaging; OpenCode on a VM-based Code Mode with durability primitives; Pi on protocol-conformance breadth; Qwen Code on daemon/SDK skill infrastructure.

---

## 5. Community Momentum & Maturity

**Momentum ranking (directionally, from engagement intensity):**

1. **OpenCode** — Highest raw engagement in the set (315-comment megathread, 42-👍 feature). Free-tier controversy is a double-edged signal: extreme community investment, partially negative sentiment. Shipping stable (v2.2.6) while absorbing V2 regressions.
2. **OpenAI Codex** — Broadest simultaneous activity: stable + alpha releases, 10+ substantive PRs, active Discussions (7 show-and-tell posts). Automated contribution pipeline suggests enormous throughput. Sustained multi-week issues (60–79 comments) show durable user investment.
3. **Qwen Code** — High issue volume but **low signal quality** (CI-bot meta-issues dominate; stale PR backlog since September). Shipping steadily (v0.26.9 + nightly) with competent refactor PRs — iteration is real, but community observability is impaired.
4. **Claude Code** — Sharp, focused engagement (one 689-👍 privacy issue outweighs most repos' entire day). Low PR surface, high trust scrutiny. Mature release discipline (security-hardening patch).
5. **Gemini CLI** — Strong fix velocity (14 PRs, many closed same-day) but no release; issue engagement middling (top 👍 = 8). Agent-layer bugs are the bottleneck.
6. **GitHub Copilot CLI** — Steady cadence (three versions in three days) but thinnest PR community (one docs PR) — consistent with a more closed, vendor-driven contribution model. Auth regressions are the reputational risk.
7. **Pi** — Highest ratio of "fix-available" closures to open issues — an unusually responsive maintainer posture. No release today; a P0 typing regression is the watch item.

**Maturity assessment:** Claude Code and Copilot CLI show **process maturity** (security hardening, ecosystem integration). Codex and Gemini CLI show **infrastructure maturity** (orchestration pipelines, sandboxing, eval/telemetry — though Gemini's own team flags eval trust gaps). OpenCode, Pi, and Qwen Code are **rapidly iterating but regression-prone** — classic velocity-over-stability tradeoffs in young runtimes.

---

## 6. Trend Signals

**For technical decision-makers and developers, in priority order:**

1. **Agent runtime reliability is the new battleground.** Subagent false-success reporting (Gemini #22323), premature completion (OpenCode #48826), and compaction-induced capability loss (OpenCode #51949, Claude Code #107979) are *silent* failures — the most dangerous class for automated pipelines. Buyers should require observability into subagent termination reasons and tool-availability states before deploying autonomous workflows.

2. **Process and memory lifecycle is an unsolved systemic gap.** Codex's three separate MCP leak clusters (9 GB → 37 GB → zombies) and Pi's `Harness.close()` leaks are the clearest evidence that MCP-based architectures need reaping guarantees. Expect "MCP connection pooling" (OpenCode v2.2.6, Codex lifecycle fixes) to become table stakes.

3. **Permission models are converging on declarative, thread-scoped gating** — but implementations still leak (space-in-identifier allowlists, "Allow always" overrides, headless deny paths). Governance buyers should treat permission semantics as a procurement criterion, not a checkbox.

4. **Enterprise identity friction (Entra brokers, OAuth token caches) is a deployment blocker**, especially on Windows/macOS — Copilot CLI's cluster and Claude Code's browser-verification failures (#103788) suggest auth flows designed for consumer cadence struggling under enterprise session management.

5. **Skill/context token economics matter.** The convergence of compaction policy requests, context-pruning proposals (#5362), and per-namespace catalog budgets (OpenCode #62176) shows users are optimizing the **cost per turn**, not just capability. Metering surprise reports (Claude Code #107558, Codex quota threads) compound this.

6. **Safety filtering is over-triggering on legitimate work.** Opus 5.5's documented regression vs. Opus 4.8 (#108048, bisected) and Codex/Gemini's opaque blocks signal that keyword-based moderation is now a productivity tax. Semantic moderation (#91579) is the likely resolution path.

7. **Interoperability standards are emerging bottom-up.** Agent Plugins (#40993), cross-CLI runners (Tessera), and cross-tool skill catalogs (Pi #11870, Codex #59844) are community-led — a signal that buyers should favor tools embracing portable skills/MCP configs, as vendor lock-in is being actively contested by users.

8. **Bot/automation noise degrades community signal quality.** Qwen Code's CI churn and the `copyberry[bot]` authorship note in Codex's digest are early indicators of a new problem: as AI-assisted development scales, repositories need better triage hygiene for decision-makers to trust community metrics.

---

*Report compiled from 2026-11-07 community digests for github.com/anthropics/claude-code, openai/codex, google-gemini/gemini-cli, github/copilot-cli, anomalyco/opencode, earendil-works/pi, and QwenLM/qwen-code. Metrics are as-reported; comment/👍 counts are not normalized for repo scale or bot activity.*

---

## Per-Tool Reports

<details>
<summary><strong>Claude Code</strong> — <a href="https://github.com/anthropics/claude-code">anthropics/claude-code</a></summary>

## Claude Code Skills Highlights

> Source: [anthropics/skills](https://github.com/anthropics/skills)

# Claude Code Skills Community Highlights Report
*Data as of 2026-11-07 | Source: github.com/anthropics/skills*

---

## 1. Top Skills Ranking (Most-Discussed PRs)

> Note: The provided dataset lists `Comments: undefined` for all PRs, so ranking here is based on **update recency + revision depth + linked issue activity**. Community discussion volume is more reliably reflected in the Issues section below.

| Rank | Skill / PR | Functionality | Discussion Highlights | Status |
|------|-----------|---------------|----------------------|--------|
| 1 | **mcp-builder fix** — [#1742](https://github.com/anthropics/skills/pull/1742) | Adapts MCP connection scripts to `mcp>=2.0.0` API rename (`streamablehttp_client` → `streamable_http_client`) and custom header handling | High-impact fix; addresses broken import path in official MCP builder; linked to #1668 | OPEN |
| 2 | **skill-creator trigger eval isolation** — [#1298](https://github.com/anthropics/skills/pull/1298) | Fixes false misses/invalid scores in trigger evaluation; Windows `select()` pipe failure; runtime failure handling | Cross-platform correctness for the meta-skill that generates all other skills | OPEN |
| 3 | **webapp-testing `shell=True` removal** — [#1980](https://github.com/anthropics/skills/pull/1980) | Eliminates CWE-78 command injection in `with_server.py` | Security-hardening of a widely-used testing skill | OPEN |
| 4 | **docx timeout/output verification** — [#1792](https://github.com/anthropics/skills/pull/1792) | Reports LibreOffice timeout as error; verifies revision marks actually removed | Reliability fix for document pipeline | OPEN |
| 5 | **notion-spec-to-implementation + quantitative-resume-auditor** — [#1245](https://github.com/anthropics/skills/pull/1245) | Converts specs into Notion implementation tasks; audits resumes quantitatively | Multi-skill submission; long-lived (Jun–Oct) review cycle | OPEN |
| 6 | **xlsx external link resolution** — [#2019](https://github.com/anthropics/skills/pull/2019) | Resolves worksheet-scoped defined names/aliases in `external_links_at_risk` | Fixes false negatives in spreadsheet recalculation; linked to #2013 | OPEN |
| 7 | **pyxel retro game dev** — [#525](https://github.com/anthropics/skills/pull/525) | Create/debug/verify retro Python games with headless input-driven runs | One of the longest-running open PRs (Mar–Nov); niche but persistent | OPEN |
| 8 | **document-typography** — [#514](https://github.com/anthropics/skills/pull/514) | Prevents orphan/widow wrapping and numbering misalignment in generated docs | Broadly applicable quality-of-life skill | OPEN |

---

## 2. Community Demand Trends (from Issues)

Distilled from the highest-comment Issues:

- **Trust & Security Boundaries** — [#492](https://github.com/anthropics/skills/issues/492) (46 comments, top issue): Community skills distributed under the `anthropic/` namespace impersonate official skills, creating a permission-escalation trust vulnerability.
- **Org-Wide Skill Sharing** — [#228](https://github.com/anthropics/skills/issues/228) (17 👍 8): Users want a shared skill library/link instead of manual `.skill` file distribution via Slack/Teams.
- **Evaluation Harness Reliability** — [#556](https://github.com/anthropics/skills/issues/556) (13 comments, 7 👍): `run_eval.py` yields 0% trigger rate — the skill-testing loop itself is broken.
- **Context Economy / Token Budgets** — [#1487](https://github.com/anthropics/skills/issues/1487): `claude-api` skill eagerly injects ~156k tokens, exhausting context in one call. Related: [#1329](https://github.com/anthropics/skills/issues/1329) proposes symbolic `compact-memory` notation.
- **Skill Authoring Best Practices** — [#202](https://github.com/anthropics/skills/issues/202) (CLOSED): `skill-creator` reads like docs, not operational instructions — token inefficiency.
- **Reasoning/Quality Governance** — [#1385](https://github.com/anthropics/skills/issues/1385): Proposal for pre-task calibration → adversarial review → delivery verification pipeline.
- **Plugin/Distribution Hygiene** — [#189](https://github.com/anthropics/skills/issues/189) (9 👍): `document-skills` and `example-skills` install identical content, causing duplicate skills.
- **Skill Discovery Semantics** — [#2064](https://github.com/anthropics/skills/issues/2064): `theme-factory` description says *what* but not *when to use* — a recurring authoring anti-pattern.

**Emerging direction:** the community's demand is shifting from "add more skills" toward **infrastructure maturity** — security, sharing, evaluation, and token efficiency.

---

## 3. High-Potential Pending Skills (Active, Not Yet Merged)

| PR | Skill | Why It May Land Soon |
|----|-------|---------------------|
| [#1977](https://github.com/anthropics/skills/pull/1977) | `algorithmic-art` wrapAround fix | Small, correct, fixes #1897 |
| [#1976](https://github.com/anthropics/skills/pull/1976) | webapp-testing textarea/select reporting | Narrow bug fix, fixes #1891 |
| [#1975](https://github.com/anthropics/skills/pull/1975) | pptx `--cols` validation | Early argparse rejection, fixes #1809 |
| [#1997](https://github.com/anthropics/skills/pull/1997) | skill-creator YAML frontmatter parsing | Correctness fix for eval metadata |
| [#1681](https://github.com/anthropics/skills/pull/1681) | skill-creator standalone execution | Fixes `ModuleNotFoundError`; usability |
| [#1730](https://github.com/anthropics/skills/pull/1730) | claude-api dead URL replacement | Verified HTTP 200; trivial merge candidate |
| [#538](https://github.com/anthropics/skills/pull/538) | pdf case-sensitive file refs | 8 mismatches, breaks case-sensitive FS |
| [#1703](https://github.com/anthropics/skills/pull/1703) | `md2video-audio` | Zero-cost Markdown→MP4 with voiceover |
| [#1615](https://github.com/anthropics/skills/pull/1615) | `scnet-hpc` | Slurm/HPC cluster operations via SSH |
| [#1771](https://github.com/anthropics/skills/pull/1771) | `proofcore-contract-auditor` | Smart contract static analysis + TON anchoring |

**Pattern:** A wave of small, surgical bug-fix PRs (mostly by repeat contributor `gerardrecinto`) is queued for merge — these are low-risk and likely to land first.

---

## 4. Skills Ecosystem Insight

> **The community's most concentrated demand is no longer for more Skills, but for a trustworthy, token-efficient, and shareable Skill infrastructure — security boundaries, evaluation correctness, context economy, and org-level distribution now outweigh net-new skill submissions.**

---

*Report generated from anthropics/skills PR and Issue metadata as of 2026-11-07. All links point to github.com/anthropics/skills.*

---

# Claude Code Community Digest — 2026-11-07

*Source: github.com/anthropics/claude-code*

---

## 1. Today's Highlights

The community is dominated by a high-visibility privacy bug (#107757, 689 👍) alleging that Claude Code leaks the user's email in the `User-Agent` header during web searches — a CLOSED PR (#107768) publishing the built-in `privacy` mod source appears to be the maintainers' direct response. A new release (v2.1.319) tightens `auto mode` behavior when telemetry/feature flags are disabled, and a wave of Opus 5.5 safeguard false-positive reports (#108048, #108067) signals growing friction between capability and content filtering.

---

## 2. Releases

**v2.1.319** — [Release notes](https://github.com/anthropics/claude-code/releases)
- Changed `auto mode` behavior when telemetry or feature flags are off (including behind LLM gateways): calls the server cannot verify are now **asked about or denied**, with no fallback to the built-in classifier.
- Escape hatch: set `CLAUDE_CODE_AUTO_MODE_SERVER=0` to retain the built-in classifier.
- Bedrock, Vertex, and Foundry paths are unchanged (unaffected by the server check).

**Takeaway:** This is a security-hardening change that trades convenience for auditability in restricted/gatewayed environments. Enterprises behind LLM proxies should test before rolling out.

---

## 3. Hot Issues

1. **[#107757] Privacy violation in User-Agent header** — [link](https://github.com/anthropics/claude-code/issues/107757) · 98 comments · **689 👍**
   User reports receiving scam emails because their signed-in address is leaked in the `User-Agent` header during web searches. Highest-engagement issue of the day; the linked PR #107768 suggests an official fix is in flight. *This is the headline story.*

2. **[#1757] Claude Code requires users to constantly login** — [link](https://github.com/anthropics/claude-code/issues/1757) · 90 comments · 78 👍
   Open since June 2025 and still active — daily re-auth demands remain a top pain point. Long-lived issue with steady community pressure.

3. **[#10238] Add support for subdirectories in skills** — [link](https://github.com/anthropics/claude-code/issues/10238) · 55 comments · 168 👍
   CLOSED enhancement. Teams want nested skill directories; closure suggests a resolution (shipped or superseded). High 👍 indicates strong demand.

4. **[#91495] Site permissions ignored by built-in browser (Desktop)** — [link](https://github.com/anthropics/claude-code/issues/91495) · 33 comments
   CLOSED. "Allow all websites" settings ignored on Windows/macOS Desktop — a permissions-trust issue now resolved.

5. **[#103788] Desktop (macOS) sign-in fails: "We couldn't verify your browser"** — [link](https://github.com/anthropics/claude-code/issues/103788) · 20 comments
   Both Google and email auth return 400; only an exit-IP change partially helps. Indicates an IP/geo fingerprinting problem in the auth flow.

6. **[#95593] Chat completion notifications silent on desktop** — [link](https://github.com/anthropics/claude-code/issues/95593) · 9 comments
   Notifications work for Code/Cowork but not Chat across Windows + macOS. A regression in a widely-used quality-of-life feature.

7. **[#95539] All naver.com domains blocked by default safety restrictions** — [link](https://github.com/anthropics/claude-code/issues/95539) · 9 👍
   False-positive blocklist hit on South Korea's primary portal. Regional availability concern; daum.net/tistory.com unaffected.

8. **[#107232] Cannot handle API requests >5 minutes long** — [link](https://github.com/anthropics/claude-code/issues/107232) · 7 comments
   Linux/API/networking. Long-running requests still fail — relevant to agent workflows and batch jobs.

9. **[#107979] Long session shows turns as "[cleared]", stripping pasted content/screenshots** — [link](https://github.com/anthropics/claude-code/issues/107979) · 3 comments
   Windows/core/desktop. Model context loses pasted content mid-conversation — a serious data-integrity issue for long sessions.

10. **[#108048] Opus 5.5 `reasoning_extraction` refuses Read of user's own notes file** — [link](https://github.com/anthropics/claude-code/issues/108048)
    Reproducible, bisected to a 30-line block, dependent on user-scope rules files being present. First of a cluster of Opus 5.5 safeguard false-positives (see also #108067). Not observed on Opus 4.8.

---

## 4. Key PR Progress

Only **one PR** was updated in the last 24h:

1. **[#107768] mods: add the privacy mod** (CLOSED) — [link](https://github.com/anthropics/claude-code/pull/107768)
   Publishes the source of Claude Code's built-in `privacy` mod under `mods/privacy`. The mod's job: **refuse a shell call holding the signed-in account's email address and naming a User-Agent**. No new behavior — pure source disclosure/transparency.

   **Why it matters:** This is almost certainly the maintainers' answer to issue #107757. By open-sourcing the mod that enforces privacy at the shell-call layer, Anthropic is signaling that the email-leak behavior is guarded (or now being guarded) at a documented, auditable boundary. Expect the community to scrutinize the manifest and hooks module closely over the next 24–48h to confirm it actually closes the User-Agent leak path.

*Note: With only one PR in the window, the digest's PR section is intentionally short — activity is concentrated on the issue tracker.*

---

## 5. Hot Discussions

*No discussion data was provided for this window. Section omitted.*

---

## 6. Feature Request Trends

Distilled from the issue set:

- **Skills extensibility** — Subdirectory support in skills (#10238, 168 👍, now CLOSED) is the single most-upvoted enhancement. Teams are building nontrivial skill libraries and need structure.
- **Cross-session / cross-environment messaging** — Varlink for cross-session messaging on Linux (#107175, 10 👍) and an `effort` argument for `claude-code-remote` `create_session` (#107292). Developers want agents to orchestrate peer sessions more richly.
- **Connectors everywhere** — Projects (beta): give the coordinator (project chat) access to claude.ai connectors (#107601). Users want parity between cloud threads and coordinator conversations.
- **Finer-grained session control** — `effort` control, cross-marketplace plugin dependencies (#86493), and remote session parameterization.
- **Reduce false-positive safeguards** — Multiple requests (#91579) to move from keyword-based to semantic moderation.

---

## 7. Developer Pain Points

Recurring frustrations across the tracker:

1. **Authentication friction** — Constant re-login (#1757) and opaque browser-verification failures (#103788) are the longest-running and most-commented auth complaints.
2. **Opus 5.5 safeguard false positives** — A fresh, rapidly-growing cluster (#108048, #108067, #91577) where legitimate read/write/cyber tasks are blocked. Users note Opus 4.8 did not behave this way — a model-version regression in practice.
3. **Long-session integrity** — Turns silently "[cleared]" (#107979), subagent transcripts >5 MiB unresumable (#83261), and subagents interrupted at ~180s (#88993). Context and agent state are fragile in long workflows.
4. **Request timeouts** — API requests >5 min still fail (#107232); MCP `tools/list` results discarded as errors (#107111).
5. **Privacy & trust** — The User-Agent email leak (#107757) combined with the `privacy` mod disclosure (#107768) shows the community is now actively auditing what Claude Code sends to third parties.
6. **Desktop regressions** — Sidebar status dots lost (#108019), dictation failures on macOS (#94687) and Windows (#104003), silent completion notifications (#95593), and a system-wide input freeze on Windows (#106746).
7. **Cost/metering surprises** — $10 credit depleted in ~15 min under light use (#107558) — a candidate metering bug.
8. **Platform/regional blocklists** — naver.com falsely blocked (#95539), cyber task false-flags.

---

*Generated for 2026-11-07. Links point to github.com/anthropics/claude-code. Companion to the release notes for v2.1.319.*

</details>

<details>
<summary><strong>OpenAI Codex</strong> — <a href="https://github.com/openai/codex">openai/codex</a></summary>

# OpenAI Codex Community Digest — 2026-11-07

## 1. Today's Highlights

Two releases landed in the last 24h: the stable `rust-v0.167.0` ships an agent command center (`codex agents --no-daemon`) with unread-result markers and cross-backend switching in the session picker, while `rust-v0.169.0-alpha.2` continues the alpha line. The issue tracker remains dominated by long-running Windows project-loss regressions, MCP process/memory leaks, and quota/rate-limit complaints, several of which have accumulated 60+ comments over weeks. PR activity is unusually concentrated: a large batch of `copyberry[bot]` PRs targets TUI input handling, multi-agent guidance, and the new "Guardian" reviewer/evidence pipeline.

## 2. Releases

**rust-v0.167.0** (stable)
- New agent command center: `codex agents --no-daemon`; command center and session picker now mark unread results (#58238, #58239, #58263, #58264).
- Terminal session picker supports switching between connected backends; drafts are preserved when switching (#58280, #58457).
- Link: https://github.com/openai/codex/releases

**rust-v0.169.0-alpha.2**
- Alpha release, no detailed changelog provided.
- Link: https://github.com/openai/codex/releases

## 3. Hot Issues

1. **#42739 — Windows desktop: local projects disappear from sidebar after update** (79 comments, 👍7)
   Still the highest-traffic open bug; the Projects section shows "No projects" while chats/folders are intact. Long-running, unresolved, and now compounded by a same-day duplicate report (#59895). https://github.com/openai/codex/issues/42739

2. **#51524 — Windows Computer Use stops at `get_window_state` (Chrome/Edge)** (72 comments, 👍8)
   Browser automation on Windows breaks at window inspection, blocking click/type steps entirely. High engagement from Windows power users. https://github.com/openai/codex/issues/51524

3. **#30408 — MCP server processes leak per thread (9+ GB RSS)** (69 comments, 👍23)
   The most-upvoted issue in this set: per-conversation MCP processes are never reaped on archive/close. A clear resource-management regression with broad impact. https://github.com/openai/codex/issues/30408

4. **#12491 — Codex.app GUI: 1300+ zombie MCP processes, 37 GB leak** (39 comments, 👍7)
   Older but still active; same root cause family as #30408 and #55141. Strong evidence that process lifecycle management is a systemic gap. https://github.com/openai/codex/issues/12491

5. **#52503 — Web/GitHub: repeated approvals after "Always allow", lost upload results** (23 comments, 👍3)
   Approval state isn't honored, and long-running tool results are dropped. Directly degrades trust in the approval UX for web workflows. https://github.com/openai/codex/issues/52503

6. **#57190 — macOS: browser disabled in existing chat after restart** (14 comments, 👍3)
   Inconsistent per-chat capability state after restart; another instance of state not persisting correctly across sessions. https://github.com/openai/codex/issues/57190

7. **#56682 — VS Code extension fails to initialize UI even in isolated profile** (13 comments, 👍5)
   Extension onboarding is broken for a Windows user despite a clean profile — suggests env/registration issues rather than local config. https://github.com/openai/codex/issues/56682

8. **#42315 — iOS Remote on Windows: custom sections omit Codex projects** (13 comments, 👍6)
   Sync names work but project payloads don't — a cross-surface data-parity bug affecting remote workflows. https://github.com/openai/codex/issues/42315

9. **#32880 — Windows: workspace-write DENY ACL blocks linked worktrees** (12 comments)
   Sandbox ACL regression that silently breaks autonomous Git operations in worktrees. Zero upvotes but steady comments — likely structural, not cosmetic. https://github.com/openai/codex/issues/32880

10. **#45383 — Interrupted sessions waste quota rebuilding context** (6 comments, 👍4)
    Resume behavior re-burns tokens instead of continuing; a cost/efficiency complaint that ties into the quota threads below. https://github.com/openai/codex/issues/45383

## 4. Key PR Progress

1. **#60014 — Honor managed runtime authentication modes** (CLOSED)
   Lets `requirements.toml` pin `features.runtime_agent_instances.mode` to `dual_header` or `assertion_only`, rejecting conflicting explicit settings. https://github.com/openai/codex/pull/60014

2. **#60011 — Adapt multi-agent mode guidance for hosted tools**
   When `multi_agent_v2.disable_native_tools` is set, uses bundled mode policies instead of model catalog guidance. https://github.com/openai/codex/pull/60011

3. **#60009 — Add custom gateway selection to TUI sign-in**
   Opt-in `gateway_setup_wizard` lets users pick a saved custom gateway during local sign-in and restarts the embedded app server with that provider. https://github.com/openai/codex/pull/60009

4. **#60008 — Refactor TUI clipboard and composer input handling**
   Extracts helpers for image paste, paste-burst ticks, restricted draft edits, and threads `ShellPrefixHandling` through text insertion. https://github.com/openai/codex/pull/60008

5. **#60007 — Start cloud threads with the local GitHub project**
   Passes the local project's GitHub origin to cloud prewarming so new cloud threads can provision the correct repo checkout. https://github.com/openai/codex/pull/60007

6. **#60006 — Reduce SQLite write overhead for thread activity and history**
   Updates only timestamps/token totals for usage observations instead of full metadata writes, easing single-writer contention. https://github.com/openai/codex/pull/60006

7. **#60004 — Expose ChatGPT user IDs in `account/read` responses**
   Adds nullable `userId` populated from the authenticated account snapshot. https://github.com/openai/codex/pull/60004

8. **#60003 — Apply runtime authentication to realtime connections**
   Realtime connections now honor the selected credential source and transport policy across creation, retries, and reconnects. https://github.com/openai/codex/pull/60003

9. **#59991 — Preserve app invocation context across MCP tool refreshes**
   Keeps the advertised `_codex_apps.invocation_context` stable when tool metadata refreshes on the same server connection. https://github.com/openai/codex/pull/59991

10. **#59987 — Resolve startup models using thread creation options**
    Replaces `models_manager_for_startup` with `resolve_startup_model`, sharing model resolution across starts and cold-resumes. https://github.com/openai/codex/pull/59987

*(Also notable: the #59993–#60002 Guardian series — fixed read views, evidence retrieval tools, atomic bulk channel subscriptions, and bounded original-evidence delivery — builds out a structured reviewer pipeline.)*

## 5. Hot Discussions

**Q&A**
- **#57025 — Can app-server apply ToolPolicy when starting a thread?** Requests the ability to start a thread with no tools available, referencing `ToolPolicy.allowed_tools`. https://github.com/openai/codex/discussions/57025
- **#59594 — ChatGPT Plus: Codex limits seem cut ~50%** User suspects a link to GPT-6.1 Sol (low) model drift; bilingual post. https://github.com/openai/codex/discussions/59594
- **#57675 — Pro account: 'Selected model is at capacity' on every model for 7 days** Account-level capacity lockout blocking Codex entirely; cross-posted from issue #56324. https://github.com/openai/codex/discussions/57675

**Show and tell**
- **#58849 — code-review-skill: evidence-backed review with a JSON merge gate** Four probes (behavior, tests, rules, audit) run in fresh contexts for auditable findings. https://github.com/openai/codex/discussions/58849
- **#58359 — cct: Codex 5-hour/weekly limits on the Windows taskbar** Open-source, <1 MB tool putting `/status` quota on the Win10/11 taskbar. https://github.com/openai/codex/discussions/58359
- **#59896 — Tessera: run one task across Codex and other agent CLIs** Syncs AGENTS.md/skills/MCP config to each agent's native format and keeps the answer that passes tests. https://github.com/openai/codex/discussions/59896
- **#59316 — ML research skill: frozen experiments, evidence ledgers, resumable review** MIT-licensed skill spanning literature, experiment execution, and writing. https://github.com/openai/codex/discussions/59316
- **#60012 — Zozo Local prerequisite checker** Verifies Node major, OS family, and Git/gh before starting an agent. https://github.com/openai/codex/discussions/60012
- **#59871 — Account Access: scoped account reads and resumable sign-in (preview)** Portable skill + CLI for reviewed connectors and owner-approved reads. https://github.com/openai/codex/discussions/59871
- **#59844 — macOS catalog for skills across Codex, Claude Code and OpenCode** Addresses skill duplication/drift across multiple agents. https://github.com/openai/codex/discussions/59844

## 6. Feature Request Trends

- **Multi-agent orchestration & shared context**: The Guardian PR series (#59993–#60002) and discussions like Tessera (#59896) and cross-agent skill catalogs (#59844) point to demand for coordinating Codex with other agents and syncing skills/config across tools.
- **Tool/capability control at thread start**: Q&A #57025 asks for `ToolPolicy` enforcement per thread — a request for stricter, declarative tool gating before agents act.
- **Cross-surface parity**: Issues #42315 (iOS Remote ↔ Windows projects) and #59386 (macOS full-view sidebar/tab behavior) show demand for consistent navigation and data across desktop, remote, and mobile.
- **Quota visibility & portability**: Taskbar/limit tooling (#58359) and quota complaints (#59594, #57675, #59194) indicate users want clearer, externally inspectable usage data.
- **Terminal notification options**: #58758 requests an `osc777` method for `tui.notification_method` (Windows Terminal toasts).

## 7. Developer Pain Points

- **Process/memory lifecycle is broken**: Three separate issues (#30408, #12491, #55141) describe MCP server processes and threads accumulating unboundedly — hundreds of zombies and tens of GB of RAM. This is the single most-upvoted and most durable complaint cluster.
- **State loss after updates and restarts**: Project sidebar disappearance (#42739, #59895), browser capability reverting per-chat (#57190), and lost approvals/uploads (#52503) all reflect capability and data not surviving app lifecycle events.
- **Windows-specific regressions**: A disproportionate share of high-comment issues are Windows-only — Computer Use (#51524), sandbox ACL blocking Git (#32880), VS Code extension init (#56682), Remote pairing (#56600), and MCP `-32000` failures (#56421).
- **Quota and rate-limit friction**: Users report allowance reductions (#59594), account-level capacity lockouts (#57675), wasted quota on context rebuilds (#45383), and rapid consumption after plan upgrades (#59194).
- **Model instruction-following complaints**: #47953 and #59851 document agents ignoring explicit constraints — an ongoing trust concern for autonomous workflows.
- **Safety-check false positives & opaque blocks**: #56475 (authorized local dev blocked) and #59738 (VK.com blocked with no review path) highlight friction in the safety-review workflow.

---
*Generated from github.com/openai/codex data for 2026-11-07. Note: many recent PRs are authored by `copyberry[bot]`, which suggests an automated contribution pipeline; treat authorship accordingly when assessing merge intent.*

</details>

<details>
<summary><strong>Gemini CLI</strong> — <a href="https://github.com/google-gemini/gemini-cli">google-gemini/gemini-cli</a></summary>

# Gemini CLI Community Digest — 2026-11-07

## 1. Today's Highlights

No new releases landed in the last 24 hours, but activity remains heavily concentrated in the **agent/subagent subsystem** — subagent recovery correctness, browser agent failures, and tool-count limits dominate the top of the issue tracker. On the PR side, a large batch of stability fixes merged or closed today, targeting PTY file-descriptor leaks on macOS, API timeout handling for long-thinking requests, and mid-stream retry corruption in ACP mode. The overarching theme this cycle is **making the agent layer more reliable and less surprising** — both for users and for the eval/telemetry infrastructure that measures it.

---

## 2. Releases

*No new releases in the last 24 hours.*

---

## 3. Hot Issues

1. **[#22323](https://github.com/google-gemini/gemini-cli/issues/22323) — Subagent recovery after MAX_TURNS reported as GOAL success** (13 comments, 👍2, p1)
   A `codebase_investigator` subagent reports `status: "success"` / `Termination Reason: "GOAL"` despite hitting the turn limit before doing any analysis. This is a correctness bug in agent observability — it silently masks failure, which is especially dangerous for automated pipelines. Highest-comment issue of the day and flagged for retesting.

2. **[#19873](https://github.com/google-gemini/gemini-cli/issues/19873) — Zero-dependency OS sandboxing & post-execution intent routing** (9 comments, 👍1, p2)
   Proposes leaning into Gemini 3's native bash affinity by running POSIX tool chains (`grep`, `sed`, `awk`) inside an OS-level sandbox rather than restricting the model. A significant architectural direction for the agent runtime — large effort, still under design.

3. **[#21409](https://github.com/google-gemini/gemini-cli/issues/21409) — Generalist agent hangs** (8 comments, 👍8, p1)
   The highest-reaction issue in this batch: any deferral to the generalist agent hangs indefinitely (up to an hour observed). The workaround — instructing the model not to use subagents — is a major usability regression. Strong community signal via 👍.

4. **[#22745](https://github.com/google-gemini/gemini-cli/issues/22745) — Assess impact of AST-aware file reads, search, and mapping** (7 comments, 👍1, p2)
   An EPIC tracking whether AST-aware tooling can reduce misaligned reads, token noise, and turns. Directly connected to [#22746](https://github.com/google-gemini/gemini-cli/issues/22746) and [#22747](https://github.com/google-gemini/gemini-cli/issues/22747) — a coordinated investigation into more precise codebase navigation.

5. **[#21968](https://github.com/google-gemini/gemini-cli/issues/21968) — Gemini does not use skills and sub-agents enough** (7 comments, p2)
   Anecdotal but widely felt: custom skills (e.g., "gradle", "git") are ignored unless explicitly invoked. This undermines the value proposition of the skills/subagent system — if the model won't reach for them, users won't build them.

6. **[#22267](https://github.com/google-gemini/gemini-cli/issues/22267) — Browser Agent ignores `settings.json` overrides** (5 comments, p2)
   The `AgentRegistry` reads merged settings correctly, but the Browser Agent bypasses them (e.g., `maxTurns`). Configuration that silently doesn't apply is a classic trust-eroding bug.

7. **[#22232](https://github.com/google-gemini/gemini-cli/issues/22232) — Browser agent session takeover & lock recovery** (4 comments, p3)
   Requests replacing the current fail-fast behavior on locked browser profiles with automatic takeover/recovery. Persistent-mode users hit orphaned-process locks frequently; a resilience improvement would meaningfully reduce friction.

8. **[#21983](https://github.com/google-gemini/gemini-cli/issues/21983) — Browser subagent fails on Wayland** (4 comments, 👍1, p1)
   Linux/Wayland users report the browser subagent terminating with `GOAL` despite failing. Combined with #22267 and #22232, the browser agent is clearly the least-stable surface area right now.

9. **[#24246](https://github.com/google-gemini/gemini-cli/issues/24246) — 400 error with >128 tools** (3 comments, p2)
   Gemini CLI hits a 400 when too many tools are in scope. The reporter expects the agent to be smarter about scoping enabled tools — an increasingly relevant issue as MCP servers multiply the tool surface.

10. **[#22672](https://github.com/google-gemini/gemini-cli/issues/22672) — Agent should stop/discourage destructive behavior** (3 comments, 👍1, p2)
    The model occasionally reaches for `git reset` or `--force` when safer alternatives exist. A safety-and-trust issue that speaks to broader concerns about autonomous operation on real repositories.

---

## 4. Key PR Progress

1. **[#30185](https://github.com/google-gemini/gemini-cli/pull/30185) — Prevent recursive interactive gemini sessions in shell mode** (p1)
   Blocks `gemini` from being spawned inside Shell Mode (`!`) or the `[Shell]` tool, and rejects unsupported CLI config subcommands. Prevents a genuinely confusing failure mode.

2. **[#30189](https://github.com/google-gemini/gemini-cli/pull/30189) — Reject `MessageBus.request()` immediately when publish fails**
   Previously a failed publish waited the full 60s timeout before rejecting with a generic error. Now it fails fast with the original error — meaningful for debugging and latency.

3. **[#30183](https://github.com/google-gemini/gemini-cli/pull/30183) — Configurable 60s API headers timeout** *(closed)*
   Long-thinking requests (`thinkingLevel: HIGH`, large contexts) were dropped with `UND_ERR_HEADERS_TIMEOUT` and replayed from scratch. Adds `model.requestTimeoutMs` / `GEMINI_API_HEADERS_TIMEOUT_MS` across all auth modes. A high-impact fix for Vertex/API-key users.

4. **[#30184](https://github.com/google-gemini/gemini-cli/pull/30184) — Fix orphan `/dev/ptmx` master FD leak on macOS** *(closed)*
   Prevents `kern.tty.ptmx_max` exhaustion during long sessions with `@lydell/node-pty@1.1.0`. Subtle but critical for sustained use.

5. **[#30180](https://github.com/google-gemini/gemini-cli/pull/30180) — Bound multi-part tool outputs and evict older multimodal inlineData** *(closed)*
   Fixes V8 heap OOM crashes during long agentic sessions that repeatedly call `read_many_files` or ingest screenshots. Directly addresses session-length scalability.

6. **[#30165](https://github.com/google-gemini/gemini-cli/pull/30165) — Handle mid-stream retries to prevent text concatenation** *(closed)*
   Fixes partial text/tool calls from abandoned retry attempts being concatenated and executed in ACP mode. A correctness fix for anyone driving Gemini CLI programmatically.

7. **[#30187](https://github.com/google-gemini/gemini-cli/pull/30187) — Prevent multi-hour quota retries; notify ACP client** *(closed)*
   Stops indefinite hangs on HTTP 429 with long reset windows, and surfaces retry attempts to ACP clients instead of hiding them.

8. **[#30164](https://github.com/google-gemini/gemini-cli/pull/30164) — Resolve folder trust before entering macOS Seatbelt sandbox** (p1)
   Since #29214, the sandbox denied access to `~/.gemini/trustedFolders.json`, breaking the trust dialog. Follow-up to the #30143 startup-crash fix.

9. **[#30181](https://github.com/google-gemini/gemini-cli/pull/30181) — Eliminate barrel-import bundle bloat in VS Code companion** *(closed)*
   Switches from a barrel import of `@google/gemini-cli-core` to narrow subpath imports, cutting the extension bundle from ~13.8 MB to ~2.7 MB dev / 1.7 MB prod. Big startup-perf win.

10. **[#30182](https://github.com/google-gemini/gemini-cli/pull/30182) — Prevent silent multi-minute loading hangs on network failures** *(closed)*
    Surfaces errors instead of an indefinite spinner under `model: auto` and default network configs — including TLS interception and `ALL_PROXY` setups.

*Honorable mentions:* [#30010](https://github.com/google-gemini/gemini-cli/pull/30010) (telemetry `skill_name` in safe metadata whitelist for enterprise), [#30176](https://github.com/google-gemini/gemini-cli/pull/30176) (preserve `--worktree` across auth restarts), [#30119](https://github.com/google-gemini/gemini-cli/pull/30119) (standalone `theme.json` discovery).

---

## 5. Hot Discussions

*No discussion data was provided for this period.*

---

## 6. Feature Request Trends

Distilling from the issue set, the most-requested directions are:

- **Smarter agent routing and self-awareness** — The model should proactively use skills/subagents ([#21968](https://github.com/google-gemini/gemini-cli/issues/21968)), understand its own CLI flags and hotkeys ([#21432](https://github.com/google-gemini/gemini-cli/issues/21432)), and correctly scope tools when counts grow large ([#24246](https://github.com/google-gemini/gemini-cli/issues/24246)).
- **AST-aware codebase navigation** — A coordinated EPIC ([#22745](https://github.com/google-gemini/gemini-cli/issues/22745), [#22746](https://github.com/google-gemini/gemini-cli/issues/22746), [#22747](https://github.com/google-gemini/gemini-cli/issues/22747)) exploring AST grep, tilth, and glyph for precise reads and search.
- **Token-frugal context management** — "Tactful Extraction" for surgical reads ([#19561](https://github.com/google-gemini/gemini-cli/issues/19561)) and persistent file-based task tracking to replace in-context `WriteToDo` ([#18836](https://github.com/google-gemini/gemini-cli/issues/18836)).
- **Browser agent resilience** — Session takeover, lock recovery ([#22232](https://github.com/google-gemini/gemini-cli/issues/22232)), and honoring config overrides ([#22267](https://github.com/google-gemini/gemini-cli/issues/22267)).
- **Subagent observability** — Trajectory visibility via `/chat share` ([#22598](https://github.com/google-gemini/gemini-cli/issues/22598)) and subagent context included in `/bug` reports ([#21763](https://github.com/google-gemini/gemini-cli/issues/21763)).
- **Safety guardrails** — Discouraging destructive git operations ([#22672](https://github.com/google-gemini/gemini-cli/issues/22672)) and per-workspace policy scoping ([#18397](https://github.com/google-gemini/gemini-cli/issues/18397)).

---

## 7. Developer Pain Points

- **Subagent hangs and silent failures.** Two of the top three issues ([#21409](https://github.com/google-gemini/gemini-cli/issues/21409), [#22323](https://github.com/google-gemini/gemini-cli/issues/22323)) describe the agent either hanging forever or reporting success when it actually failed. The 8 👍 on the hang issue underscore how disruptive this is.
- **Browser agent instability.** Three separate issues ([#21983](https://github.com/google-gemini/gemini-cli/issues/21983), [#22232](https://github.com/google-gemini/gemini-cli/issues/22232), [#22267](https://github.com/google-gemini/gemini-cli/issues/22267)) point to the browser subagent as the least reliable component — platform-specific failures (Wayland), config that doesn't apply, and brittle locking.
- **Configuration that silently doesn't take effect.** Whether it's `settings.json` overrides for the Browser Agent or `~/.gemini/agents/*.md` symlinks not being recognized ([#20079](https://github.com/google-gemini/gemini-cli/issues/20079)), developers repeatedly hit cases where their setup is ignored without warning.
- **Workspace pollution.** The model creates tmp scripts in random directories ([#23571](https://github.com/google-gemini/gemini-cli/issues/23571)), adding cleanup overhead before commits.
- **Crash-adjacent instability.** Crashes on output hooks ([#22186](https://github.com/google-gemini/gemini-cli/issues/22186)) and heap OOMs during long sessions — the latter addressed by PR [#30180](https://github.com/google-gemini/gemini-cli/pull/30180).
- **Eval/telemetry gaps.** Internal evals "bleed" and are hard to trust ([#23166](https://github.com/google-gemini/gemini-cli/issues/23166)); the steering eval had to be commented out ([#23313](https://github.com/google-gemini/gemini-cli/issues/23313)) — a meta-pain-point affecting the team's ability to measure regressions.

---

*Generated from github.com/google-gemini/gemini-cli activity for 2026-11-07.*

</details>

<details>
<summary><strong>GitHub Copilot CLI</strong> — <a href="https://github.com/github/copilot-cli">github/copilot-cli</a></summary>

# GitHub Copilot CLI Community Digest — 2026-11-07

## 1. Today's Highlights

Release activity continues at a rapid cadence with **v1.0.108-0**, which introduces a Windows-specific sandbox `enumeratePaths` grant and turns on **managed shared `tgrep` indexing** by default for eligible repos via new `/index` commands. Meanwhile, community attention is split between lingering input-handling bugs (Shift+Enter, IME submission) and a cluster of Entra-broker/MCP authentication regressions on both Windows and macOS, plus continued cleanup around the 1.0.106/1.0.107 release-note duplication.

## 2. Releases

**v1.0.108-0** (latest)
- **Added:** `sandbox.userPolicy.filesystem.enumeratePaths` in `settings.json` for Windows enumerate-only directory grants.
- **Added:** `/index` commands, with managed shared `tgrep` indexing now enabled by default for eligible repositories.
- **Improved:** Answering questions about Copilot CLI behavior from this build.

**v1.0.107** (2026-11-06)
- Rex terminals render inline images using Kitty direct placements.
- Added `/code` command to open the current session in VS Code.
- Added a Fusion tier setting to `copilot config`.
- `/settings` now opens the unified dashboard for all users, with global search across settings and local resources.

**v1.0.106** (2026-11-05)
- Identical notes to v1.0.107 (see Issue #5377 flagging the duplication).

## 3. Hot Issues

1. **[#1972](https://github.com/github/copilot-cli/issues/1972)** — *Allow users to configure submit key (e.g., Ctrl+Enter) to prevent accidental submission with IME input.* 48 👍 and years of CJK-user demand make this the highest-signal input request; Enter currently doubles as IME conversion and prompt submission.
2. **[#2776](https://github.com/github/copilot-cli/issues/2776)** — *Shift+Enter submits instead of inserting a newline.* 5 👍, still open since April; companion issue #3768 confirms it reproduces even with multiline terminal enabled.
3. **[#5236](https://github.com/github/copilot-cli/issues/5236)** — *Windows: Entra broker token cache stays 0 bytes after MCP sign-in.* Every new process re-prompts for account selection; 1,972-byte cache file writes but is never reused.
4. **[#5250](https://github.com/github/copilot-cli/issues/5250)** — *macOS: Entra-broker MCP servers fail at startup with "sign-in is already in progress."* Concurrent sign-ins to Azure DevOps and WorkIQ MCP servers reject each other; rejected cached tokens are not recovered.
5. **[#3679](https://github.com/github/copilot-cli/issues/3679)** — *BYOK Azure OpenAI 429 throttling exhausts all retries in ~0.15s.* No backoff, no configurable retry count — high impact for self-hosted/air-gapped deployments.
6. **[#5362](https://github.com/github/copilot-cli/issues/5362)** — *Model-judged context pruning.* Proposal lets the model swap junk tool results for a one-line summary, avoiding poisoned context for the rest of the session. Fresh design discussion with strong conceptual merit.
7. **[#4150](https://github.com/github/copilot-cli/issues/4150)** — *`permissions-config.json` commandIdentifiers with spaces still require approval.* `"make fix"` fails while `"make"` succeeds, undermining the auto-approve allowlist.
8. **[#5367](https://github.com/github/copilot-cli/issues/5367)** — *Agent regularly loses MCP tool schemas mid-session.* Daily-impact bug; users report `/compact` as the only workaround to restore tool visibility.
9. **[#5366](https://github.com/github/copilot-cli/issues/5366)** — *Remote MCP OAuth (Entra): calls fail after token expiry while `mcp.list` still reports connected.* Only `restartServer` recovers, a real problem for long-running SDK sessions.
10. **[#5370](https://github.com/github/copilot-cli/issues/5370)** — *Agent output withheld until next user turn when long shell commands are backgrounded (Fusion/Auto mode).* Makes the agent appear hung until the user pings it again.

## 4. Key PR Progress

Only one PR was updated in the window:

1. **[#5373](https://github.com/github/copilot-cli/pull/5373)** — *docs: add Simplified Chinese Copilot CLI README.* Adds a translated README plus mutual EN/ZH navigation links, preserving commands, config keys, and product names. Opens the door to broader i18n contribution patterns for the project.

*(No other PRs were active in the last 24h; the PR list is otherwise empty.)*

## 5. Hot Discussions

No discussion data was provided for this window, so this section is omitted.

## 6. Feature Request Trends

- **Input ergonomics & IME support** — Configurable submit key (#1972), Shift+Enter newline (#2776, #3768), scrollback collapsing/highlighting (#4995). This is the most persistent cluster of asks.
- **Granular permission control** — Space-containing `commandIdentifiers` (#4150), disabling built-in slash commands to avoid skill collisions (#5375), reporting sandbox temp-storage rules (#5365).
- **Model routing & provider control** — Block lists for Fusion/Auto mode (#5369), fixing BYOK retry/backoff behavior (#3679), honoring `COPILOT_PROVIDERS_CONFIG` in `--host-environment`/`--server` modes (#5371).
- **Context/memory hygiene** — Model-judged context pruning (#5362) and preventing MCP schema loss (#5367).
- **Hooks & extensibility** — Display-only hooks for redacted assistant messages (#5099), rendering `postToolUse` hook output in desktop (#5374).
- **Internationalization** — Simplified Chinese README (#5373) reflects a growing non-English contributor/user base.

## 7. Developer Pain Points

- **Authentication reliability for Entra/MCP** is the loudest theme: empty token caches on Windows (#5236), concurrent sign-in rejection on macOS (#5250), and silent OAuth token expiry with misleading `mcp.list` status (#5366). Users are re-authenticating far too often.
- **Input handling regressions** continue to frustrate: Shift+Enter submission (#2776, #3768), Esc discarding entire `ask_user` forms instead of clearing input (#4943), and command history being last-writer-wins across concurrent processes (#5265).
- **Silent or stuck-feeling agent behavior** — withheld Fusion/Auto output (#5370) and MCP tool schema disappearance (#5367) erode trust in long-running sessions.
- **Retry/network resilience** — near-instant retry exhaustion on Azure OpenAI 429s (#3679) with no user-tunable backoff.
- **Release-note quality** — duplicated 1.0.106/1.0.107 notes (#5377) and ambiguous changelog content draw attention away from substantive changes.
- **Platform/Windows sandbox edge cases** — the `CreateProcessW` sandbox probe failure (#5368, now closed) and new `enumeratePaths` support signal the team is actively hardening Windows isolation.

</details>

<details>
<summary><strong>OpenCode</strong> — <a href="https://github.com/anomalyco/opencode">anomalyco/opencode</a></summary>

# OpenCode Community Digest — 2026-11-07

## 1. Today's Highlights

OpenCode shipped **v2.2.6**, headlined by **shared MCP connection pooling** (fewer processes, faster startup) and new GUI plugin theming slots. The community remains heavily focused on **free-tier reliability** (#59387 has ballooned to 315 comments) and a cluster of V2 regressions around **compaction, subagent lifecycle, and TUI model selection**. PR activity is concentrated on the **Code Mode VM** (durable tools, per-namespace catalogs) and **config hot-reload fixes for symlinked files**.

## 2. Releases

**v2.2.6** — [release note](https://github.com/anomalyco/opencode/pull/62450)
- **Shared MCP Connections**: Connection pooling for MCP servers lets projects with identical setups share a single connection — fewer spawned processes, faster cold starts. ([#61185](https://github.com/anomalyco/opencode/pull/61185))
- **GUI Plugin Themes & New Slots**: GUI plugins can now ship themes and hook into additional named slots. (release notes truncated upstream)

## 3. Hot Issues

1. **[#59387](https://github.com/anomalyco/opencode/issues/59387) — Free tier megathread (315 comments, 👍23)** — Central tracking issue for `Free usage exceeded`, non-resetting quotas, and Desktop version rejections. This is the single loudest signal in the repo right now; free-tier UX is the top community concern.

2. **[#40993](https://github.com/anomalyco/opencode/issues/40993) — Support the Agent Plugins standard (👍21)** — Request for `agent-plugins.org`, a vendor-neutral packaging spec bundling Agent Skills + MCP servers. High upvote count suggests multi-vendor portability is a strategic ask, not a niche one.

3. **[#27110](https://github.com/anomalyco/opencode/issues/27110) — Limit max parallel subagents (👍42)** — Highest-upvoted open feature. Local-model users on constrained VRAM need a concurrency cap; today parallel tasks thrash memory.

4. **[#51949](https://github.com/anomalyco/opencode/issues/51949) — Agent loses top-level tools after auto-compact** — Post-compaction the agent silently falls back to code mode, breaks, and reports it has no tools. A serious correctness bug for long sessions.

5. **[#48826](https://github.com/anomalyco/opencode/issues/48826) — V2 subagent marked `completed` with pending background work** — Parent agents are notified early with premature results; background task output is never collected. Reproduced and still open — matters for anyone orchestrating subagents.

6. **[#62442](https://github.com/anomalyco/opencode/issues/62442) — Desktop stuck session: interrupt returns false, delete times out (499)** — Session can enter an unrecoverable `running` state on 2.2.5. Fresh but escalating; blocking for Desktop users.

7. **[#62447](https://github.com/anomalyco/opencode/issues/62447) — TUI model picker shows subset of custom provider models** — Only 3 of 7 Ollama models appear despite the server returning all 7. Directly undercuts `@ai-sdk/openai-compatible` custom provider workflows.

8. **[#61507](https://github.com/anomalyco/opencode/issues/61507) — TUI discards `--model` when resuming a session** — `--agent` is honored, `--model` is not: the resumed session reverts to the last user message's model. Breaks scripted/CI workflows.

9. **[#62415](https://github.com/anomalyco/opencode/issues/62415) — Agent markdown with `name` + V2 `permissions` ignores permissions** — Teams porting from Claude Code (which requires `name`) get silently disabled permission rules. A security-adjacent config trap.

10. **[#62432](https://github.com/anomalyco/opencode/issues/62432) — No way to disable persisting "Allow always" approvals** — One-off clicks silently override `ask` rules in `opencode.json`, with inconsistent behavior across projects. Permission-model governance gap.

*Also notable:* [#57844](https://github.com/anomalyco/opencode/issues/57844) and [#62411](https://github.com/anomalyco/opencode/issues/62411) (multilingual glyph corruption in GLM free models), [#62138](https://github.com/anomalyco/opencode/issues/62138) (`/goal` stuck after `/undo`), [#40096](https://github.com/anomalyco/opencode/issues/40096) (collapsible tool output).

## 4. Key PR Progress

1. **[#62459](https://github.com/anomalyco/opencode/pull/62459) — durable tools & safe suspension in Code Mode VM** — Adds `false | "rerun" | { start, attach, cancel }` durability semantics and stable `<runId>:<callId>` keys. Foundational for reliable long-running VM tooling.

2. **[#62176](https://github.com/anomalyco/opencode/pull/62176) — per-namespace Code Mode catalog sections** — Fixes the shared 2,000-token catalog budget that caused one namespace's change to reshuffle all others (~2,400 tokens restated per update).

3. **[#62444](https://github.com/anomalyco/opencode/pull/62444) — Code Mode VM enabled by default in dev** — Migrates `codemode_vm` into the flag registry so it resolves like `todo`/`artifacts`. Signals VM path is nearing default-on.

4. **[#62429](https://github.com/anomalyco/opencode/pull/62429) — `{ url, headers }` sources for instructions and skills** — Lets OpenCode Console share workspace instructions/skills via remote sources; enables hosted/team config distribution.

5. **[#53932](https://github.com/anomalyco/opencode/pull/53932) — reload symlinked config targets** — Fixes stale `opencode.json` when the symlink target (e.g. dotfiles repo) is edited outside the watched directory.

6. **[#62457](https://github.com/anomalyco/opencode/pull/62457) — watch symlinked config file targets** — Companion fix covering global config symlinks into dotfiles; changes like `model` now apply without recreation.

7. **[#58846](https://github.com/anomalyco/opencode/pull/58846) — repair V1 global sessions from completed imports** — Retroactive fix for users already upgraded past #56322 whose V1 sessions were never attributed to project folders.

8. **[#61073](https://github.com/anomalyco/opencode/pull/61073) — label Claude Agent requests as opencode** — Stops Agent SDK requests being mislabeled `sdk-ts`; improves telemetry attribution for Claude Code bridging.

9. **[#62249](https://github.com/anomalyco/opencode/pull/62249) — keep grep results on non-UTF-8 matches** — Non-UTF-8 files (Latin-1, GBK) no longer abort grep with `Invalid ripgrep` output; relevant for i18n codebases.

10. **[#62423](https://github.com/anomalyco/opencode/pull/62423) — accept model prefixes without breaking utility commands** — Launchers injecting `--model provider/model` can now pass through `export` etc., without disturbing resumed-session model selection.

*Also:* [#62445](https://github.com/anomalyco/opencode/pull/62445) (site perf: stats reels restyling, WebKit reload jump), [#62458](https://github.com/anomalyco/opencode/pull/62458) / [#62446](https://github.com/anomalyco/opencode/pull/62446) / [#62443](https://github.com/anomalyco/opencode/pull/62443) (Console model docs: Inkling 2 Small Free added, Pulse Alpha Free deprecated, Iceman Free added), [#60957](https://github.com/anomalyco/opencode/pull/60957) (nix hashes).

## 5. Hot Discussions

No Discussions data was provided in this dataset — section omitted.

## 6. Feature Request Trends

- **Resource governance for local models** — Cap parallel subagents ([#27110](https://github.com/anomalyco/opencode/issues/27110), 👍42) so context/memory aren't exhausted; a clear top ask from the local-inference crowd.
- **Ecosystem interoperability** — Adopt the vendor-neutral Agent Plugins standard ([#40993](https://github.com/anomalyco/opencode/issues/40993)) to make Skills + MCP bundles portable across agents.
- **TUI ergonomics** — Collapsible tool output ([#40096](https://github.com/anomalyco/opencode/issues/40096)) and other noise-reduction controls for long sessions.
- **Platform-native desktop polish** — Custom titlebars on Linux/GNOME ([#36225](https://github.com/anomalyco/opencode/issues/36225)) and project deletion in Desktop ([#28030](https://github.com/anomalyco/opencode/issues/28030), since closed).
- **Permission control granularity** — Opt-out of persistent "Allow always" approvals ([#62432](https://github.com/anomalyco/opencode/issues/62432)).
- **Output-language guarding** — Deterministic language control for multilingual models ([#57844](https://github.com/anomalyco/opencode/issues/57844)).

## 7. Developer Pain Points

- **Free-tier quota opacity** — The dominant pain point. Non-resetting limits, inconsistent Desktop behavior, and error messages without remedy — consolidated into [#59387](https://github.com/anomalyco/opencode/issues/59387) (315 comments).
- **Compaction correctness** — Auto-compaction triggers below threshold ([#62218](https://github.com/anomalyco/opencode/issues/62218)) and, worse, strips top-level tool access afterwards ([#51949](https://github.com/anomalyco/opencode/issues/51949)). Long-session reliability is at risk.
- **Subagent lifecycle bugs** — Premature `completed` status with pending background work ([#48826](https://github.com/anomalyco/opencode/issues/48826)) and stalled multi-step agents ([#61511](https://github.com/anomalyco/opencode/issues/61511)) undermine orchestration trust.
- **Custom provider / model plumbing** — Model picker drops models ([#62447](https://github.com/anomalyco/opencode/issues/62447)), editing limits makes providers vanish ([#53005](https://github.com/anomalyco/opencode/issues/53005)), `--model` ignored on resume ([#61507](https://github.com/anomalyco/opencode/issues/61507)), Ollama tool calls not executed ([#46625](https://github.com/anomalyco/opencode/issues/46625)).
- **Silent configuration failures** — Agent files silently dropped on `[`-prefixed descriptions ([#54200](https://github.com/anomalyco/opencode/issues/54200)) or ignored permissions when `name` is present ([#62415](https://github.com/anomalyco/opencode/issues/62415)). No warnings, hard to debug.
- **Session state corruption** — Stuck `running` sessions with unresponsive interrupts and 499 deletes ([#62442](https://github.com/anomalyco/opencode/issues/62442)), `/goal` stuck after `/undo` ([#62138](https://github.com/anomalyco/opencode/issues/62138)).
- **Multilingual output corruption** — GLM-based free models injecting CJK/Cyrillic glyphs into Slavic-language answers ([#57844](https://github.com/anomalyco/opencode/issues/57844), [#62411](https://github.com/anomalyco/opencode/issues/62411)).
- **Connectivity instability** — Recurring `ECONNRESET` across all free models ([#62179](https://github.com/anomalyco/opencode/issues/62179)).
- **MCP reliability** — OAuth dialog closing mid-flow ([#51060](https://github.com/anomalyco/opencode/issues/51060)) and lost `Mcp-Session-Id` during parallel calls ([#59640](https://github.com/anomalyco/opencode/issues/59640)).

</details>

<details>
<summary><strong>Pi</strong> — <a href="https://github.com/earendil-works/pi">earendil-works/pi</a></summary>

# Pi Community Digest — 2026-11-07

## 1. Today's Highlights

No new releases shipped in the last 24h, but the issue and PR queues were extremely active: a wave of `fix-available` PRs landed for long-standing bugs in the `edit`, `grep`, TUI, and AI provider layers. The dominant themes were **streaming/tool-call correctness** (OpenAI-completions edge cases, retry logic) and **cross-platform robustness** (Windows shutdown handling, macOS worker teardown, non-UTF-8 files). Community attention also converged on a P0 regression in `StringEnum` typing introduced in Pi 1.5.0.

## 2. Releases

No new releases in the last 24h.

## 3. Hot Issues

1. **[#10605] ChatGPT/OpenAI OAuth 403 — "subscription sharing" error** ([link](https://github.com/earendil-works/pi/issues/10605)) — OPEN, 13 comments, 1 👍. Plus-tier users are locked out with a 403 after logout/login. High visibility because it blocks a paid subscription path; no official fix yet.

2. **[#1188] Screen reader compatibility** ([link](https://github.com/earendil-works/pi/issues/1188)) — CLOSED, 14 comments. The 80ms spinner rerender floods assistive tech. Long-running accessibility issue finally resolved; notable for the sustained community engagement.

3. **[#9932] `before_agent_start` forced system prompt keeps removed tools** ([link](https://github.com/earendil-works/pi/issues/9932)) — OPEN, 7 comments. Extension hook ordering bug causes stale tools to remain advertised. Matters for anyone building tool-gating extensions.

4. **[#11869] New `StringEnum` in Pi 1.5.0 breaks compile-time typing** ([link](https://github.com/earendil-works/pi/issues/11869)) — OPEN, `prio:p0`, 2 👍. `registerTool` parameter types degrade to `unknown` after the typebox removal. A regression with direct impact on SDK consumers' type safety.

5. **[#10585] bash temp-file stream errors crash the process** ([link](https://github.com/earendil-works/pi/issues/10585)) — OPEN. `ENOSPC`/`EACCES` on `/tmp` kills the whole session with no recovery. Reliability concern for constrained environments.

6. **[#11858] codemode script repeated a tool call 24,018 times** ([link](https://github.com/earendil-works/pi/issues/11858)) — CLOSED. No per-script repetition guard; only wall-clock abort stopped it. Highlights a sandbox safety gap.

7. **[#10650] codemode drops nested Error messages in `allSettled` output** ([link](https://github.com/earendil-works/pi/issues/10650)) — OPEN. `reason: {}` instead of actionable errors degrades model reasoning quality.

8. **[#11861] Prompt template arguments drop apostrophes** ([link](https://github.com/earendil-works/pi/issues/11861)) — CLOSED, `fix-available`. `/ask why doesn't...` silently mangles arguments — a subtle correctness bug affecting everyday usage.

9. **[#8544] edit tool rewrites line endings of untouched lines** ([link](https://github.com/earendil-works/pi/issues/8544)) — CLOSED. Mixed CRLF/LF files get corrupted on edit. Data-integrity issue now addressed.

10. **[#11676] `Harness.close()` leaks pi-ai provider session resources** ([link](https://github.com/earendil-works/pi/issues/11676)) — OPEN, `inprogress`. Leaked WebSocket + 5-min idle timer prevents process exit — relevant to embedded/durable agent builders.

## 4. Key PR Progress

1. **[#11895] grep globs matched relative to `path`** ([link](https://github.com/earendil-works/pi/pull/11895)) — CLOSED. Fixes globs silently matching nothing when `path` ≠ cwd.

2. **[#11896] Wait for image resize worker to terminate** ([link](https://github.com/earendil-works/pi/pull/11896)) — CLOSED. Fixes macOS/Node 24 process abort from worker teardown races.

3. **[#11891] Omit empty `tools: []` for tool history on openai-completions** ([link](https://github.com/earendil-works/pi/pull/11891)) — CLOSED. Resolves vLLM/LiteLLM 400 errors.

4. **[#11882] Split tool-call blocks when stream index and id disagree** ([link](https://github.com/earendil-works/pi/pull/11882)) — CLOSED. Prevents silent concatenation of two tool calls' arguments.

5. **[#11890] Draw fullscreen Kitty images on all terminals** ([link](https://github.com/earendil-works/pi/pull/11890)) — CLOSED. Fixes blank images in Orca/xterm.js.

6. **[#11885] Retry streams cut short after reply had begun** ([link](https://github.com/earendil-works/pi/pull/11885)) — CLOSED. Adds the Magpie/Anthropic mid-stream drop message to retryable patterns.

7. **[#11894] edit refuses files that are not valid UTF-8** ([link](https://github.com/earendil-works/pi/pull/11894)) — OPEN. Prevents silent U+FFFD corruption of UTF-16/legacy-encoding files.

8. **[#11888] Record live thinking level on branch before each prompt** ([link](https://github.com/earendil-works/pi/pull/11888)) — CLOSED. Fixes stale thinking level after `/tree` navigation + resume.

9. **[#11889] Run shutdown cleanup when Windows console closes** ([link](https://github.com/earendil-works/pi/pull/11889)) — OPEN. Adds Windows shutdown handling where SIGHUP isn't available.

10. **[#11878] Allow local `tools`/`console` declarations in codemode** ([link](https://github.com/earendil-works/pi/pull/11878)) — OPEN. Fixes `SyntaxError` from hidden parameter name collisions.

## 5. Hot Discussions

**Q&A / Ideas**
- **[#11870] How do you keep skills organized across Pi and other agents?** ([link](https://github.com/earendil-works/pi/discussions/11870)) — 1 👍. Cross-tool skill duplication and drift; author shares a cataloging CLI.

**Show and tell**
- **[#11860] CaseClip — save a Pi mistake as a reviewable case card** ([link](https://github.com/earendil-works/pi/discussions/11860)) — 1 👍. Captures request + tool result + correction for post-hoc review.

## 6. Feature Request Trends

- **Model catalog expansion**: requests to add `deepseek-v4.1-flash-1017` (#11877), `glm-5.3-flashx` (#11884), and Kimi K3.1-pro + video modality (#11883). Users want parity with vendor model tables.
- **SDK customization depth**: identity preamble override without replacing default prompt sections (#11317); per-conversation compaction policy for durable agents (#11771).
- **Codemode sandbox hardening**: repetition guards (#11858) and faithful Error serialization (#10650).
- **Long-running agent guidance**: context management patterns for tool-heavy multimodal embedded sessions (#11863).

## 7. Developer Pain Points

- **Streaming protocol fragility**: OpenAI-compatible providers violating the tool-call streaming contract cause silent argument corruption (#11881) and empty-tools 400s (#11843). Multiple PRs this cycle target this class.
- **Silent data corruption**: `edit` rewriting line endings (#8544) and mangling non-UTF-8 files (#11894), plus prompt-arg apostrophe loss (#11861) — bugs that "succeed" while damaging content.
- **Cross-platform gaps**: Windows shutdown/`argv[1]` virtual path issues (#11889, #11865) and macOS worker teardown races (#10695) show POSIX-first assumptions leaking through.
- **Auth and provider churn**: OpenAI OAuth 403 (#10605) and GitHub Copilot token refresh on 401/403 (#10238) leave users blocked with unclear recovery paths.
- **Resource lifecycle**: leaked provider sessions on `Harness.close()` (#11676) and uncaught temp-file errors crashing sessions (#10585) frustrate embedded/CI users.

---
*Digest generated from github.com/earendil-works/pi activity for 2026-11-07.*

</details>

<details>
<summary><strong>Qwen Code</strong> — <a href="https://github.com/QwenLM/qwen-code">QwenLM/qwen-code</a></summary>

# Qwen Code Community Digest — 2026-11-07

## 1. Today's Highlights

Qwen Code shipped **v0.26.9** stable alongside a fresh nightly, headlined by a major expansion of the **Skill installation and activation** system (ZIP uploads, daemon APIs, TypeScript SDK support, bulk activation, and recovery protections). Meanwhile, issue activity is dominated by CI stability churn from `qwen-code-dev-bot` and a cluster of high-severity session-management bugs, including a documented case of auto-compaction turning a review-only skill into unauthorized source-code implementation.

## 2. Releases

**v0.26.9** (stable) and **v0.26.9-nightly.20261106.80fd7c3353** both landed in the last 24h.

- **No known breaking changes.**
- **Headline feature:** Skill installation and activation — Skill ZIP uploads, daemon APIs, TypeScript SDK support, bulk activation, and recovery protections make installing and managing skills substantially more robust.
- Nightly included test hardening for the interactive foreground-shell (`poll the foreground-shell frame instead of snapshotting it`, PR [#16455](https://github.com/QwenLM/qwen-code/pull/16455)).

## 3. Hot Issues

1. **[#14724](https://github.com/QwenLM/qwen-code/issues/14724)** — *Main CI failed: Managed Agent gate — no test identified* (OPEN, 217 comments). A long-running meta-issue tracking a persistently red Managed Agent gate. The extreme comment volume signals chronic CI instability, not a single bug.
2. **[#13113](https://github.com/QwenLM/qwen-code/issues/13113)** — *Session becomes unopenable: "Transcript snapshot is too large to index"* (P1). `file_history_snapshot` grows quadratically and eventually exceeds a hardcoded 256 MiB index limit, making sessions permanently unopenable. A serious data-loss-adjacent bug for long sessions.
3. **[#16418](https://github.com/QwenLM/qwen-code/issues/16418)** — *Repeated auto-compaction turns review-only skill into unauthorized source-code implementation* (P1). A `/ce-doc-review` skill was unexpectedly escalated into implementing the reviewed plan — a notable agent-safety and permission-scope concern.
4. **[#15597](https://github.com/QwenLM/qwen-code/issues/15597)** — *Headless `-p` managed auto-memory can never save* (P1). The implicit edit/`write_file` deny overrides memory agents' scoped allow, so auto-memory silently no-ops while still costing tokens.
5. **[#15412](https://github.com/QwenLM/qwen-code/issues/15412)** — *Long project paths prevent chat recording and break sessions list* (P2). Path flattening exceeds filesystem component limits on macOS.
6. **[#15675](https://github.com/QwenLM/qwen-code/issues/15675)** — *`sed` edit simulation: `.` does not match `\r` or a whole emoji* (P1, now CLOSED). In-process sed simulation diverges from real sed due to missing `s`/`u` RegExp flags.
7. **[#15310](https://github.com/QwenLM/qwen-code/issues/15310)** — *Tell the model which shell it uses, instead of letting it assume bash* (P3). On Windows, the model writes POSIX commands into `cmd.exe`, burning a full turn per failure.
8. **[#15495](https://github.com/QwenLM/qwen-code/issues/15495)** — *Image payload eviction has no off switch and an undocumented threshold* (P2). Silent rewriting of inline images at an undeclared count of 20.
9. **[#16457](https://github.com/QwenLM/qwen-code/issues/16457)** — *MCP OAuth: overlapping flows share fixed callback port 7777* (P2). Starting a second OAuth flow invalidates the first, breaking multi-server authorization.
10. **[#14629](https://github.com/QwenLM/qwen-code/issues/14629)** — *Telemetry: emit OpenRouter routing provider and generation id as span attributes* (P3). Strong interest in aggregator-routing observability.

## 4. Key PR Progress

1. **[#16501](https://github.com/QwenLM/qwen-code/pull/16501)** — *refactor(runtime-broker): extract binding provisioning from RuntimeBrokerService*. Continues the decomposition of the Runtime Broker into dedicated collaborators (matching the dispatcher/reconciler/recovery pattern).
2. **[#16498](https://github.com/QwenLM/qwen-code/pull/16498)** — *feat(managed-agent): Add execution diagnostics and agent graph*. Persists tool/Skill usage, file-operation and line-change metrics, and an authorized agent relationship view — decoupling execution evidence from conversation outcomes.
3. **[#16493](https://github.com/QwenLM/qwen-code/pull/16493)** — *feat(channels): add GitHub repository event filter with allowlist and blocklist*. Surfaces a first-class Repository Filter control in the Web Shell channel editor.
4. **[#16470](https://github.com/QwenLM/qwen-code/pull/16470)** — *fix(release): derive the next patch when the preview baseline lags latest*. Repairs version resolution when a stable patch shipped after the latest preview.
5. **[#16401](https://github.com/QwenLM/qwen-code/pull/16401)** — *fix(cli): forward the folder-trust store into the container sandbox*. Prevents containerized re-execution from falling back to default trust state.
6. **[#16352](https://github.com/QwenLM/qwen-code/pull/16352)** — *fix(managed-agent): mask digit-led passwords and refuse empty Harness user info*. Hardening the upgrade command's `start`/`verify` phases.
7. **[#14353](https://github.com/QwenLM/qwen-code/pull/14353)** — *fix(web-shell): honor configured loading phrases*. Applies custom loading phrases while preserving host overrides and built-in fallback.
8. **[#16503](https://github.com/QwenLM/qwen-code/pull/16503)** — *refactor(managed-agent): fold the last CSI statement helper copies*. Removes duplicated statement-preparation helpers in CSI stores.
9. **[#15286](https://github.com/QwenLM/qwen-code/pull/15286)** — *fix(ci): keep sdk-java resolver bookkeeping and in-house jars out of the host cache*. Prevents mutable inode sharing between job-local Maven repos and the host cache.
10. **[#12592](https://github.com/QwenLM/qwen-code/pull/12592)** — *fix(session): reattach explicit resume after project move*. Adds bounded cross-project lookup so `qwen --resume <uuid>` survives a moved project directory.

## 5. Hot Discussions

No discussion data was provided in the source dataset; this section is omitted.

## 6. Feature Request Trends

- **Better memory & long-term context** — optional external memory services ([#16429](https://github.com/QwenLM/qwen-code/issues/16429) proposing bzmem), plus fixes to managed auto-memory in headless mode ([#15597](https://github.com/QwenLM/qwen-code/issues/15597)).
- **Cross-platform correctness** — shell-awareness on Windows ([#15310](https://github.com/QwenLM/qwen-code/issues/15310)), path-length handling on macOS ([#15412](https://github.com/QwenLM/qwen-code/issues/15412)).
- **Web Shell UX** — inline branch chat anchored to selections ([#16474](https://github.com/QwenLM/qwen-code/issues/16474)), managed-host UI gaps ([#16471](https://github.com/QwenLM/qwen-code/issues/16471)).
- **Observability & telemetry** — OpenRouter routing attributes ([#14629](https://github.com/QwenLM/qwen-code/issues/14629)), cache-write token preservation ([#15414](https://github.com/QwenLM/qwen-code/issues/15414)).
- **Session management robustness** — transcript indexing limits, resume-after-move, background shell lifecycle.
- **Terminal integration** — OSC 7501 program status reporting ([#13870](https://github.com/QwenLM/qwen-code/issues/13870)).

## 7. Developer Pain Points

- **CI noise drowning real signal.** A large fraction of hot issues are bot-filed `Main CI failed` reports (e.g. [#14724](https://github.com/QwenLM/qwen-code/issues/14724), [#16191](https://github.com/QwenLM/qwen-code/issues/16191), [#16377](https://github.com/QwenLM/qwen-code/issues/16377)), several self-labeled "Provisional." This erodes triage quality and community attention.
- **Session state fragility.** Unbounded transcript growth ([#13113](https://github.com/QwenLM/qwen-code/issues/13113)), path-derived session directories ([#15412](https://github.com/QwenLM/qwen-code/issues/15412)), and background-shell status files stuck "running" after abrupt ends ([#15800](https://github.com/QwenLM/qwen-code/issues/15800)) form a recurring cluster.
- **Permission/approval surprises.** Auto-memory denial ([#15597](https://github.com/QwenLM/qwen-code/issues/15597)), auto-compaction escalation ([#16418](https://github.com/QwenLM/qwen-code/issues/16418)), and amend-guard gaps ([#16449](https://github.com/QwenLM/qwen-code/issues/16449)) all point to approval logic that behaves unexpectedly under long-running or headless conditions.
- **Cross-platform shell assumptions.** Windows users pay a full model turn per failed POSIX-style command ([#15310](https://github.com/QwenLM/qwen-code/issues/15310)).
- **Stale PR backlog.** Multiple `[status/stale]` PRs from September (e.g. [#12592](https://github.com/QwenLM/qwen-code/pull/12592), [#12572](https://github.com/QwenLM/qwen-code/pull/12572), [#12450](https://github.com/QwenLM/qwen-code/pull/12450)) remain unmerged after weeks, suggesting reviewer bandwidth constraints.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*