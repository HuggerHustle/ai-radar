# AI Infrastructure Digest 2026-11-03

> Generated: 2026-11-03 02:52 UTC | Projects covered: 6

- [vLLM](https://github.com/vllm-project/vllm)
- [SGLang](https://github.com/sgl-project/sglang)
- [llama.cpp](https://github.com/ggml-org/llama.cpp)
- [Ollama](https://github.com/ollama/ollama)
- [LiteLLM](https://github.com/BerriAI/litellm)
- [Unsloth](https://github.com/unslothai/unsloth)

---

## Cross-Project Comparison

# Cross-Project Comparison Report — AI Infrastructure Ecosystem
**Date: 2026-11-03**

---

## 1. Ecosystem Overview

Today's digest cycle shows an ecosystem in a **consolidation-and-hardening phase** rather than an expansion one. Serving engines (vLLM, SGLang) are shipping large releases dominated by MoE model onboarding and backend-specific kernel fusion, while local runtimes (llama.cpp, Ollama) are churning through correctness and hybrid-architecture stability bugs. The clearest cross-cutting pain point is **determinism**: at least five projects report non-reproducible outputs at `temperature=0`, broken batch invariance, or spec-decode divergence — a serious gap for agent, eval, and replay workloads. Meanwhile, **layer boundaries are blurring**: vLLM and SGLang both have Rust server fronts in flight, LiteLLM is rewriting its gateway core in Rust, and Ollama is stabilizing an OpenAI-compat surface — all converging on the same "gateway + engine" abstraction. The optimization frontier has shifted decisively toward **MoE expert caching, FP8/FP4 quantization, ROCm/SM120 kernel coverage, and P/D disaggregation**, not raw dense-model throughput.

---

## 2. Activity Comparison

| Project | Issues (open/highlighted) | PRs (active/landed) | Release Status |
|---|---|---|---|
| **vLLM** | 12 ranked regressions; 2 feature trackers >100 comments | ~20 highlighted PRs; stacked BI campaign (10+ PRs) | **v0.33.0 shipped** (927 commits, 389 contributors) |
| **SGLang** | 10 ranked issues; CI flakiness #42752 = 165 comments | Heavy across Rust `api.v1` migration, ROCm kernels | **v0.5.23 shipped** (1,007 PRs, 257 contributors) |
| **llama.cpp** | 8 ranked regressions; spec-decode divergence #25618 (36 comments) | 3-way MoE cache race (#30966/#31233/#31286) | **9 releases** (b12050–b12063) |
| **Ollama** | 9 ranked stability items; cloud support #19461 unresolved | Fix PRs for logs, Unix sockets, CUDA packaging | **v0.40.14-rc0** in flight |
| **LiteLLM** | 10 ranked; Rust migration #31263 (33 comments, 21 👍) | Spend accounting, Azure auth, streaming fixes | **No release in 24h** |
| **Unsloth** | 13 ranked regressions (Studio-heavy) | Block Swap + MoE/FP8 unblock cluster | **No release in 24h** |

**Takeaways:** vLLM and SGLang traded release cadence for scale (927 and 1,007 commits respectively). llama.cpp shipped the highest number of discrete releases (9) but each is narrow. Ollama is in RC stabilization. LiteLLM and Unsloth are in pure PR-list mode — no releases — which typically precedes a major cut (Rust gateway for LiteLLM; Block Swap unlock for Unsloth).

---

## 3. Model Support Race

| Model / Arch | vLLM | SGLang | llama.cpp | Ollama | Unsloth |
|---|---|---|---|---|---|
| **Beam-1.0 / Reflection Beam-1.0 (501B MoE)** | ✅ day-0 (v0.33.0) | ✅ v0.5.23 | — | — | — |
| **Muse Spark Open** | — | ✅ v0.5.23 (cookbook) | — | — | — |
| **Clover (MoE)** | — | — | ✅ b12060 | — | — |
| **Yandex AliceAI-80B-A3B** | ✅ v0.33.0 | — | — | — | — |
| **Recursive Flint (40B MoE)** | ✅ v0.33.0 | — | — | — | — |
| **Pocket TTS (kyutai)** | — | — | ✅ b12061 | — | — |
| **Chatterbox TTS** | — | — | 🟡 WIP | — | — |
| **MiMo V2.6** | — | — | — | 🟡 PR open | — |
| **LFM3 / LFM3-1.7B** | — | — | — | ❌ LFM2 token bug | 🟡 targeted |
| **Qwen3.8-Flash-Next (FP8)** | 🟡 SM80 GEMM, ROCm tracker | 🟡 gfx950 tracker | — | ❌ load failure (#19459) | 🟡 Block Swap unblock |
| **DeepSeek-V4.1-Flash** | 🟡 EPD landed; **SM120/SM80 broken** | — | — | — | 🟡 template fix |
| **Laya / Inception Mercury** | — | — | — | — | ✅ Studio presets |

**Assessment:**
- **vLLM leads on large frontier MoE day-0** — Beam-1.0, AliceAI-80B, Flint all landed same-day. It is the only project with all three of today's headline frontier MoEs.
- **SGLang leads on breadth of new AR/VLM families** (Muse Spark Open + Beam-1.0 with published cookbooks) and is the only one actively onboarding **masked-LM embedding checkpoints** (#41846) — a consolidation play for RAG stacks.
- **llama.cpp owns the long tail**: niche MoE (Clover) and TTS (Pocket TTS, Chatterbox WIP) that no serving engine will touch.
- **Ollama is behind on hybrid/SSM support** — Qwen3.8-27B GGUFs fail to load outright, and LFM2 has a silent token-loss bug. This is the weakest model-support position of the six.
- **Unsloth's race is about *training* frontier MoEs on limited hardware**, not serving — Block Swap is the moat.

---

## 4. Performance Frontier

Optimization effort today clusters into five distinct battlegrounds:

**a) MoE expert caching / offloading — the hottest area**
- llama.cpp: three competing implementations (#31233 ClassLRU claims **+6% decode on QFN, +7% GLM, 8% fewer uploads**; #30966 CPU fallback; #31286 auto CPU-share).
- vLLM: MoE expert offloading RFC (#38256) — CPU-pinned weights + LFRU eviction.
- SGLang: Intel XPU paged-experts RFC (#46520).
- Unsloth: Block Swap for MoE FP8 — **180B model on a single 95 GiB GPU** (#15632).

**b) KV cache & attention memory**
- llama.cpp's **`flash_attn_ext_rows` (b12059)** is the day's single most impactful serving win — cuts the multi-sequence unified-KV penalty. Companion HIP VGPR spill fix (#31550).
- vLLM ships a KV offload fix preserving SWA null-page offsets (#65279).
- SGLang makes HiCache `block_quota` configurable after finding a default of 2 was throttling MI355X write-back (#48042).

**c) Quantization kernels (FP8/FP4/MXFP4)**
- SGLang leads on fusion granularity: 1x128 FP8 input-quant fused into RMSNorm/SiLU (#48043), quantize-into-RMSNorm for per-channel FP8 attention (#34502).
- llama.cpp lands CUDA NVFP4 fused gate/up + GLU MMQ (#31296).
- vLLM targets SM80 skinny GEMM for decode linears (#64636) and Quark MXFP4 on gfx950 (#59575).

**d) Distributed / disaggregated serving**
- vLLM is the clear leader: elastic EP rank parking (#64155), DeepSeek-V4.1 image-metadata-only EPD (#62802), `/inference/v1/generate` RFC (#56851).
- SGLang: disaggregation leak fix (#47100), Rust server idle attention-DP rank parking (#46636).
- llama.cpp: NCCL multi-node TP in progress (#28967) — earliest stage.

**e) Kernel fusion for AMD/ROCm**
- SGLang owns this frontier this week: GLM-5 MLA chain as Gluon kernels on gfx950 (#46486), Qwen3-Next fused Q/K GemmaRMSNorm + partial RoPE (#48044), replacing five HIP launches per layer with one Triton kernel.
- vLLM's ROCm work is tracking-oriented (MI355X mono-decode #61498, gfx950 tracker #59575).

**Verdict:** llama.cpp wins on single-machine KV efficiency, SGLang on ROCm kernel fusion, vLLM on disaggregated/distributed serving, Unsloth on memory-constrained training.

---

## 5. Layer Positioning

| Project | Layer | Core Job | Where It Wins | Where It Hurts |
|---|---|---|---|---|
| **vLLM** | **Serving engine** (datacenter) | Throughput-optimized inference, P/D disaggregation | Frontier MoE day-0, elastic EP, multimodal EPD | SM120/SM80 correctness gaps; determinism |
| **SGLang** | **Serving engine** (datacenter, AMD-leaning) | High-throughput serving + structured/Rust frontend | Model breadth, AMD kernel fusion, cookbooks | CI flakiness; hybrid Mamba OOM under bursts |
| **llama.cpp** | **Local/edge runtime** (GGML core) | Universal CPU/GPU/accelerator inference | Niche archs, TTS, Vulkan/SYCL breadth | Multi-GPU pathological cases; SYCL regressions |
| **Ollama** | **Local runtime + gateway** (consumer DX) | One-command local LLM serving + cloud tier | Ergonomics, OpenAI-compat surface | Hybrid model gaps; OpenAI-compat edge cases; cloud support |
| **LiteLLM** | **LLM gateway** (control plane) | Multi-provider routing, budgets, rate limits, MCP | Provider breadth, spend governance | Rate-limit/budget correctness; Rust rewrite risk |
| **Unsloth** | **Fine-tuning framework** (+ Studio app) | Efficient QLoRA/LoRA training | Memory-constrained MoE/FP8 training | Studio UX/persistence bugs |

**Boundary observations:**
- **vLLM and SGLang are colliding** — both pursuing Rust frontends (#44280 vLLM, #45816 SGLang) and unifying their serving APIs. Expect API convergence pressure on downstream users in 2027.
- **Ollama is drifting from "local runtime" toward "gateway"** — Unix sockets (#19467), OpenAI-compat fixes, and cloud billing. It competes with LiteLLM at the low end but not the enterprise tier.
- **LiteLLM is the only pure control-plane project** — its Rust migration (#31263, sub-1ms target) is the bet that gateways must be near-zero-overhead to survive engine-embedded gateways.
- **Unsloth is orthogonal** — it feeds trained weights into vLLM/SGLang/Ollama download flows rather than competing for inference.

---

## 6. Trend Signals

**Trend 1 — Determinism is the new correctness frontier (and it's broken).**
vLLM (#54521, #53257, #5543, #39096), SGLang (#39597 FlashInfer autotune + DFLASH), llama.cpp (#25618 spec-decode divergence on quantized targets, #28527 quantized K-cache), and LiteLLM streaming chunk loss (#30765, #25214) all show non-reproducible outputs. **This is now ecosystem-wide.** No engine offers a default determinism guarantee.

**Trend 2 — MoE is the dominant serving workload; caching is the battleground.**
Every serving project has active MoE cache work. The single-GPU 180B FP8 training claim from Unsloth and llama.cpp's ClassLRU double-digit gains signal the industry is optimizing *memory hierarchy* as aggressively as FLOPs.

**Trend 3 — Rust is eating the serving control plane.**
vLLM (`VLLM_USE_RUST_FRONTEND`), SGLang (`SGLANG_RUST_SERVER=1`, `api.v1`), and LiteLLM (full gateway migration) all have Rust fronts in flight. This is a coordinated industry migration away from Python in the request path.

**Trend 4 — Disaggregated P/D is graduating from experiment to target.**
vLLM's `/inference/v1/generate` RFC, DeepSeek-V4.1 EPD, and MooncakeConnector work, plus SGLang's disaggregation leak fix, mean P/D is becoming a first-class deployment shape. Multimodal + Kimi-K3-class workloads are the drivers.

**Trend 5 — Quantized targets + speculative decoding are silently unsafe.**
llama.cpp #25618 and vLLM #40756 (MTP spec decode IMA), #41530 (TP worker hang with MTP) show the spec-decode + quantization intersection is a correctness minefield. Ngram speculation is reportedly safe; **draft-model speculation on quantized targets is not output-equivalent.**

**Trend 6 — AMD/ROCm is now a first-class optimization target, not a port.**
SGLang's gfx950 Gluon kernel campaign is the most aggressive per-arch optimization in today's batch. vLLM's ROCm work is tracker-heavy but present. This is a shift from "ROCm works" to "ROCm wins on specific models."

**Trend 7 — Gateway correctness lags gateway features.**
LiteLLM's rate-limit counter (#49675) and cold-spend 422 (#47676) bugs, MCP `is_error` drop (#49359), and pass-through ID stripping (#49479) mean **gateways are feature-rich but not yet safe as hard policy enforcement points.** Add application-side backstops.

### What Agent / Application Developers Should Watch

1. **Don't assume deterministic replay.** If you run evals, agent trajectory replay, or output caching, pin to known-good (GPU, quant, attention-backend) triples and test `temperature=0` per configuration. Batch invariance remains opt-in on vLLM.
2. **Hybrid/SSM models (Qwen3.5/3.8, Qwen3-Next, GLM-5.3-Flash) are not production-ready on local runtimes** — Ollama VRAM over-prediction (#19463) and GGUF load failures (#19459), SGLang Mamba cache OOM (#47916). Pin and test before shipping.
3. **Disable draft-model speculation on quantized targets** if output equivalence matters (llama.cpp #25618); ngram speculative decoding is unaffected.
4. **Gateways are not policy engines yet** — LiteLLM budget and TPM counters can under- and over-reject. Add app-side rate limits and spend caps.
5. **Plan for Rust frontend migration.** vLLM/SGLang/LiteLLM will change request-path behavior in the coming quarters; pin versions and abstract your client layer.
6. **MoE cost curve is bending fast** — llama.cpp ClassLRU, Unsloth Block Swap, and vLLM expert-offload RFC are all in flight. Re-benchmark MoE economics on your hardware in Q1.
7. **Malformed input can kill servers** — llama.cpp `grammar_triggers` (#31478) asserts-and-aborts the whole server. Sandbox untrusted clients on any public-facing endpoint regardless of stack.

---

**Bottom line:** The ecosystem is shipping more models and more kernels than ever while accumulating a hidden correctness debt around determinism and quantized-spec-decode interactions. Frontier MoE serving is a two-horse race (vLLM, SGLang); local runtimes are consolidating around stability; gateways and training frameworks are mid-migration. Teams making 2027 infrastructure bets should assume Rust request paths, treat determinism as a per-configuration property, and architect for disaggregated P/D as the default serving topologies for multimodal and frontier-MoE models.

---

## Per-Project Reports

<details>
<summary><strong>vLLM</strong> — <a href="https://github.com/vllm-project/vllm">vllm-project/vllm</a></summary>

# vLLM Digest — 2026-11-03

## Today's Highlights
vLLM shipped **v0.33.0** (927 commits / 389 contributors), headlined by day-0 support for large MoE models (Reflection Beam-1.0 501B, Yandex AliceAI-Foundation-80B, Recursive Flint 40B). The day's GitHub activity is dominated by a large **batch-invariance (BI) landing campaign for DeepSeek-V4.1** (10+ stacked PRs from @aoshen02's #62365) and a wave of **SM80/SM120 (A100/Blackwell workstation) performance and correctness issues** that remain unfixed. Determinism at `temperature=0` and Batch Invariance continue to be the most active correctness themes.

## Releases & Breaking Changes
- **v0.33.0rc3 → v0.33.0**: 927 commits, 389 contributors (122 new). Regular release; no migration notes included in the provided changelog excerpt. [Release](https://github.com/vllm-project/vllm/releases)
- **Rust frontend still experimental** — tracking issue #44280 aims for parity with the Python API server (`VLLM_USE_RUST_FRONTEND=1`); not yet production-equivalent. [#44280](https://github.com/vllm-project/vllm/issues/44280)
- **`/inference/v1/generate` RFC (Kimi-K3)** proposes request-level text and derender output on the disaggregated serving path — a potential API-shape change for P/D deployments; open for discussion. [#56851](https://github.com/vllm-project/vllm/issues/56851)

## New Model & Hardware Support
- **Reflection Beam-1.0** (501B MoE, 23B active) with DFlash2 drafter — landed in v0.33.0. [#62074](https://github.com/vllm-project/vllm/pull/62074)
- **Yandex AliceAI-Foundation-80B-A3B** and **Recursive Flint** (40B MoE, 2.5B active) — landed in v0.33.0. [#57963](https://github.com/vllm-project/vllm/pull/57963) · [#62938](https://github.com/vllm-project/vllm/pull/62938)
- **Rust frontend / Whisper**: `WhisperGenerationMixin.generate` port (`generate_with_fallback`) adds proper HF-compatible long-form generation. [#58274](https://github.com/vllm-project/vllm/pull/58274)
- **DeepSeek-V4.1 EPD (image metadata-only)**: publish/reconstruct `llm_grid` so P/D can skip duplicate image preprocessing. [#62802](https://github.com/vllm-project/vllm/pull/62802)
- **SM80 (A100/A800) gap**: DeepSeek-V4-Flash / V4-Flash-0731 **still does not run on Ampere** — high-engagement feature request (127 comments, 16 👍). [#50576](https://github.com/vllm-project/vllm/issues/50576)

## Performance & Optimization
- **Qwen3.8-Flash-Next SM80 TP=8 skinny GEMM plans**: adds A100 decode-linear plans; previously all decode linears fell back to cuBLASLt split-K + `splitKreduce`. [#64636](https://github.com/vllm-project/vllm/pull/64636)
- **Kimi-K3 Mono decode on MI355X (ROCm)**: extends the MonoKernel to ordinary autoregressive decode without spec decoding (stacked on #60683). [#61498](https://github.com/vllm-project/vllm/pull/61498)
- **ROCm gfx950 / MI355X Qwen3.8-Flash-Next tracker**: Quark MXFP4 optimization plan (GatedDeltaNet ×36, QSA ×12, MXFP4 MoE). [#59575](https://github.com/vllm-project/vllm/issues/59575)
- **MRV2 spec decode**: CUDA graph capture/replay for draft-model speculators via shared `AutoRegressiveSpeculator` base. [#60989](https://github.com/vllm-project/vllm/pull/60989)
- **MoE expert offloading RFC**: CPU-pinned weights + fixed GPU cache with LFRU eviction and cross-layer prediction; PR 1 open (#37190). [#38256](https://github.com/vllm-project/vllm/issues/38256)
- **Elastic EP**: park scale-up ranks so they can be checkpointed pre-join as any DP rank/world size. [#64155](https://github.com/vllm-project/vllm/pull/64155)

## Stability & Regressions (ranked by severity)
1. **SM120 CUDA graph capture broken for DeepSeek-V4.1-Flash**: 8× RTX PRO 6000 Blackwell with `--enforce-eager` gives extremely low decode throughput; graphs unusable. No fix PR referenced. [#56892](https://github.com/vllm-project/vllm/issues/56892)
2. **DeepSeek-V4-Flash hangs with `FULL_AND_PIECEWISE` + chunked prefill on GB10 (SM12.x)** after ~6 requests. No fix PR referenced. [#40969](https://github.com/vllm-project/vllm/issues/40969)
3. **Recurring CUDA kernel hang on 2× DGX Spark GB10 (sm_12.1)** with MiniMax-M2.7-NVFP4, TP=2 multi-node — marked *unstale*, still open. [#41725](https://github.com/vllm-project/vllm/issues/41725)
4. **MTP spec decode illegal memory access** on long sequences (Qwen3.6-27B-FP8, `num_spec_tokens=5`). [#40756](https://github.com/vllm-project/vllm/issues/40756)
5. **TP worker hang → EngineDeadError** (`sample_tokens` RPC timeout) on DeepSeek-V4-Pro, TP=8 + MTP spec decode. [#41530](https://github.com/vllm-project/vllm/issues/41530)
6. **Non-determinism at `temperature=0` with Qwen3.8-Flash-Next (FP8)** when prompt nears `indexer_budget` — persistent_topk in prefill; 5/5 identical requests diverge. [#54521](https://github.com/vllm-project/vllm/issues/54521)
7. **DeepSeek-V4-Flash non-determinism at `temperature=0`**, rate scales with concurrency. [#53257](https://github.com/vllm-project/vllm/issues/53257)
8. **Prefix-caching inconsistency** (long-standing; `keep-open`): first request differs from subsequent identical ones under v1. [#5543](https://github.com/vllm-project/vllm/issues/5543) · [#40896](https://github.com/vllm-project/vllm/issues/40896)
9. **Batch invariance broken under torch.compile / CUDA graphs on SM<90** (Ampere/Ada). [#39096](https://github.com/vllm-project/vllm/issues/39096)
10. **Scheduler bug fix in progress**: do not split a multimodal item when a prefix cache hit ends inside it (`disable_chunked_mm_input`). [#65271](https://github.com/vllm-project/vllm/pull/65271)
11. **KV offload fix in progress**: preserve SWA null-page offsets after store retry to prevent page misalignment. [#65279](https://github.com/vllm-project/vllm/pull/65279)
12. **Triton 3.6 breaks MoE kernel config autotuning** (stale). [#37191](https://github.com/vllm-project/vllm/issues/37191)

## What This Means for Application Developers
- **Determinism is not yet a default guarantee.** If your product relies on reproducible outputs (evals, regression tests, agent replay, caching), set `temperature=0` only on hardware/configs explicitly known-good; assume non-determinism under prefix caching, MTP spec decode, and sparse-attention cutoff boundaries (#5543, #54521, #53257). Treat Batch Invariance as opt-in and validate per (GPU, quantization, attention backend) triple.
- **Blackwell workstation (SM120) is not graph-safe yet.** Teams on RTX PRO 6000 Blackwell with DeepSeek-V4.1-Flash should stay on established CUDA/GPU combos or plan for degraded decode throughput (#56892).
- **Ampere/A100 users are on a shrinking happy path.** DeepSeek-V4-Flash is unavailable (#50576); the new SM80 skinny GEMM plans (#64636) hint that performance parity work is real but targeted, not general.
- **P/D disaggregation is maturing**: the `/inference/v1/generate` RFC (#56851) and DeepSeek-V4.1 image-metadata-only EPD (#62802) plus MooncakeConnector work (#60523) signal that the disaggregated path is becoming a first-class, cross-platform serving target — worth designing for if you serve multimodal or Kimi-K3-class models.
- **Multi-node/elastic deployments are getting safer**: ranking/checkpoint parking for elastic EP (#64155) reduces the operational pain of adding replicas without full cluster restarts.

</details>

<details>
<summary><strong>SGLang</strong> — <a href="https://github.com/sgl-project/sglang">sgl-project/sglang</a></summary>

# SGLang Digest — 2026-11-03

## 1. Today's Highlights

SGLang shipped **v0.5.23**, a massive release bundling 1,007 PRs from 257 contributors, headlined by two new model families (Muse Spark Open and Beam-1.0). Activity remains heavy across three fronts: a push to unify the generation API behind the Rust server's `api.v1` surface ([#45816](https://github.com/sgl-project/sglang/issues/45816)), a broad AMD/ROCm kernel-fusion campaign, and continued stabilization of hybrid Mamba/attention models. CI flakiness ([#42752](https://github.com/sgl-project/sglang/issues/42752), 165 comments) is the single highest-engagement open thread, signaling that test infrastructure reliability is now a first-class concern as the project scales.

## 2. Releases & Breaking Changes

- **v0.5.23 released** — 1,007 PRs from 257 contributors. New model support (see below) and continued kernel/backend work.
- **[RFC] Complete migration to shared `api.v1` backend API** ([#45816](https://github.com/sgl-project/sglang/issues/45816)) — Open RFC to unify generation behind the Rust server's `api.v1.Generate` schema. Migrations in flight for `sgl-processor` ([#46031](https://github.com/sgl-project/sglang/pull/46031), [#46432](https://github.com/sgl-project/sglang/pull/46432)) and `sgl-router` ([#45808](https://github.com/sgl-project/sglang/pull/45808)). No config changes required for end users yet, but Python/Rust serving surfaces will converge.
- **[Feat] linker: runtime attach/detach of unified cache external linker** ([#44526](https://github.com/sgl-project/sglang/pull/44526)) — UnifiedRadixCache external linkers can now be detached and re-attached on a running idle server (e.g., for external-store maintenance). Linker mode/backend remain launch-time declarations.

## 3. New Model & Hardware Support

**New models (v0.5.23):**
- **Muse Spark Open** (LLM/VLM) — [cookbook](https://docs.sglang.io/cookbook/autoregressive/Meta/MuseSparkOpen); Miles RL serving-side weight-update support being ported ([#48045](https://github.com/sgl-project/sglang/pull/48045)).
- **Beam-1.0** (LLM/VLM) — cookbook linked in release notes.

**In progress:**
- **BERT / XLM-R masked-LM checkpoints as embedding models** ([#41846](https://github.com/sgl-project/sglang/pull/41846)) — `XLMRobertaForMaskedLM` and `BertForMaskedLM` exports currently rejected; this PR registers them.
- **Intel XPU paged-experts RFC** ([#46520](https://github.com/sgl-project/sglang/issues/46520)) — proposes Lookahead Expert Scheduling, SSD tier for iGPU, and single-GPU MoE offload building on the Paged Experts core.
- **CPU torch.compile graphs on Intel AMX** ([#44394](https://github.com/sgl-project/sglang/pull/44394)) — static prefill/decode bucket graphs plus dynamic-shape fallback.

**Quantization:**
- ModelOpt NVFP4 NextN drafts now preserved when checkpoint sets `quantized_mtp: true` ([#44760](https://github.com/sgl-project/sglang/pull/44760)) — fixes packed-weight 4096-vs-2048 shape mismatch.

## 4. Performance & Optimization

- **[AMD/gfx950] GLM-5 decode MLA chain as Gluon kernels** ([#46486](https://github.com/sgl-project/sglang/pull/46486)) — collapses three kernels per layer (q-absorb+RoPE+fp8 KV write, split-K sparse MLA, fp8 value-absorb) on MI355X.
- **[AMD/gfx950] Qwen3-Next fused Q/K GemmaRMSNorm + partial RoPE** ([#48044](https://github.com/sgl-project/sglang/pull/48044), [#47052](https://github.com/sgl-project/sglang/pull/47052)) — replaces five HIP launches per full-attention layer with one Triton kernel.
- **[AMD/gfx950] Fuse 1x128 FP8 input quant into RMSNorm and SiLU-and-mul** ([#48043](https://github.com/sgl-project/sglang/pull/48043)) — removes standalone quant kernels around block-FP8 linears.
- **[AMD] Fuse quantize into RMSNorm for per-channel dynamic FP8 attention** ([#34502](https://github.com/sgl-project/sglang/pull/34502)) — validated on MI355X with Kimi-K2.7-Code-MXFP4.
- **[NVIDIA/SM120] fused-A GEMM K-alignment relaxed 1024 → 256** ([#47898](https://github.com/sgl-project/sglang/pull/47898)) — DeepSeek-style MLA models with hidden sizes 3584/2560 (previously ineligible) can now use the CuTe DSL kernel.
- **[AMD] HiCache `block_quota` for all-layer D2H backup made configurable** ([#48042](https://github.com/sgl-project/sglang/pull/48042)) — default of 2 was capping MI355X throughput on write-back eviction copies.
- **Adaptive Speculative Decoding roadmap** ([#23705](https://github.com/sgl-project/sglang/issues/23705), 9 👍) — targets agentic/mixed workloads where acceptance rate swings between phases; deep speculation wastes work in low-acceptance regimes.
- **GLM-5.3-Flash Hopper (SM90) optimization tracker** ([#45373](https://github.com/sgl-project/sglang/issues/45373)) and **[ROCm] Qwen3.8-Flash-Next gfx950/MI355X tracker** ([#44304](https://github.com/sgl-project/sglang/issues/44304)) both active.

## 5. Stability & Regressions

Ranked by severity:

1. **CI flakiness tracker** ([#42752](https://github.com/sgl-project/sglang/issues/42752), OPEN, 165 comments) — Recurring NVIDIA `PR Test Base`/`PR Test Extra` failures while babysitting PRs. Highest-traffic issue in the tracker; blocks merge velocity.
2. **Mamba cache OOM under parallel admission bursts** ([#47916](https://github.com/sgl-project/sglang/issues/47916), OPEN, new) — `MambaPool.copy_from` gathers all source temporal states into one temporary `(n × state_size)` tensor; fires on hybrid models (GLM-5.3-Flash). No fix PR yet.
3. **Hybrid Mamba + EAGLE KV-sizing misleads** ([#47830](https://github.com/sgl-project/sglang/issues/47830), OPEN, new) — Error message advises raising `--mem-fraction-static` when the Mamba state cache is the actual constraint. No fix PR yet.
4. **DSpark draft query width wrong on FA3/FA4 with `sample_from_anchor=False`** ([#46476](https://github.com/sgl-project/sglang/issues/46476), CLOSED) — Resolved.
5. **Greedy decoding non-reproducible across server restarts with FlashInfer autotune** ([#39597](https://github.com/sgl-project/sglang/issues/39597), OPEN) — DFLASH speculative decoding; `temperature=0, top_k=1` yields different text after restart. Determinism-sensitive users should avoid FlashInfer autotune with DFLASH.
6. **MoE deferred finalize unreachable for custom-routing models** ([#39299](https://github.com/sgl-project/sglang/issues/39299), OPEN) — Models needing `trtllm_fp4_block_scale_routed_moe` permanently excluded from the optimization.
7. **`qwen_vl` literal `<image>` in message text → 500** ([#43979](https://github.com/sgl-project/sglang/issues/43979), OPEN) — Mismatch assertion when prompt text contains the token literally. Two comments, no fix PR.
8. **Disaggregation: parked prefill requests leak when decode disappears** ([#47100](https://github.com/sgl-project/sglang/pull/47100), OPEN fix) — With `--disaggregation-decode-allocation-policy prefill_complete`, fix PR fails parked prefill requests on decode departure.
9. **KV-full retraction drops new-token ratio below floor** ([#46496](https://github.com/sgl-project/sglang/pull/46496), OPEN fix) — Fixes [#46495](https://github.com/sgl-project/sglang/issues/46495); affects default OpenAI chat configs with unset `max_tokens`.
10. **Rust server idle attention-DP ranks park on own ring** ([#46636](https://github.com/sgl-project/sglang/pull/46636), OPEN fix) — Up to 1s wake latency under attention DP with `SGLANG_RUST_SERVER=1`.

Batch of `[inactive]` GLM-5.3-Flash and Qwen3.8 bugs closed this cycle (e.g., [#36545](https://github.com/sgl-project/sglang/issues/36545), [#37548](https://github.com/sgl-project/sglang/issues/37548)) — likely triaged rather than fixed; verify on latest `main` before relying on them.

## 6. What This Means for Application Developers

- **Upgrade to v0.5.23** if you serve Muse Spark Open or Beam-1.0 — cookbooks are published and support is fresh.
- **Speculative decoding determinism**: if your app requires reproducible outputs (evals, agent replay, regression tests), audit whether FlashInfer autotune is enabled alongside DFLASH. See [#39597](https://github.com/sgl-project/sglang/issues/39597).
- **Hybrid Mamba models (GLM-5.3-Flash)**: two new memory-safety issues landed today ([#47916](https://github.com/sgl-project/sglang/issues/47916), [#47830](https://github.com/sgl-project/sglang/issues/47830)). Under bursty admission, watch for OOM and don't trust the KV-sizing error text — check Mamba state cache pressure directly.
- **Unified cache operators**: external-store maintenance no longer requires a server restart, thanks to [#44526](https://github.com/sgl-project/sglang/pull/44526).
- **AMD/MI355X deployments**: this week's kernel-fusion wave (GLM-5, Qwen3, Qwen3-Next, block-FP8) should yield measurable decode/prefill wins on gfx950; HiCache users should tune `block_quota` ([#48042](https://github.com/sgl-project/sglang/pull/48042)).
- **Rust server + attention DP**: if using `SGLANG_RUST_SERVER=1`, expect scheduler wake-latency fixes from [#46636](https://github.com/sgl-project/sglang/pull/46636) once merged.
- **Embeddings**: BERT/XLM-R masked-LM serving is coming ([#41846](https://github.com/sgl-project/sglang/pull/41846)) — relevant if you're consolidating embedding and generation behind one gateway.

</details>

<details>
<summary><strong>llama.cpp</strong> — <a href="https://github.com/ggml-org/llama.cpp">ggml-org/llama.cpp</a></summary>

# llama.cpp Digest — 2026-11-03

## 1. Today's Highlights

A high-velocity day with 9 releases (b12050–b12063) landing new model support (Clover MoE, Pocket TTS voices), a major unified KV-cache optimization for multi-sequence serving (`flash_attn_ext_rows`), and continued MoE expert-cache work. On the stability side, a long-running speculative decoding divergence bug (#25618) remains open, while several SYCL/ROCm multi-GPU performance regressions surfaced or were closed. The MoE expert caching effort is converging across multiple competing PRs (#30966, #31233, #31286).

## 2. Releases & Breaking Changes

- **b12063** — `dflash: copy hidden features via device copies` ([PR #31506](https://github.com/ggml-org/llama.cpp/pull/31506))
- **b12061** — `mtmd: Pocket TTS — support for voices without voice cloning` ([PR #31429](https://github.com/ggml-org/llama.cpp/pull/31429))
- **b12060** — `model: add Clover support` (AR-only MoE, causal hybrid attention) ([PR #31306](https://github.com/ggml-org/llama.cpp/pull/31306))
- **b12059** — `llama: flash_attn_ext_rows — more efficient unified kv for multi-seq` ([PR #29510](https://github.com/ggml-org/llama.cpp/pull/29510))
- **b12058** — `imatrix: fix --nextn crash` ([PR #31522](https://github.com/ggml-org/llama.cpp/pull/31522))
- **b12057** — `context: simplify setters` ([PR #29730](https://github.com/ggml-org/llama.cpp/pull/29730)) — API surface cleanup, review for any code touching context setters.
- **b12054** — `ggml-zdnn: share buffers with host` ([PR #31481](https://github.com/ggml-org/llama.cpp/pull/31481))
- **b12053** — `ggml: use vm_allocate instead of posix_memalign on all Apple platforms` ([PR #31437](https://github.com/ggml-org/llama.cpp/pull/31437)) — memory allocation behavior change on macOS/iOS.
- **b12052** — `opencl: add topk_mask` ([PR #31441](https://github.com/ggml-org/llama.cpp/pull/31441))
- **b12050** — `vulkan: improve small-n split-K selection on RDNA3/RDNA4` ([PR #30146](https://github.com/ggml-org/llama.cpp/pull/30146))

No hard breaking changes flagged; b12057 (context setters) and b12053 (Apple allocation strategy) are the two most likely to affect downstream integrators who patch or vendor internals.

## 3. New Model & Hardware Support

- **Clover (MoE, AR-only)** — new GGUF conversion, loader, and causal hybrid attention; reuses shared attention, recurrent-state, MoE, and LoRA helpers. ([PR #31306](https://github.com/ggml-org/llama.cpp/pull/31306))
- **Pocket TTS (kyutai)** — voices **without voice cloning** now supported in mtmd; predefined voices stored as backbone KV state after the voice prompt. ([PR #31429](https://github.com/ggml-org/llama.cpp/pull/31429))
- **Chatterbox TTS** — WIP support being added. ([PR #30993](https://github.com/ggml-org/llama.cpp/pull/30993))
- **SYCL DPAS flash attention** for **quantized KV cache** (q4_0, q8_0) on Xe2: B580, B570, B70, Lunar Lake, Panther Lake; covers decode + 1–31 query tokens incl. spec-decode drafts; head sizes 64/96/128/192. ([PR #31125, closed](https://github.com/ggml-org/llama.cpp/pull/31125))
- **Intel Vulkan FA prefill kernel** in review. ([PR #29357](https://github.com/ggml-org/llama.cpp/pull/29357))
- **NCCL multi-node tensor parallelism** support in progress for CUDA. ([PR #28967](https://github.com/ggml-org/llama.cpp/pull/28967))

## 4. Performance & Optimization

- **`flash_attn_ext_rows` (b12059)** — the headline serving optimization: unified KV cache previously had to filter other sequences' tokens from the mask during multi-seq inference. The new FA extension lets llama.cpp send an optimized representation of used KV rows per sequence, cutting the multi-sequence unified-KV penalty. Backend support determines availability. ([PR #29510](https://github.com/ggml-org/llama.cpp/pull/29510)) A companion CI PR adjusts the HIP VGPR spill ignore list for the new kernel argument. ([PR #31550](https://github.com/ggml-org/llama.cpp/pull/31550))
- **MoE expert cache** is an active three-way race:
  - `run missed experts on CPU` + tuning script ([PR #30966](https://github.com/ggml-org/llama.cpp/pull/30966))
  - **ClassLRU / LRFU-MQ hybrid** replacement for SLRU — measured **+6% decode on QFN, +7% on GLM, 8% fewer uploads** with a warm cache ([PR #31233](https://github.com/ggml-org/llama.cpp/pull/31233))
  - `--moe-cache-cpu-share auto` with CRF admission for CPU misses ([PR #31286](https://github.com/ggml-org/llama.cpp/pull/31286))
- **Gemma-4 E2B/E4B graph optimizations** — drop unused prompt tokens before KV-shared layers; claimed "massive gains on pp". ([PR #31356](https://github.com/ggml-org/llama.cpp/pull/31356))
- **CUDA NVFP4 fused gate/up + GLU MMQ** for dense and MoE FFNs, W4A4 and W4A8 paths. ([PR #31296](https://github.com/ggml-org/llama.cpp/pull/31296))
- **Vulkan RDNA3/RDNA4 small-n split-K selection** improvements (b12050).
- **CUDA graph eviction fix** — prevent premature eviction of graphs about to be used, addressing a high-concurrency regression from #21611. ([PR #30662](https://github.com/ggml-org/llama.cpp/pull/30662))
- **CUDA: gather batched tensor reads into mapped host memory** rebased to master. ([PR #31391](https://github.com/ggml-org/llama.cpp/pull/31391))

## 5. Stability & Regressions

Ranked by severity/impact:

1. **[OPEN, 36 comments] Speculative decoding divergence on quantized targets** — draft-model spec decoding (`draft-mtp`/`draft-dspark`) produces different greedy output than non-speculative runs when the target is quantized (e.g. Q4_K_M); matches on bf16. This is a correctness issue, not just speed. ([#25618](https://github.com/ggml-org/llama.cpp/issues/25618))
2. **[OPEN] SYCL multi-GPU + `--cpu-moe` 100–1000× slower than single GPU** — 2× Intel Arc Pro B60, `-sm layer`, 5-token prefill taking 165 s on one host thread. ([#31510](https://github.com/ggml-org/llama.cpp/issues/31510))
3. **[OPEN] Gemma 4 + `--mmproj` + MTP aborts on startup** with `GGML_ASSERT(ubatch->embd_state)` — regression introduced by #30257. ([#30698](https://github.com/ggml-org/llama.cpp/issues/30698))
4. **[OPEN] GLM-5.3-Flash decode stalls on Metal** — fused Lightning Indexer falls back to CPU. ([#29867](https://github.com/ggml-org/llama.cpp/issues/29867))
5. **[OPEN] SYCL segfault on oneAPI 2026.2.0** ([#31064](https://github.com/ggml-org/llama.cpp/issues/31064)); **CUDA `fattn.cu:579` fatal error** ([#24324](https://github.com/ggml-org/llama.cpp/issues/24324)).
6. **[CLOSED] SYCL bf conversion instruction unsupported on Arrow Lake iGPU** ([#31029](https://github.com/ggml-org/llama.cpp/issues/31029)); **Vulkan `ggml_fp32_to_f8_e4m3` build failure with GCC 16.2 / clang 22 + libstdc++ 16** since #27512 ([#31445](https://github.com/ggml-org/llama.cpp/issues/31445)); **Vulkan `count_experts.comp` inefficiency** ([#31163](https://github.com/ggml-org/llama.cpp/issues/31163)); **quantized K-cache non-determinism with prefix cache** ([#28527](https://github.com/ggml-org/llama.cpp/issues/28527)).
7. **CUDA 4-bit KV silently falls back to CPU** under default flags — ~30× prefill slowdown without warning; proposed making `GGML_CUDA_FA_ALL_QUANTS=ON` default. ([#28633, closed](https://github.com/ggml-org/llama.cpp/issues/28633))
8. **Server stability**: invalid `grammar_triggers[].type` reaches a `GGML_ASSERT` and aborts the whole server — one bad request kills it; fix PR throws instead. ([PR #31478](https://github.com/ggml-org/llama.cpp/pull/31478)) Also `llama-server` slowdown over time requiring reboots on Vulkan ([#22360, closed](https://github.com/ggml-org/llama.cpp/issues/22360)).

## 6. What This Means for Application Developers

- **Multi-sequence serving just got cheaper.** If you run batched/concurrent requests through `llama-server`, b12059's `flash_attn_ext_rows` is the most valuable upgrade today — but verify your backend supports it, otherwise you fall back to the old mask-filtering path.
- **Quantized targets + speculative decoding are not output-equivalent to vanilla greedy.** Issue #25618 is unresolved: if your product requires deterministic greedy output, disable draft-model speculation on quantized targets or pin to bf16 for validation. Ngram speculation is reportedly unaffected.
- **MoE deployments should watch the cache PR race.** ClassLRU (#31233) posts concrete double-digit-percent decode gains on QFN/GLM and fewer expert uploads; the CPU-fallback and auto-admission variants (#30966, #31286) target memory-constrained hosts. None are merged yet — plan capacity around the SLRU baseline for now.
- **New TTS and MoE architectures keep landing fast** (Pocket TTS, Clover, Chatterbox WIP). If you're building agent stacks with voice I/O, the mtmd/mtmd-adjacent surface is worth tracking closely.
- **Server robustness gap:** malformed `grammar_triggers` from a single client can crash the entire server (#31478 pending). Sandbox or validate untrusted requests, or apply that patch locally if you're on a public-facing endpoint.
- **Intel/SYCL shops:** quantized-KV DPAS FA (#31125) and Vulkan prefill kernels (#29357) are improving, but multi-GPU `--cpu-moe` is currently pathological (#31510) — prefer single-GPU MoE or CUDA/ROCm until fixed. Update to oneAPI 2026.2 CI packages (#31540) if building from source.

</details>

<details>
<summary><strong>Ollama</strong> — <a href="https://github.com/ollama/ollama">ollama/ollama</a></summary>

# Ollama Digest — 2026-11-03

## 1. Today's Highlights

Release candidate **v0.40.14-rc0** is in flight, bundling a CI deadlock workaround, an OpenAI-Responses content-preservation fix, and a chunked sort for long MLX top-k rows. Activity is dominated by **hybrid/SSM architecture support gaps** (Qwen3.5/3.8, Qwen3-Next, LFM2) and **OpenAI-compatibility correctness issues** around tool calls, refusal parts, and response IDs. Several long-standing pain points — per-request `llama-server` log spam, VRAM over-prediction for hybrid models, and missing Unix socket support — have open fix PRs.

## 2. Releases & Breaking Changes

- **v0.40.14-rc0** ([release](https://github.com/ollama/ollama/releases)) — no breaking changes listed; notable inclusions:
  - `ci: pin buildx to workaround deadlock` ([#19373](https://github.com/ollama/ollama/pull/19373))
  - `openai: preserve readable Responses input content` ([#19192](https://github.com/ollama/ollama/pull/19192))
  - `mlx: sort long top-k rows in chunks` (MLX path)
- No API or config schema changes in this RC. Note that [#18990](https://github.com/ollama/ollama/pull/18990) proposes changing `SYSTEM ""` semantics in Modelfiles (clear vs. inherit) — worth tracking if you templatize system prompts.

## 3. New Model & Hardware Support

- **MiMo V2.6 support** proposed in [#19400](https://github.com/ollama/ollama/pull/19400) by @dhiltgen — candidate MLX and GGUF builds available at `dhiltgen/mimo-v2.6` for testing.
- **Qwen3.8-27B hybrid-attention GGUFs** currently fail to load (`qwen3next: layer 64 missing attn_qkv/attn_gate projections`) — see [#19459](https://github.com/ollama/ollama/issues/19459). Architecture support gap, not a quantization problem.
- **Qwen3.5 0.8B Q4_K_M** quantization requested in [#19436](https://github.com/ollama/ollama/issues/19436); currently the only Qwen3.5 size without `q4_K_M`.
- **CUDA packaging**: [#19433](https://github.com/ollama/ollama/pull/19433) loads bundled CUDA libraries in-process on Linux to fix `libcusolver`/`libnvJitLink` resolution for MLX CUDA builds.
- **Vulkan backend** still unsupported; users on Vulkan-only hardware (notably Intel) get CUDA artifacts downloaded — see [#19474](https://github.com/ollama/ollama/issues/19474).

## 4. Performance & Optimization

- **VRAM prediction over-counts KV cache 4–8×** for hybrid/SSM models (Qwen3.5/3.8, Qwen3-Next) and ignores `OLLAMA_KV_CACHE_TYPE` — [#19463](https://github.com/ollama/ollama/issues/19463). This can cause spurious runner eviction even with `keep_alive=-1`. High impact for anyone serving hybrid models concurrently.
- **Log volume**: [#17913](https://github.com/ollama/ollama/pull/17913) filters per-request `llama-server` logs unless debug is enabled (~20 lines/request today, painful under journald).
- **MLX**: chunked top-k sorting for long rows ([#19373 branch](https://github.com/ollama/ollama/pull/19373) release notes) — relevant to long-context sampling on Apple silicon.

## 5. Stability & Regressions

Ranked by severity:

1. **Silent token loss — LFM2:24b** ([#18785](https://github.com/ollama/ollama/issues/18785), closed): the bare `"python"` token decodes to an empty string; space-prefixed form is fine. Correctness bug with silent output corruption.
2. **Hybrid GGUF load failure** ([#19459](https://github.com/ollama/ollama/issues/19459)): Qwen3.8-27B abliterated GGUFs fail init. No fix PR yet.
3. **JSON Schema constraint failure with Qwen3.5 9B + `think:false`** ([#19350](https://github.com/ollama/ollama/issues/19350)): structured extraction produces invalid output / runaway continuation.
4. **VRAM over-prediction evictions** ([#19463](https://github.com/ollama/ollama/issues/19463)): see above.
5. **OpenAI-compat `/v1/chat/completions` 400** when a tool result carries an image part ([#19479](https://github.com/ollama/ollama/issues/19479)); IDs pair correctly, error message is misleading. Also: `refusal` content parts rejected in chat history ([#19452](https://github.com/ollama/ollama/pull/19452)).
6. **Non-unique response IDs** in OpenAI-compat endpoints ([#19401](https://github.com/ollama/ollama/pull/19401)) — only 999 distinct `chatcmpl-*` values; breaks client-side dedup/tracing.
7. **`OLLAMA_KEEP_ALIVE` / `OLLAMA_LOAD_TIMEOUT` integer overflow** wraps `time.Duration` for large seconds values ([#19475](https://github.com/ollama/ollama/pull/19475)).
8. **macOS app update loop** offering restart for already-installed 0.40.13 and requesting admin to chown `/Applications/Ollama.app` ([#19472](https://github.com/ollama/ollama/issues/19472)).
9. **Cloud billing access failure** ([#19461](https://github.com/ollama/ollama/issues/19461)): paid tier non-functional, no support response across email/Discord/X.

## 6. What This Means for Application Developers

- **Hybrid/SSM models are not production-ready on Ollama yet.** If you're planning around Qwen3.5/3.8 or Qwen3-Next, budget for VRAM misprediction and possible GGUF load failures. Pin versions and test `keep_alive` behavior explicitly.
- **OpenAI-compat layer has edge-case gaps.** Tool results with image parts, refusal content parts, and response-ID uniqueness are all currently unreliable. If you're routing through `/v1/chat/completions` from a strict SDK, add validation and fallbacks.
- **Cloud tier support is a risk.** The open support thread ([#19461](https://github.com/ollama/ollama/issues/19461)) with no response for a paying customer is worth noting if you're considering Ollama Cloud for anything customer-facing.
- **Unix socket support is coming** ([#19467](https://github.com/ollama/ollama/pull/19467), closes [#19464](https://github.com/ollama/ollama/issues/19464)): `OLLAMA_HOST=unix:///path` with `0600` perms. Useful for local agent sandboxing and avoiding loopback exposure.
- **Upgrade to v0.40.14-rc0** if you're on MLX with long-context sampling or hitting the Responses-API content-preservation issue; otherwise wait for the stable cut given the open hybrid-model regressions.

</details>

<details>
<summary><strong>LiteLLM</strong> — <a href="https://github.com/BerriAI/litellm">BerriAI/litellm</a></summary>

# LiteLLM Digest — 2026-11-03

## 1. Today's Highlights

The Rust migration parent ticket (#31263) continues to draw heavy engagement (33 comments, 21 👍) as the headline architectural initiative, with a blog post and beta tester signup now live. A cluster of streaming/translation correctness bugs around `/v1/messages` (Anthropic compatibility, Claude Code) dominates today's issue traffic — several involve dropped content on thinking→text block transitions across Bedrock and Gemini backends. On the PR side, the team landed fixes targeting spend accounting correctness (cold counter double-counting, web-search interception double-billing) and Azure AI authentication field leakage.

## 2. Releases & Breaking Changes

- **No new releases in the last 24h.**
- **PR #49605 [OPEN]** — `litellm-proxy` wheels will ship with the proxy extra as a platform wheel, avoiding the requirement to install Rust. Relevant to anyone building proxy installs; local dev builds remain supported pre-publish. https://github.com/BerriAI/litellm/pull/49605
- **PR #45512 [OPEN]** — Restores the `config.yaml` docs page in the OpenAPI schema (drops `include_in_schema=False`), fixing a broken Swagger UI section. https://github.com/BerriAI/litellm/pull/45512
- **PR #49544 [OPEN]** — New opt-in `spend_logs_prompt_storage: latest_turn` mode stores only the current turn for stateless requests — significant for coding agents that resend full conversations. https://github.com/BerriAI/litellm/pull/49544

## 3. New Model & Hardware Support

- **PR #40066 [OPEN]** — `hosted_vllm/*` wildcards with `check_provider_endpoint: true` now list models from servers without an API key, enabling Claude Code and other clients to discover them via `/v1/models`. https://github.com/BerriAI/litellm/pull/40066
- **PR #47679 [OPEN]** — Admins can name a tokenizer per Bedrock deployment (Nova, Llama, Mistral) and skip the provider call, since AWS only counts tokens for Claude. https://github.com/BerriAI/litellm/pull/47679
- **Issue #33670 [CLOSED]** — Feature request for `opencode` and `agnes-ai` model additions; closed as stale, not actioned. https://github.com/BerriAI/litellm/issues/33670

## 4. Performance & Optimization

- **Issue #31263 [OPEN]** — Rust migration parent ticket targets **sub-1ms gateway overhead**. This is the primary performance initiative; no landed numbers yet. https://github.com/BerriAI/litellm/issues/31263
- **Issue #43922 [OPEN]** — `store_model_in_db` credential sync is O(n²) and blocks the event loop for **10s+ per reload** with thousands of credentials. Currently unresolved; impacts large deployments. https://github.com/BerriAI/litellm/issues/43922
- **Issue #34471 [CLOSED]** — `safe_deep_copy`/`safe_dumps` crash under concurrent mutation (`dictionary changed size during iteration`); closed as stale. https://github.com/BerriAI/litellm/issues/34471

## 5. Stability & Regressions

Ranked by severity:

1. **Issue #49675 [OPEN]** — v3 rate limiter: TPM counter outlives its window under upstream 429s, causing keys/teams to be rejected below their `tpm_limit`. High impact for production rate limiting. https://github.com/BerriAI/litellm/issues/49675
2. **Issue #47676 [OPEN, risk:high]** — *Fix PR exists.* Under budget, customers get spurious 422s when concurrent requests hit a cold spend counter because each re-added the full spend. https://github.com/BerriAI/litellm/pull/47676
3. **Issue #30765 [OPEN]** — `/v1/messages` streaming drops the first `text_delta` after a thinking→text block transition (Claude Code proxy path). https://github.com/BerriAI/litellm/issues/30765
4. **Issue #25214 [OPEN, stale]** — Same dropped-first-chunk class on Bedrock reasoning models (Minimax, Kimi, Claude extended thinking). 7 👍. https://github.com/BerriAI/litellm/issues/25214
5. **Issue #49359 [OPEN]** — MCP tool execution failures drop `is_error` and don't propagate to Anthropic `tool_result`. https://github.com/BerriAI/litellm/issues/49359
6. **Issue #46701 [OPEN]** — *Fix PR #49772 exists.* Azure AI Foundry Anthropic endpoints 400 when `azure_ad_token` leaks into request body. https://github.com/BerriAI/litellm/issues/46701
7. **Issue #49479 [OPEN]** — `pass_through_endpoints` strips `id` from JSON-RPC 2.0 bodies (internal parameter name collision). https://github.com/BerriAI/litellm/issues/49479
8. **Issue #32140 [CLOSED]** — Router fallback between Vertex AI and Gemini replays endpoint-bound thought signatures → 400 "Corrupted thought signature" (Gemini 3.x). https://github.com/BerriAI/litellm/issues/32140
9. **Issue #35685 [OPEN, stale]** — Vertex AI/Gemini `_map_function` silently drops tool parameters when schema uses `input_schema` instead of `parameters`. https://github.com/BerriAI/litellm/issues/35685
10. **Issue #18060 [OPEN, stale]** — Infinite retry loops on unauthorized/incorrect requests with virtual keys. https://github.com/BerriAI/litellm/issues/18060

## 6. What This Means for Application Developers

- **Anthropic/Claude Code users:** streaming content loss on block transitions (issues #30765, #25214) is the top practical concern — if you rely on `/v1/messages` with thinking models, validate output integrity until fixes land.
- **Rate-limit and budget enforcement is currently unreliable** (#49675, #47676) — don't treat LiteLLM TPM counters or budget gates as hard guarantees in production; add application-side backstops.
- **MCP tooling:** failures aren't correctly surfaced as errors to Anthropic-format clients (#49359), so agent frameworks may misinterpret failed tool calls as successful empty results. Guard your tool-call parsing accordingly.
- **Azure AI Foundry + Entra auth** users should watch PR #49772; until merged, auth fields may leak into inference bodies.
- **Agent builders resending full conversation history** should track PR #49544 — `latest_turn` spend-log storage will materially reduce log volume and storage cost.
- **Token accounting on Bedrock:** non-Claude models still can't be counted via the provider API; PR #47679 offers an admin-configured tokenizer workaround.

</details>

<details>
<summary><strong>Unsloth</strong> — <a href="https://github.com/unslothai/unsloth">unslothai/unsloth</a></summary>

# Unsloth Digest — 2026-11-03

## 1. Today's Highlights
No new releases in the last 24h, but PR throughput is heavy and focused on **Unsloth Studio** (the desktop/web app) plus **Block Swap** training infrastructure. The most consequential in-flight work is a trio of PRs (#15632, #15159, plus companions) that unblock `offload_layers` / Block Swap for large MoE and FP8 models — including a claim that a 180B Qwen3.8-Flash-Next FP8 trains on a single 95 GiB GPU. On the issue side, the day is dominated by Studio UX/persistence bugs, Vulkan/ROCm load failures, and TTS/STT edge cases.

---

## 2. Releases & Breaking Changes
None — no releases published in the last 24h. No API/config breaking changes announced. Note one behavioral inconsistency worth tracking (no migration path yet, PR not filed):

- **State persistence asymmetry in Studio**: Several Settings panes (Appearance / System / Security / Browser) are stored only in browser `localStorage` and silently reset per origin/browser, while other settings are server-side. [#16309](https://github.com/unslothai/unsloth/issues/16309)
- **`-ngl` argument rejection**: Studio's custom llama-server args reject `-ngl all` / `-ngl auto` (`--gpu-layers`, `--n-gpu-layers`) with HTTP 400, though llama.cpp accepts both. Users passing through upstream llama.cpp flags will hit this. [#16494](https://github.com/unslothai/unsloth/issues/16494)

---

## 3. New Model & Hardware Support
- **LFM3 family (incl. LFM3-1.7B)** — feature request closed; LiquidAI's new, more expressive backbone is targeted for support. [#15588](https://github.com/unslothai/unsloth/issues/15588)
- **Qwen3.8-Flash-Next FP8** — Block Swap enablement is the blocker being fixed (see §4). Currently fails to train past layer 1 with `offload_layers`. [#15632](https://github.com/unslothai/unsloth/pull/15632)
- **Inception Mercury (diffusion LLM)** — new Studio preset with live diffusion streaming (replaces the current append-every-step behavior that duplicates text). [#16508](https://github.com/unslothai/unsloth/pull/16508)
- **Mistral Small 4 GGUF** — reasoning-level gating: template accepts only `none`/`high`; Studio will offer only allowed levels. [#16502](https://github.com/unslothai/unsloth/pull/16502)
- **Laya fine-tunes** — GGUF exports now actually used by the Decision API (previously silently ignored). [#16511](https://github.com/unslothai/unsloth/pull/16511)
- **AMD / ROCm**: retry logic for unpinned llama-server arch crashes on cards with matching kernels (RX 7900 XTX + R9700 + iGPU split). [#16513](https://github.com/unslothai/unsloth/pull/16513)
- **Vulkan (RX 5700 XT, Win10 22H2)**: still broken, reported. [#16395](https://github.com/unslothai/unsloth/issues/16395)
- **OpenRouter TTS (MAI-Voice)**: external TTS broken — Studio requests WAV, OpenRouter serves mp3/pcm. Fix included in the report. [#16443](https://github.com/unslothai/unsloth/issues/16443)
- **MLX speculative decoding**: draft support extended to tool/video/grammar/KV-quant/LoRA replies. [#16441](https://github.com/unslothai/unsloth/pull/16441)

---

## 4. Performance & Optimization
- **Block Swap for MoE + FP8 (in progress, high impact)**:
  - `offload_layers` fails on MoE at `get_peft_model` because evicted expert weights read as empty. Fix PR open. [#15159](https://github.com/unslothai/unsloth/pull/15159)
  - FP8 n-gram table loads without `weight_scale`, blocking layer 1 on `Qwen3.8-Flash-Next-FP8`. With this PR + #15633 + zoo#36, **180B model trains on one 95 GiB GPU**. [#15632](https://github.com/unslothai/unsloth/pull/15632)
- **TTS memory sizing**: size audio.cpp TTS models from measured peaks and run TQ2_1 on CPU — fixes "No single GPU has enough free memory" refusals on 8 GB GPUs. [#16514](https://github.com/unslothai/unsloth/pull/16514)
- **Startup warmup made opt-in by feature** (hardware detect, text, datasets, image/video, quant prechecks) to keep pre-load footprint light. [#16469](https://github.com/unslothai/unsloth/pull/16469)
- **tok/s telemetry for API providers**: llama-server-style `timings` synthesized for streaming API replies so local and remote badges match. [#16506](https://github.com/unslothai/unsloth/pull/16506)
- **Real token usage / context window for custom OpenAI-compatible connections** (opt-in `stream_options`). [#16505](https://github.com/unslothai/unsloth/pull/16505)
- **Avoid spurious PyTorch Clef downloads**: over-long decision requests no longer trigger a 19–55 GB download + eviction. [#16509](https://github.com/unslothai/unsloth/pull/16509)

---

## 5. Stability & Regressions
Ranked by severity:

1. **Silent data loss — memory leak on drive C**: 200–400 MB residual per run, no way to clear. Open, 5 comments, unresolved. [#14487](https://github.com/unslothai/unsloth/issues/14487)
2. **Auto unload on idle broken** (Python package path). Open. [#16484](https://github.com/unslothai/unsloth/issues/16484)
3. **Silent chat cancellation**: loading a model cancels running chats without prompt, while unload correctly returns 409 without `force_cancel_active`. Inconsistent semantics. Open. [#16479](https://github.com/unslothai/unsloth/issues/16479)
4. **Misleading OOM message**: loading a second model during generation reports "GPU memory not released" (false cause). Closed. [#16436](https://github.com/unslothai/unsloth/issues/16436)
5. **Non-stream saved-connection replies discard refusal text** (Studio backend, ASGI-repro). Closed. [#16434](https://github.com/unslothai/unsloth/issues/16434)
6. **DFlash2 + Qwen3.8-Flash-Next crash on first prompt** with Unsloth llama.cpp build `b11724` (repro ×3). Closed. [#14381](https://github.com/unslothai/unsloth/issues/14381)
7. **MiniMax-H3 video on Auto attention** crashes "No available kernel" on Windows w/o flash-attn. Closed. [#16294](https://github.com/unslothai/unsloth/issues/16294)
8. **Model-load regression after desktop update** (macOS 15.0.1, 0.1.912-beta). Closed. [#15932](https://github.com/unslothai/unsloth/issues/15932)
9. **DeepSeek V4.1 Flash GGUF template** rejects ordinary discussion of the image marker → breaks conversation history. Patch supplied in report. Closed. [#15285](https://github.com/unslothai/unsloth/issues/15285)
10. **"Thinking" display missing** on 0.1.913-beta (desktop + web). Closed. [#16467](https://github.com/unslothai/unsloth/issues/16467)
11. **Gemini connection** only loads first 20 models (pagination bug). Closed. [#16432](https://github.com/unslothai/unsloth/issues/16432)
12. **TTS reads emoji descriptions aloud** — fix included. Open. [#16472](https://github.com/unslothai/unsloth/issues/16472)
13. **CLI `trust_remote_code` gap**: `train` supports it, but `inference`/`chat` load paths do not — fix PR open. [#16481](https://github.com/unslothai/unsloth/pull/16481)

---

## 6. What This Means for Application Developers
- **If you serve MoE or FP8 models with layer offloading, hold off on Block Swap-dependent training until #15632/#15159 land** — the failure mode (empty expert weights) surfaces late, at `get_peft_model`, and looks unrelated to offloading.
- **Studio's settings persistence is unreliable for anything you configure in the browser panes.** Do not depend on Appearance/System/Security/Browser settings surviving an origin or browser change; track [#16309](https://github.com/unslothai/unsloth/issues/16309) before shipping user-facing setup docs.
- **Don't pass `-ngl all|auto` through to Studio's custom llama-server args** — it 400s before any model work. Use explicit integers until [#16494](https://github.com/unslothai/unsloth/issues/16494) is resolved.
- **Chat/load semantics are inconsistent** (#16479): loading a model will silently kill running generations, but unloading refuses without an explicit flag. If you build orchestration on top, always send `force_cancel_active` on unload and treat model-load as an implicit cancel.
- **Remote/gateway users**: custom OpenAI-compatible connections now have opt-in real usage/context reporting and tok/s telemetry (#16505, #16506) — enable `stream_options` per-connection only if your gateway tolerates it, since strict gateways reject it.
- **For RTL/multilingual apps**: native BiDi/UTC-format requests are closed as feature requests (#8912, #15281); verify your UI handles LTR-forced rendering yourselves in the interim.
- **ROCm multi-GPU users**: #16513 targets the `invalid kernel file` startup crash on mixed RDNA3/iGPU splits — worth pulling once merged if you do manual GPU splits.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*