# AI CLI Tools Community Digest 2026-10-22

> Generated: 2026-10-21 23:58 UTC | Tools covered: 7

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
**Date: 2026-10-22 | Coverage: Claude Code, OpenAI Codex, Gemini CLI, GitHub Copilot CLI, OpenCode, Pi, Qwen Code**

---

## 1. Ecosystem Overview

The AI CLI landscape on 2026-10-22 shows a category in **active maturation**, where core agent execution is largely solved but reliability, cross-platform correctness, and enterprise integration remain the battlegrounds. All seven tools are iterating rapidly — every project shipped a release or landed substantive PRs within 24 hours — yet the volume of P0/P1 issues across the board signals that **agent orchestration, session persistence, and subagent control are still fragile at scale**. A clear architectural split is emerging between **vendor-owned coding agents** (Claude Code, Codex, Gemini CLI, Copilot CLI, Qwen Code) optimizing for deep IDE/cloud integration, and **open/portable agents** (OpenCode, Pi) optimizing for provider breadth and terminal extensibility. Windows, corporate networking, and enterprise auth are recurring weak points across nearly every tracker, suggesting the ecosystem's center of gravity (macOS/Linux, consumer networks) still lags its actual enterprise deployment.

---

## 2. Activity Comparison

| Tool | Issues (updated 24h) | PRs (updated 24h) | Discussions | Release Status |
|---|---|---|---|---|
| **Claude Code** | High (~15 stale closures + multiple hot open bugs) | **1** (notable low) | N/A (none provided) | 2 patches in 24h (**v2.1.307**, **v2.1.306**) |
| **OpenAI Codex** | High (11+ hot issues, one at 61 comments) | High (~10, batch sweep via bot) | Active — 1 Idea (194 👍), several Q&A/Show&tell | 2 alphas (**v0.164.0-alpha.9**, **v0.163.0-alpha.11.1** hotfix) |
| **Gemini CLI** | High (10+ hot, multiple P1) | High (~10+) | N/A | 1 nightly (**v0.67.0-nightly.20261021**) |
| **GitHub Copilot CLI** | High (33 issues updated) | **1** (notable low) | N/A | 4 variants of **v1.0.102** (-0, -1, stable) |
| **OpenCode** | Very High (50 issues) | Very High (50 PRs) | N/A | **None** in 24h |
| **Pi** | High (~10 hot, many closed same-day) | High (~10+) | Active — Show&tell engagements | **v1.4.0** (image input for classifiers) |
| **Qwen Code** | High (10+ hot, P1 security bug) | High (~10) | N/A | **4 releases** incl. **v0.26.0**, desktop + CUA driver |

**Caveat:** Tools with Issues/PRs disabled upstream and Discussion-only channels would be marked "N/A" rather than "inactive" — in this dataset all seven maintain GitHub issue/PR trackers, so no repo is marked N/A on that basis. Discussion data was only provided for Codex and Pi; the rest show N/A for missing source data, **not** absent community activity.

**Notable observations:**
- **Claude Code** and **Copilot CLI** had anomalously low PR throughput (1 each) despite high issue volume — a possible triage/merge bottleneck worth watching.
- **OpenCode** leads raw activity volume (100 combined items) but shipped **no release**, indicating a large in-flight V1→V2 migration effort.
- **Qwen Code** shipped the most releases (4), reflecting aggressive Managed Agent iteration.

---

## 3. Shared Feature Directions

Requirements appearing across multiple tool communities, ranked by breadth of demand:

