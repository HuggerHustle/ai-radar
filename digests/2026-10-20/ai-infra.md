# AI Infrastructure Digest 2026-10-20

> Generated: 2026-10-20 09:19 UTC | Projects covered: 6

- [vLLM](https://github.com/vllm-project/vllm)
- [SGLang](https://github.com/sgl-project/sglang)
- [llama.cpp](https://github.com/ggml-org/llama.cpp)
- [Ollama](https://github.com/ollama/ollama)
- [LiteLLM](https://github.com/BerriAI/litellm)
- [Unsloth](https://github.com/unslothai/unsloth)

---

## Cross-Project Comparison

# Cross-Project Comparison Report — AI Infrastructure Ecosystem
**Digest Date: 2026-10-20**

---

## 1. Ecosystem Overview

Today's digests show the ecosystem splitting cleanly into **stabilization of serving engines** and **frontier model chase**. vLLM, SGLang, and llama.cpp are all in heavy PR traffic (~500, ~150+, and 145 updates respectively) but with zero new releases from the serving-engine tier — the focus has shifted to correctness hardening (speculative decoding, MoE kernels, PD disaggregation) rather than feature velocity. Ollama and Unsloth are the only projects with concrete release/behavior changes today (Unsloth's v0.1.909-beta; Ollama's pending `SYSTEM ""` and packaging-notice semantics). Cross-cutting themes: **Qwen3.8-Flash-Next and GLM-5.3-Flash dominate model-support work**, **MoE correctness bugs are surfacing simultaneously across vLLM, SGLang, and llama.cpp**, and **AMD ROCm/gfx950 (MI355X) is now a first-class enablement target** rather than an afterthought. Meanwhile LiteLLM's tracker reveals that **gateway-layer billing and rate-limiting correctness is lagging behind inference-layer performance** — a growing operational risk for production deployments.

---

## 2. Activity Comparison

| Project | Layer | Issues (24h) | PRs (24h) | Release Status | Notable Operational State |
|---|---|---|---|---|---|
| **vLLM** | Serving engine | 64 | 500 | No release; no breaking changes | Heavy perf-tracker filing; 1 unfixed silent-correctness bug |
| **SGLang** | Serving engine | High (multiple new PD/HiCache bugs) | High | No release | CI Maintenance Mode active; flaky-test tracker at 96 comments |
| **llama.cpp** | Local runtime | Moderate | 145 | ~10 incremental builds (b11740–b11753) | Fast iteration; combining-mark tokenizer fix landed |
| **Ollama** | Local runtime + cloud | Heavy (multiple regressions + 2 CVEs) | Moderate | No release | Cloud-model correctness + security debt open |
| **LiteLLM** | Gateway | Heavy (15 ranked items) | 4+ billing/streaming PRs | v1.104.4 stable, v1.107.0-rc.2 | 4 open bugs with no fix PR; RC has breaking changes |
| **Unsloth** | Fine-tuning | Moderate | Wave of Studio + FSDP2 PRs | **v0.1.909-beta** | New models shipped; block-compile regression open |

**Read:** Serving engines (vLLM, SGLang) carry the highest raw PR volume but ship no releases — they are in maintenance/regression mode. Unsloth is the only project combining a release, new model support, and a new training capability (FSDP2) on the same day.

---

## 3. Model Support Race

| Model / Architecture | vLLM | SGLang | llama.cpp | Ollama | LiteLLM | Unsloth |
|---|---|---|---|---|---|---|
| **Qwen3.8-2.4T-A95B / Flash-Next** | ✅ gfx950 trackers | ✅ Mamba/MLA linker | ✅ (Q4_0 bench) | — | ⚠️ `reasoning_effort` unresolved | ✅ (MLX offload) |
| **GLM-5.3-Flash** | ⚠️ CUDA IMA on 4×B200 | ⚠️ SM120 fa4 crash | ✅ `-sm tensor` PR | ✅ cloud (buggy) | — | ✅ (MLX offload) |
| **DeepSeek-V4.1-Flash** | ✅ hash-MoE fixes | — | ⚠️ RPC degeneration | ✅ (413 errors) | — | ✅ **shipped** |
| **Kimi-K3 (MLA+KDA)** | — | ✅ unified cache linker | — | — | — | — |
| **Gemma4 / Gemma3n** | ✅ PLE cache fix | — | ⚠️ mmproj+MTP abort | ⚠️ Vulkan device-lost | — | — |
| **FLUX.3 Image Klein** | — | — | — | — | — | ✅ **shipped** |
| **Kolibri-1 (Aleph-Alpha)** | — | — | ✅ merge ready | — | — | — |
| **K2 Horizon** | — | — | — | ✅ detection PR | — | — |
| **Gemini 3.1 Flash TTS / Cloudflare Clairic** | — | — | — | — | ✅ new endpoints | — |

**Who's ahead:**
- **Unsloth** leads on *frontier model availability for training/fine-tuning* — shipping DeepSeek-V4.1-Flash and FLUX.3 the same day they're announced.
- **SGLang** leads on *frontier serving architecture* — the Kimi-K3 MLA+MAMBA unified cache linker (#44977) is a structural capability vLLM doesn't yet have.
- **vLLM** leads on *hardware breadth* — AMD gfx950 trackers, CPU FP8, and the Octave 3-bit KV RFC are unique.
- **llama.cpp** leads on *long-tail architectures* — Kolibri-1, Limite, DNA tokenizers, and Hexagon v85 support that no other project touches.

---

## 4. Performance Frontier

| Optimization Area | vLLM | SGLang | llama.cpp | Ollama | Unsloth |
|---|---|---|---|---|---|
| **KV cache / prefix cache** | Octave 3-bit KV RFC; sliding-window hit-search skip | HiCache PP-sync (bug); host Mamba pool export | — | — | — |
| **Batching / scheduling** | Zero-new-KV-blocks by cache group | FlashInfer prefill autotune by default | — | vllm-d3 whole-prompt batching | — |
| **Quantization** | ROCm FP8 FlyDSL; Quark MXFP4 | Quark MXFP4 shared-expert fusion | OpenCL dp4a Q4_0/Q4_K/Q6_K; SVE mxfp4 | — | fp8mixed / nvfp4 loading fixes |
| **Distributed serving** | NIXL/Mooncake offload hardening | PD disaggregation roadmap (Q4) | Multi-GPU MoE expert cache (merged) | — | **FSDP2 (alpha)** |
| **Kernels** | Triton top-k fix; DeepSelect BF16 DSA | FlashInfer extend-attention fix | Metal argmax/pool_1d; Vulkan src1 precision | — | — |
| **Speculative decoding** | MTP + FlashInfer IMA (bug) | EAGLE/EAGLE3 prefill autotune | — | MLX DFlash2 drafting | — |

**Concentration:** The *KV cache + MoE* intersection is where all three serving engines are investing most heavily. Two of today's highest-severity bugs (vLLM #62225, SGLang #44070) are in exactly this region — a sign the optimization frontier is now the correctness frontier. Quantization work has bifurcated: vLLM/SGLang push MXFP4 on AMD, while llama.cpp/Unsloth push OpenCL/SVE/MLX-scoped formats for edge and Apple Silicon.

---

## 5. Layer Positioning

| Layer | Projects | Primary Job | Failure Mode That Matters |
|---|---|---|---|
| **Serving engine (server-side, multi-GPU, disaggregated)** | vLLM, SGLang | Max throughput for large models behind an API; PD disaggregation, KV transfer, advanced parallelism | Silent stale-KV / adapter-leak correctness bugs |
| **Local runtime (single-machine, edge, Apple)** | llama.cpp, Ollama | Run quantized GGUFs on commodity and retail hardware; broad backend coverage | Silent output corruption (HIP, Vulkan, tokenizer) |
| **Gateway (routing, billing, policy)** | LiteLLM | Multi-provider failover, budget enforcement, guardrails, unified API surface | Billing/rate-limit miscounts; retry starvation |
| **Training / fine-tuning (offline, GPU-heavy)** | Unsloth | LoRA/QLoRA/full FT, quantization-aware training, multi-GPU scaling | Training-time regressions (block-compile, FSDP2 alpha) |

**Interdependence:** These layers increasingly ship to the same operators. A vLLM server behind a LiteLLM gateway feeding an Unsloth-fine-tuned adapter is a plausible 2026 stack — which means a correctness bug at *any* layer (vLLM's adapter leak, LiteLLM's TPM lock, Ollama's tokenizer drop) propagates silently to the application. The layers are not independently survivable.

---

## 6. Trend Signals

**1. MoE correctness is the ecosystem's shared problem.**
vLLM (#50845 unguarded expert-map gathers), SGLang (EPLB weight-cache bug #45341), llama.cpp (router-selection flake #30818, multi-GPU MoE slowdown #30799), and LiteLLM (MoE-adjacent MCP auto-execute now counts toward budgets). This is the first time all four tiers report MoE issues simultaneously — **expect a cluster of fixes over the next 2–3 weeks.**

**2. Silent wrong output is the dominant failure class — not crashes.**
vLLM CPU LoRA leak (#62225), SGLang stale KV (#44070), llama.cpp HIP multi-GPU gibberish (#28676), Ollama cloud degeneration (#18980), Ollama `lfm2` token drop (#18785), LiteLLM billing undercounts (#47265). **If you are building agents that validate outputs, the risk is no longer availability — it's integrity.**

**3. AMD is now a first-class target — but only in vLLM.**
gfx950/MI355X trackers, Quark MXFP4 optimization, native Octave 3-bit KV, ROCm FlyDSL FP8 paged attention. SGLang's AMD work is limited to a PR-test tracker (#37451); llama.cpp's ROCm work is largely *fixing regressions* (#28676, #30755, #30839). **vLLM is where AMD serving investments will pay off first.**

**4. Frontier hardware (B200, GB300, SM120, MI355X) is consistently rough.**
vLLM GLM-5.3 on 4×B200 (#54317), SGLang GB300 startup OOM (#45345) and fa4 SM120 crash (#42012), llama.cpp CUDA 13 hybrid Deltanet collapse (#27623). **Do not assume day-0 readiness maps to production readiness on new silicon.**

**5. Gateway correctness is now the weakest production link.**
LiteLLM has four open bugs with *no fix PR*: `tpm_limit` never refills (#47340), `num_retries` self-nulls (#33272), `least-busy` starves deployments (#39322), GitHub BYOK token accounting (#45422). These are the failure modes that cause *inexplicable* production behavior — retries that don't happen, rate limits that never reset, traffic that quietly drains from healthy deployments.

**6. Local-runtime tokenizer fidelity is becoming a correctness contract.**
llama.cpp's combining-mark fix (#30845) now matches HuggingFace token IDs for Hindi/Thai/gpt-oss/Nemo. Ollama's `lfm2` decode bug (#18785) *drops tokens silently*. **Applications with token-level caching, accounting, or output-integrity checks need HF-parity guarantees — treat these fixes as load-bearing, not cosmetic.**

**7. Training frameworks are racing to unlock frontier MoE.**
Unsloth's FSDP2 (alpha) + MLX PLE/expert offload + DeepSeek-V4.1-Flash at 125 GB at 1-bit are all aimed at the same problem: **fine-tuning on hardware that used to be out of reach.** Expect this to compress the gap between "model released" and "model fine-tunable by mid-size teams."

---

### What Application Developers Should Watch

| Watch This | Because |
|---|---|
| **Silent-correctness bugs across all four layers** | No error, no alert — the hardest class to catch in CI |
| **LiteLLM's open rate-limit/retry bugs** | Production behavior will diverge from config; run Redis and per-call retries |
| **AMD / gfx950 enablement in vLLM** | The only mature AMD serving path; everything else is catch-up |
| **HF-tokenizer-parity releases (llama.cpp, Ollama)** | Token drops break caching, billing, and eval harnesses silently |
| **Unsloth FSDP2 + MLX offload** | Brings frontier-scale MoE within reach of single-node and Apple Silicon teams |
| **MoE fixes expected over the next 2–3 weeks** | Pin to versions *before* the fix wave, then re-test — kernels will change |

**Bottom line:** The serving-engine tier has entered a correctness consolidation phase while the training/runtime tier accelerates on frontier models. The safest deployments today are those that (a) pin all four layers, (b) validate outputs, and (c) assume that any new hardware or new frontier model will surface silent failures for the first several weeks after support lands.

---

## Per-Project Reports

<details>
<summary><strong>vLLM</strong> — <a href="https://github.com/vllm-project/vllm">vllm-project/vllm</a></summary>

# vLLM Digest — 2026-10-20

## Today's Highlights

No releases landed in the last 24h, but issue/PR traffic was heavy (64 issues, 500 PRs updated). The dominant themes: a wave of **gfx950 / MI355X (AMD) performance trackers** for next-gen Qwen models, continued hardening of **speculative decoding and MoE kernels** against data-derived out-of-bounds indices, and a cluster of **Rust frontend parity fixes** closing API gaps with the Python entrypoint. On the stability side, a serious **CPU backend LoRA batching correctness bug** (silent wrong output) was filed and remains unfixed.

---

## Releases & Breaking Changes

None today. No new tags, no config/API deprecations announced.

Note for tracking (not breaking yet): PR [#26468](https://github.com/vllm-project/vllm/pull/26468)'s config-hashing refactor toward opt-out semantics is still being followed up in [#39479](https://github.com/vllm-project/vllm/issues/39479) — relevant if you depend on `torch.compile` cache keys.

---

## New Model & Hardware Support

**AMD ROCm / gfx950 (MI355X)**
- Qwen3.8-2.4T-A95B (Quark MXFP4) optimization tracker: [#57149](https://github.com/vllm-project/vllm/issues/57149)
- Qwen3.8-Flash-Next optimization tracker — GatedDeltaNet, QuerySparse Attention, HyperConnection residuals, MXFP4 MoE: [#59575](https://github.com/vllm-project/vllm/issues/59575)

**NVIDIA**
- Gemma4 / Gemma4-Unified / Gemma3n: PLE cache registration as non-persistent buffer to fix `.to(device)` materialization — PR [#62659](https://github.com/vllm-project/vllm/pull/62659)

**CPU**
- FP8 checkpoint support and GELU-tanh MoE added to the CPU backend alongside a NUMA-affinity regression fix — PR [#62016](https://github.com/vllm-project/vllm/pull/62016)

**Quantization format**
- New RFC for **Octave KV**, a native 3-bit KV cache for AMD GPUs (targeting long-prompt Qwen3.8-27B GPTQ W4A16 on RX 7900 XTX TP4): [#59773](https://github.com/vllm-project/vllm/issues/59773), PR [#59774](https://github.com/vllm-project/vllm/pull/59774)
- ROCm FlyDSL paged-attention decode for FP8 KV caches on gfx950 (opt-in via `VLLM_ROCM_USE_AITER_FLYDSL_PA_DECODE=1`), covering spec-decode verify/draft passes — PR [#62660](https://github.com/vllm-project/vllm/pull/62660)

---

## Performance & Optimization

**Kernels & sampling**
- Triton top-k kernel (`_topk_topp_kernel`) is falling back to full-vocab search on 6–10% of rows at k≥… — the Gaussian-fit pivot on the first 8192 logits misses real outliers on MiMo-V2.6 logits: [#61998](https://github.com/vllm-project/vllm/issues/61998)
- DeepSelect BF16 ranking for the DSA sparse-indexer prefill path (avoids FP32 upcast of DeepGEMM MQA logits): PR [#62240](https://github.com/vllm-project/vllm/pull/62240)

**Scheduling & cache**
- Skip gaps in sliding-window prefix-cache hit search — avoids up to `max_num_blocks` cold lookups on 128K-token requests: [#62336](https://github.com/vllm-project/vllm/issues/62336)
- Zero-new-KV-blocks by cache group (avoids perf regression from #51749's union-of-block-IDs zeroing): PR [#52187](https://github.com/vllm-project/vllm/pull/52187)

**RDMA / KV transfer**
- Object-tier NIXL submission failures now fail the offload job instead of escaping into the EngineCore step: PR [#62650](https://github.com/vllm-project/vllm/pull/62650)
- Mooncake P2P connector module-layout RFC (currently 3,077 lines in a single file): [#62243](https://github.com/vllm-project/vllm/issues/62243)

---

## Stability & Regressions

Ranked by severity:

1. **CPU backend — silent wrong output under mixed LoRA/non-LoRA batching.** Non-LoRA requests batched alongside LoRA requests get the adapter applied. No fix PR yet. This is a correctness bug, not a crash — highest priority. [#62225](https://github.com/vllm-project/vllm/issues/62225)

2. **GLM-5.3-Flash (glm5next) — recurring CUDA illegal memory access on 4×B200**, surfacing in three unrelated kernels (KDA linear-attention, MHC TileLang, TRT-LLM fused MoE). Reproducible on the current `glm53-flash` image. [#54317](https://github.com/vllm-project/vllm/issues/54317)

3. **MTP + FlashInfer long-context CUDA IMA / Xid 31** persists on v0.27.1 (Qwen3.8-27B-NVFP4, RTX 5090, `max-num-seqs=1`). [#55775](https://github.com/vllm-project/vllm/issues/55775)

4. **`VLLM_BATCH_INVARIANT=1` not batch-invariant for AWQ on sm8x** in default mode — invalidates the determinism guarantee for AWQ users. [#59086](https://github.com/vllm-project/vllm/issues/59086)

5. **`/pause` clears SHM multimodal cache**, causing fatal `ValueError` for queued requests: [#62123](https://github.com/vllm-project/vllm/issues/62123)

6. **Prefix-caching hash config change flips deterministic repeated output**: [#54487](https://github.com/vllm-project/vllm/issues/54487)

7. **MoE expert-map gathers unguarded against data-derived `topk_ids`** (stale `torch.empty` slots) — fix PR open: [#50845](https://github.com/vllm-project/vllm/pull/50845). Related: DeepSeek-V4 hash-MoE token_id bound fix, PR [#50844](https://github.com/vllm-project/vllm/pull/50844); sampler tile-local argmax bound, PR [#50843](https://github.com/vllm-project/vllm/pull/50843)

8. **Qwen3.8-Flash-Next long-prefill starves active decode for 3–7 minutes** on 2-node DGX Spark TP2: [#54919](https://github.com/vllm-project/vllm/issues/54919)

Also closed today: DSpark draft-token-count inflation with adaptive verification + DP ([#61806](https://github.com/vllm-project/vllm/issues/61806)), FP8 + `kv_cache_dtype=float16` startup crash ([#61314](https://github.com/vllm-project/vllm/issues/61314)), and two ROCm CI test failures.

---

## What This Means for Application Developers

- **If you serve on CPU with LoRA adapters: pin carefully.** The mixed-batch adapter leak ([#62225](https://github.com/vllm-project/vllm/issues/62225)) produces silently wrong completions with no error — the worst failure mode for agents that validate outputs. Isolate LoRA and non-LoRA traffic until a fix lands.
- **Don't rely on `VLLM_BATCH_INVARIANT=1` for AWQ on sm8x.** Determinism is broken in the default mode ([#59086](https://github.com/vllm-project/vllm/issues/59086)); if you need reproducible outputs, use a different quant format or wait for the fix.
- **`/pause` is unsafe with in-flight multimodal requests.** Draining before pausing avoids the SHM-cache fatal error ([#62123](https://github.com/vllm-project/vllm/issues/62123)).
- **Rust frontend is converging on Python parity** — null-for-nullable booleans ([#62662](https://github.com/vllm-project/vllm/pull/62662)), Python-style error `type`/`code` bodies ([#62663](https://github.com/vllm-project/vllm/pull/62663)), 64-level structured-output nesting cap ([#62661](https://github.com/vllm-project/vllm/pull/62661)), and routed-expert passthrough on `/inference/v1/generate` ([#61949](https://github.com/vllm-project/vllm/pull/61949)). If you're already on the Rust path, these close real gaps; if you're planning to migrate, they're landing incrementally.
- **Prompt-cache hashing semantics may shift** as the opt-out config-hashing follow-ups progress ([#39479](https://github.com/vllm-project/vllm/issues/39479)). If you programmatically inspect cache keys or rely on cross-version cache reuse, track this thread.
- **NIXL/OBJ offload failures are now contained** ([#62650](https://github.com/vllm-project/vllm/pull/62650)) — a failed KV transfer no longer risks destabilizing the engine step, which improves blast radius for disaggregated deployments.

</details>

<details>
<summary><strong>SGLang</strong> — <a href="https://github.com/sgl-project/sglang">sgl-project/sglang</a></summary>

# SGLang Digest — 2026-10-20

## 1. Today's Highlights

No new releases today, but the project is in an active stabilization cycle: a long-running CI flaky-test tracker (#42752, 96 comments) and the newly-reopened CI Maintenance Mode (#21065) suggest the maintainers are fencing off infrastructure debt while landing major features. The Q4 Prefill-Decode Disaggregation roadmap (#43699) is now public, and a cluster of new PD/HiCache correctness bugs (#44070, #45357, #45351) landed alongside it — worth watching if you run disaggregated deployments. On the PR side, work continues on Kimi-K3 unified cache linking, XPU prefill graphs, and AMD deterministic-inference guardrails.

## 2. Releases & Breaking Changes

No new releases in the last 24h.

One related item: [PR #44450](https://github.com/sgl-project/sglang/pull/44450) (closed) distinguishes S3 `served-model-name` from LoRA adapter syntax in the OpenAI-compatible API — if you were relying on ambiguous model-name parsing, verify your client behavior after this lands upstream.

## 3. New Model & Hardware Support

- **[Roadmap] Muse Spark Open Development & Optimization** — [#44678](https://github.com/sgl-project/sglang/issues/44678). Day-0 support PR #44530 split into #44664–#44667; #44666 depends on upstream DeepGEMM changes ([DeepGEMM#104](https://github.com/sgl-project/DeepGEMM/pull/104)) plus a new release.
- **Kimi-K3 (MLA + KDA) unified cache linker** — [PR #44977](https://github.com/sgl-project/sglang/pull/44977). Enables FULL + MAMBA MLA models in the direct external linker, previously rejected at startup.
- **NPU: DWDP on Ascend** — [PR #40998](https://github.com/sgl-project/sglang/pull/40998). Reuses the GPU DWDP algorithm to support `--dwdp-size` on Ascend.
- **XPU: full prefill graph** — [PR #30980](https://github.com/sgl-project/sglang/pull/30980). Adds Intel XPU capture/replay for the prefill path using the same full-graph backend contract as decode.
- **NPU: Ascend MemCache as HiCache L3** — [#35620](https://github.com/sgl-project/sglang/issues/35620) (closed/inactive). RFC for L3 distributed pool; worth tracking if it's revived.
- **Apple Silicon / MLX** — [PR #43099](https://github.com/sgl-project/sglang/pull/43099) fixes an MPS/CPU device mismatch crash in the MLX backend with `--disable-overlap-schedule`.

## 4. Performance & Optimization

- **FlashInfer autotune at prefill sizes by default** — [PR #42736](https://github.com/sgl-project/sglang/pull/42736). Removes per-model `autotune_prefill_kernels` hooks (DeepSeek-V4.1, GLM-5.3-Flash) and applies the prefill autotune pass to every generation target, including EAGLE/EAGLE3 drafts.
- **AMD Quark MXFP4 shared-expert fusion** — [PR #41899](https://github.com/sgl-project/sglang/pull/41899). With `--enforce-shared-experts-fusion`, BF16 shared experts are quantized to MXFP4 at load and fused into the routed grouped GEMM, eliminating a separate BF16 MLP path.
- **HiCache PP-sync scheduling** — [#45351](https://github.com/sgl-project/sglang/issues/45351) documents that HiCache PP-sync drain forces PP prefill schedulers into lock-step; PP0 cannot run more than one round ahead of PP1. Reported as a perf issue, not yet fixed.
- **Weight-cache daemon EPLB correctness** — [PR #45341](https://github.com/sgl-project/sglang/pull/45341). EPLB rebalances were moving experts inside the daemon's zero-copy-mapped tensors; this keeps the expert layout canonical in the daemon.
- **Request logger watermark redaction** — [PR #44692](https://github.com/sgl-project/sglang/pull/44692). Skips the per-token redaction walk, previously applied before truncation and `skip_names` filtering on every log line.
- **Host Mamba pool occupancy export** — [PR #43727](https://github.com/sgl-project/sglang/pull/43727). Exposes host Mamba state pool occupancy alongside host KV for hybrid Mamba/GDN/KDA models, where the Mamba pool can fill first and cause silent prefix-match loss.
- **FlashInfer extend attention fix** — [PR #45056](https://github.com/sgl-project/sglang/pull/45056). Fixes `DECODER_BIDIRECTIONAL` being treated as causal in the extend path (issue [#36663](https://github.com/sgl-project/sglang/issues/36663)), aligning FlashInfer with the Triton backend.

## 5. Stability & Regressions

Ranked by severity:

1. **PD prefill sends stale KV to decode under HiCache** — [#44070](https://github.com/sgl-project/sglang/issues/44070). With `SGLANG_DISAGG_PREFILL_EARLY_SEND_CACHED_PREFIX=1` (default), decode can receive stale KV for a prefix that hasn't finished loading back from host memory. Silent correctness bug on the default PD path; treat as high priority if you run HiCache + PD.
2. **PD prefill PP8 + HiCache hang** — [#45357](https://github.com/sgl-project/sglang/issues/45357). PP0–PP3 blocked in the HiCache PP-sync drain after ~35 min of serving; reproduces under multi-turn agentic load. Likely the same root cause as the perf issue in [#45351](https://github.com/sgl-project/sglang/issues/45351).
3. **GLM-5.3-Flash on SM120: fa4 crashes at CUDA-graph capture** — [#42012](https://github.com/sgl-project/sglang/issues/42012). On RTX PRO 6000 (SM120), fa4 fails on hybrid extend reshape during graph capture; Triton is the only working backend. Affects production deployments on Blackwell workstation-class GPUs.
4. **`pause_generation` in-place → abort hangs server** — [#44835](https://github.com/sgl-project/sglang/issues/44835). Server hangs until watchdog kill.
5. **NIXL/UCX prefill segfault (B200, CUDA 13)** — [#35189](https://github.com/sgl-project/sglang/issues/35189) (closed, no root cause). Previously reported as "fixed via rebase" with no linked commit; still reproduces. If you hit this, reopen with reproducer.
6. **Startup OOM with 32 tokenizer workers + cuda_vmm on GB300/MNNVL** — [#45345](https://github.com/sgl-project/sglang/issues/45345). Kimi-K3 two-node GB300 deployment OOMs before any request; auto-selected `cuda_vmm` transport interacts badly with high tokenizer worker counts.
7. **Gateway worker stuck as `model_id: "unknown"`** — [#37554](https://github.com/sgl-project/sglang/issues/37554) (closed). A worker whose metadata discovery failed stays healthy, takes no traffic for the router process lifetime, and raises no alert. Verify your IGW dashboards alert on this.
8. **Qwen3-Coder strict-tool schema bugs** — [#45224](https://github.com/sgl-project/sglang/issues/45224) and [#45235](https://github.com/sgl-project/sglang/issues/45235). One uncompilable schema in a strict tool set fails the whole request; a single `strict: true` tool under `tool_choice="auto"` causes non-strict zero-arg tools to hallucinate arguments.
9. **sgl-router rejects inline `system` role for `/v1/messages`** — [#45355](https://github.com/sgl-project/sglang/issues/45355) (closed). Broke Claude Code usage through the router.
10. **Generation degeneration on Qwen3.5-arch with NVFP4** — [#35723](https://github.com/sgl-project/sglang/issues/35723) (closed/inactive). Token loops in 0.5.17, working in 0.5.6.dev.

Also: CI flaky-test tracker [#42752](https://github.com/sgl-project/sglang/issues/42752) (96 comments) and AMD PR-test tracker [#37451](https://github.com/sgl-project/sglang/issues/37451), plus CI Maintenance Mode [#21065](https://github.com/sgl-project/sglang/issues/21065) — expect PR CI to be intermittently paused.

## 6. What This Means for Application Developers

- **If you run PD disaggregation with HiCache, pin your config carefully.** The stale-KV bug (#44070) is silent — no error, no alert, just wrong outputs for shared-prefix requests. Until it's fixed, consider disabling early cached-prefix send or avoiding host-tier KV in shared-prefix workloads.
- **Agent frameworks hitting Qwen3-Coder via `strict` tools should validate schema compileability at registration time**, not per-request. One bad schema can fail the entire tool set (#45224).
- **Claude Code users routing through sgl-router** should upgrade past the inline-`system`-role fix (#45355) before deploying.
- **On SM120 (RTX PRO 6000) with GLM-5.3-Flash**, force Triton as the attention backend; fa4 will crash at graph capture under SM120 with hybrid extend.
- **IGW operators**: an "unknown" model_id worker is a silent capacity loss. Add a dashboard check for it (#37554) — it will not surface in health checks.
- **Mixed Mamba/MLA deployments (Kimi-K3)** get closer with the unified-cache linker PR (#44977); if you've been blocked on FULL + MAMBA in the direct external linker, this is the change to test.
- **Frontier hardware (GB300, B200 + CUDA 13)** remains rough: segfaults (#35189) and startup OOM (#45345) are unresolved. Budget time for backend/transport tuning and reduce tokenizer worker counts on MNNVL multi-node setups.

</details>

<details>
<summary><strong>llama.cpp</strong> — <a href="https://github.com/ggml-org/llama.cpp">ggml-org/llama.cpp</a></summary>

# llama.cpp Digest — 2026-10-20

## 1. Today's Highlights

A very active 24-hour window with ~10 releases and 145 updated PRs. The marquee items: `llama-server` gains experimental P2P internet access via `--connect` (#28277), and the Tekken/GPT-4o pre-tokenizer combining-mark fix (#30845) lands after being reported as issue #30787. On the performance side, MoE work continues on multiple fronts — a per-expert-token down-projection rescaling (#30861) and multi-GPU MoE expert cache (#30112, merged) — while OpenCL picks up cooperative-k dp4a GEMMs for Q4_0/Q4_K/Q6_K (#30741).

## 2. Releases & Breaking Changes

Releases are incremental builds (b11740–b11753) with no API-breaking changes announced today. Notable config/behavior additions:

- **`server: --connect` (#28277, b11744)** — experimental P2P tunneling allowing access to a `llama-server` from outside the LAN. Adds `props.connect_code`. Explicitly marked experimental; the server will not advertise a connect code without a tunnel configured. [PR #28277](https://github.com/ggml-org/llama.cpp/pull/28277)
- **`server: /v1/messages` sampling params (#30856, open)** — currently the Anthropic-compatible endpoint only forwards `temperature`, `top_k`, `top_p`, `stream`, `chat_template_kwargs`; this PR forwards the full 24 sampling names from `server-schema.cpp`. [PR #30856](https://github.com/ggml-org/llama.cpp/pull/30856)
- **`server: id_slot` on `/v1/messages` (#28554, open)** — slot pinning is currently silently ignored on the Anthropic endpoint; fix in flight. [PR #28554](https://github.com/ggml-org/llama.cpp/pull/28554)
- **Model management API (issue #21779, closed as planning)** — `GET /models?reload=1`, `POST /models/download` tracked; relevant to future `llama serve -hf` router-mode behavior (#26116). [Issue #21779](https://github.com/ggml-org/llama.cpp/issues/21779) · [Issue #26116](https://github.com/ggml-org/llama.cpp/issues/26116)

## 3. New Model & Hardware Support

- **Kolibri-1 (Aleph-Alpha) (#30673)** — 78B bilingual DE/EN MoE reasoning model, 3.46B active params, 50 layers, 384 routed experts + 1 shared; interleaved sliding (window 513) and full attention layers with NeoX RoPE. Marked *merge ready*. [PR #30673](https://github.com/ggml-org/llama.cpp/pull/30673)
- **Hybrid DNA tokenizer / Carbon-14B (#30825, b11742)** — DNA run auto-tagging, N-padded tail tokens, whitespace stripping inside `<dna>` tags. [PR #30825](https://github.com/ggml-org/llama.cpp/pull/30825)
- **Limite 1B "Violetto" (#29433, open)** — adds ` thinking` handling for the model definition. [PR #29433](https://github.com/ggml-org/llama.cpp/pull/29433)
- **GLM-5.3 next `-sm tensor` split mode (#30499, open)** — tensor-parallel split support. [PR #30499](https://github.com/ggml-org/llama.cpp/pull/30499)
- **Qwen-VL resize parity (#30736, b11747)** — mtmd now matches the Transformers Qwen-VL preprocessing. [PR #30736](https://github.com/ggml-org/llama.cpp/pull/30736)
- **Hexagon toolchain → v0.8, Hexagon v85 enabled (#30854, b11751)** — plus a small Python utility for SWIV on some IoT devices. [PR #30854](https://github.com/ggml-org/llama.cpp/pull/30854)
- **OpenCL: i32 GET_ROWS and i32/f32 copy (#30756, b11740)** — expands the op surface for the OpenCL backend. [PR #30756](https://github.com/ggml-org/llama.cpp/pull/30756)
- **SYCL: get_rows on reordered quantized weights (#30430, b11748)** — fixes a correctness gap for quantized reordered layouts. [PR #30430](https://github.com/ggml-org/llama.cpp/pull/30430)

## 4. Performance & Optimization

- **MoE down-projection scaling per expert token (#30861, open)** — replaces the global amax rescale with a per-expert-token factor via `POOL_1D` max reduction along the intermediate dim; the power-of-two factor is undone on the way out. Better numerical headroom for MoE. [PR #30861](https://github.com/ggml-org/llama.cpp/pull/30861)
- **Multi-GPU MoE expert cache (#30112, merged)** — builds on #29887; benchmarks on 2×RTX 4090 (layer split) with Qwen3.8-Flash-Next Q4_0 (93.7 GiB, 65 GiB experts). [PR #30112](https://github.com/ggml-org/llama.cpp/pull/30112)
- **Hybrid MoE expert cache with profile prefilling (#30594, open)** — `--moe-cache-profile <file.strp>` pre-populates the GPU expert cache from offline routing distributions; `--moe-cache-hybrid` keeps profiled hot experts resident. Potentially significant for `--cpu-moe` / `--moe-cache-mib` users. [PR #30594](https://github.com/ggml-org/llama.cpp/pull/30594)
- **OpenCL cooperative-k dp4a GEMM (#30741)** — Q4_0, Q4_K, Q6_K; alignment fixes included. [PR #30741](https://github.com/ggml-org/llama.cpp/pull/30741)
- **Metal: optimize argmax and pool_1d (#30862, open)** — two-pass partial reduction for `ggml_argmax` on large rows plus cooperative pooling. [PR #30862](https://github.com/ggml-org/llama.cpp/pull/30862)
- **SVE 256-bit kernels** — `gemm_q6_K_8x8_q8_K` (#27472), `gemv_mxfp4_4x4_q8_0` (#28141, reported gains on GPT-OSS-20B on Graviton3e), and `gemv_q8_0_4x8_q8_0` (#30585, ~Llama-3.2-3B tg128 numbers in PR). [PR #27472](https://github.com/ggml-org/llama.cpp/pull/27472) · [PR #28141](https://github.com/ggml-org/llama.cpp/pull/28141) · [PR #30585](https://github.com/ggml-org/llama.cpp/pull/30585)
- **Vulkan src1 precision handling (#30656, open)** — scales src1 into fp16 range for MUL_MAT / MUL_MAT_ID, mirroring the Metal approach. [PR #30656](https://github.com/ggml-org/llama.cpp/pull/30656)
- **CPU: f32 gelu_quick/geglu_quick without fp16 table (#30737, open)** — avoids the ~1e-3 per-value error introduced by F16 round-trip lookups. [PR #30737](https://github.com/ggml-org/llama.cpp/pull/30737)
- **RWKV6/7 recurrent state read-in-place (#30139, open)** — removes state copy steps; scoped to `get_rows` copies plus graph-reuse/read-order changes. [PR #30139](https://github.com/ggml-org/llama.cpp/pull/30139)

## 5. Stability & Regressions

Ranked by severity:

1. **HIP/ROCm multi-GPU on Windows silently corrupts output (#28676, open)** — gfx1100 + gfx1201 produces fluent gibberish; single-GPU HIP and dual-GPU Linux HIP are correct. Silent corruption is the worst failure class here. [Issue #28676](https://github.com/ggml-org/llama.cpp/issues/28676)
2. **RPC with two workers: DeepSeek V4 output degenerates to repeated token after long prompt, slot stays corrupted (#30794, open)** — affects `llama-server` + `ggml-rpc-server` across Linux/macOS hosts. [Issue #30794](https://github.com/ggml-org/llama.cpp/issues/30794)
3. **`--moe-cache-mib` crashes at load on Vulkan / RX 6900 XT / Windows (#30697, open)** — reacts directly to the new MoE cache feature. [Issue #30697](https://github.com/ggml-org/llama.cpp/issues/30697)
4. **Gemma 4 + `--mmproj` + MTP (`-md`) aborts on startup with `GGML_ASSERT(ubatch->embd_state)` (#30698, open)** — regression from #30257. [Issue #30698](https://github.com/ggml-org/llama.cpp/issues/30698)
5. **Qwen3.8-27B hybrid Gated DeltaNet: ~25× decode collapse past ~80K context (#27623, open)** — prompt processing stays fast; Windows CUDA 13.x and release b10488 both affected. [Issue #27623](https://github.com/ggml-org/llama.cpp/issues/27623)
6. **Vulkan deep-context decode on Intel Arc Pro B70 (Xe2) collapses ~8× from 1k→64k (#28721, open)** — backend-intrinsic; SYCL only degrades ~2.4×. [Issue #28721](https://github.com/ggml-org/llama.cpp/issues/28721)
7. **`--split-mode tensor` crashes with `GGML_ASSERT(bcj.nodes[i])` on second request (2×/3× P100, CUDA) (#29466, open)** — reproduced on a patched tree; maintainers may want a report against upstream first. [Issue #29466](https://github.com/ggml-org/llama.cpp/issues/29466)
8. **SYCL RMS_NORM launch failure on Arc Pro B60 (`UR_RESULT_ERROR_UNSUPPORTED_FEATURE`)** (#30301); **SYCL test-backend-ops failures** CONV_2D/CPY/ROLL/FLASH_ATTN_EXT (#28384); **SYCL VRAM usage regression since b10680** (#29063). [Issue #30301](https://github.com/ggml-org/llama.cpp/issues/30301) · [Issue #28384](https://github.com/ggml-org/llama.cpp/issues/28384) · [Issue #29063](https://github.com/ggml-org/llama.cpp/issues/29063)
9. **Vulkan multigpu MoE slowdown after first request (#30799, open)** — 4× RX580, Ornith-1.5-35B-A3B. [Issue #30799](https://github.com/ggml-org/llama.cpp/issues/30799)
10. **Tokenizer combining-mark split-off fixed** — bug #30787 (Hindi/Thai, gpt-oss, Mistral NeMo class models) is addressed by #30845 (b11753). [Issue #30787](https://github.com/ggml-org/llama.cpp/issues/30787) · [PR #30845](https://github.com/ggml-org/llama.cpp/pull/30845)
11. **HIP compile failures** — `group_mask_warp_inplace` under ROCm 6.3.4 (#30755) and `mma.cuh:1424` with clang 23.1.3 / ROCm 7.13 on gfx1151 (#30839); plus a linker error for `ggml-rpc-server` under LLVM 23 (#28814). [Issue #30755](https://github.com/ggml-org/llama.cpp/issues/30755) · [Issue #30839](https://github.com/ggml-org/llama.cpp/issues/30839) · [Issue #28814](https://github.com/ggml-org/llama.cpp/issues/28814)
12. **`test-llama-archs -a beam` flake fixed (#30818, b11752)** — MoE router selection was backend-noise-dependent; ~1 in 10 seeds failed on M2 Ultra. [PR #30818](https://github.com/ggml-org/llama.cpp/pull/30818)
13. **`llama-server` hang with more keep-alive connections than `--threads-http` (#30675, open)** — tens-of-second stalls; cpp-httplib 0.61.0. [Issue #30675](https://github.com/ggml-org/llama.cpp/issues/30675)

## 6. What This Means for Application Developers

- **Keepalive tuning is a real risk.** If you front `llama-server` with a proxy that holds idle connections, #30675 is a plausible cause of sporadic multi-second hangs — cap keepalive connections below `--threads-http` until it's fixed.
- **Prefill-side MoE caching is maturing.** #30112 (merged) gives multi-GPU expert caching, and #30594 lets you *pre-seed* the cache from profiled routing. If you run large MoE models on constrained VRAM, this is the highest-leverage knob landing right now — but pair it with the #30697 Vulkan crash report before enabling on AMD RDNA2.
- **Don't put internet-facing traffic on `--connect` yet.** It's explicitly experimental, requires tunnel configuration, and the API surface (`connect_code`) may still move.
- **Anthropic-endpoint parity gaps.** If you're routing through `/v1/messages` to reuse Anthropic-shaped clients, expect dropped sampling params (#30856) and silently ignored `id_slot` (#28554) until those PRs merge. If you depend on slot pinning for session affinity, keep using `/v1/chat/completions`.
- **Non-Latin tokenization is now correct for the affected tokenizers.** If your app does Hindi/Thai/mixed-script work against gpt-oss, Mistral NeMo, or MiniMax M2, pin to b11753 or later — token IDs will now match HuggingFace, which matters for any caching or token-accounting logic you've built.
- **Deep-context workloads on Vulkan and hybrid Deltanet models remain risky.** The 8×/#21 and 25× collapse reports are open and unmitigated; if your agent loops are pushing 64K+ contexts, benchmark on your target backend before committing to a hardware profile.
- **Backend op coverage is broadening (OpenCL i32/copy, SYCL quantized get_rows, Vulkan src1 precision).** If you were sharding work to CPU because a backend lacked an op, re-check — the fallback cliff may have moved.

</details>

<details>
<summary><strong>Ollama</strong> — <a href="https://github.com/ollama/ollama">ollama/ollama</a></summary>

# Ollama Digest — 2026-10-20

## 1. Today's Highlights

No releases landed in the last 24 hours, but issue and PR traffic is heavy across four themes: **new cloud/decision-model plumbing** (K2 Horizon thinking detection, vllm-d3 batching, DFlash2 MLX drafting), **OpenAI-compatibility correctness** (empty-array content dropping tool calls, 413s on the Responses endpoint), and **ongoing hardware regressions** on Vulkan (Intel Arc, AMD RDNA1) and CUDA (Blackwell flash-attention). Security debt is resurfacing as a first-class concern with two separate CVE filings against the shipped Go toolchain.

## 2. Releases & Breaking Changes

No new tags in the last 24h. However, two merged/closed PRs signal near-term behavioral changes worth tracking:

- **[#18990](https://github.com/ollama/ollama/pull/18990) — `create` will respect explicitly empty `SYSTEM ""` prompts.** Currently `SYSTEM ""` silently inherits the base model's system prompt; after this change, the semantics become `omitted → inherit`, `nonempty → replace`, `"" → clear`. If your tooling relies on the current inheritance behavior, audit Modelfile generation.
- **[#19094](https://github.com/ollama/ollama/pull/19094) — `create` will print packaging notices** for autodetected renderers/parsers, unset sampling defaults, and missing `draft_num_predict` when draft capability is declared. Informational only, but it will add stderr output to build pipelines.

## 3. New Model & Hardware Support

- **[PR #19161](https://github.com/ollama/ollama/pull/19161) — K2 Horizon reasoning tag detection.** K2 Horizon (IFM, Apache-2.0) runs on Ollama since v0.40.4 via llama.cpp b11521, but `think: true` is currently rejected because `TemplateSupportsThinking` doesn't recognize the template's reasoning delimiters. This PR adds detection so the `hf.co/IFM/K2-Horizon-7B-GGUF` family can actually use thinking mode.
- **[PR #19159](https://github.com/ollama/ollama/pull/19159) — whole-prompt batching for non-causal decision models.** `LlamaServerBatch` only widened the batch for GGUFs with `decision.block_count > 0`; the vllm-d3 GGUFs introduced in the b11669 bump have no decision head blocks and were running with the wrong batch geometry. This gives them a full-context batch, matching how the `/v1/systemone` path expects to evaluate pairwise prompts.
- **[PR #19149](https://github.com/ollama/ollama/pull/19149) — MLX DFlash2 support.** Adds block-local dynamic convolutions plus a top-k candidate selector chained across draft rows. This is speculative-decoding infrastructure for Apple Silicon and a meaningful throughput lever for local MLX inference.
- **[PR #19128](https://github.com/ollama/ollama/issues/19128) — MLX checkpoint acceptance bug.** `ollama create` reads only `architectures[0]` and refuses MLX checkpoints whose `config.json` supplies only `model_type`, even when the runner supports that architecture. Draft fixes exist; expect better HF MLX ingestion.
- **[Issue #19116](https://github.com/ollama/ollama/issues/19116) — request for Apple Foundation Models support** on macOS. Enabled by the on-device `FoundationModels` Swift framework; no PR yet.

## 4. Performance & Optimization

- **[PR #19070](https://github.com/ollama/ollama/pull/19070) — remove `refMu` contention on warm-model lookups.** `runnerRef.model` becomes an `atomic.Pointer`, so concurrent lookups of an already-loaded model no longer TryLock-fail against each other and fall back to a manifest reload. This was visible as a flaky `TestLoadedModelLookupConcurrent`; in production it means cold-path manifest I/O under concurrent request bursts on warm models.
- **[PR #19144](https://github.com/ollama/ollama/pull/19144) (closed) — propagate client cancellation to remote inference.** Passing `c.Request.Context()` through to upstream API calls means a cancelled local request stops consuming remote GPU time instead of running to completion. For anyone proxying through the cloud models, this is a direct cost fix.
- **[Issue #18612](https://github.com/ollama/ollama/issues/18612) — VRAM yield under GPU pressure.** Feature request for an idle model to release VRAM when another GPU app (game, video editor, renderer) needs it, rather than waiting out the keep-alive timer. Not yet implemented.
- **[Issue #15051](https://github.com/ollama/ollama/issues/15051) (closed, 236 👍) — TurboQuant / RotorQuant.** A long-running request for native extreme-compression quantization referencing Google Research's TurboQuant work. Closed today after 7 months; no detail in the summary about whether it was implemented or declined — worth reading the thread if quantization strategy is on your roadmap.

## 5. Stability & Regressions

Ranked by severity:

1. **Cloud corruption, possible host-side data loss.** [Issue #18980](https://github.com/ollama/ollama/issues/18980) — 5–8% of `glm-5.3-flash:cloud` requests declining into "massive degeneration" since 10-12, with the reporter describing a "smoking gun" host-side all-zero data area. Users are also seeing the model emit its own error/telemetry text mid-generation. 29 comments, unresolved. Treat any cloud-model output as untrusted until this closes.
2. **Cloud Responses API 413 on ordinary coding sessions.** [Issue #19155](https://github.com/ollama/ollama/issues/19155) — `https://ollama.com/v1/responses` rejects ~10.7 MiB requests with HTTP 413 despite being well inside the advertised context. Blocks large coding-agent payloads against `deepseek-v4.1-flash`.
3. **Native `/api/chat` tools render empty, install-wide.** [Issue #19040](https://github.com/ollama/ollama/issues/19040) — models echo `{"name": ""}` and never emit `tool_calls`; the OpenAI `/v1` route renders the same tools correctly. Verified instrumentally on `qwen3.5:9b-q4_K_M` and `qwen3:8b-q6`. If you are building tool-calling agents on the native API, this is a hard blocker; route through `/v1` until fixed.
4. **CUDA flash-attention kernel init failure on Blackwell.** [Issue #19122](https://github.com/ollama/ollama/issues/19122) — "shared object initialization failed" in the flash-attention MMA kernel on RTX 5060 Ti (Windows) when loading `clef` / `clef-flash`.
5. **Vulkan device-lost on Intel Arc 130V.** [Issue #19158](https://github.com/ollama/ollama/issues/19158) — `gemma4:12b` dies with `ggml_vulkan: device lost on Vulkan0` on any GPU offload since 0.40.x; worked on 0.34.4. Also [Issue #19060](https://github.com/ollama/ollama/issues/19060) — GPT-OSS 20B returns empty responses on AMD Radeon Pro 5700 XT via Vulkan while CPU inference is fine.
6. **ROCm regression on RDNA1.** [Issue #19075](https://github.com/ollama/ollama/issues/19075) — `GGML_ASSERT(max_blocks_per_sm > 0)` on Radeon Pro W5700 (gfx1010) with the ROCm 7.2 backend; layers offload successfully, then inference asserts.
7. **Security: critical CVEs in shipped binaries.** [Issue #19162](https://github.com/ollama/ollama/issues/19162) and the related [Issue #14233](https://github.com/ollama/ollama/issues/14233) — `govulncheck` on the Linux binary surfaces multiple Go stdlib CVEs, including a critical in `crypto/tls` (unexpected session resumption). Upgrade path is Go 1.26.9+. If you redistribute Ollama in a container image, this is your ticketing item this week.
8. **Tokenizer decode bug.** [Issue #18785](https://github.com/ollama/ollama/issues/18785) — with `lfm2:24b`, the bare `"python"` token (no leading space) decodes to empty string, silently dropping the word. Space-prefixed form works. Affects any code-generation output.
9. **OpenAI compat: tool_calls move to the wrong message.** [Issue #19151](https://github.com/ollama/ollama/issues/19151) / [PR #19152](https://github.com/ollama/ollama/pull/19152) — when an assistant message has `"content": []` plus `tool_calls`, the message is dropped and its calls and reasoning are attached to the *previous* turn. Fix PR is open.
10. **Windows connection resets on large prompts.** [Issue #19139](https://github.com/ollama/ollama/issues/19139) — `/api/chat` resets after ~15s with large prompts on 0.40.4, RTX 3090.
11. **`OLLAMA_CONTEXT_LENGTH` not reflected in introspection.** [Issue #18995](https://github.com/ollama/ollama/issues/18995) — `/api/show` and `/api/tags` report the model's native context window even when the env var clamps the effective value. Agent frameworks sizing prompts off these endpoints will overestimate available context.
12. **Desktop app memory leak.** [Issue #19029](https://github.com/ollama/ollama/issues/19029) / [PR #19042](https://github.com/ollama/ollama/pull/19042) — context menu label C strings leaked per right-click (~32 bytes); fix is open. Also [Issue #18061](https://github.com/ollama/ollama/issues/18061) — Windows desktop app 0.33.1 fails to start its built-in server silently while manual `ollama serve` works.

## 6. What This Means for Application Developers

- **Route tool-calling through `/v1`, not `/api/chat`.** The empty-tool-definition bug (#19040) is install-wide and verified across two model families. Until it closes, the native chat endpoint cannot reliably drive agents.
- **Add cancellation propagation to your client.** The fix in #19144 is landing — once it ships, honoring request context cancellation in your proxy layer will actually stop remote GPU billing. Today it doesn't.
- **Do not trust `OLLAMA_CONTEXT_LENGTH` introspection.** `/api/show` and `/api/tags` over-report context (#18995). If your agent sizes a prompt budget off those endpoints, clamp it yourself.
- **Cloud models are not currently safe for production agent loops.** Corruption with error-string leakage (#18980) plus 413s on ordinary payloads (#19155) means the cloud inference path has two independent reliability problems open simultaneously. Keep a local fallback wired.
- **Pin your model downloads against silent token drops.** The `lfm2` decode bug (#18785) silently removes tokens, which is the worst failure mode for code-gen agents — no error, just missing identifiers. If you ship `lfm2`, add an output-integrity check.
- **If you build Ollama into a redistributed image, track #19162.** The Go stdlib CVEs affect the binary you ship, not the host toolchain, so scanning your own artifact is the only way to see it.

</details>

<details>
<summary><strong>LiteLLM</strong> — <a href="https://github.com/BerriAI/litellm">BerriAI/litellm</a></summary>

# LiteLLM Digest — 2026-10-20

## 1. Today's Highlights

LiteLLM's tracker is dominated by **streaming correctness and billing accuracy** issues: a fast-moving queue of PRs (#47109, #47445, #47495, #47504) fixes usage accounting and stream parsing bugs that caused over/under-billing. Meanwhile, two release artifacts surfaced in the last 24h: the stable **v1.104.4** and a **v1.107.0-rc.2** pre-release, both emphasizing cosign-signed Docker images. Operational pain remains acute around **rate limiting windows, router load balancing, and proxy spend tracking** — several long-running bugs are still open with no fix PR yet.

## 2. Releases & Breaking Changes

- **v1.104.4** (stable) — [link](https://github.com/BerriAI/litellm/releases). Docker images signed via cosign; key unchanged since commit `0112e53`.
- **v1.107.0-rc.2** (pre-release) — [link](https://github.com/BerriAI/litellm/releases). Same signing policy. RC line now diverged several minor versions ahead of stable; test before adopting.

**Breaking-change PRs in review (not yet merged):**
- **`allowed_fails` semantics change** — [#46183](https://github.com/BerriAI/litellm/pull/46183): `allowed_fails: 3` now cools a deployment after >3 failures (rather than cooling immediately). 429/401/404 now count toward the limit. A lone deployment will answer 429 for `cooldown_time`. Drop the key to preserve old behavior.
- **Streaming `include_usage` chunk shape** — [#47109](https://github.com/BerriAI/litellm/pull/47109): usage chunk now sent with `choices: []` instead of a fake empty choice (matches OpenAI; fixes LangChain.js double-counting).
- **Vertex Gemini integer enums** — [#44908](https://github.com/BerriAI/litellm/pull/44908): Gemini 3+ now returns only values from integer enums; callers relying on other values will break.
- **GitHub Copilot OAuth routing** — [#34889](https://github.com/BerriAI/litellm/pull/34889): `ghe.com` Copilot users must set `GITHUB_COPILOT_API_BASE` before upgrading; caller-supplied `api_base` on Copilot models now 400s unless `drop_params` is on.
- **Bedrock/SageMaker stream parsing** — [#47495](https://github.com/BerriAI/litellm/pull/47495) fixes `Unparseable JSON` / truncated vLLM streams from arbitrary byte-boundary chunking.

## 3. New Model & Hardware Support

- **Cloudflare Clairic extraction model** — new `/v1/extraction` endpoint added in [#47473](https://github.com/BerriAI/litellm/pull/47473); supports typed field extraction from documents/images, wired into keys, budgets, spend logs, guardrails, and health checks.
- **Vertex Gemini 3.1 Flash TTS** — [#31915](https://github.com/BerriAI/litellm/pull/31915) adds multi-speaker voice settings and routes mp3/opus/alaw/mulaw formats through Cloud Text-to-Speech, since `generateContent` can't produce them.
- **SAP AI Core `reasoning_content`** — [#46642](https://github.com/BerriAI/litellm/pull/46642) maps SAP's list-of-`{content, signature}` shape onto `ModelResponse.reasoning_content` (currently dropped/crashes).
- **Qwen3.8-27B-FP8 `reasoning_effort`** — still unresolved as of [#37359](https://github.com/BerriAI/litellm/issues/37359) (closed, 7 👍).
- **Self-hosted OpenAI-compatible image/video backends** (SGLang Diffusion, vLLM-Omni) — spec gaps remain open in [#36493](https://github.com/BerriAI/litellm/issues/36493).

## 4. Performance & Optimization

- **Vertex/Gemini context cache listing** — [#46857](https://github.com/BerriAI/litellm/pull/46857) removes a per-request `cachedContents` list measured at **1.55s p50 / 3.9s p99**, reuses known caches, and dedupes concurrent cache creation for the same prefix. This is the single highest-impact latency fix in flight.
- **Redis spend buffer reliability** — [#47265](https://github.com/BerriAI/litellm/pull/47265) replaces destructive `LPOP` drains with a per-worker processing list so items survive reply timeouts; prevents silent spend undercounting under load.
- **Type cleanup** — [#47509](https://github.com/BerriAI/litellm/pull/47509) and [#47268](https://github.com/BerriAI/litellm/pull/47268) replace `Any` with proven types across ~80 files (~363 `Any` errors removed), improving static analysis rather than runtime throughput.

## 5. Stability & Regressions (ranked)

1. **`tpm_limit` never refills with in-memory cache** — [#47340](https://github.com/BerriAI/litellm/issues/47340) (OPEN, 5 comments). A virtual key that exhausts TPM stays locked indefinitely; the window only resets on `/key/update`. **No fix PR yet.** Severe for single-node/Redis-less deployments.
2. **`num_retries` global permanently nulled after any exception** — [#33272](https://github.com/BerriAI/litellm/issues/33272) (OPEN). One failed call silently disables retries process-wide for the lifetime of the process. **No fix PR.**
3. **`least-busy` routing starves deployments** — [#39322](https://github.com/BerriAI/litellm/issues/39322) (OPEN). Cache hits drift counters negative, ties always pick the first deployment, and the counter isn't shared across workers. Traffic gradually drops to zero for some deployments. Root-cause follow-up to #25323.
4. **Streaming cut between `finish_reason` and `include_usage` chunk mis-billed as success** — [#47332](https://github.com/BerriAI/litellm/issues/47332) (CLOSED). Cached tokens lost, billed at full input rate. Related PRs: [#47109](https://github.com/BerriAI/litellm/pull/47109), [#47445](https://github.com/BerriAI/litellm/pull/47445).
5. **GitHub BYOK token accounting broken between 1.103.1 and 1.104.2** — [#45422](https://github.com/BerriAI/litellm/issues/45422) (OPEN, 10 comments — highest activity today). Consumed tokens always report zero. **No fix PR.**
6. **MCP `ModuleNotFoundError: No module named 'mcp'`** — [#46045](https://github.com/BerriAI/litellm/issues/46045) (CLOSED). Import chain in `litellm/main.py` when tools are set and `_skip_mcp_handler` is not.
7. **`aspeech` double-bills Gemini TTS** — [#44546](https://github.com/BerriAI/litellm/issues/44546) (CLOSED). `speech()` called twice when the executor result isn't already a coroutine.
8. **GZip middleware withholds SSE headers since v1.105.0** — [#46659](https://github.com/BerriAI/litellm/issues/46659) (OPEN). MCP `tools/call` streams hang until the 15s sse-starlette ping. **No fix PR.**
9. **Budget reservation uses `max_input_tokens` for Anthropic `tool_choice`** — [#47396](https://github.com/BerriAI/litellm/issues/47396) (OPEN). Oversized reservations on `/v1/messages`.
10. **Headroom guardrail pre-check ordering** — [#46923](https://github.com/BerriAI/litellm/issues/46923) (OPEN). Compression runs after the router's window check rejects the request, so Headroom can never rescue an over-window request.
11. **Stuck pods never self-heal** — [#44049](https://github.com/BerriAI/litellm/issues/44049) (CLOSED). `/health/liveliness` doesn't touch registry-load locks, so lock-starved pods keep passing liveness.
12. **Azure Responses bridge duplicates tool-call arguments on `/v1/messages` streaming** — [#44835](https://github.com/BerriAI/litellm/issues/44835) (CLOSED, 1 👍). Invalid JSON returned to Claude Code.
13. **`/v1/messages` forwards `output_config` to Bedrock/Vertex models that reject it** — [#47397](https://github.com/BerriAI/litellm/issues/47397) (OPEN). No fallback to strip it.
14. **`image detail: "original"` rejected by `token_counter`** — [#47327](https://github.com/BerriAI/litellm/issues/47327) (OPEN). Context-window check silently skipped.
15. **Non-streaming MCP follow-up fails with "tool_use without tool_result"** — [#33520](https://github.com/BerriAI/litellm/issues/33520) (OPEN, 2 👍).

## 6. What This Means for Application Developers

- **Rate-limit behavior on Redis-less deployments is unreliable.** Until [#47340](https://github.com/BerriAI/litellm/issues/47340) is fixed, run Redis if you rely on `tpm_limit` — otherwise a single burst permanently locks a key.
- **Retries can silently disable themselves.** If your app relies on `litellm.num_retries` as a module global, wrap your client calls with explicit per-call retry config; the global is unsafe under any exception ([#33272](https://github.com/BerriAI/litellm/issues/33272)).
- **Streaming billing is being actively hardened.** If you self-host and audit spend, expect spend-log semantics changes as [#47109](https://github.com/BerriAI/litellm/pull/47109), [#47445](https://github.com/BerriAI/litellm/pull/47445), and [#47504](https://github.com/BerriAI/litellm/pull/47504) land — background Responses calls and multi-round MCP auto-execute will start counting toward project/per-model budgets (previously they didn't, so your invoices will rise).
- **Claude Code + Azure Responses bridge is fragile.** Pin to a known-good version if you're using `azure/responses/*` behind `/v1/messages` with tools; argument duplication broke JSON parsing ([#44835](https://github.com/BerriAI/litellm/issues/44835)).
- **Router `least-busy` is not safe for multi-worker deployments.** Prefer `simple-shuffle` or `usage-based-routing` until [#39322](https://github.com/BerriAI/litellm/issues/39322) lands.
- **RC 1.107.0 line is worth tracking for new endpoints** (`/v1/extraction`, Gemini 3.1 TTS, Copilot OAuth fixes) but includes multiple breaking changes — audit `allowed_fails`, `api_base` on Copilot, and Gemini integer-enum tool schemas before upgrading.

</details>

<details>
<summary><strong>Unsloth</strong> — <a href="https://github.com/unslothai/unsloth">unslothai/unsloth</a></summary>

# Unsloth Digest — 2026-10-20

## Today's Highlights

Unsloth shipped **v0.1.909-beta**, adding **DeepSeek-V4.1-Flash-1017** (552B total / 16B active, ~125 GB at 1-bit) and **FLUX.3 Image Klein**, plus multimodal chat (images/videos), multi-GPU training via **FSDP2 (alpha)**, and one-command MCP setup for coding agents. The FSDP2 work is landing via a large native wrapper PR and a block-compile regression is being triaged in parallel. On the Studio side, a wave of UI/agent-reliability PRs (browser panel copy/bookmarks/forms, docs loading, Linux system-packaged runtime) and a new MLX memory-estimate fix are the dominant activity.

---

## Releases & Breaking Changes

- **v0.1.909-beta** — [release notes](https://github.com/unslothai/unsloth/releases)
  - New model support: DeepSeek-V4.1-Flash-1017, FLUX.3 Image Klein.
  - New features: images/videos in chat, FSDP2 multi-GPU training (alpha), one-command MCP setup for coding agents.
  - Related runtime addition: **`UNSLOTH_FSDP2=1`** under `torchrun` enables Unsloth's own FSDP2 wrapper ([PR #14273](https://github.com/unslothai/unsloth/pull/14273)).
  - **`UNSLOTH_BLOCK_COMPILE=0`** is the documented workaround for the block-compile / checkpoint regression below ([Issue #14063](https://github.com/unslothai/unsloth/issues/14063)).

---

## New Model & Hardware Support

- **DeepSeek-V4.1-Flash-1017** (552B / 16B active) — runs at ~125 GB at 1-bit; loaded locally in Unsloth. MLX loading for V4.1 is being sized/fixed in [PR #14325](https://github.com/unslothai/unsloth/pull/14325) and [PR #14326](https://github.com/unslothai/unsloth/pull/14326).
- **FLUX.3 Image Klein** (image) and **FLUX.2 klein 9B text encoder** (`qwen_3_8b_fp8mixed.safetensors`) — ComfyUI fp8mixed loading (nvfp4 / mxfp8 layers) fixed in [PR #14321](https://github.com/unslothai/unsloth/pull/14321).
- **Multi-GPU (FSDP2)** — native `fully_shard` per decoder block + root, supports LoRA / QLoRA / full FT with `MixedPrecisionPolicy` ([PR #14273](https://github.com/unslothai/unsloth/pull/14273)).
- **Multi-GPU diffusion** — component placement and CFG-parallel for diffusion/video, no NCCL required ([PR #13725](https://github.com/unslothai/unsloth/pull/13725)).
- **MLX** — PLE and expert offload for Studio via `unsloth-zoo`, unlocking GLM-5.3-Flash and DeepSeek-V4.1-Flash on Apple Silicon ([PR #14326](https://github.com/unslothai/unsloth/pull/14326), depends on [unsloth-zoo#1893](https://github.com/unslothai/unsloth-zoo/pull/1893)).
- **Intel Arc / Core Ultra** — OpenVINO conversion (INT4/INT8) plus managed sidecar chat ([PR #12168](https://github.com/unslothai/unsloth/pull/12168)).
- **AMD / ROCm** — request to ship PyTorch built for ROCm 7.14/10 with user-selectable versions remains open ([Issue #9932](https://github.com/unslothai/unsloth/issues/9932)).

---

## Performance & Optimization

- **MLX memory estimate no longer allocates the model** when opening Run Settings; previously **GLM-5.3-Flash** ballooned past **12 GiB** of MLX memory and was OOM-killed on open ([PR #14325](https://github.com/unslothai/unsloth/pull/14325)).
- **FSDP2 wrapper** gathers parameters in compute dtype and reduces gradients in fp32, targeting large-model multi-GPU throughput ([PR #14273](https://github.com/unslothai/unsloth/pull/14273)).
- **Diffusion multi-GPU** previously collapsed multi-card selections to the single card with most free VRAM, leaving a second GPU idle; component- and denoiser-call-boundary parallelization removes that idle GPU ([PR #13725](https://github.com/unslothai/unsloth/pull/13725)).
- **Startup bundle budget** raised to accommodate FLUX.3 controls — main was at **6684.2 KB raw / 2012.7 KB transfer / 96 chunks**, just over the prior 6683.8 KB budget ([PR #14319](https://github.com/unslothai/unsloth/pull/14319)).

---

## Stability & Regressions

Ranked by severity:

1. **[OPEN] Block-compile breaks checkpoint recomputation on distributed runs** — backward of step 1 raises `CheckpointError`; reproduced on two model architectures; `UNSLOTH_BLOCK_COMPILE=0` resolves it ([Issue #14063](https://github.com/unslothai/unsloth/issues/14063)).
2. **[OPEN] Model Hub filters regression** — Hub filtering not working as expected after recent changes ([Issue #14221](https://github.com/unslothai/unsloth/issues/14221)).
3. **[OPEN] Studio false-positive scan report** on desktop app ([Issue #14306](https://github.com/unslothai/unsloth/issues/14306)).
4. **[CLOSED] Studio stalled 10–33s on macOS CI** serving nothing then recovering — underlying backend behavior on main ([Issue #9712](https://github.com/unslothai/unsloth/issues/9712)).
5. **[CLOSED] unsloth-zoo MLX test suite not isolation-clean on Apple Silicon** — 24–34 failures depending only on invocation ([Issue #8138](https://github.com/unslothai/unsloth/issues/8138)).
6. **[CLOSED] "undefined is not an object (evaluating ‘t.scrollbarGutter.includes’)"** on macOS v0.1.908-beta ([Issue #14055](https://github.com/unslothai/unsloth/issues/14055)).
7. **[CLOSED] AMD: audio runtime not installed** on Studio desktop ([Issue #14052](https://github.com/unslothai/unsloth/issues/14052)).
8. **[CLOSED] Studio lost models after update** — custom-dir GGUF not visible ([Issue #13926](https://github.com/unslothai/unsloth/issues/13926)).
9. **[CLOSED] Studio backend tests failing** on main (`test_skeleton_buffers_match_from_pretrained`, `Model catalog network check`) — fixed via [PR #14318](https://github.com/unslothai/unsloth/pull/14318) and [PR #14316](https://github.com/unslothai/unsloth/pull/14316).
10. **[FIXED] Claude API reference pages broken in browser panel** — `new URL("null")` in opaque-origin srcdoc frame ([PR #14323](https://github.com/unslothai/unsloth/pull/14323)); docs/Next.js sites fixed in [PR #14279](https://github.com/unslothai/unsloth/pull/14279).

---

## What This Means for Application Developers

- **Agent/MCP tooling just got easier to bootstrap.** The one-command MCP setup for coding agents in v0.1.909 pairs with recent safety-oriented browser-agent work — radios/checkboxes now resolve by label ([PR #14282](https://github.com/unslothai/unsloth/pull/14282)) and extensionless program downloads warn before executing ([PR #14278](https://github.com/unslothai/unsloth/pull/14278)). If you're building code-execution agents on Studio, upgrade.
- **FSDP2 is opt-in and alpha.** For multi-GPU training pipelines, use `UNSLOTH_FSDP2=1` with `torchrun`; expect API surface to churn. Don't rely on it for production fine-tunes yet.
- **Don't ship distributed training on 2026.10.6+ without setting `UNSLOTH_BLOCK_COMPILE=0`** until Issue #14063 is resolved — it's a hard failure in backwards step 1.
- **Studio `/v1/completions` gaps are blocking eval workflows.** Feature request documents that `/v1/completions` only works with GGUF and returns 503 on MLX/Transformers, blocking lm-eval-style log-likelihood evaluation ([Issue #7703](https://github.com/unslothai/unsloth/issues/7703)). If you need logprobs on non-GGUF backends, plan around `/v1/chat/completions` for now.
- **Remote-server / thin-client deployment is a frequently requested pattern** ([Issue #9103](https://github.com/unslothai/unsloth/issues/9103)) — combined with per-model device pinning ([Issue #9257](https://github.com/unslothai/unsloth/issues/9257)), expect Studio to evolve toward a multi-model serving topology rather than single-model local-only.
- **MLX on Apple Silicon gets more viable for very large MoE** with PLE + expert offload, but stack dependency on unsloth-zoo PRs means you should pin zoo version alongside Studio.

</details>