# AI Infrastructure Digest 2026-11-20

> Generated: 2026-11-20 02:14 UTC | Projects covered: 6

- [vLLM](https://github.com/vllm-project/vllm)
- [SGLang](https://github.com/sgl-project/sglang)
- [llama.cpp](https://github.com/ggml-org/llama.cpp)
- [Ollama](https://github.com/ollama/ollama)
- [LiteLLM](https://github.com/BerriAI/litellm)
- [Unsloth](https://github.com/unslothai/unsloth)

---

## Cross-Project Comparison

# Cross-Project Comparison Report — AI Infrastructure Ecosystem
**Date: 2026-11-20**

---

## 1. Ecosystem Overview

The AI infrastructure landscape on 2026-11-20 is bifurcating along two axes: **stabilization vs. expansion**. The high-level serving engines (vLLM, SGLang) are entering a consolidation phase — SGLang's explicit 1.0 "stability release" framing and vLLM's retirement of native model implementations signal that both projects are hardening APIs and burning down legacy code rather than chasing new features. Meanwhile, the local/edge runtime tier (llama.cpp, Ollama, Unsloth) is in aggressive expansion mode, racing to add model architectures, non-NVIDIA backends (OpenCL, SYCL, ROCm, NPU), and hardware diversity. The gateway tier (LiteLLM) is maturing into enterprise plumbing — read-replica HA, guardrails, budget enforcement — but continues to surface correctness regressions in streaming and routing. Across all tiers, **speculative decoding and KV/prompt cache reuse are the two most fragile surfaces**, with independent correctness failures reported in every runtime that supports them.

---

## 2. Activity Comparison

| Project | Layer | Issues Updated | PRs Updated | Release Status | Notable Signal |
|---|---|---|---|---|---|
| **vLLM** | Serving engine | Heavy (multiple trackers + ~10 regressions) | Heavy (20+ PRs referenced) | **No release in 24h** | Highest correctness-bug density; 3 spec-decode failures |
| **SGLang** | Serving engine | 70 | 500 | **No release in 24h**; 1.0 tracker active | Planning 1.0 as "stability release" |
| **llama.cpp** | Local runtime | Multiple (10 ranked regressions) | 10 builds landed (b12547–b12556) | **10 builds in 24h** | Fastest shipper; OpenCL/BF16/SYCL expansion |
| **Ollama** | Local runtime | ~10 (incl. CVEs, cache bugs) | ~8 PRs in flight | **No release in 24h** | MLX/Metal runner work landing fast |
| **LiteLLM** | Gateway | ~12 (5 closed, 7 open) | Multiple (guardrails, auth v2) | **5 releases** (dev, RC, patches, LTS) | Only project with active release cadence |
| **Unsloth** | Training / fine-tuning | ~8 (6 open) | ~15 (mix closed/open) | **v0.1.920-beta shipped** | AMD NPU + video diffusion LoRA |

**Key observation:** Release cadence is inversely correlated with layer abstraction. LiteLLM (gateway) and llama.cpp (local runtime) ship continuously; vLLM/SGLang (serving engines) issue zero releases in 24h while accumulating fix PRs — consistent with pre-release freeze behavior.

---

## 3. Model Support Race

| Project | Newly Supported (2026-11-20) | Focus |
|---|---|---|
| **vLLM** | Nemotron VL/Omni (Rust frontend), Nemotron Deciffusion 8B, MXFP8 DeepEP MoE on SM100/103 | Frontier MoE + multimodal |
| **SGLang** | Ovis-Image 7B, MindIE-SD (Ascend), FlashInfer cuTile NVFP4 MoE on SM12x, Kimi-K3 shared-expert sharding, DeepSeek-V4.1 on Ascend | Convergence of serving + generation; multi-vendor |
| **llama.cpp** | Spark2.5 DSpark drafts, OCP FP8 E4M3 (SYCL), Qwen3-TTS/PocketTTS via COL2IM, WebGPU POOL_2D | Broad long-tail architecture coverage |
| **Ollama** | Tencent Hy4 Flash (text+vision) on MLX, NVFP4 import | Consumer-friendly multimodal |
| **LiteLLM** | SGLang provider, Qdrant vector store, Gemini 3.8 Flash, GPT-5.5+ stop sequences, Vertex AI Live | Gateway aliasing + provider breadth |
| **Unsloth** | LTX-2.5, MOSS-Image (video/image LoRA), Cosmos3 FP8, AMD NPU Q4NX | Diffusion + edge training |

**Who's ahead:**
- **Frontier architectures (MoE, MLA, hybrid GDN):** vLLM and SGLang are clearly ahead — they are the *first* runtimes to support Qwen3.8-Flash-Next, DeepSeek-V4 DSpark, GLM-5.3, and Kimi-K3 variants.
- **Breadth of long-tail architectures:** llama.cpp leads by volume, absorbing TTS, vision, and ternary-weight models the served engines don't touch.
- **Non-NVIDIA hardware:** SGLang (Ascend NPU, AMD ROCm) and llama.cpp (OpenCL/Adreno, SYCL, WebGPU) lead; vLLM is playing catch-up (`#67816` XPU KV offload, `#59575` MI355X perf tracking).
- **Diffusion/generation:** SGLang (`sglang generate` + Ovis-Image) and Unsloth (LTX-2.5, Cosmos3) are pioneering text-to-image/video inside the LLM stack — a notable 2026 convergence.

---

## 4. Performance Frontier

| Optimization Area | vLLM | SGLang | llama.cpp | Ollama | Unsloth |
|---|---|---|---|---|---|
| **KV / prompt cache** | PeerL1Connector, NixlConnector, HiSparse reuse | HiCache L3 prefetch (under CP), DFLASH ReplaySSM | (n/a — local) | MLX conv cache (PR #19745), per-layer sizing (#19327) | (n/a) |
| **Batching / scheduling** | PP long-prefill chunking, FlashInfer XQA ragged mask | SchedulePolicy refactor, GDN cross-round DFLASH | Vulkan i915, HIP hipCUB | MLX parallel slot autotune (#19785) | CUDA graph warm-ups (#18533) |
| **Quantization** | MXFP8 / W8A8 MoE, GLM-5.3 CUDA opts | NVFP4 MoE (SM12x), AMD low-ratio fills | Q2_K factoring, BF16 ROPE/SET_ROWS | NVFP4 import (Hy4) | Cosmos3 FP8 (1.65→1.14 s/step), int8 CUTLASS on T4 |
| **Distributed serving** | PCIe IPC all-gather, shm_broadcast spin, PP chunking | Kimi-K3 multicast (5–6% prefill), TP across ADP | RPC, hipCUB | (n/a) | (n/a) |
| **Kernels** | AMD MonoKernel, FlashInfer CuteDSL | extend_attention_unified (bug), Triton/FlashInfer | DP4A int8, GQA head folding | MLX/Metal runner | Fused W8A8 quant (Cosmos3), raced CUTLASS GEMM |

**Where effort concentrates:**
- **KV cache orchestration** is the single densest theme. vLLM (PeerL1Connector, NixlConnector lease races, HiSparse), SGLang (HiCache L3 under CP), Ollama (single/multi-slot cache), and llama.cpp (IMROPE cache reuse) are *all* shipping or debugging cache behavior this cycle. This is the highest-leverage optimization surface in production.
- **Quantization** is diverging: serving engines push MXFP8/NVFP4 for frontier MoE, while local runtimes focus on 4-bit/DP4A for consumer hardware.
- **Kernel specialization on non-NVIDIA** is the fastest-growing subarea: SGLang (Ascend MindIE, AMD fills), vLLM (AMD MonoKernel tracker), llama.cpp (OpenCL/SYCL/Vulkan), Unsloth (NPU Q4NX). The moat is no longer CUDA-only.

---

## 5. Layer Positioning

| Tier | Projects | Primary Role | Key Differentiator |
|---|---|---|---|
| **Serving engine (datacenter)** | vLLM, SGLang | High-throughput multi-tenant inference with disagg P/D, prefix caching, spec decode | Feature velocity on frontier models; complexity is the tax |
| **Local runtime (edge/desktop)** | llama.cpp, Ollama | Single-node inference; hardware breadth over architecture novelty | Runs *everywhere* (Metal, Vulkan, ROCm, NPU, CPU); lower correctness bar but more bugs |
| **Gateway (routing/auth)** | LiteLLM | Multi-provider abstraction, budget/guardrail enforcement, MCP tool routing | The only project with a real HA story (read replicas, LTS) — and the only one shipping ongoing |
| **Training / fine-tuning** | Unsloth | LoRA/fine-tune + Studio IDE; vLLM/SGLang as its own engines | Uniquely spans training → serving, and now diffusion |

**Interdependencies worth noting:**
- Unsloth **depends on** vLLM/SGLang (its engine installs) — its stability is coupled to theirs.
- LiteLLM **fronts** vLLM, SGLang, Ollama, and OpenAI protocol — it inherits every downstream `finish_reason` bug (see §6).
- llama.cpp and SGLang both serve diffusion now — the "LLM stack" and "image stack" are merging.

---

## 6. Trend Signals

**For infrastructure engineers watching the stack:**

1. **Speculative decoding has entered its "don't trust it" phase.** Three independent spec-decode failures landed today alone: vLLM XPU FP16 0% acceptance (#55250), vLLM Qwen3.5/3.8 prefix-cache NaN (#55766), llama.cpp dflash collapse to ~6% (#32526), llama.cpp MTP regression (#25489). Treat spec decode as a *measured SLI*, not a config flag.

2. **KV/prompt cache is the new correctness frontier.** Every runtime reported cache-related correctness bugs today: silent corruption (vLLM #61229), HiCache stalls (SGLang #51608), full re-prefill on Qwen3.5 (llama.cpp #32316), 4-token cache hits out of 2,040 (Ollama #19774), zero cache hits on cloud resume (Ollama #19773). Caching is no longer just a perf lever — it's a correctness hazard.

3. **Silent truncation and silent corruption are systemic.** Ollama's 65,536-token truncation with `done_reason: "stop"` (#19765), llama.cpp Pascal sm_60 long-context corruption (#32375), and Vulkan i915 20s timeouts causing wrong outputs (#32516) all share a failure mode: **no error surfaces**. Whether you serve locally or in the cloud, build assertion layers on token counts, output checksums, and finish reasons.

4. **Non-NVIDIA backends are graduating from "toy" to "viable."** SYCL FP8 E4M3, OpenCL DP4A int8 FA, AMD NPU Q4NX, Ascend MindIE-SD, hipCUB ARGSORT — all landed today. If you dismissed these backends earlier this year, re-benchmark.

5. **The serving engines are entering a stabilization window.** SGLang's 1.0 tracker replaces silent config changes with named errors; vLLM is retiring native model implementations. **Expect flag churn and import-path breakage in the next 1–2 quarters.** Pin deliberately.

6. **Gateway fidelity is the weakest link in agent stacks.** LiteLLM's `finish_reason: "stop"` masking of errors (`#48721`) means router retries may never fire — and this compounds the spec-decode and tool-call failures above. A failure that reaches the gateway as "success" is invisible end-to-end.

**For agent/application developers — what to instrument this week:**

- **Spec-decode acceptance rate** per (model, backend, dtype). Anything below ~70% is a latency regression disguised as a feature.
- **Prompt-cache hit rate** per session. Multi-turn agent loops are the worst-case workload for today's cache bugs.
- **Tool-call completeness**: assert `finish_reason`, `usage.completion_tokens`, and `len(tool_calls)` are mutually consistent. Ollama (#19780, #19776), Unsloth (#18481), and vLLM (#58147, #66858) all reported tool-call parsing loss this cycle.
- **Token-count assertions** on any long input — silent truncation is now a known failure mode across at least three runtimes.
- **Patch posture**: LiteLLM (#19771 HIGH CVEs), llama.cpp (b12556 HRM OOB write on model load), SGLang (`/rollout/generate` arbitrary file write, #51555) all require near-term upgrade action.

**Bottom line:** The ecosystem shipped broad model/hardware coverage today, but the *reliability* of caching and speculative decoding regressed across every runtime that implements them. For production agents, the practical risk is not model support — it's silent wrong answers on cached, speculative, or tool-driven paths.

---

## Per-Project Reports

<details>
<summary><strong>vLLM</strong> — <a href="https://github.com/vllm-project/vllm">vllm-project/vllm</a></summary>

# vLLM Digest — 2026-11-20

## 1. Today's Highlights

No releases landed in the last 24h, but issue and PR activity was heavy across three themes: **AMD/ROCm performance trackers** for next-gen models (Qwen3.8-Flash-Next on MI355X, Muse Spark on gfx942), **KV-cache correctness and orchestration** work (NixlConnector lease races, HiSparse reuse ordering, a new PeerL1Connector for cross-DP prefix sharing), and **RL/train-inference alignment** (direct weight reload, bounded retryable NCCL updates, per-rank speculative draft checks). A notable correctness cluster concerns **speculative decoding acceptance failures** on multiple backends (XPU FP16, DeepSeek-V4 DSpark, Qwen3.5/3.8 hybrid GDN prefix-cache hits).

## 2. Releases & Breaking Changes

No new releases in the last 24h. No API or config removals announced today.

Two migration/behavioral changes worth tracking:

- **Retiring native Llama/Qwen2 model implementations** — top-level Llama and Qwen2 checkpoints now route through the Transformers modeling backend; this tracker burns down the remaining native `llama.py`-derived models and Qwen2-attention Qwen3 classes. Expect import-path and model-registry churn for anyone subclassing native models. ([#67937](https://github.com/vllm-project/vllm/issues/67937))
- **Transformers v5 test coverage restore** — living tracker for re-enabling tests currently skipped/capped due to the v5 requirement. ([#38379](https://github.com/vllm-project/vllm/issues/38379))

## 3. New Model & Hardware Support

- **Nemotron VL/Omni on the Rust frontend** — image and video inputs for Nano 12B V2 VL, 3 Nano Omni, and 3.5 Super VL; bumps `llm-multimodal` to current main. ([PR #68808](https://github.com/vllm-project/vllm/pull/68808))
- **MXFP8 in FlashInfer CuteDSL batched experts for DeepEP low-latency** — enables W8A8 MXFP8 MoE checkpoints with `--all2all-backend deepep_low_latency` or `nixl_ep` on SM100/SM103. ([PR #66456](https://github.com/vllm-project/vllm/pull/66456))
- **Nemotron Deciffusion 8B (diffusion LM)** — tracking native vLLM support and bidirectional read decisions. ([#60283](https://github.com/vllm-project/vllm/issues/60283))
- **KV offload on non-CUDA (XPU)** — generic DRAM offload backend removes the `Torch not compiled with CUDA enabled` startup failure. ([PR #67816](https://github.com/vllm-project/vllm/pull/67816))
- **PeerL1Connector** — opt-in KV connector loading cached prefix KV from another DP rank's GPU (CUDA/HIP IPC intra-instance, MoRI-IO RDMA inter-instance), targeting DP+EP MoE. ([PR #68821](https://github.com/vllm-project/vllm/pull/68821))
- **AMD MonoKernel tracking** — per-model specialized decode PRs under `vllm/models/<model>/amd/`. ([#68544](https://github.com/vllm-project/vllm/issues/68544))

## 4. Performance & Optimization

- **Qwen3.8-Flash-Next on gfx950/MI355X** — optimization plan for `amd/Qwen3.8-Flash-Next-Quark-MXFP4` (GatedDeltaNet ×36 layers, QuerySparse Attention ×12, HyperConnection gated residual, MXFP4 MoE). Most active perf thread of the day. ([#59575](https://github.com/vllm-project/vllm/issues/59575))
- **Muse Spark Open 816B-A42B on gfx942** — PTPC-FP8 performance tracker with per-area uplift items. ([#64018](https://github.com/vllm-project/vllm/issues/64018))
- **GLM-5.3** — further CUDA-side optimizations over the GLM-5.2 `glm_moe_dsa` baseline. ([#57406](https://github.com/vllm-project/vllm/issues/57406))
- **PCIe IPC all-gather for latency-bound TP** — proposal to wire FlashInfer's `PcieIpcAllGatherWorkspace` into `CudaCommunicator.all_gather`; targets many small all-gathers (DeepSeek-V4.1-Flash Engram embeddings, compressor, drafter). ([#65359](https://github.com/vllm-project/vllm/issues/65359))
- **FlashInfer XQA ragged draft mask** — removes a blocking H2D copy plus two sync-inducing `repeat_interleave` calls from every ragged speculative-decode step. ([PR #68782](https://github.com/vllm-project/vllm/pull/68782))
- **Voxtral Realtime sessions** — keep sessions resident across audio chunks instead of re-queuing with full token history per chunk. ([PR #68539](https://github.com/vllm-project/vllm/pull/68539))
- **PP long-prefill chunking** — apply `long_prefill_token_threshold` even to a lone eligible request under pipeline parallelism. ([PR #68560](https://github.com/vllm-project/vllm/pull/68560))
- **Eager-mode sequence parallelism with collective+GEMM overlap** — RFC aligned with the move away from full-graph `torch.compile` fusion. ([#61626](https://github.com/vllm-project/vllm/issues/61626))
- **shm_broadcast spin tuning** — adaptive spin grace plus bounded arch waits (aarch64 WFET, x86 WAITPKG). ([#52916](https://github.com/vllm-project/vllm/issues/52916))

## 5. Stability & Regressions

Ranked by severity:

1. **NixlConnector KV lease released while remote READ in flight** — decode silently consumes overwritten KV; 1P1D, `--enforce-eager`, Qwen2.5-0.5B repro. Silent data corruption class. ([#61229](https://github.com/vllm-project/vllm/issues/61229))
2. **Zero-size-grid kernel on zero-token input** — `fused_add_rms_norm` launches a zero-sized grid on empty input. ([#67389](https://github.com/vllm-project/vllm/issues/67389)); **dynamic per-tensor FP8 amax includes stale token IDs from CUDA-graph padding** ([#67802](https://github.com/vllm-project/vllm/issues/67802)) — both quantization/attention correctness.
3. **0% speculative acceptance on XPU with `--dtype float16`** (bf16 works), Qwen3.8-27B + DFlash2 draft. ([#55250](https://github.com/vllm-project/vllm/issues/55250)); **DeepSeek-V4 DSpark draft missing `packed_modules_mapping`** → fused layers ignore `ignored_layers`, 0% acceptance, repro on V4.1-Flash — now **CLOSED**. ([#65618](https://github.com/vllm-project/vllm/issues/65618))
4. **Qwen3.5/3.8 hybrid GDN NaN logits after prefix-cache hit** — previous prefill ending 4–10 tokens past a block boundary, v0.28.0, mamba cache mode `align`. ([#55766](https://github.com/vllm-project/vllm/issues/55766))
5. **MTP draft allocates a second full vocab embedding** — OOMs a 27B INT4 target on a 24 GiB RTX 3090 that the baseline fits. ([#53887](https://github.com/vllm-project/vllm/issues/53887))
6. **Tool-call parser false positives** — Qwen3 parser turns quoted tool-call markup into real calls, including names outside `request.tools` and duplicates of offered tools. ([#58147](https://github.com/vllm-project/vllm/issues/58147))
7. **Frontend divergence on `tools` + `response_format` under `tool_choice="auto"`** — Python and Rust frontends give opposite behavior. ([#66858](https://github.com/vllm-project/vllm/issues/66858))
8. **Triton LoRA expand rejects row-padded outputs** (12-column GDN projection with stride 16) — fix PR up. ([PR #68822](https://github.com/vllm-project/vllm/pull/68822))
9. **MTP/quantization checkpoint mapper skipped** with `w4afp8` hand-rolled draft loaders — fix PR up. ([PR #68632](https://github.com/vllm-project/vllm/pull/68632), fixes [#68627](https://github.com/vllm-project/vllm/issues/68627))
10. **RL port conflict / ZMQ socket bug** in 2P4D DeepSeek-V3 configs, reproduced on clean nodes. ([#28498](https://github.com/vllm-project/vllm/issues/28498))

Fix PRs landed today: SM90 sparse MLA planner work-list overflow ([PR #58260](https://github.com/vllm-project/vllm/pull/58260)), encoder cache freed at schedule time ([PR #68799](https://github.com/vllm-project/vllm/pull/68799)), ROCm batched kpool decode cross-wave race ([PR #68749](https://github.com/vllm-project/vllm/pull/68749)), TPOT histogram no longer records 0 for sub-two-token requests ([PR #68548](https://github.com/vllm-project/vllm/pull/68548)).

## 6. What This Means for Application Developers

- **Speculative decoding is the highest-risk area right now.** Three independent 0%-acceptance or NaN reports span XPU FP16, DeepSeek-V4 drafts, and Qwen3.5/3.8 prefix-cache paths. If you enable spec decode, validate acceptance rates per model/backend/dtype combination rather than assuming it works.
- **Silent KV corruption under NIXL disagg is unresolved.** Until #61229 lands, avoid pulling KV over NIXL lease-based flow for latency-sensitive correctness-critical workloads.
- **Tool calling remains semantically fragile.** The Python/Rust frontend disagreement on `tools` + `response_format` (#66858) means your agent's behavior may differ depending on which frontend serves the request — pin the frontend and validate the combination.
- **Cross-DP prefix reuse is coming.** PeerL1Connector (#68821) and the KV-offload generic backend (#67816) will let you share prefixes across DP ranks and spill to DRAM without recompute — useful for session-heavy agent workloads, but both are opt-in and new.
- **Long-prefill PP behavior is changing** (#68560). If you rely on a single long prompt saturating the budget under pipeline parallelism, expect different scheduling after this lands.
- **Batch invariance has a reference recipe now** — the docs point to zero-mismatch-rl recipes for train/inference alignment in RL loops. ([PR #66550](https://github.com/vllm-project/vllm/pull/66550))

</details>

<details>
<summary><strong>SGLang</strong> — <a href="https://github.com/sgl-project/sglang">sgl-project/sglang</a></summary>

# SGLang Digest — 2026-11-20

## 1. Today's Highlights

Activity today is dominated by **SGLang 1.0 stabilization planning** and the **Prefill-Decode Disaggregation roadmap**, with the 1.0 tracker explicitly framing the release as "a stability release" that will replace silent configuration changes with named errors — a heads-up for anyone pinning versions. On the runtime side, several correctness bugs surfaced in the attention/quantization kernels (`extend_attention_fwd_unified` tree-mask misreads, `k_scale`/`v_scale` independence in `reshape_and_cache`) and in HiCache L3 prefetch under context parallelism, while a substantial kernel-tuning fix landed for Kimi-K3 multicast collectives. No releases were published in the last 24 hours.

## 2. Releases & Breaking Changes

No new releases in the last 24h. However, two tracking issues flag upcoming compatibility concerns:

- **[roadmap] SGLang 1.0 Release Tracker** (#50045) — Explicitly a stability release: silent configuration changes become errors that name the offending setting, and a 1.x compatibility policy is being defined. Upgrading from 0.5.x "may require changes." → [Issue #50045](https://github.com/sgl-project/sglang/issues/50045)
- **[Tracking] Unified Memory Roadmap** (#49944) — Eliminates fixed KV/state partitions in favor of a single shared GPU memory arena with dynamic capacity adaptation; expect allocation-config semantics to shift. → [Issue #49944](https://github.com/sgl-project/sglang/issues/49944)

## 3. New Model & Hardware Support

- **Ovis-Image 7B native text-to-image** support (Diffusers format, `sglang generate` + OpenAI-compatible image API) — PR #43152. Supports `ATH-MaaS/Ovis-Image-7B`, legacy `AIDC-AI/Ovis-Image-7B`, and local checkpoints. → [PR #43152](https://github.com/sgl-project/sglang/pull/43152)
- **MindIE-SD as optional Ascend acceleration library** for SGLang Diffusion (dense quantized + sparse attention) — RFC #48582 positions it alongside FlashInfer in the attention stack. → [Issue #48582](https://github.com/sgl-project/sglang/issues/48582)
- **FlashInfer cuTile NVFP4 MoE as default runner on SM12x** (RTX 50xx, RTX PRO Blackwell) — RFC #49123. → [Issue #49123](https://github.com/sgl-project/sglang/issues/49123)
- **Ascend NPU deployment docs for DeepSeek-V4.1** — PR #50985. → [PR #50985](https://github.com/sgl-project/sglang/pull/50985)
- **Kimi-K3 shared-expert sharding across attention-DP ranks** — PR #51434, reduces per-rank shared-expert residency from 22.64 GiB to 2.83 GiB on K3.1 (ADP8). → [PR #51434](https://github.com/sgl-project/sglang/pull/51434)

## 4. Performance & Optimization

- **Kimi-K3 multicast collectives for LayerNorm sequence-parallel prefill** — PR #51656 reports multicast kernels delivering **5–6% prefill speedup** vs. ~0.5% for NCCL collectives on TP8/DCP8 across two GB300 trays. → [PR #51656](https://github.com/sgl-project/sglang/pull/51656)
- **Kimi-K3 shared-expert TP across attention-DP ranks** — PR #51434, ~8x per-rank memory reduction (22.64 → 2.83 GiB). → [PR #51434](https://github.com/sgl-project/sglang/pull/51434)
- **GDN cross-round DFLASH ReplaySSM commits** (opt-in) — PR #50253 reduces full GDN state materializations by retaining accepted updates across verify rounds. → [PR #50253](https://github.com/sgl-project/sglang/pull/50253)
- **AMD DeepSeek-V4.1 low-ratio identity extend fill hoisting** — PR #48865 eliminates per-layer redundant sparse-index buffer clears on ROCm. → [PR #48865](https://github.com/sgl-project/sglang/pull/48865)
- **SchedulePolicy refactor** — PR #51667 splits `SchedulePolicy` into per-policy rankers + a `SchedulePlanner`, laying groundwork for tuning scheduling strategy independently. → [PR #51667](https://github.com/sgl-project/sglang/pull/51667)
- **In-progress perf concerns:** diffusion perf-check variance tied to runner host assignment (#48311) and a tuner issue where `[32,32]` block recipe search space is empty and candidates are timed with weights resident in L2 (#50057) — both can produce misleading or non-reproducible tuning results.

## 5. Stability & Regressions

Ranked by severity (see tracker #17050: 1 broken, 13 flaky, 958 recently fixed as of 2026-11-20):

1. **CUDA coredumps under agentic load on Blackwell (B200)** — #46203, Xid 13 "CTA Not Present" in HiCache kvcacheio transfer kernels; 7 crashes across 4 machines / 7 GPU instances. No fix PR noted. → [Issue #46203](https://github.com/sgl-project/sglang/issues/46203)
2. **HiCache L3 prefetch never completes under CP (attn_cp_size=8) with `fast_file`** — #51608, `storage_hit` stays 0 while writes accumulate; requests admitted only after the full retry cap. GLM-5.3 (MLA/DSA), w4afp8. → [Issue #51608](https://github.com/sgl-project/sglang/issues/51608)
3. **Arbitrary directory creation / file overwrite via `extra_sampling_params` in `POST /rollout/generate`** — #51555, a security-relevant bug in an exposed endpoint. → [Issue #51555](https://github.com/sgl-project/sglang/issues/51555)
4. **`extend_attention_fwd_unified` reads wrong tree-mask bits on sliding-window layers** — #51096, affects Triton backend with deterministic inference on all extend batches; **correctness bug**. → [Issue #51096](https://github.com/sgl-project/sglang/issues/51096)
5. **`--mamba-ssm-dtype bfloat16` regression** — #51531, ~8 points loss on long-reasoning MATH-500 with Qwen3.5-9B; float16 unaffected. GSM8K-style checks miss it — a reminder that short-benchmark CI coverage can hide long-context regressions. → [Issue #51531](https://github.com/sgl-project/sglang/issues/51531)
6. **`launch_reshape_and_cache_flash`: `k_scale`/`v_scale` not independent** — #51097, `USE_SCALE` keyed only on `k_scale`. → [Issue #51097](https://github.com/sgl-project/sglang/issues/51097)
7. **Chunked weight updates lose cross-tensor loader state, commit partial updates** — #51430, relevant for live weight-update / RL workloads. → [Issue #51430](https://github.com/sgl-project/sglang/issues/51430)
8. **Rust API stack follow-ups** — #51333 tracks weight-update safety and parity fixes for the 15-PR Rust API stack (#49734–#49748, now landed). → [Issue #51333](https://github.com/sgl-project/sglang/issues/51333)
9. **Memory-saver unmap race** — `release_memory_occupation` pauses regions before draining the device; fix PR #51679 open (supersedes closed #48289). → [PR #51679](https://github.com/sgl-project/sglang/pull/51679)
10. **Numerous `[inactive]` issues auto-closed today** (#50809, #39971, #40156, #40364, #40393, #40417) — worth scanning if you were tracking any of them for upstream fixes. Notably, #40156 (EAGLE spec-decode masking all draft topk to -1, corrupting MoE dispatch) and #40393 (`--quantization humming` crash on DeepSeek/GLM MLA) were closed inactive, not fixed.

## 6. What This Means for Application Developers

- **Pin your SGLang version deliberately.** The 1.0 push means previously tolerated misconfigurations will start failing fast. Review your launch flags and quantization settings against the upgrade notes in #50045 before adopting 1.x.
- **Long-context reasoning workloads need their own eval gate.** Issue #51531 shows a dtype flag costing ~8 MATH-500 points while short benchmarks look normal — validate any dtype/quantization change on your actual long-reasoning evals, not just smoke tests.
- **HiCache + context parallelism is not yet production-safe.** The L3 prefetch stall (#51608) and B200 coredump cluster (#46203) both hit high-value deployments (GLM-5.3, agentic loads). If you depend on HiCache L3 under CP, gate upgrades on these.
- **`/rollout/generate` is currently unsafe to expose externally** until #51555 is fixed — the endpoint allows arbitrary directory creation and file overwrite through sampling params.
- **Deterministic inference users should verify sliding-window correctness.** The tree-mask bug in #51096 affects the Triton extend path whenever deterministic inference is enabled; if you need bit-reproducible outputs, pin to a known-good version or track the fix.

*Generated from github.com/sgl-project/sglang, 2026-11-20. Total issues updated: 70; total PRs updated: 500.*

</details>

<details>
<summary><strong>llama.cpp</strong> — <a href="https://github.com/ggml-org/llama.cpp">ggml-org/llama.cpp</a></summary>

# llama.cpp Digest — 2026-11-20

## 1. Today's Highlights
An unusually busy 24 hours for backend coverage: OpenCL lands int8 DP4A support for decomposed flash-attention and folds GQA heads for f16 FA, while GGML adds BF16 support for ROPE and SET_ROWS across CPU and CUDA. On the stability side, a batch of long-running ROCm hangs, IMROPE cache reuse failures, and a new draft-dflash acceptance collapse keep pressure on the speculative-decoding and hybrid-model paths.

## 2. Releases & Breaking Changes
Ten builds landed (b12547–b12556). None declare API or config breaks, but two carry migration-relevant behavior changes:

- **b12553** [`mtmd` YuE2 projector fix](https://github.com/ggml-org/llama.cpp/releases) — `cls.output.weight` is now optional in `mmproj`. Previously `mtmd_init_from_file()` hard-failed with "tensor cls.output.weight is missing from the mmproj"; any pipeline that worked around this by shipping dummy tensors should drop that workaround.
- **PR #32115** [server: disallow reaching local addresses from CORS proxy and media URLs](https://github.com/ggml-org/llama.cpp/pull/32115) — closed. This is a security-motivated default change: media URLs and the CORS proxy can no longer reach private/local addresses unless explicitly opted in. A companion PR, **#32633** [`--ui-mcp-proxy-allow-private-urls`](https://github.com/ggml-org/llama.cpp/pull/32633), adds the escape hatch. **If you run llama-server on a workstation and fetch media from localhost or a LAN host, you will need to set this flag.**
- **b12550** [ggml: backend scheduler tests](https://github.com/ggml-org/llama.cpp/pull/27258) introduces a new experimental `GGML_OP_SLEEP` op (including a Vulkan implementation) purely for scheduler testing. Not a public API, but backends that must exhaustively switch on ops should account for it.

## 3. New Model & Hardware Support
- **OpenCL — int8 KQ for decomposed FA (#32577, b12555)**: DP4A (int8 dot-product-accumulate) support for KQ matmul in decomposed flash attention, targeting `DK = 512`, plus query-chunk sizes up to 96 for int8 KQ. From Qualcomm contributors — meaningful for Adreno-class and other DP4A-capable OpenCL devices. [PR #32577](https://github.com/ggml-org/llama.cpp/pull/32577)
- **BF16 in ROPE and SET_ROWS (#32387, b12554)**: CPU and CUDA. CUDA additionally supports SET_ROWS from BF16 into quantized types and F8_E4M3, and fused BF16 RoPE into a BF16 cache. [PR #32387](https://github.com/ggml-org/llama.cpp/pull/32387)
- **OpenCL — GQA head folding for f16 FA (#32631, open)**: folds multiple Q heads sharing a KV head into one KQ tile. [PR #32631](https://github.com/ggml-org/llama.cpp/pull/32631)
- **WebGPU — POOL_2D (#32250, b12547)** and **COL2IM_1D (#31708, open)** — the latter serves Qwen3-TTS and PocketTTS waveform decoders. [PR #32250](https://github.com/ggml-org/llama.cpp/pull/32250) · [PR #31708](https://github.com/ggml-org/llama.cpp/pull/31708)
- **Spark2.5 DSpark draft support (#31372, open)**: conversion + inference for Spark-X2.6 DSpark drafts, reusing the Spark2.5 runtime. [PR #31372](https://github.com/ggml-org/llama.cpp/pull/31372)
- **SYCL — OCP FP8 E4M3 initial support (#31871, open)**: partial support for SET_ROWS, CPY, ADD, MUL_MAT, MUL_MAT_ID. Explicitly not spec-compliant. [PR #31871](https://github.com/ggml-org/llama.cpp/pull/31871)
- **HIP via hipCUB (#26592, open)**: enables the CUB ARGSORT/TOP_K paths on HIP, replacing the shared-memory bitonic sort that is capped at 1024-element rows. [PR #26592](https://github.com/ggml-org/llama.cpp/pull/26592)
- **Model requests**: [SenseNova-Loop (#31571)](https://github.com/ggml-org/llama.cpp/issues/31571), [Apertus (#26300)](https://github.com/ggml-org/llama.cpp/issues/26300), and ternary-weight support with 1024-wide Hadamard rotation [#32160](https://github.com/ggml-org/llama.cpp/issues/32160).

## 4. Performance & Optimization
- **Vulkan, Strix Halo (gfx1151) scheduling (#32627, closed)**: selects 32-lane subgroups on AMD's proprietary driver for integer quantized matvec (MMVQ). [PR #32627](https://github.com/ggml-org/llama.cpp/pull/32627)
- **Vulkan Q2_K matvec integer-scale factoring (#32628, closed)**: sums the four packed integer dot products before applying their shared scale, and applies the minimum-value correction once. [PR #32628](https://github.com/ggml-org/llama.cpp/pull/32628)
- **CUDA duplicate expert IDs (#32505, closed)**: rewrote the mmid helper kernel using `__popc`/`__ballot`, reported faster than the prior `__shfl` version. Relevant to MoE inference. [PR #32505](https://github.com/ggml-org/llama.cpp/pull/32505)
- **CPU: bound OpenMP-free threadpool polling (#32378, open)**: reports ~50% CPU time reduction on the author's Linux box for builds without OpenMP. [PR #32378](https://github.com/ggml-org/llama.cpp/pull/32378)
- **RVV Mamba-2 SSM scan vectorization (#32448, open)**: the `__riscv_v_intrinsic` path previously left `np = 0` and fell through to scalar. [PR #32448](https://github.com/ggml-org/llama.cpp/pull/32448)
- **Runtime CPU affinity (#31981, open)**: caps automatic thread counts to the Linux x86 affinity mask — directly actionable for containerized deployments that pin CPUs. [PR #31981](https://github.com/ggml-org/llama.cpp/pull/31981)
- **Vulkan i915 20s submission timeout (#32516, open)**: work queued on i915 GPUs that does not complete within `CONFIG_DRM_I915_REQUEST_TIMEOUT` (20s) is cancelled by the driver, producing interrupted processing and **corrupted reads**, not just slowness. Workaround and analysis in the PR. [PR #32516](https://github.com/ggml-org/llama.cpp/pull/32516)

## 5. Stability & Regressions
Ranked by severity:

1. **IMROPE cache reuse disabled — full re-prefill on every follow-up (#32316, open)**. On Qwen3.5 with Metal/M1 Max, server-side prompt cache reuse appears broken for interleaved-MRoPE models, forcing a full re-prefill per turn. High practical impact for agent workloads. [Issue #32316](https://github.com/ggml-org/llama.cpp/issues/32316)
2. **draft-dflash acceptance collapse (#32526, closed)**. On the documented Qwen3-4B + Qwen3-4B-DFlash-b16 pair, acceptance fell to ~6% (expected ~85%), with greedy output divergence and ~5x slowdown, reproduced both post-refactor (#32016) and on a pre-refactor fork. Also see **#25489** (MTP perf regression since b9935, 14 comments, still open). [Issue #32526](https://github.com/ggml-org/llama.cpp/issues/32526) · [Issue #25489](https://github.com/ggml-org/llama.cpp/issues/25489)
3. **draft-dflash abort under parallelism (#31656, open)**: aborts in `post_decode seq_rm` on hybrid Qwen3.8-27B with `--parallel 8`. [Issue #31656](https://github.com/ggml-org/llama.cpp/issues/31656)
4. **Pascal (sm_60) silent long-context corruption on hybrid models (#32375, open)**: identical prompt is correct on CPU and Ampere, corrupt on sm_60 for MiMo-V2.6-Distill and Nemotron Bolt. "Silent" is the operative word — no error is raised. [Issue #32375](https://github.com/ggml-org/llama.cpp/issues/32375)
5. **HRM cache-slot uint32 overflow (#32601, closed, b12556)**: `n_hrm_layers_per_stack * n_hrm_h_cycles * (n_hrm_l_cycles + 1)` could wrap at 2^32 and still pass the `block_count` assert, permitting out-of-bounds writes on model load. Fixed. [PR #32601](https://github.com/ggml-org/llama.cpp/pull/32601)
6. **Vulkan GLM-OCR vision encoder garbage on Intel Arc A380 (#31836, open)**: full-page images fail on Vulkan but are correct on CPU and SYCL. [Issue #31836](https://github.com/ggml-org/llama.cpp/issues/31836)
7. **AMD APU UMA memory detection (#18159, closed)**: UMA detection was incorrectly limiting available memory on APUs with large TTM allocations. [Issue #18159](https://github.com/ggml-org/llama.cpp/issues/18159)
8. **RPC cross-platform crash (#32263, open)**: "peer closed" / "send failed" between Windows/AMD-Vulkan and macOS/Metal workers. [Issue #32263](https://github.com/ggml-org/llama.cpp/issues/32263)
9. **Control vectors vs. LoRA semantics (#32341, open)**: steering is written into and re-read from the KV cache, making control vectors behave fundamentally differently from LoRAs across multi-turn chats. Worth understanding before shipping either. [Issue #32341](https://github.com/ggml-org/llama.cpp/issues/32341)
10. **ROCm large-model loading hangs (#19482, open, 16 comments, 6 👍)** — the longest-running thread in today's set, and still unresolved. [Issue #19482](https://github.com/ggml-org/llama.cpp/issues/19482)

## 6. What This Means for Application Developers
- **Two silent-corruption classes deserve your attention.** The Vulkan i915 20s timeout (#32516) and the Pascal sm_60 hybrid long-context corruption (#32375) both produce wrong results rather than errors. If you serve on i915 or Turing, validate output quality at long context before trusting either path.
- **Server-side prompt caching is not uniform across model families.** The IMROPE/Qwen3.5 issue (#32316) means your per-turn latency and prefill cost on agent loops can be dramatically worse than benchmarks on other architectures suggest. Measure cache hit behavior per model, not per deployment.
- **Speculative decoding is the least stable surface right now.** dflash, MTP, and draft-dflash all have open or recently-closed regressions (#32526, #25489, #31656). If you depend on these for latency, pin a known-good build and track acceptance rate as a production SLI — a collapse to ~6% is a 5x latency event.
- **If you self-host llama-server on a local machine, check your media and MCP URLs.** The new default in #32115 blocks private-address fetches from the CORS proxy and media URL paths; #32633 adds the opt-in flag. This is a behavior change, not a bug.
- **The b12556 HRM overflow is an OOB write on model load.** If you load untrusted or third-party HRM GGUFs, update past b12556 before doing so.
- **OpenCL and SYCL are quietly becoming viable non-NVIDIA targets.** DP4A int8 KQ in FA and GQA folding land good headroom on Adreno-class hardware; SYCL gains initial FP8 E4M3. Worth re-benchmarking if you dismissed these backends earlier this year.

*Note: the source data reflects repository activity as of 2026-11-20; build numbers and issue states are current as of that date.*

</details>

<details>
<summary><strong>Ollama</strong> — <a href="https://github.com/ollama/ollama">ollama/ollama</a></summary>

# Ollama Digest — 2026-11-20

## 1. Today's Highlights

No new releases in the last 24 hours, but issue and PR traffic is heavy and points at two systemic themes: **prompt/KV cache reuse is not behaving as advertised** across single-slot, multi-slot, Vulkan, and cloud paths (Issues #19767, #19773, #19774), and **MLX/Metal runner work is landing rapidly** (PRs #19785, #19745, #19783) to make parallelism, conversation persistence, and new architectures memory-aware. On the correctness side, several silent-failure bugs (undetected token truncation #19765, empty assistant messages with valid tool calls #19780, qwen2.5-coder advertising `tools` while never emitting native `tool_calls` #19779) were closed or filed — a recurring hazard for agent developers.

## 2. Releases & Breaking Changes

None. No new versions were published in the last 24 hours.

Notable API-surface proposals still open (not yet breaking):
- **`api: bound thinking with a token budget, per request or per model`** — separates the thinking *level* from a thinking *budget* setting. [PR #17566](https://github.com/ollama/ollama/pull/17566)
- **`ollama search` CLI command** to query the model library without leaving the terminal. [Issue #19775](https://github.com/ollama/ollama/issues/19775)
- **Streamed native audio answers** via `/api/chat` and `ollama run --audio` / `--speak` / `--tts` for LFM3-Omni. [Issue #19396](https://github.com/ollama/ollama/issues/19396)

## 3. New Model & Hardware Support

- **Tencent Hy4 Flash (text + vision) on MLX**, with NVFP4 import, file-backed Engram, compact MLA, and IndexPool — plus adaptive DFly2 drafting. [PR #19783](https://github.com/ollama/ollama/pull/19783)
- **OVHcloud Olala-v1.0-mini-7A1B-GGUF** support requested; currently fails to load. [Issue #19777](https://github.com/ollama/ollama/issues/19777)
- **MLX runner parallelism tuning**: when `OLLAMA_NUM_PARALLEL` is unset, slot count is selected from available memory and per-client storage at the model's context limit (1/2/4/8), with serial fallback under memory pressure, unknown cache layouts, or non-Metal backends. [PR #19785](https://github.com/ollama/ollama/pull/19785)

## 4. Performance & Optimization

- **MLX conversation cache persistence**: completed conversation checkpoints are saved asynchronously and restored after memory reclamation, model switching, or runner restart; only fully saved inactive state is reclaimed, with bounded staging and shutdown draining. [PR #19745](https://github.com/ollama/ollama/pull/19745) / [#19678](https://github.com/ollama/ollama/pull/19678)
- **MLX history adaptation to memory pressure**: the fixed 8 GiB saved-history allowance is replaced by dynamic retention, so slots stop discarding reusable conversations while memory is free. [PR #19678](https://github.com/ollama/ollama/pull/19678)
- **Per-layer KV cache sizing** for VRAM prediction: current code sizes every layer using the smallest `head_count_kv`, fixed head size, full context, f16 — leading to bad estimates and unnecessary evictions for models with heterogeneous layers. [PR #19327](https://github.com/ollama/ollama/pull/19327)
- **Context-shift correctness**: `build_rope_shift` was passing RoPE amplitude (including YaRN factor) through unchanged, so every shift re-scaled already-roped KV keys. Amplitude-neutral fix proposed. [PR #19680](https://github.com/ollama/ollama/pull/19680)
- **Scheduler**: a runner that fails to be killed is no longer removed from the loaded set, preventing the scheduler from believing VRAM is free (which previously caused tilt-to-CPU and duplicate `llama-server` instances). [PR #19581](https://github.com/ollama/ollama/pull/19581)

## 5. Stability & Regressions

Ranked by severity for production consumers:

1. **Silent prompt truncation at 65,536 tokens** — long documents report an identical ~65,538 tokens read regardless of input size, with `done_reason=stop` (not `length`), so truncation is undetectable. Closed. [Issue #19765](https://github.com/ollama/ollama/issues/19765)
2. **Empty assistant message with a valid tool call** — `finish_reason: "stop"`, empty `content`, no `tool_calls`, but non-zero `completion_tokens` on some qwen2.5 tool schemas. Closed. [Issue #19780](https://github.com/ollama/ollama/issues/19780)
3. **Prompt cache invalidated on last-message change** — Vulkan/qwen3:8b, single slot, cache log shows `cached n_tokens = 4` out of ~2,040 identical tokens, re-processing the entire prompt each turn. Closed. [Issue #19774](https://github.com/ollama/ollama/issues/19774)
4. **Two agent sessions re-read prompts from token 0 on the default single slot**; parallel slots lose part of the prompt cache (Qwen3.8-27B, L4, `OLLAMA_CONTEXT_LENGTH=32768`). Open. [Issue #19767](https://github.com/ollama/ollama/issues/19767)
5. **Windows `/api/embed` returns 400** — the runner's internal `POST /tokenize` to a loopback high port is actively refused (connectex) on Ollama 0.40.16 with `embeddinggemma`. Open. [Issue #19782](https://github.com/ollama/ollama/issues/19782)
6. **Ollama Cloud: near-zero prompt-cache hits on first requests of resumed sessions** — first two requests in a DeepSeek Harness run had almost no cached input; later similar-size requests hit cache and cost much less. Open. [Issue #19773](https://github.com/ollama/ollama/issues/19773)
7. **Cloud `mimo-v2.6-pro:cloud` tool-call flooding** — hundreds of near-identical tool calls per assistant turn in agentic sessions (flagged as upstream defect). Open. [Issue #19672](https://github.com/ollama/ollama/issues/19672)
8. **Duplicate GGUF keys accepted silently**, with the two internal readers disagreeing (first-wins in `fs/gguf/gguf.go` vs. last-wins in `fs/gguf/metadata.go`). Open. [Issue #19768](https://github.com/ollama/ollama/issues/19768)
9. **HIGH-severity CVEs reported in the Ollama Go binary.** Open. [Issue #19771](https://github.com/ollama/ollama/issues/19771)
10. **Windows sleep not prevented during long generations** when Ollama is serving on LAN. Open. [Issue #4072](https://github.com/ollama/ollama/issues/4072)

Fix PRs in flight:
- **Qwen tool calls left unclosed at end of stream** — `Qwen3CoderParser` only emits on `</tool_call>`; small models stop after `</function>` and the buffered call is flushed as content. [PR #19776](https://github.com/ollama/ollama/pull/19776)
- **Length stops during incomplete tool arguments** — runner returns a JSON decoding error before delivering the final response (e.g. a weather call ending at `{"city":`). [PR #19772](https://github.com/ollama/ollama/pull/19772)
- **qwen2.5-coder advertises `tools` but its chat template never emits native `tool_calls`.** Closed on the issue tracker; verify per-model capability rather than trusting `/api/show`. [Issue #19779](https://github.com/ollama/ollama/issues/19779)

## 6. What This Means for Application Developers

- **Never trust `done_reason: "stop"` as proof of a complete read.** Issue #19765 showed a hard 65,536-token ceiling with no length signal. Bound your prompts, assert on reported token counts, and treat any long input as potentially truncated until you validate it end-to-end.
- **Tool-call parsing is the weak link for agents.** Three separate reports this cycle (#19780, #19776, #19779) describe tool calls that are generated but lost, unclosed, or never native. If you rely on structured tool output from small/mid Qwen models, parse defensively and inspect `finish_reason` and `usage.completion_tokens` before assuming a non-tool turn.
- **Budget for prompt-cache misses.** #19767, #19773, and #19774 all indicate re-processing of entire prompts under realistic multi-session and multi-turn workloads. Keep system prompts and long context prefixes stable, prefer explicit multi-slot configuration, and measure TTFT/cost rather than assuming caching wins.
- **Multi-slot and hybrid-layer models need explicit sizing.** PR #19327 and #19785 both target the gap between predicted VRAM and actual allocation; if you run concurrent requests on non-density-matched models, pin `OLLAMA_NUM_PARALLEL` and context length rather than relying on autotuning.
- **MLX/Metal users should expect better persistence shortly.** #19745 and #19678 together let single-slot workloads keep inactive conversation state across model switches and restarts — worth benchmarking once merged if you serve repeated sessions on Apple Silicon.
- **Patch hygiene:** #19771 reports HIGH CVEs in the Go binary. No release was cut today; track the next version for the fix and plan an upgrade window.

</details>

<details>
<summary><strong>LiteLLM</strong> — <a href="https://github.com/BerriAI/litellm">BerriAI/litellm</a></summary>

# LiteLLM Digest — 2026-11-20

## Today's Highlights
Release cadence stays hot, with `v1.112.0-dev.1` on main and an `v1.111.0-rc.2` RC alongside fresh LTS patch `v1.108.12`, while several long-standing routing and streaming correctness bugs moved to closed. The most consequential open threads are a **read-replica deadlock under `DATABASE_URL_READ_REPLICA`** (now closed) and a **Responses API streaming path that drops the connection instead of surfacing upstream 400s** on Bedrock. Guardrails and budget enforcement got new opt-in capabilities via PRs, and MCP tool discovery regressed in 1.108.x for `auth_type: authorization` servers.

## Releases & Breaking Changes
- **v1.112.0-dev.1** (dev, `main`) — standard cosign-verified image; no changelog notes in this feed. [Release](https://github.com/BerriAI/litellm/releases)
- **v1.111.0-rc.2** — release candidate, verify via cosign before deploying. [Release](https://github.com/BerriAI/litellm/releases)
- **v1.110.1** and **v1.109.2** — patch releases on mainline.
- **v1.108.12 (LTS)** — `ghcr.io/berriai/litellm:lts` always points to latest LTS patch; use for production pinning.
- **v1.106.11** — older patch, still published.
- No explicit breaking API changes announced today. Note audit-log schema broke at **v1.108.0** (see Stability): `GET /audit` returns 500 after `/key/update` or `/team/update` because `before_value` is written as a JSON string instead of an object. [#50905](https://github.com/BerriAI/litellm/issues/50905) (closed).

## New Model & Hardware Support
- **SGLang provider** — long-requested local inference backend (vLLM/Ollama sibling) is marked closed; check current release for availability. [#13681](https://github.com/BerriAI/litellm/issues/13681)
- **Qdrant vector store** support request closed. [#11365](https://github.com/BerriAI/litellm/issues/11365)
- **Smarty Pants** added as a JSON-configured OpenAI-compatible provider (Apple Silicon-hosted pinned open-model builds). [#53005](https://github.com/BerriAI/litellm/pull/53005)
- **Gemini 3.8 Flash** is now the e2e alias after `gemini-2.5-flash` retirement for new AI Studio keys. [#52823](https://github.com/BerriAI/litellm/pull/52823)
- **GPT-5.5+ stop sequences** exposed for OpenAI/Azure. [#28655](https://github.com/BerriAI/litellm/pull/28655)
- **Vertex AI Live** websocket passthrough now enforces per-key model access (closes socket 1008 on unauthorized model). [#47716](https://github.com/BerriAI/litellm/pull/47716)

## Performance & Optimization
- **Docker build speedup**: PR makes `build_docker_database_image` depend on the `ui_build` job and reuse pre-built UI artifacts, skipping `build_admin_ui.sh` when `index.html` exists. Faster CI and smaller build wall-clock. [#29092](https://github.com/BerriAI/litellm/pull/29092)
- **Registry-load locks fixed**: process-global `asyncio.Lock()` in `auth_checks.py` (introduced v1.101.0+ via #36801 and #44047) had **no timeout**, unlike the per-request reads they replaced — a potential stall source under contention. Resolved. [#44047](https://github.com/BerriAI/litellm/issues/44047)
- **Streaming usage metadata**: `stream_chunk_builder` now takes base-response metadata from the earliest chunk (sorted by `_hidden_params.created_at`) rather than insertion order, fixing upstream field misattribution on reassembly. [#31277](https://github.com/BerriAI/litellm/pull/31277)
- No published throughput/latency numbers in this dataset.

## Stability & Regressions
Ranked by severity:

1. **Read-replica never self-heals** (CLOSED) — with `DATABASE_URL_READ_REPLICA` set, a reconnect cancelled by its 2s timeout leaves the reader Prisma engine dead forever; reads (key auth, `/health/readiness`, budget jobs) never fall back to the writer and fail with `httpx.ConnectError`. Critical for HA setups. [#52284](https://github.com/BerriAI/litellm/issues/52284)
2. **Responses API drops connection on upstream 400** (CLOSED) — streaming `/v1/responses` with rejected input returns 200, emits `response.created`, then drops mid-body (`GenericEvent has no attribute 'type'`) instead of erroring. Bedrock mantle / `gpt-6.1-sol`. [#52853](https://github.com/BerriAI/litellm/issues/52853)
3. **Priority routing ignores TPM/RPM limits** (OPEN) — under `usage-based-routing-v2`, deployment `tpm`/`rpm` honored only for `order`-sorted groups, **not** when reached via priority routing groups; leads to early failover. [#52548](https://github.com/BerriAI/litellm/issues/52548)
4. **Budget overshoot** (OPEN) — a key with `max_budget` $0.0045 admitted 11 calls at $0.0004512 each ($0.0049632 billed, **+10.3%**); burst and serial produced the same count, so it's not just check-before-cost racing. [#50125](https://github.com/BerriAI/litellm/issues/50125)
5. **Audit logs 500** (CLOSED) — `before_value` stored as JSON string since v1.108.0 breaks `GET /audit` and the UI. See Releases section. [#50905](https://github.com/BerriAI/litellm/issues/50905)
6. **MCP tool discovery regression** (OPEN) — 1.105.7 → 1.108.11: `GET /mcp-rest/tools/list` returns 200 but omits tools from servers with `auth_type: authorization` when no upstream credential is supplied. [#52849](https://github.com/BerriAI/litellm/issues/52849)
7. **OAuth2 client_credentials MCP broken** (OPEN) — token endpoint always 400; `client_id`/`client_secret` never reach runtime regardless of config. [#37222](https://github.com/BerriAI/litellm/issues/37222)
8. **Provider field loss on streams** (OPEN) — GreenPT `impact` object dropped on streaming usage chunk (with or without `stream_options.include_usage`); cached_tokens intermittently dropped from final streaming usage in v1.93.0. [#46613](https://github.com/BerriAI/litellm/issues/46613), [#36882](https://github.com/BerriAI/litellm/issues/36882)
9. **Finish reason masking** (OPEN) — `error`, `network_error`, vLLM `abort`, Gemini `MALFORMED_FUNCTION_CALL` all reported as `finish_reason: "stop"`, so callers see success and router retries never fire. [#48721](https://github.com/BerriAI/litellm/issues/48721)
10. **Vertex schema crash** (CLOSED) — tuple-form `items` in tool JSON Schema raised `'list' object has no attribute 'get'`. [#36848](https://github.com/BerriAI/litellm/issues/36848)
11. **Router silent load-balancing** (CLOSED) — raw model string collision on `litellm_params.model` fanned out across unrelated `model_name` groups. [#38216](https://github.com/BerriAI/litellm/issues/38216)
12. **UI slowdown in 1.82.x** (OPEN, stale) — flagged as stale despite 11 comments and 2 👍. [#23005](https://github.com/BerriAI/litellm/issues/23005)

## What This Means for Application Developers
- **Pin to LTS** (`ghcr.io/berriai/litellm:lts`, currently 1.108.12) if you depend on stable audit logs and MCP discovery — both have open regressions in 1.108.x, and audit-log 500s affect enterprise audit UI.
- **Don't trust `finish_reason: "stop"` alone.** If you rely on router retries for provider failures, they may never trigger. Treat truncated/empty content plus `stop` as a suspect signal and consider client-side retries.
- **Budget caps are soft.** If you gate on `max_budget` for hard spend limits, provision headroom (~10% observed overshoot) or enforce client-side.
- **Read-replica users**: upgrade past the fixed build; the deadlock is unrecoverable without a restart and silently degrades auth/health.
- **Streaming fidelity is improving but incomplete.** If you need provider-specific metadata (cached tokens, impact/emissions objects) in streaming mode, validate per provider — several paths still drop these.
- **Guardrails got broader coverage** with opt-in Bedrock scanning of tool-call arguments and descriptions on chat/messages/responses; enable only after evaluating latency impact on tool-heavy agents. [#52999](https://github.com/BerriAI/litellm/pull/52999)
- **Custom budget windows** (beyond monthly/yearly) land via PR; useful for per-sprint or per-experiment agent cost controls. [#52976](https://github.com/BerriAI/litellm/pull/52976)
- **Auth v2 module in flight** — a standards-based auth/identity layer is under review; watch for migration guidance before adopting. [#30171](https://github.com/BerriAI/litellm/pull/30171)

</details>

<details>
<summary><strong>Unsloth</strong> — <a href="https://github.com/unslothai/unsloth">unslothai/unsloth</a></summary>

# Unsloth Digest — 2026-11-20

## 1. Today's Highlights

Unsloth shipped **v0.1.920-beta**, headlined by a major AMD NPU update (Q4NX models now load on the NPU with per-model runnability reporting) plus new LoRA training targets for video/image diffusion (LTX-2.5, MOSS-Image) and NVIDIA Cosmos3 FP8 video. The PR queue is dominated by **Studio hardening**: a new network firewall for web/Python/Terminal tools (PR #18548), MCP tool-list stability fixes for the repeated-prompt-processing regression (PR #18529, fixes #17015), and a batch of correctness fixes around document ingestion. Multiple platform-specific stability issues landed today across Windows Smart App Control, Linux ROCm, and Rocm-on-Windows paths.

## 2. Releases & Breaking Changes

- **[v0.1.920-beta](https://github.com/unslothai/unsloth)** — AMD NPU + video diffusion LoRA. Includes: Q4NX→NPU conversion with runnability indicators, LTX-2.5 and MOSS-Image LoRA training, NVIDIA Cosmos3 FP8 video, scheduled tasks with chat replies.
- **[PR #18504](https://github.com/unslothai/unsloth/pull/18504) (CLOSED, fixes #18492)** — Engine installs (vLLM/SGLang) now resolve per-user `uv` installs (`~/.local/bin`) that non-interactive launches previously missed. This changes error semantics: a retried failure is now distinguishable from a first-time failure. **Migration note:** users whose engines silently failed to install due to missing `uv` on `PATH` will now succeed; those relying on the old retry loop may see changed messaging.
- No API/config file format breaks noted today.

## 3. New Model & Hardware Support

- **AMD NPU (XDNA 2+)** — Q4NX model conversion now loads on NPU; runnability surfaced per model in the UI. Tracked in [release v0.1.920-beta](https://github.com/unslothai/unsloth).
- **Older AMD XDNA NPUs (Ryzen AI 100/200, XDNA 1)** — [Issue #18501](https://github.com/unslothai/unsloth/issues/18501) requests coverage; currently unsupported.
- **SenseNova-Loop-9B** (`sensenova_loop`, released 2026-11-17) — [Issue #18497](https://github.com/unslothai/unsloth/issues/18497) requests support for this looped-hybrid architecture; 8 GB card targeting. Not yet supported.
- **DaisyRose-27B** — [Issue #18465](https://github.com/unslothai/unsloth/issues/18465) requests support as a stronger long-agentic-coding alternative to Qwen3.8-27B.
- **Colibri streaming engine** — [Issue #17928](https://github.com/unslothai/unsloth/issues/17928) requests as an additional backend for huge models on normal PCs.
- **LTX-2.5 / MOSS-Image LoRA** and **Cosmos3 FP8 video** — new in v0.1.920-beta.

## 4. Performance & Optimization

- **[PR #18432](https://github.com/unslothai/unsloth/pull/18432) (CLOSED)** — Cosmos3 FP8: fused single-pass W8A8 activation quantization. **Edge FP8 improved from 1.65 → 1.14 s/step on L4** (ModelOpt `_quantize_static` previously used four eager kernels over a float32 copy).
- **[PR #18441](https://github.com/unslothai/unsloth/pull/18441) (CLOSED)** — Studio int8: raced CUTLASS GEMM now runs on T4 (sm_75) native W8A8 linears. **FLUX.3 klein −13% per step, byte-identical output.**
- **[PR #18533](https://github.com/unslothai/unsloth/pull/18533) (OPEN)** — Diffusion: real-step CUDA graph warm-ups by default for resident denoisers, eliminating throwaway warm-up forwards on first render per load.
- **[PR #17159](https://github.com/unslothai/unsloth/pull/17159) (CLOSED)** — Linux ROCm FLUX.3 upsampler now counts Vulkan VRAM before keeping the server resident, fixing cascading OOM after captions.
- **[Issue #17728](https://github.com/unslothai/unsloth/issues/17728) (CLOSED)** — Qwen3.8 27B regression after llama.cpp CUDA upgrade: **60 t/s → 38 t/s** on Qwen3.8 27B. Related to [#17733](https://github.com/unslothai/unsloth/issues/17733) (MTP broken after llama.cpp b12340-mix-6186f42). Both closed.

## 5. Stability & Regressions (ranked by severity)

1. **[Issue #17015](https://github.com/unslothai/unsloth/issues/17015) (OPEN, 8 comments)** — **High.** Studio repeats full prompt processing across turns with Qwen hybrid models after tool use (large MCP catalog, 64k context). Fix in flight via [PR #18529](https://github.com/unslothai/unsloth/pull/18529) (fixes the tool-list churn; related to #17326).
2. **[Issue #18481](https://github.com/unslothai/unsloth/issues/18481) (OPEN)** — **High.** Intermittent MiniMax-M3.1 tool-call parsing failure exposes raw protocol tokens and **stops agent execution** mid-run. No fix PR referenced yet.
3. **[Issue #18005](https://github.com/unslothai/unsloth/issues/18005) (CLOSED)** — Windows ROCm GPU monitor always reports `gpu_utilization_pct=0.0` and `temperature_c=null` (3D-only counter, no sensor source) on Ryzen AI Max+ 395 / Radeon 8060S.
4. **[Issue #12248](https://github.com/unslothai/unsloth/issues/12248) (OPEN)** — Mixed NVIDIA+AMD hosts: Studio ignores the AMD card; single PyTorch build per venv means both cannot coexist. Reproduced on 3080+R9700 and 4090+R9700.
5. **[Issue #18001](https://github.com/unslothai/unsloth/issues/18001) (OPEN)** — Incorrect unified-memory loading on Ryzen 8700G / Radeon 780M.
6. **[PR #18550](https://github.com/unslothai/unsloth/pull/18550) (OPEN)** — Windows AMD ROCm + Smart App Control blocks `rocm-sdk.exe`, causing repair loop (`studio_install_incomplete`); install manifest now preserved.
7. **[PR #18549](https://github.com/unslothai/unsloth/pull/18549) (OPEN)** — Windows Smart App Control blocks unsigned `lemond.exe` (`WinError 4551`); NPU silently vanishes from picker, `/api/npu/models` returns 500. Now surfaces the block explicitly.
8. **[PR #18514](https://github.com/unslothai/unsloth/pull/18514) (OPEN)** — Mac training Stop before first step ends with "Failed to save a resumable checkpoint after stop" and saves a **40 MB zero-weight adapter** offered as resumable history.
9. **[PR #18551](https://github.com/unslothai/unsloth/pull/18551) (OPEN)** — Security audit failing on `main`: 6 HIGH / 175 MEDIUM findings; baseline needs re-pinning for six reviewed `unsloth-zoo 2026.11.7` sites.
10. **[PR #18538](https://github.com/unslothai/unsloth/pull/18538) / [#18547](https://github.com/unslothai/unsloth/pull/18547) (OPEN)** — Dataset ingestion correctness: JSON/JSONL dates coerced to timestamps (model learned to emit `" 00:00:00"`); xlsx empty format sections (`0;-0;;@`) leaked hidden numbers. Both fixed in PRs.

## 6. What This Means for Application Developers

- **Agent/MCP builders:** Issue #17015 is a real cost regression — repeated full prompt processing on Qwen hybrid models after tool calls, especially with large MCP catalogs. If you run agent loops on Unsloth Studio + Qwen, pin to a build before the regression or track PR #18529. Separately, #18481 shows MiniMax-M3.1 tool parsing can leak raw protocol tokens and **halt your agent** — add a parser-failure guard and a retry boundary in your client.
- **Tool sandboxing:** PR #18548 adds an installation-wide network firewall (allow/block lists, three modes) for web, Python, and Terminal tools — directly relevant if you're running model-authored code. Evaluate the `Settings > Security > Network` modes before enabling unrestricted code tools.
- **vLLM / SGLang users:** If your engine installs were silently failing due to a per-user `uv`, #18504 fixes this and now properly distinguishes retried failures. Check your install logs after upgrading.
- **Windows AMD / ROCm users:** Smart App Control is actively breaking NPU and ROCm installs (#18549, #18550). If you see a 500 on `/api/npu/models` or a repair loop, that's the cause — not your hardware.
- **Fine-tuning on Macs:** Do not trust resumable checkpoints from runs stopped before step 1; #18514 was saving zero-weight adapters. Wait for the fix or discard those checkpoints.
- **Data quality:** If you train on JSON/JSONL datasets with dates, upgrade before training — pre-fix versions silently corrupted date columns to timestamps and taught models to append `" 00:00:00"`.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*