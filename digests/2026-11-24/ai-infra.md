# AI Infrastructure Digest 2026-11-24

> Generated: 2026-11-24 05:16 UTC | Projects covered: 6

- [vLLM](https://github.com/vllm-project/vllm)
- [SGLang](https://github.com/sgl-project/sglang)
- [llama.cpp](https://github.com/ggml-org/llama.cpp)
- [Ollama](https://github.com/ollama/ollama)
- [LiteLLM](https://github.com/BerriAI/litellm)
- [Unsloth](https://github.com/unslothai/unsloth)

---

## Cross-Project Comparison

# Cross-Project Comparison Report — AI Infrastructure Ecosystem
**Digest date: 2026-11-24**

---

## 1. Ecosystem Overview

Today's activity shows the ecosystem in a **hardening-and-migration phase** rather than a feature-expansion phase. The two high-throughput serving engines (vLLM, SGLang) are both preparing breaking transitions — vLLM toward a Rust frontend default and the Marlin→Humming kernel swap, SGLang toward a 1.0 release that replaces silent config coercion with hard errors. Meanwhile, local runtimes (llama.cpp, Ollama, Unsloth) are converging on the same new model family — **Inkling 2 / Inkling-2-Mini** — with mixed results: correctness and memory regressions dominate their bug queues. LiteLLM is quietly rewriting its spend-log/auth pipeline in Rust, signaling gateways are maturing into performance-sensitive infrastructure. Across all six projects, no major versioned releases landed in the 24h window; the dominant risk theme is **silent correctness failures** (sampling truncation on MI300X, NaN outputs on V100S, inverted cache eviction) rather than crashes.

---

## 2. Activity Comparison

| Project | Open Issues (notable/day) | PRs (active/day) | Release status | Breaking change in flight |
|---|---|---|---|---|
| **vLLM** | ~12 ranked + hang/correctness cluster | ~8–10 | None (v0.34.0 prior) | LM Format Enforcer removal; Rust frontend default |
| **SGLang** | ~9 ranked + CI health (5 broken/23 flaky) | ~12–15 (HW-heavy) | None (pre-1.0 freeze) | 1.0 hard-error config policy |
| **llama.cpp** | ~13 ranked | ~15+ (rolling master) | Rolling `master` (b12669) | Shell tool `description` required; RPC protocol |
| **Ollama** | ~10 ranked | ~8 | **v0.40.18-rc0** | JetPack 5 removed |
| **LiteLLM** | ~7 open + 3 closed fixes | ~10 (Rust stack) | **v1.110.3 / 1.109.4 / 1.108.16** | Keyless-only cosign since v1.108.10 |
| **Unsloth** | ~8 ranked | ~12 (many fix PRs) | **v0.1.923-beta** | transformers ≤5.18; FastFlowLM pin |

**Reading:** llama.cpp and Unsloth have the highest raw PR velocity (fix-heavy); vLLM/SGLang have fewer but higher-consequence PRs (kernel/frontend rewrites). Ollama is the only project shipping an RC with an acknowledged regression cluster. LiteLLM is the only project with three patch releases in the window.

---

## 3. Model Support Race

**Inkling 2 is the unifying model story of the day** — and the race is fragmented:

| Model / Architecture | vLLM | SGLang | llama.cpp | Ollama | Unsloth |
|---|---|---|---|---|---|
| **Inkling 2 / Mini** | — | speculative decode (Xeon, PR #52698) | ✅ Metal indexed-bias FA (#32808); query chunking | ✅ **GGUF enabled** (b12653, #19861) | ✅ **1.9x decode claim** (but regressed on Win11) |
| **DeepSeek-V4-Pro / V4.1-Flash** | MTP hang unresolved; mem regression closed | — | — | — | — |
| **Qwen3.8-Flash-Next / Qwen3.6** | MI355X tracker; PLE/sparse-LM-head RFCs | — | — | — | Qwen-Image-Flash in v0.1.923 |
| **GLM-5.x / GLM-4.7-Flash** | GlmMoeDsa sparse MLA gap | XPU int4 AutoRound | — | — | — |
| **Qwen-Image 2.1 / MiniMax-H3** | — | ✅ progressive resolution wired (#52745) | — | — | FastWan, Qwen-Image-Flash |
| **OmniASR / ASR** | request only (#28509) | — | — | — | audio translation |

**Leader:** **Ollama + Unsloth** shipped Inkling 2 support fastest (Ollama via llama.cpp bump, Unsloth via beta), while **vLLM and SGLang are behind** on Inkling but ahead on sparse-attention/MoE architectures (DeepSeek-V4, GLM-5.x). llama.cpp provides the substrate everyone else builds on. **Hardware support is the real race:** SGLang leads on non-NVIDIA (Intel AMX, XPU quant, ROCm gfx950 TLX), while vLLM leads on concurrent GPU-generational coverage (SM90/SM100 FlashTopK, CPU UltraQuant).

---

## 4. Performance Frontier

Optimization effort is concentrated in five clusters, with notable cross-project convergence:

- **KV cache & memory reclamation:** vLLM CPU UltraQuant 4-bit KV (#61168), KV-offload re-queue stall RFC (#62532); SGLang SWA row retirement (#52714); Ollama MLX prefix-cache OOM (#18131); Unsloth prompt-cache double-count fix (#19159). *KV is the universal bottleneck.*
- **Batching / graph reuse:** vLLM Humming MoE host-overhead cut (#69504, targets eager regime); llama.cpp per-size CUDA graphs for batches ≤8 (#31156); SGLang MiniMax-H3 graph segmentation (#52522) and scheduler GC freeze (#51988).
- **Quantization kernels:** vLLM Marlin→Humming migration; llama.cpp Pareto quant-type auto-selection (#15550) + NVFP4 dequant (V100 prompt-processing); SGLang SM107 MXFP8 batch-invariant dense path (#52696).
- **Distributed serving:** SGLang PD-disaggregation Q4 roadmap (#43699) and DSA K-only short prefill with PCP (#49161) is the most concentrated distributed effort; vLLM TP hang is the counterpoint (fix absent).
- **Kernel-level correctness/perf:** llama.cpp Vulkan SSM_SCAN (#32916), SYCL FA register-file fix (#31748), Vulkan INT8 MMQ prefetch (#32919); Unsloth Krea 2 INT8 attention (+5–8%).

**Where the frontier is hardest:** the **eager/small-batch regime** (vLLM Humming, llama.cpp spec-verify graphs) and **non-NVIDIA portability** (SGLang XPU/ROCm, llama.cpp SYCL/Vulkan/Hexagon). NVIDIA-side dense prefill is largely a solved problem; the open problems are correctness under quantization and multi-stream execution.

---

## 5. Layer Positioning

| Layer | Project(s) | Core value | Today's signal |
|---|---|---|---|
| **Distributed serving engine** | vLLM, SGLang | Max throughput, multi-GPU, advanced attention | Both mid-major-transition; stability debt visible |
| **Local runtime / edge** | llama.cpp, Ollama | Broadest hardware, simplicity, offline | Highest PR velocity; regressions bite end-users |
| **Training / fine-tuning** | Unsloth | QLoRA/GRPO efficiency, low-VRAM | MoE tensor-parallel QLoRA on 2× T4 is a real unlock |
| **LLM gateway / control plane** | LiteLLM | Auth, budgets, routing, observability | Rewriting spend pipeline in Rust — becoming perf-critical |
| **Quantization/format substrate** | llama.cpp (GGUF), vLLM (UltraQuant), Unsloth | Shared artifact formats | Format fragmentation persists (GGUF vs. safetensors/UltraQuant) |

**Key structural observation:** the boundary between *serving engine* and *gateway* is being renegotiated. vLLM's forwarded prompt-token-IDs RFC (#65502) + Rust renderer implies gateways will soon tokenize once and hand tokens to workers — directly overlapping LiteLLM's domain. Simultaneously LiteLLM is moving into performance territory (Rust spend-log) traditionally reserved for engines. Expect gateway/engine interface contracts to formalize in H1 2027.

---

## 6. Trend Signals

**1. Rust is displacing Python in the hot path.** vLLM's Rust frontend default rollout (#68784) and LiteLLM's Rust spend-log/auth stack (#53706→#53748) are independent decisions in the same direction. Control-plane and request-path components are being rewritten for latency and safety. *Watch:* whether SGLang follows; whether these Rust components define new gateway/engine interfaces.

**2. Distributed correctness, not throughput, is the current ceiling.** The most severe open issues are silent-wrong or hang-class: SGLang unbounded `max_new_tokens` DoS (#51835), inverted priority eviction (#52423); llama.cpp MI300X `SOFT_MAX` dropping partials (#32852); Unsloth V100S NaN (#19013); vLLM TP hang (#41530, 22 comments, no fix). *Watch:* any of these becoming the reason a production deployment pins an old version.

**3. Config behavior is hardening everywhere.** SGLang 1.0 ends silent coercion; llama.cpp requires shell-tool `description`; LiteLLM moves to keyless cosign; vLLM removes a structured-output backend. The era of "invalid flag silently works" is ending. *Action for developers:* run launch scripts against `main` before upgrading; expect loud failures.

**4. Prefix caching has become a first-class economic concern.** Multiple projects converge here: vLLM APC-collapse report (#63741, 206.9s TTFT), SGLang priority eviction bug (#52423), Unsloth prompt-cache misses (#19212), Ollama hard-coded 8 GiB MLX prefix budget (#18131). *Watch for agents:* context compaction and skill-append patterns are quietly destroying cache hit rates and inflating cost.

**5. Tool-calling reliability is a live availability risk across the stack.** vLLM Inkling parser stalls `/health` (#69267); llama.cpp Qwen3-Coder false `tool_call` triggers (#32853); Ollama drops content when no tools declared (#19854); Unsloth custom templates wiped on preset (#19154). *Watch:* whether a cross-project tool-calling conformance suite emerges.

**6. Non-NVIDIA hardware is where roadmap energy is flowing.** SGLang XPU/ROCm/AMX enablement, llama.cpp Vulkan/SYCL/Hexagon/WebGPU, Unsloth AMD mixed-VRAM gap (unfixed). *Watch:* whether vLLM matches SGLang's non-NVIDIA cadence — currently SGLang is ahead.

### Recommended developer actions this week
- **Pin versions** on Ollama (avoid 0.40.17) and Unsloth (avoid v0.1.923-beta for Inkling 2 Mini GPU inference).
- **Enforce request bounds** at your gateway for SGLang (`max_new_tokens`, `n`) until #51835 is fixed.
- **Update cosign verification** if you deploy LiteLLM from v1.108.10+.
- **Re-audit structured-output configs** for vLLM (`lm-format-enforcer` removal in flight).
- **Avoid `--backend-sampling` on HIP/MI300X** until llama.cpp #32852 is resolved.
- **Track the Rust frontend/gateway interfaces** (vLLM #68784, #65502) — they will likely define your next integration contract.

---

## Per-Project Reports

<details>
<summary><strong>vLLM</strong> — <a href="https://github.com/vllm-project/vllm">vllm-project/vllm</a></summary>

# vLLM Digest — 2026-11-24

## 1. Today's Highlights

No releases landed in the last 24h, but the project's direction is unusually legible from today's issue/PR traffic: two large transitions are converging — the **Rust frontend becoming the default `vllm serve` path** ([#68784](https://github.com/vllm-project/vllm/issues/68784)) and the **Marlin → Humming quantization kernel migration** ([#65560](https://github.com/vllm-project/vllm/issues/65560), with perf work in [#69504](https://github.com/vllm-project/vllm/pull/69504)). On the stability side, several high-severity correctness/hang reports remain open with no fix PRs, notably an 8-way TP hang on DeepSeek-V4-Pro MTP speculative decoding ([#41530](https://github.com/vllm-project/vllm/issues/41530)) and a tool-parser streaming stall that can take down `/health` ([#69267](https://github.com/vllm-project/vllm/issues/69267)).

## 2. Releases & Breaking Changes

**No new releases (last 24h).** However, scheduled deprecations landed as PRs today:

- **LM Format Enforcer structured-outputs backend removed** — deprecated in v0.33.0, scheduled for v0.35.0, landing now that v0.34.0 shipped. `StructuredOutputsConfig.backend` will drop `lm-format-enforcer` as an accepted value. If you pass this explicitly, migrate to the default guidance/outlines backends. [PR #69564](https://github.com/vllm-project/vllm/pull/69564)
- **Rust frontend default rollout (tracking)** — not yet flipped, but `vllm serve` will default to the Rust frontend "in the near future" for supported configurations. Watch this issue if your deployment relies on Python-frontend-only behavior. [Issue #68784](https://github.com/vllm-project/vllm/issues/68784)
- **Compile cache key cleanup** — six host-only config fields (`renderer_num_workers`, etc.) currently leak into `VllmConfig.compile_factors()`, invalidating compiled artifacts and FlashInfer tactic cache directories on unrelated config changes. Fix PR is open; until merged, expect spurious recompiles when touching these fields. [PR #69475](https://github.com/vllm-project/vllm/pull/69475)
- Rust frontend checkpoint JSON parsing now matches Python's `json` behavior for bare `NaN`/`Infinity`/`-Infinity` — relevant if you serve models with non-strict JSON configs. [PR #69566](https://github.com/vllm-project/vllm/pull/69566)

## 3. New Model & Hardware Support

- **SM90/SM100 fused MQA + top-k prefill backend (FlashTopK)** — opt-in alternative to the native sparse-indexer prefill kernel, vendored in `vllm/third_party/flashtopk/`. Default remains `native`. Relevant for sparse-attention models (DeepSeek-V4, GLM-5.x, Qwen3.8-Flash series). [PR #67149](https://github.com/vllm-project/vllm/pull/67149)
- **CPU UltraQuant 4-bit KV cache** — completes the format work started on GPU (#57057); the same 4-bit KV cache now runs on Zen/x86, enabling long-context CPU serving. [PR #61168](https://github.com/vllm-project/vllm/pull/61168)
- **OmniLingual ASR (Meta)** — feature request for the 1,600+ language ASR model; no implementation yet. [Issue #28509](https://github.com/vllm-project/vllm/issues/28509)
- **Model retirement tracking** — native Llama and Qwen2-derived model classes are being burned down in favor of the Transformers modeling backend. If you subclass or patch `vllm/model_executor/models/llama.py`, plan for migration. [Issue #67937](https://github.com/vllm-project/vllm/issues/67937)

## 4. Performance & Optimization

- **Humming MoE host-overhead reduction** — outside CUDA graphs, Humming's MoE layer spends ~470 µs host time per ~255 µs of A100 GPU work, trailing Marlin TTFT by up to 24%. This PR cuts that host overhead, directly targeting the small-batch / eager-mode regime. [PR #69504](https://github.com/vllm-project/vllm/pull/69504)
- **KV offload re-queueing stall (1.0–1.8s)** — RFC to eliminate the stall for completed async KV pulls via front-of-queue re-admission. Affects `OffloadingConnector` with `TieringOffloadingSpec` and NIXL/remote KV connectors. [Issue #62532](https://github.com/vllm-project/vllm/issues/62532)
- **MI355X / gfx950 Qwen3.8-Flash-Next optimization tracker** — active plan covering GatedDeltaNet (36 layers), QuerySparse Attention (12 layers), HyperConnection gated residual, and MXFP4 MoE for `amd/Qwen3.8-Flash-Next-Quark-MXFP4`. [Issue #59575](https://github.com/vllm-project/vllm/issues/59575)
- **Prefix caching for Rust frontend / render API** — RFC on forwarding trusted prompt token IDs from gateways through chat/Messages/Responses routes, so prefix-cache-aware routers don't force re-tokenization at the worker. [Issue #65502](https://github.com/vllm-project/vllm/issues/65502)
- **Context compaction vs. APC collapse** — production report: agent context compaction (~81k ctx) caused TTFT stall at 206.9s and destroyed automatic prefix caching hit rates. Worth reading if you run long-horizon agents. [Issue #63741](https://github.com/vllm-project/vllm/issues/63741)

## 5. Stability & Regressions

Ranked by severity:

- **🔴 TP Worker hang → `EngineDeadError`** — DeepSeek-V4-Pro, TP=8, MTP speculative decoding; RPC to `sample_tokens` times out. Open since May, 22 comments, 8 👍, **no fix PR visible**. [Issue #41530](https://github.com/vllm-project/vllm/issues/41530)
- **🔴 Tool parser kills `/health`** — Inkling parser re-parses the entire argument on every streamed delta; long tool calls stall the API server and health endpoint. Affects `thinkingmachines/Inkling-2-Small` on B300. [Issue #69267](https://github.com/vllm-project/vllm/issues/69267)
- **🔴 Memory regression on DeepSeek-V4.1-Flash** — resident weight memory rose ~47 GiB → ~60 GiB per GPU between 11.12 and 11.18 nightlies on H100. **Closed** — regression acknowledged and resolved between nightlies. [Issue #68647](https://github.com/vllm-project/vllm/issues/68647)
- **🟠 Sparse MLA decode-LSE unsupported** — DC unavailable for `GlmMoeDsa` (GLM-5.2 FP8) on SM90. [Issue #53134](https://github.com/vllm-project/vllm/issues/53134)
- **🟠 CUDA graph capture illegal memory access (Xid 31)** — Qwen3.6-27B-FP8 + LoRA on RTX PRO 6000 Blackwell (SM120) under CUDA MPS, v0.33.0. [Issue #67488](https://github.com/vllm-project/vllm/issues/67488)
- **🟠 CPU KV offload Xid 31 on NVIDIA vGPU** — `cuMemcpyBatchAsync` faults even with a single valid descriptor. [Issue #61052](https://github.com/vllm-project/vllm/issues/61052)
- **🟠 TPU `UnexpectedTracerError`** — Gemma4 suppression-token cache re-tracing on TPU v5e. [Issue #66525](https://github.com/vllm-project/vllm/issues/66525)
- **🟡 XPU DFlash2 0% acceptance** — `--dtype float16` broken on XPU; bf16 works. Qwen3.8-27B. [Issue #55250](https://github.com/vllm-project/vllm/issues/55250)
- **🟡 Speculative draft model can't load mixed-precision compressed-tensors** — `SpeculativeConfig(method="draft_model")` with `config_groups`. [Issue #49893](https://github.com/vllm-project/vllm/issues/49893)
- **🟡 Transformers backend OmniASR startup failure** — `padding_mask` kept on CPU but forwarded to `get_audio_features`. [Issue #69320](https://github.com/vllm-project/vllm/issues/69320)
- **🟡 Qwen2 INT4 KV-cache corruption** — key-bias scores lost in `int4_per_token_head` path; fix PR open with GB10 validation. [PR #59674](https://github.com/vllm-project/vllm/pull/59674)
- **🟡 Watchdog stack dump truncated at 100 threads** — `faulthandler.dump_traceback` limitation affects large multi-worker deployments. Closed. [Issue #68833](https://github.com/vllm-project/vllm/issues/68833)

## 6. What This Means for Application Developers

- **Audit your structured-output config now.** If you set `StructuredOutputsConfig.backend = "lm-format-enforcer"`, the removal PR is in flight. Switch to the default backend before the next upgrade.
- **Tool-calling over streaming is a live availability risk.** The Inkling parser stall (#69267) impacts `/health`, which means your orchestrator's liveness probe can flap during long tool calls. Until fixed, add request timeouts and consider disabling streaming on tool-heavy routes for that model family.
- **Agent context compaction is quietly expensive.** If your agents summarize/compact long contexts, expect APC hit rates to collapse and TTFT to spike (#63741). Options today: pin stable system prefixes outside the compacted region, or budget for cold prefill on compaction boundaries.
- **Speculative decoding + large N-gram embedding models is getting dedicated infrastructure.** The PLE Connector RFC (#67922) and sparse LM head tracker (#67220) target exactly the Qwen3.8-Flash-Next / Qwen4-Max shape (51B–328B embedding params). If you serve these, watch those threads.
- **Gateway-side tokenization is becoming first-class.** The forwarded prompt token IDs RFC (#65502) plus the Rust renderer mean a gateway or LLM router will soon be able to render/tokenize once and hand tokens to vLLM without re-processing — significant win for prefix-cache-aware routing. If you run an LLM gateway, plan to adopt this interface when it lands.
- **Rust frontend migration is coming for `vllm serve`.** No action required yet, but if you patch Python frontend internals (custom middleware, monkey-patches on `openai/api_server.py`), start tracking #68784 — those patches will not survive the default flip.

</details>

<details>
<summary><strong>SGLang</strong> — <a href="https://github.com/sgl-project/sglang">sgl-project/sglang</a></summary>

# SGLang Digest — 2026-11-24

## 1. Today's Highlights

No releases landed in the last 24 hours, but roadmap activity is heavy: the **PD Disaggregation Q4 roadmap (#43699)** and the **SGLang 1.0 stability tracker (#50045)** are both active, signaling a hardening phase ahead of 1.0. On the bug front, a cluster of scheduler/cache correctness issues surfaced — priority eviction inverting its own policy (#52423), unbounded `max_new_tokens`/`n` enabling scheduler monopolization (#51835), and a `RwLock` starvation bug in `sgl-kv-indexer` (#52575). Meanwhile, the PR queue is dense with ROCm/XPU/CPU hardware enablement and MoE/attention correctness fixes.

## 2. Releases & Breaking Changes

No new releases in the last 24h. However, the **SGLang 1.0 Release Tracker (#50045)** explicitly warns that upgrading from 0.5.x may require changes: the release replaces silent configuration coercion with hard errors that name the offending setting, and defines a compatibility policy for the 1.x series. Teams pinned to 0.5.x should begin reading the upgrade notes now.

- https://github.com/sgl-project/sglang/issues/50045

Related: **#52483** reports `--max-running-requests 0` or negative values are *silently clamped to 1* — precisely the class of silent behavior 1.0 intends to eliminate.

- https://github.com/sgl-project/sglang/issues/52483

## 3. New Model & Hardware Support

- **Intel Xeon CPU (AMX/AVX-512) + speculative decoding for Inkling-2-Mini** — PR #52698, stacked on #51926. Adds Intel AMX runtime support and optimized low-bit paths.
  - https://github.com/sgl-project/sglang/pull/52698
- **AMD ROCm / gfx950 TLX kernel backend** — PR #52743 moves vendored TLX kernels into proper operator groups and registers them under a dedicated `KernelBackend`; follow-up #52744 handles the chore split. Companion fix #51998 accepts `llvm_cl_opts` on ROCm Triton 3.8.
  - https://github.com/sgl-project/sglang/pull/52743
  - https://github.com/sgl-project/sglang/pull/51998
- **Intel XPU quantization** — PR #49862 enables serving of `GLM-4.7-Flash-int4-AutoRound`, `Ling-3.0-flash-VL-fp4`, and `Ling-2.6/3.0-flash-fp8` on XPU.
  - https://github.com/sgl-project/sglang/pull/49862
- **NVIDIA SM107 MXFP8 dense path** — PR #52696 makes the MXFP8 dense path batch-invariant using FlashInfer's batch-invariant quantizer and GEMM.
  - https://github.com/sgl-project/sglang/pull/52696
- **XPU FMHA kernels** — PR #46511 adds XPU API support for `fused_inplaced_qk_norm` and `fused_qknorm_rope_out_of_place`.
  - https://github.com/sgl-project/sglang/pull/46511
- **Qwen-Image 2.1 progressive resolution** — PR #52745 wires `--progressive-mode`/`--progressive-levels`/`--progressive-delta` into the Qwen-Image 2.1 pipeline (previously silently ignored).
  - https://github.com/sgl-project/sglang/pull/52745

## 4. Performance & Optimization

- **Scheduler GC freeze under sustained load** — PR #51988 extends `GCFreezer` (#50883) to freeze the scheduler heap every N batches on a busy PD prefill scheduler, which previously was never idle and thus never frozen, paying full gen-2 GC cost.
  - https://github.com/sgl-project/sglang/pull/51988
- **SWA row retirement on prefill completion** — PR #52714 retires out-of-window sliding-window-attention rows as soon as a prefill finishes, instead of waiting for the second decode step. Directly reduces memory held by fresh long-prefill requests.
  - https://github.com/sgl-project/sglang/pull/52714
- **DSA K-only short prefill with PCP** — PR #49161 re-enables the indexer-logits skip for short prefills when prefill context parallelism is configured.
  - https://github.com/sgl-project/sglang/pull/49161
- **MiniMax-H3 diffusion CUDA graph segmentation** — PR #52522 reduces breakable-CUDA-graph fragmentation (currently ~53 segments per denoising step for a 50-layer H3-Image) and eliminates per-step `cu_seqlens` rebuilds and host `.item()` syncs.
  - https://github.com/sgl-project/sglang/pull/52522
- **MFU/MBU estimator correctness** — PR #48564 replaces the generic dense/GQA FLOPs formula with MLA/MoE-aware accounting, fixing physically-impossible MFU numbers for whole model classes.
  - https://github.com/sgl-project/sglang/pull/48564

## 5. Stability & Regressions

Ranked by severity:

1. **Unbounded generation parameters (#51835, OPEN, security advisory GHSA-74p5-rgj8-w57v)** — `max_new_tokens` and `n` have no server-side upper bounds, letting a single request monopolize the scheduler. DoS-relevant for any multi-tenant deployment. No fix PR referenced yet.
   - https://github.com/sgl-project/sglang/issues/51835
2. **Mamba2 serving-time Triton compilation (#51628, OPEN)** — `_chunk_scan_fwd_kernel` compiles during serving on NemotronH, taking ~1.45 s per rank and stalling first large prefills, 2–3 times per rank.
   - https://github.com/sgl-project/sglang/issues/51628
3. **Dual-stream MoE input overwrite (#51990, OPEN)** — the MoE input is read on one stream while the in-place Triton runner overwrites it on another. Related prior fixes (#31870, #25279) only covered partial paths.
   - https://github.com/sgl-project/sglang/issues/51990
4. **Priority eviction inverted (#52423, OPEN)** — `radix_eviction_policy=priority` ignores `--schedule-low-priority-values-first` and evicts *highest*-priority prefixes first.
   - https://github.com/sgl-project/sglang/issues/52423
5. **`sgl-kv-indexer` lock starvation (#52575, OPEN)** — a prefix query holds the single `RwLock` read guard for the entire scan, starving `apply`.
   - https://github.com/sgl-project/sglang/issues/52575
6. **AMD aiter MLA decode degradation (#51278, OPEN)** — on MI355X/gfx950, DeepSeek-V2-Lite with fp8 KV cache degrades into repeated tokens once `SGLANG_AITER_MLA_PERSIST=0`; first request coherent, then degrades per-request.
   - https://github.com/sgl-project/sglang/issues/51278
7. **MiniMax-H3 host-pin OOM (#51188, OPEN)** — 24 GB GPU + 32 GB host OOM-killed, yet the server still reports ready and returns 503 — a health-check honesty problem as much as a memory bug.
   - https://github.com/sgl-project/sglang/issues/51188
8. **Kimi-K3 reasoning parser marker collision (#52612, OPEN)** — `--reasoning-parser kimi_k3` strips response-channel markers from the *entire* answer, truncating or dropping output when the answer itself quotes a marker.
   - https://github.com/sgl-project/sglang/issues/52612
9. **`fused_hc_mix` hang (#50780, OPEN)** — hangs on repeated calls from separate CUDA streams.
   - https://github.com/sgl-project/sglang/issues/50780
10. **CI health** — tracking issue #17050 reports **5 broken, 23 flaky** tests as of 2026-11-24; AMD PR test tracker #45847 remains active. CI maintenance mode (#21065) was closed today.
    - https://github.com/sgl-project/sglang/issues/17050

## 6. What This Means for Application Developers

- **Pin your versions and read the 1.0 upgrade notes early.** The move away from silent config coercion (#50045, #52483) means invalid flags that "worked" on 0.5.x will begin failing loudly. Test your launch scripts against `main` before upgrading.
- **Treat request limits as your responsibility.** Until #51835 is fixed, cap `max_new_tokens` and `n` at your gateway or reverse proxy layer — SGLang will not enforce bounds for you. This is especially urgent for public or multi-tenant endpoints.
- **Prioritized caching is not trustworthy yet.** If you rely on `radix_eviction_policy=priority` to protect expensive system prompts, #52423 means the opposite of your intent may be happening. Verify eviction behavior or fall back to LRU until fixed.
- **Health checks can lie.** #51188 shows the server reporting ready while returning 503 after host OOM. Pair readiness probes with a real inference smoke test rather than trusting the port being open.
- **Multimodal and MoE workloads benefit most from this week's PRs** — XPU quantized checkpoints, Qwen-Image 2.1 progressive resolution, and MiniMax-H3 graph improvements are all in flight; if you serve those models on non-NVIDIA hardware, the queue is moving in your favor.
- **Watch reasoning-parser output integrity** if you run Kimi-K3 with `--reasoning-parser kimi_k3` (#52612): answers containing quoted markers may be silently truncated, which is easy to miss in evals that only check the first N tokens.

</details>

<details>
<summary><strong>llama.cpp</strong> — <a href="https://github.com/ggml-org/llama.cpp">ggml-org/llama.cpp</a></summary>

# llama.cpp Digest — 2026-11-24

## 1. Today's Highlights

Quantization selection gets a significant upgrade with an automated Pareto optimizer in `llama-quantize` that picks optimal per-tensor quant types to hit a target file size/bpw at lowest error ([#15550](https://github.com/ggml-org/llama.cpp/pull/15550), build b12669). On the backend side, Metal gained BF16/F32 `src1` support for `MUL_MAT`/`MUL_MAT_ID` ([#32677](https://github.com/ggml-org/llama.cpp/pull/32677), b12668), while OpenVINO picked up a batch of fixes including an `ARGMAX` translator and a rope-in-f32 correctness fix under F16 inference hints ([#32861](https://github.com/ggml-org/llama.cpp/pull/32861), b12659). The server's shell tool schema now requires a `description` argument, giving clients a human-readable summary to display instead of the raw command ([#32894](https://github.com/ggml-org/llama.cpp/pull/32894), b12667).

## 2. Releases & Breaking Changes

- **`llama-quantize` CLI surface** — new option to auto-select quant types against a file/bpw target ([#15550](https://github.com/ggml-org/llama.cpp/pull/15550)). Existing explicit `--type` workflows remain; this is additive. Note that the related test `test-quant-type-selection` was reported failing on master due to tensor reorganization ([#32844](https://github.com/ggml-org/llama.cpp/issues/32844), closed) — if you script quant selection in CI, verify your tensor-order assumptions.
- **Server shell tool schema** — `exec_shell_command` now has a *required* `description` field ([#32894](https://github.com/ggml-org/llama.cpp/pull/32894)). Agent clients that construct tool calls from scratch (rather than letting the model fill the schema) will need to populate this field or calls will fail validation.
- **RPC protocol** — typed request helpers and a single server-side validation step introduced ([#32651](https://github.com/ggml-org/llama.cpp/pull/32651)); client and server now share an `rpc_msg_types` table. If you run a custom RPC client build, ensure client/server are upgraded together.
- **GGUF conversion** — converter no longer writes `tokenizer.ggml.metaspace.prepend_scheme = "always"` for BPE vocabs that declare it in `tokenizer.json` (e.g. mmBERT) ([#32917](https://github.com/ggml-org/llama.cpp/pull/32917)). Re-convert affected models if you saw tokenization drift.
- **Build** — kleidiai files are now treated as vendored in CMake ([#32605](https://github.com/ggml-org/llama.cpp/pull/32605)); minor packaging impact for downstreams bundling those sources.

No versioned releases (tags) in this window; all items are rolling `master` builds.

## 3. New Model & Hardware Support

- **Metal BF16 path** — `MUL_MAT`/`MUL_MAT_ID` now accept BF16 `src1` when the tensor API is available (F32 `src0` stages the A tile as bfloat) ([#32677](https://github.com/ggml-org/llama.cpp/pull/32677)).
- **iPhone Bonsai** — Metal GPU-timeout resolution for Bonsai on iOS ([#31815](https://github.com/ggml-org/llama.cpp/pull/31815)).
- **OpenVINO/ggml** — new `GGML_OP_ARGMAX` translator, dynamic token dim for 2-D activation graph inputs, and rope angle kept in f32 under F16 hints ([#32861](https://github.com/ggml-org/llama.cpp/pull/32861)).
- **WebGPU** — `ROLL` op support added ([#31887](https://github.com/ggml-org/llama.cpp/pull/31887)).
- **Hexagon (in progress)** — integer HMX (w8a8/w8a16) for Q4_0 matmul and FA prefill on v73 SoCs lacking FP16 HMX, plus automatic f32→f16 lowering and generic DMA pipelines ([#29740](https://github.com/ggml-org/llama.cpp/pull/29740), [#32582](https://github.com/ggml-org/llama.cpp/pull/32582)).
- **Vulkan/Android** — build support for Termux and native Android Vulkan drivers ([#32261](https://github.com/ggml-org/llama.cpp/pull/32261)).
- **HRX backend (experimental)** — new AMD GPU backend via the HRX runtime, Loom kernels JIT-compiled on first use; currently validated only on TinyStories-15M ([#32700](https://github.com/ggml-org/llama.cpp/pull/32700)).
- **Inkling 2** — Metal gains indexed-bias support in `FLASH_ATTN_EXT` to avoid materializing the bias and enable full FA on Apple Silicon ([#32808](https://github.com/ggml-org/llama.cpp/pull/32808)); query-chunking work for inkling2 and qwen4exp under way to cut work-buffer memory ([#32883](https://github.com/ggml-org/llama.cpp/pull/32883), [#32884](https://github.com/ggml-org/llama.cpp/pull/32884)).

## 4. Performance & Optimization

- **Small-batch graph reuse** — per-size graph arenas and schedulers for batches ≤8 tokens, so speculative-verify batches of varying size keep their own CUDA graphs instead of re-capturing on every size change ([#31156](https://github.com/ggml-org/llama.cpp/pull/31156)). Directly targets decode/spec-decode overhead.
- **Vulkan SSM_SCAN** — new prefill shader processing multiple rows at a time with shared-memory staging, vec4 loads, and one subgroup reduction per token block; plus coopmat2 support ([#32916](https://github.com/ggml-org/llama.cpp/pull/32916)).
- **Vulkan INT8 MMQ** — load-only A prefetch to narrow the performance gap between AMD shader compilers ([#32919](https://github.com/ggml-org/llama.cpp/pull/32919)); part of a multi-commit series.
- **Vulkan IQ1/IQ2/IQ3** — grid tables moved from constant arrays to a storage buffer, eliminating LDC divergence on NVIDIA ([#32915](https://github.com/ggml-org/llama.cpp/pull/32915)).
- **SYCL flash attention** — large register-file `flash_attn_tile` cuts register spill and recovers the regression from #30271 ([#31748](https://github.com/ggml-org/llama.cpp/pull/31748)).
- **CUDA NVFP4 dequant** — kernel speedup motivated by poor prompt-processing throughput on V100/32 GB with Inkling 2 Mini ([#32875](https://github.com/ggml-org/llama.cpp/pull/32875)).
- **Recurrent-state in-place reads** — graph-only change removing state copies for RWKV6/7 get_rows paths ([#30139](https://github.com/ggml-org/llama.cpp/pull/30139)).
- **Query chunking benchmarks** (qwen4exp, #32884): warm prefill 1258.7 t/s / decode 35.53 t/s at ub=4096 with ~17.7 GiB MoE cache vs. prior config — useful reference numbers for long-context MoE serving.

## 5. Stability & Regressions

Ranked by severity:

1. **CUDA illegal memory access, `SET_ROWS` after SWA checkpoint invalidation** — Gemma 4 E4B + q8_0 KV + draft-MTP, v1.0.0 ([#32900](https://github.com/ggml-org/llama.cpp/issues/32900)). Hard crash; no fix PR yet.
2. **SYCL F16 NaN outputs on dense Qwen3.8-27B Q4_K_M** since IQ3 code reorder (#29107); disabling fused GEMM works around it, Arc Pro B70 ([#30892](https://github.com/ggml-org/llama.cpp/issues/30892)). Correctness, open since October.
3. **HIP MI300X `SOFT_MAX` drops partials over wide rows** — `--backend-sampling` never samples upper vocabulary IDs ([#32852](https://github.com/ggml-org/llama.cpp/issues/32852)). Silent sampling corruption; serious for production HIP deployments.
4. **HIP/ROCm `MUL_MAT` wrong results beyond tolerance** on gfx1200, f16 deterministic ([#31111](https://github.com/ggml-org/llama.cpp/issues/31111)).
5. **Segfault after hip-runtime-amd 10.1-2.1 upgrade**, RX 9070 XT ([#32630](https://github.com/ggml-org/llama.cpp/issues/32630)) — likely driver-interaction; bisect build 12375.
6. **V100 (sm_70) prefill regressions in 1.0** — hybrid GDN models, Volta FATTN config halves `nbatch_V2` vs 0.4.1; slowdown grows with context ([#32810](https://github.com/ggml-org/llama.cpp/issues/32810), [#32245](https://github.com/ggml-org/llama.cpp/issues/32245)). Two independent reports — treat V100 as non-optimal on 1.0 until addressed.
7. **Metal abort on `MUL_MAT` with BF16 src1** at K ≥ 64, batch > 8 (no BF16 `mul_mm` kernel) ([#30973](https://github.com/ggml-org/llama.cpp/issues/30973)). Note this is adjacent to today's #32677 BF16 landing — verify coverage.
8. **Qwen3-Coder tool-grammar false positives** — literal `<tool_call>` markup in answer text triggers the lazy tool grammar, producing false tool calls or HTTP 500 "Unexpected empty grammar stack" ([#32853](https://github.com/ggml-org/llama.cpp/issues/32853), [#32818](https://github.com/ggml-org/llama.cpp/issues/32818), now closed; parser improved in [b12650](https://github.com/ggml-org/llama.cpp/releases)).
9. **Server cache restore ordering** — slot erase doesn't clear the `--cache-ram` prompt cache, so stale prompts can be restored ([#32048](https://github.com/ggml-org/llama.cpp/issues/32048)); related failure with unified KV cache when restoring before idle slots are cleared ([#30961](https://github.com/ggml-org/llama.cpp/issues/30961)).
10. **Vulkan q6_K `token_embd` silently CPU-fallback** on GCN/Polaris, ~497 MiB stuck in a CPU buffer → GPU slower than CPU with graph splits=2 ([#32858](https://github.com/ggml-org/llama.cpp/issues/32858)). Performance cliff plus misleading backend placement.
11. **Hexagon OPPOLL logcat flood** — `GGML_HEXAGON_OPPOLL=1` produced ~1.75M lines / ~270 MB in ~3 s on Android due to zero-timeout FastRPC reads taking the blocking path ([#31933](https://github.com/ggml-org/llama.cpp/issues/31933)).
12. **Web UI unresponsive** with Chrome default font size ≥24 (Svelte `effect_update_depth_exceeded`) ([#32361](https://github.com/ggml-org/llama.cpp/issues/32361)).
13. **Build failure** — UI asset validation fails during `v1.0.0`/`v0.7.0` tagged builds on Linux with CUDA ([#32780](https://github.com/ggml-org/llama.cpp/issues/32780)). Relevant if you pin to release tags.

## 6. What This Means for Application Developers

- **Agent builders**: The required `description` on the shell tool and the inkling/Qwen3-Coder grammar fixes are the two changes most likely to touch your integration tests. False tool-call triggering from literal `<tool_call>` text in model output is being actively addressed — if you run Qwen3-Coder via `llama-server`, upgrade past b12650 and re-test prompts that include code examples of tool markup.
- **Quantization workflows**: `llama-quantize`'s new target-driven mode (#15550) is worth evaluating for automated release pipelines — specify a bpw/file budget, get the lowest-error tensor mix. But validate against #32844's tensor-reorganization report if you have CI that inspects quantized tensor layout.
- **Ampere/Ada/Hopper users**: #31156 (per-size CUDA graphs for small batches) is the highest-leverage pending PR if you serve spec-decode or short-verify workloads; track its merge.
- **V100 owners**: hold on v1.0 for prefill-sensitive workloads — two independent reports (#32810, #32245) show hybrid-model prefill regressions versus 0.4.1, especially at longer contexts.
- **HIP/MI300X operators**: #32852 (sampling only over lower vocab IDs) is a silent correctness issue in `--backend-sampling`; until fixed, avoid that flag or verify sampled distributions on compliance-sensitive endpoints.
- **Metal/iOS**: BF16 `src1` support has landed (#32677) but #30973's abort case (K ≥ 64, batch > 8) lives in the same codepath — test larger batches before shipping.
- **Mobile/edge**: Hexagon's int-HMX work (#29740, #32582) is the most substantive mobile prefill improvement in flight, but is v73-specific and still open; Vulkan-on-Android (#32261) opens Termux-based development paths.

</details>

<details>
<summary><strong>Ollama</strong> — <a href="https://github.com/ollama/ollama">ollama/ollama</a></summary>

# Ollama Digest — 2026-11-24

## 1. Today's Highlights

The v0.40.18-rc0 release lands significant Metal/MLX work: Inkling residual mixing fusion and shared MLX tensor helpers, plus a llama.cpp bump to b12651 with **JetPack 5 support removed**. The llama.cpp version bump to b12653 unblocks **Inkling 2 GGUF** (`inkling2` / `inkling2_loop` architectures) via PR #19861/#19865.

A troubling cluster of **memory regressions** is emerging around 0.40.15–0.40.17: the `qwen3.8:27b-mtp_q8` model reports 127 GB VRAM vs. the prior 51 GB ([#19833](https://github.com/ollama/ollama/issues/19833)), M4 Pro MLX users see a major performance regression ([#19866](https://github.com/ollama/ollama/issues/19866)), and generic OOM reports ([#19851](https://github.com/ollama/ollama/issues/19851)) point to 0.40.17 being a rough release. Meanwhile, the MLX runner's 8 GiB hard-coded prefix cache budget continues to cause swap thrash on 32 GB Apple Silicon ([#18131](https://github.com/ollama/ollama/issues/18131)).

## 2. Releases & Breaking Changes

- **v0.40.18-rc0** — MLX Metal fusion for Inkling residual mixing ([#19808](https://github.com/ollama/ollama/pull/19808)), shared MLX tensor/model helpers across architectures ([#19805](https://github.com/ollama/ollama/pull/19805)), llama.cpp b12651 bump.
- **JetPack 5 removed** — llama.cpp bump to b12651 drops JetPack 5 support ([#19865](https://github.com/ollama/ollama/pull/19865)). JetPack 6 users on Jetson remain affected by a separate CUDA VMM crash (see §5).
- **Register/API model regressions**: `OLLAMA_KV_CACHE_TYPE` is silently ignored by the MLX runner (only honors llama.cpp) — no config change, but a silent behavioral gap ([#19857](https://github.com/ollama/ollama/issues/19857)).

## 3. New Model & Hardware Support

- **Inkling 2 GGUF** — `LLAMA_CPP_VERSION` bump to b12653 enables `inkling2_loop` architecture and `inkling2v` projector ([#19861](https://github.com/ollama/ollama/pull/19861), [#19826](https://github.com/ollama/ollama/issues/19826)).
- **Metal / Inkling kernels** — Inkling-only Metal kernels (fused SwiGLU, NVFP4/MXFP8 expert gathers, relative-position split attention, fused short convs) gated by GPU generation/size class, with stock-graph fallbacks ([#19843](https://github.com/ollama/ollama/pull/19843)).
- **Jetson AGX Orin (JetPack 6)** — vision requests still crash on CUDA VMM pool allocation; a `GGML_CUDA_NO_VMM=ON` build is requested ([#19815](https://github.com/ollama/ollama/issues/19815)).

## 4. Performance & Optimization

- **Inkling Metal decode/prefill**: fused kernels target faster decode, prefill, and draft rounds on Apple Silicon ([#19843](https://github.com/ollama/ollama/pull/19843)).
- **Prefill cache persistence (experimental)**: `OLLAMA_PREFILL_CACHE=1` preserves KV cache across runner reloads, avoiding full prompt recompute after unload ([#17953](https://github.com/ollama/ollama/pull/17953)).
- **MLX KV-cache quantization gap**: `OLLAMA_KV_CACHE_TYPE` is ignored by the MLX runner, so `qwen3.8:27b-mlx` OOMs at 16K on 24 GB Macs — a 16-bit vs. quantized KV gap ([#19857](https://github.com/ollama/ollama/issues/19857)).

## 5. Stability & Regressions

Ranked by severity:

1. **[CRITICAL] 0.40.17 OOM / VRAM blowup** — `qwen3.8:27b-mtp_q8` uses 127 GB vs. 51 GB before ([#19833](https://github.com/ollama/ollama/issues/19833)); generic OOM reports ([#19851](https://github.com/ollama/ollama/issues/19851)). No fix PR yet.
2. **[CRITICAL] M4 Pro MLX performance regression** on 0.40.17 with `OLLAMA_KEEP_ALIVE=8h` ([#19866](https://github.com/ollama/ollama/issues/19866)). No fix PR.
3. **[HIGH] Jetson AGX Orin vision OOM** — every image request crashes in `cuMemAddressReserve`; text-only works ([#19815](https://github.com/ollama/ollama/issues/19815)). No fix PR.
4. **[HIGH] MLX 8 GiB prefix cache causes swap on 32 GB Macs** during agent workloads ([#18131](https://github.com/ollama/ollama/issues/18131)). No fix PR.
5. **[HIGH] Tool-call parser drops content when no tools declared** — call-shaped output parsed as tool call, then dropped by `len(req.Tools) > 0` gate, returning empty content in non-stream mode ([#19854](https://github.com/ollama/ollama/issues/19854)). Fix PR: [#19855](https://github.com/ollama/ollama/pull/19855).
6. **[MEDIUM] Legacy template panic** — `.Response` inside `if/else` panics with nil ListNode, HTTP 500 ([#19859](https://github.com/ollama/ollama/issues/19859)). Fix PR: [#19860](https://github.com/ollama/ollama/pull/19860).
7. **[MEDIUM] `strict` tool key silently dropped** — function-level keys lost on decode/encode ([#19852](https://github.com/ollama/ollama/issues/19852)). Fix PR: [#19853](https://github.com/ollama/ollama/pull/19853).
8. **[MEDIUM] Multi-GPU VRAM eviction** — 3s free-memory refresh deadline stalls on 6-GPU hosts, causing stale VRAM and spurious eviction ([#19279](https://github.com/ollama/ollama/issues/19279)).
9. **[MEDIUM] Pull resume broken** — server restart >1h into a pull breaks resume with `-partial-0` file error or digest mismatch ([#19337](https://github.com/ollama/ollama/issues/19337)).
10. **[LOW] Windows service installer request** — current user-login-item model can't run 24/7 without an active session ([#19862](https://github.com/ollama/ollama/issues/19862)).

## 6. What This Means for Application Developers

- **Pin your Ollama version if you're on 0.40.17** — the VRAM/performance regressions are widespread and unpatched. Stay on 0.40.15 or wait for 0.40.18 stable.
- **Agent loops on Apple Silicon need care**: MLX prefix cache is hard-coded at 8 GiB and `OLLAMA_KV_CACHE_TYPE` is ignored by the MLX runner — check `ollama ps` and swap before deploying multi-turn agents on 24–32 GB Macs.
- **Tool-calling correctness is fragile**: parsers can consume call-shaped output even when no `tools` are declared, returning empty content (fix in [#19855](https://github.com/ollama/ollama/pull/19855)). Validate `content` and `tool_calls` on non-tool requests; consider declaring a no-op tool to avoid the parser path.
- **Multi-turn templates**: legacy `{{ .Response }}` inside conditionals can panic and return HTTP 500 — audit custom templates or upgrade once [#19860](https://github.com/ollama/ollama/pull/19860) lands.
- **Inkling 2 support is coming** via llama.cpp bump — plan for GGUF-based workflows if you're targeting the Inkling architecture.

</details>

<details>
<summary><strong>LiteLLM</strong> — <a href="https://github.com/BerriAI/litellm">BerriAI/litellm</a></summary>

# LiteLLM Digest — 2026-11-24

## 1. Today's Highlights

The most consequential activity today is a large, stacked effort to port the spend-log and auth pipeline into a native Rust gateway (PRs #53706 → #53708 → #53710 → #53748), alongside new control-plane features for managing dataplanes and fleet-wide team budgets via desired state. On the bug front, a batch of long-lived correctness issues were closed — including a Gemini prompt-caching regression (#42104), Anthropic exception on `vector_store_ids` (#23741), and the Prometheus `/metrics` redirect (#33676) — while several budget/admission-cache consistency bugs (#33873, #36941, #35538) remain open. No model-support changes landed on main, but MiniMax-H3-Image image generation/editing is being backported to LTS.

## 2. Releases & Breaking Changes

Three patch releases were published in the last 24h, all with the same release process change highlighted:

- **v1.110.3** — https://github.com/BerriAI/litellm/releases/tag/v1.110.3
- **v1.109.4** — https://github.com/BerriAI/litellm/releases/tag/v1.109.4
- **v1.108.16** — https://github.com/BerriAI/litellm/releases/tag/v1.108.16

**Docker signature verification migration (operational breaking change).** Since **v1.108.10**, images are signed **keyless only** via `project-releaser`, replacing the old `cosign.pub` key-based verification. Update CI/verification pipelines accordingly:

```bash
cosign verify \
  --certificate-identity https://github.com/BerriAI/project-releaser/.github/workflows/release.yml@refs/heads/main \
  --certificate-oidc-issuer https://token.actions.githubusercontent.com \
  ghcr.io/berriai/litellm:v1.110.3
```

Tracking issue (closed, but worth confirming for your tooling): https://github.com/BerriAI/litellm/issues/52837

**Pending backport:** #54069 backports the restricted end-user index fix (#51772) into `stable/1.110.x` for **v1.110.4** — https://github.com/BerriAI/litellm/pull/54069

## 3. New Model & Hardware Support

No new model or hardware backends landed on main today. Notable in-flight work:

- **MiniMax-H3-Image** — image generation and edits on `/v1/images/generations` and `/v1/images/edits`. Two PRs: main (#50881, https://github.com/BerriAI/litellm/pull/50881) and LTS backport (#53986, https://github.com/BerriAI/litellm/pull/53986). Returns image + cost; previously edits returned 500.
- **ChatGPT subscription binding** — admins can sign in to a ChatGPT subscription and bind it to a team or virtual key, with encrypted storage and automatic refresh — https://github.com/BerriAI/litellm/pull/53744

## 4. Performance & Optimization

- **Native Rust gateway spend-log stack (in progress, three PRs open):**
  - Build spend-log callback input natively — https://github.com/BerriAI/litellm/pull/53706
  - Async host-call handler for callbacks — https://github.com/BerriAI/litellm/pull/53708
  - Write spend logs from Rust (`SpendLogWriter<PgLedgerStore>` over the gateway DB) — https://github.com/BerriAI/litellm/pull/53710
  - Group spend-log rows under the caller's session/trace — https://github.com/BerriAI/litellm/pull/53748
  - Install the remote model cost map after boot, matching Python behavior — https://github.com/BerriAI/litellm/pull/53555
- **Rust router cache** — model rate-limit counters added to `RouterCache` (closed) — https://github.com/BerriAI/litellm/pull/53789
- **OTel metric reader** — hardcoded 5s export interval overrides `OTEL_METRIC_EXPORT_INTERVAL`, causing 12×/min re-ship of cumulative histograms regardless of traffic (#38052) — https://github.com/BerriAI/litellm/issues/38052

Concrete throughput/latency numbers are not provided in the source data.

## 5. Stability & Regressions

Ranked by severity:

1. **Proxy fails to start on `SQL_ASCII` databases** — `find_blockers` raises `ValueError: invalid literal for int() with base 10: "b'8192'"` while building request-log indexes (v1.109.1). Open — https://github.com/BerriAI/litellm/issues/52247
2. **Budget/spend consistency (multiple open):**
   - Multi-window budget reset can leave stale cached spend after PG commit — https://github.com/BerriAI/litellm/issues/36941
   - Spend-log batches dropped on local non-Prisma flush failure — https://github.com/BerriAI/litellm/issues/33873
   - Tag spend counters not reseeded from durable DB spend — https://github.com/BerriAI/litellm/issues/35538
   - Componentized startup ignores YAML pool timeout / backend pool limit — https://github.com/BerriAI/litellm/issues/33021
3. **Gemini/Vertex tool mapping crash on boolean sub-schemas** (`add_object_type: bool not iterable`) — https://github.com/BerriAI/litellm/issues/53684
4. **watsonx streaming usage lost** — proxy reports its own (much lower) token estimate instead of upstream usage — https://github.com/BerriAI/litellm/issues/46059
5. **Vertex Claude Haiku 5.5 missing native structured-output flag** — silent fallback to unforced JSON tool on v1.110.2 — https://github.com/BerriAI/litellm/issues/53478
6. **`complexity_router` with plugins ignores fallbacks on cooldown** (closed) — https://github.com/BerriAI/litellm/issues/53099
7. **Responses-to-Chat streaming defers structured reasoning items to terminal event** — https://github.com/BerriAI/litellm/issues/40887

**Closed fixes worth noting:** whitespace-only system messages to Anthropic (#28706 open), audio `response_format=text` returning JSON (#31457 closed), Gemini mid-conversation system messages breaking prompt caching (#42104 closed), overlong tool-call IDs in Chat→Responses bridge (#42765 closed), Anthropic `vector_store_ids` 400 (#23741 closed), Prometheus `/metrics` redirect (#33676 closed).

## 6. What This Means for Application Developers

- **Update cosign verification now** if you gate deployments on image signature — key-based verification of `litellm` images no longer applies from v1.108.10 onward.
- **Budget enforcement is not yet fully authoritative.** If you rely on per-key/team/tag budgets for isolation or cost guarantees, assume cached spend can diverge from the durable ledger under failure; the open issues above are the tracking set. Evaluate #53946 (per-principal budgets spanning model families) — https://github.com/BerriAI/litellm/issues/53946
- **Gemini/Vertex structured output needs a pin check.** If you depend on `json_schema` strict mode with Vertex Claude or Gemini tool schemas containing boolean sub-schemas, test on your target version before upgrading.
- **Streaming token accounting is unreliable for watsonx** — if you bill downstream on LiteLLM-reported usage, reconcile against provider invoices.
- **Rust gateway migration is spend-log first.** The native path preserves `litellm_trace_id` session semantics (header chain → W3C `traceparent` → uuid), so tracing/observability contracts should hold if you adopt it.

</details>

<details>
<summary><strong>Unsloth</strong> — <a href="https://github.com/unslothai/unsloth">unslothai/unsloth</a></summary>

# Unsloth Digest — 2026-11-24

## 1. Today's Highlights

Unsloth shipped **v0.1.923-beta**, headlined by Inkling 2 Mini running up to **1.9x faster** on decoding across all GPUs, plus a new Inkling 1.9x faster training path and improved GRPO/AsyncGRPO training. However, the release is immediately followed by a **GPU offloading regression report** (40 → 12 tok/s on Inkling 2 Mini) and multiple Inkling-2-Mini GGUF loading/correctness issues surfacing across backends. CI/main hygiene is also a theme today, with several red `main` tests being fixed via a batch of cleanup PRs from `danielhanchen`.

## 2. Releases & Breaking Changes

- **[v0.1.923-beta](https://github.com/unslothai/unsloth/releases)** — Inkling 2 Mini decode up to 1.9x faster on all GPUs; RTX Spark improvements; faster GRPO & AsyncGRPO training; Qwen-Image-Flash and FastWan support; new "Knowledge" page in Settings; audio/subtitle/image translation. Also brings Inkling 2 Mini support to **8–12 GB GPUs**.
- **[#18763](https://github.com/unslothai/unsloth/issues/18763) (CLOSED)** — Unsloth Desktop's FastFlowLM bump to 1.0.13 broke AMD NPU model listing (`Extra data: line 2025 column 1`). Resolved, but worth noting if you pinned FastFlowLM.
- **[#17847](https://github.com/unslothai/unsloth/issues/17847) (CLOSED)** — `transformers` upper bound raised to **5.18**, unblocking `trl.SFTConfig(assistant_only_loss=True)` for vision post-training.
- **[#18699](https://github.com/unslothai/unsloth/issues/18699) (OPEN)** — `transformers==5.13.1` tripping antivirus/scanner heuristics; not a functional break, but may affect corporate Windows deployments.

## 3. New Model & Hardware Support

- **Inkling 2 Mini on 8–12 GB GPUs** — expanded low-VRAM coverage ([#0.1.923-beta](https://github.com/unslothai/unsloth/releases)).
- **Tensor parallel QLoRA for MoE** — [PR #19215](https://github.com/unslothai/unsloth/pull/19215) shards 4-bit routed experts by index and quantizes on load so **Inkling-2-Mini QLoRA fits on 2× T4** under `UNSLOTH_PARALLEL="tp=2"`.
- **MLX backend** — [PR #19216](https://github.com/unslothai/unsloth/pull/19216) moves Unsloth Studio MLX pins to `mlx-vlm 0.8.1`, adapting `VLMPromptCacheSession` to the new `video_timing=` signature.
- **AMD/mixed-VRAM gap** — [#12248](https://github.com/unslothai/unsloth/issues/12248) (OPEN) reports Studio ignores the AMD card on mixed NVIDIA+AMD hosts and can't use both simultaneously (two independent machines, R9700 + RTX 3080/4090). No fix PR yet.
- **New engine request** — [#18895](https://github.com/unslothai/unsloth/issues/18895) asks for native **Strata** support alongside llama.cpp and per-engine pluggability.

## 4. Performance & Optimization

- **Inkling 2 Mini decode: 1.9x** faster on all GPUs (release) — but see the regression below.
- **Krea 2 attention (Studio)** — [PR #19208](https://github.com/unslothai/unsloth/pull/19208) removes the mask so INT8 attention covers the valid key prefix: **5.1% faster on L4**, **8.1% faster on RTX PRO 6000** at default Turbo/1024px/8-step renders.
- **GGUF chat prompt double-count** — [PR #19159](https://github.com/unslothai/unsloth/pull/19159) reuses the cached native prompt count in the context-fit path, avoiding a full re-render + re-tokenize every turn.
- **Prompt-cache miss on `@skill`** — [#19212](https://github.com/unslothai/unsloth/issues/19212) (OPEN) — skill content is appended to system prompt only on the mentioning turn, so turn 2+ reprocesses the full conversation. Diagnostics only; no fix PR yet.
- **GRPO / AsyncGRPO training** sped up as part of v0.1.923-beta.

## 5. Stability & Regressions (ranked by severity)

1. **Inkling 2 Mini GPU offload regression** — [#19137](https://github.com/unslothai/unsloth/issues/19137) (OPEN) — Studio on Windows 11 drops from **40 → 12 tok/s** after v0.1.923-beta. Directly contradicts the headline speedup claim; no fix PR linked yet.
2. **Inkling-2-Mini GGUF NaN on Tesla V100S (sm_70)** — [#19013](https://github.com/unslothai/unsloth/issues/19013) (OPEN) — outputs `"!!!!"` on both Unsloth `cuda12-older` and mainline llama.cpp; CPU is correct. Silent-wrong-output class; no fix PR.
3. **Inkling-2-Mini GGUF fails to load on Studio Docker** — [#18757](https://github.com/unslothai/unsloth/issues/18757) (OPEN) — 8 comments, unresolved.
4. **Studio llama-server crashes on ROCm via Studio (system `libamdhip64`)** — [#18948](https://github.com/unslothai/unsloth/issues/18948) (OPEN) — works from shell; CachyOS + system ROCm 10.1.
5. **MOSS-Image CUDA-graph RoPE cache corruption** — [PR #19211](https://github.com/unslothai/unsloth/pull/19211) (fix OPEN) — noise/washed-out renders from the 4th render on A100-40 with INT8 compiled DiT + CUDA graphs.
6. **MiniMax-H3 video / AdaLN use-after-free in recorded CUDA graphs** — [PR #19213](https://github.com/unslothai/unsloth/pull/19213) (fix OPEN) — same class as #19211; not hit by default loads.
7. **Studio multi-tab chat corruption** — [PR #19164](https://github.com/unslothai/unsloth/pull/19164) (fix OPEN) — deleted turns re-appear from stale autosave.
8. **Custom chat template wiped on preset apply** — [PR #19154](https://github.com/unslothai/unsloth/pull/19154) (fix OPEN) — next GGUF reload silently uses the model's default template.
9. **"JSON with timings" export sometimes missing timings** — [PR #19155](https://github.com/unslothai/unsloth/pull/19155) (fix OPEN).
10. **Inkling2_loop model type unsupported on Apple Silicon** — [#18972](https://github.com/unslothai/unsloth/issues/18972) (CLOSED) — was blocking macOS M1 Pro Studio loads.
11. **Mixed NVIDIA+AMD ignored** — [#12248](https://github.com/unslothai/unsloth/issues/12248) — architectural (one venv = one PyTorch build).
12. **FLM (NPU) context too small** — [#19066](https://github.com/unslothai/unsloth/issues/19066) (OPEN).

Security-adjacent fixes landed today worth noting: [PR #19190](https://github.com/unslothai/unsloth/pull/19190) clamps weight-index/component paths to the checkpoint folder (blocks `../` traversal from untrusted checkpoints); [PR #19189](https://github.com/unslothai/unsloth/pull/19189) closes remote-code consent bypasses via versioned `config.<ver>.json`, JSON file targets, and CSM; [PR #19199](https://github.com/unslothai/unsloth/pull/19199) hardens IPv6 loopback / sidecar listener ownership.

## 6. What This Means for Application Developers

- **Don't upgrade blindly to v0.1.923-beta for Inkling 2 Mini inference.** The 1.9x decode claim is contradicted by [#19137](https://github.com/unslothai/unsloth/issues/19137) on Windows 11 + GPU offload, and by #18757/#19013 for GGUF loading and V100 correctness. Pin the prior version for production until these are addressed, or validate on your exact GPU/OS.
- **V100S (sm_70) users in particular should avoid Inkling-2-Mini GGUF on GPU** — CPU fallback is the only correct path today per [#19013](https://github.com/unslothai/unsloth/issues/19013). This is a silent-wrong-output failure, not a crash — treat any deployed V100 Inkling-2-Mini workloads as suspect.
- **Multi-tab Studio deployments need #19164.** If your team shares a Studio server and edits the same chat from two clients, expect deleted content to resurrect and recent turns to disappear after reload until the fix merges.
- **Custom chat templates are fragile with presets (#19154).** If your app depends on a specific chat template for GGUF tool-calling, applying a preset currently resets it on the next reload — re-verify templates after any preset change.
- **MoE fine-tuning on small VRAM is now viable.** [PR #19215](https://github.com/unslothai/unsloth/pull/19215) makes Inkling-2-Mini QLoRA fit on 2× T4 via tensor-parallel expert sharding — good news for cost-sensitive QLoRA jobs once merged.
- **Studio image/video pipelines are getting meaningfully faster but have CUDA-graph caveats.** Krea 2 (#19208) shows 5–8% wins; MOSS-Image (#19211) and MiniMax-H3 (#19213) show that INT8 + compiled + CUDA graphs can produce corrupt or use-after-free output on some prompts. Prefer disabling CUDA graphs in Studio image/video paths if you hit noise artifacts.
- **Prompt-cache economics matter for agent loops.** [#19212](https://github.com/unslothai/unsloth/issues/19212) and [PR #19159](https://github.com/unslothai/unsloth/pull/19159) both concern avoidable full-prompt reprocessing — if you're running long agentic sessions, expect cache-miss turn-2 penalties on skill-using chats until #19212 is addressed.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*