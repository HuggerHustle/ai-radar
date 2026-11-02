# AI Infrastructure Digest 2026-11-02

> Generated: 2026-11-02 00:34 UTC | Projects covered: 6

- [vLLM](https://github.com/vllm-project/vllm)
- [SGLang](https://github.com/sgl-project/sglang)
- [llama.cpp](https://github.com/ggml-org/llama.cpp)
- [Ollama](https://github.com/ollama/ollama)
- [LiteLLM](https://github.com/BerriAI/litellm)
- [Unsloth](https://github.com/unslothai/unsloth)

---

## Cross-Project Comparison

# Cross-Project Comparison Report — AI Infrastructure Digest
**Date: 2026-11-02 | Coverage: vLLM, SGLang, llama.cpp, Ollama, LiteLLM, Unsloth**

---

## 1. Ecosystem Overview

The AI infrastructure stack is in a hardening phase rather than a feature-expansion phase: no project in this sample shipped a release in the last 24 hours, yet every tracker shows heavy issue/PR churn concentrated on **correctness, memory accounting, and stability under concurrency**. The day's most consistent cross-project theme is a **DeepSeek-V4/V4.1 quality and stability gap** — vLLM, SGLang, and llama.cpp each carry open bugs on DSV4-family correctness, scheduling, or backend crashes, indicating reference-implementation maturities have not yet caught up to model releases. Simultaneously, a **Rust-ification of control planes** is visible across layers (vLLM's Rust frontend, LiteLLM's Rust router core and forwarding server), targeting hot-path overhead rather than model math. Hardware coverage continues to broaden (SM100/SM120, ROCm gfx950, NPU, Hexagon, OpenCL/Adreno), but **SM120 specifically emerges as a production risk** across vLLM and SGLang. Finally, the training/fine-tuning layer (Unsloth) is extending parallelism and quantization reach (FP8 LoRA, unified DP/TP/PP/CP mesh), signaling that the same workloads serviced by inference engines are growing in scale upstream.

---

## 2. Activity Comparison

*Note: exact counts are not published in the digests; the table reflects qualitative activity and explicit figures where cited.*

| Project | Layer | Active Issue Themes | Active PR Themes | Release Status (24h) | Key Numerical Signals |
|---|---|---|---|---|---|
| **vLLM** | Serving engine (server/cloud) | ~8 ranked stability items; 3 engine-crash bugs | Rust frontend parity; NVFP4/GPTQ batch-invariance; RL weight-reload RFC | **None** | RFC #54477 validated across **17 model families**; ~**18% pooling regression** on torch 2.11; Rust roadmap #44280 at **50 comments** |
| **SGLang** | Serving engine (server/cloud) | DSV4.1 crash + allocator OOM; SM120 GLM-5.3 issues | SM100 NVFP4 kernels; AMD MI350X MiniMax; XPU paged-experts | **None** | Allocator OOM at only **29% KV pool**; SM120 prefill **2–7K vs 12.5K tok/s** vs vLLM/marlin; CUDA coredump tracker at **352 comments** |
| **llama.cpp** | Local/edge runtime | SYCL multi-GPU cluster; CUDA sm_75 regression; Vulkan DSV4 gibberish | Unified-KV FA; per-size CUDA graph arenas; MoE ClassLRU cache | **6 releases (b12027–b12032)** | MoE ClassLRU: **+6% QFN / +7% GLM decode, −8% uploads**; SYCL `--cpu-moe` **100–1000× slowdown**; HIP MTP prefill **−80%** |
| **Ollama** | Local runtime + API surface | Parser correctness (tool calls, harmony); long-context degradation | Per-model prompt cache budgets; scheduler eviction; CORS hardening | **None** | Repeat-limit abort at **101 identical tokens**; MLX cache fixed at **8 GiB**; embed context off by **1–2 tokens** |
| **LiteLLM** | LLM gateway / proxy | Cost/budget enforcement bugs; cross-tenant cache leak | Large Rust router core migration (~10 stacked PRs); Rust forwarding server | **None** | Cost overbilling **1,000,000×**; ~**10+ Rust PRs** in flight; GHCR tag/release provenance gap |
| **Unsloth** | Fine-tuning / training | Studio UX and platform fixes (mostly closed) | FP8 LoRA; `UNSLOTH_PARALLEL` unified mesh; hub snapshot pinning | **None** | fp16 overflow example: `B=5000 × alpha 16 = 80000 > 65504`; Gemini picker capped at **20 models** pre-fix |

**Reading:** llama.cpp is the only project shipping releases, consistent with its continuous-build model. The server-grade engines (vLLM, SGLang) and control-plane layers (LiteLLM) are in deep refactor cycles, where regressions are expected and pinning discipline matters. Ollama and Unsloth are in bug-sweep mode.

---

## 3. Model Support Race

**New model/architecture landings in this window:**

| Model / Arch | vLLM | SGLang | llama.cpp | Ollama | Unsloth |
|---|---|---|---|---|---|
| **DeepSeek-V4 / V4.1** | Batch-invariant sparse indexer (#64441); multi-image packing (#65030); HC expansion (#64816); MXFP8 indexer autotune (#60543) | **Bug-heavy**: scheduler crash (#47218), allocator OOM (#43486), prompt-render divergence (#46348), SM120 index-order instability (#46798) | Vulkan `-fa on` gibberish (#31480, fix PR #31505) | — | — |
| **Qwen3.5 / Qwen3-Next** | Fused QK-norm+RoPE ROCm enablement (#51406) | Qwen3.5 seq-classification request (#41110); GDN prefill + Triton recurrence (#38806) | — | 0.8B `q4_K_M` request (#19436) | — |
| **GLM-5.x** | Stale top-k fix (closed #63170) | **SM120 fa4 CUDA-graph crash** (#42012) — triton only | — | — | — |
| **MiniMax-M3.1** | NVFP4 KV sparse-prefill workspace (#64856) | **Landing**: MI350X/MI355X gfx950 support (#46693, kernel stack merged) | — | — | — |
| **Mistral / Tekken** | `developer`→`system` role fix (#65031); byte-fallback tokenization fix (#64743) | — | — | — | — |
| **Kimi K3** | — | NPU MLAProlog (#47373) | — | — | — |
| **LFM3** | — | — | Tensor-split enabled (#31431) | — | — |
| **Nemotron 3.5 Transcribe** | — | — | mtmd SALM support in review (#31471) | — | — |
| **Gemma 4** | — | — | Graph optimizations in review (#31356); test-arch enablement | — | — |
| **Qwen3.8-27B (hybrid attn/MTP)** | — | — | — | **Support gap**: GGUF load failure (#19459) | — |
| **Maple-Preview (TQ1_0/TQ2_0)** | — | — | CUDA kernels in review (#31512) | — | — |

**Who's ahead:**
- **vLLM leads on DeepSeek-V4/V4.1 depth** — it is shipping *optimizations* for the architecture (sparse indexer, vision packing, MXFP8 autotune) while SGLang is still firefighting *correctness and memory* on the same model family.
- **SGLang leads on accelerator breadth** — the only project landing MiniMax-M3.1 on AMD MI350X/MI355X and Kimi K3 on NPU in this window, plus an XPU paged-experts RFC. Its multi-vendor reach is a differentiator, at the cost of a wider bug surface.
- **llama.cpp leads on edge/mobile format breadth** — Hexagon stride fix, OpenCL IQ3_S with Adreno kernels, ternary CUDA, LFM3 tensor split. This is the only project pushing into sub-server form factors.
- **Ollama lags on new-arch ingestion** — Qwen3.8-27B hybrid-attention GGUFs still fail to load; harmony analysis-channel thinking support is the notable forward step.

---

## 4. Performance Frontier

**Where optimization effort concentrates today:**

**Kernels (highest absolute effort)**
- SGLang: SM100 NVFP4 DualGEMM+SwiGLU, PDL-safe GEMM, grouped GEMM, fused MoE (#47589); single SM100-tuned RMSNorm JIT template (#47503); Qwen3 prefill QK-norm+RoPE fusion (#47785).
- vLLM: ROCm FlyDSL decode monokernel (#63440); fused DSpark draft sampling on gfx950 (#63181); FlashInfer autotune expansion (#60543).
- llama.cpp: OpenCL IQ3 Adreno GEMM/GEMV; unified-KV FA `flash_attn_ext_rows` (#29510) spanning CUDA/Vulkan/SYCL/Metal/OpenCL/Hexagon/WebGPU.

**KV / cache management**
- llama.cpp: unified-KV flash attention (mask-filtering elimination) and **MoE ClassLRU expert cache** (+6–7% decode, −8% uploads) — the most quantified cache win in the window.
- Ollama: per-model prompt cache budgets (#19450) superseding a single global budget; scheduler eviction rework (#19449).
- SGLang: NPU sparse-KV offload with PD disaggregation + LRU caching (#43579); supernode-wide L1/L2 agentic cache roadmap (#43098).

**Quantization**
- FP4/FP8 dominance: NVFP4 across vLLM (KV, sparse indexer) and SGLang (dual-gemm, SM100, TP4 bundle).
- Ternary/1-bit: llama.cpp OpenCL IQ3_S + Maple TQ1_0/TQ2_0 CUDA; vLLM BitNet request (#33142).
- Training-side FP8: Unsloth FP8 LoRA on 16-bit bases (#16423).

**Distributed serving / parallelism**
- Unsloth: `UNSLOTH_PARALLEL` unified DP/TP/PP/CP mesh (#16407) — the clearest training-scale parallelism advance.
- SGLang: DSpark indexer-CP on NVFP4; TP4 NVFP4 serving bundle (#47807); Agentic Cache Scheduling roadmap.
- vLLM: benchmarking RFC for reproducible BYO-GPU PR evals (#61698).

**Batching / scheduling**
- llama.cpp: per-size CUDA graph arenas for small batches ≤8 tokens, avoiding speculative-verify recapture (#31156).
- vLLM: batch-invariance work across NVFP4/GPTQ (correctness under batching, not just speed).
- Ollama: fit-aware eviction at the 80% threshold.

**Observation:** The frontier has bifurcated. **Cloud/server engines (vLLM, SGLang) are pushing 4-bit/FP4 kernels on the newest accelerator generations**, while **edge runtimes (llama.cpp) are pushing cache and graph-scheduling efficiency on format-varied hardware.** The two rarely overlap, and a third track — **distributed training parallelism** — sits with Unsloth.

---

## 5. Layer Positioning

```
┌───────────────────────────────────────────────────────────────────┐
│  APPLICATION / AGENT LAYER                                        │
├───────────────────────────────────────────────────────────────────┤
│  GATEWAY            │  LiteLLM — routing, budgets, cost tracking, │
│                     │  provider translation, virtual keys          │
├───────────────────────────────────────────────────────────────────┤
│  SERVING ENGINE     │  vLLM          │  SGLang                     │
│  (server/cloud)     │  throughput-   │  multi-vendor accelerators, │
│                     │  optimized,    │  broadest hardware reach,   │
│                     │  Rust frontend │  diffusion + LLM            │
├───────────────────────────────────────────────────────────────────┤
│  LOCAL RUNTIME      │  Ollama        │  llama.cpp                  │
│                     │  UX-focused    │  lowest-level ggml/backend, │
│                     │  API wrapper   │  broadest quant + form      │
│                     │  over backends │  factor coverage            │
├───────────────────────────────────────────────────────────────────┤
│  TRAINING /         │  Unsloth — LoRA/QLoRA/FP8 fine-tuning,      │
│  FINE-TUNING        │  parallelism mesh, Studio GUI               │
└───────────────────────────────────────────────────────────────────┘
```

**Key differentiation:**
- **vLLM and SGLang are direct competitors** at the server engine layer. vLLM optimizes the *reference-architecture path* (DeepSeek-V4 depth, batch invariance, Rust frontend for hot-path overhead). SGLang pursues *hardware breadth* (AMD/NPU/XPU) and *diffusion serving*. Where they overlap (SM120, DSV4.1), they share the same bugs — suggesting common upstream dependencies (FlashInfer, Triton).
- **Ollama and llama.cpp are stack-adjacent, not competitors.** Ollama is a user-facing runtime and API surface that consumes llama.cpp backends and MLX; its differentiators are scheduler policy, prompt caching, and API ergonomics. llama.cpp is the substrate — its innovations (unified KV, MoE cache, per-size graphs) propagate upward into Ollama and other consumers.
- **LiteLLM sits at the gateway layer,** orthogonal to inference. Its Rust migration is about reducing proxy overhead, not model performance. Its critical risk profile is **billing and multi-tenancy**, not throughput.
- **Unsloth operates upstream of serving.** Training outputs feed inference engines, and its FP8/parallelism work expands what can be fine-tuned — but it shares almost no operational concerns with the serving tier.

---

## 6. Trend Signals

**Signal 1 — DeepSeek-V4/V4.1 is the ecosystem's stress test.**
Three of four inference projects carry open DSV4-family bugs, and vLLM's bug list (engine crashes, KV-connector failures, sparse-indexer divergence) mirrors SGLang's (scheduler crash, allocator OOM, prompt-render divergence). This is a **maturity gap between model release cadence and engine support**, not a single project's failure. *Application developers should treat DSV4.1 serving as beta-grade through at least this quarter and pin verified builds.*

**Signal 2 — SM120 (RTX PRO 6000 / Blackwell workstation) is not production-ready for frontier models.**
SGLang's fa4 CUDA-graph crash on GLM-5.3-Flash and its 2–7K vs 12.5K tok/s DeepSeek-V4-Flash prefill gap, combined with vLLM's SM120 TurboQuant workspace bug and an open SM120 support request (#40802), indicate **kernel coverage lags SM100 by roughly one release cycle.** *If you are evaluating RTX PRO 6000 for cost-efficient serving, budget for backend triage or wait for kernel roadmap items to land.*

**Signal 3 — Control planes are being rewritten in Rust.**
vLLM (frontend feature parity, 50 comments) and LiteLLM (router core, Redis client, forwarding server — ~10 stacked PRs) are both moving hot-path control logic to Rust, with **byte-compatible Redis layouts to allow mixed-version rolling deploys**. This is a coordinated pattern: Python orchestration on the edges, Rust on the request path. *Operators should test dual-process topology changes (LiteLLM forwarding server) and Rust-frontend gating (`VLLM_USE_RUST_FRONTEND=1`) in staging before enabling.*

**Signal 4 — Cost and budget enforcement in gateways is unreliable.**
LiteLLM's open 1,000,000× overbilling bug, team-member budget bypass via fallback, and crash on null token counts mean **spend caps cannot be trusted as hard guardrails today.** Combined with the cross-tenant exact-match cache leak (semantic caches scoped, exact-match not), gateway operators face both billing and isolation risk. *Reconcile against provider invoices; disable exact-match caching across tenants; treat budget caps as best-effort.*

**Signal 5 — MoE expert caching is the practical VRAM-efficiency winner.**
llama.cpp's ClassLRU cache (+6–7% decode, −8% uploads) and Ollama's per-model cache budgets both target the same problem: serving large MoE models on constrained memory. *If you run large MoE models locally or on mixed hardware, this is the highest-ROI optimization area in this window.*

**Signal 6 — Speculative decoding has backend-specific failure modes.**
llama.cpp's HIP `--spec-type draft-mtp` cuts prefill ~80%, while Vulkan is unaffected; Ollama's MLX runner aborts at 101 repeated tokens. *Speculative decoding is not portable across backends — validate per-deployment rather than enabling globally.*

**Signal 7 — Multi-vendor accelerator support is widening, and with it, bug surface.**
SGLang is landing AMD MI350X/MI355X and NPU code paths; llama.cpp is adding Hexagon, OpenCL/Adreno, and XDNA requests; vLLM has open SM120/CPU-wheel/BitNet requests. The breadth is real, but **non-NVIDIA paths consistently show stability and memory-accounting gaps** (SYCL `--fit` under-accounts, 100–1000× `--cpu-moe` slowdown, DEVICE_LOST on tensor split). *Multi-vendor deployments should expect a longer stabilization tail than NVIDIA-only fleets.*

**Signal 8 — Long-running RL/agent rollout loops are becoming a first-class design constraint.**
vLLM's direct-weight-reload RFC (#54477, validated across 17 model families), `reset_prefix_cache()` allocation-order request, and ID-only request-logging proposal (#64654) all point to the same workload shape: **long-lived sessions where weight updates, prefix caching, and observability interact badly.** SGLang's Agentic Cache Scheduling roadmap (#43098) addresses the same problem from the router side. *Application developers building agent rollout infrastructure should design for cache invalidation and weight-reload semantics now, before these land.*

**What agent/application developers should watch:**
1. **vLLM #54477 and #64654** — direct weight reload for RL and gateway-friendly request lifecycle logging.
2. **SGLang

---

## Per-Project Reports

<details>
<summary><strong>vLLM</strong> — <a href="https://github.com/vllm-project/vllm">vllm-project/vllm</a></summary>

# vLLM Digest — 2026-11-02

## 1. Today's Highlights
No new releases landed in the last 24h, but activity is heavy on correctness and performance: a substantial RFC on **direct weight reload for RL training** (#54477) was revised after validation across 17 model families, batch-invariance work continues across NVFP4/GPTQ kernels, and a long-standing **Rust frontend feature-parity roadmap** (#44280, 50 comments) remains the most-discussed item. On the stability side, several engine-crash bugs are active: an async-scheduling preemption `KeyError` (#63549), a KV-connector load-failure crash on hybrid-KV models (#45474), and a Realtime ASR scheduler assertion (#35755).

## 2. Releases & Breaking Changes
None — no releases in the last 24h.

Adjacent developer-facing notes:
- **Tool-calling/offline examples**: PR #55993 fixes "ghost `demo.py`" usage strings that referenced a nonexistent CLI in `chat_with_tools_offline.py` and the Mistral multimodal offline example — check your scripts if you copied from those examples. [PR #55993](https://github.com/vllm-project/vllm/pull/55993)
- **Quantization docs drift**: the out-of-tree quantization plugin guide still references the removed `FusedMoE` class and an outdated MoE API. [Issue #62187](https://github.com/vllm-project/vllm/issues/62187)
- **`--override-generation-config` semantics**: PR #45978 fixes special-token fields not being merged as documented. [PR #45978](https://github.com/vllm-project/vllm/pull/45978)

## 3. New Model & Hardware Support
- **Rust frontend**: still experimental behind `VLLM_USE_RUST_FRONTEND=1`; roadmap tracks Python-parity gaps. [Issue #44280](https://github.com/vllm-project/vllm/issues/44280)
- **DeepSeek-V4 / V4.1**: batch-invariant sparse-indexer path (sorted top-k indices to avoid reduction-order divergence). [PR #64441](https://github.com/vllm-project/vllm/pull/64441) · multi-image vision encoder packing via `forward_packed`. [PR #65030](https://github.com/vllm-project/vllm/pull/65030)
- **MiniMax-M3.1**: reserve MSA Q8KV4 (NVFP4 KV) sparse prefill workspace during load so profiling accounts for it. [PR #64856](https://github.com/vllm-project/vllm/pull/64856)
- **Mistral**: map `developer` role → `system` in `MistralRenderer` (fixes `ValidationError` under `--tokenizer-mode mistral`). [PR #65031](https://github.com/vllm-project/vllm/pull/65031)
- **Open requests**: SM120 (RTX 5090 / RTX PRO 6000) support for DeepSeek-V4. [Issue #40802](https://github.com/vllm-project/vllm/issues/40802) · prebuilt CPU-only wheels for basic testing. [Issue #23096](https://github.com/vllm-project/vllm/issues/23096) · BitNet/ternary formats. [Issue #33142](https://github.com/vllm-project/vllm/issues/33142)

## 4. Performance & Optimization
- **ROCm / MI355X**: FlyDSL decode monokernel for DSpark verify steps (`--monokernel`) persistent-launches decoder layers 1–60 across 1–16 requests. [PR #63440](https://github.com/vllm-project/vllm/pull/63440) · fused DSpark draft sampling (markov GEMV + sample epilogue) on gfx950. [PR #63181](https://github.com/vllm-project/vllm/pull/63181)
- **Qwen3-Next/Qwen3.5**: enable the fused QK-norm+RoPE+gate Triton kernel on ROCm (currently CUDA-gated). [PR #51406](https://github.com/vllm-project/vllm/pull/51406)
- **DeepSeek-V4.1**: vectorized first-layer HC expansion copy (Triton `hc_expand`). [PR #64816](https://github.com/vllm-project/vllm/pull/64816) · FlashInfer autotune now covers the sparse indexer `wq_b` MXFP8 GEMM (previously never tuned). [PR #60543](https://github.com/vllm-project/vllm/pull/60543)
- **Regression watch**: ~**18% pooling throughput regression** starting with torch 2.11 (vLLM v0.20.0+), reproduced on H100 PCIe. [Issue #52630](https://github.com/vllm-project/vllm/issues/52630)
- **Benchmarking infra**: RFC proposes "Bring-Your-Own-GPU" reproducible evals/benchmarks attached to PRs to unblock perf/accuracy-sensitive reviews. [Issue #61698](https://github.com/vllm-project/vllm/issues/61698)

## 5. Stability & Regressions
Ranked by severity (engine-level failures first):
1. **Async scheduling + preemption crash** — `KeyError` on `all_token_ids[req_id]` in Model Runner V1 `_update_states`; present on current main (`c9dbc92`). Qwen3.5-35B-A3B on Ascend 910B. [Issue #63549](https://github.com/vllm-project/vllm/issues/63549)
2. **Hybrid-KV KV-connector load failure kills EngineCore** — `_update_requests_with_invalid_blocks` assumes a single KV cache group; hits DeepSeek-V4-Flash. [Issue #45474](https://github.com/vllm-project/vllm/issues/45474)
3. **Realtime ASR streaming** — `AsyncScheduler` assertion (`num_output_placeholders` underflow) crashes EngineCore with `/v1/realtime` + Qwen3-ASR. [Issue #35755](https://github.com/vllm-project/vllm/issues/35755)
4. **MoE kernel import failure** — `_moe_C` missing `topk_softmax` on Qwen3-30B-MoE (v0.10.0). [Issue #22225](https://github.com/vllm-project/vllm/issues/22225)
5. **TurboQuant long-context workspace** — continuation prefill needs 12 MB vs 3.06 MB allocated beyond ~4096 tokens (Blackwell SM120, Qwen3.6-27B NVFP4). [Issue #43357](https://github.com/vllm-project/vllm/issues/43357); related closed report [#41565](https://github.com/vllm-project/vllm/issues/41565)
6. **Correctness**: Qwen3.5 FLA linear-attention tensor format mismatch → gibberish output. [Issue #38643](https://github.com/vllm-project/vllm/issues/38643) · GLM-5.x stale top-k indices at PP stage starts (closed). [Issue #63170](https://github.com/vllm-project/vllm/issues/63170) · KV block corruption under rapid LoRA adapter alternation. [Issue #38606](https://github.com/vllm-project/vllm/issues/38606)
7. **Tokenization**: byte-fallback corruption in Tekken Mistral tokenizers with `skip_special_tokens=False` — affects `/v1/responses` with tools; fix PR open. [PR #64743](https://github.com/vllm-project/vllm/pull/64743)
8. **Reliability/ops gaps**: `/health` only reports process liveness, not GPU faults (feature request). [Issue #36960](https://github.com/vllm-project/vllm/issues/36960) · `NixlPushModeConnector` reliability inventory for large-scale/llm-d/Dynamo deployments. [Issue #48633](https://github.com/vllm-project/vllm/issues/48633) · `vllm_compile_cache.py` non-atomic write can corrupt the index; fix PR open. [PR #62737](https://github.com/vllm-project/vllm/pull/62737)

## 6. What This Means for Application Developers
- **RL / agent rollout loops**: the revised direct-weight-reload RFC (#54477) and the `reset_prefix_cache()` allocation-order request (#40244) are the two threads to follow — both target long-running rollout sessions where weight updates and prefix caching interact badly.
- **Tool-calling on Mistral**: upgrade urgency is moderate — the `developer`-role fix (#65031) and byte-fallback fix (#64743) both affect `/v1/responses` with tools. If you serve Tekken-based Mistral models and use `skip_special_tokens=False`, expect non-ASCII corruption until #64743 lands.
- **If you run preemption + async scheduling**, pin to a known-good build or disable async scheduling; #63549 is a hard crash on main.
- **Multi-image vision workloads** (DeepSeek-V4/V4.1) will see fewer encoder passes once #65030 merges.
- **Health-check your gateways defensively**: `/health` won't detect GPU faults (#36960). Pair liveness with an actual generation probe behind your LLM gateway.
- **Observability ask**: ID-only request logging with lifecycle events (#64654) is proposed for gateway correlation, including aborted streams — relevant if you're building a gateway on top of vLLM.

</details>

<details>
<summary><strong>SGLang</strong> — <a href="https://github.com/sgl-project/sglang">sgl-project/sglang</a></summary>

# SGLang Digest — 2026-11-02

## 1. Today's Highlights

No new releases landed in the last 24h, but activity remains intense across three axes: an escalating **SM120 (Blackwell RTX PRO 6000) attention backend problem** for GLM-5.3-Flash and DeepSeek-V4, **substantial NVIDIA Blackwell SM100 kernel work** (NVFP4 DualGEMM+SwiGLU, PDL-safe GEMM, fused MoE), and a growing cluster of **DSV4.1 stability issues** including a scheduler crash and allocator OOMs. A large volume of stale `[inactive]` issues were closed, indicating active triage and cleanup of the backlog.

## 2. Releases & Breaking Changes

No new releases in the last 24h.

Nothing formally breaking, but note the in-progress **environment variable rename** in [#47804](https://github.com/sgl-project/sglang/pull/47804): nine `SGLANG_Q35MF_*` switches (with internal fragments like `EDGE`, `MKH_N3B`) are being renamed to `SGLANG_OPT_*` conventions. If you have deployment scripts pinning those env vars, plan for migration.

## 3. New Model & Hardware Support

- **[Feat] [AMD] MiniMax-M3.1-Flash on MI350X/MI355X (gfx950)** — [#46693](https://github.com/sgl-project/sglang/pull/46693). Callsite PR; kernel stack (#46690 attention, #46691 MoE/GEMM, #46692 quick all-reduce) is already merged. A companion indexer-CP PR for DSpark verify on NVFP4 index cache is at [#46694](https://github.com/sgl-project/sglang/pull/46694).
- **[Perf] [NPU] mlaprolog for Kimi K3** — [#47373](https://github.com/sgl-project/sglang/pull/47373). Enables MLAProlog for Kimi K3's no-RoPE MLA on Ascend, with BF16 and MXFP8 projection weights and BF16 KV cache.
- **[Feat] [NPU] sparse-kv offload with PD disaggregation and LRU caching** — [#43579](https://github.com/sgl-project/sglang/pull/43579).
- **[RFC] [XPU] paged-experts for Intel XPU with Lookahead Expert Scheduling (LES) and SSD tier** — [#46520](https://github.com/sgl-project/sglang/issues/46520). Extends #42557's paged-expert seams to Intel GPUs and a new storage tier.
- **[Feature] Qwen3.5 sequence-classification support requested** — [#41110](https://github.com/sgl-project/sglang/issues/41110).
- **[RFC] Apple Silicon serving redesign** — [#32321](https://github.com/sgl-project/sglang/issues/32321). Torch-owned SRT path with an exported whole-model MLX region; implementation tracked in PR #36164.
- **[RFC] SGLang dLLM serving roadmap** — [#39499](https://github.com/sgl-project/sglang/issues/39499). Block-diffusion serving; correctness fixes on main take priority over new features.

## 4. Performance & Optimization

- **[NVIDIA] SM100 NVFP4 DualGEMM+SwiGLU, PDL-safe GEMM, Grouped GEMM, Fused MoE** — [#47589](https://github.com/sgl-project/sglang/pull/47589). Targets ModelOpt NVFP4 (`w4a4`, E2M1-packed, E4M3 block scales) dense MLPs (`LlamaMLP`, `Qwen2MLP`, `Qwen3MLP`) and MoE grouped GEMMs on B200, where extra kernel overhead is currently incurred.
- **[NVIDIA] RMSNorm: single SM100-tuned JIT template** — [#47503](https://github.com/sgl-project/sglang/pull/47503). Replaces flashinfer CuTe-DSL kernels on the CUDA JIT path for plain, fused residual-add, and per-tensor FP8 quant variants.
- **[NVIDIA] Qwen3 prefill QK norm + RoPE fusion with contiguous Q** — [#47785](https://github.com/sgl-project/sglang/pull/47785).
- **[NVIDIA] TP4 NVFP4 serving bundle** — [#47807](https://github.com/sgl-project/sglang/pull/47807). Seven changes from a hybrid full+SWA, DFLASH, LayerNorm-SP, HiCache deployment; includes two startup bug fixes and three perf improvements.
- **[AMD] GDN prefill prep + Triton recurrence for Qwen3.5** — [#38806](https://github.com/sgl-project/sglang/pull/38806). ROCm was materializing strided views that #36267 had eliminated on CUDA.
- **openai endpoint: reuse encoded prompt segments** — [#42187](https://github.com/sgl-project/sglang/pull/42187). Avoids re-rendering/retokenizing unchanged chat history on agent turns, which can block the API event loop.
- **Diffusion: O(1) free-list sets in BuddyAllocator, deque in DisaggMetrics** — [#47805](https://github.com/sgl-project/sglang/pull/47805). Removes linear-time ops from the disaggregated multimodal transport path.
- **Agentic Cache Scheduling roadmap (Q4)** — [#43098](https://github.com/sgl-project/sglang/issues/43098). Supernode-wide L1/L2 KV cache sharing across engines with router-side cache-location awareness. Worth watching if you operate multi-engine clusters.

## 5. Stability & Regressions

Ranked by severity:

**Critical**
- **DSV4.1 Flash scheduler crash under concurrent aborted streams** — [#47218](https://github.com/sgl-project/sglang/issues/47218). `items_offset_list` is `None` in the multimodal embedding path; takes down all TP/EP workers and restarts the serving container. No linked fix PR.
- **DSV4.1 Flash + DSPARK CUDA caching allocator exhaustion** — [#43486](https://github.com/sgl-project/sglang/issues/43486). OOM crash every 15–25 min under sustained max-batch decode despite KV pool at only 29% utilization. Strongly suggests fragmentation rather than genuine capacity exhaustion.
- **GLM-5.3-Flash on SM120: fa4 backend crashes at CUDA-graph capture** — [#42012](https://github.com/sgl-project/sglang/issues/42012). Hybrid extend reshape failure; triton is currently the only working backend. No fix PR.
- **EAGLE (native Qwen3.5/3.8 MTP) hang on Ampere** — [#35822](https://github.com/sgl-project/sglang/issues/35822). Hangs in `tree_speculative_sampling_target_only` at 100% GPU util / low power, TP=2 on 2× A2.

**High**
- **DSV4.1 `deepseek-recipe` prompt rendering diverges from checkpoint's `encoding.py`** — [#46348](https://github.com/sgl-project/sglang/issues/46348). Differences in tool namespaces, current-turn reasoning placement relative to tool results. Prompt-rendering mismatches are silent quality regressions — verify against reference tokenization.
- **SM120 DeepSeek-V4-Flash prefill throughput gap** — [#33422](https://github.com/sgl-project/sglang/issues/33422). ~2–7K tok/s observed vs ~12.5K via vLLM/marlin on identical 4× RTX PRO 6000 hardware. Still open; no root cause identified.
- **DSV4.1 Flash unstable FullTopK index order in C1/C2 decode on SM120** — [#46798](https://github.com/sgl-project/sglang/issues/46798).
- **ROCm diffusion: Qwen-Image 2.1 VAE decode non-deterministic at 1024×1024** — [#47801](https://github.com/sgl-project/sglang/issues/47801). Root-caused to math SDPA in the ROCm 7.2.1 PyTorch build (ROCm/pytorch#3931).

**Moderate (fix or triage activity)**
- **sgl_kernel aarch64 wheel ships `infllm_ops` as cp310-tagged extension inside an abi3 wheel** — [#37640](https://github.com/sgl-project/sglang/issues/37640). Unimportable on Python ≠ 3.10, and carries no sm_121 code. Closed as inactive but the packaging defect is real.
- **CUDA Coredump Tracker** — [#26340](https://github.com/sgl-project/sglang/issues/26340). Now at 352 comments; auto-collected from pr-test.yml. Tells you CI-side coredump frequency remains chronically high.
- **CRIU restore breaks Prometheus CPU metrics** — [#44477](https://github.com/sgl-project/sglang/pull/44477) and [#44494](https://github.com/sgl-project/sglang/pull/44494). Negative deltas after restore terminate the scheduler or monitoring thread. Fix PRs open.
- **remote_instance weight loading with `--pp-size 2`** — [#37216](https://github.com/sgl-project/sglang/issues/37216). TransferEngine info keyed by `tp_rank`; closed inactive.
- **OOT fused ops under torch.compile** — [#47229](https://github.com/sgl-project/sglang/pull/47229). Fix PR in flight for out-of-tree platform plugin registration.

## 6. What This Means for Application Developers

- **SM120 (RTX PRO 6000 / Blackwell workstation) is not production-ready for GLM-5.3-Flash or DeepSeek-V4.** Two of the most severe open bugs — the fa4 CUDA-graph crash and the prefill throughput gap — are both SM120-specific. If you're evaluating RTX PRO 6000 for cost-efficient serving, budget time for backend triage (triton works but is the fallback path) or wait for the kernel-coverage roadmap issues (#19637, #30272).
- **DeepSeek-V4.1 deployments need memory-fragmentation monitoring.** The 29%-KV-pool OOM in #43486 is the tell: if your allocator OOMs while the KV pool is under a third full, the problem is fragmentation, not capacity. Watch for a fix before running sustained max-batch decode.
- **What looks like a prompt bug is often a rendering-pipeline divergence.** If you serve DeepSeek-V4/V4.1 through `deepseek-recipe` and see degraded tool-calling or reasoning quality, compare your token IDs against the checkpoint's own `encoding.py` (#46348). Prompt-rendering mismatches don't show up as errors.
- **Agent chat workloads will get cheaper.** The openai endpoint prompt-segment reuse in #42187 directly targets the pattern where every agent turn re-tokenizes the full conversation history — a real event-loop blocker at scale.
- **If you operate multi-engine clusters, watch the Agentic Cache Scheduling roadmap** (#43098). Supernode-wide L1/L2 KV sharing plus router cache-location awareness could materially change your cache-hit economics and request-placement logic.
- **CRIU-based preemption or checkpointing + Prometheus metrics is currently unsafe** (#44477, #44494). The scheduler or metrics thread can die on restore. Fix PRs are open; avoid enabling metrics with CRIU until they land.
- **Pin your `SGLANG_*` env vars carefully** — the `SGLANG_Q35MF_*` → `SGLANG_OPT_*` rename in #47804 is in progress and deployment manifests referencing the old names will silently lose those switches.

</details>

<details>
<summary><strong>llama.cpp</strong> — <a href="https://github.com/ggml-org/llama.cpp">ggml-org/llama.cpp</a></summary>

# llama.cpp Digest — 2026-11-02

## 1. Today's Highlights

A burst of backend-specific fixes landed today: SYCL gained proper LevelZero discovery via PkgConfig (b12032), OpenCL picked up initial IQ3_S support including Adreno-tuned GEMM/GEMV paths (b12031), and Hexagon fixed a 24-bit DMA stride overflow that silently corrupted large-stride transfers (b12030). Meanwhile, the issue tracker is dominated by SYCL multi-GPU tensor-split problems — crashes, memory accounting gaps, and a new report of 100–1000× slowdowns with `--cpu-moe` — suggesting SYCL `--split-mode tensor` is not yet production-ready on Intel multi-Arc setups. On the PR side, the long-running unified-KV flash attention work ([#29510](https://github.com/ggml-org/llama.cpp/pull/29510)) continues to attract attention, alongside new per-size CUDA graph arenas ([#31156](https://github.com/ggml-org/llama.cpp/pull/31156)) targeting speculative decode.

## 2. Releases & Breaking Changes

No API-breaking changes or migration notes in today's release stream (b12027–b12032). Notable release-level content:

- **b12032** — SYCL: use PkgConfig for LevelZero includes/libs ([#31076](https://github.com/ggml-org/llama.cpp/pull/31076)). Build-system improvement; packagers relying on hardcoded LevelZero paths should re-verify their toolchain.
- **b12031** — OpenCL: initial IQ3 support ([#31338](https://github.com/ggml-org/llama.cpp/pull/31338)), with AOS/SOA `mv` kernels and a noshuffle GEMM/GEMV path for Adreno.
- **b12030** — Hexagon: fix DMA transfers with strides > 24 bits ([#31442](https://github.com/ggml-org/llama.cpp/pull/31442)). Correctness fix for v75+ targets.
- **b12029** — mtmd: fix InternVL CLS token order ([#30886](https://github.com/ggml-org/llama.cpp/pull/30886)). Vision-model users should upgrade if using InternVL.
- **b12028** — tests: enable Gemma 4 in `test-llama-archs` ([#31401](https://github.com/ggml-org/llama.cpp/pull/31401)).
- **b12027** — llama: enable tensor split for LFM3 ([#31431](https://github.com/ggml-org/llama.cpp/pull/31431)).

## 3. New Model & Hardware Support

- **OpenCL / IQ3_S**: first IQ3 quantization support on the OpenCL backend, including Adreno-specific kernels — relevant for Qualcomm mobile/edge inference. [#31338](https://github.com/ggml-org/llama.cpp/pull/31338)
- **Hexagon (v75+)**: corrected DMA descriptor handling for strides exceeding 24 bits, unblocking large-stride tensor layouts on newer Hexagon DSPs. [#31442](https://github.com/ggml-org/llama.cpp/pull/31442)
- **LFM3**: tensor split now supported, enabling multi-GPU distribution of Liquid Foundation Models. [#31431](https://github.com/ggml-org/llama.cpp/pull/31431)
- **Nemotron 3.5 Transcribe** (in review): mtmd support for NVIDIA's 30B-A4B SALM — offline transcription in 40 languages with prompt context and speaker attribution. [#31471](https://github.com/ggml-org/llama.cpp/pull/31471)
- **Maple-Preview TQ1_0 / TQ2_0 on CUDA** (in review): previously CPU-only ternary formats gaining CUDA kernels. [#31512](https://github.com/ggml-org/llama.cpp/pull/31512)
- **Gemma 4 graph optimizations** (in review): skips compute for layers not contributing to KV, with large prefill gains on E2B/E4B. [#31356](https://github.com/ggml-org/llama.cpp/pull/31356)
- **XDNA backend** request still open with strong community support (39 👍): [#21725](https://github.com/ggml-org/llama.cpp/issues/21725)

## 4. Performance & Optimization

- **MoE expert cache — ClassLRU hybrid** ([#31233](https://github.com/ggml-org/llama.cpp/pull/31233)): replaces SLRU with a decaying-usage, class-ranked cache. Measured **+6% decode on QFN, +7% on GLM, 8% fewer uploads** with a warm cache. Directly relevant to anyone running large MoE models with limited VRAM.
- **Per-size CUDA graph arenas for small batches** ([#31156](https://github.com/ggml-org/llama.cpp/pull/31156)): separate graph results and schedulers for token counts ≤ 8, avoiding graph re-capture on speculative-verify size changes.
- **Unified KV cache flash attention** ([#29510](https://github.com/ggml-org/llama.cpp/pull/29510)): introduces `flash_attn_ext_rows` to avoid mask filtering overhead in multi-sequence inference — still in review, touches CUDA/Vulkan/SYCL/Metal/OpenCL/Hexagon/WebGPU.
- **OpenCL IQ3 on Adreno** ([#31338](https://github.com/ggml-org/llama.cpp/pull/31338)): adds tiled matmul plus noshuffle GEMM/GEMV tuned for Adreno GPUs.
- **CUDA SWIGLU_CLAMP kernel** (PR closed today) ([#31517](https://github.com/ggml-org/llama.cpp/pull/31517)): implemented and validated for packed/strided/contiguous fp32/fp16 tensors.

## 5. Stability & Regressions

Ranked by severity:

1. **SYCL multi-GPU `--cpu-moe` is 100–1000× slower than single-GPU** ([#31510](https://github.com/ggml-org/llama.cpp/issues/31510)) — new today. 5-token prefill takes 165s on a 2× Arc Pro B60 host with all expert weights in host RAM. Severe if you're offloading MoE experts to CPU across multiple Intel GPUs.
2. **SYCL tensor split crashes with `DEVICE_LOST`** ([#27198](https://github.com/ggml-org/llama.cpp/issues/27198)) — 32 comments, long-running. Dual Arc Pro B70, crashes in `dev2dev_memcpy` despite working P2P.
3. **CUDA PTX toolchain regression on sm_75 (Tesla T4)** ([#31503](https://github.com/ggml-org/llama.cpp/issues/31503)) — `server-cuda13` rolling images b11176/b11243/b12030 fail; **b12004 works**. Pin to b12004 or older if you're on T4.
4. **`--spec-type draft-mtp` cuts HIP prefill ~80%** ([#31495](https://github.com/ggml-org/llama.cpp/issues/31495)) — Vulkan unaffected. Avoid MTP speculative decoding on HIP until fixed.
5. **DeepSeek-V4.1-Flash gibberish on Vulkan with `-fa on`** ([#31480](https://github.com/ggml-org/llama.cpp/issues/31480)) — a fix PR exists: probe the fused top-k mask with a graph that actually builds it ([#31505](https://github.com/ggml-org/llama.cpp/pull/31505)).
6. **CUDA backend silently not registered in shared-library builds without `GGML_BACKEND_DL`** ([#31479](https://github.com/ggml-org/llama.cpp/issues/31479)) — no error, no warning, just missing `CUDA0` in `--list-devices`.
7. **SYCL `--fit` under-accounts memory** ([#27595](https://github.com/ggml-org/llama.cpp/issues/27595)) — runtime overflow on Arc B70.
8. **Vulkan performance regression in recent builds** ([#24066](https://github.com/ggml-org/llama.cpp/issues/24066)) — oldest active regression, 49 comments, still open on RX 6600.
9. **MUL_MAT_ID MMVQ failure on Turing with mismatched arch targets** ([#30524](https://github.com/ggml-org/llama.cpp/issues/30524)).
10. **CUDA: Volta crash in `FLASH_ATTN_EXT` tests** — fix PR open ([#31518](https://github.com/ggml-org/llama.cpp/pull/31518)).

Also worth noting: M-RoPE batches read `batch.pos` past `n_tokens` ([#28902](https://github.com/ggml-org/llama.cpp/issues/28902)), and `update_slots()` batch_view offset is not propagated to `ctx_dft` ([#24840](https://github.com/ggml-org/llama.cpp/issues/24840)) — both subtle correctness issues affecting server-side batched inference.

## 6. What This Means for Application Developers

- **Pin your CUDA builds if you're on Tesla T4 / sm_75.** The b11176+ `server-cuda13` images are broken; b12004 is the last known-good. Verify your container tag before upgrading.
- **Avoid SYCL tensor split in production** for multi-Arc deployments. Both correctness (DEVICE_LOST) and performance (100–1000× regression with `--cpu-moe`) issues remain unresolved, and `--fit` memory accounting is unreliable. Single-GPU SYCL is fine.
- **MoE cache users should track #31233.** The ClassLRU hybrid is a free 6–8% decode win with fewer expert uploads — meaningful if you're serving large MoE models on constrained VRAM.
- **Speculative decoding on HIP is currently a net loss** for prefill-heavy workloads. If you rely on MTP draft models, route to Vulkan or disable `--spec-type draft-mtp` until #31495 is fixed.
- **Shared-library builders**: if you set `BUILD_SHARED_LIBS=ON` and `GGML_CUDA=ON` but leave `GGML_BACKEND_DL=OFF`, CUDA will silently disappear. This is a footgun for custom embedding — check `--list-devices` in your CI smoke tests.
- **Server-side batched inference has two open correctness items** (#24840, #28902). If you're building agents that rely on prefix caching or M-RoPE positional handling, keep an eye on these before relying on bit-exact replay semantics.
- **Unified KV cache + multi-sequence agents**: the `flash_attn_ext_rows` work in #29510 is the one to watch — it directly targets the mask-filtering penalty that hurts concurrent agent workloads sharing a KV cache.

</details>

<details>
<summary><strong>Ollama</strong> — <a href="https://github.com/ollama/ollama">ollama/ollama</a></summary>

# Ollama Digest — 2026-11-02

## 1. Today's Highlights

No releases in the last 24h, but issue and PR activity is heavy and centered on **parser correctness** (harmony/gpt-oss-style reasoning, tool-call matching, Cogito thinking), **memory/scheduling** (per-model prompt cache budgets, smarter runner eviction), and **long-context regressions** on `deepseek-r1` and Phi models. Two install/ops papercuts also surfaced: the Linux installer overwriting user-modified systemd units and a default CORS config that allows any local `file://` page to hit the unauthenticated API. Note the volume of parallel PRs from `heyemlee`, `AtharvaKulkarniIT`, and `1-DARK` — this looks like an active sweep of correctness and memory-management fixes rather than a feature push.

## 2. Releases & Breaking Changes

No new releases in the last 24h. In-flight changes with configuration impact:

- **[OPEN] `api: add per-model prompt cache budgets` ([#19450](https://github.com/ollama/ollama/pull/19450))** — introduces an optional `prompt_cache` runner option with `unset` / `0` / `-1` / positive-MiB semantics; forwarded to llama-server and MLX, and triggers runner reload on budget change. This supersedes the global `LLAMA_ARG_CACHE_RAM` / proposed `OLLAMA_CACHE_RAM` approach ([#19435](https://github.com/ollama/ollama/issues/19435)). If merged, expect Modelfile and request-option documentation changes.
- **[OPEN] `Remove file:// from default CORS origins` ([#19443](https://github.com/ollama/ollama/pull/19443))** — drops `file://*` from default `OLLAMA_ORIGINS`. Anyone relying on local HTML files calling the Ollama API will need to opt in explicitly. This is a security fix, not a feature.
- **[CLOSED] `Installing on linux overwrites systemd service file` ([#19451](https://github.com/ollama/ollama/issues/19451))** — installer discarding user service customizations. Closed without a linked PR in the data; verify behavior on your next upgrade if you patch the unit file.
- **[OPEN] `docs(api): clarify keep_alive duration strings` ([#19445](https://github.com/ollama/ollama/pull/19445))** — documents duration strings (e.g. `"10m"`), integer seconds, and `-1` for indefinite loading.

## 3. New Model & Hardware Support

- **[OPEN] `Qwen3.8-27B hybrid-attention GGUFs fail to load` ([#19459](https://github.com/ollama/ollama/issues/19459))** — imported hybrid-attention/MTP Qwen3.8-27B GGUFs error with `qwen3next: layer 64 missing attn_qkv/attn_gate projections`. This is a support gap, not yet a fix.
- **[OPEN] harmony analysis-channel thinking capability ([#19440](https://github.com/ollama/ollama/pull/19440))** — treats GGUF models whose chat template renders reasoning in the harmony `analysis` channel (but whose family isn't `gpt-oss`) as thinking-capable. Unblocks `think` / `reasoning_effort` / `--think` for imports without a Modelfile. Related: LLM-jp-4.1 parser fix ([#18728](https://github.com/ollama/ollama/issues/18728)).
- **[OPEN] Qwen3.5 0.8B `q4_K_M` request ([#19436](https://github.com/ollama/ollama/issues/19436))** — currently only `q8_*` is published for the 0.8B; a `q4_K_M` variant is requested for roughly 2× CPU throughput. No PR yet.
- **[OPEN] Windows ARM64 Gemma3 vision timeout ([#19444](https://github.com/ollama/ollama/issues/19444))** — multimodal encoding stalls on CPU path even for a 128×128 JPEG, on Ollama 0.40.13.

## 4. Performance & Optimization

- **[OPEN] `server: improve scheduler eviction selection` ([#19449](https://github.com/ollama/ollama/pull/19449), fixes [#19326](https://github.com/ollama/ollama/issues/19326))** — evaluates evictions against the pending request's predicted memory and GPU placement at the existing **80% fit threshold**, and among equal keep-alive durations prefers the smallest idle runner that fits rather than blindly LRU-evicting. This is the highest-leverage throughput change in the queue: it should reduce unnecessary reloads under mixed-model load.
- **[OPEN] `api: add per-model prompt cache budgets` ([#19450](https://github.com/ollama/ollama/pull/19450))** — enables per-model `prompt_cache` budgets on llama-server and MLX, including MLX prefix-cache eviction and runner reload on change. Directly addresses the "one shared cache budget" limitation in [#19435](https://github.com/ollama/ollama/issues/19435); MLX currently has a fixed 8 GiB.
- **[OPEN] `Proposal: opt-in per-request token metrics logging` ([#19455](https://github.com/ollama/ollama/issues/19455))** — operators currently must aggregate response metrics themselves to compare prompt-processing throughput and account for cached input. Worth tracking if you build your own dashboards.
- **[OPEN] `mlxrunner: abort generation on token repeat limit` ([#19422](https://github.com/ollama/ollama/pull/19422), partially addresses [#16179](https://github.com/ollama/ollama/issues/16179))** — ports llama-server's repeat limit to the MLX client; aborts after **101 consecutive identical tokens** with `prediction aborted, token repeat limit reached`. Bounds wasted compute on stuck generations.

## 5. Stability & Regressions

Ranked by severity:

1. **[OPEN] Long replies permanently degrade `deepseek-r1:8b` / `phi3.5` / `phi4-mini` / `phi3` 128k ([#19457](https://github.com/ollama/ollama/issues/19457))** — after exceeding `num_ctx`, answers degrade and stay degraded until `ollama stop`. Reportedly a context-shift key-rescaling issue (looks like [#7123](https://github.com/ollama/ollama/issues/7123)); triggers below 23 GiB VRAM and on CPU where default `num_ctx` is 4096. **No fix PR linked.** Highest severity here: silent quality regression, sticky across requests.
2. **[OPEN] Generic tool parser returns mismatched function name/arguments ([#19425](https://github.com/ollama/ollama/issues/19425))** — when a JSON argument contains another registered function's name before the `name` field, the parser selects the wrong function while passing the original call's arguments. **Silent correctness bug in agent tool dispatch.** No fix PR linked, though [#19240](https://github.com/ollama/ollama/pull/19240) (preserving unrecognized tool calls as content) is adjacent.
3. **[OPEN] `/api/embed` context limit is 1–2 tokens too small ([#19446](https://github.com/ollama/ollama/issues/19446))** — `EmbedHandler` queries the wrong metadata keys, so `tokenizer.ggml.add_bos_token` / `add_eos_token` are never read and subtraction is applied unconditionally. **Fix PR exists: [#19447](https://github.com/ollama/ollama/pull/19447).**
4. **[CLOSED] Qwen models terminate the whole chat when thinking ends ([#19424](https://github.com/ollama/ollama/issues/19424))** — `</thinking>` ends the run; closed, presumably fixed elsewhere.
5. **[CLOSED] Gemma3:4b returns empty JSON with long extraction prompt + structured output ([#19427](https://github.com/ollama/ollama/issues/19427))** — schema-constrained extraction collapsing to `{}`; closed.
6. **[OPEN] MLX LFM3-Omni speech cache leak ([#19438](https://github.com/ollama/ollama/pull/19438), fixes [#19437](https://github.com/ollama/ollama/issues/19437))** — repeated `--voice` requests retain KV allocations after caches are freed; reproduced on macOS 0.40.13 with eight short requests.
7. **[OPEN] Windows ARM64 Gemma3 vision timeout ([#19444](https://github.com/ollama/ollama/issues/19444))** — multimodal encoding hangs on CPU; text path fine.
8. **Parser edge cases with fix PRs in flight:** Cogito thinking collected as content when tools present ([#19456](https://github.com/ollama/ollama/pull/19456), fixes [#19403](https://github.com/ollama/ollama/issues/19403)); CRLF `\r` leaking into triple-quoted Modelfile values ([#19431](https://github.com/ollama/ollama/pull/19431), fixes [#19404](https://github.com/ollama/ollama/issues/19404)); `ollama show --modelfile` emitting unrepresentable values ([#19363](https://github.com/ollama/ollama/pull/19363), fixes [#19342](https://github.com/ollama/ollama/issues/19342)).
9. **Infra/API:** `llama-server` stream errors masked by the HTTP 200 pre-header — surfaced now in `Completion` ([#19458](https://github.com/ollama/ollama/pull/19458), partially addresses [#18213](https://github.com/ollama/ollama/issues/18213)); `/v1/chat/completions` 400 on `refusal` content parts ([#19452](https://github.com/ollama/ollama/pull/19452)); `/v1/models` returning `"data": null` when empty ([#19442](https://github.com/ollama/ollama/pull/19442), closed, fixes [#19381](https://github.com/ollama/ollama/issues/19381)); NAT64 DNS64 prefix blocking legitimate pulls ([#19351](https://github.com/ollama/ollama/pull/19351)); installer download resumption ([#19453](https://github.com/ollama/ollama/pull/19453)).

## 6. What This Means for Application Developers

- **Guard your tool dispatch.** [#19425](https://github.com/ollama/ollama/issues/19425) can return a function name that doesn't match the argument object. If you build agents on the generic tool parser, validate that returned `tool_calls[].function.name` is in your registered set and that arguments schema-validate before executing — don't trust the pair.
- **Long-context sessions are still risky.** [#19457](https://github.com/ollama/ollama/issues/19457) means a single long reply on `deepseek-r1` or Phi can poison subsequent turns until you `ollama stop` the model. If you serve these families, set `num_ctx` deliberately, cap reply length, and consider recycling the model on context exhaustion rather than trusting the shift.
- **Embedding context accounting is off by 1–2 tokens.** [#19446](https://github.com/ollama/ollama/issues/19446) means you may hit context-limit errors slightly earlier than expected on models with `add_bos/eos_token=false`. Leave a small margin on chunk sizes until [#19447](https://github.com/ollama/ollama/pull/19447) lands.
- **Multi-model serving gets materially better if [#19449](https://github.com/ollama/ollama/pull/19449) merges** — eviction becomes memory-fit-aware rather than pure LRU, so mixed-model deployments should see fewer reload stalls.
- **Per-model cache budgets are coming ([#19450](https://github.com/ollama/ollama/pull/19450)).** If you currently rely on a single global cache size, plan to migrate to `prompt_cache` per model/Modelfile; semantics for `0`/`-1` will matter when tuning.
- **Hardening your local setup is on you until [#19443](https://github.com/ollama/ollama/pull/19443) ships.** Any local HTML file can currently reach the unauthenticated API via the default `file://*` origin. If you open untrusted local HTML on the same host, set `OLLAMA_ORIGINS` explicitly now.
- **Upgrade caution:** the Linux installer overwriting systemd units ([#19451](https://github.com/ollama/ollama/issues/19451)) is closed but with no visible code fix — if you patch the unit, re-check it after upgrades or manage the service out-of-band.

</details>

<details>
<summary><strong>LiteLLM</strong> — <a href="https://github.com/BerriAI/litellm">BerriAI/litellm</a></summary>

# LiteLLM Digest — 2026-11-02

## 1. Today's Highlights

No releases shipped in the last 24h, but the PR queue is dominated by a large, coordinated effort to move core router and Redis functionality onto a **Rust core** (PRs #49513, #49525, #49591–#49595, #49605–#49607), including an opt-in Rust forwarding server for the proxy. A cluster of **cost-tracking and budget-enforcement bugs** remains open (#48398 1,000,000× cost overbilling, #46874 fallback budget bypass, #39618 crash on null token counts), suggesting meaningful correctness risk in billing paths for teams relying on spend controls.

## 2. Releases & Breaking Changes

None in the last 24h. No new tags, GHCR images, or deprecations were published.

Related background (open, unresolved): GHCR images `v1.94.1` (#35683) and `v1.95.0` (#35684) exist and are cosign-valid but have no matching git tag or GitHub Release — a supply-chain/traceability gap worth noting if you pin images by tag.

## 3. New Model & Hardware Support

- **Linkrra provider (new)** — OpenAI-compatible inference API for open-weight models registered as `linkrra/<model>` ([PR #46012](https://github.com/BerriAI/litellm/pull/46012)).
- **FAL.ai model coverage** — only a hand-curated fraction of FAL's 200+ models are supported; request to move to dynamic discovery ([#34619](https://github.com/BerriAI/litellm/issues/34619), closed/stale).
- **Azure Responses API** — `context_management` (server-side compaction) now forwarded instead of silently dropped under `drop_params: true` ([PR #36399](https://github.com/BerriAI/litellm/pull/36399)).
- **DeepSeek Anthropic route** — `output_config.effort` and adaptive thinking are mis-mapped to `budget_tokens`, which DeepSeek ignores ([#35645](https://github.com/BerriAI/litellm/issues/35645), open).
- No new hardware backends (CUDA/ROCm/Metal/CPU) or quantization formats in this window.

## 4. Performance & Optimization

- **Rust router core** — introduces `RustCore` + `PythonHost` bridge with the host as the sole boundary; intended as a drop-in replacement for the Python core ([PR #49513](https://github.com/BerriAI/litellm/pull/49513), stacked #49591).
- **Rust router stores for cooldowns and global TPM/RPM counters** — Redis key/value/TTL layout is byte-compatible with the Python implementation so old and new pods can share Redis during rolling deploys ([PR #49525](https://github.com/BerriAI/litellm/pull/49525), [#49481](https://github.com/BerriAI/litellm/pull/49481)).
- **Rust Redis client parity** — command results, TTLs and error classification aligned with redis-py 5.3.1, including rotating AWS/GCP/Azure credentials and Sentinel reconnects ([#49189](https://github.com/BerriAI/litellm/pull/49189), [#49509](https://github.com/BerriAI/litellm/pull/49509), [#49510](https://github.com/BerriAI/litellm/pull/49510), [#49589](https://github.com/BerriAI/litellm/pull/49589)).
- **Opt-in Rust forwarding server** on the proxy's public port with a two-process supervisor; Python still handles every request, preserving auth and metrics ([PR #49606](https://github.com/BerriAI/litellm/pull/49606), packaged via [#49605](https://github.com/BerriAI/litellm/pull/49605), Helm/containers via [#49607](https://github.com/BerriAI/litellm/pull/49607)).

No concrete throughput/latency numbers were published alongside these PRs.

## 5. Stability & Regressions

Ranked by severity:

**Critical (billing/spend)**
- **1,000,000× cost overbilling** — provider-reported `usage.cost` trusted as USD without validation; a non-USD or scaled value inflates spend tracking by six orders of magnitude ([#48398](https://github.com/BerriAI/litellm/issues/48398), open). No fix PR referenced.
- **Fallback bypasses team-member budget** — a zero-cost primary with a paid fallback can spend past `max_budget_in_team`; the check added in #41379 doesn't cover the team-member level ([#46874](https://github.com/BerriAI/litellm/issues/46874), open).
- **`cost_per_token` crashes on `None`/string token counts** — real provider responses that omit usage fields raise `TypeError` instead of costing zero, breaking spend tracking ([#39618](https://github.com/BerriAI/litellm/issues/39618), open).
- **`/tag/update` 500s** when the tag already has a budget (`BudgetNewRequest() got multiple values for keyword argument 'budget_id'`) ([#46999](https://github.com/BerriAI/litellm/issues/46999), open).

**High (security / correctness)**
- **Exact-match cache shared across virtual keys and teams** — same model+messages returns another caller's cached response; semantic caches were scoped in 1.106, exact-match was not ([#49313](https://github.com/BerriAI/litellm/issues/49313), open). Cross-tenant data leak.
- **Raw virtual key in cleartext under `user_api_key_hash`** in standard logging metadata emitted to S3 sinks ([#34710](https://github.com/BerriAI/litellm/issues/34710), closed/stale).
- **`pass_through_endpoints` strips `id` from JSON-RPC bodies**, breaking JSON-RPC 2.0 for any passthrough payload due to an internal parameter name collision ([#49479](https://github.com/BerriAI/litellm/issues/49479), open).
- **`RuntimeError: dictionary changed size during iteration`** in `success_handler`/`failure_handler` under concurrent logging ([#34719](https://github.com/BerriAI/litellm/issues/34719), closed/stale).

**Moderate (provider translation)**
- Gemini Flash 3.6 + `image_url` in tool responses ([#35236](https://github.com/BerriAI/litellm/issues/35236)); Fireworks ` thinking` leakage into `content` ([#26326](https://github.com/BerriAI/litellm/issues/26326)); `ollama_chat` streaming emits `finish_reason: stop` instead of `tool_calls` ([#35663](https://github.com/BerriAI/litellm/issues/35663)); DB-backed skills fail with `Missing required parameter: 'tools[0].type'` ([#35594](https://github.com/BerriAI/litellm/issues/35594)); `/cursor/chat/completions` 500s on every streaming request ([#35632](https://github.com/BerriAI/litellm/issues/35632)); `mcp_semantic_tool_filter` drops all tools when clients (e.g. LibreChat) suffix MCP tool names ([#26507](https://github.com/BerriAI/litellm/issues/26507)); Ollama provider resolves global `litellm.api_base` before explicit kwarg ([#26170](https://github.com/BerriAI/litellm/issues/26170)).

**Low**
- `calculate_img_tokens` always returns 85 base tokens for `auto` detail ([#48422](https://github.com/BerriAI/litellm/issues/48422), closed); hanging-request Slack alerts show empty key/team alias ([#34708](https://github.com/BerriAI/litellm/issues/34708), closed); UI shows "Unknown" created_at/by when `model_info` JSON omits those fields ([#35623](https://github.com/BerriAI/litellm/issues/35623)); Interactions spec canary red ([#49038](https://github.com/BerriAI/litellm/issues/49038)).

## 6. What This Means for Application Developers

- **Audit anything relying on spend caps before shipping.** The cost-overbilling (#48398), team-member fallback bypass (#46874) and `cost_per_token` crash (#39618) all sit on the enforcement path. If you use `max_budget_in_team` or per-tag budgets as a hard guardrail, treat it as best-effort until these close, and reconcile against provider invoices.
- **Do not rely on exact-match caching for tenant isolation.** #49313 means key/team scoping is only enforced for semantic caches. If you share a Redis cache across virtual keys, disable exact-match or segregate cache backends per tenant.
- **Plan for a Rust core, but opt in deliberately.** The router-core and forwarding-server work is being landed behind flags with byte-compatible Redis layouts, so rolling deploys across mixed pods should be safe — but the forwarding server changes process topology (two processes, inherited loopback socket). Test supervisor behavior and shutdown semantics in staging before enabling.
- **Watch the router sync/async parity fixes** (#49593–#49595): these correct state leaking across callers/routers/hosts and cooldown recording outside a running event loop — relevant if you use LiteLLM's Router as an SDK library rather than the proxy.
- **Pin by digest, not just tag.** Given the GHCR tag/release mismatch (#35683, #35684), tag-based provenance for signed images is unreliable; use digests and verify cosign signatures explicitly.
- **Provider translation remains the most common source of surprising behavior.** If you use Gemini Flash 3.6 with images in tool results, Fireworks reasoning models, DeepSeek's Anthropic route, Ollama streaming tool calls, or MCP tool filtering with clients that rename tools, verify these paths end-to-end before upgrading.

</details>

<details>
<summary><strong>Unsloth</strong> — <a href="https://github.com/unslothai/unsloth">unslothai/unsloth</a></summary>

# Unsloth Digest — 2026-11-02

## 1. Today's Highlights

No new releases shipped in the last 24 hours, but the PR queue is heavily focused on training-scale parallelism: `UNSLOTH_PARALLEL` (#16407) unifies DP/TP/PP/CP under a single mesh, and FP8 LoRA training (#16423) removes a longstanding restriction. A cluster of Studio stability fixes landed around GGUF loading, hub snapshot pinning, and multi-account CI, while a recurring critical regression around `UNSLOTH_STUDIO_HOME` isolated installs (#16185/#16186) appears to have been closed.

## 2. Releases & Breaking Changes

- None in the last 24h. Note that the `UNSLOTH_STUDIO_HOME` isolated-install overwrite incident ([#16186](https://github.com/unslothai/unsloth/issues/16186), [#16185](https://github.com/unslothai/unsloth/issues/16185)) is now CLOSED — operators relying on per-home venv/cache isolation should still audit existing installs, as the bug could have silently clobbered a baseline venv before the fix.

## 3. New Model & Hardware Support

- **Gemini model enumeration fixed**: the picker was capped at the first page of 20 models and used a family allowlist that hid newer releases (`gemini-4-argon`, `gemini-3.8-flash`, `gemini-3.7-flash`). Fix follows `nextPageToken` and drops the allowlist — [#16433](https://github.com/unslothai/unsloth/pull/16433) (fixes [#16432](https://github.com/unslothai/unsloth/issues/16432)).
- **MoE GGUF config UI**: `MoE Layers on CPU` slider now hidden when `GPU Layers = 0` — [#16429](https://github.com/unslothai/unsloth/pull/16429) (fixes [#16427](https://github.com/unslothai/unsloth/issues/16427)).
- **CLI VLM gap flagged**: `unsloth inference`/`chat` still cannot accept image input, so VLMs can be trained but not exercised from the CLI — [#16340](https://github.com/unslothai/unsloth/issues/16340) (closed, likely triaged). Related: `--trust_remote_code` is not plumbed through the CLI, blocking models like `LiquidAI/LFM3-Omni-2B` — [#16331](https://github.com/unslothai/unsloth/issues/16331).

## 4. Performance & Optimization

- **FP8 LoRA on 16-bit bases** — previously `float8_training` was rejected outright with LoRA. Now the frozen base Linear layers run fp8 forward and input-gradient while adapters train normally: `FastLanguageModel.from_pretrained(..., load_in_4bit=False, float8_training=True)` — [#16423](https://github.com/unslothai/unsloth/pull/16423).
- **Unified parallelism flag** — `UNSLOTH_PARALLEL="dp=2,tp=2,cp=2,fsdp=1"` maps to a single device mesh with a capability registry gating valid combinations; pipeline parallel is now configurable from the environment — [#16407](https://github.com/unslothai/unsloth/pull/16407).
- **Multi-LoRA grouped experts numeric fix** — adapter scale was folded into the second factor before the grouped GEMM in compute dtype, causing fp16 overflow (e.g. rank 1, alpha 16, `B=5000` → `80000 > 65504`). Scale now applied after the second GEMM — [#16414](https://github.com/unslothai/unsloth/pull/16414).
- **Pipeline-parallel GradScaler agreement** — fused Adam/AdamW must agree on `found_inf` once per step so all PP stages skip together — [#16417](https://github.com/unslothai/unsloth/pull/16417).
- **LTX worker memory reporting** — `_memory_stats` now reads RSS in MiB correctly (macOS `ru_maxrss` is bytes, not KiB; `/proc/self/statm` absent on macOS). Prior reports were ~1024× inflated peak — [#16438](https://github.com/unslothai/unsloth/pull/16438).

## 5. Stability & Regressions

Ranked by severity (most severe first); all listed Studio items now have fixes merged or in review:

1. **[Critical, CLOSED] Isolated installs clobber baseline venv** — `UNSLOTH_STUDIO_HOME=<path> ./install.sh --local` silently overwrote an existing baseline venv, breaking cross-home isolation — [#16186](https://github.com/unslothai/unsloth/issues/16186), [#16185](https://github.com/unslothai/unsloth/issues/16185).
2. **[High, CLOSED] GGUF model fails to load from ModelScope** — pinned HF revision 404'd and `_native_files` had no default-branch fallback — [#16263](https://github.com/unslothai/unsloth/issues/16263).
3. **[High, OPEN] Studio On-Device model picker stalls ~20 min** — every cached GGUF re-probed against Hugging Face on open, then timed out — [#16267](https://github.com/unslothai/unsloth/issues/16267). Related hub ref integrity work: [#16422](https://github.com/unslothai/unsloth/pull/16422) keeps `refs/main` on the last complete snapshot under failed updates / concurrent workers.
4. **[High, OPEN] Vulkan unusable on RX 5700 XT (Windows 10 22H2)** — llama.cpp fit step dies with `0xC0000005` before weights load. Fix: retry on GPU with `--fit off` when the fit step crashes — [#16395](https://github.com/unslothai/unsloth/issues/16395) → [#16421](https://github.com/unslothai/unsloth/pull/16421).
5. **[Medium, OPEN] MiniMax-H3 video on Windows crashes with "No available kernel"** under `attention=Auto` when torch lacks flash attention — [#16294](https://github.com/unslothai/unsloth/issues/16294).
6. **[Medium, OPEN] Qwen-Image-2.1 edit/reference regression** — previously seconds, now minutes with system freezing — [#16163](https://github.com/unslothai/unsloth/issues/16163); also fails in Edit/Reference mode — [#16375](https://github.com/unslothai/unsloth/issues/16375).
7. **[Medium, OPEN] Stream interrupted with Bearer Token + OpenAIAPI/OpenCode** — highest-comment issue of the day — [#16317](https://github.com/unslothai/unsloth/issues/16317).
8. **[Low→Medium, fixed] Nonstream clients lose refusal text** — collector discarded `delta.refusal`, yielding empty assistant messages — [#16435](https://github.com/unslothai/unsloth/pull/16435) (closes [#16434](https://github.com/unslothai/unsloth/issues/16434)).
9. **[Low] Chat template mapping ignored** when role key isn't renamed (`{"role":"role","user":"human","assistant":"gpt"}`) — Llama 3.1 emitted `human`/`gpt` headers and ChatML collapsed every turn to system — [#16425](https://github.com/unslothai/unsloth/pull/16425).
10. **[Low] Legacy CLI ignored `--chunk_size`/`--stride`** when `--dataset` was a text file, silently training on 2048-token rows instead of the requested size — [#16424](https://github.com/unslothai/unsloth/pull/16424).
11. **[Low, macOS] `unsloth list-checkpoints --outputs-dir`** traceback for paths outside Unsloth's outputs folder — [#16195](https://github.com/unslothai/unsloth/issues/16195).
12. **CI flakiness (fixed or in review):** multi-account Playwright `/login` race [#16437](https://github.com/unslothai/unsloth/pull/16437), chat-width preset selector [#16431](https://github.com/unslothai/unsloth/pull/16431), hub-source env baseline [#16430](https://github.com/unslothai/unsloth/pull/16430), nested-header linearity test [#16426](https://github.com/unslothai/unsloth/pull/16426), and a risky-loader baseline for the new float8 module [#16428](https://github.com/unslothai/unsloth/pull/16428).

## 6. What This Means for Application Developers

- **Long-context / large-model training gets materially cheaper.** `UNSLOTH_PARALLEL` plus FP8 LoRA on 16-bit bases (#16407, #16423) means you can now scale across DP/TP/PP/CP with a single env var and cut memory on the frozen base path without dropping to 4-bit. If you were previously blocked on `float8_training` + LoRA, retest.
- **Upgrade reward for multi-tenant Studio deployments.** The `UNSLOTH_STUDIO_HOME` isolation regression is closed, and hub `refs/main` handling is now defensive against failed/concurrent downloads (#16422). Pin your `refs/main` after download if you serve cached models offline by repo id.
- **Verify agent/OpenAI-compatible paths.** The Bearer Token + OpenAIAPI stream interruption (#16317) is the most-reported open bug and directly affects anyone proxying Unsloth through OpenCode or similar clients — watch for a fix.
- **Gemini-backed routing is expanding.** After #16433, reloading a Gemini connection will surface far more than 20 models and new families; if you maintain an explicit allowlist, reconcile it.
- **CLI VLM workflows remain incomplete.** Training a VLM via `unsloth train` still can't be validated end-to-end from `inference`/`chat` (#16340), and custom-code models need `--trust_remote_code` (#16331) — plan to validate VLMs through the Python API or Studio instead.

---
*Generated from unslothai/unsloth activity for 2026-11-01 → 2026-11-02.*

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*