# AI Infrastructure Digest 2026-11-25

> Generated: 2026-11-25 04:05 UTC | Projects covered: 6

- [vLLM](https://github.com/vllm-project/vllm)
- [SGLang](https://github.com/sgl-project/sglang)
- [llama.cpp](https://github.com/ggml-org/llama.cpp)
- [Ollama](https://github.com/ollama/ollama)
- [LiteLLM](https://github.com/BerriAI/litellm)
- [Unsloth](https://github.com/unslothai/unsloth)

---

## Cross-Project Comparison

# Cross-Project Comparison Report — AI Infrastructure Ecosystem
**Digest date: 2026-11-25**

---

## 1. Ecosystem Overview

The AI infrastructure stack is in a **consolidation-and-hardening phase**, not a feature-explosion phase. Across all six projects, the dominant engineering theme is not new capabilities but **correctness, security, and stability at scale**: vLLM is chasing a scheduler-level KV-transfer bug and ROCm quality regressions, SGLang is preparing a stability-first 1.0 with explicit breaking-config errors, and Ollama is firefighting an MLX memory-growth regression that can OOM a 64 GB Mac. Simultaneously, the ecosystem is converging on **agentic serving primitives** — provider-neutral KV cache control, prefix-cache-aware routing, MCP multimodal payloads — suggesting the next competitive axis is *agent workload efficiency*, not raw throughput. Quantization is undergoing a generational kernel transition (vLLM's Marlin→Humming, llama.cpp's native quantized-KV flash attention), while **Inkling 2** has emerged as the day's most cross-cutting new architecture, appearing in vLLM, llama.cpp, Ollama, and Unsloth within the same 24-hour window.

---

## 2. Activity Comparison

| Project | Layer | Issues Activity (24h) | PR Activity (24h) | Release Status | Stability Posture |
|---|---|---|---|---|---|
| **vLLM** | Serving engine | Dense; 1 critical tracker (#69137), several long-tail regressions | High; kernel/quant/perf PRs across NVIDIA, ROCm, Intel XPU | **No release**; 2 migration RFCs in flight (#68711, #67937) | ⚠️ Elevated — scheduler KV bug unfixed |
| **SGLang** | Serving engine | Heavy roadmap + security cluster (3 open security fix PRs) | Moderate; AMD/NPU perf, PD-disaggregation roadmap | **No release**; 1.0 tracker (#50045) defines breaking upgrade | ⚠️ Elevated — 3 open security fixes, `stop_regex` DoS |
| **llama.cpp** | Local runtime | Very high; ~16 ranked regressions, mostly backend-specific | Very high; CUDA/Vulkan/SYCL/ARM kernels landed + in flight | **b12683–b12711** (rapid cadence, ~29 builds) | ⚠️ Mixed — silent-wrong-answer bugs on Arc/RDNA4 |
| **Ollama** | Local runtime | High; MLX regression + Inkling-2 load failures dominate | Moderate; VRAM accounting, parser fixes, goroutine leak | **v0.40.18** shipped (MLX/Metal + llama.cpp bump) | 🔴 Critical — 0.40.17 MLX perf + memory regression |
| **LiteLLM** | Gateway | High; MCP `tools/list` stall, rate-limit fairness, spend bugs | Very high; Rust gateway rewrite (#53982–#54329), LTS backports | **v1.111.0, v1.112.0-rc.1** + LTS 1.108.17 | ⚠️ Elevated — MCP latency regression open |
| **Unsloth** | Fine-tuning | Moderate; Inkling-2 platform bugs (XPU/ROCm/regex) | High; distributed backend (#19378), export fixes | **v0.1.924-beta** (Inkling 2 Mini FT) | ⚠️ Elevated — silent CPU fallback (#19341) |

**Reading the table:** llama.cpp and LiteLLM have the highest raw activity; Ollama has the most acute stability risk; vLLM and SGLang carry the highest *blast radius* per bug (scheduler/gateway-level failures).

---

## 3. Model Support Race

| Model / Architecture | vLLM | SGLang | llama.cpp | Ollama | LiteLLM | Unsloth |
|---|---|---|---|---|---|---|
| **Inkling 2 / Mini** | ✅ Intel XPU RFC (#69712) | — | ✅ Mini `mix()` fix (#32855) | ⚠️ Load failures (#19888) | — | ✅ **Fine-tuning** (#v0.1.924) |
| **DeepSeek-V4.1 / Flash** | ✅ B300 fused EP (#68366), ROCm top-k (#65742) | — | ✅ Query chunking (#32884) | — | — | — |
| **GLM 5.3 / Flash** | ✅ ShardQ sparse MLA (#69086/#69125) | ✅ DSA k-pool opt (#44417) | — | — | ✅ `reasoning_effort` fix (#54279) | — |
| **Qwen3.5 / Qwen3-Omni** | ⚠️ Structured-output bug (#38696) | — | ⚠️ Omni mmproj conversion fails (#32933) | — | — | — |
| **Hunyuan-4-Flash** | ✅ HY4 MQA logits (#68364) | ✅ DFly spec decode (#51938) | — | — | — | — |
| **Gemma 4** | — | ✅ Breakable prefill CUDA graph (#52404) | ✅ FA fix on Windows (#30436) | ✅ Parser fix (#19890) | — | ⚠️ Tool-arg bug (#18847) |
| **Mamba / FalconMamba** | — | ✅ 64-bit chunk offsets (#51285) | — | — | — | ⚠️ transformers 5.24 break (#19384) |
| **Volcengine Ark / ElevenLabs** | — | — | — | — | ✅ New provider support (#54076, #54342) | — |

**Who's ahead:**
- **Serving engines (vLLM, SGLang)** lead on frontier MoE/MLA architectures — DeepSeek-V4.1, GLM 5.3, Hunyuan-4-Flash.
- **llama.cpp** leads on breadth of *local* model coverage (MiniCPM-V, Inkling 2 Mini, Qwen3-Omni) but lags on frontier-scale models.
- **Unsloth** is the only project shipping **fine-tuning** support for Inkling 2 Mini — a differentiated position.
- **LiteLLM** is the only project adding *provider-side* models (Ark Seedream, ElevenLabs realtime, Z.AI GLM), reinforcing its gateway role.
- **Ollama** is notably behind on new-architecture bring-up — Inkling 2 landed with load failures, not a clean support story.

---

## 4. Performance Frontier

Optimization effort clusters into five arenas, with clear project specialization:

| Arena | vLLM | SGLang | llama.cpp | Ollama | LiteLLM | Unsloth |
|---|---|---|---|---|---|---|
| **KV cache / offloading** | 🔥 High — agentic cache policy (#57103, #53421), KV load reporting (#63936) | 🔥 High — HiCache, PD disaggregation roadmap | Medium — native quantized-KV FA (#31234, #30792) | Low — VRAM accounting (#19632) | Low | Low |
| **Kernel fusion / launch overhead** | High — Humming kernels (#65560), fused EP (#68366) | 🔥 High — IndexPool fusion (#52692), DSA launch reduction (#44417) | 🔥 High — RMS_NORM+MUL+RoPE (#32500), MMQ stream-k (#32921) | Medium — Metal split-attention (#19881) | — | Medium — INT8 attention fallback (#19391) |
| **Quantization** | 🔥 High — Marlin→Humming (INT4/8, FP8, MXFP4/6/8, NVFP4) | Medium — aiter TDM GEMM (#51155) | 🔥 High — ARMv8.0 repack, SVE Q5, IQ1/2/3 Vulkan, SYCL NVFP4 | Low | — | High — QLoRA/INT8 |
| **Distributed serving** | 🔥 High — PCIe all-gather (#65359), DEP fused EP | 🔥 High — PD disaggregation default (#43699) | Medium — RPC context reuse (#32896), TP RESHAPE fix (#32983) | Low | Low | 🔥 High — DDP/FSDP2/TP/PP/CP/EP (#19378) |
| **Batching / scheduling** | High — scheduler correctness (#69137) | High — prefill delayer tuning (#50447) | Medium — prompt-cache slot scheduler (#28992) | Medium — SSE flush (#17027) | Medium — stream finalization (#54247) | Medium — streaming fan-out (#19396) |

**Concentration of effort:**
- **KV cache and distributed serving** are where serving engines (vLLM, SGLang) are investing most — the frontier has shifted from "make one GPU fast" to "make many GPUs coordinate efficiently."
- **Kernel fusion** is universal — every project is collapsing launch overhead, because at modern concurrency the bottleneck is often *launch count*, not FLOPs.
- **Quantization is bifurcating:** vLLM is going *up-market* (FP8/NVFP4/MX formats for datacenter), llama.cpp is going *down-market* (ARMv8.0, SVE, cheap hardware) — a clean division of labor.
- **Unsloth is the only project optimizing training-side distributed parallelism** — a distinct frontier.

---

## 5. Layer Positioning

The six projects occupy four distinct layers, with limited direct overlap:

```
┌─────────────────────────────────────────────────────────────┐
│  GATEWAY / ROUTING          LiteLLM                         │
│  (multi-provider, auth, rate limits, spend, MCP)            │
├─────────────────────────────────────────────────────────────┤
│  SERVING ENGINE             vLLM          SGLang            │
│  (multi-GPU, PD disaggregation, agentic cache, MoE/MLA)     │
├─────────────────────────────────────────────────────────────┤
│  LOCAL RUNTIME              llama.cpp     Ollama            │
│  (single-node, GGUF/MLX, edge/consumer HW, MCP)             │
├─────────────────────────────────────────────────────────────┤
│  TRAINING / FINE-TUNING     Unsloth                         │
│  (LoRA/QLoRA, distributed training, export to GGUF/merged)  │
└─────────────────────────────────────────────────────────────┘
```

**Key distinctions:**
- **vLLM vs SGLang** — both serving engines, but diverging: vLLM is broadest on hardware (NVIDIA/ROCm/Intel XPU) and quantization formats; SGLang is deepest on **PD disaggregation as default scale-out** and is explicitly hardening for a 1.0 stability contract. vLLM's migration RFCs (#68711, #67937) suggest faster API churn; SGLang's 1.0 suggests the opposite.
- **llama.cpp vs Ollama** — llama.cpp is the *engine* (raw kernels, backends, GGUF); Ollama is the *product* (model management, API, desktop, MCP). Ollama's bugs are often integration-layer (loaders, parsers, VRAM accounting); llama.cpp's are often backend-kernel-level.
- **LiteLLM** is the only true **gateway** — it doesn't run inference, it routes, meters, and governs. Its bugs (rate-limit fairness, spend counters, MCP latency) are *control-plane* bugs, categorically different from the others.
- **Unsloth** is the only **training-layer** project — it feeds the others (exports GGUF for llama.cpp/Ollama, merged 16-bit for vLLM/SGLang).

**Practical implication:** a production stack today is typically *Unsloth (fine-tune) → vLLM or SGLang (serve) → LiteLLM (gateway)*, with llama.cpp/Ollama occupying the local/edge tier. Cross-layer bugs (e.g., Unsloth's GGUF export failing for Inkling 2) break the chain.

---

## 6. Trend Signals

**Trend 1 — Agentic cache control is the next API surface.**
vLLM has 4+ parallel RFCs (#57103, #53421, #37003, #52113) converging on provider-neutral, session-aware KV retention — pinning, promotion-at-load, hint envelopes. SGLang's PD-disaggregation roadmap and llama.cpp's MCP multimodal payloads (#32064) point the same direction. **Watch:** the API shape for "this branch resumes soon" will become a de-facto standard; agent frameworks that adopt early will get prefix-cache hit-rate advantages.

**Trend 2 — Prefix-cache-aware routing is a correctness problem, not just a perf one.**
vLLM's #65502 (trusted forwarded prompt token IDs) addresses a real bug: gateways that re-tokenize at ingress produce different token IDs than the worker, silently destroying prefix-cache hits behind routers. **Watch:** if you run LiteLLM in front of vLLM/SGLang, this is your hit-rate ceiling.

**Trend 3 — Security is now a first-class concern for serving engines.**
SGLang shipped 3 open security fix PRs in one day (SSRF via `/v1/videos`, `diffusers_kwargs` bypass, profiling opt-in). Ollama has an O(N²) image-marker DoS (#19885). LiteLLM has an MCP `tools/list` 18–50 s stall (#50065). **Watch:** if you expose any of these endpoints to untrusted callers (or to agents that can be prompt-injected), add URL allowlisting, request-body filtering, and regex sanitization at the boundary.

**Trend 4 — Silent-wrong-answer bugs are the most dangerous class.**
llama.cpp's Vulkan KHR_coopmat nondeterminism (#31560), CUDA Q4_1/Q5_1 fp16 overflow (#30950), and Unsloth's cuda13-portable CPU fallback (#19341) all fail *without crashing*. **Watch:** smoke tests won't catch these. Add output-validation and backend-assertion checks to CI if you promote builds across heterogeneous hardware.

**Trend 5 — Quantization kernel generations are turning over.**
vLLM's Marlin→Humming transition (#65560) and llama.cpp's native quantized-KV flash attention (#31234, #30792) both signal that the SM80-era kernel playbook is being retired. **Watch:** if you've tuned for Marlin-era performance, re-benchmark; the new kernels cover more formats (MXFP4/6/8, NVFP4) with Hopper/Blackwell-specific paths.

**Trend 6 — Stability releases are becoming a product feature.**
SGLang 1.0 (#50045) explicitly converts silent config coercions into hard errors; LiteLLM's `lts` tag now floats to the newest LTS patch; Ollama's 0.40.17→0.40.18 churn shows the cost of *not* having a stability contract. **Watch:** for production, pin to LTS-style tags (LiteLLM `lts`, SGLang 1.x, vLLM tagged releases) rather than `main`/nightly.

**Trend 7 — MCP is becoming the agent-tool transport, and it's fragile.**
llama.cpp added multimodal MCP tool results (#32064); LiteLLM's MCP `tools/list` regression (#50065) breaks interactive clients; Unsloth's `/mcp` endpoint returns 404 (#19383). **Watch:** MCP is consolidating as the tool-calling substrate, but its implementations are uneven — validate tool-call arguments at your boundary rather than trusting the renderer round-trip.

**Trend 8 — Heterogeneous hardware validation is the new quality bar.**
Inkling 2 landed with bugs on ROCm (#19275), Intel XPU (#19239), Windows Strix Halo (#18805), and Windows regex (#19376) — all within 24h. vLLM has a vendor-verifier RFC (#66699) citing customer complaints about AMD quality. **Watch:** "supports model X" is no longer a binary; test on your exact backend combination before upgrading.

---

### Bottom Line for Decision-Makers

| If you are… | Act on… |
|---|---|
| **Running production serving** | Pin to LTS/tagged releases; verify vLLM #69137 (KV scheduler) and SGLang security fixes before upgrading. |
| **Building agent frameworks** | Track vLLM's agentic-cache RFCs and prefix-cache routing (#65502); adopt MCP multimodal payloads (llama.cpp b12708). |
| **Operating a gateway** | Audit LiteLLM rate-limit fairness (#21312), spend-counter bugs (#47062), and MCP latency (#50065); consider the Rust gateway rewrite trajectory. |
| **Deploying on edge/consumer HW** | llama.cpp's ARMv8.0/SVE kernels and Ollama's Vulkan-by-default (#19568) expand the addressable fleet — but validate against silent-wrong-answer bugs. |
| **Fine-tuning for deployment** | Unsloth's distributed backend (#19378) is the headline; wait for export fixes (#19337, #19325) before shipping Inkling 2 merged models. |

---

## Per-Project Reports

<details>
<summary><strong>vLLM</strong> — <a href="https://github.com/vllm-project/vllm">vllm-project/vllm</a></summary>

# vLLM Digest — 2026-11-25

## 1. Today's Highlights

No releases landed in the last 24h, but issue and PR activity remains dense around three themes: the **Marlin→Humming quantization kernel transition** (#65560), **KV cache offloading and agentic cache policy** (#66782, #57103, #53421), and **MoE/DeepSeek-V4.1 performance work across B300 and ROCm gfx950**. A notable correctness-adjacent tracker (#69137) surfaced a scheduler bug that frees KV-transfer blocks unconditionally on completion, with a reproducible assert crash against LMCacheMPConnector. On the ROCm side, quality-control pressure is mounting, with a vendor-verifier regression-testing RFC (#66699) citing customer complaints about AMD software quality.

## 2. Releases & Breaking Changes

No new releases or documented breaking changes in the last 24h. Two items worth flagging as future migration surface:

- **RFC #68711** proposes a unified `--lm-head-config` flag replacing the separate `draft_lm_head_quantization` and `quantization_config.target_lm_head` knobs, with per-architecture `auto` defaults. If accepted, existing speculative-decoding configs will need migration. (vllm-project/vllm#68711)
- **Tracking #67937** continues retiring native Llama/Qwen2 model implementations in favor of the Transformers modeling backend. No API change yet, but loader behavior for derived checkpoints will shift. (vllm-project/vllm#67937)

## 3. New Model & Hardware Support

- **Inkling 2 on Intel XPU** — RFC #69712 lays out a shared `inkling2/common/` implementation and PR series targeting Arc Pro B60/B70 (Battlemage), including `Inkling2LoopForConditionalGeneration` (#69028). (vllm-project/vllm#69712)
- **OmniLingual ASR (1600+ languages)** — long-running new-model issue #28509 closed; least-cost path was the Transformers backend via Voxtral-like plumbing. (vllm-project/vllm#28509)
- **DeepSeek-V4.1 mono decode on MI350P (gfx950)** — #63340 requests enabling the one-CTA-per-CU decode kernels on 128-CU MI350P via k-pass task decomposition. (vllm-project/vllm#63340)
- **MoNE checkpoints** — PR #68147 adds llm-compressor MoNE support (experts replaced by learned constant "novices"), storing and executing only retained expert MLPs. (vllm-project/vllm#68147)
- **GLM 5.3** — #57406 tracks further optimizations on the `glm_moe_dsa` base shared with GLM-5.2. (vllm-project/vllm#57406)

## 4. Performance & Optimization

- **Marlin → Humming (NVIDIA)** — #65560 tracks replacing the SM80-era Marlin kernels with Humming, which now covers INT4/INT8 GPTQ/AWQ, FP8, MXFP8, MXFP4, NVFP4, MXFP6 and INT8/FP8 activations for dense and MoE layers, with Hopper/Blackwell-specific paths. (vllm-project/vllm#65560)
- **DeepSeek-V4.1-Flash on B300** — PR #68366 adds DEP2/4/8-specialized fused EP communication: routing writes directly into dispatch buffers, expert finalize publishes to the request owner, and one owner kernel fuses reduction, shared-expert output and mHC. (vllm-project/vllm#68366)
- **ShardQ for sparse MLA prefill on SM90** — PRs #69086 (FlashInfer NoPE sparse MLA) and #69125 (native FA3 `FLASH_ATTN_MLA_SPARSE`) extend the #63956 token-split path so TP8 ranks no longer redundantly score identical long-prefill rows on GLM-5.3-Flash. (vllm-project/vllm#69086, vllm-project/vllm#69125)
- **ROCm gfx950 DSv4 top-k** — PR #65742 enables the single-launch Triton `dsv4_topk` on ROCm by relaxing the `is_cuda()` gate. (vllm-project/vllm#65742)
- **HY4 Flash MQA logits** — PR #68364 wires native 16-head DeepGEMM MQA logits (upstream DeepGEMM PR #65). (vllm-project/vllm#68364)
- **PCIe all-gather for TP** — #65359 proposes wiring FlashInfer's `PcieIpcAllGatherWorkspace` into `CudaCommunicator.all_gather` for latency-bound small gathers (DeepSeek-V4.1-Flash Engram tables, compressor, drafter). (vllm-project/vllm#65359)
- **KV load reporting** — PR #63936 reports completed KV loads ahead of the next model output (opt-in `enable_early_recv` for NIXL/Mooncake) to unblock waiting requests sooner. (vllm-project/vllm#63936)

## 5. Stability & Regressions

Ranked by severity:

1. **KV-transfer scheduler frees blocks unconditionally** — #69137: `Scheduler._update_from_kv_xfer_finished` frees the transfer block set for both directions with no per-direction accounting or in-flight cancellation after abort; assert crash reproduced with LMCacheMPConnector. **No fix PR linked yet.** (vllm-project/vllm#69137)
2. **ModelOpt NVFP4 on SM120** — #52540: dies or wedges under sustained load with CUDA graphs on RTX PRO 6000 Blackwell; issue explicitly says it's not the GEMM backend. Still open since August. (vllm-project/vllm#52540)
3. **DFlash acceptance collapse at TP>1** — #66387: MiMo-V2.6-Flash-MOPD drafter degrades with tensor parallelism > 1 (TP1 fine) on vLLM v0.33.0 and nightly. (vllm-project/vllm#66387)
4. **ROCm/gfx942 GLM-5.2-FP8 cold-replay corruption** — #52150: first request after GPU idle emits garbage; piecewise CUDA graph cold replay corrupts the request's own prefill. Workaround: `cudagraph_mode=FULL_DECODE_ONLY`. (vllm-project/vllm#52150)
5. **Structured output garble** — #38696: Qwen3.5 with `response_format: json_schema` emits garbled spaces in tool-choice mode. (vllm-project/vllm#38696)
6. **MNNVL allreduce hang/leak** — #51986 closed after hanging 30s and leaking GPU memory on IB-only multi-node. (vllm-project/vllm#51986)
7. **Parser fixes in flight** — PR #55199 preserves text after tool calls in non-streaming responses; PR #69798 guards non-dict tool `properties` from crashing qwen3_xml/k2_horizon parsers. (vllm-project/vllm#55199, vllm-project/vllm#69798)

## 6. What This Means for Application Developers

- **Agentic cache control is coming.** Multiple parallel RFCs (#57103, #53421, #37003, #52113) converge on provider-neutral, session-aware KV retention — pinning, promotion at load time, and hint envelopes. If you're building agent frameworks today, track these: the API shape will affect how you signal "this branch resumes soon" to the engine.
- **Prefix-cache-aware routing gets safer.** #65502 proposes first-class trusted forwarded prompt token IDs on chat/Messages/Responses routes, so gateways that render and tokenize at ingress won't be re-tokenized differently in the worker — a real correctness issue for prefix-cache hit rates behind routers.
- **Expect loader churn if you serve Llama/Qwen2 derivatives.** #67937's retirement of native models in favor of the Transformers backend may change edge-case behavior for derived checkpoints; test before upgrading.
- **Quantization config is consolidating.** Once #68711 lands, speculative-decoding setups using `draft_lm_head_quantization` will want to move to `--lm-head-config: auto`.
- **If you use KV connectors with aborts, be careful.** Until #69137 is fixed, request cancellation with in-flight LMCache/NIXL transfers can free blocks still in use and crash the scheduler — this is the highest-priority item to verify against your workload this week.

</details>

<details>
<summary><strong>SGLang</strong> — <a href="https://github.com/sgl-project/sglang">sgl-project/sglang</a></summary>

# SGLang Digest — 2026-11-25

## 1. Today's Highlights

No releases landed in the last 24h, but roadmap activity is heavy: the **SGLang 1.0 Release Tracker** (#50045) continues to define a hardening/stability contract with breaking upgrade notes from 0.5.x, and the **Q4 Prefill-Decode Disaggregation Roadmap** (#43699) confirms PD disaggregation is now the default large-scale deployment mode. On the engineering side, the day's most substantive work is security and robustness hardening around multimodal endpoints (SSRF, decompression bombs, profiling bypass) plus a batch of AMD/NPU performance PRs.

## 2. Releases & Breaking Changes

- **No new releases in the last 24h.**
- **[roadmap] SGLang 1.0 Release Tracker #50045** — Explicitly a stability release: replaces silent configuration changes with hard errors that name the offending setting, and introduces a 1.x compatibility policy. **Upgrading from 0.5.x may require changes**; see the linked upgrade notes. This is the key item to track if you pin versions.
- Related config-validation work in flight: **#52483** `--max-running-requests 0` (or negative) is currently silently clamped to 1 rather than rejected — consistent with the 1.0 goal of surfacing invalid config as errors.

## 3. New Model & Hardware Support

- **[Feat] DFly speculative decoding for Hunyuan-4-Flash #51938** — Adds the block speculative decoder bundled in the Hy4-Flash checkpoint (`model.dfly_layers.*`), stacked on the merged vision-language PR #51937.
- **[Feat] [MLU] tensor IPC support for weight updates #48653** — Extends the weight-update path to Cambricon MLU.
- **[Feat] [AMD] diffusion: aiter TDM GEMM for BF16/FP16 linears on gfx1250 #51155** — Reaches aiter's tuned TDM GEMM for FLUX.2 shapes on RDNA-class gfx1250, where hipBLASLt BF16 kernels are absent.
- **[Perf] gemma4: enable breakable prefill CUDA graph for multimodal Gemma 4 #52404** — Turns on the multimodal breakable prefill graph path for Gemma 4 (previously defaulted off after #46663).
- **[Test] [NPU] rl phase 2 consistency suites #50295** — Ascend attention-path parity, routed-expert readback, and batch-invariant deterministic inference coverage.

## 4. Performance & Optimization

- **[Perf] [AMD] GLM-5.3-Flash: fewer DSA k-pool indexer launches in MTP verify #44417** — At concurrency 1 on MI355X, the DSA k-pool indexer across 11 sparse-attention layers costs more in small launches (~3 GEMMs plus per-layer index/arange/copy metadata rebuilds) than in math; PR cuts launch overhead.
- **[Perf] hunyuan_v4_flash: fuse IndexPool target-verify cache update into one kernel #52692** — Collapses ~30 kernel launches (~82 µs) per DSA layer into a single kernel during DFly target verify.
- **[Perf] model_loader: stage checkpoint tensors on GPU for TP loads #52998** — Avoids per-tensor CPU `narrow`/`contiguous`/page-fault work on memory-mapped safetensors before pageable H2D copies; targets large MoE tensor-parallel loads.
- **[Docs] [NPU] `SGLANG_SCHEDULER_DECREASE_PREFILL_IDLE` / `SGLANG_PREFILL_DELAYER_MAX_DELAY_PASSES` #50447** — Reportedly yields ~30% TPOT reduction on 128K prefix-cache workloads; currently undocumented.
- **[Feat] speculative: `SGLANG_SIMULATE_ACC_LEN` in DFly #52689** — Enables fixed acceptance-length benchmarking for DFly, matching DFlash/DSpark/EAGLE.
- **[Feat] bench: token-ids dataset in sglang-bench #52569** — Replay pre-tokenized production traces offline (same model/template) instead of server-side tokenization.
- **[Fix] mamba: 64-bit chunk offsets in packed prefill #51285** — Fixes incorrect final state for long Mamba2 packed-prefill batches (issue #51109).

## 5. Stability & Regressions

Ranked by severity:

- **Security — SSRF via `/v1/videos` media URLs #51738 (fix PR, open).** `POST /v1/videos` accepted unauthenticated user-controlled media URLs with no private-IP filtering or redirect validation.
- **Security — `diffusers_kwargs` bypass of validated request fields #52617 (fix PR, open).** Free-form dict on `/v1/videos` and `/v1/images/generations` can override validated top-level fields.
- **Security — per-request torch profiling gate #52370 (fix PR, open; fixes #52353).** Any caller could set `"profile": true` in the request body to force worker-side profiling.
- **Correctness — `stop_regex` MemoryError kills scheduler #52041 (open, no fix PR visible).** A 24-byte pattern passes validation but raises MemoryError that escapes the safety net and takes down the scheduler. Reported via LLM-driven security audit (Nankai AOSP Lab); treat as DoS-class.
- **Correctness — AMD gfx12 HIP custom all-reduce wrong, rank-divergent sums over PCIe #49657 (open).** 1-stage all-reduce on 2× R9700 returns incorrect results; relaxed start-flag code at `custom_all_reduce_hip.cuh` lines 169+ unchanged on `main`.
- **Correctness — Mamba2 packed prefill wrong final state #51285 (fix PR, open).** Long batches + cached initial states; also affects scan output.
- **Correctness — DeepSeekV3Detector streaming drops first tool call #43523 (closed)** when two complete calls arrive in one increment; related #42137 greedy name regex misattaches arguments.
- **Correctness — prefill input logprobs served from wrong request #36938 (closed)** when a batch member is retracted/finished (`logprob_pt` not advanced).
- **Reliability — HiCache + hybrid SSM/Mamba `cudaHostRegister` failure aborts instance #40926 (closed, inactive).** Secondary host pool registration kills the whole instance; error path also throws TypeError masking the real rc.
- **CI health — flaky/test infra tracking: #42752 (233 comments), #17050 (3 broken, 23 flaky, 925 recently fixed as of 2026-11-25 03:42 UTC), #45847 [AMD], #26340 CUDA coredump tracker (388 comments).** CI Maintenance Mode (#21065) remains the project's lever when the pipeline is unhealthy.

## 6. What This Means for Application Developers

- **Pin and read upgrade notes before 1.0.** SGLang 1.0 is a stability release; silent config coercions (e.g., `--max-running-requests 0` → 1) become explicit errors. Validate your launch configs now.
- **Harden any multimodal gateway you expose.** Three open security fixes touch `/v1/videos` and `/v1/images/generations` (SSRF, kwargs bypass, profiling opt-in). Until merged, put URL allowlisting and request-body filtering in front of these endpoints.
- **Treat `stop_regex` patterns as untrusted input (#52041)** — a small crafted pattern can take down the scheduler, so isolate or sanitize regexes originating from users/agents.
- **Tool-calling streaming had subtle bugs (#43523, #42137)** — if you depend on streaming tool calls with DeepSeek/Qwen-style detectors, verify against your parser version; both are closed but check your pinned revision.
- **Small-node DeepSeek-V4-Flash tuning (#37348)** remains an open question: ~40% per-stream decode deficit at conc=32 on 4×H800 TP4/no-EP, with dp-attention regression and TBO gated — benchmark before standardizing on this topology.
- **PD disaggregation is now the default scale-out mode (#43699)**; if you operate multi-node serving, follow the Q4 roadmap for HiCache, speculative decoding, and parallel-strategy interactions rather than treating disaggregation as experimental.

</details>

<details>
<summary><strong>llama.cpp</strong> — <a href="https://github.com/ggml-org/llama.cpp">ggml-org/llama.cpp</a></summary>

# llama.cpp Digest — 2026-11-25

## 1. Today's Highlights

A heavy CPU-kernel day: the project landed optimized repack kernels for ARMv8.0 64-bit targets *without* dotprod (Q4_0/Q8_0) and SVE-optimized Q5_0/Q5_1 dot-product kernels, extending usable quantization performance to older/cheaper ARM hardware. On the server side, MCP tool results can now carry image and audio data, and a long-standing prompt-cache lookup bug in the slot scheduler was fixed. CUDA work continues to dominate the PR queue, with fused RMS_NORM+MUL+RoPE tuning and native quantized-KV flash-attention kernels both in flight.

## 2. Releases & Breaking Changes

Builds b12683 through b12711 landed in the last 24h. No API or config breaking changes are noted in this window.

- **b12711** — ggml-cpu: repack kernels for targets without dotprod (ARMv8.0 64-bit) for Q4_0/Q8_0, explicitly excluding Apple arch — https://github.com/ggml-org/llama.cpp/pull/32142
- **b12709** — ggml-cpu: SVE-optimized q5_0 and q5_1 dot-product kernels — https://github.com/ggml-org/llama.cpp/pull/30867
- **b12708** — server: include MCP image and audio data in tool results — https://github.com/ggml-org/llama.cpp/pull/32064
- **b12707** — context: prevent excessive CPU polling without OpenMP (relevant on Metal / non-OpenMP builds) — https://github.com/ggml-org/llama.cpp/pull/32378
- **b12706** — metal: reserve top-k scratch only for short rows (radix path for ncols > 128) — https://github.com/ggml-org/llama.cpp/pull/32942
- **b12704** — vulkan: chunked GDN replay support — https://github.com/ggml-org/llama.cpp/pull/32721
- **b12703** — cuda: fuse RMS_NORM + MUL + MROPE/IMROPE with block-size tuning — https://github.com/ggml-org/llama.cpp/pull/32500
- **b12701** — model: Inkling 2 Mini `mix()` weighted sum reordered (scores as src0) — https://github.com/ggml-org/llama.cpp/pull/32855
- **b12686** — server: fix skipped prompt cache lookups; lookup moved into slot scheduler — https://github.com/ggml-org/llama.cpp/pull/28992
- **b12683** — rpc: reuse one context for request tensors on the server — https://github.com/ggml-org/llama.cpp/pull/32896

## 3. New Model & Hardware Support

- **ARMv8.0 without dotprod** — Q4_0/Q8_0 repack kernels now cover baseline 64-bit ARM (non-Apple) — https://github.com/ggml-org/llama.cpp/pull/32142
- **ARM SVE** — Q5_0/Q5_1 dot products now have SVE paths — https://github.com/ggml-org/llama.cpp/pull/30867
- **Vulkan** — chunked GDN (gated delta net) replay in shaders; supports hybrid GDN+attention models on Vulkan — https://github.com/ggml-org/llama.cpp/pull/32721
- **RDNA (AMD)** — maskless (non-causal) attention on the MMA FA kernel for vision encoders; PR open — https://github.com/ggml-org/llama.cpp/pull/32930
- **Hexagon** — ggml-hexagon 2.0 adds int-HMX (w8a8/w8a16), automatic f32→f16 lowering, generic DMA pipelines; PR open — https://github.com/ggml-org/llama.cpp/pull/32582
- **MiniCPM-V 4.7** — image separator position fix (bounding boxes were offset) — https://github.com/ggml-org/llama.cpp/pull/32995
- **Qwen3-Omni mmproj** conversion currently fails on `model.visual.blocks.0.attn.proj.bias` — https://github.com/ggml-org/llama.cpp/issues/32933

## 4. Performance & Optimization

**Landed:**
- **Metal top-k** — radix path for ncols > 128; bitonic only wins ≤128 columns (measured on M5 and M2 Ultra) — https://github.com/ggml-org/llama.cpp/pull/32942
- **CUDA RMS_NORM+MUL+MROPE fusion** — 64 threads for multi-token ncols ≤ 256 — https://github.com/ggml-org/llama.cpp/pull/32500
- **Inkling 2 Mini `mix()`** — avoids rebuilding the full block-output stack per call; bit-identical results — https://github.com/ggml-org/llama.cpp/pull/32948
- **RPC server** — single reused context for request tensors — https://github.com/ggml-org/llama.cpp/pull/32896

**In flight:**
- **CUDA MMQ stream-k** — walk column tiles outermost to improve DRAM reuse — https://github.com/ggml-org/llama.cpp/pull/32921
- **CUDA/HIP native q4_0/q8_0 KV in `flash_attn_tile`** — dequantize in tile load — https://github.com/ggml-org/llama.cpp/pull/31234
- **CUDA native q8_0 KV (and f16 K / q8_0 V)** in flash-attn tile — https://github.com/ggml-org/llama.cpp/pull/30792
- **SYCL NVFP4 MoE matmuls** — remove per-scale `sycl::pow()` in decode, replace table lookup in dot product — https://github.com/ggml-org/llama.cpp/pull/32981
- **Vulkan IQ1/IQ2/IQ3** — move grid tables to storage buffer to avoid LDC divergence — https://github.com/ggml-org/llama.cpp/pull/32915
- **Query chunking** for glm5-next, kimi-k31, deepseek41, qwen4exp (benchmarks on qwen4exp show 1258 t/s prefill, 35.5 t/s decode, 83.5% decode cache hit at 256k) — https://github.com/ggml-org/llama.cpp/pull/32884

## 5. Stability & Regressions

Ranked by severity:

1. **Vulkan KHR_coopmat nondeterministic wrong results** on Intel Arc Pro B70 (BMG G31, Mesa 26.2.5) with F16/Q8_0 encoder models — silent correctness failure, not a crash. https://github.com/ggml-org/llama.cpp/issues/31560
2. **CUDA/HIP flash attention garbage output at long context** on gfx1201 (RDNA4) with head_dim 256 — immediate EOS, corrupted prefill logits. https://github.com/ggml-org/llama.cpp/issues/30884
3. **CUDA Q4_1/Q5_1 mat-vec fp16 overflow** in block-offset × Q8_1 block-sum path — NaN logits, garbage output (gpt-oss). https://github.com/ggml-org/llama.cpp/issues/30950
4. **SYCL RMS_NORM launch failure** (`UR_RESULT_ERROR_UNSUPPORTED_FEATURE`) on Arc Pro B60. https://github.com/ggml-org/llama.cpp/issues/30301
5. **V100 (sm_70) prefill regression in 1.0** for hybrid GDN models — Volta FATTN config halves nbatch_V2 vs 0.4.1; slowdown grows with context. https://github.com/ggml-org/llama.cpp/issues/32810
6. **Speculative decoding regression on Qwen3.5 GDN hybrid (CUDA)** — draft-model spec decode 2.2–2.4× *slower*; non-hybrid control only 10–18% loss. https://github.com/ggml-org/llama.cpp/issues/32776
7. **`/v1/completions` logprobs nondeterministic across identical requests** on SYCL + MoE; request seed does not pin the distribution. https://github.com/ggml-org/llama.cpp/issues/31206
8. **CUDA `ADD_ID` fails above 65535 tokens** (`invalid configuration argument`). https://github.com/ggml-org/llama.cpp/issues/32444
9. **CUDA illegal memory access** with FA on Windows (Gemma 4 12B QAT Q4_0 + mmproj, RTX 4080 Super); `-fa off` works. https://github.com/ggml-org/llama.cpp/issues/30436
10. **Tensor-parallel + `RESHAPE` assert** (`src_ss[0].axis != GGML_BACKEND_SPLIT_AXIS_0`) — **fix PR open** (#32983) allowing single-device data assignment for degenerate cases like single attention head. https://github.com/ggml-org/llama.cpp/issues/24015 · https://github.com/ggml-org/llama.cpp/pull/32983
11. **Vulkan deep-context decode collapse ~8×** on Intel Arc Pro B70 (Xe2) from 1k→64k tokens; SYCL only degrades ~2.4×. https://github.com/ggml-org/llama.cpp/issues/28721
12. **Prompt restore race with unified KV cache** — server restores cached prompt before idle slots cleared. https://github.com/ggml-org/llama.cpp/issues/30961
13. **MCP/gpt-oss peg-native parse failure** deterministic on tool-continuation prompts; passes if any message is appended. https://github.com/ggml-org/llama.cpp/issues/32964
14. **Web UI unresponsive** (`effect_update_depth_exceeded`) when Chrome default font ≥ 24. https://github.com/ggml-org/llama.cpp/issues/32361
15. **CUDA `mul_mat` not batch-invariant for IQ quants at n=5,8** on SM120 — relevant to spec decoding. https://github.com/ggml-org/llama.cpp/issues/28111
16. **Qwen3.8 27B conversion drops tensors** (770 vs expected 866); regression vs b12600. https://github.com/ggml-org/llama.cpp/issues/32918

Note: several closed issues were stale-cleaned (`#29022`, `#30091`, `#27532`, `#27072`, `#23567`, `#29947`, `#30024`, `#27763`, `#30052`, `#30256`, `#29951`).

## 6. What This Means for Application Developers

- **MCP tool results now carry multimodal payloads** (b12708). If you're building agent frameworks that route images/audio through MCP tools, you no longer need side channels to ferry binary content. https://github.com/ggml-org/llama.cpp/pull/32064
- **Prompt caching is more reliable** (b12686) — the slot scheduler now owns the cache lookup decision, which should reduce silent cache misses in high-concurrency serving. This directly affects TTFT under load. https://github.com/ggml-org/llama.cpp/pull/28992
- **Cheap ARM boxes are back in play.** The non-dotprod repack kernels plus SVE Q5 paths mean Q4_0/Q8_0 and Q5_0/Q5_1 inference is viable on Raspberry Pi-class and older Graviton/Ampere parts. If you were gating model choice on ARM CPU throughput, re-benchmark. https://github.com/ggml-org/llama.cpp/pull/32142 · https://github.com/ggml-org/llama.cpp/pull/30867
- **Watch the correctness bug cluster** if you serve on Arc (Vulkan KHR_coopmat, SYCL RMS_NORM) or RDNA4 with head_dim 256. These are silent-wrong-answer failures, not crashes — hard to catch in smoke tests. Validate outputs on your target backend before promoting a build.
- **Speculative decoding on hybrid GDN models (Qwen3.5) is currently a net loss on CUDA** (issue #32776). If you rely on draft-model spec decode, gate it per-architecture rather than enabling globally.
- **V100 users on hybrid attention models** should pin to 0.4.1 or await a Volta FATTN config fix; 1.0 prefill throughput regresses materially with context length. https://github.com/ggml-org/llama.cpp/issues/32810
- **Logprobs consumers** (rerankers, classifiers, structured-output scorers) on SYCL+MoE should not assume determinism or seed-pinned distributions — cache results or route to CUDA/CPU. https://github.com/ggml-org/llama.cpp/issues/31206
- **TP users** blocked by the `RESHAPE` assert now have an open fix (#32983); if you run tensor parallelism with degenerate head counts, track that PR.

</details>

<details>
<summary><strong>Ollama</strong> — <a href="https://github.com/ollama/ollama">ollama/ollama</a></summary>

# Ollama Digest — 2026-11-25

## 1. Today's Highlights

Ollama shipped **v0.40.18** with MLX/Metal kernel work and a llama.cpp bump, but the release window is dominated by instability: a **major MLX performance regression on macOS (0.40.17)** and **unbounded MLX runner memory growth** (23 GB → 70 GB in 13 minutes on a 64 GB Mac) are both actively being reported. The new **Inkling-2** architecture is generating a cluster of load failures (OOM on DGX Spark, tensor-dim mismatch on looped transformers), while parallel PR activity is targeting VRAM accounting, streaming goroutine leaks, and Cohere/Olmo3 parser correctness.

---

## 2. Releases & Breaking Changes

**v0.40.18** (within 24h)
- `mlx: fuse Inkling residual mixing on Metal` — [PR #19808](https://github.com/ollama/ollama/pull/19808)
- `mlxrunner: share tensor helpers and model setup across architectures` — [PR #19805](https://github.com/ollama/ollama/pull/19805)
- `llama.cpp: version bump b12651 + remove ...` (notes truncated in source data)

No API/schema changes or deprecations in this release. However, note **v0.40.17 introduced a reported performance regression** — users on 0.40.17 should evaluate upgrading to 0.40.18 or pinning an earlier release (see §5).

---

## 3. New Model & Hardware Support

- **Inkling-2 / Inkling-2-Mini (thinkingmachines)** — new architecture support in flight. Multiple issues and PRs:
  - `inkling2` load failure on looped-transformer models: `check_tensor_dims: tensor 'blk.24.attn_q.weight' not found` — [Issue #19888](https://github.com/ollama/ollama/issues/19888). 18 physical blocks vs. the 25 sequential assumed by the loader.
  - Follow-up perf PR: "inkling2: faster short histories, draft proposals and conv snapshots" — histories under 1024 keys now use Metal split-attention kernels (previously FP32 wide-history + dense per-query mask) — [PR #19881](https://github.com/ollama/ollama/pull/19881)
- **Intel iGPU (Vulkan)** — enabling Vulkan-by-default out-of-box for Ultra Series 1+ (MTL+), Windows driver 32.0.101.9150+, 16 GB+ RAM, iGPU-only systems — [PR #19568](https://github.com/ollama/ollama/pull/19568)
- **OLMo3 / Gemma 4 / Cohere** — renderer/parser fixes rather than new model bring-up (see §5).
- Hardware visibility: two overlapping feature requests to expose compute devices via API (GPU/CPU, total/available memory) — [Issue #3822](https://github.com/ollama/ollama/issues/3822), [Issue #19880 (CLOSED)](https://github.com/ollama/ollama/issues/19880)

---

## 4. Performance & Optimization

| Area | Change | Ref |
|---|---|---|
| Inkling-2 short-context | Metal split-attention kernels for histories <1024 keys, replacing FP32-wide dense masks; negotiated matches MLX one-pass reduction to rounding | [PR #19881](https://github.com/ollama/ollama/pull/19881) |
| Embedding endpoint | Media markers now placed positionally where the prompt names them (was all appended after text) | [PR #19882](https://github.com/ollama/ollama/pull/19882) |
| Image marker construction | Reported O(N²) string ops — a single 192 KB request with 64,000 empty images holds the server for ~1 CPU-minute | [Issue #19885](https://github.com/ollama/ollama/issues/19885) — no fix PR |
| VRAM accounting / GPU split | Fixes for incorrect model eviction, refusal to load, and unnecessary multi-GPU spread (addresses #19463, #18679, #18349, #16599) | [PR #19632](https://github.com/ollama/ollama/pull/19632) — OPEN |
| OpenAI-compatible SSE | Explicit flush through completion so Chatbox/OpenWebUI don't appear to hang | [PR #17027](https://github.com/ollama/ollama/pull/17027) — OPEN |

Benchmark note (not a code change): independent Qwen3.8 Flash-Next / Hermes Agent study on DGX Spark (75 runs, Ollama 0.32.1 vs Strata) — [Issue #19887](https://github.com/ollama/ollama/issues/19887)

---

## 5. Stability & Regressions (ranked)

**Critical — unresponsive / data-loss adjacent**
1. **Inkling-2-mini OOMs and hard-locks DGX Spark** requiring power-cycle. *CLOSED* — [Issue #19879](https://github.com/ollama/ollama/issues/19879)
2. **MLX runner unbounded memory growth on macOS** — 64 GB M4 Mac, 23 GB → 70 GB RSS, swap 4.6 GB → 37 GB in 13 minutes; all subsequent requests 2–3× slower. 0.40.17. No fix PR yet — [Issue #19886](https://github.com/ollama/ollama/issues/19886)

**High — user-visible regression / crash**
3. **0.40.17 major performance regression on macOS M4 Pro (MLX Qwen 3.8 27b)** — [Issue #19866](https://github.com/ollama/ollama/issues/19866)
4. **Inkling-2 model load failure (tensor dim mismatch)** — HTTP 500 on import — [Issue #19888](https://github.com/ollama/ollama/issues/19888). No fix PR.
5. **Template panic in legacy `{{if}}{{.Response}}{{end}}`** — Gin recovers → empty HTTP 500 for otherwise-valid templates — [Issue #19859](https://github.com/ollama/ollama/issues/19859)

**Medium — resource leaks / correctness**
6. **Post-0.40.17 MLX history growth** (same root as #2, tracked separately in the issue title) — see [Issue #19886](https://github.com/ollama/ollama/issues/19886)
7. **Streaming handlers leak goroutines and runner semaphore slots on client disconnect** — `GenerateHandler`, `ChatHandler`, `PushHandler` use unbuffered `ch <- v`; fix PR exists — [Issue #17131](https://github.com/ollama/ollama/issues/17131) / [PR #17881](https://github.com/ollama/ollama/pull/17881)
8. **Olmo3 tool-call args emit literal `\u003c` instead of `<`** — `unescapeString` missing `\uXXXX` decoding; fix in flight — [Issue #19877](https://github.com/ollama/ollama/issues/19877) / [PR #19878](https://github.com/ollama/ollama/pull/19878)
9. **Gemma 4 single-quoted list args in tool calls** — parser repair PR — [PR #19890](https://github.com/ollama/ollama/pull/19890)
10. **Cohere parser: buffered thinking never flushed on stream end** — [PR #19875](https://github.com/ollama/ollama/pull/19875); tool-call ID mismatch when IDs empty/repeated — [PR #19874](https://github.com/ollama/ollama/pull/19874)

**Low — UX**
11. **VRAM shown by `ollama ps` disagrees with rocm-smi** on MTP-accelerator models — [Issue #17251](https://github.com/ollama/ollama/issues/17251)
12. **"Restart Claude Desktop" toggle in Ollama Apps silently reverts, no gateway config written** — [Issue #18188](https://github.com/ollama/ollama/issues/18188)
13. **Windows does not prevent sleep during long inference** — [Issue #4072](https://github.com/ollama/ollama/issues/4072)
14. **Desktop chat stream goes silent on long prompt-eval; no error surfaced on HTTP failures** — heartbeat fix in review — [PR #19331](https://github.com/ollama/ollama/pull/19331)

---

## 6. What This Means for Application Developers

- **Pin versions if you're on macOS MLX.** 0.40.17 has both a perf regression (#19866) and a memory-growth bug (#19886) that will OOM a 64 GB machine under sustained multi-conversation load. If you serve agent workloads on Mac hardware, cap `OLLAMA_MAX_LOADED_MODELS`/`OLLAMA_KEEP_ALIVE` conservatively, or roll back until the MLX runner fix lands.
- **Client disconnects currently leak server resources.** If your agent framework cancels requests (timeouts, user aborts, streaming partials), expect goroutine and semaphore slot accumulation until [PR #17881](https://github.com/ollama/ollama/pull/17881) merges. This is a silent scaling ceiling for long-running gateways.
- **Tool-calling is where the correctness patches are.** Olmo3 `<` escaping (#19877), Gemma 4 quote-style args (#19890) and Cohere empty/repeated tool-call IDs (#19874) are all active fixes. If you route tool calls through an Ollama gateway, validate arguments at the boundary rather than trusting the renderer round-trip.
- **Don't send large image-laden prompts yet.** The O(N²) marker bug (#19885) can pin a server core for a full minute on a modest payload — a cheap denial-of-service vector inside your own VPC. Cap image counts per request.
- **VRAM planning is getting better, not worse.** [PR #19632](https://github.com/ollama/ollama/pull/19632) addresses the long tail of incorrect eviction and unnecessary multi-GPU splits, which historically caused "model refuses to load" flakiness in CI/serving.
- **Watch for `OLLAMA_NO_THINK`** ([PR #17739](https://github.com/ollama/ollama/pull/17739)) — a global env switch that forces `Think=false` on all chat/generate requests. Useful as a fleet-wide safety valve for models that over-elaborate under agent loops.

</details>

<details>
<summary><strong>LiteLLM</strong> — <a href="https://github.com/BerriAI/litellm">BerriAI/litellm</a></summary>

# LiteLLM Digest — 2026-11-25

## 1. Today's Highlights

LiteLLM shipped a rapid-fire release cadence today, with **v1.111.0** and **v1.112.0-rc.1** landing alongside LTS patches on the 1.108.x line and a wave of backports targeting **v1.109.4/1.109.5** and **v1.110.3/1.110.4**. The dominant engineering theme is the **Rust gateway ("gateway-inference") rewrite**, with a stack of PRs from `narmstrong-berri` (#53982, #53984, #53988, #53998, #54329) building out call records, response header rendering, per-attempt accounting, and Messages-route pricing. Meanwhile, a high-visibility open bug (MCP `tools/list` latency regression in v1.108.0) and a cluster of Z.AI/Bedrock parameter-handling fixes are shaping the day's support load.

## 2. Releases & Breaking Changes

- **v1.112.0-rc.1** — release candidate; all images cosign-verified via the project-releaser workflow. [Release](https://github.com/BerriAI/litellm/releases)
- **v1.111.0** — stable release. [Release](https://github.com/BerriAI/litellm/releases)
- **v1.110.4 / v1.110.3** — patch series on the 1.110 line. [Release](https://github.com/BerriAI/litellm/releases)
- **v1.109.5 / v1.109.4** — patch series on the 1.109 line. [Release](https://github.com/BerriAI/litellm/releases)
- **v1.108.17 (LTS)** — latest LTS patch; the `lts` image tag now tracks the newest LTS patch, so `ghcr.io/berriai/litellm:lts` is the recommended production pin. [Release](https://github.com/BerriAI/litellm/releases)
- **⚠️ Breaking change (open PR #54169):** Bedrock guardrail API now rejects a Bedrock/Presidio-style request where it previously tolerated it, and blocked tool calls are logged as "intervened" rather than passed through. Review before upgrading if you depend on tool-call guardrail scanning. [PR #54169](https://github.com/BerriAI/litellm/pull/54169)

## 3. New Model & Hardware Support

- **Volcengine Ark Seedream** — new image generation, editing, and pricing support via PR #54076; previously only reachable through the generic OpenAI-compatible fallback, which dropped Ark-specific per-image fields and had no cost rows. [PR #54076](https://github.com/BerriAI/litellm/pull/54076)
- **ElevenLabs `scribe_v2_realtime`** — realtime transcription backported to LTS **1.108.x** (PR #54342, twin of #48984), enabling `/v1/realtime` billing on the LTS line. [PR #54342](https://github.com/BerriAI/litellm/pull/54342)
- **Z.AI GLM 5.3** — `reasoning_effort` / `/v1/messages` thinking now reaches GLM models instead of returning 400 (PR #54279, LTS backport #54313). [PR #54279](https://github.com/BerriAI/litellm/pull/54279) · [PR #54313](https://github.com/BerriAI/litellm/pull/54313)
- **Azure AI Foundry `Microsoft-Decision-1.1`** — issue #53787 flags that only the Global Standard rate exists in the cost map; US/EU Data Zone deployments are **under-billed** on spend tracking. [Issue #53787](https://github.com/BerriAI/litellm/issues/53787)
- **OpenAI `gpt-live-1`** — community request for OpenAI-compatible GPT-Live API support in the proxy remains open (#40888, 8 👍). [Issue #40888](https://github.com/BerriAI/litellm/issues/40888)

## 4. Performance & Optimization

- **Streaming iterator finalization (PR #54247):** synchronous streams now finalize once after usage is assembled, eliminating redundant work once usage is already parsed. Author reports upstreaming internal bottleneck fixes. [PR #54247](https://github.com/BerriAI/litellm/pull/54247)
- **MCP `tools/list` latency regression (Issue #50065):** after upgrading v1.106.6 → v1.108.0, `tools/list` through `/mcp/` blocks **18–50 s** for clients sending pre-2026 `notifications/initialized` (e.g., Python `mcp` SDK used by Open WebUI) due to a legacy subscription listener. **Still open, no fix PR referenced.** [Issue #50065](https://github.com/BerriAI/litellm/issues/50065)
- **OTel v2 metric export cadence (Issue #38052):** `build_metric_reader` hardcodes `export_interval_millis=5000`, ignoring `OTEL_METRIC_EXPORT_INTERVAL`. Combined with cumulative histograms (#35060), every series re-ships **12×/min regardless of traffic** — a real cost/throughput issue for OTel backends. [Issue #38052](https://github.com/BerriAI/litellm/issues/38052)
- **Ollama connect timeouts (Issue #37041, closed):** `get_runtime_model_info` ignored request `api_base`, falling back to `localhost:11434` and costing **~8 s of silent connect timeouts per completion** on non-default hosts. [Issue #37041](https://github.com/BerriAI/litellm/issues/37041)
- **Redis connection leak (Issue #48589, open):** synchronous `Router.completion` opens and caches a **new Redis connection per call** when a deployment has rpm/tpm limits, with no close path. [Issue #48589](https://github.com/BerriAI/litellm/issues/48589)
- **Rust gateway `tokio::spawn` discipline (PR #53982):** clippy now refuses bare `tokio::spawn` in the Rust gateway, forcing every production task to declare its call scope and retain the call record — a structural guard for per-request accounting correctness. [PR #53982](https://github.com/BerriAI/litellm/pull/53982)

## 5. Stability & Regressions

Ranked by severity:

1. **MCP `tools/list` 18–50 s stall (Issue #50065)** — high severity; breaks interactive MCP clients on v1.108.0+. Open, no linked fix. [Issue #50065](https://github.com/BerriAI/litellm/issues/50065)
2. **Failed requests bypass RPM limits (Issue #21312)** — high severity for rate-limit fairness; failed virtual-key requests don't count toward RPM when they fail before a successful reply. Open since Feb 2026. [Issue #21312](https://github.com/BerriAI/litellm/issues/21312)
3. **Bedrock exception events raise raw `BedrockError` on streams (Issue #49935)** — `anthropic.messages.acreate(stream=True)` with `bedrock/` models surfaces raw `BedrockError` instead of a normalized LiteLLM error mid-stream. Open. [Issue #49935](https://github.com/BerriAI/litellm/issues/49935)
4. **Cold end-user spend counter over-increment (Issue #47062, closed, 6 👍)** — a missing `spend:end_user:{id}` counter was seeded with the **full cached balance**, locking users under budget; `SpendCounterReseed.from_db` returned `None` and reseed ran after lock release. [Issue #47062](https://github.com/BerriAI/litellm/issues/47062)
5. **`/v1/responses` leaks Gemini thought signatures & foreign function-call IDs (Issue #38270)** — cross-provider contamination in multi-step tool-calling workflows. Open. [Issue #38270](https://github.com/BerriAI/litellm/issues/38270)
6. **PUT `/v1/mcp/server` silently nulls OAuth2 fields (Issue #37258, closed)** — `authorization_url`, `token_url`, `oauth2_flow` dropped when `delegate_auth_to_upstream=true`. [Issue #37258](https://github.com/BerriAI/litellm/issues/37258)
7. **Azure AI models hit context-window errors via OpenWebUI (Issue #53716)** — `ContextWindowExceededError` despite default model parameters. [Issue #53716](https://github.com/BerriAI/litellm/issues/53716)
8. **Orphaned fallback references (Issue #37670)** — deleting a model leaves fallback refs in the DB, cascading failures on primary failure. Open. [Issue #37670](https://github.com/BerriAI/litellm/issues/37670)
9. **Bedrock `drop_params` rejects safeguards (PR #54176 / LTS #54180)** — fix in flight: safeguards now dropped under `drop_params` where Bedrock/older Claude models reject them, resolving 400s. [PR #54176](https://github.com/BerriAI/litellm/pull/54176) · [PR #54180](https://github.com/BerriAI/litellm/pull/54180)
10. **TPM reservation under-counts system prompt / instructions (PR #54318, closed)** — proxy's pre-send TPM estimate skipped the system prompt on Messages and instructions on Responses, allowing bursts past the limit. [PR #54318](https://github.com/BerriAI/litellm/pull/54318)

## 6. What This Means for Application Developers

- **Pin to the LTS line for production.** The `ghcr.io/berriai/litellm:lts` tag now floats to the newest LTS patch (v1.108.17), and multiple fixes are being dual-merged to `lts/1.108.x` (Z.AI #54313, ElevenLabs #54342, Bedrock safeguards #54180). If you're on v1.108.0 and use MCP clients, plan around the `tools/list` stall (#50065).
- **Rate-limit semantics are subtly lossy.** Failed virtual-key requests may not count toward RPM (#21312), and the cold end-user spend counter bug (#47062) could previously lock users out of budget. Audit your key-level limits if you depend on strict fairness.
- **Provider-parameter handling is actively being corrected.** Z.AI GLM thinking, Bedrock safeguards under `drop_params`, and Azure AI context windows are the hot spots — if you route across these providers, watch for 400s and consider `drop_params` behavior changes.
- **Cost attribution is improving but has gaps.** The Rust gateway now prices Messages calls for spend logs (#54329) and records served/failed attempts (#53984), while Azure Data Zone pricing (#53787) and Responses image-generation custom pricing (#53737) remain under-counted. Reconcile your billing if you rely on these.
- **OTel users should cap export volume.** The hardcoded 5 s interval (#38052) re-ships every cumulative histogram series 12×/min; set expectations with your observability vendor or patch the reader until `OTEL_METRIC_EXPORT_INTERVAL` is honored.
- **Streaming reliability is getting attention.** PR #54247 finalizes sync streams once after usage, and issue #42085 proposes opt-in `strict_stream_completion` to catch truncated SSE streams — worth tracking if silent truncation has affected your agents.

</details>

<details>
<summary><strong>Unsloth</strong> — <a href="https://github.com/unslothai/unsloth">unslothai/unsloth</a></summary>

# Unsloth Digest — 2026-11-25

## 1. Today's Highlights

The **v0.1.924-beta** release ships **Inkling 2 Mini fine-tuning** with 1.8–3.1× speedups and 50% VRAM reduction via LoRA/QLoRA, and adds **tensor, pipeline, and context parallelism** across GPUs. Studio's multi-GPU training story is moving fast: PR [#19378](https://github.com/unslothai/unsloth/pull/19378) introduces a full distributed backend (DDP/FSDP2/TP/PP/CP/EP) with an automatic default. However, the Inkling 2 launch is generating a cluster of platform-specific bugs (XPU, ROCm, regex failures, VRAM OOM) that signal uneven hardware validation.

---

## 2. Releases & Breaking Changes

**v0.1.924-beta — "Inkling finetuning + perf fixes"**
- Fine-tune **Inkling 2 Mini** 1.8–3.1× faster with 50% less VRAM (LoRA/QLoRA); export to GGUF or merged 16-bit.
- Trains on **Kaggle's free 2× T4**.
- New support for **tensor, pipeline, and context parallel** across GPUs.
- [[Release notes]](https://github.com/unslothai/unsloth/releases)

**Upstream compatibility note:** transformers 5.24 renamed Mamba's `cache_params` → `cache`; Unsloth's fused LoRA patch was silently skipped. Fix in [PR #19384](https://github.com/unslothai/unsloth/pull/19384). Mamba/FalconMamba LoRA users on transformers ≥5.24 are affected until merged.

---

## 3. New Model & Hardware Support

- **Inkling 2 Mini** (1.8B–3.1B class): full LoRA/QLoRA finetuning, GGUF/merged export, multi-GPU parallel training. [[v0.1.924-beta]](https://github.com/unslothai/unsloth/releases)
- **Ling-3.2-air** (multimodal, Qwen3.8-Flash-Next-class): feature request open, 2 👍. [[Issue #19298]](https://github.com/unslothai/unsloth/issues/19298)
- **MCP endpoint in Docker** — `/mcp` currently returns 404 on port 8000; closed as feature request. [[Issue #19383]](https://github.com/unslothai/unsloth/issues/19383)
- **Custom engine support** (Strata + multiple simultaneous backends alongside llama.cpp) requested. [[Issue #18895]](https://github.com/unslothai/unsloth/issues/18895)
- **Embedding model routing via connections** requested for external schedulers. [[Issue #19160]](https://github.com/unslothai/unsloth/issues/19160)

---

## 4. Performance & Optimization

**Merged / in-flight:**

- **Multi-GPU Studio backend** with auto-selected parallel strategy — replaces single-process layer-splitting that serialized cards. [[PR #19378]](https://github.com/unslothai/unsloth/pull/19378)
- **LTX-2.5 video on 6 GiB cards** at 768×512×49, bit-identical to 8 GiB renders; leaner connectors, released prompt rows, parked VAE encoder, measured denoise cost. [[PR #19377]](https://github.com/unslothai/unsloth/pull/19377)
- **INT8 attention nearest-arch fallback** — sm75/80/86/89/120 only currently; other NVIDIA archs get no INT8 attention. Fix selects nearest measured config. [[PR #19391]](https://github.com/unslothai/unsloth/pull/19391)
- **GPU speed-lever regression test** (CPU-only) — fails PRs that cost any GPU a perf lever. [[PR #19390]](https://github.com/unslothai/unsloth/pull/19390)
- **Chat streaming fan-out fix** — `wait_for_events` currently wakes *all* run followers on every commit (O(runs) wakeups per event); scoped to own-run events. [[PR #19396]](https://github.com/unslothai/unsloth/pull/19396)
- **Training history polling** now reuses checkpoint resume checks instead of re-validating from storage every 5 s. [[PR #19389]](https://github.com/unslothai/unsloth/pull/19389)
- **GGUF variant listing** — removes duplicate `HfApi().model_info` call on streamed lookup-table repos. [[PR #19397]](https://github.com/unslothai/unsloth/pull/19397)
- **Tool card re-render** — only re-renders the card whose full output changed, not every mounted Python/Terminal card. [[PR #19395]](https://github.com/unslothai/unsloth/pull/19395)
- **Chat Files menu** — replaces full CommonMark parse per assistant reply with reusable code-block extraction. [[PR #19385]](https://github.com/unslothai/unsloth/pull/19385)
- **Docker entrypoint** — consolidates two torch-check heredocs into one interpreter. [[PR #19388]](https://github.com/unslothai/unsloth/pull/19388)
- **Safety screen** — fixes super-linear growth on nested brackets and long path chains for python/terminal calls. [[PR #19399]](https://github.com/unslothai/unsloth/pull/19399)

---

## 5. Stability & Regressions

Ranked by severity:

**High**

- **cuda13-portable llama.cpp silently runs on CPU** — prebuilt archive ships without CUDA runtime; no error, just CPU fallback. [[Issue #19341]](https://github.com/unslothai/unsloth/issues/19341) — *no fix PR yet*
- **AMD mixed NVIDIA+AMD host ignores AMD card** — Studio can't use both; reported on RTX 3080+R9700 and RTX 4090+R9700 (one venv = one PyTorch build). [[Issue #12248]](https://github.com/unslothai/unsloth/issues/12248) — *no fix PR yet*
- **Inkling 2 Mini VRAM OOM on RX 7900 GRE / ROCm 7.13.99** — on v0.1.923-beta. [[Issue #19275]](https://github.com/unslothai/unsloth/issues/19275)
- **Inkling 2 Mini output failure on Arc 140V XPU (Vulkan)**. [[Issue #19239]](https://github.com/unslothai/unsloth/issues/19239)
- **Windows Strix Halo: host-shortfall check forces mmap after carve-out fix** — follow-up to #17605, regression of the fix. CLOSED. [[Issue #18805]](https://github.com/unslothai/unsloth/issues/18805)
- **GGUF LoRA export for Inkling 2 always fails; error message swallowed by UI** — fix PR names the converter error. [[PR #19325]](https://github.com/unslothai/unsloth/pull/19325)
- **PEFT 0.18 incompatibility on merged Inkling 2 export** — `ParamWrapper._did_swap_in_out_features` missing (needs 0.19+); Studio pins 0.18.1. Fix PR treats missing attribute as "no swap". [[PR #19337]](https://github.com/unslothai/unsloth/pull/19337)

**Medium**

- **Potential memory leak on Windows C: drive** — 200–400 MB lost per Unsloth desktop session, no cleanup path. 7 comments, ongoing. [[Issue #14487]](https://github.com/unslothai/unsloth/issues/14487)
- **Inkling 2 Mini: `Failed to process regex` (std::regex error_stack)** on Windows 11 / RTX 4070. [[Issue #19376]](https://github.com/unslothai/unsloth/issues/19376)
- **Generic `Gemma 4` model calls fail with `Penalty is not enabled (INVALID_ARGUMENT)`** — Carbon/Neon affected, 3.8-flash fine. CLOSED. [[Issue #18726]](https://github.com/unslothai/unsloth/issues/18726)
- **AMD ROCm: single gfx10 iGPU in visible set forces bf16 off process-wide**, even when training on RDNA4 discrete card. Fix: `HIP_VISIBLE_DEVICES`. CLOSED. [[Issue #19340]](https://github.com/unslothai/unsloth/issues/19340)
- **Chat `@skill` prompt cache miss** — skill content appended to system prompt only on mention turn, so turn 2 re-processes entire conversation. [[Issue #19212]](https://github.com/unslothai/unsloth/issues/19212)
- **Local tool loop can dispatch a call with zero-token result budget** in long tool-heavy conversations. [[Issue #19352]](https://github.com/unslothai/unsloth/issues/19352)
- **Gemma 4 string tool arguments not rendered as trained call syntax** — JSON strings emitted raw, invalid JSON still emitted as a call. [[Issue #18847]](https://github.com/unslothai/unsloth/issues/18847)
- **CUDA resource already mapped** on second video generation with MiniMax-H3. [[Issue #19317]](https://github.com/unslothai/unsloth/issues/19317)

**Low / CI-only**

- FSDP2 native import of `_utils` breaks 4 multi-rank test cases. [[PR #19400]](https://github.com/unslothai/unsloth/pull/19400)
- `_BARE_4BIT_EXPERT_REPOS` NameError breaks 9 cases in bad-mappings harness. [[PR #19398]](https://github.com/unslothai/unsloth/pull/19398)
- Expert parallel resume uses risky `torch.load` without `weights_only`. [[PR #19393]](https://github.com/unslothai/unsloth/pull/19393)
- Two Studio backend tests red on main (HIP label in MIOpen stack, installer stub). [[PR #19394]](https://github.com/unslothai/unsloth/pull/19394)

---

## 6. What This Means for Application Developers

1. **Inkling 2 is production-ready on NVIDIA, still maturing elsewhere.** The K2 T4 path works; ROCm, Intel XPU, and Windows Strix Halo are seeing real bugs today. If you're deploying on heterogeneous hardware, pin known-good backend combos and test before upgrading.

2. **Multi-GPU is about to get materially better.** [PR #19378](https://github.com/unslothai/unsloth/pull/19378) makes DDP/FSDP2/TP/PP/CP/EP a first-class Studio feature with an auto default rather than a manual `UNSLOTH_PARALLEL` env dance. Worth tracking for anyone scaling beyond a single card.

3. **Tool-calling reliability has open edges.** The Gemma 4 string-argument bug, the zero-token tool budget, and the prompt-cache miss on `@skill` all directly hit agentic workloads. If you build agents, follow [#18847](https://github.com/unslothai/unsloth/issues/18847), [#19352](https://github.com/unslothai/unsloth/issues/19352), and [#19212](https://github.com/unslothai/unsloth/issues/19212).

4. **Export pipelines need attention.** The PEFT 0.18/0.19 split and the swallowed GGUF-LoRA error both affect fine-tune-to-deploy flows for Inkling 2. If you export merged models in Studio, wait for [#19337](https://github.com/unslothai/unsloth/pull/19337)/[#19325](https://github.com/unslothai/unsloth/pull/19325) to land.

5. **Silent CPU fallback is the most dangerous class of bug here.** The cuda13-portable llama.cpp archive ([#19341](https://github.com/unslothai/unsloth/issues/19341)) will happily run on CPU without complaint. Add your own CUDA-availability assertion in CI if you depend on the prebuilt archives.

6. **Watch bf16 on mixed AMD hosts.** [#19340](https://github.com/unslothai/unsloth/issues/19340) showed one gfx10 iGPU can flip the entire process to fp16, costing throughput. If you're on ROCm with an iGPU present, set `HIP_VISIBLE_DEVICES` explicitly.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*