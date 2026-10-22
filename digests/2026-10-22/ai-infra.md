# AI Infrastructure Digest 2026-10-22

> Generated: 2026-10-21 23:58 UTC | Projects covered: 6

- [vLLM](https://github.com/vllm-project/vllm)
- [SGLang](https://github.com/sgl-project/sglang)
- [llama.cpp](https://github.com/ggml-org/llama.cpp)
- [Ollama](https://github.com/ollama/ollama)
- [LiteLLM](https://github.com/BerriAI/litellm)
- [Unsloth](https://github.com/unslothai/unsloth)

---

## Cross-Project Comparison

# Cross-Project Comparison Report — AI Infrastructure Ecosystem
**Date: 2026-10-22**

---

## 1. Ecosystem Overview

Today's activity reflects a maturing but still unstable ecosystem, split between performance frontier work and correctness debt. Serving engines (vLLM, SGLang) are converging on **speculative decoding** and **agentic-oriented scheduling/KV management** as the primary optimization axis, while hardware support fragments across Ampere, Hopper, Blackwell (SM120), and ROCm MI355X. The local-runtime layer saw a heavy release day (llama.cpp: 10 builds; Ollama: v0.40.8 with the new Flint coding model), and Unsloth's queue is dominated by multi-model VRAM budget contention. The single most operationally urgent item is the **LiteLLM 1.107.0 supply-chain compromise** — a credential stealer + RCE loader published from a lookalike repo, now removed but requiring active audit of caches, lockfiles, and transited credentials. Across all projects, **fail-open correctness bugs** (silent wrong tokens, LoRA misapplication, prompt truncation, dropped tool calls) are the dominant risk class for production agents.

---

## 2. Activity Comparison

| Project | Layer | Issues Cited (open/active) | PRs Cited | Release Status |
|---|---|---|---|---|
| **vLLM** | Serving engine | ~20 (incl. 1 launch blocker #50576 w/ 116 comments; 2 fail-open LoRA bugs) | ~10 (spec-decode cluster, KV-offload, weight-loader) | **None** in 24h; behavior-changing PRs in flight |
| **SGLang** | Serving engine | ~13 (incl. PD/HiCache hang, FP8 Marlin wrong tokens) | ~12 (kernel fusion, scheduler, MoE memory) | **None**; nightly Triton breakage flagged |
| **llama.cpp** | Local runtime | ~12 (SYCL cluster, TTFT regression, cross-slot leak) | ~15 (plus OpenCL/Vulkan kernels, mtmd) | **10 builds (b11793–b11803)** |
| **Ollama** | Local runtime | ~15 (Cloud Pro outage, tool-parser family) | ~10 (agent-facing fixes, MLX, llama.cpp bump) | **v0.40.8** (Flint model) |
| **LiteLLM** | Gateway | ~10 (1 critical security, 4 high-severity) | ~6 (providers, httpx timeouts) | **v1.106.2** safe; **1.107.0 compromised/yanked** |
| **Unsloth** | Fine-tuning/Studio | ~14 (incl. stall/core-dump regression, Windows GGUF crash) | ~14 (VRAM pricing, diffusion defaults, MoE kernels) | **None**; field base v0.1.909-beta |

*Counts reflect items cited in digests, not full trackers.*

---

## 3. Model Support Race

**New checkpoints are landing faster than serving engines can support them**, producing a clear divergence between local runtimes and datacenter engines.

| Architecture | vLLM | SGLang | llama.cpp | Ollama | Unsloth |
|---|---|---|---|---|---|
| **Flint (FlintForCausalLM)** | — | — | ✅ b11803 | ✅ v0.40.8 (via llama.cpp) | — |
| **SenseNova U1** | — | — | ✅ b11801 | — | — |
| **DeepSeek-V4-Flash (Ampere SM8x)** | ❌ **blocked (#50576)** | — | — | — | — |
| **DeepSeek-V4.1-Flash** | ✅ GB300 specialized decode PR | ✅ 4×SM120 field report; MXFP8 kernel fusion | — | — | ✅ Studio (zoo#1892) |
| **GLM-5.3-Flash** | ✅ MTP alignment PR | ✅ SM120/SM90 trackers (Triton-only on SM120) | ✅ via QSA fused mask (glm5.3-next) | — | ✅ Studio |
| **Qwen3.8-Flash-Next** | ⚠️ supported but **silent truncation bug on GB10** | ✅ ROCm tracker | — | — | ✅ Studio (Engram/PLE) |
| **Qwen3.8-2.4T-A95B** | ✅ ROCm perf tracker | — | — | — | — |
| **MOSS-Image** | — | — | — | — | ✅ Studio |
| **Apple Foundation Models** | — | — | — | 🔄 PR in flight | — |

**Who's ahead:** llama.cpp and Ollama lead on *breadth* — new architectures (Flint, SenseNova U1) ship within days, and Ollama inherits them automatically through its vendor bump. Ollama additionally leads on *novel backends* (Apple on-device model runner, MLX DFlash2 speculative decoding). vLLM and SGLang lead on *datacenter model depth* — DSpark/MTP spec decode for DSv4.1, MXFP8 kernel fusion, and ROCm MI355X optimization for the Qwen3.8 family — but the DeepSeek-V4-Flash Ampere gap in vLLM is a durable blocker for A100-class fleets. Unsloth occupies a distinct niche: quantized/consumer-friendly enablement of frontier MoE and diffusion families via Studio. Note the emerging pattern of **new models being adopted first as GGUF/local artifacts and only later (or not at all) on older datacenter SKUs**.

---

## 4. Performance Frontier

Optimization effort today concentrates in four bands, with a fifth (distributed serving) mostly stalled behind correctness fixes.

| Area | vLLM | SGLang | llama.cpp | Ollama | Unsloth |
|---|---|---|---|---|---|
| **Speculative decode** | **Dominant theme**: skip-drafting in dead steps, adaptive verification cost model, adaptive draft depth, GB300 DSv4.1 specialized decode | DSPARK prefill critical-path shortening; GB300 megakernel host-work reduction | — (DFlash optional FC input scale, open) | DFlash2 on MLX (PR); Qwen3.5 parallelism unblock | DFlash2 via MLX backend |
| **KV cache** | Multi-node KV-offload hardening (reject + mirroring fix); NVFP4 KV prefill regression on SM120 | HiCache PP-sync hang; radix-cache prealloc fix in PD decode | — | — | MLX long-chat prompt cache fix |
| **Quantization** | NVFP4/FP8 regressions (SM120); MXFP4 ROCm fallbacks; Quark INT4 W4A16 slow path | MXFP8 fused quantize; FP8 Marlin correctness; MXFP4 Triton Gluon for MI355X | SYCL Q8 dequant; Q4_K/Q6_K Vulkan bins | — | FP8 diffusion weight retention |
| **Kernels** | ROCm Triton parity; compact FP8 MLA rows | DeepSeek-V4.1 rmsnorm fusion; Mega-mHC einsum | SYCL/OpenCL/Vulkan/MMQ config retune; QSA fused mask | — | MoE autotune cache + shared-mem sizing |
| **Scheduling/batching** | MRV2 adaptive stack targets small decode batches & dead prefill | **Skip-join MLFQ** with cache-aware placement for agent traffic | — | `numParallel` unblock for Qwen3.5 | Decision-model idle unload; tensor-split across idle GPU pairs |
| **Distributed serving** | Multi-node KV offload (stricter, not faster) | PD-disaggregation roadmap (Q4) | — | — | — |

**Key observation:** the frontier has shifted from raw kernel speedups to **conditional latency wins** — spec decode that only pays off on small decode batches and dead prefill steps, schedulers tuned for agentic traffic, and memory placement (host/disk vs. VRAM). Simultaneously, a notable share of today's performance *work* is actually **regression recovery** (NVFP4 prefill 1.7–1.8× slower, Nemotron decode −16%, SYCL F16 NaN, first-inference TTFT 10s→60s after a pinned-buffer cap change). Blackwell SM120 is the current rough edge across both engines.

---

## 5. Layer Positioning

| Project | Layer | Core value | Coupling / role in stack |
|---|---|---|---|
| **vLLM** | Datacenter serving engine | Max-throughput, spec-decode-heavy serving; broadest hardware matrix (CUDA + ROCm) | Consumed by RL pipelines (verl `load_weights` contract); the engine most exposed to multi-node KV offload and MoE expert LoRA |
| **SGLang** | Datacenter serving engine | PD-disaggregation, agentic cache scheduling, MoE/kernel fusion | Most aggressive on disaggregated prefill/decode and multi-turn cache policy; direct competitor to vLLM |
| **llama.cpp** | Portable local runtime | Architecture breadth, GGUF ecosystem, CPU/GPU/OpenCL/SYCL/Vulkan backends | Reference implementation for local inference; feeds Ollama; multi-tenant server mode (cross-slot leak risk) |
| **Ollama** | Local runtime + model distribution | One-command model delivery, OpenAI/Anthropic-compatible shims, MLX/Apple runners | Sits atop llama.cpp; the developer-facing local entry point for agents (OpenCode, tool calling) |
| **LiteLLM** | LLM gateway | Multi-provider routing, budgets, spend tracking, rerank | Sits in front of every other engine as the provider abstraction; a failure here cascades ecosystem-wide (hence the supply-chain severity) |
| **Unsloth** | Fine-tuning + quantization + Studio | Memory-efficient training, GGUF/quantized production, multi-model hosting | The training/fine-tuning layer that produces the artifacts the engines serve; Studio competes with the local-runtime layer for VRAM |

**Structural read:** the stack is highly interdependent — llama.cpp ↔ Ollama share a vendored core; Unsloth produces GGUF that local runtimes consume; LiteLLM fronts all of them behind one endpoint. A regression or compromise in any layer is amplified upward.

---

## 6. Trend Signals

1. **Speculative decoding is becoming table stakes, and deeply conditional.** vLLM's MRV2 adaptive stack (cost model, draft depth from confidence, skip-drafting) and GB300 specialized decode, plus DFlash2/DSPARK work in Ollama/llama.cpp/SGLang, show speculative decoding is now the primary latency lever — but the wins are batch-shape-dependent. *Watch:* vLLM `#62988`, `#62991`, `#62784`; Ollama `#17144` (Qwen3.5 parallelism) as the nearest throughput ladder.

2. **Agentic traffic is the new design center.** Both serving engines have Q4 agentic roadmaps: SGLang's skip-join MLFQ scheduler and PD-disaggregation roadmap, vLLM's dead-step skip-drafting. *Watch:* SGLang `#45688`, roadmaps `#43699`/`#43098`.

3. **Fail-open correctness is the dominant production risk.** Today alone: vLLM DP+MoE LoRA cross-application (`#61453`), CPU LoRA leakage (`#62225`), Qwen3.8-Flash-Next silent prompt truncation on GB10 (`#62776`); SGLang FP8 Marlin wrong tokens (`#45000`), NEXTN determinism drift (`#45481`); llama.cpp cross-slot prompt leak (`#27422`); Ollama silently dropped tool calls (`#19187`). These fail *silently* — more dangerous than crashes. **Validate outputs at the application boundary, not the transport layer.**

4. **Tool-calling is the fragile seam of the local/gateway layer.** Ollama's queue shows a family of parser bugs (integer coercion, unknown-function drops, Qwen3.x/Gemma4/GPT-OSS parsers, truncated-JSON 500s); LiteLLM duplicates it (Ollama `index=0` merging parallel calls, `finish_reason`-less streams reported as success). *Watch:* Ollama `#19195`, `#17813`, `#19193`; LiteLLM `#40260`, `#33678`.

5. **Supply-chain and verification hygiene is now a first-class infra concern.** LiteLLM `1.107.0` is the headline event: compromised version, yanked images, cosign-signature guidance on every safe release. Combined with llama.cpp's cross-slot leak and Ollama's cloud outage, the takeaway for decision-makers is: **pin versions, verify signatures, and audit lockfiles/image caches before reuse.**

6. **Hardware fragmentation is worsening, not easing.** Ampere (SM8x) support is missing for DeepSeek-V4-Flash; SM120/GB10/GB300/ROCm MI355X each have distinct — and sometimes regressing — paths; consumer Blackwell has NVFP4 prefill regressions; RDNA and Intel Arc have their own correctness clusters. *Implication:* capacity planning must be validated per (checkpoint × quantization × hardware) triple; "supported in docs" ≠ "correct on your SKU."

7. **Training/serving feedback loops are tightening.** vLLM's `load_weights` single-call assumption removal (`#57733`) directly affects verl-style RL weight sync; Unsloth's Studio memory-pricing and idle-model unload changes target multi-model hosts. *Watch:* any fine-tuning pipeline that streams weights bucket-by-bucket.

8. **Gateway performance targets are moving to sub-millisecond.** LiteLLM's Rust rewrite (`#31263`) targeting sub-1ms overhead signals expectations that the gateway should become nearly invisible in agent fan-out paths. If you're consolidating providers behind one endpoint, track the beta.

**Bottom line for application developers:** the fastest wins today come from (a) pinning verified versions with cosign/Docker discipline, (b) disabling risky combos (overlap scheduler + FP8 Marlin; NEXTN determinism; multi-node KV offload pre-fix; DP+MoE LoRA), (c) instrumenting usage/cost yourself rather than trusting gateway spend logs, and (d) benchmarking spec-decode at *your* batch shape rather than accepting headline numbers.

---

## Per-Project Reports

<details>
<summary><strong>vLLM</strong> — <a href="https://github.com/vllm-project/vllm">vllm-project/vllm</a></summary>

# vLLM Digest — 2026-10-22

## 1. Today's Highlights

No new releases landed in the last 24h, but the tracker is dense with substantive work: DeepSeek-V4-Flash SM8x (Ampere) support remains the single hottest issue with 116 comments, while a wave of correctness bugs surfaced on GB10/SM121 (Qwen3.8-Flash-Next long-prompt truncation) and DP>1 + MoE expert LoRA. On the performance side, spec-decode drafting has become the dominant optimization theme — three separate MRV2/EAGLE/MTP PRs (adaptive verification, adaptive draft depth, skip-drafting) plus a GB300 DeepSeek-V4.1 specialized decode landed in flight.

## 2. Releases & Breaking Changes

None in the last 24h. For awareness, two in-flight changes alter behavior at the API/config surface rather than via a release:

- **[KV Offload] Reject secondary tiers on engines that span nodes** ([#62930](https://github.com/vllm-project/vllm/pull/62930)) — engines with `nnodes > 1` will now **fail at startup** instead of silently serving wrong KV cache. If you run `TieringOffloadingSpec` on a multi-node engine, this is an intentional hard break; the mirrored-slot fix follows in [#62933](https://github.com/vllm-project/vllm/pull/62933).
- **[Model Loader] Run model-level post-load finalization from the loader hook** ([#57733](https://github.com/vllm-project/vllm/pull/57733)) — `load_weights` is being changed to no longer assume a single monolithic call. Relevant to anyone doing RL weight updates (verl buckets, NCCL tensor-by-tensor, inspected MTP completeness paths).

## 3. New Model & Hardware Support

- **DeepSeek-V4-Flash / V4-Flash-0731 on SM8x (Ampere A100/A800, RTX 30xx)** — still unsupported; [#50576](https://github.com/vllm-project/vllm/issues/50576) (116 comments, 16 👍) is the top-tracked feature request. Both checkpoints fail to run on Ampere today. If you're on A100s and eyeing these checkpoints, this is the blocker to watch.
- **Qwen3.8-2.4T-A95B (Quark MXFP4) on gfx950/MI355X** — ROCm perf-optimization tracker open at [#57149](https://github.com/vllm-project/vllm/issues/57149); work is landing as stacked PRs on main.
- **Qwen3.8-Flash-Next (Quark MXFP4) on gfx950/MI355X** — second ROCm tracker at [#59575](https://github.com/vllm-project/vllm/issues/59575). Architecture is non-trivial: GatedDeltaNet in 36 layers, QuerySparse Attention in 12, HyperConnection gated residual, MXFP4 MoE.
- **ROCm kernel parity for Qwen3-Next/Qwen3.5** — [#51406](https://github.com/vllm-project/vllm/pull/51406) proposes un-gating the pure-Triton `fused_qk_rmsnorm_rope_gate` kernel currently locked behind CUDA-only paths.
- **GLM-4.5/4.6 MoE, GLM-OCR MTP alignment** — [#62234](https://github.com/vllm-project/vllm/pull/62234) aligns speculator hidden-norm recycling with GLM5Next (pre-final-norm → post-final-hidden fix).

## 4. Performance & Optimization

Speculative decoding is the clear center of gravity today:

- **Skip drafting in dead steps** ([#62784](https://github.com/vllm-project/vllm/pull/62784), [MRV2]) — when no scheduled request can use drafts (non-final prefill chunks, requests already at `max_tokens`), the speculator proposes with K=0. Continues #48244.
- **Adaptive verification cost model** ([#62988](https://github.com/vllm-project/vllm/pull/62988), WIP) — benchmarked on Qwen3-32B + EAGLE3, GB200 TP1. AV-on `main` vs. verify-cost fix.
- **Adaptive draft depth from confidence scores** ([#62991](https://github.com/vllm-project/vllm/pull/62991), WIP) — K=3 fixed vs. AV K=5 vs. AV+early-stop K=5, Model Runner V2.
- **DeepSeek-V4.1-Flash specialized decode on GB300** ([#61868](https://github.com/vllm-project/vllm/pull/61868), closed) — one GB300 tray at TP4, DSpark spec decode with 5 draft tokens, FULL-graph decode for the small-batch agentic serving regime.
- **`RoutedExperts.load_weights` hot-path waste** ([#62768](https://github.com/vllm-project/vllm/issues/62768)) — `get_expert_mapping` + `_index_expert_mapping` rebuild on **every call**, ~50s on Qwen3.5-35B-A3B with runai_streamer. Regression introduced by #58720; no fix PR yet.
- **FlashInfer NVFP4 KV cache prefill regression on SM120** ([#50416](https://github.com/vllm-project/vllm/issues/50416)) — NVFP4 causal prefill **~1.7–1.8× slower** than FP8 (145.8ms vs ~81–86ms over 48 paged-prefill calls). Consumer Blackwell only.
- **Nemotron-3.5-Lightning NVFP4 decode regression on DGX Spark** ([#59770](https://github.com/vllm-project/vllm/issues/59770)) — **~16% slower** single-request decode from v0.29.0 onward, ~8% with DSpark; v0.30.0 and nightly do not recover.
- **RDNA hybrid-Mamba decode collapse at long context** ([#50264](https://github.com/vllm-project/vllm/issues/50264)) — root-caused to `on_gfx12x()` gate in #45916's split-KV decode kernel; fix exists upstream.
- **ROCm MXFP4 activation quant not fused into GEMM** ([#60581](https://github.com/vllm-project/vllm/issues/60581)) — gfx950; Quark INT4 W4A16 falls back to a slow Triton kernel.
- **Compact FP8 MLA rows for NoPE on SM120** ([#58305](https://github.com/vllm-project/vllm/pull/58305)) — follow-up to merged #55277.

## 5. Stability & Regressions

Ranked by severity:

1. **GB10/SM121 Qwen3.8-Flash-Next: prompt content past `indexer_budget` (2048) is invisible** ([#62776](https://github.com/vllm-project/vllm/issues/62776)) — not bad retrieval; the model answers as if the prompt ended at ~2K tokens. v0.32 nightly, 2× DGX Spark. **No fix PR.**
2. **DP > 1 + MoE expert LoRA applies wrong LoRA state** ([#61453](https://github.com/vllm-project/vllm/issues/61453)) — each DP replica applies its own LoRA state to tokens gathered from all replicas; dropped or cross-applied expert deltas. Unchanged on main, v0.31, v0.32rc0. **No fix PR.**
3. **CPU backend: non-LoRA requests batched with LoRA requests get the adapter applied** ([#62225](https://github.com/vllm-project/vllm/issues/62225)) — silent wrong output. **No fix PR.**
4. **`--attention-backend b12x` cannot serve hybrid attention/mamba models on v0.32.0** ([#62320](https://github.com/vllm-project/vllm/issues/62320)) — hybrid page alignment inflates block size to 2176; B12X only supports (64, 128). Hard startup failure.
5. **DFlash spec decode + gpt-oss target crashes with FA3 illegal memory access** ([#61330](https://github.com/vllm-project/vllm/issues/61330)).
6. **Multi-node KV-offload engines hang at init** ([#54415](https://github.com/vllm-project/vllm/issues/54415)) — `SharedOffloadRegion` assumes all ranks on one host; `TimeoutError` waiting on mmap. Fix PRs: [#62930](https://github.com/vllm-project/vllm/pull/62930) (reject), [#62933](https://github.com/vllm-project/vllm/pull/62933) (mirror slots).
7. **Mooncake example proxy commits HTTP 200 before decode failures** ([#62559](https://github.com/vllm-project/vllm/issues/62559)) — client sees success on requests that actually failed.
8. **Startup memory-profiling assertion aborts when free memory grows** ([#56830](https://github.com/vllm-project/vllm/issues/56830)) — contradicts documented GPU co-tenancy support.
9. **GDN / Qwen3-Next decode degenerates to repeated single token on non-Blackwell with fp32 SSM cache** ([#54308](https://github.com/vllm-project/vllm/issues/54308)) — gfx906/MI50.
10. **Whisper segment timestamps drift ~0.5s/segment on audio > 30s** ([#32588](https://github.com/vllm-project/vllm/issues/32588)) — long-standing `good first issue`, still open.

Also worth noting: **Monolithic Triton top-k falls back to full-vocab search** ([#61998](https://github.com/vllm-project/vllm/issues/61998)) — the Gaussian-fit pivot from the first 8192 logits misses outlier gathers for 6–10% of rows on MiMo-V2.6 logits.

## 6. What This Means for Application Developers

- **Spec decode is where the latency wins are coming from.** If you serve agentic workloads with EAGLE/MTP/DSpark, the MRV2 adaptive-draft stack ([#62784](https://github.com/vllm-project/vllm/pull/62784), [#62988](https://github.com/vllm-project/vllm/pull/62988), [#62991](https://github.com/vllm-project/vllm/pull/62991)) and the GB300 DSv4.1 decode path ([#61868](https://github.com/vllm-project/vllm/pull/61868)) are the ones to benchmark against your traffic mix. The wins are conditional on batch shape — small decode batches and dead prefill steps are the explicit targets.
- **If you're on Ampere, DeepSeek-V4-Flash is off the table.** [#50576](https://github.com/vllm-project/vllm/issues/50576) has no fix; plan A100/A800 capacity around V3.x or other checkpoints.
- **DGX Spark / GB10 users should upgrade carefully.** Qwen3.8-Flash-Next long-prompt truncation ([#62776](https://github.com/vllm-project/vllm/issues/62776)) is a silent correctness failure — the model gives confident wrong answers rather than errors. The Nemotron NVFP4 decode regression ([#59770](https://github.com/vllm-project/vllm/issues/59770)) is a 16% throughput hit that nightly has not recovered.
- **Audit your LoRA + DP + MoE combination.** If you serve expert LoRA under data parallelism ([#61453](https://github.com/vllm-project/vllm/issues/61453)) or run LoRA on the CPU backend ([#62225](https://github.com/vllm-project/vllm/issues/62225)), outputs may be silently wrong. These are the two most concerning correctness bugs in today's batch because they fail open.
- **Multi-node KV offload is about to get stricter, not looser.** [#62930](https://github.com/vllm-project/vllm/pull/62930) will turn today's silent wrong-KV behavior into a startup failure. If you've built around `TieringOffloadingSpec` on multi-node engines, follow [#62933](https://github.com/vllm-project/vllm/pull/62933) for the actual mirroring fix before the reject lands.
- **RL fine-tuning pipelines should watch [#57733](https://github.com/vllm-project/vllm/pull/57733).** If you call `load_weights` per-bucket (verl, NCCL tensor-by-tensor), the current single-call assumption is being removed — this is the change that will make or break your weight-sync loop.

</details>

<details>
<summary><strong>SGLang</strong> — <a href="https://github.com/sgl-project/sglang">sgl-project/sglang</a></summary>

# SGLang Digest — 2026-10-22

## 1. Today's Highlights

No new releases landed, but issue and PR activity is heavy: the Q4 roadmaps for **Prefill-Decode Disaggregation** and **Agentic Cache Scheduling** continue to accrue comments, while a fresh cluster of **SM120/SM90 GLM-5.3-Flash** performance and stability reports points to growing Blackwell-adjacent deployment interest. On the correctness side, several intermittent-but-serious bugs (FP8 Marlin wrong tokens, deterministic-inference drift under NEXTN, HiCache PP-sync hangs) are under active triage, and a stack of MoE/kernel memory-reduction PRs from `ch-wan` is moving through review.

## 2. Releases & Breaking Changes

- No new releases in the last 24h.
- Note for downstream consumers: nightly image `nightly-cu134-20261020-306ccf6` carries a Triton that **removed `tl.make_block_ptr`**, breaking FLA kernel compilation — see Stability section ([#45426](https://github.com/sgl-project/sglang/issues/45426)).
- Installer footgun still circulating: `uv pip install sglang` with uv < 0.12 silently resolves to 0.5.9 (Feb 2026) ([#35912](https://github.com/sgl-project/sglang/issues/35912), closed/inactive).

## 3. New Model & Hardware Support

- **GLM-5.3-Flash on SM120 (RTX PRO 6000)**: backend matrix being mapped; `fa4` crashes at CUDA-graph capture on hybrid extend, **Triton is currently the only working attention backend** ([#42012](https://github.com/sgl-project/sglang/issues/42012)).
- **GLM-5.3-Flash on Hopper (SM90)**: new performance tracking issue opened, part of Q4 roadmap #42473 ([#45373](https://github.com/sgl-project/sglang/issues/45373)).
- **Qwen3.8-Flash-Next on ROCm gfx950 / MI355X**: optimization tracker covering GatedDeltaNet, QuerySparse Attention, HyperConnection residuals, MXFP4 MoE, and NEXTN MTP ([#44304](https://github.com/sgl-project/sglang/issues/44304)).
- **DeepSeek-V4.1-Flash on 4× SM120 (PCIe, no NVLink)**: community field report — 1M context + DSpark works on v0.5.21 with two local patches ([#44445](https://github.com/sgl-project/sglang/issues/44445)).
- **AMD MoE**: native GLM MXFP4 Triton Gluon backend for MI355X in review ([#41639](https://github.com/sgl-project/sglang/pull/41639)).
- **NPU diffusion**: Wan2.2-T2V-A14B W4A4F4 DAOS with MXFP4 attention proposed ([#43367](https://github.com/sgl-project/sglang/pull/43367)).
- **sgl-flash-mla** release workflow being added (SGLang fork of FlashMLA wheel) ([#45651](https://github.com/sgl-project/sglang/pull/45651)).

## 4. Performance & Optimization

- **DeepSeek-V4.1 kernel fusion**: `rmsnorm_mxfp8` fused quantize for `wq_b` extended to arbitrary row counts, removing a separate `mxfp8_quantize` at larger batches ([#45633](https://github.com/sgl-project/sglang/pull/45633), closed). Follow-on: Mega-mHC and `wo_a` einsum now write MXFP8 directly for `wqkv_a`/`wo_b` ([#45632](https://github.com/sgl-project/sglang/pull/45632)).
- **DSPARK prefill**: publishes read-done earlier by placing draft KV inject before target forward, shortening the critical path ([#45682](https://github.com/sgl-project/sglang/pull/45682)).
- **GB300 megakernel path**: host-side work between DSv4.1 decode graphs moved into graphs to reduce CPU overhead ([#45450](https://github.com/sgl-project/sglang/pull/45450)).
- **MoE memory budgets**: stack of PRs restoring Muse Marlin projection-workspace and GGUF expert/accumulation budgets while keeping padded/nonlocal routes safe ([#45462](https://github.com/sgl-project/sglang/pull/45462), [#45566](https://github.com/sgl-project/sglang/pull/45566)).
- **Scheduler**: new skip-join MLFQ policy with cache-aware placement and prefill gate for agent-style traffic ([#45688](https://github.com/sgl-project/sglang/pull/45688)).
- **Sampling consistency**: top-k/top-p filtering unified across sampling paths — relevant for reproducible evals ([#41916](https://github.com/sgl-project/sglang/pull/41916)).

## 5. Stability & Regressions

Ranked by severity:

1. **PD prefill PP8 + HiCache hang** — PP0–PP3 deadlock in HiCache PP-sync drain after ~35 min, triggered by multi-turn agentic workload ([#45357](https://github.com/sgl-project/sglang/issues/45357)).
2. **FP8 Marlin wrong tokens with overlap scheduler on SM86** — 1–5 of 192 requests intermittently produce wrong tokens; exact without overlap scheduler ([#45000](https://github.com/sgl-project/sglang/issues/45000)).
3. **FLA kernels fail to compile on nightly-cu134-20261020** — Triton removed `tl.make_block_ptr`; blocks prefill CUDA-graph capture for Qwen3.5-397B-A17B-NVFP4 TP2 ([#45426](https://github.com/sgl-project/sglang/issues/45426)).
4. **Startup OOM on multi-node GB300** — 32 tokenizer workers + auto-selected `cuda_vmm` transport OOMs before first request ([#45345](https://github.com/sgl-project/sglang/issues/45345)).
5. **NEXTN deterministic-inference drift** — Qwen3.5-35B-A3B TP1/PP2 produces different greedy tokens under concurrent arrivals despite deterministic mode ([#45481](https://github.com/sgl-project/sglang/issues/45481)).
6. **Scheduler crash on empty queue** — `--max-queued-requests 0` with priority scheduling ([#45510](https://github.com/sgl-project/sglang/pull/45510)); related preemption fix in review ([#45686](https://github.com/sgl-project/sglang/pull/45686)).
7. **`/flush_cache` can hang indefinitely** if a DP rank is silent — no deadline on the wait ([#45512](https://github.com/sgl-project/sglang/issues/45512)).
8. **`--schedule-policy shortest-prefill-first` OOM** during chunked prefill when KV pool is fully locked — fix PR skips the chunked prefill ([#45685](https://github.com/sgl-project/sglang/pull/45685)).
9. **Gemma 2/3 on ROCm aiter unified attention** — runaway batched generations, GSM8K 0.57 vs 0.83 on Triton ([#41152](https://github.com/sgl-project/sglang/issues/41152)).
10. **MLX `return_logprob` silently empty** without `--mlx-enable-sampling`, causing `/v1/score` 500s ([#41211](https://github.com/sgl-project/sglang/issues/41211)).
11. **qwen_vl literal `<image>` in text** aborts with 500 "Mismatch: More IMAGE tokens found..." ([#43979](https://github.com/sgl-project/sglang/issues/43979)).
12. **DeepSeek-V4 leaks raw DSML** when `tool_choice="none"` ([#35736](https://github.com/sgl-project/sglang/issues/35736)).
13. **PD decode + unified radix cache**: external linker hit folded into `decode_prefix_len`, causing incorrect prealloc — fix skips linker L3 lookup on PD decode ([#45538](https://github.com/sgl-project/sglang/pull/45538)).

CI health: the flaky-test tracker ([#42752](https://github.com/sgl-project/sglang/issues/42752)) and the long-running CUDA coredump tracker ([#26340](https://github.com/sgl-project/sglang/issues/26340), 350 comments) remain the two highest-traffic issues. Post-merge NPU/XPU/Xeon/MUSA/SMG workflows were cancelling each other via shared concurrency groups ([#44832](https://github.com/sgl-project/sglang/issues/44832), closed).

## 6. What This Means for Application Developers

- **Agentic workloads are the design center now.** The Q4 PD-disaggregation roadmap ([#43699](https://github.com/sgl-project/sglang/issues/43699)) and the agentic cache scheduling roadmap ([#43098](https://github.com/sgl-project/sglang/issues/43098)) both target multi-turn, long-prompt/short-answer traffic. If you run agents at scale, expect scheduler and KV-sharing changes to land in this cycle; the new MLFQ skip-join policy ([#45688](https://github.com/sgl-project/sglang/pull/45688)) is worth watching.
- **Pin your image and your `uv`.** The Triton `make_block_ptr` breakage ([#45426](https://github.com/sgl-project/sglang/issues/45426)) and the silent 0.5.9 install ([#35912](https://github.com/sgl-project/sglang/issues/35912)) are both install-time footguns that will manifest as mysterious wrong output or compile failures.
- **Deterministic mode is not yet a guarantee** under NEXTN + concurrent arrivals ([#45481](https://github.com/sgl-project/sglang/issues/45481)). If you rely on bit-identical greedy output for evals or caching, validate on your exact topology or disable NEXTN until resolved.
- **Overlap scheduler + FP8 Marlin on Ampere is risky** for correctness-sensitive serving ([#45000](https://github.com/sgl-project/sglang/issues/45000)). Consider disabling overlap or the Marlin path until a fix lands.
- **Tool-calling with DeepSeek-V4**: `tool_choice="none"` can leak raw DSML into output ([#35736](https://github.com/sgl-project/sglang/issues/35736)) — sanitize or avoid that combination.
- **Operational endpoints**: `/flush_cache` lacks a deadline when a DP rank is unhealthy ([#45512](https://github.com/sgl-project/sglang/issues/45512)); wrap flush calls in client-side timeouts.

</details>

<details>
<summary><strong>llama.cpp</strong> — <a href="https://github.com/ggml-org/llama.cpp">ggml-org/llama.cpp</a></summary>

# llama.cpp Digest — 2026-10-22

## 1. Today's Highlights

A heavy release day: ten builds landed (b11793–b11803), headlined by new model support for **SenseNova U1** and **Flint (FlintForCausalLM)**, continued mtmd/multimodal infrastructure work, and a batch of hardening fixes (Jinja namespace shadowing, hexadecimal string escapes, QSA fused-mask op). Meanwhile, the issue tracker shows a cluster of **SYCL and CUDA regressions** (F16 NaN output, MoE TTFT blowups, fused-GEMM failures) that deserve attention before upgrading production stacks.

## 2. Releases & Breaking Changes

- **b11801 — SenseNova U1 support** ([PR #28919](https://github.com/ggml-org/llama.cpp/pull/28919)): Adds the dense U1 understanding branch including U1.5-8B-MoT; HF→GGUF conversion excludes MoT generation tensors. Existing conversions for other models are unaffected.
- **b11803 — Flint model support** ([PR #30928](https://github.com/ggml-org/llama.cpp/pull/30928)): New `FlintForCausalLM` architecture with sliding/full attention and routed/shared experts; requires a fresh GGUF conversion.
- **b11795 — `/v1/messages` sampling params** ([PR #30856](https://github.com/ggml-org/llama.cpp/pull/30856)): llama.cpp-specific sampling parameters (e.g. `top_k`, `min_p`, `repeat_penalty`) are now forwarded through the Anthropic-compatible endpoint instead of being silently dropped. No migration needed, but behavior for clients relying on the old no-op will change.
- **b11793 — Faster vocabulary loading** ([PR #30679](https://github.com/ggml-org/llama.cpp/pull/30679)): `llama_vocab` loading path optimized; no API changes.

## 3. New Model & Hardware Support

- **SenseNova U1 (text + image-to-text)** — [PR #28919](https://github.com/ggml-org/llama.cpp/pull/28919), landed b11801. Text-to-text, image-to-text, and image+text-to-text supported.
- **Flint (FlintForCausalLM)** — [PR #30928](https://github.com/ggml-org/llama.cpp/pull/30928), landed b11803. Uses adaptive expert-activation scaling (from #30861) with a 1,024 threshold, leaving headroom for Q8 KV cache.
- **QSA fused mask op** — [PR #30640](https://github.com/ggml-org/llama.cpp/pull/30640), landed b11800. New fused op for QSA scoring; also enrolls `glm5.3-next`.
- **DFlash optional FC input scale** — [PR #30945](https://github.com/ggml-org/llama.cpp/pull/30945) (open). Accepts `fc.input_scale` tensor for DFlash loads.
- **OpenCL IM2COL_3D** — [PR #30895](https://github.com/ggml-org/llama.cpp/pull/30895), landed b11797. Enables 3D convolution path for vision backends on OpenCL.
- **OpenCL F32→I32 ARGMAX** — [PR #30897](https://github.com/ggml-org/llama.cpp/pull/30897) (open). Needed to run LFM2.5-class models on OpenCL.

## 4. Performance & Optimization

- **SYCL Q8 fast dequant** — [PR #30775](https://github.com/ggml-org/llama.cpp/pull/30775), landed b11799. Speeds Q8_0 dequantization on Intel GPUs.
- **Vulkan/OpenCL Q4_K/Q6_K/Q4_0 non-MoE GEMM bin kernels** — [PR #30947–#30949](https://github.com/ggml-org/llama.cpp/pull/30949). Adreno X1-targeted, hand-tuned bin kernels.
- **SYCL Q4_K MMVQ wide-row pairing** — [PR #30226](https://github.com/ggml-org/llama.cpp/pull/30226), closed. Extends the GLU/plain Q4_K row-pairing optimization to 5–8 column widths on BMG.
- **AMD GCN MMQ config retune** — [PR #30021](https://github.com/ggml-org/llama.cpp/pull/30021) (open). Full re-tune of MMQ config quant boundaries for older AMD GPUs.
- **Vocab loading** — [PR #30679](https://github.com/ggml-org/llama.cpp/pull/30679), landed b11793. Reduced startup cost for large tokenizer vocabularies.
- **RAM peak during model load** — [PR #27483](https://github.com/ggml-org/llama.cpp/pull/27483), closed. Prevents RAM peaking at load time when embeddings exceed context footprint under `--repack`.

## 5. Stability & Regressions

Ranked by severity:

1. **SYCL F16 NaN on Qwen3.8-27B Q4_K_M since #29107** — [Issue #30892](https://github.com/ggml-org/llama.cpp/issues/30892). Dense Q4_K_M produces NaN output on Arc Pro B70; disabling fused GEMM (blas off) mitigates. **Fix PR not linked yet.** Affects both users of the SYCL F16 build and anyone using fused GEMM paths.
2. **First-inference TTFT regression after #30449** — [Issue #30793](https://github.com/ggml-org/llama.cpp/issues/30793). TTFT 10s → 60s+ with CPU-resident MoE weights; confirmed by reverting #30449 (CUDA pinned-buffer cap to 4 GB). **Fix PR not yet filed.** Impacts cold-start performance for large MoE configs.
3. **SYCL DeltaNet token soup on long prompts** — [Issue #29183](https://github.com/ggml-org/llama.cpp/issues/29183). Reproduces on Qwen3.6/3.8 and Nemotron on Intel Arc Pro B70. **No fix PR linked.**
4. **`--fit` doesn't account for SYCL memory usage** — [Issue #27595](https://github.com/ggml-org/llama.cpp/issues/27595). Runtime overflow on Arc B70 after load-time fit succeeds. **No fix PR linked.**
5. **Gemma 4 + `--mmproj` + MTP abort (`ubatch->embd_state` assert)** — [Issue #30698](https://github.com/ggml-org/llama.cpp/issues/30698). Regression from #30257; aborts on startup with mmproj + MTP draft. **No fix PR linked.**
6. **Vulkan `vk::DeviceLostError` on Linux 7.x (RADV/Strix Halo)** — [Issue #25664](https://github.com/ggml-org/llama.cpp/issues/25664), stale but active. Long-running; affects DeepSeek-V4-Flash and Qwen-3 GGUF loads.
7. **System prompt leaking across server slots** — [Issue #27422](https://github.com/ggml-org/llama.cpp/issues/27422). Reported via Lemonade, still open. **Cross-tenant correctness concern.**
8. **Detokenizer removes space before punctuation for Gemma 4** — [Issue #30905](https://github.com/ggml-org/llama.cpp/issues/30905). `x != y` → `x!= y`; a fix PR ([#30940](https://github.com/ggml-org/llama.cpp/pull/30940) — `clean_spaces` GGUF key) is open.
9. **SYCL dual-GPU stuck during model load** — [Issue #27547](https://github.com/ggml-org/llama.cpp/issues/27547). 2× Arc Pro B60. **No fix PR linked.**
10. **Jinja namespace attributes shadowed by dict methods** — [PR #30941](https://github.com/ggml-org/llama.cpp/pull/30941), **fixed** in b11802.
11. **Jinja hexadecimal string escapes** — [PR #30929](https://github.com/ggml-org/llama.cpp/pull/30929), **fixed** in b11798.
12. **`/tools` cross-origin and non-JSON requests** — [PR #29834](https://github.com/ggml-org/llama.cpp/pull/29834), **closed**. Server hardening; relevant if you exposed `/tools`.

## 6. What This Means for Application Developers

- **Sampling params now propagate on `/v1/messages`** ([b11795](https://github.com/ggml-org/llama.cpp/pull/30856)). If you're an Anthropic-compatible client (Claude Code, custom agents), behavior on the llama-server shim becomes predictable — you can now tune `top_k`, `min_p`, etc. from the same request. Audit any place you previously worked around the silent drop.
- **Multimodal tooling is stabilizing.** The new mtmd state object ([PR #30902](https://github.com/ggml-org/llama.cpp/pull/30902), b11796) plus the RERANK multimodal endpoint ([PR #29625](https://github.com/ggml-org/llama.cpp/pull/29625)) and LFM2 torchvision-aligned resize ([PR #30943](https://github.com/ggml-org/llama.cpp/pull/30943)) mean vision+text flows are getting first-class treatment — relevant for RAG over documents/images.
- **SYCL is the current rough edge.** If you ship on Intel Arc / BMG, pin to a known-good build (pre-#29107 for Q4_K_M dense models) or disable fused GEMM until #30892 is resolved. Avoid `--fit` on SYCL until #27595 lands.
- **MoE cold-start cost is a live concern.** If you run MoE models with CPU-resident experts, avoid the #30449 CUDA change until #30793 is addressed — first-inference TTFT regressions of 6× are the kind of thing that kills autoscaling warmups.
- **Cross-slot prompt leakage** ([#27422](https://github.com/ggml-org/llama.cpp/issues/27422)) is worth tracking if you're running multi-tenant or multi-slot server deployments. It's unconfirmed but has been open for two months without resolution.
- **OTLP/HTTP tracing** ([PR #27280](https://github.com/ggml-org/llama.cpp/pull/27280), open) is worth watching for production observability integration if you're standardizing on OpenTelemetry.

</details>

<details>
<summary><strong>Ollama</strong> — <a href="https://github.com/ollama/ollama">ollama/ollama</a></summary>

# Ollama Digest — 2026-10-22

## 1. Today's Highlights

Ollama shipped **v0.40.8**, headlined by the new **Flint** coding model from Recursive, purpose-built for coding-agent workloads. The day's PR queue was dense with agent-facing fixes: tool-call argument type preservation, Anthropic `/v1/messages` stream error surfacing, and OpenCode context-window correctness. Meanwhile, long-standing tool-parser regressions (Qwen 3.x 500s, Gemma4 parsing, GPT-OSS tool calls) continue to accumulate reports.

## 2. Releases & Breaking Changes

- **v0.40.8** — [`v0.40.8`](https://github.com/ollama/ollama/releases) — introduces the **Flint** model to the Ollama library ([ollama.com/library/flint](https://ollama.com/library/flint)), described as a coding model designed for agentic coding workflows. No documented API or config breaking changes. Note: a Flint-related 500 error was reported on NVIDIA Jetson AGX Orin ([#19186](https://github.com/ollama/ollama/issues/19186)).

## 3. New Model & Hardware Support

- **Apple Foundation Models (in progress)** — [PR #19184](https://github.com/ollama/ollama/pull/19184) adds a runner for `apple-foundation-model`, exposing macOS's on-device model via `ollama run`, `/api/chat`, `/api/generate`, and OpenAI-compatible endpoints. Tracks feature request [#19116](https://github.com/ollama/ollama/issues/19116).
- **DFlash2 on MLX (in progress)** — [PR #19149](https://github.com/ollama/ollama/pull/19149) adds DFlash2 speculative decoding support to the MLX backend, extending DFlash block draft with dynamic convolutions and a candidate selector.
- **llama.cpp bump (in progress)** — [PR #19194](https://github.com/ollama/ollama/pull/19194) advances the vendored llama.cpp from `b11738` to `b11803`.
- **WoA CUDA Toolkit** — [PR #19185](https://github.com/ollama/ollama/pull/19185) (closed) moves CI to the released CUDA Toolkit for Windows on Arm.

## 4. Performance & Optimization

- **Qwen3.5 / Qwen3.5-MoE parallelism unblock** — [PR #17144](https://github.com/ollama/ollama/pull/17144) proposes removing the `numParallel = 1` hardware blocklist in `server/sched.go` for `qwen35` and `qwen35moe`, citing an upstream llama.cpp crash fix (2026-03-08). If merged, this materially increases concurrent throughput on hybrid-attention Qwen3.5 deployments.
- **DFlash2 speculative decoding** — [PR #19149](https://github.com/ollama/ollama/pull/19149) (see above) is the primary inference-latency track currently in flight on the MLX path.
- **dspark feature request** — [#17016](https://github.com/ollama/ollama/issues/17016) continues to gather interest for built-in speculative acceleration; no implementation PR yet.

## 5. Stability & Regressions

Ranked by severity:

1. **Ollama Cloud Pro ~95% failure rate** — [#15453](https://github.com/ollama/ollama/issues/15453) (54 comments, 22 👍) reports near-total failure across `glm-5.1:cloud`, `kimi-k2.5:cloud`, `qwen3.5:cloud`, `deepseek-v3.2`, etc. on a paid plan. No fix PR referenced. **Critical for anyone depending on cloud inference.**
2. **Bootstrap/cancellation stall under model eviction** — [#19182](https://github.com/ollama/ollama/issues/19182) describes a pending eviction being cancelled by a `keep_alive` request for the resident model, stalling a queued request for its full keep-alive duration. Fix PR: [#19190](https://github.com/ollama/ollama/pull/19190).
3. **Flint integer tool-arg coercion** — [#19191](https://github.com/ollama/ollama/issues/19191): integer tool-call arguments round-trip as float strings (`30000` → `"30000.0"`), causing schema validation failures. Fix PR: [#19195](https://github.com/ollama/ollama/pull/19195).
4. **Silent drop of tool calls for unknown functions** — [#19187](https://github.com/ollama/ollama/issues/19187): calls to functions not in the request's `tools` are silently swallowed (empty response, `eval_count > 0`). Affects `qwen3:8b` on 0.40.4–0.40.7. No fix PR yet.
5. **Anthropic `/v1/messages` stream errors lost after first chunk** — [#19177](https://github.com/ollama/ollama/issues/19177). Fix PR: [#19188](https://github.com/ollama/ollama/pull/19188).
6. **Qwen3.x tool-parser 500s** — [#17778](https://github.com/ollama/ollama/issues/17778) (`no user query found in messages`), [#16383](https://github.com/ollama/ollama/issues/16383) (template drift between qwen3.6 and qwen3.5 parser), [#14570](https://github.com/ollama/ollama/issues/14570) (truncated tool JSON → 500). Fix PR for the first: [#17813](https://github.com/ollama/ollama/pull/17813).
7. **Gemma4 tool-parsing errors persist on 0.20.1** — [#15315](https://github.com/ollama/ollama/issues/15315) (50 comments).
8. **GPT-OSS incomplete tool calls** — [#12187](https://github.com/ollama/ollama/issues/12187) (41 comments, open since 2025-09).
9. **OpenCode launches with advertised, not allocated, context length** — [#19172](https://github.com/ollama/ollama/issues/19172); fix PR [#19193](https://github.com/ollama/ollama/pull/19193) preloads the model and reads `/api/ps`.
10. **Responses API drops readable reasoning/images and namespace tool identity** — [PR #19192](https://github.com/ollama/ollama/pull/19192), [PR #16263](https://github.com/ollama/ollama/pull/16263).
11. **A100 PCIe bus loss during Qwen35 inference** — [#19006](https://github.com/ollama/ollama/issues/19006) (Xid79, node reboot), reproduced on 0.34.4 and 0.35.0. **Hardware-critical; track before rolling Qwen3.5 to A100 fleets.**

## 6. What This Means for Application Developers

- **Tool-calling is the current weak seam.** If you build agents on Ollama, pin to a version, but be aware that integer coercion, unknown-function drops, namespace-tool flattening, and truncated-JSON 500s are all open today. Validate tool schemas client-side and treat empty responses with `eval_count > 0` as a likely silently-dropped tool call.
- **Plan for `/v1/messages` error semantics changing.** [PR #19188](https://github.com/ollama/ollama/pull/19188) will start emitting flushed Anthropic error events after HTTP 200 — clients that assume "200 means no errors" should be updated.
- **OpenCode users should upgrade once [#19193](https://github.com/ollama/ollama/pull/19193) lands** to avoid premature context compaction when `num_ctx < ContextLength`.
- **Qwen3.5 parallelism** ([#17144](https://github.com/ollama/ollama/pull/17144)) is the biggest throughput lever on the horizon — worth tracking if you are serving Qwen3.5/MoE at concurrency.
- **Cloud Pro is not currently a safe dependency** for production traffic per [#15453](https://github.com/ollama/ollama/issues/15453); keep a local fallback path.
- **Apple Silicon devs:** the `apple-foundation-model` runner ([#19184](https://github.com/ollama/ollama/pull/19184)) will let you route to the system model through the same API surface — useful for lightweight local agents.

</details>

<details>
<summary><strong>LiteLLM</strong> — <a href="https://github.com/BerriAI/litellm">BerriAI/litellm</a></summary>

# LiteLLM Digest — 2026-10-22

## 1. Today's Highlights

The dominant story today is a **supply-chain security incident**: LiteLLM `1.107.0` was published to PyPI and Docker registries from a **lookalike repo (`Berri-AI/litellm`)** and contained a credential stealer (`cook.pth`) plus a `sitecustomize` RCE loader. PyPI has removed the version and the affected Docker tags have been yanked ([#47826](https://github.com/BerriAI/litellm/issues/47826)). Separately, the **Rust migration** of the gateway continues to generate discussion as the headline performance initiative ([#31263](https://github.com/BerriAI/litellm/issues/31263)), and the latest release line (v1.106.2) carries the now-standard cosign image signature verification note. Treat the compromised-version advisory as the top operational item for anyone pinning images or wheels.

## 2. Releases & Breaking Changes

- **v1.106.2** — Latest release; reiterates that all Docker images are signed with cosign using the key introduced in commit `0112e53`. No functional changelog detail in the release body. ([release](https://github.com/BerriAI/litellm))
- **v1.105.3 / v1.104.5 / v1.103.7** — Backport/maintenance releases in the same window, all carrying identical cosign-signature guidance.
- **⚠️ Do not deploy `1.107.0`** — This version is compromised. Remove from lockfiles, image pins, and CI caches. Verify any cached layers against the cosign key before reuse. ([#47826](https://github.com/BerriAI/litellm/issues/47826))

## 3. New Model & Hardware Support

- **OpenRouter rerank provider** — Adds `litellm.rerank(model="openrouter/cohere/rerank-v3.5", ...)` support via `POST /api/v1/rerank`. Previously failed with `Unsupported provider: openrouter`. ([PR #47885](https://github.com/BerriAI/litellm/pull/47885))
- **Foundry Local provider** — New provider integration with SDK 2.2.1 setup. ([PR #47713](https://github.com/BerriAI/litellm/pull/47713))
- **Bitdeer AI provider** — Registered as a JSON-configured OpenAI-compatible provider with pricing for 3 models. ([PR #36734](https://github.com/BerriAI/litellm/pull/36734))
- **Superbot provider** — Added as an OpenAI-compatible provider keyed `superbot-gg`. ([PR #47505](https://github.com/BerriAI/litellm/pull/47505))
- **Nadir (Decisions provider)** — Enables Nadir as an auto-router decision model. ([PR #41797](https://github.com/BerriAI/litellm/pull/41797))

## 4. Performance & Optimization

- **Rust gateway migration** — Parent tracking issue for the Rust rewrite targeting **sub-1ms gateway overhead**. Beta tester signup is open; this is the flagship performance workstream. ([#31263](https://github.com/BerriAI/litellm/issues/31263))
- **httpx timeout handling** — PR to honor split `httpx.Timeout` (connect/write/pool) for all providers, not just openai/azure/bedrock; currently those limits are silently dropped for other providers. ([PR #47883](https://github.com/BerriAI/litellm/pull/47883))
- **Redis-free streaming** — Removes undeclared optional Redis import from SDK streaming path so success callbacks aren't suppressed when Redis is absent. ([PR #45383](https://github.com/BerriAI/litellm/pull/45383))

## 5. Stability & Regressions

Ranked by severity:

1. **🔴 Supply-chain compromise — `1.107.0`** — Credential stealer + RCE loader shipped from lookalike repo. PyPI removed; Docker `latest`, `main-latest`, `main-stable` yanked across `ghcr.io/berriai/litellm{,-database,-non_root}` and `docker.io/litellm/litellm`. ([#47826](https://github.com/BerriAI/litellm/issues/47826))
2. **🟠 Streaming correctness** — Clean stream EOF without `finish_reason` reported as successful completion with estimated usage; partial JSON indistinguishable from provider-confirmed stop. ([#40260](https://github.com/BerriAI/litellm/issues/40260))
3. **🟠 Spend logs dropped (since v1.99.0)** — Providers returning `id: null` (Databricks-Gemini) produce `request_id: "None"` colliding on primary key, silently dropping spend rows. ([#39749](https://github.com/BerriAI/litellm/issues/39749))
4. **🟠 Budget windows don't reset carried spend** — Applying `budget_duration` to existing key/user/team via update endpoints leaves stale spend, causing instant 429s on a fresh window. ([#34492](https://github.com/BerriAI/litellm/issues/34492))
5. **🟠 Retry bypass** — `AsyncHTTPHandler.post` resends requests after `ConnectError`/`RemoteProtocolError` even with `max_retries=0`. ([#47824](https://github.com/BerriAI/litellm/issues/47824))
6. **🟠 Gemini/Vertex prompt caching broken** — Mid-conversation `system` messages change the prefix every turn, forcing `cache_read_input_tokens: 0`. ([#42104](https://github.com/BerriAI/litellm/issues/42104))
7. **🟡 Cost-map wipe on reload** — With empty `model_list` + `STORE_MODEL_IN_DB=True`, price reload wipes DB deployments' runtime cost-map registrations. ([#43444](https://github.com/BerriAI/litellm/issues/43444))
8. **🟡 Guardrail masking bug** — Presidio in `logging_only` mode masks the response returned to the client (streaming and non-streaming). ([#47605](https://github.com/BerriAI/litellm/issues/47605))
9. **🟡 Ollama streaming tool calls** — Every tool-call delta emitted with `index=0`, merging parallel calls into malformed JSON. ([#33678](https://github.com/BerriAI/litellm/issues/33678))
10. **🟡 SigV4/S3 presigned URL breakage** — `HTTPHandler` query re-parse mutates presigned image URLs, causing 403s (Bedrock Converse image processing). ([#47837](https://github.com/BerriAI/litellm/issues/47837))

No fix PRs are referenced for items 2–10 in today's data.

## 6. What This Means for Application Developers

- **Pin to a known-good version now.** If you consume `litellm` via PyPI or `litellm/litellm` Docker tags, audit your lockfiles and image references. `1.107.0` is malicious; `1.106.2` is the current signed release. Verify cosign signatures on any image before deploy. Rotate any credentials that may have transited a `1.107.0` container.
- **Expect cost/usage fidelity gaps** if you're on Databricks-Gemini or using DB-stored deployments — spend logs and cost maps can silently under-report. Instrument your own usage counters for billing-critical paths.
- **Budget enforcement is not yet reliable** when `budget_duration` is applied to existing principals; treat 429s from fresh windows as a known issue rather than a quota problem.
- **If you rely on Gemini/Vertex prompt caching** with mid-conversation system messages (common in Claude Code-style flows), caching is effectively disabled — budget for full input-token costs.
- **Rust gateway is coming.** Sub-1ms overhead targets are meaningful for latency-sensitive agent loops and high-fan-out tool callers; sign up for the beta if you want to validate before GA.
- **New provider breadth** (OpenRouter rerank, Foundry Local, Bitdeer, Superbot) reduces the need for custom `api_base` plumbing — useful if you're consolidating multi-provider routing behind a single gateway.

</details>

<details>
<summary><strong>Unsloth</strong> — <a href="https://github.com/unslothai/unsloth">unslothai/unsloth</a></summary>

# Unsloth Digest — 2026-10-22

## 1. Today's Highlights
No new releases landed in the last 24h, but the PR queue is heavy with Studio-side memory-management fixes and diffusion/MLX enablement work. The most impactful incoming changes address VRAM mis-pricing for large embedding tables ([#14465](https://github.com/unslothai/unsloth/pull/14465)), stale "loaded" state after a chat model subprocess crashes ([#14575](https://github.com/unslothai/unsloth/pull/14575)), and idle Decision API models crowding out chat models ([#14555](https://github.com/unslothai/unsloth/pull/14555), [#14580](https://github.com/unslothai/unsloth/pull/14580)). Several MoE/kernel correctness fixes (autotune cache, shared-memory sizing) also merged or are pending.

## 2. Releases & Breaking Changes
None. No new versions published in the last 24h. Note that the reported base version in the field is `v0.1.909-beta` / package `2026.10.7` (see [#14335](https://github.com/unslothai/unsloth/issues/14335), [#14519](https://github.com/unslothai/unsloth/issues/14519)).

## 3. New Model & Hardware Support
- **MOSS-Image** added to Studio as an image family, with quantized builds and GGUF routing through `stable-diffusion.cpp`; official repos ship remote code, so an in-tree port was needed — [#14552](https://github.com/unslothai/unsloth/pull/14552).
- **MLX PLE and expert offload** in Studio (requires `unsloth-zoo#1893`; GLM-5.3-Flash and DeepSeek-V4.1-Flash also need `unsloth-zoo#1892`) — [#14326](https://github.com/unslothai/unsloth/pull/14326).
- **Per-layer embedding / Engram lookup tables** (DeepSeek-V4.1 Engram, Qwen3.8-Flash-Next, Gemma 4 PLE, gemma-3n PLE) now priced as host/disk memory rather than VRAM — [#14465](https://github.com/unslothai/unsloth/pull/14465).
- **FP8 single-file diffusion weights** retained in FP8 when widening would offload or crowd host RAM (relevant for Ampere/T4, e5m2, offloaded plans) — [#14549](https://github.com/unslothai/unsloth/pull/14549).
- Community request to add **Sage-A1.5 (35B MoE)** GGUF — [#14553](https://github.com/unslothai/unsloth/issues/14553).

## 4. Performance & Optimization
- **Decision model idle unload**: idle Laya/Clef workers previously held VRAM, reducing Qwen3-4B Q8_0 context from 123k → 116k on L4; fix unloads idle decision models when another model loads — [#14555](https://github.com/unslothai/unsloth/pull/14555).
- **Tensor split across idle GPU pairs** for dense models and MTP MoE, avoiding layer-split half-idle decode — [#14446](https://github.com/unslothai/unsloth/pull/14446).
- **MLX long-chat prompt cache**: chats past the ~25k-token budget (Qwen3-0.6B on 24 GB Mac) re-read the whole conversation each turn (7–13s); fix restores per-turn caching — [#14574](https://github.com/unslothai/unsloth/pull/14574).
- **GGUF load speedup**: skip full vocabulary unpacking during memory sizing before launching `llama-server` — [#14573](https://github.com/unslothai/unsloth/pull/14573).
- **Diffusion defaults**: turn on measured-safe optimizations (fused FLUX RoPE, CFG batching, Blackwell native attention, BF16 small DiTs) — [#14566](https://github.com/unslothai/unsloth/pull/14566); CFG-parallel now persists past the 2nd image on the default speed tier and supports Z-Image guidance on two cards — [#14564](https://github.com/unslothai/unsloth/pull/14564).
- **MoE kernel fixes**: shared-memory sizing for float32 operands in fallback configs — [#14576](https://github.com/unslothai/unsloth/pull/14576); autotune disk cache now compares device capability as a tuple so saved configs actually hit — [#14578](https://github.com/unslothai/unsloth/pull/14578).

## 5. Stability & Regressions
Ranked by severity:

1. **Core dumps and stalled inference on recent updates** — models stop responding after a few turns regardless of KV usage; ejecting models core dumps. No fix PR referenced. [#14411](https://github.com/unslothai/unsloth/issues/14411) (OPEN)
2. **Block compile breaks gradient checkpointing on distributed runs** — `CheckpointError` in backward of step 1 under non-reentrant gradient checkpointing since 2026.10.6; workaround `UNSLOTH_BLOCK_COMPILE=0`. Reproduced across two architectures. [#14063](https://github.com/unslothai/unsloth/issues/14063) (CLOSED)
3. **GGUF load crash on Windows** instead of falling back to the low-memory route — [#14513](https://github.com/unslothai/unsloth/issues/14513) (OPEN)
4. **Crashed chat model still shown as loaded** — every message fails with "Inference subprocess is not running" and the UI offers no recovery; fix PR open — [#14575](https://github.com/unslothai/unsloth/pull/14575).
5. **Cold padding/packed mask cache fails FlexAttention capture (gb0067)** — [#13944](https://github.com/unslothai/unsloth/issues/13944) (CLOSED).
6. **Memory leak on Windows C: drive** — 200–400 MB lost per use with no cleanup path — [#14487](https://github.com/unslothai/unsloth/issues/14487) (OPEN).
7. **False-positive malware scan** — [#14306](https://github.com/unslothai/unsloth/issues/14306) (CLOSED).
8. **Gemma-3 FastDecisionModel (Clef head) doesn't train** — flat loss, chance-level accuracy — [#14439](https://github.com/unslothai/unsloth/issues/14439) (OPEN).
9. **Ling 3 tiny fine-tune export failure** — [#13948](https://github.com/unslothai/unsloth/issues/13948) (CLOSED).
10. **Installer ignores `PIP_INDEX_URL` / `UV_INDEX_URL`** — hard-codes PyPI, blocking air-gapped/mirror installs — [#13737](https://github.com/unslothai/unsloth/issues/13737) (CLOSED).
11. **Sampling settings corrupted on preset save** — [#14068](https://github.com/unslothai/unsloth/issues/14068) (CLOSED).
12. **Qwen3-ASR ignores requested transcription language (mtmd)** — [#14547](https://github.com/unslothai/unsloth/issues/14547) (OPEN); TTS language setting not forwarded (Supertonic 3) — [#14481](https://github.com/unslothai/unsloth/issues/14481) (CLOSED).
13. **`unsloth start codex` fails on Windows** — `stdout is not a terminal` even in interactive console — [#10699](https://github.com/unslothai/unsloth/issues/10699) (CLOSED).
14. **Multi-account local model sync** — same loaded model not synced across LAN accounts — [#12365](https://github.com/unslothai/unsloth/issues/12365) (CLOSED).

## 6. What This Means for Application Developers
- **Multi-model hosts need careful placement**: if you run a Decision API alongside a chat model, expect VRAM contention until [#14555](https://github.com/unslothai/unsloth/pull/14555)/[#14580](https://github.com/unslothai/unsloth/pull/14580) land — decision models will be hidden from the chat picker and unloaded when idle.
- **Distributed fine-tuning**: pin `UNSLOTH_BLOCK_COMPILE=0` on multi-GPU non-reentrant gradient-checkpoint runs until the checkpoint interaction is resolved ([#14063](https://github.com/unslothai/unsloth/issues/14063)).
- **Stability on `2026.10.x`**: if you see post-turn stalls or core dumps on eject, that matches an open regression ([#14411](https://github.com/unslothai/unsloth/issues/14411)); capture `coredumpctl` output and llama/server logs.
- **Windows GGUF deployments**: validate low-memory fallback behavior before shipping — crashes instead of graceful degradation are reported ([#14513](https://github.com/unslothai/unsloth/issues/14513)).
- **Air-gapped installs**: the installer's hard-coded PyPI index is now closed as fixed, but verify against your mirror config before relying on it ([#13737](https://github.com/unslothai/unsloth/issues/13737)).
- **Mac/MLX agents**: long conversations benefit materially from the prompt-cache fix ([#14574](https://github.com/unslothai/unsloth/pull/14574)); embedding large lookup tables off VRAM also unlocks bigger models on constrained cards ([#14465](https://github.com/unslothai/unsloth/pull/14465)).
- **Image pipelines**: diffusion default changes ([#14566](https://github.com/unslothai/unsloth/pull/14566), [#14564](https://github.com/unslothai/unsloth/pull/14564)) may shift latency and output determinism — re-baseline before comparing generations.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*