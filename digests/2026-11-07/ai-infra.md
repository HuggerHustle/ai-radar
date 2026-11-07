# AI Infrastructure Digest 2026-11-07

> Generated: 2026-11-07 00:50 UTC | Projects covered: 6

- [vLLM](https://github.com/vllm-project/vllm)
- [SGLang](https://github.com/sgl-project/sglang)
- [llama.cpp](https://github.com/ggml-org/llama.cpp)
- [Ollama](https://github.com/ollama/ollama)
- [LiteLLM](https://github.com/BerriAI/litellm)
- [Unsloth](https://github.com/unslothai/unsloth)

---

## Cross-Project Comparison

# Cross-Project Comparison Report — AI Infrastructure Ecosystem
**Digest date: 2026-11-07**

---

## 1. Ecosystem Overview

Today's activity reflects a maturing but still unstable inference stack: no project shipped a major release in the last 24 hours, yet every tracker shows heavy PR/issue churn concentrated on **correctness regressions in hybrid-attention and MoE models** (vLLM, SGLang, llama.cpp all report silent KV/quant corruption), **P/D disaggregation correctness** (vLLM NixlConnector, SGLang PP deadlocks), and **long-context agent workloads** (reasoning parsers, tool-call streaming, gateway state). Performance work has shifted from raw kernel wins toward **weight-load latency** (SGLang's sub-second Weight Cache Daemon), **CPU/GPU memory accounting** (Ollama runner leaks, llama.cpp ClassLRU MoE cache), and **speculative-decoding verification** across AMDs, Vulkan, and OpenCL. Meanwhile, gateway and training layers (LiteLLM, Unsloth) are absorbing the fallout of upstream regressions via adapter-level backports and Studio-side UX fixes. The net signal is a stack where **model/architecture coverage is racing ahead of correctness guarantees**, and operators are being asked to validate per-model rather than per-version.

---

## 2. Activity Comparison

| Project | Layer | Releases (24h) | Issue Activity | PR Activity | Dominant Theme |
|---|---|---|---|---|---|
| **vLLM** | Serving engine | None (0.32.0 backlog burn-down) | High — NixlConnector #61229, GDN+PP #63505, `int8_per_token_head` #50702/#50749 | Heavy — MoE quant fixes, Rust frontend tool-call streaming, XPU MoE | Correctness in disaggregation + hybrid models |
| **SGLang** | Serving engine | None | Very high — coredump tracker (#26340, 356 comments), CI flaky tracker (#42752, 186) | Active — DSV4.1 FP8 MegaAttention, DSA packed prefill, AMD MTP verify | FP8 KV scale bug #48749 is top-of-stack |
| **llama.cpp** | Local runtime | **9 builds (b12170–b12180)** | Moderate — Vulkan coopmat #31560, RAM cache #27148, CUDA IMA #31077 | Active across Hexagon/Vulkan/OpenCL/WebGPU | Kimi-K3.1-Pro landing + backend tuning |
| **Ollama** | Local runtime | None (0.40.x line) | High — Vulkan/iGPU crashes #19558, #19158, #19589 | Moderate — runner leak #19581, Claude Code routing #19587 | Post-migration regression on AMD/Intel |
| **LiteLLM** | Gateway | **v1.108.2 (LTS patch)** | High — Gemini stream corruption #25869, tool drop #48145, cache_control #47046 | Very high — LTS backports from `mateo-berri` | LTS consolidation + agent-loop correctness |
| **Unsloth** | Training/Fine-tuning | **v0.1.916-beta** | High — 39 updated; Krea crash #16892, multi-GPU #16925 | High — Studio P1 perf, MCP break, chat-template fix | Desktop/Studio UX + transformers 5.23 migration |

**Reading the table:** shipping velocity is inversely correlated with scope — llama.cpp ships daily builds for a single-node runtime; vLLM/SGLang, operating at cluster scale, are burning down long-tail correctness before cutting releases. LiteLLM is the only project actively **running a backport branch ahead of `main`**, signaling that LTS consumers are its priority over `main`-trackers.

---

## 3. Model Support Race

**Architecture support is no longer a moat — correctness is.**

| Architecture / Model | vLLM | SGLang | llama.cpp | Ollama | LiteLLM | Unsloth |
|---|---|---|---|---|---|---|
| **DeepSeek-V4.1** (Engram, SP+PP, FP8 MegaAttn) | ✅ Engram offload #62238, SP+PP #65766 | ✅ FP8 MegaAttention #48926 | — | — | ✅ catalog add | — |
| **Kimi-K3.1-Pro** (DSA sparse attention) | — | — | ✅ **b12180 spec + conversion** | — | ⚠️ requested, closed without impl (#33921) | — |
| **Qwen3.8 family** (GDN hybrid, QSA cache) | ✅ Rust frontend tool-call #66198; GDN bug #63505 | ✅ QSA cache sharding #43527 | — | ✅ MLX mixed-precision #18078 | — | — |
| **Gemma 4** | ✅ Rust tool-call streaming #66199 | — | ✅ prefill gains #31356; MTP IMA #31077 | ✅ tool-arg fix #19274 | — | ✅ chat-template reasoning fix #16699 |
| **GLM-5.3-Flash** | ✅ P/D GB200 issue #55434 | ⚠️ degeneration #36669 | ✅ CUDA IMA #28282 | — | — | — |
| **Nemotron 3.5 ASR / dense** | ⚠️ ASR request #47455 | — | — | ❌ dense gap #19566 | — | — |
| **Cosmos3 (video)** | — | — | — | — | ✅ OpenRouter video fields #50319 | ✅ Edge/Nano, Sim-Transfer #16737/16741/16975 |
| **MiMo-V2 / MageVL** | ✅ timestamp fix #66201 | — | ✅ MageVL #31819 | — | — | — |

**Who's ahead:**
- **vLLM leads on frontier serving breadth** — first to land DeepSeek-V4.1 Engram offload, MXFP4 packed tables, and sequence-parallel + PP combinations. But its headline wins are on hardware most users don't yet run (SM120).
- **llama.cpp leads on conversion/locality** — Kimi-K3.1-Pro (a DSA-sparse architecture) landed with converter + tests on day one, and PLE shard loading (#31185) shows a push toward composable GGUF layouts.
- **Unsloth leads on creative/multimodal generation** — Cosmos3 workflows (continuation, restyle) and AI-agent integration (Claude Agent connection #16963) are unique to it.
- **LiteLLM is the strategic aggregator** — its value is catalog depth (Baseten, CoreWeave Forge, Foundry Local, OpenRouter video), not model architecture engineering.

**Watchpoint:** Kimi-K3 (Moonshot) and Tinker remain closed-without-implementation on LiteLLM (#33921) — a real gap for teams standardizing on gateway-fronted frontier models.

---

## 4. Performance Frontier

Optimization effort has **fragmented across five loci**, with diminishing returns near single-node hardware:

**(a) KV cache & memory management** — the most active frontier.
- vLLM: `int8_per_token_head` scale-view fill corrupting GDN state (#63944); batch-invariant mode routing Linear to Triton unnecessarily on Hopper/Blackwell (#65569).
- SGLang: Weight Cache Daemon Phase 1 (#33522) — **306–327s → <1s weight loads** on Qwen3-235B FP8 is the single largest latency win reported today.
- llama.cpp: ClassLRU MoE expert cache (#31233) changes eviction semantics; RAM prompt cache correctness (#27148) is a liability.
- Unsloth: idle-unload reload fidelity (#16927) — preserving KV dtype/context across unload.

**(b) Batching & scheduling**
- vLLM: TRT-LLM monolithic MoE skips padded rows under DP (#65972); encoder CUDA graphs simplify replay (#65227).
- SGLang: DSA packed prefill top-k to CUDA (#45891); AMD MTP rejection-sampling verify drops vocab-wide sort (#48090).
- Ollama: scheduler VRAM accounting fix (#19585), runner-leak fix (#19581).

**(c) Quantization**
- Diverging: vLLM lands MXFP4-packed Engram tables (#61530) and lifts QuIP Hadamard TP (#65732); SGLang's **FP8 KV scales silently ignored (#48749)** is a correctness regression, not a perf gain.
- llama.cpp NVFP4 on Blackwell (#23572) closed — native FP4 MMA at Q4_0 footprint.

**(d) Distributed serving**
- vLLM: GDN+PP=3 on sm_86 (#63505), TP4+EP regression on MiniMax-M2.7 (#63705), SP+PP enablement for DeepSeek-V4 (#65766).
- SGLang: PP disaggregated prefill deadlock on abort storms (#34572, closed w/ RCA).

**(e) Kernels & backends**
- **MoE dominates:** SM12x alignment regression (#58624), DeepSeek shared-expert FP16 division (#65842), XPU XE3P grouped GEMM (#60609), ROCm `wvSplitK` (#63725).
- **Non-CUDA catching up:** Hexagon CONV_3D (#31814), KleidiAI SME2 for ARM FA (#29394), OpenCL small-n GEMV (#31831), Vulkan readonly decodeBuf (#31833).

**Verdict:** The frontier has moved from "make it faster on H100" to **"make it correct on the hardware people actually own"** — SM120s, MI355X, Intel Arc, Strix Halo, Apple Silicon.

---

## 5. Layer Positioning

The six projects map cleanly onto four distinct layers, with notable overlaps at the edges:

| Layer | Project(s) | Primary consumer | Moat |
|---|---|---|---|
| **Cluster serving engine** | vLLM, SGLang | Platform/infra teams, Kubernetes operators | Kernel breadth, disaggregation, cluster-scale scheduling |
| **Local runtime** | llama.cpp, Ollama | Desktop/server hobbyists, edge deployments, privacy-sensitive apps | Hardware ubiquity, conversion tooling, quantization variety |
| **LLM gateway** | LiteLLM | App/agent teams, platform API teams | Provider/catalog breadth, budget, observability, LTS discipline |
| **Training / fine-tuning** | Unsloth | Model builders, small fine-tuning teams | LoRA efficiency, Studio UX, GGUF export |

**Distinctions that matter:**
- **vLLM vs SGLang:** vLLM is breadth-first (more models, more backends, expandable frontend in Rust); SGLang is depth-first on a narrower set of frontier models (DeepSeek, Qwen3.8, GLM) with tighter kernel integration and a **documented, prioritized stability ladder** (their digest ranks severity explicitly).
- **llama.cpp vs Ollama:** llama.cpp is the engine-of-record for portability; Ollama is the UX layer on top. Ollama's 0.40.x migration **to llama-server as the runner** is the reason its stability issues now track upstream builds — meaning Ollama regressions frequently mirror llama.cpp build regressions, delayed.
- **LiteLLM's positioning has shifted** — it's no longer a routing shim but a **compatibility normalization layer**, absorbing provider quirks (Gemini `thought_signatures`, Anthropic `server_tool_use`, Bedrock reasoning replay). For agent teams, it's the abstraction that decides whether your tool loop works.
- **Unsloth is the only project spanning training → inference** (train LoRA → export GGUF → run in Studio/llama.cpp). This vertical integration is its moat, but it also means it inherits upstream runtime risk.

**Overlap risk:** SGLang's MindIE-SD RFC (#48582) and USE for FlashInfer-style plugins, plus vLLM's Rust frontend, suggest **serving engines and gateways are beginning to blur** — vLLM may absorb functionality currently delegated to LiteLLM.

---

## 6. Trend Signals

**T1 — Hybrid-attention is the new correctness frontier.** GDN, DSA, QSA, MLA, MoE-with-shared-experts appear in **six** separate correctness bugs across vLLM, SGLang, and llama.cpp today. Pre-hybrid, attention was uniform and correctness was tractable; post-hybrid, each architecture has its own cache/scale/prefix-caching interaction matrix.

**T2 — Silent corruption is the dominant failure mode.** #61229 (NixlConnector KV), #48749 (FP8 KV scales), #27148 (RAM cache cross-contamination), #50702 (`int8_per_token_head`) all **produce plausible output while being wrong**. This is qualitatively worse than crashes — it defeats canary throughput benchmarking.

**T3 — Disaggregated P/D is still not production-safe.** vLLM's NixlConnector lease expiry (#61229), SGLang's PP deadlock on aborts (#34572), and llama.cpp's roadmap item #21266 all indicate that disaggregation is the most-discussed feature and the least-trustworthy, in the same cycle.

**T4 — Weight-load latency is the new cold-start battleground.** SGLang's sub-second weight cache, Unsloth's idle-unload fidelity, and Ollama's VRAM leak fix all serve the same pattern: **trainer→engine sync, LoRA hot-swap, multi-tenant redeploys**. The era of "load once, serve forever" is ending.

**T5 — Agent-loop correctness is increasingly a gateway concern.** LiteLLM is absorbing bugs that originate in provider streaming semantics (Gemini thought signatures, Anthropic `server_tool_use`, OpenRouter empty choices, Bedrock reasoning replay). **Agent developers should expect their gateway, not their LLM, to be the loop-breaking component.**

**T6 — Non-NVIDIA hardware is a first-class citizen — with growing regression surface.** Vulkan coopmat nondeterminism on Intel Arc (#31560), Ollama iGPU load crashes (#19558/#19158/#19589), ROCm gfx1151 OOM (#64098), SM12x MoE regression (#58624). The portability win is real; the QA cost is real too.

---

### What Agent / Application Developers Should Do This Week

1. **Pin per-model, not per-version.** No engine is "safe at vX.Y.Z" today — safety is per (engine, model, hardware, prefix-caching-state) tuple. Build a per-model canary eval that checks **output identity**, not throughput.
2. **Bisect any output drift by toggling prefix caching first.** Bugs #63505, #50702, #51771, #27148 all surface only with prefix caching on.
3. **Validate disaggregated deployments against a non-disaggregated baseline before upgrading.** #61229 will not raise an error.
4. **On gateways, test multi-turn tool loops daily on your primary model — not just the connector.** LiteLLM items 1–9 in §5 have no fix PRs; several are stale.
5. **Exploit the weight-load wins.** If you redeploy frequently, SGLang's Weight Cache Daemon (#33522) is currently the largest operational win on the board.
6. **For desktop/edge: pin to last-known-good** — llama.cpp b12180 (Kimi-K3.1-Pro), Ollama 0.34.4 for AMD/Intel iGPU users, Unsloth v0.1.916-beta for long-chat UX, transformers <5.23.
7. **Watch the LiteLLM `lts` tag** — fixes are landing there *ahead of* `main`; if your team tracks `main`, you are actively diverging from the supported path.

---

## Per-Project Reports

<details>
<summary><strong>vLLM</strong> — <a href="https://github.com/vllm-project/vllm">vllm-project/vllm</a></summary>

# vLLM Digest — 2026-11-07

## 1. Today's Highlights

No releases in the past 24h, but issue and PR activity is heavy and concentrated on three themes: KV-cache correctness in disaggregated/hybrid deployments (NixlConnector lease expiry, `int8_per_token_head` corruption, Qwen3.8 GDN + PP), a cluster of MoE quantization/scaling fixes (DeepSeek shared-expert FP16 division, TRT-LLM DP padding, SM12x DeepGEMM alignment regression), and continued maturation of the Rust frontend, which now has streaming tool-call argument support landing for Gemma 4 and Qwen Coder. Two closed bugs (#63944, #56900) and one closed release-blocker (#59203 → #60762) indicate the maintainers are actively burning down the 0.32.0 regression backlog.

## 2. Releases & Breaking Changes

None. No new tags in the last 24h. Note that #59203 (block-size failures on the v0.32.0 release tag for DeepSeek V4.1 on SM120) was closed today with the fix tracked in #60762 — users on `v0.32.0` with SM120 hardware should track that PR before pinning.

## 3. New Model & Hardware Support

- **DeepSeek-V4.1 Engram offload** — PR #62238 adds disk offload for ~197 GB Engram tables on memory-constrained nodes (Strix Halo, DGX Spark); PR #61530 adds MXFP4-packed Engram embedding tables (E2M1 + UE8M0 block-32 scales). [PR #62238](https://github.com/vllm-project/vllm/pull/62238) · [PR #61530](https://github.com/vllm-project/vllm/pull/61530)
- **DeepSeek-V4 sequence parallelism with PP** — PR #65766 enables SP for MegaMoE + EP + TP>1 when pipeline parallelism is active (previously disabled for PP>1). [PR #65766](https://github.com/vllm-project/vllm/pull/65766)
- **NVIDIA Nemotron 3.5 ASR Streaming** (`nemotron-3.5-asr-streaming-0.6b`, 600M multilingual streaming ASR) — feature request open. [Issue #47455](https://github.com/vllm-project/vllm/issues/47455)
- **Intel XPU MoE** — PR #60609 aligns `XpuFusedMoe` weight/scale layout with vllm-xpu-kernels XE3P grouped GEMM; PR #46871 continues the XPU all-to-all EP backend for batched MoE. [PR #60609](https://github.com/vllm-project/vllm/pull/60609) · [PR #46871](https://github.com/vllm-project/vllm/pull/46871)
- **Compressed-tensors TP for block-diagonal Hadamard** — PR #65732 lifts the `NotImplementedError` on QuIP-style online Hadamard transforms with TP>1. [PR #65732](https://github.com/vllm-project/vllm/pull/65732)
- **MiMo-V2 omni video timestamp fix** — PR #66201 corrects frame media-time labelling (was clamping all clips to 00:00–00:30). [PR #66201](https://github.com/vllm-project/vllm/pull/66201)

## 4. Performance & Optimization

- **SM12x MoE decode regression** — ~15% slower since #56876 because `get_theoretical_mk_alignment_for_contiguous_layout` returns 128 instead of 64 on SM12x. Open, no fix PR yet. [Issue #58624](https://github.com/vllm-project/vllm/issues/58624)
- **MiniMax-M2.7 throughput regression** — TP4 + EP degraded across v0.29/0.31/0.32. [Issue #63705](https://github.com/vllm-project/vllm/issues/63705)
- **Batch-invariant mode on Hopper/Blackwell** routes Linear layers to Triton even though cuBLAS is already batch-invariant under the mode's settings — unnecessary overhead. [Issue #65569](https://github.com/vllm-project/vllm/issues/65569)
- **GLM-5.3 P/D on GB200** — NIXL submission of 91k–120k KV descriptors per TP-rank transfer dominates over fabric bandwidth, making MNNVL/cuda_ipc slower than RDMA on this workload. [Issue #55434](https://github.com/vllm-project/vllm/issues/55434)
- **DSpark sampling** — PR #64476 fuses Markov bias and block combine into Gumbel sampling (split from #63232). [PR #64476](https://github.com/vllm-project/vllm/pull/64476)
- **Encoder (ViT) CUDA graphs** — PR #65227 replaces greedy power-of-2 replay splitting with one replay per batch and a finer grid. [PR #65227](https://github.com/vllm-project/vllm/pull/65227)
- **TRT-LLM monolithic MoE under DP** — PR #65972 skips padded rows in FlashInfer monolithic kernels (Blackwell block-FP8/MXFP8 default path). [PR #65972](https://github.com/vllm-project/vllm/pull/65972)
- **ROCm Muse Spark pooler/unpooler** — PR #63725 routes replicated BF16 GEMMs through `wvSplitK` on gfx942/gfx950. [PR #63725](https://github.com/vllm-project/vllm/pull/63725)
- **ROCm DSv4.1 KV-only insert** — PR #60076 enables `fused_deepseek_v4_kv_rope_insert` on MI355X, avoiding a throwaway zero-query. [PR #60076](https://github.com/vllm-project/vllm/pull/60076)

## 5. Stability & Regressions

**Critical**

- **NixlConnector silent KV corruption** (#61229, OPEN) — with the pull flow, producer releases KV blocks on lease expiry while a remote READ is in flight; decode silently consumes overwritten KV. This is a **correctness-silent** failure in P/D disaggregation (`UCX_TLS=tcp,cuda_copy`, vLLM 0.30.0). No fix PR referenced. [Issue #61229](https://github.com/vllm-project/vllm/issues/61229)
- **Qwen3.8-27B GDN hybrid + PP=3 on sm_86** (#63505, OPEN) — Xid 31 illegal memory access with prefix caching, gibberish without it; regression since v0.28.0 affecting v0.31.0 and v0.32.0. [Issue #63505](https://github.com/vllm-project/vllm/issues/63505)
- **DeepSeek-V4-Flash EAGLE/MTP + prefix caching** (#51771, OPEN) — untested for hybrid models with ≥3 attention groups; prior fix #33524 only covered the 2-group GPT-OSS shape. [Issue #51771](https://github.com/vllm-project/vllm/issues/51771)

**High**

- **TP worker hang → EngineDeadError** (#41530, OPEN, 8 👍) — DeepSeek-V4-Pro, TP=8, MTP speculative decoding; `sample_tokens` RPC timeout. [Issue #41530](https://github.com/vllm-project/vllm/issues/41530)
- **`int8_per_token_head` KV corruption** — two related reporters: #50702 (prefix caching + 100% KV pool, Gemma-4 hybrid) and #50749 (first generated tokens corrupt when prefix caching is disabled). A root-cause was already identified in #63944 (CLOSED): scale-view fill overwrites Gated DeltaNet state in hybrid models. [Issue #50702](https://github.com/vllm-project/vllm/issues/50702) · [Issue #50749](https://github.com/vllm-project/vllm/issues/50749) · [Issue #63944](https://github.com/vllm-project/vllm/issues/63944)
- **Marlin MoE output depends on within-expert token ordering** (#52525, OPEN) — batch-invariance violation, relevant to anyone relying on deterministic outputs. [Issue #52525](https://github.com/vllm-project/vllm/issues/52525)
- **Qwen3.5-9B GDN + dynamic LoRA on H20 → NaN** (#52568, OPEN) — punica Triton kernel bug, long sequences. [Issue #52568](https://github.com/vllm-project/vllm/issues/52568)
- **DeepSeek MoE shared-expert FP16 division** — PR #65842 fixes #65533: since #35949 the MoE runner divides shared expert output by `routed_scaling_factor` in FP16 for any model setting `apply_routed_scale_to_output=True`, which is only correct for decoder-compensating families. [PR #65842](https://github.com/vllm-project/vllm/pull/65842)

**Moderate**

- **Responses API `previous_response_id`** (#43244, OPEN) — drops `function_call`/`function_call_output` from stored context. Directly affects agent loops using the Responses API. [Issue #43244](https://github.com/vllm-project/vllm/issues/43244)
- **ROCm GLM-5.2 MTP on MI355X** (#52833, CLOSED) — 0% draft acceptance; EP disable triggers `hipErrorIllegalAddress`.
- **ROCm gfx1151 OOM** — PR #64098 bounds DeepSeek V4 DSpark long-run memory growth that previously killed Ray workers. [PR #64098](https://github.com/vllm-project/vllm/pull/64098)
- **Step5 MTP + PP** — PR #66000 fixes startup re-validation of the draft config view. [PR #66000](https://github.com/vllm-project/vllm/pull/66000)

**Also closed today:** #56900 (Qwen1.5-MoE degenerate output under torch.compile on H100 — resolved).

## 6. What This Means for Application Developers

- **P/D disaggregation is not yet safe to trust blindly.** #61229 is a silent-corruption class bug — the wrong KV is read, tokens are still emitted, and nothing errors. If you run disaggregated prefill/decode with NixlConnector over TCP/UCX, validate outputs against a non-disaggregated baseline before upgrading, and follow the tracking issue #63149 (KV event correctness across Dynamo, llm-d, and vLLM Router).
- **Hybrid-attention models dominate the risk surface.** GDN, DSpark, MLA + DSA, MoE-with-shared-experts, and EAGLE/MTP all have open correctness or regression reports this cycle. Keep per-model canary evals (not just throughput benchmarks) before promoting new vLLM versions.
- **Prefix caching interacts with many of these bugs.** #63505, #50702, #51771 all reproduce only (or differently) with prefix caching on. If you see subtle output drift after an upgrade, toggling prefix caching is a fast bisect.
- **If you're building agents:** the Responses API state bug (#43244) can silently break multi-turn tool loops when using `previous_response_id`. Prefer passing full message history or verify your stored-context round-trip. Watch PR #64654 for an ID-only logging mode that preserves request correlation without logging content — useful for gateway-side observability.
- **Tool-calling streaming on Rust frontend is arriving:** PRs #66198 (Qwen Coder) and #66199 (Gemma 4) push string argument fragments earlier rather than buffering to end-of-call. This reduces time-to-first-argument for agent UIs; both are gated behind `VLLM_USE_RUST_FRONTEND=1`.
- **Quantization users on SM12x / MiniMax / GLM-5.3 should hold or pin** until #58624 and #63705 are resolved — both are live throughput regressions with no merged fix.

</details>

<details>
<summary><strong>SGLang</strong> — <a href="https://github.com/sgl-project/sglang">sgl-project/sglang</a></summary>

# SGLang Digest — 2026-11-07

## 1. Today's Highlights

No new releases landed in the last 24h, but activity remains heavy: the CUDA Coredump Tracker (#26340, 356 comments) and the CI flaky-test tracker (#42752, 186 comments) continue to dominate attention, suggesting sustained stability pressure on `main`. On the engineering side, the day's notable work is concentrated in DeepSeek-V4.1 attention correctness/performance (FP8 mega attention for prefill, padded-extend fix), and a cluster of long-standing correctness bugs around reasoning parsing, model gateway request forwarding, and FP8 KV-cache scale handling.

## 2. Releases & Breaking Changes

None in the last 24h.

## 3. New Model & Hardware Support

- **DeepSeek-V4.1-Flash FP8 MegaAttention (prefill)** — PR #48926 integrates FlashMLA's all-FP8 MegaAttention path for DSV4.1-Flash prefill. [link](https://github.com/sgl-project/sglang/pull/48926)
- **MindIE-SD as an optional Ascend acceleration library for SGLang Diffusion (RFC)** — proposes dense quantized attention and sparse attention via the existing attention architecture, positioned similarly to FlashInfer. [link](https://github.com/sgl-project/sglang/issues/48582)
- **QSA cache sharding for Qwen3.8 hybrid models** — shards QSA raw K/V history and compressed cache using existing page-interleave/allocator infrastructure. [link](https://github.com/sgl-project/sglang/pull/43527)
- **Apple Silicon serving redesign (RFC)** — Torch-owned SRT path with an exported whole-model MLX region; implementation PR #36164 referenced. [link](https://github.com/sgl-project/sglang/issues/32321)
- **AMD Q4 2026 roadmap** — new hardware coverage for Helios rack-scale, MI45x (gfx1250), Ryzen AI Halo (gfx1151/1152), plus monokernel work. [link](https://github.com/sgl-project/sglang/issues/46462)
- **Megakernel plugin contract extended to prefill/extend** — beyond the existing decode coverage. [link](https://github.com/sgl-project/sglang/pull/47930)

## 4. Performance & Optimization

- **Weight Cache Daemon (Phase 1 landed)** — post-quantized weights served over CUDA IPC; weight load drops from ~306–327s to **<1s** on Qwen3-235B FP8. Roadmap issue tracks next phases. [link](https://github.com/sgl-project/sglang/issues/33522)
- **DSV4 prefill on SM120 throughput gap reported** — 4× RTX PRO 6000 (TP=4) shows ~2–7K tok/s vs ~12.5K reported for vLLM/marlin on identical hardware; tuning guidance requested. [link](https://github.com/sgl-project/sglang/issues/33422)
- **DSA packed prefill top-k moved to CUDA** — replaces the per-row-CTA `fast_topk_transform_fused` kernel, which dominates long-context prefill for GLM-5.x and DeepSeek-V3.2. [link](https://github.com/sgl-project/sglang/pull/45891)
- **AMD MTP rejection-sampling verify optimized** — skips the vocabulary-wide sort; on MI355X Qwen3.8-Flash-Next @ concurrency 16, 2.2 ms/decode-step was being spent building dense target probabilities. [link](https://github.com/sgl-project/sglang/pull/48090)
- **Weight sync: one serialized payload per TP rank** — PR #48241 (closed) removes the need for HTTP callers pushing LoRA adapters to send one copy per TP rank. [link](https://github.com/sgl-project/sglang/pull/48241)
- **BF16 low-M GEMM autotuning via FlashInfer `mm_bf16`** — depends on FlashInfer 0.7.3 bump; prior tuner measured every small GEMM at ~10 µs on 0.7.2. [link](https://github.com/sgl-project/sglang/pull/43703)
- **AMD DSA DCP prefill routing by wire bytes** — chooses between owned all-gather + LSE merge and gathered-prefix paths. [link](https://github.com/sgl-project/sglang/pull/48505)
- **ERNIE-Image image-prefix sequence parallelism enabled** — baselines previously failed native Ulysses2 before model execution. [link](https://github.com/sgl-project/sglang/pull/48218)
- **Static FP8 activation quantization fusion proposal closed as inactive** — standalone `_static_quant_fp8` kernel before every FP8 GEMM was the target. [link](https://github.com/sgl-project/sglang/issues/31504)

## 5. Stability & Regressions

Ranked by severity:

1. **FP8 KV-cache scales silently ignored** (OPEN) — attention built without `quant_config` affects GLM-4.5, Llama 4, Qwen3-MoE, GPT-OSS, HunYuan, HY3, K-EXAONE, LFM2. Correctness-affecting; no fix PR referenced yet. [link](https://github.com/sgl-project/sglang/issues/48749)
2. **Reasoning parser splits on first ``** (OPEN) — models quoting the literal closing tag inside their CoT truncate `reasoning_content` and leak the remainder into `content`. [link](https://github.com/sgl-project/sglang/issues/48791)
3. **Model gateway drops `cache_salt`** on `/v1/chat/completions` (OPEN) — silently diverges from direct-to-worker behavior. [link](https://github.com/sgl-project/sglang/issues/48793)
4. **DeepSeek-V4.1 MLP-sync-padded extend crash** (OPEN) — with `--moe-a2a-backend megamoe` under pure TP (attention TP > 1, no DP attention); warmup crashes because DSV4 attention mixes padded and real rows. **Fix PR exists**: #48980. [issue](https://github.com/sgl-project/sglang/issues/48892) · [fix](https://github.com/sgl-project/sglang/pull/48980)
5. **GLM-5.3-Flash thinking degenerates into repeated `!`** under multi-tool agentic prompts with `tool_choice=auto` (OPEN). [link](https://github.com/sgl-project/sglang/issues/36669)
6. **HiCache + Mooncake transient cache hit-rate dip** under L2/L3 capacity pressure — observed drop from 87.4% during multi-turn benchmark. [link](https://github.com/sgl-project/sglang/issues/47481)
7. **PP disaggregated prefill deadlock under abort storms** (CLOSED, RCA + fix series) — bootstrap queues diverge across stages on client-cancel bursts. [link](https://github.com/sgl-project/sglang/issues/34572)
8. **`fast_topk_v2` silently wrong top-k** when a radix threshold bucket exceeds its 4096-entry buffer (k=2048, long rows) (CLOSED). [link](https://github.com/sgl-project/sglang/issues/36807)
9. **sgl-router PD circuit breaker mismatch** — open breaker still dispatches to decode, producing a "permanent fake-dead prefill" (CLOSED). [link](https://github.com/sgl-project/sglang/issues/31206)
10. **CI:** multimodal-gen-test-2-gpu `test_kandinsky6_sr_decode_parallel` failing on `main` since #48366 merged (tensor-likes not close); nightly CUDA tier trimmed by removing 13 tests (PR #48990). [issue](https://github.com/sgl-project/sglang/issues/48892) · [pr](https://github.com/sgl-project/sglang/pull/48990)
11. **AMD DCP asm verify drops draft tokens under CUDA graph replay** (OPEN) — fix in PR #47645. [link](https://github.com/sgl-project/sglang/pull/47645)
12. **Rust processor `cached_tokens > prompt_tokens` for Kimi-K3** (OPEN) — two concurrent fixes: PR #48393 (Rust) and PR #35863 (Python). [link1](https://github.com/sgl-project/sglang/pull/48393) · [link2](https://github.com/sgl-project/sglang/pull/35863)

## 6. What This Means for Application Developers

- **If you serve FP8 models with KV-cache quantization (GLM-4.5, Llama 4, Qwen3-MoE, GPT-OSS, etc.):** verify your checkpoint's KV scales are actually being applied. Issue #48749 suggests attention may be silently built without quantization config, which affects output quality rather than throwing an error. This is the single most impactful item today for production quality.
- **Agent builders using reasoning models:** the `` parser bug (#48791) can corrupt multi-turn agent traces whenever the model reasons *about* think-tag handling. Until fixed, consider robust post-processing or prompt-level avoidance.
- **Gateway users:** if you rely on `cache_salt` for prefix-cache isolation or tenant separation, be aware it's currently dropped by `sgl-model-gateway` (#48793) — requests will share cache as if the salt were absent, which may have privacy/correctness implications.
- **Multi-tool agentic workloads on GLM-5.3-Flash:** degradation into repeated tokens (#36669) is a real failure mode with `tool_choice=auto` and complex prompts; add output-sanity guards.
- **DeepSeek-V4.1 + megamoe under pure TP:** expect warmup crashes until #48980 lands. Avoid the combination or track the fix.
- **Weight reload / LoRA hot-swap workflows:** Phase 1 of the Weight Cache Daemon cut weight loads on large FP8 models from minutes to sub-second — large win for frequent redeploys and trainer→engine weight sync loops (see also #48241 for reducing per-rank payload duplication).

</details>

<details>
<summary><strong>llama.cpp</strong> — <a href="https://github.com/ggml-org/llama.cpp">ggml-org/llama.cpp</a></summary>

# llama.cpp Digest — 2026-11-07

## 1. Today's Highlights

Model coverage expanded with **Kimi-K3.1-Pro** (DSA replacing full-attention MLA on 24 of 93 layers) landing in b12180, alongside a wave of backend tuning across Hexagon, Vulkan, OpenCL and WebGPU. On the stability side, the most notable open items are a **Vulkan KHR_coopmat nondeterminism bug on Intel Arc B70** and a **RAM-backed prompt cache correctness issue** that can cross-contaminate conversations under concurrent load — both matter for production deployments. The disaggregated prefill/decode roadmap item (#21266) remains the most-discussed open feature at 35 comments.

## 2. Releases & Breaking Changes

Nine builds shipped in 24h (b12170–b12180). No hard API breaks, but two behavioural changes worth noting:

- **b12180** — new model architecture support (Kimi-K3.1-Pro); no migration needed for existing models. [PR #31779](https://github.com/ggml-org/llama.cpp/pull/31779)
- **b12177** — CLI no longer crashes on invalid UTF-8 in prompts or files. [Commit/PR #31563](https://github.com/ggml-org/llama.cpp/pull/31563)
- **b12174** — CMake now generates the Windows RC file directly instead of templating `win-app.rc.in`. Build-system only. [PR #31718](https://github.com/ggml-org/llama.cpp/pull/31718)
- **b12170** — MoE expert cache replaced with a **LRFU/MQ-inspired hybrid (`ClassLRU`)**. This changes expert eviction behaviour; benchmark before/after if you rely on `--n-cpu-moe` / MoE offload. [PR #31233](https://github.com/ggml-org/llama.cpp/pull/31233)
- **b12171** — Vulkan now detects ReBAR support and avoids BAR allocations when unavailable. Users with ReBAR disabled may see changed allocation behaviour. [PR #31658](https://github.com/ggml-org/llama.cpp/pull/31658)
- In flight: [#31377](https://github.com/ggml-org/llama.cpp/pull/31377) proposes removing the silent `n_ctx_slot` cap at `n_ctx_train`, allowing `--ctx-size` above training context. If merged, this is a semantic change for anyone relying on silent clamping.

## 3. New Model & Hardware Support

- **Kimi-K3.1-Pro text model** (b12180) — K3 variant where 24/93 layers use DeepSeek-style lightning indexer attention (32 heads × 128, top_k 2048, no RoPE); KDA linear-attention layers retained. Conversion + tests included. [PR #31779](https://github.com/ggml-org/llama.cpp/pull/31779)
- **MageVL-Cowork** multimodal support in progress, including RoPE work; also flags a Metal `set_prec` bug in `kernel_mul_mm_f32_f32` / `kernel_mul_mm_f16_f32`. [PR #31819](https://github.com/ggml-org/llama.cpp/pull/31819)
- **External PLE (engram) shard loading** — new `--shard` argument to load PLE files from a separate GGUF, with conversion support for PLE-less and PLE-only GGUFs. [PR #31185](https://github.com/ggml-org/llama.cpp/pull/31185)
- **Hexagon: CONV_3D support** sharing the CONV_2D op path, plus conv_2d optimizations. [PR #31814](https://github.com/ggml-org/llama.cpp/pull/31814)
- **OpenCL**: `repeat` now supported for f16, i32, i16, bf16. [PR #31782](https://github.com/ggml-org/llama.cpp/pull/31782)
- **WebGPU**: batched tensor API `get_tensor_n` / `set_tensor_n`. [PR #31473](https://github.com/ggml-org/llama.cpp/pull/31473)
- **NVFP4 quantization on Blackwell** (closed PR #23572) — CUDA-native FP4 with Blackwell MMA; claimed Q3_K-tier accuracy at Q4_0 size. [PR #23572](https://github.com/ggml-org/llama.cpp/pull/23572)
- **Multi-GPU Metal**: one backend device per physical GPU with cross-device copy guard (eGPU / multi-GPU Macs). [PR #28568](https://github.com/ggml-org/llama.cpp/pull/28568)

## 4. Performance & Optimization

- **Gemma 4 E2B/E4B prefill "massive gains"** — drops unused prompt tokens before KV-shared layers, avoiding compute on layers that don't contribute to KV. Merged/ready. [PR #31356](https://github.com/ggml-org/llama.cpp/pull/31356)
- **Hexagon: fused post-norm residual add into RMS_NORM_MUL** — removes one op launch and one DDR activation round-trip per attention/FFN block (×2 per layer) for Gemma-family models. [PR #31822](https://github.com/ggml-org/llama.cpp/pull/31822)
- **KleidiAI SME2 kernels for CPU flash attention** (ARM) — routes eligible FLASH_ATTN_EXT QK/AV tile products through F32 SME2 kernels. [PR #29394](https://github.com/ggml-org/llama.cpp/pull/29394)
- **OpenCL small-n GEMV variants** for dense q8_0 and MoE q4_k/q5_1 to improve speculative-decoding verification. [PR #31831](https://github.com/ggml-org/llama.cpp/pull/31831)
- **Vulkan `readonly` decodeBuf declarations** — no measured gain yet; expected in future driver versions. [PR #31833](https://github.com/ggml-org/llama.cpp/pull/31833)
- Known gap: **offloaded-MoE prefill leaves GPU idle on serial expert H2D copies** (single-GPU `-ncmoe`, RTX 3060 12GB). [Issue #25859](https://github.com/ggml-org/llama.cpp/issues/25859)
- Known gap: **Vulkan FA SCALAR fallback causes O(N²) PP degradation and device loss** on Intel Arc B580/ANV. [Issue #27638](https://github.com/ggml-org/llama.cpp/issues/27638)

## 5. Stability & Regressions

Ranked by severity:

1. **Vulkan KHR_coopmat nondeterminism — Intel Arc Pro B70 (BMG G31, Mesa 26.2.5)**: different output on every call for identical input with a BERT-style model, F16 and Q8_0, coopmat enabled by default. No fix PR referenced. [Issue #31560](https://github.com/ggml-org/llama.cpp/issues/31560)
2. **RAM-backed prompt cache cross-contamination (#27148)**: `--cache-ram` / `--cache-idle-slots` (both default-on) can restore KV from an unrelated finished conversation into a fresh slot under concurrent load — a correctness and potential data-isolation issue for multi-tenant servers. [Issue #27148](https://github.com/ggml-org/llama.cpp/issues/27148)
3. **CUDA illegal memory access, Gemma 4 31B + draft-mtp** after KV rollback/clear (checkpoint restore or full re-process); no crash with MTP off. [Issue #31077](https://github.com/ggml-org/llama.cpp/issues/31077)
4. **CUDA illegal memory access on GLM-5.3-Flash long prefill at `-ub 2048`** (Blackwell sm_120, PR branch only). [Issue #28282](https://github.com/ggml-org/llama.cpp/issues/28282)
5. **gfx1201 head-size-256 WMMA FA dispatch threshold too low** — ~20% speculative-decoding regression since #28102 on Radeon. [Issue #28867](https://github.com/ggml-org/llama.cpp/issues/28867)
6. **`draft-dflash` abort in `post_decode seq_rm`** on hybrid Qwen3.8-27B with `--parallel 8`. [Issue #31656](https://github.com/ggml-org/llama.cpp/issues/31656)
7. **SYCL dual Arc B60 `--cpu-moe -sm layer` stalls** with large MoE cache; ~100–1000× slower than single-GPU. [Issue #31510](https://github.com/ggml-org/llama.cpp/issues/31510)
8. **Spec decode regression with MTP n-max > 1 and `-np` > 1** on Vulkan. [Issue #27544](https://github.com/ggml-org/llama.cpp/issues/27544)
9. **CPU backend falsely reports MUL_MAT support** for types lacking `vec_dot` kernels (Q8_1, Q8_K, I64, I32) — NULL function pointer deref. Fix PR open. [PR #31832](https://github.com/ggml-org/llama.cpp/pull/31832)
10. Minor: memory leak report on aarch64/CUDA. [Issue #27725](https://github.com/ggml-org/llama.cpp/issues/27725)

Also relevant: [#30683](https://github.com/ggml-org/llama.cpp/pull/30683) fixes checkpoint reuse copying and a `--cache-reuse` bug where deleting a mid-prompt chunk could restore a checkpoint containing deleted tokens (wrong output).

## 6. What This Means for Application Developers

- **Treat the RAM prompt cache as suspect in multi-user setups until #27148 is resolved.** If you run `llama-server` with defaults under concurrent load, consider disabling `--cache-idle-slots` or isolating slots per tenant to avoid cross-conversation KV bleed.
- **Disable Vulkan coopmat on Intel Arc B-series** if you need deterministic outputs (classification, routing, eval harnesses) — #31560 shows per-call variance with defaults on.
- **MoE cache semantics changed in b12170.** Re-benchmark `--n-cpu-moe` workloads; eviction behaviour under the new ClassLRU differs from prior LRFU-only logic.
- **Gemma 4 deployments get meaningful prefill wins** from #31356 — worth pulling for long-prompt RAG/agent workloads.
- **Speculative decoding verification is being actively tuned** across OpenCL (#31831) and Vulkan (#27544 regression). If you depend on draft models for latency, pin your backend build and test MTP n-max > 1 explicitly.
- **Kimi-K3.1-Pro is now servable out of the box**, including conversion — relevant if you're evaluating DSA-style sparse attention for cost reduction on long-context agent traces.

</details>

<details>
<summary><strong>Ollama</strong> — <a href="https://github.com/ollama/ollama">ollama/ollama</a></summary>

# Ollama Digest — 2026-11-07

## 1. Today's Highlights

No new releases landed in the last 24 hours, but the issue tracker and PR queue were highly active: a Vulkan backend regression is now confirmed across multiple AMD/Intel iGPUs (Reiner, Navi 14) since the 0.40.x llama-server migration, and a scheduler bug (#19577) where failed runner termination silently leaks VRAM got a fix PR (#19581) the same day. On the tooling side, the `launch` integration path for Claude Code is being reworked (#19587) and several parser fixes landed for streaming tokens (deepseek3, gemma4, qwen3-coder tool calls).

## 2. Releases & Breaking Changes

None. No new tags in the last 24h. Note that the ongoing 0.40.x line migrated to a `llama-server`-based runner architecture, which is the root cause of several regressions below — teams pinned to 0.34.x should be aware of the behavioral delta.

## 3. New Model & Hardware Support

- **CUDA 13.5 / SM 103 for Windows ARM64** — CI now installs the separate ARM64 cross package; SM 121 retained. PR #19580 (closed/merged-track): [ollama/ollama#19580](https://github.com/ollama/ollama/pull/19580)
- **MLX: Nemotron dense architecture gap** — `NemotronForCausalLM` (used by Luciole 1B/23B Safetensors→MLX) is unsupported; MLX runner currently registers Nemotron-H only. Issue #19566: [ollama/ollama#19566](https://github.com/ollama/ollama/issues/19566)
- **MLX memory efficiency for Qwen3.8 Flash Next** — mixed-precision scheme (BF16 for QSA projections and non-expert MTP path, MXFP8 for other dense/control weights) replaces blanket NVFP4, which degraded long generations. PR #18078 (closed): [ollama/ollama#18078](https://github.com/ollama/ollama/pull/18078)
- **llama.cpp bump b12177** — upstream sync from b12111. PR #19576: [ollama/ollama#19576](https://github.com/ollama/ollama/pull/19576)

## 4. Performance & Optimization

- **Scheduler VRAM accounting** — fix for log lines split across writes breaking memory/VRAM parse (fixes #19204). PR #19585: [ollama/ollama#19585](https://github.com/ollama/ollama/pull/19585)
- **Runner leak fix (critical for throughput under load)** — when `Close` fails on keep_alive expiry, the runner stays resident holding VRAM while the scheduler frees its accounting; next load mis-predicts and tilts to CPU. PR #19581 keeps unstoppable runners in the loaded set. [ollama/ollama#19581](https://github.com/ollama/ollama/pull/19581)
- **Claude Code runtime routing** — `ollama launch claude` now scopes provider flags to the child process to prevent inherited settings rerouting requests. PR #19587: [ollama/ollama#19587](https://github.com/ollama/ollama/pull/19587)

## 5. Stability & Regressions

Ranked by severity:

1. **Vulkan backend crashes on AMD Renoir iGPU (gfx90c)** — `llama-server` exits `0xe06d7363` (unhandled C++ exception) at model load on every model, 0.40.14 and 0.40.15-rc2. Issue #19558: [ollama/ollama#19558](https://github.com/ollama/ollama/issues/19558)
2. **CUDA v13 grammar-constrained generation → Xid 79 (GPU falls off bus)** — long `format`-constrained runs on RTX 4070 Ti SUPER crash; same requests pass on cuda_v12. Issue #17026: [ollama/ollama#17026](https://github.com/ollama/ollama/issues/17026)
3. **SIGBUS on AMD RX 5500 (Navi 14/gfx1010)** — `llama-server --list-devices` crashes with exit 135; GPU not detected. Issue #19589: [ollama/ollama#19589](https://github.com/ollama/ollama/issues/19589)
4. **Intel Arc 130V (Lunar Lake) `device lost`** — gemma4:12b fails immediately on any GPU offload since 0.40.x; worked on 0.34.4. Issue #19158: [ollama/ollama#19158](https://github.com/ollama/ollama/issues/19158)
5. **Idle runner not terminated at keep_alive expiry → silent VRAM retention** — fix PR #19581 exists (see §4). Issue #19577: [ollama/ollama#19577](https://github.com/ollama/ollama/issues/19577)
6. **`/api/chat` intermittent 500 "apply-template … broken pipe"** — macOS, 0.40.8/0.40.11, after long streamed replies; retries succeed. Issue #19293: [ollama/ollama#19293](https://github.com/ollama/ollama/issues/19293)
7. **Responses API silent truncation** — oversized inputs truncated even with truncation disabled; 0.40.13/0.40.14, Bonsai 27B. Issue #19492 (closed): [ollama/ollama#19492](https://github.com/ollama/ollama/issues/19492)
8. **`OLLAMA_NUM_PARALLEL` + multimodal** — `failed processing images` under concurrent llava/moondream requests; likely fixed/closed (#4165): [ollama/ollama#4165](https://github.com/ollama/ollama/issues/4165)
9. **OpenAI compat `/v1/models` returns `data: null`** when no models installed — breaks strict .NET/Java SDKs. Issue #19381 (closed): [ollama/ollama#19381](https://github.com/ollama/ollama/issues/19381)
10. **`ollama pull` TLS handshake timeout** on networks dropping the X25519MLKEM768 ClientHello (post-quantum). Issue #19430: [ollama/ollama#19430](https://github.com/ollama/ollama/issues/19430)

Parser/rendering fixes in flight:
- deepseek3: trailing whitespace after `` leaking into streamed output. PR #19590: [ollama/ollama#19590](https://github.com/ollama/ollama/pull/19590)
- gemma4: unclosed lists in tool-call arguments. PR #19274: [ollama/ollama#19274](https://github.com/ollama/ollama/pull/19274)
- qwen3-coder: nesting-depth tracking for tool-call close tags. PR #17021: [ollama/ollama#17021](https://github.com/ollama/ollama/pull/17021)
- Ornith:35b emitting raw special tokens/unparsed tool XML in OpenAI-compat + Claude Code paths. Issue #16992: [ollama/ollama#16992](https://github.com/ollama/ollama/issues/16992)

## 6. What This Means for Application Developers

- **Pin your version if you depend on GPU offload on AMD/Intel iGPUs.** The 0.40.x Vulkan backends have multiple open load-time crashes (#19558, #19158, #19589) with no fix PRs visible yet. If you were on 0.34.4, that's the last known-good branch for these devices.
- **Long `format`-constrained generations on CUDA 13 are unsafe.** If your agent relies on grammar-constrained JSON output on RTX 40-series with CUDA 13.x, either force the cuda_v12 backend or cap generation length; Xid 79 requires a host reset and kills the runner.
- **Monitor VRAM after model unloads.** The keep_alive termination bug (#19577) silently leaks VRAM until fix #19581 is merged — relevant if you're running multi-model agents and see unexplained scheduler-to-CPU tilts under load.
- **Multimodal + parallel workloads were racy; verify on your version.** #4165 being closed suggests the `failed processing images` concurrent-request bug is resolved — worth retesting your image pipelines if you previously worked around it.
- **Claude Code and other host-integration routing is being tightened.** If you shell out to `ollama launch claude`/`chatgpt` from scripts, expect behavior changes around provider flag scoping (#19587, #19583) that prevent inherited settings from silently rerouting requests — a correctness win, but re-verify your integration tests.
- **Strictly-typed OpenAI SDK consumers should upgrade past the `/v1/models` null fix (#19381).** Untyped consumers were unaffected; .NET/Java clients were failing to deserialize empty model lists.

</details>

<details>
<summary><strong>LiteLLM</strong> — <a href="https://github.com/BerriAI/litellm">BerriAI/litellm</a></summary>

# LiteLLM Digest — 2026-11-07

## 1. Today's Highlights

The 1.108 LTS line is the dominant theme today: a wave of backport PRs from `mateo-berri` lands fixes for Claude tool-search replay, sync Anthropic-style streaming, Mistral Magistral reasoning, Gemini adapter logging, and hosted MCP `tool_choice` handling. Separately, an active correctness bug in Gemini streaming (`stream_chunk_builder` corrupting `thought_signatures` / server-side tool invocation state) remains top-of-mind for agent builders, and a security-adjacent PR strips client-supplied `model_id` from request bodies.

## 2. Releases & Breaking Changes

- **v1.108.2 (LTS)** — latest LTS patch. The `lts` image tag (`ghcr.io/berriai/litellm:lts`) now tracks the newest LTS patch; container users pinning `lts` receive this automatically. Cosign verification is supported via the published key. [Release](https://github.com/BerriAI/litellm/releases)
- **Backport-only policy in effect for 1.108.x** — multiple fixes are landing on `lts/1.108.x` *ahead of* `main` (Claude tool search replay [#50472](https://github.com/BerriAI/litellm/pull/50472), sync Anthropic messages stream [#50471](https://github.com/BerriAI/litellm/pull/50471), Magistral reasoning [#50478](https://github.com/BerriAI/litellm/pull/50478), Gemini adapter logging [#50450](https://github.com/BerriAI/litellm/pull/50450), hosted MCP `tool_choice` + Bedrock batch `drop_params` [#50460](https://github.com/BerriAI/litellm/pull/50460)). Deployment teams on 1.108 should track the LTS branch, not `main`, for these.
- **Config note:** per-key `callback_settings` references by name now supported, avoiding credential duplication across virtual keys; key metadata still rejects `os.environ/` secrets. [#50417](https://github.com/BerriAI/litellm/pull/50417)

## 3. New Model & Hardware Support

- **Foundry Local provider** — new provider integration with SDK 2.3.1 setup. [#47713](https://github.com/BerriAI/litellm/pull/47713)
- **OpenRouter video fields** — first-class `duration`, aspect ratio, reference images, first/last frame, audio, and seed as top-level fields on `/v1/videos` (Seedance, MiniMax). [#50319](https://github.com/BerriAI/litellm/pull/50319)
- **Baseten / CoreWeave Forge catalog syncs** — Kimi K3.1 Pro output limit corrected; DeepSeek V4.1-Flash-1017 added; W&B/CoreWeave Forge prices aligned to the published serverless inference page. [#50477](https://github.com/BerriAI/litellm/pull/50477), [#50476](https://github.com/BerriAI/litellm/pull/50476)
- **Requested but not yet landed:** native Kimi K3 (Moonshot), Inkling (Thinking Machines), and Tinker support was closed on the tracker without an implementation. [#33921](https://github.com/BerriAI/litellm/issues/33921)

## 4. Performance & Optimization

- **Redis circuit breaker consolidation** — a single native circuit breaker is now shared between `RedisCache` and the Rust stores, fixing a 5s socket-timeout stall on `/key/<key>/reset_spend` when Redis is wedged, and stabilizing coordinated failover tests. [#50473](https://github.com/BerriAI/litellm/pull/50473)
- **SAP GenAI Hub overhead (open)** — every `acompletion()` on a `sap/` model still performs 2 blocking AICORE management API GETs (~870ms measured under load). No fix PR yet. [#47096](https://github.com/BerriAI/litellm/issues/47096)
- **Embedding token counting** — router no longer falls through the Responses input transformer for `list[str]` embedding inputs, which previously raised `AttributeError` and skipped context-window checks. [#35626](https://github.com/BerriAI/litellm/issues/35626)

## 5. Stability & Regressions

Ranked by severity for agent workloads:

1. **Gemini streaming tool context corruption (high, agent-breaking).** `stream_chunk_builder` corrupts `server_side_tool_invocations` and `thought_signatures` when streaming with web search + tools, producing `400 "Corrupted tool call context"` on follow-up turns. Affects multi-turn agents on Gemini. [#25869](https://github.com/BerriAI/litellm/issues/25869)
2. **JSON-defined OpenAI-compatible providers silently drop tools (high).** On 1.106, a model not in the catalog (`nano-gpt/z-ai/glm-5.3-flash`) loses tools unless declared as `openai` with an explicit endpoint. Regression vs. 1.81. [#48145](https://github.com/BerriAI/litellm/issues/48145)
3. **Gemini cache_control reorders conversation (high, correctness).** Vertex/Gemini context caching moves a non-prefix `cache_control` message ahead of history and drops the system prompt when `modify_params` is set — the model then answers the prior turn. [#47046](https://github.com/BerriAI/litellm/issues/47046)
4. **OpenRouter streaming emits an empty post-finish choice (medium).** In v1.108.0, with streaming usage enabled, a provider accounting trailer becomes an extra empty assistant choice before the real usage chunk. Strict clients may misparse. [#50156](https://github.com/BerriAI/litellm/issues/50156)
5. **Anthropic server_tool_use mis-surfaced as pending `tool_call` (medium).** Web-search blocks on `/v1/chat/completions` come back as tool calls with `finish_reason: "stop"`, causing agent clients to loop. [#48384](https://github.com/BerriAI/litellm/issues/48384)
6. **Budget reservation over-sizing on `/v1/messages` (medium).** Anthropic-format `tool_choice` triggers a `max_input_tokens` reservation (token-counter KeyError path), over-reserving budget. [#47396](https://github.com/BerriAI/litellm/issues/47396)
7. **`reasoning_effort: "none"` no-ops on default-thinking Claude models (medium).** Thinking config is removed rather than explicitly disabled, so the upstream default stays on. [#47924](https://github.com/BerriAI/litellm/issues/47924)
8. **Bedrock reasoning replay to non-Anthropic models (medium).** `reasoningText.signature` is replayed when an auto-router switches Claude → GLM on Bedrock, causing Bad Request. [#49969](https://github.com/BerriAI/litellm/issues/49969)
9. **Gemini/Vertex streaming drops trailing tool calls (medium).** `_build_vertex_schema` leaves schemaless `type="object"` children intact, and mid-stream `MALFORMED_FUNCTION_CALL` loses `native_finish_reason`; Claude Code tools after markdown blocks are silently dropped. [#47577](https://github.com/BerriAI/litellm/issues/47577)
10. **`httpx.Timeout` connect timeout ignored (low-medium).** Non-OpenAI/Azure/Bedrock providers collapse `connect=` into a single value due to a narrow `supports_httpx_timeout()` allowlist. [#47822](https://github.com/BerriAI/litellm/issues/47822)
11. **Transcription `response_format=json` pydantic failure (low-medium)** on both SDK and proxy. [#33764](https://github.com/BerriAI/litellm/issues/33764)
12. **Proxy double-logs `image_generation` (low).** Two callback events per `/v1/images/generations` call on the proxy; SDK logs once. [#29638](https://github.com/BerriAI/litellm/issues/29638)
13. **`COHERE_API_BASE` ignored for cohere embeddings (low)** though rerank honors it. [#50248](https://github.com/BerriAI/litellm/issues/50248)
14. **Vertex TTS ignores `vertex_location` (low).** Chirp 3 HD requests always hit the global host unless `api_base` is a full URL. [#50219](https://github.com/BerriAI/litellm/issues/50219)

Fix-PR presence: items 1–14 have no linked fix PRs as of this update; several are tagged `stale`.

**Security-relevant:** `OPENAI_ADMIN_KEY` from the proxy environment is no longer used as a bearer token for a deployment with an empty `api_key` when `openai 3.x` is installed — previously the admin key could be sent to an arbitrary `api_base`. [#50218](https://github.com/BerriAI/litellm/pull/50218, closed). Client-supplied `model_id` is now stripped from Bedrock request bodies to prevent deployment substitution. [#49907](https://github.com/BerriAI/litellm/pull/49907)

## 6. What This Means for Application Developers

- **Pin to the LTS image.** The `ghcr.io/berriai/litellm:lts` tag is the supported path; several correctness fixes for Claude, Mistral, Gemini, and MCP are arriving on `lts/1.108.x` ahead of `main`. If you're on `main`, expect divergence.
- **Agent builders on Gemini should test multi-turn tool flows carefully.** The `thought_signatures` / server-side tool corruption and the cache_control reordering issues can cause silent turn-level failures in long agent loops. Prefer non-streaming or gate on a specific model version until fixed.
- **Catalog registration matters more than provider naming.** If you use JSON-defined OpenAI-compatible gateways, explicitly declare the provider as `openai` with a concrete `api_base` — otherwise tool definitions may be dropped without error.
- **Anthropic-compatible paths still have edge cases.** `reasoning_effort: "none"` doesn't disable thinking on default-on Claude models, and server-side web search is surfaced as a pending tool call. Clients that branch on `tool_calls` should also check for a terminating `finish_reason: "stop"` before looping.
- **Budget/observability hygiene:** if you use `/v1/messages` with Anthropic `tool_choice`, expect over-sized budget reservations; if you use the proxy's image generation, expect duplicate Langfuse generations.
- **Per-key callback settings** now let you point virtual keys at a named `callback_settings` definition — useful for multi-tenant Arize/Langfuse deployments without proliferating credentials.

</details>

<details>
<summary><strong>Unsloth</strong> — <a href="https://github.com/unslothai/unsloth">unslothai/unsloth</a></summary>

# Unsloth Digest — 2026-11-07

## 1. Today's Highlights

Unsloth shipped **v0.1.916-beta**, headlined by "Large Performance Fixes" targeting long-chat typing/search latency, image/video load times, and two-GPU image/video generation, plus new per-chat browsers and a floating browser window. In parallel, the team landed a stream of Studio/Desktop PRs addressing WebKit restyle freezes, chat-template reasoning loss for `gemma-4-thinking`, and idle-unload reload fidelity for GGUF models. Issue volume remains high (39 updated), with a cluster of Windows/desktop stability and RAG-ingestion performance complaints still open.

---

## 2. Releases & Breaking Changes

- **v0.1.916-beta — "Large Performance Fixes"**
  Faster typing and search in long chats, faster image/video loads, two-GPU image/video generation, separate browser per chat, floating browser window, and additional Glass theme optimizations.
  https://github.com/unslothai/unsloth/releases

- **transformers 5.23 API rename (checkpointing)** — `gradient_checkpointing` → `activation_checkpointing`; the Trainer now reads only the new names, changing behavior in ~4 call sites in Unsloth. Old names remain as aliases until v6.
  https://github.com/unslothai/unsloth/issues/16667

- **MCP SDK 2.3.0 incompatibility** — Blender MCP fails to start in v0.1.915-beta with FastMCP 4.1.6; environment-wide breakage for MCP users on that release.
  https://github.com/unslothai/unsloth/issues/16878

---

## 3. New Model & Hardware Support

- **Cosmos3 Edge / Nano generation settings** — Studio Video page now accepts NVIDIA's documented 256p resolution and frame ranges, with a per-model frame-rate picker.
  https://github.com/unslothai/unsloth/pull/16737

- **Cosmos3-Nano video continuation** — Extend a clip from its last or first frames (5-frame carryover), new third workflow on the Video page. Stacked on #16737.
  https://github.com/unslothai/unsloth/pull/16741

- **Cosmos3-Nano-Sim-Transfer "Restyle" mode** — Canny-edge video restyling through `sd-server`; per-frame progress and playback.
  https://github.com/unslothai/unsloth/pull/16975

- **Claude Agent connection (experimental)** — Uses local `claude` CLI login (Claude Pro/Max without API key) via Anthropic's Agent SDK bundled with Studio (~1 MB, no CLI payload).
  https://github.com/unslothai/unsloth/pull/16963

- **Mic → audio-input models** — New dictation setting routes composer mic audio straight to any audio-input model instead of ASR transcription.
  https://github.com/unslothai/unsloth/pull/16976

---

## 4. Performance & Optimization

- **Long-chat UI lag regression fixed** — Closes #16603; long conversations no longer lag on web + desktop. CI gate allowances tightened post `:has()` rewrite (#16938/#16942/#16957) to prevent cost creep.
  https://github.com/unslothai/unsloth/pull/16978

- **WebKit dialog/menu freezes eliminated** — Closing dialogs/menus on long chats took 5–7 s on macOS/Linux WebKitGTK; browser pane open took >20 s on Linux. Cause was full-page restyle on dialog/menu/browser-pane open/close; Chromium unaffected.
  https://github.com/unslothai/unsloth/pull/16961

- **Diffusion heap return to OS** — Finished image loads now `malloc_trim`-style release the freed arena back to the OS; previously staging copies below glibc's mmap threshold stayed counted as used host RAM for the model's lifetime.
  https://github.com/unslothai/unsloth/pull/16934

- **Reduce-motion light/dark flip** — On Windows, a theme flip took ~2.5 s with Reduce motion On vs ~230 ms Off; fix avoids per-element transitions.
  https://github.com/unslothai/unsloth/pull/16977

- **RAG ingestion batch-of-1 penalty (open)** — `_embed_all` called per document; ~99 ms/chunk batch-of-1 vs 2.07 ms batched, ~48× slowdown on small-file corpora.
  https://github.com/unslothai/unsloth/issues/16715

- **Benchmarks page (open, draft)** — Sweeps speculative decoding (MTP/ngram/DSpark/DFlash), KV cache type, context length, parallel slots, and RAM offload on the loaded GGUF; plus `llama-bench` and lm-eval-harness tabs.
  https://github.com/unslothai/unsloth/pull/11808 · https://github.com/unslothai/unsloth/pull/12522 · https://github.com/unslothai/unsloth/pull/12521

---

## 5. Stability & Regressions

Ranked by severity:

1. **[CRITICAL] Windows crash loading Krea 2 Turbo** — Studio backend `0xc0000005` access violation during model load in Image Generation. Reproducible. Open.
   https://github.com/unslothai/unsloth/issues/16892

2. **[HIGH] Multi-GPU DiffusionGemma abort** — Prompts >~1792 tokens on 2× CUDA (RTX 3060 + 4060 Ti) abort the visual server with `GGML_ASSERT n_ubatch >= n_tokens`. Open.
   https://github.com/unslothai/unsloth/issues/16925

3. **[HIGH] Image generation falls back to CPU/RAM on Windows 11 + RTX 3060** — Text generation correctly uses GPU on the same machine; not reproducible on M1 Pro. Open.
   https://github.com/unslothai/unsloth/issues/16803

4. **[HIGH] `gemma-4-thinking` chat template strips reasoning** — Closed; reasoning output lost.
   https://github.com/unslothai/unsloth/issues/16699

5. **[MEDIUM] Beta update fails to complete** — Desktop auto-update path broken. Open.
   https://github.com/unslothai/unsloth/issues/16897

6. **[MEDIUM] `search_conversation` tool disappears (3rd recurrence)** — Open; recurring regression.
   https://github.com/unslothai/unsloth/issues/16706

7. **[MEDIUM] Studio web_search always returns "No results found"** — ddgs request lacks `Accept` header (DuckDuckGo 202); Yandex missing from engine allow-list. Open.
   https://github.com/unslothai/unsloth/issues/16664

8. **[MEDIUM] Regression: long conversations cause UI lag** — Closed by v0.1.916-beta.
   https://github.com/unslothai/unsloth/issues/16603

9. **[LOW] Studio crash on Windows 11 / RTX 4060 Ti** — Reported against v0.1.915-beta. Closed.
   https://github.com/unslothai/unsloth/issues/16816

Also fixed today: RAG embedding-download indexing failure (#16714), public-cursor invalidation on Multi-LoRA batch (#16719), S3 audio JSONL Unicode separator abort (#16721), CLI partial-stream false success (#16867), Glass theme inconsistencies (#16770, #16820), background wallpaper CSS conflict (#16736).

---

## 6. What This Means for Application Developers

- **Upgrade to v0.1.916-beta** if you serve long conversations or image/video workloads — the long-chat and load-time fixes directly affect perceived latency, and the WebKit freeze (5–7 s dialog, 20 s browser pane) is a hard UX blocker on macOS/Linux desktop builds.
- **Pin `transformers` to <5.23** or audit your checkpointing call sites; the rename silently changes Trainer behavior, not just names.
- **Avoid MCP workloads on v0.1.915-beta** — SDK 2.3.0 breaks Blender MCP startup; hold unless you can pin FastMCP.
- **Windows GPU users: verify device placement** before deploying image generation — issue #16803 shows text and image paths can diverge (GPU vs CPU/RAM) on identical hardware.
- **RAG builders**: budget for the batch-of-1 embedding path (~48× slower than batched) until #16715 lands; consider pre-batching corpora outside Studio.
- **Agent/CLI consumers**: the idle-unload fix (#16927) preserves original launch settings (context, KV cache dtype) on reload — previously these silently reverted to defaults, which could corrupt long-running agent state.
- **Watch the Benchmarks page PRs** (#11808/#12522/#12521) — speculative decoding and KV-cache sweeps will give you empirical tuning data for the exact GGUF you serve, rather than generic guidance.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*