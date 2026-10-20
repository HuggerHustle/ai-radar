# AI CLI Tools Community Digest 2026-10-21

> Generated: 2026-10-20 23:47 UTC | Tools covered: 7

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

# Cross-Tool Comparison Report — AI CLI Ecosystem (2026-10-21)

---

## 1. Ecosystem Overview

The AI CLI tooling landscape is in a **consolidation-and-hardening phase** rather than a greenfield feature race. All seven tools are shipping frequently, but the dominant engineering themes are around **reliability, security, sandboxing, and enterprise policy** rather than headline capabilities. Extensibility has become the primary battleground: Claude Code (Mods), Gemini CLI (skills/subagents), OpenCode (plugin API), Pi (extension lifecycle), and Qwen Code (Claude Code-style Mod runtime) are all converging on plugin/hook architectures — with predictable growing pains around policy enforcement, silent failures, and configuration precedence. **Subagent/agent-orchestration correctness** is the second cross-cutting theme, with false-success reporting and background-task wake-up bugs appearing in almost every tracker. Meanwhile, **MCP OAuth and credential lifecycle** has emerged as an unexpected source of enterprise friction across five of the seven tools. Finally, community sentiment reflects **release-cadence fatigue** — regressions introduced by rapid shipping are driving explicit requests for stable channels and better change control.

---

## 2. Activity Comparison

| Tool | Issues (updated 24h) | PRs (updated 24h) | Discussions | Release Status |
|---|---|---|---|---|
| **Claude Code** | ~15+ (incl. 8 OPEN + stale/closed) | 2 | N/A (none in dataset) | **v2.1.305** (stable) |
| **OpenAI Codex** | ~15+ | 10 (merged-heavy) | Yes — Ideas/Q&A/Show&Tell/General | **rust-v0.164.0-alpha.7/8** (alpha) |
| **Gemini CLI** | 10 | 10 (+2 notable) | N/A (none in dataset) | **v0.65.0 stable**, v0.66.0-preview.0, nightly |
| **GitHub Copilot CLI** | 10+ | **0** | N/A | **v1.0.101** + v1.0.101-1 |
| **OpenCode** | 10+ (50 updated threads) | 10 | N/A | No releases |
| **Pi** | 10 | 10 | Yes — Show & tell | No releases |
| **Qwen Code** | 10 | 10 | N/A | **v0.25.4-preview.0/1** + nightly |

**Notes:**
- Claude Code and Gemini CLI had **no Discussion activity** in the snapshot; GitHub Copilot CLI and OpenAI Codex both have Discussions sections, but Copilot CLI's was empty. These are marked "N/A" rather than interpreted as inactive.
- OpenAI Codex showed the **heaviest PR throughput** (10, mostly merged, with a coordinated enterprise-MCP auth cluster).
- GitHub Copilot CLI is the **only tool with zero PR activity**, suggesting either bot-driven or internal contributions.
- **Release cadence** is highest at Gemini CLI (3 releases), Qwen Code (3), and OpenAI Codex (2), with Copilot CLI on 2 and Claude Code on 1.

---

## 3. Shared Feature Directions

Five cross-cutting requirements appear in **three or more** tool communities:

