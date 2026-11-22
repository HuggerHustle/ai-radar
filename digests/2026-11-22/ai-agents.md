# OpenClaw Ecosystem Digest 2026-11-22

> Issues: 415 | PRs: 500 | Projects covered: 5 | Generated: 2026-11-22 01:08 UTC

- [OpenClaw](https://github.com/openclaw/openclaw)
- [Hermes Agent](https://github.com/nousresearch/hermes-agent)
- [IronClaw](https://github.com/nearai/ironclaw)
- [QwenPaw](https://github.com/agentscope-ai/QwenPaw)
- [ZeroClaw](https://github.com/zeroclaw-labs/zeroclaw)

---

## OpenClaw Deep Dive

# OpenClaw Project Digest — 2026-11-22

## 1. Today's Overview

OpenClaw remains in a high-velocity maintenance phase with **415 issues** and **500 PRs** updated in the last 24 hours, though no new releases shipped. The activity split is balanced between triage (297 open/active issues, 118 closed) and integration (294 open PRs, 206 merged/closed), indicating a healthy merge pipeline rather than a backlog stall. However, the issue queue is dominated by **P0/P1 stability regressions** — gateway memory blowups, update/rollback failures, and plugin lifecycle races — several of which are multi-version-old and still unresolved. The most-discussed issue (#160959, 85 comments) concerns a Gateway event-loop block introduced in 2026.9.6, suggesting the project is still absorbing the cost of its plugin-generation architecture. Overall: **high engagement, strong throughput, but elevated stability debt** that warrants release-blocker attention.

## 2. Releases

**No new releases in the last 24 hours.** The most recent stable line referenced across issues is **2026.11.3**, with **2026.11.5** in beta/candidate validation (see #200606, #197083). No changelog or migration notes to report today.

## 3. Project Progress

206 PRs were merged or closed in the last 24h. Notable closures and advances:

- **#203368 [CLOSED]** — `fix(ui): skip archive exit animations outside the sidebar viewport` ([link](https://github.com/openclaw/openclaw/pull/203368)): fixes a 32px row-jump artifact when archiving off-screen session groups.
- **#203346 [CLOSED]** — `improve: show complete 30-day Usage reports sooner` ([link](https://github.com/openclaw/openclaw/pull/203346)): reduces partial-total latency and removes a 400ms preset delay.
- **#203356 [CLOSED]** — `fix: keep one model's cooldown deadline off other models` ([link](https://github.com/openclaw/openclaw/pull/203356)): prevents provider-wide cooldown bleed from cached catalogs.
- **#199155 [CLOSED]** — transcript row visibility race between CLI `message send` and the gateway session actor ([link](https://github.com/openclaw/openclaw/issues/199155)) — a session-state correctness fix.
- **#185578 [CLOSED]** — gateway heap floor ratchet (~25 MiB/h leak) ([link](https://github.com/openclaw/openclaw/issues/185578)) — a meaningful memory-stability win.
- **Android refactor series** by `vincentkoc` (#202892, #202898, #202903, #202876, #202877) advanced test-fixture ownership and state-consolidation work under umbrella issue #202818.

## 4. Community Hot Topics

| Item | Comments | Signal |
|---|---|---|
| [#160959](https://github.com/openclaw/openclaw/issues/160959) — Gateway blocks minutes capturing large external plugins (P0, 2026.9.6 regression) | 85 | **Highest engagement.** External/workspace plugin package trees block the event loop at startup and on model-runtime republish. Maintainer review requested; no fix PR. |
| [#191944](https://github.com/openclaw/openclaw/issues/191944) — macOS `gateway stop`/`stop --force` fail with "Process ancestry could not be fully inspected" | 38 | Native macOS service-inspection gap; UX friction on a core lifecycle command. |
| [#197083](https://github.com/openclaw/openclaw/issues/197083) — Post-install Doctor WAL verification leaves 11.3 update partially finalized (P0) | 32 | Managed-upgrade integrity risk; `state-migrated-no-rollback` traps users mid-update. |
| [#182891](https://github.com/openclaw/openclaw/issues/182891) — Prompt cache never reused (`cache read dropped N -> 0`) | 22 | **Cost pain.** Envelope rewrites and runtimeContextCarrier changes invalidate cache every request — directly hits token spend. |
| [#200606](https://github.com/openclaw/openclaw/issues/200606) — 2026.11.5 candidate Doctor blocks update with plugin migration conflict | 19 | Release-candidate validation blocker; `changed=[]` mismatch. |

**Underlying needs:** Users are primarily demanding **predictable upgrades** (rollback safety, Doctor honesty), **lifecycle reliability** (stop/start/restart across macOS/Windows), and **cost transparency** (prompt-cache reuse, memory ceilings). The plugin-generation architecture is the recurring fault line.

## 5. Bugs & Stability

Ranked by severity:

**P0 / Release-blockers**
- **#160959** — Gateway event-loop block for minutes on large external plugins (regression, no fix PR). *Top stability risk.*
- **#197083** — Post-install WAL verification leaves 11.3 update partially finalized; external plugins stranded.
- **#169844** — Windows Control UI Gateway update hangs at "Activating," leaves Scheduled Task disabled and gateway stopped ([link](https://github.com/openclaw/openclaw/issues/169844)).

**P1**
- **#181432** — Baseline RSS ~1.9 GB and SQLite transaction timeouts in 2026.10.5 (Linux ARM64) ([link](https://github.com/openclaw/openclaw/issues/181432)).
- **#169797** — Gateway 2026.9.9/2026.10.1 uses ~2.5× memory of 2026.9.4 on single-CPU hosts; 3–5× slower start ([link](https://github.com/openclaw/openclaw/issues/169797)).
- **#196199** — Native Codex helper completions fail to resume parent, pausing goals and locking users out ([link](https://github.com/openclaw/openclaw/issues/196199)).
- **#197515** — Codex "data/settings upgrade is unfinished" persists on 2026.11.3; merged fix #186506 **not in release** ([link](https://github.com/openclaw/openclaw/issues/197515)).
- **#191476** — Matrix room stuck on "Plugin matrix consumer is closed" after image_generate race ([link](https://github.com/openclaw/openclaw/issues/191476)).
- **#153899** — Gateway drain waits full `TimeoutStopSec`; timers fire against closed resources ([link](https://github.com/openclaw/openclaw/issues/153899)).

**P2 (selected)**
- **#200756** — Windows beta.2→beta.4 update fails at package-swap (`baseline package scan failed`).
- **#200224** — 2026.11.5 beta refuses retired `agents.defaults.heartbeat`, but removing it re-enables heartbeats — a no-win migration trap.
- **#202001** — Prompt cache invalidated by system prompt section churn (openai-completions); misdiagnosed as history rewrite.
- **#136405** — `memory_search` hangs 15s on stalled remote embedding; no per-call timeout/retry config.

**Fix-PR status:** Several closed today (#199155, #185578, #203356), but the P0s (#160959, #197083, #169844) have **no fix PR** and are flagged `needs-maintainer-review`. The release-notes gap in #197515 (merged fix not shipped) is a process smell worth flagging.

## 6. Feature Requests & Roadmap Signals

- **#163739** — Make Control UI `Ctrl+Shift+A` (Archive) configurable; collides with browser shortcuts (closed as stale, product decision pending).
- **#187264** — Caller-scoped, same-conversation scheduling for non-owner channel requests (security review needed).
- **#116052** — MCP OAuth pre-registered clients (authorization_code) for servers without DCR — likely to land given growing MCP adoption.
- **#170997** — CJK `bigram` tokenizer for memory FTS (trigram yields 0 matches for 2-char Chinese queries).
- **#138990** — Enforceable checkpoints and bounded yields for long foreground WebChat runs.
- **#155137** — Optional Perplexity Agent API research tool.
- **#191580** (PR) — Configurable count of recent messages kept on automatic session reset.

**Prediction:** The **MCP OAuth pre-registration** (#116052) and **session-reset message count** (#191580) are the most shippable near-term; the CJK tokenizer (#170997) has a clear technical fix and a linked PR open. The Control UI shortcut remap (#163739) is a low-effort win that keeps getting deferred.

## 7. User Feedback Summary

**Pain points:**
- **Upgrade anxiety** — multiple users describe updates leaving installs in partial states (`state-migrated-no-rollback`, `baseline package scan failed`, WAL verification failures). Trust in the managed-update path is eroding.
- **Cost leakage** — prompt-cache invalidation (#182891, #202001, #177506) is a recurring theme; users are measuring token drops in the millions and want deterministic cache reuse.
- **Memory bloat** — 1.9 GB baseline RSS and 2.5× regressions on single-CPU hosts make OpenClaw feel heavy for small deployments.
- **Platform friction** — macOS stop failures and Windows update hangs are blocking basic lifecycle operations.

**Satisfaction signals:** High comment volume with constructive diagnostics (users posting `worker_turn_tool_authorities`, cache-read telemetry, package-scan logs) indicates an engaged, technically sophisticated user base willing to help triage. The rapid closure of session-state and memory-leak bugs today shows responsiveness where maintainers have bandwidth.

## 8. Backlog Watch

Long-unanswered or high-impact items needing maintainer attention:

- **[#160959](https://github.com/openclaw/openclaw/issues/160959)** — P0, 85 comments, created 2026-09-29, still open with no fix PR. The single largest stability liability.
- **[#136405](https://github.com/openclaw/openclaw/issues/136405)** — `memory_search` 15s hang, open since 2026-09-02, no fix PR; affects active-memory recall reliability.
- **[#124306](https://github.com/openclaw/openclaw/issues/124306)** — Exec approval card doesn't flag mount-point targets before `rm -rf`; open since 2026-08-15, security/UX gap.
- **[#130247](https://github.com/openclaw/openclaw/issues/130247)** — Cron jobs have no `--until`/`--max-runs` end conditions; open since 2026-08-26.
- **[#116052](https://github.com/openclaw/openclaw/issues/116052)** — MCP OAuth pre-registered clients; open since 2026-07-29, security review flagged.
- **[#129388](https://github.com/openclaw/openclaw/pull/129388)** — Context-pressure-aware continuation PR (XL, open since 2026-08-25) — long-running design that could reshape agent turn management if merged.
- **[#197515](https://github.com/openclaw/openclaw/issues/197515)** — Process gap: merged fix #186506 not present in 2026.11.3 release; needs release-train verification.

---

**Health assessment:** Throughput is strong and the community is highly engaged, but the **concentration of P0/P1 stability issues in the update and plugin-lifecycle paths** — combined with at least one confirmed case of a merged fix not shipping (#197515) — suggests the release pipeline needs a stability-focused pass before the next stable cut. The 2026.11.5 candidate Doctor conflicts (#200606, #200224) are immediate release-train blockers.

---

## Cross-Ecosystem Comparison

# Cross-Project Comparison Report — Personal AI Assistant / Agent Open-Source Ecosystem
**Data window: 2026-11-22 (24h)** | Projects: OpenClaw, Hermes Agent, IronClaw, QwenPaw, ZeroClaw

---

## 1. Ecosystem Overview

The personal AI assistant / agent open-source landscape is bifurcating into a **high-velocity core** (OpenClaw, Hermes, ZeroClaw) and a **long-tail periphery** (IronClaw, QwenPaw) where maintainer bandwidth, not contribution, is the binding constraint. Across all five projects, the dominant engineering themes are **stability of the update/lifecycle path**, **agent security scoping** (credentials, cost ceilings, permissions), and **cost transparency** (prompt-cache reuse, per-hop spend enforcement). Terminal integration, MCP extensibility, and multi-channel parity are emerging as table-stakes feature surfaces rather than differentiators. The ecosystem is visibly transitioning from "does the agent work?" to "can operators trust it in production?" — with upgrade safety, least-privilege design, and deterministic cost behavior now the primary competitive axes.

---

## 2. Activity Comparison

| Project | Issues (24h) | PRs (24h) | Release Status | Health Score |
|---|---|---|---|---|
| **OpenClaw** | 415 (297 open / 118 closed) | 500 (294 open / 206 merged-closed) | None; 2026.11.3 stable, 2026.11.5 RC | ⚠️ **Stressed** — high throughput, elevated P0/P1 debt, release-train blockers |
| **Hermes Agent** | 50 (42 open / 8 closed) | 50 (35 open / 15 merged-closed) | None; between cuts | 🟡 **Pressured but stable** — strong closures, unpatched P2s, v0.23.1 regressions |
| **IronClaw** | 1 (1 open / 0 closed) | 0 | None | 🟢 **Idle / nominal** — single community FR, no bugs, zero PR throughput |
| **QwenPaw** | 6 (4 open / 2 closed) | 11 (11 open / 0 merged) | None | 🟠 **Review-constrained** — healthy inflow, zero merges, multi-month-old PRs |
| **ZeroClaw** | 18 (active) | 50 (43 open / 7 merged-closed) | None; v0.9.1 in prep | 🟢 **Solid but review-bound** — 7 closures incl. S1/S2 fixes, XL PR queue |

**Throughput ratio (PRs merged/closed per 100 updated):** OpenClaw ~41, ZeroClaw ~14, Hermes ~30, QwenPaw 0, IronClaw 0.

---

## 3. OpenClaw's Position

**Scale advantage is decisive.** OpenClaw processes roughly **8–10× the issue and PR volume** of its nearest peer (Hermes) in the same window, and ~40× ZeroClaw's daily merge count. Its community is not merely larger but **technically deeper** — users submit `worker_turn_tool_authorities` diagnostics, cache-read telemetry, and package-scan logs, effectively acting as a distributed triage force.

**Advantages vs. peers:**
- **Integration velocity:** 206 merged/closed PRs in 24h versus single digits for peers — the only project with a genuinely industrial merge pipeline.
- **Feature breadth:** MCP OAuth, Android refactor series, Control UI, multi-provider cooldown isolation, usage analytics — areas peers are only beginning to scope.
- **Community infrastructure:** sustained 85-comment threads and multi-version regression tracking imply institutional memory peers lack.

**Technical approach differences:** OpenClaw has committed to a **plugin-generation architecture** with a managed-update + Doctor verification pipeline. This is the source of both its power (extensibility) and its pain (event-loop blocking on large plugin trees, WAL verification failures, rollback traps). Hermes and ZeroClaw favor **asset/config-driven extensibility** (providers.json, WASM plugins) that trades depth for predictability.

**Community size comparison:** OpenClaw = far larger, more mature, and more demanding. Its weakness is **stability debt proportional to its surface area** — the same complexity that drives adoption drives P0 concentration in update/lifecycle paths (#160959, #197083, #169844).

---

## 4. Shared Technical Focus Areas

The following requirements surfaced **independently across multiple projects**, indicating ecosystem-level demand:

| Theme | Projects | Specific Need |
|---|---|---|
| **Update / lifecycle reliability** | OpenClaw (#197083, #169844), Hermes (#152519, #145469), ZeroClaw (Windows CI) | Predictable upgrades, rollback safety, honest Doctor/verification; no partial-finalize traps |
| **Cost enforcement & transparency** | OpenClaw (#182891, #202001 — prompt-cache invalidation), ZeroClaw (#12626, #12627, #12628 — per-hop ceilings, `route_down` non-functional) | Hard cost guarantees; documented settings that actually work |
| **Least-privilege / scoped credentials** | ZeroClaw (RFC #12422), OpenClaw (#187264 caller-scoped scheduling), Hermes (#157803 trusted input) | Agent acts on services **without exposing secrets to the model** |
| **Cross-platform gaps (Windows/macOS)** | OpenClaw (macOS stop, Windows update hang), Hermes (#152435, #143567 — ≥4 Windows bugs), ZeroClaw (#12484 Windows plugin) | Consistent lifecycle/process management; reduced platform CI blind spots |
| **Terminal integration / agent status** | Hermes (OSC 7501, 5 PRs), OpenClaw (usage reports, session reset) | Machine-readable agent state (`idle/working/blocked/error`) |
| **Provider catalog expansion** | IronClaw (#8174 LLMTR), OpenClaw (#116052 MCP OAuth), Hermes (#156806 reasoning effort) | Zero-code, OpenAI-compatible gateway onboarding |
| **Silent-failure elimination** | Hermes (#156806, #137357, #89587), QwenPaw (#8851, #8848), ZeroClaw (#9896) | Visible, honest state; no no-op buttons or misleading banners |

**Signal strength:** Update reliability and cost enforcement appear in **3 of 5 projects** with severity ≥P1/S2 — these are the ecosystem's shared failure modes.

---

## 5. Differentiation Analysis

| Dimension | OpenClaw | Hermes Agent | IronClaw | QwenPaw | ZeroClaw |
|---|---|---|---|---|---|
| **Feature focus** | Full-stack platform: UI, gateway, Android, plugins, MCP | Terminal/TUI + gateway, proactivity roadmap | Minimal catalog-driven LLM provider | Channel-native agent (WeChat, console) | Security-hardened runtime, multi-channel |
| **Target users** | Power users, plugin developers, enterprise ops | Developers, desktop interactivity users | Integrators wanting simple provider swap | Multi-channel/community operators | Multi-tenant operators, cost-sensitive enterprises |
| **Architecture** | Plugin-generation + managed update pipeline | Gateway + SessionState refactor + OSC status protocol | `providers.json` asset catalog | Console + plugin routes + runtime base-path | WASM plugins + IRC/Twitch extraction to registry |
| **Distinctive bet** | Depth/feature breadth | Desktop UX contract + terminal parity | Simplicity & low surface area | Channel parity & async completion | Least-privilege security model |
| **Primary weakness** | Stability debt in update path | Cross-platform erosion | Idle / low activity | Review bottleneck | XL PR review queue |

**Key insight:** No two projects compete directly. OpenClaw is the **platform**, Hermes the **developer terminal tool**, ZeroClaw the **security/cost guardian**, QwenPaw the **channel integrator**, IronClaw the **minimalist provider host**. Overlap is increasing at the edges (MCP, cost, provider catalogs), which will pressure differentiation in 2027.

---

## 6. Community Momentum & Maturity

**Activity tiers:**

- **Tier 1 — Industrial-scale (OpenClaw):** 415 issues + 500 PRs/24h. Mature, heavily engaged, but carrying **systemic stability debt**. Momentum high; trust eroding in managed-update path.
- **Tier 2 — Rapid iteration (Hermes, ZeroClaw):** 50 issues + 50 PRs each. Both actively closing S1/S2 bugs and landing features (OSC 7501, cost fixes), but **review bandwidth is visibly the constraint** (XL backlogs, `needs-author-action` PRs).
- **Tier 3 — Stabilizing / constrained (QwenPaw):** Healthy issue quality, **zero merges in 24h**, PRs open 1–2+ months. At risk of contributor attrition.
- **Tier 4 — Idle (IronClaw):** Single community FR, no PR throughput, no bugs. Stable but dormant — monitoring warranted.

**Trajectory:**
- **Iterating fastest:** Hermes (salvage-train PR consolidation), ZeroClaw (security hardening + cost cluster).
- **Stabilizing / batch-releasing:** OpenClaw (absorbing plugin-arch cost), ZeroClaw (v0.9.1 prep + deslop tracker).
- **At risk:** QwenPaw (review bottleneck), IronClaw (momentum stall).

**Maturity proxy:** OpenClaw ≈ production platform with operational debt. Hermes/ZeroClaw ≈ post-1.0 products in hardening. QwenPaw/IronClaw ≈ early-to-mid projects with process gaps.

---

## 7. Trend Signals

Extracted from cross-project community feedback — actionable for AI agent developers:

1. **Trust is the new feature.** Users across projects measure trust via *outcomes*: upgrades that complete, cost limits that hold, buttons that work. No-op Steer buttons (Hermes #141973), non-functional `route_down` (ZeroClaw #12626), and misleading docs that wipe env vars (QwenPaw #8843) all erode confidence faster than missing features lose adoption. **Design implication:** treat honesty of state and config as a first-class requirement, not polish.

2. **Cost control must be hierarchical and unforgeable.** OpenClaw's prompt-cache invalidation and ZeroClaw's per-hop ceiling bypass (#12627) reveal that cost logic fails under multi-agent delegation and envelope mutation. **Developers should:** make ceilings inheritable and non-bypassable at spawn time, and make cache reuse deterministic rather than incidental.

3. **Least-privilege agent credentials are the emerging security primitive.** ZeroClaw's RFC #12422 (agent acts without seeing the credential) is the clearest articulation of a need echoed in OpenClaw (#187264) and Hermes (#157803). Expect "scoped, revocable, model-invisible" credentials to become a standard pattern.

4. **Platform coverage is a silent quality tax.** Windows and macOS generated independent bug clusters in OpenClaw, Hermes, and ZeroClaw. **Teams shipping cross-platform should** treat Windows/Fedora CI parity as a release gate, not an afterthought.

5. **Terminal-native agent status (OSC 7501-style) is standardizing.** Hermes' 5-PR salvage train shows demand for machine-readable agent state from the terminal. **Value for developers:** enables external orchestration/monitoring without API polling — a composability win.

6. **Provider catalogs want zero-code extensibility.** Request patterns (IronClaw LLMTR, OpenClaw MCP OAuth) favor asset-driven configuration over adapter code. **Build for config, not code**, when onboarding gateways.

7. **Review bandwidth is the ecosystem's scarcest resource.** In four of five projects, open PRs outnumber merges decisively, and multi-month-old XL PRs appear in QwenPaw, ZeroClaw, and Hermes. **Developers contributing upstream** should submit small, issue-linked PRs with filled templates — matching the pattern of today's fast-closed fixes.

---

**Bottom line for decision-makers:** The ecosystem is healthy in aggregate but **unevenly stressed**. OpenClaw leads on scale and must now pay down stability debt before its next cut. Hermes and ZeroClaw are the strongest hardening stories, both gated by review capacity. QwenPaw and IronClaw need maintainer attention to avoid momentum loss. Across all, the winning differentiator in 2027 will be **demonstrable trust** — reliable upgrades, enforceable costs, and provable least-privilege — rather than raw feature count.

---

## Peer Project Reports

<details>
<summary><strong>Hermes Agent</strong> — <a href="https://github.com/nousresearch/hermes-agent">nousresearch/hermes-agent</a></summary>

# Hermes Agent — Project Digest
**Date: 2026-11-22** | Source: github.com/nousresearch/hermes-agent

---

## 1. Today's Overview

Hermes Agent shows **high sustained activity** with 50 issues and 50 PRs updated in the last 24 hours, though the absence of a new release suggests the team is in a maintenance/stabilization phase between version cuts. The open/closed ratio is skewed toward open work (42 active issues, 35 open PRs), indicating healthy inbound triage but a growing backlog. A notable **PR closing wave** occurred around the OSC 7501 terminal-status feature (5+ related PRs merged/closed), signaling consolidation of a previously fragmented contribution area. Meanwhile, **profile lifecycle, Kanban cron behavior, Windows process management, and install/update robustness** dominate the bug surface, suggesting the last release surfaced regressions in multi-profile and cross-platform paths. Overall project health is **stable but pressured** — contributor volume is strong, but several P2 bugs remain unpatched with no linked fix PRs.

---

## 2. Releases

**No new releases in the last 24 hours.** *(Section omitted per instructions.)*

---

## 3. Project Progress

The most visible consolidation today was on the **OSC 7501 Program Status Protocol** initiative — five PRs covering CLI and TUI state reporting (`idle` / `working` / `blocked` / `done` / `error`) were merged or closed, effectively landing the feature via a salvage train:

- [#140837](https://github.com/NousResearch/hermes-agent/pull/140837) — *CLI and TUI report idle/working/blocked/done/error over OSC 7501* (salvage of #138152, #149976; port of goose#12928) — **CLOSED/merged**
- [#155128](https://github.com/NousResearch/hermes-agent/pull/155128), [#150498](https://github.com/NousResearch/hermes-agent/pull/150498), [#138152](https://github.com/NousResearch/hermes-agent/pull/138152), [#149976](https://github.com/NousResearch/hermes-agent/pull/149976), [#156816](https://github.com/NousResearch/hermes-agent/pull/156816) — **CLOSED** (superseded by the consolidated PR)
- Corresponding issue [#138147](https://github.com/NousResearch/hermes-agent/issues/138147) **CLOSED** with 5 👍 — community-requested, now satisfied.

Other closed/merged work:
- [#155134](https://github.com/NousResearch/hermes-agent/pull/155134) — Fixes a race condition in the Responses API disconnect test (main CI flake).
- [#149892](https://github.com/NousResearch/hermes-agent/pull/149892) — Removes four more `SessionState` legacy views on `GatewayRunner` (second in a migration train).
- [#157803](https://github.com/NousResearch/hermes-agent/pull/157803) — Vault login secrets now typed as trusted input via CDP `Input.insertText` and verified post-fill (security hardening).
- Issue [#157791](https://github.com/NousResearch/hermes-agent/issues/157791) **CLOSED** — scratch-prune deleting a live process's provider-plugin frozen copy (a nasty ~24h-latency failure).
- Issue [#158700](https://github.com/NousResearch/hermes-agent/issues/158700) **CLOSED** — Desktop per-profile theme collapse bug.

**Net assessment:** Strong closure cadence on terminal-integration and gateway refactor work; however, most P2 bug fixes submitted *today* remain open and unreviewed (see §5).

---

## 4. Community Hot Topics

| Rank | Item | Comments | Signal |
|------|------|----------|--------|
| 1 | [#155595](https://github.com/NousResearch/hermes-agent/issues/155595) — Tracking: profile creation and lifecycle | **17** | Umbrella tracker for the largest active campaign |
| 2 | [#75444](https://github.com/NousResearch/hermes-agent/issues/75444) — kanban auto-decomposer infinite block bounce | **14** | Long-running (since July), still unfixed |
| 3 | [#141973](https://github.com/NousResearch/hermes-agent/issues/141973) — Mid-turn sends unreliable to steer | **12** | Desktop UX pain, multi-point failure |
| 4 | [#154275](https://github.com/NousResearch/hermes-agent/issues/154275) — patchelf 0.15.2 nixpkgs break | **6** | Confirmed upstream regression |
| 5 | [#138147](https://github.com/NousResearch/hermes-agent/issues/138147) — OSC 7501 (CLOSED) | **5** + 5 👍 | Resolved today |

**Underlying needs analysis:**
- **#155595** reveals that **profile lifecycle** is now a first-class product surface. The tracker explicitly spans "provisioning, Honcho cleanup, safety proofs, gateway ownership, credential seams, clone safety" — i.e., contributors are formalizing a sprawling multi-profile architecture that has outgrown its original design. High comment count reflects coordination overhead, not just bug triage.
- **#75444** and the sibling PR [#158743](https://github.com/NousResearch/hermes-agent/pull/158743) expose a **cron/Kanban state-machine correctness problem**: escalated triage cards are invisible to the auto-sweeper's exclusion logic. Community patience is thinning after ~4 months.
- **#141973** (Steer button) is a **trust-eroding UX bug**: users cannot reliably intervene in a running turn. This is a desktop *interactivity contract* problem, not a cosmetic one.

---

## 5. Bugs & Stability

**Ranked by severity (all P2 unless noted):**

| Severity | Issue | Fix PR? | Impact |
|----------|-------|---------|--------|
| 🔴 High | [#141973](https://github.com/NousResearch/hermes-agent/issues/141973) — Mid-turn steer unreliable / Steer button no-ops | ❌ | Core desktop interaction broken |
| 🔴 High | [#152435](https://github.com/NousResearch/hermes-agent/issues/152435) — Windows gateway survives `hermes gateway stop` | ❌ | Orphaned processes; resource leak |
| 🔴 High | [#75444](https://github.com/NousResearch/hermes-agent/issues/75444) — Kanban infinite block bounce (4 months open) | ✅ [#158743](https://github.com/NousResearch/hermes-agent/pull/158743) open | Worker/retry burn |
| 🟠 Medium | [#144503](https://github.com/NousResearch/hermes-agent/issues/144503) — Session turn lease expires across host sleep | ❌ | macOS laptop users hard-interrupted |
| 🟠 Medium | [#137357](https://github.com/NousResearch/hermes-agent/issues/137357) — No end-of-turn hook fires on exhausted provider retries | ❌ | Plugin observability gap |
| 🟠 Medium | [#145469](https://github.com/NousResearch/hermes-agent/issues/145469) — PM picks musl target on glibc hosts (PT_INTERP > 8 KiB probe) | ✅ [#158742](https://github.com/NousResearch/hermes-agent/pull/158742) open | `hermes update` failure on Fedora/nixpkgs |
| 🟠 Medium | [#152519](https://github.com/NousResearch/hermes-agent/issues/152519) — Docker v0.23.1 `pm install --extra mcp` fails (pnpm check) | ❌ | v0.23.1 regression vs v0.22.5 |
| 🟠 Medium | [#140892](https://github.com/NousResearch/hermes-agent/issues/140892) — Docker-backed profile Bot Screen never streams | ❌ | Multiplexed serve + Docker |
| 🟠 Medium | [#89587](https://github.com/NousResearch/hermes-agent/issues/89587) — Circuit breaker has no half-open state | ❌ | Permanent latch despite recovery |
| 🟠 Medium | [#156806](https://github.com/NousResearch/hermes-agent/issues/156806) — OpenRouter gateway/proxy drops reasoning effort | ❌ | Silently degraded output |
| 🟡 Low | [#143567](https://github.com/NousResearch/hermes-agent/issues/143567) — `browser_exec` fails on Windows (`fcntl`) | ❌ | Windows + docker backend |
| 🟡 Low | [#154275](https://github.com/NousResearch/hermes-agent/issues/154275) — patchelf 0.15.2 nix break | ❌ | Upstream-triggered |
| 🟡 Low | [#138219](https://github.com/NousResearch/hermes-agent/issues/138219) — bot-forge pin fails to load (missing `yaml` dep) | ❌ | Catalog integrity |

**Fix PRs opened today (pending review):**
- [#158166](https://github.com/NousResearch/hermes-agent/pull/158166) — Kanban: refuse cards with no resolvable model before spawn.
- [#158739](https://github.com/NousResearch/hermes-agent/pull/158739) — Handle list-shaped content blocks in smart-approval.
- [#158743](https://github.com/NousResearch/hermes-agent/pull/158743) — Keep breaker-escalated triage cards out of auto-sweeps (addresses #75444).
- [#158742](https://github.com/NousResearch/hermes-agent/pull/158742) — Read `PT_INTERP` for libc probe (addresses #145469).
- [#158733](https://github.com/NousResearch/hermes-agent/pull/158733) / [#158732](https://github.com/NousResearch/hermes-agent/pull/158732) — Windows LSP `.cmd` wrapper + TUI `complete.path` cross-drive fix.

**Stability concern:** A regional testing theme emerged — **Windows and Fedora/nixpkgs** both produced multiple independent bugs (#152435, #145469, #143567, #158733, #158732), suggesting reduced CI coverage on those platforms.

---

## 6. Feature Requests & Roadmap Signals

**Likely to land next:**
- **Proactivity roadmap** ([#158538](https://github.com/NousResearch/hermes-agent/issues/158538), teknium1) — Filed *yesterday* by a maintainer, benchmarking Hark/dots/Muse/Grok, framing Hermes's design philosophy (approved jobs only, no noisy background pass). Strong signal this scaffolds a near-term feature epic.
- **Agent-callable MCP forced rediscovery** ([#140724](https://github.com/NousResearch/hermes-agent/issues/140724)) — Follow-up to #58414; complements Desktop reload controls #136778.
- **Skill creation via `skill_manage(action='create_python')`** ([#96620](https://github.com/NousResearch/hermes-agent/pull/96620)) — Long-open (since August), 20/20 tests passing; candidate for eventual merge.

**Medium-term:**
- **`gateway.standalone` removal** ([#147148](https://github.com/NousResearch/hermes-agent/issues/147148)) — Explicit migration-planning issue; blocks cleanup of a documented "temporary shim."
- **Opt-in Unix-socket gateway transport** ([#155529](https://github.com/NousResearch/hermes-agent/issues/155529), security) — For sandboxed macOS clients.
- **RE2 regex migration** — PR [#158716](https://github.com/NousResearch/hermes-agent/pull/158716) opens "Stage S0" of a stdlib `re` → Google RE2 migration, a large multi-PR program.

**Prediction:** The next minor release is likely to include the OSC 7501 terminal status feature (already merged) and, if review moves quickly, the Kanban/LSP/Windows-PATH fixes above. Proactivity work (#158538) is probably one release cycle out given it's still in design-discussion phase.

---

## 7. User Feedback Summary

**Pain points (verbatim themes):**
- **Interactivity unreliability** — "queued instead of steering," "sent without reaching the harness," "Steer button no-ops silently" ([#141973](https://github.com/NousResearch/hermes-agent/issues/141973)). Users lose confidence in desktop control.
- **Cross-platform erosion** — Windows users report orphaned processes, LSP failures, `complete.path` crashes, and browser `fcntl` errors across ≥4 distinct issues. macOS users hit sleep-related turn interruptions ([#144503](https://github.com/NousResearch/hermes-agent/issues/144503)).
- **Install/update friction** — Multiple reports of `hermes update`/`pm install` failing on specific distros (Fedora, nixpkgs, Docker v0.23.1), including a **v0.22.5 → v0.23.1 regression** ([#152519](https://github.com/NousResearch/hermes-agent/issues/152519)).
- **Silent failures** — Reasoning effort dropped behind proxies ([#156806](https://github.com/NousResearch/hermes-agent/issues/156806)); plugin hooks not firing on provider exhaustion ([#137357](https://github.com/NousResearch/hermes-agent/issues/137357)); stale-call breaker latching permanently ([#89587](https://github.com/NousResearch/hermes-agent/issues/89587)). Users want **visible, honest state**.

**Satisfaction signals:**
- High engagement on profile lifecycle tracker (#155595, 17 comments) with contributors actively coordinating — engaged, invested community.
- The OSC 7501 feature saw **five separate PR attempts** plus community 👍, indicating users actively *wanted* terminal-agent integration enough to write competing implementations.

**Dissatisfaction signals:**
- Long-tail unfixed bugs (e.g., #75444 open since July 31) risk contributor attrition.
- Perception that v0.23.1 introduced regressions without corresponding patch cadence (no release in the last 24h despite numerous P2s).

---

## 8. Backlog Watch

Items needing maintainer attention due to **age, severity, or lack of response**:

| Item | Age | Why it matters |
|------|-----|----------------|
| [#75444](https://github.com/NousResearch/hermes-agent/issues/75444) — Kanban infinite block bounce | **~4 months** | Fix PR [#158743](https://github.com/NousResearch/hermes-agent/pull/158743) now open — needs timely review before it rots. |
| [#89587](https://github.com/NousResearch/hermes-agent/issues/89587) — Circuit breaker lacks half-open state | ~3 months | Permanent-failure latch affects unattended single-provider sessions; no fix in flight. |
| [#101185](https://github.com/NousResearch/hermes-agent/issues/101185) — Discord auto-TTS never plays in VC | ~3 months | Platform integration fully broken; no assigned PR. |
| [#137357](https://github.com/NousResearch/hermes-agent/issues/137357) — Missing end-of-turn hooks | ~6 weeks | Blocks plugin reliability; small surface, no fix. |
| [#144503](https://github.com/NousResearch/hermes-agent/issues/144503) — Sleep-expired turn lease | ~4 weeks | Reproducible macOS laptop bug; simple wall-clock-vs-monotonic fix candidate. |
| [#96620](https://github.com/NousResearch/hermes-agent/pull/96620) — `create_python` skill action | ~3 months | Community-contributed, tested, but unmerged — a stalled PR signals review bottleneck. |
| [#147148](https://github.com/NousResearch/hermes-agent/issues/147148) — `gateway.standalone` removal plan | ~3 weeks | Migration-planning blocker; needs maintainer decision to unblock cleanup PRs. |

**Recommendation:** The clearest near-term win is reviewing the **five fix PRs opened today** (#158166, #158739, #158743, #158742, #158733/#158732) — they collectively retire several P2 issues and would materially reduce active-issue count within days. Second priority: address the **#75444 microservice state-machine** and **#144503 wall-clock lease** as structural correctness issues, since both represent *latent* failures that quietly degrade production reliability.

---

*Digest generated from GitHub activity data for 2026-11-22. All links reference the public repository at `NousResearch/hermes-agent`.*

</details>

<details>
<summary><strong>IronClaw</strong> — <a href="https://github.com/nearai/ironclaw">nearai/ironclaw</a></summary>

# IronClaw Project Digest — 2026-11-22

## 1. Today's Overview

IronClaw shows minimal activity over the past 24 hours: only a single issue was updated, with no pull requests opened, merged, or closed, and no new releases published. The one active item is an open feature request (#8174) proposing LLMTR as a built-in OpenAI-compatible LLM provider. With zero PR throughput and no release cadence, the project is in a quiet maintenance window rather than an active development sprint. The lack of bug reports or stability regressions is a positive signal, though the near-total absence of contributor activity warrants monitoring. Overall health reads as **stable but idle**, driven by a single community feature request rather than internal roadmap work.

## 2. Releases

No new releases in the reporting window. Latest release information is unavailable; no changelog, breaking changes, or migration notes to report.

## 3. Project Progress

No pull requests were merged or closed in the last 24 hours, and no PRs remain open. There is no measurable feature advancement, refactoring, or bug-fix throughput to report today. The project's forward motion currently rests entirely on issue-level discussion.

## 4. Community Hot Topics

Only one item registered activity in the last 24 hours, making it the de facto top topic:

- **[Issue #8174 — feat: add LLMTR as a built-in OpenAI-compatible LLM provider](https://github.com/nearai/ironclaw/issues/8174)** (OPEN, 1 comment, 0 👍, created & updated 2026-11-21)

  **Underlying need:** The requester (`knowhycodata`) is asking for LLMTR to be added to the built-in provider catalog at `crates/domains/ironclaw_llm/assets/providers.json`, alongside existing entries such as Groq, Together, Cerebras, and MiniMax. LLMTR is described as an OpenAI-compatible gateway (`https://llmtr.com/v1`) that uses namespaced `vendor/model` IDs.

  **Analysis:** This reflects a recurring pattern in the AI-agent ecosystem — users want a **catalog-driven, zero-code path** to plug in OpenAI-compatible gateways rather than writing custom provider adapters. The namespaced `vendor/model` convention suggests IronClaw's provider schema may need to tolerate richer model-ID formats. Because the provider list is asset-based (`providers.json`), this is likely a low-complexity, configuration-level addition — a favorable signal for fast triage if a maintainer picks it up.

## 5. Bugs & Stability

No bugs, crashes, or regressions were reported or updated in the last 24 hours. There are no known open stability issues in this window, and no fix PRs are pending. Stability status: **no signal / nominal**.

## 6. Feature Requests & Roadmap Signals

One feature request is active today:

- **LLMTR built-in provider support** ([#8174](https://github.com/nearai/ironclaw/issues/8174)) — a straightforward addition to the existing provider catalog.

**Prediction:** Given that IronClaw already ships a curated catalog (Groq, Together, Cerebras, MiniMax) and the requested integration is OpenAI-compatible, this is a **plausible candidate for the next minor release** if the maintainers accept community-contributed provider entries. The main gating factors are (a) whether LLMTR meets any provider-inclusion criteria (stability, auth model, rate limits) and (b) whether the team prefers to expand the catalog proactively versus on request. If merged, it would lower friction for users already standardizing on OpenAI-compatible gateways.

## 7. User Feedback Summary

The single data point available suggests a **satisfied-but-demanding integrator profile**: the user is engaged enough to inspect the repository structure (citing the exact `providers.json` path and neighboring providers) and to request a specific, well-scoped enhancement rather than filing a vague complaint. This indicates the existing provider architecture is discoverable and extensible in users' eyes — a positive signal. No dissatisfaction, pain points around reliability, or negative feedback were recorded today. The implicit pain point is **coverage gaps in the built-in provider catalog** for users of niche or regional OpenAI-compatible gateways.

## 8. Backlog Watch

With only one issue updated in the last 24 hours and it being freshly created (2026-11-21, already carrying 1 comment), there are **no long-unanswered or stale items** visible in this dataset. However, the absence of any open PRs and the single-thread activity pattern suggest the maintainer team should watch for:

- **Issue #8174** ([link](https://github.com/nearai/ironclaw/issues/8174)) — a timely response (accept, defer, or decline with rationale) would signal an active, responsive maintainership, especially given it is the *only* community touchpoint in the window.

---

**Data caveats:** This digest reflects only the 24-hour slice provided. The absence of PRs, releases, and bug reports may indicate a genuinely quiet day rather than a comprehensive picture of project health. Sustained low activity over multiple days would be worth flagging.

</details>

<details>
<summary><strong>QwenPaw</strong> — <a href="https://github.com/agentscope-ai/QwenPaw">agentscope-ai/QwenPaw</a></summary>

# QwenPaw Project Digest — 2026-11-22

## 1. Today's Overview

QwenPaw shows moderate maintenance activity over the last 24 hours: 6 issues and 11 PRs were updated, but **zero PRs were merged or closed** and **no new releases** were published. The issue pipeline remains balanced (4 open/active, 2 closed), while the PR queue is entirely open (11/11), signaling a review bottleneck rather than a development slowdown. Several long-running PRs (#7828 since September, #8479 since October) continue to receive updates without being merged, suggesting maintainer bandwidth is the limiting factor. Positively, the community is submitting small, well-scoped fixes (LICENSE typo, dead links, table scrolling, config docs) that mirror open issues almost 1:1 — a healthy sign of responsiveness from contributors, if not yet from reviewers.

## 2. Releases

No new releases in the last 24 hours. Nothing to report on breaking changes, migration notes, or version-specific guidance.

## 3. Project Progress

No PRs were merged or closed today, so there is no shipped progress to report. However, two issues were closed:

- **#6475** [[Feature]: `notice_after_complete` tool](https://github.com/agentscope-ai/QwenPaw/issues/6475) — enhancement for async task completion notifications. Closed after ~4 months of discussion (3 comments).
- **#7583** [[Feature]: AgentScope community integration](https://github.com/agentscope-ai/QwenPaw/issues/7583) — community login/feedback features. Also closed after extended discussion.

These closures suggest either feature rejection/deferral or implementation via other channels; the issue excerpts do not confirm resolution. Advances in-flight include the approval-routing fix (#8303), background-startup chat rejection (#8770), and runtime base-path deployment (#8719), all still under review.

## 4. Community Hot Topics

Activity volume is low across the board (max 3 comments per item), indicating a quiet period rather than a single hot debate. The most-discussed items:

- **[Issue #6475](https://github.com/agentscope-ai/QwenPaw/issues/6475)** (3 comments, closed) — Long-running task notification tool. Underlying need: users want agents to work asynchronously without blocking conversation flow, a core UX expectation for production agent use.
- **[Issue #7583](https://github.com/agentscope-ai/QwenPaw/issues/7583)** (3 comments, closed) — AgentScope community integration. Underlying need: tighter feedback loops between local tool usage and the broader community ecosystem.
- **[Issue #8840](https://github.com/agentscope-ai/QwenPaw/issues/8840)** (2 comments) and **[Issue #8843](https://github.com/agentscope-ai/QwenPaw/issues/8843)** (2 comments) — documentation/license accuracy issues, both already paired with fix PRs (#8849, #8846).

No PR accumulated comments or reactions, reinforcing that review attention is the scarce resource.

## 5. Bugs & Stability

Ranked by severity:

1. **#8851 [OPEN] [Bug] Console import map double-loads bundle, plugin routes never register** ([link](https://github.com/agentscope-ai/QwenPaw/issues/8851)) — *High severity.* Frontend plugins fail with `PawApp <id> did not register its app route`; root cause is an import map rewriting the entry chunk to `?v=<hash>`, causing the bundle to load twice. Breaks extensibility. No fix PR yet.
2. **#8843 [OPEN] [Bug] Config docs mislead QA agent into destructive `PUT /envs`** ([link](https://github.com/agentscope-ai/QwenPaw/issues/8843)) — *High severity (data loss).* Docs list only `GET/PUT/DELETE /envs`, so an agent-driven `PUT` wipes all other env vars. **Fix PR exists: [#8846](https://github.com/agentscope-ai/QwenPaw/pull/8846)** documenting merge/replace/reset semantics.
3. **#8840 [OPEN] [Bug] LICENSE typo ("the Licensor")** ([link](https://github.com/agentscope-ai/QwenPaw/issues/8840)) — *Low severity* but legally relevant (Apache 2.0 fidelity). **Fix PR exists: [#8849](https://github.com/agentscope-ai/QwenPaw/pull/8849)**.
4. **#8848 [OPEN] [Question] Compact-failure message misleads users toward `/clear`** ([link](https://github.com/agentscope-ai/QwenPaw/issues/8848)) — *Medium severity.* Failure path in `command_handler.py` suggests `/clear`, risking context loss. No fix PR yet.

Additional stability fixes awaiting merge: **#8770** (chat accepted during background startup hangs silently) and **#8303** (approval prompts never reaching WeChat/chat channels, timing out silently).

## 6. Feature Requests & Roadmap Signals

- **Async completion notifications (#6475, closed)** — if closed as "will implement," expect an agent tool or runtime hook for long-running tasks in an upcoming release.
- **AgentScope community integration (#7583, closed)** — login, inbox, and feedback features; a possible console-side roadmap item.
- **Runtime base-path deployment ([PR #8719](https://github.com/agentscope-ai/QwenPaw/pull/8719))** — adds `QWENPAW_BASE_PATH` for reverse-proxy hosting; a deployment-flexibility signal likely to land soon.
- **Approval routing to originating channels ([PR #8303](https://github.com/agentscope-ai/QwenPaw/pull/8303))** — cross-channel approval delivery, a frequently reported gap.

Prediction: the next version likely prioritizes the small, already-PR'd documentation and typo fixes plus the startup/approval stability fixes; larger features (async notifications, community integration) require maintainer commitment before appearing in a release.

## 7. User Feedback Summary

- **Pain points:** (a) agents block on long tasks instead of responding asynchronously (#6475); (b) approvals raised in one channel (e.g., WeChat) never arrive, causing silent timeouts (#8303); (c) documentation that misleads both humans *and* the in-product QA agent into destructive API calls (#8843); (d) frontend plugin system broken by bundling behavior (#8851); (e) failure messages that encourage destructive recovery (`/clear`) (#8848).
- **Use cases:** multi-channel agent operation (WeChat, console), plugin/extension development, and background/long-running job orchestration.
- **Sentiment:** Constructive and detail-oriented — contributors are writing precise root-cause reports and matching fixes. Dissatisfaction centers on **review latency** (PRs open 1–2+ months) rather than on missing features or unfriendly maintainers.

## 8. Backlog Watch

Long-unanswered or stalled items needing maintainer attention:

- **[PR #7828](https://github.com/agentscope-ai/QwenPaw/pull/7828)** — "Dev my fix," first-time contributor, size/XXXL, open since **2026-09-17** (~2 months). Large PR with an unfilled description template is at risk of abandonment; needs triage or clear closure guidance.
- **[PR #8479](https://github.com/agentscope-ai/QwenPaw/pull/8479)** — Office skills sync with Anthropic July 2026 update, open since **2026-10-28**, labeled *Under Review*. Large but well-described; overdue for a review decision.
- **[PR #8588](https://github.com/agentscope-ai/QwenPaw/pull/8588)** — OpenViking memory follow-up cleanup, open since **2026-11-05**, *Under Review*. Follow-up work tied to #7613; risk of drift if unreviewed.
- **[PR #8303](https://github.com/agentscope-ai/QwenPaw/pull/8303)** — Approval delivery fix, open since **2026-10-18**; addresses a recurring user-visible bug (#6695/#6819 lineage). High user impact, should be prioritized.

**Overall health assessment:** The project is in a *stable but review-constrained* state. Contributor inflow is healthy and issue quality is high, but the absence of merges over a 24-hour window — and multi-month-old PRs — points to maintainer bandwidth as the primary risk to momentum.

</details>

<details>
<summary><strong>ZeroClaw</strong> — <a href="https://github.com/zeroclaw-labs/zeroclaw">zeroclaw-labs/zeroclaw</a></summary>

# ZeroClaw Project Digest — 2026-11-22

## 1. Today's Overview

ZeroClaw shows **high-velocity maintenance activity** with 18 issues and 50 PRs touched in the last 24 hours, though no new releases landed. The project is in a **stabilization and security-hardening phase**, evidenced by six closed issues (several P1/S1 bugs) and seven merged/closed PRs, while a large backlog of 43 open PRs suggests review bandwidth may be a bottleneck. The dominant themes today are **cost-enforcement correctness** (three related issues from JordanTheJet), **dashboard/web UX polish** (four issues from GaijinSystems and JordanTheJet), and **security model expansion** (RFC #12422 on scoped credentials). Overall project health appears **solid but review-constrained**: contributors are productive, but a growing queue of XL-sized PRs (many flagged `risk:high`) may slow merge cadence.

---

## 2. Releases

**None.** No new releases in the last 24 hours. The most recent release-tagged work targets **v0.9.1** (visible on issues #12400, PR #12497, #12608), suggesting an upcoming patch release is in preparation but not yet cut.

---

## 3. Project Progress

Seven PRs merged/closed today, including:

- **[PR #12574](https://github.com/zeroclaw-labs/zeroclaw/pull/12574) [CLOSED]** — `test(ci): fail a stopped parallel runtime pass at a deadline`. Fixes a 30-minute job-timeout waste caused by hung Telegram tests (#12350 recorded three such hangs on 2026-11-09 alone). Improves CI reliability and feedback speed.
- **[PR #12608](https://github.com/zeroclaw-labs/zeroclaw/pull/12608) [CLOSED]** — `docs(runtime): propose ADR-016 exception for Okta and Entra ID token compatibility`. Documentation/architecture governance progress for OIDC.

Closed issues representing resolved work:
- **[Issue #9946](https://github.com/zeroclaw-labs/zeroclaw/issues/9946) [CLOSED]** — P1/S1 browser subprocess hang (unbounded `agent-browser` waits). **High-impact stability fix.**
- **[Issue #10987](https://github.com/zeroclaw-labs/zeroclaw/issues/10987) [CLOSED]** — WhatsApp Web poll votes now surface as `[choice]` messages (parity with Signal).
- **[Issue #9896](https://github.com/zeroclaw-labs/zeroclaw/issues/9896) [CLOSED]** — Misleading `Memory: none` banner when sqlite backend is active.
- **[Issue #12145](https://github.com/zeroclaw-labs/zeroclaw/issues/12145) [CLOSED]** — WASM plugin store limiter bypass (10,000 memories/tables defaults) — **security fix**.
- **[Issue #12484](https://github.com/zeroclaw-labs/zeroclaw/issues/12484) [CLOSED]** — Windows plugin `remove()` failure on missing directory.
- **[Issue #12400](https://github.com/zeroclaw-labs/zeroclaw/issues/12400) [CLOSED]** — Windows dashboard write-deadline test.

**Net signal:** A productive cleanup day across browser, plugin security, memory reporting, and Windows CI.

---

## 4. Community Hot Topics

Ranked by comment count:

1. **[Issue #12422](https://github.com/zeroclaw-labs/zeroclaw/issues/12422) [OPEN, 6 comments]** — *RFC: Scoped use of operator-managed service credentials.* Proposes letting operators authorize an agent to act against a service **without disclosing the credential to the model, chat, skill text, or generated code**. This is the most-discussed item and signals the community's central concern: **agent security boundaries vs. capability**. PR #12596 (browser username/password + TOTP scoping) depends on this RFC.

2. **[Issue #10987](https://github.com/zeroclaw-labs/zeroclaw/issues/10987) [CLOSED, 5 comments]** — WhatsApp poll vote surfacing. Demonstrates demand for **channel feature parity** (Signal had it; WhatsApp didn't).

3. **[Issue #9946](https://github.com/zeroclaw-labs/zeroclaw/issues/9946) [CLOSED, 4 comments]** — Unbounded browser subprocess waits. Long-standing reliability pain now resolved.

4. **[Issue #9896](https://github.com/zeroclaw-labs/zeroclaw/issues/9896) [CLOSED, 2 comments]** — Memory status banner mismatch. Small but user-visible trust issue.

**Underlying need:** The community is converging on **least-privilege agent design** — credentials, browser access, and cost all need independent, revocable scopes rather than all-or-nothing grants.

---

## 5. Bugs & Stability

Ranked by severity (reported/active today):

| Severity | Issue | Summary | Fix PR? |
|---|---|---|---|
| **S2** | [#12627](https://github.com/zeroclaw-labs/zeroclaw/issues/12627) | Sub-agent spawned via `spawn_subagent` inside bounded delegation **escapes the delegate's per-hop cost ceiling** — cost-control bypass | No |
| **S2** | [#12633](https://github.com/zeroclaw-labs/zeroclaw/issues/12633) | Stale voice settings screen can switch a device back to browser-service recognition | No |
| **S2** | [#12632](https://github.com/zeroclaw-labs/zeroclaw/issues/12632) | Voice auto-send can send **text typed after dictation ends** (privacy/UX risk) | No |
| **S2** | [#12619](https://github.com/zeroclaw-labs/zeroclaw/issues/12619) | Failed session-state write leaves session stuck `running` until restart; Stop can't clear it | No |
| **S3** | [#12638](https://github.com/zeroclaw-labs/zeroclaw/issues/12638) | Agent cards show `<$0.01` for zero spend | **[PR #12639](https://github.com/zeroclaw-labs/zeroclaw/pull/12639) open** |
| **S3** | [#12630](https://github.com/zeroclaw-labs/zeroclaw/issues/12630) | Dashboard Channels card shows only ~4 channels, leaves rest of card empty | No |

**Closed stability wins today:** #9946 (S1 browser hang), #12145 (S2 WASM memory limiter bypass), #12484 (S2 Windows plugin removal).

**Notable pattern:** Three of today's S2 bugs (#12632, #12633, #12619) involve **state/race conditions in the web dashboard and gateway** — a recurring class. The cost-ceiling bypass in #12627 is the most security-relevant new bug and pairs with the cost-enforcement cluster below.

---

## 6. Feature Requests & Roadmap Signals

Strongest signals pointing to **v0.9.1 or v0.10**:

- **[Issue #12626](https://github.com/zeroclaw-labs/zeroclaw/issues/12626) [risk:high]** — Make `cost.enforcement.mode = "route_down"` actually switch to `route_down_model`. *Currently documented but non-functional.* Config claims that don't work are a trust problem.
- **[Issue #12628](https://github.com/zeroclaw-labs/zeroclaw/issues/12628)** — Notify session when `mode = "warn"` lets a call through past the limit.
- **[Issue #12625](https://github.com/zeroclaw-labs/zeroclaw/issues/12625)** — Let `shell`/`script` skills run programs **without a shell**, so arguments can carry free-form text safely (avoids `sh -c` injection surface).
- **[Issue #12621](https://github.com/zeroclaw-labs/zeroclaw/issues/12621)** — Retire the Raspberry Pi deploy script (dead/superseded tooling).
- **[Issue #12613](https://github.com/zeroclaw-labs/zeroclaw/issues/12613)** — "Deslop pass" tracker: dead code, inert features, comment/doc cleanup.

**Prediction:** The **cost-enforcement triad (#12626, #12627, #12628)** plus **[PR #11589](https://github.com/zeroclaw-labs/zeroclaw/pull/11589)** (operator override of exceeded cost limit) will likely land together as a coherent "cost control correctness" milestone. The **#12613 deslop tracker** and **#12621 RPi removal** suggest maintainers are actively pruning the surface area ahead of a stabilization release.

---

## 7. User Feedback Summary

**Pain points (dissatisfaction):**
- **Config that lies.** Multiple issues (#12626, #9896) report documented settings that don't take effect — erodes operator trust.
- **Cost limits are porous.** #12627 shows sub-agents can bypass delegation ceilings; #12628 shows `warn` mode silently allows overspend. Operators care about hard cost guarantees.
- **Dashboard state races.** Voice settings, session state, and cost bars all show stale/incorrect values (#12632, #12633, #12637, #12619).
- **Windows CI flakiness** (#12484, #12400) — recurring platform-test friction.

**Use cases surfacing:**
- **Multi-tenant/operator-managed credentials** (RFC #12422) — enterprises want to grant agents narrow, revocable access without leaking secrets to the model.
- **Free/local model users** (#12638) — the `< $0.01` bug specifically hit users running free local models; a growing segment.
- **Channel parity** (#10987) — users expect the same interaction primitives (polls, edits) across Signal/WhatsApp/Telegram/Matrix.

**Satisfaction signals:** Rapid closure of S1/S2 bugs (#9946, #12145) and prompt maintainer engagement on RFCs (6 comments on #12422) indicate a responsive core team.

---

## 8. Backlog Watch

Long-open, high-value items needing maintainer attention:

- **[PR #11589](https://github.com/zeroclaw-labs/zeroclaw/pull/11589) [OPEN since 2026-10-07, ~46 days, risk:high, size:XL]** — Operator override of exceeded cost limit. Author Audacity88; flagged `needs-author-action`. Overlaps heavily with today's cost cluster — **should be prioritized or explicitly deferred.**
- **[PR #12198](https://github.com/zeroclaw-labs/zeroclaw/pull/12198) [OPEN since 2026-11-02, `needs-author-action`]** — `default_provider` fallback for transcription. Voice transcription currently silently does nothing without per-agent config — a real usability gap.
- **[PR #12371](https://github.com/zeroclaw-labs/zeroclaw/pull/12371) [OPEN since 2026-11-10, size:L]** — Telegram `edited_message` handling. High-value channel parity work; still awaiting merge.
- **[PR #12443](https://github.com/zeroclaw-labs/zeroclaw/pull/12443) [OPEN since 2026-11-14, `breaking-change`, risk:high, size:XL]** — Move IRC/Twitch out of the binary into WASM registry plugins. Architecturally significant; needs careful review before v0.9.1.
- **[PR #12271](https://github.com/zeroclaw-labs/zeroclaw/pull/12271) [OPEN since 2026-11-06, size:XL]** — Route external peers to explicit destinations. Stacked on #12116; reshaped after review.

**Backlog risk:** Five XL-sized PRs are open simultaneously, several with `needs-author-action` or `risk:high`. The **review queue, not contribution, is the binding constraint** on ZeroClaw's velocity right now. Maintainers should consider triaging the cost-enforcement cluster as a batch and explicitly sequencing the breaking-change plugin migration (#12443) against the v0.9.1 patch release.

---

*Digest generated from GitHub activity data for 2026-11-21/22. All links reference `github.com/zeroclaw-labs/zeroclaw`.*

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*