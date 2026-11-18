# OpenClaw Ecosystem Digest 2026-11-18

> Issues: 472 | PRs: 500 | Projects covered: 5 | Generated: 2026-11-18 02:50 UTC

- [OpenClaw](https://github.com/openclaw/openclaw)
- [Hermes Agent](https://github.com/nousresearch/hermes-agent)
- [IronClaw](https://github.com/nearai/ironclaw)
- [QwenPaw](https://github.com/agentscope-ai/QwenPaw)
- [ZeroClaw](https://github.com/zeroclaw-labs/zeroclaw)

---

## OpenClaw Deep Dive

# OpenClaw Project Digest — 2026-11-18

## 1. Today's Overview

OpenClaw remains in a **high-velocity but strained maintenance phase**. Activity is exceptionally heavy — 472 issues and 500 PRs touched in 24h — yet the open/active ratio (361 open vs. 111 closed issues; 245 open vs. 255 merged/closed PRs) shows the queue is being worked aggressively without net clearing. The single release this cycle, **v2026.11.5**, is a stability-focused patch addressing restart-safe conversations and safer rollback on failed updates. Underneath the surface, a recurring cluster of **state-migration, SQLite/WAL contention, and update-repair deadlock** issues continues to dominate the highest-severity (P0/P1) backlog, several of which have been open since September. Community engagement is real but thin per-item (top issues carry 10–42 comments), suggesting a small, technically deep user base filing detailed reproductions rather than broad casual adoption.

---

## 2. Releases

### v2026.11.5 (latest)

**Highlights:**
- **Restart-safe conversations** — Queued messages, send permissions, and final chat writes are now retained across Gateway restarts (#196923, #196540, #196493). Authored by @steipete.
- **Safer updates** — Failed Doctor or Gateway startup now rolls back an attempted activation, reducing the "partially finalized" update class of failures.

**Migration / operational notes:**
- No explicit breaking changes documented in the release note excerpt.
- However, community reports tied to this release cycle indicate that **rollback after state migration is still restricted** (`state-migrated-no-rollback`), which remains a source of update deadlock (see #197083, #161921, #183479 below).
- Users on **2026.11.1–2026.11.3** should note that post-install Doctor WAL publication verification can leave an update "partially finalized" (#197083).

**Assessment:** This is a corrective release, not a feature release. The rollback-safety work is directionally correct but does not yet resolve the broader class of migration/rollback interdependency bugs.

---

## 3. Project Progress

**Merged/closed PRs (255 total in 24h).** Notable closures and their impact:

- **#191324 [CLOSED]** — `improve(agents): name the child's runtime and credential on spawn receipts`. This advanced spawn-receipt observability, exposing `resolvedRuntime`, `resolvedAuth`, and `resolvedAuthProfile` for primary models. Directly enabled follow-up test work (#200943).
- **#112313 [CLOSED]** — `Dead-lettered outbound delivery queue entries are permanent`. A long-standing (since July) data-retention bug where failed delivery rows could never be read, retried, or cleared. Its closure removes a permanent `health` counter leak.
- **#158592 [CLOSED]** — `After host sleep/wake, prepared model runtime publication times out and never recovers`. A P0 message-loss bug closed after ~7 weeks.
- **#158070 [CLOSED]** — `Preflight compaction fails with "agent tool caller authority is no longer active"`. A P1 message-loss bug affecting multi-agent deployments.
- **#191818, #187468, #137265, #153417, #155396, #138561** — A broad sweep of P1/P2 behavior, auth-provider, and memory bugs closed in this window.

**Features advanced (still open but active):**
- **#193550** — Plugin hook `before_model_request` to let plugins gate the final provider request (fail-closed policy hook). XL change, compatibility-flagged, awaiting author.
- **#196203** — Install local projects/templates through a live Gateway (`openclaw templates add ./my-template`).
- **#198455** — Allow plugins to contribute Prometheus metric families to the existing scrape route.
- **#141004** — Record observed runtime skill usage in the durable audit surface.

**Observation:** The project is closing older P1s effectively, but the incoming rate of new P1/P0 issues (see §5) roughly offsets it — net backlog is not shrinking.

---

## 4. Community Hot Topics

Ranked by comment count. Note that 👍 counts are strikingly low (0–4), indicating discussion is concentrated among a few highly engaged reporters.

| Rank | Item | Comments | Link |
|---|---|---|---|
| 1 | #164294 — Gateway state DB WAL auto-checkpoint never completes (blocked by in-process reader) | 42 | [openclaw/openclaw#164294](https://github.com/openclaw/openclaw/issues/164294) |
| 2 | #191944 — `gateway stop` / `stop --force` fail on macOS ("Process ancestry could not be fully inspected") | 35 | [#191944](https://github.com/openclaw/openclaw/issues/191944) |
| 3 | #150635 — Short-term recall retention evicts entries nightly; dreaming deep phase never promotes | 29 | [#150635](https://github.com/openclaw/openclaw/issues/150635) |
| 4 | #178359 — `doctor --fix --non-interactive` idles 15+ min, never reaches agent DB repair | 26 | [#178359](https://github.com/openclaw/openclaw/issues/178359) |
| 5 | #168955 — Startup regression 2026.10.1: ready ~1030s vs ~410s (Windows) | 22 | [#168955](https://github.com/openclaw/openclaw/issues/168955) |
| 6 | #197083 — Post-install Doctor WAL publication leaves 11.3 update partially finalized | 21 | [#197083](https://github.com/openclaw/openclaw/issues/197083) |
| 7 | #126360 — `AgentSelectionRequiredError` log flood under explicit multi-agent ownership | 21 | [#126360](https://github.com/openclaw/openclaw/issues/126360) |
| 8 | #48003 — Steer mode does not inject messages mid-turn for main sessions | 20 (👍4) | [#48003](https://github.com/openclaw/openclaw/issues/48003) |

**Underlying needs analysis:**
- **Operational reliability of the state layer** is the dominant theme: WAL checkpointing (#164294), update finalization (#197083), doctor repair hangs (#178359), and startup regressions (#168955) all point to SQLite/state-management fragility as the project's central stability risk.
- **Multi-agent deployments are a first-class use case** (#126360, #48003, #155868, #194451) — users are running 6–7 agents with `sessions_send` routing and hitting coordination edge cases (turn claims, log floods, prompt-cache invalidation).
- **The "dreaming"/memory system is under scrutiny** (#150635) — the deep-phase promotion pipeline silently stalls at cap, undermining a headline feature.

---

## 5. Bugs & Stability

Ranked by severity (P0 > P1), with fix-PR status noted.

### P0 (release blockers)
- **#161921** — After `state-migrated-no-rollback`, `doctor --fix` and `plugins update` each require the other; plugins stuck on previous release. **No fix PR.** ([link](https://github.com/openclaw/openclaw/issues/161921))
- **#153426** — Curated memory roots (`MEMORY.md`/`USER.md`) silently and permanently excluded from bootstrap injection by the provenance ratchet; needs security review. **No fix PR.** ([link](https://github.com/openclaw/openclaw/issues/153426))
- **#89278** — Codex OAuth refresh succeeds but cron/heartbeat fail with 10s auth refresh timeout. **Linked PR open.** ([link](https://github.com/openclaw/openclaw/issues/89278))

### P1 (crash / message-loss / data-loss)
- **#178359** — `doctor --fix --non-interactive` hangs 15+ min, never repairs agent DB (macOS). **No fix PR.** ([link](https://github.com/openclaw/openclaw/issues/178359))
- **#168955** — Startup regression: `sidecars.control-ui-assets` blocks 477s on Windows. **No fix PR.** ([link](https://github.com/openclaw/openclaw/issues/168955))
- **#185578** — Gateway heap floor only ratchets up; ~25 MiB/h leak until V8 cap aborts. **Not repro on main.** ([link](https://github.com/openclaw/openclaw/issues/185578))
- **#181120** — macOS Gateway hangs with main thread blocked closing a worker MessagePort. **Related PR #181551 open** (disables auto-profiler to avoid native lock stall). ([link](https://github.com/openclaw/openclaw/issues/181120))
- **#167406** — Windows MSIX: Codex-enabled Gateway startup starves main thread. **No fix PR.** ([link](https://github.com/openclaw/openclaw/issues/167406))
- **#194403** — Helper-completion continuations invalidate their own authority; conversations blocked. **No fix PR.** ([link](https://github.com/openclaw/openclaw/issues/194403))
- **#194451** — `/think` (and other directives) mid-turn kill the turn with `SqliteTranscriptMutationConflictError`; #192585 only covered `/status`. **Linked PR open.** ([link](https://github.com/openclaw/openclaw/issues/194451))
- **#157255** — Turn claim not released after lane timeout; session wedged 90+ min. **No fix PR.** ([link](https://github.com/openclaw/openclaw/issues/157255))
- **#196505** — `memory index --force` aborts with "worker task capacity reached" instead of retrying on large corpora. **No fix PR.** ([link](https://github.com/openclaw/openclaw/issues/196505))
- **#117262** — SQLite contention: 3 concurrent write handles cause ~33s event-loop stalls (DEF-61). **No fix PR.** ([link](https://github.com/openclaw/openclaw/issues/117262))
- **#152965** — Hot-reloading a non-channel plugin disposes channel plugins without reconnecting; drops inbound messages. **No fix PR.** ([link](https://github.com/openclaw/openclaw/issues/152965))
- **#166641** — `web_fetch` cold fallback synchronously captures unrelated plugins on main thread, causing liveness stalls. **Linked PR open.** ([link](https://github.com/openclaw/openclaw/issues/166641))

### P2 (notable)
- **#164294** (42 comments) — WAL auto-checkpoint never completes. **No fix PR.**
- **#197083** — Update partially finalized after WAL publication failure. **No fix PR.**
- **#182891** — Prompt cache never reused; `cache read dropped N -> 0` on every request. **No fix PR.**
- **#192667** — macOS Settings slowness + dark-theme input visibility — **reporter confirms both resolved on 2026.11.5**. ([link](https://github.com/openclaw/openclaw/issues/192667))

**Fix-PR coverage note:** Of the top-severity items, only a minority (#181120, #89278, #194451, #166641) have linked fix PRs. The most-commented and most-reproduced bugs (WAL checkpoint, doctor hang, state-migration deadlock) remain **unfixed with no PR**, which is the project's clearest health risk.

---

## 6. Feature Requests & Roadmap Signals

| Request | Issue | Likelihood in next release |
|---|---|---|
| Mandatory Memory/Embedding setup in onboarding wizard | [#16670](https://github.com/openclaw/openclaw/issues/16670) | **Medium** — low complexity, addresses a known adoption gap; P3 but widely felt |
| Enforceable checkpoints / bounded yields for long WebChat runs | [#138990](https://github.com/openclaw/openclaw/issues/138990) | **Medium** — needs product decision, tied to foreground-run UX |
| Context budget / skip policy for Skill Workshop on oversized sessions | [#150238](https://github.com/openclaw/openclaw/issues/150238) | **Low-Medium** — linked PR open, awaiting product decision |
| Plugin hook to gate final model provider request (`before_model_request`) | [PR #193550](https://github.com/openclaw/openclaw/pull/193550) | **Medium** — XL PR active, but compatibility-flagged and awaiting author |
| Install local templates via live Gateway | [PR #196203](https://github.com/openclaw/openclaw/pull/196203) | **Medium** — closes a concrete authoring gap |
| Plugin-contributed Prometheus metric families | [PR #198455](https://github.com/openclaw/openclaw/pull/198455) | **Medium** — operational observability demand |

**Prediction:** The next minor release is most likely to ship **operational/observability improvements** (Prometheus plugin metrics, template installation, spawn-receipt naming) rather than the higher-effort product decisions (checkpoint enforcement, memory onboarding). The memory/embedding onboarding step is the most likely *user-facing* addition because it is low-risk and addresses a documented setup failure.

---

## 7. User Feedback Summary

**Pain points (ranked by frequency/severity):**
1. **Updates break installations.** Multiple reporters describe updates that fail at `package-swap`, leave state "partially finalized," or deadlock repair (#197083, #161921, #183479, #187468, #200756). One Windows user (#200756) hit a baseline package scan failure on beta.2→beta.4. This is the single most damaging theme for user trust.
2. **Startup and runtime performance regressions.** #168955 (Windows startup 2.5× slower), #185578 (memory leak), #117262 (33s event-loop stalls) — users are measuring and reporting precisely, indicating production deployments under real load.
3. **Multi-agent coordination failures.** Log floods, turn-claim wedges, prompt-cache misses, and duplicate messages (#126360, #48003, #157255, #39476, #155868).
4. **Memory system unreliability.** Recall eviction (#150635), indexing failures (#196505), and silent memory-root exclusion (#153426) undercut a headline feature.

**Satisfaction signals:**
- Users are highly engaged and technically capable — detailed repros, V8 profiles, symbolized samples. This is a committed, self-hosting audience.
- #192667's reporter confirming resolution on 2026.11.5 shows fixes do land and are acknowledged.
- Low 👍 counts suggest a small but deep community rather than a broad one; there is little "casual" feedback noise.

**Dissatisfaction signals:**
- Repeated "still reproduces on current main" updates on long-lived issues (e.g., #167609, #141474) indicate maintainer response latency relative to reporter effort.
- The `state-migrated-no-rollback` pattern is a recurring source of frustration because it removes the user's escape hatch.

---

## 8. Backlog Watch

Long-unanswered or high-impact items needing maintainer attention (all open, no fix PR unless noted):

| Issue | Age | Why it needs attention |
|---|---|---|
| [#48003](https://github.com/openclaw/openclaw/issues/48003) — Steer mode does not inject mid-turn | Since 2026-03-16 (~8 mo) | P1 session-state/message-loss; highest 👍 (4) on the board; core UX feature |
| [#89278](https://github.com/openclaw/openclaw/issues/89278) — Codex OAuth cron/heartbeat 10s timeout | Since 2026-06-02 (~5.5 mo) | P0; linked PR open but stalled |
| [#117262](https://github.com/openclaw/openclaw/issues/117262) — SQLite 3-handle contention (DEF-61) | Since 2026-08-01 (~3.5 mo) | P1 crash-loop; root-cause of many stall reports |
| [#126360](https://github.com/openclaw/openclaw/issues/126360) — `AgentSelectionRequiredError` log flood | Since 2026-08-19 (~3 mo) | P2 but 21 comments; explicit multi-agent config |
| [#153426](https://github.com/openclaw/openclaw/issues/153426) — Memory roots silently excluded (provenance ratchet) | Since 2026-09-20 (~2 mo) | P0, needs security review; data-loss for memory feature |
| [#161921](https://github.com/openclaw/openclaw/issues/161921) — doctor/plugins mutual dependency after no-rollback | Since 2026-09-30 (~7 wk) | P0 release blocker; no PR |
| [#164294](https://github.com/openclaw/openclaw/issues/164294) — WAL auto-checkpoint never completes | Since 2026-10-03 (~6 wk) | **Most-commented issue (42)**; no fix PR |
| [#178359](https://github.com/openclaw/openclaw/issues/178359) — doctor --fix hangs 15+ min | Since 2026-10-20 (~4 wk) | P1 crash-loop; blocks recovery from other bugs |
| [PR #193550](https://github.com/openclaw/openclaw/pull/193550) — `before_model_request` plugin hook | Since 2026-11-05 | XL, compatibility risk, awaiting author — a key extensibility decision |

**Assessment:** The project's health is **mixed but not alarming**. Maintainers are closing real P1s and shipping corrective releases, but the *unfixed, high-comment* cluster around state/SQLite/update machinery is aging past the point where reporters expect resolution. The most impactful single action would be a maintainer-owned **state-layer hardening epic** (WAL checkpointing, rollback semantics, doctor repair) — it would resolve or unblock roughly a third of the top-severity backlog simultaneously. Secondary priority: unblocking the P0 items #89278 and #153426, both of which have stalled despite clear reproductions.

---

## Cross-Ecosystem Comparison

# Cross-Project Comparison Report — Personal AI Assistant / Agent OSS Ecosystem
**Snapshot: 2026-11-18 | Projects: OpenClaw, Hermes Agent, IronClaw, QwenPaw, ZeroClaw**

---

## 1. Ecosystem Overview

The agent/personal-AI-assistant OSS landscape is **past the feature-race phase and into a hardening phase**. Every project except IronClaw is processing high issue/PR volumes (>20 issues touched/24h), yet all five share the same bottleneck: a growing backlog of **state-layer, session-lifecycle, and update-machinery defects** that cap production reliability. The community is small, technically deep, and self-hosting — evidenced by low 👍 counts (0–4) alongside detailed V8 profiles, SQLite WAL traces, and symbolized stack samples. Security boundaries (approval gating, emergency stop, hook fail-open behavior) have emerged as a cross-cutting concern, driven by auditors rather than casual users. Meanwhile, plugin architecture has become the universal roadmap bet: four of five projects are actively extracting capabilities (MCP, memory, local models, channels, theming) into plugin surfaces.

---

## 2. Activity Comparison

| Project | Issues (24h) | PRs (24h) | Release Status | Net Backlog Trend | Health Score |
|---|---|---|---|---|---|
| **OpenClaw** | 472 touched (361 open / 111 closed) | 500 touched (245 open / 255 merged) | v2026.11.5 shipped (stability patch) | ⚠️ Flat — intake ≈ closure | **6.5/10** |
| **Hermes Agent** | 50 updated (50 open / **0 closed**) | 50 touched (42 open / 8 merged) | v0.23.2 canary (no changelog) | 🔴 Growing — no closures | **4.5/10** |
| **IronClaw** | 0 updated | 10 touched (all Dependabot) | None | 🟡 Stalled — automated only | **3.5/10** |
| **QwenPaw** | 23 updated (11 open / 12 closed) | 50 touched (29 open / 21 merged) | None (post-2.3.0 stabilization) | 🟢 Healthy churn | **7.5/10** |
| **ZeroClaw** | 21 touched (all open) | 50 touched (41 open / 9 merged) | v0.9.1 in preparation | 🟡 Stabilizing | **6/10** |

**Scoring basis:** closure ratio, presence of fix PRs for top-severity bugs, release cadence, community engagement depth, and backlog age for P0/S0 items.

**Notes:**
- OpenClaw's absolute numbers dwarf peers (~10× Hermes/ZeroClaw), but its **fix-PR coverage on top-severity bugs is the weakest in relative terms** — the most-commented issues (WAL checkpoint #164294, doctor hang #178359) have zero PRs.
- Hermes Agent's **50-open/0-closed issue day** is the single clearest red flag in the dataset.
- QwenPaw is the only project with same-day fix turnaround on a high-severity bug (#8700 → #8701) and a healthy open/closed PR ratio (~1.4:1).

---

## 3. OpenClaw's Position

**Advantages vs. peers:**
- **Reference implementation status.** OpenClaw ships the most capabilities in-flight (plugin hooks `before_model_request`, live template install, Prometheus plugin metrics, spawn-receipt observability) and is the only project with a formal compatibility-flagged change process.
- **Largest observed community footprint** — 472 issues + 500 PRs in 24h vs. Hermes' 50+50, ZeroClaw's 21+50, QwenPaw's 23+50, IronClaw's 0+10. This is roughly **5–45× the throughput of any peer**.
- **Most mature release discipline** — v2026.11.5 demonstrates a corrective-release cadence peers lack (Hermes ships canary with no changelog; IronClaw has no release; QwenPaw/ZeroClaw are mid-cycle).

**Technical approach differences:**
- Deep investment in **SQLite/WAL as the durable substrate** with an in-process reader model — this is the source of both OpenClaw's durability and its worst bottleneck (auto-checkpoint never completes, 3-handle contention causing 33s event-loop stalls).
- **Multi-agent is first-class** — `sessions_send` routing, turn claims, lane timeouts, prompt-cache invalidation are native concerns. Peers treat multi-agent as an extension (Hermes' A2A RFC #132248; QwenPaw's subagent batch dispatch).
- **"Dreaming"/memory as a headline feature** with a deep-phase promotion pipeline — Hermes and ZeroClaw have memory backends (ReMeLight, Lucid) but neither ships an equivalent autonomous memory-consolidation loop.

**Community size comparison:**
- OpenClaw: deep, technically sophisticated, low casual noise → **narrow but committed**.
- QwenPaw: broadest channel surface (WeChat, DingTalk, Telegram, Feishu, QQ) → **widest geographic/user diversity**.
- Hermes/ZeroClaw: **migration-driven** (moltis migrants reference parity) with strong contributor momentum.
- IronClaw: **no visible community activity** in the window.

**Weakness:** OpenClaw's ratio of *reported severity* to *fix-PR coverage* is the worst of the five. #161921 (P0 state-migration deadlock, open 7 weeks, no PR) and #153426 (P0 memory-root silent exclusion, needs security review) are trust-critical and unowned.

---

## 4. Shared Technical Focus Areas

These requirements appear independently across ≥3 projects — strong signals of ecosystem-wide maturity gaps:

| Focus Area | Projects | Specific Needs |
|---|---|---|
| **Plugin architecture as extension surface** | OpenClaw (#193550 hooks), Hermes (#132248 A2A plugin), QwenPaw (#8554 CLI, #8469 MCP, #8499 local-models, #8071 theming), ZeroClaw (#12449 MCP OAuth) | Stable semantic contracts (theming tokens, tool hooks, capability gating); MCP extraction into first-class plugin |
| **Session/admission state durability** | OpenClaw (#157255 turn-claim wedge, #194451 transcript conflict), Hermes (#157169 FIFO wedge, #148540 restore_policy, #150056 admission_conflict), ZeroClaw (#9191 cron lock), QwenPaw (#8771 DingTalk collision) | Persisted state must round-trip; stale admission records must self-heal after restart; **permanent wedges are the worst failure class** |
| **Security/approval enforcement gaps** | Hermes (#59293 CLI bypass, #100942 hook fail-open, #156884 symlink write), ZeroClaw (#9390/#9802 emergency stop, #12514 supervised SOP bypass, #7821 sandbox policy), OpenClaw (#153426 provenance ratchet) | **Uniform enforcement across all entry points**; fail-closed defaults; auditable boundaries |
| **Cost/quota/config semantics honesty** | ZeroClaw (#12477 enforcement mode ignored), QwenPaw (#8776 misclassification, #8798 quota error UX), OpenClaw (context budget #150238), Hermes (tool budgets #80508) | Config knobs must do what they say; graceful fallback on quota exhaustion |
| **Channel/integration reliability** | QwenPaw (WeChat #8709/#8693, DingTalk #8771), Hermes (WhatsApp #63647, Discord #121938), ZeroClaw (VoiceHost #9740, Telegram reasoning #11744) | Release QA for channel plugins; per-channel session isolation invariants |
| **Observability for ops** | OpenClaw (Prometheus metrics #198455, spawn receipts #191324), Hermes (#11116 latency metadata), ZeroClaw (#12476 gateway log flood), IronClaw (latency harness via wasmtime/rustls bumps) | Per-tool/per-request metrics; sensible log levels |

**Convergent need:** *Agents need a durable, self-healing session substrate.* Four of five projects report permanent-wedge bugs from persisted state that their own writers produce but their readers reject.

---

## 5. Differentiation Analysis

| Dimension | OpenClaw | Hermes Agent | QwenPaw | ZeroClaw | IronClaw |
|---|---|---|---|---|---|
| **Primary focus** | Reference multi-agent runtime | Desktop + A2A collaboration | Multi-channel / plugin marketplace | Safety-enforced production runtime | Latency/perf harness |
| **Target users** | Power users, multi-agent operators | Desktop-first individual + small teams | CJK enterprise + broad consumer channels | Security-conscious operators | Perf engineers (internal) |
| **Distinctive tech** | SQLite/WAL, dreaming memory, spawn receipts | 6-PR desktop profile-routing stack, A2A transport | WeChat/DingTalk/Feishu adapters, plugin catalog | Emergency-stop enforcement, sandbox policy, SOP engine | Rust product crates + WASM runtime |
| **Architecture posture** | Monolithic core with plugin hooks | Desktop app + gateway + plugin catalog | Gateway + channel plugins + console | Gateway + channels + SOP + memory backends | Rust harness-first |
| **Where it's strong** | Capability breadth, observability | Desktop perf iteration | Channel diversity, localization (BiDi, CJK) | Safety posture, security audits | Low-level runtime work |
| **Where it's weak** | State-layer hardening; fix-PR coverage | Session durability; issue closure rate | Release-QA for new channels; durable persistence trust | Fix-PR velocity on S1s | Community activity; human-authored progress |

**Key architectural split:** OpenClaw/Hermes/ZeroClaw own the **gateway + persistent-state** pattern with different optimization targets (breadth / desktop UX / safety). QwenPaw optimizes for **channel reach** with a shallower per-adapter isolation model — which is why cross-user session collision (#8771) is uniquely a QwenPaw-class bug. IronClaw is an outlier: a perf-harness project rather than a product runtime.

---

## 6. Community Momentum & Maturity

**Activity tiers:**

- **Tier 1 — High-velocity, strained:** OpenClaw (~1,000 events/24h). Iterating fastest, but intake ≈ closure → net backlog flat. **Rapidly iterating, not stabilizing.**
- **Tier 2 — High-velocity, healthier:** QwenPaw (~73 events, 12 issues closed, 21 PRs merged). **Rapidly iterating with real churn** — the most balanced project. ZeroClaw (~71 events, 9 PRs closed) is close but closure-starved on S1s.
- **Tier 3 — Moderate velocity, stalling:** Hermes Agent (~100 events, **0 issues closed**). Iterating in PR count but not converging. Risk of reporter fatigue.
- **Tier 4 — Low/automated:** IronClaw (10 Dependabot PRs, 0 human activity). **Maintainer-review-lag phase.**

**Maturity signals:**
- Most mature process: **OpenClaw** (compatibility-flagged PRs, corrective releases).
- Most mature safety posture: **ZeroClaw** (S0/S1 triage discipline, RUSTSEC tracking, sandbox RFC).
- Most mature release-velocity on features: **QwenPaw** (same-day fix PRs, plugin marketplace shipping).
- Least mature continuity: **Hermes** (canary release with no changelog; critical security issue #59293 open 4.5 months with `needs-decision`).

**Contributor health:** QwenPaw and ZeroClaw both received same-day fixes from first-time or external contributors (#8701, #11598) — a healthy signal. OpenClaw's author concentration (e.g., @steipete on the release) suggests bus-factor risk. IronClaw shows **zero contributor signal**.

---

## 7. Trend Signals

**For AI agent developers and platform decision-makers:**

1. **The state layer is the product.** SQLite/WAL contention (OpenClaw #117262, #164294), session FIFOs (Hermes #157169), cron locks (ZeroClaw #9191), and admission conflicts (Hermes #150056) all point to the same conclusion: **durable session state with self-healing reconciliation is now the differentiator**, not model choice or tool count. Buyers should evaluate agent frameworks on their failure modes after restart, mid-turn interruption, and profile switch — not on demo polish.

2. **Security controls are failing open by default.** Three independent projects report approval/emergency/hook controls that *silently do nothing* in production deployments (Hermes #100942 under systemd, ZeroClaw #9390 runtime emergency stop, OpenClaw #153426 memory provenance). **Fail-closed must be the default; audit each entry point.** Expect enterprise RFPs to demand this within 2–3 release cycles.

3. **Plugin extensibility is the new moat — and the new attack surface.** Four of five projects are extracting subsystems into plugins. The downstream need is a **stable semantic contract**: theming tokens (QwenPaw #8071), pre-request hooks (OpenClaw #193550), OAuth for remote MCP (ZeroClaw #12449). New plugins must be able to *gate* — not just decorate — the request path.

4. **Channel breadth is a QA liability.** QwenPaw's WeChat `ACCOUNT_IN_USE` duplicate reports (#8709, #8693) and DingTalk session collision (#8771) show that shipping many channels without per-adapter isolation invariants creates silent cross-user data mixing. **Channel plugins need conformance tests before release.**

5. **Configuration semantics must be honest.** ZeroClaw's `cost.enforcement.mode: "warn"` that still stops turns (#12477), QwenPaw's quota-error misclassification (#8776), and OpenClaw's context-budget gaps (#150238) all erode operator trust. **A config flag that doesn't do what it says is worse than no flag.**

6. **The memory feature is a trust surface, not a novelty.** OpenClaw's stalling deep-phase promotion (#150635), silent memory-root exclusion (#153426), and QwenPaw's `ReMeLight` cost concerns (#7719) reveal that "autonomous memory" is not production-ready in any project today. **Treat memory pipelines as security-sensitive data paths**, not UX flourishes.

7. **Observability is becoming table-stakes for ops.** Prometheus plugin metrics (OpenClaw), per-tool latency reporting (Hermes #11116), and log-level control (ZeroClaw #12476) are being requested by self-hosting operators — signaling that **agents are entering the "boring infrastructure" phase** where SRE tooling matters more than capability headlines.

**Bottom line for developers choosing a framework:** QwenPaw currently offers the best forward-momentum/closure ratio; OpenClaw offers the richest capability surface at the cost of state-layer debt; ZeroClaw is the best fit for security-sensitive deployments; Hermes Agent needs to demonstrate issue-closure velocity before it can be recommended for production; IronClaw is not a candidate for external adoption at this time.

---

*Report generated 2026-11-18 from per-project digests. All metrics reflect the provided snapshot; PR comment counts were unavailable in source data.*

---

## Peer Project Reports

<details>
<summary><strong>Hermes Agent</strong> — <a href="https://github.com/nousresearch/hermes-agent">nousresearch/hermes-agent</a></summary>

# Hermes Agent — Project Digest
**Date: 2026-11-18** | Source: github.com/nousresearch/hermes-agent

---

## 1. Today's Overview

Hermes Agent shows **high activity with a concerning stability signal**: 50 issues were updated in the last 24h, **all of them still open** (0 closed), while 50 PRs saw updates with only 8 merged/closed against 42 still open. A new canary release (`v0.23.2+canary.20261117T064624Z`) shipped, but the issue tracker is accumulating unresolved session-state, gateway, and config-integrity bugs at a faster rate than they're being closed. The dominant themes today are **gateway/session authority failures** (admission conflicts, wedged FIFOs, profile-routing mismatches) and **security/config boundary gaps** (CLI bypassing approval layers, symlink writes into shared skills). Community engagement is moderate (top issue at 29 comments), and several long-running issues (#59293 since July, #63647 since July) remain without resolution, suggesting maintainer triage bandwidth is a bottleneck.

---

## 2. Releases

### v0.23.2+canary.20261117T064624Z (released 2026-11-17)

- **Type:** Canary pre-release of the v0.23.2 line.
- **Contents:** Build metadata and downloadable artifacts (Hermes Desktop for macOS Apple Silicon DMG confirmed in the release body; other platforms truncated in the source data).
- **Breaking changes:** None explicitly documented in the provided release notes.
- **Migration notes:** None stated. As a canary, this is a pre-stable channel build and should be treated as such.
- **Caveat:** The release body provided is largely a download table; no changelog of fixes/features is included in the source data, so downstream behavioral changes cannot be enumerated from this digest. Notably, multiple issues filed **against v0.23.2 specifically** today (e.g., #157091 — encrypted reasoning replay → HTTP 400 on custom chat completions routes) suggest the canary carries at least one regression.

---

## 3. Project Progress

**Merged/Closed PRs today (8 total; 2 identifiable from the data):**

- **#157206 [CLOSED]** — `plugin-catalog/memtomem.yaml` reworded to remove a literal `/tmp` reference that was blocking all pushes via the repo's pre-push guard. Author: teknium1. Quick self-inflicted-breakage fix.
- **#108765 [CLOSED]** — `fix(models): a malformed context-length cache no longer breaks agent init`. A single corrupt cache entry previously caused *every* agent to fail initialization with a misleading traceback (`agent/model_metadata.py:1085`). Author: trnorga. This is a meaningful robustness win — it removes a whole-instance failure mode.

**Features advancing (open PRs with visible progress):**

- **Desktop profile-routing stack (#153065–#153070)** — A 6-PR stacked series from ghgoodreau touching profile-route failure propagation, staged profile-switch status, streaming hot-path performance, deferred markdown preprocessing, and long-frame metrics. This is the largest coordinated feature effort in flight.
- **Configurable tool-result caps (#80508, #157207)** — Long-running PR #80508 (since August) adds a `tool_budget:` config block; today's #157207 ports a per-MCP-server result-size limit on top of it.
- **Model support (#157141)** — Adds GPT-6.2 "Astra" and "Sol" to OpenAI/Codex pickers with pricing and reasoning ladders.
- **Security hardening (#157208)** — TUI thinking text can no longer conceal a hyperlink that opens a different site than displayed.

---

## 4. Community Hot Topics

| Rank | Item | Comments | Link |
|---|---|---|---|
| 1 | **#59293** — `hermes config set` bypasses system-config write protection; CLI can disable the approval layer un-gated | 29 | [Issue #59293](https://github.com/NousResearch/hermes-agent/issues/59293) |
| 2 | **#137287** — Desktop transcript duplicates/scatters/drops messages mid-session | 13 | [Issue #137287](https://github.com/NousResearch/hermes-agent/issues/137287) |
| 3 | **#146538** — Gateway does 34k–99k filesystem metadata ops/s with many profiles (Windows kernel pool growth) | 11 | [Issue #146538](https://github.com/NousResearch/hermes-agent/issues/146538) |
| 4 | **#148540** — `restore_policy` rejects `model=None`/`''` persisted by Hermes's own writers → permanent `storage_unavailable` | 6 | [Issue #148540](https://github.com/NousResearch/hermes-agent/issues/148540) |
| 5 | **#132248** — [RFC] Trusted Agent Contacts: cross-owner A2A conversations as a plugin | 6 | [Issue #132248](https://github.com/NousResearch/hermes-agent/issues/132248) |

**Underlying needs analysis:**

- **#59293 (29 comments, open since 2026-07-06)** is the clearest trust/safety concern: the approval layer added in v0.18.0 protects `config.yaml` from shell writes but is bypassable through Hermes's *own* CLI. This is a four-month-old security-boundary hole with heavy discussion — a strong signal that the community wants **uniform enforcement of safety controls regardless of entry point**.
- **#137287** reflects core UX erosion: transcript corruption in Desktop undermines the fundamental contract of a chat app. 13 comments and still `needs-repro` after five weeks suggests difficulty in isolating a race condition.
- **#146538** is a resource-consumption concern at scale (66 profiles → ~1 CPU core idle, Windows kernel pool growth), pointing to architectural inefficiency in profile/skill enumeration rather than a simple bug.
- **#132248 (RFC)** shows appetite for a **human-facing layer over existing A2A transport** — the plumbing exists, but the product workflow for cross-owner agent conversations does not.

---

## 5. Bugs & Stability

Ranked by severity/impact (P2 = high per repo labels unless noted):

| Severity | Issue | Summary | Fix PR? |
|---|---|---|---|
| **Critical (security)** | [#59293](https://github.com/NousResearch/hermes-agent/issues/59293) | CLI `config set` bypasses system-config write protection; agent with terminal access can un-gate the approval layer | No PR identified |
| **Critical (security)** | [#156884](https://github.com/NousResearch/hermes-agent/issues/156884) | Curator auto-absorption writes through symlinks into shared canonical skill files; docs contradict default behavior | No |
| **Critical (security)** | [#100942](https://github.com/NousResearch/hermes-agent/issues/100942) | Blocking `pre_tool_call` hooks silently **fail open** under non-TTY gateway (systemd) — gated tool calls proceed unguarded | No |
| **High (new today)** | [#157169](https://github.com/NousResearch/hermes-agent/issues/157169) | Session FIFO **permanently wedged** after gateway restart; stale `'unknown'` admission makes `_claim_next` raise `unknown_execution` forever | No |
| **High (regression)** | [#157091](https://github.com/NousResearch/hermes-agent/issues/157091) | v0.23.2 replays encrypted reasoning truncated in `reasoning_content` on custom chat-completions routes → every tool turn fails HTTP 400 | No |
| **High** | [#148540](https://github.com/NousResearch/hermes-agent/issues/148540) | `restore_policy` rejects `model=None`/`''` that Hermes's own writers persist → permanent `storage_unavailable` on next start | No |
| **High** | [#150690](https://github.com/NousResearch/hermes-agent/issues/150690) | Regression since v0.22.6: gateway Group Chat disappears from sidebar in all profile views except the creator's | No |
| **High** | [#137287](https://github.com/NousResearch/hermes-agent/issues/137287) | Desktop transcript duplicates/misorders/drops messages mid-session | No |
| **High** | [#63647](https://github.com/NousResearch/hermes-agent/issues/63647) | WhatsApp Baileys bridge emits 1,000+ blank messages during E2EE retry/session churn | No |
| **High (new today)** | [#157167](https://github.com/NousResearch/hermes-agent/issues/157167) | Cron jobs lose tools of a stdio MCP server stopped by `idle_timeout_seconds` | No |
| **High (new today)** | [#157142](https://github.com/NousResearch/hermes-agent/issues/157142) | Desktop branch row with `origin_json` but no `chat_id` is unresumable (`validate_legacy_row` → `not_found`) | No |
| **High (new today)** | [#156978](https://github.com/NousResearch/hermes-agent/issues/156978) | Full gateway routing rewrite holds `state.db` writer mutex 20–35s under GIL contention; local routes of ended sessions never pruned | No |
| **Medium** | [#155773](https://github.com/NousResearch/hermes-agent/issues/155773) | ACP `session/new` fails at 30s while gateway still binds editor MCP servers | No |
| **Medium** | [#154994](https://github.com/NousResearch/hermes-agent/issues/154994) | Gateway reroutes Bot Chat to an async subagent's session, then every request fails `admission_conflict` | No |
| **Medium** | [#150056](https://github.com/NousResearch/hermes-agent/issues/150056) | `message_agent` deliveries refused with `admission_conflict` for hours after backend compression (cause unidentified) | No |
| **Medium** | [#121938](https://github.com/NousResearch/hermes-agent/issues/121938) | Discord `adapter_media.py` fails **all** file/audio sends (`'NoneType' has no attribute 'File'` — missing module-level import) | No |
| **Medium (new today)** | [#156888](https://github.com/NousResearch/hermes-agent/issues/156888) | Windows Desktop: recurrent 2–4s Electron main-process stalls, zero-CPU blocking, unattributed | No |

**Pattern:** A cluster of **session/admission-state bugs** (#148540, #150056, #154994, #157169) share a root theme — persisted state that Hermes's own writers produce but its readers reject, or stale admission records that never self-heal after restart. Several of these are explicitly described as *permanent* wedges, which is the worst failure class for a long-running agent gateway. **No fix PRs are visible for any of the top-severity items**, which is the single biggest health concern in today's data.

---

## 6. Feature Requests & Roadmap Signals

**User-requested features active today:**

1. **[#132248] Trusted Agent Contacts (RFC)** — Cross-owner A2A conversations as a standalone plugin. Builds on existing discovery/auth/transport. Strong candidate for a future release if the plugin architecture is the intended delivery vehicle.
2. **[#80508 / #157207] Configurable tool-result caps** — `tool_budget:` block plus per-MCP-server limits. PR #80508 has been open since **August**; today's #157207 layers on top. Likely to land once the stacked PRs reconcile.
3. **[#11116] Registry-driven tool execution metadata + per-tool latency reporting** — Open since April; low engagement (1 comment, 1 👍) but addresses real perf-engineering needs.
4. **[#157141] GPT-6.2 Astra/Sol support** — Model-picker expansion, PR open today.
5. **[#155918] reminders-kanban plugin** — Apple Reminders as a Kanban board in Desktop.
6. **[#156829] oh-my-pi-terminal-backend** — Route Hermes terminal/file/code tools through an oh-my-pi RPC shell.

**Prediction:** The **desktop profile-routing stack (#153065–#153070)** is the most likely near-term feature set to merge given its coordinated structure. The **tool-budget configurability** work is the most likely *config-surface* feature to ship next, contingent on clearing the long-open #80508.

---

## 7. User Feedback Summary

**Pain points (dissatisfaction):**

- **Session state is fragile.** Users report sessions that are *permanently* unusable after restarts (#157169), after compression (#150056), after delegation (#154994), and after profile switches (#150690). The recurring `admission_conflict` / `storage_unavailable` / `unknown_execution` errors erode confidence in the gateway as a durable substrate.
- **Desktop UX regressions.** Transcript corruption (#137287), disappearing Group Chats (#150690), unresumable branches (#157142), and 2–4s Windows stalls (#156888) collectively describe a Desktop client that is *visibly* unstable during normal use.
- **Security controls are inconsistent.** The community is clearly frustrated that protections exist on one path (shell writes) but not another (`hermes config set`) — #59293's 29 comments over four months is the strongest sustained signal in the tracker.
- **Resource consumption at scale.** #146538's 34k–99k metadata ops/s and Windows kernel-pool growth affect multi-profile power users.

**Positive signals:**

- Quick turnaround on self-inflicted CI breakage (#157206 opened and closed same day).
- Robustness fix #108765 removes a whole-instance init failure mode.
- Active community contributions: plugin catalog additions (#155918, #156829), model support (#157141), and a 6-PR desktop perf stack from an external contributor (ghgoodreau).

**Satisfaction/dissatisfaction balance:** Feature velocity is healthy, but the **open-issue-to-closed ratio today (50:0)** and the absence of fix PRs for top-severity bugs is a visible dissatisfaction driver.

---

## 8. Backlog Watch

Items needing maintainer attention due to age + severity + lack of resolution:

| Age | Item | Why it needs attention |
|---|---|---|
| **~4.5 months** | [#59293](https://github.com/NousResearch/hermes-agent/issues/59293) — CLI bypasses approval layer (security) | 29 comments, tagged `needs-decision` + `sweeper:risk-compatibility`. Highest-engagement issue in the tracker; a decision is overdue. |
| **~4 months** | [#63647](https://github.com/NousResearch/hermes-agent/issues/63647) — WhatsApp 1,000+ blank messages | Tagged `needs-repro`; message-delivery risk. No movement. |
| **~2.5 months** | [#100942](https://github.com/NousResearch/hermes-agent/issues/100942) — `pre_tool_call` hooks fail open under systemd | Security control that silently does nothing in the most common production deployment. Tagged `needs-decision`. |
| **~3.5 months** | [#80508](https://github.com/NousResearch/hermes-agent/pull/80508) — `tool_budget:` configurable caps | Longest-open feature PR with visible momentum (today's #157207 builds on it). Tagged `sweeper:risk-compatibility`. |
| **~2 months** | [#111334](https://github.com/NousResearch/hermes-agent/issues/111334) — skills/plugin scanner remaining false positives | Follow-up to a salvage wave; residual false-positive classes remain. |
| **~7 months** | [#11116](https://github.com/NousResearch/hermes-agent/issues/11116) — tool execution metadata + latency reporting | Low engagement but foundational for perf work; no maintainer response visible. |

**Recommendation signal:** The **security cluster (#59293, #100942, #156884)** and the **permanent-session-wedge cluster (#157169, #148540, #150056)** are the two groups where maintainer decisions would produce the highest trust dividend. Both have zero visible fix PRs as of today.

---

*Digest generated from GitHub activity data for 2026-11-18. All counts and statuses reflect the provided snapshot; comment counts on PRs were unavailable in the source data (shown as `undefined`) and are omitted from rankings.*

</details>

<details>
<summary><strong>IronClaw</strong> — <a href="https://github.com/nearai/ironclaw">nearai/ironclaw</a></summary>

# IronClaw Project Digest — 2026-11-18

## 1. Today's Overview

IronClaw shows **maintenance-only activity** for the 24-hour window ending 2026-11-18: zero issues updated, zero PRs merged or closed, and no new releases. All 10 updated PRs are Dependabot dependency bumps, nine of which are `[OPEN]` and unmerged — three of them (rustls ×2, wasmtime) have been sitting since late October and were merely "refreshed" (rebased/touched) on 2026-11-17. The complete absence of human-authored issues or PRs, combined with a full Dependabot queue and no merges, suggests the project is in a **low-activity or maintainer-review-lag phase**. Health indicators are neutral-to-concerning: no regressions or crashes reported, but also no forward feature progress and a growing dependency backlog.

## 2. Releases

None. No new releases in the reporting window. No breaking-change or migration notes to report.

## 3. Project Progress

**No merged or closed PRs today.** No features advanced, no fixes landed. The only movement is metadata updates on 10 open Dependabot PRs (last updated 2026-11-17), none of which have been merged:

| PR | Ecosystem | Change |
|---|---|---|
| [#8167](https://github.com/nearai/ironclaw/pull/8167) | JS | zod 4.6.7 + @remotion/cli, @remotion/tailwind-v4 |
| [#8166](https://github.com/nearai/ironclaw/pull/8166) | Rust | rustls 0.23.43 → 0.23.46 (`/harness/latency/runner`) |
| [#8165](https://github.com/nearai/ironclaw/pull/8165) | Rust | rustls 0.23.43 → 0.23.46 |
| [#8162](https://github.com/nearai/ironclaw/pull/8162) | Rust | wasmtime 47.0.3 → 48.0.7 (`/harness/latency/runner`) |
| [#8159](https://github.com/nearai/ironclaw/pull/8159) | GitHub Actions | 11-action group bump (incl. claude-code-action 1.0.183 → 1.0.259) |
| [#8158](https://github.com/nearai/ironclaw/pull/8158) | JS dev | storybook 10.5.7 → 10.6.2 |
| [#8156](https://github.com/nearai/ironclaw/pull/8156) | JS dev | @storybook/addon-vitest 10.5.7 → 10.6.2 |
| [#8155](https://github.com/nearai/ironclaw/pull/8155) | JS | dompurify 3.4.12 → 3.4.17 |
| [#8157](https://github.com/nearai/ironclaw/pull/8157) | Python (uv) | certifi 2026.7.22 → 2026.10.19 (`/tests/e2e`) |
| [#8154](https://github.com/nearai/ironclaw/pull/8154) | JS dev | vite 8.1.3 → 8.1.6 |

## 4. Community Hot Topics

**No hot topics exist.** All 10 PRs have 0 comments and 0 👍 reactions; there are no issues to discuss. This is a signal of its own: with a fully automated queue and zero human discussion, there is no visible community debate, design feedback, or roadmap conversation happening on GitHub right now. The "most active" items are simply the oldest unmerged bumps ([#8154](https://github.com/nearai/ironclaw/pull/8154), opened 2026-10-22, and [#8155](https://github.com/nearai/ironclaw/pull/8155)–[#8158](https://github.com/nearai/ironclaw/pull/8158), opened 2026-10-23).

## 5. Bugs & Stability

**No new bugs, crashes, or regressions reported today** (0 issues opened or updated). Notably, two open dependency PRs touch security/robustness-relevant libraries and could be considered *preventive* stability work if merged:

- **DOMPurify bump** ([#8155](https://github.com/nearai/ironclaw/pull/8155)) — DOMPurify is an XSS-sanitization library for the WebUI frontend; the 3.4.12 → 3.4.17 range includes fixes (release notes mention "Fixed an issue with…"). Keeping this current is directly relevant to WebUI security. Severity if unmerged long-term: moderate.
- **rustls bumps** ([#8165](https://github.com/nearai/ironclaw/pull/8165), [#8166](https://github.com/nearai/ironclaw/pull/8166)) — TLS stack; one commit is "Delay saving KX hint until handshake confirmation," a correctness fix in the handshake path. Severity: low-moderate (TLS brittleness), no fix PR beyond the bump itself.
- **wasmtime 47 → 48** ([#8162](https://github.com/nearai/ironclaw/pull/8162)) — major-version WASM runtime bump (likely sandboxing/tool-execution path in a latency harness); a major bump carries some integration-regression risk and deserves CI scrutiny.

No issue-tracked bug has a fix PR pending.

## 6. Feature Requests & Roadmap Signals

None visible. With 0 issues and no human-authored PRs, there are no user-requested features or roadmap signals in this window. The only forward-looking inference available from the data is architectural, not feature-level: the presence of `rustls`/`wasmtime` bumps under `/harness/latency/runner` confirms IronClaw maintains a **Rust-based performance/latency harness**, a **Rust product crate set** (`crates/product/ironclaw_webui`), and **Python e2e tests** (`/tests/e2e`). No version is implied for the next release.

## 7. User Feedback Summary

No user feedback is present in this window — no issues, no PR comments, no reactions. There are no expressed pain points, use cases, or satisfaction/dissatisfaction signals to summarize. The absence of any inbound user activity is itself a data point worth tracking over subsequent days (is it a quiet period, or a drop in engagement?).

## 8. Backlog Watch

Although no issues are unanswered, the **unmerged Dependabot queue is the backlog to watch**, especially the oldest and highest-impact items:

- 🔴 [#8154](https://github.com/nearai/ironclaw/pull/8154) — vite bump, open since **2026-10-22** (27 days)
- 🔴 [#8155](https://github.com/nearai/ironclaw/pull/8155) — dompurify (security-relevant), open since **2026-10-23**
- 🔴 [#8156](https://github.com/nearai/ironclaw/pull/8156), [#8157](https://github.com/nearai/ironclaw/pull/8157), [#8158](https://github.com/nearai/ironclaw/pull/8158) — open since **2026-10-23**
- 🟠 [#8159](https://github.com/nearai/ironclaw/pull/8159) — 11-update Actions group, open since **2026-10-25**
- 🟠 [#8162](https://github.com/nearai/ironclaw/pull/8162) — wasmtime major bump, open since **2026-10-29**
- 🟡 [#8165](https://github.com/nearai/ironclaw/pull/8165), [#8166](https://github.com/nearai/ironclaw/pull/8166) — rustls, open since **2026-11-02**
- 🟡 [#8167](https://github.com/nearai/ironclaw/pull/8167) — zod/remotion, open since **2026-11-03**

**Recommendation for maintainers:** prioritize [#8155](https://github.com/nearai/ironclaw/pull/8155) (frontend XSS-surface dependency) and batch-merge the coordinated Storybook/Vite JS dev-dependency group ([#8154](https://github.com/nearai/ironclaw/pull/8154), [#8156](https://github.com/nearai/ironclaw/pull/8156), [#8158](https://github.com/nearai/ironclaw/pull/8158)) to clear the queue, then review the wasmtime 48 major bump separately with full CI. A backlog of 10 unmerged automated PRs with zero maintainer comment activity is the clearest health risk visible in today's data.

</details>

<details>
<summary><strong>QwenPaw</strong> — <a href="https://github.com/agentscope-ai/QwenPaw">agentscope-ai/QwenPaw</a></summary>

# QwenPaw Project Digest — 2026-11-18

## 1. Today's Overview

QwenPaw shows **very high activity** in the last 24 hours: 23 issues updated (11 open, 12 closed) and 50 PRs touched (29 open, 21 merged/closed), with no new releases. The project is in a **post-2.3.0 stabilization phase**, with a heavy cluster of bug reports around the new WeChat/DingTalk channel plugins, the Creator plugin, and console UI regressions. Notably, the `DoomLoopGate` bug (#8700) received a fix PR (#8701) the same day it was discussed, indicating responsive maintainer triage. At the same time, long-running feature work continues on plugin architecture (#8554, #8469, #8499) and mobile (#7378, #8796), suggesting the roadmap is pivoting toward a **plugin-extensible, multi-platform assistant**. Overall project health is good but strained: volume of duplicate channel bugs (WeChat `ACCOUNT_IN_USE` reported twice: #8709, #8693) suggests release QA gaps for channel integrations.

## 2. Releases

No new releases in the last 24 hours. Latest referenced stable is **v2.3.0.post1**; users on 2.2.x and 2.3.0 are reporting channel and console issues that appear addressed on `main`.

## 3. Project Progress

Merged/closed PRs today (21 total) include several long-lived fixes finally landing:

- **#2367 [CLOSED]** `fix(console): harden session deletion flow` — adds timestamped `chats.json.backup-*` snapshots before destructive deletes and aligns batch delete payloads. Directly relevant to the session-loss complaints in #7724. [Link](https://github.com/agentscope-ai/QwenPaw/pull/2367)
- **#2355 [CLOSED]** `fix(console): add space between bot prefix and message text` — fixes Telegram output `Georgehello how are you` → `George hello how are you`. [Link](https://github.com/agentscope-ai/QwenPaw/pull/2355)
- **#2142 [CLOSED]** `fix: add BiDi text support for RTL languages` — CSS `direction: auto` / `unicode-bidi: plaintext` for chat input and message areas. [Link](https://github.com/agentscope-ai/QwenPaw/pull/2142)
- **#8151 [CLOSED]** `fix(local_models): parse llama.cpp build numbers without false updates` — fixes false "update available" prompts. [Link](https://github.com/agentscope-ai/QwenPaw/pull/8151)
- **#8166 [CLOSED]** `docs(heartbeat): document runtime semantics` — adds runtime behavior docs for heartbeat (silence, concurrency, reloads). [Link](https://github.com/agentscope-ai/QwenPaw/pull/8166)
- **#8795 [CLOSED]** `fix(channels): lower minimum QwenPaw version to 2.3.0.post1` — unblocks channel plugin installation on the latest patch release. [Link](https://github.com/agentscope-ai/QwenPaw/pull/8795)
- **#7378 [CLOSED]** `[DO NOT MERGE] feat(mobile): QwenPaw native mobile experience` — Expo/React Native client closed without merge; mobile direction now appears to route through #8793 (Platform Web App). [Link](https://github.com/agentscope-ai/QwenPaw/pull/7378)

Open PRs advancing major features: **#8554** (plugin CLI + extension points, size/XXXL), **#8469** (extract MCP into a plugin), **#8499** (extract local model management into a plugin), **#8793** (Platform Web App access), and **#7719** (separate model for ReMeLight memory writing).

## 4. Community Hot Topics

- **#8071 [OPEN] Plugin-facing theme extension point** — 18 comments, the most-discussed issue. Plugin authors are limited to a single `colorPrimary` knob while the console theme system supports 6 palettes plus accent/hover/background/surface/radius. Underlying need: a **stable, semantic plugin theming contract** so third-party plugins can match console UX without forking CSS. [Link](https://github.com/agentscope-ai/QwenPaw/issues/8071)
- **#7724 [CLOSED] 会话丢失 (Session loss)** — 6 comments. A Windows 2.2.1 desktop user lost an entire conversation (and their model config) after a plugin redeploy/shutdown mid-task. The session never reappeared in the console. High user-trust impact; the closed #2367 session-deletion hardening is likely related. [Link](https://github.com/agentscope-ai/QwenPaw/issues/7724)
- **#8595 [CLOSED] Plugin install fails with 'No package metadata was found' for qwenpaw-creator** — 5 comments. Both UI and CLI hot-install paths failed for official plugin v2.0.4. Fixed in the 2.3.0.post1 timeframe. [Link](https://github.com/agentscope-ai/QwenPaw/issues/8595)
- **#7745 [CLOSED] Agent switch deletes last session & makes history unclickable** — 4 comments. Two concrete console bookkeeping defects on every agent switch; user notes landing on a blank chat is intentional per #7687 but the data loss is not. [Link](https://github.com/agentscope-ai/QwenPaw/issues/7745)
- **#8521 [CLOSED] Missing replies + Ctrl+C requires multiple presses** — 4 comments. Two distinct complaints: intermittent empty answers, and clipboard copy failing on first press in Chrome and Edge; user also requests a **legacy UI toggle**. [Link](https://github.com/agentscope-ai/QwenPaw/issues/8521)
- **#8774 [OPEN] Mid-turn steer (send-now) for running chats** — contributor with a working local implementation seeking design feedback. Signals strong demand for **interruptible, steerable agents** across all channels. [Link](https://github.com/agentscope-ai/QwenPaw/issues/8774)

## 5. Bugs & Stability

Ranked by severity (most severe first):

1. **#7724 [CLOSED] Session + model config loss** (desktop, Win10, 2.2.1) — data loss of an entire conversation after plugin redeploy/shutdown. Mitigation appears to be the session-deletion hardening in #2367. [Link](https://github.com/agentscope-ai/QwenPaw/issues/7724)
2. **#8709 / #8693 [CLOSED] WeChat channel `ACCOUNT_IN_USE` + `PLATFORM_RESULT_UNKNOWN`** (2.3.0) — channel startup path and workspace projection both reserve the same runtime key; successful sends misreported. Two independent reports of the same root cause → **release QA gap**. [Link](https://github.com/agentscope-ai/QwenPaw/issues/8709) · [Link](https://github.com/agentscope-ai/QwenPaw/issues/8693)
3. **#8700 [OPEN] DoomLoopGate never triggers** (2.3.0, Docker + `main`) — agentscope 2.0.10 appends iterations to one assistant message, so the per-iteration cursor records only the first snapshot; runaway loops go undetected. **Fix PR exists: #8701** (first-time contributor). [Issue](https://github.com/agentscope-ai/QwenPaw/issues/8700) · [PR](https://github.com/agentscope-ai/QwenPaw/pull/8701)
4. **#8771 [OPEN] DingTalk 1:1 session collision** — `short_session_id_from_conversation_id()` takes the last 8 chars, which are org/robot-constant for 1:1 chats, so **all 1:1 chats in one org map to the same session**. Cross-user data mixing risk. [Link](https://github.com/agentscope-ai/QwenPaw/issues/8771)
5. **#8778 / #8779 [OPEN] Creator: expired DashScope signed URL reused; FAILED asset_ingest is terminal** — reference-image generation breaks ~24h after artifact creation, and failed ingests 404 forever with no retry path (store already sanctions FAILED→QUEUED). Both reported by same power user on 2.0.6. [Link](https://github.com/agentscope-ai/QwenPaw/issues/8778) · [Link](https://github.com/agentscope-ai/QwenPaw/issues/8779)
6. **#8776 [OPEN] `classify_model_error` misclassifies 400+quota as `bad_request`** — blocks `FallbackChatModel` from switching when the primary model's quota is exhausted (e.g., dots provider). [Link](https://github.com/agentscope-ai/QwenPaw/issues/8776)
7. **#8789 [OPEN] Invalid batch task values dispatch sibling subagents before failing** — `_spawn_batch()` validates with `.strip()` but dispatches the raw value; null/numbers/lists/objects pass preflight, and valid siblings launch before the batch fails. [Link](https://github.com/agentscope-ai/QwenPaw/issues/8789)
8. **#8796 [OPEN] Mobile full-screen containers render under the system status bar** — top `safe-area-inset` missing since `c54a4465` introduced `viewport-fit=cover`; #4738 fixed only the bottom. [Link](https://github.com/agentscope-ai/QwenPaw/issues/8796)
9. **#8521 [CLOSED] Intermittent empty replies + Ctrl+C multi-press** (2.2.2.post1) — user can't tell if model or app; clipboard issue reproduced in Chrome and Edge. [Link](https://github.com/agentscope-ai/QwenPaw/issues/8521)
10. **#8798 [CLOSED] `MODEL_QUOTA_EXCEEDED` on `kilo-auto/free`** — free-tier model quota exhaustion surfaced as a crash-style error dump; related to the fallback gap in #8776. [Link](https://github.com/agentscope-ai/QwenPaw/issues/8798)

## 6. Feature Requests & Roadmap Signals

- **Plugin extension surface is the dominant theme**: semantic theme tokens (#8071), plugin CLI commands (#8554), MCP-as-plugin (#8469), local-model-as-plugin (#8499). Expect **plugin architecture consolidation** in 2.3.x/2.4.
- **Mid-turn steer / send-now (#8774)** — contributor has a working implementation and wants design feedback; a natural candidate for a 2.4 milestone given multi-channel interest (console, Feishu, WeCom, QQ, DingTalk).
- **`save_draft` tool for qwenpawmail-mcp (#8780)** — agent workflows need write-without-send semantics; low-risk, likely to land soon.
- **Legacy UI toggle (#8521)** — repeated user request for a switch between old/new console layouts, plus smoother model switching.
- **Platform Web App access (#8793)** — phone QR sign-in to a connected local runtime; supersedes the closed native mobile PR (#7378) and is the clearest next-version signal.
- **Separate memory-writing model (#7719)** — cost optimization for `ReMeLight` (`auto_memory`/`auto_dream`/`daily_paper`/`auto_fin`).

## 7. User Feedback Summary

**Pain points:**
- **Trust in data persistence is eroding** — multiple users report losing sessions and model config (#7724, #7745). The closed #2367 backup-before-delete work directly addresses this.
- **Channel reliability on 2.3.0** — WeChat (`ACCOUNT_IN_USE`) and DingTalk (session collision) are the loudest new complaints; enterprise users are hitting org-wide session merging.
- **Console UX regression** — #8521 explicitly says the new UI is "less efficient, less smooth" and asks for a legacy toggle; large idle areas make model switching cumbersome.
- **Intermittent empty replies** — undermines confidence, with users unsure whether to blame the model or the app.
- **Free-tier quota handling** — #8798's frustrated tone ("i keep getting a damn...") reflects poor error ergonomics for quota exhaustion; #8776 shows the fallback logic won't save them.

**Positive signals:**
- Contributors are shipping fixes fast (#8701 same-day for #8700; #8728 declared thinking-off control).
- Plugin ecosystem is genuinely active — #8071's 18 comments show engaged third-party plugin authors.
- Users file detailed, well-structured bug reports (e.g., #8716, #8778, #8779 with environment tables and root-cause hypotheses), indicating a sophisticated user base worth investing in.

## 8. Backlog Watch

Items needing maintainer attention (oldest/highest-impact first):

- **#6952 [OPEN] perf: prefix cache instability from unsorted tool schemas** — open since **2026-08-12** (3+ months), only 2 comments. Non-deterministic prompt construction causes unnecessary KV-cache misses on every turn — a direct cost/latency issue for all users. No linked PR. [Link](https://github.com/agentscope-ai/QwenPaw/issues/6952)
- **#7767 [CLOSED] Guardrail-plugin bug bundle** — stale console attachment blob, one-shot cron misfire drop, console tail-drop, `on_acting` never fires. Closed but with only 3 comments; unclear whether all four sub-bugs were individually fixed. [Link](https://github.com/agentscope-ai/QwenPaw/issues/7767)
- **#7719 [OPEN] Separate model for ReMeLight memory writing** — open since 2026-09-12, size/XL, no merge yet. Blocks cost-sensitive deployments. [Link](https://github.com/agentscope-ai/QwenPaw/pull/7719)
- **#8469 [OPEN] refactor(mcp): extract mcp into plugin** and **#8499 [OPEN] extract local model management into plugin** — both size/XXXL, open since late October; large refactors that gate the plugin roadmap. [Link](https://github.com/agentscope-ai/QwenPaw/pull/8469) · [Link](https://github.com/agentscope-ai/QwenPaw/pull/8499)
- **#8268 [OPEN] fix(task_tracker): bound run completion callback and always clean up** — fixes the run-cleanup half of #8173; hung callbacks leave runs `running` forever. Open since 2026-10-16. [Link](https://github.com/agentscope-ai/QwenPaw/pull/8268)
- **#8133 [OPEN] fix(console): repair CJK emphasis boundaries in chat Markdown** — size/XL, open since 2026-10-08; raw `**` markers visible in Chinese text, an ongoing quality issue for the CJK user base. [Link](https://github.com/agentscope-ai/QwenPaw/pull/8133)
- **#8771 [OPEN] DingTalk session collision** — security-adjacent (cross-user session mixing) and has no linked fix PR; should be prioritized above cosmetic issues. [Link](https://github.com/agentscope-ai/QwenPaw/issues/8771)

---
*Data source: github.com/agentscope-ai/QwenPaw — digest generated for 2026-11-18. Comment counts reflect data provided; PR comment fields were `undefined` in the source and are omitted.*

</details>

<details>
<summary><strong>ZeroClaw</strong> — <a href="https://github.com/zeroclaw-labs/zeroclaw">zeroclaw-labs/zeroclaw</a></summary>

# ZeroClaw Project Digest — 2026-11-18

## 1. Today's Overview

ZeroClaw remains in a high-activity, pre-release stabilization phase: 21 issues were touched in the last 24h (all still open/active) and 50 PRs were updated, with 9 merged/closed and 41 still open. No new releases were published, but the volume of `release:v0.9.1`-tagged work (Lucid backend retirement, dependency security fixes, Windows test triage) indicates the v0.9.1 milestone is actively being assembled. The day's activity skews heavily toward bug triage and security hardening — multiple S0/S1 issues were touched, including an emergency-stop enforcement gap and a supervised-SOP approval bypass — suggesting the project is prioritizing correctness and safety over new features right now. Overall health is strong on throughput but strained on stability: several long-lived, high-risk issues remain open with no fix PRs yet.

## 2. Releases

None. No new releases were published in the last 24h. (Note: several PRs and issues are tagged `release:v0.9.1`, indicating v0.9.1 is in preparation but not yet cut.)

## 3. Project Progress

**Merged/closed PRs today (9 total; notable items):**

- **[#9740](https://github.com/zeroclaw-labs/zeroclaw/pull/9740) [CLOSED]** — `feat(channels): add VoiceHost WebSocket bridge`. A large opt-in bridge allowing external FunASR/SenseVoice audio hosts to exchange transcripts, replies, interruption, and approval events with ZeroClaw. This is a significant voice-channel capability landing after months in the parking lot.
- **[#9229](https://github.com/zeroclaw-labs/zeroclaw/pull/9229) [CLOSED]** — `fix(runtime): make interactive Ctrl+C state-aware`. Reworks the REPL's signal handling into a single persistent Idle/Active/Stopping lifecycle, replacing per-turn listeners. A long-running (July) fix that improves interactive reliability.
- **[#11238](https://github.com/zeroclaw-labs/zeroclaw/pull/11238) [CLOSED]** — `fix(config): accept tagged declarative cron schedules`. Fixes #11237; config PATCH/PUT and `/config/cron` now correctly save tagged cron schedule objects.
- **[#11647](https://github.com/zeroclaw-labs/zeroclaw/pull/11647) [CLOSED]** — `fix(providers): decouple vision support from system merge`. Corrects a gating bug where image-part support was incorrectly tied to system-prompt merging.
- **[#11598](https://github.com/zeroclaw-labs/zeroclaw/pull/11598) [CLOSED]** — `feat(security): support glob matching in the command allowlist`. Lets operators allow directory trees (e.g., skill/plugin script folders) instead of enumerating every file.
- **[#11779](https://github.com/zeroclaw-labs/zeroclaw/pull/11779) / [#11780](https://github.com/zeroclaw-labs/zeroclaw/pull/11780) [CLOSED]** — SOP tooling fixes: `sop list` now surfaces malformed SOP.toml failures and exits non-zero; `max_concurrent_total` is documented and named in capacity refusals.

**In-flight notable PRs (open):** [#12521](https://github.com/zeroclaw-labs/zeroclaw/pull/12521) (retire Lucid memory backend), [#12449](https://github.com/zeroclaw-labs/zeroclaw/pull/12449) (generic OAuth 2.1 + PKCE for remote MCP servers), [#11744](https://github.com/zeroclaw-labs/zeroclaw/pull/11744) (stream reasoning in Telegram/Slack drafts), [#12516](https://github.com/zeroclaw-labs/zeroclaw/pull/12516) (dependency security fixes).

## 4. Community Hot Topics

- **[#8600](https://github.com/zeroclaw-labs/zeroclaw/issues/8600) — Per-chat model switching for multi-model providers** (5 comments, 1 👍, open since July). A moltis migrant requests easy switching between any model a provider supports. Underlying need: users want provider-level model catalogs (e.g., OpenRouter's full set) exposed per conversation without reconfiguring the agent. Tagged `status:parking-lot` and `risk:high` — a design-heavy request.

- **[#12401](https://github.com/zeroclaw-labs/zeroclaw/issues/12401) — Tool-context collapse breaks Claude Opus 5.5 chats** (5 comments, S1). Once an older tool-using turn leaves the `keep_tool_context_turns` window, every subsequent request fails with a thinking-signature 400. Underlying need: correct interaction between context-window pruning and Anthropic's signed-thinking contract.

- **[#9191](https://github.com/zeroclaw-labs/zeroclaw/issues/9191) — Cron agent jobs have no wall-clock timeout** (5 comments, P1, S1). In-flight locks are only cleared at process start; a hung agent job can block indefinitely. Underlying need: production-grade scheduler isolation and cancellation budgets.

- **[#9644](https://github.com/zeroclaw-labs/zeroclaw/issues/9644) — Retire the Lucid memory backend** (4 comments, updated today). Lucid wraps SQLite but shells out to an external `lucid` command on every store/recall. The corresponding PR [#12521](https://github.com/zeroclaw-labs/zeroclaw/pull/12521) is now open, making this a likely v0.9.1 deliverable.

- **[#9390](https://github.com/zeroclaw-labs/zeroclaw/issues/9390) / [#9802](https://github.com/zeroclaw-labs/zeroclaw/issues/9802) — Emergency stop is CLI-only; RFC for full enforcement** (4 and 3 comments, P1, `risk:high`). A security audit found the emergency-stop state file is never read by runtime paths. The RFC proposes interrupting in-flight tool work and enforcing network-kill/domain-block at the shared egress boundary. This is the most consequential safety gap in the tracker.

## 5. Bugs & Stability

Ranked by severity:

- **S0 — [#12514](https://github.com/zeroclaw-labs/zeroclaw/issues/12514): Supervised SOP skips approval when step 1's `decide` question is answered "no."** The engine skips step 1 before its approval gate, so a supervised SOP asks for no approval at all. Data-loss/security risk. *No fix PR referenced yet.*
- **S1 — [#12401](https://github.com/zeroclaw-labs/zeroclaw/issues/12401): Claude Opus 5.5 thinking-signature 400 after tool-context collapse.** Workflow-blocking regression since v0.9.0. A related fix exists for a different symptom: PR [#12509](https://github.com/zeroclaw-labs/zeroclaw/pull/12509) stops replaying unsigned thinking blocks (fixes [#12504](https://github.com/zeroclaw-labs/zeroclaw/issues/12504)), but the collapse-window interaction itself appears unfixed.
- **S1 — [#9191](https://github.com/zeroclaw-labs/zeroclaw/issues/9191): Cron agent jobs lack wall-clock timeout.** *No fix PR.*
- **S1 — [#12477](https://github.com/zeroclaw-labs/zeroclaw/issues/12477): `cost.enforcement.mode` is ignored.** An exceeded budget always stops the turn even in the default `"warn"` mode. *No fix PR.*
- **S1 — [#9390](https://github.com/zeroclaw-labs/zeroclaw/issues/9390): Emergency stop not enforced at runtime.** RFC #9802 tracks the fix; a first enforcement slice landed via PR #9440 (per issue text), but full coverage is pending.
- **S2 — [#12504](https://github.com/zeroclaw-labs/zeroclaw/issues/12504): Anthropic provider replays unsigned thinking blocks.** Fix PR [#12509](https://github.com/zeroclaw-labs/zeroclaw/pull/12509) is open.
- **S2 — [#12492](https://github.com/zeroclaw-labs/zeroclaw/issues/12492): Dashboard chats ignore runtime-profile thinking settings.** No native thinking config is ever sent from the web dashboard. *No fix PR.*
- **S2 — [#12476](https://github.com/zeroclaw-labs/zeroclaw/issues/12476): Gateway logs every connection at INFO, flooding runtime traces.** *No fix PR.*
- **S2 — [#12489](https://github.com/zeroclaw-labs/zeroclaw/issues/12489): Cron scheduler waits for the whole due batch,** so one long agent job delays all others. *No fix PR.*
- **S3 — [#12507](https://github.com/zeroclaw-labs/zeroclaw/issues/12507): Web chat shows `[CURRENT DATE & TIME: …]` prefix and synthetic timestamps after reload.** Fix PR [#12515](https://github.com/zeroclaw-labs/zeroclaw/pull/12515) is open.

Also of note: [#12505](https://github.com/zeroclaw-labs/zeroclaw/issues/12505) tracks replacement of unmaintained `chrono`/`chrono-tz` (RUSTSEC-2026-0543/0555), which currently fails the Security CI job on every build; PR [#12516](https://github.com/zeroclaw-labs/zeroclaw/pull/12516) updates `zip` for RUSTSEC-2026-0548 and accepts the chrono advisories as a stopgap.

## 6. Feature Requests & Roadmap Signals

- **Per-chat model switching ([#8600](https://github.com/zeroclaw-labs/zeroclaw/issues/8600))** — high user interest, but parked and high-risk; unlikely before v0.9.1.
- **Runtime-profile thinking levels for OpenAI ([#12054](https://github.com/zeroclaw-labs/zeroclaw/issues/12054))** and the dashboard counterpart ([#12492](https://github.com/zeroclaw-labs/zeroclaw/issues/12492)) — consistent thinking-level plumbing across providers and surfaces. A natural v0.9.1/v0.10 candidate given the adjacent Anthropic thinking fixes already in flight.
- **Scoped operator-managed service credentials ([#12422](https://github.com/zeroclaw-labs/zeroclaw/issues/12422))** — an RFC for authorizing agents against services without exposing the underlying credential to the model or chat. Security-model change; likely to mature over multiple releases.
- **Complete emergency-stop enforcement ([#9802](https://github.com/zeroclaw-labs/zeroclaw/issues/9802))** — an RFC with a partial implementation already merged; expect incremental slices in v0.9.1+.
- **Lucid memory backend retirement ([#9644](https://github.com/zeroclaw-labs/zeroclaw/issues/9644))** — PR [#12521](https://github.com/zeroclaw-labs/zeroclaw/pull/12521) is open and tagged `release:v0.9.1`; strong candidate for the next release (breaking: configs selecting Lucid migrate to SQLite).
- **Generic MCP OAuth 2.1 + PKCE ([#12449](https://github.com/zeroclaw-labs/zeroclaw/pull/12449))** — large XL PR enabling authenticated remote MCP servers; a notable capability expansion if it lands.

**Prediction:** v0.9.1 will most likely bundle the Lucid retirement, the `zip` security bump, the SOP/dashboard fixes already in PR, and possibly the Anthropic unsigned-thinking fix. Larger items (OAuth MCP, voice bridge follow-ups, thinking-level parity) look like v0.10 material.

## 7. User Feedback Summary

Real users are hitting **provider-integration friction** more than anything else: the Anthropic thinking-signature class of bugs (#12401, #12504) blocks Claude Opus 5.5 users after a few tool turns, and dashboard users report their configured thinking settings are silently ignored (#12492). A moltis migrant (#8600) explicitly praises ZeroClaw's capability parity but flags per-chat model switching as the one missing convenience — a satisfaction signal with a clear gap. Production operators are voicing **scheduler and cost-control reliability** concerns: cron jobs with no timeout (#9191), batch-serialized cron execution (#12489), and a cost-enforcement mode that doesn't actually warn (#12477). Security-minded users and auditors are driving the emergency-stop thread (#9390/#9802) and the supervised-SOP approval bypass (#12514) — the latter is the most alarming report of the day. Minor but recurring UX papercuts appear in the web dashboard (#12507). Overall sentiment: the feature set is valued, but users are asking for **predictable failure modes and honest configuration semantics** before adding more surface area.

## 8. Backlog Watch

Long-unanswered or under-attended items that deserve maintainer attention:

- **[#8600](https://github.com/zeroclaw-labs/zeroclaw/issues/8600)** (open since 2026-07-01, parking-lot) — per-chat model switching; four months old with only 5 comments and one 👍. Needs a design decision or explicit deferral.
- **[#9191](https://github.com/zeroclaw-labs/zeroclaw/issues/9191)** (open since 2026-07-20, P1/S1) — cron job timeout; nearly four months without a fix PR despite workflow-blocking severity.
- **[#9390](https://github.com/zeroclaw-labs/zeroclaw/issues/9390)** (open since 2026-07-26) and **[#9802](https://github.com/zeroclaw-labs/zeroclaw/issues/9802)** (open since 2026-08-07) — emergency-stop enforcement; partial progress via #9440 but the RFC remains open and high-risk.
- **[#9644](https://github.com/zeroclaw-labs/zeroclaw/issues/9644)** (open since 2026-08-01) — Lucid retirement; now has an open PR (#12521), so it is moving, but the issue itself has sat for 3.5 months.
- **[#7821](https://github.com/zeroclaw-labs/zeroclaw/pull/7821)** (open since 2026-06-17, XL, `risk:high`) — canonical `sandbox_policy` schema with application-layer enforcement; five months open and a foundational security change that likely needs reviewer bandwidth.
- **[#12449](https://github.com/zeroclaw-labs/zeroclaw/pull/12449)** (XL, MCP OAuth) — recently active but very large; at risk of review fatigue.

**Health note:** Throughput is healthy (9 PRs closed, active triage), but the concentration of S0/S1 issues without fix PRs (#12514, #9191, #12477, #12489) and the five-month-old security PR #7821 are the main risks to the v0.9.1 timeline. The Lucid retirement and dependency-security work are the clearest, best-scoped wins to close first.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*