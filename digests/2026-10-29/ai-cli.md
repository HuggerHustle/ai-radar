# AI CLI Tools Community Digest 2026-10-29

> Generated: 2026-10-29 00:47 UTC | Tools covered: 7

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

# Cross-Tool Comparison Report: AI CLI Ecosystem — 2026-10-29

## 1. Ecosystem Overview

The AI CLI tooling market is now in a **consolidation-and-hardening phase**: basic agentic loops are commoditized, and differentiation has shifted to reliability, cost predictability, and enterprise integration. All seven tools show elevated activity, but the center of gravity has moved from "can it code?" to "can I trust it in production?" — silent failures, session lifecycle fragility, and auth/sandbox gaps dominate every tracker. A notable competitive dynamic is **feature parity pressure**: users migrating between Claude Code, Codex, OpenCode, and Copilot CLI explicitly request hooks, `/goal`, background updates, and permessage parity from one another. Meanwhile, provider-side incidents (model capacity errors, quota inflation, free-tier incidents) are now first-class community topics, indicating the runtime economics are still unsettled.

## 2. Activity Comparison

| Tool | Issues (today) | PRs (today) | Discussions (today) | Release status |
|---|---|---|---|---|
| **Claude Code** | ~10 notable (193👍 top) | 2 updated | N/A (none provided) | No release |
| **OpenAI Codex** | ~10 notable (47-comment top) | ~10 (bot projections) | Yes — 1 Ideas thread (39 comments), Q&A, Show&Tell | 3 alpha releases (`rust-v0.166.0-alpha.4–5.1`) |
| **Gemini CLI** | ~10 notable (P1s, 13-comment top) | ~10 | N/A (none provided) | 1 nightly (`v0.67.0-nightly.20261028`) |
| **GitHub Copilot CLI** | 39 issues updated | 4 | N/A (none provided) | No release |
| **OpenCode** | ~10 notable (84-comment closed `/goal`) | ~10 | N/A (none provided) | 2 releases (`v1.19.5`, `process-daemon v0.3.2`) |
| **Pi** | ~10 notable (13-comment top) | ~10 (incl. stacked Bedrock/Vertex) | 1 (Show&Tell: `pi-rs`) | No release |
| **Qwen Code** | ~10 notable (75-comment CI top) | ~10 | N/A (none provided) | 3 releases (CLI/Desktop/SDK `v0.26.3`) |

