# AI CLI Tools Community Digest 2026-11-03

> Generated: 2026-11-03 02:52 UTC | Tools covered: 7

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
**Snapshot: 2026-11-03**

---

## 1. Ecosystem Overview

The AI CLI tooling landscape has matured into a **six-way competitive field** (Claude Code, OpenAI Codex, Gemini CLI, GitHub Copilot CLI, OpenCode, Pi, Qwen Code) now sharing a converging feature vocabulary — subagents, MCP, skills, sandboxes, and multi-model routing — while differentiating on ecosystem lock-in, hosting model, and monetization. Across all seven tools, the loudest signal is no longer "can it code?" but **operational trust**: the majority of today's top-voted issues concern safety-filter false positives, run-away costs, session durability, sandbox correctness, and cross-platform reliability — classic second-generation platform problems. Vendor-controlled tools (Claude Code, Codex, Gemini CLI, Copilot CLI, Qwen Code) increasingly ship *trust and safety guardrails* while open/fork-oriented projects (OpenCode, Pi) are pushing **control, composability, and standardization** (ACP, self-hosting, BYOK). Meanwhile, community-built UIs on top of Codex (Codex Hub, Mobile Workbench, Friday) and the ACP push on Pi signal the beginning of an **agent-client protocol layer** that will commoditize the front end.

---

## 2. Activity Comparison