| Direction | Tools | Specific Needs |
|---|---|---|
| **Subagent reliability & observability** | Gemini CLI, Copilot CLI, Qwen Code, Claude Code | Hangs (#21409), false-success termination (#22323, #21983), missing subagent context in bug reports (#21763), model-id fallback wedging sessions (#5219), subagent isolation breaches (#15083) |
| **Remote / headless execution as first-class mode** | Codex, Claude Code, Pi | Headless + remote control from mobile (#9200, 194 👍; #49491, #50660); Remote Control persistence (#100694, #103872); Pi's cloud 24/7 (#11214) |
| **Context/token efficiency & compaction control** | Gemini CLI, Copilot CLI, OpenCode, Pi, Qwen Code | AST-aware reads (#22745); configurable compaction thinking level (#7553); compression budget accounting (#14953); MCP schema deferral (#49645); compaction timeouts (#5054) |
| **Enterprise auth, proxy & MCP hardening** | Codex, Copilot CLI, Qwen Code | Confidential OAuth for enterprise MCP (#56001); MITM credential scoping (#56003); Windows proxy CONNECT/NTLM (#56000); corporate VPN voice catalog (#3636); OAuth persistence in ACP (#5192) |
| **Cancellation/signal correctness** | Gemini CLI, Pi, Copilot CLI | Continuing work after `Escape`/SIGINT (#29868, #29849); subagent cancellation on network change (#57538) |
| **Cross-platform (esp. Windows) stability** | Codex, Claude Code, Pi, Copilot CLI, OpenCode | Desktop install/lag/viewport (#53132, #51870, #55795); CRLF-on-Linux (#2805); Windows TUI redraw (#6300); sandbox non-system drives (#5207); phantom console windows (#57907) |
| **MCP configuration ergonomics** | Codex, OpenCode, Gemini CLI | `${ENV_VAR}` expansion (#2680); deferred schema loading (#49645); disable-and-persist failed MCP servers (#56452) |
| **Session durability & migration safety** | Claude Code, OpenCode, Qwen Code | Archived chat loss (#22931); V1→V2 silent message drops (#53971); durable session lifecycle (#15100) |
| **Safety guardrail observability** | Claude Code, Gemini CLI, Pi | `claude_code.safety_event` OTel (#307); zero-dependency sandboxing (#19873); discourage destructive commands (#22672) |
| **Keyboard/input ergonomics** | Copilot CLI, Pi, Claude Code | vi/vim mode (#13, closed, 76 👍); fullscreen mouse opt-out (#8913); non-ASCII autocomplete (#81156) |

**Cross-cutting signal:** *Compaction, compromise of agent visibility, and enterprise MCP auth* appear in **five or more** trackers independently — these are ecosystem-level gaps, not single-project bugs.

---

## 4. Differentiation Analysis

| Dimension | Claude Code | Codex | Gemini CLI | Copilot CLI | OpenCode | Pi | Qwen Code |
|---|---|---|---|---|---|---|---|
| **Owner model** | Vendor (Anthropic) | Vendor (OpenAI) | Vendor (Google) | Vendor (GitHub) | Open/portable | Open/portable | Vendor (Alibaba) |
| **Primary user** | Individual devs + teams | Desktop + enterprise | Developer-focused | GitHub-integrated orgs | Power users, multi-provider | Terminal-first tinkerers | Enterprise + Managed Agent |
| **Differentiator** | Observability (`safety_event` OTel), guardrails | Remote/headless & enterprise OAuth depth | Sandbox/IDE bridging, AST-aware context | GitHub ecosystem + BYOK | 100+ activity items, provider breadth, TUI extensibility | Terminal/extension composability, Windows parity focus | Managed Agent, CUA driver, surface breadth |
| **Weakest surface** | Triage throughput, Windows/MSIX, quota parity | Windows desktop cluster, Dots/sidebar regressions | Subagent unreliability, cancellation | Proxy/enterprise policy over-reach | V1→V2 migration, Windows ports | Windows terminal stack, gateway protocol drift | Security controls, daemon OOM |
| **Technical approach** | Tight OTel/hook integration | Rust core + desktop app | ACP + container bridges | GitHub-native, ACP mode | Provider-agnostic, GUI + TUI | Extension-centric, multi-package | Managed Agent + desktop + CUA |

**Key contrast:** Vendor tools (Claude, Codex, Gemini, Copilot, Qwen) are racing to **integrate deeper** into existing workflows (IDEs, clouds, auth), while open tools (OpenCode, Pi) are racing to **abstract across** providers and surfaces. The former fight integration bugs; the latter fight consistency and portability bugs.

---

## 5. Community Momentum & Maturity

**Highest raw activity:**
- **OpenCode** — 50 issues + 50 PRs updated; largest migration effort underway (V1→V2). Momentum high but maturity currently strained by migration fallout.
- **Codex** — dominant single-thread engagement (#55744, 130 👍, 61 comments); most-upvoted discussion in the entire set (#9200, 194 👍). Strong signal of unmet demand.
- **Claude Code** — high issue engagement (#2805 at 53 comments) but **anomalously low PR throughput (1)** — a triage throughput concern.

**Fastest iterating:**
- **Qwen Code** — 4 releases in 24h (stable + nightly + desktop + CUA driver); aggressive Managed Agent feature cadence.
- **Codex** — 2 alphas + hotfix; substantial internal PR sweep (MITM, OAuth, Windows proxy).
- **Claude Code** — 2 patches in 24h, with a maturity-positive shift toward observability (`safety_event` OTel).

**Most mature triage cadence:**
- **Pi** — many P0s closed within hours of filing (#11075, #11062, #11058, #11203, #11227); responsive maintainers, though recurring P0 regressions suggest the transcript-as-source-of-truth model needs hardening.

**Most fragile:**
- **Claude Code** — reproduced issues being **aged out as stale** (#81694 on its 6th report); triage fatigue is a community complaint.
- **Copilot CLI** — proxies/enterprise policy over-reach and low PR throughput vs. high issue volume.

**Momentum ranking (qualitative):** OpenCode ≈ Codex > Qwen Code > Pi > Gemini CLI > Claude Code > Copilot CLI (on PR/merge velocity).

---

## 6. Trend Signals

Distilled for technical decision-makers:

1. **Subagent orchestration is the #1 unsolved problem across the ecosystem.** False-success termination (Gemini), isolation breaches (Qwen), model-cap wedging (Copilot), and silent cancellation (OpenCode) all point to insufficient lifecycle guarantees. **Developers building on these tools should assume subagent reliability is not yet production-grade.**

2. **"Remote/headless as a first-class mode" is the clearest upvoted direction** (Codex #9200 at 194 👍). Expect vendor investment here — the demand is already being met with DIY Tailscale/SSH workarounds.

3. **Context economics is now a primary design axis.** Every tool is investing in AST-aware reads, compaction tuning, MCP schema deferral, and token-accounting accuracy. **Budget transparency (quota parity, cost reporting) is emerging as a trust issue** (Claude Code #97074, OpenCode #42985).

4. **Enterprise surface area is outgrowing stability.** Proxy/NTLM, confidential OAuth, MITM scoping, registry-only MCP policy — these are being added faster than they hardened. **Org adopters should validate proxy/auth paths explicitly.**

5. **Windows is systematically under-tested.** Six of seven tools have coherent Windows bug clusters. **Teams standardizing on Windows should expect friction and budget for workarounds.**

6. **Observability is converging on OpenTelemetry.** Claude Code's `safety_event` and Codex's best-effort OTEL startup signal that **auditable guardrail telemetry is becoming table stakes** — relevant for any org needing agent compliance trails.

7. **Migration and data-durability risks are real.** OpenCode's V1→V2 silent drops (#53971) and Claude Code's archived-chat loss (#22931) are a reminder that **CLI session state is not yet a durable system of record** — do not rely on it as one.

**Bottom line for evaluators:** the ecosystem is moving fast and broadly, but **no tool is yet reliable across all axes** (Windows, enterprise auth, subagents, migration safety). Selection should be driven by *which weakness maps to your deployment context* rather than by headline feature parity.

---

## Per-Tool Reports

<details>
<summary><strong>Claude Code</strong> — <a href="https://github.com/anthropics/claude-code">anthropics/claude-code</a></summary>

## Claude Code Skills Highlights

> Source: [anthropics/skills](https://github.com/anthropics/skills)

# Claude Code Skills — Community Highlights Report
*Data snapshot: 2026-10-22 | Source: github.com/anthropics/skills*

---

## 1. Top Skills Ranking

> Note: The PR dataset reports `Comments: undefined` across all entries, so ranking below is inferred from issue-linked discussion volume, update recency, and cross-referencing with high-comment Issues. Where a PR maps directly to a heavily-discussed Issue, that Issue's comment count is cited as the attention proxy.

| # | Skill / PR | Functionality | Discussion Highlights | Status |
|---|---|---|---|---|
| 1 | **skill-creator hardening** — [PR #1961](https://github.com/anthropics/skills/pull/1961) | Security hardening of the eval viewer (`generate_review.py`, `viewer.html`): script breakout, DNS rebinding, cross-site POST, escaping | Ties directly to [Issue #1394](https://github.com/anthropics/skills/issues/1394) (XSS in `escapeHtml`) and the broader skill-creator reliability cluster [#1383](https://github.com/anthropics/skills/issues/1383), [#202](https://github.com/anthropics/skills/issues/202) | OPEN |
| 2 | **mcp-builder fixes** — [PR #1742](https://github.com/anthropics/skills/pull/1742) | Adapts `connections.py` to `mcp>=2.0.0` rename (`streamable_http_client`) and header config via `create_mcp_http_client` | Linked to [#1668](https://github.com/anthropics/skills/issues/1668); companion bug [#1390](https://github.com/anthropics/skills/issues/1390) (eval fabricates tool errors, scores 0/N) | OPEN |
| 3 | **document-typography** — [PR #514](https://github.com/anthropics/skills/pull/514) | Typographic QC for AI-generated docs: orphan/widow control, numbering alignment | Long-lived (Mar–present); reflects the high-traffic docx/pdf skill line and recurring output-quality complaints | OPEN |
| 4 | **notion-spec-to-implementation** — [PR #1245](https://github.com/anthropics/skills/pull/1245) | Turns product/tech specs into actionable Notion tasks with acceptance criteria & progress tracking | Bundled with a resume-auditor skill; representative of the "workflow automation" demand seen in [#228](https://github.com/anthropics/skills/issues/228) | OPEN |
| 5 | **proofcore-contract-auditor** — [PR #1771](https://github.com/anthropics/skills/pull/1771) | Static analysis of Solidity/Rust contracts + Merkle audit proofs anchored to TON | Web3 vertical; notable for on-chain notarization angle | OPEN |
| 6 | **md2video-audio** — [PR #1703](https://github.com/anthropics/skills/pull/1703) | Markdown → Marp slides → MP4 with voiceover | Zero-cost media pipeline; competes with existing video skills | OPEN |
| 7 | **pyxel** — [PR #525](https://github.com/anthropics/skills/pull/525) | Retro game dev/debug/verify with headless input-driven runs + frame inspection | Long-running (Mar–Sep); niche but persistent | OPEN |
| 8 | **scnet-hpc** — [PR #1615](https://github.com/anthropics/skills/pull/1615) | SCNet HPC cluster ops via profile-based SSH + Slurm workflows | Domain-specific infra skill; short update window | OPEN |

**Companion fix PRs worth tracking** (all OPEN): [PR #1997](https://github.com/anthropics/skills/pull/1997) (YAML frontmatter parsing), [PR #1980](https://github.com/anthropics/skills/pull/1980) (`shell=True` CWE-78), [PR #1977](https://github.com/anthropics/skills/pull/1977) / [PR #1976](https://github.com/anthropics/skills/pull/1976) (algorithmic-art & element_discovery), [PR #1792](https://github.com/anthropics/skills/pull/1792) (LibreOffice timeout handling), [PR #1730](https://github.com/anthropics/skills/pull/1730) (dead doc URLs).

---

## 2. Community Demand Trends (from Issues)

Distilled from the 15 top-commented Issues:

1. **Security & trust boundaries** — Issue [#492](https://github.com/anthropics/skills/issues/492) (46 comments, the single hottest thread): community skills shipping under the `anthropic/` namespace impersonate official skills. Recurring XSS/escaping concerns ([#1394](https://github.com/anthropics/skills/issues/1394)) and injection risk ([PR #1980](https://github.com/anthropics/skills/pull/1980)) reinforce this.
2. **Org-wide skill distribution** — Issue [#228](https://github.com/anthropics/skills/issues/228) (17 comments, 👍8): users want a shared org library instead of manual `.skill` file exchange via Slack.
3. **Eval/trigger reliability** — Issue [#556](https://github.com/anthropics/skills/issues/556) (13 comments): `run_eval.py` reports 0% trigger rate; [#1383](https://github.com/anthropics/skills/issues/1383), [#1390](https://github.com/anthropics/skills/issues/1390) echo the same failure mode. This is the loudest *technical* demand.
4. **Context-budget discipline** — Issue [#1487](https://github.com/anthropics/skills/issues/1487): `claude-api` injects ~156k tokens in one call. Broader ask via [#202](https://github.com/anthropics/skills/issues/202): skills should be operational, not educational.
5. **Packaging correctness** — Issue [#189](https://github.com/anthropics/skills/issues/189) (👍9): `document-skills` and `example-skills` install identical content → duplicate context.
6. **Governance & agent safety** — Issues [#412](https://github.com/anthropics/skills/issues/412) (agent-governance: policy, threat detection, audit) and [#1385](https://github.com/anthropics/skills/issues/1385) (three-gate reasoning quality pipeline).
7. **Memory/state compression** — Issue [#1329](https://github.com/anthropics/skills/issues/1329): `compact-memory` symbolic notation for agent state.

**Emerging directions not yet at scale:** code review, test generation, and documentation skills — implicit in spec-to-implementation and governance proposals, but no dedicated high-comment thread yet.

---

## 3. High-Potential Pending Skills

Active-comment PRs not yet merged, most likely to land soon:

- **[PR #1961](https://github.com/anthropics/skills/pull/1961)** — skill-creator eval viewer hardening. Highest leverage: closes three CVEs at once.
- **[PR #1997](https://github.com/anthropics/skills/pull/1997)** — YAML frontmatter scalar parsing. Small surface, high correctness impact for every downstream eval.
- **[PR #1980](https://github.com/anthropics/skills/pull/1980)** — remove `shell=True` in `with_server.py` (CWE-78).
- **[PR #1742](https://github.com/anthropics/skills/pull/1742)** — mcp-builder `mcp>=2` compatibility (author Kuldeeep18 also filed [PR #1681](https://github.com/anthropics/skills/pull/1681), indicating sustained drive).
- **[PR #1792](https://github.com/anthropics/skills/pull/1792)** — docx timeout handling + output verification.
- **[PR #1977](https://github.com/anthropics/skills/pull/1977)** & **[PR #1976](https://github.com/anthropics/skills/pull/1976)** — small, correct bug fixes from gerardrecinto; both reference resolved Issues (#1897, #1891).
- **[PR #1730](https://github.com/anthropics/skills/pull/1730)** — dead-URL cleanup; low risk, likely fast merge.
- **[PR #514](https://github.com/anthropics/skills/pull/514)** — document-typography (long-lived, high applicability if reviewers engage).

---

## 4. Skills Ecosystem Insight

**One-sentence summary:** The community's most concentrated demand is not new skill *capabilities* but **making the existing skill infrastructure trustworthy and self-consistent** — secure eval tooling, correct packaging and distribution, accurate trigger testing, and bounded context injection — so that security (Issue #492) and reliability (Issues #556, #1383, #1394, #1487) are currently the governing constraints on adoption, ahead of any new vertical domain.

---

# Claude Code Community Digest — 2026-10-22

## 1. Today's Highlights

Anthropic shipped two patch releases in 24 hours: **v2.1.307** introduces a new `/claude-api api-version` migration command and a `claude_code.safety_event` OpenTelemetry event for tool-call safety enforcement, while **v2.1.306** fixes a cloud-session auth bug and a misleading "prompt is too long" error in MCP-heavy sessions. Meanwhile, a wave of stale-bot closures (roughly 15 issues) dominated the update feed, contrasted against several high-engagement open bugs — notably the 53-comment CRLF-on-Linux issue and a 43-comment data-loss report about archived Cowork chats. Platform-specific pain around Desktop auto-updates and Remote Control session persistence continues to accumulate.

## 2. Releases

**v2.1.307**
- Added `/claude-api api-version` to migrate Claude API code to API version `2026-10-21`.
- Added `claude_code.safety_event` OpenTelemetry event, emitted whenever a tool call is stopped, prompted, or sent back by a permission rule, auto mode, safety check, hook, or sandbox. This is a notable win for teams building observability around agent guardrails.
- Fixed a request-related issue (truncated in release notes).

**v2.1.306**
- Fixed `claude -p` inside cloud sessions reporting "Not logged in" when started without the session's environment variables.
- Fixed an API error being masked by "prompt is too long," which also triggered unnecessary compaction in sessions with many MCP tools.

## 3. Hot Issues

1. **[#2805](https://github.com/anthropics/claude-code/issues/2805)** — *CRLF line endings written on Linux* (53 comments, 39 👍). The single most-commented open issue: Claude Code writes Windows line endings on Ubuntu despite CLAUDE.md instructions, breaking shell script execution. Long-lived (since July 2025) and still unresolved — a persistent correctness bug for Linux users.
2. **[#22931](https://github.com/anthropics/claude-code/issues/22931)** — *Archived Cowork chats vanish* (43 comments, 38 👍). Archived chats are unrecoverable — effectively a data-loss report. High reaction count signals broad concern about chat persistence guarantees.
3. **[#97074](https://github.com/anthropics/claude-code/issues/97074)** — *Headless `claude -p` burns ~1.8× the 5-hour window per token vs interactive* (10 comments). A cost-parity discrepancy with a repro; directly impacts CI/SDK users' quota budgeting.
4. **[#97729](https://github.com/anthropics/claude-code/issues/97729)** — *Desktop: in-app browser for SSH remote sessions* (10 👍). Feature request with clear traction; remote developers want browser parity with local sessions.
5. **[#103851](https://github.com/anthropics/claude-code/issues/103851)** — *Cloud routines don't load repo-committed `.claude/skills/`* (4 comments). Hooks and settings.json load, skills don't — an inconsistency that undermines team-shared skill distribution.
6. **[#87891](https://github.com/anthropics/claude-code/issues/87891)** — *Background daemon leaks workers: 64 processes / ~7.1 GB after six weeks* (6 👍). Stale workers re-adopted on every restart; a serious long-running resource leak on macOS.
7. **[#103823](https://github.com/anthropics/claude-code/issues/103823)** — *Linux sandbox mounts fake files over protected paths, breaking `git add .`* (3 comments). Sandbox implementation detail leaking phantom character devices into the workspace and confusing the agent.
8. **[#100576](https://github.com/anthropics/claude-code/issues/100576)** — *Windows MSIX auto-update force-kills Desktop, destroying active sessions* (~every 2 days). Update mechanism trades safety for session continuity; recurring and disruptive.
9. **[#93121](https://github.com/anthropics/claude-code/issues/93121)** — *Windows Desktop pins a full CPU core during agent work, freezing the app*. Reproduces across two versions — a significant Electron performance regression.
10. **[#103872](https://github.com/anthropics/claude-code/issues/103872)** — *Remote Control not restored when a macOS Code session goes idle* (iOS companion). Session vanishes from iOS until a message is sent on the Mac — notable given the cluster of Remote Control issues this week (#100694, #103872).

**Stale-bot note:** ~15 issues were closed by the stale bot today, several with reproductions (e.g., #84124 statusLine concurrency, #83947 plugin update naming, #81694 shell snapshot `cd` failure — "6th report since Jan"). The volume of reproduced-but-stale closures is itself a signal about triage throughput.

## 4. Key PR Progress

Only **one PR** was updated in the last 24 hours, so the usual top-10 list is not possible:

1. **[#21459](https://github.com/anthropics/claude-code/pull/21459)** — *feat(hookify): add `glob_match` support and case sensitivity control* (OPEN since 2026-01-28). Adds glob-pattern rule matching (`*.py`) as a simpler alternative to regex and a `case_sensitive` option for rules. Despite being open ~9 months, it addresses a real ergonomics gap in hookify rule authoring — worth watching for whether maintainers pick it up.

## 5. Hot Discussions

No Discussions data was provided in the source dataset; this section is omitted.

## 6. Feature Request Trends

Distilled from the issue set:

- **Remote/SSH session parity** — in-app browser for SSH remote sessions (#97729), plus a cluster of Remote Control persistence requests (#100694, #103872). Remote-first workflows are clearly under-served.
- **Cloud/team artifact consistency** — repo-committed `.claude/skills/` not loading in cloud routines (#103851) points to demand for deterministic, version-controlled agent configuration across local and cloud execution.
- **Safety/observability hooks** — the new `claude_code.safety_event` OTel event (v2.1.307) validates the community's push for auditable guardrail telemetry.
- **Accessibility & UX polish** — read-aloud final-answer-only option (#98977), non-ASCII slash command autocomplete (#81156), and Gujarati text rendering (#81665) show a steady stream of i18n and accessibility requests.
- **Rule authoring ergonomics** — PR #21459's glob matching reflects desire for simpler-than-regex configuration.

## 7. Developer Pain Points

- **Cross-platform correctness gaps**: CRLF-on-Linux (#2805) remains the flagship frustration — explicit CLAUDE.md instructions are ignored, breaking script execution.
- **Data & session durability**: archived Cowork chat loss (#22931) and repeated Remote Control/session loss after Desktop updates (#100576, #100694, #103872) erode trust in session state.
- **Cost/quota transparency**: headless mode consuming ~1.8× quota per token (#97074) is a budgeting hazard for automation users.
- **Resource leaks & performance**: daemon process/GB leaks (#87891) and full-core CPU pinning on Windows (#93121) hurt long-running users.
- **Sandbox side effects**: fake files over protected paths breaking `git add .` (#103823) shows sandboxing leaking into observable workspace state.
- **Triage fatigue**: a large batch of *reproduced* issues closed as stale (e.g., #81694 on its 6th report) suggests unresolved bugs are being aged out rather than fixed — a recurring community complaint.

</details>

<details>
<summary><strong>OpenAI Codex</strong> — <a href="https://github.com/openai/codex">openai/codex</a></summary>

# OpenAI Codex Community Digest — 2026-10-22

## 1. Today's Highlights

The Codex desktop app is in a rough patch: a **macOS serialization bug (#55744, 130 👍)** is now the single most-engaged issue in the tracker, with 61 comments in a day. On the infra side, a large batch of merged PRs landed around **message-board extraction, MITM credential scoping, Windows proxy auth, and OAuth for enterprise MCP**, while a **0.163.0-alpha.11.1 hotfix** shipped for rustls/webpki and Rust 1.99.1 compatibility. Community sentiment is dominated by **Windows desktop instability** and **Dots/sidebar regressions** across both macOS and Windows.

---

## 2. Releases

Two alpha releases in the last 24h:

- **`rust-v0.164.0-alpha.9`** — routine alpha cut. [Release](https://github.com/openai/codex/releases)
- **`rust-v0.163.0-alpha.11.1`** — hotfix prepared in [PR #55966](https://github.com/openai/codex/pull/55966). Backports: **`rustls-webpki` + `webpki-roots` update (#55616)** and **Rust 1.99.1 compatibility fixes (#55677)**.

Nothing user-facing; treat these as toolchain/dependency maintenance.

---

## 3. Hot Issues

1. **[#55744 — macOS 26.1016.51333: new chats fail with "Cannot serialize value"](https://github.com/openai/codex/issues/55744)** — 61 comments, 130 👍. New chats are completely broken on first message for macOS users. Highest-signal regression of the day; strongly suggests an app-server serialization regression in the latest desktop build.
2. **[#49453 — Browser access blocked by stale chat-level denial](https://github.com/openai/codex/issues/49453)** — 32 comments. Once a chat denies a site, re-allowing it does not clear the denial. Windows browser tooling effectively bricks localhost workflows.
3. **[#29915 — Permission/approval mode not persisted per thread](https://github.com/openai/codex/issues/29915)** — 28 comments, open since June. Long-standing UX bug: approval mode resets for new and resumed threads, forcing repeated reconfiguration.
4. **[#50168 — `cloud_threads` write path returns UNKNOWN / CloudThreadNotFoundError](https://github.com/openai/codex/issues/50168)** — 26 comments. Dot ↔ Codex Cloud interoperability failure: reads work, writes don't. Blocks any automation built on Codex Cloud tasks.
5. **[#17541 — Azure: model switch mid-conversation fails to decrypt](https://github.com/openai/codex/issues/17541)** — 14 comments, 10 👍. Azure customers can't switch models mid-thread ("encrypted content could not be decrypted"). High-impact for enterprise Azure deployments.
6. **[#53425 — macOS built-in browser visible but runtime says `Browser is not available: iab`](https://github.com/openai/codex/issues/53425)** — 13 comments. Agent can see ambient tab context but cannot discover the browser. Breaks agentic browser workflows on macOS.
7. **[#54924 — Windows: OpenAI Developers install fails "OAuth state not found"](https://github.com/openai/codex/issues/54924)** — 11 comments, 8 👍. Onboarding blocker for Windows users installing the Developers bundle.
8. **[#55795 — Windows: Dots entry disappears after 26.1016.51333 update](https://github.com/openai/codex/issues/55795)** — 10 comments. Paired with the macOS equivalent **#55783** (Dot missing from sidebar). Looks like a cross-platform Dots regression in the same build.
9. **[#53132 — Windows MSIX install fails 0x80073CF6 / 0x80070005](https://github.com/openai/codex/issues/53132)** — 10 comments. Stale packaged service registration blocks install/upgrade; users are stuck on old builds.
10. **[#51870 — Windows app still laggy in latest update](https://github.com/openai/codex/issues/51870)** — 7 comments, Pro 10x reporter. Persistent performance regression; corroborated by scroll/viewport bugs **#55025** and **#55612**.

Also worth watching: **[#17003 — detect dead WebSockets faster](https://github.com/openai/codex/issues/17003)** (agent shows "Working" up to 5 min after network change) and **[#55805 — intermittent 429s at 88–90% allowance](https://github.com/openai/codex/issues/55805)** (possible rate-limit accounting issue).

---

## 4. Key PR Progress

The last 24h is dominated by a `copyberry[bot]` batch — clearly an internal sweep of reliability, security, and refactor work.

1. **[#56011 — Distinct rollout trace terminal sessions on PID reuse](https://github.com/openai/codex/pull/56011)** — prevents merged/misattributed `write_stdin` calls when OS recycles process handles. Tracing correctness.
2. **[#56003 — Scope MITM credential substitution to trusted origins](https://github.com/openai/codex/pull/56003)** — security hardening: prevents project config from redirecting trusted credential policies. Important for anyone running Codex behind a MITM proxy.
3. **[#56001 — Confidential OAuth clients for enterprise-managed MCP auth](https://github.com/openai/codex/pull/56001)** — unlocks IdPs that require client secrets, previously impossible with public-client-only flow. Big for enterprise MCP.
4. **[#56000](https://github.com/openai/codex/pull/56000) / [#55994](https://github.com/openai/codex/pull/55994) — Windows proxy CONNECT 407 retry with Negotiate/NTLM** — fixes corporate proxy auth for HTTPS and WebSocket traffic on Windows.
5. **[#55991 — Avoid double-counting retained reasoning in token usage](https://github.com/openai/codex/pull/55991)** — prevents premature auto-compaction triggered by inflated usage on Responses Lite.
6. **[#55970 — Extract `codex-message-board` crate](https://github.com/openai/codex/pull/55970)** — refactor moving board API, storage, and tools into a shared crate; follow-ups **#55971** (storage namespaces) and **#55973** (tool subset selection) build on it.
7. **[#55968 — Back off failed cloud skill/plugin catalog refreshes](https://github.com/openai/codex/pull/55968)** — adds cooldown across steps/turns, avoiding retry storms when a provider is down.
8. **[#55975 — `codex migrate-nfs-db` to DELETE journal mode](https://github.com/openai/codex/pull/55975)** — addresses SQLite WAL incompatibility on NFS; keeps originals as backups. Directly relevant to networked/devcontainer setups.
9. **[#30601 — Make app-server OTEL startup best-effort](https://github.com/openai/codex/pull/30601)** — bad `OTEL_EXPORTER_OTLP_COMPRESSION` values no longer kill app-server before `initialize`. Quiet but important reliability fix.
10. **[#55966 — Prepare 0.163.0-alpha.11.1 hotfix](https://github.com/openai/codex/pull/55966)** — the release vehicle for the webpki/Rust compatibility backports noted above.

---

## 5. Hot Discussions

### Ideas
- **[#9200 — Remote-control Codex from the ChatGPT app](https://github.com/openai/codex/discussions/9200)** — 52 comments, **194 👍**. By far the most-upvoted idea: run Codex headless on a desktop/laptop, control from mobile. Users are already doing this with Tailscale + SSH; they want a first-class UI.

### General
- **[#1076 — Resuming a previous session](https://github.com/openai/codex/discussions/1076)** — 20 comments. Persistent confusion about `codex --history` and auto-mode session resume. Documentation gap as much as a feature gap.
- **[#42049 — Bundled-marketplace refresh leaks staging dirs (~31 GiB)](https://github.com/openai/codex/discussions/42049)** — 323 abandoned `~/.codex/.tmp/bundled-marketplaces/*.staging-*` directories. Disk exhaustion on macOS.

### Q&A
- **[#42848 — ChatGPT Sites + D1 + Drizzle: which migration applies?](https://github.com/openai/codex/discussions/42848)** — unclear migration semantics for Sites-managed D1 bindings.
- **[#56010 — Expose stdio MCP ownership/lifecycle in Desktop](https://github.com/openai/codex/discussions/56010)** — no supported way to inspect which Desktop session owns a local stdio MCP process.
- **[#55820 — Windows desktop freeze workaround: `cua_node` runtime caches](https://github.com/openai/codex/discussions/55820)** — user-verified recovery for #49611-class freezes after updates.
- **[#55792 — Windows desktop: review path when `/approve` is missing](https://github.com/openai/codex/discussions/55792)** — no supported way to request human reconsideration after auto-approval rejection.

### Show and tell
- **[#55421 — TAHU: authorization gateway prototype, seeking 3 trials](https://github.com/openai/codex/discussions/55421)** — Python gateway exploring "answer without leaking staff notes."
- **[#55203 — Two agent skills from a failure log](https://github.com/openai/codex/discussions/55203)** — "done needs evidence" and "stop after two identical failures." Practical, portable agent-skill patterns.
- **[#55901 — GFT Map](https://github.com/openai/codex/discussions/55901)** — local skill/panel for carrying project decisions across chats.
- **[#55643 — Kingdoms in Turnfeed](https://github.com/openai/codex/discussions/55643)** — conversational strategy prototype with a persistent map beside the chat.
- **[#56015 — DeckDelta](https://github.com/openai/codex/discussions/56015)** — local PDF slide-deck diff with visible uncertainty.
- **[#55942 — Calendar tracker for the 28-day reset challenge](https://github.com/openai/codex/discussions/55942)** — community dashboard tracking shipped improvements/resets.

---

## 6. Feature Request Trends

- **Remote / headless execution as a first-class mode** — Discussions **#9200**, **#50660**, and Issue **#49491** all converge on the same ask: authorize a headless Linux server as a task environment for a Dot, controllable from the ChatGPT/Codex app. This is the clearest, most-upvoted direction in the tracker.
- **MCP configuration ergonomics** — **#2680** (`${ENV_VAR}` expansion in MCP config) and **#46244** (no way to pass env vars to `http_headers_helper` because `env_clear` strips everything). Secrets currently have to be hard-coded or the helper can't be used at all.
- **Enterprise auth depth** — Azure model-switching (**#17541**), confidential OAuth clients for MCP (**#56001**), and Windows OAuth/token-exchange failures (**#54924**, **#47343**) point to a growing enterprise surface that needs hardening.
- **Cross-chat continuity and memory** — Discussions **#1076** (resume) and **#55901** (GFT Map) reflect demand for durable project context across sessions.

---

## 7. Developer Pain Points

1. **Windows desktop reliability is the dominant complaint cluster.** Install failures (#53132), lag (#51870), viewport jumps (#55025, #55612), missing dictation (#54064), token exchange (#47343), 429s (#55805), and disappearing Dots (#55795). This is more Windows app issues than any other category combined.
2. **Dots/sidebar regressions in build 26.1016.51333.** #55795 (Windows) and #55783 (macOS) landed the same day, plus the closed #54923 — a same-build regression across platforms.
3. **Approval and permission state is unreliable.** #29915 (mode not persisted), #49453 (denial not revocable), #55792 (no `/approve` path). Users repeatedly re-authorize or get stuck.
4. **Serialization/decryption failures break sessions.** #55744 (cannot stringify value), #17541 (encrypted content could not be decrypted). These hard-fail the session rather than degrading.
5. **Cloud/Dot interoperability is write-broken.** #50168: reads succeed, writes fail with `UNKNOWN` / `CloudThreadNotFoundError` — blocks any tooling on top of Codex Cloud tasks.
6. **Disk and resource hygiene.** #42049 (~31 GiB of leaked staging dirs) and #55975 (NFS/WAL migration) show storage lifecycle still needs attention.
7. **Connectivity detection latency.** #17003: up to 5 minutes of a false "Working" state after network changes — painful for laptop/mobile workflows, which is exactly the #9200 remote-control use case.

**Takeaway for maintainers:** the highest-leverage fixes this week are the macOS serialization regression (#55744) and the Windows desktop stability cluster; the highest-leverage feature investment remains remote/headless Dot execution (#9200, #49491, #50660).

</details>

<details>
<summary><strong>Gemini CLI</strong> — <a href="https://github.com/google-gemini/gemini-cli">google-gemini/gemini-cli</a></summary>

# Gemini CLI Community Digest — 2026-10-22

## 1. Today's Highlights

Agent reliability remains the dominant theme this cycle, with multiple P1 bugs around subagent hangs, false-success termination reporting, and cancellation handling in both interactive and headless modes. The nightly `v0.67.0-nightly.20261021` landed a `gsutil → gcloud storage` migration and a fix preserving user-level `~/.gitconfig` in shell environments. Meanwhile, a cluster of PRs targeting tool-output truncation in ACP mode and sandbox/IDE bridging signals continued investment in non-standard runtime environments (containers, Android/Termux, Wayland).

## 2. Releases

**v0.67.0-nightly.20261021.gd00859d6b** — Nightly release (PR #29860)
- `chore: migrate gsutil usage to gcloud storage` ([PR #29839](https://github.com/google-gemini/gemini-cli/pull/29839)) — modernizes storage tooling, removing the deprecated `gsutil` dependency.
- `fix(core): preserve user-level ~/.gitconfig in shell and git environments` ([PR #29832](https://github.com/google-gemini/gemini-cli/pull/29832)) — prevents the CLI from masking a user's global Git identity/aliases inside sandboxed shell invocations.

No stable release in the last 24h.

## 3. Hot Issues

1. **[#22323](https://github.com/google-gemini/gemini-cli/issues/22323) — Subagent reports GOAL success after hitting MAX_TURNS** (P1, 13 comments). A `codebase_investigator` subagent claims `status: "success"` / `Termination Reason: "GOAL"` even though it exhausted its turn budget before analyzing anything. This is a correctness-of-signal problem: callers can't distinguish "done" from "gave up," which is dangerous for automated pipelines. High comment volume suggests maintainers are actively triaging.

2. **[#21409](https://github.com/google-gemini/gemini-cli/issues/21409) — Generalist agent hangs indefinitely** (P1, 8 comments, 👍8). The single most-upvoted issue in this batch: whenever the CLI defers to the generalist subagent, simple tasks like folder creation hang for up to an hour. Workaround (disabling subagent deferral) confirms the delegation path is the culprit. Strong community signal.

3. **[#21983](https://github.com/google-gemini/gemini-cli/issues/21983) — Browser subagent fails on Wayland** (P1, agent/browser). Reports a spurious `GOAL` termination despite failure — the same false-positive pattern as #22323, now on Linux/Wayland. Matters for Linux desktop users where Wayland is the default.

4. **[#21763](https://github.com/google-gemini/gemini-cli/issues/21763) — Bug reports omit subagent context** (P1). `/bug` reports capture only the main session, making subagent failures nearly undebuggable. This compounds #22323/#21983 by removing the diagnostic trail.

5. **[#22186](https://github.com/google-gemini/gemini-cli/issues/22186) — `get-shit-done` output hook crashes CLI** (P1, effort/medium). Crash occurs during final summary printing, i.e., after substantial work is done. Wasted compute plus lost output.

6. **[#19873](https://github.com/google-gemini/gemini-cli/issues/19873) — Zero-dependency OS sandboxing + post-execution intent routing** (P2, 9 comments, effort/large). Proposes letting Gemini lean into its native bash affinity while containing risk via sandboxing and intent routing. A strategic design issue that touches security, UX, and model capability.

7. **[#21968](https://github.com/google-gemini/gemini-cli/issues/21968) — Model under-uses skills and subagents** (P2). Anecdotal but widely felt: Gemini only invokes custom skills/subagents when explicitly told. Directly undermines the extensibility story the team is building.

8. **[#24246](https://github.com/google-gemini/gemini-cli/issues/24246) — 400 error with >128 tools** (P2). Agent isn't smart about scoping enabled tools; large MCP/skill setups blow the request. Scaling problem as the tool ecosystem grows.

9. **[#22672](https://github.com/google-gemini/gemini-cli/issues/22672) — Agent should discourage destructive behavior** (P2). Reports of `git reset` / `--force` where safer alternatives exist. Safety-adjacent and likely to attract more attention as agent autonomy increases.

10. **[#22745](https://github.com/google-gemini/gemini-cli/issues/22745) — AST-aware file reads, search, and codebase mapping** (P2, EPIC). Tracks investigations into reducing token noise and misaligned reads. Strategically important for both cost and quality; spawns sub-issues #22746 and #22747.

## 4. Key PR Progress

1. **[#29858](https://github.com/google-gemini/gemini-cli/pull/29858) — Bridge IDE companion into container sandboxes over exec stdio** (XL, maintainer-only). Enables `/ide status`, open-file context, and native diffs inside Docker/Podman/runsc sandboxes — IDE integration has never worked there. Big usability win for containerized devs.

2. **[#29868](https://github.com/google-gemini/gemini-cli/pull/29868) — Stop continuation stream + auto-nudge after cancellation**. Fixes the CLI continuing to execute after `Escape` cancels a turn mid-tool-batch. Directly addresses a common interactive-mode frustration.

3. **[#29849](https://github.com/google-gemini/gemini-cli/pull/29849) — Handle SIGINT/SIGTERM and prevent tool execution after cancellation (non-interactive)** (P2). Headless-mode counterpart: prevents delayed provider tool calls from executing local shell side effects after cancellation. Important for CI/automation safety.

4. **[#29867](https://github.com/google-gemini/gemini-cli/pull/29867) — Preserve `${VAR}` placeholders during settings migration**. Stops the migration from baking expanded runtime values into `settings.json`. Data-integrity fix for anyone using env placeholders.

5. **[#29744](https://github.com/google-gemini/gemini-cli/pull/29744) — Let `/ide enable` reconnect after IDE server restart** (L/XL). Fixes the "Disconnected" state after VS Code window reload/extension update — a frequent daily annoyance.

6. **[#29833](https://github.com/google-gemini/gemini-cli/pull/29833) — Scope untrusted-flag checks to external output; remember approved flags**. Reduces repeated confirmation prompts while keeping untrusted-input protections. Good UX/security balance.

7. **[#29737](https://github.com/google-gemini/gemini-cli/pull/29737) — Add Gemini 4 Argon model support**. Registers `gemini-4-argon` in `VALID_GEMINI_MODELS` instead of requiring a custom override. Forward-looking model plumbing.

8. **[#29862](https://github.com/google-gemini/gemini-cli/pull/29862) / [#29778](https://github.com/google-gemini/gemini-cli/pull/29778) — Truncate ACP tool output before sending to model**. Two competing/overlapping fixes for unbounded ACP tool output causing 400 token-limit errors. Worth watching which lands.

9. **[#29823](https://github.com/google-gemini/gemini-cli/pull/29823) — Fallback to system ripgrep and trust Termux paths on Android**. Fixes `spawn ENOENT` on Android/Termux by skipping glibc binaries incompatible with Bionic libc. Broadens platform support.

10. **[#29718](https://github.com/google-gemini/gemini-cli/pull/29718) — Use `--userns=keep-id` for rootless Podman sandboxes** (P2, help wanted). Resolves `EACCES` for rootless Podman users by mapping the caller's UID. Small change, meaningful for sandbox users.

Also notable: **[#29749](https://github.com/google-gemini/gemini-cli/pull/29749)** (closed) fixed atomic `writeTextFile` silently overwriting read-only files and splitting hard links — a regression from #29499 worth verifying is fully resolved.

## 5. Hot Discussions

No Discussion data was provided in this dataset; this section is omitted.

## 6. Feature Request Trends

Distilled from the issue/PR set, the most-requested directions are:

- **Smarter context/token management**: AST-aware reads/search/mapping (#22745, #22746, #22747), "Tactful Extraction" surgical reads (#19561), and tool-output truncation in ACP (#29862, #29778) all aim to reduce token bloat and misaligned reads.
- **Persistent, file-based task tracking**: #18836 proposes deprecating in-context `WriteToDo` in favor of CRUD on a persistent file to avoid context rot and session memory loss.
- **Better subagent ergonomics and observability**: subagent trajectory visibility via `/chat share` (#22598), subagent discovery through `settings.json` (#18285), and shared-memory/parallel subagent collaboration (#18287).
- **Self-aware CLI**: #21432 asks the agent to accurately know its own flags, hotkeys, and self-execution patterns.
- **Resilience features**: browser agent session takeover/lock recovery (#22232) and per-workspace policy scoping (#18397).
- **Sandboxing + safety**: #19873 (zero-dependency sandbox) and #22672 (discourage destructive commands) point to a growing demand for guardrails as autonomy grows.

## 7. Developer Pain Points

Recurring frustrations, ranked by frequency and severity:

1. **Subagent unreliability**: hangs (#21409), false-success termination (#22323, #21983), under-invocation (#21968), and missing subagent context in bug reports (#21763). This is the single largest cluster and the highest-priority area.
2. **Cancellation/signal handling**: work continues after `Escape` (#29868) or SIGINT/SIGTERM in headless mode (#29849), risking unintended local side effects.
3. **Interactive-prompt deadlocks**: the agent gets stuck at interactive prompts (e.g., creating a Vite app, #22465) instead of proceeding.
4. **Environment/runtime friction**: IDE disconnects after reload (#29744), Wayland browser failures (#21983), containerized IDE gaps (#29858), rootless Podman `EACCES` (#29718), Android/Termux `ENOENT` (#29823), terminal resize flicker (#21924).
5. **Config and file-handling bugs**: browser agent ignoring `settings.json` (#22267), symlinked agent files not recognized (#20079), env placeholder corruption (#29867), read-only/hard-link mishandling (#29749), and duplicate-agent warnings when workspace is `~` (#29847).
6. **Tool-scaling limits**: 400 errors past ~128 tools (#24246) and unbounded ACP output (#29778/#29862).
7. **Workspace hygiene**: the model scattering temp scripts across directories (#23571), creating cleanup overhead before commits.

---

*Generated from github.com/google-gemini/gemini-cli activity on 2026-10-21/22. Comment counts and upvotes are as reported in the source data.*

</details>

<details>
<summary><strong>GitHub Copilot CLI</strong> — <a href="https://github.com/github/copilot-cli">github/copilot-cli</a></summary>

# GitHub Copilot CLI — Community Digest
**Date: 2026-10-22**

---

## 1. Today's Highlights

Release v1.0.102 landed with meaningful fixes for prompt-mode model selection, subagent permission handling, and plugin marketplace flexibility — though a new regression (Issue #5223) has already surfaced where interactive autopilot aborts after 600s while background subagents are still running. Community activity remains high (33 issues updated in 24h), with a strong cluster of enterprise/networking reports around MCP policy enforcement, OAuth persistence in ACP mode, and proxy/sandbox behavior. The long-standing vi/vim input mode request (#13, 76 👍) was finally closed, signaling progress on keyboard-driven UX.

---

## 2. Releases

**v1.0.102** (2026-10-21)
- Prompt mode now honors managed **Auto model selection** for `-p` and piped stdin runs.
- Subagents honor custom and MCP tool approvals — no more duplicate permission prompts; inherited workflows now run correctly.
- Plugin marketplaces accept `git-subdir` sources and long plugin descriptions.

**v1.0.102-1**
- Fixed: prompt mode Auto model selection for `-p`/piped stdin.
- Fixed: subagent approval inheritance for custom and MCP tools.

**v1.0.102-0**
- Improved: sandboxed network traffic honors `NO_PROXY` and `ALL_PROXY` when inheriting host proxy settings.
- Fixed: plugin marketplaces accept `git-subdir` sources and long plugin descriptions.
- Fixed: Fish shell completion works with option aliases (e.g., `--effort`).
- Fixed: chat state handling (truncated in changelog).

---

## 3. Hot Issues

1. **[#13 [CLOSED] vi/vim input mode](https://github.com/github/copilot-cli/issues/13)** — 15 comments, 76 👍. The highest-signal UX request in the tracker; closure suggests imminent or shipped support. Watch for follow-up issues on keybinding gaps (see #5211).

2. **[#4414 [CLOSED] BYOK custom providers return local 403](https://github.com/github/copilot-cli/issues/4414)** — Custom OpenAI/Anthropic-compatible providers failed with 403 before requests left the CLI. Important for enterprise BYOK users; closure implies a fix landed.

3. **[#3636 [OPEN] Voice mode catalog unreachable on corporate VPN](https://github.com/github/copilot-cli/issues/3636)** — 6 👍. Blocks `/voice` entirely in restricted networks; a recurring networking/proxy theme.

4. **[#5192 [OPEN] ACP mode: MCP OAuth token never persisted](https://github.com/github/copilot-cli/issues/5192)** — Every new ACP session re-opens the browser for auth. High-friction for ACP client integrations (Zed, etc.).

5. **[#5155 [OPEN] Cloud agent "Registry only" MCP policy drops repo-configured servers](https://github.com/github/copilot-cli/issues/5155)** — Enterprise policy interaction bug; proxy-bridged configs can't be fingerprinted. Serious for orgs enforcing registry-only MCP.

6. **[#5223 [OPEN] Autopilot stops after 600s with running background subagent (regression in 1.0.102)](https://github.com/github/copilot-cli/issues/5223)** — Fresh regression reported same-day as release; workaround via `COPILOT_TASK_WAIT_TIMEOUT_SECONDS`.

7. **[#5219 [OPEN] Unknown subagent model id falls back to 128k caps, wedges session](https://github.com/github/copilot-cli/issues/5219)** — Subtle failure mode: main context is fine but `task` delegation fails with prompt-budget errors.

8. **[#5054 [OPEN] Automatic compaction times out ("summarizer did not settle within 300s")](https://github.com/github/copilot-cli/issues/5054)** — 2 👍. Hits large-context users with xhigh reasoning; retries nearly every turn.

9. **[#5207 [OPEN] Windows sandbox: can't list/stat dirs on non-system drives](https://github.com/github/copilot-cli/issues/5207)** — Windows + `--sandbox` + `D:\` working dir is a common enterprise layout; blocks basic shell operations.

10. **[#5213 [OPEN] Honor explicit startup model selection like /model](https://github.com/github/copilot-cli/issues/5213)** — Managed `auto` override forces manual `/model` every session; minor but repeated friction.

---

## 4. Key PR Progress

Only one PR updated in the last 24h:

1. **[#1960 [CLOSED] install: use GITHUB_TOKEN for authenticated GitHub requests](https://github.com/github/copilot-cli/pull/1960)** — Passes `GITHUB_TOKEN` as an `Authorization` header on curl/wget downloads and embeds it in the git remote URL for `ls-remote`. Mitigates rate limits and enables installs from private repos. Closure indicates merge or supersession.

*Note: The dataset contained only 1 PR updated in the last 24h, so fewer than 10 are listed. This is a notable signal that PR activity is currently low relative to issue volume.*

---

## 5. Hot Discussions

No Discussions data was provided in the source dataset. **Section omitted.**

---

## 6. Feature Request Trends

Distilled from all Issues and the single PR:

- **Keyboard & modal editing UX** — vi/vim mode (#13, closed), configurable keybindings (#5211), Numpad Home/End regression (#5221), Ctrl+E plan viewing (#1870). A persistent cluster around input ergonomics.
- **BYOK / model flexibility** — Extra request params for BYOK models (#3448), honoring explicit startup model selection (#5213), reasoning_effort binding fixes (#4941).
- **Prompt caching control** — Request for 1-hour Claude cache TTL to avoid 5-minute expiry mid-conversation (#5220).
- **Session/agent workflow primitives** — `/ask` follow-up forking (#5215), autopilot task_complete surfaced as agent message in ACP (#5150).
- **Proxy/network configurability** — NO_PROXY/ALL_PROXY (shipped in 1.0.102-0), voice catalog over VPN (#3636), MCP OAuth persistence (#5192).
- **Installation/auth convenience** — GITHUB_TOKEN-based installs (#1960).

---

## 7. Developer Pain Points

Recurring frustrations across the tracker:

1. **Proxy and corporate-network friction** — Voice catalog unreachable, MCP OAuth not persisted, sandbox proxy inheritance. Multiple independent reporters (#3636, #5192, #5207).
2. **Enterprise policy over-reach** — Registry-only MCP silently dropping valid servers (#5155); managed `auto` model overriding user preference every session (#5213).
3. **Subagent reliability** — Model-id fallback wedging sessions (#5219), duplicate permission prompts (now fixed in 1.0.102), reasoning_effort incompatibility (#4941), autopilot 600s regression (#5223).
4. **Context/memory management** — Compaction timeouts (#5054) and prompt-budget errors from misreported model caps (#5219) make long sessions fragile.
5. **Input/keybinding inconsistency** — Mixing CUA, emacs, and custom bindings causes lost work (#5211); Numpad regression breaks muscle memory (#5221).
6. **Windows sandbox limitations** — Non-system drive access broken under `--sandbox` (#5207); ACP ignoring `--sandbox` entirely (#5089, closed).
7. **ACP-mode integration gaps** — Sandbox ignored, OAuth not persisted, task summaries delivered only as tool calls (#5089, #5192, #5150) — a maturing surface with visible rough edges.

---

*Generated from github.com/github/copilot-cli data as of 2026-10-22. Links use the `github/copilot-cli` shorthand as provided in source data.*

</details>

<details>
<summary><strong>OpenCode</strong> — <a href="https://github.com/anomalyco/opencode">anomalyco/opencode</a></summary>

# OpenCode Community Digest — 2026-10-22

## Today's Highlights

No new releases landed in the past 24 hours, but issue traffic remains heavy with **50 issues and 50 PRs updated**, dominated by V1→V2 migration fallout and GitHub Copilot model availability. The Copilot "auto-only" account problem is now the most-liked open issue (#34644, 👍24) and has **two competing PRs** addressing it (#55960, #57956). Meanwhile, a cluster of Windows-specific regressions (port collisions, phantom console windows, empty skill API) suggests the platform needs attention.

## Releases

None in the last 24h.

## Hot Issues

1. **[#42985 — OpenCode Go quota usage ~4x higher than displayed DeepSeek V4 Flash cost](https://github.com/anomalyco/opencode/issues/42985)** [CLOSED]
   Metering discrepancy between the usage graph ($3.31) and actual Go quota consumption. 20 comments and 9 👍 — the highest-engagement item of the day. Billing accuracy is a trust issue; closure is welcome.

2. **[#34644 — GitHub Copilot Free/Student plans show no models](https://github.com/anomalyco/opencode/issues/34644)** [OPEN]
   Copilot's `/models` returns `model_picker_enabled: false` for every model on auto-only plans, so the provider registers zero models after successful OAuth. 24 👍 and 12 comments make this the community's top ask. Duplicate reports (#57955) confirm it's widespread.

3. **[#52227 — Go API key not available in the new v2 Console](https://github.com/anomalyco/opencode/issues/52227)** [CLOSED]
   Go works in the CLI but keys can't be created/copied in v2 Console, breaking external-tool usage. 14 comments — a Console migration gap that closed today.

4. **[#53971 — V1→V2 migration silently drops legacy messages missing required fields](https://github.com/anomalyco/opencode/issues/53971)** [OPEN, severity:high]
   Reproduced: 64 V1 sessions ended up with zero `session_messages` rows. Silent data loss during migration is the most serious class of bug in this batch.

5. **[#55726 — `max_tokens` now sent alongside `max_completion_tokens`](https://github.com/anomalyco/opencode/issues/55726)** [OPEN, reproduced]
   Regression from #54694 breaks strict OpenAI-compatible endpoints with `Extra inputs are not permitted` — compaction fails too. A v2.0.28 regression that blocks entire providers.

6. **[#56005 — Failed to launch after updating to 2.0.30](https://github.com/anomalyco/opencode/issues/56005)** [CLOSED]
   `Managed service port 45280 already in use` on PowerShell launch. Paired with #55918 (WSL2 ephemeral port range 44620–48715 collides with the fixed port), this points to a systemic port-selection flaw on Windows.

7. **[#49645 — Model-agnostic MCP tool search / deferred schema loading](https://github.com/anomalyco/opencode/issues/49645)** [CLOSED]
   Proposal to keep MCP schemas out of the system prompt and expose a lightweight search tool instead. Well-received (👍3) and now closed — worth watching for follow-up.

8. **[#56200 — Server reads `~/.aws` and gcloud credentials when Bedrock/Vertex unused](https://github.com/anomalyco/opencode/issues/56200)** [OPEN, reproduced]
   Credential files touched at startup with no configured provider and no request made. A privacy/surface-area concern flagged via an external detection tool.

9. **[#57538 — Subagent tasks silently cancelled on network interface change](https://github.com/anomalyco/opencode/issues/57538)** [CLOSED]
   Wi-Fi→Ethernet switches cancel running subagents with no error and no resume path. Mobility-hostile behavior, now closed.

10. **[#57931 — Expired free model (GLM) breaks catalog and blocks other free models (Mimo)](https://github.com/anomalyco/opencode/issues/57931)** [OPEN]
    A single stale catalog entry fails the whole sync, locking users out of valid models. Fragile catalog handling with real user impact.

*Also notable:* [#57851](https://github.com/anomalyco/opencode/issues/57851) (`gemini-4-argon-contributor` returns 429 on every request while other Go models succeed), [#56885](https://github.com/anomalyco/opencode/issues/56885) (TUI hangs ~6 min on "Loading plugins..."), [#57907](https://github.com/anomalyco/opencode/issues/57907) (Windows spawns a console window per child process).

## Key PR Progress

1. **[#55960 — feat(core): add GitHub Copilot auto model](https://github.com/anomalyco/opencode/pull/55960)** (rekram1-node)
   Adds `github-copilot/auto`, mirroring VS Code, to fix #34644. The more upstream-aligned of the two Copilot fixes.

2. **[#57956 — fix(core): keep Copilot models selectable without a model picker](https://github.com/anomalyco/opencode/pull/57956)** (thdhyan)
   Alternative fix: stop mapping `model_picker_enabled` straight to availability. Closes #57955; overlaps with #55960 — maintainers will need to pick one.

3. **[#56452 — Allow disabling failed MCP servers & persist the toggle](https://github.com/anomalyco/opencode/pull/56452)** (VlexWest)
   `/mcps` space-to-disable in any state (failed/pending/connected), persisted across restarts. Closes #56451 — a quality-of-life win for anyone running unstable MCP servers.

4. **[#55261 — feat(tui): add prompt history scope setting](https://github.com/anomalyco/opencode/pull/55261)** (asamarts)
   Opt-in `prompt.history_scope: session` limits Up/Down recall to the current session; `global` remains default. Refs #52154.

5. **[#57224 — feat(app): animate the timeline like iOS while a session runs](https://github.com/anomalyco/opencode/pull/57224)** (kitlangton)
   ~1,156 lines of animation work to stop streamed text and tool rows from jumping every frame. The biggest UX investment in the batch.

6. **[#57913 — feat(app): say when a Console account has no Go subscription](https://github.com/anomalyco/opencode/pull/57913)** (kitlangton)
   Explains the empty Go model list after Console sign-in instead of showing silent nothing. Directly complements the #52227 Console confusion.

7. **[#57951 — chore(ci): quarantine always-red e2e and fail fast](https://github.com/anomalyco/opencode/pull/57951)** (kitlangton)
   App e2e has been red on every beta run, providing no signal while doubling retries. Restores CI as a useful gate.

8. **[#57921 — fix(gui-extensions): make the Knobs panel clearer](https://github.com/anomalyco/opencode/pull/57921)** (kitlangton)
   Removes redundant Speed/Slow-motion and preset strips, adds a "Feel" row for spring cards. Part of a broader desktop polish sweep (#57926, #57943, #57944, #57947).

9. **[#57886 — feat(desktop): show who made each beta change and what it does](https://github.com/anomalyco/opencode/pull/57886)** (kitlangton)
   Replaces commit-subject lists with attributed, animated change entries; stacked with #57940 (⌘K access to "What's new in beta").

10. **[#57966 — chore(app): replace Storybook with a story server for component tests](https://github.com/anomalyco/opencode/pull/57966)** (kitlangton)
    Draft removal of Storybook's UI in favor of the in-app components lab, retaining 40 spec files' test role. Infrastructure consolidation.

*Also:* [#57963](https://github.com/anomalyco/opencode/pull/57963) (Recently closed now lists only files), [#57965](https://github.com/anomalyco/opencode/pull/57965) (⌘L forwarding from browser pages), [#57969](https://github.com/anomalyco/opencode/pull/57969) (restores red beta typecheck).

## Hot Discussions

No discussion data was provided for this period.

## Feature Request Trends

- **Portable/state migration:** [#54534](https://github.com/anomalyco/opencode/issues/54534) asks for one-command migration of config, sessions, credentials, MCP, plugins, and skills across machines — echoing the pain visible in the V1→V2 migration bugs.
- **Context efficiency for MCP:** [#49645](https://github.com/anomalyco/opencode/issues/49645) wants deferred schema loading via a native search tool, reducing system-prompt bloat on OpenAI-style backends.
- **TUI plugin extensibility:** [#54927](https://github.com/anomalyco/opencode/issues/54927) requests a `SlotMap` slot for the session tab bar, blocked for third-party plugins like opencode-better-tabs.
- **Configurable session history:** [#55261](https://github.com/anomalyco/opencode/pull/55261) (per-session prompt recall) reflects demand for scoping behavior rather than global defaults.
- **Restored v1 affordances:** [#49742](https://github.com/anomalyco/opencode/issues/49742) requests the message-timestamp toggle (Ctrl+P) that existed in v1.18.31 but vanished in v2.0.8 — part of a broader "v2 removed things I relied on" theme.

## Developer Pain Points

1. **V1→V2 migration is lossy and inconsistent.** Silent message drops (#53971), `project_id='global'` hiding non-git sessions (#50551, #53450), and schema mismatches between docs and implementation (#56835) all erode upgrade confidence.
2. **Windows is a second-class platform right now.** Port collisions with WSL2's ephemeral range (#55918, #56005), per-child-process console windows (#57907), and an empty `/api/skill` response (#57524) form a coherent cluster.
3. **Copilot auto-only accounts are broken and highly visible.** #34644's 24 👍 plus duplicate #57955 and two competing PRs make this the clearest signal of unmet demand.
4. **Provider request regressions break strict endpoints.** #55726 (`max_tokens` + `max_completion_tokens` sent together) invalidates every request for `@ai-sdk/openai-compatible` users since v2.0.28.
5. **Catalog fragility.** A single expired free model (#57931) or one unavailable Go model (#57851) can block access to working models — error isolation is missing.
6. **Silent failures without recovery paths.** Network-change subagent cancellation (#57538), no-resume states, and the 6-minute plugin stall (#56885) leave users with no diagnostics or way forward.
7. **Config changes not picked up live.** [#56902](https://github.com/anomalyco/opencode/issues/56902): models added to a provider's config aren't listed until the background service restarts — a recurring "it looks configured but isn't" trap.
8. **Startup does more than it should.** Reading `~/.aws`/gcloud credentials when unused (#56200) is both a privacy concern and a startup-latency contributor.

</details>

<details>
<summary><strong>Pi</strong> — <a href="https://github.com/earendil-works/pi">earendil-works/pi</a></summary>

# Pi Community Digest — 2026-10-22

## 1. Today's Highlights

Pi v1.4.0 ships image input for classifier models (Jev, Clef) across TypeSafe, Cloudflare Workers AI, and OpenRouter. The issue tracker remains dominated by a large wave of P0 fixes around compaction, tool restoration on session resume, and provider streaming edge cases — many closed within hours, indicating a responsive triage cadence. Meanwhile, the Windows TUI and terminal compatibility surface (Zellij, CPU-load input corruption, clipboard) continues to generate the most persistent, unresolved reports.

---

## 2. Releases

**v1.4.0**
- **Image input for classifiers**: `models.classify()` now accepts an `images` parameter, supported for TypeSafe's Jev and Cloudflare's Clef models on the `typesafe`, `cloudflare-workers-ai`, and OpenRouter providers.
- Docs: [Use classifier models](https://github.com/earendil-works/pi/blob/v1.4.0/packages/coding-agen)

---

## 3. Hot Issues

1. **[#6300 [CLOSED] Windows: input line redrawn on every keystroke](https://github.com/earendil-works/pi/issues/6300)** — 20 comments, the highest-traffic issue in the window. Classic TUI-on-Windows rendering bug affecting both cmd.exe and Windows Terminal; long-lived but now closed.
2. **[#7553 [OPEN] Configurable thinking level/model for compaction](https://github.com/earendil-works/pi/issues/7553)** — 11 comments, 3 👍. Compaction unconditionally reuses session thinking level, making summarization budgets inseparable from normal turns. Sits in `to-discuss` — a design decision, not just a bug.
3. **[#10019 [OPEN] Anthropic subscription requests hang at :00/:30 UTC](https://github.com/earendil-works/pi/issues/10019)** — 10 comments. Requests return 200 + pings with no `message_start` on a suspiciously regular cadence. Hard to reproduce, high user impact for subscription users.
4. **[#10976 [CLOSED] powershell tool falls back to PowerShell 5.1 with Store-installed pwsh 7](https://github.com/earendil-works/pi/issues/10976)** — `getPowerShellConfig` resolves the Store app-execution alias incorrectly. Good example of Windows packaging edge cases.
5. **[#9656 [OPEN] Mouse wheel scrolls prompt history instead of transcript (Windows + Zellij)](https://github.com/earendil-works/pi/issues/9656)** — 4 👍. Works without a multiplexer and on Linux+tmux; isolated to Windows→Alacritty→Zellij.
6. **[#10956 [OPEN] cacheWarming "idle" silently stops when an extension handles turn_end](https://github.com/earendil-works/pi/issues/10956)** — 507 `cache_warming_decision` events, none at low continuation probability. Subtle interaction between extensions and the cache warmer.
7. **[#10949 [CLOSED] openai-responses drops legacy `response.reasoning.delta`](https://github.com/earendil-works/pi/issues/10949)** — Reasoning not streamed from OpenAI-compatible Responses endpoints (Vercel AI Gateway + Kimi K3). Relevant to the growing gateway-compat matrix.
8. **[#11203 [CLOSED] grep inherits RIPGREP_CONFIG_PATH despite `literal: false`](https://github.com/earendil-works/pi/issues/11203)** — Agent silently gets incomplete search results when a user's ripgrep config injects `--fixed-strings`. Fixed same day by PR #11230.
9. **[#11075 / #11062 / #11058 [all CLOSED, P0] tool restoration and compaction regressions](https://github.com/earendil-works/pi/issues/11075)** — A cluster of P0s: `/tree` deactivating tools, resumed sessions missing newly installed default-active tools, and split-turn compaction dropping `/compact` instructions. Rapidly triaged.
10. **[#8913 [OPEN] Fullscreen renderer unconditionally enables mouse tracking (incl. 1003)](https://github.com/earendil-works/pi/issues/8913)** — No flag/env/setting to opt out; the `mouse` option exists internally but is never passed. Straightforward fix awaiting a decision.

Also worth watching: [#11200](https://github.com/earendil-works/pi/issues/11200) (Responses stream crash on missing `arguments`), [#11227](https://github.com/earendil-works/pi/issues/11227) (recovery leaves orphaned tool results → OpenAI 400s), [#11091](https://github.com/earendil-works/pi/issues/11091) (mid-conversation system message ordering), [#11223](https://github.com/earendil-works/pi/issues/11223) (`modelOverrides` silently ignored for classifiers).

---

## 4. Key PR Progress

1. **[#11181 [CLOSED] feat(ai,coding-agent): add the Scaleway provider](https://github.com/earendil-works/pi/pull/11181)** — Closes #6165. OpenAI-compatible, `SCW_SECRET_KEY` or `/login scaleway`, EU-hosted open-weight models with zero data retention. (Duplicate #11182 closed.)
2. **[#11230 [CLOSED] fix(coding-agent): grep ignores ripgrep config via `--no-config`](https://github.com/earendil-works/pi/pull/11230)** — Direct fix for #11203; restores `literal: false` semantics regardless of the user's RIPGREP_CONFIG_PATH.
3. **[#11233 [CLOSED] fix(coding-agent): recovery omits tool results with the truncated tool call](https://github.com/earendil-works/pi/pull/11233)** — Fixes #11227; `_omitRecoveryAttempt()` now removes matching tool results on both the turn_end and pre-prompt paths.
4. **[#11005 [CLOSED] fix(ai): avoid thinkingBudget and MINIMAL on unmapped Gemini 4 models](https://github.com/earendil-works/pi/pull/11005)** — P0 follow-up to #10890, unblocking custom `models.json` Gemini 4 configs from HTTP 400s.
5. **[#9993 [CLOSED] feat: Anthropic Claude support in Google Vertex AI provider](https://github.com/earendil-works/pi/pull/9993)** — Enables Claude Opus/Sonnet/Haiku via Vertex Model Garden using ADC or API key; previously the catalog generator excluded all non-Gemini models.
6. **[#11212 [CLOSED] fix(tui): escape regex metacharacters in single-segment fd queries](https://github.com/earendil-works/pi/pull/11212)** — Fixes #10972 (`@pages/[id].tsx` autocomplete); adds regression tests for bracket/paren filenames.
7. **[#7441 [CLOSED] fix(ai): tolerate missing finish_reason on non-empty openai-completions streams](https://github.com/earendil-works/pi/pull/7441)** — Prevents `Stream ended without finish_reason` from killing sessions on spec-violating gateways.
8. **[#11213 [CLOSED] feat: provider attribution headers in pi-durable](https://github.com/earendil-works/pi/pull/11213)** — Extracts a shared `provider-attribution.ts` in pi-ai and reuses the coding agent's header table for pi-durable.
9. **[#10286 [OPEN] fix(ai): use OpenRouter-reported total cost](https://github.com/earendil-works/pi/pull/10286)** — Uses the actual billed amount rather than catalog estimates, which diverge under OpenRouter's provider routing.
10. **[#11231 [OPEN] docs(quickstart): add Windows installer tab](https://github.com/earendil-works/pi/pull/11231)** — Documents `install.ps1` and the managed-install/`pi update` flow alongside the existing macOS/Linux curl installer.

Also: [#8635](https://github.com/earendil-works/pi/pull/8635) (preserve aborted stop reason during lazy setup), [#10528](https://github.com/earendil-works/pi/pull/10528) (Nix packaging refactor), [#11204](https://github.com/earendil-works/pi/pull/11204) (withdrawn empty tool-call recovery extension).

---

## 5. Hot Discussions

**Show and tell**
- **[#2483 awto-pi-lot: pay-as-you-go, accountless mode, infinite-loop caps](https://github.com/earendil-works/pi/discussions/2483)** — 5 comments, 3 👍. Extension adding the PPQ.ai provider and AutoClaw models; the most-engaged discussion in the window.
- **[#11214 Pi on Atomic Bot, running 24/7 in the cloud](https://github.com/earendil-works/pi/discussions/11214)** — One-click managed Pi instance that survives laptop closure; launched today.
- **[#11196 pi-tidy: collapse a reply's tool calls into one line](https://github.com/earendil-works/pi/discussions/11196)** — Addresses transcript scroll fatigue; shows `▾ 12 calls · bash×8 read×4 · 1 failed · 3.4s` with per-call expansion.

---

## 6. Feature Request Trends

- **Compaction control**: independent thinking level/model for summarization (#7553) and preservation of `/compact` custom instructions in split-turn summaries (#11058). Users want compaction to be a first-class, tunable subsystem.
- **Extension composability**: wrapping tools registered by other extensions (#11218), `afterTool` firing for non-executed calls, and `maxTurns` in pi-durable (#11043).
- **Provider breadth and correctness**: Scaleway (#6165 → #11181), Claude on Vertex AI (#9993), OpenRouter-reported cost (#10286), and attribution headers shared across packages (#11213).
- **Terminal control**: opt-out of fullscreen mouse tracking (#8913), OSC 52 clipboard over SSH/mosh (#1069), and multiplexer-aware input handling (#9656).
- **Windows parity**: installer documentation (#11231), PowerShell 7 resolution (#10976), extension resolution in packaged CLI (#11219).

---

## 7. Developer Pain Points

- **Windows terminal stack remains the weakest surface.** Redraw-per-keystroke (#6300), symbol leakage under CPU load (#11086), Zellij mouse-wheel misrouting (#9656), and Store-build PowerShell resolution (#10976) all point to insufficient Windows/multiplexer test coverage.
- **Streaming protocol drift across gateways.** Missing `finish_reason` (#7441), dropped `reasoning.delta` (#10949), `function_call_arguments.done` without `arguments` (#11200), and non-standard `done`/error ordering in `streamProxy` (#10844) mean every OpenAI-compatible gateway needs its own tolerance path.
- **Cache warming silently degrades.** Two independent reports (#10956, #10536) show the idle warmer turning itself off — via extension `turn_end` handlers and virtual models — with no user-visible signal beyond `/session`.
- **Silent configuration failures.** `modelOverrides` ignored for classifier models (#11223), `RIPGREP_CONFIG_PATH` altering grep semantics (#11203), and extension loading failures in packaged Windows builds (#11219) all fail without warnings.
- **Tool loadout state is fragile across session lifecycle events.** `/tree` navigation, session resume, and pre-prompt recovery have each produced P0s in the last week (#11075, #11062, #11227), suggesting the transcript-as-source-of-truth model for active tools needs hardening.

</details>

<details>
<summary><strong>Qwen Code</strong> — <a href="https://github.com/QwenLM/qwen-code">QwenLM/qwen-code</a></summary>

# Qwen Code Community Digest — 2026-10-22

## 1. Today's Highlights

Qwen Code shipped **v0.26.0** across the CLI, Desktop, and CUA driver, headlined by session-targeted Skill and Extension refresh in the daemon (PR #14050) and a hardening fix for the Managed Agent publication guard. The Managed Agent track continues to dominate activity: a wave of parity trackers and feature requests (runtime MCP management, context compression, capacity models, workspace confinement) landed alongside implementation PRs for durable compression and session lifecycle UI. On the bug side, the most urgent items are a **P1 permission-bypass** where `permissions.deny Read(...)` is not honored by `grep_search`/`glob` (#15129) and a **P1 daemon OOM** in the VS Code companion (#15071).

## 2. Releases

Four releases published in the last 24 hours:

- **v0.26.0** — Stable release.
  - `feat(daemon)`: session-targeted Skill and Extension refresh (PR [#14050](https://github.com/QwenLM/qwen-code/pull/14050), @callmeYe) — lets the daemon refresh Skills/Extensions for a specific session instead of globally.
  - `fix(managed-agent)`: bound initial publication guard.
  - https://github.com/QwenLM/qwen-code/releases
- **v0.25.3-nightly.20261021.79242671bb** — Nightly carrying the same daemon Skill/Extension refresh and Managed Agent guard fix.
- **desktop-v0.26.0** — Desktop build aligned to v0.26.0 (commit `ac97ce7`), same changelog set.
- **cua-driver-rs-v0.26.0** — Prebuilt CUA driver binaries vendored under `packages/cua-driver`:
  - macOS: codesigned + notarized universal binary + `QwenCuaDriver.app`
  - Linux: unsigned x86_64 + arm64 (glibc 2.31 floor)
  - Windows: unsigned UIAccess worker + native SDK payload (x86_64 + arm64)

## 3. Hot Issues

1. **[#15129](https://github.com/QwenLM/qwen-code/issues/15129) [P1/security] `permissions.deny Read(...)` is bypassed by `grep_search` and `glob`** — A deny rule on `./secret.env` blocks `read_file`, but `grep_search`/`glob` still return the file's content and name, contradicting documented behavior ("matches all four read tools"). This is the highest-severity open issue of the day: a security control that silently does not apply.
2. **[#15071](https://github.com/QwenLM/qwen-code/issues/15071) [P1/perf] VS Code companion daemon heap grows unbounded, OOMs at ~4 GB** — The `qwen serve` daemon dies with "Allocation failed – JavaScript heap out of memory" during normal use, after which the panel reports the server stopped. Persistent, session-impacting reliability issue for the companion workflow.
3. **[#15083](https://github.com/QwenLM/qwen-code/issues/15083) [P2/core] User prompt during a running background subagent executes in the subagent's context** — A prompt submitted while a background subagent runs can inherit the subagent's `AsyncLocalStorage` context and tool policy, and deferred `tool_call`s are refused. This is a correctness/isolation bug with real security implications for multi-agent sessions.
4. **[#13492](https://github.com/QwenLM/qwen-code/issues/13492) [P2/core] XML tool-call recovery drops outer calls containing quoted tool markup** — The most-commented issue in the window (13 comments). PR #13515 fixed dispatching quoted markup as a real call; the remaining scope is outer-call recovery via the still-unmerged PR #13579. Long-running, carefully verified work.
5. **[#13787](https://github.com/QwenLM/qwen-code/issues/13787) [P3/perf] XML recovery repeats prefix scans on large multi-call responses** — Reproduced with a bounded direct-parser benchmark on main; recovery cost grows with the number of valid calls. A companion to #13492 and a visible hot path in latency-sensitive sessions.
6. **[#14979](https://github.com/QwenLM/qwen-code/issues/14979) [P2/tools] Improve the edit tool** — Proposes porting ideas from `Rianico/dsh-better-edit` to replace the current read/edit file flow. The author calls the edit tool "the worst part of my workflow" due to fragile exact `old_text` matching; tagged `need-discussion` and already drawing 4 comments.
7. **[#15076](https://github.com/QwenLM/qwen-code/issues/15076) [P2/tools] Managed Agent: provide `web_fetch` and `todo_write` in Workspace Sessions** — Both tools exist in shared core and work in `qwen serve`, but are not exposed on the Managed path — a concrete, low-cost parity gap.
8. **[#15084](https://github.com/QwenLM/qwen-code/issues/15084) [P2/core] tracking(managed-agent): close user-facing gaps against the legacy daemon** — The umbrella tracker for Java Hosted Managed Agent vs. legacy `qwen serve` differences, with explicit decisions, delivery slices, and acceptance conditions per gap. Useful as the map for the entire Managed Agent roadmap.
9. **[#15109](https://github.com/QwenLM/qwen-code/issues/15109) [P2/ui] Desktop client cannot enable task notifications** — The WebView denies notification permission for the ephemeral loopback origin, so "Allow notifications" renders permanently disabled and the Settings toggle silently no-ops.
10. **[#15125](https://github.com/QwenLM/qwen-code/issues/15125) [P2/tools] `read_file` advertises images to models that cannot read them** — When the model has no vision input and no vision bridge, images are replaced with a text placeholder, so the model calls the tool expecting a picture and gets text. A capability-negotiation/UX mismatch that wastes turns.

## 4. Key PR Progress

1. **[#15104](https://github.com/QwenLM/qwen-code/pull/15104)** `feat(managed-agent)`: Adds durable manual context compression for Workspace-bound Managed Sessions via the public API and the existing WebShell context-usage popover — idle-only, actor-scoped idempotency, its own compaction revision, native capability negotiation. Directly answers #15080.
2. **[#15131](https://github.com/QwenLM/qwen-code/pull/15131)** `feat(managed-agent)`: Safely settle recovery and continue sessions — keeps a possibly-submitted Workspace Turn under its original recovery/cancellation driver until durable native settlement and cleanup prove the session can accept another message; adds a conservative five-state recovery view.
3. **[#15100](https://github.com/QwenLM/qwen-code/pull/15100)** `feat(managed-agent)`: Session lifecycle UI and reading exports — close, close-and-archive, archive, restore, delete through shared row/detail menus and ordinary/archived history views; closed conversations remain readable but reject new turns. Implements #15077/#15078 territory.
4. **[#14953](https://github.com/QwenLM/qwen-code/pull/14953)** `fix(core)`: Keep compression requests within the context window — the cold compaction request must leave at least 4,096 output tokens for the summary (or a quarter of the window under 16K), preventing self-hosted deployments from issuing impossible summarization requests.
5. **[#11486](https://github.com/QwenLM/qwen-code/pull/11486)** `feat(cli)`: Support exact-version updates without npm discovery — adds `qwen update --target-version <version>` for standalone installs, reusing the existing download/verification flow and `QWEN_UPDATE_BASE_URL`.
6. **[#14033](https://github.com/QwenLM/qwen-code/pull/14033)** `fix(core)`: Widen the agent workspace lock retry budget from 10 to 30 retries (~5s worst case), matching the Agent Board lock's budget and reducing cross-process lock failures.
7. **[#15044](https://github.com/QwenLM/qwen-code/pull/15044)** `fix(cli)`: Refuse the marketplace plugin picker without a terminal — previously `qwen extensions install <marketplace>` hung indefinitely because `prompts({ type: 'select' })` never settled on piped/closed stdin.
8. **[#15037](https://github.com/QwenLM/qwen-code/pull/15037)** `fix(cli)`: Fail closed when the extension consent prompt has no stdin — `extensions install`/`link` no longer silently proceed when consent cannot be read.
9. **[#15122](https://github.com/QwenLM/qwen-code/pull/15122)** `fix(ci)`: Keep the sdk-java fast tier out of multi-hour lock holds — the per-host Maven lock is now taken only for the write-back that mutates the shared cache; part of a cluster of lock-leak fixes (#15116, #15105, #15121) that were starving the Managed Agent gate.
10. **[#15060](https://github.com/QwenLM/qwen-code/pull/15060)** `fix(web-shell)`: Reset follow pause when the session changes — a reading pause now ends when the displayed session changes, instead of following the reader into a different transcript after reconnect replay.

Also notable: **[#14998](https://github.com/QwenLM/qwen-code/pull/14998)** extends the FG11d cancellation matrix (second manual fire during a running turn returns `409 automation_run_skipped`), and **[#9305](https://github.com/QwenLM/qwen-code/pull/9305)** bottom-aligns short VP content to remove the blank gap above the composer.

## 5. Hot Discussions

No Discussion data was provided for this window, so this section is omitted.

## 6. Feature Request Trends

- **Managed Agent parity with the legacy daemon** is the single largest theme, with dedicated trackers and per-gap requests: runtime MCP server management (#15079), manual context compression (#15080), capacity/idle-reclamation model (#15082), archived-session listing and title search (#15077), close/archive/delete for public Shell Sessions (#15078), filesystem/process confinement for Workspace sessions (#15081), `web_fetch` + `todo_write` exposure (#15076), and a CI-checked capability parity matrix (#15075).
- **Edit/file-operation quality** — #14979 asks for a better edit tool (better-edit style diffing) to replace brittle exact `old_text` matching.
- **Context and memory efficiency** — #15027 targets repeated legacy auto-memory catalog input cost after stable-prefix fixes; #14953 hardens compression budget accounting.
- **Capability-aware tool advertising** — #15125 wants `read_file` to stop promising image support to non-vision models.
- **Desktop/notification polish** — #15109 requests working task notifications in the Desktop WebView.

## 7. Developer Pain Points

- **Security controls that don't hold.** The `permissions.deny` bypass via `grep_search`/`glob` (#15129) undermines a documented guarantee and is the clearest trust issue in the queue.
- **Resource leaks and OOM.** Unbounded `qwen serve` daemon heap growth in the VS Code companion (#15071), plus repeated CI lock leaks (the #15105/#15116/#15121/#15122 series) that let a host lock outlive a cancelled step and stall the Managed Agent gate.
- **Session/subagent isolation.** Prompts crossing into a background subagent's context and tool policy (#15083) is a recurring class of multi-agent correctness complaint.
- **Tool-call recovery fragility and cost.** Long-running XML recovery work (#13492, #13787) shows both correctness gaps (dropped outer calls) and quadratic-ish latency on large multi-call responses.
- **Non-interactive CLI hangs.** Multiple fixes (#15037, #15044) target prompts that never settle when stdin isn't a TTY — a frequent automation/CI blocker.
- **Flaky, hard-to-read CI.** Deterministic red E2E smoke from a label text change (#15135), intermittent SDK Java/Hosted IT failures (#15132, #15088), and main-CI failure bot issues (#14784, #15096) continue to consume maintainer time.
- **Edit-tool ergonomics.** Exact-match `old_text` failures remain the most-cited day-to-day friction for agentic file editing (#14979).

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*