# AI Infrastructure Digest 2026-11-15

> Generated: 2026-11-15 00:58 UTC | Projects covered: 6

- [vLLM](https://github.com/vllm-project/vllm)
- [SGLang](https://github.com/sgl-project/sglang)
- [llama.cpp](https://github.com/ggml-org/llama.cpp)
- [Ollama](https://github.com/ollama/ollama)
- [LiteLLM](https://github.com/BerriAI/litellm)
- [Unsloth](https://github.com/unslothai/unsloth)

---

## Cross-Project Comparison

# Cross-Project AI Infrastructure Comparison Report
**Date: 2026-11-15 | Projects: vLLM, SGLang, llama.cpp, Ollama, LiteLLM, Unsloth**

---

## 1. Ecosystem Overview

Today's digest landscape reveals an ecosystem in **hardening mode**, not expansion mode: no project cut a headline release, yet every tracker is dense with quantization kernel migrations, prefix/KV cache correctness fixes, and second-generation speculative decoding work. The dominant stability theme is **high-end Blackwell/SM120 breakage** — vLLM, SGLang, and llama.cpp all report CUDA-graph, FlashInfer, or RCCL regressions on next-gen silicon — while consumer Blackwell (sm_120 RTX 50-series) remains effectively unsupported in SGLang. Gateways are the new center of gravity for correctness risk: LiteLLM's `/v1/responses` budget overrun and streaming-cancellation hole are cost-and-compliance issues that affect every downstream application regardless of engine choice. On the training side, Unsloth is racing to land native DeepSeek-V4.1 and FSDP2/TP/PP sharding, mirroring the inference engines' push to support the same V4.1 architecture. The overall signal is clear: **the industry's attention has shifted from "which model can we serve" to "can we serve it deterministically, within budget, and without silent numerical corruption."**

---

## 2. Activity Comparison

| Project | Layer | Releases (24h) | Notable PR Activity | Notable Issue Activity | Dominant Theme |
|---|---|---|---|---|---|
| **vLLM** | Serving engine | None | Heavy: Marlin→Humming kernel migration, TP-agnostic KV offload, Rust frontend, encoder-cache config | ~10 ranked stability items; SM120 CUDA-graph cluster; LoRA slot starvation; Mamba SSM state bug | Quantization consolidation + Blackwell stability |
| **SGLang** | Serving engine | None | Heavy: Rust server control-API migration, AMD ring all-reduce, MiniMax-H3 diffusion kernels | 12 ranked; sm_120 unsupported; HiCache/Mooncake hit-rate dip; MoE EP autotune cache loss | 1.0 stability hardening + AMD/HiCache cache economics |
| **llama.cpp** | Local runtime | **9 builds (b12376–b12387)** | Active: deterministic attention reduction, fused KV dequant, CUDA fatbin compression, Hexagon IQ2_XXS/NVFP4 | 12 ranked; V100/sm_70 prefill regression; Metal FP8 KV abort; server 413 cap | Quantization correctness + cross-backend determinism |
| **Ollama** | Local runtime | None | Moderate: MLX batched spec verification, VRAM accounting split fix, qwen tool-call parser drift | 7 ranked; qwen tool-call corruption; Windows wsarecv 500s; VRAM eviction bugs | Tool-call correctness + multi-GPU accounting |
| **LiteLLM** | Gateway | **v1.108.9 + v1.107.0-rc.4** | Heavy: Rust rate limiter port, control-plane audit sinks, priority queue, pagination fixes | 13 ranked; `/v1/responses` budget overrun; 1.107 streaming cancel regression; MCP stalls | Gateway billing/security correctness + control plane |
| **Unsloth** | Training/Fine-tuning | None | Heavy: native DeepSeek-V4.1, FSDP2+TP+PP sharding, QAT cached-decode fix, NVFP4/MXFP4 fix | 10 ranked; MTP broken post-llama.cpp b12340; 37% throughput drop; ROCm gfx1151 fallbacks | Training-scale sharding + llama.cpp upgrade regressions |

**Read:** only llama.cpp and LiteLLM shipped artifacts in this window. vLLM/SGLang/Unsloth activity is PR-queue churn; Ollama is in issue-triage mode.

---

## 3. Model Support Race

| Architecture | vLLM | SGLang | llama.cpp | Ollama | Unsloth |
|---|---|---|---|---|---|
| **DeepSeek-V4.1 / V4.1-Flash** | ✅ MXFP8 ROCm/MI355X kernels (PR #67377) | ✅ Packed-FP4 KV on Hopper (closed/inactive) | — | — | ✅ **Native modeling + FSDP2/TP/PP** (PRs #17778, #17785) |
| **Qwen3.8-Flash-Next / qwen4exp** | — | Partial (breakable prefill CUDA graphs) | ✅ QSA `--kv-unified` fix (PR #32247) | — | ✅ **FSDP2/TP/PP sharding** (PR #17785) |
| **Qwen3.5/3.6 tool-call** | — | — | Fixed: tool-call parsing in thinking block (#20837) | Partial: parser drift fix in review (PR #16398) | — |
| **Gemma 4 / Gemma-4** | Spec-decode hook (PR #64950) | iSWA+KV failure on HIP/Vulkan | — | — | ✅ Chat-template fix (PR #17781) |
| **MiniMax-M3 / H3** | — | AMD AgentX benchmarks; diffusion kernel cuts (PRs #50387/91/92) | — | — | — |
| **Kimi-K3** | — | TP16 GB200 issue (closed/inactive) | — | — | — |
| **Hexagon IQ2_XXS/NVFP4** | — | — | ✅ **Shipped** (PR #31954) | — | — |
| **Zonos3 TTS / Inkling 2 / DFlash2** | — | — | ✅ Inkling 2 merged; DFlash2 validated | — | — |
| **NVFP4/MXFP4 compressed-tensors** | Humming kernel roadmap | — | Silently-broken Qwen2VL path fixed (b12385) | — | ✅ Random-init fix in PR #17775 |

**Who's ahead:** Unsloth leads on **training-time** support for the DeepSeek-V4.1/Qwen3.8-Flash-Next class — the only project in this set shipping native modeling plus distributed sharding for those architectures. llama.cpp leads on **breadth of shipped, merged** support (Inkling 2, Hexagon IQ2_XXS/NVFP4, DFlash2). vLLM leads on **datacenter-accelerator kernel coverage** (ROCm MI355X MXFP8). SGLang is strong on **AMD/Hopper cache formats** but carries the most closed/inactive support threads.

---

## 4. Performance Frontier

| Optimization Domain | vLLM | SGLang | llama.cpp | Ollama | Unsloth |
|---|---|---|---|---|---|
| **KV cache / prefix caching** | TP-agnostic KV offload; Mamba mid-block resume 3→1 pass | HiCache+Mamba host pool; **HiCache/Mooncake hit-rate dip under pressure** | Fused KV dequant in MMA flash-attn; unified-KV 37% decode cost quantified | — | — |
| **Batching / scheduling** | Model Runner V2 single UVA batch-index upload | Fixed-batch bounded LPM (PR #48409); PP-sync drain lock-step | New backend split heuristic (b12383) | MLX batched spec verification (PR #19663) | — |
| **Quantization kernels** | **Marlin→Humming migration** (INT4/8 GPTQ/AWQ, FP8, MXFP4/6, NVFP4) | Block-FP8 silent-wrong-results audit; FP16 Stream-K NaN | NVFP4 per-tensor scale plumbing; Hexagon IQ2_XXS/NVFP4 | — | NVFP4/MXFP4 random-init fix |
| **Distributed serving** | MoRIIO port collisions; DP-dispatch rank bug | AMD ring all-reduce gfx1250; FuseEP RFC (Ascend) | RPC cross-vendor crashes | — | **FSDP2+TP+PP for V4.1/Qwen3.8** |
| **Attention/kernel determinism** | Batch invariance tracking (#27433, 107 comments) | — | **Top-k pick-order determinism** (PRs #32297/#32299) | — | — |
| **Speculative decoding** | EAGLE3 V2 allocation cut; draft prefill CG ceiling | — | DFlash refactor (b12377); DFlash2 | Batched MLX spec verify | MTP acceptance regressed to 56–66% |
| **Startup/latency** | — | FlashInfer autotune cache dropped every EP>1 boot | CUDA fatbin size cut | VRAM eviction/split fix | 3.1× ROCm GDN conv1d fallback |

**Concentration:** effort is split three ways — **(a)** quantization kernel replacement (vLLM Humming, llama.cpp NVFP4 fixes), **(b)** cache-tier economics (HiCache/Mooncake, TP-agnostic KV, unified-KV cost), and **(c)** determinism/reproducibility (top-k ordering, batch invariance). Determinism is the newest frontier signal and is not yet a solved problem in any engine.

---

## 5. Layer Positioning

```
┌─────────────────────────────────────────────────────────────────┐
│  TRAINING / FINE-TUNING                                         │
│  Unsloth — LoRA/QLoRA, FSDP2/TP/PP sharding, QAT, model porting │
├─────────────────────────────────────────────────────────────────┤
│  GATEWAY / CONTROL PLANE                                        │
│  LiteLLM — routing, budgets, rate limits, audit, MCP, guardrails│
├─────────────────────────────────────────────────────────────────┤
│  DATACENTER SERVING ENGINES                                     │
│  vLLM     — highest-velocity kernel/quant roadmap, Rust frontend│
│  SGLang   — 1.0 stability track, AMD/agentic focus, Rust server │
├─────────────────────────────────────────────────────────────────┤
│  LOCAL / DESKTOP RUNTIME                                        │
│  llama.cpp — broadest backend coverage (CUDA/ROCm/Vulkan/SYCL/  │
│              Hexagon/Metal), daily builds, determinism work     │
│  Ollama    — packaging + MLX runner + tool-call ergonomics      │
└─────────────────────────────────────────────────────────────────┘
```

**Distinct risk profiles by layer:**
- **Serving engines (vLLM/SGLang):** risk is *fleet-wide* — one SM120 CUDA-graph bug or one MoE `IllegalAddress` at startup takes down an entire deployment. Version pinning is mandatory.
- **Local runtime (llama.cpp/Ollama):** risk is *upgrade-induced* — llama.cpp's high release cadence means regressions land fast (V100 prefill, MTP broken). Ollama inherits engine regressions through its bundled builds.
- **Gateway (LiteLLM):** risk is *financial and compliance-facing* — budget overruns, uncancelled streams, guardrail bypass. These bugs are invisible to the engine layer but visible to finance and auditors.
- **Training (Unsloth):** risk is *silent quality loss* — NVFP4 random-init, QAT cached-decode bypass, and MTP acceptance drift don't crash; they ship degraded models.

---

## 6. Trend Signals

**Signal 1 — Determinism is becoming a first-class requirement.**
llama.cpp's top-k pick-order work (#32297/#32299) demonstrates attention accumulation order changes PPL (2.1697 ± 0.045). vLLM's batch-invariance thread (#27433) has 107 comments and 24 👍. Applications requiring reproducible logits across batches should pin builds and expect numeric drift across releases. **No engine guarantees this today.**

**Signal 2 — Quantization is the largest source of silent corruption.**
Three of six projects reported silent-wrong-result bugs today: SGLang block-FP8 (#39626), llama.cpp NVFP4 Qwen2VL (b12385, PPL ~1e6), Unsloth NVFP4 compressed-tensors (#17775). The failure mode is consistent: **scale plumbing is dropped or configs are accepted without validation**. Recommend re-benchmarking *quality*, not just latency, after any quant or engine upgrade.

**Signal 3 — Gateway correctness is now a budget/security concern.**
LiteLLM's `/v1/responses` reservation bug can overrun `max_budget` under concurrency (#51445), 1.107+ streaming streams can bill after client disconnect (#51393), and Model Armor skips Responses API `input` (#49909). **Applications that route compliance-sensitive or budget-capped traffic through a gateway must audit this layer independently of the engine.**

**Signal 4 — Cache-tier economics are under pressure at scale.**
SGLang's HiCache+Mooncake hit-rate dips (87.4% → lower) under capacity pressure (#47481) and vLLM's inability to replay BlockPool state to routers (#40363) both affect agentic multi-turn workloads. **Cache-aware routing is not yet reliable across restarts or under load** — design for cache-cold behavior.

**Signal 5 — Speculative decoding is mid-refactor everywhere.**
vLLM EAGLE3 V2 (PR #64948), llama.cpp DFlash→dspark.cpp refactor (b12377), Ollama batched MLX verify (PR #19663), Unsloth MTP broken post-b12340 (#17733) and acceptance collapse (74%→56–66%, #17402). **Draft-model pairings must be validated per release**; do not assume MTP/DFlash gains persist across engine bumps.

**Signal 6 — Distributed serving bugs cluster around TP×DP boundaries.**
vLLM MoRIIO port collisions on TP2×DP2 (#64574), DP-dispatch rank bugs (#65563), `flashinfer_cutlass` MoE crash at dp≥2 (#67575), SGLang PP+spec-decode crash (#42648). **If you operate beyond single-node TP, treat any topology change as a regression-test event.**

**Signal 7 — A control plane is crystallizing around gateways.**
LiteLLM's PR queue shows OCSF audit events, S3 Object Lock, Splunk HEC/Sentinel sinks, and runtime dataplane writes (#49660/61/62, #51762) — plus a Rust rate-limiter rewrite (#51540). **This is a productization shift: the gateway is becoming the policy, audit, and chargeback layer**, which has implications for observability stack design.

---

### Recommendations for Technical Decision-Makers

| If you are… | Action |
|---|---|
| **Serving on Blackwell/SM120** | Pin `--enforce-eager`; stay on dp=1 or `moe-backend auto`; qualify SM120 CUDA-graph fixes before fleet rollout. |
| **Running agentic tool-calling** | Validate qwen/Kimi parser output; set conservative `max_tokens`; expect MCP `tools/list` stalls on LiteLLM ≥1.108.0. |
| **Enforcing per-key budgets** | Patch or config-cap `max_output_tokens` on `/v1/responses`; don't trust `max_tokens` as a reservation lever. |
| **Serving multi-turn agents** | Instrument prefix-cache hit rate per round; assume cache-cold on restart; expect transient dips under HiCache pressure. |
| **Training on V4.1 / Qwen3.8-Flash-Next** | Watch Unsloth PRs #17778/#17785; validate MTP acceptance at production temperature before deploying GGUFs. |
| **Running on ROCm** | Budget for MIOpen fallbacks (3.1× step time on gfx1151) and MATH fallback on MI300X SDPA backward. |
| **Operating in regulated environments** | Adopt LiteLLM cosign verification (v1.108.9); audit guardrail coverage per endpoint. |

**Bottom line:** the ecosystem is shipping breadth but has not yet shipped trust. Numerical determinism, gateway billing correctness, and SM120 stability are the three open gaps that most directly affect production deployments today.

---

## Per-Project Reports

<details>
<summary><strong>vLLM</strong> — <a href="https://github.com/vllm-project/vllm">vllm-project/vllm</a></summary>

# vLLM Digest — 2026-11-15

## 1. Today's Highlights
No releases in the last 24h, but issue and PR activity is heavy across quantization, KV offloading, and the experimental Rust frontend. The Marlin→Humming kernel migration tracker (#65560) and TP-agnostic KV offloading (#61886) both advanced, signaling continued consolidation of quantization and cache-management internals. Meanwhile, a cluster of SM120/Blackwell CUDA-graph and FlashInfer async-scheduling bugs remains the dominant stability theme facing high-end deployments.

## 2. Releases & Breaking Changes
No new releases in the last 24h.

Config/behavior changes in flight (not yet merged, no migration required today):
- `--encoder-cache-size` introduced to make the multimodal encoder cache configurable, replacing the hardcoded derivation from `max_num_batched_tokens` ([PR #65534](https://github.com/vllm-project/vllm/pull/65534)).
- `draft_prefill_cudagraph_max_tokens` added as an independent first-draft CUDA-graph ceiling for EAGLE/EAGLE3/MTP/Gemma4; default `None` preserves current behavior ([PR #64950](https://github.com/vllm-project/vllm/pull/64950)).
- `--disable-custom-all-reduce` semantics documented as falling back to NCCL, but currently only removes the `CUSTOM` backend, leaving FlashInfer/symmetric-memory all-reduce active on Hopper/Blackwell ([PR #60011](https://github.com/vllm-project/vllm/pull/60011)).

## 3. New Model & Hardware Support
- **ROCm / MI355X — DeepSeek-V4.1-Flash MXFP8**: Dense MXFP8 GEMMs and `wo_a` moved to AITER's tuned FlyDSL kernels, plus a faster MXFP8 activation quant; targets DP8 attention + EP8 MoE on 8×MI355X ([PR #67377](https://github.com/vllm-project/vllm/pull/67377)).
- **ZAQERIS AXIOM**: Request for native support of a 79.43B sparse MoE (16 experts, top-2 routing, 12.39B active params, Apache 2.0) ([Issue #67412](https://github.com/vllm-project/vllm/issues/67412)).
- **Quantization backends**: Proposal to migrate bitsandbytes and GGUF to OOT plugins given very low usage (~0.5% / ~0.1%) versus maintenance burden ([Issue #39583](https://github.com/vllm-project/vllm/issues/39583)).
- **Kernel roadmap**: Marlin → Humming replacement across NVIDIA architectures; Humming now covers INT4/INT8 GPTQ/AWQ, FP8, MXFP8, MXFP4, NVFP4, MXFP6, plus INT8/FP8 activations for dense and MoE layers ([Issue #65560](https://github.com/vllm-project/vllm/issues/65560)).

## 4. Performance & Optimization
- **Mamba prefix caching**: Mid-block prefill resume reduced from 3 forward passes to 1 in hybrid ("align") prefix caching ([PR #66938](https://github.com/vllm-project/vllm/pull/66938)).
- **Model Runner V2**: Batch indices (`idx_mapping`, `query_start_loc`, `cu_num_logits`) now uploaded in a single UVA kernel instead of multiple `async_tensor_h2d` calls with per-call pinned tensors ([PR #63211](https://github.com/vllm-project/vllm/pull/63211)).
- **ROCm MXFP8**: Triton block32 GEMM with no TP1 tuning was reaching only 21–31% of MXFP8 peak; the AITER FlyDSL path is the intended remedy ([PR #67377](https://github.com/vllm-project/vllm/pull/67377)).
- **Speculative decoding**: EAGLE3 V2 Llama path avoids a redundant raw auxiliary-state concatenation/allocation around `fc_norm` ([PR #64948](https://github.com/vllm-project/vllm/pull/64948)).
- **Batch invariance**: Ongoing tracking issue for batch-invariant feature + performance optimization, now at 107 comments and 24 👍 ([Issue #27433](https://github.com/vllm-project/vllm/issues/27433)).
- **Full CUDA Graph vs piecewise**: Data shared for B200 across model sizes and batch sizes to inform acceptance of FCG-incompatible features on vLLM v0.23.0 ([Issue #47089](https://github.com/vllm-project/vllm/issues/47089), closed).

## 5. Stability & Regressions
Ranked by severity:

1. **CUDA illegal memory access / GPU hang — FlashInfer metadata builder under async scheduling** (non-speculative): `build()` skips the blocking `seq_lens.cpu()` when `num_speculative_tokens == 0` and uses an upper bound, regressing since #57214 ([Issue #61239](https://github.com/vllm-project/vllm/issues/61239)). High severity, no linked fix PR.
2. **SM120 (RTX PRO 6000 Blackwell) CUDA graph capture failure — Xid 31 / illegal memory access**: Qwen3.6-27B-FP8 + LoRA under CUDA MPS on v0.33.0 ([Issue #67488](https://github.com/vllm-project/vllm/issues/67488)). High severity.
3. **DarkSeek/DeepSeek-V4.1-Flash on SM120, 8×TP with `--enforce-eager`**: extremely low decode throughput, CUDA graphs unusable; SM120 graph-capture fix requested ([Issue #56892](https://github.com/vllm-project/vllm/issues/56892)).
4. **`flashinfer_cutlass` MoE `cudaErrorIllegalAddress` at startup with `--data-parallel-size 2` (EP16)**: fine at dp=1 and with `moe-backend auto`; nightly `0.34.0rc1.dev378` on 16×RTX 6000D SM120 ([Issue #67575](https://github.com/vllm-project/vllm/issues/67575)).
5. **Mamba prefix cache serving wrong SSM state**: `cache_blocks()` publishes a block under its full-block hash after a mid-block resume ran past the block end; fix PR open ([PR #67717](https://github.com/vllm-project/vllm/pull/67717)).
6. **LoRA slot starvation**: requests for adapters without a free slot can wait indefinitely under steady traffic; fix PR open ([PR #67714](https://github.com/vllm-project/vllm/pull/67714)). Related: adapter load failures during `execute_model` currently kill the engine, taking down in-flight requests — fix PR open ([PR #67715](https://github.com/vllm-project/vllm/pull/67715)).
7. **MoRIIO port collision with TP>1 and DP>1**: TP2×DP2 prefill hangs at startup; fix PR open ([PR #64574](https://github.com/vllm-project/vllm/pull/64574)). Also, decode dispatch uses prefill DP rank, causing out-of-range failures ([PR #65563](https://github.com/vllm-project/vllm/pull/65563)).
8. **Structured output — `disable_any_whitespace` silently ignored at request level** (xgrammar backend), a config-plumbing gap ([Issue #48765](https://github.com/vllm-project/vllm/issues/48765)). Tool-call grammar also admits unbounded whitespace runs at JSON value positions, enabling whitespace loops until `max_tokens`; fix PR open ([PR #67031](https://github.com/vllm-project/vllm/pull/67031)).
9. **DeepSeek-V4 garbled output with CUDA graphs under concurrent identical input requests** ([Issue #41331](https://github.com/vllm-project/vllm/issues/41331)).
10. **RCCL RDNA3 gfx1100 TP2 startup failure on ROCm** ([Issue #38587](https://github.com/vllm-project/vllm/issues/38587)).

Closed/stale this cycle: DeepSeek-V4 no-response with Claude Code (#40854, closed), Qwen3.6-27B-FP8 SM120 DeepGemm warmup crash (#47169, closed), Mistral Small 4 dimension mismatch (#40260, closed), Pod Snapshot API RFC (#41893, closed), B200 FCG performance report (#47089, closed).

## 6. What This Means for Application Developers
- **Blackwell/SM120 users should stay on `--enforce-eager` cautiously**: with CUDA graph capture still broken in several SM120 paths (#56892, #67488, #67575), expect lower decode throughput. Prefer `dp=1` or `moe-backend auto` for `flashinfer_cutlass` MoE until dp≥2 is fixed.
- **Long-running LoRA-serving deployments**: more adapters than `--max-loras` under steady traffic can pin slots indefinitely (#67714), and a missing adapter file can crash the whole engine (#67715) — not just the offending request. Isolate adapters or wait for these fixes.
- **Structured output users**: `disable_any_whitespace` is a no-op at the request level today (#48765), and tool-call grammars can stall in whitespace loops (#67031). Set conservative `max_tokens` and add repetition detection in your client.
- **Cache-aware routers**: the current KV event publisher cannot replay full BlockPool state, so routers cannot reconstruct worker cache state on startup or after a crash (#40363). Plan for cache-cold behavior on restart.
- **Frontend convergence on the horizon**: the Rust frontend (`VLLM_USE_RUST_FRONTEND=1`) is an experimental drop-in for the Python API server; feature-parity gaps are tracked in #44280. If you depend on exact SSE/benchmark semantics, note that `vllm bench serve` (Python) and `vllm-bench` (Rust) currently parse streams with separate, independently-tested rules (#66974) — pin your benchmarking tool.
- **Plugin authors**: endpoint plugins have no readiness/graceful-drain/teardown lifecycle hooks today, so long-lived connections and background tasks are unsafe to manage inside a plugin (#65545).

</details>

<details>
<summary><strong>SGLang</strong> — <a href="https://github.com/sgl-project/sglang">sgl-project/sglang</a></summary>

# SGLang Digest — 2026-11-15

## 1. Today's Highlights

A quiet day for releases, but active churn continues across the stack: the SGLang 1.0 release tracker (#50045) is now circulating, framing 1.0 as a stability-hardening release that will replace silent config fallbacks with explicit errors. On the hardware side, a notable bug report confirms that consumer Blackwell (sm_120, RTX 50-series) still cannot run any model out-of-the-box with the CUDA 13 wheel, and AMD's nightly benchmarks expand to agentic workloads with the InferenceX AgentX MiniMax-M3.1-Flash DSpark curve on MI35x. Meanwhile, the large Rust-server control-API migration continues landing in stacked PRs.

## 2. Releases & Breaking Changes

- **No new releases in the last 24h.**
- **[roadmap] SGLang 1.0 Release Tracker** — [Issue #50045](https://github.com/sgl-project/sglang/issues/50045). SGLang 1.0 is positioned as a stability release: silent configuration changes will become errors naming the offending setting, and a 1.x compatibility policy will be defined. Upgrading from 0.5.x may require changes; upgrade notes are in the tracker. **Watch this if you pin SGLang versions in production.**

## 3. New Model & Hardware Support

- **sm_120 (RTX 50-series) still broken out-of-the-box** — [Issue #49209](https://github.com/sgl-project/sglang/issues/49209). No model runs with the CUDA 13 wheel on consumer Blackwell; 8 comments and no fix yet. Relevant to anyone hoping to run SGLang on desktop Blackwell hardware.
- **Ascend NPU (910B) — GDN hybrid models (Qwen3.8-27B)** — [Issue #50487](https://github.com/sgl-project/sglang/issues/50487). Default server args crash on first request with `RuntimeError: FP32 initial_state is only supported on Ascend950 (arch35)`; workaround is `--mamba-ssm-dtype bfloat16`.
- **MiniMax-M3 on Ascend NPU (FuseEP RFC)** — [Issue #39521](https://github.com/sgl-project/sglang/issues/39521) (CLOSED/inactive). Proposes an opt-in Ascend FuseEP path fusing routed-expert dispatch, expert FFN GEMMs, and combine for W8A8 prefill.
- **Kimi-K3 TP16 on GB200** — [Issue #39569](https://github.com/sgl-project/sglang/issues/39569) (CLOSED/inactive). Fused KDA decode was disabled on every layer due to unexpected conv/A_log/dt_bias layout; tracked for resolution.
- **DeepSeek-V4.1 packed-FP4 KV on Hopper** — [Issue #38902](https://github.com/sgl-project/sglang/issues/38902) (CLOSED/inactive). Feature request to store C1/C2 main KV in packed FP4.
- **Opt-in `toktier` tokenizer backend** — [Issue #44374](https://github.com/sgl-project/sglang/issues/44374). RFC for exact incremental and chunk-parallel CPU tokenization — potentially meaningful for high-throughput prefill pipelines.

## 4. Performance & Optimization

- **HiCache + Mooncake L2/L3 cache hit-rate dip under capacity pressure** — [Issue #47481](https://github.com/sgl-project/sglang/issues/47481). Reproducible transient drop from **87.4% to lower** hit rate during multi-turn benchmark once L2/L3 is under pressure. Directly affects multi-turn agent workloads where prefix reuse is expected.
- **FlashInfer autotune cache discarded every boot under MoE EP>1** — [Issue #40320](https://github.com/sgl-project/sglang/issues/40320). `_drop_diverged_autotune_cache()` invalidates the whole cache on every startup whenever per-rank MoE GEMM shapes differ (the normal case with expert parallelism), forcing fused-MoE tactic re-tuning each boot. A startup-latency and cold-start regression for EP deployments.
- **DeepSeek-R1 NVFP4 decode regression on Blackwell (~4%)** — [Issue #38628](https://github.com/sgl-project/sglang/issues/38628) (CLOSED/inactive). PR #34693's unified `tiny_gemm` path regressed decode vs. `dsv3_router_gemm`; a revert is explicitly not recommended — the unified path should be fixed.
- **MiniMax-H3 T2VA diffusion optimizations** — one request (1344×768, 124 frames, 49 steps) on B300 takes ~119s at 99.8% GPU utilization, ~93% in FA4 + GEMMs at 1100W power cap. Three stacked bit-exact kernel cuts in review:
  - varlen SDPA segments written in place — [PR #50387](https://github.com/sgl-project/sglang/pull/50387)
  - head_dim-64 rounded NeoX QK-norm+RoPE, four rows per warp — [PR #50392](https://github.com/sgl-project/sglang/pull/50392)
  - fused attention gated residual with norm2 modulation — [PR #50391](https://github.com/sgl-project/sglang/pull/50391)
- **HiCache PP-sync drain forces lock-step across PP ranks** — [Issue #45351](https://github.com/sgl-project/sglang/issues/45351) (CLOSED). Pipeline-parallel prefill scheduler could not run ahead across ranks; relevant to PP deployments with HiCache enabled.
- **Fixed-batch bounded LPM scheduling policy** — [PR #48409](https://github.com/sgl-project/sglang/pull/48409). Addresses LPM's FCFS fallback above 128 waiting requests, which can separate requests sharing long prefixes under KV pressure.
- **AMD ring all-reduce + unrolled 2shot_push on gfx1250** — [PR #49955](https://github.com/sgl-project/sglang/pull/49955). Custom all-reduce optimization.
- **Qwen3.8 breakable prefill CUDA graphs for image batches** — [PR #46329](https://github.com/sgl-project/sglang/pull/46329). Enables graph replay for image prefills under `--cuda-graph-backend-prefill breakable`.
- **AMD HiCache Mamba host pool sizing** — [PR #47867](https://github.com/sgl-project/sglang/pull/47867). Adds `--hicache-mamba-size-gb`; without it, host KV hits on hybrid Mamba/KDA models miss because the Mamba checkpoint isn't pinned on host.

## 5. Stability & Regressions

Ranked by severity:

1. **sm_120 consumer Blackwell cannot run any model** — [Issue #49209](https://github.com/sgl-project/sglang/issues/49209). No fix PR referenced. Affects all RTX 50-series users on CUDA 13 wheels.
2. **PP + EAGLE/MTP spec decoding crash with `--enable-mixed-chunk`** — [Issue #42648](https://github.com/sgl-project/sglang/issues/42648). `'EagleDraftInput' object has no attribute 'rids'` in `_pp_spec_rebuild_verify_input`. Crashes the server on any spec-decode request in that config.
3. **sgl-router `/v1/messages` returns 400 for inline `role="system"`** — [Issue #50348](https://github.com/sgl-project/sglang/issues/50348). Anthropic-Messages-compatible endpoint rejects a common payload shape.
4. **Forwarding `Retry-After` in OpenAI gateway responses** — [Issue #50516](https://github.com/sgl-project/sglang/issues/50516). Missing header breaks client-side backoff; a gateway correctness issue for rate-limited deployments.
5. **Qwen-VL image preprocessing GPU OOM** — [Issue #49796](https://github.com/sgl-project/sglang/issues/49796) (CLOSED). 2.87× peak from `torch.cat(processed_images)` plus a cache that never returns memory.
6. **Block-FP8 Triton matmul silently returns wrong results** — [Issue #39626](https://github.com/sgl-project/sglang/issues/39626) (CLOSED/inactive). `w8a8_block_fp8_matmul_triton` accepts unsupported `BLOCK_SIZE_K=64` with `block_size=[32,32]` and produces incorrect output without error. Silent numerical corruption — audit any custom block-FP8 configs.
7. **FP16 Stream-K GEMM produces NaNs for exact-zero results** — [Issue #50521](https://github.com/sgl-project/sglang/issues/50521). New Humming backend report; fresh, no fix PR yet.
8. **Kimi K3 leaks raw XTML tool calls into content when no tools are declared** — [Issue #39583](https://github.com/sgl-project/sglang/issues/39583) (CLOSED/inactive). With `--tool-call-parser kimi_k3`, the native tool-call channel is returned as ordinary text when the request omits `tools`.
9. **`SGLANG_FORWARD_UNKNOWN_TOOLS` not honoured by four detectors** — [Issue #39640](https://github.com/sgl-project/sglang/issues/39640) (CLOSED/inactive). Undeclared tool calls are dropped on the one-shot path despite the env var.
10. **Qwen3.8-Flash-Next cookbook image predates #38851** — [Issue #39570](https://github.com/sgl-project/sglang/issues/39570) (CLOSED/inactive). Start-up crash in QSA KV-extraction kernel once `max_running_requests` ~4000. Rebuild the image.
11. **Qwen3.5-122B NEXTN memory faults on MI300X/325X/355X** — [Issue #39517](https://github.com/sgl-project/sglang/issues/39517) (CLOSED/inactive). aiter backend rocm10 nightlies; triton works, `SGLANG_USE_AITER_UNIFIED_ATTN` works on gfx942 only.
12. **CI status**: 0 broken, 7 flaky, 918 recently fixed on `main` per the tracking issue [#17050](https://github.com/sgl-project/sglang/issues/17050).

## 6. What This Means for Application Developers

- **Pin your CUDA wheel and GPU combination deliberately.** Consumer Blackwell (sm_120) is not a supported path today; if you are prototyping on RTX 50-series, stay on previous-gen or server parts.
- **Audit block-FP8 matmul configs.** The silent-wrong-results bug (#39626) is closed but the class of failure — custom Triton tile configs accepted without validation — is worth checking in any hand-tuned deployment.
- **Expect prefix-cache hit rates to be unstable under pressure with HiCache + Mooncake.** If your agent workload depends on high cache reuse for multi-turn sessions, instrument hit rate per round and expect a transient dip when L2/L3 fills. No fix landed.
- **If you use MoE with EP>1, cold-start times are inflated.** FlashInfer autotune cache is dropped on every boot (#40320), so first-request latency after restart is materially worse than the steady state. Batch your rollout timing accordingly.
- **Anthropic-Messages clients: inline `role="system"` currently 400s on sgl-router** (#50348). Move system prompts to the top-level `system` field until fixed.
- **Tool-calling parsers have edge cases.** Kimi K3 can emit raw XTML into content if `tools` is absent (#39583), and `SGLANG_FORWARD_UNKNOWN_TOOLS` is not honoured uniformly across detectors (#39640). If you route tool calls through an OpenAI-compatible client, validate parser output rather than trusting it blindly.
- **SGLang 1.0 will break on silent config drift.** Start migrating now: identify any reliance on implicit defaults, since 1.0 turns silent fallbacks into explicit errors (#50045).

</details>

<details>
<summary><strong>llama.cpp</strong> — <a href="https://github.com/ggml-org/llama.cpp">ggml-org/llama.cpp</a></summary>

# llama.cpp Digest — 2026-11-15

## Today's Highlights
Release cadence stayed high, but the day's technical center of gravity was quantization and attention correctness: b12385 fixed a silently-broken NVFP4 Qwen2VL path that produced garbage output, and multiple PRs converged on deterministic attention accumulation ordering (top-k row pick order) across CUDA/ggml. On the platform side, Hexagon gained IQ2_XXS/NVFP4 kernels while macOS/iOS and Vulkan both saw targeted fixes. Open noise is concentrated in backend-specific defects — Vulkan on Intel, SYCL AOT, ROCm VMM — plus one unpatched server-side 413 limit.

## Releases & Breaking Changes
Nine builds landed (b12376–b12387). No API or config breaks.
- **b12387** — Fix `ctz64` on 32-bit targets ([#32273](https://github.com/ggml-org/llama.cpp/pull/32273))
- **b12386** — Hexagon: fix flash-attention no-mask tail ([#32243](https://github.com/ggml-org/llama.cpp/pull/32243))
- **b12385** — qwen2vl: apply FFN weight scales; NVFP4 per-tensor scales were never wired into `build_ffn`, yielding PPL ~1e6 on CUDA / NaN on CPU ([#32241](https://github.com/ggml-org/llama.cpp/pull/32241))
- **b12383** — ggml-backend: start a new split at incompatible weights within an input-less split ([#31775](https://github.com/ggml-org/llama.cpp/pull/31775))
- **b12381** — mtmd: fix video pixel aspect ratio and rotation ([#32267](https://github.com/ggml-org/llama.cpp/pull/32267))
- **b12380** — mtmd: pluggable custom video decoder (wllama compatibility, tests added) ([#32188](https://github.com/ggml-org/llama.cpp/pull/32188))
- **b12379** — jinja: reduce value allocation and lookup overhead in template rendering ([#32023](https://github.com/ggml-org/llama.cpp/pull/32023))
- **b12378** — mtmd: skip padding-only Whisper audio chunks ([#30403](https://github.com/ggml-org/llama.cpp/pull/30403))
- **b12377** — spec/model: refactor DFlash speculative decoding into `dspark.cpp` ([#32016](https://github.com/ggml-org/llama.cpp/pull/32016))
- **b12376** — Hexagon: IQ2_XXS and NVFP4 support (tiled repack, HVX matmul, HMX paths) ([#31954](https://github.com/ggml-org/llama.cpp/pull/31954))

## New Model & Hardware Support
- **Hexagon: IQ2_XXS + NVFP4** — tiled repack layouts plus HVX and HMX matmul kernels; also adds per-tensor NVFP4 scale handling on Hexagon. ([#31954](https://github.com/ggml-org/llama.cpp/pull/31954))
- **Vulkan: Imagination PowerVR** — initial vendor ID and minimal backend enablement, functional but not tuned. ([#29315](https://github.com/ggml-org/llama.cpp/pull/29315))
- **Zonos3-mini TTS** — in review; note the upstream model ships a custom GGML runtime incompatible with llama.cpp, so conversion work is required. ([#32020](https://github.com/ggml-org/llama.cpp/pull/32020))
- **DFlash2 for Recursive Ripple-65B-Preview** — speculative decoding support validated on b12211 (M5 Max, Metal). ([#31904](https://github.com/ggml-org/llama.cpp/pull/31904))
- **Inkling 2 (text + vision)** — merged as #32217; chat-template token placement follow-up in flight. ([#32217](https://github.com/ggml-org/llama.cpp/pull/32217), [#32294](https://github.com/ggml-org/llama.cpp/pull/32294))
- **GigaChat 3.5 (432B-A28B)** — DeepSeek-V3-style MoE with hybrid attention; still under review. ([#25342](https://github.com/ggml-org/llama.cpp/pull/25342))
- **qwen4exp padding / 64-bit metadata / multimodal MTP** — closed without merge; relevant if you need int64 array metadata or expert-width mismatches. ([#30316](https://github.com/ggml-org/llama.cpp/pull/30316))

## Performance & Optimization
- **Deterministic attention reduction** — `ggml : top-k rows in pick order` makes both kernels emit picks by index so attention always sums in the same order; graph-level alternative in #32299. The PPL reproducer shows ordering sensitivity (PPL = 2.1697 ± 0.045). ([#32297](https://github.com/ggml-org/llama.cpp/pull/32297), [#32299](https://github.com/ggml-org/llama.cpp/pull/32299))
- **qwen4exp QSA under `--kv-unified`** — scores only ubatch k-pools instead of the full cache; reported **-37% decode** regression fixed on DGX Spark with q8_0 KV when an idle long conversation occupies another slot. ([#32247](https://github.com/ggml-org/llama.cpp/pull/32247))
- **Fused KV dequant in MMA flash-attention** — q8_0/q4_0/f8_e4m3 dequantized inside `fattn-mma-f16` instead of materializing f16 K/V in scratch. ([#31802](https://github.com/ggml-org/llama.cpp/pull/31802))
- **CUDA binary size** — fatbin packing with cross-image zstd compression targets the >160 MB CUDA build. ([#31817](https://github.com/ggml-org/llama.cpp/pull/31817))
- **New split heuristic** — backend splitting now starts at incompatible weights even inside input-less splits (b12383). ([#31775](https://github.com/ggml-org/llama.cpp/pull/31775))
- **Small wins** — Metal LFM3 RMS_NORM+MUL+ADD fusion workaround: 293.3 → 302.9 t/s tg128 (+3.3%) on M5 Max. ([#32296](https://github.com/ggml-org/llama.cpp/pull/32296))
- **Correctness-gated perf** — `ggml_cuda_should_fuse_mul_mat_vec_q()` used `<=` Pascal (600), excluding GP100/P100 from the disable path; proposed fix widens the guard. ([#32239](https://github.com/ggml-org/llama.cpp/pull/32239))

## Stability & Regressions (ranked)
1. **Fixed: NVFP4 Qwen2VL garbage output** — `build_ffn` received NULL scales, so per-tensor scales were dropped (PPL ~1e6 CUDA, NaN CPU). Landed in b12385. ([#32241](https://github.com/ggml-org/llama.cpp/pull/32241))
2. **V100/sm_70 prefill regression in v1.0.0** — significant prefill drop vs v0.8.0; no fix PR yet, affects users pinning latest on Volta. ([#32245](https://github.com/ggml-org/llama.cpp/issues/32245))
3. **FP8 KV cache aborts on Metal** — `-ctk/-ctv f8_e4m3` fails at load with `cache_k view in MTL0 cannot run SET_ROWS`. ([#32270](https://github.com/ggml-org/llama.cpp/issues/32270))
4. **iSWA + KV unified slot allocation failure** — no memory slots found on HIP/Vulkan with Gemma 4 Q8_0. ([#32258](https://github.com/ggml-org/llama.cpp/issues/32258))
5. **ROCm/HIP VMM pool hang** — `CU_CHECK(err)` lets `cuMemAddressReserve` spin indefinitely. ([#32105](https://github.com/ggml-org/llama.cpp/issues/32105))
6. **llama-server 413 on >100 MiB bodies** — vendored cpp-httplib default, not runtime-configurable; bites multimodal/large payloads. ([#32274](https://github.com/ggml-org/llama.cpp/issues/32274))
7. **Vulkan GLM-OCR garbage on Intel Arc A380** — full-page images only; CPU and SYCL clean. ([#31836](https://github.com/ggml-org/llama.cpp/issues/31836))
8. **SYCL AOT `arl-h` garbage for >4 GB models** — works around via buffer-size flag. ([#31685](https://github.com/ggml-org/llama.cpp/issues/31685))
9. **Hexagon SM7750 (HTP v73)** — HMX `MUL_MAT` returns inf for n≥5, FLASH_ATTN_EXT and GATED_DELTA_NET fail. ([#29473](https://github.com/ggml-org/llama.cpp/issues/29473))
10. **RPC cross-vendor crash** — Windows Vulkan ↔ macOS Metal "peer closed"/"send failed". ([#32263](https://github.com/ggml-org/llama.cpp/issues/32263))
11. **Fixed: Qwen3.5 tool-call parsing in thinking block** — closed after 60 comments; XML tool calls emitted inside reasoning are now handled. ([#20837](https://github.com/ggml-org/llama.cpp/issues/20837))
12. **Fixed: grammar trigger OOB** — missing range check on `grammar_triggers[].type` allowed remote SIGABRT in llama-server. ([#30835](https://github.com/ggml-org/llama.cpp/issues/30835))

## What This Means for Application Developers
- **Audit NVFP4 configs.** If you serve Qwen2VL (or other VLMs) with NVFP4 weights, you were likely running a silently-broken model before b12385 — re-benchmark quality, not just latency. The same scale-plumbing class of bug can hide elsewhere in quantized multimodal paths.
- **Atomics and determinism.** The top-k ordering work (#32297/#32299) shows attention accumulation order affects PPL. If you rely on "same prompt → same logits," pin builds and prefer these when merged; conversely, expect small numeric shifts across builds.
- **Unified KV has a real cost.** #32247 quantifies it: an idle long-context slot degraded decode in other slots by ~37%. If you run a shared server with heterogeneous conversation lengths, either isolate slots or track this fix.
- **Server limits bite agents.** #32274's 100 MiB cap is a hard wall for large multimodal requests and batch payloads — plan client-side chunking until configurable. Similarly, #30564 (Anthropic `/v1/messages` drops `output_config.effort`) means Claude-compatible clients can't tune reasoning effort; don't rely on it.
- **Speculative-decoding churn is high.** DFlash refactor (b12377) plus DFlash2 model support (#31904) and the glm5-next `t_layer_inp` abort (#30093) suggest the draft/spec layer is still moving — validate draft-model pairings per release if that's on your critical path.
- **Qualify older hardware explicitly.** V100 (#32245), Pascal fusion (#32239), and SM70 flash-attn crashes (#28661) form a coherent Volta/Pascal risk cluster; keep a v0.8.x pin as fallback if those are in your fleet.

</details>

<details>
<summary><strong>Ollama</strong> — <a href="https://github.com/ollama/ollama">ollama/ollama</a></summary>

# Ollama Digest — 2026-11-15

## 1. Today's Highlights
No releases landed in the last 24 hours, but the project saw a busy issue/PR day centered on tool-call correctness and multi-GPU memory accounting. Two long-running themes converged: qwen3.5/qwen3-coder tool-call parser fragility (#19694, fix PR #16398) and VRAM accounting bugs that cause incorrect eviction and unnecessary GPU splitting (PR #19632). Speculative decoding on Apple silicon also advanced with batched verification in the MLX runner (PR #19663).

## 2. Releases & Breaking Changes
None in the last 24h. No API or config changes were announced.

## 3. New Model & Hardware Support
- **Intel NPU backend request closed** — Issue [#19535](https://github.com/ollama/ollama/issues/19535) (OpenVINO-based NPU support for Core Ultra) was closed; no merged backend in this window, but the closure suggests maintainer triage rather than implementation.
- **Qwen tool-call format drift** — PR [#16398](https://github.com/ollama/ollama/pull/16398) makes the qwen3.5/qwen3-coder parsers tolerate wrapper-format drift from `qwen3.6` tags (fixes [#16383](https://github.com/ollama/ollama/issues/16383)). Relevant if you serve qwen3.6:27b.

## 4. Performance & Optimization
- **Batched speculative verification in mlxrunner** — PR [#19663](https://github.com/ollama/ollama/pull/19663) keeps drafting active when multiple requests overlap, preserving MTP/DFlash/DFlash2 speedups under concurrent load. Builds on [#19197](https://github.com/ollama/ollama/pull/19197).
- **VRAM accounting and GPU splitting fixes** — PR [#19632](https://github.com/ollama/ollama/pull/19632) addresses models being wrongly evicted, refusing to load, or split across GPUs unnecessarily; closes #19463, #18679, #18349, #16599. High-value for multi-GPU and unified-memory hosts.
- **WSL2 GPU memory cap** — Issue [#19519](https://github.com/ollama/ollama/issues/19519): on RTX Spark N1X laptops with 80 GB dedicated GPU memory, WSL2 caps usable GPU memory at the guest's free RAM, forcing partial offload. No fix PR yet.

## 5. Stability & Regressions
Ranked by severity:

1. **Qwen tool-call corruption / lost calls** — Issue [#19694](https://github.com/ollama/ollama/issues/19694) (v0.40.15): `qwenTagRegex` in `model/parsers/qwen3coder.go` / `qwen35.go` corrupts tool-call arguments or drops calls depending on content and stream chunking. Fix PR [#16398](https://github.com/ollama/ollama/pull/16398) is open. **Affects any agent relying on qwen3-coder tool calls.**
2. **Windows `/api/chat` 500 on long prompts** — Issue [#19696](https://github.com/ollama/ollama/issues/19696): ~70k+ char prompts intermittently fail with `wsarecv reset` after ~19s (12/20 runs observed); retry usually succeeds. Root cause traced to disabled runner client keep-alive. No fix PR yet.
3. **VRAM accounting / eviction bugs** — Issues #19463, #18679, #18349, #16599; fix PR [#19632](https://github.com/ollama/ollama/pull/19632) open.
4. **`ollama list` panic on short digests** — PR [#14251](https://github.com/ollama/ollama/pull/14251) adds a length check before slicing to fix a runtime panic (fixes [#14250](https://github.com/ollama/ollama/issues/14250)).
5. **Download chunk error handling** — PR [#19698](https://github.com/ollama/ollama/pull/19698): `downloadChunk` ignored `resp.StatusCode` and copied error bodies into the part writer (e.g. corporate proxies). Fix in review.
6. **Anthropic `/v1/messages` tool_result naming** — PR [#19588](https://github.com/ollama/ollama/pull/19588): `tool_result` blocks carried no tool name, breaking templates that render `.ToolName`.
7. **Untriaged bug report** — Issue [#19701](https://github.com/ollama/ollama/issues/19701) (Chinese-language, no repro details yet).

## 6. What This Means for Application Developers
- **If you run qwen3-coder/qwen3.5 for agents, pin and test tool-call parsing.** Issue #19694 describes silent corruption and dropped calls under streaming — exactly the failure mode that breaks agent loops without obvious errors. Watch PR #16398 for the fix.
- **Multi-GPU and unified-memory users should track PR #19632.** Incorrect eviction and forced GPU splitting directly affect model load reliability and throughput; the fix is in review, not yet merged.
- **Windows long-context agents need retry logic.** Until #19696 is fixed, wrap `/api/chat` calls with idempotent retry on 500 before first token; ~60% failure rate was observed on 70k+ char prompts.
- **Speculative decoding under concurrency is improving on Apple silicon.** If you batch requests against MLX-backed models, PR #19663 restores drafting speedups that were previously disabled during overlap.
- **No new integrations of substance** — today's README PRs (#19703 PipesHub, #19702 SynapCores, #19700 ForgeMind, #19697 inference-vitals, #19695 SelectTranslate) are community listings only.

</details>

<details>
<summary><strong>LiteLLM</strong> — <a href="https://github.com/BerriAI/litellm">BerriAI/litellm</a></summary>

# LiteLLM Digest — 2026-11-15

## 1. Today's Highlights

LiteLLM shipped **v1.108.9** (Docker images now cosign-signed) alongside an **rc.4 build of v1.107.0** carrying the reviewed merge of #51771. The issue tracker is dominated by gateway-level regressions rather than model support: a **budget-reservation under-counting bug on `/v1/responses`** (concurrent calls can overrun `max_budget`), a **client-disconnect cancellation regression introduced in 1.107.0**, and **MCP `tools/list` latency spikes of 18–50s** on legacy protocol versions after upgrading to v1.108.0. Meanwhile, PR activity shows a clear push toward a control plane (audit sinks, OCSF events, runtime dataplane writes) and a Rust rewrite of the dynamic rate limiter.

## 2. Releases & Breaking Changes

- **v1.108.9** — Docker images signed with cosign using the key introduced in commit `e82a3c6`; verification instructions included in release notes. https://github.com/BerriAI/litellm/releases
- **v1.107.0-rc.4** — Built from `a1a541b` (reviewed merge of #51771 into `rc/1.107.0`); published as `1.107.0rc4` on PyPI and `v1.107.0-rc.4` on Docker. Release notes reference an "Oct 21 incident." https://github.com/BerriAI/litellm/releases
- **PR #51873 (open, breaking)** — `fix(proxy)!: improve dashboard session handling` — marked breaking; review before upgrading. https://github.com/BerriAI/litellm/pull/51873
- **PR #51540 (draft)** — Rust callback replaces the Python `dynamic_rate_limiter_v3` as the *only* implementation; the Python version is deleted. Stacks on limiter port #51537. https://github.com/BerriAI/litellm/pull/51540
- **Schema-change transparency request (open)** — Issue #41743 asks releases to publish DB schema deltas and rolling-upgrade procedures; currently release pages say nothing about schema, which matters for v1.108.x upgrades. https://github.com/BerriAI/litellm/issues/41743

## 3. New Model & Hardware Support

No new model or backend support landed in this window. In flight:

- **OpenAI/Azure Skills API routing** — feature request #37074 for native Skills CRUD, versioning, and content retrieval (Azure targeting Azure OpenAI). https://github.com/BerriAI/litellm/issues/37074
- **Central model/provider request board #18686** remains the canonical place for new integration votes. https://github.com/BerriAI/litellm/issues/18686
- **Partial wildcard listing gap** — unprefixed `model_name: gemini-*` routes traffic correctly but never appears in `/v1/models` or `/model/info` (#51534). https://github.com/BerriAI/litellm/issues/51534

## 4. Performance & Optimization

- **MCP `tools/list` blocked 18–50s** on v1.108.0 for clients sending `notifications/initialized` with pre-2026 protocol versions (e.g., Python `mcp` SDK used by Open WebUI). Legacy subscription listener regression vs. v1.106.6. https://github.com/BerriAI/litellm/issues/50065
- **Bimodal TTFB on streaming Anthropic `/v1/messages`** — ~16.7s tail vs ~2s normal, not reproducible against Bedrock directly (#38689). https://github.com/BerriAI/litellm/issues/38689
- **Ollama SDK overhead** — `get_runtime_model_info` ignores request `api_base`, adding ~8s of silent localhost connect timeouts per completion against non-default hosts (#37041). https://github.com/BerriAI/litellm/issues/37041
- **`/team/info` roster blowup (PR #51885)** — full roster loaded per call; a 25k-member team costs ~3s and 7MB per call and stalls other requests. Fix adds pagination. https://github.com/BerriAI/litellm/pull/51885
- **Model capacity limiter in Rust (PR #51540)** — draft port targeting lower per-request limiter overhead. https://github.com/BerriAI/litellm/pull/51540
- **Congestion-triggered priority queue controller (PR #51883, open)** — shared priority ordering across workers during provider congestion, with stale-grant and unbounded-wait avoidance. https://github.com/BerriAI/litellm/pull/51883

## 5. Stability & Regressions

Ranked by severity:

1. **Budget overrun on `/v1/responses` (#51445, open)** — Reservation is sized from the first non-null of `max_completion_tokens`/`max_tokens`/`max_output_tokens`, but only `max_output_tokens` is forwarded upstream. A caller setting `max_tokens: 1` reserves one output token while the real request can generate far more; concurrent calls overrun `max_budget`. **Fix PR exists: #51752** (sizes reservation from route output-cap fields). https://github.com/BerriAI/litellm/issues/51445 · https://github.com/BerriAI/litellm/pull/51752
2. **Streaming not cancelled on pre-first-chunk client disconnect (1.107.0 regression, #51393)** — Router now reads the first chunk before returning (`_aread_first_chunk`, `router_python_core.py:5056` in 1.109.1); that read happens before cancellation wiring, so abandoned streams keep billing upstream. https://github.com/BerriAI/litellm/issues/51393
3. **MCP `tools/list` 18–50s stall (#50065, open, 10 comments)** — See Performance. https://github.com/BerriAI/litellm/issues/50065
4. **MCP `true_passthrough` expired OAuth returns 200 + empty tools instead of 401 (#49223, open)** — Clients never see `WWW-Authenticate`, so they never refresh tokens; per-server `/mcp/<server>` affected. https://github.com/BerriAI/litellm/issues/49223
5. **Model Armor guardrail bypass on Responses API (#49909, open)** — Pre-call hook reads `data.get("messages")` and early-returns when absent; Responses requests use `input`, so scans are skipped. Security-relevant. https://github.com/BerriAI/litellm/issues/49909
6. **Gemini image requests write no SpendLogs row (#49567, open)** — 200 OK with correct usage but silent accounting skip; state-dependent. https://github.com/BerriAI/litellm/issues/49567
7. **Vertex AI Claude versioned IDs default to 4096 max_tokens (#40363, closed)** — Also `vertex_ai/claude-haiku-4-5*` map entries capped output at 8192 vs 64000. https://github.com/BerriAI/litellm/issues/40363
8. **`/v1/rerank` ignores `cancel_on_disconnect` (#51197, closed)** — Abandoned reranks hold upstream calls until timeout and retry. https://github.com/BerriAI/litellm/issues/51197
9. **Budget reset job erases carried spend for rollover-capped end users (#50898, closed)** — Reset commits spend pages before advancing the budget window; retries re-walk already-reduced rows against a rollover cap. https://github.com/BerriAI/litellm/issues/50898
10. **`silent_model` breaks Responses/Messages primary requests with HTTP 500 (#34890)** — `AsyncCompletions.create() got an unexpected keyword argument 'silent_model'`; Chat Completions unaffected. https://github.com/BerriAI/litellm/issues/34890
11. **Cohere embedding ignores `COHERE_API_BASE` (#50248, closed)** — Rerank honors it; embeddings hardcode `api.cohere.ai/v2/embed`. https://github.com/BerriAI/litellm/issues/50248
12. **Health-check routing forgets deployment states periodically (PR #51886, open)** — Redis deadline not renewed on every write; dead deployments get real traffic and wait through retries. https://github.com/BerriAI/litellm/pull/51886
13. **Background jobs start before Prisma engine ready (PR #29906)** — Cause of spend-data gaps during rolling deploys on Wolfi images. https://github.com/BerriAI/litellm/pull/29906

Also closed today: #50156 (OpenRouter streaming empty post-finish choice), #50514 (Bedrock detached-drain never closes httpx response), #51638 (Complexity Router drops generation settings), #41639 (Vertex AI `anyOf` tool schema rejection).

## 6. What This Means for Application Developers

- **Do not trust budget reservations on `/v1/responses` yet.** If you run multi-tenant or per-key budgets with concurrent Responses API traffic, upgrade to a build containing PR #51752 or enforce `max_output_tokens` at the gateway config layer; `max_tokens` is a reservation lever only, not an upstream cap.
- **Treat 1.107.0+ as having a cancellation hole for streaming.** Long-running agent streams that lose their client may keep generating and billing until upstream completion. If you rely on `cancel_on_disconnect` semantics for cost control, pin to a pre-1.107 build or verify once #51393 is fixed.
- **Audit MCP deployments before upgrading past v1.106.6.** Two independent MCP issues (#50065 latency, #49223 stale-token 200s) affect clients like Open WebUI and any SDK that pins older protocol versions; if your agent framework depends on `tools/list` responsiveness, stage the upgrade behind a canary.
- **Guardrail coverage is not uniform across endpoints.** Model Armor currently skips Responses API `input` (#49909). If you route compliance-sensitive traffic through `/v1/responses`, don't assume pre-call scanning is active.
- **Provider routing semantics still bite on non-chat endpoints.** `silent_model` breaks Responses/Messages; `openai/` models with custom `api_base` get routed to the Responses API from `/v1/messages` (#37088). Prefer explicit `custom_llm_provider` and chat-completions paths for self-hosted OpenAI-compatible backends.
- **Cosign verification is now available and should be wired into your deploy pipeline** — v1.108.9 embeds the signing key provenance; add `cosign verify` to admission policies if you run LiteLLM in regulated environments.
- **Watch the control-plane track** (PRs #49660/#49661/#49662/#51762: OCSF audit events, S3 Object Lock, Splunk HEC, Sentinel sinks, runtime dataplane writes). If you're planning compliance or chargeback integrations (see also #49360 usage-export metadata), these PRs indicate where the roadmap is heading — but none have landed.

</details>

<details>
<summary><strong>Unsloth</strong> — <a href="https://github.com/unslothai/unsloth">unslothai/unsloth</a></summary>

# Unsloth Digest — 2026-11-15

## Today's Highlights

No releases in the last 24h, but the PR queue is very active on the training-infrastructure side: **native DeepSeek-V4.1 support** ([#17778](https://github.com/unslothai/unsloth/pull/17778)) and **FSDP2/TP/PP sharding for Qwen3.8-Flash-Next and DeepSeek-V4.1** ([#17785](https://github.com/unslothai/unsloth/pull/17785)) landed in review. On the inference side, three ROCm reports on gfx1151/gfx942 and two llama.cpp-upgrade regressions (MTP broken, ~37% throughput drop) dominate the issue tracker and warrant attention before adopting the latest engine builds.

## Releases & Breaking Changes

No releases in the last 24h.

Two behavior changes are queued in PR form and worth tracking as they will affect existing setups:

- **Static cache removed next to caller-supplied `past_key_values` / assisted decoding** in `FastModel.generate()` — currently `cache_implementation="static"` is set unconditionally, which transformers rejects in those two call paths ([#17784](https://github.com/unslothai/unsloth/pull/17784)).
- **Private-push guard extended to Decision and SentenceTransformer `push_to_hub` paths** — `create_repo(private=True, exist_ok=True)` silently leaves an existing public repo public; the guard added in #17752 is now being applied to these two remaining call sites ([#17783](https://github.com/unslothai/unsloth/pull/17783)).

## New Model & Hardware Support

- **Native DeepSeek-V4.1** — modeling ported from the deepseek-ai reference, with sparse attention, engram tables, and FP8/MXFP4 release loading. Removes the dependency on the community transformers port, which failed on the fake-medium test model (fp16 `Half != float`, fp8 tables requiring the `kernels` package). LoRA/QLoRA training on V4.1 no longer needs that port ([#17778](https://github.com/unslothai/unsloth/pull/17778)).
- **FSDP2 + tensor parallel + pipeline parallel for Qwen3.8-Flash-Next (`qwen4_exp`) and DeepSeek-V4.1** — frozen n-gram / engram lookup tables are explicitly never sharded. Stacked on #17778 ([#17785](https://github.com/unslothai/unsloth/pull/17785)).
- **Gemma-4 chat templates** — fixed rendering of list-of-parts system messages (the OpenAI/multimodal shape produced by processor-based VLM datasets) so the parts' text is rendered instead of the Python `repr` of the list ([#17781](https://github.com/unslothai/unsloth/pull/17781)).
- **NVFP4 / MXFP4 compressed-tensors checkpoints** — unquantized tensors in packed compressed-tensors checkpoints were being randomly initialized under transformers 5.21+; also keeps grouped Linears out of QAT ([#17775](https://github.com/unslothai/unsloth/pull/17775)).
- **Unsloth Desktop PWA** — adds a proper 180×180 `apple-touch-icon` so iOS "Add to Home Screen" no longer falls back to a letter tile ([#17776](https://github.com/unslothai/unsloth/pull/17776), issue [#17773](https://github.com/unslothai/unsloth/issues/17773)).

## Performance & Optimization

Concrete numbers from issues updated today:

- **MTP draft acceptance regression on Qwen3.8-Flash-Next**: with Unsloth Dynamic v3.1 GGUFs plus the existing MTP draft heads, speculative acceptance drops from ~74% to **56–66%** at production (non-greedy) temperature on Ryzen AI Max+ 395. Reporter asks whether 3.1-matched draft heads are planned; no fix PR yet ([#17402](https://github.com/unslothai/unsloth/issues/17402)).
- **ROCm, gfx1151, GDN causal conv1d**: falls back to MIOpen; the HIP gate costs **3.1× step time**, while the Triton kernel is reportedly correct — i.e., an easy win if the gate is fixed ([#17734](https://github.com/unslothai/unsloth/issues/17734)).
- **ROCm hybrid linear-attention packing** (`UNSLOTH_EXPERIMENTAL_HYBRID_PACKING=1`): passes the built-in exactness probe but yields **no net speedup on gfx1151** — step count halves, per-step cost nearly doubles ([#17738](https://github.com/unslothai/unsloth/issues/17738)).
- **Desktop GUI cost**: on Linux Mint + Intel B70, minimizing the GUI yields a **~300% tok/s increase**; reporter notes it can be reclaimed via Settings → Appearance without an env var ([#17722](https://github.com/unslothai/unsloth/issues/17722)).
- **llama.cpp CUDA upgrade regression**: Qwen3.8 27B drops from **60 tok/s to 38 tok/s** (~37% loss) after upgrading llama.cpp — root cause unclear ([#17728](https://github.com/unslothai/unsloth/issues/17728)).

Training-side in-progress fixes (PRs, not yet merged):

- **FSDP2 resume on expert-LoRA adapters** previously crashed because Zoo's factor-swapped expert LoRA layout (swapped `lora_A`/`lora_B`, `target_parameters`) differs from vanilla PEFT; PR undoes the swap before load ([#17780](https://github.com/unslothai/unsloth/pull/17780)).
- **QAT bypass in cached decode and single-sample `lm_head`**: prepared TorchAO QAT modules apply fake quantization in `forward()`, but cached decode reads raw `.weight`, so duplicating an input from batch 1 to batch 2 could change logits ([#17746](https://github.com/unslothai/unsloth/pull/17746)).

## Stability & Regressions

Ranked by severity for production inference:

1. **MTP broken after llama.cpp b12340-mix-6186f42** — reported today; MTP stopped working entirely on Unsloth Desktop after the engine update. No fix PR yet ([#17733](https://github.com/unslothai/unsloth/issues/17733)).
2. **~37% throughput regression on Qwen3.8 27B** after the llama.cpp CUDA upgrade (60→38 tok/s). No fix PR yet; consider pinning the previous engine build ([#17728](https://github.com/unslothai/unsloth/issues/17728)).
3. **MTP acceptance collapse with UD 3.1 weights** on Qwen3.8-Flash-Next (74% → 56–66%); indicates the published draft heads are not matched to the new dynamic quant recipe ([#17402](https://github.com/unslothai/unsloth/issues/17402)).
4. **ROCm 7.14 / MI300X (gfx942) stride assertion** in `_scaled_dot_product_flash_attention_backward`, forcing a MATH fallback ([#17548](https://github.com/unslothai/unsloth/issues/17548)).
5. **ROCm gfx1151 kernel regressions** — GDN conv1d MIOpen fallback (3.1× step time) and hybrid packing net-zero speedup, both with Triton kernels available and correct ([#17734](https://github.com/unslothai/unsloth/issues/17734), [#17738](https://github.com/unslothai/unsloth/issues/17738)).
6. **GPU idle after engine update; only "Restore installation" recovered inference** on Desktop v0.1.917-beta / llama.cpp b12319 — closed, but a signal about the engine-update path ([#17663](https://github.com/unslothai/unsloth/issues/17663)).
7. **0.1.917 forces mmap despite `--load-mode none`**, causing excessive RAM/SSD usage (closed regression from 0.1.916) ([#17605](https://github.com/unslothai/unsloth/issues/17605)).
8. **Windows Application Control blocks `_socket` DLL** during Studio setup on managed corporate laptops ([#17735](https://github.com/unslothai/unsloth/issues/17735)).
9. **Docker: `audio.cpp` update fails with "invalid cross-device link"** ([#17638](https://github.com/unslothai/unsloth/issues/17638)).
10. **MOSS-Transcribe-Diarize fails on long audio** because Studio never sends `max_tokens` ([#17598](https://github.com/unslothai/unsloth/issues/17598)).

Correctness/UX bugs closed today (worth noting as fixed, but check version): assistant-message background mismatch ([#17724](https://github.com/unslothai/unsloth/issues/17724)), `TextPreprocessor.validate_dataset` miscounts for dict input / raises on `IterableDataset` ([#17730](https://github.com/unslothai/unsloth/issues/17730)), combined CSV export re-imports as one merged chat ([#17655](https://github.com/unslothai/unsloth/issues/17655)), Markdown files hidden in the Projects import picker ([#17651](https://github.com/unslothai/unsloth/issues/17651)), Cloudflare/mobile chat updates not reconciled in Desktop WebView ([#17689](https://github.com/unslothai/unsloth/issues/17689)).

Test-infrastructure note: `test_orchestrator_switch_waits.py::test_worker_crash_mid_frame_cannot_block_the_shutdown_deadline` was flaky across unrelated PRs; fixed by writing the partial frame directly instead of racing the drainer ([#17782](https://github.com/unslothai/unsloth/pull/17782)).

## What This Means for Application Developers

- **If you serve Qwen3.8-Flash-Next with speculative decoding**: do not assume the UD 3.1 GGUF repack preserves MTP acceptance. Benchmark acceptance rate at your production temperature before deploying; the current heads show a ~8–18 point drop. If you are on llama.cpp ≥ b12340, note that MTP is reported fully broken — pin the prior engine build until this is resolved.
- **If you train on DeepSeek-V4.1 or Qwen3.8-Flash-Next at scale**: native modeling plus FSDP2/TP/PP support are arriving ([#17778](https://github.com/unslothai/unsloth/pull/17778), [#17785](https://github.com/unslothai/unsloth/pull/17785)), including correct handling of frozen engram/n-gram tables under sharding. If you resume expert-LoRA jobs from checkpoints saved via Zoo, watch for [#17780](https://github.com/unslothai/unsloth/pull/17780) — resume currently crashes on that layout.
- **If you use quantized training**: NVFP4/MXFP4 packed compressed-tensors checkpoints currently have randomly initialized unquantized tensors under transformers 5.21+; the fix is in [#17775](https://github.com/unslothai/unsloth/pull/17775). Similarly, if you rely on TorchAO QAT, cached decode currently bypasses fake quantization ([#17746](https://github.com/unslothai/unsloth/pull/17746)) — expect logits to differ between cached and uncached paths until that lands.
- **If you run on ROCm (gfx1151 / gfx942)**: treat the hybrid-packing flag as experimental with no demonstrated speedup, expect MIOpen fallbacks for GDN conv1d, and expect a MATH fallback for the SDPA backward on MI300X. Budget for significantly lower throughput versus CUDA on the same hardware until the kernel gates are fixed.
- **If you ship Unsloth Desktop to end users on Windows**: Application Control policies can block `_socket` at setup ([#17735](https://github.com/unslothai/unsloth/issues/17735)); if you use the WebView, be aware cross-device (Cloudflare/mobile) chat state is not reconciled in the embedded view ([#17689](https://github.com/unslothai/unsloth/issues/17689)).
- **General**: with no release cut today, today's digest is mostly a "commit queue + regression watch" picture. The strongest signals for planning are the two llama.cpp engine-update regressions (MTP broken, 37% tok/s loss) and the ROCm fallbacks — all of which argue for pinning inference engine versions in production and testing upgrades against your exact model/quant pair before rollout.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*