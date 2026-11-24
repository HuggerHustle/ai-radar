# AI CLI Tools Community Digest 2026-11-24

> Generated: 2026-11-24 05:16 UTC | Tools covered: 7

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
**Data snapshot: 2026-11-24 (24-hour window)**

---

## 1. Ecosystem Overview

The AI CLI developer tool market is now clearly stratified: Anthropic's Claude Code and OpenAI's Codex are duking it out at the high end of enterprise adoption, Gemini CLI has settled into a steady release cadence under Google's umbrella, and a long tail of smaller entrants (OpenCode, Pi, Qwen Code) is fighting for differentiation through extensibility and openness. Across all seven tools, **reliability concerns have displaced feature gaps as the dominant community complaint** — runaway agents, quota opacity, session lifecycle bugs, and MCP integration friction show up in every single tracker. Release cadence remains aggressive (four of seven tools shipped within 24 hours), but the substantive PR activity in most repos is now maintenance and hardening rather than net-new capability. The clearest structural signal is the emergence of **agent lifecycle management** — pause/resume, parking, cancellation cleanup — as a first-class engineering problem that nobody has fully solved yet.

---

## 2. Activity Comparison

| Tool | Issues (24h) | PRs (24h) | Discussions | Release Status |
|---|---|---|---|---|
| **Claude Code** | ~12 updated (2 data-loss, 2 quota) | 2 (both closed, no merges) | N/A (not in dataset) | v2.1.331 stable — Code Mode on 4 enterprise clouds |
| **OpenAI Codex** | ~13 updated (meta-tracker at 101 comments) | ~13 merged (bot-batched, mostly plugin signing) | ~12 active (Ideas/Q&A/Show&tell) | rust-v0.172.0 stable + 3 alphas |
| **Gemini CLI** | ~10 updated (subagent cluster) | ~10 (2 merged, 8 open/bumped) | N/A (not in dataset) | v0.71.0 + v0.71.1 stable; v0.72.0-preview.0 |
| **Copilot CLI** | ~13 updated (MCP-heavy) | 1 (closed) | N/A (not in dataset) | v1.0.115-8 stable |
| **OpenCode** | ~10 updated (desktop v2 regressions) | ~10 (all open, active) | N/A (not in dataset) | v2.4.1 + v2.4.0 stable |
| **Pi** | ~50 updated | ~27 updated (many merged same-day) | 1 active (Show&tell) | No release in window |
| **Qwen Code** | ~10 updated (security issue) | ~10 (2 merged, kernel migration) | N/A (not in dataset) | No release in window |

**Notes:** "N/A" for Discussions reflects documentation that the repo's community channel is Issues/PRs only or that no discussion data was surfaced in the source snapshot — it does not indicate inactivity. Codex is the only tool with a mature parallel Discussions surface (Ideas, Q&A, Show & Tell all active). Pi's raw issue/PR counts are inflated by a large `petrroll` fix batch; the substantive signal is lower but still the highest throughput per-capita in the set.

---

## 3. Shared Feature Directions

Four cross-cutting requirements recur across three or more communities:

