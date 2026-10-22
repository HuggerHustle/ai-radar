# AI CLI Tools Community Digest 2026-10-23

> Generated: 2026-10-22 23:57 UTC | Tools covered: 7

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

**Date:** 2026-10-23
**Scope:** Claude Code, OpenAI Codex, Gemini CLI, GitHub Copilot CLI, OpenCode, Pi, Qwen Code

---

## 1. Ecosystem Overview

The AI CLI tooling landscape on 2026-10-23 shows a maturing market where **reliability, cost predictability, and enterprise policy controls** have overtaken raw capability as the dominant community concerns. Release velocity remains high across all vendors — Codex shipped four alpha builds in 24 hours, Qwen Code shipped two nightlies, and Claude Code, Copilot CLI, and OpenCode each shipped patch releases — but changelogs are increasingly thin, forcing users to reverse-engineer changes from PRs. Two structural patterns define the ecosystem: (1) a **shared push toward interoperable context files** (`AGENTS.md`) and MCP-based extensibility, and (2) **divergent pain profiles** — Claude Code and Copilot CLI wrestle with permission/authentication UX, Codex and Pi with resource lifecycle and large-session scaling, while Gemini CLI battles foundational agent reliability (infinite loops, hangs). Meanwhile, enterprise requirements — org-level policy ceilings, self-hosted model routing (Vertex AI), and org-controlled telemetry — are now appearing as first-class feature work rather than afterthoughts.

---

## 2. Activity Comparison

| Tool | Issues (Hot/Notable) | PRs (Notable) | Discussions | Release Status (24h) |
|---|---|---|---|---|
| **Claude Code** | ~14 highlighted (1,000s open) | 7 closed (all `poteat`, sec-default cluster) | **N/A** (not provided) | 2 patches: v2.1.309, v2.1.308 |
| **OpenAI Codex** | ~10 highlighted | ~12 notable (Vertex AI, MCP policy, SigV4) | Active (Ideas/Q&A/Show-and-tell) | 4 alphas (0.164.0-α.10–12, 0.163.0-α.11.2) |
| **Gemini CLI** | ~10 highlighted | ~10 notable + merged rollup | **N/A** (not provided) | 1 nightly (v0.67.0-nightly) |
| **GitHub Copilot CLI** | ~10 highlighted | **0 updated** (no PR data) | **N/A** (not provided) | 1 stable (v1.0.103) + 1 prerelease |
| **OpenCode** | ~10 highlighted (many closed) | ~10 notable (restart recovery, MCP SDK 2.3.1) | **N/A** (not provided) | 1 patch (v1.19.4, Bun 1.4.4) |
| **Pi** | ~10 highlighted + many closed | ~10 notable (export, fuzzy search, fork speed) | **N/A** (not provided) | **None** |
| **Qwen Code** | ~10 highlighted | ~10 notable (daemon, Managed Agent CI) | **N/A** (not provided) | 2 releases (nightly + TS SDK v0.1.22) |

**Notes:**
- Only **OpenAI Codex** surfaces structured Discussions data in this snapshot; for the remaining six tools, Discussions are marked **N/A** (channel not captured upstream), not "inactive."
- **GitHub Copilot CLI** reported zero PR activity in the window — unusual and worth monitoring, though the repo may gate PRs upstream.
- **Pi** is the only tool with no release in the window, yet shows the densest PR/issue churn — consistent with a fix-heavy cycle following prior releases.

---

## 3. Shared Feature Directions

Requirements appearing across **two or more** tool communities:

