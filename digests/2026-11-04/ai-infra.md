# AI Infrastructure Digest 2026-11-04

> Generated: 2026-11-04 01:13 UTC | Projects covered: 6

- [vLLM](https://github.com/vllm-project/vllm)
- [SGLang](https://github.com/sgl-project/sglang)
- [llama.cpp](https://github.com/ggml-org/llama.cpp)
- [Ollama](https://github.com/ollama/ollama)
- [LiteLLM](https://github.com/BerriAI/litellm)
- [Unsloth](https://github.com/unslothai/unsloth)

---

## Cross-Project Comparison

# Cross-Project AI Infrastructure Comparison — 2026-11-04

## 1. Ecosystem Overview

Today's activity shows an ecosystem maturing along two axes simultaneously: **hardware-format proliferation** (NVFP4, MXFP8, FP8, LUT-B, SM120/Rubin/gfx950) and **correctness hardening under production complexity** (PD disaggregation, prefix caching, hybrid attention, KV offload). The serving engines (vLLM, SGLang) are converging on similar frontier concerns — disaggregation correctness, MoE quantization kernels, speculative decoding under PD — but diverging in stability posture: vLLM has high-severity open KV contamination issues while SGLang closed a batch of cluster-killing bugs today. The local runtimes (llama.cpp, Ollama) are pushing distributed inference (NCCL multi-node TP) and broader model/hardware reach into the consumer and edge tiers, while Unsloth advances the fine-tuning layer (FP8 LoRA, context parallelism, CPU training) and LiteLLM consolidates the gateway/router layer with a breaking OpenAI SDK 3 migration. The clearest cross-cutting theme: **every layer is now optimizing for agentic workloads** — long shared prefixes, reasoning-token budgets, tool-call correctness, and multi-tenant isolation.

---

## 2. Activity Comparison

| Project | Layer | Issues (notable today) | PRs (notable today) | Release Status |
|---|---|---|---|---|
| **vLLM** | Serving engine | High-severity open: #61160 (KV cross-request contamination), #57224 (CC silent garbage); long-running trackers #27433 (batch invariance), #38175 (ViT CUDA graphs) | Heavy — KV connector fixes (#61769, #62287, #53298), Muse Spark GB300 decode (#64077), NVFP4 MoE quant (#61511), MoE quant formats (#62759, #65398) | **No release in 24h**; last tag v0.32.0 flagged for DSv4.1 block-size bug (#59203) |
| **SGLang** | Serving engine | 18 ranked items, many CLOSED today (cluster-killer #38022, radix cache #35270, HiCache deadlock #30760); open: #42568 (spec sampling), #38709 (ROCm DCP) | Moderate — DCP pack device binding (#47255), FA4 MLA prefill (#33574), EAGLE draft extend (#46472) | **No release in 24h** |
| **llama.cpp** | Local runtime | #25618 (spec-decode divergence on quantized targets, 37 comments, unfixed), #31077 (CUDA IMA Gemma 4 + MTP), #30784 (RTX 5090 FA) | Very heavy — NCCL multi-node TP (#28967), NVFP4 LFM3 (#31608), Nemotron 3.5 Transcribe (#31471), GLM-5.3 (#30499), 1.86× TQ1_0 (#31628) | **Nightly fire (b12077–b12088)**; `-hf` tag matching tightened (breaking) |
| **Ollama** | Local runtime | #17408 (scheduler deadlock, critical, unfixed), #19493 (tool-call truncation → 500), #19492 (Responses truncation) — both with fix PRs | Moderate — tokenize APIs (#19498, #17478), pull-path rework (#19505), MLX concurrency (#19197), thinking budgets (#17566) | **v0.40.14 shipped; v0.40.15-rc0 cut** (MLX CUDA in-process, MiMo V2.6) |
| **LiteLLM** | Gateway / router | #49884 (Redis breaker stuck HALF_OPEN), #49813 (TZ startup exit), #49795 (streamed fallback loss), #49675 (TPM window bug) | Heavy — OpenAI SDK 3 migration (#47762, breaking), Responses ID hardening (#46424, breaking), retries overhaul (#46730, breaking), MCP provider-native (#49886–#49897), 1,180-error typing refactor (#49986) | **No release in 24h**; `rc/1.108.0` fails OSV/grype (#49985) — hold |
| **Unsloth** | Fine-tuning | #16528 (S3 audio path collision — data corruption), #16538 (MCP cache invalidation 17×), #16545 (chat_template_kwargs filtering) | Moderate — 16-bit LoRA weight folding 1.4× (#16576), FP8 LoRA (#16423), Ulysses CP (#16558), FSDP2 MoE (#16560) | **v0.1.914-beta shipped** — but updater broken on Win/macOS, AppImage launch regression |

**Takeaway:** llama.cpp and LiteLLM have the highest PR velocity; vLLM and SGLang carry the heaviest correctness debt; Ollama and Unsloth shipped releases with known update/launch regressions; only Ollama and Unsloth moved release tags in this window.

---

## 3. Model Support Race

| Model / Architecture | vLLM | SGLang | llama.cpp | Ollama | Unsloth |
|---|---|---|---|---|---|
| **DeepSeek-V4.1-Flash** | Bug-fix focus (#61160, #59203) | PDMux bounded prefill (#42507), NPU nightly (#48160) | PR-branch prefix-reuse bug (#30944) | — | — |
| **GLM-5.3 / GLM-V** | ViT CUDA graph tracker (#38175) | SM90 tracking (#45373), SM120 (#37813) | **GLM-5.3 next + MLA/q_absorbed (#30499)** | — | — |
| **Qwen3.5/3.6/3.8-Flash-Next** | FP8 KV truncation (#47349), GDN divergence (#62851), ViT tracker | **gfx950/MI355X tracker (#44304)** | — | MLX video input (#19348) | — |
| **Nemotron 3.5 Transcribe** | — | — | **Shipped (#31471)** | — | — |
| **MiMo V2.6** | — | — | — | **Shipped (#19400)** | — |
| **LFM3 / LFM3-VL** | — | — | **NVFP4 GGUF (#31608), spec decode (#31598)** | **Video via MLX (#19348)** | — |
| **MiniMax-M2.7/M3.1** | ROCm MXFP8 retune (#65530), GB10 hang (#41725) | — | — | — | — |
| **Muse Spark** | **GB300 specialized decode 1.5× (#64077)** | ROCm offload wedge (#65190) | — | — | — |
| **Step5 / MegaMoE** | **PP support (#65504)** | — | — | — | — |
| **Gemma-4 / Kimi K2.5** | ViT tracker, +15.8% KV (#63347) | — | Gemma 4 MTP CUDA IMA (#31077) | — | Gemma-4 vision CP fix (#16596) |
| **AutoTrust** | — | — | — | MLX in progress (#19399) | — |

**Who's ahead:**
- **llama.cpp** is the broadest shipper today — three model/architecture additions (Nemotron 3.5 Transcribe, GLM-5.3, NVFP4 LFM3) plus NCCL multi-node. Strongest raw breadth.
- **vLLM** leads on frontier hardware-specific optimization (Muse Spark GB300, LUT-B MoE on Rubin, MXFP8 on gfx950) but is largely in fix-and-tune mode for existing models.
- **Ollama** is the fastest at surfacing new consumer models (MiMo V2.6, AutoTrust MLX, video input) with release-tag velocity.
- **SGLang** is concentrated on DeepSeek-V4 and Qwen/GDN families across AMD/NPU, but shipped no net-new model today.
- **Unsloth** supports the training side of the same frontier models (Nemotron-H FSDP2, Gemma-4) rather than inference.

---

## 4. Performance Frontier

Optimization effort today clusters into five buckets:

**Quantization kernels (heaviest activity):**
- vLLM: NVFP4 MoE `cvt_fp16_to_fp4` on Blackwell (#61511), `mxfp4_hadamard32_moe` (#65398), `lut_b_moe` on Rubin SM10.7 (#62759), ROCm MXFP8 tiles (#65530).
- llama.cpp: CUDA Q8_1 correction-sum fix (#31247), TQ1_0 GEMV 1.86× (#31628), NVFP4 GGUF.
- Unsloth: FP8 LoRA forward/input-grad GEMMs (#16423), FP8 rowwise `scaled_mm` overflow fixes (#16598).
- SGLang: ROCm per-token-group power-of-2 scales (#33590).

**KV cache / offload:**
- vLLM: bounded copy descriptors per step (#65519), grown padded full-attention blocks (#63347, +15.8% Gemma-4), KV connector reliability fixes.
- SGLang: radix cache double-count fix (#35270), HiCache prefetch deadlock (#30760).
- Ollama: 8 GiB fixed MLX prefix cache budget causing swap (#18131).
- llama.cpp: `/slots` restore loses KV on hybrid/SWA (#28194).

**Distributed serving:**
- **llama.cpp NCCL multi-node TP (#28967)** — the day's headline architectural item.
- vLLM: PP+SP for MegaMoE (#65504); KV connector fixes across PCP/PP ranks (#62916).
- SGLang: DCP pack-thread device binding (#47255); PDMux layerwise prefill (#42507).
- Unsloth: generic Ulysses context parallelism (#16558), FSDP2 stacked MoE (#16560).

**Decode-path / speculation:**
- vLLM: Muse Spark 1.5× GB300 decode (#64077).
- Unsloth: **16-bit LoRA weight folding 1.3–1.4× decode (#16576)** — biggest single stated decode win today.
- llama.cpp: GDN ordered kernel for MTP recovery (#31630), HIP fast-math (#31625).

**Backend-specific:**
- llama.cpp: SYCL `-sm tensor` +19% prefill (#30956), OpenCL FA (#31633), Intel Vulkan FA (#29357).
- Ollama: pull verification off critical path (#19505).

**Frontier summary:** Quantization is where the most PRs land; distributed serving (NCCL TP) is the most strategically significant new capability; decode-path wins (LoRA folding, Muse Spark) are the most directly monetizable for serving cost.

---

## 5. Layer Positioning

| Layer | Projects | What they own | Today's posture |
|---|---|---|---|
| **Serving engine (datacenter)** | vLLM, SGLang | High-throughput multi-GPU inference, PD disaggregation, prefix caching, MoE at scale | Both in **hardening mode**: correctness fixes dominate, no releases. vLLM carries higher-severity open issues (KV contamination); SGLang cleared many today. |
| **Local / edge runtime** | llama.cpp, Ollama | Single-host and consumer GPU inference, quantization breadth, GGUF ecosystem | **Expansion mode**: llama.cpp adds NCCL multi-node TP (blurring into serving-engine territory); Ollama ships releases and new model support fastest. |
| **Gateway / router** | LiteLLM | Unified API surface, fallbacks, rate limiting, spend logging, MCP, multi-provider auth | **Consolidation + breaking changes**: SDK 3, Responses ID hardening, retries overhaul, MCP schema redesign. Highest churn-to-release ratio; several HA-critical open bugs. |
| **Fine-tuning / training** | Unsloth | LoRA/QLoRA, FP8 training, context parallelism, FSDP2, Studio desktop app | **Feature expansion** (CPU training, FP8 LoRA, Ulysses CP) but **desktop app fragility** (broken updater, AppImage launch regression, data-corruption bug in S3 audio pipelines). |

**Key structural observation:** The serving-engine layer (vLLM/SGLang) is the most correctness-critical and the slowest to ship releases — appropriate, given blast radius. The local-runtime layer is expanding *upward* (llama.cpp NCCL TP) while the gateway layer (LiteLLM) is expanding *downward* into model discovery and MCP execution. The fine-tuning layer (Unsloth) remains orthogonal but is the only one today shipping a decode-speed win that directly benefits inference serving.

---

## 6. Trend Signals

**1. PD disaggregation correctness is the #1 production risk.**
vLLM #61160 (cross-request KV contamination with APC) and SGLang's closed cluster-killers (#38022 multimodal engine kill, #30760 HiCache deadlock) show PD + prefix caching + hybrid attention is the highest-risk production configuration in the ecosystem right now. **Action:** audit for `--no-enable-prefix-caching` fallbacks and gateway-side input validation on multimodal/tool-call paths.

**2. Speculative decoding is the least-trustworthy subsystem across projects.**
Open issues span every project: llama.cpp #25618 (greedy divergence on quantized targets, unfixed), SGLang #42568 (chain-spec rejects valid drafts), Ollama (MTP slower than non-MTP in vLLM #39680), vLLM #62851 (GDN divergence under preemption). **Action:** treat spec decode as a validation-required optimization, not a default. A/B against vanilla decoding in CI.

**3. Quantization format wars are fragmenting the hardware matrix.**
NVFP4, MXFP8, FP8, LUT-B, FP4+Hadamard — each with SM/RDNA/NPU-specific kernels and gating (vLLM #63343 SM120 rejection). **Action:** pin exact (model × quant format × SKU × framework tag) combinations and validate before upgrading. The "just use FP8" era is over.

**4. Agentic workloads are forcing API-level changes at every layer.**
Token-counting APIs (Ollama #19498, #17478), thinking-token budgets (#17566), MCP provider-native registration (LiteLLM #49886–#49897), session-affinity routing (SGLang #34513), spend-log `latest_turn` mode (LiteLLM #49544). **Action:** if you build agents, expect config churn in Q4 across router, gateway, and runtime APIs — track the sub-PRs.

**5. Silent-failure modes are the dominant risk class, not crashes.**
vLLM CC garbage output (#57224), LiteLLM silent span drops (#43032) and truncation (#19492), Ollama silent input truncation, Unsloth silent S3 audio misrouting (#16528). **Action:** invest in output-validation and data-lineage checks; the ecosystem is optimizing for throughput over defensive correctness.

**6. Distributed inference is moving down-market.**
llama.cpp NCCL multi-node TP (#28967) + Ollama MLX concurrency (#19197) + Unsloth Ulysses CP (#16558) signal that multi-device serving is no longer datacenter-only. **Action:** revisit sharding strategy — the "one big GPU" assumption is weakening at every layer.

**7. Breaking changes are clustered in the gateway layer.**
LiteLLM's SDK 3 migration, Responses ID hardening, and retries overhaul land in the same window as Ollama's Responses truncation bug and Unsloth's chat_template_kwargs filtering. **Action:** freeze gateway dependencies before Q4 upgrades; stage LiteLLM SDK 3 against production traffic; verify `/v1/responses` truncation semantics end-to-end.

**What to watch next week:**
- Whether vLLM merges the KV-connector fix cluster (#61769/#62287/#53298) — that gates PD-disagg production safety.
- Whether llama.cpp's NCCL TP (#28967) gets adopted into Ollama — that would put distributed inference in the consumer runtime.
- Whether LiteLLM's `rc/1.108.0` clears OSV/grype (#49985) — currently a hold.
- Whether Unsloth fixes the v0.1.914-beta updater (Win #16573, macOS #16561) — currently blocks release distribution.

---

## Per-Project Reports

<details>
<summary><strong>vLLM</strong> — <a href="https://github.com/vllm-project/vllm">vllm-project/vllm</a></summary>

# vLLM Digest — 2026-11-04

## Today's Highlights

No new releases landed in the last 24 hours, but activity remains high across KV-connector correctness fixes, quantization kernel work, and a large batch of long-running trackers (batch invariance, Rust frontend parity, ViT CUDA graphs). The most consequential signal today is a cluster of KV-connector and scheduler correctness fixes targeting cross-request contamination and preemption-time cache invalidation — high-severity issues for anyone running PD disaggregation or prefix caching in production. On the perf side, NVIDIA's Muse Spark GB300 specialized decode PR claims 1.5x single-stream decode throughput, and multiple MoE quantization kernels are being retuned for Blackwell/ROCm.

## Releases & Breaking Changes

No new releases or breaking API/config changes in the last 24h.

## New Model & Hardware Support

- **[Quant] LUT-B MoE with MXFP8 activations — native Rubin kernel + emulation** ([PR #62759](https://github.com/vllm-project/vllm/pull/62759)) — Adds `--quantization lut_b_moe` with a new native grouped GEMM on Rubin (SM 10.7) using `tcgen05.mma.kind::mxf8f6f4` LUT decompression, plus an emulation path.
- **[Quantization] Add `mxfp4_hadamard32_moe` online quantization** ([PR #65398](https://github.com/vllm-project/vllm/pull/65398)) — Online W4A4 MXFP4 for MoE experts with a 32-wide Hadamard rotation on Humming; extends `QuantSpec.hadamard_size` to MoE.
- **[MoE] Fill expert padding before post-load processing** ([PR #64352](https://github.com/vllm-project/vllm/pull/64352)) — Correctness fix for MoE loaders, relevant to layerwise rematerialization and gpt-oss/inkling paths.
- **[Step5] Allow MegaMoE with pipeline parallelism** ([PR #65504](https://github.com/vllm-project/vllm/pull/65504)) — Removes the `PP=1` restriction for `deep_gemm_mega_moe` on Step5, enabling SP at the PP boundary.
- **ViT Full CUDA Graph support tracker** ([Issue #38175](https://github.com/vllm-project/vllm/issues/38175)) — Ongoing RFC for Qwen3-VL, Qwen3.5, GLM-V, Kimi K2.5 multimodal ViT encoder CUDA graph capture.

## Performance & Optimization

- **[Perf] Muse Spark Open specialized decode — 1.5x GB300 decode** ([PR #64077](https://github.com/vllm-project/vllm/pull/64077)) — NVIDIA-developed NVFP4 + DSpark spec decode for GB300; TP 4/8/16 with EP=TP.
- **[Kernel][Perf] Optimize NVFP4 MoE quant `cvt_fp16_to_fp4` on Blackwell** ([PR #61511](https://github.com/vllm-project/vllm/pull/61511)) — Speeds up `scaled_fp4_experts_quant` / `silu_and_mul_scaled_fp4_experts_quant` on B200; per-row expert search was the bottleneck at large `n_experts`. Verified numerically equivalent and GSM8K-neutral.
- **[ROCm][Perf][MiniMax-M3.1] Retune MXFP8 `dot_scaled` GEMM tiles for M=17–256** ([PR #65530](https://github.com/vllm-project/vllm/pull/65530)) — Adds a shape-scoped tile table for `RocmDotScaledMxfp8LinearKernel` on gfx950 (TP4 linears).
- **[Perf][KV Offload] Bound copy descriptors per step for CPU→GPU loads** ([PR #65519](https://github.com/vllm-project/vllm/pull/65519)) — Caps descriptors per `cuMemcpyBatchAsync` call to avoid blocking the worker thread and stalling the next step's kernel launches.
- **[Core] Grow padded full attention blocks** ([PR #63347](https://github.com/vllm-project/vllm/pull/63347)) — More KV capacity for hybrid models with `fp8_per_token_head`: Gemma-4-26B +15.8%, Qwen3.6-35B + DFlash also improved (fixes [#40388](https://github.com/vllm-project/vllm/issues/40388)).
- **Batch Invariant Feature and Performance Optimization** ([Issue #27433](https://github.com/vllm-project/vllm/issues/27433)) — High-traffic tracker (104 comments) on bit-exact batch invariance; ongoing.

## Stability & Regressions

Ranked by severity:

1. **Cross-request KV contamination in PD disaggregation with prefix caching** ([Issue #61160](https://github.com/vllm-project/vllm/issues/61160)) — Intermittent responses containing content from other requests when serving DeepSeek-V4.1-Flash with NIXL P/D + APC. Clean with `--no-enable-prefix-caching`. **Mitigation required in prod**; no fix PR linked yet.
2. **KV connector fixes for scheduler state on load failures / preemption** — Multiple fix PRs in flight: [#61769](https://github.com/vllm-project/vllm/pull/61769) (evict invalid blocks of requests aborted mid-step), [#62287](https://github.com/vllm-project/vllm/pull/62287) (handle load failures after preemption, depends on #61769), [#53298](https://github.com/vllm-project/vllm/pull/53298) (restore state after KV load rejection under `kv_load_failure_policy="recompute"`), [#62916](https://github.com/vllm-project/vllm/pull/62916) (synchronize engine IDs across PCP ranks — multi-node PP2/PCP8/TP2 startup failure).
3. **Silent garbage output on H100 Confidential Computing (TDX)** ([Issue #57224](https://github.com/vllm-project/vllm/issues/57224)) — V2 model runner's UVA views of pinned host memory are stale under CC; works with `VLLM_USE_V2_MODEL_RUNNER=0`. Serious for CC deployments, no fix PR yet.
4. **No working block size on v0.32.0 release tag for DeepSeek-V4.1** ([Issue #59203](https://github.com/vllm-project/vllm/issues/59203)) — Both block sizes 64 and 128 fail on the release tag; fix tracked in [#60762](https://github.com/vllm-project/vllm/pull/60762).
5. **SM120 gating rejects `enable_adaptive_verification` on DSv4.1** ([Issue #63343](https://github.com/vllm-project/vllm/issues/63343)) — Device-query-lens support gated to SM90/SM100; RTX PRO 6000 Blackwell (SM120) users unable to use adaptive verification.
6. **Recurring CUDA kernel hang on 2× DGX Spark (GB10, sm_12.1) with MiniMax-M2.7-NVFP4, TP=2** ([Issue #41725](https://github.com/vllm-project/vllm/issues/41725)) — Long-standing, still open.
7. **[ROCm][GLM-5.3-Flash] "Workspace is locked" AssertionError under high decode concurrency** ([Issue #64874](https://github.com/vllm-project/vllm/issues/64874)) — `rocm_fp8_paged_mqa_logits` reserves decode logits via `torch.empty` instead of the workspace.
8. **[ROCm] SimpleCPUOffloadConnector wedges with Muse Spark (hybrid SWA) + DSpark spec decode on MI350X** ([Issue #65190](https://github.com/vllm-project/vllm/issues/65190)) — Serial prefill and ~0 decode when working set exceeds GPU KV + default 2 GB/rank pool.
9. **Qwen3.6 GDN greedy divergence from batch-dependent numerics and preemption/recompute** ([Issue #62851](https://github.com/vllm-project/vllm/issues/62851)) — Ties directly into the batch-invariance tracker.
10. **FP8 KV cache + prefix caching truncates generation on Qwen3.5-NVFP4** ([Issue #47349](https://github.com/vllm-project/vllm/issues/47349), closed/stale) — `ignore_eos` bypassed.
11. **Mixed prefill-decode step 6x slower than decode-only on Qwen3.5 397B NVFP4 DEP8** ([Issue #44806](https://github.com/vllm-project/vllm/issues/44806)) — 8×B200, still open.
12. **MTP slower than non-MTP on Qwen3.5-0.8B** ([Issue #39680](https://github.com/vllm-project/vllm/issues/39680)) — Degraded latency both single-threaded and high-concurrency.
13. **Installation: `libcudart.so.13` required when `torch-backend=cu129` on v0.22.0** ([Issue #44335](https://github.com/vllm-project/vllm/issues/44335)) — Env mismatch on CUDA 13 hosts.

## What This Means for Application Developers

- **If you run PD disaggregation with automatic prefix caching, audit for cross-request leakage now** ([#61160](https://github.com/vllm-project/vllm/issues/61160)). Until a fix lands, either disable APC (`--no-enable-prefix-caching`) on sensitive workloads or isolate tenants; the failure mode is silent and content-level, not a crash.
- **KV-connector reliability is improving but not yet stable** — several coordinated fix PRs ([#61769](https://github.com/vllm-project/vllm/pull/61769), [#62287](https://github.com/vllm-project/vllm/pull/62287), [#53298](https://github.com/vllm-project/vllm/pull/53298)) target preemption and load-failure paths. If you use external KV offload with `kv_load_failure_policy="recompute"`, plan to adopt these once merged.
- **Confidential Computing deployments (H100 + TDX) should pin to `VLLM_USE_V2_MODEL_RUNNER=0`** until [#57224](https://github.com/vllm-project/vllm/issues/57224) is resolved; the default V2 runner produces silent incorrect output.
- **Blackwell and Blackwell-derived SKUs (SM120) have a growing but uneven feature surface** — adaptive verification and some quantized kernels remain gated to SM90/SM100. Validate your exact SKU on the intended vLLM tag before committing to a quantization/arch combo (see [#63343](https://github.com/vllm-project/vllm/issues/63343), [#59203](https://github.com/vllm-project/vllm/issues/59203)).
- **MoE throughput on Blackwell continues to improve** — the NVFP4 MoE quant kernel ([#61511](https://github.com/vllm-project/vllm/pull/61511)) and the upcoming `mxfp4_hadamard32_moe` / `lut_b_moe` online quant paths ([#65398](https://github.com/vllm-project/vllm/pull/65398), [#62759](https://github.com/vllm-project/vllm/pull/62759)) are worth benchmarking for agentic serving where decode batches are small and kernel-launch overhead dominates.
- **If you depend on bit-exact reproducibility across batch sizes** (e.g., RL rollouts, eval regression testing), track [#27433](https://github.com/vllm-project/vllm/issues/27433) — batch invariance is close but not complete, and [#62851](https://github.com/vllm-project/vllm/issues/62851) shows divergence still occurs under preemption/recompute.

</details>

<details>
<summary><strong>SGLang</strong> — <a href="https://github.com/sgl-project/sglang">sgl-project/sglang</a></summary>

# SGLang Digest — 2026-11-04

## Today's Highlights

No new releases in the last 24h, but issue and PR activity is heavy. The **Prefill-Decode Disaggregation Q4 roadmap** (#43699) and the **shared `api.v1` backend migration RFC** (#45816) are the two architectural threads moving through the tracker. On the reliability side, CI babysitting trackers (#42752, #48196) continue to surface flaky infrastructure, while a batch of older "[inactive]" bugs were closed out today.

---

## Releases & Breaking Changes

*None in the last 24h.*

---

## New Model & Hardware Support

- **[XPU] paged-experts RFC — Intel XPU with Lookahead Expert Scheduling (#46520)** — Proposes opt-in extensions to the Paged Experts work (#42557): LES scheduling plus an SSD tier for iGPU single-GPU MoE offload. [link](https://github.com/sgl-project/sglang/issues/46520)
- **[PDMux] Bounded layerwise prefill for DeepSeek-V4.1-Flash (#42507, CLOSED)** — Resumable forward to interleave long prefills with decode on DeepSeek-V4.1-Flash, retaining mHC/Engram/tail state across slices. NPU-oriented. [link](https://github.com/sgl-project/sglang/pull/42507)
- **[AMD] FlyDSL GDN linear-attention backend (#33544, CLOSED)** — Adds `--linear-attn-backend flydsl` on ROCm, using aiter's FlyDSL kernels for the chunked prefill state scan and recurrent decode halves of the GDN path. [link](https://github.com/sgl-project/sglang/pull/33544)
- **[NPU] DeepSeek-V4-Flash W8A8 long-context nightly case (#48160)** — Replaces the 8K perf case with a 128K input / 1K output 1P1D prefix90 case matching the Ascend 16-card production shape. [link](https://github.com/sgl-project/sglang/pull/48160)

---

## Performance & Optimization

- **DeepSeek-V4 dsv4 prefill on SM120 (~2–7K tok/s vs ~12.5K on vLLM/marlin) (#33422)** — Reported on 4× RTX PRO 6000 Blackwell, TP=4, PCIe Gen5. User asks whether this is expected and requests tuning guidance; no clear resolution yet. [link](https://github.com/sgl-project/sglang/issues/33422)
- **GLM-5.3-Flash on Hopper (SM90) tracking (#45373)** — Ongoing kernel optimization work under the Q4 roadmap (#42473), related to SM120 tracking (#37813). [link](https://github.com/sgl-project/sglang/issues/45373)
- **Qwen3.8-Flash-Next on gfx950 / MI355X (#44304)** — ROCm performance tracker for `qwen4_exp` (GatedDeltaNet, QSA, HyperConnection, MXFP4 MoE, NEXTN MTP). [link](https://github.com/sgl-project/sglang/issues/44304)
- **Parallelize module loading for Diffusion models (#19092)** — "good first issue" targeting faster server launch and refit for diffusion models. [link](https://github.com/sgl-project/sglang/issues/19092)
- **[fa4] Fix FA4 for MLA prefill (#33574, CLOSED)** — Addresses MLA QV handling under FA4. [link](https://github.com/sgl-project/sglang/pull/33574)
- **ROCm per-token-group quantizer: power-of-2 scales (#33590, CLOSED)** — Enables UE8M0 scales on the row-major path without DeepGEMM. [link](https://github.com/sgl-project/sglang/pull/33590)

---

## Stability & Regressions

Ranked by severity and blast radius:

1. **Single malformed multimodal request kills the whole engine; retries spread it node-by-node (#38022, CLOSED)** — `_adjust_embedding_length()` raises in the scheduler forward path when embeddings are shorter than placeholders; exception propagates to `run_scheduler_process` which sends SIGQUIT to the parent. Cluster-wide cascade via client retries. [link](https://github.com/sgl-project/sglang/issues/38022)
2. **Radix cache `evictable_size()` double-counts shared pages (#35270, CLOSED)** — Kills the scheduler at idle. [link](https://github.com/sgl-project/sglang/issues/35270)
3. **HiCache prefetch `all_reduce` deadlock with TP=4, no PP (#30760, CLOSED)** — Mismatched call count in `check_prefetch_progress`. [link](https://github.com/sgl-project/sglang/issues/30760)
4. **EAGLE `vectorized_gather_kernel` OOB → NCCL abort / Xid 43 (#37936, CLOSED)** — Reproducible on V100 PCIe with `RadixArk/Qwen3.8-Flash-Next-NVFP4` + EAGLE/MTP + constrained tool requests. [link](https://github.com/sgl-project/sglang/issues/37936)
5. **`chain_speculative_sampling_triton` rejects every draft whose q rounds just above 1.0 (#42568)** — Regression since #37134; guard added in `reject_sampling.py` is too strict. No fix PR noted. [link](https://github.com/sgl-project/sglang/issues/42568)
6. **DFLASH speculative decoding unsupported under PD disaggregation (#36140, CLOSED)** — `spec_info None` crash then watchdog self-kill; DSPARK and EAGLE work under PD. [link](https://github.com/sgl-project/sglang/issues/36140)
7. **EAGLE/MTP same-checkpoint draft keeps redundant `embed_tokens`/`lm_head` resident during KV pool sizing (#42510)** — Under-sized pool, startup OOM. [link](https://github.com/sgl-project/sglang/issues/42510)
8. **ROCm `--dcp-size > 1` crashes every rank on first forward (#38709)** — `forward_absorb_rocm_core` unpacks 2 values from a 1-value return; present on `main` as of 2026-09-09. [link](https://github.com/sgl-project/sglang/issues/38709)
9. **DeepSeek-V4.1 FP4 indexer exhausts HBM under long-context AgentX on ROCm (#39441)** — Persists after #37660. [link](https://github.com/sgl-project/sglang/issues/39441)
10. **HiCache L2/L3 on DeepSeek-V4 → frequent token loop repetition (#36179, CLOSED)** — [link](https://github.com/sgl-project/sglang/issues/36179)
11. **CI: Wan VAE decode time spikes 2–10x on `1-gpu-5090` sm* runners (#48196)** — Since the 2026-10-17 runner move; fails ~half of `multimodal-gen-test-1-5090` perf checks. [link](https://github.com/sgl-project/sglang/issues/48196)
12. **CUDA Coredump Tracker (#26340)** — Auto-collected from `pr-test.yml`, 354 comments and still accumulating. [link](https://github.com/sgl-project/sglang/issues/26340)
13. **Flaky tests / CI infra failures while babysitting PRs (#42752)** — Claude Code–assisted tracker, 174 comments, complements #17050. [link](https://github.com/sgl-project/sglang/issues/42752)
14. **`--tool-call-parser auto` selects `glm45` instead of `spark25` for Spark-X2.5 (#37608, CLOSED)** — [link](https://github.com/sgl-project/sglang/issues/37608)
15. **Missing layer prefixes bypass per-module quantization setting (#37848, CLOSED)** — [link](https://github.com/sgl-project/sglang/issues/37848)
16. **[Fix PR] disaggregation: bind DCP pack thread to pack buffer's device (#47255)** — `try_pack_dcp_src` on transfer worker threads defaults to device 0 after leaving gather-stream context; every prefill rank packing for a DCP decode peer creates a device-0 context. [link](https://github.com/sgl-project/sglang/pull/47255)
17. **[Fix PR] flashinfer: read replayed draft extend's whole sliding window (#46472)** — CUDA-graph-replayed EAGLE draft extend starts its sliding-window read a window too early. [link](https://github.com/sgl-project/sglang/pull/46472)
18. **[Fix PR] OpenAI error envelope for non-streaming responses (#33534, CLOSED)** — Non-streaming 400s were returned flat instead of wrapped. [link](https://github.com/sgl-project/sglang/pull/33534)

---

## What This Means for Application Developers

- **Multimodal serving robustness**: If you serve GLM-V or other multimodal checkpoints and your users can send arbitrary message content, watch #38022 and #37579 — a single malformed request can take the engine down and cascade across the cluster via retries. Consider input validation / gateway-side placeholder sanitization until fixes land.
- **Speculative decoding under PD disagg is uneven**: DFLASH is not wired for PD (#36140), and the Triton chain-spec sampling regression (#42568) affects draft acceptance. If you rely on EAGLE/MTP + PD, pin to a known-good version and validate draft acceptance rates before upgrading.
- **Agent workloads with long shared prefixes**: The proposed agent-aware session-affinity router policy (#34513) targets the exact pain point of multi-turn agent loops re-prefilling the growing conversation — RadixAttention only helps if turns of the same session land on the same replica. Worth tracking if you route agents through `sgl-router`.
- **Tool-calling parser config**: Auto-selection has had misroutes (e.g., Spark-X2.5, #37608). Pin `--tool-call-parser` explicitly for non-OpenAI-native models rather than relying on `auto`.
- **ROCm users**: `--dcp-size > 1` is currently broken (#38709), and the greedy fallback in spec-decoding verify (#32922) was silently downgrading all HIP requests — verify sampling params actually take effect after upgrading.
- **Architecture direction**: The `api.v1` unification RFC (#45816) consolidates `sgl-processor`, `sgl-router`, and the generation path behind a single Rust-server schema. Expect config/interface churn around router and processor APIs in Q4 — track the sub-PRs if you've built custom integrations.

</details>

<details>
<summary><strong>llama.cpp</strong> — <a href="https://github.com/ggml-org/llama.cpp">ggml-org/llama.cpp</a></summary>

# llama.cpp Digest — 2026-11-04

## 1. Today's Highlights

A very active 24 hours: **multi-node tensor parallelism via NCCL** (#28967) landed, a meaningful step toward distributed inference beyond single-host; **NVFP4 quantization for LFM3** and **Nemotron 3.5 Transcribe multimodal support** expand the model/format matrix; and several correctness/performance fixes target CUDA Q8_1 quantization, GDN recurrent kernels, and host-memory pressure in the scheduler. The issue tracker is noisy with SYCL, Hexagon, and speculative-decoding problems, but most new reports are backend-specific edge cases rather than master regressions.

---

## 2. Releases & Breaking Changes

Rapid-fire nightly builds, no schema/API breaks today:

- **b12088** — NVFP4 LFM3 GGUF support ([#31608](https://github.com/ggml-org/llama.cpp/pull/31608))
- **b12087** — Nemotron 3.5 Transcribe multimodal support ([#31471](https://github.com/ggml-org/llama.cpp/pull/31471))
- **b12086** — Remove redundant contiguous copy in Qwen4 GDN conv-state writes ([#31443](https://github.com/ggml-org/llama.cpp/pull/31443))
- **b12084** — Record layer inputs in LFM3 for spec decoding ([#31598](https://github.com/ggml-org/llama.cpp/pull/31598))
- **b12083** — Fix signed-overflow UB in `ggml_roll` bounds check ([#30375](https://github.com/ggml-org/llama.cpp/pull/30375))
- **b12081** — CUDA Q8_1 correction-sum fix ([#31247](https://github.com/ggml-org/llama.cpp/pull/31247))
- **b12080** — CUDA batched tensor reads into mapped host memory ([#31391](https://github.com/ggml-org/llama.cpp/pull/31391))
- **b12078** — Reject mismatched shards in GGUF split merge ([#31579](https://github.com/ggml-org/llama.cpp/pull/31579))
- **b12077** — GLM-5.3 next small-tensor (`-sm tensor`) support ([#30499](https://github.com/ggml-org/llama.cpp/pull/30499))

**Migration note:** `-hf` tag matching was tightened ([#31620](https://github.com/ggml-org/llama.cpp/pull/31620)) — tags like `F16` now only match at token boundaries, so `:F16` no longer silently resolves to `BF16`. If your automation relied on loose substring matching, pin exact quant tags.

---

## 3. New Model & Hardware Support

- **NVFP4 quantization format** for LFM3 GGUFs ([#31608](https://github.com/ggml-org/llama.cpp/pull/31608)) — 4-bit float formats continue to gain traction alongside K-quants and IQ quants.
- **Nemotron 3.5 Transcribe** (multimodal) via mtmd ([#31471](https://github.com/ggml-org/llama.cpp/pull/31471)); conversion now rejects non-BF16 Transcribe checkpoints and fixes draft-model vocab for Nemotron-H targets.
- **GLM-5.3 next** small-tensor support, including MLA head splitting and `q_absorbed` continuation for non-unified KV ([#30499](https://github.com/ggml-org/llama.cpp/pull/30499)).
- **NCCL multi-node tensor parallelism** — new backend collective interface, implemented in CUDA, wired into the RPC server ([#28967](https://github.com/ggml-org/llama.cpp/pull/28967)). This is the headline backends item.
- **Hexagon LIGHTNING_INDEXER support** in flight ([#31289](https://github.com/ggml-org/llama.cpp/pull/31289)) — Q4_0/Q8_0/F16/F32 enablement for the GLM Lightning Indexer on Snapdragon NPUs.
- **OpenCL FA decode performance** improvements routing more GQA/head-size combinations ([#31633](https://github.com/ggml-org/llama.cpp/pull/31633)).
- **Intel Vulkan prefill FA kernel** PR open ([#29357](https://github.com/ggml-org/llama.cpp/pull/29357)).
- **Chatterbox TTS merged** ([#30993](https://github.com/ggml-org/llama.cpp/pull/30993)); **drama-3 TTS** proposed on top ([#31613](https://github.com/ggml-org/llama.cpp/pull/31613)).

---

## 4. Performance & Optimization

Concrete numbers where claimed:

- **SYCL `-sm tensor` prompt eval +19%** (16.7–20.6% range) via faster `ggml_sycl_comm_exchange()`, bringing tensor-split parity with layer-split on Intel Arc Pro B70s ([#30956](https://github.com/ggml-org/llama.cpp/pull/30956)).
- **GDN/Qwen3 kernel reduction** — removal of intermediate contiguous copies in conv-state writes cuts two device copies per generated token down to one on GDN layers ([#31443](https://github.com/ggml-org/llama.cpp/pull/31443)).
- **CUDA Q8_1 correction sum fix** ([#31247](https://github.com/ggml-org/llama.cpp/pull/31247)) — also reworked `quantize_mmq_q8_1` flow; potential accuracy and stability improvement on quantized CUDA paths.
- **TQ1_0 GEMV micro-optimization** — 1.86× microbench speedup by hoisting packed base-3 byte loads and unrolling ternary powers ([#31628](https://github.com/ggml-org/llama.cpp/pull/31628)).
- **Host memory reduction** — lazy allocation in scheduler context sizing and graph metadata ([#31274](https://github.com/ggml-org/llama.cpp/pull/31274)).
- **HIP fast-math enablement** without regressions ([#31625](https://github.com/ggml-org/llama.cpp/pull/31625)).
- **CUDA GDN ordered kernel option** for the 4-column GDN implementation, attempting to recover MTP decode perf after the upstream one-to-four state-column change ([#31630](https://github.com/ggml-org/llama.cpp/pull/31630)).

---

## 5. Stability & Regressions

Ranked by severity:

1. **Speculative decoding correctness divergence on quantized targets** — [Issue #25618](https://github.com/ggml-org/llama.cpp/issues/25618), 37 comments. Greedy output diverges from vanilla decoding when the *target* is quantized (e.g. Q4_K_M) but not with bf16 targets; ngram speculation behaves differently. **No fix PR referenced** — this is the most consequential open correctness issue for anyone shipping draft-model spec decode on quantized models.
2. **CUDA illegal memory access with Gemma 4 31B + draft-mtp** on KV cache rollback/checkpoint restore ([Issue #31077](https://github.com/ggml-org/llama.cpp/issues/31077)) — no crash with MTP off. RTX 4060 Ti, CUDA release builds.
3. **llama-server crash on invalid tool schema in `/v1/realtime`** ([Issue #31626](https://github.com/ggml-org/llama.cpp/issues/31626)) — **fix PR open**: return an error event instead of crashing ([#31632](https://github.com/ggml-org/llama.cpp/pull/31632)).
4. **DeepSeek-V4.1-Flash (PR branch) prompt-prefix reuse corruption** with Engram n-gram history ([Issue #30944](https://github.com/ggml-org/llama.cpp/issues/30944)) — draft branch, not master.
5. **DFlash2 + `--split-mode tensor` GGML_ASSERT crash** ([Issue #28777](https://github.com/ggml-org/llama.cpp/issues/28777)); works with layer split. A related CUDA error on DFlash with sm tensor was closed today ([#31586](https://github.com/ggml-org/llama.cpp/issues/31586)).
6. **SYCL segfault on oneAPI 2026.2.0** ([Issue #31064](https://github.com/ggml-org/llama.cpp/issues/31064)) and **`--moe-cache-mib` crash on Vulkan** ([Issue #30697](https://github.com/ggml-org/llama.cpp/issues/30697), now closed) — backend-specific.
7. **CUDA FA stream-k block count on RTX 5090** — long-context prefill 10–13% slower than RTX 4090, claimed +37–40% once fixed ([Issue #30784](https://github.com/ggml-org/llama.cpp/issues/30784)); open, no fix PR linked.
8. **`/slots` restore yields no KV reuse on hybrid/recurrent and SWA models** ([Issue #28194](https://github.com/ggml-org/llama.cpp/issues/28194)) — context checkpoints not persisted; relevant for agentic workloads relying on slot save/restore.
9. **Hexagon HMX MUL_MAT inf for n>=5** on Snapdragon 7 Gen 4 (HTP v73) ([Issue #29473](https://github.com/ggml-org/llama.cpp/issues/29473)) — new platform bring-up.

Numerous SYCL memory-related issues (VRAM growth, 2GB+ scratchpad with ngram-mod) closed as stale this cycle — if you were blocked there, retest on current builds.

---

## 6. What This Means for Application Developers

- **Distributed inference is arriving.** NCCL-backed multi-node tensor parallelism ([#28967](https://github.com/ggml-org/llama.cpp/pull/28967)) changes the deployment calculus for large MoE and dense models — watch this if you're currently sharding prompts across hosts for capacity.
- **If you run spec decoding on quantized models, validate output parity.** Issue #25618 remains open and directly affects greedy reproducibility for Q4_K_M-class targets. Until a fix lands, either pin bf16 targets for spec decode or A/B test outputs against vanilla decoding in CI.
- **`/v1/realtime` is not yet hardened against malformed tool schemas** — crash fix is PR-only today ([#31632](https://github.com/ggml-org/llama.cpp/pull/31632)). If you expose realtime tool calling, consider validating schemas before forwarding or wait for the merge.
- **Intel/SYCL users get real wins**: the +19% tensor-parallel prefill improvement ([#30956](https://github.com/ggml-org/llama.cpp/pull/30956)) plus the Vulkan Intel FA prefill kernel in review ([#29357](https://github.com/ggml-org/llama.cpp/pull/29357)) make Arc multi-GPU setups more viable.
- **Slot save/restore remains unreliable on hybrid/SWA models** ([#28194](https://github.com/ggml-org/llama.cpp/issues/28194)) — if your agent framework relies on checkpointed context to avoid re-prefill, test and budget for full reprocessing on those architectures.
- **`-hf` matching is stricter** ([#31620](https://github.com/ggml-org/llama.cpp/pull/31620)) — audit any CI/scripts that select quants by substring and switch to explicit boundary-aware tags.

</details>

<details>
<summary><strong>Ollama</strong> — <a href="https://github.com/ollama/ollama">ollama/ollama</a></summary>

# Ollama Digest — 2026-11-04

## 1. Today's Highlights

Ollama shipped **v0.40.14** (fixing cloud-model output caps, cloud web-search decoding on `/api/chat`, and OpenAI-compat endpoint behavior) and cut **v0.40.15-rc0**, which brings in-process CUDA loading for MLX on Linux plus MiMo V2.6 model support. On the PR side, the most consequential in-flight work is a set of tokenizer/inference APIs (`/api/tokenize`, `/api/detokenize`, input-token counting routes) and a pull-path rework that hashes download parts during transfer instead of post-pull. Meanwhile, several new correctness bugs surfaced around tool-call truncation, Responses API truncation flags, and a Pascal-era CUDA regression.

## 2. Releases & Breaking Changes

- **[v0.40.15-rc0](https://github.com/ollama/ollama/releases)** — Pre-release. Includes [PR #19433](https://github.com/ollama/ollama/pull/19433) (MLX loads bundled CUDA libs in-process on Linux, fixing host CUDA library shadowing for `libcusolver` dependencies) and [PR #19400](https://github.com/ollama/ollama/pull/19400) (MiMo V2.6 model support). No config/API migrations noted.
- **[v0.40.14](https://github.com/ollama/ollama/releases)** — `ollama launch claude` now applies the model's output-token limit for Claude Code (cloud models no longer hit the 128k default cap); cloud web-search responses on `/api/chat` decode correctly, including compressed responses; OpenAI-compatible endpoints behavior adjusted (release notes truncated in the source data — verify the full changelog before upgrading).

No breaking API changes or required migrations in this window. Note that `v0.40.13`/`v0.40.14` are the affected versions for the tool-call and truncation bugs in Section 5.

## 3. New Model & Hardware Support

- **MiMo V2.6** — Added in [v0.40.15-rc0 / PR #19400](https://github.com/ollama/ollama/pull/19400) (MLX + GGUF candidates via `dhiltgen/mimo-v2.6`).
- **AutoTrust (text + vision)** — MLX support in progress via [PR #19399](https://github.com/ollama/ollama/pull/19399), covering model creation, prompt encoding, and API routing. Test model: `dhiltgen/autotrust-jev`.
- **Video input for MLX models** — [PR #19348](https://github.com/ollama/ollama/pull/19348) lands MP4/MOV clip support for LFM3-VL, LFM3-Omni, and Qwen3.5/3.6 MLX models through the existing `images` field, with content-based clip detection and a new `"video"` capability flag. **Gap:** Linux and Windows GGUF paths do not yet accept video — see [Issue #19503](https://github.com/ollama/ollama/issues/19503).
- **Linux CUDA for MLX** — [PR #19433](https://github.com/ollama/ollama/pull/19433) resolves library-resolution failures for bundled CUDA without relying on `LD_LIBRARY_PATH` at runtime.
- **Regression:** Pascal-generation NVIDIA GPUs broke under CUDA in 0.40.13 ([Issue #19485](https://github.com/ollama/ollama/issues/19485), now closed) — verify driver/toolkit pairing if you're pinned to that release.

## 4. Performance & Optimization

- **Pull verification off the critical path** — [PR #19505](https://github.com/ollama/ollama/pull/19505) hashes GGUF blob parts from the page cache in offset order during parallel Range downloads (up to 16 parts), then validates the digest before rename, skipping the redundant post-pull `verifyBlob()` disk re-hash. Directly addresses [Issue #19504](https://github.com/ollama/ollama/issues/19504). Meaningful for large-model pulls on cold caches — you no longer pay a full second read of the blob after download.
- **MLX concurrent generation** — [PR #19197](https://github.com/ollama/ollama/pull/19197) lets MLX models serve multiple generation requests concurrently via `OLLAMA_NUM_PARALLEL`, sharing projection and feed-forward work across ready requests. Default remains 1; memory scales per active request. Relevant for multi-agent fan-out on Apple Silicon.
- **Open question — MLX prefix cache budget** — [Issue #18131](https://github.com/ollama/ollama/issues/18131) reports the hard-coded 8 GiB prefix cache budget drives a 32 GB Apple Silicon machine into heavy swap during `qwen3.8:27b-mlx` agent workloads. Maintainers appear to treat this as expected cache growth, not a leak, but the fixed budget is the pain point.
- **Loading regression under investigation** — [Issue #18373](https://github.com/ollama/ollama/issues/18373) reports significant model-load time regressions for `gpt-oss:120b` (and others) since 0.23.4, still open without a fix PR.
- **VRAM estimation underreporting** — [Issue #10128](https://github.com/ollama/ollama/issues/10128) (3 👍) shows Ollama using ~10 GB for a 262144-context Qwen2.5 7B with `OLLAMA_FLASH_ATTENTION=1` and `q8_0` KV cache, suggesting the scheduler misjudges large-context allocations. Unfixed; affects model placement decisions.

## 5. Stability & Regressions

Ranked by severity:

1. **Scheduler deadlock (critical, no fix PR)** — [Issue #17408](https://github.com/ollama/ollama/issues/17408): when the eviction path selects a target that a concurrent request resurrects at the wrong moment, the pending load loop blocks forever and **every** subsequent load request hangs. Reproduced on 0.31.1; code path unchanged on `main`. This is the highest-impact open bug for multi-tenant or high-churn deployments.
2. **Tool calls cut off by token limit return HTTP 500** — [Issue #19493](https://github.com/ollama/ollama/issues/19493): when `num_predict`/`max_tokens` stops generation mid tool call, `llama-server` returns invalid JSON and Ollama fails the whole request instead of dropping the incomplete call. **Fix PR exists:** [PR #19494](https://github.com/ollama/ollama/pull/19494) discards calls with unparseable arguments only when `finish_reason: "length"`.
3. **Responses API silently truncates despite `truncation: disabled`** — [Issue #19492](https://github.com/ollama/ollama/issues/19492) (0.40.13 and 0.40.14, Bonsai 27B on Windows): `FromResponsesRequest` never maps `Truncation` to `api.ChatRequest.Truncate`, so the handler defaults `truncate` to `true`. **Fix PR exists:** [PR #19501](https://github.com/ollama/ollama/pull/19501). Data-loss-adjacent for anyone sending oversized inputs to `/v1/responses`.
4. **Vision inference failure on NVIDIA GPUs** — [Issue #19483](https://github.com/ollama/ollama/issues/19483) (duplicate [Issue #19482](https://github.com/ollama/ollama/issues/19482)): `qwen2.5vl:3b` vision encoder on GPU fails with HTTP 500 `"prediction aborted, token repeat limit reached"`; text-only GPU and full vision CPU paths work. No fix PR visible.
5. **OpenAI-compat tool results with images rejected** — [Issue #19479](https://github.com/ollama/ollama/issues/19479): `/v1/chat/completions` returns a misleading HTTP 400 for image content in `role: "tool"` messages even when tool-call IDs pair correctly. Minimal repro included.
6. **401 auth errors swallowed** — [Issue #19489](https://github.com/ollama/ollama/issues/19489): `Client.stream()` drops `AuthorizationError`/`SigninURL` when a 401 body isn't valid JSON. **Fix PR exists:** [PR #19491](https://github.com/ollama/ollama/pull/19491).
7. **Minor:** `HumanNumber` rounds past unit boundaries (999500 → `"1000K"`), [Issue #19490](https://github.com/ollama/ollama/issues/19490); two competing fix PRs ([#19499](https://github.com/ollama/ollama/pull/19499), [#19500](https://github.com/ollama/ollama/pull/19500)). Windows `cmake -G Ninja` nested llama-server build uses the wrong generator, [Issue #19495](https://github.com/ollama/ollama/issues/19495) with fix in [PR #19496](https://github.com/ollama/ollama/pull/19496). FreeBSD build fix in [PR #19502](https://github.com/ollama/ollama/pull/19502).

## 6. What This Means for Application Developers

- **Agent orchestration needs truncation awareness.** Two separate bugs ([#19493](https://github.com/ollama/ollama/issues/19493), [#19492](https://github.com/ollama/ollama/issues/19492)) mean that when you hit token limits, you get either a hard HTTP 500 or silent input truncation depending on endpoint. Until [PR #19494](https://github.com/ollama/ollama/pull/19494) and [PR #19501](https://github.com/ollama/ollama/pull/19501) land, defensively cap tool-call output budgets and validate that your inputs aren't being shortened. If you rely on `/v1/responses`, check your version.
- **Token counting is becoming a first-class API.** [PR #19498](https://github.com/ollama/ollama/pull/19498) adds `/api/tokenize` and `/api/detokenize` without loading the model, and [PR #17478](https://github.com/ollama/ollama/pull/17478) adds `/v1/messages/count_tokens` plus Ollama-specific input-token routes that reuse the `debug_render_only` path. Once merged, you can budget context client-side before dispatch — worth tracking if you're building routing or batching layers.
- **Thinking-token budgets are maturing.** [PR #17566](https://github.com/ollama/ollama/pull/17566) separates a per-request/per-model thinking token budget from the reasoning level, rather than overloading `think: "high"`. If you use reasoning models, this changes how you'll express latency/cost controls. Related: [Issue #11979](https://github.com/ollama/ollama/issues/11979) asks for OpenAI-compatible think toggle (`extra_body` doesn't work today).
- **MLX on Apple Silicon is getting concurrent serving, but memory is tight.** [PR #19197](https://github.com/ollama/ollama/pull/19197) enables parallelism for MLX, but [Issue #18131](https://github.com/ollama/ollama/issues/18131) shows the fixed 8 GiB prefix cache budget already stresses 32 GB machines under agent workloads. Raise `OLLAMA_NUM_PARALLEL` cautiously on unified memory; expect swap before OOM.
- **Multi-tenant deployments should avoid depending on the eviction path.** The scheduler deadlock in [Issue #17408](https://github.com/ollama/ollama/issues/17408) is unfixed on `main`. If you run concurrent load pressure near VRAM limits, pin known-good versions and consider pre-warming models to avoid triggering evictions.
- **CLI scripting gets easier soon.** [PR #17349](https://github.com/ollama/ollama/pull/17349) adds `--json` to `ollama list` and `ollama ps`, which removes the need to parse table output in automation.

</details>

<details>
<summary><strong>LiteLLM</strong> — <a href="https://github.com/BerriAI/litellm">BerriAI/litellm</a></summary>

# LiteLLM Digest — 2026-11-04

## 1. Today's Highlights

No new releases landed in the last 24h, but the proxy/router surface saw substantial churn: a large-scale typing refactor (1,180 `basedpyright` errors cleared across 244 files), a breaking dependency move to OpenAI SDK 3 in the Docker image, and a `fix(proxy)!:` security change that refuses unissued managed Responses IDs. A cluster of streaming-fallback and rate-limiter correctness bugs remains open on the router/translation layer, several with fix PRs already in flight (e.g. streamed `flex_unavailable` → 429, retry/backoff semantics).

## 2. Releases & Breaking Changes

- **uv.lock + Docker image moved to OpenAI SDK 3** ([PR #47762](https://github.com/BerriAI/litellm/pull/47762), `risk:low`, marked `!`) — includes the transport fix from #44993. Anyone pinning the official image should re-validate against SDK 3 wire behavior.
- **Proxy: refuse unissued managed Responses IDs** ([PR #46424](https://github.com/BerriAI/litellm/pull/46424), `fix(proxy)!`) — the OpenAI/Azure pass-through `Responses` routes now reject plain `resp_` IDs the gateway never handed out. Azure `model_list` relay also no longer hands out un-owned IDs, closing a cross-key response-continuation hole.
- **Retries overhaul: `Retry-After`, exponential backoff + jitter, transient-error filtering** ([PR #46730](https://github.com/BerriAI/litellm/pull/46730), `fix(retries)!`) — direct `litellm.completion`/`acompletion`, `completion_with_retries`, and `litellm --model` proxies now wait out provider `Retry-After` up to 60s per retry. Expect longer tail latency in retry paths; callers with tight deadlines should tune `num_retries`.
- **Anthropic `/v1/messages` → OpenAI thinking controls preserved** ([PR #49765](https://github.com/BerriAI/litellm/pull/49765), `fix(anthropic)!`) — `disabled`, `display`, `between_tools`, and effort-without-thinking now propagate. Behavior change for clients that relied on silent dropping.
- **MCP provider-native registrations** ([PRs #49886](https://github.com/BerriAI/litellm/pull/49886), [#49891](https://github.com/BerriAI/litellm/pull/49891), [#49894](https://github.com/BerriAI/litellm/pull/49894), [#49897](https://github.com/BerriAI/litellm/pull/49897)) — new schema separates "provider-executed" MCP servers from gateway-executable ones, with key/team tool permissions enforced on Responses (HTTP/stream/WS) and Anthropic Messages. Config-shape change for anyone who registered MCP servers previously.
- **1.108 rc dependency alignment** ([PR #49985](https://github.com/BerriAI/litellm/pull/49985)) — OSV flags 19 packages on `rc/1.108.0`, two ignores expired, staged image failed grype at High severity. rc branch consumers should hold.

## 3. New Model & Hardware Support

- **EmpirioLabs models added** to `model_prices_and_context_window.json` ([PR #49943](https://github.com/BerriAI/litellm/pull/49943)) — chat, embedding, and rerank entries keyed `empiriolabs/<model id>`, with per-token prices and cited public sources.
- **Cloudflare Workers AI image and audio support** proposals closed as stale/duplicate ([#35055](https://github.com/BerriAI/litellm/issues/35055), [#35056](https://github.com/BerriAI/litellm/issues/35056)) — no action; the `cloudflare` provider still lacks native image/audio paths.
- **Custom-provider model discovery** still open ([#20064](https://github.com/BerriAI/litellm/issues/20064), 13 👍) — wildcard `model_name: my-custom-service/*` discovery not yet implemented.
- **Bedrock Converse reasoning replay to non-Anthropic models breaks** ([#49969](https://github.com/BerriAI/litellm/issues/49969)) — replaying `reasoningText.signature` from Claude to `zai.glm-5.3` returns Bad Request. Relevant to anyone running auto-router across Bedrock vendors.

## 4. Performance & Optimization

- **Spend-log storage reduction: `latest_turn` mode** ([PR #49544](https://github.com/BerriAI/litellm/pull/49544)) — opt-in mode stores only the current turn for stateless coding-agent requests instead of the entire replayed chat history, addressing rapid spendlog row growth when `store_prompts_in_spend_logs: true`.
- **Typing refactor clearing 1,180 `Any` errors across 244 files** ([PR #49986](https://github.com/BerriAI/litellm/pull/49986)) — no user-visible runtime change, but narrows types at the source across providers, proxy, router, and logging; reduces long-term regression surface.
- **TPM token reservation window bug under 429s** ([#49675](https://github.com/BerriAI/litellm/issues/49675)) — v3 rate limiter with `LITELLM_TPM_TOKEN_RESERVATION_ENABLED=true` is rejecting keys/teams below `tpm_limit` because the TPM counter outlives its window after upstream 429s. Capacity-planning impact for anyone running restrictive TPM budgets.

## 5. Stability & Regressions

Ranked by severity:

1. **Redis circuit breaker stuck HALF_OPEN after failover** — [#49884](https://github.com/BerriAI/litellm/issues/49884). After a managed Redis/Valkey primary failover, the breaker moves to HALF_OPEN but never closes when the probe fails with a non-connectivity error (e.g. `READONLY`). Pods keep serving while all guarded Redis calls fast-fail. **High** — affects HA/multi-pod deployments. No fix PR referenced.
2. **Proxy exits at startup under `TZ=Asia/Calcutta` without `tzdata`** — [#49813](https://github.com/BerriAI/litellm/issues/49813). Stock Ubuntu 24.04/26.04 ships legacy tz aliases in `tzdata-legacy`; the scheduler's tzlocal lookup hard-fails. **High** for pip-based installs in those regions. No fix PR referenced.
3. **Streamed `flex_unavailable` maps to 500 instead of 429** — [#49736](https://github.com/BerriAI/litellm/issues/49736). OpenAI flex capacity errors on streamed Responses calls produce wrong status, breaking client retry logic. **Medium**. No fix PR referenced.
4. **Mid-stream fallback lost when first delta is reasoning-only** — [#49795](https://github.com/BerriAI/litellm/issues/49795). `sent_first_chunk` flips on reasoning deltas, so high-effort models that fail while "thinking" are treated as post-first-chunk and lose their fallback. **Medium** — silent quality degradation on reasoning models.
5. **Mistral drops named `tool_choice`** — [#39736](https://github.com/BerriAI/litellm/issues/39736). Pinned tool is never called when passed as `{"type":"function",...}`. **Medium** for agent apps relying on forced tool use.
6. **OCI Gemini ignores all but last system message** — [#48813](https://github.com/BerriAI/litellm/issues/48813). Closed after ~6 days; earlier system messages silently dropped, breaking system-prompt chaining. Confirm the fix landed in your pinned version.
7. **langfuse_otel OTLP endpoint missing `/v1/traces`** — [#43032](https://github.com/BerriAI/litellm/issues/43032). Self-hosted Langfuse silently 404s on all spans. **Medium** — observability blind spot. No fix PR referenced.
8. **Router drops per-deployment `num_retries`/`cooldown_time` on `aresponses` and `aanthropic_messages`** — [#35071](https://github.com/BerriAI/litellm/issues/35071). Closed as stale without fix. Watch for regressions in non-chat Router paths.
9. **Embedding `list[str]` inputs cause router pre-call token-count exception** — [#35626](https://github.com/BerriAI/litellm/issues/35626). Context check is silently skipped. **Low-Medium**.
10. **Vertex↔Gemini router fallback replays endpoint-bound thought signatures** — [#32140](https://github.com/BerriAI/litellm/issues/32140). Closed as stale; 400 "Corrupted thought signature" tolerated as a known limitation on Gemini 3.x cross-endpoint fallback.

Also worth tracking: `Interactions` spec canary red ([#49038](https://github.com/BerriAI/litellm/issues/49038), Google live-spec snapshot drift); HuggingFace embeddings ignoring `timeout` ([#47299](https://github.com/BerriAI/litellm/issues/47299), closed); Azure AI Foundry Anthropic 400 from `azure_ad_token` leaking into body ([#46701](https://github.com/BerriAI/litellm/issues/46701), closed).

Guardrail- and pass-through-related fix PRs in flight: Bedrock InvokeModel Claude guardrail masks ([#49947](https://github.com/BerriAI/litellm/pull/49947)); buffered-stream `post_call` rewrites on the `guardrails:` config path ([#49905](https://github.com/BerriAI/litellm/pull/49905)).

## 6. What This Means for Application Developers

- **If you pin the official Docker image:** SDK 3 bump ([#47762](https://github.com/BerriAI/litellm/pull/47762)) is imminent; test against it in staging before upgrading. Avoid `rc/1.108.0` until [#49985](https://github.com/BerriAI/litellm/pull/49985) lands — it currently fails OSV and grype scans.
- **Reasoning models + fallbacks:** streamed fallback is unreliable on reasoning-only first deltas ([#49795](https://github.com/BerriAI/litellm/issues/49795)). If you depend on `fallbacks` for high-effort Claude/Gemini/OpenAI reasoning, prefer non-streamed calls or add client-side retry until this is fixed.
- **Cross-vendor auto-router with thinking state:** Bedrock Converse replays Anthropic thought signatures to non-Anthropic models ([#49969](https://github.com/BerriAI/litellm/issues/49969)) and Vertex/Gemini has a similar signature issue ([#32140](https://github.com/BerriAI/litellm/issues/32140)). Strip reasoning blocks on vendor switch or isolate thinking conversations from auto-routing.
- **Retry tuning:** [#46730](https://github.com/BerriAI/litellm/pull/46730) introduces up-to-60s `Retry-After` waits. Re-audit request timeouts on agents with strict SLAs — a rate-limited call may now block far longer than before.
- **Forced tool use:** Mistral `tool_choice` object form is broken ([#39736](https://github.com/BerriAI/litellm/issues/39736)). If you pin a specific tool, either restrict this route or validate the tool actually fired.
- **Observability:** self-hosted Langfuse via `langfuse_otel` is silently dropping spans ([#43032](https://github.com/BerriAI/litellm/issues/43032)). Verify trace ingestion; consider `LangfuseOtelLogger` workarounds or an alternate exporter.
- **HA deployments:** audit Redis circuit-breaker recovery ([#49884](https://github.com/BerriAI/litellm/issues/49884)) before your next managed Redis failover. Consider forced breaker resets or alerting on prolonged HALF_OPEN.
- **Rate-limit critical workloads:** if you rely on `tpm_limit` enforcement under upstream 429 pressure ([#49675](https://github.com/BerriAI/litellm/issues/49675)), consider disabling TPM token reservation or reducing reliance on hard TPM gates until this is fixed.
- **MCP:** if you registered remote MCP servers, review the new provider-native registration model ([#49886](https://github.com/BerriAI/litellm/pull/49886)–[#49897](https://github.com/BerriAI/litellm/pull/49897)) — permission semantics and execution modes have changed.
- **Cost/storage hygiene:** coding agents sending full history are the target of the new `latest_turn` spend-log mode ([#49544](https://github.com/BerriAI/litellm/pull/49544)) — worth enabling if spendlog growth is a concern.

</details>

<details>
<summary><strong>Unsloth</strong> — <a href="https://github.com/unslothai/unsloth">unslothai/unsloth</a></summary>

# Unsloth Digest — 2026-11-04

## 1. Today's Highlights

Unsloth shipped **v0.1.914-beta**, headlined by Glass themes and UI personalization but also carrying meaningful infrastructure work: faster generation, expanded multi-GPU training options, and **CPU training support**. On the PR side, a significant decode optimization landed for 16-bit + LoRA models (up to **1.4x faster generation** via weight folding), alongside continued investment in FP8 LoRA kernels, context parallelism, and FSDP2 MoE sharding. The Studio desktop app remains a source of friction, with several update/launch regressions reported today.

## 2. Releases & Breaking Changes

- **v0.1.914-beta — Glass Theme, Personalize & Faster Generation** ([release](https://github.com/unslothai/unsloth/releases))
  - New Glass themes plus customization for backgrounds, greetings, and chats.
  - Faster generation, additional multi-GPU training options, and **CPU training** in Unsloth.
  - ⚠️ Multiple users report the in-app update to this version **fails to complete** on Windows ([#16573](https://github.com/unslothai/unsloth/issues/16573)) and macOS ([#16561](https://github.com/unslothai/unsloth/issues/16561)). AppImage packaging also broke on some distros ([#16605](https://github.com/unslothai/unsloth/issues/16605)) — see §5.
- **PyPI extras lag:** torch 2.13.0/2.14.0 extras (`cu130-2130`, `cu130-2140`) are declared in `pyproject.toml` but not published to PyPI in `2026.10.11` ([#16520](https://github.com/unslothai/unsloth/issues/16520)).

## 3. New Model & Hardware Support

- **CPU training** — now available in Unsloth as part of v0.1.914-beta ([release](https://github.com/unslothai/unsloth/releases)).
- **Expanded multi-GPU training** options in the same release.
- **FSDP2 stacked MoE expert loading** — enables Nemotron-H checkpoints under native FSDP2 sharding by reading per-rank experts directly for `MergeModulelist(dim=0)` conversions and sharding packed 3-D expert params ([#16560](https://github.com/unslothai/unsloth/pull/16560)).
- **Generic Ulysses context parallelism** on any Hugging Face attention model, removing per-trainer patching ([#16558](https://github.com/unslothai/unsloth/pull/16558)).
- **FP8 LoRA** — explicit FP8 forward and input-gradient GEMMs on frozen 16-bit bases, preserving exact masters for save/merge/generate ([#16423](https://github.com/unslothai/unsloth/pull/16423)).
- **transformers 5.21+ compatibility** — `update_weight_conversions` overrides updated to forward the `model` argument ([#16559](https://github.com/unslothai/unsloth/pull/16559)).
- Vulkan on RX 5700 XT (Windows) still non-functional ([#16395](https://github.com/unslothai/unsloth/issues/16395)); DGX Spark guidance question unresolved ([#16342](https://github.com/unslothai/unsloth/issues/16342)).

## 4. Performance & Optimization

- **16-bit LoRA weight folding for long generates: 1.3–1.4x decode speedup** — folds LoRA A/B into base weights for the duration of `generate`, eliminating per-step LoRA matmuls, then restores base weights bitwise ([#16576](https://github.com/unslothai/unsloth/pull/16576)).
- **Studio context cache regression fix (in PR):** switching models and back discarded prior context; a 23k-token chat took 20s to first token on a T4 (~11 min at 100k tokens on slower HW). PR preserves chat context across model switches ([#16493](https://github.com/unslothai/unsloth/pull/16493)).
- **FP8 rowwise `scaled_mm` fixes:** prevent fp16 output overflow to inf on torch < 2.14 (values near 65504), and drop the row guard for always-dequant dtypes when compiled ([#16598](https://github.com/unslothai/unsloth/pull/16598)).
- **Block compile + gradient checkpointing:** resolves `CheckpointError` on Gemma-4 vision/audio training by reusing the forward graph via `shared_kv_states` and output collector ([#16596](https://github.com/unslothai/unsloth/pull/16596)).
- **Studio worker load:** `adapter_config.json` read once per inference worker load instead of twice ([#16604](https://github.com/unslothai/unsloth/pull/16604)) — small but measurable Hub-load latency win.

## 5. Stability & Regressions

Ranked by severity:

1. **AppImage fails to start (Slackware64-current)** — GLib/AppIndicator symbol lookup error with v0.1.914-beta, NVIDIA 5070 Ti ([#16605](https://github.com/unslothai/unsloth/issues/16605)). No fix PR yet.
2. **Update to v0.1.914-beta does not complete** — reported on both Win 11 ([#16573](https://github.com/unslothai/unsloth/issues/16573)) and macOS 26.6.2 ([#16561](https://github.com/unslothai/unsloth/issues/16561)). Blocks users from receiving the release.
3. **Dynamic MCP loading invalidates prompt cache on hybrid/recurrent models — 17x slowdown** ([#16538](https://github.com/unslothai/unsloth/issues/16538), closed). Severe if you rely on MCP tools with hybrid models.
4. **AppImage Unsloth Studio laggy UI** ([#15999](https://github.com/unslothai/unsloth/issues/15999)) — open, 5 comments.
5. **Long conversations cause UI lag (web + desktop)** ([#16603](https://github.com/unslothai/unsloth/issues/16603)) — new today.
6. **`search_conversation` tool disappears (2nd occurrence)** ([#16602](https://github.com/unslothai/unsloth/issues/16602)).
7. **Studio drops arbitrary `chat_template_kwargs`** — only `enable_thinking`, `reasoning_effort`, `preserve_thinking` survive filtering in `llama_cpp.py`, breaking model-specific flags like `verification: true` for Sage-A1.5 agentic use ([#16545](https://github.com/unslothai/unsloth/issues/16545)).
8. **S3 audio manifest-relative path collisions** silently redirect training rows to the wrong audio file, producing incorrect training pairs ([#16528](https://github.com/unslothai/unsloth/issues/16528)) — **data correctness issue in fine-tuning pipelines**.
9. **Model Hub missing newest paid models** (e.g. Kimi-3.1-pro not shown) ([#16586](https://github.com/unslothai/unsloth/issues/16586)).
10. **Tray listener test brittleness** breaking CI — fixed in [#16600](https://github.com/unslothai/unsloth/pull/16600).

## 6. What This Means for Application Developers

- **Generation just got cheaper for LoRA serving.** If you serve a 16-bit base + LoRA adapter via Unsloth, PR [#16576](https://github.com/unslothai/unsloth/pull/16576) gives a free 1.3–1.4x decode speedup on long outputs — worth tracking to main.
- **Pin your desktop version carefully.** v0.1.914-beta's auto-updater is failing on Win/macOS, and the AppImage has a hard launch regression on some Linux distros. If you depend on Studio desktop in production, hold on 0.1.913-beta until update issues are resolved, or use the CLI/web UI paths.
- **MCP + hybrid models = cache invalidation.** If you build agents with MCP tool sets on hybrid/recurrent architectures, expect large prompt-cache penalties (reported 17x). Consider static tool registration over dynamic MCP loading until this is addressed.
- **`chat_template_kwargs` is filtered.** Agents relying on model-specific chat template flags (e.g. `verification`, custom Sage variants) cannot pass them through Studio today. If your pipeline needs them, call the underlying backend directly or track [#16545](https://github.com/unslothai/unsloth/issues/16545).
- **Audio dataset pipelines: validate S3 prefix layouts.** The manifest-relative path collision ([#16528](https://github.com/unslothai/unsloth/issues/16528)) can silently corrupt fine-tuning data — audit for duplicate relative filenames across prefix roots.
- **Multi-GPU and FSDP2 users:** CPU training, MoE expert sharding, and generic context parallelism are actively landing — good time to test on Nemotron-H and long-context workloads.
- **FP8 path is maturing but not fully landed:** PR [#16423](https://github.com/unslothai/unsloth/pull/16423) explicitly holds merge until final-head GPU/inference/platform validation completes. Don't build on FP8 LoRA merges yet.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*