# AI CLI Tools Community Digest 2026-11-02

> Generated: 2026-11-02 00:34 UTC | Tools covered: 7

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
**Digest Date: 2026-11-02**

---

## 1. Ecosystem Overview

The AI CLI tool landscape on 2026-11-02 shows a market in consolidation-and-reliability phase: release cadence is quieter than feature velocity, with four of seven tools shipping nothing in the last 24 hours and the rest issuing patch-level or undocumented alpha builds. Community attention has shifted decisively from "what can these agents do" to "why do they break" — quota/rate-limit interruptions, destructive-mode bugs, silent configuration drift, and CI/upgrade fragility dominate every tracker. Multi-agent orchestration (subagents, delegation, plan/build modes) is the most consequential new capability and simultaneously the largest new failure surface, with reports of hangs, misreported success, and mode desync. Meanwhile, cost and context control — compaction, cache invalidation, token accounting — has emerged as a first-class engineering concern as long-horizon sessions become the norm. Data-loss and privacy papercuts (transcript deletion, world-readable error reports, secrets in context) recur across nearly every project.

---

## 2. Activity Comparison

| Tool | Hot Issues Tracked | Key PRs | Discussions | Release Status |
|---|---|---|---|---|
| **Claude Code** | 10 (7 closed as dup, 3 open) | 7 | N/A (none supplied) | No release (24h) |
| **OpenAI Codex** | 10 (1 closed) | 10 | 8 active | 2 alpha cuts (`rust-v0.167.0-alpha.2/.3`), no notes |
| **Gemini CLI** | 10 + 3 honorable | 10 + 2 db | N/A (none supplied) | 1 nightly; no stable |
| **GitHub Copilot CLI** | 10 (1 closed) | 0 | N/A (none supplied) | Patch `v1.0.106-2` |
| **OpenCode** | 10 (4 closed) | 10 | N/A (none supplied) | No release (24h) |
| **Pi** | 10 + 5 honorable | 3 | 2 | No release (24h) |
| **Qwen Code** | 10 | 10 | N/A (none supplied) | `v0.26.5` (+nightly +Desktop) — partially broken |

**Notes for interpretation:**
- All counts are *hot-item tallies* from each digest, not raw repo totals. These projects use different issue-triage norms (Claude Code closes heavily as duplicates; OpenCode runs long-lived megathreads; Qwen Code carries a 147-comment CI thread).
- **Claude Code** and **Pi** have the thinnest PR flow today (7 and 3 respectively); **Copilot CLI** had literally zero PR activity, with all movement on the issue side — a pipeline stall worth noting.
- **Codex** is the only tool with a healthy *Discussions* stream (Q&A, Show-and-tell, Ideas), suggesting a broader community beyond bug reports.
- **Qwen Code** is the only project to ship a stable release — but its sandbox image failed to publish, so the release is half-landed.

---

## 3. Shared Feature Directions

Cross-cutting demands appearing in two or more communities:

