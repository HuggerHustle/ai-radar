# AI Infrastructure Digest 2026-11-19

> Generated: 2026-11-19 02:29 UTC | Projects covered: 6

- [vLLM](https://github.com/vllm-project/vllm)
- [SGLang](https://github.com/sgl-project/sglang)
- [llama.cpp](https://github.com/ggml-org/llama.cpp)
- [Ollama](https://github.com/ollama/ollama)
- [LiteLLM](https://github.com/BerriAI/litellm)
- [Unsloth](https://github.com/unslothai/unsloth)

---

## Cross-Project Comparison

# Cross-Project Comparison Report — AI Infrastructure Ecosystem
**Date: 2026-11-19 | Sources: vLLM, SGLang, llama.cpp, Ollama, LiteLLM, Unsloth digests**

---

## 1. Ecosystem Overview

The AI infrastructure stack is in a **consolidation-and-hardening phase**, not a feature-expansion one. Across all six projects, the dominant signal today is *stability engineering*: vLLM and SGLang are both locking down correctness in KV-cache/prefix-caching paths and formalizing breaking-change policies (SGLang's 1.0 tracker, vLLM's direct weight-reload default), while llama.cpp and Ollama are shipping targeted correctness fixes for hybrid/recurrent state and memory accounting. Simultaneously, **AMD (gfx950/MI355X, gfx942, RDNA4) is now a first-class optimization target** rather than an afterthought — vLLM, SGLang, llama.cpp, and Unsloth all have active AMD-specific work streams. The upper layers (LiteLLM gateway, Unsloth fine-tuning) are converging on **agentic workload correctness**: prompt-cache stability, tool-call fidelity, and streaming semantics are the failure modes consuming engineering attention. Net read: the ecosystem is shifting from "can we serve this model" to "can we serve it correctly, cheaply, and predictably under agentic multi-turn load."

---

## 2. Activity Comparison

| Project | Layer | Issues (active today) | PRs (active today) | Release Status (24h) | Dominant Activity Theme |
|---|---|---|---|---|---|
| **vLLM** | Serving engine | ~10 ranked regressions + trackers (#44280, #59575, #57149, #57406) | ~15+ (incl. #68041, #68552, #66792, #66944) | None; 2 behavioral changes pending | ROCm kernels, KV offload, RL weight transfer |
| **SGLang** | Serving engine | ~10 ranked regressions + CI trackers (#26340 381c, #42752 215c) | ~12+ (incl. #39595, #46808, #51268, #50906) | None; 1.0 stability roadmap (#50045) | Unified Memory redesign, AMD gfx950, 1.0 stabilization |
| **llama.cpp** | Local runtime | ~14 ranked regressions (highest open: #23577, 35c) | ~15+ (incl. #32443, #31913, #19590, #32505) | **b12499 → b12531** (~32 builds) | Multimodal/voice (`mtmd`), WASM SIMD, backend fixes |
| **Ollama** | Local runtime | ~8 ranked regressions (incl. #19765, #18530, #19767) | ~8+ (incl. #19632, #19748, #19368, #19764) | None | VRAM accounting, prompt-cache correctness |
| **LiteLLM** | LLM gateway | ~14 ranked regressions (#21312, #52284, #52548, #45348) | ~20+ backport/stable PRs (incl. #52745, #52469, #52739) | None; **1 breaking change** (#52745) | LTS backports, prompt-caching regressions |
| **Unsloth** | Fine-tuning/training | ~10 ranked regressions (#18403, #18316, #18408) | ~10+ (incl. #18342, #18417, #18416, #18413) | None; latest user-visible `0.1.919-beta` | Diffusion LoRA, ROCm RDNA4/Strix Halo |

**Reading the table:** Release velocity separates *local runtimes* (llama.cpp ships ~30 builds/day; Ollama ships nothing) from *serving engines* (both hold releases in favor of roadmap stabilization) and *gateways* (LiteLLM runs a continuous backport treadmill across five stable lines). Issue *volume* is highest in llama.cpp and LiteLLM — both because they serve the broadest hardware/client surface, and because long-tail hardware regressions accumulate there.

---

## 3. Model Support Race

| Model / Architecture | vLLM | SGLang | llama.cpp | Ollama | Unsloth |
|---|---|---|---|---|---|
| **Qwen3.8 / Qwen3.5 GDN** | ✅ Trackers (#59575, #57149) | ✅ FlyDSL GDN prefill (#39595) | ⚠️ IMROPE cache bug (#32316) | ⚠️ Cache thrash (#19767) | — |
| **GLM-5.3 / Flash** | ✅ `glm_moe_dsa` (#57406) | ✅ LayerNorm SP (#50906), sort-free top-p (#46808) | — | — | — |
| **DeepSeek-V4.1 / DSA** | ✅ FP8 MLA KV (#68365) | ✅ aiter/opus kernels (#51268) | ⚠️ RPC degeneration (#30794) | — | — |
| **Muse Spark Open 816B** | ✅ MI355X tracker | ✅ **TP8/EP8 1P1D nightly (#51405)** | — | — | — |
| **HY4 Flash / Tencent Hy4** | ✅ SWA + fp8_ds_mla (#68365) | — | ✅ PR open (#32517) | — | — |
| **Gemma 4 MoE (W4A16)** | — | ✅ **Blackwell fix (#51143)** | — | — | — |
| **Mamba / hybrid recurrent** | ⚠️ Prefix-cache 0% (#45238) | ⚠️ NaN cross-contamination (#51108) | ✅ **Sticky-NaN fix (b12529)** | — | — |
| **VoxCPM2 / Hibiki / Inflect v3 (TTS/voice)** | — | — | ✅ **VoxCPM2 merged; Hibiki + Inflect in review** | — | — |
| **LTX-2.5 / HunyuanImage 2.1 / Anima-Turbo (diffusion)** | — | — | — | — | ✅ **LTX-2.5 LoRA (#18386), distilled ckpts (#18280)** |
| **GTE embeddings/rerankers (LoRA)** | ✅ #68049 | — | — | — | — |
| **Decision/non-causal (lfm3-d1)** | — | — | — | ✅ PRs #19743/#19760 | — |

**Who's ahead:**
- **Serving engines (vLLM, SGLang) lead on frontier MoE and long-context architectures** — GLM-5.3, DeepSeek-V4.1, Qwen3.8, Muse Spark 816B. SGLang notably shipped the *first* Blackwell Gemma 4 MoE fix and a full Muse Spark 1P1D nightly leg.
- **llama.cpp owns multimodal/voice** — VoxCPM2 is merged; Hibiki (full-duplex) and Inflect v3 are queued. No other project in this set is shipping realtime voice-in/voice-out.
- **Unsloth owns trainable diffusion** — LTX-2.5, HunyuanImage 2.1 distilled, Anima-Turbo, Chroma1-Flash. Nobody else is touching diffusion LoRA.
- **Ollama is the laggard on new-model coverage**, focused instead on runner plumbing for existing models.

---

## 4. Performance Frontier

Optimization effort is concentrated in **five distinct pockets**, with minimal overlap between projects:

| Domain | Where the work is | Representative items |
|---|---|---|
| **KV cache / prefix caching** | vLLM, SGLang, Ollama | vLLM Sliding-window prefix-prefill (#63867, 62× KV over-read), DiffKV prefill tiling (#61095, 3.0× on 200K ctx); SGLang Mooncake short-read bug (#50130), NPU HiCache (#50889); Ollama context-shift RoPE fix (#19680), cache thrash (#19767) |
| **Kernels (arch-specific)** | vLLM, SGLang, llama.cpp | vLLM Triton top-k/top-p sampler (#66792: 64–69% faster on NVIDIA DC, 43% on MI355X); SGLang sort-free top-p HIP EAGLE verify (#46808), dsa indexer fusion (#34394); llama.cpp CUDA conv2d `fastdiv` (#32492), MoE `__popc`/`__ballot` mmid (#32505) |
| **Quantization & memory** | Unsloth, llama.cpp, vLLM | Unsloth nf4 dequant cache budgeting (#18416: 11% faster, 5.4 GB lower peak on L4); llama.cpp CUDA FA with quantized KV (#31234, in review); vLLM W4A16 HummingLinearKernel non-determinism (#66232) |
| **Distributed serving** | vLLM, SGLang, llama.cpp | vLLM NIXL push-mode stall fix (#66795), packed NCCL/IPC chunk unification (#68043); SGLang MORI TP8/EP8 disaggregated 1P1D; llama.cpp SYCL tensor-parallel `comm_exchange_fast()` V2 (#32058) |
| **Batching / scheduling** | SGLang, Ollama, vLLM | SGLang idle-burst prefill TTFT penalty (#50920); Ollama decision-model ubatch sizing (#19743/#19760); vLLM PrimTS SWA speculative verify (#68129) |

**Notable single wins:**
- **vLLM #66792** — Triton top-k/top-p: 185 µs faster at c1, 2.5 ms faster at c256 on B300.
- **Unsloth #18417** — MiniMax-H3-Image streaming: 82.7 s → 36.7 s on Colab L4, bit-identical.
- **SGLang #39595** — FlyDSL GDN prefill: 1.4–1.74× on Qwen3.5-397B, 45 GDN layers, TP4.
- **Unsloth #18342** — AdaLN precompute: −28% per step on FLUX.1, bit-identical.

**Pattern:** Serving engines optimize *throughput under concurrency* (verify batches, prefill tiling, disaggregated P/D); local runtimes optimize *single-stream latency and hardware breadth*; training frameworks optimize *memory headroom for larger batch/context*.

---

## 5. Layer Positioning

The six projects occupy **four distinct layers**, with limited direct competition and clear interface boundaries:

```
┌─────────────────────────────────────────────────────────────┐
│  APPLICATION / AGENT LAYER                                  │
├─────────────────────────────────────────────────────────────┤
│  LiteLLM  — LLM Gateway                                     │
│  · Routing, rate limits, budgets, fallbacks, caching        │
│  · Anthropic/OpenAI/Gemini format translation                │
│  · Multi-provider abstraction; no inference itself          │
├─────────────────────────────────────────────────────────────┤
│  SERVING ENGINES (datacenter, multi-GPU)                    │
│  vLLM        SGLang                                          │
│  · Paged attention, continuous batching, spec decode         │
│  · Disaggregated P/D, tensor/expert parallelism              │
│  · Target: high-throughput, low-latency production serving   │
├─────────────────────────────────────────────────────────────┤
│  LOCAL RUNTIMES (edge, single-node, consumer HW)            │
│  llama.cpp        Ollama                                     │
│  · GGUF quantization, CPU/GPU/Metal/Vulkan/ROCm             │
│  · llama.cpp = maximal HW breadth; Ollama = UX + model mgmt │
├─────────────────────────────────────────────────────────────┤
│  TRAINING / FINE-TUNING                                     │
│  Unsloth                                                     │
│  · LoRA/QLoRA, diffusion LoRA, Studio UX                     │
│  · Feeds models back into the serving/local layers           │
└─────────────────────────────────────────────────────────────┘
```

**Key distinctions:**
- **vLLM vs SGLang** compete head-to-head in the serving engine layer. Today vLLM leans into ROCm kernel tuning and RL weight-transfer plumbing; SGLang leans into a Unified Memory redesign and a formal 1.0 stability contract. SGLang's explicit breaking-change policy (#50045) is a **maturity signal** — it's optimizing for operator trust over feature velocity.
- **llama.cpp vs Ollama** compete in the local layer, but differently: llama.cpp is a *library + reference implementation* (ships 30 builds/day, maximal backend coverage); Ollama is a *product* (no release today, but dense issue queue on VRAM accounting and cache behavior). Ollama is the only project here where **regression severity is dominated by UX-visible silent failures** (silent truncation #19765, dropped tool calls #18530).
- **LiteLLM is the only gateway** — its value is provider abstraction and policy enforcement, and its risk surface is *semantic drift* between provider formats (the Gemini breaking change #52745 is the canonical example).
- **Unsloth is upstream of everything else** — its outputs (LoRA adapters, quantized checkpoints) flow into llama.cpp/Ollama for local use and vLLM/SGLang for serving. Its diffusion work (LTX-2.5, HunyuanImage) has no downstream consumer in this set yet, signaling a **gap between training and serving for video/diffusion**.

---

## 6. Trend Signals

**Six trends visible in today's data, ranked by strategic weight:**

### Trend 1 — Agentic workloads are exposing a correctness debt in streaming and caching
The most severe regressions across projects cluster on **agent-specific failure modes**:
- SGLang #51218: `data: [DONE]` inside a tool argument truncates SSE stream.
- LiteLLM #45348: parallel tool-call arguments dropped when streaming; #36768: `response.failed` becomes HTTP 200.
- Ollama #18530: Qwen3-coder tool calls silently dropped when reasoning precedes the call.
- vLLM #49694: structured output + spec decode + async scheduling → HTTP 500s under concurrency.
- Unsloth #18189/#18185/#18306: API-connected models lose compaction policy → infinite retry loops.

**What to watch:** Any team shipping agent frameworks should **validate streaming tool-call fidelity end-to-end** and prefer non-streaming where the provider is unstable. This is the single largest source of silent production failures today.

### Trend 2 — AMD is now a co-equal optimization target, not a port
vLLM (MI355X/gfx950 trackers, gfx942 GDN prefill), SGLang (FlyDSL GDN, aiter/opus DSA, sort-free top-p), llama.cpp (HIP MMQ, HIP CI occupancy checks), and Unsloth (RDNA4, Strix Halo) all have active AMD streams. **But AMD paths carry elevated correctness risk**: SGLang #51278 (aiter MLA decode garbage output on MI355X), Unsloth #18403 (QLoRA crash on RDNA4 gfx1200), Ollama #19747 (Vulkan on RDNA1 13× slower). **Decision-maker takeaway:** AMD fleets are viable for cost-sensitive serving, but require per-model canary validation before production — smoke tests miss the progressive-degradation signature in #51278.

### Trend 3 — Hybrid/recurrent architectures (Mamba, GDN) are a stability frontier
Qwen3.5 GDN, Qwen3-Next, GLM-5.3-Flash, and Mamba2 all surface **correctness bugs specific to hybrid state**:
- vLLM #45238: prefix caching silently drops to 0% on Qwen3.5 GDN.
- SGLang #51108: NaN cross-contamination across sequences in packed varlen prefill.
- llama.cpp #31913: sticky NaN in recurrent state garbles all subsequent requests (fixed b12529).

**What to watch:** If you serve hybrid models, **upgrade to llama.cpp ≥ b12529** and **measure prefix-cache hit rates explicitly** rather than assuming them. This architecture class is under-tested relative to dense transformers.

### Trend 4 — Memory accounting is the new battleground for local/edge runtimes
Ollama (#19632 VRAM accounting, #19757 macOS overshoot), Unsloth (#18316 `--fit on` mis-plans on Strix Halo), and llama.cpp (#29858 high CPU with full offload) all show **the memory planner is the weakest link** in consumer deployments. Ollama's #19759 request for an *opt-in to fail rather than silently fall back* is a signal that operators want determinism over graceful degradation.

**What to watch:** Expect more explicit "fail loudly" semantics in local runtimes — a direct response to silent truncation and silent offload.

### Trend 5 — Gateways are becoming policy-enforcement points, with policy bugs
LiteLLM's highest-severity items are **not** routing bugs — they're *policy correctness* bugs: #21312 (failed requests bypass RPM limits — a rate-limit-bypass vector), #52548 (priority routing ignores TPM limits), #45605 (custom-auth skips budget check). As gateways absorb budget/rate-limit/quota enforcement, **their correctness becomes a security boundary**.

**What to watch:** If you sell or gate virtual keys, **enforce limits at your own edge** until #21312 is fixed — failed requests currently don't count toward RPM.

### Trend 6 — Multimodal/voice is the next capability race, and llama.cpp is alone in it
VoxCPM2 (merged), Hibiki full-duplex (in review), Inflect v3 (in review), and Tencent Hy4 Flash VL (in review) are all llama.cpp. **No serving engine in this set has shipped realtime full-duplex voice.** This suggests either (a) serving engines consider voice out of scope, or (b) a gap that SGLang/vLLM will fill in 2027.

**What to watch:** If you're building voice agents, llama.cpp's `mtmd` + `/

---

## Per-Project Reports

<details>
<summary><strong>vLLM</strong> — <a href="https://github.com/vllm-project/vllm">vllm-project/vllm</a></summary>

# vLLM Digest — 2026-11-19

## 1. Today's Highlights

No new releases landed in the last 24h, but activity is heavy across ROCm kernel tuning, KV-cache offloading design, and RL weight-transfer plumbing. The most consequential threads are the **Rust frontend feature-parity roadmap** ([#44280](https://github.com/vllm-project/vllm/issues/44280), 63 comments) and a cluster of **AMD MI355X/gfx950 and gfx942 performance trackers** for Qwen3.8, Muse Spark, and GLM-5.3. On the PR side, a new exact Triton top-k/top-p sampler claims ~3x speedup, and several correctness fixes for quantized MoE and speculative decoding are in flight.

## 2. Releases & Breaking Changes

None in the last 24h. Two behavioral changes are worth tracking ahead of merge:

- **[PR #68041](https://github.com/vllm-project/vllm/pull/68041)** — Makes *direct weight reload* the default mode for engines with runtime weight updates (`weight_transfer_config`). Plain serving is unaffected; `VLLM_RELOAD_MODE` retains `direct` semantics. Online quantization falls back where it can't quantize on load.
- **[PR #68552](https://github.com/vllm-project/vllm/pull/68552)** — Moves CUDA graph sizing policy from `VllmConfig` into `Platform`, routing prefill/decode grid generators through overridable methods. User-setting precedence is preserved, but out-of-tree platforms relying on SM100 defaults in `VllmConfig` should audit.

## 3. New Model & Hardware Support

- **GTE (bert_with_rope) LoRA** — [PR #68049](https://github.com/vllm-project/vllm/pull/68049) enables LoRA for GTE embedding and reranker models (`gte-multilingual-base`, `snowflake-arctic-embed-m-v2.0`, `gte-multilingual-reranker-base`). Supersedes #40581.
- **XPU MXFP4 MoE LoRA (gpt-oss)** — [PR #62631](https://github.com/vllm-project/vllm/pull/62631) adds LoRA support on the Intel XPU fused MoE backend via new `activation_hook`/`output_hook`. Depends on an unreleased `vllm-xpu-kernels` change.
- **HY4 Flash SWA + `fp8_ds_mla`** — [PR #68365](https://github.com/vllm-project/vllm/pull/68365) allows FP8 DeepSeek-style MLA KV cache on Flash sliding-window MLA through a model-specific `MLAAttention` subclass.
- **Qwen3.8-Flash-Next / Qwen3.8-2.4T-A95B (ROCm)** — Trackers [59575](https://github.com/vllm-project/vllm/issues/59575) and [57149](https://github.com/vllm-project/vllm/issues/57149) cover GatedDeltaNet, QuerySparse Attention, HyperConnection residuals, and MXFP4 MoE on gfx950/MI355X.
- **GLM-5.3** — [Issue #57406](https://github.com/vllm-project/vllm/issues/57406) continues optimization on the shared `glm_moe_dsa` architecture.

## 4. Performance & Optimization

- **Exact Triton top-k/top-p sampler** — [PR #66792](https://github.com/vllm-project/vllm/pull/66792) claims **64–69% less time on NVIDIA datacenter GPUs, 42% on RTX PRO 6000, 43% on MI355X**; e.g. **185 µs faster at c1 and 2.5 ms faster at c256** on B300 with Qwen3.6 verify rows.
- **DiffKV prefill tiling on SM80** — [Issue #61095](https://github.com/vllm-project/vllm/issues/61095): `BLOCK_M=128` + KV tile 64 yields **3.0x on 200K-context chunks** for GPUs without FA3/FA4.
- **GDN prefill kernels on gfx942 (CDNA3)** — [PR #62909](https://github.com/vllm-project/vllm/pull/62909) retunes autotune configs for GatedDeltaNet Triton prefill.
- **RDNA GDN prefill kernels** — [PR #66967](https://github.com/vllm-project/vllm/pull/66967) applies head-first grids, vectorized stores, and spill-free configs to `chunk_scaled_dot_kkt_fwd`, `solve_tril`, and `fwd_h`.
- **Sliding-window Triton prefix-prefill** — [PR #63867](https://github.com/vllm-project/vllm/pull/63867) skips masked-out context tiles; a 32k prompt with a 512-token window currently reads **62x more KV than it uses**.
- **PrimTS SWA speculative verify** — [PR #68129](https://github.com/vllm-project/vllm/pull/68129) keeps verify batches on the paged decode plan for all draft lengths.

## 5. Stability & Regressions

Ranked by severity:

1. **NIXL push-mode stalls + early block release** — [PR #66795](https://github.com/vllm-project/vllm/pull/66795) fixes WRITE submission stalls under sustained load and locks the NIXL agent in both modes. **Fix PR open.**
2. **Hybrid-model prefix caching drops to 0%** — [Issue #45238](https://github.com/vllm-project/vllm/issues/45238): with `mamba_cache_mode="align"` on Qwen3.5 GDN, the last-block-boundary checkpoint may land in request-unique tokens, silently zeroing cache hits. No fix PR cited.
3. **Structured output + spec decode + async scheduling** — [Issue #49694](https://github.com/vllm-project/vllm/issues/49694): ngram_gpu drafts bypass the grammar FSM, causing `"Failed to advance FSM"`, HTTP 500s, and silent truncation under concurrency.
4. **Dynamic per-tensor FP8 amax includes stale CUDA-graph padding** — [Issue #67802](https://github.com/vllm-project/vllm/issues/67802): stale token IDs pollute amax during dynamic quantization.
5. **Sparse weight patches store NaN markers** — [PR #66944](https://github.com/vllm-project/vllm/pull/66944): `sparse_nccl` updates on Qwen3.5/3-Next GDN and Mamba2 report success but leave wrong weights. **Fix PR open.**
6. **W4A16 HummingLinearKernel non-determinism** — [Issue #66232](https://github.com/vllm-project/vllm/issues/66232): non-deterministic across processes on H100, and faster than Machete — a batch-invariance concern.
7. **Qwen3.5 MTP with dropped `mtp.*` weights** — [PR #68286](https://github.com/vllm-project/vllm/pull/68286) makes load fail loudly instead of serving uninitialized draft weights.
8. **`--prefix-match-unit` TTFT regression on Triton/FLA GDN** — [Issue #67674](https://github.com/vllm-project/vllm/issues/67674): recovers hybrid prefix hits but costs **~30 ms TTFT on almost every request** on L40.
9. **Realtime context bleed in single-turn models** — [PR #56218](https://github.com/vllm-project/vllm/pull/56218) stops `_update_request_as_session()` from appending prior output tokens for single-turn prompt models. **Fix PR open.**
10. **Stale NCCL communicators after FT scale-down** — [PR #68132](https://github.com/vllm-project/vllm/pull/68132) releases DP/EP/EPLB communicators retaining removed ranks.

Closed/resolved: [#57224](https://github.com/vllm-project/vllm/issues/57224) (CC-mode stale UVA views), [#65770](https://github.com/vllm-project/vllm/issues/65770) (gpt-oss tool-call 500s), [#55152](https://github.com/vllm-project/vllm/issues/55152) (guidance tool-calling), [#65193](https://github.com/vllm-project/vllm/issues/65193) (MXFP8 W8A16 silently running W8A8), [#65385](https://github.com/vllm-project/vllm/issues/65385) (GDN Triton prefill on Hopper/H20).

## 6. What This Means for Application Developers

- **Speculative decoding + structured output is still fragile.** If you run `ngram_gpu` spec decode with xgrammar and async scheduling, expect HTTP 500s under concurrency ([#49694](https://github.com/vllm-project/vllm/issues/49694)). Validate grammar-constrained paths before enabling both.
- **Hybrid Mamba/GDN models can silently lose prefix caching.** On Qwen3.5 GDN with `mamba_cache_mode="align"`, cache hit rate may be 0% without an obvious error ([#45238](https://github.com/vllm-project/vllm/issues/45238)). Measure, don't assume.
- **Agent/gateway builders should watch `vllm.Render`.** [Issue #67652](https://github.com/vllm-project/vllm/issues/67652) and [#65503](https://github.com/vllm-project/vllm/issues/65503) extend the engine-free gRPC renderer to Completions, Responses, and Anthropic Messages with raw-JSON input — relevant if you're offloading tokenization/rendering to a sidecar.
- **Tool-calling semantics may change.** [Issue #66858](https://github.com/vllm-project/vllm/issues/66858) flags that Python and Rust frontends disagree on `tools` + `response_format` under `tool_choice="auto"`. Pin your frontend if you depend on current behavior.
- **RL fine-tuning pipelines get safer weight sync.** [PR #66944](https://github.com/vllm-project/vllm/pull/66944) fixes silent NaN weights in sparse NCCL updates, and [PR #68043](https://github.com/vllm-project/vllm/pull/68043) unifies packed NCCL/IPC chunk layouts for weight transfer.
- **AMD users get concrete tuning targets.** If you're on MI355X/gfx950 or gfx942, the Qwen3.8, Muse Spark, and GLM-5.3 trackers are the places to watch for landed uplifts.

---
*Generated from GitHub activity on `vllm-project/vllm`, 2026-11-19. Comment counts for PRs were unavailable in the source data.*

</details>

<details>
<summary><strong>SGLang</strong> — <a href="https://github.com/sgl-project/sglang">sgl-project/sglang</a></summary>

# SGLang Digest — 2026-11-19

## 1. Today's Highlights

SGLang's roadmap work crystallized around the **1.0 stability release** (#50045) and a **Unified Memory** redesign (#49944) that eliminates fixed KV/state partitions in favor of a shared GPU memory arena. On the performance side, AMD gfx950 (MI355X) had a strong day: DeepSeek-V4.1 sparse attention is moving to aiter's `opus` kernels, GLM-5.3-Flash gained a sort-free top-p path for EAGLE verify, and a FlyDSL GDN prefill backend landed for Qwen3.5-397B. Meanwhile the CUDA coredump tracker (#26340, 381 comments) and CI flaky tracker (#42752) remain the loudest signals that multi-backend test stability is still the biggest drag on merge velocity.

## 2. Releases & Breaking Changes

No new releases in the last 24h. Two forward-looking policy items worth tracking:

- **[roadmap] SGLang 1.0 Release Tracker** (#50045): Explicitly framed as a stability release — silent configuration changes will be *replaced with errors that name the setting*, plus a defined compatibility policy for the 1.x series. Upgrading from 0.5.x may require code/config changes. → [Issue #50045](https://github.com/sgl-project/sglang/issues/50045)
- **torch 2.15 / CUDA 13.4 validation PR** (#51372): Draft "do not merge" PR that builds every wheel SGLang would ship and runs the full NVIDIA PR suite — the upgrade gate before anything is published. → [PR #51372](https://github.com/sgl-project/sglang/pull/51372)

## 3. New Model & Hardware Support

- **Gemma 4 W4A16 MoE on Blackwell** (#51143): int4/NVFP4 Gemma 4 MoE checkpoints currently fail to start; fix runs experts with a GELU activation as the model defines. → [PR #51143](https://github.com/sgl-project/sglang/pull/51143)
- **Muse Spark Open 816B-A42B MXFP4 on MI355X** (#51405): Added as a TP8/EP8 1P1D disaggregated nightly leg over MORI with a full GSM8K gate. → [PR #51405](https://github.com/sgl-project/sglang/pull/51405)
- **NGRAM speculative decoding on NPU** (#43996): MHA and MLA variants; on/off comparison matched generated text across 240 random-serving prompts. → [PR #43996](https://github.com/sgl-project/sglang/pull/43996)
- **DeepSeek-V4.1 sparse attention on AMD aiter/opus** (#51268): Requires token-interleaved `SGLANG_DSV4_KV_LAYOUT=v41_new`; part 4/5 of the V41_NEW KV layout series. → [PR #51268](https://github.com/sgl-project/sglang/pull/51268)
- **NPU HiCache via `kv_exchange`** (#50889): MHA KV and Mamba temporal/convolution/draft state now routed through the split-KV operator, both layer-first and page-first layouts. → [PR #50889](https://github.com/sgl-project/sglang/pull/50889)
- **XPU consolidation** (#50823): Batch of simple Intel XPU model enablements reconciled against main. → [PR #50823](https://github.com/sgl-project/sglang/pull/50823)

## 4. Performance & Optimization

- **FlyDSL GDN prefill for AMD gfx95** (#39595): 1.4–1.74× prefill speedup on Qwen3.5-397B's 45 Gated DeltaNet layers at TP4 (4 key heads, 16 value heads, K=V=128). → [PR #39595](https://github.com/sgl-project/sglang/pull/39595)
- **Sort-free top-p + many-row softmax for HIP EAGLE verify** (#46808): Targets 384 verify rows (concurrency 64 × 6 draft tokens) for GLM-5.3-Flash (vocab 154,880) on ROCm. → [PR #46808](https://github.com/sgl-project/sglang/pull/46808)
- **GLM-5.3-Flash LayerNorm sequence parallelism** (#50906): On 8×H200 TP8, mHC norm work consumed 81 ms of rank 0's 651 ms GPU time for a 128K cold prefill — now parallelized across ranks. → [PR #50906](https://github.com/sgl-project/sglang/pull/50906)
- **AMD dsa indexer projection fusion** (#34394): `wk` and `weights_proj` folded into one bf16 GEMM on ROCm. → [PR #34394](https://github.com/sgl-project/sglang/pull/34394)
- **KDA prefill int32 overflow fix** (#50775): Row offsets wrap at ~524k tokens (H=32, K=128) — real overflows in packed long-context prefill now fixed. → [PR #50775](https://github.com/sgl-project/sglang/pull/50775)
- **Rust server stack follow-ups** (#49055): Non-blocking perf items from the 12-PR Rust server review. → [Issue #49055](https://github.com/sgl-project/sglang/issues/49055)
- **Diffusion perf-check runner variance** (#48311): In-job retries can't recover a slow host; green/red depends on which runner the job lands on. → [Issue #48311](https://github.com/sgl-project/sglang/issues/48311)

## 5. Stability & Regressions

Ranked by severity:

1. **AMD aiter MLA decode garbage output** (#51278, no fix PR): DeepSeek-V2-Lite on MI355X with fp8 KV cache degrades into repeated tokens request-by-request when `SGLANG_AITER_MLA_PERSIST=0`. First request coherent, then monotonic decay over 50 GSM8K questions. → [Issue #51278](https://github.com/sgl-project/sglang/issues/51278)
2. **Mamba chunked-scan varlen cross-contamination** (#51108): A non-finite value in one sequence produces NaN in *other* sequences of the same packed chunk — zeroing tokens before dot product doesn't mask non-finite values. Silent, correctness-critical. → [Issue #51108](https://github.com/sgl-project/sglang/issues/51108)
3. **`fused_hc_head` wrong result for non-power-of-2 `hc_mult`** (#51106): Kernel receives `next_power_of_2(hc_mult)` but uses it as the true multiplier. → [Issue #51106](https://github.com/sgl-project/sglang/issues/51106)
4. **Mooncake short reads accepted as cache hits** (#50130): Transfer success checked via status vector only, never bytes arrived — corrupt prefix reuse possible. → [Issue #50130](https://github.com/sgl-project/sglang/issues/50130)
5. **Legacy HTTP P/D router SSE truncation** (#51218): A tool argument containing the literal `data: [DONE]` terminates the stream early. Directly affects tool-calling agents. → [Issue #51218](https://github.com/sgl-project/sglang/issues/51218)
6. **macOS CPU device broken** (#50915): `--device cpu` fails in `get_cpu_ids_by_node` calling `lscpu`. → [Issue #50915](https://github.com/sgl-project/sglang/issues/50915)
7. **Idle-burst prefill TTFT penalty** (#50920): With default consecutive-prefill overlap, the first of a simultaneously-arriving burst is admitted alone and its result is processed only after the next prefill batch launches. → [Issue #50920](https://github.com/sgl-project/sglang/issues/50920)
8. **Qwen3.8-27B batch-shape-dependent scores** (#43956): FP8 and BF16 outputs change with batch shape, enough to flip borderline decisions. → [Issue #43956](https://github.com/sgl-project/sglang/issues/43956)
9. **CI / infra**: CUDA coredump tracker (#26340, 381 comments) and flaky-test tracker (#42752, 215 comments) continue accumulating; main-branch CI currently reports 1 broken, 5 flaky, 942 recently fixed (#17050, auto-updated 2026-11-19 02:25 UTC). → [#26340](https://github.com/sgl-project/sglang/issues/26340) · [#42752](https://github.com/sgl-project/sglang/issues/42752) · [#17050](https://github.com/sgl-project/sglang/issues/17050)
10. **Closed as inactive today** (not fixed — treat as known limitations): JSON-schema DFA state explosion / CPU thread hang under deeply nested schemas (#39125); GLM-5.3-Flash MTP layer loader shape mismatch (#40285); no usable DSA attention backend on SM121 / DGX Spark (#40286). → [#39125](https://github.com/sgl-project/sglang/issues/39125) · [#40285](https://github.com/sgl-project/sglang/issues/40285) · [#40286](https://github.com/sgl-project/sglang/issues/40286)

## 6. What This Means for Application Developers

- **If you serve on AMD MI355X with fp8 KV cache**: avoid the aiter MLA path with `SGLANG_AITER_MLA_PERSIST=0` until #51278 is resolved — signature is coherent-first-request then progressive degradation, which is easy to miss in smoke tests.
- **If you use Mooncake/HiCache for prefix caching**: be aware that short reads can currently register as hits (#50130). Validate cache-reuse paths with content checks on any release before 1.0.
- **If you're building tool-calling agents over the legacy P/D router**: a tool argument containing `data: [DONE]` will truncate the SSE stream (#51218). Prefer the Rust server stack, which is the active perf target (#49055, #50785 shutdown RPC for sidecar operability).
- **If you use Mamba/hybrid models (Qwen3.5, Qwen3-Next, GLM-5.3-Flash)**: packed varlen prefill has a NaN cross-contamination risk (#51108) and AMD hybrid pools need #51221 for the vectorized_5d KV layout — test batched mixed workloads explicitly.
- **Plan for 1.0**: expect config values that were silently corrected or ignored to become hard errors naming the offending setting (#50045). Audit your launch scripts now; migration notes will accompany the release.
- **NPU and Intel XPU deployments** are getting first-class investment (NGRAM spec decode, HiCache kv_exchange, consolidated XPU enablements) — if you're evaluating non-NVIDIA fleets, SGLang's portability story is materially improving.
- **Per-request tokenization control** is coming: #48580 proposes a per-request `skip_detokenize` in `api.v1.GenerateRequest` for token-ID-only consumers. → [Issue #48580](https://github.com/sgl-project/sglang/issues/48580)

</details>

<details>
<summary><strong>llama.cpp</strong> — <a href="https://github.com/ggml-org/llama.cpp">ggml-org/llama.cpp</a></summary>

# llama.cpp Digest — 2026-11-19

## 1. Today's Highlights

The release cadence remains extremely high (b12499 → b12531 in the window), with `mtmd` (multimodal) expansion as the dominant theme: VoxCPM2 TTS/voice synthesis landed ([#32443](https://github.com/ggml-org/llama.cpp/pull/32443)), while Hibiki full-duplex and Inflect v3 TTS are in review ([#32491](https://github.com/ggml-org/llama.cpp/pull/32491), [#32581](https://github.com/ggml-org/llama.cpp/pull/32581)). On the backend side, a WASM Relaxed SIMD implementation with Q3_K/Q6_K kernels merged ([#19590](https://github.com/ggml-org/llama.cpp/pull/19590)), and a rare correctness fix for sticky NaN in recurrent state (Mamba/hybrid models) shipped in b12529 ([#31913](https://github.com/ggml-org/llama.cpp/pull/31913)). The issue tracker is dominated by long-context correctness and multi-GPU degradation reports, several of which now have candidate root causes identified.

## 2. Releases & Breaking Changes

No API-breaking changes or migration notes in this window. Notable builds:

- **b12531** — mtmd: VoxCPM2 support ([#32443](https://github.com/ggml-org/llama.cpp/pull/32443))
- **b12530** — WASM Relaxed SIMD for dot products, incl. Q3_K/Q6_K ([#19590](https://github.com/ggml-org/llama.cpp/pull/19590))
- **b12529** — fix sticky NaN in recurrent state ([#31913](https://github.com/ggml-org/llama.cpp/pull/31913))
- **b12528** — server: fix sleep state for `v1/realtime` ([#32567](https://github.com/ggml-org/llama.cpp/pull/32567))
- **b12527** — model loading: `limite` rejects mudd configs that index past `mudd_tap_idx` ([#32562](https://github.com/ggml-org/llama.cpp/pull/32562))
- **b12521** — WebGPU: fix FA mask broadcast over Q batch ([#32535](https://github.com/ggml-org/llama.cpp/pull/32535))
- **b12503** — ggml-openvino: expanded model support, NPU/GPU/memory optimizations ([#32172](https://github.com/ggml-org/llama.cpp/pull/32172))
- **b12502** — CUDA: MMQ for MoE on V100 ([#32504](https://github.com/ggml-org/llama.cpp/pull/32504))

## 3. New Model & Hardware Support

**Models / architectures:**
- **VoxCPM2** (TTS/audio) via mtmd — merged in b12531 ([#32443](https://github.com/ggml-org/llama.cpp/pull/32443))
- **Kyutai Hibiki** (1B/2B, realtime full-duplex voice-in/voice-out based on Moshi) — PR open, includes server-side full-duplex support ([#32491](https://github.com/ggml-org/llama.cpp/pull/32491))
- **Inflect v3** TTS family (Mini/Micro/Atom) — PR open ([#32581](https://github.com/ggml-org/llama.cpp/pull/32581))
- **Tencent Hy4 Flash** (`hy_v4_flash`, `HYV4NextForCausalLM` / VL variant) with iHC, gated MLA, IMROPE text tower — PR open ([#32517](https://github.com/ggml-org/llama.cpp/pull/32517))
- **DFlash draft models** — dspark GIDD log-SNR conditioning key/tensors now registered so speculation isn't silently disabled ([#30657](https://github.com/ggml-org/llama.cpp/pull/30657))

**Hardware / backends:**
- **WASM Relaxed SIMD** with Q3_K/Q6_K (via HF collaboration, co-authored by Xuan Son Nguyen) ([#19590](https://github.com/ggml-org/llama.cpp/pull/19590))
- **OpenVINO** — SWA mask detection fix, NPU/GPU/memory improvements ([#32172](https://github.com/ggml-org/llama.cpp/pull/32172))
- **CUDA MMQ for MoE on V100 (sm_70)** ([#32504](https://github.com/ggml-org/llama.cpp/pull/32504))
- **Vulkan (Qualcomm)** — rms_norm runtime loop count ([#30824](https://github.com/ggml-org/llama.cpp/pull/30824))
- **OpenCL** — dp4a path for KQ in decomposed FA (PR) ([#32577](https://github.com/ggml-org/llama.cpp/pull/32577))
- **RPC** — fall back to buffered I/O on EIO ([#32545](https://github.com/ggml-org/llama.cpp/pull/32545))

## 4. Performance & Optimization

- **CUDA conv2d (implicit GEMM)** — replaced three per-row integer divisions with `fastdiv` for patch index decoding ([#32492](https://github.com/ggml-org/llama.cpp/releases), b12500). A follow-up PR fixes a 32-bit overflow in `fastdiv` (`hi + n` before right shift) that produced wrong quotients for large operands ([#32575](https://github.com/ggml-org/llama.cpp/pull/32575)).
- **CUDA MoE / duplicate expert IDs** — mmid helper rewritten with `__popc`/`__ballot`, faster than the `__shfl` version; enables duplicate expert ID support ([#32505](https://github.com/ggml-org/llama.cpp/pull/32505)).
- **HIP/MMQ on non-WMMA architectures** — benchmark table in PR shows movement on M=127/K=2048 shapes ([#32266](https://github.com/ggml-org/llama.cpp/pull/32266)).
- **SYCL tensor-parallel communication** — `comm_exchange_fast()` V2 (successor to #30956) reports gains in non-Windows `-sm` PP and TG t/s, scaling with allreduce frequency; includes an Intel oneAPI leak stopgap and Xe2/B70 fix ([#32058](https://github.com/ggml-org/llama.cpp/pull/32058)).
- **WASM** — relaxed SIMD dot products for quantized types should meaningfully raise browser/edge throughput vs. the previous SIMD path ([#19590](https://github.com/ggml-org/llama.cpp/pull/19590)).
- **HIP CI** — new occupancy-regression check modeled on `gcn-cdna-vgpr-check.py` to catch large occupancy regressions pre-merge ([#32365](https://github.com/ggml-org/llama.cpp/pull/32365)).
- **CUDA FA with quantized KV** — native q4_0/q8_0 K/V reads in `flash_attn_tile` (dequantizing at tile load) remains in review ([#31234](https://github.com/ggml-org/llama.cpp/pull/31234)); relevant to [#29371](https://github.com/ggml-org/llama.cpp/issues/29371), which reports FA inefficiency growing with context length on quantized KV.

## 5. Stability & Regressions

Ranked by severity/likely blast radius:

1. **Pascal (sm_60) silent long-context corruption** — hybrid models (MiMo-V2.6-Distill, Nemotron Bolt) produce incorrect output on Pascal but are correct on CPU and Ampere. Silent corruption on older GPUs is a serious class of bug ([#32375](https://github.com/ggml-org/llama.cpp/issues/32375)). No fix PR yet.
2. **Vulkan multi-ubatch prompt processing corruption (i915)** — root cause rewritten by reporter: queued GPU work > ~20s corrupts PP ([#32370](https://github.com/ggml-org/llama.cpp/issues/32370)). No fix PR identified.
3. **CUDA illegal memory access in flash-attn path with partial expert offload** — deterministic on second request for Qwen3.6-35B MoE; disappears with `-fa off` ([#26609](https://github.com/ggml-org/llama.cpp/issues/26609)). Closed as stale, but the signature (MoE + FA + offload) overlaps with active CUDA MoE work ([#32505](https://github.com/ggml-org/llama.cpp/pull/32505)).
4. **Sticky NaN in recurrent state** — fixed in b12529 ([#31913](https://github.com/ggml-org/llama.cpp/pull/31913)); the underlying user report ([#29830](https://github.com/ggml-org/llama.cpp/issues/29830)) documents that a NaN-poisoned recurrent state garbles all subsequent requests — an availability issue for long-running servers with hybrid models.
5. **RPC: DeepSeek V4 output degeneration + slot corruption** with two RPC workers after long prompts ([#30794](https://github.com/ggml-org/llama.cpp/issues/30794)). No fix PR.
6. **Vulkan on A770: decode degradation after ~7–8h** (empty EOS replies while prefill still works) ([#29526](https://github.com/ggml-org/llama.cpp/issues/29526)). Closed stale; still indicative of long-run decode path instability.
7. **Server: crash on `/v1/realtime` when sleeping** — reported ([#32541](https://github.com/ggml-org/llama.cpp/issues/32541)) and fixed same day in b12528 ([#32567](https://github.com/ggml-org/llama.cpp/pull/32567)).
8. **MTP with Qwen3.6-27B repeats `////` after long sessions** ([#23577](https://github.com/ggml-org/llama.cpp/issues/23577), 35 comments) — highest-traffic open bug; still unconfirmed.
9. **DFlash speculative decoding broken on docs example pair** — ~6% acceptance vs ~85% expected, ~5x slower, greedy divergence ([#32526](https://github.com/ggml-org/llama.cpp/issues/32526)). Closed, but a red flag for anyone adopting DFlash drafts; see related log-SNR loader fix ([#30657](https://github.com/ggml-org/llama.cpp/pull/30657)).
10. **SYCL rms_norm launch failure on Arc Pro B60** (`UR_RESULT_ERROR_UNSUPPORTED_FEATURE`) ([#30301](https://github.com/ggml-org/llama.cpp/issues/30301)).
11. **OpenCL q8_0 `set_tensor` drops writes** — restoring sequence state with q8_0 KV yields empty cache ([#29798](https://github.com/ggml-org/llama.cpp/issues/29798)). Android/Adreno.
12. **High CPU use with fully GPU-offloaded model** — bisected to a94d563 in b10423, still open ([#29858](https://github.com/ggml-org/llama.cpp/issues/29858)).
13. **HIP VMM pool: `cuMemAddressReserve` spin on error** ([#32105](https://github.com/ggml-org/llama.cpp/issues/32105)).
14. **Cache reuse disabled for IMROPE models (Qwen3.5)** — full re-prefill on every follow-up on Metal ([#32316](https://github.com/ggml-org/llama.cpp/issues/32316)). Significant latency regression for multi-turn apps.

## 6. What This Means for Application Developers

- **Multimodal and voice are becoming first-class.** VoxCPM2 is merged, and Hibiki/Inflect v3 are queued. If you're building voice agents, `mtmd` + `/v1/realtime` (WebSocket) is the surface to watch — but note the realtime path just had a sleep-state crash (fixed in b12528), so pin to ≥ b12528 for realtime workloads.
- **Hybrid/recurrent models: upgrade to b12529.** The sticky-NaN fix prevents a poisoned recurrent state from garbling all subsequent requests on long-running servers. This is a must-have if you serve Mamba-family or hybrid architectures.
- **Multi-turn latency on IMROPE models (Qwen3.5) is currently degraded** — cache reuse is disabled, meaning full re-prefill per follow-up ([#32316](https://github.com/ggml-org/llama.cpp/issues/32316)). Budget for this or pin to an older build until fixed.
- **Speculative decoding caution:** if you adopt DFlash drafts, validate your own acceptance rates — the documented example pair reports ~6% vs ~85% expected ([#32526](https://github.com/ggml-org/llama.cpp/issues/32526)). The dspark log-SNR loader fix ([#30657](https://github.com/ggml-org/llama.cpp/pull/30657)) suggests some drafts were silently failing to load, which would explain low acceptance.
- **Edge/browser inference got a real boost** with WASM Relaxed SIMD ([#19590](https://github.com/ggml-org/llama.cpp/pull/19590)); Q3_K/Q6_K at usable speeds makes ~7B-class models viable in-browser.
- **Older GPU fleets carry risk.** Pascal long-context corruption ([#32375](https://github.com/ggml-org/llama.cpp/issues/32375)), Vulkan A770 decode degradation ([#29526](https://github.com/ggml-org/llama.cpp/issues/29526)), and the SYCL Arc B60 launch failure ([#30301](https://github.com/ggml-org/llama.cpp/issues/30301)) all point to non-Ampere/Ada hardware being under-tested for long-context and long-uptime workloads. Run your own canary before deploying to those tiers.
- **MoE serving is actively improving** (MMQ on V100, duplicate expert IDs on CUDA, HIP MMQ on non-WMMA), so re-benchmark MoE throughput after this batch of merges.

</details>

<details>
<summary><strong>Ollama</strong> — <a href="https://github.com/ollama/ollama">ollama/ollama</a></summary>

# Ollama Digest — 2026-11-19

## 1. Today's Highlights

No new releases shipped in the last 24h, but the issue/PR queue is dense with memory-accounting and cache-correctness work. The most consequential thread is a cluster of fixes around VRAM accounting and GPU splitting ([#19632](https://github.com/ollama/ollama/pull/19632)), which underpins several open load-failure and eviction reports. In parallel, a second cluster targets context-shift and prompt-cache behavior ([#19748](https://github.com/ollama/ollama/pull/19748), [#19680](https://github.com/ollama/ollama/pull/19680), [#19767](https://github.com/ollama/ollama/issues/19767)) — directly relevant to multi-session agent workloads.

## 2. Releases & Breaking Changes

None in the last 24h. No new version tags, no API or config surface changes landed today.

## 3. New Model & Hardware Support

- **Decision/non-causal model batching** — Two competing PRs ([#19743](https://github.com/ollama/ollama/pull/19743), [#19760](https://github.com/ollama/ollama/pull/19760)) fix batch sizing for `decision.type` models such as `d1-2B` (`lfm3-d1`), which are non-causal and must evaluate the full prompt in one ubatch. Current behavior launches them with `-b 512 -ub 512`, causing misleading context-length errors and silent image downscaling ([#19740](https://github.com/ollama/ollama/issues/19740)).
- **Vulkan / RDNA1** — No support landed; a regression report shows `OLLAMA_VULKAN=1` on RX 5700 XT (gfx1010) is ~13x slower than upstream llama.cpp Vulkan for prompt processing (40 vs ~540 t/s) and ~17% slower for generation ([#19747](https://github.com/ollama/ollama/issues/19747)).
- **MLX runner** — Continued work on DFlash2 speculative proposals and recurrent replay batching ([#19769](https://github.com/ollama/ollama/pull/19769)), plus memory-pressure-adaptive history retention for Metal runners ([#19678](https://github.com/ollama/ollama/pull/19678)).

## 4. Performance & Optimization

- **Speculative decoding metrics** — [#19368](https://github.com/ollama/ollama/pull/19368) adds per-request reporting of drafted vs. accepted tokens (in API responses and `ollama run --verbose`), replacing the misleading standalone acceptance-rate number.
- **Context shift correctness** — [#19680](https://github.com/ollama/ollama/pull/19680) fixes `llama_kv_cache::build_rope_shift` re-applying YaRN amplitude on already-roped keys, which compounded error across successive shifts. Fixes [#19457](https://github.com/ollama/ollama/issues/19457).
- **Shared runner across `shift` settings** — [#19748](https://github.com/ollama/ollama/pull/19748) (merged/closed) stops model reloads when a request's `shift` differs from the loaded runner's, fixing [#18950](https://github.com/ollama/ollama/issues/18950).
- **VRAM accounting / GPU splitting** — [#19632](https://github.com/ollama/ollama/pull/19632) addresses incorrect eviction, load refusal, and unnecessary multi-GPU spread (issues [#19463](https://github.com/ollama/ollama/issues/19463), [#18679](https://github.com/ollama/ollama/issues/18679), [#18349](https://github.com/ollama/ollama/issues/18349), [#16599](https://github.com/ollama/ollama/issues/16599)).

## 5. Stability & Regressions

Ranked by severity:

1. **Silent prompt truncation** — [#19765](https://github.com/ollama/ollama/issues/19765) (CLOSED): requests with context window 147,456 silently truncate at 65,538 tokens, and `done_reason=stop` masks the truncation. High severity for RAG/long-document workloads; no fix PR referenced.
2. **macOS memory overshoot** — [#19757](https://github.com/ollama/ollama/issues/19757): `qwen3.8:27b` on a 24 GB M6 with partial offload plans 18,306 MiB but llama-server reaches ~21 GiB, driving critical memory pressure. Consistent with the VRAM accounting cluster in [#19632](https://github.com/ollama/ollama/pull/19632).
3. **Qwen3-coder tool calls silently dropped** — [#18530](https://github.com/ollama/ollama/issues/18530): parser only matches the literal `<tool_call>` opener; when the model emits reasoning before the call (explicitly allowed by its system prompt) the call is lost. Fix PR open: [#19764](https://github.com/ollama/ollama/pull/19764).
4. **Prompt cache thrashing on Qwen3.8** — [#19767](https://github.com/ollama/ollama/issues/19767): two agent sessions on the default single slot re-read every prompt from token 0; parallel slots lose part of the cache. Impacts agent latency/cost.
5. **Duplicate GGUF keys** — [#19768](https://github.com/ollama/ollama/issues/19768): import accepts duplicate metadata keys, and the two internal readers disagree (first-wins vs. last-wins). Silent divergence risk in model loading.
6. **Thinking UI rendering** — [#19751](https://github.com/ollama/ollama/issues/19751): numbered list markers are clipped past two digits; fix PRs [#19752](https://github.com/ollama/ollama/pull/19752) and [#19755](https://github.com/ollama/ollama/pull/19755) (closed).
7. **`/tokenize` error surface** — [#19758](https://github.com/ollama/ollama/pull/19758): raw llama-server 500 bodies returned for over-batch prompts instead of a proper context error.

## 6. What This Means for Application Developers

- **Long-context apps: audit for silent truncation.** Issue [#19765](https://github.com/ollama/ollama/issues/19765) shows token counts capped at ~65.5k with `done_reason=stop`. If you depend on large context windows, validate reported token counts against sent input — do not trust `done_reason` alone.
- **Agent frameworks: tool-call parsing is fragile for Qwen3-coder.** Until [#19764](https://github.com/ollama/ollama/pull/19764) lands, avoid prompting models to emit natural-language reasoning before tool calls, or add a client-side fallback parser that tolerates a missing `<tool_call>` opener.
- **Multi-session agents: expect prompt-cache re-reads.** Per [#19767](https://github.com/ollama/ollama/issues/19767), concurrent sessions on a single slot re-process from token 0. Budget for higher prefill cost, or pin one session per slot until cache behavior improves.
- **VRAM planning is being reworked.** If you rely on deterministic GPU placement (e.g., benchmarking, capacity planning), note that [#19759](https://github.com/ollama/ollama/issues/19759) requests an opt-in to *fail* a load rather than silently falling back to CPU projector offload — useful for reproducible deployments.
- **Speculative decoding telemetry is coming.** [#19368](https://github.com/ollama/ollama/pull/19368) will expose drafted/accepted token counts per request, enabling proper cost/benefit tuning of draft models rather than optimizing on acceptance rate alone.

</details>

<details>
<summary><strong>LiteLLM</strong> — <a href="https://github.com/BerriAI/litellm">BerriAI/litellm</a></summary>

# LiteLLM Digest — 2026-11-19

## 1. Today's Highlights

No new releases landed in the last 24h, but **LTS backport activity is heavy**: fixes are being ported across `stable/1.110.x`, `rc/1.111.0`, `lts/1.108.x`, `stable/1.106`, and older `stable/1.99.x`/`1.100.x` lines. Two threads dominate: **prompt-caching regressions on `/v1/messages` with `store: false`** against GPT-6.2 (multiple backport PRs), and a **breaking change in the Gemini provider** that now surfaces tool-call failures as errors instead of silently returning a normal finish. On the bug side, the long-standing issue of **failed requests not counting toward RPM limits** (#21312) and a **read-replica self-heal failure** (#52284, closed) remain the highest-impact items.

## 2. Releases & Breaking Changes

- **BREAKING (Gemini/Vertex): tool-call failures now return an error.** [PR #52745](https://github.com/BerriAI/litellm/pull/52745) — Gemini and Vertex chat callers that previously received a normal finish after a failed tool call will now get an error (HTTP 500 when not streaming). Handle the error or configure retry/fallback before upgrading.
- **Backports to stable/1.110.x for v1.110.1** ([PR #52469](https://github.com/BerriAI/litellm/pull/52469)): Claude models that removed sampling options accept `temperature=1` again; requests forwarding the caller's own credential are billed at the price set on the deployment; JWT key fix.
- **Backports to rc/1.111.0** ([PR #52470](https://github.com/BerriAI/litellm/pull/52470)): five regression fixes including the Claude temperature and credential-billing fixes above.
- **LTS 1.108 backports:** Gemini batch json_schema row fix ([PR #52725](https://github.com/BerriAI/litellm/pull/52725)), guardrail tool-name alias fix ([PR #52717](https://github.com/BerriAI/litellm/pull/52717)).
- **Master key rotation hardening:** [PR #52413](https://github.com/BerriAI/litellm/pull/52413) keeps stored values under `LITELLM_SALT_KEY` when rotating the master key; [PR #47641](https://github.com/BerriAI/litellm/pull/47641) rejects master key rotation through `/key/regenerate` (which previously bricked DB-stored models on restart).
- **Remaining Jev follow-ups** being backported to `stable/1.99.x` and `stable/1.100.x` ([PR #42669](https://github.com/BerriAI/litellm/pull/42669), [PR #42668](https://github.com/BerriAI/litellm/pull/42668)).

## 3. New Model & Hardware Support

No new model or hardware support landed today. Related in-flight items:
- **OpenTelemetry v2 preset for WildEdge.dev** requested ([Issue #52290](https://github.com/BerriAI/litellm/issues/52290)) — end-to-end OTLP/HTTP ingestion verified.
- **Forward `params._meta` to upstream MCP servers on `tools/call`** requested ([Issue #51171](https://github.com/BerriAI/litellm/issues/51171)) — currently dropped by the MCP gateway.

## 4. Performance & Optimization

- **Prompt caching on `/v1/messages` with `store: false`** — multiple backports land the fix across stable lines: [PR #52739](https://github.com/BerriAI/litellm/pull/52739) (LTS 1.108), [PR #52738](https://github.com/BerriAI/litellm/pull/52738) (1.106 stable), plus [PR #52732](https://github.com/BerriAI/litellm/pull/52732) (keep Claude Code billing metadata out of prompts so cache keys stay stable) and [PR #52743](https://github.com/BerriAI/litellm/pull/52743) (ignore dropped Messages placement params when choosing system-prompt placement). Root cause: system prompt was sent as `instructions`, defeating caching.
- **Vertex Claude `/v1/messages` prompt cache misses on tool-loop rounds** ([Issue #50070](https://github.com/BerriAI/litellm/issues/50070)) — LiteLLM emits `messages` before `system`/`tools`, breaking cache hits.
- **Abandoned-stream cancellation** ([PR #51768](https://github.com/BerriAI/litellm/pull/51768)) — a streaming client that hangs up before the first chunk no longer holds its queue slot and provider connection.
- **Health probes evict local-model context** ([Issue #49930](https://github.com/BerriAI/litellm/issues/49930)) — probes cause context eviction, inflating latency near the 262K limit on local qwen3.8-flash-next.
- **CI stability:** usage-based-v2 RPM test clock pinned ([PR #52746](https://github.com/BerriAI/litellm/pull/52746)); lint and full unit checks restored ([PR #52726](https://github.com/BerriAI/litellm/pull/52726)).

## 5. Stability & Regressions

Ranked by severity:

1. **Read-replica never self-heals** ([Issue #52284](https://github.com/BerriAI/litellm/issues/52284), closed) — with `DATABASE_URL_READ_REPLICA` set, a reconnect cancelled by its 2s timeout leaves the reader Prisma engine dead permanently; reads (key auth, `/health/readiness`, budget jobs) never fall back to the writer.
2. **Failed requests bypass RPM limits** ([Issue #21312](https://github.com/BerriAI/litellm/issues/21312), open) — failed virtual-key requests don't count toward RPM unless replied to successfully; a rate-limit-bypass vector for abusive clients.
3. **`prisma_migration --skip_server_startup` crashes** ([Issue #49680](https://github.com/BerriAI/litellm/issues/49680), open) — unguarded `import psycopg` in `ensure_request_log_indexes`; migration job exits when `libpq` is unavailable.
4. **Priority routing groups ignore deployment TPM limits** ([Issue #52548](https://github.com/BerriAI/litellm/issues/52548), open) — under `usage-based-routing-v2`, limits are honored via `order` but not via priority routing groups, causing early failover on RPM.
5. **Helm migration Job OOMKilled at 1Gi** ([Issue #47076](https://github.com/BerriAI/litellm/issues/47076), closed) — `prisma_migration.py` runs `prisma generate` after migrating (~1.15 GiB peak) in the non_root image; fix not yet confirmed in this batch.
6. **Parallel tool-call arguments dropped when streaming `/v1/messages`** for the `chatgpt`/Codex provider ([Issue #45348](https://github.com/BerriAI/litellm/issues/45348), open) — non-streaming works; streaming emits empty `input` with no `input_json_delta` events.
7. **`chatgpt` provider strips `parallel_tool_calls`** — every `gpt-5.6-*` request via Codex CLI fails with hard 400 ([Issue #38612](https://github.com/BerriAI/litellm/issues/38612), closed).
8. **`config.yaml` missing from OpenAPI spec** ([Issue #16623](https://github.com/BerriAI/litellm/issues/16623), open, 8 comments) — docs reference `/#/config.yaml` but it no longer exists in Swagger.
9. **Stream `response.failed` becomes HTTP 200 + empty finish** ([Issue #36768](https://github.com/BerriAI/litellm/issues/36768), closed) — fallbacks never run.
10. **Lens worker aborts active analysis claims on SIGTERM** ([Issue #52558](https://github.com/BerriAI/litellm/issues/52558), closed) — interrupts claims during Kubernetes replica removal.
11. **SambaNova flattens content lists** ([Issue #37609](https://github.com/BerriAI/litellm/issues/37609), open) — `image_url` parts never reach the API; vision models return HTTP 200 as if nothing was attached.
12. **`os.environ/` substitution in numeric params yields `str`** ([Issue #36095](https://github.com/BerriAI/litellm/issues/36095), closed) — `weight`/`rpm`/`tpm` set via env var crash `simple_shuffle` with `TypeError` on every request.
13. **Custom-auth skips virtual-key max-budget check** ([Issue #45605](https://github.com/BerriAI/litellm/issues/45605), closed) — with `custom_auth_run_common_checks: true`, `_virtual_key_multi_budget_check` is never invoked.
14. **Anthropic cache-creation TTL breakdown not preserved** ([Issue #29998](https://github.com/BerriAI/litellm/issues/29998), open) — Chat Completions usage responses drop cache-write token TTL detail.

## 6. What This Means for Application Developers

- **Pin your version deliberately.** The Gemini breaking change in #52745 is the one to watch before upgrading; if you rely on Gemini/Vertex tool calling, add explicit error handling and fallbacks.
- **Audit prompt caching on `/v1/messages`.** If you route Claude Code, Codex CLI, or Anthropic-format clients through LiteLLM to GPT-6.2 with `store: false`, today's backports restore caching on LTS 1.108, 1.106, and 1.110 — check which line you run.
- **Rate-limit bypass is a real exposure.** If you sell or gate virtual keys by RPM, failed requests currently don't count (#21312). Enforce limits at your own edge until fixed.
- **HA database setups are fragile.** Until #52284 is validated in your version, monitor read-replica connectivity and consider disabling the replica for key auth paths, or verify the fix when it lands.
- **Helm deployments should raise the migration Job memory limit** above 1Gi to avoid OOMKill, especially on the non_root image.
- **Streaming bugs disproportionately affect agentic clients.** Parallel tool-call argument drops (#45348), `parallel_tool_calls` stripping (#38612), and `response.failed` → HTTP 200 (#36768) all silently degrade agent behavior — prefer non-streaming or add client-side validation if you hit them.

</details>

<details>
<summary><strong>Unsloth</strong> — <a href="https://github.com/unslothai/unsloth">unslothai/unsloth</a></summary>

# Unsloth Digest — 2026-11-19

## 1. Today's Highlights

No new releases landed in the last 24 hours, but the PR queue shows heavy activity on Unsloth Studio's diffusion and training stacks: LTX-2.5 LoRA training, AdaLN modulation precomputation, and nf4 dequant cache budgeting all saw new work. On the issue tracker, the most consequential reports involve ROCm regressions on RDNA4/gfx1200 and Strix Halo (gfx1151), where QLoRA crashes with illegal memory access and `--fit on` mis-plans VRAM. Several long-standing Studio UX bugs (MCP OAuth token reuse, KV cache invalidation on computer-use, compaction policy drift between local and API models) were closed.

## 2. Releases & Breaking Changes

None in the last 24h. The most recent user-visible version in circulation remains `0.1.919-beta` (referenced throughout issues filed 2026-11-18).

## 3. New Model & Hardware Support

- **LTX-2.5 LoRA training in Studio** — PR [#18386](https://github.com/unslothai/unsloth/pull/18386) adds LTX-2.5 to the trainable diffusion families, routing captions through the Gemma 4 worker and baking output into the distilled Video page model. Previously only `ltx-2` was trainable and local LTX-2.5 folders were refused.
- **Multi-file audio.cpp packages** — PR [#18413](https://github.com/unslothai/unsloth/pull/18413) teaches Studio to load hub repos published as multi-file packages (main GGUF + codec/vocoder GGUFs) from runtime model specs.
- **Distilled image checkpoints** — PR [#18280](https://github.com/unslothai/unsloth/pull/18280) makes HunyuanImage 2.1 distilled, Anima-Turbo, and Chroma1-Flash run their publishers' steps/guidance rather than inheriting base-model defaults (byte-identical to diffusers).
- **AMD ROCm on Windows** — PR [#18415](https://github.com/unslothai/unsloth/pull/18415) makes `studio/setup.ps1` fail loudly when the pinned ROCm torch trio can't be installed on a supported AMD GPU, instead of printing a single warning and continuing.

## 4. Performance & Optimization

- **FLUX.1 / Qwen-Image AdaLN precompute** — PR [#18342](https://github.com/unslothai/unsloth/pull/18342) precomputes AdaLN modulation rows per scheduler step and keeps modulation weights off the card. Reported **-28% per step on FLUX.1 streamed**, bit-identical output. AdaLN is 27% of FLUX.1 and 33% of Qwen-Image transformer weights.
- **MiniMax-H3-Image text encoder streaming** — PR [#18417](https://github.com/unslothai/unsloth/pull/18417) pins as many encoder layers as host budget allows and streams the rest. On Colab L4 (8 GB, 54 GB system RAM), 2048×2048 new-prompt render drops **82.7 s → 36.7 s**, bit-identical.
- **nf4 dequant cache + checkpointing budget** — PR [#18416](https://github.com/unslothai/unsloth/pull/18416) plans the cache against the checkpointing budget, eliminating a step-2 OOM fallback. Klein 1024 on L4: **11% faster, 5.4 GB lower peak**.
- **INT8 attention routing on Qwen-Image-2.1** — PR [#18384](https://github.com/unslothai/unsloth/pull/18384) (closed) keeps block 0 on its incumbent under Auto, reducing Turbo LPIPS max from 0.270 to 0.076 on L4.
- **ROCm hybrid linear-attention packing** — Issue [#17738](https://github.com/unslothai/unsloth/issues/17738) (closed): `UNSLOTH_EXPERIMENTAL_HYBRID_PACKING=1` now passes the exactness probe on gfx1151 but yields **no net speedup** — step count halves while per-step time roughly doubles.

## 5. Stability & Regressions

Ranked by severity:

1. **QLoRA crash on RDNA4 (gfx1200 / RX 9060 XT)** — Issue [#18403](https://github.com/unslothai/unsloth/issues/18403) (OPEN, updated today): `HIP error: an illegal memory access` in three fused kernels. Plain PyTorch/PEFT has no SDPA kernel for this arch. No fix PR yet; blocks QLoRA on RDNA4 entirely.
2. **`--fit on` mis-plans memory on Strix Halo (gfx1151)** — Issue [#18316](https://github.com/unslothai/unsloth/issues/18316) (OPEN): plans ~52 GiB device memory on a 64 GB APU; system RAM climbs 43 → 57 GB while VRAM shows ~9 GB free. Reporter cross-checked #18001, #13947, #8178, #11475 — none match.
3. **GPU driver 620.70.06 / CUDA 13.5 breaks GPU detection** — Issue [#18218](https://github.com/unslothai/unsloth/issues/18218) (CLOSED): "unavailable vRAM", no model loads. RTX 3060 on Debian.
4. **`fast_qk_norm_rope` fallback broadcast bug** — Issue [#18160](https://github.com/unslothai/unsloth/issues/18160) (CLOSED): fallback path returns original `position_ids` before expanding `[1, seq_len]` → `[batch, ...]`, causing wrong rows and out-of-bounds reads. Affects correctness of any model hitting the fallback.
5. **Compaction regressions in API/provider connections** — Issues [#18189](https://github.com/unslothai/unsloth/issues/18189), [#18185](https://github.com/unslothai/unsloth/issues/18185), [#18306](https://github.com/unslothai/unsloth/issues/18306): API-connected models lost the local compaction policy (whole-turn eviction + searchable archive); oversized tool results are dropped as "(output omitted…)" causing infinite retry loops; compaction generates a summary then fails to write it. All three from the same reporter (Dhrhciebcy) — cluster suggests a shared root cause in the provider connection layer.
6. **`unsloth eval` mis-scores JSON array strings** — Issue [#18246](https://github.com/unslothai/unsloth/issues/18246) (CLOSED): counts individual array elements as correct and gives the full array string zero, inverting exact-match scores for structured output.
7. **MCP OAuth token not reused** — Issue [#18164](https://github.com/unslothai/unsloth/issues/18164) (CLOSED): consent prompt shown on every connection instead of reusing stored token.
8. **KV cache invalidation after ~8 computer-use calls** — Issue [#18231](https://github.com/unslothai/unsloth/issues/18231) (CLOSED): `MAX_TOTAL_MODEL_IMAGES = 8` in `mcp_images.py`.
9. **Packing drops tokens in long raw-text rows** — PR [#18408](https://github.com/unslothai/unsloth/pull/18408) (OPEN): with packing on (default), every document was silently cut at context length. Training correctness issue for long-document fine-tunes.
10. **Windows composer blur regression** — PR [#18032](https://github.com/unslothai/unsloth/pull/18032) (OPEN): thread fade mask blocks glass blur on the new chat composer on Windows; macOS unaffected.

## 6. What This Means for Application Developers

- **ROCm users on RDNA4 and Strix Halo should pin to a known-good driver/stack** and avoid the `--fit on` auto-planner on APUs until #18316 lands. The gfx1200 QLoRA crash (#18403) has no workaround short of switching to plain PyTorch/PEFT, which itself lacks SDPA on that arch — treat RDNA4 QLoRA as blocked.
- **If you build agents on API/provider connections**, the compaction cluster (#18189, #18185, #18306) is the highest-priority watch item: tool-result truncation feeding an infinite retry loop is a production-grade failure mode. Local models on the same tasks are unaffected, so a short-term mitigation is to route tool-heavy workloads to local models.
- **Diffusion and video fine-tuning on Studio just got materially faster** (AdaLN precompute, MiniMax-H3-Image streaming, nf4 budget planner), all bit-identical, so no output-validation cost to adopting them once merged.
- **Grammar/JSON-schema enforcement on `/v1/chat/completions`** is currently silently dropped — PR [#18385](https://github.com/unslothai/unsloth/pull/18385) fixes this. Until it lands, structured-output clients should use `/v1/completions` or validate responses client-side.
- **Long-document fine-tunes with packing enabled** may be silently training on truncated rows (#18408). Verify your effective token coverage before trusting loss curves.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*