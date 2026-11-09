# AI Infrastructure Digest 2026-11-09

> Generated: 2026-11-09 00:44 UTC | Projects covered: 6

- [vLLM](https://github.com/vllm-project/vllm)
- [SGLang](https://github.com/sgl-project/sglang)
- [llama.cpp](https://github.com/ggml-org/llama.cpp)
- [Ollama](https://github.com/ollama/ollama)
- [LiteLLM](https://github.com/BerriAI/litellm)
- [Unsloth](https://github.com/unslothai/unsloth)

---

## Cross-Project Comparison

# Cross-Project Comparison Report — AI Infrastructure Ecosystem
**Date: 2026-11-09 | Projects: vLLM, SGLang, llama.cpp, Ollama, LiteLLM, Unsloth**

---

## 1. Ecosystem Overview

The AI inference stack is consolidating around three structural pressures: a new hardware tier (SM120/SM121 Blackwell workstation and DGX/GB10-class silicon) that no serving engine has fully tamed; a wave of long-context agentic workloads (1M-token requests, multi-turn prefix reuse) that stresses KV cache, scheduling, and cache-reuse semantics simultaneously; and a cross-cutting move toward **batch invariance and determinism** as RL and eval pipelines demand reproducible outputs. Meanwhile, the gateway layer (LiteLLM) is undergoing a Python→Rust migration while its core accounting correctness (streaming usage, budget enforcement) remains unresolved — a notable asymmetry. Training/fine-tuning (Unsloth) and local runtimes (Ollama, llama.cpp) are converging on the same edge/consumer GPU targets as the server engines, causing overlapping hardware bugs (ROCm, Intel Arc, T4/Turing). Overall: **capability is advancing faster than correctness guarantees.**

---

## 2. Activity Comparison

| Project | Issues (updated/24h) | PRs (updated/24h) | Releases (24h) | Release cadence signal |
|---|---|---|---|---|
| **vLLM** | Heavy (12+ tracked in digest) | ~15 highlighted; stacked BI series #65061–#65069 | **None** | Slowed; major work in stacked PRs |
| **SGLang** | 54 | 385 | **None** | Very high throughput; regression fixes pending |
| **llama.cpp** | Multiple (10 ranked) | ~15 highlighted | **10 builds (b12199–b12211)** | Extreme velocity |
| **Ollama** | Active | Several open (incl. #9546, #19327) | **None** | Quiet; PRs in review |
| **LiteLLM** | Multiple (13 ranked) | Large Rust-bridge batch | **v1.110.0-dev.2** | Dev-only; cosign signing added |
| **Unsloth** | 8 ranked | ~15 merged/closed | **None** | Burst of Studio inference fixes |

**Read:** llama.cpp is the only project shipping user-facing binaries daily. SGLang shows the highest raw PR throughput (385). vLLM and Ollama are in "big-refactor holding pattern." LiteLLM is the only one with any release, and it's a dev tag.

---

## 3. Model Support Race

| Project | New model/arch support shipped or in flight |
|---|---|
| **vLLM** | Kimi K3.1 @ TP8 (PR #66037); Nemotron 3.5 ASR streaming; ROCm DSv4.1 mono kernels; RFC for ViT full CUDA graph (Qwen3-VL, GLM-V, Kimi K2.5); Octave 3-bit KV for AMD |
| **SGLang** | Longcat 2.0 on NPU/Ascend; HiDream-O1-Image on NPU; ComfyUI integration; MiniMax-M3.1 decode indexer CP on Hopper; mixed W4A8 MoE on gfx1250; FlashInfer cuTile NVFP4 MoE proposed default on SM12x |
| **llama.cpp** | Zamba2/SSM `d_state=64` CUDA fast path (unblocks hybrid SSMs); Mellum2.1 MTP; SpacemiT MXFP4 (RISC-V); VXE bf16/q8_0 for Power; external PLE/engram loading |
| **Ollama** | Ornith/Qwen3.5 renderer+parser autodetect; FP8 import for MLX (lossless block FP8); Rockchip NPU backend (#19480); GGUF validation hardening |
| **LiteLLM** | Kitani (new OpenAI-compatible provider); GitHub Copilot native Messages; MiMo-V2-Pro closed; GLM-5.2 `[1m]` still broken |
| **Unsloth** | INT8 on Turing/T4; fp8 denoisers on L4; FLUX.3 on fp16-only GPUs; FSDP2 save across equal TP×FSDP2 meshes |

**Who is ahead:**
- **Frontier model coverage (DeepSeek-V4.1, Kimi K3.1, GLM-5.3, MiniMax-M3.1):** vLLM and SGLang are neck-and-neck, both actively integrating these on NVIDIA *and* AMD. vLLM has more in-flight (BI stack, Kimi K3.1).
- **Edge/consumer/non-NVIDIA breadth:** llama.cpp and Ollama lead decisively (RISC-V, Power, Rockchip NPU, Ascend NPU).
- **Hybrid/SSM architectures:** llama.cpp's `d_state=64` fast path (#31818) is the single most model-enabling change today — it removes silent CPU fallback for Zamba2-class models.
- **Apple/MLX:** Ollama's lossless block FP8 import is the only MLX-relevant advance.

**Notable gap:** No project shipped native **1M-context correctness** support — several (SGLang #48964, Ollama long-context paths) instead *regressed* on long-context stability.

---

## 4. Performance Frontier

Optimization effort concentration by layer:

| Domain | Most active today | Key items |
|---|---|---|
| **KV cache** | vLLM, SGLang, Ollama | vLLM "Octave" 3-bit KV (AMD), attention K/V view caching (#64572); SGLang fp8 DSA KV default on gfx950, fused fp8 KV writes; Ollama KV VRAM prediction fix (#19327) |
| **Quantization** | Unsloth, vLLM, SGLang | vLLM Marlin→Humming consolidation (INT4/8, FP8, MXFP*, NVFP4); Unsloth int8 GEMV/GEMM + NVFP4 recompile fixes; SGLang mixed W4A8 MoE on gfx1250 |
| **Kernels/fusion** | SGLang, llama.cpp, vLLM | SGLang QK-norm+RoPE+KV fused for 5D layout; llama.cpp H100 Q6_K prefill (TMA+WGMMA); vLLM MonoKernel specialized decodes RFC |
| **Batching/scheduling** | vLLM, OpenAI-compat | vLLM batch-invariance stack; KV-saturated admission backoff (#64460); SGLang prompt-KV sharing for same-batch requests (#48963) |
| **Distributed serving** | llama.cpp, SGLang, vLLM | llama.cpp RPC load 5× faster on DGX Spark; SGLang PD-disaggregation roadmap; vLLM sparse NCCL RL update fix |
| **Memory/copies** | Unsloth, Ollama | Unsloth eliminated ~10 redundant full-batch/plane copies across diffusion & GGUF dequant; Ollama buffer-line dedup |

**Read:** Kernel-level work is shifting from *new kernels* to *kernel config determinism* (which config gets latched, per-device re-reads, tie-breaking). This is a maturity signal. Quantization work is being *consolidated* (vLLM Humming) rather than expanded.

---

## 5. Layer Positioning

```
┌─────────────────────────────────────────────────────────────────┐
│ GATEWAY / ROUTING        LiteLLM (Python→Rust migration;         │
│                          budget/auth/accounting; multi-provider) │
├─────────────────────────────────────────────────────────────────┤
│ SERVING ENGINES          vLLM (frontier, NV+AMD, BI/RL)          │
│ (datacenter/tensor-parallel) SGLang (frontier + PD-disagg + NPU) │
├─────────────────────────────────────────────────────────────────┤
│ LOCAL RUNTIME            llama.cpp (GGUF, broadest hw: RISC-V,   │
│ (single-node, consumer)  Power, Arc, Metal, CUDA, ROCm)          │
│                          Ollama (GGUF wrapper, UX + Modelfile,   │
│                          NPU/MLX backends, model registry)       │
├─────────────────────────────────────────────────────────────────┤
│ TRAINING / FINE-TUNING   Unsloth (LoRA/QLoRA, Studio, diffusion  │
│                          inference; T4→Blackwell coverage)       │
└─────────────────────────────────────────────────────────────────┘
```

**Distinctions:**
- **vLLM vs SGLang:** Both are tensor-parallel serving engines. vLLM leans toward *frontier model enablement + determinism (BI)*; SGLang leans toward *PD-disaggregation, NPU backends, and diffusion (SGLD)*. They overlap heavily on advanced quant and both are bleeding on SM120.
- **llama.cpp vs Ollama:** Ollama is essentially a user-experience/registry layer over llama.cpp-class inference; its value is Modelfile semantics, model distribution, and now NPU/MLX backends. llama.cpp is the reference implementation and moves fastest on kernel/hardware breadth.
- **LiteLLM:** The only pure gateway — provider abstraction, budget, auth, observability. Its correctness bugs (billing) are *gateway-tier* problems that no serving engine can compensate for.
- **Unsloth:** The only training/fine-tuning project here; its inference (Studio) work is a downstream consequence of running models *it* fine-tuned, not a serving-engine competitor.

---

## 6. Trend Signals

**1. SM120/Blackwell-workstation bring-up is the ecosystem's biggest collective failure.**
vLLM (#56892, #65139) and SGLang (#49173, 8× prefill regression) both regressed on Blackwell-class consumer/workstation GPUs in the *same window*, and both from gating-logic changes (kernel path selection, not hardware limits). **Signal:** policy/predicate code around GPU class detection (`is_sm(10)` vs `is_sm100_or_newer`) is a systemic fragility. Developers should pin commits, not versions, on this hardware.

**2. Determinism and batch-invariance are becoming first-class requirements.**
vLLM's stacked BI PR series (#65061–#65069) and llama.cpp's Top-K determinism (#31084) and precision-policy change (#31851) all point the same direction: reproducible outputs matter for RL/eval. **Signal:** reproducible sampling is moving from "nice to have" to "blocking for RL pipelines."

**3. Quantization is consolidating, not proliferating.**
vLLM is collapsing Marlin into Humming across INT4/8, FP8, MXFP*, NVFP4. Unsloth is *fixing* existing int8/fp8/NVFP4 paths rather than adding new formats. **Signal:** the format war is largely over; the fight is now kernel coverage per GPU class.

**4. Long-context is a stability risk, not just a capability.**
SGLang GLM-5.3-Flash corrupts after a 1M-token request (#48964); vLLM GB10 truncates past ~2K tokens silently (#62776); Ollama reports long-context hangs. **Signal:** the industry is shipping 1M-context *marketing* before 1M-context *correctness*, especially on edge/NPU hardware.

**5. Silent-correctness bugs are the most dangerous class in production.**
SGLang Qwen3-MoE quantized router never loads → fluent garbage (#49185); llama.cpp speculative decoding diverges on quantized targets (#25618); LiteLLM streaming undercounts usage (#36114) and admits calls past budget (#50125); Ollama gemma4 `toos` typo. **Signal:** eval gating and provider-side billing reconciliation are now mandatory, not optional.

**6. The gateway layer's Rust migration introduces a new risk surface.**
LiteLLM is moving `/v1/messages`, `/v1/responses`, provider resolution, header propagation, and prompt-cache injection to Rust while core Python path bugs remain open. **Signal:** expect transient behavioral drift in param filtering, header passthrough, and prompt-cache semantics during the transition — verify against your own traffic.

**7. Edge/non-NVIDIA hardware is a genuine competitive axis.**
SGLang (Ascend NPU, gfx1250), Ollama (Rockchip NPU, MLX FP8), llama.cpp (RISC-V SpacemiT, Power VXE, Intel Arc), Unsloth (Turing int8, L4 fp8). **Signal:** "runs on my hardware" is now a differentiator the NVIDIA-only engines cannot match, and consumer-GPU bugs (RTX 5060 laptop, RX 6700 XT, Arc B-series, Intel Arc 140V) are proliferating across all local runtimes.

---

### What Agent / Application Developers Should Watch

1. **Pin commits on SM120/SM121 hardware** — vLLM, SGLang, and Ollama all have open Blackwell-class regressions this week.
2. **Do not trust streaming `usage` or `max_budget` through LiteLLM** — reconcile against provider counters; add upstream hard caps (#36114, #50125).
3. **Disable draft-model speculation on quantized targets** in llama.cpp until #25618 is fixed — silent greedy divergence breaks reproducibility.
4. **Re-baseline quality gates** after llama.cpp b12202 (BF16 accumulation change for GLM4-class) and b12211 (`mtmd` refactor) — both are behavior changes, not just perf.
5. **Anchor agent prefix caching** — SGLang RFC #47763 (multi-turn prefix reuse across harnesses) and #48963 (same-batch KV sharing) directly target the TTFT cost that dominates agent loops; these are the highest-leverage forthcoming features for agent developers.
6. **Expect gateway-path drift during LiteLLM's Rust migration** — test `drop_params`, `additional_drop_params`, and provider header passthrough against your own traffic as PRs #45708, #46764, #46788 land.

---

## Per-Project Reports

<details>
<summary><strong>vLLM</strong> — <a href="https://github.com/vllm-project/vllm">vllm-project/vllm</a></summary>

# vLLM Digest — 2026-11-09

## 1. Today's Highlights

No releases in the last 24h, but the issue queue is dominated by two themes: **SM120 (consumer Blackwell / DGX Spark) bring-up pain** across DeepSeek-V4.1-Flash and Qwen3.8-Flash-Next, and a large **batch-invariance (BI) kernel stack** targeting DeepSeek-V4.1 landing as a stacked PR series (#65061–#65069). On the kernel side, the long-running **"Replace Marlin with Humming"** tracking issue (#65560) signals a planned consolidation of quantized GEMM paths across NVIDIA architectures.

## 2. Releases & Breaking Changes

None in the last 24h. Two ongoing compatibility items worth tracking:

- **`llguidance` is an unconditional dependency** and is imported by `from vllm import LLM`, blocking install/import on glibc < 2.31 ([#66345](https://github.com/vllm-project/vllm/issues/66345)).
- **RFC: Remove Group Activation Ordering (`actorder=group`)** for GPTQ WNA16 models — will affect existing quantized checkpoints if merged ([#48148](https://github.com/vllm-project/vllm/issues/48148), closed as stale but referenced).

## 3. New Model & Hardware Support

- **[RFC] ViT Full CUDA Graph** — tracking issue for multimodal models (Qwen3-VL, GLM-V, Kimi K2.5) to capture the full ViT forward in a CUDA graph ([#38175](https://github.com/vllm-project/vllm/issues/38175)).
- **NVIDIA Nemotron 3.5 ASR Streaming (0.6B)** feature request; paired with a scheduler-owned persistent-state primitive for streaming models ([#47455](https://github.com/vllm-project/vllm/issues/47455), [PR #65544](https://github.com/vllm-project/vllm/pull/65544)).
- **Kimi K3.1 at TP8** — split 3/5 of the serving stack (KV cache + attention changes) is in review ([PR #66037](https://github.com/vllm-project/vllm/pull/66037)).
- **ROCm DSv4.1 mono kernels** now read target arch from `FLYDSL_GPU_ARCH` ([PR #66215](https://github.com/vllm-project/vllm/pull/66215)).
- **[RFC] Specialized (MonoKernel) decodes** — proposed standard for hand-fused per-model decode paths in `vllm/models` ([#60904](https://github.com/vllm-project/vllm/issues/60904)).

## 4. Performance & Optimization

- **DeepSeek-V4.1 prefill SWA replay**: replay one row for chunks far from prompt end — 124K prompt in 16K chunks reportedly skips most replay work ([PR #62817](https://github.com/vllm-project/vllm/pull/62817)).
- **Marlin → Humming migration** ([#65560](https://github.com/vllm-project/vllm/issues/65560)): Humming now covers INT4/INT8 GPTQ/AWQ, FP8, MXFP8/6/4, NVFP4 for dense and MoE; Marlin lacks Hopper/Blackwell-specific paths.
- **Attention K/V view caching**: Triton and eager backends re-derive K/V cache views every call — same class of waste as #59534 ([#64572](https://github.com/vllm-project/vllm/issues/64572)).
- **[RFC] Octave KV** — native 3-bit KV cache for AMD GPUs, motivated by Qwen3.8-27B GPTQ W4A16 on 4× RX 7900 XTX ([#59773](https://github.com/vllm-project/vllm/issues/59773)).
- **Arm CPU CI rebalance**: shard P50 was 42.0 / 8.4 / 4.2 min; PR redistributes tests across the three shards ([PR #66414](https://github.com/vllm-project/vllm/pull/66414)).
- **Adaptive DSpark online profiling** needs improvement — startup CUDA-graph replay drifts at high batch sizes ([#52057](https://github.com/vllm-project/vllm/issues/52057)).

## 5. Stability & Regressions

Ranked by severity:

1. **DeepSeek-V4.1-Flash SIGSEGV/correctness on SM120** — extremely low decode throughput with `--enforce-eager`, CUDA graph capture unusable on RTX PRO 6000 Blackwell; paired field report documents a working 1M-context config ([#56892](https://github.com/vllm-project/vllm/issues/56892), [#56700](https://github.com/vllm-project/vllm/issues/56700)). *No fix PR yet; SM120 graph capture is the tracked blocker.*
2. **Qwen3.8-Flash-Next silent truncation on GB10** — prompts beyond ~2048 tokens invisible to the model ([#62776](https://github.com/vllm-project/vllm/issues/62776)). *No fix PR.*
3. **CUBLAS_STATUS_INTERNAL_ERROR / illegal memory access** in Qwen3.8-Flash-Next GDN path with prefix caching on sm_121 ([#54173](https://github.com/vllm-project/vllm/issues/54173)).
4. **b12x attention illegal memory access at first MTP verify step** on v0.33.0, SM120 + NVFP4 MoE + fp8 KV + chunked prefill + prefix caching + MTP spec decode — regression from v0.32.0 ([#65139](https://github.com/vllm-project/vllm/issues/65139)).
5. **"Workspace is locked" AssertionError** in `rocm_fp8_paged_mqa_logits` under high decode concurrency with GLM-5.3-Flash on ROCm ([#64874](https://github.com/vllm-project/vllm/issues/64874), now closed).
6. **GDN/Qwen3-Next decode degeneration** to a repeated token on non-Blackwell GPUs with fp32 SSM cache ([#54308](https://github.com/vllm-project/vllm/issues/54308)).
7. **KV-pool-saturated admission retries** inflate decode TPOT ~2.3× — request for scheduler-level admission backoff ([#64460](https://github.com/vllm-project/vllm/issues/64460)).
8. **Whisper timestamp drift** (~0.5s/segment on audio >30s) — closed, marked unstale ([#32588](https://github.com/vllm-project/vllm/issues/32588)).
9. **`--cpu-offload-gb` (UVA) does not reduce peak device memory** for compressed-tensors WNA16 MoE on XPU ([#57008](https://github.com/vllm-project/vllm/issues/57008)).
10. **MiniMax-M3 broken on non-CUDA** — `MiniMAXGemmaRMSNorm` unconditionally calls FlashInfer CUDA kernels ([#51200](https://github.com/vllm-project/vllm/issues/51200)).

Fix PRs in flight: CPU Mamba2 prefill checkpoint support ([PR #65661](https://github.com/vllm-project/vllm/pull/65661)), CPU Triton backend default ([PR #63366](https://github.com/vllm-project/vllm/pull/63366)), ROCm HIP-init fix in FLA probe ([PR #66434](https://github.com/vllm-project/vllm/pull/66434)), sparse-MLA warmup topk coverage ([PR #53605](https://github.com/vllm-project/vllm/pull/53605)), and sparse NCCL RL update OOM/perf ([PR #66375](https://github.com/vllm-project/vllm/pull/66375)).

## 6. What This Means for Application Developers

- **If you serve DeepSeek-V4.1-Flash on RTX PRO 6000 / DGX Spark class hardware, do not upgrade to v0.33 bindings blindly** — SM120 CUDA graph capture is broken, and the workaround (`--enforce-eager`) has its own throughput penalty. The field report in #56700 is currently the best reference config.
- **Guard long-context prompts on GB10 / Qwen3.8-Flash-Next** until #62776 is resolved: content past ~2K tokens may be silently dropped without an error.
- **Anchor to v0.32.0 if you use MTP speculative decoding + chunked prefill + NVFP4 MoE together** — #65139 is a v0.33 regression on that exact combination.
- **Batch-invariant DeepSeek-V4.1 is arriving shortly** as a full stack (MoE, SWA replay, FlashMLA, tensor-core GEMMs, DSpark spec decode all under BI). If you need deterministic serving for RL, evaluation, or reproducibility-sensitive pipelines, watch PRs [#65061](https://github.com/vllm-project/vllm/pull/65061), [#65064](https://github.com/vllm-project/vllm/pull/65064), [#65065](https://github.com/vllm-project/vllm/pull/65065), [#65066](https://github.com/vllm-project/vllm/pull/65066), [#65067](https://github.com/vllm-project/vllm/pull/65067), [#65068](https://github.com/vllm-project/vllm/pull/65068), [#65069](https://github.com/vllm-project/vllm/pull/65069).
- **For agent/tool-calling stacks**: the Anthropic Messages API still only accepts `Authorization: Bearer`, not `x-api-key` ([#51572](https://github.com/vllm-project/vllm/issues/51572)) — proxy accordingly if you're fronting vLLM as a Claude-compatible endpoint.
- **Structured output installers on older glibc**: `llguidance` is now a hard dependency of `from vllm import LLM` — pin or vendor if you target RHEL 7-era base images ([#66345](https://github.com/vllm-project/vllm/issues/66345)).

</details>

<details>
<summary><strong>SGLang</strong> — <a href="https://github.com/sgl-project/sglang">sgl-project/sglang</a></summary>

# SGLang Digest — 2026-11-09

## Today's Highlights

No new releases in the last 24h, but the project stayed busy: 54 issues and 385 PRs were updated. The most consequential signal is a **regression cluster around DSV4/SM120 hardware** (issues #49173 and #33422) where recent cleanup PRs appear to have dropped Blackwell-class GPUs from optimized kernel paths, producing up to 8x prefill slowdowns. Meanwhile, the PD-disaggregation and SGLang-Diffusion Q4 roadmaps both received fresh updates, and the AMD side contributed a steady stream of kernel-fusion and quantization PRs.

---

## Releases & Breaking Changes

None in the last 24h. Note for planning: PR [#49204](https://github.com/sgl-project/sglang/pull/49204) **removed the `replace` parameter from non-streaming sessions** (streaming sessions already rejected it), with follow-up [#49207](https://github.com/sgl-project/sglang/pull/49207) deferring session close while an unfinished turn still reads its media. Anyone using session APIs should audit for `replace` usage.

---

## New Model & Hardware Support

- **Longcat 2.0 on NPU (arch22)** — new model support for Ascend hardware: [#47917](https://github.com/sgl-project/sglang/pull/47917)
- **HiDream-O1-Image on NPU** — diffusion model support (DEV, DEV-2604, FULL TI2I variants): [#45137](https://github.com/sgl-project/sglang/pull/45137)
- **ComfyUI integration** — offline workflow converter added; weight patches are now rejected on SGLD models to prevent stale-LoRA contamination across prompts: [#48998](https://github.com/sgl-project/sglang/pull/48998)
- **ATen-backed unified memory layout planner** — large refactor stack ([#48014](https://github.com/sgl-project/sglang/pull/48014), [#48011](https://github.com/sgl-project/sglang/pull/48011), [#48012](https://github.com/sgl-project/sglang/pull/48012)) enables serving multiple attention-window sub-pools per runner under `--enable-unified-memory`, previously refused at startup.
- **FlashInfer cuTile NVFP4 MoE** proposed as default runner on SM12x (RTX 50xx / RTX PRO Blackwell): [#49123](https://github.com/sgl-project/sglang/issues/49123)

---

## Performance & Optimization

- **AMD DSA KV cache default to fp8_e4m3 on gfx950** — MI355X reports capability 9.5 and was falling back to bf16; this PR changes the auto-resolution so DeepSeek-V3.2/GLM-5.x get fp8 KV cache by default on ROCm: [#48996](https://github.com/sgl-project/sglang/pull/48996)
- **Fused fp8 quantization into vectorized_5d KV-cache writes** — collapses four elementwise launches per layer into the write kernel: [#48405](https://github.com/sgl-project/sglang/pull/48405)
- **Fused QK-norm + RoPE + KV write for `vectorized_5d` layout in Qwen3** — extends the existing aiter fused kernel to the 5D layout (previously NHD-only): [#48406](https://github.com/sgl-project/sglang/pull/48406)
- **MiniMax-M3.1 decode indexer CP on Hopper** — enables the SM90 gate at `--tp 8 --attn-dp-size 2`, targeting the H200 high-throughput recipe (~58 concurrent 128K requests): [#49088](https://github.com/sgl-project/sglang/pull/49088)
- **Mixed W4A8 MoE on gfx1250** — configurable threshold switching between Gluon (low token counts) and FlyDSL (high) based on per-layer profiling: [#47398](https://github.com/sgl-project/sglang/pull/47398)
- **Unified FP32 activation functions in `sgl_kernel/activation.cuh`** — single implementation per activation with a `kFastMath` switch plus `silu_fast`: [#48942](https://github.com/sgl-project/sglang/pull/48942)
- **HiCache Mamba host pool sizing** — new `--hicache-mamba-size-gb` flag to pin the Mamba/KDA host pool, fixing host-KV hits that missed their checkpoints on hybrid models: [#47867](https://github.com/sgl-project/sglang/pull/47867)

---

## Stability & Regressions

Ranked by severity:

1. **SM120/SM121 dropped from DSV4.1 DeepGEMM indexer gates — 8x prefill regression on GB10.** PR #48399 replaced a `is_sm100_or_newer()` check with a strict `is_sm(10)` check, evicting GB10/RTX PRO Blackwell from the fast path; the torch fallback calls `tolist()` per layer. **Highest impact item today.** No fix PR linked yet: [#49173](https://github.com/sgl-project/sglang/issues/49173)
2. **GLM-5.3-Flash engine state corruption after a 1M-token request on v0.5.23** — MTP accept rate collapses to 0.00 and all subsequent requests degenerate; v0.5.22 is clean. Bisect window is a single release: [#48964](https://github.com/sgl-project/sglang/issues/48964)
3. **Qwen3-MoE router stored quantized (compressed-tensors) is never loaded — server silently returns garbage.** Silent-correctness class bug, no error raised: [#49185](https://github.com/sgl-project/sglang/issues/49185)
4. **Full prefill CUDA graph capture fails for hybrid linear attention models** (`HybridLinearAttnBackend._replay_metadata` IndexError) with `--cuda-graph-config '{"prefill": {"backend": "full"}}'`: [#48593](https://github.com/sgl-project/sglang/issues/48593)
5. **Breakable prefill CUDA graph produces divergent logprobs vs eager** for short prefills padded to a capture bucket (Qwen3.8-27B-NVFP4, hybrid GDN, v0.5.23): [#49133](https://github.com/sgl-project/sglang/issues/49133)
6. **GB10 unified memory exhaustion on >40k-token prefills** — worker rank dies silently with no traceback or OOM record; cross-stack control passes at 54k, failure between 54k–62k: [#36941](https://github.com/sgl-project/sglang/issues/36941)
7. **LoRA adapters with `use_rslora=True` served with wrong scale**: [#40835](https://github.com/sgl-project/sglang/issues/40835)

Closed-as-inactive in the last 24h (may warrant re-filing if still reproducible): DeepSeek-V4 TP=8 245K-context decode hang ([#33549](https://github.com/sgl-project/sglang/issues/33549)), Kimi-K3 `tool_choice=required` ReadTimeout ([#37430](https://github.com/sgl-project/sglang/issues/37430)), Hunyuan-V4 all-to-all MoE computing 1 token in `attn_tp_size` ([#38606](https://github.com/sgl-project/sglang/issues/38606)), and diffusion CPU-offload drops on fallback loading ([#34772](https://github.com/sgl-project/sglang/issues/34772)).

---

## What This Means for Application Developers

- **If you run Blackwell workstation/server GPUs (SM120/SM121), pin to a known-good commit before #48399** or wait for the indexer-gate fix. Prefill throughput on DeepSeek-V4-class models is materially affected.
- **Avoid v0.5.23 for long-context GLM-5.3-Flash workloads with EAGLE speculative decoding** until #48964 is resolved — the failure is persistent across the engine's lifetime, not per-request.
- **Audit Qwen3-MoE deployments using compressed-tensors quantized routers** — this failure mode is silent (fluent garbage), which makes it dangerous in production without eval gating.
- **Session API consumers**: the `replace` parameter removal (#49204/#49207) is a behavioral change worth grepping for; media lifetime semantics on session close also changed.
- **Agent workloads**: RFC [#47763](https://github.com/sgl-project/sglang/issues/47763) on keeping multi-turn agent prefixes cacheable across harnesses (Codex CLI, pi, etc.) is worth tracking — it directly targets the TTFT cost that dominates agent loops. Related: [#48963](https://github.com/sgl-project/sglang/issues/48963) proposes sharing a prompt's KV among same-batch admitted requests, which would help fan-out/beam patterns.
- **Sessions + streaming**: #49207 confirms the project is actively hardening session teardown against in-flight reads — if you've seen truncated media in multi-turn streaming, upgrade once merged.

</details>

<details>
<summary><strong>llama.cpp</strong> — <a href="https://github.com/ggml-org/llama.cpp">ggml-org/llama.cpp</a></summary>

# llama.cpp Digest — 2026-11-09

## 1. Today's Highlights

Release velocity remains extreme: ten builds (b12199–b12211) landed in 24 hours, spanning a multimodal refactor, CPU/GPU kernel work, and speculative-decoding correctness fixes. The most consequential change today is the removal of `clip.h` in favor of a consolidated `mtmd` code path (#31865), which touches the multimodal stack that vision and audio models depend on. In parallel, two long-running correctness threads — greedy divergence under quantized speculative decoding (#25618) and a qwen4exp MTP server assert (#31914) — saw activity, with the latter closed.

---

## 2. Releases & Breaking Changes

- **b12211 — `mtmd` consolidation** ([#31865](https://github.com/ggml-org/llama.cpp/pull/31865)): `clip.h` is removed and its functionality folded into `mtmd`. Anyone building against the C API headers for multimodal support should expect include-path changes. This is the headline refactor of the day.
- **b12202 — precision policy change** ([#31851](https://github.com/ggml-org/llama.cpp/pull/31851)): `llama`/`mtmd` now mirror reference precision for `ggml_prec_set_acc` — GLM4 (and similar) down/output projections move from F32 accumulation to `GGML_PREC_BF16`. Numerically this is a behavior change, not just a speed tweak; regression-sensitive deployments should re-baseline outputs.
- No deprecations of CLI flags or server config keys today.

## 3. New Model & Hardware Support

- **SpacemiT IME2 MXFP4 dense repack on CPU** ([#31776](https://github.com/ggml-org/llama.cpp/pull/31776)): RISC-V SpacemiT hardware gains a dense MXFP4 repack path. Niche but notable for embedded/edge RISC-V inference.
- **VXE (Vector Extension) bf16 + q8_0 for llamafile** ([#31866](https://github.com/ggml-org/llama.cpp/pull/31866)): IBM-authored support extends the Power/Vector path for bf16 and q8_0 kernels.
- **CUDA SSM `d_state=64` fast path** ([#31818](https://github.com/ggml-org/llama.cpp/pull/31818)): Zamba2 and similar SSM/hybrid architectures previously fell back to CPU on every recurrent scan step because their state size (64) was outside the existing 96/128/256 fast paths. This is the most directly model-enabling change in today's batch.
- **Mellum2.1 MTP support** ([#30612](https://github.com/ggml-org/llama.cpp/pull/30612), closed): `graph_mtp` implementation plus converter support for `--no-mtp`.
- **External PLE/engram file loading** ([#31185](https://github.com/ggml-org/llama.cpp/pull/31185), open): new `--shard` argument allows loading PLE files from a separate GGUF, with conversion support for PLE-less and PLE-only artifacts.

## 4. Performance & Optimization

- **MoE expert upload stream (CUDA)** ([#31850](https://github.com/ggml-org/llama.cpp/pull/31850), open): optional dedicated CUDA stream for host-to-device expert copies in MoE models, gated behind `GGML_CUDA_UPLOAD_STREAM=1` with diagnostic counters. Includes an event-lifetime fix.
- **CUDA/Metal radix Top-K determinism** ([#31084](https://github.com/ggml-org/llama.cpp/pull/31084), merged → b12208): tied selections in Top-K are now deterministic (earliest tie wins via contiguous slices). This is a reproducibility win as much as a kernel change.
- **MoE cache CPU/GPU independence** ([#31888](https://github.com/ggml-org/llama.cpp/pull/31888)): the CPU part no longer waits on cached experts.
- **RPC loading 5× faster** ([#29413](https://github.com/ggml-org/llama.cpp/pull/29413), open): DeepSeek-V4-Flash (145.6 GiB) over 2× DGX Spark RDMA, cold page cache — reported 5× `load_tensors` speedup. Significant for multi-node inference.
- **OpenCL q8_0 / small-n MoE GEMV for spec decode** ([#31831](https://github.com/ggml-org/llama.cpp/pull/31831)): Qualcomm-authored; targets the small-batch verification step.
- **H100 Q6_K prefill (TMA + WGMMA)** ([#31916](https://github.com/ggml-org/llama.cpp/pull/31916), closed): Hopper-specific dense quant prefill using Tensor Memory Accelerator and warp-group MMA.
- **Backend grammar sampling** ([#31912](https://github.com/ggml-org/llama.cpp/pull/31912), open): token mask precomputed on CPU, applied on GPU — removes a CPU sampling bottleneck for grammar-constrained generation.
- **IQ2 creation speedup** ([#31910](https://github.com/ggml-org/llama.cpp/pull/31910)): byte-identical output, validated across 8 models/5 architectures.

## 5. Stability & Regressions

Ranked by severity:

1. **Speculative decoding diverges from vanilla on quantized targets** ([#25618](https://github.com/ggml-org/llama.cpp/issues/25618), open, 39 comments): Under greedy sampling (`temperature=0`, `top_k=1`), draft-model speculation produces different text than non-speculative runs when the *target* is quantized (e.g. Q4_K_M); bf16 targets match. Ngram speculation on the same quantized target behaves correctly. This is a silent correctness issue — the highest-severity item on the board. No fix PR referenced yet.
2. **qwen4exp + `--spec-type draft-mtp` aborts** ([#30860](https://github.com/ggml-org/llama.cpp/issues/30860) open; [#31914](https://github.com/ggml-org/llama.cpp/issues/31914) closed): `GGML_ASSERT(buffer)` in `llm_graph_input_kpool::set_input` at server start, and a related assert in `llama_kv_cache::set_input_k_idxs`. A closed duplicate suggests partial resolution, but the original remains open.
3. **Cancelled embedding request never released** ([#31704](https://github.com/ggml-org/llama.cpp/issues/31704)): after a cancelled long embedding, the server serves nothing while `/health` still reports OK. Server-level liveness bug.
4. **Sticky NaN in recurrent state** ([#31913](https://github.com/ggml-org/llama.cpp/pull/31913), open fix): reset logic multiplies by zero instead of writing zero, so a single NaN persists forever. Manifests on Qwen3.8-flash-next over RPC with q8 K/V cache. Fix PR exists and is the correct remediation.
5. **Vulkan output corruption on Intel Arc B-series** ([#31828](https://github.com/ggml-org/llama.cpp/issues/31828), open): persists under long-context/RAG prompts even with `GGML_VK_DISABLE_COOPMAT`. Different from the earlier VAE/VRAM issue ([#24943](https://github.com/ggml-org/llama.cpp/issues/24943)).
6. **SYCL AOT garbage output on >4 GB models** ([#31685](https://github.com/ggml-org/llama.cpp/issues/31685)): `arl-h` arch produces `GGGG...` tokens; worked around by a buffer size flag.
7. **cache_reuse disabled for multimodal (Qwen-VL)** ([#31700](https://github.com/ggml-org/llama.cpp/issues/31700)): prompt cache reuse regression affecting any multimodal model.
8. **Streaming responses close connections despite Keep-Alive** ([#29680](https://github.com/ggml-org/llama.cpp/issues/29680) open; [#31863](https://github.com/ggml-org/llama.cpp/issues/31863) closed as duplicate): pooled HTTP clients see "response ended prematurely." Relevant to anyone using `httpx`/`undici` connection pooling.
9. **Tool-call argument order enforcement** ([#30193](https://github.com/ggml-org/llama.cpp/pull/30193), open): Qwen3-Coder/Nemotron grammars force declared JSON key order, causing dropped fields. Fix makes any order acceptable — worth tracking if you run these models.
10. **Stale gallocr plan after OUTPUT flag change** ([#29313](https://github.com/ggml-org/llama.cpp/issues/29313), closed): corrupted EAGLE-3 draft candidates; resolved.

## 6. What This Means for Application Developers

- **Re-test greedy determinism if you run quantized targets with draft-model speculation.** #25618 is unresolved and produces silent output divergence at `temperature=0`. If your eval harness or agent relies on reproducible sampling, either disable draft speculation on quantized targets or pin to bf16 targets until fixed.
- **The `mtmd` refactor (b12211) and precision change (b12202) are the two updates most likely to affect you.** If you build against llama.cpp headers for multimodal embedding, rebase your include paths. If you use GLM4-family models, expect output changes from the BF16 accumulation switch — re-validate quality gates.
- **Server long-running reliability warrants attention.** #31704 (cancelled embedding locks the server while health checks pass) and #29680/#31863 (connection closed mid-stream despite Keep-Alive) both hit production-style workloads: cancellation semantics and HTTP client pooling. If you run llama-server behind a pool, verify your client retries idempotent requests.
- **Throughput headroom is arriving in specific niches.** RPC load times (5× on DGX Spark, #29413), Hopper Q6_K prefill (#31916), backend grammar sampling (#31912), and MoE expert upload stream (#31850) are all in flight. Grammar-constrained agents and multi-node MoE serving stand to gain most.
- **If you run Zamba2 or SSM hybrids on CUDA, this build fixes a silent CPU fallback** ([#31818](https://github.com/ggml-org/llama.cpp/pull/31818)) that was capping decode throughput — worth upgrading for that alone.

</details>

<details>
<summary><strong>Ollama</strong> — <a href="https://github.com/ollama/ollama">ollama/ollama</a></summary>

# Ollama Digest — 2026-11-09

## 1. Today's Highlights

No releases in the last 24h, but the issue and PR queues were active. The most consequential threads: a KV-cache VRAM prediction bug that causes unnecessary runner evictions ([#19327](https://github.com/ollama/ollama/pull/19327)), a long-standing request for per-model concurrency (`num_parallel`) that now has an open PR ([#9546](https://github.com/ollama/ollama/pull/9546)), and a reported performance/stability regression on RTX 5060 Laptop after a recent update ([#19537](https://github.com/ollama/ollama/issues/19537)). New backend work also landed in the queue for Rockchip NPUs ([#19480](https://github.com/ollama/ollama/pull/19480)).

## 2. Releases & Breaking Changes

- **No new releases in the last 24h.** No migration or API breaking changes to report today.
- Note: `ollama -v` / `--version` now emits "Warning: could not connect to a running Ollama instance" text, which is noisy for scripting ([#19613](https://github.com/ollama/ollama/issues/19613)). Watch this if you parse version output in CI.

## 3. New Model & Hardware Support

- **Rockchip NPU (RK3588 / RK3576) backend** — new `rocket`/`rknpu` backend targeting prefill offload (`GGML_OP_MUL_MAT`, MoE `MUL_MAT_ID`, `FLASH_ATTN_EXT`) while keeping decode on CPU; standard GGUF models supported ([#19480](https://github.com/ollama/ollama/pull/19480)).
- **Ornith / Qwen3.5 renderer and parser auto-detection** — fixes tool-call rendering when `ornith-1.5:35b` or `qwen35`/`qwen35moe` models are loaded without an explicit renderer/parser, avoiding the `gguf_chat_template` native-mode path that mis-renders `tools` + other fields ([#17965](https://github.com/ollama/ollama/pull/17965)).
- **FP8 import for MLX / create path** — per-tensor FP8 is now supported and block FP8 import is lossless (no more re-quantization to mxfp8); expert stacking is now consistent across all MoE source types ([#19614](https://github.com/ollama/ollama/pull/19614)).
- **GGUF validation hardening** — reject duplicate tensor names ([#19571](https://github.com/ollama/ollama/pull/19571)) and non-power-of-2 alignment values ([#19610](https://github.com/ollama/ollama/pull/19610)), both currently passing silently and failing later at load/inspect time.
- **Image generation models are explicitly unsupported** — `ollama run x/flux2-klein` on macOS fails with "image generation models are not currently supported" ([#19615](https://github.com/ollama/ollama/issues/19615), closed).

## 4. Performance & Optimization

- **KV cache VRAM prediction fix (open PR)** — `PredictServerVRAM` currently sizes every layer with the smallest `head_count_kv` and a uniform head size, causing large over-estimates for models with heterogeneous layers; the scheduler then evicts runners "to make room the load never needs." PR sizes the KV cache per layer ([#19327](https://github.com/ollama/ollama/pull/19327)).
- **Buffer-line deduplication within a load** — `memoryParsingWriter` previously dropped repeated keys within a single load (mmapped weights + MoE experts share keys), producing wrong memory readings; PR aggregates repeated buffer lines ([#19324](https://github.com/ollama/ollama/pull/19324)).
- **Per-model `num_parallel`** — open PR adds `num_parallel` as a Modelfile/parameter (like `num_ctx`), avoiding the current behavior where a single parallel-3 model triples the KV reservation for every model on the server. Addresses [#8842](https://github.com/ollama/ollama/issues/8842) and the long-standing [#5693](https://github.com/ollama/ollama/issues/5693) / [#11977](https://github.com/ollama/ollama/issues/11977) ([#9546](https://github.com/ollama/ollama/pull/9546)).
- **Modelfile-configured env vars** — `PARAMETER env` lets llama-server environment variables be set per model instead of server-wide ([#16711](https://github.com/ollama/ollama/pull/16711)).
- **`num_predict == -2`** — aligns with llama.cpp to fill the context buffer dynamically rather than a static cap ([#9547](https://github.com/ollama/ollama/pull/9547)).
- **Cosmetic:** `HumanNumber` unit-boundary rounding now promotes correctly (999.5K → 1M, not 1000K) ([#19500](https://github.com/ollama/ollama/pull/19500), [paired closed PR #19499](https://github.com/ollama/ollama/pull/19499)).

## 5. Stability & Regressions

Ranked by severity:

1. **Post-update regression on RTX 5060 Laptop (8 GB VRAM, 15.4 GB RAM)** — user reports a recent version is "worse" after update: higher resource usage and more rigid behavior with `ministral-3:14b-instruct` ([#19537](https://github.com/ollama/ollama/issues/19537), open, 7 comments). No fix PR referenced.
2. **AMD Radeon 780M Vulkan regression since ≥0.32.10** — `vk::Queue::submit: ErrorDeviceLost` / "Not enough memory for command submission" on larger models; same hardware/config works on earlier versions ([#17748](https://github.com/ollama/ollama/issues/17748), open, 👍 3). No fix PR referenced.
3. **Proxy 403 on `ollama pull`** — RHEL 9.2 behind a Blue Coat corporate proxy gets `403` on pull via the systemd service even though `curl` succeeds; likely proxy/CA passthrough handling ([#19604](https://github.com/ollama/ollama/issues/19604), open).
4. **`gemma4:12b-it-qat` Modelfile typo** — `toos` instead of `tools` in official model metadata. Now closed ([#19596](https://github.com/ollama/ollama/issues/19596)); if you relied on tool support from this tag, re-pull.
5. **Version-command noise** — `-v/--version` emits connection warnings, breaking clean scripted version checks ([#19613](https://github.com/ollama/ollama/issues/19613), open).

Also worth noting for edge deployments: an open idea for optional physics/bounds validation of tool-call arguments for offline agents ([#19606](https://github.com/ollama/ollama/issues/19606)).

## 6. What This Means for Application Developers

- **Concurrency budgeting will get better, but plan for today's behavior.** Until per-model `num_parallel` lands ([#9546](https://github.com/ollama/ollama/pull/9546)), `OLLAMA_NUM_PARALLEL` reserves parallel context for *every* loaded model. If you co-host an embedding model and a chat model, isolate them on separate server instances.
- **Memory-pressure evictions may be a phantom.** If you see models being unloaded under apparent VRAM pressure on mixed-layer architectures (MoE, varied KV head counts), it may be the prediction bug in [#19327](https://github.com/ollama/ollama/pull/19327), not genuine OOM. Worth validating against your own `nvidia-smi`/backend logs before right-sizing hardware.
- **Tool-calling on Qwen3.5/Ornith: pin your manifests.** Until [#17965](https://github.com/ollama/ollama/pull/17965) merges, load these with an explicit renderer/parser rather than relying on auto-detection.
- **Set explicit `OLLAMA_LOAD_TIMEOUT`.** The default 5 minutes bites interactive chat workflows where a long back-and-forth exceeds the idle window before the next request ([#19616](https://github.com/ollama/ollama/issues/19616)). A configurable timeout via Modelfile/env would be low-cost to add — track that request.
- **Don't parse `ollama -v` output.** Version commands currently print warnings first ([#19613](https://github.com/ollama/ollama/issues/19613)).
- **Corporate proxied environments:** verify `HTTPS_PROXY`, `NO_PROXY`, and CA bundle visibility *inside the systemd unit* before blaming the model registry; `curl` success at the shell does not prove the service has the same env ([#19604](https://github.com/ollama/ollama/issues/19604)).

*Source data: github.com/ollama/ollama, captured 2026-11-09. No release artifacts in the last 24h; all items above are issues/PRs updated in that window.*

</details>

<details>
<summary><strong>LiteLLM</strong> — <a href="https://github.com/BerriAI/litellm">BerriAI/litellm</a></summary>

# LiteLLM Digest — 2026-11-09

## 1. Today's Highlights

LiteLLM shipped `v1.110.0-dev.2` (Docker images now cosign-signed against commit `e82a3c6`), while the Rust-backed inference bridge continued its rapid land-grab: a large batch of PRs from the `yujonglee-berri` branch is progressively moving `/v1/messages`, `/v1/responses`, provider resolution, header propagation, and prompt-cache injection from Python into native Rust. Stability chatter remains dominated by **streaming usage undercounting** and **budget-enforcement overruns**, both of which have open issues but no merged fix yet.

---

## 2. Releases & Breaking Changes

- **v1.110.0-dev.2** — Docker images now signed with cosign; verification key introduced in commit [`e82a3c6`](https://github.com/BerriAI/litellm/commit/e82a3c646908ba0a6ee0beddc4310d7a6cac4065).
- ⚠️ **Release/artifact drift (recurring)**: GHCR images `v1.94.1` and `v1.95.0` have no matching git tag or GitHub Release ([#35683](https://github.com/BerriAI/litellm/issues/35683), [#35684](https://github.com/BerriAI/litellm/issues/35684)) — closed as stale, but the pattern indicates supply-chain hygiene gaps. Audit pinned image tags before upgrading.
- No public-facing config schema changes landed in the last 24h.

---

## 3. New Model & Hardware Support

- **Kitani** — new OpenAI-compatible provider added for open-weight models, removing the need to fake `openai/` + custom `api_base` ([PR #50656](https://github.com/BerriAI/litellm/pull/50656)).
- **Xiaomi MiMo-V2-Pro / MiMo-V2-Omni** — `output_config` parameter compatibility issue with Claude Code is now closed ([#24549](https://github.com/BerriAI/litellm/issues/24549)).
- **Z.AI GLM-5.2 `[1m]` variant** still returns `Unknown Model` on the coding endpoint despite docs ([#32218](https://github.com/BerriAI/litellm/issues/32218)).
- **GitHub Copilot native Messages** support in flight via Python-resolved sessions handed to Rust ([PR #45701](https://github.com/BerriAI/litellm/pull/45701)).
- **LocalAI** provider request remains open since 2024 ([#1443](https://github.com/BerriAI/litellm/issues/1443)).

---

## 4. Performance & Optimization

- **Rust bridge CI caching** — `rust-bridge` composite action reuses the compiled extension across ~20 `uv sync` jobs, eliminating redundant Cargo builds on non-Rust commits ([PR #46442](https://github.com/BerriAI/litellm/pull/46442)); retry-loop removal proposed separately ([PR #46460](https://github.com/BerriAI/litellm/pull/46460), `risk:high`).
- **Rate-limiter Redis write skip** — skip post-call counter writes when no limits are configured; meaningful at high throughput where the writes are pure waste ([#31880](https://github.com/BerriAI/litellm/issues/31880)).
- **Accounting flush scan cost** — `AccountingDeliveryRepository.metrics()` was scanning all retained `LiteLLM_SpendLogDelivery` rows on every flush; closed ([#50475](https://github.com/BerriAI/litellm/issues/50475)).
- **Native prompt-cache injection** for `/v1/messages` wired into Rust, with savings metadata stamped through ([PR #47284](https://github.com/BerriAI/litellm/pull/47284)).
- **Rust param filtering** now uses Python's `Messages`/`Responses` rules, keeping `drop_params`/`additional_drop_params` requests on the Python path but preventing silent loss of `reasoning_effort` and `service_tier` ([PR #46764](https://github.com/BerriAI/litellm/pull/46764), [PR #46788](https://github.com/BerriAI/litellm/pull/46788)).
- **Provider header propagation** through Rust core/gateway preserves upstream diagnostics in JSON, SSE and error bodies ([PR #45708](https://github.com/BerriAI/litellm/pull/45708)).

---

## 5. Stability & Regressions

Ranked by severity:

1. **Streaming usage severely undercounted (provider-independent)** — chained proxy (Front → Upstream → Bedrock) drops usage in final chunk; root cause identified in stream aggregation, not provider transformation ([#36114](https://github.com/BerriAI/litellm/issues/36114)). **Billing-impacting, no fix PR.**
2. **`max_budget` admits calls after spend crossed it** — a $0.0045 budget key admitted 11 calls totaling $0.00496 (+10.3%); race in pre-check before cost known ([#50125](https://github.com/BerriAI/litellm/issues/50125)). **Correctness/billing, no fix PR.**
3. **HTTP 200 + unparseable body raised as 500/opaque APIError** — callers retry already-billed requests; hides usage ([#49793](https://github.com/BerriAI/litellm/issues/49793)).
4. **`/v1/messages` 503 "auth DB unreachable" on plain upstream failure** — wrong error class; `/v1/chat/completions` returns correct status ([#49998](https://github.com/BerriAI/litellm/issues/49998), closed).
5. **`/v1/responses` streaming drops text** when a single upstream chunk contains both `reasoning_content` and `content` ([#36327](https://github.com/BerriAI/litellm/issues/36327)).
6. **Bedrock `/v1/messages` detached-drain abort leaks httpx response** — upstream keeps generating after abort, connection never closed ([#50514](https://github.com/BerriAI/litellm/issues/50514)).
7. **Retry loop ignores caller timeout** — `x-litellm-timeout` bounds each attempt only; retries + `Retry-After` sleeps exceed total budget ([#49751](https://github.com/BerriAI/litellm/issues/49751), closed).
8. **`/cursor/chat/completions` 500 on every streaming request** — `cursor_data_generator()` kwarg mismatch ([#35632](https://github.com/BerriAI/litellm/issues/35632), closed).
9. **`Router(cache_responses=True, cache_kwargs={'type':'disk'})` silently falls back to in-memory** without Redis ([#36309](https://github.com/BerriAI/litellm/issues/36309)).
10. **`ModelNotMappedError` in `litellm/utils.py`** ([#47922](https://github.com/BerriAI/litellm/issues/47922)).
11. **Windows wheel ships tiktoken caches with CRLF**, forcing network access on `import litellm` ([#41855](https://github.com/BerriAI/litellm/issues/41855)).
12. **Phoenix callback duplicates LLM spans**, causing double pricing per call ([#50649](https://github.com/BerriAI/litellm/issues/50649)).
13. **Security (fix PRs open)**: credentialed SSRF risk in Gemini Veo `video.uri` download (fail-closed on off-origin) ([PR #36340](https://github.com/BerriAI/litellm/pull/36340)); same-origin assertion for Replicate prediction poll URLs ([PR #36343](https://github.com/BerriAI/litellm/pull/36343)); MCP OAuth clients now bound to upstream issuer ([PR #37777](https://github.com/BerriAI/litellm/pull/37777), closed).

---

## 6. What This Means for Application Developers

- **Do not rely on `usage` from streaming responses through chained proxies.** Reconcile bills against provider-side counters until [#36114](https://github.com/BerriAI/litellm/issues/36114) closes; over-counting on retries is likely.
- **Budget enforcement is soft.** If you gate spend-sensitive workloads on `max_budget`, add an upstream hard cap — [#50125](https://github.com/BerriAI/litellm/issues/50125) shows overruns on bursty traffic.
- **Set timeouts defensively at the transport layer** if you use `x-litellm-timeout`; the proxy's retry logic can multiply wall-clock latency beyond your budget ([#49751](https://github.com/BerriAI/litellm/issues/49751)).
- **Claude Code / Codex / Cursor users**: check the open `/cursor` and `/v1/messages` issues before routing agent traffic through these endpoints; several are endpoint-fatal.
- **Native Rust path is becoming the default** — if you depend on `drop_params`, custom param filtering, or provider header passthrough, verify behavior against the new bridge as PRs land ([#45708](https://github.com/BerriAI/litellm/pull/45708), [#46764](https://github.com/BerriAI/litellm/pull/46764), [#46788](https://github.com/BerriAI/litellm/pull/46788)).
- **Pin Docker images by digest** and verify cosign signatures, but cross-check that the image tag has a corresponding git release — tag drift has occurred repeatedly ([#35683](https://github.com/BerriAI/litellm/issues/35683), [#35684](https://github.com/BerriAI/litellm/issues/35684)).

</details>

<details>
<summary><strong>Unsloth</strong> — <a href="https://github.com/unslothai/unsloth">unslothai/unsloth</a></summary>

# Unsloth Digest — 2026-11-09

## 1. Today's Highlights

No new releases landed in the last 24h, but the maintainer (danielhanchen) merged/closed a large batch of Studio inference PRs centered on memory foot-print, Triton kernel correctness, and quant path coverage. The bulk of the day's engineering effort went into cutting redundant host/device copies in diffusion post-processing, GGUF/NVFP4 dequant, and VAE tiling, plus widening int8 and fp8 support to more GPU classes. Separately, a wave of community UX bugs landed against Unsloth Studio's Settings → Appearance pickers, with two fix PRs already open.

## 2. Releases & Breaking Changes

None. No new releases, no API/config breaking changes announced in the window.

## 3. New Model & Hardware Support

- **INT8 on Turing (sm75/T4)** — Studio no longer refuses `transformer_quant="int8"` on T4 and other Turing GPUs. Refusal stemmed from `dense_transformer_supported`, now bypassed. [PR #17167](https://github.com/unslothai/unsloth/pull/17167)
- **fp8 denoisers on sm_89 (L4)** — FLUX.3 klein with an fp8 transformer no longer hangs on first render under CUDA graph replay (torch < 2.12). [PR #17166](https://github.com/unslothai/unsloth/pull/17166)
- **FLUX.3 on fp16-only GPUs** — bf16 weights are now kept as stored and computed per-layer in float32, avoiding full float32 weight materialisation on T4/Turing. [PR #17173](https://github.com/unslothai/unsloth/pull/17173)
- **ROCm regression reported (not fixed)** — `unsloth-rocm` Docker on gfx1031 (RX 6700 XT) passes the RDNA 2 startup check then PyTorch segfaults on the first GPU op. [Issue #17147](https://github.com/unslothai/unsloth/issues/17147)
- **Intel Arc 140V** — image generation models fail to load on the Unsloth desktop app. [Issue #17137](https://github.com/unslothai/unsloth/issues/17137)

## 4. Performance & Optimization

Diffusion/Studio inference — all merged as CLOSED PRs:

- **MiniMax-H3 VAE** — batched decoder tiles are stitched into the frame as they arrive, avoiding whole-batch retention and one full extra frame allocation. [PR #17097](https://github.com/unslothai/unsloth/pull/17097)
- **Sol-H3 VAE** — window masks are now decided from geometry and each RoPE table is built once per decode; removes 192 device→host reads per 37-latent decode. [PR #17100](https://github.com/unslothai/unsloth/pull/17100)
- **Image postprocess** — `uint8_hwc` now converts row strips with a single float32 copy each, instead of materialising a full float32 batch. [PR #17091](https://github.com/unslothai/unsloth/pull/17091)
- **Upscaler** — seam normalisation and uint8 finalisation performed in place on the host result; extra full-size planes eliminated. [PR #17083](https://github.com/unslothai/unsloth/pull/17083)
- **GGUF** — K-quant and legacy weights are cast to bf16 in their own buffer, avoiding simultaneous fp16+bf16 copies of each linear weight. [PR #17080](https://github.com/unslothai/unsloth/pull/17080)
- **NVFP4** — protected branch no longer recompiles on the second identical call; cold decode-table compilation fixed and fp16 inputs accepted. [PR #17081](https://github.com/unslothai/unsloth/pull/17081)
- **int8 GEMV** — wide scale groups now tile inside shared memory; a grouped-layer miss no longer demotes per-row Linears for the whole card. [PR #17106](https://github.com/unslothai/unsloth/pull/17106)
- **int8 GEMM** — unlisted-card race switch is re-read per call rather than latched at first compile. [PR #17084](https://github.com/unslothai/unsloth/pull/17084)
- **VAE + MOSS Triton kernels** — all nine launches in `diffusion_vae_fused.py` now target the input's own CUDA device instead of the thread's current device. [PR #17099](https://github.com/unslothai/unsloth/pull/17099)
- **FSDP2 save** — writer composition now works across *equal* (not only identical) TP × FSDP2 meshes, fixing reload/second-model/notebook re-run cases. [PR #17158](https://github.com/unslothai/unsloth/pull/17158)

In progress:

- **Constant / `constant_with_warmup` LR schedulers** exposed on the Studio LLM training page — UI-only change. [PR #17168](https://github.com/unslothai/unsloth/pull/17168)

## 5. Stability & Regressions

Ranked by severity:

1. **CPU pipeline-parallel MoE correctness** — with `UNSLOTH_FORCE_CPU=1`, MoE router aux loss diverges from single-process once gradient accumulation > 1; reproducer is the repo's own parity test. HIGH — affects training correctness. [Issue #17054](https://github.com/unslothai/unsloth/issues/17054)
2. **ROCm segfault on gfx1031** — startup check passes, then hard crash on first GPU op. HIGH — no fix PR yet. [Issue #17147](https://github.com/unslothai/unsloth/issues/17147)
3. **Managed account invalid HF token** — Studio web UI managed accounts can't authenticate. MEDIUM — no fix PR. [Issue #17156](https://github.com/unslothai/unsloth/issues/17156)
4. **Intel Arc 140V image model load failure** — desktop app. MEDIUM. [Issue #17137](https://github.com/unslothai/unsloth/issues/17137)
5. **Chat template crash on tool-call datasets** — `datasets` fills `tool_calls: None` on plain rows; `llama-3.1` and `gpt-oss` templates raise `TypeError`/`UndefinedError`. Fix PRs open. [PR #17176](https://github.com/unslothai/unsloth/pull/17176) · [PR #17175](https://github.com/unslothai/unsloth/pull/17175)
6. **Studio Settings UX** — palette/glass/background pickers dismiss on first pick; glass material exposed twice under two names. Fix PRs open: [PR #17164](https://github.com/unslothai/unsloth/pull/17164) (palette, #17161/#17162), [PR #17170](https://github.com/unslothai/unsloth/pull/17170) (remaining pickers, #17169). Related open: [#17163](https://github.com/unslothai/unsloth/issues/17163) composer settings split across tabs.
7. **Model size mismatch** between Model Hub and Model Picker in desktop app. LOW. [Issue #17074](https://github.com/unslothai/unsloth/issues/17074)
8. **Video upload capped at 64 MB** for vision models — feature request to raise. LOW. [Issue #17062](https://github.com/unslothai/unsloth/issues/17062)

Also closed: Multi-LoRA fine-tuning pagination race during batch starts ([PR #16836](https://github.com/unslothai/unsloth/pull/16836)).

## 6. What This Means for Application Developers

- **If you run Studio on older GPUs (T4, Turing, L4, or non-sm80 cards), today materially improves your life** — int8 no longer refused on Turing, fp8 denoisers no longer hang on L4, and FLUX.3 works on fp16-only cards without doubling weights to float32. Worth re-testing previously failing configs.
- **Don't rely on diffusion/int8 quant paths for exact reproducibility across hardware** — several of today's fixes (int8 GEMV grouped-layer demotion, GEMV race switch, NVFP4 protected-branch recompile) change which kernel config gets latched per device. Re-benchmark, don't assume old throughput numbers hold.
- **CPU pipeline-parallel MoE training is currently unsafe under gradient accumulation > 1.** If you're using `UNSLOTH_FORCE_CPU=1` with MoE + PP + grad accum, gate on the parity test until #17054 is fixed.
- **Tool-calling dataset authors: watch for the `tool_calls: None` crash** in llama-3.x and gpt-oss templates. Two community fix PRs are open; until merged, strip null `tool_calls` from plain rows before applying `get_chat_template`.
- **FSDP2 checkpoint saves are now more robust** across notebook re-runs and multi-model processes — upgrade is low-risk for anyone doing composed TP × FSDP2 training saves.
- **ROCm users on RX 6700 XT should not upgrade the container yet**; the gfx1031 segfault has no fix and the startup check will falsely reassure you.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*