| Tool | Issues (active today) | PRs (active today) | Discussions | Release status |
|---|---|---|---|---|
| **Claude Code** | ~10 noteworthy + ~20 closed dupes | 1 (closed) | N/A (channel not in dataset) | **v2.1.317** — safety/SDK hardening |
| **OpenAI Codex** | 50 updated | 50 updated (all `copyberry[bot]`, closed) | Ideas + Q&A + Show-and-tell active | **rust-v0.167.0-alpha.4** (no changelog) |
| **Gemini CLI** | 10 noteworthy | ~10 (mix open/closed) | N/A (channel not in dataset) | **v0.67.0-nightly.20261103** |
| **GitHub Copilot CLI** | 10 noteworthy (+3 closed) | 2 (1 off-scope) | N/A (channel not in dataset) | **v1.0.106-3 → -5** (3 point releases) |
| **OpenCode** | 10 noteworthy (#59387: 214 comments) | 10 (all open) | N/A (channel not in dataset) | **No release** |
| **Pi** | 10 noteworthy (+ several closed) | 10 (mix) | **2 active** (1 with 47 👍) | **v1.5.0** (regressions reported) |
| **Qwen Code** | 10 noteworthy (+CI cluster) | 10+ (heavy CI/managed-agent) | N/A (channel not in dataset) | **v0.26.6** + SDK v0.1.27 |

**Reading the table:**
- **Codex** shows by far the highest raw volume (50/50) but most PRs are **bot-batched and closed** — throughput, not community contribution.
- **Claude Code** has unusually low PR volume (1), consistent with its closed-development model where GitHub is largely an issue tracker.
- **OpenCode** is the only tool with a **dominant single thread** (#59387, 214 comments) — a de-facto status page for free-tier reliability.
- **Pi** and **Codex** are the only tools with active Discussions; where Discussions are not in the dataset, this reflects reporting/snapshot limits, not community silence.
- **Copilot CLI** and **Gemini CLI** show the fastest **release cadence** (point/nightly releases), while **OpenCode** shipped nothing today.

---

## 3. Shared Feature Directions

Six cross-cutting themes appear in **three or more** communities simultaneously:

| Theme | Tools asking for it | Concrete ask |
|---|---|---|
| **Cost & usage transparency** | Claude Code (#81691, #105240, #89865), OpenCode (#43250, #61276), Codex (#59041), Copilot CLI, Pi, Qwen Code (#16173) | Expose live token/budget accounting to the model; pre-flight fan-out confirmations; correct long-context pricing |
| **Session durability & continuity** | Qwen Code (#16169, #15799), Codex (#58998, #58865), OpenCode (#52154, #49827), Pi, Copilot CLI (#1857, #5338) | Survive SIGHUP/crash without losing queued messages or in-flight tool calls; per-session history isolation |
| **MCP lifecycle & permission granularity** | Codex (#33682, #56970, #58905, #16563), Copilot CLI (#3015, #5337), Claude Code (#62135), OpenCode | Reliable OAuth refresh, tool rediscovery, per-tool allow/deny (e.g. allow Playwright navigation but block page reads) |
| **Subagent observability & correctness** | Gemini CLI (#22323, #21409, #30094), Copilot CLI (#5339, #4106), Codex, OpenCode (#49842) | Don't report `GOAL`/success after `MAX_TURNS`; visible trajectories; agent-monitor views |
| **Sandbox & destructive-command safety** | Codex (#43343, #59009), Gemini CLI (#30095, #22672), Qwen Code (#13106), Pi, Copilot CLI | Prevent workspace escape on Windows/WSL; deny `git reset --hard`; AST/parse-aware shell classification |
| **Custom / local model support** | Copilot CLI (#3709, #5145, #4646), Qwen Code (#16157–#16159), OpenCode (#60383, #61110), Pi | Mid-session provider switching; correct handling of OpenRouter `:exacto`, Ollama HF tags, Bedrock ARNs |

Two **secondary themes** appear in exactly two communities but are strategically important:
- **ACP / interoperability** — Pi (#4444, 47 👍) and Codex (implicit via ecosystem UIs); Gemini CLI has an ACP-like VS Code companion.
- **Safety-filter false positives on benign work** — Claude Code (`[Bug][cyber]` dupe cluster from a single reporter), Copilot CLI (#5335, HTTP 422 cybersecurity flags) — the same complaint from two very different vendors.

---

## 4. Differentiation Analysis

### Focus & Target Users

| Tool | Primary focus | Target user | Technical stance |
|---|---|---|---|
| **Claude Code** | Enterprise-grade guardrails, Agent SDK, privacy-by-default | Teams, enterprise, prosumers | **Closed**; GitHub as issue tracker; heavy internal automation (Sonnet 5.5 triage) |
| **Codex** | Desktop/remote/cloud parity, MCP ecosystem | Pro users, IDE-native developers | **Rapid alpha iteration** (nightly-ish rust builds); large automated merge trains |
| **Gemini CLI** | Agent/subagent subsystem, AST-aware tooling | Linux-first developers, CI users | **Nightly cadence**; strategic bets on AST reads (#22745) and zero-dep sandboxing (#19873) |
| **Copilot CLI** | ACP integration, GitHub-native workflows | GitHub-entrenched teams | **Tight GitHub ecosystem fit**; ACP as a first-class non-interactive path |
| **OpenCode** | Project/session organization, free tier + Go subscription | Individual developers, hackers | **Fork-friendly**, opinionated UX; strongest on multi-project workflows |
| **Pi** | Composability, self-update, ACP | Tooling integrators, wrapper-based installs (mise/Nix) | **Extensible, spec-adopting** (ACP); active external contributors |
| **Qwen Code** | Web Shell as primary surface, Managed Agent runtime | Qwen-ecosystem developers, self-hosted | **Bundled SDK** (TS SDK ships with CLI); heavy CI/managed-agent investment |

### Distinctive Technical Approaches

- **Claude Code & Copilot CLI** treat trust-and-safety as a **first-class feature surface** (email-consent prompts, connector warnings in CC; policy diagnostics in Copilot CLI). This is a **vendor-responsibility model**.
- **Codex** is doing **systemic plumbing work** — typed transcript events (#59047), SQLite migration safety (#59015), path-based permission resolution shared across Linux bubblewrap and macOS Seatbelt (#59009). It reads like an infrastructure team building a platform, not a product team shipping features.
- **Gemini CLI** is the most **research-driven**: AST-aware reads, `Tactful Extraction`, and zero-dependency OS sandboxing as strategic EPICs.
- **OpenCode** and **Pi** are the only tools where the community **drives product direction** through PRs (e.g., Pi's #11704 backward-compat mandate; OpenCode's #61317 git-clone identity fix from an outside contributor).
- **Qwen Code** is unique in shipping a **TUI + Web Shell + Managed Agent runtime** as a single coherent stack — closer to a PaaS than a CLI.

---

## 5. Community Momentum & Maturity

### Momentum ranking (today's signal)

1. **Codex** — Highest raw throughput (50/50). Mixed maturity signal: the volume includes heavy bot churn and unresolved MCP reliability complaints (#33682, 22 👍).
2. **OpenCode** — Highest *engagement concentration*: a single megathread at 214 comments. Nothing else on the board is close. This is a **product-under-stress** more than a community-in-debate.
3. **Claude Code** — Strong issue engagement on a small number of high-👍 items (#95326, #88391, #60082). Mature, but citations center on **regressions and policy complaints**.
4. **Gemini CLI** — Steady, well-curated tracker with clear P1s. Community is engaged but **practitioner-sized**, not consumer-scale.
5. **Copilot CLI** — Small but **sharply focused**: two high-👍 items (#1857, #3709) dwarf the rest, and ACP parity work is **systematically closing** — a healthy sign of maturing integration surface.
6. **Pi** — Smallest community but **highest contributor leverage**: ACP discussion at 47 👍, external PRs on update correctness, and an explicit backward-compat governance push. A **high-signal, high-trust** community.
7. **Qwen Code** — Largest **CI-as-product** problem: three of its top issues are automated CI failures with 36–155 comments. Community momentum is real, but the visible backlog is **infrastructure debt**.

### Maturity signals

| Signal | Leaders | Laggards |
|---|---|---|
| Release discipline | Gemini CLI (nightly), Copilot CLI (point releases) | Codex (alpha-only, no changelog), OpenCode (no release today) |
| Issue triage quality | Claude Code (high-dup closure, Sonnet 5.5 triage bot), Gemini CLI (P-level tagging) | OpenCode (#61304: bot closes issues prematurely), Codex (MCP bugs "systematically ignored" per #33682) |
| External contribution culture | Pi, OpenCode | Claude Code (1 PR in window), Qwen Code (PRs dominated by CI/autofix) |
| Ecosystem/bystander tooling | Codex (Friday, Codex Hub, Kilobat, Bossanova), Pi (sandbox images on Docker Hub) | Claude Code, Gemini CLI |

**Rapidly iterating:** Copilot CLI (3 point releases in 24h), Gemini CLI (nightly + ~10 PRs), Codex (constant alpha churn).
**Stabilizing:** Claude Code (hardening release, low PR churn), Pi (v1.5.0 regression response).
**Under stress:** OpenCode (free-tier outage), Qwen Code (chronic CI), Codex (MCP reliability).

---

## 6. Trend Signals — What to Watch

### 1. Safety filters are the new compliance surface
Every vendor with a content-safety layer (Claude Code, Copilot CLI) is receiving **identical complaints** — benign work blocked, opaque category rules, no fast dispute path. For decision-makers: **evaluate the false-positive rate and the appeal path in any pilot**, not just the safety *category* list. Expect this to become an RFP line item in 2027.

### 2. Cost anxiety is turning into cost engineering
Complaints have shifted from "it's expensive" to "**I can't predict or bound the spend**" — runaway Opus fan-out in CC workflows (#89865), `keep.tokens` walks in OpenCode (#43250), uncounted cache writes (#59803), budget unawareness inside the model (#81691). The emerging pattern is **pre-flight confirmation + model-visible budgets + per-task accounting**. Tools that ship this first will win regulated/enterprise accounts.

### 3. Session durability is the next platform table stakes
SIGHUP message loss (Qwen Code #16169), "not recorded" tool calls on resume (#15799), cross-workspace chat bleed (Codex #25319 at 127 👍), and gap-ridden commit history (Copilot CLI) all describe the same UX failure: **agents are long-running now, but session semantics are still turn-oriented**. Durable, replayable, queryable session state is the top under-served platform primitive.

### 4. MCP is the interoperability fault line
OAuth refresh races, tool rediscovery gaps, and permission granularity appear in **four of seven** tools. The protocol succeeded; the **lifecycle story did not**. Watch for MCP-permission abstraction to get standardized (allow navigation but not page reads; allow read but not mutate), and for SDKs to expose MCP managers as first-class APIs (Codex's job list #60698, provider metadata #59033).

### 5. ACP and BYOK are the commoditization vectors
Pi's ACP proposal (47 👍) and Codex's ecosystem of third-party front ends (Codex Hub, Mobile Workbench, Friday) point the same direction: **the CLI is becoming a headless backend, and editors/UIs become interchangeable clients**. Copilot CLI's ACP parity work — including today's `includeCoAuthoredBy` fix — confirms this is being actively productionized. For developers: **design for ACP-style machine interfaces now**; for buyers: **openness here determines switching cost**.

### 6. Cross-platform breakage remains a hidden tax
Windows sandbox escape (Codex #43343), Windows git-permission bypass (Gemini #30095), WSL2 image paste and `/keep-alive`, macOS long-session CPU (Pi #7730), Fedora RPM gap (Qwen #16034), Linux VS Code SIGSEGV (Qwen #16127). **Almost every tool has a region- or platform-specific sharp edge today.** Practical implication: mandate cross-platform smoke tests in any multi-tool evaluation; do not assume Linux parity carries to Windows/WSL2.

### 7. "Agent hygiene" is becoming a discipline
Leftover tmp scripts (Gemini #23571), destructive `git reset --hard` tendencies (#22672), duplicate skills inflating context (Copilot CLI #4430), and permission-rule misclassification (#15780) are quality issues users now expect tools to **self-police**. Expect prompt-level and policy-level **guardrail defaults** to become a competitive axis, not a differentiator.

---

### Bottom line for technical decision-makers

- **For enterprise deployments:** Claude Code and Copilot CLI lead on guardrails but trail on external extensibility. Codex and Gemini CLI have the strongest engineering velocity. Evaluate all four on **safety false-positive rates and cost observability**, not features.
- **For platform builders:** ACP + BYOK + MCP lifecycle management are the three integration axes to standardize around; opencode and Pi are the most permissive contributors.
- **For individual developers:** OpenCode's free-tier instability and Qwen Code's CI backlog are near-term adoption risks; Pi's v1.5.0 regression is a reminder that rapid minor-version churn carries real upgrade cost.
- **Watch in the next 30 days:** whether Codex resolves its MCP reliability cluster, whether Claude Code ships any movement on usage transparency, and whether any tool formally adopts ACP as a first-class transport.

---

## Per-Tool Reports

<details>
<summary><strong>Claude Code</strong> — <a href="https://github.com/anthropics/claude-code">anthropics/claude-code</a></summary>

## Claude Code Skills Highlights

> Source: [anthropics/skills](https://github.com/anthropics/skills)

# Claude Code Skills — Community Highlights Report
*Data as of 2026-11-03 · Source: github.com/anthropics/skills*

---

## 1. Top Skills Ranking (Most-Discussed PRs)

> Note: The PR comment counts in the dataset are `undefined` (not exposed). Rankings below are based on **update recency, cross-referencing issue activity, and breadth of scope**, distinguishing PRs with sustained multi-month community attention.

| # | Skill / PR | Function | Discussion Highlights | Status |
|---|---|---|---|---|
| 1 | **mcp-builder fix** ([#1742](https://github.com/anthropics/skills/pull/1742)) | Repairs MCP v2 `streamable_http_client` rename and custom header handling | Tied to issue [#1390](https://github.com/anthropics/skills/issues/1390) (eval harness scores 0/N against real MCP servers); a critical-path fix for the entire MCP builder workflow | OPEN (updated 2026-10-08) |
| 2 | **skill-creator isolation fix** ([#1298](https://github.com/anthropics/skills/pull/1298)) | Isolates trigger evals, fixes Windows subprocess `select()` failures | Addresses false-miss trigger scoring; complements [#556](https://github.com/anthropics/skills/issues/556) (0% skill trigger rate) — the community's most-reported eval bug | OPEN (updated 2026-09-16) |
| 3 | **webapp-testing hardening** ([#1980](https://github.com/anthropics/skills/pull/1980)) | Removes `shell=True` command-injection risk (CWE-78) in `with_server.py` | Part of a **gerardrecinto/Pcmhacker-piro wave** of 3+ targeted fixes (#1975, #1976, #1977) to the webapp-testing & pptx toolchain | OPEN (updated 2026-11-01) |
| 4 | **docx correctness suite** ([#1792](https://github.com/anthropics/skills/pull/1792), [#1734](https://github.com/anthropics/skills/pull/1734)) | LibreOffice timeout now errors + verifies revision marks; orphaned-comment detection | Pair with issue [#2018](https://github.com/anthropics/skills/issues/2018) (merge_runs.py writes invalid XML) — docx is the **highest-bug-density skill** in the repo | OPEN |
| 5 | **pyxel retro-game skill** ([#525](https://github.com/anthropics/skills/pull/525)) | Python retro game creation, debugging, headless frame inspection | Oldest still-active PR (created 2026-03, updated 2026-11-01) — sustained author commitment signals a real niche demand | OPEN (9 months) |
| 6 | **notion-spec-to-implementation + resume-auditor** ([#1245](https://github.com/anthropics/skills/pull/1245)) | Converts product specs → Notion implementation tasks; audits resumes quantitatively | Two-for-one PR bundling; spec-to-task is a high-demand enterprise workflow | OPEN (updated 2026-10-15) |
| 7 | **md2video-audio** ([#1703](https://github.com/anthropics/skills/pull/1703)) | Markdown → MP4 with Marp + AI voiceover, zero-cost pipeline | Representative of the "content repurposing" skill cluster (video, slides, docs) | OPEN (updated 2026-09-15) |
| 8 | **document-typography** ([#514](https://github.com/anthropics/skills/pull/514)) | Prevents orphan wraps, widow paragraphs, numbering misalignment | Small but universal value — typography QC applies to every generated doc | OPEN (dormant since 2026-03) |

---

## 2. Community Demand Trends (from Issues)

Distilled from the 15 top-commented issues, five clear demand vectors emerge:

1. **Trust & supply-chain security** — Issue [#492](https://github.com/anthropics/skills/issues/492) (46 comments, the single most-discussed issue) flags community skills impersonating the `anthropic/` namespace. A related XSS vector surfaces in [#1394](https://github.com/anthropics/skills/issues/1394) (eval-viewer escapeHtml). *Demand: namespace provenance + sandboxing.*

2. **Skill distribution & org collaboration** — [#228](https://github.com/anthropics/skills/issues/228) (17 comments, 👍8) requests org-wide skill sharing in Claude.ai; [#189](https://github.com/anthropics/skills/issues/189) (👍9) reports duplicate skills from overlapping plugins. *Demand: a first-class shared skill library.*

3. **Evaluation harness reliability** — [#556](https://github.com/anthropics/skills/issues/556) (13 comments, 👍7) documents a 0% trigger rate; [#1390](https://github.com/anthropics/skills/issues/1390) shows mcp-builder scoring 0/N. *Demand: trustworthy, reproducible skill evals.*

4. **Context-budget discipline** — [#1487](https://github.com/anthropics/skills/issues/1487) reports `claude-api` eagerly injecting ~156k tokens in one call. *Demand: lazy/on-demand skill loading.*

5. **Agent reasoning & memory quality** — Proposals [#1385](https://github.com/anthropics/skills/issues/1385) (three-gate quality pipeline) and [#1329](https://github.com/anthropics/skills/issues/1329) (compact-memory symbolic notation) signal appetite for *meta-skills* that govern agent behavior rather than specific tools.

---

## 3. High-Potential Pending Skills

Active in the last 30 days, not yet merged — likely near-landing:

- **[#1980](https://github.com/anthropics/skills/pull/1980) webapp-testing security fix** — updated 2026-11-01; CWE-78 remediation, low-risk merge.
- **[#1792](https://github.com/anthropics/skills/pull/1792) docx timeout/verification** — updated 2026-11-01; narrow, well-scoped correctness patch.
- **[#1975](https://github.com/anthropics/skills/pull/1975) / [#1976](https://github.com/anthropics/skills/pull/1976) / [#1977](https://github.com/anthropics/skills/pull/1977) pptx & algorithmic-art fixes** — tidy argparse/modulo corrections from a repeat contributor, all with linked issues (#1809, #1891, #1897).
- **[#1681](https://github.com/anthropics/skills/pull/1681) skill-creator direct execution** — updated 2026-10-24; fixes `ModuleNotFoundError` and stale CLI paths.
- **[#1997](https://github.com/anthropics/skills/pull/1997) skill-creator YAML parsing** — updated 2026-10-19; corrects quote/continuation handling in frontmatter.
- **[#1615](https://github.com/anthropics/skills/pull/1615) scnet-hpc** — Slurm/SSH HPC cluster operations; niche but clearly scoped.
- **[#525](https://github.com/anthropics/skills/pull/525) pyxel** — refreshed 2026-11-01 after 9 months; strong revision signal.

---

## 4. Skills Ecosystem Insight

> **The community's most concentrated demand is not for more Skills, but for a trustworthy, correctly-evaluated, context-efficient foundation beneath them** — fixing security boundaries, trigger/eval reliability, and token budget before expanding the skill catalog.

---

# Claude Code Community Digest — 2026-11-03

## 1. Today's Highlights

Today's activity is dominated by a large batch of closed safety-filter false-positive reports (mostly duplicates from a single reporter), a new release (v2.1.317) focused on **connector and privacy guardrails**, and sustained community pressure around **usage limits, collaboration, and permission controls**. The most upvoted open items are not new features but longstanding platform issues: Reddit blocked in Claude in Chrome (#95326, 35 👍) and the regression of prompt suggestions in Desktop (#88391, 18 👍).

---

## 2. Releases

**v2.1.317** — safety and SDK hardening:
- `/schedule` now warns when a new cloud-scheduled task receives connectors the user didn't request, with removal instructions.
- New confirmation prompt before a web or shell tool call transmits the account email address to the network.
- Added `onFailure: "block"` for Agent SDK hooks.

These changes signal continued investment in **privacy-by-default** and **explicit consent** for outbound data, plus richer Agent SDK failure semantics.

---

## 3. Hot Issues (10 noteworthy)

1. **[#95326](https://github.com/anthropics/claude-code/issues/95326)** — *All tools blocked on reddit.com since 2026-09-18* (29 comments, 35 👍). The single most-engaged issue today. Community reaction: strong, since it's a hard block on a mainstream site, affecting browser-extension workflows.

2. **[#88391](https://github.com/anthropics/claude-code/issues/88391)** — *Prompt suggestions silently stopped appearing in Desktop (regression in 2.1.229)* (18 comments, 18 👍). A reproducible macOS regression with community confirming across versions.

3. **[#60082](https://github.com/anthropics/claude-code/issues/60082)** — *Real-time multi-user collaboration on a single session* (17 comments, 33 👍). Long-running enhancement request; still highly desired for team workflows.

4. **[#105240](https://github.com/anthropics/claude-code/issues/105240)** — *Max 5x weekly usage hit 94% in under 48h, worsening since Oct 24* (15 comments). Directly impacts paying Max users; cost/usage transparency remains a pain point.

5. **[#81691](https://github.com/anthropics/claude-code/issues/81691)** — *Expose live subscription budget & per-task token accounting to the model* (9 comments). Requests letting the model plan around budget instead of guessing.

6. **[#95539](https://github.com/anthropics/claude-code/issues/95539)** — *All naver.com domains blocked as false positive* (5 comments, 7 👍). Korea's primary portal blocked; daum.net/tistory.com unaffected — a clear regional false positive.

7. **[#102265](https://github.com/anthropics/claude-code/issues/102265)** — *`claude plugin validate` exits mid OAuth refresh, blanks login* (5 comments). Reproducible auth/credential race in short-lived subcommands.

8. **[#97907](https://github.com/anthropics/claude-code/issues/97907)** — *Roles: committed, selectable bundles of agent/settings/instructions/write-scope* (5 comments). Refiled after inactivity-bot closure; part of a larger "team role" theme.

9. **[#97908](https://github.com/anthropics/claude-code/issues/97908)** — *Session journal: local file sink for OTel events with privacy controls* (4 comments). Pairs with OTel gains; enterprise observability direction.

10. **[#89865](https://github.com/anthropics/claude-code/issues/89865)** — *Workflow verify stage fans out 20x past size guideline — 355 Opus 5 agents in one run* (3 comments). Runaway cost from agent fan-out; strong candidate for cost-preview/confirmation.

**Notable closed cluster:** ~20+ `[Bug][cyber]` false-positive reports from user **sworrl** (e.g., [#90854](https://github.com/anthropics/claude-code/issues/90854), [#90846](https://github.com/anthropics/claude-code/issues/90846), [#90832](https://github.com/anthropics/claude-code/issues/90832), [#90839](https://github.com/anthropics/claude-code/issues/90839)) were closed as duplicates. Their systematic triage format ("kind/domain/severity/request ID") suggests the safety filter's false-positive rate on benign general-domain work is a real, concentrated problem.

---

## 4. Key PR Progress

Only **one** PR was updated in the last 24h; there is no meaningful "top 10" this cycle.

1. **[#106583](https://github.com/anthropics/claude-code/pull/106583)** (CLOSED) — *Move issue triage and dedupe workflows to Claude Sonnet 5.5* by `bpasero-ant`. Migrates `claude-issue-triage.yml` (opus-4-6 → sonnet-5-5), `claude-dedupe-issues.yml` (sonnet-4-6 → sonnet-5-5), and `claude.yml`. **Why it matters:** signals Anthropic is standardizing internal automation on Sonnet 5.5 for cost/throughput on triage and dedupe — relevant given today's large duplicate-issue volume.

*Note: no other PRs were reported in the window, so a 10-item PR section would be fabricated.*

---

## 5. Hot Discussions

No Discussions data was provided in the dataset. **Section omitted.**

---

## 6. Feature Request Trends

Distilled from the open enhancements above:

- **Team & role governance** — Role-scoped bundles (#97907) and multi-user real-time collaboration (#60082) point to demand for team-grade access control and shared sessions.
- **Cost/usage transparency & control** — Expose live budget/token accounting to the model (#81691) and confirm-before-fan-out for workflows (#89865) reflect a push for spend visibility and guardrails.
- **Observability & auditability** — Local OTel event sink with privacy controls (#97908) and session journals for durable team records.
- **Conversation continuity** — "Conversation anchors" (#97906) to re-enter approved plans per item with a completion ledger.
- **Permission refinement** — Ongoing tuning of allow rules (see #62135 context: read-only vs. mutating commands like `curl`/`gh api`).

---

## 7. Developer Pain Points

- **Safety-filter false positives** are the loudest recurring frustration: benign general/reverse-engineering work halted mid-session (dozens of `[Bug][cyber]` reports today, mostly closed as duplicates). Users want a faster dispute/repro path, not just dedupe closure.
- **Regional and site-level blocks** — reddit.com (#95326) and naver.com (#95539) blocked despite no user policy; safety-category blocklists feel opaque.
- **Usage limits & cost surprises** — Max 5x users hitting 94% weekly in <48h (#105240) and workflows spawning hundreds of Opus agents (#89865) create anxiety and unexpected spend.
- **Auth/credential fragility** — Short-lived subcommands racing OAuth refresh blank the login (#102265); echoes prior concurrency-race issues.
- **Regressions in Desktop UX** — Prompt suggestions silently disappearing (#88391) erodes trust in incremental releases.
- **Permission-model friction** — Mutating-vs-read-only command handling still confuses users (#62135).

---

*Generated from GitHub data for anthropics/claude-code, snapshot 2026-11-03. Comment counts and 👍 reflect the reporting window.*

</details>

<details>
<summary><strong>OpenAI Codex</strong> — <a href="https://github.com/openai/codex">openai/codex</a></summary>

# OpenAI Codex Community Digest — 2026-11-03

## 1. Today's Highlights

The Codex repository shows intense activity across desktop, CLI, and MCP subsystems, with a new alpha release (`rust-v0.167.0-alpha.4`) landing alongside 50 issues and 50 PRs updated in the last 24 hours. Recurring themes dominate the tracker: MCP reliability, file attachment failures (XLSX/PPT) in the desktop app, and capacity/retry errors tied to the "Selected model is at capacity" server overload path. Notably, the top-voted issue (#25319, 127 👍) pushes for workspace-scoped VS Code chat sessions, while the long-running discussion #33682 (22 👍) escalates frustration over systematically unaddressed MCP bugs.

## 2. Releases

**rust-v0.167.0-alpha.4** — [Release](https://github.com/openai/codex/releases)
- Alpha build `0.167.0-alpha.4` published with no detailed changelog. Treat as an incremental pre-release; the community is currently running mixed versions (0.164.0 stable, 0.166.0-alpha.5.1, 0.167.0-alpha.4), which may explain several version-specific bug reports filed today.

## 3. Hot Issues

1. **[#25319](https://github.com/openai/codex/issues/25319) — Scope Codex VS Code chats to current workspace (57 comments, 127 👍)** — The highest-signal enhancement on the board. Developers want chat/thread history isolated per project instead of bleeding across workspaces. Massive community endorsement signals this as the single most-wanted IDE extension change.

2. **[#57641](https://github.com/openai/codex/issues/57641) — CLI @Browser fails with "browser access host unavailable" on Windows 11 (28 comments)** — Post-update regression (desktop app `26.1023.6123.0`) breaking browser tooling for Pro users on Brave/Windows. High engagement reflects browser-use being a core workflow.

3. **[#56645](https://github.com/openai/codex/issues/56645) — Local browser use disabled in Work settings (20 comments)** — Second Windows browser-access issue this cycle; suggests a broader permissions/settings regression rather than isolated config error.

4. **[#58302](https://github.com/openai/codex/issues/58302) — macOS XLSX attachments stuck pending with spinning Send (16 comments)** — File-upload pipeline failure on desktop `26.1027.30824`. Paired with #58432 and #59044 (same symptom on Windows), this is a cross-platform attachment regression.

5. **[#50879](https://github.com/openai/codex/issues/50879) — Published Codex Cloud Start skill missing from new task context (9 comments)** — Cloud skills not surfacing in new tasks undermines the Skills feature's reliability for Pro 200 users.

6. **[#53264](https://github.com/openai/codex/issues/53264) — Windows Remote: "Unable to resolve projectless chat folder" (8 comments, 4 👍)** — Remote desktop workflows break specifically for projectless chats, blocking a legitimate use pattern.

7. **[#58482](https://github.com/openai/codex/issues/58482) — Windows Computer Use reports wrong focused element (8 comments)** — Accessibility/automation correctness bug where Calculator index operations vary across window lifecycles; matters for anyone building on Computer Use.

8. **[#58824](https://github.com/openai/codex/issues/58824) — Persistent `serverOverloaded` on GPT-6.1 Sol (5 comments)** — Capacity errors blocking normal agent workflows on the newest model; several related reports (#57443, #59045, #57040) suggest a systemic retry/backoff regression.

9. **[#43343](https://github.com/openai/codex/issues/43343) — Destructive cleanup escaped workspace on Windows, recursively deleted files (2 comments)** — Low comment count but severe: a sandbox escape with real data-loss potential. Deserves urgent triage regardless of engagement metrics.

10. **[#58865](https://github.com/openai/codex/issues/58865) — Regression: commit 7ce5fa7 breaks cross-provider session resume (3 comments, 2 👍)** — Points to a specific commit; valuable for maintainers because it is bisectable and reproducible on Linux with custom models.

## 4. Key PR Progress

*Note: all listed PRs are already CLOSED and authored by `copyberry[bot]`, indicating a large automated/batched merge train.*

1. **[#59047](https://github.com/openai/codex/pull/59047) — Decode live transcript updates in cloud client** — Adds typed `Event::Transcript` (text, command output, file changes, turn state) instead of opaque protobuf bytes. Foundational for live observability in cloud sessions.

2. **[#59043](https://github.com/openai/codex/pull/59043) — Tie executor attachments to environment selection lifetimes** — Fixes connection-event leakage when executors are removed but old turn snapshots still reference them. Prevents stale-state bugs in multi-environment sessions.

3. **[#59041](https://github.com/openai/codex/pull/59041) — Expose assistant content token counts in completion notifications** — Adds `contentTokenCount` metadata to `item/completed`. Useful for cost tracking and context-budget tooling.

4. **[#59036](https://github.com/openai/codex/pull/59036) — Policy-aware fallback for model-selected search providers** — Honors host search restrictions while preserving provider ownership of browsing references.

5. **[#59033](https://github.com/openai/codex/pull/59033) — Web search provider metadata and configuration** — Introduces `ModelInfo.web_search_provider` (`standalone` / `search_mcp`) and `tools.client_search_provider`. Signals movement toward pluggable search backends.

6. **[#59015](https://github.com/openai/codex/pull/59015) — Safe SQLite schema migrations under concurrent startup** — Wraps schema checks and migrations in a single transaction with busy-retry. Fixes a real race caused by SQLx's no-op SQLite migration lock.

7. **[#59009](https://github.com/openai/codex/pull/59009) — Centralize filesystem permission resolution for sandbox enforcement** — Adds `resolve_for_enforcement` shared by Linux bubblewrap and macOS Seatbelt. Directly relevant to the sandbox-escape concerns in #43343.

8. **[#59007](https://github.com/openai/codex/pull/59007) — Host cycling and saved defaults for new TUI conversations** — Adds `leader b` to cycle hosts and persists the chosen host as default. Improves multi-backend TUI ergonomics.

9. **[#59000](https://github.com/openai/codex/pull/59000) — Hosted child threads inherit a root session ID** — New `InheritedSessionId` via `ExtensionDataInit` lets child threads share a root session while keeping distinct thread IDs. Enables coherent session grouping.

10. **[#58998](https://github.com/openai/codex/pull/58998) — Preserve steering on long-running turns** — Retains the evicted active turn in the replay buffer so steering survives `TurnStarted` eviction. Fixes a subtle UX failure in long agent runs.

## 5. Hot Discussions

### Ideas
- **[#27754](https://github.com/openai/codex/discussions/27754) — Codex plugin for reusable project guidance maps in AGENTS.md** — Generates a compact, refreshable `AGENTS.md` action map so future sessions start with codebase context. Practical and low-overhead.
- **[#9230](https://github.com/openai/codex/discussions/9230) — A higher-level visual interface for AI-driven development** — Argues developers should direct/evaluate at a system level rather than reading raw source. A vision piece worth reading for anyone designing agent UX.
- **[#59040](https://github.com/openai/codex/discussions/59040) — Codex Community Compute: idle PC resources as shared AI infrastructure** — Ambitious (and likely infeasible) proposal to crowdsource compute. Included for completeness as a signal of demand for cheaper capacity.

### Q&A
- **[#58905](https://github.com/openai/codex/discussions/58905) — Configuring MCP permissions when allowed tools expose disabled capabilities** — Concrete question about Playwright MCP: allow navigation/clicks but block arbitrary page reads. Highlights the granularity gap in MCP permissions.
- **[#40773](https://github.com/openai/codex/discussions/40773) — Why is the IntelliJ terminal input area so dark?** — Minor UX/theme regression (v0.149.1); low stakes but symptomatic of IDE integration polish debt.
- **[#16563](https://github.com/openai/codex/discussions/16563) — v0.118 requires constant MCP re-authorization** — Old but still active; the persistence problem echoes today's #56377 ("Always allow" not persisting).

### Show and tell
- **[#58912](https://github.com/openai/codex/discussions/58912) — Codex Mobile Workbench** — Self-hosted phone/PWA to direct native Codex on your own machine; preview/download results remotely.
- **[#58831](https://github.com/openai/codex/discussions/58831) — Codex Hub** — Web UI for Codex CLI with mobile access plus `ahub-control` skill for agent-to-agent coordination across projects.
- **[#58834](https://github.com/openai/codex/discussions/58834) — Friday** — MIT-licensed desktop app running Codex alongside Claude Code/Cursor, each in its own git worktree.
- **[#58849](https://github.com/openai/codex/discussions/58849) — code-review-skill** — Evidence-backed code review with a JSON merge gate; four probes run in fresh contexts for auditable findings.
- **[#58492](https://github.com/openai/codex/discussions/58492) — Bossanova** — Encrypted local vault with an MCP bridge so Codex can use API keys without exposing values in conversation. Directly addresses a real secret-handling concern.
- **[#58104](https://github.com/openai/codex/discussions/58104) — Kilobat** — Mac menu-bar network monitor tracking Codex/Claude/Gemini traffic, with an open-source CLI + MCP for agent inspection.

## 6. Feature Request Trends

- **Workspace/project scoping** — #25319 (127 👍) leads a clear demand for session isolation in the VS Code extension.
- **MCP lifecycle control** — #56970 (agent-callable MCP refresh/tool rediscovery) plus #16563, #58905, and #33682 show sustained demand for reliable reconnect, rediscovery, and finer permission granularity.
- **Cloud/remote workflow parity** — #50879 (Cloud skills), #53264 (Windows Remote projectless chats), and #58447 (dot thread reads) all point to gaps between local and cloud/remote behavior.
- **Capacity handling and retries** — #58824, #57443, #59045, #57040 cluster around `serverOverloaded` and automatic retry expectations.
- **Secrets and credentials UX** — #58492 and related vault tooling show community demand for keeping keys out of conversation context.
- **Higher-level agent interfaces** — #9230, #58912, #58831, #58834 reflect a growing ecosystem building UI layers (mobile, web, multi-agent) on top of Codex.

## 7. Developer Pain Points

1. **MCP reliability remains the top systemic complaint.** Discussion #33682 ("MCP bugs are systematically ignored," 22 👍) explicitly calls out OAuth and tool-discovery failures as production blockers. Today's #58637 (confirmation UI not visible, call expires after 2 min) and #56970 reinforce this.
2. **File attachments are broken across platforms.** XLSX/PPT uploads hang with a spinning Send on macOS (#58302, #58252), Windows (#58432), and recur today (#59044). This is a clear multi-platform regression needing a coordinated fix.
3. **Capacity errors with no graceful retry.** Multiple users report `serverOverloaded` / "Selected model is at capacity" blocking normal work, with #57040 (CLOSED) noting a retry regression — implying the fix may be partial.
4. **Sandbox and permission correctness.** #43343 (destructive cleanup escaped workspace) and #58401/#57822 (approval flows not resolving denials) indicate the sandbox/approval boundary still has sharp edges, particularly on Windows.
5. **Browser access instability on Windows.** #57641 and #56645 together suggest browser-use tooling is unreliable on Windows 11 after recent desktop updates.
6. **Version fragmentation.** Reports span 0.154.0 → 0.167.0-alpha.4, making triage harder and suggesting a need for clearer stable-channel guidance.

---
*Generated from github.com/openai/codex activity snapshot for 2026-11-03.*

</details>

<details>
<summary><strong>Gemini CLI</strong> — <a href="https://github.com/google-gemini/gemini-cli">google-gemini/gemini-cli</a></summary>

# Gemini CLI Community Digest — 2026-11-03

## 1. Today's Highlights

The Gemini CLI project continues its nightly cadence with v0.67.0-nightly.20261103, headlined by a fix ensuring interrupted Whisper model downloads aren't falsely treated as installed. Activity remains heavily concentrated in the **agent/subagent subsystem**, where long-standing bugs around turn-limit handling, generalist-agent hangs, and Wayland/browser failures continue to draw maintainer attention. Meanwhile, a fresh batch of PRs landed targeting telemetry correctness, Windows git safety, and headless interruption handling.

## 2. Releases

**v0.67.0-nightly.20261103.g0ac57c029** ([release](https://github.com/google-gemini/gemini-cli/compare/v0.67.0-nightly.20261102.g6814e00d6...v0.67.0-n))

- **fix(core): prevent interrupted Whisper model downloads from being treated as installed** ([#30058](https://github.com/google-gemini/gemini-cli/pull/30058) by @tadipavan) — Previously, a truncated or failed download left a partial file at `~/.gemini/whisper_models/<modelName>`, so `isModelInstalled()` returned `true` and blocked re-download attempts. Now the manager validates the completed artifact before marking it installed.

## 3. Hot Issues

1. **[#22323](https://github.com/google-gemini/gemini-cli/issues/22323) — Subagent reports GOAL success after MAX_TURNS** *(P1, 13 comments)*
   The `codebase_investigator` subagent reports `status: "success"` and `Termination Reason: "GOAL"` even when it hit the max-turn limit without completing analysis. This effectively **hides interruptions from callers and evals**, undermining trust in subagent telemetry. Currently tagged `status/need-retesting`.

2. **[#21409](https://github.com/google-gemini/gemini-cli/issues/21409) — Generalist agent hangs forever** *(P1, 8 comments, 8 👍)*
   Calls that defer to the generalist agent hang indefinitely (observed up to an hour). A workaround exists (instruct the model not to defer), but the root cause still needs fixing. Highest community upvote count in this batch — clearly a widespread pain point.

3. **[#21968](https://github.com/google-gemini/gemini-cli/issues/21968) — Gemini under-uses skills and subagents**
   Anecdotal but widely echoed: Gemini CLI rarely invokes custom skills or subagents autonomously, only when explicitly instructed. Directly limits the value of the skills ecosystem. Tagged `need-retesting`.

4. **[#19873](https://github.com/google-gemini/gemini-cli/issues/19873) — Zero-dependency OS sandboxing for bash affinity** *(P2, effort/large)*
   Proposal to lean into Gemini 3's native bash fluency (grep/sed/awk chains) with OS-level sandboxing so users get full power without security or UX compromises. A strategic direction-setting issue.

5. **[#22745](https://github.com/google-gemini/gemini-cli/issues/22745) — AST-aware file reads, search, and mapping (EPIC)** *(P2)*
   EPIC tracking whether AST-aware tooling can reduce turns, tokens, and misaligned reads. Companion issues [#22746](https://github.com/google-gemini/gemini-cli/issues/22746), [#22747](https://github.com/google-gemini/gemini-cli/issues/22747) investigate specific tools (`tilth`, `glyph`, `ast-grep`).

6. **[#21983](https://github.com/google-gemini/gemini-cli/issues/21983) — Browser subagent fails on Wayland** *(P1)*
   Browser subagent terminates with `GOAL` on Wayland sessions but produces no useful output — likely a display-server detection issue. A recurring Linux-environment blocker.

7. **[#22267](https://github.com/google-gemini/gemini-cli/issues/22267) — Browser Agent ignores `settings.json` overrides**
   `AgentRegistry` correctly reads the merged config, but the browser agent ignores it at runtime (`maxTurns` etc.). Config drift between initialization and execution.

8. **[#24246](https://github.com/google-gemini/gemini-cli/issues/24246) — 400 error with >128 tools** *(P2)*
   Gemini CLI hits HTTP 400 when tool count exceeds the limit. Expectation: the scheduler should scope tools more intelligently rather than blindly forwarding everything.

9. **[#23571](https://github.com/google-gemini/gemini-cli/issues/23571) — Model creates tmp scripts everywhere**
   When restricted to shell execution, the model scatters edit scripts across directories, complicating clean commits. A quality-of-life issue for anyone running the CLI on real repos.

10. **[#22672](https://github.com/google-gemini/gemini-cli/issues/22672) — Agent should discourage destructive behavior**
    Model occasionally reaches for `git reset` or `--force` when safer paths exist, and lacks awareness of DB modification risks. Ties directly to the permissions/safety thread running through the project.

## 4. Key PR Progress

1. **[#30106](https://github.com/google-gemini/gemini-cli/pull/30106) — chore/release: bump to 0.67.0-nightly.20261103** (bot)
   Automated nightly version bump, unblocking downstream release artifacts.

2. **[#30102](https://github.com/google-gemini/gemini-cli/pull/30102) — Log IDE connections with `ide_connection` event name**
   Fixes the long-standing inflation of session counts caused by logging every IDE connection as `start_session`. Cleaner telemetry for enterprise dashboards.

3. **[#30104](https://github.com/google-gemini/gemini-cli/pull/30104) — Refresh slash commands after `/skills link`** *(P2, help wanted)*
   Closes the last gap in skill discoverability — after linking a new skills path, the `/` menu now reflects them without restarting the session.

4. **[#30100](https://github.com/google-gemini/gemini-cli/pull/30100) — Handle stream failures during extension release downloads**
   Hardens `downloadFile` with stream error handling, partial-file cleanup, SSRF/redirect protections, and socket timeouts. Security-relevant.

5. **[#30095](https://github.com/google-gemini/gemini-cli/pull/30095) — Prevent Windows git diff permission bypass** *(P1, area/security)*
   Addresses a Windows-specific bypass where dangerous git arguments were misclassified as read-only. Extracts shared validation helpers for cross-platform consistency.

6. **[#30097](https://github.com/google-gemini/gemini-cli/pull/30097) — Image paste on WSL2 (WSLg clipboard + BMP fallback)** *(P2, help wanted)*
   Fixes [#22274](https://github.com/google-gemini/gemini-cli/issues/22274): WSLg doesn't set `XDG_SESSION_TYPE`, so clipboard detection silently failed. Adds `WAYLAND_DISPLAY`/`DISPLAY` fallbacks.

7. **[#30094](https://github.com/google-gemini/gemini-cli/pull/30094) — Show executing subagent tool calls in UI** *(P2, help wanted)*
   Fixes [#22589](https://github.com/google-gemini/gemini-cli/issues/22589): subagent tool calls that go straight to `Executing` (no approval needed) were dropped by the UI scheduler filter. Improves observability of subagent activity.

8. **[#30051](https://github.com/google-gemini/gemini-cli/pull/30051) — Kill active shells and persist tool calls on headless interruption**
   Fixes two bugs in headless mode: exit code 0 instead of signal code, and orphaned detached shell commands that survived Ctrl+C. Important for CI usage.

9. **[#29978](https://github.com/google-gemini/gemini-cli/pull/29978) / [#29977](https://github.com/google-gemini/gemini-cli/pull/29977) — `read_background_output` fixes** *(P2, help wanted)*
   Pair of fixes: (a) no longer drops boundary/oversized lines in the 64KB read window, and (b) properly honors the abort signal including during `delay_ms`. Directly improves background-job reliability.

10. **[#29953](https://github.com/google-gemini/gemini-cli/pull/29953) — Fix leaked `activate()` disposables in vscode-ide-companion**
    Removes stray parentheses that turned Disposable registrations into comma expressions, so `gemini.diff.accept` and workspace-folder listeners are actually disposed. Fixes [#27790](https://github.com/google-gemini/gemini-cli/issues/27790).

## 5. Hot Discussions

No Discussion data was provided in the source dataset. This section is omitted.

## 6. Feature Request Trends

Distilled from current issues:

- **Smarter context/token management** — AST-aware reads ([#22745](https://github.com/google-gemini/gemini-cli/issues/22745), [#22746](https://github.com/google-gemini/gemini-cli/issues/22746), [#22747](https://github.com/google-gemini/gemini-cli/issues/22747)), "Tactful Extraction" surgical reads ([#19561](https://github.com/google-gemini/gemini-cli/issues/19561)), and persistent file-based task tracking to replace `WriteToDo` ([#18836](https://github.com/google-gemini/gemini-cli/issues/18836)).
- **Better subagent orchestration** — subagent discovery via `settings.json` ([#18285](https://github.com/google-gemini/gemini-cli/issues/18285)), shared memory / parallel collaboration ([#18287](https://github.com/google-gemini/gemini-cli/issues/18287)), and visible trajectories via `/chat share` ([#22598](https://github.com/google-gemini/gemini-cli/issues/22598)).
- **Self-awareness / meta-skills** — accurate CLI flags, hotkeys, and self-execution ([#21432](https://github.com/google-gemini/gemini-cli/issues/21432)); curated in-repo example agents ([#18283](https://github.com/google-gemini/gemini-cli/issues/18283)).
- **Policy granularity** — per-workspace policy instead of global ([#18397](https://github.com/google-gemini/gemini-cli/issues/18397)).

## 7. Developer Pain Points

Recurring frustrations visible across the issue tracker:

1. **Subagent reliability and transparency** — silent success on failure ([#22323](https://github.com/google-gemini/gemini-cli/issues/22323)), indefinite hangs ([#21409](https://github.com/google-gemini/gemini-cli/issues/21409)), hidden subagent context in `/bug` reports ([#21763](https://github.com/google-gemini/gemini-cli/issues/21763)), and missing UI visibility ([#30094](https://github.com/google-gemini/gemini-cli/pull/30094)).
2. **Agent under-utilization of skills/subagents** ([#21968](https://github.com/google-gemini/gemini-cli/issues/21968)) — users invest in skills but the model rarely reaches for them autonomously.
3. **Configuration that silently doesn't apply** — browser agent ignoring `settings.json` ([#22267](https://github.com/google-gemini/gemini-cli/issues/22267)), and empty-but-set env vars resolving to `""` instead of defaults ([#30003](https://github.com/google-gemini/gemini-cli/pull/30003), [#30096](https://github.com/google-gemini/gemini-cli/pull/30096)).
4. **Environment-specific breakage** — Wayland browser subagent ([#21983](https://github.com/google-gemini/gemini-cli/issues/21983)), WSL2 image paste ([#30097](https://github.com/google-gemini/gemini-cli/pull/30097)), Windows git safety ([#30095](https://github.com/google-gemini/gemini-cli/pull/30095)).
5. **Interactive prompts blocking automation** — e.g., `vite create` stalling on its prompt ([#22465](https://github.com/google-gemini/gemini-cli/issues/22465)), headless interruption leaving orphan shells ([#30051](https://github.com/google-gemini/gemini-cli/pull/30051)).
6. **Workspace hygiene** — leftover tmp scripts ([#23571](https://github.com/google-gemini/gemini-cli/issues/23571)) and destructive command tendencies ([#22672](https://github.com/google-gemini/gemini-cli/issues/22672)).

---

*Generated 2026-11-03 from github.com/google-gemini/gemini-cli. Counts reflect data captured at generation time.*

</details>

<details>
<summary><strong>GitHub Copilot CLI</strong> — <a href="https://github.com/github/copilot-cli">github/copilot-cli</a></summary>

# GitHub Copilot CLI Community Digest — 2026-11-03

## 1. Today's Highlights

ACP mode received a concentrated bug-fix sweep: the long-standing `includeCoAuthoredBy: false` violation (#5133), missing plugin skills (#5269), ignored `skillDirectories` (#4700), and broken `/session delete|cleanup|prune` (#5268) all closed today, tightening the non-interactive integration surface. Alongside that, three rapid point releases (v1.0.106-3 through -5) shipped opt-in session management tools, policy refresh diagnostics, and fixes to `@file` mention parsing and the session picker. Community attention remains split between input/keyboard ergonomics (#1857 with 33 👍), multi-model/BYOK flexibility (#3709 with 34 👍), and a rising cluster of custom-provider API failures.

## 2. Releases

**v1.0.106-5**
- `includeCoAuthoredBy: false` is now honored in ACP mode — ACP clients no longer inject `Co-authored-by` trailers.
- Targeted `/settings` commands reflect the selected value immediately.
- Fixed a telemetry-disabled warning surfacing during session resume.

**v1.0.106-4**
- Empty sessions no longer flash into the session picker before disappearing.
- `@file` mentions wrapped in parentheses, brackets, braces, angle brackets, quotes, or backticks now attach correctly and expand in `!` shell commands.
- Custom agent fixes (details truncated in release notes).

**v1.0.106-3**
- **Added:** Opt-in session management tools and `@mentions` for opted-in local sessions.
- **Improved:** Managed-account policy refresh warnings now include Policy Helper findings and clear once the policy resolves.
- **Fixed:** Valid saved MCP OAuth credentials are now reused for anonymous connections.

## 3. Hot Issues

1. **[#1857](https://github.com/github/copilot-cli/issues/1857)** — *Cancel or remove enqueued messages* (15 comments, 33 👍). The top-voted open issue: once a message is queued via `Ctrl+Q`/`Ctrl+Enter`, there's no way to retract it. Users feel this is a basic control gap for long agent runs.

2. **[#3709](https://github.com/github/copilot-cli/issues/3709)** — *Mid-session model switching incl. BYOK/local providers* (14 comments, 34 👍). BYOK pins a session to one model and `/model` only lists GitHub-hosted models. High demand from users running local inference (DeepSeek, GLM, etc.).

3. **[#5112](https://github.com/github/copilot-cli/issues/5112)** — *OSC 7501 program status support* (5 comments, 11 👍). Request to emit terminal status reports (working/blocked) so supporting terminals can surface agent state natively.

4. **[#5185](https://github.com/github/copilot-cli/issues/5185)** — *Internal Datadog alert: bazel-cache memory usage vs limits* (3 comments). Bot-filed P3 incident against `copilot-runtime-bazel-cache` on dotcom-3-gc-cus-02; relevant to runtime infrastructure watchers.

5. **[#3015](https://github.com/github/copilot-cli/issues/3015)** — *MCP Authorization header dropped after initialize* (2 comments, 2 👍). OAuth 2.1 + DCR flow succeeds, but `tools/list` and `tools/call` omit the bearer token — a blocking integration bug for authenticated MCP servers.

6. **[#5145](https://github.com/github/copilot-cli/issues/5145)** — *400 `reasoning_text` must be passed back in thinking mode* (2 comments, 2 👍). Triggered by runtime-synthesized assistant turns after background shell exits on custom OpenAI-compatible providers. Niche but session-killing.

7. **[#4646](https://github.com/github/copilot-cli/issues/4646)** — *Compaction fails with "400 Tool choice must be auto"* (2 comments). Hits custom models via OpenRouter; referenced as a related blocker alongside #5145.

8. **[#5304](https://github.com/github/copilot-cli/issues/5304)** — *`/keep-alive` ineffective in WSL2* (2 comments). `systemd-inhibit` doesn't create a Windows host power request; long-running WSL sessions can still be interrupted by host sleep.

9. **[#4430](https://github.com/github/copilot-cli/issues/4430)** — *Duplicate skills from repo + plugin* (2 comments). Identical skills loaded twice, doubling the skill description surface — a token-cost and correctness issue for plugin-heavy repos.

10. **[#4891](https://github.com/github/copilot-cli/issues/4891)** — *`copilot.exe` hard crash 0xc0000005* (2 comments). Windows access violation loses in-flight turns and corrupts terminal state; a serious reliability concern.

*Also notable:* [#5335](https://github.com/github/copilot-cli/issues/5335) (repeated HTTP 422 cybersecurity-risk flags blocking legitimate local flaky-test debugging) and [#5318](https://github.com/github/copilot-cli/issues/5318) (ripgrep output compaction misattributing filenames/line numbers).

## 4. Key PR Progress

Only two PRs were updated in the last 24h:

1. **[#5339](https://github.com/github/copilot-cli/pull/5339)** — *Add read-only agent monitor TUI (Graph + Timeline)*. A `tools/agent-monitor` viewer for a selected local session, styled with Copilot CLI's own interface language, answering "which agent launched which, who waited on whom, and for how long." A direct response to subagent-observability demand (cf. closed issue #4106 on identity loss).

2. **[#5321](https://github.com/github/copilot-cli/pull/5321)** — *Add ADJU PHONE CAMERA Windows app*. Off-scope relative to the CLI: a Windows desktop app using PIN-authorized WebSocket signaling and direct WebRTC for phone-to-PC camera feeds. Likely to be redirected.

*Context from closures today:* [#5166](https://github.com/github/copilot-cli/issues/5166) (model started outside repository allowlist), [#5337](https://github.com/github/copilot-cli/issues/5337) (MCP OAuth trailing-slash resource mismatch), [#4789](https://github.com/github/copilot-cli/issues/4789) (Ctrl+C during selection cancels confirmation dialog), and [#3497](https://github.com/github/copilot-cli/issues/3497) (terminal clipping after resize, 11 👍) all closed.

## 5. Hot Discussions

No discussion data was provided; this section is omitted.

## 6. Feature Request Trends

- **Session control & lifecycle:** Canceling enqueued messages (#1857), composer draft read/restore for extensions (#5338), and reliable `--resume`/session-picker behavior (#5228) — users want full authority over in-flight and pending state.
- **Model flexibility:** Mid-session switching across GitHub-hosted, BYOK, and local providers (#3709) is the single loudest request, with custom-provider API correctness (#5145, #4646) as its blocker twin.
- **Terminal-native integration:** OSC 7501 program status (#5112), resize/reflow correctness (#3497), and clearer shortcut semantics (#3245) point to a push for first-class TUI citizenship.
- **Remote/voice control:** Voice mode from GitHub Mobile over `/remote on` (#5315) extends the remote-steering workflow beyond text.
- **Observability:** The agent-monitor TUI (#5339) and subagent source identity (#4106) reflect demand for visibility into multi-agent execution.

## 7. Developer Pain Points

- **Custom model providers are fragile.** Thinking-mode `reasoning_text` round-tripping (#5145) and `/compact` failing with "Tool choice must be auto" (#4646) both break sessions on OpenAI-compatible endpoints — BYOK users are hitting a wall precisely where flexibility matters most.
- **ACP mode lagged the interactive CLI.** Today's closures reveal a systematic pattern — settings (`includeCoAuthoredBy`, `skillDirectories`), plugin skills, session management, and subagent identity all behaved differently under `--acp`. ACP parity has clearly been a second-class path.
- **Input handling regressions persist.** Numpad navigation on Windows (#5171), Ctrl+C-vs-copy collisions (#4789, now closed), and Ctrl+G ambiguity (#3245) show keyboard ergonomics remains under-tested across platforms.
- **Reliability on Windows/WSL2.** A hard crash (#4891) and ineffective `/keep-alive` (#5304) make long-running sessions risky on the Microsoft-adjacent stack.
- **Tooling output fidelity.** Grep compaction corrupting filenames (#5318) and skill duplication (#4430) erode trust in built-in tools and inflate context costs.
- **False-positive safety blocks.** Repeated HTTP 422 cybersecurity-risk refusals (#5335) impede legitimate local debugging — a growing friction point for agentic workflows.

</details>

<details>
<summary><strong>OpenCode</strong> — <a href="https://github.com/anomalyco/opencode">anomalyco/opencode</a></summary>

# OpenCode Community Digest — 2026-11-03

## 1. Today's Highlights

No new releases landed in the last 24 hours, but activity on the tracker remains high. The free-tier outage megathread (**#59387**) continues to dominate with 214 comments, while several long-standing structural bugs around project identity, migration, and session isolation are now receiving fixes. Maintainer activity picked up on the PR side with new fixes for ACP session titles (**#61315**), git-based project identities (**#61317**), and stale location graphs (**#61314**).

## 2. Releases

No new releases published in the last 24 hours.

## 3. Hot Issues

1. **[#59387](https://github.com/anomalyco/opencode/issues/59387) — Free tier issues megathread** (214 comments, 👍16). The single largest community pain point: "Free usage exceeded" errors, non-resetting daily limits, and a desktop version that no longer loads. Effectively the de facto status page for Zen free-tier reliability.

2. **[#49827](https://github.com/anomalyco/opencode/issues/49827) — Non-git "global" sessions hidden after V1→V2 migration** (20 comments, 👍3). Reproduced migration bug where session history is invisible in the TUI. High-impact for upgraders who worked in non-git directories.

3. **[#55446](https://github.com/anomalyco/opencode/issues/55446) — Group sidebar sessions by project** (15 comments, 👍13). The most-upvoted UX request this cycle, asking for Codex-style collapsible project groups instead of a flat recent list.

4. **[#52958](https://github.com/anomalyco/opencode/issues/52958) — All payment methods declined from Italy** (14 comments, 👍2). A billing/geo-blocking issue blocking EU subscribers from purchasing OpenCode Go despite multiple card/wallet attempts.

5. **[#43250](https://github.com/anomalyco/opencode/issues/43250) — `keep.tokens` unbounded walk-back** (8 comments, 👍1). Documented 15K setting routinely exceeded to 234K in agent-driven sessions, causing runaway context costs. Reproduced.

6. **[#52154](https://github.com/anomalyco/opencode/issues/52154) — Message history isolation per session** (8 comments, 👍5). Up-arrow recall pulls the last prompt from *any* session, breaking multi-instance workflows.

7. **[#51191](https://github.com/anomalyco/opencode/issues/51191) — Nested project folders resolve to git root** (7 comments, 👍3). Sessions launched in subdirectories open at the repo root, so `.opencode/skills/` and other scoped discovery silently fail.

8. **[#61304](https://github.com/anomalyco/opencode/issues/61304) — Openbotjr closes issues prematurely** (4 comments). Community frustration with the triage bot closing tickets despite user replies; no way to @ the bot.

9. **[#61303](https://github.com/anomalyco/opencode/issues/61303) — New project in non-git folder resolves to `C:\` root** (4 comments). Windows-specific variant of the project-identity problem; initializing git in the folder did not help.

10. **[#49842](https://github.com/anomalyco/opencode/issues/49842) — Background subagents, monitors, cron, worktree isolation** (4 comments, 👍1). A substantial fork proposal offering upstreamable agent-orchestration features.

## 4. Key PR Progress

1. **[#61317](https://github.com/anomalyco/opencode/pull/61317) — Give independent git clones distinct project identities.** Fixes the long-standing issue where projects keyed by remote URL collapse separate clones into one project (refs #35674, #29869, #42315, #35873, #29871).

2. **[#61314](https://github.com/anomalyco/opencode/pull/61314) — Rebuild a location after its directory becomes a git repo.** Closes #61009; fixes empty `session list` output when a folder was first opened pre-`git init`.

3. **[#61315](https://github.com/anomalyco/opencode/pull/61315) — Forward session title updates via `session_info_update`.** Closes #56894; `opencode acp` never surfaced generated titles, so ACP clients showed blank names.

4. **[#60698](https://github.com/anomalyco/opencode/pull/60698) — Experimental job list endpoint.** Exposes `Job.Service` (shell, subagent, image jobs) over HTTP, giving CLI/SDK callers visibility into background work.

5. **[#61311](https://github.com/anomalyco/opencode/pull/61311) — Show model usage in Settings → Models.** Small UX win: indicates which configured models you've actually used.

6. **[#60867](https://github.com/anomalyco/opencode/pull/60867) — Independent sidebar mode.** Opt-in fourth sidebar interface for parallel work; draft awaiting maintainer design review (refs #60241).

7. **[#61228](https://github.com/anomalyco/opencode/pull/61228) — Opt-in native input parsing.** Adds a "Native input parser" toggle to `/experiments` via the existing `experimental["native-input"]` config.

8. **[#59803](https://github.com/anomalyco/opencode/pull/59803) — Price Copilot long-context tiers and cache writes.** Fixes severe cost undercounting on long Copilot/Claude sessions (closes #52089).

9. **[#57555](https://github.com/anomalyco/opencode/pull/57555) — Preserve undo on conflicting compaction.** Prevents a rejected manual compaction from confirming staged undo and clearing redo.

10. **[#61299](https://github.com/anomalyco/opencode/pull/61299) — `@`-mention files outside the project directory.** Ports the V1 implementation to V2 (refs #16463, #16464).

## 5. Hot Discussions

No discussion data was provided for this digest window; this section is omitted.

## 6. Feature Request Trends

- **Project/session organization**: Grouped sidebars by project (**#55446**), named project groups (**#39284**), and session pinning in Desktop (**#55764**) collectively point to a strong demand for better multi-project navigation.
- **Session isolation & recall control**: Per-session prompt history (**#52154**), a `prompt.history_scope` setting (**#55261**), and Desktop session pinning all target the same root frustration — cross-session state bleed.
- **Model/provider filtering**: Requests for an inverse of `OPENCODE_DISABLE_FREE_MODELS` (**#60383**) and for `provider.<id>` whitelist/blacklist to actually affect the picker (**#61110**) show users want tighter control over which models appear.
- **Regional serving & billing fairness**: US/EU hosting for DeepSeek models on Go (**#61077**) and the Italy payment block (**#52958**) indicate growing demand for region-neutral subscription fulfillment.
- **Agent orchestration**: Background subagents, monitors, cron, and worktree isolation (**#49842**) reflect appetite for autonomous, parallelized agent workflows.

## 7. Developer Pain Points

1. **Free-tier reliability**: Issue **#59387** (214 comments) and **#61152** (persistent 429s since Oct 24) dominate. Non-resetting daily limits and unexplained resets are the top trust-eroding problems.
2. **Project identity instability**: Sessions resolving to `C:\`, git repo roots, or collapsing same-URL clones (#61303, #51191, #49827, #61009) form a cluster of related bugs that silently break skills discovery and session listing.
3. **Context/token governance**: `keep.tokens` being ignored (**#43250**) and cache invalidation every 1–2 turns on Go (**#61276**) indicate cost and context control remain unreliable in agent-driven sessions.
4. **Billing friction**: The Italy block (**#52958**) shows geo-restricted payment failures that no workaround currently resolves.
5. **Triage bot behavior**: **#61304** highlights a meta-frustration — Openbotjr closing tickets with "haven't heard back" despite user replies, with no way to appeal.
6. **Gateway/provider errors**: Invalid-JSON gateway responses bricking sessions (**#60753**) and 400s when `provider.only` is restricted (**#61261**) point to persistent gateway-layer fragility.

</details>

<details>
<summary><strong>Pi</strong> — <a href="https://github.com/earendil-works/pi">earendil-works/pi</a></summary>

# Pi Community Digest — 2026-11-03

## 1. Today's Highlights

Pi **v1.5.0** shipped with extension update changelogs, but the release is already generating fallout: issue [#11687](https://github.com/earendil-works/pi/issues/11687) reports tool-call failures (`basispoints_tool_arguments_stalled`) on Windows after upgrading, and PR [#11704](https://github.com/earendil-works/pi/pull/11704) calls for a backward-compatibility policy after 1.5.0 removed the `Type` export from `@earendil-works/pi-ai`, breaking downstream packages. Meanwhile, a wave of `pi update` correctness fixes ([#11707](https://github.com/earendil-works/pi/pull/11707), [#11709](https://github.com/earendil-works/pi/pull/11709), [#11711](https://github.com/earendil-works/pi/pull/11711)) landed from contributor `petrroll`, tightening how self-updates verify installed versions.

## 2. Releases

**v1.5.0**
- **Extension update changelogs**: Users now see what changed in installed extension packages on the first fresh launch after an update. Package authors control the changelog path; a `collapseChangelog` option condenses the notices.
- ⚠️ Follow-up concern: [#11687](https://github.com/earendil-works/pi/issues/11687) (tool-call stalls on Windows) and PR [#11704](https://github.com/earendil-works/pi/pull/11704) (removed `Type` export breaking `@flue/runtime@2.3.0`) suggest this minor release introduced regressions.

## 3. Hot Issues

1. **[#7730](https://github.com/earendil-works/pi/issues/7730) [OPEN] High CPU usage on macOS with long sessions** — 23 comments, 11 👍. The longest-running active thread; CPU swings 50–110% correlated with session length. Highest community engagement of any open bug.
2. **[#7885](https://github.com/earendil-works/pi/issues/7885) [CLOSED] npm search not indexing new pi-packages** — 19 comments. Newly published packages never appeared on the pi.dev gallery since Aug 4. Closure unblocks extension discovery for all package authors.
3. **[#9549](https://github.com/earendil-works/pi/issues/9549) [OPEN, inprogress] Large transcripts re-render every frame** — 17 comments. Full-transcript re-emission on resize saturates a core on Windows Terminal; agent-drafted, measurement-backed report.
4. **[#10956](https://github.com/earendil-works/pi/issues/10956) [OPEN] `cacheWarming: "idle"` silently stops** — 11 comments. Idle cache warming never fires when an extension handles `turn_end` and context holds custom/compaction messages — a subtle, costly perf bug for extension-heavy setups.
5. **[#9134](https://github.com/earendil-works/pi/issues/9134) / [#9557](https://github.com/earendil-works/pi/issues/9557) [Anthropic adapter drops root-level JSON Schema keywords]** — Two related reports on the same root cause: root `anyOf`/`oneOf` stripped from non-strict tool schemas, silently weakening validation semantics for custom tools.
6. **[#10954](https://github.com/earendil-works/pi/issues/10954) [CLOSED, p0] 400 on replayed thinking block after tool list change** — 7 comments. `block_binding` only sent for `supportsMidConvoEffort`; downstream apps hit 400s mid-session.
7. **[#11021](https://github.com/earendil-works/pi/issues/11021) [OPEN] ChatGPT sign-in uses 272K context for GPT-6.1 Sol despite 500K account catalog** — 7 👍. Under-reported context budget leads to premature compaction for ChatGPT-authenticated users.
8. **[#11527](https://github.com/earendil-works/pi/issues/11527) [OPEN] New `BedrockRuntimeClient` per request** — 5 comments. Fresh HTTP/2 session + SSO `GetRoleCredentials` round trip on every model call — a significant latency tax for Bedrock/SSO users.
9. **[#9276](https://github.com/earendil-works/pi/issues/9276) [OPEN, inprogress] grep with context lines can cause OOM** — Headless SDK users hit heap exhaustion because matched files are read whole. Fixed by PR [#11705](https://github.com/earendil-works/pi/pull/11705).
10. **[#11691](https://github.com/earendil-works/pi/issues/11691) [CLOSED] Extension loader imports `*.test.ts`, killing host process** — A self-executing test's `process.exit(0)` took down a pi-web server twice. Sharp reminder that the extension loader auto-imports every top-level `.ts`/`.js` file.

## 4. Key PR Progress

1. **[#11705](https://github.com/earendil-works/pi/pull/11705) [OPEN] grep context from ripgrep instead of reading matched files** — Fixes the OOM in [#9276](https://github.com/earendil-works/pi/issues/9276); memory now scales with output, not file size.
2. **[#11545](https://github.com/earendil-works/pi/pull/11545) [OPEN] Anthropic message threads** — Makes incremental use of Anthropic's server-side message-threads beta; sends only new turns when caching is enabled.
3. **[#11712](https://github.com/earendil-works/pi/pull/11712) [CLOSED] Leave room for OpenRouter input overcount when clamping max tokens** — OpenRouter's tokenizer counted up to 12% more input than the provider, causing rejections for near-window models (e.g., DeepSeek Flash).
4. **[#11704](https://github.com/earendil-works/pi/pull/11704) [OPEN] Require backward compatibility in AGENTS.md, tag shims** — Direct response to the 1.5.0 `Type` export removal; agents must preserve public APIs outside majors.
5. **[#11707](https://github.com/earendil-works/pi/pull/11707) [CLOSED] List updated packages with version changes in `pi update`** — Users can finally see which extensions changed and to what version.
6. **[#11709](https://github.com/earendil-works/pi/pull/11709) / [#11711](https://github.com/earendil-works/pi/pull/11711) [CLOSED] Verify the actually installed version after self-update** — Stops `pi update` from reporting success when npm re-resolved stale registry metadata.
7. **[#11629](https://github.com/earendil-works/pi/pull/11629) [CLOSED] `PI_SELF_UPDATE_COMMAND` / `selfUpdateCommand`** — Lets mise/Nix/wrapper-managed installs specify how `pi update` should update Pi, addressing [#7756](https://github.com/earendil-works/pi/issues/7756) and [#5607](https://github.com/earendil-works/pi/issues/5607).
8. **[#9274](https://github.com/earendil-works/pi/pull/9274) [OPEN, inprogress] Preserve indentation in rendered diffs** — Long-standing renderer bug where intra-line edits drop indentation from removed lines.
9. **[#11690](https://github.com/earendil-works/pi/pull/11690) [CLOSED] Serve catalogs without version redirect** — Updates catalog protocol after pi.dev stopped redirecting released clients to `?pi-version=` URLs.
10. **[#11685](https://github.com/earendil-works/pi/pull/11685) [OPEN] Pack pi-schema from checkout in Nix** — Fixes `nix build .#pi` after pi-schema became a runtime dependency.

## 5. Hot Discussions

**Ideas**
- **[#4444](https://github.com/earendil-works/pi/discussions/4444) Supporting the Agent Client Protocol (ACP)** — 47 👍, the highest-engagement item in this digest. Proposal to adopt the editor-agent standard instead of requiring each editor to implement Pi's RPC dialect. Strong community consensus signal.

**Q&A**
- **[#11404](https://github.com/earendil-works/pi/discussions/11404) Official Pi coding-agent Docker sandbox?** — Community members discovered four sandbox images (`sbx/pi*`) on Docker Hub and are asking whether these are officially maintained.

## 6. Feature Request Trends

- **Interoperability & remote sessions**: ACP support ([#4444](https://github.com/earendil-works/pi/discussions/4444)), native TUI connecting to remote sessions ([#11715](https://github.com/earendil-works/pi/issues/11715)), and a documented `PI_SELF_UPDATE_COMMAND` for wrapper-based installs ([#11629](https://github.com/earendil-works/pi/pull/11629)) all point to demand for Pi as a composable component rather than a self-contained tool.
- **Update & package-management transparency**: Multiple requests to see what `pi update` actually changed and to guarantee it reports installed (not advertised) versions.
- **Durable/session APIs**: `pi-durable` requests a public, transaction-safe API to wake sleeping tasks before their deadline ([#11683](https://github.com/earendil-works/pi/issues/11683)).
- **Namespace/package ergonomics**: Opt-in `pi.namespace` for skills and prompt templates ([#8834](https://github.com/earendil-works/pi/issues/8834)).
- **Internationalization**: RTL/Arabic TUI support ([#11579](https://github.com/earendil-works/pi/issues/11579)) and CJK IME autocomplete fixes in Alacritty ([#11177](https://github.com/earendil-works/pi/issues/11177)).

## 7. Developer Pain Points

- **Performance at scale**: Long sessions (CPU on macOS [#7730](https://github.com/earendil-works/pi/issues/7730)), large transcripts (full re-render [#9549](https://github.com/earendil-works/pi/issues/9549)), and large grep matches (OOM [#9276](https://github.com/earendil-works/pi/issues/9276)) recur across platform and SDK contexts.
- **Silent schema/parameter loss in provider adapters**: Root `anyOf`/`oneOf` stripped by the Anthropic adapter ([#9134](https://github.com/earendil-works/pi/issues/9134), [#9557](https://github.com/earendil-works/pi/issues/9557)); relative `$id` resolved twice, rejecting valid tool arguments ([#11697](https://github.com/earendil-works/pi/issues/11697)); `schemaToType` drops sibling `type` under `allOf` in Code Mode ([#11122](https://github.com/earendil-works/pi/issues/11122)).
- **Per-request resource churn**: A fresh `BedrockRuntimeClient` per call ([#11527](https://github.com/earendil-works/pi/issues/11527)) and duplicate `$id` resolution are classic hidden latency/credential costs.
- **Fragile extension lifecycle**: The loader auto-importing test files ([#11691](https://github.com/earendil-works/pi/issues/11691)), extension reload dropping tools mid-session ([#11376](https://github.com/earendil-works/pi/issues/11376)), and `cacheWarming` breaking when extensions handle `turn_end` ([#10956](https://github.com/earendil-works/pi/issues/10956)) all show the extension surface lacks isolation guarantees.
- **Update reliability & backward compatibility**: Stale npm metadata producing false "up to date" claims, and 1.5.0's `Type` export removal breaking downstream (`@flue/runtime`) — prompting an explicit AGENTS.md backward-compat mandate ([#11704](https://github.com/earendil-works/pi/pull/11704)).
- **Auth/token races**: Symlinked `auth.json` paths bypassing the OAuth refresh lock ([#11655](https://github.com/earendil-works/pi/issues/11655)) and lost refresh tokens during startup catalog refresh ([#11692](https://github.com/earendil-works/pi/issues/11692)) cause intermittent `invalid_grant` logouts.

</details>

<details>
<summary><strong>Qwen Code</strong> — <a href="https://github.com/QwenLM/qwen-code">QwenLM/qwen-code</a></summary>

# Qwen Code Community Digest — 2026-11-03

## 1. Today's Highlights

A quiet release day: `v0.26.6` shipped with a Web Shell sidebar activity view, while the TypeScript SDK (`v0.1.27`) re-bundles the latest CLI. The bulk of community activity is instead in the issue tracker, where Web Shell session performance, SIGHUP-related message/tool-call loss, and a security gap in GitHub/GitLab Channel defaults dominate. CI and Managed Agent hardening continues to generate a large share of PR traffic.

## 2. Releases

**v0.26.6** (stable)
- Adds a **Web Shell sidebar activity view** for trusted-workspace conversations, surfacing approval/input/error states and unread counts.
- No known breaking changes.

**v0.26.5-nightly.20261102.0441faff21** — routine nightly build. No notable feature content beyond the release-notes scaffold.

**sdk-typescript-v0.1.27** — TypeScript SDK release; **bundles CLI 0.26.6**. Note: the release body also references 0.26.4 in a repeated "Bundled CLI Version" block, which looks like a release-notes generation artifact rather than real content.

No changelog links are given in the source data beyond the compare URL: [v0.26.6...v0.26.5-nightly.20261102.0441faff21](https://github.com/QwenLM/qwen-code/compare/v0.26.6...v0.26.5-nightly.20261102.0441faff21)

## 3. Hot Issues

1. **[#14724](https://github.com/QwenLM/qwen-code/issues/14724) — Main CI failed: Managed Agent gate, no test identified** (OPEN, 155 comments). The highest-traffic issue on the board. A persistent CI gate failure with `autofix/skip`, open since 2026-10-19. The comment volume suggests either automated retry loops or genuine triage churn; either way it is a long-running reliability drag on the main branch.

2. **[#13078](https://github.com/QwenLM/qwen-code/issues/13078) — Daily dependency CVE audit failed** (OPEN, 40 comments). Scheduled audit has been failing since 2026-09-30, with the webhook noting a possible npm-audit outage or a new high-severity finding. Routine but important: a silently failing security audit is worse than a noisy one.

3. **[#15173](https://github.com/QwenLM/qwen-code/issues/15173) — E2E Tests failure in `context-compress-interactive.test.ts`** (OPEN, 36 comments, `autofix/in-progress`). The interactive context-compression path is exactly the kind of thing that regresses silently; sustained comment count indicates it is not a one-off flake.

4. **[#16144](https://github.com/QwenLM/qwen-code/issues/16144) — Channels created from Web Shell default to open access, contradicting docs** (OPEN, P1, security, 4 comments). A GitHub Channel created from the Web Shell answers **anyone** who can comment on **any** repository the connected account is notified about — including public repos the operator never listed — while docs claim group access is disabled by default. This is the most security-significant open issue today.

5. **[#16171](https://github.com/QwenLM/qwen-code/issues/16171) — Web Shell session open very slow due to full file contents in live replay** (CLOSED, P1, performance, 4 comments). A single session took disproportionately long to open because edit-tool results retained whole file bodies; daemon memory/CPU were normal, so it was pure replay bloat. Rapidly closed, which suggests a fast fix — worth watching for the PR.

6. **[#16169](https://github.com/QwenLM/qwen-code/issues/16169) — Queued messages silently lost on SIGHUP** (OPEN, P2, 5 comments). Messages typed while a tool is running show `⏳ 1 queued`, then vanish entirely on terminal close — not in the resumed conversation, not on disk. Silent data loss in the interactive session manager is a poor failure mode, especially for users who habitually `Ctrl+Z`/detach.

7. **[#15799](https://github.com/QwenLM/qwen-code/issues/15799) — Completed tool calls reported as "not recorded" after abrupt session end** (OPEN, P1, 4 comments). Companion symptom to #16169: on resume, in-flight calls get a canned "Treat as failure and retry" message, causing duplicate work. Together these two point at a real durability gap in the session-recording path.

8. **[#14288](https://github.com/QwenLM/qwen-code/issues/14288) — Zombie session child processes accumulate under suspended sessions** (OPEN, P3, 5 comments). A 48-day-old defunct child observed in a 10–20 parallel sessions/day workflow. Classified P3, but the "suspended for weeks" usage pattern is not exotic among heavy CLI users.

9. **[#15165](https://github.com/QwenLM/qwen-code/issues/15165) — Shell safety parser triggers ~1.6 GiB transient WASM allocation on Node 24.16.0** (OPEN, P2, performance/memory, 7 comments). `classifyShellCommandSafety('ls -la /tmp')` producing a multi-gigabyte native-memory spike during V8 optimization is a severe outlier; relevant to anyone running many short-lived invocations.

10. **[#16159](https://github.com/QwenLM/qwen-code/issues/16159) / [#16158](https://github.com/QwenLM/qwen-code/issues/16158) / [#16157](https://github.com/QwenLM/qwen-code/issues/16157) — Model-ID normalization falls back to defaults** (all OPEN, P2/P3). A coordinated trio from the same author: Ollama HF quantization tags (`-GGUF:Q4_K_M`), OpenRouter `:exacto`, and Bedrock `us.anthropic...-v1:0` IDs all lose their model name during limit lookup, silently degrading to a 200K/32K default. Same root cause across three popular providers, filed within a day — a clean, high-leverage fix candidate.

*Also notable (closed):* [#16119](https://github.com/QwenLM/qwen-code/issues/16119) (background shell results wait for turn end instead of mid-turn delivery), [#16147](https://github.com/QwenLM/qwen-code/issues/16147) (Managed Runtime ~166 MiB/sandbox overhead), [#13106](https://github.com/QwenLM/qwen-code/issues/13106) (cd-segment redirect targets dropped from Write deny checks — a security fix), [#8092](https://github.com/QwenLM/qwen-code/issues/8092) (Web Shell–based desktop app).

## 4. Key PR Progress

1. **[#16106](https://github.com/QwenLM/qwen-code/pulls/16106) — feat(web-shell): Channel event timeline.** Adds a Channel events page and read-only route recording accepted/skipped inbound messages (with machine skip reasons), published/suppressed replies, and task transitions. Directly relevant to the #16144 access-defaults issue — observability first.

2. **[#16149](https://github.com/QwenLM/qwen-code/pulls/16149) — feat(web-shell): edit GitHub repository settings from the channel editor.** Lets operators change which accounts may start tasks, whether a repo answers without an @mention, and related behavior directly in the Web Shell instead of hand-editing `settings.json`. This is the most plausible near-term remediation path for the "open by default" problem.

3. **[#16117](https://github.com/QwenLM/qwen-code/pulls/16117) — feat(channels): deliver GitHub events to PR-bound sessions.** Routes GitHub events for a PR into sessions bound to that PR (created/reviewed/verified it, per Web Shell sidebar), using them as prompts. A meaningful step toward event-driven agent workflows.

4. **[#16177](https://github.com/QwenLM/qwen-code/pulls/16177) — fix(core): attribute monitor/workflow notifications to the registering turn.** Complements the #16119 shell-notification fix: completion notifications now carry the registering turn so results arriving mid-turn are included in the next model request rather than forcing a new turn.

5. **[#16176](https://github.com/QwenLM/qwen-code/pulls/16176) — test(cli): pin same-turn shell notification delivery.** Regression test for exactly the #16119 behavior. Good hygiene: the fix and its guard land close together.

6. **[#16110](https://github.com/QwenLM/qwen-code/pulls/16110) — fix(managed-agent): refuse every URL fetch refuses, and explain health-probe failures.** Follow-up to #16051. Notably includes refusing scheme-less `--server-url` values like `proxy.test:8443`, where parsing behavior is ambiguous.

7. **[#16102](https://github.com/QwenLM/qwen-code/pulls/16102) — fix(web-shell): scope file changes to the session workspace.** Limits edited-file cards/reviews to the session working directory and excludes Git-ignored untracked paths, while keeping tracked and non-ignored new files visible. Managed worktrees get their own execution directory.

8. **[#15780](https://github.com/QwenLM/qwen-code/pulls/15780) — fix(permissions): report malformed rules instead of dropping them silently.** Unbalanced-parenthesis permission rules currently match nothing and (post-#15794) print one generic warning that cannot identify the owning list. This makes the diagnostics actionable — a quiet correctness win for anyone writing permission configs.

9. **[#16156](https://github.com/QwenLM/qwen-code/pulls/16156) — fix(cli): Agent Host disconnect bookkeeping.** Fixes `DELETE …/hosts/connect` removing the saved record before actually stopping the connection; on lock failure (`ELOCKED`) or removal failure, nothing gets stopped. Also reports unsaved joins.

10. **[#16066](https://github.com/QwenLM/qwen-code/pulls/16066) — feat(config): operator model catalog refresh switch.** Adds `model.catalogRefresh` so managed installs can disable the daily models.dev catalog download via settings rather than per-launch env vars. Also makes `privacy.usageStatisticsEnabled: false` sticky.

*Also worth tracking:* [#15466](https://github.com/QwenLM/qwen-code/pulls/15466) (user-scope Skill activation routes; `autofix/takeover`, needs human), [#15684](https://github.com/QwenLM/qwen-code/pulls/15684) (managed-agent external workspace execution), [#16024](https://github.com/QwenLM/qwen-code/pulls/16024) (session pagination with composite mtime+filename cursor — fixes skipped/duplicated sessions on equal mtimes), [#16068](https://github.com/QwenLM/qwen-code/pulls/16068) (disk-floor preflight for six Java CI lanes).

## 5. Hot Discussions

No Discussions data was provided in the source dataset. This section is omitted.

## 6. Feature Request Trends

Distilled from Issues and PRs:

- **Web Shell as the single UI surface.** [#8092](https://github.com/QwenLM/qwen-code/issues/8092) proposes a lower-maintenance desktop app that reuses Web Shell rather than maintaining a parallel desktop implementation. Multiple Web Shell PRs (#16106, #16149, #16102) reinforce it as the primary product surface.
- **Session durability and resumption.** #16169, #15799, #16119, and [#14288](https://github.com/QwenLM/qwen-code/issues/14288) all ask for the same thing from different angles: sessions that survive SIGHUP/crashes without losing queued messages, in-flight tool results, or child processes.
- **Token/context economy.** [#16173](https://github.com/QwenLM/qwen-code/issues/16173) requests model-referenceable slices of files/tool outputs to avoid the `read > write > typo > re-write` loop; [#6721](https://github.com/QwenLM/qwen-code/issues/6721) (now closed) targets deferred tool discovery invalidating prompt-cache prefixes.
- **Broad provider correctness.** The Bedrock/OpenRouter/Ollama trio (#16157–#16159) reflects demand for first-class, non-Qwen model support with correct context/output limits.
- **Distribution breadth.** [#16034](https://github.com/QwenLM/qwen-code/issues/16034) asks for rpm artifacts so Fedora/RHEL users get an installable package rather than an uninstallable AppImage.
- **Mid-turn async delivery.** Background shells, monitors, and workflows should report results into the *current* turn; #16119 and #16177 are the implementation side of this trend.

## 7. Developer Pain Points

- **Silent data loss around session boundaries.** Queued messages lost on SIGHUP (#16169), completed tool calls reported "not recorded" (#15799), and notification attribution gaps (#16119) combine into a pattern users cannot easily diagnose or work around.
- **Silent misconfiguration.** Malformed permission rules matching nothing (#15780), model IDs falling back to default context windows without warning (#16157–#16159), and Channels defaulting to open access despite docs (#16144) share a theme: the system accepts bad input and behaves plausibly-but-wrongly.
- **CI as a chronic background failure.** #14724 (155 comments), #13078 (40), #15173 (36), #12714 (25), and [#15052](https://github.com/QwenLM/qwen-code/issues/15052) (16) all concern main-branch CI reliability. The E2E concurrency design in #15052 — ref-scoped concurrency replacing older pending runs, so intermediate main SHAs lack independent validation — is a structural issue, not a flake.
- **Resource footprint under real workloads.** ~1.6 GiB transient WASM allocation per shell-safety classification (#15165), ~166 MiB per Managed Runtime sandbox from an undeclared-tool reminder check (#16147), and slow Web Shell session replay (#16171) point at overhead that only shows up at scale.
- **Platform-specific breakage.** Windows desktop update failures (#15933, closed) and a Linux VS Code Companion SIGSEGV in Sharp under Electron-as-Node ([#16127](https://github.com/QwenLM/qwen-code/issues/16127), P1, open) indicate packaging/runtime edges still need attention.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*