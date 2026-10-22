# AI Infrastructure Digest 2026-10-23

> Generated: 2026-10-22 23:57 UTC | Projects covered: 6

- [vLLM](https://github.com/vllm-project/vllm)
- [SGLang](https://github.com/sgl-project/sglang)
- [llama.cpp](https://github.com/ggml-org/llama.cpp)
- [Ollama](https://github.com/ollama/ollama)
- [LiteLLM](https://github.com/BerriAI/litellm)
- [Unsloth](https://github.com/unslothai/unsloth)

---

## Cross-Project Comparison

# Cross-Project Comparison Report — AI Infrastructure Ecosystem
**Digest date: 2026-10-23**

---

## 1. Ecosystem Overview

Today's digests show a maturing but still turbulent inference stack, where the dominant engineering risk has shifted from raw performance to **correctness and isolation under disaggregated serving**. vLLM and SGLang are both fighting silent cross-request KV contamination and P/D transfer bugs, while llama.cpp, Ollama, and Unsloth wrestle with backend-specific regressions (RDNA4 flash attention, AMD Vulkan caching, SYCL DeltaNet). LiteLLM's day was consumed by a **supply-chain compromise** of a published release — a reminder that the gateway layer is now a high-value attack surface. Meanwhile, optimization work is converging on KV cache management, sparse/quantized kernels, and weight-loading latency, and model support is racing to cover DeepSeek-V4.1, Qwen3.8, GLM-5.3, and Kimi-K3 across very different hardware tiers. No project shipped a stable release today; all activity is in issues, PRs, and release candidates.

---

## 2. Activity Comparison

| Project | Layer | Issues / Tracker Activity | PR Activity | Release Status (last 24h) |
|---|---|---|---|---|
| **vLLM** | Serving engine (server, GPU) | Very high — #50576 (118 comments), multiple open regressions | High — MRV2 speculator refactor, ROCm, KV offload fixes | None; nightly/in-flight only |
| **SGLang** | Serving engine (server, GPU) | High — 2 critical P/D correctness bugs, CI tracker at 122 comments | Moderate–high — DeepSeek-V4.1, Megakernel API, Quark MXFP4 | None |
| **llama.cpp** | Local runtime (cross-backend) | Moderate–high — TTFT regression, gfx1201 corruption | High — Intel XMX, OpenCL Adreno, Hexagon, CUDA graph keying | Rolling `b118xx` builds (no breaking changes) |
| **Ollama** | Local runtime + cloud | High — Cloud Pro outage (55 comments), AMD regression | Moderate — TTS/Phonon, MLX Nemotron, tool-call fixes | `v0.40.9-rc3` (TTS RC) |
| **LiteLLM** | LLM gateway / proxy | Very high — supply-chain incident, budget leaks | Moderate — CA bumps, cache isolation, SSE framing | None; 1.106.x backport requested |
| **Unsloth** | Fine-tuning / Studio | High — 328 PRs updated, multiple open crashes | Very high — Studio hardening, diffusion memory, security fixes | None |

**Takeaways:**
- **PR velocity leader:** Unsloth (328 PRs updated), driven by a single contributor's hardening sweep.
- **Incident load leader:** LiteLLM (critical supply-chain + multiple budget-isolation bugs).
- **Correctness-bug leader:** SGLang and vLLM, both with open P/D disaggregation contamination issues.
- **Only release-candidate movement:** Ollama (`v0.40.9-rc3`, TTS).

---

## 3. Model Support Race

| Model / Architecture | vLLM | SGLang | llama.cpp | Ollama | Unsloth |
|---|---|---|---|---|---|
| **DeepSeek-V4-Flash / V4.1** | ⚠️ SM8x (Ampere) unsupported (#50576); V4.1 P/D bug open | ✅ Token-interleaved KV, sparse prefill dequant, SM90 graph fix | ❌ `deepseek41-dspark` arch unrecognized (#14695) | — | ❌ Load failure reported |
| **Qwen3.8-Flash-Next / 27B** | ⚠️ GB10 >2048-token truncation (#62776) | ⚠️ QSA indexer resume bug (#45864) | ⚠️ gfx1201 FA corruption; DeltaNet decode collapse | — | ✅ GatedDeltaNet FSDP2 + Ulysses (PR #12052) |
| **GLM-5.3-Flash** | ✅ Chunk KDA prefill (ROCm) | ⚠️ SM120 fa4 crash; H20 EAGLE IMA | ✅ GLM5 input optimization | ⚠️ `glm-5.3-flash:cloud` degeneration | — |
| **Kimi-K3** | — | ⚠️ DCP a2a garbled (GB300); SM90 SiTU bug | — | — | — |
| **MiniMax-M3** | ✅ FP8 indexer cache on gfx942 (PR #62270) | — | — | — | — |
| **Nemotron 3.5 Bolt 74B-A9B** | — | — | ✅ Non-standard GQA + BPE tokenizer | ✅ MLX in-progress (PR #19229) | — |
| **Muse Spark** | — | ✅ Day-0 (split PRs) | — | — | — |
| **MiniCPM-OCR / Flint / Soprano** | — | — | ✅ Added (mtmd / GGUF) | — | — |

**Who's ahead:**
- **SGLang** leads on **new-architecture day-0 coverage** (Muse Spark, DeepSeek-V4.1 token-interleaved KV), but with more open correctness caveats.
- **vLLM** leads on **hardware breadth** (ROCm MI200/MI300/MI355X, SM8x trackers, MiniMax-M3 FP8) but is lagging on Ampere support for DeepSeek-V4-Flash.
- **llama.cpp** owns **edge/local model breadth** — MiniCPM-OCR, Flint, Soprano, Nemotron — but not frontier MoE.
- **Unsloth** is the only project pushing **hybrid GatedDeltaNet training/serving** (FSDP2 + context parallel), a niche but strategically important architecture.

---

## 4. Performance Frontier

Optimization effort is concentrated across five themes, with clear project specialization:

**KV cache & memory management** *(the hottest area)*
- vLLM: KV offload fixes for resumed streaming (#60810), cross-TP offload for GDN hybrids (#62914), EAGLE lookahead block hashes (#61589).
- SGLang: FP4 KV scales transfer (#45866 — buggy), HiCache host-tier exhaustion on hybrid GDN (#45400).
- llama.cpp: `llama_moe_cache` CPU-share expert offload (#30966), server checkpoint reuse (#30683).
- Ollama: KV cache connector framework proposal (#17696).

**Kernels & quantization**
- vLLM: register-resident `rms_norm_per_block_quant` (#62514), QuantizedActivation contract (#61073), FlashInfer MoE workspace (#62948).
- SGLang: Block-FP8 SwiGLU fusion (#45219), Quark MXFP4 on RDNA (#41389).
- llama.cpp: Intel XMX multi-column matmul (#29864), Vulkan MUL_MAT_ID FP32 ~10× speedup (#30105), OpenCL Adreno bin GEMM.

**Distributed serving**
- vLLM: Mooncake heterogeneous-TP for GDN/Mamba (#53078), custom all-reduce on MI200 (#63226).
- SGLang: Megakernel hybrid runtime views (#45406), Weight Cache Daemon (~306s → <1s cold load, #33522).

**Batching & scheduling**
- vLLM: context-length-aware speculative scheduling RFC (#48627), batch-invariant tracker (#27433).
- SGLang: priority preemption nondeterminism across TP ranks (#45812).

**Load/startup latency** *(emerging theme)*
- SGLang's Weight Cache Daemon is the standout — **~300× reduction in FP8 model load time** — with direct implications for autoscaling and scale-to-zero.
- Unsloth's diffusion planner work (#14777, #14832) targets per-prompt allocator syncs.

**Where each project competes:** vLLM and SGLang fight on **GPU-server kernel + distributed efficiency**; llama.cpp on **cross-vendor kernel portability**; Unsloth on **memory-constrained fine-tuning and diffusion**; Ollama/LiteLLM mostly consume upstream optimizations.

---

## 5. Layer Positioning

| Layer | Project(s) | Primary Role | Differentiator |
|---|---|---|---|
| **Serving engine (server, multi-GPU)** | **vLLM**, **SGLang** | High-throughput production inference | vLLM = hardware breadth + MRV2 extensibility; SGLang = day-0 model coverage + cache daemon |
| **Local runtime** | **llama.cpp**, **Ollama** | Single-machine / edge / consumer inference | llama.cpp = raw backend breadth (SYCL/OpenCL/Hexagon/Vulkan); Ollama = packaged UX, TTS, cloud |
| **LLM gateway / proxy** | **LiteLLM** | Multi-provider routing, budgets, caching, guardrails | Provider registry breadth; multi-tenant spend/auth — currently the weakest correctness surface |
| **Fine-tuning / orchestration** | **Unsloth** | LoRA/QLoRA training, Studio UI, pipelines | FSDP2/context-parallel for hybrid archs; expanding into node-based "Flows" orchestration (PR #14730) |

**Overlap & tension:**
- llama.cpp is the **shared substrate** under Ollama and Unsloth's GGUF paths — its regressions (TTFT #30793, gfx1201 #30884) propagate upward.
- LiteLLM sits in front of *all* of these as an abstraction layer; its compromise and budget bugs are cross-cutting risks regardless of which engine you run.
- Unsloth's "Flows" editor begins to blur the line between fine-tuning tooling and orchestration/gateway — a potential future competitor to LiteLLM-adjacent tooling.

---

## 6. Trend Signals

**1. Disaggregated serving correctness is the #1 unsolved problem.**
Both vLLM (#61160 cross-request KV contamination, #61229) and SGLang (#45866 FP4 scale drop, #45864 QSA resume contamination) have **open silent-failure bugs** in P/D. These are the worst class of bug — wrong output, no crash, no health-check signal. Multi-tenant and agentic deployments should treat P/D + prefix caching + retraction as a **hardening audit item**, not a default.

**2. The gateway is a security-critical, under-audited layer.**
LiteLLM's `1.107.0` supply-chain compromise plus the still-trusted eMudhra CA roots in `grpcio`/`boto3` show the proxy layer carries outsized blast radius. Combined with cross-end-user budget leaks (#29142, #34238), **pin-and-verify** is now table stakes for gateway deployments.

**3. Weight-loading latency is becoming a first-class metric.**
SGLang's Weight Cache Daemon (~300× faster cold load) reframes autoscaling economics. Expect this to pressure other engines to ship equivalent mechanisms for scale-to-zero, spot recovery, and frequent rollouts.

**4. Quantization is moving to the KV cache.**
FP8/FP4 KV caches (SGLang `fp4_mx_block16`, vLLM MiniMax-M3 FP8 indexer) are the new frontier — and the new bug surface. FP4 KV is explicitly **unsafe with P/D today**.

**5. Backend fragmentation is a growing correctness tax.**
SYCL (DeltaNet token soup), RDNA4 (FA corruption), AMD Vulkan (~30× caching collapse), XPU on Windows — the long tail of accelerators produces a steady stream of model-specific correctness bugs. Teams standardizing on non-NVIDIA hardware should budget for canary testing per model/backend pair.

**6. Multimodal and speech are consolidating into the main runtime.**
Ollama's TTS (`/v1/audio/speech`), llama.cpp's MiniCPM-OCR/Soprano, and vLLM's ViT CUDA graph tracker (#38175) all signal that audio/image I/O is no longer a separate service tier — it's part of the serving runtime.

**What agent/application developers should watch:**
- **Disable prefix caching on P/D stacks** until #61160 / #45866 resolve — or run a correctness canary on resumed/retracted requests.
- **Rotate credentials** if you pulled `litellm 1.107.0` or `latest`/`main-stable` Docker tags on 2026-10-21.
- **Track MRV2 speculator API (#63205)** if you maintain custom drafters — it's the new vLLM extension point.
- **Watch Weight Cache Daemon GA** for autoscaling design assumptions (cold-start no longer a hard constraint).
- **Treat `cache_salt` as non-authoritative for external KV stores** (SGLang #37160, LiteLLM team-cache change #47970) — multi-tenant isolation requires verifying at each layer.

---

*Report compiled from 2026-10-23 digests of vLLM, SGLang, llama.cpp, Ollama, LiteLLM, and Unsloth. All issue/PR numbers reference the respective project trackers.*

---

## Per-Project Reports

<details>
<summary><strong>vLLM</strong> — <a href="https://github.com/vllm-project/vllm">vllm-project/vllm</a></summary>

# vLLM Digest — 2026-10-23

## 1. Today's Highlights

No releases landed in the last 24 hours, but the issue/PR queues were highly active: **DeepSeek-V4-Flash SM8x (Ampere A100/A800) support** remains the single most-discussed item (#50576, 118 comments), and new **KV-connector correctness bugs** surfaced around prefix caching in disaggregated serving (#61160, #61229). On the PR side, work accelerated on **Model Runner V2 speculative-decoding extensibility** (#63205), **ROCm coverage for MI200/MI300 and MiniMax-M3** (#63226, #62270), and **KV-offload fixes for resumed streaming sessions** (#60810).

## 2. Releases & Breaking Changes

No new releases or breaking API/config changes in the last 24h. Relevant in-flight items to track:

- **MRV2 speculator config classes** (#63205) — declarative config replaces speculative-method name checks across config/scheduler/KV-cache/model code; custom speculator plugins are the headline API surface. [PR #63205](https://github.com/vllm-project/vllm/pull/63205)
- **`--enable-nan-fault-tolerance`** (#50283, MRV2) — new opt-in flag; aborts requests on NaN logits and withholds the affected chunk from prefix reuse/offload. [PR #50283](https://github.com/vllm-project/vllm/pull/50283)
- **`VLLM_FLASHINFER_MOE_USE_WORKSPACE`** (#62948) — new env-controlled workspace reuse for FlashInfer TRT-LLM MoE. [PR #62948](https://github.com/vllm-project/vllm/pull/62948)
- **Context-length-aware speculative scheduling RFC** (#48627) — proposes extending `num_speculative_tokens_per_batch_size` with an optional backward-compatible `(batch, ctx)` table. [Issue #48627](https://github.com/vllm-project/vllm/issues/48627)

## 3. New Model & Hardware Support

- **DeepSeek-V4-Flash / V4-Flash-0731 on SM8x (Ampere A100/A800, RTX 30xx)** — still unsupported; tracked in #50576, referencing #40851. High community demand (16 👍, 118 comments). [Issue #50576](https://github.com/vllm-project/vllm/issues/50576)
- **MiniMax-M3 FP8 indexer cache on gfx942 (MI300, CDNA3)** — PR #62270 unlocks `--attention-config '{"indexer_kv_dtype":"fp8"}'`; gfx950 keeps AITER routing, CUDA unchanged. [PR #62270](https://github.com/vllm-project/vllm/pull/62270)
- **Custom all-reduce on MI200 (gfx90a)** — PR #63226 enables it by default, moving TP all-reduce off RCCL on MI200. [PR #63226](https://github.com/vllm-project/vllm/pull/63226)
- **ViT Full CUDA Graph tracker** (#38175) — RFC for capturing the full ViT forward pass for multimodal models (Qwen3-VL, Kimi K2.5, GLM-V). [Issue #38175](https://github.com/vllm-project/vllm/issues/38175)
- **Mooncake heterogeneous-TP for hybrid GDN/Mamba** (#53078) — PQ2TP2 prefill → TP4 decode on Qwen3.5/Qwen3-Next hybrids. [PR #53078](https://github.com/vllm-project/vllm/pull/53078)
- **Cross-TP offload for GDN hybrids** (#62914) — filesystem cache reuse across TP sizes for attention+GDN hybrids. [PR #62914](https://github.com/vllm-project/vllm/pull/62914)

## 4. Performance & Optimization

- **GLM-5.3-Flash chunk KDA prefill** (#63072, ROCm) — passes precomputed `chunk_indices` from `GDNAttentionMetadata` to `chunk_kda`, eliminating a GPU→CPU sync (`prepare_chunk_indices` reading `cu_seqlens`) on every prefill call. [PR #63072](https://github.com/vllm-project/vllm/pull/63072)
- **Single-pass register-resident `rms_norm_per_block_quant` kernel** (#62514) — follows H100 SXM5 microbenchmarking work in #61073. [PR #62514](https://github.com/vllm-project/vllm/pull/62514)
- **QuantizedActivation contract extension** (#61073) — adds `get_input_quant_scale` and `maybe_fused_norm_quant`, resolving `TODO(mgoin)`; enables fused RMSNorm + per-block quant. [PR #61073](https://github.com/vllm-project/vllm/pull/61073)
- **EAGLE lookahead block hashes** (#61589) — recovers the last matched prefix-cache block for EAGLE/EAGLE3/MTP drafters. [PR #61589](https://github.com/vllm-project/vllm/pull/61589)
- **GLM-5.3 optimization tracker** (#57406) — follow-up on `glm_moe_dsa` backlog. [Issue #57406](https://github.com/vllm-project/vllm/issues/57406)
- **ROCm MI355X trackers**: Qwen3.8-2.4T-A95B (#57149) and Qwen3.8-Flash-Next gfx950 (#59575) both updated. [Issue #57149](https://github.com/vllm-project/vllm/issues/57149) · [Issue #59575](https://github.com/vllm-project/vllm/issues/59575)
- **BYOG reproducible evals/benchmarks RFC** (#61698) — proposes contributor-run reproducible perf/eval evidence for PR review. [Issue #61698](https://github.com/vllm-project/vllm/issues/61698)
- **Batch-invariant performance tracker** (#27433) — ongoing nondeterminism work. [Issue #27433](https://github.com/vllm-project/vllm/issues/27433)

## 5. Stability & Regressions

Ranked by severity:

1. **Cross-request KV contamination in PD disaggregation with prefix caching** (#61160, OPEN) — NIXL prefill/decode serving DeepSeek-V4.1-Flash returns *content from other requests*; scriptable reproducer on `/v1/chat/completions`; clean with `--no-enable-prefix-caching`. No fix PR listed. **Highest severity — silent data leakage.** [Issue #61160](https://github.com/vllm-project/vllm/issues/61160)
2. **NixlConnector KV blocks released on lease expiry while remote READ in flight** (#61229, OPEN) — decode silently consumes overwritten KV (vLLM 0.30.0, 1P1D, UCX tcp). No fix PR listed. [Issue #61229](https://github.com/vllm-project/vllm/issues/61229)
3. **DFlash2/DSpark + prefix caching corrupts output after cache hit** (#60174, CLOSED) — Qwen3.8-27B TP=1, vLLM 0.30/0.31; 0.29 passes. Related fix PR #62535 keeps prefill-bearing batches out of FULL cudagraphs (root cause of DSpark corruption #62417). [Issue #60174](https://github.com/vllm-project/vllm/issues/60174) · [PR #62535](https://github.com/vllm-project/vllm/pull/62535)
4. **Qwen3.8-Flash-Next GB10 (sm121): prompt content beyond ~2048 tokens invisible** (#62776, OPEN) — model answers as if prompt ended at `indexer_budget` (default 2048) on v0.32 nightly. No fix PR listed. [Issue #62776](https://github.com/vllm-project/vllm/issues/62776)
5. **CUDA graphs deadlock with fully-sharded fused-MoE LoRA across TP ranks** (#60845, CLOSED) — vLLM 0.28.0, Qwen3.5-compatible 35B-A3B, TP=2/4 + LoRA. [Issue #60845](https://github.com/vllm-project/vllm/issues/60845)
6. **V1 engine + MTP + GLM-5.1 hang under sustained traffic** (#40926, OPEN) — `sample_tokens` RPC timeout, `EngineDeadError`, TP=8. No fix PR listed. [Issue #40926](https://github.com/vllm-project/vllm/issues/40926)
7. **GLM5.2-nvfp4 emits `!!!!!!` during thinking** (#47367, OPEN) — vLLM 0.24.0. [Issue #47367](https://github.com/vllm-project/vllm/issues/47367)
8. **Qwen3.5 `response_format: json_schema` garbled spaces** (#38696, OPEN). [Issue #38696](https://github.com/vllm-project/vllm/issues/38696)
9. **PP2 tool calling garbled vs PP1** (#46262, OPEN) — GLM-5.2-FP8 DSA, chunked-prefill, ROCm. [Issue #46262](https://github.com/vllm-project/vllm/issues/46262)
10. **Elastic DP broken with AITER on** (#63053, OPEN) — test failure due to stateless group not registered with `torch.distributed`. [PR #63053](https://github.com/vllm-project/vllm/pull/63053)
11. **KV offload streaming-session block-table corruption** — fix PR #60810 (OffloadingConnector / SimpleCPUOffloadConnector). [PR #60810](https://github.com/vllm-project/vllm/pull/60810)
12. **PCP rank engine-ID sync on multi-node startup** — draft fix PR #62916 (PP2/PCP8/TP2, hardware validation pending). [PR #62916](https://github.com/vllm-project/vllm/pull/62916)

## 6. What This Means for Application Developers

- **If you run disaggregated (P/D) serving with prefix caching enabled, audit for cross-request contamination now.** #61160 describes silent content bleed between requests — the worst possible failure mode for agents handling multi-tenant context. Immediate mitigation: `--no-enable-prefix-caching`, or drop to a version predating the regression, until a fix lands. #61229 is a related window where decode may read overwritten KV.
- **Blackwell/large-context users on Qwen3.8-Flash-Next:** prompts beyond ~2048 tokens may be treated as truncated on GB10 (v0.32 nightly). Do not assume long-document behavior until #62776 is resolved; test with a canary.
- **Speculative decoding is in active flux.** DSpark/DFlash now have known prefix-cache corruption and cudagraph-interaction bugs (0.30/0.31); if you depend on MTP + prefix caching on hybrid GDN models, pin to 0.29 or verify against the fix PRs.
- **Ampere users waiting on DeepSeek-V4-Flash:** no SM8x support yet (#50576). Plan capacity on Hopper/Blackwell or budget for a port.
- **ROCm shops get incremental wins** — FP8 indexer cache on MI300 (#62270), custom all-reduce on MI200 (#63226), and GLM-5.3-Flash prefill sync removal (#63072) — if you can track nightly.
- **Watch the MRV2 speculator API** (#63205) if you maintain custom drafters — the config-class refactor is the new extension point.

</details>

<details>
<summary><strong>SGLang</strong> — <a href="https://github.com/sgl-project/sglang">sgl-project/sglang</a></summary>

# SGLang Digest — 2026-10-23

## 1. Today's Highlights

No releases landed in the last 24h, but the issue queue is active with **high-severity correctness bugs in P/D disaggregation** — FP4 KV block scales are silently dropped during transfer, and retracted/resumed requests resume with stale indexer state from other requests. Meanwhile, DeepSeek-V4.1 optimization work continues at pace (shared sparse-prefill dequant reuse, token-interleaved KV cache support), and CI infrastructure remains the top friction point with the long-running flaky-test tracker still collecting 122 comments.

## 2. Releases & Breaking Changes

None in the last 24h.

## 3. New Model & Hardware Support

- **DeepSeek-V4.1 token-interleaved KV cache** — new `sgl-flash-mla` wheel carries FlashMLA 2026.09.30 V4.1 kernels reading token-interleaved KV, faster at decode ([PR #45893](https://github.com/sgl-project/sglang/pull/45893))
- **Muse Spark** — Day-0 support PR split into merge-ordered components, depends on DeepGEMM changes ([Issue #44678](https://github.com/sgl-project/sglang/issues/44678))
- **Quark MXFP4 MoE on AMD RDNA (gfx1151)** — enables `amd/Qwen3.5-35B-A3B-MXFP4` on consumer RDNA via `triton_kernels` as W4A16, since RDNA lacks FP4 hardware/AITER kernels ([PR #41389](https://github.com/sgl-project/sglang/pull/41389))
- **Megakernel hybrid runtime views (NVIDIA)** — new typed API exposing SGLang-owned cache/step state for MLA/KDA mega-kernel plugins post-pool-creation, pre-CUDA-graph-capture ([PR #45406](https://github.com/sgl-project/sglang/pull/45406))

## 4. Performance & Optimization

- **DeepSeek-V4.1 sparse prefill dequant reuse** — ratio-1/2 layers sharing a sparse KV source now dequant once per forward instead of once per layer, eliminating redundant buffer writes ([PR #45909](https://github.com/sgl-project/sglang/pull/45909))
- **Block-FP8 SwiGLU fusion on decode** — fuses SwiGLU + activation quantization for dense block-FP8 MLPs, removing one launch and an intermediate BF16 write/read per MLP ([PR #45219](https://github.com/sgl-project/sglang/pull/45219), closed/superseded)
- **Weight Cache Daemon (Phase 1 landed)** — per-rank daemon serving post-quantized weights over CUDA IPC cuts Qwen3-235B FP8 load from **~306–327s to <1s** ([Issue #33522](https://github.com/sgl-project/sglang/issues/33522))
- **DeepSeek-V4.1 SM90 breakable-prefill CUDA graph fix** — corrects late-layer tail handling in H200 decoder SWA bounded replay ([PR #45407](https://github.com/sgl-project/sglang/pull/45407))
- **LoRA/MoE route prep consolidation** — several superseded PRs converged into unified route-preparation paths for Marlin LoRA and CUTLASS W4A8 ([PR #45681](https://github.com/sgl-project/sglang/pull/45681), [#45917](https://github.com/sgl-project/sglang/pull/45917))

## 5. Stability & Regressions

Ranked by severity:

1. **FP4 KV block scales dropped in P/D transfer** — `--kv-cache-dtype fp4_mx_block16` sends packed KV but not scales; decode dequantizes with stale/zero scales producing garbage. Also affects `cpu_tensor` retraction ([Issue #45866](https://github.com/sgl-project/sglang/issues/45866), no fix PR yet)
2. **P/D decode resumes with another request's QSA indexer state** — on Qwen3.8-Flash-Next, retracted-then-resumed requests pick up QSA state from whatever request occupied its slots ([Issue #45864](https://github.com/sgl-project/sglang/issues/45864), no fix PR yet)
3. **LMCache ignores `cache_salt`** — external storage keys are token-only, breaking tenant isolation despite radix-tree honoring the salt ([Issue #37160](https://github.com/sgl-project/sglang/issues/37160))
4. **Kimi-K3 DCP a2a garbled decode on 2-node GB300** — degenerate output under CUDA graphs with NCCL graph buffer registration on; `NCCL_GRAPH_REGISTER=0` restores correctness (12/12→0 failures) ([Issue #45367](https://github.com/sgl-project/sglang/issues/45367))
5. **Kimi-K3 SM90 silently computes wrong activation** — `flashinfer_mxfp4` runs GPT-OSS SwiGLU instead of SiTU, depending on still-open flashinfer#4209 ([Issue #45755](https://github.com/sgl-project/sglang/issues/45755))
6. **GLM-5.3-Flash SM120 fa4 crash** — hybrid-extend reshape failure during CUDA-graph capture; triton is the only working backend ([Issue #42012](https://github.com/sgl-project/sglang/issues/42012))
7. **GLM-5.3-Flash H20 EAGLE illegal memory access** — in `run_eagle_verify` → `build_grammar_vocab_mask` ([Issue #45159](https://github.com/sgl-project/sglang/issues/45159))
8. **Priority preemption nondeterminism across TP ranks** — scheduler requeues victims in set order, can diverge across ranks ([Issue #45812](https://github.com/sgl-project/sglang/issues/45812))
9. **HiCache host-tier exhaustion on hybrid GDN** — host mamba pool drains while KV stays on host once evicted working set exceeds ~3 long prefixes ([Issue #45400](https://github.com/sgl-project/sglang/issues/45400))
10. **FP8 fused MoE `swap_ab` fails on Triton 3.9** — rank-0 scale indexing compile failure ([Issue #45887](https://github.com/sgl-project/sglang/issues/45887))
11. **CI/AMD regressions** — NIXL UCX backend unreachable, Mooncake v0.3.14 PP test failures ([#45850](https://github.com/sgl-project/sglang/issues/45850), [#45849](https://github.com/sgl-project/sglang/issues/45849)); relevant fix PR submitted ([#45691](https://github.com/sgl-project/sglang/pull/45691))

## 6. What This Means for Application Developers

- **Avoid FP4 KV cache with P/D disaggregation right now.** Issue #45866 produces silently wrong output — not a crash — so it will not show up in health checks. If you must use it, validate output correctness on resumed/retracted requests.
- **Retraction is unsafe on hybrid models with QSA indexers.** If you rely on scheduler retraction for overload handling with Qwen3.8-Flash-Next, expect cross-request contamination on resume (Issue #45864).
- **Multi-tenant deployments using LMCache are exposed.** `cache_salt` isolation does not extend to external storage (Issue #37160) — treat it as a cross-tenant data-leak risk until fixed.
- **Kimi-K3 on GB300 + DCP a2a needs a workaround.** Set `NCCL_GRAPH_REGISTER=0` to restore correctness at a throughput cost; track #45367 for a proper fix.
- **Model load times are dropping dramatically.** The Weight Cache Daemon changes the economics of cold-start, autoscaling, and spot-instance recovery for large FP8 models — useful if you run frequent rollouts or scale-to-zero.
- **CI flakiness is not slowing releases, but it is masking real issues.** Several of the bugs above were caught by the new failure trackers (#45846, #45847) — worth watching that channel if you deploy on `main`.

</details>

<details>
<summary><strong>llama.cpp</strong> — <a href="https://github.com/ggml-org/llama.cpp">ggml-org/llama.cpp</a></summary>

# llama.cpp Digest — 2026-10-23

## 1. Today's Highlights

A busy 24-hour window dominated by backend kernel work (Intel XMX/SYCL, OpenCL/Adreno, Hexagon) and server-side API polish. The headline landings are multi-column Intel XMX matmul refactoring and a batch of OpenCL bin kernels for Adreno X1, alongside continued work on MoE expert caching (`llama_moe_cache`) and CUDA graph shape keying. On the stability side, a confirmed TTFT regression from #30449 and a CUDA flash-attention corruption bug on gfx1201 remain unresolved.

## 2. Releases & Breaking Changes

None of the landed releases introduce API or config-breaking changes. Notable behavioral fixes in the b118xx series:

- **b11829** — `server`: rerank placeholder now substituted from the original template only (non-destructive fix for #30816). [PR #30864](https://github.com/ggml-org/llama.cpp/pull/30864)
- **b11828** — `server`: realtime API sends `complete` after committed audio drains, changing completion timing semantics for streaming audio sessions. [PR #30994](https://github.com/ggml-org/llama.cpp/pull/30994)
- **b11818** — `server`: RERANK endpoint now accepts typed content input; multimodal rerank input is rejected when the model lacks a rerank chat template. [PR #29625](https://github.com/ggml-org/llama.cpp/pull/29625)
- **b11819** — `nemotron`: GGUF metadata now writes Metaspace `prepend_scheme`; vocab parsing enum renamed (downstream tokenizer tooling may need updates). [PR #23343](https://github.com/ggml-org/llama.cpp/pull/23343)

## 3. New Model & Hardware Support

- **MiniCPM-OCR 1.0** added to `mtmd`. ([b11826 / PR #30979](https://github.com/ggml-org/llama.cpp/pull/30979))
- **Nemotron** — non-standard GQA, BPE tokenizer, and domyn-small pre-type support. ([b11819 / PR #23343](https://github.com/ggml-org/llama.cpp/pull/23343))
- **Flint (`FlintForCausalLM`)** support with HF→GGUF conversion for routed/shared experts. ([PR #30928](https://github.com/ggml-org/llama.cpp/pull/30928))
- **Soprano audio generation** (mtmd) under review. ([PR #28607](https://github.com/ggml-org/llama.cpp/pull/28607))
- **OpenCL**: depthwise conv2d for Adreno ([b11827 / PR #30900](https://github.com/ggml-org/llama.cpp/pull/30900)); new Q8_0/Q5_K bin GEMM kernels for Adreno X1 ([PR #31003](https://github.com/ggml-org/llama.cpp/pull/31003), [PR #31002](https://github.com/ggml-org/llama.cpp/pull/31002)); initial q2_k support ([PR #30999](https://github.com/ggml-org/llama.cpp/pull/30999)).
- **Hexagon**: CEIL op added. ([PR #31006](https://github.com/ggml-org/llama.cpp/pull/31006))
- **SYCL**: `set_tensor_2d` for faster tensor-split loading. ([PR #30358](https://github.com/ggml-org/llama.cpp/pull/30358))

## 4. Performance & Optimization

- **Intel XMX multi-column matmul refactor** (2–80 activation columns) for reordered K-quant/Q8_0 on int8 DPAS/ESIMD. ([b11821 / PR #29864](https://github.com/ggml-org/llama.cpp/pull/29864))
- **GLM5 input optimization** — avoids `sel_mask_2d` and `new_pool_flat` inputs. ([b11823 / PR #30932](https://github.com/ggml-org/llama.cpp/pull/30932))
- **Vulkan MUL_MAT_ID FP32 precision fix** reported ~10x speedup on Mistral Small 4 (single Radeon AI Pro 9700). ([PR #30105](https://github.com/ggml-org/llama.cpp/pull/30105))
- **CUDA graph shape keying** to prevent graph thrashing, with bounded frequency-based eviction. ([PR #31004](https://github.com/ggml-org/llama.cpp/pull/31004))
- **MoE cache work** continues: `llama_moe_cache` can now run missed experts on CPU with `--moe-cache-cpu-share` tuning. ([PR #30966](https://github.com/ggml-org/llama.cpp/pull/30966))
- **Server checkpoint reuse** avoids redundant state copies on cache hits. ([PR #30683](https://github.com/ggml-org/llama.cpp/pull/30683))

## 5. Stability & Regressions

Ranked by severity:

1. **TTFT regression (confirmed)** — first-inference time 10s → 60s+ with CPU-resident MoE weights after #30449 ("Limit max CUDA pinned host buffer size to 4 GB"). Reverting the PR eliminates it. **No fix PR yet.** ([Issue #30793](https://github.com/ggml-org/llama.cpp/issues/30793))
2. **CUDA/HIP flash-attention corruption on gfx1201 (RDNA4)** — garbage logits at long context, head_dim 256, immediate EOS. Affects Qwen3.8-27B. **No fix PR yet.** ([Issue #30884](https://github.com/ggml-org/llama.cpp/issues/30884))
3. **SYCL F16 NaN on Qwen3.8-27B Q4_K_M** since #29107 (IQ3 code reorder); disabling fused GEMM works around it. ([Issue #30892](https://github.com/ggml-org/llama.cpp/issues/30892))
4. **SYCL DeltaNet token soup on long prompts** (Qwen3.6/3.8, Nemotron) — multiple reports on Arc Pro B70. ([Issue #29183](https://github.com/ggml-org/llama.cpp/issues/29183), [Issue #29167](https://github.com/ggml-org/llama.cpp/issues/29167))
5. **Qwen3.8-27B hybrid Gated DeltaNet decode collapse** — ~25x throughput drop beyond ~80K context (RTX 4080 SUPER, CUDA 13.1). ([Issue #27623](https://github.com/ggml-org/llama.cpp/issues/27623))
6. **Vulkan OOB token id == n_vocab** with DFlash/MTP speculative decode on Strix Point. ([Issue #28158](https://github.com/ggml-org/llama.cpp/issues/28158))
7. **Nemotron 3/3.5 GGUFs mis-tagged as pixtral** → wrong pre-tokenizer. Marked closed. ([Issue #30894](https://github.com/ggml-org/llama.cpp/issues/30894))
8. **Detokenization whitespace regression** for Gemma 4-style vocabs (`x != y` → `x!= y`). Closed. ([Issue #30905](https://github.com/ggml-org/llama.cpp/issues/30905))

## 6. What This Means for Application Developers

- **Rerank/embedding pipelines**: update to b11829+ to pick up the placeholder fix; if you rely on the RERANK endpoint, note typed content input is now supported and multimodal input is validated against the model's chat template.
- **Realtime audio agents**: the `complete` signal now fires only after committed audio drains — audit any client logic that previously assumed early completion.
- **MoE deployments**: `llama_moe_cache` with CPU fallback (`--moe-cache-cpu-share`) is maturing; if you run large MoE models with CPU-resident experts, pin below #30449 or budget for elevated first-token latency until the regression is fixed.
- **RDNA4/gfx1201 users**: avoid flash attention at long context with head_dim 256 models until #30884 is resolved; dense models to 131K+ remain unaffected.
- **Intel Arc/SYCL users**: expect known correctness issues on Qwen3.6/3.8 DeltaNet paths at long prompts; dense model workloads are stable.

---
*Generated from ggml-org/llama.cpp activity covering 2026-10-22 to 2026-10-23.*

</details>

<details>
<summary><strong>Ollama</strong> — <a href="https://github.com/ollama/ollama">ollama/ollama</a></summary>

# Ollama Digest — 2026-10-23

## 1. Today's Highlights

Ollama's headline feature this cycle is **native speech generation (TTS)** via Phonon on Apple Silicon, shipping in the `v0.40.9-rc3` release candidate with a new OpenAI-compatible `/v1/audio/speech` endpoint. On the model-serving side, work is progressing on an MLX runner for **Nemotron 3.5 Bolt 74B-A9B** with speculative decoding. Meanwhile, the issue tracker shows mounting concern over **cloud reliability** — a top-voted thread reports a 95% failure rate on Ollama Cloud Pro — alongside a fresh, reproducible **~30× throughput collapse** on AMD Vulkan when prompt caching is enabled.

## 2. Releases & Breaking Changes

- **v0.40.9-rc3** — Adds speech generation with Phonon on Apple Silicon. `ollama run` now plays text or chat replies aloud as audio is generated, and apps can stream audio via the OpenAI-compatible `/v1/audio/speech` endpoint. Requires the GA Gradium checkpoint format; the old prerelease checkpoint path is dropped ([PR #19227](https://github.com/ollama/ollama/pull/19227)).
- **`typical_p` parameter removal** — No longer supported; requests specifying it now return HTTP 400, affecting `ollama-python` clients ([Issue #18480](https://github.com/ollama/ollama/issues/18480), closed).
- **Tooling:** Developers relying on `typical_p` should remove it from options; speech integrators should migrate to the GA Phonon checkpoint and `/v1/audio/speech`.

## 3. New Model & Hardware Support

- **Nemotron 3.5 Bolt 74B-A9B (MLX):** In-progress support for per-layer expert configs, LiLiCorr speculative decoding via the DFlash runner, and prequantized affine 2-/3-bit imports with mixed-precision expert stacking ([PR #19229](https://github.com/ollama/ollama/pull/19229)).
- **Snapdragon X Elite NPU/Adreno GPU:** 68 👍 feature request for Windows-on-ARM acceleration remains open, still unaddressed ([Issue #5360](https://github.com/ollama/ollama/issues/5360)).
- **Apple Foundation Models:** Request to expose the on-device Swift `FoundationModels` model through Ollama's CLI/API ([Issue #19116](https://github.com/ollama/ollama/issues/19116)).
- **Nvidia Vulkan/MLX in Docker:** PR adds missing libraries/configs so the MLX runner and Nvidia Vulkan backend work inside containers ([PR #18592](https://github.com/ollama/ollama/pull/18592)).
- **Apple Silicon general:** Ongoing MLX maturity, but see regressions below.

## 4. Performance & Optimization

- **KV cache connector framework (proposal):** A pluggable external KV cache backend framework intended to eventually enable LMCache-style offloading; initial scope is lifecycle scaffolding only ([Issue #17696](https://github.com/ollama/ollama/issues/17696)).
- **`num_predict == -2` dynamic token limit:** Allows generation to fill the context buffer rather than a static cap ([PR #9547](https://github.com/ollama/ollama/pull/9547)).
- **`dspark` acceleration request:** Users request built-in support for speculative-decoding-style acceleration ([Issue #17016](https://github.com/ollama/ollama/issues/17016)).
- **⚠️ Regression:** AMD RADV (RX 6600 XT, Mesa) shows a **~29.7× generation throughput collapse on the second identical request** with the bundled llama.cpp host-memory prompt cache enabled — see Stability below ([Issue #19201](https://github.com/ollama/ollama/issues/19201)).

## 5. Stability & Regressions

**Critical / High:**

1. **Cloud Pro 95% failure rate** — `glm-5.1`, `kimi-k2.5`, `qwen3.5`, `deepseek-v3.2` all failing across the board; 55 comments, 22 👍 ([Issue #15453](https://github.com/ollama/ollama/issues/15453)). No fix PR visible.
2. **AMD Vulkan ~30× throughput collapse** — Reproducible, breaks prompt caching on RADV ([Issue #19201](https://github.com/ollama/ollama/issues/19201)). No fix PR yet.
3. **MLX `Maximum threads` panic** — 0.40.0 crashes after ~60s on macOS; works on 0.35.1, confirming a regression ([Issue #18846](https://github.com/ollama/ollama/issues/18846), closed).
4. **`glm-5.3-flash:cloud` generation degeneration** — 5–8% of requests produce repetitive garbage since 10-12 ([Issue #18980](https://github.com/ollama/ollama/issues/18980)).
5. **Windows connection resets with large prompts** — `/api/chat` resets after ~15s with large contexts on RTX 3090 ([Issue #19139](https://github.com/ollama/ollama/issues/19139)); also occurs bypassing the API and hitting `llama-server` directly ([Issue #19113](https://github.com/ollama/ollama/issues/19113)).

**Medium:**

6. **MLX nvfp4 prefill stall** — Single-slot sustained load hangs requests at `processed=total-1` for minutes; only SIGTERM recovers ([Issue #18505](https://github.com/ollama/ollama/issues/18505), closed).
7. **Duplicate model / bogus `llamacpp:<sha>` tag** after local compat GGUF migration ([Issue #18830](https://github.com/ollama/ollama/issues/18830), closed).
8. **`OLLAMA_CONTEXT_LENGTH` not reflected in `/api/show` and `/api/tags`** — clients querying context length get the native window, not the effective one ([Issue #18995](https://github.com/ollama/ollama/issues/18995)).
9. **Silently dropped tool calls** — Calls referencing functions not in the request's `tools` are dropped with empty responses and `eval_count > 0` ([Issue #19187](https://github.com/ollama/ollama/issues/19187)).
10. **`/v1/responses` stream closes without terminal event** during reasoning ([Issue #17118](https://github.com/ollama/ollama/issues/17118), closed).

**Security:**

11. **Multiple Go CVEs in shipped binaries** — 1 critical and 11 high Go stdlib CVEs; fix is to upgrade the toolchain to Go 1.26.9+ ([Issue #16033](https://github.com/ollama/ollama/issues/16033), [Issue #19162](https://github.com/ollama/ollama/issues/19162)).

**Fix PRs landed or in flight:**

- [PR #19225](https://github.com/ollama/ollama/pull/19225) — Emit `response.failed` terminal event on in-band generation errors in `/v1/responses` streams.
- [PR #19226](https://github.com/ollama/ollama/pull/19226) — Recover complete Gemma 4 tool calls with trailing noise.
- [PR #19228](https://github.com/ollama/ollama/pull/19228) — Preserve literal `</function>` closing tags in qwen3coder tool parameters.
- [PR #18438](https://github.com/ollama/ollama/pull/18438) — Fix intermittent "model not found" errors from `getExistingName` not tracking canonicalized parts.
- [PR #15050](https://github.com/ollama/ollama/pull/15050) — Force flash attention off for Grok to avoid crash with KV cache quantization.
- [PR #19058](https://github.com/ollama/ollama/pull/19058) — Preserve last *user* message during context truncation (was incorrectly pruning to assistant/tool-call turns only).
- [PR #19199](https://github.com/ollama/ollama/pull/19199) — Preserve `developer` role instructions for Qwen3-Coder, Cogito, Olmo.

## 6. What This Means for Application Developers

- **Voice is now a first-class output modality on Apple Silicon.** If you're building chat UIs or voice agents on Macs, `/v1/audio/speech` lets you stream audio through the same OpenAI-compatible shape you already target — no separate TTS service required.
- **Avoid prompt caching on AMD RADV until #19201 is resolved.** A 30× throughput regression on the second identical request is severe enough to disable caching on that backend or pin to a prior version.
- **Handle in-band generation failures explicitly.** Today, `/v1/responses` streams can EOF without a terminal event; PR #19225 addresses this, but defensive clients should treat unexpected EOF as a failure today.
- **Tool-calling robustness is improving but has sharp edges.** Empty responses with nonzero `eval_count` may indicate a dropped tool call (#19187). Validate responses and fall back to non-tool paths when the model references an unknown function.
- **Do not rely on `typical_p`.** It now returns 400. Audit any sampling config generated from older defaults.
- **Cloud is currently unreliable.** If your app depends on Ollama Cloud Pro for production traffic, implement retry/failover to a local runner or an alternate provider until #15453 shows healthy remediation.
- **Context-length introspection is inconsistent** (#18995) — if you allocate buffers or chunk documents based on `/api/tags` or `/api/show`, use the env-configured value explicitly rather than the reported model window.
- **Security:** If you ship Ollama binaries in an audited environment, track the Go toolchain CVE issue (#19162); builds pinned to older Go will continue to carry critical stdlib findings until upgraded.

</details>

<details>
<summary><strong>LiteLLM</strong> — <a href="https://github.com/BerriAI/litellm">BerriAI/litellm</a></summary>

# LiteLLM Digest — 2026-10-23

## 1. Today's Highlights

The dominant story is the **supply-chain compromise of `litellm 1.107.0`**, published from a lookalike repo (`Berri-AI/litellm`) and shipping a `cook.pth` credential stealer plus a `sitecustomize` RCE loader. PyPI and the Docker `latest`/`main-stable` tags have been yanked, and follow-up work is now focused on purging compromised CA roots (eMudhra) from transitive dependency trust stores. Separately, the project is tightening multi-tenant correctness in the proxy — team-scoped response caching, per-request end-user budget isolation, and spend-accounting durability under callback timeouts all saw activity.

## 2. Releases & Breaking Changes

No new releases in the last 24h.

Migration-relevant items in flight:

- **Cache isolation change (breaking for cross-team cache sharing):** [PR #47970](https://github.com/BerriAI/litellm/pull/47970) isolates proxy response caches by team by default, with per-key caches for teamless callers. Anyone relying on a shared global response cache will see hit-rate changes.
- **Backport request for CA fix:** [Issue #47904](https://github.com/BerriAI/litellm/issues/47904) asks that the eMudhra root CA fix ([#47670](https://github.com/BerriAI/litellm/pull/47670)) be backported to `stable/1.106.x` as v1.106.3, since all published 1.106.x images still trust the compromised root.

## 3. New Model & Hardware Support

- **InferAll provider:** [PR #47890](https://github.com/BerriAI/litellm/pull/47890) — OpenAI-compatible provider registered in the JSON provider registry; `inferall/<model>` works in SDK and proxy with no custom `api_base`.
- **DotHoosh provider:** [PR #47513](https://github.com/BerriAI/litellm/pull/47513) — Iranian Toman-billed gateway added as JSON-configured OpenAI-compatible provider, with 11 model price entries.
- **JevRank rerank models:** [PR #47972](https://github.com/BerriAI/litellm/pull/47972) — Perplexity and Jev decision models usable through the existing rerank interface, with model-catalog-driven scoring selection.
- **Exa search API refresh:** [PR #46525](https://github.com/BerriAI/litellm/pull/46525) — updated search parameters, content options, and billing against the current Exa API.
- **Anthropic `detail: "original"`:** [Issue #47327](https://github.com/BerriAI/litellm/issues/47327) reports `token_counter` rejects OpenAI's new `"original"` image detail value, causing pre-call context-window checks to be skipped with an ERROR log.

## 4. Performance & Optimization

- **SlackAlerting task leak:** [PR #41572](https://github.com/BerriAI/litellm/pull/41572) guards `periodic_flush` start on repeated `update_values` calls; previously each config reload leaked a periodic task, growing worker memory until restart or OOM-kill.
- **Import-time HTTP GET:** [Issue #22159](https://github.com/BerriAI/litellm/issues/22159) (stale, still open) — LiteLLM performs an HTTP request on module import by default, adding startup latency. No fix PR referenced.
- **Responses SSE framing:** [PR #47980](https://github.com/BerriAI/litellm/pull/47980) fixes named-event framing and terminal events for Responses streams, including guardrail blocks — relevant to streaming clients that key off event names.

## 5. Stability & Regressions

Ranked by severity:

1. **CRITICAL — Malicious release:** [Issue #47826](https://github.com/BerriAI/litellm/issues/47826) — `1.107.0` on PyPI and the `latest`/`main-stable` Docker tags shipped a credential stealer (`cook.pth`) and RCE loader (`sitecustomize`) from lookalike repo `Berri-AI/litellm`. PyPI and Docker tags have been removed. **If you pulled 1.107.0, treat credentials on that host as compromised.**
2. **HIGH — Compromised CA roots persist in dependencies:** [PR #47969](https://github.com/BerriAI/litellm/pull/47969) bumps `grpcio` to 1.84.1 and `boto3` to 1.43.117, whose bundled CA lists reject eMudhra chains. Until merged (and backported per [#47904](https://github.com/BerriAI/litellm/issues/47904)), gRPC and botocore paths still trust the compromised roots.
3. **HIGH — Cross-end-user budget leak:** [Issue #29142](https://github.com/BerriAI/litellm/issues/29142) — cached `UserAPIKeyAuth` retains `end_user_max_budget` across requests sharing one virtual key, so one end-user's budget can apply to another's requests. Canonical OpenWebUI pattern is affected.
4. **HIGH — Budget bypass via stale per-pod spend:** [Issue #34238](https://github.com/BerriAI/litellm/issues/34238) — when the cross-pod Redis counter `spend:end_user:{user_id}` clean-misses (60s default TTL), budget enforcement falls back to stale per-pod spend, allowing overspend.
5. **MEDIUM — Deleted team keys stay auth-valid:** [Issue #34217](https://github.com/BerriAI/litellm/issues/34217) — `POST /team/delete` removes keys from the DB but does not evict them from the auth cache; `/key/delete` does.
6. **MEDIUM — Spend records lost on callback timeout:** [PR #47386](https://github.com/BerriAI/litellm/pull/47386) — slow logging hooks were cancelling spend accounting and budget updates for successful requests. Fix in review.
7. **MEDIUM — Custom pricing ignored on rerank/embedding:** [Issue #47798](https://github.com/BerriAI/litellm/issues/47798) — unregistered models bill as `$0`/`None` despite `custom_pricing`.
8. **MEDIUM — `reasoning_effort: "none"` no-op on default-on Claude models:** [Issue #47924](https://github.com/BerriAI/litellm/issues/47924) — LiteLLM strips the thinking config rather than disabling thinking, leaving upstream defaults active.
9. **LOW — Redis env vars ignored with `cache_params`:** [Issue #26233](https://github.com/BerriAI/litellm/issues/26233) — any key in `cache_params` causes Redis env vars to be ignored, breaking multi-pod spend tracking.
10. **LOW — Bedrock Converse `parallel_tool_calls` failure on Claude 4.5+:** [Issue #22637](https://github.com/BerriAI/litellm/issues/22637) — request fails with `BedrockException`.

Also in flight: [PR #47971](https://github.com/BerriAI/litellm/pull/47971) converts unsupported transcription-provider errors from 500 to 400, and [PR #47976](https://github.com/BerriAI/litellm/pull/47976) formats pre-handler errors in Anthropic's error schema for `/v1/messages` clients.

## 6. What This Means for Application Developers

- **Audit your deployments now.** If you ran `litellm==1.107.0` or pulled the `latest`/`main-stable` Docker tags on 2026-10-21, rotate every credential reachable from that host (cloud keys, DB passwords, provider API keys) and rebuild from a pinned, verified version.
- **Pin and verify.** Given both the PyPI compromise and the still-trusted eMudhra roots in `grpcio`/`boto3`, pin exact versions and track the CA bumps in [#47969](https://github.com/BerriAI/litellm/pull/47969) / [#47904](https://github.com/BerriAI/litellm/issues/47904) before trusting TLS verification on those code paths.
- **Multi-tenant deployments need patching.** The end-user budget leak ([#29142](https://github.com/BerriAI/litellm/issues/29142)) and per-pod budget bypass ([#34238](https://github.com/BerriAI/litellm/issues/34238)) both affect the common "one virtual key, many `user` fields" pattern (OpenWebUI-style). If you bill or cap per end-user, verify enforcement after these land.
- **Team cache isolation is coming.** [PR #47970](https://github.com/BerriAI/litellm/pull/47970) will change cache hit rates for teams sharing prompts; if you rely on cross-team cache warmth, plan for lower hit rates after upgrading.
- **Agent telemetry semantics are unsettled.** [Issue #39057](https://github.com/BerriAI/litellm/issues/39057) surfaces a real ambiguity: on cache hits, `spend` is zeroed but token columns replay original usage. If you aggregate tokens for billing, decide which basis you want before the maintainers do.
- **Anthropic-native clients get better errors.** [#47976](https://github.com/BerriAI/litellm/pull/47976) and [#47980](https://github.com/BerriAI/litellm/pull/47980) improve error shape and SSE framing for `/v1/messages` — relevant if you run Claude Code/Desktop against a LiteLLM proxy.

</details>

<details>
<summary><strong>Unsloth</strong> — <a href="https://github.com/unslothai/unsloth">unslothai/unsloth</a></summary>

# Unsloth Digest — 2026-10-23

## 1. Today's Highlights

No releases landed in the last 24h, but PR throughput is high (328 PRs updated), dominated by `danielhanchen`'s Studio hardening pass: SSRF-guarded dataset fetches, credential-scoping fixes, and diffusion memory/planner tuning. The most consequential user-facing item is PR #14730, a new node-based "Flows" editor for AI pipelines and games, signaling Studio's expansion from a chat/training UI into an orchestration surface. Meanwhile, a cluster of crashes and model-mismatch bugs (DeepSeek-V4.1-Flash, Lemonade/AMD, MoE core dumps) points to growing pains in GGUF and multi-model serving paths.

## 2. Releases & Breaking Changes

None. No new releases or documented API/config breaking changes in this window.

Note for awareness (in-flight, not landed): PR #14824 introduces an `api_keys.purpose` column that gates saved Connection key decryption on a stamped key purpose rather than key name. Existing API keys get `NULL` purpose. This closes a privilege gap introduced in #13481 where a key named "Coding agents (unsloth start)" could cause Studio to decrypt the owner's saved Connection key. Self-hosted/Studio API users should track this — https://github.com/unslothai/unsloth/pull/14824

## 3. New Model & Hardware Support

- **Qwen3.5 GatedDeltaNet — FSDP2 + Ulysses context parallel** (PR #12052, addressing issue #12051, #315): adds context parallel and FSDP2 sharding for the hybrid GatedDeltaNet architecture. Because conv and gated delta rule are recurrent in time, sequence shards can't remain sequence shards inside those 30/40 layers; the PR handles the hybrid split. Still open — https://github.com/unslothai/unsloth/pull/12052
- **DeepSeek-V4.1-Flash-1017 load failure** (issue #14695): llama.cpp build does not recognize the `deepseek41-dspark` GGUF architecture. Not yet supported; may require a llama.cpp bump — https://github.com/unslothai/unsloth/issues/14695
- **ROCm/NVIDIA device visibility fix** (PR #14820): the `no_context=True` VRAM reader returns no devices on ROCm and drops the torch fallback; this restores Auto residency and server pressure checks on ROCm and NVIDIA without `nvidia-smi` — https://github.com/unslothai/unsloth/pull/14820
- **Intel XPU on Windows** (issue #14807): XPU LoRA inference mixes GNU and MSVC linker arguments — currently broken — https://github.com/unslothai/unsloth/issues/14807
- Hardware context in active reports: 2× RTX PRO 6000 Blackwell 96GB, RTX 5060 Ti 16GB, AMD Ryzen AI MAX+ PRO 395 / Radeon 8060S, AMD Ryzen AI 7 350.

## 4. Performance & Optimization

- **Diffusion memory/planner work (Studio)** — several tightly-related PRs:
  - PR #14777: stop flushing the CUDA allocator on *every* prompt encode under block offload; the pre-hook called `torch.cuda.empty_cache()` after each release, incurring a device sync per prompt. — https://github.com/unslothai/unsloth/pull/14777
  - PR #14832: onload torchao int8/fp8 wrapper weights (`Int8Tensor`/`Float8Tensor`) through pinned chunks, extending chunked onload from #14767. — https://github.com/unslothai/unsloth/pull/14832
  - PR #14833: budget HunyuanImage-2.1's automatic int8 text encoder at its hosted file (previously took the 0.56 default scale and understated memory by loading Qwen-Image's file). — https://github.com/unslothai/unsloth/pull/14833
  - PR #14770: hold `cudnn.benchmark` off for FLUX.2 klein / FLUX.1 Kontext / Qwen-Image-Edit so a seed decodes deterministically across processes. — https://github.com/unslothai/unsloth/pull/14770
- **FSDP2 QLoRA merged saves** (PR #14823): stage the packed 4-bit base on CPU and merge one layer at a time, reducing peak host/device memory during merge-save. — https://github.com/unslothai/unsloth/pull/14823
- No throughput/latency numbers (tokens/s) were provided in this dataset.

## 5. Stability & Regressions

Ranked by severity:

1. **Server core dumps / models stop responding** (OPEN, issue #14411): models stop responding after a few turns regardless of KV usage; ejecting the model core dumps. No fix PR identified. — https://github.com/unslothai/unsloth/issues/14411
2. **GGUF loads crash the Windows server** (OPEN, issue #14513): Studio GGUF loads crash the server on Windows instead of using the low-memory path. — https://github.com/unslothai/unsloth/issues/14513
3. **SSRF-guarded VLM image fetch** (PR #14701): VLM dataset conversion used `fsspec.open` following redirects to loopback/LAN/cloud metadata with no size cap. Security fix in review. — https://github.com/unslothai/unsloth/pull/14701
4. **GPT-OSS template bug** (PR #14700, flagged `regresses`): earlier assistant turns with a `thinking` key were rendered on the `analysis` channel, so the model saw its own prior answer as reasoning. — https://github.com/unslothai/unsloth/pull/14700
5. **Long-chat stall before inference** (OPEN, issue #14519): CPU conversation-archive embeddings can block for minutes before llama.cpp sees a request; Stop does not cancel archiving. — https://github.com/unslothai/unsloth/issues/14519
6. **Attachments unreadable after compaction** (OPEN, issue #14708): images/PDFs become permanently unreadable post auto-compaction; `search_conversation` never invoked. — https://github.com/unslothai/unsloth/issues/14708
7. **Multi-model sync** (issue #12365, CLOSED) and **wrong-model sends** (PR #14568, fixing #14506): with two models loaded, returning to a chat using the other model required a manual "Switch back" or the next message went to the wrong model. PR #14568 keeps the chat's own model when still loaded. — https://github.com/unslothai/unsloth/pull/14568
8. **RMSNorm/LayerNorm launch-settings cache** (PR #14727): hashing a symbolic width under `torch.compile(dynamic=True)` — fix bypasses the cache correctly. — https://github.com/unslothai/unsloth/pull/14727
9. **pre-commit.ci stress** (issue #14174, CLOSED): the unoptimized `scripts/enforce_kwargs_spacing.py` consumed excessive CI compute. — https://github.com/unslothai/unsloth/issues/14174

## 6. What This Means for Application Developers

- **If you serve multiple models per Studio instance**, watch PR #14568 and #12365 — multi-model routing previously misrouted messages when models were co-loaded. Until merged, treat model selection as stateful per chat and re-verify on switch.
- **Building on Studio's API surface**: PR #14824 changes credential semantics for saved Connections. Audit any code minting API keys named after connections; do not rely on key-name-based trust.
- **RAG/agent pipelines**: Flows (PR #14730) exposes the same MCP capabilities as a shareable single-file graph — worth evaluating if you currently script Studio's chat/tool APIs manually.
- **Windows + GGUF and Intel XPU users** should hold on GPU-heavy Studio updates until #14513 and #14807 land; both are active open bugs.
- **AMD/ROCm** Auto residency regression is being fixed (#14820) — if you rely on VRAM budgeting on ROCm, that PR is the one to follow.
- **Security-conscious dataset pipelines**: adopt the guarded fetch (#14701) once merged if you ingest VLM datasets from user-supplied image URLs.
- No versioned release, so no migration action is required today; track the `api_keys.purpose` schema addition as the only anticipated config-adjacent change.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*