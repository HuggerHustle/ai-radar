# AI Infrastructure Digest 2026-11-23

> Generated: 2026-11-23 01:33 UTC | Projects covered: 6

- [vLLM](https://github.com/vllm-project/vllm)
- [SGLang](https://github.com/sgl-project/sglang)
- [llama.cpp](https://github.com/ggml-org/llama.cpp)
- [Ollama](https://github.com/ollama/ollama)
- [LiteLLM](https://github.com/BerriAI/litellm)
- [Unsloth](https://github.com/unslothai/unsloth)

---

## Cross-Project Comparison

# Cross-Project Comparison Report — AI Infrastructure Ecosystem
**Digest date: 2026-11-23**

---

## 1. Ecosystem Overview

Activity across the six flagship projects is high but **unevenly distributed by lifecycle stage**. Mature serving engines (vLLM, SGLang) are in a **correctness-hardening and multi-backend-expansion phase**, with the most severe issues being silent wrong-output bugs (GQA head selection, sampling underflow, tool-call parsing) rather than crashes. Local runtimes (llama.cpp, Ollama) are absorbing the **Inkling-2-Mini architecture** with a visible burst of bug reports — a classic signal that a new model family shipped faster than backends could stabilize. Fine-tuning (Unsloth) is converging on **ROCm/gfx1151 and Inkling-2 training**, while the gateway layer (LiteLLM) is fighting a **ReDoS-class availability bug** and expanding multi-provider coverage. No releases landed in the 24h window for any project, indicating a **post-tag stabilization cycle** across the stack.

---

## 2. Activity Comparison

| Project | Issues (highlighted) | PRs (highlighted) | Release Status | Dominant Activity Type |
|---|---|---|---|---|
| **vLLM** | ~15 (3 new correctness bugs, GQA/sampling/SM120) | ~12 (Humming quant, KV connectors, XPU) | No release; retirement tracking #67937 in flight | Kernel correctness + quant migration |
| **SGLang** | ~9 (2 unfixed security-adjacent DoS) | ~10 (NPU/XPU, diffusion LoRA, MoE dispatch) | No release; **CI maintenance mode** (#21065) | Backend expansion + CI pause |
| **llama.cpp** | ~12 (Inkling-2 cluster, RPC corruption) | ~10 (Metal NVFP4, OpenCL Adreno, CUDA ISA) | 3 builds landed: b12638/b12640/b12635 | Backend polish + model bring-up |
| **Ollama** | ~6 (VRAM regression, Jetson VMM) | ~7 (VRAM accounting, Metal kernels, dialer) | No release | Hardware/runtime stability |
| **LiteLLM** | ~8 (ReDoS critical, tool-call drops) | ~8 (Perplexity, GMI, LTS backports) | No release; active `lts/1.108.x` hardening | Multi-provider + billing fixes |
| **Unsloth** | ~11 (ROCm crashes, Studio regressions) | ~15 (GRPO, Inkling-2, FSDP2 correctness) | No release; main-branch only | Training perf + correctness |

**Headline read:** llama.cpp was the only project to cut builds. vLLM and Unsloth had the highest PR throughput. SGLang's **CI maintenance mode** is the single largest velocity risk in the dataset — expect downstream merge delays.

---

## 3. Model Support Race

| Model / Architecture | vLLM | SGLang | llama.cpp | Ollama | Unsloth | LiteLLM |
|---|---|---|---|---|---|---|
| **Inkling-2-Mini** | ⚠️ SM120 kernel gap (#69081) | — | ❌ High bug density (#32755, #32778, #32707, #32818) | ❌ Windows GGUF unsupported (#19817); Metal PR #19843 in flight | ✅ Training hardening (#18943, #18959) | — |
| **GLM-5.3 / GLM-5.3-Flash** | ⚠️ ROCm crash (#68919) | ❌ NVFP4/FP8 KV issues (#41939, #36830) | — | — | — | — |
| **Kimi-K3.1-Pro** | ⚠️ ROCm MI355X DNM (#69172) | ✅ NPU prefill CP (#52066) | — | — | — | — |
| **Qwen3.5 / Qwen3.6 (GDN hybrid)** | — | ⚠️ RoPE MRoPE sync (#46755) | ❌ Spec-decode 2.2–2.4× slower (#32776) | ❌ Parser truncation (#19829) | — | — |
| **Gemma 4 multimodal** | — | ✅ Breakable prefill CUDA graph (#52404) | — | — | — | — |
| **NemotronH** | — | ⚠️ JIT stall + tuner mismatch (#51628, #51627) | — | — | — | — |
| **Perplexity Orchestrator** | — | — | — | — | — | ✅ New provider (#53583/#53585) |
| **GMI Cloud (hy4-flash)** | — | — | — | — | — | ✅ Cost map (#53484) |
| **Mistral Large 3 / Ministral 3** | — | — | — | — | — | ✅ Bedrock Converse fix |

**Who's ahead:**
- **SGLang** leads on **hardware diversity** — Gemma 4, Kimi-K3.1 on NPU, XPU WNA16 MoE all landed.
- **vLLM** is the widest *breadth* but is **trailing on SM120** and blocked on AMD kernel PRs for Kimi-K3.1.
- **llama.cpp** has strong Metal NVFP4 momentum but is **the weakest on Inkling-2 correctness** — the model shipped but backends are catching up.
- **LiteLLM** is the only gateway with first-class **Perplexity Orchestrator** routing, which is strategically important for multi-provider agents.

**Signal:** Inkling-2 (with its `inkling2_loop` architecture) is the **stress test of the month** — it's revealing gaps simultaneously in Ollama, llama.cpp, vLLM, and Unsloth, which suggests the architecture itself has non-trivial loop/residual semantics that most runtimes haven't yet fully handled.

---

## 4. Performance Frontier

**Where optimization is concentrated today:**

| Layer | Most Active Projects | Representative Work |
|---|---|---|
| **Kernels / ISA** | llama.cpp, vLLM, SGLang | HIP ballot/shuffle ISA (#32839–#32841), Humming replacing Marlin (#65560), MoE routing-aware dual-runner dispatch (#51528) |
| **KV cache** | vLLM, llama.cpp | Separate SWA KV types (`--cache-type-k-swa`), KV connector fixes (#69271, #62916), FlashInfer workspace teardown (#63874) |
| **Quantization** | vLLM, llama.cpp, SGLang | Humming (INT4/8, FP8, MXFP*, NVFP4), Metal NVFP4 (#32825), HIP CDNA3 NVFP4 fix (#32790), XPU WNA16 MoE (#50810) |
| **Batching / scheduling** | llama.cpp, vLLM, Ollama | Non-causal batches in single ubatch (#32713), `n>1` sampling dedup RFC (#39647), hybrid parallelism (#18939) |
| **Distributed serving** | vLLM, SGLang | LoRA + MRv2 prefill CP (#68890), DCP A2A on XPU (#69301), PD disagg protocol unification (#34510), PD+spec decode over Mooncake (#50742) |
| **Training throughput** | Unsloth | 2× GRPO rollout on gfx1151 (#18874), AsyncGRPO −29–40% step time (#18929), CP GRPO hidden-state gather (#18897) |

**Notable numbers:**
- llama.cpp SYCL XMX-ESIMD path is **28–35% *slower*** for MoE prompt processing on Arc Pro B70 (#31068) — a regression worth watching.
- SGLang GDN decode on SM120 is at **~23% of roofline** — a **one-line fix** (#51208) with outsized ROI.
- Unsloth's AsyncGRPO sync dropped from 0.81s to near-zero on a 1.54s step — the single biggest RL-loop improvement reported.
- vLLM benchmark hygiene fix (#66701) shows prior "prefix-cache TTFT" of 67–81ms was **artificially low vs. ~340ms real** — a reminder that many published TTFT numbers are contaminated by cache warmups.

---

## 5. Layer Positioning

```
┌─────────────────────────────────────────────────────────────────┐
│  GATEWAY / ROUTING          LiteLLM                             │
│  (multi-provider, auth,     • Perplexity, GMI, Bedrock, Gemini  │
│   billing, guardrails)      • OpenAI/Anthropic-compat bridge    │
├─────────────────────────────────────────────────────────────────┤
│  SERVING ENGINE (datacenter)                                    │
│  vLLM  ── throughput + quant breadth, NVIDIA/AMD/XPU            │
│  SGLang ── hardware diversity (NPU/XPU/CPU), diffusion + LLM    │
├─────────────────────────────────────────────────────────────────┤
│  LOCAL RUNTIME                                                  │
│  llama.cpp ── ggml backends (Metal/Vulkan/HIP/SYCL/OpenCL/WebGPU)│
│  Ollama    ── developer-facing wrapper on llama.cpp + Metal     │
├─────────────────────────────────────────────────────────────────┤
│  TRAINING / FINE-TUNING                                         │
│  Unsloth ── QLoRA, GRPO/RL, diffusion LoRA, ROCm + CUDA + NPU   │
└─────────────────────────────────────────────────────────────────┘
```

**Key differentiators:**
- **vLLM vs. SGLang** — vLLM optimizes for **maximum throughput and quant-format coverage** in datacenter deployments (H100/H200 primarily); SGLang optimizes for **backend optionality** (Ascend NPU, Intel XPU, CPU diffusion) and multi-modal prefill.
- **llama.cpp vs. Ollama** — llama.cpp is the **commodity backend layer** (dozens of GPU vendors); Ollama is the **DX-first consumer runtime** that sits on top and adds model management, scheduler, and OpenAPI. Ollama's bugs are mostly runtime/VRAM (not kernels), confirming its role as a wrapper.
- **LiteLLM** is the only project that **does not own the inference path** — its stability concerns (ReDoS, budget bugs, tool-call drops) propagate to every downstream agent regardless of which engine actually serves the tokens.
- **Unsloth** is the only **producer** of models in this set — its ROCm gfx1151 progress and Inkling-2 training support determine what the other five engines will be asked to serve in Q1.

---

## 6. Trend Signals

**1. The "hybrid architecture" hangover is real.**
GDN (Qwen3.5/3.6), Inkling-2's `loop` semantics, and NemotronH's non-gated relu2 all stress test assumptions baked into serving runtimes (KV layouts, tuner heuristics, spec-decode drafts). **Watch:** llama.cpp #32776 (2.2–2.4× spec-decode penalty on GDN), vLLM MRv2/MoE interactions.

**2. Security is now a serving-engine concern, not just a gateway concern.**
Two of the three highest-severity issues today are **DoS-class bugs in request parsers**: SGLang `/parse_function_call` regex backtracking (#52090) and LiteLLM `secret_redaction.redact_string()` ReDoS (#32353). **Both are reachable from unauthenticated or LLM-generated input.** Agents calling each other with untrusted content are a live attack surface.

**3. Quantization format fragmentation is consolidating around NVFP4 + Humming.**
llama.cpp (Metal), HIP (CDNA3 fix), vLLM (Humming replacing Marlin), and SGLang (NVFP4 TP4 issues) are all converging on **NVFP4 / MXFP4** as the default 4-bit format. Expect Marlin to be deprecated across the stack within 1–2 quarters.

**4. "AI-generated code is now shipping real bugs into serving stacks."**
The Unsloth CI shell-injection fix (#18969) and vLLM's recurring top-k/top-p regressions (#68411) show that agent-written or agent-assisted PRs are entering merge queues faster than review capacity. For downstream consumers, **pin commit SHAs**, don't track `main`.

**5. Gateway-layer routing is becoming prefix-cache-aware.**
vLLM's gRPC sidecar (#36102) and forwarded-token-ID RFCs (#65502/#65503) plus SGLang's PD unification signal that **the gateway and engine boundary is being redrawn** — the gateway will soon need to understand cache state to route optimally. LiteLLM is not there yet; expect competitive pressure.

**6. Consumer Blackwell (SM120) is the new "second-class citizen" — temporarily.**
RTX PRO 6000 / RTX PRO 5000 users face gaps in vLLM (DSpark kernel), SGLang (GDN domain exclusion), and by extension Ollama. The fixes are small (#51208 is one line) but undelivered. **Fleets procuring SM120 workstations for inference should defer or validate specific model × backend combinations today.**

---

### What Agent/Application Developers Should Do This Week

| If you run… | Action |
|---|---|
| **vLLM with GQA >16 non-multiple-of-16** | Treat decode outputs as suspect until #68413; pin a tested commit |
| **SGLang for tool-calling** | Front `/parse_function_call` with rate-limiting/WAF; one request can stall the event loop (#52090) |
| **LiteLLM as a shared proxy** | Suppress verbose exception strings at the edge until ReDoS #32353 is patched |
| **llama.cpp RPC / multi-node** | Pin **before** #32838 lands, or wait for the merged fix — silent slot corruption |
| **Ollama ≥0.40.2 with hybrid or large quant models** | Roll back or pin; VRAM accounting regression (#19833, #19463) can silently spill to CPU |
| **Unsloth on ROCm/gfx1151** | Pick up main-branch commits for the 2× GRPO win; containerize Studio to avoid #18948 |
| **Any of the six with Inkling-2 in production** | **Wait.** Model support is a live fire across four projects. |

**Bottom line:** The stack is in a **stabilization quarter**, not an innovation quarter. The strategic moves are: (a) hardening agent input paths against parser DoS, (b) validating hybrid-architecture models before rollout, and (c) waiting for SM120 kernel coverage before procuring Blackwell workstation fleets.

---

## Per-Project Reports

<details>
<summary><strong>vLLM</strong> — <a href="https://github.com/vllm-project/vllm">vllm-project/vllm</a></summary>

# vLLM Digest — 2026-11-23

## 1. Today's Highlights
No new releases in the last 24h, but the issue/PR queue is very active: the Marlin→Humming quantization migration ([#65560](https://github.com/vllm-project/vllm/issues/65560)) and the ViT full CUDA graph tracker ([#38175](https://github.com/vllm-project/vllm/issues/38175)) remain the highest-traffic infrastructure threads. On the kernel side, two newly filed correctness bugs in attention/sampling paths ([#68411](https://github.com/vllm-project/vllm/issues/68411), [#68413](https://github.com/vllm-project/vllm/issues/68413)) plus an SM120 (Blackwell workstation) DSpark failure ([#69081](https://github.com/vllm-project/vllm/issues/69081)) are the most actionable items for operators.

## 2. Releases & Breaking Changes
No new releases in the last 24h.

In-flight compatibility work worth tracking:
- **Native Llama/Qwen2 model retirement** — [Tracking #67937](https://github.com/vllm-project/vllm/issues/67937) plans to remove native models built on `llama.py` and Qwen2-attention Qwen3 classes, moving top-level Llama/Qwen2 checkpoints fully to the Transformers modeling backend. Expect config/loading changes for custom forks pinned to native implementations.
- **SageMaker integration opt-out** — [PR #68638](https://github.com/vllm-project/vllm/pull/68638) adds `--disable-sagemaker-integration` for standalone deployments (defaults unchanged for existing SageMaker users).
- **Streaming benchmark contract unification** — [RFC #66974](https://github.com/vllm-project/vllm/issues/66974) proposes shared SSE conformance cases between Python `vllm bench serve` and Rust `vllm-bench`; relevant if you parse TTFT/ITL yourself.

## 3. New Model & Hardware Support
- **Kimi-K3.1-Pro on ROCm (MI355X)** — [PR #69172](https://github.com/vllm-project/vllm/pull/69172) (DNM) routes TP8/DCP8 via companion `amd-kernels` packages; blocked on an upstream kernel PR landing/pinning.
- **Inkling 2 Mini** — [Bug #69081](https://github.com/vllm-project/vllm/issues/69081) reports the shipped image builds kernels for 10.0/10.3 only, so SM120 (RTX PRO 6000 Blackwell) lacks a `reshape_and_cache_flash` kernel; DSpark draft fails at init.
- **GLM-5.3 on ROCm** — [Bug #68919](https://github.com/vllm-project/vllm/issues/68919): `index_topk_freq > 1` crashes the AMD DeepSeek V3.2 loader on missing indexer weights (v0.31.0–v0.34.0).
- **Intel XPU** — [PR #69301](https://github.com/vllm-project/vllm/pull/69301) enables direct symmetric-memory DCP A2A LSE reduce (`VLLM_USE_DIRECT_DCP_A2A`) via a SYCL port; [PR #68354](https://github.com/vllm-project/vllm/pull/68354) expands XPU CI entrypoint coverage.
- **Quantization formats**: Humming is positioned to replace Marlin across NVIDIA architectures, covering INT4/INT8 GPTQ/AWQ, FP8, MXFP8/FP6/FP4, NVFP4 for dense and MoE ([#65560](https://github.com/vllm-project/vllm/issues/65560)). [PR #66488](https://github.com/vllm-project/vllm/pull/66488) fixes AWQ key handling (`w_bit`/`q_group_size`) in `MoeWNA16Config`.

## 4. Performance & Optimization
- **ViT full CUDA graph** — [RFC #38175](https://github.com/vllm-project/vllm/issues/38175) (51 comments) targets eliminating per-forward kernel-launch overhead in multimodal encoders (Qwen3-VL, GLM-V, Kimi K2.5), a known throughput limiter in vision-heavy serving.
- **Reproducible PR benchmarks** — [RFC #61698](https://github.com/vllm-project/vllm/issues/61698) proposes BYOG eval/benchmark evidence for perf-sensitive PRs (e.g., standardized 8k1k H100 numbers), which should improve merge quality for kernel changes.
- **LoRA + MRv2 prefill context parallelism** — [Feature #68890](https://github.com/vllm-project/vllm/issues/68890) requests lifting the hard `NotImplementedError` for LoRA under PCP; currently a startup blocker for combined LoRA + long-context prefill.
- **`n>1` sampling dedup** — [RFC #39647](https://github.com/vllm-project/vllm/issues/39647) proposes keeping multi-sample requests unified to avoid redundant prefill and KV duplication, especially under PD disaggregation.
- **Benchmark hygiene** — [PR #66701](https://github.com/vllm-project/vllm/pull/66701) keeps warmups/ready-checks out of the prefix cache, fixing artificially low TTFT (67–81 ms vs ~340 ms measured).

## 5. Stability & Regressions
Ranked by severity:

1. **Attention correctness: wrong KV head read** — [Bug #68413](https://github.com/vllm-project/vllm/issues/68413): `decode_attention_fwd` selects the wrong KV head when GQA group size >16 and not a multiple of 16. Silent wrong outputs; no fix PR referenced.
2. **Sampling correctness: top-k/top-p underflow** — [Bug #68411](https://github.com/vllm-project/vllm/issues/68411): `apply_top_k_top_p_triton` keeps the entire row when top-p normalization underflows (0/0), degrading sampling. No fix PR referenced.
3. **SM120 kernel gap (Blackwell workstation)** — [Bug #69081](https://github.com/vllm-project/vllm/issues/69081): DSpark draft fails on RTX PRO 6000 due to missing SM120 `reshape_and_cache_flash`; also [Bug #50705](https://github.com/vllm-project/vllm/issues/50705) (stale) covers FlashInfer JIT failures on SM120 without CUDA ≥12.9 fallbacks.
4. **DSpark spec decode broken on main/H200** — [Bug #50851](https://github.com/vllm-project/vllm/issues/50851) (stale): code paths assume `dflash`, non-functional `dspark` method.
5. **Marlin MoE batch invariance** — [Bug #52525](https://github.com/vllm-project/vllm/issues/52525): output depends on within-expert token ordering; relevant for RL train-inference mismatch (see [PR #66550](https://github.com/vllm-project/vllm/pull/66550) docs pointer).
6. **KV connector fixes in flight** — [PR #69271](https://github.com/vllm-project/vllm/pull/69271) (HF3FS saves before block reuse, fixes #69269), [PR #62916](https://github.com/vllm-project/vllm/pull/62916) (PCP engine ID sync), [PR #63874](https://github.com/vllm-project/vllm/pull/63874) (FlashInfer workspace teardown), [PR #69247](https://github.com/vllm-project/vllm/pull/69247) (HiSparse layouts).
7. **Tool-calling parsers** — [Bug #69243](https://github.com/vllm-project/vllm/issues/69243) (Ripple drops prose after tags), [Bug #69190](https://github.com/vllm-project/vllm/issues/69190) (Qwen3 XML drops calls on `<|im_start|>` inside `<tool_call>`), [Bug #50989](https://github.com/vllm-project/vllm/issues/50989) (Qwen strict-mode no-arg tool doom loop).
8. **Release-branch backport** — [PR #69302](https://github.com/vllm-project/vllm/pull/69302) backports exact cooperative/persistent top-k to v0.32, fixing lower-scoring index selection on FP32 bin overflow.
9. **Misc**: MoE expert biases silently dropped in TRTLLM BF16/MoonEP/FlashInfer CUTLASS paths ([PR #67498](https://github.com/vllm-project/vllm/pull/67498)); `apply_top_k_top_p` and Mistral Tekken emoji corruption ([#68003](https://github.com/vllm-project/vllm/issues/68003)); host-memory leak in eager `reshape_and_cache_flash` ([#50150](https://github.com/vllm-project/vllm/issues/50150)); Qwen3.5-35B-A3B dflash poor perf ([#50722](https://github.com/vllm-project/vllm/issues/50722)).

## 6. What This Means for Application Developers
- **Validate GQA head counts**: if you serve models with GQA group sizes above 16 that aren't multiples of 16, treat decode output as suspect until #68413 is resolved; bias toward known-good configurations or pin a tested commit.
- **Sampling stability**: if you rely on aggressive top-p with low-temperature sampling, watch #68411 — broad distributions may bypass truncation, changing output diversity.
- **SM120/Blackwell workstation caution**: RTX PRO 6000 users should avoid the Inkling 2 Mini image and any DSpark draft path until an SM120 kernel is published; H100/H200 datacenter paths are unaffected by that specific gap.
- **Tool-call parsing**: Qwen-family and Ripple parser users should add post-parse validation (tool-call count vs. expected) — three open bugs describe silent tool-call drops or loops, which surface as agent failures rather than errors.
- **Gateway integrations improving**: the `vllm.Render` gRPC sidecar ([PR #36102](https://github.com/vllm-project/vllm/pull/36102)) and forwarded-token-ID RFCs ([#65502](https://github.com/vllm-project/vllm/issues/65502), [#65503](https://github.com/vllm-project/vllm/issues/65503)) target prefix-cache-aware routing — worth designing around if you operate an LLM gateway in front of vLLM.
- **RL post-training**: the patch/workaround tracker ([#68777](https://github.com/vllm-project/vllm/issues/68777)) is the canonical list of framework monkey-patches being upstreamed — monitor before upgrading RL stacks, and note batch-invariance bugs still affect train-inference consistency.

</details>

<details>
<summary><strong>SGLang</strong> — <a href="https://github.com/sgl-project/sglang">sgl-project/sglang</a></summary>

# SGLang Digest — 2026-11-23

## 1. Today's Highlights

No new releases landed in the last 24 hours, but the project remains in a **CI Maintenance Mode** state (Issue [#21065](https://github.com/sgl-project/sglang/issues/21065)) — normal PR CI runs are paused while the team works through 5 broken and 18 flaky tests reported in the tracking issue ([#17050](https://github.com/sgl-project/sglang/issues/17050), 945 recently fixed). Activity is dominated by hardware-backend expansion (NPU/Xeon/XPU) and a long tail of closed GLM-5.3-Flash correctness bugs, suggesting stabilization work on recent model integrations. A notable new security-adjacent finding: an unauthenticated single request can block the event loop via catastrophic regex backtracking in `/parse_function_call` ([#52090](https://github.com/sgl-project/sglang/issues/52090)).

## 2. Releases & Breaking Changes

None — no releases published in the last 24h. One in-flight API-surface change worth tracking: **RoPE positional encoding for Qwen3.5 text MRoPE paths is being synchronized** ([PR #46755](https://github.com/sgl-project/sglang/pull/46755)), which may affect output reproducibility for multimodal Qwen3.5 deployments.

## 3. New Model & Hardware Support

- **Intel XPU — compressed-tensors WNA16 MoE**: Enables serving W4A16 group-packed MoE checkpoints on XPU via `sgl-kernel-xpu` INT4 GEMM, working around the missing Marlin repack kernel ([PR #50810](https://github.com/sgl-project/sglang/pull/50810)).
- **Ascend NPU — CANN 9.2.0 stack bump**: Docker image and CI installer updated to CANN 9.2.0 / NPU kernel 2026.11.0.post12, with compatible PyTorch, torch_npu, and Triton Ascend versions for a3/950 devices ([PR #51818](https://github.com/sgl-project/sglang/pull/51818)).
- **Kimi-K3.1 on NPU — prefill context parallelism**: New feature enabling CP during prefill for Kimi-K3.1 on Ascend ([PR #52066](https://github.com/sgl-project/sglang/pull/52066)).
- **CPU — packed QKV kernel + Ulysses SP**: Enables Ulysses sequence parallelism for diffusion workloads on CPU via a new packed QKV kernel ([PR #36153](https://github.com/sgl-project/sglang/pull/36153)).
- **Gemma 4 multimodal prefill CUDA graph**: Breakable prefill CUDA graph enabled by default for multimodal Gemma 4 ([PR #52404](https://github.com/sgl-project/sglang/pull/52404)).
- **DFlash — Domino transformer corrector heads**: Draft-conditioned transformer heads now served for checkpoints that require them ([PR #52165](https://github.com/sgl-project/sglang/pull/52165)).
- **Diffusion LoRA format coverage**: Musubi-tuner Wan LoRAs ([PR #51784](https://github.com/sgl-project/sglang/pull/51784)), ComfyUI/ai-toolkit FLUX.2 LoRAs with `diffusion_model.` prefix ([PR #51452](https://github.com/sgl-project/sglang/pull/51452)), and Kohya/musubi Qwen-Image/Z-Image LoRAs ([PR #51435](https://github.com/sgl-project/sglang/pull/51435)) now load correctly instead of silently no-oping.

## 4. Performance & Optimization

- **MoE routing-aware dual-runner dispatch (NVIDIA)**: New dispatch scheme routes decode to Triton and prefill to DeepGEMM based on routing characteristics ([PR #51528](https://github.com/sgl-project/sglang/pull/51528)).
- **GDN decode on SM120 (RTX PRO 5000)**: Currently stuck on Triton default at ~23% of bandwidth roofline; flashinfer already ships cc=120 fused decode kernels but the backend hard-excludes `sm_major=12` ([#51208](https://github.com/sgl-project/sglang/issues/51208)). **Fix is a one-line domain check — high-ROI for consumer-Blackwell operators.**
- **NemotronH Triton kernel JIT stall**: `_chunk_scan_fwd_kernel` compiles for ~1.45s *during serving* on first large prefill, stalling engine on every TP rank ([#51628](https://github.com/sgl-project/sglang/issues/51628)). Pre-compilation during init would eliminate the stall.
- **Marlin MoE correctness/perf fix**: One block per SM in `moe_wna16_marlin_gemm` fixes 4–6% wrong-row rate on pre-Hopper (sm86/sm89) ([PR #47188](https://github.com/sgl-project/sglang/pull/47188)).
- **NemotronH MoE tuner shape mismatch**: Tuner assumes gated SiLU but NemotronH uses non-gated relu2, yielding suboptimal kernel selection ([#51627](https://github.com/sgl-project/sglang/issues/51627), closed).
- **Qwen3.8 DFlash2 TTFT regression**: 3.1% regression from `db2eb475` to `95f5ecd3` on RTX PRO 6000 Blackwell ([#36118](https://github.com/sgl-project/sglang/issues/36118)).

## 5. Stability & Regressions

Ranked by severity:

1. **Event-loop-blocking regex DoS** — `/parse_function_call` runs tool-call detection synchronously; a ~167-byte crafted payload triggers catastrophic NFA backtracking, blocking the async handler. Unauthenticated single-request DoS. **No fix PR yet.** ([#52090](https://github.com/sgl-project/sglang/issues/52090))
2. **FD exhaustion via `POST /vertex_generate`** — Unbounded `instances` list leaks ZMQ REQ sockets/descriptors until `Too many open files` degrades the service ([#52345](https://github.com/sgl-project/sglang/issues/52345)). **No fix PR yet.**
3. **Diffusion orchestrator routing-loop kill** — Deeply nested result metadata raises `RecursionError` in `_extract_request_id` (catches only `ValueError/IndexError/TypeError`), escaping the per-request handler and stopping the routing loop ([#52191](https://github.com/sgl-project/sglang/issues/52191)).
4. **XPU startup crash on WSL2 iGPU** — `torch.xpu.mem_get_info()` requires Level Zero Sysman, absent under GPU-PV; server crashes unconditionally during memory estimation. **Fix PR exists** ([PR #52060](https://github.com/sgl-project/sglang/pull/52060)).
5. **GLM-5.3-Flash NVFP4 TP4 reasoning loop** — Repetitive reasoning with no final answer on B200/B300 at TP=4 ([#41939](https://github.com/sgl-project/sglang/issues/41939)). Tracked in umbrella issue [#37524](https://github.com/sgl-project/sglang/issues/37524).
6. **GLM-5.3-Flash FP8 KV cache incompatibility** — `index_kpool > 1` excludes `flashmla_kv` and no CUDA DSA backend supports bf16-query×fp8-KV on SM90 ([#36830](https://github.com/sgl-project/sglang/issues/36830), closed/inactive).
7. **Qwen3-Omni AWQ-4bit startup failure** — Vision/audio layers built under names the quantization ignore-list never matches, breaking `cyankiwi/Qwen3-Omni-30B-A3B-Instruct-AWQ-4bit` ([#52318](https://github.com/sgl-project/sglang/issues/52318)).
8. **Rust extension loader deadlock** — `cargo --version --verbose` probe can deadlock in launcher spawn context on 4-node deployments; defensive timeout suggested ([#49108](https://github.com/sgl-project/sglang/issues/49108)).
9. **`fused_hc_mix` hang on multi-stream calls** — Repeated calls from separate CUDA streams can hang ([#50780](https://github.com/sgl-project/sglang/issues/50780)).

## 6. What This Means for Application Developers

- **Treat `/parse_function_call` as untrusted-input surface today.** If you expose SGLang's tool-call parsing to end users or LLM-generated content, a single malformed request can stall your entire server's event loop. Front it with a WAF/rate-limiter or run parsing off the critical path until a fix lands.
- **PD disaggregation protocol is consolidating.** The single-protocol-layer unification effort ([#34510](https://github.com/sgl-project/sglang/issues/34510), RFC [#33861](https://github.com/sgl-project/sglang/issues/33861)) is progressing — expect transport behavior changes for Mooncake/backend-specific PD configurations. **PD + speculative decoding over Mooncake on unified memory** is coming in [PR #50742](https://github.com/sgl-project/sglang/pull/50742) if you serve hybrid-SWA targets with DFlash drafts.
- **GLM-5.3-Flash has multiple open correctness issues** (NVFP4 TP4, FP8 KV cache, vision preprocessing). If you're deploying it in production, pin to a known-good configuration (GLM-5.2 works cleanly per [#36830](https://github.com/sgl-project/sglang/issues/36830)) or track the umbrella [#37524](https://github.com/sgl-project/sglang/issues/37524).
- **CI maintenance mode means PR merge velocity is reduced.** If you depend on nightly images for a fix, expect delays; consider pinning to a specific commit rather than tracking `main`.
- **Multi-modal roadmap (Q4)** is targeting complete processor-cache reuse and EPD embedding reuse ([#43314](https://github.com/sgl-project/sglang/issues/43314)) — repeated-media serving workloads should see meaningful preprocessing savings once landed.
- **Consumer Blackwell (SM120) operators**: GDN decode performance is currently 4× off roofline on RTX PRO 5000 due to a conservative domain exclusion ([#51208](https://github.com/sgl-project/sglang/issues/51208)). The fix is small — worth contributing or upvoting if this hardware is in your fleet.

</details>

<details>
<summary><strong>llama.cpp</strong> — <a href="https://github.com/ggml-org/llama.cpp">ggml-org/llama.cpp</a></summary>

# llama.cpp Digest — 2026-11-23

## 1. Today's Highlights

A high-velocity day centered on **backend polish and model bring-up**: token-aware chat parsing (`b12638`) and the server's new grep_search pagination (`b12640`) land alongside a wave of GPU backend fixes for Vulkan, WebGPU, HIP, and OpenCL. The **Inkling-2-Mini** family dominates the issue tracker with several correctness and prefill problems, while the **Gated DeltaNet (GDN) hybrid** architectures (Qwen3.5, Qwen3.6) continue to surface backend-specific regressions across Vulkan, CUDA, and RPC. A signature appears to be preparing for v1.0.0/0.7.x stability.

## 2. Releases & Breaking Changes

- **b12640** — `server`: offset pagination added to the `grep_search` tool. Clients relying on the previous "return all matches" behavior may need to adjust. [PR #32792](https://github.com/ggml-org/llama.cpp/pull/32792)
- **b12638** — `chat`: token-aware parsing implemented. Semantic change to how chat templates are parsed — downstream chat template consumers should retest. [PR #29307](https://github.com/ggml-org/llama.cpp/pull/29307)
- **b12635** — `ggml`: bump to the RPC protocol *patch* version (backward compatible) for the new SIGMOID backward op. [PR #32126](https://github.com/ggml-org/llama.cpp/pull/32126)
- New config flags under review: `--cache-type-k-swa` / `--cache-type-v-swa` for separate SWA-layer KV cache types. [PR #32240](https://github.com/ggml-org/llama.cpp/pull/32240)

No breaking GGUF or API changes reported.

## 3. New Model & Hardware Support

- **Metal**: NVFP4 support added, following the existing MXFP4 path (UE4M3 scales + `dequantize_nvfp4` / `_t4`). Currently PR, not yet merged. [PR #32825](https://github.com/ggml-org/llama.cpp/pull/32825)
- **OpenCL / Adreno 850**: coopmat GEMM kernels for `Q4_0, Q5_0, Q8_0, Q4_K, Q5_K, Q6_K` — a meaningful uplift for Android/adreno-class devices. [PR #32686](https://github.com/ggml-org/llama.cpp/pull/32686)
- **HIP / CDNA3**: fix for double-halving of NVFP4 scales (bug #32789). [PR #32790](https://github.com/ggml-org/llama.cpp/pull/32790)
- **SYCL**: initial F8 E4M3 (OCP FP8) support for `SET_ROWS`, `CPY`, `ADD`, `MUL_MAT`, `MUL_MAT_ID` — partial. [PR #31871](https://github.com/ggml-org/llama.cpp/pull/31871), tracked in [issue #31870](https://github.com/ggml-org/llama.cpp/issues/31870)
- **GGML core**: `SIGMOID` backward pass added — needed for Qwen3.5 GDN hybrid training/grad paths. [PR #32126](https://github.com/ggml-org/llama.cpp/pull/32126)
- **WebGPU**: `GDN supports_op` check updated (partial support matrix widening). [PR #32782](https://github.com/ggml-org/llama.cpp/pull/32782)

## 4. Performance & Optimization

- **CUDA / HIP kernels**: three consecutive optimizations from `thelittlefireman` — `mbcnt`-based ballot rank for HIP [PR #32841](https://github.com/ggml-org/llama.cpp/pull/32841), ballot-based `warp_reduce_all/any` [PR #32840](https://github.com/ggml-org/llama.cpp/pull/32840), and `readlane`-based shuffle [PR #32839](https://github.com/ggml-org/llama.cpp/pull/32839). Small but real ISA improvements.
- **HIP / CDNA1**: MMQ config without stream-k + table retune — meaningful speedup claimed in the PR benchmark table. [PR #32837](https://github.com/ggml-org/llama.cpp/pull/32837)
- **Server**: non-causal batches now fit in one ubatch (`b12627`) — improves throughput for embedding/rerank workloads. [PR #32713](https://github.com/ggml-org/llama.cpp/pull/32713)
- **SYCL**: workaround for oneDNN cache misses in SDPA zeroing the stack before compilation — improves FA path reuse. [PR #32835](https://github.com/ggml-org/llama.cpp/pull/32835)
- **OpenCL**: `q4_k` coop-k c8 GEMM for speculative-decoding verification (5–8 tokens). [PR #32716](https://github.com/ggml-org/llama.cpp/pull/32716)

**Regressions in flight:** SYCL XMX-ESIMD path is **28–35% slower** for MoE prompt processing on Arc Pro B70 ([issue #31068](https://github.com/ggml-org/llama.cpp/issues/31068)); Vulkan RDNA1 prefill regression ~45% on GDN hybrid models ([issue #30039](https://github.com/ggml-org/llama.cpp/issues/30039)); ROCm RDNA4 FA prefill with head size 512 is ~4× less efficient than head 256 ([issue #30838](https://github.com/ggml-org/llama.cpp/issues/30838)).

## 5. Stability & Regressions

Ranked by severity:

1. **Inkling 2 Mini correctness failures (CRITICAL)** — multiple independent reports: garbage output with `--n-cpu-moe` and long prompts ([#32755](https://github.com/ggml-org/llama.cpp/issues/32755)), all-`?` output for prompts >96 tokens ([#32778](https://github.com/ggml-org/llama.cpp/issues/32778)), prefill crashes on RTX 5090 with `IQ4_NL` ([#32707](https://github.com/ggml-org/llama.cpp/issues/32707)), and tool-call grammar crash with thinking off ([#32818](https://github.com/ggml-org/llama.cpp/issues/32818)). Fix PRs in progress: [#32833](https://github.com/ggml-org/llama.cpp/pull/32833) (parser/grammar).
2. **MoE cache triple-stores shared expert weights on inkling2_loop** — memory waste on looped models. [#32744](https://github.com/ggml-org/llama.cpp/issues/32744)
3. **RPC alloc_size cache bug** — stale `alloc_size` entry reused for larger `src` tensors, causing corruption (root cause of #30794: DeepSeek V4 degenerates to repeated token with two RPC workers). Fix PR: [#32838](https://github.com/ggml-org/llama.cpp/pull/32838)
4. **Vulkan i915 multi-ubatch corruption** with >20s of queued GPU work. [#32370](https://github.com/ggml-org/llama.cpp/issues/32370)
5. **Vulkan fence hang on device loss** — `ggml_vk_wait_for_fence` spins forever on RTX 4090 / Linux driver 615.71.09. [#29926](https://github.com/ggml-org/llama.cpp/issues/29926)
6. **SYCL iGPU nondeterministic logprobs** even with identical seed on MoE — reproducibility issue for eval harnesses. [#31206](https://github.com/ggml-org/llama.cpp/issues/31206)
7. **Draft-model speculative decoding ~2.2–2.4× slower** on Qwen3.5 GDN hybrid (CUDA) vs. only 10–18% loss on non-hybrid Qwen3 control. [#32776](https://github.com/ggml-org/llama.cpp/issues/32776)
8. **Windows: mapped model pages stay in working set after offload** — memory pressure on hosts running many models. Fix PR: [#31709](https://github.com/ggml-org/llama.cpp/pull/31709) (fixes [#32373](https://github.com/ggml-org/llama.cpp/issues/32373))
9. **GGUF parser UB / overflow hardening** — `int32_t` type read and `size_t` size-allocation guards. [#32761](https://github.com/ggml-org/llama.cpp/pull/32761)
10. **Web UI unresponsive at Chrome font size ≥24** (Svelte `effect_update_depth_exceeded`). [#32361](https://github.com/ggml-org/llama.cpp/issues/32361)
11. **`/v1/rerank` literal `{document}` substitution bug**. [#30816](https://github.com/ggml-org/llama.cpp/issues/30816)
12. **SDK `CUDA SM70` Qwen3.5-122B-A10B crash at first request** (V100 fleet). [#29783](https://github.com/ggml-org/llama.cpp/issues/29783)

## 6. What This Means for Application Developers

- **If you serve chat models through `llama-server`,** the token-aware parsing change (`b12638`) is the most likely to bite you — retest reasoning/thinking-tag parsing and any custom template logic. The chat template story is *in flux* this week; the Inkling parser rework (#32833) will land soon.
- **If you use RPC (multi-node inference),** pin to a build *before* #32838 or wait for the merged fix. The bug silently corrupts slot state after a long prompt on DeepSeek V4-class models and remains corrupted until server restart — this is a serious operational hazard.
- **If you build agents on GDN hybrid models (Qwen3.5/Qwen3.6) or use `speculative decoding`:** current CUDA draft-model paths are 2–2.4× slower on these hybrid architectures; consider disabling speculative decoding or non-hybrid base models until #32776 is addressed.
- **If you target mobile/edge (Adreno):** the new OpenCL coopmat kernels for Q4/Q5/Q6 families (PR #32686) are the biggest readiness improvement this quarter for Qualcomm GPUs — worth testing.
- **NVFP4 users** now have a Metal path (PR #32825) and a HIP/CDNA3 correctness fix (PR #32790). Wider NVFP4 coverage is clearly strategic.
- **On Windows with GPU offload:** the mapped-page leak fix (#31709, fixes #32373) is a silent but real resource win for shared/model-multiplexing deployments.
- **Stability-wise, the Inkling-2 and GDN families are the two areas to avoid in production** this week. The bug density on both is high; wait for the follow-up parser/hybrid-layer fixes before committing.

</details>

<details>
<summary><strong>Ollama</strong> — <a href="https://github.com/ollama/ollama">ollama/ollama</a></summary>

# Ollama Digest — 2026-11-23

## Today's Highlights
A quiet release day with no new versions, but the issue tracker and PR queue are busy with **VRAM accounting fixes** and **Jetson/CUDA VMM stability work**. The most significant community pain point remains `PredictServerVRAM` over-counting KV cache for hybrid (SSM/recurrent) architectures, which is now being addressed in a consolidated PR. A wave of correctness fixes for GGUF parsing, manifest host encoding, and the redirect dialer also landed in review today.

## Releases & Breaking Changes
None in the last 24h.

## New Model & Hardware Support
- **JetPack 6 / Jetson AGX Orin CUDA VMM fix (PR #19847, fixes #19815)** — New runner build disables the CUDA VMM pool (`GGML_CUDA_NO_VMM=ON`), resolving `cuMemAddressReserve` OOMs on image requests even with 38–55 GiB free. [PR #19847](https://github.com/ollama/ollama/pull/19847) · [Issue #19815](https://github.com/ollama/ollama/issues/19815)
- **Inkling 2 Mini (26B) GGUF on Windows** — `unknown architecture (inkling2_loop/inkling2)` and projector `inkling2v` errors reported; currently CLOSED but worth watching for Windows users running Thinking Machines Lab models. [Issue #19817](https://github.com/ollama/ollama/issues/19817)
- **Inkling Metal kernels (PR #19843)** — Adds Metal-optimized decode/prefill/draft paths gated by GPU generation and size class, including fused SwiGLU, deduplicated NVFP4/MXFP8 expert gathers, and relative-position split attention. [PR #19843](https://github.com/ollama/ollama/pull/19843)

## Performance & Optimization
- **VRAM accounting overhaul (PR #19632)** — Consolidated fix for #19463, #18679, #18349, #16599: corrects KV cache over-prediction (4–8x for hybrid architectures), respects `OLLAMA_KV_CACHE_TYPE`, and prevents unnecessary GPU splitting and runner eviction with `keep_alive=-1`. [PR #19632](https://github.com/ollama/ollama/pull/19632) · [Issue #19463](https://github.com/ollama/ollama/issues/19463)
- **Hybrid model parallelism (PR #18939)** — Adds `OLLAMA_PARALLEL_HYBRID` so hybrid/recurrent architectures (`qwen35moe` et al.) can run multiple slots instead of being pinned to one. [PR #18939](https://github.com/ollama/ollama/pull/18939)
- **Context shift control (PR #18399)** — New `OLLAMA_CONTEXT_SHIFT` lets a server refuse over-long prompts instead of silently truncating to ~half the window and returning HTTP 200. [PR #18399](https://github.com/ollama/ollama/pull/18399)

## Stability & Regressions
Ranked by severity:

1. **Jetson AGX Orin image request crash (HIGH)** — `clip_encode` VMM OOM on every image request; fix PR #19847 open. [Issue #19815](https://github.com/ollama/ollama/issues/19815) · [PR #19847](https://github.com/ollama/ollama/pull/19847)
2. **VRAM regression in 0.40.2 (HIGH)** — `qwen3.8:27b-mtp_q8` jumped from ~51 GB to 127 GB VRAM after upgrade; reinstall of prior version recovers. [Issue #19833](https://github.com/ollama/ollama/issues/19833)
3. **Redirect dialer only tries first resolved IP (MEDIUM)** — `checkedDialer` dials `ips[0]`, so blob pulls fail with `no route to host` when the first AAAA record is unreachable. Fix PR #19846 open. [Issue #19841](https://github.com/ollama/ollama/issues/19841) · [PR #19846](https://github.com/ollama/ollama/pull/19846)
4. **V2 manifest host encoding not reversible (MEDIUM)** — `%` not escaped, so `reg:5000` and `reg%3A5000` collide in `manifests-v2/`. Fix PR #19835 open. [Issue #19834](https://github.com/ollama/ollama/issues/19834) · [PR #19835](https://github.com/ollama/ollama/pull/19835)
5. **Qwen3.5 parser: plain-text close tags end thinking early (MEDIUM)** — Model-written ``/`<tool_call>` as ordinary tokens are mis-parsed as special tokens, truncating reasoning. [Issue #19829](https://github.com/ollama/ollama/issues/19829)
6. **Qwen3-VL-8B GGUF + mmproj crashes on first image on Apple Silicon (MEDIUM)** — Registers as vision-capable but runner exits status 2 on first image via both API surfaces. [Issue #16264](https://github.com/ollama/ollama/issues/16264)
7. **Windows auto-update failure (LOW/MEDIUM)** — `taskkill.exe`/`cmd.exe` return `0xc0000142` and app is not relaunched. [Issue #19840](https://github.com/ollama/ollama/issues/19840)
8. **Scheduler forgets unkillable runners (LOW)** — Failed `Close` clears the runner from `s.loaded`, leading to double-loads against a full GPU. Fix PR #19581 open. [PR #19581](https://github.com/ollama/ollama/pull/19581)
9. **Docker 0.15.3 MLX init failure (LOW, CLOSED)** — [Issue #14016](https://github.com/ollama/ollama/issues/14016)

## What This Means for Application Developers
- **Do not upgrade blindly to 0.40.2 if you run hybrid or large quantized models** — VRAM accounting regressions (#19833, #19463) can silently evict runners and spill to CPU. Pin versions and monitor VRAM via `/api/ps` until PR #19632 lands.
- **Long-prompt behavior is currently lossy** — prompts exceeding context are silently truncated to ~half the window with HTTP 200 and a truncated `prompt_eval_count`. If you build RAG or agent pipelines, validate `prompt_eval_count` against your input token estimate; `OLLAMA_CONTEXT_SHIFT` (PR #18399) will make this explicit once merged.
- **Thinking/tool-call parsing is fragile on Qwen3.5** — If you rely on structured reasoning traces or tool calls, do not assume plain-text ``/`<tool_call>` sequences are safe to pass through; sanitize or use the native token path until #19829 is resolved.
- **Jetson and Apple Silicon vision workloads** — Avoid upgrading production edge deployments (Orin, M-series with imported VL GGUFs) until #19815/#19847 and #16264 are addressed; text-only paths are unaffected.
- **GGUF ingestion is being hardened** — PRs #19844 and #19845 (power-of-two alignment, duplicate metadata key rejection) will cause previously-accepted malformed GGUFs to fail fast. Audit any custom-converted models now. [PR #19844](https://github.com/ollama/ollama/pull/19844) · [PR #19845](https://github.com/ollama/ollama/pull/19845)
- **Ecosystem integrations are growing** — New community additions today include Open Agent API, JoeBro, codeaf, and Synap Core, all targeting local Ollama via the OpenAI-compatible endpoint. [PR #19754](https://github.com/ollama/ollama/pull/19754) · [PR #19842](https://github.com/ollama/ollama/pull/19842) · [PR #19839](https://github.com/ollama/ollama/pull/19839) · [PR #19838](https://github.com/ollama/ollama/pull/19838)

</details>

<details>
<summary><strong>LiteLLM</strong> — <a href="https://github.com/BerriAI/litellm">BerriAI/litellm</a></summary>

# LiteLLM Digest — 2026-11-23

## 1. Today's Highlights

No new releases landed in the last 24 hours, but the PR queue shows a clear push on **multi-provider coverage** (Perplexity Orchestrator, GMI Cloud models) and **correct billing for multimodal inputs** on Gemini/Vertex embeddings. On the stability side, a **ReDoS in `secret_redaction.redact_string()`** (issue #32353) remains open and is the highest-severity item in flight, while several LTS backports (#53592, #53591, #53428, #53429, #53679) indicate active hardening of the `lts/1.108.x` line.

---

## 2. Releases & Breaking Changes

None in the last 24 hours.

---

## 3. New Model & Hardware Support

- **Perplexity Orchestrator provider** — New `perplexity_orchestrator/<vendor>/<model>` routing usable from chat completions, the Responses API, and Anthropic `/v1/messages`, with per-model cost tracking. Available on both main (#53583) and `lts/1.108.x` (#53585).
- **GMI Cloud catalog** — Adds `gmi/tencent/hy4-flash` to the cost map (1M max input; $7e-08 in / $2.81e-07 out per token). [PR #53484](https://github.com/BerriAI/litellm/pull/53484)
- **Gemini 3+ web search alongside function tools** — Vertex/AI Studio now preserves Google Search when the request also carries Codex-style tool definitions, and reports searches as `web_search_call` items. [PR #53423](https://github.com/BerriAI/litellm/pull/53423)
- **Bedrock Mistral Large 3 / Ministral 3** — `tool_choice` now forwarded on Converse (fix backported to LTS in #53591). [PR #53591](https://github.com/BerriAI/litellm/pull/53591)
- **OpenAI `video_url` for Gemini** (feature request, closed) — native support for OpenAI-compatible `video_url` content on `vertex_ai/...` and `gemini/...` paths. [Issue #30501](https://github.com/BerriAI/litellm/issues/30501)

---

## 4. Performance & Optimization

- **Proxy startup on Python 3.14** — Reported ~2m06s cold start, with ~120s attributable to `prisma.types` being imported three times (~40s each). No fix PR yet. [Issue #51458](https://github.com/BerriAI/litellm/issues/51458)
- **MCP tool probe overhead** — `MCPServerManager` re-probes `list_prompts`/`list_resources` on **every** aggregate `/mcp` request, including against servers that do not implement those operations. Proposed optimization still open. [Issue #35460](https://github.com/BerriAI/litellm/issues/35460)
- **Guardrail latency scaling** — Feature request to let `decision_model` guardrails screen only new messages since the last assistant turn, so latency does not grow linearly with conversation length. [Issue #52255](https://github.com/BerriAI/litellm/issues/52255)
- **Streaming `/v1/messages` with internal retrieve tool** — Text is now flushed to the client before the internal retrieve/compression tool call runs (relevant to Claude Code and similar streamers). [PR #53658](https://github.com/BerriAI/litellm/pull/53658)

---

## 5. Stability & Regressions

Ranked by severity:

1. **[CRITICAL] ReDoS in `secret_redaction.redact_string()`** — Catastrophic regex backtracking on large exception strings blocks the event loop for minutes, kills liveness probes, and crash-loops the proxy (observed across 4-replica Docker Swarm). No fix PR in this batch. [Issue #32353](https://github.com/BerriAI/litellm/issues/32353)
2. **[HIGH] Parallel tool-call arguments dropped under streaming** — Two related reports: (a) Anthropic `/v1/messages` via `chatgpt` (Codex) provider streams `tool_use` blocks with empty `input` when the model emits multiple tool calls in one turn (#45348); (b) Responses API bridge drops args when OpenAI only sends them in `function_call_arguments.done` (#53159, now **closed**). Verify whether #45348 is fully covered by the same fix.
   [Issue #45348](https://github.com/BerriAI/litellm/issues/45348) · [Issue #53159](https://github.com/BerriAI/litellm/issues/53159)
3. **[HIGH] Prisma init failure ignores `allow_requests_on_db_unavailable`** — Proxy returns 401 and never recovers when the initial DB connect fails. Adjacent to #27704/#34934/#35837 but specifically covers the nil-client auth path. [Issue #38121](https://github.com/BerriAI/litellm/issues/38121)
4. **[MEDIUM] Gemini batch embeddings bill media inputs as free** — Text-only token accounting produced $0 for image/video inputs. Fix uses `usageMetadata` and is landing on both main (#49682) and LTS (#53679), plus a Vertex embedContent counterpart for PDFs (#51673, closed). [PR #49682](https://github.com/BerriAI/litellm/pull/49682) · [PR #53679](https://github.com/BerriAI/litellm/pull/53679)
5. **[MEDIUM] False `BudgetExceededError` on `/vertex_ai` passthrough** — Duplicate `user_api_key_auth` call leaked budget reservations, plus a 1M-token fallback for Gemini `"contents"`. Closed. [Issue #50030](https://github.com/BerriAI/litellm/issues/50030)
6. **[LOW] Admin-only route denials return 401 instead of 403** and are recorded with `exception_status="None"` in Prometheus. Closed. [Issue #37108](https://github.com/BerriAI/litellm/issues/37108)
7. **[LOW] `n>1` streamed chat: missing assistant role on non-first choices** — Fixed on main and backported to LTS. [PR #53582](https://github.com/BerriAI/litellm/pull/53582) · [PR #53592](https://github.com/BerriAI/litellm/pull/53592)

Also noted: `oidc/env|file|google` API-key references were leaking as literal strings to batch cancel, fine-tuning listing, OCR, `/v1/messages`, and cache prediction — fix in [#53678](https://github.com/BerriAI/litellm/pull/53678). And `httpx.Timeout(connect=…)` is collapsed for non-OpenAI/Azure/Bedrock providers due to an overly narrow allowlist ([#47822](https://github.com/BerriAI/litellm/issues/47822), closed).

---

## 6. What This Means for Application Developers

- **If you run multi-provider agents that use tools:** pin carefully if you rely on streamed `/v1/messages`. Tool-call argument loss under streaming is a correctness bug, not just a UX issue — silently empty `input` blocks can trigger spurious downstream tool errors.
- **If your proxy is exposed to untrusted or noisy inputs:** be aware of the open ReDoS. A single large exception payload can take down every replica behind a liveness probe; consider suppressing verbose exception strings at the edge until a patch lands.
- **If you bill by usage:** upgrade past the Gemini batch-embedding fix. Media-bearing embeddings were reported as ~$0, which means either under-billing (internal chargeback) or downstream cost surprises.
- **If you are on `lts/1.108.x`:** several important fixes (Gemini billing, streaming role, Bedrock Mistral `tool_choice`, Vertex `service_tier` headers, Gemini image empty-200) are explicitly backported. Pull the LTS patch rather than waiting for a main-only release.
- **If you build on Python 3.14:** expect a ~2-minute cold start due to `prisma.types`. If you autoscale or run short-lived containers, either pre-warm the import or hold capacity.
- **Perplexity Orchestrator support** now makes it viable to route `perplexity_orchestrator/*` through the same gateway as OpenAI/Anthropic, with per-model cost attribution — useful if you previously stitched Perplexity in outside the proxy.

</details>

<details>
<summary><strong>Unsloth</strong> — <a href="https://github.com/unslothai/unsloth">unslothai/unsloth</a></summary>

# Unsloth Digest — 2026-11-23

## Today's Highlights
No new releases in the last 24h, but `@danielhanchen` landed a dense cluster of performance and stability PRs spanning ROCm gfx1151 (Strix Halo), FSDP2 4-bit DCP loads, context parallel GRPO, and Inkling-2 support. The issue tracker is dominated by Studio desktop/web regressions — ROCm launch-path crashes, managed-account model loading, and chat/preset persistence. Most notable perf win: AsyncGRPO adapter sync reworked to hand tensors (not files) to vLLM, cutting ~29–40% off the step time.

## Releases & Breaking Changes
None — no releases published in the last 24h. However, two items carry migration-adjacent signal:
- **[#18722 CLOSED]** "Cannot load a fine-tuned Q5_K_M GGUF: quantization type 36 ... this build does not have" on Studio `v0.1.922-beta` Windows — bundled llama.cpp build (12588) may lack quant types produced by newer export paths. ([link](https://github.com/unslothai/unsloth/issues/18722))
- **[#5862 CLOSED]** Chat settings moved from browser storage to a local DB, breaking preset persistence for upgrading users. ([link](https://github.com/unslothai/unsloth/issues/5862))

## New Model & Hardware Support
- **Inkling-2 (Mini) training support hardening** — [#18943](https://github.com/unslothai/unsloth/pull/18943) routes language attention through **FlexAttention** (relative bias + attention sinks fused); [#18959](https://github.com/unslothai/unsloth/pull/18959) checkpoints the loop's message residual, refuses TP/PP early, adds parity tests.
- **Older AMD XDNA NPUs (Ryzen AI 100/200)** — feature request for XDNA 1 support; current integration targets XDNA 2+. [#18501](https://github.com/unslothai/unsloth/issues/18501)
- **Optional Strata engine integration** (MoE streaming / AMD) proposed for Studio as a third engine alongside llama.cpp / vLLM. [#16626](https://github.com/unslothai/unsloth/issues/16626) (👍 13)
- **AMD NPU (Lemonade/FastFlowLM) broken after FastFlowLM 1.0.13** — NPU model listing fails with JSON parse error. [#18763](https://github.com/unslothai/unsloth/issues/18763)

## Performance & Optimization
- **GRPO rollouts 2× faster on ROCm gfx1151** — one-launch skinny decode linear + RL decode graphs; rocBLAS 128×128 Tensile path was dominating M=4–8 decode GEMMs. [#18874](https://github.com/unslothai/unsloth/pull/18874)
- **AsyncGRPO adapter sync −29% to −40% per step** — hand the synced LoRA adapter to vLLM as tensors instead of safetensors files (0.81s of a 1.54s step on Colab L4 / Qwen2.5-0.5B). [#18929](https://github.com/unslothai/unsloth/pull/18929) *(CLOSED)*
- **Inkling-2 FlexAttention: L4 −15% per step** vs transformers 5.24 eager-only path. [#18943](https://github.com/unslothai/unsloth/pull/18943)
- **Context parallel GRPO**: gather only the last hidden state instead of all layers under CP/DDP. [#18897](https://github.com/unslothai/unsloth/pull/18897)
- **Windows ROCm LTX-2.x VAE**: decompose oversized `Conv3d` into per-tap `Conv2d` — ~10× slowdown avoided above 2 GiB tensors. [#18965](https://github.com/unslothai/unsloth/pull/18965)
- **Diffusion LoRA on gfx1151**: contiguous q/k/v to feed AOTriton dense layout instead of strided SDPA. [#18966](https://github.com/unslothai/unsloth/pull/18966)
- **Diffusion training kernel-audit fixes**: fp8 Auto host-RAM check, layout fixes, ROCm budgets, DDP precision, block swap. [#18967](https://github.com/unslothai/unsloth/pull/18967)

## Stability & Regressions (ranked by severity)
1. **ROCm launches from Studio crash llama-server** — system `libamdhip64` loaded instead of bundled ROCm; works from shell. [#18948](https://github.com/unslothai/unsloth/issues/18948)
2. **`v0.1.920-beta` crashes on model load** — desktop app. [#18563](https://github.com/unslothai/unsloth/issues/18563)
3. **QLoRA on gfx1200 (RX 9060 XT, RDNA4) aborts** with `HIP error: an illegal memory access` in three fused kernels. [#18403](https://github.com/unslothai/unsloth/issues/18403)
4. **Dual RX 6700 XT ROCm crash** *(CLOSED)* — [#18622](https://github.com/unslothai/unsloth/issues/18622)
5. **Windows Strix Halo host-shortfall check forces mmap** despite carve-out fix #17607. [#18805](https://github.com/unslothai/unsloth/issues/18805)
6. **Managed (non-owner) Studio accounts** cannot load subfolder GGUF repos (`namespace/repo/subfolder`). [#18647](https://github.com/unslothai/unsloth/issues/18647)
7. **Inkling-2-Mini-GGUF fails to load** on latest Studio Docker. [#18757](https://github.com/unslothai/unsloth/issues/18757)
8. **Qwen-Image-Edit GGUF device mismatch** in `_adaln_continuous_forward` *(CLOSED)* — [#18759](https://github.com/unslothai/unsloth/issues/18759)
9. **Z-Image base on MLX** renders all-black (M1/M2) or cyan grid — fix PR [#18964](https://github.com/unslothai/unsloth/pull/18964) open.
10. **`transformers==5.13.1` trips endpoint scanners** ("script was blocked"). [#18699](https://github.com/unslothai/unsloth/issues/18699)
11. **CI security**: `kaggle-collect.yml` shell-injected the free-text `max_age_hours` dispatch input; fix passes inputs via env. [#18969](https://github.com/unslothai/unsloth/pull/18969)

Correctness hardening landed/queued:
- Left-padded training: fully-masked pad queries now attend only their own key (prevents label leakage). [#18950](https://github.com/unslothai/unsloth/pull/18950)
- SFT `_prepare_dataset` under DDP now runs rank-0-first tokenization via `main_process_first()`. [#18956](https://github.com/unslothai/unsloth/pull/18956)
- FSDP2 4-bit DCP load: quant-state copies and byte check on owning rank, cross-rank verdict. [#18953](https://github.com/unslothai/unsloth/pull/18953)
- Gemma-2 / Cohere / Falcon-H1 decode scratch buffers now allocated on the model's device, not `cuda:0`. [#18955](https://github.com/unslothai/unsloth/pull/18955)
- FLUX.2 GPU reference preprocess probe moved to load; CUTLASS race key covers helpers. [#18968](https://github.com/unslothai/unsloth/pull/18968)

## What This Means for Application Developers
- **On ROCm/Strix Halo (gfx1151), upgrade to the latest main-branch pickups for GRPO/RL workloads** — the 2× rollout improvement and one-launch decode linear are not in a tagged release yet; pin a commit if you need the win now.
- **If you ship agents on Studio over ROCm, budget for launch-path fragility** — the system-ROCm-vs-bundled-ROCm crash (#18948) is environment-dependent and not yet fixed. Containerize with explicit `LD_LIBRARY_PATH` if you can.
- **Tool-calling reliability is actively improving**: the LFM2/LFM2.5 raw tool-call leak (#18802) is fixed, and [#18820](https://github.com/unslothai/unsloth/pull/18820) generalizes the fix so a call-only final answer is re-asked with `tool_choice: "none"`. Worth retesting agent loops that previously saw markup in outputs.
- **DDP/FSDP users should watch the correctness PRs** (#18950, #18956, #18953) — these fix silent training-quality issues (label leakage, duplicate tokenization, cross-rank disagreement) rather than crashes, so they won't show up in smoke tests.
- **GGUF interchange** between your Unsloth export pipeline and a Studio runtime still has an edge case (#18722); pin the llama.cpp build version in your deployment manifest and validate quant types end-to-end.
- **No release tags in 24h** means everything above is main-branch. For production, freeze a tested commit SHA rather than tracking `main`.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*