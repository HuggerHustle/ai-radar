# AI Infrastructure Digest 2026-11-08

> Generated: 2026-11-08 00:24 UTC | Projects covered: 6

- [vLLM](https://github.com/vllm-project/vllm)
- [SGLang](https://github.com/sgl-project/sglang)
- [llama.cpp](https://github.com/ggml-org/llama.cpp)
- [Ollama](https://github.com/ollama/ollama)
- [LiteLLM](https://github.com/BerriAI/litellm)
- [Unsloth](https://github.com/unslothai/unsloth)

---

## Cross-Project Comparison

# Cross-Project AI Infrastructure Report — 2026-11-08

---

## 1. Ecosystem Overview

The AI infrastructure stack is in a **hardware-transition trough**: Blackwell (SM120) is shipping in consumer/prosumer form (RTX 50-series, RTX PRO 6000, DGX Spark) but remains the **least reliable execution path** across every serving engine — vLLM reports decode collapse on DeepSeek-V4.1-Flash, SGLang reports 2–6× throughput deficits vs. vLLM on identical SM120 hardware, and Unsloth documents diffusion aborts on mixed-GPU setups. Meanwhile, the **kernel layer is being rewritten** (vLLM's Marlin→Humming migration, SGLang's persistent MXFP4 decode kernels, llama.cpp's CUDA fused KV dequant), and the **model mix has shifted to Flash-class agentic models** (DeepSeek-V4.1-Flash, MiniMax-M3.1-Flash, Kimi-K3.1, GLM-5.3-Flash) that stress speculative decode and MoE routing paths. Frontend reliability — tool calling, reasoning replay, streaming parsers — has become the **dominant source of production incidents** across engines and gateways alike.

---

## 2. Activity Comparison

| Project | Issues (active/notable) | PRs (active/notable) | Release Status (24h) | Release Cadence Signal |
|---|---|---|---|---|
| **vLLM** | ~14 active + 5 noted (~19 total) | ~9 open | None | Continuous; in-flight RFCs (#25700 env-var reduction, #45978 override semantics) |
| **SGLang** | ~12 (7 closed, 5 open) | ~9 open | None | Patch-level; FlashInfer 0.7.3 compat fix pending (#49096) |
| **llama.cpp** | ~10 (1 critical, 4 high) | ~10 open | **b12184–b12194** (11 builds) | Fastest cadence — multiple builds/day |
| **Ollama** | ~8 (6 open) | ~10 open | None | PR-heavy; MLX runner maturing |
| **LiteLLM** | **~25+** (largest issue volume by far) | ~7 open | **v1.110.0-dev.1 + v1.108.3 LTS** | Fast; cosign-signed images new |
| **Unsloth** | ~16 (mixed severity) | ~12 open | None | Feature-stacked; CUDA-graph default in progress |

**Reading the table:** LiteLLM carries the highest issue volume because it sits in front of *every* provider and absorbs every translation defect. llama.cpp has the highest release velocity (build-numbered iterations). vLLM and SGLang are in **kernel-migration mode** — low release count, high structural change. Unsloth and Ollama are **feature-expansion phase** (context parallelism, MLX concurrency) with stability debt accumulating behind them.

---

## 3. Model Support Race

| Model / Architecture | vLLM | SGLang | llama.cpp | Ollama | Unsloth |
|---|---|---|---|---|---|
| **DeepSeek-V4.1-Flash** | ✅ Native decode on Ampere (PR #66275); ❌ SM120 decode broken | ⚠️ Persistent MXFP4 decode generalized (PR #49091); ❌ SM120 slow | — | ❌ Parser whitespace bug (#19590) | ✅ CP for MLA/V3.2/V4 sink attn (PR #15882) |
| **MiniMax-M3.1-Flash** | ✅ GB300 decode (PR #66324); ✅ ROCm MXFP8 prefill (PR #66330) | ✅ MI350X/MI355X (PR #46693) | — | — | ✅ CP for M1/M2 Ulysses (PR #15881) |
| **Kimi-K3.1** | ✅ PD disaggregation + DCP (PR #48741) | ✅ AMD AITER MoE sort (PR #43126) | — | — | ✅ CP (prior PRs) |
| **GLM-5.3-Flash** | ⚠️ ROCm KDA o_norm fix (PR #66219) | ⚠️ DSA HiCache corruption fixed (#38031, closed) | ⚠️ CUDA IMA on long prefill, sm_120 (#28282) | — | ✅ FastModel CUDA graphs |
| **Gemma 4** | — | — | — | ✅ QAT support (with `toos` typo bug) | ✅ CP Ulysses (PR #15883) |
| **Nemotron 3.5 ASR** | ⚠️ Requested (#47455) | — | — | ✅ Dense MLX + Luciole tok (PR #19567) | — |
| **Ripple (preview)** | — | — | — | ✅ MLX runner (PR #19592) | — |
| **MageVL-Cowork** | — | — | ✅ mtmd (b12192) | — | — |
| **LFM3-Audio/Omni-2B** | — | — | — | — | ✅ LoRA+GGUF (PRs #16972/#16973) |

**Who's ahead:**
- **Unsloth** leads on *training-side* new-architecture coverage (context parallelism extended family-by-family in a single day across Gemma 4, DeepSeek, MiniMax).
- **vLLM** leads on *serving-side* breadth (three new hardware-targeted decode paths in one day) but is paying for it with SM120 instability.
- **Ollama** is the only project shipping *new model classes* (Ripple, Luciole tokenizer, dense Nemotron) yesterday — an MLX-runner bet.
- **SGLang** is the most AMD-aligned (MI350X, gfx950, gfx1250, Ryzen AI Halo roadmap).

---

## 4. Performance Frontier

Optimization effort is concentrated in **five distinct battlegrounds**:

**A. KV cache & memory tiering (highest strategic priority)**
- vLLM: KV offload data-path integrity gaps (#54363, #63149); filesystem tier has no verification or I/O bounds
- llama.cpp: **CUDA fused KV dequant in MMA flash-attention** (PR #31802) cuts VRAM for q8_0/q4_0 KV at long context — a direct long-context-agent win
- SGLang: HiCache host-tier load-back corruption fixed (#38031)

**B. Quantization kernels (most active rewrite)**
- vLLM: **Marlin → Humming migration** (#65560) covering INT4/INT8 GPTQ/AWQ, FP8, MXFP8/FP4, NVFP4, MXFP6
- SGLang: persistent MXFP4 decode generalized beyond Kimi-K3.1 (PR #49091); Hopper group32 FP8 launch reduction (PR #48165)
- llama.cpp: CPU F16 matmul → F32 src1 (PR #31854, precision-vs-speed tradeoff)
- ⚠️ **Correctness flag:** vLLM GPTQ W4A16 silently wrong when `group_size % 32 != 0` (#60608) — reproduced on both CUDA and ROCm

**C. Speculative decode / draft kernels**
- vLLM: DSpark draft walk fused into one kernel (PR #62958); DeepSeek-V4.1-Flash specialized decode
- SGLang: fused int8 Markov walk for DSpark at bs≤64 (PR #42855)
- Unsloth: **decode CUDA graphs on by default** → 2–8× on T4, token-identical (PR #16587)

**D. Distributed serving / parallelism**
- SGLang: V4.1 packs 8 images per ViT call (PR #49099); removes host syncs from rank-divergent DSA paths (PR #46830)
- Unsloth: context parallelism extended to Gemma 4, DeepSeek, MiniMax, Kimi; TP now *refuses* fp8 layers rather than silently downcasting (PR #16881)

**E. Kernel-level correctness/perf fixes**
- llama.cpp: CUDA lightning-indexer bank conflict fix (b12185); SYCL fused ADD+RMS_NORM+MUL → +3.4% tg128
- vLLM: batch-invariance routing tax on SM90/SM100 (#65569)

**Where the ROI is highest right now:** MoE cache offload (llama.cpp `--moe-cache-cpu-share`, PR #30966) and fused KV dequant are the two changes most likely to move *serving cost per token* in the next 30 days.

---

## 5. Layer Positioning

```
┌─────────────────────────────────────────────────────────────┐
│  GATEWAY / ROUTING          LiteLLM                          │
│                             (provider translation, MCP,      │
│                              budgets, guardrails)            │
├─────────────────────────────────────────────────────────────┤
│  SERVING ENGINES            vLLM  ◄──►  SGLang               │
│                             (datacenter, multi-GPU,          │
│                              TP/EP/PD-disagg, spec decode)   │
├─────────────────────────────────────────────────────────────┤
│  LOCAL RUNTIMES             llama.cpp  |  Ollama             │
│                             (single-node, GGUF, CPU/GPU      │
│                              hybrid, Apple MLX)              │
├─────────────────────────────────────────────────────────────┤
│  TRAINING / FINE-TUNING     Unsloth                          │
│                             (LoRA, DPO/GRPO/ORPO, context    │
│                              parallel, export → GGUF)        │
└─────────────────────────────────────────────────────────────┘
```

**Positioning notes for decision-makers:**
- **vLLM vs SGLang** is a genuine race, not a hierarchy. vLLM has broader hardware/quant coverage; SGLang has more aggressive kernel specialization and is the AMD reference path. On SM120 today, **vLLM is measurably ahead** (~6× on DeepSeek-V4 prefill per SGLang's own #33422).
- **llama.cpp vs Ollama** is upstream vs. product. Ollama increasingly consumes MLX (Apple) and leans on its own runner; llama.cpp stays the portable GGUF reference. Watch the **Ollama MLX concurrent generation** (PR #19197) — it's the first credible Apple-Silicon multi-tenant story.
- **LiteLLM is a single point of failure for correctness.** Every provider quirk (Anthropic thinking replay, Bedrock reasoning signature, Mistral tool_choice, ChatGPT encrypted reasoning) lands here. Budget for version pinning.
- **Unsloth bridges training → serving** via GGUF export; its context-parallel work increasingly overlaps vLLM's serving optimizations, so the two are converging on the same algorithmic surface from opposite directions.

---

## 6. Trend Signals

**Trend 1 — Blackwell (SM120) is in a "ship now, stabilize later" phase.**
Every serving engine reports SM120 as its weakest path: vLLM decode collapse (#56892), SGLang throughput deficit (#33422), llama.cpp CUDA IMA (#28282), Unsloth diffusion abort (#16925). **Watch:** whether SM12x kernel/toolkit fixes (#55651, #65900) close before the consumer Blackwell install base peaks.

**Trend 2 — Kernel portability is being re-architected, not patched.**
vLLM's Marlin→Humming migration, SGLang's trait-driven FP8 kernels (PR #48165), and Unsloth's auto-segmented allocator all point to **backend-agnostic kernel dispatch** as the 2027 architecture. Expect more breaking kernel-config changes, fewer per-arch forks.

**Trend 3 — Tool calling is the new availability surface.**
Across the stack: vLLM drops DeepSeek tool-call deltas (#58822); Ollama gpt-oss rejects its own tool calls (#17638) and Windows runners disconnect (#19439); LiteLLM misclassifies Anthropic server tools (#48384) and drops MCP error status (#49359); Unsloth reprocesses prompts after tool use (#17015). **Agent developers should treat tool-call parsing as a first-class reliability concern**, not a model concern.

**Trend 4 — Memory accounting is a silent correctness bug class.**
Ollama's VRAM miscounts (PR #18866), Unsloth's SDXL allocator (PR #17045), llama.cpp's MoE cache offload, and vLLM's KV tiering gaps all describe the same failure mode: **the engine doesn't know what it's holding, so it can't enforce bounds.** This is where OOMs and silent context-window loss come from.

**Trend 5 — Gateway-layer budgets are not yet trustworthy.**
LiteLLM's budget bypass on DB errors (#35529) and key-window drift during in-flight requests (#49179) are **fail-open bugs on a security boundary**. Application teams must add a secondary spend cap.

**Trend 6 — AMD is now a first-class target, not an afterthought.**
SGLang's MI350X/gfx1250 roadmap (#46462), vLLM's ROCm MXFP8 prefill (PR #66330), and Unsloth's SYCL request (#17048) show AMD moving from "works" to "optimized." Intel (SYCL, Arc, Hexagon NPU) is the next frontier — but Arc Vulkan correctness issues (#31560, #31828) mean it's not production-ready.

**What to watch this week:**
- **If you serve agents on SM120:** pin to SM90/SM100 or validate throughput before committing. Do not assume vLLM/SGLang parity.
- **If you rely on speculative decode + grammar constraints:** avoid SGLang DSpark+TP until #41449 resolves (batch deadlock).
- **If you use MCP:** the LiteLLM `tools/list` latency regression (#50065) affects pre-2026 clients — check your protocol version.
- **If you train then serve:** Unsloth's CUDA-graph default (#16587) will silently change inference throughput in `model.generate()` paths; benchmark before and after.
- **If you run MoE on consumer hardware:** llama.cpp's `--moe-cache-cpu-share` (#30966) is the single most actionable tuning knob shipped this week.

---

## Per-Project Reports

<details>
<summary><strong>vLLM</strong> — <a href="https://github.com/vllm-project/vllm">vllm-project/vllm</a></summary>

# vLLM Digest — 2026-11-08

## 1. Today's Highlights

No releases landed in the last 24h, but issue/PR activity is heavily concentrated on Blackwell (SM120) enablement: a high-traffic DeepSeek-V4.1-Flash decode-throughput bug (#56892, 28 comments) and multiple SM12x kernel/toolkit compatibility fixes (#55651, #65900) indicate SM120 is still the weakest supported path. On the kernel side, a major in-progress migration would replace Marlin with Humming across NVIDIA architectures (#65560), and two specialized-decode PRs target DeepSeek-V4.1-Flash on Ampere (#66275) and MiniMax-M3.1-Flash on GB300 (#66324). Stability attention is split between KV-cache/tiering correctness (#54363, #63149) and scheduler/attention regressions (#65139, #65387, #61762).

## 2. Releases & Breaking Changes

No releases in the last 24h, so no version/API changes today. Two in-flight RFCs carry future migration implications for operators:

- **Env-var reduction** (#25700): env vars such as attention backend and all2all kernel backend should migrate to first-class configs — worth tracking before it becomes a deprecation cycle. [link](https://github.com/vllm-project/vllm/issues/25700)
- **`--override-generation-config` semantics** (#45978, PR open): special tokens are currently not honored via the documented merge behavior; the fix clarifies override semantics. [link](https://github.com/vllm-project/vllm/pull/45978)

## 3. New Model & Hardware Support

- **MiniMax-M3.1-Flash specialized decode on GB300** (PR #66324): CuTe DSL optimized decode for small-batch agentic/interactive serving, TP4 GB300 (also runs GB200/B200), no speculation or DSpark with up to 7 draft tokens; claims up to 1.45x. [link](https://github.com/vllm-project/vllm/pull/66324)
- **DeepSeek-V4.1-Flash native decode on Ampere (SM80)** (PR #66275): fills the gap left by Hopper-specialized decode (#64893), targeting A100/A800. [link](https://github.com/vllm-project/vllm/pull/66275)
- **Nemotron 3.5 ASR Streaming** (issue #47455): request to support `nemotron-3.5-asr-streaming-0.6b` (600M multilingual streaming ASR, OpenMDW-1.1). [link](https://github.com/vllm-project/vllm/issues/47455)
- **Riva-compatible speech API plugin hooks** (RFC #65545): lifecycle hooks (readiness/graceful drain) plus out-of-tree gRPC `nvidia.riva.asr.RivaSpeechRecognition` compatibility. [link](https://github.com/vllm-project/vllm/issues/65545)
- **XPU MXFP8 MoE path + softcap/ALiBi fail-closed** (PR #49813). [link](https://github.com/vllm-project/vllm/pull/49813)

## 4. Performance & Optimization

- **Marlin → Humming kernel migration across NVIDIA architectures** (#65560): Humming now covers INT4/INT8 GPTQ/AWQ, FP8, MXFP8, MXFP4, NVFP4, MXFP6 (dense + MoE); Marlin has no Hopper/Blackwell-specific paths. [link](https://github.com/vllm-project/vllm/issues/65560)
- **Batch-invariance routing** (#65569): on SM90/SM100, cuBLAS is already batch-invariant under the mode's settings, yet linear layers still route to Triton — a performance tax. [link](https://github.com/vllm-project/vllm/issues/65569)
- **DSpark draft walk fused into one kernel with int8 W2 on-chip (Hopper)** (PR #62958): eliminates per-draft-token full-vocab GEMV over a 78 MB bf16 W2. [link](https://github.com/vllm-project/vllm/pull/62958)
- **ROCm GLM-5.3-Flash KDA `o_norm`**: keep fused gated RMSNorm instead of eager decomposition (PR #66219); **[ROCm] MXFP8 prefill GEMMs** on gfx950 use 128x128x128 tiles, reported 1.15896× faster on MiniMax-M3.1-Flash TP4 prefill mixture (PR #66330). [link 1](https://github.com/vllm-project/vllm/pull/66219) · [link 2](https://github.com/vllm-project/vllm/pull/66330)
- **ReplaySSM** (#47572): cache SSM inputs instead of state for Mamba2/GDN decode — memory-bandwidth optimization with cross-framework implementation. [link](https://github.com/vllm-project/vllm/issues/47572)
- **GeForce Blackwell MoE gaps**: RTX 5090 (SM120) Qwen3-Omni MoE decode is 3–6x slower due to missing tuned fused-MoE configs (#48732); RTX PRO 6000 SM120 DeepSeek-V4.1-Flash decode is also severely degraded (see below). [link](https://github.com/vllm-project/vllm/issues/48732)

## 5. Stability & Regressions

Ranked by severity:

1. **SM120 decode collapse on DeepSeek-V4.1-Flash** (#56892, 28 comments): extremely low decode throughput with `--enforce-eager` on 8x RTX PRO 6000 Blackwell; CUDA graphs unusable on SM120. No fix PR linked. [link](https://github.com/vllm-project/vllm/issues/56892)
2. **CUDA illegal memory access in b12x attention** (#65139): first MTP verify step with cold-JIT `PagedForwardKernel`; regression v0.32.0 → v0.33.0 on SM120 + NVFP4 MoE + fp8 KV + MTP spec decode. [link](https://github.com/vllm-project/vllm/issues/65139)
3. **EngineCore permanent block (no timeout)** (#52247): `AsyncModelRunnerOutput.copy_event.synchronize()` hangs forever if a GPU kernel never terminates — a watchdog-class availability bug. [link](https://github.com/vllm-project/vllm/issues/52247)
4. **TP workers wedge in Triton kernel launch** (#65387): GDN `layer_norm_fwd` with idle GPUs, Qwen3.5 + MTP, v0.29.0, 2x H200 NVL. [link](https://github.com/vllm-project/vllm/issues/65387)
5. **Scheduler livelock** (#61762): multi-module MTP + Mamba align prefix caching when `prompt_len % block_size < num_speculative_tokens`; reproduced on CPU. [link](https://github.com/vllm-project/vllm/issues/61762)
6. **Silent wrong output in GPTQ W4A16 kernels** (#60608): Exllama GPTQ/RDNA3 when `group_size % 32 != 0`; reproduced on CUDA sm_120 and ROCm gfx1100 — correctness, not just perf. [link](https://github.com/vllm-project/vllm/issues/60608)
7. **Hybrid GDN prefix-cache under MTP** (PR #52244, fix open): Qwen3.5-122B-A10B cached prompts never reach expected depth; some lengths get zero hits. [link](https://github.com/vllm-project/vllm/pull/52244)
8. **FlashInfer JIT failures taking down engines** (#50705 / fixes PR #65900, #55651): missing cubin wheel or nvcc on SM12x causes warmup-time build failure instead of graceful fallback; a native-sampler fallback PR is open. [link](https://github.com/vllm-project/vllm/pull/65900)
9. **`max_tokens: null` bypasses caps** (#65592): token-in/token-out endpoint skips `get_max_tokens`, ignoring `default_sampling_params` and `--override-generation-config max_*`. [link](https://github.com/vllm-project/vllm/issues/65592)
10. **KV offload data-path integrity gaps** (#54363, #63149): filesystem tier has no integrity verification or I/O time bounds; KV event correctness tracking across architectures, spec decode, and Dynamo/llm-d/Router consumers. [link 1](https://github.com/vllm-project/vllm/issues/54363) · [link 2](https://github.com/vllm-project/vllm/issues/63149)
11. **DeepSeek-V4.1-Flash streaming parser drops tool-call deltas** (#58822, fix PR open). [link](https://github.com/vllm-project/vllm/pull/58822)

Also noted: Qwen3.5 vision RoPE precision mismatch vs HF on A800 (#66070), MiMo-V2.6 video timestamps ignoring real frame times (#65523), and pythonic tool parsers rejecting Python reserved keywords as argument names (#66174/#66173, fix PR open).

## 6. What This Means for Application Developers

- **Don't assume SM120 (RTX PRO 6000, RTX 5090) is production-ready** for DeepSeek-V4.1-Flash, MTP spec decode, or MoE-heavy models — decode throughput and graphs are still broken (#56892, #65139, #48732). Prefer Hopper or pin to validated SM90/SM100 paths for latency-sensitive serving.
- **Pin your FlashInfer install deliberately**: mismatched `flashinfer-cubin` wheels or images without nvcc can crash engines at warmup on SM12x, not just degrade (#65900, #55651). Keep the native sampler fallback in your deployment plan.
- **Agent/tool-calling stacks should watch the streaming and parser bugs**: DeepSeek-V4.1-Flash tool-call deltas are dropped while streaming (#58822), and reserved-keyword argument names break pythonic parsers (fix in PR #66174) — both directly affect agent reliability.
- **Set explicit output-token caps server-side** if you rely on platform overrides, since `max_tokens: null` currently bypasses them (#65592).
- **Riva-compatible speech apps**: the endpoint-plugin lifecycle RFC (#65545) is the thread to follow if you need gRPC ASR compatibility or graceful drain semantics in your gateway.

</details>

<details>
<summary><strong>SGLang</strong> — <a href="https://github.com/sgl-project/sglang">sgl-project/sglang</a></summary>

# SGLang Digest — 2026-11-08

## 1. Today's Highlights

Activity is dominated by kernel-level performance work and a long tail of hardware-specific bug triage rather than new releases. Notable resolution: the DP user-routing state corruption that collapsed long-prefill throughput (#35241) was closed with a confirmed root cause. On the feature side, AMD MiniMax-M3.1-Flash support and several NVIDIA MXFP4/FP8 kernel generalizations are progressing through review.

## 2. Releases & Breaking Changes

No new releases in the last 24h. One compatibility-relevant fix landed in PR form:

- **[PR #49096](https://github.com/sgl-project/sglang/pull/49096)** — MegaMoE startup autotune was broken by the FlashInfer 0.7.3 bump (#48468): the megakernel config gained an enum field `finalize_mode` and knob-cache fields. Operators on FlashInfer 0.7.3+ should track this fix before enabling MegaMoE autotune.

## 3. New Model & Hardware Support

- **[PR #46693](https://github.com/sgl-project/sglang/pull/46693)** — MiniMax-M3.1-Flash on MI350X/MI355X (gfx950); part of a larger AMD series with attention/MoE/AR kernel PRs already merged.
- **[PR #47398](https://github.com/sgl-project/sglang/pull/47398)** — AMD gfx1250 gpt-oss mixed W4A8 MoE strategy (Gluon below a token threshold, FlyDSL above).
- **[PR #48741](https://github.com/sgl-project/sglang/pull/48741)** — Kimi-K3.1 PD disaggregation under decode context parallelism (ports #48414; DSA index-K sharding from #48721).
- **[Issue #46462](https://github.com/sgl-project/sglang/issues/46462)** — AMD Q4 2026 roadmap: Helios rack-scale, MI45x (gfx1250), Ryzen AI Halo (gfx1151/1152), Monokernel focus.
- **[Issue #32321](https://github.com/sgl-project/sglang/issues/32321)** — Apple Silicon serving redesign RFC (Torch-owned SRT path with exported MLX region); implementation in PR #36164.

## 4. Performance & Optimization

- **[PR #49091](https://github.com/sgl-project/sglang/pull/49091)** — Generalizes the persistent MXFP4 decode MoE kernel (from #48638, previously Kimi-K3.1 TP8 only) to covered shapes and DeepSeek-V4/V4.1. Opt-in.
- **[PR #49099](https://github.com/sgl-project/sglang/pull/49099)** — DeepSeek-V4.1 packs up to 8 images per ViT encoding call, fixing launch-bound small-image prefill under concurrency.
- **[PR #48165](https://github.com/sgl-project/sglang/pull/48165)** — Hopper group32 FP8 quantization with FP32 scales routed to trait-driven kernel; for `[8192, 5120]` launch count drops 32→ on the fast path.
- **[PR #43126](https://github.com/sgl-project/sglang/pull/43126)** — AMD Kimi-K3: emits AITER MoE sort directly from the radix-4 router launch for decode-bound (M ≤ 64) serving on MI355X.
- **[PR #46830](https://github.com/sgl-project/sglang/pull/46830)** — Removes host syncs from rank-divergent DSA eager paths.
- **[PR #42855](https://github.com/sgl-project/sglang/pull/42855)** — Fused int8 Markov walk kernel for DSpark at bs ≤ 64 on Hopper (opt-in).
- **[PR #39315](https://github.com/sgl-project/sglang/pull/39315)** — Throttles fully-idle load snapshot publishing to stop busy-poll queue walks on drained engines.
- **[Issue #47734](https://github.com/sgl-project/sglang/issues/47734)** — `sgl-kernel` FA3 selects `MmaPV_is_RS=false` for hdim 128 non-causal on H200, 1.5–3% slower than flash-attn's Hopper build.
- **[Issue #33422](https://github.com/sgl-project/sglang/issues/33422)** — DeepSeek-V4 prefill on SM120 (4× RTX PRO 6000, TP=4) reports ~2–7K tok/s vs ~12.5K via vLLM/marlin on identical hardware; tuning guidance requested.

## 5. Stability & Regressions

Ranked by severity:

1. **[Issue #35241](https://github.com/sgl-project/sglang/issues/35241) (CLOSED, resolved)** — Generation health checks mutated shared DP user-routing/load-balancing state, collapsing long-prefill throughput. Root cause confirmed 2026-11-08; retrospective published.
2. **[Issue #41449](https://github.com/sgl-project/sglang/issues/41449)** — DSpark + TP: any grammar-constrained request batched with another request deadlocks all ranks; GPUs spin in a collective. No fix PR referenced.
3. **[Issue #48593](https://github.com/sgl-project/sglang/issues/48593)** — Full prefill CUDA graph capture fails with `IndexError` in `HybridLinearAttnBackend._replay_metadata` for GDN/KDA hybrid models. No fix PR referenced.
4. **[Issue #36941](https://github.com/sgl-project/sglang/issues/36941)** — GB10 (DGX Spark): >40k-token prefills exhaust unified memory; worker rank dies silently between 54k–62k tokens with no traceback or OOM record.
5. **[Issue #40320](https://github.com/sgl-project/sglang/issues/40320)** — FlashInfer autotune cache discarded on every boot under MoE EP>1 because per-rank shapes diverge, forcing full re-tuning each start.
6. **[Issue #38573](https://github.com/sgl-project/sglang/issues/38573) (CLOSED)** — compressed-tensors W4AFP8 MoE passed literal `chunk_size=128` at six sites; `group_size: 64` checkpoints loaded clean and served silently wrong output.
7. **[Issue #38031](https://github.com/sgl-project/sglang/issues/38031) (CLOSED)** — GLM-5.3-Flash DSA: HiCache host-tier load-back corrupted generation (dropped tool calls, repetition loops) on 8×H100 TP8.
8. **[Issue #47916](https://github.com/sgl-project/sglang/issues/47916) (CLOSED)** — Mamba/hybrid `MambaPool.copy_from` gathered all source states into one `(n × state_size)` temporary, OOMing under parallel admission bursts.
9. **[Issue #47509](https://github.com/sgl-project/sglang/issues/47509)** — Rust server `gather_server_endpoints()` can advertise loopback/unroutable addresses to other DP ranks; only warns.
10. **[Issue #48892](https://github.com/sgl-project/sglang/issues/48892) (CLOSED)** — Diffusion CI regression from #48366: `test_kandinsky6_sr_decode_parallel` tensor mismatch.
11. **[Issue #33483](https://github.com/sgl-project/sglang/issues/33483) (CLOSED)** — `max_running_requests` (4096) vs `cuda_graph_max_bs` (32) defaults derived independently; exceeding graph ceiling was an absorbing state.
12. **[Issue #34857](https://github.com/sgl-project/sglang/issues/34857) (CLOSED)** — ROCm/aiter: router GEMM must stay fp32; expert correction bias was being cast to bf16.
13. **[Issue #45367](https://github.com/sgl-project/sglang/issues/45367) (CLOSED)** — Kimi-K3 DCP a2a garbled decode on 2-node GB300; `NCCL_GRAPH_REGISTER=0` restored correctness. Production patch validated against #45824.

## 6. What This Means for Application Developers

- **DeepSeek-V4 operators on SM120:** throughput may materially trail vLLM (up to ~6× gap reported in #33422). Benchmark before committing; don't assume parity across backends.
- **If you run multi-turn agent workloads with HiCache + Mooncake:** watch for transient prefix-cache hit-rate dips under L2/L3 pressure (#47481) and validate after upgrading past the DSA HiCache corruption fix (#38031).
- **CI health matters to you too:** the flaky-test/CI bailiwick (#42752, #48311) shows that perf gates depend on runner placement — if you vendor SGLang CI configs, pin runners rather than relying on retries.
- **FlashInfer 0.7.x users:** MegaMoE startup autotune is broken until #49096 lands; if you're on 0.7.3, consider disabling MegaMoE autotune or pinning the prior FlashInfer until merged.
- **Grammar-constrained decoding with DSpark + TP:** avoid until #41449 is resolved — mixing constrained and unconstrained requests in one batch deadlocks the engine.

</details>

<details>
<summary><strong>llama.cpp</strong> — <a href="https://github.com/ggml-org/llama.cpp">ggml-org/llama.cpp</a></summary>

# llama.cpp Digest — 2026-11-08

## 1. Today's Highlights

A busy release window (b12184–b12194) centered on **mtmd/multimodal hardening** and **MoE cache CPU offload**. The most consequential changes for serving infrastructure are the new `--moe-cache-cpu-share` tuning knob (b12191) and a proper WASM-safe log-mel implementation moved into the compute graph (b12193). Meanwhile, backend work continues across Metal (GROUP_NORM correctness), WebGPU (new GROUP_NORM kernel), Vulkan (readonly buffer hints), and CUDA (bank-conflict fix in the lightning indexer).

---

## 2. Releases & Breaking Changes

- **b12191 — `llama_moe_cache`: run missed experts on CPU** ([#30966](https://github.com/ggml-org/llama.cpp/pull/30966))
  - New flag `--moe-cache-cpu-share F` computes a fraction `F` of MoE cache misses on host CPU experts instead of uploading them to GPU. This changes the graph construction for MoE FFN paths — anyone with custom graph hooks around expert offload should re-verify.
- **b12193 — `mtmd`: log-mel moved to cgraph** ([#31808](https://github.com/ggml-org/llama.cpp/pull/31808))
  - `mtmd_audio_stft_op` and the standalone `mtmd_audio_preprocessing` thread-pool path were removed. Threads are no longer spawned per audio request (also unblocks WASM builds). **API surface change** for anyone calling the audio preprocessing entry points directly.
- **b12184 — link `Threads::Threads` privately** ([#31785](https://github.com/ggml-org/llama.cpp/pull/31785))
  - Build-system-only fix; downstream CMake consumers that implicitly relied on transitive pthread linkage may need `find_package(Threads)` explicitly.

No version-number jumps or config schema deprecations landed today.

---

## 3. New Model & Hardware Support

- **MageVL-Cowork** — mtmd support added in **b12192** ([#31819](https://github.com/ggml-org/llama.cpp/pull/31819)). RoPE factors are now stored once at `clip_model` level (shared across layers) with shape validation in the loader — a behavior change for anyone with hand-crafted MageVL GGUFs.
- **Maple-Preview TQ1_0 / TQ2_0 on CUDA** — in review ([#31512](https://github.com/ggml-org/llama.cpp/pull/31512)). Previously these stayed on host; now GPU kernels are proposed (~1.69 bits/weight base-3 trits for TQ1_0).
- **Hexagon NPU** — `N_HVX` and `N_THREADS` are now derived from the target arch (b12194, [#31857](https://github.com/ggml-org/llama.cpp/pull/31857)), avoiding over-allocation; `HTP_DEBUG` can be enabled via `build.py`.
- **WebGPU GROUP_NORM kernel** added (b12187, [#31490](https://github.com/ggml-org/llama.cpp/pull/31490)) — relevant for newer vision/diffusion-adjacent models.
- **SYCL SWIGLU_OAI f16** support landed upstream ([#30857](https://github.com/ggml-org/llama.cpp/pull/30857), closed) — previously asserted on F16.

---

## 4. Performance & Optimization

- **CPU F16 matmul now uses F32 `src1`** ([#31854](https://github.com/ggml-org/llama.cpp/pull/31854), open) — `vec_dot_type(GGML_TYPE_F16)` becomes `GGML_TYPE_F32`, affecting conv/conv_transpose/supports_op. This is a *precision and speed* shift on CPU: potentially slower per-op but more accurate; benchmark before/after.
- **CUDA fused KV dequant in MMA flash-attention** ([#31802](https://github.com/ggml-org/llama.cpp/pull/31802), open) — eliminates the separate dequant pass that materializes f16 K/V scratch for **q8_0 and q4_0 KV**. Expect meaningful VRAM and bandwidth wins at long context with quantized KV.
- **CUDA lightning indexer bank-conflict fix** (b12185, [#31803](https://github.com/ggml-org/llama.cpp/pull/31803)) — shared-memory bank conflicts resolved; relevant for DeepSeek-style sparse attention.
- **SYCL fused ADD+RMS_NORM+MUL** ([#31753](https://github.com/ggml-org/llama.cpp/pull/31753), open) — reported **+3.4% tg128** on Qwen3.8-27B Q3_K_P (13.09 → 13.53 t/s) with `-fa on`.
- **Vulkan `readonly` on decodeBuf** (b12186, [#31833](https://github.com/ggml-org/llama.cpp/pull/31833)) — forward-looking hint; no current gains but positions for future driver optimization.
- **Vulkan rms_norm runtime loop count** ([#30824](https://github.com/ggml-org/llama.cpp/pull/30824), open) — addresses Adreno miscompilation of unrolled variants.
- **Server parent-before-child slot scheduling** (b12188, [#30779](https://github.com/ggml-org/llama.cpp/pull/30779)) — fixes a shared-prefix/child-slot race that could stall when a child lands on a lower slot ID than its parent. Small but real throughput effect for agents with parallel tool calls sharing a system prompt.

---

## 5. Stability & Regressions

Ranked by severity:

1. **Vulkan `ErrorDeviceLost` on RDNA3** ([#30010](https://github.com/ggml-org/llama.cpp/issues/30010), 12 comments) — decode failure under Vulkan on RX 7900 XTX; still open, no fix PR linked.
2. **Intel Arc B-series Vulkan output corruption under long context / RAG** ([#31828](https://github.com/ggml-org/llama.cpp/issues/31828)) — persists even with `GGML_VK_DISABLE_COOPMAT`; separate from the coopmat nondeterminism issue below. No fix PR.
3. **KHR_coopmat nondeterministic results on Arc Pro B70 (BMG G31)** ([#31560](https://github.com/ggml-org/llama.cpp/issues/31560)) — Laya-GGUF encoder returns different answers on identical input; labeled open, 10 comments. Combined with #31828, **Intel Arc Vulkan users should pin to a known-good build or use CPU/SYCL**.
4. **mtmd server crash — `GGML_ASSERT` on large images, `--image-max-tokens` ignored** ([#31131](https://github.com/ggml-org/llama.cpp/issues/31131)) — **fix PR #31864 open** ([#31864](https://github.com/ggml-org/llama.cpp/pull/31864)) by SofianElmotiem, applying min/max token limits to all dynamic-resolution projectors. Should land soon.
5. **CUDA illegal memory access on GLM-5.3-Flash long prefill at `-ub 2048`** ([#28282](https://github.com/ggml-org/llama.cpp/issues/28282)) — Blackwell/sm_120 only, PR-branch only; low blast radius but worth tracking if you run GLM-5.3.
6. **SYCL AOT build break for Meteor Lake** ([#31033](https://github.com/ggml-org/llama.cpp/issues/31033)) — `dpas.nosrc0` intrinsic unsupported; regression from d81d0d8fb. Build-time only.
7. **Tokenizer SIGSEGV in `unicode_regex_split_stl`** ([#27783](https://github.com/ggml-org/llama.cpp/issues/27783)) — stack overflow on ~26k-character single-class unbroken runs (o200k/GPT4O pre-tokenizer). Relevant if you accept untrusted user text into a tokenizer.
8. **PEG chat parser throws on invalid UTF-8 in tool calls** ([#31861](https://github.com/ggml-org/llama.cpp/pull/31861), open) — uncaught `json.exception.type_error.316`; `sanitized_text()` already used for reasoning/content but not for tool-call paths. Fix PR in flight.
9. **Fix PR #31861** (above) and **#31834** ([#31834](https://github.com/ggml-org/llama.cpp/pull/31834)) — JSON-schema `allOf` with plain integer types generated empty-object grammar. Fix for #31805.
10. **Metal GROUP_NORM `ne03 > 1` / non-contiguous fix** (b12189, [#31852](https://github.com/ggml-org/llama.cpp/pull/31852)) — silent wrong results for batched/non-contiguous inputs corrected.

---

## 6. What This Means for Application Developers

- **If you serve MoE models with KV cache offload**: the new `--moe-cache-cpu-share` is worth benchmarking immediately. It trades GPU upload bandwidth for host compute on misses, and combined with the follow-up `auto` PR ([#31286](https://github.com/ggml-org/llama.cpp/pull/31286)) should reduce tuning to a single flag.
- **If you handle multimodal audio**: the mtmd log-mel change removes per-request thread explosion and makes WASM/edge deployments feasible. But verify any direct calls into the old preprocessing API.
- **If you use quantized KV (q8_0/q4_0) with flash-attention on CUDA**: PR #31802, when merged, will cut VRAM and bandwidth for long-context agents — the current explicit dequant scratch pass is a known cost center.
- **If you're on Intel Arc + Vulkan**: two independent correctness issues (#31560, #31828) are open with no fix in flight. Consider SYCL or a pinned older build for production inference; do not ship coopmat-enabled Vulkan to Arc users without validation.
- **If you build agents with parallel tool calls**: b12188's parent-before-child slot scheduling fixes a real hang/stall class when children share a prompt prefix with a lower-ID parent slot. Upgrade recommended.
- **If you accept untrusted text into the tokenizer**: #27783 (stack overflow) remains open — sanitize or length-bound inputs on the o200k/GPT4O tokenizer path.
- **If you expose tool calling over the OpenAI-compatible API**: phi #31861 (invalid UTF-8 → uncaught exception) affects any path where the model emits malformed bytes inside a tool call. Patch or validate upstream until merged.

</details>

<details>
<summary><strong>Ollama</strong> — <a href="https://github.com/ollama/ollama">ollama/ollama</a></summary>

# Ollama Digest — 2026-11-08

## 1. Today's Highlights

No new releases landed in the last 24h, but PR activity is heavy across the MLX runner, memory accounting, and tool-calling paths. Two long-standing community requests (bulk model updates, terminal markdown rendering) resurfaced with fresh maintainer/user activity. On the stability side, multiple tool-calling and parser bugs on Windows, gpt-oss, Gemma 4, and DeepSeek 3 remain open, with fix PRs in flight for several of them.

---

## 2. Releases & Breaking Changes

*None in the last 24h.*

---

## 3. New Model & Hardware Support

- **[#19592](https://github.com/ollama/ollama/pull/19592) — Add Ripple preview support to MLX runner** (`pdevine`)
  Adds Ripple model, renderer, parser, and import registration. Includes per-layer NoPE in DFlash drafts, fused MLP activation, value blending, and attention gating. Ships reference fixtures and regression tests. Test models are published under `pdevine/ripple-*`.

- **[#19366](https://github.com/ollama/ollama/pull/19366) — MLX: Windows support + CPU backend** (`ssfdre38`)
  Enables native Windows execution of the MLX runner, adds a CPU backend alongside Metal/CUDA, and unlocks full text-to-speech inference (e.g. `phonon:en`).

- **[#19567](https://github.com/ollama/ollama/pull/19567) — Dense Nemotron + Luciole tokenization in MLX** (`malibayram`)
  Registers `NemotronForCausalLM` forward path and adds the published normalization sequence + Split/Metaspace tokenizer pipeline required for Luciole 1B.

- **[#19197](https://github.com/ollama/ollama/pull/19197) — MLX concurrent generation** (`dhiltgen`)
  Allows MLX models to serve multiple concurrent generation requests via `OLLAMA_NUM_PARALLEL`. Ready requests share projection and feed-forward work; attention remains per-request. Default remains 1.

---

## 4. Performance & Optimization

- **[#18866](https://github.com/ollama/ollama/pull/18866) — Per-context VRAM counting + KV cache prediction from metadata** (`Frank-Schruefer`)
  Fixes four separate memory miscounts causing divergence between `ollama ps` and `nvidia-smi` on a 19.3 GB card. Three issues undercount real allocations; the KV cache estimate is wrong in both directions and can cost a model its context window at large contexts.

- **[#19197](https://github.com/ollama/ollama/pull/19197)** (see above) — reduces first-token latency under concurrent MLX load by sharing projection and FFN work across ready requests.

- **[#19600](https://github.com/ollama/ollama/pull/19600) — `cmd/bench` reliability** (`lucasborges2001`)
  Benchmark epochs that fail or produce incomplete results now return non-zero exit codes, and successful measurements are preserved rather than overwritten. Important for CI benchmarking pipelines.

---

## 5. Stability & Regressions

Ranked by likely blast radius for production inference workloads:

1. **[#19439](https://github.com/ollama/ollama/issues/19439) — Runner disconnects during tool calling on Windows / RTX 5090** *(OPEN)*
   Ollama 0.40.13 on Windows intermittently fails HTTP 500 on `/tokenize` and loses contact with the internal runner during native tool calling and web-search in Open WebUI 0.12.5. Affects Muse Glimmer 30B and at least one other model. **High severity — no fix PR referenced.**

2. **[#17638](https://github.com/ollama/ollama/issues/17638) — gpt-oss rejects its own tool call** *(OPEN)*
   `gpt-oss:20b` produces a tool call that Ollama's parser then refuses with HTTP 500 "error parsing tool call." Reproduced on RTX 5060 Ti 16 GB with flash attention + q8_0 KV cache. **High severity for agent stacks.**

3. **[#17906](https://github.com/ollama/ollama/issues/17906) — Anthropic `/v1/messages` maps `xhigh` → `high`** *(OPEN)*
   Breaks Qwen3.8 chat templates that accept `xhigh` reasoning effort. `ollama launch claude` fails before inference. **Direct impact on Claude Code compatibility.**

4. **[#17748](https://github.com/ollama/ollama/issues/17748) — AMD Radeon 780M Vulkan regression** *(OPEN)*
   Ollama ≥ 0.32.10 fails larger models under Vulkan with `radv/amdgpu: Not enough memory for command submission` / `vk::Queue::submit: ErrorDeviceLost`. Same hardware works on older builds.

5. **[#19597](https://github.com/ollama/ollama/issues/19597) — Cloud `/api/chat` 400 "failed to read request body" at ~32 MiB** *(OPEN)*
   Undocumented payload size limit on Ollama Cloud chat — typically triggered by base64 images in a single user message. Request fails after 11–15s with no size hint. **New today.**

6. **[#19596](https://github.com/ollama/ollama/issues/19596) — `gemma4:12b-it-qat` Modelfile typo (`toos` vs `tools`)** *(OPEN)*
   Tools capability silently disabled for the official QAT model. Fix PR **[#19594](https://github.com/ollama/ollama/pull/19594)** and parser cleanup **[#19574](https://github.com/ollama/ollama/pull/19574)** (stray `<channel|>` close tags) are open and address adjacent Gemma 4 issues.

7. **[#19590](https://github.com/ollama/ollama/pull/19590) — deepseek3 parser whitespace trimming** *(OPEN)*
   `` trailing newlines arrive in the next chunk during real streaming, so response content starts with `\n\n`. Fix in review.

8. **[#18825](https://github.com/ollama/ollama/issues/18825) — `embeddinggemma-2:740m` fails on Linux** *(CLOSED)*
   Pull fails with "requires MLX support, but the MLX runtime is not available." Closed but confirms Linux/Intel users cannot consume MLX-gated models.

---

## 6. What This Means for Application Developers

- **Tool calling remains the sharpest edge.** Two of the top three stability issues involve tool-call parsing or routing (Windows RTX 5090 runner disconnects; gpt-oss self-rejected tool calls; Gemini/Claude routing mis-mapped in `launch claude`). If you run agents in production, pin your Ollama version and add retry/fallback logic around `/api/chat` when tool calls are in flight.
- **Cloud `/api/chat` has an undocumented ~32 MiB payload limit.** If you send base64 images or large context blobs to Ollama Cloud, chunk or resize client-side; there is currently no server hint. See [#19597](https://github.com/ollama/ollama/issues/19597).
- **Memory accounting fixes are coming.** PR [#18866](https://github.com/ollama/ollama/pull/18866) corrects KV cache estimation — if you size `num_ctx` against `ollama ps` today, re-validate context windows after this lands, as effective context may increase or decrease.
- **MLX is maturing fast.** Concurrency ([#19197](https://github.com/ollama/ollama/pull/19197)), Windows/CPU support ([#19366](https://github.com/ollama/ollama/pull/19366)), and new architectures (Ripple, Nemotron, Luciole) are all in flight. If you target Apple Silicon or want MLX parity on Linux/Windows, this is the week to watch.
- **Gemma 4 QAT users: check your tool capability.** The `toos` typo means tools are silently disabled for `gemma4:12b-it-qat` until [#19594](https://github.com/ollama/ollama/pull/19594) merges.
- **Community PRs worth tracking:** [#19599](https://github.com/ollama/ollama/pull/19599) (`ollama-update` — bulk model updates, addresses [#1890](https://github.com/ollama/ollama/issues/1890)) and [#19593](https://github.com/ollama/ollama/pull/19593) (wowTerminal) are low-risk additions if you maintain CLI tooling around Ollama.

---
*Sources: [github.com/ollama/ollama](https://github.com/ollama/ollama) — issues and PRs updated 2026-11-07 → 2026-11-08.*

</details>

<details>
<summary><strong>LiteLLM</strong> — <a href="https://github.com/BerriAI/litellm">BerriAI/litellm</a></summary>

# LiteLLM Digest — 2026-11-08

## 1. Today's Highlights

LiteLLM shipped `v1.110.0-dev.1` and an LTS patch `v1.108.3` with cosign-signed images. The day's issue volume was dominated by **provider-translation correctness** problems (Anthropic thinking/reasoning replay, Bedrock Converse, Mistral, ChatGPT), plus several high-impact MCP and budget/accounting regressions. On the PR side, work is landing on router resource cleanup on cancellation, S3-native Bedrock Converse sources, a fail-closed budget fix, and a new opt-in `total_timeout`.

## 2. Releases & Breaking Changes

- **v1.110.0-dev.1** — Docker images now signed with cosign (key from commit `e82a3c6`); verify via `cosign verify --key ...`. [Release](https://github.com/BerriAI/litellm/releases/tag/v1.110.0-dev.1)
- **v1.108.3 (LTS)** — LTS patch; `ghcr.io/berriai/litellm:lts` tracks the latest LTS. [Release](https://github.com/BerriAI/litellm/releases/tag/v1.108.3)
- **PR #50580** — `fix(vertex_ai)!`: changes `anyOf`/`const` schema handling for Gemini/Vertex; tool schemas with `type` + `anyOf` on the same node now preserve branches, and `const` maps to `enum`. Breaking change — verify existing tool schemas. [PR #50580](https://github.com/BerriAI/litellm/pull/50580)
- **PR #50496** — new opt-in `total_timeout` / `x-litellm-total-timeout` for non-streaming requests; existing timeouts unchanged. [PR #50496](https://github.com/BerriAI/litellm/pull/50496)

## 3. New Model & Hardware Support

- **Bedrock Converse S3 sources** — `s3://` URLs for images, PDFs, and videos in chat/Responses/Messages/Gemini generateContent now pass through to Bedrock instead of 500ing. [PR #50577](https://github.com/BerriAI/litellm/pull/50577)
- **Azure AI Foundry Agents v2** — Responses API with `agent_reference` support requested and now closed. [Issue #25372](https://github.com/BerriAI/litellm/issues/25372)
- **Anthropic hosted tool forcing** — `tool_choice={"type":"web_search"}` accepted on the Chat route (was 400 before reaching upstream). [PR #50578](https://github.com/BerriAI/litellm/pull/50578)
- **Bedrock endpoint routing** — `aws_bedrock_runtime_endpoint` now applies to native Chat and `/v1/responses` calls, not just Converse. [PR #50582](https://github.com/BerriAI/litellm/pull/50582)

## 4. Performance & Optimization

- **MCP `tools/list` regression** — v1.108.0 blocks 18–50 s on `tools/list` for clients sending pre-2026 `notifications/initialized` protocol versions. [Issue #50065](https://github.com/BerriAI/litellm/issues/50065)
- **Router cancellation cleanup** — cancelled/retried attempts now release io-token reservations and least-busy counts; cancellation propagates through failure hooks. [PR #50486](https://github.com/BerriAI/litellm/pull/50486)
- **SpendLogs delivery flush** — fix stops scanning the entire retained delivery table on every flush. [PR #50565](https://github.com/BerriAI/litellm/pull/50565)
- **Vertex Claude prompt caching** — `/v1/messages` to Vertex builds `messages` before `system`/`tools`, causing prompt-cache misses in tool loops. [Issue #50070](https://github.com/BerriAI/litellm/issues/50070)

## 5. Stability & Regressions

**Critical / open**
- **Budget bypass on DB errors** — `get_end_user_object()` swallowed exceptions and skipped end-user budget checks; fail-closed fix in review. [PR #50590](https://github.com/BerriAI/litellm/pull/50590) / [Issue #35529](https://github.com/BerriAI/litellm/issues/35529)
- **MCP tool errors dropped** — `is_error` not propagated on MCP tool failures, so Anthropic `tool_result` messages lose failure status. [Issue #49359](https://github.com/BerriAI/litellm/issues/49359)
- **Unbounded `unpack_defs` hang** — recursive/high-fan-in tool schemas still hang Bedrock/Vertex callers with no byte budget (incomplete fix for #19098). [Issue #34328](https://github.com/BerriAI/litellm/issues/34328)
- **MCP tools/list slowness** — 18–50 s delay on legacy subscription listener after upgrade. [Issue #50065](https://github.com/BerriAI/litellm/issues/50065)

**High**
- **Key budget window drift** — `/key/update` during an in-flight request drops that request's cost from the window spend (spend logs correct). [Issue #49179](https://github.com/BerriAI/litellm/issues/49179)
- **Anthropic server_tool_use** — web-search server tool surfaced as a pending `tool_call`, causing agent loops. [Issue #48384](https://github.com/BerriAI/litellm/issues/48384)
- **ChatGPT reasoning dropped** — `chatgpt/` provider drops encrypted reasoning on `/v1/messages`, so it isn't replayed between tool calls. [Issue #49046](https://github.com/BerriAI/litellm/issues/49046)
- **Bedrock reasoning signature replay** — `reasoningText.signature` replayed to non-Anthropic models (GLM 5.3) causes 400. [Issue #49969](https://github.com/BerriAI/litellm/issues/49969)

**Medium**
- **Mistral `reasoning_content` dropped** — `_strip_output_only_fields` removes it instead of replaying as `thinking` chunk. [Issue #45546](https://github.com/BerriAI/litellm/issues/45546)
- **Mistral named `tool_choice` dropped** — pinned tool never called. [Issue #39736](https://github.com/BerriAI/litellm/issues/39736)
- **`reasoning_effort="none"`** — omits thinking config instead of disabling on default-on Claude models. [Issue #47924](https://github.com/BerriAI/litellm/issues/47924)
- **Anthropic guardrail bypass** — MCP tools via `/v1/messages` invisible to pre_call guardrails. [Issue #40583](https://github.com/BerriAI/litellm/issues/40583)
- **`/v1/messages` streaming** — Chat-to-Responses bridge omits `sequence_number`; `output_item.done` hardcoded to 1. [Issue #44923](https://github.com/BerriAI/litellm/issues/44923)
- **`/v1/images/edits` Vertex Gemini** — missing image returns 500 instead of 400. [Issue #50173](https://github.com/BerriAI/litellm/issues/50173)
- **Vertex TTS `vertex_location` ignored** — always hits global endpoint. [Issue #50219](https://github.com/BerriAI/litellm/issues/50219)
- **Bedrock audio transcription** — HTTP 400 on system message with audio blocks. [Issue #41544](https://github.com/BerriAI/litellm/issues/41544)
- **vLLM pass-through 401** — DB-stored per-deployment `api_key` not sent. [Issue #23443](https://github.com/BerriAI/litellm/issues/23443)
- **`[DONE]` substring false positive** — stream terminates when tool-call args contain `[DONE]`. [Issue #31562](https://github.com/BerriAI/litellm/issues/31562)
- **`amazon_nova` streaming** — zstd decoder reuse fails 100% of streaming calls. [Issue #35589](https://github.com/BerriAI/litellm/issues/35589)

**Lower**
- **`chatgpt/` `response_format` dropped** — `allowed_keys` omits `text`; also rejects string input. [Issue #38085](https://github.com/BerriAI/litellm/issues/38085)
- **Embedding `list[str]` token count** — router pre-call raises `AttributeError`, skips context check. [Issue #35626](https://github.com/BerriAI/litellm/issues/35626)
- **Gemini explicit caching** — invalid cache URL/auth header with custom `api_base`. [Issue #34872](https://github.com/BerriAI/litellm/issues/34872)
- **`user_url_allowed_hosts`** — ignored under `litellm_settings`. [Issue #35177](https://github.com/BerriAI/litellm/issues/35177)
- **Cohere embeddings `COHERE_API_BASE`** — ignored; fix in review. [PR #50249](https://github.com/BerriAI/litellm/pull/50249)
- **`/cursor/chat/completions` unlogged** — provider charged, no SpendLogs entry. [Issue #30126](https://github.com/BerriAI/litellm/issues/30126)

## 6. What This Means for Application Developers

- **Agent reliability is the weak spot.** MCP tool failure propagation (#49359), Anthropic `server_tool_use` misclassification (#48384), and reasoning replay gaps (#49046, #49969) mean agent loops and tool calls can silently misbehave. Test agent flows against `/v1/messages` and `/v1/chat/completions` separately, and pin versions when tool-calling matters.
- **Budget enforcement is not guaranteed.** The DB-error path (#35529) and in-flight `/key/update` window drift (#49179) mean you should not rely on end-user budgets as a hard safety boundary — add a secondary spend cap at your application layer.
- **MCP clients need upgrade checks.** The v1.108.0 `tools/list` latency regression (#50065) affects Open WebUI and older Python SDK clients; verify with your client's protocol version before rolling out.
- **Vertex/Gemini tool schemas are changing.** PR #50580 is breaking for `type` + `anyOf` nodes; validate MCP-derived tool schemas before upgrading.
- **New knobs are opt-in.** `total_timeout` (#50496) lets you bound whole non-streaming requests; use it to avoid hangs on slow upstreams.

</details>

<details>
<summary><strong>Unsloth</strong> — <a href="https://github.com/unslothai/unsloth">unslothai/unsloth</a></summary>

# Unsloth Digest — 2026-11-08

## 1. Today's Highlights
No new releases landed in the last 24 hours, but PR activity is heavy across three fronts: decode CUDA graphs are being enabled by default for all FastModel models (#16587, 2–8× on T4), context parallelism is being extended family-by-family to Gemma 4, DeepSeek, MiniMax and Kimi (#15881–#15883), and Studio memory/VRAM work continues with an SDXL allocator fix saving ~1.15 GiB (#17045). On the issue tracker, the most substantive reports are a Qwen hybrid model re-processing full prompts after tool use (#17015), a DiffusionGemma multi-GPU abort above ~1792 tokens (#16925), and RAG ingestion running on a batch-of-1 path costing ~99 ms/chunk (#16715).

## 2. Releases & Breaking Changes
No new releases. No API or config breaks announced today.

## 3. New Model & Hardware Support
- **SYCL / Intel GPU path request** — users want to source `/opt/intel/oneapi/setvars.sh` before launching `llama-server` to use a SYCL llama.cpp build for substantial Intel GPU speedup. [PR/Issue #17048](https://github.com/unslothai/unsloth/issues/17048)
- **Context parallel: Gemma 4 text (Ulysses)** — per-family PR stacked on the Kimi/MiniMax/DeepSeek work. [PR #15883](https://github.com/unslothai/unsloth/pull/15883)
- **Context parallel: DeepSeek V2/V3 MLA, V3.2 indexer, V4 sink attention (Ulysses)**. [PR #15882](https://github.com/unslothai/unsloth/pull/15882)
- **Context parallel: MiniMax M1 Lightning hybrid, M2 (Ulysses)**. [PR #15881](https://github.com/unslothai/unsloth/pull/15881)
- **Context parallel extension to fast Mistral / Granite / Cohere attention, plus DPO/GRPO on fast Qwen3** — landed. [PR #16893](https://github.com/unslothai/unsloth/pull/16893)
- **LFM3-Audio-2B / LFM3-Omni-2B spoken replies on the transformers backend** (previously MLX-only) — closed PR. [PR #16972](https://github.com/unslothai/unsloth/pull/16972)
- **LFM3-Audio-2B train + export (LoRA, merged 16-bit, GGUF)** in Studio — closed. [PR #16973](https://github.com/unslothai/unsloth/pull/16973)

## 4. Performance & Optimization
- **Decode CUDA graphs on by default for every FastModel model** (Gemma 3/4, Qwen3, Qwen3-VL text, Llama, Mistral 3, Granite, Phi-4, OLMo 2, Cohere 2, GLM-4, Muse-Glimmer): 2–8× on T4 with token-identical output vs eager. In progress. [PR #16587](https://github.com/unslothai/unsloth/pull/16587)
- **SDXL decode VAEs into one expandable allocator segment** — cuts 1.15 GiB held VRAM (11.28 → below 8.95 GiB live-tensor ceiling at 1024×1024). [PR #17045](https://github.com/unslothai/unsloth/pull/17045)
- **Studio RAG ingestion batch-of-1 path** — `_embed_all` is invoked per-document, so small-file corpora run entirely on the slow path (~99 ms/chunk vs 2.07 ms batched). Fix warranted. [Issue #16715](https://github.com/unslothai/unsloth/issues/16715)
- **Studio diffusion automatic CFG-parallel** no longer refuses an idle second GPU over its own CUDA context (Wan2.2-TI2V-5B on 2×T4 was running on one card). [PR #17057](https://github.com/unslothai/unsloth/pull/17057)
- **Qwen hybrid model in Studio** re-processes the full prompt every turn after tool use when a large MCP tool catalog is enabled (65k context, `ToolLoopController` deferred-schema path). [Issue #17015](https://github.com/unslothai/unsloth/issues/17015)

## 5. Stability & Regressions
**High**
- **DiffusionGemma multi-GPU visual server aborts** on prompts over ~1792 tokens with `GGML_ASSERT n_ubatch >= n_tokens` (2× CUDA: RTX 3060 12GB + 4060 Ti 16GB). Open, no fix PR yet. [Issue #16925](https://github.com/unslothai/unsloth/issues/16925)
- **CPU backend pipeline parallel + MoE router aux loss diverges** from single-process training once gradient accumulation > 1 (repo parity test reproduces). Open. [Issue #17054](https://github.com/unslothai/unsloth/issues/17054)
- **Tensor parallel now refuses fp8 training layers** instead of silently training in 16 bit (torchao `Float8Linear` and `enable_fp8_lora` bases). Fix landed via #16881. [PR #16881](https://github.com/unslothai/unsloth/pull/16881)

**Medium**
- **ORPO/CPO/DPO/KTO chunked head falls back** correctly under torch global module hooks (`_hf_hook`). Fix closed. [PR #15259](https://github.com/unslothai/unsloth/pull/15259)
- **TP×FSDP2 save path** now picks exactly one writer when only tp-mesh DTensors remain. Fix closed. [PR #15257](https://github.com/unslothai/unsloth/pull/15257)
- **Tensor parallel sharded loading** now permits `init_lora_weights="orthogonal"`. Fix closed. [PR #15218](https://github.com/unslothai/unsloth/pull/15218)
- **CPU backend: DPO/GRPO trainers built during `context_parallel` import** still get CP attached mid-init. Open fix. [PR #17056](https://github.com/unslothai/unsloth/pull/17056)
- **Frontend CI red since #16755 merged** — auth refresh fixture must drain deferred work before restoring window. Fix closed. [PR #17055](https://github.com/unslothai/unsloth/pull/17055)
- **Beta update fails to complete** on desktop (Tauri). Open. [Issue #16897](https://github.com/unslothai/unsloth/issues/16897)
- **Image generation falls back to CPU/RAM on Windows 11 + RTX 3060** while text generation uses GPU correctly. Closed. [Issue #16803](https://github.com/unslothai/unsloth/issues/16803)
- **`search_conversation` tool disappears** (3rd recurrence). Closed. [Issue #16706](https://github.com/unslothai/unsloth/issues/16706)

**Low / UI**
- Model Hub rendering: search icon blurred (#16962), overlapping content (#17004) — both closed; fix via #17053. [PR #17053](https://github.com/unslothai/unsloth/pull/17053)
- Studio prevents searching models that don't fit in VRAM/RAM (blocks flash-next even with 48GB VRAM + SSD offload). Closed. [Issue #16982](https://github.com/unslothai/unsloth/issues/16982)
- LAN bind to network bridge IP rejected. Open. [Issue #17017](https://github.com/unslothai/unsloth/issues/17017)
- Attached file whose content resembles an attachment note parsed as second attachment. Open. [Issue #16913](https://github.com/unslothai/unsloth/issues/16913)
- Project indexing pegs resources and starves token generation (7500-doc Nextcloud folder); no pause button. Open. [Issue #16992](https://github.com/unslothai/unsloth/issues/16992)

## 6. What This Means for Application Developers
- **Agent loops are the current weak spot.** Two independent reports (#17015 in Studio, #16913 in chat) show prompt/tool-context handling degrading under MCP tools and file attachments. If you build agents on Unsloth, budget for prompt re-processing cost per turn and validate attachment parsing against untrusted file content before shipping.
- **Throughput wins are coming to `model.generate()` transparently.** #16587 turns decode CUDA graphs on by default with token-identical output — worth benchmarking your serving path against, but don't enable it in production until it clears codex-converged review.
- **Multi-GPU diffusion is not ready for long prompts.** #16925 aborts the server above ~1792 tokens on mixed 3060/4060 Ti setups; cap prompt length or stay single-GPU until fixed.
- **Quantization and parallelism caveats are tightening, deliberately.** #16881 now hard-refuses fp8 training under tensor parallel rather than silently downcasting — check your TP configs if you relied on fp8 layers.
- **RAG ingestion is a known bottleneck on small-file corpora** (#16715). If your workload is notes/docs/wikis rather than large files, batch at the document layer or wait for a fix; the 48× gap is real.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*