# AI CLI Tools Community Digest 2026-11-27

> Generated: 2026-11-27 03:35 UTC | Tools covered: 7

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
**Data window: 2026-11-27 | Sources: Claude Code, OpenAI Codex, Gemini CLI, GitHub Copilot CLI, OpenCode, Pi, Qwen Code**

---

## 1. Ecosystem Overview

The AI CLI landscape is in a **stabilization-and-hardening phase** rather than a feature-expansion one. Across all seven tools, no major new capabilities shipped today; instead, engineering effort concentrated on reliability debt — sandbox networking, permission-model edge cases, subagent correctness, and cost/quota transparency. A notable split is emerging between **vendor-first-party tools** (Claude Code, Codex, Gemini CLI, Copilot CLI) that are fighting platform regressions and enterprise integration friction, and **independent/community-driven tools** (OpenCode, Pi) that are pushing provider breadth, embedding/SDK use cases, and monetization experiments. The loudest cross-cutting signal is **trust**: users are increasingly unwilling to delegate to agents that hang, silently fail, or misreport success.

---

## 2. Activity Comparison

| Tool | Issues (updated) | PRs (updated) | Discussions | Release Status |
|---|---|---|---|---|
| **Claude Code** | 50 | 4 | N/A (not provided) | No release in 24h |
| **OpenAI Codex** | 10 highlighted (active tracker) | 10+ (bot-authored cleanup) | 6 active threads | 2 alpha builds (`0.174.0-alpha.7/.8`) |
| **Gemini CLI** | 10 highlighted (intense activity) | 10+ | N/A (not provided) | No release in 24h |
| **GitHub Copilot CLI** | 10 highlighted (fresh `triage` batch) | 0 | N/A (not provided) | 3 pre-releases (`v1.0.117-3/-4/-5`) |
| **OpenCode** | 10 highlighted (megathread: 412 comments) | 10+ | N/A (not provided) | No release in 24h |
| **Pi** | 30+ | 18 | N/A (not provided) | No release in 24h |
| **Qwen Code** | 10 highlighted (CI-heavy) | 10+ | N/A (not provided) | `v0.28.7`, `v0.28.6-nightly`, `sdk-typescript-v0.1.36` |

**Reading the table:** Issue counts reflect items *updated* in the window, not total open issues — they are a proxy for churn, not backlog size. Claude Code (50) and Pi (30+) show the highest raw activity; Copilot CLI shows zero PRs but steady maintainer-driven releases. Where Discussions were not captured in the source digest, they are marked **N/A** rather than "inactive" — Codex is the only tool with confirmed active Discussion threads (Ideas, Q&A, Show-and-tell).

---

## 3. Shared Feature Directions

The following requirements recur across multiple communities — these are the strongest signals for roadmap planning:

