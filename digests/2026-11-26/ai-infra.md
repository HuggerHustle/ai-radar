# AI Infrastructure Digest 2026-11-26

> Generated: 2026-11-26 03:29 UTC | Projects covered: 6

- [vLLM](https://github.com/vllm-project/vllm)
- [SGLang](https://github.com/sgl-project/sglang)
- [llama.cpp](https://github.com/ggml-org/llama.cpp)
- [Ollama](https://github.com/ollama/ollama)
- [LiteLLM](https://github.com/BerriAI/litellm)
- [Unsloth](https://github.com/unslothai/unsloth)

---

## Cross-Project Comparison

# Cross-Project Comparison Report — AI Infrastructure Ecosystem
**Digest date: 2026-11-26**

---

## 1. Ecosystem Overview

The ecosystem is in a **hardening phase rather than a feature-expansion phase**. All six projects show heavy issue/PR volume but low release cadence, and the dominant narrative across the stack is *correctness debt catching up with performance ambition*: batch-invariance in vLLM, a stability-focused 1.0 in SGLang, deterministic-logprob bugs in llama.cpp's SYCL path, silent-failure regressions in Ollama, and cost-accounting drift in LiteLLM. Simultaneously, the model-support race has moved to **looped/MoE hybrid architectures** (Inkling-2 family, Hy4-Flash, Mistral-Large-4) that stress KV sizing, speculative decoding, and quantized expert paths simultaneously. Notably, three of four engines are converging on the same large MoE models (DeepSeek-V4.1, Kimi-K3, Qwen3.8, GLM-5.x) while diverging sharply on hardware story (ROCm/SYCL/NPU vs. CUDA-first). The takeaway for decision-makers: **pin versions, test per-hardware-target, and treat "200 OK" as insufficient evidence of correctness.**

---

## 2. Activity Comparison

| Project | Layer | Open Issues / Updated | PRs Today | Release Status (24h) | CI / Stability Signal |
|---|---|---|---|---|---|
| **vLLM** | Serving engine (datacenter) | 134 open issues, **500 PRs updated** | Very high (~500 in window) | **None**; multiple breaking changes in flight (Rust frontend default, model retirements) | No CI red flag; 3 High-severity correctness issues open (silent wrong output, NaN logits, batch divergence) |
| **SGLang** | Serving engine (datacenter, PD-disagg) | High; CI tracker at **271 comments** | High (PD-disagg cluster) | **None**; 1.0 scoped as stability release | 🔴 **2 broken / 26 flaky** (tracker #17050); cross-request data leak (#51980) |
| **llama.cpp** | Local/edge runtime | Moderate | Moderate | ✅ **v1.1.0** (b12752) + tokenizer behavior change | ROCm CI red since #32960 (fix PR open); SYCL determinism bugs open |
| **Ollama** | Local runtime / distribution | High (regression cluster) | Moderate | **None**; 0.40.17/0.40.18 regressions | 🔴 Silent 200-empty-body on Windows/ROCm; host-crash OOM reports |
| **LiteLLM** | LLM gateway | High | High (gateway-budget refactor stack) | **None**; LTS branch `lts/1.108.x` active | No CI signal; **import-time crash** (#54369) is a hard startup failure |
| **Unsloth** | Fine-tuning | Moderate | High (Studio PR batch) | ✅ **v0.1.925-beta** (Inkling-2-Mini FT) | SIGSEGV in Studio venv (#19660); multiple AMD/Xe correctness gaps |

**Reading the table:** vLLM has by far the highest throughput of change (500 PRs vs. everything else), consistent with being the largest upstream. SGLang and LiteLLM both show *high churn on control-plane concerns* (PD disaggregation; budget/credential resolution) rather than kernel work alone. Only llama.cpp and Unsloth shipped releases today.

---

## 3. Model Support Race

**Inkling-2 family (Looped Transformer) is the single strongest landing signal today** — and it landed across *four* of the six projects, at different maturity levels:

| Model / Arch | vLLM | SGLang | llama.cpp | Ollama | Unsloth |
|---|---|---|---|---|---|
| **Inkling-2 / -Mini (looped)** | XPU proposal (Arc B60/B70, unmerged) | — | ✅ DFlash2 spec-decode fix (#33049); MoE cache dedup | ⚠️ Loading, but crash/OOM/panic cluster | ✅ **FT support in v0.1.925-beta** |
| **Hy4-Flash (Tencent)** | — | — | ✅ **New arch (#32960)** | — | — |
| **Mistral-Large-4 (1T-A52B)** | — | ✅ **PR #47271** (MLA+DSA, 1M ctx) | — | — | — |
| **DeepSeek-V4.1** | ✅ MI308X monokernel decode; XPU/NPU paths | ✅ **NPU (Ascend A3) fusion** | ✅ Embed in Hy4/DSA paths | — | — |
| **Kimi-K3.1 (sparse MLA)** | ROCm trackers (Kimi-K3) | ✅ **DCP sparse-MLA (#52968)** | — | — | — |
| **Qwen3.8 / 3.8-Flash** | ✅ Multiple ROCm trackers | — | ✅ GDN perf path | ⚠️ Perf regressions (MLX) | — |
| **GLM-5.x** | ✅ Perf carry-over (#57406) | ⚠️ SM120 limitation (#39302) | — | — | — |
| **Gemini 4 / Claude-native / Seedream** | — | — | — | — | — (LiteLLM covers) |

**Who is ahead:**
- **Breadth of frontier-model coverage:** SGLang edges out vLLM today — it landed *native architecture PRs* for Mistral-Large-4, MiniCPM5, Kimi-K3.1/DCP, and DeepSeek-V4.1-on-NPU, versus vLLM's more incremental (hardware-portfolio) additions.
- **Speed of public-arch adoption:** llama.cpp — Hy4-Flash landed essentially same-day, plus the DFlash2 fix that took Inkling draft acceptance from ~0.1% to usable.
- **Fine-tuning-first support:** Unsloth, which shipped the *only* usable FT path for Inkling-2-Mini today.
- **Gateway-level model onboarding (a different axis):** LiteLLM shipped Gemini 4 cache-behavior fixes, native Claude-on-Vertex/Bedrock/Mantle routing, and Volcengine Seedream — the API-compatibility race is running parallel to the engine race.

**Practical implication:** If Inkling-2 or Hy4 is on your roadmap, the *only* production-plausible path today is llama.cpp for inference and Unsloth for FT — both with caveats (SYCL determinism; ROCm OOM).

---

## 4. Performance Frontier

Optimization effort is **concentrated unevenly** across six axes. Ranked by today's activity density:

| Axis | Where the work is | Today's headline items |
|---|---|---|
| **KV cache / memory** | vLLM, SGLang, llama.cpp, Ollama | vLLM KV-offload promotion RFC (#66782), Mooncake SSD KV reuse; SGLang NVFP4-KV *regression* on consumer Blackwell (~29% decode loss); llama.cpp MoE cache dedup (#33072); Ollama MLX prefix-cache leak |
| **Kernels** | llama.cpp, vLLM, Unsloth | SYCL MMQ re-enable, gated-delta-net ESIMD, recurrent-conv fusion; vLLM ROCm monokernel; Unsloth compiled-LoRA launch path (**−11–14% step time**) |
| **Distributed serving** | vLLM, SGLang | PD disaggregation (SGLang default scale-out); vLLM PCP routing, NIXL push-mode; SGLang DCP peer-direct A2A proposal |
| **Quantization** | All four engines | NVFP4/FP8 LoRA baking (Unsloth, vLLM draft head, Blackwell paths); SGLang `mxfp4 + sharded_state` weight-drop bug |
| **Batching / determinism** | vLLM, SGLang | vLLM batch-invariance tracking (#27433) still open; SGLang MXFP8 batch-invariant dense path (SM107) |
| **Scheduling / routing** | SGLang, LiteLLM | `reasoning_effort` as DP-rank load hint; LiteLLM MCP slot-leak fix; gateway budget-refactor stack |

**Structural observation:** The **highest-leverage perf work is now in memory lifetime and determinism, not raw FLOPs**. Eight of today's top perf items are about *not wasting* memory or *not losing reproducibility* — KV eviction, batch invariance, cache dedup, VRAM accounting. The one pure-throughput win (Unsloth compiled LoRA, 11–14%) is a launch-overhead optimization, not a compute one.

**The cautionary data point:** SGLang's NVFP4 KV default (#36797) is a **29% decode regression on SM121** — a reminder that "newer dtype as default" is not automatically faster. Benchmark before accepting defaults.

---

## 5. Layer Positioning

The six projects occupy **four distinct layers** with limited direct overlap:

```
┌─────────────────────────────────────────────────────────────┐
│  GATEWAY / CONTROL PLANE          LiteLLM                    │  ← auth, budgets, routing, cost
├─────────────────────────────────────────────────────────────┤
│  SERVING ENGINES (datacenter)     vLLM      SGLang          │  ← throughput, PagedAttention, PD-disagg
├─────────────────────────────────────────────────────────────┤
│  LOCAL / EDGE RUNTIME             llama.cpp  Ollama         │  ← GGUF, quant, single-box, macOS/SYCL
├─────────────────────────────────────────────────────────────┤
│  TRAINING / FINE-TUNING           Unsloth                    │  ← LoRA/QLoRA, adapter export
└─────────────────────────────────────────────────────────────┘
```

| Project | Layer | Primary differentiation | Where it does *not* compete |
|---|---|---|---|
| **vLLM** | Datacenter engine | Largest contributor surface; CUDA+ROCm+XPU; Rust-frontend transition | Not a local/edge target |
| **SGLang** | Datacenter engine | PD disaggregation as default; NPU/Ascend depth; 1.0 stability scoping | Not a training framework |
| **llama.cpp** | Local/edge runtime | GGUF universal format, CPU/SYCL/Metal/Vulkan breadth, fastest new-arch adoption | Not a datacenter scheduler |
| **Ollama** | Local runtime + model distribution | Turnkey UX, model registry, MLX/CUDA backends; packaging layer over llama.cpp lineage | Not a datacenter engine (limited scaling) |
| **LiteLLM** | Gateway | Multi-provider abstraction, budget/credential/cost control, 100+ provider adapters | Not an inference engine |
| **Unsloth** | Fine-tuning | LoRA/QLoRA speed/VRAM; quantized-adapter export; Studio backend serverification | Not an inference engine |

**Key structural insight:** LiteLLM's "Gemini 4 / native Claude routing" and Unsloth's "OpenAI-compatible API + Studio queues" mean **the gateway layer and the FT layer are each growing their own light serving surfaces**. Expect some boundary friction — e.g., LiteLLM's MCP-slot behavior and Unsloth's server-side-tools-vs-client-MCP conflict (#19593) are the same class of problem appearing in two layers.

---

## 6. Trend Signals

**Signal 1 — Correctness is the new bottleneck.** Every engine has at least one open silent-failure or nondeterminism class bug (vLLM #52442/#55766/#62851; SGLang #51980; llama.cpp #31206/#29183; Ollama #19918). *Watch:* any eval, RL, or cost-attribution pipeline that assumes determinism or trustworthy 200s.

**Signal 2 — Looped/hybrid MoE is the next architecture frontier.** Inkling-2, Hy4-Flash, GLM-5.x, Qwen-GDN hybrids all mix recurrent/looped layers with MoE and speculative decoding. *Watch:* KV-cache sizing math (mamba state slots × `1 + draft_tokens`), batch invariance on hybrid layers, and quantized expert-path correctness (SGLang `mxfp4` drop, llama.cpp ROCm MLA break).

**Signal 3 — Config-permissiveness is being retired.** SGLang 1.0 will turn silent coercions into hard errors; vLLM retires native model impls in favor of Transformers backend; Ollama and Unsloth both have silent param drops (`pad_to_multiple_of`, `additional_drop_params`). *Watch:* your server logs for warnings; they are becoming failures.

**Signal 4 — Defaults are becoming hardware-conditional.** NVFP4 KV regresses on SM121; ROCm needs env-flag audits; Windows FP8 needs fallback; SM120 can't run GLM-5 NoPE MLA. *Watch:* stop treating defaults as portable — gate by arch in your config.

**Signal 5 — Cost/observability truth is lagging transport truth.** LiteLLM's interrupted-stream under-billing, watsonx estimate substitution, and import-time crash show that **the metering plane is the least mature**. *Watch:* reconcile gateway spend against provider invoices before tenant attribution.

**Signal 6 — Speculative decoding is crossing the usability threshold** (DFlash2 acceptance fix; greedy-draft consistency still batch-dependent). *Watch:* log and tune acceptance rates; they swing 10–100x between versions.

**Signal 7 — Gateway-aware caching is a new API surface.** vLLM forwarded-token-IDs RFC (#65502), session-aware KV hints (#52113), SGLang router-aware L1/L2, LiteLLM per-endpoint cache policy. *Watch:* if you run agents with shared prefixes, these RFCs will materially cut cost/latency — but they require gateway↔engine coordination.

---

**Bottom line for decision-makers:** This is the week to *pin, not upgrade*. Two projects shipped releases (llama.cpp v1.1.0 with a tokenizer behavior change; Unsloth with a new FT target), three engines have open silent-failure bugs, and the most consequential landing item — Inkling-2/Hy4 support — is only production-viable via llama.cpp + Unsloth, both with hardware caveats. Track vLLM #27433 (determinism) and SGLang #51980 (data leak) as the two most material open items for application-layer trust.

---

## Per-Project Reports

<details>
<summary><strong>vLLM</strong> — <a href="https://github.com/vllm-project/vllm">vllm-project/vllm</a></summary>

# vLLM Digest — 2026-11-26

## 1. Today's Highlights

No new releases landed in the last 24h, but day-over-day activity is heavy: 134 open issues and 500 PRs updated. The biggest themes are **batch invariance / deterministic inference** (tracking issue #27433 with 107 comments), **KV offload and promotion semantics** (RFC #66782 plus two NIXL push-mode PRs), and **AMD ROCm performance work** (multiple gfx942/gfx950 trackers touching Qwen3.8, GLM, Kimi-K3, Muse Spark, Inkling, and DeepSeek-V4.1). The Rust frontend continues its march toward becoming the default (`vllm serve`) path, with `/v1/decisions` being ported today.

## 2. Releases & Breaking Changes

No new releases in the last 24h.

Notable config/behavior changes in flight (not yet merged):
- **Project-wide model retirements:** [issue #67937](https://github.com/vllm-project/vllm/issues/67937) tracks retiring native Llama and Qwen2 model implementations in favor of the Transformers modeling backend. This will eventually remove `vllm/model_executor/models/llama.py` and the `use_qwen2_attention` Qwen2 path.
- **Rust frontend as default:** [issue #68784](https://github.com/vllm-project/vllm/issues/68784) — `vllm serve` will switch to the Rust frontend for supported configurations once remaining feature gaps (Decisions API, SystemOne, etc.) are closed.
- **QuantizationConfig extension:** [PR #65143](https://github.com/vllm-project/vllm/pull/65143) adds `get_weight_byte_size()` to let out-of-tree quant methods report bytes for MFU/MBU metrics.
- **Draft LM head quantization:** [PR #67908](https://github.com/vllm-project/vllm/pull/67908) opens `draft_lm_head_quantization` beyond the current `Literal["fp8","nvfp4"]` so hardware plugins can register native formats.

## 3. New Model & Hardware Support

- **Intel XPU / Inkling 2:** [issue #69712](https://github.com/vllm-project/vllm/issues/69712) proposes upstreaming `Inkling2LoopForConditionalGeneration` and `Inkling2ForConditionalGeneration` for Arc Pro B60/B70 (Battlemage). Fix PR series tracked alongside.
- **AMD MI308X (gfx942):** [PR #70033](https://github.com/vllm-project/vllm/pull/70033) enables native monokernel decode for DeepSeek-V4.1 on the 80-CU MI308X with an 80-workgroup grid.
- **LibTorch Stable ABI on ROCm:** [issue #67551](https://github.com/vllm-project/vllm/issues/67551) requests libtorch-ABI-stable ROCm wheels, following the CUDA build's recent migration.
- **Mooncake SSD offloading:** [PR #68903](https://github.com/vllm-project/vllm/pull/68903) adds SSD-backed cross-encoder KV reuse via external Mooncake Store (validated on 4×H800 2E2PD with Qwen3-VL-8B).
- **8-bit/DFlash drafter quantization fixes:** [PR #70032](https://github.com/vllm-project/vllm/pull/70032) fixes `packed_modules_mapping` so quantized drafters (compressed-tensors W4A16) load fused `qkv_proj`/`gate_up_proj` correctly.

## 4. Performance & Optimization

- **Batch invariance still open:** [issue #27433](https://github.com/vllm-project/vllm/issues/27433) (107 comments) tracks remaining work beyond the initial nondeterminism fix. Affects reproducibility across batching and preemption — relevant for eval and RL.
- **GLM 5.3 optimization:** [issue #57406](https://github.com/vllm-project/vllm/issues/57406) — GLM-5.3 shares the `glm_moe_dsa` base with GLM-5.2, so prior kernel wins carry over; new CUDA items listed.
- **ROCm trackers:** Qwen3.8-2.4T-A95B on MI355X ([#57149](https://github.com/vllm-project/vllm/issues/57149), 39 comments), Qwen3.8-Flash-Next on MI355X ([#59575](https://github.com/vllm-project/vllm/issues/59575)), and Muse Spark Open PTPC-FP8 on gfx942 ([#64018](https://github.com/vllm-project/vllm/issues/64018)).
- **PCP single-token prefill routing:** [PR #69512](https://github.com/vllm-project/vllm/pull/69512) routes cached single-token prefills (prefix-cache hits, final chunked-prefill tails) through the decode path under Prefill Context Parallelism.
- **LoRA shrink split-K cap:** [PR #61087](https://github.com/vllm-project/vllm/pull/61087) (merged/closed today) caps split-K at K block count to avoid empty reduction programs.
- **ROCm PR time:** [issue #66411](https://github.com/vllm-project/vllm/issues/66411) reports P50 dropped from 73.2 min to 53.9 min (P90 95.3), targeting ~30 min.
- **Compile cache portability:** [PR #69470](https://github.com/vllm-project/vllm/pull/69470) prevents Inductor from retuning/writing to stale absolute paths when a Triton compile cache is copied. [PR #69748](https://github.com/vllm-project/vllm/pull/69748) skips compiler source hashing when compilation is disabled, speeding startup.

## 5. Stability & Regressions (ranked by severity)

**High — silent wrong output on ROCm:**
- [issue #52442](https://github.com/vllm-project/vllm/issues/52442) — Kimi-K3 A8W4 SiTU MoE on MI350X silently produces garbage when `AITER_SITUV2_A8W4` is set without `VLLM_ROCM_USE_AITER_MOE_SITUV2_A8W4`. No guard today.

**High — NaN logits after prefix-cache hit:**
- [issue #55766](https://github.com/vllm-project/vllm/issues/55766) — Qwen3.5/3.8 hybrid GDN NaN logits when prior prefill ended 4–10 tokens past a block boundary (v0.28.0, mamba cache mode align). Repro is deterministic.

**High — batch-dependent divergence:**
- [issue #62851](https://github.com/vllm-project/vllm/issues/62851) — Qwen3.6 GDN greedy DFlash2 diverges from batch-dependent numerics and preemption/recompute on v0.31.0.

**Medium — decode starvation:**
- [issue #54919](https://github.com/vllm-project/vllm/issues/54919) — Qwen3.8-Flash-Next long-prefill workloads starve active decode for 3–7 min on 2-node DGX Spark TP2.

**Medium — cold-replay corruption (closed):**
- [issue #52150](https://github.com/vllm-project/vllm/issues/52150) — GLM-5.2-FP8 on gfx942 emitted garbage on first request after idle; workaround `cudagraph_mode=FULL_DECODE_ONLY`. Now closed.

**Medium — parser correctness:**
- [issue #69243](https://github.com/vllm-project/vllm/issues/69243) — Ripple parser drops text after tool-call/think tags appearing in plain prose. Repro is CPU-only, no weights required.

**Low — memory lifetime:**
- [PR #64465](https://github.com/vllm-project/vllm/pull/64465) — `CuMemAllocator.wake_up()` clears `is_asleep` before host→device copy; a failed copy leaves the allocation stranded and silently skipped on next wake.

**Low — startup:**
- [PR #69470](https://github.com/vllm-project/vllm/pull/69470) — startup failure or spurious retune when a Triton compile cache is moved to another path.

**Frontend/API:**
- [PR #69587](https://github.com/vllm-project/vllm/pull/69587) — rejects batched `/v1/completions` requests that share a P2P `remote_kv_source` transfer ID (HTTP 400) to prevent KV transfer collisions.

## 6. What This Means for Application Developers

- **Determinism is not yet a guarantee.** If you're building eval harnesses, RL loops, or anything relying on reproducible outputs across batch sizes, keep tracking [issue #27433](https://github.com/vllm-project/vllm/issues/27433) and [#62851](https://github.com/vllm-project/vllm/issues/62851). Batch-invariance is progressing but not complete.
- **Prefix caching has correctness caveats on hybrid models.** The NaN issue in [#55766](https://github.com/vllm-project/vllm/issues/55766) (Qwen3.5/3.8 GDN) is a live risk if your traffic patterns produce prefill tails past block boundaries. Consider pinning a known-good version or reducing block-boundary straddling until fixed.
- **KR offload is getting more nuanced.** [RFC #66782](https://github.com/vllm-project/vllm/issues/66782) proposes deciding KV promotions at promotion time (pin until load) rather than at lookup time — this should reduce over-commit and lifetime bans under aggressive offload policies. Watch if you push hard on CPU-tier KV.
- **Session-aware KV hints are being formalized.** [RFC #52113](https://github.com/vllm-project/vllm/issues/52113) would let agentic clients declare "child agent will resume soon" or "branch complete, release KV" — meaningful for multi-agent apps with shared system/tool prefixes.
- **Router/gateway token forwarding is landing.** [RFC #65502](https://github.com/vllm-project/vllm/issues/65502) standardizes trusted forwarded prompt token IDs on chat/Messages/Responses, which matters if you run a prefix-cache-aware gateway in front of vLLM.
- **Rust frontend parity is a moving target.** If you rely on `/v1/decisions` or `/v1/systemone`, follow [issue #68784](https://github.com/vllm-project/vllm/issues/68784); ports for these are in flight ([PR #70031](https://github.com/vllm-project/vllm/pull/70031) today).
- **ROCm users should audit env flags.** The silent-garbage failure in [#52442](https://github.com/vllm-project/vllm/issues/52442) only requires setting one env var without its companion — validate your deployment's env vars against the issue before rolling to MI350X/MI355X.

</details>

<details>
<summary><strong>SGLang</strong> — <a href="https://github.com/sgl-project/sglang">sgl-project/sglang</a></summary>

# SGLang Digest — 2026-11-26

## 1. Today's Highlights

The `SGLang 1.0 Release Tracker` (#50045, 19 comments) is now the dominant coordination thread: 1.0 is explicitly scoped as a **stability release** that replaces silent configuration changes with hard errors, and a new doc-testing PR (#53228) has started validating every documented launch command against `ServerArgs`. PD disaggregation (the default scale-out mode, per #43699) continues to absorb most engineering effort, with the bulk of today's PRs extending its control plane, NPU/ROCm paths, and cross-engine cache behavior. On the negative side, the CI flaky tracker (#42752) has ballooned to **271 comments**, and the scheduled-CI tracker (#17050) reports **2 broken / 26 flaky** tests as of today's auto-update — release-manager-level signal that the tree is not currently green.

## 2. Releases & Breaking Changes

No new releases in the last 24h.

- **1.0 upgrade policy taking shape** — [Issue #50045](https://github.com/sgl-project/sglang/issues/50045): 1.0 removes silent config coercions and requires a migration from 0.5.x. Documentation must be updated so every cookbook command "either runs on 1.0 or fails with an error that names the new spelling." The enforcement test is [PR #53228](https://github.com/sgl-project/sglang/pull/53228), which parses every documented launch command against `ServerArgs`.
- **Legacy `sgl-kernel` 0.3.21** had its FA3 import path file removed on `main` (#50260); users on the old wheel are affected by [issue #53215](https://github.com/sgl-project/sglang/issues/53215) — see Stability below.
- **Scheduler startup now prewarms local HF modules** before launching scheduler processes — [PR #52758](https://github.com/sgl-project/sglang/pull/52758). Behaviorally benign, but changes cold-start ordering.

## 3. New Model & Hardware Support

- **Mistral-Large-4** (`mistralai/Mistral-Large-4-1T-A52B`) — [PR #47271](https://github.com/sgl-project/sglang/pull/47271): 1T-parameter / 52B-active multimodal MoE with Pixtral vision host, MLA + DSA sparse attention (top-k 2048), cross-layer KV sharing, 1M-context YaRN, and a bundled DSpark draft head (3 drafted tokens).
- **MiniCPM5-15B-A2.5B** — [PR #52071](https://github.com/sgl-project/sglang/pull/52071): native `MiniCPM5ForCausalLM`, gated QKV attention, MoE routing, `model_type=minicpm5_moe`.
- **DeepSeek-V4.1 on NPU** — [PR #53057](https://github.com/sgl-project/sglang/pull/53057) fuses mHC pre-mix on Ascend A3 via the existing `mhc_pre_dpskv4` entry point.
- **Kimi-K3.1 sparse-MLA under DCP** — [PR #52968](https://github.com/sgl-project/sglang/pull/52968): opt-in sparse-MLA prefill reader that depends on `FlashMLA#40`. Safe to merge first (capability check falls back to stock path), but is a no-op until that release lands.
- **Diffusion / Physical AI** — [Issue #53203](https://github.com/sgl-project/sglang/issues/53203) proposes a unified serving + simulation + post-training stack (`multimodal_gen`, `miles_diffusion`, `miles`) for dVLA / WAM world-action models.
- **AMD/ROCm and NPU split is now structural**: `KimiK3LinearForCausalLM` was importing CuTe DSL TGV tactics unconditionally on non-CUDA/non-ROCm/non-Ascend platforms — fixed by [PR #52116](https://github.com/sgl-project/sglang/pull/52116).

## 4. Performance & Optimization

- **DCP peer-direct A2A (`symm_a2a`)** — [Issue #33355](https://github.com/sgl-project/sglang/issues/33355) (closed/inactive today): proposes single-node NVLink/NVSwitch peer-direct all-to-all for MLA decode reduction, complementing the existing `ag_rs` default.
- **NVFP4 KV cache was a regression, not a win, on consumer Blackwell** — [Issue #36797](https://github.com/sgl-project/sglang/issues/36797): `--kv-cache-dtype nvfp4` (recently made the default, `NVFP4_KV_CACHE=1`) costs **~29% single-stream decode throughput** on Qwen4Exp-style models on GB10/SM121 versus `fp8_e4m3`. Issue argues for arch-gating the default rather than changing it globally. This is the most consequential perf item in the window for anyone deploying on DGX Spark.
- **Rust server stack follow-ups** — [Issue #49055](https://github.com/sgl-project/sglang/issues/49055) tracks non-blocking performance items from the 12-PR Rust server stack ending at #48815, including the generation relay from #49008. Reviewed head `1d39efd0aee4`.
- **Agentic cache scheduling** — [Issue #43098](https://github.com/sgl-project/sglang/issues/43098) (9 👍, highest-upvoted open roadmap item): supernode-wide KV cache sharing across engines with router-aware L1/L2 placement.
- **Reasoning effort as a routing hint** — [Issue #42915](https://github.com/sgl-project/sglang/issues/42915): use `reasoning_effort` (1–100 on DeepSeek-V4.1-Flash) as a load estimate for DP rank selection and retraction. It predicts the mean and tail of output length but not any single request; today it only reaches the chat template.
- **MXFP8 batch-invariant dense path on SM107** — [PR #52696](https://github.com/sgl-project/sglang/pull/52696): uses FlashInfer's batch-invariant quantizer + GEMM for deterministic MXFP8 on SM107.
- **Hybrid KDA/DFLASH concurrency cap** — [Issue #36889](https://github.com/sgl-project/sglang/issues/36889) (closed/inactive): on GLM-5.3-Flash's 34 KDA layers, each request needs `1 + speculative_num_draft_tokens` mamba state slots; a tight static-memory fraction silently caps effective concurrency at 5 slots/request with only an info-level log, hiding **~75% throughput behind one flag**.

## 5. Stability & Regressions

Ranked by severity:

1. **CI is red and noisy** — [Issue #42752](https://github.com/sgl-project/sglang/issues/42752) (271 comments) tracks flaky NVIDIA `PR Test Base` / `PR Test Extra` runs; [Issue #17050](https://github.com/sgl-project/sglang/issues/17050) reports **2 broken, 26 flaky, 923 recently fixed** as of 2026-11-26 02:48 UTC. [Issue #45847](https://github.com/sgl-project/sglang/issues/45847) tracks a specific AMD PR-test failure (`test_fp8_moe_triton_runner_with_aiter.py`).
2. **PD disaggregation (NIXL) cross-request data leak** — [Issue #51980](https://github.com/sgl-project/sglang/issues/51980): a decode request that reuses a live `bootstrap_room` receives **another request's output with HTTP 200**. Follow-up to #40125. No fix PR listed. This is the highest-severity correctness bug in the window and is a correctness/privacy issue, not a perf one.
3. **All JIT kernels fail on `torch==2.14.1+cu130`** — [Issue #50887](https://github.com/sgl-project/sglang/issues/50887): on the default PyPI stack (`sglang[all]==0.5.23`, `sm_89`), every JIT-compiled kernel fails at first launch with `CUDA error: invalid resource handle`. Works on `+cu126`. The JIT build itself succeeds; the failure is at op launch. Affects Blackwell-adjacent users following the default install.
4. **FA3 import breaks on `nvidia-cutlass-dsl>=4.8`** — [Issue #53215](https://github.com/sgl-project/sglang/issues/53215): the FA4 guard only catches `ImportError`, so an `AttributeError`/`ModuleNotFoundError` subclass propagates. Affects the legacy `sgl-kernel` 0.3.21 wheel; removed on `main` in #50260.
5. **NPU RMSNorm ignores `cast_x_before_out_mul=True`** — [Issue #50715](https://github.com/sgl-project/sglang/issues/50715): explicitly constructed `RMSNorm(..., cast_x_before_out_mul=True)` does not select the cast-before-weight behavior on the eager NPU path. Source-confirmed on `baaa201a146e`.
6. **GLM-5.x NoPE MLA cannot run on SM120** — [Issue #39302](https://github.com/sgl-project/sglang/issues/39302) (closed/inactive): `qk_rope_head_dim=0` means absorbed head dim is `kv_lora_rank` (512) not DeepSeek's 576, and every DSA sparse-MLA backend is unavailable on SM120 (RTX PRO 6000 Blackwell).
7. **Streaming parser data loss across chunk boundaries** — [Issue #31915](https://github.com/sgl-project/sglang/issues/31915): a sweep of `function_call/` found multiple streaming bugs rooted in state machines that never flush `_buffer` at end-of-stream. Related: [Issue #35083](https://github.com/sgl-project/sglang/issues/35083) (text before ` thinking` routed four different ways depending on chunking, and the one-shot path keeps the literal marker) and [Issue #35562](https://github.com/sgl-project/sglang/issues/35562) (llama3 tool-call parser silently deletes any leading JSON object from message content).
8. **`--log-requests` truncation bypassed by lists** — [Issue #33164](https://github.com/sgl-project/sglang/issues/33164): elided long lists skip per-element truncation in JSON format, and text format never truncates list elements at all.
9. **Diffusion**: Qwen-Image native SP=4 host OOMs loading DiT on 4×48GB ([Issue #36853](https://github.com/sgl-project/sglang/issues/36853)); FLUX.2-dev fails on gfx1151 due to NVIDIA PTX inline asm in `residual_gate_add` ([Issue #42564](https://github.com/sgl-project/sglang/issues/42564), fixed by [PR #53230](https://github.com/sgl-project/sglang/pull/53230) which handles inference tensors during in-place VAE normalization).
10. **Quantization pitfalls**: `mxfp4` + `sharded_state` silently drops expert weights on gpt-oss-20b ([Issue #34448](https://github.com/sgl-project/sglang/issues/34448)).

Active fixes landing today: [PR #53084](https://github.com/sgl-project/sglang/pull/53084) (Ascend HiCache prewarm ordering for DeepSeek-V4/Mooncake L3), [PR #47243](https://github.com/sgl-project/sglang/pull/47243) (encoder scheduler crash on `origin_input_ids=None`), [PR #51776](https://github.com/sgl-project/sglang/pull/51776) (encoder blocking transfers during event-loop shutdown), [PR #52758](https://github.com/sgl-project/sglang/pull/52758) (scheduler HF prewarm), [PR #52116](https://github.com/sgl-project/sglang/pull/52116) (Kimi-K3 CuTe DSL on non-CUDA), [PR #53056](https://github.com/sgl-project/sglang/pull/53056) (VDN-H3 hybrid attention BCG bounds).

## 6. What This Means for Application Developers

- **Pin your stack and test the K=2 path.** If you use PD disaggregation on NIXL, #51980 is a cross-request data leak that returns HTTP 200 — it will not surface as an error in your logs. Audit your `bootstrap_room` lifecycle and consider pinning the last known-good revision until it's fixed. Do not treat a 200 as a correctness signal on this transport.
- **Do not assume `sglang[all]` is a working default.** On `torch==2.14.1+cu130` (#50887) every JIT kernel fails at launch. Either pin the CUDA 12.6 wheel or verify a known-good kernel launch in your container before scaling out. This is a silent-at-install, loud-at-runtime failure.
- **Re-evaluate your KV cache dtype on consumer Blackwell.** If you set `--kv-cache-dtype nvfp4` and you're on DGX Spark / SM121, you may be paying ~29% single-stream decode throughput (#36797) for a format you did not need. Bench fp8_e4m3 before accepting the default.
- **Don't parse streaming tool calls yourself.** The parser bugs in #31915, #35083, and #35562 are not yet all fixed, and they fail in ways that lose or corrupt data rather than erroring. If you build agents on SGLang, either upstream the fix or handle the end-of-stream buffer flush in your own client.
- **1.0 is a migration event, not a version bump.** Silent config coercions are being removed, and the project is building tests to make sure every documented command either works or errors with the setting name. If you rely on permissive config handling, start reading your server logs for warnings now — they are about to become failures.
- **For AMD/ROCm and Ascend NPU, the platform split is being actively repaired** (#52116, #53084, #53056, #53057), but it's a moving target this week. Pin platform-specific revisions and re-test on each upgrade rather than assuming CUDA parity.

</details>

<details>
<summary><strong>llama.cpp</strong> — <a href="https://github.com/ggml-org/llama.cpp">ggml-org/llama.cpp</a></summary>

# llama.cpp Digest — 2026-11-26

## 1. Today's Highlights

llama.cpp hit a symbolic milestone with the **1.1.0 version bump** (b12752), landing alongside Tencent's **Hy4-Flash** architecture support (iHC trunk + gated MLA + sparse/sliding-window attention + Engram tables). The **SYCL backend** had a busy cycle with multiple MoE/kernel fixes (MMQ re-enable, gated delta net ESIMD, recurrent conv fusion), while several high-severity correctness issues remain open on Intel hardware (nondeterministic logprobs, DeltaNet token soup). A notable cluster of **MoE cache deduplication** work and **Inkling-2-Mini DFlash2** speculative decoding fixes signals active attention to looped-MoE and draft-model correctness.

## 2. Releases & Breaking Changes

- **v1.1.0** ([b12752](https://github.com/ggml-org/llama.cpp/pull/33043)) — minor version bump with author updates. No documented API breakage, but applications pinning to `1.0.x` semantics should re-test.
- **Vocab tokenizer behavior change** ([b12751](https://github.com/ggml-org/llama.cpp/pull/33038)) — Metaspace `prepend_scheme` now always applied for BPE; the `test-tokenizer-mmbert` fixture was dropped. **Tokenizer output may differ for affected models** — validate prompts if you depend on exact tokenization.
- **Server shutdown semantics** ([b12738](https://github.com/ggml-org/llama.cpp/pull/32080)) — Windows now handles `CTRL_BREAK_EVENT` for clean shutdown, so launcher scripts that previously relied on hard-kill will now get graceful termination. Update supervisors accordingly.

## 3. New Model & Hardware Support

- **Hy4-Flash (Tencent)** ([b12755 / #32960](https://github.com/ggml-org/llama.cpp/pull/32960)) — new hy_v4 trunk with iHC, gated MLA, attention sinks, sparse + sliding-window MLA layers, sandwich norms, latent routed experts, and DeepSeek-V4.1-style Engram tables, wired into the DSA iSWA cache.
- **Inkling-2-Mini DFlash2** ([#33073](https://github.com/ggml-org/llama.cpp/pull/33073), [#33049](https://github.com/ggml-org/llama.cpp/pull/33049)) — conversion + inference support for `incoai/Inkling-2-Mini-DFlash2`; draft acceptance bug fixed (was ~5/5615 proposals).
- **Spark2.5 DSpark drafts** ([#31372](https://github.com/ggml-org/llama.cpp/pull/31372)) — Spark-X2.6 shares the Spark2.5 architecture; conversion now exports embedded `draft_model.*` weights.
- **SYCL: F8 E4M3** ([b12726 / #31871](https://github.com/ggml-org/llama.cpp/pull/31871)) — initial FP8 E4M3 support for `SET_ROWS`, `CPY`, `ADD`, `MUL_MAT`, `MUL_MAT_ID`.
- **SYCL MMQ re-enable** ([#32961](https://github.com/ggml-org/llama.cpp/pull/32961)) — Q4_0/Q4_1/Q5_0/Q5_1/Q8_0 MMQ restored after zeroing the q8_1 scratch padding region.
- **Hexagon 2.0** ([#32582](https://github.com/ggml-org/llama.cpp/pull/32582)) — int-HMX (w8a8/w8a16), automatic f32→f16 lowering, generic DMA pipelines.
- **Vulkan Intel Xe2/ANV tile clamp** ([#33076](https://github.com/ggml-org/llama.cpp/pull/33076)) — clamps matmul tile to "medium" for `m>64, n>64` to avoid `xe` engine timeouts on Arc Pro B60.

## 4. Performance & Optimization

- **Metal chunked graph commit** ([b12734 / #32947](https://github.com/ggml-org/llama.cpp/pull/32947)) — single command-buffer thread commits graph in chunks; reduces CPU-side overhead per token.
- **Async host input copies** ([b12732 / #30685](https://github.com/ggml-org/llama.cpp/pull/30685)) — opt-in `async_host_input` cap (CUDA-only initially); replaces per-input blocking copies with `set_tensor_async` + single sync.
- **Scratch memory reservation in graph_optimize** ([b12728 / #31898](https://github.com/ggml-org/llama.cpp/pull/31898)) — backends can now reserve compute buffer memory across a node range.
- **`ggml_vec_exp_f32` vectorization** ([#33077](https://github.com/ggml-org/llama.cpp/pull/33077)) — wires the formerly-unused scalar loop to platform `ggml_v_expf`; GDN KDA path switched to it.
- **SYCL comm_exchange_fast V2 + FUSION** ([#32058](https://github.com/ggml-org/llama.cpp/pull/32058)) — non-Windows `-sm tensor` PP/TG throughput improved, scaling with allreduce frequency.
- **SYCL gated delta net ESIMD** ([#31762](https://github.com/ggml-org/llama.cpp/pull/31762)) — S_v=128, kda=0 path; measurable gains on Qwen3.8-27B Q3_K_P (`-fa on -ctk q4_0 -ctv q4_0 -b 1024 -ub 1024`).
- **SYCL recurrent conv window fusion** ([#31355](https://github.com/ggml-org/llama.cpp/pull/31355)) — eliminates per-layer concat + cache rollback copy for recurrent convs.
- **In-place recurrent state reads** ([#30139](https://github.com/ggml-org/llama.cpp/pull/30139)) — removes `get_rows` state copies for RWKV6/7 and similar; graph-reuse check added.
- **MoE cache dedup for looped MoE** ([#33072](https://github.com/ggml-org/llama.cpp/pull/33072)) — shares one physical VRAM slot across the 3 loop passes on Inkling-2-Mini, cutting cache footprint.
- **Inkling-2 tensor split** ([#32751](https://github.com/ggml-org/llama.cpp/pull/32751)) — `-sm tensor` supported; KV split, attn/ffn mirrored.

## 5. Stability & Regressions

Ranked by severity:

1. **SYCL MoE `/v1/completions` logprobs nondeterministic; `seed` doesn't pin** ([#31206](https://github.com/ggml-org/llama.cpp/issues/31206), 14 comments, open). Breaks reproducibility guarantees for eval harnesses and ranking logic. No fix PR yet.
2. **SYCL `rms_norm_f32_sycl` launch failure on Arc Pro B60** ([#30301](https://github.com/ggml-org/llama.cpp/issues/30301), open) — `UR_RESULT_ERROR_UNSUPPORTED_FEATURE`. Hard blocker on that hardware.
3. **SYCL DeltaNet "token soup" on long prompts** ([#29183](https://github.com/ggml-org/llama.cpp/issues/29183), open) — Qwen3.6/3.8, Nemotron on Arc Pro B70. Correctness regression on long context.
4. **V100 (sm_70) prefill regression for GDN hybrid models in 1.0** ([#32810](https://github.com/ggml-org/llama.cpp/issues/32810), open) — Volta FATTN halves `nbatch_V2` vs 0.4.1; grows with context.
5. **Vulkan KHR_coopmat nondeterministic wrong results on Intel Arc B70** ([#31560](https://github.com/ggml-org/llama.cpp/issues/31560), closed) — F16/Q8_0 BERT-style models returned different answers per call. Now closed but verify on your Mesa version.
6. **DeepSeek-V4.1-Flash gibberish on Vulkan with `-fa` enabled** ([#31480](https://github.com/ggml-org/llama.cpp/issues/31480), open) — works with `-fa off`.
7. **`convert_hf_to_gguf.py` undercounts tensors on Qwen 3.8 27B** ([#32918](https://github.com/ggml-org/llama.cpp/issues/32918), open) — reports 770 vs expected 866; regression vs b12600.
8. **ROCm CI red on master since #32960** ([#33045](https://github.com/ggml-org/llama.cpp/pull/33045)) — tile FA kernel for DKQ 576/DV 512 (MLA shape) picked for GQA ratios not divisible by 4. **Fix PR open.**
9. **`llama-server` slot discards restored prompt when LoRA differs** ([#32123](https://github.com/ggml-org/llama.cpp/issues/32123), open) — affects multi-LoRA routing.
10. **Windows: offloaded model pages stay in working set after load** ([#32373](https://github.com/ggml-org/llama.cpp/issues/32373), open) — `unmap_fragment()` is a no-op on Windows; memory pressure in multi-model setups.
11. **Windows `exec_shell_command` mangles double quotes** ([#32937](https://github.com/ggml-org/llama.cpp/issues/32937), open) — affects agent tool-calling.
12. **`n_threads` defaults to 4 on hybrid CPUs without SMT** ([#28625](https://github.com/ggml-org/llama.cpp/issues/28625), open) — Arrow Lake / Lunar Lake underutilization.
13. **Misc. fixes landed:** seq state restore with `ON_DEVICE` ([b12753 / #30318](https://github.com/ggml-org/llama.cpp/pull/30318)); ggml-openvino CI op-test + KV cache decode ([b12754 / #33002](https://github.com/ggml-org/llama.cpp/pull/33002)).

## 6. What This Means for Application Developers

- **Pin your build.** With v1.1.0 landing mid-cycle plus a BPE tokenizer behavior change, reproducibility across prompt/eval runs requires freezing the commit. If you log token counts or compare cached embeddings, re-baseline after upgrading.
- **Intel SYCL is not production-ready for MoE + long context.** The nondeterministic logprobs (#31206) and DeltaNet token soup (#29183) issues are unresolved and affect both correctness and observability. Prefer CUDA/Metal for now if your app relies on logprobs, deterministic seeds, or >8k context on hybrid architectures.
- **Windows agents get cleaner shutdown and better tools.** `CTRL_BREAK_EVENT` handling means your process supervisor can request graceful shutdown; but `exec_shell_command` still mangles quotes (#32937) — sanitize or avoid shell tools on Windows until fixed.
- **Speculative decoding is maturing but check acceptance rates.** The DFlash2 fix (#33049) took Inkling-2-Mini from ~0.1% to usable acceptance. If you run draft models, log acceptance and update — the improvement is large.
- **Looped MoE just got cheaper in VRAM.** #33072 dedups physical expert tensors across loop passes; multi-GPU looped-MoE deployments can fit larger contexts or more concurrent slots.
- **Watch ROCm MLA users.** If you serve DeepSeek-style MLA models on RDNA, master is currently broken by #33045 (fix PR open) — hold off on upgrading or cherry-pick the fix.
- **Tokenizer changes ripple into cached KV.** If you persist KV caches or prompt caches across versions, the Metaspace change (#33038) can invalidate cache hits for affected models.

</details>

<details>
<summary><strong>Ollama</strong> — <a href="https://github.com/ollama/ollama">ollama/ollama</a></summary>

# Ollama Digest — 2026-11-26

## 1. Today's Highlights

No new releases shipped in the last 24 hours, but the issue tracker is dominated by a cluster of **0.40.17/0.40.18 regressions** spanning memory accounting, MLX prefix-cache retention, and JSON-schema grammar failures. The `Inkling-2-mini` model family continues to generate a high volume of crash and OOM reports across DGX Spark, CUDA, and Apple Silicon backends, with several upstream-fix PRs (llama.cpp bump, CUDA backend) already open. AMD ROCm and Windows users are also reporting elevated host RAM usage after full GPU offload.

---

## 2. Releases & Breaking Changes

- **No new releases** in the last 24h.
- **Regression watch — version pinning recommended:** Users on `0.40.17` and `0.40.18` are reporting behavioral changes without a formal migration note:
  - `0.40.2` → qwen3.8:27b-mtp_q8 VRAM ballooned from 51 GB → 127 GB ([#19833](https://github.com/ollama/ollama/issues/19833)).
  - `0.40.15` → OOM on models that previously loaded ([#19851](https://github.com/ollama/ollama/issues/19851)).
  - `0.40.17` → macOS M4 Pro performance regression on MLX Qwen 3.8 27b ([#19866](https://github.com/ollama/ollama/issues/19866)).
  - `0.40.18` → Windows/ROCm `json_schema` requests fail mid-load and return **HTTP 200 with empty body** ([#19918](https://github.com/ollama/ollama/issues/19918)) — this is the most dangerous one for production pipelines because it fails silently.

---

## 3. New Model & Hardware Support

- **Inkling-2-mini (Looped Transformer) architecture support is landing but unstable.**
  - CUDA backend PR open, porting Metal fast paths with NVFP4/MXFP8 expert gathers on BF16 tensor cores ([PR #19909](https://github.com/ollama/ollama/pull/19909)).
  - Load failure on 18-physical-block looped transformers (`blk.24.attn_q.weight` not found) was closed ([#19888](https://github.com/ollama/ollama/issues/19888)).
  - MLX kernel load panic: `custom_kernel_relative_attention_bf16_probabilities` ([#19900](https://github.com/ollama/ollama/issues/19900)).
- **Laguna tool-call parser fix** in flight to preserve literal `<tool_call>` markers inside arguments ([PR #19919](https://github.com/ollama/ollama/pull/19919), [PR #19904](https://github.com/ollama/ollama/pull/19904)) — fixes [#19902](https://github.com/ollama/ollama/issues/19902).
- **llama.cpp pin bump** `b12651 → b12701` proposed to resolve the long-conversation `GGML_ASSERT(s2 <= uint32_t::max())` crash on Inkling-2-mini ([PR #19916](https://github.com/ollama/ollama/pull/19916)); maintainer-side bump also open ([PR #19917](https://github.com/ollama/ollama/pull/19917)).
- **Tokenizer correctness:** MLX `Sequence` normalizers (Prepend/Replace) previously ignored — affects Llama 2, TinyLlama, CodeLlama, Phi-3 first-token tokenization ([PR #19910](https://github.com/ollama/ollama/pull/19910)).

---

## 4. Performance & Optimization

- **Inkling 2 short-history attention:** Metal split kernels now used below 1024 keys, replacing a dense FP32 widen + per-query mask ([PR #19881](https://github.com/ollama/ollama/pull/19881) — closed/merged).
- **MLX prefix-cache eviction on Inkling 2:** past ~64k tokens, the entire prefix cache is dropped between turns, forcing full re-prefill ([#19819](https://github.com/ollama/ollama/issues/19819)).
- **MLX prefix-cache leak (qwen3.8-flash-next / qwen4_exp):** ~0.6 GiB growth per distinct prompt, snapshots paged out but never evicted ([#19891](https://github.com/ollama/ollama/issues/19891)).
- **VRAM accounting fixes** for multi-model / speculative-draft loads, where draft buffer lines masked target lines (30B dflash misreported ~2.3 GB) ([PR #17857](https://github.com/ollama/ollama/pull/17857), extended in [PR #19632](https://github.com/ollama/ollama/pull/19632)).
- Independent DGX Spark benchmark: 75 runs comparing Ollama vs. Strata on Qwen3.8 Flash-Next + Hermes Agent workloads ([#19887](https://github.com/ollama/ollama/issues/19887)).
- macOS memory headroom calculation change to prevent over-aggressive MLX prefix-cache eviction ([PR #19907](https://github.com/ollama/ollama/pull/19907)).

---

## 5. Stability & Regressions (ranked by severity)

| Sev | Issue | Notes / Fix status |
|---|---|---|
| 🔴 **Silent failure** | `0.40.18` Windows/ROCm `json_schema` returns HTTP 200 + empty body mid-load ([#19918](https://github.com/ollama/ollama/issues/19918)) | No fix PR yet |
| 🔴 **Host crash** | Inkling-2-mini OOMs & locks DGX Spark, requires hard reboot ([#19879](https://github.com/ollama/ollama/issues/19879)) | Closed; upstream bump proposed |
| 🔴 **Load abort** | phi4 + `OLLAMA_KV_CACHE_TYPE=q8_0` aborts on Metal ([#19905](https://github.com/ollama/ollama/issues/19905)) | Fix PR [19914](https://github.com/ollama/ollama/pull/19914) — scheduler hash sized for leaves |
| 🟠 **VRAM regression** | qwen3.8:27b-mtp_q8 uses 127 GB instead of 51 GB ([#19833](https://github.com/ollama/ollama/issues/19833)) | Workaround: downgrade |
| 🟠 **OOM regression** | Models loadable on 0.40.15 OOM on 0.4.17 ([#19851](https://github.com/ollama/ollama/issues/19851)) | `needs more info` |
| 🟠 **Host RAM bloat** | Windows/ROCm RX 7800 XT: mapped model pages retained after 100% GPU offload on 16 GB systems ([#19899](https://github.com/ollama/ollama/issues/19899)) | No fix PR |
| 🟠 **Crash on long ctx** | Inkling-2-mini CUDA `GGML_ASSERT(s2 <= uint32_t::max())` ([#19915](https://github.com/ollama/ollama/issues/19915)) | Fix PR [19916](https://github.com/ollama/ollama/pull/19916) |
| 🟠 **Model load panic** | Inkling-2-mini MLX kernel missing on M2 Pro ([#19900](https://github.com/ollama/ollama/issues/19900)) | Open |
| 🟡 **Perf regression** | macOS M4 Pro MLX Qwen 3.8 27b slowdown on 0.40.17 ([#19866](https://github.com/ollama/ollama/issues/19866)) | Open, 8 comments |
| 🟡 **API correctness** | `/api/chat` vision requests 400 when message text contains `[img-` (e.g. `arr[img-1]`) ([#19911](https://github.com/ollama/ollama/issues/19911)) | Fix PR [19912](https://github.com/ollama/ollama/pull/19912) |

---

## 6. What This Means for Application Developers

- **Do not auto-upgrade to 0.40.18 in production.** The JSON-schema silent empty-body regression on Windows/ROCm is a correctness hazard for structured-output pipelines; a false HTTP 200 with an empty body will not surface in most error monitors.
- **Pin Ollama versions** if you depend on a specific VRAM footprint. Two separate VRAM/OOM regressions (`#19833`, `#19851`) mean `ollama ps` numbers and scheduler fit decisions are unstable across 0.40.x.
- **Structured tool-call parsing is being hardened.** If you use Laguna models with embedded `<tool_call>` literals in arguments, track [PR #19919](https://github.com/ollama/ollama/pull/19919)/[#19904](https://github.com/ollama/ollama/pull/19904) — until then, escape or sanitize tool-call content.
- **Vision chat:** avoid `[img-` substrings in user text sent with images until [PR #19912](https://github.com/ollama/ollama/pull/19912) lands; the renderer confuses them with placeholders.
- **Long-context agents on MLX:** if you drive Inkling 2 or qwen3.8-flash-next past 64k tokens, expect full re-prefill latency per turn and unbounded memory growth ([#19819](https://github.com/ollama/ollama/issues/19819), [#19891](https://github.com/ollama/ollama/issues/19891)). Restart the runner between long sessions as a stopgap.
- **Observability:** [PR #11159](https://github.com/ollama/ollama/pull/11159) adds eval-duration/token counters to `/metrics` — useful if you're instrumenting inference cost externally.

</details>

<details>
<summary><strong>LiteLLM</strong> — <a href="https://github.com/BerriAI/litellm">BerriAI/litellm</a></summary>

# LiteLLM Digest — 2026-11-26

## 1. Today's Highlights

No new releases landed in the last 24 hours, but issue and PR activity is heavy on **cost-accounting correctness** (custom pricing being dropped or double-counted across passthrough, batch, and cache paths) and **streaming fidelity** (upstream aborts silently reported as clean finishes, dropped reasoning-only chunks). A large stacked "gateway budget" refactor is also in flight, touching budget reservation, credential resolution for Bedrock/Vertex, and native Claude routing on Vertex/Bedrock/Mantle.

## 2. Releases & Breaking Changes

None. No new versions in the last 24h. Two backport branches are active (`lts/1.108.x`), so expect patch releases off that line rather than `main`.

Notable in-flight config surface (not yet released, but worth tracking):
- `general_settings.disable_budget_reservation` proposed as a new gateway setting — [PR #54615](https://github.com/BerriAI/litellm/pull/54615)
- Spend logs to be stamped with caller ownership metadata — [PR #54614](https://github.com/BerriAI/litellm/pull/54614)
- Per-model-endpoint response-cache policy (enable/disable + tuning per `model_name`) requested, 9 👍 — [Issue #52061](https://github.com/BerriAI/litellm/issues/52061) (closed)

## 3. New Model & Hardware Support

- **Gemini 4**: explicit context caching must be skipped (Gemini 4 caches automatically and rejects cache-creation calls with a 400); `-latest` aliases now resolved to versioned model names before auth — [PR #54503](https://github.com/BerriAI/litellm/pull/54503)
- **Claude on Vertex AI / Bedrock / Mantle**: native serving path being added, with Vertex/Bedrock message shaping to match Python SDK behavior — [PR #54613](https://github.com/BerriAI/litellm/pull/54613), [PR #54612](https://github.com/BerriAI/litellm/pull/54612)
- **Bedrock/Vertex credential resolution without an API key** — [PR #54611](https://github.com/BerriAI/litellm/pull/54611)
- **Volcengine Ark Seedream**: image generation, editing, and pricing — [PR #54076](https://github.com/BerriAI/litellm/pull/54076)
- **Vertex AI RAG Engine** requested as a first-class vector store provider for `/rag/ingest` and vector store search — [Issue #36285](https://github.com/BerriAI/litellm/issues/36285)

## 4. Performance & Optimization

- **Guardrail logging is O(N³) per request**: `_sync_guardrail_info_to_logging_obj` passes the entire accumulated guardrail list on every append, blocking the event loop when a guardrail records many entries — [Issue #54435](https://github.com/BerriAI/litellm/issues/54435). No fix PR yet; high impact for deployments with verbose guardrails.
- **MCP tool calls leak parallel-request slots**: a failed MCP tool call frees the request's concurrency slot while the parent request is still running, so a key limited to 1 concurrent request can run several — [PR #54469](https://github.com/BerriAI/litellm/pull/54469) (fix open).
- **Prometheus outcomes for routed deployment attempts** requested, so fallback successes/failures are observable per attempt rather than only as final HTTP 200 — [Issue #53040](https://github.com/BerriAI/litellm/issues/53040).

## 5. Stability & Regressions

Ranked by severity:

1. **`import litellm` can crash outright** on 1.105.3 when the import-time model cost-map fetch fails with a retryable outcome (DNS failure, connection refused, 429, 5xx): `cannot import name 'LoggerContext' from partially initialized module` — [Issue #54369](https://github.com/BerriAI/litellm/issues/54369). No fix PR linked; this is a hard startup failure, not a degraded path.
2. **Custom pricing silently dropped** — two related reports: OpenAI passthrough ignores router deployment `model_info` input/output costs — [Issue #54390](https://github.com/BerriAI/litellm/issues/54390) (closed); and `deployment_pricing_model_info` drops custom pricing when `model_info.id` collides with a built-in model name from another provider, affecting batch cost tracking and failure-cost paths — [Issue #54389](https://github.com/BerriAI/litellm/issues/54389) (closed).
3. **Anthropic cache tokens double-counted** when `custom_cost_per_token` sets `cache_read_input_token_cost`: cache reads billed at both the regular input rate and the custom cache rate — [PR #40016](https://github.com/BerriAI/litellm/pull/40016) (fix open, fixes #40006).
4. **Interrupted streaming under-bills**: client disconnect mid-stream logs only partial spend, while the provider (e.g. Bedrock) bills for the full server-side generation — [Issue #46499](https://github.com/BerriAI/litellm/issues/46499).
5. **Upstream stream aborts reported as clean finishes** on azure_ai, Databricks, Vertex Model Garden, and text-completion routes — apps keep half answers and never retry. Fixes open on both `main` — [PR #54443](https://github.com/BerriAI/litellm/pull/54443) — and `lts/1.108.x` — [PR #54466](https://github.com/BerriAI/litellm/pull/54466).
6. **OpenRouter reasoning-only chunks dropped**: frames carrying only `reasoning_details` (Anthropic thinking signatures, Gemini encrypted reasoning blobs) were discarded, breaking reasoning replay — [PR #48412](https://github.com/BerriAI/litellm/pull/48412) (merged), backported to LTS via [PR #54564](https://github.com/BerriAI/litellm/pull/54564).
7. **Vertex/Gemini context caching reorders conversations**: a `cache_control` block that isn't a conversation prefix gets moved ahead of history and `system_instruction` is dropped, causing the model to answer the previous turn — [Issue #47046](https://github.com/BerriAI/litellm/issues/47046) (closed).
8. **watsonx streamed usage ignored**: proxy substitutes its own token estimate, far below what watsonx bills — [Issue #46059](https://github.com/BerriAI/litellm/issues/46059) (closed).
9. **`/team/update` replaces rather than merges metadata**, silently dropping `metadata.logging` including `turn_off_message_logging` — [Issue #54467](https://github.com/BerriAI/litellm/issues/54467) (closed).
10. **Presidio guardrail in `logging_only` masks the client response** instead of only the logged copy — [Issue #47605](https://github.com/BerriAI/litellm/issues/47605) (closed).
11. **Audit-log writes are fire-and-forget `asyncio.create_task`**: worker shutdown drops records for calls that already returned 200 (12 sites) — [Issue #43583](https://github.com/BerriAI/litellm/issues/43583) (closed).
12. **JSONDecodeError in Ollama chat transformation** — [Issue #54315](https://github.com/BerriAI/litellm/issues/54315).
13. **MCP permission inconsistency**: Chat UI returns 403 where the same user's team-bound key succeeds on `/responses` — [Issue #53079](https://github.com/BerriAI/litellm/issues/53079) (closed).
14. **`additional_drop_params` strips fields inside message content blocks**, not just top-level params — [Issue #37479](https://github.com/BerriAI/litellm/issues/37479) (closed).
15. **A2A chat-completions shim returns "no healthy deployments"** when wildcard model groups exist — [Issue #37581](https://github.com/BerriAI/litellm/issues/37581) (closed).
16. **Admin UI lists deprecated models** in the "Add Model" dropdown — [Issue #29012](https://github.com/BerriAI/litellm/issues/29012).
17. **Gemini image generation drops `finishReason` on safety blocks**, returning an empty `ImageResponse`, so callers can't distinguish refusal from failure — [Issue #28989](https://github.com/BerriAI/litellm/issues/28989) (closed).

## 6. What This Means for Application Developers

- **Do not trust spend numbers on interrupted or proxied streams.** If you disconnect early, use passthrough routes, or run on watsonx, your logged cost may be materially below provider billing. Reconcile against provider invoices before attributing cost to tenants.
- **Pin and test your import path.** The 1.105.3 import-time crash is triggered by transient network conditions, meaning a cold start in a degraded network can take down your service rather than degrade it. Consider vendoring the cost map or pinning to a version without the import-time fetch.
- **If you rely on reasoning replay through OpenRouter, upgrade to pick up #48412** (or the LTS backport). Signature-only and encrypted-reasoning chunks were being dropped, which silently breaks multi-turn reasoning continuity.
- **Re-check custom pricing on every route you use.** Passthrough, batch, and failure-cost paths have separate pricing resolution and have each been reported dropping `model_info` costs. Validate with a canary request per route, not just `/v1/chat/completions`.
- **Concurrency limits on keys with MCP tool calls are not currently enforced.** If you rely on per-key parallel request caps for fairness or rate isolation, MCP tool execution can exceed them until #54469 lands.
- **Gemini 4 callers sending `cache_control` will fail** with a 400 until #54503 ships; strip explicit cache directives for Gemini 4 in the interim.

</details>

<details>
<summary><strong>Unsloth</strong> — <a href="https://github.com/unslothai/unsloth">unslothai/unsloth</a></summary>

# Unsloth Digest — 2026-11-26

## Today's Highlights
Unsloth shipped **v0.1.925-beta**, adding Inkling 2 Mini fine-tuning (1.8–3.1x faster, 50% less VRAM) with LoRA/QLoRA, GGUF/16-bit export, and multi-GPU parallel support. A large batch of Studio-focused PRs landed from maintainer `danielhanchen` addressing FP8/NVFP4 handling, multi-GPU placement, and coalesced image/video inference — while a kernel-launch optimization for compiled LoRA blocks targets 11–14% step-time reductions. Stability remains noisy: multiple Inkling 2 Mini issues (VRAM OOM, GPU offload regression, regex failures) and a new SIGSEGV report on Linux Studio are open.

## Releases & Breaking Changes
- **v0.1.925-beta** — Inkling finetuning + perf fixes ([release notes](https://github.com/unslothai/unsloth/releases))
  - New: Inkling 2 Mini LoRA/QLoRA fine-tuning, 1.8–3.1x faster, 50% less VRAM; trains on Kaggle 2x T4; tensor/pipeline/context parallel across GPUs; export to GGUF or merged 16-bit.
  - ⚠️ Regression reported in [#19137](https://github.com/unslothai/unsloth/issues/19137): Inkling 2 Mini GPU offloading dropped from ~40 → 12 tok/s after v0.1.923-beta (now closed).
- **Studio env breakage**: [#19660](https://github.com/unslothai/unsloth/issues/19660) — `import torch; import pyarrow` exits with SIGSEGV (139) inside Studio venv on Linux (Python 3.13, torch 2.13.0+cu130). No fix PR yet.
- Comment/docstring condensation PRs [#19653–#19657](https://github.com/unslothai/unsloth/pull/19657) enforce a 10% comment budget across core, CLI, tests, Studio backend/frontend, CI — tooling-only, no API impact.

## New Model & Hardware Support
- **Inkling 2 Mini** fine-tuning (LoRA/QLoRA) via [v0.1.925-beta](https://github.com/unslothai/unsloth/releases).
- **HunYuan-V1-MoE** unblocked for expert parallel; gpt-oss 4-bit per-expert configs now refused early — [PR #19678](https://github.com/unslothai/unsloth/pull/19678).
- **gpt-oss on transformers 4.57.x**: dense local routing weights fix for expert parallel — [PR #19559](https://github.com/unslothai/unsloth/pull/19559).
- **Windows x64 / Windows-on-Arm FP8**: tensorwise fallback when row-wise fp8 GEMM is missing (torchao `PerRow` unavailable in Windows wheels) — [PR #19665](https://github.com/unslothai/unsloth/pull/19665).
- **NVFP4 on Blackwell**: LoRA baking on NVFP4 transformers + cached runtime build — [PR #19664](https://github.com/unslothai/unsloth/pull/19664).
- Open hardware gaps: ROCm `libamdhip64` shadowing on CachyOS ([#18948](https://github.com/unslothai/unsloth/issues/18948), closed), RDNA4 `gfx1200` HIP illegal memory access in fused kernels ([#18403](https://github.com/unslothai/unsloth/issues/18403)), Arc 140V XPU/Vulkan Inkling output failure ([#19239](https://github.com/unslothai/unsloth/issues/19239)), Apple Silicon Metal DiffusionGemma garbled output ([#6336](https://github.com/unslothai/unsloth/issues/6336), closed).

## Performance & Optimization
- **Compiled LoRA blocks** — launch kernels from Inductor's C++ wrapper on long runs; L4 LoRA steps measured **-11% to -14%** (Qwen3-4B QLoRA: 819 ms idle of 1.58 s; Llama-3.2-3B LoRA: 573 ms of 1.04 s) — [PR #19623](https://github.com/unslothai/unsloth/pull/19623).
- **Studio image generation** — coalesce identical requests across users, batch `/images/generate`, first-come-first-served slot. Reported throughput previously 1 render per request even with 16 concurrent identical requests — [PR #19667](https://github.com/unslothai/unsloth/pull/19667).
- **Studio video generation** — single server-side queue replaces busy `409` responses across Video page, `/v1/videos`, and chat tool — [PR #19677](https://github.com/unslothai/unsloth/pull/19677).
- **Multi-GPU video denoising** — price a CFG replica when text encoders already sit on the second card (NVIDIA measured 1.01–1.03x on 2x RTX PRO 4000/4500) — [PR #19671](https://github.com/unslothai/unsloth/pull/19671).
- **LoRA merge diagnostics** — new read-only report on how much of a LoRA update survives FP8/FP4 merged export (arXiv 2611.32064 reports 93% norm loss in mixed FP8/NVFP4) — [PR #19676](https://github.com/unslothai/unsloth/pull/19676).

## Stability & Regressions
Ranked by severity:

1. **SIGSEGV on import in Studio venv (Linux)** — [#19660](https://github.com/unslothai/unsloth/issues/19660). Affects `torch` + `pyarrow` co-import; blocks any Studio virtualenv work on Python 3.13. No fix PR.
2. **Inkling 2 Mini VRAM OOM on RX 7900 GRE / ROCm** — [#19275](https://github.com/unslothai/unsloth/issues/19275). Open; version v0.1.923-beta.
3. **Inkling 2 Mini regex failure** (`std::regex error_stack`) on RTX 4070 — [#19376](https://github.com/unslothai/unsloth/issues/19376). Open.
4. **RDNA4 (gfx1200) QLoRA HMAC fault** in three fused kernels; PEFT/PyTorch lacks SDPA for this arch — [#18403](https://github.com/unslothai/unsloth/issues/18403). Open.
5. **v0.1.920-beta crash on model load** — [#18563](https://github.com/unslothai/unsloth/issues/18563). Open.
6. **`SFTConfig.pad_to_multiple_of` silently dropped** with padded batches in unsloth-zoo 2026.11.12 and main — [#19567](https://github.com/unslothai/unsloth/issues/19567). Open.
7. **Server-side tools vs client MCP tools in OpenAI-compatible API** — [#19593](https://github.com/unslothai/unsloth/issues/19593). Open.
8. **Masked diffusion drops output-head hook** after first training batch — [#19581](https://github.com/unslothai/unsloth/issues/19581). Open.
9. **Train-on-completion broken with Qwen 3** — [#2771](https://github.com/unslothai/unsloth/issues/2771). Closed.
10. **Clef decision models train/serve JSON state mismatch** (GGUF consumes state verbatim) — [#19423](https://github.com/unslothai/unsloth/issues/19423). Open.
11. **Prompt cache miss on `@skill` second turn** — [#19212](https://github.com/unslothai/unsloth/issues/19212). Open; causes full conversation reprocessing.
12. **Local tool loop can dispatch with zero-token result budget** — [#19352](https://github.com/unslothai/unsloth/issues/19352). Open.
13. **Bench red on main**: `test_auto_mode_stays_off_on_unmeasured_nvidia` ([#19682](https://github.com/unslothai/unsloth/pull/19682)), `test_diffusion_auto_placement` on Windows ([#19681](https://github.com/unslothai/unsloth/pull/19681)), `test_video_resolution_preset_contract` ([#19679](https://github.com/unslothai/unsloth/pull/19679)) — all have test-fix PRs.
14. **`transformers==5.13.1` triggers security scanners** — [#18699](https://github.com/unslothai/unsloth/issues/18699). Closed.

## What This Means for Application Developers
- **Fine-tuning on constrained hardware is improving**: Inkling 2 Mini via v0.1.925-beta runs on free Kaggle 2x T4 and adds multi-GPU parallel paths — viable for teams without dedicated clusters. But validate ROCm path separately; multiple AMD reports are unresolved.
- **Augment your export pipeline with LoRA merge diagnostics** ([PR #19676](https://github.com/unslothai/unsloth/pull/19676)): FP8/FP4 merged exports can lose most of a LoRA's update norm, and previously you had no signal. If you ship quantized fine-tunes, wire this check into CI.
- **Studio as an inference backend is getting more server-grade**: request coalescing for images ([#19667](https://github.com/unslothai/unsloth/pull/19667)) and a proper video queue replacing `409`s ([#19677](https://github.com/unslothai/unsloth/pull/19677)) make multi-user deployments more predictable. Expect first-come-first-served semantics under contention.
- **OpenAI-compatible API gotcha**: server-side tools can interfere with client-provided MCP tools ([#19593](https://github.com/unslothai/unsloth/issues/19593)) — audit agent tool wiring if you mix both.
- **Prompt caching is fragile around skill/tool injection**: turn-2 cache misses ([#19212](https://github.com/unslothai/unsloth/issues/19212)) inflate latency/cost in long agent loops; consider stable system-prompt composition until fixed.
- **Custom kernels and quantized paths are the failure hotspots**: RDNA4, XPU/Vulkan, Metal diffusion, and NVFP4 each have open correctness issues. Pin versions per hardware target and smoke-test before upgrading.
- **Platform support remaining uneven**: Windows FP8 needs the tensorwise fallback ([PR #19665](https://github.com/unslothai/unsloth/pull/19665)); NVFP4 LoRA on Blackwell now bakes adapters pre-quantize ([PR #19664](https://github.com/unslothai/unsloth/pull/19664)) — favorable for Blackwell users doing adapter loads on image models.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*