### a) Extensibility / Plugin & Mod Architecture
- **Claude Code** (#91870 Mods, #99540 plugin policy ceiling)
- **Gemini CLI** (skills/subagents, AST tooling)
- **OpenCode** (plugin API completeness, exports resolution)
- **Pi** (extension lifecycle, public subpath exports)
- **Qwen Code** (#13749 Claude Code-style Mod runtime)

*Shared need:* A stable, versioned extension API with **loud failures** instead of silent no-ops, and a policy mechanism to constrain what third-party extensions can do.

### b) Subagent / Agent-Orchestration Correctness
- **Claude Code** (#88423 subagents never re-invoked after background task)
- **Gemini CLI** (#22323 false success, #21409 hangs, #22267 config ignored)
- **OpenCode** (#50206 malformed tool-call output)
- **Pi** (#11157 extensions at session_start breaking caching)

*Shared need:* Reliable wake-up/wake-down semantics, honest status reporting, and configuration contracts that the model can't silently bypass.

### c) MCP OAuth & Credential Lifecycle
- **Claude Code** (#42765 localhost vs 127.0.0.1, #91641 single-use refresh rotation)
- **OpenAI Codex** (enterprise MCP auth cluster: #55691, #55696, #55698)
- **GitHub Copilot CLI** (#4203 silent refresh failure, #4695 cache-key collisions, #5192 ACP token persistence)
- **Gemini CLI** (#29844 opt-in private network endpoints for MCP OAuth)

*Shared need:* Silent refresh, stable token persistence, and enterprise credential reuse — currently the single biggest blocker for headless/CI and regulated deployments.

### d) Prompt Caching & Cost Accuracy
- **OpenCode** (#57199 cache_control placement breaks caching)
- **Pi** (#11142 Responses API cache preservation, #8752 Bedrock usage normalization, #9980 OpenRouter cost mismatch)
- **Gemini CLI** (#29834 token metadata preservation)
- **Copilot CLI** (#2808 token counts in statusline)

*Shared need:* Cache invalidation as a first-class concern — tool changes, system-message placement, and provider mismatches silently inflate cost.

### e) Sandbox Policy & Configurability
- **Claude Code** (`allowNestedUserNamespaces` tradeoff, #99269 plugin eval regression)
- **OpenAI Codex** (Windows MXC launcher failures)
- **GitHub Copilot CLI** (#5173, #5177, #5206 regressions; #5105 Gradle daemon block)
- **Gemini CLI** (#19873 zero-dependency OS sandboxing)
- **Pi** (#10895 MDM system-level config)

*Shared need:* Granular sandbox controls, with **safe defaults** and clear path-level approvals — both ends of the spectrum (too loose, too strict) generate high-volume complaints.

---

## 4. Differentiation Analysis

| Dimension | Claude Code | OpenAI Codex | Gemini CLI | Copilot CLI | OpenCode | Pi | Qwen Code |
|---|---|---|---|---|---|---|---|
| **Primary focus** | Extensibility (Mods) | Enterprise MCP/auth + Windows desktop stability | Agent reliability + AST code intelligence | Permissions/sandbox correctness | Provider compat + desktop UX polish | Extension lifecycle + cross-platform TUI | Managed-agent infra + memory subsystem |
| **Target user** | Power users, agent builders | Pro Max users, enterprise | IDE/terminal developers, large codebases | GitHub ecosystem, CI/headless | Multi-provider tinkerers | Extension authors, finance/embedded | Daemon/remote-client users |
| **Approach** | Opinionated, rapid feature drops | Rust-native, alpha iteration | Stable + preview + nightly channels | Tight GitHub integration | Polished composer/TUI, multi-backend | Extension-first, provider-rich | Managed-agent + hosted infra |
| **Release cadence** | Moderate | Fast (alpha) | Very fast (3 in 24h) | Fast but regression-prone | Quiet (no releases) | Quiet (no releases) | Fast (preview/nightly) |
| **Community channel** | Issues only | Issues + Discussions | Issues only | Issues only | Issues only | Issues + Discussions | Issues only |

**Key differentiators:**
- **Claude Code** is the reference point for extensibility ambition (Mods), but is being outpaced on enterprise auth hardening by Codex.
- **OpenAI Codex** is the most enterprise-hardened in this snapshot — its PR cluster is almost entirely MCP auth/credential correctness.
- **Gemini CLI** has the most ambitious **architectural** agenda (AST tooling, zero-dep sandboxing), but its subagent reliability problems are the most severe.
- **Copilot CLI** is uniquely focused on **permission/sandbox regressions**, suggesting a mature feature set with unstable execution — and is the only tool explicitly being asked for a stable release channel.
- **OpenCode and Pi** are the most **polish-oriented** (composer UX, CJK rendering, TUI accessibility), reflecting their smaller but more dedicated user bases.
- **Qwen Code** is alone in its emphasis on **managed-agent infrastructure and memory subsystem transparency**.

---

## 5. Community Momentum & Maturity

**Highest raw engagement (measured by comments and upvotes):**
1. **Claude Code** — Issue #91870 (267 comments) and #87647 (105 👍) show the largest single-thread engagement in the dataset; there's a strong, opinionated user base with high institutional knowledge.
2. **OpenAI Codex** — Discussion #8503 (30 comments) and issue #53891 (31 comments) show broad reach, but sentiment skews frustrated (Windows crashes, safety false positives).
3. **Pi** — High comment counts on cross-platform TUI bugs (#6300: 17 comments) indicate a vocal Windows cohort actively driving fixes.

**Rapidly iterating (highest change velocity):**
- **Gemini CLI** — 3 releases, 10 merged PRs, heavy issue churn. Most active in the "shipping" sense.
- **Qwen Code** — 3 releases, 10 open PRs, active CI/hardening work on managed-agent subsystem. Signals a product moving from feature-builder to production-hardening.
- **OpenAI Codex** — 10 merged PRs, coordinated enterprise-MCP effort. Most *structured* iteration.

**Maturing / consolidating (fewer releases, more depth):**
- **OpenCode** and **Pi** — no releases but heavy PR queues. They are doing **UX surface-area work** on top of stable cores — a classic maturation signal.
- **GitHub Copilot CLI** — no PRs, but two patch releases. Release velocity is high; contribution model appears more controlled.

**Maturity signals to watch:**
- Requests for **stable channels** (Copilot CLI #5203) and **MDM system config** (Pi #10895) indicate these tools are entering **regulated/enterprise contexts**.
- Recurring **"silent failure" pain points** across OpenCode, Copilot CLI, Claude Code, and Gemini CLI suggest that error handling is the next quality frontier — features work, but fail invisibly.

---

## 6. Trend Signals

**Seven industry-level signals, each relevant to tool builders and technical decision-makers:**

### 1. Extensibility is the new moat — but governance is behind
Every major tool is investing in plugin/Mod lifecycles, yet **only Claude Code (#99540) and Pi (#10895) have visible policy-enforcement threads**. Expect a wave of "org ceiling on user-installed extensions" features across competitors by mid-2027. Teams standardizing on a CLI today should demand a documented extension policy model.

### 2. MCP OAuth is the hidden enterprise blocker
Five of seven tools show MCP auth/credential lifecycle bugs. The pattern — silent refresh failures, token cache collisions, and ephemeral-port origin mismatches — suggests **MCP's spec is not yet operationally mature** for headless or multi-tenant deployments. Enterprises adopting MCP should expect to fund custom auth plumbing.

### 3. Subagent reliability is the trust bottleneck
False-success reporting (Gemini CLI #22323, #21983), eternal hangs (#21409), and background-task wake-up bugs (Claude Code #88423) are **correctness** — not cosmetic — issues. Any workflow that trusts an agent's self-reported `status: "success"` is currently unsafe. This is the single highest-leverage area for differentiating on trustworthiness.

### 4. Sandbox defaults are simultaneously too loose and too strict
Claude Code's `allowNestedUserNamespaces` openly trades file protection for compatibility; Copilot CLI users complain about over-aggressive blocking (#5177, #5206). The industry has **not converged on a usable sandbox UX** — expect continued churn, and budget for allowlist tuning in production deployments.

### 5. Prompt caching is now a cost-control discipline
Tool re-declaration (Pi #11142), cache-marker placement (OpenCode #57199), and usage normalization (Pi #8752) all silently change spend. **Cache-aware design is no longer optional** for teams running high-volume agents — cost observability features (#29834, #2808) are worth tracking as selection criteria.

### 6. Release cadence is exceeding change-management maturity
Copilot CLI's regression cluster post-October harness migration, Pi's TUI bug wave, and the explicit request for a stable channel (#5203) suggest **the fastest shippers are taking the biggest reliability hit**. Teams with production dependencies should pin versions and watch for stable-channel offerings.

### 7. Accessibility and internationalization are entering the mainstream backlog
OpenCode (#39368 screen-reader TUI, #57491 ARIA), Pi (#10730 CJK emphasis), and Qwen Code (#14918 Web Shell UX) show a11y and non-English rendering are no longer niche. This is a **positive maturity signal** and a differentiator for organizations with diverse workforces.

---

### Bottom Line for Decision-Makers

- **Choose on governance fit, not feature checklists.** All tools are converging on similar capabilities; the differentiators are extension policy, sandbox ergonomics, and MCP/enterprise auth handling.
- **Assume MCP auth will need work** — budget integration time regardless of tool choice.
- **Do not trust subagent success signals today.** Instrument your pipelines around task completion, not reported status.
- **Pin versions and demand a stable channel** if you're deploying to production in the next two quarters, particularly for Copilot CLI and fast-cadence tools.
- **Track cache-aware features actively** — they are becoming a first-order cost lever for any non-trivial agent deployment.

*Report generated from 2026-10-21 community digests across seven AI CLI repositories. Issue/PR counts reflect snapshot data and may undercount total repository activity.*

---

## Per-Tool Reports

<details>
<summary><strong>Claude Code</strong> — <a href="https://github.com/anthropics/claude-code">anthropics/claude-code</a></summary>

## Claude Code Skills Highlights

> Source: [anthropics/skills](https://github.com/anthropics/skills)

# Claude Code Skills — Community Highlights Report
*Data as of 2026-10-21 | Source: github.com/anthropics/skills*

---

## 1. Top Skills Ranking (Most-Discussed PRs)

> Note: The top-20 PR list exposes mostly contributions with unreported comment counts; ranking below reflects overall attention signal (issue-linked engagement, recency, scope, and 👍).

| # | Skill / PR | Functionality | Discussion Highlights | Status |
|---|---|---|---|---|
| 1 | **mcp-builder fix** — [#1742](https://github.com/anthropics/skills/pull/1742) | Updates `connections.py` for `mcp>=2.0.0` (`streamable_http_client` rename + custom headers via `create_mcp_http_client`) | Fixes [#1668](https://github.com/anthropics/skills/issues/1668); paired with issue [#1390](https://github.com/anthropics/skills/issues/1390) where `evaluation.py` scores 0/N on real MCP servers | OPEN |
| 2 | **skill-creator hardening** — [#1298](https://github.com/anthropics/skills/pull/1298) | Isolates trigger evals; fixes Windows subprocess `select()` failures and runtime failure handling | Directly answers issues [#556](https://github.com/anthropics/skills/issues/556) (0% trigger rate), [#1383](https://github.com/anthropics/skills/issues/1383), [#202](https://github.com/anthropics/skills/issues/202) | OPEN |
| 3 | **skill-creator eval-viewer security** — [#1961](https://github.com/anthropics/skills/pull/1961) | Fixes script breakout, DNS rebinding, cross-site POST, and escaping in viewer | Complements issue [#1394](https://github.com/anthropics/skills/issues/1394) (attribute-unsafe `escapeHtml` → display-path XSS) | OPEN |
| 4 | **notion-spec-to-implementation + quantitative-resume-auditor** — [#1245](https://github.com/anthropics/skills/pull/1245) | Converts Notion specs into implementable Notion tasks with acceptance criteria; audits resumes quantitatively | Representative of the "PM workflow → execution" contribution wave; sustained updates through Oct | OPEN |
| 5 | **proofcore-contract-auditor** — [#1771](https://github.com/anthropics/skills/pull/1771) | Static analysis of Solidity/Rust contracts; anchors Merkle audit proofs to TON Blockchain | Web3 vertical entry; notable for zero-storage notarization design | OPEN |
| 6 | **pyxel (retro game dev)** — [#525](https://github.com/anthropics/skills/pull/525) | Guides creation/debugging of Pyxel Python games with headless input-driven runs and frame inspection | One of the longest-lived open PRs (since Mar 2026), still updated in Sep | OPEN |
| 7 | **document-typography** — [#514](https://github.com/anthropics/skills/pull/514) | Prevents orphan word wrap, widow paragraphs, numbering misalignment in generated docs | Argues typographic QC benefits *every* generated document — a horizontal concern | OPEN |
| 8 | **md2video-audio** — [#1703](https://github.com/anthropics/skills/pull/1703) | Zero-cost Markdown → MP4 with Marp slides and human-like voiceover | Example of media-generation skill demand beyond text artifacts | OPEN |

Also notable: [#1734](https://github.com/anthropics/skills/pull/1734) (orphaned docx comment detection), [#1792](https://github.com/anthropics/skills/pull/1792) (docx LibreOffice timeout correctness), [#1977](https://github.com/anthropics/skills/pull/1977) & [#1976](https://github.com/anthropics/skills/pull/1976) (algorithmic-art / webapp-testing correctness fixes from the same contributor).

---

## 2. Community Demand Trends (From Issues)

- **Trust & distribution safety** — Issue [#492](https://github.com/anthropics/skills/issues/492) (46 comments, the single most-discussed issue) warns that community skills ship under the `anthropic/` namespace, enabling trust-boundary impersonation. Adjacent: [#189](https://github.com/anthropics/skills/issues/189) (duplicate content between `document-skills` and `example-skills`).
- **Team/org-scale skill management** — [#228](https://github.com/anthropics/skills/issues/228) (16 comments, 8👍) requests org-wide shared skill libraries instead of Slack-and-upload workflows.
- **Skill quality tooling (meta-skills)** — [#202](https://github.com/anthropics/skills/issues/202) pushes `skill-creator` toward operational best practice; PR [#83](https://github.com/anthropics/skills/pull/83) proposes `skill-quality-analyzer` + `skill-security-analyzer`.
- **Agent governance & reasoning quality** — [#412](https://github.com/anthropics/skills/issues/412) (policy enforcement, trust scoring, audit trails) and [#1385](https://github.com/anthropics/skills/issues/1385) (three-gate reasoning quality pipeline).
- **Context-efficiency skills** — [#1487](https://github.com/anthropics/skills/issues/1487): `claude-api` eagerly injects ~156k tokens in a single call; [#1329](https://github.com/anthropics/skills/issues/1329) proposes `compact-memory` symbolic notation to shrink agent state.
- **Format coverage** — [#486](https://github.com/anthropics/skills/pull/486) (ODT/ODS) shows demand for open-standard document formats alongside PDF/DOCX.

**Distilled directions:** trust/security of skill distribution → org governance of skills → quality-control and context-budget tooling, roughly in that order of community urgency.

---

## 3. High-Potential Pending Skills (Active, Not Yet Merged)

| PR | Skill | Why It May Land Soon |
|---|---|---|
| [#1703](https://github.com/anthropics/skills/pull/1703) | `md2video-audio` | Recently active; clear zero-dependency value proposition |
| [#1771](https://github.com/anthropics/skills/pull/1771) | `proofcore-contract-auditor` | New vertical (Web3) with verifiable audit-proof mechanism |
| [#1298](https://github.com/anthropics/skills/pull/1298) | skill-creator eval fixes | Fixes multiple open issues (#556, #1383); high leverage on the whole ecosystem |
| [#1961](https://github.com/anthropics/skills/pull/1961) | eval-viewer hardening | Security fix track alongside [#1394](https://github.com/anthropics/skills/issues/1394) |
| [#1734](https://github.com/anthropics/skills/pull/1734) | orphaned docx comments | Small, scoped docx correctness improvement |
| [#1615](https://github.com/anthropics/skills/pull/1615) | `scnet-hpc` | HPC/Slurm profiles — a new enterprise vertical |
| [#1997](https://github.com/anthropics/skills/pull/1997) | YAML frontmatter parsing fix | Correctness fix touching eval/description optimization pipeline; updated Oct 19 |

---

## 4. Skills Ecosystem Insight

**The community's most concentrated demand is not new skill categories but trust, quality, and correctness of the skills themselves** — namespace/trust-boundary security, reliable trigger evaluation, and format-toolchain bug fixes dominate the conversation far more than net-new capabilities.

---

# Claude Code Community Digest — 2026-10-21

## 1. Today's Highlights

The extensibility push around "Mods" (issue #91870) continues to dominate community attention with 267 comments, while a new PR thread (#99540) signals that org-level policy ceilings are being extended to cover user-installed plugins. Meanwhile, the sandbox subsystem got a notable capability expansion in v2.1.305 with `sandbox.allowNestedUserNamespaces` — a change that explicitly trades file-protection scope for compatibility with Chromium and rootless podman. On the bug front, a meta-report (#87647) claiming over 6,000 "has repro" issues were auto-closed without resolution is drawing significant community upvotes.

## 2. Releases

**v2.1.305** (last 24h)
- Added `sandbox.allowNestedUserNamespaces` — allows sandboxed Linux commands to create user namespaces (needed for Chromium, rootless podman). Note: the release notes acknowledge this lets sandboxed processes "get around the sandbox's file protections," so it's a deliberate security/compatibility tradeoff.
- Added `CLAUDE_CODE_RETRY_WATCHDOG_USAGE_LIMIT_RECHECK_MS` for tuning unattended retry-mode usage-limit rechecks (details truncated in release notes).
- No direct GitHub link available for the release entry in the provided data.

## 3. Hot Issues

1. **[#91870] Mods — make Claude 10x more extensible** (OPEN, 267 comments, 131 👍) — The flagship extensibility thread; community updates posted Sept 9 and Oct 1. High engagement suggests this is the single most-watched initiative. [Link](https://github.com/anthropics/claude-code/issues/91870)

2. **[#87647] Over 6k "has repro" issues auto-closed since March 2026** (OPEN, 19 comments, 105 👍) — A meta-bug alleging systematic auto-closure of reproducible issues. High upvote ratio relative to comments indicates broad agreement; this is a trust/process concern. [Link](https://github.com/anthropics/claude-code/issues/87647)

3. **[#42765] OAuth redirect_uri uses localhost instead of 127.0.0.1, violating RFC 8252 §7.3** (OPEN, 17 comments, 37 👍) — Long-standing (since April) spec-compliance bug affecting MCP auth flows; still unresolved six months in. [Link](https://github.com/anthropics/claude-code/issues/42765)

4. **[#68262] Subfolders / nested organization within Projects** (OPEN, 13 comments, 32 👍) — Persistent demand for hierarchical project organization across web, desktop, and mobile. [Link](https://github.com/anthropics/claude-code/issues/68262)

5. **[#74682] Auto-archive for scheduled routine run sessions** (OPEN, 7 comments) — Desktop cron users running ~18 sessions/day are drowning in stale tabs; a narrowly-scoped but high-friction workflow request. [Link](https://github.com/anthropics/claude-code/issues/74682)

6. **[#91641] Remote MCP OAuth: shared user-scope refresh token breaks on single-use rotation IdPs** (OPEN, 6 comments) — Interop bug against ODC; matters for enterprise OAuth deployments using rotating refresh tokens. [Link](https://github.com/anthropics/claude-code/issues/91641)

7. **[#88423] In-process subagents never re-invoked when their background Bash/Monitor task completes** (OPEN, 4 comments) — Agent-orchestration correctness bug; subagents silently stall after background work finishes with no wake-up. [Link](https://github.com/anthropics/claude-code/issues/88423)

8. **[#92769] Plugin skills with `disable-model-invocation: true` are hidden from the model** (OPEN, 3 comments) — Plugins using this flag become effectively invisible; a real usability trap for skill authors. [Link](https://github.com/anthropics/claude-code/issues/92769)

9. **[#103851] Cloud routines: repo-committed `.claude/skills/` not loaded while hooks/settings.json are** (OPEN, 2 comments) — Inconsistency in what cloud sessions pick up from a repo; blocks teams relying on committed skills in scheduled runs. [Link](https://github.com/anthropics/claude-code/issues/103851)

10. **[#99269] `claude plugin eval`: every Bash call fails on stock Ubuntu (apply-seccomp setgroups)** (OPEN, 2 comments, 2 👍) — Sandbox regression blocks plugin eval entirely on clean Ubuntu; the documented workaround can't be applied inside eval. [Link](https://github.com/anthropics/claude-code/issues/99269)

*Also notable:* [#103864](https://github.com/anthropics/claude-code/issues/103864) — "Require trusted devices" silently blocks agent-to-session actions with no approve-on-device override.

## 4. Key PR Progress

Only two PRs updated in the last 24h, both from the same author (poteat), and both appear tied to the "Mods"/extensibility architecture:

1. **[#99141] diff: a pane nothing can draw yet is kept, and shows once something can** (OPEN) — Fixes `/diff` so a pane opened before any renderer attaches is preserved and appears as soon as one can. Stacked on #99118. [Link](https://github.com/anthropics/claude-code/pull/99141)

2. **[#99540] sec-default: org ceiling on a tool holds over plugins a person installs** (OPEN) — Extends an organization's tool-approval ceiling to cover user-installed plugins, with every deciding hook carrying a `.catch`. Directly relevant to enterprise policy enforcement. [Link](https://github.com/anthropics/claude-code/pull/99540)

*(Only 2 PRs total were reported, so the requested 10-item list cannot be filled — noting this for completeness.)*

## 5. Hot Discussions

No Discussion data was provided in the source dataset; this section is omitted.

## 6. Feature Request Trends

Distilled from the issue set, recurring directions include:

- **Extensibility & Mods ecosystem** — #91870, #99417 (silent prompt consumption by `prompt.submit` hooks), #99540 (plugin policy enforcement). This is the dominant theme.
- **Sandbox configurability** — v2.1.305's `allowNestedUserNamespaces` plus ongoing friction (#99269) shows users want finer-grained sandbox control without full escape hatches.
- **Project/workspace organization** — #68262 (nested subfolders), #74682 (auto-archive routine sessions) — managing growing project clutter across surfaces.
- **Enterprise auth & policy** — #42765, #91641, #103864 — OAuth spec compliance, token rotation interop, and trusted-device gating.
- **Agent/subagent orchestration correctness** — #88423 highlights demand for reliable background-task wake-up semantics.
- **Localization** — #90901 (Russian UI) — small but persistent.

## 7. Developer Pain Points

- **Auto-closure distrust**: #87647's 6k-issue claim (105 👍) reflects a broader frustration that reproducible bugs are being closed stale-bot-style rather than fixed — reinforced by the many `[stale]`/`[CLOSED]` entries in today's list (e.g., #80184, #89580, #89576, #89575).
- **Sandbox breakage on clean Linux installs**: `apply-seccomp`/`setgroups` failures (#43454 lineage, #99269) block plugin eval and Bash calls out of the box on Ubuntu.
- **Platform-specific performance & correctness**: Windows Git Bash shell-snapshot overhead of ~5–9s per Bash call (#89580) and MAX_PATH overruns (#91935) disproportionately impact Windows users.
- **OAuth/MCP interop**: localhost vs 127.0.0.1 (#42765) and single-use refresh token rotation (#91641) continue to bite MCP integrations.
- **Silent no-ops**: skills hidden by `disable-model-invocation` (#92769), skill-creator's eval loop failing silently on Windows (#89575), and cloud routines not loading committed skills (#103851) — a recurring pattern of features failing quietly rather than erroring visibly.

---

*Note: The provided dataset contained only 2 PRs and no Discussion data for the last 24h, so sections 4 and 5 are shorter than the requested 10-item targets.*

</details>

<details>
<summary><strong>OpenAI Codex</strong> — <a href="https://github.com/openai/codex">openai/codex</a></summary>

# OpenAI Codex Community Digest — 2026-10-21

## 1. Today's Highlights

Two alpha releases of the Rust toolchain (`rust-v0.164.0-alpha.7/8`) landed in the last 24 hours, signaling active iteration toward the 0.164 line. The issue tracker remains dominated by cross-platform stability problems, particularly Windows desktop crashes and performance regressions, alongside a growing cluster of MCP authentication and enterprise credential-handling fixes merged via the `copyberry` bot. Community discussions show sustained demand for remote control, usage-limit transparency, and mid-tier subscription options.

---

## 2. Releases

- **rust-v0.164.0-alpha.8** — Release 0.164.0-alpha.8 ([link](https://github.com/openai/codex/releases))
- **rust-v0.164.0-alpha.7** — Release 0.164.0-alpha.7 ([link](https://github.com/openai/codex/releases))

No detailed changelogs were published; both are incremental alpha builds.

---

## 3. Hot Issues

1. **[#53891](https://github.com/openai/codex/issues/53891)** — *macOS update checks fail (HTTP 520 from appcast endpoint)*. 31 comments, 15 👍. Highest-engagement issue today; updater infrastructure appears to be returning Cloudflare errors, blocking Pro Max users from receiving updates.
2. **[#34306](https://github.com/openai/codex/issues/34306)** — *Cybersecurity safety-check false positive*. 23 comments, 18 👍. A long-running complaint that Codex CLI's safety layer blocks legitimate requests, with the issue title itself redacted by the filter.
3. **[#50870](https://github.com/openai/codex/issues/50870)** — *Dots/Voice calls ring without connecting across iPhone, Mac, Windows web*. 22 comments. Cross-device voice session regression affecting the Dots feature.
4. **[#48449](https://github.com/openai/codex/issues/48449)** — *Windows app crashes during Browser Use tab teardown*. 16 comments. Repeated crash + spurious password-save prompts suggest lifecycle bugs in the embedded browser.
5. **[#34953](https://github.com/openai/codex/issues/34953)** — *Windows Codex Desktop leaks full-size Git LFS temp copies*. 15 comments, 5 👍. Memory/disk leak with real resource impact on large repos.
6. **[#52042](https://github.com/openai/codex/issues/52042)** — *Windows file-processing tools fail to start (MXC launcher security env error)*. 14 comments. Blocks Excel/file workflows entirely on Windows.
7. **[#54626](https://github.com/openai/codex/issues/54626)** — *Cannot delete Custom MCP Plugins*. 14 comments, 6 👍. UI-level MCP management bug with clear reproducibility.
8. **[#45752](https://github.com/openai/codex/issues/45752)** — *macOS Voice 403 "Voice session access denied"*. 13 comments. Auth regression on `/v1/live` since early September.
9. **[#50430](https://github.com/openai/codex/issues/50430)** — *VS Code extension on Windows: chat stalls + dictation 403 (cloudflare_challenge)*. 13 comments. Extension-level connectivity failure affecting core workflow.
10. **[#55271](https://github.com/openai/codex/issues/55271)** — *iPadOS Safari `DisposableStack` error blocks Codex Cloud prompt submission*. 8 comments, 4 👍. Newest entry, indicating a JavaScript compatibility regression on Safari.

Also notable: **[#55699](https://github.com/openai/codex/issues/55699)** — an unusually hostile but high-signal complaint about cybersecurity blockers, reflecting ongoing frustration with the safety layer.

---

## 4. Key PR Progress

1. **[#55701](https://github.com/openai/codex/pull/55701)** — *Enable MCP OAuth refresh coordination by default*. Stabilizes MCP auth refresh; merged.
2. **[#55698](https://github.com/openai/codex/pull/55698)** — *Reuse Codex account grants for enterprise MCP authentication*. Prefers stored enterprise credentials, with fallback to Codex OAuth grants matched by issuer.
3. **[#55696](https://github.com/openai/codex/pull/55696)** — *Preserve enterprise MCP authorization across runtime refreshes*. Ensures config reloads don't drop authorization for running threads.
4. **[#55691](https://github.com/openai/codex/pull/55691)** — *Refine enterprise MCP auth errors and authority checks*. Improves error classification and admin guidance without leaking provider error text.
5. **[#55682](https://github.com/openai/codex/pull/55682)** — *Fix TUI permission selection and session state handling*. Addresses queued-prompt/permissions-menu races and stale model access when switching projects.
6. **[#55677](https://github.com/openai/codex/pull/55677)** — *Upgrade Rust toolchain to 1.99.1*. Updates Cargo/Bazel pins, CI workflows, and adapts to new APIs (`try_update`, `as_chunks`).
7. **[#55667](https://github.com/openai/codex/pull/55667)** — *Enable app routing for remote curated Agent Plugins*. Lets curated plugins declare app routes instead of direct MCP connections.
8. **[#55657](https://github.com/openai/codex/pull/55657)** — *Add lifecycle hooks for inter-agent messages*. New `MessageLifecycleContributor` hooks for capturing extension state during message publish/commit.
9. **[#55652](https://github.com/openai/codex/pull/55652)** — *Search compressed rollouts concurrently*. Parallelizes rollout scans (up to 4 batches) with shared compiled patterns.
10. **[#55646](https://github.com/openai/codex/pull/55646)** — *Guard auth persistence and reloads against concurrent login changes*. Prevents stale refreshes from overwriting credentials after login/logout.

Open dependabot PRs **[#35882](https://github.com/openai/codex/pull/35882)** and **[#26278](https://github.com/openai/codex/pull/26278)** (rust-toolchain bumps) remain unmerged, effectively superseded by #55677.

---

## 5. Hot Discussions

### Ideas
- **[#14595](https://github.com/openai/codex/discussions/14595)** — *Remote control when?* (9 comments, 18 👍). Top-voted discussion; users point to Claude Code's remote control as a competitive gap.
- **[#51263](https://github.com/openai/codex/discussions/51263)** — *Add a $35 Developer Plan with 2× Plus usage*. Proposes a mid-tier subscription between Plus and Pro.

### Q&A
- **[#24258](https://github.com/openai/codex/discussions/24258)** — *How does the Codex Chrome skill choose a Chrome profile?* Multi-profile users want explicit control.
- **[#55553](https://github.com/openai/codex/discussions/55553)** — *Remote execution preflight EACCES on process executable link*. Requests attribution/support route for a runtime-guard failure.

### Show and tell
- **[#55086](https://github.com/openai/codex/discussions/55086)** — *KiraBridge + ThreadDesk*: connecting seven tools for controllable, voice-driven vibe coding.
- **[#54349](https://github.com/openai/codex/discussions/54349)** — *Logo to Stickers*: Codex skill for brand characters.
- **[#55421](https://github.com/openai/codex/discussions/55421)** — *TAHU*: authorization-gateway prototype; seeking 3 developer trials.
- **[#55643](https://github.com/openai/codex/discussions/55643)** — *Kingdoms*: strategy prototype driven by conversation with Codex.
- **[#55637](https://github.com/openai/codex/discussions/55637)** — *Koto*: local-first model selection for Codex (Apache-2.0).
- **[#55552](https://github.com/openai/codex/discussions/55552)** — *Pitchcraft*: pitch decks from repository evidence.
- **[#55539](https://github.com/openai/codex/discussions/55539)** — *Cove*: native Mac composer/diff viewer wrapping Codex and Claude Code.

### General
- **[#8503](https://github.com/openai/codex/discussions/8503)** — *"usage limit reached" despite 100% remaining* (30 comments, 13 👍). Persistent GitHub Connector quota mismatch; highest-activity thread overall.

---

## 6. Feature Request Trends

- **Remote control / cross-device operation** — Discussion #14595 (18 👍) plus the Dots cross-device failures (#50870) point to strong demand for reliable remote session control.
- **Tiered pricing** — #51263 requests a $35 "Developer" plan between Plus and Pro, citing usage-limit friction for regular Codex work.
- **MCP management UX** — Deletion (#54626), runtime tool refresh (#35583), and plugin routing (#55667) collectively show MCP lifecycle management is a maturing but rough area.
- **Configurable IDE surfaces** — #50264 asks for configurable recent-chat counts in the extension sidebar.
- **Chrome profile selection** — #24258 requests explicit profile targeting for the Chrome skill.
- **Composer/markdown polish** — #29168 (closed) and #54732 highlight interest in prompt-area styling and paste behavior.

---

## 7. Developer Pain Points

1. **Windows desktop stability** — Crash loops (#48449), Git LFS leaks (#34953), renderer accumulation (#55151), 3-minute command startup (#55040), and broken file tools (#52042) form the single largest cluster of complaints.
2. **Connectivity / auth regressions** — HTTP 520 on appcast (#53891), Voice 403 (#45752), Cloudflare challenges in the VS Code extension (#50430), and workspace routing 404s (#55566) suggest fragile backend routing.
3. **Safety-check false positives** — #34306, #43189, and #55699 collectively show the cybersecurity filter is blocking legitimate work and generating significant frustration.
4. **MCP auth/credential fragility** — The flurry of enterprise MCP PRs (#55691, #55696, #55698, #55680, #55685) implies real-world auth-refresh and credential-ownership bugs.
5. **Usage-limit transparency** — #8503's 30-comment thread and #55507's 429 errors indicate quota accounting is inconsistent with what users see.
6. **MCP tool lifecycle** — Tools added at runtime aren't surfaced (#35583), and custom plugins can't be deleted (#54626).
7. **Safari/iOS compatibility** — #55271 (`DisposableStack`) and #53558 (iOS environment picker) indicate the web/cloud client lags behind desktop parity.

</details>

<details>
<summary><strong>Gemini CLI</strong> — <a href="https://github.com/google-gemini/gemini-cli">google-gemini/gemini-cli</a></summary>

# Gemini CLI Community Digest — 2026-10-21

## 1. Today's Highlights

The Gemini CLI project shipped three releases in the last 24 hours, including the stable **v0.65.0** and the **v0.66.0-preview.0** cut, alongside continued nightly work on terminal rendering and streamed HTTP handling. Agent reliability remains the dominant theme: the top issues cluster around subagent failures, false success reporting, and configuration overrides being silently ignored. Meanwhile, PR activity is heavy on sandbox/IDE bridging, security hardening of untrusted command flags, and token-usage metadata correctness.

## 2. Releases

Three releases landed in the past 24 hours:

- **v0.65.0 (stable)** — Security and session-integrity fixes: enforces read-only workspace settings in untrusted folders ([#29583](https://github.com/google-gemini/gemini-cli/pull/29583)), and prevents duplicate tool response turns when resuming sessions.
- **v0.66.0-preview.0** — Rolling preview cut; includes ROADMAP.md cleanup removing the outdated 2025 roadmap and the v0.65.0-preview changelog.
- **v0.66.0-nightly.20261020.g76e4d7c04** — Terminal UX and correctness fixes: preserves terminal scrollback during viewport refreshes ([#29792](https://github.com/google-gemini/gemini-cli/pull/29792)) and decodes streamed Node HTTP activity chunks with `StringDecoder`.

## 3. Hot Issues

1. **[#22323](https://github.com/google-gemini/gemini-cli/issues/22323) — Subagent MAX_TURNS reported as GOAL success (13 comments, 👍2)** — The `codebase_investigator` subagent reports `status: "success"` despite hitting the turn limit before doing any work. This is the highest-signal bug in the tracker: it means automated pipelines may trust incomplete analysis. Tagged p1 and awaiting retest.

2. **[#19873](https://github.com/google-gemini/gemini-cli/issues/19873) — Zero-dependency OS sandboxing + post-execution intent routing (9 comments)** — Proposes leaning into Gemini 3's native bash affinity by sandboxing execution and routing intent after commands run. A large-effort enhancement that could reshape tool safety architecture.

3. **[#21409](https://github.com/google-gemini/gemini-cli/issues/21409) — Generalist agent hangs forever (8 comments, 👍8)** — Simple tasks like folder creation hang indefinitely when the CLI defers to the generalist agent; users work around it by disabling subagents entirely. High community agreement (👍8) and p1 priority.

4. **[#22745](https://github.com/google-gemini/gemini-cli/issues/22745) — Assess AST-aware reads, search, and mapping (7 comments)** — Epic tracking whether AST-aware tooling reduces misaligned reads and token noise. Related investigations: [#22746](https://github.com/google-gemini/gemini-cli/issues/22746) (codebase mapping) and [#22747](https://github.com/google-gemini/gemini-cli/issues/22747) (AST-grep for reads/search).

5. **[#21968](https://github.com/google-gemini/gemini-cli/issues/21968) — Gemini under-uses skills and subagents (7 comments)** — Anecdotal but persistent: custom skills like "gradle" and "git" are ignored unless explicitly invoked. Points to a routing/discovery gap in skill selection.

6. **[#22267](https://github.com/google-gemini/gemini-cli/issues/22267) — Browser Agent ignores settings.json overrides (4 comments)** — `maxTurns` and similar settings are read by `AgentRegistry` at init but never applied by the Browser Agent. A configuration-contract violation.

7. **[#21983](https://github.com/google-gemini/gemini-cli/issues/21983) — Browser subagent fails on Wayland (4 comments, 👍1)** — Reports a GOAL termination despite failure. Linux/Wayland users remain a meaningful cohort hitting platform-specific agent breakage.

8. **[#24246](https://github.com/google-gemini/gemini-cli/issues/24246) — 400 error with >128 tools (3 comments)** — Too many tools in scope produces HTTP 400. Suggests the need for smarter tool scoping as MCP adoption grows (see also PR #29846 on paginated discovery).

9. **[#22672](https://github.com/google-gemini/gemini-cli/issues/22672) — Agent should discourage destructive behavior (3 comments, 👍1)** — The model occasionally reaches for `git reset` or `--force` when safer alternatives exist. Safety-adjacent and broadly applicable.

10. **[#21763](https://github.com/google-gemini/gemini-cli/issues/21763) — Bug reports omit subagent context (2 comments)** — `/bug` reports only capture the main session, making subagent failures hard to diagnose. Directly compounds the debugging difficulty of issues like #22323 and #21409.

## 4. Key PR Progress

1. **[#29858](https://github.com/google-gemini/gemini-cli/pull/29858) — Bridge IDE companion into container sandboxes over exec stdio** — Makes `/ide status`, `/ide enable`, open-file context, and native diffs work when the CLI runs in Docker/Podman/runsc sandboxes. Closes a long-standing gap; supersedes docs-only PR #29748.

2. **[#29849](https://github.com/google-gemini/gemini-cli/pull/29849) — Handle termination signals in non-interactive mode** — Stops headless runs from executing delayed provider tool calls and submitting repeated results after SIGINT/SIGTERM. Important for CI safety.

3. **[#29833](https://github.com/google-gemini/gemini-cli/pull/29833) — Scope untrusted flag checks to external output** — Reduces repeated shell-command confirmation prompts by not treating the agent's own command output as external input, and remembers approved flags. Directly addresses confirmation fatigue.

4. **[#29834](https://github.com/google-gemini/gemini-cli/pull/29834) — Preserve extended token usage metadata (p1)** — Keeps `thoughtsTokenCount`, `toolUsePromptTokenCount`, and `cachedContentTokenCount` intact across a2a-server and core, aligning per-turn reporting. Matters for cost observability.

5. **[#29846](https://github.com/google-gemini/gemini-cli/pull/29846) — Paginate MCP tool discovery safely** — MCP servers that paginate `tools/list` currently expose only page one; this fetches all pages on discovery and refresh. Likely mitigates the >128-tools 400 error class.

6. **[#29828](https://github.com/google-gemini/gemini-cli/pull/29828) — Ensure all model turns with function calls receive thought signatures** — Fixes HTTP 400 `Function call is missing a thought_signature` on multi-turn conversations where historical tool calls precede new prompts.

7. **[#29847](https://github.com/google-gemini/gemini-cli/pull/29847) — Prevent duplicate agent loading when workspace is home dir** — Eliminates false-positive "Duplicate agent name" warnings when running from `~` or `C:\Users\username`.

8. **[#29848](https://github.com/google-gemini/gemini-cli/pull/29848) — Exclude IDE settings and GEMINI.md from open-file context** — Stops `.vscode/settings.json`, user profile settings, and `GEMINI.md` from being injected as active editor context, reducing prompt noise and accidental secret exposure.

9. **[#29850](https://github.com/google-gemini/gemini-cli/pull/29850) — Mount express.json() before A2A SDK routes** — Middleware-order fix in the a2a-server so JSON bodies parse correctly for all registered routes.

10. **[#29844](https://github.com/google-gemini/gemini-cli/pull/29844) — Opt-in private network endpoints for MCP OAuth** — Adds `oauth.allowPrivateNetwork` for MCP servers on RFC 1918/6598/4193 and `.internal`/`.local` endpoints. Unlocks enterprise deployments where MCP hosts live on internal networks.

Also notable: **[#29664](https://github.com/google-gemini/gemini-cli/pull/29664)** (74-package npm dependency bump, p1) and **[#29855](https://github.com/google-gemini/gemini-cli/pull/29855)** (OSS VRP security PoC — explicitly not for merge).

## 5. Hot Discussions

No Discussions data was provided for this period; this section is omitted.

## 6. Feature Request Trends

- **AST-aware code intelligence** — A coordinated cluster of issues (#22745, #22746, #22747) explores AST-based file reads, search, and codebase mapping to cut turns and token noise.
- **Persistent, file-based task tracking** — #18836 proposes replacing in-context `WriteToDo` with CRUD-backed task state to combat context rot and cross-session memory loss.
- **Token-frugal "surgical" context** — #19561's "Tactful Extraction" hierarchy (grep first, targeted reads) reflects a broader push to reduce the ~36.6k-token/turn baseline.
- **Subagent observability** — #22598 requests subagent trajectories via `/chat share`; #21763 asks for subagent context in bug reports.
- **Parallel/shared-memory subagents** — #18287 (blocked on parallel subagent support) and #18285 (subagent discovery via `settings.json`) signal appetite for multi-agent orchestration.
- **Per-workspace policy** — #18397 requests workspace-scoped policies instead of global-only, aimed at multi-project users.

## 7. Developer Pain Points

1. **Subagent reliability is the top frustration.** Hangs (#21409), false success on turn exhaustion (#22323, #21983), and ignored configuration (#22267) combine into a trust problem — one workaround is disabling subagents entirely, which negates their value.
2. **Under-triggering of skills and subagents (#21968).** Users build skills that the model then doesn't invoke without explicit instruction, undermining the extensibility model.
3. **Confirmation fatigue and destructive commands.** Repeated shell-command prompts (being addressed by #29833) coexist with anxiety about `git reset`/`--force` usage (#22672) — users want fewer prompts but better guardrails.
4. **Context bloat and cost opacity.** High per-turn token baselines (#19561), missing token metadata (#29834), and firehose file reads drive demand for AST tooling and surgical extraction.
5. **Platform and environment friction.** Wayland failures (#21983), container-sandbox IDE gaps (#29858), symlinked agent files not recognized (#20079), and the >128-tools 400 error (#24246) all point to edge environments receiving less coverage than the happy path.
6. **Diagnosability gaps.** Bug reports lacking subagent context (#21763) make the above issues harder to triage, slowing resolution of exactly the problems users care most about.

</details>

<details>
<summary><strong>GitHub Copilot CLI</strong> — <a href="https://github.com/github/copilot-cli">github/copilot-cli</a></summary>

# GitHub Copilot CLI Community Digest — 2026-10-21

## Today's Highlights

The CLI shipped two releases in the last 24 hours (v1.0.101 and v1.0.101-1), headlined by **native structured output for dynamic workflow subagents** and a new **`assistedApprovalInstructions`** setting for Assisted Permissions. A key permissions fix finally addresses long-standing friction where shell commands creating *and* entering a directory were hard-denied instead of triggering a path-approval prompt (see #5173). Meanwhile, the issue tracker is dominated by sandbox and permissions regressions introduced around the October harness migration and 1.0.99-0.

---

## Releases

**v1.0.101** — [Release link](https://github.com/github/copilot-cli/releases)
- Add native structured output for dynamic workflow subagents on supported models
- Add `assistedApprovalInstructions` setting to guide Assisted Permissions confirmation decisions
- Shell commands that create and then enter a directory now request path approval instead of being denied early

**v1.0.101-1** — [Release link](https://github.com/github/copilot-cli/releases)
- Resuming a session shows the conversation sooner without waiting for placeholder environment setup
- Starting a session with sandboxed MCP servers now avoids unnecessary restarts and responds faster
- Allow `/config` and `/settings` to set and unset `showReasoning`
- Permission approval improvements (details truncated)

---

## Hot Issues

1. **[#5105 CLOSED] macOS sandbox blocks Gradle daemon connection** — [Link](https://github.com/github/copilot-cli/issues/5105)
   The sandbox blocks the Gradle client from connecting to its localhost daemon even when local networking is allowed. High-impact for JVM developers; closed after 6 comments.

2. **[#5173 OPEN] `cd` into a self-created directory is hard-denied** — [Link](https://github.com/github/copilot-cli/issues/5173)
   Since 1.0.99-0, commands that `cd` into a directory created in the same command fail with "unusable session working directory." Highly relevant given v1.0.101 partially addresses this class of bug.

3. **[#5177 OPEN] Regression: manual approval no longer prompts for repo-mutating Git commands** — [Link](https://github.com/github/copilot-cli/issues/5177)
   Reported regression from the October harness migration: `git add`/`commit`/etc. execute without approval. Serious safety concern drawing developer scrutiny.

4. **[#5206 OPEN] Explicit-approval requests silently denied in resumed sessions** — [Link](https://github.com/github/copilot-cli/issues/5206)
   Resumed interactive sessions silently deny all approval-requiring tools, even with allow-all active. Compounds the permissions theme.

5. **[#2955 OPEN] `/allow-all` does not suppress bash prompts** — [Link](https://github.com/github/copilot-cli/issues/2955)
   Long-running issue (since April) where `/allow-all` still triggers per-command dialogs. Persistent annoyance for automation users.

6. **[#4203 OPEN] Remote MCP OAuth: expired token forces interactive re-auth instead of silent refresh** — [Link](https://github.com/github/copilot-cli/issues/4203)
   The CLI ignores cached refresh tokens (RFC 6749 §6) and forces browser logins. 3 👍, signaling strong resonance.

7. **[#4695 OPEN] MCP OAuth tokens not reliably reused across sessions** — [Link](https://github.com/github/copilot-cli/issues/4695)
   Duplicate cache-key entries cause repeated re-auth for HTTP MCP servers. Auth friction is a recurring MCP theme (also see #5192).

8. **[#5192 OPEN] ACP mode never persists MCP OAuth token** — [Link](https://github.com/github/copilot-cli/issues/5192)
   Every ACP thread re-opens the browser for auth. Blocks non-interactive/agent-driven workflows.

9. **[#5149 OPEN] Claude Opus 5.5: 32k maxOutputTokens causes empty turns at max reasoning** — [Link](https://github.com/github/copilot-cli/issues/5149)
   Hidden reasoning consumes the full output budget, yielding empty turns that still bill via auto-continue. Notable cost/correctness issue.

10. **[#5203 OPEN] Feature Request: Stable Release Channel** — [Link](https://github.com/github/copilot-cli/issues/5203)
    Community explicitly requests stable vs. rapid release channels, citing regressions. Directly reflects release-cadence frustration.

*Also noteworthy:* [#5207](https://github.com/github/copilot-cli/issues/5207) (Windows sandbox non-system drive), [#5176](https://github.com/github/copilot-cli/issues/5176) (Linux shell killed after ~10s via bwrap parent-death signal), [#5205](https://github.com/github/copilot-cli/issues/5205) (context window rollover failing on missing checkpoint.md).

---

## Key PR Progress

No pull requests were updated in the last 24 hours (Total: 0 items). This section is omitted for this digest cycle.

---

## Hot Discussions

No discussion data was provided. This section is omitted.

---

## Feature Request Trends

Aggregating requests across Issues:

- **Release stability & channels** — A dedicated stable channel is the clearest emerging ask ([#5203](https://github.com/github/copilot-cli/issues/5203)), driven by regression fatigue.
- **Model/provider flexibility** — Requests for BYOM provider support (e.g., `gemini` in [#2560](https://github.com/github/copilot-cli/issues/2560)) and honoring explicit startup model selection ([#5213](https://github.com/github/copilot-cli/issues/5213)) instead of admin-forced `auto`.
- **Terminal rendering & statusline** — Expand command output by default ([#2959](https://github.com/github/copilot-cli/issues/2959)) and show token counts in `/statusline` ([#2808](https://github.com/github/copilot-cli/issues/2808), 5 👍).
- **Configurable keybindings** — A call for fully configurable, consistent keybindings across modes ([#5211](https://github.com/github/copilot-cli/issues/5211)).

---

## Developer Pain Points

Recurring frustrations across the tracker:

1. **Permission/sandbox regressions dominate.** Multiple high-visibility issues (#5173, #5177, #5206, #5105, #5176, #5207) point to broken or over-aggressive permission and sandbox behavior tied to the October harness migration and 1.0.99-0. The v1.0.101 `cd`-approval fix is a positive signal.
2. **MCP OAuth token lifecycle is unreliable.** Silent-refresh failures, non-persisted tokens, and duplicate cache keys (#4203, #4695, #5192) create repeated interactive logins — a blocker for headless/ACP workflows.
3. **MCP server auth/discovery instability.** Ports, timeouts, and post-discovery tool unavailability (#5209, #5208) frustrate MCP adopters.
4. **Exfiltration protection false positives.** Legitimate spec content (e.g., `Authorization: Bearer ${env.AUTH_TOKEN}`) is blocked ([#4065](https://github.com/github/copilot-cli/issues/4065), 3 👍).
5. **Windows-specific friction.** Plugin update file locks (#4488), numpad/Delete regressions (#5171), and non-system-drive sandbox failures (#5207).
6. **Headless/non-interactive robustness.** Unmachine-identifiable prompt-budget errors (#5201), shell guard over-blocking `kill` variants (#5214), and context rollover crashes (#5205) hamper automation.
7. **Rapid release cadence → regression fatigue**, explicitly surfacing as demand for a stable channel.

---
*Digest generated from github.com/github/copilot-cli activity data for 2026-10-21. Issue statuses (OPEN/CLOSED) reflect the data snapshot provided.*

</details>

<details>
<summary><strong>OpenCode</strong> — <a href="https://github.com/anomalyco/opencode">anomalyco/opencode</a></summary>

# OpenCode Community Digest — 2026-10-21

## Today's Highlights

No new releases landed in the last 24 hours, but the issue tracker remains highly active with 50 updated threads. Two threads stand out: a long-running accessibility push (screen-reader TUI mode, web UI ARIA gaps) and a cluster of provider/service reliability bugs — port collisions on relaunch, malformed tool-call output from Go models, and extreme first-token latency on `deepseek-v4.1-flash`. On the PR side, Kit Langton dominates the queue with a large stack of session-UI polish, composer/dock animations, and file-tree cleanup.

---

## Releases

Not provided — no releases in the last 24 hours.

---

## Hot Issues (10)

1. **#41969 — Publish exact model versions/checkpoints for Go plan models** [OPEN, 15 comments, 👍12]
   https://github.com/anomalyco/opencode/issues/41969
   Users can't tell which checkpoint `deepseek-v4-flash` (e.g. 0731) is actually serving. Highest-engagement issue of the day; transparency about served checkpoints is becoming a trust issue for the Go plan.

2. **#54267 — Relaunch fails: "Managed service port already in use"** [OPEN, reproduced, 13 comments]
   https://github.com/anomalyco/opencode/issues/54267
   The shared background service doesn't detect a still-running predecessor and respawns on a fixed port. Reliable repro, no workaround — a real papercut for desktop users.

3. **#50206 — Malformed XML/DSML tool-call output from Go models** [OPEN, 13 comments]
   https://github.com/anomalyco/opencode/issues/50206
   Models emit `<｜DSML｜ parameter ...>`-style content instead of valid tool payloads, breaking execution. Directly impacts agent reliability.

4. **#39368 — Accessibility: screen-reader-friendly TUI mode** [OPEN, 9 comments]
   https://github.com/anomalyco/opencode/issues/39368
   NVDA/Orca users report the TUI is unusable due to banner, animations, footer, and alt-screen handling. A concrete, well-specified a11y request with no config escape hatch today.

5. **#57199 — `cacheFormat: "anthropic"` puts `cache_control` in the wrong place** [OPEN, 5 comments]
   https://github.com/anomalyco/opencode/issues/57199
   Anthropic-backed gateways ignore the marker when the last message is a tool result, so prompt caching silently stops after tool calls. Cost/latency implications for all tool-heavy sessions.

6. **#55305 — Make the 60m location inactivity TTL configurable** [CLOSED, 5 comments, 👍3]
   https://github.com/anomalyco/opencode/issues/55305
   `LocationActivity.timeToLive` is hardcoded to 60 minutes and not plumbed from config. Closed, but the internal option already existing suggests a low-cost fix.

7. **#57055 — `deepseek-v4.1-flash` TTFT scales with context (p90 ~25s at 657k)** [OPEN, 3 comments]
   https://github.com/anomalyco/opencode/issues/57055
   Reproduced with raw HTTP against the same endpoint: multi-minute stalls, empty completions, missing `finish_reason`. Punctuates the broader "OpenCode Go unusable" thread (#57403).

8. **#57187 — Auto-compaction budget collapses near context limit** [CLOSED, 3 comments]
   https://github.com/anomalyco/opencode/issues/57187
   Full conversation is sent as the summary request, leaving only ~2.2k tokens for output on a thinking model — session dead-ends with no retry. Fixed same-day via PR #57564 (see below).

9. **#57215 — Silent failure: directory plugin with no root entry loads nothing** [CLOSED, 3 comments]
   https://github.com/anomalyco/opencode/issues/57215
   Loader tries only `server.ts|js` / `index.ts|js`, ignores `package.json#exports`, and emits no warning. Plugin authors get a blank slate with zero diagnostics.

10. **#57495 — Slow plugin `setup()` disables all github-copilot models** [OPEN, reproduced, 2 comments]
    https://github.com/anomalyco/opencode/issues/57495
    Any plugin taking ≳500ms causes every Copilot model to be marked `enabled: false` permanently. A surprising cross-plugin failure mode with no recovery.

---

## Key PR Progress (10)

1. **#57564 — Compaction summaries get the same output limit as normal turns** (rekram1-node)
   https://github.com/anomalyco/opencode/pull/57564
   Raises the 32k cap that thinking models exhaust; directly closes the dead-end reported in #57187.

2. **#57559 — Composer grows questions, permissions, and queued messages** (kitlangton)
   https://github.com/anomalyco/opencode/pull/57559
   Replaces single-frame swaps with composer-dock growth animation, eliminating timeline jumps. Core UX polish for the session view.

3. **#57531 — Keep branch search results on screen while a query is pending** (kitlangton)
   https://github.com/anomalyco/opencode/pull/57531
   Stops the list from flashing empty on every keystroke; explicitly looks for a reusable type-ahead component.

4. **#57556 — Preserve valid env substitutions during fallback** (JoaoMarcos44)
   https://github.com/anomalyco/opencode/pull/57556
   Closes #57554; untangles v2 fallback behavior from raw/pre-escaped values — a common config-file footgun.

5. **#57549 — Start every Location with built-in agents; hold sends while loading** (kitlangton)
   https://github.com/anomalyco/opencode/pull/57549
   Fixes "Select an agent and model" after desktop restart despite a remembered model, which could block sends for 30s+.

6. **#57527 — Show untracked folders as one review row** (kitlangton)
   https://github.com/anomalyco/opencode/pull/57527
   "45210 files changed" becomes 38 rows by switching off `--untracked-files=all` in the review launcher. Big signal-to-noise win.

7. **#57565 — Balance the composer send button's inset and radius** (kitlangton)
   https://github.com/anomalyco/opencode/pull/57565
   Small but emblematic: 8px uniform insets, concentric 6px-in-10px radii. The kind of detail that defines a polished tool.

8. **#57562 — Open video and image URLs in the browser pane** (kitlangton)
   https://github.com/anomalyco/opencode/pull/57562
   Fixes `ERR_FAILED (-2)` by handling Chromium's built-in media viewer commit instead of waiting for a download handler.

9. **#57555 — Preserve undo on conflicting compaction** (JoaoMarcos44)
   https://github.com/anomalyco/opencode/pull/57555
   Closes #57553: a rejected manual compaction could confirm staged undo, truncate history, and clear redo. Data-loss-adjacent fix.

10. **#56698 / #57500 — Automatic project icon discovery + picker** (kitlangton)
    https://github.com/anomalyco/opencode/pull/56698 · https://github.com/anomalyco/opencode/pull/57500
    Reads `opencode.json` icon fields, discovers candidates on `Project.resolve` and hourly sweeps, and exposes `GET /api/project/icons` with a Project Settings row.

---

## Hot Discussions

No discussion data provided — section omitted.

---

## Feature Request Trends

- **Model/checkpoint transparency** (#41969): users want exact served versions documented for Go plan models.
- **Accessibility as first-class config** (#39368, #57491): screen-reader TUI mode, accessible names for command palette and session controls; a11y is now a recurring, well-specified theme rather than an afterthought.
- **Provider/protocol correctness** (#57199, #57230): precise cache-marker placement for Anthropic gateways, and not injecting `stream_options`/`store` into non-OpenAI-compatible endpoints.
- **Plugin API completeness** (#57212, #57215): session listing by parent ID, proper `exports` resolution, and loud failures instead of silent no-ops.
- **Configuration escape hatches** (#55305): expose hardcoded internals (e.g. 60m location TTL) as documented config.
- **Backend flexibility** (#35391): opt-in PostgreSQL with a migration path away from single-file SQLite.

---

## Developer Pain Points

- **Service lifecycle and port hygiene** (#54267): fixed-port respawn collides with un-exited background services; the client misreports the service as `missing`.
- **Provider compatibility whack-a-mole** (#57199, #57230, #56127): gateways reject misplaced cache markers, unknown fields, or string-typed `tool_use.input` from streaming tool calls — each breaks a different layer of the stack.
- **Latency and emptiness on Go models** (#57055, #57403, #50206): TTFT scaling with context, multi-minute stalls, empty completions, missing `finish_reason`, and malformed tool-call XML.
- **Silent failures over loud errors** (#57215, #57226): plugins that load nothing without warning; V1→V2 migration silently skips sessions created after the first V2 launch.
- **Compaction edge cases** (#57187, #57496): output-budget collapse near the context limit, and native subtasks skipped when compaction advances the finished-message boundary — both can strand or silently drop work.
- **Plugin side effects on core state** (#57495): a slow `setup()` globally disables Copilot models, showing plugin isolation is still weak.
- **Post-update regressions** (#51638): `/compact` disappearing from the slash menu in Desktop 2.0.18 erodes trust in update flow.

---

*Digest generated from anomalyco/opencode GitHub activity for 2026-10-21. Comment counts and reactions reflect state as of retrieval; issues marked CLOSED may be pending close or triage.*

</details>

<details>
<summary><strong>Pi</strong> — <a href="https://github.com/earendil-works/pi">earendil-works/pi</a></summary>

# Pi Community Digest — 2026-10-21

## 1. Today's Highlights

No new releases in the last 24 hours, but the issue tracker and PR queue were highly active: a wave of cross-platform TUI bugs landed (Windows terminal teardown, split mouse escape sequences, tmux/native clipboard handling), and several long-standing provider-compatibility problems saw fixes merge. Notable merges include the CJK emphasis rendering fix (#10730 / #11168), prompt-cache preservation across tool changes on the Responses API (#11142), and the initial-system-message discovery fix that unblocks extension-authored leading messages (#11164). Meanwhile, a P0 issue about extensions calling `sendMessage` at `session_start` breaking Anthropic requests is marked in-progress.

## 2. Releases

None in the last 24 hours.

## 3. Hot Issues

1. **[#6300 — Windows: input line redrawn on every keystroke](https://github.com/earendil-works/pi/issues/6300)** (Open, 17 comments) — Long-running Windows TUI rendering bug where each character renders on a new line. The single most-commented open issue; Windows users are clearly a growing but under-served segment.

2. **[#10895 — System-level (MDM) configuration at highest precedence](https://github.com/earendil-works/pi/issues/10895)** (Closed/no-action, 15 comments) — Request for `/etc/pi/models.json`-style managed config to harden enterprise trust models. High engagement despite closure suggests enterprise deployment demand is real.

3. **[#10956 — `cacheWarming: "idle"` silently stops firing](https://github.com/earendil-works/pi/issues/10956)** (Open, 7 comments) — 507 decision events all at `continuationProbability: 1`, zero at 0.15; extensions handling `turn_end` appear to short-circuit idle warming. Directly impacts token cost for heavy users.

4. **[#8752 — Bedrock `usage.input` not normalized across model families](https://github.com/earendil-works/pi/issues/8752)** (Closed, 7 comments, 👍5) — Anthropic vs OpenAI-family cache accounting mismatch caused phantom cache-miss notices and doubled input cost reporting. High-upvote correctness bug now resolved.

5. **[#10157 — Gemini tool-call thought signatures dropped on AI Studio OpenAI-compat endpoint](https://github.com/earendil-works/pi/issues/10157)** (Open, 7 comments) — `extra_content.google.thought_signature` is not replayed on follow-up turns, degrading Gemini function-calling fidelity.

6. **[#9980 — OpenRouter cost off by 2-3x for top open models](https://github.com/earendil-works/pi/issues/9980)** (Open, 6 comments, 👍1) — Pi uses the cheapest provider's pricing for cost estimation while routing to (or being billed by) others. Misleading spend telemetry for GLM, etc.

7. **[#10628 — OSC 52 copy swallowed by tmux](https://github.com/earendil-works/pi/issues/10628)** (Open, 6 comments, 👍5) — No passthrough wrapping means copy-on-select silently fails inside tmux while still flashing "Copied!". High-upvote, affects headless SSH workflows.

8. **[#9265 — O(n²) tool-call argument re-parsing in openai-completions streaming](https://github.com/earendil-works/pi/issues/9265)** (Open, 6 comments, 👍2) — Quadratic JSON re-parse per delta freezes the event loop in single-threaded hosts running many sessions. Architectural performance risk for embedded deployments.

9. **[#9557 — Anthropic adapter drops root-level JSON Schema keywords](https://github.com/earendil-works/pi/issues/9557)** (Open, 6 comments, 👍1) — Non-strict `input_schema` reduced to `{type, properties, required}`, silently discarding `anyOf`/`oneOf`/`additionalProperties`. Correctness bug for structured tool inputs.

10. **[#11157 — Extensions that `sendMessage` at `session_start` force legacy transcript mode](https://github.com/earendil-works/pi/issues/11157)** (Open, in-progress, P0, 2 comments) — `getInitialSystemMessage` only reads index 0, so pi-memory/pi-session-search break prompt caching and Anthropic `system` anchoring for *every* session. Critical ecosystem-wide regression with a fix already in flight (see #11164).

## 4. Key PR Progress

1. **[#11164 — Find initial system message past leading extension messages](https://github.com/earendil-works/pi/pull/11164)** (Closed) — Companion fix for #11157; restores Anthropic `system` field and native tool anchoring when extensions emit messages first.

2. **[#11142 — Keep prompt cache across tool changes on Responses API](https://github.com/earendil-works/pi/pull/11142)** (Closed, mitsuhiko) — Fixes #10940: tool removal/redeclaration no longer rewrites the top-level tool list and invalidates the cached prefix.

3. **[#10730 — Render CJK emphasis next to fullwidth punctuation](https://github.com/earendil-works/pi/pull/10730)** (Merged) — Vendors a CJK-friendly `marked` tokenizer to fix bold rendering after `。`, `：`, etc. Long-awaited for Chinese/Japanese users.

4. **[#11168 — Render CJK emphasis in HTML export](https://github.com/earendil-works/pi/pull/11168)** (Closed) — Companion to #10730 for HTML exports; also syncs vendored `marked` from 18.0.5 → 18.0.11.

5. **[#11182 / #11181 — Add the Scaleway provider](https://github.com/earendil-works/pi/pull/11182)** (Closed) — Built-in OpenAI-compatible provider with `SCW_API_KEY` auth and serverless endpoint; closes #6165.

6. **[#11178 — `totalFromProvider` flag on usage cost](https://github.com/earendil-works/pi/pull/11178)** (Open) — First step toward reporting provider-declared costs (starting with OpenRouter) instead of Pi's catalog-based estimates.

7. **[#11158 — Overflow recovery escape hatch + output-budget-aware safety margin](https://github.com/earendil-works/pi/pull/11158)** (Closed) — Prevents injected/queued messages from re-arming unbounded compact-and-retry loops.

8. **[#11173 — Drop models OpenAI rejects for openai-codex](https://github.com/earendil-works/pi/pull/11173)** (Closed) — Removes de-listed models from the catalog; also fixed the previously-all-red test suite.

9. **[#11188 — Expose `@earendil-works/pi-ai/models` in the extension loader](https://github.com/earendil-works/pi/pull/11188)** (Closed) — Fixes "Cannot find module" for extensions importing `clampThinkingLevel` via the public subpath; adds regression test.

10. **[#10528 — Refactor Nix packaging](https://github.com/earendil-works/pi/pull/10528)** (Open) — Drops source maps/`.d.ts`, adopts `makeBinaryWrapper`, skips version check; improves NixOS/flake ergonomics.

## 5. Hot Discussions

**Show and tell**
- **[#11192 — Pi Market Terminal](https://github.com/earendil-works/pi/discussions/11192)** — Second-screen market workspace extension for finance professionals (v0.8.1, community-maintained).
- **[#11160 — Weasley Subagents](https://github.com/earendil-works/pi/discussions/11160)** — Apache-2.0 extension for parallel reviews, sequential chains, and background delegation, with a terminal fleet view and JSON lifecycle artifacts.

## 6. Feature Request Trends

- **Extension surface expansion** — New lifecycle events (`user_bash_complete`, #8530), public APIs for `admitSubmission` inside host commits (#11149), and `/models` subpath exports (#11188) show the extension ecosystem is pushing hard against current boundaries.
- **Provider breadth and correctness** — Scaleway (#11182), Ant Ling 3.x (#10943), Kimi OAuth host (#9819), OpenRouter real cost (#11178), and Bedrock usage normalization (#8752) dominate the AI package's backlog.
- **Enterprise & managed configuration** — System-level MDM config (#10895) and higher-precedence config layers are recurring asks as Pi moves into regulated environments.
- **Context window variants** — Surfacing multiple context sizes per model (#10893) rather than hardcoding one default.
- **Cache-aware execution** — Prompt caching, idle cache warming, and cost accuracy recur across the tracker, indicating caching is now a first-class concern.

## 7. Developer Pain Points

- **Cross-platform TUI fragility** — Windows redraw (#6300), terminal not torn down on crash (#11170), tmux OSC 52 swallowing (#10628), Wayland clipboard hung by Ctrl+Z (#11179), split mouse escape sequences leaking into the prompt (#11172), and Kitty/Warp protocol gaps (#11153). Terminal state management is the single largest source of bug reports.
- **Prompt-cache invalidation** — System-message merging (#11061), tool redeclaration (#11142), `codemode.only` hidden-tool redeclaration (#11114), and extension `sendMessage` at startup (#11157) all silently break caching and inflate cost. This is the highest-leverage correctness area.
- **Provider adapter inconsistencies** — Thought signatures (#10157), Anthropic schema keyword loss (#9557), and Bedrock usage semantics (#8752) reveal normalization gaps between providers.
- **Streaming performance** — The O(n²) argument re-parse (#9265) is a structural bottleneck for embedded multi-session hosts and remains unfixed.
- **Input/UX paper cuts** — Autocomplete breaking on `[` in filenames (#10972), CJK bold rendering (#10154), theme-vs-terminal contrast (#11092), and concurrent extension dialogs never settling (#11166).

</details>

<details>
<summary><strong>Qwen Code</strong> — <a href="https://github.com/QwenLM/qwen-code">QwenLM/qwen-code</a></summary>

# Qwen Code Community Digest — 2026-10-21

## 1. Today's Highlights

Release activity continues on the `v0.25.4-preview` line, headlined by session-targeted Skill and Extension refresh in the daemon. Meanwhile, the backlog is dominated by a large cluster of automated "Main CI failed: Managed Agent gate" reports and Hosted fault-gate test follow-ups, signalling active hardening of the managed-agent subsystem. User-facing friction around self-update packaging, the Web Shell's Managed Agent error surface, and desktop-to-daemon connectivity also drew meaningful discussion.

## 2. Releases

Three builds published in the last 24h, all sharing a common change set:

- **v0.25.4-preview.1** / **v0.25.4-preview.0**
- **v0.25.3-nightly.20261020.82bd240ad0**

Notable changes:
- `feat(daemon)`: **session-targeted Skill and Extension refresh** — refresh now applies per session rather than globally ([#14050](https://github.com/QwenLM/qwen-code/pull/14050), @callmeYe).
- `fix(managed-agent)`: **bound initial publication** — a bounded initial-publish fix for managed-agent delivery.

## 3. Hot Issues

1. **[#12668](https://github.com/QwenLM/qwen-code/issues/12668)** — Self-update drops execute bit on vendored ripgrep binaries (EACCES, ripgrep unavailable). High-impact install/packaging bug; 8 comments, P1, still awaiting feedback. *(OPEN)*
2. **[#14911](https://github.com/QwenLM/qwen-code/issues/14911)** — Approved + MERGEABLE PR [#13882](https://github.com/QwenLM/qwen-code/pull/13882) has waited three days for a merge decision. Process/escalation thread; 5 comments. *(OPEN)*
3. **[#14918](https://github.com/QwenLM/qwen-code/issues/14918)** — Failed Managed Agent request renders as raw text at top of Web Shell pane with no context or request ID. UI/UX friction in the 托管 view; 5 comments. *(OPEN)*
4. **[#11704](https://github.com/QwenLM/qwen-code/issues/11704)** — Proposal for an official Android companion client for `qwen serve` over ACP. Long-running roadmap proposal; 5 comments. *(OPEN)*
5. **[#13749](https://github.com/QwenLM/qwen-code/issues/13749)** — Add a Claude Code-style Mod runtime (`register`/`on`/`($,…)`) with staged compatibility. Significant extensibility direction; 4 comments. *(OPEN)*
6. **[#13612](https://github.com/QwenLM/qwen-code/issues/13612)** — Memory extraction cadence follow-ups (boundary flushes, window bound, telemetry) after #13571. Memory subsystem maturation; 4 comments. *(OPEN)*
7. **[#14447](https://github.com/QwenLM/qwen-code/issues/14447)** — Stage F fault gate FG12 for Hosted MCP domains; blocked. Tracks managed-agent reliability coverage; 4 comments. *(OPEN)*
8. **[#14850](https://github.com/QwenLM/qwen-code/issues/14850)** — One shared schema and tenant-unscoped recovery scans let hosted IT classes interfere. Closed after follow-up PR #14875; 3 comments. *(CLOSED)*
9. **[#14877](https://github.com/QwenLM/qwen-code/issues/14877)** — Memory writer silently drops over-budget index entries and the stamped notice doesn't name them. Data-integrity/transparency concern. *(OPEN)*
10. **[#14947](https://github.com/QwenLM/qwen-code/issues/14947)** — Persist saved daemon connections and allow remembering tokens (desktop + web-shell). Common request for long-lived `qwen serve` users; 3 comments. *(OPEN)*

## 4. Key PR Progress

1. **[#14930](https://github.com/QwenLM/qwen-code/pull/14930)** — `feat(managed-agent)`: import enabled Skills at session creation; merges with pinned AgentDefinition catalog and freezes effective instructions. *(OPEN)*
2. **[#14172](https://github.com/QwenLM/qwen-code/pull/14172)** — `feat(cli)`: paste clipboard text with `Ctrl+V` on Linux when clipboard holds no image. Needs human review. *(OPEN)*
3. **[#14748](https://github.com/QwenLM/qwen-code/pull/14748)** — `fix(cli)`: gate project hooks behind an approval dialog, matching project MCP server behavior ([#4615](https://github.com/QwenLM/qwen-code/issues/4615)). *(OPEN)*
4. **[#13428](https://github.com/QwenLM/qwen-code/pull/13428)** — `feat(cli)`: deliver accepted cross-session messages at tool-round boundaries (opt-in). *(OPEN)*
5. **[#13969](https://github.com/QwenLM/qwen-code/pull/13969)** — `feat(hooks)`: add `FileChanged` notifications for local, non-managed sessions (literal/absolute files + recursive dirs). *(OPEN)*
6. **[#14964](https://github.com/QwenLM/qwen-code/pull/14964)** — `feat(cli)`: align OpenTUI status lines with Ink, including `/statusline` selection and persistence. *(OPEN)*
7. **[#14966](https://github.com/QwenLM/qwen-code/pull/14966)** — `fix(cli)`: align OpenTUI editing and cancellation with Ink while preserving a single text/undo owner. *(OPEN)*
8. **[#13737](https://github.com/QwenLM/qwen-code/pull/13737)** — `fix(rewind)`: resolve legacy turns by source identity; refuses before mutation to protect file restore. *(OPEN)*
9. **[#14884](https://github.com/QwenLM/qwen-code/pull/14884)** — `fix(ci)`: skip duplicate `prepare` build in the daemon E2E lane (`QWEN_SKIP_PREPARE=1`). *(OPEN)*
10. **[#14033](https://github.com/QwenLM/qwen-code/pull/14033)** — `fix(core)`: widen agent workspace lock retry budget from 10 to 30 retries (~5s). *(OPEN)*

## 5. Hot Discussions

No dedicated Discussion data was provided in this dataset, so this section is omitted.

## 6. Feature Request Trends

- **Extensibility/plugin model**: Claude Code-style Mod runtime ([#13749](https://github.com/QwenLM/qwen-code/issues/13749)), session-targeted Skill/Extension refresh, and Skill import at session creation ([#14930](https://github.com/QwenLM/qwen-code/pull/14930)).
- **Remote & multi-surface clients**: Official Android companion over ACP ([#11704](https://github.com/QwenLM/qwen-code/issues/11704)), saved daemon connections and remembered tokens for desktop/web-shell ([#14947](https://github.com/QwenLM/qwen-code/issues/14947)).
- **Memory subsystem depth**: extraction cadence follow-ups ([#13612](https://github.com/QwenLM/qwen-code/issues/13612)) and non-silent index trimming ([#14877](https://github.com/QwenLM/qwen-code/issues/14877)).
- **Hook/notification surface**: project hook approval dialogs ([#14748](https://github.com/QwenLM/qwen-code/pull/14748)) and `FileChanged` notifications ([#13969](https://github.com/QwenLM/qwen-code/pull/13969)).
- **Cross-session messaging**: opt-in delivery at tool-round boundaries ([#13428](https://github.com/QwenLM/qwen-code/pull/13428)).

## 7. Developer Pain Points

- **Packaging & self-update reliability**: losing execute bits on vendored binaries after self-update breaks ripgrep entirely ([#12668](https://github.com/QwenLM/qwen-code/issues/12668)).
- **Daemon connectivity & auth friction**: desktop client cannot reach remote `qwen serve` without `--allow-origin '*'` because its own origin port is ephemeral ([#14939](https://github.com/QwenLM/qwen-code/issues/14939)); token/connection persistence still missing ([#14947](https://github.com/QwenLM/qwen-code/issues/14947)).
- **Managed Agent error ergonomics**: failures surface as bare, context-free text in the Web Shell with no request ID ([#14918](https://github.com/QwenLM/qwen-code/issues/14918)).
- **CI flakiness and churn**: a large volume of repeated "Main CI failed: Managed Agent gate" reports and Hosted fault-gate test isolation issues ([#14850](https://github.com/QwenLM/qwen-code/issues/14850), [#14784](https://github.com/QwenLM/qwen-code/issues/14784), [#14447](https://github.com/QwenLM/qwen-code/issues/14447)) plus duplicated test machinery across gate drivers ([#14921](https://github.com/QwenLM/qwen-code/issues/14921)).
- **Merge latency for approved work**: approved, non-conflicting PRs waiting days for a merge decision ([#14911](https://github.com/QwenLM/qwen-code/issues/14911)).
- **Memory transparency**: silent trimming of oldest memories with uninformative notices ([#14877](https://github.com/QwenLM/qwen-code/issues/14877)).

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*