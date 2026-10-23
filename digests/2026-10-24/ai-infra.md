# AI Infrastructure Digest 2026-10-24

> Generated: 2026-10-23 23:50 UTC | Projects covered: 6

- [vLLM](https://github.com/vllm-project/vllm)
- [SGLang](https://github.com/sgl-project/sglang)
- [llama.cpp](https://github.com/ggml-org/llama.cpp)
- [Ollama](https://github.com/ollama/ollama)
- [LiteLLM](https://github.com/BerriAI/litellm)
- [Unsloth](https://github.com/unslothai/unsloth)

---

## Cross-Project Comparison

# Cross-Project Comparison Report — AI Infrastructure Ecosystem
**Date: 2026-10-24 | Scope: vLLM, SGLang, llama.cpp, Ollama, LiteLLM, Unsloth**

---

## 1. Ecosystem Overview

The AI infrastructure stack is in a **hardening-and-scale phase**, not a feature-explosion phase. Activity is dominated by large MoE serving (DeepSeek-V4/V4.1, GLM-5.x, Qwen3.8), disaggregated P/D serving correctness, and cross-vendor hardware enablement (AMD MI355X/gfx950, Ascend NPU, Qualcomm Hexagon, T-Head). At the same time, several projects surfaced **silent correctness failures** — KV lease races in vLLM, HiCache scheduler crashes in SGLang, CUDA fp16 overflow in llama.cpp — plus one **critical supply-chain compromise** in LiteLLM (v1.107.0), reinforcing that ecosystem maturity is now gated by operability and supply-chain hygiene as much as throughput. On the training side, Unsloth advanced FSDP2/Ulysses context parallelism, closing the finetune↔serve gap that vLLM's `ParamMeta`/weight-sync RFC is opening on the inference side. Notably, **zero new stable releases landed across the four serving/local runtimes today** — only Ollama (v0.40.10) and Unsloth (v0.1.910-beta) shipped, both model-support releases rather than engine changes.

---

## 2. Activity Comparison

| Project | Issues active (24h) | PRs active (24h) | Release status | Dominant theme |
|---|---|---|---|---|
| **vLLM** | 84 updated | ~500 updated | None (no RFC merge) | DeepSeek-V4 enablement, ROCm MI355X, KV correctness |
| **SGLang** | 42 updated | ~500 updated | None | GLM-5.3 / DSv4.1 tuning, HiCache correctness, NPU/AMD expansion |
| **llama.cpp** | Several high-severity open | Multiple (JQ*_K, Hexagon, SYCL) | **4 builds** (b11835–b11840) | Quant formats, Hexagon DSP, SYCL memory bounds |
| **Ollama** | Multiple cloud/prod bugs | Multiple (MLX, CLI, parser) | **v0.40.10** | Nemotron 3.5 Bolt E4B, cloud reliability |
| **LiteLLM** | High-severity open set | Config refactor series | **None** (v1.107.0 revoked) | Supply-chain incident + spend-accounting fixes |
| **Unsloth** | 16+ tracked | FSDP2 / Ulysses batch | **v0.1.910-beta** | Windows/Linux regressions, FSDP2 training |

**Read:** vLLM and SGLang carry the heaviest PR volume (~500 each) and are the two engines in active **feature race** mode. llama.cpp, Ollama, and Unsloth operate at a different cadence — narrower surface, more frequent releases, more platform-specific bugs. LiteLLM's activity is unusual: dominated by incident response rather than feature work.

---

## 3. Model Support Race

| Model / Architecture | vLLM | SGLang | llama.cpp | Ollama | Unsloth |
|---|---|---|---|---|---|
| **DeepSeek-V4 / V4.1** | ⚠️ SM8x unsupported (open); MegaMoE RL sync | ✅ Official recipe 0.2.0; DSpark tuning | ⚠️ DeepSeek V4 RPC degeneration open | — | ⚠️ `deepseek41-dspark` needs llama.cpp bump |
| **GLM-5.x** | — | ✅ Block-FP8 dense on NVFP4; Hopper tracker | ✅ QSA mask elimination | ⚠️ Cloud degeneration bug | — |
| **Qwen3.8-Flash-Next** | ✅ gfx950/MI355X tracker | ✅ MI355X tracker | ✅ SGN op merged | — | — |
| **Kimi-K3** | ✅ MonoKernel decode (MI355X) | ✅ Ascend NPU + DCP | — | — | — |
| **Gemma 4** | ⚠️ Per-token-head KV quant init failure | — | — | ✅ Nemotron 3.5 Bolt E4B (Gemma 4 VLM) | ✅ Gemma-3-270m training fix (#14482) |
| **Nemotron 3.5 Bolt E4B** | — | — | — | ✅ **Shipped v0.40.10** | ✅ Shipped v0.1.910-beta |
| **MOSS-Image / Flint** | — | — | — | — | ✅ Shipped v0.1.910-beta |
| **Apple Foundation Models** | — | — | — | ⏳ PR #19184 (open) | — |
| **T-Head SAIL / SenseNova** | — | ✅ Roadmap trackers | — | — | — |

**Who's ahead:**
- **SGLang leads on broad model breadth** — DeepSeek-V4.1, GLM-5.3, Kimi-K3 (NPU), SenseNova, T-Head SAIL, SANA-Sprint all tracked or shipping.
- **vLLM leads on depth for frontier MoE** — Kimi-K3 MonoKernel, DSv4.1 MegaMoE, but **Ampere (SM8x) DSv4 support is still a 120-comment open request** — a clear gap for A100 fleets.
- **Ollama and Unsloth shipped the same day** on Nemotron 3.5 Bolt E4B — evidence of parallel, independently-maintained conversion pipelines racing to the same model.
- **llama.cpp is quant-first, model-second** — its JQ*_K series is a quantization competition play, not a model-support play.

---

## 4. Performance Frontier

Optimization effort splits into six distinct battlegrounds:

**KV cache (highest-signal, highest-risk)**
- vLLM: NixlConnector lease-expiry race (silent corruption), hybrid-group hit reconciliation, EPLB load-window accounting. Also **Programmable KV Cache RFC #57103** — composable retention/movement/quota policies for agentic serving.
- SGLang: HiCache + Mooncake L3 crash, `pause_generation(retract)` KV leak, supernode-wide KV sharing (#43098).
- llama.cpp: Intel ~33 GiB reclaimed on 4× Arc Pro B70 (PR #31062); attention-mask elimination saves 2–4 GB.

**Kernels / hand-optimization**
- vLLM MonoKernels (Kimi-K3, MI355X), Qwen3.8 Quark MXFP4, RDNA W4A16 fused Triton.
- SGLang: MegaAttention packed-query fix (137→96 µs B200), persistent multi-CTA counter buffer (−19% to −29% on attention graphs).
- llama.cpp: Hexagon CEIL/SGN ops + KV-head team split for Qualcomm DSP.

**Scheduling / batching**
- SGLang's **shortest-prefill-first chunk reservation** cut TTFT p90 from 4.48 s → 1.52 s (−66%) on agentic sessions — the single largest serving-latency win reported today.
- vLLM: separate prefill/decode CUDA graph sizes (PR #63406) — changes tuning knobs for MRv2.

**Quantization**
- llama.cpp: 5 new JQ*_K types (port of ik_llama.cpp IQ*_K), 4 backend-scoped PRs.
- vLLM: Quark MXFP4, per-token-head KV quant (blocked on Gemma 4).
- SGLang: NVFP4 block-FP8 vs **broken NVFP4 KV + spec-dec** combination.

**Distributed / disaggregated serving**
- Both vLLM and SGLang: P/D separation correctness is the **top risk area today**.
- LiteLLM: latency-based routing degraded to near-random under concurrency (#24720); `Retry-After` ignored for multi-deployment groups (#34399).

**Training/finetuning I/O**
- Unsloth: FSDP2 sharded checkpoint I/O, NF4 dequant reuse, 8-bit AdamW preserved under DTensor (2–4× optimizer memory savings).

---

## 5. Layer Positioning

| Layer | Project | Core value | Failure mode if it breaks |
|---|---|---|---|
| **High-throughput serving engine** | vLLM, SGLang | Frontier MoE serving, P/D disaggregation, hardware breadth | Silent wrong output (KV races), latency collapse |
| **Local / edge runtime** | llama.cpp, Ollama | Consumer hardware, quantized GGUF, DSP/NPU breadth | Silent corruption (CUDA fp16), platform-specific breakage |
| **LLM gateway / control plane** | LiteLLM | Multi-provider routing, spend tracking, AuthN/Z | **Supply-chain RCE**, $0 spend logs, auth cache staleness |
| **Fine-tuning / training** | Unsloth | LoRA/QLoRA, FSDP2, long-context training | Silent CPU fallback, flat training on T4 |

**Key structural observation:**
- **vLLM vs SGLang is a genuine peer race** — same layer, same models, same hardware targets (Hopper/Blackwell/MI355X), converging on P/D + agentic serving. Differentiation is now by hardware-tier depth (vLLM: SM8x gap; SGLang: NPU/DSPARK edge).
- **llama.cpp and Ollama occupy complementary tiers** — llama.cpp is the engine (quant formats, backend breadth), Ollama is the productized runtime (one-command model pull, cloud). Ollama ships models on llama.cpp's cadence.
- **LiteLLM is the only true gateway in the set** — its 2026-10-24 incident illustrates that gateway-layer trust is a distinct threat surface from serving-layer correctness.
- **Unsloth is upstream of serving engines** — its FSDP2/Ulysses advances directly feed the weight-sync contracts that vLLM's `ParamMeta` RFC (#63215) is formalizing.

---

## 6. Trend Signals

**Trend 1 — Agentic serving is the new tuning target.**
Every serving-side optimization today is oriented at long-context, high-concurrency, tool-loop traffic: SGLang's shortest-prefill-first scheduling (TTFT p90 −66%), vLLM's Programmable KV Cache RFC, SGLang's adaptive speculation roadmap, supernode-wide KV sharing. **Watch:** if you run agents, TTFT-p90 and prefill-tail behavior are the metrics that matter this quarter.

**Trend 2 — Silent correctness > crashes as the dominant risk class.**
The three highest-severity issues across the ecosystem all produce wrong output with no error: vLLM NixlConnector KV lease race, llama.cpp CUDA fp16 overflow (Q4_1/Q5_1), SGLang hybrid Mamba prefix divergence. **Watch:** deploy output validation, logit checks, or shadow inference on P/D-separated paths.

**Trend 3 — Supply-chain hygiene is now a first-class ops concern.**
LiteLLM v1.107.0's `cook.pth` credential stealer is the most consequential single event in today's digest. Combined with llama.cpp's unmerged `/tools` hardening (PR #29834 closed without the fix), the message is: **gateways and local servers need WAF-style hardening and pinned digests**, not just version pinning.

**Trend 4 — AMD ROCm/MI355X has crossed into first-class tuning.**
vLLM and SGLang both carry dedicated MI355X trackers (Quark MXFP4, MonoKernel, GatedDeltaNet, DSpark). llama.cpp SYCL reclaims 33 GiB. **Watch:** AITER accuracy caveats at high concurrency (vLLM #60160) and silent CPU fallback on Linux AMD (Unsloth #14906) — the wins are real but validation is still immature.

**Trend 5 — Quantization format competition is active again.**
llama.cpp's 5 new JQ*_K types (four competing PRs) plus vLLM's Quark MXFP4 and SGLang's NVFP4 block-FP8 signal a re-opening of the quant-format wars. **Watch:** model-zoo conversion pipelines will need updates; NVFP4 KV + spec-dec is currently broken in SGLang.

**Trend 6 — Finetune↔serve weight-sync is being standardized.**
vLLM `ParamMeta` weight-ownership RFC (#63215) and DeepSeek-V4.1 MegaMoE in-place reload (#63429) on the serving side meet Unsloth's FSDP2 sharded checkpointing + Ulysses context parallelism on the training side. **Watch:** if you post-train, the trainer-export contract is about to change.

**Trend 7 — Cloud reliability at the local-runtime layer is under strain.**
Ollama Cloud shows three concurrent production issues (503s, `glm-5.3-flash` degeneration, schema-ignored JSON) — an unusual concentration for a typically local-first product. **Watch:** treat cloud-hosted local-runtime endpoints as unreliable for agents with SLAs; keep a local fallback warm.

**Trend 8 — Apple Silicon is bifurcating its inference story.**
Ollama's `applefm` PR (Apple Foundation Models runner) + Unsloth's MLX-first image routing + `unsloth doctor` MLX awareness = three independent moves toward a native Apple inference path distinct from CUDA/ROCm. **Watch:** Apple Silicon serving will stop being "just MLX" within a release cycle.

---

**Bottom line for decision-makers:** the two serving engines (vLLM, SGLang) are in a healthy peer race with real, measurable wins — but both carry unresolved silent-corruption bugs in P/D paths today. The gateway layer just demonstrated it can be the weakest link. Pin by commit, validate outputs, and treat agentic serving metrics (TTFT-p90, prefill tail, KV hit correctness) as the operational KPIs for the quarter.

---

## Per-Project Reports

<details>
<summary><strong>vLLM</strong> — <a href="https://github.com/vllm-project/vllm">vllm-project/vllm</a></summary>

# vLLM Digest — 2026-10-24

## 1. Today's Highlights

A heavy day on the issue tracker (84 updated issues, 500 updated PRs) with no new release. The dominant threads are **DeepSeek-V4-Flash/V4.1 enablement** (SM8x support request with 120 comments, plus DSv4-specific NIXL P/D and RL weight-reload PRs) and **AMD ROCm/MI355X performance work** (Quark MXFP4 kernels, `AiterExperts` refactoring, MonoKernel decodes). A notable cluster of **correctness bugs in KV/prefix caching** — lease-expiry races in NixlConnector, hybrid-group hit reconciliation, and EPLB load-window accounting — suggests the disaggregated serving path is under active hardening.

## 2. Releases & Breaking Changes

No new releases or explicit breaking changes were published in the last 24h.

Two RFCs may introduce behavior changes if merged:
- **#56851 [RFC]** — Request-level text and derender output on `/inference/v1/generate`: proposed change to the disaggregated `render → generate → derender` contract. https://github.com/vllm-project/vllm/issues/56851
- **#57103 [RFC]** — Programmable KV Cache: composable retention/movement/quota policies for agentic serving. https://github.com/vllm-project/vllm/issues/57103
- **#63256 [PR]** — Declares weight ownership/layout on `ParamMeta` (RFC #63215), affecting RL/weight-sync planners. https://github.com/vllm-project/vllm/pull/63256

## 3. New Model & Hardware Support

- **DeepSeek-V4-Flash-0731 on SM8x (A100/A800, RTX 30xx)** — Feature request for Ampere support; neither `DeepSeek-V4-Flash` nor the `-0731` checkpoint currently runs on SM8x per #40851. High engagement (120 comments). https://github.com/vllm-project/vllm/issues/50576
- **Rust frontend parity** — Roadmap tracker for feature-completeness of the experimental Rust API server (`VLLM_USE_RUST_FRONTEND=1`). https://github.com/vllm-project/vllm/issues/44280
- **Specialized MonoKernels** — RFC standardizing per-model hand-optimized decode paths under `vllm/models`, following the Kimi-K3/MI355X work. https://github.com/vllm-project/vllm/issues/60904
- **Kimi-K3 Mono decode (MI355X)** — PR extends MonoKernel to vanilla (non-speculative) autoregressive decode. https://github.com/vllm-project/vllm/pull/61498
- **Gemma 4 + per-token-head KV cache quantization** — Init failure still open. https://github.com/vllm-project/vllm/issues/40388

## 4. Performance & Optimization

- **Qwen3.8-2.4T-A95B on gfx950/MI355X** — Stacked-PR plan for Quark MXFP4 optimization; ongoing. https://github.com/vllm-project/vllm/issues/57149
- **Qwen3.8-Flash-Next on gfx950/MI355X** — GatedDeltaNet/QuerySparse/HyperConnection/MXFP4 MoE tracker. https://github.com/vllm-project/vllm/issues/59575
- **GB10 (DGX Spark) weight loading** — `param.copy_` from safetensors mmap views is slow; per-tensor H2D copies dominate load time. https://github.com/vllm-project/vllm/issues/58726
- **RDNA W4A16 prefill (gfx1151)** — Fused Triton dequant GEMM throughput drops from ~24 → ~10 TFLOP/s at M=8192; PR #61193 switches to dequant+matmul above M=4096. https://github.com/vllm-project/vllm/pull/61193 / https://github.com/vllm-project/vllm/pull/60710
- **CUDA Graph capture sizes** — PR separates prefill (token) and decode (request) graph sizes in Model Runner V2 to reduce eager fallback at serving batch sizes. https://github.com/vllm-project/vllm/pull/63406
- **Batch invariant** — Tracker #27433 still active; `TRITON_MLA` is not batch-invariant under chunked prefill (#60007). https://github.com/vllm-project/vllm/issues/27433 / https://github.com/vllm-project/vllm/issues/60007
- **RL weight sync (DSv4.1 MegaMoE)** — In-place layerwise expert reload to speed up RL sync. https://github.com/vllm-project/vllm/pull/63429 / https://github.com/vllm-project/vllm/pull/60949

## 5. Stability & Regressions

Ranked by severity:

1. **NixlConnector KV lease race (silent data corruption)** — Producer releases KV blocks on lease expiry while a remote READ is in flight; decode consumes overwritten KV with no error. Trade-off: silent wrong output. https://github.com/vllm-project/vllm/issues/61229
2. **Qwen3.8-Flash-Next prompt truncation on GB10** — Content beyond `indexer_budget` (~2048) is invisible; model answers as if the prompt ended. https://github.com/vllm-project/vllm/issues/62776
3. **Kimi-K3 `--kv-cache-dtype fp8` unusable on H200** — Assertion demands `use_prefill_query_quantization`, but setting it does not resolve the error on Hopper. https://github.com/vllm-project/vllm/issues/51313
4. **TRITON_MLA non-batch-invariant** with `VLLM_BATCH_INVARIANT=1` + chunked prefill (DeepSeek-V2-Lite/V3.1). https://github.com/vllm-project/vllm/issues/60007
5. **Inkling on SM120** — Bundled `tml_fa4` lacks paged-KV support. https://github.com/vllm-project/vllm/issues/51405
6. **ROCm Qwen3.8-27B-FP8 accuracy collapse** at high concurrency with `VLLM_ROCM_USE_AITER=1`. https://github.com/vllm-project/vllm/issues/60160
7. **`BaseThinkingReasoningParser.extract_reasoning` discards output** when `` appears mid-stream. https://github.com/vllm-project/vllm/issues/50901
8. **Hybrid Mamba + full-attention prefix-hit divergence** — silent corruption behind capable KV connectors; fix PR open. https://github.com/vllm-project/vllm/pull/54302

Fix PRs exist for #61229-adjacent KV load rejection (#53298), EPLB load-window accounting (#60686), and hybrid-group reconciliation (#54302).

## 6. What This Means for Application Developers

- **Don't assume KV cache hits are trustworthy yet.** The NixlConnector lease-expiry bug and the hybrid-group divergence fix both produce silent wrong-output failures under disaggregated serving. If you're on P/D separation, pin a known-good commit or validate outputs.
- **Long-context requests are not safe everywhere.** The Qwen3.8-Flash-Next/GB10 indexer truncation means prompts exceeding ~2K tokens may be silently ignored — a classic source of evaluation regressions. Audit prompt lengths if you serve long-context workloads on Blackwell/GB10.
- **Ampere A100 users are still waiting on DeepSeek-V4-Flash.** If you have deployed A100/A800 fleets, plan on Hopper/Blackwell or ROCm MI355X for DSv4-family serving; SM8x support is still just an open feature request.
- **ROCm is now a first-class tuning target.** MI355X-specific Quark MXFP4 plans and MonoKernel decode work suggest AMD paths are production-worthy for large MoE serving — but watch for the AITER accuracy caveats at high concurrency.
- **RL/fine-tuning pipelines should watch `ParamMeta`.** The weight-ownership RFC (#63215) and DeepSeek-V4.1 MegaMoE in-place reload (#63429) will change how trainer↔inference weight sync is expressed and are relevant if you run post-training.
- **Prefill/decode CUDA graph sizing is changing (MRv2).** If you tune `--cuda-graph-*` sizes for tail latency, expect the knobs and behavior to split into prefill-token vs decode-request axes.

</details>

<details>
<summary><strong>SGLang</strong> — <a href="https://github.com/sgl-project/sglang">sgl-project/sglang</a></summary>

# SGLang Digest — 2026-10-24

## 1. Today's Highlights

No releases in the last 24h, but activity remains very high: 42 issues and 500 PRs touched. The dominant themes are **GLM-5.3-Flash and DeepSeek-V4/V4.1 performance tuning on Hopper/Blackwell**, **KV-cache and scheduler correctness under HiCache/Mooncake L3 and mixed-chunk scheduling**, and **cross-platform expansion (Ascend NPU, AMD MI355X, T-Head PPU)**. A steady stream of tool-call/parser correctness bugs in the OpenAI- and Anthropic-compatible endpoints continues to demand attention for agent workloads.

## 2. Releases & Breaking Changes

- **No new releases in the last 24h.**
- **Dependency stability concern (closed, unresolved):** [#14930](https://github.com/sgl-project/sglang/issues/14930) — `v0.5.6.post1` still pins the prerelease `transformers==5.0.0rc0`. Relevant if you require reproducible production builds.
- **Config strictness (in-flight):** [PR #44385](https://github.com/sgl-project/sglang/pull/44385) makes `--dllm-algorithm-config` reject unknown keys at startup instead of silently falling back to defaults. If you have typos in dLLM configs, this will now fail loudly.
- **Rust server KV bootstrap change (in-flight):** [PR #46066](https://github.com/sgl-project/sglang/pull/46066) / [PR #46074](https://github.com/sgl-project/sglang/pull/46074) stop aliasing `--disaggregation-bootstrap-port` to `--port` under `SGLANG_RUST_SERVER`. PD-disaggregated deployments on the Rust server should re-check their bootstrap port configuration.
- **New HTTP shutdown flag (in-flight):** [PR #46169](https://github.com/sgl-project/sglang/pull/46169) adds `--http-graceful-shutdown-timeout` for diffusion/http servers.

## 3. New Model & Hardware Support

- **T-Head SAIL (Zhenwu 810/810E/M890P)** — roadmap for first-class upstream support: [#37519](https://github.com/sgl-project/sglang/issues/37519).
- **Kimi-K3 on Ascend NPU with DCP** — decode context parallelism plus DSPARK speculative decoding, sharding MLA KV across DCP ranks: [PR #40825](https://github.com/sgl-project/sglang/pull/40825).
- **SenseNova-U1/U1.5** — feature and performance tracking against the official reference implementation: [#37742](https://github.com/sgl-project/sglang/issues/37742).
- **SANA-Sprint 0.6B** (diffusion, 1–4 step, 1024px) — native SGLang-Diffusion support requested: [#43671](https://github.com/sgl-project/sglang/issues/43671).
- **DeepSeek-V4/V4.1 prompt rendering** — migration to the official `deepseek-recipe` 0.2.0 encoder library for chat rendering/tokenization: [PR #45315](https://github.com/sgl-project/sglang/pull/45315).
- **GLM-5.x block-FP8 dense layers for NVFP4 checkpoints** — opt-in FP8 for attention projections, DSA indexer `wq_b`, shared experts and dense MLPs on Blackwell: [PR #45694](https://github.com/sgl-project/sglang/pull/45694).
- **dLLM serving roadmap** — continued progress on block-diffusion serving, with crash/wrong-result fixes prioritized over new features: [#39499](https://github.com/sgl-project/sglang/issues/39499).

## 4. Performance & Optimization

- **GLM-5.3-Flash on Hopper (SM90)** — dedicated optimization tracker (Q4 roadmap): [#45373](https://github.com/sgl-project/sglang/issues/45373). Interleaved-CP prefills now overlap attention-KV replication with MQA logits/top-k: [PR #46179](https://github.com/sgl-project/sglang/pull/46179).
- **DeepSeek-V4.1 / DSpark decode:**
  - MegaAttention packed query zeroed once per forward instead of per layer — decode 8 tokens: **137 → 96 µs (B200)**, **125 → 84 µs (VR200)**; 8K prefill chunk **11.5 → 6.1 ms** on B200: [PR #46062](https://github.com/sgl-project/sglang/pull/46062).
  - Persistent multi-CTA counter buffer for trtllm-gen attention removes 40 memset graph nodes/step: **34–46 µs faster per 40-attention graph on B200**, **126–139 µs on VR200** (−19% to −29%): [PR #46061](https://github.com/sgl-project/sglang/pull/46061).
  - Scheduler: reserving encoder-replay rows in shortest-prefill-first chunk reservation gives **TTFT p90 4.48 → 1.52 s (−66%)** and **+5% req/s** on TP4/32 concurrent agentic sessions: [PR #46063](https://github.com/sgl-project/sglang/pull/46063).
  - Additional per-step DSpark decode trims: [PR #46176](https://github.com/sgl-project/sglang/pull/46176).
  - Mixed-step verify-merge for DSPARK (1 → ~4.8 tokens/step under mixed-chunk): [PR #41893](https://github.com/sgl-project/sglang/pull/41893).
- **AMD MI355X / gfx950** — Qwen3.8-Flash-Next (GatedDeltaNet, QSA, MXFP4 MoE, NEXTN MTP) performance tracker: [#44304](https://github.com/sgl-project/sglang/issues/44304).
- **Wan diffusion** — patchify latents straight into tokens, avoiding a channel-first round trip: [PR #46148](https://github.com/sgl-project/sglang/pull/46148).
- **LoRA under pipeline parallelism** — better throughput and GPU memory for multi-LoRA serving: [PR #45951](https://github.com/sgl-project/sglang/pull/45951).
- **Speculative decoding** — adaptive speculation roadmap targeting phase-shifting acceptance patterns in agentic workloads: [#23705](https://github.com/sgl-project/sglang/issues/23705).
- **Mixed ChunkPrefill** — scheduling refactor roadmap for prefill/decode co-batching: [#13626](https://github.com/sgl-project/sglang/issues/13626).

## 5. Stability & Regressions

Ranked by severity:

1. **HiCache `buffer_only` + Mooncake L3 scheduler crash** — chunked prefill admitted but unfinishable; "Prefill out of memory" with evictable 0 and every radix node locked. Seen on v0.5.21, GLM-5.3 W4AFP8, 8×H200: [#45989](https://github.com/sgl-project/sglang/issues/45989). No fix PR referenced yet.
2. **Kimi-K3 DCP a2a garbled decode on 2-node GB300** — CUDA-graph + NCCL graph buffer registration produces **12/12 degenerate outputs**; `NCCL_GRAPH_REGISTER=0` restores correctness. Workaround exists, root cause open: [#45367](https://github.com/sgl-project/sglang/issues/45367).
3. **EP2 (tp=2 + ep=2) illegal memory access** on Qwen3.8-Flash-Next-NVFP4 (RTX PRO 6000, sm_120): [#44291](https://github.com/sgl-project/sglang/issues/44291).
4. **NVFP4 KV cache + speculative decoding incompatible** — `extend_prefix_lens_cpu is None` in the FlashInfer dequant workspace on any target-verify step (SM120, NEXTN): [#36010](https://github.com/sgl-project/sglang/issues/36010).
5. **CI flakiness** — long-running tracker for `PR Test Base`/`PR Test Extra` flakes and infra failures, currently 125 comments: [#42752](https://github.com/sgl-project/sglang/issues/42752).
6. **Agentic/API correctness:**
   - GLM tool-call parsers convert JSON `null` into the string `"None"`/`"null"`: [#46037](https://github.com/sgl-project/sglang/issues/46037).
   - Anthropic streaming drops a tool call's closing `}` when whitespace arrives between arguments (qwen3_coder, multi-call): [#42260](https://github.com/sgl-project/sglang/issues/42260).
   - Qwen3CoderDetector streaming emits unterminated JSON when `</function>` is omitted: [#43150](https://github.com/sgl-project/sglang/issues/43150).
   - Anthropic `tool_reference` inside `tool_result` breaks templates without deferred-reference support (HTTP 500): [#35692](https://github.com/sgl-project/sglang/issues/35692).
7. **`pause_generation(mode="retract")` leaks RadixCache KV** — only the request-owned suffix is freed: [#33783](https://github.com/sgl-project/sglang/issues/33783).
8. **Non-causal sliding-window attention ignored in TorchNativeAttnBackend**: [#39300](https://github.com/sgl-project/sglang/issues/39300).

## 6. What This Means for Application Developers

- **Agentic workloads are the optimization target.** Shortest-prefill-first scheduling, adaptive speculation, and supernode-wide KV cache sharing ([#43098](https://github.com/sgl-project/sglang/issues/43098)) are converging on exactly the long-context, high-concurrency, prefill-heavy traffic patterns agents produce. The TTFT p90 improvement above is directly applicable if you run many concurrent sessions.
- **Tool-call parsing is the most fragile surface.** Four separate open bugs affect GLM and Qwen3-Coder parsers on OpenAI- and Anthropic-compatible endpoints, including malformed streaming JSON. If you depend on structured tool calls, pin your model/parser combination and validate streamed arguments before executing them.
- **Quantization combinations are not all validated.** NVFP4 KV cache + speculative decoding is currently broken, and EP2 on NVFP4 sm_120 crashes. Prefer proven combinations (BF16/FP8 KV, standard TP) for production until these trackers close.
- **PD disaggregation on the Rust server needs a config review** before the bootstrap-port change lands.
- **If you serve GLM-5.x NVFP4 checkpoints**, watch [PR #45694](https://github.com/sgl-project/sglang/pull/45694) — block-FP8 dense layers close a real Blackwell performance gap once experts run in FP4.

</details>

<details>
<summary><strong>llama.cpp</strong> — <a href="https://github.com/ggml-org/llama.cpp">ggml-org/llama.cpp</a></summary>

# llama.cpp Digest — 2026-10-24

## 1. Today's Highlights

A dense 24-hour window focused on **backend breadth and correctness**: five new JQ*_K quantization types (a port of ik_llama.cpp's IQ_K lineage) are proposed across CPU/Metal/CUDA/Vulkan/SYCL, while a Hexagon CEIL op and a KV-head team split for multicore HMX flash attention signal continued Qualcomm DSP investment. Meanwhile, several high-severity correctness reports remain open, including CUDA fp16 overflow in Q4_1/Q5_1 mat-vec kernels (NaN logits on gpt-oss) and a Metal BF16 MUL_MAT abort — both are hardware-specific and affect production inference for affected users.

## 2. Releases & Breaking Changes

Four builds rolled out (b11835–b11840); none introduce API or config breaks:

- **b11840** — [hexagon: add CEIL op](https://github.com/ggml-org/llama.cpp) (f32 + f16 variants; `hex-ops` supported-op docs updated).
- **b11838** — [ggml: fix time overflow in `ggml_time_us`](https://github.com/ggml-org/llama.cpp/pull/30969) (switched to `double`; relevant for very long-running server processes).
- **b11836** — [CANN: add missing `const` qualifiers](https://github.com/ggml-org/llama.cpp) (consistency only).
- **b11835** — [sycl: pass device into `mul_mat_uses_onednn`](https://github.com/ggml-org/llama.cpp) (multi-device correctness).

No migration notes required.

## 3. New Model & Hardware Support

- **New quantization formats (proposed):** [JQ2_K through JQ6_K](https://github.com/ggml-org/llama.cpp/pull/30718) — five K-quant types adapted from @ikawrakow's IQ*_K design. Four parallel PRs cover backend tiers: [CPU-only](https://github.com/ggml-org/llama.cpp/pull/30715), [CPU+Metal](https://github.com/ggml-org/llama.cpp/pull/30716), [+CUDA](https://github.com/ggml-org/llama.cpp/pull/30717), and [full CPU+Metal+CUDA+Vulkan+SYCL](https://github.com/ggml-org/llama.cpp/pull/30718). Watch for overlap/merge sequencing.
- **TML "Inkling" architecture:** [open PR](https://github.com/ggml-org/llama.cpp/pull/25731) adds converter, graph build, banded FA kernel, and int64 indexing for large MoEs — aimed at deterministic inference.
- **Vibevoice GGUF conversion:** still unsupported; [enhancement request](https://github.com/ggml-org/llama.cpp/issues/17488) open for TTS fine-tunes.
- **Soprano audio generation (mtmd):** [PR closed](https://github.com/ggml-org/llama.cpp/pull/28607) — Qwen3-backbone audio model conversion path landed.
- **Hexagon:** [KV-head team split for multicore HMX flash attention](https://github.com/ggml-org/llama.cpp/pull/31055) (uses `gcd(n_kv_heads, cores)` teams when head-split is uneven); [SGN op merged](https://github.com/ggml-org/llama.cpp/pull/30346) motivated by Qwen3.8-Flash-Next.

## 4. Performance & Optimization

- **SYCL scratch memory bound:** [sycl: bound reorder temp memory to 32 MiB](https://github.com/ggml-org/llama.cpp/pull/31062) — previously the reorder buffer was sized to the whole tensor. On **4× Arc Pro B70**, `-sm layer -fa on -c 16384` now frees ~**33 GiB** of GPU memory for model layers. This is the most impactful memory win of the day.
- **MoE expert cache offload:** [llama_moe_cache: run missed experts on CPU](https://github.com/ggml-org/llama.cpp/pull/30966) adds `--moe-cache-cpu-share` plus a tuning script. Decode speed depends on CPU expert-read bandwidth; see PR for benchmarks.
- **Vulkan tensor-parallel allreduce:** [open PR](https://github.com/ggml-org/llama.cpp/pull/25051) adds an F16 AllReduce and fixes pipeline crashes.
- **HIP/SPIR-V build fixes:** [byte-permute fallback](https://github.com/ggml-org/llama.cpp/pull/30915) and [bf16 WMMA operand type fix for gfx11/gfx12](https://github.com/ggml-org/llama.cpp/pull/30885) — 66/145 HIP files previously failed under amdgcnspirv.
- **Attention mask elimination:** [glm5-next QSA without kq_mask](https://github.com/ggml-org/llama.cpp/pull/31009) saves 2 GB (ub 4096) / 4 GB (ub 8192) memory, following the same trick in qwen4exp (#30965).
- **Vulkan RDNA3 regression (closed):** [severe prompt-processing slowdown after b10780](https://github.com/ggml-org/llama.cpp/issues/28752) — closed but worth auditing if you pin Vulkan builds.

## 5. Stability & Regressions

Ranked by severity:

1. **CUDA fp16 overflow in legacy-quant mat-vec — silent corruption** ([#30950](https://github.com/ggml-org/llama.cpp/issues/30950), OPEN): Q4_1/Q5_1 kernels overflow fp16 when multiplying block offset by Q8_1 block sum. Reproduces on b11538 and current master (b11803) with gpt-oss; symptom is emitted "G" tokens and NaN logits. **No fix PR linked — treat these quant types as unsafe on CUDA.**
2. **SYCL F16 NaN on Qwen3.8-27B Q4_K_M** ([#30892](https://github.com/ggml-org/llama.cpp/issues/30892)): regression since #29107 (IQ3 code reorder) on Arc Pro B70; disabling fused GEMM works around it. OPEN, no fix.
3. **Metal BF16 MUL_MAT abort** ([#30973](https://github.com/ggml-org/llama.cpp/issues/30973)): hard abort for BF16 src1 at K≥64, batch>8; no BF16 `mul_mm` kernel exists. OPEN.
4. **CUDA illegal memory access w/ flash attention on Gemma 4 (win builds)** ([#30436](https://github.com/ggml-org/llama.cpp/issues/30436)): affects both cuda-12.4 and cuda-13.4 Windows releases; `-fa off` works. OPEN.
5. **RPC: DeepSeek V4 degeneration on 2-worker setups** ([#30794](https://github.com/ggml-org/llama.cpp/issues/30794)): repeated-token collapse after long prompts; slot stays corrupted. OPEN.
6. **Gated DeltaNet / Qwen3.5-122B on sm_70** ([#29783](https://github.com/ggml-org/llama.cpp/issues/29783)): instant kernel-launch rejection on V100. OPEN.
7. **Context checkpoint invalidation on hybrid/recurrent models** ([#24055](https://github.com/ggml-org/llama.cpp/issues/24055), 21 comments): long-standing, stale, and still the top-commented issue — continues to affect prompt-cache efficiency for Qwen/DeltaNet-class models.
8. **`--tensor-split` MoE degeneration** ([#28185](https://github.com/ggml-org/llama.cpp/issues/28185)) and **qwen4exp QSA top-k nondeterminism on CUDA** ([#28497](https://github.com/ggml-org/llama.cpp/issues/28497)) — both closed/stale, but reflective of a pattern: long-context MoE + multi-GPU on CUDA has several sharp edges.
9. **Security:** WebUI `?q=` instruction injection still open ([#25790](https://github.com/ggml-org/llama.cpp/issues/25790)); a related hardening PR — [reject cross-origin/non-JSON requests to `/tools`](https://github.com/ggml-org/llama.cpp/pull/29834) — was **closed without merge leading the fix**, so `POST /tools` still lacks Origin/Content-Type validation upstream of the CORS layer.
10. **Build noise:** [ggml_cuda_graph `instance` member missing](https://github.com/ggml-org/llama.cpp/issues/31056) and [mma.cuh gfx1151 clang 23 failure](https://github.com/ggml-org/llama.cpp/issues/30839) — both closed.

## 6. What This Means for Application Developers

- **Pin your builds by backend, not just version.** The most dangerous open issue ([#30950](https://github.com/ggml-org/llama.cpp/issues/30950)) produces **silently wrong output**, not a crash. If your stack uses Q4_1/Q5_1 GGUF files on CUDA, validate logits or fall back to Q4_K_M until a fix lands.
- **If you run Intel Arc / SYCL at scale,** upgrading to b11840+ plus [PR #31062](https://github.com/ggml-org/llama.cpp/pull/31062) is a large win — ~33 GiB reclaimed per multi-GPU node materially changes how much context and how many layers you can serve.
- **MoE caching is maturing.** [#30966](https://github.com/ggml-org/llama.cpp/pull/30966) gives you a CPU-spill knob for expert caches. Combined with the mask-memory savings in [#31009](https://github.com/ggml-org/llama.cpp/pull/31009), expect MoE serving configs to shift meaningfully in the next few weeks.
- **Watch the JQ*_K series.** Five new quant tiers with four competing backend-scoped PRs is a sign of active quantization competition; if you maintain a model zoo, plan for a conversion-pipeline update once they merge.
- **For agent/gateway deployers:** the `/tools` security posture remains unhardened upstream. If you expose llama-server beyond localhost, put it behind a reverse proxy that enforces Origin and Content-Type, and do not rely on the built-in CORS headers.
- **Long-context hybrid/recurrent models still don't cache well** ([#24055](https://github.com/ggml-org/llama.cpp/issues/24055)). If you're building agent memory on top of Qwen/DeltaNet-class models, budget for full prefills or implement application-level checkpointing rather than depending on server-side context checkpoints.

</details>

<details>
<summary><strong>Ollama</strong> — <a href="https://github.com/ollama/ollama">ollama/ollama</a></summary>

# Ollama Digest — 2026-10-24

## 1. Today's Highlights

Ollama shipped **v0.40.10**, headlined by **NVIDIA Nemotron 3.5 Bolt E4B** — a Gemma 4-based vision-language model with a 128K-token context window. Meanwhile, the issue tracker shows escalating production pain on **Ollama Cloud**, with a new 503-reliability report joined by a serious degeneration bug on `glm-5.3-flash:cloud` and a developer-role rejection on `mistral-large-4`. On the engineering side, a cluster of scheduler/eviction bugs and tool-call parsing fixes landed or are in review.

## 2. Releases & Breaking Changes

- **[v0.40.10](https://github.com/ollama/ollama/releases)** — Adds Nemotron 3.5 Bolt E4B (see §3). No documented breaking changes in this release.
- **No API/config schema changes landed today.** Note that the following are active, unresolved spec-level issues rather than accepted changes — plan around them at your own risk:
  - [`OLLAMA_CONTEXT_LENGTH` not reflected in `/api/show` or `/api/tags`](https://github.com/ollama/ollama/issues/18995) — clients reading advertised context get the model's *native* window, not the effective one.
  - [OpenCode launch uses static context length instead of allocated](https://github.com/ollama/ollama/issues/19172) (closed by [PR #19193](https://github.com/ollama/ollama/pull/19193)), which caused premature compaction.
- **[PR #19248](https://github.com/ollama/ollama/pull/19248)** — Running bare `ollama` with no subcommand now prints help and exits instead of dropping into the interactive menu. Minor CLI behavior change; `ollama launch --help` text updated accordingly.

## 3. New Model & Hardware Support

- **[Nemotron 3.5 Bolt E4B](https://ollama.com/library/nemotron-3.5-bolt)** (v0.40.10) — NVIDIA's compact **Gemma 4-based vision-language model** for local multimodal chat, image understanding, and tool use. 128K context. Includes DFlash (release notes truncated). This is the first major vision tower shipping against Gemma 4.
- **[PR #19184](https://github.com/ollama/ollama/pull/19184)** (open) — Adds an `applefm` runner exposing **Apple Foundation Models** (macOS 27 on-device model + `fm` CLI) as `apple-foundation-model`, compatible with `ollama run`, `/api/chat`, `/api/generate`, and OpenAI-compatible endpoints. Signals a native Apple Silicon inference path distinct from the MLX runner.
- **[PR #19250](https://github.com/ollama/ollama/pull/19250)** — llama.cpp version bump to **b11845** (from b11803).
- **Hardware gaps remain unresolved**: [AMD GPU support on Intel Macs (#1016)](https://github.com/ollama/ollama/issues/1016) and [Snapdragon X Elite NPU/GPU (#5360)](https://github.com/ollama/ollama/issues/5360) are both still open with the highest community visibility today.

## 4. Performance & Optimization

- **[PR #19247](https://github.com/ollama/ollama/pull/19247)** (open) — MLX: preserves small-image detail for compact Gemma 4 vision towers by rounding the smallest image grid up rather than letting dynamic sizing floor it below the intended **70-token budget**. Directly relevant to Nemotron 3.5 Bolt E4B image quality.
- **[PR #17027](https://github.com/ollama/ollama/pull/17027)** (open) — Flushes OpenAI-compatible SSE streaming responses through completion, fixing UI clients (Chatbox, OpenWebUI) that appear to hang despite successful inference.
- **[PR #19234](https://github.com/ollama/ollama/pull/19234)** — Ports Gradium `xn-ptts` English text normalization for the Phonon TTS path, handling symbols/numbers/links the tokenizer lacks pieces for. Speech-path quality, not inference throughput.

## 5. Stability & Regressions

Ranked by severity for production users:

1. **Cloud: frequent 503s** — [Issue #15419](https://github.com/ollama/ollama/issues/15419) (40 comments, 👍26). Autonomous agents on Ollama Cloud hitting random 503s; unreliable for production. No fix PR visible.
2. **Cloud: `glm-5.3-flash` degeneration** — [Issue #18980](https://github.com/ollama/ollama/issues/18980). 5–8% of requests fail with massive output degeneration since 10-12, never seen before. Reporter alleges a host-side cluster fault. No fix PR.
3. **Scheduler eviction stall** — [Issue #19245](https://github.com/ollama/ollama/issues/19245) (closed) and [Issue #19182](https://github.com/ollama/ollama/issues/19182) (open). Two distinct eviction bugs: (a) a runner marked "expire immediately" never unloads while other clients keep it busy via `keep_alive`, stalling the waiting request for the full keep-alive; (b) pending eviction is cancelled when a request for the resident model carries `keep_alive`. High impact for `OLLAMA_MAX_LOADED_MODELS=1` single-GPU deployments.
4. **Windows large-prompt connection resets** — [Issue #19139](https://github.com/ollama/ollama/issues/19139). `/api/chat` resets after ~15s with large prompts on an RTX 3090. Reproducible, cause unidentified.
5. **Tool-call int→float coercion (Flint)** — [Issue #19191](https://github.com/ollama/ollama/issues/19191). Integer args (`30000`) re-emitted as float strings (`"30000.0"`), failing schema validation and breaking subsequent calls. **Fix in review: [PR #19252](https://github.com/ollama/ollama/pull/19252)** adds unit + integration coverage.
6. **Cloud JSON schema ignored** — [Issue #12362](https://github.com/ollama/ollama/issues/12362). `qwen3-coder:480b-cloud` returns JSON that ignores the reply schema (works locally on 30b). Blocks structured-output pipelines.
7. **`mistral-large-4` rejects `role: "developer"`** — [Issue #19021](https://github.com/ollama/ollama/issues/19021). HTTP 400 via `/v1/responses`; changing to `system` succeeds. Blocks Codex-style clients.
8. **Gemma 4 parser drops complete tool calls with trailing noise** — [Issue #19226](https://github.com/ollama/ollama/pull/19226). Parser discards a valid arguments object when followed by `$$`; fix recovers via JSON decoder boundary.
9. **Cloud auto-compaction failure** — [Issue #19249](https://github.com/ollama/ollama/issues/19249). `deepseek-v4.1-flash` long-runners fail to auto-compact, looping on "Goal not yet met" and burning tokens. Related in-flight work: [PR #19230](https://github.com/ollama/ollama/pull/19230) and [PR #19253](https://github.com/ollama/ollama/pull/19253) on Responses-API compaction repair.

## 6. What This Means for Application Developers

- **Don't trust advertised context length.** Two independent bugs ([#18995](https://github.com/ollama/ollama/issues/18995), [#19172](https://github.com/ollama/ollama/issues/19172)) confirm `/api/tags` reports native, not allocated, context. If you're building compaction or truncation logic, read from `/api/ps` or `ollama ps` instead. The OpenCode fix ([PR #19193](https://github.com/ollama/ollama/pull/19193)) is the reference pattern.
- **Validate tool-call argument types defensively.** The int→float coercion ([#19191](https://github.com/ollama/ollama/issues/19191)) will reject calls against strict JSON schemas until [PR #19252](https://github.com/ollama/ollama/pull/19252) lands. Coerce numerics on ingest if you can't wait.
- **Single-GPU deployments need eviction workarounds.** With `OLLAMA_MAX_LOADED_MODELS=1`, both eviction bugs mean a busy resident model can block a waiting model for the full `keep_alive` window (default 30m in the reported config). Set short `keep_alive` for multi-model workloads until fixed.
- **Treat Ollama Cloud as unreliable for production agents right now.** Three open cloud issues (503s, degeneration, schema-ignoring) span reliability, correctness, and structured output. For agentic workloads with hard SLAs, keep a local fallback model warm or route through a gateway that retries.
- **New multimodal option for local agents.** Nemotron 3.5 Bolt E4B gives you a 128K-context VLM with tool use at Gemma 4 scale — worth benchmarking against your current vision+tool-call stack, especially with the small-image fidelity fix ([PR #19247](https://github.com/ollama/ollama/pull/19247)) on the way.
- **Gateway pattern now documented.** [Ollama Herd](https://github.com/ollama/ollama/pull/19246) (PR adding it to the README) puts multiple Ollama nodes behind one endpoint with memory-fit-aware routing — relevant if you're sharding local inference across machines.

</details>

<details>
<summary><strong>LiteLLM</strong> — <a href="https://github.com/BerriAI/litellm">BerriAI/litellm</a></summary>

# LiteLLM Digest — 2026-10-24

## Today's Highlights

The dominant story remains the **v1.107.0 supply-chain compromise** ([#47826](https://github.com/BerriAI/litellm/issues/47826)): PyPI has pulled the release and Docker tags (`latest`, `main-latest`, `main-stable`) have been yanked across `ghcr.io` and `docker.io`, but the issue is still open with 31 comments as operators audit their environments. Beyond that, the project is mid-flight on a large Rust-side refactor of gateway config/settings (`Layered` derive series) and landed a batch of spend-accounting fixes across Bedrock, Responses API, and custom-pricing paths. No new releases in the last 24h.

## Releases & Breaking Changes

- **No new releases in the last 24h.**
- ⚠️ **v1.107.0 is compromised — do not deploy.** The published artifact shipped a `cook.pth` credential stealer plus a `sitecustomize` RCE loader, built from a lookalike repo `Berri-AI/litellm`. PyPI removed `1.107.0`, and Docker tags were re-pointed. Verify your image digests and audit for the malicious build. [#47826](https://github.com/BerriAI/litellm/issues/47826)
- **Env-var semantics changing (in progress):** The `Layered` derive work makes blank env values count as *unset*, so an empty `SSL_CERTIFICATE` will stop overriding a configured cert. [#47993](https://github.com/BerriAI/litellm/pull/47993)
- **Vertex config move:** `vertex_project` / `vertex_location` will be read from `litellm_settings`; a blank `vertex_project` passed inline no longer overrides. [#47995](https://github.com/BerriAI/litellm/pull/47995)
- **Proxy metadata no longer forwarded to OpenAI** under preview features (previously leaked hashed API key, caller IP/UA, internal URL into stored completions). [#48116](https://github.com/BerriAI/litellm/pull/48116)

## New Model & Hardware Support

- **Gemini Live Avatar (realtime):** Feature request to support `avatar_config` / `customized_avatar` for lip-synced talking-head video in the Gemini/Vertex realtime integration. [#43166](https://github.com/BerriAI/litellm/issues/43166)
- **Rust native tokenization core:** New PR adds native provider tokenization plus explicitly-configured offline tokenization (text-only), with legacy counting defaults preserved. [#48102](https://github.com/BerriAI/litellm/pull/48102)
- **Perplexity / Jev rerank:** Rerank interface gains automatic Perplexity and Jev decision-model routing through the existing rerank API. [#47972](https://github.com/BerriAI/litellm/pull/47972)

## Performance & Optimization

- **Sessions Logs page (45–95s → reduced):** PR stops the session view from aggregating the entire date window, cutting DB work for newest-first browsing and improving oldest-first page jumps. Sparse filters and long sessions may still require full-window grouping. [#42876](https://github.com/BerriAI/litellm/pull/42876)
- **Rust gateway env snapshot:** All env-backed settings (OCR timeouts, Vertex creds, AWS role check) now read from a single snapshot that includes `environment_variables` from `config.yaml`; `envy` is dropped. [#47994](https://github.com/BerriAI/litellm/pull/47994)
- **Router retry bug (latency-based routing):** A lost-update race in `async_log_success_event` causes latency-based routing to degrade to random selection weighted by deployment count under concurrency. Not fixed yet. [#24720](https://github.com/BerriAI/litellm/issues/24720)
- **Retry-After ignored for multi-deployment groups:** `_time_to_sleep_before_retry` only honors upstream `Retry-After` when a model group has a *single* deployment, causing instant retries against a shared rate-limited upstream. [#34399](https://github.com/BerriAI/litellm/issues/34399)

## Stability & Regressions

Ranked by severity:

1. **CRITICAL — Supply-chain RCE / credential theft** in v1.107.0. Artifacts pulled; still open for operator remediation. [#47826](https://github.com/BerriAI/litellm/issues/47826)
2. **HIGH — Spend accounting returns $0 across multiple paths:** Bedrock `claude_platform/*` logs $0 spend with no cost header and no error ([#48045](https://github.com/BerriAI/litellm/issues/48045)); `base_model` naming a priced model with a differing `custom_llm_provider` also logs $0 ([#47908](https://github.com/BerriAI/litellm/issues/47908)); `complexity_router` classifier cost isn't attributed to spend/budgets ([#46469](https://github.com/BerriAI/litellm/issues/46469)). Fix PR landed for per-call custom pricing on native Responses path ([#48119](https://github.com/BerriAI/litellm/pull/48119)).
3. **HIGH — Unbounded upstream error bodies:** Proxy reads arbitrary-size upstream error responses (observed ~114 MB HTTP 400), runs regex masking over the full body, and stalls the event loop / blows up RSS. [#34031](https://github.com/BerriAI/litellm/issues/34031)
4. **MEDIUM — Deleted teams leave auth-valid keys cached:** `POST /team/delete` removes keys from DB but never evicts them from the auth cache (unlike `/key/delete`). [#34217](https://github.com/BerriAI/litellm/issues/34217)
5. **MEDIUM — Management endpoints leak raw Postgres errors** (e.g. null-byte param triggers 500 with raw exception text) — a flagged security-review finding. [#46076](https://github.com/BerriAI/litellm/issues/46076)
6. **MEDIUM — `/toolset/{name}/mcp` loses URL scope** after catalog authority refresh (1.106.x regression): keys with multiple toolsets get the union instead of the selected toolset. [#47856](https://github.com/BerriAI/litellm/issues/47856)
7. **LOW — Token counting rejects image `detail: "original"`,** causing pre-call checks to log ERROR and skip the context-window check. [#47327](https://github.com/BerriAI/litellm/issues/47327)
8. **LOW — Cache-hit spend semantics:** `spend=0` on cache hits but token columns replay original usage, making token reports ambiguous. [#39057](https://github.com/BerriAI/litellm/issues/39057)
9. **LOW — Streaming tool-call drops:** Anthropic `/v1/messages` streaming drops `tool_use.input` for Gemini/Gemma routes (non-streaming works). Closed. [#25390](https://github.com/BerriAI/litellm/issues/25390)
10. **Fix PRs in flight:** Azure v1 Responses URL/base handling behind gateway prefixes ([#48083](https://github.com/BerriAI/litellm/pull/48083), [#48118](https://github.com/BerriAI/litellm/pull/48118)); `hosted_vllm/*` discovery without an API key ([#48122](https://github.com/BerriAI/litellm/pull/48122)); transcription to unsupported providers now returns 400 instead of 500 ([#47971](https://github.com/BerriAI/litellm/pull/47971)).

## What This Means for Application Developers

- **Pin and verify your LiteLLM version today.** If you pulled `1.107.0` from PyPI or used `latest`/`main-stable` Docker tags during the compromise window, treat credentials in those environments as potentially exfiltrated. Rotate provider keys, SSO secrets, and any credentials reachable from the proxy container.
- **Don't trust spend numbers blindly for budgeting right now.** Multiple paths (Bedrock Claude Platform, `base_model` with a differing provider, complexity-router classifier calls) log $0. If you enforce budgets or bill customers from `LiteLLM_SpendLogs`, add validation on these paths until fixes land.
- **Audit your cache behavior around team/key lifecycle.** Deleted teams can leave keys auth-valid until cache eviction — relevant if you offboard customers or rotate access by deleting teams rather than keys.
- **Harden upstreams.** The unbounded error-body issue means a misbehaving backend can take down your proxy event loop; put response-size limits in front of the proxy where possible.
- **Watch the config refactor.** The `Layered`/env-snapshot changes alter blank-value semantics and where Vertex settings are read from. If you rely on empty env vars to override config, or set `vertex_project` inline, review before upgrading.
- **For Claude Code / Anthropic-compatible users:** streaming tool-use remains fragile on some routes (Gemma/Gemini, Bedrock pass-through with `websearch_interception`), and `thinking.type=adaptive` is rejected by the complexity router — test these paths explicitly if you route Claude Code through LiteLLM.

</details>

<details>
<summary><strong>Unsloth</strong> — <a href="https://github.com/unslothai/unsloth">unslothai/unsloth</a></summary>

# Unsloth Digest — 2026-10-24

## 1. Today's Highlights

Unsloth shipped `v0.1.910-beta`, adding local support for MOSS-Image, Recursive's Flint, and NVIDIA's Nemotron Bolt 4B, plus an OpenAI-compatible fine-tuning API, a chat-only Desktop install, and MLX MoE support for models larger than a Mac's unified memory. On the infrastructure side, a wave of Windows-specific Studio regressions landed today: a false "our child is not listening" port-ownership check kills every GGUF load ([#15022](https://github.com/unslothai/unsloth/issues/15022), fix in [PR #15034](https://github.com/unslothai/unsloth/pull/15034)), and a native Linux AMD path regression silently falls back to CPU ([#14906](https://github.com/unslothai/unsloth/issues/14906)). Deep FSDP2 training work also advanced across checkpointing, QLoRA dequant reuse, and context parallelism for DPO/GRPO.

## 2. Releases & Breaking Changes

- **v0.1.910-beta** ([release](https://github.com/unslothai/unsloth)) — New model support (MOSS-Image, Flint, Nemotron Bolt 4B), chat-only Desktop installer, **OpenAI-compatible fine-tuning API**, and MLX MoE for over-RAM Macs.
- **`/opt/rocm/lib` prepend regression** ([#14906](https://github.com/unslothai/unsloth/issues/14906)) — AppImage builds on native Linux AMD (RDNA3/gfx1100) now prepend ROCm paths in a way that hides the GPU from the bundled `llama-server`, causing silent CPU fallback. Likely a regression from the fix for #7208. Full uninstall/reinstall does not resolve.
- **Chat template limit raised** ([#14841](https://github.com/unslothai/unsloth/issues/14841)) — 64 KB cap was insufficient for large custom templates (e.g. ~230 KB DavidAU templates); llama.cpp jinja supports up to 8 MB.
- **Port-ownership behavior change (Windows)** ([#15022](https://github.com/unslothai/unsloth/issues/15022)) — The 2026-10-23 update introduced a new port-ownership check that refuses to trust its own `llama-server` when `psutil` misreports the listener.

## 3. New Model & Hardware Support

- **MOSS-Image, Recursive Flint, NVIDIA Nemotron Bolt 4B** — now runnable locally via v0.1.910-beta ([release](https://github.com/unslothai/unsloth)).
- **MLX MoE on Apple Silicon** — MoE models exceeding Mac unified memory; also [PR #14883](https://github.com/unslothai/unsloth/pull/14883) routes Apple Silicon image requests to the MLX engine by default (1.5–2x faster than diffusers MPS at equal accuracy), falling back to MPS per-request.
- **Context parallelism (Ulysses) for DPO and GRPO** — [PR #15041](https://github.com/unslothai/unsloth/pull/15041) extends `context_parallel_size > 1` beyond SFT; loss computation is sharded-aware.
- **FSDP2 + Ulysses for Qwen3.5 GatedDeltaNet** — [PR #12052](https://github.com/unslothai/unsloth/pull/12052) adds hybrid sharding support, treating conv/delta-rule layers specially.
- **DeepSeek-V4.1-Flash-1017 GGUF** ([#14695](https://github.com/unslothai/unsloth/issues/14695)) — architecture `deepseek41-dspark` unsupported by the bundled llama.cpp; a llama.cpp update is required.
- **MiniCPM-V-4.7-1B Vulkan** ([#14987](https://github.com/unslothai/unsloth/issues/14987)) — text generation fails on the Vulkan backend.
- **`unsloth doctor` MLX awareness** — [PR #14457](https://github.com/unslothai/unsloth/pull/14457) fixes false failures on Apple Silicon by probing MLX instead of only CUDA/ROCm.

## 4. Performance & Optimization

- **Studio AMD GPU inventory** ([PR #14970](https://github.com/unslothai/unsloth/pull/14970)) — Stops re-running `rocminfo` every 60 s (which spins up the full HSA runtime); caches the gfx target until hardware re-detection. Relevant on ROCm as a recurring CPU-side stall.
- **FSDP2 sharded checkpoint I/O** ([PR #15042](https://github.com/unslothai/unsloth/pull/15042)) — Resume previously read the full model + optimizer checkpoint on every rank and gathered full optimizer state onto rank 0 on save. Now reads are sharded and optimizer checkpoints are opt-in sharded — meaningful for large full finetunes.
- **FSDP2 QLoRA NF4 dequant reuse** ([PR #15011](https://github.com/unslothai/unsloth/pull/15011)) — The cached Triton dequant launch plan never hit under FSDP2 because the key is the weight address and all-gathered 4-bit weights are freed/reallocated. Fix reuses the plan across all-gathers.
- **bitsandbytes 8-bit AdamW under FSDP2** ([PR #15008](https://github.com/unslothai/unsloth/pull/15008)) — Silently downgraded to torch AdamW because bnb cannot step DTensor params, inflating optimizer state to fp32 (or bf16). Fix steps local shards to preserve 8-bit state.
- **Hub probe backoff in Studio diffusion** ([PR #15039](https://github.com/unslothai/unsloth/pull/15039)) — Previously one HEAD request per source shard (5 s timeout) on every cache hit, unbounded when the Hub was unreachable. Now one bounded probe per process.
- **Studio GGUF UI feedback** ([PR #14909](https://github.com/unslothai/unsloth/pull/14909)) — Prompt progress, live load/offload details, and prompt/reply speeds as an optional verbose view.

## 5. Stability & Regressions

Ranked by severity:

1. **[#15022](https://github.com/unslothai/unsloth/issues/15022) (Critical, Windows)** — Every GGUF load is killed by a false port-ownership check after the 2026-10-23 update. `llama-server` loads the model, answers `/health` 200, then Studio kills it with a misleading "failed to start" message. **Fix exists:** [PR #15034](https://github.com/unslothai/unsloth/pull/15034).
2. **[#14906](https://github.com/unslothai/unsloth/issues/14906) (Critical, Linux AMD)** — Silent CPU fallback on RDNA3/gfx1100; GPU hidden from bundled `llama-server` by prepended ROCm paths.
3. **[#14411](https://github.com/unslothai/unsloth/issues/14411) (High)** — Since recent updates, models stop responding after a few turns regardless of KV usage; ejecting core-dumps. No fix PR yet.
4. **[#14968](https://github.com/unslothai/unsloth/issues/14968) (High)** — Auto-compact ignores image tokens on local GGUF chats, so screenshot-heavy tool loops overflow the context window.
5. **[#14519](https://github.com/unslothai/unsloth/issues/14519) (High, CPU)** — Long tool-heavy chats stall for minutes in CPU conversation-archive embedding before inference starts; Stop does not cancel archiving. AMD Ryzen AI MAX+ path.
6. **[#14439](https://github.com/unslothai/unsloth/issues/14439) (Medium, correctness)** — Gemma-3-270m with `FastDecisionModel` + Clef head trains flat (chance-level accuracy) on T4. **Fix exists:** [PR #14482](https://github.com/unslothai/unsloth/pull/14482).
7. **[#14708](https://github.com/unslothai/unsloth/issues/14708) (Medium)** — Attachments become permanently unreadable after auto-compaction; `search_conversation` never invoked.
8. **[#14916](https://github.com/unslothai/unsloth/issues/14916) (Medium)** — GGUF export failure on Windows (Ling 3 Tiny) with `RuntimeError` from the conversion command.
9. **[#14807](https://github.com/unslothai/unsloth/issues/14807) (Medium, Intel XPU)** — LoRA inference mixes GNU and MSVC linker arguments on Windows.
10. **[#12365](https://github.com/unslothai/unsloth/issues/12365) (Medium, closed)** — Multi-account LAN access to the same local model had model-loading state desync; closed today.
11. **[#14650](https://github.com/unslothai/unsloth/issues/14650) (Low, closed)** — Lemonade & FastFlowLM chat stopped working after a few days on AMD Ryzen AI 7 350 / Ubuntu 26.10.
12. **[#14513](https://github.com/unslothai/unsloth/issues/14513) (Low, closed, Windows)** — GGUF loads crashed the server instead of taking the low-memory route.
13. **[#14474](https://github.com/unslothai/unsloth/issues/14474) (Low)** — Custom Krea2 image models crash or fail to load (RTX 3060 Ti).
14. **[#14487](https://github.com/unslothai/unsloth/issues/14487) (Low)** — Reported 200–400 MB C: drive growth per session with no cleanup path.
15. **[#14298](https://github.com/unslothai/unsloth/issues/14298) (Low, closed)** — "Max Tool Call Duration" slider ignored for HTTP/SSE MCP tools (hard 5 min cap).
16. **[#14221](https://github.com/unslothai/unsloth/issues/14221) (Low, closed)** — Model Hub filters regressed.

## 6. What This Means for Application Developers

- **Your GGUF Windows targets may be dead today.** If you build agent apps on Studio on Windows, the 2026-10-23 update breaks all GGUF loads with a misleading error. Pin to v0.1.909-beta or watch [PR #15034](https://github.com/unslothai/unsloth/pull/15034); the failure mode is silent model death after a healthy `/health` response, so don't trust a "failed to start, check your GGUF" message.
- **Don't trust CPU fallback silently on Linux AMD.** If you rely on ROCm acceleration, verify `llama-server` sees the GPU. The failure is quiet — the app runs, just slowly. See [#14906](https://github.com/unslothai/unsloth/issues/14906).
- **Image-token accounting in local GGUF chats is a real overflow vector.** If your agent loops with screenshots, auto-compact won't account for vision tokens ([#14968](https://github.com/unslothai/unsloth/issues/14968)) and will overflow the window.
- **A new OpenAI-compatible fine-tuning API** lands in v0.1.910-beta. If you already standardize on OpenAI SDKs for inference, you can likely point fine-tuning jobs at the same surface — verify against your SDK version.
- **Long-context training is getting real.** Ulysses context parallelism now reaching DPO/GRPO ([PR #15041](https://github.com/unslothai/unsloth/pull/15041)) and FSDP2 checkpoint I/O ([PR #15042](https://github.com/unslothai/unsloth/pull/15042)) matter if you fine-tune at sequence lengths that don't fit a single rank's memory. Budget-wise, the FSDP2 AdamW fixes ([PR #15008](https://github.com/unslothai/unsloth/pull/15008)) are the difference between a 4-bit optimizer state and a fp32 one — that's 2–4x optimizer memory.
- **Apple Silicon image generation is now MLX-first** ([PR #14883](https://github.com/unslothai/unsloth/pull/14883)); if you tuned prompts against diffusers/MPS output, expect equivalent accuracy but different numerics.
- **Tool-call timeout behavior is fixed for MCP on HTTP/SSE** ([#14298](https://github.com/unslothai/unsloth/issues/14298), closed) — the slider now applies instead of a hard 5-minute cap.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*