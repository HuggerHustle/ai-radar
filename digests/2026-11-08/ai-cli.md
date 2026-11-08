# AI CLI Tools Community Digest 2026-11-08

> Generated: 2026-11-08 00:24 UTC | Tools covered: 7

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

# Cross-Tool AI CLI Comparison Report — 2026-11-08

## 1. Ecosystem Overview

The AI CLI ecosystem has entered a **maturity-and-hardening phase**. None of the six tools shipped a feature-rich release today — the only artifacts were incremental tags (Codex `rust-v0.169.0-alpha.3` with empty notes; Qwen Code's `v0.27.0` consisting almost entirely of test-infra changes) — while issue trackers carried the day. Activity is dominated by **security/permission regressions, cost/limit-accounting opacity, sandbox correctness, and cross-platform (especially Windows) reliability**, not new capabilities. A second visible theme is **interop and portability**: Claude Code hook parity (OpenCode), ACP/hook coverage (Gemini CLI, Copilot CLI, OpenCode), MCP lifecycle, and OpenAI-compatible provider quirks recur across four or more tools. Beneath the surface, the communities are converging on the same unmet needs — usage metering, plugin/hook contracts, config hygiene — which suggests the next competitive axis will be **trust and extensibility**, not raw model access.

## 2. Activity Comparison (2026-11-08)

| Tool | Issues Activity | PR Activity | Discussions | Release Status |
|---|---|---|---|---|
| **Claude Code** | Very high — top issue 727 👍 / 104 comments; ~10+ notable issues updated | None reported in 24h | N/A — no data provided | No release; no changelog |
| **OpenAI Codex** | Very high — 3 issues >40 comments; ~10 flagged | Heavy — 10+ PRs updated (incl. `copyberry` automation) | **Active** — 1 Ideas thread + 8 Show-and-tell | `rust-v0.169.0-alpha.3` (empty notes) |
| **Gemini CLI** | High — top issue 13 comments; recall/safety focus | Very heavy — 10 security/agent-correctness PRs | N/A — no data provided | No release |
| **GitHub Copilot CLI** | High — 16 of 26 updates *closed*; extension/ACP-heavy new filings | None reported in 24h | N/A — no data provided | `v1.0.108-1` and `v1.0.108-0` (sandbox/MCP fixes, `/index`) |
| **OpenCode** | Extremely high — megathread at 326 comments | Moderate — ~10 PRs (desktop startup, Console events, TUI) | N/A — no data provided | No release |
| **Pi** | High — 24 issues updated; Windows thread at 94 comments | Moderate — 6 PRs (cache warming, SDK preamble, memory layer) | **Active** — 1 Show-and-tell + 1 Q&A | No release |
| **Qwen Code** | High — CI gate thread at 226 comments; Managed Agent cluster | Moderate — 10 PRs (managed-agent, cache, stream-json) | N/A — no data provided | **`v0.27.0`** (test-infra focused) |

*Notes:* Claude Code, Gemini CLI, Copilot CLI, OpenCode, and Qwen Code reported no Discussions data this window — this should be read as **"data not available"**, not "no community." Codex and Pi are the two tools where Discussions are an explicit, active channel.

## 3. Shared Feature Directions

Four cross-cutting requirements appear in three or more communities:

1. **Usage/limit/cost transparency and control**
   - *Claude Code:* `claude -p` consuming ~1.8× more window per token (#97074); "Credit balance too low" despite funded plan (#106458).
   - *Codex:* opaque "abuse prevention" blocks (#51540); GPT-6.1 Terra burning ~15× limit with cached input billed full price (#59690); send button disabled after quota exhaustion (#48369).
   - *Copilot CLI:* per-task token limits to prevent unpredictable premium-request spend (#3012).
   - *Pi:* Anthropic prompt-cache expiry causing $1,430 (26% of p2 spend) in rewrites over three weeks (#11857).
   - *OpenCode:* free-tier reset never happening (megathread #59387).
   - **Convergent ask:** explicit meters, deterministic resets, and user-facing budget knobs.

2. **Hook / extension / plugin contract stability (and Claude Code hook parity)**
   - *OpenCode:* native `PreToolUse`/`PostToolUse`/`Stop` hook parity with Claude Code (#12472, 42 👍).
   - *Gemini CLI:* `BeforeTool`/`AfterTool` hooks bypassed over ACP (#30005); subagent observability asks (#22598, #21763).
   - *Copilot CLI:* extension skills lost after `new_context` (#5382); extensions not starting for `create_session` (#5380).
   - *Codex:* public Desktop Extension API request (#51138); Show-and-tell ecosystem built entirely on hooks/MCP.
   - **Convergent ask:** a stable, documented hook/extension surface portable across tools.

3. **Cross-platform (Windows + ARM64) reliability**
   - *Codex:* Windows sidebar project loss (#42739, 81 comments), Computer Use stuck at `get_window_state` (#51524, 74 comments), sandbox kernel token leak (#54400), VS Code `renderer_ready_timeout` (#58811).
   - *Claude Code:* Windows browser-pane 127.0.0.1 regression reopened (#96508); macOS arm64 VS Code extension install failure (#108077).
   - *Copilot CLI:* Windows `CreateProcessW` sandbox probe failure (#5368), keyboard shortcut mismatch (#3760), ARM64 Linux ripgrep crashes on 16KB/64KB pages (#4977, #4918).
   - *OpenCode:* winget install failure (#56297); `ResizeObserver` loop storms dumping 33–37 MB renderer logs (#62206).
   - *Pi:* 94-comment Windows strategy thread (#7547).
   - **Convergent ask:** platform parity, not "Windows eventually."

4. **Sandbox / permission-gate correctness (both false positives and false negatives)**
   - *Claude Code:* auto-mode `pkill -f "cat"` killed GUI apps (#100684); account-email check denies `127.0.0.1`/heredoc writes (#107144).
   - *Gemini CLI:* tainted-command "always allow" whitelisting the whole root (PR #30196); flag-ordering bypass of `isDangerousCommand` (PR #30171); `rm -rf` position blindness.
   - *Copilot CLI:* sandbox `/ide` misreads live processes as dead (#4909); path classification divergence.
   - *Qwen Code / Codex:* headless deny-list overriding scoped allow for auto-memory (#15597); Windows sandbox resource leak.
   - **Convergent ask:** predictable, auditable, correctly-scoped permission semantics.

5. **Cross-device / cross-session state consistency (secondary but notable)**
   - *Codex:* iOS Remote ↔ Desktop project list drift (#36454); desktop as source of truth (#37659).
   - *Claude Code:* remote sessions missing from `/resume` (#95231, #94546); idle-timeout configurability (#104361).
   - *OpenCode / Qwen Code:* session metadata for recency sorting (#62655→#62671); stream-json message-id stability (#15875).

## 4. Differentiation Analysis

| Tool | Primary Focus | Target User | Technical Approach |
|---|---|---|---|
| **Claude Code** | Privacy, auth-state integrity, headless cost accounting | Individual devs in CI/scripts + Desktop users | Proprietary; explicit security gates (some over-broad); Desktop + CLI + Remote Control |
| **OpenAI Codex** | Windows desktop reliability, multi-device sync, app-server correctness | Prosumer/enterprise desktop users | Rust core (`rust-v…` tags); app-server + Computer Use/agentic automation; extension API nascent |
| **Gemini CLI** | Agent/subagent semantics (recovery, config, safety heuristics) | Power users, agent builders, ACP-integrated IDE users | Open-source CLI; explicit "GOAL/termination reason" model; security PR cluster converging |
| **GitHub Copilot CLI** | Sandbox correctness, terminal integration, enterprise/headless parity | Enterprise devs, managed deployments | GitHub-native; OTel/BYOK/ACP ambitions; shipping fixes fast (16 closes in a day) |
| **OpenCode** | Provider interop, TUI plugin ecosystem, Console integrations | Third-party-model users (OpenAI-compatible), plugin authors | Multi-provider proxy posture; V2 core/CLI churn; Console event-driven sessions |
| **Pi** | Provider breadth, cost efficiency, SDK extensibility, Windows story | SDK embedders, cost-sensitive prosumers | earendil-works stack; p2 prompt-cache economics as a first-class concern |
| **Qwen Code** | Managed Agent operations, CI/CD safety, token efficiency | Teams running hosted agents; BYO small-context models | Managed control-plane + CLI; strong test-infra and CI reasoning |

**Distinctive bets:**
- **Codex** is the only tool where *Computer Use* (GUI automation) is a headline capability — and simultaneously its largest single-source failure cluster.
- **Copilot CLI** is the only one clearly optimizing for *managed enterprise deployment* (sandbox policy JSON, `failIfUnavailable`, OTel-in-ACP) while shipping rapid fixes.
- **Pi** is alone in treating *prompt-cache economics* as a community-visible engineering problem (PR #11857).
- **OpenCode's** community is the only one whose top thread is a *billing/reset outage* rather than a bug — a different kind of risk.
- **Qwen Code** is the only tool with a *Managed Agent control plane* as a first-class product surface.

## 5. Community Momentum & Maturity

**Momentum ranking (by engagement intensity, today):**

1. **OpenCode** — Highest single-thread engagement (326 comments) and the most alarming signal (free-tier lockout). Very high raw volume; plugin ecosystem shows stress fractures.
2. **Claude Code** — Highest upvote density on a single issue (727 👍) and a broad pain-point surface. Rapid triage sweep in progress; no PRs visible suggests a release-freeze or maintainer rotation moment.
3. **Gemini CLI** — Most security-focused PR burst of the day. High-quality, correctness-oriented discourse (recovery semantics, config propagation).
4. **OpenAI Codex** — Largest PR throughput via automation; the Windows reliability backlog is the single biggest *unresolved* cluster across the sampled tools.
5. **Qwen Code** — Long-running CI failure (#14724, 226 comments) indicates both active maintenance and alert fatigue. Managed Agent workstream is the most architecturally ambitious here.
6. **GitHub Copilot CLI** — Best "shipping" signal of the day: two releases plus 16 closes. Maturity is high, but extension lifecycle bugs suggest the plugin model is still young.
7. **Pi** — Smaller absolute numbers but the highest signal-to-noise: a 94-comment Windows strategy thread and a cost fix that touches real money.

**Maturity assessment:**
- **Most mature (in shipping discipline):** Copilot CLI (closing long-standing bugs, incremental releases, policy file configs).
- **Most mature (in ecosystem surface):** Codex (Discussions, extension API requests, Show-and-tell culture) and Claude Code (largest raw community, but no Discussions channel visible here).
- **Fastest iterating (feature velocity):** Codex (PR automation) and Gemini CLI (security PR wave).
- **Most fragile (community trust risk):** OpenCode (billing/reset outage), Claude Code (privacy + auth-state issues), Pi (Windows ambiguity).

**Risk flags for decision-makers:**
- Tools with *no* Discussions channel visible in this dataset (Claude Code, Gemini CLI, Copilot CLI, OpenCode, Qwen Code) should not be treated as having less community — but the absence of a community forum often correlates with issue-tracker overload.
- Two tools shipped releases today; two tools shipped *zero* engineering output visible to the public (Claude Code, Gemini CLI) — worth confirming whether that is a cadence choice or a bottleneck.

## 6. Trend Signals (for developers and technical decision-makers)

1. **Cost accounting is now a first-class product feature, not a billing detail.**
   Six of seven tools have active cost/limit complaints, including two quantified regressions ($1,430 cache waste in Pi; ~15× per-call burn in Codex). **Implication:** budget observability, deterministic reset semantics, and per-task token caps should be on your procurement checklist — not just per-token pricing.

2. **Permission and sandbox heuristics are cutting both ways.**
   Over-broad auto-approve (`pkill -f "cat"`, `npm …` root whitelisting) and over-strict gates (`127.0.0.1` denied in headless, `rm -rf` position parsing) are both causing incidents. **Implication:** treat agent permission models as security-critical code paths; test them in CI as you would a WAF.

3. **"Claude Code hook parity" is becoming an ecosystem portability requirement.**
   OpenCode explicitly requests PreToolUse/PostToolUse/Stop hooks; Codex and Copilot CLI communities build around hooks/MCP; Gemini CLI grapples with hook gaps in ACP. **Implication:** if you invest in hooks today, favor tools with a *documented, versioned* hook contract; avoid relying on undocumented ordering.

4. **Cross-platform (Windows + ARM64 + Wayland) remains the largest unaddressed reliability surface.**
   Codex has 4 of the top-10 issues on Windows; Gemini has a Wayland subagent failure; Copilot CLI has ARM64 ripgrep crashes; Claude Code reopened a Windows regression; Pi cannot even state a Windows support position. **Implication:** validate on your *actual* target platform before piloting the tool your team liked on macOS.

5. **Agent correctness semantics (false success, silent failures) are an emerging trust category.**
   Gemini's MAX_TURNS reported as GOAL success (#22323), Qwen Code's stream-json returning the previous answer past turn limit (#15325), Claude Code's remote-session resume gaps. **Implication:** wrap agent output in explicit termination/status checks; never treat "success" as ground truth without artifacts.

6. **MCP/ACP lifecycle is the new integration frontier — and it's leaky.**
   MCP servers not restarting after `/cd` (Copilot CLI, fixed today), MCP subprocess multiplication (OpenCode #37844), MCP elicitations silently auto-declined (Codex #60158), MCP tools missing on first prompt in ACP (OpenCode #62454), ACP dropping OTel (Copilot CLI #5376). **Implication:** budget for MCP lifecycle debugging; prefer tools exposing MCP readiness signals.

7. **Prompt caching is an under-noticed, systemic cost lever.**
   Pi's PR #11857 is the only public quantification in this set, but cache-creation telemetry (#15414 in Qwen Code) and Codex's cached-input-full-price bug suggest it is a broad issue. **Implication:** measure cache hit rates per provider; a 5-minute TTL mismatch can be the difference between a 26% and a single-digit cache-miss overhead.

8. **Config-dotfile hygiene is a small but recurring developer-experience tax.**
   Pi's `deviceId` and `lastChangelogVersion` in shared config (👍5, 👍6, both closed), Qwen Code's `--config-dir` request (#10984). **Implication:** for teams syncing dotfiles, prefer tools that separate device state from preferences — or wrap configuration in your own layered loader.

---

*Methodology note: figures reflect publicly visible GitHub activity for the 2026-11-07/08 window as reported in the source digests. "Discussions = N/A" denotes no data provided for that repo in this window, not zero community activity. Comment/upvote counts are point-in-time and should be treated as relative indicators.*

---

## Per-Tool Reports

<details>
<summary><strong>Claude Code</strong> — <a href="https://github.com/anthropics/claude-code">anthropics/claude-code</a></summary>

## Claude Code Skills Highlights

> Source: [anthropics/skills](https://github.com/anthropics/skills)

# Claude Code Skills — Community Highlights Report
*Data snapshot: 2026-11-08 | Source: github.com/anthropics/skills*

---

## 1. Top Skills Ranking

> Note: The PR dataset shows `Comments: undefined` for all entries (likely unexposed by the API), so ranking below is inferred from recency, update activity, issue cross-references, and scope of impact rather than raw comment counts.

| Rank | Skill / PR | Functionality | Discussion Highlights | Status |
|------|-----------|---------------|----------------------|--------|
| 1 | **mcp-builder** ([#1742](https://github.com/anthropics/skills/pull/1742)) | Builds MCP servers; fixes `streamable_http_client` rename and custom header handling in `mcp>=2.0.0` | Addresses breaking import/API changes; tied to open issue #1668; high impact on MCP tooling | Open |
| 2 | **skill-creator** ([#1298](https://github.com/anthropics/skills/pull/1298), [#1681](https://github.com/anthropics/skills/pull/1681), [#1997](https://github.com/anthropics/skills/pull/1997)) | Meta-skill for authoring/evaluating other skills; fixes trigger evals, Windows runtime failures, direct-execution path bugs, YAML frontmatter parsing | Three separate fix PRs → indicates the skill is heavily used and brittle; YAML parsing drift is a recurring theme | Open |
| 3 | **webapp-testing** ([#1980](https://github.com/anthropics/skills/pull/1980), [#1976](https://github.com/anthropics/skills/pull/1976)) | Automates browser/server testing; fixes `shell=True` command-injection risk and element-discovery reporting for textarea/select | Security (CWE-78) + correctness fixes; security angle elevates attention | Open |
| 4 | **docx** ([#1792](https://github.com/anthropics/skills/pull/1792), [#1734](https://github.com/anthropics/skills/pull/1734)) | Document processing; fixes LibreOffice timeout handling, verifies output, detects orphaned comments | Reliability of silent-success paths is a recurring complaint; ties to issue #2018 on invalid XML | Open |
| 5 | **xlsx** ([#2019](https://github.com/anthropics/skills/pull/2019)) | Spreadsheet recalculation; resolves worksheet-scoped defined names/aliases in `external_links_at_risk` | Fixes false negatives from indirect external refs; references issue #2013 | Open |
| 6 | **claude-api** ([#1730](https://github.com/anthropics/skills/pull/1730)) | API usage guidance; replaces dead documentation URLs in academy-guide and tool-use-concepts | Docs hygiene; contrast with issue #1487 flagging ~156k token eager injection | Open |
| 7 | **pdf** ([#538](https://github.com/anthropics/skills/pull/538)) | PDF handling; fixes 8 case-sensitivity mismatches (`REFERENCE.md`→`reference.md`, etc.) in SKILL.md | Small but high-signal: breaks on case-sensitive filesystems | Open |
| 8 | **algorithmic-art / pptx / slack-gif-creator** ([#1977](https://github.com/anthropics/skills/pull/1977), [#1975](https://github.com/anthropics/skills/pull/1975), issue #1868) | Generative art, thumbnails, GIF creation; `wrapAround()` modulo fix, `--cols` validation, gradient interpolation off-by-one | Clustered small correctness fixes from the same contributor (gerardrecinto) | Open |

---

## 2. Community Demand Trends

Distilled from the Issues dataset (top 15 by comments):

1. **Trust & namespace governance** — [#492](https://github.com/anthropics/skills/issues/492) (46 comments, 👍3): Community skills distributed under the `anthropic/` namespace enable impersonation/trust-boundary abuse. This is by far the most-discussed issue and signals demand for **verified/official skill provenance**.
2. **Org-wide skill distribution** — [#228](https://github.com/anthropics/skills/issues/228) (17 comments, 👍8): Users want a **shared skill library / direct share links** inside Claude.ai instead of manual `.skill` file uploads via Slack/Teams.
3. **Reliable trigger evaluation** — [#556](https://github.com/anthropics/skills/issues/556) (13 comments, 👍7): `run_eval.py` shows **0% trigger rate** — a fundamental gap in validating that skills actually fire. Demand for trustworthy skill-testing infrastructure.
4. **Context/token efficiency** — [#1487](https://github.com/anthropics/skills/issues/1487) (`claude-api` injects ~156k tokens) and [#1329](https://github.com/anthropics/skills/issues/1329) (compact-memory symbolic notation): strong appetite for **lazy-loading / compact memory representations**.
5. **Agent safety & governance skills** — [#412](https://github.com/anthropics/skills/issues/412) (agent-governance), [#1385](https://github.com/anthropics/skills/issues/1385) (Reasoning Quality Gate Pipeline): demand for **policy enforcement, adversarial review, and delivery verification** skills.
6. **Plugin packaging hygiene** — [#189](https://github.com/anthropics/skills/issues/189) (👍9): `document-skills` and `example-skills` install identical content → duplicate skills; demand for **clean plugin boundaries**.
7. **Skill authoring best practices** — [#202](https://github.com/anthropics/skills/issues/202): `skill-creator` reads like dev docs, not an operational skill — demand for **token-efficient, execution-oriented skill design**.

---

## 3. High-Potential Pending Skills

Active PRs not yet merged, ranked by update recency + novelty:

| PR | Skill | Why it may land soon |
|----|-------|---------------------|
| [#2108](https://github.com/anthropics/skills/pull/2108) | **docs: document skills snapshot status** | Updated 2026-11-03; clarifies sync relationship — likely fast-tracked as it resolves community confusion |
| [#2019](https://github.com/anthropics/skills/pull/2019) | **xlsx external links fix** | Updated 2026-11-03; fixes referenced issue #2013, focused scope |
| [#1742](https://github.com/anthropics/skills/pull/1742) | **mcp-builder streamable_http_client** | Updated 2026-10-08; blocks MCP work on `mcp>=2.0.0` — high priority |
| [#1980](https://github.com/anthropics/skills/pull/1980) | **webapp-testing shell=True removal** | Updated 2026-11-01; security fix, likely expedited |
| [#1792](https://github.com/anthropics/skills/pull/1792) | **docx LibreOffice timeout** | Updated 2026-11-01; reliability fix, aligned with issue #2018 |
| [#525](https://github.com/anthropics/skills/pull/525) | **pyxel retro game dev** | Updated 2026-11-01; long-running (since March) but still active — a rare *new capability* PR |
| [#1771](https://github.com/anthropics/skills/pull/1771) | **proofcore-contract-auditor (Web3)** | Updated 2026-09-16; novel domain (smart contract audit + TON anchoring) — may need more review |
| [#1615](https://github.com/anthropics/skills/pull/1615) | **scnet-hpc (Slurm/SSH)** | Updated 2026-08-24; niche but well-scoped HPC skill |

New-skill PRs also worth watching: [#1245](https://github.com/anthropics/skills/pull/1245) (notion-spec-to-implementation + quantitative-resume-auditor), [#1703](https://github.com/anthropics/skills/pull/1703) (md2video-audio), [#514](https://github.com/anthropics/skills/pull/514) (document-typography).

---

## 4. Skills Ecosystem Insight

**The community's most concentrated demand is reliability and trust of the skill layer itself** — not new capabilities: users want skills that actually trigger, don't silently fail, don't leak tokens or inject commands, and are provably official rather than namespace-impersonated.

---

# Claude Code Community Digest — 2026-11-08

## 1. Today's Highlights

No new releases or PRs landed in the last 24 hours, but issue activity remains heavy: a 727-upvote privacy complaint about email leakage via the `User-Agent` header is the dominant story, with 104 comments. Notably, a string of long-stale desktop/CLI bugs (#106772, #104359, #106323, #108077) are being freshly re-verified and updated, suggesting a maintainer triage sweep ahead of a fix window.

## 2. Releases

None in the last 24 hours. No changelog to summarize.

## 3. Hot Issues

1. **[#107757](https://github.com/anthropics/claude-code/issues/107757)** — *Privacy violation: email exposed in `User-Agent` header during web searches.* **727 👍 / 104 comments** — by far the most engaged item today; reporter argues this shouldn't be opt-in/opt-out at all. This is the issue to watch this week.
2. **[#97074](https://github.com/anthropics/claude-code/issues/97074)** — *Headless `claude -p` consumes ~1.8× more of the 5-hour window per token than interactive CLI.* **154 👍 / 72 comments** — a cost/limits regression with a clean repro; directly affects CI and scripting users.
3. **[#100684](https://github.com/anthropics/claude-code/issues/100684)** — *Auto mode ran `pkill -f "cat"`, which killed every GUI app on macOS.* — A cautionary tale about substring-matching destructive commands in auto mode; low votes but high severity.
4. **[#108216](https://github.com/anthropics/claude-code/issues/108216)** *(CLOSED)* — *Typing lag in Desktop Code tab: renderer 45% / main process 58–98% CPU.* — Closed quickly after report; worth noting as a fast turnaround.
5. **[#107144](https://github.com/anthropics/claude-code/issues/107144)** — *New account-email check (2.1.317+) denies local-only Bash calls in headless bypass runs (heredoc writes, curl to 127.0.0.1).* — New security gate is breaking legitimate local workflows.
6. **[#96508](https://github.com/anthropics/claude-code/issues/96508)** — *Regression of #86362: Desktop browser pane still blocks same-origin subresources resolving to 127.0.0.1 (ERR_BLOCKED_BY_CLIENT).* — Long-running Windows regression with a prior "completed" close that didn't ship a fix.
7. **[#95231](https://github.com/anthropics/claude-code/issues/95231) / [#94546](https://github.com/anthropics/claude-code/issues/94546)** — *Remote Control sessions hidden from the local `/resume` picker because they're written with `entrypoint: sdk-cli`.* — Same root cause across macOS and Linux; users can't resume remote sessions locally.
8. **[#104359](https://github.com/anthropics/claude-code/issues/104359)** — *CLI holding an env credential still renews the stored claude.ai login; on macOS sandboxed processes this splits credentials to `.credentials.json` and a later 400 wipes the login.* — Subtle auth-state corruption with security implications.
9. **[#108161](https://github.com/anthropics/claude-code/issues/108161)** *(updated 11-08)* — *Docs created via the Docs connector are unreachable to the session (read denied, Artifact 404, @Claude comments never delivered).* — Fresh MCP/integrations bug filed yesterday.
10. **[#106772](https://github.com/anthropics/claude-code/issues/106772)** — *Background sessions stop reporting terminal status via OSC 7501.* — Third-party terminal (herdr) integration regression; matters for TUI/agent-monitoring tooling.

Also worth flagging: **[#106458](https://github.com/anthropics/claude-code/issues/106458)** — *API plan shows "Credit balance too low" with $199 credit in interactive mode while `claude -p` works* (marked duplicate, still unresolved for the reporter).

## 4. Key PR Progress

No pull requests were updated in the last 24 hours. Nothing to report.

## 5. Hot Discussions

No Discussion data was provided in this dataset. Section omitted.

## 6. Feature Request Trends

Distilled from the issues updated in the last 24h:

- **Local-dev trust for the Desktop browser pane** — [#98551](https://github.com/anthropics/claude-code/issues/98551) (10 👍) asks to allow `*.lndo.site`, `*.ddev.site`, `*.lvh.me`, and similar hostfile-mapped domains; overlaps with the `127.0.0.1` regression in #96508.
- **Browser pane parity with normal browsers** — [#106887](https://github.com/anthropics/claude-code/issues/106887) requests Cmd+click / middle-click / `target=_blank` / right-click "open in new tab."
- **Remote Control maturity** — [#87190](https://github.com/anthropics/claude-code/issues/87190) (attach a terminal to a remote session on another machine) plus resume-picker fixes (#95231, #94546) and idle-timeout configurability (#104361).
- **Desktop UI persistence and polish** — [#104942](https://github.com/anthropics/claude-code/issues/104942) asks collapsed sidebar/project groups to stay collapsed across sessions; [#106323](https://github.com/anthropics/claude-code/issues/106323) notes the Desktop Code tab never shows prompt suggestions that the CLI does.
- **Agent-provided instruction feedback** — [#91764](https://github.com/anthropics/claude-code/issues/91764) (closed/stale) requests that Claude flag problematic instructions before executing them.

## 7. Developer Pain Points

- **Privacy and data leakage** — The `User-Agent` email disclosure (#107757) is the loudest signal of the day; expect it to dominate discussion until Anthropic responds.
- **Silent security/permission gates breaking local workflows** — #107144 (account-email check denies `127.0.0.1` and heredoc writes in headless runs), combined with #100684 (`pkill -f` matching `/Applications`), shows auto-mode and permission heuristics are cutting both ways.
- **Auth-state fragility on macOS** — #104359 describes credential splitting between Keychain and `.credentials.json` under sandboxed processes, with a later 400 wiping the login.
- **Cost/limit accounting inconsistencies** — #97074 (`claude -p` using ~1.8× window per token vs interactive) and #106458 (`Credit balance too low` despite funded API plan) undermine trust in usage accounting.
- **Remote Control / session-resume fragmentation** — Multiple reports (#95231, #94546, #104361) that remote sessions don't show up in `/resume`, appear as `host offline`, or silently time out after 4h idle.
- **Packaging/install regressions** — #108077 (VS Code extension 2.1.319 fails to install on macOS arm64 due to manifest asset fetch) and #96508 (Windows browser-pane regression reopened) indicate release QA gaps.
- **Stale-then-revived bug fatigue** — Several issues (#84604, #91707, #91757, #91758, #91762) closed as *stale* are being re-touched today; community sentiment is that auto-closing without fixes erodes trust.

---
*Source: github.com/anthropics/claude-code — issues updated 2026-11-07/08. No releases, PRs, or Discussions were available for this window.*

</details>

<details>
<summary><strong>OpenAI Codex</strong> — <a href="https://github.com/openai/codex">openai/codex</a></summary>

# OpenAI Codex Community Digest — 2026-11-08

## 1. Today's Highlights

A new alpha (`rust-v0.169.0-alpha.3`) shipped while the issue tracker remains dominated by three fronts: Windows desktop reliability (project sidebar, Computer Use, app-server), multi-device sync gaps (iOS/Android remote ↔ desktop), and rate-limit/usage-metering transparency. The PR queue shows heavy activity from the automated `copyberry` contributor, mostly wiring incremental "code mode" tool catalogs and hardening runtime authentication paths.

## 2. Releases

- **rust-v0.169.0-alpha.3** — `0.169.0-alpha.3` ([release](https://github.com/openai/codex/releases)). Release notes are effectively empty ("Release 0.169.0-alpha.3"), so no functional detail is available.

## 3. Hot Issues

1. **[#42739](https://github.com/openai/codex/issues/42739)** — *Local projects disappear from Windows sidebar after update* (81 comments, highest engagement). P0 for Windows desktop users: projects show "No projects" while chats and disk folders remain intact. Sustained community pressure since September with no fix.
2. **[#51524](https://github.com/openai/codex/issues/51524)** — *Windows Computer Use stops at `get_window_state`* (74 comments). Browser automation is effectively broken on Windows Edge/Chrome. High reaction volume indicates this blocks agentic workflows entirely.
3. **[#50428](https://github.com/openai/codex/issues/50428)** — *`AbsolutePathBuf` deserialization failure on chat turn/start and thread/fork* (42 comments). A serialization-level bug that breaks durable/cloud chat binding on Windows — a core app-server correctness issue.
4. **[#35420](https://github.com/openai/codex/issues/35420)** — *Stream disconnects on OneDrive-backed workspaces* (37 comments). Highlights a fragile interaction between Codex streaming and degraded cloud filesystems.
5. **[#36454](https://github.com/openai/codex/issues/36454)** — *iOS Remote project list out of sync with Desktop* (24 comments). Desktop is not treated as source of truth — a cross-platform state-management gap.
6. **[#48369](https://github.com/openai/codex/issues/48369)** — *Send button stays disabled after OpenAI quota exhaustion* (16 comments, 8 👍). A UX trap: users can't send even with custom models configured.
7. **[#51540](https://github.com/openai/codex/issues/51540)** — *Opaque "abuse prevention" blocks, no usage meter* (11 comments). Requests better transparency in rate-limit signaling.
8. **[#59690](https://github.com/openai/codex/issues/59690)** — *GPT-6.1 Terra burns ~15× limit per call; cached input billed at full price* (3 comments). Potentially high-impact billing regression from Nov 5.
9. **[#54400](https://github.com/openai/codex/issues/54400)** — *Windows sandbox leaks kernel access tokens (~33/cmd)*. Paged pool grows until reboot — a serious resource-leak/security-adjacent bug.
10. **[#58811](https://github.com/openai/codex/issues/58811)** — *VS Code extension fails with `renderer_ready_timeout` due to 3,203 eager modulepreload chunks*. Clear performance-rooted startup failure.

## 4. Key PR Progress

1. **[#60186](https://github.com/openai/codex/pull/60186)** — Create custom providers/gateways during sign-in (removes prior hard error).
2. **[#60181](https://github.com/openai/codex/pull/60181)** — Keyboard + mouse-wheel navigation for sidebar tabs (with leader shortcuts).
3. **[#60180](https://github.com/openai/codex/pull/60180)** — Fix trailing-space bug when skill mentions are followed by punctuation.
4. **[#60177](https://github.com/openai/codex/pull/60177)** — New metrics for incremental exec catalog updates (`codex.tools.exec_entry_updates`).
5. **[#60173](https://github.com/openai/codex/pull/60173)** — Tests ensuring exec catalog survives resume/fork/compaction.
6. **[#60163](https://github.com/openai/codex/pull/60163)** + **[#60157](https://github.com/openai/codex/pull/60157)** — Incremental code-mode tool definitions wired into sessions (avoids re-declaring `functions.exec`).
7. **[#60152](https://github.com/openai/codex/pull/60152)** — Persist local workspace side chats; add tab close controls.
8. **[#60101](https://github.com/openai/codex/pull/60101)** + **[#60096](https://github.com/openai/codex/pull/60096)** — Use runtime auth for Analytics; stop retrying terminal auth denials.
9. **[#30509](https://github.com/openai/codex/pull/30509)** + **[#30500](https://github.com/openai/codex/pull/30500)** — Allow `/review` while MCP servers initialize; run reviews without waiting on unfinished MCP servers.
10. **[#30880](https://github.com/openai/codex/pull/30880)** — Detect/migrate Vite+-managed Codex installs (doctor + update surfaces).

## 5. Hot Discussions

**Ideas**
- **[#21742](https://github.com/openai/codex/discussions/21742)** — Windows install location & storage control (12 👍, top-voted). Requests install path configurability for separate drives.

**Show and tell**
- **[#59121](https://github.com/openai/codex/discussions/59121)** — `agent-harness`: skills, rules, Stop hooks to force task completion.
- **[#60116](https://github.com/openai/codex/discussions/60116)** — Pushary: approve Codex actions from your phone via native hooks + MCP.
- **[#59147](https://github.com/openai/codex/discussions/59147)** — SnipToss: annotate generated images/videos, feed notes back as files.
- **[#60084](https://github.com/openai/codex/discussions/60084)** — LISA: local watcher for Codex/Claude Code/OpenCode sessions (metadata only).
- **[#59708](https://github.com/openai/codex/discussions/59708)** — Ordewell: goal → task graph → multi-agent runners using your authenticated Codex.
- **[#59844](https://github.com/openai/codex/discussions/59844)** — Cross-agent macOS skill catalog (Codex + Claude Code + OpenCode).
- **[#60185](https://github.com/openai/codex/discussions/60185)** — `agent-recap`: local searchable transcripts for Codex + Claude Code.
- **[#55013](https://github.com/openai/codex/discussions/55013)** — CSV Handoff Kit: browser CSV→XLSX preserving IDs/formulas as text.

## 6. Feature Request Trends

- **Cross-platform state consistency** — desktop as single source of truth for remote sessions, project lists, and chat history ([#36454](https://github.com/openai/codex/issues/36454), [#37659](https://github.com/openai/codex/issues/37659), [#36363](https://github.com/openai/codex/issues/36363)).
- **Extensibility surface** — public Codex Desktop Extension API/Extension Host ([#51138](https://github.com/openai/codex/issues/51138)).
- **Scale management UX** — sidebar improvements for users with many projects ([#35124](https://github.com/openai/codex/issues/35124)).
- **Usage transparency** — explicit usage meters, reset info, non-opaque limit messaging ([#51540](https://github.com/openai/codex/issues/51540), [#39398](https://github.com/openai/codex/issues/39398)).
- **Install & storage control** — Windows install path/storage customization ([#21742](https://github.com/openai/codex/discussions/21742)).
- **Ecosystem patterns (from Show and tell)** — hooks/MCP as integration points for approvals, annotations, and harness behaviors — signaling demand for a stable plugin/hook contract.

## 7. Developer Pain Points

- **Windows desktop reliability** dominates: sidebar/session loss, Computer Use `get_window_state` failures, app-server deserialization errors, and sandbox kernel token leaks ([#42739](https://github.com/openai/codex/issues/42739), [#51524](https://github.com/openai/codex/issues/51524), [#50428](https://github.com/openai/codex/issues/50428), [#54400](https://github.com/openai/codex/issues/54400)).
- **Computer Use on Windows** is broadly broken across multiple reporters, with unclear error paths — a blocker for agentic automation ([#59380](https://github.com/openai/codex/issues/59380), [#59791](https://github.com/openai/codex/issues/59791)).
- **Rate-limit & billing opacity** — unexplained quota consumption and non-resetting weekly windows cause user distrust ([#59690](https://github.com/openai/codex/issues/59690), [#39398](https://github.com/openai/codex/issues/39398), [#48369](https://github.com/openai/codex/issues/48369)).
- **Connective fragility** — stream disconnects and workspace-routing failures tied to cloud storage and auth discovery ([#35420](https://github.com/openai/codex/issues/35420), [#50211](https://github.com/openai/codex/issues/50211)).
- **CLI/TUI stability** — panics on terminal resize and sandbox nesting failures ([#54979](https://github.com/openai/codex/issues/54979), [#53799](https://github.com/openai/codex/issues/53799)).
- **MCP friction** — form elicitations silently auto-declined despite `on-request` policy ([#60158](https://github.com/openai/codex/issues/60158)).

---
*Note: The release notes for `rust-v0.169.0-alpha.3` contained no changelog detail, and several PR entries lacked comment counts (shown as `undefined` in source).*

</details>

<details>
<summary><strong>Gemini CLI</strong> — <a href="https://github.com/google-gemini/gemini-cli">google-gemini/gemini-cli</a></summary>

# Gemini CLI Community Digest — 2026-11-08

## 1. Today's Highlights

No new releases landed in the last 24 hours, but issue and PR activity remains intense, with the bulk of triage centered on the **agent/subagent subsystem** — recovery semantics, hangs, and config propagation. A notable security cluster of PRs (tainted shell commands, secret attachment via `@` paste, error-report temp files) is converging toward merge, suggesting a hardening push this cycle.

## 2. Releases

No new releases in the last 24 hours.

## 3. Hot Issues

1. **[#22323](https://github.com/google-gemini/gemini-cli/issues/22323)** — *Subagent recovery after MAX_TURNS reported as GOAL success.* Highest-comment issue today (13). The `codebase_investigator` subagent falsely reports `status: "success"`, masking real interruptions. High-impact for anyone relying on subagent output for correctness.

2. **[#19873](https://github.com/google-gemini/gemini-cli/issues/19873)** — *Zero-Dependency OS Sandboxing & Post-Execution Intent Routing.* Proposes leveraging Gemini 3's native bash affinity with sandboxing to preserve POSIX-tool workflows without sacrificing security. Strategic direction issue.

3. **[#21409](https://github.com/google-gemini/gemini-cli/issues/21409)** — *Generalist agent hangs.* 8 👍 — strong community signal. Deferring to the generalist agent causes indefinite hangs; workaround is to forbid subagent deferral. One of the highest-reaction bugs this cycle.

4. **[#22745](https://github.com/google-gemini/gemini-cli/issues/22745)** — *AST-aware file reads, search, and mapping.* EPIC exploring whether AST tools reduce misaligned reads and token noise. Active investigation with 7 comments.

5. **[#21968](https://github.com/google-gemini/gemini-cli/issues/21968)** — *Gemini doesn't use skills and sub-agents enough.* Anecdotal but widely resonant: the model won't invoke custom skills unless explicitly told. Directly impacts the value proposition of custom subagents.

6. **[#22267](https://github.com/google-gemini/gemini-cli/issues/22267)** — *Browser Agent ignores `settings.json` overrides.* Config merge happens in `AgentRegistry` but is discarded downstream (`maxTurns` etc.). Broken config contract.

7. **[#21983](https://github.com/google-gemini/gemini-cli/issues/21983)** — *Browser subagent fails on Wayland.* Linux desktop users hit a GOAL-termination false success; P1 with only 4 comments but clear platform impact.

8. **[#24246](https://github.com/google-gemini/gemini-cli/issues/24246)** — *400 error with >128 tools.* Tool sprawl breaks the request. Relevant as MCP/extension ecosystems grow.

9. **[#22672](https://github.com/google-gemini/gemini-cli/issues/22672)** — *Agent should stop/discourage destructive behavior.* Model occasionally uses `git reset` / `--force` where safer options exist. Safety-adjacent.

10. **[#30005](https://github.com/google-gemini/gemini-cli/issues/30005)** — *ACP: `BeforeTool`/`AfterTool` hooks do not run over ACP.* Hook-based tooling (auditing, policy) silently bypassed in editor integrations (Zed, JetBrains, VS Code). Recently triaged, one to watch.

## 4. Key PR Progress

1. **[#30196](https://github.com/google-gemini/gemini-cli/pull/30196)** — *Prevent always-allow rules for tainted shell commands.* Fixes a real escalation: choosing "Always allow" on a tainted command previously whitelisted the entire command root (e.g. every `npm ...`).

2. **[#30169](https://github.com/google-gemini/gemini-cli/pull/30169)** — *Keep pasted `@` text and fuzzy `@` matches from attaching secrets.* Closes a path where pasted shell transcripts could attach SSH private keys to model requests. Fixes #26730. Strong security value.

3. **[#30175](https://github.com/google-gemini/gemini-cli/pull/30175)** — *Apply local subagents' `generateContentConfig` for every model.* Fixes #30168: temperature/topP/thinkingConfig were only honored for `auto`.

4. **[#30171](https://github.com/google-gemini/gemini-cli/pull/30171)** — *Flag recursive and forced `rm` regardless of flag position.* `rm -r -f x`, `rm x -rf`, etc. previously slipped past `isDangerousCommand`. Part of #26767.

5. **[#30172](https://github.com/google-gemini/gemini-cli/pull/30172)** — *One result per tool-call ID in session records and live history.* Fixes #28004; removes remaining sources of `--resume` duplication.

6. **[#30170](https://github.com/google-gemini/gemini-cli/pull/30170)** — *Stop local subagents from waiting out their deadline on stalled model calls.* Adds optional per-turn response limit so a stalled call fails fast instead of burning the 3-minute budget.

7. **[#20273](https://github.com/google-gemini/gemini-cli/pull/20273)** — *Generate unique session IDs for subagents.* Previously subagents inherited the parent session ID, causing collisions under `.gemini/tmp/*/chats/` on abrupt exits.

8. **[#30088](https://github.com/google-gemini/gemini-cli/pull/30088)** — *Keep error reports out of the shared temp directory.* Moves `gemini-client-error-*.json` (which contain full chat history) to `~/.gemini/tmp/error-reports/` with user-only permissions.

9. **[#30051](https://github.com/google-gemini/gemini-cli/pull/30051)** — *Kill active shells and persist tool calls on headless interruption.* `gemini -p ... --yolo` interrupted mid-`run_shell_command` previously exited 0 and left detached processes.

10. **[#30020](https://github.com/google-gemini/gemini-cli/pull/30020)** — *Drop tool calls streamed by failed attempts on retry.* Prevents duplicated side-effecting tool executions after mid-stream retries.

## 5. Hot Discussions

No Discussions data was provided for this cycle; section omitted.

## 6. Feature Request Trends

- **AST-aware code intelligence** — #22745 and #22746 both push for AST-based reads/search/mapping to cut token noise and misaligned reads.
- **Persistent, file-based task tracking** — #18836 proposes deprecating `WriteToDo` in favor of CRUD-persisted task lists to survive context rot and sessions.
- **Subagent observability** — #22598 (`/chat share` for subagent trajectories), #21763 (subagent context in `/bug` reports), and #20273 (unique session IDs) all cluster around making subagent behavior inspectable.
- **Smarter agent self-knowledge** — #21432 asks the agent to accurately describe its own flags, hotkeys, and invocation patterns.
- **Token-frugal context strategies** — #19561 ("Tactful Extraction") proposes a surgical discovery hierarchy starting with `grep_search`.
- **Parallel / shared-memory subagents** — #18287 (blocked pending parallel subagent support) signals longer-term direction.
- **Subagent discovery via `settings.json`** — #18285; **curated example agents in-repo** — #18283.

## 7. Developer Pain Points

- **Silent false-success from subagents** (#22323, #21983): termination reasons report `GOAL`/`success` even when the actual result says otherwise, undermining trust in automation output.
- **Hangs and timeouts** (#21409, #30170-related): generalist agent deferral can hang indefinitely; stalled model calls consume full deadlines.
- **Config not honored** (#22267, #30175): `settings.json` overrides and per-model `generateContentConfig` were dropped in code paths, forcing users to debug behavioral surprises.
- **The model under-uses its own features** (#21968): custom skills and subagents go uninvoked unless explicitly named, blunting the value of configured extensions.
- **Safety regressions in shell heuristics** (#30171, #22672, #30196): flag-ordering bypasses and overly broad allow rules let dangerous commands slip through policy checks.
- **Tooling sprawl breaks requests** (#24246): too many tools cause 400s without automatic scoping.
- **Integration gaps** (#30005, #29901): core hook/steering infrastructure doesn't yet cover ACP-driven flows used by Zed, JetBrains, and VS Code.

---
*Generated from GitHub activity on google-gemini/gemini-cli for 2026-11-08.*

</details>

<details>
<summary><strong>GitHub Copilot CLI</strong> — <a href="https://github.com/github/copilot-cli">github/copilot-cli</a></summary>

# GitHub Copilot CLI Community Digest — 2026-11-08

## 1. Today's Highlights

A large batch of long-standing issues was closed today (16 of 26 updates), spanning sandbox correctness, terminal rendering, and platform-specific bugs. On the release side, `v1.0.108-1` and `v1.0.108-0` landed with sandbox/MCP restart fixes and new `/index` commands plus Windows enumerate-only filesystem grants. Meanwhile, extension and ACP/headless mode issues dominated newly filed reports, suggesting growing enterprise and non-interactive usage.

---

## 2. Releases

**v1.0.108-1**
- **Fixed:** PDF attachments on Grok 4.7 / 4.6 now fall back to file references instead of failing the turn.
- **Fixed:** With the sandbox enabled, a running local MCP server is restarted after `/cd`, so it adopts the new directory's denied paths rather than retaining the previous directory's.

**v1.0.108-0**
- **Added:** `sandbox.userPolicy.filesystem.enumeratePaths` in `settings.json` for Windows enumerate-only directory grants.
- **Added:** `/index` commands, with managed shared tgrep indexing enabled by default for eligible repositories.
- **Improved:** Answering questions about Copilot CLI behavior from this build.

---

## 3. Hot Issues

1. **[#5112 CLOSED] OSC 7501 program status support** ([link](https://github.com/github/copilot-cli/issues/5112)) — 20 👍, the most-upvoted item today. Enables terminals to display agent state (working/blocked) natively; strong terminal-integration demand.

2. **[#4695 OPEN] MCP OAuth tokens not reliably reused** ([link](https://github.com/github/copilot-cli/issues/4695)) — Duplicate cache-key entries force repeated re-auth for HTTP MCP servers. Persistent friction for anyone running OAuth-gated MCP tooling.

3. **[#3760 CLOSED] Ctrl+Enter vs Ctrl+Q mismatch on Windows** ([link](https://github.com/github/copilot-cli/issues/3760)) — 12 👍. UI advertises "ctrl+enter enqueue" but behavior differs; a high-visibility keyboard correctness fix.

4. **[#4977 / #4918 CLOSED] Bundled ripgrep crashes on 16KB/64KB-page ARM64 Linux** ([link](https://github.com/github/copilot-cli/issues/4977), [link](https://github.com/github/copilot-cli/issues/4918)) — jemalloc assumes 4KB pages, breaking search on Asahi Linux and other large-page kernels. Important for Linux-on-Apple-Silicon users.

5. **[#5368 CLOSED] Windows sandbox enforcement probe fails (`CreateProcessW` error 2)** ([link](https://github.com/github/copilot-cli/issues/5368)) — Affects managed `failIfUnavailable: true` deployments; enterprise sandbox reliability.

6. **[#4909 CLOSED] `/ide` finds no workspaces under sandbox** ([link](https://github.com/github/copilot-cli/issues/4909)) — `kill(pid,0)` EPERM misread as dead process; sandbox/IDE integration correctness.

7. **[#5382 OPEN] Skills vanish after `new_context`** ([link](https://github.com/github/copilot-cli/issues/5382)) — Extension-registered `skillDirectories` are lost on context clear and not restored on session resume; extension lifecycle gap.

8. **[#5370 OPEN] Agent output withheld until next user turn (Fusion/Auto)** ([link](https://github.com/github/copilot-cli/issues/5370)) — Long backgrounded shell commands make the agent appear stuck. High-impact UX bug for agentic workflows.

9. **[#5376 OPEN] `--acp` emits no OpenTelemetry traces or metrics** ([link](https://github.com/github/copilot-cli/issues/5376)) — ACP server mode silently drops all OTel signals despite enablement; enterprise observability blocker.

10. **[#5371 OPEN] Custom BYOK providers ignored in `--host-environment` / `--server`** ([link](https://github.com/github/copilot-cli/issues/5371)) — `COPILOT_PROVIDERS_CONFIG` works interactively but not in headless modes.

---

## 4. Key PR Progress

No pull requests were updated in the last 24 hours (total: 0 items). This section is omitted for today's digest due to lack of data.

---

## 5. Hot Discussions

No discussion data was provided for this period. This section is omitted.

---

## 6. Feature Request Trends

- **Terminal integration & rendering:** OSC 7501 program status (#5112), keyboard navigation for the chat timeline (#5378), and markdown table line-break rendering (#5168).
- **Command/skill controllability:** Disabling built-in slash commands to avoid collisions with custom review skills (#5375); persisting extension skills across context resets (#5382).
- **Budget/cost governance:** Token limits per task to prevent unpredictable premium-request spend (#3012).
- **Headless/enterprise parity:** OTel export in ACP mode (#5376) and BYOK provider support in `--server` / `--host-environment` modes (#5371).
- **Sandbox enterprise configuration:** Documented enterprise policy enforcement for the local sandbox (#3884).

---

## 7. Developer Pain Points

- **Sandbox inconsistency:** Multiple issues (#4909, #5368, #1486, #3884) point to sandbox behavior that diverges from interactive expectations — path classification, IDE discovery, and process probes.
- **Permission prompting fatigue:** Windows PowerShell approval parser still demands full-script review for simple `git` commands (#5379), while prompt-mode extension tools deadlock on unanswered permission requests (#5381).
- **Extension lifecycle reliability:** Extensions not starting for `create_session`-created sessions (#5380), skills disappearing after `new_context` (#5382), and unnameable extension tools via `--allow-tool` (#5381).
- **Platform-specific breakage:** ARM64 Linux ripgrep crashes (#4977, #4918), Windows path quoting (#4426), and keyboard shortcut mismatches (#3760, #5004).
- **Non-interactive/enterprise observability gaps:** Missing OTel in ACP mode (#5376) and ignored BYOK providers in server modes (#5371) frustrate teams deploying the CLI programmatically.

</details>

<details>
<summary><strong>OpenCode</strong> — <a href="https://github.com/anomalyco/opencode">anomalyco/opencode</a></summary>

# OpenCode Community Digest — 2026-11-08

## Today's Highlights

No new releases landed in the last 24 hours, but the issue tracker remains extremely active, led by the ongoing **free tier outage** (Issue #59387, now at 326 comments). Development activity centered on **V2 Core/CLI fixes** and **TUI plugin stability**, while a cluster of new PRs addressed desktop startup performance, session renaming, and Console event-watch integration. Community frustration over free-tier reset behavior and provider output corruption (reasoning/CoT leakage) continues to dominate the top of the tracker.

---

## Releases

No new releases were published in the last 24 hours.

---

## Hot Issues

1. **[#59387] [zen] Free tier issues: megathread** — 326 comments, 24 👍
   The central hub for free-tier problems (`Free usage exceeded`, broken daily resets, desktop version gates). Highest-traffic issue on the tracker; the reset-never-happens complaint is the dominant theme. https://github.com/anomalyco/opencode/issues/59387

2. **[#12472] Native Claude Code hooks compatibility (PreToolUse, PostToolUse, Stop)** — 21 comments, 42 👍
   Requests hook-parity with Claude Code beyond existing `CLAUDE.md`/skills support. Strong 👍 count signals real demand from teams migrating workflows. https://github.com/anomalyco/opencode/issues/12472

3. **[#60760] OpenAI-compatible stream fails when error has no message** — 7 comments
   `SchemaError: Missing key at ["error"]["message"]` kills sessions on providers that omit `message`. A tough interop bug affecting third-party OpenAI-compatible endpoints. https://github.com/anomalyco/opencode/issues/60760

4. **[#47665] [2.0] CLI(v2) positional directory resolved locally even with `--server`** — 7 comments
   `opencode2 <dir> --server <url>` fails with local `ENOENT chdir` for remote-only paths. Breaks remote-first workflows. https://github.com/anomalyco/opencode/issues/47665

5. **[#55268] big-pickle leaks chain-of-thought on literal ``** — 5 comments
   Reasoning boundaries break when the model emits the closing tag inside its own reasoning, streaming CoT to visible content. Provider-level correctness issue. https://github.com/anomalyco/opencode/issues/55268

6. **[#54371] ACP: slash commands execute but never stream output** — 5 comments, 5 👍
   Reproduced in JetBrains Rider 2026.2; plain prompts work, slash commands go silent. Blocks IDE-integrated users. https://github.com/anomalyco/opencode/issues/54371

7. **[#37844] core: cached locations multiply MCP subprocesses** — 5 comments
   ~10 repeated MCP process groups observed under a single managed service. A serious resource/performance concern for V2 architecture. https://github.com/anomalyco/opencode/issues/37844

8. **[#56297] Unable to install via winget on Windows** — 3 comments, 7 👍
   `No package found matching input criteria` for `Anomaly.OpenCode`. High 👍 relative to comments — install-path breakage on Windows. https://github.com/anomalyco/opencode/issues/56297

9. **[#62634] TUI plugins from scoped npm packages crash with "Invalid storage segment"** — 4 comments
   Storage key composes the raw plugin ID including `@scope/`, causing a `TypeError` on first storage access. Blocks scoped-package plugin authors. https://github.com/anomalyco/opencode/issues/62634

10. **[#61791] TUI crash: `ot_text_buffer_set_text failed: OutOfMemory`** — 2 comments
    Native Bun/OpenTUI crash with stack trace; notable because it's in the rendering layer rather than a model/provider path. https://github.com/anomalyco/opencode/issues/61791

---

## Key PR Progress

1. **[#62671] feat(server): include message times in session list** — `experimental.time.lastUserMessage` / `lastAssistantMessage` for accurate "last activity" sorting. Closes #62655. https://github.com/anomalyco/opencode/pull/62671

2. **[#62667] fix(desktop): stop blocking startup on the login shell probe** — Removes the blocking `$SHELL -il -c "env -0"` call at desktop main-process startup. Directly addresses startup latency complaints. https://github.com/anomalyco/opencode/pull/62667

3. **[#62662] feat(core): wake sessions on Console event watches** — Sessions can wake on Slack thread / GitHub PR / commit / Actions events. Notable new Console integration surface. https://github.com/anomalyco/opencode/pull/62662

4. **[#62664] feat(app): add `/rename` slash command** — Brings the TUI's `/rename <title>` to the desktop app, aligning the two surfaces. https://github.com/anomalyco/opencode/pull/62664

5. **[#62176] fix(core): keep Code Mode catalog updates small and stable** — Reduces ~2.2k-token catalog restatements by preventing cheapest-first reshuffling when servers join/leave. Meaningful token-cost improvement. https://github.com/anomalyco/opencode/pull/62176

6. **[#62141] fix(core): clearer shell exit/timeout status, pass unmatched zsh globs through** — `Exit code: N`, timeout duration reporting, and zsh glob passthrough instead of hard failure. https://github.com/anomalyco/opencode/pull/62141

7. **[#62670] feat(tui): emit OSC 133 turn boundaries in mini** — Automatic semantic prompt boundaries for terminal scrollback integration in `opencode mini`. https://github.com/anomalyco/opencode/pull/62670

8. **[#62615] fix(codemode): defer search index creation for known tool calls** — Avoids building the search index unless missing-tool suggestions are actually needed. Closes #62614. https://github.com/anomalyco/opencode/pull/62615

9. **[#62654] / [#62669] / [#62665] Shared nav + docs bar cleanup** — Consolidated product/logo menus across opencode.ai, docs, Data, Console, and status page, plus mobile/desktop docs-bar tidying. https://github.com/anomalyco/opencode/pull/62654 · https://github.com/anomalyco/opencode/pull/62669

10. **[#62660] fix(data): keep native `light-dark()` so shared nav menus get colors** — Follow-up fixing unreadable black-on-transparent menus introduced by the shared-nav PR. https://github.com/anomalyco/opencode/pull/62660

---

## Hot Discussions

No discussion data was provided for this digest window; this section is omitted.

---

## Feature Request Trends

- **Claude Code parity** — Hooks (`PreToolUse`, `PostToolUse`, `Stop`) remain the top-structured request (#12472, 42 👍). Teams want to port existing Claude Code automation without rewriting it.
- **Editing ergonomics** — Double-Esc to undo a just-sent message and restore it to the input (#52537), plus `/rename` reaching the desktop app (#62664).
- **Desktop UI/UX** — Session list grouping by project instead of date (#62436), archive-session shortcut fix (#62601), and general Windows desktop UI consistency feedback (#62647).
- **Structured session metadata** — Exposing last-message timestamps via API (#62655 → #62671) for accurate recency sorting in clients.
- **ACP / IDE integration maturity** — Telling ACP clients when a session's MCP tools are ready so the first prompt doesn't miss them (#62454), and fixing slash-command streaming (#54371).
- **Permission control** — Opt-out for persisting "Allow always" approvals so a one-off click can't silently override `ask` rules (#62432).

---

## Developer Pain Points

1. **Free tier reset reliability** — The dominant theme across #59387, #62452, and #62456: users report the documented reset time passing without any reset, effectively locking them out. "Reset never happens" is the most repeated complaint in the tracker.

2. **Reasoning / chain-of-thought leakage** — Multiple independent reports of reasoning boundaries breaking in *both* directions: CoT leaking into visible text (#55268) and finished replies persisted only as `reasoning` parts (#54861). Provider-side classification of `reasoning` vs `content` is fragile.

3. **OpenAI-compatible provider interop** — Strict schema requirements (`error.message` mandatory, #60760) and other provider quirks cause session-killing crashes on third-party endpoints.

4. **Reasoning stream truncation** — Sessions stopping mid-thinking with no error and no explanation (#62323, referencing #47025) remain unexplained and hard to diagnose.

5. **TUI plugin ecosystem instability** — A cluster of scoped-package, storage-key, and signal-reactivity bugs (#62634, #62666, #39986) suggests the plugin authoring surface isn't yet production-solid.

6. **Windows desktop polish** — Winget install failures (#56297), `ResizeObserver` loop storms emitting 33–37 MB renderer dumps (#62206), and inconsistent UIs across machines (#62647).

7. **Localized string / template rendering bugs** — Raw `{{path}}`/`{{error}}` placeholders surfacing in desktop menus (#61252) and untranslated/corrupted model output for Polish (#62411).

---

*Generated from github.com/anomalyco/opencode activity for 2026-11-08. Items are selected from the 50 most recently updated Issues and PRs.*

</details>

<details>
<summary><strong>Pi</strong> — <a href="https://github.com/earendil-works/pi">earendil-works/pi</a></summary>

# Pi Community Digest — 2026-11-08

## 1. Today's Highlights

No new releases landed in the last 24 hours, but issue activity remains intense, with 24 issues and 6 PRs updated. A cluster of newly filed (and quickly closed) triage items — Mistral/MiniMax provider gaps, tool-schema rejections, and streaming parser bugs — signals the team is actively clearing provider-integration debt. Meanwhile, cost-focused work on prompt cache warming in p2 (#11857) highlights growing attention to inference spend efficiency.

## 2. Releases

No new releases in the last 24 hours.

## 3. Hot Issues

1. **[#7547](https://github.com/earendil-works/pi/issues/7547) — Windows support strategy (94 comments, 👍2)**  
   The highest-traffic thread in the set. Petrroll asks how Pi should be run on Windows and which paths should stay core vs. be delegated. The volume of comments shows Windows is a major unresolved platform question.

2. **[#11021](https://github.com/earendil-works/pi/issues/11021) — GPT-6.1 Sol context window mismatch (👍8)**  
   Pi reports 272K context for `gpt-6.1-sol` via ChatGPT sign-in, while the account catalog advertises 500K. High upvote count reflects real user impact on compaction budgets.

3. **[#10862](https://github.com/earendil-works/pi/issues/10862) — Hardware cursor jumps during mouse selection**  
   A reproducible TUI rendering bug tied to the zero-width cursor marker. Distinct because it affects basic interaction correctness with `showHardwareCursor: true`.

4. **[#9690](https://github.com/earendil-works/pi/issues/9690) — OpenCode Zen rejects Pi session IDs (👍3, closed)**  
   HTTP 403 failures despite Pi sending `x-opencode-session`. Closed as no-action, but notable as a cross-tool interop failure.

5. **[#6415](https://github.com/earendil-works/pi/issues/6415) — Move `lastChangelogVersion` out of config (👍5, closed)**  
   Config-file pollution breaks dotfile/git-synced setups. Closed, but the underlying dotfile-management theme persists.

6. **[#10187](https://github.com/earendil-works/pi/issues/10187) — Move `deviceId` out of global settings (👍6, closed)**  
   Same theme as #6415: per-device identifiers shouldn't live in shared, git-tracked preference files. Strong upvotes confirm this is a popular gripe.

7. **[#11026](https://github.com/earendil-works/pi/issues/11026) — Permanently delete a conversation from pi-durable (👍4)**  
   Requests `harness.deleteConversation(id, ctx)`. A data-lifecycle gap in durable storage.

8. **[#11317](https://github.com/earendil-works/pi/issues/11317) — Customize SDK identity preamble without replacing defaults**  
   SDK users want a custom persona via `systemPromptOptions.sections.preamble` while keeping default tools/rules/docs. Directly paired with PR #11904.

9. **[#11122](https://github.com/earendil-works/pi/issues/11122) — `schemaToType` loses sibling type with `allOf`**  
   Codemode describes `find`/`replace` string args as `unknown` when Zod 4 emits `allOf`. A correctness bug in code-generation typing.

10. **[#10650](https://github.com/earendil-works/pi/issues/10650) — Codemode drops nested Error messages in `allSettled`**  
    Rejections serialize to `reason: {}`, losing actionable guidance — a real debuggability problem for codemode users.

## 4. Key PR Progress

1. **[#11857](https://github.com/earendil-works/pi/pull/11857) — Prompt cache warming in p2 (open)**  
   Fixes the 5-minute Anthropic prompt-cache expiry that caused 789 full-prompt rewrites (~$1,430, 26% of p2 spend) between Oct 12–Nov 5. High-value cost fix.

2. **[#11904](https://github.com/earendil-works/pi/pull/11904) — Custom system prompt preamble (closed)**  
   Lets SDK users give an agent a custom identity while retaining Pi's default tool descriptions, rules, and docs. Matches issue #11317.

3. **[#11906](https://github.com/earendil-works/pi/pull/11906) — Prevent uncaught `AbortError` on aborted file/session reads (closed)**  
   Fixes crashes when an `AbortSignal` fires mid file `read`/`stat` (e.g., unawaited `tools.read` in codemode).

4. **[#10810](https://github.com/earendil-works/pi/pull/10810) — Override `colorFn` in `CompactionStatusIndicator` (closed)**  
   Fixes #10809: themes without `borderColor` couldn't override `colorFn` or use reasoning level as color.

5. **[#11910](https://github.com/earendil-works/pi/pull/11910) — Neon + pgvector memory layer (closed)**  
   Replaces a blocked Mem0 path with `NeonMemoryStore` (pgvector cosine + pg_trgm fallback) and an `EmbedRunner`.

6. **[#11907](https://github.com/earendil-works/pi/pull/11907) — Orchestra supervisor + shotd + add-all (closed)**  
   Adds a supervisor and add-all override per user request; part of an orchestration initiative.

7. **[#11914](https://github.com/earendil-works/pi/issues/11914) — Extensible fullscreen scroll position (issue)**  
   Requests that extensions be able to read/move fullscreen transcript scroll position; paired with a community workaround discussion.

8. **[#11913](https://github.com/earendil-works/pi/issues/11913) — Strict providers reject `uniqueItems` in tool schemas (issue, closed)**  
   OpenAI-compatible strict providers return 400 when a tool schema contains `uniqueItems`; needs schema sanitization.

9. **[#11908](https://github.com/earendil-works/pi/issues/11908) — Split reused tool-call index on new named id (issue, closed)**  
   `openai-completions` should distinguish two tool calls reusing the same stream index but different ids.

10. **[#11906](https://github.com/earendil-works/pi/pull/11906) / [#11916](https://github.com/earendil-works/pi/issues/11916) — Provider stream robustness**  
    Alongside the abort fix, #11916 covers Mistral streaming `delta.content` as content-block arrays that rendered as `[object Object]` spam — a pair of concrete parser-hardening wins.

## 5. Hot Discussions

**Show and tell**
- **[#11912](https://github.com/earendil-works/pi/discussions/11912) — agentswarm.space task-discovery skill for Pi**  
  A published skill (`pi install git:github.com/andrewsiah/agentswarm-pi@v1.0.0`) for finding public tasks, registering, and submitting results. Demonstrates the emerging skill/install ecosystem.

**Q&A**
- **[#11911](https://github.com/earendil-works/pi/discussions/11911) — Pi vs. OMP for research work (GPT/DeepSeek)**  
  A CS student asks how Pi compares to the oh-my-pi fork on scientific reasoning, experimental design, and token efficiency. No replies yet — a good candidate for maintainer input.

## 6. Feature Request Trends

- **Config hygiene / dotfile compatibility:** Repeated calls (#6415, #10187) to move device-specific state (`lastChangelogVersion`, `deviceId`) out of shared, git-tracked config.
- **Provider expansion & parity:** Requests to add OAuth to `minimax`/`minimax-cn` (#11915), add Wally as a built-in provider (#11903), and fix context-window reporting (#11021). Custom OAuth callback rendering (#5372) also surfaced.
- **SDK customization:** Custom identity preambles (#11317 / #11904) and undoing the spread-copy in `wrapUIPromptContext` (#8829) point to demand for cleaner SDK extension surfaces.
- **Durable storage lifecycle:** Permanent conversation deletion (#11026) adds to a growing set of storage-management asks.
- **Codemode ergonomics:** Stateless single-shot text-model calls with thinking disabled (#11909), plus typing and error-serialization fixes (#11122, #10650).
- **TUI control:** Extensible fullscreen scroll position (#11914) and better line-break/selection semantics (#8019).

## 7. Developer Pain Points

- **Config file pollution from synced dotfiles:** Device- and version-specific fields in global settings force manual merge/sync work (👍5, 👍6 on the two closed issues).
- **Provider integration friction:** Session-ID rejection (#9690), context-window mismatch (#11021), strict schema rejections (#11913), streaming format handling (#11916), and reused tool-call indexes (#11908) are all provider-edge-case failures.
- **Abort/crash robustness:** Uncaught `AbortError` on aborted reads (#11906) is a hard crash, not a graceful degradation.
- **Codemode debuggability:** Serialized Errors losing messages (#10650) and schemas degrading to `unknown` (#11122) make generated code hard to reason about.
- **Cache/cost inefficiency:** The p2 prompt-cache finding (#11857) — $1,430 (26% of spend) over three weeks — reveals a silent, systemic cost leak.
- **Windows ambiguity:** #7547's 94-comment thread shows developers still lack a clear, supported story for running Pi on Windows.

</details>

<details>
<summary><strong>Qwen Code</strong> — <a href="https://github.com/QwenLM/qwen-code">QwenLM/qwen-code</a></summary>

# Qwen Code Community Digest — 2026-11-08

## 1. Today's Highlights

Release **v0.27.0** landed with test hardening for the interactive foreground-shell and managed-agent paths. The issue tracker is dominated by **Managed Agent capacity/performance concerns** (control-plane SQL growth, idle-reclamation model) and a cluster of **CI reliability problems** — including the long-running #14724 managed-agent gate failure (226 comments) and a new P1 proposal to isolate external PR CI on disposable runners. Several long-deferred review follow-ups were also closed out, signaling active convergence work on Web Shell and CLI bugs.

## 2. Releases

**v0.27.0** — https://github.com/QwenLM/qwen-code/releases
- `test(interactive)`: poll the foreground-shell frame instead of snapshotting it (#16455)
- `test(managed-agent)`: retarget the lifecycle test path
- (Release notes were truncated in the source data; the visible changes are test-infrastructure focused.)

## 3. Hot Issues

1. **#14724 — Main CI failed: Managed Agent gate — no test identified** (226 comments, still open since 2026-10-19)
   The longest-running open failure in the tracker. The managed-agent CI gate cannot identify a test to run, and the bot keeps appending failure markers. High comment volume reflects repeated re-triggers rather than resolution. https://github.com/QwenLM/qwen-code/issues/14724

2. **#13078 — Daily dependency CVE audit failed** (44 comments)
   Scheduled CVE audit has been failing since late September, possibly due to a new high-severity vuln or npm audit endpoint unavailability. Persistent security-hygiene noise. https://github.com/QwenLM/qwen-code/issues/13078

3. **#16514 — Isolate external PR CI with disposable runners** (P1, security)
   External PRs can execute contributor-controlled scripts on self-hosted runners, risking credential exposure. A concrete hardening proposal with 11 comments in under a day. https://github.com/QwenLM/qwen-code/issues/16514

4. **#15597 — Headless `-p` managed auto-memory can never save** (P1)
   In non-interactive default/Auto approval mode, the implicit edit/write_file deny overrides the memory agents' scoped allow — so auto-memory runs but writes nothing, wasting tokens. A sharp correctness bug in the memory subsystem. https://github.com/QwenLM/qwen-code/issues/15597

5. **#16320 — Managed Agent control-plane SQL grows with Session count/history** (P2, perf)
   Every resident Session renews leases, driving database work that scales with sessions × history length. Companion to memory-pressure issue #16234. https://github.com/QwenLM/qwen-code/issues/16320

6. **#15082 — Managed Agent: define a capacity and idle-reclamation model** (P2)
   No stated limit on Runtimes per server, memory per Runtime, or when idle sessions are reclaimed. Admission control is requested. Foundational for scaling the managed offering. https://github.com/QwenLM/qwen-code/issues/15082

7. **#16355 — Web Shell polls all trusted workspaces every 5s on idle welcome view** (P1)
   An embedded `sidebar={false}` shell still polls every workspace's `sessions/live-state` every five seconds while idle. Measured waste; straightforward but impactful fix. https://github.com/QwenLM/qwen-code/issues/16355

8. **#15875 — SDK stream-json: text snapshot changes message id after thinking** (P2)
   A response that streams thinking then text produces a final text snapshot whose `message.id` differs from the `message_start` id — a protocol-level bug for SDK consumers. https://github.com/QwenLM/qwen-code/issues/15875

9. **#15325 — stream-json past `--max-session-turns` returns success with previous answer** (P2)
   Silent failure mode: no model request is made, and the client receives a successful `result` repeating the prior answer. Dangerous for automation. https://github.com/QwenLM/qwen-code/issues/15325

10. **#12886 — Custom-provider guidance for 32K context models** (P3, need-discussion)
    Requests a documented way to trim the initial tool/system payload for small-context OpenAI-compatible providers, or a clear preflight error. Reflects growing BYO-model usage. https://github.com/QwenLM/qwen-code/issues/12886

## 4. Key PR Progress

1. **#16498 — feat(managed-agent): Tool v4 execution measurements**
   Adds attested executor measurements to Managed activity diagnostics; results and numeric measurements freeze together and persist before acknowledgement. https://github.com/QwenLM/qwen-code/pull/16498

2. **#16500 — feat(managed-agent): Skills and MCP self-service**
   Managed-operator self-service for Skills and MCP configuration. https://github.com/QwenLM/qwen-code/pull/16500

3. **#16525 — fix(cli): surface session turn limit in JSON and stream-json output**
   Directly addresses #15325: the turn-limit termination is now reported instead of silently returning the previous answer. https://github.com/QwenLM/qwen-code/pull/16525

4. **#16364 — fix(managed-agent): `--check` reads the configuration the server reads**
   Preflight previously used its own loader; now it matches server config resolution, eliminating false preflight results. https://github.com/QwenLM/qwen-code/pull/16364

5. **#16462 — fix(ci): run failure patrol on ECS with timed sandbox image pull**
   Moves both patrol jobs to self-hosted ECS behind the maintainer kill switch, with hosted fallback and a separately timed image pull so the classifier budget belongs to the model. https://github.com/QwenLM/qwen-code/pull/16462

6. **#15433 — fix(core): preserve OpenAI cache-write token usage**
   Preserves `prompt_tokens_details.cache_write_tokens` through both Chat Completions conversion paths for GenAI/OTel cache-creation telemetry (fixes #15414). https://github.com/QwenLM/qwen-code/pull/15433

7. **#14463 — feat(core): per-model auto-compaction thresholds**
   Adds optional `generationConfig.autoCompactThreshold` per model provider, overriding the global setting with the 0.85 default as fallback. https://github.com/QwenLM/qwen-code/pull/14463

8. **#15318 — fix(core): share compression cache for equivalent model selectors**
   Resolves #15197: selecting the current model for compaction no longer disables cache sharing when route/auth/endpoint are unchanged. https://github.com/QwenLM/qwen-code/pull/15318

9. **#14597 — fix(desktop): restore saved web previews**
   Allows the exact `about:srcdoc` URL through the navigation policy with regression coverage, restoring nested saved previews. https://github.com/QwenLM/qwen-code/pull/14597

10. **#15450 — feat(qqbot): agent sends local files to chat**
    Off-by-default per-channel switch exposing four tools (file/image/video/voice) with regular-file validation. https://github.com/QwenLM/qwen-code/pull/15450

## 5. Hot Discussions

No Discussions data was provided in the source. Section omitted.

## 6. Feature Request Trends

- **Managed Agent operations & capacity**: admission control, idle reclamation, capacity models (#15082), and self-service Skills/MCP (#16500).
- **Small-context / custom-provider support**: guidance and preflight for 32K-budget models (#12886).
- **Memory transparency & control**: `/memory show` to print the exact combined memory a session carries (#16517).
- **Configuration flexibility**: per-process `--config-dir` (#10984), per-model auto-compaction thresholds (#14463), and decoupled update notify vs. install (#14672).
- **Web Shell polish**: scroll-to-bottom in Split View (#16569), provider badges in the model dropdown (#16562), full tool args/results for expanded MCP cards (#15280).
- **CI/CD safety**: disposable runners for external PRs (#16514), failure-report refinements (#16319).

## 7. Developer Pain Points

- **CI instability and alerting gaps**: the managed-agent gate (#14724, 226 comments) has been failing for weeks; `main-ci-failure-issue.yml` ignores `cancelled` runs (#16272), so timed-out E2E legs silently hide breakage; the CVE audit (#13078) has been failing since September.
- **Silent, misleading success paths**: stream-json sessions past the turn limit return the previous answer as a successful result (#15325); text snapshots break message ids after thinking (#15875).
- **Token/cost waste from broken guards**: headless `-p` auto-memory runs but can never write (#15597); Web Shell polls all trusted workspaces every 5s while idle (#16355).
- **Deferred-review debt**: a steady stream of "deferred from PR #NNNNN" issues (#14388, #14389, #16471, #15973) shows the five-round convergence rule is accumulating follow-up work faster than it is cleared.
- **Managed Agent scaling unknowns**: no documented limits on Runtimes, memory, or lease-renewal DB load (#15082, #16320), leaving operators without admission-control knobs.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*