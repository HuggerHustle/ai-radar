# AI Infrastructure Digest 2026-10-31

> Generated: 2026-10-31 00:41 UTC | Projects covered: 6

- [vLLM](https://github.com/vllm-project/vllm)
- [SGLang](https://github.com/sgl-project/sglang)
- [llama.cpp](https://github.com/ggml-org/llama.cpp)
- [Ollama](https://github.com/ollama/ollama)
- [LiteLLM](https://github.com/BerriAI/litellm)
- [Unsloth](https://github.com/unslothai/unsloth)

---

## Cross-Project Comparison

# AI Infrastructure Ecosystem — Cross-Project Comparison Report
**Date: 2026-10-31 | Coverage: vLLM · SGLang · llama.cpp · Ollama · LiteLLM · Unsloth**

---

## 1. Ecosystem Overview

Today's digest reveals an ecosystem in a **consolidation-and-hardening phase** rather than a pure feature race. The serving engines (vLLM, SGLang) are pushing on two fronts simultaneously: **cold-start/weight-reload efficiency** (vLLM's CUDA Checkpoint/Restore RFC, direct weight reload; SGLang's 3–5x DeepSeek-V4.1 warmup win) and **correctness debt** (security bypasses, tool-calling parser bugs, scheduler crashes). The gateway layer (LiteLLM) is undergoing its most significant architectural change in recent memory — a Rust routing core behind a Python fallback — while being pulled down by a persistent cluster of **cost-accounting inconsistencies** that directly affect billing. Meanwhile, local runtimes (llama.cpp, Ollama) are absorbing hardware breadth (OpenCL/Intel, MLX, RDNA3/4) and exposing integration fragility in OpenAI/Anthropic compatibility layers, and the fine-tuning layer (Unsloth) is shipping a genuine kernel-level precision fix alongside a critical install-isolation regression. The common thread: **the stack is maturing faster at the edges (new models, new hardware) than at the seams (accounting, auth, parser correctness, memory pre-flight).**

---

## 2. Activity Comparison

| Project | Issues (updated/active 24h) | PRs (active/in-flight) | Releases (24h) | Dominant Activity Theme |
|---|---|---|---|---|
| **vLLM** | High — incl. 1 closed security issue (#64391), 10 ranked regressions | Very high — 4+ direct-reload PRs, ROCm/CI wave | **None** | Cold-start, RL weight reload, ROCm parity |
| **SGLang** | High — 8 ranked regressions, 159-comment flaky-CI thread | Moderate–High (LMCache, AMD, router) | **None** | KV reuse cost-awareness, CI stability |
| **llama.cpp** | Medium–High — SYCL cluster, CUDA MTP crash, 4 stale-closed | High (OpenCL, MoE cache, batched copy) | **Yes — b12002–b12017 (16 builds)** | Hardware breadth + small perf wins |
| **Ollama** | Medium — 8 ranked incl. Cloud outage (#19111) | High (MLX, API compat, memory accounting) | **None** | MLX maturity + OpenAI/Anthropic compat |
| **LiteLLM** | Very High — 20 ranked, many stale-closed; 3 new correctness bugs | Very High (router migration stack + 8 fix PRs) | **Dev pre-release** (v1.109.0-dev.2) | Router Rust core + cost accounting |
| **Unsloth** | High — 43 updated, 8 ranked incl. critical install bug | Moderate–High (audio-VLM, LoRA kernel) | **Yes — v0.1.913-beta** | LoRA precision + audio-VLM support |

**Observations:**
- Only **llama.cpp** and **Unsloth** shipped user-facing releases in this window; the two most active serving engines (vLLM, SGLang) shipped none but maintained the highest PR/issue throughput.
- **LiteLLM** has by far the largest *closed-stale* backlog (≈15 issues closed in-window), reflecting both maintenance triage and unresolved latent defects (see §5).
- **SGLang's** 159-comment flaky-CI meta-issue (#42752) is the single strongest signal of test-infrastructure debt in the ecosystem.

---

## 3. Model Support Race

| Model / Architecture | vLLM | SGLang | llama.cpp | Ollama | Unsloth |
|---|---|---|---|---|---|
| **DeepSeek V4/V4.1** | ✅ MegaMoE locality placement (#64835) | ✅ 3–5x warmup win (#47397); ⚠️ scheduler crash (#47218) | ⚠️ GGUF issues on RTX 6000 Pro (#31385) | — | ✅ **V4.1-Flash-1017 GGUF** (v0.1.913) |
| **Qwen3.8-Flash-Next** | ✅ ROCm MI355X tracker (#59575) | ✅ ROCm tracker (#44304) | ✅ ~2% decode gain (#31443) | — | — |
| **Qwen4Exp QSA** | ✅ NVFP4 KV cache (#64199) | — | — | — | — |
| **Qwen3.5 GDN** | ⚠️ warmup crash (#50046) | — | ✅ MTP graph fix (#31415) | ⚠️ thinking-only bug (#18916) | — |
| **GLM-5.x (DSA)** | ⚠️ PP stale top-k (#63170) | ✅ SM107 routing (#47354) | ✅ MoE cache +7% (#31233) | — | — |
| **Gemma 3 / 4** | ⚠️ MTP crash (#48848) | — | ✅ tied-output fix (b12008) | — | ✅ flex attention path (#16041) |
| **Step-5-Preview** | ✅ ROCm/CDNA3+ (#61837, #64833) | — | — | — | — |
| **Kimi K2.5 / KDA drafts** | — | ✅ DFlash KDA (#47423) | — | — | — |
| **LFM3-Audio / LFM3-Omni** | — | — | ⚠️ quant guards relaxed | — | ✅ **audio chat (#16242/#16243)** |
| **Qwen-Image / HiDream-O1** | — | ✅ HiDream-O1-Image (#39682) | — | — | ✅ Qwen-Image VRAM win |
| **TML Inkling / T-Head PPU** | — | ✅ T-Head SAIL (#37519) | ✅ TML Inkling (#25731) | — | — |

**Who's ahead:**
- **vLLM** leads on **frontier-model × frontier-hardware pairing** (Step-5-Preview, Qwen4Exp NVFP4, DeepSeek V4 MegaMoE) — it is the reference implementation for day-0/vendor-partnered launches.
- **SGLang** leads on **speculative-decoding variety** (DFlash KDA, mixed-prefill controls) and **novel architectures** (HiDream-O1 pixel-space transformer, T-Head PPU).
- **llama.cpp** leads on **quantization breadth** (OpenCL q2_0/IQ3_S) and hardware portability, but trails on frontier model correctness.
- **Unsloth** is the only project shipping **audio-VLM training** end-to-end today, plus multi-modality (audio+image) dataset fixes.
- **Ollama** is notably **absent from the frontier-model race** this cycle — its activity is concentrated on MLX/Apple-Silicon maturity and API-shape compatibility.

---

## 4. Performance Frontier

Optimization effort clusters into five distinct lanes, with limited overlap between projects:

### KV Cache (largest single cluster)
- **vLLM**: NVFP4 KV for QSA (#64199); Mooncake KV-transfer bandwidth gap -35–67% vs NIXL (#63006); KV-pool saturation → 2.3x TPOT inflation (#64460).
- **SGLang**: LMCache cost-based external KV decisions (#47518); LMCache on PD-prefill (#47507); HiCache kvcacheio on B200 (crash #46203).
- **llama.cpp**: rotation constants resident on GPU (b12007); native quantized KV in `flash_attn_tile` (#31234) — a decisive step for long-context local serving.
- **Ollama**: per-layer KV sizing fix (#19327) — correcting an over/under-estimation class of bug also flagged in #19417.

### Batching & Scheduling
- **vLLM**: KV-pool admission backoff (#64460); declarative V1/V2 gating refactor (#64830).
- **SGLang**: mixed-prefill resource controls (#47308); PD-disaggregation KV ordering (#47507).
- **llama.cpp**: generic batched tensor copy API (b12002).

### Quantization & Kernels
- **vLLM**: fused QK-norm+RoPE+gate extended to ROCm (#51406); zero-JIT-compilation tracker (#49349).
- **SGLang**: FlashInfer 0.7.2.post1 bump (#46926); aiter legacy KV-scale fix (#47030); QuickReduce priority (#40771).
- **llama.cpp**: OpenCL q2_0, IQ3_S/IQ3_XXS, FWHT, topk_mask; MoE expert cache with LRFU/ClassLRU (+6% QFN, +7% GLM).
- **Unsloth**: LoRA kernel precision fix (#16071) — sub-bf16 rank-r updates no longer rounded away.

### Distributed Serving / Parallelism
- **vLLM**: direct weight reload (RLHF); CUDA Checkpoint/Restore for near-zero cold starts (#34303); GLM-5 PP stale top-k (#63170).
- **SGLang**: DFLASH TP-split draft FC with multicast all-gather (#45895); SM107 Vera Rubin routing (#47354).

### Cold Start / Weight Reload (emerging hot spot)
- **vLLM**: checkpoint/restore RFC (#34303, 19👍) + direct-reload PR cluster.
- **SGLang**: `SGLANG_JIT_DEEPGEMM_FAST_WARMUP` → 30min→**<3min**, no detectable regression (#47397).
- **Ollama**: 5s `ollama ls` on PTY (#15597) is minor by comparison but same UX class.

**Assessment:** The center of gravity has **shifted from raw throughput toward lifecycle economics** (cold start, weight reload, KV reuse cost, admission backoff). This is a maturity signal — the ecosystem is optimizing how models *enter and leave* serving, not just how fast they compute.

---

## 5. Layer Positioning

| Layer | Projects | Primary Job | Current Fault Surface |
|---|---|---|---|
| **High-throughput serving engine** | vLLM, SGLang | Multi-GPU, multi-tenant inference at scale; frontier-model day-0 | Auth bypass (vLLM #64391), scheduler crashes (SGLang #47218), tool-parser correctness |
| **Local / edge runtime** | llama.cpp, Ollama | Single-node, consumer/prosumer hardware, quantized weights | SYCL/Intel regressions, MTP+KV-rollback crash, MLX memory accounting |
| **LLM gateway / router** | LiteLLM | Provider abstraction, cost metering, guardrails, fallbacks | Billing window under-count (#49179), streaming usage drop (#36168), cache-hit $0 rows (#39057) |
| **Training / fine-tuning** | Unsloth | LoRA/RL kernels, GGUF export, Studio UX | Install isolation overwrite (#16186), Windows+AMD commit leak (#16015) |

**Boundary notes:**
- **vLLM ↔ LiteLLM** intersect at the API surface: LiteLLM's vLLM pass-through ignores DB-stored `api_key` (#23443, closed-stale) — a gateway/engine auth-contract mismatch worth re-testing.
- **llama.cpp ↔ Ollama** are vertically adjacent: Ollama embeds llama.cpp for many models but is diverging via MLX. The `/api/chat` clip-handling fix (#19397) shows the two layers must stay in sync on modality contracts.
- **Unsloth ↔ everything** — GGUF exports feed llama.cpp/Ollama; LoRA precision affects downstream serving fidelity. The audio-VLM fixes (#16124, #16242) are prerequisites for any Unsloth→serving-engine audio pipeline.
- **Gateway layer is the highest-blast-radius chokepoint today**: LiteLLM bugs propagate cost-misattribution and tool-call failures across *every* upstream engine.

---

## 6. Trend Signals

### Trend 1 — **Cold start is the new benchmark**
vLLM (checkpoint/restore, direct reload), SGLang (10x warmup reduction), and Ollama (update-time reduction) all moved on startup economics in a single window. **Why it matters:** serverless autoscaling and per-workload model swaps become economically viable when cold start drops from minutes to seconds — this reshapes deployment topology more than raw tokens/sec does.

### Trend 2 — **Gateway correctness is a billing and compliance risk**
LiteLLM's cost-accounting bug cluster (#49179 window under-count, #36168 streaming usage drop, #39057 cache-hit token replay) is not cosmetic — it silently under-enforces budgets and inflates token-based reporting. **Action for decision-makers:** treat gateway upgrades as financial-controls changes, not just infrastructure updates.

### Trend 3 — **Tool-calling is ecosystem-wide weak**
vLLM (#55152, #58147), Ollama (#19403, #19415), and LiteLLM (#49237, #49088) all have open or freshly-closed tool/thinking-replay bugs. **Every layer of the stack is fragile at the reasoning/tool boundary.** Agent developers should validate tool names against declared schemas server-side and pin parser versions.

### Trend 4 — **Speculative decoding is gaining power and gaining coupling**
MTP/spec decode now interacts with structured output, KV rollback, pipeline parallelism, and quantized KV. Failures are cross-cutting: vLLM #54437 (now closed), llama.cpp #31077, SGLang #45895. **The callback: treat spec decode as a first-class subsystem, not a flag.**

### Trend 5 — **Hardware pluralism is real — and unevenly mature**
AMD RDNA3/4, MI355X, T-Head PPU, Intel Arc (SYCL + Vulkan), OpenCL, MLX, Hexagon, XPU, SM107 — all in one window. But maturity gaps persist: vLLM MI350X long-context decode (#48043), llama.cpp SYCL segfaults (#31064) and 28–35% MoE regression (#31068), Ollama MLX memory accounting (#19417). **Vendor-neutral portability remains aspirational; production decisions should be per-hardware-validated.**

### Trend 6 — **Security incidents are surfacing in serving engines**
vLLM's `/invocations` auth-bypass (#64391, closed) and SGLang's rust-server control-plane issues (#47511, #47509) indicate that as engines grow feature surfaces (SageMaker compat, DP-rank control routing), **the attack surface grows faster than the review process**. Application teams should audit exposed endpoints and internal control paths independently of upstream fixes.

### For Agent / Application Developers — Watchlist for Next 30 Days
1. **Pin known-good versions** on any stack combining spec decode + structured output + tool calling until the parser-correctness cluster clears.
2. **Instrument client-side timeouts** if you use Ollama Cloud (#19111 is production-impacting with no visible fix) — and prepare a local fallback route.
3. **Re-validate billing dashboards** after the next LiteLLM release, especially token-basis reports that aggregate `usage` columns.
4. **Track the Rust router migration (§2, #49118–#49235)** — this affects latency, config resolution, and eventually deployment complexity (new toggle, Python fallback at construction).
5. **Benchmark the deepgemm fast-warmup flag** if you run DeepSeek-V4.1 on SGLang; the reported 10x cold-start improvement with no decode regression materially changes autoscaling economics.
6. **Avoid `UNSLOTH_STUDIO_HOME` isolation** for multi-tenant Studio deployments until #16185/#16186 are resolved — the failure mode is silent venv overwrite.

---

*Prepared for infrastructure engineers and technical decision-makers. All data sourced from project digests dated 2026-10-31. Cross-project synthesis reflects activity in the trailing 24-hour window and does not capture unreleased or private-roadmap work.*

---

## Per-Project Reports

<details>
<summary><strong>vLLM</strong> — <a href="https://github.com/vllm-project/vllm">vllm-project/vllm</a></summary>

# vLLM Digest — 2026-10-31

## 1. Today's Highlights

Cold-start latency and RL weight-reload efficiency dominated activity today: the **CUDA Checkpoint/Restore RFC (#34303)** continues to attract strong community interest (19 👍), while a cluster of PRs (#64336, #64717, #64352, #59000) pushes the **direct weight reload** design from RFC #54477 toward implementation. On the performance side, ROCm/MI355X optimization for Qwen3.8-Flash-Next (#59575) and a wave of CI sharding PRs signal continued investment in AMD parity. The most notable correctness activity is a **security issue (#64391)** — since closed — where the SageMaker-compatible `/invocations` endpoint bypassed API key auth by default.

## 2. Releases & Breaking Changes

**No new releases in the last 24h.**

Notable config/behavior changes in flight (not yet merged):
- **`num_redundant_experts` default change** — PR #30614 normalizes EPLB's `num_redundant_experts` from `None` to the minimum valid value at `VllmConfig` init. Deployments relying on explicit EPLB redundancy settings should verify divisibility assumptions. [PR #30614](https://github.com/vllm-project/vllm/pull/30614)
- **V2-only feature gating refactor** — PR #64830 moves HiSparse, custom speculative methods, and watermarking into `_get_v1_model_runner_unsupported_features()`, making V1/V2 capability checks declarative. Behaviorally equivalent but affects error messaging. [PR #64830](https://github.com/vllm-project/vllm/pull/64830)

## 3. New Model & Hardware Support

- **Step-5-Preview on ROCm** — PR #61837 (merged/closed today) adds a self-contained `amd/` implementation for `stepfun-ai/Step-5-Preview`, complementing prior NVIDIA support. A **follow-up PR #64833** now requires CDNA3 or newer (`get_cdna_version() >= 3`) for the sparse-attention layers, with `supported_models.md` updated accordingly. [PR #61837](https://github.com/vllm-project/vllm/pull/61837) · [PR #64833](https://github.com/vllm-project/vllm/pull/64833)
- **Qwen4Exp NVFP4 KV cache for QSA** — PR #64199 enables `--kv-cache-dtype nvfp4` for Qwen4Exp's QuerySparse Attention layers, backed by FlashInfer's sparse paged attention. [PR #64199](https://github.com/vllm-project/vllm/pull/64199)
- **DeepSeek V4/V4.1 MegaMoE locality placement** — PR #64835 adds opt-in locality-domain placement for MegaMoE expert weights via the pinned DeepGEMM API; `mega_moe_localize_weights` defaults off. [PR #64835](https://github.com/vllm-project/vllm/pull/64835)
- **XPU/UCX block-size fix** — PR #64834 corrects hard-coded 16-token blocks to XPU-required multiples of 64 in KV-connector UCX tests. [PR #64834](https://github.com/vllm-project/vllm/pull/64834)

## 4. Performance & Optimization

- **ViT Full CUDA Graph (RFC #38175, 48 comments)** — Proposal to CUDA-graph the entire ViT forward pass for multimodal models (Qwen3-VL, Kimi K2.5, GLM-V), eliminating per-op launch overhead in production serving. [Issue #38175](https://github.com/vllm-project/vllm/issues/38175)
- **CUDA Checkpoint/Restore for near-zero cold starts (#34303)** — Targets multi-model serving and scale-from-zero; V1-engine-scoped draft RFC with 19 👍. [Issue #34303](https://github.com/vllm-project/vllm/issues/34303)
- **ROCm MI355X Qwen3.8-Flash-Next optimization (#59575)** — Active tracker for `amd/Qwen3.8-Flash-Next-Quark-MXFP4` (GatedDeltaNet, QSA, HyperConnection gated residual, MXFP4 MoE) on gfx950. [Issue #59575](https://github.com/vllm-project/vllm/issues/59575)
- **Mooncake KV transfer bandwidth (#63006)** — Descriptor/WR overhead reduction targeting the observed **-35% to -67% bandwidth gap** vs. NIXL on full-attention models (Qwen3), plus higher TTFT. [Issue #63006](https://github.com/vllm-project/vllm/issues/63006)
- **Zero-JIT-compilation tracking (#49349)** — Follow-up to shared JIT warmup infra (#47456); foundation PRs (#47451, #49315, #50174) are complete, model-level de-JITification in progress. [Issue #49349](https://github.com/vllm-project/vllm/issues/49349)
- **Fused QK-norm+RoPE+gate for ROCm** — PR #51406 extends the Triton `fused_qk_rmsnorm_rope_gate` kernel (currently CUDA-gated) to Qwen3-Next/Qwen3.5 on ROCm. [PR #51406](https://github.com/vllm-project/vllm/pull/51406)
- **KV-pool-saturated admission backoff (#64460)** — Reports **~2.3x decode TPOT inflation** when admission retries pile up on a saturated pool; requests automatic backoff in the V1 scheduler. [Issue #64460](https://github.com/vllm-project/vllm/issues/64460)

## 5. Stability & Regressions

Ranked by severity:

1. **[CLOSED] Security: `/invocations` bypasses API key auth (#64391)** — SageMaker-compat endpoint enabled by default without honoring authentication. Reported 2026-10-29, closed 2026-10-30. **Verify your deployments aren't exposing this endpoint publicly.** [Issue #64391](https://github.com/vllm-project/vllm/issues/64391)
2. **Structured output unconstrained tokens in spec-decode + async scheduling + PP path (#54437)** — Draft hand-off going stale allowed sampling of unconstrained tokens. Now **CLOSED**; relevant to anyone combining spec decode with structured output. [Issue #54437](https://github.com/vllm-project/vllm/issues/54437)
3. **GLM-5.x (DSA) PP stale top-k indices (#63170)** — Reuse layers at stage start read stale top-k indices under pipeline parallelism; hardware-independent, affects any `--pipeline-parallel-size > 1`. [Issue #63170](https://github.com/vllm-project/vllm/issues/63170)
4. **Gemma4 MTP spec decode crash at engine init (#48848)** — `"a and b must have same reduction dim"` regression from 0.21.0 on 0.25.1, aarch64/DGX Spark. [Issue #48848](https://github.com/vllm-project/vllm/issues/48848)
5. **NVFP4 KV scale corruption on SM120 (#50084)** — V block scales written in SM100 trtllm-gen swizzle unconditionally, silently corrupting the SM120 FlashInfer XQA route. Silent correctness issue on RTX 5090. [Issue #50084](https://github.com/vllm-project/vllm/issues/50084)
6. **Qwen3.5 GDN + torch.compile warmup crash (#50046)** — Stride mismatch on `splitting_ops` boundary; recurrence of #29014. [Issue #50046](https://github.com/vllm-project/vllm/issues/50046)
7. **Priority scheduling un-schedules requests (#59907)** — Encoder cache miss, prefix hits on unwritten KV, priority inversion; CPU-only reproducers available. [Issue #59907](https://github.com/vllm-project/vllm/issues/59907)
8. **ROCm gfx950 paged attention HIP failure (#48043)** — `hipErrorLaunchFailure` under long-context decode on MI350X. [Issue #48043](https://github.com/vllm-project/vllm/issues/48043)
9. **Qwen3.5-122B FP8 CUBLAS_STATUS_EXECUTION_FAILED (#48477)** — No version currently serves FP8 hybrid GDN + DFlash together; 0.24.0 worked. [Issue #48477](https://github.com/vllm-project/vllm/issues/48477)
10. **Tool-calling parser correctness (#55152, #58147)** — Guidance backend rejects structural tags (KeyError `'triggers'`, breaks strict/named tool_choice); Qwen3 parser converts quoted markup into real tool calls including hallucinated names. Both directly impact agent reliability. [Issue #55152](https://github.com/vllm-project/vllm/issues/55152) · [Issue #58147](https://github.com/vllm-project/vllm/issues/58147)

**Fix PRs in flight:** #52244 (hybrid GDN prefix-cache under MTP), #50538 (FlashInfer B12x MoE runtime tensors across reload), #59000 (Gemma4 MTP gathered LM head refresh).

## 6. What This Means for Application Developers

- **Audit your SageMaker-compat deployments now.** The `/invocations` endpoint bypassed API key auth by default until it was closed today (#64391). If you run `vllm/vllm-openai` behind SageMaker or in any exposed setup, confirm the fix is in your image.
- **Tool-calling is the current weak spot.** Two open bugs (#55152, #58147) break strict/named tool_choice and can turn model-quoted markup into phantom tool invocations. If you're building agents, pin known-good parser versions and add validation on tool names against your declared schema.
- **Speculative decoding + structured output was unsafe** until #54437 closed today — if you're stacking MTP/spec decode with JSON schema enforcement, upgrade and re-validate.
- **Cold starts and RL weight sync are the roadmap themes.** If you swap models per-workload or run RLHF loops, expect meaningful improvements soon via the direct-reload work (#64336, #64717, #64352) and the checkpoint/restore RFC (#34303).
- **ROCm is closing the gap but has rough edges** — MI355X optimizations are landing, but MI350X long-context decode (#48043) and gfx1201 LDS limits (#48723) remain open. Budget validation time for AMD deployments.
- **KV-pool saturation can silently halve decode throughput.** If you see unexplained TPOT inflation under load, #64460's ~2.3x degradation report is worth benchmarking against your admission configuration.

</details>

<details>
<summary><strong>SGLang</strong> — <a href="https://github.com/sgl-project/sglang">sgl-project/sglang</a></summary>

# SGLang Digest — 2026-10-31

## 1. Today's Highlights

No releases landed in the last 24h, but the tracker surfaced a heavy maintenance load: the flaky-CI meta-issue (#42752) ballooned to 159 comments, indicating sustained test instability is now a first-class engineering concern. On the positive side, two concrete performance wins were reported — a 3–5x cold-start speedup for DeepSeek-V4.1 via `SGLANG_JIT_DEEPGEMM_FAST_WARMUP` with no measurable runtime regression (#47397), and a wave of LMCache/HiCache PRs making external KV reuse cost-aware and PD-prefill-capable. Meanwhile, hardware coverage continues to broaden across AMD RDNA3/RDNA4 (#46900), T-Head PPU (#37519), and SM107 routing work (#47354).

## 2. Releases & Breaking Changes

No new releases in the last 24h.

One RFC worth tracking for API consumers: **#45816 [RFC] Complete migration to the shared `api.v1` backend API** — unifying generation behind the Rust server's `api.v1.Generate` schema across processor and router. Not yet breaking, but signals future consolidation of the serving stack.

Also of note for compliance/accounting: **PR #46091** aligns prompt and cache accounting across Chat/Responses/Messages APIs, and **PR #47308** adds mixed-prefill resource controls — both are scheduling/accounting semantics changes that may shift reported token counts.

## 3. New Model & Hardware Support

- **[AMD] RDNA3/RDNA4 (gfx1100/gfx1201) CI and upstreaming plan** — #46900. Consumer/prosumer Radeon support on main is being formalized.
- **[Roadmap] T-Head SAIL / Zhenwu 810/810E/M890P support** — #37519. First-class upstreaming of Alibaba's PPU accelerators.
- **HiDream-O1-Image (8B pixel-space unified transformer)** — PR #39682. No VAE, no separate text encoder; prompt tokens and raw image patches share one sequence.
- **DFlash KDA drafts via target KDA layer** — PR #47423. SpecForge-exported Kimi Delta Attention drafts now servable.
- **SM107 (Vera Rubin NVL72) GLM-5 routing** — PR #47354, routing small-M BF16 GEMMs to FlashInfer warp split-K with PDL.
- **FlashInfer bump to 0.7.2.post1** — PR #46926 (pin, cubin/jit-cache, runtime check).

## 4. Performance & Optimization

- **DeepSeek-V4.1 cold start: 3–5x faster** with `SGLANG_JIT_DEEPGEMM_FAST_WARMUP=True` (30min → <3min warmup), with no runtime degradation detectable at chunked-prefill 16384 — #47397. This directly contradicts the documented "might cause performance degradation" caveat.
- **LMCache: cost-based external KV load decisions** — PR #47518 introduces `--lmcache-load-cost-profile` so SGLang skips external KV loads that cost more than recomputing the prefix, using measured hit-geometry costs.
- **LMCache on PD prefill servers** — PR #47507 enables external KV reuse on prefill, ordering early prefix sends after async retrieves.
- **AMD all-reduce: prefer QuickReduce over CustomAllReduce** when both eligible — PR #40771.
- **DFLASH opt-in TP-split draft FC with multicast all-gather** — PR #45895.
- **AMD aiter legacy target-verify KV scale fix** — PR #47030 (correctness + perf for spec decoding with fp8 KV cache).

## 5. Stability & Regressions

Ranked by severity:

1. **Scheduler crash → full worker fleet down.** DeepSeek-V4.1-Flash crashes when `items_offset_list` is `None` in the multimodal embedding path under concurrent aborted streams; restarts the serving container — #47218 (no fix PR referenced).
2. **GLM-5.3-Flash fa4 backend crashes at CUDA-graph capture on SM120** (hybrid extend reshape); triton is the only working backend on RTX PRO 6000 — #42012. Currently blocking fa4 for this hardware/model combo.
3. **DSV4.1 Flash + DSPARK OOM crash every 15–25 min** under sustained max-batch decode, with KV pool only 29% used — #43486. Symptoms point to CUDA caching allocator exhaustion rather than genuine KV pressure.
4. **Xid 13 "CTA Not Present" in HiCache kvcacheio transfer kernels on B200** — 7 crashes across 4 machines under agentic load — #46203.
5. **Flaky CI mega-thread #42752** — npm-tracking NVIDIA `PR Test Base`/`PR Test Extra` failures, now 159 comments. Complements existing tracker #17050.
6. **rust-server security/correctness bugs** — two fresh reports (#47511, #47509): `/internal/peer` relays control requests without verifying DP rank ownership; `gather_server_endpoints` can advertise loopback/unroutable addresses to peers.
7. **JIT link failure with pip CUDA toolkit 13 layout** (`-L$CUDA_HOME/lib64` vs `lib/libcudart.so.13`) — #46418.
8. **Diffusion: Nomas KV budget ignores freed cached memory** (uses `mem_get_info` only, ignoring allocator cache), SP divisibility checked too late — #47515.

Several older issues (#34740, #30314, #32286, #37215) were closed as inactive during this window — the maintainers appear to be pruning stale reports.

## 6. What This Means for Application Developers

- **If you're pinning a warmup for DeepSeek-V4.1 in CI or on-demand deployments**, enabling `SGLANG_JIT_DEEPGEMM_FAST_WARMUP` is now evidence-backed: 10x shorter cold start with no detected decode regression. This materially changes the economics of autoscaled serverless deployments.
- **LMCache users on PD-disaggregated setups** should watch PRs #47507 and #47518 — external KV reuse is being extended to prefill and made cost-aware, which should reduce recompute on prefix-heavy agent traffic. The cost-profile option is opt-in, so no surprise behavior change.
- **Avoid fa4 on SM120 (RTX PRO 6000) for GLM-5.3-Flash** until #42012 is resolved; use triton. Budget for stability risk on DSV4.1 + DSPARK max-batch decode (#43486) — the OOM is not a capacity problem you can fix by adding memory.
- **Rust server deployments (`SGLANG_RUST_SERVER=1`)**: two open bugs (#47511, #47509) touch DP-rank control routing and endpoint advertisement — audit multi-node configs, and note SIGTERM drain is being added (#47489) so rolling restarts will behave more like the Python server.
- **Token accounting is in flux** across Chat/Responses/Messages — if you bill or budget on prompt counts, monitor PR #46091 before it lands in a release.
- **AMD users** gain RDNA3/RDNA4 trajectory clarity and several correctness/perf PRs (aiter KV scales #47030, QuickReduce priority #40771); ROCm/MI355X Qwen3.8-Flash-Next optimization remains an active tracker (#44304).

</details>

<details>
<summary><strong>llama.cpp</strong> — <a href="https://github.com/ggml-org/llama.cpp">ggml-org/llama.cpp</a></summary>

# llama.cpp Digest — 2026-10-31

## 1. Today's Highlights

The project continues its steady stream of small releases (b12002–b12017), headlined by a new batched tensor copy API in ggml that's already wired into llama context I/O, and a KV-cache change that keeps rotation constants resident on the GPU. A large batch of SYCL issues remains unresolved, with fresh reports of segfaults, bf16 conversion failures, and an XMX-ESIMD performance regression on Intel hardware. Meanwhile, a long-running research thread on Metal vs. Vulkan performance on Apple Silicon continues to draw the most community engagement.

## 2. Releases & Breaking Changes

- **[b12017](https://github.com/ggml-org/llama.cpp/releases)** — `rpc`: removed `fs_path_to_utf8()` (follow-up to a broader common/rpc cleanup series).
- **[b12015](https://github.com/ggml-org/llama.cpp/releases)** — `common`: removed `fs_path_to_utf8()`.
- **[b12014](https://github.com/ggml-org/llama.cpp/releases)** — `common`: dropped Windows argv reconstruction; the manifest from #31329 now guarantees UTF-8 argv. Fixes #26416. **Windows CLI consumers that relied on the prior behavior should verify argument handling.**
- **[b12012](https://github.com/ggml-org/llama.cpp/releases)** — vendored `cpp-httplib` bumped to **0.64.0**. Server operators should note potential upstream HTTP behavior changes.
- **[PR #31444](https://github.com/ggml-org/llama.cpp/pull/31444)** — removes `common_get_path_from_env()` as dead code (cleanup only).

## 3. New Model & Hardware Support

- **[b12005](https://github.com/ggml-org/llama.cpp/releases)** — OpenCL: initial **q2_0** support with AOS/SOA mat-vec, tiled mat-mul, and noshuffle paths (Qualcomm co-authored).
- **[PR #31338](https://github.com/ggml-org/llama.cpp/pull/31338)** — OpenCL: initial **IQ3_S / IQ3_XXS** support (in progress).
- **[PR #31441](https://github.com/ggml-org/llama.cpp/pull/31441)** — OpenCL: `topk_mask` op, ported from Metal/CUDA (merge-ready).
- **[PR #31434](https://github.com/ggml-org/llama.cpp/pull/31434)** — OpenCL: initial **FWHT** support.
- **[PR #25731](https://github.com/ggml-org/llama.cpp/pull/25731)** — New architecture: **TML Inkling** (converter + graph + kernels, including banded flash attention). Still open.
- **[PR #31386](https://github.com/ggml-org/llama.cpp/pull/31386)** (closed/merged-track) — LFM3-Audio / LFM3-Omni quant guards relaxed; QAT-trained, quant-safe.
- **[b12008](https://github.com/ggml-org/llama.cpp/releases)** — Gemma3n/Gemma4: fixes `token_embd` creation order for tied outputs (CPU-only, `-ngl 0` previously doubled the table).
- **[PR #31356](https://github.com/ggml-org/llama.cpp/pull/31356)** — Gemma4 E2B/E4B graph optimization drops unused prompt-token compute in KV-shared layers.

## 4. Performance & Optimization

- **[b12002](https://github.com/ggml-org/llama.cpp/releases)** — ggml: new **generic batched tensor copy API**, now used in llama context I/O (assisted by DeepSeek-V4-Flash-Vision on M2 Ultra). Reduces per-op overhead in multi-tensor I/O paths.
- **[b12007](https://github.com/ggml-org/llama.cpp/releases)** — KV cache: **rotation constants kept resident on GPU**, eliminating per-step host→device transfers. Adds tests and documents remaining multi-device rotation work.
- **[PR #31233](https://github.com/ggml-org/llama.cpp/pull/31233)** — MoE expert cache: hybrid LRFU/ClassLRU replacement with decaying usage history. Author reports **+6% decode on QFN, +7% on GLM, 8% fewer uploads** vs SLRU with a warm cache.
- **[PR #31234](https://github.com/ggml-org/llama.cpp/pull/31234)** — CUDA/HIP: native **quantized KV in `flash_attn_tile`** (q4/q8), avoiding per-step dequantization to f16.
- **[PR #31443](https://github.com/ggml-org/llama.cpp/pull/31443)** — Qwen3.8-Flash-Next: ~**2% decode gain** by dropping a redundant `cont` in conv-state write.
- **[PR #31446](https://github.com/ggml-org/llama.cpp/pull/31446)** — Hexagon: batched HVX vgather transposes for permuted CONT/CPY.
- **[PR #19590](https://github.com/ggml-org/llama.cpp/pull/19590)** — WASM relaxed-SIMD dot-product kernels (long-running).

## 5. Stability & Regressions

**High severity — active:**
- **[Issue #31064](https://github.com/ggml-org/llama.cpp/issues/31064)** — SYCL: **segfault** on oneAPI 2026.2.0 (B580 + 5700X3D).
- **[Issue #31068](https://github.com/ggml-org/llama.cpp/issues/31068)** — SYCL: **XMX-ESIMD path regressed MoE prompt processing ~28–35%** on Arc Pro B70 between builds 11783 and 11851. Regression bisected to `d81d0d8fb`.
- **[Issue #31077](https://github.com/ggml-org/llama.cpp/issues/31077)** — CUDA: **illegal memory access** with Gemma 4 31B + draft-MTP immediately after KV rollback/clear. MTP-off is unaffected. No fix PR yet.
- **[Issue #31385](https://github.com/ggml-org/llama.cpp/issues/31385)** — CUDA: DeepSeek-V4.1-Flash-1017 GGUF issues reported on RTX 6000 Pro.
- **[Issue #24015](https://github.com/ggml-org/llama.cpp/issues/24015)** — `ggml-backend-meta.cpp` assert (`GGML_BACKEND_SPLIT_AXIS_0`) on 4×3090 with MiniMax M2.7.

**Medium severity:**
- **[Issue #30869](https://github.com/ggml-org/llama.cpp/issues/30869)** — HIP compile failure on **AMD CDNA2 (gfx90a / MI210)**.
- **[Issue #31108](https://github.com/ggml-org/llama.cpp/issues/31108)** — HIP/ROCm (gfx1200): `SOLVE_TRI` memory fault in `test-backend-ops`.
- **[Issue #28721](https://github.com/ggml-org/llama.cpp/issues/28721)** — Vulkan on Intel Arc Pro B70: **~8× decode collapse at 64k context** (SYCL only degrades ~2.4×). Backend-intrinsic.
- **[Issue #29341](https://github.com/ggml-org/llama.cpp/issues/29341)** — Windows CUDA arm64 (Blackwell): throughput regression between b10655 and b11140.

**Confirmed-fixed / stale-closed today:**
- **[Issue #31328](https://github.com/ggml-org/llama.cpp/issues/31328)** (LFM3 grammar 500s), **[#28675](https://github.com/ggml-org/llama.cpp/issues/28675)** (LFM2.5 think-tag leakage), **[#30199](https://github.com/ggml-org/llama.cpp/issues/30199)** (Vulkan rollback flake), **[#28877](https://github.com/ggml-org/llama.cpp/issues/28877)** (CUDA sigmoid misalignment on sm_120).
- **[PR #31415](https://github.com/ggml-org/llama.cpp/pull/31415)** — fix for repeated graph reallocations in Qwen3.5 dense MTP (addresses #31302).
- **[PR #30743](https://github.com/ggml-org/llama.cpp/pull/30743)** — CPU argsort/top-k on **non-contiguous tensors** was reading out of row bounds; fix in review across all backends.

## 6. What This Means for Application Developers

- **Server operators on Windows** should re-validate CLI argument handling after b12014, and pin `cpp-httplib`-dependent behavior if you're running the embedded HTTP server — 0.64.0 landed in b12012.
- **MTP + draft models with KV rollback**: if you're using speculative decoding with checkpoint restore (streaming agents, slot recycling), watch [#31077](https://github.com/ggml-org/llama.cpp/issues/31077). A workaround is disabling MTP until the fix lands.
- **Intel GPU users**: SYCL has several open correctness and perf issues as of today. Vulkan remains the safer default for Arc at long context, but you'll trade decode scaling beyond ~32k tokens ([#28721](https://github.com/ggml-org/llama.cpp/issues/28721)).
- **MoE deployments**: PR [#31233](https://github.com/ggml-org/llama.cpp/pull/31233) is worth benchmarking if you run Qwen-Flash-Next or GLM — single-digit decode gains plus reduced expert uploads, i.e. real PCIe/H2D relief for offloaded MoE.
- **KV-cache heavy workloads**: b12007 and PR [#31234](https://github.com/ggml-org/llama.cpp/pull/31234) reduce per-step overhead on quantized long-context serving — relevant if you observe decode degradation as context grows.
- **Router/multi-model setups**: [#28908](https://github.com/ggml-org/llama.cpp/issues/28908) (RPC accept-loop starvation) was closed stale but is worth re-checking if you run distributed RPC workers behind a router leader.

</details>

<details>
<summary><strong>Ollama</strong> — <a href="https://github.com/ollama/ollama">ollama/ollama</a></summary>

# Ollama Digest — 2026-10-31

## 1. Today's Highlights

No new releases landed in the last 24 hours, but PR activity is dense and centered on three themes: **API-compatibility correctness** (OpenAI/Anthropic endpoint conversions), **MLX backend maturity** (drafting controls, memory pre-flight, repeat limits), and **memory accounting for the scheduler**. A high-severity customer-facing issue on Ollama Cloud (`/v1/chat/completions` returning no HTTP response, followed by 5-minute queuing then 429s) remains open and active ([#19111](https://github.com/ollama/ollama/issues/19111)).

---

## 2. Releases & Breaking Changes

No releases published in the last 24h. No confirmed breaking changes landed.

Two config/docs issues worth tracking as potential migration friction:

- **Modelfile case-sensitivity mismatch** — docs claim the Modelfile is case-insensitive, but parameter names and message roles are not. Mixed-case Modelfiles that "work" for instructions may silently mis-parse parameters ([#19405](https://github.com/ollama/ollama/issues/19405)).
- **CRLF Modelfiles retain `\r` inside triple-quoted values**, injecting stray carriage returns into system prompts/templates ([#19404](https://github.com/ollama/ollama/issues/19404)).

---

## 3. New Model & Hardware Support

- **AutoTrust text + vision models on MLX** — PR [#19399](https://github.com/ollama/ollama/pull/19399) wires AutoTrust through model creation, prompt encoding, and API routing. Test artifact: `ollama pull dhiltgen/autotrust-jev`.
- **Intel Macs on macOS 12 (Monterey)** — best-effort desktop app + CLI support added in PR [#19413](https://github.com/ollama/ollama/pull/19413), fixing [#19308](https://github.com/ollama/ollama/issues/19308). Currently the macOS build requires macOS 14, excluding Intel hardware capped at 12.7.6. Default builds unaffected.
- **MLX drafting toggle** — `draft_num_predict=0` now disables speculative decoding per request (default remains 4), enabling A/B benchmarking of draft speedup on MLX ([#19391](https://github.com/ollama/ollama/pull/19391)).

---

## 4. Performance & Optimization

- **Per-layer KV cache sizing** — [#19327](https://github.com/ollama/ollama/pull/19327) fixes `PredictServerVRAM` to size each layer's KV cache using its own `head_count_kv`, head size, context, and f16 precision. Previously all layers were sized with the smallest `head_count_kv`, causing over- or under-estimation and unnecessary runner evictions. This is the same class of bug flagged in [#19417](https://github.com/ollama/ollama/issues/19417), where MLX models skip scheduler pre-flight entirely and get booked at ~16.9 GiB (available dropped 91.5 → 74.6 GiB) while the runner's own memory check disagrees.
- **MLX token-repeat abort** — [#19398](https://github.com/ollama/ollama/pull/19398) ports the llama-server repeat limit to `mlxrunner.Client.Completion`: after 101 identical tokens, generation aborts with `prediction aborted, token repeat limit reached`. Prevents runaway streaming to the generation cap.
- **Claude Code output limits raised** — [#19410](https://github.com/ollama/ollama/pull/19410) bumps the max output cap to 128k tokens for Claude Code launches (Claude currently kills connections at 32k); important for long thinking runs.
- **5-second `ollama ls` on interactive PTY** — long-standing issue [#15597](https://github.com/ollama/ollama/issues/15597) remains open: `pselect6` timeout on stdout when a TTY is attached; piped stdout completes in ~14ms. Still a one-line shell workaround for anyone scripting around it.

---

## 5. Stability & Regressions

Ranked by severity:

1. **Cloud `/v1/chat/completions` unresponsive + 5-min queue → 429** — [#19111](https://github.com/ollama/ollama/issues/19111) (OPEN, 6 comments). Pro-plan workloads unusable since 2026-10-16. No HTTP status line/body returned; curl times out. Most impactful issue for anyone relying on Ollama Cloud in production. **No fix PR visible.**
2. **Anthropic `/v1/messages` drops all but the last thinking block** — [#19415](https://github.com/ollama/ollama/issues/19415), with a fix PR from the same author in [#19416](https://github.com/ollama/ollama/pull/19416) (keep all thinking blocks). Breaks extended-thinking replay for Anthropic-format clients.
3. **Cogito renderer/parser disagreement when `think: true` + tools** — [#19403](https://github.com/ollama/ollama/issues/19403). Prompt ends with `<｜tool▁outputs▁begin｜> thinking\n` even when tools are present; parser doesn't treat that as thinking, leaking reasoning into `content`.
4. **MLX models bypass scheduler memory pre-flight** — [#19417](https://github.com/ollama/ollama/issues/19417). Booked at weights-only, not runtime footprint; can overcommit VRAM on M5 Max under multi-model load. Related to #19327 above.
5. **Rejected blob uploads persist on disk** — [#19414](https://github.com/ollama/ollama/issues/19414). `POST /api/blobs/:digest` returns 400 on digest mismatch but stores the bytes under their *actual* digest, unreferenced until GC. Disk-usage/security-adjacent; no fix PR yet.
6. **Qwen3.5 4B thinking-only responses in long conversations** — [#18916](https://github.com/ollama/ollama/issues/18916) (Ollama 0.40.2, `num_ctx: 65536`). HTTP 200, `done_reason: "stop"`, but only `message.thinking`, no content/tool calls.
7. **Windows 11 26H2 TCP table ambiguity for Ollama loopback** — [#19418](https://github.com/ollama/ollama/issues/19418). Reporter explicitly caveats this doesn't establish a defect in Windows or Ollama; still worth noting for Windows 26H2 users troubleshooting listening sockets.
8. **`/api/chat` hands non-image clips to the projector** — [#19397](https://github.com/ollama/ollama/pull/19397) rejects clips the model has no encoder for; previously a base64 WAV could slip through `images` and the turn answered from text alone.

Also worth a glance: OpenAI multipart image + text split ([#19198](https://github.com/ollama/ollama/pull/19198), fixes [#7484](https://github.com/ollama/ollama/issues/7484)) and tool-call preservation on empty-array assistant content ([#19152](https://github.com/ollama/ollama/pull/19152)).

---

## 6. What This Means for Application Developers

- **If you're on Ollama Cloud**, #19111 is a blocker for production chat workloads — expect hard timeouts and 5-min queue-then-429 behavior. Instrument client-side timeouts and consider a local fallback model.
- **Anthropic-format clients** (Claude Code, custom `/v1/messages` callers): thinking-block replay is currently lossy (#19415); the fix is queued in #19416. Long-context agent loops relying on thinking history will subtly degrade.
- **OpenAI-compatible response IDs** are drawn from `rand.Intn(999)` across three endpoints ([#19401](https://github.com/ollama/ollama/pull/19401)) — if you dedupe or index by `id`, expect collisions. Fix PR is open.
- **Modelfile hygiene**: if you generate Modelfiles programmatically on Windows, normalize to LF before shipping to Ollama (#19404), and don't rely on case-insensitivity for anything other than instruction keywords (#19405).
- **MLX on Apple Silicon**: memory accounting for MLX is inconsistent between the scheduler and the runner (#19417). If you load multiple models, cap context explicitly rather than relying on defaults, and watch `available` in scheduler logs.
- **For LLM gateway builders**: the Anthropic and OpenAI conversion layers are the active fault surface this week — thinking blocks, multipart content, tool calls with empty content, and response IDs. Version-pin if you depend on exact serialization behavior.

---

*Sources: github.com/ollama/ollama issues and PRs updated 2026-10-30 → 2026-10-31. No releases published in this window.*

</details>

<details>
<summary><strong>LiteLLM</strong> — <a href="https://github.com/BerriAI/litellm">BerriAI/litellm</a></summary>

# LiteLLM Digest — 2026-10-31

## 1. Today's Highlights

The LiteLLM team is mid-flight on a major **router architecture migration**: a multi-PR stack (#49118 → #49119 → #49120 → #49235) extracts a `PythonCore`/`RouterCore` abstraction and introduces an optional **Rust routing core** behind the `LITELLM_RUST` flag — the biggest architectural change to the router in recent memory. Alongside that, a batch of cost-accounting correctness fixes landed or are under review, targeting the long-standing problem of misuse of `spend`/`usage.agent` columns when provider-reported totals, cache hits, and streaming usage chunks disagree with LiteLLM's own cost map. On the stability side, several long-lived bugs closed today (OpenRouter streaming cost loss, missing router-refused image failure logging, Claude Code + Bedrock websearch interception) while new correctness regressions were filed around in-flight key updates and streaming usage drops.

## 2. Releases & Breaking Changes

- **v1.109.0-dev.2** — dev pre-release only; contents are the cosign signature/verification from commit `e82a3c6`. No user-facing API changes documented. (No link provided in source.)
- **Router core refactor (breaking internally, flagged externally)** — #49119 and #49120 introduce `PythonCore`/`RustCore` behind `RouterCore`, and `litellm.Router` becomes a thin facade. With `LITELLM_RUST` off, behavior is unchanged; any config the Rust core cannot serve silently falls back to Python at construction time. Expect config-resolution edge cases as the stack finishes landing.
  - https://github.com/BerriAI/litellm/pull/49119
  - https://github.com/BerriAI/litellm/pull/49120
  - Docs scaffolding: https://github.com/BerriAI/litellm/pull/49235
- **Router migration intermediate steps** — #49118 threads a `RoutingContext` through strategies, cooldowns, fallbacks, and the auto/complexity/quality sub-routers. https://github.com/BerriAI/litellm/pull/49118
- **Fixed behavioral changes flagged as breaking (`!`)**:
  - `fix(guardrails)!` — preserve upstream error on mid-stream `/v1/messages` failure instead of replacing with a 400 from `tool_permission`: https://github.com/BerriAI/litellm/pull/49088
  - `fix(router)!` — route web search requests only to deployments with `supports_web_search: true`, overriding session/key pins: https://github.com/BerriAI/litellm/pull/49005
  - `fix(a2a)!` — bill completion-bridge agents (LangGraph, Databricks, custom providers) at their own price under `a2a_agent/<name>`; previously logged $0 / no spend rows: https://github.com/BerriAI/litellm/pull/49150
  - `fix(agentic)!` — surface failed agentic follow-up calls instead of returning the pre-loop tool call result: https://github.com/BerriAI/litellm/pull/49227

## 3. New Model & Hardware Support

- **Databricks Gemini Flash rows** — audio/video input capability flags (`supports_audio_input`, `supports_video_input`) added to the Databricks Gemini 3.5–3.8 Flash endpoint rows. https://github.com/BerriAI/litellm/pull/49361
- **DeepSeek V4** — issue closed; `reasoning_effort` (`"high"`/`"max"`) was being stripped to a generic `thinking: {"type": "enabled"}` rather than passed through. Reference for anyone using graded reasoning effort: https://github.com/BerriAI/litellm/issues/27439
- **Meta Model API (`meta` provider / `meta/muse-spark-1.1`)** — backend support exists but the UI Add Model dropdown lacked it; closed as a UI gap. https://github.com/BerriAI/litellm/issues/36164
- **Nano-GPT** — docs list the provider but the UI provider list does not; stale enhancement closed without landing. https://github.com/BerriAI/litellm/issues/34499

## 4. Performance & Optimization

- **Rust router core** in progress: `RustCore` serves completions, messages, embeddings, and responses routing when `LITELLM_RUST` is on; Python fallback at construction for unsupported configs. No benchmark numbers published in the PR body yet. https://github.com/BerriAI/litellm/pull/49120
- **Unbounded upstream error-body ingestion** (`~114 MB` HTTP 400 case) causing event-loop stall / RSS blowup is closed as stale — if you run LiteLLM behind flaky OpenAI-compatible backends, verify this is actually fixed rather than simply aged out. https://github.com/BerriAI/litellm/issues/34031
- **Latency-based routing lost-update race** — closed as stale rather than fixed; under concurrency (16 Anthropic + 4 OpenAI keys per model group) the strategy degrades toward count-weighted random selection. Worth re-testing on your version. https://github.com/BerriAI/litellm/issues/24720
- **`Retry-After` ignored for multi-deployment model groups** — instant retries against a shared rate-limited upstream; closed as stale. https://github.com/BerriAI/litellm/issues/34399

## 5. Stability & Regressions

Ranked by severity/footprint:

1. **New: in-flight request cost dropped from key budget window** — calling `/key/update` while a request is running means that request's cost never reaches `LiteLLM_BudgetWindowSpend`. `SpendLogs` and the key's `spend` column are correct; only window totals are wrong, so budget enforcement on keys is silently undercounted. Open, 6 comments. https://github.com/BerriAI/litellm/issues/49179
2. **New: streaming usage dropped when the final chunk has non-empty `choices`** — upstream `usage` (including cached tokens) is discarded, so cost is billed at full input rate. Open with a maintainer-visible mirror issue (#28735) noted. https://github.com/BerriAI/litellm/issues/36168
3. **Cache hits create $0 spend rows but replay original token columns** — an accounting-semantics bug: any token-based report that aggregates `usage` columns will show token volume for requests that cost nothing. Open, 26 comments, explicitly framed as a design-intent question. https://github.com/BerriAI/litellm/issues/39057
4. **OpenRouter streaming cost lost** (`usage.cost` not preserved in streaming; works non-streaming) — **CLOSED**. https://github.com/BerriAI/litellm/issues/16021
5. **Claude Code + Bedrock pass-through: websearch_interception never fires** — `web_search_20250305` forwarded to Bedrock, which rejects it; a proposed fix (#25242) introduces another Bedrock skip that re-breaks the original issue. **CLOSED**. https://github.com/BerriAI/litellm/issues/26252
6. **Router-refused `/images/generations` not logged to failure callbacks** — budget/RPM/cooldown refusals vanish from Langfuse, OTel, custom loggers. Multiple PRs; #49349 CLOSED, #47097/#47310 CLOSED earlier. https://github.com/BerriAI/litellm/pull/49349
7. **Postgres `max_connections` exhaustion in multi-worker proxy → all user keys fail** — closed stale. https://github.com/BerriAI/litellm/issues/34479
8. **Transient Postgres/HAProxy outage → "Invalid model name" for valid models** — closed stale. https://github.com/BerriAI/litellm/issues/26237
9. **Airgapped license verification fails when license payload contains `.`** — base64 split on first `.` byte; closed stale. https://github.com/BerriAI/litellm/issues/26231
10. **Mistral replayed `reasoning_content` dropped** instead of sent as `thinking` chunk — closed. https://github.com/BerriAI/litellm/issues/45546
11. **Anthropic `stop_reason: model_context_window_exceeded` mapped to `"stop"`** — no `_FINISH_REASON_MAP` entry; closed. https://github.com/BerriAI/litellm/issues/43012
12. **Vertex Anthropic `response_format` + `thinking` → 400** on `claude-opus-4-7`; closed. https://github.com/BerriAI/litellm/issues/26334
13. **Bedrock SigV4 replay of stale auth headers on retry** — closed. https://github.com/BerriAI/litellm/issues/27513
14. **`auto_router/complexity_router` rejects `thinking.type=adaptive`** for Claude Code — closed. https://github.com/BerriAI/litellm/issues/26224
15. **UI API-keys table truncates at 49 rows with no pagination** (99 keys exist) — closed. https://github.com/BerriAI/litellm/issues/49213
16. **`output_parse_pii` has no effect** (Presidio masking not applied) — closed stale. https://github.com/BerriAI/litellm/issues/14516
17. **Azure AI FLUX-1.1-pro / FLUX.1-Kontext-pro fail after 1.80.15 upgrade** — closed. https://github.com/BerriAI/litellm/issues/19334
18. **Claude Code + Microsoft Foundry: `reasoning.effort` unsupported + AnthropicResponse Pydantic validation error** — closed. https://github.com/BerriAI/litellm/issues/27091
19. **Anthropic → Responses adapter ignores `litellm.drop_params`** when mapping `metadata.user_id` to `user`; breaks strict `/responses` gateways — closed. https://github.com/BerriAI/litellm/issues/26241
20. **vLLM pass-through ignores DB-stored `api_key`** → 401; closed stale. https://github.com/BerriAI/litellm/issues/23443

Open fix PRs worth tracking:
- Split provider-reported `usage.cost` total between input/output using the cost-map rate ratio (fixes the whole-total-on-output-column bug): https://github.com/BerriAI/litellm/pull/49357
- Price native `/v1/messages` bodies as-served when provider reports no cost; fixes a **500 on null/missing `content`** introduced by #48254: https://github.com/BerriAI/litellm/pull/49356
- Return a named 400 instead of a 500 "unhashable type" for non-string `role` / object tool-call id in Anthropic requests: https://github.com/BerriAI/litellm/pull/49237
- Forward `metadata.user_id` on Anthropic Messages pass-through routes (Claude Code device/session ids were dropped): https://github.com/BerriAI/litellm/pull/49333
- Auto-router dashboard template resolution through ids and catch-all lists over partial wildcards: https://github.com/BerriAI/litellm/pull/49331
- Usage export rows now carry key and user `metadata` objects (chargeback without per-row `/key/info` + `/user/info`): https://github.com/BerriAI/litellm/pull/49360
- `importlib-metadata` limited to Python < 3.10: https://github.com/BerriAI/litellm/pull/49347
- `pyasn1` 0.6.4 → 0.6.5: https://github.com/BerriAI/litellm/pull/49362

## 6. What This Means for Application Developers

- **Do not call `/key/update` on keys that are actively serving traffic** if window-based budgets matter to you (#49179). Cost does land in `SpendLogs` and the key's `spend` column, but window totals will be short — meaning keys can exceed intended window budgets without tripping enforcement.
- **Audit your token-based reporting against cache hits** (#39057). If you aggregate token columns for billing, dashboards, or capacity planning, cached requests will appear to consume the original tokens while costing $0 — decide explicitly whether your reports are cost-basis or token-basis.
- **Streaming cost is not always trustworthy yet.** OpenRouter streaming cost loss is now closed, but the general streaming-usage drop when the final chunk carries `choices` (#36168) is still open. If you depend on cached-token accounting or precise streaming cost, verify against `SpendLogs` after upgrade, and pass provider cost explicitly where available.
- **Claude Code users routing through Bedrock or Microsoft Foundry**: the websearch interception pass-through issue and the `reasoning.effort` / `thinking.type=adaptive` issues are closed, but the underlying translation matrix remains fragile across Anthropic-compatible endpoints. Pin a known-good version and test tool declarations and reasoning params after every upgrade.
- **If you rely on router failure observability for images**: this was broken and is being repaired across several PRs (#49349, #47097, #47310). Budget/RPM/cooldown refusals previously left no Langfuse/OTel trace — expect gaps in historical dashboards.
- **Rust router is coming, but is opt-in.** Set expectations with your platform team that `LITELLM_RUST` is a new toggle with a Python fallback at construction, not a drop-in runtime switch — configs it can't serve are silently delegated. Docs on the new architecture land in #49235.
- **`a2a` agent billing changes** (#49150): if you were relying on $0 spend rows for bridged agents as a safety net, expect real billing under `a2a_agent/<agent name>` once this lands.

</details>

<details>
<summary><strong>Unsloth</strong> — <a href="https://github.com/unslothai/unsloth">unslothai/unsloth</a></summary>

# Unsloth Digest — 2026-10-31

## 1. Today's Highlights
Unsloth shipped **v0.1.913-beta**, headlined by UI/UX customization (custom backgrounds), faster app update times, and notably faster Qwen-Image generation under limited VRAM. On the kernel side, maintainer **danielhanchen** opened [PR #16071](https://github.com/unslothai/unsloth/pull/16071), fixing a LoRA precision bug where the rank-r update was being rounded away when smaller than half a bf16 step — a real correctness improvement for early-stage and small-rank training. Issue volume remains high (43 updated in 24h), with a cluster of audio-VLM chat/training PRs landing for LFM3-Audio and LFM3-Omni.

## 2. Releases & Breaking Changes
- **[v0.1.913-beta](https://github.com/unslothai/unsloth/releases)** — Custom backgrounds + improved UI/UX; reduced app update times; faster Linux app startup; Qwen-Image generation speedup under limited VRAM; adds **DeepSeek-V4.1-Flash-1017** to Unsloth Dynamic v3.1 GGUF previews ([docs](https://unsloth.ai/docs/models/deepseek-v4.1-flash)).
- ⚠️ **Potential incident-level regression (unconfirmed by maintainers):** isolated installs via `UNSLOTH_STUDIO_HOME=<path> ./install.sh --local` reportedly silently overwrite the existing baseline venv. Filed twice: [#16186](https://github.com/unslothai/unsloth/issues/16186), [#16185](https://github.com/unslothai/unsloth/issues/16185). **No fix PR identified yet** — treat multi-tenant/isolated Studio homes as unsafe until addressed.

## 3. New Model & Hardware Support
- **DeepSeek-V4.1-Flash-1017** GGUF support (Dynamic v3.1 quant preview) in v0.1.913-beta.
- **LFM3-Audio-2B** (audio-in/text-out) chat support: [PR #16243](https://github.com/unslothai/unsloth/pull/16243) replaces a prior load-refusal path, stacked on [PR #16242](https://github.com/unslothai/unsloth/pull/16242) which enables LFM3-Omni audio input, export, LoRA defaults and Stop for custom-code generate.
- **Audio-VLM training fix:** [PR #16124](https://github.com/unslothai/unsloth/pull/16124) addresses mixed audio+image datasets being silently trained on audio+text only (`pre_detect` set `is_vlm=False`); images never reached the model.
- **Gemma 3 attention path:** [PR #16041](https://github.com/unslothai/unsloth/pull/16041) proposes generating on the non-flex attention path rather than `flex_attention`'s fallback.

## 4. Performance & Optimization
- **LoRA kernel precision fix** ([PR #16071](https://github.com/unslothai/unsloth/pull/16071)): the fused kernels (`LoRA_MLP`, `LoRA_QKV`, `LoRA_W` via `matmul_lora`) previously computed the base GEMM, rounded to bf16, then added the rank-r term in a second pass and rounded again — discarding updates smaller than half a bf16 step. Relevant for small-rank LoRA and early training dynamics.
- **Gemma 3 flex vs SDPA:** per [PR #16041](https://github.com/unslothai/unsloth/pull/16041), flex_attention is much faster for long-prompt prefill but still slower than SDPA for one-token decode; prior PRs #16049 and #16073 keep flex compiled on L4/A10/RTX 3090/4090/L40S across prompt orders and batch sequences (torch 2.10–2.14.1).
- **MCP token overhead:** [PR #15629](https://github.com/unslothai/unsloth/pull/15629) adds per-tool MCP switches — with all 23 tools enabled, agents spend ~18k tokens on tool definitions before doing any work.

## 5. Stability & Regressions (ranked)
1. **Critical — venv overwrite on isolated install** ([#16186](https://github.com/unslothai/unsloth/issues/16186), [#16185](https://github.com/unslothai/unsloth/issues/16185)): `UNSLOTH_STUDIO_HOME` isolation broken; no fix PR yet. Reproduced twice.
2. **High — Windows+AMD commit charge leak** ([#16015](https://github.com/unslothai/unsloth/issues/16015)): llama-server holds ~16 GB commit charge after loading GGUF despite "Don't reserve system RAM"; commit limit exhausted.
3. **High — MLX memory estimator wildly wrong** ([#15935](https://github.com/unslothai/unsloth/issues/15935)): reports 69.7 GiB for a model that loads on a 24 GB Mac. Closed.
4. **High — LFM3-Omni load failures on AMD/Vulkan** ([#16065](https://github.com/unslothai/unsloth/issues/16065) video input; [#16054](https://github.com/unslothai/unsloth/issues/16054) safetensors). Both closed.
5. **Medium — Linux theme change kills WebKitWebProcess** ([#16028](https://github.com/unslothai/unsloth/issues/16028)); AppImage UI lag ([#15999](https://github.com/unslothai/unsloth/issues/15999)); spell check dead on Linux ([#16184](https://github.com/unslothai/unsloth/issues/16184)).
6. **Medium — MLX models missing from `/v1/models`** ([#15832](https://github.com/unslothai/unsloth/issues/15832)); Dolphin Venice MLX rendering broken ([#15858](https://github.com/unslothai/unsloth/issues/15858)).
7. **Low/functional — context non-compaction on long chats** ([#15800](https://github.com/unslothai/unsloth/issues/15800)); attachments unreadable after auto-compaction ([#14708](https://github.com/unslothai/unsloth/issues/14708)); `search_conversation` tool disappeared ([#16187](https://github.com/unslothai/unsloth/issues/16187)); image gen 404 after cached gated model load ([#16178](https://github.com/unslothai/unsloth/issues/16178)); ModelScope >50 GB downloads blocked ([#15989](https://github.com/unslothai/unsloth/issues/15989)).
8. **Test-suite breakage on main:** [PR #16246](https://github.com/unslothai/unsloth/pull/16246) (gpt-oss quant state), [PR #16244](https://github.com/unslothai/unsloth/pull/16244) (GRPO host-syncs), [PR #16236](https://github.com/unslothai/unsloth/pull/16236) (hub source env) — all have fix PRs open.

## 6. What This Means for Application Developers
- **Upgrade to v0.1.913-beta** for Qwen-Image throughput under VRAM pressure and faster app updates, but **avoid relying on `UNSLOTH_STUDIO_HOME` for install isolation** until #16185/#16186 are resolved — a critical path if you run multi-tenant Studio instances.
- **If you expose MCP tools to agents, watch PR #15629.** Toggling off unused tools is the single highest-leverage change to reclaim context budget (~18k tokens currently spent on definitions before any reasoning).
- **LoRA fine-tuners on small ranks should track PR #16071** — silent rounding of sub-bf16 updates can mask learning signal early in training; re-verify training curves once merged.
- **Mixed-modality dataset pipelines should validate** that audio+image samples actually reach the vision tower; PR #16124 confirms this silently failed. If you build on LFM3-Audio/Omni, PRs #16242/#16243 are the paths to working audio chat.
- **Windows + AMD users:** budget for higher commit charge (see #16015); 32 GB RAM systems may hit commit limits with mid-size GGUFs even with RAM reservation disabled.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*