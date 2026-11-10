# AI Infrastructure Digest 2026-11-10

> Generated: 2026-11-10 03:25 UTC | Projects covered: 6

- [vLLM](https://github.com/vllm-project/vllm)
- [SGLang](https://github.com/sgl-project/sglang)
- [llama.cpp](https://github.com/ggml-org/llama.cpp)
- [Ollama](https://github.com/ollama/ollama)
- [LiteLLM](https://github.com/BerriAI/litellm)
- [Unsloth](https://github.com/unslothai/unsloth)

---

## Cross-Project Comparison

# Cross-Project Comparison Report — AI Infrastructure Ecosystem
**Date: 2026-11-10 | Projects: vLLM, SGLang, llama.cpp, Ollama, LiteLLM, Unsloth**

---

## 1. Ecosystem Overview

The AI infrastructure stack is in a **hardening phase**, not a feature-expansion phase: no project shipped a major release in the 24h window, and issue trackers are dominated by correctness, regression, and cross-tenant safety bugs rather than new capabilities. **Blackwell (SM120/SM121) and AMD ROCm/gfx95x are the two dominant hardware frontiers**, with vLLM and SGLang both racing to stabilize support while reporting that SM120 is not yet production-safe for DeepSeek-V4.1-class workloads. **Speculative decoding (EAGLE/MTP/DFlash/DSPARK) has emerged as a systemic risk area** — acceptance-rate collapses, prefix-cache throughput losses, and temp-0 non-determinism are reported across vLLM, SGLang, and llama.cpp simultaneously. Meanwhile, the gateway and local-runtime layers (LiteLLM, Ollama) are absorbing agentic-workload requirements: structured tool calls, Responses API compatibility, compaction, and multi-tenant rate limiting. The overall signal is that **inference correctness and multi-tenant isolation — not raw throughput — are the current gating factors for production deployment.**

---

## 2. Activity Comparison

| Project | Layer | Issues (active/high-impact) | PRs (active, in-flight) | Release Status | Headline Signal |
|---|---|---|---|---|---|
| **vLLM** | Serving engine | 10 ranked stability items + 3 perf trackers | ~15 landing/review + 6 fix PRs | **None** in 24h | SM120 CUDA-graph blocker; ROCm gfx950 sweep |
| **SGLang** | Serving engine | 8 ranked stability items | 5 fix PRs in flight | **None** in 24h (v0.5.23 regression) | Tenant KV use-after-free; SM90 decode reg. |
| **llama.cpp** | Local runtime | 10 ranked stability items | Multiple model/backend PRs | **Dense — b12229→b12242** (14 builds) | Audio speech + tool-grammar + Responses fixes |
| **Ollama** | Local runtime | 8 ranked stability items | ~5 open PRs | **v0.40.16** shipped | Ripple Preview 65B; ~27 GiB macOS win |
| **LiteLLM** | Gateway | ~20 ranked (8 rate-limiter/budget) | ~12 open PRs | **v1.108.4 LTS patch** | v3 limiter correctness bugs; SpendLogs backport |
| **Unsloth** | Fine-tuning/Studio | ~10 ranked | ~7 perf PRs + merges | **None** in 24h | ROCm INT8 kernels; Studio startup trimming |

**Reading the table:** llama.cpp and Ollama are the only projects shipping user-facing artifacts today. vLLM/SGLang are in fix-queue mode (release cadence paused). LiteLLM's LTS patch plus SpendLogs backport is the most deployment-relevant action for gateway operators.

---

## 3. Model Support Race

| Model / Arch | vLLM | SGLang | llama.cpp | Ollama | Unsloth |
|---|---|---|---|---|---|
| **DeepSeek-V4 / V4.1** | ROCm TP8 MegaMoE draft; JIT stability fix | **Blocked on SM90 reg.** (pin v0.5.22) | — | — | — |
| **Qwen3.8-Flash-Next / qwen4_exp** | SP+PP combined PR #65859 | — | — | **~27 GiB macOS win** | — |
| **Qwen3.5 / 3.6 / 3.5-MoE** | — | — | — | Parallel unblock PR #17144 | **Flex-attn decode graphs** #17329 |
| **Gemma 4** | — | **FA4 FP8 KV (SM90)** #46965 | **Audio-stream input** b12237 | — | **Flex-attn decode** #17329 |
| **Kimi-K3** | Gluon MLA decode TP8/16 | — | — | — | — |
| **GLM-5.x** | grouped_topk skip | GLM-5.3-Flash SM120 crash #42012 | — | — | — |
| **MiMo-V2.5/2.6** | grouped_topk; DFlash TP>1 collapse | — | — | — | — |
| **Nemotron 3.5 ASR** | Feature request #47455 | — | — | — | — |
| **Ripple Preview 65B** | — | — | — | **Shipped v0.40.16** | — |
| **FLUX.3 / Qwen-Image-2.1** | — | — | — | — | **INT8 ConvRot + ROCm W8A8** |

**Who's ahead:**
- **vLLM** leads on frontier LLM breadth (DeepSeek-V4.1, Kimi-K3, Qwen3.8) — but supports them *with caveats* (SM120 broken, TP>1 speculative issues).
- **Unsloth** leads on **diffusion + fine-tuning** model support (FLUX.3, Qwen-Image-2.1 INT8) and is the only project extending flex-attention to Gemma 4/Qwen3.5-3.6 decode graphs.
- **Ollama** uniquely shipped a *net-new proprietary model* (Ripple Preview) — a signal that local runtimes are moving up the stack into curated model distribution.
- **llama.cpp** leads on **multimodal/audio** (Gemma 4 audio, TTS via WebGPU, resampler helper) and OpenAI Responses API schema parity.
- **SGLang** is the only project landing **FA4 SM90 FP8 KV cache** — a genuine capability gap it closed for Gemma 4.

---

## 4. Performance Frontier

| Optimization Axis | vLLM | SGLang | llama.cpp | Ollama | Unsloth | LiteLLM |
|---|---|---|---|---|---|---|
| **KV cache** | FlashInfer workspace 394→32 MiB (+21% KV cap); offload DMA tuning | HiCache `buffer_only` OOM bug | **Truncation bug open (#11970)** | — | — | — |
| **Batching / scheduler** | KV admission backoff (2.3× TPOT) | Idle-path throttle #39315 | — | Parallel gen (MLX #19197) | Long-chat gate #17336 | WebSocket turn accounting #50730 |
| **Quantization** | Quark `w_mxfp4_a_mxfp8`; MXFP4 DSA indexer | — | SYCL Q4_0→u4 GEMM (−1,224 µs) | — | **ROCm RDNA INT8 (−26–34%)** | — |
| **Distributed serving** | TP all-reduce; MoRI EPv2; wvSplitKrc | PD disaggregation roadmap #43699; `prefix_affinity` LB | — | Vulkan RPC (DSv4.1 gibberish) | — | — |
| **Kernels** | Gluon MLA, gfx950 GEMMs, FlashInfer | Split-K GEMV gfx1151 | CUDA FWFA row-faithful; Vulkan coopmat N≤32; HIP MMQ | — | Triton W8A8 gfx11xx/gfx12xx | — |
| **Startup/memory** | — | — | — | **−27 GiB macOS** | Lazy imports (#17267…) | — |
| **Spend/log perf** | — | — | — | — | — | SpendLogs index #50823 |

**Concentration:** The single largest cluster of optimization effort is **ROCm/gfx9xx and gfx11xx kernel work** (vLLM, SGLang, Unsloth all engaged). The second is **KV-cache memory accounting** — vLLM gained +21% KV capacity via a workspace fix, while SGLang and llama.cpp are fighting cache *correctness* (OOM, truncation) rather than capacity. Quantization effort has bifurcated: **MXFP4/MXFP8 on datacenter (vLLM), INT8 on RDNA (Unsloth), Q4_0-u4 on SYCL (llama.cpp).**

---

## 5. Layer Positioning

```
┌─────────────────────────────────────────────────────────────┐
│  APPLICATION / AGENT FRAMEWORKS                              │
├─────────────────────────────────────────────────────────────┤
│  GATEWAY / CONTROL PLANE                                     │
│  ► LiteLLM — routing, budgets, rate limits, PII, MCP,        │
│    provider translation. Multi-tenant spend control.         │
├─────────────────────────────────────────────────────────────┤
│  SERVING ENGINES (datacenter, multi-GPU, disaggregated)      │
│  ► vLLM — breadth, Blackwell/ROCm frontier, speculative      │
│  ► SGLang — PD disaggregation, radix cache, RLHF infra       │
├─────────────────────────────────────────────────────────────┤
│  LOCAL / SINGLE-NODE RUNTIMES                                │
│  ► llama.cpp — backend breadth (CUDA/Vulkan/SYCL/Hexagon/    │
│    RISC-V), GGUF, audio/TTS, server+API compat               │
│  ► Ollama — curated models, Apple silicon, one-line UX       │
├─────────────────────────────────────────────────────────────┤
│  TRAINING / FINE-TUNING / STUDIO                             │
│  ► Unsloth — ROCm kernels, flex-attn, diffusion, Studio UI   │
└─────────────────────────────────────────────────────────────┘
```

**Key differentiators:**
- **vLLM vs SGLang** are direct competitors at the serving-engine layer, but their bug profiles differ: vLLM's pain is *hardware-frontier* (SM120, gfx950), SGLang's is *multi-tenant correctness* (KV isolation, cache OOM) and *CI/regression discipline*.
- **llama.cpp vs Ollama**: llama.cpp is the *engine* (broadest backend matrix, raw GGUF); Ollama is the *product* (curated models, updater, keep-alive defaults). Ollama depends on upstream llama.cpp fixes — e.g., the Qwen3.5 parallel unblock.
- **LiteLLM is orthogonal** — it sits above any of the four engines and is the only project with a supply-chain story (cosign, LTS channel).
- **Unsloth** is the only project spanning **both training and a Studio app**, placing it closest to end-user developers while also shipping low-level RDNA kernels.

---

## 6. Trend Signals

**1. SM120 / consumer Blackwell is the industry's shared pain point.**
vLLM (#56892, #51525), SGLang (#49209, #49173, #42012, #33422) all report SM120 breakage today. This is the single most cross-cutting infrastructure issue. **Watch:** whether any project publishes an SM120 support matrix before year-end.

**2. Speculative decoding is not yet trustworthy.**
Three independent projects report speculative-vs-target divergence: vLLM (#63593 MTP, #66387 DFlash TP>1, #53670 prefix-cache throughput), SGLang (#49336 SM90 decode regression with DSPARK), llama.cpp (#31472 temp-0 identity break). **Developers shipping agent/chat workloads with shared prefixes should benchmark target-only baselines before adopting spec-decode.**

**3. Multi-tenant isolation is now a first-class correctness concern.**
SGLang #49361 (KV use-after-free leaking tenant data) and LiteLLM's rate-limiter cluster (#34140, #49675, #47340) both undermine the guarantee that tenants are isolated. **This is the highest-severity class of bug in today's digest.**

**4. Agentic workloads are shaping the API surface.**
llama.cpp's `/v1/audio/speech` + tool-grammar fix, Ollama's Ripple Preview + `/v1/responses` compaction fix, LiteLLM's `complexity_router`/tool_choice fixes — all are agent-driven. **Watch:** Responses API compatibility and structured tool-call reliability as the new bar for "OpenAI-compatible."

**5. AMD is closing the datacenter gap, but kernel selection is now a risk.**
vLLM's gfx950 PR stack, SGLang's AITER pin tracking, Unsloth's RDNA INT8 — AMD support is landing fast, but vLLM #66141 (silent incorrect output) shows **wrong kernel selection is a silent-failure risk on ROCm.** Developers must validate numerics, not just throughput.

**6. Determinism / reproducibility is under strain.**
SYCL logprobs nondeterminism (llama.cpp #31206), Marlin MoE order dependence (vLLM #52525), batch-invariance — these matter specifically for **eval harnesses and RLHF**. TRL/RLHF teams should treat reported logprobs as advisory on non-CUDA paths.

**7. Local runtimes are becoming API-compatible products, not just tools.**
Ollama ships models and an updater; llama.cpp ships a Responses API and audio endpoints. **The boundary between "local runtime" and "serving engine" is blurring** — expect consolidation pressure on teams maintaining custom wrappers.

---

### Bottom-Line Recommendations for Infrastructure Engineers

| If you are… | Action today |
|---|---|
| On **SM120 / RTX PRO 6000** | Do not deploy DeepSeek-V4.1 or NVFP4 MoE to production; pin known-good images; track vLLM #56892 and SGLang #49209. |
| On **SM90 with spec-decode** | Hold SGLang at v0.5.22; benchmark vLLM EAGLE/MTP against target-only. |
| Running **multi-tenant serving** | Treat SGLang #49361 as a data-isolation incident; consider disabling unified radix cache. |
| Operating a **LiteLLM proxy on 1.104** | Cherry-pick #50823 or upgrade; do not trust per-model RPM/TPM limits without Redis. |
| Building **agent frameworks** | Require llama.cpp ≥ b12242; watch Ollama `/v1/responses` compaction and Ripple Preview. |
| On **AMD RDNA** | Unsloth #17334 lands usable INT8 diffusion; validate numerics against vLLM #66141-class issues. |

*Report compiled from 2026-11-10 project digests. Issue/PR IDs preserved as reported.*

---

## Per-Project Reports

<details>
<summary><strong>vLLM</strong> — <a href="https://github.com/vllm-project/vllm">vllm-project/vllm</a></summary>

# vLLM Digest — 2026-11-10

## 1. Today's Highlights

No new releases landed in the last 24h, but the issue tracker and PR queue are dominated by **Blackwell (SM120) and ROCm/gfx950 hardening**: a high-traffic SM120 CUDA-graph capture bug (#56892, 31 comments) remains the top unresolved blocker for DeepSeek-V4.1-Flash on RTX PRO 6000, while AMD continues a broad sweep of MI355X optimization PRs (Gluon MLA decode, TP all-reduce, MXFP4 MoE, wvSplitKrc GEMM bands). A cluster of correctness/regression reports also surfaced around **speculative decoding (EAGLE/MTP/DFlash)** and **KV-pool admission behavior**, several with concrete throughput or acceptance-rate numbers.

## 2. Releases & Breaking Changes

None in the last 24h. No new versions, no announced API/config removals or migration notes.

## 3. New Model & Hardware Support

- **Qwen3.8-Flash-Next / qwen4_exp** — Combined sequence parallelism + pipeline parallelism PR open: [#65859](https://github.com/vllm-project/vllm/pull/65859). A separate bug reports DeepSpec DFlash/DSpark drafters are blocked by five code paths: [#56088](https://github.com/vllm-project/vllm/issues/56088).
- **DeepSeek-V4 / V4.1** — ROCm TP8 MegaMoE backend (opt-in `aiter_mega_moe_tp`) in draft: [#63040](https://github.com/vllm-project/vllm/pull/63040). `VLLM_REPLICATE_EMBED` now honored for DSv4.1 input embedding on ROCm: [#66618](https://github.com/vllm-project/vllm/pull/66618).
- **Nemotron 3.5 ASR Streaming** — feature request for `nemotron-3.5-asr-streaming-0.6b`: [#47455](https://github.com/vllm-project/vllm/issues/47455).
- **Responses API** — request for `/v1/responses/input_tokens` preflight support: [#49533](https://github.com/vllm-project/vllm/issues/49533).
- **Quantization format** — New Quark scheme `w_mxfp4_a_mxfp8` (MXFP4 weights + dynamic per-group MXFP8 activations) via AITER `moe_gemm_a8w4` on gfx950: [#66564](https://github.com/vllm-project/vllm/pull/66564).

## 4. Performance & Optimization

**Landing / in review (ROCm / gfx950)**
- Gluon MLA decode extended to non-divisor small head counts (Kimi-K3 at TP8/TP16 currently falls to asm persistent decode): [#66620](https://github.com/vllm-project/vllm/pull/66620).
- vLLM custom all-reduce enabled alongside AITER for mid-size TP all-reduce range: [#66589](https://github.com/vllm-project/vllm/pull/66589).
- `wvSplitKrc` extended to 6–9 row GEMMs (CUDA-graph-friendly band): [#66582](https://github.com/vllm-project/vllm/pull/66582).
- MXFP4 DSA indexer gated on aiter package rather than `VLLM_ROCM_USE_AITER`, unblocking indexer configs: [#66702](https://github.com/vllm-project/vllm/pull/66702).
- MoRIIO WRITE skips prefix-cache blocks the decoder already holds: [#65822](https://github.com/vllm-project/vllm/pull/65822).
- MoRI EPv2 AsyncLL segmented receive read in place (eliminates copy): [#66697](https://github.com/vllm-project/vllm/pull/66697).

**Other**
- `grouped_topk` skips no-op group mask when `topk_group >= num_expert_group` (GLM-5.x, Kimi-K2/K3, MiMo-V2.5): [#66458](https://github.com/vllm-project/vllm/pull/66458) (closed).
- DeepSeek-V4.1 prefill sparse-attention kernels: avoid per-step Triton JIT re-specialization: [#66654](https://github.com/vllm-project/vllm/pull/66654).
- FlashInfer startup workspace sizing: **394→32 MiB** yielded **+21.27% KV-cache capacity** on an RTX 4060 Laptop (SM89) test: [#63399](https://github.com/vllm-project/vllm/issues/63399).
- KV offload DMA/Triton load threshold is currently H100-PCIe-tuned and needs per-device profiling: [#57555](https://github.com/vllm-project/vllm/issues/57555).
- Eager attention backends (Triton etc.) re-derive K/V cache views every call, same class as #59534: [#64572](https://github.com/vllm-project/vllm/issues/64572).

**Trackers**
- MiniMax-M2.7 TP4+EP throughput regression across 0.29/0.31/0.32: [#63705](https://github.com/vllm-project/vllm/issues/63705).
- Qwen3.8-2.4T-A95B (MI355X) optimization plan: [#57149](https://github.com/vllm-project/vllm/issues/57149); Qwen3.8-Flash-Next: [#59575](https://github.com/vllm-project/vllm/issues/59575).
- Kimi K3 perf tracker: [#50587](https://github.com/vllm-project/vllm/issues/50587).

## 5. Stability & Regressions

Ranked by severity:

1. **SM120 CUDA graphs unusable for DeepSeek-V4.1-Flash** — 8× RTX PRO 6000 Blackwell, `--enforce-eager` gives extremely low decode throughput; graph capture fix requested with priority: [#56892](https://github.com/vllm-project/vllm/issues/56892).
2. **ROCM_AITER_MLA silent incorrect output** on gfx950 (fp8 Q+fp8 KV, `gqa_ratio=16`, `decode_qlen` 3–4, non-persistent kernel; `cos_diff` 0.84–0.90): [#66141](https://github.com/vllm-project/vllm/issues/66141) (closed — verify your version).
3. **NVFP4 MoE with explicit CUTLASS backend on SM_120** silently returns empty completions (`content: null`, `finish_reason: length`): [#51525](https://github.com/vllm-project/vllm/issues/51525).
4. **DFlash acceptance collapses at TP > 1** (MiMo-V2.6-Flash-MOPD; TP1 fine): [#66387](https://github.com/vllm-project/vllm/issues/66387).
5. **MTP forced-reject divergence** from target-only on Qwen3.8-27B (GDN hybrid) at K≥5, n≥8, L≥192: [#63593](https://github.com/vllm-project/vllm/issues/63593).
6. **EAGLE/MTP prefix-cache last-block drop** costs a 1,648-token recompute per hit → **~30–40% batch throughput loss** on prefix-reusing speculative decode workloads: [#53670](https://github.com/vllm-project/vllm/issues/53670).
7. **KV-pool-saturated admission retries inflate decode TPOT ~2.3×** — request for automatic admission backoff (V1 scheduler, platform-independent): [#64460](https://github.com/vllm-project/vllm/issues/64460).
8. **Marlin MoE output depends on within-expert token ordering** (batch invariance): [#52525](https://github.com/vllm-project/vllm/issues/52525).
9. **Qwen3.5 vision RoPE angle precision differs from HF** on A800: [#66070](https://github.com/vllm-project/vllm/issues/66070).
10. **Hybrid block-size alignment skipped** on PP ranks owning no attention layer (Kimi-K3, 2×3090): [#51752](https://github.com/vllm-project/vllm/issues/51752).

Fix PRs exist for: DSv4.1 JIT stability [#66654](https://github.com/vllm-project/vllm/pull/66654), pause/abort output delivery in in-process mode [#66703](https://github.com/vllm-project/vllm/pull/66703), partial-tail KV offload for `blocks_per_chunk > 1` under MTP/EAGLE [#58413](https://github.com/vllm-project/vllm/pull/58413), FlashInfer one-sided workspace teardown leak [#63874](https://github.com/vllm-project/vllm/pull/63874), benchmark warmup polluting prefix cache [#66701](https://github.com/vllm-project/vllm/pull/66701), and Olmo3 tool-parser streaming drop on text starting with `<` [#65936](https://github.com/vllm-project/vllm/pull/65936).

## 6. What This Means for Application Developers

- **Blackwell (SM120) is not yet a safe production target for DeepSeek-V4.1 or NVFP4 MoE.** If you are on RTX PRO 6000 / RTX 5090 class hardware, pin to a known-good image, validate with your own eval harness before rollout, and follow #56892 and #51525.
- **Speculative decoding + prefix reuse has measured costs.** If you serve agent/chat workloads with EAGLE/MTP and shared prefixes, benchmark against a target-only baseline — #53670 reports up to ~40% batch throughput loss, and #63593/#66387 show correctness/acceptance caveats on hybrid (GDN) and TP>1 configs.
- **KV-pool pressure can silently degrade tail latency (~2.3× TPOT)** before you see hard errors (#64460). Monitor KV utilization and admission retries, not just error rates.
- **ROCm/gfx950 is converging fast** — MI355X optimizations for Qwen3.8 and Kimi-K3 are landing as stacked PRs. AMD users should track #57149/#59575 and validate against #66141-class kernel selection issues.
- **Tool-calling streaming edge cases persist** (#65936: plain text beginning with `<` dropped under `--tool-call-parser olmo3`). If you build agent frameworks on vLLM's tool parsers, add regression tests for text-that-looks-like-markup.

</details>

<details>
<summary><strong>SGLang</strong> — <a href="https://github.com/sgl-project/sglang">sgl-project/sglang</a></summary>

# SGLang Digest — 2026-11-10

## 1. Today's Highlights

No new releases landed in the last 24h, but issue traffic remains heavy: a long-running CI flakiness tracker (#42752, 191 comments) and the Q4 prefill-decode disaggregation roadmap (#43699) are driving most discussion. On the stability side, two new correctness/security reports stand out — a **use-after-free in `UnifiedRadixCache` that leaks tenant KV data** (#49361) and a **33–45% SM90 decode regression from v0.5.22 → v0.5.23** (#49336). AMD RDNA (gfx1151) and SM120 consumer Blackwell continue to surface backend gaps, with multiple fresh bugs filed today.

## 2. Releases & Breaking Changes

None in the last 24h. Note for planning: issue #49336 reports a **per-step decode regression introduced between v0.5.22 (`baa9befa38`) and v0.5.23 (`297e54fd10`)** on SM90 — pin v0.5.22 if you rely on DeepSeek-V4.1-Flash + DSPARK speculative decoding at concurrency 12.

## 3. New Model & Hardware Support

- **FA4 FP8 KV cache for Gemma-4 (SM90)** — PR #46965 adds FA4 SM90 FP8 e4m3 KV cache for head_dim 256/512, unblocking `--kv-cache-dtype fp8_e4m3` on Gemma-4 full-attention layers. [PR #46965](https://github.com/sgl-project/sglang/pull/46965)
- **Cambricon MLU backend roadmap** — new roadmap issue for a first-class MLU backend. [Issue #45615](https://github.com/sgl-project/sglang/issues/45615)
- **AMD gfx1250 (MI45x) AITER pin tracking** — separate AITER pin path from CDNA; no automated Scout coverage yet. [Issue #47562](https://github.com/sgl-project/sglang/issues/47562)
- **External model extension points** — feature request for registering runtime-defined model classes, attention lookup, kernels, and sampler logprobs without private touchpoints. [Issue #48475](https://github.com/sgl-project/sglang/issues/48475)

## 4. Performance & Optimization

- **SM90 decode regression (high impact)** — +33–45% per-step decode time at concurrency 12 across 8K–64K contexts on H20-3e with DeepSeek-V4.1-Flash; `use_deep_select_decode` also loses acceptance on Hopper. [Issue #49336](https://github.com/sgl-project/sglang/issues/49336)
- **SM120 SM121 DeepGEMM indexer regression** — a recent change dropped SM120/SM121 from the DSV4.1 DeepGEMM indexer gate, causing ~8× prefill regression on GB10 via torch fallback `tolist()` per layer. [Issue #49173](https://github.com/sgl-project/sglang/issues/49173) (closed)
- **SM120 DSV4 prefill throughput gap** — 2–7K tok/s vs ~12.5K reported on vLLM/marlin on identical 4× RTX PRO 6000 hardware; tuning guidance requested. [Issue #33422](https://github.com/sgl-project/sglang/issues/33422)
- **AMD single-row decode GEMV** — split-K bf16 GEMV for bs=1 decode on gfx1151, addressing rocBLAS tile inefficiency. [PR #47077](https://github.com/sgl-project/sglang/pull/47077)
- **Scheduler idle-path optimization** — throttle fully-idle load snapshot publishing to avoid busy-poll queue walks and shared-memory writes. [PR #39315](https://github.com/sgl-project/sglang/pull/39315)

## 5. Stability & Regressions

Ranked by severity:

1. **Use-after-free in `UnifiedRadixCache` exposes tenant KV data** (security) — [Issue #49361](https://github.com/sgl-project/sglang/issues/49361). No fix PR linked yet; treat as high priority for multi-tenant deployments.
2. **SM90 decode regression v0.5.22 → v0.5.23** — [Issue #49336](https://github.com/sgl-project/sglang/issues/49336).
3. **HiCache `buffer_only` + Mooncake L3 prefill OOM** — scheduler admits a chunked prefill it cannot finish, then crashes ("Prefill out of memory", evictable 0, all radix nodes locked). Seen on v0.5.21. [Issue #45989](https://github.com/sgl-project/sglang/issues/45989)
4. **Breakable prefill CUDA graph logprob mismatch** — short prefills padded to a capture bucket diverge from eager (Qwen3.8-27B-NVFP4, hybrid GDN, v0.5.23). [Issue #49133](https://github.com/sgl-project/sglang/issues/49133)
5. **SM120 cannot run any model out-of-the-box with CUDA 13 wheel** — [Issue #49209](https://github.com/sgl-project/sglang/issues/49209).
6. **GLM-5.3-Flash SM120 fa4 crash at CUDA-graph capture** — triton is the only working backend on RTX PRO 6000. [Issue #42012](https://github.com/sgl-project/sglang/issues/42012)
7. **AMD gfx1151 MLA-shaped Triton decode returns NaN/wrong rows on ragged long batches** — [Issue #48967](https://github.com/sgl-project/sglang/issues/48967); and `--enable-deterministic-inference` fails on RDNA due to LDS budget (99 KB needed vs 64 KB). [Issue #48968](https://github.com/sgl-project/sglang/issues/48968)
8. **CI infrastructure** — Xeon SPR hosts OOM-killing KV allocation during tests (#48411); diffusion perf checks runner-dependent (#48311); PP test port binding collision (#49335, PR open); py-spy denied on NVIDIA runners (#48938, PR open).

Fix PRs in flight: PR #49335 (CI port), PR #48938 (py-spy permissions), PR #30551 (propagate pre-queue aborts to decode in PD), PR #34153 (chunked-prefill abort commit race), PR #44722 (detokenizer chunk-relative offsets).

## 6. What This Means for Application Developers

- **If you serve multi-tenant workloads on shared KV cache:** track #49361 closely. A use-after-free that leaks KV data across tenants is a data-isolation risk; consider isolating engines or disabling unified radix cache until a fix lands.
- **If you're on SM90 with speculative decoding:** hold at v0.5.22 until the v0.5.23 decode regression is resolved, or benchmark your specific concurrency before upgrading.
- **If you use HiCache + Mooncake L3 in a disaggregated setup:** #45989 describes a hard crash path under chunked prefill. Validate your memory budget assumptions or avoid `buffer_only` mode for now.
- **If you're evaluating consumer Blackwell (SM120) or AMD RDNA (gfx1151):** out-of-the-box support is still not solid — expect to select triton attention backends manually and validate CUDA version compatibility for SM120 wheels.
- **For agentic/RLHF workloads:** PR #49289 adds P0 RLHF lifecycle test coverage on NPU, and #31170 introduces `prefix_affinity` load balancing targeting multi-turn sessions sharing large system prompts — worth watching if you route agent traffic across DP ranks.

</details>

<details>
<summary><strong>llama.cpp</strong> — <a href="https://github.com/ggml-org/llama.cpp">ggml-org/llama.cpp</a></summary>

# llama.cpp Digest — 2026-11-10

## 1. Today's Highlights

llama.cpp shipped a dense release cycle (b12229–b12242) with a strong server/API push: OpenAI-compatible `/v1/audio/speech` landed, realtime API was consolidated onto the common chat input path, and several `response_format` / tool-grammar edge cases were fixed. On the model side, Gemma 4 now accepts audio streams via `mtmd`, and external PLE file loading enables more flexible sharding/memory layouts. Backend work continues across SYCL, Vulkan, Hexagon, and RISC-V (SpacemiT), while a handful of correctness regressions—particularly KV cache truncation and speculative decoding divergence—remain open and high-impact.

## 2. Releases & Breaking Changes

The 24h window produced a rapid-fire sequence of builds. Notable API-visible changes rather than breaking ones:

- **b12238** — New OpenAI-compatible endpoint: `/v1/audio/speech` ([PR #31763](https://github.com/ggml-org/llama.cpp/pull/31763)). Note the WAV writer truncates while `pcm_f32_to_s16` rounds, so WAV and raw PCM outputs can differ slightly.
- **b12242** — `chat`: lazy grammar is now disabled when `response_format` is set together with tools ([PR #31956](https://github.com/ggml-org/llama.cpp/pull/31956), fixes [#31342](https://github.com/ggml-org/llama.cpp/issues/31342)). Previously, qwen3-coder / deepseek / ministral3 parsers built only the response-format rule but kept the grammar lazy, producing an empty root and HTTP 400.
- **b12240** — `server`: `/v1/responses` now converts `text.format.json_schema` into completions constraints ([PR #26145](https://github.com/ggml-org/llama.cpp/pull/26145)).
- **b12229** — `server`: `response_format` with `type: json_schema` now accepts a top-level schema, not only one nested in the `json_schema` wrapper ([PR #28697](https://github.com/ggml-org/llama.cpp/pull/28697), closes [#10732](https://github.com/ggml-org/llama.cpp/issues/10732)).
- **b12233** — `--ple` is now an alias of `--shard` and supports multiple shard flags; external PLE files can be loaded ([PR #31185](https://github.com/ggml-org/llama.cpp/pull/31185)). Check your launch scripts if you relied on the old single-value semantics.

No license or GGUF-format breaking changes were reported in this window.

## 3. New Model & Hardware Support

- **Gemma 4 audio input (b12237)** — `mtmd` now supports a Gemma 4 input audio stream with a 480 ms step, and realtime embeddings are enabled only for audio generation ([PR #31965](https://github.com/ggml-org/llama.cpp/pull/31965), closes [#31561](https://github.com/ggml-org/llama.cpp/issues/31561)).
- **New resampler helper (b12236)** — `mtmd_helper_resampler` added with docs and tests ([PR #31964](https://github.com/ggml-org/llama.cpp/pull/31964)); this is the prerequisite plumbing for arbitrary-rate audio.
- **Hexagon backend** — 64-bit FastRPC handle truncation fixed on close (b12241, [PR #30952](https://github.com/ggml-org/llama.cpp/pull/30952)) after 64-bit pointer issues; `SSM_SCAN` (f32) added ([PR #31921](https://github.com/ggml-org/llama.cpp/pull/31921), tested on v75/v81/v85 Android + v81 WoA).
- **IBM zDNN (b12230)** — Accepts non-zdnn tensors and invalidates compute tensors after every op ([PR #31824](https://github.com/ggml-org/llama.cpp/pull/31824)).
- **RISC-V / SpacemiT** — MXFP4 dense repack + IME2 acceleration merged ([PR #31776](https://github.com/ggml-org/llama.cpp/pull/31776)); Q4_1 32×256 dispatch and GATED_DELTA_NET routed to RVV kernels are in review ([#31929](https://github.com/ggml-org/llama.cpp/pull/31929), [#31897](https://github.com/ggml-org/llama.cpp/pull/31897)).
- **WebGPU** — `PAD_REFLECT_1D` added for Qwen3-TTS speaker encoder / Chatterbox vocoder ([PR #31877](https://github.com/ggml-org/llama.cpp/pull/31877)); `COL2IM_1D` for TTS decoders ([PR #31708](https://github.com/ggml-org/llama.cpp/pull/31708)).
- **OpenVINO** — `FILL` as in-place recurrent-cache clear plus a sticky-NaN fix ([PR #31977](https://github.com/ggml-org/llama.cpp/pull/31977)).
- **AMD eGPU Metal** — simdgroup-width-aware kernels (wave64) for Polaris-class AMD GPUs under Metal ([PR #31994](https://github.com/ggml-org/llama.cpp/pull/31994)).

## 4. Performance & Optimization

- **SYCL Q4_0 → u4 GEMM** — Reading Q4_0 weights as u4 directly in oneDNN avoids converting the full weight matrix to f16. On B580 at m=14336, n=64, k=4096: **1,224 µs saved** per prompt matmul, with env override `GGML_SYCL_Q4_0_U4_GEMM` ([PR #31993](https://github.com/ggml-org/llama.cpp/pull/31993)).
- **Vulkan narrow-N matmul** — New coopmat1/coopmat2 tile configs tuned for N≤32 ([PR #31990](https://github.com/ggml-org/llama.cpp/pull/31990)).
- **CUDA/Ada-Blackwell FlashAttention** — Opt-in row-faithful small-batch dispatch to fix kernel-family reduction mismatches for batches >1 query row (`GGML_CUDA_FATTN_ROW_FAITHFUL`, [PR #31992](https://github.com/ggml-org/llama.cpp/pull/31992)).
- **HIP/GCN MMQ tuning** — Full re-tweak of MMQ configs across GCN quant types ([PR #30021](https://github.com/ggml-org/llama.cpp/pull/30021)).
- **Intel Vulkan prefill FA** — Dedicated prefill FA shader for supported Intel platforms ([PR #29357](https://github.com/ggml-org/llama.cpp/pull/29357)).
- **Elbrus e2k** — Routed through x86 SIMD path via lcc intrinsic translation: **pp ×9.1, tg ×2.4** on E16C with Qwen3-8B ([PR #31989](https://github.com/ggml-org/llama.cpp/pull/31989)).

## 5. Stability & Regressions

Ranked by severity:

1. **[OPEN, high priority] KV cache truncated incorrectly on `/v1/chat/completions`** — [#11970](https://github.com/ggml-org/llama.cpp/issues/11970), 50 comments, open since Feb 2025 and updated today. Long-lived server correctness bug; no fix PR referenced.
2. **[OPEN] Speculative decoding breaks temp-0 output identity on Qwen3.5-MoE targets** — [#31472](https://github.com/ggml-org/llama.cpp/issues/31472). `draft-dflash`/`draft-dspark` diverge from autoregressive output even at 100% acceptance, backend-independent. This undermines the reproducibility contract of speculative decoding; no fix PR.
3. **[CLOSED] HIP/ROCm gfx1151 wrong logits triggered by prompts longer than `n_ubatch`** (Strix Halo) — [#28211](https://github.com/ggml-org/llama.cpp/issues/28211). Closed after investigation.
4. **[OPEN] SYCL + MoE `/v1/completions` logprobs nondeterministic; seed does not pin distribution** — [#31206](https://github.com/ggml-org/llama.cpp/issues/31206). Byte-identical requests yield different reported distributions; relevant for eval harnesses on Intel iGPUs.
5. **[CLOSED] Brutally bad SYCL performance on Battlemage** — [#22413](https://github.com/ggml-org/llama.cpp/issues/22413), the most-commented item of the day (68 comments). Closed, but confirms ongoing SYCL attention from the community.
6. **[OPEN] qwen4exp garbage output on SM110 (Jetson Thor) with >8 GPU layers** — [#27763](https://github.com/ggml-org/llama.cpp/issues/27763).
7. **[OPEN] `ggml_backend_sched_alloc_splits: unexpected graph reallocation` crash** on Intel Arc — [#28753](https://github.com/ggml-org/llama.cpp/issues/28753).
8. **[OPEN] Vulkan `vkCreateComputePipelines` failure on Adreno 830** — [#28635](https://github.com/ggml-org/llama.cpp/issues/28635); traced to shaderc/NDK SPIR-V differences, not llama.cpp shader source.
9. **Speculative example crash on init failure** — `llama-speculative` prints an error but exits 139; fix PR open ([#31996](https://github.com/ggml-org/llama.cpp/pull/31996)). Developer-quality-of-life only.
10. **Realtime API odd-length audio appends** — silently drop the last byte and desync subsequent appends; fix in review ([PR #31991](https://github.com/ggml-org/llama.cpp/pull/31991)).

Also worth noting: `resolve_fused_ops()` probes the fused top-k mask with a 1-token graph, causing DeepSeek-V4.1 gibberish with `-fa on` under Vulkan+RPC ([PR #31505](https://github.com/ggml-org/llama.cpp/pull/31505) proposes a fix), and `ggml_gallocr` was reported to silently reuse stale allocation plans on identity change at fixed positions (sparse MoE corruption, [#28448](https://github.com/ggml-org/llama.cpp/issues/28448), closed).

## 6. What This Means for Application Developers

- **If you build voice agents**: `/v1/audio/speech` (b12238) plus Gemma 4 audio-stream input (b12237) and the new resampler (b12236) make llama.cpp viable as a single-process speech-in / speech-out backend. Watch the WAV-vs-PCM rounding discrepancy and the odd-byte append bug ([PR #31991](https://github.com/ggml-org/llama.cpp/pull/31991)) if you stream realtime audio.
- **If you build tool-calling agents**: b12242 is important — before it, combining `response_format` with tools on qwen3-coder, deepseek, and ministral3 parsers returned HTTP 400. Upgrade past b12242 for reliable structured tool calls. An order-agnostic JSON-argument grammar fix is also in review ([PR #30193](https://github.com/ggml-org/llama.cpp/pull/30193)) for models that don't respect declared property order.
- **If you rely on OpenAI Responses API compatibility**: schema conversion (b12240) and top-level `json_schema` acceptance (b12229) close two long-standing structured-output gaps. A separate `reasoning`-item `summary: null` rejection has been closed ([#29159](https://github.com/ggml-org/llama.cpp/issues/29159)), so Codex CLI-style clients should work better.
- **If you run long-context servers**: the KV cache truncation bug [#11970](https://github.com/ggml-org/llama.cpp/issues/11970) remains open and high priority. Validate your truncation/sliding-window behavior under repeated `/v1/chat/completions` calls before relying on it in production.
- **If you use speculative decoding for reproducibility-sensitive workloads**: [#31472](https://github.com/ggml-org/llama.cpp/issues/31472) means temp-0 output is not token-identical to autoregressive decode on Qwen3.5-MoE targets. Treat speculative paths as non-deterministic until fixed.
- **If you deploy on Intel iGPU / Battlemage**: SYCL logprobs nondeterminism ([#31206](https://github.com/ggml-org/llama.cpp/issues/31206)) makes seeded evals unreliable; use CUDA/ROCm or accept variance in the reported distribution.
- **If you use the router / multi-worker mode**: an enhancement to terminate idle workers after `--sleep-idle-seconds` is under discussion ([#25570](https://github.com/ggml-org/llama.cpp/issues/25570), 7 👍) — useful for GPU cost control in autoscaled fleets.

</details>

<details>
<summary><strong>Ollama</strong> — <a href="https://github.com/ollama/ollama">ollama/ollama</a></summary>

# Ollama Digest — 2026-11-10

## 1. Today's Highlights

Ollama shipped v0.40.16, introducing the 65B dense **Ripple Preview** agentic-coding model and delivering a significant memory win (~27 GiB reduction) for Qwen3.8 Flash Next on Apple silicon. On the infrastructure side, a major VRAM accounting and GPU-splitting fix (#19632) landed alongside long-requested memory improvements: **MLX concurrent generation** via `OLLAMA_NUM_PARALLEL` (#19197) and re-enabling parallel requests for Qwen3.5/Qwen3.5-MoE after an upstream llama.cpp crash fix (#17144). Meanwhile, correctness bugs in the OpenAI-compatible `/v1/responses` compaction path (#19623, fixed by #19635) and the Windows updater crash (#19621, fixed by #19625) are the most impactful items for production users.

## 2. Releases & Breaking Changes

- **v0.40.16 released** — New `ripple-preview` model (65B dense, agentic coding) and Apple silicon memory improvement for Qwen3.8 Flash Next. No documented breaking API changes.
  https://github.com/ollama/ollama/releases
- **API spec mismatch noted (docs fix pending)** — `docs/openapi.yaml` claims `ModelOptions.stop` accepts a bare string, but the server requires an array. PR #19626 corrects the documentation; callers relying on the spec's string form should pass `["END"]` instead of `"END"`.
  https://github.com/ollama/ollama/pull/19626
- **No migration notes required** for this cycle.

## 3. New Model & Hardware Support

- **Ripple Preview (65B dense)** — New agentic-coding model from Ricursive Intelligence, runnable via `ollama run ripple-preview`.
  https://ollama.com/library/ripple-preview
- **MLX concurrent generation** (PR #19197, open) — MLX backends can now serve multiple simultaneous generation requests through `OLLAMA_NUM_PARALLEL`; default remains 1 due to per-request memory cost.
  https://github.com/ollama/ollama/pull/19197
- **Qwen3.5 / Qwen3.5-MoE parallel unblock** (PR #17144, open) — Removes the hardcoded `numParallel = 1` blocklist after the upstream llama.cpp crash was fixed (2026-03-08).
  https://github.com/ollama/ollama/pull/17144
- **Vulkan-only systems** — Open bug #19474 reports CUDA drivers being installed on Vulkan-only Intel setups with no Vulkan support path; no fix PR yet.
  https://github.com/ollama/ollama/issues/19474

## 4. Performance & Optimization

- **~27 GiB memory reduction on Apple silicon** — Qwen3.8 Flash Next now uses substantially less unified memory in v0.40.16, a material win for Mac users running high-context workloads.
  https://github.com/ollama/ollama/releases
- **VRAM accounting & GPU splitting fixes** (PR #19632, open) — Addresses mistaken model eviction, load refusals, and unnecessary cross-GPU splitting caused by incorrect VRAM prediction and overhead reservation. Fixes #19463, #18679, #18349, #16599.
  https://github.com/ollama/ollama/pull/19632
- **MLX parallelism** (PR #19197) — Shared projection/feed-forward work across concurrent requests; directly targets time-to-first-token under multi-user load.
  https://github.com/ollama/ollama/pull/19197

## 5. Stability & Regressions

Ranked by severity:

1. **[HIGH — correctness] `/v1/responses` compaction corruption** (#19623) — Retained items could include a `function_call_output` without its matching `function_call`, causing subsequent compaction to fail with HTTP 400. **Fix PR exists**: #19635.
   https://github.com/ollama/ollama/issues/19623 · https://github.com/ollama/ollama/pull/19635
2. **[HIGH — crash] Windows updater panic with >512 processes** (#19621) — `IsProcRunning` treated `EnumProcesses` byte count as PID count, causing out-of-bounds slice and panic. **Fix PR exists**: #19625.
   https://github.com/ollama/ollama/issues/19621 · https://github.com/ollama/ollama/pull/19625
3. **[MEDIUM — perf] Vulkan/AMD RADV ~30× slowdown** (#19201, closed) — Second identical request with prompt cache enabled collapsed throughput ~29.7× on RX 6600 XT under Ollama 0.40.8. Closed; verify against current release if affected.
   https://github.com/ollama/ollama/issues/19201
4. **[MEDIUM — correctness] Qwen3.5 4B thinking-only responses** (#18916, open) — Long conversations return `done:true` with only `message.thinking`, no content or tool calls. No fix PR.
   https://github.com/ollama/ollama/issues/18916
5. **[MEDIUM — correctness] gemma4 `think:false` empty reply after tool response** (#18861, open) — Empty thought block never closed; reproduced on 0.35.1 and 0.40.0 (ROCm).
   https://github.com/ollama/ollama/issues/18861
6. **[LOW — intermittent] CUDA `shared object initialization failed` at warmup** (#17380, open) — Silent `CUDA_Host` → `CPU` buffer fallback on Windows RTX 5070 Ti with `gpt-oss:20b`.
   https://github.com/ollama/ollama/issues/17380
7. **[LOW — reporting] VRAM mismatch in `ollama ps`** (#17251, open) — Inconsistent vs. `rocm-smi` with mtp-accelerator models.
   https://github.com/ollama/ollama/issues/17251
8. **[LOW — proxy] 403 on `ollama pull` behind corporate proxy** (#19604, closed) — Blue Coat CA/RHEL 9.2 environments; resolved.
   https://github.com/ollama/ollama/issues/19604

## 6. What This Means for Application Developers

- **Agentic coding is now a first-class target.** Ripple Preview (65B dense) plus the `/v1/responses` compaction fix make Ollama a more credible local backend for Codex-style agents. If you're using remote compaction, upgrade to pick up #19635.
- **Multi-tenant serving improves.** With PR #19632 fixing VRAM accounting and #19197/#17144 unlocking parallelism, consolidated deployments on a single GPU become more viable — but validate your specific model/backend combination, since the `OLLAMA_NUM_PARALLEL=1` enforcement debate (#19262) shows behavior can diverge from expectations.
- **Long-context workflows need eviction/keep-alive tuning.** Defaults remain contentious — `OLLAMA_KEEP_ALIVE` (#19624) and `OLLAMA_LOAD_TIMEOUT` (#19616) at 5 minutes are widely felt to be too short for interactive chat. Set these explicitly in compose/systemd units.
- **Windows production users:** upgrade past the updater panic (#19621/#19625) and watch for CUDA warmup flakiness under high process counts (#17380).
- **Proxy-restricted environments:** `ollama pull` 403s behind MITM proxies (#19604) are resolved — verify service-level `HTTPS_PROXY` and CA trust rather than relying on shell `curl` working.

---
*Generated from github.com/ollama/ollama activity on 2026-11-09/10. Issue/PR titles preserved as reported.*

</details>

<details>
<summary><strong>LiteLLM</strong> — <a href="https://github.com/BerriAI/litellm">BerriAI/litellm</a></summary>

# LiteLLM Digest — 2026-11-10

## 1. Today's Highlights
LiteLLM shipped a new LTS patch (**v1.108.4**) with cosign verification guidance, while the day's issue traffic was dominated by **rate-limiter correctness bugs** in the v3 limiter (double-counted per-team/per-model limits, TPM windows not rolling or outliving their window under 429s). A long tail of provider-translation fixes is in flight — Anthropic `vector_store_ids` rejection, Azure alias-map leakage, Gemini 503/APIConnectionError, and Windows tokenizer cache handling all saw activity.

## 2. Releases & Breaking Changes
- **v1.108.4 (LTS)** — patch release. The `lts` image tag now always points to the latest LTS release (`ghcr.io/berriai/litellm:lts`). Cosign verification is documented for supply-chain validation. No breaking API/config changes noted in this release.
  - https://github.com/BerriAI/litellm/releases
- **Backport PR #50823** — automatic SpendLogs call-ID index build (#43948/#44109/#44203) is being backported to `stable/1.104.x`. Proxies on 1.104 with large spend-log tables currently time out on Logs page queries. If you're on 1.104, plan to upgrade or cherry-pick.
  - https://github.com/BerriAI/litellm/pull/50823

## 3. New Model & Hardware Support
- **NEAR AI Cloud** added as an OpenAI-compatible provider (PR #37583).
  - https://github.com/BerriAI/litellm/pull/37583
- **Codex 0.166.0-alpha.1+ catalog support** (PR #50736) — LiteLLM now sends the full model catalog rather than truncating at 1 MB for newer Codex clients, restoring visibility into models that were previously hidden.
  - https://github.com/BerriAI/litellm/pull/50736
- **Qwen3-TTS via vLLM** — `/v1/audio/speech` currently fails for Qwen3-TTS because the `voice` parameter is enforced and custom params are stripped (Issue #20078, open since Jan, still active). No support landed yet; track this if you're serving Qwen3-TTS.
  - https://github.com/BerriAI/litellm/issues/20078
- **Audio transcription `logprobs` preservation** — PR #36009 fixes dropped `logprobs` on the transcription path (related to long-standing "audio cost = 0" reports).
  - https://github.com/BerriAI/litellm/pull/36009

## 4. Performance & Optimization
- **SpendLogs index backport (#50823)** — without it, opening a request in the Logs UI does a full-table scan on 1.104 proxies. This is the single highest-impact perf fix in flight for large deployments.
  - https://github.com/BerriAI/litellm/pull/50823
- **Codex catalog trimming removed (#50736)** — old Codex versions discarded model lists >1 MB; LiteLLM was preemptively truncating. Newer Codex clients no longer need this, so the full catalog is sent (fewer hidden models, no perf regression expected on modern clients).
  - https://github.com/BerriAI/litellm/pull/50736
- **Responses WebSocket token accounting (#50730)** — a turn's tokens are now counted before the next turn is admitted, so usage-based routing and `tpm` limits no longer 429 a turn late. This fixes both correctness and effective admission throughput under WebSocket clients.
  - https://github.com/BerriAI/litellm/pull/50730
- **Custom-named deployment tokenizer (#50734)** — `count_tokens` now uses the base model's tokenizer for deployments with obfuscated names (e.g., `my-flash` serving `DeepSeek-V4-Flash`), avoiding the OpenAI fallback tokenizer and its inaccurate counts.
  - https://github.com/BerriAI/litellm/pull/50734
- **Rust bridge refactor (#50822)** — routes all Rust→Python calls through `host/` modules, removing a direct `litellm` global read. Internal cleanup, but relevant if you extend the bridge.
  - https://github.com/BerriAI/litellm/pull/50822

## 5. Stability & Regressions
Ranked by severity:

**Critical — rate limiting / budget enforcement (multiple open bugs):**
- **#34140 (CLOSED)** — v3 limiter double-counts team per-model limits (`model_per_team`); effective RPM/TPM is **half** configured. Precise repro + root cause filed.
  - https://github.com/BerriAI/litellm/issues/34140
- **#49675 (OPEN)** — v3 limiter: TPM counter outlives its window under upstream 429s; keys/teams rejected well below `tpm_limit`. Default `LITELLM_TPM_TOKEN_RESERVATION_ENABLED=true`.
  - https://github.com/BerriAI/litellm/issues/49675
- **#47340 (OPEN)** — With in-memory cache (no Redis), `tpm_limit` behaves as a fixed budget per `/key/update`; the window never rolls and the key stays locked out. Rewriting the key is the only reset. **Avoid in-memory cache for TPM-limited keys until fixed.**
  - https://github.com/BerriAI/litellm/issues/47340
- **#34101 (CLOSED)** — Project max budgets missing from atomic pre-call reservation (teams/orgs/keys/users/end-users reserved; projects alerted but not enforced).
  - https://github.com/BerriAI/litellm/issues/34101
- **#34101 / #34217 (CLOSED)** — `POST /team/delete` leaves deleted virtual keys auth-valid in cache; `/key/delete` clears cache but team-delete does not.
  - https://github.com/BerriAI/litellm/issues/34217
- **#47675 (CLOSED)** — `response_cost` null and spend $0 when `custom_llm_provider=anthropic` and the priced row lives under a different provider.
  - https://github.com/BerriAI/litellm/issues/47675
- **#43444 (CLOSED)** — Price data reload wipes DB deployments' cost-map registrations when `config.yaml` has empty `model_list` and `STORE_MODEL_IN_DB=True`. **DB-only deployments with periodic cost reload were silently un-costed.**
  - https://github.com/BerriAI/litellm/issues/43444
- **#45422 (CLOSED)** — GitHub BYOK token consumption returns 0 (regression between 1.103.1 and 1.104.2).
  - https://github.com/BerriAI/litellm/issues/45422

**High — provider translation correctness:**
- **#23741 (OPEN, 15 comments)** — Anthropic 400 when request body carries `vector_store_ids` (LiteLLM should strip for Anthropic). Open since March, still active.
  - https://github.com/BerriAI/litellm/issues/23741
- **#42409 (CLOSED)** — Azure requests leaked internal `model_alias_map` → `Unknown parameter: 'model_alias_map'`. Fixed.
  - https://github.com/BerriAI/litellm/issues/42409
- **#37823 (CLOSED)** — `azure/us/` and `azure/eu/gpt-4o-2024-11-20` missing `cache_read_input_token_cost`; cache reads billed at zero.
  - https://github.com/BerriAI/litellm/issues/37823
- **#40471 (CLOSED)** — `reasoning_effort=xhigh` silently downgraded to baseline instead of refused when model map lacks capability.
  - https://github.com/BerriAI/litellm/issues/40471
- **#32992 (CLOSED)** — DeepSeek-v4-pro via Codex → 400 "assistant message with 'tool_calls' must be followed by tool messages responding to each 'tool_call_id'".
  - https://github.com/BerriAI/litellm/issues/32992
- **#33678 (CLOSED)** — `ollama_chat` streaming emits `index=0` for every tool call, merging parallel tool calls into malformed JSON.
  - https://github.com/BerriAI/litellm/issues/33678
- **#25214 (CLOSED, stale)** — `/v1/messages` streaming drops first chunk on content-block transitions for Bedrock reasoning models (minimax-m2.5, kimi-k2.5, Claude extended thinking).
  - https://github.com/BerriAI/litellm/issues/25214

**Medium — proxy/passthrough:**
- **#49479 (OPEN)** — `pass_through_endpoints` strips `id` from JSON-RPC 2.0 bodies (name collision with internal param list). **Breaks any JSON-RPC payload through the proxy.**
  - https://github.com/BerriAI/litellm/issues/49479
- **#50434 (OPEN)** — Gemini intermittent 503 / `APIConnectionError` through LiteLLM.
  - https://github.com/BerriAI/litellm/issues/50434
- **#41855 (OPEN)** — Windows wheel ships tiktoken caches with CRLF; `import litellm` requires network. **PR #50816 ships tokenizers as binaries to fix.**
  - https://github.com/BerriAI/litellm/issues/41855
  - https://github.com/BerriAI/litellm/pull/50816
- **#20494 (OPEN, stale)** — `/key/generate` with an existing secret key does not error.
  - https://github.com/BerriAI/litellm/issues/20494
- **#31950 (OPEN)** — Presidio `output_parse_pii` unmasks `message.content` but not `tool_calls[].function.arguments`; placeholders leak to clients.
  - https://github.com/BerriAI/litellm/issues/31950
- **#31694 (CLOSED)** — Complexity Router disappears from `/v2/model/info` after updating DB model.
  - https://github.com/BerriAI/litellm/issues/31694
- **#50793 (OPEN PR)** — `complexity_router` `user_turn` mode: failed classification left prior ask's pin live, replaying old model on tool continuations.
  - https://github.com/BerriAI/litellm/pull/50793

**Ongoing fixes with PRs open:**
- **PR #50467** — tool_choice: accept Responses API's flat `allowed_tools` layout on chat completions (previously 400); provider that can't enforce drops it under `drop_params`.
  - https://github.com/BerriAI/litellm/pull/50467
- **PR #50812** — treat `"tools": []` as no tools (fixes 400 from vLLM-style backends).
  - https://github.com/BerriAI/litellm/pull/50812
- **PR #50783** — send prompt-only `call_endpoint` token count to all provider count APIs (Anthropic/Azure AI/OpenAI/Bedrock previously returned local estimates; Claude far below provider).
  - https://github.com/BerriAI/litellm/pull/50783
- **PR #50764** — split customer spend by key's current team.
  - https://github.com/BerriAI/litellm/pull/50764
- **PR #50797** — per-model TPM/RPM limit maps on budgets and customers.
  - https://github.com/BerriAI/litellm/pull/50797
- **PR #50824** — keep credential actions menu open across background refreshes (UI flake).
  - https://github.com/BerriAI/litellm/pull/50824
- **PR #36374** — preserve stdio MCP environment variables on edit (currently replaced with `{}` on save).
  - https://github.com/BerriAI/litellm/pull/36374
- **PR #37192** — native Gate/Prove `ActionBoundary` guardrail + `ActionLedger` exporter for multi-agent deployments.
  - https://github.com/BerriAI/litellm/pull/37192

## 6. What This Means for Application Developers
- **Do not rely on per-team/per-model RPM/TPM limits right now.** Multiple open bugs (#34140, #49675, #47340) mean effective limits may be half-configured, never refill, or reject under upstream 429s. If you need hard enforcement, use a Redis-backed limiter and verify with a load test against your configured numbers.
- **If you're running DB-only deployments** (`STORE_MODEL_IN_DB=True`, empty `model_list`), be aware that periodic price-map reloads historically wiped runtime cost registrations (#43444). Now closed, but audit your spend dashboards to confirm costs are non-zero after upgrades.
- **On 1.104 with large spend logs, upgrade or cherry-pick #50823** — otherwise your Logs page will full-scan and time out.
- **Anthropic users:** if you pass `vector_store_ids` (even from a shared request schema), expect a 400 (#23741). Strip it before calling Anthropic models until fixed.
- **JSON-RPC 2.0 over `pass_through_endpoints` is broken** (#49479) — the `id` field is stripped. Route JSON-RPC outside the passthrough or run a disaggregated proxy until fixed.
- **Windows + firewalled deployments:** `import litellm` may require network due to CRLF-corrupted tiktoken caches (#41855); PR #50816 is the fix. Pin a nightly or wait for the next release if you build in an air-gapped Windows environment.
- **For agent builders:** `complexity_router` in `user_turn` mode had a stale-pin bug across tool continuations (#50793) — if you route by complexity, upgrade once merged to avoid replaying the wrong model mid-tool-loop. Also watch the Presidio tool-call PII leak (#31950) if you use output PII unmasking with function calling.
- **Positive signal:** the LTS channel (`ghcr.io/berriai/litellm:lts`) plus documented cosign verification is a meaningful step for regulated/air-gapped shops — pin the LTS tag and verify signatures in CI.

</details>

<details>
<summary><strong>Unsloth</strong> — <a href="https://github.com/unslothai/unsloth">unslothai/unsloth</a></summary>

# Unsloth Digest — 2026-11-10

## 1. Today's Highlights

No new releases in the last 24h, but the PR queue is very active: a substantial ROCm RDNA INT8 kernel landing for gfx11xx/gfx12xx, flex-attention decode graphs extended to Gemma 4 / Qwen3.5–3.6, and a batch of Studio startup-latency and long-chat performance fixes. On the issue side, several user-reported GPU-fallback bugs (Windows RTX 3060 image gen, Linux forced CPU) were closed, while new Studio UX/security bugs (custom-folder 403, session-only "Full access" mode) were filed.

## 2. Releases & Breaking Changes

No releases in the last 24h.

## 3. New Model & Hardware Support

- **ROCm RDNA INT8 Triton kernels + fused Qwen-Image-2.1 projections** — W8A8 attention kernels for gfx11xx/gfx12xx; explicit `transformer_quant=int8` now runs fused instead of eager. [PR #17334](https://github.com/unslothai/unsloth/pull/17334) (closed/merged)
- **Flex attention decode steps for Gemma 4 and Qwen3.5/Qwen3.6 (`qwen3_5`, `qwen3_5_moe`)** under decode CUDA graphs, stacked on #16587, using shared decode mask/attention from unsloth-zoo. [PR #17329](https://github.com/unslothai/unsloth/pull/17329)
- **FLUX.3 joint-block int8 ConvRot quant sharing** — fixes the per-block quantize-once sharing to actually engage for `Flux3SingleTransformerBlock` (28 of 33 blocks). [PR #17337](https://github.com/unslothai/unsloth/pull/17337)
- **Transformers 5 tokenizer path** — skip the duplicate "slow" tokenizer load on transformers 5.x, where it only copies the fast tokenizer. [PR #17318](https://github.com/unslothai/unsloth/pull/17318)

## 4. Performance & Optimization

- **ROCm RDNA INT8:** gfx1151 (Strix Halo): Qwen-Image-2.1 INT8 from 3.26 s/step → ~2.57 s baseline-equivalent; explicit int8 request 4.33 s/step → −26% to −34%. [PR #17334](https://github.com/unslothai/unsloth/pull/17334)
- **Long-chat gate:** CPU/paint cost grows >2.5× from 40→200 turns; gate now blocks on growth, judged on fresh-page rechecks, and gets a WebKit CI leg (previously Chromium-only, missing Safari/macOS/Linux desktop regressions). [PR #17336](https://github.com/unslothai/unsloth/pull/17336), [PR #17331](https://github.com/unslothai/unsloth/pull/17331)
- **Browser pane first-open:** 360–430 ms on WebKit due to React 19 Suspense reveal hold; removing it targets ~60–130 ms repeat-open latency. [PR #17335](https://github.com/unslothai/unsloth/pull/17335)
- **Studio startup trimming:** lazy `sentence_transformers` patching ([#17267](https://github.com/unslothai/unsloth/pull/17267)), on-demand `HfApi` ([#17273](https://github.com/unslothai/unsloth/pull/17273)), browser feature index out of eager graph ([#17280](https://github.com/unslothai/unsloth/pull/17280)), CSP memoization ([#17246](https://github.com/unslothai/unsloth/pull/17246)), on-demand PDF deps ([#17206](https://github.com/unslothai/unsloth/pull/17206)).
- **Embeddings event-loop blocking:** GGUF proxy parsed full body via `resp.json()` and Studio embedder did JSON serialization on the loop, stalling chat streams; now parse-once / off-loop. [PR #17286](https://github.com/unslothai/unsloth/pull/17286)
- **Misc:** cached Intl formatters for library rows ([#17251](https://github.com/unslothai/unsloth/pull/17251)), `unsloth studio stop` returns immediately instead of on 0.5 s poll boundary ([#17283](https://github.com/unslothai/unsloth/pull/17283)), pause display-only training polls on hidden tab ([#17294](https://github.com/unslothai/unsloth/pull/17294)).

## 5. Stability & Regressions

Ranked by severity:

- **High — GPU silently falls back to CPU:** Windows 11 + RTX 3060: image gen on CPU/RAM while text gen uses GPU ([#16803](https://github.com/unslothai/unsloth/issues/16803), closed); Linux forced to CPU on GGUF load ([#17235](https://github.com/unslothai/unsloth/issues/17235), closed). No linked fix PRs in this window — worth verifying fixes landed rather than issue-closed.
- **Medium — Managed account permissions:** `/api/models/browse-folders` returns 403 without `path` for managed users but works for owner ([#17292](https://github.com/unslothai/unsloth/issues/17292), open).
- **Medium — "Full access" permission mode is session-only:** `savePermissionMode` skips `"full"`, and server enum is `ask|auto|off`, so the mode never persists ([#17297](https://github.com/unslothai/unsloth/issues/17297), open).
- **Medium — LAN bind to network bridge IP fails** ([#17017](https://github.com/unslothai/unsloth/issues/17017), open).
- **Medium — Video upload blocked for custom OpenAI-compatible connections** ([#17295](https://github.com/unslothai/unsloth/issues/17295), open).
- **Low — Correctness:** attachment-note text inside file content parsed as a second attachment ([#16913](https://github.com/unslothai/unsloth/issues/16913), closed); `Regenerate title` copies last message fragment ([#17332](https://github.com/unslothai/unsloth/issues/17332), open).
- **Low — Housekeeping:** backend writes `nul` files into working directory ([#16991](https://github.com/unslothai/unsloth/issues/16991), closed); beta updater failure ([#16897](https://github.com/unslothai/unsloth/issues/16897), closed).

## 6. What This Means for Application Developers

- **AMD Strix Halo / RDNA users get usable INT8 diffusion:** if you serve Qwen-Image-2.1 on gfx1151, pin to the commit containing #17334; explicit `transformer_quant=int8` is now materially faster than eager, not just memory-saving.
- **Long-chat agents:** Studio's own gates confirm CPU cost scales superlinearly with conversation length — if you embed Studio's chat UI or build similar threads, budget for periodic fresh-page re-renders and avoid per-row Intl formatting in hot lists (pattern now fixed upstream).
- **Custom OpenAI-compatible endpoints:** multimodal video upload is still broken for these connections (#17295). If your app routes video through Unsloth Studio, hold off or work around until fixed.
- **Managed/multi-user Studio deployments:** two open issues directly affect tenant isolation UX — 403 on folder browsing (#17292) and non-persistent "Full access" mode (#17297). Don't rely on "Full access" surviving restarts when designing permission flows.
- **Windows image-gen pipelines:** closed-but-suspicious GPU-fallback reports (#16803) suggest verifying nvidia/CUDA driver detection after install; add a startup check for device placement in your own wrappers.
- **Startup-sensitive services:** the batch of lazy-import PRs (#17267, #17273, #17280, #17206) reduces `import unsloth` / Studio backend cold-start cost — worth rebasing if cold start matters for your serving stack.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*