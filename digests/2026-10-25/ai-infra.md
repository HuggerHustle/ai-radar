# AI Infrastructure Digest 2026-10-25

> Generated: 2026-10-24 23:06 UTC | Projects covered: 6

- [vLLM](https://github.com/vllm-project/vllm)
- [SGLang](https://github.com/sgl-project/sglang)
- [llama.cpp](https://github.com/ggml-org/llama.cpp)
- [Ollama](https://github.com/ollama/ollama)
- [LiteLLM](https://github.com/BerriAI/litellm)
- [Unsloth](https://github.com/unslothai/unsloth)

---

## Cross-Project Comparison

# AI Infrastructure Ecosystem — Cross-Project Comparison Report
**Digest Date: 2026-10-25**

---

## 1. Ecosystem Overview

The AI infrastructure stack is in a **post-release consolidation phase**: none of the five projects shipped a versioned release in the last 24 hours except LiteLLM (four security patches) and llama.cpp (nine nightly builds), yet issue and PR volume is at record levels — SGLang alone shows 500 PRs and 36 issues updated. Two systemic themes cut across every project: **KV cache has become the primary battleground** (NVFP4 MLA in vLLM, programmable KV RFC, Ollama's prefix-cache-defeating Anthropic bug, SGLang's paused-engine KV-event gap), and **correctness regressions are concentrating in hybrid architectures** (Qwen3.5/3.8 GDN across vLLM and SGLang, MoE+speculative decoding in llama.cpp). Supply-chain trust is the newest axis of differentiation: LiteLLM's v1.107.0 compromise and forced cosign key rotation is the first serious post-install compromise to hit a mainstream LLM gateway. Meanwhile the local-runtime segment (llama.cpp, Ollama) is expanding modality coverage — TTS on macOS, Hexagon NPU flash attention — while datacenter engines compete on memory efficiency and multi-node correctness.

---

## 2. Activity Comparison

| Project | Layer | Issues Updated (24h) | PRs Updated (24h) | Releases (24h) | Headline Risk |
|---|---|---|---|---|---|
| **vLLM** | Datacenter serving engine | Heavy (4 fronts) | High | ❌ None | Hybrid GDN regression cluster + 262k-token prefill crash |
| **SGLang** | Datacenter serving engine | 36 | 500 | ❌ None | CI flakiness tax + GB300 DCP a2a silent corruption |
| **llama.cpp** | Local/edge runtime | Moderate | High | ✅ **9 builds (b11856–b11869)** | 4 unauthenticated DoS/RCE vectors in flight |
| **Ollama** | Local runtime + app | Moderate | Moderate | ✅ **v0.40.11** | MLX `options.stop` silently ignored |
| **LiteLLM** | LLM gateway/proxy | Heavy (cost bugs) | High | ✅ **4 patches (v1.106.3 / 1.105.4 / 1.104.6 / 1.103.8)** | v1.107.0 supply-chain RCE + key rotation |
| **Unsloth** | Fine-tuning/framework | Moderate | Moderate | ❌ None | Windows Studio kills every GGUF load |

**Reading the table:** The two datacenter engines (vLLM, SGLang) are in pure main-branch churn with no release stabilization — high velocity, high regression surface. llama.cpp is the only project shipping a feature release (Hexagon HMX FA) alongside nine stability builds. LiteLLM's release cadence is entirely reactive to the compromise. Unsloth and Ollama both have unresolved CRITICAL desktop regressions open against prior shipped versions.

---

## 3. Model Support Race

**Who is ahead depends on the tier:**

| Model / Architecture | vLLM | SGLang | llama.cpp | Ollama | Unsloth |
|---|---|---|---|---|---|
| **DeepSeek-V4 family** | ⚠️ V4-Flash Ampere blocked (#50576); NVFP4 MLA for V3.1/Kimi-K3 in PR | ✅ V4.1 shared-expert fusion default on gfx950; H20-3e tunings | ⚠️ DSV4.1 flash arch under review (#31086) | — | ⚠️ DSV4.1 Engram pricing fix in PR (#14465) |
| **Qwen3.5/3.8 hybrid GDN** | ⚠️ Correctness cluster open (NaN, PP=3, ngram) | ⚠️ GDN prefill breakable-CUDA-graph overhead closed/inactive | ⚠️ MTP token-soup unconfirmed (#23577) | — | ✅ `preserve_thinking` fix PR (#15170) |
| **Kimi-K3** | ✅ ROCm roadmap tracker (#52803); NVFP4 MLA | ⚠️ DCP a2a garbled on 2-node GB300 (#45367) | — | — | — |
| **MiniMax-M3/M2** | — | ✅ Sparse attention on Hopper PR; streaming arg-corruption bug (#46293) | ✅ NVFP4/MXFP8 scale forwarding fixed (b11861) | — | — |
| **GLM-5.3** | ✅ CUDA perf work + chunk KDA prefill | ⚠️ Thinking collapse on multi-tool prompts (#36669) | — | — | — |
| **Gemma 4 / Nemotron 3.5** | — | — | — | ✅ Gemma 4 vision graft (#19247); Nemotron 3.5 Bolt MLX PR (#19229) | — |
| **Diffusion (SANA-Sprint)** | — | ⚠️ Support requested; 6+11 correctness bugs found | — | — | ⚠️ Wan prompt-cache + per-request offload PRs |

**Verdict:** vLLM and SGLang are neck-and-neck on frontier model day-zero support, but **SGLang has the edge on AMD (MI355X) validations today** while vLLM has the edge on KV-cache quantization (NVFP4 MLA) and formal RFCs. llama.cpp remains the fastest to absorb new architectures into a *runnable* local form (DSV4.1 flash, minimax-m3 scale fix) but lags on hybrid-GDN correctness. Ollama is the clear leader on **multimodal surface area** (TTS, vision, MLX quant variants) at the cost of MLX parity bugs. Unsloth is downstream of everyone — its "support" work is really *hardware pricing* and *Studio integration* rather than kernel-level model enablement.

---

## 4. Performance Frontier

Optimization effort is concentrated in **five frontiers**, ranked by current activity:

**① KV Cache (the dominant frontier — all five projects)**
- vLLM: NVFP4 MLA KV — 352 B/token/layer vs 576 (FP8) and 1152 (BF16), a ~3.3× reduction; Programmable KV RFC (#57103); KV-event correctness tracker (#63149) targeting Dynamo/llm-d/vLLM Router.
- SGLang: KV events not published during engine pause → stale routing after weight-sync (#46334 fix).
- Ollama: Anthropic-compat system-message hoisting defeats prefix cache for Claude Code sessions (#18431).
- Unsloth: KV preemption for parallel chats via llama-server `--preempt-ram` (#10301).
- llama.cpp: KV rotation constants now resident on GPU (#31073), eliminating host↔GPU Hadamard transfers.

**② Quantization (NVFP4 is winning)**
- NVFP4 is the convergent format: vLLM NVFP4 MLA, SGLang NVFP4 MoE (with a live CUDA-graph capture bug), llama.cpp minimax-m3 NVFP4/MXFP8 forwarding, Ollama MLX `nvfp4` variants (slower than QAT-int4 in one report). AMD Quark MXFP4 shared-expert fusion in SGLang.
- Correctness debt is real: SGLang's 11 diffusion-quant + 6 perf bugs; Ollama MLX per-layer quant override import failures.

**③ Kernels (Triton/CUDA/AITER)**
- vLLM: Triton top-k falls back to full-vocab search on MiMo-V2.6 (#61998); fusing QK-norm+RoPE+gate on ROCm.
- SGLang: fast_topk_v2 silent wrong-set bug; rejection-sampling int32 overflow (fixed); MiniMax-M3 tiled-block-pointer sparse decode.
- llama.cpp: CUDA Q5_K/Q4_K MMA min-correction; RTX 5090 stream-k block-count issue worth **+37–40%** if fixed.
- AMD: AITER attention-sink silently dropped (vLLM #60160) — the most serious silent-correctness finding of the day.

**④ Distributed Serving (the newest frontier)**
- vLLM: NIXL descriptor bottleneck on GB200 P/D — 91k–120k KV descriptors/TP-rank make MNNVL/cuda_ipc *slower* than RDMA; fix needs descriptor batching, not bandwidth.
- SGLang: Nano-K3 DCP a2a breaks on 2-node GB300 with NCCL graph registration on.
- Neither has a shipped fix — **distributed correctness is the lagging frontier**.

**⑤ Batching & Runtime Overhead**
- vLLM: Clef pooling H2D copies 9→3/request.
- llama.cpp: MoE cache CPU offload; NVFP4 MMVQ lane packing.
- Unsloth: per-region recompile limit for torch 2.13+; tensor-parallel split of idle GPU pairs (#14446).

---

## 5. Layer Positioning

The five projects occupy **four distinct layers** with minimal overlap:

| Layer | Project(s) | Primary Job | Failure Mode When Broken |
|---|---|---|---|
| **Datacenter serving engine** | vLLM, SGLang | High-throughput multi-GPU inference; P/D disaggregation; frontier model day-zero support | Silent wrong outputs under spec-decode/GDN; engine crashes at scale boundaries |
| **Local/edge runtime** | llama.cpp, Ollama | Single-host inference, multimodal, NPU/Metal coverage, app integration | DoS/RCE on server surface; silent stop/quantization divergence |
| **Gateway/proxy** | LiteLLM | Multi-provider routing, budget enforcement, cost attribution, auth | Billing gaps; budget bypass; **supply-chain compromise** |
| **Training/fine-tuning** | Unsloth | LoRA/QAT fine-tuning, Studio desktop, quant picker hardware pricing | Desktop load failures; silent reasoning-template overrides |

**Positioning notes:**
- **vLLM and SGLang are convergent, not complementary** — both target the same datacenter serving niche. Differentiation is fragmenting along *hardware* (vLLM stronger on NVIDIA FlashInfer path, SGLang faster to validate AMD MI355X) and *control plane* (SGLang pushing Rust `api.v1` gRPC; vLLM formalizing KV-cache RFCs).
- **llama.cpp and Ollama are layered, not competing** — Ollama bundles llama.cpp for GGUF; Ollama's value-add is the app surface (TTS, Anthropic-compat, MLX). Their bugs are *coupled* (e.g., Ollama's MLX path vs llama-server memory accounting).
- **LiteLLM is singular in the gateway layer** — and that singularity is precisely why the 1.107.0 compromise has blast radius across every org routing multi-provider traffic. There is no second gateway in this set to hedge against.
- **Unsloth is the only training-layer project** — its upstream dependency on llama.cpp (GGUF) and its Studio behavior changes mean fine-tuning bugs often manifest as *runtime* bugs downstream.

---

## 6. Trend Signals

**① KV cache is being promoted from a memory optimization to a first-class API contract.**
vLLM's **Programmable KV Cache RFC (#57103)** and **KV event correctness tracker (#63149)** both explicitly target *downstream consumers* — Dynamo, llm-d, vLLM Router. SGLang's #46334 (KV events during pause) is the same problem from the other side. **Signal:** KV-cache semantics are becoming a distributed-systems interface, not an engine internal. Expect new failure classes (stale events, revision-mismatched caches, cross-TP reuse) that routers must handle.

**② NVFP4 is consolidating as the default 4-bit KV/weight format.**
vLLM (MLA KV), SGLang (MoE), llama.cpp (minimax-m3), Ollama (MLX) all touched NVFP4 today. The **agentic-serving memory wall** (long sessions, many concurrent agents) is the driver. **Signal:** if you're planning hardware for 2027, NVFP4 KV throughput — not raw FLOPS — will be the binding constraint.

**③ Supply-chain security just became a gateway-layer differentiator.**
LiteLLM's v1.107.0 compromise (credential stealer, RCE loader, lookalike repo) forced a **cosign key rotation** that invalidates *all* previous signature verification. Combined with llama.cpp's four unauthenticated `/tools` and Jinja DoS vectors, **the inference control plane is now the softest target in the stack**. **Signal:** expect cosign/SBOM verification and content-type enforcement to become standard deployment requirements, not optional hardening.

**④ Hybrid architectures (GDN/Mamba + attention) are the new correctness frontier.**
Qwen3.5/3.8 GDN appears across vLLM (NaN logits, PP=3, ngram corruption) *and* SGLang (GDN prefill CUDA-graph overhead). The failures are subtle — often triggered by *prefix-cache block boundaries* — which means they surface only under real agent traffic patterns, not benchmarks.

**⑤ Agent tool-calling is the weakest functional surface across projects.**
GLM-5.3 thinking collapse on multi-tool prompts (SGLang), MiniMax-M2 streaming arg corruption (SGLang), Ollama's `think:false` ignored on OpenAI-compat (PR #19260), LiteLLM dropping `tools` for non-catalog providers (#48145), Unsloth's long tool-heavy chat stalls. Every single project has an open tool-calling defect. **This is systemic, not incidental.**

---

### What Agent / Application Developers Should Watch

1. **Pin everything. Chase nothing on `main` this week.** vLLM's hybrid-GDN cluster, SGLang's GB300 DCP corruption, Unsloth's Windows desktop, and Ollama's MLX stop-sequence bug are all live against current shipped or nightly builds.
2. **Verify LiteLLM image signatures against the new cosign key before any upgrade**, and audit any host that ran 1.107.0. Add independent token metering — spend logs and budget enforcement are demonstrably unreliable under streaming and load.
3. **Instrument your own stop-condition detection.** `options.stop` is silently ignored on Ollama's MLX engine and there are parallel degeneracy bugs (repeated `!`, `////`) in GLM/Qwen on SGLang and llama.cpp. Safety and cost controls cannot rely on engine-side stop tokens alone.
4. **Assume prefix caching is broken or degraded on your current stack.** vLLM (GDN NaN on block-boundary hits), SGLang (paused-engine KV events), Ollama (Anthropic system-message hoisting), and LiteLLM (Codex `prompt_cache_key` just now being forwarded) all have open cache-affinity issues.
5. **Track three convergence points for 2027 architecture decisions:** NVFP4 KV support (vLLM #63203), programmable KV-cache contracts (vLLM #57103 + SGLang #46334), and Rust/gRPC control planes (SGLang `api.v1`). Whichever engine stabilizes these first defines your serving stack.

---

## Per-Project Reports

<details>
<summary><strong>vLLM</strong> — <a href="https://github.com/vllm-project/vllm">vllm-project/vllm</a></summary>

# vLLM Digest — 2026-10-25

## 1. Today's Highlights

No new releases landed in the last 24h, but issue and PR activity is heavy across four fronts: **Ampere (SM8x) support for DeepSeek-V4-Flash** remains the most-commented open issue (#50576, 120 comments), a **Qwen3.8/3.5 hybrid-GDN correctness cluster** is growing (NaN logits, PP=3 crashes, ngram spec-decode corruption), and **KV-cache/NVFP4 memory work** is progressing on both the ROCm and Blackwell sides. Meanwhile, the team is formalizing long-term architecture directions: a **Programmable KV Cache RFC** (#57103) and a **KV event correctness tracker** (#63149) targeting downstream consumers like Dynamo, llm-d, and vLLM Router.

## 2. Releases & Breaking Changes

No new releases. Two deprecation/migration items are in flight:

- **[PR #63423] Deprecate `lm-format-enforcer` structured outputs backend** (closed/ready) — proposed staged removal: warning in v0.33.0, explicit opt-in in v0.34.0, removal in v0.35.0. If you rely on this backend, plan to migrate to xgrammar/guidance/outlines. [Link](https://github.com/vllm-project/vllm/pull/63423)
- **[PR #62877] `structured_outputs_config.backend="auto"` semantics change** — currently `auto` picks a backend per *request*, while EngineCore only keeps the backend chosen by the first structured request. This PR makes `auto` pick one backend per *server*, eliminating the inconsistency. Behavioral change for mixed-constraint workloads. [Link](https://github.com/vllm-project/vllm/pull/62877)

## 3. New Model & Hardware Support

- **DeepSeek-V4-Flash on SM8x (Ampere A100/A800, RTX 30xx)** — still unsupported; neither DeepSeek-V4-Flash nor the `-0731` checkpoint runs on Ampere. Highest-engagement open issue (#50576, 120 comments, 16 👍). [Link](https://github.com/vllm-project/vllm/issues/50576)
- **NVFP4 KV cache for dense MLA** ([PR #63203](https://github.com/vllm-project/vllm/pull/63203)) — adds `--kv-cache-dtype nvfp4` for DeepSeek-V3.1 / Kimi-K3 on `FLASHINFER_MLA`. Claims **352 bytes/token/layer vs 576 for FP8 and 1152 for BF16** — a ~3.3× reduction vs BF16.
- **ROCm Kimi-K3 on gfx942 / MI325X / MI300X** ([#52803](https://github.com/vllm-project/vllm/issues/52803)) — dedicated roadmap tracker (sibling to the general gfx950/MI355X tracker #50682).
- **ROCm fused QK-norm+RoPE+gate for Qwen3-Next/3.5** ([PR #51406](https://github.com/vllm-project/vllm/pull/51406)) — extends an existing pure-Triton kernel that was previously CUDA-gated to the ROCm path.
- **ROCm DSpark draft sampling fusion on gfx950/MI355X** ([PR #63181](https://github.com/vllm-project/vllm/pull/63181)) — fused markov-bias GEMV + fused sample epilogue for DeepSeek-V4.1 speculative decoding.
- **`torch.accelerator` migration RFC** ([#30679](https://github.com/vllm-project/vllm/issues/30679), 26 comments) — replace hard-coded `torch.cuda` calls to improve non-CUDA backend support. Long-running, still open.

## 4. Performance & Optimization

- **NVFP4 MLA KV cache** (see §3) — the most concrete memory win in flight: 3.3× smaller KV cache than BF16 for DeepSeek-V3.1/Kimi-K3 on FlashInfer. [PR #63203](https://github.com/vllm-project/vllm/pull/63203)
- **GLM-5.3 optimizations** ([#57406](https://github.com/vllm-project/vllm/issues/57406)) — follow-up to GLM-5.2 work; same `glm_moe_dsa` base, more CUDA gains available.
- **GLM-5.3 P/D on GB200 — NIXL descriptor bottleneck** ([#55434](https://github.com/vllm-project/vllm/issues/55434)) — **91k–120k KV descriptors per TP-rank transfer** make MNNVL/cuda_ipc slower than RDMA for this workload. Fix likely requires descriptor batching, not more bandwidth.
- **Rust frontend TTFT regression** ([#50718](https://github.com/vllm-project/vllm/issues/50718)) — significant TTFT degradation and poor QPS scaling vs Python frontend on Qwen122B-A10B, avg input 44k tokens (vLLM 0.25.1).
- **Triton top-k kernel falls back to full-vocab search** ([#61998](https://github.com/vllm-project/vllm/issues/61998)) — `_topk_topp_kernel` picks its gather pivot from a Gaussian fit over only the first 8192 logits; on MiMo-V2.6 logits this misses for **6–10% of rows** at high k, degrading to full-vocab scan.
- **GLM-5.3-Flash chunk KDA prefill** ([PR #63072](https://github.com/vllm-project/vllm/pull/63072)) — eliminates a GPU→CPU sync (`cu_seqlens` readback) per prefill call by reusing already-built `chunk_indices`.
- **Clef pooling metadata** ([PR #63495](https://github.com/vllm-project/vllm/pull/63495)) — reduces pooler host-to-device copies from **nine to three per request**.

## 5. Stability & Regressions

Ranked by severity:

1. **Engine crash on long prefill — Qwen4Exp / Qwen3.8-Flash-Next** ([#62383](https://github.com/vllm-project/vllm/issues/62383)) — single prefill crossing the **262,144 native boundary** triggers CUDA illegal memory access on v0.32.0 and nightly; **OK on v0.31.1**. Clear regression window. H200 ×8, TP=2 + EP.
2. **PP=3 + GDN hybrid on sm_86** ([#63505](https://github.com/vllm-project/vllm/issues/63505), filed 10-24) — Qwen3.8-27B, illegal memory access (Xid 31) *with* prefix caching, gibberish output *without* it. Regression since v0.28.0, present in v0.31.0 and v0.32.0, both model runners. No fix PR yet.
3. **TP worker hang → EngineDeadError** ([#41530](https://github.com/vllm-project/vllm/issues/41530)) — `sample_tokens` RPC timeout on DeepSeek-V4-Pro, TP=8, MTP speculative decoding. Open since May, 18 comments.
4. **NaN logits on prefix-cache hit — Qwen3.5/3.8 hybrid GDN** ([#55766](https://github.com/vllm-project/vllm/issues/55766)) — triggers when the previous prefill ends **4–10 tokens past a block boundary** (mamba cache mode align). v0.28.0, H100 TP2.
5. **Ngram spec-decode corrupts output on hybrid GDN** ([#39273](https://github.com/vllm-project/vllm/issues/39273)) — Qwen3.5-9b on GH200, reproducible on nightly.
6. **NVFP4 + DFlash + torch.compile SIGSEGV on SM120** ([#48234](https://github.com/vllm-project/vllm/issues/48234)) — `torch::jit::invokeOperatorFromPython` crash on Blackwell with CUDA graph PIECEWISE.
7. **ROCm AITER accuracy collapse** ([#60160](https://github.com/vllm-project/vllm/issues/60160), [#63518](https://github.com/vllm-project/vllm/pull/63518)) — Qwen3.8-27B-FP8 on MI355X collapses at high concurrency with `VLLM_ROCM_USE_AITER=1`; also granite on gfx942/950. Root cause identified: AITER ASM attn kernel **silently drops attention sinks** (upstream fix [ROCm/aiter#6906](https://github.com/ROCm/aiter/pull/6906)); workaround PR #63518 reroutes sink models to unified attention.
8. **Adaptive verification rejected on SM120** ([#63343](https://github.com/vllm-project/vllm/issues/63343)) — device-query-lens gated to SM90/SM100 only; RTX PRO 6000 Blackwell users blocked.
9. **Mooncake connector crash after decode timeout** ([#60755](https://github.com/vllm-project/vllm/issues/60755)) — vLLM 0.31.0, Decode EngineCore can crash post-timeout.
10. **Persistent KV offload cache not namespaced by model revision** ([#49261](https://github.com/vllm-project/vllm/issues/49261)) — stale cache can be served across model updates.

**Fixes in flight:**
- [PR #52244](https://github.com/vllm-project/vllm/pull/52244) — restore hybrid GDN prefix-cache hits under MTP spec decoding (related to #55766 cluster).
- [PR #62916](https://github.com/vllm-project/vllm/pull/62916) — synchronize KV transfer engine IDs across PCP ranks; addresses multi-node startup failure at PP2/PCP8/TP2.
- [PR #53739](https://github.com/vllm-project/vllm/pull/53739) — terminate streamed tool-argument prefixes the flush cannot extend.

## 6. What This Means for Application Developers

- **Don't chase `main` if you're on hybrid GDN models (Qwen3.5/3.8).** The correctness cluster — NaN logits on prefix-cache hits, PP=3 crashes, ngram spec-decode corruption, and MTP prefix-cache misses — all intersect on hybrid Gated-DeltaNet architectures. If you serve these in production, pin to a known-good tag and track [PR #52244](https://github.com/vllm-project/vllm/pull/52244) rather than upgrading blindly.
- **Long-context Qwen3.8-Flash-Next is currently unsafe past 262k tokens** on v0.32.0+ ([#62383](https://github.com/vllm-project/vllm/issues/62383)). If your agent workloads routinely exceed the native boundary, stay on v0.31.1 until a fix lands.
- **`auto` structured-output backend will become server-scoped.** If you mix JSON schema, regex, and grammar constraints in one deployment, expect different backend selection behavior after [PR #62877](https://github.com/vllm-project/vllm/pull/62877) merges. Test your constraint mix explicitly rather than relying on per-request fallback.
- **KV cache is the active frontier.** NVFP4 MLA ([#63203](https://github.com/vllm-project/vllm/pull/63203)) and the Programmable KV Cache RFC ([#57103](https://github.com/vllm-project/vllm/issues/57103)) both signal that agentic serving — session-scoped retention, cross-TP reuse, prefix-cache correctness under speculative decoding — is where the next round of gains (and the next round of bugs) will come from. If you build multi-turn agents, watch [#63149](https://github.com/vllm-project/vllm/issues/63149) for KV event semantics that affect your router's cache-aware scheduling.
- **ROCm users with AITER enabled: audit for attention sinks.** The silent sink-drop bug affects any model using sinks on gfx942/950. Until [PR #63518](https://github.com/vllm-project/vllm/pull/63518) merges, set `VLLM_ROCM_USE_AITER=0` if you see accuracy drift at high concurrency.
- **Rust frontend is not yet a drop-in win.** The TTFT/QPS regression on large-input workloads ([#50718](https://github.com/vllm-project/vllm/issues/50718)) suggests benchmarking both frontends on your actual traffic mix before switching.

</details>

<details>
<summary><strong>SGLang</strong> — <a href="https://github.com/sgl-project/sglang">sgl-project/sglang</a></summary>

# SGLang Digest — 2026-10-25

## 1. Today's Highlights

No new releases shipped in the last 24h, but issue traffic is heavy (36 updated) and PR activity is very high (500 updated). The most consequential thread remains the CI/flaky-test tracker [#42752](https://github.com/sgl-project/sglang/issues/42752) at 128 comments, now clearly a systemic tax on merge velocity. Meanwhile, a cluster of NVIDIA-path correctness bugs landed today around CUDA graph capture, DCP/a2a collectives, and NVFP4 quantized MoE — several with no fix PRs yet.

## 2. Releases & Breaking Changes

None in the last 24h. Note there are no tagged releases in this window, so all items below are `main`-branch / nightly behavior.

## 3. New Model & Hardware Support

- **AMD consumer RDNA3/RDNA4 (gfx1100/gfx1201)**: tracking issue for official support beyond datacenter Instinct-only ROCm path — [#30599](https://github.com/sgl-project/sglang/issues/30599) (👍4).
- **SANA-Sprint 0.6B diffusion** (1–4 step, 1024px text-to-image): native support requested — [#43671](https://github.com/sgl-project/sglang/issues/43671).
- **NPU PD-disaggregation with Mooncake transfer backend**: PR open — [#46223](https://github.com/sgl-project/sglang/pull/46223).
- **Ascend A5 → Ascend 950 / arch35 naming standardization** across NPU modules — [#41504](https://github.com/sgl-project/sglang/pull/41504).
- **Speculative decoding**: CUDA attention-DP support for DFlash and DFlash2 (stacked) — [#46330](https://github.com/sgl-project/sglang/pull/46330).

## 4. Performance & Optimization

- **DeepSeek-V4 dsv4 prefill on SM120 (4× RTX PRO 6000, TP=4)**: user reports ~2–7K tok/s vs ~12.5K on vLLM/marlin on identical hardware — [#33422](https://github.com/sgl-project/sglang/issues/33422). Significant gap, no fix identified.
- **DeepSeek-V4.1 on 8× H20-3e**, SGLang vs DeepInfer PR #92: SGLang higher with `--enable-cp-decode-attn-tp` — [#46310](https://github.com/sgl-project/sglang/issues/46310).
- **MiniMax-M3 sparse attention on Hopper**: tiled-block-pointer Triton decode/prefill, fp16-widened decode for fp8 KV, fused bf16→fp8 cast — [#46135](https://github.com/sgl-project/sglang/pull/46135).
- **AMD Qwen3.8 QSA decode**: replace two-pass gather+decode with AITER fused FlyDSL sparse decode on gfx950 — [#45196](https://github.com/sgl-project/sglang/pull/45196).
- **AMD DeepSeek-V4 shared expert fusion by default on gfx950**: MI355X median time/token 2.0–6.6% lower at 10/13 points — [#42496](https://github.com/sgl-project/sglang/pull/42496).
- **AMD Quark MXFP4 shared-expert fusion** with `--enforce-shared-experts-fusion` — [#41899](https://github.com/sgl-project/sglang/pull/41899).
- **DSv4.1 breakable prefill CUDA graph usable above 16K contexts** + serving-shape startup warmup — [#44627](https://github.com/sgl-project/sglang/pull/44627) (CLOSED).
- **Diffusion quantization layer**: 6 confirmed real perf/overhead bugs identified for fix — [#46301](https://github.com/sgl-project/sglang/issues/46301), [#46302](https://github.com/sgl-project/sglang/issues/46302).
- **Breakable CUDA graph per-layer break dominates GDN prefill** on hybrid Qwen3.5/3.6 (~50% step wall clock GPU idle) — [#35851](https://github.com/sgl-project/sglang/issues/35851) (closed/inactive).

## 5. Stability & Regressions (ranked by severity)

1. **Scheduler `double free or corruption` in idle-loop invariant check** → server hangs permanently. No fix PR — [#42508](https://github.com/sgl-project/sglang/issues/42508).
2. **Kimi-K3 DCP a2a garbled decode on 2-node GB300** with NCCL graph registration enabled (12/12 degenerate outputs); `NCCL_GRAPH_REGISTER=0` restores correct smoke output. No fix PR — [#45367](https://github.com/sgl-project/sglang/issues/45367).
3. **DeepSeek-V4-Flash NVFP4 + flashinfer_megamoe + dp-attention** fails during decode CUDA graph capture (undeclared sum group) on current `main` — [#46316](https://github.com/sgl-project/sglang/issues/46316).
4. **DeepSeek AWQ checkpoints fail to load**: `ModuleNotFoundError: sglang.kernel_api_logging` — [#46312](https://github.com/sgl-project/sglang/issues/46312).
5. **fast_topk_v2 silently returns wrong top-k sets** when radix threshold bucket exceeds 4096-entry candidate buffer (k=2048, long rows) — silent correctness bug, [#36807](https://github.com/sgl-project/sglang/issues/36807).
6. **Rejection-sampling verify kernel int32 overflow** → illegal memory access when `bs * num_draft_tokens * vocab ≥ 2^31` — [#46299](https://github.com/sgl-project/sglang/issues/46299) (CLOSED).
7. **MiniMax-M2 streaming**: next invoke's parameters overwrite current call's args when one delta spans `</invoke>` — [#46293](https://github.com/sgl-project/sglang/issues/46293).
8. **GLM-5.3-Flash thinking degenerates into repeated `!`** under multi-tool agentic prompts (native FP8) — [#36669](https://github.com/sgl-project/sglang/issues/36669).
9. **Non-causal sliding-window attention ignored in TorchNativeAttnBackend** — [#39300](https://github.com/sgl-project/sglang/issues/39300).
10. **compressed-tensors**: untargeted layers fail "Unable to find matching target" — [#46335](https://github.com/sgl-project/sglang/issues/46335); fix PR open — [#46336](https://github.com/sgl-project/sglang/pull/46336).
11. **Diffusion quantization layer: 11 correctness bugs** (ModelSlim MXFP4, rowwise FP8/gfx1250, MXFP4 ROCm, KitchenW4A4, Nunchaku) — [#46314](https://github.com/sgl-project/sglang/issues/46314).
12. **Qwen4_exp checkpoint not recognized by Transformers** — [#46326](https://github.com/sgl-project/sglang/issues/46326).
13. **CI flakiness tracker** at 128 comments; AMD PR Test failure tracker open — [#45847](https://github.com/sgl-project/sglang/issues/45847).

Fix PRs in flight: compressed-tensors load-path fix [#46336](https://github.com/sgl-project/sglang/pull/46336); MLA ragged draft-extend request-boundary fix (silent wrong causal window) [#46331](https://github.com/sgl-project/sglang/pull/46331); scheduler KV-event publish while paused (RL weight-sync correctness vs KV routers) [#46334](https://github.com/sgl-project/sglang/pull/46334).

## 6. What This Means for Application Developers

- **Agentic tool-calling remains the weakest surface.** GLM-5.3-Flash thinking collapse under multi-tool prompts [#36669](https://github.com/sgl-project/sglang/issues/36669), MiniMax-M2 streaming argument corruption [#46293](https://github.com/sgl-project/sglang/issues/46293), and strict-null tool schema 400s [#36194](https://github.com/sgl-project/sglang/issues/36194) all hit agent frameworks directly. If you run multi-tool agents in production, pin versions and add output-degeneration watchdogs (repeated-token / `!`-stream detection).
- **On GB300/MNNVL and NVFP4 MoE deployments, verify decode outputs against a known-good reference** before rollout. NCCL graph registration and flashinfer_megamoe + dp-attention CUDA-graph paths are producing silent or captured-graph failures [#45367](https://github.com/sgl-project/sglang/issues/45367), [#46316](https://github.com/sgl-project/sglang/issues/46316).
- **AMD MI355X users** get real gains from shared-expert fusion on DeepSeek-V4.1 (2–6.6% per-token decode latency) and the new gfx950 QSA sparse-decode path — worth adopting if you're capacity-bound on ROCm [#42496](https://github.com/sgl-project/sglang/pull/42496), [#45196](https://github.com/sgl-project/sglang/pull/45196).
- **RL / weight-sync pipelines**: if you use a KV-event router (sgl-router, Dynamo) over a paused engine, KV events aren't published during pause — a fix is in review [#46334](https://github.com/sgl-project/sglang/pull/46334). Until merged, expect stale routing after `flush_cache` during weight updates.
- **Control-plane work is coming for the Rust `api.v1` server**: gRPC operability enhancements [#38075](https://github.com/sgl-project/sglang/issues/38075) and chat/completions added to shared v1 protos [#46297](https://github.com/sgl-project/sglang/issues/46297). If you're building an out-of-process orchestrator, track these before adopting `api.v1` as a stable contract.
- **Avoid `--enable-deterministic-inference` on AMD with single all-reduces >16 MiB** unless you pick up the custom-allreduce fix [#34543](https://github.com/sgl-project/sglang/pull/34543) (closed).

</details>

<details>
<summary><strong>llama.cpp</strong> — <a href="https://github.com/ggml-org/llama.cpp">ggml-org/llama.cpp</a></summary>

# llama.cpp Digest — 2026-10-25

## 1. Today's Highlights

A dense release window: nine builds (b11856–b11869) landed in 24h, with the standout being a **Hexagon KV-head team-split for multicore HMX flash attention** (b11868) that finally enables head-parallel FA on NPUs when `n_kv_heads` doesn't divide the core count. On the correctness side, the Jinja template engine got a targeted fix for `select`/`selectattr` argument handling (b11869), unblocking Functionary v3.2 tool schemas using `oneOf`. Meanwhile, a cluster of **security-relevant PRs** targeting unauthenticated stack overflows in the server and Jinja parser (#30242, #31099, #31098) signals active hardening of the `llama-server` surface.

---

## 2. Releases & Breaking Changes

- **b11867 — server entrypoint refactor** ([#31113](https://github.com/ggml-org/llama.cpp/pull/31113)): Introduces a `server_role` abstraction (router / single / download modes), with a strict "one role == one entrypoint" rule. No CLI breakage expected, but anyone patching `server.cpp` downstream should expect moved initialization logic.
- **b11866 — Metal `mul_mm_id` rescaling removed** ([#30924](https://github.com/ggml-org/llama.cpp/pull/30924)): The source-side power-of-two rescale is superseded by per-expert-token amax scaling in the compute graph ([#30861](https://github.com/ggml-org/llama.cpp/pull/30861)). Numerically equivalent on correct graphs, but any out-of-tree Metal kernel forks will diverge.
- **b11858 — `-sm tensor` denied on arches with MoE amax rescaling** ([#31081](https://github.com/ggml-org/llama.cpp/pull/31081)): Hard rejection rather than silent wrong results. If you relied on `--split-mode tensor` with MoE models on CUDA/Metal, switch to `layer`.
- **b11857 — `MUL_MAT_ID` accepts index `-1` to skip compute** ([#26631](https://github.com/ggml-org/llama.cpp/pull/26631)): Graph-level semantic change; relevant to custom MoE graph builders.

---

## 3. New Model & Hardware Support

- **`minimax-m3` quant-scale forwarding fixed** ([#31097](https://github.com/ggml-org/llama.cpp/pull/31097), b11861): Per-expert NVFP4 `scale2` tensors and per-tensor MXFP8 scales for dense + shared-expert FFN are now wired into the graph — resolves [#31063](https://github.com/ggml-org/llama.cpp/issues/31063).
- **DSV4.1 flash** ([#31086](https://github.com/ggml-org/llama.cpp/pull/31086), open): New model architecture under review; touches model, mtmd, CUDA, conversion layers.
- **Hexagon HMX FA team-split** ([#31055](https://github.com/ggml-org/llama.cpp/pull/31055), b11868): On Snapdragon multicore NPUs, splits cores into `gcd(n_kv_heads, N)` teams when head-split is impossible, avoiding the prior token-partition fallback that made every core walk every KV head.
- **Hexagon generic dims collapse/reshape** ([#31071](https://github.com/ggml-org/llama.cpp/pull/31071)): Unary, binary and matmul ops now reshape on the CPU side for better HVX thread and multi-NPU partitioning.
- **Kepler/cuBLAS compatibility** ([#30727](https://github.com/ggml-org/llama.cpp/pull/30727)): Default cuBLAS GEMM algo selection adjusted for pre-Volta compute capability.

---

## 4. Performance & Optimization

- **CUDA FA stream-k on RTX 5090** ([#30784](https://github.com/ggml-org/llama.cpp/issues/30784)): Block count not a multiple of `ntiles_dst` on 170-SM parts causes **10–13% long-context prefill slowdown vs RTX 4090**; fixing it would net **+37–40%**. Reported, no fix PR yet.
- **Vulkan decode cliff at 131K context** ([#27734](https://github.com/ggml-org/llama.cpp/issues/27734)): ~78% throughput drop on RX 7900 XTX from ~1 GiB suballocation fragmentation; workaround is `GGML_VK_SUBALLOCATION_BLOCK_SIZE=4GiB`.
- **CUDA Q5_K / Q4_K MMA minimum-correction** ([#30797](https://github.com/ggml-org/llama.cpp/pull/30797)): Replaces scalar FP32 min-correction with a 128×8 × 8×128 MMA matmul across K256 blocks — targets Q5_K, Q4_K, Q4_1, Q5_1, IQ1_S, Q2_K.
- **NVFP4 MMVQ small-K lane packing** ([#30788](https://github.com/ggml-org/llama.cpp/pull/30788)): Assigns output rows to power-of-two lane groups for `ncols_dst == 1`, packs multiple rows per warp.
- **KV-cache rotation constants resident on GPU** ([#31073](https://github.com/ggml-org/llama.cpp/pull/31073)): Eliminates host↔GPU Hadamard matrix transfers; meaningful on PCIe 2.0 (GTX 1080 reports gains).
- **MoE cache CPU offload for missed experts** ([#30966](https://github.com/ggml-org/llama.cpp/pull/30966)): Adds `--moe-cache-cpu-share` and a tuning script — pairs directly with the Vulkan MoE crash fix below.

---

## 5. Stability & Regressions

Ranked by severity:

1. **`/tools` CORS + Content-Type bypass** ([#29834](https://github.com/ggml-org/llama.cpp/pull/29834), closed): `POST /tools` invokes `exec_shell_command` on the host without Origin or Content-Type validation. Any malicious webpage could trigger RCE via a simple CORS request. **Fix landed.**
2. **Unauthenticated stack overflow in `from_json`** ([#31099](https://github.com/ggml-org/llama.cpp/pull/31099), [#31032](https://github.com/ggml-org/llama.cpp/pull/31032)): Deeply nested `chat_template_kwargs`/`messages`/`tools` in a single `POST /v1/chat/completions` recurses until stack exhaustion. **Two competing fix PRs open.**
3. **Unvalidated grammar trigger type** ([#31098](https://github.com/ggml-org/llama.cpp/pull/31098)): Out-of-range `type` field cast without a check in `server_grammar_trigger`. Fix PR open.
4. **Recursive JSON walk DoS** ([#30242](https://github.com/ggml-org/llama.cpp/pull/30242)): >128-level nesting crashes the server during post-parse traversal. Fix PR open.
5. **CUDA illegal memory access on Gemma 4 31B + draft-MTP** ([#31077](https://github.com/ggml-org/llama.cpp/issues/31077)): Crash when MTP drafts immediately after KV rollback/clear. No fix PR yet.
6. **MTP token-soup on Qwen3.6 27B** ([#23577](https://github.com/ggml-org/llama.cpp/issues/23577)): 34 comments, still unconfirmed — repeats `////` after long sessions.
7. **SYCL F16 NaN on dense Qwen3.8-27B** ([#30892](https://github.com/ggml-org/llama.cpp/issues/30892)): Regression from [#29107](https://github.com/ggml-org/llama.cpp/pull/29107) IQ3 reorder on Arc Pro B70. Workaround: disable fused GEMM.
8. **SYCL/OpenCL multi-GPU P2P init failure** ([#27168](https://github.com/ggml-org/llama.cpp/issues/27168), closed stale): `ur_die` on `dev2dev_memcpy` when `--split-mode layer` crosses devices.
9. **Metal BF16 `MUL_MAT` abort** ([#30973](https://github.com/ggml-org/llama.cpp/issues/30973)): No BF16 `mul_mm` kernel; fails at K ≥ 64, batch > 8.
10. **`--moe-cache-mib` Vulkan load crash** ([#30697](https://github.com/ggml-org/llama.cpp/issues/30697)): Addressed by [#31114](https://github.com/ggml-org/llama.cpp/pull/31114), which skips the `maxStorageBufferRange` pre-check on devices lacking `shader_64b_indexing` (GCN/gfx906).

---

## 6. What This Means for Application Developers

- **Patch `llama-server` before exposing it.** Four independent unauthenticated DoS/RCE vectors are in flight right now against `/tools`, `/v1/chat/completions`, and grammar triggers. If you run a public or multi-tenant endpoint, track #29834 (merged), #31099, #31098, #30242. Until landed, run behind a reverse proxy that enforces JSON content-type and rejects over-nested bodies.
- **MoE on multi-GPU: switch `--split-mode` from tensor to layer** if you use amax-rescaled arches (b11858). Silent wrongness was traded for a hard error — good signal, but a config change for your deployments.
- **Jinja chat templates just got more correct.** Functionary v3.2 and any template using `selectattr('foo', 'defined')` on `oneOf` tool schemas now works (b11869). If you were post-processing tool calls to work around this, you can likely drop the shim.
- **NPU inference is becoming real.** The Hexagon work (b11868, #31071) is a readiness signal for Snapdragon X-class deployments; the vision-encoder corruption bug [#31104](https://github.com/ggml-org/llama.cpp/issues/31104) is a reminder that mmproj on HTP is still maturing.
- **Watch the CUDA stream-k and Vulkan suballocation threads** if you're sizing 5090 or RDNA3 capacity — both are 10–80% throughput items currently gated on one-line fixes.

</details>

<details>
<summary><strong>Ollama</strong> — <a href="https://github.com/ollama/ollama">ollama/ollama</a></summary>

# Ollama Digest — 2026-10-25

## 1. Today's Highlights

Ollama shipped **v0.40.11**, introducing native **text-to-speech on macOS** via `ollama run` and an OpenAI-compatible `/v1/audio/speech` streaming endpoint — a notable expansion beyond text/vision into audio generation. The MLX backend continues to dominate the issue and PR queue: a cluster of correctness and parity bugs (ignored `stop` sequences, per-layer quantization import failures, VRAM accounting) surfaced alongside active fixes from maintainers. Meanwhile, the Anthropic-compat endpoint drew attention for a **prefix-cache-defeating message reordering bug** affecting Claude Code sessions.

## 2. Releases & Breaking Changes

- **v0.40.11** — Speech generation on macOS; apps can stream audio via `/v1/audio/speech` (OpenAI-compatible). No breaking changes noted, but audio capability is a new surface area. [Release](https://github.com/ollama/ollama/releases)
- No API/config migrations or deprecations announced today.

## 3. New Model & Hardware Support

- **[PR #19229](https://github.com/ollama/ollama/pull/19229)** (open): MLX support for **Nemotron 3.5 Bolt 74B-A9B**, including per-layer expert configs, LiLiCorr speculative decoding via the DFlash runner, prequantized affine **3-bit** import with per-module quantization metadata, and mixed-precision expert stacking.
- **[PR #19247](https://github.com/ollama/ollama/pull/19247)** (closed): Preserves small-image detail for compact **Gemma 4** vision towers by rounding up the smallest image grid to its intended 70-token budget.
- **MLX backend** now evidently handles `nvfp4` and QAT int4 variants (see regression #19254 below), though with mixed performance.

## 4. Performance & Optimization

- **[PR #17857](https://github.com/ollama/ollama/pull/17857)** (open, since Aug): Fixes **llama-server memory accounting for multi-model loads** — speculative draft log lines were overwriting the target model's lines, causing a 30B dflash model to report ~2.3GB in `ollama ps` and the scheduler's VRAM accounting. Also fixes dropped KV-cache lines for hybrid-attention models.
- **[PR #19263](https://github.com/ollama/ollama/pull/19263)** (open): Preserves memory accounting across log chunk boundaries (fixes [#19204](https://github.com/ollama/ollama/issues/19204)) — incomplete lines are now retained and parsed under the accounting lock.
- **[Issue #18431](https://github.com/ollama/ollama/issues/18431)** (open): Anthropic-compat endpoint hoists in-`messages` system-role messages into the top system block, **defeating the prefix cache** — a real latency/cost regression for Claude Code-style workloads that append system messages after every tool result.
- **[PR #19255](https://github.com/ollama/ollama/pull/19255)** (open): Docs example for a **single-inflight admission queue** in front of an existing Ollama server, for shared interactive/background client admission control.

## 5. Stability & Regressions

Ranked by severity:

1. **[Issue #19268](https://github.com/ollama/ollama/issues/19268)** (open) / **[PR #19267](https://github.com/ollama/ollama/pull/19267)** (open fix): **`options.stop` is silently ignored on the MLX engine** — generation runs to EOS/`num_predict` instead of stopping. Engines diverge on identical requests. Fix PR exists.
2. **[Issue #18789](https://github.com/ollama/ollama/issues/18789)** (open): **MLX per-layer quantization overrides ignored on import** — mixed-precision (4-bit weights + 8-bit per-layer overrides) checkpoints load-fail with `quantized_matmul` shape mismatch. No fix PR visible.
3. **[Issue #19262](https://github.com/ollama/ollama/issues/19262)** (open): **`OLLAMA_NUM_PARALLEL=1` appears ineffective** — two sessions processed concurrently despite the cap, problematic for memory-constrained hosts.
4. **[Issue #19254](https://github.com/ollama/ollama/issues/19254)** (closed): MLX-tagged `flint:40b-a2b-gguf-nvfp4` is **significantly slower than** non-MLX `flint:40b-a2b-qat-int4` on M3 36GB — ~2m5s total duration in the reported run. Closed, but worth tracking.
5. **[Issue #18283](https://github.com/ollama/ollama/issues/18283)** (closed): MLX `mlx_compile_cache_new_` CHECK failure spam on non-MLX hardware (Windows, no CUDA/Apple Silicon), printed on every command including `ollama list`.
6. **[PR #19252](https://github.com/ollama/ollama/pull/19252)** (open): Tool-call arguments rendering integer `1` as `1.0`, altering model-visible input — correctness fix with unit coverage, no wire-format change.
7. **[PR #19260](https://github.com/ollama/ollama/pull/19260)** (open): OpenAI-compat `/v1/chat/completions` and `/v1/completions` ignored native `"think": false` for thinking models (Gemma 4 et al.) — fix restores parity with `/v1/responses`.
8. **[PR #19266](https://github.com/ollama/ollama/pull/19266)** (open): `/compact` retries after HTTP 413 by dropping images/old items — addresses long Codex sessions with screenshots against Ollama Cloud.

## 6. What This Means for Application Developers

- **Speech is now a first-class output modality on macOS.** If you're building voice agents or accessibility tooling, `/v1/audio/speech` gives you an OpenAI-compatible streaming path — no separate TTS service needed for local Mac deployments.
- **If you target MLX, audit your stop sequences and quantization configs.** `options.stop` is broken on MLX today, and mixed-precision imports can hard-fail. Until PR #19267 lands, don't rely on stop tokens for safety or cost control on Apple Silicon.
- **Claude Code users: prefix cache is likely being invalidated** by the Anthropic-compat system-message hoisting bug (#18431). Expect higher latency/token cost on long tool-calling sessions until fixed.
- **Memory accounting was untrustworthy for multi-model / speculative setups** — `ollama ps` and scheduler VRAM numbers could under-report by an order of magnitude. PRs #17857 and #19263 address this; pin accordingly if you auto-scale on those figures.
- **Concurrency controls (`OLLAMA_NUM_PARALLEL`) may not behave as documented** — if you depend on serialized inference for memory safety, verify behavior on your version rather than assuming the env var is honored.

</details>

<details>
<summary><strong>LiteLLM</strong> — <a href="https://github.com/BerriAI/litellm">BerriAI/litellm</a></summary>

# LiteLLM Digest — 2026-10-25

## 1. Today's Highlights

The dominant story continues to be the **v1.107.0 supply-chain compromise** ([#47826](https://github.com/BerriAI/litellm/issues/47826)), which remains the top open issue: the malicious PyPI release and Docker tags have been yanked, and all four releases cut in the last 24h (v1.106.3, v1.105.4, v1.104.6, v1.103.8) carry a **cosign signing-key rotation** ([`e82a3c6`](https://github.com/BerriAI/litellm/commit/e82a3c646908ba0a6ee0beddc4310d7a6cac4065)) — anyone verifying images with the old key will now fail. Separately, a large cluster of **cost/spend-accounting accuracy bugs** dominates the issue tracker (streaming usage loss, cache-hit semantics, budget enforcement), and active PRs continue hardening the Rust bridge and proxy model-listing correctness.

## 2. Releases & Breaking Changes

Four patch releases published in the last 24h — v1.106.3, v1.105.4, v1.104.6, v1.103.8 — all carrying the same critical notice:

- **Cosign image-signing key rotated.** Starting with these releases, every Docker image and Helm chart is signed with a **new cosign key** from commit [`e82a3c6`](https://github.com/BerriAI/litellm/commit/e82a3c646908ba0a6ee0beddc4310d7a6cac4065). **Action required:** update your verification pipelines/CI trust roots to the new public key; verification against the previous key will fail. This is a direct consequence of the v1.107.0 compromise — treat any image signed with the old key as untrusted unless independently validated.
- **Pin away from 1.107.0.** PyPI removed it and GHCR/Docker Hub `latest`, `main-latest`, `main-stable` tags were yanked ([#47826](https://github.com/BerriAI/litellm/issues/47826)). If you consume floating tags, re-pull explicitly and verify signatures.

## 3. New Model & Hardware Support

No new model or hardware backends landed today, but several in-flight changes adjust model behavior:

- **[PR #47684](https://github.com/BerriAI/litellm/pull/47684)** — Gemini models absent from the sampling-flag map are now judged by the version embedded in their name; newer/unflagged models (e.g. `gemini-4-argon`) will have `temperature`/`top_p`/`top_k` handled correctly instead of silently forwarded.
- **[PR #48256](https://github.com/BerriAI/litellm/pull/48256)** — cost map extended with OpenAI **12-hour cache-write rates** across Standard, Batch, and Ultrafast tiers (bot-generated from the pricing page).
- **[#26444](https://github.com/BerriAI/litellm/issues/26444)** (open bug) — `get_supported_openai_params` still advertises `temperature` for Anthropic **Claude Opus 4.7**, which rejects it at request time.
- **[#48145](https://github.com/BerriAI/litellm/issues/48145)** — regression in 1.106: JSON-defined OpenAI-like providers **drop `tools`** unless the model is in the catalog (worked in 1.81 and 1.106 with explicit `openai` provider).

## 4. Performance & Optimization

- **Rust bridge (in progress):** [PR #46605](https://github.com/BerriAI/litellm/pull/46605) makes native Rust inference **use the configured Python cache** rather than its own cache logic, so enabling caching no longer forces eligible requests back onto the Python path. [PR #47280](https://github.com/BerriAI/litellm/pull/47280) propagates `@client` failure attributes (`num_retries`, timeout) into native async calls so Router retry/timeout decisions stay consistent.
- **Error-path diagnostics:** [PR #48250](https://github.com/BerriAI/litellm/pull/48250) fixes timeout errors reporting `"after None seconds"` — they now name the exact phase and httpx limit, materially reducing MTTR on provider timeouts.
- **Cache affinity:** [PR #42014](https://github.com/BerriAI/litellm/pull/42014) and [PR #37630](https://github.com/BerriAI/litellm/pull/37630) forward `prompt_cache_key` and derive ChatGPT Responses session IDs from it, improving **multi-turn prompt-cache hit rates** for Codex-style workloads.
- **Tokenization API:** [PR #48154](https://github.com/BerriAI/litellm/pull/48154) adds `POST /tokenize` and `/v1/tokenize`, routed through normal auth/model-access/hooks.

## 5. Stability & Regressions

Ranked by severity:

1. **CRITICAL — supply-chain:** [#47826](https://github.com/BerriAI/litellm/issues/47826) — v1.107.0 shipped a `cook.pth` credential stealer and `sitecustomize` RCE loader, built from lookalike repo `Berri-AI/litellm`. PyPI/Docker artifacts removed; signing key rotated. **Audit any host that pulled 1.107.0.**
2. **HIGH — budget enforcement bypass:** [#26672](https://github.com/BerriAI/litellm/issues/26672) (v1.82.3) — key/user `max_budget` not enforced despite spend exceeding the limit. [#27735](https://github.com/BerriAI/litellm/issues/27735) reports `BudgetExceededError` on **stale spend** while `/key/info` shows spend under budget. [#36926](https://github.com/BerriAI/litellm/issues/36926) — false `BudgetExceededError` under sustained load (no Redis, self-heals ~2 min). [#25386](https://github.com/BerriAI/litellm/issues/25386) — `max_end_user_budget_id` never persisted to DB, so budget resets never run.
3. **HIGH — billing gaps / double-charge risk:** [#14457](https://github.com/BerriAI/litellm/issues/14457) — usage lost when clients disconnect mid-stream. [#13245](https://github.com/BerriAI/litellm/issues/13245) — same for non-streaming Bedrock calls (AWS still bills). [#36168](https://github.com/BerriAI/litellm/issues/36168) — streamed responses drop upstream `usage` when the final chunk has non-empty `choices`, losing `cached_tokens` and billing at full input rate. [#42161](https://github.com/BerriAI/litellm/issues/42161) — streamed turns billed at **$0** when a slug is missing from the price map (74/89 calls logged free in one report). [#35563](https://github.com/BerriAI/litellm/issues/35563) — reused provider response IDs collide in spend-log primary keys.
4. **MEDIUM — feature breakage:** [#8842](https://github.com/BerriAI/litellm/issues/8842) (closed) — Router `.acompletion` skipped `CustomLogger` callbacks. [#14052](https://github.com/BerriAI/litellm/issues/14052) (`P0`) — `x-litellm-tags` don't route/fallback correctly. [#24152](https://github.com/BerriAI/litellm/issues/24152) — per-model RPM/TPM limits don't trigger fallbacks. [#31909](https://github.com/BerriAI/litellm/issues/31909) (closed) — `mcp_semantic_tool_filter` stripped **all** tools (N→0) for standard nested tool format. [#33764](https://github.com/BerriAI/litellm/issues/33764) — transcription with `response_format=json` fails pydantic validation (SDK and proxy). [#22747](https://github.com/BerriAI/litellm/issues/22747) — Azure Responses path ignores `timeout` (~60s aiohttp idle timeout breaks GPT-5-PRO reasoning runs).
5. **Notable non-bug signals:** OpenCode Go ([#39503](https://github.com/BerriAI/litellm/issues/39503), closed) required an `x-opencode-session` header affecting 635 orgs — verify header forwarding if you route through managed-inference gateways. Reco native guardrail landed ([PR #48243](https://github.com/BerriAI/litellm/pull/48243)) **fail-closed by default**.

## 6. What This Means for Application Developers

- **Immediately re-verify your images and pin versions.** If you use floating tags or 1.107.0, rebuild from a known-good release, update your cosign trust root to the new key, and rotate any credentials that touched a host running 1.107.0. Assume compromise until proven otherwise.
- **Do not trust spend logs or budgets as a hard control right now.** Multiple open issues show zero-cost streaming rows, stale-spend rejections, and enforcement bypasses. If you bill customers or enforce hard quotas, add an independent metering layer (record your own token counts from responses) and reconcile against provider invoices. Budget-based circuit breakers are currently unreliable under load and without Redis.
- **Audit streaming paths specifically.** The most consistent class of bug is usage/cost loss on streaming, early client disconnect, or missing price-map slugs. If most of your traffic is streaming, your cost attribution is likely undercounted — the single highest-value fix is validating that final usage chunks carry `cached_tokens` and that disconnects don't drop the billable record.
- **Watch tool-calling regressions on custom providers.** [#48145](https://github.com/BerriAI/litellm/issues/48145) silently drops `tools` for JSON-defined non-catalog providers, and [#31909](https://github.com/BerriAI/litellm/issues/31909) historically stripped all tools under MCP semantic filtering. If you're an agent framework relying on function calling, test tool passthrough explicitly after any upgrade.
- **ChatGPT/Codex prompt caching is improving.** The `prompt_cache_key` forwarding PRs ([#42014](https://github.com/BerriAI/litellm/pull/42014), [#37630](https://github.com/BerriAI/litellm/pull/37630)) should measurably improve cache affinity for multi-turn agents once merged — worth tracking if you're optimizing cost/latency on Responses-style workloads.

</details>

<details>
<summary><strong>Unsloth</strong> — <a href="https://github.com/unslothai/unsloth">unslothai/unsloth</a></summary>

# Unsloth Digest — 2026-10-25

## 1. Today's Highlights

No releases landed in the last 24h, but issue and PR activity is dominated by a Windows desktop regression: the 2026-10-23 update introduced a false "our child is not listening" port-ownership check that kills every GGUF load after llama-server answers `/health` 200 (#15022), with a parallel report of all models failing on v0.1.910-beta (#15142). On the infrastructure side, the most consequential in-flight work is tensor-parallel splitting for idle GPU pairs (#14446), host/disk pricing for large lookup embedding tables (#14465), and a fix for Studio forcibly setting `preserve_thinking=true`, which silently overrode user chat templates and made `--no-reasoning-preserve` a no-op (#15115 → fix PR #15170).

## 2. Releases & Breaking Changes

None shipped. Two behavior changes are worth pre-tracking:

- **Studio's `preserve_thinking` default now being corrected** — Studio had been injecting `--chat-template-kwargs {"preserve_thinking": true}` at llama-server launch, which is applied *after* `--[no-]reasoning-preserve`, so user-supplied chat templates and `--no-reasoning-preserve` were ignored on Qwen3.8 GGUFs. Fix PR open: [PR #15170](https://github.com/unslothai/unsloth/pull/15170), [Issue #15115](https://github.com/unslothai/unsloth/issues/15115).
- **Docker image updates evict vLLM/SGLang installs** — each container update forces a manual re-download; a request for persistence or an env-flagged auto-redownload was closed: [Issue #15016](https://github.com/unslothai/unsloth/issues/15016).

## 3. New Model & Hardware Support

- **MOSS-Image GGUF discovery fixed** — downloaded GGUFs declare `general.architecture = moss_image`, which the inventory treated as a text model, so the On Device image filter omitted them. Registers `moss_image` in the shared image registry: [PR #15168](https://github.com/unslothai/unsloth/pull/15168).
- **Multi-host support requested** — scheduling inference and training across multiple machines in addition to multiple cards (8 👍, still open): [Issue #4858](https://github.com/unslothai/unsloth/issues/4858).
- **Custom headers for remote providers** — needed for LiteLLM-style backends that route or track on request headers; no config path exists today: [Issue #14811](https://github.com/unslothai/unsloth/issues/14811).

## 4. Performance & Optimization

- **Tensor-parallel across an idle GPU pair** — dense and MTP-MoE GGUF models currently use default layer split, leaving each card ~half-idle during decode; this PR uses `--split-mode tensor` for models that fit a single card: [PR #14446](https://github.com/unslothai/unsloth/pull/14446).
- **Lookup tables priced to host/disk, not VRAM** — DeepSeek-V4.1 Engram, Qwen3.8-Flash-Next, Gemma 4 per-layer embeddings and gemma-3n PLE were being priced as if the full table needed VRAM or pinned RAM, wrongly excluding quants like Qwen3.8-Flash-Next UD-Q2_K_XL (~73 GB) from hardware badges and the quant picker: [PR #14465](https://github.com/unslothai/unsloth/pull/14465).
- **KV preemption for parallel chats** — one llama-server, one KV cache; Studio would launch with `--parallel` and duplicate caches. PR hands parking to llama-server when it supports `--preempt-ram`: [PR #10301](https://github.com/unslothai/unsloth/pull/10301).
- **Per-region recompile limit for block compile (torch 2.13+)** — each compiled decoder block shared the process-wide dynamo `recompile_limit` (raised to 1024 by unsloth-zoo), so a perpetually-failing block could exhaust the budget for all others; introduces `isolate_recompiles` with a per-region cap: [PR #15157](https://github.com/unslothai/unsloth/pull/15157).
- **Wan text-encoder prompt cache fix** — the cache keyed on prompt + negative prompt together, re-encoding an unchanged negative on every new prompt; on fp16-only cards (e.g. T4) the UMT5 encoder is streamed from host RAM, so this cost real time per generation: [PR #15166](https://github.com/unslothai/unsloth/pull/15166).
- **Diffusion offload mode chosen per request** — whole-module vs streamed offload depends on the request's step count, unknown at load time; selection is now per-request (B200/A100 favor whole-module at all step counts, A100-40GB differs): [PR #15163](https://github.com/unslothai/unsloth/pull/15163).
- **Metal OOM recovery + DSpark/DFlash sidecar reservation** — DeepSeek-V4.1-Flash-1017 GGUF with DSpark sidecar, `--fit on`, `-c 8192 --parallel 4` died with `kIOGPUCommandBufferCallbackErrorOutOfMemory` and then served all requests as errors; PR reserves the sidecar in `--fit-target` and adds recovery: [PR #14431](https://github.com/unslothai/unsloth/pull/14431).

## 5. Stability & Regressions (ranked)

1. **CRITICAL — Every GGUF load killed on Windows Studio (2026-10-23 update)** — llama-server loads, answers `/health` 200, then Studio kills it and reports a misleading "GGUF file is valid / enough memory" error; real cause is the new port-ownership check. Reported 2026-10-23, still open: [Issue #15022](https://github.com/unslothai/unsloth/issues/15022).
2. **CRITICAL — All tested models fail to load on Windows desktop v0.1.910-beta** — reported today, 2 comments, no fix PR yet: [Issue #15142](https://github.com/unslothai/unsloth/issues/15142).
3. **HIGH — `preserve_thinking` forced at launch overrides user chat template** — silently changes reasoning/thinking behavior for Qwen3.8 GGUF users; fix PR open: [Issue #15115](https://github.com/unslothai/unsloth/issues/15115) → [PR #15170](https://github.com/unslothai/unsloth/pull/15170).
4. **HIGH — Main-branch test failures since #15137** — `test_return_logits_survives_for_training.py` fails 8/9 (`_refuse_tensor_parallel_for_inference` is `None`), and `test_studio_root_resilience.py` fails 3/7 due to `tests/utils` shadowing `studio/backend/utils`; fix PRs open: [PR #15162](https://github.com/unslothai/unsloth/pull/15162), [PR #15164](https://github.com/unslothai/unsloth/pull/15164).
5. **HIGH — AMD gfx1201 (Windows) ROCm launch failures after llama.cpp b11696** — display flashing and hard lockup; closed 2026-10-24: [Issue #14085](https://github.com/unslothai/unsloth/issues/14085).
6. **MEDIUM — Long tool-heavy chats stall in CPU conversation-archive embedding** — minutes of CPU embedding before llama.cpp sees any inference request on Ryzen AI MAX+ PRO 395; Stop does not cancel archiving; closed: [Issue #14519](https://github.com/unslothai/unsloth/issues/14519).
7. **MEDIUM — Assistant messages cannot be edited after refresh** — desktop app, still open: [Issue #15004](https://github.com/unslothai/unsloth/issues/15004).
8. **MEDIUM — Embedding models disappear from `v1/models` / GUI** — still served on `/embeddings`: [Issue #15110](https://github.com/unslothai/unsloth/issues/15110).
9. **LOW — Model Hub filter regression** — closed: [Issue #14221](https://github.com/unslothai/unsloth/issues/14221).

## 6. What This Means for Application Developers

- **Hold Windows desktop upgrades.** If you ship or test against Unsloth Studio Desktop on Windows, v0.1.909-beta (port-check issue) and v0.1.910-beta (all-model load failure) are both unsafe; pin a pre-2026-10-23 build until #15022/#15142 are resolved.
- **Audit reasoning behavior on Qwen3.8.** If you relied on `--no-reasoning-preserve` or a custom `chat_template` via `llama_extra_args`, Studio has been overriding it with `preserve_thinking=true`. Patch #15170 restores your settings — verify thinking tokens are stripped as expected after upgrading.
- **Don't assume embedding endpoints are absent just because `v1/models` is empty.** The model is live on `/embeddings` (#15110); probe the endpoint directly if you route by model listing.
- **Watch the KV-preemption PR (#10301) if you serve concurrent chats.** It changes how parallel-request KV cache is allocated and parked — relevant if you tune `--parallel` or rely on per-conversation cache isolation.
- **Multi-GPU denser models are about to get faster at decode.** Once #14446 lands, models that fit on one card can be tensor-split across an idle pair; benchmark your decode throughput after adoption, as the layer-split default left ~50% of each card idle during decode.
- **Large-embedding-table models (Engram, Qwen3.8-Flash-Next, Gemma 4 PLE, gemma-3n)** will become visible and selectable on more hardware after #14465, since those tables are priced to host/disk rather than VRAM; expect the quant picker to start offering much larger quantizations on the same GPU.
- **Teacher distillation without co-residency is on the roadmap** — offline top-k logprobs and served teachers (DeepSeek/Kimi-K2-class) as an alternative to fitting teacher and student together (#11556). Worth tracking if your fine-tuning pipeline is memory-bound by teacher weights.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*