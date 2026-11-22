# AI Infrastructure Digest 2026-11-22

> Generated: 2026-11-22 01:08 UTC | Projects covered: 6

- [vLLM](https://github.com/vllm-project/vllm)
- [SGLang](https://github.com/sgl-project/sglang)
- [llama.cpp](https://github.com/ggml-org/llama.cpp)
- [Ollama](https://github.com/ollama/ollama)
- [LiteLLM](https://github.com/BerriAI/litellm)
- [Unsloth](https://github.com/unslothai/unsloth)

---

## Cross-Project Comparison

# Cross-Project Comparison Report — 2026-11-22

## 1. Ecosystem Overview

Today's digests show a landscape consolidating around a single new architecture family — **Inkling 2 (Thinking Machines Lab)** — with every layer of the stack racing to land support simultaneously: vLLM (Ampere/Ada gating), llama.cpp (DSpark speculation, tensor split, FA bias), Ollama (blocked on a `LLAMA_CPP_VERSION` bump), and Unsloth (LoRA/QLoRA training). No project shipped a stable release in the last 24h; activity is concentrated in PR queues and issue triage. The dominant risk theme is **correctness under load** — silent output corruption, cross-request leaks, and NaN perplexity — rather than raw throughput. Meanwhile, quantization format churn (vLLM's Marlin→Humming migration, Kitty 2-bit KV cache) and Blackwell SM120 stability signal that the hardware/format matrix is still settling. Gateway and disaggregation integration (`vllm.Render` gRPC, P/D `bootstrap_room`) is maturing but exposes multi-tenant isolation gaps.

## 2. Activity Comparison

| Project | Layer | Issues (active/tracked) | PRs (active/in-flight) | Release Status (24h) |
|---|---|---|---|---|
| **vLLM** | Serving engine | ~10 top-severity bugs; 3 new WIP trackers | ~8 in-flight (kernels, gRPC, quant) | **No release** |
| **SGLang** | Serving engine | 10 ranked regressions; 1.0 tracker active | ~6 open (AMD kernels, JIT bench) | **No release** (1.0 tracker) |
| **llama.cpp** | Local runtime | ~16 ranked issues; 2 critical | ~7 open (Inkling 2, FA bias, Vulkan) | **b12611–b12622** (12 builds) |
| **Ollama** | Local runtime | ~6 ranked; parser cluster | ~6 open (VRAM, parser, shards) | **No release** |
| **LiteLLM** | Gateway | ~10 ranked; redaction stack | ~10 open (redaction 5-PR split) | **v1.112.0-dev.2** + **v1.108.15 LTS** |
| **Unsloth** | Fine-tuning | ~11 ranked; 2 open blockers | ~10 open/closed (memory, GRPO) | **No release** |

**Read:** llama.cpp is the only project shipping continuously (12 builds in 24h) — consistent with its release cadence model. LiteLLM is the only project with a formal LTS line, now a moving pointer. vLLM and SGLang are in "queue-heavy, release-quiet" mode, typical of pre-release hardening (SGLang 1.0) and format migration (vLLM Marlin→Humming).

## 3. Model Support Race

**Inkling 2 is the contested frontier.** Support status by layer:

| Layer | Project | Status |
|---|---|---|
| Serving | **vLLM** | Ampere/Ada gating PR (#69165) — Triton path reuse |
| Serving | **SGLang** | No explicit Inkling 2 entry today (AMD Kimi-K3 focus) |
| Local runtime | **llama.cpp** | Most advanced: DSpark speculator (#32218), tensor split (#32751), FA bias (#32740); **but NaN perplexity on CUDA (#32710) blocks production** |
| Local runtime | **Ollama** | **Blocked** — unknown arch `inkling2_loop`; needs `LLAMA_CPP_VERSION` bump from b12257 (Nov 10) to b12622 |
| Fine-tuning | **Unsloth** | LoRA/QLoRA training PR (#18812) landing, but inference-side GGUF load broken in Studio (#18757) |

**Who's ahead:** llama.cpp on raw capability breadth (speculation, tensor split, FA bias), but its correctness bug makes it unusable for Inkling 2 on CUDA. vLLM is the most *deployable* path for serving (gated to Ampere/Ada with existing Triton paths). Unsloth is ahead on the training side but its inference path is broken. **No project offers a production-safe Inkling 2 story today** — this is a genuine ecosystem-wide gap.

**Other notable model support:** llama.cpp landed Kyutai Hibiki real-time duplex (#12619), MiniCPM5 MoE, Nemotron 3.6 Academia; vLLM added Mamba2 NVFP4 via Marlin and 2-bit KV cache; SGLang focused on AMD Kimi-K3/K2.5 kernel fusion; LiteLLM closed Gemini Live Avatar and OpenAI Skills API routing; Unsloth added AsyncGRPO tree packing for Qwen3.5/3.6 hybrids.

## 4. Performance Frontier

Optimization effort is concentrated in **five distinct arenas**, with clear project specialization:

**KV cache (highest strategic attention):**
- vLLM: 2-bit "Kitty" KV quantization (#68945), DP8 vs TP8 for MLA (7.7× KV capacity, 3.4× faster 1M-context TTFT at c=8 on 8×B200), KV offload re-queue stall (#62532), and view re-derivation waste (#64572).
- SGLang: hybrid-GDN speculative state memory blowup (#51175), prefill CUDA graph memory starvation (#40094).
- llama.cpp: Qwen3.8 hybrid GDN decode collapse past 80K (#27623).

**Quantization (format churn):**
- vLLM: Marlin→Humming migration (full format set), NVFP4 Mamba2 via Marlin, CUTLASS int8 gating fix.
- llama.cpp: SYCL IQ4 reorder, AVX-512 IQ3_S/IQ2_S kernels.
- Unsloth: auto fp8 base for DiT LoRA on sm89+ (open PR), int8 CUTLASS race cache fix.

**Kernels (hardware-specific):**
- SGLang: AMD Kimi-K3 perf series — fused MLA value projection + MXFP4 quant, Quark FP8 KDA, AITER MoE sort.
- llama.cpp: SYCL fused ADD+RMS_NORM+MUL, Vulkan RDNA4 MMVQ, FA coopmat1 driver workaround.
- vLLM: batch-invariant Qwen3-30B FP8 MoE tuning on Blackwell, FA2 split-KV decode.

**Distributed serving:**
- vLLM: DP8 vs TP8 MLA benchmark is the most actionable data point today.
- SGLang: custom all-reduce peer mapping (#52173), P/D disaggregation correctness.
- llama.cpp: speculative decode split-mode regressions (layer vs tensor).

**Batching/scheduling:**
- vLLM: `--long-prefill-token-threshold` behavior change (#60476) — operators must re-validate latency isolation.
- SGLang: JIT kernel regression tracking (#52132) with per-PR baselines.

**Read:** vLLM owns the **KV cache + quantization** frontier; SGLang owns **AMD/ROCm kernel fusion**; llama.cpp owns **CPU/SYCL/Vulkan edge kernels**; Unsloth owns **training memory pressure** (8× video dedup, shard-streamed save, GRPO tail cut).

## 5. Layer Positioning

| Layer | Project | Primary job | Key differentiator today |
|---|---|---|---|
| **Serving engine** | vLLM | High-throughput, multi-hardware inference | Broadest format/hardware matrix; gateway integration via `vllm.Render` gRPC; Rust frontend parity |
| **Serving engine** | SGLang | Latency-optimized serving + P/D disaggregation | 1.0 stability push; AMD/ROCm kernel depth; strict config validation |
| **Local runtime** | llama.cpp | Portable edge/desktop inference | Hardware breadth (CPU/SYCL/Vulkan/Metal/CUDA); fastest release cadence; Inkling 2 capability leader |
| **Local runtime** | Ollama | User-friendly local model management | Easiest UX; parser correctness surface; cloud routing |
| **Gateway** | LiteLLM | Multi-provider routing, billing, observability | LTS line; signed Docker images; redaction/privacy hardening; provider translation breadth |
| **Fine-tuning** | Unsloth | LoRA/QLoRA/GRPO training + Studio | Memory-efficient training; vLLM speculative config passthrough; Studio as inference+training UI |

**Key architectural observation:** the boundaries are blurring. vLLM is building a gateway integration surface (`vllm.Render` gRPC for llm-d sidecars) — traditionally LiteLLM's territory. Unsloth is passing speculative decoding config *to vLLM* (#18764) — training tooling now configures serving. Ollama wraps llama.cpp but is now gated by its version pin. **Infrastructure engineers should expect to manage 3–4 of these together, not one.**

## 6. Trend Signals

**1. Correctness is the new bottleneck, not throughput.** Every project surfaced a silent-correctness bug today: vLLM's HF3FS KV connector treating failed loads as cache hits (#69058) and Kimi-K3 CUDA graph silent corruption at batch=1 (#52531); SGLang's P/D cross-request output leak with HTTP 200 (#51980); llama.cpp's NaN perplexity (#32710); Ollama's parser truncating thinking mid-sentence (#19829); LiteLLM's MCP tool re-execution on retry (#43153); Unsloth's RoPE scaling silently unscaled past 8192 (#18818). **Watch:** add end-to-end output validation to CI; don't trust scheduler-side success signals.

**2. Blackwell (SM120) is not production-ready across the stack.** vLLM (DeepSeek-V4.1-Flash decode collapse, NVFP4 wedges), SGLang (no model runs out-of-box on CUDA 13 wheel), llama.cpp (Inkling 2 IQ4_NL prefill crashes on RTX 5090), Unsloth (RDNA4 QLoRA illegal memory access). **Watch:** if you're targeting RTX PRO 6000/5090/consumer Blackwell, validate per-model before committing.

**3. Quantization format churn is a version-pinning imperative.** vLLM's Marlin→Humming migration will deprecate Marlin-backed configs; Kitty 2-bit KV cache is WIP; llama.cpp's b12622 removed internal `w_s`/`_s` overloads breaking forks; Unsloth's Q5_K_M export rejected by bundled llama.cpp build 12588. **Watch:** pin vLLM and llama.cpp versions; re-validate quantized deployments on upgrade; don't track `main`.

**4. Multi-tenant isolation is under-tested.** SGLang's P/D `bootstrap_room` leak (#51980) and vLLM's HF3FS silent-failure (#69058) are both multi-tenant correctness risks. **Watch:** if you run disaggregated or KV-offloaded serving in multi-tenant settings, add request-isolation tests.

**5. Long-context + hybrid architectures expose memory cliffs.** Qwen3.8 hybrid GDN decode collapse past 80K (#27623), hybrid-GDN speculative state blowup (#51175), MLX prefix cache eviction past 64K (#19819). **Watch:** size context caps conservatively on hybrid models; benchmark before defaulting to 1M-context claims.

**6. Agent/application developers should watch:**
- **Parser correctness** (Ollama #18288, #18624, #17564; LiteLLM #48401) — truncated tool calls and leaked thinking tags are partial-token-boundary bugs, not model quality.
- **Gateway-side cost attribution** (LiteLLM #53419, #53394, #46059) — client-cancelled streaming and watsonx undercounting distort spend.
- **Speculative decoding as first-class config** (Unsloth #18764 → vLLM; llama.cpp DSpark 80 vs 47.6 tok/s at long context) — worth revisiting for 16 GB-card deployments.
- **Rust frontend / gRPC gateway paths** (vLLM #44280, #65503) — relevant if you front vLLM with llm-d or do tokenization outside the engine.

---

**Bottom line for decision-makers:** the stack is mid-transition — format migration (vLLM), 1.0 hardening (SGLang), version-pin gating (Ollama), and LTS pointer drift (LiteLLM) all demand **version pinning and re-validation discipline** this cycle. The Inkling 2 race is real but no layer is production-safe yet. Prioritize correctness validation over throughput benchmarking in your next upgrade.

---

## Per-Project Reports

<details>
<summary><strong>vLLM</strong> — <a href="https://github.com/vllm-project/vllm">vllm-project/vllm</a></summary>

# vLLM Digest — 2026-11-22

## 1. Today's Highlights

No new releases in the last 24h, but the issue/PR queue is active across three fronts: **SM120 (Blackwell) CUDA graph and NVFP4 stability problems** continue to generate the highest-severity bug reports (DeepSeek-V4.1-Flash decode throughput, ModelOpt NVFP4 wedges under sustained load), while **quantization kernel migration** progresses — the Marlin→Humming tracker is now open and a 2-bit "Kitty" KV-cache quantization PR is in WIP. On the infrastructure side, the Rust frontend feature-parity roadmap (#44280) and the `vllm.Render` gRPC gateway work (#65503, #67652) signal continued investment in gateway/sidecar integration and non-Python serving paths.

## 2. Releases & Breaking Changes

No new releases in the last 24h. Relevant in-flight changes worth tracking:

- **Marlin → Humming kernel migration** (#65560, RFC/tracker): Humming now covers the full format set Marlin serves (INT4/INT8 GPTQ/AWQ, FP8, MXFP8, MXFP4, NVFP4, MXFP6, INT8/FP8 activations) for dense and MoE layers. Marlin is an SM80-era kernel with no Hopper/Blackwell-specific paths. Expect eventual deprecation of Marlin-backed configs — https://github.com/vllm-project/vllm/issues/65560
- **`--long-prefill-token-threshold` behavior change since v0.31.0** (#60476): short requests behind a long prefill are no longer protected due to the lone-request exemption from #57951. Operators relying on this flag for latency isolation should re-validate — https://github.com/vllm-project/vllm/issues/60476

## 3. New Model & Hardware Support

- **Ampere/Ada support for Inkling 2 family** (#69165, PR): `Inkling2ForConditionalGeneration` and `Inkling2LoopForConditionalGeneration` gated to run on SM80/SM86/SM89, reusing the existing Triton paths from Hopper/SM12x — https://github.com/vllm-project/vllm/pull/69165
- **2-bit KV-cache quantization ("Kitty")** (#68945, WIP PR): `--kv-cache-dtype kitty` with a dedicated attention backend; values and most key channels at 2 bits, selected key channels dynamically boosted to 4 bits — https://github.com/vllm-project/vllm/pull/68945
- **Mamba2 NVFP4 via Marlin** (#66675, PR): Marlin selected for ModelOpt NVFP4 Mamba2 projections on SM120/SM121 with Bolt-specific decode/prefill tuning — https://github.com/vllm-project/vllm/pull/66675
- **ViT full CUDA graph tracker** (#38175): RFC for capturing the full ViT forward pass in CUDA graphs for Qwen3-VL, Qwen3.5, GLM-V, Kimi K2.5 — https://github.com/vllm-project/vllm/issues/38175
- **Rust frontend parity roadmap** (#44280): the Rust frontend (`VLLM_USE_RUST_FRONTEND=1`) is a drop-in Python API server alternative but still experimental — https://github.com/vllm-project/vllm/issues/44280

## 4. Performance & Optimization

- **Qwen3.8-2.4T-A95B on MI355X/gfx950** (#57149): AMD's stacked-PR optimization plan for Quark MXFP4 — https://github.com/vllm-project/vllm/issues/57149
- **Qwen3.8-Flash-Next on MI355X/gfx950** (#59575): GatedDeltaNet (36 layers), QuerySparse Attention (12 layers), HyperConnection gated residual, MXFP4 MoE — https://github.com/vllm-project/vllm/issues/59575
- **Muse Spark 816B-A42B PTPC-FP8 on gfx942** (#64018): ROCm performance tracker — https://github.com/vllm-project/vllm/issues/64018
- **DP8 vs TP8 for single-KV-head MLA** (#51454): on 8×B200 serving DeepSeek-V4-Flash-0731 (304B/13B active, 1M ctx), DP8 delivers **7.7× KV capacity and 3.4× faster 1M-context TTFT at concurrency 8** vs TP8 — https://github.com/vllm-project/vllm/issues/51454
- **K/V cache view re-derivation in Triton/eager attention backends** (#64572): views are recomputed on every attention call despite depending only on storage/shape/strides — same class as #59534 (FlashAttention) — https://github.com/vllm-project/vllm/issues/64572
- **Batch-invariant Qwen3-30B FP8 MoE tuning on Blackwell** (#69184, PR): new Triton fused MoE config for TP=1, extending #63627 (BF16) and #66711 (FP8 on L4) — https://github.com/vllm-project/vllm/pull/69184
- **FA2 split-KV decode for sliding-window layers and spec-decode verify** (#67649, PR) — https://github.com/vllm-project/vllm/pull/67649
- **KV offload re-queueing stall** (#62532, RFC): 1.0–1.8s stalls for completed async KV pulls; proposal is front-of-queue re-admission — https://github.com/vllm-project/vllm/issues/62532

## 5. Stability & Regressions

Ranked by severity:

1. **DeepSeek-V4.1-Flash on SM120: extremely low decode throughput with `--enforce-eager`, CUDA graphs unusable** (#56892, 8× RTX PRO 6000 Blackwell, TP8). Highest-impact open bug; SM120 graph capture fix requested as priority — https://github.com/vllm-project/vllm/issues/56892
2. **ModelOpt NVFP4 on SM120 dies or wedges under sustained load with CUDA graphs** (#52540) — not the NVFP4 GEMM backend; 2× RTX PRO 6000 Blackwell — https://github.com/vllm-project/vllm/issues/52540
3. **Kimi-K3 CUDA graph capture silently corrupts output at batch=1** (#52531) — three distinct failure modes across cudagraph modes; silent correctness bug — https://github.com/vllm-project/vllm/issues/52531
4. **HF3FS KV connector reports failed loads as finished and never returns failed block IDs** (#69058) — scheduler treats failed blocks as prefix-cache hits and generates over invalid GPU blocks — https://github.com/vllm-project/vllm/issues/69058
5. **ROCm gfx942 engine hangs mid-step during CPU KV offload copies** (#64549, GLM-5.3, v0.32.0, bare metal and SR-IOV) — https://github.com/vllm-project/vllm/issues/64549
6. **DGX Spark / GB10 engine startup collapses host memory** (#56824) — `NV_ERR_NO_MEMORY` while MemAvailable reports ~22 GiB — https://github.com/vllm-project/vllm/issues/56824
7. **No working block size on v0.32.0 release tag (64 and 128 both fail)** (#59203, CLOSED; fix tracked in #60762) — https://github.com/vllm-project/vllm/issues/59203
8. **DeepSeek V4 Flash upgrade failure 0.26.0 → 0.27.0** (#51758, stale) — https://github.com/vllm-project/vllm/issues/51758
9. **`libcudart.so.13` ImportError** (#52300, stale, CUDA 12.6 + vLLM 0.21.0) — https://github.com/vllm-project/vllm/issues/52300
10. **CUTLASS int8 w8a8 claims SM100+ support but dispatches nullptr** (#54316, PR fixing #54311) — blocks Triton fallback — https://github.com/vllm-project/vllm/pull/54316

Fix PRs in flight: #54316 (int8 CUTLASS gating), #63874 (FlashInfer one-sided workspace teardown), #62916 (KV connector engine-ID sync across PCP ranks), #69140 (Gemma3n sparsity quantile precompute), #69143 (Nemotron diffusion prompt logprobs).

## 6. What This Means for Application Developers

- **SM120/Blackwell workstation deployments are not yet production-safe for graph mode** with DeepSeek-V4.1-Flash and ModelOpt NVFP4 models. If you're on RTX PRO 6000 Blackwell, validate output correctness at batch=1 and consider `--enforce-eager` only as a correctness fallback, not a throughput one.
- **KV connector failures can be silent.** The HF3FS bug (#69058) means a failed remote KV load may be treated as a cache hit — if you run disaggregated prefill or KV offloading in production, add end-to-end output validation rather than trusting scheduler-side success signals.
- **DP8 outperforms TP8 for MLA models at long context** (#51454): 3.4× faster 1M-token TTFT at c=8 on 8×B200. Worth benchmarking for your own 1M-context workloads before defaulting to TP.
- **Gateway integration is maturing**: `vllm.Render` gRPC (chat/completions/Responses/Anthropic Messages, derender support) is being built specifically for gateway sidecars like llm-d (#65503, #67652) — relevant if you front vLLM with an LLM gateway and do tokenization/rendering outside the engine.
- **Quantization format churn ahead**: the Marlin→Humming migration and the Kitty 2-bit KV-cache PR mean quantization config compatibility will shift. Pin your vLLM version and re-validate quantized deployments on upgrade rather than tracking `main`.
- **RL post-training frameworks carry monkey patches against vLLM** (#68777 tracks these); if you integrate vLLM into RL pipelines, expect private-API dependencies to break across minor versions until the tracked patches land upstream.

</details>

<details>
<summary><strong>SGLang</strong> — <a href="https://github.com/sgl-project/sglang">sgl-project/sglang</a></summary>

# SGLang Digest — 2026-11-22

## 1. Today's Highlights

No new releases in the last 24h, but the repo is active on the stability front: the SGLang 1.0 Release Tracker (#50045) is progressing as a "stability release" focused on hardening and explicit configuration errors. A notable correctness concern surfaced around `--mamba-ssm-dtype bfloat16` degrading long-reasoning accuracy on Qwen3.5-9B (#51531), and a PD-disaggregation bug where reusing a live `bootstrap_room` can return another request's output with HTTP 200 (#51980) — a serious multi-tenant correctness issue. On the performance side, AMD-focused Kimi-K3/K2.5 kernel fusion work continues via AITER/FlyDSL, and diffusion cold-start reduction is being proposed as an RFC.

## 2. Releases & Breaking Changes

No new releases in the last 24h.

However, the **SGLang 1.0 Release Tracker** (#50045) is worth flagging: it describes a compatibility policy for the 1.x series and warns that upgrading from 0.5.x may require changes (upgrade notes included). The focus is replacing silent configuration changes with errors that name the offending setting — expect stricter config validation on the path to 1.0. https://github.com/sgl-project/sglang/issues/50045

An in-progress refactor renames Kimi-K3 ROCm AITER and radix-4 top-k env vars to `SGLANG_OPT_HIP_K3_*` (PR #51240), with old names retained via aliases — no immediate breakage. https://github.com/sgl-project/sglang/pull/51240

## 3. New Model & Hardware Support

- **sm_120 (RTX 50-series consumer Blackwell)**: An open bug (#49209) reports that no model runs out-of-the-box with the CUDA 13 wheel install on sm_120 — relevant for anyone targeting consumer Blackwell. https://github.com/sgl-project/sglang/issues/49209
- **DSPARK SM120 decode dispatch**: A fix (PR #33407, closed) addresses non-instantiated topk width crashes on sm_120, with reproductions on 8× RTX 5090. https://github.com/sgl-project/sglang/pull/33407
- **Gemma 4 unified config**: A fix (PR #34420, closed) loads official `Gemma4UnifiedConfig` classes instead of substituting the older `Gemma4Config` alias, correcting audio/vision section reconstruction. https://github.com/sgl-project/sglang/pull/34420
- **MiniMax-M3 on Ascend**: A closed bug (#40735) notes incorrect routing of Ascend FuseEP through the normal MoE path. https://github.com/sgl-project/sglang/issues/40735
- **AMD Kimi-K3/K2.5**: Continued ROCm kernel work — KDA target verify via AITER fused FlyDSL (#48701), MLA value projection fused with MXFP4 output quantization (#33873), and MLA projection + RoPE + KV-cache write fusion (#32935).

## 4. Performance & Optimization

- **Diffusion cold start RFC** (#51383, highest-priority): Proposes reducing cold start to ~20s for diffusion models (MiniMax-H3 from 80s → 20s), with the same PRs applicable to Wan 2.1 and LTX-2.5. https://github.com/sgl-project/sglang/issues/51383
- **JIT kernel regression tracking** (PR #52132): Nightly JIT kernel benchmark baselines with per-PR regression reports, following up on marker records from #51030. https://github.com/sgl-project/sglang/pull/52132
- **AMD Kimi-K3 perf series** (open PRs): Fused MLA value projection + MXFP4 quantization (#33873), Quark FP8 KDA in-proj/MLA absorb on FP8 kernels (#44362), AITER MoE sort from radix-4 router launch (#43126), and gfx950 KDA prefill extend on AITER Gluon `chunk_kda` (#47036).
- **MTP draft memory accounting fix** (PR #35996, closed): Dedup of draft `embed_tokens`/`lm_head` previously ran after KV pool sizing, leaving ~2.5GB VRAM unused on a 27B-class model after startup. https://github.com/sgl-project/sglang/pull/35996
- **Custom all-reduce peer mapping** (PR #52173, open): Maps each peer graph-input allocation once at registration to handle expandable segments crossing allocation boundaries. https://github.com/sgl-project/sglang/pull/52173
- **Mamba2 `_chunk_scan_fwd_kernel` JIT stall** (#51628): Compiles during serving on NemotronH (1.45s per compile, 2–3× per rank), stalling first large prefills — pre-compilation at engine init is the implied fix. https://github.com/sgl-project/sglang/issues/51628

## 5. Stability & Regressions

Ranked by severity:

1. **PD disaggregation cross-request output leak** (#51980, OPEN): A decode request reusing a live `bootstrap_room` receives another request's output with HTTP 200 — a correctness and potential data-isolation issue in multi-tenant P/D deployments. Follow-up to #40125. https://github.com/sgl-project/sglang/issues/51980
2. **Mamba SSM dtype accuracy regression** (#51531, OPEN): `--mamba-ssm-dtype bfloat16` costs ~8 points on long-reasoning MATH-500 with Qwen3.5-9B (float16 unaffected); GSM8K-style checks miss it. Measured on v0.5.23, state-dtype handling unchanged on main as of cb97061. https://github.com/sgl-project/sglang/issues/51531
3. **Hybrid-GDN speculative state memory blowup** (#51175, OPEN): Speculative state reservation scales with draft length; a block-16 draft does not fit on 72 GB with a 27B hybrid-GDN target. https://github.com/sgl-project/sglang/issues/51175
4. **Diffusion host-pin OOM** (#51188, OPEN): MiniMax-H3 on 24 GB GPU + 32 GB host gets OOM-killed by host pin budget, yet the server still reports ready and returns 503. https://github.com/sgl-project/sglang/issues/51188
5. **NPU silent truncation** (#50443, OPEN): Qwen3.8-27B output truncated to 1 token when KV pool is smaller than input length (hybrid model, 128K on A2 32GB). https://github.com/sgl-project/sglang/issues/50443
6. **Prefill CUDA graph memory starvation** (#40094, CLOSED): ~1.8 GB reserved by prefill CUDA graph competes with quantized-KV dequant workspace on small cards; server starts but stalls at long context while reporting 100% GPU utilization. https://github.com/sgl-project/sglang/issues/40094
7. **HiRadixCache TP-deadlock** (#28429, CLOSED): `writing_check` short-circuits before `all_reduce` when local `ongoing_write_through` is empty, causing divergent write_backup/load_back enqueue decisions. https://github.com/sgl-project/sglang/issues/28429
8. **`fused_hc_head` wrong result** (#51106, CLOSED): Incorrect when `hc_mult` is not a power of 2 due to `next_power_of_2` masking in the kernel. https://github.com/sgl-project/sglang/issues/51106
9. **Triton fused-MoE illegal memory access** (#40623, CLOSED): `flashinfer_megamoe` + EAGLE speculative decoding on GLM-5.2-NVFP4 sm_107 produced CUDA illegal memory access. https://github.com/sgl-project/sglang/issues/40623
10. **DeepSeek-V4-Flash concurrency corruption** (#33397, CLOSED): Progressive output corruption under concurrency on 2× H200 with dsv4 + DP attention. https://github.com/sgl-project/sglang/issues/33397

CI health: the tracking issue (#17050) reports 1 broken, 3 flaky, 981 recently fixed as of 2026-11-22 00:14 UTC. The CUDA Coredump Tracker (#26340) remains the highest-comment thread at 388 comments. https://github.com/sgl-project/sglang/issues/17050

## 6. What This Means for Application Developers

- **Audit P/D disaggregation deployments for request isolation.** #51980 means a recycled `bootstrap_room` can return another user's output with a 200. If you run disaggregated prefill/decode in multi-tenant settings, pin room allocation or hold off until a fix lands.
- **Don't blindly set `--mamba-ssm-dtype bfloat16`.** The ~8-point MATH-500 drop on Qwen3.5-9B is invisible to GSM8K-style smoke tests. Validate accuracy on your own long-reasoning evals before adopting it.
- **Expect stricter config validation on the 1.0 path.** Silent config changes are being converted to named errors; budget time for upgrade-related config fixes when moving from 0.5.x.
- **Diffusion cold start is improving.** The ~20s cold-start RFC (MiniMax-H3, Wan 2.1, LTX-2.5) matters if you autoscale diffusion endpoints — shorter cold starts mean less pre-warming infrastructure.
- **Watch memory headroom on hybrid models.** Speculative state reservation on hybrid-GDN targets (#51175) and prefill CUDA graph reservation (#40094) can both cause non-obvious OOMs or stalls on constrained GPUs; size KV pools and draft lengths conservatively.
- **sm_120 consumer Blackwell remains rough.** The CUDA 13 wheel does not run models out-of-the-box on RTX 50-series; validate your target hardware before committing to it for production.

</details>

<details>
<summary><strong>llama.cpp</strong> — <a href="https://github.com/ggml-org/llama.cpp">ggml-org/llama.cpp</a></summary>

# llama.cpp Digest — 2026-11-22

## 1. Today's Highlights

A dense release window (b12611–b12622) landed a large SYCL push (fused RMS_NORM, IQ4 reorder, gated_delta_net kernel), a model-level fix for `.scale` tensor handling, and new multimodal support for Kyutai Hibiki real-time duplex. Meanwhile, **Inkling 2 / `inkling2_loop`** dominated both issues and PRs: scale-pass ordering bugs, tensor-split support, DSpark speculative decoding, and Flash Attention bias work are all converging around this architecture. Multi-GPU and long-context behaviors remain the riskiest area, with active regressions on speculative decode and SYCL MoE prefill.

---

## 2. Releases & Breaking Changes

- **b12622 — Model loader applies `.scale` tensors automatically** ([release](https://github.com/ggml-org/llama.cpp/releases)). Removes internal `_s` overload of `build_moe_ffn` and `build_lora_mm_id`'s `w_s` argument, moving precision handling to `llama_prec_policy`. **Breaking for out-of-tree model code** that called these internal APIs directly; downstream forks (e.g. `unslothai/llama.cpp`) will need to rebase.
- **b12611 — `inkling2_loop` shares loop slots after the scale pass** ([#32704](https://github.com/ggml-org/llama.cpp/issues/32704)). Fixes NVFP4 experts running without per-tensor scales, but reorders the load path; relevant to anyone consuming `load_arch_tensors` hooks.
- No CLI or server config changes in this window.

---

## 3. New Model & Hardware Support

- **Kyutai Hibiki real-time full-duplex** via `mtmd` ([b12619](https://github.com/ggml-org/llama.cpp/releases)). Includes Metal fusion checks (5 RMS_NORM+MUL fusions verified in the new arch).
- **Inkling 2 / `inkling2_loop` ecosystem**:
  - DSpark speculator support ([#32218](https://github.com/ggml-org/llama.cpp/pull/32218), open).
  - Tensor split (`-sm tensor`) — KV split, attn/ffn mirrored ([#32751](https://github.com/ggml-org/llama.cpp/pull/32751), open).
  - Compact bias on FLASH_ATTN_EXT across CUDA/ROCm/Vulkan ([#32740](https://github.com/ggml-org/llama.cpp/pull/32740), open) — without it, FA silently degrades to a non-FA route.
- **MiniCPM5 MoE** GGUF inference support ([#32644](https://github.com/ggml-org/llama.cpp/pull/32644), open).
- **Nemotron 3.6 Academia** — looped hybrid GDP + dense attention + MLP, with shared recurrent weights and `per_loop` conditioning ([#32766](https://github.com/ggml-org/llama.cpp/pull/32766), open).
- **Quantization formats**: IQ4_NL / IQ4_XS weight reorder on SYCL ([b12618](https://github.com/ggml-org/llama.cpp/releases)); IQ3_S and IQ2_S AVX-512 vec_dot kernels (CPU, x86-64 only) ([#32774](https://github.com/ggml-org/llama.cpp/pull/32774), [#32775](https://github.com/ggml-org/llama.cpp/pull/32775)).

---

## 4. Performance & Optimization

**Landed (this release window):**

- **SYCL (b12622–b12620, b12615)**:
  - Bounded `CONV_TRANSPOSE_1D` input iteration on Arc Pro B70 / oneAPI 2026.1 ([b12621](https://github.com/ggml-org/llama.cpp/releases)).
  - Column-blocked `gated_delta_net` kernel ([b12617](https://github.com/ggml-org/llama.cpp/releases)).
  - Fused **ADD + RMS_NORM + MUL** with vectorized RMS norm ([b12615](https://github.com/ggml-org/llama.cpp/releases)).
- **Vulkan (b12613–b12612)**:
  - Unrolled FA coopmat1 array to work around an **AMD Windows driver bug** ([b12613](https://github.com/ggml-org/llama.cpp/releases)).
  - Improved **RDNA4 MMVQ** rows for Q3_K, Q5_K, IQ4_XS on the AMD proprietary driver ([b12612](https://github.com/ggml-org/llama.cpp/releases)).
- **CPU**: new memory access pattern in `ggml_compute_forward_mul_mat_one_chunk` ([b12620](https://github.com/ggml-org/llama.cpp/releases)).
- **AVX-512 iq3_s** (`-march=native`, Xeon Platinum 8573C, n=2816): reported best-of-5 at ~? µs vs AVX2 fallback (numbers in PR) ([#32774](https://github.com/ggml-org/llama.cpp/pull/32774)); iq2_s AVX-512 intrinsics also landed as a separate PR ([#32775](https://github.com/ggml-org/llama.cpp/pull/32775)).
- **Inkling 2 DSpark measured** (16 GB card, long context): after fixing q4 draft KV + graph-rebuild cost + adaptive pausing, a fixed 4-token draft runs **80 tok/s on code vs 47.6 tok/s without speculation** ([#32773](https://github.com/ggml-org/llama.cpp/pull/32773)).
- **Vulkan CONV_2D/3D** shared-memory tiling with halo + split_k overhaul ([#32629](https://github.com/ggml-org/llama.cpp/pull/32629), open).

**In flight:**

- **CUDA/HIP/Vulkan Flash Attention bias** for Inkling 2 ([#32740](https://github.com/ggml-org/llama.cpp/pull/32740)).
- **HIP MMQ** on non-WMMA archs ([#32266](https://github.com/ggml-org/llama.cpp/pull/32266)).
- **Quantize target-size / target-bpw** auto-tuning across mixed quant types ([#15550](https://github.com/ggml-org/llama.cpp/pull/15550)).

---

## 5. Stability & Regressions

Ranked by severity (highest first):

| # | Severity | Issue | Status |
|---|----------|-------|--------|
| 1 | **Critical** | [inkling2_loop: perplexity = NaN on CUDA](https://github.com/ggml-org/llama.cpp/issues/32710) — reproduced on b12600 and master; specifically called out as blocking | Fix candidate in [#32704](https://github.com/ggml-org/llama.cpp/issues/32704); testers report it works on top of master |
| 2 | **Critical** | [Qwen3.8-27B (hybrid Gated DeltaNet): ~25× decode collapse beyond ~80K context](https://github.com/ggml-org/llama.cpp/issues/27623) — prompt processing fine, decode falls off a cliff. Linux/WSL2 + RTX 4080 SUPER | Open, no fix PR |
| 3 | **High** | [CUDA ADD/GELU slower on B200 since PDL commit](https://github.com/ggml-org/llama.cpp/issues/30004) — first bad `7b28f950` | Open |
| 4 | **High** | [Draft-MTP halves prompt processing on multi-GPU layer split (single GPU fine)](https://github.com/ggml-org/llama.cpp/issues/27428) — RTX 4090 ×2, CUDA 12.0 | Open since August |
| 5 | **High** | [Inkling 2 IQ4_NL prefill abominably slow + crashes on RTX 5090](https://github.com/ggml-org/llama.cpp/issues/32707) | Open |
| 6 | **High** | [DFlash/MTP emits OOB token id == n_vocab (248320) on Vulkan gfx1150](https://github.com/ggml-org/llama.cpp/issues/28158) | Open |
| 7 | **High** | [SYCL: XMX-ESIMD path makes MoE prompt processing ~35% slower on Arc Pro B70](https://github.com/ggml-org/llama.cpp/issues/31068) — regression in `d81d0d8fb` | Open |
| 8 | **Medium** | [Q8_0 dot product sign error when int8 operand = -128 (non-VNNI mul_sum_i8_pairs_float)](https://github.com/ggml-org/llama.cpp/issues/29351) | Closed/stale; unclear if fixed |
| 9 | **Medium** | [Flash attention garbage output at long context on gfx1201 (RDNA4), head_dim 256](https://github.com/ggml-org/llama.cpp/issues/30884) | Open |
| 10 | **Medium** | [Vulkan FLASH_ATTN_EXT wrong results on MoltenVK 1.4.2 + AMD RDNA1](https://github.com/ggml-org/llama.cpp/issues/30166) — Intel Mac + AMD eGPU | Closed/stale; verify on re-open |
| 11 | **Medium** | [DFlash spec fails with `--split-mode tensor` (shared output.weight in Meta buffer)](https://github.com/ggml-org/llama.cpp/issues/27833) | Open |
| 12 | **Medium** | [HIP: `CU_CHECK(err)` in VMM pool lets `cuMemAddressReserve` spin forever](https://github.com/ggml-org/llama.cpp/issues/32105) | Open |
| 13 | **Medium** | [Segfault after upgrading hip-runtime-amd to 10.1-2.1, RX 9070 XT](https://github.com/ggml-org/llama.cpp/issues/32630) | Open |
| 14 | **Low** | [llama-server Web UI: `effect_update_depth_exceeded` at Chrome font-size ≥ 24](https://github.com/ggml-org/llama.cpp/issues/32361) | Open |
| 15 | **Low** | [llama-server (RPC client) occasionally ignores SIGTERM after long sessions](https://github.com/ggml-org/llama.cpp/issues/29933) | Closed/stale |
| 16 | **Low** | [json-schema-to-grammar: `enum`/`const` discards sibling constraints](https://github.com/ggml-org/llama.cpp/issues/30750) | Open — grammar-level correctness for structured output |

**Notable correctness-adjacent fixes landed:** SYCL CONV_TRANSPOSE bound (b12621), Vulkan DIAG/TRI FP16 zero `D_TYPE(0.0)` ([#32379](https://github.com/ggml-org/llama.cpp/pull/32379)), WebGPU/Vulkan nonzero clear writes 32-bit words not bytes ([#32727](https://github.com/ggml-org/llama.cpp/pull/32727)).

---

## 6. What This Means for Application Developers

- **Do not deploy `inkling2_loop` on CUDA yet.** The NaN perplexity issue ([#32710](https://github.com/ggml-org/llama.cpp/issues/32710)) is unresolved on master; if you must, pin to master + #32704 and rerun your KLD/eval suite before trusting outputs. The scale-pass reorder in b12622 changes numerics subtly.
- **Hybrid Gated DeltaNet + long context is not production-safe.** The ~25× decode collapse past ~80K ([#27623](https://github.com/ggml-org/llama.cpp/issues/27623)) means any agent workload with >80K-token histories on that family needs a hard context cap or a different backend.
- **Speculative decode remains split-dependent.** `-sm layer` + draft-MTP halves prefill ([#27428](https://github.com/ggml-org/llama.cpp/issues/27428)); `-sm tensor` + DFlash hits a shared-weight-buffer bug ([#27833](https://github.com/ggml-org/llama.cpp/issues/27833)). Single-GPU is currently safe; multi-GPU needs testing per-model.
- **Speculative decode is worth revisiting for Inkling 2 DSpark** on 16 GB cards: measured **80 tok/s vs 47.6 tok/s** on code after the q4 draft-KV + graph-rebuild + adaptive-pause fixes ([#32773](https://github.com/ggml-org/llama.cpp/pull/32773)) — a genuine ~1.7× decode win at long context.
- **RDNA4 + Vulkan users on Windows**: keep FA coopmat1 unrolled (b12613) and pick Q3_K/Q5_K/IQ4_XS with default MMVQ rows (b12612) — the proprietary AMD driver needs both.
- **Server embedders**: `/embedding` with `--pooling none` still lacks per-span mean pooling ([#32587](https://github.com/ggml-org/llama.cpp/issues/32587)); plan accordingly if you rely on sub-token pooling groups.
- **Structured output / grammars**: `enum`/`const` sibling-constraint handling is still wrong ([#30750](https://github.com/ggml-org/llama.cpp/issues/30750)). If you depend on strict JSON Schema validation, keep a post-hoc validator in the path.
- **Server ops**: SIGTERM-handling flakiness over long agent sessions ([#29933](https://github.com/ggml-org/llama.cpp/issues/29933)) means orchestrators should use `SIGKILL` fallback with a grace timeout, especially with RPC backends.
- **Build hygiene**: b12622 removes internal `w_s`/`_s` overloads — rebase any fork that patched `build_moe_ffn` or `build_lora_mm_id`.

</details>

<details>
<summary><strong>Ollama</strong> — <a href="https://github.com/ollama/ollama">ollama/ollama</a></summary>

# Ollama Digest — 2026-11-22

## 1. Today's Highlights

No new releases in the last 24 hours, but issue and PR activity is dominated by **Inkling 2 (Thinking Machines Lab) support gaps** — GGUF loading on Windows is blocked on a `LLAMA_CPP_VERSION` bump, while MLX users hit prefix-cache eviction and re-prefill costs past ~64k tokens. Separately, a cluster of long-running parser correctness PRs (thinking budgets, tool-call truncation, leaked close tags) continues to mature, and VRAM accounting/splitting fixes remain in review. Security/trust threads (Ollama Cloud ZDR vs. cached-input pricing, third-party inference exposure) also drew fresh comments.

## 2. Releases & Breaking Changes

None. No releases published in the last 24h. Note for planning: PR [#17566](https://github.com/ollama/ollama/pull/17566) proposes changing the semantics of the `think` parameter (reasoning level vs. token budget split into separate settings) — a potential API-visible change if merged.

## 3. New Model & Hardware Support

- **Inkling 2 Mini (26B) GGUF on Windows is blocked** — unknown architecture `inkling2_loop`/`inkling2` and projector `inkling2v`; ollama.com only ships MLX variants today. ([#19817](https://github.com/ollama/ollama/issues/19817), closed)
- **Upstream llama.cpp now registers `inkling2`/`inkling2_loop`** (merged Nov 21); Ollama's `LLAMA_CPP_VERSION` is still pinned at `b12257` (Nov 10). A version-bump PR is the unblock path. ([#19826](https://github.com/ollama/ollama/issues/19826))
- **Multi-file (split) GGUF import** — long-standing request ([#5245](https://github.com/ollama/ollama/issues/5245), 165 👍) now has an implementation PR: `FROM model-00001-of-00002.gguf` resolves sibling shards. ([#19825](https://github.com/ollama/ollama/pull/19825))
- **Apple M4 Max MLX relative-attention kernels** — reports same `applegpu_g16s` arch as M4 Pro but is missing from `supportsRelativeAttentionPrefill` / `relativeAttentionSplitParts` device lists. ([#19820](https://github.com/ollama/ollama/issues/19820))
- **Jetson AGX Orin (JetPack 6)** — request to build the runner with `GGML_CUDA_NO_VMM=ON`; vision requests crash in `clip_encode` VMM pool reservation. ([#19815](https://github.com/ollama/ollama/issues/19815))

## 4. Performance & Optimization

- **MLX prefix cache fully evicted past ~64k tokens on Inkling 2** — relative-attention prefill peak grows with context, so every turn re-prefills the whole conversation. ([#19819](https://github.com/ollama/ollama/issues/19819))
- **Inkling 2 prefix cache recomputes up to 2k tokens/turn** — `AlignPrefillToSnapshots` forces restore offsets to match cold-prefill batch splits; routed low-precision experts batch-width dependent. ([#19818](https://github.com/ollama/ollama/issues/19818))
- **VRAM accounting & GPU splitting fixes** — addresses models incorrectly evicted, refusing to load, or unnecessarily spread across GPUs (issues #19463, #18679, #18349, #16599). ([PR #19632](https://github.com/ollama/ollama/pull/19632))
- **Windows sysmem fallback** — models exceeding physical VRAM spill ~13.9 GB into shared memory on RTX 3050 despite `Prefer No Sysmem Fallback`. ([#19824](https://github.com/ollama/ollama/issues/19824), closed)
- **Split llama-server log lines** — buffer incomplete log lines before parsing memory/layer accounting, to avoid misreported VRAM/offload values. ([PR #19215](https://github.com/ollama/ollama/pull/19215))

## 5. Stability & Regressions

Ranked by severity:

1. **Vision requests crash on Jetson AGX Orin** — CUDA OOM in `cuMemAddressReserve` (VMM pool) inside `clip_encode`; text-only works. ([#19815](https://github.com/ollama/ollama/issues/19815))
2. **Windows `/api/embed` returns 400** — server-side POST to bundled `llama-server` on a high loopback port is refused (connectex) with `embeddinggemma`. ([#19782](https://github.com/ollama/ollama/issues/19782))
3. **Qwen3.5 parser ends thinking early** — a `` written as plain text tokens (not the special token) is parsed as a real close tag, truncating reasoning mid-sentence. ([#19829](https://github.com/ollama/ollama/issues/19829))
4. **Tool-call/thinking parser defects (open PRs)** — partial-tag check ordering lets tool calls open before thinking channel closes ([#18624](https://github.com/ollama/ollama/pull/18624)); unmatched thinking close tags leak into content ([#18288](https://github.com/ollama/ollama/pull/18288)); truncated tool calls handed to callers ([#17564](https://github.com/ollama/ollama/pull/17564)); missing closing brace recovery ([#17565](https://github.com/ollama/ollama/pull/17565)); reasoning budget cuts mid-word ([#18212](https://github.com/ollama/ollama/pull/18212)); assistant thinking not sent to chat template ([#18281](https://github.com/ollama/ollama/pull/18281)).
5. **Vulkan on Intel Iris Xe regression** — `qwen2.5:14b` fails KV cache allocation on 0.33.3/0.34.2, works on 0.32.6. ([#18531](https://github.com/ollama/ollama/issues/18531), closed)
6. **Silent CPU projector offload on OOM** — `llamaServerRunner.Load()` retries via `retryWithMMProjCPUOffload()`, hiding unexpected placement; users want opt-in hard failure. ([#19759](https://github.com/ollama/ollama/issues/19759))

## 6. What This Means for Application Developers

- **Agent/coding pipelines**: parser fixes in flight are directly relevant if you run Qwen3/Qwen3.5, Gemma 4, or Qwen3-Coder locally — truncated tool calls, dropped closing tags, and premature thinking termination are partial-token-boundary bugs, not model quality issues. Pin a version and watch PRs #17914, #18288, #18624, #17564.
- **Long-context workloads on Apple Silicon (MLX)**: Inkling 2 past ~64k tokens currently re-prefills every turn; budget for latency/cost or keep contexts smaller until #19819/#19818 land.
- **Inkling 2 GGUF users on Windows**: blocked pending a `LLAMA_CPP_VERSION` bump (#19826). MLX works; GGUF does not yet.
- **`/v1` OpenAI-compat users**: `qwen3` thinking cannot be disabled via `/no_think` or `reasoning_effort` — plan around it or use the native API. (#17969, closed)
- **Embeddings on Windows**: `/api/embed` may 400 on recent builds; have a fallback client path. (#19782)
- **CI/agents**: a `--no-animation` / `--no-animation`-style flag is in flight to stop spinner frames polluting stderr logs. (#19828, PR #19830)
- **Security-conscious deployments**: exposure hardening (TLS + API key auth) is still an open request (#14003), and questions remain about Ollama Cloud ZDR vs. third-party inference providers (#17489, #19823) — relevant if you route sensitive data through cloud endpoints.

</details>

<details>
<summary><strong>LiteLLM</strong> — <a href="https://github.com/BerriAI/litellm">BerriAI/litellm</a></summary>

# LiteLLM Digest — 2026-11-22

## 1. Today's Highlights

LiteLLM continues to ship on two tracks: a `v1.112.0-dev.2` dev build and an LTS patch line (`v1.108.15`), with the project now emphasizing signed Docker images via `cosign` for supply-chain verification. The bulk of today's activity is a large redaction/privacy hardening stack (the `#43697` split into 5 PRs) plus a wave of LTS backports for Bedrock, Azure AI, and Anthropic `/v1/responses` billing. Meanwhile, a broad set of provider-translation bugs — from Gemini thought images to OpenRouter reasoning chunks to watsonx streaming usage — remain open or freshly closed.

## 2. Releases & Breaking Changes

- **`v1.112.0-dev.2`** — dev release; note the new `cosign verify` requirement for Docker image provenance. [Release](https://github.com/BerriAI/litellm/releases)
- **`v1.108.15` (LTS)** — The `ghcr.io/berriai/litellm:lts` tag now tracks the latest LTS patch; downstream deployments pinned to `lts` will auto-upgrade. [Release](https://github.com/BerriAI/litellm/releases)
- **Pending behavior change (not yet user-visible):** PR stack [#49377](https://github.com/BerriAI/litellm/pull/49377), [#49378](https://github.com/BerriAI/litellm/pull/49378), [#49379](https://github.com/BerriAI/litellm/pull/49379), [#49380](https://github.com/BerriAI/litellm/pull/49380), [#49381](https://github.com/BerriAI/litellm/pull/49381) will scrub prompt text from failure logs when message redaction is enabled. No runtime change yet — review if you have log-parsing tooling.
- **LTS backports landing (config-sensitive):**
  - Azure audio transcriptions now honor the deployment's `api_version` from `config.yaml`: [#53402](https://github.com/BerriAI/litellm/pull/53402).
  - `azure_ai` chat on the 1.108 LTS line fixes Foundry project / `/openai/v1` routing: [#53409](https://github.com/BerriAI/litellm/pull/53409).
  - Timeout semantics change for 42 providers using the shared httpx handler — split connect/read/write/pool timeouts are now preserved: [#53391](https://github.com/BerriAI/litellm/pull/53391).

## 3. New Model & Hardware Support

- **Gemini Live Avatar** — Feature request closed for `avatar_config` / `customized_avatar` in realtime Gemini/Vertex integration, matching GA of Gemini 3.8 Live with Live Avatar. [#43166](https://github.com/BerriAI/litellm/issues/43166)
- **Vertex Claude Haiku 5.5 structured output** — Open bug: the Vertex model map lacks `supports_native_structured_output`, so `response_format: json_schema` silently falls back to an unforced JSON tool. [#53478](https://github.com/BerriAI/litellm/issues/53478)
- **OpenAI / Azure Skills API routing** — Feature request closed to add native Skills API routing (skill CRUD, versioning, content retrieval) with Azure targeting. [#37074](https://github.com/BerriAI/litellm/issues/37074)
- **Ollama text-to-image** — Request closed for `litellm.image_generation(model="ollama/...")` support (x/flux2-klein etc.), which currently returns empty `ImageResponse.data`. [#28026](https://github.com/BerriAI/litellm/issues/28026)

## 4. Performance & Optimization

- **Split httpx timeouts for 42 providers** — PR [#53391](https://github.com/BerriAI/litellm/pull/53391) fixes cases like Mistral ignoring `connect=1` and waiting the full 10s read timeout. Direct latency win for provider calls under flaky connect conditions.
- **Overlong tool-call IDs in Responses↔Chat bridge** — PR [#53390](https://github.com/BerriAI/litellm/pull/53390) hashes >64-char tool-call IDs into deterministic 64-char IDs, preventing provider rejection and retry loops on replayed history.
- **Bedrock/SageMaker stream handling** — PR [#53482](https://github.com/BerriAI/litellm/pull/53482) returns 502 when a 200 AWS event stream decodes to no events (or ends mid-frame), enabling retries/fallbacks instead of silent empty responses.

## 5. Stability & Regressions

Ranked by severity:

1. **Router re-executes auto-approved MCP tools on retry** (High) — After a failed follow-up model call, retries re-run already-executed MCP tool calls. Closed; review if you rely on auto-approved MCP tool flows. [#43153](https://github.com/BerriAI/litellm/issues/43153)
2. **`stream_chunk_builder` TypeError on list-shaped `reasoning_content`** (High) — Reasoning models (GPT-style) sending `reasoning_content` as structured blocks crash the builder at end-of-stream. Closed. [#50893](https://github.com/BerriAI/litellm/issues/50893)
3. **Amazon Nova streaming 100% failure** (High) — httpx zstd decoder reuses a finished `decompressobj` on Nova's multi-frame SSE; non-streaming works. Closed. [#35589](https://github.com/BerriAI/litellm/issues/35589)
4. **Spend logs omit request/response payloads on v1.110.2** (Medium) — Regression: new spend-log rows lack content despite `store_prompts_in_spend_logs` enabled. Closed. [#53263](https://github.com/BerriAI/litellm/issues/53263)
5. **Responses→chat bridge double-logs cache hits ≥256 KiB** (Medium) — Two SpendLogs rows and two logging callbacks on cache-served responses at v1.108.0. Closed. [#52824](https://github.com/BerriAI/litellm/issues/52824)
6. **watsonx streaming usage lost** (Medium) — Proxy reports its own (undercounted) token estimate rather than the provider's, understating spend. Open. [#46059](https://github.com/BerriAI/litellm/issues/46059)
7. **OAuth `client_id` in query rejected on pass-through GET** (Medium) — Broke browser OAuth for MCP servers on v1.110.1. Closed. [#53185](https://github.com/BerriAI/litellm/issues/53185)
8. **MCP tool discovery omits auth servers without upstream credential** (Low/Medium) — Tools from `auth_type: authorization` servers disappear from `/mcp-rest/tools/list` on 1.108.11. Open. [#52849](https://github.com/BerriAI/litellm/issues/52849)
9. **Streaming drops OpenRouter `reasoning_details`-only chunks** (Low/Medium) — Anthropic signature-only chunks and encrypted reasoning content are discarded. Open. [#48401](https://github.com/BerriAI/litellm/issues/48401)
10. **Componentized startup ignores YAML DB pool settings** (Low/Medium) — Direct component entrypoints bypass pool limits/timeouts. Open. [#33021](https://github.com/BerriAI/litellm/issues/33021)

## 6. What This Means for Application Developers

- **Pin or float, knowingly.** The `lts` tag is now a moving pointer. If you rely on reproducible deploys, pin to `v1.108.15` rather than `:lts`, and add `cosign verify` to your CI if you consume the official images.
- **Mind tool-call retries with MCP.** If you had auto-approval configured for MCP tools, audit your router retry policy — issue #43153 (now fixed) may have caused duplicate side effects in production.
- **Responses API users on Anthropic/Vertex/Bedrock:** two complementary PRs ([#53419](https://github.com/BerriAI/litellm/pull/53419), [#53394](https://github.com/BerriAI/litellm/pull/53394)) fix spend accounting for client-cancelled streaming responses; if you're on 1.108 LTS, backport [#53419](https://github.com/BerriAI/litellm/pull/53419) for accurate cost attribution.
- **If you're building on reasoning models or OpenRouter:** keep an eye on #50893 (fixed) and #48401 (open) — reasoning-content handling is the most fragile surface in streaming today.
- **Azure AI and Azure audio transcription users on LTS:** plan for the routing/api_version fixes in [#53402](https://github.com/BerriAI/litellm/pull/53402) and [#53409](https://github.com/BerriAI/litellm/pull/53409); both are deployment-config-sensitive backports.
- **Privacy-sensitive deployments:** the #43697 redaction stack is landing in pieces. No action required today, but validate that your log pipeline handles `redacted-by-litellm` placeholders once parts 2–5 merge.

</details>

<details>
<summary><strong>Unsloth</strong> — <a href="https://github.com/unslothai/unsloth">unslothai/unsloth</a></summary>

# Unsloth Digest — 2026-11-22

## 1. Today's Highlights

No new releases landed in the last 24h, but the merge queue is active: **Inkling 2 (Mini and Small) LoRA/QLoRA training support** ([#18812](https://github.com/unslothai/unsloth/pull/18812)) and **AsyncGRPO tree packing for Qwen3.5/3.6/Qwen3-Next hybrids** ([#18817](https://github.com/unslothai/unsloth/pull/18817), stacked on the TRL cap lift [#18809](https://github.com/unslothai/unsloth/pull/18809)) are the highest-impact in-flight changes. Meanwhile, issue traffic is dominated by **Strix Halo / ROCm memory-management regressions** (#17605 closed, #18805 opened as a follow-up) and a cluster of **Studio model-loading failures** for Inkling-2-Mini GGUF and Qwen-Image-Edit.

## 2. Releases & Breaking Changes

No new releases in the last 24h. However, several in-flight PRs carry behavioral/config implications worth tracking:

- **TRL cap lifted from `<=1.15.0` to `1.18.2`** — [#18809](https://github.com/unslothai/unsloth/pull/18809). The old cap was never tied to a known break; AsyncGRPO tree packing requires TRL >= 1.17. Users pinning TRL should expect the resolver to move.
- **`speculative_config` now passed through to vLLM only** — [#18764](https://github.com/unslothai/unsloth/pull/18764), companion to [unsloth-zoo#2640](https://github.com/unslothai/unsloth-zoo/pull/2640). Adds general speculative decoding config (EAGLE/EAGLE3, MTP, ngram, draft model, DFlash, suffix) budgeted inside the same LoRA lookahead/memory-fitting path.
- **`UNSLOTH_MEMORY_REPORT=1` now reports host RAM on CPU backend** — [#18807](https://github.com/unslothai/unsloth/pull/18807). Previously a no-op on CPU; now prints process RSS, peak, and available RAM.

## 3. New Model & Hardware Support

- **Inkling 2 (Mini and Small) LoRA/QLoRA training** — [#18812](https://github.com/unslothai/unsloth/pull/18812). Adds training for `thinkingmachines/Inkling-2-Mini` (`inkling2_loop`) and `Inkling-2-Small` (`inkling2`), native in transformers 5.24.0. Requires companion [unsloth-zoo#2657](https://github.com/unslothai/unsloth-zoo/pull/2657) for MoE experts and an eager attention residual. **Note:** Inference-side Inkling-2-Mini GGUF loading is currently broken in Studio — see Stability section.
- **AsyncGRPO tree packing for Qwen3.5 / Qwen3.6 / Qwen3-Next** — [#18817](https://github.com/unslothai/unsloth/pull/18817). TRL 1.17+ packs AsyncGRPO rows as a prefix trie and ships tree kernels for gated DeltaNet hybrid (recurrent) layers.
- **Gemma linear RoPE scaling fix** — [#18818](https://github.com/unslothai/unsloth/pull/18818). Since transformers 4.48, `GemmaModel` builds rotary embeddings differently; when `max_seq_length` exceeds Gemma's native 8192 without `rope_scaling`, the loader logged linear scaling but Gemma/Gemma 2 trained and decoded with **unscaled** RoPE. Fix applies the loader's scaling past the native window.

## 4. Performance & Optimization

- **Full fine-tune save: cast each output shard as written** — [#18795](https://github.com/unslothai/unsloth/pull/18795) (CLOSED). `save_pretrained_merged(..., save_method="merged_16bit")` previously built a complete cast copy of the state dict before `save_pretrained` ran when dtype changed — an fp32→bf16/fp16 master put the cast copy on GPU (~+6 GB). Now streamed per-shard.
- **GRPO video: one copy per prompt, not per generation** — [#18794](https://github.com/unslothai/unsloth/pull/18794) (CLOSED). With `G=8`, the GPU held 8 identical copies of every video across the whole generation batch; `pixel_values_videos` is now deduplicated. Direct VRAM win for video GRPO.
- **Opt-in GRPO rollout tail cut for colocated vLLM** — [#18803](https://github.com/unslothai/unsloth/pull/18803) (CLOSED). Implements sufficiency-gated termination (TailRoll, arXiv 2611.22206) to stop decoding stragglers at tiny batch sizes.
- **Krea 2: denoise on valid text rows only** — [#18813](https://github.com/unslothai/unsloth/pull/18813). Carried 512 padded text rows through every block beside 4096 image rows at 1024×1024; now operates on the valid rows.
- **HiDream MoE experts run only on routed tokens** — [#18793](https://github.com/unslothai/unsloth/pull/18793) (CLOSED). The traceable `_moe_infer_dense` replacement ran every expert on every token and masked; with 2-of-4 routing, roughly half of routed-expert GEMM work was wasted.
- **Studio multi-GPU split-render activation peak fix** — [#18784](https://github.com/unslothai/unsloth/pull/18784) (CLOSED). Split renders recorded no learned activation peak, causing later loads to refuse the split and fall back to one card with the second GPU idle.
- **int8 CUTLASS race cache keyed on race code** — [#18797](https://github.com/unslothai/unsloth/pull/18797) (CLOSED). Previously hashed whole GEMM files, re-racing every int8 weight shape on any Studio update touching those files (notable on L4).
- **DiT block swap headroom from free VRAM, not total** — [#18801](https://github.com/unslothai/unsloth/pull/18801) (CLOSED). 12% was taken of the card's total VRAM, over-reserving on large shared cards.
- **Auto fp8 base for DiT LoRA on sm89+** — [#18770](https://github.com/unslothai/unsloth/pull/18770) (OPEN). `base_precision="auto"` never selected the existing frozen fp8 path; on sm89+ it chose int8 (or bf16 with block swap) at 1.15x–1.x slower.
- **FSDP2 `empty_cache` synchronization** — [#18777](https://github.com/unslothai/unsloth/pull/18777) (CLOSED). With `expandable_segments:True`, native FSDP2 `empty_cache` calls only synchronized the segment stream; fix adds a proper sync.
- **Frontend build CI timeout raised 40→55 min** — [#18816](https://github.com/unslothai/unsloth/pull/18816). Job now takes 33–40 min and was being cancelled despite passing.

## 5. Stability & Regressions

Ranked by severity:

1. **Inkling-2-Mini GGUF fails to load on latest Unsloth Studio Docker** — [#18757](https://github.com/unslothai/unsloth/issues/18757) (OPEN, 6 comments). Blocks inference for a model whose training support is landing in [#18812](https://github.com/unslothai/unsloth/pull/18812).
2. **v0.1.920-beta crashes on model load** — [#18563](https://github.com/unslothai/unsloth/issues/18563) (OPEN, 6 comments). Desktop + web UI affected.
3. **QLoRA on gfx1200 (RX 9060 XT, RDNA4) aborts with `HIP error: an illegal memory access`** in three fused kernels — [#18403](https://github.com/unslothai/unsloth/issues/18403) (OPEN). Plain PyTorch/PEFT has no SDPA kernel for this arch; ROCm-only, RDNA4-specific.
4. **Windows Strix Halo: host-shortfall check still forces mmap after carve-out fix** — [#18805](https://github.com/unslothai/unsloth/issues/18805) (OPEN). Follow-up to #17605 (now CLOSED via #17607); the fix handles `--lazy-mode on-direct` and initial Windows ROCm/Strix Halo binding, but the host-shortfall check still overrides explicit `--load-mode none`.
5. **Qwen-Image-Edit GGUF: every generation fails with device mismatch in `_adaln_continuous_forward`** — [#18759](https://github.com/unslothai/unsloth/issues/18759) (OPEN). Studio 2026.11.9; `adaln_precompute` moves modulation to host.
6. **AMD NPU (Lemonade/FastFlowLM 1.0.13) model listing fails** — [#18763](https://github.com/unslothai/unsloth/issues/18763) (OPEN). "Extra data: line 2025 column 1" — breaking change in FastFlowLM update.
7. **Cannot load fine-tuned Q5_K_M GGUF: "quantization type 36 ... this build does not have"** — [#18722](https://github.com/unslothai/unsloth/issues/18722) (OPEN). Studio v0.1.922-beta, bundled llama.cpp build 12588. Affects Qwen3.5-9B Q5_K_M exports.
8. **Decode CUDA graphs: RNG capture flag not cleared after failed capture** — [#18814](https://github.com/unslothai/unsloth/pull/18814) (OPEN, fix). On T4, Qwen3 (4B) GRPO crashes at first step with "Offset increment outside graph capture." Fix PR exists.
9. **Dual RX 6700 XT ROCm crash** — [#18622](https://github.com/unslothai/unsloth/issues/18622) (OPEN). Log attached.
10. **macOS malware-script block during update** — [#18699](https://github.com/unslothai/unsloth/issues/18699) (OPEN). "A script was blocked because it contains malware" during Unsloth update on Mac; 1 👍.
11. **Studio tests broken on `main`** — [#18815](https://github.com/unslothai/unsloth/pull/18815) (CLOSED, fix). `(Python 3.13, diffusion)` failing `test_diffusion_family_data_freeze` and `test_every_decode_rewrap_site_restores_the_o...` on all PRs based on `main`; refresh of the FastWan diffusion family freeze.

**Closed today (fixes landed):** #17605 (mmap forced despite `--load-mode none`), #18281 (localhost binding from GUI), #13094 (server stopped while embedding documents), #18690 (Inkling fails to load on 32 GB DDR5 laptop).

## 6. What This Means for Application Developers

- **Inkling 2 is a moving target.** Training support is landing (#18812) while inference-side GGUF loading is broken in Studio Docker (#18757) and on 32 GB DDR5 laptops (#18690). Don't ship Inkling-2-Mini in production paths until #18757 resolves.
- **Windows ROCm / Strix Halo users should hold off on Studio upgrades** if relying on explicit `--load-mode none` — the host-shortfall check still forces mmap (#18805), causing the excessive RAM/SSD churn that #17605 reported. The carve-out fix (#17607) is partial.
- **RDNA4 (gfx1200) QLoRA is effectively blocked** (#18403) — illegal memory access across three fused kernels, no SDPA kernel in stock PyTorch/PEFT for this arch. If you're on RX 9060 XT, use CUDA or RDNA3 for fine-tuning.
- **If you export fine-tunes to Q5_K_M, verify load before deploying** — bundled llama.cpp build 12588 in Studio v0.1.922-beta rejects quant type 36 (#18722).
- **GRPO/video and full fine-tune memory pressure is dropping significantly** via #18794 (8× video dedup), #18795 (shard-streamed save), and #18803 (tail cut). If you were hitting OOM on video GRPO or 16-bit merges, re-test on the next build.
- **Speculative decoding config is becoming first-class** through vLLM (#18764 + zoo#2640) with memory budgeting inside the LoRA lookahead path — relevant if you're serving draft-model or EAGLE-based deployments behind a gateway.
- **Studio's frontend build CI is flaky-adjacent** (#18816) — if you maintain forks, expect the timeout raise to land shortly; don't chase "cancelled" statuses on frontend jobs as failures.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*