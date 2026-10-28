# AI CLI Tools Community Digest 2026-10-28

> Generated: 2026-10-28 00:25 UTC | Tools covered: 7

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
**Date: 2026-10-28 | Coverage: Claude Code, OpenAI Codex, Gemini CLI, GitHub Copilot CLI, OpenCode, Pi, Qwen Code**

---

## 1. Ecosystem Overview

The AI CLI tooling market is in a **consolidation-and-hardening phase**: core features (agentic loops, MCP, subagents, extensions) are broadly shipped across all seven tools, and community attention has shifted from "what can it do" to "does it work reliably, cheaply, and transparently." The dominant cross-cutting story today is **release/CI fragility** — Qwen Code, Copilot CLI, and OpenCode all report packaging, publishing, or extension-startup failures that block users despite green internal checks. A second universal theme is **cost and context economics**: compaction efficiency, cache behavior, rate-limit burn, and token-frugal tooling appear in every tracker. Meanwhile, **cloud/remote integration** (Claude Code's Cowork git-proxy outage, Codex's cross-device trust errors, Pi's provider-protocol quirks) has become the leading source of high-severity, high-volume bugs. On the positive side, differentiation is sharpening: Claude Code leans on privacy/permission-model concerns, Codex on sandbox and extension distribution, Gemini on subagent correctness, and OpenCode/Pi/Qwen on extensibility and provider breadth.

---

## 2. Activity Comparison (2026-10-28)

| Tool | Issues (active today) | PRs (active today) | Discussions | Release Status |
|---|---|---|---|---|
| **Claude Code** | ~10 top issues surfaced (large duplicate cluster; ~12+ in Cowork/GitHub family) | 3 PRs updated | N/A (not provided) | v2.1.312 (small release) |
| **OpenAI Codex** | 10+ top issues; extension-startup cluster across Win/Linux/code-server | 10+ merged PRs (all `copyberry[bot]`) | Active — ~10 threads (Show&Tell, Q&A, Ideas) | rust-v0.165.0 stable + 0.166.0-alpha.1–.3 |
| **Gemini CLI** | 10 top issues (P1-heavy subagent cluster) | 10 PRs | N/A (not provided) | v0.66.0 stable + v0.67.0-preview.0 + nightly |
| **GitHub Copilot CLI** | 10+ top issues; ACP parity cluster growing | **0 PRs updated** | N/A (not provided) | 3 patches: v1.0.104 → v1.0.105-1 |
| **OpenCode** | 10 top issues (50 total updated in 24h) | 10 top PRs (50 total updated in 24h) | N/A (not provided) | v2.2.0 (Desktop plugins, experimental) |
| **Pi** | 10 top issues (many P0, several already closed) | 10 PRs (all CLOSED — fast turnaround) | Active — Show&Tell only (2 threads) | **No release in 24h** |
| **Qwen Code** | 10 top issues; CI/release-infra cluster | 10 PRs | N/A (not provided) | v0.26.2 stable + v0.26.3-preview.0 + TS SDK v0.1.24 |

**Notes:**
- **Discussions as primary channel:** Codex and Pi are the only tools with structured Discussions activity today; the other five report no Discussions data (either disabled upstream or not surfaced in the digest). Per methodology, these are marked **N/A** — not "inactive."
- **PR throughput:** OpenCode (~50 PRs/24h) and Codex (~10+ merged PRs/24h, mostly bot-authored) show the highest velocity. Copilot CLI reported **zero PR activity**, the only tool with no merge traffic.
- **Release cadence:** Gemini CLI, Qwen Code, and Copilot CLI each shipped **3 releases** in 24h — the most aggressive cadence. Pi shipped **none**, prioritizing fixes over versioning.

---

## 3. Shared Feature Directions

The following requirements appear across **three or more** tool communities, indicating ecosystem-level demand:

| Direction | Tools | Specific Needs |
|---|---|---|
| **Model/provider routing & switching** | Copilot CLI (#3709 BYOK, #4703), OpenCode (#52743 Auto mode, #52782 cost-aware), Pi (#11488 AY-PI tier routing), Qwen (#13024 IO Intelligence preset), Codex (#57567 catalog URL overrides, #56265 GCP provider) | Multi-provider sessions, mid-session model switching, cost-aware routing, first-class presets for non-OpenAI providers |
| **Session lifecycle & durability** | Claude Code (#67835 unarchive), Copilot CLI (#3518 unarchive, #5100 event delivery), OpenCode (#52846 permission destruction, #52924 v1→v2 migration), Pi (#11460 orphaned branches, #11332 durable tasks), Qwen (#14335 sub-session TTL) | Two-way archive, cross-session orchestration, resumable long-running tasks, recovery from storage failures |
| **Cost/context efficiency** | Codex (#17827 status line, #54956 usage efficiency), Pi (#11500 compaction prefill, #11493 cache miss), Qwen (#2566 truncation), OpenCode (#52894 quota reset), Copilot CLI (#54956 burn rate) | Compaction prefix reuse, cache-persistence guarantees, quota transparency, token-frugal reads |
| **Subagent reliability & observability** | Gemini (#22323 false GOAL, #21409 hangs, #22598 `/chat share`), Codex (#57586 child threads, #57553 dynamic tools), OpenCode (#52743 routing) | Accurate termination semantics, trajectory sharing, non-hanging delegation |
| **Extension/plugin ecosystems** | OpenCode (v2.2.0 Desktop GUI plugins), Pi (#11376 mid-session reloads), Gemini (#29980 `extensions validate`), Copilot CLI (#5269 ACP plugin skills) | Hot-reload without breakage, validation tooling, GUI surfaces, lifecycle robustness |
| **Permission-model trust** | Claude Code (#81138 PII injection, #103994 hook bypass), Codex (#53278 sandbox config ignored), Copilot CLI (#2893 preToolUse bypass), OpenCode (#52720 "always allow" mismatch) | Silent bypasses are the top trust-eroding class across all four |
| **Terminal/Unicode rendering correctness** | Gemini (#29993, #29965 surrogate pairs), Pi (#11422 Kitty keys, #11477 scrollbar), OpenCode (#55533 keypad), Codex (#57564 Vim registers) | Systematic Unicode hardening; a recurring, low-glamour quality gap |

---

## 4. Differentiation Analysis

**Claude Code — Enterprise-integration-first, trust-fragile.**
Focus: cloud/Cowork GitHub integration, memory system, plugin marketplace. Target: teams with managed GitHub workflows and compliance needs. Technical approach: heavyweight tool surface (`add_repo`, `list_repos`, MCP) backed by a git proxy. **Weakness:** an unannounced mid-session proxy change (#76248) and permission-hook bypass (#103994) directly undermine the enterprise trust proposition it's built on.

**OpenAI Codex — Platform-and-sandbox-first, distribution-fragile.**
Focus: multi-provider catalogs (GCP, GPT-6.1 Terra), TUI customization, sandbox (MXC) on Windows. Target: pro/enterprise developers on Windows and multi-cloud. Technical approach: Rust core, aggressive alpha cadence, bot-driven PR throughput. **Weakness:** extension startup failures across Windows/Linux/code-server (#56655, #57422 freezing code-server) and MXC env handling (#56264, #50915) make it the most platform-fragile tool today despite strong release velocity.

**Gemini CLI — Agent-orchestration-first, correctness-fragile.**
Focus: subagent reliability, AST-aware tooling, durable task tracking. Target: developers building agentic workflows with native Gemini 3 bash affinity. Technical approach: EPIC-style architecture issues (#22745) and eval-driven fixes. **Weakness:** the same misleading `GOAL`/success termination semantics appear in three separate P1s — a correctness class that poisons automation built on top.

**GitHub Copilot CLI — Enterprise-ACP-first, parity-fragile.**
Focus: ACP (Agent Client Protocol) parity, org-level custom agents, BYOK. Target: GitHub Enterprise and orchestrator-tooling developers. Technical approach: rapid patch releases. **Weakness:** zero PR activity today; ACP mode ships "silent failures" (~1ms `end_turn`, no model call) and org-level agents are undiscoverable without a matching remote (#3572) — a poor fit for the enterprise surface it targets.

**OpenCode — Extensibility-first, migration-fragile.**
Focus: Desktop GUI plugins (v2.2.0), Auto model routing, session/tab UX parity. Target: power users wanting a scriptable, plugin-driven desktop+TUI hybrid. Technical approach: v2 architecture rewrite, high PR velocity (~50/24h). **Weakness:** v1→v2 migration rough edges (#52924 sessions don't open) and Desktop/Electron stability regressions (ResizeObserver loop, idle CPU pinning) — classic "rewrite tax."

**Pi — Protocol-correctness-first, cost-conscious.**
Focus: provider-protocol fidelity (Anthropic SSE, Bedrock schemas, OpenAI namespaces, LiteLLM errors) and compaction cost. Target: infrastructure-savvy developers running mixed providers and headless/RPC modes. Technical approach: surgical P0 fixes with fast close-out (all 10 PRs CLOSED same day). **Strength:** strongest signal-to-noise on cost transparency (#11500, #11493); **weakness:** provider quirks leak into UX, requiring per-provider patches.

**Qwen Code — Managed-agent-first, infra-fragile.**
Focus: Managed Agent dual-path architecture (#12380, 72 comments), Java embedding, Web Shell. Target: enterprise/Spring-JVM hosts and Web Shell users. Technical approach: staged delivery with heavy serve/Web Shell feature work. **Weakness:** the largest CI/release-infrastructure failure cluster of any tool — publish preflight, Maven host locks, Homebrew linkage — indicating the release pipeline is the current bottleneck, not features.

---

## 5. Community Momentum & Maturity

**Iteration velocity (releases + PR throughput):**
1. **OpenCode** — highest raw activity (~50 PRs, ~50 issues/24h) and a headline feature (v2.2.0 Desktop plugins). Rapidly iterating but absorbing rewrite/migration pain.
2. **OpenAI Codex** — strong cadence (stable + 4 alphas), 10+ merged PRs, but all bot-authored and heavily focused on internal foundations (exec-server, child threads) rather than user-visible fixes.
3. **Gemini CLI** — 3 releases, disciplined P1 issue triage, EPIC-scale architectural thinking; the most "engineering-process mature" tracker.
4. **Qwen Code** — 3 releases + SDK bump, but momentum is **negative on infrastructure**: multiple CI/release failures (#15499, #14724, #15672) consuming contributor energy.
5. **Claude Code** — low release surface (small v2.1.312) but the **highest-engagement individual issues** (65 👍 on #81138; a 41-comment proxy outage); community is loud but the tracker is dominated by one unresolved root cause.
6. **Copilot CLI** — 3 patches shipped, but **zero PR activity** and a growing ACP-gap cluster; maintenance-mode signal despite active issue filing.
7. **Pi** — no release, but the **healthiest fix throughput**: every top PR closed same-day, P0s (namespace replay, Bedrock limits, ENOSPC) resolved within 24h. Maturity through responsiveness rather than versioning.

**Maturity assessment:**
- **Most mature trackers (process-wise):** Gemini CLI, Pi.
- **Most mature ecosystems (feature-wise):** Claude Code, Codex (broadest feature surface, but reliability debt).
- **Fastest-iterating but least stable:** OpenCode, Qwen Code.
- **Highest community engagement per issue:** Claude Code (upvotes concentrated on privacy/UX) and Codex (#17827 at 209 👍 — the single highest-reaction item across all tools).

---

## 6. Trend Signals

**For developers and technical decision-makers:**

1. **Reliability is now the differentiator, not capability.** Every tool has agents, MCP, and subagents. The tools winning community trust today (Pi, Gemini) are those with fast P0 turnaround and honest termination semantics — not those with the most features.

2. **"Silent failure" is the ecosystem's most dangerous bug class.** ACP commands that report success but do nothing (Copilot CLI #5115/#5268), permission hooks silently bypassed (Claude #103994, Copilot #2893), sandbox config ignored (Codex #53278), and misleading `GOAL` success (Gemini #22323) all share one shape: **the system lies about what it did.** This is the top trust risk for anyone automating on top of these tools.

3. **Provider-protocol fidelity is an unsolved, per-vendor tax.** Pi's tracker is a case study: OpenAI namespace replay, Bedrock union-type caps, Anthropic SSE CRLF splits, LiteLLM context errors, OpenCode endpoint routing — each requires a bespoke patch. Expect continued fragmentation; budget for it.

4. **Token economics is becoming a first-class feature axis.** Compaction prefill reuse (Pi #11499), cache-persistence guarantees (Pi #11493), quota reset visibility (OpenCode #52894), and status-line usage displays (Codex #17827, 209 👍) all point to users demanding **cost observability** as a core capability.

5. **Release infrastructure is the hidden bottleneck.** Qwen's CI/Maven/Homebrew cluster, Codex's Open VSX publish lags, and OpenCode's preview-channel duplication show that **distribution pipelines are failing more often than the code they ship.** Teams should treat release engineering as a product feature.

6. **Enterprise readiness hinges on permission-contract integrity.** PII injection into prompts (Claude #81138), org-agent discoverability (Copilot #3572), and unannounced behavior changes (Claude #76248) are the issues that block enterprise adoption — more so than missing features.

7. **Extensibility is the next competitive battlefield.** Desktop GUI plugins (OpenCode v2.2.0), extension validation (Gemini #29980), and mid-session hot-reload (Pi #11376) show plugins are becoming first-class — and hitting lifecycle edge cases. The tool that makes extensions *safe to reload* will win plugin authors.

**Bottom line:** The market has moved past feature parity. The 2026-10-28 data shows a **reliability, cost-transparency, and distribution-quality race** — and the tools investing in honest failure semantics and fast P0 close-out (Pi, Gemini) are building the durable trust advantage, even without the loudest release cadence.

---

## Per-Tool Reports

<details>
<summary><strong>Claude Code</strong> — <a href="https://github.com/anthropics/claude-code">anthropics/claude-code</a></summary>

## Claude Code Skills Highlights

> Source: [anthropics/skills](https://github.com/anthropics/skills)

# Claude Code Skills — Community Highlights Report

*Data source: github.com/anthropics/skills | Snapshot: 2026-10-28*

---

## 1. Top Skills Ranking (Most-Discussed PRs)

Because comment counts on PRs are not exposed in the dataset, the ranking below is based on **community attention signals** — linked issues, update frequency, and cross-referencing with high-comment Issues. All items are currently **OPEN**.

| Rank | Skill / PR | Functionality | Discussion Highlights | Status |
|---|---|---|---|---|
| 1 | **mcp-builder** — [#1742](https://github.com/anthropics/skills/pull/1742) | Fixes `streamablehttp_client` → `streamable_http_client` rename in `mcp>=2.0.0` and custom header handling via `create_mcp_http_client` | Directly addresses [#1668](https://github.com/anthropics/skills/issues/1668); tied to the high-visibility eval failure [#1390](https://github.com/anthropics/skills/issues/1390) (0/N scoring against real MCP servers). Long-lived (Sep 8 → Oct 8), signals active maintenance pressure. | OPEN |
| 2 | **skill-creator** — [#1298](https://github.com/anthropics/skills/pull/1298) | Isolates trigger evals; fixes Windows `select()` on subprocess pipes and runtime-failure false negatives | Related to the "skill-creator should be updated to best practice" sentiment in [#202](https://github.com/anthropics/skills/issues/202) and the XSS finding in [#1394](https://github.com/anthropics/skills/issues/1394). Meta-skill quality is a recurring theme. | OPEN |
| 3 | **notion-spec-to-implementation + quantitative-resume-auditor** — [#1245](https://github.com/anthropics/skills/pull/1245) | Converts Notion product/tech specs into executable tasks with acceptance criteria and progress tracking | One of the few PRs bundling a workflow-automation skill with an evaluator skill; updated as recently as Oct 15 — sustained interest. | OPEN |
| 4 | **proofcore-contract-auditor** — [#1771](https://github.com/anthropics/skills/pull/1771) | Static analysis of Solidity/Rust contracts with cryptographic audit proofs anchored on TON Blockchain | Signals the arrival of **Web3 / smart-contract auditing** as a vertical Skill category. Novel domain, zero-storage Merkle protocol. | OPEN |
| 5 | **webapp-testing** — [#1980](https://github.com/anthropics/skills/pull/1980) | Eliminates `shell=True` command-injection risk (CWE-78) in `with_server.py` | Security-hardening pattern; complements element-discovery fixes [#1976](https://github.com/anthropics/skills/pull/1976). Community is auditing bundled scripts for injection vulnerabilities. | OPEN |
| 6 | **docx** — [#1792](https://github.com/anthropics/skills/pull/1792) | Reports LibreOffice timeouts as errors and verifies output DOCX no longer carries revision marks | Pairs with [#1734](https://github.com/anthropics/skills/pull/1734) (orphaned comments) and [#2018](https://github.com/anthropics/skills/issues/2018) (invalid XML from `merge_runs.py`). Document-skill correctness is a hot cluster. | OPEN |
| 7 | **md2video-audio** — [#1703](https://github.com/anthropics/skills/pull/1703) | Zero-cost Markdown → MP4 pipeline via Marp slides + synthesized voiceover | Highlights demand for **content-production pipelines** (docs → media). Updated Sep 15. | OPEN |
| 8 | **pyxel** — [#525](https://github.com/anthropics/skills/pull/525) | Retro game development in Python with headless input-driven runs and frame inspection | Oldest still-active PR (Mar 5 → Oct 23). Demonstrates long-tail community persistence on niche creative skills. | OPEN |

---

## 2. Community Demand Trends (from Issues)

The most-anticipated new Skill directions distilled from Issues:

1. **Governance & Trust-Boundary Safety** — [#492](https://github.com/anthropics/skills/issues/492) (46 comments) flags community skills masquerading under the `anthropic/` namespace, enabling permission escalation. Governance patterns were separately proposed in [#412](https://github.com/anthropics/skills/issues/412) (*agent-governance*).
2. **Organizational Skill Sharing / Distribution** — [#228](https://github.com/anthropics/skills/issues/228) (17 comments, 👍8) requests native org-wide sharing and shared skill libraries in Claude.ai — the highest-upvoted demand in this set.
3. **Evaluation & Trigger Reliability** — [#556](https://github.com/anthropics/skills/issues/556) (👍7) reports 0% trigger rates for `claude -p`; ties directly to skill-creator PRs #1298 and #1997. The community increasingly treats *eval infrastructure* as a first-class skill concern.
4. **Context/Memory Compression** — [#1329](https://github.com/anthropics/skills/issues/1329) proposes `compact-memory`, symbolic notation for long-running agent state — a direct response to context-window exhaustion (cf. [#1487](https://github.com/anthropics/skills/issues/1487), the `claude-api` skill injecting ~156k tokens).
5. **Reasoning Quality Pipelines** — [#1385](https://github.com/anthropics/skills/issues/1385) proposes a three-gate calibration → adversarial review → delivery verification workflow.
6. **Document/Artifact Correctness** — A recurring cluster across Issues [#189](https://github.com/anthropics/skills/issues/189), [#2018](https://github.com/anthropics/skills/issues/2018), [#1868](https://github.com/anthropics/skills/issues/1868), [#2064](https://github.com/anthropics/skills/issues/2064): duplicate installs, invalid XML, off-by-one rendering, and description-vs-usage confusion.

---

## 3. High-Potential Pending Skills (Likely to Land Soon)

Active-comment PRs not yet merged, showing strong recent updates:

- **webapp-testing fix** — [#1980](https://github.com/anthropics/skills/pull/1980) — security hardness; last updated Oct 25.
- **skill-creator YAML frontmatter parser fix** — [#1997](https://github.com/anthropics/skills/pull/1997) — correctness of evaluation metadata; last updated Oct 19.
- **notion-spec-to-implementation** — [#1245](https://github.com/anthropics/skills/pull/1245) — workflow automation; last updated Oct 15.
- **pptx thumbnail arg validation** — [#1975](https://github.com/anthropics/skills/pull/1975) — small but clean bugfix; last updated Oct 27 (most recent of the set).
- **skill-creator direct execution fix** — [#1681](https://github.com/anthropics/skills/pull/1681) — resolves `ModuleNotFoundError` for standalone `package_skill.py`; updated Oct 24.
- **claude-api dead-URL cleanup** — [#1730](https://github.com/anthropics/skills/pull/1730) — documentation hygiene; updated Oct 4.
- **algorithmic-art wrapAround() fix** — [#1977](https://github.com/anthropics/skills/pull/1977) — fixes [#1897](https://github.com/anthropics/skills/issues/1897); updated Oct 18.

*These PRs cluster around three themes: security/correctness of bundled scripts, evaluation-harness reliability, and documentation integrity — the same areas generating the loudest Issues.*

---

## 4. Skills Ecosystem Insight

> **The community's most concentrated demand is no longer for new Skill ideas, but for trustworthy Skill infrastructure — accurate evals/triggers, secure script execution, correct document/artifact output, and clearly-governed distribution — with everything else (Web3, video, games, memory compression) orbiting that reliability core.**

---

# Claude Code Community Digest — 2026-10-28

## 1. Today's Highlights

A small release (v2.1.312) adds OIDC user-identity flexibility and a "click to send" quality-of-life tweak. The dominant story continues to be the Cowork/cloud GitHub integration outage: a large cluster of issues (many marked duplicate, several with repro) reports that the git proxy rejects pushes to repositories outside a hidden "authorized repository set," and the advertised `add_repo`/`list_repos` tools are frequently missing. Community frustration is amplified by a security-adjacent bug where a `PreToolUse` "ask" decision is bypassed for writes into `.git/` or `.claude/`.

## 2. Releases

**v2.1.312**
- Added `oidc.user_id_claim` to the Claude apps gateway, allowing identification by an `id_token` claim other than `sub` (e.g., Microsoft Entra ID's `oid`).
- Added click-to-send: in fullscreen, clicking the "to send now" hint under a queued message sends it immediately, matching the keyboard shortcut behavior.
- (Release notes appear truncated.)

## 3. Hot Issues

1. **[#76248](https://github.com/anthropics/claude-code/issues/76248) — Cloud/Cowork git proxy blocks all pushes, PAT pass-through broken** (41 comments, 16 👍). The highest-engagement issue today. Users report that supplying their own fine-grained PAT no longer works; the change appeared mid-session, suggesting an unannounced rollout (possibly `CCR_TEST_GITPROXY`). Marked `has repro` and reproduced by maintainers.
2. **[#102273](https://github.com/anthropics/claude-code/issues/102273) — Desktop "next-step" box interrupts discussion** (24 comments, 51 👍). The most-upvoted open issue today. A new end-of-turn UI element with 1–2 answer buttons is seen as disruptive to real conversation flow.
3. **[#81138](https://github.com/anthropics/claude-code/issues/81138) — Account email (PII) injected into system prompt without consent** (19 comments, 65 👍). Highest 👍 count in the set; a privacy/security concern with strong community support.
4. **[#78795](https://github.com/anthropics/claude-code/issues/78795) — Triggered injection for auto-memory topic files** (14 comments). Enhancement request for rules-style frontmatter, tying into the broader memory-system discussion (#34556).
5. **[#84581](https://github.com/anthropics/claude-code/issues/84581) — Cowork can't access any GitHub repo; agent told to call nonexistent `add_repo`** (13 comments, 8 👍). A clear, reproducible root cause for the wider integration failures.
6. **[#67835](https://github.com/anthropics/claude-code/issues/67835) — Session archive is one-way** (13 comments, 15 👍). No `unarchive_session` MCP tool and no Archived view in desktop; sessions become orphaned.
7. **[#97368](https://github.com/anthropics/claude-code/issues/97368) — macOS turn-complete notifications intermittent** (6 comments, 4 👍). Reliability regression in the desktop Code tab.
8. **[#103994](https://github.com/anthropics/claude-code/issues/103994) — `PreToolUse` "ask" overridden in bypassPermissions for `.git/`/`.claude/` writes** (3 comments). Security-relevant: a hook's ask decision can be silently converted to a denial-bypass path.
9. **[#100723](https://github.com/anthropics/claude-code/issues/100723) — Scheduled routines can't push to private repos** (4 comments). Representative of the many routine/GitHub-integration reports (see also #105504, #104741, #105410).
10. **[#89148](https://github.com/anthropics/claude-code/issues/89148) — Claude in Chrome steals OS focus on every tool call** (4 comments, 3 👍). Regression since ~2026-03-25; no background-tab option.

## 4. Key PR Progress

1. **[#15620](https://github.com/anthropics/claude-code/pull/15620) — fix(plugin-dev): correct tools format in agent/command examples.** Converts JSON-array `tools:`/`allowed-tools:` fields to YAML comma-separated form across 11 files, fixing a YAML parsing bug where arrays became literal strings. Open since 2025-12-28.
2. **[#105303](https://github.com/anthropics/claude-code/pull/105303) — Install marketplace plugins from claude-plugins-official** (CLOSED). Migrates the `claude-code-plugins` marketplace to source all plugins from the official repo; merge order gated on upstream PRs #6905/#6906.
3. **[#32753](https://github.com/anthropics/claude-code/pull/32753) — docs: fix stale documentation URLs.** Replaces `docs.anthropic.com`/`docs.claude.com` with `code.claude.com` across 12 files (26 lines), resolving #30628; CHANGELOG intentionally untouched.

Only three PRs were updated in the last 24h; the remaining seven slots are not available from the provided data.

## 5. Hot Discussions

No Discussions data was provided; section omitted.

## 6. Feature Request Trends

- **Memory & context control**: triggered/conditional injection of auto-memory topic files via rules-style frontmatter (#78795).
- **Session lifecycle management**: two-way archive/unarchive, an Archived view, and local interfaces to list, inspect, and background-start Code sessions (#67835, #104467).
- **Plugin/TUI extensibility**: letting plugins observe or own UI regions (e.g., collapse of the AbovePrompt band) (#98986).
- **Less intrusive desktop UX**: reducing end-of-turn prompt boxes that interrupt discussion (#102273).
- **Reliable, transparent cloud GitHub access**: implicit but overwhelming demand for a working `add_repo`/`list_repos` tool surface and a user-visible "authorized repository set" (`#84581`, `#96075`, `#102972`, `#97926`).

## 7. Developer Pain Points

- **Cowork/cloud GitHub integration is the top pain point by volume.** A large fraction of today's top issues describe the same failure family: repos show connected in settings, yet the git proxy returns "not in this session's authorized repository set," `add_repo`/`list_repos` are missing, and PAT pass-through stopped working (#76248, #84581, #96075, #100164, #105504, #104120, #98524, #104741, #105410, #96609, #99466, #99162). Many are marked duplicate, indicating a known but unresolved root cause.
- **Scheduled routines fail unattended.** Cloud routines repeatedly fail to clone/push, often with an invalid `GH_TOKEN` despite a green repo check (#100723, #105410, #98588, #104693, #100131).
- **Account inconsistency.** Identical GitHub App setups behave differently across accounts (#97926), and access can silently break mid-session (#104120).
- **Privacy and permission-model concerns.** PII injection into the system prompt (#81138, 65 👍) and the `bypassPermissions` hook override for `.git/`/`.claude/` writes (#103994) erode trust in the permission contract.
- **Desktop/platform reliability regressions.** Intermittent completion notifications (#97368), Chrome focus-stealing (#89148), and intrusive turn-end UI (#102273).
- **Unannounced behavior changes.** The mid-session git proxy change (#76248) highlights demand for changelog/rollout transparency.

</details>

<details>
<summary><strong>OpenAI Codex</strong> — <a href="https://github.com/openai/codex">openai/codex</a></summary>

# OpenAI Codex Community Digest — 2026-10-28

## 1. Today's Highlights

Release activity is heavy this cycle: **rust-v0.165.0** ships a built-in Google Cloud Vertex AI provider (`model_provider = "gcp"`), adds **GPT-6.1 Terra** to the model catalogs, and improves session navigation with a repository filter and directory grouping in the agent command center. Meanwhile, the 0.166.0 alpha line has already advanced three iterations. On the issue tracker, the dominant story is a wave of **VS Code / Open VSX extension "UI could not start" failures** (versions 26.1021.22027 and 26.51021.22027) affecting Windows, Linux, and code-server users, alongside continued Windows sandbox/MXC environment bugs.

## 2. Releases

**rust-v0.165.0** ([release](https://github.com/openai/codex/releases))
- Added a built-in Google Cloud Vertex AI provider, configured via `model_provider = "gcp"` ([#56265](https://github.com/openai/codex/pull/56265)).
- Added GPT-6.1 Terra to the model catalogs ([#57337](https://github.com/openai/codex/pull/57337)).
- Added a repository filter to the session picker and directory grouping to the agent command center for easier navigation.

**Alpha channel:** `rust-v0.166.0-alpha.1`, `.2`, `.3`, plus `rust-v0.165.0-alpha.1.1` and `.2` were published in the last 24h with no substantive notes — standard alpha cadence.

## 3. Hot Issues

1. **[#37458](https://github.com/openai/codex/issues/37458) [CLOSED] Windows extension fails to start: "couldn't load its resources"** — 58 comments, 14 👍. The longest-running thread in this cycle; closure is a positive signal for the Windows extension resource-loading class of bugs.
2. **[#17827](https://github.com/openai/codex/issues/17827) [OPEN] Customizable status line** — 55 comments, **209 👍** (highest-reaction item). Direct request for Claude Code parity: token usage, model name, rate limits, context window, and git branch in the TUI status line via a shell script. Strong sustained demand.
3. **[#56655](https://github.com/openai/codex/issues/56655) [OPEN] VS Code extension 26.51021.22027 UI doesn't start** — 33 comments, 37 👍. Pro-tier Windows users blocked after upgrade; the central thread for this regression.
4. **[#50915](https://github.com/openai/codex/issues/50915) [OPEN] MXC sandbox fails when an unrelated BitLocker volume is locked** — 24 comments. Notable because the locked volume is unrelated to the workspace; sandbox initialization is reading broader system state than it should.
5. **[#39678](https://github.com/openai/codex/issues/39678) [OPEN] Remote Android→macOS "No project" chat fails with project trust error** — 21 comments. Cross-device remote flows remain brittle at the trust-check boundary.
6. **[#56264](https://github.com/openai/codex/issues/56264) [OPEN] Windows thread resume fails: MXC `process.env` lacks `SYSTEMROOT`** — 19 comments. Same MXC/env-reduction family as #50915; resuming existing chats breaks before `AGENTS.md` loads.
7. **[#40579](https://github.com/openai/codex/issues/40579) [OPEN] Windows MCP process-batch accumulation and incomplete cleanup** — 13 comments. Reproducible with 5 MCP servers; resource leak with performance impact.
8. **[#54956](https://github.com/openai/codex/issues/54956) [OPEN] Improve Plus usage efficiency and enable affordable model experimentation** — 11 comments. Rate-limit economics on Plus; connects to #55281's report of agent loops rapidly exhausting limits.
9. **[#53278](https://github.com/openai/codex/issues/53278) [OPEN] Windows Desktop applies `networkAccess=false` despite network access enabled** — 8 comments. Sandbox config not honoring user settings — a trust-eroding class of bug.
10. **[#57032](https://github.com/openai/codex/issues/57032) / [#57344](https://github.com/openai/codex/issues/57344) / [#57422](https://github.com/openai/codex/issues/57422) [OPEN] Extension UI startup failures, Linux/Fedora and code-server** — Fedora VS Code, Windows VS Code, and code-server all report the same "could not start its user interface" symptom on 26.1021.22027; #57422 notes it **freezes the entire code-server editor**, not just the Codex view.

## 4. Key PR Progress

*(All items below are merged/closed PRs from the last 24h, authored by `copyberry[bot]`.)*

1. **[#57590](https://github.com/openai/codex/pull/57590) Ship `codex-exec-server` in CLI and app-server packages** — Bundles the standalone executor into `bin/`, advertises it via `execServer` in `codex-package.json`, and wires it into Cargo/Bazel release packaging and macOS signing.
2. **[#57589](https://github.com/openai/codex/pull/57589) Add a standalone `codex-exec-server` executable** — Extracts executor startup into `codex-exec-server-cli`, shared by `codex exec-server` and the new binary; preserves auth, config overrides, and sandbox helper dispatch.
3. **[#57586](https://github.com/openai/codex/pull/57586) Add host-reserved V2 child creation APIs** — `CodexThread::create_child`, `prepare_child`, and `ThreadManager::create_prepared_child` for spawning idle child threads from live tool invocations. Foundation for subagent work.
4. **[#57553](https://github.com/openai/codex/pull/57553) Allow replacing dynamic tools between model steps** — `CodexThread::replace_dynamic_tools` swaps the tool catalog without starting a turn; preserves in-flight calls and supports clearing.
5. **[#57564](https://github.com/openai/codex/pull/57564) Preserve rich composer content in Vim registers** — Mention targets, image paths, and collapsed pastes survive copy/delete/paste into registers, with fresh element identities on paste.
6. **[#57585](https://github.com/openai/codex/pull/57585) Replace unavailable image references in model requests** — Opt-in availability checks so model requests reflect current file state while saved history keeps original references.
7. **[#57569](https://github.com/openai/codex/pull/57569) Preserve process output and control replies under backpressure** — Fixes lost output/blocked control replies when the in-process event queue fills; addresses descendant-held streams after child exit.
8. **[#57568](https://github.com/openai/codex/pull/57568) Configure memory consolidation service tiers independently** — New `memories.consolidation_service_tier` (default `"default"`) so background consolidation no longer inherits the session tier.
9. **[#57567](https://github.com/openai/codex/pull/57567) Allow catalog URL overrides for the built-in OpenAI provider** — `model_catalog_url` under `[model_providers.openai]` while preserving identity/auth/routing via `openai_base_url`.
10. **[#57584](https://github.com/openai/codex/pull/57584) Preserve output boundaries through token truncation** — New `OutputBoundary` APIs mapping item indices and UTF-8 offsets through truncation; matters for accurate UI diffing and citation.

Also of note: [#57563](https://github.com/openai/codex/pull/57563) stops HTTP response streams from retaining completed output items when inference tracing is off (memory), and [#57597](https://github.com/openai/codex/pull/57597) redacts sensitive URLs/close reasons in WebSocket probe diagnostics.

## 5. Hot Discussions

**Show and tell**
- **[#57591](https://github.com/openai/codex/discussions/57591) toli** — Apache-2.0 tool letting Codex and Claude Code communicate directly, including across different developers' machines. Addresses the "our agents had different context" problem.
- **[#57524](https://github.com/openai/codex/discussions/57524) BankBridge** — Remote MCP server giving Codex read-only access to your own bank/card/investment accounts, with OAuth dynamic client registration. One-line `codex mcp add`.
- **[#57463](https://github.com/openai/codex/discussions/57463) Handoff Kit** — Select the exact saved task before continuing, solving ambiguity when a workspace has multiple unfinished handoffs.
- **[#56176](https://github.com/openai/codex/discussions/56176) Agent Relay Check v0.1.4** — Repeatable before/after check that a fresh session actually receives nested `AGENTS.md` instructions.
- **[#57348](https://github.com/openai/codex/discussions/57348) Reset NE** — Tracker aggregating Codex reset notices, Tibo's updates, a reset calendar/history, and an experimental forecast.
- **[#56564](https://github.com/openai/codex/discussions/56564) Haru Café** — Long-form build story on using Codex to found a company without discarding an existing agent identity.
- **[#56429](https://github.com/openai/codex/discussions/56429) sports-video-coach** — Codex reviews your own sports video and produces timestamped clips, drills, and targets.

**Q&A**
- **[#56686](https://github.com/openai/codex/discussions/56686)** — Is there a supported hard pre-request token bound for `codex exec` with ChatGPT auth (no API key)? Use case: a 250k-input diagnostic ceiling.
- **[#49965](https://github.com/openai/codex/discussions/49965)** — Windows Dot tasks can't drive the local browser even though ordinary Codex chats can; seeking a working recovery.

**Ideas / General**
- **[#49577](https://github.com/openai/codex/discussions/49577)** — Marketing-style post on food/grocery marketplace app development companies; low technical signal.

## 6. Feature Request Trends

- **TUI/status-line customization parity with Claude Code** — #17827 remains the single highest-reaction request (209 👍); users want shell-script-driven status lines showing tokens, model, rate limits, context, and git branch.
- **Usage-limit visibility and efficiency** — #25561 (persistent remaining-usage indicator in Desktop) and #54956 (Plus usage efficiency + affordable model experimentation) reflect growing anxiety about burn rate, amplified by #55281's report of agent loops exhausting limits.
- **Navigation and session ergonomics** — The 0.165.0 session-picker repository filter and command-center directory grouping respond directly to scaling pain as users accumulate many sessions and repos.
- **Provider and catalog extensibility** — Model-catalog URL overrides for the built-in OpenAI provider (#57567) and the new GCP provider (#56265) show demand for heterogeneous model routing without abandoning built-in auth/routing.
- **Agent-to-agent and cross-tool interop** — Discussions like toli (#57591) and Handoff Kit (#57463) indicate users are building their own coordination layers because native multi-agent context sharing is insufficient.
- **Configurable background/maintenance behavior** — Independent service tiers for memory consolidation (#57568) and opt-in image availability checks (#57585) point to a desire for finer-grained control over non-interactive work.

## 7. Developer Pain Points

- **Extension startup failures are the top blocker.** Versions 26.1021.22027 and 26.51021.22027 fail with "could not start its user interface" across Windows (#56655, #57344), Fedora Linux (#57032), and code-server (#57422, which freezes the entire editor). Downgrading to 26.1007.21434 is the only known workaround. Combined with repeated Open VSX publish lags (#32499, #39476), extension distribution reliability is a systemic concern.
- **Windows sandbox (MXC) environment handling is fragile.** Two distinct failures share a root shape: reduced `process.env` missing `SYSTEMROOT` (#56264) and pre-launch failure triggered by an unrelated locked BitLocker volume (#50915). Recommend scoping sandbox env construction to the workspace, not global system state.
- **Sandbox configuration not honored.** `networkAccess=false` applied despite network access being enabled (#53278) undermines user trust in the permission model.
- **MCP lifecycle management on Windows.** Process-batch accumulation and incomplete cleanup with as few as 5 servers (#40579) produces leaks and performance degradation.
- **Rate-limit burn from agent loops.** #55281 documents repetitive loops rapidly exhausting usage; the concern recurs in #54956 and #25561, indicating a perceived mismatch between autonomous agent behavior and subscription economics.
- **Remote/cross-device trust friction.** #39678 (Android→macOS) and #37893 (stale app-server after daemon state loss) show trust and daemon-state handling breaking multi-surface workflows.
- **Desktop UI regressions.** Lost scroll position on task switch (#38887), Codex settings surfacing under ChatGPT personalization (#45873), and broken auto-hidden taskbar reveal while maximized (#45369) — small but compounding desktop-quality issues.
- **Preview-channel duplication.** The same "could not start UI" symptom on both stable and pre-release build numbers (#57422, #57344) suggests insufficient pre-release gating before promotion to stable on Open VSX.

---
*Generated from github.com/openai/codex data current as of 2026-10-28.*

</details>

<details>
<summary><strong>Gemini CLI</strong> — <a href="https://github.com/google-gemini/gemini-cli">google-gemini/gemini-cli</a></summary>

# Gemini CLI Community Digest — 2026-10-28

## 1. Today's Highlights

The project shipped three releases in the last 24 hours, headlined by the **v0.66.0 stable** cut and the start of the **v0.67.0 preview/nightly line**, which lands targeted fixes for quota-error classification and ACP permission metadata. Meanwhile, the issue tracker shows sustained focus on **subagent reliability** — recovery/termination semantics, browser-agent lock handling, and agent self-awareness dominate the top of the list.

## 2. Releases

- **v0.66.0 (stable)** — Promotes the 0.65 line; includes a ROADMAP.md cleanup removing the outdated 2025 roadmap ([PR #29723](https://github.com/google-gemini/gemini-cli/pull/29723)) and the 0.65.0-preview changelog.
- **v0.67.0-preview.0** — First preview of the 0.67 line; includes the 0.66.0-preview changelog and release-version bumps.
- **v0.67.0-nightly.20261027.g363a13119** — Nightly with two notable changes:
  - `fix(core)`: classify project spending-cap errors as **terminal quota errors** ([PR #29961](https://github.com/google-gemini/gemini-cli/pull/29961)) — prevents retry loops on hard billing limits.
  - `fix(acp)`: include **MCP server and tool metadata** in permission requests ([PR #29854](https://github.com/google-gemini/gemini-cli/pull/29854)) — improves consent UX for ACP-driven tool calls.

## 3. Hot Issues

1. **[#22323](https://github.com/google-gemini/gemini-cli/issues/22323) — Subagent recovery after MAX_TURNS reported as GOAL success** (P1, 13 comments)
   The `codebase_investigator` subagent claims `status: "success"` / `Termination Reason: "GOAL"` even when it exhausted its turn budget before analyzing anything. This is a correctness bug in agent orchestration with real trust implications — automated workflows may proceed on false-positive results.

2. **[#21409](https://github.com/google-gemini/gemini-cli/issues/21409) — Generalist agent hangs** (P1, 8 comments, 8 👍)
   Highest-engagement issue this cycle: delegating to the generalist subagent hangs indefinitely (up to an hour observed). Workaround is to disable subagent delegation entirely. The upvote count signals broad reproduction.

3. **[#21983](https://github.com/google-gemini/gemini-cli/issues/21983) — Browser subagent fails on Wayland** (P1, Linux)
   Reports `Termination Reason: GOAL` despite failure — same misleading-termination theme as #22323. Linux/Wayland users are disproportionately affected.

4. **[#19873](https://github.com/google-gemini/gemini-cli/issues/19873) — Zero-dependency OS sandboxing + post-execution intent routing** (P2)
   Proposes leaning into Gemini 3's native bash affinity (`grep`, `sed`, `awk`) while containing risk via sandboxing rather than tool restrictions. A significant architectural direction for agent capability.

5. **[#22745](https://github.com/google-gemini/gemini-cli/issues/22745) — Assess AST-aware file reads, search, and mapping** (P2 EPIC)
   Umbrella investigation into whether AST-aware tooling reduces turns, token noise, and misaligned reads. Likely to shape the next generation of `codebase_investigator` behavior.

6. **[#21968](https://github.com/google-gemini/gemini-cli/issues/21968) — Gemini does not use skills and sub-agents enough** (P2)
   Anecdotal but widely felt: custom skills (e.g., `gradle`, `git`) are ignored unless explicitly invoked. This is a discoverability/steering problem at the heart of the extensibility story.

7. **[#24246](https://github.com/google-gemini/gemini-cli/issues/24246) — 400 error with >128 tools** (P2)
   Tool-count ceiling causes hard API failures. Directly limits MCP-heavy setups where users mount many servers.

8. **[#22672](https://github.com/google-gemini/gemini-cli/issues/22672) — Agent should stop/discourage destructive behavior** (P2)
   `git reset`, `--force`, and unsafe DB operations appear when safer alternatives exist. Safety-critical for anyone running the CLI against production-adjacent resources.

9. **[#22465](https://github.com/google-gemini/gemini-cli/issues/22465) — Stuck at interactive prompt creating Vite app** (P2)
   Classic TTY-interaction failure: scaffolding tools that prompt block the agent. Requested fix is a behavioral eval plus prompt adjustment.

10. **[#18836](https://github.com/google-gemini/gemini-cli/issues/18836) — Replace WriteToDo with persistent file-based task tracking**
    Proposes deprecating in-context todo storage to eliminate "context rot," token bloat, and cross-session memory loss. Foundational for long-running tasks.

## 4. Key PR Progress

1. **[#29989](https://github.com/google-gemini/gemini-cli/pull/29989) — fix(core,cli): incorrect `\n` escape behavior** (P2)
   Fixes naive escaping that corrupted valid `\n` sequences inside string literals, regexes, and code spans during edits — a subtle but high-impact edit-fidelity bug.

2. **[#29994](https://github.com/google-gemini/gemini-cli/pull/29994) / [#29988](https://github.com/google-gemini/gemini-cli/pull/29988) — VS Code IDE companion: register all disposables in `context.subscriptions`**
   Two independent fixes for a comma-expression bug that silently dropped `gemini.diff.accept` and workspace-folder listeners. Same root cause, parallel submissions.

3. **[#29982](https://github.com/google-gemini/gemini-cli/pull/29982) — Recognize dotted Gemini 3 models in `supportsMultimodalFunctionResponse`**
   `startsWith('gemini-3-')` misses dotted model names when dynamic model configuration is off. Small change, meaningfully affects multimodal tool responses.

4. **[#29987](https://github.com/google-gemini/gemini-cli/pull/29987) — Normalize leading slashes in `@` file search for autocomplete**
   Enables `@/`, `@./package.json`, and root-relative path completion — a frequent papercut for CLI users.

5. **[#29993](https://github.com/google-gemini/gemini-cli/pull/29993) — Handle surrogate pairs in `sanitizeForDisplay` truncation**
   UTF-16 truncation was splitting astral characters (emoji), producing unpaired surrogates and dropped output.

6. **[#29965](https://github.com/google-gemini/gemini-cli/pull/29965) — Fix truncation and toggle behavior in ExpandableText**
   Same Unicode-family of bugs, this time in the Ink-rendered collapsible labels.

7. **[#29904](https://github.com/google-gemini/gemini-cli/pull/29904) — Bound inline history re-render after terminal width changes**
   Directly addresses flicker/performance complaints around terminal resize (see issue [#21924](https://github.com/google-gemini/gemini-cli/issues/21924)).

8. **[#29980](https://github.com/google-gemini/gemini-cli/pull/29980) — Add `gemini extensions validate` command + eval tests**
   Validates `gemini-extension.json` manifests, context-file path security, and prerequisites before install/publish. Important for the emerging extension ecosystem.

9. **[#29798](https://github.com/google-gemini/gemini-cli/pull/29798) — Restore approval focus after cancelling editor selection**
   Escape now closes the external-editor dialog and returns to usable pending approval instead of cancelling the whole request.

10. **[#29983](https://github.com/google-gemini/gemini-cli/pull/29983) — Add research-mode example extension**
    A ready-to-install Perplexity-style `/research <topic>` extension under `docs/examples/` — useful reference material for extension authors.

## 5. Hot Discussions

No Discussions data was provided with this dataset, so this section is omitted.

## 6. Feature Request Trends

- **AST-aware codebase tooling** — A cluster of issues ([#22745](https://github.com/google-gemini/gemini-cli/issues/22745), [#22746](https://github.com/google-gemini/gemini-cli/issues/22746), [#22747](https://github.com/google-gemini/gemini-cli/issues/22747)) investigates using AST-grep and similar CLIs for precise reads, searches, and codebase mapping.
- **Persistent, file-based task tracking** — Replacing in-context todos ([#18836](https://github.com/google-gemini/gemini-cli/issues/18836), [#21000](https://github.com/google-gemini/gemini-cli/issues/21000)) to combat context rot.
- **Better subagent observability** — `/chat share` for subagent trajectories ([#22598](https://github.com/google-gemini/gemini-cli/issues/22598)), subagent context in `/bug` reports ([#21763](https://github.com/google-gemini/gemini-cli/issues/21763)).
- **Agent self-awareness** — Accurate CLI flags, hotkeys, and self-execution knowledge ([#21432](https://github.com/google-gemini/gemini-cli/issues/21432)).
- **Token-frugal surgical reads** — "Tactful Extraction" hierarchy favoring `grep_search` before file reads ([#19561](https://github.com/google-gemini/gemini-cli/issues/19561)).
- **Per-workspace policy scoping** — Auto-adding policies per workspace rather than globally ([#18397](https://github.com/google-gemini/gemini-cli/issues/18397)).
- **Parallel subagent collaboration / shared memory** — Blocked pending parallel subagent infrastructure ([#18287](https://github.com/google-gemini/gemini-cli/issues/18287)).

## 7. Developer Pain Points

- **Misleading subagent termination semantics.** Multiple P1s ([#22323](https://github.com/google-gemini/gemini-cli/issues/22323), [#21983](https://github.com/google-gemini/gemini-cli/issues/21983)) show failures being reported as `GOAL`/`success`. This erodes trust in agent output and any automation layered on top.
- **Subagents hanging or under-used.** [#21409](https://github.com/google-gemini/gemini-cli/issues/21409) (hangs) and [#21968](https://github.com/google-gemini/gemini-cli/issues/21968) (never invoked spontaneously) bracket the problem: subagents are both unreliable and hard to trigger deliberately.
- **Configuration overrides silently ignored.** Browser Agent disregards `settings.json` `maxTurns` ([#22267](https://github.com/google-gemini/gemini-cli/issues/22267)); agent markdown symlinks aren't recognized ([#20079](https://github.com/google-gemini/gemini-cli/issues/20079)).
- **Tool-count limits break MCP-heavy workflows.** 400 errors above ~128 tools ([#24246](https://github.com/google-gemini/gemini-cli/issues/24246)) with no smart scoping.
- **Terminal rendering fragility.** Resize flicker ([#21924](https://github.com/google-gemini/gemini-cli/issues/21924)), ambiguous-width CJK character handling ([#29905](https://github.com/google-gemini/gemini-cli/pull/29905)), and a surge of surrogate-pair truncation PRs ([#29993](https://github.com/google-gemini/gemini-cli/pull/29993), [#29965](https://github.com/google-gemini/gemini-cli/pull/29965)) point to a class of Unicode/render bugs needing systematic hardening.
- **Destructive command risk.** Unsafe `git reset`/`--force` and DB modifications ([#22672](https://github.com/google-gemini/gemini-cli/issues/22672)) remain unguarded.
- **Workspace hygiene.** The model scatters temp scripts across directories ([#23571](https://github.com/google-gemini/gemini-cli/issues/23571)), complicating clean commits.

</details>

<details>
<summary><strong>GitHub Copilot CLI</strong> — <a href="https://github.com/github/copilot-cli">github/copilot-cli</a></summary>

# GitHub Copilot CLI Community Digest — 2026-10-28

## Today's Highlights
The Copilot CLI maintainers shipped three rapid-fire patch releases (v1.0.104 through v1.0.105-1), headlined by a fix for selecting **Copilot Fusion High/Max** from long-context sessions and improved Autopilot wait behavior for background tasks. Meanwhile, community activity remains dominated by **BYOK/local provider limitations** (~#3709, 34 👍), **model persistence bugs** (#1869), and a surge of **ACP (Agent Client Protocol) parity gaps** — three new triage issues (#5268, #5269) and an ongoing rename/contextTier cluster (#5115, #4275) landed today alone.

## Releases
Three releases in the last 24h:

- **[v1.0.105-1](https://github.com/github/copilot-cli/releases)** — Minor fixes and changes.
- **[v1.0.105-0](https://github.com/github/copilot-cli/releases)** — Fixed: selecting **Copilot Fusion High or Max** in `/model` now works from long-context sessions.
- **[v1.0.104](https://github.com/github/copilot-cli/releases) (2026-10-27)** — The "fusion" managed model now starts sessions on **Auto** and applies `fusionTier` settings; Autopilot sessions (interactive + SDK) now keep waiting on attached background tasks instead of stopping after `COPILOT_TASK_WAIT_TIMEOUT_SECONDS` (only `-p --autopilot` still honors the timeout). Also fixes a saved Auto preference issue.

## Hot Issues
1. **[#3709 — Allow `/model` to switch across multiple models incl. BYOK/local providers](https://github.com/github/copilot-cli/issues/3709)** (12 💬, 34 👍) — BYOK mode pins a session to a single model via `COPILOT_MODEL`, and `/model` only lists GitHub-hosted models. Highest-engagement issue in the tracker; the community clearly wants multi-provider sessions.
2. **[#3518 — Unarchive / restore archived project sessions](https://github.com/github/copilot-cli/issues/3518)** (11 👍) — Accidentally archiving an orchestrator session destroys accumulated context with no recovery path. Data-loss-adjacent, hence strong upvotes.
3. **[#2760 — Proper HTTP retry logic for 429 responses](https://github.com/github/copilot-cli/issues/2760)** — Copilot CLI retries aggressively (20+ per minute) without backoff on rate limits. Closed, but the pattern recurs in #3679.
4. **[#3260 — Copy/Paste broken in SSH + tmux sessions on Windows Server 2025](https://github.com/github/copilot-cli/issues/3260)** — Long-standing, platform-specific regression breaking remote workflows; still open since May.
5. **[#1869 — gpt-5-mini not persisted across sessions](https://github.com/github/copilot-cli/issues/1869)** — Model selection reverts to `claude-sonnet-4.6` on restart; a recurring configuration-persistence theme.
6. **[#4275 — ACP: expose `contextTier` as a session config option](https://github.com/github/copilot-cli/issues/4275)** — Interactive CLI lets you change context tier mid-session, but ACP clients can only set it at spawn. ACP parity is becoming a major community concern.
7. **[#5197 — Voice server segfault (signal 11) on WSL2 since 1.0.100](https://github.com/github/copilot-cli/issues/5197)** — `/voice` stuck on "Fetching voice models"; WSL2 users blocked. Regression in recent release.
8. **[#4994 — MCP OAuth page re-opens on every ACP session despite valid token](https://github.com/github/copilot-cli/issues/4994)** — Regression from 1.0.88 → 1.0.89; silent auth resolution should be the expected behavior.
9. **[#3572 — Org-level custom agents invisible without a matching GitHub remote in CWD](https://github.com/github/copilot-cli/issues/3572)** (4 👍) — Enterprise users can't discover shared agents unless they launch from a compatible repo. Significant friction for org-wide agent adoption.
10. **[#4560 — `auto` model always disables reasoning effort and rejects configuration](https://github.com/github/copilot-cli/issues/4560)** — Auto router sends `reasoningEffort: null` and blocks manual config; affects output quality unpredictably.

Honorable mentions: [#2893](https://github.com/github/copilot-cli/issues/2893) (preToolUse hooks silently bypassed under parallelism), [#5269](https://github.com/github/copilot-cli/issues/5269) / [#5268](https://github.com/github/copilot-cli/issues/5268) (new ACP plugin-skills and `/session` failures).

## Key PR Progress
No pull requests were updated in the last 24h. (Total: 0 items.)

## Hot Discussions
No discussion data was provided in the source set; this section is omitted.

## Feature Request Trends
Distilled from recent Issues:

- **Multi-provider / BYOK flexibility** — Allow switching models mid-session across GitHub-hosted, BYOK, and local providers (#3709); per-agent provider selection (#4703); credential commands in `providers.json` (#4936). This is the single strongest direction.
- **ACP parity with interactive CLI** — `contextTier` config (#4275), plugin skills in ACP (#5269), `/session delete/cleanup/prune` over ACP (#5268), `/rename` actually working (#5115). ACP is a fast-growing surface with clear gaps.
- **Session lifecycle management** — Unarchive/restore (#3518), cross-session orchestration (#4569), reliable event delivery (#5100).
- **MCP ecosystem deepening** — MCP server prompts (#505), enterprise allow-list fixes (#4989).
- **Enterprise deployment needs** — System-wide Windows installer (#5129), org-level custom agents visibility (#3572).
- **Agent/plan UX** — Inline annotations on plans (#4563), reliable `task_complete` output in non-interactive mode (#2482).

## Developer Pain Points
Recurring frustrations observed across the tracker:

1. **Rate-limit and network resilience is poor** — No effective backoff on 429s (#2760, #3679), and connection errors on longer prompts (#310). Both self-hosted Azure OpenAI and standard endpoints are affected.
2. **Model selection doesn't persist or behave predictably** — `gpt-5-mini` reverts across sessions (#1869); `auto` strips reasoning effort and can't be configured (#4560); Fusion tier selection was broken in long-context sessions (fixed in v1.0.105-0).
3. **Windows + remote/SSH workflows are unstable** — Copy/paste broken under tmux (#3260), repeated native-runtime crashes unresolved since May (#4026), voice server deadlocks (#4740), and enterprise installer/security friction (#5129).
4. **ACP mode ships with silent failures** — Commands report success but do nothing (~1 ms `end_turn` with no model call) (#5115, #5268); plugin skills missing (#5269). Hard to diagnose and trust.
5. **Voice subsystem regressions** — WSL2 segfaults since 1.0.100 (#5197) and pid-file deadlocks (#4740) make `/voice` unusable in common setups.
6. **Silent security-relevant bypasses** — `preToolUse` hooks bypassed under parallel tool calls (#2893), and enterprise `allowedMcpServers` `serverName` matchers never match (#4989, closed).
7. **Session survivability under long runs** — One 120s host-ack timeout makes a session unusable until resumed (#5100); archived orchestrator sessions are unrecoverable (#3518).

---
*Digest generated for 2026-10-28 from github.com/github/copilot-cli.*

</details>

<details>
<summary><strong>OpenCode</strong> — <a href="https://github.com/anomalyco/opencode">anomalyco/opencode</a></summary>

# OpenCode Community Digest — 2026-10-28

## 1. Today's Highlights

OpenCode shipped **v2.2.0**, introducing experimental **Desktop plugins (GUI)** — an extensible plugin surface for the desktop client. Meanwhile, the issue tracker remains dominated by v2 migration friction — the newly-introduced Desktop/Electron app is drawing a cluster of stability reports (ResizeObserver loops, idle CPU pinning, hotkey conflicts), while TUI/SQLite edge cases (tool pending state, session pinning, pipe truncation) continue to accumulate reproductions.

---

## 2. Releases

### v2.2.0
- **Create, install and share Desktop plugins (experimental)** — a new GUI plugin surface for the desktop app.
  - PRs: [#55246](https://github.com/anomalyco/opencode/pull/55246), [#59469](https://github.com/anomalyco/opencode/pull/59469), [#59489](https://github.com/anomalyco/opencode/pull/59489)
- Docs: [Desktop plugins guide](https://opencode.ai/v2/docs/build/plugins/gui)

This is the headline feature of the release and signals OpenCode's push toward a first-class desktop extensibility model. Expect early-adopter feedback on the plugin registration API (see PR #59764 below, which already extends composer pill behavior).

---

## 3. Hot Issues

1. **[#52894 — Show exact free usage limit reset time](https://github.com/anomalyco/opencode/issues/52894)** *(9 comments, 6 👍)*
   Users hitting the free tier see only "Free limit reached" with no reset timestamp. Highly upvoted because it directly affects decision-making for free-tier users. The 👍:6 count is one of the highest in this batch.

2. **[#52794 — TUI `/sessions` missing pin option on Windows 2.0.21](https://github.com/anomalyco/opencode/issues/52794)** *(8 comments)*
   Docs advertise `session.pin.toggle` (ctrl+f), and `session.json` contains pinned IDs — but the Windows TUI renders no pin UI. Platform inconsistency between documented and actual behavior.

3. **[#52776 — TUI crash: ENOSPC watching `~/.config/opencode`](https://github.com/anomalyco/opencode/issues/52776)** *(7 comments)*
   Hard crash from filesystem watcher exhaustion. Filed as *pending close*, suggesting maintainers consider it environmental, but the volume of comments implies broader hit rate.

4. **[#52796 — Tool stuck pending on SQLite full errors](https://github.com/anomalyco/opencode/issues/52796)** *(7 comments, reproduced)*
   When the DB write fails, the step ends "normally" and the next request ships a `tool_use` without a matching `tool_result` — Anthropic rejects it. A correctness bug with a clean repro; important for anyone running low on disk.

5. **[#52925 — `opencode api get` truncates stdout when piped](https://github.com/anomalyco/opencode/issues/52925)** *(7 comments, reproduced)*
   Breaks the universal `opencode api get ... | jq` pattern on large (~580 KB) responses. High-leverage bug for scripting/automation users.

6. **[#52701 — New skill directories not discovered until restart](https://github.com/anomalyco/opencode/issues/52701)** *(6 comments)*
   Watcher reacts to changes inside existing skills but not the appearance of new skill directories. Directly impacts the skill-authoring loop the v2 docs promote.

7. **[#52706 — Desktop: ResizeObserver loop makes app unresponsive](https://github.com/anomalyco/opencode/issues/52706)** *(5 comments, severity: high)*
   Infinite ResizeObserver loop floods the renderer and freezes the UI. One of several Electron-app stability reports (see also #52927).

8. **[#52743 — Universal intelligent model & compute router (Auto mode)](https://github.com/anomalyco/opencode/issues/52743)** *(5 comments)*
   Proposes a provider-agnostic Auto mode selecting provider/model/reasoning per task. Part of a cluster with #52782 (cost-aware routing), indicating strong demand for first-class routing.

9. **[#52846 — Pending permission requests destroyed on instance disposal](https://github.com/anomalyco/opencode/issues/52846)** *(5 comments)*
   `POST /global/dispose` and config patches kill pending permission prompts without emitting `permission.replied`; dialog becomes unanswerable and replies 404 forever. Serious for long-running desktop sessions.

10. **[#55533 — NumPad End/Home ignored under kitty keyboard protocol](https://github.com/anomalyco/opencode/issues/55533)** *(4 comments, reproduced)*
    Windows Terminal reports `KP_END` (57424) which OpenCode doesn't map. Already fixed in-flight via PRs #57114 and #59770 — a good example of quick community turnaround.

---

## 4. Key PR Progress

1. **[#59773 — fix(stats): ignore requests rejected before routing](https://github.com/anomalyco/opencode/pull/59773)**
   Stops polluting `/data` model dimensions with `model_requested` values from rejected (`attempts = 0`) requests. Data-quality fix for the stats pipeline.

2. **[#59771 — chore(core): remove bundled cohere, vercel, perplexity AI SDK packages](https://github.com/anomalyco/opencode/pull/59771)**
   Drops three provider plugins and their `createProviderPlugin` helper from `packages/core`. Notable consolidation — likely a signal of the new provider architecture direction.

3. **[#59770 — fix(tui): navigate transcript with keypad Home/End](https://github.com/anomalyco/opencode/pull/59770)**
   Closes #55533 (and supersedes #57114). Handles kitty keyboard protocol `KP_END`/`KP_HOME`.

4. **[#59765 — feat(ai): make provider `model()` settings optional, add `Config` type everywhere](https://github.com/anomalyco/opencode/pull/59765)**
   Unifies provider configuration typing (`Config` / `LanguageModelOptions` / `Options` → `Config`) and makes the top-level settings argument optional. Improves provider plugin DX.

5. **[#59763 — chore(deps): bump zod to 4.6.7](https://github.com/anomalyco/opencode/pull/59763)**
   Workspace-level zod bump; nested copies dedupe. Low-risk, high-reach dependency hygiene.

6. **[#59761 — fix(update): only apply minimum versions on stable channels](https://github.com/anomalyco/opencode/pull/59761)**
   Prevents dev/beta builds (whose build numbers reset) from being blocked by `minimum` rows. Important for contributors on the dev update loop.

7. **[#59692 — fix(app): keep Inbox "Working" shelf in stable order](https://github.com/anomalyco/opencode/pull/59692)**
   Sessions were reordering on every streamed message due to `time_updated` bumps. Now pinned to arrival order.

8. **[#59463 — fix(codemode): fail fast on unresolvable awaited promises](https://github.com/anomalyco/opencode/pull/59463)** *(CLOSED)*
   Code Mode no longer hangs when a model writes `await new Promise(r => r)` (which can never settle without timers). Now fails fast instead of hanging until interrupted.

9. **[#59403 — refactor(nix): fetch dependencies from `bun.lock`](https://github.com/anomalyco/opencode/pull/59403)**
   Replaces platform-specific `node_modules` hashes with bun2nix offline mode. Closes #49063.

10. **[#59437 — feat(core): add `/goal` with client-side done check](https://github.com/anomalyco/opencode/pull/59437)**
    Alternative to #58508: implements an idle-hook `/goal` command without a new server event (`session.settled`), computing "done" client-side from already-synced parts. Relevant to the agentic-loop UX.

---

## 5. Hot Discussions

*No Discussion data was provided in the source dataset for this digest. Section omitted.*

---

## 6. Feature Request Trends

Distilled from the Issues above, the dominant feature directions are:

- **Intelligent, cost-aware model routing** — Auto mode (#52743) and free-model/credit optimization (#52782). Strong signal that users want OpenCode to abstract provider/model/reasoning selection.
- **Quota & usage transparency** — exact reset timestamps (#52894), and a general theme of surfacing quota state earlier.
- **Extensibility surface expansion** — Desktop GUI plugins (v2.2.0), remote agents via HTTP catalog (#52738), and read-only historical changesets for V2 plugins (#52870).
- **Session/tab UX parity across clients** — pinning on Windows TUI (#52794), desktop tab semantics (`Ctrl+W`, #52683), read-only session lists for migrated v1 sessions (#52924).
- **Process control & ergonomics for `opencode mini`** — align exit/suspend with main TUI (#52695). A small but persistent niche request.

---

## 7. Developer Pain Points

Recurring frustrations visible in this batch:

1. **Desktop/Electron stability regression.** Three correlated reports — ResizeObserver loop (#52706, severity: high), idle CPU pinning on Intel macOS with software rendering (#52927), and the 800px min-width resizer bug (#52772). Together they suggest the 2.0.x desktop client needs a dedicated perf pass.

2. **v1 → v2 migration rough edges.** Migrated sessions appear in lists but don't open (#52924); the docs' `session.pin.toggle` isn't surfaced on Windows (#52794). Migration is functionally done but usability gaps remain.

3. **SQLite / disk-full handling.** Tool calls get stuck in pending (#52796) and the FSWatcher crashes on ENOSPC (#52776). Weak failure-mode handling around storage exhaustion.

4. **Scripting/automation regressions.** `api get` truncating to pipes (#52925) breaks the standard `| jq` idiom — a high-leverage bug for CI and tooling users.

5. **Permission system edge cases.** "Always allow" patterns fail to match commands with leading env-var assignments (#52720); pending permission prompts silently destroyed on disposal (#52846). Both erode trust in the permission layer for long-running sessions.

6. **Config-file silent drops.** `compatibility.supportsStore` is silently ignored while a sibling key is honored (#52617) — a "silent failure" class of bug that's especially costly for users behind strict gateways.

---

*Digest compiled from github.com/anomalyco/opencode data for 2026-10-28. Issue/PR counts: 50 issues and 50 PRs updated in the last 24h; top 30 issues and top 20 PRs reviewed above.*

</details>

<details>
<summary><strong>Pi</strong> — <a href="https://github.com/earendil-works/pi">earendil-works/pi</a></summary>

# Pi Community Digest — 2026-10-28

## 1. Today's Highlights

A burst of P0 fixes landed today across providers: OpenAI Responses namespace handling, Bedrock tool schema limits, and orphaned session branches after ENOSPC were all addressed or closed. Provider-protocol correctness remains the dominant theme, with Anthropic tool-removal, OpenCode endpoints, and LiteLLM context-overflow detection all getting patches. Meanwhile, compaction efficiency is emerging as a fresh concern — two issues and a PR all target redundant prefill costs during summarization.

## 2. Releases

No new releases in the last 24 hours.

## 3. Hot Issues

1. **#10953** [CLOSED] OpenAI login fails with ChatGPT Business, legacy Codex works — [link](https://github.com/earendil-works/pi/issues/10953)
   11 comments, 3 👍. A `3p_delegated_access_policy_denied` error blocks Business workspace users from the standard OpenAI login path while the legacy Codex flow works. High community engagement because it affects an entire account tier.

2. **#9409** [OPEN] Sessions wedge permanently at the context ceiling on reasoning models — [link](https://github.com/earendil-works/pi/issues/9409)
   Sessions become unrecoverable (`stopReason: "length"`, `usage.output: 16`) and auto-compaction fails. Long-running and still open after six weeks — a serious reliability gap for reasoning-model workflows.

3. **#10390** [OPEN] [bug] Anthropic SSE parser mishandles CRLF split across chunks — [link](https://github.com/earendil-works/pi/issues/10390)
   A subtle streaming bug: `\r` and `\n` arriving in separate chunks causes empty `data:` payloads and aborted turns. Classic low-level parsing edge case that only bites in production network conditions.

4. **#11460** [CLOSED] [p0, fix-available] Resume drops all built-in tools when session branch is truncated — [link](https://github.com/earendil-works/pi/issues/11460)
   Orphaned `parentId` after ENOSPC silently strips the toolset on resume. P0 with a fix already available — fast turnaround on a nasty data-integrity failure.

5. **#11376** [OPEN] [p0, inprogress] Anthropic: removing an initial tool mid-session breaks every later request — [link](https://github.com/earendil-works/pi/issues/11376)
   Extension reloads that deregister tools produce `tool_reference_unresolved` 400s for the rest of the session. Directly impacts the extension ecosystem's hot-reload story.

6. **#11472** [CLOSED] rpc mode: "turn_end could not resolve persisted assistant entry ID" aborts runs — [link](https://github.com/earendil-works/pi/issues/11472)
   Reproduced across 1.1.0–1.4.0 with local `openai-completions` providers. Breaks headless/RPC integration entirely for llama.cpp users.

7. **#11415** [CLOSED] [p0] OpenAI Responses `function_call` items replayed without namespace — [link](https://github.com/earendil-works/pi/issues/11415)
   Tools declared via `additional_tools` get namespaced, but replay omits the namespace, yielding 400s. Reproduced live against `api.openai.com` — provider-format fidelity matters here.

8. **#11416** [CLOSED] [p0] Bedrock fails when tools exceed 16 optional parameters — [link](https://github.com/earendil-works/pi/issues/11416)
   Bedrock's `anyOf`/union-type cap trips real-world tool schemas. Important for enterprise users on AWS.

9. **#11500** [CLOSED] Compaction requests share no prefix with live turns — full prefill every time — [link](https://github.com/earendil-works/pi/issues/11500)
   Compaction always pays full prefill cost because it omits system prompt and tool declarations. A cost-efficiency issue with a companion PR (#11499) already filed.

10. **#11493** [CLOSED] Codex: full cache miss after idle despite persistent-cache guarantee — [link](https://github.com/earendil-works/pi/issues/11493)
    Contradicts OpenAI's stated guarantee ("cache forever"). Users notice when billing doesn't match marketing.

## 4. Key PR Progress

1. **#11499** [CLOSED] feat(compaction): prefix-preserving summarization calls — [link](https://github.com/earendil-works/pi/pull/11499)
   Makes compaction reuse the live conversation's token prefix, avoiding full prefill on every summarization. Highest-leverage cost optimization this week.

2. **#11491** [CLOSED] fix(coding-agent): detect vite+ global installs and self-update — [link](https://github.com/earendil-works/pi/pull/11491)
   Fixes `pi update` misclassifying vite+ installs as npm, which was creating divergent duplicate installations.

3. **#11496** [CLOSED] fix(ai): cap OpenRouter reasoning tokens — [link](https://github.com/earendil-works/pi/pull/11496)
   Sends nested `reasoning.max_tokens`, omits conflicting `reasoning.effort`, and clamps to preserve ≥1,024 answer tokens.

4. **#11494** [CLOSED] fix(ai): detect LiteLLM ContextWindowExceededError as context overflow — [link](https://github.com/earendil-works/pi/pull/11494)
   Adds recognition of LiteLLM's HTTP 400 pre-call check so compaction can trigger instead of hard-failing.

5. **#11471** [CLOSED] feat(coding-agent): inline `ctx.ui.custom()` blocked program status — [link](https://github.com/earendil-works/pi/pull/11471)
   Opt-in OSC 7501 reporting for custom dialogs, so terminals know when approval prompts are waiting on the user.

6. **#11486** [CLOSED] fix(coding-agent): keep session memory in line with the file on write failure — [link](https://github.com/earendil-works/pi/pull/11486)
   Prevents in-memory leaf entries from diverging from disk on ENOSPC/EBUSY — directly complements issue #11460's root cause.

7. **#11482** [CLOSED] fix(coding-agent): pass thinking level to branch summarization — [link](https://github.com/earendil-works/pi/pull/11482)
   `/tree` summarize was silently dropping `reasoning`; fixes quality on reasoning models.

8. **#11434** [CLOSED] fix(ai): use OpenCode protocol-specific endpoints — [link](https://github.com/earendil-works/pi/pull/11434)
   Routes opencode/opencode-go to `/inference/<protocol>` instead of the shared base, matching models.dev listings.

9. **#11477** [CLOSED] perf(tui): skip grapheme segmentation when painting the scrollbar — [link](https://github.com/earendil-works/pi/pull/11477)
   Replaces per-row, per-frame `Intl.Segmenter` calls with direct cell writes. Measurable render-loop savings.

10. **#11422** [CLOSED] fix(tui): correct Kitty function key decoding — [link](https://github.com/earendil-works/pi/pull/11422)
    Fixes F1–F12 decoding including modifiers, repeat/release events, and stops private-use codepoints from being typed as text.

## 5. Hot Discussions

**Show and tell**

- **#11488** AY-PI — per-prompt tier routing and tool scoping (virtual model + Jev classifier) — [link](https://github.com/earendil-works/pi/discussions/11488)
  Routes each prompt to a behavior (CHAT/SUGGEST/REVIEW/PLAN/CODE) and tier, scoping edit/write/bash to CODE only. Demonstrates the virtual-model and classifier APIs in a production-style extension.

- **#11476** A Cairn-style shared board for coding agents — [link](https://github.com/earendil-works/pi/discussions/11476)
  Frames hard problems as state-space search with a shared board for agent coordination; reports a hackathon placement. Notable demonstration of the durable/task primitives.

## 6. Feature Request Trends

- **Cost-efficient context management** — Prefix-preserving compaction (#11500/#11499), smarter context-window variant discovery (#10893), and cache-persistence guarantees (#11493) all point to token economics as a top concern.
- **Durable / long-running task ergonomics** — Multiple `pi-durable` requests: resumable `watchEvents` (#11327), per-turn tasks without tool calls (#11141), and tasks that keep the conversation busy (#11332).
- **Extension lifecycle robustness** — Mid-session reloads that deregister tools (#11376), tool reordering producing spurious system-prompt updates (#11495), and install-detection issues (#11489) show extensions are now first-class and hitting edge cases.
- **TUI selection & input fidelity** — Soft-wrap-aware copy (#8019), page-key navigation in all lists (#11348), and Kitty key decoding (#11422).

## 7. Developer Pain Points

- **Streaming and parsing fragility.** Split CRLF across chunks (#10390) and mid-session tool removal (#11376) both produce opaque 400s or aborted turns — network and lifecycle edge cases have outsized blast radius.
- **Provider-specific quirks leak into user experience.** Bedrock's union-type cap (#11416), OpenAI's namespace replay (#11415), LiteLLM's context errors (#11494), and OpenCode's endpoint routing (#11434) each require per-provider patches.
- **Session durability under storage failure.** ENOSPC causing orphaned `parentId` (#11460), ID collisions between concurrent SqliteStorage openers (#11497), and in-memory/disk divergence (#11486) form a coherent cluster around write-path integrity.
- **Cost surprise and cache behavior.** Users repeatedly flag unexpected prefill costs (#11500) and cache misses that contradict provider guarantees (#11493) — billing transparency is a recurring friction point.
- **Terminal/interaction polish.** Kitty keys (#11422), scrollbar rendering (#11477), hidden-thinking blank rows (#11470), and LaTeX overflow (#11487) show sustained demand for TUI rendering correctness.

</details>

<details>
<summary><strong>Qwen Code</strong> — <a href="https://github.com/QwenLM/qwen-code">QwenLM/qwen-code</a></summary>

# Qwen Code Community Digest — 2026-10-28

## 1. Today's Highlights

The project shipped three releases in the last 24 hours — `v0.26.2` stable, `v0.26.3-preview.0`, and TypeScript SDK `v0.1.24` — headlined by a **breaking change** in Managed Agent Web Shell controls (#15616). Meanwhile, the Managed Agent dual-path architecture proposal (#12380) continues to dominate discussion with 72 comments, and release infrastructure instability (failed publish jobs, CI gaps, Homebrew packaging errors) has emerged as a recurring theme across issues and PRs.

---

## 2. Releases

**`v0.26.3-preview.0`** — [Release](https://github.com/QwenLM/qwen-code/releases)
- `feat(memory)`: opt-in extraction cadence after a no-op run ([#13571](https://github.com/QwenLM/qwen-code/pull/13571))
- `fix(core)`: recovery of outer XML calls with quoted content

**`v0.26.2`** — [Release](https://github.com/QwenLM/qwen-code/releases)
- ⚠️ **Breaking:** `fix(managed-agent)!` — simplified Web Shell controls, retired `cwd` submissions ([#15616](https://github.com/QwenLM/qwen-code/pull/15616)) by @doudouOUC

**`v0.26.2-preview.1`**
- `feat(managed)`: session permission rules and Auto approval ([#15448](https://github.com/QwenLM/qwen-code/pull/15448))
- `fix(cli)`: hardened serve token resolution

**`sdk-typescript-v0.1.24`** — bundles CLI `0.26.2` (built from the same branch/ref).

---

## 3. Hot Issues

1. **#12380 — Managed Agent dual-path architecture proposal** ([link](https://github.com/QwenLM/qwen-code/issues/12380)) — 72 comments. The project's central architectural thread: defines the staged delivery plan for Managed Agent and reports verified Stage F status. Any contributor touching Managed Agent should read this first.

2. **#14724 — Main CI failed: Managed Agent gate reports "no test identified"** ([link](https://github.com/QwenLM/qwen-code/issues/14724)) — 68 comments. A persistently failing gate on `main`, repeatedly bumped by the dev bot. Signals that Managed Agent test selection logic remains fragile.

3. **#13078 — Daily dependency CVE audit failed** ([link](https://github.com/QwenLM/qwen-code/issues/13078)) — 33 comments. Scheduled audit has been red since late September; likely a combination of new advisories and npm audit endpoint unavailability. Supply-chain hygiene concern.

4. **#13787 — XML recovery repeats prefix scans on large multi-call responses** ([link](https://github.com/QwenLM/qwen-code/issues/13787)) — 11 comments. Performance regression with reproducible benchmarks on current `main`. Matters for users with large tool-call payloads.

5. **#15052 — CI: preserve independent main E2E validation when pending runs are replaced** ([link](https://github.com/QwenLM/qwen-code/issues/15052)) — 10 comments. Concurrency config can silently drop per-SHA validation — a correctness gap in the release safety net.

6. **#15499 — Managed runtime v0.26.1 stops at immutable-publication preflight** ([link](https://github.com/QwenLM/qwen-code/issues/15499)) — 9 comments. Release pipeline failure tied to the managed runtime; part of the broader release-infra cluster.

7. **#15686 — Active Goal holds ordinary user input until Goal leaves active state** ([link](https://github.com/QwenLM/qwen-code/issues/15686)) — 6 comments. Interactive UX bug: Enter-steered messages and pastes queue instead of steering the running turn, contradicting documented shortcuts.

8. **#15675 — `sed` edit simulation: `.` doesn't match `\r` or whole emoji** ([link](https://github.com/QwenLM/qwen-code/issues/15675)) — P1, 5 comments. The in-process `sed` simulator diverges from real `sed` because it omits the `s`/`u` flags — silent behavioral mismatch for file edits.

9. **#15690 — Homebrew install of 0.26.1 can't rewrite `libopentui.dylib` install name** ([link](https://github.com/QwenLM/qwen-code/issues/15690)) — macOS arm64 installs emit a linkage error because `@opentui/core-darwin-arm64` lacks `-headerpad_max_install_names`. Packaging blocker for Apple Silicon users.

10. **#13024 — Provider preset for IO Intelligence (io.net)** ([link](https://github.com/QwenLM/qwen-code/issues/13024)) — 10 👍, the most-upvoted open issue in this window. Community wants a first-class OpenAI-compatible provider preset so it appears in `/auth` and setup UI.

---

## 4. Key PR Progress

1. **[#15718](https://github.com/QwenLM/qwen-code/pull/15718)** — `feat(managed-agent)`: opt-in same-context Java embedding. Lets Java/Spring hosts embed Managed Agent in an existing JVM with native journal callbacks. Major enterprise integration step.

2. **[#14621](https://github.com/QwenLM/qwen-code/pull/14621)** — `fix(web-shell)`: single scroll region for the floating approval card. Fixes stacked scroll containers in the tool-approval bottom sheet.

3. **[#15466](https://github.com/QwenLM/qwen-code/pull/15466)** — `feat(serve)`: user-scope Skill activation routes (`PUT /skills/:name/activation`, batch up to 100). Adds parity with extension activation.

4. **[#14335](https://github.com/QwenLM/qwen-code/pull/14335)** — `feat(serve)`: TTL-based auto-removal of completed sub-sessions (`serve.subSessionCompletionTtlHours`, default `0` = keep forever).

5. **[#14230](https://github.com/QwenLM/qwen-code/pull/14230)** — `feat(web-shell)`: browse managed auto-memory in `/memory` with listing, read, and toggles, scoped by project/workspace.

6. **[#14179](https://github.com/QwenLM/qwen-code/pull/14179)** — `feat(web-shell)`: global keyboard shortcuts for Session Overview (`Cmd/Ctrl+Shift+O`) and Split View.

7. **[#15681](https://github.com/QwenLM/qwen-code/pull/15681)** — `fix(core)`: stop treating fd duplication (`2>&1`, `>&2`, `2>&-`) as file writes in shell permission checks. Security-relevant precision fix.

8. **[#15743](https://github.com/QwenLM/qwen-code/pull/15743)** — `fix(cli)`: forward workflow enable/disable switches into the whole-CLI sandbox so exported workflow policy is honored.

9. **[#15286](https://github.com/QwenLM/qwen-code/pull/15286)** (and siblings #15275, #15284) — `fix(ci)`: scope the self-hosted `sdk-java` Maven host lock to the cache write-back only, unblocking pool-wide contention.

10. **[#15557](https://github.com/QwenLM/qwen-code/pull/15557)** — `feat(web-shell)`: move archived conversations into **Settings → Archived conversations** (implements option 3 from #15549).

---

## 5. Hot Discussions

No Discussions data was provided in this dataset — section omitted.

---

## 6. Feature Request Trends

- **Provider & model-switching integrations** — IO Intelligence preset (#13024) and fixing OpenRouter attribution headers (#12072) show demand for broader first-class provider coverage and correctness of built-in presets.
- **Memory & context management** — managed auto-memory browsing (#14230), opt-in extraction cadence (#13571), and dynamic tool-output truncation under context pressure (#2566) all point to a maturing memory subsystem users want more control over.
- **Web Shell / desktop UX polish** — simple input mode (#15647/#15691), keyboard shortcuts (#14179), archive relocation out of the sidebar (#15549), and scroll-region fixes (#14621) indicate heavy investment in the Web Shell as a first-class client.
- **Managed Agent extensibility** — session permission rules, Auto approval (#15448), Java embedding (#15718), and SDK routes (#15466) dominate the roadmap-scale requests.
- **Session management controls** — TTL cleanup for sub-sessions (#14335) and rewind identity propagation (#15674) reflect growing multi-session/multi-agent workflows.

## 7. Developer Pain Points

- **Release & CI infrastructure fragility** — a cluster of failures: managed runtime v0.26.1 publish preflight (#15499), release workflow failure (#15672), Managed Agent gate "no test identified" (#14724), flaky web-shell smoke budgets (#15697), TUI-parity failures on GitHub-hosted Intel macOS (#15677), and CI runs failing with no test results (#14796). Multiple PRs (#15275/#15284/#15286) exist purely to arbitrate shared Maven host locks.
- **Packaging/linkage regressions** — the Homebrew/`libopentui.dylib` install-name issue (#15690) breaks `brew upgrade` on Apple Silicon despite `qwen --version` working.
- **Simulation divergence from real tools** — the `sed` simulator (#15675) and XML tool-call recovery performance (#13787) highlight risk where in-process shortcuts drift from native behavior.
- **Silent correctness bugs in permissions/security** — fd-duplication false positives (#15681), stale config skills catalog after on-disk skill creation (#15645), and native Anthropic 400s from missing `thoughtSignature` (#15742) cause hard-to-debug failures.
- **MCP robustness** — duplicate MCP tool names discarding an entire server with a misleading "no tools" error (#15741) is a sharp edge for anyone integrating third-party MCP servers.
- **Interactive input handling** — Active Goal queueing ordinary input (#15686) and team-mode message loss in ACP mode (#15738) frustrate users of the newer interactive/agent-team features.

---
*Generated from GitHub activity on [QwenLM/qwen-code](https://github.com/QwenLM/qwen-code) for 2026-10-28.*

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*