**A. Session lifecycle & context continuity**
- Claude Code: pause/hibernate/resume (#111870), cross-surface context (#30675), session-ID confusion (#87984)
- Codex: pinned notes/summaries (#63244), multi-profile Desktop (#63399), session cont
inuity requests
- Gemini CLI: persistent file-based task tracking (#18836, #21000) to survive context rot
- Copilot CLI: session-history-as-memory (#2048), stale-lock recovery (#4805)
- OpenCode: session-scoped terminals (#43758), session picker context size (#61070)
- **Shared need:** sessions must survive across turns, restarts, tools, and products without losing state or identity.

**B. Agent/subagent observability and control**
- Gemini CLI: this is the *dominant* theme — false success reporting (#22323), hangs (#21409), ignored config (#22267), no subagent trajectories in shares (#22598)
- Claude Code: orphaned sub-agents (#74133), unreaped daemon workers (#87891)
- Qwen Code: per-turn immutable resource versions (#18178), managed-agent lifecycle races
- Copilot CLI: subagent usage grouping (shipped in v1.0.115-8)
- **Shared need:** subagents are opaque when they misbehave; users want trajectory visibility, termination correctness, and resource accounting.

**C. Resource/quota transparency and predictability**
- Claude Code: "Other" usage draining Ultra quotas (#111685, #111837)
- Codex: 101-comment meta-tracker on abnormal quota depletion (#41220), 5x drain report (#63138), quota monitor third-party tools
- Pi: unbounded compaction growth (#12242), premature compaction with virtual models (#12035)
- OpenCode: free-tier stuck limit (#65928), TTFT tracing (#57849, #65966)
- **Shared need:** users want itemized, auditable, predictable attribution of both billing quota and context-window consumption. This is the single largest *trust* theme in the set.

**D. MCP reliability and auth**
- Copilot CLI: the dominant failure surface — Tasks protocol (#5540, #5555), OAuth refresh (#4203), Windows locks (#5255), `gh`-on-PATH shadowing (#5550)
- Codex: no auto-reconnect (#11489), Code Mode host lifetime (#63537, #63540)
- Qwen Code: elicitation capability missing (#17316)
- Pi: SSE O(n²) buffering (#12224/Discussed in #12224)
- **Shared need:** MCP is now load-bearing infrastructure; every community is reporting the same class of defects (auth refresh, reconnect, protocol-completeness, platform-specific locking).

**E. Safer default permissions**
- Claude Code: two same-day data-loss reports of deletions outside repo (#106818, #111921)
- Codex: silent privilege downgrades (#58677, #62975, #63270) — UI says "Full access," runtime enforces less
- Copilot CLI: worktrees should be opt-in (#2243, top-upvoted), permission requests hang in prompt mode (#5381)
- Gemini CLI: destructive git command guardrails (#22672)
- **Shared need:** the declared security posture must match the enforced one, and destructive operations must be auditable/opt-in.

---

## 4. Differentiation Analysis

**Target users**

| Tool | Primary User | Positioning |
|---|---|---|
| **Claude Code** | Enterprise dev teams, self-hosted gateway admins | Deepest enterprise deployment surface (Bedrock, Google Agent Platform, Foundry, AWS-hosted); OIDC/RBAC |
| **Codex** | Pro/Plus individual subscribers + macOS/Windows Desktop users | Desktop-first UX, plugin ecosystem, ChatGPT account integration |
| **Gemini CLI** | Google Cloud ecosystem developers | Widest release cadence; heavy investment in subagent architecture |
| **Copilot CLI** | GitHub-centric teams, CI/scripting users | Tight GitHub integration, enterprise policy asks (#4446) |
| **OpenCode** | Desktop-first polyglot developers | Explicit "IDE parity" ambition (project tree, worktree manager, git history) |
| **Pi** | Power users, multi-provider tinkerers | Broadest provider catalog (DeepInfra, Nebius, Ollama Cloud, StepFun incoming); obsessive streaming/latency work |
| **Qwen Code** | Managed-agent / hosted deployment teams | Most architecturally ambitious — event-driven kernel, Web Shell, per-turn snapshots |

**Technical approach differences**

- **Claude Code** is the most *platform*-oriented: Code Mode across four enterprise clouds plus OIDC group mapping shows a focus on fitting into existing cloud identity and deployment infrastructure rather than shipping radically new UX.
- **Codex** is investing hardest in *supply-chain security* this cycle — the six-PR plugin archive signing/verification stack (signature verification, key caching, eval-vs-release key separation) landed in a single day. That is enterprise-grade hardening not matched by any competitor today.
- **Gemini CLI** is the most *architecture-forward* on subagents but ironically the most brittle in practice; the mismatch between ambition and reliability is the core tension.
- **Copilot CLI** is the most *conservative* — minimal PR activity, small focused releases (telemetry grouping, permission failover). It behaves like a tool in maintenance mode relative to the others.
- **OpenCode** is racing toward *IDE parity* on desktop, with a built-in browser that can be agent-operated (#65946) as a genuine differentiator.
- **Pi** is the *streaming-and-resilience* specialist — linear-time SSE parsing, retry-classifier fixes, catalog hygiene. It behaves like infrastructure for people who care about wire-level correctness.
- **Qwen Code** is the only one running a *kernel migration* in public (event-driven loop landing on `main`), with managed-agent parking and per-turn immutable snapshots — the most research-flavored roadmap.

---

## 5. Community Momentum & Maturity

**Momentum ranking (qualitative, from engagement density and velocity)**

1. **Codex** — Highest raw engagement: a 101-comment meta-tracker, an unusually dense same-day PR landing (plugin signing stack), and the only mature Discussions surface (12+ active threads including a small but healthy third-party tool ecosystem: TernaryCode, Memlayer, ReLimit Monitor, Qorx Void). Release velocity is high (v0.172 stable + three alphas in 24h).
2. **Pi** — Highest issue/PR throughput in the window (~50 issues, ~27 PRs, many merged same-day by a single prolific contributor). Release cadence paused, suggesting a hardening sprint. Community is smaller but unusually technical.
3. **Gemini CLI** — Fast release cadence (v0.71.0 → v0.71.1 → v0.72.0-preview.0 → nightly in one day) and a P1 subagent-reliability cluster with 8+ 👍 engagement. A2A bearer-token auth fix is a meaningful security landing.
4. **Claude Code** — Engagement concentrated in a few high-comment issues (language drift at 25 comments/42 👍) but PR activity near-zero (2 closed, no merges). Release work is cadenced and enterprise-focused; the tracker's dominant signal is *pain*, not *progress*. Two same-day data-loss reports will likely escalate.
5. **OpenCode** — Very active PR queue (~10 open, actively authored) and a visible v2 desktop migration story (browser shipped, IDE-parity requests flooding in). The background-service lifecycle cluster (#54267/#58141/#62145 + #65915) is a coordinated fix arc worth watching.
6. **Copilot CLI** — Lowest visible velocity in the window: one small release, one closed PR, issue tracker dominated by unresolved MCP friction. The top-upvoted issue (#2243, worktrees) being open and not addressed is a maturity signal lagging the others.
7. **Qwen Code** — Steady but narrower: kernel migration progressing (#18213 merged), managed-agent lifecycle hardening (#18212, #18224), but a freshly filed security issue (#18165, plaintext API keys on disk) warrants fast triage.

**Maturity signal summary:** Codex and Claude Code are the most mature in enterprise hardening (signing, auth, deployment surfaces); Gemini CLI and Qwen Code are the most architecturally ambitious; Pi is the most operationally disciplined per-line-of-code; Copilot CLI and OpenCode are mid-transition (sessions/lifecycle and desktop parity respectively).

---

## 6. Trend Signals

**T1 — "Trust engineering" is the new feature category.**
Quota accounting, silent permission downgrades, data-loss from autonomous operations, and plaintext credential persistence are the four recurring trust failures across the set. For decision-makers: **the winning tools in 2027 will be differentiated on auditability and failure-mode transparency, not on model access.** A public, itemized quota-explanation endpoint and a "dry-run / what-would-I-touch" mode for agent file operations are the two highest-leverage trust features available.

**T2 — Agent lifecycle is unsolved infrastructure.**
Every community independently converges on the same missing primitives: pause/hibernate/resume (Claude Code), parking child sessions (Qwen Code), idle host reaping (Codex), stale-lock recovery (Copilot CLI), background-service singleton fixes (OpenCode). This is the same problem wearing seven different vocabularies. **Expect an industry-standard lifecycle API (park/resume/cancel-with-cleanup) to emerge as a de facto contract within 2–3 quarters**; tools that expose it natively will absorb demand.

**T3 — MCP is the reliability bottleneck of the extensible-CLI era.**
Auth refresh, reconnect, protocol-completeness (elicitation, Tasks), and cross-platform locking failures appear in nearly every tracker. The protocol is load-bearing before it is mature. For platform teams: **budget for MCP-specific QA and diagnostics investment** (error messages that name the server/tool, not just an index) — this is where user trust currently leaks.

**T4 — Subagents are the new "black box."**
Gemini CLI's false-success reporting, Claude Code's orphaned workers, and Qwen Code's lifecycle races all point to the same observability gap. The Gemini CLI `codebase_investigator` reporting `status: "success"` while having done nothing is the sharpest illustration: **unauditable subagent claims are a correctness problem, not just a UX one.**

**T5 — Desktop is re-emerging as a first-class surface.**
Codex's macOS/Windows Desktop regression cluster, OpenCode's IDE-parity surge, and Claude Code's Cowork/MSIX issues all show desktop shells absorbing disproportionate bug volume. The desktop update channel (silent MSIX, Nov-21 Codex regressions) is now a *trust-critical* distribution path in a way CLI updates never were.

**T6 — Compaction and context economics are quietly becoming a cost center.**
Pi's 17k→164k-char summary blowup (#12242), Claude Code's session-resume ambiguity, Qwen Code's double-counted tool results (#15486), and Gemini CLI's ~36.6k tokens/turn baseline all point the same direction: **long-session context management is now a primary driver of both cost and reliability**, and native index-aware context (Qorx Void, Memlayer) is springing up as an external workaround — a signal of unmet native demand.

**T7 — Supply-chain and provenance hardening is arriving.**
Codex's plugin archive signing/verification stack (six PRs in one day) and Gemini CLI's full extension-content consent on install/update (#30441) are the first mature implementations of signed-extension supply chains in this category. For teams deploying third-party extensions, **signature verification and consent-on-change are becoming table stakes**, not differentiators.

---

### Bottom line for technical decision-makers

- **Choose by trust posture, not feature list.** The capability gaps between these tools are narrow; the reliability and auditability gaps are wide. Codex and Claude Code lead on enterprise hardening; Pi and Qwen Code lead on wire-level and lifecycle experimentation; Gemini CLI and OpenCode are iterating fastest but with the most visible reliability debt; Copilot CLI is the quietest and currently the least responsive on its own top community signal.
- **Budget for lifecycle and MCP QA explicitly** in any adoption plan — both are load-bearing, both are unsolved, and both are where user trust currently leaks.
- **Watch the quota-transparency thread across Codex and Claude Code** — the two highest-volume trust complaints in the set. A vendor that ships audit-grade quota attribution first will differentiate materially on the metric that paying users care most about.

---

## Per-Tool Reports

<details>
<summary><strong>Claude Code</strong> — <a href="https://github.com/anthropics/claude-code">anthropics/claude-code</a></summary>

## Claude Code Skills Highlights

> Source: [anthropics/skills](https://github.com/anthropics/skills)

# Claude Code Skills — Community Highlights Report
*Data snapshot: 2026-11-24 | Source: github.com/anthropics/skills*

---

## 1. Top Skills Ranking
*Note: The provided PR dataset does not expose comment counts, so ranking below is based on update recency, engagement signals (revisions, cross-references, maintainer attention), and ecosystem centrality.*

| # | Skill / PR | Functionality | Discussion Highlights | Status |
|---|-----------|---------------|----------------------|--------|
| 1 | **[mcp-builder #1742](https://github.com/anthropics/skills/pull/1742)** | Fixes MCP v2 `streamable_http_client` rename and custom header handling | Addresses breaking change in `mcp>=2.0.0`; high-impact since mcp-builder is core infra | OPEN |
| 2 | **[skill-creator #1298](https://github.com/anthropics/skills/pull/1298)** | Isolates trigger evals; fixes Windows subprocess `select()` and runtime failures | Directly ties to eval reliability issues #556, #1352 — most contested subsystem | OPEN |
| 3 | **[webapp-testing #1980](https://github.com/anthropics/skills/pull/1980)** | Removes `shell=True` in `with_server.py` (CWE-78 command injection) | Security-hardening of a widely-used testing skill | OPEN |
| 4 | **[docx #1792](https://github.com/anthropics/skills/pull/1792)** | Reports LibreOffice timeout as error; verifies revision marks cleared | Improves reliability of document pipeline; part of docx fix cluster | OPEN |
| 5 | **[xlsx #2019](https://github.com/anthropics/skills/pull/2019)** | Resolves worksheet-scoped defined names in `external_links_at_risk` | Fixes false negatives in external-link risk detection (fixes #2013) | OPEN |
| 6 | **[pyxel #525](https://github.com/anthropics/skills/pull/525)** | Retro game dev in Python (headless input-driven runs, frame inspection) | Long-running (since Mar 2026), niche but steady interest | OPEN |
| 7 | **[algorithmic-art #1977](https://github.com/anthropics/skills/pull/1977)** | Fixes `wrapAround()` to properly wrap to `[0, max)` | Clean, well-scoped bugfix; fixes #1897 | OPEN |
| 8 | **[skill-creator #1997](https://github.com/anthropics/skills/pull/1997)** | Correct YAML frontmatter scalar parsing in `parse_skill_md` | Metadata fidelity issue affecting eval/optimization commands | OPEN |

---

## 2. Community Demand Trends
Distilled from the top community Issues:

- **Trust & Security Boundaries** — [#492](https://github.com/anthropics/skills/issues/492) (46 comments, most-discussed issue): community skills distributed under the `anthropic/` namespace create impersonation risk. Strong demand for **verified/official namespace separation**.
- **Skill Evaluation Reliability** — [#556](https://github.com/anthropics/skills/issues/556) (0% trigger rate), [#1352](https://github.com/anthropics/skills/issues/1352) (parallel workers cross-match UUIDs), [#1487](https://github.com/anthropics/skills/issues/1487) (156k token eager injection). The single largest cluster of technical complaints.
- **Org-Wide Sharing & Distribution** — [#228](https://github.com/anthropics/skills/issues/228) (17 comments, 8 👍): users want a shared skill library instead of manual `.skill` file Slack transfers. Related: [#189](https://github.com/anthropics/skills/issues/189) on duplicate plugins.
- **Context/Token Efficiency** — [#202](https://github.com/anthropics/skills/issues/202) (skill-creator reads like docs, not operational instructions) and [#1487](https://github.com/anthropics/skills/issues/1487) reflect demand for leaner skill payloads.
- **Governance & Quality Gates** — [#1385](https://github.com/anthropics/skills/issues/1385) proposes calibration → adversarial review → delivery verification; [#412](https://github.com/anthropics/skills/issues/412) proposes agent-governance patterns.
- **Account/Workspace Continuity** — [#1143](https://github.com/anthropics/skills/issues/1143) (20 👍, highest-upvoted): email change capability to prevent workspace data loss.

**Emerging new Skill directions requested:** memory/state compaction ([#1329](https://github.com/anthropics/skills/issues/1329)), agent governance ([#412](https://github.com/anthropics/skills/issues/412)), reasoning quality pipelines ([#1385](https://github.com/anthropics/skills/issues/1385)).

---

## 3. High-Potential Pending Skills
Active PRs with recent updates suggesting near-term merge:

- **[notion-spec-to-implementation + quantitative-resume-auditor #1245](https://github.com/anthropics/skills/pull/1245)** — Transforms specs into Notion tasks; updated 2026-10-15. Two skills bundled.
- **[md2video-audio #1703](https://github.com/anthropics/skills/pull/1703)** — Zero-cost Markdown→MP4 with voiceovers via Marp. Novel media pipeline.
- **[proofcore-contract-auditor #1771](https://github.com/anthropics/skills/pull/1771)** — Solidity/Rust static analysis anchored on TON blockchain. First Web3-audit skill.
- **[document-typography #514](https://github.com/anthropics/skills/pull/514)** — Fixes orphan wrap, widows, numbering misalignment. Broad applicability.
- **[scnet-hpc #1615](https://github.com/anthropics/skills/pull/1615)** — Slurm/SSH HPC cluster ops. Fills scientific-computing gap.
- **[docx orphaned-comment detection #1734](https://github.com/anthropics/skills/pull/1734)** — Complements the docx fix cluster (#1792, #2018).
- **[skill-creator direct execution fix #1681](https://github.com/anthropics/skills/pull/1681)** — Updated 2026-11-19 (most recent); resolves `ModuleNotFoundError` for standalone runs.

---

## 4. Skills Ecosystem Insight
**The community's most concentrated demand is reliability, security, and trust in the Skill infrastructure itself — evaluation accuracy, namespace authenticity, and safe execution — rather than a demand for entirely new capabilities.**

---

# Claude Code Community Digest — 2026-11-24

## 1. Today's Highlights

A relatively quiet release day: **v2.1.331** ships Code Mode support across four major enterprise clouds (Bedrock, Google Agent Platform, Microsoft Foundry, AWS-hosted Claude Platform) plus OIDC group-mapping via `oidc.groups_jsonpath`. Meanwhile, the issue tracker is dominated by **agent lifecycle and data-safety problems** — runaway background workers, orphaned sub-agents, and two separate reports of Claude Code deleting user files outside the repo (#106818, #111921). Quota/billing disputes also surge, with two fresh Ultra-plan reports (#111685, #111837) claiming phantom "Other" usage draining weekly limits.

## 2. Releases

**v2.1.331**
- **Code Mode in terminal sessions** now available on Amazon Bedrock, Google Cloud's Agent Platform, Microsoft Foundry, and Claude Platform on AWS — a notable expansion of enterprise deployment surfaces.
- **`oidc.groups_jsonpath`** added to the Claude apps gateway, enabling group extraction from matching entries in a list of objects (useful for fine-grained RBAC in self-hosted gateways).

## 3. Hot Issues

1. **[#96326](https://github.com/anthropics/claude-code/issues/96326)** — *Language drift despite CLAUDE.md rules* (25 comments, 👍42). The most-discussed issue of the day: Opus 5.5 drifts into English after reading English tool output even with an explicit Japanese-only rule. Corrections don't hold. High engagement suggests instruction-persistence under long agentic sessions remains a top user concern.
2. **[#30675](https://github.com/anthropics/claude-code/issues/30675)** — *Shared context across Claude Code / Claude.ai / Cowork* (17 comments, 👍26). A long-running enhancement request for cross-product context continuity. Persistent demand for breaking down product silos.
3. **[#94393](https://github.com/anthropics/claude-code/issues/94393)** — *Monitor tool ignores persistent flag; timeout schema caps at 1h but actual lifetime ~30 min* (14 comments, 👍32). Schema-vs-runtime mismatch breaks long-running monitoring workflows.
4. **[#87633](https://github.com/anthropics/claude-code/issues/87633)** — *Windows MSIX update breaks filesystem MCP in Cowork* (8 comments). A silent auto-update rejected draft-07 `outputSchema`, leaving no server version passing both checks — a regression tied to unattended updates.
5. **[#87984](https://github.com/anthropics/claude-code/issues/87984)** — *Backgrounding a conversation spawns a new session id; `--resume` shows stalled duplicate* (8 comments, 👍3, reproduced). Session identity confusion with real UX impact.
6. **[#87891](https://github.com/anthropics/claude-code/issues/87891)** — *Daemon never reaps stale workers: 64 leaked processes / ~7.1 GB after six weeks* (7 comments, 👍6). Concrete memory-leak forensics; a recurring theme in background-agent reports.
7. **[#86001](https://github.com/anthropics/claude-code/issues/86001)** — *Interrupted tool mislabeled `user-rejected` instead of `interrupted`* (7 comments, reproduced). The model is told the tool never ran even though a dedicated enum value exists — a correctness bug in tool-result semantics.
8. **[#98823](https://github.com/anthropics/claude-code/issues/98823)** — *Cloud sessions block `github:` archive tarballs even with Full network access* (4 comments, 👍4). Breaks Nix flakes; highlights friction in cloud-session network policy granularity.
9. **[#106818](https://github.com/anthropics/claude-code/issues/106818)** — *Windows: Claude Code permanently deleted user's entire data folder during cleanup* (2 comments, data-loss). Paired with #111921, this signals a serious trust issue around autonomous file operations.
10. **[#111921](https://github.com/anthropics/claude-code/issues/111921)** — *Autonomous task deleted user files outside the repo* (2 comments, data-loss, same-day). Fresh report of an agent running every repo test locally without auditing, then deleting external files. Two data-loss reports in one cycle will likely escalate.

*Also notable:* **[#111685](https://github.com/anthropics/claude-code/issues/111685)** and **[#111837](https://github.com/anthropics/claude-code/issues/111837)** — Ultra-plan quota depletion disputes (100% Fable / 84% "Other" usage), pointing at billing transparency gaps.

## 4. Key PR Progress

Only two PRs updated in the last 24h, both **closed** — no active merge activity to highlight:

1. **[#45553](https://github.com/anthropics/claude-code/pull/45553)** — *resolve duplicate IPs* (CLOSED). No description provided; appears to be a maintenance/housekeeping change.
2. **[#11713](https://github.com/anthropics/claude-code/pull/11713)** — *feat: Add developer-utilities plugin* (CLOSED). Proposed 5 community-requested commands; session-management commands were dropped as they became native. Closed without merge — likely superseded by first-party functionality.

## 5. Hot Discussions

No discussion data was provided for this cycle; section omitted.

## 6. Feature Request Trends

Distilled from active Issues:

- **Cross-surface context sharing** (#30675): unify Claude Code, Claude.ai, Cowork, and mobile into one continuous context.
- **Session lifecycle controls** (#111870): native Pause / Hibernate / Resume for single and parallel sessions in VS Code and CLI — a direct response to resource cost of long-running agents.
- **Predictable resource bounds** (#94393): tool timeouts and persistence flags should match documented schema and actual runtime behavior.
- **Cloud-session network granularity** (#98823): per-resource network allowlisting rather than binary "Full access."
- **Billing/usage transparency** (#111685, #111837): itemized, auditable quota attribution, especially on Ultra plans.

## 7. Developer Pain Points

Recurring frustrations across the tracker:

1. **Runaway background agents and leaks** — orphaned sub-agents (#74133), unreaped daemon workers (#87891), headless-mode task kills (#85129), and worktree deletion on failed self-update (#75609). This cluster is the single largest source of bug reports.
2. **Data loss from autonomous operations** — two same-cycle reports (#106818, #111921) of files deleted outside the intended scope. Permission-mode behavior (`auto` vs `bypassPermissions`) is repeatedly implicated (#92383).
3. **Session identity and resume confusion** — backgrounding forks new session IDs (#87984), resume shows stalled duplicates, and cross-session `send_message` silently drops messages (#92383, #111903).
4. **Instruction persistence failures** — language rules (#96326) and settings like `--effort` (#73742) not holding across long sessions or daemon forks.
5. **Silent auto-update regressions** — MSIX updates breaking MCP (#87633) and self-update failures destroying worktrees (#75609) erode trust in unattended upgrades.
6. **Billing opacity** — unexplained "Other" usage and misattributed quota consumption on premium plans (#111685, #111837, #111897).
7. **Secret leakage into chat** (#105608) — the model surfacing keys/credentials read from files remains an unresolved security concern.

---
*Generated from github.com/anthropics/claude-code data for 2026-11-24. Comment counts and reactions reflect the trailing 24h window.*

</details>

<details>
<summary><strong>OpenAI Codex</strong> — <a href="https://github.com/openai/codex">openai/codex</a></summary>

# OpenAI Codex Community Digest — 2026-11-24

## 1. Today's Highlights

Release activity continues on the `rust-v0.172.0` line, headlined by terminal UX improvements: thread-link navigation from search results and `Tab` argument completion for slash commands. Meanwhile, community attention is dominated by two cross-cutting regressions — a large meta-tracker on abnormal quota depletion (#41220, 101 comments and growing) and a cluster of November desktop-app regressions where permission/execution-location selectors vanish after the first message. The PR queue shows an unusually dense burst of Plugin Service archive-signing/verification work landing in a single day.

## 2. Releases

**rust-v0.172.0** (stable)
- Follow thread links from search results and transcripts to reopen saved conversations and nested agents in the terminal (#62332)
- Press `Tab` to complete arguments for supported slash commands (e.g. `/mcp lo` → `/mcp login`) (#62343)
- Jump between task groups in the transcript navigator

**Alpha/nightly builds:**
- `rust-v0.174.0-alpha.1`
- `rust-v0.172.0-alpha.2.1`
- `rust-v0.171.0-alpha.13.2`

Note: the alphas carry no changelog detail beyond version bumps. The 0.172 stable changelog appears truncated in the source data (third bullet ends mid-sentence).

## 3. Hot Issues

1. **[#41220](https://github.com/openai/codex/issues/41220) — [Meta] Abnormal quota depletion tracker (101 comments, 👍22)** — The single largest open thread. Aggregates a symptom family: subscription quota/credits depleting materially faster than token evidence predicts, sometimes abruptly mid-session. High comment velocity suggests this remains unsolved and is the community's top trust concern.

2. **[#58677](https://github.com/openai/codex/issues/58677) — macOS Desktop: Full access control disappears after chat creation (31 comments, 👍7)** — Composer shows "Full access," but the permissions control is absent once the conversation begins, leaving the session restricted. Silent privilege downgrade is a serious UX/usability failure.

3. **[#62975](https://github.com/openai/codex/issues/62975) — Windows: Permissions selector disappears; Work forces Cloud/TPP with no Local option (22 comments, 👍8)** — The Windows counterpart to #58677, plus a mode-selection regression. Two-platform recurrence points to a systemic composer-state bug.

4. **[#62943](https://github.com/openai/codex/issues/62943) — Nov 21 update regression: selectors + Max reasoning effort disappear (20 comments, 👍12)** — Pinned to a specific update date, with the highest 👍 count among the desktop-regression cluster. Strong signal of a regression window developers can bisect.

5. **[#46182](https://github.com/openai/codex/issues/46182) — Archived cloud tasks have no Delete action (16 comments, 👍15)** — The most-upvoted issue in this digest. Archived Codex cloud tasks offer only "Unarchive"; users want permanent deletion. Pure data-hygiene request with no workaround.

6. **[#11489](https://github.com/openai/codex/issues/11489) — MCP client does not auto-reconnect after disconnect (7 comments, 👍10)** — MCP servers stay dead until manual reload/restart, despite SSE streams already having retry/backoff logic. Long-standing (since Feb) and increasingly costly as MCP usage grows.

7. **[#28833](https://github.com/openai/codex/issues/28833) — PermissionRequest hooks need a user-facing approval signal (4 comments, 👍13)** — Second-highest upvote ratio. Integrators want passive notifications when a hook corresponds to an approval, essential for building non-intrusive tooling on top of the approval flow.

8. **[#63270](https://github.com/openai/codex/issues/63270) — macOS: ChatGPT Work ignores Full access, always runs workspace-only Seatbelt (6 comments)** — Directly contradicts the UI: write permissions are silently clamped to workspace roots and tmpdir. Security-adjacent, hard to debug.

9. **[#63138](https://github.com/openai/codex/issues/63138) — GPT-6.2 Astra quota draining ~5x faster since Nov 22 (3 comments)** — A dated, model-specific depletion report. Small but concrete; likely a useful data point for the #41220 tracker.

10. **[#60347](https://github.com/openai/codex/issues/60347) — Android ↔ macOS remote pairing fails after passkey auth (4 comments)** — Auth succeeds, pairing still fails. Rules out the most obvious fix and suggests a handshake-state bug.

*Also notable:* [#14099](https://github.com/openai/codex/issues/14099) slow paste on Windows CLI (open since March), [#57010](https://github.com/openai/codex/issues/57010) macOS desktop ignoring all input while background tasks continue, [#47707](https://github.com/openai/codex/issues/47707) runaway repeated responses after context compaction.

## 4. Key PR Progress

Almost all merged activity today comes from `copyberry[bot]`, indicating a large automated/batched landing. Grouped by theme:

**Plugin Service archive signing (new security layer)**
1. **[#63484](https://github.com/openai/codex/pull/63484)** — Scaffolds the `codex-plugin-archive-verification` crate in the Cargo workspace.
2. **[#63487](https://github.com/openai/codex/pull/63487)** — Adds signature verification for Plugin Service archives; a SHA-256 digest alone can't detect an attacker who replaces both archive and digest.
3. **[#63489](https://github.com/openai/codex/pull/63489)** — Verifies signed remote plugin archives *before* extraction.
4. **[#63490](https://github.com/openai/codex/pull/63490)** — Caches Plugin Service signing keys per manager/endpoint/credential.
5. **[#63491](https://github.com/openai/codex/pull/63491)** — Coalesces concurrent signing-key fetches to avoid stampedes on refresh failure.
6. **[#63528](https://github.com/openai/codex/pull/63528)** — Bug fix: the verifier now actually *uses* keys returned in `eval_keys` (it previously counted but ignored them) and separates eval vs. release signing keys.

**Code Mode & model catalog**
7. **[#63540](https://github.com/openai/codex/pull/63540)** — Deduplicates MCP text fallbacks in Code Mode output via `code_mode_mcp_result_dedup`.
8. **[#63537](https://github.com/openai/codex/pull/63537)** — Reaps idle local code-mode hosts after a 5-second grace period.
9. **[#63533](https://github.com/openai/codex/pull/63533)** — Refreshes the model catalog from Responses WebSocket handshake `x-models-etag`, fixing staleness when the server only advertises new models over WS.

**Approvals, MCP auth, and TUI robustness**
10. **[#63514](https://github.com/openai/codex/pull/63514)** / **[#63513](https://github.com/openai/codex/pull/63513)** — Prewarms the Guardian v3 root reviewer and instructs it to read user instructions before issuing a first verdict.
11. **[#63515](https://github.com/openai/codex/pull/63515)** — `codex exec` now honors configured and saved approval policies instead of forcing `never`.
12. **[#63532](https://github.com/openai/codex/pull/63532)** — Extensions can supply per-request MCP authentication (credential refresh without restarting the MCP session).
13. **[#63523](https://github.com/openai/codex/pull/63523)** / **[#63520](https://github.com/openai/codex/pull/63520)** / **[#63516](https://github.com/openai/codex/pull/63516)** — Preserves accepted prompts on interrupted turn setup, waits for foreground terminal ownership before TUI resume, and stops TUI recovery diagnostics from panicking on unwritable stderr.

## 5. Hot Discussions

**Ideas**
- **[#63244](https://github.com/openai/codex/discussions/63244)** — Pinned notes and conversation-level summaries for long-running sessions (👍1).
- **[#63399](https://github.com/openai/codex/discussions/63399)** — Multiple isolated account profiles in Codex Desktop (Personal vs. Work) without sign-out churn; author explicitly flags isolation, not convenience, as the core concern (👍1).

**Q&A**
- **[#62960](https://github.com/openai/codex/discussions/62960)** — Can a pending command still start after a Code Mode `functions.wait` returns "still running"? (👍1). Precise executor-semantics question with no clear answer yet.

**Show and tell**
- **[#62426](https://github.com/openai/codex/discussions/62426)** — **TernaryCode**: native Rust app showing which Codex (or Claude Code) session is waiting for you across projects.
- **[#63534](https://github.com/openai/codex/discussions/63534)** — **Memlayer 0.3.0 beta**: human-approved local memory over MCP for carrying user preferences across sessions.
- **[#63530](https://github.com/openai/codex/discussions/63530)** — **ReLimit Monitor (Mac)**: side-by-side 5-hour/weekly quota and reset times across accounts.
- **[#63322](https://github.com/openai/codex/discussions/63322)** — **Qorx Void**: local code index so Codex can ask for "path + line" instead of re-reading files.
- **[#63430](https://github.com/openai/codex/discussions/63430)** — An MCP tool letting Codex control a real iPhone over USB from Windows.
- **[#63536](https://github.com/openai/codex/discussions/63536)** — **indiebiz-evidence**: SQLite + MCP for cross-checking where scraped numbers came from.
- **[#63395](https://github.com/openai/codex/discussions/63395)** — Native profile builder for trialing a Responses API without replacing `config.toml`.
- **[#63481](https://github.com/openai/codex/discussions/63481)** — RIL policy language: detecting when a Codex-generated PR *removes* a policy rule.
- **[#63268](https://github.com/openai/codex/discussions/63268)** — **Crateweave**: a Codex skill for curating Spotify tracks by version/performance.
- **[#17038](https://github.com/openai/codex/discussions/17038)** — Historical model deprecation notice (gpt-5.x-codex family); still receiving updates, suggesting ongoing migration questions.

## 6. Feature Request Trends

- **Destructive/lifecycle actions.** Permanent deletion for archived cloud tasks (#46182), Delete via app-server (cloud `thread/delete` currently returns `-32601`, [#50618](https://github.com/openai/codex/issues/50618)). The "archive-only" pattern is the most-requested gap.
- **Account & identity management.** Multiple isolated Desktop profiles (#63399), quota monitoring across accounts (#63530), and account-switching without re-auth.
- **Session continuity & memory.** Custom thread-title templates (#29677), pinned notes/summaries (#63244), and human-approved persistent memory (#63534). Users want long conversations to be navigable and self-carrying.
- **Local code indexing.** Qorx Void (#63322) and Memlayer (#63534) both attack the "Codex re-reads the same files" cost problem from the outside; expect pressure for native index-aware context.
- **Hook & automation contracts.** Approval-aware PermissionRequest hooks (#28833) and a documented all-tools-off ToolPolicy contract for app-server workers (#52780).
- **Deterministic exec semantics.** Explicit approval-policy behavior in `codex exec` and clear answers on Code Mode pending-command state (#62960).

## 7. Developer Pain Points

1. **Trust in quota accounting.** The #41220 meta-tracker plus fresh reports (#63138, [#63097](https://github.com/openai/codex/issues/63097), [#63522](https://github.com/openai/codex/issues/63522), "half a week of usage vanished") make this the dominant frustration. The recurring shape — *depletion far exceeding token evidence* — is exactly the kind of thing that erodes adoption among paying Pro/Plus users.

2. **Silent permission downgrades.** Across #58677, #62975, #62943, and #63270, the UI states one thing (Full access, Local) while the effective session enforces another (restricted, Cloud/TPP, Seatbelt workspace-only). The #62967 variant is the clearest: enabled network access is ignored and `CODEX_SANDBOX_NETWORK_DISABLED=1` is forced. Silent divergence between the declared and actual security posture is worse than a visible restriction.

3. **Desktop update regressions.** A cluster dated Nov 20–23: selectors vanishing (#62943, #62975), app crashing/reopening on Send (#62901), Bluetooth dictation failing after update (#62733), Work mode unable to send (#63003), `CODEX_CLI_PATH` errors after reinstall (#63315). The high frequency within a short window suggests insufficient pre-release regression coverage for the desktop shell.

4. **Stale MCP sessions.** No auto-reconnect (#11489) plus Code Mode duplication/host-lifetime issues (#63540, #63537) mean MCP reliability debt is compounding now that the ecosystem depends on it.

5. **Platform-specific long tail.** Windows CLI paste lag open since March (#14099), macOS input freeze (#57010), and old closed-but-referenced TUI stalls (#31401) persist. These are individually low-upvote but high-annoyance daily drivers.

**Bottom line for the community:** the 0.172 terminal UX work is genuinely useful, and the plugin-archive signing stack landing in one day is a meaningful security investment. But quota-accounting trust and desktop permission regressions are the two fires; a clear public explanation (or fix) on either would do more for sentiment right now than any feature release.

</details>

<details>
<summary><strong>Gemini CLI</strong> — <a href="https://github.com/google-gemini/gemini-cli">google-gemini/gemini-cli</a></summary>

# Gemini CLI Community Digest — 2026-11-24

## 1. Today's Highlights

A busy release day: **v0.71.0** and **v0.71.1** shipped to stable, with **v0.72.0-preview.0** and a nightly following close behind. The most significant security-adjacent change is a cherry-picked fix enforcing **bearer token authentication and request input validation** on the A2A server. Meanwhile, issue activity remains dominated by subagent reliability complaints — false-success termination reporting, indefinite hangs, and agent configuration not being respected.

## 2. Releases

- **[v0.71.0](https://github.com/google-gemini/gemini-cli/releases)** — Stable release rolling up the v0.70.0 changelog cycle.
- **[v0.71.1](https://github.com/google-gemini/gemini-cli/pull/30429)** — Patch release cherry-picking the A2A server auth/validation fix (PR #30420) onto the v0.71.0 branch.
- **[v0.72.0-preview.0](https://github.com/google-gemini/gemini-cli/releases)** — Preview cut including a fix for **nested `.gitignore` negations under `dir/**` patterns** (PR #30370) and expanded Windows home-directory handling in the CLI.
- **[v0.71.0-nightly.20261124.gaafdfdfb5](https://github.com/google-gemini/gemini-cli/releases)** — Nightly containing the A2A bearer-token authentication and request input validation work (PR #30420).

## 3. Hot Issues

1. **[#22323](https://github.com/google-gemini/gemini-cli/issues/22323) — Subagent recovery after MAX_TURNS reported as GOAL success** (14 comments, P1). The `codebase_investigator` subagent reports `status: "success"` / `Termination Reason: "GOAL"` even when it hit the turn limit before doing any work. This masks real failures from users and tooling — a correctness issue at the heart of agent trustworthiness.

2. **[#19873](https://github.com/google-gemini/gemini-cli/issues/19873) — Zero-dependency OS sandboxing & post-execution intent routing** (9 comments, P2). Proposes leaning into Gemini 3's native bash affinity by chaining POSIX tools under a sandbox, rather than fighting the model's preferred workflow. Ambitious but aligns with observed model behavior.

3. **[#21409](https://github.com/google-gemini/gemini-cli/issues/21409) — Generalist agent hangs** (8 comments, 8 👍, P1). The generalist subagent hangs indefinitely on trivial tasks like folder creation; users report waiting up to an hour. The workaround — instructing the model not to defer to subagents — is telling. Highest-engagement bug of the day.

4. **[#22745](https://github.com/google-gemini/gemini-cli/issues/22745) — AST-aware file reads, search, and mapping EPIC** (7 comments, P2). Tracks whether AST-aware tools can reduce wasted turns from misaligned reads and token noise. Part of a broader push toward more surgical codebase navigation.

5. **[#21968](https://github.com/google-gemini/gemini-cli/issues/21968) — Gemini underuses skills and subagents** (7 comments, P2). Anecdotal but widely felt: the model won't invoke custom skills like `gradle` or `git` unless explicitly told. Undermines the value of defining skills at all.

6. **[#22267](https://github.com/google-gemini/gemini-cli/issues/22267) — Browser Agent ignores `settings.json` overrides** (5 comments, P2). `AgentRegistry` reads merged settings at init, but overrides like `maxTurns` are silently ignored at runtime — a configuration-integrity bug.

7. **[#21983](https://github.com/google-gemini/gemini-cli/issues/21983) — Browser subagent fails on Wayland** (4 comments, P1). Linux users on Wayland hit browser subagent failures surfaced as misleading `Termination Reason: GOAL` output. Compounds the platform-support story for browser automation.

8. **[#24246](https://github.com/google-gemini/gemini-cli/issues/24246) — 400 error with >128 tools** (3 comments, P2). High tool counts trigger API errors; the expectation is smarter scoping of enabled tools per turn. A scaling concern as the extension/tool ecosystem grows.

9. **[#23571](https://github.com/google-gemini/gemini-cli/issues/23571) — Model creates tmp scripts in random spots** (3 comments, P2). When shell execution is the only path, the model scatters edit scripts across directories, creating cleanup overhead before commits. A workflow-hygiene pain point.

10. **[#22672](https://github.com/google-gemini/gemini-cli/issues/22672) — Agent should stop/discourage destructive behavior** (3 comments, P2). The model occasionally reaches for `git reset`/`--force` when safer options exist, and doesn't appreciate DB-modification risk. Safety-guardrail request with maintainer authorship.

## 4. Key PR Progress

1. **[#30420](https://github.com/google-gemini/gemini-cli/pull/30420) — A2A server bearer token auth + input validation** (CLOSED/merged, cherry-picked to v0.71.1). Replaces placeholder auth checks with real bearer-token enforcement and adds consistent request validation at the HTTP layer, task creation, and `restore`. The day's most consequential fix.

2. **[#30415](https://github.com/google-gemini/gemini-cli/pull/30415) — Time limit for web search, stop retries on abort** (OPEN, P1). Addresses the indefinite `google_web_search` hang in #29594 by bounding request time and halting retries after cancellation.

3. **[#30441](https://github.com/google-gemini/gemini-cli/pull/30441) — Full extension content in install/update consent** (OPEN). Consent now describes everything an extension adds — including hooks and context files — and re-prompts when an update changes that surface. Meaningful supply-chain hardening.

4. **[#30207](https://github.com/google-gemini/gemini-cli/pull/30207) — Clear `bundle/` before esbuild** (CLOSED, P0). Diagnoses nightly publish failures: ~70 MB of stale build output inflated the tarball to 25.2 MB, triggering `413 Request Entity Too Large`. A clean fix for a release-blocking pipeline issue.

5. **[#30210](https://github.com/google-gemini/gemini-cli/pull/30210) — Stop WebFetch fallback work after cancellation** (CLOSED). Prevents wasted fallback URL attempts once a request is cancelled; fixes #30099.

6. **[#30423](https://github.com/google-gemini/gemini-cli/pull/30423) — Bump 69 npm dependencies** (OPEN, P1). Large grouped dependency update including `simple-git`, `@octokit/rest`, and Vitest-related packages — worth a careful review pass.

7. **[#30433](https://github.com/google-gemini/gemini-cli/pull/30433) — Bump zod 3.25.76 → 4.6.6** (CLOSED, P2). A major-version jump for a ubiquitous validation library; note the release notes reference "six malicious commits" upstream, so provenance deserves attention.

8. **[#30430](https://github.com/google-gemini/gemini-cli/pull/30430) — Bump MCP SDK 1.23.0 → 1.32.0** (CLOSED, P1). Keeps the bundled MCP server example current with the TypeScript SDK.

9. **[#30426](https://github.com/google-gemini/gemini-cli/pull/30426) — Changelog for v0.71.0** (CLOSED). Auto-generated release documentation; pairs with #30440 for v0.71.1.

10. **[#30440](https://github.com/google-gemini/gemini-cli/pull/30440) — Changelog for v0.71.1** (OPEN). Documents the patch release containing the A2A auth cherry-pick.

## 5. Hot Discussions

No discussion data was provided in the source dataset; this section is omitted.

## 6. Feature Request Trends

- **Subagent observability and control**: Multiple issues ask for subagent trajectories in `/chat share` ([#22598](https://github.com/google-gemini/gemini-cli/issues/22598)), subagent context in bug reports ([#21763](https://github.com/google-gemini/gemini-cli/issues/21763)), and proper termination reporting ([#22323](https://github.com/google-gemini/gemini-cli/issues/22323)). The theme: subagents are opaque when they misbehave.
- **More surgical codebase navigation**: An EPIC cluster ([#22745](https://github.com/google-gemini/gemini-cli/issues/22745), [#22746](https://github.com/google-gemini/gemini-cli/issues/22746), [#22747](https://github.com/google-gemini/gemini-cli/issues/22747), [#19561](https://github.com/google-gemini/gemini-cli/issues/19561)) targets AST-aware reads/search and token-frugal "tactful extraction" to cut context bloat — baseline is quoted at ~36.6k tokens/turn.
- **Persistent, file-based task tracking**: [#18836](https://github.com/google-gemini/gemini-cli/issues/18836) and [#21000](https://github.com/google-gemini/gemini-cli/issues/21000) propose replacing in-context `WriteToDo` with CRUD-backed tracking to avoid context rot and memory loss between sessions.
- **Safe-by-default agent behavior**: [#22672](https://github.com/google-gemini/gemini-cli/issues/22672) requests guardrails against destructive git commands and risky resource modifications.
- **Better agent self-awareness**: [#21432](https://github.com/google-gemini/gemini-cli/issues/21432) asks the CLI to know its own flags, hotkeys, and invocation patterns well enough to guide users.

## 7. Developer Pain Points

- **Subagent reliability is the dominant complaint.** Hangs (#21409), false success reporting (#22323), ignored configuration (#22267), and platform-specific failures (#21983) all point to subagent execution as the least trustworthy part of the system.
- **Model under-utilizes its own extension points.** Users define skills and subagents that the model then ignores (#21968), eroding confidence in configuring the CLI.
- **Tooling scale issues.** Both the >128-tool 400 error (#24246) and the 25 MB bundle/nightly publish failure (#30207) show the tool surface and build artifacts growing faster than their handling.
- **Workspace hygiene.** Scattered temporary scripts (#23571) and destructive command tendencies (#22672) create friction for developers who need clean commits and safe repos.
- **Numbers worth noting:** #21409 carries 8 👍 on 8 comments — unusually high engagement — and the subagent/agent label dominates the top-30 issues, suggesting this area deserves near-term roadmap priority.

</details>

<details>
<summary><strong>GitHub Copilot CLI</strong> — <a href="https://github.com/github/copilot-cli">github/copilot-cli</a></summary>

# GitHub Copilot CLI — Community Digest
**2026-11-24**

## 1. Today's Highlights

The Copilot CLI team shipped `v1.0.115-8`, a smaller release focused on telemetry and permission handling: `--usage-output-file` now groups subagent usage by configured name (with launch counts), and Assisted Permissions can fail over to a backup review model when the primary stalls. Meanwhile, issue activity is dominated by MCP integration friction — a cluster of reports around Tasks augmentation, OAuth token refresh, and Windows-specific lock/auth failures suggests the MCP layer is the current stability hotspot.

## 2. Releases

**v1.0.115-8** (latest, last 24h)

- **Improved:** `--usage-output-file` now groups subagent usage by *configured name* rather than invocation ID, and reports how many times each subagent was launched — a meaningful win for teams tracking multi-agent cost/usage.
- **Improved:** Assisted Permissions can try another review model when the first stalls or fails, reducing unnecessary approval prompts during interactive sessions.

## 3. Hot Issues

1. **[#2243 — Worktrees are nightmare, should be disabled by default](https://github.com/github/copilot-cli/issues/2243)** (OPEN, 👍 21) — The most upvoted open issue in this batch. The author reports sessions producing thousands of lines of code that can't be cleanly applied back to the main worktree. Strong community signal that worktree behavior should be opt-in, not default.
2. **[#4203 — Remote MCP OAuth: expired access token forces interactive re-auth instead of silent `refresh_token` grant](https://github.com/github/copilot-cli/issues/4203)** (OPEN, 👍 6) — A standards-compliance bug: the CLI ignores cached refresh tokens and drops MCP tools instead of doing an RFC 6749 §6 refresh. High impact for anyone running OAuth-protected MCP servers in automation.
3. **[#5381 — In prompt mode, extension tool permission requests hang forever; `--allow-tool` can't name extension tools](https://github.com/github/copilot-cli/issues/5381)** (OPEN) — Non-interactive runs (`copilot -p`) can hang indefinitely on `custom-tool` permission requests. A serious CI/scripting blocker with no clean workaround.
4. **[#4805 — Sessions become unrevivable: stale `inuse.<pid>.lock` never reclaimed](https://github.com/github/copilot-cli/issues/4805)** (OPEN) — Session data isn't corrupt; a crashed host leaves a lock file that blocks reopen forever. Users lose otherwise-recoverable sessions with no user-facing remedy.
5. **[#5556 — ACP mode no longer emits `agent_thought_chunk` since 1.0.110](https://github.com/github/copilot-cli/issues/5556)** (OPEN) — A regression breaking live "thinking" rendering for ACP clients. Editor/IDE integrators see the agent go silent for long stretches.
6. **[#5255 — Windows: elevated session creates `.mcp-writer.lock` that non-elevated sessions can't open (os_error=5)](https://github.com/github/copilot-cli/issues/5255)** (OPEN) — A nasty Windows footgun: one admin-run session poisons MCP startup for all normal sessions until the lock is manually removed.
7. **[#5540 — Copilot CLI does not send MCP Tasks augmentation for `taskSupport: "required"` tools](https://github.com/github/copilot-cli/issues/5540)** (OPEN) — The CLI advertises Tasks support at init but fails to augment calls, so compliant servers refuse the invocation. Paired with [#5555](https://github.com/github/copilot-cli/issues/5555) (client declares Tasks extension but rejects `CreateTaskResult`), this points to an incomplete Tasks implementation.
8. **[#5550 — Built-in GitHub MCP read tools unavailable to custom agents when `gh` is on `PATH`](https://github.com/github/copilot-cli/issues/5550)** (OPEN) — Subtle environment-dependent behavior: `gh` on PATH shadows the built-in MCP server, silently breaking issue reads for custom agents.
9. **[#5560 — rg compaction corrupts filenames with multiple numeric suffixes](https://github.com/github/copilot-cli/issues/5560)** (OPEN, triage) — The built-in ripgrep result compactor mangles filenames/line numbers and can merge matches from distinct files. Quietly corrupts search output.
10. **[#5558 — Remove or make optional the 100-word response limit](https://github.com/github/copilot-cli/issues/5558)** (OPEN, triage) — A hard-coded 100-word target in the default system prompt produces "incomprehensible answers omitting key details." A quick, high-leverage prompt/config fix request.

*Also notable (closed/resolved in window):* [#5100](https://github.com/github/copilot-cli/issues/5100) (120s host-ack timeout bricking sessions), [#4323](https://github.com/github/copilot-cli/issues/4323) (JSON comments in `.mcp.json` skipping all workspace MCP servers), [#4035](https://github.com/github/copilot-cli/issues/4035) (voice installer hitting a private Azure feed → 401).

## 4. Key PR Progress

Only one PR was updated in the last 24h:

1. **[#5554 — Add opt-in connection token generation to the CLI container](https://github.com/github/copilot-cli/pull/5554)** (CLOSED, by brunoborges) — Lets developers connect a local SDK client to a headless CLI before GitHub credentials exist. Setting `COPILOT_CONNECTION_TOKEN_GENERATE=true` prints a fresh random token at startup, avoiding the need to pre-create a shared secret on the host. Closed during the window; worth watching if it reappears as a follow-up, since headless/SDK bootstrapping is a recurring ask.

*(PR volume was minimal in this window; no other PRs met the inclusion threshold.)*

## 5. Hot Discussions

No Discussion data was provided in the source dataset. **Section omitted.**

## 6. Feature Request Trends

Distilled from Issues and the PR in this window:

- **Safer defaults for worktrees** — [#2243](https://github.com/github/copilot-cli/issues/2243) requests worktree creation be opt-in and human-approved by default.
- **Dynamic/refreshable auth for remote MCP** — [#5524](https://github.com/github/copilot-cli/issues/5524) asks for a `headersHelper`-style dynamic header hook (parity with Claude Code); [#4203](https://github.com/github/copilot-cli/issues/4203) asks for proper `refresh_token` grants.
- **Enterprise policy controls** — [#4446](https://github.com/github/copilot-cli/issues/4446) proposes org-level configuration/enforcement for sandbox enablement and pushed config.
- **Configurable response verbosity** — [#5558](https://github.com/github/copilot-cli/issues/5558) wants the 100-word cap removed or exposed as a setting.
- **Session history as memory** — [#2048](https://github.com/github/copilot-cli/issues/2048) asks Copilot to search prior sessions instead of re-solving known problems.
- **Headless/SDK ergonomics** — [#5554](https://github.com/github/copilot-cli/pull/5554) reflects demand for easier programmatic/containerized CLI access.
- **JSON-with-comments tolerance** — [#4323](https://github.com/github/copilot-cli/issues/4323) (closed) highlights desire for more forgiving `.mcp.json` parsing.

## 7. Developer Pain Points

Recurring frustrations across this window's issues:

- **MCP is the dominant failure surface.** Tasks protocol mismatch ([#5540](https://github.com/github/copilot-cli/issues/5540), [#5555](https://github.com/github/copilot-cli/issues/5555)), OAuth refresh gaps ([#4203](https://github.com/github/copilot-cli/issues/4203)), Windows lock contention ([#5255](https://github.com/github/copilot-cli/issues/5255)), guest-tenant auth ([#5525](https://github.com/github/copilot-cli/issues/5525)), and `gh`-on-PATH shadowing ([#5550](https://github.com/github/copilot-cli/issues/5550)) all point to an MCP layer that needs hardening and clearer diagnostics (errors often name only an index, not the offending server/tool — see [#5557](https://github.com/github/copilot-cli/issues/5557)).
- **Session lifecycle fragility.** Stale locks ([#4805](https://github.com/github/copilot-cli/issues/4805)), host-ack timeouts ([#5100](https://github.com/github/copilot-cli/issues/5100)), MCP dropped during session-ID swap ([#4920](https://github.com/github/copilot-cli/issues/4920)), and cloud sandbox reconnection failures ([#5552](https://github.com/github/copilot-cli/issues/5552), [#5553](https://github.com/github/copilot-cli/issues/5553)) make sessions feel brittle, especially in long-running or mobile contexts.
- **Non-interactive/prompt mode is under-served.** Permission requests that hang forever ([#5381](https://github.com/github/copilot-cli/issues/5381)) and missing `task_complete` output ([#2482](https://github.com/github/copilot-cli/issues/2482)) undermine CI and scripting use cases.
- **Windows-specific breakage cluster.** Lock permissions, plugin uninstall access-denied ([#5119](https://github.com/github/copilot-cli/issues/5119)), voice installer 401 ([#4035](https://github.com/github/copilot-cli/issues/4035)), and auth tenant mismatches ([#5525](https://github.com/github/copilot-cli/issues/5525)) suggest Windows needs dedicated QA attention.
- **Output fidelity/regressions.** Silent reasoning-summary loss in ACP ([#5556](https://github.com/github/copilot-cli/issues/5556)) and filename corruption in rg compaction ([#5560](https://github.com/github/copilot-cli/issues/5560)) erode trust in tool output.

---

*Digest generated from github.com/github/copilot-cli activity for 2026-11-24. Issue/PR statuses (OPEN/CLOSED) reflect the source data snapshot.*

</details>

<details>
<summary><strong>OpenCode</strong> — <a href="https://github.com/anomalyco/opencode">anomalyco/opencode</a></summary>

# OpenCode Community Digest — 2026-11-24

## 1. Today's Highlights

OpenCode shipped **v2.4.1** (macOS 12 session-save fix, config-only provider visibility) on the heels of **v2.4.0**, which introduced a **built-in desktop browser** with Chrome/Edge/Firefox/Safari sign-in import and a persistent profile. Meanwhile, the issue tracker is dominated by v2 newcomers stress-testing the desktop app: a flood of UX feature requests from `magicprinc`, lingering background-service lifecycle bugs, and provider-side TTFT/stream-reliability reports against `opencode-go`.

---

## 2. Releases

**v2.4.1** — Patch release.
- **macOS 12 Session Fix**: Assistant messages save again on older SQLite bundled with macOS 12 ([#65771](https://github.com/anomalyco/opencode/pull/65771)).
- **Config-Only Provider Visibility**: Providers defined only in config (e.g., Ollama) now correctly expose their models.

**v2.4.0** — Feature release.
- **Built-In Desktop Browser**: Import sign-ins/history from Chrome, Edge, Firefox, or Safari; install extensions from Chromium/Chrome/Edge stores; persistent desktop profile with surviving tabs and signed-in chat links.

---

## 3. Hot Issues

1. **[#54267](https://github.com/anomalyco/opencode/issues/54267)** — `service: relaunch fails with "Managed service port already in use"` (14 comments, 👍4). The most-discussed open issue: a stale `opencode serve --service` on a fixed port collides with a relaunch when the client misreports the service as `missing`. Reproduced; high impact on multi-workspace workflows.

2. **[#57849](https://github.com/anomalyco/opencode/issues/57849)** — `opencode-go/deepseek-v4.1-flash: 21.7–178.2 s pre-header stalls at 97.97–99.97% cache hit` (12 comments). Deep request-level tracing showing header delays ballooning at 241k–607k context despite near-perfect cache hit rates. Signals an upstream routing/gateway bottleneck rather than prompt-size cost.

3. **[#65946](https://github.com/anomalyco/opencode/issues/65946)** — Desktop: right-click a link to open it in the app's browser pane, letting the agent operate on that page (8 comments). Ties the new browser feature to agentic workflows — a natural next step for the v2.4.0 browser.

4. **[#43758](https://github.com/anomalyco/opencode/issues/43758)** — Session-scoped terminals + optional terminal context for the model (8 comments). Long-standing request: terminals are workspace-scoped, so all tabs share one; users want per-session isolation and model visibility into terminal state.

5. **[#59052](https://github.com/anomalyco/opencode/issues/59052)** — Clipboard written natively and via OSC 52 simultaneously, racing the terminal on macOS (6 comments). Regression from 1.18.30 → 2.1.4; Alacritty users see NSPasteboard warnings from `destination: "all-available"`.

6. **[#65977](https://github.com/anomalyco/opencode/issues/65977)** — Desktop: IDE-grade project tree, worktree manager, and git history modelled on IntelliJ Community (4 comments). Explicitly bundles three narrower asks into one coherent "IDE parity" goal.

7. **[#65424](https://github.com/anomalyco/opencode/issues/65424)** — TUI worktree location line omits `:branch` after the `/worktrees` move (4 comments). Reproduced; a small but visible regression in the worktree picker.

8. **[#60309](https://github.com/anomalyco/opencode/issues/60309)** — Expose the upstream model chosen by auto/fusion routers in response metadata (4 comments). Matters for observability when FreeLLMAPI-style virtual models silently route elsewhere.

9. **[#58141](https://github.com/anomalyco/opencode/issues/58141)** — Background service is a per-user singleton; first launch's env applies to every profile (3 comments, 👍2). `OPENCODE_CONFIG_DIR`/`XDG_DATA_HOME` profiles are undermined by a single shared service process. Pairs with #54267 and #62145 as a cluster of service-lifecycle defects.

10. **[#65966](https://github.com/anomalyco/opencode/issues/65966)** — `opencode-go`: TTFT grows with prompt length (18k→6s, 90k cold→19s), traffic routed to remote-IAD (3 comments). Independent corroboration of #57849 from a different user and platform; server-timing points upstream.

---

## 4. Key PR Progress

1. **[#65984](https://github.com/anomalyco/opencode/pull/65984)** — `fix(core): price service tier speeds at the tier's long-context rates`. Follow-up to #65749, fixing hosts (e.g., DigitalOcean) that price tiers with their own rates rather than a multiplier.

2. **[#65983](https://github.com/anomalyco/opencode/pull/65983)** — `fix(core): keep service tier prices free when text prices aren't per token`. Guards `tierPrices` with the same per-token check `cost()` performs.

3. **[#65982](https://github.com/anomalyco/opencode/pull/65982)** — `fix(tui,app): keep variants saved for a model speed`. Restores reasoning-variant persistence after #65749 collapsed per-speed model keys.

4. **[#65981](https://github.com/anomalyco/opencode/pull/65981)** — `fix(core): validate automations created by Effect plugins`. Prevents a malformed JS-plugin automation row from 500-ing everyone's unfiltered automation list.

5. **[#65980](https://github.com/anomalyco/opencode/pull/65980)** — `fix(plugin): honor abort signals in Promise plugin API calls`. The Promise adapter was silently dropping `{ signal }` passed to `ctx.*` SDK methods.

6. **[#65915](https://github.com/anomalyco/opencode/pull/65915)** — `fix: keep background service stable under heavy parallel workloads`. Directly addresses #65799 (service restarted ~97 times in 6 hours); short-lived CLI probes were triggering restarts. Relevant to the #54267/#58141 cluster.

7. **[#63669](https://github.com/anomalyco/opencode/pull/63669)** — `feat(core): add agent instructions and use them for Plan mode`. Closes #62628: removes Plan's post-compaction synthetic reminder loop by moving rules into the system prompt.

8. **[#65961](https://github.com/anomalyco/opencode/pull/65961)** — `feat(app): pin inbox sessions and list archived ones in the sidebar`. Experimental Inbox follow-up (stacked on #65416). Responds directly to community pinning requests such as #59906.

9. **[#65969](https://github.com/anomalyco/opencode/pull/65969)** — `fix(desktop): attach the browser to a session that runs in an unopened tab`. Fixes browser panes only attaching to the visible session — automations, resumed sessions, and background jobs lost their browser.

10. **[#65914](https://github.com/anomalyco/opencode/pull/65914)** — `fix(app): eliminate quadratic per-tab work in tab strip` (closes #65451). Performance fix for many open session tabs — each update was doing O(n) work per row.

Honorable mention: **[#65948](https://github.com/anomalyco/opencode/pull/65948)** — accept machine WebSocket links on the Cloudflare `workerd` server profile (behind the `machines` flag).

---

## 5. Hot Discussions

No Discussions data was provided in the source dataset; this section is omitted.

---

## 6. Feature Request Trends

- **Desktop as an IDE (dominant, ~8 of the top 30 issues)**: project tree + worktree manager + git history ([#65977](https://github.com/anomalyco/opencode/issues/65977)), stacked file view with draggable splitter ([#65944](https://github.com/anomalyco/opencode/issues/65944)), diff-stack-below-list review pane ([#65927](https://github.com/anomalyco/opencode/issues/65927)), working-directory in header ([#65950](https://github.com/anomalyco/opencode/issues/65950)), copy path/reveal in Explorer from diffs ([#65933](https://github.com/anomalyco/opencode/issues/65933)), and richer message metadata ([#65958](https://github.com/anomalyco/opencode/issues/65958)). A second thread asks for sidebar state semantics: working vs. needs-attention, plus pinning ([#65953](https://github.com/anomalyco/opencode/issues/65953), [#59906](https://github.com/anomalyco/opencode/issues/59906)).
- **Agent-aware browser integration**: right-click links into the browser pane and let the agent act on the page ([#65946](https://github.com/anomalyco/opencode/issues/65946)); also MCP `browse` gaps like `page.waitForEvent("filechooser")` ([#65956](https://github.com/anomalyco/opencode/issues/65956)).
- **Session & context observability**: session-picker context size ([#61070](https://github.com/anomalyco/opencode/issues/61070)), cross-session token/cache-hit totals in the Context panel ([#58024](https://github.com/anomalyco/opencode/issues/58024)), and upstream-model metadata for auto/fusion routers ([#60309](https://github.com/anomalyco/opencode/issues/60309)).
- **Session isolation**: session-scoped terminals with optional model visibility ([#43758](https://github.com/anomalyco/opencode/issues/43758)).
- **Ecosystem/plugin discoverability**: surface `opencode-github-panel` as a recommended plugin ([#65970](https://github.com/anomalyco/opencode/issues/65970)); add `@simular-ai/opencode-box` to the docs table ([#65968](https://github.com/anomalyco/opencode/pull/65968)).

---

## 7. Developer Pain Points

- **Background-service lifecycle is the #1 reliability theme.** Three overlapping issues — port squatting on relaunch ([#54267](https://github.com/anomalyco/opencode/issues/54267), reproduced, 14 comments), per-user singleton environment bleed across profiles ([#58141](https://github.com/anomalyco/opencode/issues/58141)), and a second server on the same DB pausing running goals ([#62145](https://github.com/anomalyco/opencode/issues/62145)) — plus a PR ([#65915](https://github.com/anomalyco/opencode/pull/65915)) whose issue reported ~97 service restarts in 6 hours. Expect a coordinated fix arc here.
- **`opencode-go` inference latency and stream reliability.** Two independent reports of TTFT scaling with context despite high cache-hit rates ([#57849](https://github.com/anomalyco/opencode/issues/57849), [#65966](https://github.com/anomalyco/opencode/issues/65966)), and the `synthetic` provider intermittently aborting turns with `Invalid ... stream event` ([#65876](https://github.com/anomalyco/opencode/pull/65876), closed).
- **Free-tier friction.** "Free usage limit reached" after a week of inactivity ([#65928](https://github.com/anomalyco/opencode/issues/65928)) points to a stuck/misreported quota.
- **v2 regression cleanup.** Clipboard double-write racing terminals ([#59052](https://github.com/anomalyco/opencode/issues/59052)), worktree branch label dropped in TUI ([#65424](https://github.com/anomalyco/opencode/issues/65424)), non-scrollable goal view ([#65814](https://github.com/anomalyco/opencode/issues/65814), closed), and a CLI hang when stdin is an open pipe ([#65887](https://github.com/anomalyco/opencode/issues/65887)) — a steady stream of migration fallout being triaged.
- **Plugin reload/abort correctness.** Reloaded plugins briefly vanish from `ctx.tool.list()` while `ctx.plugin.list()` says active ([#64464](https://github.com/anomalyco/opencode/issues/64464)); Promise plugins silently ignore abort signals ([#65980](https://github.com/anomalyco/opencode/pull/65980)); Effect-plugin-created automations can poison list responses ([#65981](https://github.com/anomalyco/opencode/pull/65981)).

---

*Digest generated from `anomalyco/opencode` GitHub activity for 2026-11-24. Links reference `github.com/anomalyco/opencode`.*

</details>

<details>
<summary><strong>Pi</strong> — <a href="https://github.com/earendil-works/pi">earendil-works/pi</a></summary>

# Pi Community Digest — 2026-11-24

## 1. Today's Highlights

No new releases landed in the last 24 hours, but the issue tracker stayed hot with 50 updated issues and 27 PRs. The day's dominant themes were **streaming robustness** (SSE/line buffering, `finish_reason: "error"` retries, WebSocket continuation for Codex), **credential/installer edge cases** (`!command` key failures, WSL adopting a Windows install, `apt install pi` collisions), and **catalog hygiene** (pruning retired OpenAI, Groq, and Mistral models). A large batch of fixes from `petrroll` merged quickly, closing several long-standing bugs in a single day.

## 2. Releases

None in the last 24 hours.

## 3. Hot Issues

1. **[#10956](https://github.com/earendil-works/pi/issues/10956)** — `cacheWarming: "idle"` silently never fires when an extension handles `turn_end` and the context holds a custom/compaction message. 16 comments and the highest engagement of the day; a long-lived correctness bug in cache-warming decisions (507 logged events, all at `continuationProbability: 1`).
2. **[#12242](https://github.com/earendil-works/pi/issues/12242)** — Compaction summary balloons from 17k to 164k chars over nine compactions; the ninth took 588s and 75k output tokens. A serious cost/latency regression for long sessions; the "PRESERVE all existing information" prompt is the suspected amplifier.
3. **[#12444](https://github.com/earendil-works/pi/issues/12444)** — P0: `openai-codex-responses` max_output_tokens clamping breaks WebSocket `previous_response_id` continuation and re-serialized `function_call` args trigger `prefix_mismatch`, losing prompt cache (~117k tokens). High-impact for Codex users on `gpt-6.2-astra`.
4. **[#12463](https://github.com/earendil-works/pi/issues/12463)** — Resuming the active session drops the interrupted tool's cancellation result from the branch (present in JSONL, missing in transcript). Data-integrity concern for `/resume` workflows; closed same day.
5. **[#12317](https://github.com/earendil-works/pi/issues/12317)** — Windows: a single `EIO`/`EPIPE` on stdin/stdout kills the agent via `emergencyTerminalExit()`. Tab switches, sleep/wake, and ConPTY flakiness routinely trigger it; still open and marked `inprogress`.
6. **[#12224](https://github.com/earendil-works/pi/issues/12224)** — MCP SSE `consumeSseStream()` repeatedly concatenates and rescans incomplete large events, yielding O(n²) buffering. Already addressed by PR #12451.
7. **[#12035](https://github.com/earendil-works/pi/issues/12035)** — Threshold compaction fires far below the window when a virtual model is selected, because `_modelForMessage()` returns `undefined`. Users hit premature compaction with virtual models.
8. **[#12164](https://github.com/earendil-works/pi/issues/12164)** — `/login` shows a stored `!command` API key as configured even when the command exits nonzero, then requests fail with "No API key found". Credential observability gap; fixed by PR #12454.
9. **[#10585](https://github.com/earendil-works/pi/issues/10585)** — P0: bash temp-file stream errors (ENOSPC/EACCES) crash the whole process on 1.0.4, losing the in-flight run. Fixed by PR #12452/#12461.
10. **[#12383](https://github.com/earendil-works/pi/issues/12383)** — Resumed Kimi session can't select tools that are present in the outbound provider payload (8 tools in loadout, 4 callable). Reproducible only on resumed sessions; a subtle session-state bug.

Also worth watching: [#12407](https://github.com/earendil-works/pi/issues/12407) (gemini-4-neon mid-stream stops), [#12361](https://github.com/earendil-works/pi/issues/12361) (Codex reasoning effort stuck at "medium"), and [#12443](https://github.com/earendil-works/pi/issues/12443) (xhigh thinking unsupported on Gemini 4).

## 4. Key PR Progress

1. **[#12451](https://github.com/earendil-works/pi/pull/12451)** — Reads large streamed lines/SSE events in linear time (closes #12224). Fixes the `+=`-and-rescan pattern with saved-offset searching, spanning mcp/ai/agent/coding-agent/tui.
2. **[#12452](https://github.com/earendil-works/pi/pull/12452) + [#12461](https://github.com/earendil-works/pi/pull/12461)** — Stops temp-file write failures from crashing pi (fixes #10585), then corrects fallback behavior so in-memory short outputs aren't falsely marked truncated. Two-PR cleanup in one day.
3. **[#12454](https://github.com/earendil-works/pi/pull/12454) + [#12459](https://github.com/earendil-works/pi/pull/12459)** — Reports unresolved stored credentials as "not configured" (fixes #12164), then surfaces unresolved keys in `/login` and reruns saved command keys.
4. **[#12455](https://github.com/earendil-works/pi/pull/12455)** — Classifies `finish_reason: "error"` in the retry classifier (closes #12206), so Copilot/OpenRouter/Mistral transient stream failures actually retry.
5. **[#12437](https://github.com/earendil-works/pi/pull/12437)** — Pins Codex request effort to the initial selection (closes #12361), fixing `high`/`xhigh` being sent as `medium` while preserving prompt-cache reuse.
6. **[#12457](https://github.com/earendil-works/pi/pull/12457)** — Refuses `pi update` of a Windows install run from WSL (follow-up to #12172), preventing the installer from adopting a `/mnt/c` interop install.
7. **[#12450](https://github.com/earendil-works/pi/pull/12450) / [#12453](https://github.com/earendil-works/pi/pull/12453) / [#12449](https://github.com/earendil-works/pi/pull/12449)** — Catalog hygiene sweep: drops shut-down `gpt-5-chat-latest`, enables `skipDeprecated` for Groq, and replaces retired Mistral models (`devstral-medium-latest`, `pixtral-12b`) that were breaking CI.
8. **[#12441](https://github.com/earendil-works/pi/pull/12441)** — Adds Google `xhigh` thinking level support for `gemini-4-neon` / `gemini-4-hydrogen` (fixes #12443).
9. **[#12446](https://github.com/earendil-works/pi/pull/12446)** — Passes explicit `-t text/plain` to `wl-copy`, fixing silent copy failures on Wayland/Klipper (fixes #12374).
10. **[#12325](https://github.com/earendil-works/pi/pull/12325)** — Fixes newly enabled GitHub Copilot models staying hidden after `pi update --models` (fixes #11006), including a token-expiry regression.

Other notable: [#12442](https://github.com/earendil-works/pi/pull/12442) (explains oversized Mermaid fallback), [#12438](https://github.com/earendil-works/pi/pull/12438) (overflow matching inside identifiers), [#12434](https://github.com/earendil-works/pi/pull/12434) (retry "request rate increased too quickly"), and the stacked provider additions **[#11370](https://github.com/earendil-works/pi/pull/11370)** (DeepInfra, Nebius, Ollama Cloud, Scaleway, SiliconFlow, StepFun).

## 5. Hot Discussions

**Show and tell**
- **[#12458](https://github.com/earendil-works/pi/discussions/12458)** — Mobaide, a free Apache-2.0 app (Android/iOS/browser) that runs Pi on your own computer and lets you dictate prompts from your phone, with a review-before-send voice flow. 1 👍, 0 comments.

## 6. Feature Request Trends

- **Monorepo / subpath package installs** — #4530 and #4851 both request a `subdirectories` field (or subpath syntax) for `pi install git:`, so individual extensions can be installed from a monorepo instead of the whole repo root. Both were closed with `closed-because-refactor, no-action`, so this is likely to resurface.
- **Provider breadth and catalog accuracy** — Stacked PR #11370 adds six hosted inference providers, while #12202, #12379, and #12449/#12453 show sustained demand for catalog pruning (`skipDeprecated`, removing dead models, fixing misleading "(latest)" labels).
- **Context observability** — #12377 proposes a read-only `/context` inspector to show system prompt vs tools vs history breakdown, last cache-miss cost, and distance to compaction.
- **First-class provider-hosted web search** — #12419 asks for normalized web-search blocks with per-round events instead of opaque wire blocks.
- **Thinking-reasoning fidelity** — #12456 wants `summaryIndex` / `summaryPartEnd` on `thinking_delta`; #12462 wants Bedrock Kimi K3.1 `max` effort to actually be sent.
- **Multi-skill invocations** — #6180 requests parsing multiple `<skill>` blocks in one message.

## 7. Developer Pain Points

- **Streaming is still the top source of crashes and stutters.** SSE/line rescanning (#12224), `finish_reason: "error"` not retried (#12206), Codex WebSocket continuation breaks (#12444), and mid-stream stops on gemini-4-neon (#12407) all point to fragile stream-state handling.
- **Long-session cost and correctness.** Compaction summaries growing unboundedly (#12242) and compaction firing below the window with virtual models (#12035) make long-running sessions expensive and unpredictable.
- **Credential and installer ambiguity.** `!command` keys failing silently while showing as configured (#12164), the WSL/Windows interop install being adopted (#12172), and `apt install pi` colliding with the installer (#12166) are recurring onboarding/operations traps.
- **Temporary-file and terminal resilience.** A full `/tmp` or a single `EIO`/`EPIPE` can kill an entire run (#10585, #12317) — developers want pi to degrade gracefully, not exit.
- **Session resume fidelity.** Interrupted tool results dropped from branches (#12463) and tools present in the payload but unselectable after resume (#12383) erode trust in `/resume`.
- **Catalog staleness breaking CI.** Retired models in the generated catalog failed CI on `main` (#12449), showing that the models.dev sync needs stricter deprecation filtering.

</details>

<details>
<summary><strong>Qwen Code</strong> — <a href="https://github.com/QwenLM/qwen-code">QwenLM/qwen-code</a></summary>

# Qwen Code Community Digest — 2026-11-24

## Today's Highlights

The 1.0 Preview event-driven agent loop continues its staged landing on `main` — PR #18213 flips the Ink TUI onto the event-bus kernel by default, directly serving the tracking issue #17045. Managed Agent reliability work stays hot: cancellation/cleanup races (#18127, closed by #18212) and Action parking for child sessions (#18224) both advanced. On the user-facing side, a security-sensitive issue (#18165) reports plaintext API keys landing in session JSONL logs with overly broad file permissions.

## Releases

No new releases in the last 24 hours.

## Hot Issues

1. **#17045 — tracking(core): land the 1.0 Preview loop kernel on main** ([link](https://github.com/QwenLM/qwen-code/issues/17045))
   The umbrella issue for migrating the event-driven kernel behind `query()` onto `main`, one surface at a time with a rollback switch. 24 comments and the most active thread in the repo — it's the roadmap anchor for the entire 1.x line.

2. **#15486 — Compaction double-counts pending tool result + 20K pad → `max_tokens: 1`** ([link](https://github.com/QwenLM/qwen-code/issues/15486))
   A P1 correctness bug in context management: auto-compaction racing a pending tool result inflates the next request's size estimate, stalling turns. High blast radius for long sessions; still under discussion after a month.

3. **#18165 — Session logs persist API keys in plaintext** ([link](https://github.com/QwenLM/qwen-code/issues/18165))
   Reported today: `cat`/`grep` output containing a full API key is written unredacted into `~/.qwen/projects/**/chats/*.jsonl`, duplicated across `output`/`text`/`resultDisplay` fields, and file permissions are wider than necessary. A security issue that deserves fast triage.

4. **#17446 — Discover models during custom provider setup** ([link](https://github.com/QwenLM/qwen-code/issues/17446))
   Extends the `/auth` model-discovery UX to custom OpenAI/Anthropic-compatible endpoints. A steady, frequently-upvoted class of request: less manual Model ID typing, better onboarding.

5. **#17316 — Support MCP elicitation capability** ([link](https://github.com/QwenLM/qwen-code/issues/17316))
   The MCP client doesn't implement `elicitation/create`, so servers relying on structured mid-interaction input fail or silently degrade. Notable because MCP parity is increasingly a reason developers pick a harness.

6. **#18159 — Custom panels in the built-in Web Shell** ([link](https://github.com/QwenLM/qwen-code/issues/18159))
   Requests a supported extension point so users can add their own views to `qwen serve`'s page without forking or standing up a separate React app. 4 comments in a day — extensibility of Web Shell is an emerging theme.

7. **#18197 — Tool-call emission layer intermittently drops required JSON parameters** ([link](https://github.com/QwenLM/qwen-code/issues/18197))
   Required fields (`file_path`, `command`, `old_string`…) vanish at the serialization boundary, escalating to a non-recoverable retry loop and full-session outage. Loud symptom, hard failure mode.

8. **#18202 — `Ctrl+X` external editor leaves the TUI garbled after exit** ([link](https://github.com/QwenLM/qwen-code/issues/18202))
   Freshly reported: full-screen editors (micro/nano/vim) corrupt the terminal on return, requiring a kill. Classic TUI regression that erodes daily-driver trust.

9. **#18178 — Immutable resource versions per turn in `qwen serve`** ([link](https://github.com/QwenLM/qwen-code/issues/18178))
   Proposes snapshotting skills, files, extensions, tools, hooks, and MCP processes at turn admission. Interesting direction for reproducibility and auditability of hosted agents.

10. **#18148 — Daily dependency CVE audit failed** ([link](https://github.com/QwenLM/qwen-code/issues/18148))
    Automated audit failure flagged by GitHub Actions. Low drama, but CI/security hygiene issues like this compound if left unattended.

## Key PR Progress

1. **#18213 — feat(core): run the Ink TUI on the event-bus kernel by default** ([link](https://github.com/QwenLM/qwen-code/pull/18213))
   The headline PR of the day. Ships the kernel to all TUI users with an opt-out via `experimental.eventBusAgentLoop` / env var, and guarantees Esc-cancelled turns settle within 10 s. This is the first big user-visible slice of #17045.

2. **#18224 — feat(managed-agent): park a child Session's approval wait** ([link](https://github.com/QwenLM/qwen-code/pull/18224))
   Stage 3 of #18149: child sessions can now park during tool approval or question waits and resume via cold recovery, instead of staying resident. Big win for daemon memory footprint at scale.

3. **#18212 — fix(managed-agent): Settle unadmitted cancellations with owed cleanup** ([link](https://github.com/QwenLM/qwen-code/pull/18212))
   Closes the `CANCELLING`-forever bug (#18127) where an unconfirmed `hosted.cleanup` record from a prior turn blocked cancellation. Merged same-day.

4. **#18111 — fix(core,cli,web-shell): support oversized session transcripts** ([link](https://github.com/QwenLM/qwen-code/pull/18111))
   Hardens daemon restore, transcript indexing, artifact loading, and replay framing for very large transcripts, plus Web Shell error handling. Directly addresses the long-session reliability class of bugs.

5. **#18052 — feat(cli): refuse new sessions under sustained host load** ([link](https://github.com/QwenLM/qwen-code/pull/18052))
   Adds host-load admission control (per-core load average + event-loop p99 lag, three-sample hysteresis) before spawning new ACP children. Notable for treating overload as a first-class daemon concern.

6. **#18175 — feat(cli): add built-in display translation for replies and thoughts** ([link](https://github.com/QwenLM/qwen-code/pull/18175))
   New `general.displayLanguage` setting translates completed replies and thoughts in Ink, OpenTUI, and Web Shell. Responds to the long-standing i18n request behind #17143.

7. **#18140 — feat(web-shell): per-workspace management from sidebar and hover overview** ([link](https://github.com/QwenLM/qwen-code/pull/18140))
   Turns every locally trusted workspace into a manageable sidebar entry instead of restricting controls to the primary workspace.

8. **#18205 — feat(web-shell): bind Managed provider to SessionChatController (slice 3b)** ([link](https://github.com/QwenLM/qwen-code/pull/18205))
   React binding layer wiring Managed Agent sessions, transcript streaming, pending approvals/questions, and turn cancellation into the backend-neutral chat controller. Foundational for Web Shell/daemon convergence.

9. **#10644 — feat(core): add bundled Bash search tools** ([link](https://github.com/QwenLM/qwen-code/pull/10644))
   Moves filename/content search onto the Shell tool on macOS/Linux (bundling ripgrep 15.0.0 and bfs), unregistering `glob`/`grep_search` there while keeping dedicated tools on Windows. Long-running PR still open — watch for scope debate.

10. **#18220 — fix(core): keep text out of Gemini `functionResponse.parts`** ([link](https://github.com/QwenLM/qwen-code/pull/18220))
    Schema-conformance fix so tool responses to Gemini models only carry inline media and file references, guarding against malformed parts on unsupported attachments.

## Feature Request Trends

- **Context & compaction performance** — Issues #15486, #16437 and PR #12276 (local notes compaction strategy) show sustained demand for cheaper, more predictable long-session context management, including pointing the model at the transcript post-compaction.
- **Provider & model configuration ergonomics** — Model discovery for custom providers (#17446) and completeness of reasoning-capability tables for newer GPT-6-family IDs (#18200) point at config surfaces lagging behind the model landscape.
- **MCP and tooling extensibility** — Elicitation support (#17316), custom Web Shell panels (#18159), a custom frontend directory for `qwen serve` (#18214), and a hooks extension round (#18217) all ask for more pluggable surfaces.
- **Hosted/daemon reproducibility** — Immutable per-turn resource versions (#18178) and Action parking for child sessions (#18149/#18224) reflect a maturing "managed agent" deployment story.
- **Internationalization & display customization** — TUI i18n (#17143) and display translation (#18175) show language handoff between model output and UI is still immature.
- **Quality infrastructure** — A behavioral eval harness for model-steering changes (#18188) and transcript export contract hardening (#18081) signal growing interest in verifying *choices*, not just mechanics.

## Developer Pain Points

- **Context/compaction correctness at long horizons** — The double-counted tool result plus 20K pad (#15486) and the transcript-lookup request (#16437) both stem from sessions that outlive a single context window; this remains the highest-friction area.
- **Security and data hygiene on disk** — Plaintext API keys in session logs with duplicate fields and loose permissions (#18165) is the sharpest recent example; transcript export and session-file handling keep generating follow-up work (#18081, #18012, #17707).
- **Managed Agent lifecycle races** — Cancellation stuck on cleanup owed by a prior turn (#18127), plus repeated test-hardening follow-ups (#18206, #18216, #18211), show the stateless harness refactor is still settling.
- **Terminal/UI regressions** — TUI corruption after external-editor exit (#18202), window text flicker on Windows (#18225), and repeated Web Shell mobile/layout follow-ups (#17933, #17963, #18191) are frequent, visible annoyances.
- **Onboarding friction** — Sign-in failures on Windows Desktop with repeated "Authentication required" daemon-log entries (#18192) and the manual custom-provider setup (#17446) block new users early.
- **Cross-platform instability** — Windows-specific teardown failures in `node-repl` MCP server tests (#18204) and layout/flicker bugs indicate Linux/macOS-first development habits.

*Note: no Discussion data was provided in the source payload, so the Hot Discussions section is omitted.*

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*