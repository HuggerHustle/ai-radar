# AI Infrastructure Digest 2026-10-21

> Generated: 2026-10-20 23:47 UTC | Projects covered: 6

- [vLLM](https://github.com/vllm-project/vllm)
- [SGLang](https://github.com/sgl-project/sglang)
- [llama.cpp](https://github.com/ggml-org/llama.cpp)
- [Ollama](https://github.com/ollama/ollama)
- [LiteLLM](https://github.com/BerriAI/litellm)
- [Unsloth](https://github.com/unslothai/unsloth)

---

## Cross-Project Comparison

⚠️ Comparative analysis generation failed.

---

## Per-Project Reports

<details>
<summary><strong>vLLM</strong> — <a href="https://github.com/vllm-project/vllm">vllm-project/vllm</a></summary>

# vLLM Digest — 2026-10-21

Source: [github.com/vllm-project/vllm](https://github.com/vllm-project/vllm) · 107 issues and 500 PRs updated in the last 24h

---

## 1. Today's Highlights

No releases landed in the last 24 hours, so activity is concentrated in hardware enablement and model-specific optimization: the hottest thread is the open request for **SM8x (A100/A800/RTX 30xx) support for DeepSeek-V4-Flash** ([#50576](https://github.com/vllm-project/vllm/issues/50576), 112 comments), and the **Rust frontend parity roadmap** continues to accumulate work ([#44280](https://github.com/vllm-project/vllm/issues/44280)). On the regression side, the unresolved **GLM-5.3-Flash CUDA illegal memory access on 4×B200** ([#54317](https://github.com/vllm-project/vllm/issues/54317)) remains the highest-severity open bug, and the **HF3FS metadata server page-pool leak** ([#62389](https://github.com/vllm-project/vllm/issues/62389)) is a new failure mode for checkpoint/weight saving.

---

## 2. Releases & Breaking Changes

None. No new versions, API changes, or migration notes were published in the last 24h.

---

## 3. New Model & Hardware Support

- **DeepSeek-V4-Flash / V4-Flash-0731 on SM8x** — still unsupported on Ampere; neither checkpoint runs on A100/A800 or RTX 30xx. Follow-on from #40851. [#50576](https://github.com/vllm-project/vllm/issues/50576)
- **gfx1201 / RDNA4 FP8 path** — upstream request for the vllm-rocm FP8 patch; the author notes the explicit `gfx1201` branch may be unnecessary since the existing fallthrough already reaches Gemm-w8a8. [#28649](https://github.com/vllm-project/vllm/issues/28649)
- **DeepSeek V4.1 tracker** — MegaAttention, sparse logits indexer, DeepSelect, Mega mHC and Mega gate are landed; **GVR2 (#57109) is the last open kernel item**. [#57448](https://github.com/vllm-project/vllm/issues/57448)
- **Cake kernels via FlashInfer** — model-by-model integration tracker; shape coverage and correctness are not yet validated end-to-end in serving. [#59725](https://github.com/vllm-project/vllm/issues/59725)
- **StartLux-Decision pooling (PR)** — native pooling for Qwen3.5 4B dense and 35B-A3B MoE with last-prompt-token A–Z logits and FP32 output-head projection. [#60375](https://github.com/vllm-project/vllm/pull/60375)
- **ViT Full CUDA Graph (RFC)** — tracker for capturing the vision encoder forward pass for Qwen3-VL, Qwen3.5, GLM-V and Kimi K2.5 multimodal serving. [#38175](https://github.com/vllm-project/vllm/issues/38175)
- **jina-reranker-v3** — model request closed. [#28557](https://github.com/vllm-project/vllm/issues/28557)

---

## 4. Performance & Optimization

- **Qwen3.8-2.4T-A95B on gfx950 / MI355X** — MXFP4 (Quark) optimization plan landing as stacked PRs. [#57149](https://github.com/vllm-project/vllm/issues/57149)
- **Qwen3.8-Flash-Next on gfx950 / MI355X** — GatedDeltaNet in 36 layers, QuerySparse Attention in 12, HyperConnection gated residual, MXFP4 MoE. [#59575](https://github.com/vllm-project/vllm/issues/59575)
- **Qwen3.8-Flash-Next general tracker** — removes `torch.compile` for the NVIDIA path, fuses Qwen4Exp PLE kernels, and separates prefill/decode QSA indexer paths. [#55922](https://github.com/vllm-project/vllm/issues/55922)
- **DiffKV prefill tiling on SM80** — `BLOCK_M=128` + KV tile 64 yields **3.0× on 200K-context chunks**; with GQA at 16 query heads per KV head the current `BLOCK_M=16` path reloads the whole KV tile per position. [#61095](https://github.com/vllm-project/vllm/issues/61095)
- **Octave KV (RFC)** — native 3-bit KV cache for AMD GPUs; motivated by Qwen3.8-27B GPTQ W4A16 on 4×RX 7900 XTX (96 GB, TP4 + MTP) with long-prompt workloads. PR: [#59774](https://github.com/vllm-project/vllm/pull/59774). RFC: [#59773](https://github.com/vllm-project/vllm/issues/59773)
- **Triton top-k/​top-p kernel** — the monolithic kernel's gather pivot is fit to only the first 8192 logits, causing a **full-vocab fallback on 6–10% of rows** at typical k on MiMo-V2.6 logits. [#61998](https://github.com/vllm-project/vllm/issues/61998)
- **GLM-5.3 optimization** — further CUDA work on the shared `glm_moe_dsa` architecture. [#57406](https://github.com/vllm-project/vllm/issues/57406)
- **ROCm DeepSeek-V4.1 prefill** — keeps one decoder-replay row on unfinished prefill chunks on gfx942 instead of `min(query_len, 128)`; CUDA unchanged. [#61682](https://github.com/vllm-project/vllm/pull/61682)
- **XPress speculative decoding (PR)** — causal refiner for block-diffusion drafters, added as a V1 spec-decode method alongside DFlash/DSpark. [#54448](https://github.com/vllm-project/vllm/pull/54448)
- **Adaptive DSpark bring-up** — adaptive verification requires attention backends to avoid CPU-side query lengths as source of truth. [#51303](https://github.com/vllm-project/vllm/issues/51303)
- **mypy rollout in `tests/`** — incremental `--follow-imports silent` adoption, one directory at a time. [#49569](https://github.com/vllm-project/vllm/issues/49569)

---

## 5. Stability & Regressions

Ranked by severity:

1. **GLM-5

</details>

<details>
<summary><strong>SGLang</strong> — <a href="https://github.com/sgl-project/sglang">sgl-project/sglang</a></summary>

# SGLang Digest — 2026-10-21

## 1. Today's Highlights

Activity is dominated by Q4 roadmap execution: the PD Disaggregation 2026-Q4 roadmap (#43699) and the Agentic Cache Scheduling roadmap (#43098) both saw updates, signaling that disaggregated serving and supernode-wide KV sharing are the two biggest architectural bets this quarter. On the stability side, a cluster of high-severity correctness bugs surfaced or persisted — most notably stale KV in PD prefill with HiCache (#44070), a native gRPC token-cap bug (#44136), and a `pause_generation` deadlock (#44835). Meanwhile, the AMD/ROCm track landed a wave of DeepSeek-v4.1 memory-pool and prefill-CP work, and an UltraQuant MXFP4 KV cache backend entered review.

## 2. Releases & Breaking Changes

No new releases in the last 24h. However, two config/behavior changes are worth flagging:

- **`ServerArgs` positional field order** — PR #44991 (merged) fixed a regression where inserting `enable_megamoe_for_layernorm_sp` shifted existing positional constructor slots (notably `disable_...` at index 95). If you construct `ServerArgs` positionally rather than by keyword, audit your call sites. [sgl-project/sglang PR #44991](https://github.com/sgl-project/sglang/pull/44991)
- **Native gRPC `max_new_tokens` default** — PR #44136 (open) fixes a silent 128-token cap when `max_new_tokens` is unset on the `--grpc-port` server. Until merged, gRPC clients should always set the field explicitly. [sgl-project/sglang PR #44136](https://github.com/sgl-project/sglang/pull/44136)

## 3. New Model & Hardware Support

- **GLM-5.3-Flash on SM120 (RTX PRO 6000)** — Bug #42012 documents that `fa4` attention crashes at CUDA-graph capture on hybrid extend; **triton is currently the only working backend** on SM120. [Issue #42012](https://github.com/sgl-project/sglang/issues/42012)
- **GLM-5.3-Flash on Hopper (SM90)** — New performance tracking issue #45373 opened as part of the Q4 kernel-optimization roadmap. [Issue #45373](https://github.com/sgl-project/sglang/issues/45373)
- **Kimi-K3 on multi-node GB300/MNNVL** — Supported but currently hits startup OOM under specific configs (see Stability). [Issue #45345](https://github.com/sgl-project/sglang/issues/45345)
- **UltraQuant MXFP4 KV cache (ROCm)** — PR #41949 adds an MXFP4 (FP4 E2M1 + UE8M0 group scale, Hadamard-rotated keys) KV backend for AMD; reported to match FP8 KV at low concurrency on Qwen3.5-397B-A17B. [PR #41949](https://github.com/sgl-project/sglang/pull/41949)
- **Muse Spark** — Day-0 support is being landed as a split PR stack (#44664–#44667), with a dependency on a DeepGEMM patch. [Issue #44678](https://github.com/sgl-project/sglang/issues/44678)
- **DoRA adapters** — Feature request #22124 closed (support landed). [Issue #22124](https://github.com/sgl-project/sglang/issues/22124)
- **Ascend NPU** — Topology-aware CPU/NUMA affinity for worker ranks proposed. [Issue #39348](https://github.com/sgl-project/sglang/issues/39348)

## 4. Performance & Optimization

- **EAGLE spec-decode KV index building** — PR #42803 parallelizes index construction over token blocks across flashinfer / flashinfer_mla / aiter draft+verify paths; targets long-context (90k–170k KV) overhead. [PR #42803](https://github.com/sgl-project/sglang/pull/42803)
- **AMD DeepSeek-v4.1 memory pool (1/3–3/3 stack)** — PRs #45463/#45464/#45465 fold encoder SWA replay into extend and move decode/verify onto a per-request window ring on HIP. [PR #45463](https://github.com/sgl-project/sglang/pull/45463) · [PR #45464](https://github.com/sgl-project/sglang/pull/45464) · [PR #45465](https://github.com/sgl-project/sglang/pull/45465)
- **AMD DeepSeek-v4.1 prefill context parallel** — PR #43465 adds prefill CP for DeepSeek-v4.1 on ROCm. [PR #43465](https://github.com/sgl-project/sglang/pull/43465)
- **Quark W4A4 MXFP4 GEMM on ROCm** — PR #39598 adds opt-in AITER ASM FP4 GEMM for Quark dense linear, enabling AITER's tuned CK/ASM tables currently unavailable to SGLang. [PR #39598](https://github.com/sgl-project/sglang/pull/39598)
- **MoE temporary memory reduction** — PR #45462 reduces transient allocations in Muse Marlin gate-up/down (non-overlapping lifetimes) and dynamic W4A8 input scaling. [PR #45462](https://github.com/sgl-project/sglang/pull/45462)
- **FA4 SWA buffers under CUDA graphs** — PR #44413 keeps `_swa_align_seqlens` / `_swa_align_leftpad` fixed-size so lazy growth no longer invalidates captured graphs. [PR #44413](https://github.com/sgl-project/sglang/pull/44413)
- **KV sharding overpadding** — Issue #45155 (closed) identified that shared-prefix all-gather blocks over-allocate per-rank, wasting bandwidth with `--enable-kv-cache-sharding`. [Issue #45155](https://github.com/sgl-project/sglang/issues/45155)
- **Adaptive Speculative Decoding roadmap** — #23705 explores variable draft depth to match acceptance rate per phase; relevant for bursty agentic workloads. [Issue #23705](https://github.com/sgl-project/sglang/issues/23705)

## 5. Stability & Regressions

Ranked by severity:

1. **Stale KV on decode under PD prefill + HiCache** (#44070, open) — With `SGLANG_DISAGG_PREFILL_EARLY_SEND_CACHED_PREFIX=1`, early cached-prefix send can transfer KV before HiCache load-back completes, causing **silent** correctness corruption for requests sharing a prefix resident only in host memory. High severity due to silent data corruption. No fix PR referenced yet. [Issue #44070](https://github.com/sgl-project/sglang/issues/44070)
2. **`pause_generation` deadlock** (#44835, open) — Calling `pause_generation(in_place)` then `pause_generation(abort)` hangs the server until the watchdog kills it. [Issue #44835](https://github.com/sgl-project/sglang/issues/44835)
3. **FLA kernels fail to compile on nightly-cu134** (#45426, open) — Triton removed `tl.make_block_ptr`, breaking Qwen3.5-397B-A17B-NVFP4 prefill CUDA-graph capture. Nightly-only at present. [Issue #45426](https://github.com/sgl-project/sglang/issues/45426)
4. **Startup OOM on multi-node GB300/MNNVL (Kimi-K3)** (#45345, open) — `--tokenizer-worker-num 32` plus auto-selected `cuda_vmm` transport OOMs before any request; root cause narrowed to eager tokenizer worker init rather than transport itself. [Issue #45345](https://github.com/sgl-project/sglang/issues/45345)
5. **GLM-5.3-Flash EAGLE CUDA illegal memory access** (#45159, open) — TP8/EP8 on 8×H20, crash in `run_eagle_verify` → `build_grammar_vocab_mask`. [Issue #45159](https://github.com/sgl-project/sglang/issues/45159)
6. **NIXL/UCX prefill segfault still unresolved** (#35189, closed-as-inactive) — Reproduces on v0.5.17 / CUDA 13.0 / B200; prior issues closed without root cause. Worth escalating. [Issue #35189](https://github.com/sgl-project/sglang/issues/35189)
7. **Tool-call parser regressions (qwen3_coder / Mistral)** — #45235 (strict tool causes invented args on non-strict zero-arg tools), #45224 (one uncompilable schema fails the whole request under `SGLANG_TOOL_STRICT_LEVEL=2`), #45225 (structural tag triggers on literal text rather than `<tool_call>` token). Fix PRs: #44224 (Mistral bracket preservation) and #45466 (do not cache grammar poll timeouts as invalid). [Issue #45235](https://github.com/sgl-project/sglang/issues/45235) · [Issue #45224](https://github.com/sgl-project/sglang/issues/45224) · [Issue #45225](https://github.com/sgl-project/sglang/issues/45225) · [PR #44224](https://github.com/sgl-project/sglang/pull/44224) · [PR #45466](https://github.com/sgl-project/sglang/pull/45466)
8. **IGW worker stuck as `model_id: "unknown"`** (#37554, closed) — Failed metadata discovery left a worker permanently registered and taking no traffic while reporting healthy — a silent capacity-loss failure mode. [Issue #37554](https://github.com/sgl-project/sglang/issues/37554)
9. **Inkling multimodal returns 500 instead of 400** (#40897, closed) — Input-validation contract fix. [Issue #40897](https://github.com/sgl-project/sglang/issues/40897)
10. **CI flakiness** — Tracker #42752 (112 comments) and CUDA coredump tracker #26340 (349 comments) remain active; CI maintenance mode (#21065) was re-touched today. [Issue #42752](https://github.com/sgl-project/sglang/issues/42752) · [Issue #26340](https://github.com/sgl-project/sglang/issues/26340)

## 6. What This Means for Application Developers

- **If you run PD disaggregation with HiCache**, treat #44070 as the top risk this week: it produces *silently wrong* output, not errors. Until a fix lands, consider disabling `SGLANG_DISAGG_PREFILL_EARLY_SEND_CACHED_PREFIX` if your workload has high prefix reuse across requests.
- **Agentic workloads on qwen3_coder**: watch the tool-constraint cluster (#45224/#45235/#45225). If you use `strict: true` with multiple tools, a single bad schema currently fails the entire request — validate schemas client-side before sending. The grammar-poll timeout caching fix (#45466) removes a failure mode where a transient timeout permanently poisoned a grammar key.
- **gRPC users**: always set `max_new_tokens` explicitly until #44136 merges; unset currently means 128, not unlimited.
- **AMD/ROCm deployments** are advancing quickly on DeepSeek-v4.1 (prefill CP, memory-pool refinements) and now have an MXFP4 KV option for long-context/agentic capacity. Worth benchmarking against FP8 KV on your model.
- **SM120 / RTX PRO 6000 users with GLM-5.3-Flash**: pin to the triton attention backend explicitly; `fa4` will crash at graph capture.
- **Capacity planning**: the IGW `model_id: "unknown"` bug (#37554) is a reminder to alert on *request distribution per worker*, not just pod readiness — a healthy-looking fleet can be partially idle.

</details>

<details>
<summary><strong>llama.cpp</strong> — <a href="https://github.com/ggml-org/llama.cpp">ggml-org/llama.cpp</a></summary>

# llama.cpp Digest — 2026-10-21

## 1. Today's Highlights

A heavy release day centered on **backend breadth**: zdnn gains Flash Attention, OpenCL picks up a large batch of GEMM/ARGMAX/conv kernels, and Metal fixes a missing MoE kernel variant. Server-side, the Anthropic `/v1/messages` path now forwards `id_slot`, and a realtime transcription API plus a `/tts` endpoint are landing. On the regression front, long-context quality issues on RDNA4 HIP with `head_dim 256` remain the most serious open item.

## 2. Releases & Breaking Changes

- **b11765** — Kolibri-1 router: removed redundant `ggml_prec_set_*` overrides now that the router matmul runs at default precision. [#30865](https://github.com/ggml-org/llama.cpp/pull/30865)
- **b11763** — OpenCL: new small-batch GEMM variants; fixes OOB read in `mul_mv_mxfp4_f32_flat`; removes the large-N guard that forced CPU weight placement. [#30850](https://github.com/ggml-org/llama.cpp/pull/30850)
- **b11761** — ggml-cpu: ARM NEON F32→F16 conversion path selected correctly (was falling through to portable software conversion). [#30505](https://github.com/ggml-org/llama.cpp/pull/30505)
- **b11756** — **Server API change**: `id_slot` is now propagated through the Anthropic `/v1/messages` → OAI conversion whitelist, so Anthropic-format callers can pin requests to a specific slot. [#28554](https://github.com/ggml-org/llama.cpp/pull/28554)
- **b11753** — Vocab: added `\p{M}` to lookaheads in Tekken and GPT-4o pre-tokenizer regexes (see regressions, #30787). [#30845](https://github.com/ggml-org/llama.cpp/pull/30845)

No config-format or GGUF schema breaks today. The `id_slot` change is additive but worth noting for anyone relying on Anthropic-format passthrough behavior.

## 3. New Model & Hardware Support

- **IBM zDNN (z/Architecture accelerator)**: Flash Attention op introduced, plus a scratch buffer pool replacing scratch slots. [#30512](https://github.com/ggml-org/llama.cpp/pull/30512)
- **Metal**: added the missing MoE kernel variant for **9 experts per token** — this is the fix for the Nemotron 3.5 Bolt 74B-A9B segfault. [#30699](https://github.com/ggml-org/llama.cpp/pull/30699) / issue [#30610](https://github.com/ggml-org/llama.cpp/issues/30610)
- **OpenCL**: broad kernel expansion in flight — F32→I32 ARGMAX, IM2COL_3D (ported from CUDA), depthwise CONV_2D_DW, RoPE build fix for newer Clang, and explicit `extra_q8_0` layout. [#30897](https://github.com/ggml-org/llama.cpp/pull/30897), [#30895](https://github.com/ggml-org/llama.cpp/pull/30895), [#30900](https://github.com/ggml-org/llama.cpp/pull/30900), [#30893](https://github.com/ggml-org/llama.cpp/pull/30893), [#30899](https://github.com/ggml-org/llama.cpp/pull/30899)
- **Hexagon**: neon-vectorized + threaded repack (bit-exact vs. scalar), targeting faster load of K-quants and Q1/Q2_0. [#30901](https://github.com/ggml-org/llama.cpp/pull/30901)
- **SYCL**: `set_tensor_2d` implementation for faster tensor-split loading. [#30358](https://github.com/ggml-org/llama.cpp/pull/30358)
- **LFM2.5** support is being unblocked across backends — OpenVINO skips 0-byte tensors, OpenCL adds ARGMAX. [#30709](https://github.com/ggml-org/llama.cpp/pull/30709)

## 4. Performance & Optimization

- **Qwen4exp / QSA fused op** (in review): fusing 25 ops into one. Reported `pp2048` gains of **+5.2% on RTX PRO 6000** and **+3.9% on DGX Spark GB10**. [#30640](https://github.com/ggml-org/llama.cpp/pull/30640); a prototype variant removing `kq_mask` from QSA selection is also up. [#30815](https://github.com/ggml-org/llama.cpp/pull/30815)
- **x86 VNNI Q2_0 dot product**: ~**3x speedup** for VNNI-capable CPUs (AVX-VNNI / AVX-512 VNNI+VL), bit-exact against the generic path over 14k randomized comparisons. [#26348](https://github.com/ggml-org/llama.cpp/pull/26348)
- **CUDA graph cache key** now includes first-node extents, preventing warmup-state invalidation under speculative decoding. [#28666](https://github.com/ggml-org/llama.cpp/pull/28666)
- **LFM2 short-conv reordering**: batched decode now issues one GEMM across sequences instead of per-sequence GEMVs (repeat weight reads eliminated). [#30831](https://github.com/ggml-org/llama.cpp/pull/30831)
- **Hexagon op fusion refactor** with new `BINARY_NX` fusion (back-to-back ADDs etc.). [#30843](https://github.com/ggml-org/llama.cpp/pull/30843)

## 5. Stability & Regressions

Ranked by severity:

1. **Flash Attention corruption on gfx1201 (RDNA4), head_dim 256** — with FA enabled, long-context prefill yields corrupted logits; first token is high-confidence EOS. Affects Qwen3.8-27B. [#30884](https://github.com/ggml-org/llama.cpp/issues/30884) — **no fix yet**, highest-impact item open today.
2. **Vulkan deep-context decode collapse (~8x, 1k→64k) on Intel Arc Pro B70 (Xe2)** — backend-intrinsic; SYCL degrades only ~2.4x. [#28721](https://github.com/ggml-org/llama.cpp/issues/28721)
3. **Qwen3.8-27B hybrid Gated DeltaNet: ~25x decode collapse beyond ~80K context** on CUDA, prompt processing unaffected. [#27623](https://github.com/ggml-org/llama.cpp/issues/27623)
4. **HIP multi-GPU Windows (gfx1100 + gfx1201) silently produces fluent gibberish** — single-GPU HIP and dual-GPU Linux are correct. [#28676](https://github.com/ggml-org/llama.cpp/issues/28676)
5. **Tokenizer regression (CLOSED today)**: GPT-4o/Tekken pre-tokenizers split combining marks off letters (Hindi, Thai), causing token IDs to diverge from HF. [#30787](https://github.com/ggml-org/llama.cpp/issues/30787) — addressed by [#30845](https://github.com/ggml-org/llama.cpp/pull/30845).
6. **RPC: DeepSeek V4 output degenerates to repeated token** with two RPC workers after a long prompt; slot stays corrupted. [#30794](https://github.com/ggml-org/llama.cpp/issues/30794)
7. **Vulkan: `DEVICE_LOCAL|HOST_VISIBLE` buffers exhaust WDDM shared budget** on non-ReBAR Windows, causing `ErrorOutOfDeviceMemory`. [#30888](https://github.com/ggml-org/llama.cpp/issues/30888)
8. **ROCm 6.3.4 compile failure**: `group_mask_warp_inplace` no matching function. [#30755](https://github.com/ggml-org/llama.cpp/issues/30755); separate HIP compile break on MI210/gfx9a Debian 12. [#30869](https://github.com/ggml-org/llama.cpp/issues/30869)
9. **`--moe-cache-mib` crashes at load on Vulkan (RX 6900 XT, Windows)**. [#30697](https://github.com/ggml-org/llama.cpp/issues/30697)
10. **json-schema-to-grammar silently drops `minLength`/`maxLength`** when a `pattern` is also present — silent correctness bug affecting constrained decoding. [#30749](https://github.com/ggml-org/llama.cpp/issues/30749)
11. **`/v1/responses` streaming contract deviations**: `function_call_arguments.done` never emitted; truncated tool calls reported as completed. [#30773](https://github.com/ggml-org/llama.cpp/issues/30773)

## 6. What This Means for Application Developers

- **Anthropic-format integrations get slot control.** If you proxy Claude-format requests through llama-server and use multi-slot scheduling, you can now pin `id_slot` end-to-end. [#28554](https://github.com/ggml-org/llama.cpp/pull/28554)
- **OpenAI Responses API consumers should audit tool-call handling.** Until [#30773](https://github.com/ggml-org/llama.cpp/issues/30773) is fixed, do not assume a truncated tool call terminates as failed — and don't wait on `function_call_arguments.done`, which is never sent. Use `/v1/chat/completions` if your stack depends on strict streaming semantics.
- **Constrained decoding users: validate your length bounds.** [#30749](https://github.com/ggml-org/llama.cpp/issues/30749) means a schema combining `pattern` and `maxLength` will permit overlong output with no warning.
- **RDNA4 / long-context deployments should pin known-good builds.** The gfx1201 FA corruption (#30884) and Qwen3.8 DeltaNet decode cliff (#27623) both hit after long prefill; if you serve reasoning or RAG workloads with 64K+ contexts on these parts, keep FA off or hold the last verified build.
- **Multi-GPU HIP on Windows is not production-safe yet** (#28676) — silent gibberish is worse than a crash. Route to Linux HIP or single-GPU for now.
- **Audio workloads are opening up**: realtime transcription (`/v1/realtime` WS, OAI-compatible) in [#30636](https://github.com/ggml-org/llama.cpp/pull/30636), `/tts` in [#26603](https://github.com/ggml-org/llama.cpp/pull/26603), and a multimodal gen-state API refactor in [#30902](https://github.com/ggml-org/llama.cpp/pull/30902) to prepare for models like chatterbox. Worth tracking if you're building voice agents on llama.cpp rather than bolting on a separate stack.
- **CPU-only x86 deployments should watch [#26348](https://github.com/ggml-org/llama.cpp/pull/26348)** — a 3x Q2_0 dot-product gain materially changes the viability of 2-bit quants on VNNI-capable server CPUs.

</details>

<details>
<summary><strong>Ollama</strong> — <a href="https://github.com/ollama/ollama">ollama/ollama</a></summary>

# Ollama Digest — 2026-10-21

## 1. Today's Highlights

No new releases landed in the last 24 hours, but the issue and PR queues were active: a cluster of **regressions in the 0.40.x llama-server–based builds** surfaced (Vulkan device loss on Intel Arc, NVIDIA GPUs silently falling back to Vulkan over CUDA, and a Go stdlib CVE backlog), while maintainers pushed OpenAI-compatibility fixes (`max_completion_tokens`, raw completions prompt handling) and new backend work (MLX Phonon TTS, DFlash2 speculative decoding). A high-visibility closed feature request (#15051, TurboQuant/RotorQuant) and several long-standing blob-cleanup issues (#1599, #2892, #18595) were also resolved.

## 2. Releases & Breaking Changes

No new releases. Notable config/behavior changes in flight:

- **[OPEN] PR #9404** — Allow disabling the update checker via `OLLAMA_NO_UPDATE_CHECKS=true`. Relevant for pinned/air-gapped deployments. https://github.com/ollama/ollama/pull/9404
- **[CLOSED] PR #19143** — llama.cpp version bump to **b11738** (from b11669). This is the engine behind the 0.40.x line and is implicated in several of today's regressions. https://github.com/ollama/ollama/pull/19143
- **[OPEN] Issue #19165** — Windows 0.40.6 defaults `OLLAMA_VULKAN:true`, causing NVIDIA GPUs to run via Vulkan instead of CUDA. Operators should explicitly set `OLLAMA_VULKAN=false` on NVIDIA Windows hosts until fixed. https://github.com/ollama/ollama/issues/19165

## 3. New Model & Hardware Support

- **[OPEN] PR #19166** — **MLX runner: Phonon text-to-speech** support, with an OpenAI-compatible speech endpoint and CLI playback. https://github.com/ollama/ollama/pull/19166
- **[OPEN] PR #19149** — **MLX: DFlash2 support** — extends the DFlash block draft with block-local dynamic convolutions and a candidate selector for speculative decoding. https://github.com/ollama/ollama/pull/19149
- **[OPEN] PR #19161** — **K2 Horizon reasoning tags** (IFM) now detected in chat templates, unblocking `think: true` for K2 Horizon models. https://github.com/ollama/ollama/pull/19161
- **[OPEN] PR #19159** — Noncausal **decision models (vllm-d3 GGUFs)** given a whole-prompt batch; previously kept the narrow default batch because the decision-block heuristic predates these GGUFs. https://github.com/ollama/ollama/pull/19159
- **[CLOSED] PR #17956** — MLX: deduplicate CUDA runtime payloads (`mlx_cuda_v13` now shares the sibling `cuda_v13` libraries), reducing shipped artifact size. https://github.com/ollama/ollama/pull/17956

## 4. Performance & Optimization

- **[CLOSED] Issue #19165** — Windows NVIDIA multi-GPU decode regression: **~70–72 tok/s → ~66 tok/s (~6%)** after 0.40.6 due to Vulkan being selected over CUDA. Workaround: set `OLLAMA_VULKAN=false`. https://github.com/ollama/ollama/issues/19165
- **[OPEN] Issue #18612** — Feature request: yield idle model VRAM under GPU-memory pressure (best-effort early unload beyond the keep-alive timer) for co-resident games/renderers. https://github.com/ollama/ollama/issues/18612
- **[CLOSED] PR #19070** — Server: read loaded runner models without `refMu` (atomic pointer), fixing a cache-defeating lock contention flake in warm-model lookups. https://github.com/ollama/ollama/pull/19070
- **[OPEN] Issue #15051 (CLOSED as feature request)** — Community push for native TurboQuant+RotorQuant compression; 236 👍 and 69 comments — worth tracking if you care about aggressive KV/weight compression. https://github.com/ollama/ollama/issues/15051

## 5. Stability & Regressions (ranked by severity)

1. **[OPEN] Issue #18980 — Generation collapse on `glm-5.3-flash:cloud`** since 10-12: 5–8% of requests fail with massive degeneration and repeated-token output. No fix PR referenced. https://github.com/ollama/ollama/issues/18980
2. **[OPEN] Issue #19158 — Intel Arc 130V (Lunar Lake iGPU) crash**: `ggml_vulkan: device lost on Vulkan0` immediately after tensor upload with `gemma4:12b` on 0.40.x; worked on 0.34.4. https://github.com/ollama/ollama/issues/19158
3. **[OPEN] Issue #19156 — Cloud DeepSeek corruption**: `deepseek-v4.1-flash` returns broken mid-token output and server error strings when a system message constrains the reply. https://github.com/ollama/ollama/issues/19156
4. **[OPEN] Issue #19155 — Cloud Responses API HTTP 413** on ~10.7 MiB coding requests, well below advertised context. https://github.com/ollama/ollama/issues/19155
5. **[OPEN] Issue #18275 — gemma4 tool-call parser failure**: `BEGIN_ARG/END_ARG` syntax unparseable, followed by degenerate `<|channel>thought` loop to token cap, returning HTTP 200 with no usable content. https://github.com/ollama/ollama/issues/18275
6. **[OPEN] Issue #19162 — Critical Go CVEs in current binaries**; requests toolchain upgrade to Go 1.26.9+. Related closed issue #14233 documents prior CVE backlog. https://github.com/ollama/ollama/issues/19162 · https://github.com/ollama/ollama/issues/14233
7. **[OPEN] Issue #18061 — Windows Desktop 0.33.1**: built-in server fails silently (empty `server.log`, no listener); manual `ollama serve` works. https://github.com/ollama/ollama/issues/18061
8. **[OPEN] Issue #19137 — Ollama Generate node turns red** when using `keep_context` and switching models mid-session. https://github.com/ollama/ollama/issues/19137
9. **[CLOSED] Issue #18595 / #1599 / #2892** — Orphaned blob garbage collection and partial-download cleanup issues closed; a 21 GB orphan was found via manifest audit on macOS 0.33.0. https://github.com/ollama/ollama/issues/18595

Fix PRs exist for: Go CVE/toolchain (tracking issue only), Vulkan default (#19165 workaround), Windows console flashing (#19080), HTTP 308 blob redirects (#19164).

## 6. What This Means for Application Developers

- **Pin your versions and set `OLLAMA_VULKAN=false` explicitly** on Windows NVIDIA hosts; the 0.40.x default silently routes through Vulkan and costs ~6% decode throughput, and Intel Arc iGPUs currently crash outright.
- **OpenAI compatibility is getting materially better.** `max_completion_tokens` (#19168) and unwrapped raw completions prompts (#19170) are landing, and reasoning items now finish before client tool calls (#19146). If you proxy through the OpenAI-compatible surface, re-test token budgeting and streaming tool-call ordering.
- **Thinking-field round-trips** (#18281) — assistant `thinking` is currently dropped when building chat-template messages; if you rely on reasoning continuity across turns, this is a gap to watch.
- **Cloud models are not immune**: DeepSeek corruption with system-message constraints and 413s on ~10.7 MiB requests mean you should keep a local fallback and validate response integrity (mid-token corruption is silent, HTTP 200).
- **Tool-call parsing for gemma4 is unreliable** in agent loops (#18275) — add output validation/repair or avoid gemma4 for strict tool-calling until fixed.
- **Housekeeping improvements** for blob GC and partial downloads mean `ollama rm` semantics and disk usage will be more predictable going forward; if you scripted around the old "download fully to delete" workaround, you can simplify.

</details>

<details>
<summary><strong>LiteLLM</strong> — <a href="https://github.com/BerriAI/litellm">BerriAI/litellm</a></summary>

# LiteLLM Digest — 2026-10-21

## 1. Today's Highlights

Release activity is dominated by backports across four stable lines (v1.106.1, v1.105.2, v1.104.4, v1.103.6) plus an in-flight v1.107.0-rc.2, with only cosign signature verification documented in the release bodies. The substantive work is in open PRs: a retry-policy overhaul that changes which errors are retried, a Gemini sampling-parameter correctness fix that will surface previously silent provider no-ops, and a slate of router/MCP/guardrail stability fixes. Issue volume remains high (90 updated in 24h), with the most severe outstanding bugs in rate-limit accounting (`tpm_limit` never refilling on in-memory cache) and Presidio guardrail behavior.

## 2. Releases & Breaking Changes

**Releases (last 24h)**
- [v1.106.1](https://github.com/BerriAI/litellm/releases) — latest stable; release notes contain only the cosign/Docker signature verification block ([key from commit `0112e53`](https://github.com/BerriAI/litellm/commit/0112e53046018d726492c814b3644b7d376029d0)).
- [v1.105.2](https://github.com/BerriAI/litellm/releases), [v1.104.4](https://github.com/BerriAI/litellm/releases), [v1.103.6](https://github.com/BerriAI/litellm/releases) — maintenance/backport versions across older lines.
- [v1.107.0-rc.2](https://github.com/BerriAI/litellm/releases) — next minor in RC; MCP SSE backport targeting this branch (see PR [#47242](https://github.com/BerriAI/litellm/pull/47242)).

**Breaking changes in open PRs (not yet released)**
- [PR #46730](https://github.com/BerriAI/litellm/pull/46730) `fix(retries)!` — honors `Retry-After`, adds exponential backoff with jitter, filters transient errors. **With `num_retries`, SDK `completion`/`acompletion` and router-less proxies no longer retry 4xx other than 408/409/429**; Retry-After honored up to 60s. Use `retry_policy` to restore prior behavior.
- [PR #47645](https://github.com/BerriAI/litellm/pull/47645) `fix(gemini)!` — honors `supports_sampling_params` on Gemini/Vertex. Gemini 3.6 Flash, 3.5 Flash-Lite and newer ignore `temperature`/`top_p`/`top_k`; LiteLLM previously forwarded them and returned 200. These calls will now be flagged/rejected rather than silently degraded.
- [PR #34889](https://github.com/BerriAI/litellm/pull/34889) `fix(github-copilot)!` — sends OAuth tokens directly to Copilot. **ghe.com users must set `GITHUB_COPILOT_API_BASE` before upgrading**; a caller-supplied Copilot `api_base` returns 400 without `drop_params`.
- [PR #47681](https://github.com/BerriAI/litellm/pull/47681) `fix(proxy)!` — `/key/update` now applies the same permission check to `budget_duration` and `budget_id` as to `max_budget`, closing a privilege-escalation path where a key owner could reset their own budget window.
- [PR #46754](https://github.com/BerriAI/litellm/pull/46754) `fix(responses)!` — Anthropic compaction blocks now round-trip as `compaction` output items on `/v1/responses` (streaming included).

## 3. New Model & Hardware Support

- [PR #35600](https://github.com/BerriAI/litellm/pull/35600) `feat(realtime)` — adds `/v1/realtime/translations` WebSocket, streaming `gpt-transcribe` transcript events through the proxy, and cost-map entries for the latest OpenAI and Azure audio models.
- [PR #47645](https://github.com/BerriAI/litellm/pull/47645) — flags Gemini 3.6 Flash and Gemini 3.5 Flash-Lite as non-sampling models (capability metadata, not just behavior).
- [PR #47554](https://github.com/BerriAI/litellm/pull/47554) — `count_tokens` now prices PDF pages the way OpenAI/Azure bill them (a one-page text PDF was counted at ~1586 tokens on an Azure `gpt-5.6-sol` deployment that bills 61). Applies to OpenAI/Azure models and GPT names behind another gateway's prefix.
- [PR #47542](https://github.com/BerriAI/litellm/pull/47542) — new `LITELLM_GEMINI_DEFAULT_MAX_OUTPUT_TOKENS` env var sets a default decode budget for Gemini (AI Studio or Vertex) requests with no output limit; explicit `max_tokens` still wins.
- [Issue #36493](https://github.com/BerriAI/litellm/issues/36493) — open gap: image/video routes cannot serve OpenAI-compatible self-hosted backends (SGLang Diffusion, vLLM-Omni); 4 spec/extensibility gaps, still unresolved since v1.95.0.

## 4. Performance & Optimization

- [PR #47680](https://github.com/BerriAI/litellm/pull/47680) — router deployment lookups now wait on concurrent deletes instead of crashing with `IndexError` or returning a neighboring deployment, making a shared `Router` safe under concurrent mutation.
- [PR #47265](https://github.com/BerriAI/litellm/pull/47265) — Redis spend buffer rows are held in a per-worker list until the proxy confirms receipt, preventing silent undercounting of key/team/user spend on drain-reply timeouts.
- [PR #47658](https://github.com/BerriAI/litellm/pull/47658) — retry-attempt spend rows are attributed to the deployment that actually ran them and excluded from daily request counts (regression from #47416).
- [PR #47242](https://github.com/BerriAI/litellm/pull/47242) — backports configurable 64 MiB SSE event limit to `rc/1.107.0`, fixing large MCP tool responses that failed above the default SSE limit; requires MCP 2.3.0 and httpx2 2.10.0.
- [PR #47672](https://github.com/BerriAI/litellm/pull/47672) — Responses streaming fallbacks no longer emit assistant prefill, which Claude rejects with HTTP 400, allowing partial-response fallback chains to complete.
- [Issue #47579](https://github.com/BerriAI/litellm/issues/47579) — **regression/open**: Presidio guardrail `_get_session_iterator` holds `_session_lock` across the entire HTTP request, serializing all analyzer/anonymizer calls per process. High-impact on multi-tenant proxies.

## 5. Stability & Regressions

Ranked by severity:

1. [Issue #47340](https://github.com/BerriAI/litellm/issues/47340) — **Critical**: with in-memory cache (no Redis), a virtual key's `tpm_limit` never rolls; once exhausted the key is locked out indefinitely until `/key/update`. Turns a per-minute limit into a permanent budget.
2. [Issue #47605](https://github.com/BerriAI/litellm/issues/47605) — Presidio guardrail in `mode: "logging_only"` masks the response returned to the *client* (streaming and non-streaming), not just the logged copy. Correctness/contract violation.
3. [Issue #47579](https://github.com/BerriAI/litellm/issues/47579) — Presidio session lock held across HTTP request → per-process serialization (above).
4. [Issue #47396](https://github.com/BerriAI/litellm/issues/47396) — On `/v1/messages` with Anthropic-format `tool_choice`, budget reservation is sized with `max_input_tokens` instead of counted input tokens (`token_counter` KeyError); oversized reservations can spuriously block requests.
5. [Issue #47308](https://github.com/BerriAI/litellm/issues/47308) — Decisions feature unusable with custom decision-capable models (model absent from playground; misrouted when configured).
6. [Issue #46923](https://github.com/BerriAI/litellm/issues/46923) — Headroom guardrail runs *after* the router's context-window pre-check, so compression can never rescue an over-window request.
7. [Issue #45422](https://github.com/BerriAI/litellm/issues/45422) — Token consumption for GitHub Copilot BYOK reports zero; regression between 1.103.1 and 1.104.2.
8. [Issue #47295](https://github.com/BerriAI/litellm/issues/47295) — Prometheus budget-remaining-hours gauges are off by the host's UTC offset when proxy TZ ≠ UTC (user gauge only; key/team gauges correct).
9. [Issue #39322](https://github.com/BerriAI/litellm/issues/39322) — `least-busy` routing starves deployments: response-cache hits drift counters negative, ties always pick the first, counter not shared across workers.
10. [Issue #39057](https://github.com/BerriAI/litellm/issues/39057) — Cache hits write `spend = 0` but replay original token columns, leaving token-based reports inconsistent with spend reports (22 comments, open design question).
11. [Issue #47677](https://github.com/BerriAI/litellm/pull/47677) — **Fix PR open**: MCP servers with `auth_type: authorization` and no shared token vanished from the aggregate tool catalog after v1.104.2 / v1.105.1.
12. [Issue #47659](https://github.com/BerriAI/litellm/pull/47659) — **Fix PR open**: keyed aggregate `/mcp` OAuth discovery redirected to the LiteLLM login page instead of the provider consent page; claimed tokens never vaulted.
13. Lower severity: [Issue #47299](https://github.com/BerriAI/litellm/issues/47299) (huggingface embeddings ignore `timeout`), [Issue #33384](https://github.com/BerriAI/litellm/issues/33384) (`hosted_vllm` `ssl_verify` ignored for audio transcription).
14. Closed today with fixes: [#46045](https://github.com/BerriAI/litellm/issues/46045) `ModuleNotFoundError: mcp`, [#47014](https://github.com/BerriAI/litellm/issues/47014) streamed cache storing `finish_reason: "stop"` for truncated streams, [#43491](https://github.com/BerriAI/litellm/issues/43491) / [#35567](https://github.com/BerriAI/litellm/issues/35567) spend-cache lost concurrent increments, [#27704](https://github.com/BerriAI/litellm/issues/27704) Prisma engine startup race, [#46876](https://github.com/BerriAI/litellm/issues/46876) SageMaker UTF-8 split across `PayloadPart` events, [#47414](https://github.com/BerriAI/litellm/issues/47414) custom batch threshold prices dropped by `get_model_info`.

## 6. What This Means for Application Developers

- **Pin your version and read the `!` PRs.** Four marked-breaking changes are queued for 1.107+: retry semantics on 4xx, Gemini sampling-param rejection, Copilot OAuth routing (GHE users need `GITHUB_COPILOT_API_BASE`), and `/key/update` permission tightening. If you rely on client-side or `num_retries` retrying 400/404s, set an explicit `retry_policy`.
- **Audit rate limiting if you run without Redis.** `tpm_limit` on in-memory cache is currently a one-way door ([#47340](https://github.com/BerriAI/litellm/issues/47340)) — either deploy Redis or treat TPM limits as soft and monitor for locked-out keys.
- **Check your Presidio configuration.** `logging_only` is leaking masking into client responses ([#47605](https://github.com/BerriAI/litellm/issues/47605)), and the shared session lock will serialize throughput ([#47579](https://github.com/BerriAI/litellm/issues/47579)) — consider isolating guardrailed routes until both land.
- **Responses-API + Anthropic fallbacks get better.** Compaction blocks now survive round-trips ([#46754](https://github.com/BerriAI/litellm/pull/46754)) and partial Responses fallbacks stop failing on Claude's prefill rejection ([#47672](https://github.com/BerriAI/litellm/pull/47672)) — long-session agent workloads are the primary beneficiary.
- **Cost/token accounting is actively being corrected.** PDF token pricing ([#47554](https://github.com/BerriAI/litellm/pull/47554)), retry-attempt spend attribution ([#47658](https://github.com/BerriAI/litellm/pull/47658)), and Redis buffer durability ([#47265](https://github.com/BerriAI/litellm/pull/47265)) all changed billing numbers — expect reconciliation deltas after upgrading, and don't build budget alerts on cache-hit token columns

</details>

<details>
<summary><strong>Unsloth</strong> — <a href="https://github.com/unslothai/unsloth">unslothai/unsloth</a></summary>

# Unsloth Digest — 2026-10-21

## 1. Today's Highlights

Unsloth shipped **no new releases** in the last 24 hours, but the PR queue is extremely active with **180 PRs updated**, led by a series of kernel and training-loop optimizations from `danielhanchen` (RoPE fusion, FP8 dequant fixes, auto gradient checkpointing, `--backend-sampling` for llama-server). The issue tracker saw **44 issues updated**, with a notable cluster of **correctness bugs in `FastLanguageModel.get_peft_model`** (hardcoded seed), **block compile breaking distributed checkpointing**, and **DFlash2 speculative decoding crashes**. Several of these already have fix PRs merged or in review.

## 2. Releases & Breaking Changes

- **No new releases** in the last 24h.
- No API/config migrations announced. However, PR [#14404](https://github.com/unslothai/unsloth/pull/14404) introduces `checkpoint_skip_layers="auto"` plus a `UNSLOTH_GC_KEEP_LAYERS` env var — effectively a new opt-in knob that changes recompute behavior when set; default behavior is unchanged.

## 3. New Model & Hardware Support

- **Vision / audio training via `unsloth train`** — PR [#14389](https://github.com/unslothai/unsloth/pull/14389) fixes loading of vision models (incl. shipped `vision_lora.yaml`) and audio models (Gemma 3n) previously mis-detected as text models. Impact: new trainable modalities through the CLI without Studio.
- **Qwen3 / Qwen3.5 sampling correctness** — PR [#14388](https://github.com/unslothai/unsloth/pull/14388) makes `unsloth chat` / `unsloth inference` respect the turn's thinking mode (previously Qwen3 thinking-off used thinking values 0.6/0.95).
- **CUDA sampler path for non-speculative launches** — PR [#14409](https://github.com/unslothai/unsloth/pull/14409) enables llama.cpp's `--backend-sampling` on CUDA GPU launches.
- **GLM-OCR loading** (issue [#4269](https://github.com/unslothai/unsloth/issues/4269)) closed; **DeepSeek v4.1 flash GGUF + llama.cpp** request [#10838](https://github.com/unslothai/unsloth/issues/10838) closed (comment-only, no landed artifact noted). **Wan2.2 / Diffusers** request [#3255](https://github.com/unslothai/unsloth/issues/3255) closed.
- **Apple Silicon MLX backend** continues to be tracked: MLX test-suite isolation issue [#8138](https://github.com/unslothai/unsloth/issues/8138) closed.
- **EPUB/MOBI dataset loaders** — feature request [#14377](https://github.com/unslothai/unsloth/issues/14377) open.

## 4. Performance & Optimization

Concrete numbers from PR descriptions (all in review or recently merged):

- **RoPE kernel rewrite** — PR [#14417](https://github.com/unslothai/unsloth/pull/14417) (danielhanchen): multi-head tiles, Q and K in one launch, no clones. On B200 (Llama-8B shape, batch 8, 2048 tokens, bf16): **667 µs → ~2–2.7× faster per call**; kernel time alone was 552 µs of the 667 µs.
- **CUDA GPU sampler in graph** — PR [#14409](https://github.com/unslothai/unsloth/pull/14409): eliminates per-slot full-vocabulary logits copy to host every decode step.
- **Auto gradient checkpoint skip** — PR [#14404](https://github.com/unslothai/unsloth/pull/14404): `"auto"` measures one layer's reentrant recompute in the first backward, scaled to `max_seq_length`, avoiding per-GPU manual tuning.
- **FP8 byte dequant fusion** — PR [#14416](https://github.com/unslothai/unsloth/pull/14416) fixes a missing `enable_fp_fusion` flag in the new E4M3FN byte-dequant launch (a test regression from #14408).
- **Studio video encode** — PR [#14413](https://github.com/unslothai/unsloth/pull/14413): final-flush failure now falls back instead of hanging the render.

## 5. Stability & Regressions

Ranked by severity; new items from today flagged:

1. **🔥 Distributed training broken by block compile** — issue [#14063](https://github.com/unslothai/unsloth/issues/14063) (open): new per-decoder-layer block compile in 2026.10.6 is not recomputation-safe under non-reentrant gradient checkpointing; `CheckpointError` on backward of step 1 for any distributed launch. Workaround: `UNSLOTH_BLOCK_COMPILE=0`. Two architectures reproduce. **No fix PR linked yet — high impact for multi-GPU users.**
2. **LoRA subspace collision (correctness)** — issue [#14327](https://github.com/unslothai/unsloth/issues/14327) (closed, created 2026-10-20): hardcoded `random_state=3407` in `FastLanguageModel.get_peft_model` causes ~99.9% `lora_A` subspace collision across sequential LoRA → merge → LoRA runs. Affects `llama.py`, `loader.py`, `vision.py`, `sentence_transformer.py`. Report includes exact line numbers; worth verifying the fix landed in-repo before upgrading.
3. **DFlash2 speculative decoding crash** — issue [#14381](https://github.com/unslothai/unsloth/issues/14381) (open): Qwen3.8-Flash-Next (UD-IQ3_XXS) + external DFlash2 Q8_0 drafter crashes on first prompt in `b11724-mix-c208e5f`; reproduced across 3 launches.
4. **Core dumps / hang after two weeks of updates** — issue [#14411](https://github.com/unslothai/unsloth/issues/14411) (open): models stop responding after a few turns; model eject core dumps. No relevant logs.
5. **Non-GGUF `/v1/completions` 503** — issue [#7703](https://github.com/unslothai/unsloth/issues/7703) (closed): MLX/Transformers backends blocked from `/v1/completions` and logprobs, breaking `lm-eval` style tooling.
6. **`fast_inference=True` + `full_finetuning=True`** on A100 — issue [#4739](https://github.com/unslothai/unsloth/issues/4739) (closed): still unsupported; error message clarified but combination not enabled.
7. **Studio browser panel redirect handling** — PRs [#14281](https://github.com/unslothai/unsloth/pull/14281) (noscript/comment redirects, security-tagged) and [#14283](https://github.com/unslothai/unsloth/pull/14283) (Back semantics).
8. **Studio sandbox hard-link break** — PR [#14390](https://github.com/unslothai/unsloth/pull/14390) (important): "Open in default app" on a tool-produced file hard-links outside the session workdir, breaking subsequent Python/Terminal calls under the OS sandbox.
9. **Model Hub filter regression** — issue [#14221](https://github.com/unslothai/unsloth/issues/14221) (open).
10. **`has_internet()` socket timeout leak** — issue [#14370](https://github.com/unslothai/unsloth/issues/14370) (open): leaves `socket.setdefaulttimeout(3)` global; 8.8.8.8:53 frequently unreachable — subtle, but poisons every later socket in the process.

Also notable: `pre-commit.ci` compute stress from `scripts/enforce_kwargs_spacing.py` — issue [#14174](https://github.com/unslothai/unsloth/issues/14174) (closed, from upstream pre-commit maintainer).

## 6. What This Means for Application Developers

- **Multi-GPU training is the sharpest edge right now.** If you run distributed fine-tuning on 2026.10.6, set `UNSLOTH_BLOCK_COMPILE=0` until [#14063](https://github.com/unslothai/unsloth/issues/14063) is resolved. Treat any `CheckpointError` in step-1 backward as this bug, not a checkpoint config error.
- **Audit your LoRA seed.** If you do repeated LoRA → merge → LoRA cycles and assumed independent initialization, verify against [#14327](https://github.com/unslothai/unsloth/issues/14327); the hardcoded `random_state=3407` could silently collapse your adapters into the same subspace.
- **Speculative decoding with DFlash2 on Qwen3.8-Flash-Next is not production-safe** on the current llama.cpp build — hold until [#14381](https://github.com/unslothai/unsloth/issues/14381) closes.
- **Qwen3 serving**: if you rely on thinking-off sampling with specific temperature/top-p, upgrade past [#14388](https://github.com/unslothai/unsloth/pull/14388) — current CLI defaults to thinking-tuned values even when thinking is off, which materially changes output distribution.
- **Studio server builders**: non-GGUF backends (MLX, Transformers) still lack `/v1/completions` and logprobs ([#7703](https://github.com/unslothai/unsloth/issues/7703)) — plan evaluation harnesses around `/v1/chat/completions` or load GGUF for log-likelihood tasks.
- **Self-hosted agent stacks**: the incoming MCP work (PRs [#14349](https://github.com/unslothai/unsloth/pull/14349), [#14290](https://github.com/unslothai/unsloth/pull/14290), [#14365](https://github.com/unslothai/unsloth/pull/14365)) will let Studio agents call Studio's own MCP tools, share connections across accounts, and reach `localhost` dev servers from the browser panel — worth tracking if you're wiring Studio into an agent runtime.
- **Perf forward signal**: the RoPE kernels ([#14417](https://github.com/unslothai/unsloth/pull/14417), 2–2.7×/call) and CUDA in-graph sampling ([#14409](https://github.com/unslothai/unsloth/pull/14409)) indicate Unsloth is aggressively closing the gap between training-optimized kernels and inference-side sampling latency — expect measurable decode-side throughput improvements in the next release cut.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*