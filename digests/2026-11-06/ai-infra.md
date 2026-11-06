# AI Infrastructure Digest 2026-11-06

> Generated: 2026-11-06 01:28 UTC | Projects covered: 6

- [vLLM](https://github.com/vllm-project/vllm)
- [SGLang](https://github.com/sgl-project/sglang)
- [llama.cpp](https://github.com/ggml-org/llama.cpp)
- [Ollama](https://github.com/ollama/ollama)
- [LiteLLM](https://github.com/BerriAI/litellm)
- [Unsloth](https://github.com/unslothai/unsloth)

---

## Cross-Project Comparison

# Cross-Project Comparison Report — AI Infrastructure Digest
**Date: 2026-11-06**

---

## 1. Ecosystem Overview

The ecosystem is in a **stabilization-and-broadening phase** rather than a feature-launch phase: no project shipped a major release in the last 24 hours, yet every tracker shows dense activity (SGLang alone: 64 issues / 500 PRs updated). The dominant engineering themes are **regression triage on datacenter paths** (Blackwell/SM120 correctness, FP8 KV scales, disaggregated KV transfer) and **expansion to non-NVIDIA silicon** (Intel XPU, AMD RDNA/gfx950, Cambricon MLU, Apple MLX, Qualcomm Adreno). A clear split is emerging between **fast-moving serving engines** racing on MoE/long-context/disaggregation features and **local runtimes/gateways** hardening API compatibility and correctness. Meanwhile, **quantization-adjacent silent-corruption bugs** (dropped KV scales, MoE weight-pool permutation, spec-decoding divergence on quantized targets) are the highest-value class of issue across all projects — they degrade quality without crashing. Determinism and batch-invariance guarantees remain explicitly immature.

---

## 2. Activity Comparison

| Project | Layer | Issues (recent window) | PRs (recent window) | Releases in last 24h | Release posture |
|---|---|---|---|---|---|
| **vLLM** | Serving engine (datacenter) | High — regression-heavy, ~10 ranked stability items | Concentrated on KV-offload, MoE reload, DP/Nixl parity | **None** | Pre-v0.32 stable line; v0.32.0 has known IMA/block-size regressions |
| **SGLang** | Serving engine (datacenter) | **Very high — 64 issues** | **Very high — ~500 PRs updated** | **None** | Heavy CI churn (177-comment flaky tracker); no release tag |
| **llama.cpp** | Local/edge runtime | Moderate — long-running correctness threads (38-comment spec-dec) | Steady backend kernel PRs | **10+ builds (b12128–b12140)** | **Most active releaser** — daily/near-daily builds |
| **Ollama** | Local runtime / UX | Moderate — hardware + tool-calling bugs | MLX concurrency, parser fixes | **None** (0.40.14 stable, 0.40.15-rc2) | RC in flight; fresh Vulkan crash on rc |
| **LiteLLM** | LLM gateway | Moderate — streaming-usage + Anthropic translation | Guardrail, OTel, provider PRs | **v1.108.1 stable + v1.107.0-rc.3** | **Only project with a stable release**; post-incident signing rigor |
| **Unsloth** | Fine-tuning / training | Moderate — Studio/Desktop UX cluster | NVFP4, diffusion LoRA, RAG batching | **None** | Studio stabilization cycle; no tag |

**Takeaways:** llama.cpp is the only project shipping continuously (10+ builds). LiteLLM is the only project promoting a stable artifact (v1.108.1, cosign-signed). Both datacenter serving engines (vLLM, SGLang) are in **pre-release triage** — SGLang with by far the highest raw churn. Ollama sits mid-cycle with an RC that already carries a crash regression.

---

## 3. Model Support Race

| Model / Architecture | vLLM | SGLang | llama.cpp | Ollama | LiteLLM | Unsloth |
|---|---|---|---|---|---|---|
| **Qwen3.8 / Qwen3.5 family** | ✅ active (MXFP4 ROCm, XPU monokernel) | ✅ (FP8 KV scale bug) | ✅ (MTP asserts) | ✅ (0.8B q4_K_M requested) | — | — |
| **Qwen4Exp / Flash-Next (long-ctx)** | ⚠️ IMA >262k on v0.32 | — | ✅ (MTP startup assert) | ✅ (NVFP4/MLX mem work) | — | — |
| **DeepSeek-V4.x** | ⚠️ block-size regression on v0.32 | ✅ DSA/CP, HiCache L3 | — | — | — | ✅ (217 GiB MoE mmap PR) |
| **GLM-5.3-Flash** | ⚠️ ROCm lock assert | ✅ Hopper opt tracker | ✅ (MoE cache +7%) | — | — | — |
| **MiniMax M2.7 / M3 / H3** | ⚠️ TP4+EP regression | ⚠️ sm_121 all-NUL output | — | — | — | ⚠️ OOM on L4 |
| **Gemma 4** | — | ✅ XPU stacked series | ⚠️ MTP/mmproj aborts | ⚠️ tool-call drop | — | ⚠️ thinking template strips reasoning |
| **Kimi-K3/K3.1** | — | ✅ DSA decode CP, ROCm kernels | — | — | — | — |
| **Nemotron 3.5 ASR** | 📋 requested | — | — | — | — | — |
| **xing4_0 arch** | — | — | ✅ PR #31589 | — | — | — |
| **Claude Opus 5 / 4.8 (via Bedrock)** | — | — | — | — | ✅ native structured output | — |
| **Hindsight / SLNG TTS-STT** | — | — | — | 📋 requested | ✅ SLNG provider PR | — |

**Who's ahead:**
- **SGLang** leads on **breadth of frontier-model optimization** — Kimi-K3.1 CP runtime, DeepSeek-V4 DSA, GLM-5.3 Hopper tracker, plus the widest backend spread (XPU, MLU, RDNA, Apple).
- **llama.cpp** leads on **new architecture landing** (xing4_0 full graph + HF→GGUF) and edge/hybrid MoE — and is the fastest to register novel GGUFs.
- **vLLM** is strongest on **hardware-tracker discipline** (dedicated MI355X/gfx950 and Qwen3.8 MXFP4 trackers) but is currently *behind on stability* for its newest model paths.
- **LiteLLM** is the only project advancing **provider-side model features** (Bedrock native structured output on Opus 5) — gateway-layer, not engine-layer.
- **Ollama** is mostly *reacting* (requests for Arc, Hindsight, Qwen3.5 0.8B) rather than leading.

---

## 4. Performance Frontier

| Optimization axis | vLLM | SGLang | llama.cpp | Ollama | Unsloth |
|---|---|---|---|---|---|
| **KV cache / offload** | 🔥 Hybrid SSD/DRAM tiering, NIXL views, NixlConnector (buggy) | 🔥 HiCache L3 SWA checkpoint (18 GB→3.6 GB/1M tok) | — | — | — |
| **Kernels / launch overhead** | PDL launch (−0.45 µs/launch), fused MoE | ROCm split-K MLA, Kimi DFlash verify kernel | Metal mul_mm K∈[32,64), Vulkan coopmat re-enable, RDNA3 MMQ spill fix | — | ESIMD/SYCL GDN (via llama.cpp) |
| **MoE efficiency** | Oracle dedup (−302 LOC), direct weight reload | LES paged-expert offload RFC, routing simulator | **ClassLRU cache: +6–7% decode, −8% uploads** | — | MoE mmap for oversized GGUF |
| **Quantization** | FP8 batch-invariance fixes | FP8 KV scales (**silently dropped**), MXFP4 RDNA widening | Q6_K OpenCL, bf16 matmul | NVFP4/MXFP8 tuning | **NVFP4 on sm_100**, FP8 LoRA (test failing) |
| **Distributed serving** | DP/Nixl READY fix, disaggregation | FlashInfer context parallelism, DSA decode CP | RPC alignment | — | — |
| **Batching / concurrency** | Batch-invariance maturing | Deterministic hybrid Mamba replay | Speculative verification tiling | MLX `NUM_PARALLEL` unlock | Multi-LoRA batching (races) |
| **Training-side** | RL weight reload (MoE padding reset) | — | — | — | Diffusion LoRA host-sync removal, RAG batching (48× gap) |

**Where the effort concentrates:**
1. **KV cache tiering + disaggregation** is the single biggest serving-engine battleground — but it is also the buggiest area (NixlConnector KV corruption in vLLM; Mooncake RDMA failures in SGLang).
2. **MoE efficiency** is the highest-ROI landed win: llama.cpp's ClassLRU (+6–7%) and vLLM's oracle refactor are concrete, measurable gains.
3. **Quantization is the riskiest axis** — nearly every project has a *silent* quantization bug (dropped FP8 scales, NVFP4 long-gen degradation, spec-dec divergence on Q4_K_M).
4. **Non-NVIDIA kernel work is accelerating** — ROCm split-K, RDNA3 MMQ, Vulkan coopmat, XPU monokernel, SYCL GDN.

---

## 5. Layer Positioning

| Layer | Projects | Primary job | Failure mode that matters most |
|---|---|---|---|
| **Datacenter serving engine** | **vLLM, SGLang** | Max-throughput multi-model serving, P/D disaggregation, RL weight reload | Silent KV corruption; IMA on long-context; regression on upgrade |
| **Local / edge runtime** | **llama.cpp, Ollama** | Single-node inference, GGUF, broad hardware, UX | Server crashes on malformed input; silent numerics (F16 overflow); Vulkan instability |
| **LLM gateway / proxy** | **LiteLLM** | Multi-provider routing, translation, guardrails, spend accounting | Usage-accounting loss; translation gaps; guardrail no-ops |
| **Training / fine-tuning** | **Unsloth** | LoRA/QLoRA, Studio, RAG ingestion, diffusion training | Silent training-data corruption; download/indexing failures |

**Key distinctions:**
- **vLLM vs SGLang** — same layer, different bets. vLLM is heavier on **KV-offload plumbing and RL/weight-reload** (Q4 roadmap: disaggregation + direct reload). SGLang is heavier on **frontier-model kernel specialization and backend breadth** (Kimi, DeepSeek DSA, XPU/MLU/RDNA). Both share the *same class* of stability bugs (KV transfer, FP8 scales, determinism).
- **llama.cpp vs Ollama** — llama.cpp is the **engine** (kernels, ops, GGUFs, releasing daily); Ollama is the **productized runtime** wrapping llama.cpp + MLX. Ollama inherits llama.cpp's correctness issues and adds API/UX surface (tool-calling, OpenAI/Anthropic compat).
- **LiteLLM is orthogonal** — it consumes *any* of the engines above as an upstream provider. Its bugs are proxy-layer (streaming usage, translation), not inference-layer.
- **Unsloth is upstream of serving** — it produces the weights/adapters the engines serve. Its bugs propagate *silently* into served models (reasoning-token stripping, pipeline-parallel aux-loss refusal).

---

## 6. Trend Signals

**1. The "silent correctness" crisis is the defining risk of this cycle.**
Across five projects, the highest-severity bugs are *non-crashing* quality degradations:
- vLLM: MoE weight-pool corruption → all rows become copies of row 0 (silent accuracy loss).
- SGLang: FP8 KV scales dropped → every layer at scale 1.0 (silent quality loss).
- llama.cpp: spec-dec greedy divergence on Q4_K_M (wrong output, no error).
- LiteLLM: MCP `is_error` dropped → agents treat failed tools as successes.
- Unsloth: Gemma-4-thinking template strips reasoning tokens (silent training corruption).
**→ Watch:** any project adding quantization/offload paths without end-to-end eval gates is accumulating invisible debt.

**2. KV cache is being re-architected as a storage tier, and it's not production-safe yet.**
vLLM's hybrid SSD/DRAM tiering + NixlConnector, SGLang's HiCache L3 (18 GB→3.6 GB/1M tok), and llama.cpp's `/slots` checkpoint gaps all point the same direction: **KV as a managed, tiered, disaggregated resource**. But the bug surface is wide (KV corruption, transfer crashes, 1.0–1.8 s re-queue stalls).
**→ For agent/long-context developers:** treat KV-offload/disaggregation as review-stage; prefer stable OffloadingConnector paths.

**3. Determinism is not yet a guarantee — batch invariance is explicitly immature.**
vLLM flags two open batch-invariance fixes (FA sliding window, FP8 dequant); SGLang has an open determinism bug (cold vs radix-cache-hit logprobs); llama.cpp has nondeterministic Vulkan coopmat and F16-overflow on ARM.
**→ For agent loops:** avoid strict greedy-equality assertions; pin versions and disable speculative paths on quantized targets.

**4. Non-NVIDIA backends are a real investment track, not a checkbox.**
Intel XPU (vLLM monokernel, SGLang Gemma4 stack), AMD ROCm/gfx950 (split-K MLA, RDNA3), Cambricon MLU (initial PR), Apple MLX (Ollama concurrency, SGLang Torch redesign), Qualcomm Adreno (llama.cpp dll auto-fetch).
**→ For hardware evaluators:** SGLang has the broadest backend footprint; expect these paths to be younger and CI-fragile relative to Hopper/Blackwell.

**5. OpenAI/Anthropic API compatibility is the new correctness battleground for gateways and local runtimes.**
LiteLLM (`/v1/messages` translation gaps, streaming usage loss, SSE keepalive masking errors), Ollama (`/v1/models` null vs `[]`, silent truncation, dropped thinking blocks), llama.cpp (new `/v1/audio/speech`, session-update crash fix).
**→ For gateway builders:** normalize error semantics yourself; validate response shapes; don't assume OAI-compat behavior is uniform across providers or engines.

**6. Supply-chain and release rigor is tightening post-incident.**
LiteLLM's cosign signing (new key in `e82a3c6`) and rc-branch review gates, plus llama.cpp's `HF_TOKEN` host restriction (PR #31730).
**→ For CI/CD:** pin images by digest and verify signatures; audit token-scoping assumptions.

---

### Bottom line for technical decision-makers

| If you are… | Do this today |
|---|---|
| Serving long-context Qwen4Exp/DeepSeek-V4 | **Pin vLLM to v0.31.1** until #62383/#60762 land |
| Billing on usage via LiteLLM | **Reconcile against provider usage reports** — streaming usage loss is real (3 closed issues) |
| Building agents with tool calls | **Validate per-model/backend round-trips**; don't trust `is_error` or uniform HTTP semantics |
| Serving large MoE on constrained VRAM | **Watch llama.cpp ClassLRU (#31233)** — highest-leverage landed win (+6–7%) |
| Running local inference on AMD iGPU | **Hold Ollama upgrades** — fresh Vulkan crash on 0.40.14/0.40.15-rc2 |
| Fine-tuning reasoning models on Unsloth | **Audit chat templates** — reasoning-token stripping (#16699) is silent |
| Evaluating non-NVIDIA silicon | **SGLang is furthest along** (XPU/MLU/RDNA/Apple), but benchmark before committing hardware |

---

## Per-Project Reports

<details>
<summary><strong>vLLM</strong> — <a href="https://github.com/vllm-project/vllm">vllm-project/vllm</a></summary>

# vLLM Digest — 2026-11-06

## 1. Today's Highlights

No releases landed in the last 24h, but the issue tracker is dominated by regression triage ahead of a stable v0.32 line: two SM120/Blackwell correctness failures (#59203, #63343) and a Qwen4Exp long-context CUDA illegal memory access (#62383) are all under active discussion. On the PR side, effort is concentrated on KV-offload plumbing (hybrid SSD/DRAM tiering, NIXL transfer views) and MoE oracle/direct-reload refactors — the groundwork for the Q4 roadmap's RL-weight-reload and disaggregated-serving goals.

## 2. Releases & Breaking Changes

None in the last 24h. However, note a **behavioral regression risk** from v0.32.0 that is worth pinning around:

- Qwen4Exp (Qwen3.8-Flash-Next) single prefill crossing the 262,144-token native boundary crashes with CUDA illegal memory access on v0.32.0 and nightly, but works on v0.31.1 — [Issue #62383](https://github.com/vllm-project/vllm/issues/62383).
- DeepSeek-V4.1 block-size handling broke on the v0.32.0 release tag (both 64 and 128 fail); fix is tracked in #60762, issue closed — [Issue #59203](https://github.com/vllm-project/vllm/issues/59203).
- DP + NixlConnector + `decode_context_parallel_size > 1` fails the DP config check at READY; fix PR open — [PR #65792](https://github.com/vllm-project/vllm/pull/65792).

## 3. New Model & Hardware Support

- **Rust frontend** continues toward feature parity with the Python API server (`VLLM_USE_RUST_FRONTEND=1`); still experimental — [Issue #44280](https://github.com/vllm-project/vllm/issues/44280).
- **NVIDIA Nemotron 3.5 ASR Streaming** (`nemotron-3.5-asr-streaming-0.6b`, 600M multilingual streaming ASR) requested; not yet landed — [Issue #47455](https://github.com/vllm-project/vllm/issues/47455).
- **Intel XPU**: Qwen3.5 specialized decode with mono decode kernels (`--monokernel`) PR open — [PR #65566](https://github.com/vllm-project/vllm/pull/65566).
- **AMD ROCm**: MI355X/gfx950 optimization trackers active for Qwen3.8-2.4T-A95B MXFP4 — [Issue #57149](https://github.com/vllm-project/vllm/issues/57149) — and Qwen3.8-Flash-Next MXFP4 — [Issue #59575](https://github.com/vllm-project/vllm/issues/59575).
- **SM120 (RTX PRO 6000 Blackwell)**: `enable_adaptive_verification` is rejected because device-query-lens support is gated to SM90/SM100 only — [Issue #63343](https://github.com/vllm-project/vllm/issues/63343).

## 4. Performance & Optimization

- **MiniMax-M2.7 throughput regression** on TP4+EP across v0.29/0.31/0.32 vs earlier releases — [Issue #63705](https://github.com/vllm-project/vllm/issues/63705). No fix PR yet; investigate before upgrading if you serve MiniMax.
- **Qwen GDN decode + Triton fused-MoE kernels** moved to PDL launch on SM90+, shaving ~0.45µs of inter-kernel gap per launch even inside CUDA graphs — [PR #64846](https://github.com/vllm-project/vllm/pull/64846).
- **GB10 (DGX Spark) weight loading** is slow: per-tensor H2D copies straight from safetensors mmap views. Related platform fixes tracked for ROCm (#49991) and Ascend (#50794) — [Issue #58726](https://github.com/vllm-project/vllm/issues/58726).
- **MoE oracle deduplication** refactor: net −302 lines in production code, behavior-neutral except log/error text — [PR #63349](https://github.com/vllm-project/vllm/pull/63349).
- **Qwen3.5 397B NVFP4 DEP8**: mixed prefill-decode step is ~6× slower than decode-only — [Issue #44806](https://github.com/vllm-project/vllm/issues/44806).
- **Scheduler stall**: completed async KV pulls incur a 1.0–1.8s re-queueing stall; RFC proposes front-of-queue re-admission — [Issue #62532](https://github.com/vllm-project/vllm/issues/62532).

## 5. Stability & Regressions

Ranked by severity:

1. **CUDA illegal memory access** on Qwen4Exp when a single prefill crosses the 262,144-token native boundary (v0.32.0 + nightly) — [Issue #62383](https://github.com/vllm-project/vllm/issues/62383).
2. **KV correctness bug in NixlConnector**: blocks released on lease expiry while a remote READ is in flight; decode silently consumes overwritten KV — [Issue #61229](https://github.com/vllm-project/vllm/issues/61229).
3. **EngineCore crash** in `_update_from_kv_xfer_finished` when an async KV connector reports a finished transfer for an aborted/freed request — [Issue #43226](https://github.com/vllm-project/vllm/issues/43226).
4. **MoE weight-pool corruption** under level-2 sleep: permutation indices kept in the weights pool cause all rows to become copies of row 0 after a weight update. Fix PR open — [PR #66010](https://github.com/vllm-project/vllm/pull/66010).
5. **FlashInfer sampler JIT crashes engine startup** when `nvcc` isn't discoverable (default precompiled/wheel installs), with no fallback to the native sampler — [Issue #49497](https://github.com/vllm-project/vllm/issues/49497).
6. **KDA/gated-delta-rule chunked-scan buffers** are outside memory profiling; runtime OOM at large `--max-num-batched-tokens` — [Issue #54775](https://github.com/vllm-project/vllm/issues/54775).
7. **ROCm GLM-5.3-Flash**: `"Workspace is locked"` AssertionError under high decode concurrency — [Issue #64874](https://github.com/vllm-project/vllm/issues/64874).
8. **Hybrid Mamba prefix caching silently drops to 0%** when the align-mode checkpoint lands in request-unique tokens — [Issue #45238](https://github.com/vllm-project/vllm/issues/45238).
9. **Qwen3.5/Qwen3-Next GDN attention** torch.compile stride mismatch at warmup (recurrence of #29014) — [Issue #50046](https://github.com/vllm-project/vllm/issues/50046).
10. **Whisper timestamp drift** on audio >30s (~0.5s per segment) — [Issue #32588](https://github.com/vllm-project/vllm/issues/32588).

Fixes in flight: [PR #66010](https://github.com/vllm-project/vllm/pull/66010) (MoE sleep), [PR #65792](https://github.com/vllm-project/vllm/pull/65792) (DP/Nixl parity), [PR #65627](https://github.com/vllm-project/vllm/pull/65627) (FA sliding window under batch invariance), [PR #64480](https://github.com/vllm-project/vllm/pull/64480) (fp32 `weight_scale` under batch-invariant FP8 dequant).

## 6. What This Means for Application Developers

- **Pin to v0.31.1 if you serve Qwen4Exp/Qwen3.8-Flash-Next with long contexts (>262k).** v0.32.0 has an unresolved IMA on that path. Similarly, DeepSeek-V4.1 users on the v0.32.0 release tag should hold until #60762 lands.
- **Treat KV-offload/disaggregation as review-stage, not production-ready.** NixlConnector (#61229), the async-KV finished-transfer crash (#43226), and DP/Nixl READY failures (#65792) all sit in the P/D disaggregation path that most agentic, long-context, or multi-turn apps lean on. If you rely on KV reuse across turns, prefer the stable OffloadingConnector path and watch the hybrid-backend PRs ([#65953](https://github.com/vllm-project/vllm/pull/65953), [#64973](https://github.com/vllm-project/vllm/issues/64973)).
- **RL fine-tuning stacks should watch direct weight reload ([PR #64352](https://github.com/vllm-project/vllm/pull/64352), RFC [#54477](https://github.com/vllm-project/vllm/issues/54477)).** The MoE expert-padding reset and permutation-index fix directly address silent accuracy corruption during weight updates — a class of bug that manifests as degraded eval scores rather than crashes, which is far harder to catch in production.
- **Batch invariance (`VLLM_BATCH_INVARIANT=1`) is still maturing.** Two related fixes (#65627, #64480) show determinism guarantees are not yet uniform across attention and quantization paths; don't assume bit-identical outputs across differing batch compositions on Gemma-2/FA3 or FP8 kernels.
- **Rust frontend and XPU monokernel are worth piloting but not standardizing on.** Both are explicitly experimental; the Rust frontend lacks feature parity and the XPU path is Qwen3.5-specific today.

</details>

<details>
<summary><strong>SGLang</strong> — <a href="https://github.com/sgl-project/sglang">sgl-project/sglang</a></summary>

# SGLang Digest — 2026-11-06

## 1. Today's Highlights

No new releases in the last 24 hours, but issue and PR activity is heavy (64 issues, 500 PRs updated). The dominant themes are **CI/测试 infrastructure instability** (a long-running flaky-test tracker with 177 comments), **SM120/Blackwell and consumer RDNA quantization gaps**, and a growing **Intel XPU / Cambricon MLU backend footprint**. Notable correctness work landed or advanced around **FP8 KV cache scales**, **deterministic hybrid Mamba replay**, and **API consistency for context-length errors**.

## 2. Releases & Breaking Changes

- **No new releases in the last 24h.**
- **API behavior inconsistency flagged (no fix PR yet):** `/v1/responses` streaming returns HTTP 200 + `response.failed` for context-length-exceeded requests, whereas `/v1/chat/completions` correctly returns HTTP 400. Applications that parse streaming errors must handle a 200 status with a failure body. [Issue #48557](https://github.com/sgl-project/sglang/issues/48557)
- **Security-adjacent change in flight:** PR redacts API access keys from `/server_info`, logs, `launch_command`, and crash dumps — a config/observability change to be aware of if you parse server args programmatically. [PR #48518](https://github.com/sgl-project/sglang/pull/48518)
- **Rust frontend gaining request decompression** (`SGLANG_ENABLE_REQUEST_DECOMPRESSION`), relevant to gateway deployments. [PR #48523](https://github.com/sgl-project/sglang/pull/48523)

## 3. New Model & Hardware Support

- **Intel XPU:** Large stacked series for Gemma4 (encoder-free text serving, fused QKV norm + RoPE, frozen-KV MTP graph capture, fused greedy verification logits) plus a native-BF16 GELU lookup kernel. [PR #44851](https://github.com/sgl-project/sglang/pull/44851), [PR #44869](https://github.com/sgl-project/sglang/pull/44869), [PR #44852](https://github.com/sgl-project/sglang/pull/44852), [PR #44905](https://github.com/sgl-project/sglang/pull/44905)
- **Intel XPU MoE offload RFC:** Paged-experts with Lookahead Expert Scheduling (LES) and an SSD tier for iGPU / single-GPU MoE. [Issue #46520](https://github.com/sgl-project/sglang/issues/46520)
- **Cambricon MLU:** Initial platform support PR — device management, CNCL comms, RMSNorm, install docs, CI. [PR #45149](https://github.com/sgl-project/sglang/pull/45149)
- **Apple Silicon:** Redesign RFC to move SRT serving under Torch ownership with an exported whole-model MLX region; implementation PR open. [Issue #32321](https://github.com/sgl-project/sglang/issues/32321), [PR #36164](https://github.com/sgl-project/sglang/pull/36164)
- **AMD consumer RDNA:** Widening Quark MXFP4 W4A16 MoE gate to gfx11xx/gfx1200/gfx1201 with a clear failure path when aiter is absent. [PR #47585](https://github.com/sgl-project/sglang/pull/47585)
- **FlashInfer context parallelism** for dense MHA/GQA prefill now supported via zigzag-sharded Q with full paged KV gather. [PR #33226](https://github.com/sgl-project/sglang/pull/33226)

## 4. Performance & Optimization

- **SM120 (4× RTX PRO 6000, TP=4) DeepSeek-V4 prefill regression:** reported ~2–7K tok/s vs ~12.5K tok/s on vLLM/marlin on identical hardware; tuning guidance requested, no fix PR. [Issue #33422](https://github.com/sgl-project/sglang/issues/33422)
- **GLM-5.3-Flash on Hopper (SM90):** active optimization tracker under the Q4 roadmap, with SM120 tracking cross-referenced. [Issue #45373](https://github.com/sgl-project/sglang/issues/45373)
- **AMD gfx950 split-K decode plan** for 64-head FP8 sparse MLA (DSA), validated locally, rebased onto main. [PR #47278](https://github.com/sgl-project/sglang/pull/47278)
- **Kimi-K3 DFlash draft split-KV sliding-window verify kernel** for ROCm; replaces generic Triton path. [PR #46648](https://github.com/sgl-project/sglang/pull/46648)
- **Kimi-K3.1 DSA decode context parallelism runtime** ported to main — shards MLA KV and indexer index-K cache by token with cross-rank top-k merge. [PR #48721](https://github.com/sgl-project/sglang/pull/48721)
- **HiCache L3 SWA periodic checkpoint** reduces L3 footprint for DeepSeek-V4-Flash from ~18 GB/1M tokens toward ~3.6 GB compressed. [PR #27557](https://github.com/sgl-project/sglang/pull/27557)
- **MoE routing simulator RFC:** synthetic balanced reference + GPU-faithful replay to profile prefill imbalance before changing load balancing. [Issue #44697](https://github.com/sgl-project/sglang/issues/44697)

## 5. Stability & Regressions

Ranked by severity/impact:

1. **GB10 unified-memory exhaustion (no traceback):** long prefills >40k tokens on 2× DGX Spark silently kill the worker rank; cross-stack control passes at 54k. No fix PR. [Issue #36941](https://github.com/sgl-project/sglang/issues/36941)
2. **FP8 KV cache scales silently dropped** for Qwen3-MoE, Qwen2, and Mixtral — every layer falls back to scale 1.0, causing silent quality degradation. No fix PR. [Issue #39942](https://github.com/sgl-project/sglang/issues/39942)
3. **Hybrid GDN + EAGLE/MTP memory waste:** KV pool profiler leaves ~50 GB VRAM idle on Qwen3.6-27B NVFP4; disabling spec decoding restores capacity. [Issue #29857](https://github.com/sgl-project/sglang/issues/29857)
4. **Determinism bug (fix PR open):** hybrid linear-attention (Gated DeltaNet) models return different greedy logprobs depending on cold vs radix-cache hit. [PR #48425](https://github.com/sgl-project/sglang/pull/48425)
5. **DeepSeek-V4 DSA indexer top-k illegal memory access** (`topk_v1.cuh:348`) on long-context prefill; paged prefill path never reaches v2 kernel. [Issue #37892](https://github.com/sgl-project/sglang/issues/37892)
6. **NPU Ascend attention silent corruption with page_size 16** (128 OK, 1 rejected per #25169). [Issue #38196](https://github.com/sgl-project/sglang/issues/38196)
7. **MiniMax-M3 W4A16 on sm_121:** all-NUL output on Triton MiniMaxSparse path; same weights correct on vLLM. [Issue #38143](https://github.com/sgl-project/sglang/issues/38143)
8. **CI/infra:** Mooncake RDMA "memory region not registered" fails whole PD test classes on 8×H20; Xeon SPR socket0 servers OOM-killed during KV allocation; ongoing flaky-test tracker with 177 comments. [Issue #48206](https://github.com/sgl-project/sglang/issues/48206), [Issue #48411](https://github.com/sgl-project/sglang/issues/48411), [Issue #42752](https://github.com/sgl-project/sglang/issues/42752)
9. **Model registry eager import** hides per-model failures and adds ~2s startup (one bad dependency → 0 models registered). [Issue #48080](https://github.com/sgl-project/sglang/issues/48080)
10. **`reasoning_effort` mapping bug** for DeepSeek-V4-Flash: `high` is a no-op, vendor `max` unreachable. [Issue #33185](https://github.com/sgl-project/sglang/issues/33185)

## 6. What This Means for Application Developers

- **Do not rely on uniform HTTP error semantics across endpoints.** If you stream via `/v1/responses`, treat a 200 with a `response.failed` body as a hard request failure (especially for context-length overruns) and normalize error handling in your gateway/client layer. [Issue #48557](https://github.com/sgl-project/sglang/issues/48557)
- **Validate FP8 KV cache behavior before trusting quality claims** on Qwen2/Qwen3-MoE/Mixtral deployments — scales may be silently neutralized. Compare logprobs against a known-good baseline. [Issue #39942](https://github.com/sgl-project/sglang/issues/39942)
- **Hybrid linear-attention models are not yet determinism-safe for cache-hit vs cold paths** unless you pick up the replay fix; avoid strict greedy-equality assertions in agent loops with radix caching. [PR #48425](https://github.com/sgl-project/sglang/pull/48425)
- **SM120/Blackwell and GB10 single-node deployments need careful capacity planning** — prefill throughput and unified-memory ceilings can diverge sharply from datacenter-class results; benchmark before committing hardware.
- **Broadening backend support (XPU, MLU, RDNA, Apple Silicon)** means if you are evaluating non-NVIDIA inference, SGLang is actively investing there — but expect these paths to be younger and CI-fragile relative to Hopper/Blackwell.
- **HiCache L3 footprint improvements** materially lower the cost of long-context caching for DeepSeek-V4-Flash-class models — relevant for RAG and long-agent-session workloads. [PR #27557](https://github.com/sgl-project/sglang/pull/27557)

</details>

<details>
<summary><strong>llama.cpp</strong> — <a href="https://github.com/ggml-org/llama.cpp">ggml-org/llama.cpp</a></summary>

# llama.cpp Digest — 2026-11-06

## 1. Today's Highlights

A heavy release day with 10+ builds landing across backends. The most significant infrastructure change is the **new `/v1/audio/speech` OpenAI-compatible endpoint** (PR #31763), which begins closing the gap between llama.cpp's server and the full OAI API surface. On the performance side, **Metal gains a dedicated mul_mm path for K in [32, 64)** with bf16×bf16 kernel support ([b12138](https://github.com/ggml-org/llama.cpp/releases)), and the **MoE cache gets a reworked LRFU/ClassLRU hybrid** reporting +6–7% decode gains on Qwen-Flash-Next and GLM. A steady stream of Qualcomm Adreno/Vulkan bugfixes continues to land.

---

## 2. Releases & Breaking Changes

Ten+ builds published in the last 24h, all tagged on `ggml-org/llama.cpp/releases`:

| Build | Change | Impact |
|---|---|---|
| **b12140** | YaRN: support `truncate=false` (GGML #30206) | Rope-scaling correctness for long-context models |
| **b12138** | Metal: `mul_mm` for `32 <= K < 64`; new bf16×bf16 matmul kernel | Perf (Metal) |
| **b12137** | **Server: reject non-object session updates** (#31714) | **Security/robustness** — prevents uncaught exception crashing the server on malformed realtime session payloads |
| **b12136** | `fit`: account for skipped NextN layers in `n_gpu_layers` (#31569) | Correctness for MTP/NextN layer-offload accounting |
| **b12135** | WebGPU: add MEAN op (#31591) | Backend parity |
| **b12132**, **b12131** | Drop `u8path()`, use `generic_string()` (#31681, #31682) | Cross-platform path handling; may affect Windows users relying on UTF-8 path edge cases |
| **b12130** | rpc: align code with `common.cpp` (#31684) | Internal |
| **b12129** | Vulkan: re-enable large coopmat matmul on AMD proprietary driver **26.10.1+** | Re-enables an optimization previously disabled |
| **b12128** | Tests: fix `TOPK_MOE` CI flake from near-ties (#31426) | CI stability |

**Migration note:** If you're on a server that accepts realtime session updates, upgrade past **b12137** — malformed payloads previously terminated the process.

---

## 3. New Model & Hardware Support

- **xing4_0 model architecture** — PR [#31589](https://github.com/ggml-org/llama.cpp/pull/31589) (closed): registers architecture, hyperparameters, tensor loading, HF→GGUF conversion, and inference graphs covering mHC / MLA / MoE / MTP. No new ggml ops introduced.
- **WebGPU MEAN operator** — [b12135](https://github.com/ggml-org/llama.cpp/releases) (Assisted-by: Codex): adds a missing op to the WebGPU backend.
- **Metal bf16×bf16 matmul kernel** — [b12138](https://github.com/ggml-org/llama.cpp/releases): first-class bf16 for the new Metal mul_mm path.
- **SYCL: Gated Delta Net ESIMD kernel** — PR [#31762](https://github.com/ggml-org/llama.cpp/pull/31762) (open): adds ESIMD GDN kernel for `S_v = 128, kda = 0` — directly relevant for Qwen3.8-27B Q3_K_P inference on Intel GPUs.
- **OpenCL: q6_k multi-column tiled GEMV** — PR [#31758](https://github.com/ggml-org/llama.cpp/pull/31758) (open): handles 2–4 columns for speculative verification.
- **OpenCL/Adreno**: PR [#31759](https://github.com/ggml-org/llama.cpp/pull/31759) fetches the Adreno binary kernel library (`adreno-opencl-kernels.dll`) at configure time on Windows-on-Snapdragon — removes manual `.dll` placement.

---

## 4. Performance & Optimization

**Landed / landing:**
- **Metal `mul_mm` for 32 ≤ K < 64** — [b12138](https://github.com/ggml-org/llama.cpp/releases): catches a previously unoptimized K-range with the coopmat path.
- **Vulkan large coopmat re-enabled on AMD proprietary 26.10.1+** — [b12129](https://github.com/ggml-org/llama.cpp/releases).
- **CUDA: avoid J=32 MMQ register spills on RDNA3** — PR [#31751](https://github.com/ggml-org/llama.cpp/pull/31751) (open, ravel7524): `#pragma unroll 1` on the inner K loop keeps accumulation order and tile selection. Targets gfx1100 (Radeon PRO W7800).
- **MoE cache: LRFU/MQ-inspired `ClassLRU`** — PR [#31233](https://github.com/ggml-org/llama.cpp/pull/31233) (open, sanmai): **+6% decode on Qwen-Flash-Next, +7% on GLM, 8% fewer uploads** vs SLRU; enables auto mode for `llama_moe_cache`.
- **HIP fast-math without regressions** — PR [#31625](https://github.com/ggml-org/llama.cpp/pull/31625) (open, thelittlefireman): targets closing the long-running ROCm fast-math chapter.

**In progress:**
- **Vulkan FA: fold verify tokens and GQA heads into one row tile** — PR [#30190](https://github.com/ggml-org/llama.cpp/pull/30190) (WIP, ravel7524): shares K/V reads across GQA ratios 2–8 and 2–8 query tokens on the existing coopmat1 shader.
- **Vulkan `rms_norm` runtime loop count** — PR [#30824](https://github.com/ggml-org/llama.cpp/pull/30824) (open): fixes Adreno miscompile of unrolled variants.
- **Adreno: disable subgroup arithmetic** — PR [#30826](https://github.com/ggml-org/llama.cpp/pull/30826) (open).
- **Adreno: avoid 8-bit vector pack/unpack** — PR [#30821](https://github.com/ggml-org/llama.cpp/pull/30821) (open, fixes #28290).
- **CUDA radix Top-K deterministic ties** — PR [#31084](https://github.com/ggml-org/llama.cpp/pull/31084) (open, sanmai).

**Regression warning:** Issue [#30004](https://github.com/ggml-org/llama.cpp/issues/30004) reports **CUDA ADD/GELU slower on B200** since the PDL commit (first bad: `7b28f950`) — worth tracking if you're on Blackwell.

---

## 5. Stability & Regressions

Ranked by severity:

### 🔴 High — Server
- **`llama-server` wedge**: generation stalls mid-decode, `/health` OK but `/slots` hangs, requires SIGKILL — Issue [#27388](https://github.com/ggml-org/llama.cpp/issues/27388) (open, stale). **No fix PR visible.**
- **Non-object session updates crash the server** — pre-**b12137**. **Fixed** in [b12137](https://github.com/ggml-org/llama.cpp/releases) (#31714). Upgrade mandatory for anyone exposing the realtime session API.

### 🟠 High — Speculative Decoding / MTP
- **draft-mtp / draft-dspark greedy divergence on quantized targets** — Issue [#25618](https://github.com/ggml-org/llama.cpp/issues/25618) (open, 38 comments, still active): speculative decoding produces different greedy output than vanilla on `Q4_K_M` targets; matches on bf16. This is the longest-running correctness thread in the tracker.
- **CUDA illegal memory access with Gemma 4 31B + draft-mtp after KV rollback/clear** — Issue [#31077](https://github.com/ggml-org/llama.cpp/issues/31077) (open). No-CUDA-crash with MTP off.
- **Gemma 4 + `--mmproj` + MTP aborts on startup** with `GGML_ASSERT(ubatch->embd_state)` — Issue [#30698](https://github.com/ggml-org/llama.cpp/issues/30698) (open, regression from #30257).
- **Qwen 3.8 Flash with MTP: assert at startup** — Issue [#29811](https://github.com/ggml-org/llama.cpp/issues/29811) (open).

### 🟠 High — Backend Correctness
- **Vulkan KHR_coopmat: nondeterministic wrong results on Intel Arc Pro B70 (BMG G31, Mesa 26.2.5)** — Issue [#31560](https://github.com/ggml-org/llama.cpp/issues/31560) (open). Returns a different answer every call on a BERT-style decision model; F16 and Q8_0. **Disable coopmat on Xe2 if you're doing any decision-making workloads.**
- **CPU F16 dot product accumulates in F16 on ARM without SVE, overflows to `inf`** — Issue [#31734](https://github.com/ggml-org/llama.cpp/issues/31734) (open, M4 Max). Narrow but potentially silent-numerics-affecting.

### 🟡 Medium — Resource / Scheduling
- **Offloaded-MoE prefill leaves GPU idle on serial expert H2D copies** — Issue [#25859](https://github.com/ggml-org/llama.cpp/issues/25859) (open, single-GPU `-ncmoe`, RTX 3060).
- **CUDA decode fragmentation with non-unified KV and 32 variable-length requests** — Issue [#31711](https://github.com/ggml-org/llama.cpp/issues/31711) (open, llama-server 0.7.0-dev).
- **`/slots` restore yields no KV reuse on hybrid/recurrent and SWA models** (checkpoints not persisted) — Issue [#28194](https://github.com/ggml-org/llama.cpp/issues/28194) (open, 👍:7).
- **qwen4exp: `per_layer_token_embd` CPU-pinned, Q8 model won't load on 2×96 GiB Vulkan+RPC** (needs ~50.7 GiB host RAM) — Issue [#29932](https://github.com/ggml-org/llama.cpp/issues/29932) (open).

### 🟡 Medium — Platform / Build
- **FreeBSD Vulkan compile failure** — Issue [#31541](https://github.com/ggml-org/llama.cpp/issues/31541) (open, `ggml-vulkan-comm.cpp:370`).
- **Vulkan `vk::DeviceLostError` on Linux 7.x (RADV_STRIXHALO)** — Issue [#25664](https://github.com/ggml-org/llama.cpp/issues/25664) (closed, stale).
- **PowerVR C-series (Pixel 11 Pro) GPU firmware crash** — Issue [#28214](https://github.com/ggml-org/llama.cpp/issues/28214) (closed, stale; subgroupSize 128).
- **CUDA `MUL_MAT_ID` via MMVQ fails on Turing with older arch compilation** (e.g. 61-virtual) — Issue [#30524](https://github.com/ggml-org/llama.cpp/issues/30524) (closed).
- **OpenVINO can't run Gemma on Intel Core 7 155H** — Issue [#29288](https://github.com/ggml-org/llama.cpp/issues/29288) (open, stale).
- **SYCL mtmd abort on Intel Arc Pro B70 (Windows)** — Issue [#29241](https://github.com/ggml-org/llama.cpp/issues/29241) (closed, stale).

**Fix PRs visible in-flight for:** Adreno miscompiles (#30821, #30824, #30826), CUDA Top-K ties (#31084), RDNA3 MMQ spills (#31751).

---

## 6. What This Means for Application Developers

**Upgrade your server build.** [**b12137**](https://github.com/ggml-org/llama.cpp/releases) is a must if you expose the realtime session endpoint — malformed input previously killed the process. No config migration is required, but you should fuzz-test your realtime clients.

**Audio output is now on the roadmap.** PR [#31763](https://github.com/ggml-org/llama.cpp/pull/31763) adds `/v1/audio/speech`, following the mtmd audio-output design (#21956, now closed). If you're building voice agents, the OpenAI-compatible surface is converging — but note **no tiny TTS CI fixture exists yet**, so expect rough edges. Watch for a small-fixture PR in the spirit of [#28815](https://github.com/ggml-org/llama.cpp/pull/28815) (95M multimodal test fixture covering toolcalls, vision, and MTP).

**MoE inference gets cheaper.** The `ClassLRU` cache ([#31233](https://github.com/ggml-org/llama.cpp/pull/31233)) delivers **+6–7% decode and 8% fewer expert uploads** on Qwen-Flash-Next and GLM with a warm cache, and switches to auto mode. If you're serving large MoE models on constrained VRAM, this is the single highest-leverage PR in the queue.

**Speculative decoding is still not safe on quantized targets.** Issue [#25618](https://github.com/ggml-org/llama.cpp/issues/25618) (38 comments) shows greedy draft-mtp output diverging from vanilla on `Q4_K_M`. If you rely on spec decoding for latency and need deterministic/reproducible output, **stay on bf16 targets** or run ngram speculation, which the report says matches.

**Avoid Intel coopmat for decision workloads.** The nondeterminism on Arc Pro B70 (#31560) is a correctness blocker for classifiers, routing, or any workload where the same input must yield the same answer. Disable coopmat until a fix lands.

**SDK surface is being hardened.** PR [#31730](https://github.com/ggml-org/llama.cpp/pull/31730) restricts `HF_TOKEN` to `huggingface.co` hosts — previously `HF_TOKEN` was sent to any `--model-url`. If you've been relying on that behavior for a proxy, switch to `MODEL_ENDPOINT`.

**Path handling changed.** If your integration shells out to llama.cpp on Windows with UTF-8 paths, verify against [b12131/b12132](https://github.com/ggml-org/llama.cpp/releases) (`u8path()` → `generic_string()`).

**Tool-call grammar is more forgiving now** in PR [#30193](https://github.com/ggml-org/llama.cpp/pull/30193): JSON tool argument keys accepted in any order for Qwen3-Coder/Nemotron — previously enforced declared property order caused garbage keys and dropped fields.

</details>

<details>
<summary><strong>Ollama</strong> — <a href="https://github.com/ollama/ollama">ollama/ollama</a></summary>

# Ollama Digest — 2026-11-06

## 1. Today's Highlights

No new releases in the last 24 hours, but the issue tracker is active: the long-running Intel Arc GPU support request (#1590) continues to accumulate demand, and fresh reports show Vulkan backend instability on AMD Renoir iGPUs and Intel Arrow Lake. On the PR side, MLX concurrency and stop-sequence handling landed or progressed, signaling continued investment in the Apple Silicon path — alongside a batch of parser correctness fixes for Modelfile handling.

## 2. Releases & Breaking Changes

None in the last 24 hours. Notable version context from active issues: the current stable line is 0.40.13–0.40.14, with 0.40.15-rc2 in testing ([#19558](https://github.com/ollama/ollama/issues/19558)). No API or config breaking changes today. One latent behavioral trap worth noting: `/v1/models` returns `"data": null` instead of `[]` when no models are installed — fix merged in [#19539](https://github.com/ollama/ollama/pull/19539), closing [#19381](https://github.com/ollama/ollama/issues/19381).

## 3. New Model & Hardware Support

- **Intel Arc GPU support** ([#1590](https://github.com/ollama/ollama/issues/1590)): Still open after nearly three years, now at 76 comments / 96 👍 — the highest-signal hardware request in the tracker.
- **Hindsight `hs-decide-1-flash`** ([#19554](https://github.com/ollama/ollama/issues/19554)): Feature request to add a Qwen-based decision model for agent memory operations. An implementation PR is already open via the MLX path ([#19555](https://github.com/ollama/ollama/pull/19555)).
- **KailA (`kail`) architecture** ([#18922](https://github.com/ollama/ollama/issues/18922), closed): Request to add llama.cpp compat-layer support for `general.architecture = kail` GGUF files.
- **Qwen3.5 0.8B Q4_K_M** ([#19436](https://github.com/ollama/ollama/issues/19436)): Request to publish a `q4_K_M` quant for the 0.8B variant — the only Qwen3.5 size lacking one; notable for CPU inference where `q4_*` runs roughly 2× faster than `q8_*`.
- **MLX capability exhaustiveness** ([#18711](https://github.com/ollama/ollama/pull/18711)): Makes declared capability lists exhaustive across create/serve/report for GGUF and MLX models.

## 4. Performance & Optimization

- **Parallel MLX generation** ([#19197](https://github.com/ollama/ollama/pull/19197)): Enables `OLLAMA_NUM_PARALLEL` for MLX models to reduce first-token wait; requests share projection and feed-forward work. Default remains 1 request — higher parallelism costs memory per active request.
- **Qwen3.8 Flash Next memory efficiency** ([#18078](https://github.com/ollama/ollama/pull/18078)): Keeps QSA projections and non-expert MTP path in BF16, applies MXFP8 to other dense/control weights — motivated by NVFP4 quantization degrading long generations. Published for both `qwen3.8-flash-next:125b-a6b-nvfp4` and `:125b-mlx`.
- **Qwen3.5/3.5MoE parallel requests** ([#17144](https://github.com/ollama/ollama/pull/17144)): Proposes lifting the hardcoded `numParallel = 1` blocklist in `server/sched.go` now that the upstream llama.cpp parallel-load crash was fixed (2026-03-08).
- **Unified-memory APU scheduling** ([#16720](https://github.com/ollama/ollama/pull/16720)): Scheduler currently treats *host* free memory as an upper bound on GPU budget, which under-utilizes carveouts on Strix Halo / Ryzen AI Max+ (gfx1151).
- **Regression watch**: [#18968](https://github.com/ollama/ollama/issues/18968) reports 25–30% lower t/s across all models versus v0.40.1 (closed, needs-more-info).

## 5. Stability & Regressions

Ranked by severity:

1. **Vulkan crash on AMD Renoir iGPU** ([#19558](https://github.com/ollama/ollama/issues/19558)) — `llama-server` crashes with NTSTATUS `0xe06d7363` at model load on gfx90c in 0.40.14 and 0.40.15-rc2, affecting *every* model including ~380 MB ones. No fix PR yet; highest-impact new report.
2. **`OLLAMA_NUM_PARALLEL` + multimodal** ([#4165](https://github.com/ollama/ollama/issues/4165)) — `failed processing images` / generation freeze with `llava`, `moondream` under concurrent requests. Open since May 2024.
3. **MLX stop sequences ignored** ([#19551](https://github.com/ollama/ollama/issues/19551)) — `Options.Stop` reaches `mlxrunner` but the decode loop never checks it; generation runs to EOS or `num_predict`. Fix PR open: [#19552](https://github.com/ollama/ollama/pull/19552).
4. **Gemma4 tool-call dropped on malformed delimiter** ([#19549](https://github.com/ollama/ollama/issues/19549)) — a string arg missing its opening `<|"|>` yields a response with no content and no `tool_calls`; error only logged. Fix PR open: [#19556](https://github.com/ollama/ollama/pull/19556).
5. **Native tool calling failures on Qwen2.5-Coder / Qwen3** ([#19524](https://github.com/ollama/ollama/issues/19524)) — model emits plausible-looking calls that don't execute on 0.40.13.
6. **Responses API silent truncation** ([#19492](https://github.com/ollama/ollama/issues/19492)) — oversized input truncated even with truncation disabled; a fix mapping `Truncation` → `api.ChatRequest.Truncate` is open: [#19501](https://github.com/ollama/ollama/pull/19501).
7. **Anthropic `/v1/messages` thinking blocks** ([#19415](https://github.com/ollama/ollama/issues/19415)) — only the last thinking block of a multi-block assistant message is retained.
8. **Vulkan garbage output on Intel Arrow Lake** ([#13964](https://github.com/ollama/ollama/issues/13964)) — models ≥3B produce gibberish; 1B works with `OLLAMA_FLASH_ATTENTION=0`.
9. **macOS update loop** ([#19472](https://github.com/ollama/ollama/issues/19472)) — 0.40.13 app offers "Restart to update" to the same version and requests admin rights to change `/Applications/Ollama.app` ownership.

Additionally, `OLLAMA_MODELS` paths containing `[`, `*`, or `?` are silently treated as glob patterns, making models disappear ([#19548](https://github.com/ollama/ollama/pull/19548)); and a stale Linux manual-install doc ([#14159](https://github.com/ollama/ollama/issues/14159)) still has a ready PR waiting.

## 6. What This Means for Application Developers

- **Pin your versions and audit upgrades.** The 25–30% throughput regression report vs 0.40.1, combined with the fresh Vulkan crash on 0.40.14/0.40.15-rc2, argues for explicit version pinning and benchmark validation before rolling forward — especially on AMD iGPU or Vulkan-backed hosts.
- **Agent builders: tool calling is fragile at the edges.** Three separate open issues today touch tool-call reliability — Gemma4's dropped calls, Qwen2.5-Coder/Qwen3 native calling, and MLX Qwen3.8 tool calls only working with empty content ([#19353](https://github.com/ollama/ollama/issues/19353)). If you're building agents, validate tool-call round-trips per model/backend combination and don't assume OpenAI-compat behavior is uniform.
- **OpenAI/Anthropic compatibility surfaces need defensive coding.** Expect `null` where you'd expect `[]` from `/v1/models` (fixed in PR #19539), silent truncation from the Responses API when `truncation: "disabled"` (fix pending), and dropped thinking blocks in `/v1/messages`. Until fixes ship, validate response shapes and set explicit token limits on your side.
- **MLX users get concurrency, but watch stop sequences.** [#19197](https://github.com/ollama/ollama/pull/19197) unlocks parallel serving on Apple Silicon for lower TTFT, with a memory cost per active request — budget accordingly. In the meantime, if you rely on stop sequences, note that MLX currently ignores them ([#19551](https://github.com/ollama/ollama/issues/19551)); the fix PR is small and should land soon.
- **Environment hygiene matters.** If your `OLLAMA_MODELS` path contains glob metacharacters, your models are invisible and no error is raised ([#19548](https://github.com/ollama/ollama/pull/19548)). Worth a quick check in containerized or CI environments with unusual mount paths.

---
*Source: github.com/ollama/ollama — issues and PRs updated 2026-11-05 to 2026-11-06. No releases published in the reporting window.*

</details>

<details>
<summary><strong>LiteLLM</strong> — <a href="https://github.com/BerriAI/litellm">BerriAI/litellm</a></summary>

# LiteLLM Digest — 2026-11-06

## 1. Today's Highlights

LiteLLM shipped v1.108.1 (stable, cosign-signed) alongside a v1.107.0-rc.3 candidate built from the reviewed merge of #50129, signaling the project is still recovering from the Oct 21 incident with extra release-verification rigor. The bug queue remains dominated by **streaming usage-accounting losses** (three separate closed issues this cycle) and **Anthropic `/v1/messages` translation gaps** affecting Claude Code and the ChatGPT subscription backend. On the fix side, two PRs landed for guardrail post_call rewrites being silently dropped in streaming and config-path flows — a recurring correctness theme.

## 2. Releases & Breaking Changes

- **v1.108.1** (stable): Docker images now signed with cosign using the key introduced in commit `e82a3c6`. Verify before deployment if you pull images in CI. — [release](https://github.com/BerriAI/litellm/releases)
- **v1.107.0-rc.3**: built from `f9778e9`, the reviewed merge of #50129 into `rc/1.107.0`; published as `1.107.0rc3` on PyPI and `v1.107.0-rc.3` on Docker. Release notes reference the Oct 21 incident — expect tightened review gates on `rc/` branches. — [release](https://github.com/BerriAI/litellm/releases)
- **PR #39156** (open): new `LITELLM_DISABLE_DOTENV` env var to opt out of implicit `.env` loading at SDK import and proxy CLI startup. Behavior change for anyone relying on ambient dotenv discovery. — [PR #39156](https://github.com/BerriAI/litellm/pull/39156)

## 3. New Model & Hardware Support

- **PR #50222** (closed): Bedrock now defaults to native structured output (JSON schema) on Opus 5 and Opus 4.8 across all thinking modes, replacing the JSON-tool polyfill. Note: as of Nov 5, 2026, availability caveats apply per the PR body. — [PR #50222](https://github.com/BerriAI/litellm/pull/50222)
- **PR #39195** (open): adds SLNG as a TTS/STT provider — 21 voice models (13 TTS + 8 STT) targeting EU/AU regional infrastructure. — [PR #39195](https://github.com/BerriAI/litellm/pull/39195)
- **PR #38735** (open): `encoding_format="float"` no longer rejected for the `google` provider alias (embeddings) — extends the existing vertex_ai/gemini no-op path. — [PR #38735](https://github.com/BerriAI/litellm/pull/38735)

## 4. Performance & Optimization

- **PR #47096** (open issue): SAP GenAI Hub `deployment_url` is re-fetched on every LLM call via two blocking GETs (`/v2/lm/deployments`, `/v2/lm/configurations/{id}`), measured at **~870ms overhead** under load. No fix PR linked yet — a candidate for deployment-URL caching. — [Issue #47096](https://github.com/BerriAI/litellm/issues/47096)
- **PR #50310** (open): OTel now emits a closed span per failed retry/fallback attempt, carrying destination, error, and ERROR status — improves retry-path observability without duplicating spend logs. — [PR #50310](https://github.com/BerriAI/litellm/pull/50310)
- **PR #50305** (open): FIPS-mode OpenSSL check switched from MD5 probing to scrypt, fixing boot failures on Chainguard FIPS images with default config. — [PR #50305](https://github.com/BerriAI/litellm/pull/50305)

## 5. Stability & Regressions

Ranked by severity:

1. **Streaming usage loss — three related closed issues.** #14457 (client disconnect before final chunk → all usage lost), #36168 (final chunk with non-empty `choices` drops upstream `usage`, cached_tokens lost, billed at full input rate), and #47332 (stream cut after `finish_reason` but before `include_usage` logged as success with locally-counted usage). All closed this cycle; if you bill on LiteLLM-reported usage, audit affected windows. — [#14457](https://github.com/BerriAI/litellm/issues/14457) · [#36168](https://github.com/BerriAI/litellm/issues/36168) · [#47332](https://github.com/BerriAI/litellm/issues/47332)
2. **MCP tool failures drop `is_error`.** #49359 (open): `HTTPException`, `BlockedPiiEntityError`, `GuardrailRaisedException`, and `CallToolResult.isError=True` all lose the error flag before reaching Anthropic `tool_result` messages — agents will treat failed tools as successful. No fix PR linked. — [Issue #49359](https://github.com/BerriAI/litellm/issues/49359)
3. **Claude Code / Anthropic `/v1/messages` translation gaps.** #36917 (closed: `role:"system"` inside `messages[]` silently dropped), #47531 (open: mid-conversation `tool_addition` blocks dropped for non-Anthropic models), #49046 (open: `chatgpt/` provider drops encrypted reasoning so it is never replayed between tool calls). — [#36917](https://github.com/BerriAI/litellm/issues/36917) · [#47531](https://github.com/BerriAI/litellm/issues/47531) · [#49046](https://github.com/BerriAI/litellm/issues/49046)
4. **Guardrail post_call rewrites discarded — two fix PRs open.** #49966 (rewritten `tool_calls` thrown away) and #49905 (config-path guardrails skip post_call rewrites on buffered streams). Both from jesus-berri, not yet merged. — [PR #49966](https://github.com/BerriAI/litellm/pull/49966) · [PR #49905](https://github.com/BerriAI/litellm/pull/49905)
5. **MCP stateful session cap bucketed by API key.** #35383 (open): `_MAX_STATEFUL_SESSIONS_PER_OWNER = 100` keys on API key fingerprint, so shared keys collapse all users into one limit. No fix PR linked. — [Issue #35383](https://github.com/BerriAI/litellm/issues/35383)
6. **SSE keepalive masks upstream failures.** #49711 (open): the first `: ping` commits a 200 stream, so later upstream errors can only be written into the body — clients may see `data: {"error":...}` instead of a clean non-200. — [Issue #49711](https://github.com/BerriAI/litellm/issues/49711)
7. **Provider translation correctness (lower blast radius).** #26444 (closed: `temperature` still advertised for Claude Opus 4.7), #48145 (open: JSON-defined OpenAI-like providers lose tools when model not in catalog), #47924 (open: `reasoning_effort="none"` omits thinking config rather than disabling), #46866 (open: Azure `gpt5_series/` prefix leaked into request body), #47563 (closed: Vertex Claude Opus 5.5 sent deprecated `output_format`). — [#26444](https://github.com/BerriAI/litellm/issues/26444) · [#48145](https://github.com/BerriAI/litellm/issues/48145) · [#47924](https://github.com/BerriAI/litellm/issues/47924)
8. **Spend-row race on streamed responses.** PR #50308 (open, devin-ai bot): a zero-cost spend row could claim the same response ID before the creation row lands, and duplicate IDs are dropped — losing the user's original input in spend logs. — [PR #50308](https://github.com/BerriAI/litellm/pull/50308)

## 6. What This Means for Application Developers

- **Don't trust usage numbers from interrupted streams without verification.** The three closed streaming-usage issues share a pattern: if the stream ends abnormally, LiteLLM either drops usage entirely or falls back to locally-counted tokens at full input rate, losing cached-token discounts. If you bill or quota on these numbers, add reconciliation against provider-side usage reports, and avoid early client disconnects in latency-sensitive paths.
- **Agent frameworks on MCP should not rely on `is_error` propagation yet.** Until #49359 is fixed, wrap MCP tool calls in your own error detection rather than depending on the tool_result flag — a blocked or failed tool currently looks like a success to the model.
- **Claude Code and ChatGPT-subscription backends through `/v1/messages` are the highest-risk translation surface right now.** If you route Anthropic-format clients to non-Anthropic models, validate that mid-conversation tool additions and encrypted reasoning survive the proxy hop; the open issues suggest they do not.
- **Guardrail authors: test streaming paths explicitly.** Two separate open PRs fix post_call rewrites being dropped — one on the config path, one for buffered streams. Until merged, a guardrail that rewrites tool-call arguments (e.g., secret masking in shell commands) may be a no-op on streaming responses.
- **Upgrade to v1.108.1 with cosign verification.** Given the Oct 21 incident referenced in the rc.3 notes and the new signing key in `e82a3c6`, pin images by digest and verify signatures in CI rather than trusting tags.

</details>

<details>
<summary><strong>Unsloth</strong> — <a href="https://github.com/unslothai/unsloth">unslothai/unsloth</a></summary>

# Unsloth Digest — 2026-11-06

## Today's Highlights
No new releases landed in the last 24h, but the project is in a heavy stabilization cycle for **Unsloth Studio/Desktop** — GPU capability plumbing (NVFP4, LTX-2.5, MiniMax-H3), multi-LoRA batching, and RAG ingestion are all being hardened. A significant batch of community bug reports converges on **UI performance regressions in long chats**, **Windows download resumption failures**, and **GPU fallback issues on image generation**. Upstream, `transformers 5.23` renamed gradient checkpointing to activation checkpointing, which impacts 4 call sites in Unsloth.

---

## Releases & Breaking Changes
**No new tagged releases.** However, one upstream forward-compatibility item worth flagging:

- **`transformers 5.23` renames gradient checkpointing → activation checkpointing** ([#16667](https://github.com/unslothai/unsloth/issues/16667)). Old names remain as aliases until v6, but `Trainer` now reads only the new names, changing behavior in 4 Unsloth spots (audited at commit `f5adb36642`). Anyone pinning `transformers>=5.23` should expect training-path behavioral drift until patched.

---

## New Model & Hardware Support
In-flight PRs adding or refining hardware paths:

- **Integrated GPU / memory-mapped oversized GGUF loads** ([#16857](https://github.com/unslothai/unsloth/pull/16857)) — enables loading a 217 GiB MoE GGUF (`DeepSeek-V4.1-Flash-1017` `UD-IQ1_S`) on integrated GPUs by memory-mapping weights and reading lookup tables from disk. Currently fails with `unable to allocate CUDA_Host` on RTX Spark N1X.
- **NVFP4 diffusion on sm_100-class cards (B200/GB200/B300)** ([#16759](https://github.com/unslothai/unsloth/pull/16759)) — defaults to a W4A16 step-protect schedule (`auto`) where first/last steps dequantize to transient bf16 for a dense GEMM.
- **cuDNN major-version detection for sd.cpp** ([#16789](https://github.com/unslothai/unsloth/pull/16789)) — reads `DT_NEEDED` to correctly pick cu13 vs cu12 cuDNN runtimes for CUDA 13 prebuilts.
- **Cosmos3 256p + NVIDIA frame ranges** ([#16737](https://github.com/unslothai/unsloth/pull/16737)), **LTX-2.5 streamed denoiser residency** ([#16845](https://github.com/unslothai/unsloth/pull/16845)), **LTX-2.5 Gemma 4 encoder GPU streaming** ([#16804](https://github.com/unslothai/unsloth/pull/16804)).

---

## Performance & Optimization
Concrete wins landed or in review:

- **Long-chat panel/scrolling lag on Linux (WebKitGTK)** ([#16854](https://github.com/unslothai/unsloth/pull/16854)) — offscreen message bodies are parked behind measured placeholders while preserving React state; targeted at threads with 100+ messages.
- **RAG ingestion batching** ([#16715](https://github.com/unslothai/unsloth/issues/16715)) — currently **~99 ms/chunk** on the batch-of-1 path vs **2.07 ms batched** (~48× gap). `_embed_all` is called per-document, so small-file corpora never hit the batched path.
- **Diffusion LoRA training** ([#16763](https://github.com/unslothai/unsloth/pull/16763)) — removes per-micro-step host syncs, one decode per cached image, streamed int8 base load; bit-identical outputs claimed.
- **STT & video status endpoints moved off the event loop** ([#16783](https://github.com/unslothai/unsloth/pull/16783), [#16792](https://github.com/unslothai/unsloth/pull/16792)) — previously blocked all async handlers during first call (14k-line video module import).
- **LTX-2.5 Gemma 4 encoder** ([#16804](https://github.com/unslothai/unsloth/pull/16804)) — CPU encode path was **165–233 s per prompt** on a 24 GB L4; fixed via GPU streaming.

---

## Stability & Regressions
Ranked by severity:

**High**
- **Windows model downloads never resume** ([#16810](https://github.com/unslothai/unsloth/issues/16810)) — paused/interrupted/crashed downloads restart from zero across "any version in the last 2 months." Fix PR open: [#16828](https://github.com/unslothai/unsloth/pull/16828).
- **RAG indexing permanently fails if embedding model download is in-flight** ([#16714](https://github.com/unslothai/unsloth/issues/16714)) — every file errors with `EmbeddingModelDownloadRequiredError`; nothing queues.
- **Image generation falls back to CPU/RAM on Win11 + RTX 3060** ([#16803](https://github.com/unslothai/unsloth/issues/16803)) — text gen correctly uses GPU, image gen does not; not reproducible on M1 Pro.
- **MiniMax-H3 OOM-killed on 24 GB L4 / 53 GiB host at 16 GiB budget** ([#16849](https://github.com/unslothai/unsloth/pull/16849)) — kernel OOM killer at 6 s into first request, 2/2 runs.
- **Studio crash on Win11 + RTX 4060 Ti, v0.1.915-beta** ([#16816](https://github.com/unslothai/unsloth/issues/16816)).

**Medium**
- **Long-conversation UI lag regression (web + desktop)** ([#16603](https://github.com/unslothai/unsloth/issues/16603)).
- **`search_conversation` tool disappears (3rd occurrence)** ([#16706](https://github.com/unslothai/unsloth/issues/16706)).
- **Gemma-4-thinking chat template strips reasoning tokens** ([#16699](https://github.com/unslothai/unsloth/issues/16699)) — training-correctness risk for reasoning finetunes.
- **Multi-LoRA batch pagination races** — cursor invalidation during list requests ([#16719](https://github.com/unslothai/unsloth/pull/16719)) and out-of-order batching skipping jobs ([#16720](https://github.com/unslothai/unsloth/issues/16720)); follow-ups to [#16633](https://github.com/unslothai/unsloth/pull/16633).
- **Fine-tuning job list drops cancelled queued job** ([#16632](https://github.com/unslothai/unsloth/issues/16632), **CLOSED**).
- **S3 audio JSONL prep aborts on U+2028 line separators** ([#16721](https://github.com/unslothai/unsloth/issues/16721)).
- **FP8 LoRA test failing against current unsloth_zoo** ([#16855](https://github.com/unslothai/unsloth/pull/16855)) — `assert not run(owner)` fails on 6 parametrized cases.
- **Pipeline-parallel MoE router aux loss** now refused (rather than silently wrong) when batch splits into multiple micro-batches ([#16822](https://github.com/unslothai/unsloth/pull/16822)).

**Low**
- AppImage/Homebrew installs ([#16605](https://github.com/unslothai/unsloth/issues/16605), [#16672](https://github.com/unslothai/unsloth/issues/16672)), glass theme inconsistencies ([#16770](https://github.com/unslothai/unsloth/issues/16770), [#16820](https://github.com/unslothai/unsloth/issues/16820)), background image hidden in active chats ([#16736](https://github.com/unslothai/unsloth/issues/16736)), Cosmos guardrail error message ([#16742](https://github.com/unslothai/unsloth/pull/16742)).

---

## What This Means for Application Developers

- **If you run Studio/Desktop on Windows:** hold off on large-model downloads until [#16828](https://github.com/unslothai/unsloth/pull/16828) lands — you're one network blip away from restarting a 200 GiB fetch. This is the single highest-impact operational bug this week.
- **If you're building RAG pipelines on Unsloth:** expect indexing to silently fail until your embedding model is fully downloaded ([#16714](https://github.com/unslothai/unsloth/issues/16714)), and expect poor throughput on small-document corpora until [#16715](https://github.com/unslothai/unsloth/issues/16715) is addressed — batch at the corpus level yourself as a workaround.
- **If you're training reasoning models (Gemma-4-thinking):** audit your chat template pipeline — [#16699](https://github.com/unslothai/unsloth/issues/16699) means reasoning traces may be stripped before training.
- **If you pin `transformers>=5.23`:** plan for the gradient→activation checkpointing rename ([#16667](https://github.com/unslothai/unsloth/issues/16667)); validate checkpointing behavior in long-context finetunes rather than assuming the alias preserves semantics.
- **If you use the OpenAI-compatible fine-tuning API:** multi-LoRA batching has cursor-stability races ([#16719](https://github.com/unslothai/unsloth/pull/16719), [#16720](https://github.com/unslothai/unsloth/issues/16720)). Avoid paginating job lists while jobs are being scheduled/cancelled; re-list instead of using `after=` cursors.
- **On the positive side:** GPU-side work for video diffusion (LTX-2.5, MiniMax-H3, Cosmos3) and NVFP4 on Blackwell is advancing fast — if you're on L4/B200-class hardware, watch these PRs for material latency and OOM improvements.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*