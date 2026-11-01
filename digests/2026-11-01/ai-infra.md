# AI Infrastructure Digest 2026-11-01

> Generated: 2026-11-01 00:02 UTC | Projects covered: 6

- [vLLM](https://github.com/vllm-project/vllm)
- [SGLang](https://github.com/sgl-project/sglang)
- [llama.cpp](https://github.com/ggml-org/llama.cpp)
- [Ollama](https://github.com/ollama/ollama)
- [LiteLLM](https://github.com/BerriAI/litellm)
- [Unsloth](https://github.com/unslothai/unsloth)

---

## Cross-Project Comparison

# Cross-Project Comparison Report — AI Infrastructure Digest
**Date: 2026-11-01 | Projects: vLLM, SGLang, llama.cpp, Ollama, LiteLLM, Unsloth**

---

## 1. Ecosystem Overview

The AI infrastructure stack is consolidating around three simultaneous fronts: **agentic serving economics** (priority scheduling, KV-pressure handling, and adaptive speculation in the datacenter engines — vLLM, SGLang), **local/edge runtime hardening** (backend fragmentation across CUDA, ROCm, SYCL, OpenCL, Metal/MLX, and emerging NPUs in llama.cpp and Ollama), and **gateway-layer correctness** as LiteLLM begins a Python→Rust migration. No project shipped a release in the window, but activity is intense: vLLM, SGLang, and LiteLLM together account for well over a thousand updated PRs/issues in 24 hours. The dominant theme across every layer is not new capability but **correctness under load** — speculative decoding divergence, cache hit-rate collapse, tool-call misrouting, and budget bypass — signaling that the ecosystem is shifting from "does it run?" to "does it run predictably, at cost, and under multi-tenant pressure?" Tool-call parsing, structured output, and KV-cache semantics are now the most common regression surfaces for application developers.

---

## 2. Activity Comparison

| Project | Issues Updated | PRs Updated | Releases (24h) | Latest Notable Version Signal |
|---|---|---|---|---|
| **vLLM** | Active (several open crash-class) | Busy (multiple stacked PRs) | **None** | Main tracked at `c9dbc92630`; 0.30.0 on main |
| **SGLang** | **38** | **500** | **None** | FlashInfer pinned to 0.7.2.post1 (#46926) |
| **llama.cpp** | Active (spec-dec cluster) | Active | **Yes — b12018–b12024** (7 builds) | Release train crossed **b12000** |
| **Ollama** | Active (Windows bug cluster) | Moderate (fix PRs in flight) | **None** | 0.40.13 / 0.40.4 referenced in reports |
| **LiteLLM** | **86** | **346** | **None** | Rust gateway migration in flight |
| **Unsloth** | **20** | **148** | **None** | No new version; #10613 fix presumed merged |

**Read:** SGLang (500 PRs) and LiteLLM (346 PRs) are the highest-velocity codebases, but both velocities are dominated by *refactor/migration* work (HiCache scheduler-thread refactor; Rust Redis migration) rather than net-new features. llama.cpp is the only project shipping to users daily via rolling builds. vLLM, Ollama, and Unsloth are in maintenance/fix mode with no upgrade path available today.

---

## 3. Model Support Race

| Model / Architecture | vLLM | SGLang | llama.cpp | Ollama | Unsloth | LiteLLM |
|---|---|---|---|---|---|---|
| **DeepSeek-V4 / V4.1** | ⚠️ Tracker open, **not runnable on Ampere** (#50576); recipe divergence (#46348) | ✅ AMD gfx950 attention; recipe-fidelity risk | — | ❌ Cloud only (#19249) | — | — |
| **Qwen3.8 / Qwen3.5 family** | ✅ Multiple (Flash-Next, 2.4T-A95B); XPU PR pending (#61607) | ✅ AITER fused GDN prefill (#39873) | ✅ Qwen3.5-MoE target under spec-dec bug (#31472) | ⚠️ 0.8B Q4_K_M requested (#19436) | — | — |
| **Gemma 4** | ❌ FP8 image crash (#63732) | — | ⚠️ MM + MTP fragile (#30698, #31077); image resize fix (b12021) | ❌ 500s on fresh Windows (#19420) | — | — |
| **GLM-5.3-Flash** | ⚠️ Sparse-MLA closed | ✅ FP8 KDA projections opt-in (#46426) | ❌ Support requested (#27922) | — | — | — |
| **MiniMax-M3.1** | ⚠️ NVFP4 Hopper load fail (#64932); GB200/300 presets (#64909/#64910) | ❌ Tool parser `oneOf` unresolved (#32286) | — | — | ✅ H3 streamed conditioner (#16325) | — |
| **Kimi-K3 (ROCm)** | ✅ Tracker closed (#50682) | — | — | — | — | — |
| **LFM3-Omni** | — | — | ✅ Tensor split (#31431) | ⚠️ Memory leak fix (#19438) | ✅ Audio input PR (#16242) | — |
| **Metis-1.6 (hybrid Mamba-2)** | — | — | ✅ Merge-ready (#31134) | — | — | — |
| **NemotronH** | — | ❌ Config rejects layer types (#47444) | — | — | — | — |
| **Cloud/API catalog** | — | — | — | — | — | ✅ EmpirioLabs, Turion, AI Studio logprobs (#49539/#49535/#49514) |

**Who's ahead:** **vLLM** owns broadest *training-class* model breadth (Qwen3.8, DeepSeek-V4, MiniMax, Kimi) but with significant hardware-gated gaps (Ampere A100/A800 cannot run DeepSeek-V4-Flash). **SGLang** is ahead on **AMD ROCm-specific model enablement** (gfx950 gating, Quark MXFP4, AITER kernels) and is the only project shipping GLM-5.3-Flash FP8. **llama.cpp** leads on **novel local architectures** (Metis hybrid Mamba-2+GQA, LFM3, PocketTTS) — the long tail of emerging models lands here first. LiteLLM is the only project in the set doing meaningful *provider-catalog* expansion, which is a different axis entirely. **Nobody is ahead on Gemma 4**: it is a broken combination across vLLM, Ollama, and (for MM+MTP) llama.cpp simultaneously.

---

## 4. Performance Frontier

Optimization effort is **hardware-stratified** rather than converged:

| Area | vLLM | SGLang | llama.cpp | Ollama | Unsloth |
|---|---|---|---|---|---|
| **KV cache / scheduler** | Priority preemption (#63350/#63351), spec-decode under pressure (#63079), admission backoff (#64460) | **HiCache L3 refactor** (#47617–#47626), Agentic Cache Scheduling roadmap (#43098) | MoE cache-hit regression ⚠️ (#31421, 0.6%) | Global vs per-model cache budgets (#19435); MLX 8 GiB hard cap (#18131) | — |
| **Batching** | MRV2 varlen decode graphs (#64915) | PP async depth bug (#47613) | — | — | — |
| **Quantization** | NVFP4 MoE, FP8 einsum warmup (#64827) | MXFP4 W4A16, FP8 KDA | IQ3 OpenCL, Granite NVFP4 (#31449) | — | ROCm gfx11 FP8 dequant (#15224) |
| **Distributed serving** | EPLB defaults (#30075), P/D disaggregation | NCCL 2.30 roadmap (#32774), rust-server DP-rank fixes | LFM3 tensor split; Hexagon DMA | Cluster support closed (#10786) | TP sharded loading (#15218) |
| **Kernels** | QuickReduce INT4 all-reduce ROCm (#64930) | **AITER fused GDN prefill** (4→1 kernel), dsv4 fused append | AVX2 IQ unrolling (clang), OpenCL FWHT, Adreno Q6_K | — | Fused optimizers PP (#16351) |

**Observation:** SGLang's **HiCache scheduler-thread refactor** is the single most architecturally significant optimization in the window — it eliminates a class of TP-wide collective hangs by moving storage agreement off the worker path. vLLM's **priority + spec-decode-KV-pressure** trio directly targets the tail-latency SLOs of multi-tenant gateways. llama.cpp is optimizing the *opposite* end: single-device and edge kernel efficiency (Adreno, AVX2, Hexagon). Unsloth's focus is train-side memory discipline (streamed conditioners, PP optimizer sync), not inference.

---

## 5. Layer Positioning

```
┌──────────────────────────────────────────────────────────────────┐
│  GATEWAY / ROUTING ............. LiteLLM (Python→Rust migration)  │
│     Model auth, budgets, MCP, fallbacks, provider normalization   │
├──────────────────────────────────────────────────────────────────┤
│  DATACENTER SERVING ENGINES .... vLLM  |  SGLang                  │
│     Paged attention, P/D disaggregation, priority SLOs, TP/EP     │
├──────────────────────────────────────────────────────────────────┤
│  LOCAL / EDGE RUNTIME ......... llama.cpp  |  Ollama              │
│     GGUF/quant, CPU+consumer GPU+NPU, Metal/MLX, multimodal      │
├──────────────────────────────────────────────────────────────────┤
│  TRAINING / FINE-TUNING ....... Unsloth                           │
│     LoRA/QLoRA, TP loading, Studio UI, export paths               │
└──────────────────────────────────────────────────────────────────┘
```

- **vLLM vs SGLang** compete at the datacenter serving layer, diverging on **hardware bias**: vLLM is broader across NVIDIA generations but lags on Ampere for frontier models; SGLang is aggressively co-engineering with **AMD** (gfx950, AITER, Quark MXFP4) and Rust-server infrastructure.
- **llama.cpp vs Ollama** are stacked, not competing: Ollama consumes llama.cpp/MLX runners and adds model management, an OpenAI/Anthropic compatibility layer, and a desktop Studio. Ollama's bugs (#19432 sampler override, #19416 thinking blocks) are **compatibility-layer** bugs, not inference bugs — a distinct failure surface from llama.cpp's kernel/spec-dec issues.
- **LiteLLM is the only true gateway** in the set; it is an aggregation/observability layer that sits above all engines and directly above model-provider APIs. Its Rust migration is an infrastructure-durability play (Redis key/cooldown/counter compatibility with `redis-py` 5.3.1 so Python and Rust pods can coexist during rollout).
- **Unsloth** is orthogonal — training/fine-tuning with a Studio UI. Its overlap with the serving stack is only at export (GGUF/MLX) and evaluation.

---

## 6. Trend Signals

**Trend 1 — Speculative decoding is the new correctness frontier.**
Every serving-side project has active spec-dec bugs: vLLM (drafts under KV pressure, EAGLE/MTP + hybrid prefix caching untested, #51771), SGLang (DSpark padding rows counted as accepted drafts, #47694; adaptive spec roadmap #23705), llama.cpp (greedy divergence at 100% acceptance on quantized MoE, #25618/#31472). **Watch:** if you use spec-dec + temp-0 for evaluations, caching, or replay, validate against vanilla decoding on your exact quant today.

**Trend 2 — KV cache is being re-architected, not tuned.**
vLLM's KV-pressure priority scheduler, SGLang's HiCache scheduler-thread refactor and supernode L1/L2 sharing, and llama.cpp's MoE cache-hit collapse all point at cache semantics as the source of *both* the performance ceiling and silent correctness bugs. **Watch:** the "KV cache" abstraction is becoming a scheduler-level concern with its own admission, priority, and accounting rules.

**Trend 3 — Multi-tenant SLO enforcement is going mainstream.**
Priority preemption, admission backoff, and per-key budgets are landing simultaneously in vLLM and LiteLLM — with a critical open gap: LiteLLM's #48364 (admin keys bypass `max_budget`/`tpm_limit`). **Watch:** cost controls at the gateway and latency controls at the engine will need to share semantics; expect pressure for a common admission-signaling interface.

**Trend 4 — The SAM/OpenAI/Anthropic compatibility layer is where users feel bugs.**
Ollama's biggest user-visible issues are compatibility semantics: forced sampler defaults (#19432), dropped thinking blocks (#19416), wrong tool-function dispatch (#19425). llama.cpp's `/v1/responses` `extra_params` fix (b12022) and LiteLLM's `finish_reason`/`is_error`/model-attribution bugs are the same class. **Watch:** the wire protocol between your app and the engine is now a *distinct* stability surface from the engine itself.

**Trend 5 — Hardware diversity is outpacing support homogeneity.**
ROCm gfx950/gfx11, Intel XPU/SYCL/Xe2, OpenCL/Adreno, Hexagon, Ascend NPU, XDNA — all appear in this single day's digests, and every one has an open gap. **Watch:** "which backend" is now a first-class deployment decision; targeting one backend per deployment and tracking its issue backlog (as llama.cpp's digest advises) is the pragmatic pattern.

**Trend 6 — Rust is entering the serving/gateway control plane.**
SGLang's rust-server maturation (listener validation, DP-rank addressing) and LiteLLM's Rust Redis/cooldown/counter migration are both about **eliminating Python GIL and event-loop-induced failure modes** in the control path. **Watch:** expect a split between Rust control-plane and Python-native backends, with compatibility shims (like LiteLLM's `redis-py`-matching keys) intended to allow incremental rollout rather than big-bang cutover.

**Trend 7 — Tool-call and structured-output parsing is the most common application-layer regression.**
Ollama (#19425, #19273, #19427), SGLang (#32286, #46348), and LiteLLM (#49359, #33520) all have live tool-call/structured-output defects in the window. **Watch (for agent/application developers): always validate tool-call routing server-side, treat `is_error`/`finish_reason` as untrusted, and retry on empty structured output — the parsing layer is the weakest link in today's agent stacks.**

---

### Bottom Line for Decision-Makers

- **Do not upgrade blindly:** no release shipped today for five of six projects, and the only daily-shipping project (llama.cpp) has two live spec-dec correctness bugs on quantized MoE targets.
- **Pin versions; test on your exact hardware+model+quant combination.** Ampere cannot run DeepSeek-V4-Flash on vLLM; Gemma 4 MM+MTP is broken across three projects; MiniMax NVFP4 needs `--moe-backend marlin` on Hopper.
- **Treat the compatibility/protocol layer (gateway + Ollama-style shims) as a first-class reliability concern** — it is where the majority of user-visible regressions cluster today.
- **Track SGLang's HiCache refactor and LiteLLM's Rust migration as the two highest-leverage infrastructure changes** for multi-tenant and multi-model deployments over the next release cycles.

---

## Per-Project Reports

<details>
<summary><strong>vLLM</strong> — <a href="https://github.com/vllm-project/vllm">vllm-project/vllm</a></summary>

# vLLM Digest — 2026-11-01

## 1. Today's Highlights

No new releases landed in the last 24 hours, but the issue and PR queues stayed busy across three fronts: **priority scheduling** (two stacked PRs from StevenWang-CY addressing KV-pressure preemption for high-priority requests), **DeepSeek-V4-Flash on Ampere** (issue #50576 now at 123 comments, the top-traffic issue by a wide margin), and **speculative decoding under KV pressure** (PR #63079, which proposes scheduling no-draft decodes rather than preempting a running request). On the stability side, several distinct crash-class reports (V1 model runner `KeyError` under async scheduling + preemption, XPU spec-decode regression on main, a Hopper NVFP4 MoE load failure) are open with candidate fixes in flight.

## 2. Releases & Breaking Changes

None. No releases in the last 24h. No API or config-format changes to flag today.

## 3. New Model & Hardware Support

- **[Issue #50576](https://github.com/vllm-project/vllm/issues/50576) — DeepSeek-V4-Flash / DeepSeek-V4-Flash-0731 on SM8x (Ampere A100/A800, RTX 30xx).** Long-running tracker (123 comments, 16 👍). Neither checkpoint currently runs on Ampere; blocked on the DSpark-related work referenced in #40851. If you're still on A100s, this is the model-support issue to watch.
- **[Issue #59575](https://github.com/vllm-project/vllm/issues/59575) — Qwen3.8-Flash-Next on gfx950 / MI355X (ROCm).** Performance-optimization tracker for `amd/Qwen3.8-Flash-Next-Quark-MXFP4`. Architecture includes GatedDeltaNet in 36 layers, QuerySparse Attention in 12, HyperConnection gated residual, MXFP4 MoE. Performance work landing as stacked PRs.
- **[Issue #57149](https://github.com/vllm-project/vllm/issues/57149) — Qwen3.8-2.4T-A95B on gfx950 / MI355X (ROCm).** Companion optimization tracker for the Quark MXFP4 build.
- **[PR #61607](https://github.com/vllm-project/vllm/pull/61607) — Qwen4Exp (Qwen3.8-Flash-Next) on XPU.** Adds the `xpu/` sibling under `vllm/models/qwen4_exp/` alongside existing `amd/` and `nvidia/` implementations, reusing `Qwen3NextAttention`, `QwenGatedDeltaNetAttention`, and `Qwen…` (truncated). Needs rebase.
- **[PR #64909](https://github.com/vllm-project/vllm/pull/64909) / [PR #64910](https://github.com/vllm-project/vllm/pull/64910) — MiniMax-M3.1-Flash GB200/GB300 AgentX presets.** Recipe updates to align with Dynamo + vLLM lanes in InferenceX.
- **[PR #64607](https://github.com/vllm-project/vllm/pull/64607) — Qwen3.5-397B-A17B B200 NVFP4 TP2 agentic preset.** Tuned config for long-context agentic coding traffic.

Related tracking: **[Issue #50682](https://github.com/vllm-project/vllm/issues/50682) (now closed)** — Kimi-K3 ROCm gap and roadmap tracker.

## 4. Performance & Optimization

- **[PR #63079](https://github.com/vllm-project/vllm/pull/63079) — Skip draft tokens instead of preempting under KV pressure.** When a decode's verified token fits in existing blocks and only drafts need a new block, the scheduler now schedules the decode without drafts rather than evicting another running request. Potentially significant for mixed spec-decode workloads under memory pressure.
- **[PR #63350](https://github.com/vllm-project/vllm/pull/63350) and [PR #63351](https://github.com/vllm-project/vllm/pull/63351) — Priority scheduling fixes.** #63350 lets a high-priority waiting request preempt running lower-priority requests under KV pressure (the KV-cache analogue of #40004). #63351 stacks on it to hold lower-priority prefill so a high-priority request's first tokens aren't interleaved. Directly relevant to multi-tenant gateways with tail-latency SLOs.
- **[PR #64915](https://github.com/vllm-project/vllm/pull/64915) — Model Runner V2 varlen decode graphs for fixed-width speculation.** Previously, mixed query lengths from requests entering/finishing a batch forced eligible decode batches onto the prefill path; this enables variable-length decode graphs so fixed-width spec decode keeps its graph-mode throughput.
- **[PR #64930](https://github.com/vllm-project/vllm/pull/64930) — QuickReduce and SDMA INT4 all-reduce for pure-TP microbatches (ROCm).** Stacked on #63483 (pure-TP dual-batch overlap); targets TP2 pairs with a single x… (truncated).
- **[PR #64914](https://github.com/vllm-project/vllm/pull/64914) — Cap `torch.topk` workspace in MRV2 chunked prompt logprobs.** Ranks logits in blocks of ≤64M elements; follow-up to #64841 which raised peak memory for full-vocab prompt logprobs on short multi-chunk prompts.
- **[PR #64827](https://github.com/vllm-project/vllm/pull/64827) — Warm up DeepGEMM `fp8_einsum` for DeepSeek-V4 o_proj.** Prevents JIT compilation during inference, which affects output quality during the compile step.
- **[Issue #40543](https://github.com/vllm-project/vllm/issues/40543) — Dynamic PDL enablement.** Proposal to expose `TRTLLM_ENABLE_PDL` and `TORCHINDUCTOR_ENABLE_PDL` (both undocumented) as dynamic flags for Hopper and Blackwell low-latency serving.
- **[Issue #64460](https://github.com/vllm-project/vllm/issues/64460) — KV-pool-saturated admission retries inflate decode TPOT ~2.3x.** Reports on a P/D-disaggregated Ascend 910B deployment with TP8 and ~32k token KV pool; proposes automatic admission backoff in the V1 scheduler. Platform-independent mechanism.
- **[Issue #30075](https://github.com/vllm-project/vllm/issues/30075) — EPLB default `num_redundant_experts` (closed).** Suggests defaulting to the lowest valid value derived from startup config instead of requiring manual tuning (which trades KV cache for potential perf).

## 5. Stability & Regressions

Ranked roughly by severity and blast radius:

1. **[Issue #63549](https://github.com/vllm-project/vllm/issues/63549) — Async scheduling + preemption crashes V1 model runner with `KeyError: all_token_ids[req_id]` in `_update_states`.** Present on 0.30.0 and current main (`c9dbc92630`). Reported on Qwen3.5-35B-A3B (MoE + hybrid Mamba, M-RoPE) with TP2×DP8 on 16 Ascend 910B NPUs. This is a crash on a core scheduler path — high priority for anyone running async scheduling with preemption enabled.
2. **[Issue #63732](https://github.com/vllm-project/vllm/issues/63732) — Gemma 4 + online `--quantization fp8`: image requests crash since v0.23.0.** FP8-cast pixel values reach the quantized `patch_embedder.input_proj`. **v0.22.0 works.** Regression with a clear bisect boundary; avoid the combination on 0.23.0+ until fixed.
3. **[PR #64897](https://github.com/vllm-project/vllm/pull/64897) — XPU on main is broken (`greedy_argmax` NaN handling).** Regression from #57770; fix treats NaN as `-inf` on the torch fallback to match the Triton path. Fix PR exists.
4. **[PR #64932](https://github.com/vllm-project/vllm/pull/64932) — MiniMax-M3.1 NVFP4 experts fail to load on Hopper.** `ValueError: Per-token NVFP4 activation scales are not supported by HUMMING.` Workaround: `--moe-backend marlin`. Fix PR exists (splits per-token FC1 scheme handling).
5. **[Issue #48043](https://github.com/vllm-project/vllm/issues/48043) — ROCm `kernel_paged_attention_2d` illegal memory access (`hipErrorLaunchFailure`) on gfx950 (MI350X) under long-context decode.** Triton kernel-level failure. No fix PR linked.
6. **[Issue #64489](https://github.com/vllm-project/vllm/issues/64489) — `vllm/vllm-openai:unlimited-ocr` image cannot serve Unlimited-OCR model.** Image/model mismatch; cosmetic-to-blocking depending on your pipeline.
7. **[Issue #46453](https://github.com/vllm-project/vllm/issues/46453) — Hybrid Mamba + KV connector: per-group prefix-hit divergence causing engine crash.** Related to **[Issue #51771](https://github.com/vllm-project/vllm/issues/51771)**, which documents that EAGLE/MTP block drop + prefix caching is untested for hybrid models with ≥3 attention groups (DeepSeek-V4-Flash + DSpark lands in that bucket). If you're running hybrid models with prefix caching and speculation, read both.
8. **[PR #64430](https://github.com/vllm-project/vllm/pull/64430) — Hybrid Mamba state: `num_accepted_tokens_gpu` reset guarded for non-speculative serving.** Related to ongoing investigation in #63646 (async CUDA kernel fault). Fix PR exists.
9. **[PR #64934](https://github.com/vllm-project/vllm/pull/64934) — Mistral: developer role → system normalization.** Fixes #64793. OpenAI Responses API and Chat Completions reject `role: "developer"` with `--tokenizer-mode mistral` due to `mistral_common` Pydantic validation.
10. **[Issue #61972](https://github.com/vllm-project/vllm/issues/61972) — `--reasoning-parser qwen3` leaves leading `\n\n` in content.** Cosmetic but affects agent output parsing.
11. **[PR #62553](https://github.com/vllm-project/vllm/pull/62553) — Restrict Jamba LoRA target modules to non-MoE layers.** Fixes #61853; prevents scanning packed expert projections.

Also closed today: #46726 (sparse-MLA indexer error, GLM 5.2 NVFP4 on RTX 6000 Pro SM120), #44734 (CUDA device-side assert with Qwen3.6-35B-A3B-NVFP4 + MTP), #45661 (NvFp4 MoE backend deployment config), #46311 (hybrid INT4+FP8 AutoRound checkpoint loading), #43750 (XPU compressed-tensors WNA16 MoE selector).

## 6. What This Means for Application Developers

- **If you're serving on Ampere (A100/A800, RTX 30xx):** DeepSeek-V4-Flash is still not runnable on your hardware. Budget for this in any migration planning, and consider whether H100/H200/MI300-class capacity is in scope.
- **If you rely on async scheduling with preemption:** treat issue #63549 as a watch item. It reproduces on current main on a mainstream MoE model (Qwen3.5-35B-A3B), and the failure is a hard crash rather than degraded output. Consider disabling async scheduling until a fix merges.
- **If you're on v0.23.0+ with Gemma 4 and online FP8 quantization:** image requests will crash. Either downgrade to v0.22.0 or disable online FP8 quantization for that model. This is a clean, bisectable regression.
- **If you run multi-tenant gateways with priority classes:** the two scheduler PRs (#63350, #63351) plus the spec-decode-under-pressure PR (#63079) collectively address the most common source of tail-latency regressions under KV pressure. Worth tracking for your next version bump.
- **If you're on ROCm gfx950:** long-context decode with `kernel_paged_attention_2d` can fault. No fix linked yet — monitor #48043 if MI350X is in your fleet.
- **If you're using MiniMax-M3.1 NVFP4 on Hopper:** workaround today is `--moe-backend marlin`; the fix (#64932) is in review.
- **Hybrid models + prefix caching + speculation:** issues #51771 and #46453 together indicate this combination is under-tested. Validate your specific model config before depending on prefix-cache hit rates under speculative decoding with ≥3 attention groups.

</details>

<details>
<summary><strong>SGLang</strong> — <a href="https://github.com/sgl-project/sglang">sgl-project/sglang</a></summary>

# SGLang Digest — 2026-11-01

## 1. Today's Highlights

No releases in the last 24h, but the repository is highly active: **38 issues** and **500 PRs** were updated. The dominant themes are a large HiCache L3 pipeline refactor (moving storage agreement onto the scheduler thread to eliminate hang-induced collective failures), continued rust-server hardening (listener validation, DP-rank addressing), and CI flakiness tracking that has now accumulated 160 comments. On the correctness side, several closed/aged bugs remain relevant context (PR disaggregated decode, MM tool-call parsing), while new bugs landed around dspark verification, PRE disaggregation, and NemotronH config parsing.

## 2. Releases & Breaking Changes

None in the last 24h. However, two migration items deserve attention:

- **RFC: Complete migration to the shared `api.v1` backend API** ([#45816](https://github.com/sgl-project/sglang/issues/45816)) — Unifies generation behind the Rust server's `api.v1.Generate` schema. Covers processor migration (`sgl-processor` → `api.v1`), router `Generate` migration, and schema coverage completion. This is an API-shape convergence effort; external integrators relying on legacy generate paths should track this roadmap.
- **FlashInfer bump to 0.7.2.post1** ([#46926](https://github.com/sgl-project/sglang/pull/46926)) — Pins updated in `flashinfer_python`, both Dockerfiles, and the runtime version check in `engine.py`.

## 3. New Model & Hardware Support

- **AMD gfx950 (MI350-class): AITER prefill attention now allowed in deterministic mode** ([#45601](https://github.com/sgl-project/sglang/pull/45601)) — Extends #44489 (decode) to prefill phase; depends on per-phase attention backend validation (#44438).
- **AMD Quark MXFP4 W4A16 MoE: gate widened to consumer RDNA** ([#47585](https://github.com/sgl-project/sglang/pull/47585)) — Fixes a regression from #47408 that restricted the path to gfx1151; now covers gfx11xx/gfx1200/gfx1201 and fails clearly without AITER.
- **AMD Qwen3-Next: AITER fused GDN prefill kernel** ([#39873](https://github.com/sgl-project/sglang/pull/39873)) — Collapses the four-kernel prefill chain into one, avoiding large intermediate tensor round-trips.
- **NCCL 2.30 feature integration roadmap** ([#32774](https://github.com/sgl-project/sglang/issues/32774)) — NCCL EP, cross-group M-to-N reshard, zero-SM one-sided communication, RAS monitoring, and communicator checkpointing are under evaluation for SGLang serving workloads.
- **Intel Xeon CPU backend Q4 roadmap** ([#44675](https://github.com/sgl-project/sglang/issues/44675)) — Continued optimization for small/medium LLMs, MoE execution, and selected diffusion workloads.
- **GLM-5.3-Flash FP8 KDA projections (opt-in)** ([#46426](https://github.com/sgl-project/sglang/pull/46426)) — `SGLANG_OPT_GLM53_KDA_PTPC_MODULES=1` runs BF16 linear-attention projections in FP8.

## 4. Performance & Optimization

- **DSpark spec-decode: refresh Mamba tracking once per verification step** ([#47494](https://github.com/sgl-project/sglang/pull/47494)) — Eliminates a duplicate `prepare_mamba_track_for_verify` call per non-idle decode step when Mamba prefix-cache tracking is enabled.
- **dsv4 (AMD): fold padded-weight zeroing into the fused append kernel** ([#36530](https://github.com/sgl-project/sglang/pull/36530)) — Removes a per-MoE-layer `_zero_topk_weights_padded_region` launch from the shared-slot path.
- **HiCache: three-PR staged refactor** ([#47617](https://github.com/sgl-project/sglang/pull/47617), [#47620](https://github.com/sgl-project/sglang/pull/47620), [#47621](https://github.com/sgl-project/sglang/pull/47621), [#47626](https://github.com/sgl-project/sglang/pull/47626)) — Moves hit queries, transfer completion, and host allocation agreement to the scheduler thread; adds bounded storage calls, orphan quarantine, and flush-without-thread-joins.
- **Humming MoE backend: free replaced weights per sublayer** ([#45200](https://github.com/sgl-project/sglang/pull/45200)) — Fixes memory retention on 8×H-class nodes where padded repacked copies kept originals referenced.
- **Reported regression context**: dsv4 prefill on SM120 (4× RTX PRO 6000, TP=4) runs ~2–7K tok/s vs ~12.5K reported via vLLM/marlin on identical hardware ([#33422](https://github.com/sgl-project/sglang/issues/33422)); still open with no fix PR — kernel-coverage gap on Blackwell consumer SM120.
- **gpu_tensor_hash int32 overflow fix** ([#47066](https://github.com/sgl-project/sglang/pull/47066)) — Tensors >8 GiB previously wrapped offsets negative, causing illegal memory access during `/weights_checker` checksums.

## 5. Stability & Regressions

Ranked by severity:

1. **[OPEN] PP disaggregated decode produces garbage (token-0 runs)** when `pp_async_batch_depth > pp_size / 2` ([#47613](https://github.com/sgl-project/sglang/issues/47613)) — Checksum evidence isolates the receive/release path; no fix PR yet.
2. **[OPEN] EAGLE draft extend crashes with negative dimension** under DP attention + FlashInfer A2A + prefill CUDA graph ([#47490](https://github.com/sgl-project/sglang/issues/47490)).
3. **[OPEN] dspark compact verify counts padding rows as accepted drafts** — Fix PR open ([#47694](https://github.com/sgl-project/sglang/pull/47694)); padding sentinel id 0 with zero logits could inflate acceptance.
4. **[OPEN] rust-server: `gather_server_endpoints` can advertise loopback/unroutable addresses** to other DP ranks, warning only ([#47509](https://github.com/sgl-project/sglang/issues/47509)) — Validation PR open ([#47691](https://github.com/sgl-project/sglang/pull/47691)).
5. **[OPEN] rust-server: attention-DP listeners on one CPU mask pin frontends to the same cores** ([#47598](https://github.com/sgl-project/sglang/issues/47598)).
6. **[OPEN] multi-tokenizer abort misrouting** — Follow-up to #47546 covering `tokenizer_worker_num > 1`; fix PR open ([#47693](https://github.com/sgl-project/sglang/pull/47693)).
7. **[OPEN] dsv41 recipe rendering diverges from checkpoint `encoding.py`** (tool namespaces, reasoning placement) ([#46348](https://github.com/sgl-project/sglang/issues/46348)) — Prompt-fidelity risk for DeepSeek-V4/V4.1.
8. **[OPEN] NemotronHConfig rejects transformers 5 layer types** `linear_attention`/`full_attention` ([#47444](https://github.com/sgl-project/sglang/issues/47444)).
9. **[OPEN] Benchmark `--dataset-name random` silently requires ShareGPT download** — fails on offline networks ([#47420](https://github.com/sgl-project/sglang/issues/47420)).
10. **[OPEN] S3 `--model-path` overrides explicit ModelExpress/runai_streamer selection** ([#47428](https://github.com/sgl-project/sglang/issues/47428)).
11. **[OPEN] MiniMax-M3 tool parser: top-level `oneOf` unresolved** — numbers become strings, arrays leak raw tags ([#32286](https://github.com/sgl-project/sglang/issues/32286), closed inactive but may persist).
12. **[OPEN] `/v1/responses` drops `prompt_cache_key`** instead of applying to radix-cache identity ([#37263](https://github.com/sgl-project/sglang/issues/37263)).
13. **CUDA Coredump Tracker** ([#26340](https://github.com/sgl-project/sglang/issues/26340)) — 351 comments and rising; persistent auto-collected coredump volume on PR-test runs.
14. **CI flaky tests / infra failures** ([#42752](https://github.com/sgl-project/sglang/issues/42752)) — 160 comments; NVFP4 Marlin MoE flake (T8) targeted by [#47687](https://github.com/sgl-project/sglang/pull/47687).

## 6. What This Means for Application Developers

- **Speculative decoding is becoming adaptive by default intent**: the Adaptive Speculative Decoding roadmap ([#23705](https://github.com/sgl-project/sglang/issues/23705)) targets agentic/mixed workloads where acceptance rates swing between phases. If you serve coding agents or variable-complexity prompts, expect future builds to tune speculation depth per phase — but today, watch the DSpark padding-acceptance fix ([#47694](https://github.com/sgl-project/sglang/pull/47694)) if you rely on cheap draft verification.
- **KV cache behavior is changing under the hood**: the HiCache scheduler-thread refactor reduces a class of TP-wide hangs, and the Agentic Cache Scheduling roadmap ([#43098](https://github.com/sgl-project/sglang/issues/43098)) promises supernode-wide L1/L2 KV sharing with router cache-location awareness. Long-running agent sessions with shared prefixes benefit most.
- **Tool-call parsing remains a soft spot**: MiniMax-M3 `oneOf` schema resolution and DeepSeek-V4.1 recipe divergence are both open. If your app depends on structured tool-call output, test against specific model+parser combos and consider schema flattening on your side.
- **Rust server is maturing but has sharp edges**: address-family validation, DP-rank listener checks, and CPU-mask collisions are being actively fixed. Production multi-node DP deployments should pin to a build after [#47691](https://github.com/sgl-project/sglang/pull/47691) lands.
- **API convergence is coming**: the `api.v1` migration ([#45816](https://github.com/sgl-project/sglang/issues/45816)) will eventually ripple into gateway-compatible request shapes. If you've written a custom LLM gateway against SGLang endpoints, begin tracking this RFC now to avoid a hard cutover later.

</details>

<details>
<summary><strong>llama.cpp</strong> — <a href="https://github.com/ggml-org/llama.cpp">ggml-org/llama.cpp</a></summary>

# llama.cpp Digest — 2026-11-01

## 1. Today's Highlights

A dense release day (b12018–b12024) with the release train crossing the b12000 line, headlined by multimodal fixes for LFM and Gemma 4, an OpenCL FWHT kernel addition, and a server-side fix for `/v1/responses` `extra_params`. On the issue tracker, speculative decoding correctness on quantized targets remains the most active area of concern, with a fresh report (#31472) that draft-dflash/dspark breaks temp-0 output identity on Qwen3.5-MoE targets even at 100% acceptance rate. Meanwhile, SYCL and OpenCL backends saw continued hardening, and a MoE cache-hit regression (#31421, 0.6% hit rate) is still live on master.

## 2. Releases & Breaking Changes

No breaking API or config changes landed in the last 24h. Notable release-window items:

- **b12024** — Reshape MUL_MAT to 2D instead of 3D tensor for LFM scatter. [Release](https://github.com/ggml-org/llama.cpp/releases)
- **b12023** — server: cap shared decision prefixes at the first output (fixes #30482). [PR #30710](https://github.com/ggml-org/llama.cpp/pull/30710)
- **b12022** — server: fix `/v1/responses` endpoint to accept `extra_params`. [PR #30959](https://github.com/ggml-org/llama.cpp/pull/30959)
- **b12021** — mtmd: resize Gemma 4 images without letterbox padding. [PR #30922](https://github.com/ggml-org/llama.cpp/pull/30922)
- **b12020** — opencl: add FWHT kernel. [PR #31434](https://github.com/ggml-org/llama.cpp/pull/31434)
- **b12019** — chat: strip think block in qwen3-coder under `reasoning_format none`. [PR #31380](https://github.com/ggml-org/llama.cpp/pull/31380)
- **b12018** — sycl: fix f32→q2_0/q4_0/q5_0 rounding in CPY. [PR #31120](https://github.com/ggml-org/llama.cpp/pull/31120)

Note: the `/v1/responses` `extra_params` fix (b12022) is worth calling out for gateway integrators — previously rejected extra params, now accepted.

## 3. New Model & Hardware Support

- **Metis-1.6 architecture** (Praxis ~2.94B, Logos ~10.2B) — hybrid Mamba-2 + GQA, fixed-depth recurrence. PR open, merge ready. [PR #31134](https://github.com/ggml-org/llama.cpp/pull/31134)
- **PocketTTS voices without cloning** — multimodal/TTS path addition. [PR #31429](https://github.com/ggml-org/llama.cpp/pull/31429)
- **LFM3 tensor split enabled** — tested on Qualcomm SA8797P, with PPL/KLD tables. [PR #31431](https://github.com/ggml-org/llama.cpp/pull/31431)
- **OpenCL IQ3 support** (IQ3_S, IQ3_XXS), Adreno-optimized, referencing the earlier #30180 path. [PR #31338](https://github.com/ggml-org/llama.cpp/pull/31338)
- **Granite NVFP4 weight scales** — FFN `*_s` now attached correctly (fixes #31448, off-by-global-scale garbling). [PR #31449](https://github.com/ggml-org/llama.cpp/pull/31449)
- **SYCL MUL_MAT/SET_ROWS/CPY type allow-list** — explicit accepted types, replacing fall-through rejection. [PR #31460](https://github.com/ggml-org/llama.cpp/pull/31460)
- **XDNA (AMD NPU) backend** — still an open enhancement request with 39 👍. [#21725](https://github.com/ggml-org/llama.cpp/issues/21725)
- **GLM5.3 (flash) support request** — open, 18 👍. [#27922](https://github.com/ggml-org/llama.cpp/issues/27922)

## 4. Performance & Optimization

- **AVX2 IQ unrolling for clang** — `ggml_vec_dot_{iq1_s,iq1_m,iq2_xxs,iq2_s}_q8_K` loops not fully unrolled by clang 20.1.8 (Windows CPU release ships rolled loops); PR adds `#pragma` to match gcc -O3. [PR #31420](https://github.com/ggml-org/llama.cpp/pull/31420)
- **OpenCL disk program cache for flash attention** — regular kernels benefit already; this extends it to FA. Cuts first-token latency for FA-heavy workloads. [PR #31484](https://github.com/ggml-org/llama.cpp/pull/31484)
- **OpenCL Adreno 830 Q6_K GEMM fix** — resolves `CL_INVALID_WORK_GROUP_SIZE` in batched Q6_K matmul on Snapdragon 8 Elite. [PR #31485](https://github.com/ggml-org/llama.cpp/pull/31485)
- **SYCL oneDNN Q4_0 prompt matmul without f16 weight conversion** — enhancement request, would avoid a format-conversion tax on prompt processing. [#31466](https://github.com/ggml-org/llama.cpp/issues/31466)
- **Xe2/Battlemage IQ codebook + XMX kernels** — enhancement for SYCL IQ quantization performance. [#31195](https://github.com/ggml-org/llama.cpp/issues/31195)
- **Hexagon DMA strides > 24 bits** — fix for transfers > 16M on v75+ devices. [PR #31442](https://github.com/ggml-org/llama.cpp/pull/31442)
- **CI migration** — self-hosted CPU jobs moving to HF runners. [PR #31439](https://github.com/ggml-org/llama.cpp/pull/31439)

## 5. Stability & Regressions

Ranked by severity:

1. **CRITICAL — Speculative decoding output divergence on quantized targets.** [#25618](https://github.com/ggml-org/llama.cpp/issues/25618) (35 comments) — greedy output diverges from vanilla on Q4_K_M targets; matches on bf16. New, related: [#31472](https://github.com/ggml-org/llama.cpp/issues/31472) — draft-dflash/dspark breaks temp-0 identity on Qwen3.5-MoE **at 100% acceptance**, backend-independent. This invalidates determinism assumptions for MoE + spec-dec stacks. No fix PR identified.
2. **HIGH — CUDA illegal memory access, Gemma 4 31B + draft-mtp.** [#31077](https://github.com/ggml-org/llama.cpp/issues/31077) — occurs after KV cache rollback/clear (checkpoint restore or full re-process); no crash with MTP off. Reproduces on official Windows CUDA builds b11734/b11796/b11840.
3. **HIGH — MoE cache hit rate collapse to 0.6%.** [#31421](https://github.com/ggml-org/llama.cpp/issues/31421) — Homebrew SLRU build vs. locally built LRU baseline; regression tracked to #30637. Direct impact on throughput for MoE serving.
4. **HIGH — Gemma 4 + `--mmproj` + MTP aborts on startup.** [#30698](https://github.com/ggml-org/llama.cpp/issues/30698) — regression in #30257, `GGML_ASSERT(ubatch->embd_state)`. 5 👍.
5. **MEDIUM — SYCL server-intel container SIGSEGV.** [#31369](https://github.com/ggml-org/llama.cpp/issues/31369) — oneAPI 2026.1 persistent device code cache; crashes on both flint and LFM3-Audio GGUFs at b11960.
6. **MEDIUM — SYCL `--fit` memory accounting overflow.** [#27595](https://github.com/ggml-org/llama.cpp/issues/27595) — Arc B70 runtime OOM despite fit.
7. **MEDIUM — CUDA FA crash on SM70 V100 with non-standard head dims.** [#28661](https://github.com/ggml-org/llama.cpp/issues/28661) — `ggml_cuda_flash_attn_ext_mma_f16_case` invalid argument.
8. **MEDIUM — Vulkan DeviceLost on R9700 with SAM/ReBAR.** [#29623](https://github.com/ggml-org/llama.cpp/issues/29623)
9. **MEDIUM — CUDA invalid argument on 7× Volta layer-split.** [#29255](https://github.com/ggml-org/llama.cpp/issues/29255) — probabilistic, triggered by large prefill + partial prefix reuse.
10. **LOW — gptneox FFN GELU mismatch.** [#31456](https://github.com/ggml-org/llama.cpp/issues/31456) — model uses tanh GELU but Pythia is trained with erf GELU; silent quality degradation.
11. **LOW — iSWA `seq_rm` returns true after cut into overwritten SWA rows** (`swa_full=false`). [#31457](https://github.com/ggml-org/llama.cpp/issues/31457) — silent wrong decode; API-level correctness issue.
12. **LOW — `install.ps1` latest resolves to b11941 while v0.8.0/b11985 exist.** [#31433](https://github.com/ggml-org/llama.cpp/issues/31433) — closed.
13. **CLOSED/STALE resolved today:** Vulkan perf regression #24066 (CLOSED), SYCL tensor-split leak #27845 (CLOSED), Vulkan Arc 140V garbage output #28648 (CLOSED), GDN perplexity non-monotonicity #28879 (CLOSED), test-recurrent-state-rollback flakiness #30199 (CLOSED).

Fix PRs landed for related areas: speculative load sharing in llama-server [PR #26114](https://github.com/ggml-org/llama.cpp/pull/26114) (CLOSED), shared-KV attention tensor rotation fix [PR #31406](https://github.com/ggml-org/llama.cpp/pull/31406) (CLOSED).

## 6. What This Means for Application Developers

- **Do not assume spec-dec determinism on quantized targets.** If your agent loop relies on temp-0 reproducibility (e.g., for caching, evals, or replay), validate against vanilla decoding on the exact quant you ship. Issues #25618 and #31472 indicate this is a live, backend-independent correctness gap on Q4-class MoE models.
- **MoE serving economics regressed.** The 0.6% cache hit rate in #31421 means batch/prefix caching has effectively stopped working on some builds — revisit your throughput models and consider pinning to a known-good build until #30637 fallout is resolved.
- **Gateway integrators: `/v1/responses` now accepts `extra_params`** (b12022). If you were working around this by stripping params before forwarding, you can now pass them through.
- **qwen3-coder reasoning parsing fixed** under `reasoning_format none` (b12019) — downstream parsers that relied on the think block being present should be reviewed.
- **Gemma 4 multimodal + MTP remains fragile** (#30698, #31077). If you're building vision + speculative decoding pipelines on Gemma 4, stage MTP behind a feature flag and test KV rollback paths specifically.
- **Windows on Snapdragon gains ground** — Adreno 830 Q6_K fix plus OpenCL disk program cache make mobile/edge inference more viable; IQ3 support lands soon.
- **Edge/NPU story is broadening** (Metis hybrid Mamba+GQA, XDNA request, Hexagon strides) but backend fragmentation means you should target one backend per deployment and track its issue backlog specifically.

</details>

<details>
<summary><strong>Ollama</strong> — <a href="https://github.com/ollama/ollama">ollama/ollama</a></summary>

# Ollama Digest — 2026-11-01

## 1. Today's Highlights

No releases shipped in the last 24 hours, but the issue tracker is unusually active around **OpenAI/Anthropic compatibility-layer correctness** — sampler defaults silently overriding Modelfile parameters are now being fixed ([#19432](https://github.com/ollama/ollama/pull/19432)), and multi-block thinking handling on `/v1/messages` is getting attention ([#19416](https://github.com/ollama/ollama/pull/19416)). A cluster of Windows-specific stability bugs (connection resets, runner disconnects during tool calling) is also accumulating without fixes yet. On the optimization side, MLX prompt-cache budgeting and CUDA library loading are the two active threads.

---

## 2. Releases & Breaking Changes

**No new releases in the last 24h.**

Behavioral changes landing via closed PRs (not yet released — monitor for the next tag):

- **[CLOSED] [#19432](https://github.com/ollama/ollama/pull/19432) — `openai: don't override model sampler defaults`**: The OpenAI-compatible endpoints (`/v1/chat/completions`, `/v1/completions`) previously injected `temperature: 1.0` / `top_p: 1.0` and zeroed penalties when the client omitted them, clobbering model-packaged defaults. Concretely: `lfm3` ships `temperature 0.1` but ran at `1.0` over `/v1`; `qwen3-coder` (0.7/0.8) and `deepseek-r1` were similarly affected. This closes [#18690](https://github.com/ollama/ollama/issues/18690) and [#17744](https://github.com/ollama/ollama/issues/17744). **If you rely on the old forced defaults, you will see output distribution shift after upgrading.**
- **[CLOSED] [#10786](https://github.com/ollama/ollama/pull/10786) — Parallel Cluster Support**: Community-contributed distributed cluster support, closed. Likely superseded; no merge signal.

No config-format or API-surface breaking changes today.

---

## 3. New Model & Hardware Support

**No merges landed**, but several model/backend requests and fixes are in flight:

- **[OPEN PR #18631](https://github.com/ollama/ollama/pull/18631)** — Load `gemma4` MoE experts in the mlx-lm `switch_glu` layout. Currently `mlx-community/gemma-4-26B-A4B-it-qat-4bit` (and similar MoE checkpoints) import via `ollama create` but fail at load with `missing MoE expert weights`. Fixes [#18540](https://github.com/ollama/ollama/issues/18540).
- **[OPEN PR #19433](https://github.com/ollama/ollama/pull/19433)** — MLX: load bundled CUDA libraries in-process on Linux. Follow-up to [#17956](https://github.com/ollama/ollama/pull/17956); `libcusolver` in `mlx_cuda_v13` searches only its own directory, so the server was picking up host CUDA libraries instead of the bundled ones. Affects MLX-on-CUDA deployments.
- **[ISSUE #19436](https://github.com/ollama/ollama/issues/19436)** — Request to publish `qwen3.5:0.8b-q4_K_M`. All other Qwen3.5 sizes have Q4_K_M except 0.8B; on CPU, `q4_*` is roughly 2× faster than `q8_*`.
- **[ISSUE #19428](https://github.com/ollama/ollama/issues/19428)** — Model request: **VirbiusGuard** (0.6B EN/中文 agent-safety & prompt-injection guard, Apache-2.0, fine-tuned from `Qwen3Guard-Gen-0.6B`), already self-published under a user namespace.
- **[CLOSED ISSUE #15887](https://github.com/ollama/ollama/issues/15887)** — MIMO v2.5 (Xiaomi, MIT, million-token context) cloud addition request closed without merge noted.

---

## 4. Performance & Optimization

- **[OPEN ISSUE #18131](https://github.com/ollama/ollama/issues/18131)** — MLX prefix cache has a **hard-coded 8 GiB budget**, causing heavy swap on 32 GB Apple Silicon during agent workloads (`qwen3.8:27b-mlx`). Diagnosed as expected cache growth, not a leak (per [#17924](https://github.com/ollama/ollama/issues/17924)), but the fixed ceiling is the problem.
- **[OPEN ISSUE #19435](https://github.com/ollama/ollama/issues/19435)** — Follow-up to #18131: **prompt cache budgets are global, not per-model**. `LLAMA_ARG_CACHE_RAM` applies uniformly to every llama-server runner; the MLX runner is hard-capped at 8 GiB. `OLLAMA_CACHE_RAM` ([#18265](https://github.com/ollama/ollama/pull/18265)) would partially address this. **Relevant if you co-host multiple models with divergent cache needs.**
- **[OPEN PR #19422](https://github.com/ollama/ollama/pull/19422)** — Port llama-server's token repeat limit to `mlxrunner.Client.Completion`: abort generation after 101 consecutive identical tokens (`prediction aborted, token repeat limit reached`). Prevents stuck generations from burning compute indefinitely. Partial fix for [#16179](https://github.com/ollama/ollama/issues/16179); complements [#18374](https://github.com/ollama/ollama/pull/18374).
- **[OPEN PR #19284](https://github.com/ollama/ollama/pull/19284)** — Stop evicting CPU-only runners on discrete GPUs. When a new model needs a full GPU fit, `load()` was evicting CPU-only runners (e.g. `num_gpu 0` embedding models) that consume **no VRAM** — pure churn. Now skipped when every target GPU is discrete and no loaded runner holds VRAM. Refs [#19279](https://github.com/ollama/ollama/issues/19279).
- **[OPEN ISSUE #15597](https://github.com/ollama/ollama/issues/15597)** — `ollama ls` takes exactly **5 seconds in a TTY** (`pselect6` timeout on stdout), ~14 ms when piped. Still open since April; worth noting for interactive tooling.
- **[OPEN PR #19408](https://github.com/ollama/ollama/pull/19408)** — Allow longer state/schema inputs for MLX decision models while bounding total prompt expansion before runner load; oversized requests get a generic 413.

---

## 5. Stability & Regressions

Ranked by severity. Several have fix PRs; several do **not**.

**High — request failures / data-path corruption:**

- **[OPEN #19439](https://github.com/ollama/ollama/issues/19439)** — *No fix PR.* Windows + RTX 5090, Ollama 0.40.13: runner disconnects during native tool calling, HTTP 500 on `/tokenize`. Reproduces with Muse Glimmer 30B and Qwen models via Open WebUI 0.12.5. Fresh, no workaround noted.
- **[OPEN #19420](https://github.com/ollama/ollama/issues/19420)** — *No fix PR.* Fresh Windows 11 install, Gemma4 returns **500 internal server error on every prompt** regardless of input. 18 comments, actively triaged.
- **[OPEN #19139](https://github.com/ollama/ollama/issues/19139)** — *No fix PR.* Windows, Ollama 0.40.4, RTX 3090 24 GB: `/api/chat` **connection resets after ~15 s with large prompts**. Reproducible; root cause unidentified. Tagged `needs more info`.
- **[OPEN #19425](https://github.com/ollama/ollama/issues/19425)** → **[FIX PR #19426](https://github.com/ollama/ollama/pull/19426)** — Generic tool parser **dispatches to the wrong function** when a JSON argument string contains another registered function's name before the `name` field. Example: `{"arguments":{"content":"search"},"name":"write_file"}` selects `search` but passes `write_file` args. **Silent correctness bug — verify your tool-call routing if you use the generic parser.**

**Medium — context / compatibility-layer correctness:**

- **[OPEN #19415](https://github.com/ollama/ollama/issues/19415)** → **[FIX PR #19416](https://github.com/ollama/ollama/pull/19416)** — Anthropic `/v1/messages`: only the **last** thinking block of an assistant message is preserved; earlier blocks silently dropped during conversion. Breaks clients that replay multi-block assistant turns. Fix adds preservation.
- **[OPEN #19249](https://github.com/ollama/ollama/issues/19249)** — *No fix PR.* Claude Code auto-compress fails with `deepseek-v4.1-flash:1017-cloud`; long runners exhaust context without compacting, burning tokens on "Goal not yet met" loops. Cloud-path specific.
- **[OPEN #19427](https://github.com/ollama/ollama/issues/19427)** — *No fix PR.* `gemma3:4b` returns **empty JSON `{}`** with long extraction prompts + Pydantic JSON schema via Python library. Structured-output regression.
- **[OPEN #19424](https://github.com/ollama/ollama/issues/19424)** — *No fix PR.* Qwen models: when a `</thinking>` tag closes, **the entire chat run terminates** instead of continuing. Reproduces across Qwen variants.
- **[OPEN ISSUE #19404](https://github.com/ollama/ollama/issues/19404)** → **[FIX PR #19431](https://github.com/ollama/ollama/pull/19431)** — CRLF Modelfiles leak `\r` into triple-quoted values, injecting carriage returns into system prompts and templates sent to the model. Windows-authored Modelfiles affected.
- **[OPEN PR #19198](https://github.com/ollama/ollama/pull/19198)** — OpenAI message with text-then-image splits into two Ollama messages; truncation can keep the image and **drop the text describing it**. Fix keeps multipart image parts together. Fixes [#7484](https://github.com/ollama/ollama/issues/7484).

**Lower — memory hygiene / edge cases:**

- **[OPEN #19437](https://github.com/ollama/ollama/issues/19437)** → **[FIX PR #19438](https://github.com/ollama/ollama/pull/19438)** — LFM3-Omni speech on macOS: memory grows per request (2.6 GB → 4.2 GB over 8 short `--voice female` runs), retained after idle. Fix releases temporary speech cache views.
- **[OPEN PR #19421](https://github.com/ollama/ollama/pull/19421)** — `POST /api/blobs/:digest` renames the temp file into `blobs/` **before** verifying the digest; on mismatch it returns 400 but **leaves the corrupt blob on disk**. Digest check before store.
- **[OPEN PR #19423](https://github.com/ollama/ollama/pull/19423)** — Modelfile parameter names and message roles are documented as case-insensitive but only instruction names are; `PARAMETER Temperature 0.5` errors. Fixes [#19405](https://github.com/ollama/ollama/issues/19405).
- **[OPEN PR #14813](https://github.com/ollama/ollama/pull/14813)** — `OLLAMA_ORIGINS` with a trailing comma panics on empty-string origin. Long-standing robustness fix.
- **[OPEN #19430](https://github.com/ollama/ollama/issues/19430)** — `ollama pull` TLS handshake timeout on networks that drop post-quantum (X25519MLKEM768) ClientHellos. Network-env specific.
- **[OPEN PR #19274](https://github.com/ollama/ollama/pull/19274)** — `gemma4:e4b` leaves lists unclosed in long tool-call arguments (`edits:[...` missing `]`/`}`); parser can't repair, call logged malformed. Fixes [#19273](https://github.com/ollama/ollama/issues/19273).

---

## 6. What This Means for Application Developers

- **Audit your sampler defaults now.** If you call `/v1/chat/completions` and omit `temperature`/`top_p`, you have been silently running at `1.0` regardless of what the model packages. [#19432](https://github.com/ollama/ollama/pull/19432) fixes this — expect output distribution shifts for `lfm3`, `qwen3-coder`, `deepseek-r1` and others after the next release. Pin explicitly if you depend on current behavior.
- **Verify tool-call routing if you use the generic parser.** [#19425](https://github.com/ollama/ollama/issues/19425) is a silent wrong-function-dispatch bug with a fix in [#19426](https://github.com/ollama/ollama/pull/19426). Until merged, be defensive: log the selected function name server-side and cross-check against the schema.
- **Anthropic `/v1/messages` clients replaying multi-block thinking will lose context.** [#19416](https://github.com/ollama/ollama/pull/19416) is the fix; until it ships, avoid relying on earlier thinking blocks persisting.
- **Windows is the current rough edge.** Connection resets with large prompts ([#19139](https://github.com/ollama/ollama/issues/19139)), runner disconnects during tool calling on RTX 5090 ([#19439](https://github.com/ollama/ollama/issues/19439)), and fresh-install 500s ([#19420](https://github.com/ollama/ollama/issues/19420)) all lack fixes. If you run agents on Windows without retry/backoff, add it.
- **MLX + agent workloads on 32 GB Apple Silicon is a swap risk.** The 8 GiB fixed prefix cache budget ([#18131](https://github.com/ollama/ollama/issues/18131)) and global cache accounting ([#19435](https://github.com/ollama/ollama/issues/19435)) aren't configurable per-model yet. Budget memory accordingly or run smaller context.
- **CPU-only runner eviction on discrete GPUs** ([#19284](https://github.com/ollama/ollama/pull/19284)) was causing unnecessary embed-model reloads on hosts mixing GPU inference with CPU embeddings. If you co-locate these, this one's for you.
- **Structured output + long prompts on smaller models is unreliable right now** (`gemma3:4b` returning empty JSON, [#19427](https://github.com/ollama/ollama/issues/19427); Qwen thinking truncation, [#19424](https://github.com/ollama/ollama/issues/19424)). Validate JSON, retry on empty objects, and prefer larger models for extraction pipelines until these close.

---

*Sources: [github.com/ollama/ollama](https://github.com/ollama/ollama) issues and PRs updated 2026-10-31 → 2026-11-01.*

</details>

<details>
<summary><strong>LiteLLM</strong> — <a href="https://github.com/BerriAI/litellm">BerriAI/litellm</a></summary>

# LiteLLM Digest — 2026-11-01

## 1. Today's Highlights

No new releases in the last 24h, but the issue/PR firehose is active: **346 PRs** and **86 issues** updated, with heavy focus on a Rust-based gateway migration (Redis settings, cooldowns, TPM/RPM counters), MCP tool-call correctness, and provider-specific streaming bugs. Several **breaking-change PRs** are in flight around guardrails masking behavior, realtime audio billing, and proxy hot-reload with multi-worker setups.

## 2. Releases & Breaking Changes

No releases today. Notable breaking-change PRs under review:

- **Guardrails: mask prompt in failure logs for `logging_only` Presidio** — failed chat calls previously leaked raw PII (names, emails) to Langfuse and other loggers. [PR #49057](https://github.com/BerriAI/litellm/pull/49057)
- **Realtime: per-second billing for transcription models** — Deepgram, Groq Whisper and Vertex Chirp now bill per second instead of $0; cached rates change. [PR #35600](https://github.com/BerriAI/litellm/pull/35600)
- **Proxy hot-reload with multiple workers** — `--reload` with `--num_workers` / `NUM_WORKERS` above 1 previously silently fell back to one worker; now the whole pool restarts on save. [PR #45909](https://github.com/BerriAI/litellm/pull/45909)
- **MCP hosted tools on non-translatable routes** — requests now return 400 (or drop under `drop_params`) instead of a misleading 200. [PR #48931](https://github.com/BerriAI/litellm/pull/48931)
- **Anthropic Messages agentic follow-up calls** — now honor client `max_tokens` instead of falling back to 1024. [PR #49413](https://github.com/BerriAI/litellm/pull/49413)

## 3. New Model & Hardware Support

- **EmpirioLabs models** added to `model_prices_and_context_window.json` — chat, embedding and rerank models with per-token prices. [PR #49539](https://github.com/BerriAI/litellm/pull/49539)
- **Turion provider** — decision (`Turion jev 31b` / SystemOne) and extraction (`Turion Extract Alpha`) endpoints. [PR #49535](https://github.com/BerriAI/litellm/pull/49535)
- **Google AI Studio (`gemini/...`) `top_logprobs`** now accepted on chat completions and Responses, closing the parity gap with Vertex AI. [PR #49514](https://github.com/BerriAI/litellm/pull/49514)
- **OpenAI latest audio models** on realtime endpoints (translation + streamed `gpt-transcribe`) via proxy. [PR #35600](https://github.com/BerriAI/litellm/pull/35600)

## 4. Performance & Optimization

- **Rust gateway / Redis migration** is the headline effort, with matching behavior to `redis-py` 5.3.1 so mixed Python/Rust pods share keys, TTLs and circuit-breaker semantics:
  - Router cooldowns and global TPM/RPM counters on a Rust store. [PR #49525](https://github.com/BerriAI/litellm/pull/49525)
  - `litellm/_redis.py`-compatible settings resolution including TLS and Sentinel. [PR #49509](https://github.com/BerriAI/litellm/pull/49509)
  - Command/retry/script semantics aligned with `redis-py`. [PR #49189](https://github.com/BerriAI/litellm/pull/49189)
  - Rotating cloud credentials (ElastiCache IAM, Memorystore GCP IAM, Azure Entra ID). [PR #49510](https://github.com/BerriAI/litellm/pull/49510)
- **Per-request custom pricing** no longer rewrites global `litellm.model_cost`; prices are attached to the call's own logging object, avoiding cross-request contamination. [PR #49532](https://github.com/BerriAI/litellm/pull/49532)
- **Cost compiler for retained usage** unifies immediate and background charge calculation with replayable pricing inputs. [PR #49488](https://github.com/BerriAI/litellm/pull/49488)

## 5. Stability & Regressions

Ranked by severity:

1. **Budget bypass for admin-level keys** — `max_budget`/`tpm_limit` not enforced for keys created or used by admin users; spend continues past limit. [Issue #48364](https://github.com/BerriAI/litellm/issues/48364) (closed, verify fix in your version)
2. **OpenRouter streaming model attribution** — SSE chunks report the router name (`openrouter/auto`) instead of the served model (`deepseek/deepseek-v4.1-flash`), breaking per-model cost/observability. [Issue #46095](https://github.com/BerriAI/litellm/issues/46095)
3. **Silent incomplete streams treated as success** — OpenAI/Azure clean EOF without `finish_reason` yields a successful stop with estimated usage; partial JSON reaches the client. [Issue #40260](https://github.com/BerriAI/litellm/issues/40260)
4. **`amazon_nova` streaming 100% failure** — httpx zstd decoder reused across Nova's multi-frame SSE → `DecodingError`; non-streaming unaffected. [Issue #35589](https://github.com/BerriAI/litellm/issues/35589)
5. **Anthropic streaming guardrails mis-parse transport splits** — warning spam and silently unscanned output text. [Issue #49449](https://github.com/BerriAI/litellm/issues/49449)
6. **MCP tool-failure semantics dropped** — `is_error` flag lost when tools fail (exception or `CallToolResult.isError=True`), so the model never sees the failure. [Issue #49359](https://github.com/BerriAI/litellm/issues/49359) — related follow-up-call failure: [Issue #33520](https://github.com/BerriAI/litellm/issues/33520)
7. **Unbounded upstream error bodies** — a 114 MB HTTP 400 caused event-loop stall and RSS blowup. [Issue #34031](https://github.com/BerriAI/litellm/issues/34031)
8. **`Retry-After` ignored for multi-deployment groups** — instant retries against a shared rate-limited upstream. [Issue #34399](https://github.com/BerriAI/litellm/issues/34399)
9. **Latency-based routing degrades to random** under concurrency due to lost-update race in `async_log_success_event`. [Issue #24720](https://github.com/BerriAI/litellm/issues/24720)
10. **JSON-defined openai-like providers drop tools** when the model isn't in the catalog (regression from 1.81 → 1.106). [Issue #48145](https://github.com/BerriAI/litellm/issues/48145)
11. **Budget-exceeded blocks model discovery** — `GET /models` returns 422 `budget_exceeded`, breaking OpenAI-compatible clients that discover models first. [Issue #48809](https://github.com/BerriAI/litellm/issues/48809)
12. **OCI Gemini ignores all but last system message**, breaking multi-system agent patterns. [Issue #48813](https://github.com/BerriAI/litellm/issues/48813)

Fix PRs exist for: logprobs bridge on `/v1/responses` ([#49536](https://github.com/BerriAI/litellm/pull/49536)), websocket model auth checks ([#48979](https://github.com/BerriAI/litellm/pull/48979)), scalar tag preservation in background settlement ([#47938](https://github.com/BerriAI/litellm/pull/47938)), and Nova Sonic realtime stream-drop error semantics ([#49170](https://github.com/BerriAI/litellm/pull/49170)).

## 6. What This Means for Application Developers

- **If you run admin-tier API keys, audit budget enforcement now.** Issue #48364 indicates admin keys can bypass `max_budget`/`tpm_limit` — critical for cost controls on internal tooling.
- **Streaming correctness is the biggest practical risk today.** OpenRouter model attribution (#46095) and silent incomplete streams (#40260) can corrupt observability and hand you partial JSON without an error signal. Add explicit `finish_reason` checks and consider pinning OpenRouter models rather than `auto`.
- **MCP-based agents: verify failure propagation.** The dropped `is_error` flag (#49359) and the non-streaming follow-up call bug (#33520) mean your agent may silently swallow tool failures — add client-side validation of tool results.
- **Multi-deployment routing under load is unreliable** (Retry-After ignored, latency routing race). If you rely on cost/latency-based routing for SLA, prefer explicit deployment fallbacks and monitor for thundering-herd retries.
- **Plan for the Rust gateway coexistence model.** The Redis-compatibility PRs explicitly target mixed Python/Rust pods sharing state, so incremental rollout — not big-bang — is the intended path.
- **Budget-exceeded clients** should not gate on `GET /models`; treat discovery as best-effort or zero-price the route (#48809).

</details>

<details>
<summary><strong>Unsloth</strong> — <a href="https://github.com/unslothai/unsloth">unslothai/unsloth</a></summary>

# Unsloth Digest — 2026-11-01

## 1. Today's Highlights

No releases landed in the last 24 hours, but issue and PR traffic was heavy: 20 issues updated and 148 PRs touched, with a notable concentration of Studio desktop/web UI bugs and several deep infrastructure PRs from core maintainers (`danielhanchen`, `lonexreb`). Two user-facing CLI gaps — VLM image input and `trust_remote_code` — surfaced today and one already has a fix PR (#16347). A long-standing multi-GPU correctness bug in Studio (`GGML_CUDA_P2P=1` on non-NVLink cards) was closed (#10613), signaling the fix has merged.

## 2. Releases & Breaking Changes

None in the last 24h.

## 3. New Model & Hardware Support

- **[RFC] Ascend NPU backend support** — Proposal to add Huawei Ascend (昇腾) as a first-class accelerator backend, motivated by Chinese data-center demand. Still open, 4 comments. [#10772](https://github.com/unslothai/unsloth/issues/10772)
- **CLI: `trust_remote_code` not passable** — Models with custom modeling code (e.g. `LiquidAI/LFM3-Omni-2B`) cannot be loaded via CLI. No fix PR yet. [#16331](https://github.com/unslothai/unsloth/issues/16331)
- **LFM3-Omni support in progress** — PR adds audio input, export, LoRA defaults, and Stop for custom-code generate. [#16242](https://github.com/unslothai/unsloth/pull/16242)
- **ROCm gfx11 FP8 block dequant** — PR extends the byte decoder to fp16 output on gfx11. [#15224](https://github.com/unslothai/unsloth/pull/15224)
- **Tensor-parallel sharded loading** — PR allows `init_lora_weights="orthogonal"` under `load_tensor_parallel`. [#15218](https://github.com/unslothai/unsloth/pull/15218)

## 4. Performance & Optimization

- **Model-switch latency in Studio** — Two stacked PRs replace fixed sleeps (0.3s + 0.8s) with event-based waits on worker exit and dispatcher wakeups. [#16344](https://github.com/unslothai/unsloth/pull/16344), [#16350](https://github.com/unslothai/unsloth/pull/16350)
- **RAG `.docx` parsing** — Compiles the run XPath once and caches style-list lookups per document. [#16343](https://github.com/unslothai/unsloth/pull/16343)
- **Gemma body-brace scan** — Resumes scan from last end instead of rewalking the open body per token. [#16346](https://github.com/unslothai/unsloth/pull/16346)
- **MiniMax-H3 streamed conditioner** — Keeps only the share of the streamed int8 conditioner that fits host RAM (53 GB host case). [#16325](https://github.com/unslothai/unsloth/pull/16325) (closed/merged)
- **Pipeline-parallel fused optimizers** — Agrees on skip steps for GradScaler across stages. [#16351](https://github.com/unslothai/unsloth/pull/16351)
- **Decode-graph re-arm** — `release()` / `invalidate()` now clear a disabled state after capture failure. [#15217](https://github.com/unslothai/unsloth/pull/15217)

## 5. Stability & Regressions

Ranked by severity:

1. **[CLOSED] Silent output corruption on non-NVLink multi-GPU** — Studio set `GGML_CUDA_P2P=1` on RTX 6000 Ada / RTX PRO 6000 / L40 / L4, producing wrong outputs. Now closed, indicating a fix landed. [#10613](https://github.com/unslothai/unsloth/issues/10613)
2. **[OPEN] MiniMax-H3 video crash on Windows** — "No available kernel" with Auto attention when FlashAttention is unavailable. [#16294](https://github.com/unslothai/unsloth/issues/16294)
3. **[OPEN] ModelScope GGUF 404 on pinned HF revision** — No default-branch fallback in `_native_files`. [#16263](https://github.com/unslothai/unsloth/issues/16263)
4. **[OPEN] Studio model picker stalls ~20 min** — Every cached GGUF is re-probed against HF on open. [#16267](https://github.com/unslothai/unsloth/issues/16267)
5. **[OPEN] Desktop video attachment viewer broken in built app** — Production CSP blocks data-URL fetches; Tauri dev unaffected. [#16248](https://github.com/unslothai/unsloth/issues/16248)
6. **[OPEN] `Stream interrupted` on OpenCode + Bearer token** with Unsloth North Mini Code. [#16317](https://github.com/unslothai/unsloth/issues/16317)
7. **[OPEN] CLI shutdown waits 10–18s** after successful inference. [#16330](https://github.com/unslothai/unsloth/issues/16330)
8. **[OPEN] Linux desktop flicker** (epilepsy warning) on Debian 13 / LXQt / X11. [#16318](https://github.com/unslothai/unsloth/issues/16318)
9. **[OPEN] Settings persisted only in browser `localStorage`** — Reset per origin/browser. [#16309](https://github.com/unslothai/unsloth/issues/16309)
10. **[OPEN] Spell check dead on Linux desktop.** [#16184](https://github.com/unslothai/unsloth/issues/16184)

Fix PRs exist for: CLI VLM images [#16347](https://github.com/unslothai/unsloth/pull/16347), JSONL preview type-mismatch error messages [#16345](https://github.com/unslothai/unsloth/pull/16345).

## 6. What This Means for Application Developers

- **Studio is maturing but UI-state bugs are accumulating.** If you ship a desktop Studio deployment, watch the `localStorage` persistence issue (#16309) and the settings reset behavior — user preferences may silently disappear across origins.
- **Do not rely on CLI for multimodal workflows yet.** Training vision models works, but `inference` and `chat` cannot accept images until #16347 lands; `trust_remote_code` models are also blocked (#16331).
- **Multi-GPU inference on Ada/L40/L4 was unsafe until today.** If you had mysterious output degradation on these cards under Studio, the #10613 fix is the likely cause — verify you are on the version containing it.
- **Model-switch latency is being actively engineered down.** The #16344 / #16350 stack matters for anyone running multi-model or comparison-mode deployments where switch cost was previously fixed-sleep-bound.
- **Custom-code models (LFM3-Omni, MiniMax-H3, etc.) are a recurring source of gaps.** Budget for explicit code paths and test audio/video paths in built (not dev) builds, since CSP and kernel availability differ between the two (#16248, #16294).
- **No new release in the window** — if you are pinning versions, there is nothing to upgrade to today; the actionable items are monitoring the open regressions above.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*