| Direction | Tools | Specific Needs |
|---|---|---|
| **Interoperable `AGENTS.md` context** | Claude Code (#96466), Codex (#56176, #56181), Pi (#11292, #11250/51) | Always-load default, verify delivery paths, strip HTML comments, `/reload` re-reads |
| **Session continuity & restart resilience** | OpenCode (#58260/#58261), Copilot CLI (#5225), Pi (#11292), Qwen Code (#15023) | Resume subagents after restart, preserve context post-compaction, daemon token persistence |
| **Permission/sandbox model honesty** | Claude Code (#103615, #103269), Copilot CLI (#5232, #5089), Gemini CLI (#22672) | Stop silent mode escalation, close trusted-folder bypasses, discourage destructive git ops |
| **MCP lifecycle & management UX** | OpenCode (#58243), Qwen Code (#8968, #15079), Codex (#30408, #56278), Pi (#10837) | Runtime add/remove/reload, full tool-arg rendering, structuredContent fidelity, process reaping |
| **Cost/limit predictability** | Claude Code (#47509, #102269), Codex (#56262/#56259), Copilot CLI (#4802) | Higher-tier power-user plans, disable background limit drains, transparent reset eligibility |
| **Model/provider configuration fidelity** | Pi (#11223, #11116), Qwen Code (#15235), OpenCode (#57955) | Honor `modelOverrides`, silent downgrades fixed, provider-scoped auto-compaction |
| **Stable release channels** | Copilot CLI (#5203), OpenCode (implicit via #45087), Pi (implicit) | Separate stable from fast-moving train; stop regressions from daily releases |
| **Clickable terminal file references** | OpenCode (#19005, #57305), Codex (#13213) | Opt-in hyperlinks, WSL-aware URL handling, restore editable paths |
| **Enterprise model routing** | Codex (#56265/#56276 Vertex AI), Claude Code (sec-default PRs), Qwen Code (#15255 Harness pool) | Self-hosted / BYO-credentials providers, org policy ceilings over plugins |

**Strongest cross-tool signal:** the convergence on **`AGENTS.md` as a portable contract** — three independent communities are building tooling to *verify* instruction delivery, not just write it.

---

## 4. Differentiation Analysis

**Claude Code** — *Enterprise-first, policy-heavy.* Target: orgs and power users on team plans. Technical posture: sandbox correctness as a security surface, org-level "sec-default" that plugins cannot loosen, telemetry records that persist past the user tier. Differentiation: the only tool with a coherent **org-policy-over-plugin** model shipping as a PR cluster. Weakness: Desktop↔CLI config parity and Remote Control fragility form a large, distinct issue cluster.

**OpenAI Codex** — *Platform/enterprise integration breadth.* Target: teams routing to self-hosted models. Technical posture: rapid alpha cadence, GCP Vertex AI provider, MCP network-policy metadata, AWS SigV4 signing. Differentiation: broadest **model-routing and auth-provider** surface. Weakness: the MCP process leak (#30408, open since June) is the ecosystem's longest-running severe resource bug.

**Gemini CLI** — *Agent-reliability-focused with native shell affinity.* Target: developers wanting a bash-native agent. Technical posture: OS-level sandboxing (#19873), AST-aware tooling (#22745 cluster), container IDE bridging. Differentiation: strategic bet on **context efficiency and native grep/sed/awk workflows**. Weakness: foundational hangs and infinite loops (#26116, #21409) are the most damaging reliability gaps in the entire comparison set.

**GitHub Copilot CLI** — *GitHub-integrated, release-velocity-driven.* Target: existing Copilot subscribers. Technical posture: fast patch cadence, ACP sandbox fixes, voice input. Differentiation: deepest **GitHub-native integration** (PRU quotas, hooks, worktrees). Weakness: MCP OAuth is the dominant pain cluster today (4 reports), and rapid releases are producing regressions that fuel stable-channel requests.

**OpenCode** — *Open-source, resilience-and-polish-focused.* Target: OSS-aligned developers, multi-provider users. Technical posture: Bun-runtime upgrades carrying upstream security fixes, server-restart recovery for background subagents. Differentiation: strongest **session-state honesty and server-restart resilience** work, plus a full MCP manager proposal (#58243). Weakness: provider catalog inconsistency across TUI/web/CLI surfaces.

**Pi** — *Extensibility-and-API-surface-focused.* Target: extension authors and power integrators. Technical posture: dense PR cycle fixing large-session scaling (recursive export, fork speed, fuzzy ranking), extension lifecycle stability. Differentiation: the most **extension-author-centric** tool — but also the most fragile under large sessions (8,000+ message re-renders, stack overflows).

**Qwen Code** — *Daemon/Managed-Agent and CI-hardening.* Target: enterprise deployments (Kubernetes harness pools, external runtime provisioners). Technical posture: daemon token persistence, first-release contract consolidation, SDK Java lane optimization. Differentiation: the only tool with a **daemon/serve architecture** as its primary battleground. Weakness: CI instability generates the largest single issue cluster (10+ bot-filed main-CI failures).

---

## 5. Community Momentum & Maturity

**Highest raw engagement:**
- **Claude Code** — Issue #47509 (65 comments, 185 👍) is the single highest-engagement item across all seven tools. The `poteat` sec-default PR cluster (7 closed) signals a disciplined, maintainer-adjacent contributor.
- **OpenAI Codex** — Issue #30408 (63 comments) matches Claude Code's top issue; expected reaction counts (24 👍 on #37472) indicate a broad but slightly less polarized community. Active Discussions channel.

**Fastest iteration:**
- **OpenAI Codex** — 4 alpha releases/24h plus 12 notable PRs.
- **Qwen Code** — 2 releases/24h plus converging CI-optimization PRs (#15254/#15274).
- **Pi** — no release but ~10 merged/closed PRs in 24h, indicating an active fix sprint.

**Most mature (predictable cadence, structured triage):**
- **GitHub Copilot CLI** — stable + prerelease channel discipline, though zero PR visibility limits assessment.
- **OpenCode** — heavy *closure* activity (many long-open issues resolved) signals a triage push, not stagnation; the Bun 1.4.4 security bump is a mature supply-chain move.

**Most fragile:**
- **Gemini CLI** — two P1 hangs/loops are the top frustration; cancellation leaks (#29868) compound the problem.
- **Pi** — P0 startup/input bugs (#11086, #11088) on Windows/macOS undercut an otherwise strong fix cadence.

**Momentum verdict:** Codex and Qwen Code lead on velocity; **Claude Code leads on issue engagement density**; **OpenCode and Pi lead on maintainer responsiveness** (closure rate); **Gemini CLI and Copilot CLI** carry the highest *unresolved reliability risk* relative to their issue volume.

---

## 6. Trend Signals

**Signals for tool vendors:**

1. **`AGENTS.md` is becoming the de facto portable context standard.** Three communities are independently building verification tooling (`Agent Relay Check`, `pytest-codex`, Pi's `/reload`). Vendors that treat it as a first-class default (over proprietary `CLAUDE.md`) will reduce migration friction.

2. **Enterprise policy is moving from config to contract.** Claude Code's sec-default PR cluster (org ceiling > plugin, immutable telemetry, immutable conversation rows) and Qwen Code's first-release-contract consolidation (#15263) both point to **org-level invariants that user extensions cannot override**. This is the clearest enterprise buying-signal in the dataset.

3. **Silent failure is the new trust-killer.** Across Claude Code (silent `git fetch`, silent plugin no-op), Gemini CLI (MAX_TURNS reported as GOAL success), Pi (`modelOverrides` ignored silently), and Qwen Code (silent reasoning-effort downgrade), *invisible behavior* is repeatedly cited as more damaging than visible bugs. **Observability of failure mode** is a differentiating feature opportunity.

4. **Cost visibility is a retention issue, not a billing issue.** Overnight-sleep limit drains (Claude Code #102269), banked-reset logic mismatches (Codex #56262), and PRU wipeouts (Copilot #4802) show users tolerate cost but not *unpredictable* cost. Transparent limit telemetry is table stakes.

5. **MCP has crossed from novelty to infrastructure — and infrastructure bugs hurt.** The MCP process leak (#30408), `structuredContent` data loss (OpenCode #38923), OAuth redirect advisory (#55166), and Copilot's four-report auth cluster all indicate MCP is now load-bearing. **MCP lifecycle management (runtime reload, process reaping, auth refresh) is the next competitive frontier.**

6. **Rapid release trains are colliding with developer tolerance.** Copilot CLI's explicit stable-channel request (#5203), Pi's regression cluster, and Codex's empty changelogs (4 alphas/24h, no notes) suggest the ecosystem may soon bifurcate into **fast/beta and stable/supported channels** — a pattern already emerging in Copilot CLI's prerelease tagging.

**Reference value for developers:**
- If you need **org policy enforcement over plugins** → Claude Code.
- If you need **self-hosted/BYO-credential model routing** → Codex (Vertex AI) or Qwen Code (external runtime provisioners).
- If you need **session resilience across restarts** → OpenCode (subagent resume) or Qwen Code (daemon token persistence).
- If you need **extension surface depth** → Pi (with caveats on large-session scaling).
- If you need **bash-native agent workflows** → Gemini CLI (with caveats on reliability pending P1 resolution).

---

*Report compiled from seven community digests dated 2026-10-23. Issue/PR counts reflect the highlighted subset per digest, not raw repo totals. Discussions data was available only for OpenAI Codex; other cells marked N/A indicate unavailable upstream data, not inactivity.*

---

## Per-Tool Reports

<details>
<summary><strong>Claude Code</strong> — <a href="https://github.com/anthropics/claude-code">anthropics/claude-code</a></summary>

## Claude Code Skills Highlights

> Source: [anthropics/skills](https://github.com/anthropics/skills)

# Claude Code Skills Community Highlights Report
*Data as of 2026-10-23 | Source: github.com/anthropics/skills*

---

## 1. Top Skills Ranking

Ranked by discussion intensity (comments, updates, and cross-references between PRs and Issues).

| # | Skill / PR | Functionality | Discussion Highlights | Status |
|---|-----------|---------------|----------------------|--------|
| 1 | **mcp-builder fix** ([PR #1742](https://github.com/anthropics/skills/pull/1742)) | Fixes broken imports for `mcp>=2.0.0` (`streamable_http_client` rename) and custom HTTP header support | Tied to [Issue #1390](https://github.com/anthropics/skills/issues/1390), where `evaluation.py` scores 0/N against every real MCP server due to swallowed `TextContent` serialization errors | OPEN |
| 2 | **skill-creator fixes** ([PR #1298](https://github.com/anthropics/skills/pull/1298), [#1997](https://github.com/anthropics/skills/pull/1997)) | Isolates trigger evals, fixes Windows subprocess handling, and corrects YAML frontmatter scalar parsing | Overlaps with [Issue #1383](https://github.com/anthropics/skills/issues/1383) (silent benchmark failures, inverted deltas) and [Issue #556](https://github.com/anthropics/skills/issues/556) (0% trigger rate) — the most bug-dense area of the repo | OPEN |
| 3 | **docx fixes** ([PR #1792](https://github.com/anthropics/skills/pull/1792), [#1734](https://github.com/anthropics/skills/pull/1734)) | LibreOffice timeout now errors instead of false success; detects orphaned comments | Related to [Issue #2018](https://github.com/anthropics/skills/issues/2018) (merge_runs.py writes invalid XML with unbound namespace prefixes) | OPEN |
| 4 | **notion-spec-to-implementation + quantitative-resume-auditor** ([PR #1245](https://github.com/anthropics/skills/pull/1245)) | Converts product specs into actionable Notion tasks with acceptance criteria; audits resumes quantitatively | Broadest-scope submission in the top tier; spans PM workflow + career tooling | OPEN |
| 5 | **proofcore-contract-auditor** ([PR #1771](https://github.com/anthropics/skills/pull/1771)) | Static analysis of Solidity/Rust contracts with Merkle-proof notarization to TON blockchain | Notable as the first Web3/on-chain Skill proposal to gain traction | OPEN |
| 6 | **md2video-audio** ([PR #1703](https://github.com/anthropics/skills/pull/1703)) | Compiles Markdown → Marp slides → MP4 with human-like voiceover, zero-cost | Representative of the "content pipeline" Skill category | OPEN |
| 7 | **document-typography** ([PR #514](https://github.com/anthropics/skills/pull/514)) | Prevents orphan word wrap, widow paragraphs, numbering misalignment in generated docs | Long-lived (created 2026-03) but still unmerged; addresses a universal document-quality gap | OPEN |
| 8 | **webapp-testing hardening** ([PR #1980](https://github.com/anthropics/skills/pull/1980), [#1976](https://github.com/anthropics/skills/pull/1976)) | Removes `shell=True` (CWE-78 command injection); fixes textarea/select reporting | Security-focused fix set; addresses [Issue #1891](https://github.com/anthropics/skills/issues/1891) | OPEN |

---

## 2. Community Demand Trends

Distilled from the highest-comment Issues:

- **Trust & namespace security** — [Issue #492](https://github.com/anthropics/skills/issues/492) (46 comments, top-discussed Issue) demands that community skills stop impersonating the `anthropic/` namespace to prevent privilege escalation.
- **Org-wide skill sharing** — [Issue #228](https://github.com/anthropics/skills/issues/228) (17 comments) requests a shared skill library / share links instead of manual `.skill` file uploads.
- **Eval reliability & trigger accuracy** — [Issue #556](https://github.com/anthropics/skills/issues/556) (13 comments) reports 0% skill trigger rate in `run_eval.py`; a systemic demand for trustworthy evaluation harnesses.
- **Skill packaging hygiene** — [Issue #189](https://github.com/anthropics/skills/issues/189) (9 upvotes) flags duplicate identical content between `document-skills` and `example-skills` plugins, wasting context window.
- **Memory & state compaction** — [Issue #1329](https://github.com/anthropics/skills/issues/1329) proposes symbolic-notation memory compaction for long-running agents.
- **Reasoning quality gating** — [Issue #1385](https://github.com/anthropics/skills/issues/1385) proposes a three-gate pipeline (calibration → adversarial review → delivery verification).
- **Agent governance/safety** — [Issue #412](https://github.com/anthropics/skills/issues/412) proposes policy enforcement, threat detection, and audit trails for agent systems.
- **Context budget** — [Issue #1487](https://github.com/anthropics/skills/issues/1487) reports `claude-api` eagerly injecting ~156k tokens in a single tool call.

Dominant themes: **security/trust boundaries, eval correctness, context efficiency, and cross-org collaboration tooling.**

---

## 3. High-Potential Pending Skills

Active-discussion PRs with recent updates, likely to land soon:

| Skill | Link | Why It's High-Potential |
|-------|------|------------------------|
| **pyxel** (retro game dev) | [PR #525](https://github.com/anthropics/skills/pull/525) | Long-lived (since 2026-03) but continuously updated (2026-09); covers implementation, headless runs, frame inspection |
| **odt** (OpenDocument format) | [PR #486](https://github.com/anthropics/skills/pull/486) | Fills a clear gap alongside existing docx/pdf Skills; complete SKILL.md + template filling + HTML conversion |
| **scnet-hpc** | [PR #1615](https://github.com/anthropics/skills/pull/1615) | Profile-based SSH + Slurm workflows; brings HPC cluster ops into the Skill catalog |
| **skill-quality-analyzer / skill-security-analyzer** | [PR #83](https://github.com/anthropics/skills/pull/83) | Meta-Skills for evaluating Skill quality across five dimensions — directly responds to repo-wide quality issues |
| **frontend-design revision** | [PR #210](https://github.com/anthropics/skills/pull/210) | Rewrites an existing Skill for actionability within a single conversation |
| **pdf SKILL.md case fixes** | [PR #538](https://github.com/anthropics/skills/pull/538) | Small but high-impact: fixes 8 broken file references on case-sensitive filesystems |

---

## 4. Skills Ecosystem Insight

**The community's most concentrated demand is not new Skill creation but hardening the existing ecosystem — security boundaries (namespace trust, command injection, XSS), eval/trigger correctness, and context efficiency are collectively outweighing feature requests.**

---

*All links reference `github.com/anthropics/skills`. Comment counts marked "undefined" for PRs reflect unavailable data in the source feed; rankings use update recency and cross-Issue linkage as proxies for attention.*

---

# Claude Code Community Digest — 2026-10-23

## 1. Today's Highlights

Two patch releases (v2.1.309, v2.1.308) landed, with v2.1.309 addressing meaningful sandbox correctness bugs on macOS/Linux — particularly around startup files executing *outside* the sandbox and `denyWrite` glob patterns failing on symlinked paths. Issue activity remains dominated by **Desktop/Remote Control reliability** and **cost/usage-limit concerns**, while a cluster of long-pending community PRs (all authored by `poteat`) were closed after extended review cycles. The single highest-engagement issue (#47509, 65 comments, 185 👍) continues to push for a "Max 20x equivalent" Team tier for power users.

---

## 2. Releases

**v2.1.309** — Security/sandbox fixes:
- Fixed sandboxed Bash commands on macOS/Linux running the shell's startup files *outside* the sandbox before each command (a real sandbox-escape class of bug).
- Fixed macOS sandbox `denyWrite` glob patterns not applying at a path's real location when the pattern's folder was reached through a symlink (symlink bypass of write restrictions).
- Additional sandbox fix (truncated in changelog).

**v2.1.308** — Generic "bug fixes and reliability improvements" (no detail provided).

> Sandbox fixes are the headline here — both address cases where the sandbox boundary was effectively circumventable.

---

## 3. Hot Issues

1. **#47509 — Team plan needs a Max 20x equivalent tier (OPEN, 65💬, 185👍)**
   [anthropics/claude-code#47509](https://github.com/anthropics/claude-code/issues/47509)
   The clear community darling. Power users (CTOs, tech leads) say the Premium seat's 6.25x Pro is insufficient for heavy agentic CLI workflows. High 👍 density signals broad agreement.

2. **#48949 — Persistent always-on Remote Control for desktop (OPEN, 19💬, 34👍)**
   [#48949](https://github.com/anthropics/claude-code/issues/48949)
   Desktop app ignores the CLI's `remoteControlAtStartup` setting. Symptom of a broader CLI↔Desktop config-parity gap.

3. **#100216 — Desktop sidebar: show forks as top-level sessions (OPEN, 9💬, 17👍)**
   [#100216](https://github.com/anthropics/claude-code/issues/100216)
   Fork nesting has become hard to navigate since a recent desktop redesign. UX-driven.

4. **#91472 — Make git worktree pooling opt-out (OPEN, 7💬, 8👍)**
   [#91472](https://github.com/anthropics/claude-code/issues/91472)
   Requests one worktree per session, cleaned up on archive — a request for more predictable local repo state.

5. **#84698 — Desktop unrequested background `git fetch` (OPEN, 7💬, 8👍)**
   [#84698](https://github.com/anthropics/claude-code/issues/84698)
   Untraceable background fetch with no disabling setting. Part of a recurring "silent network activity" theme (see #102760).

6. **#83422 — Plugins enabled-in-settings but never installed load nothing silently (OPEN, 7💬, 3👍)**
   [#83422](https://github.com/anthropics/claude-code/issues/83422)
   Committing `enabledPlugins` + `extraKnownMarketplaces` doesn't actually install plugins — skills/hooks silently absent. Serious for teams sharing `.claude/settings.json`.

7. **#102269 — Overnight sleep re-writes agent cache per wake-up, drains weekly limit (OPEN, 7💬)**
   [#102269](https://github.com/anthropics/claude-code/issues/102269)
   Reports ~25% of a weekly limit burned during laptop sleep cycles, plus ambiguous non-English stop words failing to halt agents. Cost + control concern.

8. **#103615 — Permission prompt UX: "Always Allow" silently escalates session mode (OPEN, 3💬, 1👍)**
   [#103615](https://github.com/anthropics/claude-code/issues/103615)
   "Always Allow" quietly switches the whole session to **Accept Edits**. A one-click permission escalation is a real security-relevant UX bug.

9. **#103465 — Desktop update deleted Code tab sessions and wiped plugins/connector (OPEN, 2💬)**
   [#103465](https://github.com/anthropics/claude-code/issues/103465)
   Data loss on update — flagged `data-loss`. Even at low comment count, this is the most severe category in today's set.

10. **#96466 — Always load AGENTS.md by default, make CLAUDE.md optional (OPEN, 2💬, 13👍)**
    [#96466](https://github.com/anthropics/claude-code/issues/96466)
    Strong 👍 relative to comments; reflects the ecosystem-wide push for interoperable `AGENTS.md` conventions.

*Also notable:* #104412 (cloud session launched from unpushed worktree branch dies unrecoverable), #104410 (Remote Control sessions drop without auto-recovery; cross-session messages lost, identities change on reconnect), #102610 / #97452 (`reasoning_extraction` false-positive safeguards persistently poisoning sessions).

---

## 4. Key PR Progress

All seven PRs below were **closed** on 2026-10-22, all authored by `poteat`. They form a coherent theme: **org-level security policy ("sec-default") that a user's plugin cannot override.**

1. **#99540 — Org's tool ceiling holds over installed plugins** [#99540](https://github.com/anthropics/claude-code/pull/99540) — Where an org requires approval for a connector tool, user-installed plugins can no longer bypass that ceiling. Every deciding hook carries a `.catch`.

2. **#99137 — A person's plugin may tighten, never loosen** [#99137](https://github.com/anthropics/claude-code/pull/99137) — Where sec-default is seated, a user plugin can't lift a deny/ask rule or change a pinned variable. Needs no new engine.

3. **#97688 — Collector records continue past the user tier** [#97688](https://github.com/anthropics/claude-code/pull/97688) — User plugins can no longer drop or rewrite telemetry records sent to an org's collector; `telemetry.log` now continues past the user tier.

4. **#97334 — Conversation rows continue past the user tier** [#97334](https://github.com/anthropics/claude-code/pull/97334) — Merge-order-gated on engine `session.append` landing in a released CLI; test red by construction until then.

5. **#97293 — Truncation flags & mtimeMs declarations** [#97293](https://github.com/anthropics/claude-code/pull/97293) — Gated on the released npm CLI actually carrying `isStdoutTruncated`/`isStderrTruncated` and `mtimeMs`. Prevents declaring fields the installed CLI doesn't answer.

6. **#99141 — `/diff` pane kept until something can draw it** [#99141](https://github.com/anthropics/claude-code/pull/99141) — Small UX fix; stacked on #99118.

7. **#99118 — Toasts show while `/diff` pane is open** [#99118](https://github.com/anthropics/claude-code/pull/99118) — Previously other plugins' toasts were held while `/diff` was shown; now they display.

> Note: several of these PRs note their tests are "red by construction" pending engine/CLI releases — worth watching whether the corresponding engine changes ship.

---

## 5. Hot Discussions

No Discussions data was provided in this dataset, so this section is omitted.

---

## 6. Feature Request Trends

Distilled from today's issues:

- **Monetization / usage tiers for power users** — The dominant theme by engagement: a Team-tier Max 20x equivalent (#47509), plus cost-drain bugs (#102269). Users doing heavy agentic work feel plan-limited.
- **Desktop ↔ CLI config parity** — Remote Control at startup (#48949), account-level config/auto-memory sync (#87027). Desktop app keeps diverging from CLI behavior.
- **Org policy / security boundaries over plugins** — The entire PR cluster (#99540, #99137, #97688), plus permission-UX concerns (#103615) and out-of-project file access (#103269).
- **Interoperable context files** — Always load `AGENTS.md` (#96466), reflecting the cross-tool `AGENTS.md` standard.
- **Desktop UX polish** — Unpinning the task plan block (#104283), inline annotations on responses (#95237), top-level fork display (#100216).
- **Configurable network/automation behavior** — Opt-out of worktree pooling (#91472), disable background `git fetch` (#84698, #102760).

---

## 7. Developer Pain Points

- **Silent / untraceable behavior.** Background `git fetch` (#84698, #102760), plugins loading "nothing" without warning (#83422), and the message wipe on desktop update (#103465) all share a theme: things happen with no visible signal and no off switch.
- **Permission-model surprises.** "Always Allow" silently escalating session mode (#103615) and unprompted out-of-project file access (#103269) erode trust in the permission system.
- **Remote Control fragility.** Multiple issues (#104410, #100743, #104230, #102055) describe sessions dropping, archiving after idle, failing to restore after auto-update, and cross-session messages silently lost. This is now a cluster, not isolated reports.
- **Cost/limit unpredictability.** Overnight sleep burning weekly limits (#102269) alongside the plan-tier pressure (#47509).
- **Safeguard false positives.** `reasoning_extraction` trips (#102610, #97452) that poison transcripts and persistently kill sessions — with no clear path to un-flag.
- **Hardware-key touch fatigue.** SSH-remote background fetches triggering security-key prompts on every poll (#102760).

---

*Generated from GitHub data for 2026-10-23. Links are relative to github.com/anthropics/claude-code.*

</details>

<details>
<summary><strong>OpenAI Codex</strong> — <a href="https://github.com/openai/codex">openai/codex</a></summary>

# OpenAI Codex Community Digest — 2026-10-23

## 1. Today's Highlights

Release cadence remains high with four `0.164.0-alpha` builds shipped in 24 hours, though several appear to be CI-validation backports rather than feature drops. The community's attention is dominated by two persistent bug classes: **MCP process/resource leaks** (Issue #30408, now at 63 comments and 20 👍) and a cluster of **Computer Use / Browser Use URL-policy regressions** blocking previously working local and authorized remote flows. Notably, a new batch of `copyberry[bot]` PRs landed today covering a **Google Cloud Vertex AI provider**, MCP network-policy metadata, and AWS SigV4 body signing — signaling active work on enterprise/self-hosted model routing.

---

## 2. Releases

Four alpha releases published in the last 24h, all with empty release notes:

- [`rust-v0.164.0-alpha.12`](https://github.com/openai/codex/releases) — 0.164.0-alpha.12
- [`rust-v0.164.0-alpha.11`](https://github.com/openai/codex/releases) — 0.164.0-alpha.11
- [`rust-v0.163.0-alpha.11.2`](https://github.com/openai/codex/releases) — 0.163.0-alpha.11.2
- [`rust-v0.164.0-alpha.10`](https://github.com/openai/codex/releases) — 0.164.0-alpha.10

**Analyst note:** PR #56276 indicates `0.164.0-alpha.11.1` was cut specifically to **backport the Google Cloud Vertex AI provider** (#56265) onto the exact published `alpha.11` commit for CI validation. Users on `alpha.11` should watch for `alpha.12` to pick up that provider.

---

## 3. Hot Issues

1. **[#30408 — MCP server processes leak (9+ GB RSS)](https://github.com/openai/codex/issues/30408)** — 63 comments, 20 👍. The single most-engaged open issue. `codex app-server` spawns a full MCP process set per thread and never reaps them on archive/close. This is a long-running memory-exhaustion bug with high community resonance.

2. **[#50329 — Windows read_thread returns only chatgpt-content-reference](https://github.com/openai/codex/issues/50329)** — 22 comments. Windows App fails to surface completed ChatGPT replies through the thread API, breaking downstream automation.

3. **[#53154 — Chrome Computer Use flips from success to URL safety stop](https://github.com/openai/codex/issues/53154)** — 14 comments. A previously authorized page read now hard-stops with no actionable reason, a classic observability/trust regression.

4. **[#55783 — macOS sidebar Dot disappears while web Dot works](https://github.com/openai/codex/issues/55783)** — 12 comments, 6 👍. Cross-platform state drift between desktop and web for the same user object.

5. **[#37472 — Allow `request_user_input` in Default mode to wait indefinitely](https://github.com/openai/codex/issues/37472)** — 11 comments, **24 👍** (highest reaction count in this batch). Users want to disable the auto-timeout on interactive questions; strong enhancement demand.

6. **[#24847 — Browser Use blocks `file://` previews on Windows](https://github.com/openai/codex/issues/24847)** — 11 comments, 9 👍. Documented-supported `file://` previews are rejected by URL policy — a doc/behavior mismatch.

7. **[#49484 — Saved app approvals rejected as unrecognized config (Windows)](https://github.com/openai/codex/issues/49484)** — 7 comments. Desktop writes approvals the CLI/backend reject, creating a save-vs-restore loop.

8. **[#47592 — App replays completed request after compaction, abandons subagent](https://github.com/openai/codex/issues/47592)** — 5 comments. Context-compaction + subagent interaction causes duplicate work and orphaned delegated tasks.

9. **[#53486 — Project membership differs between sidebar and list_threads](https://github.com/openai/codex/issues/53486)** — 5 comments. `move_thread_to_project` success isn't reflected on readback — state consistency issue for the App server API.

10. **[#56262 — Banked resets rejected as "not needed" after global reset](https://github.com/openai/codex/issues/56262)** — 4 comments (fresh, same-day). Users lost 2 resets due to a mismatch between the eligibility check and displayed usage; a companion issue [#56259](https://github.com/openai/codex/issues/56259) clarifies the 80% policy. High-value, low-comment but revenue-adjacent.

---

## 4. Key PR Progress

All ten below were updated 2026-10-22 (mostly via `copyberry[bot]`).

1. **[#56276 — Prepare 0.164.0-alpha.11.1: backport Google Cloud Vertex AI provider](https://github.com/openai/codex/pull/56276)** *(OPEN)* — Backports #56265 onto the exact published `alpha.11` commit for CI validation. Signals GCP support is close to landing.

2. **[#56265 — Add a built-in Google Cloud Vertex AI provider](https://github.com/openai/codex/pull/56265)** — Supports `model_provider = "gcp"`, derives endpoint from `GOOGLE_CLOUD_PROJECT`/`GOOGLE_CLOUD_LOCATION`, uses ADC credentials. Major for enterprise self-hosting.

3. **[#56278 — Negotiated network policy metadata for MCP calls](https://github.com/openai/codex/pull/56278)** — Adds `NetworkPolicyMetadataProvider`, advertises `codex/network-policy-meta` to trusted ChatGPT origins only. Relevant to the Computer Use/Browser Use policy issues above.

4. **[#56266 — Preserve MCP disable reasons across runtime overlays](https://github.com/openai/codex/pull/56266)** — Fixes a case where a requirements denial on a custom `codex_apps` registration blocked the trusted hosted Apps replacement.

5. **[#56284 — Scope model catalogs and caches by thread originator](https://github.com/openai/codex/pull/56284)** — Originator-specific models managers and separate disk caches, so each thread gets the correct catalog.

6. **[#56277 — Bounded request bodies in AWS SigV4 signing](https://github.com/openai/codex/pull/56277)** — Removes the empty-body / `UNSIGNED-PAYLOAD` limitation in the network proxy, enabling signed nonempty payloads.

7. **[#56295 — Decouple managed configuration loading from ChatGPT auth](https://github.com/openai/codex/pull/56295)** — Introduces a `BundleSource` interface; moves ChatGPT plan eligibility into `ChatGptSource`. Cleaner auth/provider separation.

8. **[#56263 — Reject backslashes in HTTP(S) marketplace URL userinfo](https://github.com/openai/codex/pull/56263)** — Security fix: URL-parser vs. Git/libcurl backslash divergence could allow an allowed-host bypass.

9. **[#56250 — Avoid redundant settings checkpoints when resuming threads](https://github.com/openai/codex/pull/56250)** — Diffs effective vs. persisted settings before writing a `ThreadSettingsApplied` event. Reduces rollout bloat.

10. **[#56280 — Group consecutive transcript prompts into one background block](https://github.com/openai/codex/pull/56280)** — Small but visible UI polish in the rich transcript.

*Also noteworthy:* **[#56272](https://github.com/openai/codex/pull/56272)** upgrades Python SDK model generation to `datamodel-code-generator 0.64.0`; **[#56286](https://github.com/openai/codex/pull/56286)** bumps `@modelcontextprotocol/sdk` to `1.32.0`.

---

## 5. Hot Discussions

### Ideas
- **[#25630 — Switch Between Accounts](https://github.com/openai/codex/discussions/25630)** — 10 👍. Request for a ChatGPT-style account switcher instead of full sign-out/sign-in.
- **[#56158 — Please bring back the worktree button](https://github.com/openai/codex/discussions/56158)** — Users want the worktree toggle visible at session start, not buried in settings.
- **[#56157 — Codex CLI on Android with LinDesk](https://github.com/openai/codex/discussions/56157)** — Building a touch game via Codex CLI inside a Linux-on-Android workspace.

### Q&A
- **[#55792 — Windows desktop: supported review path when `/approve` is unavailable?](https://github.com/openai/codex/discussions/55792)** — No documented recourse when auto-approval rejects an action.
- **[#56208 — Chrome downloads: reliable unattended file collection?](https://github.com/openai/codex/discussions/56208)** — `ERR_BLOCKED_BY_CLIENT` on authenticated PDF links; asks for supported setup.
- **[#56069 — Picture-in-picture for MCP Apps on macOS?](https://github.com/openai/codex/discussions/56069)** — Third-party MCP App UI wants PiP presentation.

### Show and tell
- **[#55421 — TAHU: can an agent send a harmless email without leaking staff notes?](https://github.com/openai/codex/discussions/55421)** — Python authorization-gateway prototype seeking 3 developer trials.
- **[#54813 — Octuo: hand a goal to Codex under your own account](https://github.com/openai/codex/discussions/54813)** — Orchestration layer to avoid copy-pasting between Codex/Claude Code sessions.
- **[#56176 — Do fresh sessions actually receive AGENTS.md? Repeatable check](https://github.com/openai/codex/discussions/56176)** — `Agent Relay Check v0.1.0` verifies nested/overridden `AGENTS.md` instruction paths.
- **[#56181 — pytest-codex: turn AGENTS.md rules into pytest checks, with offline replay](https://github.com/openai/codex/discussions/56181)** — MIT plugin (v0.2.0) for behavior-testing Codex CLI.
- **[#56242 — ibara: a first Codex desktop task on an Omarchy spare computer](https://github.com/openai/codex/discussions/56242)** — Free, open-source remote-desktop-for-agents with MCP tools.
- **[#56215 — GFT-Merge: combine local conversations into a fresh session](https://github.com/openai/codex/discussions/56215)** — Controlled handoff demo across Claude Code / Codex.

---

## 6. Feature Request Trends

- **Better account/session ergonomics** — Switch accounts without sign-out (#25630), persistent worktree toggle visibility (#56158).
- **Deterministic interactivity** — Disable timeouts on `request_user_input` (#37472, 24 👍) and get a supported path to contest automatic approval rejections (#55792).
- **Trust/configurability of AGENTS.md** — Multiple community tools (#56176, #56181) target the need to *verify* instruction-path delivery, not just write it.
- **Native companion/remote surfaces** — Apple Watch app for prompts/approvals (#33528), PiP for MCP App UIs (#56069), Android via LinDesk (#56157).
- **Enterprise model routing** — Google Cloud Vertex AI provider (#56265/#56276) as the clearest signal of a self-hosted/BYO-credentials push.
- **Clickable terminal file references** — Opt-in hyperlinks with WSL-aware VS Code URL handling (#13213, now closed).

---

## 7. Developer Pain Points

1. **Resource lifecycle bugs go unfixed for months.** Issue #30408 (MCP leak) has been open since June 2026 and still tops engagement — unbounded memory growth in `app-server` erodes trust in long-running agent workflows.

2. **URL/safety policy is opaque and over-broad.** Chrome Computer Use (#53154), `file://` previews (#24847), and authorized AliExpress browsing (#47579) all hit URL-policy stops with no actionable reason or supported recovery path — a recurring "works, then blocks" pattern.

3. **Cross-surface state inconsistency.** Sidebar vs. `list_threads` (#53486), desktop vs. web Dots (#55783), desktop-saved approvals rejected by CLI (#49484) — the App, backend, and CLI disagree about shared state.

4. **Context compaction and subagents misbehave together.** #47592 (replayed request / abandoned subagent) and #32483 (reasoning-state cleared before accounting) suggest compaction interacts poorly with delegated work and billing accounting.

5. **Windows-specific sandbox/auth fragility.** `USER32` child launch failures (#46412), missing `SYSTEMROOT` on resume (#56264), false rollout-index mismatches on `\\?\` paths (#55536), and HTTP 432 workspace-routing failures (#52996) form a distinct Windows reliability cluster.

6. **Rate-limit/reset logic is confusing and costly.** #56262 and #56259 show the banked-reset eligibility check disagreeing with displayed usage, causing users to lose resets — a low-comment but high-impact pain point.

7. **Release notes are effectively empty.** Four alpha releases in 24 hours with no changelog content forces users to reverse-engineer changes from PRs — a friction point for anyone tracking pre-release channels.

---

*Digest compiled from GitHub activity on `openai/codex` for 2026-10-23. Links point to `github.com/openai/codex` — replace with full URLs (`https://github.com/openai/codex/issues/NNNNN`, etc.) for publication.*

</details>

<details>
<summary><strong>Gemini CLI</strong> — <a href="https://github.com/google-gemini/gemini-cli">google-gemini/gemini-cli</a></summary>

# Gemini CLI Community Digest — 2026-10-23

## 1. Today's Highlights

Agent reliability dominates this cycle's activity: two P1 issues (#26116 thinking loops, #21409 generalist agent hangs) remain open and heavily discussed, with community frustration mounting over regressions that make simple tasks take hours. Meanwhile, developers are pushing forward on infrastructure — container-sandbox IDE bridging landed in the nightly, and a wave of core fixes targets cancellation handling, path security, and stream-error recovery. A notable PR also introduces a `gemini-4-argon` model registration, hinting at upcoming model support.

---

## 2. Releases

**v0.67.0-nightly.20261022.g09d81bf11** (nightly, last 24h)

- Changelog rollup for v0.66.0-preview.0 (#29852)
- **feat(cli): bridge the IDE companion into container sandboxes over exec stdio** (#29858) — enables the IDE companion to communicate with CLI processes running inside container sandboxes, a meaningful step for devcontainer/remote workflows.
- Additional core fixes (details truncated in source data).

→ [Release page](https://github.com/google-gemini/gemini-cli/releases)

---

## 3. Hot Issues

1. **[#26116] Gemini stuck in thinking loop for hours** — P1 bug, 15 comments, 5 👍. The model enters non-terminating reasoning loops and sometimes stays in "thinking" state even after task completion. Users report a 2-minute task now taking 2 hours — a severe regression with the highest comment count this cycle. → [Link](https://github.com/google-gemini/gemini-cli/issues/26116)

2. **[#22323] Subagent MAX_TURNS recovery falsely reported as GOAL success** — P1 bug, 13 comments. The `codebase_investigator` subagent claims `status: "success"` / `Termination Reason: GOAL` despite hitting its turn limit before doing any analysis. This silently corrupts agent reliability signals and hides interruptions from users. → [Link](https://github.com/google-gemini/gemini-cli/issues/22323)

3. **[#19873] Zero-Dependency OS Sandboxing & Post-Execution Intent Routing** — P2 enhancement, 9 comments. Proposes leaning into Gemini's native bash affinity (chaining `grep`/`sed`/`awk`) while containing risk via OS-level sandboxing rather than restricting shell use. A design-level discussion about how the agent should fundamentally operate. → [Link](https://github.com/google-gemini/gemini-cli/issues/19873)

4. **[#21409] Generalist agent hangs** — P1 bug, 8 comments, **8 👍** (highest reaction count). Any deferral to the generalist subagent hangs indefinitely; even folder creation stalls. The workaround — instructing the model not to use subagents — defeats the architecture's purpose. → [Link](https://github.com/google-gemini/gemini-cli/issues/21409)

5. **[#22745] Assess AST-aware file reads, search, and mapping** — P2 EPIC, 7 comments. Tracks whether AST-precise reads reduce misaligned turns and token noise. This is the umbrella for a cluster of related investigations (#22746, #22747) — a strategic bet on context efficiency. → [Link](https://github.com/google-gemini/gemini-cli/issues/22745)

6. **[#21968] Gemini does not use skills and sub-agents enough** — P2 bug, 7 comments. Anecdotal but widely felt: the model ignores available skills ("gradle", "git") unless explicitly instructed. Undermines the extensibility story for custom skills. → [Link](https://github.com/google-gemini/gemini-cli/issues/21968)

7. **[#24246] 400 error with >128 tools** — P2 bug, 3 comments. Tool-count threshold triggers HTTP 400; the expectation is smarter tool scoping rather than hard failures. Increasingly relevant as extensions multiply available tools. → [Link](https://github.com/google-gemini/gemini-cli/issues/24246)

8. **[#23571] Model frequently creates tmp scripts in random spots** — P2 bug, 3 comments. When shell execution is restricted by exclusion, the agent scatters edit scripts across directories, polluting workspaces and complicating clean commits. → [Link](https://github.com/google-gemini/gemini-cli/issues/23571)

9. **[#22672] Agent should stop/discourage destructive behavior** — P2, 3 comments. The model occasionally reaches for `git reset` or `--force` when safer paths exist. A safety-relevant behavioral request from a maintainer. → [Link](https://github.com/google-gemini/gemini-cli/issues/22672)

10. **[#21983] Browser subagent fails on Wayland** — P1 bug, 4 comments. Linux/Wayland users hit `Termination Reason: GOAL` failures in the browser subagent — a platform-specific blocker for a meaningful user segment. → [Link](https://github.com/google-gemini/gemini-cli/issues/21983)

*Also notable:* #22267 (Browser Agent ignores `settings.json` overrides), #22186 (get-shit-done output hook crash), #18836 (replace WriteToDo with persistent file-based task tracking), #18287 (shared memory / parallel subagent collaboration).

---

## 4. Key PR Progress

1. **[#29838] fix(core): resolve relative file paths against active IDE workspace root** — P1. Resolves relative paths in `WriteFileTool`, `EditTool`, `ReadFileTool` against the live IDE workspace root (or nested Git root) rather than a stale fallback target dir. Fixes wrong-file edits in multi-root setups. → [Link](https://github.com/google-gemini/gemini-cli/pull/29838)

2. **[#29876] fix(core): prevent path traversal in legacy checkpoint fallback** — P1 security fix. Closes a traversal vulnerability in `Logger._getCheckpointPath()`/`deleteCheckpoint()` where legacy unencoded checkpoint filenames could escape the intended directory. → [Link](https://github.com/google-gemini/gemini-cli/pull/29876)

3. **[#29879] fix(core,cli,sdk): discard buffered tool calls on mid-stream error or retry** — Prevents phantom tool execution when a stream emits `ToolCallRequest` events and then fails, retries, or terminates abnormally. Closes a class of duplicate/polluted tool results. → [Link](https://github.com/google-gemini/gemini-cli/pull/29879)

4. **[#29875] feat(core,cli): add support for gemini-4-argon model** — Registers `gemini-4-argon` in `VALID_GEMINI_MODELS`, aliases, model definitions, and capability checks. Closes #29689. A forward-looking signal on model support. → [Link](https://github.com/google-gemini/gemini-cli/pull/29875)

5. **[#29881] fix(core,cli): ACP retry progress updates + retry delay cap and model fallback** — In `--acp` mode, 429 quota errors previously produced no progress signals and could mis-treat multi-hour quota resets as transient capacity blips. Fixes #29805. → [Link](https://github.com/google-gemini/gemini-cli/pull/29881)

6. **[#29878] fix(core): report blocked path segment instead of "path outside workspace"** — Fixes misleading errors when a path is inside an allowed directory but contains a blocked segment. Improves debuggability of path-validation failures. → [Link](https://github.com/google-gemini/gemini-cli/pull/29878)

7. **[#29882] fix(core): preserve file search results across query changes** — Search cache reuse caused later queries (e.g., `Src` → `Src*`) to silently omit valid results; cache is now only reused for identical queries. → [Link](https://github.com/google-gemini/gemini-cli/pull/29882)

8. **[#29868] fix(cli): stop continuation stream processing and auto-nudge after cancellation** — After pressing `Escape`, the CLI printed "Request cancelled" but kept executing continuation streams. Directly relevant to cancellation-hygiene complaints. → [Link](https://github.com/google-gemini/gemini-cli/pull/29868)

9. **[#29884] fix(core): allow trusted system paths on Android (Termux) for ripgrep resolution** — Extends `isTrustedSystemPath()` to accept Termux-installed ripgrep, unblocking `grep_search` on Android. → [Link](https://github.com/google-gemini/gemini-cli/pull/29884)

10. **[#29886] ci(evals): ignore test files in steering-signature detection** — Stops `*.test.ts` files from tripping the `Evals (ALWAYS_PASSING)` required job, reducing false-positive CI weight on unrelated changes. → [Link](https://github.com/google-gemini/gemini-cli/pull/29886)

*Also merged/closed:* #28642 (replace tree-sitter Bash parser with `unbash`, dropping WASM runtime), #29834 (preserve extended token-usage metadata in a2a-server), #29849 (handle SIGINT/SIGTERM in non-interactive mode).

---

## 5. Hot Discussions

No Discussion data was provided in the source dataset for this cycle; this section is omitted.

---

## 6. Feature Request Trends

- **Persistent, file-based task tracking** — #18836 and #21000 both push to replace in-context `WriteToDo` with durable CRUD-backed task state, addressing context rot and cross-session memory loss.
- **AST-aware tooling** — The #22745/#22746/#22747 cluster represents a coordinated bet on AST-precise reads, searches, and codebase mapping to cut token noise and misaligned turns.
- **Token-frugal surgical reads** — #19561 ("Tactful Extraction") proposes a grep-first discovery hierarchy to fight ~36.6k-token baseline context bloat.
- **Subagent observability & collaboration** — #22598 (`/chat share` for subagent trajectories), #21763 (bug reports missing subagent context), and #18287 (shared memory / parallel subagents) all target making multi-agent behavior inspectable.
- **Self-awareness & safer autonomy** — #21432 (accurate CLI flags/hotkeys for self-guidance) and #22672 (discourage destructive git/DB operations) reflect demand for an agent that understands its own mechanics and acts conservatively.
- **Browser agent resilience** — #22232 (session takeover/lock recovery) and settings-override fixes (#22267).

---

## 7. Developer Pain Points

1. **Hangs and infinite loops are the top frustration** — #26116 (hours-long thinking loops), #21409 (generalist agent hangs forever, 8 👍), and #22465 (stuck at interactive Vite prompt) collectively show that non-terminating execution remains the most damaging reliability gap.
2. **Silent failure masking** — #22323 (MAX_TURNS reported as GOAL success) and #21763 (no subagent context in bug reports) mean failures are invisible exactly when users need diagnostics most.
3. **Underused extensibility** — #21968 shows skills/subagents go ignored without explicit prompting, undercutting the custom-skills value proposition.
4. **Cancellation leaks** — #29868 and #29849 reveal that `Escape`/SIGINT doesn't reliably stop in-flight streams or tool side effects.
5. **Workspace pollution** — #23571 (scattered tmp scripts) creates cleanup overhead for teams wanting clean commits.
6. **Configuration desync** — #22267 (settings.json overrides ignored) and #29867 (deprecated-settings migration clobbering `${VAR}` placeholders) show config handling is still fragile.
7. **Platform gaps** — Android/Termux ripgrep resolution (#29884) and Wayland browser-agent failure (#21983) leave non-mainstream platforms behind.
8. **Tool-count limits** — #24246's >128-tool 400 error will only worsen as the extension ecosystem grows.

</details>

<details>
<summary><strong>GitHub Copilot CLI</strong> — <a href="https://github.com/github/copilot-cli">github/copilot-cli</a></summary>

# GitHub Copilot CLI Community Digest — 2026-10-23

## 1. Today's Highlights

Version **v1.0.103** shipped with a notable quality-of-life fix: clicking a completed response code block now copies the original code, and ACP sessions finally honor saved sandbox settings (including on resume). Meanwhile, community attention is dominated by **MCP OAuth/authentication reliability issues** (multiple new reports of expired tokens, broker cache failures, and browser re-auth loops) and a fresh **permission-safety concern** around trusted-folder auto-approval of shell execution (#5232).

## 2. Releases

**v1.0.103** (2026-10-22) — [repo](https://github.com/github/copilot-cli)
- Clicking a completed response code block copies its original code (when enabled).
- ACP sessions now honor saved sandbox settings and `--sandbox`/`--no-sandbox` flags, including on resume.
- Cloud replies preserve full text when the CLI reconnects after a dropped connection.
- Sessions browser improvements (details truncated in source).

**v1.0.103-0** (prerelease) — [repo](https://github.com/github/copilot-cli)
- **Added:** Same code-block copy behavior as above.
- **Improved:** Reuse cached local MCP tool snapshots across registered Git worktrees in one repository; clearer remote launch hosting/connection flags; legacy `--remote`/`--no-re*` flags retired.

## 3. Hot Issues

1. **[#5197](https://github.com/github/copilot-cli/issues/5197)** — *Voice server segfaults (signal 11) on WSL2 since 1.0.100; `/voice` stuck on "Fetching voice models."* A hard crash blocking voice input for WSL2 users. 4 comments, 2 👍 — active but unresolved.
2. **[#3013](https://github.com/github/copilot-cli/issues/3013)** — *Hooks don't fire for background (task) agents.* Long-standing security concern: sub-agents bypass guardrail hooks. Closed on 2026-10-22 after ~6 months — a meaningful resolution.
3. **[#4802](https://github.com/github/copilot-cli/issues/4802)** — *PRU quota wiped out, likely tied to Assisted Permissions.* Billing-impacting bug on Pro (Legacy PRU) plans; high-stakes for affected users.
4. **[#4065](https://github.com/github/copilot-cli/issues/4065)** — *Secret redaction too aggressive, redacts legitimate content.* False positives on `${env.AUTH_TOKEN}`-style spec files. 3 👍 signals broader annoyance.
5. **[#5232](https://github.com/github/copilot-cli/issues/5232)** — *Trusted folders silently auto-approve shell execution in manual mode.* Fresh report: path-based gating can't predict side effects (`powershell.exe`, `sqlcmd`, `curl`). Potential security vulnerability.
6. **[#5203](https://github.com/github/copilot-cli/issues/5203)** — *Feature request: stable release channel.* Direct response to rapid-release regressions; resonates with the "breaking daily use" sentiment.
7. **[#5219](https://github.com/github/copilot-cli/issues/5219)** — *Task subagent with unknown model id falls back to 128k caps and wedges the whole turn.* Long sessions become unusable; model-resolution bug in agent delegation.
8. **[#5133](https://github.com/github/copilot-cli/issues/5133)** — *`includeCoAuthoredBy: false` ignored in ACP mode.* Config inconsistency between `-p` and `--acp` modes; affects commit hygiene.
9. **[#5089](https://github.com/github/copilot-cli/issues/5089)** — *`copilot --acp` ignores `--sandbox` and `sandbox.enabled`.* Now **closed**, likely addressed by the v1.0.103 ACP sandbox fix.
10. **[#5238](https://github.com/github/copilot-cli/issues/5238)** — *Repeated cache bust for every image after the 50th.* Expensive full cache refill on image eviction; cost/efficiency concern on 1.0.103.

## 4. Key PR Progress

No pull requests were updated in the last 24 hours (Total: 0 items). This section is omitted per data availability.

## 5. Hot Discussions

No discussion data was provided. This section is omitted.

## 6. Feature Request Trends

- **Release stability & channels** — [#5203](https://github.com/github/copilot-cli/issues/5203) requests a stable channel separate from the fast release train.
- **Model control** — [#5231](https://github.com/github/copilot-cli/issues/5231) asks to exclude flaky models from Auto selection.
- **Voice configurability** — [#5226](https://github.com/github/copilot-cli/issues/5226) wants a configurable transcription language instead of hard-coded `"auto"`.
- **Terminal UX** — [#5227](https://github.com/github/copilot-cli/issues/5227) requests pinning the input box to the top; [#2750](https://github.com/github/copilot-cli/issues/2750) (closed) sought keyboard-only scrolling.
- **Context persistence** — [#5225](https://github.com/github/copilot-cli/issues/5225) asks to retain `sessionStart` hook `additionalContext` after compaction.
- **Interactive skills** — [#5235](https://github.com/github/copilot-cli/issues/5235) wants skills to ask clarifying questions in interactive mode.

## 7. Developer Pain Points

- **MCP authentication is the dominant cluster today.** Four separate reports (#5233, #5234, #5236, #5229) describe expired tokens being resent instead of refreshed, empty Entra broker caches forcing re-login per process, and ACP mode skipping refresh tokens in favor of browser auth. Windows CLI can even become unusable when an MCP server needs auth.
- **Permission/sandbox semantics remain inconsistent.** #5232 (trusted-folder auto-approve) and #5089/#5133 (ACP ignoring sandbox and config) show path- and mode-based gating producing surprising behavior.
- **Rapid releases cause regressions.** #5197 (voice segfault on WSL2), #5190 (Autopilot hiding model output), and #5228 (`--resume` UI auto-replaced) all trace to recent versions — reinforcing the stable-channel request.
- **Session reliability in long runs.** #5219 (wedged turns from subagent model fallback) and #4914 (Gemini mixed-model history failures) show long-lived sessions are fragile.
- **Proxy and DNS environments.** #5230 (`web_fetch` DNS validation failing in proxy-only setups) and #5027 (Linux sandbox DNS with systemd-resolved, now closed) highlight enterprise networking friction.

---
*Generated from github.com/github/copilot-cli data for 2026-10-23. Issue counts and comment tallies reflect the provided snapshot.*

</details>

<details>
<summary><strong>OpenCode</strong> — <a href="https://github.com/anomalyco/opencode">anomalyco/opencode</a></summary>

# OpenCode Community Digest — 2026-10-23

## 1. Today's Highlights

A single patch release landed: **v1.19.4** upgrades the bundled Bun runtime to **1.4.4**, bringing a batch of security fixes (Brotli, TLS, HTTP/1.1–3, WebSocket, `fetch`) plus updated root certificates. Triage activity was heavy — a large wave of long-running issues (some open since July) was closed today, including the migration session-visibility bug (#49827) and the MCP `structuredContent` data-loss bug (#38923). Meanwhile, several Beta-branch PRs from the core team signal active work on **server-restart recovery for background subagents** and **desktop UX polish**.

## 2. Releases

**v1.19.4** — Core improvements only:
- Upgraded bundled Bun runtime to **1.4.4**, which includes [security fixes](https://bun.com/blog/bun-v1.4.4#security) for Brotli, TLS, HTTP/1.1, HTTP/2, HTTP/3, WebSocket, and `fetch`.
- Root certificates updated to **NSS 3.131.1**.

This is a security-relevant dependency bump; no feature or behavior changes.

## 3. Hot Issues

1. **#49827 [CLOSED] — V1→V2 migration hides non-git "global" sessions** ([link](https://github.com/anomalyco/opencode/issues/49827))
   *16 comments, 👍2.* After upgrading, sessions created in non-git directories vanish from the TUI picker because V2 scopes sessions per-directory. High engagement, and a targeted fix PR (#56322) was merged today — but only for *future* imports, meaning already-migrated users still need a migration path.

2. **#19005 [CLOSED] — Make local file paths clickable in terminal output** ([link](https://github.com/anomalyco/opencode/issues/19005))
   *9 comments, 👍8 — the highest-upvoted issue in today's set.* A long-standing ergonomics request open since March: users want to click generated file paths instead of copy-pasting `open <path>`. Strong community signal; closure likely means it shipped or was folded into another effort.

3. **#58175 [OPEN] — deepseek-v4.1-flash prompt cache collapses above ~256k context** ([link](https://github.com/anomalyco/opencode/issues/58175))
   *4 comments.* Since 2026-10-17, cached prefix on `opencode/deepseek-v4.1-flash` drops to a constant ~16,640 tokens beyond ~256k context, re-billing the full conversation at uncached rates every turn. A live cost-impacting regression — worth watching.

4. **#45087 [CLOSED] — Auto-updater consumed 266 GB reinstalling OpenCode every 10 minutes** ([link](https://github.com/anomalyco/opencode/issues/45087))
   *7 comments.* A `serve --service` process kept its in-memory compiled version after npm updated the binary, so its update loop reinstalled perpetually, filling `~/.npm/_cacache`. Dramatic symptom of a version-skew bug; closure is welcome.

5. **#38923 [CLOSED] — MCP `structuredContent` dropped, only `content[].text` reaches the model** ([link](https://github.com/anomalyco/opencode/issues/38923))
   *5 comments, 👍4.* Tools returning JSON payloads in `structuredContent` silently lost data. Important interoperability fix for the MCP ecosystem — closure indicates the payload now reaches the model.

6. **#55166 [CLOSED] — v2 MCP OAuth follows cross-origin redirects with request bodies** ([link](https://github.com/anomalyco/opencode/issues/55166))
   *4 comments.* Opencode v2.0.28 pinned `@modelcontextprotocol/client` 2.0.0, vulnerable per GHSA-6prh-2h8m-c8cw. Security hygiene issue; expect resolution via the MCP SDK bump to 2.3.1 (PR #58232).

7. **#57228 [CLOSED] — Docker image `anomalyco/opencode:latest` does not exist** ([link](https://github.com/anomalyco/opencode/issues/57228))
   *7 comments.* Docs at opencode.asia/docker referenced an unpublished image, breaking `docker compose up` out of the box. Packaging/distribution gap; closure suggests the image or docs were corrected.

8. **#53688 [CLOSED] — Bun 1.4.2 segfault on Windows after long `serve` uptime** ([link](https://github.com/anomalyco/opencode/issues/53688))
   *7 comments.* `opencode serve` crashed with a Bun segmentation fault (`0x3D8`) after minutes-to-hours of uptime. Directly relevant to today's release: v1.19.4's Bun 1.4.4 bump likely carries the upstream fix.

9. **#57955 [CLOSED] — github-copilot provider shows zero models on auto-only accounts** ([link](https://github.com/anomalyco/opencode/issues/57955))
   *3 comments.* `GET /models` returns `model_picker_enabled: false` for every model on Copilot Free/Student accounts, making the provider unusable. A notable auth/account-tier integration failure.

10. **#58128 [OPEN] — Do not stop retrying on LLM API failures** ([link](https://github.com/anomalyco/opencode/issues/58128))
    *3 comments.* The hardcoded retry policy (10 tries, exponential backoff capped at 10s) means a backend restart can halt an agent run. The author argues the default is "hugely bad" to hardcode — a likely-to-grow configurability request.

## 4. Key PR Progress

1. **#56322 [CLOSED] — fix(core): attribute V1 global sessions during import** ([link](https://github.com/anomalyco/opencode/pull/56322))
   Closes #49827 by correctly attributing global-project sessions at import time — but explicitly only for *new* V1→V2 imports.

2. **#58232 [CLOSED] — chore(core): update MCP SDK to 2.3.1** ([link](https://github.com/anomalyco/opencode/pull/58232))
   Bumps `@modelcontextprotocol/client`/`core`/`server` from 2.0.0 to 2.3.1, dropping two now-upstreamed patch hunks while carrying the remaining three forward. Directly addresses the OAuth redirect advisory (#55166).

3. **#58260 [OPEN] — fix(session): label server-restart interruptions and treat declines as deliberate** ([link](https://github.com/anomalyco/opencode/pull/58260))
   Adds a "Server restarted" notice only after startup recovery confirms a restart; declined permissions remain "Interrupted" and don't auto-resume. Improves session-state honesty.

4. **#58261 [OPEN] — fix(core): resume background subagents after a server restart** ([link](https://github.com/anomalyco/opencode/pull/58261))
   Stacked on #58260. Background subagents survive a restart, resume once, and deliver exactly one result. Long-running agent workflows become resilient to server restarts.

5. **#58259 [OPEN] — feat(desktop): capture app and server heap snapshots into one folder** ([link](https://github.com/anomalyco/opencode/pull/58259))
   New command-palette action writes desktop + local-server heap snapshots into a single folder; `opencode debug heap-dump` now accepts an optional directory. Meaningful for diagnosing desktop memory issues.

6. **#58263 [OPEN] — fix(desktop): stop AppImage executable name ending in `.desktop`** ([link](https://github.com/anomalyco/opencode/pull/58263))
   Fixes #51867: the AppImage ELF named `ai.opencode.desktop` was being parsed as a desktop file by KDE/libappimage scanners. Packaging correctness fix.

7. **#57305 [OPEN] — fix(tui): expand pasted image and PDF paths on click** ([link](https://github.com/anomalyco/opencode/pull/57305))
   Clicking an image/PDF attachment label restores the original editable path. Closes #57298 and #57698 — a direct TUI ergonomics win.

8. **#58262 [CLOSED] — fix: regenerate broken OpenAPI documents and check them in CI** ([link](https://github.com/anomalyco/opencode/pull/58262))
   `deploy-www` had failed on every `dev` commit since #58252 due to invalid `openapi.json`. Adds CI validation — a CI-reliability fix with broad downstream impact.

9. **#58253 [CLOSED] — chore: use `bun check` for local typechecks and TypeScript 7.1 in CI** ([link](https://github.com/anomalyco/opencode/pull/58253))
   Splits local vs. CI toolchains: fast local `bun check`, official compiler (TS 7.1) for CI and publishing. Developer-experience velocity improvement.

10. **#58264 [OPEN] — fix(tui): preserve model preferences when switching to mini** ([link](https://github.com/anomalyco/opencode/pull/58264))
    `opencode mini` now resolves fallback in order: `--model`, configured model, first recent model. A re-submission of the cleaned-up #50620, closing long-standing #50376.

## 5. Hot Discussions

No Discussion data was provided for this period. (Section omitted per formatting rules.)

## 6. Feature Request Trends

Distilled from today's Issues and PRs:

- **TUI/Desktop customization** — configurable sidebar width (#35513), per-message timestamps (#57929), `fontSize` actually applying (#44184), and timeline detail accuracy (#58150) form a clear cluster of "let me tune the UI" requests.
- **Agent resilience & session continuity** — retry-policy configurability (#58128), resume-after-restart (#58260/#58261), and workspace locking to prevent file modification (#58241) point to demand for more control over agent persistence and side effects.
- **MCP management UX** — #58243 proposes a full MCP manager: per-server output links, secure secret storage, config editor, and richer inputs. Complements the SDK bump and `structuredContent` fix.
- **Skill/context discovery** — auto-discovery of skills from nested subdirectories (#31377) and local provider model visibility in the TUI (#57210) reflect appetite for richer local-context integration.
- **Shell/terminal integration** — clickable file paths (#19005) and clickable attachment paths (#57305) show sustained demand for tighter terminal ↔ filesystem ergonomics.

## 7. Developer Pain Points

- **Provider/model catalog inconsistencies.** Models visible in TUI but missing from web UI (#45934), Ollama models absent from the TUI picker (#57210), and github-copilot showing zero models (#57955) suggest the model registry is not consistently surfaced across frontends.
- **Cost-impacting runtime surprises.** The deepseek-v4.1-flash cache collapse (#58175) and the 266 GB auto-updater loop (#45087) both hit users in the wallet or disk, and both took months or days to surface.
- **Packaging & distribution gaps.** A missing Docker image (#57228), an AppImage executable misnamed `.desktop` (#51867), and a broken `openapi.json` breaking deploys (#58262) indicate packaging/publishing hygiene needs attention.
- **Retry and failure semantics.** Hardcoded retry caps (#58128) and empty "stop" completions recorded as success (#37735) frustrate users who need predictable failure behavior in long-running agents.
- **Upgrade-path data visibility.** The global-session hiding bug (#49827) and its partial fix (only future imports) highlight a recurring theme: migrations preserve data but can silently lose discoverability.

</details>

<details>
<summary><strong>Pi</strong> — <a href="https://github.com/earendil-works/pi">earendil-works/pi</a></summary>

# Pi Community Digest — 2026-10-23

## 1. Today's Highlights

No new releases landed in the last 24 hours, but the issue tracker and PR queue were extremely active: a large batch of long-running bugs around HTML export, `/model` fuzzy search, and TUI performance were closed by community PRs. The most notable cross-cutting themes are growing pains in large-session handling (export depth, fork speed, full re-renders), provider/model configuration gaps (compaction thinking levels, `modelOverrides`, provider-scoped auto-compaction), and several P0 startup/termination bugs on Windows and macOS.

## 2. Releases

No new releases in the last 24h. *(Section omitted per policy.)*

## 3. Hot Issues

1. **[#7553](https://github.com/earendil-works/pi/issues/7553)** — *Configurable thinking level/model for compaction* (OPEN, 12 comments, 👍3). Compaction unconditionally inherits the session's thinking level, coupling summarization cost to normal turns. High engagement; marked `inprogress`/`to-discuss`.
2. **[#10019](https://github.com/earendil-works/pi/issues/10019)** — *Anthropic subscription requests hang at :00/:30 UTC* (OPEN, 11 comments, 👍3). Sessions freeze on the half-hour boundary with 200 + pings but no `message_start`; a notable reliability regression vs. Claude Code.
3. **[#6167](https://github.com/earendil-works/pi/issues/6167)** — *`transformMessages` thinking-block normalization vs. `requiresReasoningContentOnAssistantMessages`* (CLOSED, 10 comments). Long-running model-switch corruption bug finally closed — important for mixed-reasoning workflows.
4. **[#9932](https://github.com/earendil-works/pi/issues/9932)** — *`before_agent_start` forced system prompt keeps removed tools* (OPEN, 6 comments). Extension authors' `setActiveTools()` removals are overridden by forced prompts — an API ordering/consistency bug.
5. **[#11223](https://github.com/earendil-works/pi/issues/11223)** — *`modelOverrides` silently ignored for classifier models* (OPEN, 5 comments). Config that fails silently is especially painful for teams standardizing model metadata.
6. **[#9807](https://github.com/earendil-works/pi/issues/9807)** — *Full re-render causes scroll/typing lag at 800+ messages* (OPEN, 5 comments, 👍3). Clear performance regression vs. OpenCode's incremental diffing; strong community visibility.
7. **[#11086](https://github.com/earendil-works/pi/issues/11086)** — *[prio:p0] Symbols leaking into input on Windows terminal under CPU load* (OPEN, 4 comments). Input integrity bug in a real SSH + Windows workflow; P0 tag signals urgency.
8. **[#11088](https://github.com/earendil-works/pi/issues/11088)** — *[prio:p0] Startup crashes with raw stack trace when npm package fails to install* (OPEN, 4 comments). Affects `--help`, `--list-models`, and `-p`; no `crashes.json` written, so diagnostics are lost.
9. **[#11225](https://github.com/earendil-works/pi/issues/11225)** — *`/export` HTML blank for long sessions: stack overflow in `sortChildren`* (CLOSED, 2 comments). Recursive tree walks break on ~6k+ entries; firmly addressed below in PRs.
10. **[#11287](https://github.com/earendil-works/pi/issues/11287)** — *Extension API providers wiped by mid-session settings reload* (CLOSED, 2 comments). An `uncaughtException` kills the process when settings auto-reload fires — a severe extension-stability class of bug.

Honorable mentions: [#11250](https://github.com/earendil-works/pi/issues/11250) / [#11251](https://github.com/earendil-works/pi/issues/11251) (strip HTML comments from context files, `no-action`); [#11282](https://github.com/earendil-works/pi/issues/11282) (missing macOS/brew docs, repo not public, `no-action`); [#11292](https://github.com/earendil-works/pi/issues/11292) / [#11291](https://github.com/earendil-works/pi/issues/11291) (`/reload` should re-read `AGENTS.md`); [#11253](https://github.com/earendil-works/pi/issues/11253) (slow `forkFrom`, `fix-available`).

## 4. Key PR Progress

1. **[#11293](https://github.com/earendil-works/pi/pull/11293)** — *Render HTML export for sessions deeper than the call stack*. Replaces recursive `sortChildren`/`mapNodes`/`markActive` with explicit stacks. Fixes [#11225](https://github.com/earendil-works/pi/issues/11225); sibling PRs [#11275](https://github.com/earendil-works/pi/pull/11275) and [#11274](https://github.com/earendil-works/pi/pull/11274) land the same fix.
2. **[#11290](https://github.com/earendil-works/pi/pull/11290)** — *Render system messages in HTML export*. System prompt and tool list now appear; later system messages render as named section/tool updates. Closes [#11261](https://github.com/earendil-works/pi/issues/11261) and [#3464](https://github.com/earendil-works/pi/issues/3464).
3. **[#11289](https://github.com/earendil-works/pi/pull/11289)** — *Stop macOS shell groups before killing them*. Reduces the race where an aborted `a; b` command still runs `b` under CPU load. Closes [#11252](https://github.com/earendil-works/pi/issues/11252).
4. **[#11288](https://github.com/earendil-works/pi/pull/11288)** — *Write forked session through one fd*. Eliminates ~3,000 open/close cycles when forking large sessions. Closes [#11253](https://github.com/earendil-works/pi/issues/11253).
5. **[#11296](https://github.com/earendil-works/pi/pull/11296)** — *Rank contiguous fuzzy matches and search session fields separately*. Fixes the notorious `/model` ranking issue where "opus" surfaced Sonnets first. Closes [#11220](https://github.com/earendil-works/pi/issues/11220); related: [#11145](https://github.com/earendil-works/pi/pull/11145).
6. **[#11299](https://github.com/earendil-works/pi/pull/11299)** — *Fix `thinkingLevelMap?.off` type guard and spurious `max_completion_tokens`*. Resolves HTTP 400s for models without a `thinkingLevelMap` via OpenRouter-format reasoning.
7. **[#11257](https://github.com/earendil-works/pi/pull/11257)** — *Preserve `pi.exec` spawn errors*. Spawn failures now surface as `stderr` instead of silent empty output. Fixes [#11085](https://github.com/earendil-works/pi/issues/11085).
8. **[#7952](https://github.com/earendil-works/pi/pull/7952)** — *Add `messageId` and `timestamp` to markdown transformer context*. Lets extensions decorate per-message content. Closes [#7828](https://github.com/earendil-works/pi/issues/7828).
9. **[#11278](https://github.com/earendil-works/pi/pull/11278)** — *Preserve `ctx.ui` getters through `wrapUIPromptContext`*. Object spread was resolving `get theme()` too early for hosts like pi-web; getters now survive wrapping.
10. **[#11265](https://github.com/earendil-works/pi/pull/11265)** — *Carry `responseModel` on pi-messages terminal events*. Enables consumers (e.g. Radius) to know which physical model a virtual model resolved to. Complements [#11000](https://github.com/earendil-works/pi/pull/11000).

Also noteworthy: [#11270](https://github.com/earendil-works/pi/pull/11270) (drop ineffective `min-release-age=0` flag that security scanners blocked), [#11231](https://github.com/earendil-works/pi/pull/11231) (Windows installer tab in Quickstart), [#9301](https://github.com/earendil-works/pi/pull/9301) (confirm device-code browser/clipboard actions), [#10528](https://github.com/earendil-works/pi/pull/10528) (Nix packaging cleanup).

## 5. Hot Discussions

No Discussions data was provided in the source; section omitted.

## 6. Feature Request Trends

- **Compaction & context control**: per-compaction thinking level/model ([#7553](https://github.com/earendil-works/pi/issues/7553)), provider-scoped auto-compaction with absolute token thresholds ([#11295](https://github.com/earendil-works/pi/issues/11295)), configurable idle cache-warming horizon ([#11127](https://github.com/earendil-works/pi/issues/11127)).
- **Model/provider configuration fidelity**: honoring `modelOverrides` for classifier models ([#11223](https://github.com/earendil-works/pi/issues/11223)), built-in provider model refresh ([#11116](https://github.com/earendil-works/pi/issues/11116)), preserving model attribution for auxiliary token usage ([#11090](https://github.com/earendil-works/pi/issues/11090)).
- **Extension/API surface**: message identity in markdown transformers ([#7828](https://github.com/earendil-works/pi/issues/7828)), durable MCP extension for Harness hosts ([#10837](https://github.com/earendil-works/pi/issues/10837)), per-package control of native tool exposure ([#11286](https://github.com/earendil-works/pi/issues/11286)), custom OAuth client name for MCP servers ([#10226](https://github.com/earendil-works/pi/issues/10226)).
- **Session ergonomics**: `/reload` re-reading `AGENTS.md` ([#11292](https://github.com/earendil-works/pi/issues/11292)), inline slash autocomplete for skills ([#11294](https://github.com/earendil-works/pi/issues/11294)), better fuzzy search in `/resume` and `/model` ([#11220](https://github.com/earendil-works/pi/issues/11220)).
- **Context file compatibility**: matching Claude Code's handling of `CLAUDE.md` — stripping whole-line HTML comments ([#11250](https://github.com/earendil-works/pi/issues/11250), [#11251](https://github.com/earendil-works/pi/issues/11251)).

## 7. Developer Pain Points

- **Large-session scaling**: full TUI re-renders ([#9807](https://github.com/earendil-works/pi/issues/9807)), recursive HTML export stack overflows ([#11225](https://github.com/earendil-works/pi/issues/11225)), and slow `forkFrom` ([#11253](https://github.com/earendil-works/pi/issues/11253)) all point to the same architectural stress: per-entry file I/O and recursive tree walks don't hold up at thousands of messages.
- **Silent misconfiguration / silent failure**: `modelOverrides` ignored without warning ([#11223](https://github.com/earendil-works/pi/issues/11223)), spawn errors swallowed by `pi.exec` ([#11085](https://github.com/earendil-works/pi/issues/11085)), and raw stack traces with no `crashes.json` on startup failure ([#11088](https://github.com/earendil-works/pi/issues/11088)) erode trust in the config surface.
- **Reliability across environments**: Anthropic subscription hangs ([#10019](https://github.com/earendil-works/pi/issues/10019)), Windows input corruption under load ([#11086](https://github.com/earendil-works/pi/issues/11086)), and macOS abort races ([#11252](https://github.com/earendil-works/pi/issues/11252)) show platform-specific fragility.
- **Extension lifecycle stability**: mid-session settings reload wiping extension-registered API providers ([#11287](https://github.com/earendil-works/pi/issues/11287)) and `before_agent_start` ordering bugs ([#9932](https://github.com/earendil-works/pi/issues/9932)) are recurring extension-author frustrations.
- **Destructive defaults / accidental data loss**: CTRL+C clearing the entire prompt with no confirmation ([#9190](https://github.com/earendil-works/pi/issues/9190)) remains a vocal, high-friction complaint despite being closed `no-action`.

</details>

<details>
<summary><strong>Qwen Code</strong> — <a href="https://github.com/QwenLM/qwen-code">QwenLM/qwen-code</a></summary>

# Qwen Code Community Digest — 2026-10-23

## 1. Today's Highlights

Activity this cycle is dominated by **daemon/serve hardening** and a wave of **Managed Agent CI instability**. Two nightly/SDK releases landed, headlined by daemon token persistence and a fresh TypeScript SDK bundling the 0.26.0 CLI. Meanwhile, the issue tracker shows a concentrated burst of `qwen-code-dev-bot`-filed "Main CI failed" reports against the Managed Agent gate and SDK Java lanes, plus several substantive post-merge review findings around CI failure reporting.

## 2. Releases

**v0.26.0-nightly.20261022.bf66a26c97**
- `feat(serve)`: add daemon token persistence ([#15023](https://github.com/QwenLM/qwen-code/pull/15023)) — improves session continuity across daemon restarts.
- `fix(release)`: ensure every spawned vendored binary is covered during release packaging.

**sdk-typescript-v0.1.22**
- Bundles CLI version **0.26.0** (built from the same branch/ref as the SDK). Note: the release notes contain duplicated "Bundled CLI Version" blocks (also referencing 0.25.3), which appears to be a release-note generation artifact worth flagging.

## 3. Hot Issues

1. **[#15138](https://github.com/QwenLM/qwen-code/issues/15138) — CI: Java failure reporter can silently drop PR reports or accept partial paginated jobs** (P2, 6 comments). A post-merge review by @doudouOUC documented two reporting gaps; high engagement suggests the CI reporting pipeline is a trust-critical surface.

2. **[#15267](https://github.com/QwenLM/qwen-code/issues/15267) — `--no-isolate` CLI test run overwrites real `~/.qwen/settings.json`** (P3, 5 comments). A genuinely dangerous test-hygiene bug: running unit tests can clobber a developer's real MCP servers and model providers.

3. **[#12277](https://github.com/QwenLM/qwen-code/issues/12277) — `serve`: Local Control `EADDRINUSE` when ephemeral port is held on LAN** (P2, CLOSED, 5 comments). A concrete daemon-mode networking failure affecting Desktop's Local Control feature; now resolved.

4. **[#15235](https://github.com/QwenLM/qwen-code/issues/15235) — `reasoning.effort "max"` silently downgraded to `"xhigh"` on non-Z.ai hostnames** (P2, 5 comments). A subtle provider-routing bug: identical providers reached via a local reverse proxy get a different effort ceiling.

5. **[#8968](https://github.com/QwenLM/qwen-code/issues/8968) — Support MCP 2026-07-28 and MCP Apps in daemon WebShell** (P2 feature, 4 comments). Long-running request to migrate the MCP client and make WebShell a first-class MCP Apps host.

6. **[#15248](https://github.com/QwenLM/qwen-code/issues/15248) — SDK Java runtime broker timing tests flake 3/3 on GitHub-hosted runners** (P2, 4 comments). Fork PRs are blocked by a hosted-vs-self-hosted runner timing divergence.

7. **[#15280](https://github.com/QwenLM/qwen-code/issues/15280) — Web Shell: show full tool arguments and results when an MCP tool card is expanded** (P2 feature, 3 comments). Usability gap where only built-in tools render detail views.

8. **[#15276](https://github.com/QwenLM/qwen-code/issues/15276) — Windows desktop update fails while bundled `node.exe` stays locked** (P1, 3 comments, ready-for-human). An update-blocking installer bug affecting all Windows Desktop users.

9. **[#15258](https://github.com/QwenLM/qwen-code/issues/15258) — Hook surfaced post-auto-compaction session text prematurely** (P3, 3 comments). Session-management/lifecycle ordering issue in the hooks/events roadmap area.

10. **[#15225](https://github.com/QwenLM/qwen-code/issues/15225) — Trailing auto-memory user message can prematurely stop tool-using agents** (P2, 3 comments). A long-context/memory interaction bug that changes agent behavior mid-session.

## 4. Key PR Progress

1. **[#15218](https://github.com/QwenLM/qwen-code/pull/15218) — Gate managed automations on a Runtime probe run before the claim.** Adds a shell-command gate evaluated each fire; quiet exits settle as `skipped/gate_quiet` with no journal commit or turn.

2. **[#15263](https://github.com/QwenLM/qwen-code/pull/15263) — Remove pre-release compatibility paths in Managed Agent.** Consolidates Server, Broker, Harness, Java SDK and WebShell onto one first-release contract; removes backfills and legacy checkpoint/digest formats.

3. **[#15250](https://github.com/QwenLM/qwen-code/pull/15250) — Skip main-failure issues for post-merge reruns.** Stops the failure tracker from filing false main-regression issues when a workflow rerun re-executes a pre-merge tree.

4. **[#15254](https://github.com/QwenLM/qwen-code/pull/15254) / [#15274](https://github.com/QwenLM/qwen-code/pull/15274) — Scope the SDK Java host lock to the cache write-back.** Seeds a job-local Maven repo, runs suites lock-free, and takes the ticketed lock only for final cache write-back. Two overlapping PRs suggest converging CI optimization work.

5. **[#15174](https://github.com/QwenLM/qwen-code/pull/15174) — Refuse partial paginated job lists before reporting.** The failure reporter now only publishes a provably complete job list, directly addressing the reliability concern in #15138.

6. **[#15255](https://github.com/QwenLM/qwen-code/pull/15255) — Shared Harness pool for Kubernetes.** Opt-in pool with durable tenant/Workspace/instance placement, monotonic epochs, and placement-bound writer fencing for Managed Agent.

7. **[#15209](https://github.com/QwenLM/qwen-code/pull/15209) — `qwen attach`: attach a terminal to daemon sessions.** Lets a terminal rejoin an existing local daemon session via the TypeScript SDK, rendering normalized assistant/thought streams.

8. **[#15211](https://github.com/QwenLM/qwen-code/pull/15211) — Carry a scheduled-task gate through the daemon and Web Shell.** Follow-up to #15069, wiring gate evaluation through to the Web Shell.

9. **[#15155](https://github.com/QwenLM/qwen-code/pull/15155) — Persist Todo across turns and expose in WebShell.** Stores Todo in the Hosted Session Store and injects the latest list into fresh model turns.

10. **[#15246](https://github.com/QwenLM/qwen-code/pull/15246) — Retain unchanged legacy catalog snapshots.** Keeps stable positions in conversation history for unchanged memory catalogs, relevant to the memory behavior reported in #15225.

## 5. Hot Discussions

No discussion data was provided in this dataset; this section is omitted.

## 6. Feature Request Trends

- **MCP modernization & tool-card fidelity**: First-class MCP 2026-07-28 core spec + MCP Apps support (#8968), and Web Shell rendering full tool arguments/results for MCP cards (#15280).
- **Runtime MCP lifecycle**: Manage (add/remove/enable/disable/restart/reload) MCP servers at runtime without recreating a Managed Session (#15079).
- **Pluggable Runtime provisioning**: HTTP-backed external Runtime provisioner for Session workers via `runtime-broker.provisioner=external` (#15247).
- **Configurable worktree base directory**: `worktree.baseDir` to move general-purpose worktrees out of the hardcoded `<repoRoot>/.qwen/worktrees/<slug>` path (#15292).
- **Memory hygiene**: Bounds/scan contracts and diagnostic advice for the memory subsystem (#15277).

## 7. Developer Pain Points

- **CI reliability and false positives**: The largest cluster of issues is `qwen-code-dev-bot`-filed main-CI failures against the Managed Agent gate and SDK Java lanes (#15287, #15288, #15285, #15282, #15281, #15268, #15253, #15208, #14784). Root causes include flaky runtime-broker timing on hosted runners (#15248), a failed queued extraction surfacing as an unhandled rejection failing Core CI (#15269), and reports filed for post-merge reruns (#15250). Partial/duplicated reporting is itself tracked (#15138, #15174).
- **Test isolation causing real damage**: `--no-isolate` runs overwriting the real `~/.qwen/settings.json` (#15267) is a high-severity trust issue for contributors.
- **Flaky timing budgets on slow/hosted runners**: Multiple E2E/harness tests failing due to hardcoded timeouts (docker startup budget #15237, hosted approval waits #15183, harness port race #15224).
- **Windows install/update ergonomics**: The node.exe file-lock installer failure (#15276) blocks updates entirely for Desktop users.
- **Provider-routing inconsistencies**: Silent downgrade of reasoning effort through reverse proxies (#15235) — hard to diagnose without telemetry.

---

*Note: Two data-quality caveats for readers — the `sdk-typescript-v0.1.22` release notes contain duplicated "Bundled CLI Version" sections (0.26.0 and 0.25.3), and the Pull Requests section reports `Comments: undefined` throughout, so PR commentary volume could not be assessed.*

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*