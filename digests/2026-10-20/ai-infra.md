# AI Infrastructure Digest 2026-10-20

> Generated: 2026-10-20 10:11 UTC | Projects covered: 6

- [vLLM](https://github.com/vllm-project/vllm)
- [SGLang](https://github.com/sgl-project/sglang)
- [llama.cpp](https://github.com/ggml-org/llama.cpp)
- [Ollama](https://github.com/ollama/ollama)
- [LiteLLM](https://github.com/BerriAI/litellm)
- [Unsloth](https://github.com/unslothai/unsloth)

---

## Cross-Project Comparison

# Cross-Project Comparison Report — AI Infrastructure Ecosystem

**Date:** 2026-10-20 · **Projects:** vLLM, SGLang, llama.cpp, Ollama, LiteLLM, Unsloth

---

## 1. Ecosystem Overview

The ecosystem is in a **consolidation-and-hardening phase** rather than a feature-explosion phase. Every serving-layer project (vLLM, SGLang, Ollama) is fighting *regression* and *correctness* debt — silent KV staleness in SGLang, non-deterministic decoding in vLLM, empty-tool-definition bugs in Ollama — while the frontier models themselves (DeepSeek-V4.1, GLM-5.3, Qwen3.8, Nemotron-3.5) demand P/D disaggregation, MoE-aware KV management, and Blackwell/SM120-class hardware paths that are still maturing. Meanwhile the **gateway layer (LiteLLM) is now primarily a billing-accounting problem**, not a routing one: spend correctness, TPM refill, and background-task budget enforcement dominate its tracker. Training/consumer layer (Unsloth, llama.cpp) is pushing **FSDP2, MoE expert caching, and extreme quantization** — signals that local inference is converging on the same MoE-serving economics as datacenter stacks. The unifying theme: **MoE + long context + agentic tool-use has become the dominant workload**, and every layer is retrofitting for it.

---

## 2. Activity Comparison

| Project | Layer | Issues (active/notable) | PRs (active/notable) | Release Status | Dominant Theme |
|---|---|---|---|---|---|
| **vLLM** | Serving engine | ~20 surfaced (1 deadlock @37 comments, 9-tier stability list) | Steady Rust-frontend parity stream + several perf PRs | **No release 24h** (v0.30.0 prior) | Rust frontend parity; structured-output perf regression |
| **SGLang** | Serving engine | ~15 (CI tracker @96 comments; 5 ⚠️ unfixed correctness) | ~12 (NCCL fix, EAGLE graph, dozens landing) | **No release 24h** | CI flakiness; PD-disagg stale-KV bug; GB300 fixes |
| **llama.cpp** | Local runtime | ~15 open + 3 closed | ~12 | **10+ builds / 24h** (b11740–b11753) | Tokenizer drift; MoE expert cache; `--connect` P2P |
| **Ollama** | Local runtime / desktop | ~20 open (tool-def bug, 0.40.x regressions) | ~6 (fix PRs for compat/memory) | **No release 24h** | 0.40.x regressions; native `/api/chat` tool bug |
| **LiteLLM** | LLM gateway | ~12 | ~10 (several `!` breaking) | **v1.104.4 stable + v1.107.0-rc.2** | Billing/accounting correctness; budget enforcement |
| **Unsloth** | Training/fine-tuning | ~10 | ~10 (FSDP2, MLX, diffusion) | **v0.1.909-beta** | FSDP2 alpha; MLX expert offload; DeepSeek-V4.1 |

**Reading the table:** llama.cpp and Unsloth are the only projects with *net-forward* release velocity today — they're shipping. vLLM/SGLang/Ollama are in **stabilization lock**, where CI health and correctness fixes gate progress. LiteLLM is bisecting between a stable patch and an RC on a two-track cadence.

---

## 3. Model Support Race

| Model / Arch | vLLM | SGLang | llama.cpp | Ollama | Unsloth |
|---|---|---|---|---|---|
| **DeepSeek-V4/V4.1-Flash** | ❌ blocked on SM120/GB10 (#56461) | ✅ chat-encoding backend (PR #45315); AMD TBO work | ❌ not yet | ⚠️ cloud corruption (#19156) | ✅ **day-one local** (552B/16B, ~125 GB) |
| **GLM-5.3 / 5.3-Flash** | ⚠️ GB200 P/D descriptor bottleneck (#55434); IMA crash on 4×B200 | ❌ fa4 crash SM120 (#42012) | 🔄 tensor-split PR (#30499) | ⚠️ cloud degeneration (#18980) | ✅ MLX loading (#14326) |
| **Qwen3.5 / 3.8** | ⚠️ fp8+prefix-cache deadlock (#37729); ROCm MXFP4 plans | ✅ NVFP4 vision quant (PR #45372) | ❌ DeltaNet decode collapse >80K (#27623) | — | — |
| **Nemotron-3.5** | 🔄 ASR streaming FR (#47455); NVFP4 decode reg (#59770) | — | — | — | — |
| **Muse Spark** | — | ✅ Day-0 in sequence (#44678) | — | — | — |
| **FLUX.3 / diffusion** | — | ✅ NPU W8A8 INT8 (PR #44738) | — | — | ✅ **day-one** FLUX.3 + multi-GPU diffusion |
| **GigaChat 3.5 / Kolibri-1** | — | — | 🔄 in-progress PRs | — | — |
| **Gemma 4** | — | — | 🔄 vision encoder fix (#30852) | ⚠️ Vulkan crash on Arc | — |

**Who's ahead:** **Unsloth** for *day-one local support* of the hardest models (DeepSeek-V4.1, FLUX.3) — but that's a training/fine-tuning posture, not serving. **SGLang** is the fastest *serving-layer* adopter (Muse Spark Day-0, Qwen3-VL NVFP4, DeepSeek chat-encoding) with a clean adapter-registry expansion pattern. **llama.cpp** is behind on frontier MoE (GigaChat/Kolibri still in PR) but broadest on hardware. **vLLM's** model roadmap is the most blocked today — Blackwell/SM120 paths for DeepSeek-V4 and GLM-5.3 are both untested-in-prod.

---

## 4. Performance Frontier

Optimization effort clusters into five buckets, unevenly distributed:

- **KV cache & memory residency** — the hottest area. vLLM: Octave 3-bit KV for AMD (RFC), TP-agnostic offload, per-request prefix-cache miss attribution. llama.cpp: hybrid MoE expert cache (`--moe-cache-profile`, #30594) is the standout — it directly attacks the VRAM-residency cost of MoE. Unsloth: MLX expert offload for Apple Silicon. **MoE residency is the shared bottleneck.**
- **Batching / graph capture** — SGLang leads: prefill CUDA graph shared-read (#37958), EAGLE draft-extend graph on fa3 (#40762), AMD decoder-bounded replay. vLLM: speculative-decoding reduced-draft-vocab (+25–29% decode, FR #58578).
- **Quantization** — llama.cpp OpenCL dp4a cooperative-K GEMM (q4_0/q4_k/q6_k); SGLang NVFP4 vision + NPU W8A8 INT8; Unsloth fp8mixed text encoders. Intel/NPU and Blackwell NVFP4 are the two quant frontiers.
- **Distributed serving / P/D** — vLLM's NIXL descriptor-count ceiling on GB200 (#55434) and MooncakeConnector on non-CUDA (#60523) are the key datapoints; **descriptor overhead, not bandwidth, is the scaling wall.** SGLang's MORI EPv2 async kernels and DCP a2a NCCL fix round out the picture.
- **Kernels** — vLLM Triton top-k full-vocab fallback (#61998); llama.cpp SVE i8mm GEMM; SGLang ROCm QK-norm JIT routing.

**Verdict:** vLLM and SGLang are optimizing for *datacenter MoE + long-context + disaggregation*; llama.cpp and Unsloth for *consumer/edge MoE residency*. The performance frontier has bifurcated by hardware class, not by feature.

---

## 5. Layer Positioning

| Layer | Projects | Role | Today's Signal |
|---|---|---|---|
| **Serving engine (datacenter)** | vLLM, SGLang | High-throughput inference, P/D disaggregation, multi-GPU | Both in stabilization lock; correctness bugs (deadlock, stale KV) are the gate, not features |
| **Local runtime** | llama.cpp, Ollama | Single-node/desktop inference, hardware breadth | llama.cpp shipping fast (MoE cache, `--connect`); Ollama stuck in 0.40.x regression wave |
| **LLM gateway** | LiteLLM | Routing, budget, provider abstraction, caching | Tracker is ~80% **billing correctness**, not routing — the gateway has become a finance/ledger system |
| **Training / fine-tuning** | Unsloth | LoRA/QLoRA/FSDP2, day-one model support, MLX | FSDP2 alpha is the biggest capability jump; MLX offload makes Apple Silicon a real MoE box |

**Strategic read:** vLLM/SGLang compete on the *same* datacenter slot and are differentiating on frontend language (Rust) and KV/P-D architecture. llama.cpp vs Ollama is the sharper positioning contrast today: **llama.cpp is innovating (expert cache, P2P connect, tokenizer correctness), Ollama is regressing (tool bug, hardware matrix, CVEs).** LiteLLM's layer is drifting from "router" toward "metered proxy" — a meaningful risk for teams expecting it to be a pass-through. Unsloth sits below the serving line but is now close enough (local DeepSeek-V4.1) that it overlaps with Ollama/vLLM for single-node agent backbones.

---

## 6. Trend Signals

**1. Correctness > throughput as the near-term battleground.** Every serving engine has a *silent* failure class today: vLLM fp8+prefix-cache deadlock and non-deterministic greedy decode, SGLang stale-KV on P/D+HiCache (#44070, no fix), Ollama empty tool definitions (#19040). These produce plausible-looking wrong output, not crashes. **For agent developers: validate downstream facts, not just latency.** Silent correctness is the #1 production risk this cycle.

**2. PD-disaggregation is scaling on descriptors, not fabric.** vLLM's 91k–120k KV-descriptor-per-request finding on GB200 means the disaggregation roadmap is now a *software datapath* problem (MooncakeConnector, NIXL submission). Anyone designing multi-node prefill/decode should budget for descriptor overhead as the ceiling, and watch Mooncake/non-CUDA paths closely.

**3. MoE serving economics is the shared optimization target across all four layers.** Expert caching (llama.cpp), MLX expert offload (Unsloth), MXFP4/NVFP4 plans (vLLM/SGLang) all attack the same MoE VRAM cost. Expect consumer Moe (Small) and datacenter MoE (Large) to converge on similar techniques within 2–3 quarters.

**4. Gateways must be treated as billing systems, not routers.** LiteLLM's tracker proves budget/TPM/spend bugs outnumber routing bugs ~4:1, and its breaking PRs are *all* accounting/logging-semantic changes. **Action:** audit spend-vs-token reporting basis, enforce budgets at app layer for `background: true`, and stand up Redis if you rely on TPM — in-memory TPM does not refill today (#47340).

**5. Tokenizer drift is an underrated app-level regression.** llama.cpp b11753 (combining marks in GPT-4o/Tekken families) changes token IDs for Hindi/Thai/multi-script prompts; Ollama's `lfm2:24b` drops bare `"python"`. Any prompt-cache, dedup, or token-budget layer keyed on exact tokenization needs re-baselining — this class of bug is invisible until eval scores move.

**6. Training stack is converging with serving stack.** Unsloth's FSDP2 + day-one local DeepSeek-V4.1 + MCP one-command setup means a single workstation can now fine-tune *and* serve a 552B MoE. The gap between "fine-tuning framework" and "local runtime" is narrowing; expect consolidation pressure on Ollama-class tools.

**What to watch next 2–4 weeks:**
- Whether SGLang's stale-KV (#44070) and vLLM's deadlock (#37729) get fixed — both are *common agent scaffolds* (shared system prompts, P/D disaggregation), so they gate production agent rollouts.
- LiteLLM `v1.107.0` breaking set (Copilot base-URL, Responses redaction, compaction round-trip) — plan config migrations before adopting.
- Unsloth FSDP2 leaving alpha and `UNSLOTH_BLOCK_COMPILE=0` becoming unnecessary (Issue #14063) — determines whether multi-GPU fine-tuning is production-viable this quarter.
- Ollama 0.40.x → 0.41 recovery; if the regression wave persists, llama.cpp becomes the default local-agent backend by attrition.

---

*Report synthesized from 2026-10-20 digest summaries. Issue/PR counts reflect items surfaced in digests, not full tracker totals. ⚠️ = no in-flight fix found in source digest.*

---

## Per-Project Reports

<details>
<summary><strong>vLLM</strong> — <a href="https://github.com/vllm-project/vllm">vllm-project/vllm</a></summary>

# vLLM Digest — 2026-10-20

## 1. Today's Highlights

The Rust frontend dominates today's activity: a steady stream of PRs from BugenZhao closes parity gaps with the Python API server (error taxonomy, nullable booleans, structured-output nesting caps, metric buckets), advancing the roadmap tracked in [#44280](https://github.com/vllm-project/vllm/issues/44280). On the performance side, two notable items surfaced: a ~2x decode regression for structured outputs traced to grammar-bitmask staging ([#62442](https://github.com/vllm-project/vllm/issues/62442)), and a Triton top-k kernel that silently falls back to full-vocab search ([#61998](https://github.com/vllm-project/vllm/issues/61998)). No new releases landed in the last 24h.

## 2. Releases & Breaking Changes

No releases in the last 24 hours. No breaking API/config changes identified today.

## 3. New Model & Hardware Support

- **Nemotron 3.5 ASR Streaming (0.6B)** — feature request open for NVIDIA's multilingual streaming ASR model under OpenMDW-1.1; no implementation yet. [vllm-project/vllm#47455](https://github.com/vllm-project/vllm/issues/47455)
- **OpenAI `input_file` content part** — request to accept PDF/DOC/XLS/PPT inputs (currently errors for non-image binary content), blocking Pydantic AI and similar frameworks. [vllm-project/vllm#46562](https://github.com/vllm-project/vllm/issues/46562)
- **DeepSeek-V4.1-Flash on SM120/SM121 (GB10)** — currently unserveable at `e77daef89` due to conflicting SWA cache block sizes (32 vs. 64) and DeepGEMM `block_kv` constraints; blocks Blackwell workstation/Spark-class deployment. [vllm-project/vllm#56461](https://github.com/vllm-project/vllm/issues/56461)

## 4. Performance & Optimization

- **Structured outputs ~2x decode regression since #45424** — grammar-bitmask staging cost; #49919 did not resolve it. High impact for constrained-decoding workloads. [vllm-project/vllm#62442](https://github.com/vllm-project/vllm/issues/62442)
- **Triton top-k/TP kernel full-vocab fallback** — Gaussian pivot fit on first 8192 logits misses outlier gathers for 6–10% of rows on MiMo-V2.6, forcing full-vocab search. [vllm-project/vllm#61998](https://github.com/vllm-project/vllm/issues/61998)
- **Nemotron-3.5-Lightning NVFP4 on DGX Spark (GB10)** — ~16% single-request decode regression since v0.29.0, unfixed in v0.30.0/nightly. [vllm-project/vllm#59770](https://github.com/vllm-project/vllm/issues/59770)
- **Reduced draft vocab for shared-lm_head MTP drafters** — FR-Spec-style opt-in (`--speculative-token-map` equivalent) measured **+25–29% single-stream decode** on Qwen3.5-family; feature request open. [vllm-project/vllm#58578](https://github.com/vllm-project/vllm/issues/58578)
- **ROCm/MI355X trackers** — Qwen3.8-2.4T-A95B (gfx950) and Qwen3.8-Flash-Next MXFP4 optimization plans landing as stacked PRs. [#57149](https://github.com/vllm-project/vllm/issues/57149) · [#59575](https://github.com/vllm-project/vllm/issues/59575)
- **Octave KV (3-bit KV cache for AMD)** — RFC with PR #59774; targets long-context serving on consumer RDNA3 (4×7900 XTX, TP4, MTP). [vllm-project/vllm#59773](https://github.com/vllm-project/vllm/issues/59773)
- **Routing/observability** — per-request prefix-cache miss attribution (divergence vs. eviction) requested. [vllm-project/vllm#60044](https://github.com/vllm-project/vllm/issues/60044)

**KV transfer / disaggregation:**
- **GLM-5.3 P/D on GB200** — 91k–120k KV descriptors per TP-rank transfer per request makes NIXL descriptor submission, not fabric bandwidth, the bottleneck; MNNVL/cuda_ipc slower than RDMA here. [vllm-project/vllm#55434](https://github.com/vllm-project/vllm/issues/55434)
- **MooncakeConnector RFC** — primary P/D path on non-CUDA platforms; refactor and DFS enablement in flight. [#60523](https://github.com/vllm-project/vllm/issues/60523) · [#61175](https://github.com/vllm-project/vllm/pull/61175)
- **TP-agnostic KV offloading** — tracker with help-wanted on review/testing. [vllm-project/vllm#61886](https://github.com/vllm-project/vllm/issues/61886)

## 5. Stability & Regressions

Ranked by severity:

1. **V1 engine core deadlock** — concurrent load with fp8 + prefix caching + Qwen3.5; 37 comments, no fix yet. [vllm-project/vllm#37729](https://github.com/vllm-project/vllm/issues/37729)
2. **CUDA illegal memory access on 4×B200** — GLM-5.3-Flash, surfacing across KDA linear-attention, MHC TileLang, and TRT-LLM fused MoE kernels. [vllm-project/vllm#54317](https://github.com/vllm-project/vllm/issues/54317)
3. **Non-deterministic greedy decoding** — cuBLAS split-K atomicAdd reduction ordering flips tokens across repeated `generate()` calls; **fix PR open** (#61440). [vllm-project/vllm#61319](https://github.com/vllm-project/vllm/issues/61319) · [PR #61440](https://github.com/vllm-project/vllm/pull/61440)
4. **MTP drafter OOM** — allocates a second full vocab embedding, OOMing a 27B INT4 target that otherwise fits a single RTX 3090. [vllm-project/vllm#53887](https://github.com/vllm-project/vllm/issues/53887)
5. **`VLLM_BATCH_INVARIANT=1` not batch-invariant for AWQ on sm8x** — correctness issue for reproducibility-sensitive pipelines. [vllm-project/vllm#59086](https://github.com/vllm-project/vllm/issues/59086)
6. **XGrammar intermittent request termination** — V2 DFlash probabilistic drafting + block rejection. [vllm-project/vllm#61383](https://github.com/vllm-project/vllm/issues/61383)
7. **`/pause` clears SHM multimodal cache** — can cause fatal `ValueError` for queued requests. [vllm-project/vllm#62123](https://github.com/vllm-project/vllm/issues/62123)
8. **Qwen3 reasoning-parser misattribution** — whole answer returned as `reasoning` (content=null) when prompt closes the think block and `enable_thinking` is omitted. [vllm-project/vllm#53284](https://github.com/vllm-project/vllm/issues/53284)
9. **StreamingParserEngine token leak** — bare tag fragments (e.g. `<tool_`) leak into content. [vllm-project/vllm#49205](https://github.com/vllm-project/vllm/issues/49205)

Also closed today: ROCm gfx1030 (W6800/V620/6900XT) abnormal-performance bug [#38107](https://github.com/vllm-project/vllm/issues/38107); stale Docker zstd-compression request [#28656](https://github.com/vllm-project/vllm/issues/28656).

## 6. What This Means for Application Developers

- **Rust frontend is firming up, but not ready for prod parity.** If you run `VLLM_USE_RUST_FRONTEND=1`, expect today's fixes (error `type`/`code` shape, `null` booleans, `stream_options` handling, nesting caps) to align behavior with the Python server. Until [#44280](https://github.com/vllm-project/vllm/issues/44280) closes, keep a Python fallback.
- **Avoid fp8 + prefix caching + Qwen3.5 under concurrent load** until the V1 deadlock is diagnosed ([#37729](https://github.com/vllm-project/vllm/issues/37729)). This combination is common in agent scaffolds with shared system prompts.
- **If you rely on structured outputs (JSON schema/grammar), budget for the current decode penalty** or pin to a pre-#45424 build while #62442 is investigated. Runaway-whitespace FSM fix is in review ([PR #44619](https://github.com/vllm-project/vllm/pull/44619)).
- **P/D disaggregation on non-CUDA or MoE/MLA stacks:** watch MooncakeConnector improvements and the NIXL descriptor-count problem ([#55434](https://github.com/vllm-project/vllm/issues/55434)) — descriptor overhead, not bandwidth, is your scaling ceiling on GB200-class hardware.
- **Speculative decoding on Qwen3.5-class MTP drafters** may net 25–29% decode improvement once reduced-draft-vocab support lands; worth tracking if you're latency-bound.
- **Reproducibility-sensitive apps:** avoid relying on `VLLM_BATCH_INVARIANT=1` with AWQ on Ampere/Ada until [#59086](https://github.com/vllm-project/vllm/issues/59086) is fixed.
- **If you call `/pause` in production**, audit multimodal workloads for queued-request failures ([#62123](https://github.com/vllm-project/vllm/issues/62123)).

</details>

<details>
<summary><strong>SGLang</strong> — <a href="https://github.com/sgl-project/sglang">sgl-project/sglang</a></summary>

# SGLang Digest — 2026-10-20

## 1. Today's Highlights

CI health remains the dominant discussion item: the flaky-test tracker (#42752) hit **96 comments** today while the project-wide CI Maintenance Mode issue (#21065) was updated, signaling sustained pressure on the merge pipeline. On the correctness front, a serious PD-disaggregation + HiCache bug (#44070) was surfaced where decode can silently receive stale KV; a standalone **NCCL graph buffer registration fix for the DCP a2a backend (#45371)** on GB300/Kimi-K3 is also in flight. Meanwhile, the Q4 Prefill-Decode Disaggregation roadmap (#43699) and the dLLM serving roadmap (#39499) continue to mature, alongside a new MoE routing simulator RFC (#44697) that promises a safer way to profile expert imbalance before touching production routing.

## 2. Releases & Breaking Changes

No new releases in the last 24h. No API or config changes landed today.

## 3. New Model & Hardware Support

- **SenseNova-U1 / U1.5 tracking** (#37742) — feature and performance tracking against the official OpenSenseNova reference implementation. https://github.com/sgl-project/sglang/issues/37742
- **Muse Spark Day-0 support** (#44678) — support PRs #44664–#44667 are landing in sequence; #44666 depends on a DeepGEMM patch (sgl-project/DeepGEMM#104) plus a release bump. https://github.com/sgl-project/sglang/issues/44678
- **DeepSeek-V4/V4.1 chat encoding backend** (PR #45315) — adds `deepseek-recipe`-style chat encoding via the adapter registry from #45300. https://github.com/sgl-project/sglang/pull/45315
- **NPU diffusion W8A8 INT8** (PR #44738) — online INT8 quantization for diffusion pipelines on Ascend. https://github.com/sgl-project/sglang/pull/44738
- **Qwen3-VL NVFP4 vision quantization** (PR #45372) — enables ModelOpt NVFP4 for the vision tower on Blackwell. https://github.com/sgl-project/sglang/pull/45372
- **Ascend A5 cross-generation adaptation RFC** (#35709, closed) — discusses operator provider / KV layout / quant metadata divergence as A5 lands. https://github.com/sgl-project/sglang/issues/35709
- **LoRA: DoRA adapter support request** (#22124) — closed today; see compatibility notes in PR #45362. https://github.com/sgl-project/sglang/issues/22124

## 4. Performance & Optimization

- **Prefill CUDA graph shared-read completion** (PR #37958) — makes prefill's shared-read-done event explicit and default-on, letting the next step's `req_to_token` / `full_to_swa` writes wait only on prefill metadata prep instead of the full forward. https://github.com/sgl-project/sglang/pull/37958
- **EAGLE draft-extend CUDA graph on FlashAttention** (PR #40762, closed) — `fa3`/`fa4` was missing from `graph_supported_backend_types`, so EAGLE/EAGLE3 served with `--attention-backend fa3` silently skipped draft-extend graph capture. Now unblocked. https://github.com/sgl-project/sglang/pull/40762
- **ROCm QK-norm JIT routing** (PR #39071) — routes per-head QK norm to the stride-aware JIT kernel instead of forcing a full copy of QKV slices every layer (e.g. 6144-row stride on Qwen3-8B). https://github.com/sgl-project/sglang/pull/39071
- **AMD deterministic all-reduce buffer** (PR #34543) — stops registering oversized inputs (>16 MiB) into the deterministic working buffer, fixing breakage on normal-sized prefills on large models. https://github.com/sgl-project/sglang/pull/34543
- **MORI EPv2 on AsyncLL kernels** (PR #44492) — moves dispatch/combine to the async kernel family so two-batch overlap (TBO) actually pays off for DeepSeek-V4 on AMD. https://github.com/sgl-project/sglang/pull/44492
- **AMD DSV4.1 decoder-bounded-replay**** (PR #45339) — skips unneeded layer-20 computation under replay. https://github.com/sgl-project/sglang/pull/45339

## 5. Stability & Regressions

Ranked by severity. Items marked ⚠️ indicate no in-flight fix found.

1. **⚠️ Stale KV silently served on PD prefill + HiCache** (#44070) — with `SGLANG_DISAGG_PREFILL_EARLY_SEND_CACHED_PREFIX=1`, decode can receive stale KV for a shared prefix that lived only in host memory, because the early cached-prefix send races the HiCache load-back. Silent correctness failure with no error signal. https://github.com/sgl-project/sglang/issues/44070
2. **⚠️ DCP a2a garbled output on GB300 / Kimi-K3** — 12/12 degenerate outputs on a TP8/DCP8 2-node GB300 smoke probe; root-caused to NCCL graph buffer registration, **fix PR #45371 open** (default-off for a2a). https://github.com/sgl-project/sglang/pull/45371
3. **⚠️ `pause_generation(in_place)` then `pause_generation(abort)` hangs server** (#44835) — process hangs until watchdog kill; no fix PR yet. https://github.com/sgl-project/sglang/issues/44835
4. **⚠️ MoRI EP small `SGLANG_MORI_NUM_MAX_DISPATCH_TOKENS_PER_RANK` silently corrupts decode** (#27194) — fluent-looking but semantically wrong output; gsm8k=0.00 at low concurrency. https://github.com/sgl-project/sglang/issues/27194
5. **⚠️ fa4 bs GLM-5.3-Flash on SM120** (#42012) — fa4 crashes at CUDA-graph capture (hybrid extend reshape); triton is currently the only working backend on RTX PRO 6000. https://github.com/sgl-project/sglang/issues/42012
6. **⚠️ NIXL/UCX prefill segfault on B200/CUDA 13** (#35189) — reported as “not fixed”; prior issues (#23489, #23499) closed without root cause. https://github.com/sgl-project/sglang/issues/35189
7. **Qwen3 MoE corruption after EPLB rebalance** (#39580) — **fix PR open**. https://github.com/sgl-project/sglang/pull/39580
8. **IGW: failed-metadata worker permanently stuck as `model_id: "unknown"`** (#37554) — router serves on a fraction of fleet with all pods Ready. Now closed. https://github.com/sgl-project/sglang/issues/37554
9. **Strict tool constraints fail whole request on one bad schema** (#45224) — with `SGLANG_TOOL_STRICT_LEVEL=2`, one uncompilable schema (xgrammar) kills the entire request; no client recovery. https://github.com/sgl-project/sglang/issues/45224
10. **`qwen3_coder` structural tag text-trigger fragility** (#45225, #45235) — trigger is literal `<tool_call>\n<function=`; whitespace variants silently disable the constraint, and mixing one `strict: true` tool with `tool_choice=auto` causes argument hallucination in non-strict zero-arg tools. https://github.com/sgl-project/sglang/issues/45225

Also flagged: startup OOM with 32 tokenizer workers + auto cuda_vmm transport on 2-node GB300 (#45345); `SGLANG_NGRAM_FORCE_GREEDY_VERIFY` does not actually force greedy verification (#43931); Qwen3.5-arch NVFP4 degenerates into token loops on 0.5.17 (#35723, closed/inactive); SM120 grouped FP8 DeepGEMM skipped UE8M0 requantization (#39063, closed); diffusion CUDA JIT `rsqrt` host/CRT clash on sm_75 + CUDA 13 (#38516).

## 6. What This Means for Application Developers

- **If you run PD disaggregation with HiCache**, audit whether `SGLANG_DISAGG_PREFILL_EARLY_SEND_CACHED_PREFIX` is enabled on your prefill tier. #44070 is the kind of bug that produces plausible-looking output with wrong facts — validate downstream, not just loss curves. There is no fix yet.
- **If you serve Qwen3-Coder with strict tool schemas**, be aware that one malformed tool schema can fail the entire request under `SGLANG_TOOL_STRICT_LEVEL=2` (#45224), and the structural tag trigger is whitespace-sensitive (#45225). Until these land, isolate strict tools to dedicated requests rather than mixing strict and non-strict tools under `tool_choice="auto"`.
- **If you're on GB300 / B200 multi-node** with DCP a2a + CUDA graphs, watch PR #45371; the reported symptom is garbled decode, not a crash, so a quick manual `NCCL_GRAPH_REGISTER=0` is a worthwhile mitigation while it merges.
- **EAGLE / EAGLE3 users on FlashAttention backends** should pick up PR #40762 once released — draft-extend CUDA graphs were being skipped entirely with `fa3`, i.e. you were leaving speculative-decoding performance on the table.
- **Muse Spark and SenseNova-U1** adopters can follow the two tracking issues (#44678, #37742) for Day-0 support ordering and known gaps. Muse Spark depends on a coordinated DeepGEMM bump, so plan your container pin accordingly.
- **CI flakiness (#42752, now 96 comments)** is the clearest signal that landing PRs will be slow this week — budget for longer review cycles and avoid stacking large interdependent PRs.

</details>

<details>
<summary><strong>llama.cpp</strong> — <a href="https://github.com/ggml-org/llama.cpp">ggml-org/llama.cpp</a></summary>

# llama.cpp Digest — 2026-10-20

## 1. Today's Highlights

A very busy release window with 10+ builds in 24 hours, headlined by a significant **server networking feature** (`--connect` for P2P access beyond the LAN) and a **tokenizer correctness fix** for combining marks (affects gpt-oss, Mistral NeMo/Tekken, and other GPT-4o-family pre-tokenizers — closing #30787). On the performance side, OpenCL gained cooperative-K dp4a GEMM kernels for q4_0/q4_k/q6_k, and a heavily discussed hybrid MoE expert-cache PR (#30594) brings profile-based prefilling and zero-upload inference. Stability attention is concentrated on MoE/router behavior, SYCL warnings/ops coverage, and long-context decode collapse reports on Vulkan and hybrid DeltaNet models.

---

## 2. Releases & Breaking Changes

- **b11744 — server: add `--connect`, allow P2P access to server outside LAN** ([PR #28277](https://github.com/ggml-org/llama.cpp/pull/28277))
  - Exposes an experimental tunnel/connect-code mechanism (`props.connect_code`). Explicitly marked experimental; note the caveat that a connect code is *not* advertised without the tunnel. Treat any externally reachable server config as a security review item.
- **b11753 — vocab: add `\p{M}` to Tekken/GPT-4o pre-tokenizer lookaheads** ([PR #30845](https://github.com/ggml-org/llama.cpp/pull/30845))
  - Behavioral tokenizer change: tokens for Hindi, Thai, and other scripts using combining marks will now **differ from prior builds** and are aligned with HF. If you cache tokenized prompts or rely on exact token IDs at boundaries, re-validate. Closes [#30787](https://github.com/ggml-org/llama.cpp/issues/30787).
- **b11742 — Hybrid DNA tokenizer fixes** ([PR #30825](https://github.com/ggml-org/llama.cpp/pull/30825)): adds Carbon-14B HybridDNA tokenizer support, N-padded tail tokens, and `<dna>` whitespace handling aligned to HF.
- **b11747 — mtmd: match transformers Qwen-VL resize** ([PR #30736](https://github.com/ggml-org/llama.cpp/pull/30736)): vision preprocessing output may shift slightly; re-baseline any VLM evals.
- No deprecations or config removals flagged today.

---

## 3. New Model & Hardware Support

- **Hexagon: Snapdragon toolchain v0.8 + Hexagon v85 enabled** (b11751, [PR #30854](https://github.com/ggml-org/llama.cpp/pull/30854)) — expands Qualcomm NPU coverage, includes a helper script for SWIV on some IoT devices.
- **OpenCL: cooperative-K dp4a GEMM for q4_0, q4_k, q6_k** (b11741, [PR #30741](https://github.com/ggml-org/llama.cpp/pull/30741)) — new quantized GEMM path for OpenCL devices.
- **OpenCL: `GET_ROWS` for i32 + copy conversions for i32/f32** (b11740, [PR #30756](https://github.com/ggml-org/llama.cpp/pull/30756)) — fills op-coverage gaps tracked under [#14909](https://github.com/ggml-org/llama.cpp/issues/14909).
- **Hybrid DNA / Carbon-14B tokenizer** (b11742) — new model support.
- **In progress:**
  - **GigaChat 3.5 (432B-A28B)** — DeepSeek-V3-style MoE + MLA with hybrid attention ([PR #25342](https://github.com/ggml-org/llama.cpp/pull/25342)).
  - **Kolibri-1 (Aleph-Alpha)** — 78B / 3.46B active German-English MoE; PR landed then had redundant precision overrides removed ([#30673](https://github.com/ggml-org/llama.cpp/pull/30673), follow-up [#30865](https://github.com/ggml-org/llama.cpp/pull/30865)).
  - **GLM-5.3 Next tensor split (`-sm tensor`)** ([PR #30499](https://github.com/ggml-org/llama.cpp/pull/30499)).
  - **Gemma 4 vision encoder** — correct `gelu_pytorch_tanh` activation instead of `gelu_quick` ([PR #30852](https://github.com/ggml-org/llama.cpp/pull/30852)).
  - **Limite 1B (Violetto)** ([PR #29433](https://github.com/ggml-org/llama.cpp/pull/29433)).

---

## 4. Performance & Optimization

- **OpenCL q4_0/q4_k/q6_k dp4a cooperative-K GEMM** (b11741) — targeted throughput uplift on OpenCL backends for the most common K-quants.
- **Hybrid MoE expert cache with profile prefilling + zero-upload inference** ([PR #30594](https://github.com/ggml-org/llama.cpp/pull/30594)) — `--moe-cache-profile` pre-residents hot experts from an offline routing profile; `--moe-cache-hybrid` keeps profiled experts in VRAM. Directly relevant to memory-constrained MoE serving; still open.
- **MoE down-projection rescaling** — replacing global amax rescaling with a per-expert-token power-of-two factor ([PR #30861](https://github.com/ggml-org/llama.cpp/pull/30861)) with a companion Metal optimization of `argmax`/`pool_1d` ([PR #30862](https://github.com/ggml-org/llama.cpp/pull/30862)).
- **Vulkan: src1 precision support in MUL_MAT / MUL_MAT_ID** ([PR #30656](https://github.com/ggml-org/llama.cpp/pull/30656)) — mirrors the Metal approach of scaling into fp16 range; relevant to MoE router numerics.
- **SYCL: `get_rows` fix for reordered quantized weights** (b11748, [PR #30430](https://github.com/ggml-org/llama.cpp/pull/30430)).
- **SVE kernels** — new q5_0/q5_1 dot products ([#30867](https://github.com/ggml-org/llama.cpp/pull/30867)) and a 256-bit SVE `gemm_q6_K_8x8_q8_K` using i8mm ([#27472](https://github.com/ggml-org/llama.cpp/pull/27472)) — ARM server/edge uplift.
- **CUDA FlashAttention** sync-check divergence issue closed after investigation ([#27678](https://github.com/ggml-org/llama.cpp/issues/27678)).

---

## 5. Stability & Regressions (by severity)

1. **Vulkan deep-context decode collapse on Intel Arc Pro B70 (Xe2)** — ~8x slowdown 1k→64k tokens; SYCL only ~2.4x ([#28721](https://github.com/ggml-org/llama.cpp/issues/28721)). Backend-intrinsic; no fix PR yet.
2. **Qwen3.8-27B (hybrid Gated DeltaNet) decode collapse ~25x beyond ~80K context** while prefill stays fast ([#27623](https://github.com/ggml-org/llama.cpp/issues/27623)). Reproduced on CUDA; no fix.
3. **RPC slot corruption on DeepSeek V4 with 2 workers after long prompt** — output degenerates to repeated token and slot stays bad ([#30794](https://github.com/ggml-org/llama.cpp/issues/30794)). Affects RPC users.
4. **`--moe-cache-mib` crash at load on Vulkan (RX 6900 XT, Windows)** ([#30697](https://github.com/ggml-org/llama.cpp/issues/30697)) — new MoE cache path; Vulkan-specific.
5. **`--split-mode tensor` crash on second request with multi-P100 / CUDA** ([#29466](https://github.com/ggml-org/llama.cpp/issues/29466)).
6. **serve slowdowns after first request on Vulkan multi-GPU MoE** ([#30799](https://github.com/ggml-org/llama.cpp/issues/30799)).
7. **Gemma 4 + `--mmproj` + MTP abort at startup — regression in #30257** ([#30698](https://github.com/ggml-org/llama.cpp/issues/30698)).
8. **HIP on Windows multi-GPU silent corruption (gfx1100 + gfx1201)**; single-GPU and Linux multi-GPU are fine ([#28676](https://github.com/ggml-org/llama.cpp/issues/28676)).
9. **SYCL:** multiple issues — RMS_NORM launch failure on Arc Pro B60 ([#30301](https://github.com/ggml-org/llama.cpp/issues/30301)), VRAM growth regression vs b10680 ([#29063](https://github.com/ggml-org/llama.cpp/issues/29063)), sysman free-memory query unavailability ([#28239](https://github.com/ggml-org/llama.cpp/issues/28239)), test-backend-ops failures. SYCL warnings cleanup landed (b11750, [PR #30271](https://github.com/ggml-org/llama.cpp/pull/30271)) but op-correctness issues remain.
10. **Build:** ROCm 6.3.4 `group_mask_warp_inplace` compile failure ([#30755](https://github.com/ggml-org/llama.cpp/issues/30755)); mma.cuh build failure on gfx1151 ([#30839](https://github.com/ggml-org/llama.cpp/issues/30839)); ggml-rpc-server linker error with LLVM 23 + HIP ([#28814](https://github.com/ggml-org/llama.cpp/issues/28814)).
11. **Closed:** Vulkan VRAM eviction/reload behavior ([#5380](https://github.com/ggml-org/llama.cpp/issues/5380)), Qwen 3.5 checkpoint load crash (#20176), tokenizer combining-mark splitting (#30787, fixed in b11753).

---

## 6. What This Means for Application Developers

- **Tokenizer drift is the headline for most apps.** If you build on gpt-oss, Mistral/Tekken, or any GPT-4o-family model, `b11753` changes token IDs around combining marks. Re-run any prompt-caching, deduplication, or token-budget logic that assumes stable tokenization. Exact-match test fixtures will likely need a refresh.
- **`--connect` (b11744) opens new deployment topologies** — a llama-server behind NAT/reverse proxy can now be reached from remote clients via connect codes. It is explicitly experimental and networking-adjacent, so plan your auth/rate-limiting story before exposing it beyond a trusted mesh.
- **MoE serving economics are about to change.** The hybrid expert-cache work (#30594, #30861) plus Vulkan src1 precision (#30656) and OpenCL dp4a kernels (b11741) target the two dominant MoE costs: VRAM residency and quantized GEMM throughput. These are worth tracking/benchmarking on your own hardware, but note the Vulkan MoE-cache crash (#30697) before rolling `--moe-cache-mib` into production.
- **Long-context decode remains unreliable on some paths.** The DeltaNet (~80K collapse, #27623) and Xe2 Vulkan (#28721) regressions mean very-long-context agent workloads should be validated per backend/model rather than assumed. Route picking (CUDA vs Vulkan vs SYCL) materially affects tall-context latency.
- **API surface keeps expanding toward OpenAI compatibility** — Anthropic `/v1/messages` sampling-param forwarding ([#30856](https://github.com/ggml-org/llama.cpp/pull/30856)), `id_slot` passthrough ([#28554](https://github.com/ggml-org/llama.cpp/pull/28554)), Responses-API `output_index` fixes ([#30863](https://github.com/ggml-org/llama.cpp/pull/30863)), and rerank placeholder fixes ([#30864](https://github.com/ggml-org/llama.cpp/pull/30864)). If you use llama.cpp as a drop-in gateway behind existing SDKs, these PRs close real compatibility gaps — expect slot pinning to finally work consistently across endpoints once merged.
- **Model-routing/KV management is trending toward first-class server features** — the "pin empty slot" fix ([#30866](https://github.com/ggml-org/llama.cpp/pull/30866)) and model-management API planning ([#21779](https://github.com/ggml-org/llama.cpp/issues/21779), `llama serve -hf` router mode [#26116](https://github.com/ggml-org/llama.cpp/issues/26116)) point to a near-term world where multi-model routing and slot pinning are config rather than custom code.

</details>

<details>
<summary><strong>Ollama</strong> — <a href="https://github.com/ollama/ollama">ollama/ollama</a></summary>

# Ollama Digest — 2026-10-20

## 1. Today's Highlights

No releases landed in the last 24h, but issue and PR traffic is dominated by a wave of **0.40.x regression reports** across Vulkan (Intel Arc), ROCm (RDNA1), and CUDA Blackwell platforms, plus a serious correctness bug in the native `/api/chat` tool-rendering path that silently empties tool definitions before they reach the model ([#19040](https://github.com/ollama/ollama/issues/19040)). The community is also pushing hard on **non-causal decision models** (vllm-d3, `clef`, basal-1.0) and a proposed **TurboQuant/RotorQuant** compression engine ([#15051](https://github.com/ollama/ollama/issues/15051), 236 👍), indicating sustained interest in extreme-quantization backends beyond GGUF Q4/Q6. On the platform side, security maintainers filed back-to-back CVE reports against the shipped Go toolchain ([#14233](https://github.com/ollama/ollama/issues/14233), [#19162](https://github.com/ollama/ollama/issues/19162)).

## 2. Releases & Breaking Changes

- **No new releases in the last 24h.**
- **Security track:** Two open issues flag Critical/High CVEs in the Go stdlib bundled into released binaries, requesting an upgrade to Go 1.26.9+. See [#19162](https://github.com/ollama/ollama/issues/19162) (new today) and the earlier [#14233](https://github.com/ollama/ollama/issues/14233). No upgrade PR has landed.
- **Behavioral note (in-flight PR, not landed):** [#18990](https://github.com/ollama/ollama/pull/18990) proposes making `SYSTEM ""` in a Modelfile explicitly clear the base model's system prompt rather than inherit it — a semantic change to `ollama create`. Worth tracking if you template Modelfiles programmatically.

## 3. New Model & Hardware Support

- **Intel Arc 130V (Lunar Lake iGPU) via Vulkan — broken in 0.40.x.** `gemma4:12b` crashes with `ggml_vulkan: device lost on Vulkan0` on any GPU offload; worked on 0.34.4 ([#19158](https://github.com/ollama/ollama/issues/19158)).
- **NVIDIA Blackwell (RTX 5060 Ti) — CUDA flash-attention MMA kernel fails to load** for `clef`/`clef-flash` decision models via `/v1/systemone`, with `shared object initialization failed` ([#19122](https://github.com/ollama/ollama/issues/19122)).
- **AMD RDNA1 (gfx1010) — ROCm 7.2 regression:** `GGML_ASSERT(max_blocks_per_sm > 0)` on Radeon Pro W5700 under 0.35.1 ([#19075](https://github.com/ollama/ollama/issues/19075)).
- **AMD Radeon Pro 5700 XT (Vulkan):** `gpt-oss:20b` (MXFP4) returns empty responses under Vulkan while CPU inference is fine ([#19060](https://github.com/ollama/ollama/issues/19060)).
- **MLX:** PR [#19149](https://github.com/ollama/ollama/pull/19149) adds **DFlash2** speculative draft support (block-local dynamic convs + candidate selector). Separately, `ollama create` currently rejects MLX checkpoints whose `config.json` provides `model_type` without an `architectures` list — fix requested in [#19128](https://github.com/ollama/ollama/issues/19128).
- **K2 Horizon reasoning tags:** PR [#19161](https://github.com/ollama/ollama/pull/19161) teaches `TemplateSupportsThinking` to recognize K2 Horizon tags so `think: true` is accepted on `hf.co/IFM/K2-Horizon-7B-GGUF`.
- **Apple Foundation Models** integration requested natively ([#19116](https://github.com/ollama/ollama/issues/19116)).
- **TurboQuant + RotorQuant** native Go engine proposal remains the top-engagement issue: [#15051](https://github.com/ollama/ollama/issues/15051).

## 4. Performance & Optimization

- **VRAM pressure policy:** Feature request [#18612](https://github.com/ollama/ollama/issues/18612) asks for an idle-model VRAM yield mechanism when another GPU process needs memory — practically relevant for shared workstations and gaming rigs. No PR yet.
- **Non-causal batch widening:** PR [#19159](https://github.com/ollama/ollama/pull/19159) extends the whole-context batch rule in `LlamaServerBatch` to vllm-d3 GGUFs (which lack `decision.block_count`), improving throughput for non-causal decision workloads.
- **Thinking tokens to chat template:** PR [#18281](https://github.com/ollama/ollama/pull/18281) wires `Thinking` back into the outbound llama-server chat message — affects reasoning-model prompt fidelity and cache reuse.
- **Cloud context propagation:** PR [#19119](https://github.com/ollama/ollama/pull/19119) uses the selected cloud model's actual context length when launching Claude Code, avoiding the 200k fallback and unknown-model warning.

## 5. Stability & Regressions

Ranked by severity:

1. **Correctness — native `/api/chat` empties tool definitions** (install-wide, 0.33.1): models echo `{"name": ""}` and never emit `tool_calls`; `/v1` route renders tools correctly. Instrumented with two models. [#19040](https://github.com/ollama/ollama/issues/19040). No fix PR visible.
2. **Correctness — 5–8% failure rate on `glm-5.3-flash:cloud`** since 10-12 with severe degeneration ("the the the..."), host-side corruption reported in cluster 829. [#18980](https://github.com/ollama/ollama/issues/18980). Maintainer attention warranted.
3. **Cloud corruption — `deepseek-v4.1-flash` returns corrupted text** with system messages under `think: false`; output breaks mid-token and leaks server error strings. [#19156](https://github.com/ollama/ollama/issues/19156).
4. **Cloud 413s — `/v1/responses` rejects ~10.7 MiB coding requests** well below advertised context. [#19155](https://github.com/ollama/ollama/issues/19155).
5. **Windows — `/api/chat` connection reset after ~15s with large prompts** on RTX 3090 ([#19139](https://github.com/ollama/ollama/issues/19139)).
6. **Windows — desktop 0.33.1 silently fails to start built-in server** (`server.log` empty, no listener; manual `ollama serve` works). [#18061](https://github.com/ollama/ollama/issues/18061) — long-standing, still open.
7. **OpenAI-compat — assistant `tool_calls` misattached when `content: []`** — history corruption for streaming agents. Issue [#19151](https://github.com/ollama/ollama/issues/19151); **fix PR open:** [#19152](https://github.com/ollama/ollama/pull/19152).
8. **Tokenization — `lfm2:24b` drops the bare `"python"` token** (no leading space) as empty string, silently corrupting output. [#18785](https://github.com/ollama/ollama/issues/18785).
9. **`OLLAMA_CONTEXT_LENGTH` not reflected** in `/api/show` or `/api/tags`; clients see the native window while runtime is clamped. [#18995](https://github.com/ollama/ollama/issues/18995).
10. **Desktop memory leak — context menu C strings never freed** (~32 bytes per right-click on chat sidebar). Issue [#19029](https://github.com/ollama/ollama/issues/19029); **fix PR open:** [#19042](https://github.com/ollama/ollama/pull/19042).
11. **Orphaned blobs on macOS** — a 21 GB orphan found via manifest audit; no GC path. [#18595](https://github.com/ollama/ollama/issues/18595) (closed). Related open download-cleanup requests: [#1599](https://github.com/ollama/ollama/issues/1599), [#2892](https://github.com/ollama/ollama/issues/2892).
12. **Remote inference not cancelled on client disconnect** — fixed in PR [#19144](https://github.com/ollama/ollama/pull/19144) (closed/merged-track).

## 6. What This Means for Application Developers

- **If you rely on native `/api/chat` for tool use, pin to `/v1/chat/completions` until [#19040](https://github.com/ollama/ollama/issues/19040) is resolved.** The empty-tool-definition bug is silent — you'll get prose where you expect `tool_calls`. This is the single highest-impact correctness issue for agent builders today.
- **OpenAI-compat history handling has an edge case:** assistant messages with `content: []` and `tool_calls` get their calls reattached to the previous message ([#19151](https://github.com/ollama/ollama/issues/19151)). Patch is in review ([#19152](https://github.com/ollama/ollama/pull/19152)). Normalize empty arrays to `null` on the client side as a workaround.
- **Cloud users should brace for 413s on large coding sessions** ([#19155](https://github.com/ollama/ollama/issues/19155)) and occasional corrupted output on DeepSeek V4.1 with system-message constraints ([#19156](https://github.com/ollama/ollama/issues/19156)). Consider retry-with-backoff and system-prompt minimization for the latter until a network/server-side fix lands.
- **Context-length introspection is unreliable:** `OLLAMA_CONTEXT_LENGTH` is honored at runtime but not reflected by `/api/show` or `/api/tags` ([#18995](https://github.com/ollama/ollama/issues/18995)). If you budget context client-side based on these APIs, apply your own clamp.
- **Hardware matrix caution:** if you ship on Intel Arc/Vulkan, RDNA1/ROCm, or Blackwell/CUDA, verify against the specific regressions above before upgrading past 0.34.x. The 0.34.x → 0.40.x llama-server migration is the common thread.
- **Security/compliance:** released binaries currently ship with known-critical Go CVEs ([#19162](https://github.com/ollama/ollama/issues/19162)). If you vendor Ollama into a regulated build, hold on govulncheck-gated promotions until the toolchain bump lands.
- **Operational hygiene:** orphaned blob cleanup remains manual — audit `~/.ollama/models/blobs` against `manifests/` periodically, especially on shared CI runners where interrupted pulls are common.

---
*Sources: [github.com/ollama/ollama](https://github.com/ollama/ollama) — issues and PRs updated 2026-10-19/20.*

</details>

<details>
<summary><strong>LiteLLM</strong> — <a href="https://github.com/BerriAI/litellm">BerriAI/litellm</a></summary>

# LiteLLM Digest — 2026-10-20

## 1. Today's Highlights

Two new releases landed in the last 24 hours: a stable patch (**v1.104.4**) and a release candidate (**v1.107.0-rc.2**), both re-affirming cosign-signed Docker images. The issue tracker is dominated by accounting and routing correctness problems: spend/token semantics on cache hits, TPM limits that never refill under in-memory cache, and a least-busy routing strategy that can starve deployments. A large tranche of background-Responses billing fixes from mateo-berri is in flight and worth watching for anyone using `background: true` or `/v1/messages` bridging.

---

## 2. Releases & Breaking Changes

- **v1.104.4** (stable) — patch release; Docker images signed with cosign using the key from commit `0112e53`. → [Release](https://github.com/BerriAI/litellm/releases)
- **v1.107.0-rc.2** (RC) — same signing guarantee; test in staging before adopting. → [Release](https://github.com/BerriAI/litellm/releases)

**Breaking changes proposed in open PRs (not yet merged — plan config migrations now):**

- **`fix(logging)!`** — Responses `instructions` are redacted and no longer replayed via `previous_response_id` when `turn_off_message_logging` / `store_prompts_in_spend_logs` are enabled. Callers must send `instructions` on every turn. → [PR #43315](https://github.com/BerriAI/litellm/pull/43315)
- **`fix(github-copilot)!`** — GHE.com users must set `GITHUB_COPILOT_API_BASE`; caller-supplied Copilot `api_base` now requires `drop_params`. → [PR #34889](https://github.com/BerriAI/litellm/pull/34889)
- **`fix(proxy)!`** — "Ask AI" now returns HTTP 403 when the caller cannot access `gpt-4o-mini` (no model selected). → [PR #41851](https://github.com/BerriAI/litellm/pull/41851)
- **`fix(proxy)!`** — Raw `s3://` / `gs://` file IDs on `GET /files/{id}/content` are now readable again, but **only by proxy admin keys** (regression fix since v1.90.0). → [PR #40621](https://github.com/BerriAI/litellm/pull/40621)
- **`fix(responses)!`** — Anthropic compaction blocks now round-trip as `compaction` items; long-session summaries are preserved. → [PR #46754](https://github.com/BerriAI/litellm/pull/46754)

---

## 3. New Model & Hardware Support

- **Vertex AI Gemini 3.1 Flash TTS** — adds single/multi-speaker voice settings, plus mp3/opus/alaw/mulaw output previously rejected by Gemini TTS. → [PR #31915](https://github.com/BerriAI/litellm/pull/31915)
- **The Grid** — new JSON-configured OpenAI-compatible provider (inference spot market), `THEGRID_API_KEY`. → [PR #39907](https://github.com/BerriAI/litellm/pull/39907)
- **MCP SEP-2640 skills** — gateway gains `skills/list` / `skills/get` handlers with upstream-aware fan-out and `skill://` URI routing. → [PR #46348](https://github.com/BerriAI/litellm/pull/46348)
- **OpenAI image `detail: "original"`** — currently **rejected** by `token_counter`, causing pre-call checks to log ERROR and skip context-window validation. Tracked as a bug (see §5). → [Issue #47327](https://github.com/BerriAI/litellm/issues/47327)

---

## 4. Performance & Optimization

- **Cross-model-group collision guard** — new opt-in router setting `enable_cross_model_group_collision_check` rejects raw `litellm_params.model` strings shared by multiple model groups, preventing cross-group deployment leakage. → [PR #47534](https://github.com/BerriAI/litellm/pull/47534)
- **`api_base` URL join helper** — `join_api_base` / `ensure_api_route` eliminate `//` in provider paths, fixing 404s against default-config Envoy and Mistral. → [PR #47535](https://github.com/BerriAI/litellm/pull/47535) (supersedes [#46638](https://github.com/BerriAI/litellm/pull/46638))
- **Type safety sweep** — `Any` → proven types across 40 files; removes 129 `Any` errors. No runtime perf change, but reduces silent untyped-payload risk in hot paths. → [PR #47110](https://github.com/BerriAI/litellm/pull/47110)
- **Router discard cleanup** — `Router.discard` now unregisters strategy selectors and pre-call checks from global callback lists, preventing callback-list growth across long-lived processes. → [PR #45795](https://github.com/BerriAI/litellm/pull/45795)

---

## 5. Stability & Regressions

**High severity — billing / accounting correctness:**

- **TPM limit never refills under in-memory cache** — token window doesn't roll; keys lock out indefinitely until `/key/update`. Redis unaffected. → [Issue #47340](https://github.com/BerriAI/litellm/issues/47340)
- **`/v1/messages` budget reservation sizes against `max_input_tokens`** — triggered by Anthropic-format `tool_choice`; reservations massively over-sized vs. counted input. → [Issue #47396](https://github.com/BerriAI/litellm/issues/47396)
- **Stream truncation between `finish_reason` and `include_usage` billed as success** — cached tokens lost, billed at full input rate. → [Issue #47332](https://github.com/BerriAI/litellm/issues/47332) (CLOSED)
- **Background Responses spend not counted toward project/per-model budgets** — key can blow past budget on `background: true` calls. Fix PR open. → [PR #47504](https://github.com/BerriAI/litellm/pull/47504)
- **Background billed events bypass team/key Langfuse loggers** — teams logging to their own Langfuse project never see charges. Fix PR open. → [PR #47506](https://github.com/BerriAI/litellm/pull/47506)
- **Spend logs dropped since v1.99.0 for `id: null` providers** — request_id becomes `"None"`, collides on primary key (Databricks-Gemini). → [Issue #39749](https://github.com/BerriAI/litellm/issues/39749)
- **GitHub Copilot BYOK token counts zeroed** — regression between 1.103.1 and 1.104.2. → [Issue #45422](https://github.com/BerriAI/litellm/issues/45422)

**Medium severity — routing & streaming:**

- **Least-busy starves deployments** — response-cache hits drift counter negative, ties always pick first, counter not shared across workers. → [Issue #39322](https://github.com/BerriAI/litellm/issues/39322)
- **GZip SSE middleware withholds headers until first chunk** (since v1.105.0) — MCP `tools/call` streams stall until the 15s keepalive. → [Issue #46659](https://github.com/BerriAI/litellm/issues/46659)
- **Headroom guardrail can never rescue over-window requests** — compression runs *after* router pre-check rejects. → [Issue #46923](https://github.com/BerriAI/litellm/issues/46923)
- **SageMaker UTF-8 split across `PayloadPart` events** — per-event decode corrupts multibyte chars. → [Issue #46876](https://github.com/BerriAI/litellm/issues/46876) (CLOSED)
- **`aspeech` invokes sync provider twice** — Gemini TTS billed twice upstream. → [Issue #44546](https://github.com/BerriAI/litellm/issues/44546) (CLOSED)
- **`/v1/messages` + tools via `azure/responses/` bridge duplicates tool-call args** — invalid JSON. → [Issue #44835](https://github.com/BerriAI/litellm/issues/44835) (CLOSED)
- **Partial usage lost on mid-stream failure** — logs 0 completion tokens / $0 despite delivered text; worse under `/v1/messages` bridge. Fix PR open. → [PR #47537](https://github.com/BerriAI/litellm/pull/47537)

**Lower severity:**

- `ModuleNotFoundError: No module named 'mcp'` on tool-enabled requests. → [Issue #46045](https://github.com/BerriAI/litellm/issues/46045) (CLOSED)
- `default_priority` ignored when unset in router settings. → [Issue #36774](https://github.com/BerriAI/litellm/issues/36774) (CLOSED)
- Admin UI router settings crash on dict-based fallback entries (runtime supports them). → [Issue #26473](https://github.com/BerriAI/litellm/issues/26473)
- `hosted_vllm` `ssl_verify` ignored for audio transcription. → [Issue #33384](https://github.com/BerriAI/litellm/issues/33384)

---

## 6. What This Means for Application Developers

- **If you run without Redis, TPM is not a per-minute limit today** — it behaves as a fixed budget until `/key/update`. Either stand up Redis or avoid tight TPM caps on in-memory-cache deployments. → [#47340](https://github.com/BerriAI/litellm/issues/47340)
- **Audit your Anthropic-shaped `/v1/messages` traffic with `tool_choice`** — budget reservations are inflated to `max_input_tokens`, which can trigger false budget rejections on otherwise small requests. → [#47396](https://github.com/BerriAI/litellm/issues/47396)
- **Background Responses (`"background": true`) currently do not stop at budget** — if you expose this to end users, enforce budget at your app layer until [#47504](https://github.com/BerriAI/litellm/pull/47504) merges.
- **Response cache + spend logs are on different bases** — spend zeroes on cache hits but token columns replay original usage. Pick a reporting basis explicitly (spend vs. tokens) and don't mix them in dashboards. → [#39057](https://github.com/BerriAI/litellm/issues/39057)
- **Long sessions behind `/v1/responses` with Anthropic compaction** — until [#46754](https://github.com/BerriAI/litellm/pull/46754) lands, compaction summaries are dropped; keep session context in your app or avoid relying on compaction.
- **Image inputs with `detail: "original"`** silently bypass context-window checks today — sanitize to `auto`/`high`/`low` in client code until [#47327](https://github.com/BerriAI/litellm/issues/47327) is resolved.
- **Least-busy routing is not safe for multi-worker, cache-heavy workloads** — prefer Redis-backed counters or a different strategy for latency-sensitive fleets. → [#39322](https://github.com/BerriAI/litellm/issues/39322)
- **Plan for the Copilot/GHE base-URL env var migration** before adopting the next minor; set `GITHUB_COPILOT_API_BASE` now to avoid a surprise break. → [#34889](https://github.com/BerriAI/litellm/pull/34889)

</details>

<details>
<summary><strong>Unsloth</strong> — <a href="https://github.com/unslothai/unsloth">unslothai/unsloth</a></summary>

# Unsloth Digest — 2026-10-20

## 1. Today's Highlights

Unsloth shipped **v0.1.909-beta**, headlined by day-one local support for **DeepSeek-V4.1-Flash-1017** (552B total / 16B active) and **FLUX.3 Image Klein**, plus **FSDP2 multi-GPU training (alpha)** and **one-command MCP setup** for coding agents ([release notes](https://github.com/unslothai/unsloth/releases)). On the infrastructure side, a large batch of edges landed from `danielhanchen`: native FSDP2 wrapping ([#14273](https://github.com/unslothai/unsloth/pull/14273)), multi-GPU diffusion/CFG-parallel placement ([#13725](https://github.com/unslothai/unsloth/pull/13725)), and system-packaged Linux runtime support ([#14252](https://github.com/unslothai/unsloth/pull/14252)). MLX work is accelerating with stacked PRs from `Lyxot` adding expert offload and fixing memory estimation for DeepSeek V4/V4.1 and GLM-5.3 ([#14325](https://github.com/unslothai/unsloth/pull/14325), [#14326](https://github.com/unslothai/unsloth/pull/14326)).

## 2. Releases & Breaking Changes

- **v0.1.909-beta** — DeepSeek-V4.1 & FLUX.3 support; images and videos in chat; FSDP2 alpha; one-command MCP setup. Details in [release entry](https://github.com/unslothai/unsloth/releases).
- **FSDP2 is opt-in**, gated behind `UNSLOTH_FSDP2=1` under `torchrun`. No default behavior change; works with LoRA, QLoRA, and full finetuning ([PR #14273](https://github.com/unslothai/unsloth/pull/14273)).
- **`UNSLOTH_BLOCK_COMPILE=0` is a required workaround** for a new regression introduced in 2026.10.6 (see §5) — see [Issue #14063](https://github.com/unslothai/unsloth/issues/14063).
- **Test-suite behavioral change**: `test_diffusion_segment_quant.py` now verifies RoPE tables by name-matching rather than exact key equality; CI users pinned to specific commit hashes should re-baseline ([PR #14318](https://github.com/unslothai/unsloth/pull/14318)).

## 3. New Model & Hardware Support

- **DeepSeek-V4.1-Flash-1017** — 552B total / 16B active, runs locally at ~125 GB; loading requires `unsloth-zoo#1892` in MLX ([Release](https://github.com/unslothai/unsloth/releases); [PR #14326](https://github.com/unslothai/unsloth/pull/14326)).
- **FLUX.3 Image Klein** — now catalogued and runnable, including fp8mixed text encoders compatible with ComfyUI `qwen_3_8b_fp8mixed.safetensors` ([PR #14321](https://github.com/unslothai/unsloth/pull/14321), [PR #14316](https://github.com/unslothai/unsloth/pull/14316)).
- **GLM-5.3-Flash** — MLX loading support via `unsloth-zoo#1893` ([PR #14326](https://github.com/unslothai/unsloth/pull/14326)).
- **MLX PLE + expert offload** — new `FastMLXModel.from_pretrained(offload=...)` path, enabling memory-constrained Apple Silicon inference of MoE checkpoints ([PR #14326](https://github.com/unslothai/unsloth/pull/14326)).
- **Multi-GPU diffusion** — generic component- and denoiser-boundary placement with CFG-parallel; no NCCL dependency ([PR #13725](https://github.com/unslothai/unsloth/pull/13725)).
- **ROCm 7.14 / ROCm 10** — requested by users; currently only ROCm 7.2 PyTorch builds ship ([Issue #9932](https://github.com/unslothai/unsloth/issues/9932)).

## 4. Performance & Optimization

- **MLX memory estimator no longer allocates the model** — previously, opening Run Settings on GLM-5.3-Flash grew the estimate past 12 GiB and could get the process OOM-killed; new path uses a non-allocating estimate and correct sizing for DeepSeek V4/V4.1 ([PR #14325](https://github.com/unslothai/unsloth/pull/14325)).
- **Native FSDP2 per-block + root sharding** with `MixedPrecisionPolicy` (params in compute dtype, gradients reduced fp32) — covers LoRA, QLoRA, and full FT uniformly across all supported models ([PR #14273](https://github.com/unslothai/unsloth/pull/14273)).
- **Diffusion multi-card utilization** — previously collapsed to the highest-free-VRAM card, leaving a second GPU idle; new placement policy activates both ([PR #13725](https://github.com/unslothai/unsloth/pull/13725)).
- **Startup bundle at 6684.2 KB raw / 2012.7 KB transfer** — over budget by 0.4 KB; budget raised for FLUX.3 controls ([PR #14319](https://github.com/unslothai/unsloth/pull/14319)). Note for anyone tracking frontend perf regressions.

## 5. Stability & Regressions

Ranked by severity:

1. **`CheckpointError` on step-1 backward in all distributed runs** (2026.10.6+) — new per-decoder-layer block compile is not recomputation-safe under non-reentrant gradient checkpointing. Reproduces across architectures. **Workaround:** `UNSLOTH_BLOCK_COMPILE=0`. No fix PR yet. ([Issue #14063](https://github.com/unslothai/unsloth/issues/14063))
2. **Studio backend stalls 10–33s on macOS CI, serves nothing, then recovers** — acknowledged as real and unfixed on `main` by maintainer ([Issue #9712](https://github.com/unslothai/unsloth/issues/9712)).
3. **`Max Tool Call Duration` slider ignored for HTTP/SSE MCP tools** — calls always cap at 5 minutes regardless of slider, on v0.1.909-beta ([Issue #14298](https://github.com/unslothai/unsloth/issues/14298)).
4. **Model Hub filters regression** — new filter UI returns unexpected results ([Issue #14221](https://github.com/unslothai/unsloth/issues/14221)).
5. **Studio lost models from custom dirs after update** ([Issue #13926](https://github.com/unslothai/unsloth/issues/13926)).
6. **`undefined is not an object (t.scrollbarGutter.includes)` on macOS v0.1.908** — closed, presumably fixed in .909 ([Issue #14055](https://github.com/unslothai/unsloth/issues/14055)).
7. **AMD audio runtime not installed** on desktop app, requires `unsloth studio update` ([Issue #14052](https://github.com/unslothai/unsloth/issues/14052)).
8. **Browser-panel correctness cluster** — copy buttons no-op in Chrome/Edge ([#14284](https://github.com/unslothai/unsloth/pull/14284)), typed form data lost across 3+ tabs ([#14280](https://github.com/unslothai/unsloth/pull/14280)), bookmark save resets page ([#14286](https://github.com/unslothai/unsloth/pull/14286)), radio/checkbox-by-label broken ([#14282](https://github.com/unslothai/unsloth/pull/14282)), docs sites fail to render ([#14279](https://github.com/unslothai/unsloth/pull/14279), [#14323](https://github.com/unslothai/unsloth/pull/14323)). All have fix PRs open. Related security fix: extensionless downloads bypassing warnings ([#14278](https://github.com/unslothai/unsloth/pull/14278)).
9. **`UNSLOTH_HOME` ignored by installers** — Linux/macOS install succeeds then CLI fails with "Studio not set up"; Windows fails during setup. Fix PR open ([#14293](https://github.com/unslothai/unsloth/pull/14293)).
10. **MLX test-suite isolation** — 24–34 failures depending on invocation, Apple Silicon M2 / mlx 0.31.2 ([Issue #8138](https://github.com/unslothai/unsloth/issues/8138)).

## 6. What This Means for Application Developers

- **If you train multi-GPU**: enable `UNSLOTH_FSDP2=1` to get uniform block-level sharding across LoRA/QLoRA/full FT — but **do not** leave block compile at defaults for distributed runs until #14063 is fixed. Set `UNSLOTH_BLOCK_COMPILE=0` in your launch scripts as a defensive measure.
- **If you ship Unsloth Studio as an agent backend**: the MCP story got much better in .909 (one-command setup = lower integration friction), but the `Max Tool Call Duration` cap for HTTP/SSE MCP tools is a hard 5-minute ceiling regardless of UI. Design long-running tools around it (polling, chunked results) until patched.
- **`/v1/completions` + logprobs on non-GGUF backends** — the long-standing 503 for MLX/Transformers models is now marked CLOSED ([#7703](https://github.com/unslothai/unsloth/issues/7703)). If you were routing eval workloads (lm-eval-harness, likelihood scoring) to LM Studio/vLLM because of this, re-test against Studio. Non-GGUF is no longer chat-only.
- **Multi-model serving with per-device pinning** ([#9257](https://github.com/unslothai/unsloth/issues/9257)) is also CLOSED — check whether the concurrent-load feature shipped in .909. If you were running one Studio instance per model+GPU, you may be able to consolidate.
- **Prompt/context management**: reactive auto-compaction already exists; a proposal for proactive trimming (spilling tool results and duplicate attachments to disk) is filed and worth tracking if you push long agent traces through Studio ([#9985](https://github.com/unslothai/unsloth/issues/9985)).
- **Local DeepSeek-V4.1 as an agent backbone** is now realistic at ~125 GB resident — a single 8×H100/H200 node or a high-VRAM workstation with offload. Pair with FSDP2 if you also fine-tune it.
- **AMD users**: hold on ROCm 10 support; you are pinned to 7.2 builds unless you build PyTorch yourself ([#9932](https://github.com/unslothai/unsloth/issues/9932)).

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*