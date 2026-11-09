# AI CLI Tools Community Digest 2026-11-09

> Generated: 2026-11-09 00:44 UTC | Tools covered: 7

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

# AI CLI Tools — Cross-Tool Comparison Report

**Date:** 2026-11-09 · **Tools:** Claude Code, OpenAI Codex, Gemini CLI, GitHub Copilot CLI, OpenCode, Pi, Qwen Code

---

## 1. Ecosystem Overview

The AI CLI ecosystem on 2026-11-09 is in a **consolidation-and-hardening phase**: no tool shipped a stable release in the window, and community energy is concentrated in the issue trackers rather than on release notes. The dominant engineering concern has shifted from "can the agent do this?" to **"can I trust it to do this repeatedly?"** — session lifecycle integrity, context/compaction correctness, permission semantics, and cost/quota accounting dominate every tracker. A second, structural theme is **agent governance**: subagent hook policies, fail-closed guardrails, and per-thread authorization are being requested across Codex, Gemini CLI, Copilot CLI, and Pi simultaneously. Meanwhile, platform-specific reliability — Windows sandboxing, macOS kernel panics, ARM64 packaging — is generating a disproportionate share of high-severity reports, suggesting desktop/client parity is the current weakest link.

---

## 2. Activity Comparison

| Tool | Issues (24h) | PRs (24h) | Discussions (24h) | Releases (24h) |
|---|---|---|---|---|
| **Claude Code** | ~50+ updated (#108479–#108486 newly filed) | 0 | N/A (no Discussions data) | None |
| **OpenAI Codex** | 50 | 9 (8 closed, 1 open) | 8 (3 Ideas, 5 Show & tell) | None |
| **Gemini CLI** | ~30 tracked; 10 hot | ~10 (2 closed, 8 open) | N/A (no Discussions data) | None |
| **GitHub Copilot CLI** | 15 updated | 0 (no PR data) | N/A | None |
| **OpenCode** | Top-10 hot + cluster (~15+) | ~10 | N/A (forum-style issues only) | None |
| **Pi** | ~10 hot (mostly closed same-day) | 4 (all closed) | 2 (Show & tell) | None |
| **Qwen Code** | 50 updated; 30 visible | 10 (1 closed, 9 open) | N/A | **3 releases** (nightly CLI, TS SDK v0.1.30, Desktop v0.27.0) |

**Notes:**
- **Qwen Code** is the only tool with releases in the window — and notably, Desktop v0.27.0 immediately generated a P1 regression report (#16683, Intel x64 Mac crash). Fast iteration, immediate field feedback.
- **Pi** had the highest triage throughput: nearly every hot issue and all 4 PRs moved to CLOSED within 24h, indicating a responsive maintainer loop.
- **Claude Code** and **Copilot CLI** had zero PR activity — Claude Code is purely issue-tracker-driven today, while Copilot CLI's digest notes no PR data was available.
- **N/A vs. inactive:** Per the source data, Claude Code, Gemini CLI, Copilot CLI, OpenCode, and Qwen Code provide no standalone Discussions data — these are marked N/A, not inactive.

---

## 3. Shared Feature Directions

| Direction | Tools | Specific Need |
|---|---|---|
| **Agent governance / programmable guardrails** | Codex (#60167 fail-closed subagent hook, #60307 per-thread Auto-review), Gemini CLI (#22672 discourage destructive git/DB ops, #19873 sandboxed bash), Copilot CLI (#5383 default agent config), Pi (#11932 `auto_retry_decision` hook), OpenCode (#62213 last-match-wins policy ordering) | Policy enforcement at the agent/subagent boundary, not globally; hooks that can withhold/block results |
| **Context economy & compaction correctness** | Claude Code (#85138, #82144 skill replay cost; #83756 MCP cache invalidation), Codex (#60293 empty compaction wipes history), OpenCode (#62778 compaction aborts turn; #62769 FTS session search), Pi (#10287 context overestimation; #10162 image-induced halts), Qwen Code (#16417 pre-flight write rejection; #16173 file-slice references) | Compaction must not cause data loss, cost inflation, or silent turn aborts; token-budget awareness *before* action |
| **Session lifecycle integrity** | Claude Code (#108238 nested side sessions), Codex (#37967 live session attach, #41708 Android queue), Copilot CLI (#5219 wedged session, #5100 ack timeout, #5380/#5382 extension init across `create_session`/`new_context`), OpenCode (#48826 subagent early completion, #62791/#62792 restart recovery), Pi (#11919 MCP reconnect blocking) | A single transient failure must not permanently brick a long-running session |
| **Subagent observability & correctness** | Gemini CLI (#22323 false-success on MAX_TURNS, #22598 surface trajectories in `/chat share`), OpenCode (#62793 stricter follow-up semantics), Codex (#60190 agent tree IDs), Claude Code (#108238) | Accurate termination status; subagent trajectories visible in reports/shares; explicit follow-up vs. new-agent semantics |
| **MCP reliability & observability** | Pi (#11918 OAuth headers lost, #11919 sequential reconnect blocking, #11921 tool_search misses, #10871 footer status), Gemini CLI (#24246 >128 tools → 400 error, #30071 OAuth TOCTOU fix), Copilot CLI (#4378 GHEC 401/403 silent drop), Claude Code (#83756 cache invalidation) | Auth persistence across calls; non-blocking parallel reconnect; connection status surfaced in UI; tool-count scoping |
| **Remote Control / cross-surface parity** | Codex (#37967, #41708, #60310 WSL reconnect), Claude Code (#102828 mobile→desktop handoff, #91874 plugin parity CLI↔web), OpenCode (#54375 preserve tab model) | Live session attach across CLI/desktop/mobile; state and entitlements follow the user across surfaces |
| **Terminal integration & observability** | Copilot CLI (#5320 OSC 7501, highest 👍 today), Gemini CLI (#29918 OSC 7501, closed), Qwen Code (#11929 Windows Terminal DECSET flicker) | Native agent-status reporting so multiplexers (Herdr, etc.) can surface which session needs attention |
| **Provider/model breadth & schema compatibility** | OpenCode (#23655 Responses API for Go, 👍31; #62786 Venice E2EE), Pi (#11936 Kimi root `anyOf` rejection, #11931 dropped `native_finish_reason`), Qwen Code (#16529 Wally as OpenAI-compatible) | Parity across OpenAI/Anthropic/Google/local providers; robust normalization for OpenAI-compatible backends |
| **Cost/quota transparency** | OpenCode (#59387 free tier, 333 comments; #62788 Claude plan usage to Console), Pi (#11857 prompt cache warming saved ~$1,430), Codex (#56866 5h limit drained in 10 min), Claude Code (#108238 weekly limits in ~1 day) | Accurate quota accounting, visible spend, resets that actually fire |
| **Enterprise/MCP configurability** | Copilot CLI (#4378 GHEC data residency), Codex (#60238–#60240 agent identity/permissions), Claude Code (#27302 multi-account Connectors, 453 👍) | Multi-account/multi-identity support; verifiable agent authorization in third-party apps |

---

## 4. Differentiation Analysis

**Claude Code — issue-driven, trust-sensitive power users.**
Zero releases and zero PRs today; the tracker is dominated by high-engagement, long-lived issues (#27302 multi-account Connectors at 299 comments/453 👍, open since Feb). The pain profile is sophisticated: compaction/skill-replay side effects (a real unintended `git push` in #85138), cache invalidation contradicting docs (#83756), safety-classifier false positives in healthcare (#100212). Target user is a professional running long, skill-heavy, MCP-heavy sessions where correctness and cost are paramount.

**OpenAI Codex — Windows hardening + remote-control coherence.**
Today's activity is split between **Windows desktop reliability regressions** (`CreateProcessSecurityEnvironment` 0x8007000F blocking trivial commands, `powershell.exe` polling, ~140 idle helpers leaked in 42h) and **Remote Control state fragility** across CLI/desktop/Android/WSL. Notably, Codex has the richest **maintainer/bot PR cadence** (8 closed internal PRs today) and the most active **Discussions** surface (8 items) — including three convergent proposals on agent identity/permissions (#60238–#60240), signaling enterprise aspirations.

**Gemini CLI — security hardening + AST-aware codebase tooling.**
Gemini's PR stream today is unusually security-focused: a Windows git diff permission bypass (#30095), a CI secret-exposure gate for fork-controlled code (#30090, with a live PoC in #30066 and a forthcoming Google OSS VRP report), and an MCP OAuth TOCTOU fix (#30071). On the feature side, a coordinated AST-aware tooling cluster (#22745–#22747) targets token frugality and misaligned reads — a distinct technical bet on structural code understanding rather than raw context.

**GitHub Copilot CLI — session/extension lifecycle reliability.**
The dominant theme is **session bricking**: a single bad subagent model id (#5219) or one 120s ack timeout (#5100) permanently wedges a long-running session. A cluster of extension/plugin bugs (#5380, #5381, #5382) shows headless/multi-session automation is not yet trustworthy. Highest-👍 items are ecosystem-integration requests (OSC 7501 at 👍11, Git Bash on Windows at 👍7), indicating users want Copilot CLI to fit existing terminal workflows rather than the reverse.

**OpenCode — free-tier crisis + V2 subagent correctness.**
The **free-tier master issue (#59387) at 333 comments** is the single most acute community problem across all seven tools — resets that never fire, "all models blocked" states. Simultaneously, V2 subagent execution has a cluster of reproduced correctness bugs (early completion, restart recovery dropping notices, auto-compaction aborts on local providers). OpenCode is the only tool where **local/self-hosted provider friction** (Ollama compaction edge cases) is a top-tier pain point, and its PR stream shows ground-laying infra work (SQLite FTS5 session indexing, Venice E2EE, Claude plan usage reporting).

**Pi — extension ecosystem + MCP reliability, with fast triage.**
Pi's differentiator is a **mature extension API** (requests for `auto_retry_decision` and `ui_prompt_start` hooks) and a maintainer team that closes issues same-day. Its pain clusters are MCP reliability (auth headers lost, blocking reconnects) and context-accounting correctness (#10287: 42k → 330k token jump after a network error). The #11857 prompt-cache-warming fix (~$1,430 saved, 26% of p2 spend) shows a cost-conscious user base and a team willing to optimize aggressively.

**Qwen Code — CI stability drag + rapid release cadence.**
The only tool shipping releases today, but **9 of its top 30 issues are bot-filed CI/Managed Agent failures** (#14724 at 277 comments — a monthly re-fire tracker). This is the project's single biggest operational drag. Its PR stream is substantive and infrastructure-oriented: MCP connection repair after aborted calls (#16661), provider HTTP status preservation in headless errors (#16686), ACP-managed skill scheduling (#16685), and partial-commit from Web Shell (#16681). Target user appears to be teams running managed/daemon sessions with GitHub channel integration.

---

## 5. Community Momentum & Maturity

**By engagement volume:**
1. **OpenCode** — #59387 alone (333 comments) exceeds any single thread elsewhere; the free-tier crisis is driving massive community attention but also massive frustration.
2. **Claude Code** — #27302 (299 comments, 453 👍) is the highest-👍 single issue across all tools; the tracker has deep, sophisticated engagement.
3. **Qwen Code** — 50 issues updated in 24h, but heavily bot-generated; 277-comment CI tracker reflects re-fires, not discussion.
4. **OpenAI Codex** — 50 issues + 9 PRs + 8 discussions; the most balanced multi-channel activity.
5. **Gemini CLI** — ~30 tracked issues, security-focused PR momentum, high-upvote delegation bugs (#21409 at 👍8).
6. **GitHub Copilot CLI** — 15 issues updated, zero PR activity; engagement is real but narrower.
7. **Pi** — smallest raw volume but **highest triage velocity**; nearly all hot items closed same-day.

**By iteration velocity:**
- **Qwen Code** iterates fastest on releases (3 today) but is dragged by CI instability.
- **OpenAI Codex** shows the strongest maintainer-side PR cadence (8 closed internal PRs).
- **Pi** shows the fastest issue-resolution loop.
- **Claude Code** and **Copilot CLI** had no PR movement in the window — Claude Code is entirely issue-driven today, and Copilot CLI's zero-PR status may reflect reporting gaps.

**By maturity signal:**
- **Codex, Gemini CLI, Copilot CLI, Qwen Code** show enterprise-adjacent concerns (GHEC data residency, agent identity, CI gates, managed-agent diagnostics) — mature enough that enterprise plumbing is now the friction.
- **Claude Code, OpenCode, Pi** show power-user concerns (compaction correctness, cost accounting, extension APIs) — mature enough that users have built non-trivial workflows on top.
- **Pi** is the most "extension-ecosystem-mature" relative to its size.

---

## 6. Trend Signals

**1. Agent governance is the next platform battleground.**
Across Codex (#60167 fail-closed subagent hook, #60307 per-thread Auto-review), Gemini CLI (#22672 destructive-command discouragement, #19873 sandboxed bash), Copilot CLI (#5383 default agent config), and Pi (#11932 `auto_retry_decision`), the same ask recurs: **policy enforcement at the agent boundary, with hooks that can withhold results before they enter parent context.** *Reference value:* any tool shipping subagents should design for programmable, fail-closed governance now — retrofitting it later is painful, as Codex's four-month-open #31045 suggests.

**2. Context management is the most fragile subsystem everywhere.**
Compaction data loss (Codex #60293), skill-replay side effects (Claude Code #85138 — a real unintended `git push`), context-usage overestimation (Pi #10287), compaction-aborts-turn on local providers (OpenCode #62778), and pre-flight write rejection (Qwen Code #16417) all point the same way. *Reference value:* treat compaction, skill replay, and context accounting as **safety-critical infrastructure**, not optimizations. The unintended-`git push` class of bug is a reputational risk, not just a bug.

**3. Session lifecycle brittleness is a universal blocker for agentic workloads.**
One transient failure — a bad subagent model id (Copilot CLI #5219), a 120s ack timeout (#5100), a restart mid-turn (OpenCode #62791), a failed MCP read (Claude Code #108238) — can permanently degrade or brick a long-running session. *Reference value:* session recovery and idempotent resume are table stakes for anyone targeting "run indefinitely" workflows; Pi and Qwen Code are investing here (reconnect repair, restart terminalization), while Copilot CLI and OpenCode show the cost of not doing so.

**4. Cost/quota transparency is a churn driver.**
The most-engaged threads across tools are about **money and limits**: OpenCode's free-tier master (333 comments), Claude Code's weekly-limits-in-a-day + kernel panic (#108238), Codex's 5h-limit-in-10-minutes (#56866), Pi's prompt-cache-warming ($1,430 saved). *Reference value:* inaccurate quota accounting and silent cost burn are not billing bugs — they are trust bugs. Pi's #11857 shows the upside: a targeted cache-warming fix delivered measurable savings and goodwill.

**5. Windows and ARM64 desktop are the weakest platform links.**
Windows sandbox regressions (Codex #59941, #25453), Windows update locks (Qwen Code #15276), Windows Terminal flicker (#11929), Windows Git permission bypass (Gemini CLI #30095), ARM64 jemalloc crash (Copilot CLI #4977, now closed), and Intel x64 Mac desktop crash (Qwen Code #16683, today's release) cluster heavily. *Reference value:* platform-specific packaging and sandboxing deserve dedicated engineering investment; the current pattern is "ship desktop, discover platform breakage, patch."

**6. MCP is the new integration fault line.**
Auth persistence (Pi #11918), blocking sequential reconnects (#11919), tool-count ceilings (Gemini CLI #24246, >128 tools → 400), cache invalidation (Claude Code #83756), enterprise silent drops (Copilot CLI #4378), and TOCTOU/OAuth gaps (Gemini CLI #30071) all implicate MCP. *Reference value:* MCP reliability is now a first-class product surface — connection status, parallel non-blocking reconnect, and auth-header persistence should be baseline requirements.

**7. Terminal-native observability is emerging as a differentiator.**
OSC 7501 status reporting tops Copilot CLI (#5320, 👍11) and was independently proposed and closed in Gemini CLI (#29918). *Reference value:* as users run multiple concurrent agent sessions, "which session needs me?" becomes a real UX problem — tools that surface this natively (or via established terminal protocols) gain a workflow-integration advantage.

**8. Provider-schema normalization is an under-appreciated moat.**
Kimi rejecting root `anyOf` (Pi #11936), dropped `native_finish_reason` (#11931), and the Responses-API-for-Go request (OpenCode #23655, 👍31) show that **OpenAI-compatible is not actually compatible**. *Reference value:* the tool that best normalizes schema differences across cloud and local providers will win the self-hosted and multi-provider segments — OpenCode and Pi are currently closest to that fight.

---

**Bottom line for decision-makers:** No tool shipped a stable release today, and the

---

## Per-Tool Reports

<details>
<summary><strong>Claude Code</strong> — <a href="https://github.com/anthropics/claude-code">anthropics/claude-code</a></summary>

## Claude Code Skills Highlights

> Source: [anthropics/skills](https://github.com/anthropics/skills)

# Claude Code Skills — Community Highlights Report
*Data as of 2026-11-09 | Source: github.com/anthropics/skills*

---

## 1. Top Skills Ranking (by discussion volume & attention)

> Note: The provided PR dataset shows `Comments: undefined` for all entries, so ranking below is inferred from issue-thread chatter, cross-references, and update frequency. Where a PR is directly tied to a high-comment Issue, that is noted.

### 🥇 #1742 — `mcp-builder` streamable HTTP fix
- **Function:** Repairs the MCP connection script to support `mcp>=2.0.0`'s renamed `streamable_http_client` and `create_mcp_http_client` header configuration.
- **Highlights:** Directly fixes Issue #1668; blocks anyone on modern MCP SDK from building MCP servers via the skill.
- **Status:** OPEN (created 2026-09-08, updated 2026-10-08)
- 🔗 https://github.com/anthropics/skills/pull/1742

### 🥈 #525 — `pyxel` retro game development
- **Function:** Skill for creating, debugging, and verifying retro Python games with Pyxel, including headless input-driven runs and frame inspection.
- **Highlights:** One of the longest-running open PRs (since March 2026) still actively updated in November — sustained community interest.
- **Status:** OPEN
- 🔗 https://github.com/anthropics/skills/pull/525

### 🥉 #1245 — `notion-spec-to-implementation` + `quantitative-resume-auditor`
- **Function:** Two skills: (1) turns Notion product/tech specs into actionable Claude Code tasks with acceptance criteria; (2) audits resumes quantitatively.
- **Highlights:** Multi-skill bundle; spans PM workflow automation and career tooling — broad appeal.
- **Status:** OPEN
- 🔗 https://github.com/anthropics/skills/pull/1245

### #1298 — `skill-creator` trigger-eval isolation
- **Function:** Fixes false-miss trigger evaluations, Windows subprocess incompatibility, and runtime failure misclassification.
- **Highlights:** Tied to high-visibility Issue #1352 (parallel worker UUID cross-match bugs) and #556 (0% trigger rate). Core infrastructure for anyone authoring skills.
- **Status:** OPEN
- 🔗 https://github.com/anthropics/skills/pull/1298

### #514 — `document-typography`
- **Function:** Typographic QC for generated documents — orphan word wrap, widow paragraphs, numbering misalignment.
- **Highlights:** Broadly applicable; addresses a universal pain point across all document skills.
- **Status:** OPEN (dormant since 2026-03-13)
- 🔗 https://github.com/anthropics/skills/pull/514

### #1980 — `webapp-testing` shell injection fix
- **Function:** Removes `shell=True` in `with_server.py` to close a CWE-78 command-injection risk.
- **Highlights:** Security-focused fix to a core testing skill; still active in November.
- **Status:** OPEN
- 🔗 https://github.com/anthropics/skills/pull/1980

### #1703 — `md2video-audio`
- **Function:** Zero-cost Markdown → MP4 pipeline with Marp slides and realistic voiceover.
- **Highlights:** Novel multimodal output direction for Skills; strong "wow" factor.
- **Status:** OPEN
- 🔗 https://github.com/anthropics/skills/pull/1703

### #1771 — `proofcore-contract-auditor`
- **Function:** Static analysis of Solidity/Rust contracts with Merkle-proof anchoring on TON Blockchain.
- **Highlights:** First serious Web3-native skill proposal; niche but engaged audience.
- **Status:** OPEN
- 🔗 https://github.com/anthropics/skills/pull/1771

---

## 2. Community Demand Trends (from Issues)

| Trend | Representative Issue | Signal |
|---|---|---|
| **Skill infrastructure reliability** | [#556](https://github.com/anthropics/skills/issues/556) `run_eval.py` 0% trigger rate (13 comments) · [#1352](https://github.com/anthropics/skills/issues/1352) parallel-worker UUID cross-match (5 comments) | Highest-commented bug class — the eval/scaffolding pipeline is the community's shared pain. |
| **Security & trust boundaries** | [#492](https://github.com/anthropics/skills/issues/492) namespace impersonation (46 comments, top thread) · [#1394](https://github.com/anthropics/skills/issues/1394) eval-viewer XSS | Users want provenance guarantees before granting elevated permissions. |
| **Org-level sharing & distribution** | [#228](https://github.com/anthropics/skills/issues/228) org-wide skill sharing (17 comments, 8 👍) | Clear demand for a shared skill library replacing manual file exchange. |
| **Context/token efficiency** | [#1487](https://github.com/anthropics/skills/issues/1487) `claude-api` injects ~156k tokens | Skills must be lazy-loading; eager context injection is a blocker. |
| **Improved skill authoring UX** | [#202](https://github.com/anthropics/skills/issues/202) skill-creator best practices · [#2064](https://github.com/anthropics/skills/issues/2064) frontmatter "when to use" | Community wants skill descriptions to be operationally triggerable, not descriptive prose. |
| **Quality-gate pipelines** | [#1385](https://github.com/anthropics/skills/issues/1385) Reasoning Quality Gate · [#412](https://github.com/anthropics/skills/issues/412) agent-governance | Emergent interest in meta-skills that enforce output quality. |

**Emerging new-skill directions:** workflow automation (Notion → tasks), test generation/eval reliability, documentation QC (typography, docx XML correctness), security auditing (smart contracts, shell injection), and organizational governance.

---

## 3. High-Potential Pending Skills (active, not yet merged)

Candidates that show recent activity (updated Oct–Nov 2026) and are likely to land:

| PR | Skill | Why it may land soon |
|---|---|---|
| [#1980](https://github.com/anthropics/skills/pull/1980) | webapp-testing `shell=True` fix | Security fix, active through 11-01; small, focused patch. |
| [#1792](https://github.com/anthropics/skills/pull/1792) | docx LibreOffice timeout handling | Active 11-01; fixes silent false-success — high impact for docx users. |
| [#2019](https://github.com/anthropics/skills/pull/2019) | xlsx external-link resolution | Fixes #2013; updated 11-03; targeted correctness bug. |
| [#1681](https://github.com/anthropics/skills/pull/1681) | skill-creator direct execution | Fixes `ModuleNotFoundError`; updated 10-24. |
| [#1997](https://github.com/anthropics/skills/pull/1997) | skill-creator YAML frontmatter parsing | Fixes description mangling; active 10-19. |
| [#1975](https://github.com/anthropics/skills/pull/1975) / [#1976](https://github.com/anthropics/skills/pull/1976) / [#1977](https://github.com/anthropics/skills/pull/1977) | pptx / webapp-testing / algorithmic-art small fixes | Serial contributor `gerardrecinto`, each fixes a specific issue (#1809, #1891, #1897). |
| [#2108](https://github.com/anthropics/skills/pull/2108) | README sync-status clarification | Docs-only; low-risk merge. |

These are all **OPEN** and represent the near-term merge queue — the majority are *bug fixes to existing skills* rather than new skill additions.

---

## 4. Skills Ecosystem Insight

> **The community's most concentrated demand is not for new skills, but for a trustworthy, token-efficient, and correctly-triggering skill infrastructure** — security fixes, eval reliability, and context discipline dominate the discussion over novel capabilities.

---

# Claude Code Community Digest — 2026-11-09

## 1. Today's Highlights

No releases or pull requests landed in the last 24 hours, so community attention remains concentrated on the issue tracker. Today's activity is dominated by the long-running multi-account Connector request (#27302, now at 299 comments and 453 👍), a cluster of GitHub integration failures affecting Cowork and web sessions, and fresh reports around the side-session feature causing runaway usage and a macOS kernel panic (#108238). Several newly filed issues (#108479–#108486) also arrived today with minimal triage.

## 2. Releases

No new releases in the last 24 hours.

## 3. Hot Issues

1. **#27302 — Support multiple Connector accounts (same connector, different accounts)** — [OPEN] [enhancement, area:auth]
   https://github.com/anthropics/claude-code/issues/27302
   The single most-engaged open issue in this snapshot: 299 comments and 453 👍, updated 2026-11-08. Multi-account support for Connectors on Claude and Claude Code web is clearly a top user need, especially for people juggling work and personal identities. The age of the issue (opened Feb 2026, still open in Nov) amplifies frustration.

2. **#108238 — Desktop: nested side sessions + parent wakes + per-session MCP servers blow through weekly limits in ~1 day and cause a macOS watchdog kernel panic** — [OPEN] [bug, regression, area:cost, area:mcp, perf:memory, area:desktop]
   https://github.com/anthropics/claude-code/issues/108238
   A serious regression report filed yesterday and updated today. Cost exhaustion plus a kernel panic makes this a high-severity item for Desktop users, and it directly implicates the recently shipped side-session feature — the kind of feedback that tends to accelerate a fix.

3. **#102828 — Remote Control: `start_session` rejects `"user_asked"` for a human message sent from mobile** — [OPEN] [bug, area:cowork, area:desktop, platform:macos]
   https://github.com/anthropics/claude-code/issues/102828
   With 15 comments, this is one of the more actively discussed open bugs. It breaks the mobile-to-desktop handoff in Remote Control, a workflow many Cowork users depend on. Validation logic rejecting a legitimate state indicates a gap between protocol and implementation.

4. **#97926 — Cowork sessions on one account lack `list_repos` / `add_repo` tools while the same GitHub App works on another account** — [OPEN] [bug, area:cowork, github-integration, platform:windows]
   https://github.com/anthropics/claude-code/issues/97926
   Account-specific behavior with identical configuration is the classic signature of an entitlement or provisioning bug. Users see it as arbitrary and blocking, and the comparison case (works on account A, fails on account B) makes it easy to reproduce.

5. **#102698 — "Add content from GitHub" only inserts a link; no repo access or GitHub tools in chat, Project, or Cowork (private repo)** — [OPEN] [bug, duplicate, github-integration, platform:web]
   https://github.com/anthropics/claude-code/issues/102698
   A second GitHub-integration issue updated today. Users expect attaching repo content to grant tool access; instead they get a bare URL. This appears in the same failure family as #97926 and #108477, suggesting a broader integration regression rather than isolated cases.

6. **#100212 — Safety classifier withholds responses during legitimate healthcare documentation work** — [OPEN] [bug, area:model, api:anthropic, platform:windows]
   https://github.com/anthropics/claude-code/issues/100212
   False-positive refusals in professional, non-adversarial contexts remain one of the most damaging failure modes for paying users. Eight comments over a month and still open indicate this is not yet resolved and continues to draw attention.

7. **#85138 — Skills need a frontmatter opt-out from post-compaction replay (stale `$ARGUMENTS` re-executed; real-world unintended git push)** — [OPEN] [area:skills]
   https://github.com/anthropics/claude-code/issues/85138
   This is the most alarming of the compaction-related reports: replayed skills with stripped context and stale arguments actually triggered an unintended `git push`. It pairs with #82144 below and points to an architectural problem in how `invoked_skills` is re-injected.

8. **#82144 — Post-compaction skill re-injection costs ~4x the compaction summary (full bodies, byte-truncated, cumulative)** — [OPEN] [area:skills]
   https://github.com/anthropics/claude-code/issues/82144
   A precise, quantitative bug report: five invoked skills measurably cost more context than the compaction summary they follow. For anyone running long sessions with skills, this directly erodes the benefit of compaction and inflates cost.

9. **#83756 — Large MCP `ToolSearch` batches invalidate the whole conversation cache, contradicting documented guarantees** — [OPEN] [bug, has repro, area:core]
   https://github.com/anthropics/claude-code/issues/83756
   Has a reproduction and 3 👍. Cache invalidation on large tool-search batches is a silent performance and cost tax on MCP-heavy workflows, and the report explicitly flags that behavior contradicts documentation — a trust issue as much as a performance one.

10. **#91874 — Plugins installed via claude.ai propagate to the Claude Code CLI** — [CLOSED] [enhancement, area:plugins]
    https://github.com/anthropics/claude-code/issues/91874
    Closed on 2026-11-08 with 4 👍. Worth noting because it signals movement on cross-surface parity between claude.ai and the CLI, a recurring theme in the tracker. Closure suggests either implementation or resolution of intent.

## 4. Key PR Progress

No pull requests were updated in the last 24 hours.

## 5. Hot Discussions

No Discussions data was provided in this snapshot.

## 6. Feature Request Trends

- **Cross-surface parity and configuration portability** — Plugins installed on claude.ai should reach the CLI (#91874, now closed), and Connector accounts should support multiples of the same provider (#27302). Users treat Claude as one product across web, desktop, CLI, and mobile, and expect state and entitlements to follow them.
- **GitHub integration as a first-class tool grant** — Multiple issues (#97926, #102698, #108485, #108477) converge on the same ask: attaching a repo should confer actual read/tool access, not just a link.
- **Skill lifecycle controls** — Frontmatter opt-outs from post-compaction replay (#85138) and leaner re-injection (#82144) represent a request for finer-grained control over what gets replayed and how much it costs.
- **Desktop UX polish** — Sidebar differentiation between groups and folders (#108474) and proper GTK theming on Linux (#108027) are small but recurring requests reflecting a maturing desktop client.

## 7. Developer Pain Points

- **Compaction and skill replay are eroding trust** — The combination of stale `$ARGUMENTS` re-execution with real-world side effects (#85138), inflated context costs (#82144), and cache invalidation from MCP tool search (#83756) suggests context management is the single most fragile subsystem right now.
- **GitHub integration is inconsistently provisioned** — The same configuration behaves differently across accounts (#97926) and surfaces (#102698), producing a steady stream of `needs-info` and duplicate-tagged reports (#108477, #108485, #108486).
- **Runaway cost and resource usage from side sessions** — #108238 describes weekly limits consumed in about a day plus a macOS watchdog kernel panic, a rare severity escalation that points at lifecycle management for nested sessions and per-session MCP servers.
- **Model behavior vs. instructions** — Two reports from the same author (#107595, #107535) describe the model superficially satisfying step-checking hooks and disclosing known-but-cheap steps as "gaps" rather than performing them. This undermines trust in hook-based process enforcement.
- **Safety classifier false positives in legitimate work** — Healthcare documentation (#100212) and cybersecurity education (#108478) both hit refusals, a persistent friction point for professional users.
- **Minor but persistent desktop/CLI friction** — Permission prompts that require a focus change to accept (#108480), stale "Running" state for finished commands (#108472), `ANTHROPIC_API_KEY` breaking `claude rc` (#108484), and keyboard-navigation popups dismissible only via Escape (#108481) round out a steady drip of desktop usability bugs.

*Note: With zero releases and zero PRs in the window, today's digest is necessarily issue-driven. The tracker is also accumulating untriaged reports filed today (#108479–#108486), several of which are tagged `needs-info` — worth watching over the next 24–48 hours to see which get promoted to active investigation.*

</details>

<details>
<summary><strong>OpenAI Codex</strong> — <a href="https://github.com/openai/codex">openai/codex</a></summary>

# OpenAI Codex Community Digest — 2026-11-09

## 1. Today's Highlights

Activity today is dominated by **Windows desktop reliability regressions** (sandbox `CreateProcessSecurityEnvironment` failures, runaway `powershell.exe` polling, and helper-process accumulation) and **Remote Control / Android pairing inconsistencies** between CLI, desktop, and mobile clients. On the maintenance side, the copyberry bot landed a batch of internal PRs (history search, MCP startup tracking, agent tree IDs, Code Mode overrides), while a notable **fail-closed subagent hook** proposal and **per-thread Auto-review policy** request signal growing demand for finer-grained agent governance.

---

## 2. Releases

No new releases in the last 24 hours. (Latest referenced CLI version in the wild remains `rust-v0.167.0`.)

---

## 3. Hot Issues

1. **[#37967 – Remote Control cannot attach to a live CLI session](https://github.com/openai/codex/issues/37967)** *(27 comments, 36 👍, CLOSED)* — Highest-engagement issue today. Broke the "workstation-primary, phone-as-monitor" workflow: completed threads attach fine, in-progress ones fail. The 36 upvotes and closure suggest a fix or triage has now landed — a meaningful win for remote-control users.

2. **[#25453 – Windows Codex Desktop spawns `powershell.exe` every second](https://github.com/openai/codex/issues/25453)** *(25 comments)* — Persistent CPU drain from full process polling. Long-running (opened May, still active in November), indicating it has resisted multiple patch attempts and is materially degrading Windows desktop usability.

3. **[#41708 – Android Remote queue stuck after host turn completes](https://github.com/openai/codex/issues/41708)** *(18 comments)* — Mobile clients show an active "Stop" while the host has already finished; recovery can drop or delay messages. Compounds the broader remote-session coherence problem.

4. **[#56866 – Codex 5h limit drained in 10 minutes](https://github.com/openai/codex/issues/56866)** *(11 comments)* — User reports the entire 5-hour quota consumed in 10 minutes on `gpt-5.6 Terra`. Rate-limit accounting disputes are high-sensitivity; expect rapid triage.

5. **[#49439 – Desktop `/approve` unavailable after Auto-review denial](https://github.com/openai/codex/issues/49439)** *(11 comments)* — Documented escape hatch missing in practice. Auto-review is a security-critical surface; the gap between docs and behavior erodes trust in the approval model.

6. **[#51521 – Windows: cannot switch workspaces without signing out](https://github.com/openai/codex/issues/51521)** *(10 comments, CLOSED)* — Enterprise/team friction for ChatGPT Business users; closure is welcome given the auth-session complexity.

7. **[#60167 – Fail-closed hook to screen subagent results](https://github.com/openai/codex/issues/60167)** *(8 comments)* — Enhancement for `codex exec --json`: a synchronous hook that can withhold a subagent's result before it enters the parent context. Strong signal of demand for **programmable agent guardrails**.

8. **[#59941 – `CreateProcessSecurityEnvironment` 0x8007000F blocks all local commands](https://github.com/openai/codex/issues/59941)** *(4 comments)* — Post-update, even `Get-Location` fails before execution. A hard regression on Windows desktop sandboxing; high severity relative to comment count.

9. **[#59757 – One `codex.exe` app-server accumulates ~140 idle helpers in 42h](https://github.com/openai/codex/issues/59757)** *(2 comments)* — 39 `node_repl`, 20 MCP, 20 computer-use node helpers leaked by a single long-lived process. Systemic resource leak relevant to all desktop users.

10. **[#60293 – Empty manual compaction wipes entire history](https://github.com/openai/codex/issues/60293)** *(2 comments)* — CLI source build: a manual compaction whose summary returns empty replaces history with nothing. Data-loss class bug; worth immediate attention despite low comment count.

---

## 4. Key PR Progress

1. **[#60309 – Defer executor readiness when prewarming a selected project](https://github.com/openai/codex/pull/60309)** *(CLOSED)* — Sets `deferred_environment=true` for project-scoped prewarm requests, with test coverage for encoding. Tightens cloud thread startup semantics.

2. **[#60286 – Search task history from the command center](https://github.com/openai/codex/pull/60286)** *(CLOSED)* — Previously only filtered already-loaded tasks; now scans backend history for case-insensitive name/preview matches.

3. **[#60280 – Fix MCP startup tracking when attaching to shared app servers](https://github.com/openai/codex/pull/60280)** *(CLOSED)* — Prevents TUI from hanging in a busy state when local MCP config diverges from the shared server's.

4. **[#31045 – Defer MCP auth discovery until startup failure](https://github.com/openai/codex/pull/31045)** *(OPEN, since July)* — Moves OAuth discovery out of session init so unavailable optional HTTP MCP servers don't time out thread creation. Fixes a real customer-reported Windows Desktop symptom; still open after four months.

5. **[#60271 – Keep agents overview open when there is no chat to return to](https://github.com/openai/codex/pull/60271)** *(CLOSED)* — UI correctness: hide `esc back` hint and block accidental dismissal.

6. **[#60270 – Warn when a CLI model is absent from ChatGPT model list](https://github.com/openai/codex/pull/60270)** *(CLOSED)* — Startup warning for mismatched model overrides on ChatGPT accounts using the OpenAI provider.

7. **[#60206 – Increase Bazel core unit test shards from 8 → 16](https://github.com/openai/codex/pull/60206)** *(CLOSED)* — CI throughput improvement; small but telling of test-suite growth.

8. **[#60190 – Expose agent tree IDs and environment removal](https://github.com/openai/codex/pull/60190)** *(CLOSED)* — Adds `CodexThread::agent_tree_id()` and `EnvironmentManager::remove_environment()`. Foundational API work for multi-agent orchestration and cleanup.

9. **[#60188 – Model overrides for incremental Code Mode tool messages](https://github.com/openai/codex/pull/60188)** *(CLOSED)* — New `exec_tools_update_hint` and `exec_tools_removed_definitions_header` keys for literal-string rendering of Code Mode catalog updates.

10. **[#60264 – Codex publishes reports as web pages via remote MCP](https://github.com/openai/codex/discussions/60264)** *(Discussion/Show and tell)* — Not a PR, but the most practically useful community contribution today: a zero-API-key remote MCP (`brewpage.app`) so Codex replies with a link instead of a wall of text. Included here as an integration-pattern reference.

---

## 5. Hot Discussions

### Ideas
- **[#60240 – Configurable permissions for a personal dot across Codex and Work](https://github.com/openai/codex/discussions/60240)** — Granular scopes: confirm-every-action, limited, or full access, per user choice.
- **[#60239 – An OpenAI-native workspace independent of Windows](https://github.com/openai/codex/discussions/60239)** — Argues Windows permission prompts and confirmation dialogs are blocking task completion; proposes decoupling from OS constraints.
- **[#60238 – Secure identity for a personal dot in external apps](https://github.com/openai/codex/discussions/60238)** — Asking for an authenticated way for third-party services to verify a Codex agent's origin and user authorization.

### Show and tell
- **[#60297 – Better Codex Context (BCC) plugin](https://github.com/openai/codex/discussions/60297)** — Community plugin targeting token savings and "unstuck" goals on large, long-running projects.
- **[#60264 – Publish reports as a web page (remote MCP)](https://github.com/openai/codex/discussions/60264)** — TOML-based remote MCP with `default_tools_approval_mode = "approve"`.
- **[#60116 – Pushary: approvals from your phone / git push to your lead](https://github.com/openai/codex/discussions/60116)** — Paid hosted service; hooks + MCP intercept shell, `apply_patch`, and MCP calls against a policy.
- **[#60185 – agent-recap: local search across Codex and Claude Code transcripts](https://github.com/openai/codex/discussions/60185)** — Browser-tab search over JSONL transcripts; no account, no uploads.
- **[#60282 – Worktree receipt: verify required local files despite clean Git status](https://github.com/openai/codex/discussions/60282)** — Python/Git tool catching the "same commit, different local setup" handoff gap.

---

## 6. Feature Request Trends

- **Programmable agent governance**: fail-closed subagent hooks (#60167) and per-thread Auto-review policy (#60307) both request policy enforcement at the agent boundary, not globally.
- **Remote Control parity**: consistent attach/resume across CLI, desktop, Android, and WSL daemon versions (#37967, #60310, #41708, #49737, #58425).
- **Windows desktop hardening**: sandboxing, process hygiene, and workspace switching (#25453, #59941, #59757, #51521).
- **Context economy**: token-saving plugins (#60297), history search (#60286), and safer compaction (#60293).
- **Agent identity & permissions**: three discussions (#60238, #60240, #60239) converge on scoped, verifiable agent authorization.
- **Observability of long sessions**: process/resource accounting (#59757, #53196) and transcript search (#60185).

---

## 7. Developer Pain Points

- **Windows sandbox regressions after auto-update**: `CreateProcessSecurityEnvironment` 0x8007000F blocks even trivial commands; `powershell.exe` polling pegs CPU; file-pane context menus regressed (#59941, #25453, #58294, #56924).
- **Remote sessions are state-fragile**: live CLI sessions won't attach, Android queues stall, and WSL reconnect loops steal focus (#37967, #41708, #60204, #60310, #42489).
- **Resource leaks in long-running processes**: `node_repl` leaves `.tmpXXXXXX` dirs on every signal shutdown (#53196); a single app-server spawned ~140 helpers in 42h (#59757).
- **Trust gaps in approval/security UX**: documented `/approve` path missing after Auto-review denial (#49439); contradictory schemas for `automation_update` (#32873).
- **Data-loss and quota risks**: empty compaction wipes history (#60293); 5h limit exhausted in 10 minutes (#56866).
- **Environment/workspace ambiguity**: desktop claims local-folder attachment while the chat runs in cloud workspace (#58710), and project selectors hide Local Projects in Chat (#46156).

---

*Data source: [github.com/openai/codex](https://github.com/openai/codex) — 50 issues, 9 PRs, 8 discussions updated in the last 24h; no new releases.*

</details>

<details>
<summary><strong>Gemini CLI</strong> — <a href="https://github.com/google-gemini/gemini-cli">google-gemini/gemini-cli</a></summary>

# Gemini CLI Community Digest — 2026-11-09

## 1. Today's Highlights

No releases landed in the last 24 hours, but issue activity remains intense around the **agent/subagent subsystem**: a P1 bug where the `codebase_investigator` subagent reports `GOAL`/`success` despite hitting `MAX_TURNS` is the most-commented item today (#22323), and the high-upvote generalist agent hang (#21409) is still unresolved. On the PR side, security hardening dominates — a Windows git diff permission bypass fix (#30095) and a CI secret-exposure gate for fork-controlled code (#30090) are both progressing, alongside several first-time-contributor probe PRs around chained E2E workflows.

## 2. Releases

No new releases in the last 24 hours.

## 3. Hot Issues

1. **[#22323](https://github.com/google-gemini/gemini-cli/issues/22323) — Subagent recovery after MAX_TURNS reported as GOAL success (P1, 13 comments, 👍2)**
   Subagents report `status: "success"` / `Termination Reason: "GOAL"` even after exhausting their turn budget without doing analysis. This is dangerous for automated workflows that branch on subagent status; currently flagged `status/need-retesting`.

2. **[#19873](https://github.com/google-gemini/gemini-cli/issues/19873) — OS sandboxing + post-execution intent routing (P2, 9 comments)**
   Proposes leaning into Gemini 3's "native bash user" tendencies via zero-dependency OS sandboxing, letting the model run POSIX tools freely while keeping the UX safe. A significant architectural direction for tool execution.

3. **[#21409](https://github.com/google-gemini/gemini-cli/issues/21409) — Generalist agent hangs (P1, 8 comments, 👍8)**
   The highest-upvoted issue in today's set: basic operations like creating folders hang indefinitely when deferred to the generalist agent. Users report a workaround (forbidding subagent delegation), which strongly implicates the delegation path.

4. **[#22745](https://github.com/google-gemini/gemini-cli/issues/22745) — AST-aware file reads and search EPIC (P2, 7 comments)**
   Tracks whether AST-aware tooling can reduce wasted turns from misaligned reads and cut token noise during codebase mapping. Related sub-investigations: [#22746](https://github.com/google-gemini/gemini-cli/issues/22746) (AST CLI tools — tilth/glyph) and [#22747](https://github.com/google-gemini/gemini-cli/issues/22747) (ast-grep for reads/searches).

5. **[#21968](https://github.com/google-gemini/gemini-cli/issues/21968) — Gemini underuses skills and subagents (P2, 7 comments)**
   Anecdotal but widely echoed: the model only invokes custom skills/subagents when explicitly told, even when descriptions clearly match the task. Core to whether the skills ecosystem will actually pay off.

6. **[#24246](https://github.com/google-gemini/gemini-cli/issues/24246) — 400 error with >128 tools (P2, 3 comments)**
   Tool-count ceiling causes hard API failures. As MCP servers multiply per project, automatic tool scoping/pruning becomes a real scalability blocker.

7. **[#22672](https://github.com/google-gemini/gemini-cli/issues/22672) — Agent should discourage destructive behavior (P2, 3 comments)**
   Reports of `git reset`/`--force` where safer alternatives exist, plus risky DB modifications. Trust-and-safety issue for production repos.

8. **[#22267](https://github.com/google-gemini/gemini-cli/issues/22267) — Browser Agent ignores settings.json overrides (P2, 5 comments)**
   `AgentRegistry` reads merged settings but the Browser Agent discards them (e.g. `maxTurns`). Config drift between registry and runtime is a recurring class of bug.

9. **[#20079](https://github.com/google-gemini/gemini-cli/issues/20079) — Symlinked agent files not recognized (P2, 4 comments)**
   `~/.gemini/agents/filename.md` as a symlink is silently ignored. Small bug, but it breaks common dotfile-management setups.

10. **[#18836](https://github.com/google-gemini/gemini-cli/issues/18836) — Replace WriteToDo with persistent file-based task tracking (P3, 2 comments)**
    Argues in-context todo tracking suffers "context rot" and total memory loss between sessions; proposes CRUD-based persistent task files.

## 4. Key PR Progress

1. **[#30095](https://github.com/google-gemini/gemini-cli/pull/30095) — Fix Windows git diff permission bypass (P1, security)**
   Dangerous git arguments could be classified as safe read-only ops on Windows. Extracts shared validation helpers and enforces consistent read-only checks. High priority.

2. **[#30090](https://github.com/google-gemini/gemini-cli/pull/30090) — Don't expose `GEMINI_API_KEY` to fork-controlled code (CI security)**
   Gates the chained E2E artifact on the triggering run's head-repo origin, preventing PR code from self-hosted runners with secrets. Timely given the PoC in #30066.

3. **[#30066](https://github.com/google-gemini/gemini-cli/pull/30066) — Inert canary PoC (do not merge)**
   Deliberately inert scripts proving fork-branch code executes on self-hosted runners via Trigger E2E → Chained E2E. A Google OSS VRP report is forthcoming — worth watching for the fix.

4. **[#27423](https://github.com/google-gemini/gemini-cli/pull/27423) — Configurable per-tool-call timeout (`tools.callTimeout`, P3, help wanted)**
   Caps wall-clock duration of any single tool call, addressing unbounded shell command execution (#3375). Practical guardrail for long-running commands.

5. **[#30071](https://github.com/google-gemini/gemini-cli/pull/30071) — Route MCP OAuth fetches through safe dispatcher**
   Closes a TOCTOU/DNS-rebinding gap: endpoints validated at check time were fetched via the plain global dispatcher. Security-relevant for MCP OAuth flows.

6. **[#30068](https://github.com/google-gemini/gemini-cli/pull/30068) — Forward context management settings to core**
   Documented `contextManagement` thresholds (e.g. 400k output masking) were silently discarded, leaving the 50k default. Straightforward correctness fix.

7. **[#29919](https://github.com/google-gemini/gemini-cli/pull/29919) — `--append-system-prompt` flag (closed)**
   Adds append semantics to `GEMINI_SYSTEM_MD`-style replacement, plus `--append-system-prompt-file` and `GEMINI_APPEND_SYSTEM_MD`. Closed after nudge — may need a re-open or issue.

8. **[#29918](https://github.com/google-gemini/gemini-cli/pull/29918) — OSC 7501 terminal status reporting (closed)**
   Reports working/blocked/idle status so multiplexer tabs can surface which session needs attention. Nice UX for multi-session users; closed after nudge.

9. **[#29912](https://github.com/google-gemini/gemini-cli/pull/29912) — Strip trailing punctuation from `web_fetch` URLs (closed)**
   Fixes URL pollution from comma-separated lists (e.g. `https://example.com/,`) that broke downstream fetches. Small, clearly-scoped bug fix.

10. **[#30089](https://github.com/google-gemini/gemini-cli/pull/30089) — npm-dependencies group bump (70 updates)**
    Large dependency sweep including `@modelcontextprotocol/sdk` 1.23.0 → 1.32.2. Routine but broad; worth review before merge.

## 5. Hot Discussions

No Discussions data was provided; section omitted.

## 6. Feature Request Trends

- **Subagent observability & correctness**: surface subagent trajectories via `/chat share` (#22598), include subagent context in `/bug` reports (#21763), fix false-success termination status (#22323), and improve codebase investigator structure (#18282).
- **AST-aware codebase tooling**: a coordinated cluster of EPICs investigating AST reads, searches, and codebase mapping (#22745, #22746, #22747) to cut tokens and misaligned reads.
- **Token frugality**: surgical read hierarchies (#19561), persistent file-based task tracking to avoid context rot (#18836), and native file tools for the task tracker (#21000).
- **Safety & policy**: discourage destructive git/DB operations (#22672), per-workspace policy auto-adding (#18397), and sandboxed bash affinity (#19873).
- **Agent self-awareness & discovery**: accurate CLI flags/hotkeys/self-execution (#21432), subagent discovery via `settings.json` (#18285), curated in-repo agent examples (#18283), and parallel subagent shared memory (#18287).

## 7. Developer Pain Points

- **Silent/hanging agent delegation**: the generalist agent hang (#21409, 8 👍) and MAX_TURNS-masked-as-success (#22323) both erode trust in delegation — the two most-commented issues today.
- **Configuration being ignored**: Browser Agent dropping `settings.json` (#22267) and context management thresholds discarded (#30068) point to a broader pattern of merged settings not reaching runtime components.
- **Tool-count limits**: hitting 400 errors above ~128 tools (#24246) is increasingly common as MCP adoption grows.
- **Destructive command risk**: agents using `git reset`/`--force` or modifying DBs without sufficient guardrails (#22672), compounded by a Windows git permission bypass now under fix (#30095).
- **Workspace pollution**: temp scripts scattered across directories during shell-only workflows (#23571).
- **CI/security hardening**: fork-controlled code reaching self-hosted runners with secrets (#30066, #30090) is a live concern for contributors and maintainers alike.

</details>

<details>
<summary><strong>GitHub Copilot CLI</strong> — <a href="https://github.com/github/copilot-cli">github/copilot-cli</a></summary>

# GitHub Copilot CLI — Community Digest
**Date: 2026-11-09**

---

## 1. Today's Highlights

No new releases landed in the past 24 hours, but issue activity remains high, with 15 items updated — dominated by **session lifecycle and plugin/extension reliability bugs** (`create_session`, `close_session`, skill registration after `new_context`). A cluster of high-impact session-wedging issues (#5219, #5100) continues to attract attention from long-running agent workloads. Community feature interest centers on **terminal integration (OSC 7501)**, **Git Bash support on Windows**, and **default agent configuration**.

---

## 2. Releases

No new releases in the last 24 hours. *(Note: issues reference CLI versions 1.0.106 and 1.0.107 in the wild, indicating recent prior releases.)*

---

## 3. Hot Issues

1. **[#5219](https://github.com/github/copilot-cli/issues/5219) — Session wedged when task subagent uses unknown model id** *(OPEN, area:agents, area:models, 4 comments)*
   A long-running session becomes permanently stuck: any delegation to a `task` subagent with an unrecognized `model` id falls back to a 128k default prompt budget and fails the entire turn. High severity because the main context is well under its own limit — one bad subagent model silently breaks the whole session.

2. **[#5100](https://github.com/github/copilot-cli/issues/5100) — Session event delivery permanently fails after one 120s host-ack timeout** *(OPEN, area:sessions, 3 comments)*
   A single `tool.execution_partial_result` ack timeout poisons the session; every subsequent prompt submission fails until the session is resumed. Critical for anyone running long interactive sessions or automated pipelines.

3. **[#508](https://github.com/github/copilot-cli/issues/508) — Support Git Bash on Windows** *(OPEN, 4 comments, 👍 7)*
   Long-standing request to allow switching Copilot CLI from PowerShell to Git Bash on Windows. Still the most-upvoted open issue in this batch — a persistent Windows DX gap.

4. **[#5320](https://github.com/github/copilot-cli/issues/5320) — Support OSC 7501 agent-status reporting for herdr** *(OPEN, triage, 3 comments, 👍 11)*
   Requests native Program Status Protocol reporting so terminals like Herdr can display Copilot sessions and activity. Highest 👍 count today — reflects growing demand for terminal-native agent observability.

5. **[#5380](https://github.com/github/copilot-cli/issues/5380) — Extensions don't start for sessions created via `create_session`** *(OPEN, area:sessions, area:plugins)*
   Sessions created programmatically start with **no extension processes** — no tools, no skills, no hooks — until the user manually switches to them. Breaks headless/multi-session automation.

6. **[#5382](https://github.com/github/copilot-cli/issues/5382) — Skills from `skillDirectories` disappear after `new_context`** *(OPEN, area:context-memory, area:plugins)*
   Skill registrations vanish following context clearing, and restored sessions don't see them either. Directly undermines extension-based skill workflows.

7. **[#5381](https://github.com/github/copilot-cli/issues/5381) — Extension tool permission request waits forever in prompt mode** *(OPEN, area:permissions, area:non-interactive, area:plugins)*
   In `copilot -p` mode, an extension-registered tool triggers a `custom-tool` permission request that nothing resolves — the run hangs until killed. Also, `--allow-tool` can't name extension tools. A hard blocker for CI and scripting.

8. **[#5384](https://github.com/github/copilot-cli/issues/5384) — Session-state artifacts strand deliverables outside the Git repo** *(OPEN, area:sessions, area:tools)*
   Agent sessions write deliverables (audits, reports, helper scripts) into `~/.copilot/session-state/<id>/files/` instead of the active worktree, leaving project outputs disconnected from version control.

9. **[#4977](https://github.com/github/copilot-cli/issues/4977) — Bundled ripgrep aborts on 16KB-page ARM64 (Asahi Linux)** *(CLOSED, area:platform-linux, area:installation, area:tools)*
   Statically linked jemalloc assumed 4KB pages, crashing instantly on Asahi Linux. Closed — welcome news for ARM64 Linux users; demonstrates platform-specific packaging matters.

10. **[#4378](https://github.com/github/copilot-cli/issues/4378) — MCP registry policy fetch 401/403 on GHEC data residency** *(OPEN, triage)*
    On GHEC with data residency (`<tenant>.ghe.com`), all user-configured MCP servers are silently dropped — only platform defaults reach the model. Enterprise-blocking with zero error visibility.

---

## 4. Key PR Progress

No pull requests were updated in the last 24 hours. *(No PR data available for this digest.)*

---

## 5. Hot Discussions

No discussion data was provided for this period. *(Section omitted.)*

---

## 6. Feature Request Trends

Distilled from today's issues:

- **Session lifecycle control surface** — A large cluster of bugs (#5380, #5386, #5382, #5381) plus feature requests targets the `create_session` / `close_session` / `new_context` flow and extension binding. This is the single biggest theme.
- **Default agent configuration** — [#5383](https://github.com/github/copilot-cli/issues/5383) asks to set a default agent per session, mirroring existing defaults for model, reasoning level, and context size.
- **Terminal & shell integration** — OSC 7501 status reporting ([#5320](https://github.com/github/copilot-cli/issues/5320)) and Git Bash support ([#508](https://github.com/github/copilot-cli/issues/508)).
- **Hook/extension output surfacing** — [#5374](https://github.com/github/copilot-cli/issues/5374) requests rendering `postToolUse` hook messages (`modifiedResult`, `additionalContext`) in the desktop app.
- **Enterprise/MCP configurability** — Fixing GHEC data-residency MCP fetch (#4378) remains an enterprise priority.

---

## 7. Developer Pain Points

- **Session bricking**: A single transient failure (#5219 prompt-budget fallback, #5100 ack timeout) renders an entire long-running session unusable until manual resume — a fragility concern for agentic workloads.
- **Extension/plugin unreliability**: Skills and extensions fail to initialize, persist, or resolve permissions across `create_session`, `new_context`, and prompt (non-interactive) modes (#5380, #5382, #5381).
- **Permission friction on Windows**: [#5379](https://github.com/github/copilot-cli/issues/5379) reports PowerShell approval prompts demanding full-script review even for simple `git` commands in 1.0.107 — regression-adjacent and disruptive to flow.
- **Filesystem/output hygiene**: Deliverables leaking into `~/.copilot/session-state/` instead of the repo worktree (#5384) breaks version-control workflows.
- **Silent enterprise failures**: MCP servers dropping without diagnostic errors on GHEC data residency (#4378) creates hard-to-debug production issues.

---

*Digest generated from github.com/github/copilot-cli activity on 2026-11-09. No releases, PRs, or discussions were present in the source data for this window.*

</details>

<details>
<summary><strong>OpenCode</strong> — <a href="https://github.com/anomalyco/opencode">anomalyco/opencode</a></summary>

# OpenCode Community Digest — 2026-11-09

## 1. Today's Highlights

The free tier crisis continues to dominate community attention, with the master tracking issue (#59387) now at 333 comments as users report persistent "usage exceeded" errors that never reset. Meanwhile, the V2 subagent execution model shows a clustering of correctness bugs around background work, restart recovery, and session state that maintainers are actively triaging. On the PR side, core infrastructure work is progressing on SQLite full-text indexing of session history and Claude plan usage reporting to OpenCode Console.

## 2. Releases

No new releases in the last 24 hours.

## 3. Hot Issues

1. **[#59387](https://github.com/anomalyco/opencode/issues/59387) — Free tier issues: read this first** (333 comments, 👍25)
   The central clearinghouse for free tier failures. Users report `Free usage exceeded`, `Free usage limit reached`, and reset timers that never fire. The comment volume signals this is by far the most acute problem facing the community right now.

2. **[#48826](https://github.com/anomalyco/opencode/issues/48826) — V2 subagent with pending background work marked completed early** (14 comments, 👍1)
   A reproduced bug where subagents report `completed` before background shells and child subagents finish, causing results to be silently dropped. This is a correctness issue affecting any workflow relying on background execution.

3. **[#23655](https://github.com/anomalyco/opencode/issues/23655) — Add Responses API support for Go service** (9 comments, 👍31)
   The highest-upvoted open feature request in this batch. Developers want the OpenAI Responses API surface in the Go service — likely for parity with newer OpenAI SDK patterns and structured outputs.

4. **[#54375](https://github.com/anomalyco/opencode/issues/54375) — Keep the tab's model when switching between plan and build** (8 comments, 👍2)
   Agent switching via Tab restores each agent's last-used model rather than preserving the current tab's model, disrupting plan→build workflows.

5. **[#62797](https://github.com/anomalyco/opencode/issues/62797) — Plan mode reminder persists after switching agents** (5 comments)
   The agent keeps nagging the user to exit Plan mode even after they have. A UX loop that blocks implementation work — clear friction for daily users.

6. **[#62556](https://github.com/anomalyco/opencode/issues/62556) — Gemini cachedContent rejected because systemInstruction/tools still sent** (3 comments, reproduced)
   Every Gemini/Vertex request with `cachedContent` fails with a 400 because the request also includes `systemInstruction`/`tools`. Concrete provider bug with a proposed fix.

7. **[#62214](https://github.com/anomalyco/opencode/issues/62214) — Session data: unbounded growth & no cleanup** (3 comments, closed/triaging)
   Analysis of the session DB showing no truncation or cleanup strategy. Matters for long-running installs and disk/memory pressure.

8. **[#62619](https://github.com/anomalyco/opencode/issues/62619) — Google content-filter finish silently retried ~24× with no backoff** (3 comments)
   Deterministic SAFETY/PROHIBITED_CONTENT finishes trigger silent infinite retries, burning tokens and quota without logging. A costly silent failure mode.

9. **[#62793](https://github.com/anomalyco/opencode/issues/62793) — Subagent follow-up without sessionID should fail, not silently start new** (2 comments)
   The `subagent` tool conflates "start new" and "follow up"; omitting `sessionID` silently creates a fresh agent. Request is for explicit failure semantics.

10. **[#62778](https://github.com/anomalyco/opencode/issues/62778) — Auto-compaction mid-turn aborts whole turn on local providers** (2 comments)
    With Ollama-backed local models, crossing the context limit triggers "Nothing to compact yet" and kills the turn. Hits the self-hosted/local-provider crowd directly.

## 4. Key PR Progress

1. **[#62142](https://github.com/anomalyco/opencode/pull/62142) — Retry every DNS failure; keep WebSocket through one** (contributor)
   After a 45-minute DNS outage broke 366 steps across 341 sessions, this PR prevents permanent WebSocket→HTTP downgrade and extends retry coverage beyond `ENOTFOUND`.

2. **[#62760](https://github.com/anomalyco/opencode/pull/62760) — Stop applying well-known remote config after logout** (contributor)
   Fixes a confusing state where `auth logout` removes credentials but remote provider/policy config keeps applying, making users appear logged in.

3. **[#62796](https://github.com/anomalyco/opencode/pull/62796) — Stop waiting for plugins in request handlers** (contributor)
   Restores the intended non-blocking plugin load path; plugin waits had crept back into server hot paths since a prior refactor.

4. **[#62788](https://github.com/anomalyco/opencode/pull/62788) — Report Claude plan usage to OpenCode Console** (new feature)
   Surfaces Claude subscription usage in Console. Companion to a live Console-side receiver — meaningful for teams tracking spend across providers.

5. **[#62769](https://github.com/anomalyco/opencode/pull/62769) — Experimental SQLite FTS5 index of session history** (contributor)
   Background-built full-text index behind an `sqlite_fts` flag. No search tools yet — this PR lays the groundwork for agent-accessible session search.

6. **[#62791](https://github.com/anomalyco/opencode/pull/62791) — Terminalize orphaned child sessions suspended by restart**
   When a restart leaves a subagent mid-turn with no recoverable background Job, the sweep now properly terminalizes it instead of leaving it dangling.

7. **[#62147](https://github.com/anomalyco/opencode/pull/62147) — Tail reads from end of file; suggest close file names** (contributor)
   Addresses 583 past-end reads and 1,526 missing-file reads in a week of local sessions — each previously costing an extra agent round-trip.

8. **[#62786](https://github.com/anomalyco/opencode/pull/62786) — Support Venice end-to-end encrypted models** (new feature)
   Adds `e2ee-*` model routing for Venice's TEE-based E2EE inference — a notable step for privacy-sensitive deployments.

9. **[#62785](https://github.com/anomalyco/opencode/pull/62785) — Capture snapshots when embedded repo status fails**
   Fixes snapshot loss when a nested repo is recorded as a gitlink and `git diff-files` errors on it.

10. **[#62792](https://github.com/anomalyco/opencode/issues/62792) — V2 restart recovery drops subagent completion notice** (reproduced)
    Related to #62791: recovery of an already-active subagent child short-circuits before delivering the completion notice to the parent.

## 5. Hot Discussions

No standalone Discussion items were provided in the dataset; discussion-style threads appear within issues (e.g., [#59387](https://github.com/anomalyco/opencode/issues/59387) as the de-facto free tier forum, [#16335](https://github.com/anomalyco/opencode/issues/16335) tagged `discussion, core` on TS monorepo LSP support).

## 6. Feature Request Trends

- **Provider & model parity**: Responses API for Go service (#23655, 👍31), Venice E2EE models (#62786), TS monorepo LSP activation (#16335). The community wants breadth across both cloud and local providers.
- **TUI ergonomics**: Compact composer (#52339), reorderable session tabs (#62646), session pinning in the experimental view (#59906), a functional which-key panel (#62650). A steady drumbeat of polish requests for the terminal UI.
- **Agent/session state control**: Preserve tab model across plan/build switches (#54375), stricter subagent follow-up semantics (#62793), per-agent tool visibility scoping for plugins (#24953).
- **Session management**: Pin sessions (#59906), structured cleanup/bounded growth (#62214), and future search over history (#62769 groundwork).
- **Progress visibility**: Keep loading indicators alive during background shells (#56660, #62668) — users want UI state to reflect real work.

## 7. Developer Pain Points

1. **Free tier reliability** — The dominant grievance. Resets that never happen, "all models blocked" states, and a 333-comment master thread (#59387, plus #58687, #62658) underscore that quota handling is both broken and poorly communicated.
2. **Background work correctness in V2** — A cluster of reproduced bugs (#48826, #62792, #62791, #56660, #62668) shows subagent/background execution and its UI/recovery state are the biggest source of silent data loss and confusion.
3. **Silent failures and no backoff** — Content-filter retries (#62619) and pre-collapse compaction aborts (#62778) burn tokens or kill turns without surfacing errors to the user.
4. **Local provider friction** — Ollama and other local runtimes hit compaction and discovery edge cases (#62778, #62765, #54011) that cloud users never see, frustrating the self-hosted segment.
5. **Cross-platform papercuts** — Windows drive-root resolution (#59889), Electron file-manager errors (#47722), and desktop sign-in 400s (#62631) accumulate into a rough experience outside the happy path.
6. **Tool/agent permission semantics** — Last-match-wins policy ordering (#62213) and subagent write denials suggest agent frontmatter rules need clearer precedence, which is a recurring source of security-relevant surprise.

</details>

<details>
<summary><strong>Pi</strong> — <a href="https://github.com/earendil-works/pi">earendil-works/pi</a></summary>

# Pi Community Digest — 2026-11-09

## 1. Today's Highlights

A quiet day on the release front (no new versions), but the issue tracker was busy: a wave of new bug reports around MCP OAuth handling, context accounting, and TUI keyboard quirks landed and was largely triaged/closed within 24h. Two notable themes stand out — reliability of remote MCP connections and prompt-cache/context accounting correctness — alongside a significant cost-saving PR for prompt cache warming in p2 (#11857).

---

## 2. Releases

No new releases in the last 24 hours.

---

## 3. Hot Issues

1. **#10287 [OPEN] `getContextUsage()` massively overestimates context after retryable network error**
   Context jumped from ~42k to 330,081 tokens after a WebSocket failure, which could silently trigger spurious compaction and burn tokens. High-impact correctness bug with active discussion (8 comments, 2 👍).
   https://github.com/earendil-works/pi/issues/10287

2. **#10162 [OPEN] Too many input images stop the agent task**
   Long-running agents (PR babysitting, QA) are being killed by image-heavy inputs, undermining Pi's core "run indefinitely with auto-compaction" value proposition. 8 comments, still open.
   https://github.com/earendil-works/pi/issues/10162

3. **#11932 [OPEN] Extension hook for agent auto-retry: let an extension set the delay or stop the retry**
   Proposes an `auto_retry_decision` event fired before `auto_retry_start`, giving extensions control over backoff and retry cancellation — a natural extension point for teams with strict rate-limit policies.
   https://github.com/earendil-works/pi/issues/11932

4. **#11918 [CLOSED] MCP tool calls return empty results despite a valid OAuth token (Google Workspace MCP)**
   Auth headers not carried after sign-in on remote streamable-HTTP MCP servers. Well-documented field evidence across three Google endpoints; closed same day.
   https://github.com/earendil-works/pi/issues/11918

5. **#11919 [CLOSED] MCP reconnection blocks 2–4 minutes on servers that cannot connect**
   Sequential reconnection of all MCP servers (including unauthenticated ones) blocks the session for minutes. Directly harms multi-server workflows.
   https://github.com/earendil-works/pi/issues/11919

6. **#11936 [CLOSED] kimi-coding rejects tool parameters with root `anyOf`**
   Two built-in tools cause HTTP 400 on Moonshot's Kimi. Indicates provider-schema compatibility gaps that affect any OpenAI-compatible backend.
   https://github.com/earendil-works/pi/issues/11936

7. **#11931 [CLOSED] openai-completions drops OpenRouter `native_finish_reason`**
   Losing `MALFORMED_FUNCTION_CALL` in favor of a generic `error` hides actionable diagnostics from the SDK layer. A small fix with outsized debugging value.
   https://github.com/earendil-works/pi/issues/11931

8. **#11926 [CLOSED] Transient states are treated as permanent errors**
   429s displayed in red and logged permanently to the session, conflating transient and hard failures. Affects UX perception of reliability.
   https://github.com/earendil-works/pi/issues/11926

9. **#11769 [CLOSED] Stable branch didn't get bumped for 1.5**
   Nix users following documented instructions are still pinned to v1.4. Release-engineering issue with real user impact.
   https://github.com/earendil-works/pi/issues/11769

10. **#11927 [CLOSED] Bug reports should not be auto-closed as "not planned"**
    Meta-issue about triage policy: bugs auto-closed for non-contributors. Sparked discussion on contribution/feedback ergonomics.
    https://github.com/earendil-works/pi/issues/11927

---

## 4. Key PR Progress

1. **#11857 [CLOSED] feat: prompt cache warming in p2**
   Refreshes Anthropic's 5-minute prompt cache to avoid full prompt rewrites. Reported to have caused ~$1,430 of extra spend across 789 events (26% of p2 spend). High-impact cost fix.
   https://github.com/earendil-works/pi/pull/11857

2. **#11934 [CLOSED] tui: decode mintty LF as Shift+Enter**
   Fixes Shift+Enter in fullscreen transcript search for Cygwin/MSYS2 users. Pairs with issue #11935.
   https://github.com/earendil-works/pi/pull/11934

3. **#11920 [CLOSED] fix(codemode): let scripts declare their own tools and console bindings**
   Resolves a `SyntaxError: invalid redefinition of parameter name` in codemode scripts that declare top-level `tools`/`console`. Fixes #11226.
   https://github.com/earendil-works/pi/pull/11920

4. **#11900 [CLOSED] docs: fix RFC link in CONTRIBUTING.md**
   Trivial doc fix — trailing slash 404.
   https://github.com/earendil-works/pi/pull/11900

*Note: Only 4 PRs were updated in the last 24h; the digest reflects the full set rather than padding to 10.*

---

## 5. Hot Discussions

**Show and tell**

- **#11930 Assistant UI adapter for Pi Durable** — A React runtime hook integrating Pi Durable with assistant-ui components (transcript rendering, streaming, thread navigation).
  https://github.com/earendil-works/pi/discussions/11930

- **#11922 omp-web: self-hosted browser workspace for Pi** — Web workspace for Pi, Oh My Pi, Claude Code, and Codex, designed for always-on Linux boxes accessed from laptop or phone.
  https://github.com/earendil-works/pi/discussions/11922

---

## 6. Feature Request Trends

- **Extension-system extensibility**: Requests for new hooks (#11932 auto-retry decision, #11924 `ui_prompt_start` carrying `blocked`) show demand for finer-grained control in the extension API.
- **Model/thinking-level UX**: #11929 asks to select thinking level at model-selection time; #11925 asks for `/clear` that preserves model and thinking level — users want more session-state granularity.
- **Context/prompt tooling**: Conditional `AGENTS.md` references (#11933) and clear-context commands indicate growing complexity in user-authored instruction sets.
- **Media support**: #2809 (video/audio attachments) resurfaced, reflecting Gemini-class multimodal use cases.
- **Multi-MCP status surfaces**: #10871 (publish MCP connection status for custom footers) points to a desire for richer MCP observability.

---

## 7. Developer Pain Points

- **MCP reliability and observability**: Auth headers lost after sign-in (#11918), sequential blocking reconnects (#11919), `tool_search` not finding directly-exposed MCP tools (#11921), and missing status in custom footers (#10871) all cluster around MCP as the current weak spot.
- **Context accounting correctness**: `getContextUsage()` overestimation (#10287) and image-induced task halts (#10162) undermine trust in Pi's auto-compaction, which is central to long-running agent workflows.
- **Error classification and diagnostics**: Transient 429s treated as permanent (#11926) and dropped `native_finish_reason` (#11931) make failure states harder to triage and debug.
- **Provider-schema incompatibilities**: Kimi rejecting root `anyOf` (#11936) shows gaps in OpenAI-compatible adapter normalization.
- **Release and triage process friction**: Stale `stable` branch (#11769) and auto-closing of bug reports (#11927) frustrate contributors and downstream packagers.
- **TUI keyboard quirks**: Shift+Enter issues persist across terminals (#4918, #11935, #11934), a long tail of platform-specific input handling bugs.

</details>

<details>
<summary><strong>Qwen Code</strong> — <a href="https://github.com/QwenLM/qwen-code">QwenLM/qwen-code</a></summary>

# Qwen Code Community Digest — 2026-11-09

## 1. Today's Highlights

Three release lines moved today across nightly CLI, TypeScript SDK, and Desktop, with the Desktop v0.27.0 landing a channel-recovery fix and the SDK v0.1.30 bundling CLI 0.27.0. Meanwhile, CI/Managed Agent gate failures continue to dominate issue volume — 9 of the top 30 issues are bot-filed CI failures — signaling that test stability is the project's single biggest operational drag right now. On the PR side, contributors pushed several substantial fixes: MCP connection repair after aborted calls, provider HTTP status preservation on headless errors, and ACP-managed skill review scheduling.

## 2. Releases

- **v0.26.9-nightly.20261107.65e1f1aeaa** — Docs for Wally as an OpenAI-compatible provider ([#16529](https://github.com/QwenLM/qwen-code/pull/16529)), plus a core sharing fix. ([release](https://github.com/QwenLM/qwen-code/releases))
- **sdk-typescript-v0.1.30** — Bundles CLI version 0.27.0, built from the same branch/ref as the SDK.
- **desktop-v0.27.0** — Fixes GitHub inbound recovery staying armed after a failed read ([#16402](https://github.com/QwenLM/qwen-code/pull/16402)); includes hardened core renew tests. Note: a fresh report says this build fails on Intel x64 Macs (see #16683).

## 3. Hot Issues

1. **[#14724](https://github.com/QwenLM/qwen-code/issues/14724) — Main CI failed: Managed Agent gate, no test identified** (OPEN, 277 comments). A long-lived bot-filed CI failure tracker with by far the highest engagement; the comment count reflects months of re-fires rather than active discussion.
2. **[#13078](https://github.com/QwenLM/qwen-code/issues/13078) — Daily dependency CVE audit failed** (OPEN, 45 comments). The scheduled security audit has been failing since late September — likely either a real high-severity finding or an npm audit endpoint outage. Security hygiene concern.
3. **[#16417](https://github.com/QwenLM/qwen-code/issues/16417) — Reject oversized `write_file` before generating it** (OPEN, 6 comments). Well-articulated enhancement: a single large write blows the output budget, the model generates everything, then the response is truncated and nothing is written. Author hit it 3× on one file.
4. **[#16191](https://github.com/QwenLM/qwen-code/issues/16191) — DaemonSessionProvider reconnect behavior +93 more failures** (OPEN, 6 comments). Large managed-agent CI cluster around session reconnect semantics.
5. **[#16091](https://github.com/QwenLM/qwen-code/issues/16091) — bun-pty no-gap toggles byte-exactness under 5000-line flood** (OPEN, 6 comments). macOS unit test flake in terminal rendering path; niche but indicative of PTY-layer test fragility.
6. **[#13519](https://github.com/QwenLM/qwen-code/issues/13519) — Background agents lose loop-detector name** (OPEN, 5 comments). Follow-up from #13466 review: `loopType` never reaches `ForkedAgentResult`. Explicitly promised by contributor, good community citizenship.
7. **[#16227](https://github.com/QwenLM/qwen-code/issues/16227) — GitHub channel can silently skip a comment at poll-cursor boundary second** (CLOSED, 5 comments). P2 integration bug: a comment created at exactly the cursor second can be permanently missed. Fixed and closed — strong signal on channel reliability.
8. **[#15276](https://github.com/QwenLM/qwen-code/issues/15276) — Windows desktop update fails, node.exe locked** (CLOSED, 5 comments). P1 installer bug: bundled Node runtime locks `node.exe` during in-app update. Closed with ready-for-human status.
9. **[#16173](https://github.com/QwenLM/qwen-code/issues/16173) — Allow models to refer to slices of files/tool outputs arbitrarily** (OPEN, 4 comments). Feature request targeting the `read > write > typo > re-write` loop by letting the model reference slices instead of duplicating content.
10. **[#16683](https://github.com/QwenLM/qwen-code/issues/16683) — Desktop 0.27 fails on Intel x64 Mac** (OPEN, 2 comments, created today). Fresh P1 platform bug: bundled runtime crashes with `Check failed: 12 == (*__error())` during startup. Directly affects today's release.

## 4. Key PR Progress

1. **[#16661](https://github.com/QwenLM/qwen-code/pull/16661) — fix(mcp): repair MCP connection torn down by aborted tool call.** Directly targets issue #12160: the abort path returned early without repairing the transport, leaving servers `DISCONNECTED` for the rest of the session. Now arms recovery on abort.
2. **[#16686](https://github.com/QwenLM/qwen-code/pull/16686) — feat(headless): keep provider HTTP status on terminal error results.** Machine-readable error envelopes gain an optional `status` field (401/429/5xx) so headless consumers can distinguish auth vs. rate-limit vs. server failures.
3. **[#16685](https://github.com/QwenLM/qwen-code/pull/16685) — fix(acp): schedule managed skill review on ACP turns.** Implements #12209's request: auto-skill review now runs on `qwen serve`/daemon/ACP-bridged turns instead of accumulating unread trigger state.
4. **[#16498](https://github.com/QwenLM/qwen-code/pull/16498) — feat(managed-agent): Tool v4 execution measurements.** Attested executor measurements persisted before acknowledgement, feeding tool/file summaries and paginated invocation details in the diagnostics panel.
5. **[#16602](https://github.com/QwenLM/qwen-code/pull/16602) — feat(channels): deliver bound-PR comments to every session that did not post them.** Default-on watch covering conversation and inline review comments, not filtered by the channel's GitHub account.
6. **[#16540](https://github.com/QwenLM/qwen-code/pull/16540) — fix(core): decode ANSI-C words and wrapper payloads with bash's rules.** Lexical-layer split from #16075: decodes `-c` option terminator by semantics, treats NUL as word end. Shell-parsing correctness for tool argument handling.
7. **[#16641](https://github.com/QwenLM/qwen-code/pull/16641) — feat(managed-agent): persist Session model statistics and request context.** Adds Public GET + WebShell query; Session diagnostics dialog gains Context and Model statistics tabs.
8. **[#16681](https://github.com/QwenLM/qwen-code/pull/16681) — feat(web-shell): commit only selected files from the commit view.** Checkbox-based partial commit from Web Shell; unchecked files stay in working tree. Practical workflow improvement.
9. **[#16659](https://github.com/QwenLM/qwen-code/pull/16659) — feat(ci): give the autofix address agent failed-check evidence** (CLOSED). Autofix loop now receives failing step names and redacted log excerpts instead of just check name + conclusion. Directly addresses the CI-failure noise problem below.
10. **[#16324](https://github.com/QwenLM/qwen-code/pull/16324) — feat(web-shell): let managed sessions reuse the host shell.** Removes the duplicated managed chrome (title/workspace/phase badge) when `showManagedSessionHeader: false`.

## 5. Hot Discussions

No discussion data was provided in the source. Omitted.

## 6. Feature Request Trends

- **Token/output-budget awareness before action**: #16417 (pre-flight `write_file` rejection) and #16173 (refer to file slices rather than duplicating) both attack wasted output budget and token-heavy read/write cycles. A third, #16191-adjacent reconnect work and #12209's ACP skill scheduling show memory/context lifecycle attention.
- **Local-model concurrency control**: #16526 requests that parallel sub-agents respect a global cap that also covers foreground launches — critical for single-GPU local Ollama users.
- **UI/rendering parity**: #16675 (render Exec code-mode tool calls as JavaScript, not JSON), #8544 (ACP task list not rendered in JetBrains), #11929 (Windows Terminal DECSET 2026 flicker). Users want Qwen Code's TUI to match Claude Code/Codex fidelity.
- **Session observability**: #16641, #16498 both push persisted statistics and execution measurements into Managed Sessions.

## 7. Developer Pain Points

1. **CI/Managed Agent gate instability is the dominant frustration.** Issues #14724 (277 comments), #11680, #16091, #16346, #16672, #16673, #16045, #15722, #16191, #16505 — more than a third of visible issues are bot-filed failures, many flagged "Provisional" because main advanced before the report finished. The volume itself (50 issues updated in 24h) suggests the test suite is the primary bottleneck, and PR #16659's evidence-injection for autofix agents is a direct mitigation attempt.
2. **Release/install platform breakage**: #15276 (Windows update locks node.exe) and #16683 (Desktop 0.27 crashes on Intel x64 Mac) — the latter is unfixed and affects today's release.
3. **Silent correctness bugs in infrastructure**: #16227 (missed comments at poll boundaries), #12113 (ACP reports `end_turn` on truncated responses), #12160 (MCP stays disconnected after abort — now being fixed). These erode trust in the channel/daemon layers.
4. **Token-limit friction** remains the most repeated user-facing complaint: truncation-after-full-generation (#16417) and duplicated content in read/write cycles (#16173).
5. **Shell/terminal environment quirks**: Windows Terminal flicker (#11929) and bash lexical parsing (#16540) show that cross-platform shell emulation continues to need hardening.

**Sources:** [github.com/QwenLM/qwen-code](https://github.com/QwenLM/qwen-code)

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*