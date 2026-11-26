# AI CLI Tools Community Digest 2026-11-26

> Generated: 2026-11-26 03:29 UTC | Tools covered: 7

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

# Cross-Tool AI CLI Ecosystem Report — 2026-11-26

## 1. Ecosystem Overview

The AI CLI ecosystem on 2026-11-26 is in a **consolidation-and-hardening phase**: feature velocity remains high, but a clear shift is underway from "new capabilities" toward **reliability, cost control, and trust boundaries**. Claude Code is optimizing the economics and determinism of long agentic sessions (prompt cache, compaction), Codex is fighting Windows regressions and session-lifecycle bugs, and Gemini CLI shipped a wave of security-hardening PRs (SSRF, MCP OAuth binding, telemetry redirection). Copilot CLI and OpenCode both saw damaging correctness reports — silent plugin failures, session wedging, and a drive-wipe incident — while Pi and Qwen Code focused on provider-fidelity fixes and CI stabilization respectively. Across all seven tools, the most repeated complaints are **cache fragility, subagent reliability, silent failures, and Windows/enterprise environment friction**, suggesting the category has entered the "production-readiness" phase of its adoption curve.

---

## 2. Activity Comparison

| Tool | Issues (updated) | PRs (updated) | Discussions | Releases (24h) |
|---|---|---|---|---|
| **Claude Code** | ~50 | 2 (both open-source attempts) | No data provided | None |
| **OpenAI Codex** | 30+ (top-30 sampled) | ~20 (TUI polish + statusline) | 11 active threads | 1 (rust-v0.174.0-alpha.6) |
| **Gemini CLI** | ~50 | ~30 | No data provided | None |
| **GitHub Copilot CLI** | ~41 | 2 (both closed devcontainer) | No data provided | 6 (v1.0.116 → v1.0.117-2) |
| **OpenCode** | Top-10 sampled | ~10 (core refactors) | No data provided | 1 (v2.4.2) |
| **Pi** | Top-10 sampled | ~15 (provider fixes) | 3 (Show & tell + Ideas) | 1 (v1.6.1) |
| **Qwen Code** | 10+ (CI-dominated) | ~10 | No data provided | 1 (v1.0.0-preview.2) |

**Notes on this table:**
- Claude Code and Gemini CLI continue to run **Issues+PRs only** with no public Discussions surface; neither repo has Issues/PRs disabled — absence of Discussions data reflects upstream configuration, not inactivity.
- Copilot CLI's 6 releases in 24h reflect a rapid patch-train cadence (v1.0.116 → v1.0.117-2), but with almost no community PR throughput — fixes are landing via direct commits rather than merged contributions.
- OpenCode, Pi, and Qwen Code digests sample "hot" issues rather than the total updated count; treat their column values as lower bounds.

---

## 3. Shared Feature Directions

Four themes recur across **three or more** tool communities:

