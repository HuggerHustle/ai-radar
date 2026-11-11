# AI Infrastructure Digest 2026-11-11

> Generated: 2026-11-11 01:11 UTC | Projects covered: 6

- [vLLM](https://github.com/vllm-project/vllm)
- [SGLang](https://github.com/sgl-project/sglang)
- [llama.cpp](https://github.com/ggml-org/llama.cpp)
- [Ollama](https://github.com/ollama/ollama)
- [LiteLLM](https://github.com/BerriAI/litellm)
- [Unsloth](https://github.com/unslothai/unsloth)

---

## Cross-Project Comparison

# AI Infrastructure Ecosystem — Cross-Project Comparison Report
**Digest date: 2026-11-11**

---

## 1. Ecosystem Overview

The ecosystem is in a **hardening phase rather than a feature-race phase**: no project shipped a major release in the 24-hour window, yet every project carried substantial correctness and regression load. The dominant themes are *speculative decoding correctness* (vLLM, llama.cpp, SGLang, Unsloth all report acceptance-rate or output-divergence issues), *KV-cache infrastructure* (offload integrity, tiered caching, ring buffers), and *MoE on AMD/Blackwell* (gfx950/MI355X tracking, SM120 troubles). A secondary but significant thread is **supply-chain and access-control security** (LiteLLM's v1.107.0 compromise, Unsloth's sandbox and admin-password bypasses), plus **agent-facing API ergonomics** (streaming tail latency, tool-call correctness, context-window admission). The net picture: throughput work is incremental, while correctness and operational safety are the active battleground.

---

## 2. Activity Comparison

| Project | Layer | Issues active | PRs active | Release status | Breaking-change risk |
|---|---|---|---|---|---|
| **vLLM** | Serving engine | High (~20+ referenced; 4 open perf/correctness regressions) | High (many stacked PRs) | None in 24h; config refactors in flight (MoE enum, Int8) | Medium — internal MoE config API |
| **SGLang** | Serving engine | High (~12+; 1 verified SM90 regression) | High (MoE wheel cleanup stack) | None in 24h; `--max-queued-tokens` flag | Medium — `triton_kernel` backend removal |
| **llama.cpp** | Local runtime | High (~8+; spec-decode correctness #25618 with 40 comments) | Medium-High | **8+ builds in 24h** (b12249–b12262) | Low — but wire-visible tool/JSON fixes |
| **Ollama** | Local runtime | Medium (~7 referenced) | High (dense open PR queue) | **v0.40.17-rc0** | Low — OpenAI-compat behavior tightening |
| **LiteLLM** | Gateway | High (~25+; 5 money/quota issues) | Very high (security + LTS backports) | **v1.110.0-rc.1, v1.109.0, v1.108.5 LTS** | **High** — supply-chain advisory, Cohere/Vertex behavior changes |
| **Unsloth** | Fine-tuning / Studio | Medium-High (~16 referenced) | Medium (fix PRs open) | None | Low — but reverse-proxy/security fixes needed |

**Read-across:** llama.cpp and Ollama are the only projects actively shipping binaries; LiteLLM is the only project with a *live security advisory*. The two serving engines (vLLM, SGLang) are the most regression-heavy, with a combined **four** open correctness/perf issues ranked as top severity.

---

## 3. Model Support Race

| Model / architecture | vLLM | SGLang | llama.cpp | Ollama | Unsloth | LiteLLM |
|---|---|---|---|---|---|---|
| **DeepSeek-V4 / V4.1-Flash** | ✅ (perf + regression work) | ✅ (DSpark, MI355X tracker) | ✅ (R1 671B via RPC) | — | — | — |
| **Qwen3.8-Flash-Next / Qwen3-Next** | ✅ (MI355X tracking, Gluon path) | ✅ (AMD Gluon kernels) | ✅ (delta-net conv shader) | — | ✅ (MTP head issue) | — |
| **Kimi K3 / K3.1** | ✅ (VR200 recipes) | — | ✅ (mtmd vision, b12259) | — | — | — |
| **MiniMax-H3-Image** | ✅ (M3.1-Flash recipes) | — | — | — | ✅ (Studio Images) | — |
| **GLM-5.2 / 5.3** | ✅ (optimization tracker) | ✅ (AITER fused MoE) | 🔶 (flash request) | — | — | — |
| **Nemotron 3.5 Bolt** | — | — | — | ✅ (MLX, 74B-A9B) | — | — |
| **Gemma-4** | — | ✅ (FA4 FP8 KV, SM90) | — | — | — | — |
| **Mistral Large 4** | — | — | — | — | — | ✅ (Azure AI catalog) |
| **Phi-4-multimodal** | — | ✅ (CPU W4A16) | — | — | — | — |
| **Zonos3-Mini TTS** | — | — | 🔶 (under review) | — | — | — |
| **Granite-Switch** | — | — | 🔶 (LoRA-switch PR) | — | — | — |

**Who is ahead:** **vLLM** leads on breadth of *declared* model support (Rubin VR200, Xeon 6, Qwen3-VL, Kimi-K3, MiniMax-M3.1), but several recipes are explicitly `supported`, not `verified`. **SGLang** leads on *verified hardware-specific* enablement (SM90 FA4 FP8 KV, AMD MI355X with AITER, NPU AIV transfers). **llama.cpp** has the most *complete* multimodal/edge coverage (Kimi K3.1 vision, Zonos TTS, OpenCL/Vulkan mobile). **Ollama** is the most aggressive on **MLX/Apple** (Nemotron 3.5 Bolt, video input, concurrent generation). **LiteLLM** is the only gateway keeping *catalog* parity (Mistral Large 4, Gemini batch, Soniox v6) — but note Soniox v6 currently logs at **$0**, so "supported" ≠ "costed".

---

## 4. Performance Frontier

Where the optimization effort actually is today:

| Area | Concentration | Representative work |
|---|---|---|
| **KV cache** | **Highest density** — vLLM (filesystem tier integrity, TP-agnostic offload, Mooncake), SGLang (dflash MLA ring buffer, HiCache), llama.cpp (fused q8_0/q4_0 KV dequant in MMA FA), Ollama (MLX KV leak) | Fused dequant in MMA FA (#31802) is the biggest structural win; KV-offload integrity (#54363) is the biggest risk |
| **Speculative decoding** | **Cross-cutting correctness** — vLLM (DFlash TP>1 collapse #66387), SGLang (DSpark on Hopper regression), llama.cpp (quantized divergence #25618), Unsloth (MTP acceptance drop 74%→56–66%) | This is the *single most repeated* regression class; four projects affected independently |
| **Kernels / MoE** | vLLM (DeepGEMM fp8_einsum JIT avoidance, Engram 128-row tiles), SGLang (AITER fused MoE −3.9%/−2.x%, Gluon dispatch), llama.cpp (coopmat1 FA row-tile folding) | vLLM targets zero JIT during production; SGLang targets gfx950 dispatch reachability |
| **Batching / scheduling** | SGLang (`--max-queued-tokens`), vLLM (batch-invariance withdrawn — cuBLAS not batch-invariant for narrow MoE routers) | vLLM's #65569 withdrawal is a *negative* signal: batch invariance is now a Triton-only property |
| **Distributed serving** | llama.cpp (RPC multi-node, GB10 warmup crash), vLLM (P/D disaggregation on ROCm broken), SGLang (Mooncake L3 prefill OOM) | Multi-node is the weakest link: RPC warmup crash, PD connector broken, and L3 prefill OOM all open |
| **Quantization** | vLLM (online ROCm LUT-B, Int8 config refactor), SGLang (MXFP4 JIT migration), llama.cpp (Prism ternary types), Unsloth (UD 3.1 GGUFs) | Quantization is drifting *upstream* — both engines moving MoE dequant to JIT kernels |
| **GPU coverage** | SM120 (RTX PRO 6000) is the problem child — FA4 crashes at CUDA-graph capture, prefill 2–7K vs 12.5K tok/s under vLLM; SM90 has a verified 33–45% decode regression | gfx950 (MI355X) is the fastest-moving target but tracked as *plans/stacked PRs* |

**Bottom line:** The optimization frontier has split. **Decode-side** work (spec decode, KV dequant, FA kernels) is where the gains are; **batch/invariance** and **distributed** are where the risk is. The single highest-value item for most operators is the **fused q8_0/q4_0 KV dequant in MMA FA** (#31802) — it eliminates a full materialization pass for quantized-KV long-context inference.

---

## 5. Layer Positioning

| Layer | Projects | What they own | Key differentiator today |
|---|---|---|---|
| **Serving engine** | vLLM, SGLang | GPU-native throughput, paged KV, P/D disaggregation, speculative decoding, MoE dispatch | vLLM: breadth + AMD tracking; SGLang: verified hardware-specific enablement + agent-cacheability RFCs |
| **Local runtime** | llama.cpp, Ollama | Edge/desktop/consumer inference, GBNF/JSON-schema grammars, mmap, RPC sharding | llama.cpp: backend breadth (CUDA/SYCL/Vulkan/OpenCL/CANN) + RPC; Ollama: productized UX, MLX, OpenAI-compat |
| **Gateway** | LiteLLM | Routing, auth, spend/rate accounting, provider translation, OpenAI/Anthropic protocol emulation | **Spend tracking accuracy** is its real moat — and its current weak spot (streaming $0, mismatched-provider pricing) |
| **Fine-tuning / Studio** | Unsloth | LoRA/QLoRA training, GGUF quantization, Studio desktop/web UI, MTP draft heads | **MTP head quality** (74%→56–66% acceptance) is its unique lever; Studio sandboxing is its new exposure |

**Key architectural observation:** the boundaries are blurring. llama.cpp and Ollama now serve **OpenAI-compatible endpoints**; Unsloth Studio routes to **vLLM/SGLang**; LiteLLM fronts **Ollama** and **MCP tools**. The "gateway" layer is now less a separate product than a *feature* each engine partially absorbs — and LiteLLM's value is increasingly in *spend/rate accounting*, which the engines do not do.

---

## 6. Trend Signals

**1. Speculative decoding is the #1 correctness risk — and it's cross-cutting.**
vLLM's DFlash collapse at TP>1 (#66387), SGLang's 33–45% Hopper decode regression (#49336), llama.cpp's quantized-target divergence (#25618), and Unsloth's MTP acceptance drop (#17402) are four independent manifestations of the same underlying issue: **speculative decoding output equivalence is not yet guaranteed**. *Application developers: pin engine versions, validate spec output against vanilla runs, and treat acceptance rates as a deployment metric, not a benchmark.*

**2. Quantized KV is going fused — but not safely everywhere.**
llama.cpp's fused q8_0/q4_0 dequant in MMA FA (#31802) and vLLM's `lut_b_moe` online quantization (#66876) are the leading edge. But **KV-offload integrity is still unverified** (#54363: no integrity check, no I/O bound, failed load treated as valid "keep"). *Operators: for production, wrap KV-offload tiers with external validation.*

**3. Multi-node / distributed serving is the weakest link.**
RPC warmup crash on GB10 (#30052), P/D disaggregation broken on ROCm (#59116), Mooncake L3 prefill OOM (#45989), and transient cache hit-rate dips (87.4% →) (#47481) all point to the same conclusion: **single-host tensor-parallel remains the safe production configuration**. *Operators: prefer single-host until multi-node paths are resolved.*

**4. Agent workloads are now shaping the engines' roadmaps.**
SGLang's #47763 (cacheable multi-turn prefixes across Codex/pi/deepseek) and #48519 (UniBoost starvation-bounded scheduling) are explicitly designed for agentic loops. LiteLLM's streaming tail fix (#51033: ~30s spinner tail on Claude Code) and the Responses-streaming work show the same pull. *Application developers: cache hit rate and tail latency are now the metrics that matter for agent UX — instrument them.*

**5. Security moved to the foreground.**
LiteLLM's supply-chain compromise (v1.107.0, `cook.pth`, lookalike repo) is a real-world incident; Unsloth's sandbox escape (#17456) and admin-password leak (#17454) are both open. **The "self-hosted" assumption is no longer sufficient.** *Operators: verify cosign signatures, run container image scanning, and treat reverse-proxy deployments as a security surface.*

**6. Tool-call correctness is quietly being fixed.**
llama.cpp's control-character escaping (#31937) and JSON-schema `allOf` fix (#31834); LiteLLM's MCP `is_error` propagation (#49359, open); SGLang's reasoning-parser splitting on literal `</tool_call>` (#48791); Unsloth's stray `</tool_call>` fix (#17455). *Application developers: these are "silent" bugs — validate tool outputs against your own schema, not just HTTP status.*

**7. AMD/ROCm is the fastest-moving hardware track — but "supported" ≠ "verified".**
vLLM's MI355X plans (#57149, #59575), SGLang's AITER fused MoE (#39529), and the gfx1031 segfault (#17147) show that ROCm enablement is active but *not* production-hardened. *Operators: treat gfx950 recipes as "supported"; validate on your exact SKU before relying on them.*

**8. Observability is a gap in the gateway layer.**
LiteLLM's OTel `gen_ai.response.model` reports the *alias* not the served model (#51029), and `token_counter` rejects `detail: "original"` and silently *skips* the context-window check (#47327). *Operators: correlate on `model_group` + deployment ID; keep a client-side token budget.*

**9. Memory is the recurring edge-device constraint.**
Ollama's MLX KV-cache leak (#17875), Unsloth's Studio memory pressure, llama.cpp's shared compute buffer (#31945), and vLLM's FlashInfer JIT OOM (#66864) all point to the same lever: **shared buffers + mmap for iGPU** is the current answer, and the Vulkan iGPU mmap fix in v0.40.17-rc0 is the most concrete instance.

---

**Report summary for decision-makers:** The 2026-11-11 landscape is a *hardening day*: no new engine capabilities, four cross-project speculative-decoding correctness issues, a live supply-chain advisory in LiteLLM, and multi-node serving still unsafe. The concrete actions are: **pin Hopper/SM90 deployments to v0.5.22**, **verify LiteLLM cosign signatures**, **validate speculative decoding output against vanilla**, **keep single-host tensor-parallel**, and **treat KV-offload tiers as untrusted until #54363 lands**.

---

## Per-Project Reports

<details>
<summary><strong>vLLM</strong> — <a href="https://github.com/vllm-project/vllm">vllm-project/vllm</a></summary>

# vLLM Digest — 2026-11-11

## 1. Today's Highlights

No releases landed in the last 24 hours, but issue and PR activity was heavy across three themes: AMD/ROCm performance tracking for next-gen Qwen and Kimi models on MI355X (gfx950), KV-cache infrastructure hardening (filesystem offload integrity, TP-agnostic offloading, Mooncake connector improvements), and several correctness regressions in speculative decoding and structured outputs. Of note, the batch-invariance cuBLAS routing proposal in #65569 was formally withdrawn after reviewers showed cuBLAS is not batch-invariant for narrow shapes (e.g., MoE routers), closing off a short-lived optimization path.

## 2. Releases & Breaking Changes

No new releases in the last 24h.

Configuration/API changes to watch (in-flight, not yet landed):
- **MoE scale flags → enum**: PR [#66859](https://github.com/vllm-project/vllm/pull/66859) replaces `apply_routed_scale_to_output` and `divide_shared_output_in_fp16` booleans in `FusedMoEFactory`/`MoERunner` with a single `RoutedScaleMode` enum. Internal API change only, but downstream patches touching MoE runner configs will need updating.
- **Int8 config refactor (proposed)**: Issue [#32268](https://github.com/vllm-project/vllm/issues/32268) proposes replacing boolean config fields in `ScaledMMLinearLayerConfig` with `QuantKey`. Marked good-first-issue; still open.
- **Direct weight reload for RL**: RFC [#54477](https://github.com/vllm-project/vllm/issues/54477) is on Revision 2 after Rev 1's "skip post-load processing" approach caused silent errors (stale MLA absorbed weights). If you build on reload APIs, re-read the revised contract.

## 3. New Model & Hardware Support

- **Rubin VR200 recipes**: PR [#65400](https://github.com/vllm-project/vllm/pull/65400) adds VR200 profiles to Kimi-K3 and MiniMax-M3.1-Flash recipes (declared `supported`, not `verified`) across `default`, `nvfp4`, and `fp8` variants.
- **Intel Xeon 6**: PR [#66238](https://github.com/vllm-project/vllm/pull/66238) adds a Qwen3-VL-4B-Instruct recipe for Xeon 6 with BF16, TP=1, text/image/video.
- **ROCm GFX12 (RDNA4)**: PR [#45559](https://github.com/vllm-project/vllm/pull/45559) extends the skinny GEMM SWMMAC path from N=5 to N=8, targeting low-concurrency decode GEMMs.
- **ROCm online quantization**: PR [#66876](https://github.com/vllm-project/vllm/pull/66876) adds `lut_b_moe` to `RocmPlatform.supported_quantization`, unblocking LUT-B emulation experts on non-Rubin GPUs.
- **DomynEdge attention fix**: PR [#66819](https://github.com/vllm-project/vllm/pull/66819) (closed) lets DomynEdge mix sliding and full attention layers after a Hub config update broke `test_can_initialize_large_subset`.

## 4. Performance & Optimization

AMD/ROCm tracking issues (performance plans, stacked PRs on main):
- [#57149](https://github.com/vllm-project/vllm/issues/57149) — Qwen3.8-2.4T-A95B (Quark-MXFP4) on MI355X/gfx950. 31 comments, active.
- [#59575](https://github.com/vllm-project/vllm/issues/59575) — Qwen3.8-Flash-Next on MI355X: GatedDeltaNet in 36 layers, QuerySparse Attention in 12, HyperConnection residual, MXFP4 MoE.

Other notable work:
- **DeepSeek-V4 JIT avoidance**: PR [#64827](https://github.com/vllm-project/vllm/pull/64827) warms up DeepGEMM `fp8_einsum` for `o_proj` — explicit goal is zero JIT compilation during production serving.
- **Engram lookup tiles**: PR [#66552](https://github.com/vllm-project/vllm/pull/66552) moves DSv4.1 Engram lookups from 16-row to 128-row tiles (8 warps), keeping 8× more reads in flight per program.
- **FlashInfer JIT OOM**: PR [#66864](https://github.com/vllm-project/vllm/pull/66864) caps FlashInfer CUTLASS FP4 GEMM JIT parallelism by host RAM (fixes #46268, a many-core/small-RAM OOM at engine init).
- **Weight-loading-bound startup roadmap**: [#48193](https://github.com/vllm-project/vllm/issues/48193) targets near-instant replica activation for pre-warmed configurations.
- **Open perf regressions**: MiniMax-M2.7 TP4+EP throughput regression in 0.29–0.32 ([#63705](https://github.com/vllm-project/vllm/issues/63705)); ~2× decode regression for structured outputs since #45424 ([#62442](https://github.com/vllm-project/vllm/issues/62442)); GLM-5.3 optimization tracker ([#57406](https://github.com/vllm-project/vllm/issues/57406)).

## 5. Stability & Regressions

Ranked by severity:

1. **Speculative decoding + TP>1 correctness**: [#66387](https://github.com/vllm-project/vllm/issues/66387) — DFlash acceptance collapses on MiMo-V2.6-Flash-MOPD at TP>1 (TP1 fine), reported on v0.33.0 and nightly. No fix PR linked yet; avoid DFlash drafters under TP for this model.
2. **Batch-invariance routing withdrawn**: [#65569](https://github.com/vllm-project/vllm/issues/65569) — the cuBLAS routing proposal is withdrawn because cuBLAS is not batch-invariant for narrow shapes (MoE routers), and the property is undocumented/workspace-env-dependent. Anyone relying on batch invariance should keep the Triton path.
3. **DeepSeek-V4-Flash production A/B**: [#49927](https://github.com/vllm-project/vllm/issues/49927) — #48137 costs ~10.6% spec-decode acceptance and #48660 shifts output distributions (2× DGX Spark GB10, TP=2 over RoCEv2). Both effects isolated to specific perf PRs; needs version pinning awareness.
4. **RL port conflict / ZMQ**: [#28498](https://github.com/vllm-project/vllm/issues/28498) — suspicious ZMQ socket bug in 2P4D DeepSeek-V3 configs, reproducible on clean nodes. Open since Nov 2025, still stale.
5. **ROCm long-context decode**: [#48043](https://github.com/vllm-project/vllm/issues/48043) (closed) — `kernel_paged_attention_2d` illegal memory access / `hipErrorLaunchFailure` on gfx950 under long-context decode.
6. **KV offload data integrity**: RFC [#54363](https://github.com/vllm-project/vllm/issues/54363) — the filesystem secondary tier has no integrity verification and no I/O duration bound; treats a failed load as a valid "keep" verdict.
7. **P/D disaggregation on ROCm**: [#59116](https://github.com/vllm-project/vllm/issues/59116) (closed) — MoRI-IO PD disagg connector broken; ROCm router CI parity request [#38693](https://github.com/vllm-project/vllm/issues/38693) also closed.
8. **DiffusionGemma image prefill**: PR [#66279](https://github.com/vllm-project/vllm/pull/66279) fixes image tokens being prefilled causally despite `use_bidirectional_attention="vision"` (issue #62705).
9. **Frontend/API gaps**: `/v1/responses/input_tokens` unsupported ([#49533](https://github.com/vllm-project/vllm/issues/49533)); Hermes tool parser mishandles literal `</tool_call>` inside JSON args (PR [#48353](https://github.com/vllm-project/vllm/pull/48353)).

## 6. What This Means for Application Developers

- **If you serve DeepSeek-V4 or use speculative decoding**: pin your vLLM version explicitly. The DSv4 perf work in 0.26.0 has quantifiable acceptance/output-distribution effects (#49927), and the DFlash TP>1 collapse (#66387) is an active correctness issue. Don't upgrade blindly across 0.29–0.33.
- **If you rely on structured outputs**: expect the ~2× decode regression (#62442) to persist until the grammar bitmask staging path is reworked. Budget accordingly or stay on pre-#45424 behavior.
- **If you're on AMD**: the MI355X work is moving fast but is tracked as plans/stacked PRs — treat recipe support as `supported`, not `verified`. The `lut_b_moe` fix (#66876) matters if you run online quantization on RDNA4/non-Rubin.
- **If you build RL/reload workflows**: re-read RFC #54477 Rev 2 before implementing against direct weight reload — Rev 1's skip-processing approach silently corrupted MLA absorbed weights and loaders.
- **If you run large MoE models with narrow router layers**: batch invariance via cuBLAS is off the table for now (#65569 withdrawn); stay on the Triton path and don't rely on undocumented cuBLAS behavior.
- **If you operate KV offload tiers**: #54363 flags that the filesystem tier has no integrity checks or I/O timeouts — for production, wrap it with your own validation or wait for the RFC outcome.

</details>

<details>
<summary><strong>SGLang</strong> — <a href="https://github.com/sgl-project/sglang">sgl-project/sglang</a></summary>

# SGLang Digest — 2026-11-11

## 1. Today's Highlights

No new releases landed, but the day's activity centers on two threads: a major **MoE backend cleanup** (removing `triton_kernels` from the wheel, with the MXFP4 MoE path migrated to JIT kernels) and a growing pile of **SM120 (Blackwell RTX PRO 6000) attention/MoE trouble reports**, where FA4 crashes and Triton is often the only viable backend. On the stability side, a verified **SM90 decode regression (+33–45% per-step) between v0.5.22 and v0.5.23** is the most actionable issue for anyone on Hopper.

## 2. Releases & Breaking Changes

No new releases in the last 24h. One config-level change to watch:

- **New `--max-queued-tokens` flag** (PR [#47449](https://github.com/sgl-project/sglang/pull/47449)) — bounds *queued input tokens* rather than request count, addressing the case where a few long prompts bypass a request-count queue limit. Additive, but schedulers tuned on request-count limits should re-evaluate.
- **`triton_kernels` wheel removal** (stacked PRs [#49659](https://github.com/sgl-project/sglang/pull/49659)/[#49660](https://github.com/sgl-project/sglang/pull/49660)/[#49661](https://github.com/sgl-project/sglang/pull/49661)/[#49662](https://github.com/sgl-project/sglang/pull/49662)) — the `--moe-runner-backend triton_kernel` option is being removed and MXFP4 MoE dequant moved to a JIT kernel. Config referencing `triton_kernel` will need updating once merged.

## 3. New Model & Hardware Support

- **FA4 FP8 KV cache for Gemma-4 (SM90)** — PR [#46965](https://github.com/sgl-project/sglang/pull/46965) enables `--kv-cache-dtype fp8_e4m3` for head_dim 256/512, previously rejected at init on the FA3/FA4 path.
- **Phi-4-multimodal W4A16 AutoRound on CPU** — PR [#49482](https://github.com/sgl-project/sglang/pull/49482) fixes the missing `audio_compression_rate` in `processor_config.json`.
- **AMD RDNA3/RDNA4 (gfx1100/gfx1201)** — Issue [#46900](https://github.com/sgl-project/sglang/issues/46900) lays out a CI and upstreaming plan for consumer/graphics-class AMD silicon.
- **NPU: AIV transfers for MLA/DeepSeek V4 HiCache** — PR [#48031](https://github.com/sgl-project/sglang/pull/48031).
- **ROCm MI355X (gfx950) DeepSeek-V4.1-Flash tracker** — Issue [#49327](https://github.com/sgl-project/sglang/issues/49327), text+image, TP4, with/without DSpark speculative decoding.

## 4. Performance & Optimization

- **AMD MoE routing via AITER fused entry** — PR [#39529](https://github.com/sgl-project/sglang/pull/39529): **−3.9% / −2.x%** latency on 8×MI355X serving GLM-5.2 MXFP4 with spec decode, gated to token counts where it measurably wins.
- **AMD Qwen3-Next Gluon kernel reachability** — PR [#44565](https://github.com/sgl-project/sglang/pull/44565): the faster Gluon AR+norm+FP8-quant kernel from #39140 was never dispatched on gfx950; this routes the boundary call to it.
- **Diffusion: CFG timestep modulation reuse** — PR [#49504](https://github.com/sgl-project/sglang/pull/49504): removes **21,250 eager CUDA launches per 50-step Anima request** by sharing AdaLN projections across serial CFG branches.
- **dflash sliding-window MLA draft KV ring** — PR [#49664](https://github.com/sgl-project/sglang/pull/49664) ports a per-request ring buffer for draft KV.
- **CI JIT cache cold-start** — Issue [#49340](https://github.com/sgl-project/sglang/issues/49340): B200 cold JIT jobs hit 48–61 min against a 60-min timeout after shared-header changes (now closed).

## 5. Stability & Regressions

Ranked by severity:

1. **SM90 decode regression v0.5.22 → v0.5.23** — Issue [#49336](https://github.com/sgl-project/sglang/issues/49336): **+33–45% per-step decode time at concurrency 12**, every context length 8K–64K, on 8×H20-3e with DeepSeek-V4.1-Flash + DSPARK. `use_deep_select_decode` also costs acceptance on Hopper. *No fix PR referenced — pin v0.5.22 if on Hopper + spec decode.*
2. **GLM-5.3-Flash on SM120: FA4 crashes at CUDA-graph capture** (hybrid extend reshape) — Issue [#42012](https://github.com/sgl-project/sglang/issues/42012). Triton works around it; not yet a fix.
3. **Rust server: BOS token dropped for text prompts** when tokenizer relies on `add_bos_token` — Issue [#49519](https://github.com/sgl-project/sglang/issues/49519), measured on v0.5.22 and present on main.
4. **HiCache `buffer_only` + Mooncake L3 prefill OOM** — Issue [#45989](https://github.com/sgl-project/sglang/issues/45989): scheduler admits an unfinishable chunked prefill, then crashes with "Prefill out of memory" (evictable 0, all radix nodes locked), 8×H200.
5. **HiCache + Mooncake transient cache hit-rate dip** during L2/L3 capacity pressure — Issue [#47481](https://github.com/sgl-project/sglang/issues/47481): drops from **87.4%** sharply in multi-turn bench.
6. **`/v1/responses` returns HTTP 200 + `response.failed`** for context-length-exceeded, while `/v1/chat/completions` returns 400 — Issue [#48557](https://github.com/sgl-project/sglang/issues/48557). API inconsistency; clients keying on status codes will mis-handle it.
7. **Reasoning parser splits on first literal ``** inside quoted CoT — Issue [#48791](https://github.com/sgl-project/sglang/issues/48791): truncates `reasoning_content` and leaks the rest into `content`.
8. **Compressed-tensors W4A16 MLA post-load bug** — Issue [#49369](https://github.com/sgl-project/sglang/issues/49369): reads `kv_b_proj.weight` which packed layers don't have (GLM-4.7-Flash).
9. **`pause_generation(abort)` + `release_memory_occupation` crash** after client disconnect — Issue [#44840](https://github.com/sgl-project/sglang/issues/44840).
10. **transformers 5.12.1 pin incompatible with main** — Issue [#38183](https://github.com/sgl-project/sglang/issues/38183): `import sglang` fails on both sides of the version line.
11. **GLM-5.2 MXFP4 cast to FP8 with unit scale** when `ple_embedding_dtype` is set — Issue [#49493](https://github.com/sgl-project/sglang/issues/49493).
12. **DeepSeek-V4 prefill on SM120 low** — Issue [#33422](https://github.com/sgl-project/sglang/issues/33422): ~2–7K tok/s vs ~12.5K via vLLM/marlin on identical 4×RTX PRO 6000 TP=4 hardware.

Lower-severity/closed: encoder-decoder shared boundary page double-free ([#38840](https://github.com/sgl-project/sglang/issues/38840)), scheduler dead `decoded_text` stop-string path ([#41372](https://github.com/sgl-project/sglang/issues/41372)), tool-call markup leak on `max_tokens` truncation ([#30481](https://github.com/sgl-project/sglang/pull/30481)), fire-and-forget asyncio task GC ([#34480](https://github.com/sgl-project/sglang/pull/34480)).

## 6. What This Means for Application Developers

- **Pin your Hopper deployments.** If you run DeepSeek-V4.1-Flash + DSPARK/DeepSeek speculative decoding on SM90, **v0.5.23 is a 33–45% decode regression**. Stay on v0.5.22 until #49336 is resolved.
- **SM120 users: verify your backend before shipping.** On RTX PRO 6000, FA4 is unreliable (CUDA-graph capture crash on hybrid extend) and prefill throughput is far below what the same hardware delivers under vLLM/marlin. Budget for a Triton or FA3 fallback and benchmark before assuming parity.
- **Agent harness builders should follow two RFCs:** [#47763](https://github.com/sgl-project/sglang/issues/47763) (keeping multi-turn agent prefixes cacheable across Codex/pi/deepseek harnesses) and [#48519](https://github.com/sgl-project/sglang/issues/48519) (UniBoost starvation-bounded scheduling, targeting long-share agentic workloads). Both directly affect cache hit rates and tail latency in agent loops.
- **Rust server is not yet drop-in for tokenizer-sensitive models.** Text prompts missing BOS (#49519) will silently degrade quality for models that rely on `add_bos_token`. Validate outputs, don't just check status codes.
- **Client error handling needs to branch on body, not just HTTP status,** for `/v1/responses` context-length errors (#48557).
- **Reasoning parsers: don't split on naive ``.** If your workload has the model reasoning *about* think tags, content leakage is likely (#48791).
- **New `--max-queued-tokens`** is worth adopting if you serve mixed-length traffic and currently rely only on request-count admission control.
- **Watch the `triton_kernels` removal PR stack** if you deploy via `sglang-kernel` wheels or reference `--moe-runner-backend triton_kernel` in configs — plan a config migration.

</details>

<details>
<summary><strong>llama.cpp</strong> — <a href="https://github.com/ggml-org/llama.cpp">ggml-org/llama.cpp</a></summary>

# llama.cpp Digest — 2026-11-11

## 1. Today's Highlights

A busy release window (>8 builds in 24h) with CUDA graph-reuse and RPC resilience fixes landing on master, plus a steady cadence of mtmd (multimodal) work — Kimi K3.1 vision support and shared compute buffers are now in. On the ecosystem side, discussion is dominated by speculative-decoding correctness regressions on quantized targets (#25618, 40 comments) and continued SYCL/Vulkan/RPC stability reports on multi-GPU MoE setups. Server-side hardening continues with CORS configuration options and Content-Type validation being discussed.

## 2. Releases & Breaking Changes

- **b12262** — CUDA: skip graph compatibility check when a graph is being reused. ([release](https://github.com/ggml-org/llama.cpp/releases))
- **b12261** — mtmd: share compute buffer among subcontexts; new load-time allocation path for audio gen. Reduces memory footprint when multiple modalities share a context. ([#31945](https://github.com/ggml-org/llama.cpp/pull/31945))
- **b12257** — CUDA: moved `ggml_cuda_graph`, concurrent event and stream context state out of `common.cuh` into the CUDA translation unit — reduces rebuild scope for anyone patching CUDA internals. ([#32001](https://github.com/ggml-org/llama.cpp/pull/32001))
- **b12254** — common/json-schema: fix `allOf` with plain types (e.g. `integer`) generating an empty object grammar. This is effectively a correctness fix for tool/structured-output users. ([#31834](https://github.com/ggml-org/llama.cpp/pull/31834))
- **b12253** — common: escape control characters in tool argument strings during pythonic→JSON normalization. Without this, `python(code='a\nb')` produced invalid JSON to clients. ([#31937](https://github.com/ggml-org/llama.cpp/pull/31937))
- **b12252** — CANN: fail early when buffer type is unsupported (previously silent/misleading failures). ([#31270](https://github.com/ggml-org/llama.cpp/pull/31270))
- **b12249** — `ggml-rpc`: fail gracefully on unreachable endpoints and failed handshakes rather than `GGML_ABORT`/SIGABRT. Operators running RPC workers should upgrade. ([#30415](https://github.com/ggml-org/llama.cpp/pull/30415))

No API-removing changes this cycle, but the JSON-schema and tool-argument fixes change wire-visible behavior for tool-call clients — worth re-validating across your tool schemas.

## 3. New Model & Hardware Support

- **Kimi K3.1 vision** added to mtmd (b12259) — includes preprocessor fixes for both K2.5 and K3.1 and projector MLP corrections. ([#31980](https://github.com/ggml-org/llama.cpp/pull/31980))
- **Zonos3-Mini TTS** (Zyphra) under review in mtmd — note the upstream model ships a custom GGML runtime incompatible as-is; work is underway to reconcile. ([#32020](https://github.com/ggml-org/llama.cpp/pull/32020))
- **Granite-Switch** adapter-delta gating PR open — enables LoRA-switch decoding without building 14 `mul_mat_id` chains per layer. ([#32047](https://github.com/ggml-org/llama.cpp/pull/32047))
- **OpenCL: decomposed FA for Adreno** — targeting fused-FA resource limits on Qualcomm mobile GPUs. ([#32046](https://github.com/ggml-org/llama.cpp/pull/32046))
- **Vulkan: tiled-transpose concat shader** landed for Qwen delta-net conv-state path (b12250). ([#30591](https://github.com/ggml-org/llama.cpp/pull/30591))
- **Feature requests open:** XDNA backend (#21725, 39 👍), GLM5.3 flash (#27922, 18 👍), SYCL FP16 Windows build (#31678), Prism PQ2_0/PTQ1_0 ternary types (#29058).

## 4. Performance & Optimization

- **CUDA: fused q8_0/q4_0 KV dequant in MMA flash-attention** (PR #31802, open) — eliminates the separate dequant pass that materializes full K/V as f16 in scratch before MMA kernels read it. Direct win for quantized-KV long-context inference. ([#31802](https://github.com/ggml-org/llama.cpp/pull/31802))
- **granite-switch batch-1 decode: reported 11.1x** by gating adapter deltas on batch token mix — 896 ops/graph eliminated on the 30.6B variant when the adapter token IDs aren't present. ([#32047](https://github.com/ggml-org/llama.cpp/pull/32047))
- **Vulkan: coopmat1 FA row-tile folding** (WIP) — packs multiple query tokens + GQA heads per row tile, sharing K/V reads; supports GQA ratios 2–8. ([#30190](https://github.com/ggml-org/llama.cpp/pull/30190))
- **HIP: ROCm 6.3 minimum** (PR #31617) — uses native sync builtins and correct 64-bit mask width on wave64 targets. ([#31617](https://github.com/ggml-org/llama.cpp/pull/31617))
- **CUDA debug buffer pool** (PR #31919) — opt-in `GGML_CUDA_POOL_DEBUG=1` gives exact-size allocations for isolating pool-related bugs. ([#31919](https://github.com/ggml-org/llama.cpp/pull/31919))

## 5. Stability & Regressions

Ranked by user impact:

1. **Speculative decoding diverges from vanilla on quantized targets** — greedy (temp=0, top_k=1) draft/mtp/dspark speculation produces different text than non-speculative on Q4_K_M targets; matches on bf16. Ngram speculation also affected. 40 comments, still open, no fix PR linked. ([#25618](https://github.com/ggml-org/llama.cpp/issues/25618))
2. **`mul_mat_vec_q4_k_f32_f32` pipeline failure on Adreno 830** — `vkCreateComputePipelines` returns `VK_ERROR_UNKNOWN`; root-caused to shaderc/NDK producing divergent SPIR-V from identical GLSL. Affects Qualcomm proprietary drivers, not Mesa/Turnip. ([#28635](https://github.com/ggml-org/llama.cpp/issues/28635))
3. **RPC warmup decode failure on DGX Spark clusters** — "Remote RPC server crashed or returned malformed response" at first decode with DeepSeek-R1-671B sharded across 3× GB10. 100% reproducible. Note b12249 improved RPC handshake failure handling, but this specific crash path may need more work. ([#30052](https://github.com/ggml-org/llama.cpp/issues/30052))
4. **Vulkan TQ1_0 full offload crashes Adreno 840 driver** inside `vkGetDeviceFaultInfoEXT` on Redmi K100 Pro Max. ([#30649](https://github.com/ggml-org/llama.cpp/issues/30649))
5. **CUDA FA crashes on SM70 V100** with non-standard head dims — `invalid argument` in `ggml_cuda_flash_attn_ext_mma_f16_case`. ([#28661](https://github.com/ggml-org/llama.cpp/issues/28661))
6. **SYCL dual-GPU MoE `--cpu-moe -sm layer`** ~100–1000× slowdown vs single-GPU with 40GB MoE cache; 15GB completes fine. ([#31510](https://github.com/ggml-org/llama.cpp/issues/31510))
7. **SYCL AOT build for Meteor Lake** fails on `dpas.nosrc0` intrinsic since d81d0d8fb. ([#31033](https://github.com/ggml-org/llama.cpp/issues/31033))
8. **`llama-server` `/v1/completions` logprobs nondeterministic** on SYCL+MoE; request `seed` does not pin the reported distribution. ([#31206](https://github.com/ggml-org/llama.cpp/issues/31206))

## 6. What This Means for Application Developers

- **Tool-calling correctness is now safer.** The b12253 control-character escaping fix and b12254 JSON-schema `allOf` fix close two classes of silently-broken tool outputs. If you log tool args or validate them client-side, this run is worth pulling to test.
- **Multimodal memory pressure drops** with b12261's shared compute buffer — meaningful if you run vision + audio + text in the same server process or on memory-constrained edge devices.
- **Speculative decoding is not yet safe to trust on quantized targets** (#25618). If you serve Q4_K_M/Q5_K_M with draft models, either pin to a known-good build, disable speculation, or validate output equivalence against a vanilla run before deploying. This is the highest-priority item to track.
- **RPC multi-node deployments are more robust but not fully fixed.** b12249 eliminates the SIGABRT on handshake failure, which improves supervision behavior, but the GB10/DeepSeek warmup crash (#30052) suggests decode-path robustness still needs work. For production MoE clusters, prefer tensor-parallel single-host until #30052 is resolved.
- **Server hardening is in flight** — CORS configurable options (PR #25655) and Content-Type validation (#31979) reflect llama-server being used as a public-facing endpoint, not just a local dev tool. If you expose llama-server, watch these PRs.
- **Web UI is being productized:** `search_chats` tool (PR #32051), brand asset extraction, and Discover improvements signal llama-server is becoming a first-class chat harness, not just a raw inference endpoint. If you embed the UI, expect meaningful churn over the next few weeks.

</details>

<details>
<summary><strong>Ollama</strong> — <a href="https://github.com/ollama/ollama">ollama/ollama</a></summary>

# Ollama Digest — 2026-11-11

## 1. Today's Highlights

A quiet release day (v0.40.17-rc0 only) is offset by a dense PR queue: speculative-decoding telemetry, MLX video input, and OpenAI `max_completion_tokens` support are all in flight. Meanwhile a string of Vulkan regressions on integrated GPUs (AMD 780M, Intel Iris Xe) and an MLX KV-cache leak remain the top stability concerns, with the Vulkan fixes now landing in the form of an mmap change for iGPUs. The `qwen3next` layer-2 projection bug from April finally closed, and MLX gained concurrent generation.

## 2. Releases & Breaking Changes

- **v0.40.17-rc0** — [release](https://github.com/ollama/ollama/releases). Three PRs: ChatGPT CLI restore/graceful-restart fix ([#19583](https://github.com/ollama/ollama/pull/19583)), OpenCode thinking metadata in `cmd/launch` ([#19409](https://github.com/ollama/ollama/pull/19409)), and mmap for Vulkan integrated GPUs. No API or config breaking changes.
- No documented migration notes in this window.

## 3. New Model & Hardware Support

- **Nemotron 3.5 Bolt 74B-A9B (MLX)** — per-layer expert configs, LiLiCorr speculative decoding, prequantized affine 3-bit import with mixed-precision expert stacking. [PR #19229](https://github.com/ollama/ollama/pull/19229) (OPEN).
- **Video input for MLX models** — LFM3-VL, LFM3-Omni, Qwen3.5/3.6 accept MP4/MOV via the existing `images` field; new `"video"` capability surfaced by `/api/show`. [PR #19348](https://github.com/ollama/ollama/pull/19348) (OPEN).
- **Decision models ("System One" wire format)** — a community request to support no-generation, single-forward-pass classifiers (Liquid d1, Laya, Kev, vllm-d3, H2O Lightning) via `/v1/systemone`; PR #19408 already patches long-request limits for MLX decision models. [Issue #19639](https://github.com/ollama/ollama/issues/19639) (CLOSED), [PR #19408](https://github.com/ollama/ollama/pull/19408) (OPEN).
- **MLX-C / llama.cpp version bumps** — [PR #19647](https://github.com/ollama/ollama/pull/19647), [PR #19646](https://github.com/ollama/ollama/pull/19646) (llama.cpp b12257). Routine backend refresh.

## 4. Performance & Optimization

- **Per-request speculative decoding metrics** — drafted/accepted token counts now reported in API responses and `ollama run --verbose`, addressing the misleading single "acceptance rate" number. [PR #19368](https://github.com/ollama/ollama/pull/19368) (OPEN).
- **Drafting toggle for benchmarking** — `draft_num_predict=0` disables drafting per request so MLX speedup can be measured cleanly; system default stays 4. [PR #19391](https://github.com/ollama/ollama/pull/19391) (OPEN).
- **MLX concurrent generation** — MLX models can now serve multiple requests via `OLLAMA_NUM_PARALLEL`, sharing projection/feed-forward work to cut time-to-first-token; default remains 1. [PR #19197](https://github.com/ollama/ollama/pull/19197) (CLOSED/merged).
- **Vulkan integrated GPU mmap** — reduces memory pressure for Vulkan iGPUs (shipped in v0.40.17-rc0).
- **`ollama load`** — proposed CLI command to preload a model into memory, useful for warming caches ahead of traffic. [PR #16207](https://github.com/ollama/ollama/pull/16207) (OPEN).

## 5. Stability & Regressions

Ranked by severity:

1. **MLX KV-cache leak (high)** — resident memory grows monotonically with *request count* on dense models and is not released without a restart; same class as #16698. [Issue #17875](https://github.com/ollama/ollama/issues/17875) (CLOSED today; no linked fix PR visible).
2. **Windows RTX 5090 runner disconnect during tool calling (high)** — HTTP 500 on `/tokenize`, runner communication lost mid tool-call with Open WebUI; affects Muse Glimmer 30B and others. [Issue #19439](https://github.com/ollama/ollama/issues/19439) (OPEN).
3. **Vulkan iGPU regressions (medium)** — AMD Radeon 780M fails with `ErrorDeviceLost` on ≥0.32.10 ([Issue #17748](https://github.com/ollama/ollama/issues/17748), CLOSED); Intel Iris Xe KV-cache alloc fails on 0.33.3/0.34.2 with `ErrorOutOfDeviceMemory` ([Issue #18531](https://github.com/ollama/ollama/issues/18531), CLOSED). The mmap change in v0.40.17-rc0 appears aimed at this class.
4. **Cloud `/api/chat` 400 on ~32 MiB payloads (medium)** — undocumented size limit, no hint in the error. [Issue #19597](https://github.com/ollama/ollama/issues/19597) (OPEN).
5. **`qwen3next` layer-2 missing attn projections (medium, fixed)** — 500 on model init; closed today. [Issue #15372](https://github.com/ollama/ollama/issues/15372).
6. **`hf.co` pulls behind DNS64 (low)** — NAT64 CDN addresses rejected as non-public; blocks pulls on IPv6-transition networks. [Issue #19345](https://github.com/ollama/ollama/issues/19345) (OPEN).
7. **`-v` prints spurious warnings (low)** — output pollution on `ollama --version`. [Issue #19613](https://github.com/ollama/ollama/issues/19613) (CLOSED).

## 6. What This Means for Application Developers

- **Stop guessing at speculative decoding efficacy** — once #19368 lands you get drafted/accepted counts per request; log these alongside latency rather than trusting a single acceptance-rate figure.
- **OpenAI-compat surface is tightening**: `max_completion_tokens` will be honored ([PR #19168](https://github.com/ollama/ollama/pull/19168)), and raw `/v1/completions` prompts will bypass chat templating ([PR #19170](https://github.com/ollama/ollama/pull/19170)). If you rely on either behavior today, re-test after upgrade.
- **MLX is becoming a first-class serving target** — concurrent generation plus video input means Mac-hosted multimodal agents are now viable, but budget memory per parallel request and watch the KV-cache leak on long-lived processes.
- **The app is moving off hardcoded model names** — thinking controls will be driven by `/api/show` capabilities instead of `gpt-oss*`/`deepseek-v3.1*` string matching ([PR #19648](https://github.com/ollama/ollama/pull/19648)). If you mirror Ollama's UI logic, switch to capability introspection.
- **Vulkan iGPU users should pin and test** — if you're on 0.33.x–0.34.x with an integrated GPU and large KV caches, upgrade to the 0.40.x line where the mmap fix is present, or stay on 0.32.6 as a known-good fallback.
- **Cloud payloads cap around 32 MiB** — chunk or downscale base64 images client-side; the error gives no clue.

</details>

<details>
<summary><strong>LiteLLM</strong> — <a href="https://github.com/BerriAI/litellm">BerriAI/litellm</a></summary>

# LiteLLM Digest — 2026-11-11

## 1. Today's Highlights

The dominant story remains the aftermath of the **v1.107.0 supply-chain compromise**, now marked closed after PyPI and Docker image removal, with cosign verification documentation appearing across all new releases. The LTS line is actively receiving backports (v1.108.5, plus tool_choice, custom-provider, and Responses-streaming fixes), while a steady stream of correctness work lands around **spend tracking accuracy** and **rate-limit accounting** — two areas where silent failures have been costing operators real money and quota.

## 2. Releases & Breaking Changes

- **v1.110.0-rc.1** — Release candidate; all Docker images now cosign-signed with key introduced in commit `e82a3c6`. [Release](https://github.com/BerriAI/litellm/releases)
- **v1.109.0** — Stable release, same signature verification requirement.
- **v1.108.5 (LTS)** — The `lts` image tag now points here; recommended channel for production. [Release](https://github.com/BerriAI/litellm/releases)
- **v1.104.9 / v1.103.11** — Maintenance patches on older lines.
- ⚠️ **Security advisory remains relevant**: [#47826](https://github.com/BerriAI/litellm/issues/47826) documents the v1.107.0 `cook.pth` credential stealer built from a lookalike repo (`Berri-AI/litellm`). If you pulled `latest`, `main-latest`, or `main-stable` Docker tags between 2026-10-19 and 2026-10-21, **rotate all provider credentials**. Verification now requires cosign against the pinned public key.
- **Breaking (in PR)**: [#50834](https://github.com/BerriAI/litellm/pull/50834) fixes `cohere_chat` silently dropping `tool_choice`, `thinking`/`reasoning_effort`, and `json_schema` response_format on the v2 route. Behavior change: `tool_choice: "none"` will now actually prevent tool calls — audit any Cohere deployments relying on the old (broken) pass-through.
- **Breaking (in PR)**: [#47716](https://github.com/BerriAI/litellm/pull/47716) enforces model-level access control on the Vertex AI Live websocket passthrough (`/vertex_ai/live`). Restricted keys that previously reached any model will now be closed with code 1008. Security fix.

## 3. New Model & Hardware Support

- **Azure AI — Mistral Large 4**: [#51047](https://github.com/BerriAI/litellm/pull/51047) adds `azure_ai/mistral-large-4-latest` to the catalog with pricing from Mistral's model page.
- **Mistral native token counting**: [#50653](https://github.com/BerriAI/litellm/pull/50653) wires up `POST /v1/responses/input_tokens` for upstream-accurate token counts (fixes #50652).
- **Gemini batch API**: [#51032](https://github.com/BerriAI/litellm/pull/51032) adds file-backed batch jobs on `/v1/batches` with output download and spend tracking — previously `custom_llm_provider: gemini` returned 400.
- **Soniox STT v6**: [#51085](https://github.com/BerriAI/litellm/pull/51085) adds `stt-async-v6`/`stt-rt-v6` to the cost map (v5 deprecated 2026-12-15). Calls currently succeed but log at **$0**.
- **Databricks catalog refresh**: [#51076](https://github.com/BerriAI/litellm/pull/51076) adds `databricks-claude-fable-5-2`, dates `glm-5-2` retirement, fixes `llama-3-1-8b` context length.
- **Custom providers — Gemini generateContent & image params**: [#51084](https://github.com/BerriAI/litellm/pull/51084) (LTS backport) and [#51081](https://github.com/BerriAI/litellm/pull/51081) let `custom_provider_map` handlers answer native `generateContent` and receive standard image params (`n`, `size`, `quality`, `response_format`, `user`, `style`) — previously silently dropped.

## 4. Performance & Optimization

- **Responses API streaming latency**: [#51033](https://github.com/BerriAI/litellm/pull/51033) ends streams at the terminal event instead of waiting for upstream socket close. Concrete impact noted: **Claude Code's spinner ran ~30s past the answer** against upstreams that hold connections open. This is a meaningful UX and idle-connection win for agent clients.
- **Upgrade-notice overhead**: [#51027](https://github.com/BerriAI/litellm/pull/51027) moves the version-check banner off the request path — removes a synchronous dependency from the hot path.
- **Spend log retention**: [#50131](https://github.com/BerriAI/litellm/pull/50131) moves cleanup to a DB-backed scheduled job table, eliminating per-process timers and the Redis dependency for single-replica execution.
- **Token reservation refunds**: [#51086](https://github.com/BerriAI/litellm/pull/51086) refunds a Responses WebSocket's key TPM reservation on socket close — previously long-lived Codex sessions tripped 429s well below their limits.

## 5. Stability & Regressions

Ranked by severity:

**High — money/quota correctness**
- **Streamed completions logged at $0** ([#48937](https://github.com/BerriAI/litellm/issues/48937), closed): when upstream reports `usage.cost: 0` alongside real cost, all streaming traffic records `spend = 0`. Spend and budgets were effectively blind for streaming workloads.
- **`response_cost` null with mismatched provider** ([#47675](https://github.com/BerriAI/litellm/issues/47675), closed) and **`base_model` + differing `custom_llm_provider` → spend 0** ([#47908](https://github.com/BerriAI/litellm/issues/47908), closed): priced rows under a different provider than the deployment config were not matched.
- **Background response spend not written** ([#50957](https://github.com/BerriAI/litellm/pull/50957)): pass-through charging succeeded but cost never reached spend logs. Fix PR open.
- **TPM counter outlives its window** ([#49675](https://github.com/BerriAI/litellm/issues/49675), open): v3 limiter with Redis + token reservation rejects keys below `tpm_limit` under upstream 429s. No fix PR yet.
- **TPM never refills in-memory** ([#47340](https://github.com/BerriAI/litellm/issues/47340), open): without Redis, `tpm_limit` behaves as a fixed budget until `/key/update`. No fix PR.

**High — correctness / protocol translation**
- **Anthropic `/v1/messages` reasoning corruption** ([#32357](https://github.com/BerriAI/litellm/issues/32357), closed): `thinking_delta` streamed inside a text block plus duplicate `message_start` → empty content in Anthropic SDK / Claude Code with GLM/DeepSeek-R1-style backends.
- **Encrypted reasoning dropped for `chatgpt/` provider** ([#49046](https://github.com/BerriAI/litellm/issues/49046), closed): reasoning never replayed between tool calls on `/v1/messages`.
- **Gemini/Vertex cache_control reorders conversation** ([#47046](https://github.com/BerriAI/litellm/issues/47046), open): non-prefix cache block moves the message ahead of history and drops `system_instruction`. Model answers the wrong turn. No fix PR.
- **MCP tool failures lose `is_error`** ([#49359](https://github.com/BerriAI/litellm/issues/49359), open): `tool_result.is_error` not propagated to Anthropic clients — agents cannot distinguish failure from success.
- **SSE keepalive masks upstream failure** ([#49711](https://github.com/BerriAI/litellm/issues/49711), open): first `: ping` commits a 200 stream; later failure can only be written as an in-body error, which some Anthropic clients ignore.
- **JSON-defined OpenAI-like providers lose tools when model not in catalog** ([#48145](https://github.com/BerriAI/litellm/issues/48145), open): regression in 1.106 for `custom_llm_provider` + unlisted model IDs.
- **Mistral named `tool_choice` dropped** ([#39736](https://github.com/BerriAI/litellm/issues/39736), closed).
- **Ollama `tool_calls` parse failure** ([#24091](https://github.com/BerriAI/litellm/issues/24091), closed).
- **`reasoning_effort: "none"` omits thinking instead of disabling it** ([#47924](https://github.com/BerriAI/litellm/issues/47924), closed): default-on Claude models keep thinking enabled.

**Medium — observability**
- **OTel `gen_ai.response.model` reports the alias, not the served model** ([#51029](https://github.com/BerriAI/litellm/issues/51029), open, filed today): breaks per-model dashboards and cost attribution in tracing. No fix PR.
- **`token_counter` rejects `detail: "original"`** ([#47327](https://github.com/BerriAI/litellm/issues/47327), open): pre-call context-window checks log ERROR and **skip** the check — a silent safety regression for long-context apps.

**Medium — access control / rate limiting**
- **Per-customer RPM limits stop applying once vkey is cached** ([#39713](https://github.com/BerriAI/litellm/issues/39713), closed).
- **Fallback tokens settle on requested, not served, model group** ([#51082](https://github.com/BerriAI/litellm/pull/51082), fix PR open): serving model's TPM limit leaks.
- **Zero-cost budget waiver misapplied to aliases** ([#51058](https://github.com/BerriAI/litellm/pull/51058), fix PR open): over-budget keys get 422 on aliases of $0 models; aliases pointing $0 names at paid models skip budgets entirely.
- **Duplicate secret key creation silently succeeds** ([#20494](https://github.com/BerriAI/litellm/issues/20494), open).
- **Fallback config not reloaded on redeploy** ([#15647](https://github.com/BerriAI/litellm/issues/15647), closed).
- **FastAPI `get_flat_dependant` startup incompatibility after `uv tool update`** ([#36922](https://github.com/BerriAI/litellm/issues/36922), closed).

**Lower**
- Infinite request retry loops on certain unauthorized requests ([#18060](https://github.com/BerriAI/litellm/issues/18060), closed, stale).
- Internal users cannot view request/response logs despite `store_prompts_in_spend_logs: true` ([#28859](https://github.com/BerriAI/litellm/issues/28859), closed).
- `/v1/audio/speech` strips custom params and mandates `voice` for Qwen3-TTS/vLLM ([#20078](https://github.com/BerriAI/litellm/issues/20078), open).
- Currency hardcoded to `$` in UI ([#8513](https://github.com/BerriAI/litellm/issues/8513), open — long-standing feature request).

**Feature work in flight**
- Spend-spike / traffic / latency / error-rate alerting with 7-day rolling baselines ([#50666](https://github.com/BerriAI/litellm/pull/50666)).
- LTS backport of `allowed_tools` tool_choice ([#50726](https://github.com/BerriAI/litellm/pull/50726)).
- LTS backport of client-subscription forwarding for Codex ([#49888](https://github.com/BerriAI/litellm/pull/49888)).
- Health-check spend logging with mode call type ([#50987](https://github.com/BerriAI/litellm/pull/50987)).

## 6. What This Means for Application Developers

- **Pin and verify.** Do not use floating `latest`/`main-*` Docker tags. Run `cosign verify` with the pinned key from `e82a3c6` in CI, and deploy the LTS tag (`ghcr.io/berriai/litellm:lts`) for production. If you touched v1.107.0 in October, rotate API keys and audit outbound network logs.
- **Do not trust spend numbers on streaming or custom-provider deployments without checking a known-billed request.** Multiple fixes landed today, but several spend paths (background responses, `custom_llm_provider` mismatches, Soniox v6) are still open or only fixed in main/PR. If budgets are a control surface in your app, validate against provider-side billing.
- **Anthropic-format clients (`/v1/messages`) have had a cluster of translation bugs** — reasoning blocks, MCP tool error propagation, SSE keepalives, and Cohere `tool_choice`. If you front agent frameworks (Claude Code, custom MCP clients) with LiteLLM, upgrade to pick up the closed fixes and track #49359 and #49711 which remain open.
- **Rate limiting semantics are subtle.** Under Redis, token reservation can cause 429s below your configured TPM (#49675); under in-memory cache, TPM never rolls (#47340). Size limits conservatively, or use `/key/update` to reset for in-memory deployments — and expect the WebSocket reservation fix (#51086) once it merges.
- **Observability gaps:** OTel `gen_ai.response.model` reporting the alias (#51029) breaks per-model cost/trace attribution today — as a stopgap, correlate on `model_group` + deployment ID at the application layer. The image `detail: "original"` rejection (#47327) silently disables context-window pre-checks for vision apps; keep a client-side token budget.
- **Positive latency delta for streaming agents:** PR #51033 eliminates a ~30s tail on `/responses` streams against upstreams that don't close the socket — worth tracking for Codex/Claude Code-style workloads.

</details>

<details>
<summary><strong>Unsloth</strong> — <a href="https://github.com/unslothai/unsloth">unslothai/unsloth</a></summary>

# Unsloth Digest — 2026-11-11

## Today's Highlights
No new releases landed in the last 24h, but PR activity is heavy on the Studio (desktop/web UI) surface: a new image model integration (MiniMax-H3-Image), security hardening around the seeded admin password and reverse-proxy deployments, and several correctness fixes for agentic tool-calling loops. On the training/inference core side, a long-standing MTP draft-head mismatch for Qwen3.8-Flash-Next UD 3.1 GGUFs has been reported with concrete acceptance-rate numbers, and a CPU pipeline-parallel MoE parity bug remains open.

## Releases & Breaking Changes
None.

## New Model & Hardware Support
- **MiniMax-H3-Image in Studio Images page** — text-to-image plus reference-image editing with 1–16 `<Picture N>` references; transformer/VAE sourced from diffusers when available. PR [#17453](https://github.com/unslothai/unsloth/pull/17453)
- **Studio sd.cpp pinned to upstream master-1056** — stable-diffusion.cpp prebuilt moves from `master-982-0518b34-uba6ac30` to `master-982-0518b34-ueb0e729` (36 fork commits). PR [#17459](https://github.com/unslothai/unsloth/pull/17459)
- **External image models gain `/images/edits` support** — connected OpenAI-compatible image models can now edit, not just generate. PRs [#17450](https://github.com/unslothai/unsloth/pull/17450), [#17448](https://github.com/unslothai/unsloth/pull/17448)
- **Yandex added to Studio web-search fallback tier** — mitigates current ddgs DuckDuckGo anti-bot responses. PR [#17447](https://github.com/unslothai/unsloth/pull/17447)

## Performance & Optimization
- **MTP draft-head acceptance drop on Qwen3.8-Flash-Next** — production (non-greedy, Ryzen AI Max+ 395) acceptance falls ~74% → 56–66% with UD 3.1 GGUFs against existing MTP heads; user asks whether 3.1-matched heads are planned. Issue [#17402](https://github.com/unslothai/unsloth/issues/17402)
- **Studio vLLM/SGLang tool requests now fit `max_tokens` to the window** — previously 400 `context_length_exceeded` when prompt fit but prompt+max_tokens did not; `/v1/completions` also covered. PR [#17426](https://github.com/unslothai/unsloth/pull/17426)
- **Ollama long-chat compaction** — Studio now reads the model's actual loaded window (e.g. 4096 for `qwen3:1.7b`) instead of the catalogue window (40960), preventing silent truncation of the earliest turns. PR [#17457](https://github.com/unslothai/unsloth/pull/17457)

## Stability & Regressions
Ranked by severity:

1. **CPU pipeline-parallel MoE router aux loss diverges** — with `UNSLOTH_FORCE_CPU=1`, gradient accumulation > 1, PP + MoE aux loss trains a different loss than single-process; repo's own parity test reproduces it. OPEN, no fix PR referenced. [#17054](https://github.com/unslothai/unsloth/issues/17054)
2. **Repeated full prompt processing across turns** — Qwen hybrid model after tool use with large MCP tool catalogue on Desktop 0.1.916-beta; 65k ctx, llama-server. OPEN. [#17015](https://github.com/unslothai/unsloth/issues/17015)
3. **Sandbox escape in "Approve for me"** — `os.system` via `map`, `executor.submit`, `functools.partial`, or `Thread` target bypassed the Allow/Deny card. Fix PR open. [#17456](https://github.com/unslothai/unsloth/pull/17456)
4. **Seeded admin password leak via same-host reverse proxy** — proxies rewriting Host to loopback with only `X-Forwarded-Proto/Via/Port/Server` were treated as local browsers; remote device could retrieve and reset the password. Fix PR open. [#17454](https://github.com/unslothai/unsloth/pull/17454)
5. **`push_to_hub_gguf(tags=...)` silently no-op** — tags never landed on Hub (via `api.add_tags`, which doesn't exist on HfApi); bare `except: pass` hid the AttributeError, and the caller's list was mutated in place. Fix PR open. [#17438](https://github.com/unslothai/unsloth/pull/17438)
6. **Custom-domain / reverse-proxy 404 in Desktop** — `X-Forwarded-Host` with external hostname rejected even with loopback `Host`; blocks Cloudflare Named Tunnels. Fix PR open. Issues [#17420](https://github.com/unslothai/unsloth/issues/17420), PR [#17435](https://github.com/unslothai/unsloth/pull/17435)
7. **ROCM Docker gfx1031 (RX 6700 XT) segfault** — passes startup check as RDNA 2, then PyTorch segfaults on first GPU op. CLOSED. [#17147](https://github.com/unslothai/unsloth/issues/17147)
8. **Intel Arc 140V: image generation models fail to load.** CLOSED. [#17137](https://github.com/unslothai/unsloth/issues/17137)
9. **Studio web fetch HTML→Markdown corruption** — bare `&` gains stray `;`, escaped code escapes code blocks, malformed `&#` leaks raw HTML. CLOSED. [#17199](https://github.com/unslothai/unsloth/issues/17199)
10. **Diffusion caption loss on U+2028/U+2029/U+0085** — `splitlines()` cut JSON string contents, silently dropping images from datasets. Fix PR open. [#17436](https://github.com/unslothai/unsloth/pull/17436)
11. **Hermes launcher credential provisioning with api key in YAML.** CLOSED. [#17315](https://github.com/unslothai/unsloth/issues/17315)
12. **PDF chat export truncates unbroken text** (Thai, long tokens, long code lines). Fix PR open. [#17425](https://github.com/unslothai/unsloth/pull/17425)
13. **Stray `` after OpenAI tool calls** — persisted into reply and re-sent on next turn. Fix PR open. [#17455](https://github.com/unslothai/unsloth/pull/17455)
14. **Managed account `browse-folders` returns 403** without `path`. CLOSED. [#17292](https://github.com/unslothai/unsloth/issues/17292)
15. **Video upload blocked for custom OpenAI-compatible connections.** CLOSED. [#17295](https://github.com/unslothai/unsloth/issues/17295)
16. **Model size mismatch between Model Hub and Model Picker**; **mangled Glass-theme Model Hub UI**; **2 GiB VRAM CUDA noted in reports** — all CLOSED. [#17074](https://github.com/unslothai/unsloth/issues/17074), [#17417](https://github.com/unslothai/unsloth/issues/17417)

## What This Means for Application Developers
- **Agentic tool loops still need attention**: the deferred-schema prefix-preservation work referenced in #17015 isn't sufficient for Qwen hybrid models under reasoning + large MCP catalogues. If you run tool-heavy agents on Studio with llama-server, expect redundant prompt prefill across turns and budget KV/context accordingly.
- **Sandboxing for Python code execution is tightening**: if your agent relies on "Approve for me" mode, note that indirect execution paths (map, executor, partial, Thread) now correctly trigger approval cards — test your flows against PR #17456 before upgrading.
- **Reverse-proxy deployments**: two separate issues (#17420, #17454) show the Studio backend's localhost heuristic is aggressive. If you front Studio with Cloudflare Named Tunnels, nginx, or any host-rewriting proxy, pin to a version including both fix PRs before exposing beyond loopback.
- **GGUF publishing**: `push_to_hub_gguf(tags=...)` silently dropping tags means any release automation built on it has been producing untagged Hub repos. Verify your published cards and consider re-pushing with PR #17438 once merged.
- **Quantization pipelines**: the Qwen3.8-Flash-Next MTP acceptance-rate regression (#17402) matters if you ship speculative decoding in production — expected tokens/step drops materially at non-greedy temperatures, so re-tune `draft` acceptance thresholds or hold off on UD 3.1 until matched heads land.
- **vLLM/SGLang gateway users**: PR #17426 fixes a real 400-error class when tool schemas are attached near the context limit — worth cherry-picking if you expose tool-calling endpoints behind those backends.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*