1. **Automatic resume after quota/limit reset** — *Codex (#21073 👍89, #28931 👍76, plus 5 more), Pi (#10480, 👍3), OpenCode (#59387 megathread)*. The dominant theme of the day. Users want the already-known reset timestamp to trigger an opt-in "wake up and continue" instead of manual intervention. Codex also surfaces **active backlash against merging ChatGPT and Codex quotas** (#58530, #58655).

2. **Trustworthy agent termination & mode semantics** — *Gemini CLI (#22323, #21409, #21983), OpenCode (#53955, #61010)*. Subagents misreport forced termination (`MAX_TURNS`) as `GOAL` success; generalist agents hang; plan mode is not authoritative (agent edits files anyway, or refuses valid work). Users across both tools are *disabling delegation* as a workaround.

3. **Context/compaction correctness** — *Codex (#57806 — compaction wipes state), Pi (#8301, #10885, #10287 — overflow undetected, `getContextUsage()` overestimates 8x), Gemini CLI (#22745, #19561), Qwen Code (#14953), Copilot CLI (#5317 — `/compact` invalidates prompt cache)*. Every community reports compaction as a source of correctness bugs or cost surprises.

4. **Silent configuration that doesn't apply** — *Gemini CLI (#22267 Browser Agent ignores settings.json; #20079 symlinked agents), Pi (settings audit #11662/#11663 — 4 unreachable keys), Copilot CLI (#4560 reasoning effort under `auto`), Claude Code (#80902 subagents default to `claude-fable-5` despite session model)*. A recurring class of bug eroding operator trust.

5. **Permission & sandbox hardening** — *Qwen Code (#13570 false-positive on `--amend` text; PR #14748 gates project hooks), Codex (#28437 `PreToolUse` ask; #58437 actionable denial details), OpenCode (#61121 `worktree_remove` gated only by `edit`; #60958), Gemini CLI (#22672 discourage destructive git/db ops), Copilot CLI (#5311 approved paths still prompt)*. Consensus that guards must be **parsed, not regex-matched**, and that escalation paths (`/approve`, hooks) must exist.

6. **Data-loss and privacy papercuts** — *Claude Code (#78439 corrupted-backup eviction; #105498 transcript deletion despite "Never"), Gemini CLI (#30088 chat history in world-readable temp dirs), Codex (two Show-and-tell projects — #58749 Cloakroom, #58492 Bossanova — targeting secrets-in-context), Pi (#11026 no delete primitive; privacy/GDPR)*.

7. **Cross-device / remote-session continuity** — *Copilot CLI (#5313 iOS stuck "Working", #5315/#5316 mobile features), Codex (#57721 mobile-created chats report browser disabled), Claude Code (#105671/#105926 Remote Control killed by auto-updates)*.

8. **Model flexibility / BYOK** — *Copilot CLI (#3709 👍34 — top-voted; BYOK pins session to one model), OpenCode (#52567 DigitalOcean provider), Pi (#11658 glm-5.3), Codex (implicit in quota-policy threads)*.

---

## 4. Differentiation Analysis

| Dimension | Claude Code | OpenAI Codex | Gemini CLI | Copilot CLI | OpenCode | Pi | Qwen Code |
|---|---|---|---|---|---|---|---|
| **Primary focus** | Desktop UX + MCP reliability | Quota/rate-limit UX + TUI | Subagent orchestration honesty | Accessibility + model sessions | Free-tier UX + core perf | Durable/embedded runtime | Managed Agent + CI |
| **Target user** | Desktop power user / MCP integrators | ChatGPT Plus/Pro devs | Multi-agent early adopters | Enterprise/GitHub-native | Cost-sensitive / OSS | Platform embedders | Infra-heavy teams |
| **Technical signature** | Duplicate-consolidation triage; plugin API churn | Rust rewrite, alpha cadence, advisory CI | Sandbox-intent routing (#19873), AST-read EPIC | Screen-reader care, zero-PR cycle | SQLite WAL tuning (−84%), V2 plugin API | Durable Objects/SQLite, handoff semantics | SQL-bounded history, hooks approval |
| **Weakest surface** | Windows desktop; config eviction | Quota policy; Windows `blocked by policy` | Browser Agent (Wayland, locks, settings) | Auth/network edge cases | Plan mode; shell timeout hangs | Provider quirks (Bedrock); storage depth | CI (8+ top issues); release pipeline |
| **Governance signal** | Moving triage to Sonnet 5.5 (PR #106583) | BuildBuddy key revoked — Build pause | Security PRs (OAuth dispatcher, temp-dir) | Patch-only, no PRs today | Perf/reliability focused core | Small PR flow; community-led fixes | Required checks red on main (#14724, 147 comments) |

**Key differentiators:**
- **Claude Code** is dealing with a *quality-assurance backlog*: a large batch of Windows desktop regressions closed as duplicates today, plus long-standing data-loss issues (#78439 open since July) — mature but with surface-area debt.
- **Codex** is investing in *TUI/telemetry infrastructure* (inset rendering, session adoption, voice deps) while the community's overwhelming demand is quota UX — a visible roadmap/community mismatch.
- **Gemini CLI** is the only tool where *agent philosophy* is actively debated (#19873: fewer bespoke tools, native bash affinity + sandboxing) — it is experimenting, not just fixing.
- **Copilot CLI** is the most *accessibility-minded* (screen-reader release) but has the least contributor energy today (0 PRs).
- **OpenCode** is doing the deepest *systems engineering* (SQLite write reduction, change-sequence endpoints) — infrastructure for scale.
- **Pi** is the most *platform-embedder-oriented* (durable storage CRUD, Durable Objects, handoff semantics) — it is building a runtime, not an app.
- **Qwen Code** uniquely combines *release engineering* (bounded SQL history) with *self-inflicted infrastructure pain* (unpublished sandbox image, disk exhaustion).

---

## 5. Community Momentum & Maturity

**Highest sustained engagement:**
- **OpenCode** — the free-tier megathread at 195 comments is the single most active thread across all seven tools, indicating both a large user base and an unresolved core problem.
- **Qwen Code** — the CI thread (#14724) at 147 comments over 6+ weeks reflects chronic infrastructure instability rather than a feature debate; several *required* checks are red, blocking unrelated PRs.
- **Codex** — the only tool with a multi-format Discussions stream (Q&A, Show-and-tell, Ideas), suggesting a community that has moved beyond filing bugs to building on the platform (Cloakroom, Bossanova, Wudland, 79-skill pack).

**Fastest iterating:**
- **Codex** (2 alpha cuts/day + 10 substantive PRs spanning Bazel, voice, TUI, OSC 52) and **Gemini CLI** (nightly + 10 PRs touching security, retries, headless resilience) are shipping the most change per cycle.
- **Qwen Code** shows the most release discipline but also the most release fragility.

**Most mature community operations:**
- **Gemini CLI** — high-priority (P1) bugs are labeled and tracked (#22323, #21409, #21983), EPICs are run openly (#22745), and PRs are categorized by theme (security, non-interactive, agent).
- **Claude Code** — automated dedupe/triage is being upgraded to Sonnet 5.5, which explains today's heavy duplicate-closure pattern; efficient, but the open data-loss issues show triage ≠ resolution.

**Thinnest today:**
- **Copilot CLI** (0 PRs, patch-only release) and **Pi** (3 PRs) — but both have focused, high-signal issue streams rather than noise.

**Overall maturity ranking (today's signals):** Claude Code ≈ Codex ≈ Gemini CLI (operationally mature, large user bases) > OpenCode ≈ Qwen Code (high engagement, core problems unresolved) > Pi (niche, coherent, platform-oriented) > Copilot CLI (quietest, but only a patch release).

---

## 6. Trend Signals

**For technical decision-makers:**

1. **Quota economics is now a product feature, not a billing detail.** Auto-resume-on-reset is the #1 request in two communities; quota-merger backlash is a new signal. *Implication:* platform teams should design opt-in "pause and resume" primitives and expose reset timestamps as API-usable data.

2. **Multi-agent orchestration is shipping faster than it is trustworthy.** Hangs, misreported success, ignored config, and mode desync are consistent across Gemini CLI and OpenCode. *Implication:* treat subagent delegation as **beta**; require honest termination reporting and settings-honoring before production dependency; expect users to run without delegation as a workaround.

3. **Context management is the next competitive frontier.** Compaction correctness, token accounting accuracy, cache-preserving compaction, and AST-aware reads appear in five communities. *Implication:* tools that solve *provable* context accounting will differentiate on cost and long-horizon reliability.

4. **"Parse, don't regex" is the emerging security consensus.** Qwen Code's amend-text false positive (#13570), Codex's policy blocks, and OpenCode's permission holes all point the same way. *Implication:* permission layers must parse structured invocations and offer explicit escalation paths (`/approve`, hook-driven `ask`), or they will block legitimate work and train users to disable guards.

5. **Data-loss and privacy papercuts are trust-eroding at scale.** Transcript deletion, backup eviction, world-readable error reports, and no-delete storage primitives recur everywhere. *Implication:* durability guarantees (backup integrity, retention that respects settings, secure deletions) are table stakes for enterprise adoption.

6. **Remote/mobile continuity is the fastest-growing surface and the least stable.** iOS stuck states, mobile-created sessions, Remote Control killed by auto-updates. *Implication:* silent auto-updates are an anti-feature for remote workflows — make updates explicit or session-preserving.

7. **CI/infra health is a competitive signal.** Qwen Code's red required checks and Claude Code's dedupe automation show the two ends of the spectrum. *Implication:* teams evaluating these tools for internal use should weight release-pipeline reliability and upgrade-path safety (Windows locks, AppImage library holes) as heavily as feature lists.

8. **Secrets-in-context anxiety has no first-class solution yet.** Two independent Codex community projects target the same gap. *Implication:* a first-class secret-redaction/placeholder layer is an unclaimed feature category across the entire ecosystem.

---

*Prepared from seven community digests dated 2026-11-02. Counts are hot-item tallies as reported per digest; raw repository totals may differ. "N/A" denotes channels omitted or not supplied upstream, not inactivity. Two tools (Codex, Pi) reported Discussion data; the remaining five did not, so cross-tool Discussion comparisons should be read with that constraint.*

---

## Per-Tool Reports

<details>
<summary><strong>Claude Code</strong> — <a href="https://github.com/anthropics/claude-code">anthropics/claude-code</a></summary>

## Claude Code Skills Highlights

> Source: [anthropics/skills](https://github.com/anthropics/skills)

# Claude Code Skills — Community Highlights Report
*Data source: github.com/anthropics/skills | Snapshot: 2026-11-02*

---

## 1. Top Skills Ranking (by discussion activity)

> Note: The PR listing shows `Comments: undefined` for all entries, so ranking below is derived from issue-level comment counts, 👍 reactions, and cross-referenced PR/Issue activity.

**1. Security: Namespace Trust Boundary Abuse** — Issue #492 (46 comments, 👍3) 🔥
- **Topic:** Community skills distributed under the `anthropic/` namespace impersonate official skills, enabling trust-boundary abuse.
- **Highlights:** Longest-running community debate; touches governance, distribution, and permission model. Not a "skill" per se but the most-discussed item in the ecosystem.
- **Status:** OPEN | [Issue #492](https://github.com/anthropics/skills/issues/492)

**2. Org-Wide Skill Sharing** — Issue #228 (17 comments, 👍8)
- **Topic:** Request for a shared skill library / direct share links in Claude.ai.
- **Highlights:** Highest 👍 count in the top 15. Strong signal for enterprise adoption pain points.
- **Status:** OPEN | [Issue #228](https://github.com/anthropics/skills/issues/228)

**3. `run_eval.py` Trigger Failure** — Issue #556 (13 comments, 👍7)
- **Topic:** `claude -p` never triggers skills/commands in eval harness (0% trigger rate).
- **Highlights:** Undermines the entire skill-creator evaluation loop — high-severity for skill authors.
- **Status:** OPEN | [Issue #556](https://github.com/anthropics/skills/issues/556)

**4. `skill-creator` Best Practices Overhaul** — Issue #202 (8 comments, 👍1)
- **Topic:** skill-creator reads like dev docs, not an operational skill; verbose, token-inefficient.
- **Highlights:** Directly addresses meta-quality of the skills factory itself.
- **Status:** CLOSED | [Issue #202](https://github.com/anthropics/skills/issues/202)

**5. Reasoning Quality Gate Pipeline** — Issue #1385 (7 comments, 👍1)
- **Topic:** Three-gate pipeline: Pre-task Calibration → Adversarial Review → Delivery Verification.
- **Highlights:** Ambitious meta-framework proposal spanning full session lifecycle.
- **Status:** OPEN | [Issue #1385](https://github.com/anthropics/skills/issues/1385)

**6. `compact-memory`** — Issue #1329 (10 comments)
- **Topic:** Symbolic notation for compact agent state; reduces context spent on notes/persistent memory.
- **Highlights:** Addresses context-window pressure — aligned with Issue #1487's ~156k token blowup complaint.
- **Status:** OPEN | [Issue #1329](https://github.com/anthropics/skills/issues/1329)

**7. `claude-api` Token Blowup** — Issue #1487 (4 comments)
- **Topic:** Skill eagerly injects ~156k tokens, exhausting context in a single tool call.
- **Highlights:** Concrete performance regression in a bundled official skill.
- **Status:** OPEN | [Issue #1487](https://github.com/anthropics/skills/issues/1487)

**8. `agent-governance`** — Issue #412 (6 comments)
- **Topic:** Policy enforcement, threat detection, trust scoring, audit trails for AI agents.
- **Highlights:** Fills a governance gap in the collection.
- **Status:** CLOSED | [Issue #412](https://github.com/anthropics/skills/issues/412)

---

## 2. Community Demand Trends (from Issues)

| Direction | Evidence | Signal Strength |
|---|---|---|
| **Security & Trust** | #492 (namespace abuse), #1394 (XSS in eval-viewer), #1980 (shell injection) | 🔥🔥🔥 Very High |
| **Context/Memory Efficiency** | #1487 (156k tokens), #1329 (compact-memory) | 🔥🔥🔥 Very High |
| **Enterprise Sharing & Distribution** | #228 (org-wide library), #189 (duplicate installs) | 🔥🔥 High |
| **Eval / Test Harness Reliability** | #556 (0% trigger), #1390 (0/N score) | 🔥🔥 High |
| **Skill Meta-Quality** | #202 (skill-creator rewrite), #2064 (description trigger quality) | 🔥🔥 High |
| **Quality-Gate / Governance Frameworks** | #1385 (three-gate pipeline), #412 (agent-governance) | 🔥 Medium |

**Takeaway:** Demand is shifting from "more skills" toward **making existing skills safe, cheap, and reliable** — trust, token cost, and evaluation fidelity dominate.

---

## 3. High-Potential Pending Skills (OPEN PRs worth watching)

**🟢 `pyxel` — Retro Game Development** 
- Author: kitao | Created 2026-03-05, updated 2026-11-01 (8 months persistent)
- Long-lived PR with continuous activity — suggests active maintainer interest.
- [PR #525](https://github.com/anthropics/skills/pull/525)

**🟢 `document-typography` — Typographic QC** 
- Author: PGTBoos | Solves orphan/widow/numbering issues in AI-generated docs — universal pain point.
- [PR #514](https://github.com/anthropics/skills/pull/514)

**🟢 `scnet-hpc` — HPC Cluster Ops** 
- Author: lql341 | SSH + Slurm workflows; rare vertical domain (scientific computing).
- [PR #1615](https://github.com/anthropics/skills/pull/1615)

**🟢 `md2video-audio` — Markdown → MP4** 
- Author: 70v-Yoyo | Marp slides + human-like voiceover; zero-cost pipeline.
- [PR #1703](https://github.com/anthropics/skills/pull/1703)

**🟢 `notion-spec-to-implementation` + `quantitative-resume-auditor`** 
- Author: mrdesouzaphd-cmyk | Spec → Notion tasks; two-in-one submission.
- [PR #1245](https://github.com/anthropics/skills/pull/1245)

**🟢 `proofcore-contract-auditor` — Web3 Static Analysis** 
- Author: ProofCore-Protocol | Solidity/Rust audit + TON Blockchain anchoring.
- [PR #1771](https://github.com/anthropics/skills/pull/1771)

**🟢 `ODT` — OpenDocument Support** 
- Author: GitHubNewbie0 | Fills the .odt/.ods gap alongside docx/pptx/pdf.
- [PR #486](https://github.com/anthropics/skills/pull/486)

**🔧 Notable `skill-creator` fixes in flight:** #1298 (trigger eval isolation), #1681 (direct execution), #1997 (YAML frontmatter parsing)
**🔧 Notable `mcp-builder` fix:** #1742 (mcp>=2 streamable_http_client rename) — fixes #1668

---

## 4. Skills Ecosystem Insight

> **The community's most concentrated demand is not for new skills, but for structural reliability — trusted distribution (`anthropic/` namespace abuse), low-token-footprint execution, and working evaluation harnesses — because the ecosystem currently cannot validate or safely ship the skills it already has.**

---

*Report generated for anthropics/skills | 50 PRs + 50 Issues sampled | Links verified against listing snapshot*

---

# Claude Code Community Digest — 2026-11-02

## 1. Today's Highlights

There were no new releases in the last 24 hours, but the issue tracker is highly active with a large batch of desktop-app regressions being closed as duplicates — most notably the missing Routines sidebar, the usage-ring context window regression, and the dead-key input bug on Windows. A consistent theme in today's activity is that several distinct reports are converging on the same underlying defects (Routines sidebar, prompt suggestions, context popover, MCP scope handling), suggesting maintainers are consolidating duplicates ahead of a fix. On the PR side, triage/dedupe automation is being moved to Claude Sonnet 5.5, while a backlog of documentation and plugin fixes from external contributor `nielskaspers` closes out.

## 2. Releases

No new releases in the last 24 hours. (Omit.)

## 3. Hot Issues

1. **#102247 [CLOSED] Routines sidebar section hidden after update** — [link](https://github.com/anthropics/claude-code/issues/102247)
   Windows desktop regression where scheduled Routines vanish from the sidebar and run sessions become unreachable. 8 comments, 5 👍; closed as duplicate, indicating widespread impact across the 2.37337.1 build.

2. **#102185 [CLOSED] Prompt suggestions no longer appear (Windows)** — [link](https://github.com/anthropics/claude-code/issues/102185)
   The composer stuck showing "Enter to send, Ctrl+Enter to queue" with no suggested prompts. 6 👍, closed as bug — a UX regression affecting everyday Code-tab flow.

3. **#101012 [OPEN] Windows TaskStop leaves orphaned Git Bash child processes** — [link](https://github.com/anthropics/claude-code/issues/101012)
   Background-task kill doesn't reap `grep`/`find`/`du`/`sleep` children, which linger for hours. Still open with a repro — a genuine resource-leak hazard for Windows users.

4. **#104833 [CLOSED] MCP servers from project/local scope removed on 2nd message** — [link](https://github.com/anthropics/claude-code/issues/104833)
   MCP servers silently drop after the first message in sessions launched from pre-warmed "spare" instances. 5 👍, closed — significant reliability concern for MCP-dependent workflows.

5. **#78439 [OPEN] Backup retention evicts last good `.claude.json` after corruption** — [link](https://github.com/anthropics/claude-code/issues/78439)
   `keep-last-5` counts corrupted backups toward the cap, making config loss permanent. Open, data-loss severity, still unresolved since July.

6. **#105498 [CLOSED] Desktop silently deletes transcripts after 30 days despite "Never" setting** — [link](https://github.com/anthropics/claude-code/issues/105498)
   Sessions older than ~30 days open empty and are marked `transcriptUnavailable`. Closed as duplicate — data-loss with strong community concern.

7. **#80902 [OPEN] Subagents default to `claude-fable-5` while session is Opus** — [link](https://github.com/anthropics/claude-code/issues/80902)
   Silent, more-expensive default that ignores the session model and any config. Open since July, low vote count but notable cost impact.

8. **#105881 [OPEN] Session paused by Opus 5.5 cyber safeguard during legitimate security work** — [link](https://github.com/anthropics/claude-code/issues/105881)
   Over-broad safeguard flagging non-cyber work, interrupting legitimate security tasks. Open — a recurring friction point with newer model safeguards.

9. **#91779 [CLOSED] CoworkVMService fails crash-recovery config, blocks Desktop startup** — [link](https://github.com/anthropics/claude-code/issues/91779)
   "Access is denied" leaves the service down until a full reboot. Closed as duplicate alongside #89711/#85840 — a cluster of Windows service-install defects.

10. **#103814 [CLOSED] Plugin Button presses refused (`ui_press handled:false`)** — [link](https://github.com/anthropics/claude-code/issues/103814)
    Button handles held per-site and renumbered on props change, breaking multi-client interaction. Closed as duplicate — an architecture-level plugin API issue.

## 4. Key PR Progress

1. **#106583 Move issue triage and dedupe workflows to Sonnet 5.5** — [link](https://github.com/anthropics/claude-code/pull/106583)
   Migrates `claude-issue-triage.yml`, `claude-dedupe-issues.yml`, and `claude.yml` to the 5.5 family — directly relevant given today's heavy dedup activity.

2. **#19866 fix(ralph-wiggum): handle empty `PROMPT_PARTS` with `set -u`** — [link](https://github.com/anthropics/claude-code/pull/19866)
   Fixes a crash when running `/ralph-loop` without arguments.

3. **#19867 fix(code-review): allow re-reviews when new commits are pushed** — [link](https://github.com/anthropics/claude-code/pull/19867)
   Adds smarter skip logic and a `--force` flag for the code-review plugin.

4. **#24360 docs: add configuration file reference to README** — [link](https://github.com/anthropics/claude-code/pull/24360)
   Documents the `~/.claude.json` vs `~/.claude/settings.json` scope/precedence distinction.

5. **#40822 docs(vscode): add "Not responding" status bar guidance** — [link](https://github.com/anthropics/claude-code/pull/40822)
   Clarifies the ~60s no-response warning state versus normal spinner progress.

6. **#44071 docs: capitalize 'Get Started' heading** — [link](https://github.com/anthropics/claude-code/pull/44071)
   Trivial README heading consistency fix.

7. **#50672 docs(changelog): fix skill name in 2.1.111 entry** — [link](https://github.com/anthropics/claude-code/pull/50672)
   Corrects `/less-permission-prompts` → `/fewer-permission-prompts`.

*(Only 7 PRs were updated in the window; all are listed above.)*

## 5. Hot Discussions

No discussion data was provided. (Omit.)

## 6. Feature Request Trends

- **Session/archive management**: Multiple requests (#104573, #104004, #105723) ask for a sidebar toggle to view archived sessions and per-machine (non-synced) sidebar group/sort settings.
- **Desktop UX toggles**: Suppressing the clipboard-change warning toast (#89559) and restoring the context-window line in the usage popover (#102615, #102204).
- **Account/auth flexibility**: Allowing users to change the email on an existing account (#103389, follow-up to #61022).
- **Remote Control resilience**: Requests to keep Remote Control alive across silent auto-updates (#105671, #105926).

## 7. Developer Pain Points

- **Silent auto-updates disrupt work**: Two separate reports (#105671, #105926) describe background updates stopping all local sessions and leaving Remote Control down, stranding remote users.
- **Data loss & config corruption**: Corrupted-backup eviction (#78439) and transcript deletion despite "Never" (#105498) are high-severity recurring complaints.
- **Windows desktop instability**: A large share of today's issues are Windows-specific desktop regressions — Routines sidebar (#102247, #104237), prompt suggestions (#102185, #103159), dead keys (#106555, #106602), and CoworkVMService failures (#89711, #91779).
- **MCP scope/reliability**: MCP servers dropping mid-session (#104833) erodes trust in project/local MCP configs.
- **Model/safeguard friction**: Subagents silently using an unexpected model (#80902) and over-broad Opus 5.5 safeguards pausing legitimate work (#105881).

*Note: No GitHub Discussions data was supplied; Section 5 is omitted per instructions. PR "Comments" fields were undefined in the source data.*

</details>

<details>
<summary><strong>OpenAI Codex</strong> — <a href="https://github.com/openai/codex">openai/codex</a></summary>

# OpenAI Codex Community Digest — 2026-11-02

## 1. Today's Highlights

Two new alpha builds shipped (`rust-v0.167.0-alpha.2` and `.3`) with no public changelog, while a large batch of PRs landed focused on TUI telemetry, session management, and pausing Bazel-based release artifacts after a revoked BuildBuddy key. The community's attention is overwhelmingly on **rate limits**: more than half of the top 30 issues ask for auto-resume after quota resets, and two new threads push back hard on the reported plan to merge ChatGPT and Codex quotas in December. Cross-device and attachment handling also surfaced several fresh bugs (XLSX/PPTX send spinning, stale approval modals).

## 2. Releases

- **rust-v0.167.0-alpha.3** — `0.167.0-alpha.3` (no release notes) — [Release](https://github.com/openai/codex/releases)
- **rust-v0.167.0-alpha.2** — `0.167.0-alpha.2` (no release notes) — [Release](https://github.com/openai/codex/releases)

Both are pre-release alpha cuts; the only substantive signal is PR #58757, which removes Bazel outputs from DotSlash configs because they are absent from the Cargo-only release asset fixture for `0.167.0-alpha.2`.

## 3. Hot Issues

1. **#21073 — Auto-resume CLI session when usage limit resets** (23 comments, 👍89) — The single most-upvoted open request: when Codex hits a quota mid-task and reports the reset time, the session should resume automatically instead of waiting for a human. [Link](https://github.com/openai/codex/issues/21073)
2. **#57721 — macOS: mobile-created remote chats report browser disabled** (17 comments) — Remote chats created entirely from Android cannot access the connected Mac until a desktop message "initializes" the thread. High impact for remote/mobile workflows. [Link](https://github.com/openai/codex/issues/57721)
3. **#53042 — macOS Quick Chat no longer launches** (15 comments, 👍24) — Quick Chat and its native window service are absent in build 26.1007.30912; a regression in a frequently used entry point. [Link](https://github.com/openai/codex/issues/53042)
4. **#28931 — Auto-resume `/Goal` after 5h limit reset** (15 comments, 👍76) — The App-side twin of #21073; strong consensus that paused Goals should resume once quota refreshes. [Link](https://github.com/openai/codex/issues/28931)
5. **#45873 — ChatGPT Desktop personalization shows Codex settings** (14 comments) — A UI/settings bleed between the ChatGPT desktop app and Codex, confusing Plus users. [Link](https://github.com/openai/codex/issues/45873)
6. **#56941 — Windows UI lag persists after Computer Use** (13 comments) — System-wide sluggishness that only resolves when `codex-computer-use.exe` is killed; a serious performance/cleanup bug on Windows. [Link](https://github.com/openai/codex/issues/56941)
7. **#58530 — Preserve separate ChatGPT and Codex allowances on Plus** (10 comments, 👍17) — Direct feedback against unifying quotas; argues the two products serve distinct usage patterns. [Link](https://github.com/openai/codex/issues/58530)
8. **#28437 — `PreToolUse` hook `permissionDecision: "ask"`** (9 comments, 👍9) — Requests native escalation of tool calls into human approval prompts; references prior closed PR #20702. [Link](https://github.com/openai/codex/issues/28437)
9. **#57806 — Context compaction loses all context** (2 comments) — On `gpt-6-astra`, compaction can wipe the working state entirely and the model asks "What would you like to work on?" — an alarming correctness issue for long sessions. [Link](https://github.com/openai/codex/issues/57806)
10. **#58655 — Do NOT merge ChatGPT Web and Codex quotas in December** (2 comments, 👍5) — Newest entry in the quota-merge backlash, framed around scientific/engineering workflows. [Link](https://github.com/openai/codex/issues/58655)

## 4. Key PR Progress

1. **#58717 — Make Bazel checks advisory and pause Bazel release artifacts** — BuildBuddy key revoked; Bazel removed from blocking CI and releases revert to Cargo-only artifacts. [Link](https://github.com/openai/codex/pull/58717)
2. **#58719 — Wire native voice dependencies into full Rust CI** — Builds voice SDK/runtime artifacts via Bazel across Linux/macOS/Windows on x64 and ARM64, with musl kept separate. [Link](https://github.com/openai/codex/pull/58719)
3. **#58727 — Use local Bazel for voice release builds** — Empties `BUILDBUDDY_API_KEY` so voice release builds use local Bazel configuration. [Link](https://github.com/openai/codex/pull/58727)
4. **#58716 — OSC 52 clipboard forwarding through GNU screen** — Detects GNU screen via `STY`, wraps sequences in DCS passthrough, and chunks to 252 bytes for screen's legacy 256-byte limit. [Link](https://github.com/openai/codex/pull/58716)
5. **#58718 — Render TUI conversations within an inset area** — Splits rendering into prepare/paint/post-draw phases, enabling bounded transcript layout and overlays. [Link](https://github.com/openai/codex/pull/58718)
6. **#58720 — Prioritize pending approvals in the subagent picker** — `/subagents` now groups approval-waiting threads first with "(needs approval)" markers and live refresh. [Link](https://github.com/openai/codex/pull/58720)
7. **#58713 — Extract fresh session adoption from TUI startup** — Introduces `PreparedFreshSession`/`adopt_fresh_session` to clean up thread activation and settings application. [Link](https://github.com/openai/codex/pull/58713)
8. **#58722 — Naming and navigation helpers for TUI backend sessions** — Adds `BackendSessions` helpers for cycling/wrapping listening backends and skipping closed streams. [Link](https://github.com/openai/codex/pull/58722)
9. **#58751 — Release superseded assistant text from live paginated history** — Evicts older completed assistant text to bound memory while preserving full resume responses. [Link](https://github.com/openai/codex/pull/58751)
10. **#58767 — Validate `/fork` before consuming the composer draft** — Defers draft consumption until dispatch validates the thread, preserving text and image attachments on rejected forks. [Link](https://github.com/openai/codex/pull/58767)

## 5. Hot Discussions

**Ideas / Workflow patterns**
- **#57746 — Zozo: issue-to-PR example + review checklist** — An inspectable backlog-coordination example with concrete review criteria for coding agents. [Link](https://github.com/openai/codex/discussions/57746)
- **#58735 — Codex Context Weather** — Dated context gauge, threshold alerts, and a handoff workflow to mitigate long-conversation context drift. [Link](https://github.com/openai/codex/discussions/58735)

**Q&A**
- **#58546 — Supported same-ID migration of indexed paginated history** — Asks for the canonical way to move a local conversation (history, attachments, stop point) between Windows and Mac while preserving identity and model context. [Link](https://github.com/openai/codex/discussions/58546)
- **#58756 — External STDIO MCP: recipient identity and response-delivery contract** — Whether the desktop's stdio MCP integration exposes a trusted, non-overridable identity binding for requests/responses. [Link](https://github.com/openai/codex/discussions/58756)

**Show and tell**
- **#58749 — Cloakroom** — Hook-based placeholder substitution so Codex never sees real secrets in `.env` or command output; works for CLI and app. [Link](https://github.com/openai/codex/discussions/58749)
- **#58492 — Bossanova** — Local encrypted vault with an optional MCP bridge to keep API keys out of the conversation. [Link](https://github.com/openai/codex/discussions/58492)
- **#58738 — Wudland** — iPhone app rendering Codex sessions as pixel villagers; one-line config hookup. [Link](https://github.com/openai/codex/discussions/58738)
- **#58618 — Free 79-skill agent pack** — MIT-licensed SKILL.md collection installable in Codex via `npx skills add`. [Link](https://github.com/openai/codex/discussions/58618)

## 6. Feature Request Trends

1. **Automatic session/Goal resume after quota reset** — Dominant theme across #21073, #28931, #31386, #48392, #43605, #44987, #34188: an opt-in "wake up and continue" path using the already-known reset timestamp.
2. **Quota policy feedback** — Multiple threads (#58530, #58655) oppose merging ChatGPT and Codex allowances; #32218 proposes *queuing a banked reset* for automatic redemption when a limit is exhausted.
3. **Granular, auditable sandbox/approval control** — #28437 (hook-driven `ask` decisions), #58437 and #55556 (actionable denial details, `/approve` availability on Windows).
4. **Cross-device continuity** — Mobile↔desktop parity: #57721, #43034, #56764, #52015 (read-only Android live view of a VS Code session).
5. **Context integrity and memory** — #57806 (compaction losing state) and #58735 (context gauge/handoff) reflect growing anxiety about long-horizon task reliability.

## 7. Developer Pain Points

- **Quota interruption is the #1 friction.** Developers repeatedly describe tasks dying mid-run with the reset time known but unusable — "the information is wasted" — and must manually notice and restart work.
- **Opaque enforcement errors.** Windows users hit `blocked by policy` / `CreateProcess rejected` with no actionable reason, no visible review action, and no `/approve` path.
- **Platform-specific regressions.** macOS Quick Chat disappearing, Android reasoning selector gated behind a desktop action, and Windows-wide UI lag from a lingering Computer Use process erode trust in desktop builds.
- **Cross-device state inconsistency.** Stale approval modals, browser-disabled remote chats, and missing shared projects indicate synchronization gaps between mobile, desktop, and remote sessions.
- **Attachment pipeline reliability.** XLSX (#58302) and PPTX (#58642) attachments hang the Send control indefinitely on macOS with no error surfaced.
- **Secrets-in-context anxiety.** Two independent "Show and tell" projects (#58749, #58492) target the same need — preventing keys and PII from entering the model context — signaling a gap in first-class support.

</details>

<details>
<summary><strong>Gemini CLI</strong> — <a href="https://github.com/google-gemini/gemini-cli">google-gemini/gemini-cli</a></summary>

# Gemini CLI Community Digest — 2026-11-02

## 1. Today's Highlights

Activity today is dominated by **agent reliability and subagent orchestration** concerns, with a cluster of high-priority (P1) bugs around subagent turn limits, generalist agent hangs, and Browser Agent failures on Wayland. The issue tracker shows sustained maintainer attention on making agents more trustworthy — surfacing interruption states honestly, respecting configuration overrides, and stopping destructive behavior. Meanwhile, PR activity centers on security hardening (error report permissions, MCP OAuth dispatcher routing) and resilience fixes for headless runs, retries, and quota interruptions.

## 2. Releases

- **v0.67.0-nightly.20261101.g6814e00d6** — Nightly build published. [Full changelog](https://github.com/google-gemini/gemini-cli/compare/v0.67.0-nightly.20261031.g6814e00d6...v0.67.0-nightly.20261101.g6814e00d6)

No stable release in the last 24h. Note the parallel activity on a v0.66.0 image-read regression (see #30074 below).

## 3. Hot Issues

1. **#22323 — Subagent MAX_TURNS reported as GOAL success** [P1, 13 comments]
   The `codebase_investigator` subagent reports `status: "success"` / `Termination Reason: "GOAL"` even when it hit the turn limit before doing any work. This masks interruptions from callers and evals — a correctness issue at the heart of agent trustworthiness. [Link](https://github.com/google-gemini/gemini-cli/issues/22323)

2. **#19873 — Zero-dependency OS sandboxing + post-execution intent routing** [P2, 9 comments]
   Proposal to lean into Gemini 3's native bash affinity (grep/cat/sed/awk chaining) while containing risk via sandboxing and intent-based routing after execution. Signals a philosophical shift toward fewer bespoke tools and more native shell fluency. [Link](https://github.com/google-gemini/gemini-cli/issues/19873)

3. **#21409 — Generalist agent hangs indefinitely** [P1, 8 comments, 👍8]
   The highest-upvoted issue in today's set. Delegation to the generalist agent hangs forever on trivial tasks (e.g., folder creation); users report disabling subagent delegation as a workaround. This is a serious blocker for anyone relying on the delegation path. [Link](https://github.com/google-gemini/gemini-cli/issues/21409)

4. **#22745 — AST-aware file reads, search, and codebase mapping** [P2, 7 comments]
   An EPIC evaluating whether AST-aware reads reduce misaligned file reads, token noise, and turn count. Companion to #22746 (evaluating `tilth`/`glyph` as starting points). Relevant to context-bloat complaints across the tracker. [Link](https://github.com/google-gemini/gemini-cli/issues/22745)

5. **#21968 — Gemini under-uses skills and sub-agents** [P2, 7 comments]
   Anecdotal but important: despite well-described `gradle`/`git` skills, Gemini rarely invokes them proactively. This undermines the value proposition of custom skills and suggests discovery/steering prompt work is needed. [Link](https://github.com/google-gemini/gemini-cli/issues/21968)

6. **#22267 — Browser Agent ignores settings.json overrides** [P2, 5 comments]
   `AgentRegistry` reads merged settings correctly at init, but the Browser Agent ignores them (e.g., `maxTurns`). Configuration that silently doesn't apply is a recurring class of bug — see also #20079 and #21763. [Link](https://github.com/google-gemini/gemini-cli/issues/22267)

7. **#22232 — Browser Agent session takeover / lock recovery** [P3, 4 comments]
   Requests automatic recovery from locked browser profiles instead of fail-fast. Directory of related Browser Agent issues (#21983 Wayland failure, #22267) suggests the Browser Agent is the least robust subsystem right now. [Link](https://github.com/google-gemini/gemini-cli/issues/22232)

8. **#21983 — Browser subagent fails on Wayland** [P1, 4 comments]
   Reports "Termination Reason: GOAL" while failing — the same misleading-success pattern as #22323. Linux/Wayland users are effectively blocked from Browser Agent use. [Link](https://github.com/google-gemini/gemini-cli/issues/21983)

9. **#24246 — 400 error with >128 tools** [P2, 3 comments]
   The agent hits a hard 400 when too many tools are in scope; expectation is smarter tool-scoping. Becomes more pressing as MCP servers and skills multiply per workspace. [Link](https://github.com/google-gemini/gemini-cli/issues/24246)

10. **#23571 — Model creates tmp scripts in random spots** [P2, 3 comments]
    When shell-restricted, the model scatters edit scripts across directories, complicating clean commits. A concrete developer-experience tax from prompt/tool policy tuning. [Link](https://github.com/google-gemini/gemini-cli/issues/23571)

Honorable mentions: **#22672** (discourage destructive git/db operations), **#21763** (bug reports omit subagent context), **#30074** (v0.66.0 image `read_file` still triggers 400 after PR #29611).

## 4. Key PR Progress

1. **#30088 — Keep error reports out of shared temp dir** [P2, security]
   `gemini-client-error-*.json` files contain full chat history and were written to `os.tmpdir()` with default permissions. Moves them to `~/.gemini/tmp/error-reports/` with user-only permissions. Meaningful privacy fix. [Link](https://github.com/google-gemini/gemini-cli/pull/30088)

2. **#30051 — Kill active shells, persist tool calls on headless interruption** [non-interactive]
   Fixes headless runs (`gemini -p ... --yolo`) exiting with code 0 on SIGINT/SIGTERM/SIGHUP and leaving detached shell processes alive. Important for CI scripting. [Link](https://github.com/google-gemini/gemini-cli/pull/30051)

3. **#27423 — Configurable per-tool-call timeout (`tools.callTimeout`)** [P3, agent]
   Caps wall-clock duration of any single tool call; addresses unbounded shell commands. Long-requested guardrail for autonomous runs. [Link](https://github.com/google-gemini/gemini-cli/pull/27423)

4. **#30082 — `model.requestTimeoutMs` setting** [core]
   Exposes the 60s API headers timeout as a setting rather than a hidden experiment flag never fetched under Vertex/API-key auth. Directly targets aborted long-thinking requests. [Link](https://github.com/google-gemini/gemini-cli/pull/30082)

5. **#29918 — Terminal status reporting via OSC 7501** [P3, CLI]
   Reports working/blocked/idle state to supporting terminals, so multi-tab users can see which session needs attention. Nice ergonomic touch for heavy parallel usage. [Link](https://github.com/google-gemini/gemini-cli/pull/29918)

6. **#30020 — Drop tool calls streamed by failed attempts on retry** [core]
   On mid-stream retry, both failed and successful attempts' tool calls were executed — side-effecting commands ran twice. Fixes duplicate execution in `GeminiChat`. [Link](https://github.com/google-gemini/gemini-cli/pull/30020)

7. **#30071 — Route MCP OAuth fetches through safe dispatcher** [security]
   Closes a DNS-rebinding-style gap: MCP OAuth metadata/registration endpoints were validated at check time but fetched through the plain global dispatcher. [Link](https://github.com/google-gemini/gemini-cli/pull/30071)

8. **#29912 — Strip trailing punctuation from web_fetch URLs** [agent]
   Fixes polluted URLs (`https://example.com/,`) from comma-separated lists being passed to `new URL()`. Small but high-frequency papercut fix. [Link](https://github.com/google-gemini/gemini-cli/pull/29912)

9. **#29919 — `--append-system-prompt` flag** [P3]
   Adds `--append-system-prompt`, `--append-system-prompt-file`, and `GEMINI_APPEND_SYSTEM_MD` so project context can be added without replacing the entire system prompt (`GEMINI_SYSTEM_MD`). [Link](https://github.com/google-gemini/gemini-cli/pull/29919)

10. **#29801 — Pair proxy fetch with its Undici dispatcher** [MCP, closed]
    Fixes HTTP MCP initialization on Node 26 under proxy setups; ensures JSON/SSE headers reached the MCP SDK. Now closed. [Link](https://github.com/google-gemini/gemini-cli/pull/29801)

Also noteworthy: the dependabot backlog includes **#29664** (74 npm dependency updates, XL) and **#28450** (GitHub Actions group), indicating maintenance debt accumulation. **#29762**, **#29798–#29800** (settings preservation, approval focus, quota fallback) were closed on 11-01, a productive batch from one contributor.

## 5. Hot Discussions

No Discussions data was provided for this digest period. Section omitted.

## 6. Feature Request Trends

Distilled from the day's Issues and PR backlog:

- **Agent robustness & honesty**: correct termination reporting (#22323, #21983), hang prevention (#21409), non-destructive defaults (#22672), resilient browser sessions (#22232).
- **Context efficiency**: AST-aware reads/search/mapping (#22745, #22746), "tactful extraction" surgical reads (#19561), persistent file-based task tracking to replace in-context todos (#18836).
- **Tool-scoping intelligence**: smarter tool selection under the 400-error threshold (#24246), proactive skill/subagent invocation (#21968).
- **Timeouts and guardrails**: per-tool-call timeouts (#27423), configurable model request timeouts (#30082).
- **Observability & debuggability**: subagent trajectories in `/chat share` (#22598), subagent context in bug reports (#21763), terminal session status (#29918).
- **Configuration correctness**: settings.json overrides honored by all agents (#22267), symlinked agent definitions (#20079), per-workspace policy support (#18397).

## 7. Developer Pain Points

1. **Subagent delegation is unreliable.** The generalist agent hangs indefinitely (#21409, 👍8) and subagents misreport forced termination as success (#22323, #21983). Users are disabling delegation as a workaround — a direct hit to the multi-agent value proposition.

2. **The Browser Agent is the weakest link.** Ignored settings (#22267), fail-fast lock handling (#22232), and Wayland breakage (#21983) combine into a subsystem that Linux users struggle to use at all.

3. **Configuration silently doesn't apply.** settings.json overrides (#22267), symlinked agents (#20079), and missing subagent context in bug reports (#21763) all erode trust in the tooling surface.

4. **Context bloat and turn-count inflation.** Firehose file reads, ~36.6k-token baselines per turn (#19561), and no AST-aware navigation (#22745) make long sessions expensive and noisy.

5. **Unbounded and duplicated execution.** Long shell commands with no timeout (#27423), duplicated side-effecting tool calls on retry (#30020), and scattered temp scripts (#23571) create cleanup and safety burdens for autonomous runs.

6. **Privacy & security papercuts.** Chat-history-containing error reports in world-readable temp dirs (#30088) and MCP OAuth dispatcher gaps (#30071) show lingering hardening work in a tool that developers run with broad filesystem access.

</details>

<details>
<summary><strong>GitHub Copilot CLI</strong> — <a href="https://github.com/github/copilot-cli">github/copilot-cli</a></summary>

# GitHub Copilot CLI Community Digest — 2026-11-02

## 1. Today's Highlights

A new patch release (v1.0.106-2) improves screen-reader ergonomics and fixes `/resume` session duplication. Issue activity remains high (23 issues updated in 24h), with the community continuing to push on model flexibility (#3709), message queue control (#1857), and several fresh triage reports around remote sessions, compaction, and platform support. No pull requests were updated in the last 24 hours.

## 2. Releases

**v1.0.106-2** — [Release page](https://github.com/github/copilot-cli/releases)
- **Accessibility fix:** With `--screen-reader`, failed/rejected tool calls, unknown-command errors, and warnings now begin with `"Error:"` or `"Warning:"` prefixes instead of sounding like ordinary messages.
- **Session fix:** `/resume <session-id>` now foregrounds an already-running background session rather than displaying it twice.

## 3. Hot Issues

1. **[#3709](https://github.com/github/copilot-cli/issues/3709)** — *Allow `/model` to switch between multiple models including BYOK/local providers in one session* (👍 34, 13 comments). BYOK currently pins a session to one model via `COPILOT_MODEL`, and the `/model` picker only lists GitHub-hosted models. This is the top-voted open request and a clear signal that hybrid/local-model workflows are a priority.

2. **[#1857](https://github.com/github/copilot-cli/issues/1857)** — *Cancel or remove enqueued messages before execution* (👍 33, 13 comments). Queued messages via `Ctrl+Q`/`Ctrl+Enter` cannot be retracted once the agent is busy. A long-standing UX gap with strong community backing.

3. **[#5312](https://github.com/github/copilot-cli/issues/5312)** — *Context window rollover still fails: `checkpoint.md` absent on 1.0.105*. The reporter claims #5205 was closed as completed without a linked fix, PR, or release. This is a credibility concern for the issue-triage process as much as a bug.

4. **[#5318](https://github.com/github/copilot-cli/issues/5318)** — *grep compaction corrupts filenames/line numbers and merges distinct files*. The built-in rg tool's output compaction misinterprets numeric filename suffixes as grep delimiters — a subtle correctness bug that can misattribute search results.

5. **[#4560](https://github.com/github/copilot-cli/issues/4560)** — *Model "auto" always runs with reasoning effort disabled* (CLOSED). Any attempt to configure reasoning effort under `auto` is rejected, and sessions show `reasoningEffort: null`. Closed, but the behavior pattern is worth tracking.

6. **[#4548](https://github.com/github/copilot-cli/issues/4548)** — *Options passed to a custom skill invocation are dropped*. `/skill-name --option value` records the full input but strips options from the dispatched prompt. A real correctness issue for skill authors.

7. **[#4681](https://github.com/github/copilot-cli/issues/4681)** — *MCP OAuth: `initialize` request omits User-Agent header*. After successful OAuth token exchange, custom headers configured for MCP servers are ignored — a blocker for enterprise MCP deployments with header-based routing.

8. **[#5313](https://github.com/github/copilot-cli/issues/5313)** — *GitHub Mobile (iOS): remote sessions stuck on "Working" indefinitely*. Same session renders fine elsewhere, pointing to a mobile client rendering/streaming issue. Paired with #5315 and #5316, remote control is clearly the newest active surface.

9. **[#5317](https://github.com/github/copilot-cli/issues/5317)** — *Checkpoint list in system prompt changes after `/compact`, invalidating prompt cache*. A cost/performance issue: every compaction rewrites the cached prefix. Relevant to anyone paying per-token at scale.

10. **[#5272](https://github.com/github/copilot-cli/issues/5272)** — *Black-on-white theme*. The CLI reportedly only renders well on dark terminals, ignoring light-theme users. Low severity but a recurring accessibility/comfort theme.

## 4. Key PR Progress

No pull requests were updated in the last 24 hours. The contributor pipeline is currently silent; all movement this cycle is on the issue side.

## 5. Hot Discussions

No discussion data was provided for this cycle.

## 6. Feature Request Trends

- **Model flexibility & BYOK:** #3709 (multi-model switching in one session), #4560 (reasoning effort under `auto`) — users want the CLI to treat model selection as a first-class, session-level capability rather than a startup-time pin.
- **Input control:** #1857 (cancel enqueued messages) — a demand for reversible actions in the composer.
- **Remote & mobile sessions:** #5315 (voice mode from GitHub Mobile), #5316 (nested sessions on mobile/web), #5313 (iOS stuck state) — remote control is the fastest-growing surface area.
- **Platform expansion:** #5314 (armv7l/Termux support) — interest from non-x86 environments.
- **UI differentiation & theming:** #5274 (visually distinguish skills from built-in commands), #5272 (light themes).
- **Tooling correctness:** #5318 (grep compaction), #4548 (skill options), #4425 (constrain `run_factory` to registered factories).

## 7. Developer Pain Points

- **Prompt/state fragility:** Prompts can be silently discarded on submission failure (#5264), checkpoint state invalidates prompt caches after `/compact` (#5317), and context rollover remains broken (#5312). Developers are losing work and paying for cache misses.
- **Tool output correctness:** grep compaction misattributes results (#5318), skill options are dropped (#4548), and `run_factory` can hallucinate factory names (#4425). These erode trust in tool results.
- **Auth/networking edge cases:** MCP OAuth post-login requests omit configured headers (#4681), and Monday.com MCP fails on OAuth2 (#2054).
- **Permissions friction:** Legitimate repo-root paths still trigger approval prompts despite prior approval (#5311).
- **Rendering & accessibility:** Table reflow during streaming (#4347), browser login URL wrapping (#4400), skill/command visual ambiguity (#5274), and light-theme incompatibility (#5272).
- **Remote control reliability:** Mobile remote sessions hang on "Working" (#5313), with feature requests stacking on top of an unstable foundation (#5315, #5316).

---
*Generated from github.com/github/copilot-cli activity on 2026-11-02.*

</details>

<details>
<summary><strong>OpenCode</strong> — <a href="https://github.com/anomalyco/opencode">anomalyco/opencode</a></summary>

# OpenCode Community Digest — 2026-11-02

## Today's Highlights
The free tier continues to dominate community activity, with the megathread (#59387) racking up 195 comments as users report exhausted quotas and broken resets. Meanwhile, plan/build mode confusion is emerging as a serious correctness concern: two separate issues (#53955, #61010) describe the agent performing destructive edits or refusing valid work due to UI/agent state desync. On the PR side, the core team is pushing performance and reliability fixes, including a major SQLite write reduction (PR #58916) and retry-hook handling for content-filter finishes (PR #60836).

## Releases
No new releases in the last 24 hours.

## Hot Issues

1. **[#59387](anomalyco/opencode#59387) — [zen] Free tier issues megathread** (195 comments, 13 👍) — The canonical thread for free tier failures: quota exhaustion, non-resetting daily limits, and Desktop version lockouts. The volume and persistence signal this is still the #1 user-facing problem.

2. **[#1852](anomalyco/opencode#1852) — sudo commands break the UI and hang the agent** (14 comments, 11 👍, closed) — Tool calls requiring sudo never receive input, hanging the process. Long-standing issue finally closed, but the high 👍 count suggests many were affected.

3. **[#53955](anomalyco/opencode#53955) — Agent edits files in plan mode** (12 comments, 1 👍, reproduced) — The agent runs destructive commands and writes/executes scripts despite plan mode. A correctness and safety concern that undermines user trust in the mode system.

4. **[#52958](anomalyco/opencode#52958) — OpenCode Go payments declined from Italy** (11 comments, 2 👍, closed) — All payment methods (card, Apple Pay, Stripe Link, virtual card) fail for EU users. A revenue-impacting geo-billing bug.

5. **[#56748](anomalyco/opencode#56748) — TUI queued card lingers for delivered image messages** (10 comments, reproduced) — Windows v2 TUI keeps showing a stale queued card above the prompt after a message with an image is delivered and answered. Cosmetic but persistent UX annoyance.

6. **[#61010](anomalyco/opencode#61010) — Plan/build mode state desyncs between UI and agent** (4 comments) — The system-reminder toggles Plan mode status inconsistently with the actual UI selection, causing refused or unauthorized work. Related to #53955 and likely the root cause of several plan-mode bugs.

7. **[#60792](anomalyco/opencode#60792) — Anthropic fallback double-counts prompt size** (5 comments, 1 👍, closed) — With server-side fallback, summed `usage.iterations` makes the next step see ~2x the real prompt size, inflating cost. Affects billing accuracy for Anthropic users.

8. **[#61122](anomalyco/opencode#61122) — Shell timeout never starts when process creation stalls** (2 comments, reproduced) — A foreground shell call can hang forever with no timeout if `CreateProcess` stalls before spawn. A reliability hole in process management.

9. **[#61121](anomalyco/opencode#61121) — worktree_remove gated only by edit permission** (1 comment) — Any file-editing agent can delete its own worktree with `force: true`, destroying uncommitted work. A notable privilege-escalation/safety gap for headless setups.

10. **[#61101](anomalyco/opencode#61101) — TUI crash: `undefined is not an object (evaluating 'e.length')`** (2 comments, reproduced) — Unhandled TypeError crashes the TUI, likely from malformed session data. Quick to triage but disruptive when hit.

## Key PR Progress

1. **[#61120](anomalyco/opencode#61120) — Don't hold models.dev refresh lock across network timeout** — Fixes a lock-convoy risk where a slow models.dev refresh blocks all clients. Closes #61118.

2. **[#58916](anomalyco/opencode#58916) — Write each assistant part as its own row** — Drops SQLite WAL writes by 84.4% and fsyncs dramatically on tool-heavy sessions by avoiding full message rewrites. Significant perf win for long sessions.

3. **[#60836](anomalyco/opencode#60836) — Let retry hooks handle content-filter finishes** — Ensures `session.retry` fires on content-filter stops so plugins (e.g., model fallback chains) can react. Closes #60822.

4. **[#58938](anomalyco/opencode#58938) — Change seq + experimental changes endpoint** — Adds a change sequence to session rows so reconnecting clients can query "what changed since I last saw this?" instead of re-reading recent messages. Stacked on #58916.

5. **[#61112](anomalyco/opencode#61112) — Group vertical tabs by server** (closed) — Cleans up multi-server UX by grouping side tabs by their originating server. Refs #58155, #51345.

6. **[#59477](anomalyco/opencode#59477) — Serve in-app browser tools from desktop over client MCP** (draft) — Moves browser tool registration to the desktop MCP server over `/api/experimental/client-mcp`, deleting the plugin-browser package. Architectural cleanup.

7. **[#52580](anomalyco/opencode#52580) — Keep background shell locations alive** (closed) — Prevents Location services from being evicted while a backgrounded shell job is still running.

8. **[#52567](anomalyco/opencode#52567) — DigitalOcean Responses and Messages APIs** (closed) — Adds DigitalOcean as a provider, composing Messages/Responses routes from shared Anthropic/OpenAI protocols.

9. **[#52556](anomalyco/opencode#52556) — Account for reported Copilot billing** (closed) — Corrects cost accounting for GitHub Copilot usage. Closes #35765.

10. **[#52517](anomalyco/opencode#52517) — Prevent unsupported tool files from breaking Chat sessions** (closed) — Fixes replay of history containing unsupported file returns that broke subsequent OpenAI Chat requests.

## Hot Discussions
No Discussion data was provided for this period.

## Feature Request Trends
- **Read-only historical changesets for V2 plugins** ([#52870](anomalyco/opencode#52870)) — Plugin consumers want to query historical execution changesets rather than relying on awaited capture callbacks.
- **Expose existing sessions as Desktop tabs via API** ([#53529](anomalyco/opencode#53529)) — API clients/agents should be able to ask the Desktop client to open an existing session as a tab.
- **Load `./gui-experimental` plugins in the web app** ([#60976](anomalyco/opencode#60976)) — GUI plugins currently only load in Desktop; parity with the web app is requested.
- **Node.js fallback / compatibility mode for older CPUs** ([#60982](anomalyco/opencode#60982)) — Users on non-SSE4.2 CPUs hit crashes and want a compatible server runtime.

## Developer Pain Points
1. **Free tier friction is unresolved at scale** — The 195-comment megathread (#59387) captures the dominant complaint: quotas won't reset, Desktop versions get locked out, and errors are inconsistent. This is the highest-volume pain point by far and the most visible to new users.

2. **Plan mode is not trustworthy** — Multiple reports (#53955, #61010) show the agent making edits or running scripts in plan mode, or refusing work because the agent believes it's in the wrong mode. Users need the mode system to be authoritative and consistent between UI and agent.

3. **Connectivity and session failures** — Recurring `CONNRESET`/`ECONNRESET` errors (#60636, #60662) and sessions stuck with "No items available" (#60818) disrupt active work, often with no clear remediation path.

4. **Permission and safety gaps in agent tooling** — `worktree_remove` gated only by `edit` (#61121) and PowerShell shell policies skipped for bare expressions (#60958) show that permission enforcement has holes that matter for locked-down and headless deployments.

5. **Geo-billing and payment failures** — The Italy payment decline thread (#52958) highlights that subscription checkout fails for entire regions, blocking paying users from converting.

6. **Process/shell reliability** — Hanging shell timeouts (#61122), sudo hangs (#1852), and commands not executing until Ctrl+C (#61109) collectively point to fragility in the shell execution layer.

</details>

<details>
<summary><strong>Pi</strong> — <a href="https://github.com/earendil-works/pi">earendil-works/pi</a></summary>

# Pi Community Digest — 2026-11-02

## 1. Today's Highlights

No new releases landed in the last 24 hours, but issue activity was heavy: 25 issues updated, with a notable cluster of **CLOSED/untriaged fixes** merged or triaged on 2026-11-01 (OAuth proxy, auth.json symlink locking, Windows console crash, session-id warnings). The most active thread remains the **ChatGPT Pro usage-limit reset bug (#10480)** with 21 comments, while durable/embedded deployment concerns (Durable Objects, SQLite storage, context handoff) continue to surface across multiple threads.

## 2. Releases

*No new releases in the last 24 hours.*

## 3. Hot Issues

1. **[#10480 [CLOSED] Direct OpenAI connection not recognising manual usage limit reset](https://github.com/earendil-works/pi/issues/10480)** — 21 comments, 3 👍. Users banking a ChatGPT Pro reset still see "usage limit reached"; workaround is logout/relogin via `openai-codex`. Highest-engagement thread of the day.
2. **[#8301 [OPEN] Can't interleave compaction requests with prompts in prompt queue](https://github.com/earendil-works/pi/issues/8301)** — Long-running (since Aug 18) bug preventing `/compact` from being queued between prompts. Blocks long multi-step workflows.
3. **[#10287 [OPEN] `getContextUsage()` massively overestimates context after retryable network error](https://github.com/earendil-works/pi/issues/10287)** — Token count jumps from ~42k to 330k after a WS/fetch failure. Corrupts context accounting and can spuriously trigger compaction.
4. **[#10885 [OPEN] llama.cpp context overflow not detected → auto-compaction never triggers](https://github.com/earendil-works/pi/issues/10885)** — Server returns "Context size has been exceeded." but Pi doesn't recognize it, so sessions hard-fail instead of compacting.
5. **[#11527 [OPEN] Bedrock: `new BedrockRuntimeClient` per request](https://github.com/earendil-works/pi/issues/11527)** — Fresh credential provider + HTTP/2 session per call; with SSO this adds a `GetRoleCredentials` round-trip on every model call. Real latency/cost impact for Bedrock users.
6. **[#11557 [OPEN] pi-durable: hand off at the context limit and keep the run going](https://github.com/earendil-works/pi/issues/11557)** — Request for "handoff note" semantics to use the full context window without compaction — relevant to long-running agents.
7. **[#11026 [OPEN] pi-durable: permanently delete a conversation from storage](https://github.com/earendil-works/pi/issues/11026)** — 4 👍, one of the highest-voted items today. Missing CRUD primitive in durable storage; privacy/GDPR angle.
8. **[#11613 [OPEN] bash tool falsely reports timeout when descendant holds pipes open](https://github.com/earendil-works/pi/issues/11613)** — Command already exited with a real code, but the tool reports "Command timed out after N seconds". Misleading errors for shell users.
9. **[#11226 [OPEN] codemode script fails when top-level variable named `tools`](https://github.com/earendil-works/pi/issues/11226)** — Name-collision footgun in code mode; reporter offered a PR. 1 👍.
10. **[#11669 [CLOSED] pi-durable: JSON ~1000-deep nesting kills the Harness on SQLite storage](https://github.com/earendil-works/pi/issues/11669)** — Deep JSON tripping `CHECK (json_valid(...))`. Quick-close suggests a fix or boundary improvement.

Honorable mentions: [#11584 overlay doesn't cover terminal images](https://github.com/earendil-works/pi/issues/11584), [#11654 Windows console crash](https://github.com/earendil-works/pi/issues/11654), [#11666 OAuth ignores HTTP(S)_PROXY](https://github.com/earendil-works/pi/issues/11666), [#11655 symlinked auth.json bypasses refresh lock](https://github.com/earendil-works/pi/issues/11655).

## 4. Key PR Progress

Only 3 PRs were updated in the window; all noteworthy:

1. **[#11659 [CLOSED] feat(ai): add glm-5.3 to qwen-token-plan-individual](https://github.com/earendil-works/pi/pull/11659)** — Adds the model to the Individual allowlist and covers the models.dev effort ladder for team/CN/individual. Directly resolves [#11658](https://github.com/earendil-works/pi/issues/11658).
2. **[#11656 [CLOSED] Reconcile changed pinned git SHAs on startup](https://github.com/earendil-works/pi/pull/11656)** — Fixes [#10758](https://github.com/earendil-works/pi/issues/10758): editing a pinned commit SHA in settings no longer leaves a stale checkout until `pi update --extensions`.
3. **[#4037 [CLOSED] fix: handle shift+enter in legacy terminals](https://github.com/earendil-works/pi/pull/4037)** — Treats legacy SS3 `M` as Shift+Enter so newline inserts instead of submitting; adds keys regression tests. Long-lived fix finally closed.

*(The remaining PR slots are unimplemented in the dataset — only 3 PRs were updated in the last 24h.)*

## 5. Hot Discussions

### Show and tell
- **[#11668 Iris Chat encrypted messaging extension for Pi](https://github.com/earendil-works/pi/discussions/11668)** — Nostr Double Ratchet messaging as a native Pi extension; one paired contact can send tasks to the agent. 1 👍.

### Ideas / Meta
- **[#11662 Settings audit: which settings.json keys have a UI, and where the gaps are](https://github.com/earendil-works/pi/discussions/11662)** — AI-assisted audit against `main@6291b9bcc` (pi-coding-agent 1.4.0). Identifies four unreachable settings (`enableAnalytics`, etc.). Companion to issue [#11663](https://github.com/earendil-works/pi/issues/11663).

## 6. Feature Request Trends

Distilled from today's Issues and Discussions:

- **Durable/embedded runtime controls** — Conversation deletion ([#11026](https://github.com/earendil-works/pi/issues/11026)), context handoff ([#11557](https://github.com/earendil-works/pi/issues/11557)), host-provided Code Mode output writers ([#11070](https://github.com/earendil-works/pi/issues/11070)), and robust behavior under Durable Objects / SQLite ([#11669](https://github.com/earendil-works/pi/issues/11669), [#11661](https://github.com/earendil-works/pi/issues/11661)).
- **Context/compaction correctness** — Interleaved compaction ([#8301](https://github.com/earendil-works/pi/issues/8301)), overflow detection from llama.cpp ([#10885](https://github.com/earendil-works/pi/issues/10885)), and accurate `getContextUsage()` ([#10287](https://github.com/earendil-works/pi/issues/10287)).
- **Network/proxy & auth hardening** — Proxy-aware OAuth ([#11666](https://github.com/earendil-works/pi/issues/11666)), symlink-safe refresh locking ([#11655](https://github.com/earendil-works/pi/issues/11655)), Bedrock client reuse ([#11527](https://github.com/earendil-works/pi/issues/11527)).
- **Provider coverage** — Adding `glm-5.3` ([#11658](https://github.com/earendil-works/pi/issues/11658)) and general allowlist vs. models.dev reconciliation.
- **Editor/TUI QoL** — `/new [prompt...]` ([#11664](https://github.com/earendil-works/pi/issues/11664)), Shift+Enter in legacy terminals ([#4037](https://github.com/earendil-works/pi/pull/4037)), overlay behavior with images ([#11584](https://github.com/earendil-works/pi/issues/11584)).
- **Extensibility** — `user_bash` `recordedCommand` ([#11665](https://github.com/earendil-works/pi/issues/11665)), native messaging extensions ([#11668](https://github.com/earendil-works/pi/discussions/11668)).
- **GUI aspirations** — Recurring community request for a friendlier GUI ([#11653](https://github.com/earendil-works/pi/issues/11653)).

## 7. Developer Pain Points

- **Provider-specific surprises**: Bedrock creating a client per request ([#11527](https://github.com/earendil-works/pi/issues/11527)); Anthropic/OpenAI reset semantics with ChatGPT Pro ([#10480](https://github.com/earendil-works/pi/issues/10480)).
- **Silent/incorrect failure detection**: llama.cpp overflow unhandled ([#10885](https://github.com/earendil-works/pi/issues/10885)); false "timed out" from bash ([#11613](https://github.com/earendil-works/pi/issues/11613)).
- **State/lock races**: symlinked `auth.json` bypasses refresh lock ([#11655](https://github.com/earendil-works/pi/issues/11655)); `lazyApi` first-load promise leaking across Durable Object contexts ([#11661](https://github.com/earendil-works/pi/issues/11661)).
- **Storage brittleness**: JSON depth limits on SQLite ([#11669](https://github.com/earendil-works/pi/issues/11669)); no delete primitive in durable storage ([#11026](https://github.com/earendil-works/pi/issues/11026)).
- **SDK/prototype fragility**: `wrapUIPromptContext` spreads prototypes away ([#8829](https://github.com/earendil-works/pi/issues/8829)); codemode name collision on `tools` ([#11226](https://github.com/earendil-works/pi/issues/11226)).
- **Documentation gaps**: settings audit shows several keys have no UI path ([#11663](https://github.com/earendil-works/pi/issues/11663), [#11662](https://github.com/earendil-works/pi/discussions/11662)).

---

*Generated from github.com/earendil-works/pi data captured 2026-11-02. Stats: 0 releases · 25 issues updated · 3 PRs updated · 2 discussions updated.*

</details>

<details>
<summary><strong>Qwen Code</strong> — <a href="https://github.com/QwenLM/qwen-code">QwenLM/qwen-code</a></summary>

# Qwen Code Community Digest — 2026-11-02

## 1. Today's Highlights

The Qwen Code project shipped **v0.26.5** across three artifacts (CLI, nightly, and Desktop), headlined by bounded SQL history queries for Managed sessions — a notable step toward paged, resource-bounded session retrieval. However, the release is partially broken: the **sandbox image for 0.26.5 failed to publish**, which cascades into failures across all sandbox-based CI lanes. Meanwhile, CI infrastructure instability remains the dominant theme of the day, with recurring disk exhaustion, missing Node.js on pool hosts, and flaky Managed Agent fault gates occupying the top of both the issue and PR queues.

## 2. Releases

**v0.26.5 / desktop-v0.26.5 / v0.26.5-nightly.20261101**

- **Bounded SQL history queries** (PR [#15839](https://github.com/QwenLM/qwen-code/pull/15839)) — Managed local H2 and Hosted MySQL now support paged recent-message and journal-transaction queries, replacing unbounded history reads. This is the release's flagship change and directly addresses long-session memory and latency concerns.
- **Session event delivery loop refactor** (PR [#15952](https://github.com/QwenLM/qwen-code/pull/15952)) — deduplicates the loop shared between managed-agent event paths.
- **Generated UI**: continued card-based chat interaction support.

⚠️ **Release caveat**: Issue [#16039](https://github.com/QwenLM/qwen-code/issues/16039) reports that `ghcr.io/qwenlm/qwen-code:0.26.5` was **never published** — the release build job failed before the image push. Every sandbox-based lane (`/resolve`, sandboxed review, autofix) currently crashes with `manifest unknown` when installing the matching npm version. Expect a hotfix or re-run.

No breaking changes are declared.

## 3. Hot Issues

1. **[#14724](https://github.com/QwenLM/qwen-code/issues/14724)** — *Main CI failed: Managed Agent gate (147 comments)*. The single most active thread in the tracker. A required check is red on main for an unidentified test, meaning every full-tier PR is blocked. The comment count (6+ weeks of updates) signals a persistent infra problem rather than a code defect.

2. **[#16039](https://github.com/QwenLM/qwen-code/issues/16039)** — *Sandbox image for 0.26.5 not published*. Directly impacts release usability; auto-filed by the release bot. High urgency because it blocks the sandboxed review and autofix tooling the project itself relies on.

3. **[#15898](https://github.com/QwenLM/qwen-code/issues/15898)** — *Hosted process fault gates fail on main; postFailureLoads varies run to run*. A textbook flaky test: two separate main runs fail the same job with different measurements. Now closed, but it exemplifies the non-determinism problem in the Managed Agent test suite.

4. **[#9005](https://github.com/QwenLM/qwen-code/issues/9005)** — *Anthropic wire missing stream-safety protections the OpenAI wire has*. A long-running (since August) P1 correctness gap: streaming cancellation and safety handling are asymmetric between providers. Companion to PR [#16079](https://github.com/QwenLM/qwen-code/pull/16079).

5. **[#13570](https://github.com/QwenLM/qwen-code/issues/13570)** — *Auto mode blocks inert text mentioning the amend phrase*. A permissions false-positive: the guard pattern-matches raw command text rather than parsed invocations, so documentation or comments mentioning `git commit --amend` are blocked ahead of the user's own rules. Addressed by PR [#16075](https://github.com/QwenLM/qwen-code/pull/16075).

6. **[#15933](https://github.com/QwenLM/qwen-code/issues/15933)** — *Desktop update from pre-fix Windows build still fails*. Users on older desktop builds cannot upgrade past `node.exe` file-lock errors because the old binary drives the update. A self-reinforcing upgrade trap for a subset of Windows users.

7. **[#16030](https://github.com/QwenLM/qwen-code/issues/16030)** — *Linux AppImage missing 9 WebKitGTK libraries*. The only non-Debian Linux artifact ships broken image paste. Users on rpm distros must manually patch library holes — a packaging completeness problem with an easy-to-verify repro.

8. **[#16005](https://github.com/QwenLM/qwen-code/issues/16005)** — *ecs-qwen-hz6-18 has no Node.js on PATH*. Because `Lint & Static` is a required check, any commit routed to this pool host goes red for reasons unrelated to code. A concrete, actionable fleet-configuration bug.

9. **[#16003](https://github.com/QwenLM/qwen-code/issues/16003)** — *CI runners run out of disk; RocketMQ refuses writes, Java lanes can't create temp dirs*. Disk exhaustion recurs across multiple runs and pools, and is invisible in failure summaries. Points to a systemic capacity issue rather than a one-off.

10. **[#15894](https://github.com/QwenLM/qwen-code/issues/15894)** — *A stop sent as a user message doesn't cancel a pending loop_wakeup*. In self-paced `/loop` mode, an explicit user stop fails to cancel a scheduled wakeup, so the loop re-arms itself. A genuine behavioral bug in the background-automation roadmap with a clear reproduction.

## 4. Key PR Progress

1. **[#16075](https://github.com/QwenLM/qwen-code/pull/16075)** — *fix(permissions): match amend invocations instead of raw text*. The proper fix for #13570: parses compound commands, strips heredocs, unwraps shell wrappers, and only then checks for `git commit` invocations. A model example of moving from regex guarding to structured parsing.

2. **[#16082](https://github.com/QwenLM/qwen-code/pull/16082)** — *fix(web-shell): surface Managed session list failures*. Replaces a raw error sentence at the top of the pane with a localized, retryable load-error notice carrying HTTP status, error code, and request ID. Fixes the UX complaint in #14918.

3. **[#16079](https://github.com/QwenLM/qwen-code/pull/16079)** — *fix(core): surface Anthropic refusal details*. Carries refusal metadata through the finish event as a category-specific user message, improving on the generic SAFETY notice. Complements the streaming-safety work tracked in #9005.

4. **[#14953](https://github.com/QwenLM/qwen-code/pull/14953)** — *fix(core): keep compression requests within the context window*. Compression now respects an admission check and retries with a size derived from the rejection. Directly relevant to the context-performance roadmap.

5. **[#16068](https://github.com/QwenLM/qwen-code/pull/16068)** — *fix(ci): fail Java lanes before disk exhaustion*. Adds a disk-floor preflight to all six routable Java lanes, checking both workspace and runner temp filesystems. A pragmatic mitigation for #16003.

6. **[#15634](https://github.com/QwenLM/qwen-code/pull/15634)** — *feat(channels): deliver injected messages into the running turn*. Adds a fourth `dispatchMode` (`inject`) so messages arriving mid-turn reach the agent at its next tool-batch boundary instead of being buffered. Important for interactive multi-channel agents.

7. **[#14748](https://github.com/QwenLM/qwen-code/pull/14748)** — *fix(cli): gate project hooks behind an approval dialog*. Brings workspace-declared hooks under the same approval model as project MCP servers, showing event, matcher, and command before load. A meaningful supply-chain hardening step.

8. **[#15928](https://github.com/QwenLM/qwen-code/pull/15928)** — *feat(web-shell): host mount entries + managed empty-state layout*. Adds `renderManagedAgentWebShell` so non-React hosts can embed the WebShell without hand-drawing chrome, with no hardcoded backend address.

9. **[#15466](https://github.com/QwenLM/qwen-code/pull/15466)** — *feat(serve): user-scope Skill activation routes*. Adds `PUT /skills/:name/activation` and batch activation (up to 100 names) at user scope. Fills a gap alongside the existing extensions activation API.

10. **[#15635](https://github.com/QwenLM/qwen-code/pull/15635)** — *feat(qqbot): deliver proactive loop messages as active group messages*. Makes QQ the fifth adapter to opt into proactive delivery, enabling loop firings and background-task results to reach group chats outside the reply window.

## 5. Hot Discussions

No Discussions data was provided in this dataset.

## 6. Feature Request Trends

Distilled from the issue and PR backlog, the most-requested directions are:

- **Managed Agent observability and boundedness** — bounded SQL history queries (#15839), paged session metadata, failure surfacing in Web Shell (#14918/#16082), and disabling the models.dev catalog refresh for privacy (#16006). Users want Managed Agent state to be inspectable, paginated, and optionally offline.
- **Settings and configuration control** — privacy opt-outs (#16006), user-scope Skill activation (#15466), and per-channel forwarding options (#15904). The theme is giving operators fine-grained, settings-level control over what the agent does automatically.
- **Context/memory efficiency** — compression within the context window (#14953), deduplicating auto-recall hook context against local memory (#14089), and matching memory-index advice to budget (#15368). All target the context-performance roadmap.
- **Cross-provider correctness parity** — stream-safety and refusal-detail handling on the Anthropic wire (#9005, #16079). As multi-provider support matures, users expect feature parity, not just connectivity.
- **Channel breadth and proactive delivery** — QQ, Weixin, and other adapters gaining proactive/injected message delivery (#15634, #15635, #9307). The direction is toward always-on, multi-channel agents.

## 7. Developer Pain Points

- **CI instability is the #1 daily frustration.** At least eight of the top issues today concern CI: flaky fault gates (#15898), missing Node.js on pool hosts (#16005), disk exhaustion (#16003), unpublished sandbox images (#16039), and routing requests for dedicated/self-hosted pools (#15461, #15967, #15968). Because several are *required* checks, this blocks unrelated PRs and erodes trust in green builds.
- **Self-inflicted release breakage** — the 0.26.5 sandbox image failure (#16039) shows the release pipeline can publish npm artifacts whose matching container image is missing, leaving downstream tooling in a broken state.
- **Upgrade traps on Windows and Linux** — the Windows desktop update lock (#15933) and the AppImage library hole (#16030) both leave users on older, vulnerable builds with no clean path forward.
- **False-positive permission guards** — #13570 shows the cost of pattern-matching raw command text: inert documentation gets blocked, and users have no escape hatch. The fix (#16075) is welcome but highlights a broader "guard by parsing, not by regex" lesson.
- **Non-deterministic tests undermine confidence** — flaky fault gates that "vary run to run" (#15898) and intermittent failures make it hard to distinguish real regressions from noise, slowing every review cycle.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*