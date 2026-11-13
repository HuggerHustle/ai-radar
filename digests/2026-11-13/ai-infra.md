# AI Infrastructure Digest 2026-11-13

> Generated: 2026-11-13 01:46 UTC | Projects covered: 6

- [vLLM](https://github.com/vllm-project/vllm)
- [SGLang](https://github.com/sgl-project/sglang)
- [llama.cpp](https://github.com/ggml-org/llama.cpp)
- [Ollama](https://github.com/ollama/ollama)
- [LiteLLM](https://github.com/BerriAI/litellm)
- [Unsloth](https://github.com/unslothai/unsloth)

---

## Cross-Project Comparison

# Cross-Project Comparison Report — AI Infrastructure Digest
**Date: 2026-11-13**

---

## 1. Ecosystem Overview

The ecosystem is in a **maintenance-and-hardening phase** — no project shipped a new release in the last 24 hours, yet combined issue/PR flow exceeds 1,000 items across the five projects. Effort is concentrating on three axes: (a) **quantization and KV-cache kernel work** for next-gen accelerators (Blackwell SM120, AMD gfx950/MI355X, Ascend NPU), (b) **Rust rewrites of hot-path state** (SGLang server, LiteLLM router/cache), and (c) **speculative-decoding correctness** — which produced silent-data-corruption and acceptance-rate regressions in nearly every engine. Simultaneously, **security and multi-tenant isolation issues** (SSRF in llama.cpp, cross-client token leak in SGLang, cache leakage in llama.cpp/Ollama) emerged as a recurring theme, signaling that self-hosted inference is now treated as production-critical infrastructure rather than experimentation.

---

## 2. Activity Comparison

| Project | Layer | Issues Touched (24h) | PRs Touched (24h) | Release Status (24h) | Breaking / Migration Signals |
|---|---|---|---|---|---|
| **vLLM** | Serving engine | 155 | 500 | None | Marlin→Humming RFC; no deprecations today |
| **SGLang** | Serving engine | n/a (208-comment flaky tracker) | n/a (12 Rust PRs landed) | None | 1.0 roadmap: silent config fallbacks → explicit errors |
| **llama.cpp** | Local runtime | n/a (22-comment top issues) | n/a (5 builds b12321–b12340) | **5 builds shipped** (b12321–b12340) | SSRF fix; `llama_batch` → `llama_batch_ext` migration incoming |
| **Ollama** | Local runtime / runner | n/a (top issue 33 comments) | ~10 (2× mlxrunner, pull fixes) | None | Runner variant selection exposed (`mlx`/`gguf`) |
| **LiteLLM** | Gateway / proxy | Dominated by cost-tracking bugs | ~15 (Rust migration wave) | **v1.108.7 LTS, v1.109.1, v1.110.0-rc.2** | Malformed `fallbacks` now HTTP 500 (Rust core) |
| **Unsloth** | Fine-tuning / Studio | 23 | 195 (top 20 surfaced) | None | `--load-mode none` overridden by forced mmap (regression) |

**Reading the table:** vLLM and Unsloth carry the highest raw churn (500 and 195 PRs respectively), consistent with large contributor bases. llama.cpp is the only project shipping continuous builds — it releases per-commit, so "no release" never applies. SGLang and LiteLLM are mid-migration; LiteLLM is the only project shipping tagged releases today (LTS + RC), reflecting its role as a fast-moving gateway where patch cadence matters more than kernel work.

---

## 3. Model Support Race

| Model / Architecture | vLLM | SGLang | llama.cpp | Ollama | Unsloth | LiteLLM |
|---|---|---|---|---|---|---|
| **Qwen3.8-Flash-Next** (GDN + QSA + MXFP4 MoE) | ROCm tracker (#59575) | ROCm FP8 GDN packing (#50024) | — | — | UD3.1 MTP mismatch (#17402) | — |
| **Qwen3.8-2.4T-A95B** | MI355X tracker (#57149) | — | — | — | — | — |
| **DeepSeek-V4.1-Flash** | V4 garbled (#43416) | NPU W8A8 + DSpark (#50205); MI355X tracker (#49327) | — | — | Engram precision (#17641) | — |
| **GLM-5.2 / 5.3** | `glm_moe_dsa` perf (#57406) | NPU FP8 KV (#50096); MXFP4 DSA fix (#48773) | — | — | — | — |
| **Nemotron 3.5 ASR / Lightning** | ASR request only (#47455) | — | — | `/save` fails (#17735) | — | — |
| **Gemma 4** | — | — | Chat template refactor (b12323) | — | UD3.1 requested (#17573) | — |
| **HunyuanVL / Zaya1 / GigaChat 3.5** | — | — | All in review | — | — | — |
| **Frontier cloud models** | — | — | — | mimo-v2.6-pro, minimax-m3.1 | — | Vertex Deep Research (#51517) |

**Who's ahead:**
- **vLLM** leads on *breadth of declared hardware targets* (Hopper, Blackwell, MI355X, XPU) and is the only project with an architecture-level kernel replacement RFC (Marlin→Humming).
- **SGLang** leads on *non-NVIDIA feature parity* — it is the only project with first-class, merged-adjacent NPU (Ascend A3/950) and MLU work for DeepSeek-V4.1 and GLM-5.2, plus active ROCm gfx950 bring-up.
- **llama.cpp** leads on *local/edge model breadth* — HunyuanVL, Zaya1, GigaChat 3.5, SpacemiT, and OpenVINO NPU expansion all landed or are in review today, far outpacing the servers on novel architectures.
- **Unsloth** is the only project addressing *fine-tuning-side model fidelity* (Engram table precision for Qwen3.8/DeepSeek-V4.1 GGUFs) and AMD NPU Q4NX conversion.

---

## 4. Performance Frontier

Optimization work is concentrated in five clusters:

| Cluster | vLLM | SGLang | llama.cpp | Ollama | Unsloth |
|---|---|---|---|---|---|
| **KV cache** | 3-bit KV RFC (#59773); `reshape_and_cache` coalescing (#61417); KV promotion redesign (#66782) | HiCache+Mooncake under pressure (#47481); zero-copy read verification (#50130) | Fused KV dequant in FA (#31802) | Context-shift amplitude fix (#19680) | Prompt/KV cache retention (#17632) |
| **Batching / scheduling** | Batch invariance (#27433, 106 comments); mixed prefill-decode 6× slowdown (#44806) | SM90 decode +33–45% regression (#49336) | Layer-first prefill (~2×, #32082, closed); split-graph prefetch (b12328) | — | GRPO chunked optimizations (#5291) |
| **Quantization** | Marlin→Humming (INT4/8, FP8, MXFP4/6/8, NVFP4) | MXFP4 DSA fix (#48773); FP8 GDN packing | NVFP4 MMQ epilogue (b12329) | — | Engram precision, Q4NX→AMD NPU |
| **Distributed serving** | PD-disaggregation KV connectors (#66132, #61893, #42405) | MNNVL PD fabric mem pool (#47767); router migration (#50176) | Split-graph prefetch narrowing | — | — |
| **Kernels** | TPA-GQA on FlashAttention (#42674); XPU Triton greedy_argmax | topk-v2 split-launch; fused RoPE; aarch64 SHA-256 | Fused KV dequant (open); SpacemiT HP dispatch | Metal history reuse (#19677, #19678) | FLUX.3 attn kernel; SageAttention H3 (#17639) |

**Key signal:** The *quantization frontier has moved to NVFP4/MXFP4/MXFP8* across NVIDIA Blackwell and AMD gfx950, with Marlin (SM80-era) now formally slated for replacement. **Determinism** (vLLM batch invariance, 106 comments) is the second-strongest theme — relevant to RL rollouts, rerankers, and any logprob-dependent pipeline.

---

## 5. Layer Positioning

```
┌────────────────────────────────────────────────────────────────┐
│  GATEWAY          LiteLLM — routing, budgets, cost tracking,   │
│                   MCP, cross-provider translation              │
├────────────────────────────────────────────────────────────────┤
│  SERVING ENGINE   vLLM (breadth + datacenter perf)            │
│                   SGLang (stability + non-NVIDIA parity)       │
├────────────────────────────────────────────────────────────────┤
│  LOCAL RUNTIME    llama.cpp (model/backend breadth, edge)      │
│                   Ollama (consumer UX, runner abstraction)     │
├────────────────────────────────────────────────────────────────┤
│  FINE-TUNING      Unsloth (Studio, GRPO/DPO, GGUF, AMD NPU)   │
└────────────────────────────────────────────────────────────────┘
```

- **Serving engines (vLLM, SGLang)** compete on throughput, hardware coverage, and disaggregation. vLLM is ahead on NVIDIA datacenter performance and PD-disaggregation maturity; SGLang is betting its 1.0 on *stability* and is the clear leader on non-NVIDIA parity (NPU, MLU, ROCm, Apple).
- **Local runtimes (llama.cpp, Ollama)** differ sharply: llama.cpp is a low-level library+server with aggressive backend breadth and per-commit releases; Ollama is a *runner abstraction* (now explicitly exposing `mlx` vs `gguf`) targeting developer ergonomics, with cloud-model integration that introduces its own failure modes (mimo-v2.6 tool flooding, minimax-m3.1 crashes).
- **Gateway (LiteLLM)** is orthogonal — its risk surface is *correctness of accounting and translation*, not kernels. The Rust migration is its dominant internal project.
- **Fine-tuning (Unsloth)** is the only project with training-stage concerns; its Studio issues (shell sandboxing, pip escape, context truncation) show it is converging on *agent-adjacent developer tooling* rather than pure library work.

---

## 6. Trend Signals

**1. Speculative decoding is the highest-risk subsystem ecosystem-wide.**
- vLLM: `prompt_logprobs` silently corrupted under MTP (#53488, closed).
- SGLang: NaN logits latched after padded CUDA-graph batches (#49881).
- llama.cpp: crashes on Gemma 4 + MTP + tensor split across CUDA/Vulkan/SYCL (#24440, #29418, #29419).
- Unsloth: MTP head / UD3.1 mismatch drops acceptance 74% → 56–66% (#17402).
**Watch:** pin known-good builds and validate acceptance rate and logprobs at production temperature before upgrading any engine.

**2. Multi-tenant isolation and cache leakage are now a first-class concern.**
- SGLang: cross-client token leak via `rid` merging (#49903).
- llama.cpp: slot erase doesn't clear `--cache-ram` (#32048); KV reused across LoRA changes (#30366).
- Ollama: cloud tool-call flooding; LiteLLM: MCP OAuth and `tools/list` stalls.
**Watch:** if you serve untrusted clients, isolate tenants at the process level and disable shared prompt caches until these land.

**3. Cost and telemetry correctness in gateways is materially unreliable.**
- LiteLLM: 1M× overbilling (#48398), budget bypass (#34238), untagged counters (#35538), silent SpendLogs gaps (#49567, #34747), Anthropic image tokens undercounted 32× (#39910).
**Watch:** reconcile LiteLLM cost data against provider invoices; do not treat budgets as hard caps until the Redis counter path is fixed.

**4. Quantization is shifting to FP4-family formats (NVFP4/MXFP4/MXFP8) across every layer.**
- Evidence: Marlin→Humming RFC (vLLM), MI355X FP8/MXFP4 trackers (both engines), NVFP4 MMQ epilogue (llama.cpp b12329), FP8 KV on Ascend (SGLang).
**Watch:** your FP8 checkpoints may need re-quantization to FP4 variants for next-gen accelerators; verify startup-time kernel recipes, especially on SM120 where vLLM 0.24.0 aborts.

**5. Non-NVIDIA parity is closing rapidly.**
- Today alone: Ascend A3/950 (W8A8, FP8 KV, Mooncake), Cambricon MLU fused ops, Apple Metal MPS SiLU, ROCm MI355X/gfx942, Intel XPU, OpenVINO Lunar Lake NPU, AMD NPU Q4NX.
**Watch:** if you're porting off NVIDIA, SGLang and Unsloth are the fastest-moving option sets; vLLM's non-NVIDIA work is real but tracker-heavy (bring-up in progress rather than shipped parity).

**6. Rust/Python boundary is being redrawn in gateway and server layers.**
- LiteLLM is migrating router, cache, Redis batch, health, session pins, and usage counters to native Rust (PRs #50870, #50357, #50862, #51383, #51384).
- SGLang is migrating its non-GPU server stack to Rust (RFC #23206, follow-up #49055, 12 PRs landed).
**Watch:** expect lower tail latency and less Python GC pressure in both — but also expect **malformed-input behavior to become stricter** (LiteLLM #51396: HTTP 500 instead of tolerance).

**7. Silent-correctness failures outnumber crashes.**
- Corruption without error: vLLM `prompt_logprobs` (#53488), LiteLLM image token counts (#39910), llama.cpp rsLoRA scaling (#31879), Ollama over-length truncation (#17623), SGLang truncated tool args → `{}` (#50131), vLLM TDX/V2 garbage output (#57224).
**Watch:** add golden-output regression tests for tool-calling, logprobs, and multimodal inputs — liveness metrics won't surface most of these.

---

**Bottom line for technical decision-makers:** today is a hardening day. If you are on SGLang v0.5.23, pin to v0.5.22. If you are on vLLM 0.24.0 with FP8 on SM120, downgrade to 0.23.x. If you run llama-server behind any proxy, upgrade to **b12340** immediately for the SSRF fix. If you rely on LiteLLM for cost accountability, audit your numbers before trusting them. Expect the industry's next step-change to center on **FP4 quantized KV and PD-disaggregation**, with non-NVIDIA parity closing within one to two release cycles.

---

## Per-Project Reports

<details>
<summary><strong>vLLM</strong> — <a href="https://github.com/vllm-project/vllm">vllm-project/vllm</a></summary>

# vLLM Digest — 2026-11-13

## 1. Today's Highlights

No new releases landed in the last 24h, but issue/PR flow remains heavy (155 issues, 500 PRs touched). The most significant activity clusters around **AMD ROCm/MI355X performance trackers** for next-gen Qwen models, a **proposal to replace Marlin with Humming** across NVIDIA architectures, and a cluster of **Blackwell SM120 FP8/DeepGEMM startup regressions** that remain open. On the correctness side, several long-running bug reports (KV offload lifecycle, speculative-decoding logprob corruption) were closed, while KV-connector and PD-disaggregation work continued to mature.

---

## 2. Releases & Breaking Changes

**None.** No releases in the last 24h. No API/config deprecations or migration notes were introduced today.

---

## 3. New Model & Hardware Support

- **[Tracking] Replace Marlin with Humming across NVIDIA architectures** — [#65560](https://github.com/vllm-project/vllm/issues/65560). Humming is proposed as the successor to the SM80-era Marlin kernel, covering INT4/INT8 GPTQ/AWQ, FP8, MXFP8, MXFP4, NVFP4, MXFP6, and INT8/FP8 activations for dense and MoE layers, with architecture-specific paths for Hopper and Blackwell.
- **NVIDIA Nemotron 3.5 ASR Streaming (0.6B)** — feature request [#47455](https://github.com/vllm-project/vllm/issues/47455). Multilingual streaming ASR model under OpenMDW-1.1; no implementation yet.
- **ROCm/MI355X optimization trackers for next-gen Qwen** — [Qwen3.8-2.4T-A95B #57149](https://github.com/vllm-project/vllm/issues/57149) and [Qwen3.8-Flash-Next #59575](https://github.com/vllm-project/vllm/issues/59575) (GatedDeltaNet + QuerySparse Attention + MXFP4 MoE). These define the gfx950 kernel bring-up plan.
- **Octave KV — native 3-bit KV cache for AMD GPUs** — RFC [#59773](https://github.com/vllm-project/vllm/issues/59773), targeting Qwen3.8-27B GPTQ W4A16 on 4× RX 7900 XTX.
- **GLM-5.3 performance work** continues on the `glm_moe_dsa` base — [#57406](https://github.com/vllm-project/vllm/issues/57406).
- **XPU (Intel)**: Triton `greedy_argmax` enabled for spec decoding draft sampling — PR [#67196](https://github.com/vllm-project/vllm/pull/67196); dense GEMM path for single-adapter LoRA prefill — PR [#66752](https://github.com/vllm-project/vllm/pull/66752).

---

## 4. Performance & Optimization

- **Batch invariance / determinism** remains the hottest performance thread: [#27433](https://github.com/vllm-project/vllm/issues/27433) has 106 comments and is tracking follow-up work beyond the initial batch-invariant implementation. Relevant for teams requiring reproducible outputs.
- **`reshape_and_cache` kernel coalescing** — PR [#61417](https://github.com/vllm-project/vllm/pull/61417) restructures the paged KV writer to take a full KV block at a time instead of one block per token, improving store coalescing for `ROCM_ATTN`.
- **ROCm spec decode (FLy)** — PR [#66593](https://github.com/vllm-project/vllm/pull/66593) normalizes the entropy gate to `[0,1]` semantics and adds a cost overlay with synthetic acceptance.
- **Per-layer parallelism policy + TPA-GQA on FlashAttention** — PR [#42674](https://github.com/vllm-project/vllm/pull/42674) (closed/stale) realized RFC #42659 framework-side, decoupling the policy from attention specifics.
- **Spec-decode multi-GPU drafting** — 3-part series (#63333/#63334/#63335) runs own-KV EAGLE3/MTP drafters in a standalone GPU process with bounded CUDA IPC transport for target features.
- Reported gap worth watching: **mixed prefill-decode steps run ~6× slower than decode-only** on Qwen3.5 397B NVFP4 DEP8 on 8×B200 — [#44806](https://github.com/vllm-project/vllm/issues/44806).

---

## 5. Stability & Regressions

Ranked by severity:

1. **Blackwell SM120 DeepGEMM startup abort (FP8, block-scaled W8A8)** — [#47130](https://github.com/vllm-project/vllm/issues/47130) and [#47436](https://github.com/vllm-project/vllm/issues/47436). v0.24.0 fails during kernel warmup with "Unknown recipe" / "Unknown SF transformation" assertions. Confirmed regression vs 0.23.0. **No fix PR linked** — avoid v0.24.0 on RTX PRO 6000 / sm_120 for FP8 checkpoints.
2. **KV offload sleep/wake engine death** — [#45268](https://github.com/vllm-project/vllm/issues/45268) (now CLOSED). `--kv-offloading-backend native` + `--enable-sleep-mode` crashed after the first L1 sleep/wake cycle; resolved.
3. **`prompt_logprobs` silently corrupted under MTP spec decode** (Qwen3.5 family, chunked prefill) — [#53488](https://github.com/vllm-project/vllm/issues/53488) — CLOSED. Silent data corruption was the highest-risk class here.
4. **DeepSeek V4 Flash garbled output** — [#43416](https://github.com/vllm-project/vllm/issues/43416), still open across multiple builds.
5. **ROCm gfx942 memory access fault** crossing 2048 tokens (DeepSeek V4 + sparse attn indexer + FP8 KV, MI325X TP=4) — [#48266](https://github.com/vllm-project/vllm/issues/48266).
6. **EngineCore assertion on aborted KV transfers** — [#43226](https://github.com/vllm-project/vllm/issues/43226). Async KV connectors report completed transfers for freed requests; assert in `_update_from_kv_xfer_finished` crashes the engine.
7. **Scheduler stall under load** — [#53130](https://github.com/vllm-project/vllm/issues/53130). Deferred backlog grows while the engine reports healthy — a monitoring/observability trap.
8. **Confidential Computing (TDX) + V2 model runner** silently produces garbage output due to stale UVA views of pinned host memory — [#57224](https://github.com/vllm-project/vllm/issues/57224) — CLOSED; workaround was `VLLM_USE_V2_MODEL_RUNNER=0`.
9. **Block-scaled FP8 / compressed-tensors W8A8 crash on load** on SM120 — same family as #47130.
10. **Qwen-VL FP8 E5M2 KV cache silent corruption** — [#41343](https://github.com/vllm-project/vllm/issues/41343), still open.

KV-connector fixes are progressing: [#66132](https://github.com/vllm-project/vllm/pull/66132) (reconcile hits when draft attention lags), [#61893](https://github.com/vllm-project/vllm/pull/61893) (per-connector `enable_kv_events` switch), [#42405](https://github.com/vllm-project/vllm/pull/42405) (allow DMA-only connectors with `expandable_segments:True`). The KV promotion lifecycle design is being reworked in RFC [#66782](https://github.com/vllm-project/vllm/issues/66782).

---

## 6. What This Means for Application Developers

- **If you're on Blackwell (SM120) with FP8 or W8A8 quantized checkpoints, hold at 0.23.x.** The 0.24.0 DeepGEMM failures are startup-time aborts, so they're loud rather than silent — but they'll take your deployment offline.
- **Speculative decoding requires validation for logprob-sensitive workloads.** The recently closed #53488 confirms that `prompt_logprobs` could be silently wrong under MTP. If you're scoring or filtering with logprobs (rerankers, constrained sampling, RL rollouts), pin a known-good build and spot-check.
- **KV offload + sleep mode is now viable** following the #45268 fix — relevant if you serve many models and cycle them in and out of GPU memory.
- **Scheduler health metrics may not reflect real load.** #53130 shows the engine can report healthy while deferred requests pile up. Add queue-depth and admissions-per-second to your own dashboards rather than relying on liveness alone.
- **PD-disaggregation and prefix-caching users** should track the KV promotion/connector RFCs (#66782, #61886, #48633). The current descriptors ("stale budgets, over-commit, lifetime bans after failed promotions") suggest edge cases that can degrade cache hit rates in production.
- **ROCm operators with MI300/MI325** should follow the MI355X trackers — the gfx950 work is upstreaming stacked PRs to main, so future ROCm releases will assume them.
- **Determinism (batch invariance)** is nearly complete; if you've been running custom batching to get reproducible outputs, you can expect to relax that soon.

No releases or breaking changes today — a maintenance-focused day with continued hardening of KV connectors, spec decode, and quantization backends.

</details>

<details>
<summary><strong>SGLang</strong> — <a href="https://github.com/sgl-project/sglang">sgl-project/sglang</a></summary>

# SGLang Digest — 2026-11-13

## Today's Highlights
SGLang 1.0 is officially on the roadmap as a **stability-focused release** (#50045), signaling that the project is prioritizing hardening and compatibility over new features for the next major version. At the same time, the Rust server migration continues to gain momentum with multiple follow-up performance trackers (#23206, #49055), and a **33–45% decode regression on SM90** between v0.5.22 and v0.5.23 (#49336) is the most urgent perf issue to watch. CI remains noisy — the flaky-test tracker (#42752) has accumulated 208 comments and the long-running CI tracker (#17050) reports **3 broken, 9 flaky** tests as of today.

## Releases & Breaking Changes
- **No new releases in the last 24h.**
- **[roadmap] SGLang 1.0 Release Tracker** — #50045: A stability release. Upgrading from 0.5.x **may require changes**; silent configuration changes are being replaced with explicit errors. A compatibility policy for the 1.x series is being defined. Worth tracking if you pin SGLang versions in production.
  <https://github.com/sgl-project/sglang/issues/50045>
- **Router behavior change (CI):** PD disaggregation tests are switching from `sgl-model-gateway` to `sgl-router` (#50176). This previews the routing layer direction for downstream deployments.
  <https://github.com/sgl-project/sglang/pull/50176>

## New Model & Hardware Support
- **[NPU] DeepSeek-V4.1 Flash on Ascend A3** — W8A8 inference plus DSpark speculative decoding via `sgl-kernel-npu` (#50205).
  <https://github.com/sgl-project/sglang/pull/50205>
- **[NPU] FP8 KV for DSA prefill context parallelism** — GLM-5.2 on Ascend 950 can now store DSA KV in packed FP8 for both Top-K indexing and attention (#50096).
  <https://github.com/sgl-project/sglang/pull/50096>
- **[NPU] Multimodal global cache on Ascend** — `--enable-mm-global-cache` (Mooncake) no longer assumes CUDA (#41567).
  <https://github.com/sgl-project/sglang/pull/41567>
- **[MLU] Fused operator support** — SiLU/SiTU/GELU, LayerNorm, RMSNorm variants, compact-cache RoPE on Cambricon MLU (#49228).
  <https://github.com/sgl-project/sglang/pull/49228>
- **[Apple Silicon] Metal SiLU-and-mul for MPS path** (#50160) and Unlimited-OCR v2 KV pool sizing (#48932).
  <https://github.com/sgl-project/sglang/pull/50160> · <https://github.com/sgl-project/sglang/pull/48932>
- **[ROCm] Qwen3.8-Flash-Next FP8 GDN input projection packing** on MI355X (#50024).
  <https://github.com/sgl-project/sglang/pull/50024>
- **[MNNVL PD] Native CUDA VMM fabric custom mem pool** for GB200/GB300 NVL72 disaggregation (#47767).
  <https://github.com/sgl-project/sglang/pull/47767>

## Performance & Optimization
- **[Regression, urgent] SM90 decode +33–45% per-step** at concurrency 12 (8K–64K context) going v0.5.22 → v0.5.23 on 8× H20 with DeepSeek-V4.1-Flash + DSPARK. `use_deep_select_decode` also costs acceptance on Hopper (#49336).
  <https://github.com/sgl-project/sglang/issues/49336>
- **Cache hit-rate dip under L2/L3 pressure** with HiCache + Mooncake: reproducible drop from 87.4% during multi-turn benchmark (#47481). Cache behavior under pressure is a known soft spot.
  <https://github.com/sgl-project/sglang/issues/47481>
- **Rust server stack follow-ups** (#49055) and the broader **non-GPU process Rust migration RFC** (#23206) continue — 12 PRs landed ending at #48815.
  <https://github.com/sgl-project/sglang/issues/49055> · <https://github.com/sgl-project/sglang/issues/23206>
- **MI355X (gfx950) DeepSeek-V4.1-Flash optimization tracker** (#49327) — TP4, text+image, with/without DSpark.
  <https://github.com/sgl-project/sglang/issues/49327>
- **[AMD] topk-v2 split-launch fix** — resolves illegal memory access in GLM-5.2 MXFP4 DSA draft-extend on MI355X TP8 (#48773).
  <https://github.com/sgl-project/sglang/pull/48773>
- **[NPU] DSpark multi-stream draft layers** (#49294) and **fused RoPE for SenseNova-U1.5** (#40856).
  <https://github.com/sgl-project/sglang/pull/49294> · <https://github.com/sgl-project/sglang/pull/40856>
- **[Perf] Rust server aarch64 SHA-256 hardware instructions** (#50204) — enables `sha2/asm` feature.
  <https://github.com/sgl-project/sglang/pull/50204>
- **Joint Full/SWA eviction on Rust tree core** (#49992) — extends `joint_lru` eviction policy to the Rust radix tree.
  <https://github.com/sgl-project/sglang/pull/49992>
- **[PD] Configurable top-logprobs metadata width** — currently hardcoded to 128 entries per row, breaking requests with larger `top_logprobs` (#49686).
  <https://github.com/sgl-project/sglang/pull/49686>

## Stability & Regressions
Ranked by severity:

1. **SM90 decode regression v0.5.22 → v0.5.23** (+33–45% per-step, c=12). No fix PR yet. (#49336) — *avoid v0.5.23 on H20/Hopper for now if you rely on spec decoding.*
2. **Cross-client token leak in multi-tokenizer mode** via duplicate `rid` state merging (#49903) — security-relevant, affects multi-tenant serving. No fix PR.
3. **Full prefill CUDA graph capture fails for hybrid linear attention models** (GDN/KDA) — `IndexError` in `HybridLinearAttnBackend._replay_metadata` (#48593).
4. **NaN logits latched** for all subsequent requests after a batch padded to the next CUDA-graph size on GLM-5.3-Flash + EAGLE (#49881). Related to #48964, #49274, #43514.
5. **`--enable-hisparse` fails at startup for GLM-5.3-Flash** — `HybridLinearKVPool` missing `register_mapping` (#50030).
6. **Router replays non-idempotent POSTs** after connection close even when the worker may have consumed them (#50132) — duplicate-side-effect risk for agents.
7. **Truncated tool-call arguments silently rewritten to `{}`** in Responses API (#50131) — data-integrity issue for tool callers.
8. **HiCache Mooncake zero-copy reads accepted as full hits** based on transfer status without byte-count verification (#50130).
9. **Qwen-VL image preprocessing OOMs on GPU** — 2.87× peak from `torch.cat(processed_images)` plus a non-returning cache (#49796).
10. **Xid 13 "CTA Not Present"** in HiCache kvcacheio transfer kernels on B200 — 7 crashes across 4 machines under agentic load (#46203).
11. **DeepSeekV3Detector streaming drops first tool call** when two complete calls arrive in one increment (#43523).
12. **CI infrastructure** — 208-comment flaky tracker (#42752); 3 broken / 9 flaky reported on main (#17050).

Closed today: #50006 (gRPC async validation errors misreported as INTERNAL), #39274, #35826, #38815, #39311, #39279, #39260 (mostly stale/inactive closures).

## What This Means for Application Developers
- **Pin your versions.** v0.5.23 carries a real SM90 decode regression for spec-decoding workloads (#49336). If you're on Hopper/H20 with DSPARK, stay on v0.5.22 until a fix lands.
- **Multi-tenant safety:** the cross-client token leak (#49903) is the one issue that should change your deployment posture today if you run multi-tokenizer mode with untrusted clients — audit `rid` generation and consider isolating by model.
- **Agents & tool-calling:** two live correctness bugs affect you directly — silent `{}` rewriting of malformed tool args (#50131) and router-side replay of non-idempotent POSTs (#50132). Wrap tool execution with idempotency keys and validate tool-call payloads client-side.
- **1.0 is coming.** The plan to replace silent config fallbacks with explicit errors (#50045) will surface misconfigurations previously masked. Audit your launch flags now if you upgrade frequently.
- **Hardware expansion is real:** NPU (Ascend A3/950), MLU, Apple MPS, and ROCm are all getting first-class feature parity for models like DeepSeek-V4.1, GLM-5.2/5.3, and Qwen3.8-Flash-Next. If you were holding off on non-NVIDIA deployment, the feature gap is closing fast.
- **PD disaggregation operators:** watch the `sgl-model-gateway` → `sgl-router` migration (#50176) and the MNNVL custom mem pool landing (#47767) — both affect how you launch and network your deployment.

</details>

<details>
<summary><strong>llama.cpp</strong> — <a href="https://github.com/ggml-org/llama.cpp">ggml-org/llama.cpp</a></summary>

# llama.cpp Digest — 2026-11-13

## 1. Today's Highlights

A security-relevant server fix landed in **b12340**, closing an SSRF vector in the CORS proxy and media-URL handling path (`#32115`). On the performance side, CUDA NVFP4 checkpoints get a significant prefill boost via a fused weight-scale epilogue in MMQ (`#26048`, **b12329**), and the split-graph prefetch logic was tightened to avoid copying tensors that later splits depend on (`#32100`, **b12328**). Meanwhile, a persistent cluster of speculative-decoding/tensor-split crashes on Gemma-class models continues to draw attention across CUDA, Vulkan, and SYCL backends.

## 2. Releases & Breaking Changes

- **b12340** — `server: fix SSRF for CORS proxy and media URLs` ([#32115](https://github.com/ggml-org/llama.cpp/pull/32115)). If you run llama-server with any proxy or media fetching enabled, this is a must-upgrade. Treat prior builds as potentially exploitable.
- **b12323** — Chat template refactor for Gemma 4 tool arguments ([#31915](https://github.com/ggml-org/llama.cpp/pull/31915)): replaced ad-hoc workarounds with a schema-shaped PEG parser. Behavior is intentionally stricter — tool-call parsing for Gemma 4 may reject outputs previously accepted.
- **PR [#32163](https://github.com/ggml-org/llama.cpp/pull/32163)** — Migration guide for `llama_batch` → `llama_batch_ext` is in progress. API consumers using the legacy `llama_batch` struct directly should plan for migration.
- **PR [#32164](https://github.com/ggml-org/llama.cpp/pull/32164)** — LFM2 tool-call grammar now honors the OpenAI `strict` flag; default behavior becomes `strict: false` to match vLLM. This changes tool-call acceptance semantics for LFM2 deployments.
- **b12321 / b12319 / b12320** — SYCL build correctness (thread-safe oneDNN FA cache) and AOT >4GB fix. No API impact but rebuild recommended for SYCL users.

## 3. New Model & Hardware Support

- **HunyuanVL** — position embedding type fix required (F32) in mtmd (**b12336**, [#32131](https://github.com/ggml-org/llama.cpp/pull/32131)). Existing installs were silently tolerant; upstream now enforces the type and prevents an F64 overflow.
- **Zaya1 8B (Zyphra)** — model + conversion support in review ([#32071](https://github.com/ggml-org/llama.cpp/pull/32071)), including an SSM_CONV fix to run on CUDA without abort.
- **GigaChat 3.5 (432B-A28B MoE)** — long-running model PR ([#25342](https://github.com/ggml-org/llama.cpp/pull/25342)) still open; DeepSeek-V3-style MLA + hybrid attention.
- **SpacemiT Q4_1 32x256** — dispatched through HP kernel (**b12327**, [#31929](https://github.com/ggml-org/llama.cpp/pull/31929)); same path now as Q4_0.
- **OpenVINO backend expansion** ([#32172](https://github.com/ggml-org/llama.cpp/pull/32172)) — Qwen3.5 (GDN) on Lunar Lake NPU, Qwen MTP multi-sequence, gemma-4 fixes.
- **Nemotron Labs Dory** — reported unsupported ([#31780](https://github.com/ggml-org/llama.cpp/issues/31780)); no known fix PR yet.

## 4. Performance & Optimization

- **CUDA NVFP4 MMQ prefill** ([#26048](https://github.com/ggml-org/llama.cpp/pull/26048), **b12329**) — fuses `w_s` scale into the MMQ epilogue write-back and into `mul_mat(_id)`. Direct prefill speedup for NVFP4 checkpoints; also includes new tests.
- **Fused KV dequant in MMA flash-attention** ([#31802](https://github.com/ggml-org/llama.cpp/pull/31802), open) — eliminates the separate f16 K/V materialization pass for q8_0/q4_0/f8_e4m3 KV caches. Potentially large VRAM and bandwidth win for long-context quantized-KV workloads.
- **Layer-first prefill** ([#32082](https://github.com/ggml-org/llama.cpp/pull/32082), closed) — reported **~2× prefill speedup** on Qwen-family models with `-cmoe` by restructured ubatch traversal to reduce PCIe expert reloads. Worth following if it reopens.
- **Split-graph prefetch narrowing** (**b12328**, [#32100](https://github.com/ggml-org/llama.cpp/pull/32100)) — prefetch only tensors computed by earlier splits. Reduces redundant copies, particularly for MoE cache uploads.
- **Lazy VRAM allocation proposal** ([#32170](https://github.com/ggml-org/llama.cpp/pull/32170), open) — context-sized VRAM grows on demand; ambitious cross-backend change.
- **Jinja template rendering** ([#32023](https://github.com/ggml-org/llama.cpp/pull/32023), open) — removes silent builtin-table copies; reduces chat template overhead.

## 5. Stability & Regressions

Ranked by severity / user impact:

1. **SM_60 FP32→FP16 silent precision loss** ([#25593](https://github.com/ggml-org/llama.cpp/issues/25593), open, 22 comments) — quality regression on Tesla P100 / sm_60; fix exists **only in downstream forks**, not upstream. High severity for affected users.
2. **Speculative-decoding crashes on Gemma 4 + MTP + `-sm tensor`** across backends:
   - CUDA `fattn.cu:579` fatal error ([#24440](https://github.com/ggml-org/llama.cpp/issues/24440))
   - Vulkan `GGML_ASSERT(neq0 == HSK)` ([#29418](https://github.com/ggml-org/llama.cpp/issues/29418))
   - SYCL FA head-dim mismatch ([#29419](https://github.com/ggml-org/llama.cpp/issues/29419))
   - SYCL TDR reset on dual Arc B70 ([#28778](https://github.com/ggml-org/llama.cpp/issues/28778))
   No unified fix PR yet; the pattern suggests a tensor-split + MTP interaction bug.
3. **draft-dflash on hybrid Qwen3.8-27B aborts in `post_decode::seq_rm` with `--parallel 8`** ([#31656](https://github.com/ggml-org/llama.cpp/issues/31656), open).
4. **Hybrid/recurrent context checkpoints always invalidated** ([#24055](https://github.com/ggml-org/llama.cpp/issues/24055), open, 22 comments) — a reimplementation of the fix is in PR ([#25592](https://github.com/ggml-org/llama.cpp/pull/25592)).
5. **Vulkan regressions since #30020** ([#30688](https://github.com/ggml-org/llama.cpp/issues/30688)) — draft-MTP decode ~4× slower, prefill ~6× slower on R9700 because target compute buffer was reallocated into GTT.
6. **ggml-openvino sticky NaN + FILL op needed** ([#31977](https://github.com/ggml-org/llama.cpp/pull/31977)) — fix PR open; depends on FILL support since [#31913](https://github.com/ggml-org/llama.cpp/pull/31913).
7. **LoRA conversion bug: `use_rslora` ignored** ([#31879](https://github.com/ggml-org/llama.cpp/issues/31879)) — rsLoRA adapters run `sqrt(r)` times too weak. Silent quality degradation, worth auditing any LoRA-served models.
8. **Server slot erase doesn't clear `--cache-ram`** ([#32048](https://github.com/ggml-org/llama.cpp/issues/32048)) — private data from a prior prompt can leak into a subsequent request after slot erase. Older prompt restored to a different client in multi-tenant deployments.
9. **--cache-ram -1 not truly "no limit"** ([#29324](https://github.com/ggml-org/llama.cpp/issues/29324)) — ~640 MiB per short prompt growth on hybrid models.
10. **hf downloader not router-aware** ([#32104](https://github.com/ggml-org/llama.cpp/issues/32104)) — parallel load of same model on multiple GPUs can corrupt download.
11. **`json-schema-to-grammar` drops optional-before-required fields** ([#30321](https://github.com/ggml-org/llama.cpp/issues/30321)) — silent schema violation.
12. **Security advisory link 404** ([#31972](https://github.com/ggml-org/llama.cpp/issues/31972)) — process bug, but combined with today's SSRF fix it's worth noting the disclosure path is broken.

## 6. What This Means for Application Developers

- **Upgrade server builds immediately if you proxy or fetch media.** The SSRF fix in **b12340** closes a real attack surface on `llama-server`. Self-hosted multi-tenant or internet-adjacent deployments are the priority.
- **Multi-tenant server deployments need to audit checkpoint/cache behavior.** Issues [#32048](https://github.com/ggml-org/llama.cpp/issues/32048) (slot erase doesn't clear prompt cache) and [#30366](https://github.com/ggml-org/llama.cpp/issues/30366) (KV reused across LoRA config changes) mean cross-request state can leak. Until fixed, isolate tenants on separate processes or disable `--cache-ram`/`--cache-reuse`.
- **Audit any rsLoRA adapters you serve.** [#31879](https://github.com/ggml-org/llama.cpp/issues/31879) silently scales them down by `sqrt(r)`; if you saw unexplained quality drops on LoRA deployments, this is likely the cause.
- **Speculative decoding on Gemma weights + tensor split is currently unsafe.** If your agent stack enables MTP/draft-dflash with `-sm tensor`, expect intermittent process aborts and driver-level TDR resets. Pin to a known-good build or disable tensor split for these paths until the crash cluster is resolved.
- **CUDA + NVFP4 is safe to adopt** — **b12329** fuses the weight-scale epilogue with tests, so prefill throughput improves without correctness trade-offs. Combined with open PR [#31802](https://github.com/ggml-org/llama.cpp/pull/31802) (fused KV dequant in FA), expect meaningful long-context wins on quantized-KV configs within the next few releases.
- **If you call `llama_batch` directly in a custom integration, start tracking [#32163](https://github.com/ggml-org/llama.cpp/pull/32163).** The `llama_batch_ext` migration guide indicates the legacy struct is on a deprecation trajectory.
- **Chat template and tool-call grammar changes are stricter, not more permissive.** The Gemma 4 refactor and the LFM2 `strict` flag change ([#32164](https://github.com/ggml-org/llama.cpp/pull/32164)) can shift agent benchmark behavior. Re-run your tool-calling evaluations after upgrading rather than assuming parity.
- **Vulkan + AMD RDNA4 users** — check whether [#30688](https://github.com/ggml-org/llama.cpp/issues/30688) affects your build before upgrading past v0.6.0; both decode and prefill regressions are significant and unfixed.

</details>

<details>
<summary><strong>Ollama</strong> — <a href="https://github.com/ollama/ollama">ollama/ollama</a></summary>

# Ollama Digest — 2026-11-13

## 1. Today's Highlights
No new releases landed in the last 24h, but PR activity is dense on the runner/serving side: two Metal (`mlxrunner`) PRs from dhiltgen rework KV/history reuse across request slots ([#19677](https://github.com/ollama/ollama/pull/19677), [#19678](https://github.com/ollama/ollama/pull/19678)), and a llama.cpp patch directly targets the long-standing context-shift corruption behind [#19457](https://github.com/ollama/ollama/issues/19457) ([#19680](https://github.com/ollama/ollama/pull/19680)). On the reliability front, two independent fixes address the pull/host-error mishandling that surfaced as spurious `max retries exceeded: EOF` failures ([#19675](https://github.com/ollama/ollama/issues/19675), [#19676](https://github.com/ollama/ollama/pull/19676)). Cloud-side instability continues to generate reports, notably a tool-call flooding storm on `mimo-v2.6-pro:cloud`.

## 2. Releases & Breaking Changes
None in the last 24h. Notes for awareness:
- CLI now exposes runner variant selection (`mlx` / `gguf`) in `run` and `pull` help, with legacy runner names still accepted ([#19644](https://github.com/ollama/ollama/pull/19644), closed).
- A `code of conduct` PR remains open ([#19516](https://github.com/ollama/ollama/pull/19516)) — process-only, no runtime impact.

## 3. New Model & Hardware Support
- **AMD Strix Halo (iGPU) memory accounting**: host-free-RAM capping logic for integrated GPUs is being corrected so firmware carve-out memory isn't incorrectly capped by free system RAM ([#19670](https://github.com/ollama/ollama/pull/19670), fixes [#16462](https://github.com/ollama/ollama/issues/16462)).
- **Tool schema fidelity**: unmodeled JSON Schema keywords (`default`, `minimum`, etc.) are now preserved instead of silently dropped when decoding tool definitions ([#19686](https://github.com/ollama/ollama/pull/19686)).
- **Thinking-level mapping**: models that don't support explicit "disabled thinking" now map to their lowest supported thinking level rather than failing ([#19684](https://github.com/ollama/ollama/pull/19684), closed).
- **Harmony tool-name parsing** now handles Unicode digits at the start of tool names ([#19669](https://github.com/ollama/ollama/pull/19669)).

## 4. Performance & Optimization
- **Metal runner history reuse across slots** ([#19677](https://github.com/ollama/ollama/pull/19677)): a new request can reuse a compatible saved prefix from a *busy* slot, reducing redundant prompt processing for overlapping conversations sharing prefixes.
- **Adaptive history under memory pressure** ([#19678](https://github.com/ollama/ollama/pull/19678)): the fixed 8 GiB saved-history allowance divided across slots is replaced with a memory-pressure-aware policy, allowing Metal runners to retain more history when headroom exists. Both build on [#19197](https://github.com/ollama/ollama/pull/19197).
- **Context-shift amplitude fix** ([#19680](https://github.com/ollama/ollama/pull/19680)): `build_rope_shift` was re-applying the YaRN amplitude factor on every shift, progressively scaling cached KV keys. Fix keeps shifts amplitude-neutral — directly relevant to long-context throughput without quality decay.

## 5. Stability & Regressions
Ranked by severity:

1. **Context shift corrupts long answers until model unload** — `deepseek-r1:8b`, `phi3.5`, `phi4-mini`, `phi3` degrade after long replies/`num_ctx` overflow; persists until `ollama stop` ([#19457](https://github.com/ollama/ollama/issues/19457)). **Fix PR open** ([#19680](https://github.com/ollama/ollama/pull/19680)).
2. **Cloud tool-call flooding** — `mimo-v2.6-pro:cloud` emits hundreds of near-identical tool calls per turn in agentic loops, rendering sessions unusable ([#19672](https://github.com/ollama/ollama/issues/19672)). No fix PR yet; may be upstream checkpoint issue.
3. **AMD Strix Halo VRAM regression (0.30+)** — container deployments report only 2 GB VRAM instead of unified memory; regression from 0.24.0-rocm ([#16462](https://github.com/ollama/ollama/issues/16462), 33 comments). **Fix PR open** ([#19670](https://github.com/ollama/ollama/pull/19670)).
4. **Pull failures masked as EOF** — `downloadChunk` ignores HTTP status on the redirect target; proxy error pages (e.g. 403 HTML) are copied as blob data, yielding `max retries exceeded: EOF` ([#19675](https://github.com/ollama/ollama/issues/19675)). **Fix PR open** ([#19676](https://github.com/ollama/ollama/pull/19676)).
5. **`/save` fails for `nemotron-3.5-lightning`** (`nemotron_h_moe` arch) with "pull model manifest: file does not exist" despite a valid local manifest ([#17735](https://github.com/ollama/ollama/issues/17735)).
6. **Cloud crash on `minimax-m3.1-flash`** under Goose agent — 500 provider errors ([#19671](https://github.com/ollama/ollama/issues/19671)).
7. **Stale model catalog in ChatGPT/Codex integration** after Save & Restart ([#19682](https://github.com/ollama/ollama/issues/19682)).
8. **Non-finite tool arguments break JSON encoding** — `NaN`/`Inf` from Qwen XML or OLMo/LFM parsers fail `json.Marshal` ([#19679](https://github.com/ollama/ollama/pull/19679), fix open).
9. Minor: duplicate `TopLogprobs` validation dead code in `server/routes.go` ([#14955](https://github.com/ollama/ollama/issues/14955)).

## 6. What This Means for Application Developers
- **Long-context agents on R1/Phi**: until [#19680](https://github.com/ollama/ollama/pull/19680) lands, plan to unload models between long sessions or pin a pre-regression build; watch `num_ctx` overflow as a trigger.
- **Pull reliability in corporate networks**: if users behind proxies see `max retries exceeded: EOF`, the root cause is status-code handling in `downloadChunk`, not the network — the fix is in review.
- **Tool-heavy applications**: schema keywords (`default`, `minimum`) previously lost in transit are now preserved ([#19686](https://github.com/ollama/ollama/pull/19686)); and malformed non-finite numeric arguments no longer crash serialization once [#19679](https://github.com/ollama/ollama/pull/19679) merges. Both reduce silent contract drift in agent loops.
- **Concurrent/prefix-shared workloads on Apple Silicon**: the two `mlxrunner` PRs should meaningfully cut prompt-processing cost for RAG-style apps and multi-session chat sharing system prompts — worth benchmarking once merged.
- **AMD iGPU users in containers**: track [#16462](https://github.com/ollama/ollama/issues/16462)/[#19670](https://github.com/ollama/ollama/pull/19670) before upgrading to 0.30+; the fix addresses both bare-metal and container paths.
- **Cloud model selection**: `mimo-v2.6-pro:cloud` and `minimax-m3.1-flash` are currently unreliable for agentic use; consider fallbacks in your model router until upstream checkpoints stabilize.

</details>

<details>
<summary><strong>LiteLLM</strong> — <a href="https://github.com/BerriAI/litellm">BerriAI/litellm</a></summary>

# LiteLLM Digest — 2026-11-13

## 1. Today's Highlights

LiteLLM shipped an LTS patch (v1.108.7) alongside a new release candidate (v1.110.0-rc.2), continuing the aggressive migration of router, cache, and Redis state from Python to Rust. The issue tracker is dominated by cost-tracking correctness bugs — including a serious 1,000,000× overbilling report and multiple budget/counter bypass paths — plus a wave of MCP/streaming latency and telemetry regressions. On the PR side, the team is actively extending native Rust stores (session pins, health, router usage) and adding annual budget reset periods.

## 2. Releases & Breaking Changes

- **v1.110.0-rc.2** — release candidate; Docker images signed with cosign (key from commit `e82a3c6`). [Release](https://github.com/BerriAI/litellm/releases)
- **v1.109.1** — standard release, cosign-signed. [Release](https://github.com/BerriAI/litellm/releases)
- **v1.108.7 (LTS)** — patch on the LTS line; `ghcr.io/berriai/litellm:lts` tracks the newest LTS patch. [Release](https://github.com/BerriAI/litellm/releases)

**Operator note (no fix yet):** Issue [#41743](https://github.com/BerriAI/litellm/issues/41743) requests that releases publish their database schema changes and required rolling-upgrade procedure — currently not documented, making upgrades risky for self-hosters.

**Request-shape change:** With the Rust router core now the only core, malformed `fallbacks` / `max_fallbacks` values (non-list, non-integer) fail with an HTTP 500 instead of being tolerated — see [#51396](https://github.com/BerriAI/litellm/issues/51396).

## 3. New Model & Hardware Support

- **IONOS AI Model Hub** — feature request for a European, GDPR-aligned provider integration. [#40112](https://github.com/BerriAI/litellm/issues/40112)
- **Vertex Deep Research agents** — PR [#51517](https://github.com/BerriAI/litellm/pull/51517) binds Deep Research agents to the correct model and records their costs (currently logged at $0); PR [#51511](https://github.com/BerriAI/litellm/pull/51511) routes Vertex lifecycle calls (GET/cancel/DELETE) through the selected deployment instead of always hitting Google AI Studio.

No new hardware backends (CUDA/ROCm/Metal) or quantization formats in this window.

## 4. Performance & Optimization

The dominant theme is the Python→Rust state migration, which moves hot-path state off `redis-py`/`DualCache`:

- **Session pins → native store**: PR [#50870](https://github.com/BerriAI/litellm/pull/50870) moves deployment-affinity and complexity-router pins out of the shared `DualCache` keyspace.
- **Health state → native store**: PR [#50357](https://github.com/BerriAI/litellm/pull/50357) migrates health-check deployment states to a native `deployment_health` store.
- **`router_usage` family native counting**: PR [#50862](https://github.com/BerriAI/litellm/pull/50862) brings usage-v2, rate-limit checks, and io-token counting off redis-py.
- **RedisBatch → Rust**: PR [#51383](https://github.com/BerriAI/litellm/pull/51383) replaces the remaining Python `RedisBatch`; PR [#51384](https://github.com/BerriAI/litellm/pull/51384) moves per-request miss/settlement/shutdown-drain tracking into Rust.
- **In-memory cache heap fix**: PR [#51388](https://github.com/BerriAI/litellm/pull/51388) bounds the expiry heap and avoids panics on oversized TTLs (a leak under key churn).

Concrete numbers are sparse; these are architectural shifts rather than benchmarked wins.

## 5. Stability & Regressions

Ranked by severity:

1. **1,000,000× cost overbilling** — provider-reported `usage.cost` is trusted as USD without validation or unit normalization. [#48398](https://github.com/BerriAI/litellm/issues/48398) — open, no fix PR.
2. **End-user budget bypass** — stale per-pod fallback spend after a Redis counter clean-miss lets users exceed budgets; counter TTL defaults to 60s. [#34238](https://github.com/BerriAI/litellm/issues/34238) — open.
3. **Tag spend counters not reseeded** from durable DB spend; model access-group counters hit the same path. [#35538](https://github.com/BerriAI/litellm/issues/35538) — open.
4. **MCP `tools/list` blocks 18–50s** on legacy subscription listeners after `notifications/initialized` (pre-2026 protocol versions), a regression from v1.106.6→v1.108.0. [#50065](https://github.com/BerriAI/litellm/issues/50065) — open.
5. **Silent SpendLogs gaps**: Gemini image requests return 200 OK but write no spend row. [#49567](https://github.com/BerriAI/litellm/issues/49567); prompt storage silently persists `{}` despite `store_prompts_in_spend_logs: true`. [#34747](https://github.com/BerriAI/litellm/issues/34747) — both open.
6. **OTel semantics**: `gen_ai.response.model` reports the requested alias, not the actual model. [#51029](https://github.com/BerriAI/litellm/issues/51029) — closed; timeout-after-backend-processing produces spans with no `gen_ai.usage`. [#51221](https://github.com/BerriAI/litellm/issues/51221) — closed.
7. **Translation correctness**: `function.strict: true` silently dropped for Anthropic. [#51230](https://github.com/BerriAI/litellm/issues/51230); Responses→Chat bridge drops tool names/unsupported types. [#27276](https://github.com/BerriAI/litellm/issues/27276); mid-conversation `system` messages break Gemini/Vertex prompt caching. [#42104](https://github.com/BerriAI/litellm/issues/42104); Vertex tuple-form `items` schema crash. [#36848](https://github.com/BerriAI/litellm/issues/36848); Anthropic image token counting at flat 85 tokens (32× undercount). [#39910](https://github.com/BerriAI/litellm/issues/39910).
8. **Streaming**: uvicorn workers die silently during long SSE streams with `--num_workers 2`, killing in-flight streams. [#36179](https://github.com/BerriAI/litellm/issues/36179) — closed; `cached_tokens` intermittently dropped from streaming usage. [#36882](https://github.com/BerriAI/litellm/issues/36882) — open.
9. **MCP OAuth**: Claude Code / Codex fail login to MCP toolset URLs due to resource-URL matching. [#46295](https://github.com/BerriAI/litellm/issues/46295) — closed.

## 6. What This Means for Application Developers

- **Audit your cost data before trusting it.** The 1M× overbilling and silent SpendLogs gaps mean dashboards and budget enforcement can be wrong in both directions. If you route OpenAI-compatible providers that report their own `usage.cost`, verify units against known pricing.
- **Don't rely on budgets as hard limits** until the Redis counter bypass (#34238) is fixed — stale pod-local fallbacks can let spend drift past configured caps.
- **If you use MCP with older SDK clients**, expect multi-second `tools/list` stalls on v1.108.x; pin to v1.106.x or test the RC before upgrading.
- **Anthropic + tools:** `strict: true` is silently ignored, and image token counts are badly undercounted — pre-call context-window checks for Anthropic proxies can be off by ~32×.
- **Telemetry consumers** should not assume `gen_ai.response.model` reflects the actual serving model; treat it as the requested alias.
- **Self-hosted upgrade planning** is hampered by undocumented schema migrations; watch PR [#41743](https://github.com/BerriAI/litellm/issues/41743) or inspect migration diffs manually before rolling upgrades.
- **On the positive side**: the Rust migration of session pins, health, and usage counters should meaningfully reduce Redis round-trips and Python GC pressure at high request rates once landed.

</details>

<details>
<summary><strong>Unsloth</strong> — <a href="https://github.com/unslothai/unsloth">unslothai/unsloth</a></summary>

# Unsloth Digest — 2026-11-13

## 1. Today's Highlights
No new releases landed in the last 24h, but the issue tracker and PR queue stayed very active. The dominant themes are **Studio reliability fixes** (context handling, mmap regressions, sandboxing of shell/pip execution), **AMD/NPU backend expansion** (Q4NX loading on AMD NPU, iGPU VRAM accounting), and a **GGUF/MTP mismatch** degrading speculative decoding acceptance on Qwen3.8-Flash-Next. A notable Studio PR (#17641) adds first-class Engram table precision selection for Qwen3.8-Flash-Next and DeepSeek-V4.1 GGUFs, previously a manual workflow.

## 2. Releases & Breaking Changes
- **No new releases in the last 24h.** No API or config breaking changes announced.
- ⚠️ Potential behavioral regression to watch: **`--load-mode none` is being overridden by forced mmap in Desktop 0.1.917-beta** ([#17605](https://github.com/unslothai/unsloth/issues/17605)) — users upgrading from 0.1.916 should verify their load-mode flags take effect.

## 3. New Model & Hardware Support
- **AMD NPU (Q4NX)**: Converted Q4NX folders now appear as "Converted" rows in the NPU model picker and load directly on AMD NPU via FastFlowLM integration ([PR #17636](https://github.com/unslothai/unsloth/pull/17636)).
- **Engram table precision selection** in Studio for **Qwen3.8-Flash-Next** and **DeepSeek-V4.1-Flash-1017** GGUFs — eliminates the manual `set_split.py` + rename workflow ([PR #17641](https://github.com/unslothai/unsloth/pull/17641)).
- **MOSS-Image derivative (Kromoss)** requested for Studio GGUF support; currently rejected as unsupported architecture ([#17552](https://github.com/unslothai/unsloth/issues/17552)).
- **Ascend NPU (昇腾) backend RFC** — still open, significant for China-market deployments ([#10772](https://github.com/unslothai/unsloth/issues/10772)).
- **Gemma 4 family → Unsloth Dynamic UD3.1** requested; currently on UD2.0 ([#17573](https://github.com/unslothai/unsloth/issues/17573)).

## 4. Performance & Optimization
- **FLUX.3 attention kernel**: Q/K construction fused into a single bit-exact kernel in Studio — targets removed float-ops and redundant launches in `Flux3AttnProcessor` ([PR #17637](https://github.com/unslothai/unsloth/pull/17637)).
- **SageAttention in MiniMax-H3 / H3-Image**: strided processor integration, eliminating per-call device sync on sm89 ([PR #17639](https://github.com/unslothai/unsloth/pull/17639)).
- **KV/prompt cache retention**: long GGUF chats no longer re-read from token 0 when a subagent turn interleaves; llama-server cache now sized to one full context window when the 8 GB default is insufficient ([PR #17632](https://github.com/unslothai/unsloth/pull/17632)).
- **GRPO chunked/hidden-state optimizations** (previously exclusive to GRPO) proposed for ORPO/DPO/CPO trainers ([#5291](https://github.com/unslothai/unsloth/issues/5291), closed — worth tracking follow-ups).
- **Offline top-k teacher logprobs** for distillation proposed to remove teacher weights from training memory ([#11556](https://github.com/unslothai/unsloth/issues/11556)).

## 5. Stability & Regressions
Ranked by severity:

1. **🔴 High — MTP draft head / UD 3.1 mismatch** on Qwen3.8-Flash-Next: speculative decoding acceptance drops from ~74% → 56–66% at production temperature on Ryzen AI Max+ 395 ([#17402](https://github.com/unslothai/unsloth/issues/17402)). No fix PR yet; 3.1-matched heads status unclear.
2. **🔴 High — Forced mmap regression in Desktop 0.1.917** ignoring `--load-mode none`: causes excessive RAM and SSD churn on large GGUFs (97+ GiB) ([#17605](https://github.com/unslothai/unsloth/issues/17605)). No fix PR yet.
3. **🟠 Medium — Python tool bypasses shell-command approval**: `subprocess.run('git reset --hard && git clean -fdx', shell=True)` executes with no confirmation card, wiping uncommitted work ([PR #17624](https://github.com/unslothai/unsloth/pull/17624) — fix open).
4. **🟠 Medium — ROCm 7.14 / MI300X (gfx942) stride assertion** in `_scaled_dot_product_flash_attention_backward`; forces MATH fallback ([#17548](https://github.com/unslothai/unsloth/issues/17548)). No fix PR.
5. **🟠 Medium — Studio `pip install` escapes into Studio's own Python env** on hosts without OS sandbox (e.g. Ubuntu 24.04), breaking model loading (e.g. `huggingface_hub` upgrades) ([PR #17626](https://github.com/unslothai/unsloth/pull/17626) — fix open).
6. **🟠 Medium — Ollama over-length prompts silently truncated** at the loaded context (default 4,096 tokens), producing confidently wrong answers ([PR #17623](https://github.com/unslothai/unsloth/pull/17623) — fix open). Coding agents on Ollama also missed their context window entirely ([PR #17622](https://github.com/unslothai/unsloth/pull/17622)).
7. **🟡 Low — Docker audio.cpp update fails** with "invalid cross-device link" ([#17638](https://github.com/unslothai/unsloth/issues/17638)). No fix PR.
8. **🟡 Low — Studio Transcribe: MOSS-Transcribe-Diarize fails on long audio** because `max_tokens` is never sent ([#17598](https://github.com/unslothai/unsloth/issues/17598)).
9. **🟡 Low — Repeated full prompt processing** across turns with Qwen hybrid model after tool use in Studio ([#17015](https://github.com/unslothai/unsloth/issues/17015)).

## 6. What This Means for Application Developers
- **If you're on Desktop 0.1.917-beta with custom load modes**: verify `--load-mode none` actually took effect before shipping workloads — mmap is reportedly forced ([#17605](https://github.com/unslothai/unsloth/issues/17605)).
- **If you serve Qwen3.8-Flash-Next with speculative decoding**: expect measurable acceptance-rate degradation with UD 3.1 GGUFs paired with pre-3.1 MTP heads. Benchmark at your production temperature before upgrading ([#17402](https://github.com/unslothai/unsloth/issues/17402)).
- **If you use Ollama connections in Studio or with `unsloth start claude/codex/opencode`**: incoming fixes (#17622, #17623) will enforce context-window bounds — until then, cap message sizes client-side to avoid silent truncation.
- **If you build agents that use the Python or Terminal tool inside Studio**: PR #17624 brings Python shell-invocation under the same approval gating as Terminal. This is a behavior change for anyone relying on unattended Python execution; plan your permission model accordingly.
- **If you run distillation pipelines**: [#11556](https://github.com/unslothai/unsloth/issues/11556) is worth following — offline top-k teacher logprobs would let you distill from DeepSeek/Kimi-K2-class teachers without co-resident teacher weights.
- **AMD NPU users**: Q4NX models converted in Studio can now be loaded directly, removing a manual hand-off step ([PR #17636](https://github.com/unslothai/unsloth/pull/17636)).

---
*Sources: unslothai/unsloth issues (23 updated), PRs (195 updated, top 20 surfaced), releases (none). All links point to github.com/unslothai/unsloth.*

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*