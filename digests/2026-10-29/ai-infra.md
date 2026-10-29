# AI Infrastructure Digest 2026-10-29

> Generated: 2026-10-29 00:47 UTC | Projects covered: 6

- [vLLM](https://github.com/vllm-project/vllm)
- [SGLang](https://github.com/sgl-project/sglang)
- [llama.cpp](https://github.com/ggml-org/llama.cpp)
- [Ollama](https://github.com/ollama/ollama)
- [LiteLLM](https://github.com/BerriAI/litellm)
- [Unsloth](https://github.com/unslothai/unsloth)

---

## Cross-Project Comparison

# Cross-Project Comparison Report — AI Infrastructure Digest
**Date:** 2026-10-29 · **Projects:** vLLM, SGLang, llama.cpp, Ollama, LiteLLM, Unsloth

---

## 1. Ecosystem Overview

Today's activity reflects a maturing but unsettled inference stack: the serving engines (vLLM, SGLang) are converging on **speculative decoding, CUDA-graph restructuring, and KV-cache tiering** as the dominant performance surface, while simultaneously accumulating service-lifetime stability bugs in exactly those subsystems. Local runtimes (llama.cpp, Ollama) shipped a **model-family moment** — LiquidAI's LFM3 landed across both, with llama.cpp also shipping experimental realtime audio endpoints. The gateway layer (LiteLLM) is still in damage control from a **v1.107.0 supply-chain compromise**, with the fix on `main` but not yet in a stable tag. Meanwhile the training/fine-tuning layer (Unsloth) continues to fight a credibility gap between advertised VRAM savings and real-world OOM behavior on MoE workloads. Across all six, the common thread is that **quantization defaults, spec-decode correctness, and KV-cache behavior are now first-order production risks**, not tuning knobs.

---

## 2. Activity Comparison

| Project | Layer | Issues (notable/open) | PRs (notable) | Release Status | Dominant Theme |
|---|---|---|---|---|---|
| **vLLM** | Serving engine (datacenter) | ~10 severe (top: #50576 SM8x, 122 comments; #40420 OOM) | ~12 (CUDA-graph split #63406, KV-connector #64388) | **No release in 24h** | CUDA-graph & spec-decode restructuring |
| **SGLang** | Serving engine (datacenter) | ~11 open (top: #46952 HiCache eviction; CI tracker #42752, 137 comments) | ~12 (Rust frontend observability chain of 5) | **No release in 24h** | Rust frontend telemetry parity + HiCache bugs |
| **llama.cpp** | Local runtime (edge/desktop) | ~10 regressions (top: #27330 sm_120 CUDA-graph hang) | ~15 (MoE caching, SVE GEMM, OpenCL) | **v0.8.0 + b11972** (LFM3, audio) | New model family + quantized GEMM kernels |
| **Ollama** | Local runtime (consumer) | ~10 (top: #19201 30× Vulkan slowdown; MLX pull failures) | ~8 (MLX Windows/CPU #19366, video input #19348) | **v0.40.13-rc1** | MLX friction + AMD/Vulkan perf regression |
| **LiteLLM** | Gateway / proxy | ~10 (CRITICAL: #47826 supply chain; #47904 backport gap) | ~9 (Rust migration #31263, MCP hardening #48931) | **v1.109.0-dev.1, v1.106.6, v1.105.7** | Supply-chain recovery + Rust gateway prep |
| **Unsloth** | Fine-tuning framework | ~12 (top: #4504/#4040 OOM, both closed but heavily discussed) | ~10 (GGUF/MLX lifecycle, MCP toggles #15629) | **v0.1.912-beta** | Studio lifecycle bugs + VRAM OOM |

**Signal:** llama.cpp and Ollama shipped releases; vLLM and SGLang deliberately did not (both in restructuring phases). LiteLLM's releases are security-driven, not feature-driven. Unsloth's beta is a mixed Halloween-feature/optimization drop.

---

## 3. Model Support Race

| Model / Family | vLLM | SGLang | llama.cpp | Ollama | Unsloth |
|---|---|---|---|---|---|
| **DeepSeek-V4 / V4.1-Flash** | ⚠️ SM8x blocked (#50576), SM120 unusable (#56892) | ✅ Indexer migrated to DeepGEMM 0.2.5 (#44350) | 🔶 Draft only (PR #30817), prefix-cache corruption | — | — |
| **LiquidAI LFM3 (text/vision/audio/omni)** | — | — | ✅ **v0.8.0 headline** (all modalities) | ✅ GGUF fixes (#19344), speech | ⏳ Requested (#15588, top upvote) |
| **Qwen3.5 / 3.6 / 3.8** | ✅ ROCm fused QK-norm (#51406) | ✅ QSA/GDN perf (#46631, #46633) | ✅ Tool calls leaking (#30118) | ⚠️ MLX tool-call regression (#19353) | ✅ MLX video input (ollama #19348) |
| **Muse Spark (MXFP4 experts)** | ✅ NVIDIA path (#64389) | — | — | — | — |
| **GLM-5.3** | — | ⚠️ FP8 hang (#45781), HiCache crash (#45989) | — | — | — |
| **Kimi-K2.6 / K3** | ⚠️ EngineDeadError (#42363) | ✅ Mamba HiCache (#44718) | — | — | — |
| **Gemma 4 / Gemma 3** | ✅ OpenShift crash (#44548) | — | — | ⚠️ MLX tags fail on Linux | ✅ Gemma 3 float32 patch (#15879) |

**Who's ahead:**
- **llama.cpp** is the clear winner on *breadth of new architecture adoption* — it shipped LFM3 across four modalities in a single release, which no serving engine can match.
- **vLLM** leads on *hardware-specific quantization coverage* (MXFP4 experts, FP8 block-quant) but is the most constrained on **DeepSeek-V4 across hardware** — the highest-engagement issue of the day is that neither V4-Flash checkpoint runs on Ampere.
- **SGLang** leads on *DeepSeek indexer and CP integration* but is carrying the most severe hybrid-model regressions (GDN host-tier cache drop, GLM-5.3 hangs).
- **Unsloth** is the laggard — LFM3 fine-tuning is still an unfilled feature request while everyone else has shipped it.

---

## 4. Performance Frontier

Optimization effort is **not evenly distributed** — it clusters around four surfaces:

**① KV cache & tiering (highest volume, highest risk)**
- vLLM: NIXL checkpointing, Mooncake sleep-mode, new `get_kv_cache_transfer_regions()` contract (#64388), FP8 KV dequant smem reduction (#63642).
- SGLang: HiCache is both the biggest optimization area *and* the biggest bug source — `write_back` eviction is 500× slower (#46952), `buffer_only`+Mooncake crashes (#45989), GDN host-tier hits drop to zero (#45400).
- **Takeaway:** KV tiering is where the ecosystem is investing most aggressively and where production confidence is lowest.

**② Batching & CUDA-graph restructuring (vLLM/SGLang)**
- vLLM's **separate prefill/decode capture sizes** (#63406) is the single most consequential structural change — it underlies both the SM120 regression and part of the SM8x gap.
- SGLang's FlashInfer prefill CP (#33226) and KV layout hooks (#45434) decouple compute from storage layout.

**③ Quantization kernels (broad, cross-layer)**
- llama.cpp: SVE q6_K GEMM, CUDA fused MoE gate/up+GLU, OpenCL IQ1_S/M, Adreno q4_K tiling — the densest kernel work of any project.
- vLLM: FP8 KV, MXFP4 experts, Quark MXFP4 for MI355X.
- SGLang: INT8 QuickReduce default *removed* (#47163) after 800k-context accuracy regressions.

**④ MoE economics (converging priority)**
- llama.cpp: expert caching (#30966, #31286), GPU-resident LRU proposal (#29949).
- SGLang: routed-scaling fold into mega MoE (#46090).
- vLLM: HiSparse multi-token prefetch for MTP (#63801).

**Distributed serving** appears only in the form of **P/D disaggregation and CP** (vLLM NIXL/P2P, SGLang CP PRs) — no major new distributed-serving architecture landed today.

---

## 5. Layer Positioning

| Layer | Projects | Primary user | Key constraint today |
|---|---|---|---|
| **Datacenter serving engine** | vLLM, SGLang | Platform/infra teams, self-hosted inference | Spec-decode & KV-cache correctness; hardware coverage gaps (Ampere, SM120, MI350P) |
| **Local runtime** | llama.cpp, Ollama | Desktop/edge/consumer, embedded, Mac users | Backend-specific regressions (CUDA sm_120, Vulkan Gen9.5, SYCL MoE); MLX runtime availability |
| **Gateway / proxy** | LiteLLM | Multi-provider app teams, enterprise | **Supply-chain trust** + cost-tracking correctness |
| **Fine-tuning / training** | Unsloth | Individual devs, small teams, Studio users | VRAM predictability; Studio lifecycle reliability |

**Key differentiators:**
- **vLLM vs SGLang** are direct competitors, converging on the same feature set (spec decode, KV tiering, Rust frontends, MoE fusion). vLLM's Rust frontend is still an RFC (#40846); SGLang's Rust frontend already has five PRs landing telemetry. **SGLang is executing on Rust faster.**
- **llama.cpp vs Ollama** are complementary — Ollama wraps llama.cpp and the llama.cpp bump (b11963) is literally in Ollama's release. Ollama's differentiation is model library UX and consumer packaging; its weakness is that it inherits backend bugs slower than it can ship fixes.
- **LiteLLM is the only gateway** and uniquely exposes the app layer to provider-side breakage. Its Rust migration (#31263, sub-1ms target) would be a step-change for high-RPS agent fan-out but is not yet available.
- **Unsloth is the only training project** — no direct competitor in this digest, which partly explains its tolerance for long-lived VRAM complaints.

---

## 6. Trend Signals

**Signal 1 — Speculative decoding is now a production reliability surface, not a tuning knob.**
vLLM has two open service-lifetime bugs (Eagle AL decay #41838, lost GDN prefix-cache hits #52244) and SGLang has two correctness divergences (#45525, #46446) between spec and ordinary decode. Ollama is *just* landing per-request drafted/accepted metrics (#19368). **Watch:** instrument acceptance length as an SLO; expect greedy output non-determinism across scheduling configs.

**Signal 2 — Quantization defaults are silently dangerous again.**
SGLang pulled INT8 QuickReduce from the AMD image after 800k-context regressions; vLLM's ROCm AWQ path is 2.5× *slower* than BF16 on RDNA (#63455); FlashInfer autotune silently drops to default tactics for certain bucket sizes (#63159). **Watch:** re-run long-context evals after any image pull; never trust "quantized = faster" without per-path benchmarks.

**Signal 3 — The Rust frontend migration is real and accelerating on SGLang, aspirational on vLLM/LiteLLM.**
Three of six projects are moving server/frontend logic to Rust to escape Python GC/GIL. SGLang is furthest along; vLLM is at RFC; LiteLLM's Rust gateway is the marquee performance track. **Watch:** frontend behavioral parity gaps (`meta_info` fields, extension hooks, pass-through auth) will be a source of subtle multi-version bugs for the next 2–3 quarters.

**Signal 4 — KV cache tiering is the new OOM.**
The most severe bugs across vLLM and SGLang are all KV-cache-related: 185K-token OOM kills the engine (#40420), `write_back` eviction blocks the scheduler 300ms (#46952), P2P offload fails slow on peer faults (#63602). **Watch:** isolate long-context / agent / RAG workloads with hard token caps until tiering stabilizes.

**Signal 5 — Agent reliability is degrading at the edges, especially around tool calls.**
SGLang Responses API splits Codex turns (#42110) and Qwen3.8-27B drops tool calls (#46742); Ollama's Qwen3.8-27B MLX only emits tool calls on empty content (#19353); Unsloth's MCP server burns ~18k tokens on tool definitions before any work (#15629). **Watch:** validate agent trajectories on every server *and* model upgrade; enforce per-tool MCP budgets.

**Signal 6 — Supply-chain trust is now a first-class gateway concern.**
LiteLLM's v1.107.0 compromise is the most severe event in this digest. Docker cosign verification is now mandatory, but the stable/1.106.x backport for the eMudhra root CA is still missing (#47904). **Watch:** pin + cosign-verify every image; treat any unpinned `latest` as untrusted until the backport lands.

**Signal 7 — MoE serving economics are improving fast, and `--moe-cache-*` flags will become the key tuning surface.**
Fused CUDA gate/up+GLU, expert caching with CPU fallback, routed-scaling fold, and GPU-resident LRU proposals all target the same cost center. **Watch:** budget benchmark time per workload — MoE cache behavior is workload-specific and defaults are still moving.

---

**Bottom line for decision-makers:** Ship-ready today = llama.cpp v0.8.0 (with pinned backends), Ollama v0.40.13-rc1 (Mac/non-AMD only), Unsloth v0.1.912-beta (Linux). Hold = vLLM and SGLang on DeepSeek-V4 and any long-context KV-tiering change; LiteLLM 1.106.x until the eMudhra backport lands. The Rust frontend migrations and KV-tiering fixes are the two tracks to watch for the next quarter — both will change gateway and serving economics materially, and both currently carry correctness risk.

---

## Per-Project Reports

<details>
<summary><strong>vLLM</strong> — <a href="https://github.com/vllm-project/vllm">vllm-project/vllm</a></summary>

# vLLM Digest — 2026-10-29

## 1. Today's Highlights

DeepSeek-V4-Flash and its `-0731` refresh continue to dominate community attention, with the SM8x (Ampere) support request now at 122 comments — the top issue by a wide margin — while Blackwell SM120 users report unusable CUDA-graph capture for the same model family. On the PR side, the day is dominated by CUDA-graph/spec-decode restructuring work (separate prefill vs. decode capture sizes), KV-connector checkpointing (NIXL), and continued ROCm/quantization fixes. No releases in the last 24h.

## 2. Releases & Breaking Changes

No new releases in the last 24h. Note for forward planning:

- **[RFC] Rust front-end** ([#40846](https://github.com/vllm-project/vllm/issues/40846), 44 comments, 34 👍) — an in-flight proposal to move the front-end (server/API layer) toward Rust to sidestep Python GC and GIL costs. No API change yet, but front-end behavior and plugin interfaces are the likely blast radius if it lands.
- **KVCacheSpec transfer-region contract** ([PR #64388](https://github.com/vllm-project/vllm/pull/64388)) — adds an opt-in `get_kv_cache_transfer_regions()` contract returning named storage-sharing views in fixed `[B,H,N,C]` order. Storage adaptation responsibility moves to the producer; connector registration signatures are preserved. Relevant if you maintain a custom connector.

## 3. New Model & Hardware Support

- **Muse Spark MXFP4 experts on NVIDIA** ([PR #64389](https://github.com/vllm-project/vllm/pull/64389)) — adds support for llm-compressor `compressed-tensors` checkpoints: FP8 block-quantized dense layers + MXFP4 routed experts. Previously only NVFP4 (modelopt) was accepted on the NVIDIA path.
- **SM8x (Ampere) support for DeepSeek-V4-Flash / -0731** ([#50576](https://github.com/vllm-project/vllm/issues/50576)) — still open; neither checkpoint runs on A100/A800 or RTX 30xx. Highest-engagement issue of the day.
- **RADIO vision encoder refresh** ([PR #58468](https://github.com/vllm-project/vllm/pull/58468)) — updates vLLM's forked RADIO encoder to match current Transformers module tree and weight layout.
- **ROCm Qwen3.5 / Qwen3-Next fused QK-norm+RoPE+gate** ([PR #51406](https://github.com/vllm-project/vllm/pull/51406)) — enables the backend-agnostic Triton fusion kernel on ROCm (currently gated behind CUDA).
- **Muse Spark MonoKernel on MI350P** ([#63712](https://github.com/vllm-project/vllm/issues/63712)) — specialized decode path hard-wired to MI355X's 256 CUs refuses to run on 128-CU MI350P despite identical `gfx950` ISA.

## 4. Performance & Optimization

- **Separate prefill/decode CUDA graph capture sizes** ([PR #63406](https://github.com/vllm-project/vllm/pull/63406)) — recognizes that prefill batches are sized by *tokens* while uniform decode is sized by *requests × (1+K)*. Directly relevant to the SM120 graph-capture problems below.
- **FlashInfer autotune off-grid fix** ([PR #63159](https://github.com/vllm-project/vllm/pull/63159)) — when `--max-num-batched-tokens` isn't on the hybrid bucket grid (e.g. 21504), warmup stored profiles under keys serving never looked up, silently dropping to default tactics for M in 16385–21504.
- **FP8 KV dequant shared-memory reduction** ([PR #63642](https://github.com/vllm-project/vllm/pull/63642)) — broadcasts scalar dequant scales instead of staging full dequantized K/V tiles in shared memory before GEMM.
- **HiSparse multi-token prefetch** ([PR #63801](https://github.com/vllm-project/vllm/pull/63801), [#60103](https://github.com/vllm-project/vllm/pull/60103)) — extends shared-index group prefetch to MTP/speculative verification with bounded copy workers; fuses per-layer slot invalidation to one launch per step and masks CUDA-graph padding rows in the resolver.
- **CI image cache for PR builds** ([PR #64387](https://github.com/vllm-project/vllm/pull/64387), merged) — imports merge-base image cache, cutting ~13 min from PR image builds that previously recompiled every kernel.
- **Quark MXFP4 attention/MoE plan for MI355X** ([#59575](https://github.com/vllm-project/vllm/issues/59575)) — gfx950 tracker for `Qwen3.8-Flash-Next-Quark-MXFP4` (GatedDeltaNet ×36, QuerySparse Attention ×12, HyperConnection gated residual, MXFP4 MoE).

## 5. Stability & Regressions

Ranked by severity:

1. **TurboQuant `_continuation_prefill` OOM kills the engine** ([#40420](https://github.com/vllm-project/vllm/issues/40420)) — a single request with >~185K actual tokens reliably OOMs the whole engine, not just the request; requires server restart. Open since April, still unresolved.
2. **P2P KV offload tier fails slow on peer faults** ([#63602](https://github.com/vllm-project/vllm/issues/63602)) — NIXL/OffloadingConnector + TieringOffload path doesn't fail fast when a peer goes down; reproduced on H200 + mlx5 IB with three Qwen3-0.6B engines.
3. **SM120 CUDA graphs unusable for DeepSeek-V4.1-Flash** ([#56892](https://github.com/vllm-project/vllm/issues/56892)) — 8× RTX PRO 6000 Blackwell (SM120), TP=8, decode throughput extremely low under `--enforce-eager`; author explicitly asks to prioritize the SM120 graph-capture fix. The capture-size split in PR #63406 is the most likely relief valve.
4. **Recurring CUDA kernel hang on 2× DGX Spark (GB10, sm_12.1)** ([#41725](https://github.com/vllm-project/vllm/issues/41725)) — MiniMax-M2.7-NVFP4, TP=2 across two nodes over C2C/RoCE; hangs recur under vLLM 0.19.1 + CUDA 13.0.
5. **Eagle2/3 acceptance-length regression over time** ([#41838](https://github.com/vllm-project/vllm/issues/41838)) — spec-decode AL monotonically decays in 0.17.1 and never recovers without a full restart. Service-lifetime bug with direct cost impact.
6. **EngineDeadError with Kimi-K2.6 on 0.20.2** ([#42363](https://github.com/vllm-project/vllm/issues/42363)) — aarch64, TP setup undefined in report; unpatched.
7. **ROCm AWQ never uses RDNA W4A16 kernel** ([#63455](https://github.com/vllm-project/vllm/issues/63455)) — on gfx1151 (Radeon 8060S), AWQ decodes **2.5× slower than BF16** because the W4A16 kernel is bypassed entirely. Perf bug with a correctness-adjacent flavor (quantization silently not applied as intended on this path).
8. **OpenShift crash on gemma4-unified-cu129** ([#44548](https://github.com/vllm-project/vllm/issues/44548)) — container dies immediately with `KeyError`; 7 👍, still open.
9. **GDN prefix-cache hits lost under MTP spec decode** ([PR #52244](https://github.com/vllm-project/vllm/pull/52244)) — Qwen3.5-122B-A10B; prompts whose length is a multiple of the hash unit get no cache hit at all. Fix PR open.

## 6. What This Means for Application Developers

- **Don't assume quantized checkpoints run at their nominal speed on non-CUDA or prosumer paths.** The ROCm AWQ case (#63455) shows a silent 2.5× *slowdown* versus BF16 — benchmark before trusting AWQ on RDNA. Similarly, FlashInfer autotune key mismatches (#63159) mean certain `--max-num-batched-tokens` values can degrade silently with no warning.
- **Long-context requests are a blast-radius hazard, not just a latency hazard.** The 185K-token TurboQuant OOM takes down the entire engine (#40420). If you serve agent/RAG workloads with very long scaffolds, isolate them (separate deployment or hard token caps) until this is fixed.
- **Speculative decoding currently has two open service-lifetime issues** — Eagle AL decay requiring restarts (#41838) and lost GDN prefix-cache hits under MTP (#52244). If you rely on spec decode for cost reduction, monitor acceptance length as an SLO, not just a tuning knob.
- **KV-connector ecosystem is churning productively but breaking around the edges.** NIXL checkpoint/restore hooks (#64371), Mooncake sleep-mode registration (#59934), and the new transfer-region contract (#64388) all landed or are in review; custom connectors and P/D-disaggregated deployments should pin versions and re-validate.
- **Blackwell owners running DeepSeek V4-Flash derivatives should watch PR #63406.** The prefill/decode graph-size split is the structural fix underneath both the SM120 regression (#56892) and part of the SM8x support gap (#50576) — worth tracking rather than working around with `--enforce-eager`, which the reporter measured as unacceptably slow.

</details>

<details>
<summary><strong>SGLang</strong> — <a href="https://github.com/sgl-project/sglang">sgl-project/sglang</a></summary>

# SGLang Digest — 2026-10-29

## 1. Today's Highlights

No new releases in the last 24h. The most consequential activity centers on the Rust frontend's observability stack (a five-PR chain landing `/generate` meta_info for cached tokens, scheduler stats, extension hooks, and HTTP-layer timing) and a cluster of high-severity HiCache/storage issues on hybrid and long-context workloads. On the hardware side, AMD consumer RDNA3/RDNA4 support momentum continues with a new CI/upstreaming plan, while a QuickReduce INT8 default was pulled from the AMD Docker image after reproducible long-context accuracy regressions.

## 2. Releases & Breaking Changes

No new releases. One noteworthy default change in flight:

- **[Fix][AMD] docker: Remove implicit INT8 QuickReduce default** — [#47163](https://github.com/sgl-project/sglang/pull/47163). The implicit `QUICK REDUCE QUANTIZATION` default in the AMD Docker image is being removed after multiple maintainers and production deployments reported significant quality degradation on 800k+ long-context evals. Users pinning the AMD image should verify whether they were relying on this default.

## 3. New Model & Hardware Support

- **[Feat][AMD] diffusion: quantized attention backends for GFX942/GFX950** — [#35151](https://github.com/sgl-project/sglang/pull/35151). Adds quantized attention paths for diffusion models on Instinct MI300/MI350-class hardware.
- **[Feat][NPU] diffusion: MXFP8 attention for MiniMax H3** — [#42221](https://github.com/sgl-project/sglang/pull/42221). Enables MXFP8 FlashAttention on Ascend NPU and relaxes sequence-length constraints for MiniMax H3 diffusion.
- **[Feat][MUSA] portable capture status for breakable CUDA graphs** — [#47034](https://github.com/sgl-project/sglang/pull/47034). Moore Threads MUSA now uses the portable `is_current_stream_capturing()` path instead of falling through to the NVIDIA-only cuda-python branch. Ties into the MUSA roadmap [#16565](https://github.com/sgl-project/sglang/issues/16565).
- **[Feature][AMD] RDNA3/RDNA4 (gfx1100/gfx1201) CI and upstreaming plan** — [#46900](https://github.com/sgl-project/sglang/issues/46900). Follow-up to the tracking umbrella [#30599](https://github.com/sgl-project/sglang/issues/30599); SGLang's ROCm path is currently datacenter-Instinct-only, and this issue lays out the concrete path to consumer Radeon enablement.

## 4. Performance & Optimization

- **Rust frontend observability chain (5 stacked PRs)** — the largest coordinated effort in the queue:
  - [#46949](https://github.com/sgl-project/sglang/pull/46949) (closed/landed): carry `customized_info` through the native `/generate` frontend.
  - [#46961](https://github.com/sgl-project/sglang/pull/46961): report cached tokens **by cache tier** (`meta_info.cached_tokens_details` was previously missing in Rust mode).
  - [#46963](https://github.com/sgl-project/sglang/pull/46963): report scheduler per-request stats in `/generate` meta_info.
  - [#47112](https://github.com/sgl-project/sglang/pull/47112): give server-extension hooks the request, headers, and outcome.
  - [#47160](https://github.com/sgl-project/sglang/pull/47160): let an HTTP layer start a native `/generate` request's timing.
  Together these close the parity gap between the Python and Rust frontends for production telemetry.
- **[Perf] moe: fold routed scaling into mega MoE pre-dispatch** — [#46090](https://github.com/sgl-project/sglang/pull/46090). Eliminates an extra elementwise kernel launch on the decode-critical path when `routed_scaling_factor != 1`.
- **[Perf] lora: avoid O(tokens) per-token expansion in `build_lm_head_pass_segments`** — [#47164](https://github.com/sgl-project/sglang/pull/47164). Targets chunked input-logprobs processing (`SGLANG_ENABLE_LOGPROB_CHUNK=True`, default 2048) with an `lm_head` LoRA adapter.
- **[Perf][NVIDIA] qsa: share compressed-key reads across four verify rows** — [#46631](https://github.com/sgl-project/sglang/pull/46631). At 112–256 verify rows, each CTA was walking 1/16 of a long context serially; with MTP the four verify rows also re-read identical compressed keys.
- **[Perf][NVIDIA] gdn: configurable ReplaySSM verify pipeline stages** — [#46633](https://github.com/sgl-project/sglang/pull/46633). Three Triton pipeline stages helped Qwen3.8 Flash-Next on Rubin but regressed several GB300 shapes (esp. FP32 SSM checkpoints), so the 2-stage default is preserved and 3-stage is opt-in via env var.
- **[Feat] cp: FlashInfer prefill context parallelism** — [#33226](https://github.com/sgl-project/sglang/pull/33226). Zigzag-sharded queries with gathered KV into the full paged cache for dense MHA/GQA, closing a FlashInfer CP coverage gap ([#21788](https://github.com/sgl-project/sglang/issues/21788)).
- **[Feat] cp: KV layout hooks and padded storage accounting** — [#45434](https://github.com/sgl-project/sglang/pull/45434). Decouples CP compute layout from KV storage layout, with explicit capacity accounting separating logical tokens from physical rows.
- **[Feat][AMD] mamba: store HiCache checkpoints without a GPU slot** — [#44718](https://github.com/sgl-project/sglang/pull/44718). On a Kimi-K3 c=48 recipe the GPU mamba pool floor was `max_running_requests * 5` (480 slots); this lets checkpoints be reloaded from host instead.
- **[Refactor][NVIDIA] migrate DSA/DSV4 indexers to DeepGEMM 0.2.5.post1** — [#44350](https://github.com/sgl-project/sglang/pull/44350). Bumps `sgl-deep-gemm` and moves DeepSeek-V3.2, V4, and V4.1 indexer call sites to the replacement MQA-logits API.

## 5. Stability & Regressions

Ranked by severity:

1. **HiCache `write_back` eviction blocks the scheduler hundreds of ms per call** — [#46952](https://github.com/sgl-project/sglang/issues/46952). Production fleet observed ~500× per-call eviction latency (0.6 ms → ~300 ms) after switching from `write_through` to `write_back`, plus a lower prefix-cache hit rate. No fix PR referenced yet.
2. **HiCache `buffer_only` + Mooncake L3 crashes scheduler under chunked prefill** — [#45989](https://github.com/sgl-project/sglang/issues/45989). Reported while benchmarking GLM-5.3 W4AFP8 on 8×H200: scheduler admits a chunked prefill it cannot finish, then dies with "Prefill out of memory" (evictable 0, every radix node locked).
3. **HiCache host-tier hits drop to zero on hybrid GDN models** — [#45400](https://github.com/sgl-project/sglang/issues/45400). Host mamba pool exhausts while KV remains on host once the evicted working set exceeds ~3 long prefixes.
4. **GLM-5.3 FP8 inference hangs after sustained workload with full KV cache** (TP8, EAGLE, H200) — [#45781](https://github.com/sgl-project/sglang/issues/45781).
5. **Weight updates silently overwrite DFLASH draft weights** — [#46806](https://github.com/sgl-project/sglang/issues/46806). `update_weights_from_disk` has no `selector` to prevent loading the target model's weights into a draft; same symptom as THUDM/slime#1177 with EAGLE3.
6. **Speculative vs. ordinary decoding produce different greedy outputs (DeepSeek-V4-Flash)** — [#45525](https://github.com/sgl-project/sglang/issues/45525). Correctness divergence between decode paths.
7. **Qwen3.5-9B deterministic greedy output differs under mixed-chunk scheduling** — [#46446](https://github.com/sgl-project/sglang/issues/46446). Batching-dependent nondeterminism, a latent reproducibility hazard.
8. **FlashInfer `cascade` JIT-compiles on first prefixed request (~4.5 s) on pip installs** — [#46803](https://github.com/sgl-project/sglang/issues/46803). Cold-start latency spike.
9. **CI flakiness tracker remains the highest-traffic issue** — [#42752](https://github.com/sgl-project/sglang/issues/42752) (137 comments). Ongoing NVIDIA `PR Test Base`/`PR Test Extra` infrastructure failures.
10. **Responses API: replayed Codex turn split into three assistant blocks** — [#42110](https://github.com/sgl-project/sglang/issues/42110). Tool-call phase merge logic causes the model to learn to end its turn before the tool call.
11. **Qwen3.8-27B drops tool calls** — [#46742](https://github.com/sgl-project/sglang/issues/46742). Model emits reasoning text but no tool call, then concludes without evidence.

Closed/resolved: [#25790](https://github.com/sgl-project/sglang/issues/25790) (logprob mismatch with FP8 KV on H100), [#45426](https://github.com/sgl-project/sglang/issues/45426) (FLA kernels failing on nightly-cu134 due to removed `tl.make_block_ptr`), [#36886](https://github.com/sgl-project/sglang/issues/36886) (DCP index-K OOB on GLM-5.3 norope MLA), [#37379](https://github.com/sgl-project/sglang/issues/37379) (Qwen3.5-MoE FP8 KV quant-param-path crash).

## 6. What This Means for Application Developers

- **Rust frontend is approaching telemetry parity with Python — but not there yet.** If you run the Rust server in production, per-request timing, cache-tier breakdowns, and scheduler stats are landing now. Until the stack merges, expect `meta_info.cached_tokens_details` and extension hooks to behave differently between frontends; avoid building billing or routing logic on native `/generate` fields without a frontend check.
- **HiCache tuning is a production footgun this week.** If you switched to `write_back` for cache capacity, measure `eviction_duration_seconds` and prefix hit rate before and after — the reported ~500× eviction slowdown can dominate steady-state latency. Similarly, `buffer_only` + Mooncake L3 is failing under GLM-5.3 chunked prefill; stay on `write_through` for now.
- **Determinism is not guaranteed across scheduling configurations.** Two independent reports ([#46446](https://github.com/sgl-project/sglang/issues/46446), [#45525](https://github.com/sgl-project/sglang/issues/45525)) show greedy outputs diverging between mixed-chunk scheduling and speculative decoding. If your evals or agent traces depend on reproducible outputs, pin scheduling to a single configuration and re-validate after upgrades.
- **Agent reliability: tool-call handling has two open bugs.** The Responses API turn-splitting issue ([#42110](https://github.com/sgl-project/sglang/issues/42110)) can train models to end turns before tool calls in replayed transcripts, and Qwen3.8-27B is dropping tool calls entirely in a separate report ([#46742](https://github.com/sgl-project/sglang/issues/46742)). Validate agent trajectories when upgrading either the server or the model.
- **Long-context AMD deployments: audit your quantization defaults.** The QuickReduce INT8 default removal ([#47163](https://github.com/sgl-project/sglang/pull/47163)) means behavior may change without a version bump if you pull the Docker image. Re-run long-context evals after the image updates.
- **MoE and LoRA serving both get cheaper on the decode path.** The routing-scale kernel fold ([#46090](https://github.com/sgl-project/sglang/pull/46090)) and the LoRA logprob expansion fix ([#47164](https://github.com/sgl-project/sglang/pull/47164)) are incremental but land on the hottest code paths — worth tracking if you serve high-QPS decode with `routed_scaling_factor != 1` or run chunked logprobs with `lm_head` adapters.

</details>

<details>
<summary><strong>llama.cpp</strong> — <a href="https://github.com/ggml-org/llama.cpp">ggml-org/llama.cpp</a></summary>

# llama.cpp Digest — 2026-10-29

## 1. Today's Highlights

The headline event is the **v0.8.0 release**, which lands the LiquidAI LFM3 family (text, vision, audio, omni) alongside an experimental streaming-audio `mtmd` API and realtime audio endpoints (`/v1/realtime`, `/tts`) on the server. Backend momentum continues on quantized GEMM kernels across CPU (SVE), OpenCL/Adreno, Hexagon, CUDA, and SYCL, with several landed and in-flight PRs targeting MoE and short-row attention paths. Meanwhile, a cluster of SYCL/Vulkan MoE performance regressions and a CUDA-graph hang on sm_120 remain the most notable open stability concerns.

## 2. Releases & Breaking Changes

- **v0.8.0** — major release; bump commit: [PR #31309](https://github.com/ggml-org/llama.cpp/pull/31309), release notes: [v0.8.0](https://github.com/ggml-org/llama.cpp/releases). Adds LFM3 family, streaming-audio `mtmd` API (experimental), and server-side realtime audio (`/v1/realtime`, `/tts`). Treat the audio API as unstable — no migration notes or deprecations were published. Attestation: [60965905](https://github.com/ggml-org/llama.cpp/attestations/60965905).
- **b11972** — `common, mtmd`: bounds control-vector layer indices and M-RoPE position loops ([PR #31336](https://github.com/ggml-org/llama.cpp/pull/31336)). Fixes two out-of-bounds writes; relevant to anyone loading control vectors or using Qwen-VL/GLM/PaddleOCR/Qwen2.5-VL vision paths.
- No config or API breaking changes were reported beyond the new (experimental) audio endpoints.
- Build/test fix: [PR #31330](https://github.com/ggml-org/llama.cpp/pull/31330) addresses CI flakes in server cancel/sleep tests on Windows.

## 3. New Model & Hardware Support

- **LiquidAI LFM3** (text / vision / audio / omni) — new architecture family in v0.8.0, plus streaming audio via `mtmd` ([v0.8.0](https://github.com/ggml-org/llama.cpp/releases)).
- **Hexagon: conv2d support** — implicit GEMM with double-buffered staging and a unified block-transpose path ([b11970 / PR #30995](https://github.com/ggml-org/llama.cpp/pull/30995)).
- **OpenCL: IQ1_S / IQ1_M** — initial IQ1 support with early Adreno tuning ([PR #31341](https://github.com/ggml-org/llama.cpp/pull/31341)).
- **OpenVINO: strided SCALE views** — fixes incorrect results on dynamic-path SCALE with sliced inputs ([PR #31334](https://github.com/ggml-org/llama.cpp/pull/31334)).
- **DeepSeek-V4.1-Flash** continues in draft ([PR #30817](https://github.com/ggml-org/llama.cpp/pull/30817)); see regressions below.

## 4. Performance & Optimization

- **SVE (256-bit) GEMM for q6_K** — `ggml_gemv_q8_0_4x8_q8_0` and `q6_K` kernels for Arm SVE (`svcntb() == 32`); reported prefill improvement on Llama-3.2-3B (see benchmarks in [PR #30585](https://github.com/ggml-org/llama.cpp/pull/30585), [b11968 / PR #27472](https://github.com/ggml-org/llama.cpp/pull/27472)).
- **CUDA: fused MoE gate/up + GLU in MMQ** — fuses `MUL_MAT_ID` gate/up projection with GLU, cutting kernel count on MoE decode ([b11962 / PR #31188](https://github.com/ggml-org/llama.cpp/pull/31188)).
- **OpenCL: tiled q4_K GEMM for Adreno** — routes the tiled q4_K lm_head through a tiled dp4a GEMM at batch > 1 ([b11971 / PR #30412](https://github.com/ggml-org/llama.cpp/pull/30412)).
- **SYCL: work-group argmax for short TOP_K rows** — faster top-k for rows ≤ work-group size ([b11963 / PR #31110](https://github.com/ggml-org/llama.cpp/pull/31110)).
- **IQ4 quant creation** — pre-computed halfway points speed up IQ4 quant generation ([b11969 / PR #31201](https://github.com/ggml-org/llama.cpp/pull/31201)).
- **MoE expert caching** — in-flight work on CPU-resident miss execution ([PR #30966](https://github.com/ggml-org/llama.cpp/pull/30966)) and a hybrid `--moe-cache-cpu-share auto` / CRF admission mode ([PR #31286](https://github.com/ggml-org/llama.cpp/pull/31286)). Related feature request: GPU-resident LRU expert cache ([Issue #29949](https://github.com/ggml-org/llama.cpp/issues/29949)).
- **Batched tensor copy API** — generic `ggml_backend_tensor_set_n/get_n/copy_n` superseding `_2d` ([PR #30881](https://github.com/ggml-org/llama.cpp/pull/30881)); CUDA-side optimization gathers fragmented KV reads into mapped host memory ([PR #30986](https://github.com/ggml-org/llama.cpp/pull/30986)).

## 5. Stability & Regressions

Ranked by severity:

1. **CUDA graphs hang on RTX 5090 / sm_120** — GPU channel hang with RC watchdog and Xid 8; `GGML_CUDA_DISABLE_GRAPHS=1` is a full workaround ([Issue #27330](https://github.com/ggml-org/llama.cpp/issues/27330)). No fix PR referenced. Avoid CUDA graphs on sm_120 in production, or pin the workaround env var.
2. **Vulkan: deterministic GPU hang + SIGABRT on Intel UHD 630 with q8_0 KV cache** — `vk::Error` escapes as `std::terminate` ([Issue #29054](https://github.com/ggml-org/llama.cpp/issues/29054)). No fix PR referenced; avoid q8_0 KV on Gen9.5.
3. **Vulkan: decode collapse with deep context on Intel Arc Pro B70 (Xe2)** — ~8x throughput loss from 1k→64k context; SYCL degrades only ~2.4x ([Issue #28721](https://github.com/ggml-org/llama.cpp/issues/28721)).
4. **SYCL MoE prompt-processing regression ~35%** — `-ncmoe` CPU-offloaded experts slower in b11804 vs b11046; XMX-ESIMD path also ~28–35% slower on Arc B70 ([Issue #31262](https://github.com/ggml-org/llama.cpp/issues/31262), [Issue #31068](https://github.com/ggml-org/llama.cpp/issues/31068)).
5. **`--moe-cache-mib` crashes at load on Vulkan** (RX 6900 XT, Windows) ([Issue #30697](https://github.com/ggml-org/llama.cpp/issues/30697)).
6. **DeepSeek-V4.1-Flash (draft PR #30817) single-token corruption with cached prompt prefix** — Engram n-gram history ([Issue #30944](https://github.com/ggml-org/llama.cpp/issues/30944)). Draft-branch only.
7. **Server OOM via unbounded `repeat_last_n` / `dry_penalty_last_n`** — multi-GB zero-filled buffers allocated; treat these params as untrusted input ([Issue #29494](https://github.com/ggml-org/llama.cpp/issues/29494)).
8. **WebUI instruction injection via `?q=` query parameter** ([Issue #25790](https://github.com/ggml-org/llama.cpp/issues/25790)) — security-relevant for exposed servers.
9. **`--split-mode tensor` crashes on second request** with multi-GPU P100 ([Issue #29466](https://github.com/ggml-org/llama.cpp/issues/29466)); tensor-split memory leak on dual Intel B70 SYCL ([Issue #27845](https://github.com/ggml-org/llama.cpp/issues/27845)).
10. **Other correctness/tooling**: SYCL CPY to q4_1/q5_1/q8_0 mismatches CPU reference ([Issue #31140](https://github.com/ggml-org/llama.cpp/issues/31140)); Vulkan `count_experts.comp` redundant loop ([Issue #31163](https://github.com/ggml-org/llama.cpp/issues/31163)); Qwen3.6 tool calls leaking into content ([Issue #30118](https://github.com/ggml-org/llama.cpp/issues/30118)); GBNF stack overflow via nested repetition ([Issue #18988](https://github.com/ggml-org/llama.cpp/issues/18988), closed stale); MSVC not detecting AVX-VNNI ([Issue #28295](https://github.com/ggml-org/llama.cpp/issues/28295)).

## 6. What This Means for Application Developers

- **Audio is now a first-class server capability (experimental).** If you're building voice agents, v0.8.0's `/v1/realtime` and `/tts` plus LFM3 omni open a path to end-to-end speech without a separate audio stack — but plan for API churn.
- **Pin your backend carefully.** CUDA graphs on sm_120 (RTX 5090) and q8_0 KV on Intel Gen9.5 Vulkan are effectively unsafe today. If you run Intel Arc, SYCL MoE prefill has an active regression; consider b11046-class builds until resolved.
- **MoE serving economics are improving fast.** Fused CUDA gate/up+GLU, expert caching with CPU fallback, and GPU-resident LRU proposals all target the dominant cost in large-MoE decode. Expect `--moe-cache-*` flags to become the key tuning surface; budget time to benchmark per workload.
- **Harden the server surface.** The WebUI query-param injection and unbounded sampler-parameter OOM are reminders that `llama-server` should sit behind authentication and input validation in any multi-tenant deployment.
- **Arm and Adreno clients benefit immediately.** SVE GEMM and OpenCL q4_K tiling improve edge/NPU/phone-class inference without model changes — worth re-benchmarking your existing deployments on these targets.

</details>

<details>
<summary><strong>Ollama</strong> — <a href="https://github.com/ollama/ollama">ollama/ollama</a></summary>

# Ollama Digest — 2026-10-29

## Today's Highlights

Ollama shipped `v0.40.13-rc1`, bundling LFM3 GGUF fixes (including llama-server speech support) and a llama.cpp bump to b11963. The dominant theme across issues today is **MLX runtime friction**: users on Linux/Windows are pulling `lfm3-audio`, `lfm3`, and `gemma4:*-mlx` tags that silently require MLX, producing hard failures with no pre-download warning. Meanwhile, ongoing performance regressions on Vulkan/AMD and a broader ~25–30% throughput drop versus v0.40.1 remain open and unresolved.

## Releases & Breaking Changes

- **v0.40.13-rc1 released** — two changes: [`llm: LFM3 GGUF fixes and llama-server speech`](https://github.com/ollama/ollama/pull/19344) by @dhiltgen, and [`llama.cpp: version bump b11963`](https://github.com/ollama/ollama/pull/19360). No API/config breaking changes documented in this release batch.
- **CLI behavior change incoming**: [`cmd: show help when running ollama without arguments`](https://github.com/ollama/ollama/pull/19248) (closed/merged) replaces the old root welcome entrypoint with `ollama --help` output. Scripts relying on the prior no-arg behavior should be audited.
- Note for developers pulling quantized tags: MLX-only model tags are not currently labeled in the library, which is now a recurring source of failed pulls (see Issues #19343, #19369, #19355).

## New Model & Hardware Support

- **LFM3 GGUF + speech**: LFM3 GGUF fixes land in [`#19344`](https://github.com/ollama/ollama/pull/19344), adding llama-server speech support.
- **Video input for MLX**: [`mlx: add video input support`](https://github.com/ollama/ollama/pull/19348) (OPEN) — LFM3-VL, LFM3-Omni, and Qwen3.5/3.6 MLX models accept MP4/MOV clips via the existing `images` field in `/api/chat` and `/api/generate`. Content-based detection; new `"video"` capability reported by models that support it.
- **MLX on Windows + CPU backend**: [`mlx: add Windows support and CPU backend for MLX runner`](https://github.com/ollama/ollama/pull/19366) (OPEN) — native Windows MLX execution with a CPU backend alongside Metal/CUDA, including a dtype patch fix. This is significant given the MLX-runtime issues plaguing non-Apple hosts today.
- **Vision capability correctness**: [`server: report vision only for projectors with a vision encoder`](https://github.com/ollama/ollama/pull/19328) (closed/merged) fixes audio-only projectors (e.g., Voxtral Mini) falsely advertising `vision`.
- **Community integrations** added: Amical (dictation, macOS/Windows), Vauta (meeting transcription, macOS), Quock (iOS client), kde-ollama-gui, and self-host. See PRs [#19374](https://github.com/ollama/ollama/pull/19374), [#19364](https://github.com/ollama/ollama/pull/19364), [#19361](https://github.com/ollama/ollama/pull/19361), [#19371](https://github.com/ollama/ollama/pull/19371), [#19362](https://github.com/ollama/ollama/pull/19362).

## Performance & Optimization

- **Speculative decoding metrics land**: [`report per-request speculative decoding metrics`](https://github.com/ollama/ollama/pull/19368) (OPEN) — API responses and `ollama run --verbose` now report drafted and accepted token counts, addressing the misleading nature of acceptance-rate-only reporting.
- **Vulkan/AMD RADV ~30× slowdown**: [`#19201`](https://github.com/ollama/ollama/issues/19201) — Ollama 0.40.8 on Ubuntu 24.04 with RX 6600 XT exhibits ~29.7× throughput collapse on the second identical request when prompt cache is enabled. Model is fully GPU-offloaded. Open, needs info.
- **Broad 25–30% regression vs v0.40.1**: [`#18968`](https://github.com/ollama/ollama/issues/18968) — cross-model t/s drop reported; open, needs info.
- **Gemma 4 E-series memory overestimation**: [`#19357`](https://github.com/ollama/ollama/issues/19357) — scheduler predicts 3–4× actual VRAM for `gemma4:e4b`, evicting co-resident models. Suspected cause: CPU-mapped per-layer embedding weights counted as GPU memory. Open.
- **Metal unary crash workaround**: [`llama.cpp: workaround Metal unary crash`](https://github.com/ollama/ollama/pull/19372) (closed) — temporary patch for `ggml_metal_library_compile_all: failed to build 'unary' library` on older macOS.

## Stability & Regressions

Ranked by severity:

1. **Vulkan/AMD second-request collapse (~30× slowdown)** — [`#19201`](https://github.com/ollama/ollama/issues/19201). No fix PR visible yet. High impact for AMD RADV users with prompt cache enabled.
2. **MLX runtime unavailable → failed pulls** — [`#19343`](https://github.com/ollama/ollama/issues/19343) (closed, 10 comments) and [`#19369`](https://github.com/ollama/ollama/issues/19369) (closed). `lfm3-audio:latest` and `lfm3` fail on Linux with "requires MLX runtime" after manifest pull. Documentation gap acknowledged; filterability requested in [`#19355`](https://github.com/ollama/ollama/issues/19355).
3. **Claude Desktop prefill failure + MLX cache loss** — [`#19359`](https://github.com/ollama/ollama/issues/19359) (OPEN) — ~17K initial prefill, HTTP 500 retries, MLX cache loss on 0.40.11–0.40.12, M4 Max 64 GiB, 256K configured context.
4. **Pull resume corruption after server restart >1h** — [`#19337`](https://github.com/ollama/ollama/issues/19337) — `remove ...-partial-0: cannot find the file` on every retry, or digest mismatch.
5. **Tool-calling regression with MLX Qwen3.8 27B** — [`#19353`](https://github.com/ollama/ollama/issues/19353) — `qwen3.8:27b-mlx` only emits `tool_calls` when `content` is empty; free-text-first patterns break.
6. **`ollama show --modelfile` round-trip failure** — [`#19342`](https://github.com/ollama/ollama/issues/19342) — values containing `"""` followed by whitespace serialize to unparseable Modelfiles that `ollama create` rejects. Fix PR: [`#19363`](https://github.com/ollama/ollama/pull/19363).
7. **macOS 27 "Golden Gate" app UI regression** — [`#19370`](https://github.com/ollama/ollama/issues/19370) (closed) — Electron bundle `com.electron.ollama` not found; server/CLI still work.
8. **Gemma 4 thinking disable unreliable via OpenAI API** — [`#19217`](https://github.com/ollama/ollama/issues/19217) (closed).
9. **Qwen3.5 9B JSON Schema constraint failure with `think: false`** — [`#19350`](https://github.com/ollama/ollama/issues/19350) (OPEN, 0.32.8).
10. **Vulkan gibberish on qwen2.5-coder / qwen3** — [`#16281`](https://github.com/ollama/ollama/issues/16281) (long-standing, needs info).

Also notable: [`#19365`](https://github.com/ollama/ollama/pull/19365) fixes whitespace handling in `OLLAMA_ORIGINS` / `OLLAMA_REMOTES` CORS matching; [`#19248`](https://github.com/ollama/ollama/pull/19248) adds help output for bare `ollama`; [`#19349`](https://github.com/ollama/ollama/pull/19349) clears stale session system prompt on `/load`.

## What This Means for Application Developers

- **Pin your model tags and verify runtime compatibility before shipping**. MLX-only tags (e.g., `gemma4:12b-mlx`, `qwen3.8:27b-mlx`, `lfm3-*`) will hard-fail on non-Apple hosts after a partial pull. Build a preflight check into agent startup.
- **Tool-calling remains fragile on MLX builds**. If your agent emits natural-language preamble before tool calls, `qwen3.8:27b-mlx` will silently skip the call. Prefer empty-content-first tool invocation or route to non-MLX tags until [#19353](https://github.com/ollama/ollama/issues/19353) is resolved.
- **Speculative decoding observability is coming** ([#19368](https://github.com/ollama/ollama/pull/19368)) — start instrumenting drafted/accepted token ratios now to tune draft depth per workload; acceptance rate alone is insufficient.
- **Video input over the existing `images` field** ([#19348](https://github.com/ollama/ollama/pull/19348)) is a low-friction upgrade path if you're already sending image payloads — no new API surface required.
- **Avoid `ollama show --modelfile` round-trips** in automation until [#19363](https://github.com/ollama/ollama/pull/19363) lands; if you generate Modelfiles from existing models, validate with `ollama create` in CI.
- **AMD/ROCm users on Vulkan**: keep `OLLAMA_VULKAN=1` prompt-cache disabled until [#19201](https://github.com/ollama/ollama/issues/19201) is diagnosed — the second-request collapse is trivially reproduced.

</details>

<details>
<summary><strong>LiteLLM</strong> — <a href="https://github.com/BerriAI/litellm">BerriAI/litellm</a></summary>

# LiteLLM Digest — 2026-10-29

## Today's Highlights
LiteLLM remains in active recovery from the **v1.107.0 supply-chain compromise** (issue [#47826](https://github.com/BerriAI/litellm/issues/47826)), with PyPI removal confirmed and Docker tags yanked, but backport gaps still leaving stable/1.106.x images trusting the wrong eMudhra root CA ([#47904](https://github.com/BerriAI/litellm/issues/47904)). Feature work continues on **MCP route hardening** (400 instead of silent drops), a **Rust gateway migration** for sub-1ms overhead ([#31263](https://github.com/BerriAI/litellm/issues/31263)), and **Router interface refactoring** to prepare for the Rust path. Cost-tracking correctness remains the single largest bug cluster.

## Releases & Breaking Changes
- **v1.109.0-dev.1**, **v1.106.6**, **v1.105.7** published; all Docker images now require **cosign verification** against key from commit [`e82a3c6`](https://github.com/BerriAI/litellm/commit/e82a3c646908ba0a6ee0beddc4310d7a6cac4065). Update any image-pinning CI to verify signatures — unsigned pulls should fail closed.
- **Vertex AI Claude `/v1/messages` breaking fix** ([PR #48814](https://github.com/BerriAI/litellm/pull/48814)): the anthropic Python SDK 2.x `anthropic-version` header is being moved into the request body. Vertex currently 400s on SDK 2.x clients; this is a **behavioral change for pass-through callers**.
- **MCP hosted tools** ([PR #48931](https://github.com/BerriAI/litellm/pull/48931)): requests that a translated route (Bedrock, Vertex, Gemini, DeepSeek, Databricks Claude, GigaChat) cannot execute will now **return 400** instead of silently 200-ing without the MCP server. Under `drop_params` they are dropped — audit any config relying on the old silent behavior.
- **Admin-owned team keys** ([PR #47729](https://github.com/BerriAI/litellm/pull/47729)): admin team keys with no MCP servers selected now bind to the team's MCP servers only, matching team model access. May break workflows that depended on the permissive fallback.
- **Context management** ([PR #47857](https://github.com/BerriAI/litellm/pull/47857)): `clear_tool_uses` token triggers now count the system prompt on `/v1/messages` routes where LiteLLM fills context management (Gemini/Claude via OpenRouter), matching Anthropic semantics. Token budgeting for long-system-prompt agents will shift.

## New Model & Hardware Support
No new model families or accelerator backends (CUDA/ROCm/Metal) merged today. Provider-side additions:
- **Azure Document Intelligence OCR**: `outputContentFormat=markdown` now correctly sent on the URL for the `/ocr` route ([PR #48926](https://github.com/BerriAI/litellm/pull/48926)) — headings/tables are preserved.
- **Deepgram streaming TTS**: new WebSocket pass-through `/deepgram/v1/speak` with per-character billing at Aura/Aura-2 rates ([PR #48521](https://github.com/BerriAI/litellm/pull/48521)).
- **QwenCloud migration path** proposed for the existing DashScope provider ([#36150](https://github.com/BerriAI/litellm/issues/36150), closed).

## Performance & Optimization
- **Rust gateway migration** ([#31263](https://github.com/BerriAI/litellm/issues/31263)) remains the marquee performance track — target is **sub-1ms proxy overhead**. Router boundary refactor ([PR #48840](https://github.com/BerriAI/litellm/pull/48840), stacked on #48839) is the second of three steps isolating `litellm.Router` behind a narrow interface, purely structural for now.
- **Daily-limit reset control** ([PR #48957](https://github.com/BerriAI/litellm/pull/48957)): deployments with `rpd`/`tpd` can now set `reset_time: "HH:MM"` (UTC) to align window rollover with provider tiers (e.g., Google free tier midnight Pacific). Useful for teams fighting TPM/RPD pressure.
- **Background streaming guardrail scans** ([PR #48952](https://github.com/BerriAI/litellm/pull/48952)): `streaming_scan_in_background: true` lets Bedrock guardrails scan mid-stream without pausing chunks; flagged scans terminate before the next chunk. Reduces TTFT impact of moderation.
- **Deduplicated pass-through auth** ([PR #48942](https://github.com/BerriAI/litellm/pull/48942)): Vertex pass-through was checking proxy keys twice, causing budgeted keys to exhaust prematurely and holding ~$0.85 of Gemini tokens per request. Now checked once.

## Stability & Regressions
Ranked by severity:

1. **CRITICAL — Supply-chain compromise, partially unfixed downstream** ([#47826](https://github.com/BerriAI/litellm/issues/47826)): v1.107.0 shipped a `cook.pth` credential stealer + `sitecustomize` RCE loader, built from lookalike repo `Berri-AI/litellm`. PyPI removed, Docker `latest`, `main-latest`, `main-stable` yanked. **Stable/1.106.x images still trust `emSign ECC Root CA - G3`**, the root the compromised eMudhra intermediates chain to — backport of #47670 requested in [#47904](https://github.com/BerriAI/litellm/issues/47904). **Fix exists on `main`; not yet in a stable tag.**
2. **HIGH — Spend logs silently dropped** ([#39749](https://github.com/BerriAI/litellm/issues/39749), closed): since v1.99.0, providers returning `id: null` (Databricks-Gemini) cause `request_id = "None"` and primary-key collisions in SpendLogs. Closed, but verify your deployment stream.
3. **HIGH — Streaming cost correctness** ([#42161](https://github.com/BerriAI/litellm/issues/42161), closed): streamed requests billed **$0** when `provider_response_model` slug is missing from the price map (dated Anthropic builds). One reporter saw 74/89 billable calls logged free. Closed; confirm your priced slugs.
4. **MEDIUM — Cost tracking under wrong provider** ([#47675](https://github.com/BerriAI/litellm/issues/47675), open): `response_cost` null when `custom_llm_provider=anthropic` but the priced row lives under a different provider.
5. **MEDIUM — Responses bridge double-counts tool args** ([#48773](https://github.com/BerriAI/litellm/issues/48773), closed): Azure `/responses`-bridged streaming duplicates function-call argument fragments.
6. **MEDIUM — TPM reservation inflation** ([#47814](https://github.com/BerriAI/litellm/issues/47814), closed): base64 images nested in `custom_tool_call_output` counted as text, roughly doubling token estimates.
7. **LOW — Nebius cost off by 10x** ([#41782](https://github.com/BerriAI/litellm/issues/41782), open): reported $250 vs real $2500.
8. **LOW — Complexity router / classifier config**: `max_tokens` replaced by tier ceiling rather than clamped ([#44869](https://github.com/BerriAI/litellm/issues/44869)); `jev_classifier_config.api_key` does not resolve `os.environ/` ([#43826](https://github.com/BerriAI/litellm/issues/43826)).
9. **LOW — Miscellaneous translation edge cases**: Mistral drops replayed `reasoning_content` ([#45546](https://github.com/BerriAI/litellm/issues/45546)); Anthropic `/v1/messages` drops `role:"system"` inside `messages[]` ([#36917](https://github.com/BerriAI/litellm/issues/36917)); `chatgpt/*` drops `response_format` and rejects string input ([#38085](https://github.com/BerriAI/litellm/issues/38085)); `/v1/responses` doesn't normalize string `input` ([#41963](https://github.com/BerriAI/litellm/issues/41963)); `stop_reason: model_context_window_exceeded` mapped to `"stop"` ([#43012](https://github.com/BerriAI/litellm/issues/43012)); `BaseModelResponseIterator` false-terminates streams on `[DONE]` in tool args ([#31562](https://github.com/BerriAI/litellm/issues/31562)).
10. **LOW — Prisma binaries fetched at startup since v1.92.0** ([#33167](https://github.com/BerriAI/litellm/issues/33167), open): fails in air-gapped/corporate egress-restricted networks.

## What This Means for Application Developers
- **Pin and verify.** Move to v1.106.6 / v1.105.7+ with cosign verification; treat v1.107.0 and any unpinned `latest` as radioactively bad. If you run 1.106.x, check whether your image is post-eMudhra-backport — it currently is not.
- **Reconcile spend data now.** If you route streaming traffic through a proxy with Databricks-Gemini, Nebius, or slug-mismatched Anthropic deployments, query SpendLogs for `request_id = "None"` or `spend = 0` and cross-check against provider invoices. Multiple fixes landed; a few remain open.
- **Audit MCP and team-key scoping.** The new 400-on-unsupported-MCP behavior and team-key MCP binding changes could surface as runtime 4xx in agent pipelines that previously succeeded silently. Wrap MCP tool invocations with retry/fallback headers.
- **Rebaseline guardrail latency.** Background streaming scans reduce mid-stream stalls for Bedrock guardrails — revisit TTFT SLOs for moderated agents.
- **Watch the Rust gateway.** Sub-1ms overhead would materially change gateway economics for high-RPS agent fan-out; sign up for the beta if you're capacity-constrained on Python proxy overhead.

</details>

<details>
<summary><strong>Unsloth</strong> — <a href="https://github.com/unslothai/unsloth">unslothai/unsloth</a></summary>

# Unsloth Digest — 2026-10-29

## 1. Today's Highlights

Unsloth shipped **v0.1.912-beta** ("Trick or Treat + Optimizations"), a Halloween-themed release that also lands real infrastructure wins: faster first launch, faster Linux tool calls, faster model loading, and training of compatible fine-tuning jobs together with multi-LoRA. The issue tracker remains dominated by **VRAM/OOM reports** (#4504, #4040) and **Studio lifecycle bugs** (crashed GGUF servers reported as loaded, GGUF downloads killing the currently loaded model), but a large batch of fixes from NilayYadav, Etherll, and danielhanchen landed in PRs today. Two long-standing closed bugs (#4504, #4040) remain the most-commented threads despite their status, suggesting continued community scrutiny of advertised VRAM savings.

## 2. Releases & Breaking Changes

- **[v0.1.912-beta — Trick or Treat + Optimizations](https://github.com/unslothai/unsloth/releases)**
  - Halloween UI: eleven themes, spooky greetings, spiders/bats in a sidebar "Trick or treat" row (through October only).
  - Faster first launch, faster Linux tool calls, faster model loading.
  - Trains compatible fine-tuning jobs together (multi-job / multi-LoRA-style batching).
  - No documented API or config breaking changes.
- **[PR #15879 — Gemma 3: keep `UNSLOTH_FORCE_FLOAT32=1` out of import-time patch pass](https://github.com/unslothai/unsloth/pull/15879)**
  Setting `UNSLOTH_FORCE_FLOAT32=1` before `import unsloth` and loading Gemma 3 in bf16 currently crashes on the first training step (`ValueError: Expected query, key, and value to have the same dtype`). Fix in review — **avoid combining that env var with bf16 Gemma 3 until merged**.
- **[PR #13753 — Studio retires whisper.cpp in favor of Transformers Whisper](https://github.com/unslothai/unsloth/pull/13753)**
  Legacy engine aliases (`gguf`, `ggml`, `whisper_cpp`, `whisper.cpp`) are now served by Transformers Whisper under the same model key. Existing installs migrate transparently; API/MCP callers using those names keep working but should plan to update.

## 3. New Model & Hardware Support

- **[Issue #15588 — Support LFM3-1.7B](https://github.com/unslothai/unsloth/issues/15588)** (OPEN, 8 👍): Community request for the new LiquidAI LFM3 family; highest-upvoted feature request in today's window.
- **[PR #15846 / #15847 / #15843 — GGUF/MLX lifecycle](https://github.com/unslothai/unsloth/pulls)**: Multiple Studio PRs harden GGUF and Apple MLX paths (details in Stability section).
- **[PR #15813 — MLX: honor explicitly chosen drafter for speculative decoding](https://github.com/unslothai/unsloth/pull/15813)**: On MLX, speculative modes MTP/DFlash/DSpark/EAGLE-3 were silently dropped when the memory-fit heuristic priced the drafter as not fitting; now an explicit user choice wins.
- **[Issue #15583 — Intel Arc B580 (XPU) fine-tuning](https://github.com/unslothai/unsloth/issues/15583)** (CLOSED): Windows 11 + Intel XPU request closed without landed support; CUDA remains the supported training path.
- **[Issue #15444 — AMD GPUs on mixed NVIDIA/AMD Linux](https://github.com/unslothai/unsloth/issues/15444)** (CLOSED): Mixed-vendor detection and custom llama.cpp issues acknowledged but not resolved.
- **[Issue #4040 — Qwen3-Coder-Next-Base on 2×A100 QLoRA](https://github.com/unslothai/unsloth/issues/4040)** (CLOSED): OOM persists for the 80B-A3B MoE under QLoRA despite advertised fits.

## 4. Performance & Optimization

- **v0.1.912-beta**: measurable startup/load-time improvements and faster Linux tool-call dispatch; multi-compatible-job training reduces serialized fine-tuning turnarounds.
- **[PR #15844 — Load downloaded models with fewer Hugging Face requests](https://github.com/unslothai/unsloth/pull/15844)**: Model selection currently queries HF repo metadata multiple times per click (once for GGUF file detection, again for quant listing, again in the inference worker for MLX/Transformers). PR cuts redundant network round-trips on the "already-on-disk" path.
- **[PR #15843 — Stop Auto context from reserving the full window on macOS](https://github.com/unslothai/unsloth/pull/15843)**: llama-server allocates the KV cache up front; on a Mac, Auto context starts at the model's full native window. Concrete example: **Llama 3.2 1B (128K window) held ~4.9 GB before the first message**; a 256K-window small model similarly bloats. PR caps the reservation — significant for unified-memory Macs.
- **[PR #15629 — Per-tool MCP switches in Settings > Agents](https://github.com/unslothai/unsloth/pull/15629)**: Studio's MCP server exposes 23 tools; with all enabled, an agent burns **~18k tokens on tool definitions before doing any work**. Per-tool toggles let you trim that overhead directly.
- **[PR #15845 — Fix Claude CLI billing header breaking prompt caching](https://github.com/unslothai/unsloth/pull/15845)**: The `x-anthropic-billing-header` line changes every conversation/subagent, invalidating Anthropic-compatible prompt caching through Studio's `/v1/messages` passthrough. Fix improves cache hit rates for Claude CLI / Agent SDK users.

## 5. Stability & Regressions

Ranked by severity:

1. **OOM on advertised fits (training)**
   - **[#4504](https://github.com/unslothai/unsloth/issues/4504)** (CLOSED, 26 comments): Fine-tuning consumes far more VRAM than advertised on ChatML-format datasets, OOMing big models. Long-running thread; closed but heavily discussed through 2026-10-28.
   - **[#4040](https://github.com/unslothai/unsloth/issues/4040)** (CLOSED, 25 comments): Qwen3-Coder-Next-Base QLoRA OOM on 2×A100 80GB for continued pretraining. Treat VRAM calculator numbers as optimistic for MoE + long-context + ChatML.
2. **Windows Recycle Bin flood during training** — **[#15552](https://github.com/unslothai/unsloth/issues/15552)** (CLOSED): Studio on Windows wrote >10,000 `*.db-wal`/`*.db-shm` entries (~40 MB) into `C:\$Recycle.Bin` in ~90 minutes of training. Malware-like I/O signature; fixed.
3. **Crashed GGUF server still reported as loaded** — **[PR #15847](https://github.com/unslothai/unsloth/pull/15847)**: If llama-server dies (OOM kill, driver reset, crash), Studio keeps showing the model loaded; chat header, status, and API all report ready with no server running. Fix in review.
4. **Failed/cancelled GGUF download unloads the current model** — **[PR #15846](https://github.com/unslothai/unsloth/pull/15846)**: Switching to a not-yet-downloaded GGUF stopped the loaded model first; on failure/cancel, nothing remained loaded ("Select model" / "No model loaded"). Fix in review.
5. **SIGSEGV previewing large ChatML JSONL** — **[#15681](https://github.com/unslothai/unsloth/issues/15681)** (CLOSED): pyarrow JSON reader segfault on an 81.7 MB dataset in studio v0.1.910-beta; UI then shows "Unsloth isn't running".
6. **`model.loss_function` unpatched for `Qwen3_5ForConditionalGeneration`** — **[#5441](https://github.com/unslothai/unsloth/issues/5441)** (CLOSED): `logits.float()` OOM on ≤24 GB GPUs; previously reported as #4188 and closed unpatched.
7. **Memory leak on Windows** — **[#14487](https://github.com/unslothai/unsloth/issues/14487)** (OPEN): 200–400 MB lost from C: per Unsloth use with no cleanup path.
8. **Anthropic passthrough context overflow** — **[#15417](https://github.com/unslothai/unsloth/issues/15417)** (CLOSED): `/v1/messages` returns unrecoverable 400 `exceed_context_size_error` instead of applying auto-compaction.
9. **Context non-continuable on long chats** — **[#15800](https://github.com/unslothai/unsloth/issues/15800)** (OPEN): returning to long conversations doesn't compact context, rendering them unusable.
10. **Gemma 4 26B MLX vision emits `<unused6226>`** — **[#15473](https://github.com/unslothai/unsloth/issues/15473)** (CLOSED): Apple MLX vision path corruption.
11. **LFM3 MLX models missing from `/v1/models`** — **[#15832](https://github.com/unslothai/unsloth/issues/15832)** (OPEN): `curl v1/models` doesn't list LFM3 MLX models in v0.1.912-beta.
12. **GGUF export on fresh installs** — **[PR #15864](https://github.com/unslothai/unsloth/pull/15864)**: `save_pretrained_gguf` and `export_decision_gguf` for Laya/Clef decision models fail on machines without llama.cpp (Colab/Kaggle/fresh server) requiring manual folder deletion. Fix in review.

## 6. What This Means for Application Developers

- **Pin to v0.1.912-beta if you run Studio on Linux** — the tool-call and model-load speedups are free wins, and there are no documented breaking API changes.
- **Budget VRAM pessimistically for MoE + ChatML fine-tuning.** #4504 and #4040 show advertised QLoRA fits OOMing on 2×A100 80GB for Qwen3-Coder-Next-Base. Validate with your real dataset format before committing to multi-day jobs.
- **If you route Claude CLI / Agent SDK traffic through Studio**, watch for [PR #15845](https://github.com/unslothai/unsloth/pull/15845) — the billing-header cache invalidation is silently destroying prompt caching economics for subagent-heavy agent loops.
- **MCP tool-definition overhead is real**: ~18k tokens per agent turn with all 23 Studio tools enabled. Use [PR #15629](https://github.com/unslothai/unsloth/pull/15629)'s per-tool switches to enforce context budget discipline in agent apps.
- **On macOS GGUF serving**, [PR #15843](https://github.com/unslothai/unsloth/pull/15843) matters if you load small models with large native windows — pre-fix, a 1B model could pin ~4.9 GB of unified memory before your first token.
- **Whisper users**: `gguf` / `whisper_cpp` engine aliases are now Transformers-backed ([PR #13753](https://github.com/unslothai/unsloth/pull/13753)). Functionally transparent, but audit any code that introspects engine type.
- **GGUF production serving**: until [PR #15847](https://github.com/unslothai/unsloth/pull/15847) merges, treat Studio's "model loaded" status as unreliable — poll llama-server health directly rather than trusting the API surface, and implement your own restart-on-crash wrapper.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*