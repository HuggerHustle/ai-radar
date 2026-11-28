# AI Infrastructure Digest 2026-11-28

> Generated: 2026-11-28 03:13 UTC | Projects covered: 6

- [vLLM](https://github.com/vllm-project/vllm)
- [SGLang](https://github.com/sgl-project/sglang)
- [llama.cpp](https://github.com/ggml-org/llama.cpp)
- [Ollama](https://github.com/ollama/ollama)
- [LiteLLM](https://github.com/BerriAI/litellm)
- [Unsloth](https://github.com/unslothai/unsloth)

---

## Cross-Project Comparison

# Cross-Project Comparison Report — AI Infrastructure Ecosystem
**Date: 2026-11-28 | Sources: vLLM, SGLang, llama.cpp, Ollama, LiteLLM, Unsloth digests**

---

## 1. Ecosystem Overview

The AI infrastructure stack is consolidating around a **stabilization-and-hardening phase** as the major serving engines (vLLM, SGLang) move toward compatibility milestones while the local-runtime and fine-tuning layers absorb a wave of correctness fixes. Activity today is dominated not by new model adoption but by **race conditions, silent-failure modes, and KV-cache semantics** — a hallmark of platforms moving from "works in demos" to "works in production." Quantization infrastructure (FP8, NVFP4, MXFP) advanced on two fronts simultaneously, with llama.cpp adding scale tensors to ggml and Unsloth shipping packed-GGUF LoRA training. Meanwhile, frontier-model support is fragmenting across hardware: SM120/Blackwell RTX PRO 6000, ROCm gfx950, Ascend A3, and Qualcomm Hexagon all received attention today, reflecting a market that no longer treats NVIDIA-only as the default. Cross-cutting signals — Rust frontends, MCP OAuth, agentic KV hints — indicate the next wave of work is about **multi-tenant correctness and agent-driven traffic patterns**, not raw throughput.

---

## 2. Activity Comparison

| Project | Layer | Issues Touched | PRs Touched | Release Status | Release Cadence Signal |
|---|---|---|---|---|---|
| **vLLM** | Serving engine (datacenter) | 132 | ~500 | No release in 24h | High-velocity main; env-var → config migration in flight |
| **SGLang** | Serving engine (datacenter) | ~15 open regressions tracked | ~10 visible (sampling refactor cluster) | No release in 24h; **1.0 tracker active** | Pre-1.0 stabilization; silent config → hard errors |
| **llama.cpp** | Local runtime (kernels/ggml) | ~15 open regressions | ~20 landing PRs | **9 releases in 24h** (b12812–b12823) | Daily rolling builds; extreme cadence |
| **Ollama** | Local runtime (UX/consumer) | ~15 open issues | ~10 queued fixes | No release; **0.40.18 regressions active** | Regression cycle from 0.40.15 → 0.40.18 |
| **LiteLLM** | LLM gateway | ~10 open bugs | ~10 landing (MCP OAuth series) | **v1.108.20 LTS** shipped | LTS-tagged release; `lts` image tag updated |
| **Unsloth** | Fine-tuning / training | ~10 open | ~15 landing (danielhanchen cluster) | No release in 24h | PR-heavy; install.sh torch 2.14.1 change |

**Observation:** llama.cpp and LiteLLM are the only projects with releases today, and both shipped *fixes* rather than features (llama.cpp b12823 long-context ADD_ID, LiteLLM LTS tag). vLLM/SGLang issue-to-PR ratios (~1:4 and ~1:1) suggest vLLM has substantially more in-flight engineering, while SGLang's cluster of sampling PRs from a single author indicates a defined refactor rather than distributed triage.

---

## 3. Model Support Race

| Model / Architecture | vLLM | SGLang | llama.cpp | Ollama | Unsloth |
|---|---|---|---|---|---|
| **DeepSeek-V4.1 (SM120)** | ✅ PR #65527, #68818 (partial) | — | — | ⚠️ local files unshipped | — |
| **GLM-5.2/5.3** | ✅ SM100 GEMM table (#70455) | — | — | — | — |
| **Inkling 2 (Small/Mini)** | ✅ MTP verify window ↑ | ⚠️ route_metadata overflow (#53439) | ✅ tensor-split (#32751) | ❌ crashes DGX Spark | ✅ packed GGUF (#20080) |
| **Qwen3.5 / TTS (GGUF-fused)** | — | — | ✅ converter fixes | ⚠️ tool-call churn | ✅ fused attn_qkv_gate (#20070) |
| **Qwen3.8-Flash (ROCm)** | ⚠️ tracking #59575 | ✅ ROCm MHA v4 | — | — | — |
| **MiniMax-H3** | — | ✅ image edits (#53645) | — | — | ✅ preview optimization |
| **Wan2.2 / Diffusion (Physical AI)** | — | ✅ roadmap #53203 | — | — | — |
| **Jet-Nemotron** | — | ❌ unified-memory loss (#53615) | — | — | — |
| **Gemma-4 / Gemma-2** | — | ✅ soft-cap fix (#34093) | — | — | — |
| **Chirp 3 HD STT/TTS (Vertex)** | — | — | — | — | — (LiteLLM: ✅ PR #36233) |

**Who's ahead:**

- **vLLM leads on frontier dense/MoE servers** (GLM-5.x, DeepSeek-V4.1, Qwen3.8) but its SM120 support is *incomplete* — #56892 (CUDA graphs unusable) blocks production.
- **SGLang is the only engine with day-one diffusion/VLA support** (Wan, MiniMax, Physical AI roadmap), and is the strongest on ROCm and Ascend — but it carries an unbounded `route_metadata` bug on Inkling-2 SM12x.
- **llama.cpp is the fasted to absorb new architectures** into quantized formats (Inkling2 tensor-split, Qwen3.5 fused tensors, HRX backend), but treats them as experiments — production readiness lags.
- **Unsloth is the only project shipping *training-side* support** for Inkling 2 and Qwen3.5 (packed GGUF), which is distinctive: fine-tuning is now reaching quantized architectures the serving engines are still stabilizing.
- **Ollama is lagging badly** — Inkling-2-mini crashes the host on GB10, DeepSeek local files remain unshipped, and no new model support landed today.

---

## 4. Performance Frontier

Optimization effort is concentrated along five distinct axes, and — notably — **no two projects are working the same axis hardest**:

| Axis | vLLM | SGLang | llama.cpp | Ollama | LiteLLM | Unsloth |
|---|---|---|---|---|---|---|
| **KV cache / offload** | 🔥 Heavy — RFC #66782, NIXL, Mooncake layerwise (#65613) | 🔥 HiCache, prefix miss (#53149) | ⚠️ moe-cache multi-backend (#33133) | 🔥 MLX over-eviction (#19962) | — | ✅ KV-by-cells estimator (#20082) |
| **Batching / scheduling** | 🔥 Batch-invariance, async scheduling, risk-aware admission | ✅ Beam-search CUDA graph (#53659) | ⚠️ SYCL GDN replay (#33220) | — | ✅ Per-key ITPM/OTPM (#54311) | ✅ Qwen-Image per-row batch |
| **Quantization** | ✅ MFU metrics for OOT quant (#65143) | — | 🔥 fp8/NVFP4 scales in ggml (#28898) | ⚠️ Vulkan RDNA1 13× slow | — | 🔥 packed GGUF LoRA (#20091) |
| **Distributed / EP** | 🔥 NIXL EP sizing (#63485), RL weight race (#70364) | ⚠️ DSV4 attention-DP mismatch (#51275) | ✅ moe-cache cross-backend | ❌ CUDA_VISIBLE_DEVICES drop (#19921) | — | ✅ FSDP2 packed MoE (#20089) |
| **Kernels** | FlashInfer warp split-K, GDN MTP 9→16 | QuACK SM120 GEMM, Ascend MoE fusion | Vulkan coopmat2 GDN, HIP DPP, Metal elu | — | — | zoo kernels on by default |

**Key findings:**

- **KV cache is the single most contested layer.** vLLM is rethinking request-level promotion semantics for agents (RFC #66782), while Ollama is fighting eviction bugs on MLX and SGLang is debugging prefix misses on hybrid sliding-window models. All three approaches point to the same conclusion: **KV cache policy is now the dominant latency variable for multi-turn/agentic workloads**.
- **Quantization is splitting into two frontiers:** activation/weight scale representation (llama.cpp's ggml scale tensors, Unsloth's NVFP4/MXFP8 MoE preservation) and runtime efficiency reporting (vLLM's MFU for out-of-tree quant). The first is table stakes for 2027; the second is operational.
- **Distributed serving is dominated by EP and RL-weight-update races** in vLLM — a signal that RLHF/agentic training loops are now driving serving-engine requirements.
- **llama.cpp's device-properties caching fix (b12819) is the highest-ROI single fix of the day** — up to 8× throughput degradation from a ~1 ms per-call overhead.

---

## 5. Layer Positioning

The six projects occupy distinct, non-overlapping layers — a stable division of labor that has emerged over 2024–2026:

```
┌─────────────────────────────────────────────────────────────┐
│  APPLICATION / AGENT FRAMEWORKS                              │
├─────────────────────────────────────────────────────────────┤
│  GGATEWAY  →  LiteLLM                                        │
│    ├─ Routing, rate limits, MCP OAuth, multi-cloud auth     │
│    └─ Does NOT run inference; owns the request contract     │
├─────────────────────────────────────────────────────────────┤
│  SERVING ENGINES (datacenter)  →  vLLM  |  SGLang           │
│    ├─ vLLM: broadest model coverage, Rust frontend incoming │
│    └─ SGLang: diffusion/VLA, ROCm/Ascend, 1.0 stability     │
├─────────────────────────────────────────────────────────────┤
│  LOCAL RUNTIMES (edge/desktop)  →  llama.cpp  |  Ollama     │
│    ├─ llama.cpp: kernel-level, GGUF, 9 releases/day         │
│    └─ Ollama: consumer UX wrapper, OpenAI-compat surface    │
├─────────────────────────────────────────────────────────────┤
│  TRAINING / FINE-TUNING  →  Unsloth                         │
│    └─ LoRA/FSDP2, packed GGUF training, eval scoring        │
└─────────────────────────────────────────────────────────────┘
```

**Positioning nuances:**

- **vLLM vs. SGLang** is no longer a feature race but a *deployment-shape* race. vLLM is chasing the OpenAI-compatible scale-out story (Rust frontend, `vllm.Render` sidecar, RL post-training APIs). SGLang is chasing *breadth* — NPU, ROCm, Ascend, diffusion, Physical AI — and is explicitly targeting a 1.0 stability contract.
- **llama.cpp vs. Ollama** is a *kernel-quality vs. UX* split. llama.cpp ships 9 releases in a day; Ollama ships 0 but absorbs the burden of user-facing regressions (0.40.18). Ollama's Vulkan backend being 13× slower than upstream llama.cpp on RDNA1 confirms it is a *packager*, not a kernel team.
- **LiteLLM is the only pure-gateway project** in the set and is the only one whose critical issues are bills and auth (Gemini `thoughtsTokenCount` regression, Bedrock tool-name cross-tenant leak) rather than inference.
- **Unsloth is architecturally isolated** — it is the only project in the set whose "release" cadence is measured in training throughput (2.12× Qwen-Image, 2.69× FLUX.3) rather than inference throughput.

---

## 6. Trend Signals

### Trend 1: The Rust-ification of the serving frontend
vLLM issue #68784 enumerates remaining gaps before `vllm serve` switches to Rust by default; LiteLLM is migrating Bedrock/Vertex to a native Rust gateway (PR #54613). **Signal:** Python frontends are becoming a compatibility layer, not the destination. Teams relying on custom logit processors or Python plugins in vLLM should audit now.

### Trend 2: Agentic workloads are rewriting KV cache semantics
vLLM RFCs #66782 and #52113 propose request-level and session-level KV hints ("resume soon", "release branch"). SGLang's hybrid SWA prefix-miss bug (#53149) and Ollama's MLX over-eviction (#19962) are the same problem from different angles. **Signal:** cache thrash is now the #1 latency tax on multi-turn agents. Expect a convergence on declarative cache-hint APIs in 2027 H1.

### Trend 3: Silent failures are the new critical bug class
Ollama returns HTTP 200 with empty body on schema failure (#19918); LiteLLM silently fuses Vertex embedding lists (#38823); vLLM has silent degeneration on GLM-5.3 + MTP + prefix cache (#69154). **Signal:** the industry's observability tooling has not caught up to the failure modes of streaming, schema-constrained, multi-turn LLM APIs. Application developers must add explicit emptiness/shape validation until tooling catches up.

### Trend 4: Quantized fine-tuning is closing the gap with quantized serving
Unsloth's packed-GGUF LoRA training (#20091) and llama.cpp's ggml scale tensors (#28898) landed on the same day, pointing in the same direction: **the bf16-convert-to-train workflow is being deprecated**. **Signal:** FP8/NVFP4 checkpoints will become trainable in-place, not just servable.

### Trend 5: MCP is becoming the gateway's central security surface
LiteLLM's MCP OAuth hardening series (#54812–#54816), Unsloth's server-side-vs-client MCP tool collision (#19593), and remote MCP header bugs (#19876) collectively indicate MCP is transitioning from "demo protocol" to "production auth boundary." **Signal:** expect MCP OAuth conformance testing and tool-name namespacing to become standard gateway features within 2 quarters.

### Trend 6: Hardware diversification is no longer aspirational
Today's digests contain meaningful activity for **SM120, SM100, gfx950, Ascend A3, Qualcomm Hexagon HTP0, IBM zDNN, HRX (AMD), SYCL/Xe3, Vulkan Intel Gen9.5, and RDNA1**. **Signal:** "NVIDIA-only" deployment is becoming a liability in regulated/sovereign markets; multi-vendor kernel coverage is now a procurement checkbox.

### Trend 7: RL post-training is escaping the monkey-patch era
vLLM issue #68777 inventories the monkey-patches RL frameworks currently apply, and PR #70286 (`--max-expert-lora-rank`) is the first converted to a public API. **Signal:** trainer-engine API contracts will stabilize over the next 2 quarters; RL framework maintainers should track this list to avoid breakage.

---

### What Agent and Application Developers Should Do This Week

1. **Pin production deployments** to vLLM main only if you've validated SM120; to LiteLLM **`lts` tag** unconditionally; to Ollama **0.34.4** if you're on DGX Spark; to llama.cpp **b12823+** for long-context CUDA/HIP work.
2. **Add explicit response-body emptiness and shape validation** — silent HTTP 200 failures are the emerging norm across Ollama and LiteLLM.
3. **Log resolved device/backend at startup** — CUDA_VISIBLE_DEVICES silently dropping to CPU (Ollama #19921) and multi-backend MoE cache mismatches (llama.cpp) manifest as throughput cliffs, not errors.
4. **Watch agent-relevant RFCs**: vLLM #66782/#52113 (KV hints), SGLang 1.0 tracker #50045, LiteLLM MCP OAuth series #54812–#54816.
5. **Re-baseline eval scores** if you use Unsloth CLI — scoring bugs #19476/#19474 can silently invert results.

---

*Report compiled from digests dated 2026-11-28. Issue/PR counts are estimates derived from digest prose; consult upstream trackers for authoritative numbers.*

---

## Per-Project Reports

<details>
<summary><strong>vLLM</strong> — <a href="https://github.com/vllm-project/vllm">vllm-project/vllm</a></summary>

# vLLM Digest — 2026-11-28

## 1. Today's Highlights

No new releases in the last 24h, but issue and PR traffic remains heavy (132 issues, 500 PRs touched). The highest-signal activity centers on **SM120 (Blackwell RTX PRO 6000) correctness/perf gaps** for DeepSeek-V4.1 (issues #56892, #65527, #68818) and on **KV cache/offload semantics for agentic and RL workloads** (RFC #66782, #52113, NIXL/Mooncake reliability work). Batch-invariance and async-scheduling robustness also dominate, with several targeted bugfix PRs landing today.

---

## 2. Releases & Breaking Changes

- **No releases in the last 24h.**
- Forward-looking API note: PR [#65527](https://github.com/vllm-project/vllm/pull/65527) and PR [#68818](https://github.com/vllm-project/vllm/pull/68818) both modify device-capability gating for SM120; deployments pinned to SM120 DeepSeek-V4.1 images should track these.
- Env-var rationalization RFC [#25700](https://github.com/vllm-project/vllm/issues/25700) continues to gain traction — expect gradual migration of env vars (`attention backend`, `all2all backend`, KV layout flags) into first-class config fields.

---

## 3. New Model & Hardware Support

- **SM120 (RTX PRO 6000 Blackwell) dense prefill for FlashInfer sparse MLA** — PR [#68818](https://github.com/vllm-project/vllm/pull/68818) enables the generic dense-MHA prefill path for eligible workloads; compact NoPE cache layout intentionally kept on sparse MQA.
- **SM120 capability gate for DeepSeek-V4.1** — PR [#65527](https://github.com/vllm-project/vllm/pull/65527) admits SM120 into the flattened device-query-lens path, unblocking `enable_adaptive_verification`.
- **ROCm / gfx950 (MI355X) tracking for Qwen3.8-Flash-Next** — issue [#59575](https://github.com/vllm-project/vllm/issues/59575) covers Quark MXFP4, GatedDeltaNet, QuerySparse Attention, and HyperConnection on AMD.
- **GLM-5.2/5.3 low-latency GEMM table for SM100 (B200)** — PR [#70455](https://github.com/vllm-project/vllm/pull/70455) adds FlashInfer warp split-K BF16 GEMMs across M=1–32, mirroring the SM107 table.
- **Transformers backend + LoRA adapter loading for split modules** — PR [#70346](https://github.com/vllm-project/vllm/pull/70346) allows adapters trained on original (pre-conversion) layouts to work through the HF Transformers backend.
- **Per-slot LoRA rank for MoE experts** — PR [#70286](https://github.com/vllm-project/vllm/pull/70286) introduces `--max-expert-lora-rank` so dense/attention layers and routed experts can use different ranks.

---

## 4. Performance & Optimization

- **Fused GDN MTP verify window raised from 9 → 16 tokens** — PR [#70253](https://github.com/vllm-project/vllm/pull/70253) prevents block-16 DFlash/DSpine drafters from falling back to the Triton delta-rule path. Part of tracking issue #69375.
- **NIXL EP dispatch sized from execution slices** — PR [#63485](https://github.com/vllm-project/vllm/pull/63485) replaces static `max_tokens_per_rank` (often 8192) with actual per-step token counts, shrinking expert workspaces and grouped-GEMM grids.
- **Mooncake layerwise KV transfer (opt-in)** — PR [#65613](https://github.com/vllm-project/vllm/pull/65613) overlaps KV WRITE with prefill using `kv_connector_extra_config.transfer_mode="layerwise"`.
- **Mooncake sender head-of-line blocking fix** — PR [#70461](https://github.com/vllm-project/vllm/pull/70461) replaces the fixed `2 × num_workers` sender pool with per-request `asyncio.Task` dispatch, removing a hard concurrency ceiling.
- **Risk-aware prefix-cache admission** — PR [#58837](https://github.com/vllm-project/vllm/pull/58837) adds optional admission-side control for constrained-KV-capacity deployments (eviction policy unchanged).
- **MFU metrics for out-of-tree quant methods** — PR [#65143](https://github.com/vllm-project/vllm/pull/65143) adds `QuantizationConfig.get_weight_byte_size()` so custom quant configs report their own weight layout to the MBU estimator.
- Outstanding regressions worth tracking (see §5): [#48035](https://github.com/vllm-project/vllm/issues/48035) reports ~28% BS=1 decode regression from v0.19.1 → v0.24.0 on Qwen3-4B (RTX 4090); FP8 checkpoint is a further ~18% slower than runtime FP8 quant.

---

## 5. Stability & Regressions

Ranked by severity (all currently open unless marked CLOSED):

1. **GLM-5.3-Flash + MTP + prefix caching silent degeneration** — issue [#69154](https://github.com/vllm-project/vllm/issues/69154). Constant-token lock degeneration ("locklock…") on v0.34.0 (B200, TP4); MTP acceptance collapses to 0 and persists across requests sharing the prefix. Correctness-critical; no fix PR linked yet.
2. **DeepSeek-V4.1-Flash on SM120: CUDA graphs unusable, decode throughput very low under `--enforce-eager`** — issue [#56892](https://github.com/vllm-project/vllm/issues/56892). Partial mitigation via [#65527](https://github.com/vllm-project/vllm/pull/65527) and [#68818](https://github.com/vllm-project/vllm/pull/68818), but graph capture fix remains open.
3. **~17.5s engine-wide stall on large→small shape transitions (NVFP4/b12x, GDN CuteDSL prefill kernel)** — issue [#47458](https://github.com/vllm-project/vllm/issues/47458). Freezes all in-flight requests; no fix PR.
4. **Inkling 2 prefix-cache nondeterminism** — issue [#70043](https://github.com/vllm-project/vllm/issues/70043). Identical-prompt copies within one batch diverge run-to-run with APC on (vLLM main, A100).
5. **LoRA linear path nondeterminism in serving** — issue [#50602](https://github.com/vllm-project/vllm/issues/50602). `lora_shrink`/`lora_expand` punica path unstable outside fp32-eager; extensive elimination matrix included.
6. **Extensible KV cache reserves ~2.7 GiB on 8 GB GPU** — issue [#68184](https://github.com/vllm-project/vllm/issues/68184). Blocks 4B NVFP4 model at 4096 context on RTX 4070 Laptop.
7. **`chat_template_kwargs["tools"]` overrides server tools → HTTP 500 KeyError on DeepSeek renderers** — issue [#70385](https://github.com/vllm-project/vllm/issues/70385). Opened today.
8. **Streaming admission overload race** — issue fixed by PR [#70171](https://github.com/vllm-project/vllm/pull/70171): late `QueueOverflowError`/`MaxQueuedTokensError` can reject after HTTP 200 start; rollback path now eager.
9. **Allowed-token restore race in logit-bias path** — issue #70415, fix in PR [#70462](https://github.com/vllm-project/vllm/pull/70462). Add a block barrier after the scattered restore.
10. **INT4 packed Triton attention drops local-attention / R-SWA / MM window masks** — issue #70419, fix in PR [#70460](https://github.com/vllm-project/vllm/pull/70460).
11. **MoE EP online requantization race** — PR [#70018](https://github.com/vllm-project/vllm/pull/70018) skips non-local experts before parameter lookup, avoiding released-source-param access.
12. **RL weight-update/scheduler race** — PR [#70364](https://github.com/vllm-project/vllm/pull/70364) blocks `resume_scheduler` on incomplete weight updates (matters under `VLLM_RELOAD_MODE=direct`/`layerwise`).
13. **KV cache init shape mismatch with EP+DP on MoE** — issue [#47722](https://github.com/vllm-project/vllm/issues/47722), crash on DP rank 2 during `determine_available_memory`.

Closed/stale today: [#47367](https://github.com/vllm-project/vllm/issues/47367) (GLM5.2-nvfp4 `!!` output thinking phase), [#47159](https://github.com/vllm-project/vllm/issues/47159) (ROCm triton_w4a16_gemm GPTQ assertion), [#48054](https://github.com/vllm-project/vllm/issues/48054) (DeepSeek-V4 sparse-SWA flashinfer pin mismatch), [#48395](https://github.com/vllm-project/vllm/issues/48395) (Jetson AGX Orin native start), [#47456](https://github.com/vllm-project/vllm/issues/47456) (shared JIT warmup RFC).

---

## 6. What This Means for Application Developers

- **Agentic workloads are getting first-class treatment.** RFC [#66782](https://github.com/vllm-project/vllm/issues/66782) fixes the request-level KV promotion semantics that break under agent churn (stale budgets, self-evicting promotions), and RFC [#52113](https://github.com/vllm-project/vllm/issues/52113) proposes session-aware KV hints so agents can declare "resume soon" / "release branch." If you're building multi-agent systems with tool-call pauses, these will reduce cache thrash once landed.
- **Gateway builders: watch `vllm.Render`.** Issues [#65503](https://github.com/vllm-project/vllm/issues/65503) and [#56172](https://github.com/vllm-project/vllm/issues/56172) push heavy chat-template + multimodal preprocessing into an engine-free local sidecar — meaning CPU gateways can offload tokenization and MM handling to `vllm-rs render`. Also see [#48049](https://github.com/vllm-project/vllm/issues/48049) for first-class session IDs to power conversation-aware routing (Dynamo integration targeted).
- **Rust frontend becoming the default is now on the tracker.** Issue [#68784](https://github.com/vllm-project/vllm/issues/68784) enumerates the remaining gaps before `vllm serve` switches. If you depend on Python-frontend-only behaviors (custom logit processors, plugins), audit now.
- **RL post-training users:** issue [#68777](https://github.com/vllm-project/vllm/issues/68777) is an honest inventory of monkey-patches RL frameworks currently apply to vLLM. If you maintain a trainer, this is the list to track for upstreaming — patches are being converted to public APIs (e.g., `--max-expert-lora-rank` in [#70286](https://github.com/vllm-project/vllm/pull/70286) is the first such conversion).
- **SM120 / Blackwell RTX PRO 6000 adopters:** don't deploy DeepSeek-V4.1-Flash at scale until #56892's graph capture fix lands; use `--enforce-eager` only as a stopgap.
- **Tool-calling apps on DeepSeek:** avoid passing `tools` through `chat_template_kwargs` — issue [#70385](https://github.com/vllm-project/vllm/issues/70385) will 500. Use the server-configured tools path instead.
- **Streaming clients:** PR [#70171](https://github.com/vllm-project/vllm/pull/70171) closes a class of "response already started, then rejected" races — worth pinning once merged if you run at high load.

</details>

<details>
<summary><strong>SGLang</strong> — <a href="https://github.com/sgl-project/sglang">sgl-project/sglang</a></summary>

# SGLang Digest — 2026-11-28

## 1. Today's Highlights

SGLang is in full stabilization mode ahead of the **1.0 stability release** ([#50045](https://github.com/sgl-project/sglang/issues/50045)), with hardening work focused on replacing silent misconfiguration with explicit errors and defining a 1.x compatibility policy. Meanwhile, the sampling subsystem is undergoing a deep refactor by hnyls2002 (PRs [#52565](https://github.com/sgl-project/sglang/pull/52565), [#53197](https://github.com/sgl-project/sglang/pull/53197), [#53649](https://github.com/sgl-project/sglang/pull/53649), [#53655](https://github.com/sgl-project/sglang/pull/53655), [#53657](https://github.com/sgl-project/sglang/pull/53657)) to consolidate per-request sampling state into device-resident tables. A notable cluster of DoS-class bugs addressed input validation gaps in `/generate` and `/parse_function_call` — several were closed today, indicating the security sweep is bearing fruit.

## 2. Releases & Breaking Changes

No new releases in the last 24h. However, the **SGLang 1.0 Release Tracker** ([#50045](https://github.com/sgl-project/sglang/issues/50045)) continues to mature: upgrading from 0.5.x may require code changes, and silent configuration changes are being converted to hard errors. Teams pinned to 0.5.x should begin planning migration validation now.

## 3. New Model & Hardware Support

- **Diffusion serving for Physical AI** — New roadmap ([#53203](https://github.com/sgl-project/sglang/issues/53203)) targets a unified VLA/world-model serving stack across `multimodal_gen`, `miles_diffusion`, and `miles`, sharing model, processor, session, and execution across components.
- **ROCm MHA v4 for Wan BF16** — PR [#53047](https://github.com/sgl-project/sglang/pull/53047) routes head-dim-128 dense attention to aiter MHA v4 on ROCm behind `SGLANG_ROCM_MHA_V4=1`, faster than the default fmha v3 path for Wan2.2 A14B 480p.
- **Ascend A3 fused MoE** — PR [#53666](https://github.com/sgl-project/sglang/pull/53666) fuses W8A8 GMM, clipped SwiGLU, and dynamic quantization for the A3 MoE path via `sgl-kernel-npu`.
- **NPU LPLB support** — PR [#50975](https://github.com/sgl-project/sglang/pull/50975) adds LPLB (load-balanced) MoE on NPU.
- **SM120 QuACK GEMM** — Opt-in SM120 GEMM + split-KV for beam search ([#53660](https://github.com/sgl-project/sglang/pull/53660)).
- **MLLM Roadmap Q4** ([#43314](https://github.com/sgl-project/sglang/issues/43314)) — Processor-cache reuse progressing toward early embedding reuse for EPD deployments.

## 4. Performance & Optimization

- **Beam-search CUDA graph replay** — PR [#53659](https://github.com/sgl-project/sglang/pull/53659) enables graph replay for all-beam decode batches (shared-context attention, compact trie head), eliminating per-kernel host launches; a companion PR [#53660](https://github.com/sgl-project/sglang/pull/53660) reduces host syncs on SM120.
- **Qwen3-VL Hopper regression** — Issue [#50103](https://github.com/sgl-project/sglang/issues/50103) reports that the default `prefill_decode_interval=22` costs 9.5–36% throughput on long-prompt/text traffic; setting interval to 0 is faster. Workaround available, no fix PR yet.
- **MiniMax-H3 image edits** — PR [#53645](https://github.com/sgl-project/sglang/pull/53645) caches assembled tiled VAE posterior moments to skip redundant tile lookup/blend/assembly.
- **FlashInfer `logits_soft_cap` fix** — PR [#34093](https://github.com/sgl-project/sglang/pull/34093) correctly passes soft-cap at plan time for Gemma-2/Grok; without it, those models were uncapped.
- **DeepSeek V4 NPU pool sizing** — PR [#52991](https://github.com/sgl-project/sglang/pull/52991) corrects row-size assumptions (e.g., 584B → 1,024B for A3 BF16 rows), recovering previously over-reserved memory.

## 5. Stability & Regressions

Ranked by severity:

1. **Regex DoS in `/parse_function_call`** ([#52090](https://github.com/sgl-project/sglang/issues/52090)) — Nested quantifiers + `re.DOTALL`; **~167 bytes** triggers catastrophic backtracking, blocking the event loop. Open, no fix PR.
2. **Server-crash input validation cluster** ([#41466](https://github.com/sgl-project/sglang/issues/41466), [#41467](https://github.com/sgl-project/sglang/issues/41467), [#41482](https://github.com/sgl-project/sglang/issues/41482)) — Wrong-typed `/generate` fields, malformed `session_params`, unbounded `top_k`/`logprobs`/`n` can crash the server. **All closed today** — fixed.
3. **Gemma-4 mm scheduler crash** ([#26751](https://github.com/sgl-project/sglang/issues/26751)) — A single grayscale/RGBA image triggers shape mismatch (mat1 256 vs 768) and kills the scheduler, dropping batched requests. **Closed today.**
4. **Inkling-2 `route_metadata` shared-memory overflow** ([#53439](https://github.com/sgl-project/sglang/issues/53439)) — On SM12x/GB10 with 384 experts, EP>1, ~2,750 routed ids exceed block shared memory. Open.
5. **Jet-Nemotron unified-memory state loss** ([#53615](https://github.com/sgl-project/sglang/issues/53615)) — Linear-attention state never written back with `--enable-unified-memory`. Open.
6. **`/v1/chat/completions` returns 500 on malformed `response_format.schema`** ([#53447](https://github.com/sgl-project/sglang/issues/53447)) — Should be 400. Open.
7. **Hybrid SWA + state radix cache prefix misses** ([#53149](https://github.com/sgl-project/sglang/issues/53149)) — Window lifetimes on stateless nodes outlive checkpoint windows, causing full prefix misses in multi-turn workloads. Open.
8. **Out-of-vocab/negative token ids in `custom_logit_processor`/`token_ids_logprobs`** ([#52995](https://github.com/sgl-project/sglang/issues/52995)) — Crash or silent token mis-banning. Open.
9. **`sgl-kv-indexer` RwLock starvation** ([#52575](https://github.com/sgl-project/sglang/issues/52575)) — Prefix query holds read guard for the whole scan, starving apply. Open.
10. **DSV4 attention-DP graph variant mismatch** ([#51275](https://github.com/sgl-project/sglang/issues/51275)) — Ranks replaying different graph variants read peer buffers. Open.

CI status: 7 broken, 26 flaky, 924 recently fixed ([#17050](https://github.com/sgl-project/sglang/issues/17050)). The CUDA coredump tracker ([#26340](https://github.com/sgl-project/sglang/issues/26340)) remains the highest-traffic issue at 390 comments.

## 6. What This Means for Application Developers

- **Review your `/generate` inputs.** The input-validation crashes were fixed, but until you're on a release containing those patches, any client can take down your server with a malformed field. Add schema validation on your side.
- **Non-RGB images were a real threat** for Gemma-4 multimodal deployments — a single CDN-served grayscale JPEG could restart the pod and drop all in-flight requests. Upgrade if you serve vision traffic.
- **Tool-calling parsers are a DoS surface.** The `/parse_function_call` regex backtracking issue is still open; if you expose it to untrusted clients, consider input length caps and isolating that endpoint.
- **Multi-turn agents on hybrid models** (sliding-window + state) may see full prefix misses despite HiCache — monitor cache hit rates on Inkling-class models until [#53149](https://github.com/sgl-project/sglang/issues/53149) is resolved.
- **Hopper users running Qwen3-VL**: try `prefill_decode_interval=0` for a quick throughput win on long prompts.
- **1.0 migration planning**: expect silent-config tolerances to become hard errors; audit your launch scripts for settings that currently "work" but may be deprecated.

</details>

<details>
<summary><strong>llama.cpp</strong> — <a href="https://github.com/ggml-org/llama.cpp">ggml-org/llama.cpp</a></summary>

# llama.cpp Digest — 2026-11-28

## 1. Today's Highlights

A busy 24 hours across the CUDA and Vulkan backends: the long-standing `ADD_ID` launch failure on >65535 tokens (a HIP/CUDA correctness blocker for long-context workloads) was fixed, and a scheduler-level performance regression caused by uncached `cudaGetDeviceProperties` calls under tensor overrides was resolved. Quantization infrastructure took a step forward with fp8/NVFP4 scale support landing in ggml, while the Inkling-2 loop architecture continues to generate both multi-GPU locality PRs and bug reports. On the ops side, the AGENTS.md contributor guide is being reworked to improve human-facing communication.

## 2. Releases & Breaking Changes

- **b12823** — CUDA: fix ADD_ID launch for >65535 tokens. [PR #33162](https://github.com/ggml-org/llama.cpp/pull/33162)
- **b12822** — Vulkan: handle empty conv3d kernel (fixes validation error). [PR #33106](https://github.com/ggml-org/llama.cpp/pull/33106)
- **b12821** — Vulkan: further optimize coopmat2 GDN. [PR #32860](https://github.com/ggml-org/llama.cpp/pull/32860)
- **b12820** — ggml-zdnn: make zTensor memory usage visible for fitting. [PR #31849](https://github.com/ggml-org/llama.cpp/pull/31849)
- **b12819** — CUDA: cache device type at init. [PR #33142](https://github.com/ggml-org/llama.cpp/pull/33142)
- **b12818** — ggml: support quant scales for fp8 and nvfp4 (per-tensor, per-channel, per-expert, per-expert-per-channel + activation scales). [PR #28898](https://github.com/ggml-org/llama.cpp/pull/28898)
- **b12816** — graph: read recurrent states in place instead of copying. [PR #30139](https://github.com/ggml-org/llama.cpp/pull/30139)
- **b12815** — CUDA: fix NVFP4 MMQ y_scale over-read in stream-k fixup. [PR #33136](https://github.com/ggml-org/llama.cpp/pull/33136)
- **b12814** — moe-cache: support experts selected on another backend. [PR #33133](https://github.com/ggml-org/llama.cpp/pull/33133)
- **b12812** — Metal: check all fused nodes for concurrency. [PR #33175](https://github.com/ggml-org/llama.cpp/pull/33175)

No API/config breaking changes announced today. Note the in-flight FA bias API cleanup ([PR #33178](https://github.com/ggml-org/llama.cpp/pull/33178)) which moves validation into `ggml_flash_attn_ext_set_bias()` — relevant if you have custom flash-attention integrations.

## 3. New Model & Hardware Support

- **fp8 / NVFP4 quant scales** (b12818) — ggml now supports per-tensor, per-channel, per-expert, and per-expert-per-channel scaling, plus optional activation scales on `mul_mat`/`mul_mat_id`, with BitNet scale handling. This is foundational for FP8 and NVFP4 inference paths. [PR #28898](https://github.com/ggml-org/llama.cpp/pull/28898)
- **HRX backend (experimental)** — new ggml backend for AMD GPUs using the HRX runtime; kernels written in Loom and JIT-compiled. Currently validated on TinyStories-15M; a Qwen3.6-35B-A3B branch is in progress. [PR #32700](https://github.com/ggml-org/llama.cpp/pull/32700)
- **Inkling2 tensor split** — `-sm tensor` support for Inkling 2, splitting history into KV (split) and attn/ffn (mirrored). [PR #32751](https://github.com/ggml-org/llama.cpp/pull/32751)
- **zDNN memory visibility** — IBM zDNN buffer usage is now visible to the fitter. [PR #31849](https://github.com/ggml-org/llama.cpp/pull/31849)
- **Ternary quant formats requested** — Prism PQ2_0 (GGML type 142) and PTQ1_0 (type 143) for Ternary-Bonsai-2 are under discussion but not yet implemented. [Issue #29058](https://github.com/ggml-org/llama.cpp/issues/29058)

## 4. Performance & Optimization

- **CUDA device-type caching (b12819)** — `ggml_backend_cuda_device_get_type` was calling `cudaGetDeviceProperties` on every invocation (~0.7–1 ms under CUDA 12). This was the root cause of the scheduler slowdown in [Issue #33132](https://github.com/ggml-org/llama.cpp/issues/33132) (up to ~8x degradation with tensor overrides across multiple GPUs). Cache now populated at init. [PR #33142](https://github.com/ggml-org/llama.cpp/pull/33142)
- **Graph recurrent state in-place reads (b12816)** — eliminates state copy steps; expected throughput improvement on recurrent/looped architectures (Mamba, GDN, Inkling). [PR #30139](https://github.com/ggml-org/llama.cpp/pull/30139)
- **Vulkan coopmat2 GDN (b12821)** — refactor of split+store callbacks to enable vectorized stores and interleave state store with gram_pmat work. [PR #32860](https://github.com/ggml-org/llama.cpp/pull/32860)
- **HIP sum reduction via DPP** — `warp_reduce_sum` reimplemented with `__builtin_amdgcn_mov_dpp` instead of `ds_permute_*`, avoiding the LDS bridge. [PR #32215](https://github.com/ggml-org/llama.cpp/pull/32215)
- **Vulkan pool1d subgroup shader** — fixes a bottleneck in wide-pool1d models like Mellum 2.1 Instruct. [PR #33221](https://github.com/ggml-org/llama.cpp/pull/33221)
- **Vulkan IQ1/IQ2/IQ3 grid tables → storage buffer** — addresses LDC divergence on NVIDIA where the const-memory uniform read assumption is violated. [PR #32915](https://github.com/ggml-org/llama.cpp/pull/32915)
- **SYCL GDN replay** — replaces rollback, fixing the perf regression from #31669 that caused graph splits and pp/tg degradation on Qwen 3.8 27B. [PR #33220](https://github.com/ggml-org/llama.cpp/pull/33220)
- **Metal elu Taylor series** — `ggml_metal_expm1` for |x| ≤ 0.5. [PR #33226](https://github.com/ggml-org/llama.cpp/pull/33226)
- **CUDA k_get_rows grid-stride fix** — corrected loop stride in quantized kernel. [PR #33140](https://github.com/ggml-org/llama.cpp/pull/33140)

## 5. Stability & Regressions

Ranked by severity:

1. **CUDA graphs hang RTX 5090 Laptop (sm_120)** — RC watchdog + Xid 8; `GGML_CUDA_DISABLE_GRAPHS=1` is a complete workaround. 7 👍, still open since August. [Issue #27330](https://github.com/ggml-org/llama.cpp/issues/27330)
2. **SYCL decode hang on Xe3 (Panther Lake)** — `ggml_backend_sycl_synchronize` hangs unless `GGML_SYCL_USE_ASYNC_MEM_OP=0`. [Issue #31547](https://github.com/ggml-org/llama.cpp/issues/31547)
3. **Vulkan Intel Gen9.5 iGPU GPU hang + SIGABRT** — deterministic with q8_0 KV cache; `vk::Error` escapes as `std::terminate`. [Issue #29054](https://github.com/ggml-org/llama.cpp/issues/29054)
4. **HIP VMM infinite hang** — `CU_CHECK(err)` macro shadows a local variable, causing `cuMemAddressReserve` to spin. Fix PR: [PR #33227](https://github.com/ggml-org/llama.cpp/pull/33227). [Issue #32105](https://github.com/ggml-org/llama.cpp/issues/32105)
5. **CUDA `--split-mode tensor` assert** — `GGML_ASSERT(bcj.nodes[i])` on second request with 2–3x Tesla P100. [Issue #29466](https://github.com/ggml-org/llama.cpp/issues/29466)
6. **Inkling-2-Mini CUDA0 compute buffer ~7.2–7.8 GB regardless of `-ngl`** — allocation not respecting offload config. [Issue #32910](https://github.com/ggml-org/llama.cpp/issues/32910)
7. **Inkling 2 Mini crash with `--moe-cache-mib`** — recently closed. [Issue #33101](https://github.com/ggml-org/llama.cpp/issues/33101)
8. **Inkling 2 Mini KV cache locality mismatch under layer split** — extra cross-device transfers. Fix PR: [PR #33198](https://github.com/ggml-org/llama.cpp/pull/33198). [Issue #32785](https://github.com/ggml-org/llama.cpp/issues/32785)
9. **`/v1/completions` logprobs nondeterministic** on SYCL iGPU + MoE; request seed does not pin the distribution. [Issue #31206](https://github.com/ggml-org/llama.cpp/issues/31206)
10. **OpenVINO backend memory growth** ~35 MB/request on Windows iGPU. [Issue #31129](https://github.com/ggml-org/llama.cpp/issues/31129)
11. **Qwen3.6 27B MTP repeated `////` output** after long sessions. [Issue #23577](https://github.com/ggml-org/llama.cpp/issues/23577)
12. **Qwen 3.8 27B `convert_hf_to_gguf.py` tensor count mismatch** (770 vs 866 expected). [Issue #32918](https://github.com/ggml-org/llama.cpp/issues/32918)
13. **Vulkan GDN/Qwen3.8-Flash `/` spam** on RADV with transfer queues — recently closed. [Issue #30768](https://github.com/ggml-org/llama.cpp/issues/30768)
14. **Volta FA dispatch** picks a 16-column MMA kernel with `NO_DEVICE_CODE` for DKQ=576, `gqa_ratio % 16 == 8`. [Issue #31555](https://github.com/ggml-org/llama.cpp/issues/31555)
15. **Inkling2 tool-call parsing** — `tool_choice=auto` scanning grammar being migrated; see [PR #32833](https://github.com/ggml-org/llama.cpp/pull/32833). Related content-leak bug: [Issue #30118](https://github.com/ggml-org/llama.cpp/issues/30118)

## 6. What This Means for Application Developers

- **Long-context serving is safer on CUDA/HIP.** If you run >64k-token contexts (RAG, long agent traces, code review), b12823 removes a hard failure that previously triggered `invalid configuration argument` on ADD_ID launches. Pair with b12819's device-type caching if you use `-ot`/`--override-tensor` across multiple GPUs — that regression was silently costing up to 8x throughput.
- **FP8/NVFP4 quantization is now first-class in ggml.** The new per-expert and per-expert-per-channel scales (b12818) are exactly what production MoE FP4 checkpoints need. If you maintain a quantizer or convert HF weights, this is the moment to wire up scale tensors before the ecosystem standardizes.
- **Recurrent/looped architectures get cheaper per token.** The in-place recurrent state read (b12816) and the ongoing Inkling2 multi-GPU locality work (PR #33198) are the two levers for Mamba/GDN/Inkling class models. Multi-GPU layer split users should watch these — the current behavior incurs hidden cross-device transfers per loop pass.
- **Agents on Inkling-2 should pin versions carefully.** The parser migration (PR #32833) and multiple open Inkling-2 locality/crash bugs mean tool-calling on this architecture is still churning. If you deploy agents on Inkling, subscribe to #32785 and #33101.
- **Multi-backend MoE caching is more flexible** (b12814) — expert caches can now be sourced from a different backend than the cache itself, which matters for hybrid CPU/GPU or heterogeneous rigs.
- **Windows/SYCL/OpenVINO users** should treat the current state as not yet production-clean: three open hang/leak issues (#27330, #31547, #31129) have no merged fixes today. Workarounds exist but should be tracked in your deployment runbooks.

</details>

<details>
<summary><strong>Ollama</strong> — <a href="https://github.com/ollama/ollama">ollama/ollama</a></summary>

# Ollama Digest — 2026-11-28

## 1. Today's Highlights

No new releases landed in the last 24 hours, but the issue tracker is dominated by **0.40.18 regressions** across three fronts: MLX runner history over-eviction on Apple Silicon ([#19962](https://github.com/ollama/ollama/issues/19962)), a JSON-schema/grammar failure on Windows ROCm ([#19918](https://github.com/ollama/ollama/issues/19918)), and continued DGX Spark instability ([#19927](https://github.com/ollama/ollama/issues/19927)). A cluster of API-conformance and parser-correctness fixes (OpenAI `/v1/responses`, `/v1/chat/completions` logprobs, cogito/deepseek3 thinking-tag trimming) are queued as PRs from the same contributor, suggesting a cleanup sweep on the OpenAI-compat surface. Separately, a batch of long-standing correctness PRs from `mann1x` around thinking budgets and tool-call parsing were refreshed, signaling active work on agent-reliability.

## 2. Releases & Breaking Changes

No new releases in the last 24h. Relevant context for operators on 0.40.18:

- **0.40.18 behavior change under investigation**: JSON-schema requests now fail mid-load with `Unexpected empty grammar stack after accepting piece: @ (31)` and return **HTTP 200 with an empty body** on Windows ROCm — a silent-failure mode that will break schema-constrained clients. Reported in [#19918](https://github.com/ollama/ollama/issues/19918).
- **Wrong-typed request options return HTTP 500 instead of 400** on `/api/generate`, `/api/chat`, `/api/embed` ([#19945](https://github.com/ollama/ollama/issues/19945)). Fix PR: [#19954](https://github.com/ollama/ollama/pull/19954).
- **`/v1/completions` with `max_tokens: 0` generates text instead of returning empty** ([#19965](https://github.com/ollama/ollama/issues/19965)) — a spec-compliance edge case that will surprise callers using zero-budget probes.

## 3. New Model & Hardware Support

- **Inkling-2-mini on DGX Spark (GB10)**: Newly exercised model, but currently unusable — crashes the host on the latest Docker image ([#19879](https://github.com/ollama/ollama/issues/19879), CLOSED) and continues to freeze systems even after the issue was closed, per [#19927](https://github.com/ollama/ollama/issues/19927) (OPEN, upgrading 0.34.4 → 0.40.18 destabilizes previously stable models too).
- **CUDA_VISIBLE_DEVICES on dual-GPU hosts (RTX 4090 + RTX 5090)**: 5090 is discovered then filtered as "didn't fully initialize," silently falling back to CPU-only inference ([#19921](https://github.com/ollama/ollama/issues/19921)). No fix PR yet.
- **Vulkan on RDNA1 (RX 5700 XT, gfx1010)**: Functional but badly regressed vs upstream llama.cpp — see Performance section.
- **DeepSeek v4-flash / v4.1-flash local availability**: Community requests for downloadable local model files remain open/unaddressed ([#17510](https://github.com/ollama/ollama/issues/17510), [#18379](https://github.com/ollama/ollama/issues/18379)); one was closed without a local-model commitment.

## 4. Performance & Optimization

- **Vulkan RDNA1 prompt processing ~13× slower than upstream llama.cpp** (40 vs ~540 t/s), generation ~17% slower on RX 5700 XT with `OLLAMA_VULKAN=1` ([#19747](https://github.com/ollama/ollama/issues/19747)). This is the most concrete perf regression in the dataset and suggests the Vulkan backend is not yet at parity for older AMD architectures.
- **MLX prefix cache fully evicted past ~64k tokens on Inkling 2** because the relative-attention prefill peak grows with context; every turn re-prefills the whole conversation ([#19819](https://github.com/ollama/ollama/issues/19819)). Related: **hybrid models (Qwen3.8 27B) re-read up to 8k tokens on chat follow-ups** ([#19952](https://github.com/ollama/ollama/issues/19952)).
- **O(N²) image-marker string construction** costs a CPU-minute on a 192 KB body with 64k empty images ([#19885](https://github.com/ollama/ollama/issues/19885)) — a DoS-shaped inefficiency in the request path.
- **`/api/chat` truncation re-renders and re-tokenizes the whole remaining history once per dropped message** ([#19942](https://github.com/ollama/ollama/issues/19942)) — quadratic cost for long histories.
- **In-flight optimizations**: MLX runner cache-persistence fix ([#19964](https://github.com/ollama/ollama/pull/19964) fixes [#19962](https://github.com/ollama/ollama/issues/19962)); macOS kernel-reported available memory for better MLX retention ([#19907](https://github.com/ollama/ollama/pull/19907)); MLX DFlash2 batched proposals and recurrent replay ([#19769](https://github.com/ollama/ollama/pull/19769)); persistent inactive conversation caches ([#19745](https://github.com/ollama/ollama/pull/19745)); default `top_p`/`min_p` aligned to llama.cpp (0.95, 0.05) ([#19871](https://github.com/ollama/ollama/pull/19871)).

## 5. Stability & Regressions

Ranked by severity:

1. **Host crash / hard-reboot required — DGX Spark + Inkling-2-mini** ([#19879](https://github.com/ollama/ollama/issues/19879), CLOSED) and **system-wide instability after 0.34.4 → 0.40.18** affecting multiple models ([#19927](https://github.com/ollama/ollama/issues/19927), OPEN). No fix PR identified; operator workaround is to pin 0.34.4.
2. **Silent JSON-schema failure returning HTTP 200 with empty body** on Windows ROCm ([#19918](https://github.com/ollama/ollama/issues/19918)). This is dangerous because clients cannot distinguish success from failure. No fix PR yet.
3. **MLX history over-eviction on 64 GB M5 Pro**: long chats retain only the first 8191 tokens with ~17 GiB free ([#19962](https://github.com/ollama/ollama/issues/19962)). **Fix PR open**: [#19964](https://github.com/ollama/ollama/pull/19964).
4. **CUDA_VISIBLE_DEVICES silently drops RTX 5090 → CPU-only inference** ([#19921](https://github.com/ollama/ollama/issues/19921)). No fix PR; affects multi-GPU scheduling.
5. **Install script breaks Linux systems with older GPUs** by force-installing incompatible NVIDIA drivers without architecture checks ([#19933](https://github.com/ollama/ollama/issues/19933)). No fix PR.
6. **FunctionGemma parser splits at `<end_function_call>` inside an escaped string**, producing nameless tool calls with empty args and leaking suffix as content ([#19935](https://github.com/ollama/ollama/issues/19935)). No fix PR.
7. **Qwen3.5 tool call can open before the thinking channel closes** ([#18624](https://github.com/ollama/ollama/pull/18624)) and **gemma4 tool calls missing closing brace are dropped** ([#17565](https://github.com/ollama/ollama/pull/17565)) — both with open fix PRs.
8. **Cogito parser emits leading `\n\n` after ``** on streamed responses ([#19955](https://github.com/ollama/ollama/issues/19955)); fix PR [#19956](https://github.com/ollama/ollama/pull/19956). Same pattern for deepseek3 ([#19590](https://github.com/ollama/ollama/pull/19590)).
9. **`/v1/responses` stream reuses `output_index`** when reasoning follows text in the same turn ([#19958](https://github.com/ollama/ollama/issues/19958)); fix PR [#19959](https://github.com/ollama/ollama/pull/19959).
10. **HIGH CVE vulnerabilities reported in the Ollama Go binary** ([#19771](https://github.com/ollama/ollama/issues/19771)). No detail in the issue body; worth tracking for supply-chain review.
11. **Claude Desktop integration broken** ([#18073](https://github.com/ollama/ollama/issues/18073)) and **Apps page mislabels Claude Desktop as Claude Code** ([#19950](https://github.com/ollama/ollama/issues/19950)); labeling fix PR [#19963](https://github.com/ollama/ollama/pull/19963).
12. **0.4.17 OOM regression**: models that loaded in 0.40.15 now OOM ([#19851](https://github.com/ollama/ollama/issues/19851)). Awaiting more info.

## 6. What This Means for Application Developers

- **Do not auto-upgrade to 0.40.18 on Windows/ROCm if you rely on structured output.** The empty-body-with-200 behavior on schema failures ([#19918](https://github.com/ollama/ollama/issues/19918)) will silently corrupt agent pipelines that don't validate response bodies. Add explicit emptiness checks regardless.
- **Treat `max_tokens: 0` as undefined behavior** for now ([#19965](https://github.com/ollama/ollama/issues/19965)) — do not use it as a cheap preflight.
- **Multi-GPU users: verify device selection actually took effect.** A silently CPU-bound 5090 ([#19921](https://github.com/ollama/ollama/issues/19921)) will show up as a throughput cliff, not an error. Log the resolved device at startup.
- **Long-context agents on Apple Silicon should cap conversation length or expect re-prefill.** Both [#19962](https://github.com/ollama/ollama/issues/19962) and [#19819](https://github.com/ollama/ollama/issues/19819) describe prefix-cache eviction that turns multi-turn latency linear in history. Fix PR [#19964](https://github.com/ollama/ollama/pull/19964) addresses part of this; track it before shipping long-session agents.
- **Tool-calling reliability is actively being patched** (thinking-budget termination at word boundaries [#18212](https://github.com/ollama/ollama/pull/18212), incomplete tool-call suppression [#17564](https://github.com/ollama/ollama/pull/17564), Qwen3.5 channel ordering [#18624](https://github.com/ollama/ollama/pull/18624)). If you build coding agents, these PRs are worth watching — several are months old and still open.
- **OpenAI-compat surface is converging but not yet conformant**: logprobs shape ([#19960](https://github.com/ollama/ollama/issues/19960), fix [#19961](https://github.com/ollama/ollama/pull/19961)) and `/v1/responses` streaming indices ([#19958](https://github.com/ollama/ollama/issues/19958), fix [#19959](https://github.com/ollama/ollama/pull/19959)) both deviate from spec today. Clients that strictly parse these fields will break.
- **Defaults are changing**: PR [#19871](https://github.com/ollama/ollama/pull/19871) would align `top_p`/`min_p` with llama.cpp (0.95, 0.05). If you've tuned prompts against Ollama's current defaults, re-validate before adopting.

</details>

<details>
<summary><strong>LiteLLM</strong> — <a href="https://github.com/BerriAI/litellm">BerriAI/litellm</a></summary>

# LiteLLM Digest — 2026-11-28

## 1. Today's Highlights

The 1.108.20 LTS release ships with an updated `lts` container tag (`ghcr.io/berriai/litellm:lts`), making it the recommended pin for production deployments. Activity is dominated by a large MCP OAuth hardening series (reactive token refresh, race-condition fixes on revocation/fencing) and continued migration work toward a native Rust gateway path for Bedrock/Vertex. Several long-standing correctness bugs remain open, notably a process-global Bedrock tool-name cache that leaks state across requests and API keys.

## 2. Releases & Breaking Changes

- **v1.108.20 (LTS)** — Latest LTS patch. The `lts` image tag now always resolves to the newest LTS release; verify with `cosign` using the documented certificate identity. [Release notes](https://github.com/BerriAI/litellm/releases)
- **No breaking API/config changes announced today.** Note that a regression in `v1.110.2` (see §5) means teams on non-LTS 1.110.x should audit Gemini/Vertex image usage accounting before upgrading.

## 3. New Model & Hardware Support

- **Vertex AI Chirp 3 HD STT/TTS via gRPC + WebSocket** — PR #36233 adds streaming support for Chirp 3 HD voices and Chirp STT models (`chirp`, `chirp_2`, `chirp_telephony`), which previously errored on the REST path. [PR #36233](https://github.com/BerriAI/litellm/pull/36233)
- **Native Claude on Vertex AI, Bedrock, and Mantle (Rust gateway)** — PR #54613 wires prior stack changes into the admission phase; PR #54611 fixes Azure credential rules incorrectly requiring an `api_key` for Bedrock/Vertex, which don't always need one. [PR #54613](https://github.com/BerriAI/litellm/pull/54613) · [PR #54611](https://github.com/BerriAI/litellm/pull/54611)
- **Azure AI Foundry `Microsoft-Decision-1.1`** — Cost map currently only carries the Global Standard rate; US/EU Data Zone prices are missing and cause understated spend (open bug). [Issue #53787](https://github.com/BerriAI/litellm/issues/53787)

## 4. Performance & Optimization

- **Per-key / per-team model ITPM/OTPM limits in the v3 rate limiter** — PR #54311 introduces separate input/output token-per-minute limits scoped to keys and teams, closing a gap where one key could consume a model's entire shared output-token quota. [PR #54311](https://github.com/BerriAI/litellm/pull/54311)
- **Prometheus outcomes for routed deployment attempts** — Open feature request to expose per-attempt outcomes (not just fallback success counts) when a primary deployment fails and a fallback returns HTTP 200. [Issue #53040](https://github.com/BerriAI/litellm/issues/53040)
- **Team-scoped rate limit gauges** — Feature request for Prometheus gauges mirroring existing key-scope limits. [Issue #37970](https://github.com/BerriAI/litellm/issues/37970)
- **uvloop socket double-close** — `uv.lock` pins uvloop 0.22.1, which can close unrelated sockets after a cancelled connect (fixed upstream in 0.23.0). [Issue #44623](https://github.com/BerriAI/litellm/issues/44623)

## 5. Stability & Regressions

Ranked by severity:

1. **Gemini image `thoughtsTokenCount` regression in v1.110.2** (HIGH — billing correctness) — Regression of #52220; thinking tokens are no longer counted as output tokens, understating billed usage. Fix not yet merged. [Issue #54804](https://github.com/BerriAI/litellm/issues/54804)
2. **Process-global `bedrock_tool_name_mappings` cross-tenant leak** (HIGH — correctness/security) — On Bedrock Converse, tool names are rewritten via a process-global cache shared across requests and API keys; one request's mapping can corrupt another's. [Issue #54172](https://github.com/BerriAI/litellm/issues/54172)
3. **Vertex embeddings silently fuse list inputs** (HIGH — silent data loss) — `/v1/embeddings` on `vertex_ai/` routes with list input returns only one vector while billing for all inputs. HTTP 200 means callers lose N-1 vectors undetected. [Issue #38823](https://github.com/BerriAI/litellm/issues/38823)
4. **`/v1/responses` + Anthropic reorders thinking/text blocks** (MEDIUM) — Replay without `previous_response_id` collapses signed thinking blocks, causing Claude 5.x to reject the conversation. **Fix PR exists:** #54872. [Issue #54855](https://github.com/BerriAI/litellm/issues/54855) · [PR #54872](https://github.com/BerriAI/litellm/pull/54872)
5. **Gemini generateContent → Anthropic drops parallel function calls** (MEDIUM) — Duplicate `functionCall` parts for the same function lose tool calls and duplicate `tool_result` ids. [Issue #53345](https://github.com/BerriAI/litellm/issues/53345)
6. **`LoggingWorker` strands worker task on event loop change** (MEDIUM) — In multi-loop worker pools, the bound loop flips per thread, dropping the queue without cancellation. [Issue #36548](https://github.com/BerriAI/litellm/issues/36548)
7. **`validate_environment` triggers OAuth device login** (MEDIUM) — Read-only lookups on `chatgpt/` and `github_copilot/` models start a device flow, which is surprising in scripts. [Issue #54763](https://github.com/BerriAI/litellm/issues/54763)
8. **MCP OAuth RFC 9207 issuer mismatch** (MEDIUM) — The `dcr_bridge` relay arm serves a discovery doc with the gateway's issuer but redirects to the upstream AS. Related MCP OAuth hardening PRs are in flight: #54812–#54816. [Issue #49857](https://github.com/BerriAI/litellm/issues/49857)
9. **Token counting: `video_url` content blocks raise ValueError** (LOW) — `token_counter()` rejects OpenAI-style video blocks. [Issue #28071](https://github.com/BerriAI/litellm/issues/28071)
10. **`--debug` bound to bare `DEBUG` env var** (LOW) — Any unrelated `DEBUG=...` in the shell silently enables debug logging on the proxy CLI. [Issue #38781](https://github.com/BerriAI/litellm/issues/38781)

## 6. What This Means for Application Developers

- **Pin to the LTS tag.** With `ghcr.io/berriai/litellm:lts` now tracking the newest LTS patch, production deployments should standardize on it — particularly given the unreverted v1.110.2 Gemini billing regression.
- **Audit multi-tenant Bedrock and Vertex embedding paths.** The global tool-name cache leak and the silent embedding fusion are the two issues most likely to cause hard-to-debug correctness failures in production; both return HTTP 200 and require explicit validation on your side until fixed.
- **MCP OAuth is maturing but still moving.** If you run MCP servers behind LiteLLM's OAuth bridge, expect improvements from the in-flight token store series (#54812–#54816) but pin carefully, as RFC 9207 conformance is not yet fully resolved.
- **Replay of Anthropic adaptive thinking requires care.** If you store and replay reasoning items through `/v1/responses`, either upgrade once #54872 lands or persist `previous_response_id` to avoid the reordering rejection.
- **Per-key ITPM/OTPM limits are coming.** Teams sharing a model quota across keys should track #54311 — it closes the shared output-token exhaustion vector that project-scoped limits alone don't cover.

</details>

<details>
<summary><strong>Unsloth</strong> — <a href="https://github.com/unslothai/unsloth">unslothai/unsloth</a></summary>

# Unsloth Digest — 2026-11-28

## 1. Today's Highlights

A large batch of `danielhanchen` PRs landed around GGUF-packed LoRA training, native FSDP2, and Studio's memory estimator, headlined by a packed-GGUF training speedup and expanded architecture support for Inkling 2 and Qwen3.5 GGUFs. Separately, Studio's inference path continues to harden around multi-GPU/Apple Silicon edge cases (Strix Halo UMA accounting, MLX FP16 loading, Windows integrated CUDA memory capping). No new releases were cut in the last 24h; all movement is in PRs and issue triage.

## 2. Releases & Breaking Changes

No new releases in the last 24h. One install-path change is worth noting for Apple Silicon users:

- **`install.sh` now pulls torch 2.14.1 for new Apple Silicon installs and Repair** (`UNSLOTH_TORCH_UPGRADE=1`), with measured Studio MPS image speedups of 1.16–1.45x over torch 2.13. Existing homes keep their torch on plain re-run/`studio update`. — [PR #20066](https://github.com/unslothai/unsloth/pull/20066)

## 3. New Model & Hardware Support

- **Inkling 2 GGUFs (Small/Mini) now load under `gguf_packed = True`** with quantized Linears and MoE expert stacks kept packed for LoRA. Previously refused by architecture name. — [PR #20080](https://github.com/unslothai/unsloth/pull/20080)
- **Qwen3.5 GGUFs with fused `attn_qkv_gate` / `ssm_beta_alpha` tensors** (as written by the current llama.cpp converter and `save_pretrained_gguf`) are now loadable. — [PR #20070](https://github.com/unslothai/unsloth/pull/20070)
- **Native FSDP2 now keeps packed MoE expert stacks** (NVFP4, MXFP8, block FP8, MXFP4, GGUF) replicated instead of crashing in `fully_shard`. — [PR #20089](https://github.com/unslothai/unsloth/pull/20089)
- **Qualcomm Hexagon NPU (HTP0) support for Windows on Snapdragon (ARM64)** proposed in Studio, mirroring the existing AMD XDNA 2 backend. — [PR #19316](https://github.com/unslothai/unsloth/pull/19316)
- **Ollama MLX-format manifest scanning hardened**: a malformed manifest now skips its tag rather than aborting the whole scan. — [PR #20088](https://github.com/unslothai/unsloth/pull/20088)

## 4. Performance & Optimization

- **Packed GGUF LoRA training speedup** (`gguf_packed = True`): constant ggml type/shape under `torch.compile`, recompute reuse, and zoo kernels on by default. — [PR #20091](https://github.com/unslothai/unsloth/pull/20091)
- **Qwen-Image-2.1 per-row batching** fixes cross-row RoPE contamination from right-padding; measured **2.12x streamed throughput on A100** for mixed-length prompts. — [PR #20072](https://github.com/unslothai/unsloth/pull/20072)
- **FLUX.3 klein batched in one modular call**: **2.69x per 4 images on A100**; Anima kept serial. — [PR #20071](https://github.com/unslothai/unsloth/pull/20071)
- **Portable resume with `UNSLOTH_OFFLOAD_OPTIMIZER_STATE=1`** now keeps offloaded DTensor optimizer moments on host instead of copying each to device first. — [PR #20092](https://github.com/unslothai/unsloth/pull/20092)
- **FSDP2 bitsandbytes 8-bit optimizer export** staged per-parameter on sub-mesh writers (avoids gathering all moments to rank 0 host at once). — [PR #20090](https://github.com/unslothai/unsloth/pull/20090)
- **Live denoise previews are now lazy**: no projection/decode/JPEG work unless a visible page is watching the render (MiniMax-H3 added to the preview set at no output change). — [PR #20081](https://github.com/unslothai/unsloth/pull/20081), [PR #20094](https://github.com/unslothai/unsloth/pull/20094)
- **GGUF memory estimator now weights KV GPU share by cache cells**, correctly accounting for SWA layers vs. full-context layers. — [PR #20082](https://github.com/unslothai/unsloth/pull/20082)

## 5. Stability & Regressions

Ranked by severity:

1. **`_ModuleLock` deadlock + `LanguageModelOutput` TypeError on MLX (Apple Silicon)** when loading/running `LiquidAI/LFM3-1.7B-MLX-4bit` in Studio — intermittent worker crash on load/reload. Closed without a linked fix PR in the feed. — [#19749](https://github.com/unslothai/unsloth/issues/19749)
2. **Prompt cache miss on skill turns**: `@skill` content is appended to the system prompt only on the mentioning turn, so turn 2 re-processes the whole conversation. — [#19212](https://github.com/unslothai/unsloth/issues/19212)
3. **Server-side tools collide with client-provided MCP tools** in the OpenAI-compatible API. — [#19593](https://github.com/unslothai/unsloth/issues/19593)
4. **Remote MCP (GitHub MCP server) intermittent "missing `Mcp-Param-owner` header"** on tool calls; consistent on large `create_or_update_file` payloads. — [#19876](https://github.com/unslothai/unsloth/issues/19876)
5. **Windows Strix Halo UMA accounting**: GPU available memory underestimated when BIOS carve-out reduces Windows-visible RAM (follows #17605/#17607/#18805). — [#19768](https://github.com/unslothai/unsloth/issues/19768)
6. **Windows integrated CUDA (RTX Spark N1X) over-reports memory** (112,350 MiB reported vs. 64 GB Windows commit); fix PR caps llama.cpp allocation at Windows commit. — [PR #20086](https://github.com/unslothai/unsloth/pull/20086)
7. **Studio MLX picker loads local FP16 checkpoint with 4-bit runtime quantization** — unexpected precision loss. — [#20045](https://github.com/unslothai/unsloth/issues/20045)
8. **Local eval scoring bugs**: CSV type inference reverses exact-match scores ([#19476](https://github.com/unslothai/unsloth/issues/19476)); indented code completion scored zero ([#19474](https://github.com/unslothai/unsloth/issues/19474)).
9. **Windows Desktop v0.1.925-beta `install.ps1` Authenticode HashMismatch**, blocked by Kaspersky Adaptive Anomaly Control. — [#19908](https://github.com/unslothai/unsloth/issues/19908)
10. **CSM-1B TTS notebook**: every training clip ends with an off-distribution Mimi frame (pad to 1920 samples). — [#19438](https://github.com/unslothai/unsloth/issues/19438)

Also closed today: AMD RX 6700s (gfx1032) detection failure ([#17874](https://github.com/unslothai/unsloth/issues/17874)), Translate detect-language bug ([#19759](https://github.com/unslothai/unsloth/issues/19759)), CSV chat import "developer" row mishandling ([#19810](https://github.com/unslothai/unsloth/issues/19810)), and prompt-list CSV import trimming ([PR #19640](https://github.com/unslothai/unsloth/pull/19640)).

## 6. What This Means for Application Developers

- **Packed-GGUF LoRA training is now the fast path for quantized fine-tunes.** If you were converting to bf16 to train, `gguf_packed = True` with the new compile/kernel defaults is the intended workflow; Inkling 2 and Qwen3.5 GGUF coverage closes two notable gaps.
- **Memory planning on Windows is getting more honest.** The KV-by-cells estimator and the integrated-CUDA commit cap mean Studio's GGUF memory estimates should be closer to reality on RTX Spark N1X and Strix Halo. Do not trust raw CUDA "total memory" numbers for capacity planning on UMA/integrated parts.
- **Multi-GPU FSDP2 with quantized MoE is now viable.** Packed expert stacks no longer crash `fully_shard`, and offloaded optimizer state on portable resume avoids per-moment device copies — meaningful for large resume-heavy training jobs.
- **Agent builders: watch the MCP and prompt-cache issues.** Server-side vs. client MCP tool collisions ([#19593](https://github.com/unslothai/unsloth/issues/19593)) and the skill-turn cache miss ([#19212](https://github.com/unslothai/unsloth/issues/19212)) directly affect agent latency and tool correctness on the OpenAI-compatible API; both are open with no fix PR yet.
- **Local eval results need scrutiny.** Two independent exact-match scoring bugs (#19476, #19474) mean CSV/JSONL eval scores in the CLI can be wrong on fixed generations — verify scoring against known-good responses before trusting benchmark deltas.
- **Apple Silicon installs on torch 2.14.1 unlock 1.16–1.45x MPS image throughput**, but existing installs won't get it automatically; a Repair or fresh install is required.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*