| Direction | Tools | Specific Needs |
|---|---|---|
| **Subagent correctness & observability** | Gemini CLI, OpenCode, Claude Code | False-success reporting on turn exhaustion (#22323), hangs (#21409), foreground-execution regression (#64073), compaction failures (#56862). Demand for trajectory visibility and `Ctrl+B` backgrounding. |
| **Cost/quota transparency & controls** | Claude Code, OpenCode, Codex | 5-hour limits depleting abnormally (#112473 cluster), free-tier false positives (#59387), silent 429 back-offs (#58883), per-model cost breakdowns (#110655). |
| **Sandbox/network configurability** | Copilot CLI, Claude Code, Gemini CLI | Custom CA certs (`extraCaCertificates`), Windows TCP allowlists (#5580), `git submodule` support (#5593), OS-level sandboxing for native bash (#19873). |
| **Cross-device/session sync & persistence** | Claude Code, Codex, OpenCode | Account-level settings sync (#22648, 54 👍), VS Code history pagination (#44419), Desktop/TUI session-pinning parity (#55764). |
| **Permission predictability** | Copilot CLI, Claude Code | Parallel-session races (#3563), hard-coded filename blocklists (#44657), MCP tool cross-approval scoping, "I told you not to do that" memory (#5589). |
| **History/context management** | Codex, Gemini CLI, Claude Code, Qwen Code | Pagination beyond 50 sessions, quadratic transcript growth on `/compact` (#92089), context inflation burying instructions (#16259), AST-aware retrieval (#22745). |
| **Terminal/TUI robustness** | Pi, Codex, Copilot CLI | Kitty graphics image loss (#12548), Wayland PRIMARY support (#64192), Page Down in 10-row terminals (#1.0.117-4), prompt-cache invalidation from tool reordering (#12547). |
| **Provider/model extensibility** | Pi, OpenCode, Copilot CLI, Qwen Code | ModelScope provider (#8393), local vLLM routing (#5581), BYOK regressions (#5583), model discovery for custom endpoints (#17446). |
| **Observability & silent-failure elimination** | OpenCode, Gemini CLI, Pi | Stalled streams with no logging (#62319), empty stderr on exit 1 (#66699), dangling symlinks skipped silently (#12599), no default bash timeout (#12561). |

---

## 4. Differentiation Analysis

**Claude Code** — *Enterprise-grade, macOS-power-user oriented.* Emphasis on MCP integrations (including an official GMail MCP with a privacy regression), Remote Control workflows, and desktop-companion features. Its pain points are those of scale: quota anomalies, daemon process leaks, and safeguard false positives. The community is opinionated and vocal (high 👍 on privacy and sync requests).

**OpenAI Codex** — *Windows-first desktop product with an alpha Rust CLI.* The Nov 21 Windows regression cluster (permission selectors, disabled Send) dominates. The long-awaited Linux desktop request (#11023, 953 👍) just closed — a signal of platform-parity pressure. TUI stabilization is bot-driven; the community is split between IDE (VS Code) and desktop users.

**Gemini CLI** — *Agentic-workflow focused, with the most explicit "subagent as a product" bet.* The false-success and hanging-agent bugs are existential for automation use cases. Design-level discussions (AST-aware tooling, zero-dependency sandboxing) show the team thinking about **structure-level** rather than text-level tooling. Strongest emphasis on skills/subagent auto-invocation.

**GitHub Copilot CLI** — *Sandbox-first, enterprise-proxy-aware.* The `extraCaCertificates` release is a direct answer to MITM-proxy enterprises (Zscaler, etc.). The community is small but technically sharp; the dominant concerns are credential-store bloat (#5591) and permission-state races. Remote/multi-session ergonomics are clearly second-class.

**OpenCode** — *Community-driven, monetization-experimenting.* The 412-comment free-tier megathread is the single largest community thread in this dataset. Crypto-payment support (74 👍) and region-blocked billing (#52958) show a global, price-sensitive user base. Engineering is provider-layer-heavy (ChatGPT multi-account, request compression, retry backoff).

**Pi** — *Embedding/SDK-oriented, terminal-correctness obsessed.* The only tool with a substantial **SDK-host lifecycle** concern (GC leaks in `AgentSession.dispose()`, #12546). Its community is small but deeply technical — issues about Kitty graphics protocol, signed 32-bit image IDs, and prompt-cache economics. Telemetry/privacy is an active debate (the `DO_NOT_TRACK` saga).

**Qwen Code** — *CI-discipline and managed-agent hosting.* The most distinctive trait is the **volume of automated CI-failure issues** dominating the tracker — a maintenance-culture signal. It is the only tool shipping a **Harness kernel** rollout with privacy-first defaults and managed-session suspend/resume. Managed Agent hosting reliability is its primary open risk.

---

## 5. Community Momentum & Maturity

**Highest raw activity:** Claude Code (50 issues updated) and Pi (30+ issues, 18 PRs) — but for different reasons. Claude Code's volume reflects a large, mature user base surfacing scale problems; Pi's reflects a fast-moving, small-team codebase with many concurrent PRs.

**Fastest iteration:** **Copilot CLI** shipped three pre-releases in 24h (maintainer-driven, zero community PRs), and **Qwen Code** shipped a stable, a nightly, and an SDK release. **Codex** is on a steady alpha train (`0.174.0-alpha.7/.8`). These four are iterating on release cadence; Claude Code, Gemini CLI, OpenCode, and Pi shipped nothing in the window — which for the latter two suggests PR-review-bound velocity rather than stalled development.

**Most mature community discourse:** **OpenCode** (412-comment megathread, 74-👍 crypto-payment request) and **Codex** (structured Ideas/Q&A/Show-and-tell Discussions). These show the healthiest *community infrastructure* — users self-organize into canonical threads and feature proposals.

**Maturity risks:** **Qwen Code**'s tracker is dominated by CI-failure noise (several "provisional" self-dismissing issues), which makes real reliability signals (#17851, chronically red) hard to isolate. **Pi** has a contribution-friction problem — auto-closed PRs behind an approval gate (#12521) are stranding tested fixes. **Copilot CLI** has no community PR pipeline at all, concentrating all velocity in maintainers.

---

## 6. Trend Signals

**1. "Trustworthy autonomy" is the new battleground.** The loudest cross-tool theme is not capability but *reliability of delegation* — agents that hang, lie about success, or silently drop errors. Gemini CLI's false-`GOAL` bug and OpenCode's silent retries are the same failure mode: users cannot distinguish "done" from "stuck." **Recommendation:** invest in explicit termination-reason reporting and structured failure telemetry before adding more agent capabilities.

**2. Cost economics are becoming a product feature.** Quota anomalies (Claude Code), free-tier friction (OpenCode), and silent 429s (Codex) all point to users treating **cost predictability** as a first-class requirement. Per-model breakdowns and quota transparency are table stakes by 2027.

**3. Sandbox networking is the enterprise adoption gate.** Copilot CLI's `extraCaCertificates` and the Windows/Linux sandbox failures across tools show that TLS-intercepting proxies and submodule workflows are where enterprise pilots die. A coherent "how to make X work through the sandbox" story is a competitive differentiator.

**4. Terminal correctness is under-invested.** Pi's Kitty/Wayland bugs and Copilot CLI's single-terminal-size TUI testing suggest terminal rendering is tested at one happy path. For tools that live in the terminal, this is a recurring tax on power users.

**5. Prompt-cache economics are invisible until broken.** Pi's `/reload` tool-reordering cache miss (#12547) and 56k-token amplification on local backends (#12593) reveal that **non-deterministic prompt construction silently destroys cost efficiency**. Deterministic prompt assembly is an emerging engineering discipline.

**6. Provider breadth is fragmenting.** ModelScope, local vLLM, BYOK, multi-account ChatGPT, and Copilot model rejection all indicate the "one provider" assumption is dead. Adapters need defensive testing against per-provider streaming quirks (Kimi tool-call splitting, Copilot model rejection).

**7. Contribution pipelines are a maturity bottleneck.** Pi's auto-closed PRs and Qwen Code's CI-noise dominance both show that **triage and review infrastructure** — not raw engineering — is the constraint on community velocity. Tools that make it easy to contribute tested fixes will out-iterate those that don't.

---

*Prepared for technical decision-makers. Issue/PR counts are window-relative churn proxies; reaction counts reflect state at digest generation. N/A marks unavailable data, not inactivity.*

---

## Per-Tool Reports

<details>
<summary><strong>Claude Code</strong> — <a href="https://github.com/anthropics/claude-code">anthropics/claude-code</a></summary>

## Claude Code Skills Highlights

> Source: [anthropics/skills](https://github.com/anthropics/skills)

# Claude Code Skills — Community Highlights Report
*Data source: github.com/anthropics/skills | Snapshot: 2026-11-27*

---

## 1. Top Skills Ranking (by community attention)

| # | Skill / PR | Functionality | Discussion Highlights | Status |
|---|---|---|---|---|
| 1 | [PR #1742 — mcp-builder fix](https://github.com/anthropics/skills/pull/1742) | Fixes `mcp>=2.0.0` breaking change: `streamablehttp_client` → `streamable_http_client`, plus custom header config via `create_mcp_http_client`. | High-traffic because it unblocks the MCP builder skill against the new SDK; ties to issue #1668. | OPEN |
| 2 | [PR #1298 — skill-creator eval isolation](https://github.com/anthropics/skills/pull/1298) | Isolates trigger evals per worker, fixes Windows `select()` on subprocess pipes, and prevents unrelated tools from aborting scans. | Directly addresses false-negative trigger rates reported in #1352/#556. | OPEN |
| 3 | [PR #1245 — notion-spec-to-implementation + quantitative-resume-auditor](https://github.com/anthropics/skills/pull/1245) | Converts product/tech specs into Notion implementation tasks; audits resumes quantitatively. | Dual-skill PR, broad enterprise appeal; long-running review since June. | OPEN |
| 4 | [PR #1980 — webapp-testing shell injection fix](https://github.com/anthropics/skills/pull/1980) | Removes `shell=True` from `with_server.py` to close a CWE-78 command-injection vector. | Security-hardening of an already-popular testing skill. | OPEN |
| 5 | [PR #1792 — docx LibreOffice timeout handling](https://github.com/anthropics/skills/pull/1792) | Reports `soffice` timeouts as errors and verifies revision marks are actually removed before claiming success. | Reliability fix for the widely used docx accept-changes workflow. | OPEN |
| 6 | [PR #1771 — proofcore-contract-auditor](https://github.com/anthropics/skills/pull/1771) | Static analysis of Solidity/Rust contracts with Merkle-proof anchoring on TON blockchain. | Novel Web3 vertical; notable for cryptographic audit trail design. | OPEN |
| 7 | [PR #1703 — md2video-audio](https://github.com/anthropics/skills/pull/1703) | Markdown → Marp slides → MP4 with human-like TTS voiceover, zero-cost pipeline. | Popular "content generation" direction; bridges docs and media. | OPEN |
| 8 | [PR #525 — pyxel retro game dev](https://github.com/anthropics/skills/pull/525) | Guides creation, headless input-driven runs, and frame inspection for Pyxel Python games. | Long-lived PR (since March) with steady updates; niche but dedicated. | OPEN |

---

## 2. Community Demand Trends (from Issues)

- **Trust & namespace safety** — [Issue #492](https://github.com/anthropics/skills/issues/492) (46 comments, top issue): community skills shipping under the `anthropic/` namespace enable impersonation and permission escalation. Demand for **signed/verified skill provenance**.
- **Org-wide skill distribution** — [Issue #228](https://github.com/anthropics/skills/issues/228): users want a shared skill library / direct share link instead of manual `.skill` uploads via Slack.
- **Evaluation reliability** — [Issue #556](https://github.com/anthropics/skills/issues/556) and [#1352](https://github.com/anthropics/skills/issues/1352): `run_eval.py` reports 0% trigger rates; parallel workers cross-match UUIDs. Demand for **trustworthy skill-trigger benchmarks**.
- **Context budget discipline** — [Issue #1487](https://github.com/anthropics/skills/issues/1487): `claude-api` eagerly injects ~156k tokens in one call. Demand for **lazy/streamed skill loading**.
- **Quality-gate workflows** — [Issue #1385](https://github.com/anthropics/skills/issues/1385): pre-task calibration → adversarial review → delivery verification. Demand for **multi-stage reasoning pipelines**.
- **Skill authoring ergonomics** — [Issue #202](https://github.com/anthropics/skills/issues/202) and [#2064](https://github.com/anthropics/skills/issues/2064): descriptions must say *when* to use a skill, not just *what* it does. Demand for **trigger-oriented SKILL.md conventions**.
- **Account/workspace portability** — [Issue #1143](https://github.com/anthropics/skills/issues/1143) (👍 20): email change support to prevent workspace data loss.

**Emerging Skill directions:** governance/safety patterns for agents ([#412](https://github.com/anthropics/skills/issues/412)), symbolic compact-memory notation ([#1329](https://github.com/anthropics/skills/issues/1329)), and Web3/smart-contract auditing.

---

## 3. High-Potential Pending Skills (likely to land soon)

| PR | Skill | Why it's likely |
|---|---|---|
| [#1681](https://github.com/anthropics/skills/pull/1681) | skill-creator direct-execution fix | Updated as recently as 2026-11-19; unblocks standalone `package_skill.py` usage. |
| [#1997](https://github.com/anthropics/skills/pull/1997) | YAML frontmatter scalar parsing | Fixes metadata drift between `SKILL.md` and eval commands — small, well-scoped. |
| [#1977](https://github.com/anthropics/skills/pull/1977) | algorithmic-art `wrapAround()` | One-line modulo fix closing #1897; low-risk merge. |
| [#1976](https://github.com/anthropics/skills/pull/1976) | element_discovery textarea/select | Corrects tag reporting; closes #1891. |
| [#1975](https://github.com/anthropics/skills/pull/1975) | pptx `--cols` validation | Early argparse rejection; closes #1809. |
| [#1950](https://github.com/anthropics/skills/pull/1950) | claude-api pause_turn guidance | Aligns docs with Python SDK 1.1.0 auto-resumption; doc-only. |
| [#2019](https://github.com/anthropics/skills/pull/2019) | xlsx external-link detection | Fixes false negatives from worksheet-scoped names; closes #2013. |
| [#2108](https://github.com/anthropics/skills/pull/2108) | README snapshot clarification | Documents sync relationship for `~/.claude/skills/synced/`. |

---

## 4. Skills Ecosystem Insight

**The community's most concentrated demand is reliability and trust in skill infrastructure — not new skill categories — with the loudest signals targeting broken trigger evaluation, namespace impersonation, and context-budget blowouts, while the PR queue is dominated by small correctness and security fixes to existing document, testing, and skill-creator tooling.**

---

# Claude Code Community Digest — 2026-11-27

## 1. Today's Highlights

No new releases landed in the last 24 hours, but the issue tracker remains highly active with 50 issues updated. The dominant themes today are **cost/quota anomalies** (multiple reports of 5-hour limits depleting abnormally fast), **macOS resource leaks** (daemon process accumulation, fseventsd runaway), and a **privacy regression in the GMail MCP** that rewrites URLs with Google tracking parameters. A notable PR (#112436) also proposes protecting high-impact and reproducible issues from automated stale-sweeping.

## 2. Releases

No new releases in the last 24 hours.

## 3. Hot Issues

1. **[#66010](https://github.com/anthropics/claude-code/issues/66010) — GMail MCP rewrites URLs with Google tracking URLs** (29 comments, 👍15)
   A privacy regression since June 2026: the GMail MCP injects Google tracking URLs into message links. High comment volume and upvotes signal strong community concern about data leakage through an official integration.

2. **[#22648](https://github.com/anthropics/claude-code/issues/22648) — Account-level settings sync across devices** (27 comments, 👍54)
   The single most-upvoted item in this batch. Users on multiple machines must manually maintain `~/.claude/` configs. References four prior duplicate requests (#6037, #19634, #13461, #12119), underscoring long-standing demand.

3. **[#98769](https://github.com/anthropics/claude-code/issues/98769) — macOS fseventsd runaway on agent-heavy Macs** (20 comments)
   fseventsd consuming 800x its budget, pinning a core for days with no self-recovery, and blocking Claude Code at startup. A serious platform-level performance issue for power users.

4. **[#44657](https://github.com/anthropics/claude-code/issues/44657) — Subagent Write tool rejects `.md` files named "report"/"summary"/"findings"/"analysis"** (18 comments, 👍35)
   A hard-coded, non-optional filename blocklist with no opt-out. The 👍35 reflects broad frustration — legitimate agent workflows are silently broken by naming heuristics.

5. **[#92089](https://github.com/anthropics/claude-code/issues/92089) — Second `/compact` re-appends summarized history, transcript grows quadratically** (14 comments)
   A reproducible core bug: repeated compaction causes transcript bloat rather than reduction, defeating the purpose of `/compact` in long sessions.

6. **[#94710](https://github.com/anthropics/claude-code/issues/94710) — Desktop app: no way to disable session survey** (14 comments, 👍22)
   The "How is Claude doing this session?" prompt has no user-level off switch, and existing feedback toggles don't apply. Minor but widely felt UX friction.

7. **[#87891](https://github.com/anthropics/claude-code/issues/87891) — Background daemon never reaps stale workers** (9 comments, 👍6)
   Reproduced leak: 64 orphaned processes / ~7.1 GB after six weeks, re-adopted on every restart. Compounds the broader macOS process-leak theme.

8. **[#112473](https://github.com/anthropics/claude-code/issues/112473) — Abnormally high usage consumption on short outputs** (9 comments)
   Fresh Windows/VS Code report of quota draining despite modest output. Part of a cluster of cost-regression reports filed in the last two weeks.

9. **[#111336](https://github.com/anthropics/claude-code/issues/111336) — False-positive `reasoning_extraction` safeguard blocks** (6 comments)
   78 blocked requests across Fable 5.2, Opus 5.5, and Sonnet 5.5 on ordinary dev work — a safety classifier misfiring at scale.

10. **[#104123](https://github.com/anthropics/claude-code/issues/104123) — Remote Control resume overwrites local transcript with server copy** (2 comments)
    A **data-loss** bug: ~150 messages lost after resume/compaction. Low comment count but high severity; worth watching.

## 4. Key PR Progress

1. **[#112436](https://github.com/anthropics/claude-code/pull/112436) — Don't mark reproducible or high-impact issues as stale** (OPEN)
   Exempts issues labeled `has repro`, `reproduced`, `data-loss`, or `high-priority` from stale-sweeping. Directly addresses community frustration with automated issue closure.

2. **[#35761](https://github.com/anthropics/claude-code/pull/35761) — `powershell-default` plugin** (CLOSED)
   Swaps the Bash tool's default shell to PowerShell 7+ Preview on any OS via SessionStart hook injection.

3. **[#35684](https://github.com/anthropics/claude-code/pull/35684) — `bridge-fix` plugin** (CLOSED)
   Fixes Chrome extension bridge connection failure for Max subscribers with `tengu_copper_bridge`. Supersedes #34789; fixes #34788.

4. **[#35683](https://github.com/anthropics/claude-code/pull/35683) — `scroll-fix` plugin** (CLOSED)
   Clamps cumulative cursor-up within synchronized output blocks to fix terminal scroll-to-top regression across all platforms.

*(Only 4 PRs were updated in the window; the remaining items are the three plugin PRs above and #112436. All are listed.)*

## 5. Hot Discussions

No Discussion data was provided for this window. Section omitted.

## 6. Feature Request Trends

- **Cross-device sync** — Account-level settings/config sync (#22648) is the highest-signal request, repeatedly filed since early 2026.
- **Granular permissions & unattended operation** — Pre-approving computer-use MCP apps (#86649) and opt-in password typing in browser/Chrome panes (#109110) point to demand for hands-off automation.
- **Cost visibility & controls** — Cost alerts, per-model breakdowns (#110655), and quota transparency recur across many issues.
- **UX opt-outs** — Users want user-level toggles for intrusive surfaces like the session survey (#94710).
- **Desktop companion features** — Requests like a standalone desktop pet (#109940) show appetite for richer desktop-app integration.

## 7. Developer Pain Points

- **Quota/cost regressions** — A strong cluster (#112473, #112477, #108661, #110773, #111685, #102618) reports 5-hour and weekly limits depleting far faster than token usage justifies. This is the most acute current frustration, spanning Windows, Linux, VS Code, and web.
- **macOS resource leaks** — Multiple independent reports (#98769, #87891, #104888) of runaway processes, orphaned workers, and swap exhaustion on agent-heavy machines.
- **Remote Control instability & data loss** — Sessions dropping Remote Control after restart (#110759) and transcript overwrites (#104123) undermine trust in remote workflows.
- **Overly aggressive guardrails** — Hard-coded filename blocklists (#44657) and false-positive safeguard blocks (#111336) interfere with legitimate development work.
- **Startup/blocking behavior** — fseventsd-induced startup blocks (#98769) with no detection or recovery.

---
*Generated from github.com/anthropics/claude-code data for 2026-11-27.*

</details>

<details>
<summary><strong>OpenAI Codex</strong> — <a href="https://github.com/openai/codex">openai/codex</a></summary>

# OpenAI Codex Community Digest — 2026-11-27

## 1. Today's Highlights

Release activity continued on the `rust-v0.174.0-alpha` train with two new alpha builds (alpha.7, alpha.8), signaling continued pre-release iteration. The dominant theme across issues was **Windows desktop regressions following the Nov 21 update**, with multiple high-engagement reports covering broken permission selectors, disabled send buttons in new Work chats, and connection errors. The long-running **Linux desktop app request (#11023)** finally closed after reaching 207 comments and 953 👍 — the single most-upvoted issue in this window.

## 2. Releases

Two alpha releases shipped in the last 24h:
- **rust-v0.174.0-alpha.8** — release 0.174.0-alpha.8
- **rust-v0.174.0-alpha.7** — release 0.174.0-alpha.7

No detailed changelogs were provided; both are pre-release alpha cuts on the 0.174.0 line.

## 3. Hot Issues

1. **[#11023](https://github.com/openai/codex/issues/11023) [CLOSED] Codex desktop app for Linux** — 207 comments, 953 👍. The most-requested platform gap; closure suggests a resolution or consolidation. Massive community weight behind Linux parity.
2. **[#62943](https://github.com/openai/codex/issues/62943) [OPEN] Windows Nov 21 regression: lost permission/execution selectors + Max reasoning effort** — 39 comments. Core Work-chat functionality broken post-update; high developer impact.
3. **[#62918](https://github.com/openai/codex/issues/62918) [OPEN] Windows: Send disabled in new Work chats + "Connection for host ID local not found"** — 24 comments. Blocks first-message sending; compounds the Nov 21 regression cluster.
4. **[#62669](https://github.com/openai/codex/issues/62669) [OPEN] Windows: file path breadcrumb flickers at certain widths** — 19 comments. UI polish bug with consistent reproduction.
5. **[#53309](https://github.com/openai/codex/issues/53309) [CLOSED] Historical reasoning double-counted → premature auto-compaction** — 16 comments. Context/rate-limit accounting bug affecting Pro Max users; closed.
6. **[#61670](https://github.com/openai/codex/issues/61670) [OPEN] ChatGPT Dot reads Codex chats but can't relay messages** — 15 comments. Cross-surface integration failure on Windows.
7. **[#63577](https://github.com/openai/codex/issues/63577) [OPEN] Account-specific "Selected model is at capacity" on Pro 200** — 12 comments. Account-scoped capacity errors on the same network; suggests backend routing anomaly.
8. **[#45061](https://github.com/openai/codex/issues/45061) [OPEN] Unrelated gambling/adult terms injected into auto-generated titles** — 12 comments. Data-quality/model-safety concern with reproducible Chinese spam suffixes.
9. **[#63466](https://github.com/openai/codex/issues/63466) [OPEN] GPT-6.2 Astra/Sol behavioral regressions** — 11 comments. Model-quality regression affecting previously working applications; cross-platform.
10. **[#64246](https://github.com/openai/codex/issues/64246) [OPEN] Linux Desktop severe memory exhaustion (22.6 GiB + 15.6 GiB swap, 323 processes OOM-killed)** — Potential regression of #44525. Newly filed, critical severity.

## 4. Key PR Progress

Most PRs in this window are bot-authored cleanup/UX fixes (copyberry[bot]), reflecting a TUI-focused stabilization pass.

1. **[#64236](https://github.com/openai/codex/pull/64236) Clear stale turn/review state on TUI resume** — Fixes persisted "in-progress" turns and stuck review mode after crashes.
2. **[#64221](https://github.com/openai/codex/pull/64221) Keep MCP startup from showing TUI as "Working"** — Corrects status derivation so MCP init doesn't falsely imply an active turn.
3. **[#64192](https://github.com/openai/codex/pull/64192) Support PRIMARY selection in Wayland sessions** — Enables middle-click paste/copy for Wayland users.
4. **[#64211](https://github.com/openai/codex/pull/64211) Open and highlight file line ranges in the TUI** — Recognizes `file.ts:42-44` and `#L42-L44` references.
5. **[#64207](https://github.com/openai/codex/pull/64207) Save/cycle side chats in TUI scrollback mode** — Persists side chats across parent resumes.
6. **[#64214](https://github.com/openai/codex/pull/64214) Fix Unicode highlighting in fuzzy file search** — Corrects grapheme vs. scalar offset mismatch for emoji/combining marks.
7. **[#64199](https://github.com/openai/codex/pull/64199) Fix TUI prompt editing with partially loaded history** — Resolves prompt mapping when transcript pages load out of order.
8. **[#64187](https://github.com/openai/codex/pull/64187) Configure Guardian V3 shadow reviews from root thread** — Replaces `guardianv3_shadow` with `guardianv3.shadow_enabled` routing.
9. **[#64166](https://github.com/openai/codex/pull/64166) Cap evidence on Guardian v3 shadow boards** — Adds 32 MiB per-root limit to bound shadow evidence growth.
10. **[#64164](https://github.com/openai/codex/pull/64164) Compact filesystem context for workspace-write profiles** — Opt-in flag to dedupe repeated read-only metadata.

## 5. Hot Discussions

**Ideas**
- **[#44419](https://github.com/openai/codex/discussions/44419) VS Code Codex history pagination beyond 50 sessions** — Older sessions exist locally but are unreachable from VS Code; request for pagination/search.
- **[#62436](https://github.com/openai/codex/discussions/62436) Supported architecture for continuing project ownership across runs** — Coordination system built on NATS/JetStream + durable project records.

**Q&A**
- **[#64176](https://github.com/openai/codex/discussions/64176) Supported recovery/diagnostic steps for two Codex Desktop failures** — Seeking official workflows rather than duplicate bug reports.
- **[#64076](https://github.com/openai/codex/discussions/64076) Windows App Server 0.171.0-alpha: verifying MXC-or-refusal and effective permissions pre-`command/exec`** — Sandbox attestation question.

**Show and tell**
- **[#34350](https://github.com/openai/codex/discussions/34350) Codex Skins — one-click wallpaper themes** — CDP-injection based, fully reversible.
- **[#64218](https://github.com/openai/codex/discussions/64218) Project Board — local Kanban from Codex chats** — Extracts task suggestions from local history into cards.
- **[#61667](https://github.com/openai/codex/discussions/61667) Handoff note that reopens after reload** — Plainer workspace demo.
- **[#64185](https://github.com/openai/codex/discussions/64185) Codex smoke test for contact form saved-lead count** — Test harness pattern for form analytics.
- **[#63395](https://github.com/openai/codex/discussions/63395) Codex Desk — find a past answer, read original history, continue** — Local browser workbench over existing Codex CLI.

## 6. Feature Request Trends

- **Platform parity**: Linux desktop app (finally closed) remains the headline gap; Wayland PRIMARY support landed via PR.
- **History & session management**: pagination beyond 50 VS Code sessions, side-chat persistence, configurable recent-chat counts in the IDE sidebar (#50264).
- **TUI UX**: better user/AI visual distinction (#8782, closed), expand/collapse prompt views in resume picker (#8709, closed), faster transcript overlay rebuild (#21945, closed).
- **Sandbox transparency**: pre-execution verification of MXC enforcement and permission rules (Discussion #64076).
- **Cross-surface coordination**: durable project ownership, Kanban extraction, and past-answer retrieval tooling.

## 7. Developer Pain Points

- **Windows Nov 21 regression cluster** (#62943, #62918, #62669): lost permission selectors, disabled Send in new Work chats, connection errors — the most acute, time-boxed frustration.
- **Sandbox/launcher resource leaks on Windows** (#56311): ~395 BfsS/BfsG kernel pool allocations per MXC launch, ending in `CreateProcessSecurityEnvironment failed (0x800705AA)` after long uptime.
- **Rate-limit opacity**: silent 429 back-offs (#58883), account-specific "at capacity" (#63577), and dictation usage false positives (#61509).
- **Model behavior regressions**: GPT-6.2 Astra/Sol reliability (#63466) and model-misrouting (#55780, #64245).
- **Safety-check friction**: #64238 — "Extra care for cybersecurity" blocks with no indication of which action triggered the stop.
- **Memory exhaustion on Linux Desktop** (#64246): OOM-killed processes, flagged as a potential regression.

---
*Generated from github.com/openai/codex activity on 2026-11-27.*

</details>

<details>
<summary><strong>Gemini CLI</strong> — <a href="https://github.com/google-gemini/gemini-cli">google-gemini/gemini-cli</a></summary>

# Gemini CLI Community Digest — 2026-11-27

## 1. Today's Highlights

No new releases shipped in the last 24 hours, but issue activity remains intense across the agent workstream. The dominant theme today is **subagent correctness and observability**: a P1 bug where `codebase_investigator` reports `GOAL` success despite hitting `MAX_TURNS` (#22323) is drawing the most discussion, alongside mounting reports of the generalist agent hanging indefinitely (#21409) and browser agent failures on Wayland (#21983). On the PR side, a wave of small, targeted fixes landed around ACP session handling, CRLF diff normalization, and capping runaway tool output.

## 2. Releases

No releases published in the last 24 hours.

## 3. Hot Issues

1. **[#22323](https://github.com/google-gemini/gemini-cli/issues/22323) — Subagent MAX_TURNS reported as GOAL success** (P1, 14 comments, 👍2)
   `codebase_investigator` reports `status: "success"` / `Termination Reason: "GOAL"` when it actually exhausted its turn budget before analyzing anything. This silently masks interruption, making it dangerous for automation built on subagent results. Highest-comment issue of the day.

2. **[#21409](https://github.com/google-gemini/gemini-cli/issues/21409) — Generalist agent hangs forever** (P1, 8 comments, 👍8)
   Users report the generalist subagent hangs on trivial operations (even folder creation) for up to an hour. Workaround: instruct the model not to defer to subagents. Strongest community endorsement (👍8) among open agent bugs.

3. **[#19873](https://github.com/google-gemini/gemini-cli/issues/19873) — Zero-dependency OS sandboxing & post-execution intent routing** (P2, 9 comments)
   Proposes letting Gemini 3 lean into its native bash affinity (grep/sed/awk chaining) safely via OS sandboxing. A design-level discussion on reconciling model priors with security posture.

4. **[#21968](https://github.com/google-gemini/gemini-cli/issues/21968) — Gemini doesn't use skills and subagents enough** (P2, 7 comments)
   Anecdotal but widely felt: custom skills (e.g. gradle, git) are ignored unless explicitly invoked. This is a core adoption blocker for the skills ecosystem.

5. **[#22745](https://github.com/google-gemini/gemini-cli/issues/22745) — AST-aware file reads, search, and mapping** (P2, 7 comments)
   EPIC evaluating whether AST-aware tooling can cut turns, reduce misaligned reads, and shrink token noise. Signals a shift from text-level to structure-level agent tooling.

6. **[#22267](https://github.com/google-gemini/gemini-cli/issues/22267) — Browser Agent ignores `settings.json` overrides** (P2, 5 comments)
   `maxTurns` and other config overrides silently ignored despite `AgentRegistry` merging them correctly. Config trust issue that undermines user tuning.

7. **[#22232](https://github.com/google-gemini/gemini-cli/issues/22232) — Browser agent session takeover / lock recovery** (P3, 5 comments)
   The fail-fast strategy on locked browser profiles (persistent mode, orphaned processes) is brittle. Request for automatic takeover instead of hard failure.

8. **[#21983](https://github.com/google-gemini/gemini-cli/issues/21983) — Browser subagent fails on Wayland** (P1, 4 comments)
   Environment-specific breakage reporting `GOAL` termination despite failure — compounding the false-success pattern seen in #22323.

9. **[#24246](https://github.com/google-gemini/gemini-cli/issues/24246) — 400 error with >128 tools** (P2, 3 comments)
   Tool-count scaling limit; agent doesn't prune the enabled tool set. Becomes critical as MCP servers multiply.

10. **[#22672](https://github.com/google-gemini/gemini-cli/issues/22672) — Agent should discourage destructive behavior** (P2, 3 comments)
    Reports of `git reset` / `--force` usage where safer alternatives exist. Directly tied to user trust in autonomous operation.

## 4. Key PR Progress

1. **[#30212](https://github.com/google-gemini/gemini-cli/pull/30212) — Configurable per-tool-call timeout (`tools.callTimeout`)** (help wanted)
   Adds a wall-clock cap per tool call with recoverable `TOOL_CALL_TIMEOUT` errors, letting the model pivot instead of hanging. Directly relevant to the hanging-agent cluster of bugs.

2. **[#30415](https://github.com/google-gemini/gemini-cli/pull/30415) — Time limit for web search, stop retries on abort** (P1)
   Fixes `google_web_search` hanging indefinitely on stalled or retry-looping requests (per #29594).

3. **[#30109](https://github.com/google-gemini/gemini-cli/pull/30109) — Cap `grep_search` output size** (help wanted)
   Broad greps can emit ~150K characters despite the 64KB executor cap; this PR trims output and instructs the model to narrow searches. Token-hygiene win.

4. **[#30489](https://github.com/google-gemini/gemini-cli/pull/30489) — Normalize CRLF in `write_file` diffs and diffStat**
   Aligns `write-file.ts` with `edit.ts` behavior while preserving raw content for line-ending detection. Fixes noisy Windows diffs.

5. **[#30491](https://github.com/google-gemini/gemini-cli/pull/30491) — Include `tool_call_id` in BeforeTool/AfterTool hooks**
   Enables hooks to pair before/after events by ID rather than tool name + arg matching in arrival order. Important for hook authors.

6. **[#30368](https://github.com/google-gemini/gemini-cli/pull/30368) — ACP: support closing sessions**
   Implements `session/close` so ACP clients can release sessions before process exit — a gap for editor integrations.

7. **[#30487](https://github.com/google-gemini/gemini-cli/pull/30487) — ACP: handle rejection on approval-mode update**
   Fixes an unhandled promise rejection in `handleApprovalModeChanged` that could terminate the process when the connection closes.

8. **[#30473](https://github.com/google-gemini/gemini-cli/pull/30473) — Exclude evicted binary payloads from retrieval byte budget**
   Prevents a single old image `read_file` from blowing the history budget after inline data eviction.

9. **[#30490](https://github.com/google-gemini/gemini-cli/pull/30490) — Pass `config` to `getDisplayString` in Footer**
   Fixes custom model `displayName` resolution in the CLI footer. Small but user-visible polish.

10. **[#30268](https://github.com/google-gemini/gemini-cli/pull/30268) — Respect active YOLO mode in taint/build-file checks**
    Stops confirmation prompts and `POLICY_VIOLATION` hard-denials from interrupting trusted autonomous (`-y`) runs.

## 5. Hot Discussions

No Discussions data was provided in the source dataset; this section is omitted.

## 6. Feature Request Trends

- **Subagent observability & control**: visibility into subagent trajectories via `/chat share` (#22598), subagent context in bug reports (#21763), backgrounding local agents with `Ctrl+B` (#22741), and shared-memory/parallel subagent collaboration (#18287).
- **AST-aware tooling**: a coordinated EPIC (#22745, #22746, #22747) exploring AST grep, glyph, and tilth for precise reads, search, and codebase mapping — reducing turns and token noise.
- **Persistent, file-based task tracking**: replacing in-context `WriteToDo` with CRUD-on-disk task state to combat context rot (#18836, #21000).
- **Safety rails for autonomy**: discouraging destructive git operations (#22672), sandboxed bash affinity (#19873), and per-workspace policy scoping (#18397).
- **Self-awareness & discoverability**: agents that accurately know their own flags/hotkeys (#21432), skill/subagent auto-invocation (#21968), and curated in-repo agent examples (#18283).

## 7. Developer Pain Points

1. **Subagents hang or lie about success** — the single loudest cluster: generalist hangs (#21409), false `GOAL` success on turn exhaustion (#22323), and browser agent failures reported as goals (#21983). Erodes trust in any workflow that delegates to subagents.
2. **Configuration is silently ignored** — `settings.json` overrides (e.g. `maxTurns`) not honored by the browser agent (#22267); symlinked agent definitions not recognized (#20079). Users cannot rely on their own tuning.
3. **Runaway tool output and unbounded waits** — no per-call timeout (#30212), unbounded web search (#30415), and oversized grep results (#30109) all point to a need for hard resource ceilings.
4. **Skills and subagents under-invoked** — capable extensions exist but the model rarely reaches for them unprompted (#21968), turning a feature into a manual ritual.
5. **Environment fragility** — Wayland breakage (#21983) and persistent-profile lock failures (#22232) make the browser agent unreliable outside the happy path.
6. **Context and token bloat** — 36.6k baseline tokens per turn and firehose file reads (#19561, #30109) keep driving requests for surgical, AST-aware retrieval.

</details>

<details>
<summary><strong>GitHub Copilot CLI</strong> — <a href="https://github.com/github/copilot-cli">github/copilot-cli</a></summary>

# GitHub Copilot CLI Community Digest — 2026-11-27

## 1. Today's Highlights

Activity today is dominated by sandbox and permissions hardening: a new pre-release (`v1.0.117-5`) adds support for custom CA certificates in sandboxed commands to work behind TLS-intercepting proxies, while the prior two builds refine Page Down behavior and assisted-permission heuristics. The issue tracker is unusually busy with a fresh batch of `triage`-labeled reports (mostly from a single power user), pointing to growing friction in sandbox networking, remote sessions, and observability. No pull requests were updated in the last 24 hours, so the release pipeline is moving entirely through maintainer-driven builds.

---

## 2. Releases

Three pre-release builds shipped in the last 24 hours:

**`v1.0.117-5` — Added**
- New `sandbox.userPolicy.network.extraCaCertificates` setting (user or managed settings) that lets sandboxed commands trust custom CA certificates through TLS-intercepting proxies. `#1.0.117-5`
- This is a direct response to enterprise users running behind MITM proxies (Zscaler, corporate TLS inspection) where sandboxed `curl`/`npm` calls were failing on untrusted certs.

**`v1.0.117-4` — Fixed**
- Fixed Page Down stalling at a pinned prompt in a 10-row terminal with tabs enabled — a narrow but reproducible TUI regression.

**`v1.0.117-3` — Improved / Fixed**
- Assisted Permissions can now avoid unnecessary confirmation prompts when Copilot stops a process it started *in the same session*, matched by PID. This reduces prompt fatigue for agent-spawned subprocesses.
- Approving an MCP server's tools for the session or location no longer accidentally approves Copilot's built-in requests (e.g., shell). This is a meaningful permission-scoping fix.

---

## 3. Hot Issues

1. **[#5323 — Add setting to disable agent checkpoint refs](https://github.com/github/copilot-cli/issues/5323)** (OPEN, 8 comments, 👍7) — Every agent turn writes `refs/agents/<session>/checkpoints/turn/N` authored with the user's own git identity. These refs pollute `git log --all`, tag browsers, and CI tooling. Highest-comment issue in the window and the clearest signal that the checkpoint ref design needs an opt-out.

2. **[#5283 — Remote environment blocked by remote-control policy on Copilot Free](https://github.com/github/copilot-cli/issues/5283)** (OPEN, 4 comments, 👍9) — Highest-upvoted issue in this window. Personal Copilot Free accounts with no org membership can't enable remote access even though local settings look enabled. `host.start` fails with a policy error. Community reaction suggests the policy-vs-entitlement mismatch is confusing.

3. **[#3563 — Tool approvals silently lost across parallel sessions](https://github.com/github/copilot-cli/issues/3563)** (CLOSED, 4 comments) — Concurrent `copilot` sessions clobber each other's persisted approvals in `~/.copilot/permissions-config.json` with no lock. Closed now, but a classic race-condition class that will keep biting users running many terminals.

4. **[#5464 — Stdio MCP server fails when `server/discover` times out](https://github.com/github/copilot-cli/issues/5464)** (CLOSED, 3 comments) — Legacy `initialize` fallback on the *same* connection conflicts with the queued `server/discover`, producing `-32022`. Important for MCP server authors on the Python SDK 2.3.0.

5. **[#5047 — Expose assisted approval in ACP mode](https://github.com/github/copilot-cli/issues/5047)** (CLOSED, 2 comments, 👍1) — ACP clients like T3 Code can't leverage Copilot's assisted safety judge today. Closing this unblocks a broader ecosystem of third-party CLI frontends.

6. **[#5355 — Remote session auto-publish fails with `--add-dir`](https://github.com/github/copilot-cli/issues/5355)** (OPEN, 2 comments, 👍1) — `host.publishSession` fails at launch when `--add-dir` is used. Small but blocking for anyone using multi-directory workflows with remote sessions.

7. **[#5591 — CLI floods Windows Credential Manager with `copilot-mcp-oauth` / `copilot-keychain-chunk` entries](https://github.com/github/copilot-cli/issues/5591)** (OPEN, triage) — Hundreds of leaked entries eventually fill the vault, causing `CredWrite error 8` for *other* applications (`az devops login`, `cmdkey`). This is a severe, user-visible bug on Windows with no cleanup path.

8. **[#5593 — Local sandbox blocks `git submodule update`, even as a no-op](https://github.com/github/copilot-cli/issues/5593)** (OPEN, triage) — Regression from 1.0.99-2. Any repo with initialized submodules can no longer be built inside the sandbox. Directly breaks the agent's ability to build large monorepos.

9. **[#5580 — Windows sandbox blocks direct TCP despite allowlist](https://github.com/github/copilot-cli/issues/5580)** (OPEN, 1 comment) — `SocketErrorCode: AccessDenied` (Win error 10013) even when hostname and IP are both allowed. Complements the `extraCaCertificates` fix as a broader sandbox networking problem.

10. **[#5592 — `getMessages` on a large session kills the stdio transport](https://github.com/github/copilot-cli/issues/5592)** (OPEN, triage) — Resuming an ~808 MB session and calling `get_events()` causes a Rust JSON-RPC `write EINVAL` and hangs the CLI. Affects SDK-driven automation on large sessions.

---

## 4. Key PR Progress

No pull requests were updated in the last 24 hours. The release pipeline is currently maintainer-driven via pre-release builds; no community PRs are visible in this window.

---

## 5. Hot Discussions

No discussion data was provided in the source dataset. This section is omitted.

---

## 6. Feature Request Trends

Distilling across the issues in this window, the most-requested directions are:

- **Sandbox/network configuration depth** — `extraCaCertificates` (v1.0.117-5), `--add-dir` remote publish (#5355), Windows TCP allowlist (#5580), and sandbox `git submodule` (#5593) all point to the sandbox being simultaneously the most-loved and most-constraining feature. Users want finer-grained, per-resource network and filesystem policy.
- **Permission system predictability** — Parallel-session races (#3563), ACP exposure (#5047), and URL truncation in prompts (#5257) all point to the permission model being under-specified for complex setups. Expect continued requests for a lockfile, per-session approval scoping, and a proper `permissions.json` schema version.
- **Remote & multi-session ergonomics** — Entitlement policy (#5283), session publish (#5355), session-switch hangs (#5577), and OTel per-instance IDs (#5005) all point to remote/multi-session usage being an afterthought relative to the single-session local experience.
- **Observability and clean state** — OTel instance IDs, `settings/hooks` hot-reload (#5595), notification disposition (#5596), and credential-store hygiene (#5591) all ask for the same thing: make the CLI's side effects observable and reversible.
- **MCP ecosystem robustness** — Legacy `initialize` fallback (#5464), case-sensitive `/mcp` matching (#5050), and lint tolerating malformed marketplace entries (#5582) all suggest MCP server and plugin ecosystem maturity should be a first-class concern.
- **Model extensibility** — Local vLLM routing via Fusion (#5581), BYOK OTel regressions (#5583), generic-client tool_search override (#5579), and org-level custom agents' `model` field (#5585) all point to a desire to push more traffic through non-default models.

---

## 7. Developer Pain Points

1. **Sandbox networking is a maze.** Even after the `extraCaCertificates` fix, users report allowlists, Windows TCP, and submodule operations still failing. There is no single coherent guide for "how do I get X to work through the sandbox."

2. **Credentials and permissions are stateful side effects that leak.** Windows Credential Manager bloat (#5591), parallelism races in `permissions-config.json` (#3563), and cross-approval of MCP tools (#1.0.117-3) all describe the same underlying problem: the CLI mutates global state without locking, scoping, or TTLs.

3. **The remote/multi-session path is second-class.** Free-tier policy (#5283), `--add-dir` publish (#5355), session-switch hangs (#5577), and AHP retry loops (#5594) all affect users who are *exactly* the target audience for remote Copilot.

4. **TUI regressions are recurring and narrowly scoped.** Page Down in a 10-row terminal (#1.0.117-4) is a symptom of a TUI that's tested at only one terminal size. Users report multi-hour debugging for one-line fixes.

5. **No hot-reload for settings/hooks.** `settings.json` and `hooks` changes require a full CLI restart with no notice (#5595). For a long-running agent session, this is a significant UX gap — particularly for teams iterating on hook scripts.

6. **Model routing is unpredictable for non-default providers.** BYOK + `-p` silently drops OTel (#5583), Fusion never routes to local vLLM (#5581), and org-level agents ignore `model` (#5585). The "bring your own model" story is not yet coherent.

7. **The agent loop lacks a "I told you not to do that" memory.** #5589 documents repeated ignoring of an explicit `Co-authored-by` rejection across three rejections. This is a prompt/discipline issue rather than a code issue, but it's the highest-leverage trust problem in the list.

---

*Generated from data at `github.com/github/copilot-cli` on 2026-11-27. Issue links point to the source repository; full URLs shown for traceability.*

</details>

<details>
<summary><strong>OpenCode</strong> — <a href="https://github.com/anomalyco/opencode">anomalyco/opencode</a></summary>

# OpenCode Community Digest — 2026-11-27

## 1. Today's Highlights

The free tier remains the dominant community flashpoint: the consolidated issue [#59387](https://github.com/anomalyco/opencode/issues/59387) has ballooned to 412 comments and is still the most active thread across the repo. On the engineering side, `rekram1-node` is pushing a cluster of provider-layer fixes (ChatGPT multi-account sign-in, zstd/gzip request compression, ChatGPT plan-speed detection), while `hearnadam` is systematically addressing SharedCache/Console config retry storms observed in production telemetry. No new releases shipped in the last 24h.

## 2. Releases

No new releases in the last 24 hours.

## 3. Hot Issues (10)

1. **[#59387 — [zen] Free tier issues: read this first](https://github.com/anomalyco/opencode/issues/59387)** — 412 comments, 31 👍. The canonical megathread for all free-tier failures (usage-limit false positives, broken resets, desktop version blocks). Volume alone signals the free tier is the single largest source of user friction right now.

2. **[#23153 — [FEATURE] Pay Go with crypto](https://github.com/anomalyco/opencode/issues/23153)** — CLOSED, 40 comments, **74 👍** — by far the highest-reaction item in this batch. Crypto payment for OpenCode Go is a strongly demanded monetization/access option, particularly for users in regions with card friction.

3. **[#64073 — [FEATURE] Restore Foreground Subagent Execution](https://github.com/anomalyco/opencode/issues/64073)** — 38 comments, 13 👍. v2 regression report: subagents no longer run in the foreground. High engagement suggests this is a behavioral change many workflows depended on.

4. **[#52958 — [Billing] OpenCode Go subscription payments all declined from Italy](https://github.com/anomalyco/opencode/issues/52958)** — 33 comments, 5 👍. Every payment method (physical card, Apple Pay, Stripe Link, virtual MC) is declined for this user. A regional billing/Stripe routing issue worth escalating.

5. **[#30611 — Sessions fail on transient network errors instead of retrying](https://github.com/anomalyco/opencode/issues/30611)** — CLOSED, 12 comments. The retry path only treated `ECONNRESET` as retryable; other transient transport failures killed turns outright. Fix lands as a meaningful reliability win.

6. **[#58080 — macOS Local Network Privacy blocks background service from LAN hosts](https://github.com/anomalyco/opencode/issues/58080)** — 9 comments. On macOS 15+, the background service can't reach LAN addresses (`EHOSTUNREACH`) without a signed `.app` bundle. Blocks local-model and LAN-proxy setups.

7. **[#56862 — [reproduced] Subagents failing with context compaction](https://github.com/anomalyco/opencode/issues/56862)** — 8 comments. Subagents hit compaction failures well below the stated context limit once large files are read. Reproduced tag makes this actionable.

8. **[#55764 — [FEATURE] Session pinning in Desktop app (TUI parity)](https://github.com/anomalyco/opencode/issues/55764)** — 7 comments, 7 👍. Desktop is missing a TUI capability; the linked prior request (#28813) shows this has been requested for a while.

9. **[#62319 — Provider stalls retried silently, no error surfaced or logged](https://github.com/anomalyco/opencode/issues/62319)** — 5 comments. Indefinite hangs with zero WARN/INFO logging is a serious observability gap for anyone running OpenCode unattended.

10. **[#66699 — `opencode run` exits 1 with empty stderr on server-side failures](https://github.com/anomalyco/opencode/issues/66699)** — 3 comments. CI/scripted consumers get no diagnostic output when a run fails server-side (e.g. quota). Easy fix, high leverage for automation users.

## 4. Key PR Progress (10)

1. **[#64945 — fix(core): register a new ChatGPT client when adding an account](https://github.com/anomalyco/opencode/pull/64945)** — Closes #56298. Each ChatGPT client is bound to one account/workspace; this registers a fresh client on second-account add, fixing `3p_login_workspace_scope_denied`.

2. **[#66705 — fix(core): read ChatGPT plan speeds from the account's own model list](https://github.com/anomalyco/opencode/pull/66705)** — Closes #64968, supersedes #64528. Makes GPT-6.2 Ultrafast (and similar) visible for eligible Pro accounts by consulting the account's own catalog.

3. **[#65700 — fix(ai): zstd-compress ChatGPT sign-in requests again](https://github.com/anomalyco/opencode/pull/65700)** — Restores the intended zstd default, moved from core into the AI package and decided by URL (matching Codex client behavior). Fixes a silent encoding regression.

4. **[#65697 — feat(ai): gzip requests to api.anthropic.com by default](https://github.com/anomalyco/opencode/pull/65697)** — Closes #65170. Transcripts are resent every step; gzip meaningfully cuts upload bytes per tool call for long Anthropic sessions.

5. **[#66676 / #66678 — SharedCache retry backoff](https://github.com/anomalyco/opencode/pull/66676)** ([#66678](https://github.com/anomalyco/opencode/pull/66678)) — Stops in-flight retries on warm refreshes and honors `Retry-After` during PlanetScale stalls. Directly addresses the production telemetry in the PR descriptions.

6. **[#66677 — fix(core): back off Console config polling when signed out](https://github.com/anomalyco/opencode/pull/66677)** — Targets ~10.84M `401` responses/day on `/console/api/v2/config`. Pure waste reduction.

7. **[#63038 — fix(core): settle execution after a session is deleted](https://github.com/anomalyco/opencode/pull/63038)** — Fixes #51622. A runner on one server could still publish results after another server deleted the session from the shared DB.

8. **[#66695 — fix(core): watch the branch ref that HEAD points at](https://github.com/anomalyco/opencode/pull/66695)** — Addresses stale "Branch changes" in Desktop (#66601). Doesn't yet cover commit-list view or the feature-branch diff issue.

9. **[#63542 — fix(desktop): SSH recover when remote service port is taken](https://github.com/anomalyco/opencode/pull/63542)** — Closes #54059. Reconnection failed after SSH drops even when SSH itself was fine; this handles the port-taken case.

10. **[#65759 — fix(client): recover model catalogs after a failed first load](https://github.com/anomalyco/opencode/pull/65759)** — If the first provider/model reads returned 503, both pending requests were dropped and nothing recovered. Fixes a class of "empty model list" bugs.

## 5. Hot Discussions

No Discussion data was provided; this section is omitted.

## 6. Feature Request Trends

- **Desktop/TUI parity** — Session pinning (#55764), deep links to specific sessions (#44167), skill sorting in TUI (#66596), opening file paths from TUI responses (#60175). The Desktop app is repeatedly measured against TUI capabilities.
- **Agent execution control** — Restoring foreground subagent execution (#64073), keeping the machine awake during agent work and optionally sleeping afterward (#58858).
- **Plugin/MCP extensibility** — Letting plugins call tools and read resources over existing MCP connections (#53514); one-command skill installation (#66702); `mcp_skills` behavior bug where server instructions are dropped once any skill is exposed (#66706).
- **Provider & model surfacing** — GPT-6.2 Ultrafast visibility for Pro accounts (#64968); Ollama output-cap enforcement (#66249).
- **Distribution & access** — More iOS TestFlight slots or unsigned IPA (#64603); crypto payments (#23153); FLOSS-friendly packaging (Flatpak update handling, #65951).
- **Operational polish** — Alphabetical skill sorting, first-draw performance, session pinning — small QoL items with broad applicability.

## 7. Developer Pain Points

- **Free tier & billing** — By far the most concentrated frustration: false "usage exceeded" states, resets that never fire, and region-blocked subscription payments (#59387, #52958). The 412-comment megathread indicates the volume has outgrown individual reports.
- **Silent failures** — Stalled provider streams retried with no surfaced error and no logging (#62319), `opencode run` exiting 1 with empty stderr (#66699), and hung ChatGPT subscription streams (#29420). Scripted and CI consumers are hit hardest.
- **Retry/transient-error handling** — A cluster of issues (#30611, #59291, #62319) all point at the same theme: transient transport failures are classified too strictly or retried invisibly.
- **Cold-start latency** — First TUI draw taking 14.6 s in large repos (#59597) versus 122 ms against a warm service is a stark gap.
- **Context limits under real workloads** — Subagents compact-failing below the nominal limit (#56862) and image accumulation exceeding provider caps (#47721) both reflect real usage outpacing current heuristics.
- **Platform-specific breakage** — macOS LAN privacy (#58080), Linux `Shift+Alt` focus loss (#56976), Windows/Linux stale branch diffs (#66601), and Flatpak self-update conflicts (#65951) form a persistent long tail.
- **Provider integration edge cases** — Multi-account ChatGPT sign-in (#56298), Copilot model rejection (#34048), and model-list deduplication (#64610) suggest provider adapters need more defensive testing.

---
*Digest generated from GitHub activity on `anomalyco/opencode` for 2026-11-27. Reaction counts and comment totals reflect the state at time of generation.*

</details>

<details>
<summary><strong>Pi</strong> — <a href="https://github.com/earendil-works/pi">earendil-works/pi</a></summary>

# Pi Community Digest — 2026-11-27

## 1. Today's Highlights

No new releases landed in the last 24 hours, but the issue tracker was extremely active with **30+ issues and 18 PRs updated**. The dominant theme was **terminal rendering correctness** — specifically Kitty graphics protocol image loss/scrollback wipes (fixed across #12596/#12597) and a Windows follow-up where a killed Pi leaves Kitty keyboard reporting stuck. A second cluster formed around **state/GC lifecycle in long-running SDK hosts** (#12546) and **prompt cache invalidation from tool-list reordering** (#12547, prio:p0).

---

## 2. Releases

*No new releases in the last 24 hours.*

---

## 3. Hot Issues

1. **[#12548 — Kitty images lost / scrollback wiped](https://github.com/earendil-works/pi/issues/12548)** (6 comments) — The highest-traffic issue today. Images vanish when output follows them, and fallback full-redraws nuke Konsole scrollback. Spun off two focused fixes (#12596, #12597).

2. **[#12546 — `AgentSession.dispose()` retains bound closures, preventing GC](https://github.com/earendil-works/pi/issues/12546)** (4 comments) — Long-running SDK hosts OOM because disposed sessions stay strongly reachable. `invalidate()` marks stale but doesn't break references. Critical for anyone embedding Pi as a service.

3. **[#12564 — Windows: dead Pi leaves Kitty keyboard reporting on, PowerShell unusable](https://github.com/earendil-works/pi/issues/12564)** (3 comments) — Follow-up to #12133, reproducible on 1.6.0 even without alternate screen. Prompts the new docs fix in PR #12601.

4. **[#8393 — Add ModelScope as a built-in provider](https://github.com/earendil-works/pi/issues/8393)** (2 comments, opened Aug, updated today) — Long-running request to add Alibaba's model hub (Qwen/GLM/DeepSeek via OpenAI-compatible endpoint). Notable for its longevity — a signal of demand for non-Western provider coverage.

5. **[#12418 — Preserve Copilot `reasoning_opaque` in OpenAI Completions replay](https://github.com/earendil-works/pi/issues/12418)** (2 comments, 👍2) — prio:p0. Dropped opaque reasoning breaks Copilot replay on Gemini/Claude models. Fixed by PR #12505.

6. **[#12550 — Project-local skill exclusion writes both plain path and minus entry](https://github.com/earendil-works/pi/issues/12550)** — Setting "Skip" on a skill writes duplicate `settings.json` entries. Config-hygiene bug with easy repro.

7. **[#12521 — Contributor approval request for 5 tested fixes](https://github.com/earendil-works/pi/issues/12521)** — PRs auto-closed by the contributor approval gate; author asks maintainers to `lgtm`. Highlights friction in the contribution pipeline.

8. **[#12593 — "hello" produces ~56k-token requests (×4) with zero cache hits on local omlx](https://github.com/earendil-works/pi/issues/12593)** — Extreme token amplification on a local backend. Suspicious for anyone running Pi against self-hosted inference.

9. **[#12512 — pi-durable: pause task dispatch while draining active steps on shutdown](https://github.com/earendil-works/pi/issues/12512)** — OPEN, tagged `durable`. Requested pause/drain API so shutdown doesn't strand in-flight invocations.

10. **[#12561 — Bash tool has no default timeout](https://github.com/earendil-works/pi/issues/12561)** — A hung command ran for **2h 6m** with no timeout or error. Straightforward safety gap; high agreement likely.

*Honorable mention:* [#12547 (/reload reorders tool list → prompt cache miss, prio:p0)](https://github.com/earendil-works/pi/issues/12547) and [#12540 (@ file completion falls behind typing on large trees)](https://github.com/earendil-works/pi/issues/12540).

---

## 4. Key PR Progress

1. **[#12597 — Append Kitty images without full redraw in regular mode](https://github.com/earendil-works/pi/pull/12597)** — Fixes the scrollback-wipe half of #12548; avoids blank-line reservation trick that broke WezTerm.

2. **[#12596 — Keep Kitty image IDs within signed 32-bit range](https://github.com/earendil-works/pi/pull/12596)** — Konsole parses IDs via `toInt()`, so ~half of random IDs read as 0 and images never display. Targeted fix for the image-loss half of #12548.

3. **[#12505 — Replay Copilot `reasoning_opaque` in openai-completions](https://github.com/earendil-works/pi/pull/12505)** — Closes #12418; preserves opaque reasoning deltas so replayed requests don't lose reasoning context.

4. **[#12604 — Copilot mai-code models don't support temperature](https://github.com/earendil-works/pi/pull/12604)** — Dismisses the "temperature not supported" error for mai-code via /responses.

5. **[#12574 — Retry Bedrock "Too many tokens" throttling](https://github.com/earendil-works/pi/pull/12574)** — Bedrock's second 429 message variant wasn't matched by the retry regex; closes #12573.

6. **[#12592 — Don't count `!!` output in context token estimate](https://github.com/earendil-works/pi/pull/12592)** — `bashExecution` messages are excluded from LLM context but were still inflating compaction estimates. Bot-authored (robopipi).

7. **[#12582 / #12562 — Delete conversations for good (Chord + Durable)](https://github.com/earendil-works/pi/pull/12582)** — Adds `Harness.deleteConversations()`, closes conversations, aborts background work, purges forks. Breaking change marked with `!`. Refs #11026.

8. **[#12595 / #12602 — `--agent-dir` + carry restriction/resource flags in OSC 7577 resume](https://github.com/earendil-works/pi/pull/12602)** — Terminal-reported resume commands now preserve startup flags and agent dir; closes a known limitation of #12557.

9. **[#12577 — Summarize selected prompt when navigating the tree](https://github.com/earendil-works/pi/pull/12577)** — `/tree` "Summarize" was collecting entries *including* the selected message, so the prompt got dropped unsummarized.

10. **[#12556 — Honor `DO_NOT_TRACK` for install telemetry](https://github.com/earendil-works/pi/pull/12556)** + **[#12584](https://github.com/earendil-works/pi/pull/12584)/[#12589](https://github.com/earendil-works/pi/pull/12589)** — The telemetry saga: a docs page was added, then reverted; the actual opt-out PR remains a draft. Worth watching given the public harness telemetry audit that rated Pi C.

---

## 5. Hot Discussions

*No Discussions data was provided for this period.*

---

## 6. Feature Request Trends

- **Provider expansion**: ModelScope (#8393), OpenAI Images API for `gpt-image-*` (#12545), and a generic `pi-image` protocol (PR #12535) — demand is broadening beyond text chat.
- **Durable/embedded harness control**: pause/drain on shutdown (#12512), host-controlled task scheduling (PR #12603), conversation deletion (#12562/#12582).
- **Config schema completeness**: JSON schema for `mcp.json` (#12563) to match the four already published.
- **Transcript customization**: keep pre-compaction messages visible (#12565), elide tool-result payloads in JSONL sidecars (#12506).
- **Tool output resumability**: standardize truncation notices and retrieval hints (#12567), including inside codemode (#12594).

---

## 7. Developer Pain Points

1. **Terminal-mode leakage on abnormal exit** — Killed Pi processes leave Kitty keyboard reporting and alternate-screen state behind, breaking the shell (#12564, #12548). A stack-based push/pop model means each crash leaks one level.
2. **Prompt cache misses from non-deterministic prompt construction** — Tool-list reordering on `/reload` (#12547) and pathological token amplification on local backends (#12593) both silently destroy caching economics.
3. **GC/lifecycle bugs in long-running SDK hosts** — #12546 (retained closures → OOM) and #12526 (a throwing progress subscriber settles a run while tools are still executing) point at under-tested embedding paths.
4. **Silent failures** — Dangling extension symlinks skipped with no warning (#12599); missing compaction events on boundary drafts (#12598); no default bash timeout (#12561).
5. **Concurrency hazards** — Non-serialized overlapping edits across hard links/symlinks (#12527) and provider-specific streaming quirks (Kimi splitting one tool call across items, #12509).
6. **Contribution friction** — Auto-closed PRs behind an approval gate leave tested fixes stranded (#12521), a recurring community complaint.

</details>

<details>
<summary><strong>Qwen Code</strong> — <a href="https://github.com/QwenLM/qwen-code">QwenLM/qwen-code</a></summary>

# Qwen Code Community Digest — 2026-11-27

## 1. Today's Highlights

Qwen Code CLI lands on the **Harness kernel** with privacy-first defaults (usage statistics off unless explicitly enabled), marking a significant architectural expansion ([#18351](https://github.com/QwenLM/qwen-code/pull/18351)). The team also shipped **v0.28.7** and a nightly for the **v0.28.6** line, while managed sessions gained suspend/resume capabilities with cold recovery after crashes. Meanwhile, CI health remains a dominant theme—nearly all top-commented issues are automated main-branch failure reports, several chronic and recurring.

---

## 2. Releases

**v0.28.7** (latest stable)
- Release notes reference the Harness kernel rollout and improved repeated-tool-call rejection messaging.

**v0.28.6**
- Managed sessions can now **suspend while awaiting tool approvals, questions, or background work**, and resume after Harness crashes via cold recovery ([#17953](https://github.com/QwenLM/qwen-code/pull/17953), [#18115](https://github.com/QwenLM/qwen-code/pull/18115)).

**v0.28.6-nightly.20261126.6b0cd79b**
- Adds the Qwen Code CLI package on the Harness kernel ([#18351](https://github.com/QwenLM/qwen-code/pull/18351)).
- Fixes core tool-recovery error messaging.

**sdk-typescript-v0.1.36**
- Bundles CLI v0.28.6 (built from the same branch/ref as the SDK).

---

## 3. Hot Issues

1. **[#11680](https://github.com/QwenLM/qwen-code/issues/11680)** — *[CLOSED]* Main CI failed: E2E Tests, no test identified. 107 comments, the longest-running CI thread; illustrates the noise cost of automated main-branch failure tracking.

2. **[#18252](https://github.com/QwenLM/qwen-code/issues/18252)** — *[CLOSED]* E2E `cli/cron-tools.test.ts` failing (+73 more). A broad E2E regression wave touched dozens of test files; 54 comments reflect triage churn.

3. **[#17934](https://github.com/QwenLM/qwen-code/issues/17934)** — *[CLOSED]* `qwen-serve-restart-recovery.test.ts` failing after SIGKILL. Directly tied to the new suspend/resume work; community tracked whether the daemon recovers cleanly.

4. **[#18342](https://github.com/QwenLM/qwen-code/issues/18342)** — *[CLOSED]* E2E Tests, no test identified (latest 2026-11-26). 32 comments; part of the ongoing E2E instability cluster.

5. **[#13009](https://github.com/QwenLM/qwen-code/issues/13009)** — *[CLOSED]* E2E cron-tools failures (+42 more), tagged `autofix/approved`. Notable as an example of the automated fix pipeline closing out a long-standing cluster.

6. **[#16346](https://github.com/QwenLM/qwen-code/issues/16346)** — *[CLOSED]* `ClassSizeRatchetTest.productionClassesStayWithinTheirSizeRatchet` failing. The class-size ratchet keeps tripping; 22 comments indicate debate about whether the ratchet threshold is realistic.

7. **[#18258](https://github.com/QwenLM/qwen-code/issues/18258)** — *[OPEN]* Managed Agent gate: `HostedMonitorRunFaultGatesIT` MySQL fault gates (+28 more). Open and active; hosted-runtime reliability under crash faults is a recurring pain.

8. **[#17446](https://github.com/QwenLM/qwen-code/issues/17446)** — *[OPEN]* Feature request: discover models during custom provider setup. Community wants `/auth` model discovery extended to OpenAI-compatible and Anthropic-compatible custom providers. Tagged `priority/P2`, `need-discussion`.

9. **[#17851](https://github.com/QwenLM/qwen-code/issues/17851)** — *[OPEN, P1]* Managed Agent full tier chronically red since ≥2026-11-11. `Hosted failover E2E --big-output` timing out; independent of open PRs—a real reliability signal, not triage noise.

10. **[#16259](https://github.com/QwenLM/qwen-code/issues/16259)** — *[OPEN, P2]* Chinese-language report: a single user message inflated to 60KB+ by system-reminder / memory catalog, causing the model to respond "no task." A high-impact context-management bug for memory/context performance.

---

## 4. Key PR Progress

1. **[#18351](https://github.com/QwenLM/qwen-code/pull/18351)** — `feat(qwen)`: Add Qwen Code CLI package on the Harness kernel. The headline change of the day; usage stats off by default.

2. **[#18112](https://github.com/QwenLM/qwen-code/pull/18112)** — `feat(web-shell)`: Surface and control session scheduled tasks in-session. Inline pause/run-now/delete/stop for cron jobs and loop wakeups.

3. **[#18480](https://github.com/QwenLM/qwen-code/pull/18480)** — `perf(core)`: Persist prompt-time sidecar, bound cold scans, incremental transcript index. Targets repeated full-transcript rebuild storms.

4. **[#18452](https://github.com/QwenLM/qwen-code/pull/18452)** — `perf(daemon)`: Defer prompt ledger reads until after pagination. Addresses cold catalog request cost.

5. **[#18481](https://github.com/QwenLM/qwen-code/pull/18481)** — `fix(core)`: Point at the JSON error when a tool arg arrives as broken text. Improves model-facing validation errors with positional markers.

6. **[#17692](https://github.com/QwenLM/qwen-code/pull/17692)** — `feat(cli)`: Discover models during custom provider setup. Implements the most-requested config feature ([#17446](https://github.com/QwenLM/qwen-code/issues/17446)).

7. **[#18008](https://github.com/QwenLM/qwen-code/pull/18008)** — `feat(cli)`: Show daemon listener occupancy offline. Adds `qwen daemon status --offline` with JSON output.

8. **[#17471](https://github.com/QwenLM/qwen-code/pull/17471)** — `feat(managed-agent)`: Unify unbound Session authority under the ownership row. Stacked on #18478/#18468; part of a multi-PR refactor.

9. **[#18155](https://github.com/QwenLM/qwen-code/pull/18155)** — `feat(managed-agent)`: Confine selected Hosted Workspace Shell via Bubblewrap. Opt-in sandboxed shell with read-only private image.

10. **[#16439](https://github.com/QwenLM/qwen-code/pull/16439)** — `fix(core)`: Replay persisted startup prelude on resume. Ensures resumed sessions send the original prelude rather than rebuilding it.

---

## 5. Hot Discussions

*No discussion data was provided in the source dataset; this section is omitted.*

---

## 6. Feature Request Trends

- **Model/provider discovery**: Extending automatic model discovery to custom OpenAI/Anthropic-compatible endpoints ([#17446](https://github.com/QwenLM/qwen-code/issues/17446), [#17692](https://github.com/QwenLM/qwen-code/pull/17692)).
- **Provider preset expansion**: Adding newer third-party models (e.g., MiniMax-M3.1-Flash) to built-in presets ([#18482](https://github.com/QwenLM/qwen-code/pull/18482)).
- **Session management & scheduling**: In-session control of scheduled tasks, shared input history, and transcript pagination efficiency ([#18112](https://github.com/QwenLM/qwen-code/pull/18112), [#18424](https://github.com/QwenLM/qwen-code/pull/18424), [#17889](https://github.com/QwenLM/qwen-code/issues/17889)).
- **Managed Agent authority & hosting**: Unified session authority, workspace shell confinement, and host-supported Agent Team gating ([#17471](https://github.com/QwenLM/qwen-code/pull/17471), [#18155](https://github.com/QwenLM/qwen-code/pull/18155), [#18169](https://github.com/QwenLM/qwen-code/pull/18169)).
- **OAuth/MCP resilience**: Persistent re-auth for HTTP MCP servers rather than pinning tokens at connect time ([#15649](https://github.com/QwenLM/qwen-code/issues/15649)).

---

## 7. Developer Pain Points

- **Chronic CI instability**: The overwhelming majority of high-comment issues are automated main-branch CI failures—E2E Tests, Managed Agent gates, and `ClassSizeRatchetTest` repeatedly going red. Several are marked "provisional" and self-dismiss when a newer run passes, suggesting triage noise. [#17851](https://github.com/QwenLM/qwen-code/issues/17851) is explicitly flagged as *chronically* red independent of any PR.
- **Managed Agent / Hosted runtime reliability**: MySQL fault gates, failover E2E timeouts, and daemon E2E failures recur across [#18258](https://github.com/QwenLM/qwen-code/issues/18258), [#18287](https://github.com/QwenLM/qwen-code/issues/18287), and [#18307](https://github.com/QwenLM/qwen-code/issues/18307).
- **Transcript pagination performance**: `GET /session/:id/transcript` costs the same regardless of `limit`/`cursor` and blocks the Node event loop ([#17889](https://github.com/QwenLM/qwen-code/issues/17889)). Multiple perf PRs ([#18480](https://github.com/QwenLM/qwen-code/pull/18480), [#18452](https://github.com/QwenLM/qwen-code/pull/18452)) target this.
- **Context inflation / instruction burial**: Large system-reminders and memory catalogs pushing real instructions into the middle of 60KB+ messages, causing the model to miss tasks entirely ([#16259](https://github.com/QwenLM/qwen-code/issues/16259)).
- **Platform edge cases**: Android/Termux `os.cpus()` returning 0 causes `ratio=Infinity` and permanent 503 session rejection ([#18465](https://github.com/QwenLM/qwen-code/issues/18465)).
- **Silent data loss on session deletion**: Unreadable worktree sidecars can silently remove transcripts while leaving checkouts behind ([#18475](https://github.com/QwenLM/qwen-code/issues/18475)).

---

*Generated from GitHub activity on [QwenLM/qwen-code](https://github.com/QwenLM/qwen-code) for 2026-11-27.*

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*