**A. Prompt-cache efficiency and cost control**
- Claude Code: cache invalidation on session resume (#112264), plugin cache pre-warm API (#101755), skill-schema bloat (#94484).
- Pi: preserving Copilot prompt cache across effort/tool changes (#12539), tunable idle cache-warming horizon (#11127).
- Qwen Code: hard-coded temperature breaking third-party endpoints (#12928) — adjacent cost/compat concern.

**B. Subagent reliability, observability, and continuation**
- Gemini CLI: false `GOAL` success after MAX_TURNS (#22323), generalist agent hangs (#21409), backgroundable local agents (#22741).
- OpenCode: subagent continuation fully broken (#59293), foreground execution removed (#64073).
- Claude Code: subagent write-tool heuristic blocks legitimate files (#44657); tool schemas lost after compaction (#112250).

**C. Session state integrity and lifecycle**
- Codex: session scoping in VS Code (#22829), concurrent session disconnects (#57650), TUI hangs with no error (#59559).
- Copilot CLI: permanent session wedging (#4755), `-p` mode regression breaking CI (#5574).
- OpenCode: v1→v2 migration wedging OpenAI Chat sessions (#66389), worktree re-pointing (#50979).

**D. Cross-tool memory portability**
- Codex: `recall` MCP server that reads Claude Code's `~/.claude/projects/<project>/memory/` files (#58220); Memlayer project memory (#63534).
- This is a newly emerging direction — a **cross-ecosystem interoperability layer** is forming organically in the Codex community, notably targeting Claude Code's memory format as a de facto standard.

**E. Enterprise/managed-environment support**
- Copilot CLI: Windows ConstrainedLanguage shell failures (#4683), managed-policy pre-approval (#5575), GHE.com-only auth updater break (#5571).
- Gemini CLI: trusted-workspace telemetry redirection (PR #30476) — a supply-chain-style hardening.
- Codex: Windows update removed permission selectors, blocking Pro workflows (#62943, #62907).

---

## 4. Differentiation Analysis

| Dimension | Claude Code | OpenAI Codex | Gemini CLI | Copilot CLI | OpenCode | Pi | Qwen Code |
|---|---|---|---|---|---|---|---|
| **Primary focus** | Cost/determinism of long agentic sessions | TUI polish + platform fixes | Security hardening + agent reliability | Enterprise/managed fleets | Session integrity + Windows safety | Provider-fidelity + extensibility | Qwen4-Max + Web Shell + CI |
| **Target user** | Power users, plugin authors | Cross-platform devs (heavy Windows) | Linux/modern-desktop + MCP-heavy | Enterprise/managed Windows | Multi-provider tinkerers, custom providers | Local-model + SDK integrators | 1M-context + mobile/Web Shell users |
| **Approach** | Deep behavioral/API hooks for plugins | Native TUI as first-class surface | Security-first agent runtime | Policy & subscription controls | Aggressive core refactors (fibers, env gating) | Vendor-parity adapter correctness | Subscription UX + daemon/embedded hosts |
| **Notable tension** | Heuristics without opt-out; cache fragility | Nov 21 Windows regression wave | Credential/tool-approval trust gaps | Repo hygiene (`refs/agents/*`) vs. git users | Destructive shell commands under-modeled | Terminal state leakage on Windows | CI flakiness blocking unrelated PRs |

**Key differentiators:**
- **Claude Code** is the only tool whose community is actively pushing **open-sourcing via shipped source maps** (PRs #41518, #41447) — a governance pressure point unique to this ecosystem.
- **Codex** is the only tool where a **cross-tool memory bridge** (reading another vendor's memory files) has emerged from the community, signaling a lead in interoperability thinking.
- **Gemini CLI** has the strongest **security-PR cluster** today (5 of 10 top PRs are security fixes), reflecting a coordinated hardening push.
- **Copilot CLI** uniquely lacks community-PR throughput despite high release cadence — contributions upstream are effectively blocked, which may frustrate external contributors.
- **OpenCode** is the only tool where a **destructive-action incident (drive wipe, #66449)** materially affected a user's machine, making guardrails a first-order concern.
- **Pi** has the most precise **provider-parity discipline** (Bedrock Kimi reasoning, Copilot opaque reasoning replay, DO_NOT_TRACK).

---

## 5. Community Momentum & Maturity

**Momentum (issue/PR/release velocity, discussion depth):**
1. **Codex** — highest visible velocity: ~20 PRs, 11 discussions, alpha release, active Show-&-tell ecosystem (150+ tools in "Awesome Codex CLI").
2. **Gemini CLI** — ~50 issues + ~30 PRs; the security-PR wave and P1 tracking signal an actively-maintained production surface.
3. **Copilot CLI** — 6 releases/day shows internal velocity, but low external contribution; issue backlog dominates.
4. **Claude Code** — highest single-issue engagement in the entire dataset (#18435 at 1,111 👍), but very low PR throughput; a "loud users, quiet contributors" pattern.
5. **Pi** — broad contributor activity from a small number of dedicated names (`petrroll`), stable and disciplined; strong provider-fix throughput.
6. **Qwen Code** — CI-noise-dominated; feature velocity present (v1.0.0-preview.2 with Qwen4-Max), but triage overhead is high.
7. **OpenCode** — active core refactoring, but skew toward internal stability work over user-facing features.

**Maturity:**
- **Most mature operational surfaces:** Codex (TUI polish), Copilot CLI (policy controls), Claude Code (plugin API depth).
- **Least mature:** OpenCode (destructive-command guardrails, session migration), Pi (Windows terminal state), Qwen Code (CI stability).
- **Most user-trusted data paths:** Gemini CLI is actively closing its trust gaps; Qwen Code has two **unresolved P1 security reports** (#18379 approval-mode bypass, #18165 plaintext API keys) that materially lag others on trust posture.

---

## 6. Trend Signals

Six industry-level signals emerged from this window, each with actionable reference value:

**1. Prompt-cache economics is now a first-class engineering problem.**
Across Claude Code (#112264, #101755) and Pi (#12316, #11127), cache invalidation and warming are being treated as correctness-and-cost bugs, not micro-optimizations. *Implication:* vendors that expose supported cache-lifecycle primitives (not just warm-window hints) will win heavy users.

**2. "Silent failure" is the new P0 class of bug.**
Claude Code (silent compaction, schema loss), OpenCode (plugin hook silently stops firing, #66299), Copilot CLI (silently ignored `.instructions.md`/`applyTo`, #5440), and Pi (silent `models.json` catalog loss, #12523) all saw trust-eroding silent failures. *Implication:* observability — surfaced errors, trajectory visibility — is becoming a competitive differentiator, especially for team deployments.

**3. Cross-tool memory portability is emerging organically.**
The Codex community is building MCP servers that read Claude Code's memory format (#58220). *Implication:* the first vendor to standardize a portable agent-memory schema gains a network effect; expect competitive posturing here within 2–3 quarters.

**4. Windows and enterprise-managed environments remain second-class.**
Codex (Nov 21 regression wave), Copilot CLI (ConstrainedLanguage, GHE.com-only auth), Pi (mouse/Kitty terminal leakage), Claude Code (VS Code rename ENOENT), and OpenCode (drive wipe, Ctrl+C failure) all report Windows-specific breakage at high volume. *Implication:* Windows enterprise deployments are the largest underserved market in the category.

**5. Trust boundaries under agent control are increasingly enforced at the tool-approval layer.**
Gemini CLI's 5 security PRs (SSRF redirects, MCP OAuth origin binding, stale tool approvals, telemetry redirection) plus Copilot CLI's sandbox allowlist work (#5580) and Qwen Code's approval-mode bypass (#18379) all target the same surface: *what can a trusted workspace actually authorize?* *Implication:* security reviewers should expect — and demand — origin-bound credentials and approval-shape (not just approval-name) matching.

**6. Destructive-command guardrails are being requested by users, not just vendors.**
OpenCode's drive-wipe (#66449), Pi's `local-decider` extension (#12559) that fronts tool calls with a local model to catch `rm -rf`/force-push, and Gemini CLI's request to discourage destructive commands (#22672) form a coherent demand. *Implication:* a "pre-execution policy layer" is becoming a buyer requirement — this is the most likely next major feature category across all CLIs.

**7. CI/test flakiness is becoming a community-experience tax.**
Qwen Code's issue feed is dominated by bot-filed main-branch failures (multiple with 50+ comments), and shared ARM64 runner `ERR_NETWORK_CHANGED` storms (#18394) fail unrelated PRs. *Implication:* for repos relying on self-hosted CI, infrastructure reliability is now a contributor-retention issue, not just an ops cost.

---

*Report compiled from seven community digests dated 2026-11-26. Issue/PR counts reflect the sampled data disclosed in each source digest; where upstream disables Issues, PRs, or Discussions, the corresponding cells are marked accordingly rather than as inactive.*

---

## Per-Tool Reports

<details>
<summary><strong>Claude Code</strong> — <a href="https://github.com/anthropics/claude-code">anthropics/claude-code</a></summary>

## Claude Code Skills Highlights

> Source: [anthropics/skills](https://github.com/anthropics/skills)

# Claude Code Skills — Community Highlights Report
*Data as of 2026-11-26 | Source: [github.com/anthropics/skills](https://github.com/anthropics/skills)*

---

## 1. Top Skills Ranking (Most-Discussed PRs)

| # | Skill / PR | Functionality | Discussion Highlights | Status |
|---|-----------|---------------|----------------------|--------|
| 1 | [**mcp-builder fix** #1742](https://github.com/anthropics/skills/pull/1742) | Repairs MCP connection script for `mcp>=2.0.0` — renamed `streamable_http_client` import and custom header handling | Addresses breaking API changes in MCP SDK v2; critical for anyone building MCP servers | OPEN |
| 2 | [**skill-creator fix** #1298](https://github.com/anthropics/skills/pull/1298) | Isolates trigger evals; fixes Windows subprocess handling and runtime failure scoring | Fixes false-negative trigger rates that silently corrupt skill optimization | OPEN |
| 3 | [**notion-spec-to-implementation + quantitative-resume-auditor** #1245](https://github.com/anthropics/skills/pull/1245) | Converts Notion specs into implementation tasks; audits resumes quantitatively | Two-in-one PR combining a PM workflow skill with a niche HR/recruiting skill | OPEN |
| 4 | [**webapp-testing security fix** #1980](https://github.com/anthropics/skills/pull/1980) | Removes `shell=True` from `with_server.py` to close a command-injection vector (CWE-78) | Security hardening of an existing bundled skill | OPEN |
| 5 | [**docx timeout fix** #1792](https://github.com/anthropics/skills/pull/1792) | Reports LibreOffice timeouts as errors and verifies revision marks are actually removed | Improves reliability of the `accept_changes.py` docx pipeline | OPEN |
| 6 | [**proofcore-contract-auditor** #1771](https://github.com/anthropics/skills/pull/1771) | Static analysis of Solidity/Rust contracts with Merkle-proof anchoring to TON blockchain | Novel Web3 vertical; zero-storage audit proofs | OPEN |
| 7 | [**md2video-audio** #1703](https://github.com/anthropics/skills/pull/1703) | Compiles Markdown → Marp slides → MP4 with realistic voiceover | Zero-cost media generation pipeline | OPEN |
| 8 | [**pyxel retro-game skill** #525](https://github.com/anthropics/skills/pull/525) | Guides creation, headless debugging, and frame inspection of Pyxel retro games | Long-running PR (since March) with sustained updates | OPEN |

> Note: Comment counts are unavailable in the source data; ranking reflects recency, update frequency, and topical weight.

---

## 2. Community Demand Trends (from Issues)

- **Trust & namespace security** — [Issue #492](https://github.com/anthropics/skills/issues/492) (46 comments, top issue): community skills published under the `anthropic/` namespace impersonate official skills, creating a permission-escalation trust boundary. **Highest-engagement issue in the repo.**
- **Org-wide skill sharing** — [Issue #228](https://github.com/anthropics/skills/issues/228) (17 comments, 8 👍): users want a shared skill library / direct share links instead of Slack + manual upload.
- **Skill trigger/eval reliability** — [Issue #556](https://github.com/anthropics/skills/issues/556) (13 comments, 7 👍) and [Issue #1352](https://github.com/anthropics/skills/issues/1352): `run_eval.py` reports 0% trigger rates, especially with parallel workers — a systemic tooling defect.
- **Context-window efficiency** — [Issue #1487](https://github.com/anthropics/skills/issues/1487): `claude-api` skill eagerly injects ~156k tokens in one call, exhausting context. Demand for lazy/on-demand skill loading.
- **Agent quality & governance** — [Issue #1385](https://github.com/anthropics/skills/issues/1385) (Reasoning Quality Gate Pipeline) and [Issue #412](https://github.com/anthropics/skills/issues/412) (agent-governance: policy enforcement, threat detection, audit trails).
- **Memory compaction** — [Issue #1329](https://github.com/anthropics/skills/issues/1329): symbolic notation to shrink long-running agent state.
- **Account/workspace durability** — [Issue #1143](https://github.com/anthropics/skills/issues/1143) (20 👍, highest-upvoted): email change to prevent workspace data loss.

**Distilled directions:** skill *governance/security*, *evaluation tooling correctness*, *context economy*, and *agent lifecycle quality gates* dominate over pure feature requests.

---

## 3. High-Potential Pending Skills (Active PRs, Not Yet Merged)

| Skill | PR | Why It May Land Soon |
|-------|----|--------------------|
| mcp-builder v2 compat | [#1742](https://github.com/anthropics/skills/pull/1742) | Fixes a real breaking change; updated through Oct |
| skill-creator eval isolation | [#1298](https://github.com/anthropics/skills/pull/1298) | Directly resolves Issue #556/#1352 class of bugs |
| skill-creator YAML frontmatter parser | [#1997](https://github.com/anthropics/skills/pull/1997) | Correctness fix for eval metadata |
| skill-creator direct execution | [#1681](https://github.com/anthropics/skills/pull/1681) | Fixes `ModuleNotFoundError` on standalone run |
| xlsx external-link resolution | [#2019](https://github.com/anthropics/skills/pull/2019) | Fixes #2013 false negatives in `recalc.py` |
| webapp-testing element discovery | [#1976](https://github.com/anthropics/skills/pull/1976) | Small, clean fix for textarea/select reporting |
| algorithmic-art wrapAround | [#1977](https://github.com/anthropics/skills/pull/1977) | One-line modulo fix; fixes #1897 |
| pptx thumbnail `--cols` validation | [#1975](https://github.com/anthropics/skills/pull/1975) | Early argparse rejection instead of late crash |
| document-typography | [#514](https://github.com/anthropics/skills/pull/514) | Prevents orphan/widow/numbering defects in generated docs |
| scnet-hpc | [#1615](https://github.com/anthropics/skills/pull/1615) | Slurm/SSH HPC cluster operations skill |

**Pattern:** the pending queue is dominated by *correctness and security patches to existing bundled skills* (skill-creator, docx, xlsx, pptx, webapp-testing) rather than brand-new capabilities — a sign the ecosystem is maturing from "add more skills" to "make existing skills trustworthy."

---

## 4. Skills Ecosystem Insight

> **The community's most concentrated demand is not for more Skills, but for a trustworthy, correctly-evaluated, and context-efficient Skill platform** — with namespace/trust-boundary security ([#492](https://github.com/anthropics/skills/issues/492)) and broken trigger-evaluation tooling ([#556](https://github.com/anthropics/skills/issues/556), [#1352](https://github.com/anthropics/skills/issues/1352)) as the two loudest signals.

---

*Report generated for the Claude Code ecosystem. All links point to github.com/anthropics/skills.*

---

# Claude Code Community Digest — 2026-11-26

## 1. Today's Highlights

No new releases landed in the last 24 hours, but the issue tracker stayed active with 50 updates. The dominant themes were **cost/cache efficiency** (prompt-cache invalidation on resume, cache pre-warm plugin APIs, config-skill schema bloat) and **agentic reliability** (subagent write restrictions, silent compaction, tool-schema loss after compaction). The long-running "multiple accounts" request (#18435) remains the community's most-upvoted issue at 1,111 👍 and 256 comments. Two community PRs attempting to open-source the CLI via the shipped source map continue to sit open.

## 2. Releases

No new releases in the last 24h.

## 3. Hot Issues

1. **[#18435](https://github.com/anthropics/claude-code/issues/18435)** — *[FEATURE] Multiple Claude accounts in Desktop with easy switching* (OPEN, 256 comments, 1,111 👍). By far the highest-engagement issue in the dataset; multi-account/profile switching is a top community demand for the Desktop app.

2. **[#40043](https://github.com/anthropics/claude-code/issues/40043)** — *Allow removal of local folders from a Cowork project's context* (OPEN, 34 comments, 109 👍). Users report local folders get "stuck" in Cowork context; directly impacts privacy and context hygiene.

3. **[#96326](https://github.com/anthropics/claude-code/issues/96326)** — *Replies drift into English after reading English tool output despite CLAUDE.md Japanese rule* (OPEN, 26 comments, 42 👍). A real-world agentic-session failure: language instructions don't survive tool output. Relevant to anyone relying on `CLAUDE.md` for hard constraints.

4. **[#44657](https://github.com/anthropics/claude-code/issues/44657)** — *Subagent Write tool rejects .md files named "report"/"summary"/"findings"/"analysis"* (OPEN, 16 comments, 35 👍). A hard-coded heuristic with no opt-out; breaks legitimate subagent workflows and is hard to discover.

5. **[#107077](https://github.com/anthropics/claude-code/issues/107077)** — *Cowork cloud sessions launch in "deprecated mode" (tool server only); plugin hooks and slash commands never run* (OPEN, 15 comments). Nondeterministic environment selection makes plugin behavior unpredictable — a serious reproducibility problem for plugin authors.

6. **[#112264](https://github.com/anthropics/claude-code/issues/112264)** — *Event nonces re-minted per-process, so every resume rewrites the prompt cache* (OPEN, has repro, 5 comments). A concrete cost bug: resuming a session invalidates cache from the first affected tool result. High leverage for heavy users.

7. **[#101755](https://github.com/anthropics/claude-code/issues/101755)** — *Plugin API: replay main thread's last request as sent (cache pre-warm)* (OPEN, 5 comments). Plugin authors want a supported way to keep the cache warm during idle periods; complements #112264.

8. **[#112250](https://github.com/anthropics/claude-code/issues/112250)** — *Tools found via tool search lose schemas after compaction; model calls them from memory* (OPEN, has repro, 1 comment). A correctness bug in the tool-search + compaction interaction on Windows (v2.1.328–2.1.332).

9. **[#111999](https://github.com/anthropics/claude-code/issues/111999)** — *MCP tool result: only structuredContent reaches the model; Gmail search_threads loses snippet/date/labelIds/nextPageToken* (OPEN, has repro, regression). A regression in MCP result handling that silently degrades real integrations.

10. **[#112377](https://github.com/anthropics/claude-code/issues/112377)** — *Make explicit that `claude -p` bills ANTHROPIC_API_KEY even when declined in interactive mode* (OPEN, 1 comment). Author re-filed as a feature request after confirming documented behavior; a billing-surprise clarity issue worth tracking.

## 4. Key PR Progress

Only two PRs were updated in the last 24h, both community attempts to open-source the CLI:

1. **[#41518](https://github.com/anthropics/claude-code/pull/41518)** — *Fully Open Source Claude Code* (OPEN). Extracts 1,906 TypeScript files from the 57MB `cli.js.map` in the npm package, adds a Bun bundler config with `bun:bundle` shim and `MACRO.*` defines; reportedly builds and runs `--version`/`--help`.

2. **[#41447](https://github.com/anthropics/claude-code/pull/41447)** — *feat: open source claude code ✨* (OPEN). A second, overlapping open-sourcing attempt; closes a batch of long-standing issues (#59, #456, #2846, #22002, #41434).

*Note: no other PRs were updated in the window, so a 10-item list isn't possible.*

## 5. Hot Discussions

No discussion data was provided; section omitted.

## 6. Feature Request Trends

- **Account & profile management** — Multi-account switching in Desktop (#18435) is the clear leader; users want first-class profile isolation.
- **Plugin API surface expansion** — Cache pre-warm (#101755), pre-compaction notice/config (#112388), model-request attribution for tool calls (#112390), and cache-edit compaction hooks (#112380). Plugin authors are pushing for deeper, lower-level hooks.
- **Cost & cache control** — Cache invalidation on resume (#112264), skill schema bloat (#94484), and billing transparency for `claude -p` (#112377).
- **Headless/programmatic use** — Structured `AskUserQuestion` callback in `-p`/stream-json mode (#112385) and a native interactive PTY tool (#112386).
- **Context management** — Removing local folders from Cowork projects (#40043) and predictable compaction behavior (#112372, #112388).

## 7. Developer Pain Points

- **Prompt-cache fragility**: per-process nonce re-minting on resume (#112264) and eager schema dumps from bundled skills (#94484) silently inflate cost; plugin authors lack supported cache-keepalive primitives.
- **Compaction side effects**: tool schemas lost after compaction (#112250), silent auto-compaction in Projects beta (#112372), and no notice/config before idle compaction (#112388).
- **Hard-coded heuristics without opt-outs**: subagent `.md` filename blocking (#44657) and an `rm` safety check firing on commands with no `rm` (#112389).
- **Instruction-following drift**: language rules ignored after English tool output (#96326), ignored briefs and scope creep on long tasks (#112376, #112387).
- **Platform-specific bugs**: macOS timeouts counting sleep time (#112366), Desktop git polling forcing full tree scans via `-c core.fsmonitor=` (#112392), VS Code session rename ENOENT with `CLAUDE_CONFIG_DIR` (#112381).
- **MCP integration regressions**: structuredContent-only results (#111999) and OAuth dropping the RFC 8707 `resource` parameter (#112062).

</details>

<details>
<summary><strong>OpenAI Codex</strong> — <a href="https://github.com/openai/codex">openai/codex</a></summary>

# OpenAI Codex Community Digest — 2026-11-26

## 1. Today's Highlights

The Codex ecosystem is contending with a cluster of Windows-specific regressions introduced by the Nov 21 update, which removed permission/execution-location selectors and broke network/sandbox configuration for Plus and Pro users. Alongside these regressions, the TUI team shipped a large batch of polish PRs (sidebar controls, statusline elements, session error surfacing), and the community continued to push for cross-tool memory portability and Unix signal semantics in tool results.

---

## 2. Releases

- **rust-v0.174.0-alpha.6** — Pre-release alpha tagged today; no detailed changelog provided. Track: [openai/codex releases](https://github.com/openai/codex/releases)

---

## 3. Hot Issues

1. **[#62943](https://github.com/openai/codex/issues/62943)** — *[Windows][ChatGPT Work] Nov 21 update regression: permission/execution-location selectors lost, Max reasoning effort disappears* (33 comments, 👍16). The highest-engagement issue today. Plus users report newly created conversations drop core UI controls — high impact on Windows workflow.

2. **[#53278](https://github.com/openai/codex/issues/53278)** — *Codex Desktop on Windows applies `networkAccess=false` despite network access being enabled* (28 comments). Long-running (opened Oct 12) sandbox bug where the desktop app silently overrides user network settings.

3. **[#62234](https://github.com/openai/codex/issues/62234)** — *macOS: Bottom panel settings disappear and terminal placement forced to the right after update* (25 comments, 👍24, now CLOSED). Highest 👍 in the batch; a good signal that macOS layout regressions are being resolved.

4. **[#32248](https://github.com/openai/codex/issues/32248)** — *Cannot finish Windows setup to continue* (22 comments, 👍8). Setup-blocking authentication bug persisting since July — onboarding friction remains a top complaint.

5. **[#62907](https://github.com/openai/codex/issues/62907)** — *[Windows/ChatGPT Work] Local execution selector disappeared after Nov 21 update; SSH still blocked with Full access* (16 comments, 👍20). Duplicate/related to #62943 but with a concrete SSH-blocked reproduction — reinforces the Nov 21 regression pattern.

6. **[#49162](https://github.com/openai/codex/issues/49162)** — *Linux regression in 0.158.0: middle-click paste in TUI stopped working* (9 comments). Persistent Linux TUI clipboard regression.

7. **[#14099](https://github.com/openai/codex/issues/14099)** — *Pasting is really slow on Codex CLI on Windows* (8 comments). Very old (March) but still active — long-tail Windows perf issue.

8. **[#63267](https://github.com/openai/codex/issues/63267)** — *macOS desktop dictation times out after 10s with AirPods despite receiving audio frames* (8 comments). New accessibility/UX regression affecting voice input.

9. **[#63466](https://github.com/openai/codex/issues/63466)** — *GPT-6.2 Astra and Sol — behavioral regressions, unreliable execution, excessive supervision* (7 comments, 👍4). Model-behavior complaint, not just a UI bug — worth tracking if reports accumulate.

10. **[#60484](https://github.com/openai/codex/issues/60484)** — *Windows Desktop hangs forever on startup: sync WSL PATH probe has no timeout on main thread* (5 comments). A main-thread blocking call — clear root cause and high impact for WSL users.

Also notable: **[#64043](https://github.com/openai/codex/issues/64043)** (Windows → iOS Remote: missing local conversations), **[#63913](https://github.com/openai/codex/issues/63913)** (Windows app hangs on every launch), **[#57650](https://github.com/openai/codex/issues/57650)** (4 concurrent sessions disconnect — now closed).

---

## 4. Key PR Progress

The day is dominated by TUI infrastructure and polish from the `copyberry[bot]` series.

1. **[#64058](https://github.com/openai/codex/pull/64058)** — Fix Unicode fuzzy matching and slash popup activation (Greek sigma variant mismatch; slash popup showing for non-displayed fuzzy matches).
2. **[#64055](https://github.com/openai/codex/pull/64055)** — Add mouse controls (`›`/`‹`) to hide/restore the TUI sidebar, so hiding it via keyboard is no longer a dead end.
3. **[#64054](https://github.com/openai/codex/pull/64054)** — Refactor TUI sidebar chooser input handling into a dedicated module.
4. **[#64053](https://github.com/openai/codex/pull/64053)** — Extract TUI sidebar input routing (hit testing, mouse press tracking) into its own module.
5. **[#64052](https://github.com/openai/codex/pull/64052)** — Honor per-executor plugin settings: disabling one installation leaves others available.
6. **[#64026](https://github.com/openai/codex/pull/64026)** — Correct subagent wait status in TUI ("Waiting"/"Finished" now reflect failure and interruption).
7. **[#64024](https://github.com/openai/codex/pull/64024)** — Show shortcut hints for the focused pane; hide sidebar hints when conversation has keyboard focus.
8. **[#64023](https://github.com/openai/codex/pull/64023)** — Support numeric MCP elicitation fields in the TUI (previously fell back to a generic approval prompt).
9. **[#64013](https://github.com/openai/codex/pull/64013)** — Preserve native exit codes in Windows PowerShell `PreToolUse` hooks (fixes `-Command` mapping exit code 2 → 1).
10. **[#64011](https://github.com/openai/codex/pull/64011)** — Clean up abandoned MCP sessions during Streamable HTTP recovery to avoid leaked server capacity.

Also worth noting: statusline customization trio **[#64010](https://github.com/openai/codex/pull/64010)** (inline badges), **[#64009](https://github.com/openai/codex/pull/64009)** (flexible spacers), **[#64008](https://github.com/openai/codex/pull/64008)** (directional `box`), and **[#64007](https://github.com/openai/codex/pull/64007)** (`maxLines` for text blocks).

---

## 5. Hot Discussions

### Ideas
- **[#63915](https://github.com/openai/codex/discussions/63915)** — *What if spare GPU time could earn Codex credits?* — Distributed compute incentive proposal, building on the earlier Codex Community Compute thread.
- **[#63850](https://github.com/openai/codex/discussions/63850)** — *Surface Unix signal-termination info on shell tool results* — Distinguish SIGKILL/SIGTERM from voluntary exit 137/143; motivated by reliability benchmarks on `@openai/codex@0.172.0`.

### Q&A
- **[#22829](https://github.com/openai/codex/discussions/22829)** — *Why does the VS Code extension show all previous sessions instead of just the current project's?* (👍5) — Long-standing complaint about session scoping and generic naming.
- **[#56409](https://github.com/openai/codex/discussions/56409)** — *exec_command / write_stdin: documented guarantees around capture, process termination, and total duration?* — Request for official technical spec of the local execution manager.

### Show and tell
- **[#16329](https://github.com/openai/codex/discussions/16329)** — *Awesome Codex CLI*: curated list of 150+ ecosystem tools (subagents, skills, plugins, MCP servers). 15 comments — the community's de facto index.
- **[#63534](https://github.com/openai/codex/discussions/63534)** — *Memlayer v0.3.1*: reviewable, revisable project memory for Codex with source citations beside recalled rules.
- **[#58220](https://github.com/openai/codex/discussions/58220)** — *recall*: MCP server with zero dependencies that lets Codex read Claude Code's `~/.claude/projects/<project>/memory/` files — cross-tool memory portability.
- **[#63395](https://github.com/openai/codex/discussions/63395)** — *Codex Desk*: local workbench for native Codex projects and sessions with reviewed provider handoffs.
- **[#63921](https://github.com/openai/codex/discussions/63921)** — Workflow for playtesting a browser-game build before sharing its link (open-source Codex publishing plugin).
- **[#63884](https://github.com/openai/codex/discussions/63884)** — Using Codex to test a *plausible wrong answer* in a ModuMath geometry lesson.

---

## 6. Feature Request Trends

- **Session organization & scoping** — Cross-project session bleed in VS Code (#22829); searchable topic/date index for continuous dot conversations (#51507); remote-hosted session visibility (#64043). Users want project-scoped, nameable, searchable sessions.
- **Cross-tool memory portability** — Multiple Show & tells (Memlayer #63534, recall #58220) target the same gap: memory/decisions should survive across Claude Code ↔ Codex and across sessions.
- **Richer, composable TUI/statusline** — Badges, spacers, directional boxes, and `maxLines` in PRs #64007–#64010 signal strong demand for a proper layout system.
- **Signal-aware tool results** — #63850 proposes surfacing SIGKILL/SIGTERM explicitly so agents can distinguish kills from voluntary exits.
- **Distributed compute incentives** — #63915 revives the GPU-for-credits idea.
- **Documented execution semantics** — #56409 asks for an official spec of `exec_command`/`write_stdin` guarantees.

---

## 7. Developer Pain Points

- **Windows update regressions (dominant theme today)** — Nov 21 update removed permission/execution-location selectors and Max reasoning (#62943, #62907); #53278 silently overrides network sandbox settings; #60484 blocks startup on a synchronous WSL PATH probe; #63913 and #64064 report full app hangs at launch. Multiple high-👍 issues converge on Windows desktop.
- **TUI clipboard/selection fragmentation** — Middle-click paste broken on Linux (#49162), mouse-selection copy silently fails in Ghostty (#59608), `/copy` inconsistency in VS Code (#53543), image paste fails on GNOME Wayland (#24908) and in CLI generally (#60410).
- **Session lifecycle & connectivity** — Concurrent sessions disconnect without reconnecting (#57650), TUI hangs on "Waiting for startup" after WebSocket reset with no surfaced error (#59559), keyboard input stalls when `account/rateLimits/read` times out (#58259), and whitespace-only model responses leave the turn active indefinitely (#60294).
- **Model behavior reliability** — #63466 flags regressions in GPT-6.2 Astra and Sol; combined with "waiting forever" and "queued but never sent" bugs, agents become harder to trust in long sessions.
- **Unicode & text rendering edge cases** — Wrong highlight indices with combining accents and ZWJ emoji (#60588), Greek sigma mismatch in fuzzy matching (#64058), garbled characters in JetBrains terminal on Windows (#52003).
- **Auth/onboarding friction** — Windows setup cannot complete (#32248); auth and payment transparency complaints (#63956 in Discussions).

---

*Generated from github.com/openai/codex activity on 2026-11-26. Issue/PR counts reflect the sample provided (top 30 issues, top 20 PRs, 11 discussions by activity).*

</details>

<details>
<summary><strong>Gemini CLI</strong> — <a href="https://github.com/google-gemini/gemini-cli">google-gemini/gemini-cli</a></summary>

# Gemini CLI Community Digest — 2026-11-26

## 1. Today's Highlights

No new releases landed in the last 24 hours, but the project remains highly active: 50 issues and 30 PRs were updated today, with a clear cluster of agent-reliability work (subagent termination semantics, browser agent config, ACP parity) and a wave of security-hardening PRs around MCP OAuth, web-fetch SSRF, and telemetry configuration. The most-discussed issue (#22323, 14 comments) centers on a subagent falsely reporting goal success after hitting MAX_TURNS — a signal that agent observability and correctness remain top-of-mind for maintainers and users alike.

## 2. Releases

No releases in the last 24 hours.

## 3. Hot Issues

1. **[#22323](https://github.com/google-gemini/gemini-cli/issues/22323)** — *Subagent recovery after MAX_TURNS reported as GOAL success* (p1, 14 comments, 2 👍). The `codebase_investigator` subagent claims `status: "success"` / `Termination Reason: "GOAL"` even when it hit the turn cap before doing any analysis. This masks interruptions, making downstream orchestration unreliable — the highest-engagement issue today.

2. **[#19873](https://github.com/google-gemini/gemini-cli/issues/19873)** — *Leverage model's bash affinity via Zero-Dependency OS Sandboxing* (p2, 9 comments, 1 👍). Proposes letting Gemini 3 freely chain POSIX tools (`grep`, `sed`, `awk`) inside an OS-level sandbox, aligning agent execution with the model's native training. Large-effort enhancement with strong architectural implications.

3. **[#21409](https://github.com/google-gemini/gemini-cli/issues/21409)** — *Generalist agent hangs* (p1, 8 comments, 8 👍). Users report the generalist subagent hanging indefinitely on trivial tasks (e.g., folder creation), sometimes for up to an hour. The high 👍 count (highest in today's set) shows broad user impact; working around it by disabling subagent deferral.

4. **[#22745](https://github.com/google-gemini/gemini-cli/issues/22745)** — *Assess AST-aware file reads, search, and mapping* (p2, 7 comments). An EPIC exploring whether AST-aware tools reduce misaligned reads, cut turns, and shrink token noise. Related spin-offs: [#22746](https://github.com/google-gemini/gemini-cli/issues/22746) and [#22747](https://github.com/google-gemini/gemini-cli/issues/22747).

5. **[#21968](https://github.com/google-gemini/gemini-cli/issues/21968)** — *Gemini does not use skills and sub-agents enough* (p2, 7 comments). Anecdotal but resonant: even with well-described `gradle`/`git` skills installed, the model won't invoke them unless explicitly told. Points at gaps in skill-trigger prompting and agent routing.

6. **[#22267](https://github.com/google-gemini/gemini-cli/issues/22267)** — *Browser Agent ignores settings.json overrides* (p2, 5 comments). The `AgentRegistry` reads merged settings, but the Browser Agent bypasses them entirely (e.g., `maxTurns`). A configuration-coherence bug with a clear repro.

7. **[#21983](https://github.com/google-gemini/gemini-cli/issues/21983)** — *Browser subagent fails in Wayland* (p1, 4 comments, 1 👍). Linux/Wayland users hit termination failures in the browser subagent, limiting adoption on modern Linux desktops.

8. **[#24246](https://github.com/google-gemini/gemini-cli/issues/24246)** — *400 error with >128 tools* (p2, 3 comments). The CLI surfaces a hard API failure when tool count balloons; users expect smarter auto-scoping of enabled tools. A scaling ceiling for MCP-heavy setups.

9. **[#22672](https://github.com/google-gemini/gemini-cli/issues/22672)** — *Agent should stop/discourage destructive behavior* (p2, 3 comments, 1 👍). The model occasionally reaches for `git reset --hard` or `--force` when safer alternatives exist. Directly tied to the trust/safety posture of agentic CLI usage.

10. **[#22741](https://github.com/google-gemini/gemini-cli/issues/22741)** — *Allow local agents to be backgroundable* (p3, 2 👍). Request to send local subagents to the background with Ctrl+B, since agents are frequently used for non-blocking exploration/build/lint tasks. Small ask, clear UX win.

## 4. Key PR Progress

1. **[#30353](https://github.com/google-gemini/gemini-cli/pull/30353)** — *(acp)* Standardize token usage tracking and quota metadata. Preserves `PromptResponse.usage` on cancelled turns and fixes quota reporting discrepancies (#24280, #27985) — important for ACP clients relying on accurate billing/telemetry.

2. **[#30477](https://github.com/google-gemini/gemini-cli/pull/30477)** — *(web-fetch)* Prevent SSRF via DNS hostnames and redirects. Revives #27739: a URL passing the initial private-IP check could still redirect through a proxy to loopback/link-local targets. A meaningful security fix.

3. **[#30476](https://github.com/google-gemini/gemini-cli/pull/30476)** — *(cli)* Stop trusted-workspace settings from redirecting telemetry export. A cloned repo trusted with one click could otherwise set `telemetry.otlpEndpoint`/`outfile` and exfiltrate telemetry — a notable supply-chain-adjacent hardening.

4. **[#30478](https://github.com/google-gemini/gemini-cli/pull/30478)** — Bind MCP tool approvals to the tool definition they approved. `ProceedAlwaysServer`/`ProceedAlwaysTool` was matched by name only, so `tools/list_changed` re-registration silently inherited stale approvals. Fixes a subtle permission-escalation vector.

5. **[#30475](https://github.com/google-gemini/gemini-cli/pull/30475)** — Bind stored MCP OAuth tokens to the issuing server URL. When a server URL is repointed, the old token is now withheld and re-auth is requested instead of the token silently replaying to a new origin.

6. **[#30246](https://github.com/google-gemini/gemini-cli/pull/30246)** — *(core)* Quote IDE CLI path for `cmd.exe` in `/ide install` on Windows. Fixes the common failure when VS Code is installed under a path containing spaces.

7. **[#30230](https://github.com/google-gemini/gemini-cli/pull/30230)** — *(core)* Keep synthetic binary ack so injected audio/video stays in its own turn. Fixes 400 "Requests ending with a model turn are not supported" for `read_file` on media under Gemini 3 + Code Assist.

8. **[#30362](https://github.com/google-gemini/gemini-cli/pull/30362)** — *(acp)* Report stopped agent reasons. Handles `AgentExecutionStopped` and forwards the reason as an assistant message instead of silently ending with an empty turn (fixes #30199).

9. **[#30236](https://github.com/google-gemini/gemini-cli/pull/30236)** — *(acp)* Run parallelizable tool calls together like the CLI scheduler. ACP previously awaited each call serially; four `sleep 3` shell commands took 12s instead of ~3s.

10. **[#30454](https://github.com/google-gemini/gemini-cli/pull/30454)** — *(core)* Enforce origin consistency and display endpoint origin in MCP OAuth flow. Implements RFC 8414 §3.3 issuer matching and surfaces the authorization origin to the user.

## 5. Hot Discussions

No discussion data was provided for this window.

## 6. Feature Request Trends

- **Agent/subagent reliability & observability**: Accurate termination reasons (#22323), visible subagent trajectories via `/chat share` (#22598), subagent context in bug reports (#21763), and backgroundable agents (#22741) dominate the request backlog.
- **Skills & routing intelligence**: Users want the model to autonomously invoke skills and subagents (#21968) and to be more self-aware about its own flags/hotkeys (#21432).
- **Context/token efficiency**: AST-aware reads and search (#22745, #22746, #22747), "Tactful Extraction" surgical reads (#19561), and persistent file-based task tracking to replace `WriteToDo` (#18836).
- **Braver-but-safer execution**: Zero-dependency OS sandboxing for bash-style chaining (#19873) balanced against discouraging destructive commands (#22672), plus better temp-file hygiene (#23571).
- **Configuration & multi-agent coordination**: Per-workspace policies (#18397), subagent discovery via `settings.json` (#18285), and shared memory / parallel subagent collaboration (#18287).

## 7. Developer Pain Points

- **Silent failures and false success signals**: Agents reporting `GOAL` success while actually interrupted (#22323) and ACP turns ending empty without a stop reason erode trust in automation.
- **Hangs and stalls**: The generalist agent hangs indefinitely (#21409) and the CLI stalls at interactive prompts (e.g., Vite scaffolding, #22465) — both require manual intervention and waste turns.
- **Configuration being ignored**: Browser Agent bypassing `settings.json` (#22267) and symlinked agent files not being recognized (#20079) frustrate users who expect configuration to "just work."
- **Tool/scale limits**: The >128-tool 400 error (#24246) and the ~36.6k-token baseline per turn (#19561) create ceilings that heavy MCP users hit quickly.
- **Platform-specific breakage**: Wayland browser subagent failures (#21983) and Windows path-quoting issues in `/ide install` (#30246) show cross-platform polish is still lagging.
- **Security & trust exposure**: Multiple PRs today (SSRF redirects, MCP OAuth origin binding, telemetry redirection, stale tool approvals) reflect a recurring class of issues where trusting a workspace or repointing a server can silently expand what the agent — and its credentials — will do.

</details>

<details>
<summary><strong>GitHub Copilot CLI</strong> — <a href="https://github.com/github/copilot-cli">github/copilot-cli</a></summary>

# GitHub Copilot CLI Community Digest — 2026-11-26

## 1. Today's Highlights

A busy 24 hours for the Copilot CLI repo: **four releases shipped** (up to v1.0.117-2), headlined by explicit tool exposure for custom agents, a smarter `/model` picker that surfaces service notices and retiring models, and a build-time JSON Schema for extension manifests. On the issue tracker, MCP protocol negotiation bugs continue to dominate (several opened *and* closed today), while community demand concentrates around checkpoint ref pollution, multi-root workspace support, and plugin/skill plumbing gaps. Notably, a new `-p` mode regression (v1.0.115+) is breaking automation pipelines for multiple users.

---

## 2. Releases

**v1.0.117-2**
- **Fixed:** `copilot help extensions` no longer claims your own and plugin extensions load under `-p`; extensions now start there only if pre-approved (`--allow-all-tools`, `--yolo`, or a saved approval).
- **Fixed:** Built-in searches no longer fail when Copilot sends flags such as `line`.

**v1.0.117-1**
- **Improved:** The `/model` picker now shows service notices and marks retiring models, surfacing warnings before selection.
- **Fixed:** Errors are shown instead of silently switching providers when a repo pins a model to an unavailable provider.
- **Fixed:** Session checkpoint announcements only fire after a new checkpoint actually exists.

**v1.0.117-0**
- **Added:** Explicit tool exposure, letting custom agents opt in to specific tools.
- **Fixed:** Connected Copilot Connectors now load when resuming a CLI session mid–GitHub sign-in; background agents can continue conversations after CLI restart + session resume.

**v1.0.116 (2026-11-25)**
- Build-time JSON Schema for extension manifests; "Jump to latest" in the fullscreen timeline; per-model context size selection in ACP-compatible editors; environment configuration additions.

**v1.0.116-5 / v1.0.116-4**
- **Fixed:** `copilot help parallel-work` no longer references a nonexistent `/fleet` plan-approval flow; ACP shell approval prompts show the actual command, not its description.
- **Added:** JSON Schema for extension manifests (landed in both 116-4 and 116).
- **Fixed:** PowerShell allow rules now honor digits in parameter names (`-n1`, `-ExpectedSha256`) without requiring full-script approval; folder trust prompt closes immediately on "Yes".

---

## 3. Hot Issues

1. **[#5323 — Add setting to disable agent checkpoint refs (refs/agents/*)](https://github.com/github/copilot-cli/issues/5323)** *(OPEN, 8 comments, 👍6)* — Every agent turn commits to `refs/agents/<session>/checkpoints/turn/N` under the user's git identity, polluting ref-rendering tools. The highest-comment issue today; strong consensus for an opt-out.
2. **[#1826 — Multi-root workspace support via .code-workspace](https://github.com/github/copilot-cli/issues/1826)** *(OPEN, 6 comments, 👍22)* — The CLI ignores `.code-workspace` roots when connected via `/ide`, so instruction files in secondary folders are never loaded. Highest-upvoted open issue in this batch.
3. **[#2073 — Frequent "transient API error, retrying" failures](https://github.com/github/copilot-cli/issues/2073)** *(OPEN, 6 comments, 👍13)* — Long-running reliability complaint spanning months; 13 upvotes signals this is widespread, not environment-specific.
4. **[#4755 — Session wedges permanently when queued message lands at turn end](https://github.com/github/copilot-cli/issues/4755)** *(OPEN, 5 comments)* — Sessions enter an unrecoverable neither-idle-nor-running state; only a process kill recovers. Serious correctness bug for interactive users.
5. **[#2753 — Plugin skills missing from `available_skills` for main agent](https://github.com/github/copilot-cli/issues/2753)** *(OPEN, 5 comments)* — Skills appear in `/skills` UI but are never injected into the system prompt, so agents can't actually invoke them. Core plugin-ecosystem gap.
6. **[#4888 — MCP client sends legacy initialize after successful server/discover](https://github.com/github/copilot-cli/issues/4888)** *(CLOSED, 5 comments)* — Dual-era MCP SDK servers lock to the modern protocol after discovery, then reject the stale legacy `initialize`. Closed today — worth verifying the fix.
7. **[#4683 — PowerShell ConstrainedLanguage: every shell command emits spurious error](https://github.com/github/copilot-cli/issues/4683)** *(OPEN, 4 comments)* — `$host.SetShouldExit()` is blocked under AppLocker/WDAC, breaking every agent shell invocation in managed enterprise environments.
8. **[#5354 — ACP doesn't advertise Copilot Fusion or tier config](https://github.com/github/copilot-cli/issues/5354)** *(OPEN, 3 comments, 👍11)* — Fusion works interactively but ACP clients (e.g., T3 Code) only see "Auto" with no tier selector. High upvote-to-comment ratio = quiet, broad demand.
9. **[#5440 — Agent Plugins 1.0: `.instructions.md` and `applyTo` frontmatter silently ignored](https://github.com/github/copilot-cli/issues/5440)** *(OPEN, 2 comments)* — Plugin spec compliance gap: rules shipped in `com.github.copilot/rules/` are dropped without warning.
10. **[#5574 — `-p` mode fails if agent succeeds but prints no conclusion](https://github.com/github/copilot-cli/issues/5574)** *(OPEN, triage)* — Regression introduced in 1.0.115 that breaks CI automation with a nonzero exit despite task success. Fresh, high-impact for scripted users.

**Also worth watching:** [#5298](https://github.com/github/copilot-cli/issues/5298) (Fusion fails without undocumented `DYNAMIC_AUTO_TIERS`, 👍4, closed), [#5074](https://github.com/github/copilot-cli/issues/5074) (Windows Terminal key-binding modal preselected "Yes" rewrites settings.json on first Enter — closed), [#5491](https://github.com/github/copilot-cli/issues/5491) (marketplace add clones entire repos with no cancellation).

---

## 4. Key PR Progress

Only two PRs were updated in the last 24h, and both are closed devcontainer scaffolding:

1. **[#4316 — Create devcontainer.json](https://github.com/github/copilot-cli/pull/4316)** *(CLOSED)* — Initial dev container definition for contributors.
2. **[#4428 — Add initial devcontainer configuration](https://github.com/github/copilot-cli/pull/4428)** *(CLOSED, "LGTM")* — Follow-up devcontainer config; supersedes/refines #4316.

No feature-bearing PRs landed in this window. The release train (117-x) is clearly being driven through direct commits rather than community PRs — worth noting for contributors hoping to upstream fixes.

---

## 5. Hot Discussions

No Discussions data was provided for this period. Section omitted.

---

## 6. Feature Request Trends

Distilled from the current issue set, the most-requested directions are:

- **Repository hygiene controls** — Opt-outs for agent-generated git refs/commits (#5323), reflecting discomfort with the CLI writing to user repos under the user's own identity.
- **Workspace & context awareness** — Multi-root `.code-workspace` support (#1826), broader instruction-file discovery, and session-scoped prompt history (#5576).
- **Plugin/skill system maturity** — Skills actually reaching the model (#2753), Agent Plugins 1.0 spec compliance (#5440), argumented skill slash commands (#5578), and managed-policy pre-approval for plugin extensions (#5575).
- **Enterprise & managed-environment support** — Managed policy controls for extensions (#5575), GHE.com-only login updater fixes (#5571), Windows ConstrainedLanguage compatibility (#4683), and sandbox allowlist correctness (#5580).
- **Model routing transparency & control** — Fusion availability in ACP (#5354), Fusion routing to local OpenAI-compatible providers (#5581), correct reasoning-effort reporting for Gemini models (#5518), and persistable autopilot limits (#4454).

---

## 7. Developer Pain Points

- **MCP protocol negotiation is still fragile.** Three separate issues today (#4888, #5464, #5222) cover discovery/initialize races, timeout fallbacks rejected with `-32022`, and disabled servers falsely reported as "blocked by policy" with duplicated warnings. This is the single most active bug cluster.
- **Automation/CI breakage.** The `-p` mode regression (#5574) and the updater failing on GHE.com-only auth (#5571) both directly break scripted, headless workflows.
- **Silent failures over clear errors.** Users repeatedly ask for warnings instead of silent drops: silently ignoring malformed marketplace entries (#5582), silently ignoring `.instructions.md`/`applyTo` (#5440), and the provider-switch behavior just fixed in 1.0.117-1.
- **Enterprise/Windows environment friction.** ConstrainedLanguage shell noise (#4683), Windows sandbox TCP allowlist failures (#5580), and managed-policy gaps (#5575) show managed fleets remain a second-class experience.
- **Session state reliability.** Permanent session wedging (#4755), remote session switch hangs with memory growth (#5577), and CloudQueryError blocking `/chronicle standup` despite local data (#3904) erode trust in long-running sessions.
- **Resource-heavy operations without controls.** Marketplace cloning entire repos with no progress or cancellation (#5491) remains an unaddressed UX complaint.

---

*Generated from github.com/github/copilot-cli activity for 2026-11-26. Issue/PR counts: 41 issues updated (30 shown), 2 PRs updated, 6 releases in the last 24h.*

</details>

<details>
<summary><strong>OpenCode</strong> — <a href="https://github.com/anomalyco/opencode">anomalyco/opencode</a></summary>

# OpenCode Community Digest — 2026-11-26

## 1. Today's Highlights

OpenCode v2.4.2 shipped with a GPT-6.2-specific system prompt for Sol/Astra and `gpt-latest` aliases, plus an onboarding fix for the OpenCode Go model picker. The issue tracker is dominated by serious platform-specific regressions: a catastrophic Windows `rd /s /q` drive-wipe via the bash tool, a v1→v2 session migration bug wedging OpenAI Chat sessions, and persistent subagent continuation failures. Meanwhile, PR activity shows heavy core refactoring around scoped fibers, environment gating, and a new `read_terminal` tool.

## 2. Releases

**v2.4.2**
- **GPT-6.2 System Prompt**: GPT-6.2 Sol/Astra and `gpt-latest` aliases now use a system prompt written specifically for GPT-6.2 ([#66297](https://github.com/anomalyco/opencode/pull/66297))
- **OpenCode Go Onboarding Fix**: Model picker now correctly lists OpenCode Go after connection

## 3. Hot Issues

1. **[#64073](https://github.com/anomalyco/opencode/issues/64073) — Restore Foreground Subagent Execution** (OPEN, 30 comments, 👍13)
   High-engagement feature request to bring back foreground subagent execution. The comment count and upvotes suggest strong workflow dependency on the prior behavior.

2. **[#12711](https://github.com/anomalyco/opencode/issues/12711) — Agent Teams: flat teams with named messaging, multi-model support, TUI integration** (CLOSED, 17 comments, 👍24)
   The most-upvoted issue in this window. Proposes parallel, communicating agents instead of the current sequential `task` tool subagents. Closure suggests it's been folded into roadmap planning.

3. **[#33704](https://github.com/anomalyco/opencode/issues/33704) — GUI Options to Edit Custom Providers and Manage Model Lists** (OPEN, 13 comments)
   Persistent demand for GUI-based provider management (LM Studio, Jan AI) instead of config-file editing. Directly tied to ongoing docs PR #66481.

4. **[#50979](https://github.com/anomalyco/opencode/issues/50979) — Session move into empty git repo re-points global project worktree** (OPEN, reproduced, 11 comments)
   Data-integrity-adjacent bug: moving a session silently redirects the `global` project's worktree, making unrelated work unreachable.

5. **[#66299](https://github.com/anomalyco/opencode/issues/66299) — Plugin session prompt hook silently stops firing after re-boot** (CLOSED, 9 comments)
   Silent failure in long-lived serve processes breaks prompt-transforming plugins (e.g., secret redaction) with no error logged. Closed quickly, but a nasty class of bug.

6. **[#66449](https://github.com/anomalyco/opencode/issues/66449) — Windows bash tool `rd /s /q` with escaped quotes deleted a drive root** (CLOSED/pending, 7 comments)
   The most alarming issue today: 270k files lost because `\"` isn't a valid PowerShell escape, causing `cmd` to resolve to drive root. Highlights the danger of unguarded destructive shell commands on Windows.

7. **[#61899](https://github.com/anomalyco/opencode/issues/61899) — Desktop Ctrl+C does not interrupt running process** (OPEN, 7 comments)
   Basic terminal ergonomics broken in the desktop integrated terminal; requires `taskkill /F /PID` to stop dev servers.

8. **[#59293](https://github.com/anomalyco/opencode/issues/59293) — Subagent sessionID continuation always fails with 'Subagent session not found: ses'** (OPEN, 7 comments)
   `sessionID` is always received as the literal string `"ses"`, making subagent conversation continuation impossible. Blocks multi-turn subagent workflows.

9. **[#66389](https://github.com/anomalyco/opencode/issues/66389) — v1→v2 migration marks client-executed tools `executed: true`, wedging OpenAI Chat sessions** (OPEN, 6 comments)
   Every affected session fails on its next turn before any provider call. Migration correctness issue with broad blast radius for v2.3.2 users.

10. **[#66484](https://github.com/anomalyco/opencode/issues/66484) — Questions pop-up too tall, hard to browse chat** (OPEN, 3 comments)
    UI complaint about the question dialog obstructing chat content; asks for a collapsed/compact mode.

## 4. Key PR Progress

1. **[#66503](https://github.com/anomalyco/opencode/pull/66503) — feat(cli): manage session archive state** — Adds `session archive <id>` / unarchive subcommands, closing the long-standing CLI gap in #63518.

2. **[#66509](https://github.com/anomalyco/opencode/pull/66509) — feat(session-ui): flat execute layout and script diffs behind `full_codemode`** — New Code Mode (`execute`) block layout gated behind a server feature flag; builds on #66469.

3. **[#66504](https://github.com/anomalyco/opencode/pull/66504) — fix(core): show keys a model sent when a tool call misses a required key** — Improves diagnostics for the recurring "Missing key" edit-tool failures (#57051) by surfacing the actual arguments sent.

4. **[#66497](https://github.com/anomalyco/opencode/pull/66497) — feat(core): add `read_terminal` tool** — Opt-in, read-only tool exposing screen, cwd, foreground process, and scrollback of the session's persistent terminal.

5. **[#66502](https://github.com/anomalyco/opencode/pull/66502) — refactor(core): scope background fibers and derive InternalPlugin services** — Background fibers in `Shell`, `Watcher`, and `PersistentPty` now stop on teardown; prevents service list drift. No public API changes.

6. **[#66498](https://github.com/anomalyco/opencode/pull/66498) — refactor(core): gate VCS, Snapshot, Worktree, Project on Environment** — Prevents remote workspaces from probing host disk/git; removes inline stubs from `workerd.ts`.

7. **[#66377](https://github.com/anomalyco/opencode/pull/66377) — fix(ai): preserve hosted tool history in Chat replay** — Fixes #57044: Chat Completions no longer rejects assistant history containing provider-executed tool results.

8. **[#65335](https://github.com/anomalyco/opencode/pull/65335) — fix(ai): handle string-valued streaming errors** — Accepts string-valued errors in OpenAI-compatible streaming events and routes them through the existing provider-error classification.

9. **[#66499](https://github.com/anomalyco/opencode/pull/66499) — feat(desktop): first-quit notice + setting to stop service on quit** — Addresses user surprise that quitting Desktop leaves the background service, terminals, and MCP servers running.

10. **[#66506](https://github.com/anomalyco/opencode/pull/66506) — fix(desktop): smooth Windows installer progress bar** — Fixes the NSIS progress bar flickering backwards and adds live phase/size/throughput status.

## 5. Hot Discussions

No discussion data was provided in the source dataset; this section is omitted.

## 6. Feature Request Trends

- **Multi-agent orchestration**: Parallel, communicating agents with named messaging and multi-model support (#12711, 👍24) — the clearest directional signal.
- **Provider/model management UX**: GUI editing of custom providers, model lists, and model picker flows (#33704, #66481 docs PR).
- **Session lifecycle controls**: CLI archive/unarchive (#63518 → PR #66503), snooze/pause sessions (#64249), and a `session_history_days` TUI setting (PR #66505).
- **Terminal and IDE integration**: File tree/preview outside active sessions (#60379), ACP skill discovery in `additionalDirectories` (#64034), and the `read_terminal` tool (PR #66497).
- **Observability**: Fine-grained token accounting per step component — system, schemas, tool results, reasoning, output (#58716).
- **TUI/UI refinements**: Hiding compaction summaries (#56435), restoring the Projects sidebar with context menus (#66491), and compact question dialogs (#66484).

## 7. Developer Pain Points

1. **Destructive shell commands on Windows**: The `rd /s /q` drive-root wipe (#66449) exposes a lack of guardrails around model-generated commands with platform-specific escaping.
2. **Session and migration integrity**: Forked sessions retaining stale model limits (#66448), migration flagging client-executed tools (#66389), and worktree re-pointing (#50979) all erode trust in session state.
3. **Subagent reliability**: Continuation is fully broken (#59293), and foreground execution was removed (#64073) — a double hit for anyone building multi-step agent workflows.
4. **Silent failures**: Plugins stop firing without logs (#66299), deleted project directories hang the picker without surfacing `DirectoryNotFoundError` (#66442), and stale projects block `opencode reload`.
5. **Provider compatibility friction**: Forced `tool_choice` values rejected by auto-only providers (#45953), Copilot model sync failing in shared service mode (#60702), and overlapping reasoning fragment boundaries crashing Gemini turns (#64792).
6. **Desktop terminal/update ergonomics**: Ctrl+C not interrupting processes (#61899), SSH connections breaking on every client patch update (#60665), and noisy installer UX (PR #66506).

---
*Generated from github.com/anomalyco/opencode data for 2026-11-26.*

</details>

<details>
<summary><strong>Pi</strong> — <a href="https://github.com/earendil-works/pi">earendil-works/pi</a></summary>

# Pi Community Digest — 2026-11-26

## 1. Today's Highlights

A heavy maintenance and stabilization day for Pi: v1.6.1 shipped with decision-model support in codemode, while a large wave of PRs from contributor `petrroll` closed out several long-standing provider bugs (Bedrock Kimi reasoning, GitHub Copilot prompt-cache preservation, Windows Ctrl+Break handling). Cross-platform terminal hygiene issues (Windows mouse/Kitty reporting leaks, pasted ANSI corpses, image scrollback loss) dominated the issue tracker, and community discussions converged on local-model integration and safe tool-call gating.

---

## 2. Releases

**v1.6.1** — [Release](https://github.com/earendil-works/pi/releases)
- **Decision models in codemode**: GitHub Copilot's `gpt-6-luna-decisions` and Radius decision models can now be invoked via `models.classify()` in codemode, with the provider's `responseId` returned in results. See the [Classify docs](https://github.com/earendil-works/pi/blob/v1.6.1/packages/coding-agent/docs/codemode.md).

---

## 3. Hot Issues

1. **[CLOSED] Opt-in package namespace (`pi.namespace`) for skills and prompt templates** — [#8834](https://github.com/earendil-works/pi/issues/8834) — 18 comments. Proposes a unified `<namespace>:<name>` resolution surface for skills and prompts, avoiding name collisions across packages. Highest-comment issue of the day; closed with no action.

2. **[CLOSED] Windows: terminal left with mouse/Kitty input reporting enabled after stop/exit** — [#12133](https://github.com/earendil-works/pi/issues/12133) — 11 comments. SGR mouse reports flood the PowerShell prompt after exit. A highly reproducible Windows UX regression, later followed up by [#12564](https://github.com/earendil-works/pi/issues/12564).

3. **[CLOSED] Anthropic SSE parser mishandles a split CRLF across chunks → turn aborts** — [#10390](https://github.com/earendil-works/pi/issues/10390) — 11 comments. A subtle streaming parser bug in `iterateSseMessages` that silently kills turns. Important for anyone streaming Anthropic over flaky networks.

4. **[CLOSED] [prio:p0] openai-responses (API key): GPT-6 requests still send medium effort + additional_tools suppresses reasoning** — [#12464](https://github.com/earendil-works/pi/issues/12464) — 10 comments. Follow-up to earlier fixes that only covered `openai-codex`; the direct `openai` provider path was still broken.

5. **[CLOSED] Fresh install on Windows via npm/pnpm fails to run the pi agent** — [#4399](https://github.com/earendil-works/pi/issues/4399) — 9 comments. Long-standing onboarding blocker, finally closed as "closed-because-refactor."

6. **[OPEN] Preserve structured provider failure metadata through AssistantMessage** — [#11071](https://github.com/earendil-works/pi/issues/11071) — 8 comments. Requests a typed contract for HTTP status, provider error code, and retryability. Driven by the Cherry Studio Mobile consumer of Pi.

7. **[OPEN] `wrapUIPromptContext` copies by spread and loses UI prototype methods** — [#8829](https://github.com/earendil-works/pi/issues/8829) — 7 comments. SDK consumers using class instances get silently broken UI objects. A real footgun for extension authors.

8. **[OPEN] Allow configuring the idle cache-warming horizon** — [#11127](https://github.com/earendil-works/pi/issues/11127) — 6 comments, 1 👍. The hard-coded 30-minute window mismatches the ~27/54-minute prompt-cache refresh cadence; users want a tunable horizon.

9. **[OPEN] Pasted ANSI leaves escape corpses in the prompt; unterminated bracketed paste wedges the editor** — [#11383](https://github.com/earendil-works/pi/issues/11383) — 5 comments. Paste handling in `pi-tui` gets both filtering and recovery wrong; Ctrl+C can't escape a wedged state.

10. **[OPEN] [durable] Pi Durable support for client-side tool execution and tool approval** — [#10852](https://github.com/earendil-works/pi/issues/10852) — 4 comments. Feature proposal for human-in-the-loop approvals, which Pi Durable currently lacks entirely.

Honorable mentions: [#12483](https://github.com/earendil-works/pi/issues/12483) (failed auto-compaction loops forever — prio:p0), [#12466](https://github.com/earendil-works/pi/issues/12466) (ChatGPT sign-in lists 36 unsupported models), [#12548](https://github.com/earendil-works/pi/issues/12548) (Kitty images lost + scrollback wiped).

---

## 4. Key PR Progress

1. **[CLOSED] `feat(tui,coding-agent)`: report session resume command via OSC 7577** — [#12557](https://github.com/earendil-works/pi/pull/12557). Lets supporting terminals (e.g. Rex) resurrect a Pi session after a restart via the Program Resume Protocol.

2. **[OPEN] `feat(durable)!`: delete conversations for good** — [#12562](https://github.com/earendil-works/pi/pull/12562). Adds `Harness.deleteConversations(ids, context)` — aborts work including background/subagent tasks and purges the conversation tree. Breaking change; escalated externally.

3. **[CLOSED] `fix(ai)`: replay GitHub Copilot `reasoning_opaque` in openai-completions** — [#12505](https://github.com/earendil-works/pi/pull/12505). Fixes [#12418](https://github.com/earendil-works/pi/issues/12418); Copilot streams `reasoning_text` then a single opaque delta that Pi dropped, breaking subsequent replay.

4. **[CLOSED] `fix(ai)`: stop sending earlier reasoning to Bedrock Kimi K3 models** — [#12555](https://github.com/earendil-works/pi/pull/12555). Addresses a documented Converse API limitation on Moonshot's K3 family.

5. **[CLOSED] `feat(ai)`: keep the prompt cache across effort and tool changes on GitHub Copilot** — [#12539](https://github.com/earendil-works/pi/pull/12539). Closes [#12316](https://github.com/earendil-works/pi/issues/12316); preserves cache when changing thinking level or tool sets, matching direct Anthropic/OpenAI behavior.

6. **[OPEN] `feat(coding-agent)`: honor `DO_NOT_TRACK`** — [#12556](https://github.com/earendil-works/pi/pull/12556). Draft PR responding to a public telemetry audit that graded Pi a "C" for ignoring the cross-tool opt-out.

7. **[CLOSED] `fix(ai)`: send models.dev reasoning effort for Bedrock flat `reasoning_effort` models** — [#12551](https://github.com/earendil-works/pi/pull/12551). Fixes [#12462](https://github.com/earendil-works/pi/issues/12462); Kimi K3.1 can now actually reach `max` effort.

8. **[CLOSED] `fix(coding-agent)`: shut down gracefully on Ctrl+Break on Windows** — [#12553](https://github.com/earendil-works/pi/pull/12553). Listens for SIGBREAK so exit handlers run and the alternate screen / mouse reporting are properly restored.

9. **[CLOSED] `fix(coding-agent)`: report `models.json` errors in every mode** — [#12523](https://github.com/earendil-works/pi/pull/12523). Closes [#12522](https://github.com/earendil-works/pi/issues/12522); a typo in `models.json` silently destroyed the whole catalog in print/JSON/RPC modes.

10. **[CLOSED] `fix(tui)`: keep `@` file completion responsive on slow searches** — [#12538](https://github.com/earendil-works/pi/pull/12538). Prevented stale suggestions from causing partial token replacements when Enter was pressed mid-search.

Honorable mentions: [#12541](https://github.com/earendil-works/pi/pull/12541) (name configured keys in key hints), [#12552](https://github.com/earendil-works/pi/pull/12552) (replace models dropped by models.dev — unblocks CI), [#12543](https://github.com/earendil-works/pi/pull/12543) (`AGENTS.local.md` support), [#12549](https://github.com/earendil-works/pi/pull/12549) (Nix: unpin nodejs_22).

---

## 5. Hot Discussions

**Show and tell**

- **local-decider: guard Pi's tool calls with a decision model on your own GPU** — [#12559](https://github.com/earendil-works/pi/discussions/12559) — An extension that fronts Pi's tool calls with a small local decision model, preserving Pi's "no prompts by default" philosophy while catching `rm -rf` and force-push mistakes. Pitched directly at the decision-model primitive shipped in v1.6.1.

- **Community integration: Pre-send PII sanitizer + dynamic `models.json` context sizing for local 27B runs** — [#12530](https://github.com/earendil-works/pi/discussions/12530) — Write-up from 3.48M local coding tokens against Qwen3.5-9B / Qwen3.8-27B. Flags two real sharp edges: static 32K `contextWindow` entries clamping `max_tokens` down to 1, and lack of any PII scrubbing before requests leave the machine.

**Ideas**

- **VS Code native Agent Harness integration (alongside Claude Code and Codex)** — [#12528](https://github.com/earendil-works/pi/discussions/12528) — 2 👍. Proposes adding Pi as a first-class agent harness in VS Code's unified harness selector, alongside Claude Code, Codex, and GitHub Copilot. First big-surface IDE integration proposal.

---

## 6. Feature Request Trends

- **Provider-fidelity fixes** — A clear cluster of requests is about Pi's provider adapters matching vendor behavior exactly: preserving `reasoning_opaque` ([#12505](https://github.com/earendil-works/pi/pull/12505)), honoring `thinkingLevelMap`/reasoning effort on Bedrock ([#12462](https://github.com/earendil-works/pi/issues/12462), [#12551](https://github.com/earendil-works/pi/pull/12551)), fixing prompt-cache flags on github-copilot ([#12316](https://github.com/earendil-works/pi/issues/12316)), and correctly surfacing supported models for `openai` sign-in ([#12466](https://github.com/earendil-works/pi/issues/12466)).
- **Extensibility and SDK contracts** — Typed provider-failure metadata ([#11071](https://github.com/earendil-works/pi/issues/11071)), prototype-safe UI wrapping ([#8829](https://github.com/earendil-works/pi/issues/8829)), a package namespace field ([#8834](https://github.com/earendil-works/pi/issues/8834)), and `cwd` in `StreamOptions` ([#12480](https://github.com/earendil-works/pi/issues/12480)) show sustained demand for a stabler extension surface.
- **Durable execution controls** — Client-side tool approval and execution ([#10852](https://github.com/earendil-works/pi/issues/10852)), batching hints in `CodingTools` ([#12471](https://github.com/earendil-works/pi/issues/12471)), and hard deletion of conversations ([#12562](https://github.com/earendil-works/pi/pull/12562)) point to Pi Durable maturing into a production-grade runtime.
- **Cost and privacy controls** — Tunable idle cache-warming horizon ([#11127](https://github.com/earendil-works/pi/issues/11127)) and `DO_NOT_TRACK` support ([#12556](https://github.com/earendil-works/pi/pull/12556)) reflect growing operator sensitivity to cache TTL economics and telemetry.

## 7. Developer Pain Points

- **Windows terminal state leakage is the #1 recurring frustration.** Across [#12133](https://github.com/earendil-works/pi/issues/12133), [#12564](https://github.com/earendil-works/pi/issues/12564), and [#12553](https://github.com/earendil-works/pi/pull/12553), users repeatedly lose usable PowerShell prompts because mouse/Kitty/keyboard reporting isn't disabled on abnormal exit. Even a crash-recovery doc got added ([#12554](https://github.com/earendil-works/pi/pull/12554)).
- **Streaming and parser brittleness under real-world conditions.** Split CRLFs ([#10390](https://github.com/earendil-works/pi/issues/10390)) and dropped opaque reasoning deltas ([#12505](https://github.com/earendil-works/pi/pull/12505)) both silently abort turns with unhelpful errors.
- **TUI input handling still has sharp edges.** Pasted ANSI content corrupts prompts and unterminated bracketed pastes wedge the editor ([#11383](https://github.com/earendil-works/pi/issues/11383)); image rendering wipes scrollback ([#12548](https://github.com/earendil-works/pi/issues/12548)).
- **Compaction/error-recovery loops.** Failed auto-compaction resuming work and retrying indefinitely ([#12483](https://github.com/earendil-works/pi/issues/12483)) and silent `models.json` failures ([#12523](https://github.com/earendil-works/pi/pull/12523)) both turn small config/model errors into full-session loss.
- **Cache inefficiency on hosted providers.** Copilot losing the prompt cache on effort/tool changes ([#12316](https://github.com/earendil-works/pi/issues/12316)) and users wanting finer control over cache warming ([#11127](https://github.com/earendil-works/pi/issues/11127)) show cache behavior is now a first-class cost concern.
- **Onboarding friction for non-mainstream setups.** Windows npm/pnpm installs ([#4399](https://github.com/earendil-works/pi/issues/4399)), Nix node version mismatches ([#12549](https://github.com/earendil-works/pi/pull/12549)), and npm 12 git-source install scripts ([#12219](https://github.com/earendil-works/pi/issues/12219)) all trip up developers before they even reach the agent.

</details>

<details>
<summary><strong>Qwen Code</strong> — <a href="https://github.com/QwenLM/qwen-code">QwenLM/qwen-code</a></summary>

# Qwen Code Community Digest — 2026-11-26

## 1. Today's Highlights

The Qwen Code project shipped **v1.0.0-preview.2**, headlined by support for **Qwen4-Max** (1M context window, image/video input) and a new subscription-credit reset countdown plus `/upgrade` command. Meanwhile, CI stability remains the dominant operational concern, with a large share of issue activity driven by bot-filed main-branch failures across the Managed Agent gate, E2E tests, and SDK Java suites. On the security front, a P1 report (#18379) flags that headless `qwen -p` without `--approval-mode` reads files outside the workspace, and a separate issue (#18165) reports API keys being logged in plaintext in session logs.

---

## 2. Releases

**v1.0.0-preview.2** — [Release](https://github.com/QwenLM/qwen-code/releases)

- **Qwen4-Max added** to the Qwen subscription catalog, featuring a 1M context window with image and video input.
- **Subscription UX**: added a reset countdown when credits run out, plus a new `/upgrade` command that opens the subscription plans page.
- **Telemetry**: Qwen subscription requests now carry the `QwenCode` user-agent identifier (details truncated in source).

---

## 3. Hot Issues

1. **[#18252](https://github.com/QwenLM/qwen-code/issues/18252) — Main CI failed: E2E Tests (cron-tools)** (51 comments). The highest-traffic issue of the day, a bot-filed E2E failure covering cron tool registration. Sustained comment volume signals the community is actively triaging whether the failure is provisional or a real regression.

2. **[#18379](https://github.com/QwenLM/qwen-code/issues/18379) — `qwen -p` without `--approval-mode` reads outside workspace** (P1, security). Headless mode in a trusted folder grants `read_file` access that `--approval-mode=default` explicitly declines. High severity because it's a silent trust-boundary bypass with a clean reproduction.

3. **[#18165](https://github.com/QwenLM/qwen-code/issues/18165) — API keys logged in plaintext in session logs**. Reports that `cat`/`grep` tool output containing full API keys is persisted unmasked to `~/.qwen/projects/.../chats/*.jsonl`, duplicated across multiple fields, with overly broad file permissions. A critical data-at-rest risk.

4. **[#15686](https://github.com/QwenLM/qwen-code/issues/15686) — Active Goal holds ordinary user input** (P2). Enter-steered and pasted messages are queued instead of delivered at the next sampling boundary while a Goal turn is active — a UX/architecture debate around the interactive loop.

5. **[#16708](https://github.com/QwenLM/qwen-code/issues/16708) — FileChangedWatcher misses files in new subdirectories** (P2). A chokidar snapshot-then-watch race causes silent, permanent loss of `FileChanged` notifications for files written into freshly created subdirectories. Notable for its precise root-cause analysis.

6. **[#17489](https://github.com/QwenLM/qwen-code/issues/17489) — Windows: project settings not hot-reloaded** (P2). A `.qwen/settings.json` created after startup is never picked up because the bootstrap watcher ignores its own root — a platform-specific papercut for `qwen mcp add` workflows.

7. **[#12928](https://github.com/QwenLM/qwen-code/issues/12928) — Remove hard-coded temperature from internal model requests** (P2). A fixed `temperature: 0.2` breaks Responses-compatible endpoints with HTTP 400; a long-standing compatibility issue for third-party model backends.

8. **[#17920](https://github.com/QwenLM/qwen-code/issues/17920) — Web Shell: Archived conversations panel lacks search/filter/sort** (P2). As archives grow, the panel becomes unworkable with no search, no workspace filter, no sorting, and no archive timestamp. Representative of a cluster of Web Shell UX requests.

9. **[#18394](https://github.com/QwenLM/qwen-code/issues/18394) — Web Shell E2E smoke fails on shared ARM64 pool** (P2). `ERR_NETWORK_CHANGED` storms kill Vite dev-server module loads, failing unrelated PRs even after two prior retry mitigations. Highlights self-hosted runner fragility as a recurring tax.

10. **[#18391](https://github.com/QwenLM/qwen-code/issues/18391) — `/language ui --global` temporarily overrides workspace UI language** (P2). A global language change unexpectedly overrides the current workspace's setting until restart — a precedence bug in settings layering.

---

## 4. Key PR Progress

1. **[#18398](https://github.com/QwenLM/qwen-code/pull/18398) — fix(web-shell): restore custom inline tags in composer drafts.** Preserves positions of host-supplied inline chips across reloads and session switches, recovering source-preserving references.

2. **[#18389](https://github.com/QwenLM/qwen-code/pull/18389) — feat(managed-agent): embedded external Runtime and Workspace execution.** Lets embedded hosts supply external Runtime clients/transport for workspace prepare, execute, publish, and drain, with recovery tied to persisted materialization receipts.

3. **[#18257](https://github.com/QwenLM/qwen-code/pull/18257) — fix(core): append effective permission context before model requests.** Follows Codex's snapshot approach so the model always knows the active approval mode, appending reminders only when mode changes.

4. **[#18215](https://github.com/QwenLM/qwen-code/pull/18215) — fix(serve): recover detached background-shell liveness for persisted sessions.** Fixes the Web Shell's blind spot after a daemon restart by restoring liveness signals for detached background shells.

5. **[#18346](https://github.com/QwenLM/qwen-code/pull/18346) — fix(core): point at the JSON error when a tool arg arrives as broken text.** Improves model-facing validation errors by including the parse error and a caret-marked position for malformed JSON arguments.

6. **[#18370](https://github.com/QwenLM/qwen-code/pull/18370) — fix(ci): fail closed on authority-surface PRs and credential probes.** Hardens the precheck for outside contributions by judging what a PR can reach, not just keyword matching — a security-relevant CI change.

7. **[#17823](https://github.com/QwenLM/qwen-code/pull/17823) — fix(agents): keep A2A tasks recoverable after transcript read errors.** Returns the retryable `-32012` error instead of losing task state, so tasks can complete once reads recover.

8. **[#16771](https://github.com/QwenLM/qwen-code/pull/16771) — fix(serve): retain session ownership until runtime shutdown completes.** Prevents ownership from flipping mid-drain, avoiding silent double-ownership or premature replacement.

9. **[#18120](https://github.com/QwenLM/qwen-code/pull/18120) — feat(serve, web-shell): share workspace input history across devices.** Moves composer history to the daemon per-workspace, letting desktop and mobile clients share prompt and shell-command history.

10. **[#18120](https://github.com/QwenLM/qwen-code/issues/18165) / [#18320](https://github.com/QwenLM/qwen-code/pull/18320) — fix(i18n): correct Russian counts and settings descriptions.** Pluralization fixes for Russian, exemplifying the growing i18n surface area.

---

## 5. Hot Discussions

No Discussion data was provided in the source dataset; this section is omitted.

---

## 6. Feature Request Trends

- **Managed Agent / external runtime integration** — Multiple issues and PRs (#18386, #18389) push for embedded hosts to supply external Runtime and Workspace execution, with durable workspace-to-receipt relationships.
- **Workspace-level extensions** — [#18339](https://github.com/QwenLM/qwen-code/issues/18339) requests physical installs under `<workspace>/.qwen/extensions/<name>/`, mirroring the existing skills layout.
- **Web Shell UX maturity** — A cluster of requests (#17920, #17142, #18374) asks for search, filtering, sorting, keyboard-repeat guards, and archive timestamps in the Web Shell.
- **Custom inline tags / host embedding** — [#18398](https://github.com/QwenLM/qwen-code/pull/18398) reflects demand for richer embedding-host integration in composer drafts.
- **Ecosystem expansion** — [#18240](https://github.com/QwenLM/qwen-code/issues/18240) proposes an independent iPhone companion (Niro) for the README's Ecosystem section.

---

## 7. Developer Pain Points

- **CI instability is the single loudest signal.** The top of the issue list is dominated by bot-filed main-branch failures across E2E, Managed Agent gate, Qwen Code CI, and SDK Java — several with 50+ comments. Repeatedly, issues note the failure may be *provisional* because main advanced past the reported head, indicating a triage-aversion problem.
- **Shared runner flakiness.** [#18394](https://github.com/QwenLM/qwen-code/issues/18394) documents `ERR_NETWORK_CHANGED` storms on the ARM64 self-hosted pool failing unrelated PRs, with 22 specs skipping boot retry even after two mitigation attempts.
- **Security and secret handling.** Plaintext API keys in session logs (#18165) and the headless approval-mode bypass (#18379) are the two highest-stakes reports, both indicating trust-boundary and data-at-rest gaps.
- **Settings precedence and hot-reload.** Windows settings not hot-reloading (#17489) and global language overrides leaking across workspaces (#18391) point to a recurring settings-layering class of bugs.
- **Third-party model compatibility.** Hard-coded temperature (#12928) breaking Responses-compatible endpoints remains a long-standing friction point for users not on first-party models.
- **Watcher reliability.** The chokidar snapshot-then-watch gap (#16708) causes silent missed notifications — a class of bug that's easy to miss and hard to diagnose.

---

*Generated from github.com/QwenLM/qwen-code data for 2026-11-26.*

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*