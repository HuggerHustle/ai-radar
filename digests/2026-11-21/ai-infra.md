# AI Infrastructure Digest 2026-11-21

> Generated: 2026-11-21 02:06 UTC | Projects covered: 6

- [vLLM](https://github.com/vllm-project/vllm)
- [SGLang](https://github.com/sgl-project/sglang)
- [llama.cpp](https://github.com/ggml-org/llama.cpp)
- [Ollama](https://github.com/ollama/ollama)
- [LiteLLM](https://github.com/BerriAI/litellm)
- [Unsloth](https://github.com/unslothai/unsloth)

---

## Cross-Project Comparison

# Cross-Project Comparison Report — AI Infrastructure Ecosystem
**Date: 2026-11-21**

---

## 1. Ecosystem Overview

Today's digest cycle shows the AI infrastructure stack entering a **consolidation-and-hardening phase** rather than one of broad architectural expansion. All six projects are mid-release-train with no mature stable releases in the last 24h, and the dominant activity is bug triage, regression chasing, and correctness fixes rather than headline new capabilities. The same models — **Inkling 2 Mini**, GLM-5.3-Flash, Qwen3.x, DeepSeek-V4 — appear simultaneously across vLLM, SGLang, llama.cpp, Ollama, and Unsloth, confirming that model releases now propagate down the entire stack within days. The recurring failure classes are also converging: **FP8/dtype-scale correctness under reload, hybrid-state (Mamba/GDN/KDA) cache handling, silent stream termination, and speculative-decoding crashes** show up across multiple projects, suggesting the ecosystem has hit a shared set of hard problems that no single engine has solved cleanly. Meanwhile, **agent/MCP workloads** have become the reference use case driving optimizations (prompt reuse, tool-call parsers, prefix caching) rather than traditional chat serving.

---

## 2. Activity Comparison

| Project | Layer | Issues Updated | PRs Updated | Releases (24h) | Release Status |
|---|---|---|---|---|---|
| **vLLM** | Serving engine | 186 | 500 | None | Deprecating TorchAO (v0.37 removal) |
| **SGLang** | Serving engine | 76 | 500 | None | Q4 PD-disagg roadmap active |
| **llama.cpp** | Local runtime | High (not enumerated) | High (not enumerated) | b12588–b12600 (multiple) | Rapid build cadence, `ggml_ftype` deprecation |
| **Ollama** | Local runtime | Moderate | Moderate | None | Preview channel flag pending |
| **LiteLLM** | LLM gateway | Moderate | Moderate | v1.111.0-rc.3, v1.110.2, v1.108.14 (LTS), v1.106.12 | Dual main/LTS train, shipping today |
| **Unsloth** | Fine-tuning / Studio | Moderate | Moderate | v0.1.921-beta, v0.1.922-beta | Beta cadence, 0.1.920 crash open |

**Reading:** vLLM and SGLang are the highest-throughput projects by raw activity (500 PRs each touched), reflecting both scale and churn. llama.cpp remains the only project shipping true binaries at high frequency. LiteLLM is the only project with a formal LTS line. Ollama and Unsloth run leaner queues dominated by desktop/UX bugs.

---

## 3. Model Support Race

| Model / Architecture | vLLM | SGLang | llama.cpp | Ollama | Unsloth | LiteLLM |
|---|---|---|---|---|---|---|
| **Inkling 2 Mini** | — | — | ✅ Native (b12600) | ✅ MLX runner (PR #19799) | ✅ Shipped (0.1.921/922) | — |
| **Qwen3.5 / 3.6 / 3.8** | ⚠️ FP8 load fails on ROCm | ✅ Active (mamba dtype bug) | ✅ Qwen3-ASR converter | ✅ Qwen3.8 renderer bug | ✅ MCP tool catalogs | — |
| **GLM-5.3-Flash** | ✅ Tracker #57406 | ✅ Hopper/SM120 tracker | ⚠️ Long-prefill crash | — | — | — |
| **DeepSeek-V4.x** | ⚠️ TP hang, SM120 issues | — | — | — | — | — |
| **Gemini Live Avatar** | — | — | — | — | — | ✅ PR #53270 |
| **MiniMax-M3 / H3** | — | ✅ AMD sparse + AdaLN | — | — | — | — |
| **Nano Banana 2.1** | — | — | — | — | — | ✅ PR #50709 |

**Who's ahead:** **llama.cpp, Ollama, and Unsloth** are the fast movers on brand-new architecture support (Inkling 2 Mini landed in all three roughly simultaneously), because local runtimes can afford to ship day-0 with known-good caveats. **vLLM and SGLang** are the depth leaders — they cover hybrid-state MoE models (GLM-5.3, Qwen3.x) with disaggregation and speculative decoding, but pay for it in ROCm/FP8 load failures. **LiteLLM** competes on a different axis: it's tracking *provider-side* model launches (Gemini, Bedrock, Cohere), not model architectures, and is generally last to know when a provider endpoint shape changes.

---

## 4. Performance Frontier

Optimization effort is concentrated in five distinct battlegrounds today:

- **KV cache & prefix reuse** — the single densest area. vLLM: HiSparse buffer reuse (#69059), Mooncake descriptor batching (#68994), prefix-cache stats fix (#66720), prompt-shape sensitivity (PR #66683). SGLang: HiCache L3/CP prefetch stall (#51608), hybrid cache boundary bug (#51901). Ollama: MLX inactive-conversation persistence (#19745). llama.cpp: QSA k-pool scoping (#32519).
- **Quantization** — widening and hardening. llama.cpp adds `JQ2_K`–`JQ6_K` and `IQ2/3_NL`; Unsloth fixes non-CUDA BF16 export downgrade (#18712); vLLM deprecates TorchAO (#69066); SGLang replaces env-var FP4 selection with `--fp4-gemm-backend` (#43360).
- **Distributed serving / PD disaggregation** — SGLang's Q4 PD roadmap (#43699) and scheduler GC freezer (#51988) are the most aggressive; vLLM ships NIXL P/D for HY4-Flash (#68609) and re-queueing fixes for async KV pulls (#62532).
- **Kernels & attention** — fused CUDA GDN MTP decode (vLLM #69065), ROCm FP8 Triton prefill (vLLM #62913), Metal fused MUL/ADD (llama.cpp #32300), MiniMax sparse decode (SGLang #51976, #50621).
- **Routing & gateway throughput** — LiteLLM's `least-busy` starvation (#39322) is a decade-old class of bug still unresolved; JWKS resilience (#52975) is the meaningful gateway-side perf/correctness win.

**Notable divergence:** vLLM and SGLang are optimizing for **multi-tenant, disaggregated, agent-heavy fleets**. llama.cpp and Ollama optimize for **single-node and unified-memory Macs**. LiteLLM optimizes the **hop between client and engine**, which is increasingly where cost accounting — not latency — breaks.

---

## 5. Layer Positioning

| Layer | Projects | Primary Responsibility | Current Pain |
|---|---|---|---|
| **Serving engine** | vLLM, SGLang | High-throughput multi-GPU inference, PD disagg, spec decoding | Hybrid-state cache correctness, FP8 scale reload, ROCm parity |
| **Local runtime** | llama.cpp, Ollama | CPU/GPU/Apple Silicon single-node inference, GGUF/quantized models | Model-day-0 breakage, silent stream termination |
| **LLM gateway** | LiteLLM | Auth, cost accounting, routing, provider translation, MCP | Translation-layer correctness, spend-log leakage |
| **Training/fine-tuning** | Unsloth | QLoRA/LoRA, Studio Desktop, export pipelines | ROCm/RDNA4 kernel faults, desktop crashes |

The boundaries are stable but **pressured from both ends**: vLLM and SGLang are absorbing features (MCP, Rust frontends, structured output) that used to be gateway territory; Unsloth's MCP chat fixes and Ollama's tool-call parsing push agent plumbing down into local runtimes. LiteLLM's moat is increasingly **enterprise governance** (LTS, spend logs, guardrails) rather than routing itself.

---

## 6. Trend Signals

1. **Hybrid-state models (Mamba/GDN/KDA) are the new correctness frontier.** Four independent issues across vLLM and SGLang (#51531, #51608, #51901, #51628) share the same root shape: cache/state boundaries mishandled under prefix reuse and context parallelism. This class is not yet well-tested in CI anywhere.

2. **FP8 KV-cache and weight-reload flows are silently unsafe by default.** vLLM RFC #54477 and PRs #69050/#69051 show CUDA graphs replaying stale startup scales after RL weight updates. Anyone running online-RL or dummy-start-then-real-weights should treat this as a live correctness bug.

3. **Silent stream termination is epidemic in local runtimes.** Ollama alone has three open issues (#19792, #18359, #19804) where HTTP 200 masks truncated output. Client-side `done: true` / `[DONE]` validation is now a requirement, not a nicety.

4. **Quantization backends are churning.** TorchAO deprecated in vLLM (#69066), new llama.cpp quants (`JQ*`), SGLang FP4 flags. Expect checkpoint compatibility matrices to change materially through Q1 2027.

5. **Agent/MCP workloads drive the roadmap now.** LiteLLM's MCP tool-name overflow (#53269), Unsloth's MCP prompt-reuse fix, and Ollama's tool-call ordering fix all target the same workload. Prompt-shape sensitivity (vLLM #66683) means **prefix truncation strategy is a first-class application concern**.

6. **Security surface is expanding at the edges.** SGLang video endpoint SSRF (#51701), Ollama installer SHA-256 gap (#19787), Unsloth Studio firewall/sandbox PRs (#18548, #18694). Local runtimes and gateways are now in scope for supply-chain and SSRF reviews that were previously only a serving-engine concern.

### What application/agent developers should watch

- **Pin to LTS (LiteLLM), pin to known-good RC (Ollama/Unsloth), and validate `finish_reason`/`[DONE]` client-side across every provider** — silent-truncation and empty-content bugs span three of six projects today.
- **If you run hybrid-state models with prefix caching or agent replay, freeze the image and re-validate per release.** This is the highest-density regression class in the ecosystem right now.
- **If you reload weights into a live engine (RL, hot-swap, A/B), audit FP8 KV scales.** vLLM's fixes are the load-bearing ones; SGLang's chunked-weight-update bug (#51430) is the analogous failure mode there.
- **MCP is now a first-class integration path** across LiteLLM, Unsloth, and llama.cpp. Tool-catalog sizes, name-length limits (64 char on Claude/Bedrock), and OAuth concurrency are the near-term sharp edges.
- **ROCm/RDNA4 and Blackwell SM120 remain second-class citizens** for training and certain serving paths. Plan hardware fallbacks explicitly rather than assuming eventual parity.

---

*Report compiled from 2026-11-21 project digests. Issue/PR counts reflect activity in the prior 24h and are not directly comparable across projects due to differing triage and labeling practices.*

---

## Per-Project Reports

<details>
<summary><strong>vLLM</strong> — <a href="https://github.com/vllm-project/vllm">vllm-project/vllm</a></summary>

# vLLM Digest — 2026-11-21

## 1. Today's Highlights

No new releases landed in the last 24h, but issue and PR activity remains heavy: **186 issues** and **500 PRs** were updated. The dominant themes are **FP8 KV-cache scale correctness under weight reload** (RFC #54477 follow-ups, PRs #69050/#69051), **ROCm/AMD performance and quality trackers** (Qwen3.8-Flash-Next on MI355X, Muse Spark on gfx942, weekly Kimi verification CI), and a steady stream of **speculative-decoding crashes** (MTP illegal memory access, TP worker hangs). On the positive side, several concrete perf PRs landed in progress: fused CUDA MTP decode for GDN, batched Mooncake KV descriptors, and FP8 Triton prefill attention on ROCm.

## 2. Releases & Breaking Changes

- **No new releases** in the last 24h.
- **Deprecation: TorchAO quantization backend** — PR [#69066](https://github.com/vllm-project/vllm/pull/69066) starts deprecation of `quantization="torchao"` with a per-process warning, targeted for removal in **v0.37** (tracker [#69030](https://github.com/vllm-project/vllm/issues/69030)). Docs and quantization index are updated to reflect this.
- **SageMaker HTTP integration now optional** — PR [#68638](https://github.com/vllm-project/vllm/pull/68638) adds a Python frontend flag to skip SageMaker route registration/bootstrap for standalone deployments (RFC [#68616](https://github.com/vllm-project/vllm/issues/68616), migration item SERVE-3).
- **Envvar cleanup RFC still open** — [#25700](https://github.com/vllm-project/vllm/issues/25700) continues to push envvars (attention backend, all2all kernel backend, KV cache layout) into first-class configs. Expect gradual config-surface churn.

## 3. New Model & Hardware Support

- **HY4-Flash + NIXL P/D disaggregation** — PR [#68609](https://github.com/vllm-project/vllm/pull/68609) enables NIXL pull-mode prefill/decode disaggregation for HY4-Flash, reusing existing hybrid KV cache and connector infrastructure.
- **ROCm FP8 Triton prefill attention (gfx942)** — PR [#62913](https://github.com/vllm-project/vllm/pull/62913) routes head-dim-256 prefill/extend (q ≥ 2048 tokens) through aiter's Triton MHA on per-tensor FP8 q/k/v. Reported faster on MI300X with FP8 KV cache vs. the current CK bf16 path.
- **GDN 16-bit recurrent state** — PR [#69065](https://github.com/vllm-project/vllm/pull/69065) adds FP16 state support to the fused CUDA GDN MTP decode kernel; `--mamba-ssm-cache-dtype float16` no longer falls back to Triton.
- **Qwen3.6 MoE CT INT4 checkpoint compatibility gap** — [#68336](https://github.com/vllm-project/vllm/issues/68336): `mattbucci/Qwen3.6-35B-A3B-AWQ-CT` stores `shared_expert_gate` as packed INT4, but vLLM's native model registers a float `weight`; loader raises `ValueError` on `weight_packed`. No fix PR yet.
- **ROCm Qwen3.8-Flash-Next-FP8 load failure** — [#58688](https://github.com/vllm-project/vllm/issues/58688): AMD `Qwen4ExpNGramEmbedding` lacks an FP8 `weight_scale`, blocking load on MI325X/gfx942.

## 4. Performance & Optimization

- **Fused CUDA MTP decode for GDN (16-bit state)** — PR [#69065](https://github.com/vllm-project/vllm/pull/69065): warp-shuffle-limited path rewritten for FP16 state; adds FP16 support alongside the existing BF16 fast path.
- **Mooncake KV transfer descriptor batching** — PR [#68994](https://github.com/vllm-project/vllm/pull/68994): batches producer-side address calculation across consecutive same-layout regions (extends [#62478](https://github.com/vllm-project/vllm/pull/62478)). H200 host-CPU descriptor build time reduced; H2D copy path tightened.
- **HiSparse: reuse GPU Main KV buffers across prefill layers** — PR [#69059](https://github.com/vllm-project/vllm/pull/69059): targets multi-turn agent workloads where prefix hits save recompute but Main KV still occupies per-layer memory on a dedicated prefill worker.
- **`vllm bench serve` steady-state metrics** — PR [#68226](https://github.com/vllm-project/vllm/pull/68226): reports steady-state throughput/TTFT/TPOT for closed-loop runs, matching the Rust `vllm-bench` behavior ([#48107](https://github.com/vllm-project/vllm/issues/48107)); avoids startup-burst skew.
- **KV cache view re-derivation (Triton/eager backends)** — [#64572](https://github.com/vllm-project/vllm/issues/64572) flags that K/V cache views (`transpose(1,2).split(...)` + stride canonicalization) are rebuilt on every attention call despite depending only on storage/shape/strides — same class of issue as [#59534](https://github.com/vllm-project/vllm/issues/59534).
- **Online LUT-B codebook fitting** — PR [#68537](https://github.com/vllm-project/vllm/pull/68537): replaces Lloyd iterations with exact weighted k-means via dynamic programming in a fused Triton kernel for `--quantization lut_b_moe`.
- **GLM-5.3 optimization tracker** — [#57406](https://github.com/vllm-project/vllm/issues/57406): same `glm_moe_dsa` base as 5.2, so prior optimizations carry over; further CUDA work scoped.
- **ROCm trackers**: Qwen3.8-Flash-Next on MI355X/gfx950 ([#59575](https://github.com/vllm-project/vllm/issues/59575)) and Muse Spark Open PTPC-FP8 on gfx942 ([#64018](https://github.com/vllm-project/vllm/issues/64018)) list concrete uplift items with expected gains.

## 5. Stability & Regressions

Ranked by severity:

1. **MTP speculative decoding crash — illegal memory access on long sequences** — [#40756](https://github.com/vllm-project/vllm/issues/40756) (46 comments, still open since April): Qwen3.6-27B-FP8, `num_spec_tokens=5`, v0.19.1. Highest-engagement bug on the board; no fix PR referenced.
2. **SM120 (RTX PRO 6000 Blackwell) CUDA graph capture unusable** — [#56892](https://github.com/vllm-project/vllm/issues/56892): DeepSeek-V4.1-Flash day-0 image on 8×TP; `--enforce-eager` gives extremely low decode throughput, graphs fail to capture. Requested as a priority fix.
3. **Kimi-K3 CUDA graph capture silently corrupts output at batch=1** — [#52531](https://github.com/vllm-project/vllm/issues/52531): three distinct failure modes across cudagraph modes. Silent corruption is the worst class here.
4. **FP8 KV-cache scale staleness under weight reload (RL flow)** — PRs [#69050](https://github.com/vllm-project/vllm/pull/69050) (MLA decode) and [#69051](https://github.com/vllm-project/vllm/pull/69051) (FULL-graph decode) fix graphs that captured startup scales as host values and silently used wrong ones after a weight update. Part of RFC [#54477](https://github.com/vllm-project/vllm/issues/54477).
5. **TP worker hang → EngineDeadError** — [#41530](https://github.com/vllm-project/vllm/issues/41530): `RPC call to sample_tokens timed out` with DeepSeek-V4-Pro, TP=8, MTP spec decoding.
6. **MTP draft allocates second full vocab embedding → OOM** — [#53887](https://github.com/vllm-project/vllm/issues/53887): 27B INT4 target fits without MTP but OOMs with it, on a 24 GiB RTX 3090.
7. **W4A16 HummingLinearKernel non-determinism across processes** — [#66232](https://github.com/vllm-project/vllm/issues/66232): faster than Machete on H100/sm_90 but results vary across processes. Batch-invariance concern for reproducibility-sensitive workloads.
8. **Qwen3 parser turns quoted tool-call markup into real tool calls** — [#58147](https://github.com/vllm-project/vllm/issues/58147): parser emits tool calls for names outside `request.tools` and duplicates of offered ones. Agent-facing correctness issue.
9. **`tools` + `response_format` under `tool_choice="auto"` — Python and Rust frontends disagree** — [#66858](https://github.com/vllm-project/vllm/issues/66858): opposite behavior for the same request. RFC open.
10. **Prefix cache stats wrong for `n>1` prefill** — PR [#66720](https://github.com/vllm-project/vllm/pull/66720): non-streaming responses reported `cached_tokens` from the last sibling, inflating apparent cache hits.
11. **Filesystem KV offload tier lacks I/O liveness bounds** — [#54363](https://github.com/vllm-project/vllm/issues/54363): no integrity verification and no bound on single I/O operation duration; builds on the partial-keep contract from [#49328](https://github.com/vllm-project/vllm/issues/49328).
12. **V1 scheduler: 1.0–1.8s re-queueing stall for completed async KV pulls** — [#62532](https://github.com/vllm-project/vllm/issues/62532): RFC proposes front-of-queue re-admission for `OffloadingConnector`/`NixlConnector` flows.
13. **`libcudart.so.13` import failure** — [#52300](https://github.com/vllm-project/vllm/issues/52300) (CUDA 12.6 env, vLLM 0.21.0 pip install) and **`ParallelLMHead.output_size_per_partition` AttributeError** — [#52434](https://github.com/vllm-project/vllm/issues/52434) (aarch64). Both stale-tagged, likely environment-specific.

## 6. What This Means for Application Developers

- **Agent workloads have two concrete footguns this week.** First, the Qwen3 tool-call parser ([#58147](https://github.com/vllm-project/vllm/issues/58147)) can emit tool calls the model merely *quoted* — validate tool names against your allowlist server-side. Second, Python and Rust frontends disagree on `tools` + `response_format` under `tool_choice="auto"` ([#66858](https://github.com/vllm-project/vllm/issues/66858)); pin one frontend or set `tool_choice` explicitly.
- **Prefix cache hit rates are sensitive to prompt shape.** PR [#66683](https://github.com/vllm-project/vllm/pull/66683) documents that dropping or rewriting an early message changes the hash of every later block — 9% vs 99% cache hit in the example. If you shrink context in agent loops, truncate from the *end* of history, not the middle.
- **RL / weight-reload users: audit your FP8 KV scales.** If you reload weights into a running engine (dummy-start-then-real-weights flow), the fixes in [#69050](https://github.com/vllm-project/vllm/pull/69050) and [#69051](https://github.com/vllm-project/vllm/pull/69051) are directly relevant — before them, CUDA graphs could silently replay startup FP8 KV scales. Track RFC [#54477](https://github.com/vllm-project/vllm/issues/54477).
- **Blackwell SM120 users should stay off CUDA graphs** for DeepSeek-V4.1-Flash until [#56892](https://github.com/vllm-project/vllm/issues/56892) is resolved, but note `--enforce-eager` itself has a severe decode-throughput penalty — size your fleet accordingly or fall back to Hopper for that model.
- **`torchao` quantization users should plan a migration.** Deprecation warning lands now, removal in v0.37 ([#69066](https://github.com/vllm-project/vllm/pull/69066)). If you have torchao checkpoints in production, start evaluating compressed-tensors or AWQ alternatives.
- **Standalone (non-SageMaker) deployments get a cleaner frontend.** [#68638](https://github.com/vllm-project/vllm/pull/68638) lets you skip SageMaker routes/bootstrap entirely — worth enabling if you're behind your own ingress.
- **Benchmarking gets more trustworthy.** [#68226](https://github.com/vllm-project/vllm/pull/68226) adds steady-state metrics to `vllm bench serve`; use it instead of full-run numbers when comparing configurations with `--request-rate inf`.

</details>

<details>
<summary><strong>SGLang</strong> — <a href="https://github.com/sgl-project/sglang">sgl-project/sglang</a></summary>

# SGLang Digest — 2026-11-21

## Today's Highlights

No new releases landed in the last 24h, but issue and PR activity is heavy (76 issues, 500 PRs touched), with the Q4 Prefill-Decode Disaggregation roadmap (#43699) and GLM-5.3-Flash Hopper/SM120 perf tracking (#45373) advancing in public. On the correctness side, a new mamba-SSM dtype regression (#51531) and a HiCache L3/CP prefetch stall (#51608) are the most actionable reports for anyone running GLM-5.3 or Qwen3.x on hybrid-state models. AMD and diffusion users also get a cluster of landed/queued fixes around LoRA key mapping, fp4 GEMM backend selection, and host-side image tails.

## Releases & Breaking Changes

None in the last 24h. Two behavioral changes are queued but not yet merged, worth watching before upgrading:

- **[PR #51946](https://github.com/sgl-project/sglang/pull/51946)** — `rust-server: /internal/peer` will only accept requests from the launch's own listeners. If you script against the Rust server's internal control route, this closes that surface.
- **[PR #51957](https://github.com/sgl-project/sglang/pull/51957)** — `shortest-prefill-first` gains a load-scaled class boundary and token budget, changing when long prompts are admitted under sustained short traffic.

## New Model & Hardware Support

- **MiniMax-M3 sparse attention (AMD)** — [PR #47906](https://github.com/sgl-project/sglang/pull/47906) persists Triton autotune results across restarts by setting `cache_results` on the 9 `@triton.autotune` decorators under `minimax_sparse/`. Restart times drop materially for MiniMax-M3 on ROCm.
- **Blackwell split-BF16 router** — [PR #51989](https://github.com/sgl-project/sglang/pull/51989) lifts the SM90-only restriction on `muse_spark`'s split-BF16 router; SM100 no longer falls back to `F.linear` (measured as TF32 on an FP32 copy) above `_FP32_ROUTER_MAX_TOKENS`.
- **Quark MXFP4 on ROCm** — [PR #43360](https://github.com/sgl-project/sglang/pull/43360) adds `--fp4-gemm-backend aiter|triton` for dense MXFP4 GEMMs, replacing the `SGLANG_ROCM_USE_AITER_FP4_ASM_GEMM` env var. Supersedes [PR #39598](https://github.com/sgl-project/sglang/pull/39598).
- **Qwen4-Exp / QSA sparse decode** — [PR #51976](https://github.com/sgl-project/sglang/pull/51976) adds an opt-in FlashInfer prims-ts sparse decode backend on SM100, skipping the `fused_kv_prepare` scratch copy.

## Performance & Optimization

- **Scheduler GC on busy PD prefill** — [PR #51988](https://github.com/sgl-project/sglang/pull/51988) extends `GCFreezer` (#50883) to freeze the GC heap every N batches under sustained load, not just on idle. Default off.
- **Qwen-VL preprocess TTFT** — [PR #51867](https://github.com/sgl-project/sglang/pull/51867) stops calling `_release_preprocess_cache()` after every image preprocess; the previous check read `torch.cuda.memory_reserved()/allocated()` on the request path on every request.
- **MiniMax-H3 AdaLN memoization** — [PR #51965](https://github.com/sgl-project/sglang/pull/51965) caches the 2688×96768 BF16 AdaLN projection per timestep set across requests sharing a schedule. Cited as 50 weight-bandwidth-bound GEMVs per DiT step, 520 MB read each.
- **MiniMax-H3 output resize on GPU** — [PR #51825](https://github.com/sgl-project/sglang/pull/51825) moves the Pillow LANCZOS downscale of oversized generations onto the GPU.
- **PD spec-prefill poll** — [PR #51986](https://github.com/sgl-project/sglang/pull/51986) allows disabling `SGLANG_DISAGG_PREFILL_POLL_TRANSFERS_WHILE_WAITING` (#47015) so the prefill loop retires KV transfers once per iteration rather than polling.
- **NemotronH Mamba2 prefill** — [PR #51984](https://github.com/sgl-project/sglang/pull/51984) precompiles `_chunk_scan_fwd_kernel` before serving; the issue [PR #51628](https://github.com/sgl-project/sglang/issues/51628) records 1.45 s compile stalls × 2–3 per rank on the first large prefill.
- **DFlash2 candidate selection** — [PR #50621](https://github.com/sgl-project/sglang/pull/50621) fuses top-K selection, cross-rank merge, K×K lattice, and walk on SM100. Stacked on [#50620](https://github.com/sgl-project/sglang/pull/50620).

## Stability & Regressions

Ranked by impact for production serving:

1. **HiCache L3 prefetch stalls under context parallelism** — [#51608](https://github.com/sgl-project/sglang/issues/51608) (OPEN). With `fast_file` and `attn_cp_size=8`, prefetch never completes, `storage_hit` stays 0 while writes accumulate, and requests are admitted only after the full retry cap. Affects GLM-5.3 MLA/DSA with w4afp8 at TP. No fix PR yet.
2. **Mamba SSM dtype regression** — [#51531](https://github.com/sgl-project/sglang/issues/51531) (OPEN, v0.5.23, unverified on main). `--mamba-ssm-dtype bfloat16` costs ~8 points on long-reasoning MATH-500 with Qwen3.5-9B; float16 does not regress. GSM8K-style checks miss it because they don't exercise long chains. The reporter notes `configs/mamba_utils.py` and `arg_groups/attention_hook.py` are unchanged on `main` as of `cb97061`.
3. **Chunked weight updates can commit partial state** — [#51430](https://github.com/sgl-project/sglang/issues/51430) (OPEN). Cross-tensor loader state is lost between chunks, and partial updates are committed. Relevant to weight-cache/in-place-update workflows, notably for DeepSeek-V4-Flash MXFP4 loading ([#40437](https://github.com/sgl-project/sglang/issues/40437), CLOSED, only after this pattern bites).
4. **HiCache + hybrid cache boundary bug** — [#51901](https://github.com/sgl-project/sglang/issues/51901) (OPEN). At `--hybrid-cache-checkpoints-level 2`, an identical repeat restores 0 tokens when the prior request's decode crossed a Mamba tracking boundary. Directly relevant to agent loops replaying prefixes.
5. **SSRF in `multimodal_gen /v1/videos`** — [#51701](https://github.com/sgl-project/sglang/issues/51701) (OPEN, reported 2026-11-20). Unvalidated `video_path`, `input_reference`/`image_path`, and `control_path` URL params. Multi-tenant deployments of the video endpoint should treat this as a live issue; no fix PR yet.
6. **Idle-burst prefill TTFT** — [#50920](https://github.com/sgl-project/sglang/issues/50920) (OPEN). With consecutive-prefill overlap, the first of N simultaneously arriving requests waits for the next prefill batch, so its TTFT approaches the second request's.
7. **`next_power_of_2` monkeypatch leaks process-wide** — [#48460](https://github.com/sgl-project/sglang/issues/48460) (OPEN). `python/sglang/srt/utils/common.py` replaces `triton.next_power_of_2` at import for the whole process, breaking other Triton kernels hosted in the same Python. Painful if you co-host SGLang with another Triton-using service.

Also closed as inactive in this window: [#46203](https://github.com/sgl-project/sglang/issues/46203) (Xid 13 in HiCache kvcacheio on B200), [#40232](https://github.com/sgl-project/sglang/issues/40232) (HiCache 128 KiB batch path host-VA fault), [#37105](https://github.com/sgl-project/sglang/issues/37105) (GLM-5.3-Flash DSA blockers on sm_120). Treat these as "unfixed after the trial period," not resolved.

## What This Means for Application Developers

- **Hybrid-state models (Mamba/GDN/KDA) are the risk surface right now.** #51531, #51608, #51901, and #51628 all touch cache/state handling on models like Qwen3.5, NemotronH, and GLM-5.3-Flash. If you run those with prefix caching or agent replay, pin your image and validate before rolling forward.
- **Don't use `--mamba-ssm-dtype bfloat16` on reasoning workloads without a targeted eval.** Standard short-answer benchmarks won't catch the reported 8-point MATH-500 regression.
- **The video generation endpoint has an open SSRF.** If `/v1/videos` is reachable from untrusted input, validate URLs in front of it until #51701 lands.
- **ROCm users get real wins this window**: persistent Triton autotune for MiniMax-M3, a working `ROCM_QUICK_REDUCE_QUANTIZATION` path ([PR #48862](https://github.com/sgl-project/sglang/pull/48862)), and a proper `--fp4-gemm-backend` flag rather than an env var. Watch for the internal peer route change in #51946 if you have tooling on the Rust server.
- **PD disaggregation is now the default at scale** per the Q4 roadmap (#43699). If you're still running colocated prefill+decode, the roadmap and the burst-TTFT report (#50920) are the two threads to follow before migrating.

</details>

<details>
<summary><strong>llama.cpp</strong> — <a href="https://github.com/ggml-org/llama.cpp">ggml-org/llama.cpp</a></summary>

# llama.cpp Digest — 2026-11-21

## 1. Today's Highlights

Inkling 2 Mini lands in mainline (b12600) with a new looped architecture, gate_rank metadata, and `is_varloop` support — but a same-day issue (#32707) reports abominable prefill performance and 5090 crashes on the first GGUF quants. GGML is moving toward a major version bump with `ggml_ftype` deprecated (b12591), and a batch of backend work landed across HIP RDNA1 MMVQ, Metal fused MUL/ADD, and Vulkan COL2IM_1D.

## 2. Releases & Breaking Changes

- **b12591 — ggml major version bump reminders + deprecate `ggml_ftype`** ([PR #32647](https://github.com/ggml-org/llama.cpp/pull/32647)). `ggml_ftype` is now deprecated; downstream code embedding the enum should migrate to the newer type/architecture identifiers. Expect a hard break at the next major.
- **b12600 — Inkling 2 Mini** ([PR #32694](https://github.com/ggml-org/llama.cpp/pull/32694)). New `model_type`, `gate_rank` in metadata, loop graph and `is_varloop` attribute; naming follows PR #32588 conventions.
- **b12597 — qwen3-asr converter** ([PR #32571](https://github.com/ggml-org/llama.cpp/pull/32571)). "language ..." output now goes into a thinking block, and the chat template is read from `models/templates` rather than an embedded copy — GGUF conversion output changes for Qwen3-ASR.
- Semver releases (v0.1.0–v1.0.0) still ship **without release binaries** ([issue #32623](https://github.com/ggml-org/llama.cpp/issues/32623)).

## 3. New Model & Hardware Support

- **Inkling 2 Mini** (thinkingmachines) — looped architecture, conversion + graph support ([PR #32694](https://github.com/ggml-org/llama.cpp/pull/32694), released as b12600). Follow-up PR [#32695](https://github.com/ggml-org/llama.cpp/pull/32695) and a scale-pass fix for loop slots in [#32704](https://github.com/ggml-org/llama.cpp/pull/32704). **Inkling 2 DSpark** speculator support is in flight ([PR #32218](https://github.com/ggml-org/llama.cpp/pull/32218)).
- **drama3 voice cloning** in mtmd ([PR #32586](https://github.com/ggml-org/llama.cpp/pull/32586), b12590) — the Fish S2 codec encoder now also serves drama3, sharing audio encoder KV with fish_s2.
- **HIP: RDNA1 MMVQ parameter table** ([PR #32389](https://github.com/ggml-org/llama.cpp/pull/32389), b12599) — 1 warp per block for ncols=1, values written explicitly rather than recursing into the generic table.
- **Vulkan: COL2IM_1D misaligned bytes + split workgroups** ([PR #32673](https://github.com/ggml-org/llama.cpp/pull/32673), b12589).
- **Vulkan: coopmat enabled on Intel Arc Alchemist (Xe1)** ([PR #32706](https://github.com/ggml-org/llama.cpp/pull/32706)) — fixes register spills and other issues that previously made coopmat slower than the default path on A380-class cards.
- **Custom `special_eog_ids`** support: vocab write/read plus list-valued `eos_token_id` from `generation_config.json` ([PR #32091](https://github.com/ggml-org/llama.cpp/pull/32091), fixes [#31618](https://github.com/ggml-org/llama.cpp/issues/31618)).
- **New quantization types (open PRs):** `JQ2_K`–`JQ6_K` across CPU/Metal/CUDA/Vulkan ([#30715](https://github.com/ggml-org/llama.cpp/pull/30715)–[#30718](https://github.com/ggml-org/llama.cpp/pull/30718)); `IQ2_NL`/`IQ3_NL` for non-256-multiple row lengths ([PR #27983](https://github.com/ggml-org/llama.cpp/pull/27983)).

## 4. Performance & Optimization

- **Metal fused MUL/ADD** now accepts the norm chain in either operand ([PR #32300](https://github.com/ggml-org/llama.cpp/pull/32300), b12596) — more fusion opportunities in the graph, fewer dispatches.
- **gemma4: optimized prompt processing for multi-seq queries** ([PR #32342](https://github.com/ggml-org/llama.cpp/pull/32342), b12588) — directly relevant to batched serving.
- **QSA indexer: score only k-pools of ubatch sequences** ([PR #32519](https://github.com/ggml-org/llama.cpp/pull/32519)) — idle sequences in a unified cache no longer contribute indexer work.
- **CPU polling without OpenMP**: proposed fix reduces CPU time ~50% on Linux, ~5x power reduction on M1 in local testing ([PR #32378](https://github.com/ggml-org/llama.cpp/pull/32378), references [#29858](https://github.com/ggml-org/llama.cpp/issues/29858)).
- **`.scale` tensors applied automatically in `build_moe_ffn`** ([PR #32669](https://github.com/ggml-org/llama.cpp/pull/32669)) — removes per-model manual wiring for NVFP4/quantized MoE experts; correctness fix companion for existing models.
- Regression watch: **CUDA ADD/GELU slower on B200 since the PDL commit** ([#30004](https://github.com/ggml-org/llama.cpp/issues/30004), first bad `7b28f950`); **V100 sm_70 prefill regression in v1.0.0 vs v0.8.0** ([#32245](https://github.com/ggml-org/llama.cpp/issues/32245)).

## 5. Stability & Regressions

Ranked by severity:

1. **Inkling 2 Mini prefill abominably slow + crash on RTX 5090** ([#32707](https://github.com/ggml-org/llama.cpp/issues/32707), IQ4_NL). Fresh on b12600 — model is barely usable on high-end Blackwell as released. No fix PR yet; watch [#32704](https://github.com/ggml-org/llama.cpp/pull/32704) for loop-slot scale handling.
2. **Heap OOB write in HRM-Text loader** ([PR #32705](https://github.com/ggml-org/llama.cpp/pull/32705)) — uint64 multiply wraps in `load_arch_hparams()` slot-count check; fix PR open.
3. **CUDA illegal memory access on GLM-5.3-Flash long prefill at `-ub 2048`** ([#28282](https://github.com/ggml-org/llama.cpp/issues/28282), sm_120/Blackwell). Closed as stale but severe if reproducible.
4. **DFlash spec decoding fails with `--split-mode tensor`** — shared `output.weight` in Meta() buffer ([#27833](https://github.com/ggml-org/llama.cpp/issues/27833), 2x RTX 3060).
5. **draft-MTP roughly halves prompt processing on multi-GPU layer split** ([#27428](https://github.com/ggml-org/llama.cpp/issues/27428)) — single GPU unaffected; open.
6. **Segfault after upgrading hip-runtime-amd to 10.1-2.1** ([#32630](https://github.com/ggml-org/llama.cpp/issues/32630), RX 9070 XT).
7. **OpenVINO backend fails on Qwen3.5** — mask shape mismatch on CPU, SIGSEGV on GPU ([#32291](https://github.com/ggml-org/llama.cpp/issues/32291)).
8. **SYCL `-sm tensor` potential memory leak** during token gen on dual Intel B70 ([#27845](https://github.com/ggml-org/llama.cpp/issues/27845)).
9. **POWER10 llamafile sgemm (MMA) corrupts Flint MoE output** — correct with `GGML_LLAMAFILE=OFF` ([#31680](https://github.com/ggml-org/llama.cpp/issues/31680)).
10. **json-schema-to-grammar**: `enum`/`const` discard sibling constraints, admitting invalid enum members ([#30750](https://github.com/ggml-org/llama.cpp/issues/30750)) — correctness issue for constrained decoding.

Also of note: **SIGTERM handling in llama-server** — second SIGTERM calls `exit()` from the handler and can deadlock in glibc `free()` ([#29581](https://github.com/ggml-org/llama.cpp/issues/29581)); RPC client occasionally ignores SIGTERM entirely ([#29933](https://github.com/ggml-org/llama.cpp/issues/29933)).

## 6. What This Means for Application Developers

- **Don't ship Inkling 2 Mini yet.** The architecture support just merged, but the first GGUF quant (IQ4_NL) crashes and prefills poorly on 5090 ([#32707](https://github.com/ggml-org/llama.cpp/issues/32707)). Wait for the loop-slot scale fix ([#32704](https://github.com/ggml-org/llama.cpp/pull/32704)) and quant re-uploads.
- **Plan for the ggml major bump.** `ggml_ftype` is deprecated ([#32647](https://github.com/ggml-org/llama.cpp/pull/32647)); anyone building custom tooling, bindings, or GGUF post-processors against the ggml C API should pin a commit and schedule migration now.
- **MoE quantized serving gets simpler.** Automatic `.scale` application in `build_moe_ffn` ([#32669](https://github.com/ggml-org/llama.cpp/pull/32669)) removes a class of per-model wiring bugs — good news if you maintain forks or custom architectures.
- **Multi-seq and agent workloads benefit.** gemma4 multi-seq prompt processing ([#32342](https://github.com/ggml-org/llama.cpp/pull/32342)) and the QSA k-pool scoping ([#32519](https://github.com/ggml-org/llama.cpp/pull/32519)) both target the exact pattern of long-lived shared caches with many concurrent agent sessions.
- **Watch speculative decoding on multi-GPU.** Both MTP and DFlash have open, unresolved issues on layer-split/tensor-split setups ([#27428](https://github.com/ggml-org/llama.cpp/issues/27428), [#27833](https://github.com/ggml-org/llama.cpp/issues/27833)). If you rely on draft models for latency, validate on your exact split mode before upgrading.
- **Grammar-constrained generation has a known soundness gap.** The `enum`/`const` sibling-constraint bug ([#30750](https://github.com/ggml-org/llama.cpp/issues/30750)) means grammars can admit values your JSON schema rejects — validate outputs server-side if you're using schemas for structured tool calls.
- **SIGTERM robustness matters for orchestrators.** If you run llama-server under Kubernetes or a process supervisor, review [#29581](https://github.com/ggml-org/llama.cpp/issues/29581) and [#29933](https://github.com/ggml-org/llama.cpp/issues/29933); budget for SIGKILL fallbacks in your shutdown path.
- **`--ui-mcp-proxy-allow-private-urls`** ([PR #32633](https://github.com/ggml-org/llama.cpp/pull/32633), b12580) is a new server flag to be aware of if you front MCP tools through llama-server's UI proxy — it gates SSRF-adjacent access to private addresses.

</details>

<details>
<summary><strong>Ollama</strong> — <a href="https://github.com/ollama/ollama">ollama/ollama</a></summary>

# Ollama Digest — 2026-11-21

## 1. Today's Highlights

No new releases landed in the last 24h, but the issue tracker and PR queue are unusually active around **stream integrity and error propagation** in the OpenAI-compatible endpoints — two separate bugs (#19792, #18359) describe streams that silently terminate with HTTP 200 and no `finish_reason`/`[DONE]`, and matching fixes are already open (#19795, #19797, #19791). On the performance side, a long-running VRAM accounting overhaul (#19632) and new MLX parallelism/memory-management work (#19785, #19745) are converging, suggesting the next RC cycle will target multi-GPU correctness and Mac memory behavior.

---

## 2. Releases & Breaking Changes

None in the last 24h. Notable near-term config-adjacent items still in review:

- **`OLLAMA_CHANNEL=preview` installer support** (#19801, closed) — allows `install.sh`/`install.ps1` to pull preview artifacts; stable remains default and `OLLAMA_VERSION` retains precedence. [PR #19801](https://github.com/ollama/ollama/pull/19801)
- **New opt-in metrics env vars** (#19723, closed): `OLLAMA_LOG_METRICS=1` and `OLLAMA_METRICS_LOG_FILE` for per-request JSONL inference metrics. [PR #19723](https://github.com/ollama/ollama/pull/19723)
- **HTTP 429 on runner-slot exhaustion** (#19796, open) — waits for an execution slot now cap at 5 minutes in MLX and llama-server; clients must handle 429 retries. This is a behavioral change for overloaded deployments. [PR #19796](https://github.com/ollama/ollama/pull/19796)

---

## 3. New Model & Hardware Support

- **Inkling 2 Mini** added to the MLX runner (#19799, open). [PR #19799](https://github.com/ollama/ollama/pull/19799)
- **K2 Horizon reasoning tags** — `think: true` was previously rejected for K2 Horizon models; detection added in chat templates (#19161, closed). [PR #19161](https://github.com/ollama/ollama/pull/19161)
- **macOS 12/13 on Intel Macs** — community member has a working build of v0.40.11 for Monterey-era hardware; current official download requires macOS 14 (#19308, open, awaiting maintainer interest). [Issue #19308](https://github.com/ollama/ollama/issues/19308)
- **Alpine Linux** — currently broken: `fcntl64: symbol not found` on musl (#19800, open, no fix yet). [Issue #19800](https://github.com/ollama/ollama/issues/19800)

---

## 4. Performance & Optimization

- **VRAM accounting and GPU splitting overhaul** (#19632, open) — fixes models being incorrectly evicted, refusing to load, or unnecessarily split across GPUs; addresses #19463, #18679, #18349, #16599. This is the highest-impact perf/correctness PR in flight. [PR #19632](https://github.com/ollama/ollama/pull/19632)
- **MLX default parallelism from available memory** (#19785, closed) — when `OLLAMA_NUM_PARALLEL` is unset, selects 1/2/4/8 slots based on free memory and per-client KV estimate at context limit; serial default retained under pressure and on non-MLX backends. [PR #19785](https://github.com/ollama/ollama/pull/19785)
- **MLX inactive conversation cache persistence** (#19745, open) — async checkpointing of completed conversations so state survives memory reclamation, model switching, or runner restart. Directly relevant to long agent sessions on unified-memory Macs. [PR #19745](https://github.com/ollama/ollama/pull/19745)
- **GPU energy-per-response metrics prototype** (#19789, open) — measures energy on four NVIDIA board types; author is asking maintainers whether to land the field at all. [Issue #19789](https://github.com/ollama/ollama/issues/19789)

---

## 5. Stability & Regressions

Ranked by severity:

1. **Cloud `beam` model returns empty content and no `tool_calls`** on any tool-bearing request, regression starting ~Nov 19–20 (#19804, open, zero comments — likely under-triaged). Severity: high for anyone using Ollama Cloud in agent pipelines. [Issue #19804](https://github.com/ollama/ollama/issues/19804)
2. **Silent stream termination on `/v1/chat/completions`** when the Glimmer/ATEM parser raises mid-generation — no `finish_reason`, no `[DONE]`, clients see truncated output (#19792). Fixes open: #19795 (SSE error frame + `[DONE]`) and #19797 (propagate streaming errors). [Issue #19792](https://github.com/ollama/ollama/issues/19792) · [PR #19795](https://github.com/ollama/ollama/pull/19795) · [PR #19797](https://github.com/ollama/ollama/pull/19797)
3. **Native Gemma4 follow-up emits repeated `<unused50>` frames then HTTP 200 EOF without `done:true`** (#18359, open). Client-side detection proposed in #19791 (`io.ErrUnexpectedEOF` on incomplete streams). [Issue #18359](https://github.com/ollama/ollama/issues/18359) · [PR #19791](https://github.com/ollama/ollama/pull/19791)
4. **Runner resurrection race** — concurrent requests can revive an expiring runner, occasionally killing the generate side of the server entirely when a `keep_alive: -1` embedding model coexists with a large completion model (#19794, open, fix proposed). [PR #19794](https://github.com/ollama/ollama/pull/19794)
5. **Qwen 3.8 system-message reordering** — Ollama's renderer moves all system messages to the start, but the model's own template (which is never used) expects exactly one leading system message (#19762, open). Prompt-parity bug for multi-system-message agents. [Issue #19762](https://github.com/ollama/ollama/issues/19762)
6. **MLX runner underutilizing GPU on M4 Pro** — qwen3.8:27b-mxfp8 shows significant slowdown vs. 0.35.1-rc2 on 0.40.0 (#18754, open). [Issue #18754](https://github.com/ollama/ollama/issues/18754)
7. **Windows console flashing** — GPU discovery subprocesses spawn visible console windows during `ollama serve` (#18954, open). Cosmetic but noisy for desktop users. [Issue #18954](https://github.com/ollama/ollama/issues/18954)
8. **Linux installer never verifies `sha256sum.txt`** despite releases publishing it (#19787, open). Supply-chain hygiene gap. [Issue #19787](https://github.com/ollama/ollama/issues/19787)

---

## 6. What This Means for Application Developers

- **Stop trusting HTTP 200 as "complete."** Three independent bugs this cycle (#19792, #18359, #19804) all manifest as valid-looking responses that end early or return empty content. Until #19791/#19795/#19797 land, validate that you received `done: true` / `[DONE]` / a non-empty `finish_reason` before treating output as final — and consider a client-side timeout-plus-retry wrapper.
- **Plan for 429s under load.** If #19796 ships, queueing past 5 minutes returns HTTP 429 rather than blocking indefinitely. Implement exponential backoff on the runner-slot path (`/api/chat`, `/api/generate`, OpenAI-compat).
- **VRAM accounting changes are coming.** #19632 rewrites eviction and GPU-split decisions. If you've tuned `OLLAMA_KEEP_ALIVE`, `OLLAMA_NUM_PARALLEL`, or model-splitting by hand to work around eviction bugs, re-validate after the next RC — your workarounds may become counterproductive.
- **Mac agent apps get more durable sessions.** #19745's checkpoint persistence means long-running conversations on unified-memory Macs should survive model switches without full re-prefill. Watch for it in an MLX-enabled release.
- **Tool-call ordering is now preserved.** #19802 fixes nested JSON argument key order through decode/edit/replay, which matters for models whose prompts are publisher-order-sensitive (found while testing inkling-2-mini). [PR #19802](https://github.com/ollama/ollama/pull/19802)
- **Cloud users: pin away from `beam` for tool use** until #19804 is resolved — there's no workaround in the issue thread yet.

</details>

<details>
<summary><strong>LiteLLM</strong> — <a href="https://github.com/BerriAI/litellm">BerriAI/litellm</a></summary>

# LiteLLM Digest — 2026-11-21

## 1. Today's Highlights

A large release-train day: LiteLLM shipped two new RC/patch lines (**v1.111.0-rc.3**, **v1.110.2**) alongside LTS backports (**v1.108.14**), reinforcing the dual main/LTS maintenance model now standard for the project. The issue tracker remains dominated by translation-layer correctness bugs — cost accounting for non-OpenAI providers (ElevenLabs, watsonx), routing starvation under `least-busy`, and spend-log leakage on guardrail blocks. On the PR side, the team is actively landing fixes for MCP OAuth concurrency, Bedrock inference-profile routing, and Gemini Live Avatar support.

## 2. Releases & Breaking Changes

- **v1.111.0-rc.3** — [release](https://github.com/BerriAI/litellm/releases) — release candidate on the mainline; cosign-verifiable via `ghcr.io/berriai/litellm:v1.111.0-rc.3`.
- **v1.110.2** — [release](https://github.com/BerriAI/litellm/releases) — patch on 1.110; note that **v1.110.1 introduced an OAuth pass-through regression** ([#53185](https://github.com/BerriAI/litellm/issues/53185)) — upgrading to 1.110.2 is advisable if you depend on query-string `client_id` on pass-through routes.
- **v1.109.3** — patch release.
- **v1.108.14 (LTS)** — [release](https://github.com/BerriAI/litellm/releases) — latest LTS patch; `ghcr.io/berriai/litellm:lts` now points here. LTS line continues to receive backports (e.g., [PR #53196](https://github.com/BerriAI/litellm/pull/53196) for `litellm_proxy` decision-provider support, [PR #53272](https://github.com/BerriAI/litellm/pull/53272) for Messages-translation test fixtures).
- **v1.106.12** — patch on the 1.106 line.
- **Breaking/config note:** PR [#53063](https://github.com/BerriAI/litellm/pull/53063) proposes serving **Scalar as the default API docs UI**, with Swagger moved to `/swagger`. If you script against `/docs`, pin your expectations.

## 3. New Model & Hardware Support

- **Gemini Live Avatar (Vertex AI realtime)** — [PR #53270](https://github.com/BerriAI/litellm/pull/53270) adds support for `avatar_config` / `customized_avatar` on the Gemini Live bidi API, addressing [issue #43166](https://github.com/BerriAI/litellm/issues/43166). Enables lip-synced talking-head video alongside audio.
- **Gradium TTS** — [PR #46427](https://github.com/BerriAI/litellm/pull/46427) adds a `gradium/` provider for `litellm.speech` and `/v1/audio/speech`.
- **Bedrock regional inference-profile IDs** — [PR #53273](https://github.com/BerriAI/litellm/pull/53273) fixes routing for IDs of the form `us.openai.gpt-6.1-sol`, which previously resolved to a non-existent AWS endpoint and returned an empty success.
- **Cohere v2 chat route** — [PR #51851](https://github.com/BerriAI/litellm/pull/51851) (LTS backport) maps `tool_choice`, `reasoning_effort`, and `json_schema` response_format, which were silently dropped or 400'd.
- **Nano Banana 2.1 (VertexAI)** — [PR #50709](https://github.com/BerriAI/litellm/pull/50709) stops thought images from leaking into `message.images`, matching the existing text-thinking stripping.

## 4. Performance & Optimization

- **`least-busy` routing starvation** — [issue #39322](https://github.com/BerriAI/litellm/issues/39322). Response-cache hits drive the in-flight counter negative, ties always resolve to the first deployment, and the counter is not shared across workers. Net effect: traffic "gradually drops to zero" for some deployments. No fix PR yet; root-cause follow-up to #25323 (open since April).
- **Lens cost-record path** — [PR #53268](https://github.com/BerriAI/litellm/pull/53268) drops the conversation payload from Lens cost records, so requests over 1 MiB (long coding sessions, large images) no longer reach Lens without a cost record. Reduces outbound payload size on the observability path.
- **JWKS resilience** — [PR #52975](https://github.com/BerriAI/litellm/pull/52975) extends stale-key fallback to IdP 5xx/429 responses; previously only refused connections triggered the fallback, so key expiry during an IdP brownout failed every JWT with 401.

## 5. Stability & Regressions

Ranked by severity:

1. **`litellm.num_retries` global permanently set to `None`** — [issue #33272](https://github.com/BerriAI/litellm/issues/33272). Any exception from a direct `completion()`/`acompletion()` call nulls the module-level global process-wide, silently disabling retries for all subsequent calls. Severity: high for SDK embedders; no fix PR.
2. **Proxy start crash on `SQL_ASCII` databases** — [issue #52247](https://github.com/BerriAI/litellm/issues/52247). `find_blockers` raises `ValueError` parsing `b'8192'` during index build; proxy does not start. Affects v1.109.1 non-root image.
3. **OAuth `client_id` query param rejected on pass-through GET** — [issue #53185](https://github.com/BerriAI/litellm/issues/53185). Regression in v1.110.1; 401 before reaching upstream, breaking browser OAuth for MCP servers.
4. **Spend-log leakage on guardrail-blocked requests** — [issue #50127](https://github.com/BerriAI/litellm/issues/50127). With `store_prompts_in_spend_logs: true`, blocked requests are stored verbatim in `proxy_server_request`, exposing PII/secrets on the admin Logs page. Severity: high (data governance).
5. **Files not scoped to uploading team** — [PR #53084](https://github.com/BerriAI/litellm/pull/53084) fixes a cross-team isolation gap where plain provider uploads could be listed/read/deleted by other teams sharing the provider key.
6. **Admin UI session cookie not HttpOnly** — [issue #36997](https://github.com/BerriAI/litellm/issues/36997) (closed). JWT carries the caller's real proxy key in a non-HttpOnly cookie.
7. **Budget reservation mis-sizing on `/v1/responses`** — [issue #51445](https://github.com/BerriAI/litellm/issues/51445) (closed). Only `max_output_tokens` is forwarded, but reservation reads `max_tokens` first — concurrent calls can overrun `max_budget`.
8. **watsonx streamed usage discarded** — [issue #46059](https://github.com/BerriAI/litellm/issues/46059). Proxy reports its own token estimate, far below billed usage.
9. **ElevenLabs cost calc broken on proxy** — [issue #18058](https://github.com/BerriAI/litellm/issues/18058). 11 comments, still open.
10. **`hosted_vllm` Responses API drops provider params** — [issue #48362](https://github.com/BerriAI/litellm/issues/48362). `chat_template_kwargs`, `top_k`, etc. dropped without warning on `/v1/responses`, though forwarded on chat completions.
11. **OTel + caching miss** — [issue #49311](https://github.com/BerriAI/litellm/issues/49311) (closed). Exact-match response cache never hits when OTel is enabled and `enable_caching_on_provider_specific_optional_params` is true; `parent_otel_span` pollutes the cache key.
12. **Codex compaction on Bedrock/Claude bridge** — [PR #53266](https://github.com/BerriAI/litellm/pull/53266) fixes ignored `compaction_trigger`, which caused Codex to stop mid-session when the gateway failed to summarize long chats.
13. **MCP tool-name length overflow** — [PR #53269](https://github.com/BerriAI/litellm/pull/53269) truncates namespace tool names to 64 chars on the chat-completions bridge, fixing 90-char `mcp__vault__...` names rejected by Claude on Bedrock.
14. **MCP concurrent OAuth scope refusals** — [PR #52809](https://github.com/BerriAI/litellm/pull/52809) fixes lost permissions under simultaneous refusals, which caused repeat sign-in prompts.
15. **Billed failure accounting dropped when error logs disabled** — [PR #53271](https://github.com/BerriAI/litellm/pull/53271) retains charges from failed requests even with error logs off.

## 6. What This Means for Application Developers

- **Pin to LTS if you're on the proxy.** The 1.110.1 OAuth regression and the growing pile of LTS backports ([#53196](https://github.com/BerriAI/litellm/pull/53196), [#53272](https://github.com/BerriAI/litellm/pull/53272)) make `ghcr.io/berriai/litellm:lts` the safest tag for production gateways.
- **Audit your spend logs if you use guardrails.** [#50127](https://github.com/BerriAI/litellm/issues/50127) means blocked prompts — the ones most likely to contain secrets or PII — are persisted in cleartext. If `store_prompts_in_spend_logs: true`, treat the `LiteLLM_SpendLogs` table as sensitive data until a fix lands.
- **Don't mix `max_tokens` and `max_output_tokens` on `/v1/responses`.** Until [#51445](https://github.com/BerriAI/litellm/issues/51445) is fully resolved, budget reservation can be off by orders of magnitude, letting concurrent calls exceed caps.
- **SDK embedders: check your retry state.** If you call `litellm.completion()` directly and hit any exception, verify `litellm.num_retries` afterward ([#33272](https://github.com/BerriAI/litellm/issues/33272)) — it may have been silently nulled.
- **Realtime and MCP integrations are getting attention.** Gemini Live Avatar ([#53270](https://github.com/BerriAI/litellm/pull/53270)), Bedrock regional GPT IDs ([#53273](https://github.com/BerriAI/litellm/pull/53273)), and Codex compaction ([#53266](https://github.com/BerriAI/litellm/pull/53266)) all improve the hosted-agent path. vLLM realtime users should still track [#31613](https://github.com/BerriAI/litellm/issues/31613) (self-hosted WS support pending).
- **Expect doc URL churn.** Scalar-as-default ([#53063](https://github.com/BerriAI/litellm/pull/53063)) will move Swagger to `/swagger`; update any bookmarks or generated clients.

</details>

<details>
<summary><strong>Unsloth</strong> — <a href="https://github.com/unslothai/unsloth">unslothai/unsloth</a></summary>

# Unsloth Digest — 2026-11-21

## Today's Highlights
Unsloth shipped two beta releases (v0.1.921-beta and v0.1.922-beta) headlined by **Inkling 2 Mini**, a 26.4B model that runs in 16GB RAM, plus faster image generation on small GPUs, Apple Silicon video restyling, and MCP chat optimizations that avoid reprocessing the full conversation per message. Issue activity remains dominated by Studio Desktop bugs — most notably a **v0.1.920-beta crash on model load** and ROCm/HIP kernel failures on RDNA4 hardware. A large wave of Studio hardening PRs landed (network firewall, sandbox memory limits, encoding fixes), signaling continued investment in the desktop app's security and robustness.

## Releases & Breaking Changes
- **v0.1.922-beta — Inkling Mini + Bug fixes**: Adds Inkling 2 Mini support, faster/lighter image generation on small GPUs, Apple Silicon video restyling, and MCP tool chats that no longer reprocess the entire conversation per message. [Release](https://github.com/unslothai/unsloth/releases)
- **v0.1.921-beta — Bug Fixes + Faster images + Inkling Mini + faster MCP chats**: Same headline features as above; a second release was flagged as imminent. [Release](https://github.com/unslothai/unsloth/releases)
- **Note (regression flag):** Issue [#17605](https://github.com/unslothai/unsloth/issues/17605) reports that **0.1.917 forced mmap despite explicit `--load-mode none`**, contradicting documented load-mode behavior. Closed, but worth verifying config semantics across 0.1.917 → 0.1.922.

## New Model & Hardware Support
- **Inkling 2 Mini (26.4B)** — now runnable via Unsloth on 16GB RAM; finetuning support is an open question ([#18691](https://github.com/unslothai/unsloth/issues/18691)). Loading failures reported on 32GB DDR5 laptops with CPU+GPU offload ([#18690](https://github.com/unslothai/unsloth/issues/18690), closed).
- **Qwen hybrid models w/ MCP tool catalogs** — improved turn semantics after tool use ([#17015](https://github.com/unslothai/unsloth/issues/17015), closed).
- **DaisyRose-27B** — feature request for agentic coding support ([#18465](https://github.com/unslothai/unsloth/issues/18465)).
- **Non-CUDA BF16 fixes (in review)** — PR [#18712](https://github.com/unslothai/unsloth/pull/18712) replaces direct `torch.cuda.is_bf16_supported()` calls in `unsloth/save.py` with device-aware checks, restoring BF16 merged/GGUF exports on **Intel XPU and Ascend NPU** (previously silently downgraded to FP16).

## Performance & Optimization
- **MCP chat efficiency**: MCP-enabled chats no longer reprocess the full conversation on every message (v0.1.921/922). Directly reduces TTFT and prompt-token cost for tool-heavy agents.
- **Image generation**: faster and lighter on small GPUs (both releases).
- **Apple Silicon**: video restyling now supported on Macs.
- **GRPO correctness/perf (PR [#18675](https://github.com/unslothai/unsloth/pull/18675))**: with `num_iterations > 1`, old logps are taken from the first loss pass instead of a separate no-grad forward — eliminates a redundant full-generation forward and the bit-inequality between passes.
- **Save/export hardening (PRs [#18710](https://github.com/unslothai/unsloth/pull/18710), [#18709](https://github.com/unslothai/unsloth/pull/18709))**: prevents silent fallthrough to full-checkpoint save and isolates full-finetuning state per model (fixes cross-model corruption when loading a second model).
- **Studio sandbox memory (PR [#18694](https://github.com/unslothai/unsloth/pull/18694))**: Python/Terminal memory limit now defaults to half of system RAM (min 8GB), replacing the fixed 8GB Linux cap and no-limit behavior on Windows/macOS.

## Stability & Regressions (ranked by severity)
1. **CRITICAL — v0.1.920-beta crashes on model load** ([#18563](https://github.com/unslothai/unsloth/issues/18563), OPEN, 5 comments). Affects Studio Desktop; no fix PR referenced yet. Consider pinning to 0.1.919 or 0.1.922 while triaged.
2. **HIGH — QLoRA aborts on gfx1200 (RX 9060 XT, RDNA4)** with `HIP error: an illegal memory access` in three fused kernels ([#18403](https://github.com/unslothai/unsloth/issues/18403), OPEN). Plain PyTorch/PEFT also lacks SDPA kernel for this arch — no known fix.
3. **HIGH — Dual RX 6700 XT ROCm crash** ([#18622](https://github.com/unslothai/unsloth/issues/18622), OPEN).
4. **MEDIUM — Studio crash on window minimize / idle** ([#18637](https://github.com/unslothai/unsloth/issues/18637), OPEN, Windows x86_64).
5. **MEDIUM — Studio: managed accounts cannot load subfolder-repo models** ([#18647](https://github.com/unslothai/unsloth/issues/18647), OPEN) — "Repo id must be in the form 'repo_name' or 'namespace/repo_name'".
6. **MEDIUM — Inkling 2 Mini fails to load on 32GB DDR5 laptop** with CPU+GPU offload ([#18690](https://github.com/unslothai/unsloth/issues/18690)).
7. **MEDIUM — macOS update blocked by malware script warning** ([#18699](https://github.com/unslothai/unsloth/issues/18699), OPEN) — user reports Gatekeeper warning during `unsloth` update.
8. **LOW — Studio xlsx `0;-0;;@` empty format section hides numbers** ([#18546](https://github.com/unslothai/unsloth/issues/18546), CLOSED).
9. **LOW — Hmong language not detected / not in language list** ([#18674](https://github.com/unslothai/unsloth/issues/18674), OPEN).
10. **Config/state bug chain fixed via PRs [#18711](https://github.com/unslothai/unsloth/pull/18711) (training state not restored after generation), [#18710](https://github.com/unslothai/unsloth/pull/18710) (silent export-path fallthrough), [#18709](https://github.com/unslothai/unsloth/pull/18709) (global full-finetuning state cross-contamination), [#18708](https://github.com/unslothai/unsloth/pull/18708) (corrupt zstd Codex import → HTTP 500).**

## What This Means for Application Developers
- **Agent/MCP builders:** Upgrade to 0.1.921/922 for the MCP prompt-reuse fix — it materially cuts token cost and latency for multi-turn tool loops. If you rely on reasoning + hybrid models (Qwen3.8 etc.) with large tool catalogs, this closes a real regression class ([#17015](https://github.com/unslothai/unsloth/issues/17015)).
- **Non-CUDA deployers:** PR [#18712](https://github.com/unslothai/unsloth/pull/18712) is worth tracking — silent FP16 downgrade of BF16 merged/GGUF exports on XPU/NPU is a correctness issue hiding as a numerics quirk.
- **Studio Desktop users:** Pin versions carefully — 0.1.920 has a model-load crash and 0.1.917 forced mmap. 0.1.922 is the current target, but verify load-mode flags behave as documented before rolling to production desktops.
- **Security posture (Studio):** PRs [#18548](https://github.com/unslothai/unsloth/pull/18548) (network firewall for web/Python/Terminal) and [#18694](https://github.com/unslothai/unsloth/pull/18694) (RAM-scaled sandbox) harden the tool-execution boundary — relevant if you run untrusted model-generated code.
- **ROCm/RDNA4 users:** QLoRA is effectively blocked (3 fused-kernel HIP faults). Stay on CUDA or Strix Halo-class hardware with validated kernels for training workloads.
- **Finetuners:** The `_unsloth_full_finetuning` per-model isolation fix ([#18709](https://github.com/unslothai/unsloth/pull/18709)) matters if you load multiple models in one process (e.g., eval harnesses, multi-tenant servers) — without it, a second model load can corrupt the first's training mode.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*