**Notes:** Issue/PR counts reflect only the digest snapshot, not full tracker totals (Copilot CLI's 39-updated figure is the only full count available). Claude Code and Gemini CLI currently use GitHub Issues as their primary channel; Codex is the only tool with an active Discussions surface (Ideas/Q&A/Show&Tell), which is worth flagging for anyone benchmarking community-sentiment tooling.

## 3. Shared Feature Directions

| Direction | Tools | Specific needs |
|---|---|---|
| **Cost/usage predictability** | Claude Code, Codex, OpenCode | Claude Code: Team-tier Max 20x equivalent (#47509) + quota inflation (#105240); Codex: "model at capacity" on paid Pro (#57748); OpenCode: Zen free-tier quota megathread (#59387). **The single strongest cross-tool signal.** |
| **Silent-failure elimination** | Claude Code, Gemini CLI, Qwen Code, Pi | Claude #80202 (CLAUDE.md not loaded), #98894 (plugins re-enabled); Gemini #22323/#21983 (false `GOAL` success); Qwen Code #15780/#15822 (dropped/malformed config); Pi #9884/#10812 (silent model fallback). Users want *loud* errors. |
| **Claude Code parity / migration** | Codex, OpenCode | Codex #30332 (background updates "like Claude Code"); OpenCode #12472 (native PreToolUse/PostToolUse hooks), #30308 (dynamic workflows). |
| **Session lifecycle control** | Claude Code, Codex, OpenCode, Pi | Claude Code: session naming, idle-session release, Remote Control state; Codex: undo/redo (#2379, 38👍), idle compaction (#47373); OpenCode: `/goal` (#27167, 157👍), suspend/resume; Pi: settlement/continuation (#5886). |
| **Granular permissions & sandboxing** | Claude Code, Codex, Gemini CLI, Copilot CLI, Qwen Code | Claude Code #105343/#105797; Codex #24237 (per-project skill disable), #56874 (approval dead-ends); Gemini #19873 (OS sandboxing); Copilot #5275 (default-deny allowlists); Qwen Code (session permission rules shipping). |
| **Windows/WSL parity** | Codex, Claude Code, Gemini CLI, Pi, Qwen Code | Codex's WSL↔Windows boundary is its #1 pain cluster; Claude Code Windows drive-root + OOM; Gemini CLI path casing/PowerShell; Pi `.cmd` shim failures; Qwen Code CP936/CP932 encoding. **Windows is the universal weak spot.** |
| **Context/memory management** | Codex, Gemini CLI, OpenCode, Pi | Codex Memories (#12567, 39 comments) + idle compaction; Gemini AST-aware tooling (#22745–47) + persistent todo files (#18836); OpenCode background compaction (#60049); Pi session-thread efficiency (#11545). |
| **Provider breadth / enterprise auth** | Codex, Pi, OpenCode, Copilot CLI | Codex Vertex AI onboarding (#57857); Pi Bedrock Mantle + Vertex Claude (#11372/#11371); OpenCode Azure Entra (#21658); Copilot enterprise MCP registry (#5155/#4999). |
| **Subagent/agent observability** | Gemini CLI, Claude Code, Qwen Code | Gemini #22598/#21763 (share trajectories, include in bug reports); Claude Code permissions UX; Qwen Code plan-execution delta hooks (#15760). |

## 4. Differentiation Analysis

**Claude Code (Anthropic)** — *Target: individual power users & teams on Max/Team plans.* Deepest agentic-editing ergonomics and the only tool with a mature plugin/hook PR ecosystem (#32755 edit-verifier). Weakness: enterprise tiering misaligned with real usage (two top-voted issues are cost complaints), and server-side state sync (#98894) erodes local-control trust. Positioning: **premium power-user default**, vulnerable on cost.

**OpenAI Codex** — *Target: Windows desktop + multi-surface (CLI/TUI/mobile/Cloud) developers.* Strongest release cadence (alpha churn on Rust core) and only tool investing heavily in a **standalone executor** (`codex-exec-server`) and Code Mode runtime — a more platform-oriented architecture. Weakness: Windows Desktop ↔ WSL boundary is a systemic bug cluster, and Codex Cloud publishing had a same-day multi-user regression spike. Positioning: **most ambitious multi-surface platform, currently least stable on Windows.**

**Gemini CLI (Google)** — *Target: shell-first, token-frugal developers; mobile/Termux users.* Unique bets: AST-aware tooling, embrace of native bash affinity (#19873), persistent file-based task tracking. Strong hygiene PR wave (Unicode, CRLF, Windows casing). Weakness: subagent reliability + misleading `GOAL` status is the dominant complaint cluster, plus under-invocation of skills (#21968) undermining its own extension value. Positioning: **quietest iteration, strongest correctness culture in PRs; agent-reliability debt.**

**GitHub Copilot CLI** — *Target: GitHub-centric, enterprise-managed teams.* Highest raw issue velocity (39 updated) but lowest PR velocity (4, all installer scripts — clear maintenance debt on install/supply-chain). MCP OAuth is a four-distinct-mode reliability gap and the top repeated frustration. Strengths: enterprise MCP registry work, VS Code parity roadmap. Positioning: **enterprise distribution play, lagging on auth/install robustness.**

**OpenCode (Anomaly)** — *Target: self-hosted/local-model users and IDE migrants.* Most aggressive **performance engineering** in the set (`session_part` table claiming 72% less WAL writes, 98% less JSON rewriting) and real feature velocity (`/goal` closed after 84 comments, built-in `image_generate`). Strongest community reaction counts (164👍 VS Code extension, 157👍 `/goal`). Weakness: v2 config-loader regression (#32825) and Zen free-tier incident. Positioning: **fastest-moving open alternative, best storage-layer engineering, migration magnet.**

**Pi (Earendil Works)** — *Target: extension authors and provider-flexible teams (`pi-durable`).* Most disciplined bug-closure day: long-standing P0s closed (context-ceiling wedge, Bun `resizeImage` null, p0 undici security bump) alongside stacked Bedrock Mantle/Vertex provider PRs. Signals a **spec-driven ecosystem** — `pi-rs` community Rust port verifies the headless core "atom by atom." Weakness: silent model-fallback UX and Windows `pi.exec` parity. Positioning: **ecosystem/portability bet with strong release discipline.**

**Qwen Code (QwenLM)** — *Target: enterprise managed-agent + Web Shell/Desktop surfaces.* Broadest release footprint today (CLI + Desktop + SDK). Strategic investment in **Managed Agent dual-path architecture** and unattended CI-fixing agents (`/autofix-pr`). Weakness: CI signal quality is the #1 complaint — automated "Main CI failed, no test identified" issues dominate comment counts, plus red `main` (#15820). Positioning: **enterprise agent-platform play, internally strained by CI/release fragility.**

**Summary axes:**
- *User focus:* Claude Code (power individuals) vs. Copilot CLI/Qwen Code (enterprise/managed) vs. OpenCode/Pi (self-hosted/extension ecosystem).
- *Technical approach:* Codex (executor runtime) vs. Gemini (AST/shell-native) vs. OpenCode (storage perf) vs. Pi (spec/portability) vs. Claude Code (plugin hooks).
- *Stability posture:* Pi and Gemini show clean bug-closure/PR hygiene; Codex and Claude Code carry systemic platform bugs; Qwen Code has CI-process debt; Copilot CLI has installer/auth debt.

## 5. Community Momentum & Maturity

**Momentum ranking (release cadence + feature velocity + engagement):**
1. **OpenCode** — 2 releases, `/goal` landed, high 👍 engagement, major perf PRs. Rapidly iterating and closing the loop on long-requested features.
2. **Qwen Code** — 3 releases (CLI/Desktop/SDK), broad feature surface, but momentum is partly undermined by internal CI strain.
3. **Codex** — 3 alphas in 24h, active Discussions (unique among the seven), ambitious architecture. Iterating hard; stability lags ambition.
4. **Pi** — no release but exceptional closure discipline (4+ p0/correctness PRs closed) and a spec-verifying community port.
5. **Gemini CLI** — steady nightly line, strong polish PR wave, but agent-reliability issues (P1 hangs) are the gating risk.
6. **Claude Code** — high engagement (top issue 193👍) but zero PR velocity (2 PRs, both community) and no release — community energy outpacing shipping.
7. **Copilot CLI** — highest issue velocity but weakest PR velocity (installer-only); momentum is *demand-side*, not supply-side.

**Maturity signals (separating "shipping" from "thrashing"):**
- **Most mature process:** Pi (P0 closure hygiene, spec-driven), Gemini CLI (correctness PR wave, nightly discipline).
- **Most mature product surface:** Claude Code (plugin hooks, docs migration) — but process (throughput) is thin.
- **Least process-mature:** Qwen Code (CI signal quality) and Copilot CLI (installer/supply-chain debt, five-month-old WSL2/WSL regressions).

## 6. Trend Signals

1. **Cost predictability is the new battleground.** Three independent communities this week escalated quota/model-capacity complaints (Claude Code team-tiering, Codex Pro capacity, OpenCode Zen free-tier). Vendors that ship transparent, predictable usage tiers — and honest capacity signaling — will win power users. *Implication: budget for "quota anxiety" as a churn vector.*

2. **Silent failure is the defining trust bug of the era.** Across four tools, the highest-resonance issues are things that *fail quietly* (config dropped, model silently swapped, agents reporting false success, edits proceeding on failure). *Implication: observability — loud errors, status honesty, attribution — is a differentiator, not a nice-to-have.*

3. **Windows/WSL remains the industry's unsolved platform tax.** Every tool with Windows users has an active Windows-specific bug cluster; Codex's is systemic. *Implication: teams with Windows/enterprise footprints should weight platform parity heavily in tool selection.*

4. **The Claude Code ecosystem is becoming a compatibility target.** Codex and OpenCode users explicitly request hooks, background updates, and dynamic workflows — migration pressure is real. *Implication: hook/plugin compatibility may become table stakes, and Claude Code's plugin surface is a defensible moat — if shipping velocity returns.*

5. **Agent self-reporting is maturing into a correctness discipline.** Gemini's false `GOAL` status, Codex's approval dead-ends, and Qwen Code's plan-execution delta hooks all point to a market moving from "agent did something" to "agent proved what it did." *Implication: subagent observability (trajectory sharing, status attribution) is the next feature frontier.*

6. **Storage/runtime performance is re-entering the conversation.** OpenCode's WAL-write reduction and Pi/Codex executor work signal that context-size and per-turn overhead are now user-experienced pain, not just infra concerns. *Implication: token-frugal reads (Gemini AST), bounded output (Codex/OpenCode), and server-side message threads (Pi) are converging on the same economic goal.*

**Bottom line for decision-makers:** Choose Pi or Gemini CLI for correctness-minded, budget-conscious teams; Codex for multi-surface ambition if you can tolerate Windows instability; OpenCode for self-hosted/local-model flexibility and fast feature delivery; Copilot CLI for enterprise GitHub-native deployments (budget for auth/install fixes); Qwen Code for managed-agent/Web Shell platforms (monitor CI reliability); Claude Code remains the premium power-user default, but its cost-tiering and shipping-velocity gaps are now its primary competitive vulnerabilities.

---

## Per-Tool Reports

<details>
<summary><strong>Claude Code</strong> — <a href="https://github.com/anthropics/claude-code">anthropics/claude-code</a></summary>

## Claude Code Skills Highlights

> Source: [anthropics/skills](https://github.com/anthropics/skills)

# Claude Code Skills — Community Highlights Report
*Data as of 2026-10-29 · Source: github.com/anthropics/skills*

---

## 1. Top Skills Ranking (by discussion & attention)

> Note: The PR dataset shows `Comments: undefined` across all entries, so ranking below is derived from cross-referencing Issue-level comment activity, recency of updates, and thematic prominence.

**1. skill-creator — trigger eval & cross-platform robustness**
- PR [#1298](https://github.com/anthropics/skills/pull/1298) (open) fixes false misses in trigger evaluation and Windows subprocess pipe failures; PR [#1997](https://github.com/anthropics/skills/pull/1997) corrects YAML frontmatter scalar parsing.
- Backed by high-visibility Issue [#556](https://github.com/anthropics/skills/issues/556) (13 comments, 7 👍) reporting a **0% trigger rate** in `run_eval.py` — the single most-referenced Skill bug.
- Status: **Open**, actively revised across multiple PRs.

**2. mcp-builder — client compatibility & eval harness**
- PR [#1742](https://github.com/anthropics/skills/pull/1742) (open) adapts to `mcp>=2.0.0` rename (`streamablehttp_client` → `streamable_http_client`) and custom headers via `create_mcp_http_client`.
- Paired with Issue [#1390](https://github.com/anthropics/skills/issues/1390): `evaluation.py` reportedly scores **0/N against every real MCP server** due to non-serializable `TextContent`.
- Status: **Open**, high priority for MCP ecosystem users.

**3. claude-api — context bloat & dead links**
- Issue [#1487](https://github.com/anthropics/skills/issues/1487): skill eagerly injects **~156k tokens** in a single tool call, exhausting the context window.
- PR [#1730](https://github.com/anthropics/skills/pull/1730) replaces 3 hard-404 documentation URLs.
- Status: **Open** — critical for token-cost-sensitive workflows.

**4. webapp-testing — security & element reporting**
- PR [#1980](https://github.com/anthropics/skills/pull/1980) removes `shell=True` in `with_server.py` (CWE-78 command injection); PR [#1976](https://github.com/anthropics/skills/pull/1976) fixes textarea/select misreporting in `element_discovery.py`.
- Status: **Open**, part of a coherent bug-fix batch.

**5. docx — correctness & orphaned comments**
- PR [#1792](https://github.com/anthropics/skills/pull/1792) surfaces LibreOffice timeouts as errors and verifies revision-mark removal; PR [#1734](https://github.com/anthropics/skills/pull/1734) detects orphaned comments.
- Issue [#2018](https://github.com/anthropics/skills/issues/2018): `merge_runs.py` writes invalid XML with unbound namespace prefixes.
- Status: **Open** — document tooling is a persistent pain point.

**6. artifact/creative utilities — gradient & wrap bugs**
- PR [#1977](https://github.com/anthropics/skills/pull/1977) fixes `wrapAround()`; Issue [#1868](https://github.com/anthropics/skills/issues/1868) documents `create_gradient_background` off-by-one interpolation.
- Status: **Open**.

**7. pdf — case-sensitivity references**
- PR [#538](https://github.com/anthropics/skills/pull/538) (open since 2026-03) fixes 8 uppercase→lowercase file reference mismatches that break on case-sensitive filesystems.
- Status: **Open, stale** — long-running low-friction fix.

**8. frontend-design — clarity overhaul**
- PR [#210](https://github.com/anthropics/skills/pull/210) (open since 2026-01) rewrites instructions for actionability and coherence.
- Status: **Open, long-pending**.

---

## 2. Community Demand Trends (from Issues)

| Direction | Evidence | Signal |
|---|---|---|
| **Trust & governance of community skills** | Issue [#492](https://github.com/anthropics/skills/issues/492) (46 comments, 3 👍) — community skills impersonating `anthropic/` namespace | 🔥 Highest-engagement issue in the repo |
| **Org-wide skill sharing** | Issue [#228](https://github.com/anthropics/skills/issues/228) (17 comments, 8 👍) — request for a shared skill library instead of manual `.skill` uploads | Strong enterprise pull |
| **Reliable skill triggering / eval** | Issue [#556](https://github.com/anthropics/skills/issues/556) (13 comments, 7 👍) | Core reliability gap |
| **Quality gate pipelines** | Issue [#1385](https://github.com/anthropics/skills/issues/1385) — pre-task calibration → adversarial review → delivery verification | Emerging meta-skill demand |
| **Agent governance** | Issue [#412](https://github.com/anthropics/skills/issues/412) — policy enforcement, threat detection, audit trails | Enterprise compliance interest |
| **Compact agent memory** | Issue [#1329](https://github.com/anthropics/skills/issues/1329) — symbolic notation to reduce context spend | Token-efficiency theme |
| **Packaging/dedup hygiene** | Issue [#189](https://github.com/anthropics/skills/issues/189) (6 comments, 9 👍) — `document-skills` and `example-skills` install identical content | Distribution-layer friction |

**Net trend:** demand is shifting from *"more Skills"* toward **trust, safety, distribution, and evaluation infrastructure** — i.e., the ecosystem is maturing past the novelty phase.

---

## 3. High-Potential Pending Skills (active, not yet merged)

**🎯 Near-term candidates (recent activity + concrete scope):**

- **[#1742 — mcp-builder streamable_http_client fix](https://github.com/anthropics/skills/pull/1742)** · Kuldeeep18 · updated 2026-10-08 — unblocks all MCP v2 users.
- **[#1980 — webapp-testing remove shell=True](https://github.com/anthropics/skills/pull/1980)** · Pcmhacker-piro · updated 2026-10-25 — security fix, low controversy.
- **[#1975 / #1976 / #1977 — pptx, webapp-testing, algorithmic-art patches](https://github.com/anthropics/skills/pull/1975)** · gerardrecinto · updated 2026-10-18/27 — clean, small, tied to filed issues.
- **[#1997 — skill-creator YAML parsing](https://github.com/anthropics/skills/pull/1997)** · BichengWang · updated 2026-10-19 — correctness fix on a core Skill.
- **[#1681 — skill-creator direct execution](https://github.com/anthropics/skills/pull/1681)** · Kuldeeep18 · updated 2026-10-24 — removes `ModuleNotFoundError` friction.

**🆕 New Skill proposals with traction:**

- **[#1245 — notion-spec-to-implementation + quantitative-resume-auditor](https://github.com/anthropics/skills/pull/1245)** · updated 2026-10-15 — spec→Notion task pipeline.
- **[#1703 — md2video-audio](https://github.com/anthropics/skills/pull/1703)** — Markdown → MP4 with voiceover, zero-cost.
- **[#1771 — proofcore-contract-auditor](https://github.com/anthropics/skills/pull/1771)** — Solidity/Rust static analysis + TON blockchain audit proofs.
- **[#525 — pyxel retro game dev](https://github.com/anthropics/skills/pull/525)** · kitao · updated 2026-10-23 — long-running but still active.
- **[#514 — document-typography](https://github.com/anthropics/skills/pull/514)** — orphan/widow/numbering QC for generated docs.
- **[#1615 — scnet-hpc](https://github.com/anthropics/skills/pull/1615)** — SSH/Slurm HPC cluster operations.
- **[#486 — ODT skill](https://github.com/anthropics/skills/pull/486)** — OpenDocument creation/conversion.

**Assessment:** The maintainer-fix PRs (#1742, #1980, #1997) have the highest merge probability due to small diffs and linked issues. New-skills PRs face longer review cycles (some open since March 2026).

---

## 4. Skills Ecosystem Insight

> **The community's most concentrated demand is no longer for new Skills, but for trustworthy, correctly-triggering, context-efficient core infrastructure — trust boundaries, reliable evaluation, and safe execution now outweigh novelty.**

---

# Claude Code Community Digest — 2026-10-29

## 1. Today's Highlights

No new releases shipped in the last 24 hours, but community activity remains intense around **cost/usage tiers** and **desktop/Remote Control parity gaps**. The top-voted issue (#47509, 193 👍) demands a Max 20x equivalent for Team plans, while a companion cost complaint (#105240) reports Max 5x weekly usage hitting 94% in under 48 hours. On the tooling side, a new PR (#32755) proposes a post-edit verification plugin to fix silent Edit failures, and PR #32753 sweeps stale documentation URLs to the current `code.claude.com` domain.

---

## 2. Releases

No new releases in the last 24h.

---

## 3. Hot Issues

1. **[#47509](https://github.com/anthropics/claude-code/issues/47509) — Team plan needs a Max 20x equivalent tier** (69 comments, 193 👍)
   Power users (CTOs, tech leads) find the Premium seat (6.25x Pro) insufficient for agentic CLI workflows and are forced onto individual Max 20x. Highest-engagement issue of the day — a clear signal that enterprise tiering is misaligned with real usage.

2. **[#53454](https://github.com/anthropics/claude-code/issues/53454) — Claude Code can't stop using "load-bearing"** (21 comments, 120 👍)
   A reproducible model-behavior quirk with high community resonance. Low severity but indicative of persistent stylistic drift that users find distracting in long sessions.

3. **[#79305](https://github.com/anthropics/claude-code/issues/79305) — Desktop app: custom themes / accent colors** (23 comments, 81 👍)
   Request for CLI-parity theming. Users cite multi-monitor window recognition as the core pain — a small UX fix with outsized daily impact.

4. **[#98894](https://github.com/anthropics/claude-code/issues/98894) — Uninstalled claude.ai plugins re-enabled server-side** (10 comments)
   Uninstalled plugins are silently re-enabled within seconds and synced into every session. This is a trust and consent issue — the kind of server-side state sync bug that undermines local control expectations.

5. **[#77473](https://github.com/anthropics/claude-code/issues/77473) — Built-in browser lacks WebAuthn/passkey on macOS** (7 comments, 12 👍)
   Blocks GitHub login via passkey in the embedded browser, forcing fallback auth flows. A hard blocker for passwordless-first developers.

6. **[#105240](https://github.com/anthropics/claude-code/issues/105240) — Max 5x weekly usage hit 94% in <48h** (5 comments)
   Reports sudden usage inflation since Oct 17, worse since Oct 24. Pairs with #47509 to form a strong "cost predictability" theme this week.

7. **[#89639](https://github.com/anthropics/claude-code/issues/89639) — macOS scheduled tasks wedge mid tool-call** (5 comments)
   Sessions hang ~30s into WebSearch/WebFetch, stay "running" for days, and pin concurrency slots until the whole schedule starves. Serious reliability bug for automation users.

8. **[#80202](https://github.com/anthropics/claude-code/issues/80202) — CLAUDE.md silently not loaded at drive roots** (5 comments)
   Reproduced on Windows `subst` drives and root checkouts. Silent failure of project memory is dangerous — users don't know their instructions aren't applied.

9. **[#99859](https://github.com/anthropics/claude-code/issues/99859) — Bedrock "400 Input is too long" not treated as request_too_large** (2 comments)
   Oversized image payloads permanently brick sessions on Bedrock because compaction never triggers. Niche but session-fatal.

10. **[#105797](https://github.com/anthropics/claude-code/issues/105797) — Auto mode refuses allow-listed landing script** (2 comments)
    Allow-listed `Bash(tools/land.sh:*)` is rejected in Remote Control auto mode with no documented pre-approval path — a permissions-model gap for worktree-based workflows.

---

## 4. Key PR Progress

Only 2 PRs were updated in the last 24h; both are listed below.

1. **[#32755](https://github.com/anthropics/claude-code/pull/32755) — feat(plugins): add edit-verifier plugin for post-edit verification**
   Adds a PostToolUse hook that verifies Edit tool success (catching whitespace mismatches and already-modified targets) instead of letting Claude proceed on silent failures. Addresses #32658 — a high-value reliability improvement for agentic editing.

2. **[#32753](https://github.com/anthropics/claude-code/pull/32753) — docs: fix stale documentation URLs across repository**
   Migrates 26 references across 12 files from `docs.anthropic.com`/`docs.claude.com` to `code.claude.com`. Fixes #30628; CHANGELOG intentionally untouched.

*(No additional PRs were provided in the last 24h window.)*

---

## 5. Hot Discussions

No Discussions data was provided for this period; section omitted.

---

## 6. Feature Request Trends

- **Plan/tier restructuring for power users** — #47509 (Max 20x equivalent on Team) is the dominant ask, reinforced by usage-cost complaints (#105240).
- **Desktop/app UI parity with CLI** — Theming/accent colors (#79305), session management UI (#104467), and rollback of the new UI (#105591).
- **Session lifecycle controls** — #99633 (`/clear` and `/new` should not inherit custom session names), #104467 (list/control sessions and Remote Control state), #105800 (idle sessions never released, capping folders at 32).
- **Permissions UX** — #105343 (show `permissionDecisionReason` in prompts) and #105797 (pre-approve landing scripts in auto mode).
- **Credential/browser integration** — WebAuthn and Keychain/passkey support in the built-in browser (#77473, #101194).

---

## 7. Developer Pain Points

1. **Cost unpredictability at the top tier** — Both #47509 and #105240 converge on the same frustration: heavy agentic users exhaust Premium/Max 5x quotas faster than the tiering assumes, with no upgrade path short of an individual Max 20x subscription.

2. **Silent failures erode trust** — #80202 (CLAUDE.md not loaded), #98894 (plugins re-enabled server-side), and PR #32755's target problem (failed edits proceeding silently) all share a pattern: the tool doesn't tell users when something didn't work.

3. **Remote Control / scheduled-session reliability** — #89639 (wedged scheduled tasks starving concurrency), #105800 (32-session cap forcing archiving), and #105797 (auto-mode permission refusals) show the always-on/scheduled workflow is still rough.

4. **Desktop browser auth gaps** — #77473 and #101194 together indicate the built-in browser can't participate in modern passwordless auth (passkeys, Keychain autofill), blocking common login flows.

5. **Platform-specific edge cases on Windows** — Drive-root path handling (#80202), invisible File Explorer windows (#105228), and OOM on `/compact` (#90272) suggest Windows still lags in polish.

---

*Digest generated from public GitHub activity on `anthropics/claude-code` for 2026-10-29. Issue/PR numbers and metrics reflect the provided snapshot.*

</details>

<details>
<summary><strong>OpenAI Codex</strong> — <a href="https://github.com/openai/codex">openai/codex</a></summary>

# OpenAI Codex Community Digest — 2026-10-29

## 1. Today's Highlights

Three new `rust-v0.166.0-alpha.*` releases landed in the last 24 hours, signaling active iteration on the Rust core. Meanwhile, Windows Desktop stability remains the dominant theme: a cluster of high-engagement issues around Computer Use, the WSL sandbox boundary, Remote Control, and Codex Cloud environment publishing continues to dominate the tracker. A notable secondary uptick: multiple independent reports of "Selected model is at capacity" affecting paying Pro/Plus accounts across all surfaces.

---

## 2. Releases

Three consecutive alpha releases shipped on the Rust toolchain track:
- [`rust-v0.166.0-alpha.5.1`](https://github.com/openai/codex/releases) — patch on top of alpha.5
- [`rust-v0.166.0-alpha.5`](https://github.com/openai/codex/releases)
- [`rust-v0.166.0-alpha.4`](https://github.com/openai/codex/releases)

Release notes are currently empty (version bump only). No changelog detail is available to summarize.

---

## 3. Hot Issues

1. **[#51524](https://github.com/openai/codex/issues/51524)** — *Windows Computer Use stops at `get_window_state`; cannot determine browser URL* (47 comments, 👍4). The single most-discussed open issue. Windows Computer Use broke on ~Oct 6 and cannot inspect Chrome/Edge windows, halting every turn before any click. Broad blast radius for anyone using the desktop agent on Windows.

2. **[#50428](https://github.com/openai/codex/issues/50428)** — *Windows: durable chat `turn/start` and `thread/fork` fail with `AbsolutePathBuf deserialized without a base path`* (36 comments, 👍3). A deserialization bug that hard-blocks plain-text submissions and forks on Windows Desktop. High impact because it blocks the core chat loop.

3. **[#29639](https://github.com/openai/codex/issues/29639)** — *Browser Use Node REPL fails on Windows Desktop with WSL workspace (`sandboxCwd` unmapped)* (28 comments, 👍9). A long-lived (since June) cross-boundary bug: the auto-generated `node_repl` MCP server passes a Linux path into a Windows binary. High 👍 count shows sustained frustration.

4. **[#39974](https://github.com/openai/codex/issues/39974)** — *Remote Control unstable across Android and iOS while Windows Desktop works* (27 comments, 👍7). Reproduced on three phones across both mobile OSes against a single Windows host. A connectivity reliability concern for the mobile companion experience.

5. **[#2379](https://github.com/openai/codex/issues/2379)** — *Undo/redo typing in the TUI* (15 comments, 👍38). The highest-reacted item on the board. A modest but strongly-requested UX parity feature (Cmd-Z / Shift-Cmd-Z in the prompt) that has sat open since Aug 2025.

6. **[#56736](https://github.com/openai/codex/issues/56736)** — *Remote-SSH: Codex webview times out in 26.1021.22027; rollback restores UI* (10 comments, 👍3). A clean regression with a confirmed working prior version, making it actionable for the team.

7. **[#25301](https://github.com/openai/codex/issues/25301)** — *Computer Use unavailable on Windows Desktop when app-server runs in WSL (`reason=wsl-disabled`)* (6 comments, 👍14). Directly relevant to the same WSL/Windows boundary theme in #29639, and its high 👍 ratio shows a vocal minority who run this exact configuration.

8. **[#57745](https://github.com/openai/codex/issues/57745)** — *Codex Cloud: cannot save draft or publish environment* (5 comments). Part of a same-day cluster (see #57677, #57632, #57672) of Cloud environment publish stalls. Correlated failures across multiple users in one day is a signal worth escalating.

9. **[#57641](https://github.com/openai/codex/issues/57641)** — *Terminal CLI @Browser fails with "browser access host is unavailable" after desktop update* (5 comments, 👍1). A cross-surface regression (CLI impacted by a desktop app update) that narrows the suspected change window.

10. **[#47373](https://github.com/openai/codex/issues/47373)** — *Compact When Idle* (3 comments). A thoughtful enhancement request for idle-time context compaction, referencing #13142 and #4106. Representative of the emerging context-management theme.

---

## 4. Key PR Progress

All PRs below were updated/closed in the last 24h and appear to be bot-generated `copyberry` projections. They're grouped by theme.

**Reliability / recovery**
1. **[#57866](https://github.com/openai/codex/pull/57866)** — *Retry transient environment startup failures on the next turn*. Addresses a stuck-state where a transient executor failure persisted across turns.
2. **[#57820](https://github.com/openai/codex/pull/57820)** — *Improve TUI reconnect recovery and offline exit handling*. Allows `/quit` offline, retries `thread/resume` on `serverShuttingDown`.
3. **[#57864](https://github.com/openai/codex/pull/57864)** — *Allow upstream interruption when canceling Responses Lite turns*. New disabled-by-default `interrupt_on_cancel` feature.
4. **[#57862](https://github.com/openai/codex/pull/57862)** — *Keep resume picker pagination moving across backends*. Prevents a slow backend from blocking responsive ones.

**Auth / onboarding**
5. **[#57859](https://github.com/openai/codex/pull/57859)** — *Extend provider OAuth sign-in timeout to ten minutes*. Targeted at users with MFA.
6. **[#57857](https://github.com/openai/codex/pull/57857)** — *Add Google Cloud Vertex AI setup to TUI onboarding* (feature-flagged). Notable as a new enterprise provider path.

**Code mode / execution runtime**
7. **[#57850](https://github.com/openai/codex/pull/57850)** — *Wire bounded output collection into the code mode runtime*. Bounds the raw V8↔cell-actor event backlog.
8. **[#57848](https://github.com/openai/codex/pull/57848)** — *Add bounded Code Mode output collection and rendering* (1 MiB text / 8 MiB rolling budget).
9. **[#57837](https://github.com/openai/codex/pull/57837)** — *Ship the standalone executor (`codex-exec-server`) in release packages*. Packaging/infra change with `codex-package.json` exposure.

**Safety / correctness**
10. **[#57834](https://github.com/openai/codex/pull/57834)** — *Add isolated Guardian assessments for prepared actions*. Runs a fresh reviewer without publishing a live approval — relevant given the Auto-review/sandbox complaints in #49439 and #56874.

**Misc. worth noting:** [#57839](https://github.com/openai/codex/pull/57839) preserves reasoning-token accounting across resume/fork (prevents premature auto-compaction); [#57824](https://github.com/openai/codex/pull/57824) adds attached threads to diagnostic uploads, which should help triage the volume of Windows/Computer-Use bug reports seen above.

---

## 5. Hot Discussions

### Ideas
- **[#12567 — Memories in Codex](https://github.com/openai/codex/discussions/12567)** (39 comments, 👍14). The team is actively soliciting feedback on citations-from-memory and default behavior. The most-engaged discussion across all categories.
- **[#30332 — Background updates for Codex CLI without blocking startup](https://github.com/openai/codex/discussions/30332)** (👍2). Requests a Claude Code-style background update flow.

### Q&A
- **[#52835 — AI-assisted KPI system: 4 months, no working app. Advice needed.](https://github.com/openai/codex/discussions/52835)** (6 comments). A grounded cautionary thread from a non-developer operations manager — useful for calibrating expectations around agent-assisted builds.
- **[#57771 — Documentation request: producer/build mapping and persisted execution event format](https://github.com/openai/codex/discussions/57771)**. A clear documentation gap around execution-record fields.
- **[#57688 — Windows Codex: resuming authorized development with an inaccessible subagent and missing denial entry](https://github.com/openai/codex/discussions/57688)** and **[#57675 — Pro account: "Selected model is at capacity" for 7 days](https://github.com/openai/codex/discussions/57675)**. Both are user-driven escalation attempts (one blocks a 5-week-old project, the other mirrors issue #56324).

### Show and tell
- **[#57591 — toli](https://github.com/openai/codex/discussions/57591)**. Apache-2.0 tool letting coding agents (Codex ↔ Claude Code) collaborate across machines.
- **[#57797 — Keep Codex CLI running 24/7 on a cloud box](https://github.com/openai/codex/discussions/57797)**. Bash installer + tmux + phone alerts for a remote Linux Codex host.
- **[#56429 — sports-video-coach](https://github.com/openai/codex/discussions/56429)**. Codex reviews sports practice video into a timestamped coaching page.
- **[#56856 — MarketMirror](https://github.com/openai/codex/discussions/56856)**. AGPL-3.0 MCP server simulating buyer panels to test ads/pricing.
- **[#57746 — Zozo](https://github.com/openai/codex/discussions/57746)**. Issue-to-PR workflow with a codified review checklist.
- **[#57683 — PolishProof](https://github.com/openai/codex/discussions/57683)**. MIT-licensed Agent Skill for bounded UI polish with a preservation contract.

---

## 6. Feature Request Trends

- **Context & memory management.** Memories in Codex (#12567) and idle-time compaction (#47373) both point to users wanting the agent to retain and manage context intelligently without manual intervention.
- **CLI parity with peer tools.** Background auto-updates (#30332), undo/redo in the TUI (#2379), and CLI-only Computer Use authorization without the desktop app (#56601) all target the CLI/TUI experience matching other agents.
- **Granular sandbox/permission control.** Requests to disable global skills per-project (#24237) and to fix approval-policy rejections (#56874) show demand for finer-grained policy configuration rather than all-or-nothing.
- **Multi-agent / cross-runtime collaboration.** toli and Zozo both build bridges between Codex and other runtimes — a growing ecosystem direction.
- **Provider flexibility.** The Vertex AI onboarding PR (#57857) reflects ongoing demand for enterprise and non-default provider paths.

---

## 7. Developer Pain Points

1. **The Windows Desktop ↔ WSL boundary is the single biggest recurring source of pain.** #29639, #25301, and the WSL-specific Computer Use failure modes all stem from path/binary/environment mismatches between the WSL workspace and Windows-native subprocesses (`node_repl.exe`, `codex-exec-server`, `sandboxCwd`).
2. **Computer Use / Browser Use instability on Windows.** #51524 (47 comments) and #56755 report the agent stalling at window-state inspection or failing to attach to the in-app browser (IAB). This degrades the flagship desktop feature.
3. **Codex Cloud environment publishing is unreliable.** A same-day spike of at least four issues (#57745, #57677, #57632, #57672) reporting indefinite "Publishing…" hangs and unconfirmable status. The convergence suggests a backend regression rather than individual environment misconfiguration.
4. **Model capacity errors affecting paying accounts.** #57748 and discussion #57675 describe "Selected model is at capacity" across every model and surface for extended periods — devastating for Pro users and a possible account-level routing issue.
5. **Remote Control flakiness on mobile.** #39974 and #44582 (stale project picker on Android Remote) point to reconnect logic that doesn't refresh state from the host.
6. **Sandbox approval dead-ends.** #49439 (`/approve` unavailable after Auto-review denial) and #56874 (`write_stdin` rejected with no approval prompt) leave users with no documented recovery path — a pattern that turns a policy misconfiguration into a hard block.
7. **Regression-driven rollbacks.** #56736 and #57641 both describe a working setup broken by an update, with a known-good prior version — signaling insufficient regression coverage on the Remote-SSH and CLI-browser surfaces.

</details>

<details>
<summary><strong>Gemini CLI</strong> — <a href="https://github.com/google-gemini/gemini-cli">google-gemini/gemini-cli</a></summary>

# Gemini CLI Community Digest — 2026-10-29

## 1. Today's Highlights

The v0.67.0-nightly line continues to stabilize with fixes for Android/Termux ripgrep resolution and CRLF diff normalization. Agent reliability remains the dominant theme across the tracker: subagent success/failure reporting, generalist agent hangs, and browser agent configuration gaps are all drawing sustained maintainer attention. A notable wave of community PRs landed addressing Unicode/surrogate-pair truncation, Windows path casing, and rate-limit UX — signs of maturing polish work on core CLI surfaces.

## 2. Releases

**v0.67.0-nightly.20261028.gfa5c17365** ([release](https://github.com/google-gemini/gemini-cli/releases))
- `fix(core)`: Allow trusted system paths on Android (Termux) for ripgrep resolution ([#29884](https://github.com/google-gemini/gemini-cli/pull/29884)) — improves out-of-box behavior on mobile/terminal-first environments.
- `fix(core)`: Normalize CRLF line endings before diffing in `getDiffContextSnippet` — reduces spurious diffs on Windows-authored files.

## 3. Hot Issues

1. **[#22323](https://github.com/google-gemini/gemini-cli/issues/22323) — Subagent MAX_TURNS reported as GOAL success** (P1, 13 comments). The `codebase_investigator` reports `status: success / Termination Reason: GOAL` even when it hit the turn limit before analyzing anything. This is a correctness/observability bug that undermines trust in agent self-reporting — critical for anyone relying on subagent output in CI or automated flows.

2. **[#19873](https://github.com/google-gemini/gemini-cli/issues/19873) — Zero-dependency OS sandboxing + post-execution intent routing** (P2, 9 comments). Proposes leaning into Gemini 3's native bash affinity (chaining `grep`/`sed`/`awk`) while sandboxing execution. Signals a strategic direction: embrace the model's shell-first training rather than fight it.

3. **[#21409](https://github.com/google-gemini/gemini-cli/issues/21409) — Generalist agent hangs indefinitely** (P1, 8 comments, 👍8). Users report hangs up to an hour when work is delegated to the generalist agent; workaround is disabling subagent delegation. Highest community upvote count in the set — a major blocker.

4. **[#22745](https://github.com/google-gemini/gemini-cli/issues/22745) — AST-aware file reads, search, and mapping** (P2, 7 comments). EPIC investigating whether AST tooling reduces misaligned reads and token noise. Ties into [#22746](https://github.com/google-gemini/gemini-cli/issues/22746) and [#22747](https://github.com/google-gemini/gemini-cli/issues/22747) (tilth/glyph/ast-grep evaluation).

5. **[#21968](https://github.com/google-gemini/gemini-cli/issues/21968) — Gemini under-uses skills and subagents** (P2, 7 comments). Anecdotal but widely echoed: the model won't invoke custom skills/subagents without explicit instruction, even when contextually relevant. Directly affects the value proposition of the skills system.

6. **[#22267](https://github.com/google-gemini/gemini-cli/issues/22267) — Browser Agent ignores `settings.json` overrides** (P2, 4 comments). `AgentRegistry` reads and merges config correctly, but `maxTurns` and friends are dropped downstream — a config-trust bug.

7. **[#21983](https://github.com/google-gemini/gemini-cli/issues/21983) — Browser subagent fails on Wayland** (P1, 4 comments). Linux desktop users blocked; reports `Termination Reason: GOAL` despite failure — same misleading-status pattern as #22323.

8. **[#24246](https://github.com/google-gemini/gemini-cli/issues/24246) — 400 error with >128 tools** (P2, 3 comments). Agent doesn't scope tools intelligently; users with large MCP/skill surfaces hit hard failures. Growing pain as extension ecosystems expand.

9. **[#22672](https://github.com/google-gemini/gemini-cli/issues/22672) — Agent should discourage destructive behavior** (P2, 3 comments). Model reaches for `git reset`/`--force` when safer alternatives exist. Safety-adjacent, high-stakes for production repos.

10. **[#18836](https://github.com/google-gemini/gemini-cli/issues/18836) — Replace WriteToDo with persistent file-based task tracking** (P3, 2 comments). Targets "context rot," token cost, and total memory loss between sessions — a structural limitation of in-context todos.

## 4. Key PR Progress

1. **[#29989](https://github.com/google-gemini/gemini-cli/pull/29989) — Fix incorrect `\n` escape behavior** (P2, core, size/L). Fixes naive escaping that corrupted string literals, regexes, and code spans during edits and UI normalization. Directly addresses issue #22466.

2. **[#30012](https://github.com/google-gemini/gemini-cli/pull/30012) — Surface 429 rate-limit cool-down + countdown**. Adds immediate visibility on Attempt 1 and a per-second countdown ticker. Meaningful UX improvement for quota-constrained users.

3. **[#29993](https://github.com/google-gemini/gemini-cli/pull/29993) — Handle surrogate pairs in `sanitizeForDisplay`**. Prevents dropped/garble emoji when truncation splits UTF-16 surrogates. Same class of fix in [#29965](https://github.com/google-gemini/gemini-cli/pull/29965) for `ExpandableText`.

4. **[#29999](https://github.com/google-gemini/gemini-cli/pull/29999) — Case-insensitive `isWithinRoot` on Windows**. Fixes drive-letter/directory casing mismatches in path containment checks — a recurring Windows correctness gap.

5. **[#30006](https://github.com/google-gemini/gemini-cli/pull/30006) — PowerShell CIM fallback for Windows IDE process lookup**. Replaces Unix-only `ps` fallback that silently returned empty command strings.

6. **[#29982](https://github.com/google-gemini/gemini-cli/pull/29982) — Recognize dotted Gemini 3 models in `supportsMultimodalFunctionResponse`**. Fixes multimodal function-response support detection for modern model naming.

7. **[#29977](https://github.com/google-gemini/gemini-cli/pull/29977) — Honor cancellation in `read_background_output`** (help wanted). Abort signals were ignored; cancelled calls kept sleeping and read logs anyway. Important for agent responsiveness.

8. **[#30003](https://github.com/google-gemini/gemini-cli/pull/30003) — `${VAR:-default}` respects empty env vars**. Aligns settings expansion with Bash semantics and docs.

9. **[#30013](https://github.com/google-gemini/gemini-cli/pull/30013) — Anchor `.git` suffix removal to end of repo URL**. Fixes repo-name parsing when `.git` appears mid-name (e.g., `.github`-style substrings).

10. **[#30009](https://github.com/google-gemini/gemini-cli/pull/30009) — OSS Exit Gate npm publishing workflow**. Adds keyless Workload Identity Federation release pipeline for `@google/gemini-cli`, `-a2a-server`, and `-core`.

*Also noteworthy:* [#29980](https://github.com/google-gemini/gemini-cli/pull/29980) `gemini extensions validate` command; [#30010](https://github.com/google-gemini/gemini-cli/pull/30010) exposes `skill_name` in telemetry metadata whitelist (useful for enterprise logging with prompts disabled).

## 5. Hot Discussions

No discussion data was provided in the source dataset; this section is omitted.

## 6. Feature Request Trends

- **AST-aware tooling** — A coordinated cluster ([#22745](https://github.com/google-gemini/gemini-cli/issues/22745), [#22746](https://github.com/google-gemini/gemini-cli/issues/22746), [#22747](https://github.com/google-gemini/gemini-cli/issues/22747)) investigating AST-based reads, search, and codebase mapping to cut token noise and misaligned reads.
- **Persistent, file-based task tracking** — [#18836](https://github.com/google-gemini/gemini-cli/issues/18836) and [#21000](https://github.com/google-gemini/gemini-cli/issues/21000) push to replace in-context todos with durable CRUD state.
- **Token-frugal surgical reads** — [#19561](https://github.com/google-gemini/gemini-cli/issues/19561) ("Tactful Extraction") targets the ~36.6k-token baseline by establishing a grep-first discovery hierarchy.
- **Subagent observability** — [#22598](https://github.com/google-gemini/gemini-cli/issues/22598) (share subagent trajectories via `/chat share`) and [#21763](https://github.com/google-gemini/gemini-cli/issues/21763) (include subagent context in `/bug` reports).
- **Agent self-awareness** — [#21432](https://github.com/google-gemini/gemini-cli/issues/21432) wants the CLI to accurately answer questions about its own flags, hotkeys, and invocation.
- **Sandboxing + parallel/shared-memory subagents** — [#19873](https://github.com/google-gemini/gemini-cli/issues/19873) and [#18287](https://github.com/google-gemini/gemini-cli/issues/18287).

## 7. Developer Pain Points

1. **Subagent reliability and misleading status** — Hangs ([#21409](https://github.com/google-gemini/gemini-cli/issues/21409)), false GOAL success ([#22323](https://github.com/google-gemini/gemini-cli/issues/22323), [#21983](https://github.com/google-gemini/gemini-cli/issues/21983)), and ignored config ([#22267](https://github.com/google-gemini/gemini-cli/issues/22267)) erode confidence in delegation. This is the single largest cluster of complaints.
2. **Under-invocation of skills/subagents** — Users invest in skills that the model won't use unprompted ([#21968](https://github.com/google-gemini/gemini-cli/issues/21968)).
3. **Tool surface scaling** — >128 tools triggers hard 400s ([#24246](https://github.com/google-gemini/gemini-cli/issues/24246)); no intelligent scoping yet.
4. **Unsafe/destructive command choices** — `git reset`/`--force` reached for too readily ([#22672](https://github.com/google-gemini/gemini-cli/issues/22672)).
5. **Windows and Linux desktop friction** — Path casing ([#29999](https://github.com/google-gemini/gemini-cli/pull/29999)), `ps` fallback ([#30006](https://github.com/google-gemini/gemini-cli/pull/30006)), and Wayland failures ([#21983](https://github.com/google-gemini/gemini-cli/issues/21983)) keep recurring.
6. **Workspace hygiene** — Model scatters temp scripts across directories ([#23571](https://github.com/google-gemini/gemini-cli/issues/23571)), complicating clean commits.
7. **Interactive prompt deadlocks** — Stuck on prompts during scaffolding like `create vite app` ([#22465](https://github.com/google-gemini/gemini-cli/issues/22465)).

---

*Generated from github.com/google-gemini/gemini-cli activity for 2026-10-29.*

</details>

<details>
<summary><strong>GitHub Copilot CLI</strong> — <a href="https://github.com/github/copilot-cli">github/copilot-cli</a></summary>

# GitHub Copilot CLI Community Digest — 2026-10-29

## 1. Today's Highlights

No new releases shipped in the last 24 hours, but issue activity remains heavy (39 issues updated), with MCP OAuth reliability continuing to dominate as the top theme. Several long-standing authentication and platform bugs (Ubuntu keychain, macOS keychain partitioning, WSL2 rendering regression) continue to receive sustained community engagement and high 👍 counts. Notably, a cluster of brand-new triage issues (#5272–#5283) landed today covering autopilot behavior, environment variable inheritance, and SDK concurrency.

## 2. Releases

> No releases in the last 24 hours — this section is omitted.

## 3. Hot Issues

1. **[#2165 — Ubuntu keychain support is broken](https://github.com/github/copilot-cli/issues/2165)** (👍 22, 5 comments) — Highest-reacted open issue. Docs mismatch plus missing `secret-tool` handling breaks Linux auth. Long-running (opened March, still `more-info-needed`), suggesting a fix is overdue.

2. **[#3700 — [High severity] 1.0.60 WSL2 regression: 215% CPU spin, frozen TUI](https://github.com/github/copilot-cli/issues/3700)** — A regression of #2208 that makes the TUI unusable on every session. High severity, reproducible, and still open five months later — a significant Windows/WSL2 reliability concern.

3. **[#4017 — MCP OAuth (Desktop app) cancels host-token, never launches browser flow](https://github.com/github/copilot-cli/issues/4017)** — Non-first-party HTTP MCP servers (Atlassian, incident.io) silently fail with no error and no popup. Symptomatic of a broader MCP OAuth reliability problem.

4. **[#5233 — Remote MCP (OAuth): active session keeps resending expired access token](https://github.com/github/copilot-cli/issues/5233)** — Client never refreshes or prompts re-signin after a 401. Recent (Oct 22) and closed, but representative of a recurring auth-state management gap.

5. **[#5014 — MCP OAuth "Sign in" fails with HTTP 400 for stateful servers](https://github.com/github/copilot-cli/issues/5014)** — Atlassian `/v2/mcp` fails even when a valid token is stored. Regression since runtime 1.0.90-0.

6. **[#5270 — GPT-6.1 Sol locks up plan implementation](https://github.com/github/copilot-cli/issues/5270)** (3 comments) — Plan → Implementation transition hangs forever when GPT-6.1 Sol is auto-selected. Directly blocks agent workflows and Auto-mode reliability.

7. **[#4560 — Model "auto" always runs with reasoning effort disabled](https://github.com/github/copilot-cli/issues/4560)** — `reasoningEffort: null` is forced and cannot be overridden, degrading output quality for users relying on Auto routing.

8. **[#4273 — macOS: keychain prompts on every launch (XARA partition mismatch)](https://github.com/github/copilot-cli/issues/4273)** — GitHub-signed and Microsoft-signed binaries share keychain items, triggering repeated prompts. Friction on every launch for macOS users.

9. **[#5155 — Cloud agent: "Registry only" MCP policy blocks repo-configured servers](https://github.com/github/copilot-cli/issues/5155)** — Enterprise fingerprinting fails for proxy-bridged configs, silently dropping all repo MCP servers. Impactful for enterprise deployments.

10. **[#5281 — Shell runner does not inherit PowerShell environment variables](https://github.com/github/copilot-cli/issues/5281)** — Fresh today. Prevents use of `GITHUB_PERSONAL_ACCESS_TOKEN` and other user-configured env vars in shell tool invocations.

## 4. Key PR Progress

All four PRs updated in the last 24 hours target the **install/uninstall scripts** — an area that has clearly accumulated technical debt:

1. **[#2422 — Add uninstall script for manual installs](https://github.com/github/copilot-cli/pull/2422)** — Adds `uninstall.sh` for curl/wget installs and updates README. Long-open (since March) but valuable for install hygiene.

2. **[#1598 — fix: trap to clean up temp directory on unexpected exit](https://github.com/github/copilot-cli/pull/1598)** — `set -e` leaks `mktemp -d` dirs in `/tmp` on download/network failures. Adds a `trap` to guarantee cleanup.

3. **[#2565 — install: guard against duplicate PATH entries on reinstall](https://github.com/github/copilot-cli/pull/2565)** — Re-running the installer appends duplicate PATH lines because `command -v copilot` needs a shell restart. Fixes idempotency.

4. **[#5093 — install: verify the checksum entry matching the downloaded tarball](https://github.com/github/copilot-cli/pull/5093)** — Addresses a real supply-chain concern: `sha256sum -c --ignore-missing` can vacuously "pass" without verifying the actual tarball. Important security fix.

> Note: only 4 PRs were provided; the remaining six slots are not fillable from the given data.

## 5. Hot Discussions

> No Discussions data was provided — this section is omitted.

## 6. Feature Request Trends

Distilled from the issue set:

- **Feature parity with the VS Code extension** — codebase indexing (#20, closed with 10 👍) and `/rename` in VS Code agent sessions (#4244).
- **Fine-grained tool permission control** — default-deny allowlists for non-interactive mode (#5275), where `--deny-tool` currently overrides `--allow-tool`.
- **Terminal integration hooks** — authoritative foreground-session change hook including warm resume (#5279).
- **UX/accessibility improvements** — light theme support (#5272), visually distinguishing skills from built-in commands (#5274), simpler copy/paste from GitLab Copilot in browser (#5273).
- **Enterprise MCP registry usability** — searching internal registries via `/mcp` (#4999).

## 7. Developer Pain Points

- **MCP OAuth is the dominant reliability gap** — at least four distinct failure modes (silent cancel #4017, HTTP 400 on valid tokens #5014, stale-token resend #5233, enterprise fingerprinting #5155). This is the single most repeated frustration in the dataset.
- **Authentication/keychain instability across platforms** — Ubuntu (#2165, 22 👍), macOS XARA (#4273), and Windows/enterprise login flows all have active pain.
- **Auto-mode and model-selection fragility** — reasoning effort forced off (#4560), GPT-6.1 Sol hangs plan→implement transitions (#5270), and autopilot auto-replies "work autonomously" to skills requiring user input (#5276).
- **Installer robustness debt** — duplicate PATH entries, temp-dir leaks, and vacuous checksum verification all remain unfixed, pointing to low maintenance attention on the install path.
- **Observability gaps** — OTel `execute_tool bash` spans don't expose nonzero exit codes (#4864).
- **SDK scalability** — unbounded `Promise.all` in `listSessions()` exhausts file descriptors (#5282).

---

*Digest compiled from public issue and PR metadata. Counts and 👍 values reflect the snapshot provided; no release or discussion data was available for this date.*

</details>

<details>
<summary><strong>OpenCode</strong> — <a href="https://github.com/anomalyco/opencode">anomalyco/opencode</a></summary>

# OpenCode Community Digest — 2026-10-29

## Today's Highlights

Bugfix releases landed for the TUI and PTY daemon, resolving a hanging worker-request failure. Two long-running threads dominated the day: the closure of the native `/goal` feature request (#27167 after 84 comments) and the still-open free-tier incident thread (#59387). Meanwhile, core contributors pushed significant data-layer PRs — a new `session_part` table to cut WAL writes by 72%, and a built-in `image_generate` tool.

---

## Releases

**v1.19.5**
- Core bugfix: failed TUI worker requests now return an error instead of hanging the caller indefinitely. ([@Nowaker](https://github.com/Nowaker), [#54936](https://github.com/anomalyco/opencode/pull/54936))
- Credit to 1 community contributor.

**process-daemon v0.3.2**
- `opencode-pty` 0.3.2 (protocol 7), published to npm as `@opencode/pty@0.3.2`.

---

## Hot Issues

1. **[CLOSED] Add native session goals with `/goal` ([#27167](https://github.com/anomalyco/opencode/issues/27167))** — 84 comments, 157 👍. A persistent session goal/lifecycle feature. Now closed, correlating with PRs #59437 and #60000 landing the implementation. The single most-watched feature request of the period.

2. **[OPEN] Free tier issues megathread ([#59387](https://github.com/anomalyco/opencode/issues/59387))** — 76 comments. Centralized reporting for Zen free-tier failures: "Free usage exceeded," non-resetting quotas, and desktop version gate errors. Indicates an active billing/quota incident.

3. **[OPEN] Official OpenCode VS Code extension ([#11176](https://github.com/anomalyco/opencode/issues/11176))** — 37 comments, 164 👍. Highest-reaction open request; the community wants first-class VS Code integration rather than terminal-only usage.

4. **[OPEN] Zen critical errors on Muse Spark models ([#48741](https://github.com/anomalyco/opencode/issues/48741))** — 29 comments. `reasoning encrypted_content was not issued to this caller` on image/tool-call requests. High-severity provider bug.

5. **[OPEN] "Retry Now" button to skip rate-limit countdown ([#15988](https://github.com/anomalyco/opencode/issues/15988))** — 21 comments, 28 👍. Small UX win the community clearly wants for the retry loop.

6. **[OPEN] Native Claude Code hooks compatibility ([#12472](https://github.com/anomalyco/opencode/issues/12472))** — 20 comments, 42 👍. Requests support for `PreToolUse`/`PostToolUse`/`Stop` hooks. Strong signal that users are migrating from Claude Code and expect parity.

7. **[OPEN] Desktop 5-minute Headers Timeout with local providers ([#26602](https://github.com/anomalyco/opencode/issues/26602))** — 20 comments. `timeout: false` is ignored; local OpenAI-compatible endpoints abort at exactly 5 minutes. Painful for self-hosted model users.

8. **[OPEN] `OPENCODE_CONFIG_DIR` replaces global config in v2 ([#32825](https://github.com/anomalyco/opencode/issues/32825))** — 12 comments. Reproduced regression: v2/core loader changes semantics vs. the old app loader, silently dropping global config.

9. **[OPEN] Limit max parallel subagents ([#27110](https://github.com/anomalyco/opencode/issues/27110))** — 10 comments, 39 👍. Users on local models hit context/memory ceilings and want a concurrency cap.

10. **[OPEN] Plugin/Agent/Skills marketplace ([#28696](https://github.com/anomalyco/opencode/issues/28696))** — 10 comments, 37 👍. Master issue for a unified registry/discovery/distribution system. Suggests a maturing ecosystem push.

*Also notable:* [#53350](https://github.com/anomalyco/opencode/pull/53350)-adjacent #51940 (session deletion 404), MCP duplicate-process exhaustion ([#31554](https://github.com/anomalyco/opencode/issues/31554)), and the closed universal model router request ([#52743](https://github.com/anomalyco/opencode/issues/52743)).

---

## Key PR Progress

1. **[#58915](https://github.com/anomalyco/opencode/pull/58915) — `session_part` table + history reads** (kitlangton). First half of moving assistant message parts out of the `session_message` JSON blob. Ships one release before the write side.

2. **[#58916](https://github.com/anomalyco/opencode/pull/58916) — Write each assistant part as its own row** (kitlangton). Stacked on #58915; claims 72% less WAL and 98% less JSON rewriting on a 20-tool step. Major storage-layer perf win.

3. **[#59939](https://github.com/anomalyco/opencode/pull/59939) — Built-in `image_generate` tool** (rekram1-node). Lets the model generate/edit images with any configured image model and view the result.

4. **[#60057](https://github.com/anomalyco/opencode/pull/60057) — Stop merging credential metadata into model settings** (rekram1-node). Security fix: login metadata was leaking into request options.

5. **[#59437](https://github.com/anomalyco/opencode/pull/59437) — `/goal` with client-side done check** (neriousy). The implementation behind #27167's closure; avoids a new server event by deriving "done" from synced data.

6. **[#57627](https://github.com/anomalyco/opencode/pull/57627) — Tell Code Mode models built-ins stay top-level** (rekram1-node). Fixes weaker models (Gemma 4, MiMo) calling `await tools.read(...)` incorrectly.

7. **[#60049](https://github.com/anomalyco/opencode/pull/60049) — Fixed-lead background compaction** (neriousy). Changes when `experimental.background_compaction` starts/drops summaries; closes #58818.

8. **[#60055](https://github.com/anomalyco/opencode/pull/60055) — Report unverified clipboard delivery** (Chubercik). Fixes false "Copied to clipboard" toast when the host write actually failed. Closes #59664.

9. **[#60039](https://github.com/anomalyco/opencode/pull/60039) — Per-server TLS trust for remote MCP** (karup). Adds `ca_file`/TLS config block; part of #40111. Flagged `needs:compliance`.

10. **[#60058](https://github.com/anomalyco/opencode/pull/60058) — Record first-launch onboarding from a packaged build** (Hona). Closes a real funnel-testing gap where login shells and Windows path deletion broke isolation.

*Also:* #60036 (AI SDK `provider-utils` bump), #60037 (katex 0.18.11), #48448 (desktop file panel live-refresh), #53820 (Bedrock inference-profile ARN metadata), #52006 (exclude commentary from session titles).

---

## Hot Discussions

No discussion data was provided for this period, so this section is omitted.

---

## Feature Request Trends

- **IDE / editor integration** — The VS Code extension (#11176, 164 👍) and a Copilot BYOK provider extension (#27303) show demand for moving beyond the terminal/TUI into first-class editor surfaces.
- **Agent lifecycle control** — `/goal` (#27167), suspend/resume (#27511), the `session.stopping` hook (#16626), and the agent activity panel (#27995) all point to users wanting richer control over long-running agent loops.
- **Concurrency & resource management** — Parallel subagent caps (#27110), a marketplace (#28696), and compute routers (#52743) reflect orchestration at scale.
- **Claude Code parity** — Hooks compatibility (#12472) and dynamic workflows (#30308) are recurring asks from migrants.
- **Desktop/UX polish** — Voice input (#33300), Office file drag-and-drop (#27689), TUI content width (#25142), and proxy settings (#27892).
- **Provider breadth** — Azure Entra OAuth (#21658) and Responses API for Go (#23655).

---

## Developer Pain Points

- **Free-tier / Zen reliability** — The megathread (#59387) and Muse Spark errors (#48741) show quota resets and provider errors are actively blocking paying-adjacent users.
- **v2 config regressions** — `OPENCODE_CONFIG_DIR` semantics changing (#32825) silently break existing setups during the core migration.
- **Timeouts & local providers** — The hard 5-minute Desktop timeout (#26602) ignores user config, a frequent self-hosted complaint.
- **Process/resource leaks** — Duplicate MCP server processes exhausting `TasksMax` (#31554) and `ENOSPC`/FS-watch crashes (#52776).
- **Retry ergonomics** — Requests to skip the rate-limit countdown (#15988) and a classifier for non-verified clipboard actions (#60055) reflect friction in daily loops.
- **Snapshot reliability** — Git snapshot deadlocks on stale partial repos (#59751) risk data-integrity concerns.

---

*Generated from github.com/anomalyco/opencode activity for 2026-10-29. All links point to the canonical repository.*

</details>

<details>
<summary><strong>Pi</strong> — <a href="https://github.com/earendil-works/pi">earendil-works/pi</a></summary>

# Pi Community Digest — 2026-10-29

## 1. Today's Highlights

No new releases landed in the last 24 hours, but the issue tracker was extremely active: a large batch of long-standing bugs moved to CLOSED (context-ceiling wedging, `resizeImage` null in Bun binaries, `stripAnsi` CSI handling, undici pin bump), while the maintainers pushed a cluster of stacked Bedrock/Vertex provider PRs. The `pi-durable` extension surface continues to attract the most feature discussion, and community ports (`pi-rs`) are starting to appear.

---

## 2. Releases

*No releases published in the last 24 hours.*

---

## 3. Hot Issues

1. **[#5886](https://github.com/earendil-works/pi/issues/5886) — AgentSession settlement/continuation & assistant-tail lifecycle bugs** *(OPEN, 13 comments, 👍4)*
   The highest-traffic open issue: a meta-bug covering the recurring class of failures where post-run logic tries to continue an agent from an already-settled transcript. High comment count and a maintainer-authored summary indicate this is a known architectural sore spot.

2. **[#9409](https://github.com/earendil-works/pi/issues/9409) — Sessions wedge permanently at the context ceiling on reasoning models** *(CLOSED, 12 comments, 👍3)*
   Reasoning models returned `stopReason: "length"` with `usage.output: 16`, and auto-compaction recovery failed after one attempt, permanently bricking the session. Closure is significant for anyone running reasoning models in long sessions.

3. **[#10645](https://github.com/earendil-works/pi/issues/10645) — `resizeImage` resolves null in compiled (Bun) executables** *(CLOSED, 11 comments)*
   All image attachments were silently dropped in standalone binaries since 0.87.x. A nasty silent-failure class bug for RPC/host-app integrators on Windows.

4. **[#9884](https://github.com/earendil-works/pi/issues/9884) — Configured default model sometimes replaced by a fallback at startup** *(OPEN, 7 comments)*
   Reproduced 4/20 startups: the configured extension-provided default was swapped for `deepseek/deepseek-v4-pro`. Points at a race in runtime provider catalog discovery.

5. **[#10812](https://github.com/earendil-works/pi/issues/10812) — Saved default model no longer in catalog silently falls back** *(OPEN, 6 comments)*
   When DeepSeek renamed `deepseek-v4-flash` → `deepseek-flash`, sessions silently started on a different model with no warning. Companion issue to #9884; the silent-fallback UX is the core complaint.

6. **[#10386](https://github.com/earendil-works/pi/issues/10386) — Durable: host coding-agent extensions (AgentSession runtime or hook parity)** *(OPEN, 6 comments)*
   Requests either an AgentSession-backed Durable runtime or `ExtensionAPI` hook parity. Central to the growing `pi-durable` extension ecosystem.

7. **[#10616](https://github.com/earendil-works/pi/issues/10616) — Extension `pi.exec` fails for `.cmd` commands on Windows** *(OPEN, 5 comments)*
   `pi.exec("npm", ["--version"])` returns exit 1 with empty stdout on Windows, while the bash tool works. A recurring platform-parity gap for extension authors.

8. **[#10770](https://github.com/earendil-works/pi/issues/10770) — Default permissions of `.pi/agent/sessions` should be `0700`** *(OPEN, 5 comments)*
   Privacy hardening request: session transcripts are created world-readable by default. Low-effort fix with clear security rationale.

9. **[#7113](https://github.com/earendil-works/pi/issues/7113) — TUI freezes after `/login` when pi.dev catalog is unreachable** *(CLOSED, 5 comments, 👍2)*
   `ModelRuntime.login()` awaited a post-login refresh with no `AbortSignal`/timeout, hanging the TUI whenever the remote catalog was down. Good closure for reliability.

10. **[#11413](https://github.com/earendil-works/pi/issues/11413) — Bump pinned undici from 8.10.2 to ≥8.12.2** *(CLOSED, prio:p0)*
    A pinned vulnerable dependency in `pi-coding-agent` affecting every published version through 1.4.0 — worth checking your lockfile if you vendored the CLI bundle.

*Also notable:* [#11360](https://github.com/earendil-works/pi/issues/11360) (`pi.exec` RangeError crash on >536M-char child output), [#11497](https://github.com/earendil-works/pi/issues/11497) (SqliteStorage dual-opener ID minting), [#11533](https://github.com/earendil-works/pi/issues/11533) (Git package port collision).

---

## 4. Key PR Progress

1. **[#11546](https://github.com/earendil-works/pi/pull/11546) — fix(coding-agent): cap `pi.exec` output at 256 MiB** *(CLOSED)*
   Closes #11360. Adds `ExecOptions.maxBuffer`, terminates oversized commands, and returns `truncated: true` / `killed: true` instead of crashing the process with `RangeError`.

2. **[#11545](https://github.com/earendil-works/pi/pull/11545) — Anthropic message threads** *(OPEN)*
   Uses Anthropic's server-side message-threads beta to send only new messages when a session id and caching are enabled, while still validating the full request. Meaningful token/latency savings for long sessions.

3. **[#11372](https://github.com/earendil-works/pi/pull/11372) — fix(ai): route Bedrock models Converse doesn't serve through Bedrock Mantle** *(OPEN, mitsuhiko)*
   Fixes 16 Bedrock models (GPT-5.4 → GPT-6.1, gpt-oss, Grok 4.3/4.6, Gemma 4) being rejected by Converse; routes them to the OpenAI-compatible Mantle endpoint.

4. **[#8572](https://github.com/earendil-works/pi/pull/8572) / [#8573](https://github.com/earendil-works/pi/pull/8573) — SigV4/IAM auth for Mantle + Mantle Anthropic Messages** *(CLOSED)*
   Stacked on #11372: adds AWS profile/IAM auth for Mantle, strict mode, Daybreak models, overflow detection, and Anthropic Messages routing under the existing `amazon-bedrock` provider.

5. **[#11371](https://github.com/earendil-works/pi/pull/11371) — feat(ai): serve Claude models on Google Vertex AI** *(OPEN, mitsuhiko)*
   Adds the 13 non-deprecated Vertex-cataloged Claude models via a `google-vertex-anthropic` adapter reusing the Anthropic Messages implementation.

6. **[#11544](https://github.com/earendil-works/pi/pull/11544) — fix(env): kill the daemon's commands when it is terminated** *(CLOSED)*
   `Connection.close()` left orphaned commands on local Unix daemons because `SIGTERM` killed the daemon before its `kill_all` ran.

7. **[#11540](https://github.com/earendil-works/pi/pull/11540) — fix(env): fail exec/pty with `spawn_error` when a helper thread can't start** *(CLOSED, bot-authored)*
   Replaces a panic (e.g. on cgroup `TasksMax` exhaustion) with a proper error, restoring cancellation and reply semantics.

8. **[#11543](https://github.com/earendil-works/pi/pull/11543) / [#11541](https://github.com/earendil-works/pi/pull/11541) — fix(coding-agent): strip private-parameter CSI in `stripAnsi`** *(CLOSED)*
   Fixes leftover `35;59;1M`-style mouse-report garbage in tool output by correctly consuming `ESC[<`, `ESC[=`, `ESC[>` prefixed sequences.

9. **[#11348](https://github.com/earendil-works/pi/pull/11348) — fix(tui,coding-agent): handle selection page keys in all scrolling lists** *(CLOSED)*
   Fixes #7629; supersedes #7680 with a generic fullscreen capture flag so `tui.select.pageUp/pageDown` work across selectors, autocomplete, and examples.

10. **[#7948](https://github.com/earendil-works/pi/pull/7948) — feat(coding-agent): defer extension runtime reloads** *(OPEN)*
    Replaces awaited `ctx.reload()` with coalesced, deferred `ctx.requestReload()`, rejecting unsafe direct reloads — an important stability improvement for extension authors.

*Also:* [#10847](https://github.com/earendil-works/pi/pull/10847) (legacy OpenRouter catalog route preservation), [#10914](https://github.com/earendil-works/pi/pull/10914) (docs moved to repo root), [#11515](https://github.com/earendil-works/pi/pull/11515) (configurable HTTP connect timeout).

---

## 5. Hot Discussions

**Show and tell**

- **[#11503](https://github.com/earendil-works/pi/discussions/11503) — pi-rs: a Rust port of the headless core** *(👍1)*
  A community MIT-licensed Rust port of pi 0.74.2's headless core (agent loop, 7 built-in tools, session JSONL, CLI surface, system prompt), claiming behavioral parity verified "atom by atom," plus a DeepSeek API compatibility finding. Worth watching as an independent verification of the core spec.

*Only one discussion was updated in the last 24h.*

---

## 6. Feature Request Trends

- **`pi-durable` extension ergonomics** — the dominant feature direction this cycle: host extension parity ([#10386](https://github.com/earendil-works/pi/issues/10386)), per-turn task lifecycle ([#11141](https://github.com/earendil-works/pi/issues/11141)), admission inside host commits ([#11149](https://github.com/earendil-works/pi/issues/11149)), conversation-busy tasks ([#11332](https://github.com/earendil-works/pi/issues/11332)), and turn limits / `afterTool` for never-ran calls ([#11043](https://github.com/earendil-works/pi/issues/11043)).
- **Provider breadth** — Bedrock Mantle, Vertex Claude, Vertex `streamFunctionCallArguments`, and new OpenAI Codex catalog entries ([#11542](https://github.com/earendil-works/pi/issues/11542)) dominate PR traffic.
- **Server-side conversation state** — Anthropic message threads ([#11545](https://github.com/earendil-works/pi/pull/11545)) signals appetite for reducing per-turn history upload.
- **MCP control surface** — per-tool exposure toggling from the `/mcp` TUI ([#11526](https://github.com/earendil-works/pi/issues/11526)) and CR-only SSE framing support ([#11522](https://github.com/earendil-works/pi/issues/11522)).
- **Local-model prompt hardening** — explicit system-prompt instruction that files are delivered by writing to disk, not pasting into chat ([#10540](https://github.com/earendil-works/pi/issues/10540)).

## 7. Developer Pain Points

- **Silent fallbacks over explicit errors** — the model-default issues ([#9884](https://github.com/earendil-works/pi/issues/9884), [#10812](https://github.com/earendil-works/pi/issues/10812)) share one root complaint: when a configured model disappears or discovery races, Pi quietly runs something else. Developers want a warning or hard failure.
- **Windows platform parity** — `pi.exec` fails on `.cmd` shims ([#10616](https://github.com/earendil-works/pi/issues/10616)), Ctrl+G exits with code 129 ([#11167](https://github.com/earendil-works/pi/issues/11167)), and compiled-binary image attachment breakage ([#10645](https://github.com/earendil-works/pi/issues/10645)) all concentrate on Windows.
- **Unbounded/unguarded I/O paths** — the `pi.exec` string-limit crash ([#11360](https://github.com/earendil-works/pi/issues/11360)), thread-spawn panics ([#11433](https://github.com/earendil-works/pi/issues/11433)), and the login-refresh hang with no `AbortSignal` ([#7113](https://github.com/earendil-works/pi/issues/7113)) all stem from missing limits or timeouts.
- **Session/context lifecycle fragility** — context-ceiling wedging ([#9409](https://github.com/earendil-works/pi/issues/9409)) and settlement/continuation bugs ([#5886](https://github.com/earendil-works/pi/issues/5886)) remain the deepest unresolved reliability concerns.
- **Storage and packaging edge cases** — concurrent SqliteStorage openers ([#11497](https://github.com/earendil-works/pi/issues/11497)) and Git-remote port collisions ([#11533](https://github.com/earendil-works/pi/issues/11533)) show identity/dedup logic that assumes uniqueness too aggressively.
- **Dependency hygiene** — the p0 undici pin bump ([#11413](https://github.com/earendil-works/pi/issues/11413)) is a reminder that exact-pinned transitive deps in the CLI bundle lag security patches.

</details>

<details>
<summary><strong>Qwen Code</strong> — <a href="https://github.com/QwenLM/qwen-code">QwenLM/qwen-code</a></summary>

# Qwen Code Community Digest — 2026-10-29

## 1. Today's Highlights

Qwen Code shipped **v0.26.3** across the CLI, Desktop, and TypeScript SDK, with the Desktop release bundling managed-session permission rules and Auto approval. CI reliability remains the dominant theme of the day: multiple "Main CI failed" issues and release-pipeline blockers are drawing sustained attention, and a fresh P1 (`#15820`) reports two independent full-tier gates red on `main` itself. Meanwhile, the maintainer team continued consolidating the Managed Agent Stage F fault-gate roadmap, closing out several long-running test issues.

## 2. Releases

**v0.26.3** (CLI) — tagged release, no detailed notes attached.

**desktop-v0.26.3** — notable changes:
- `feat(managed)`: session permission rules and Auto approval ([#15448](https://github.com/QwenLM/qwen-code/pull/15448))
- `fix(cli)`: hardened serve token re-issuance

**v0.26.3-nightly.20261028.ca204559a7**
- `fix(config)`: report controls that were silently dropped ([#15794](https://github.com/QwenLM/qwen-code/pull/15794))
- docs updates for managed shared-secret handling

**sdk-typescript-v0.1.25** — bundles CLI v0.26.3 (prior SDK releases in the same batch bundled 0.26.2/0.26.1).

Additionally, PR [#15611](https://github.com/QwenLM/qwen-code/pull/15611) and [#15787](https://github.com/QwenLM/qwen-code/pull/15787) deliver the headline UI work: generated UI cards preserve inputs and state across navigation and split views, render live after the initial calculation, and gate display to MCP-App-capable clients.

## 3. Hot Issues

1. **[#14724](https://github.com/QwenLM/qwen-code/issues/14724)** — *Main CI failed: Managed Agent gate, no test identified* (75 comments). The most-discussed issue in the repo. An automated gate that can't attribute a failure to a specific test is a persistent source of churn; it's been open since 2026-10-19 with `autofix/skip`, signalling the bot has given up on auto-remediation.
2. **[#12380](https://github.com/QwenLM/qwen-code/issues/12380)** — *Define Managed Agent dual-path architecture and staged delivery* (72 comments). The umbrella design issue for the multi-agent platform roadmap. Stage F delivery status is verified against specific `main` commits, making this the canonical coordination thread for the managed-agent effort.
3. **[#13078](https://github.com/QwenLM/qwen-code/issues/13078)** — *Daily dependency CVE audit failed* (34 comments, needs triage). A scheduled security audit has been failing since late September. Long-lived with no resolution — a genuine supply-chain hygiene concern.
4. **[#15173](https://github.com/QwenLM/qwen-code/issues/15173)** — *Main CI failed: E2E Tests, no test identified* (19 comments, autofix in progress). Failing E2E job on the Docker sandbox shard; part of a cluster of untriageable CI failures.
5. **[#15052](https://github.com/QwenLM/qwen-code/issues/15052)** — *Preserve independent main E2E validation when pending runs are replaced* (12 comments, ready-for-human). Identifies a real correctness gap: ref-scoped concurrency replaces pending runs, so intermediate `main` SHAs lose independent validation.
6. **[#15499](https://github.com/QwenLM/qwen-code/issues/15499)** — *Managed runtime v0.26.1 stops at immutable-publication preflight* (11 comments, ready-for-human). A release-blocking pipeline defect; the release job succeeded through preflight but failed before publication.
7. **[#13951](https://github.com/QwenLM/qwen-code/issues/13951)** — *Integration tests fail at Checkout with "pack has 1 unresolved delta"* (9 comments). A git object corruption issue in CI checkout — the kind of infrastructure fault that erodes trust in green builds.
8. **[#15760](https://github.com/QwenLM/qwen-code/issues/15760)** — *Plan-execution delta detection as a hook*, motivated by a third-party reasoning/tool-call divergence report (6 comments, P3, security). Notable because it references external evaluation coverage (Cohere / CTI-REALM on Qwen3.8-Flash-Next) and proposes runtime detection of divergence between stated reasoning and actual tool calls — a safety-adjacent feature request.
9. **[#15795](https://github.com/QwenLM/qwen-code/issues/15795)** — *Harness pool: fire on a released Session can 404 and permanently retire automation* (P1, daemon). A data-loss-flavored bug in the background-automation path: a draining Harness can hand back a Session that is no longer reachable, and the automation is retired for good.
10. **[#15822](https://github.com/QwenLM/qwen-code/issues/15822)** — *VS Code companion wipes sibling keys in `settings.model`* (P2, opened 2026-10-29). Fresh report: `writeCodingPlanConfig` / `writeModelProvidersConfig` overwrite the entire `model` object, silently dropping `baseUrl`, `reasoningEffort`, and friends. High-impact for VS Code users.

Honorable mentions: [#15820](https://github.com/QwenLM/qwen-code/issues/15820) (P1, full tier red on `main`, introduced by #15718) and [#15741](https://github.com/QwenLM/qwen-code/issues/15741) (duplicate MCP tool names discard the whole server with a misleading error) are both worth watching.

## 4. Key PR Progress

1. **[#15611](https://github.com/QwenLM/qwen-code/pull/15611) / [#15787](https://github.com/QwenLM/qwen-code/pull/15787)** — Generated UI card state preservation and MCP-App-gated rendering. The headline UI feature of this release cycle.
2. **[#15821](https://github.com/QwenLM/qwen-code/pull/15821)** — `fix(core)`: retry bodyless 400 responses instead of fail-fast. Adds an `EMPTY_BODY_400` retry classification with a cause-chain walker mirroring `hasNetworkFailureCause`. Directly relevant to flaky-provider resilience.
3. **[#15813](https://github.com/QwenLM/qwen-code/pull/15813)** — `perf(managed)`: bound activation renewal journal growth. SQL-backed Hosted Sessions now renew leases in place rather than appending a full transaction per idle heartbeat — a meaningful write-amplification fix.
4. **[#15466](https://github.com/QwenLM/qwen-code/pull/15466)** — `feat(serve)`: user-scope Skill activation routes (`PUT /skills/:name/activation` and batch variant, up to 100 names). Companion follow-up tracking issue [#15622](https://github.com/QwenLM/qwen-code/issues/15622) already filed.
5. **[#14980](https://github.com/QwenLM/qwen-code/pull/14980)** — `fix(web-shell)`: pause requests offline and recover automatically. Unifies Web Shell HTTP through the SDK and adds shared availability control with a single bounded recovery probe.
6. **[#15807](https://github.com/QwenLM/qwen-code/pull/15807)** — `fix(cli)`: prevent provider menu overlap in short terminals (scroll-offset re-clamp, inert nested `Text` title truncation). Deferred findings tracked in [#15819](https://github.com/QwenLM/qwen-code/issues/15819).
7. **[#15789](https://github.com/QwenLM/qwen-code/pull/15789)** — `fix(core)`: decode buffered shell output once on non-UTF-8 code pages (CP936/CP932/CP866). Fixes an encoding-picked-from-first-chunk bug that would corrupt command results on Windows/legacy locales.
8. **[#15817](https://github.com/QwenLM/qwen-code/pull/15817)** — `feat(autofix-pr)`: root watches at the session worktree under the daemon. Makes `/autofix-pr` work from linked worktrees of multi-worktree clones — practical for the daemon workflow.
9. **[#15780](https://github.com/QwenLM/qwen-code/pull/15780)** — `fix(permissions)`: report malformed permission rules instead of silently dropping them. Important safety-property fix: unbalanced parentheses previously made `permissions.deny` entries protect nothing, visible only in debug logs.
10. **[#11486](https://github.com/QwenLM/qwen-code/pull/11486)** — `feat(cli)`: support exact-version updates (`qwen update --target-version <version>`) without npm discovery, honoring `QWEN_UPDATE_BASE_URL`. Long-running PR (since September) that improves standalone install workflows.

Also notable: [#11854](https://github.com/QwenLM/qwen-code/pull/11854) (hybrid code mode, Codex-aligned `tools.mode` enum) and [#14237](https://github.com/QwenLM/qwen-code/pull/14237) (cross-project Todos page for Web Shell).

## 5. Hot Discussions

No discussion data was provided for this window, so this section is omitted.

## 6. Feature Request Trends

- **Session & multi-agent architecture** — The largest coherent theme. Managed Agent dual-path architecture ([#12380](https://github.com/QwenLM/qwen-code/issues/12380)), session permission rules and Auto approval (desktop v0.26.3), and the Stage F fault-gate suite ([#14054](https://github.com/QwenLM/qwen-code/issues/14054), [#12872](https://github.com/QwenLM/qwen-code/issues/12872)) show sustained investment in session lifecycle management.
- **Background automation & autonomous PR maintenance** — `/autofix-pr` as a local PR-watching command ([#15056](https://github.com/QwenLM/qwen-code/issues/15056)) plus daemon-side fixes ([#15795](https://github.com/QwenLM/qwen-code/issues/15795), [#15817](https://github.com/QwenLM/qwen-code/pull/15817)) point toward unattended CI-fixing agents.
- **Web Shell UX refinements** — Cross-project Todos ([#14237](https://github.com/QwenLM/qwen-code/pull/14237)), offline recovery ([#14980](https://github.com/QwenLM/qwen-code/pull/14980)), and naming/placement of no-workspace sessions ([#15309](https://github.com/QwenLM/qwen-code/issues/15309)) suggest the Web Shell is maturing from prototype to product.
- **Hooks, events, and safety observability** — [#15760](https://github.com/QwenLM/qwen-code/issues/15760) proposes plan-execution delta detection as a hook; paired with the permissions-rule reporting fix, there's a clear appetite for making silent failures visible.
- **Tool modes and extensibility** — Hybrid code mode ([#11854](https://github.com/QwenLM/qwen-code/pull/11854)) and MCP-App-gated UI cards reflect demand for richer, more controllable tool invocation.

## 7. Developer Pain Points

- **CI signal quality is the #1 recurring frustration.** An outsized share of high-comment issues are automated "Main CI failed" reports that cannot identify a test ([#14724](https://github.com/QwenLM/qwen-code/issues/14724), [#15173](https://github.com/QwenLM/qwen-code/issues/15173), [#14796](https://github.com/QwenLM/qwen-code/issues/14796)). Several carry `autofix/skip`, meaning even the bot cannot act. Root causes cluster around concurrency replacing pending runs ([#15052](https://github.com/QwenLM/qwen-code/issues/15052)) and nothing compiling managed-agent-server sources on `main` pushes ([#14381](https://github.com/QwenLM/qwen-code/issues/14381)).
- **Red `main` blocks everyone.** [#15820](https://github.com/QwenLM/qwen-code/issues/15820) reports two non-flaky full-tier failures burning the tier on every PR touching `packages/managed-agent*`.
- **Release-pipeline fragility.** [#15499](https://github.com/QwenLM/qwen-code/issues/15499) (managed runtime stops at immutable-publication preflight) and [#13951](https://github.com/QwenLM/qwen-code/issues/13951) (checkout delta corruption) both impede shipping.
- **Silent configuration failures.** A repeating pattern: settings are accepted but do nothing. See [#15794](https://github.com/QwenLM/qwen-code/pull/15794) (dropped config controls), [#15780](https://github.com/QwenLM/qwen-code/pull/15780) (malformed permission rules), and [#15822](https://github.com/QwenLM/qwen-code/issues/15822) (VS Code writer wiping sibling model keys). Developers want loud, actionable errors on misconfiguration.
- **Platform-specific rough edges.** Non-UTF-8 code pages ([#15789](https://github.com/QwenLM/qwen-code/pull/15789)), macOS CI font baselines ([#15759](https://github.com/QwenLM/qwen-code/issues/15759)), and a request to move routine macOS validation to overnight runs ([#15783](https://github.com/QwenLM/qwen-code/issues/15783)) show cross-platform validation cost is a live concern.
- **MCP error clarity.** [#15741](https://github.com/QwenLM/qwen-code/issues/15741) — duplicate tool names discard an entire MCP server and report a misleading "no tools" error.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*